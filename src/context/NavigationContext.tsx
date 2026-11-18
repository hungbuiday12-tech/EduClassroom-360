import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FutureLabTabId, Physics3DMode, PhysicsDomainId, PhysicsSimType, SubjectType } from '../types';
import { CSTrackId } from '../data/csTracksData';
import { MATH_LECTURES } from '../data/curriculumData';
import { PHYSICS_LESSONS } from '../data/physicsLessonsData';
import { PHYSICS_DOMAINS } from '../data/physicsDomainsData';

export interface NavLocation {
  subject: SubjectType;
  mathTab: 'lectures' | 'grapher' | 'geometry' | 'math3d';
  mathViewMode: 'catalog' | 'lecture';
  mathLectureId: string;
  physicsView: 'catalog' | 'lecture' | 'sim2d_hub' | 'sim3d_hub';
  physicsDomain: PhysicsDomainId;
  physicsSim2D: PhysicsSimType;
  physicsSim3D: Physics3DMode;
  physicsLessonId: string;
  physicsTab: 'theory' | 'simulation' | 'sim3d' | 'practice';
  csViewMode: 'curriculum' | 'judge' | 'custom' | 'visualizer';
  csSubView: 'roadmap' | 'lecture';
  csTrackId: CSTrackId;
  csLessonId: string;
  csLessonTab: 'lecture' | 'code' | 'practice' | 'visualizer';
  csAlgoId?: string;
  examId: string | null;
  synapseMode: 'catalog' | 'stage';
  synapseMonumentId: string;
  futureTab?: FutureLabTabId;
  coopRoomCode: string | null;
  coopInviteMeta?: {
    roomId?: string;
    title?: string;
    modelId?: string;
    modelTitle?: string;
    hostName?: string;
  } | null;
  tutorOpen: boolean;
  tutorSubject: SubjectType;
}

const DEFAULT_LOCATION: NavLocation = {
  subject: 'overview',
  mathTab: 'lectures',
  mathViewMode: 'catalog',
  mathLectureId: MATH_LECTURES[0]?.id || '',
  physicsView: 'catalog',
  physicsDomain: 'mechanics',
  physicsSim2D: 'kinematics_graphs',
  physicsSim3D: 'kinematics_3d',
  physicsLessonId: PHYSICS_LESSONS[0]?.id || '',
  physicsTab: 'theory',
  csViewMode: 'curriculum',
  csSubView: 'roadmap',
  csTrackId: 'vnoi',
  csLessonId: 'cs-1',
  csLessonTab: 'lecture',
  csAlgoId: 'coord_hull',
  examId: null,
  synapseMode: 'catalog',
  synapseMonumentId: 'dyson',
  futureTab: 'megastructures',
  coopRoomCode: null,
  coopInviteMeta: null,
  tutorOpen: false,
  tutorSubject: 'math'
};

function getInitialLocation(): NavLocation {
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const rawCode = params.get('coopRoom')?.trim().toUpperCase();
      if (rawCode && /^[A-Z0-9]{4,12}$/.test(rawCode)) {
        return {
          ...DEFAULT_LOCATION,
          subject: 'spatial_3d',
          coopRoomCode: rawCode
        };
      }
    }
  } catch {}
  return DEFAULT_LOCATION;
}

export function getLocationLabel(loc: NavLocation, lang: 'vi' | 'en' = 'vi'): string {
  const isEn = lang === 'en';
  if (loc.tutorOpen) {
    return loc.tutorSubject === 'physics'
      ? 'Syn Physics'
      : loc.tutorSubject === 'cs'
      ? 'Syn Code'
      : 'Syn Math';
  }
  switch (loc.subject) {
    case 'overview':
      return isEn ? 'Classroom' : 'Lớp học';
    case 'synapse_v2':
      if (loc.futureTab && loc.futureTab !== 'megastructures') {
        return isEn ? 'Synapse Pre · AI & 3D Lab' : 'Synapse Pre · Phòng Lab AI & 3D';
      }
      return loc.synapseMode === 'stage'
        ? isEn
          ? 'Synapse Pre · 3D Megastructure Stage'
          : 'Synapse Pre · Không gian 3D Đại công trình'
        : isEn
        ? 'Synapse Pre · Futuristic Megastructures'
        : 'Synapse Pre · Đại công trình tương lai';
    case 'spatial_3d':
      return isEn ? 'Spatial 3D Gesture Lab' : 'Học cảm giác 3D';
    case 'roadmap':
      return isEn ? 'Study Roadmap' : 'Lộ trình học';
    case 'math':
      if (loc.mathTab === 'grapher') return isEn ? '2D Grapher' : 'Đồ thị Oxy 2D';
      if (loc.mathTab === 'geometry') return isEn ? '2D Geometry' : 'Hình học 2D';
      if (loc.mathTab === 'math3d') return isEn ? '3D Oxyz' : 'Mô phỏng 3D Toán';
      return loc.mathViewMode === 'lecture'
        ? isEn ? 'Math Lecture' : 'Bài giảng Toán'
        : isEn ? 'Mathematics' : 'Toán học';
    case 'physics_sims':
      return isEn ? 'Physics 2D & 3D Simulations' : 'Mô phỏng Vật lí 2D & 3D';
    case 'physics': {
      const domainName =
        PHYSICS_DOMAINS.find((d) => d.id === loc.physicsDomain)?.shortName || 'Vật lí';
      if (loc.physicsView === 'sim2d_hub') {
        return isEn ? `2D Lab · ${domainName}` : `Mô phỏng 2D · ${domainName}`;
      }
      if (loc.physicsView === 'sim3d_hub') {
        return isEn ? `3D Lab · ${domainName}` : `Mô phỏng 3D · ${domainName}`;
      }
      if (loc.physicsView === 'lecture') {
        if (loc.physicsTab === 'simulation') return isEn ? 'Physics 2D Lab' : 'Lab Vật lí 2D';
        if (loc.physicsTab === 'sim3d') return isEn ? 'Physics 3D Lab' : 'Lab Vật lí 3D';
        if (loc.physicsTab === 'practice') return isEn ? 'Physics Practice' : 'Bài tập Vật lí';
        return isEn ? 'Physics Lecture' : 'Bài giảng Vật lí';
      }
      return isEn ? 'Physics' : 'Vật lí';
    }
    case 'cs':
      if (loc.csViewMode === 'visualizer') return isEn ? 'Algorithm Graph & Sim' : 'Đồ thị & Mô phỏng Thuật toán';
      if (loc.csViewMode === 'judge') return 'Online Judge';
      if (loc.csViewMode === 'custom') return 'Sublime Studio';
      if (loc.csSubView === 'lecture') {
        if (loc.csLessonTab === 'visualizer') return isEn ? 'CS Simulation' : 'Mô phỏng Thuật toán';
        return isEn ? 'CS Lecture' : 'Bài giảng Tin học';
      }
      return isEn ? 'CS · 5 Roadmaps' : 'Tin học · 5 Lộ trình';
    case 'exams':
      return loc.examId
        ? isEn ? 'Exam Paper' : 'Đề thi chi tiết'
        : isEn ? 'Exams' : 'Đề thi';
    case 'arena':
      return isEn ? 'Weekly Arena' : 'Thi đấu & BXH';
    case 'forum':
      return isEn ? 'Study Forum' : 'Diễn đàn học tập';
    case 'growth_hub':
      return isEn ? 'Error Notebook · SM-2 · PDF Studio' : 'Sổ tay Lỗi sai & Thẻ SM-2';
    case 'showcase':
      return isEn ? '2D/3D Community Showcase' : 'Thư viện Sáng tạo 2D/3D';
    case 'future_lab':
      if (!loc.futureTab || loc.futureTab === 'megastructures') {
        return isEn
          ? 'Synapse Pre · Futuristic Megastructures'
          : 'Synapse Pre · Đại công trình tương lai';
      }
      return isEn ? 'Synapse Pre · AI & 3D Lab' : 'Synapse Pre · Phòng Lab AI & 3D';
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
    a.physicsDomain === b.physicsDomain &&
    a.physicsSim2D === b.physicsSim2D &&
    a.physicsSim3D === b.physicsSim3D &&
    a.physicsLessonId === b.physicsLessonId &&
    a.physicsTab === b.physicsTab &&
    a.csViewMode === b.csViewMode &&
    a.csSubView === b.csSubView &&
    a.csTrackId === b.csTrackId &&
    a.csLessonId === b.csLessonId &&
    a.csLessonTab === b.csLessonTab &&
    a.csAlgoId === b.csAlgoId &&
    a.examId === b.examId &&
    a.synapseMode === b.synapseMode &&
    a.synapseMonumentId === b.synapseMonumentId &&
    a.futureTab === b.futureTab &&
    a.coopRoomCode === b.coopRoomCode &&
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
  reviewScrollTick: number;
  requestScrollToReviews: () => void;
  directoryScrollTick: number;
  directoryFilterRequest: 'all' | 'math' | 'physics' | 'cs';
  requestScrollToDirectory: (filter?: 'all' | 'math' | 'physics' | 'cs') => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<NavLocation>(getInitialLocation);
  const [historyStack, setHistoryStack] = useState<NavLocation[]>([]);
  const [reviewScrollTick, setReviewScrollTick] = useState<number>(0);
  const [directoryScrollTick, setDirectoryScrollTick] = useState<number>(0);
  const [directoryFilterRequest, setDirectoryFilterRequest] = useState<'all' | 'math' | 'physics' | 'cs'>('all');

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
      } else if (subject === 'synapse_v2') {
        patch.synapseMode = 'catalog';
        patch.futureTab = 'megastructures';
      } else if (subject === 'future_lab') {
        patch.futureTab = prev.futureTab || 'megastructures';
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

  const requestScrollToReviews = useCallback(() => {
    const prev = locationRef.current;
    if (prev.subject !== 'overview' || prev.tutorOpen) {
      navigate({ subject: 'overview', tutorOpen: false });
    }
    setReviewScrollTick((n) => n + 1);
  }, [navigate]);

  const requestScrollToDirectory = useCallback(
    (filter: 'all' | 'math' | 'physics' | 'cs' = 'all') => {
      const prev = locationRef.current;
      setDirectoryFilterRequest(filter);
      if (prev.subject !== 'overview' || prev.tutorOpen) {
        navigate({ subject: 'overview', tutorOpen: false });
      }
      setDirectoryScrollTick((n) => n + 1);
    },
    [navigate]
  );

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
        goClassroom,
        reviewScrollTick,
        requestScrollToReviews,
        directoryScrollTick,
        directoryFilterRequest,
        requestScrollToDirectory
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
