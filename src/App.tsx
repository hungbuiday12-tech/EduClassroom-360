import React, { Suspense, lazy, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Zap, FlaskConical, Dna, Code2, Orbit, Cpu, ChevronUp, X, GripVertical, PinOff, Film, Crown, Play, Flame, Clock } from 'lucide-react';
import { SubjectType, TutorContextPayload } from './types';
import type { SynProDomain, SynProMode } from './components/tutor/SynAIProChat';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PremiumProvider, usePremium } from './context/PremiumContext';
import { GalaxyBackground } from './components/galaxy/GalaxyBackground';
import { WaterRippleLayer } from './components/common/WaterRippleLayer';
import { FloatingFocusTimer } from './components/common/FloatingFocusTimer';
import { QuickVoiceWidget } from './components/common/QuickVoiceWidget';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { useNavigation } from './context/NavigationContext';
import { useLanguage } from './context/LanguageContext';
import { useFocusTimer } from './context/FocusTimerContext';
import { useBackgroundTheme } from './context/BackgroundContext';
import { RemoteControllerProvider } from './context/RemoteControllerContext';
import { RemoteControllerModal } from './components/common/RemoteControllerModal';
import { PhoneRemoteControllerScreen } from './components/common/PhoneRemoteControllerScreen';
import { useDraggableWidget } from './hooks/useDraggableWidget';
import { CURRICULUM_COUNTS } from './data/curriculumCounts';
import { progressDailyQuest, recordGrowthStat, touchDailyActivity, getStreakState, GROWTH_UPDATED_EVENT } from './lib/learningGrowthStore';

const VisitorLandingPage = lazy(() =>
  import('./components/landing/VisitorLandingPage').then((m) => ({ default: m.VisitorLandingPage }))
);
const ClassroomOverview = lazy(() =>
  import('./components/ClassroomOverview').then((m) => ({ default: m.ClassroomOverview }))
);
const GuideTourPage = lazy(() =>
  import('./components/guide/GuideTourPage').then((m) => ({ default: m.GuideTourPage }))
);
const AuthorsPage = lazy(() =>
  import('./components/authors/AuthorsPage').then((m) => ({ default: m.AuthorsPage }))
);
const MathStudio = lazy(() =>
  import('./components/math/MathStudio').then((m) => ({ default: m.MathStudio }))
);
const MathSimulationsPage = lazy(() =>
  import('./components/math/MathSimulationsPage').then((m) => ({ default: m.MathSimulationsPage }))
);
const PhysicsLab = lazy(() =>
  import('./components/physics/PhysicsLab').then((m) => ({ default: m.PhysicsLab }))
);
const PhysicsDomainsPage = lazy(() =>
  import('./components/physics/PhysicsDomainsPage').then((m) => ({ default: m.PhysicsDomainsPage }))
);
const ChemistryLab = lazy(() =>
  import('./components/chemistry/ChemistryLab').then((m) => ({ default: m.ChemistryLab }))
);
const ChemistrySimulationsPage = lazy(() =>
  import('./components/chemistry/ChemistrySimulationsPage').then((m) => ({ default: m.ChemistrySimulationsPage }))
);
const BiologyLab = lazy(() =>
  import('./components/biology/BiologyLab').then((m) => ({ default: m.BiologyLab }))
);
const BiologySimulationsPage = lazy(() =>
  import('./components/biology/BiologySimulationsPage').then((m) => ({ default: m.BiologySimulationsPage }))
);
const CodeJudgeLab = lazy(() =>
  import('./components/cs/CodeJudgeLab').then((m) => ({ default: m.CodeJudgeLab }))
);
const CodeSimulationsPage = lazy(() =>
  import('./components/cs/CodeSimulationsPage').then((m) => ({ default: m.CodeSimulationsPage }))
);
const ExamHub = lazy(() =>
  import('./components/exams/ExamHub').then((m) => ({ default: m.ExamHub }))
);
const LearningRoadmap = lazy(() =>
  import('./components/roadmap/LearningRoadmap').then((m) => ({ default: m.LearningRoadmap }))
);
const ArenaHub = lazy(() =>
  import('./components/arena/ArenaHub').then((m) => ({ default: m.ArenaHub }))
);
const StudyForum = lazy(() =>
  import('./components/forum/StudyForum').then((m) => ({ default: m.StudyForum }))
);
const LiveMeetClassroom = lazy(() =>
  import('./components/meet/LiveMeetClassroom').then((m) => ({ default: m.LiveMeetClassroom }))
);
const SpatialGesture3DLab = lazy(() =>
  import('./components/spatial3d/SpatialGesture3DLab').then((m) => ({ default: m.SpatialGesture3DLab }))
);
const FutureLabWorkspace = lazy(() =>
  import('./components/future/FutureLabWorkspace').then((m) => ({ default: m.FutureLabWorkspace }))
);
const GrowthWorkspace = lazy(() =>
  import('./components/learning/GrowthWorkspace').then((m) => ({ default: m.GrowthWorkspace }))
);
const CommunityShowcaseView = lazy(() =>
  import('./components/showcase/CommunityShowcaseView').then((m) => ({ default: m.CommunityShowcaseView }))
);
const SocraticAITutor = lazy(() =>
  import('./components/tutor/SocraticAITutor').then((m) => ({ default: m.SocraticAITutor }))
);
const SynAIProChat = lazy(() =>
  import('./components/tutor/SynAIProChat').then((m) => ({ default: m.SynAIProChat }))
);
const SynapseVoiceOS = lazy(() =>
  import('./components/future/SynapseVoiceOS').then((m) => ({ default: m.SynapseVoiceOS }))
);
const AuthModal = lazy(() =>
  import('./components/auth/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const SettingsModal = lazy(() =>
  import('./components/settings/SettingsModal').then((m) => ({ default: m.SettingsModal }))
);
const PWAInstallModal = lazy(() =>
  import('./components/common/PWAInstallModal').then((m) => ({ default: m.PWAInstallModal }))
);
const LearnerPortfolioModal = lazy(() =>
  import('./components/learning/LearnerPortfolioModal').then((m) => ({ default: m.LearnerPortfolioModal }))
);
const GraphicsTierModal = lazy(() =>
  import('./components/common/GraphicsTierModal').then((m) => ({ default: m.GraphicsTierModal }))
);

const LazyViewFallback: React.FC<{ isEn?: boolean }> = ({ isEn }) => (
  <div className="min-h-[46vh] flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div className="w-9 h-9 rounded-lg border-2 border-slate-300 dark:border-slate-700 border-t-sky-600 dark:border-t-sky-400 animate-spin" />
    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
      {isEn ? 'Loading interactive workspace...' : 'Đang tải phòng học tương tác...'}
    </p>
  </div>
);

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.innerWidth >= 1024 && window.innerWidth < 1280
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isSynDockOpen, setIsSynDockOpen] = useState<boolean>(false);
  const [isArenaMatchActive, setIsArenaMatchActive] = useState<boolean>(false);
  const isArenaMatchActiveRef = useRef(false);
  isArenaMatchActiveRef.current = isArenaMatchActive;
  const currentSubjectRef = useRef(currentSubject);
  currentSubjectRef.current = currentSubject;
  const synDockRef = useRef<HTMLDivElement | null>(null);
  const synWidget = useDraggableWidget({ storageKey: 'synapse_widget_pos_synai_v1' });
  const [tutorContext, setTutorContext] = useState<TutorContextPayload>({
    subject: 'math'
  });
  const [activeTutorTier, setActiveTutorTier] = useState<'basic' | 'pro'>('basic');
  const [basicTutorSession, setBasicTutorSession] = useState<{ mounted: boolean; visible: boolean }>({
    mounted: false,
    visible: false
  });
  const [proTutorSession, setProTutorSession] = useState<{
    mounted: boolean;
    visible: boolean;
    mode: SynProMode;
    domain: SynProDomain;
  }>({
    mounted: false,
    visible: false,
    mode: 'pro_turbo',
    domain: 'all'
  });

  useEffect(() => {
    if (!isTutorOpen) {
      setBasicTutorSession((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      setProTutorSession((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }
    if (location.tutorTab === 'motion_reel') {
      setActiveTutorTier('pro');
      setBasicTutorSession((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      setProTutorSession((prev) => ({
        mounted: true,
        visible: true,
        mode: 'motion_reel',
        domain: prev.domain
      }));
    } else if (activeTutorTier === 'basic' && !basicTutorSession.visible) {
      setBasicTutorSession({ mounted: true, visible: true });
    } else if (activeTutorTier === 'pro' && !proTutorSession.visible) {
      setProTutorSession((prev) => ({ ...prev, mounted: true, visible: true }));
    }
  }, [isTutorOpen, location.tutorTab]);

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

  const handleOpenProTutor = (opts?: { mode?: SynProMode; domain?: SynProDomain }) => {
    if (currentSubjectRef.current === 'arena' && isArenaMatchActiveRef.current) {
      return;
    }
    setActiveTutorTier('pro');
    setBasicTutorSession((prev) => ({ ...prev, visible: false }));
    setProTutorSession((prev) => ({
      mounted: true,
      visible: true,
      mode: opts?.mode ?? prev.mode,
      domain: opts?.domain ?? prev.domain
    }));
    navigate({
      tutorOpen: true,
      tutorTab: opts?.mode === 'motion_reel' ? 'motion_reel' : 'chat'
    });
  };

  const handleOpenTutor = (ctx?: TutorContextPayload & { tutorTab?: 'chat' | 'motion_reel' }) => {
    if (currentSubjectRef.current === 'arena' && isArenaMatchActiveRef.current) {
      return;
    }
    const fallbackSubj: SubjectType =
      currentSubject === 'physics' || currentSubject === 'physics_sims'
        ? 'physics'
        : currentSubject === 'chemistry' || currentSubject === 'chemistry_sims'
        ? 'chemistry'
        : currentSubject === 'biology' || currentSubject === 'biology_sims'
        ? 'biology'
        : currentSubject === 'cs' || currentSubject === 'cs_sims'
        ? 'cs'
        : 'math';
    const targetSubj: SubjectType = ctx?.subject || fallbackSubj;
    setActiveTutorTier('basic');
    setProTutorSession((prev) => ({ ...prev, visible: false }));
    setBasicTutorSession({ mounted: true, visible: true });
    setTutorContext(
      ctx || {
        subject: targetSubj
      }
    );
    navigate({
      tutorOpen: true,
      tutorSubject: targetSubj,
      tutorTab: ctx?.tutorTab || 'chat'
    });
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
    try {
      if (typeof window !== 'undefined') {
        const savedStyle = localStorage.getItem('educlassroom_bg_style_v1');
        // First visit defaults to Crisp White Dynamic + Low Graphics
        if (!savedStyle || savedStyle === 'white_breeze') return false;
      }
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch {
      return false;
    }
    return false;
  });

  useEffect(() => {
    const onSyncLight = () => setIsDark(false);
    window.addEventListener('synapse:sync-light-theme', onSyncLight);
    return () => window.removeEventListener('synapse:sync-light-theme', onSyncLight);
  }, []);

  const { user, firebaseUser, addXP, loading, isAuthModalOpen } = useAuth();
  const { isGraphicsModalOpen } = useBackgroundTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const { hasPremiumAccess } = usePremium();
  const [synDockMode, setSynDockMode] = useState<'basic' | 'pro'>('pro');
  const [isVoiceOSOpen, setIsVoiceOSOpen] = useState(false);
  const { completedSessions } = useFocusTimer();
  const prevPomodoroRef = useRef<number>(completedSessions);

  const [streakDays, setStreakDays] = useState<number>(() =>
    getStreakState(user?.uid || firebaseUser?.uid).currentStreak
  );

  useEffect(() => {
    const uid = user?.uid || firebaseUser?.uid;
    touchDailyActivity(uid);
    const syncStreak = () => setStreakDays(getStreakState(uid).currentStreak);
    syncStreak();
    window.addEventListener(GROWTH_UPDATED_EVENT, syncStreak);
    return () => window.removeEventListener(GROWTH_UPDATED_EVENT, syncStreak);
  }, [user?.uid, firebaseUser?.uid]);

  useEffect(() => {
    if (completedSessions > prevPomodoroRef.current) {
      const diff = completedSessions - prevPomodoroRef.current;
      const uid = user?.uid || firebaseUser?.uid;
      recordGrowthStat('pomodoroCompleted', diff, uid);
      progressDailyQuest('focus_pomodoro', diff, uid);
    }
    prevPomodoroRef.current = completedSessions;
  }, [completedSessions, user?.uid, firebaseUser?.uid]);
  const isPreWebGLStage =
    (currentSubject === 'synapse_v2' || currentSubject === 'future_lab') &&
    (location.futureTab === 'galaxy3d' ||
      location.futureTab === 'audio_fft' ||
      location.futureTab === 'dual_hand_sandbox' ||
      location.futureTab === 'cannon_ballistics_3d' ||
      location.futureTab === 'rocket_launch_3d' ||
      location.futureTab === 'jet_engine_3d' ||
      location.futureTab === 'four_d_lectures' ||
      location.futureTab === 'robotics_ik_3d' ||
      location.futureTab === 'quantum_holodeck_3d' ||
      location.futureTab === 'universe_forge_3d' ||
      location.futureTab === 'nanobot_bioswarm_4d' ||
      location.futureTab === 'chem_reaction_3d' ||
      location.futureTab === 'chem_orbital_vsepr_3d' ||
      location.futureTab === 'bio_cell_atlas_3d' ||
      location.futureTab === 'bio_dna_crispr_3d' ||
      location.futureTab === 'timemachine_holo_3d' ||
      location.futureTab === 'spatial_gesture_3d' ||
      location.futureTab === 'tech_teardown_3d' ||
      location.futureTab === 'assembly_3d' ||
      location.futureTab === 'text_to_sim' ||
      location.futureTab === 'paper_to_sim' ||
      location.futureTab === 'silicon_neural' ||
      location.futureTab === 'phone_sensor_lab' ||
      location.futureTab === 'typing_parroto_sandbox' ||
      location.futureTab === 'math_sandbox_suite' ||
      ((!location.futureTab || location.futureTab === 'megastructures') &&
        location.synapseMode === 'stage'));
  const isHeavy3DActive =
    currentSubject === 'spatial_3d' ||
    isPreWebGLStage ||
    (currentSubject === 'cs_sims' && location.csSimTab === 'viz3d');

  // Guest explore mode state: allows unauthenticated visitors to explore the classroom
  const [isGuestExploring, setIsGuestExploring] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('coopRoom') || params.get('sensorRoom')) return true;
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

  const handleEarnXP = useCallback(
    (earned: number) => {
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
    },
    [user, addXP]
  );

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

      let targetSubj: 'math' | 'physics' | 'chemistry' | 'biology' | 'cs' | null = null;
      if (e.code === 'KeyD') targetSubj = 'math';
      else if (e.code === 'KeyF') targetSubj = 'physics';
      else if (e.code === 'KeyH') targetSubj = 'chemistry';
      else if (e.code === 'KeyB') targetSubj = 'biology';
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

      setActiveTutorTier('basic');
      setProTutorSession((prev) => ({ ...prev, visible: false }));
      setBasicTutorSession({ mounted: true, visible: true });
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

    const onVoiceShortcut = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'Space') {
        e.preventDefault();
        setIsVoiceOSOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onVoiceShortcut);

    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true });
      window.removeEventListener('keyup', onKeyUp, { capture: true });
      window.removeEventListener('blur', resetCtrl);
      document.removeEventListener('visibilitychange', resetCtrl);
      window.removeEventListener('keydown', onVoiceShortcut);
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
          <Suspense fallback={<LazyViewFallback isEn={isEn} />}>
            <VisitorLandingPage
              onEnterAsGuest={handleEnterAsGuest}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
              onOpenInstallApp={() => setIsInstallModalOpen(true)}
            />
          </Suspense>
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
            className={isDark ? 'opacity-90' : 'opacity-100'}
            xrayDockClassName={`bottom-[68px] left-3 lg:bottom-4 ${
              sidebarCollapsed ? 'lg:left-[94px]' : 'lg:left-[288px]'
            }`}
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
            className={`pre-main-col relative z-10 flex-1 min-w-0 flex flex-col pb-16 lg:pb-0 transition-[padding] duration-200 ${
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
              onOpenPortfolio={() => setIsPortfolioOpen(true)}
              onOpenVoiceOS={hasPremiumAccess ? () => setIsVoiceOSOpen(true) : undefined}
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
                  <Suspense fallback={<LazyViewFallback isEn={isEn} />}>
                    {currentSubject === 'overview' && (
                      <ClassroomOverview
                        onNavigate={selectSubject}
                        xp={activeXP}
                        onOpenTutor={(subj, mode) =>
                          handleOpenTutor({ subject: subj || 'math', mode })
                        }
                        onOpenSettings={() => setIsSettingsOpen(true)}
                        onOpenInstallApp={() => setIsInstallModalOpen(true)}
                        onOpenVoiceOS={hasPremiumAccess ? () => setIsVoiceOSOpen(true) : undefined}
                      />
                    )}

                    {currentSubject === 'guide' && (
                      <GuideTourPage
                        onBack={goBack}
                        onNavigateSubject={selectSubject}
                        onReturnToLanding={!user ? handleReturnToLanding : undefined}
                      />
                    )}

                    {currentSubject === 'authors' && (
                      <AuthorsPage
                        onBack={goBack}
                        onNavigateSubject={selectSubject}
                        onReturnToLanding={!user ? handleReturnToLanding : undefined}
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

                    {currentSubject === 'math_sims' && (
                      <MathSimulationsPage onBack={goBack} />
                    )}

                    {currentSubject === 'physics' && (
                      <PhysicsLab onBack={goBack} onScoreEarned={handleEarnXP} />
                    )}

                    {currentSubject === 'physics_sims' && (
                      <PhysicsDomainsPage onBack={goBack} />
                    )}

                    {currentSubject === 'chemistry' && (
                      <ChemistryLab onBack={goBack} onScoreEarned={handleEarnXP} />
                    )}

                    {currentSubject === 'chemistry_sims' && (
                      <ChemistrySimulationsPage onBack={goBack} />
                    )}

                    {currentSubject === 'biology' && (
                      <BiologyLab onBack={goBack} onScoreEarned={handleEarnXP} />
                    )}

                    {currentSubject === 'biology_sims' && (
                      <BiologySimulationsPage onBack={goBack} />
                    )}

                    {currentSubject === 'cs' && (
                      <CodeJudgeLab onScoreEarned={handleEarnXP} onBack={goBack} />
                    )}

                    {currentSubject === 'cs_sims' && (
                      <CodeSimulationsPage onBack={goBack} />
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

                    {currentSubject === 'live_meet' && (
                      <LiveMeetClassroom currentUserName={user?.displayName || user?.username} />
                    )}

                    {currentSubject === 'forum' && (
                      <StudyForum onBack={goBack} />
                    )}

                    {(currentSubject === 'synapse_v2' || currentSubject === 'future_lab') && (
                      <FutureLabWorkspace
                        onBack={goBack}
                        onNavigateSubject={selectSubject}
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

                    {currentSubject === 'growth_hub' && (
                      <GrowthWorkspace
                        onBack={goBack}
                        onNavigateSubject={selectSubject}
                        onEarnXP={handleEarnXP}
                        onOpenPortfolio={() => setIsPortfolioOpen(true)}
                      />
                    )}

                    {currentSubject === 'showcase' && (
                      <CommunityShowcaseView
                        onBack={goBack}
                        onNavigateSubject={selectSubject}
                        onEarnXP={handleEarnXP}
                      />
                    )}
                  </Suspense>
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
                    onClick={() => selectSubject('guide')}
                    className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-semibold cursor-pointer"
                  >
                    {isEn ? 'Guide' : 'Hướng dẫn'}
                  </button>
                  <button
                    onClick={() => selectSubject('authors')}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-semibold cursor-pointer"
                  >
                    {isEn ? 'Authors (9/4)' : 'Tác giả (9/4)'}
                  </button>
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
                    onClick={() => selectSubject('math_sims')}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-semibold text-blue-600 dark:text-sky-400 cursor-pointer"
                  >
                    {isEn ? 'Math 2D/3D' : 'Mô phỏng Toán'}
                  </button>
                  <button
                    onClick={() => selectSubject('physics_sims')}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-semibold text-blue-600 dark:text-sky-400 cursor-pointer"
                  >
                    {isEn ? 'Physics 2D/3D' : 'Mô phỏng Vật lí'}
                  </button>
                  <button
                    onClick={() => selectSubject('chemistry')}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {isEn ? 'Chemistry' : 'Hóa học'}
                  </button>
                  <button
                    onClick={() => selectSubject('chemistry_sims')}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-semibold text-violet-600 dark:text-violet-400 cursor-pointer"
                  >
                    {isEn ? 'Chem 2D/3D' : 'Mô phỏng Hóa'}
                  </button>
                  <button
                    onClick={() => selectSubject('biology')}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {isEn ? 'Biology' : 'Sinh học'}
                  </button>
                  <button
                    onClick={() => selectSubject('biology_sims')}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-semibold text-teal-600 dark:text-teal-400 cursor-pointer"
                  >
                    {isEn ? 'Bio 2D/3D' : 'Mô phỏng Sinh'}
                  </button>
                  <button
                    onClick={() => selectSubject('cs_sims')}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-semibold text-emerald-600 dark:text-emerald-400 cursor-pointer"
                  >
                    {isEn ? 'Code 2D/3D' : 'Mô phỏng Code'}
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
                    {isEn
                      ? `Exams (${CURRICULUM_COUNTS.totalExams})`
                      : `Đề Thi (${CURRICULUM_COUNTS.totalExams})`}
                  </button>
                  <button
                    onClick={() => selectSubject('synapse_v2')}
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-semibold cursor-pointer"
                  >
                    <Orbit className="w-3.5 h-3.5 shrink-0" />
                    <span>Synapse Pre</span>
                  </button>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-semibold cursor-pointer"
                  >
                    {isEn ? 'Settings' : 'Cài đặt'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void import('./utils/productDocxExporter').then((m) =>
                        m.downloadSynapsePresentationDocx()
                      )
                    }
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-semibold cursor-pointer"
                  >
                    {isEn ? 'Product Spec (.docx)' : 'Thuyết minh (.docx)'}
                  </button>
                </div>
              </div>
            </footer>
          </div>

          {/* Persistent Bottom-Left Mini Focus Timer, Scratchpad & Streak Dock */}
          <FloatingFocusTimer
            xp={activeXP}
            onOpenPortfolio={() => setIsPortfolioOpen(true)}
          />

          {/* Global 3-Subject x 3-Mode Syn AI Drawer & Compact Bottom-Right Syn AI Mini-Chat */}
          {!isTutorOpen &&
            !(
              (currentSubject === 'synapse_v2' || currentSubject === 'future_lab') &&
              ((location.synapseMode === 'stage' &&
                (!location.futureTab || location.futureTab === 'megastructures')) ||
                location.futureTab === 'spatial_gesture_3d')
            ) &&
            currentSubject !== 'spatial_3d' &&
            !(currentSubject === 'arena' && isArenaMatchActive) && (
            <div
              ref={(el) => {
                synDockRef.current = el;
                synWidget.containerRef.current = el;
              }}
              style={
                synWidget.position
                  ? { left: `${synWidget.position.x}px`, top: `${synWidget.position.y}px` }
                  : undefined
              }
              className={`fixed z-[85] select-none ${
                ['math_sims', 'physics_sims', 'chemistry_sims', 'biology_sims', 'cs_sims', 'synapse_v2', 'future_lab', 'spatial_3d', 'exams', 'arena'].includes(
                  currentSubject
                ) ||
                (currentSubject === 'physics' && location.physicsView !== 'catalog') ||
                (currentSubject === 'chemistry' && location.chemistryView !== 'catalog') ||
                (currentSubject === 'biology' && location.biologyView !== 'catalog') ||
                (currentSubject === 'cs' && location.csViewMode === 'visualizer')
                  ? 'hidden lg:block'
                  : ''
              } ${
                synWidget.position ? '' : 'bottom-[74px] right-3 sm:right-4 lg:bottom-5 lg:right-5'
              }`}
            >
              {isSynDockOpen && (
                <div
                  className={`absolute w-[min(256px,calc(100vw-24px))] rounded-md bg-slate-950 border border-cyan-500/45 shadow-[0_24px_60px_-14px_rgba(6,182,212,0.45)] overflow-hidden ${
                    synWidget.isBottomHalf ? 'bottom-full mb-2' : 'top-full mt-2'
                  } ${synWidget.isRightHalf ? 'right-0' : 'left-0'}`}
                >
                  <div
                    onPointerDown={synWidget.handleDragStart}
                    className={`px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 touch-none ${
                      synWidget.isDragging ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                    title={isEn ? 'Drag to reposition Syn AI' : 'Kéo để di chuyển vị trí Syn AI'}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-extrabold tracking-wider text-cyan-300 uppercase">
                      <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="w-2 h-2 rounded-sm bg-cyan-400" />
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Syn AI Suite</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {synWidget.isCustomPositioned && (
                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={synWidget.resetPosition}
                          className="px-1.5 py-1 rounded bg-white/10 hover:bg-cyan-500/25 text-[10px] font-semibold text-cyan-200 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          title={isEn ? 'Reset default corner position' : 'Đặt lại vị trí góc mặc định'}
                        >
                          <PinOff className="w-3 h-3" />
                          <span className="hidden sm:inline">{isEn ? 'Reset' : 'Đặt lại'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => setIsSynDockOpen(false)}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        aria-label={isEn ? 'Close Syn AI menu' : 'Thu gọn menu Syn AI'}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="p-2 space-y-2">
                    {/* Streak, XP & Góc học tập Summary Strip */}
                    <div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-400/35 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSynDockOpen(false);
                          setIsPortfolioOpen(true);
                        }}
                        className="flex items-center gap-1.5 font-mono font-bold text-amber-200 hover:text-amber-100 cursor-pointer truncate"
                        title={isEn ? 'Open STEM Portfolio & SM-2' : 'Mở Hồ sơ Năng lực & Sổ SM-2'}
                      >
                        <Flame className="w-3.5 h-3.5 text-rose-400 streak-flame-pulse shrink-0" />
                        <span className="tabular-nums">{streakDays}d</span>
                        <span className="text-slate-500">·</span>
                        <span className="tabular-nums text-amber-300">{activeXP} XP</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSynDockOpen(false);
                          window.dispatchEvent(new CustomEvent('synapse:open-focus-mini'));
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/25 hover:bg-indigo-500/40 border border-indigo-400/40 text-[10px] font-bold text-indigo-200 cursor-pointer shrink-0"
                        title={isEn ? 'Open Focus Study Corner' : 'Mở Góc học tập & Pomodoro'}
                      >
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{isEn ? 'Study Corner' : 'Góc học tập'}</span>
                      </button>
                    </div>

                    {/* Quick Resume when a minichat was paused (Tạm đóng) */}
                    {((basicTutorSession.mounted && !basicTutorSession.visible) ||
                      (proTutorSession.mounted && !proTutorSession.visible)) && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsSynDockOpen(false);
                          if (activeTutorTier === 'pro' && proTutorSession.mounted) {
                            handleOpenProTutor();
                          } else if (basicTutorSession.mounted) {
                            setActiveTutorTier('basic');
                            setProTutorSession((prev) => ({ ...prev, visible: false }));
                            setBasicTutorSession({ mounted: true, visible: true });
                            navigate({ tutorOpen: true });
                          } else if (proTutorSession.mounted) {
                            handleOpenProTutor();
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/60 text-emerald-200 text-xs font-extrabold flex items-center justify-between gap-2 cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Play className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                          <span className="truncate">
                            {isEn ? 'Resume paused conversation' : 'Tiếp tục cuộc trò chuyện'}
                          </span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/25 font-mono text-[9px] text-emerald-200 shrink-0">
                          {activeTutorTier === 'pro' && proTutorSession.mounted ? 'PRO' : 'AI'}
                        </span>
                      </button>
                    )}

                    {/* 2-Mode Switcher in Premium: AI Học Tập Cơ Bản vs AI Syn Pro */}
                    {hasPremiumAccess && (
                      <div className="grid grid-cols-2 gap-1 rounded-lg border border-slate-800 bg-slate-900/90 p-1">
                        <button
                          type="button"
                          onClick={() => setSynDockMode('basic')}
                          className={`rounded-md px-2 py-1 text-[10px] font-bold transition cursor-pointer ${
                            synDockMode === 'basic'
                              ? 'bg-slate-700 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          AI Cơ Bản
                        </button>
                        <button
                          type="button"
                          onClick={() => setSynDockMode('pro')}
                          className={`rounded-md px-2 py-1 text-[10px] font-extrabold transition cursor-pointer ${
                            synDockMode === 'pro'
                              ? 'bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950'
                              : 'text-amber-300/80 hover:text-amber-200'
                          }`}
                        >
                          AI Syn Pro ★
                        </button>
                      </div>
                    )}

                    {(!hasPremiumAccess || synDockMode === 'basic') ? (
                      <div className="space-y-1.5">
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
                            handleOpenTutor({ subject: 'chemistry' });
                          }}
                          className="cs-deck-btn w-full px-3 py-2 rounded bg-violet-600 hover:bg-violet-500 border border-violet-400/35 text-white text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <FlaskConical className="w-3.5 h-3.5 shrink-0" />
                            <span>Syn Chem</span>
                          </span>
                          <kbd className="px-1.5 py-0.5 rounded bg-violet-950/70 border border-violet-300/30 font-mono text-[9px] text-violet-100">
                            Ctrl+H
                          </kbd>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSynDockOpen(false);
                            handleOpenTutor({ subject: 'biology' });
                          }}
                          className="cs-deck-btn w-full px-3 py-2 rounded bg-teal-600 hover:bg-teal-500 border border-teal-400/35 text-white text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Dna className="w-3.5 h-3.5 shrink-0" />
                            <span>Syn Bio</span>
                          </span>
                          <kbd className="px-1.5 py-0.5 rounded bg-teal-950/70 border border-teal-300/30 font-mono text-[9px] text-teal-100">
                            Ctrl+B
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
                    ) : (
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSynDockOpen(false);
                            handleOpenProTutor({ mode: 'pro_turbo' });
                          }}
                          className="cs-deck-btn w-full px-3 py-2 rounded bg-gradient-to-r from-amber-500/25 via-cyan-500/25 to-blue-600/30 hover:brightness-125 border border-amber-400/60 text-white text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Crown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                            <span>Syn AI Pro · Siêu Trợ Lý</span>
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-400/20 border border-amber-300/40 font-mono text-[9px] text-amber-200">
                            PRO
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSynDockOpen(false);
                            handleOpenProTutor({ mode: 'motion_reel' });
                          }}
                          className="cs-deck-btn w-full px-3 py-2 rounded bg-gradient-to-r from-amber-500 via-orange-500 to-sky-600 hover:brightness-110 border border-amber-300/60 text-white text-xs font-extrabold flex items-center justify-between gap-2 transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Film className="w-3.5 h-3.5 shrink-0" />
                            <span>Syn Reel · Video 3B1B AI</span>
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-950/60 border border-amber-300/40 font-mono text-[9px] text-amber-200">
                            3B1B
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSynDockOpen(false);
                            handleOpenProTutor({ mode: 'pro_roadmap' });
                          }}
                          className="cs-deck-btn w-full px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-emerald-400/50 text-emerald-200 text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Phân Tích & Sơ Đồ Pro</span>
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 font-mono text-[9px] text-emerald-300">
                            MAP
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                {!isVoiceOSOpen && (
                  <QuickVoiceWidget
                    isDark={isDark}
                    onToggleTheme={handleToggleTheme}
                    onOpenTutor={(subj, promptText) =>
                      handleOpenTutor({
                        subject: subj || 'math',
                        problemStatement: promptText
                      })
                    }
                    onOpenFullVoiceOS={() => setIsVoiceOSOpen(true)}
                  />
                )}
                <button
                  type="button"
                  data-no-lift="true"
                  onPointerDown={synWidget.handleDragStart}
                  onClick={() => {
                    if (synWidget.consumeDidDrag()) return;
                    setIsSynDockOpen((prev) => !prev);
                  }}
                  aria-expanded={isSynDockOpen}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md bg-slate-950 hover:bg-slate-900 border ${
                    hasPremiumAccess
                      ? 'border-amber-400/75 text-amber-200 shadow-[0_16px_44px_-10px_rgba(245,158,11,0.5)]'
                      : 'border-cyan-500/45 text-white shadow-[0_16px_40px_-10px_rgba(6,182,212,0.42)]'
                  } text-xs font-bold transition-colors touch-none ${
                    synWidget.isDragging ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  title={
                    isEn
                      ? 'Click to open Syn AI · Drag to move anywhere'
                      : 'Bấm mở Syn AI · Kéo thả để di chuyển vị trí bất kỳ'
                  }
                >
                  <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="w-2 h-2 rounded-sm bg-cyan-400 shrink-0" />
                  <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-mono font-extrabold tracking-wider text-cyan-200 uppercase">
                    Syn AI
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-400/40 font-mono text-[10px] font-bold text-amber-300 tabular-nums"
                    title={isEn ? 'Daily Study Streak & XP' : 'Chuỗi Streak & Điểm XP'}
                  >
                    <Flame className="w-3 h-3 text-rose-400 streak-flame-pulse shrink-0" />
                    <span>{streakDays}d</span>
                    <span className="hidden sm:inline text-slate-500">·</span>
                    <span className="hidden sm:inline">{activeXP} XP</span>
                  </span>
                  {((basicTutorSession.mounted && !basicTutorSession.visible) ||
                    (proTutorSession.mounted && !proTutorSession.visible)) && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/50 text-[9px] font-bold text-emerald-300">
                      {isEn ? 'Paused' : 'Tiếp tục'}
                    </span>
                  )}
                  <ChevronUp
                    className={`w-3.5 h-3.5 text-cyan-300 transition-transform duration-200 ${
                      isSynDockOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Standalone Quick Voice Trigger when Syn AI dock is hidden (full-stage 3D / mobile sim) */}
          {!isTutorOpen &&
            !isVoiceOSOpen &&
            !(currentSubject === 'arena' && isArenaMatchActive) &&
            (
              ((currentSubject === 'synapse_v2' || currentSubject === 'future_lab') &&
                ((location.synapseMode === 'stage' &&
                  (!location.futureTab || location.futureTab === 'megastructures')) ||
                  location.futureTab === 'spatial_gesture_3d')) ||
              currentSubject === 'spatial_3d'
            ) && (
              <div className="fixed z-[85] bottom-[74px] right-3 sm:right-4 lg:bottom-5 lg:right-5">
                <QuickVoiceWidget
                  isDark={isDark}
                  onToggleTheme={handleToggleTheme}
                  onOpenTutor={(subj, promptText) =>
                    handleOpenTutor({
                      subject: subj || 'math',
                      problemStatement: promptText
                    })
                  }
                  onOpenFullVoiceOS={() => setIsVoiceOSOpen(true)}
                />
              </div>
            )}
          {basicTutorSession.mounted && (
            <Suspense fallback={null}>
              <SocraticAITutor
                isOpen={isTutorOpen && basicTutorSession.visible && activeTutorTier === 'basic'}
                onMinimize={() => {
                  setBasicTutorSession((prev) => ({ ...prev, visible: false }));
                  navigate({ tutorOpen: false }, { replace: true });
                }}
                onClose={() => {
                  setBasicTutorSession({ mounted: false, visible: false });
                  goBack();
                }}
                onBack={goBack}
                context={{
                  ...tutorContext,
                  subject:
                    location.tutorSubject === 'physics' ||
                    location.tutorSubject === 'chemistry' ||
                    location.tutorSubject === 'biology' ||
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
            </Suspense>
          )}

          {proTutorSession.mounted && (
            <Suspense fallback={null}>
              <SynAIProChat
                isOpen={isTutorOpen && proTutorSession.visible && activeTutorTier === 'pro'}
                initialMode={proTutorSession.mode}
                initialDomain={proTutorSession.domain}
                onMinimize={() => {
                  setProTutorSession((prev) => ({ ...prev, visible: false }));
                  navigate({ tutorOpen: false }, { replace: true });
                }}
                onClose={() => {
                  setProTutorSession((prev) => ({ ...prev, mounted: false, visible: false }));
                  goBack();
                }}
                onBack={goBack}
                onNavigateSubject={(subj) => {
                  selectSubject(subj);
                }}
              />
            </Suspense>
          )}

          {/* Welcome Screen & Authentication Modal for in-app login */}
          {isAuthModalOpen && (
            <Suspense fallback={null}>
              <AuthModal />
            </Suspense>
          )}

          {/* Account, Gmail, Password & Theme Settings Modal */}
          {isSettingsOpen && (
            <Suspense fallback={null}>
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
            </Suspense>
          )}
        </motion.div>
      )}
      </AnimatePresence>
      {isInstallModalOpen && (
        <Suspense fallback={null}>
          <PWAInstallModal
            isOpen={isInstallModalOpen}
            onClose={() => setIsInstallModalOpen(false)}
          />
        </Suspense>
      )}
      {isPortfolioOpen && (
        <Suspense fallback={null}>
          <LearnerPortfolioModal
            isOpen={isPortfolioOpen}
            onClose={() => setIsPortfolioOpen(false)}
            xp={activeXP}
          />
        </Suspense>
      )}
      {isVoiceOSOpen && (
        <Suspense fallback={null}>
          <SynapseVoiceOS
            isOpen={isVoiceOSOpen}
            onClose={() => setIsVoiceOSOpen(false)}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
            onOpenTutor={(subj, promptText) =>
              handleOpenTutor({
                subject: subj || 'math',
                problemStatement: promptText
              })
            }
          />
        </Suspense>
      )}
      {isGraphicsModalOpen && (
        <Suspense fallback={null}>
          <GraphicsTierModal />
        </Suspense>
      )}
      {(user || isGuestExploring) && !loading && (
        <MobileBottomNav
          currentSubject={currentSubject}
          onSelectSubject={selectSubject}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenTutor={(subj) => handleOpenTutor({ subject: subj || 'math' })}
          isHidden={
            isTutorOpen ||
            currentSubject === 'spatial_3d' ||
            location.futureTab === 'spatial_gesture_3d' ||
            ((currentSubject === 'synapse_v2' || currentSubject === 'future_lab') &&
              (!location.futureTab || location.futureTab === 'megastructures') &&
              location.synapseMode === 'stage') ||
            (currentSubject === 'arena' && isArenaMatchActive)
          }
        />
      )}
      <OfflineIndicator />
    </>
  );
}

export default function App() {
  const [remoteRoomCode, setRemoteRoomCode] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const val = new URLSearchParams(window.location.search).get('remoteRoom');
      return val && val.trim() ? val.trim().toUpperCase() : null;
    } catch {
      return null;
    }
  });

  if (remoteRoomCode) {
    return (
      <PhoneRemoteControllerScreen
        roomCode={remoteRoomCode}
        onExitController={() => {
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('remoteRoom');
            window.history.replaceState({}, '', url.toString());
          } catch {}
          setRemoteRoomCode(null);
        }}
      />
    );
  }

  return (
    <AuthProvider>
      <PremiumProvider>
        <RemoteControllerProvider>
          <MainApp />
          <RemoteControllerModal />
        </RemoteControllerProvider>
      </PremiumProvider>
    </AuthProvider>
  );
}
