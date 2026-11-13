import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SubjectType } from './types';
import { Header } from './components/Header';
import { ClassroomOverview } from './components/ClassroomOverview';
import { MathStudio } from './components/math/MathStudio';
import { PhysicsLab } from './components/physics/PhysicsLab';
import { CodeJudgeLab } from './components/cs/CodeJudgeLab';
import { ExamHub } from './components/exams/ExamHub';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { VisitorLandingPage } from './components/landing/VisitorLandingPage';
import { GalaxyBackground } from './components/galaxy/GalaxyBackground';

function MainApp() {
  const [currentSubject, setCurrentSubject] = useState<SubjectType>('overview');
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
            onSelectSubject={setCurrentSubject}
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
                  <ClassroomOverview onNavigate={setCurrentSubject} xp={activeXP} />
                )}

                {currentSubject === 'math' && (
                  <MathStudio onBack={() => setCurrentSubject('overview')} />
                )}

                {currentSubject === 'physics' && (
                  <PhysicsLab onBack={() => setCurrentSubject('overview')} onScoreEarned={handleEarnXP} />
                )}

                {currentSubject === 'cs' && (
                  <CodeJudgeLab onScoreEarned={handleEarnXP} onBack={() => setCurrentSubject('overview')} />
                )}

                {currentSubject === 'exams' && (
                  <ExamHub
                    onNavigateToSubject={setCurrentSubject}
                    onEarnXP={handleEarnXP}
                    onBack={() => setCurrentSubject('overview')}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

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

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentSubject('math')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Toán học
                </button>
                <button
                  onClick={() => setCurrentSubject('physics')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Vật lí 2D
                </button>
                <button
                  onClick={() => setCurrentSubject('cs')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Tin học
                </button>
                <button
                  onClick={() => setCurrentSubject('exams')}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-indigo-600 dark:text-indigo-400 font-semibold"
                >
                  Đề Thi & Lời Giải (30 Đề)
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
