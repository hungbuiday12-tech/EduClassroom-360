import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SubjectType } from '../types';
import { MATH_LECTURES } from '../data/curriculumData';
import { PHYSICS_LESSONS } from '../data/physicsLessonsData';

export interface NavLocation {
  subject: SubjectType;
  mathTab: 'lectures' | 'grapher' | 'geometry' | 'math3d';
  mathViewMode: 'catalog' | 'lecture';
  mathLectureId: string;
  physicsView: 'catalog' | 'lecture';
  physicsLessonId: string;
  physicsTab: 'theory' | 'simulation' | 'sim3d' | 'practice';
  csViewMode: 'curriculum' | 'judge' | 'custom';
  csSubView: 'roadmap' | 'lecture';
  csLessonId: string;
  csLessonTab: 'lecture' | 'code' | 'practice';
  examId: string | null;
  tutorOpen: boolean;
  tutorSubject: SubjectType;
}

const DEFAULT_LOCATION: NavLocation = {
  subject: 'overview',
  mathTab: 'lectures',
  mathViewMode: 'catalog',
  mathLectureId: MATH_LECTURES[0]?.id || '',
  physicsView: 'catalog',
  physicsLessonId: PHYSICS_LESSONS[0]?.id || '',
  physicsTab: 'theory',
  csViewMode: 'curriculum',
  csSubView: 'roadmap',
  csLessonId: 'cs-1',
  csLessonTab: 'lecture',
  examId: null,
  tutorOpen: false,
  tutorSubject: 'math'
};

export function getLocationLabel(loc: NavLocation, lang: 'vi' | 'en' = 'vi'): string {
  const isEn = lang === 'en';
  if (loc.tutorOpen) {
    return isEn ? 'AI Tutor' : 'Gia sư AI';
  }
  switch (loc.subject) {
    case 'overview':
      return isEn ? 'Classroom' : 'Lớp học';
    case 'roadmap':
      return isEn ? 'Study Roadmap' : 'Lộ trình học';
    case 'math':
      if (loc.mathTab === 'grapher') return isEn ? '2D Grapher' : 'Đồ thị Oxy 2D';
      if (loc.mathTab === 'geometry') return isEn ? '2D Geometry' : 'Hình học 2D';
      if (loc.mathTab === 'math3d') return isEn ? '3D Oxyz' : 'Mô phỏng 3D Toán';
      return loc.mathViewMode === 'lecture'
        ? isEn ? 'Math Lecture' : 'Bài giảng Toán'
        : isEn ? 'Mathematics' : 'Toán học';
    case 'physics':
      if (loc.physicsView === 'lecture') {
        if (loc.physicsTab === 'simulation') return isEn ? 'Physics 2D Lab' : 'Lab Vật lí 2D';
        if (loc.physicsTab === 'sim3d') return isEn ? 'Physics 3D Lab' : 'Lab Vật lí 3D';
        if (loc.physicsTab === 'practice') return isEn ? 'Physics Practice' : 'Bài tập Vật lí';
        return isEn ? 'Physics Lecture' : 'Bài giảng Vật lí';
      }
      return isEn ? 'Physics' : 'Vật lí';
    case 'cs':
      if (loc.csViewMode === 'judge') return 'Online Judge';
      if (loc.csViewMode === 'custom') return 'Sublime Studio';
      return loc.csSubView === 'lecture'
        ? isEn ? 'VNOI Lecture' : 'Bài giảng Tin học'
        : isEn ? 'CS · VNOI Roadmap' : 'Tin học · VNOI';
    case 'exams':
      return loc.examId
        ? isEn ? 'Exam Paper' : 'Đề thi chi tiết'
        : isEn ? 'Exams' : 'Đề thi';
    case 'arena':
      return isEn ? 'Weekly Arena' : 'Thi đấu & BXH';
    default:
      return isEn ? 'Classroom' : 'Lớp học';
  }
}

function isSameLocation(a: NavLocation, b: NavLocation): boolean {
  return (
    a.subject === b.subject &&
    a.mathTab === b.mathTab &&
    a.mathViewMode === b.mathViewMode &&
    a.mathLectureId === b.mathLectureId &&
    a.physicsView === b.physicsView &&
    a.physicsLessonId === b.physicsLessonId &&
    a.physicsTab === b.physicsTab &&
    a.csViewMode === b.csViewMode &&
    a.csSubView === b.csSubView &&
    a.csLessonId === b.csLessonId &&
    a.csLessonTab === b.csLessonTab &&
    a.examId === b.examId &&
    a.tutorOpen === b.tutorOpen &&
    a.tutorSubject === b.tutorSubject
  );
}

interface NavigationContextValue {
  location: NavLocation;
  canGoBack: boolean;
  previousLocation: NavLocation | null;
  navigate: (patch: Partial<NavLocation>, options?: { replace?: boolean }) => void;
  selectSubject: (subject: SubjectType) => void;
  goBack: () => void;
  goClassroom: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<NavLocation>(DEFAULT_LOCATION);
  const [historyStack, setHistoryStack] = useState<NavLocation[]>([]);

  const locationRef = useRef<NavLocation>(location);
  const stackRef = useRef<NavLocation[]>(historyStack);
  const browserDepthRef = useRef<number>(0);
  const ignoreNextPopRef = useRef<boolean>(false);

  locationRef.current = location;
  stackRef.current = historyStack;

  // Keep a base history state marker on mount so popstate knows where we started
  useEffect(() => {
    try {
      if (!window.history.state || typeof window.history.state.eduDepth !== 'number') {
        window.history.replaceState({ ...(window.history.state || {}), eduDepth: 0 }, '');
      }
    } catch {}
  }, []);

  // Listen to browser native Back/Forward arrow clicks
  useEffect(() => {
    const onPopState = () => {
      if (ignoreNextPopRef.current) {
        ignoreNextPopRef.current = false;
        return;
      }
      if (stackRef.current.length > 0) {
        const prev = stackRef.current[stackRef.current.length - 1];
        const nextStack = stackRef.current.slice(0, -1);
        stackRef.current = nextStack;
        locationRef.current = prev;
        browserDepthRef.current = Math.max(0, browserDepthRef.current - 1);
        setHistoryStack(nextStack);
        setLocation(prev);
        window.dispatchEvent(new Event('educlassroom:nav-pop'));
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((patch: Partial<NavLocation>, options?: { replace?: boolean }) => {
    const prev = locationRef.current;
    const next: NavLocation = { ...prev, ...patch };
    if (isSameLocation(prev, next)) return;

    if (!options?.replace) {
      const nextStack = [...stackRef.current.slice(-49), prev];
      stackRef.current = nextStack;
      setHistoryStack(nextStack);
      try {
        browserDepthRef.current += 1;
        window.history.pushState({ eduDepth: browserDepthRef.current }, '');
      } catch {}
    }

    locationRef.current = next;
    setLocation(next);
  }, []);

  const selectSubject = useCallback(
    (subject: SubjectType) => {
      const prev = locationRef.current;
      // When switching to a subject from header/cards, reset that subject to its top catalog/overview while closing AI drawer
      const patch: Partial<NavLocation> = {
        subject,
        tutorOpen: false
      };

      if (subject === 'math') {
        patch.mathTab = 'lectures';
        patch.mathViewMode = 'catalog';
      } else if (subject === 'physics') {
        patch.physicsView = 'catalog';
        patch.physicsTab = 'theory';
      } else if (subject === 'cs') {
        patch.csViewMode = 'curriculum';
        patch.csSubView = 'roadmap';
        patch.csLessonTab = 'lecture';
      } else if (subject === 'exams') {
        patch.examId = null;
      }

      if (isSameLocation(prev, { ...prev, ...patch })) {
        return;
      }
      navigate(patch);
    },
    [navigate]
  );

  const goBack = useCallback(() => {
    if (stackRef.current.length > 0) {
      const prev = stackRef.current[stackRef.current.length - 1];
      const nextStack = stackRef.current.slice(0, -1);
      stackRef.current = nextStack;
      locationRef.current = prev;
      setHistoryStack(nextStack);
      setLocation(prev);
      window.dispatchEvent(new Event('educlassroom:nav-pop'));

      if (browserDepthRef.current > 0) {
        browserDepthRef.current -= 1;
        ignoreNextPopRef.current = true;
        try {
          window.history.back();
        } catch {
          ignoreNextPopRef.current = false;
        }
      }
      return;
    }

    // Fallback when stack is empty (e.g. direct deep action)
    const cur = locationRef.current;
    if (cur.tutorOpen) {
      navigate({ tutorOpen: false }, { replace: true });
    } else if (cur.subject !== 'overview') {
      navigate({ subject: 'overview', tutorOpen: false }, { replace: true });
    }
  }, [navigate]);

  const goClassroom = useCallback(() => {
    const prev = locationRef.current;
    if (prev.subject === 'overview' && !prev.tutorOpen) return;
    navigate({ subject: 'overview', tutorOpen: false });
  }, [navigate]);

  const previousLocation =
    historyStack.length > 0 ? historyStack[historyStack.length - 1] : null;
  const canGoBack =
    historyStack.length > 0 || location.tutorOpen || location.subject !== 'overview';

  return (
    <NavigationContext.Provider
      value={{
        location,
        canGoBack,
        previousLocation,
        navigate,
        selectSubject,
        goBack,
        goClassroom
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used inside NavigationProvider');
  }
  return ctx;
}
