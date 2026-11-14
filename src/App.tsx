import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { SubjectType, TutorContextPayload } from './types';
import { Header } from './components/Header';
import { ClassroomOverview } from './components/ClassroomOverview';
import { MathStudio } from './components/math/MathStudio';
import { PhysicsLab } from './components/physics/PhysicsLab';
import { CodeJudgeLab } from './components/cs/CodeJudgeLab';
import { ExamHub } from './components/exams/ExamHub';
import { LearningRoadmap } from './components/roadmap/LearningRoadmap';
import { ArenaHub } from './components/arena/ArenaHub';
import { SocraticAITutor } from './components/tutor/SocraticAITutor';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { VisitorLandingPage } from './components/landing/VisitorLandingPage';
import { GalaxyBackground } from './components/galaxy/GalaxyBackground';
import { useNavigation } from './context/NavigationContext';

function MainApp() {
  const { location, navigate, selectSubject, goBack } = useNavigation();
  const currentSubject = location.subject;
  const isTutorOpen = location.tutorOpen;
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

  return (
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
          className="relative min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200"
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
          />

          {/* Main Viewport Container with Smooth Subject Transitions (no persistent transform/z-index trap) */}
          <main className="relative flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
                    onOpenTutor={() => handleOpenTutor({ subject: 'math' })}
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
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Global 3-Subject x 3-Mode AI Tutor Drawer & Compact Mobile Floating Trigger */}
          {!isTutorOpen && (
            <button
              onClick={() => handleOpenTutor()}
              className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-[85] px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xl flex items-center gap-1.5 sm:gap-2 transition-all"
              title="Mở Trợ Giảng AI 3 Môn · 3 Chế Độ"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="sm:hidden">AI 3 Chế Độ</span>
              <span className="hidden sm:inline">Gia Sư AI (Toán · Lí · Tin)</span>
            </button>
          )}
          <SocraticAITutor
            isOpen={isTutorOpen}
            onClose={goBack}
            onBack={goBack}
            context={tutorContext}
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

          {/* Clean Editorial Footer */}
          <footer className="relative z-10 mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  EduClassroom 360
                </span>
                <span aria-hidden="true">·</span>
                <span>Hệ thống lớp học mô phỏng vũ trụ học thuật Galaxy</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => selectSubject('roadmap')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Lộ trình học
                </button>
                <button
                  onClick={() => selectSubject('math')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Toán học
                </button>
                <button
                  onClick={() => selectSubject('physics')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Vật lí 2D
                </button>
                <button
                  onClick={() => selectSubject('cs')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Tin học
                </button>
                <button
                  onClick={() => selectSubject('exams')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-indigo-600 dark:text-indigo-400 font-semibold"
                >
                  Đề Thi (60 Đề)
                </button>
                <button
                  onClick={() => selectSubject('arena')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-amber-600 dark:text-amber-400 font-semibold"
                >
                  Thi Đấu & BXH Tuần
                </button>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
