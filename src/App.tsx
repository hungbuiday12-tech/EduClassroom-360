import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Zap, Code2, Orbit } from 'lucide-react';
import { SubjectType, TutorContextPayload } from './types';
import { Header } from './components/Header';
import { ClassroomOverview } from './components/ClassroomOverview';
import { MathStudio } from './components/math/MathStudio';
import { PhysicsLab } from './components/physics/PhysicsLab';
import { CodeJudgeLab } from './components/cs/CodeJudgeLab';
import { ExamHub } from './components/exams/ExamHub';
import { LearningRoadmap } from './components/roadmap/LearningRoadmap';
import { ArenaHub } from './components/arena/ArenaHub';
import { StudyForum } from './components/forum/StudyForum';
import { SynapseV2Studio } from './components/synapsev2/SynapseV2Studio';
import { SocraticAITutor } from './components/tutor/SocraticAITutor';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { VisitorLandingPage } from './components/landing/VisitorLandingPage';
import { GalaxyBackground } from './components/galaxy/GalaxyBackground';
import { WaterRippleLayer } from './components/common/WaterRippleLayer';
import { FloatingFocusTimer } from './components/common/FloatingFocusTimer';
import { useNavigation } from './context/NavigationContext';
import { useLanguage } from './context/LanguageContext';
import { EXAM_PAPERS } from './data/examData';

function MainApp() {
  const { location, navigate, selectSubject, goBack } = useNavigation();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const currentSubject = location.subject;
  const isTutorOpen = location.tutorOpen;
  const isTutorOpenRef = useRef(isTutorOpen);
  isTutorOpenRef.current = isTutorOpen;
  const leftCtrlDownRef = useRef(false);
  const rightCtrlDownRef = useRef(false);
  const [tutorContext, setTutorContext] = useState<TutorContextPayload>({
    subject: 'math'
  });

  const handleOpenTutor = (ctx?: TutorContextPayload) => {
    const targetSubj: SubjectType =
      ctx?.subject ||
      (currentSubject === 'physics' || currentSubject === 'cs' || currentSubject === 'math'
        ? currentSubject
        : 'math');
    setTutorContext(
      ctx || {
        subject: targetSubj
      }
    );
    navigate({ tutorOpen: true, tutorSubject: targetSubj });
  };
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch {
        return false;
      }
    }
    return false;
  });

  const { user, addXP, loading } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Guest explore mode state: allows unauthenticated visitors to explore the classroom
  const [isGuestExploring, setIsGuestExploring] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('educlassroom_guest_exploring') === 'true';
    } catch {
      return false;
    }
  });

  const [guestXP, setGuestXP] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('edusim_xp');
      return saved ? parseInt(saved, 10) : 180;
    } catch {
      return 180;
    }
  });

  // Sync theme with document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleEnterAsGuest = () => {
    setIsGuestExploring(true);
    try {
      sessionStorage.setItem('educlassroom_guest_exploring', 'true');
    } catch {}
  };

  const handleReturnToLanding = () => {
    setIsGuestExploring(false);
    try {
      sessionStorage.removeItem('educlassroom_guest_exploring');
    } catch {}
  };

  const handleEarnXP = (earned: number) => {
    if (user) {
      addXP(earned);
    } else {
      setGuestXP((prev) => {
        const updated = prev + earned;
        try {
          localStorage.setItem('edusim_xp', updated.toString());
        } catch {}
        return updated;
      });
    }
  };

  const activeXP = user ? user.xp : guestXP;

  // Global Left-Ctrl Shortcuts for 3 Subject AIs:
  // Left Ctrl + D -> Math AI | Left Ctrl + F -> Physics AI | Left Ctrl + G -> CS AI
  useEffect(() => {
    const resetCtrl = () => {
      leftCtrlDownRef.current = false;
      rightCtrlDownRef.current = false;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ControlLeft' || (e.key === 'Control' && e.location === 1)) {
        leftCtrlDownRef.current = true;
      } else if (e.code === 'ControlRight' || (e.key === 'Control' && e.location === 2)) {
        rightCtrlDownRef.current = true;
      }

      if (!e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;
      // Only trigger for Left Ctrl (or when Ctrl was already held before focus and not Right Ctrl)
      const isLeftCtrlActive = leftCtrlDownRef.current || !rightCtrlDownRef.current;
      if (!isLeftCtrlActive) return;

      let targetSubj: 'math' | 'physics' | 'cs' | null = null;
      if (e.code === 'KeyD') targetSubj = 'math';
      else if (e.code === 'KeyF') targetSubj = 'physics';
      else if (e.code === 'KeyG') targetSubj = 'cs';

      if (!targetSubj) return;

      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        setIsGuestExploring(true);
        try {
          sessionStorage.setItem('educlassroom_guest_exploring', 'true');
        } catch {}
      }

      setTutorContext((prev) => ({ ...prev, subject: targetSubj! }));
      navigate(
        { tutorOpen: true, tutorSubject: targetSubj },
        { replace: isTutorOpenRef.current }
      );
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ControlLeft' || (e.key === 'Control' && e.location === 1)) {
        leftCtrlDownRef.current = false;
      } else if (e.code === 'ControlRight' || (e.key === 'Control' && e.location === 2)) {
        rightCtrlDownRef.current = false;
      }
    };

    window.addEventListener('keydown', onKeyDown, { capture: true });
    window.addEventListener('keyup', onKeyUp, { capture: true });
    window.addEventListener('blur', resetCtrl);
    document.addEventListener('visibilitychange', resetCtrl);

    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true });
      window.removeEventListener('keyup', onKeyUp, { capture: true });
      window.removeEventListener('blur', resetCtrl);
      document.removeEventListener('visibilitychange', resetCtrl);
    };
  }, [navigate, user]);

  return (
    <>
      <WaterRippleLayer />
      <AnimatePresence mode="wait">
      {!loading && !user && !isGuestExploring ? (
        <motion.div
          key="visitor-landing-view"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen"
        >
          <VisitorLandingPage
            onEnterAsGuest={handleEnterAsGuest}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
          />
        </motion.div>
      ) : (
        <motion.div
          key="classroom-main-view"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 overflow-x-clip"
        >
          {/* Dynamic Cosmic Galaxy Background (active in both Light and Dark modes) */}
          <GalaxyBackground
            interactive={true}
            intensity="vibrant"
            isDark={isDark}
            className={isDark ? 'opacity-70' : 'opacity-100'}
          />

          {/* Top Bar Contract Navigation */}
          <Header
            currentSubject={currentSubject}
            onSelectSubject={selectSubject}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
            xp={activeXP}
            onReturnToLanding={handleReturnToLanding}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Main Viewport Container with Smooth Subject Transitions (no persistent transform/z-index trap) */}
          <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-5 lg:px-7 py-6 sm:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSubject}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                {currentSubject === 'overview' && (
                  <ClassroomOverview
                    onNavigate={selectSubject}
                    xp={activeXP}
                    onOpenTutor={(subj, mode) =>
                      handleOpenTutor({ subject: subj || 'math', mode })
                    }
                    onOpenSettings={() => setIsSettingsOpen(true)}
                  />
                )}

                {currentSubject === 'roadmap' && (
                  <LearningRoadmap
                    onBack={goBack}
                    onNavigateSubject={selectSubject}
                    onOpenTutor={handleOpenTutor}
                    onEarnXP={handleEarnXP}
                  />
                )}

                {currentSubject === 'math' && (
                  <MathStudio onBack={goBack} />
                )}

                {currentSubject === 'physics' && (
                  <PhysicsLab onBack={goBack} onScoreEarned={handleEarnXP} />
                )}

                {currentSubject === 'cs' && (
                  <CodeJudgeLab onScoreEarned={handleEarnXP} onBack={goBack} />
                )}

                {currentSubject === 'exams' && (
                  <ExamHub
                    onNavigateToSubject={selectSubject}
                    onEarnXP={handleEarnXP}
                    onBack={goBack}
                  />
                )}

                {currentSubject === 'arena' && (
                  <ArenaHub
                    onBack={goBack}
                    onEarnXP={handleEarnXP}
                    onOpenTutor={handleOpenTutor}
                  />
                )}

                {currentSubject === 'forum' && (
                  <StudyForum onBack={goBack} />
                )}

                {currentSubject === 'synapse_v2' && (
                  <SynapseV2Studio
                    onBack={goBack}
                    onNavigate={selectSubject}
                    onEarnXP={handleEarnXP}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Persistent Bottom-Left Mini Focus Timer & Ambient Audio Widget */}
          <FloatingFocusTimer />

          {/* Global 3-Subject x 3-Mode AI Tutor Drawer & Modern Floating 3-AI Dock */}
          {!isTutorOpen && currentSubject !== 'synapse_v2' && (
            <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-[85] flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/90 dark:bg-slate-900/92 border border-white/15 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.65)] backdrop-blur-md">
              <button
                onClick={() => handleOpenTutor({ subject: 'math' })}
                className="group px-3 sm:px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title={isEn ? 'Open Math AI (Left Ctrl + D)' : 'Mở AI Toán Học (Ctrl trái + D)'}
              >
                <Compass className="w-3.5 h-3.5 shrink-0 icon-anim-compass" />
                <span>{isEn ? 'Math AI' : 'AI Toán'}</span>
              </button>
              <button
                onClick={() => handleOpenTutor({ subject: 'physics' })}
                className="group px-3 sm:px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] sm:text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title={isEn ? 'Open Physics AI (Left Ctrl + F)' : 'Mở AI Vật Lí (Ctrl trái + F)'}
              >
                <Zap className="w-3.5 h-3.5 shrink-0 icon-anim-zap" />
                <span>{isEn ? 'Physics AI' : 'AI Lí'}</span>
              </button>
              <button
                onClick={() => handleOpenTutor({ subject: 'cs' })}
                className="group px-3 sm:px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title={isEn ? 'Open CS AI (Left Ctrl + G)' : 'Mở AI Tin Học (Ctrl trái + G)'}
              >
                <Code2 className="w-3.5 h-3.5 shrink-0 icon-anim-code" />
                <span>{isEn ? 'CS AI' : 'AI Tin'}</span>
              </button>
            </div>
          )}
          <SocraticAITutor
            isOpen={isTutorOpen}
            onClose={goBack}
            onBack={goBack}
            context={{
              ...tutorContext,
              subject:
                location.tutorSubject === 'physics' ||
                location.tutorSubject === 'cs' ||
                location.tutorSubject === 'math'
                  ? location.tutorSubject
                  : tutorContext.subject
            }}
            onChangeSubject={(subj) => {
              setTutorContext((prev) => ({ ...prev, subject: subj }));
              navigate({ tutorSubject: subj }, { replace: true });
            }}
            onNavigateSubject={(subj) => {
              selectSubject(subj);
            }}
          />

          {/* Welcome Screen & Authentication Modal for in-app login */}
          <AuthModal />

          {/* Account, Gmail, Password & Theme Settings Modal */}
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
            onReturnToLanding={handleReturnToLanding}
          />

          {/* Clean Editorial Footer */}
          <footer className="relative z-10 mt-auto border-t border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-6">
            <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-slate-900 dark:text-white tracking-tight">
                  Synapse
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {isEn
                    ? 'Interactive Academic STEM Simulation Galaxy'
                    : 'Hệ thống lớp học mô phỏng vũ trụ học thuật Galaxy'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => selectSubject('roadmap')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {isEn ? 'Roadmap' : 'Lộ trình học'}
                </button>
                <button
                  onClick={() => selectSubject('math')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {isEn ? 'Mathematics' : 'Toán học'}
                </button>
                <button
                  onClick={() => selectSubject('physics')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {isEn ? 'Physics 2D/3D' : 'Vật lí 2D'}
                </button>
                <button
                  onClick={() => selectSubject('cs')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {isEn ? 'Computer Science' : 'Tin học'}
                </button>
                <button
                  onClick={() => selectSubject('exams')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer"
                >
                  {isEn ? `Exams (${EXAM_PAPERS.length})` : `Đề Thi (${EXAM_PAPERS.length} Đề)`}
                </button>
                <button
                  onClick={() => selectSubject('arena')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-amber-600 dark:text-amber-400 font-semibold cursor-pointer"
                >
                  {isEn ? 'Weekly Arena' : 'Thi Đấu & BXH Tuần'}
                </button>
                <button
                  onClick={() => selectSubject('forum')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-sky-600 dark:text-sky-400 font-semibold cursor-pointer"
                >
                  {isEn ? 'Study Forum' : 'Diễn đàn học tập'}
                </button>
                <button
                  onClick={() => selectSubject('synapse_v2')}
                  className="group inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-cyan-600 dark:text-cyan-400 font-bold cursor-pointer"
                >
                  <Orbit className="w-3.5 h-3.5 shrink-0 icon-anim-cosmos" />
                  <span>{isEn ? 'Virtual Campus · Synapse v2' : 'Lớp học ảo · Synapse v2'}</span>
                </button>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-semibold cursor-pointer"
                >
                  {isEn ? 'Settings' : 'Cài đặt'}
                </button>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
