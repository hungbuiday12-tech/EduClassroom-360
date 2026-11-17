import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Zap, Code2, Orbit, Cpu, ChevronUp, X } from 'lucide-react';
import { SubjectType, TutorContextPayload } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ClassroomOverview } from './components/ClassroomOverview';
import { MathStudio } from './components/math/MathStudio';
import { PhysicsLab } from './components/physics/PhysicsLab';
import { PhysicsDomainsPage } from './components/physics/PhysicsDomainsPage';
import { CodeJudgeLab } from './components/cs/CodeJudgeLab';
import { ExamHub } from './components/exams/ExamHub';
import { LearningRoadmap } from './components/roadmap/LearningRoadmap';
import { ArenaHub } from './components/arena/ArenaHub';
import { StudyForum } from './components/forum/StudyForum';
import { SynapseV2Studio } from './components/synapsev2/SynapseV2Studio';
import { SpatialGesture3DLab } from './components/spatial3d/SpatialGesture3DLab';
import { SocraticAITutor } from './components/tutor/SocraticAITutor';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { VisitorLandingPage } from './components/landing/VisitorLandingPage';
import { GalaxyBackground } from './components/galaxy/GalaxyBackground';
import { WaterRippleLayer } from './components/common/WaterRippleLayer';
import { FloatingFocusTimer } from './components/common/FloatingFocusTimer';
import { PWAInstallModal } from './components/common/PWAInstallModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isSynDockOpen, setIsSynDockOpen] = useState<boolean>(false);
  const [isArenaMatchActive, setIsArenaMatchActive] = useState<boolean>(false);
  const isArenaMatchActiveRef = useRef(false);
  isArenaMatchActiveRef.current = isArenaMatchActive;
  const currentSubjectRef = useRef(currentSubject);
  currentSubjectRef.current = currentSubject;
  const synDockRef = useRef<HTMLDivElement | null>(null);
  const [tutorContext, setTutorContext] = useState<TutorContextPayload>({
    subject: 'math'
  });

  useEffect(() => {
    if (currentSubject !== 'arena' && isArenaMatchActive) {
      setIsArenaMatchActive(false);
    }
  }, [currentSubject, isArenaMatchActive]);

  const handleArenaMatchActiveChange = React.useCallback(
    (active: boolean) => {
      setIsArenaMatchActive(active);
      if (active) {
        setIsSynDockOpen(false);
        if (isTutorOpenRef.current) {
          navigate({ tutorOpen: false }, { replace: true });
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!isSynDockOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (synDockRef.current && !synDockRef.current.contains(e.target as Node)) {
        setIsSynDockOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isSynDockOpen]);

  const handleOpenTutor = (ctx?: TutorContextPayload) => {
    if (currentSubjectRef.current === 'arena' && isArenaMatchActiveRef.current) {
      return;
    }
    const fallbackSubj: SubjectType =
      currentSubject === 'physics' || currentSubject === 'physics_sims'
        ? 'physics'
        : currentSubject === 'cs'
        ? 'cs'
        : 'math';
    const targetSubj: SubjectType = ctx?.subject || fallbackSubj;
    setTutorContext(
      ctx || {
        subject: targetSubj
      }
    );
    navigate({ tutorOpen: true, tutorSubject: targetSubj });
  };

  useEffect(() => {
    const onOpenTutorEvent = (e: Event) => {
      const detail = (e as CustomEvent<TutorContextPayload>).detail;
      if (detail) {
        handleOpenTutor(detail);
      }
    };
    window.addEventListener('educlassroom:open-tutor-with-payload', onOpenTutorEvent);
    return () =>
      window.removeEventListener('educlassroom:open-tutor-with-payload', onOpenTutorEvent);
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-w', sidebarCollapsed ? '78px' : '272px');
  }, [sidebarCollapsed]);

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
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const isHeavy3DActive = currentSubject === 'spatial_3d' || currentSubject === 'synapse_v2';

  // Guest explore mode state: allows unauthenticated visitors to explore the classroom
  const [isGuestExploring, setIsGuestExploring] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('coopRoom')) return true;
      }
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
      // Disable AI shortcuts while actively competing in Arena match
      if (currentSubjectRef.current === 'arena' && isArenaMatchActiveRef.current) return;
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
            onOpenInstallApp={() => setIsInstallModalOpen(true)}
          />
        </motion.div>
      ) : (
        <motion.div
          key="classroom-main-view"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-screen flex bg-transparent text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 overflow-x-clip"
        >
          {/* Customizable Background Canvas (by PC Spec) */}
          <GalaxyBackground
            interactive={true}
            intensity="vibrant"
            isDark={isDark}
            paused={isHeavy3DActive}
            className={isDark ? 'opacity-75' : 'opacity-100'}
          />

          {/* Left Vertical Navigation Sidebar */}
          <Sidebar
            currentSubject={currentSubject}
            onSelectSubject={selectSubject}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenInstallApp={() => setIsInstallModalOpen(true)}
            pauseParticles={isHeavy3DActive}
          />

          {/* Right Main Workspace Column */}
          <div
            className={`relative z-10 flex-1 min-w-0 flex flex-col transition-[padding] duration-200 ${
              sidebarCollapsed ? 'lg:pl-[78px]' : 'lg:pl-[272px]'
            }`}
          >
            {/* Single-Row Top Utility Bar */}
            <Header
              currentSubject={currentSubject}
              onSelectSubject={selectSubject}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
              xp={activeXP}
              onReturnToLanding={handleReturnToLanding}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenMobileMenu={() => setMobileMenuOpen(true)}
              onOpenInstallApp={() => setIsInstallModalOpen(true)}
            />

            {/* Main Viewport Container */}
            <main className="flex-1 max-w-[1400px] w-full mx-auto px-3 sm:px-5 lg:px-7 py-5 sm:py-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSubject}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
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

                  {currentSubject === 'physics_sims' && (
                    <PhysicsDomainsPage onBack={goBack} />
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
                      onMatchActiveChange={handleArenaMatchActiveChange}
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

                  {currentSubject === 'spatial_3d' && (
                    <SpatialGesture3DLab
                      onBack={goBack}
                      onNavigate={selectSubject}
                      onEarnXP={handleEarnXP}
                      initialCoopRoomCode={location.coopRoomCode}
                      coopInviteMeta={location.coopInviteMeta}
                      onConsumeCoopRoom={() =>
                        navigate({ coopRoomCode: null, coopInviteMeta: null }, { replace: true })
                      }
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Clean Editorial Footer */}
            <footer className="mt-auto border-t border-slate-200/75 dark:border-slate-800/90 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-5">
              <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-slate-900 dark:text-white tracking-tight">
                    Synapse
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {isEn
                      ? 'Interactive Academic STEM Studio (Grades 9–12)'
                      : 'Hệ thống lớp học & mô phỏng STEM tương tác (Lớp 9–12)'}
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
                    onClick={() => selectSubject('physics_sims')}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-semibold text-blue-600 dark:text-sky-400 cursor-pointer"
                  >
                    {isEn ? 'Physics 2D/3D' : 'Mô phỏng Vật lí'}
                  </button>
                  <button
                    onClick={() => selectSubject('cs')}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {isEn ? 'CS & Code' : 'Tin học'}
                  </button>
                  <button
                    onClick={() => selectSubject('exams')}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {isEn ? `Exams (${EXAM_PAPERS.length})` : `Đề Thi (${EXAM_PAPERS.length})`}
                  </button>
                  <button
                    onClick={() => selectSubject('synapse_v2')}
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-semibold cursor-pointer"
                  >
                    <Orbit className="w-3.5 h-3.5 shrink-0" />
                    <span>Synapse v2 (30)</span>
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
          </div>

          {/* Persistent Bottom-Left Mini Focus Timer & Ambient Audio Widget */}
          <FloatingFocusTimer />

          {/* Global 3-Subject x 3-Mode Syn AI Drawer & Compact Bottom-Right Syn AI Mini-Chat */}
          {!isTutorOpen &&
            currentSubject !== 'synapse_v2' &&
            currentSubject !== 'spatial_3d' &&
            !(currentSubject === 'arena' && isArenaMatchActive) && (
            <div
              ref={synDockRef}
              className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-[85] flex flex-col items-end gap-2"
            >
              {isSynDockOpen && (
                <div className="sci-frame syn-window-enter w-[246px] rounded-md bg-slate-950/95 border border-cyan-500/45 shadow-[0_24px_60px_-14px_rgba(6,182,212,0.45)] backdrop-blur-xl overflow-hidden">
                  <div className="px-3 py-2 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-extrabold tracking-wider text-cyan-300 uppercase">
                      <span className="w-2 h-2 rounded-sm bg-cyan-400 syn-core-pulse" />
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Syn AI Suite</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSynDockOpen(false)}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      aria-label={isEn ? 'Close Syn AI menu' : 'Thu gọn menu Syn AI'}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="p-2 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSynDockOpen(false);
                        handleOpenTutor({ subject: 'math' });
                      }}
                      className="cs-deck-btn w-full px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 border border-blue-400/35 text-white text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Compass className="w-3.5 h-3.5 shrink-0" />
                        <span>Syn Math</span>
                      </span>
                      <kbd className="px-1.5 py-0.5 rounded bg-blue-950/70 border border-blue-300/30 font-mono text-[9px] text-blue-100">
                        Ctrl+D
                      </kbd>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSynDockOpen(false);
                        handleOpenTutor({ subject: 'physics' });
                      }}
                      className="cs-deck-btn w-full px-3 py-2 rounded bg-amber-500 hover:bg-amber-400 border border-amber-300/45 text-slate-950 text-xs font-extrabold flex items-center justify-between gap-2 transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 shrink-0" />
                        <span>Syn Physics</span>
                      </span>
                      <kbd className="px-1.5 py-0.5 rounded bg-amber-950/20 border border-amber-950/30 font-mono text-[9px] text-slate-950">
                        Ctrl+F
                      </kbd>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSynDockOpen(false);
                        handleOpenTutor({ subject: 'cs' });
                      }}
                      className="cs-deck-btn w-full px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/35 text-white text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Syn Code</span>
                      </span>
                      <kbd className="px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-300/30 font-mono text-[9px] text-emerald-100">
                        Ctrl+G
                      </kbd>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsSynDockOpen((prev) => !prev)}
                aria-expanded={isSynDockOpen}
                className="sci-frame syn-dock-halo flex items-center gap-2 px-3 py-2 rounded-md bg-slate-950/95 hover:bg-slate-900 border border-cyan-500/45 text-white text-xs font-bold shadow-[0_16px_40px_-10px_rgba(6,182,212,0.42)] backdrop-blur-md transition-all cursor-pointer"
                title={
                  isEn
                    ? 'Open Syn AI (Left Ctrl + D / F / G)'
                    : 'Mở Syn AI (Phím tắt: Ctrl trái + D / F / G)'
                }
              >
                <span className="w-2 h-2 rounded-sm bg-cyan-400 syn-core-pulse shrink-0" />
                <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-mono font-extrabold tracking-wider text-cyan-200 uppercase">
                  Syn AI
                </span>
                <ChevronUp
                  className={`w-3.5 h-3.5 text-cyan-300 transition-transform duration-200 ${
                    isSynDockOpen ? 'rotate-180' : ''
                  }`}
                />
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
            onOpenInstallApp={() => {
              setIsSettingsOpen(false);
              setIsInstallModalOpen(true);
            }}
          />
        </motion.div>
      )}
      </AnimatePresence>
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
      <OfflineIndicator />
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
