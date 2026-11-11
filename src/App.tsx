import React, { useState, useEffect } from 'react';
import { SubjectType } from './types';
import { Header } from './components/Header';
import { ClassroomOverview } from './components/ClassroomOverview';
import { MathStudio } from './components/math/MathStudio';
import { PhysicsLab } from './components/physics/PhysicsLab';
import { CodeJudgeLab } from './components/cs/CodeJudgeLab';
import { LiteratureHub } from './components/literature/LiteratureHub';
import { ExamHub } from './components/exams/ExamHub';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';

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

  const { user, openAuthModal, addXP, loading } = useAuth();

  const [guestXP, setGuestXP] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('edusim_xp');
      return saved ? parseInt(saved, 10) : 180;
    } catch {
      return 180;
    }
  });

  // Prompt Welcome screen on first entry if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      const hasWelcomed = sessionStorage.getItem('educlassroom_welcomed_session');
      if (!hasWelcomed) {
        sessionStorage.setItem('educlassroom_welcomed_session', 'true');
        openAuthModal('login');
      }
    }
  }, [loading, user]);

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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Bar Contract Navigation */}
      <Header
        currentSubject={currentSubject}
        onSelectSubject={setCurrentSubject}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        xp={activeXP}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentSubject === 'overview' && (
          <ClassroomOverview onNavigate={setCurrentSubject} xp={activeXP} />
        )}

        {currentSubject === 'math' && <MathStudio />}

        {currentSubject === 'physics' && <PhysicsLab />}

        {currentSubject === 'cs' && (
          <CodeJudgeLab onScoreEarned={handleEarnXP} />
        )}

        {currentSubject === 'literature' && <LiteratureHub />}

        {currentSubject === 'exams' && (
          <ExamHub onNavigateToSubject={setCurrentSubject} onEarnXP={handleEarnXP} />
        )}
      </main>

      {/* Welcome Screen & Authentication Modal */}
      <AuthModal />

      {/* Clean Editorial Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              EduClassroom 360
            </span>
            <span aria-hidden="true">·</span>
            <span>Hệ thống lớp học mô phỏng trực tuyến</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentSubject('math')}
              className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
            >
              Toán học
            </button>
            <button
              onClick={() => setCurrentSubject('physics')}
              className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
            >
              Vật lí 2D
            </button>
            <button
              onClick={() => setCurrentSubject('cs')}
              className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
            >
              Tin học
            </button>
            <button
              onClick={() => setCurrentSubject('literature')}
              className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
            >
              Ngữ văn
            </button>
            <button
              onClick={() => setCurrentSubject('exams')}
              className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors text-indigo-600 dark:text-indigo-400 font-semibold"
            >
              Đề Thi & Lời Giải (30 Đề)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
