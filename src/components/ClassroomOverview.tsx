import React, { Suspense, lazy, useState, useEffect } from 'react';
import { LiveMeetShowcaseCard } from './meet/LiveMeetShowcaseCard';
import { SynapsePremiumGateModal } from './premium/SynapsePremiumGateModal';
import { SynapsePremiumHome } from './premium/SynapsePremiumHome';
import { usePremium } from '../context/PremiumContext';
import { AITutorMode, SubjectType } from '../types';
import {
  Compass,
  Zap,
  Code2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  BookOpen,
  ArrowRight,
  Sparkles,
  LogIn,
  Trophy,
  GitBranch,
  Settings,
  FileText,
  Star,
  Bell,
  Volume2,
  VolumeX,
  PanelBottomOpen,
  MessageSquare,
  ListOrdered,
  ChevronDown,
  Orbit,
  Hand,
  Atom,
  Download,
  Flame,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Images,
  Cpu,
  Crown,
  Wand2,
  Camera,
  Grid3X3,
  Waves,
  Mic,
  Building2,
  PenTool,
  LineChart,
  Binary,
  CalendarCheck,
  CalendarClock,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { useFocusTimer, STUDY_FORMAT_PRESETS } from '../context/FocusTimerContext';
import { useAudio } from '../context/AudioContext';
import { BELL_SOUND_OPTIONS } from '../lib/soundEngine';
import { CURRICULUM_COUNTS } from '../data/curriculumCounts';
import { getPhysicsSimCounts } from '../data/physicsDomainsData';
import { CS_SPECIALIZED_TRACKS, CSTrackId } from '../data/csTracksData';
import {
  GROWTH_UPDATED_EVENT,
  getErrorNotebook,
  getFlashcards,
  getStreakState
} from '../lib/learningGrowthStore';
import { PlatformReviews } from './common/PlatformReviews';
import { AppDownloadGuideSection } from './common/AppDownloadGuideSection';
import { CursorDodgeText } from './common/CursorDodgeText';
import { AppearanceStudioBar } from './common/AppearanceStudioBar';
import { GraphicsTierTriggerButton } from './common/GraphicsTierTriggerButton';
import type {
  DirectorySubjectFilter,
  LectureDirectoryTarget
} from './common/LectureDirectorySection';

const LectureDirectorySection = lazy(() =>
  import('./common/LectureDirectorySection').then((m) => ({ default: m.LectureDirectorySection }))
);

interface ClassroomOverviewProps {
  onNavigate: (subject: SubjectType) => void;
  xp: number;
  onOpenTutor?: (subject?: 'math' | 'physics' | 'cs', mode?: AITutorMode) => void;
  onOpenSettings?: () => void;
  onOpenInstallApp?: () => void;
  onOpenVoiceOS?: () => void;
}

export const ClassroomOverview: React.FC<ClassroomOverviewProps> = ({
  onNavigate,
  xp,
  onOpenTutor,
  onOpenSettings,
  onOpenInstallApp,
  onOpenVoiceOS
}) => {
  const { user, openAuthModal } = useAuth();
  const {
    hasPremiumAccess,
    isAdmin,
    mySubscription,
    pendingRequestsCount,
    dailyQuotaRemaining,
    dailyQuotaLimit,
  } = usePremium();
  const formatPreDate = (iso?: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(language === 'en' ? 'en-GB' : 'vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  const { t, language } = useLanguage();
  const {
    reviewScrollTick,
    requestScrollToReviews,
    directoryScrollTick,
    directoryFilterRequest,
    navigate
  } = useNavigation();
  const [directorySubject, setDirectorySubject] = useState<DirectorySubjectFilter>('all');
  const [growthTick, setGrowthTick] = useState(0);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showProStudioDrawer, setShowProStudioDrawer] = useState(false);

  useEffect(() => {
    const onGrowthUpdate = () => setGrowthTick((t) => t + 1);
    window.addEventListener(GROWTH_UPDATED_EVENT, onGrowthUpdate);
    return () => window.removeEventListener(GROWTH_UPDATED_EVENT, onGrowthUpdate);
  }, []);

  const streakSummary = React.useMemo(() => {
    void growthTick;
    const streak = getStreakState(user?.uid);
    const unresolvedErrors = getErrorNotebook(user?.uid).filter((e) => !e.resolved).length;
    const dueCards = getFlashcards(user?.uid).filter((c) => new Date(c.dueAt).getTime() <= Date.now()).length;
    const doneQuests = streak.dailyQuests.filter((q) => q.progress >= q.target).length;
    return {
      streak,
      unresolvedErrors,
      dueCards,
      doneQuests,
      totalQuests: streak.dailyQuests.length
    };
  }, [growthTick, user?.uid]);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToLectureDirectory = (subj: DirectorySubjectFilter = 'all') => {
    setDirectorySubject(subj);
    window.setTimeout(() => {
      const el = document.getElementById('classroom-lecture-directory');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 30);
  };

  const handleSelectLectureFromDirectory = (target: LectureDirectoryTarget) => {
    if (target.subject === 'math') {
      navigate({
        subject: 'math',
        mathTab: 'lectures',
        mathViewMode: 'lecture',
        mathLectureId: target.lectureId,
        tutorOpen: false
      });
    } else if (target.subject === 'physics') {
      navigate({
        subject: 'physics',
        physicsView: 'lecture',
        physicsLessonId: target.lectureId,
        physicsTab: 'theory',
        tutorOpen: false
      });
    } else {
      navigate({
        subject: 'cs',
        csViewMode: 'curriculum',
        csSubView: 'lecture',
        csLessonId: target.lectureId,
        csLessonTab: 'lecture',
        tutorOpen: false
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCsTrackFromDirectory = (csTrackId: CSTrackId) => {
    navigate({
      subject: 'cs',
      csViewMode: 'curriculum',
      csSubView: 'roadmap',
      csTrackId,
      tutorOpen: false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const {
    studyFormat,
    setStudyFormat,
    phase,
    switchPhase,
    timeLeft,
    totalDuration,
    isRunning: isTimerRunning,
    startPause: toggleTimer,
    resetTimer,
    completedSessions,
    alarmRinging,
    dismissAlarm,
    setIsWidgetOpen,
  } = useFocusTimer();
  const {
    bellSound,
    setBellSound,
    playBell,
    isBgPlaying,
    toggleBgPlaying,
    bgSound,
  } = useAudio();
  const isEn = language === 'en';

  const currentXP = user ? user.xp : xp;
  const currentLevel = Math.floor(currentXP / 500) + 1;
  const xpProgressPct = Math.min(((currentXP % 500) / 500) * 100, 100);
  const totalExams = CURRICULUM_COUNTS.totalExams;
  const chuyenExams = CURRICULUM_COUNTS.chuyenExams;
  const standardExams = CURRICULUM_COUNTS.standardExams;
  const csSpecializedStageCount = CS_SPECIALIZED_TRACKS.reduce((s, t) => s + t.stages.length, 0);
  const totalLessons = CURRICULUM_COUNTS.totalLessons;
  const mathCount = CURRICULUM_COUNTS.mathLectures;
  const physicsCount = CURRICULUM_COUNTS.physicsLessons;
  const csCount = CURRICULUM_COUNTS.csLessons;

  useEffect(() => {
    if (reviewScrollTick === 0) return;
    const timer = window.setTimeout(() => {
      const el = document.getElementById('platform-reviews');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 90);
    return () => window.clearTimeout(timer);
  }, [reviewScrollTick]);

  useEffect(() => {
    if (directoryScrollTick === 0) return;
    setDirectorySubject(directoryFilterRequest);
    const timer = window.setTimeout(() => {
      const el = document.getElementById('classroom-lecture-directory');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 90);
    return () => window.clearTimeout(timer);
  }, [directoryScrollTick, directoryFilterRequest]);

  // Quick Notes State
  const [notes, setNotes] = useState<{ id: string; text: string; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem('edusim_notes');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: '1',
              text: "Cubic derivative: y' = 3ax² + 2bx + c · Nhớ công thức đạo hàm hàm bậc 3",
              date: '2026'
            },
            {
              id: '2',
              text: 'Spring pendulum: T = 2π√(m/k), E ∝ A² · Con lắc lò xo: cơ năng tỉ lệ A²',
              date: '2026'
            }
          ];
    } catch {
      return [];
    }
  });

  const [newNoteText, setNewNoteText] = useState('');

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const note = {
      id: Date.now().toString(),
      text: newNoteText.trim(),
      date: new Date().toLocaleDateString(isEn ? 'en-US' : 'vi-VN')
    };
    const updated = [note, ...notes];
    setNotes(updated);
    localStorage.setItem('edusim_notes', JSON.stringify(updated));
    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem('edusim_notes', JSON.stringify(updated));
  };

  const aiCards = [
    {
      subj: 'math' as const,
      shortcut: isEn ? 'Left Ctrl+D' : 'Ctrl(trái)+D',
      title: 'Syn Math',
      sub: isEn
        ? 'Algebra · Calculus · Plane & Oxyz 3D Geometry'
        : 'Đại số · Giải tích · Hình học & Oxyz 3D',
      accent:
        'border-sky-200/90 dark:border-sky-500/25 bg-sky-50/55 dark:bg-sky-950/25',
      badge: 'bg-blue-600 text-white shadow-sm',
      btn: 'hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/50 text-blue-700 dark:text-sky-300',
      icon: <Compass className="w-4 h-4" />
    },
    {
      subj: 'physics' as const,
      shortcut: isEn ? 'Left Ctrl+F' : 'Ctrl(trái)+F',
      title: 'Syn Physics',
      sub: isEn
        ? 'Mechanics · Thermodynamics · RLC · Waves & Nuclear'
        : 'Cơ · Nhiệt · Điện RLC · Sóng & Hạt nhân',
      accent:
        'border-amber-200/90 dark:border-amber-500/25 bg-amber-50/55 dark:bg-amber-950/20',
      badge: 'bg-amber-500 text-slate-950 shadow-sm',
      btn: 'hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 text-amber-800 dark:text-amber-300',
      icon: <Zap className="w-4 h-4" />
    },
    {
      subj: 'cs' as const,
      shortcut: isEn ? 'Left Ctrl+G' : 'Ctrl(trái)+G',
      title: 'Syn Code',
      sub: isEn
        ? 'Competitive Algorithms · C++20 · Python 3 · Debug'
        : 'Thuật toán CP · C++20 · Python 3 · Debug',
      accent:
        'border-emerald-200/90 dark:border-emerald-500/25 bg-emerald-50/55 dark:bg-emerald-950/20',
      badge: 'bg-emerald-600 text-white shadow-sm',
      btn: 'hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300',
      icon: <Code2 className="w-4 h-4" />
    }
  ];

  const aiModes: {
    mode: 'explain_no_answer' | 'full_solution' | 'diagnostic_roadmap' | 'motion_reel';
    label: string;
  }[] = [
    {
      mode: 'explain_no_answer',
      label: isEn
        ? '1. Guided Explain (No Final Answer)'
        : '1. Giảng gợi mở (Không lộ đáp án)'
    },
    {
      mode: 'full_solution',
      label: isEn
        ? '2. Full Solution & 4-Step Method'
        : '2. Giải chi tiết & Phương pháp 4 bước'
    },
    {
      mode: 'diagnostic_roadmap',
      label: isEn
        ? '3. Skill Test & Personalized Roadmap'
        : '3. Test năng lực & Vẽ lộ trình ngành'
    },
    {
      mode: 'motion_reel',
      label: isEn
        ? '4. Syn Reel · 3B1B Motion Video Studio'
        : '4. Syn Reel · Dựng Video 3B1B Trực Quan'
    }
  ];

  return (
    <div className="space-y-10">
      {/* SYNAPSE PREMIUM HOLOGRAPHIC PRO SHOWCASE (Trang chính Pre nâng cấp vượt bật) */}
      {hasPremiumAccess && (
        <section className="relative overflow-hidden rounded-3xl border border-amber-400/60 bg-slate-950/95 p-5 sm:p-7 text-white shadow-[0_0_70px_rgba(245,158,11,0.22)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(circle at 12% 20%, rgba(251,191,36,0.45), transparent 45%), radial-gradient(circle at 88% 80%, rgba(34,211,238,0.4), transparent 48%), linear-gradient(to right, rgba(251,191,36,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.12) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 100% 100%, 36px 36px, 36px 36px',
            }}
          />

          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/70 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-3 py-1 text-xs font-extrabold text-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.3)]">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>SYNAPSE PREMIUM · PRO EDITION</span>
                </span>
                <span className="rounded-lg border border-cyan-400/50 bg-cyan-500/15 px-2.5 py-1 font-mono text-[11px] font-bold text-cyan-200">
                  Astra AI Quota: {dailyQuotaRemaining}/{dailyQuotaLimit} lượt hôm nay
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setShowPremiumModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/60 bg-emerald-500/15 px-3.5 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25 cursor-pointer"
                  >
                    <span>Admin: Cấp quyền Pre</span>
                    {pendingRequestsCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-rose-600 text-white text-[10px] font-mono font-extrabold animate-pulse">
                        {pendingRequestsCount} chờ duyệt
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Khung Giới Thiệu 3 Trụ Cột Độc Quyền Bản Pre */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-amber-400/35 bg-slate-900/80 p-4 space-y-1.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Syn Pro & AI Cơ Bản (2 Chế độ)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Chuyển đổi tức thì trong Minichat Syn AI giữa 3 AI học tập cơ bản và <strong>AI Syn Pro</strong> giải siêu tốc, phân tích 3 tầng & <strong>Tạo Video 3B1B AI</strong>.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-400/35 bg-slate-900/80 p-4 space-y-1.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-300">
                  <Cpu className="w-4 h-4" />
                  <span>Mô Phỏng Chuẩn Astra AI · 21 Lab 3D</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Mở khóa toàn bộ Vũ Trụ Định Luật Vật Lí 3D, Thành Phố Thuật Toán 3D, Quantum Holodeck, Hộp cát GPU 28K & 30 Đại công trình 3D.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/35 bg-slate-900/80 p-4 space-y-1.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
                  <Mic className="w-4 h-4" />
                  <span>Voice OS · QR Điều Khiển 3D · Syn Reel</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Độc quyền điều khiển giọng nói Voice OS, quét QR dùng điện thoại xoay mô hình 3D từ xa và xuất video bài giảng 3Blue1Brown.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FRAMELESS BLENDED HERO STAGE: Typography floats directly over the animated scene */}
      <section className="relative bg-transparent border-0 shadow-none px-2 sm:px-6 pt-4 pb-8 sm:pt-8 sm:pb-12">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="text-xs sm:text-sm font-semibold tracking-wider text-accent-gradient hero-blend-shadow">
            {hasPremiumAccess
              ? isEn
                ? '★ SYNAPSE PREMIUM EDITION · Interactive STEM Academy · Astra AI & 3B1B Video'
                : '★ PHIÊN BẢN SYNAPSE PREMIUM · Học viện STEM Trực quan · AI Pro & Video 3B1B'
              : t(
                  'overview.badge',
                  'Học viện Mô phỏng Trực quan · Toán · Vật lí · Tin học (Lớp 9 – 12)',
                  'Interactive STEM Academy · Math · Physics · Computer Science (Grades 9–12)'
                )}
          </div>

          <CursorDodgeText
            as="h1"
            text={t(
              'overview.heroTitle',
              'Bục giảng ảo: Khám phá trực quan Toán học, Vật lí & Tin học (Lớp 9 – 12)',
              'Synapse Classroom: Math, Physics & Computer Science (Grades 9–12)'
            )}
            highlightWords={['toán', 'học', 'vật', 'lí', 'tin', 'synapse', 'math', 'physics', 'computer', 'science']}
            className="font-display text-3xl sm:text-5xl lg:text-[3.15rem] font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.16] text-balance max-w-3xl mx-auto hero-blend-shadow"
          />

          <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl mx-auto hero-blend-shadow">
            {(() => {
              const phyCounts = getPhysicsSimCounts();
              return t(
                'overview.heroDesc',
                `Hệ sinh thái STEM toàn diện cho Toán (2D & Oxyz 3D), Vật lí (${phyCounts.domainCount} lĩnh vực · ${phyCounts.count2D} Lab 2D & ${phyCounts.count3D} mô hình 3D + 36 dụng cụ), Tin học (5 lộ trình VNOI & C++ · IDE Sublime 4 · Truy vết Code 1-1 & Replay Tư Duy), Synapse Pre (30 Đại công trình 3D · Hộp cát Hạt GPU 28K 2 tay · Cảm biến Điện thoại QR Oscilloscope), AR Bàn Học Pro 10 ngón tay, Phòng Học Trực Tuyến Live Meet & 3D (Gọi Video WebRTC · Chia sẻ màn hình · Mô hình 3D dùng chung đồng bộ & Up file .glb/.obj), Syn AI Mắt Thần + Ngắt lời Voice & Syn Reel Video 3B1B, Đề thi chấm ảnh AI & App đa thiết bị.`,
                `Complete STEM ecosystem: Math (2D & Oxyz 3D), Physics (${phyCounts.domainCount} domains · ${phyCounts.count2D} 2D + ${phyCounts.count3D} 3D labs + 36 tools), CS (5 VNOI/C++ roadmaps · Sublime 4 · Live Code-to-Animation Trace & Thought Replay), Synapse Pre (30 Megastructures · Dual-Hand 28K GPU Particle Sandbox · QR Phone Sensor Oscilloscope), WebAR Desk Pro 10-finger lab, Live Meet & Shared 3D Classroom (WebRTC Video/Screen Share · Mouse-controlled Shared 3D & .glb/.obj Upload), Live Vision + Barge-In Syn AI & Syn Reel 3B1B Motion Video, AI-graded Exams & Cross-Device App.`
              );
            })()}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 pt-1">
            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToLectureDirectory('all')}
              className="group cs-deck-btn min-h-[48px] px-5 sm:px-7 py-3 rounded bg-accent-solid text-sm sm:text-base font-semibold shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-5 h-5 icon-anim-book shrink-0" />
              <span>
                {isEn ? `Explore ${totalLessons} Lectures` : `Khám phá ${totalLessons} Bài giảng`}
              </span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform shrink-0" />
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => onNavigate('physics_sims')}
              className="group cs-deck-btn min-h-[48px] px-5 sm:px-7 py-3 rounded bg-white/60 dark:bg-slate-900/50 backdrop-blur-md border border-slate-300/75 dark:border-white/20 hover:border-sky-400 text-slate-900 dark:text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <Atom className="w-5 h-5 text-amber-500 dark:text-amber-300 icon-anim-atom shrink-0" />
              <span>{isEn ? 'Open 2D/3D Simulations' : 'Mở Phòng Mô phỏng 2D/3D'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => onNavigate('live_meet')}
              className="group cs-deck-btn min-h-[48px] px-5 sm:px-6 py-3 rounded bg-sky-600/95 hover:bg-sky-500 border border-sky-400/70 text-white text-sm sm:text-base font-semibold shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{isEn ? 'Live Meet & 3D Room' : 'Phòng Học Trực Tuyến 3D'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            <button
              type="button"
              disabled={downloadingDocx}
              onClick={() => {
                if (downloadingDocx) return;
                setDownloadingDocx(true);
                void import('../utils/productDocxExporter')
                  .then((m) => m.downloadSynapsePresentationDocx())
                  .finally(() => setDownloadingDocx(false));
              }}
              className="group cs-deck-btn min-h-[48px] px-5 sm:px-6 py-3 rounded bg-emerald-600/95 hover:bg-emerald-500 disabled:opacity-70 border border-emerald-400/70 text-white text-sm sm:text-base font-semibold shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className={`w-4 h-4 shrink-0 ${downloadingDocx ? 'animate-bounce' : ''}`} />
              <span>
                {downloadingDocx
                  ? isEn
                    ? 'Preparing (.docx)...'
                    : 'Đang tải (.docx)...'
                  : isEn
                  ? 'Product Spec (.docx)'
                  : 'Tải Thuyết Minh (.docx)'}
              </span>
            </button>
          </div>

          {/* Mobile & iPad Quick 1-Tap Simulation Launcher (< lg) */}
          <div className="lg:hidden pt-1 text-left">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center justify-between">
              <span>
                {isEn
                  ? 'Quick Simulation Launch (2D / 3D / AR)'
                  : 'Truy cập nhanh Phòng Mô Phỏng 2D / 3D / AR'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onNavigate('math_sims')}
                className="min-h-[48px] flex items-center gap-2.5 p-2.5 rounded-[4px] bg-white/85 dark:bg-slate-900/85 border border-blue-500/35 hover:border-blue-400 text-left shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 rounded-[4px] bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <LineChart className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    {isEn ? 'Math 2D/3D' : 'Toán 2D & Oxyz'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {isEn ? 'Grapher & 3D' : 'Đồ thị & Hình học'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('physics_sims')}
                className="min-h-[48px] flex items-center gap-2.5 p-2.5 rounded-[4px] bg-white/85 dark:bg-slate-900/85 border border-amber-500/35 hover:border-amber-400 text-left shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 rounded-[4px] bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Atom className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    {isEn ? 'Physics 2D/3D' : 'Vật lí 2D & 3D'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {isEn ? '10 Domains' : '10 Lĩnh vực'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('cs_sims')}
                className="min-h-[48px] flex items-center gap-2.5 p-2.5 rounded-[4px] bg-white/85 dark:bg-slate-900/85 border border-emerald-500/35 hover:border-emerald-400 text-left shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 rounded-[4px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Binary className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    {isEn ? 'Code 2D/3D' : 'Code 2D & 3D'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {isEn ? '16 2D + 5 3D' : '16 Thuật toán'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('synapse_v2')}
                className="min-h-[48px] flex items-center gap-2.5 p-2.5 rounded-[4px] bg-white/85 dark:bg-slate-900/85 border border-cyan-500/35 hover:border-cyan-400 text-left shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 rounded-[4px] bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Orbit className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    Synapse Pre
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {isEn ? '30 3D/4D Labs' : '30 Lab 3D/4D'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('spatial_3d')}
                className="min-h-[48px] col-span-2 sm:col-span-1 flex items-center gap-2.5 p-2.5 rounded-[4px] bg-white/85 dark:bg-slate-900/85 border border-teal-500/35 hover:border-teal-400 text-left shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 rounded-[4px] bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Hand className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    {isEn ? 'Spatial 3D & AR' : 'Cảm Giác 3D & AR'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {isEn ? 'Hand & Scan 3D' : 'Quét vật & Tay'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Prominent 3-Tier Graphics Setup Button + Live Appearance Studio Bar */}
          <div className="pt-1 space-y-2.5">
            <GraphicsTierTriggerButton variant="overview" />
            <AppearanceStudioBar />
          </div>

          {/* Frameless Inline Academic Metrics & Learner Mastery Strip */}
          <div className="mt-4 pt-5 border-t border-slate-300/50 dark:border-white/12 grid grid-cols-1 md:grid-cols-12 gap-5 items-center text-left">
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center md:text-left">
              <div className="group/stat px-2 py-1">
                <div className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tabular-nums hero-blend-shadow">
                  {totalLessons}
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5 hero-blend-shadow">
                  {isEn ? 'Interactive Lessons' : 'Bài giảng nhiều phần'}
                </div>
              </div>
              <div className="group/stat px-2 py-1">
                <div className="font-display text-2xl sm:text-3xl font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums hero-blend-shadow">
                  128+
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5 hero-blend-shadow">
                  {isEn ? 'Virtual 2D/3D Labs' : 'Phòng Lab 2D/3D'}
                </div>
              </div>
              <div className="group/stat px-2 py-1">
                <div className="font-display text-2xl sm:text-3xl font-semibold text-accent-gradient tabular-nums">
                  60 FPS
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5 hero-blend-shadow">
                  {isEn ? '2D/3D Physics & Graphs' : 'Mô phỏng 2D/3D'}
                </div>
              </div>
              <div className="group/stat px-2 py-1">
                <div className="font-display text-2xl sm:text-3xl font-semibold text-amber-600 dark:text-amber-300 tabular-nums hero-blend-shadow">
                  {totalExams}
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5 hero-blend-shadow">
                  {isEn ? 'Curated Exam Papers' : 'Đề thi chuẩn'}
                </div>
              </div>
            </div>

            <div className="md:col-span-5 rounded bg-white/55 dark:bg-slate-950/45 backdrop-blur-md border border-slate-300/60 dark:border-white/15 px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white truncate">
                    {user ? user.displayName : isEn ? 'Guest Learner' : 'Học sinh thử nghiệm'}
                  </span>
                  <span className="font-mono font-semibold text-amber-600 dark:text-amber-300 tabular-nums shrink-0">
                    Lv.{currentLevel} · {currentXP} XP
                  </span>
                </div>
                <div className="w-full bg-slate-200/80 dark:bg-white/12 h-2 rounded-sm overflow-hidden">
                  <div
                    className="roadmap-shimmer-bar bg-accent-solid h-full rounded-sm transition-all duration-500"
                    style={{ width: `${xpProgressPct}%` }}
                  />
                </div>
              </div>

              {user ? (
                onOpenSettings && (
                  <button
                    type="button"
                    data-ripple="true"
                    onClick={onOpenSettings}
                    className="group cs-deck-btn min-h-[40px] px-3.5 py-2 rounded bg-white/75 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-slate-300/70 dark:border-white/15 text-xs font-semibold text-slate-900 dark:text-white transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
                  >
                    <Settings className="w-4 h-4 text-sky-600 dark:text-sky-300 icon-anim-gear" />
                    <span>{isEn ? 'Settings' : 'Cài đặt'}</span>
                  </button>
                )
              ) : (
                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => openAuthModal('login')}
                  className="group cs-deck-btn min-h-[40px] px-4 py-2 rounded bg-accent-solid text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>{isEn ? 'Sign In' : 'Đăng nhập'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TABLE OF CONTENTS (MỤC LỤC TRANG CHÍNH) */}
      <section className="sci-frame sci-scan-bar rounded-xl bg-white/90 dark:bg-slate-900/82 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-sky-200/85 dark:border-sky-500/25 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <ListOrdered className="w-5 h-5 text-blue-600 dark:text-sky-400 icon-anim-list shrink-0" />
            <h2 className="font-display text-sm sm:text-base font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              {isEn ? 'Table of Contents · Jump to Lectures' : 'Mục Lục Trang Chính · Cuộn Nhanh Xuống Bài Giảng'}
            </h2>
            <span aria-hidden="true" className="hidden sm:inline-flex items-end gap-[2px] h-3 pb-0.5 opacity-80">
              <span className="w-[2px] h-full bg-sky-500 rounded-xs sci-meter-1" />
              <span className="w-[2px] h-full bg-teal-500 rounded-xs sci-meter-2" />
              <span className="w-[2px] h-full bg-blue-600 rounded-xs sci-meter-3" />
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Click any entry to scroll smoothly down to the lecture list or classroom tools'
              : 'Bấm vào mục lục để cuộn xuống xem ngay danh sách bài giảng & các khu vực học tập'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            type="button"
            data-ripple="true"
            onClick={() => scrollToLectureDirectory('all')}
            className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-gradient-to-r from-sky-50 via-blue-50/70 to-sky-50 dark:from-blue-950/60 dark:via-slate-900/80 dark:to-sky-950/50 hover:from-sky-100 hover:to-blue-100 dark:hover:from-blue-900/70 dark:hover:to-sky-950/80 border border-sky-300/85 dark:border-sky-500/40 hover:border-blue-600 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <div className="relative z-10 min-w-0">
              <span className="font-mono text-[11px] font-semibold text-blue-700 dark:text-sky-400 block">
                01 · {isEn ? 'ALL LECTURES' : 'DANH SÁCH BÀI GIẢNG'}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-sky-200 truncate block transition-colors">
                {isEn ? `View All ${totalLessons} Lectures` : `Xem toàn bộ ${totalLessons} bài giảng`}
              </span>
            </div>
            <span className="relative z-10 w-8 h-8 rounded bg-blue-600/10 dark:bg-sky-400/15 group-hover:bg-blue-600 text-blue-700 dark:text-sky-300 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => scrollToLectureDirectory('math')}
            className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-slate-50/95 dark:bg-slate-800/65 hover:bg-sky-50 dark:hover:bg-sky-950/45 border border-slate-300/85 dark:border-white/10 hover:border-sky-500/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <div className="relative z-10 min-w-0">
              <span className="font-mono text-[11px] font-semibold text-sky-700 dark:text-sky-400 block">
                02 · {isEn ? 'MATHEMATICS' : 'TOÁN HỌC'}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300 truncate block transition-colors">
                {isEn ? `Math (${mathCount} lessons)` : `Bài giảng Toán (${mathCount} bài)`}
              </span>
            </div>
            <span className="relative z-10 w-8 h-8 rounded bg-sky-500/10 group-hover:bg-sky-600 text-sky-600 dark:text-sky-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => scrollToLectureDirectory('physics')}
            className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-slate-50/95 dark:bg-slate-800/65 hover:bg-amber-50 dark:hover:bg-amber-950/45 border border-slate-300/85 dark:border-white/10 hover:border-amber-500/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <div className="relative z-10 min-w-0">
              <span className="font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-400 block">
                03 · {isEn ? 'PHYSICS' : 'VẬT LÍ'}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 truncate block transition-colors">
                {isEn ? `Physics (${physicsCount} labs)` : `Bài giảng Vật lí (${physicsCount} bài)`}
              </span>
            </div>
            <span className="relative z-10 w-8 h-8 rounded bg-amber-500/12 group-hover:bg-amber-500 text-amber-600 dark:text-amber-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => scrollToLectureDirectory('cs')}
            className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-slate-50/95 dark:bg-slate-800/65 hover:bg-emerald-50 dark:hover:bg-emerald-950/45 border border-slate-300/85 dark:border-white/10 hover:border-emerald-500/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <div className="relative z-10 min-w-0">
              <span className="font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 block">
                04 · {isEn ? 'COMPUTER SCIENCE' : 'TIN HỌC'}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 truncate block transition-colors">
                {isEn
                  ? `CS 5 Roadmaps (${csCount}+${csSpecializedStageCount})`
                  : `Tin học · 5 lộ trình (${csCount} VNOI + ${csSpecializedStageCount} C++)`}
              </span>
            </div>
            <span className="relative z-10 w-8 h-8 rounded bg-emerald-500/12 group-hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => scrollToSection('classroom-exams-banner')}
            className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-slate-50/95 dark:bg-slate-800/65 hover:bg-blue-50 dark:hover:bg-blue-950/45 border border-slate-300/85 dark:border-white/10 hover:border-blue-500/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <div className="relative z-10 min-w-0">
              <span className="font-mono text-[11px] font-semibold text-blue-700 dark:text-sky-400 block">
                05 · {isEn ? 'EXAM ARCHIVE' : 'KHO ĐỀ THI'}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-sky-300 truncate block transition-colors">
                {isEn ? `${totalExams} Official Exams` : `${totalExams} Đề thi & AI chấm`}
              </span>
            </div>
            <span className="relative z-10 w-8 h-8 rounded bg-blue-500/12 group-hover:bg-blue-600 text-blue-600 dark:text-sky-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => scrollToSection('classroom-utilities')}
            className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-slate-50/95 dark:bg-slate-800/65 hover:bg-teal-50 dark:hover:bg-teal-950/45 border border-slate-300/85 dark:border-white/10 hover:border-teal-500/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <div className="relative z-10 min-w-0">
              <span className="font-mono text-[11px] font-semibold text-teal-700 dark:text-teal-400 block">
                06 · {isEn ? 'STUDY UTILITIES' : 'TIỆN ÍCH HỌC TẬP'}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 truncate block transition-colors">
                {isEn ? 'Focus Timer & Quick Notes' : 'Đồng hồ tập trung & Sổ tay'}
              </span>
            </div>
            <span className="relative z-10 w-8 h-8 rounded bg-teal-500/12 group-hover:bg-teal-600 text-teal-600 dark:text-teal-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => scrollToSection('classroom-app-download')}
            className="sm:col-span-2 lg:col-span-3 group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-gradient-to-r from-cyan-50/95 via-sky-50/90 to-emerald-50/85 dark:from-cyan-950/55 dark:via-slate-800/80 dark:to-emerald-950/45 hover:from-cyan-100 hover:to-emerald-100 dark:hover:from-cyan-900/65 dark:hover:to-emerald-950/70 border border-cyan-300/85 dark:border-cyan-500/35 hover:border-cyan-500 text-left transition-all duration-200 cursor-pointer active:scale-[0.99] shadow-xs"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <div className="relative z-10 flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-md bg-cyan-500/15 border border-cyan-400/40 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0">
                <Download className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <span className="font-mono text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 block">
                  07 · {isEn ? 'DOWNLOAD SYNAPSE APP · LAPTOP · ANDROID · IPHONE' : 'TẢI APP SYNAPSE ĐA THIẾT BỊ · PC · ANDROID · IPHONE'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-200 truncate block transition-colors">
                  {isEn
                    ? 'Scroll down for 1-click PC/Mobile install guide & full app feature matrix'
                    : 'Cuộn xuống xem hướng dẫn cài đặt 1 chạm cho Laptop, Android, iPhone & toàn bộ tính năng App'}
                </span>
              </div>
            </div>
            <span className="relative z-10 w-8 h-8 rounded bg-cyan-500/15 group-hover:bg-cyan-600 text-cyan-700 dark:text-cyan-300 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* FLAGSHIP GATEWAY: SYNAPSE PRE (ĐẠI CÔNG TRÌNH TƯƠNG LAI & PHÒNG LAB AI 3D) */}
      <section className="group sci-frame relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-950 via-[#0a1a36] to-[#0f172a] text-white p-6 sm:p-8 border border-sky-400/50 shadow-[0_20px_55px_-16px_rgba(2,132,199,0.38)] space-y-5">
        <div className="absolute inset-0 sci-blueprint-bg opacity-35 pointer-events-none" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-sky-300/12 to-transparent -translate-x-[160%] group-hover-sheen"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 220 220"
          className="hidden md:block absolute right-10 -top-10 w-56 h-56 opacity-20 group-hover:opacity-35 pointer-events-none animate-orbit-slow transition-opacity"
        >
          <circle cx="110" cy="110" r="88" fill="none" stroke="#38bdf8" strokeWidth="1.3" strokeDasharray="8 6" />
          <circle cx="110" cy="110" r="56" fill="none" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="4 5" />
          <circle cx="110" cy="22" r="4" fill="#38bdf8" />
          <circle cx="166" cy="110" r="3.5" fill="#2dd4bf" />
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-sky-500/30 to-indigo-600/40 border border-sky-300/50 flex items-center justify-center shrink-0 shadow-inner">
              <Orbit className="w-8 h-8 text-sky-300 icon-anim-cosmos" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-cyan-300">
                {isEn
                  ? 'SYNAPSE PRE · 30 MEGASTRUCTURES · PHONE SENSOR LAB · 28K GPU SANDBOX'
                  : 'SYNAPSE PRE · 30 ĐẠI CÔNG TRÌNH · CẢM BIẾN QR · HỘP CÁT GPU 28K'}
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white">
                {isEn
                  ? '30 Futuristic 3D Megastructures, Phone Sensor QR Telemetry, Dual-Hand 28K GPU Particles & AI Labs'
                  : '30 Đại Công Trình 3D, Cảm Biến Điện Thoại QR Live, Hộp Cát Hạt 28K GPU & Sinh Mô Phỏng AI'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {isEn
                  ? 'Pair your smartphone via QR WebSocket oscilloscope, sculpt 28,000 WebGL particles with both hands, alongside 30 3D Megastructures, 3D Galaxy, Text-to-Sim, Paper-to-Sim & FFT Acoustics.'
                  : 'Kết nối cảm biến gia tốc điện thoại qua QR WebSocket đo dao động thực, điều khiển 28.000 hạt lực trường GPU bằng 2 tay cùng 30 Đại công trình 3D, Vũ trụ Tri thức, Sinh Mô Phỏng AI & Quét Nháp.'}
              </p>
              {hasPremiumAccess && mySubscription && (
                <div className="pt-1 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold">
                    <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? 'Registered:' : 'Ngày đăng ký:'}</span>
                    <strong className="text-white font-mono tabular-nums">
                      {formatPreDate(mySubscription.activatedAt)}
                    </strong>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold">
                    <CalendarClock className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? 'Expires:' : 'Hết hạn:'}</span>
                    <strong className="text-amber-200 font-mono tabular-nums">
                      {formatPreDate(mySubscription.expiresAt)}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('synapse:open-scratchpad-mini'))}
              className="cs-deck-btn px-3.5 py-2.5 rounded bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/60 text-amber-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>{isEn ? 'Scratchpad Mini' : 'Bảng Nháp Mini'}</span>
            </button>
            {onOpenVoiceOS && (
              <button
                type="button"
                onClick={onOpenVoiceOS}
                className="cs-deck-btn px-3.5 py-2.5 rounded bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/60 text-cyan-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice OS</span>
              </button>
            )}
            <button
              type="button"
              data-ripple="true"
              onClick={() => setShowPremiumModal(true)}
              className="group/btn cs-deck-btn px-5 py-3 rounded bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              {hasPremiumAccess ? <RefreshCw className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
              <span>
                {hasPremiumAccess
                  ? isEn
                    ? 'Renew Plan'
                    : 'Gia hạn gói'
                  : isEn
                  ? 'Subscribe · 120k / 3 mo'
                  : 'Đăng ký · 120k / 3 tháng'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {(
            [
              {
                tab: 'megastructures',
                titleVi: 'Đại công trình tương lai',
                titleEn: 'Futuristic Megastructures',
                descVi: '30 mô hình WebGL 3D',
                icon: Building2
              },
              {
                tab: 'galaxy3d',
                titleVi: 'Vũ trụ Tri thức 3D',
                titleEn: '3D Knowledge Galaxy',
                descVi: 'Bản sao năng lực + hành tinh lỗi',
                icon: Orbit
              },
              {
                tab: 'text_to_sim',
                titleVi: 'Sinh Mô Phỏng AI',
                titleEn: 'Text → Simulation',
                descVi: 'Gõ đề bài → đồ họa 60fps',
                icon: Wand2
              },
              {
                tab: 'paper_to_sim',
                titleVi: 'Giấy Nháp → Sim',
                titleEn: 'Paper → Sim Vision',
                descVi: 'Chụp vở → mô phỏng & soi lỗi',
                icon: Camera
              },
              {
                tab: 'audio_fft',
                titleVi: 'Sóng Âm FFT 3D',
                titleEn: 'Audio FFT 3D Lab',
                descVi: 'Micro / Doppler giao thoa 3D',
                icon: Waves
              }
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() =>
                  navigate({
                    subject: 'synapse_v2',
                    futureTab: item.tab,
                    synapseMode: 'catalog',
                    tutorOpen: false
                  })
                }
                className="text-left p-3 rounded border border-slate-700/90 bg-slate-900/80 hover:bg-slate-800 hover:border-cyan-400/70 transition cursor-pointer group/tile"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 group-hover/tile:text-white">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isEn ? item.titleEn : item.titleVi}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  {item.descVi}
                </div>
              </button>
            );
          })}
        </div>

        {/* Highlighted New Hardware & GPU Physics Labs inside Synapse Pre */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() =>
              navigate({
                subject: 'synapse_v2',
                futureTab: 'phone_sensor_lab',
                synapseMode: 'catalog',
                tutorOpen: false
              })
            }
            className="text-left p-3.5 rounded border border-emerald-400/50 bg-emerald-950/35 hover:bg-emerald-900/45 hover:border-emerald-300 transition cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
                <Waves className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'NEW · Phone Sensor QR Telemetry Lab' : 'MỚI · Cảm Biến Điện Thoại QR Live Oscilloscope'}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                {isEn
                  ? 'Scan QR on mobile to stream real accelerometer/gyroscope into a dual-trace SHM pendulum curve & export CSV.'
                  : 'Quét mã QR bằng điện thoại để truyền gia tốc kế/con quay hồi chuyển lên dao động ký đôi & xuất CSV.'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-300 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() =>
              navigate({
                subject: 'synapse_v2',
                futureTab: 'dual_hand_sandbox',
                synapseMode: 'catalog',
                tutorOpen: false
              })
            }
            className="text-left p-3.5 rounded border border-cyan-400/50 bg-cyan-950/35 hover:bg-cyan-900/45 hover:border-cyan-300 transition cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-300">
                <Hand className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'NEW · Dual-Hand 28K GPU Particle Sandbox' : 'MỚI · Hộp Cát Hạt Lực Trường 2 Tay GPU 28.000 Hạt'}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                {isEn
                  ? 'Control Binary Gravity, Lorentz Magnetic, Wave Interference & Rutherford Scattering in real time with both hands.'
                  : 'Điều khiển Trọng lực đôi, Từ trường Lorentz, Giao thoa sóng & Tán xạ Rutherford mượt 60 FPS bằng 2 tay.'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-300 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (hasPremiumAccess && onOpenVoiceOS) {
                onOpenVoiceOS();
              } else {
                setShowPremiumModal(true);
              }
            }}
            className="md:col-span-2 text-left p-3.5 rounded border border-amber-400/50 bg-amber-950/30 hover:bg-amber-900/40 hover:border-amber-300 transition cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
                <Mic className="w-4 h-4 shrink-0" />
                <span>
                  {isEn
                    ? 'PRO · Synapse Voice OS — Hands-Free Voice Command System'
                    : 'PRO · Synapse Voice OS — Điều Khiển Toàn Hệ Thống Bằng Giọng Nói'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                {isEn
                  ? 'Control lectures, switch 3D labs, launch AI Pro & adjust simulation parameters hands-free with natural Vietnamese/English voice commands (Alt+Space).'
                  : 'Ra lệnh bằng giọng nói tiếng Việt/Anh tự nhiên để mở bài giảng, chuyển phòng thí nghiệm 3D, kích hoạt AI Pro & điều khiển mô phỏng hoàn toàn rảnh tay (Alt+Space).'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-300 shrink-0" />
          </button>
        </div>
      </section>

      {/* GROWTH SUITE BENTO STRIP: Streak, Daily Quests, Sổ Lỗi Sai SM-2, PDF Studio & Community Showcase */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              {isEn ? 'DAILY GROWTH & STEM TOOLS' : 'TĂNG TỐC HỌC TẬP & CỘNG ĐỒNG'}
            </div>
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isEn ? 'Streak, Error Notebook, AI Studio & 2D/3D Gallery' : 'Chuỗi Học, Sổ Lỗi Sai SM-2, Studio PDF & Thư Viện Sáng Tạo'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('growth_hub')}
            className="cs-deck-btn px-3 py-1.5 rounded bg-slate-900 dark:bg-sky-500 hover:bg-slate-800 dark:hover:bg-sky-400 text-white dark:text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 dark:text-slate-950" />
            <span>{isEn ? 'Open Growth Hub' : 'Mở Trung Tâm Ôn Lỗi & SM-2'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Streak & Daily Quests */}
          <button
            type="button"
            data-ripple="true"
            onClick={() => onNavigate('growth_hub')}
            className="group sci-frame text-left rounded-md bg-white/95 dark:bg-slate-900/90 border border-amber-300/80 dark:border-amber-500/35 hover:border-amber-500 p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-700 dark:text-amber-300">
                <Flame className="w-4 h-4 streak-flame-pulse text-amber-500" />
                {isEn ? 'Daily Streak & Quests' : 'Chuỗi Học & Nhiệm Vụ'}
              </span>
              <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 tabular-nums">
                {streakSummary.streak.currentStreak}d
              </span>
            </div>
            <div className="space-y-1.5">
              {streakSummary.streak.dailyQuests.slice(0, 2).map((q) => {
                const pct = Math.min(100, Math.round((q.progress / Math.max(1, q.target)) * 100));
                return (
                  <div key={q.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
                      <span className="truncate font-semibold">{isEn ? q.titleEn : q.titleVi}</span>
                      <span className="font-mono text-[10px] text-slate-500 tabular-nums shrink-0 ml-1">
                        {q.progress}/{q.target}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-sm bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 quest-bar-shimmer"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-[11px] font-bold text-amber-700 dark:text-amber-300 flex items-center justify-between">
              <span>{streakSummary.doneQuests}/{streakSummary.totalQuests} {isEn ? 'completed' : 'nhiệm vụ xong'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Card 2: Error Notebook & SM-2 Flashcards */}
          <button
            type="button"
            data-ripple="true"
            onClick={() => onNavigate('growth_hub')}
            className="group sci-frame text-left rounded-md bg-white/95 dark:bg-slate-900/90 border border-rose-300/80 dark:border-rose-500/35 hover:border-rose-500 p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                {isEn ? 'Error Notebook & SM-2' : 'Sổ Lỗi Sai & Thẻ SM-2'}
              </span>
              <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 tabular-nums">
                {streakSummary.dueCards} {isEn ? 'due' : 'thẻ'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isEn
                ? `${streakSummary.unresolvedErrors} unresolved mistakes auto-captured from lectures & C++ judge.`
                : `${streakSummary.unresolvedErrors} câu sai/chưa đạt đang chờ ôn lại bằng thẻ ghi nhớ ngắt quãng SM-2.`}
            </p>
            <div className="text-[11px] font-bold text-rose-700 dark:text-rose-300 flex items-center justify-between">
              <span>{isEn ? 'Review Smart Cards' : 'Ôn tập thẻ SM-2 ngay'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Card 3: PDF / Image -> 5-Step Lesson & Custom Weak-Spot Exam */}
          <button
            type="button"
            data-ripple="true"
            onClick={() => onNavigate('exams')}
            className="group sci-frame text-left rounded-md bg-white/95 dark:bg-slate-900/90 border border-sky-300/80 dark:border-sky-500/35 hover:border-sky-500 p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-700 dark:text-sky-300">
                <ClipboardCheck className="w-4 h-4 text-sky-500" />
                {isEn ? 'Weak-Spot Mock Builder' : 'Đề Thi Theo Điểm Yếu'}
              </span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300">
                PDF + AI
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isEn
                ? 'Generate targeted mock tests from your weak topics & draw directly on Scratchpad.'
                : 'Tự tạo đề thi 5–20 câu tập trung vào các lỗi sai gần đây kèm Bảng Nháp vẽ công thức.'}
            </p>
            <div className="text-[11px] font-bold text-sky-700 dark:text-sky-300 flex items-center justify-between">
              <span>{isEn ? 'Build Custom Exam' : 'Mở Kho Đề & Tạo Đề'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Card 4: Community 2D/3D/CS Showcase */}
          <button
            type="button"
            data-ripple="true"
            onClick={() => onNavigate('showcase')}
            className="group sci-frame text-left rounded-md bg-white/95 dark:bg-slate-900/90 border border-emerald-300/80 dark:border-emerald-500/35 hover:border-emerald-500 p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                <Images className="w-4 h-4 text-emerald-500" />
                {isEn ? 'Community Showcase' : 'Thư Viện Sáng Tạo'}
              </span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                2D/3D
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isEn
                ? 'Explore, like, and 1-click remix community 3D models, physics presets & algorithms.'
                : 'Khám phá, bình chọn và Remix 1 chạm các mô hình 3D, thí nghiệm Lí & code C++ hay nhất.'}
            </p>
            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
              <span>{isEn ? 'Browse Gallery' : 'Vào Thư Viện Sáng Tạo'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* SECTION 1: 3 LARGE INTERACTIVE SUBJECTS BENTO (Toán · Vật lí · Tin học) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-blue-700 dark:text-sky-400">
              {isEn ? 'INTERACTIVE SIMULATION STUDIOS' : 'PHÒNG THÍ NGHIỆM & MÔ PHỎNG'}
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              {isEn ? 'Core STEM Disciplines (Grades 9–12)' : '3 Môn Học Trọng Tâm · Mô Phỏng Trực Quan'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            {isEn
              ? 'Touch any studio frame to launch interactive 2D/3D visualizers and real-time grading.'
              : 'Chạm vào từng khung môn học để mở đồ thị, thí nghiệm 3D 60 FPS hoặc trình chấm code.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* MATH CARD: Crisp Scientific Bento Span (5 cols) */}
          <div
            data-ripple="true"
            onClick={() => onNavigate('math')}
            className="md:col-span-5 group sci-frame relative overflow-hidden bg-white/90 dark:bg-slate-900/80 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-sky-300/85 dark:border-sky-500/30 hover:border-sky-500 hover:-translate-y-0.5 rounded-xl p-6 sm:p-7 shadow-[0_14px_34px_-14px_rgba(14,165,233,0.18)] hover:shadow-[0_22px_46px_-16px_rgba(14,165,233,0.3)] transition-all cursor-pointer flex flex-col justify-between gap-6"
          >
            {/* Math Custom Animated Wave & Coordinate Grid */}
            <svg
              aria-hidden="true"
              viewBox="0 0 360 120"
              className="absolute inset-x-0 bottom-16 w-[200%] h-24 opacity-25 dark:opacity-35 pointer-events-none animate-wave-glide group-hover:opacity-55 transition-opacity"
            >
              <path
                d="M0 60 Q45 10 90 60 T180 60 T270 60 T360 60"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
              />
              <path
                d="M0 72 Q45 110 90 72 T180 72 T270 72 T360 72"
                fill="none"
                stroke="#2563eb"
                strokeWidth="1.8"
                strokeDasharray="4 4"
              />
            </svg>
            <svg
              aria-hidden="true"
              viewBox="0 0 120 120"
              className="absolute right-4 top-4 w-24 h-24 opacity-20 dark:opacity-30 pointer-events-none animate-orbit-slow"
            >
              <circle cx="60" cy="60" r="42" fill="none" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="5 5" />
              <polygon points="60,22 93,79 27,79" fill="none" stroke="#2563eb" strokeWidth="1.5" />
            </svg>

            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200/90 dark:border-sky-800/70 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <Compass className="w-6 h-6 icon-anim-compass" />
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                {isEn
                  ? `Interactive Math (${mathCount})`
                  : `Toán học tương tác (${mathCount} bài)`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Plot polynomials, logarithms, absolute values & integrals; interactive 2D geometry & 7 spatial Oxyz 3D scenes.'
                  : 'Vẽ đồ thị đa thức, logarit, trị tuyệt đối, tô diện tích tích phân; hình học kéo thả & 7 mô hình Oxyz 3D trực quan.'}
              </p>
            </div>

            <div className="relative z-10 pt-1">
              <button
                type="button"
                data-ripple="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('math');
                }}
                className="group/btn cs-deck-btn w-full min-h-[48px] px-5 py-3 rounded bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-4 h-4 icon-anim-compass shrink-0" />
                <span>{isEn ? 'Open 2D & Oxyz 3D Lab' : 'Vào Toán · Đồ thị & Oxyz 3D'}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* PHYSICS CARD: Crisp Scientific Bento Span (4 cols) */}
          <div
            data-ripple="true"
            onClick={() => onNavigate('physics')}
            className="md:col-span-4 group sci-frame relative overflow-hidden bg-white/90 dark:bg-slate-900/80 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-amber-300/85 dark:border-amber-500/30 hover:border-amber-500 hover:-translate-y-0.5 rounded-xl p-6 sm:p-7 shadow-[0_14px_34px_-14px_rgba(245,158,11,0.18)] hover:shadow-[0_22px_46px_-16px_rgba(245,158,11,0.3)] transition-all cursor-pointer flex flex-col justify-between gap-6"
          >
            {/* Physics Custom Animated Electric Current SVG Circuit */}
            <svg
              aria-hidden="true"
              viewBox="0 0 320 200"
              className="absolute inset-0 w-full h-full opacity-30 dark:opacity-45 pointer-events-none group-hover:opacity-75 transition-opacity"
            >
              <path
                d="M16 32 H130 L146 18 L162 46 L178 18 L194 32 H304 V168 H16 Z"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.6"
                strokeOpacity="0.35"
              />
              <path
                d="M16 32 H130 L146 18 L162 46 L178 18 L194 32 H304 V168 H16 Z"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.8"
                strokeLinecap="round"
                className="animate-electric-flow"
              />
              <path
                d="M210 70 L236 62 L226 84 L268 74 L250 102 L292 92"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-electric-flow-fast"
              />
              <circle cx="304" cy="32" r="4" fill="#fbbf24" />
              <circle cx="16" cy="168" r="4" fill="#0284c7" />
            </svg>

            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/90 dark:border-amber-800/70 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <Zap className="w-6 h-6 icon-anim-zap" />
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                {isEn
                  ? `Experimental Physics (${physicsCount})`
                  : `Vật lí thực nghiệm (${physicsCount} bài)`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? '19 2D labs & 14 real-time 60 FPS 3D simulations: standing waves, Doppler cones, photoelectric tube, RLC phasors, Young fringes.'
                  : '19 Lab 2D & 14 mô phỏng 3D 60 FPS: Sóng dừng, hiệu ứng Doppler, ống quang điện, mạch RLC Fresnel, giao thoa Y-âng.'}
              </p>
            </div>

            <div className="relative z-10 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                data-ripple="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('physics_sims');
                }}
                className="group/btn cs-deck-btn w-full min-h-[48px] px-4 py-3 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Atom className="w-4 h-4 icon-anim-atom shrink-0" />
                <span>{isEn ? '2D/3D Domains' : 'Mô phỏng 2D/3D'}</span>
              </button>
              <button
                type="button"
                data-ripple="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('physics');
                }}
                className="group/btn cs-deck-btn w-full min-h-[48px] px-4 py-3 rounded bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-semibold border border-amber-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Zap className="w-4 h-4 text-amber-400 icon-anim-zap shrink-0" />
                <span>{isEn ? 'Lectures & Labs' : 'Bài giảng & Lab'}</span>
              </button>
            </div>
          </div>

          {/* CS CARD: Crisp Scientific Bento Span (3 cols) */}
          <div
            data-ripple="true"
            onClick={() => onNavigate('cs')}
            className="md:col-span-3 group sci-frame relative overflow-hidden bg-white/90 dark:bg-slate-900/80 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-emerald-300/85 dark:border-emerald-500/30 hover:border-emerald-500 hover:-translate-y-0.5 rounded-xl p-6 sm:p-7 shadow-[0_14px_34px_-14px_rgba(16,185,129,0.18)] hover:shadow-[0_22px_46px_-16px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex flex-col justify-between gap-6"
          >
            {/* CS Custom Animated Code Stream + Dijkstra Graph Edge Pulse */}
            <svg
              aria-hidden="true"
              viewBox="0 0 320 200"
              className="absolute inset-0 w-full h-full opacity-25 dark:opacity-40 pointer-events-none group-hover:opacity-65 transition-opacity"
            >
              <path
                d="M195 36 L252 64 L218 112 L286 96"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.4"
                className="animate-electric-flow"
              />
              <path
                d="M195 36 L286 96"
                fill="none"
                stroke="#34d399"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <circle cx="195" cy="36" r="5" fill="#10b981" />
              <circle cx="252" cy="64" r="5" fill="#0284c7" />
              <circle cx="218" cy="112" r="5" fill="#10b981" />
              <circle cx="286" cy="96" r="6" fill="#fbbf24" />
            </svg>
            <div className="pointer-events-none absolute right-6 top-0 w-24 h-full overflow-hidden opacity-25 dark:opacity-35">
              <div className="animate-matrix-sweep font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 leading-tight select-none">
                0101101<br />DP[i][j]<br />BFS(u)<br />1010011
              </div>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/90 dark:border-emerald-800/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <Code2 className="w-6 h-6 icon-anim-code" />
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                {isEn
                  ? `CS · 5 Roadmaps (${csCount}+${csSpecializedStageCount})`
                  : `Tin học · 5 Lộ Trình (${csCount} VNOI + ${csSpecializedStageCount} C++)`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? '5 complete paths (VNOI CP + OpenEDG, Roadmap.sh, LearnCpp & GitHub C++ Career), Sublime Text 4 IDE, C++20/Python 3 Judge, Live Code-to-Animation Tracer, Thought Replay & 16 algo graphs.'
                  : 'Đủ 5 lộ trình (VNOI + OpenEDG, Roadmap.sh, LearnCpp & GitHub C++), IDE Sublime Text 4, trình chấm C++/Python, Truy vết Biến Từng Dòng + Replay Tư Duy & 16 đồ thị thuật toán.'}
              </p>
            </div>

            <div className="relative z-10 pt-1">
              <button
                type="button"
                data-ripple="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('cs');
                }}
                className="group/btn cs-deck-btn w-full min-h-[48px] px-5 py-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Code2 className="w-4 h-4 icon-anim-code shrink-0" />
                <span>{isEn ? 'Open Code Judge Lab' : 'Vào Tin Học & Code Judge'}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 3 LARGE PLATFORM FEATURE FRAMES (Roadmap · Arena · Tri-AI) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">
              {isEn ? 'GUIDED ECOSYSTEM' : 'HỆ SINH THÁI HỌC TẬP & THI ĐẤU'}
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              {isEn ? 'Roadmap, Weekly Arena & Syn AI' : 'Lộ Trình Chuẩn, Đấu Trường Tuần & Syn AI'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Frame 1: Study Roadmap */}
          <div
            data-ripple="true"
            onClick={() => onNavigate('roadmap')}
            className="group sci-frame relative overflow-hidden rounded-xl border border-blue-300/85 dark:border-blue-500/25 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 p-6 sm:p-7 min-h-[245px] shadow-[0_12px_32px_-14px_rgba(37,99,235,0.16)] hover:shadow-[0_20px_42px_-16px_rgba(37,99,235,0.28)] hover:border-blue-600 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-5"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 320 180"
              className="absolute right-0 top-0 w-56 h-40 opacity-20 dark:opacity-30 pointer-events-none transition-opacity group-hover:opacity-45"
            >
              <path
                d="M40 140 Q120 40 200 100 T300 35"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                className="animate-electric-flow"
              />
              <circle cx="40" cy="140" r="5" fill="#2563eb" />
              <circle cx="155" cy="76" r="5" fill="#0284c7" />
              <circle cx="240" cy="72" r="6" fill="#1d4ed8" />
              <circle cx="300" cy="35" r="5" fill="#0d9488" />
            </svg>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="group-hover-sheen absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-sky-400/15 to-transparent -translate-x-full" />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/70 text-blue-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <GitBranch className="w-6 h-6 icon-anim-branch" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                {isEn ? '5-Step Learning Process Map' : 'Bản đồ Quy trình Học 5 Bước'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Structured Math · Physics · CS progression from Grade 9 to 12 with prerequisites and mastery tracking.'
                  : 'Lộ trình từng chặng Toán · Lí · Tin từ Lớp 9 đến Lớp 12 có kiến thức tiên quyết và theo dõi tiến độ hoàn thành.'}
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <button
                type="button"
                data-ripple="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('roadmap');
                }}
                className="cs-deck-btn w-full px-5 py-3 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <GitBranch className="w-4 h-4 icon-anim-branch" />
                <span>{t('overview.gotoRoadmap', 'Mở Bản đồ Quy trình Học', 'Open Study Roadmap')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Frame 2: Weekly Arena & Leaderboard */}
          <div
            data-ripple="true"
            onClick={() => onNavigate('arena')}
            className="group sci-frame relative overflow-hidden rounded-xl border border-amber-300/85 dark:border-amber-500/25 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 p-6 sm:p-7 min-h-[245px] shadow-[0_12px_32px_-14px_rgba(245,158,11,0.16)] hover:shadow-[0_20px_42px_-16px_rgba(245,158,11,0.28)] hover:border-amber-500 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-5"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 220 220"
              className="absolute -right-8 -top-8 w-52 h-52 opacity-20 dark:opacity-25 pointer-events-none animate-orbit-slow group-hover:opacity-45"
            >
              <circle
                cx="110"
                cy="110"
                r="76"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.8"
                strokeDasharray="10 8"
              />
              <circle
                cx="110"
                cy="110"
                r="52"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeDasharray="6 6"
              />
              <circle cx="110" cy="34" r="4" fill="#fbbf24" />
              <circle cx="186" cy="110" r="4" fill="#f59e0b" />
            </svg>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="group-hover-sheen absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent -translate-x-full" />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/90 dark:border-amber-800/70 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Trophy className="w-6 h-6 icon-anim-trophy" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                {isEn ? 'Weekly Arena & Live Rankings' : 'Thi đấu & BXH Tuần Trực Tuyến'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Compete in MCQ or AI-graded Essay rounds (1 attempt/day/subject) with real-time weekly rankings.'
                  : 'Thi Trắc nghiệm hoặc Tự luận AI chấm (1 lần/ngày/môn). Bảng xếp hạng trực tuyến theo từng môn & Điểm Trung Bình.'}
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <button
                type="button"
                data-ripple="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('arena');
                }}
                className="cs-deck-btn w-full px-5 py-3 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4 icon-anim-trophy" />
                <span>{t('overview.gotoArena', 'Vào Thi đấu & BXH Tuần', 'Enter Weekly Arena')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Frame 3: 3 AI Tutors */}
          <div
            data-ripple="true"
            onClick={() => onOpenTutor?.('math', 'explain_no_answer')}
            className="group sci-frame relative overflow-hidden rounded-xl border border-teal-300/85 dark:border-teal-500/25 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 p-6 sm:p-7 min-h-[245px] shadow-[0_12px_32px_-14px_rgba(13,148,136,0.16)] hover:shadow-[0_20px_42px_-16px_rgba(13,148,136,0.28)] hover:border-teal-600 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-5"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 260 170"
              className="absolute right-0 top-0 w-52 h-40 opacity-20 dark:opacity-30 pointer-events-none group-hover:opacity-45 transition-opacity"
            >
              <line x1="80" y1="45" x2="180" y2="35" stroke="#0284c7" strokeWidth="1.8" className="animate-electric-flow" />
              <line x1="180" y1="35" x2="145" y2="120" stroke="#0d9488" strokeWidth="1.8" className="animate-electric-flow-fast" />
              <line x1="80" y1="45" x2="145" y2="120" stroke="#2563eb" strokeWidth="1.8" className="animate-electric-flow" />
              <circle cx="80" cy="45" r="7" fill="#2563eb" />
              <circle cx="180" cy="35" r="7" fill="#f59e0b" />
              <circle cx="145" cy="120" r="7" fill="#10b981" />
            </svg>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="group-hover-sheen absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-teal-400/20 to-transparent -translate-x-full" />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200/90 dark:border-teal-800/70 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 icon-anim-star" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                {isEn ? 'Syn AI Live Co-Pilot & Syn Reel (3 Engines)' : 'Syn AI Live Co-Pilot & Syn Reel (3 Động Cơ)'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Live Voice + Screen/Canvas Vision Co-Pilot with instant Voice Barge-In, plus Syn Reel 3B1B Motion Video generator across Syn Math, Syn Physics & Syn Code.'
                  : 'Hợp nhất Mắt Thần AI (nhìn trực tiếp màn hình/canvas + ngắt lời tức thì Voice Barge-In) và Syn Reel dựng Video 3B1B trên cả Syn Math · Syn Physics · Syn Code.'}
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <button
                type="button"
                data-ripple="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTutor?.('math', 'explain_no_answer');
                }}
                className="cs-deck-btn w-full px-5 py-3 rounded bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 icon-anim-star" />
                <span>{t('overview.openTutor', 'Mở Trung Tâm Syn AI & Syn Reel', 'Launch Syn AI & Syn Reel')}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Dedicated Syn AI (Syn Math · Syn Physics · Syn Code) × Live Co-Pilot & Syn Reel */}
      {onOpenTutor && (
        <section className="sci-frame sci-scan-bar rounded-md bg-white/90 dark:bg-slate-900/80 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-slate-200/90 dark:border-white/10 p-6 sm:p-7 shadow-[0_14px_42px_-16px_rgba(15,23,42,0.12)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/70 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-sky-400">
                <Sparkles className="w-4 h-4 icon-anim-star" />
                <span>
                  {isEn
                    ? 'Syn AI Neural Suite · Live Vision Co-Pilot & Syn Reel 3B1B Studio'
                    : 'Syn AI Neural Suite · Mắt Thần Co-Pilot & Dựng Video 3B1B (Syn Reel)'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Live Canvas/Screen Vision + Instant Voice Barge-In & 16:9 3Blue1Brown Motion Reels. Shortcuts: Left Ctrl+D/F/G.'
                  : 'Hỗ trợ Mắt Thần nhìn trực tiếp bài/màn hình + Voice Ngắt lời tức thì & Syn Reel xuất video .webm 3Blue1Brown. Mở nhanh: Ctrl(trái)+D/F/G.'}
              </p>
            </div>
            {hasPremiumAccess && (
              <button
                type="button"
                onClick={() =>
                  navigate({
                    subject: 'overview',
                    tutorOpen: true,
                    tutorSubject: 'math',
                    tutorTab: 'motion_reel'
                  })
                }
                className="cs-deck-btn px-3.5 py-2 rounded bg-gradient-to-r from-amber-500 via-orange-500 to-sky-600 hover:brightness-110 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEn ? 'Open Syn Reel Mini-Chat' : 'Mở Syn Reel · Tạo Video 3B1B'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiCards.map((item) => {
              const iconAnimClass =
                item.subj === 'math'
                  ? 'icon-anim-compass'
                  : item.subj === 'physics'
                  ? 'icon-anim-zap'
                  : 'icon-anim-code';
              return (
                <div
                  key={item.subj}
                  className={`group sci-frame relative overflow-hidden rounded-lg border p-4 sm:p-5 flex flex-col justify-between gap-3.5 hover:-translate-y-0.5 transition-all duration-200 ${item.accent}`}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
                  />
                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${item.badge}`}
                      >
                        <span className={iconAnimClass}>{item.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-display text-base font-semibold text-slate-900 dark:text-white leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          {item.sub}
                        </p>
                      </div>
                    </div>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/90 dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                      {item.shortcut}
                    </kbd>
                  </div>

                  <div className="relative z-10 space-y-2">
                    {aiModes.map((m) => (
                      <button
                        key={m.mode}
                        type="button"
                        data-ripple="true"
                        onClick={() => {
                          if (m.mode === 'motion_reel') {
                            navigate({
                              subject: 'overview',
                              tutorOpen: true,
                              tutorSubject: item.subj,
                              tutorTab: 'motion_reel'
                            });
                          } else {
                            onOpenTutor(item.subj, m.mode);
                          }
                        }}
                        className={`group/mode cs-deck-btn w-full text-left px-3.5 py-2.5 rounded bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${item.btn}`}
                      >
                        <span className="truncate">{m.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover/mode:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 4: Featured Exam Bank Banner */}
      <section
        id="classroom-exams-banner"
        data-ripple="true"
        onClick={() => onNavigate('exams')}
        className="group scroll-mt-24 sci-frame relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-950 via-[#0a1a36] to-slate-900 border border-sky-500/35 hover:border-sky-400/80 hover:-translate-y-0.5 p-6 sm:p-8 shadow-xl cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6"
      >
        <div className="absolute inset-0 sci-blueprint-bg opacity-25 pointer-events-none" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-300/12 to-transparent -translate-x-[160%] group-hover-sheen"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 240 120"
          className="hidden md:block absolute right-52 top-1/2 -translate-y-1/2 w-56 h-28 opacity-20 group-hover:opacity-45 pointer-events-none transition-opacity"
        >
          <path
            d="M12 88 L46 88 L66 36 L86 98 L108 48 L130 78 L158 26 L186 64 L228 64"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-electric-flow"
          />
          <circle cx="66" cy="36" r="4" fill="#fbbf24" className="math-focus-pulse" />
          <circle cx="158" cy="26" r="4" fill="#34d399" className="math-focus-pulse" />
        </svg>

        <div className="relative z-10 flex items-start sm:items-center gap-4 max-w-2xl min-w-0">
          <div className="w-12 h-12 rounded-lg bg-cyan-500/15 border border-cyan-400/35 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6 icon-anim-list" />
          </div>
          <div className="space-y-1.5 min-w-0">
            <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 tabular-nums">
              {isEn
                ? `2025 - 2026 Exam Archive · ${chuyenExams} Specialized & ${standardExams} Standard`
                : `Kho Đề Thi Chuẩn 2025 - 2026 · ${chuyenExams} Chuyên & ${standardExams} Không Chuyên`}
            </div>
            <h3 className="font-display text-lg sm:text-2xl font-semibold text-white tracking-tight tabular-nums">
              {isEn
                ? `${totalExams} Full Exam Bank, AI Photo Grading & Step-by-Step Solutions`
                : `Kho ${totalExams} Đề Thi, Nộp Ảnh Chấm Điểm AI & Giải Chi Tiết (Toán · Lí · Tin)`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isEn
                ? 'Official and specialized Olympiad exams with built-in timer, drag-drop/Ctrl+V/voice problem upload, handwritten photo AI grading (0–10), and Q&A.'
                : 'Tuyển tập đề thi từ KHTN, Sư Phạm, Amsterdam, Lê Hồng Phong... kèm đồng hồ bấm giờ, tải đề ảnh/Ctrl+V/giọng nói, nộp ảnh AI chấm điểm 0–10 & hỏi đáp.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          data-ripple="true"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('exams');
          }}
          className="group/btn cs-deck-btn relative z-10 shrink-0 w-full sm:w-auto px-6 py-3 rounded bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span>{isEn ? `Explore ${totalExams} exams` : `Khám phá ${totalExams} đề thi`}</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* SECTION 5: Classroom Focus Utilities (Synced Study-Format Pomodoro + Bells + Quick Notebook) */}
      <section id="classroom-utilities" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Focus Timer synced with Bottom-Left Floating Widget */}
        <div className="group lg:col-span-5 sci-frame bg-white/90 dark:bg-slate-900/80 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-sky-200/85 dark:border-sky-500/25 hover:border-sky-400/75 rounded-xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4 transition-all">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-sky-400 icon-anim-clock" />
                {isEn ? 'Focus Timer & Study Formats' : 'Đồng hồ tập trung & Hình thức học'}
              </h3>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => onNavigate('growth_hub')}
                  className="cs-deck-btn inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/60 text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100 cursor-pointer tabular-nums"
                  title={isEn ? 'View Streak & SM-2 Growth Hub' : 'Xem Chuỗi ngày học Streak & Hồ sơ tăng trưởng'}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500 streak-flame-pulse shrink-0" />
                  <span>{streakSummary.streak.currentStreak}d</span>
                  <span className="opacity-50">·</span>
                  <span>{currentXP} XP</span>
                </button>
                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => setIsWidgetOpen(true)}
                  className="group/mini cs-deck-btn flex items-center gap-1 px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950/60 border border-sky-300/70 dark:border-sky-700/60 text-[11px] font-semibold text-sky-800 dark:text-sky-300 hover:bg-sky-100 cursor-pointer"
                  title={isEn ? 'Open corner mini widget' : 'Mở khung bấm giờ góc trái'}
                >
                  <PanelBottomOpen className="w-3.5 h-3.5 group-hover/mini:translate-y-0.5 transition-transform" />
                  <span>{isEn ? 'Mini Corner' : 'Góc trái'}</span>
                </button>
              </div>
            </div>

            {/* Study Format Selector Grid */}
            <div className="grid grid-cols-3 gap-1.5">
              {STUDY_FORMAT_PRESETS.map((preset) => {
                const active = studyFormat === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    data-ripple="true"
                    onClick={() => setStudyFormat(preset.id)}
                    className={`cs-deck-btn px-2 py-1.5 rounded text-[11px] font-semibold border transition-all cursor-pointer truncate ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-sky-500'
                    }`}
                  >
                    {isEn ? preset.labelEn : preset.labelVi}
                  </button>
                );
              })}
            </div>

            {/* Phase Switch + Sessions Count */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 p-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-white/10">
                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => switchPhase('focus')}
                  className={`cs-deck-btn px-2.5 py-1 rounded-sm font-semibold cursor-pointer ${
                    phase === 'focus'
                      ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-sky-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {isEn ? 'Focus' : 'Tập trung'}
                </button>
                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => switchPhase('break')}
                  className={`cs-deck-btn px-2.5 py-1 rounded-sm font-semibold cursor-pointer ${
                    phase === 'break'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {isEn ? 'Break' : 'Nghỉ ngơi'}
                </button>
              </div>
              <span className="font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                {completedSessions} {isEn ? 'done' : 'phiên'}
              </span>
            </div>

            {/* SVG Circular Ring */}
            <div className="flex flex-col items-center justify-center py-1">
              <div className={`relative w-40 h-40 flex items-center justify-center ${isTimerRunning ? 'timer-active-glow' : ''}`}>
                <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140" aria-hidden="true">
                  <circle
                    cx="70"
                    cy="70"
                    r="64"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                    className={`text-sky-400/35 dark:text-sky-400/25 ${isTimerRunning ? 'animate-orbit-slow' : ''}`}
                    style={{ transformOrigin: '70px 70px' }}
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="58"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-200/80 dark:text-slate-800"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="58"
                    fill="none"
                    stroke={phase === 'break' ? '#10b981' : isTimerRunning ? '#f59e0b' : '#0284c7'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 58}
                    strokeDashoffset={(2 * Math.PI * 58) * (1 - timeLeft / Math.max(1, totalDuration))}
                    className="transition-[stroke-dashoffset,stroke] duration-500 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-white tabular-nums">
                    {formatTimer(timeLeft)}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
                    {alarmRinging
                      ? isEn
                        ? 'Bell Ringing!'
                        : 'Đổ chuông!'
                      : isTimerRunning
                      ? phase === 'break'
                        ? isEn
                          ? 'Break Time'
                          : 'Đang nghỉ'
                        : isEn
                        ? 'Focusing'
                        : 'Đang học'
                      : isEn
                      ? 'Ready'
                      : 'Sẵn sàng'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bell & Ambient Sound Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <Bell className="w-3.5 h-3.5 text-amber-500 icon-anim-bell shrink-0" />
                <select
                  value={bellSound}
                  onChange={(e) => {
                    const nextId = e.target.value as typeof bellSound;
                    setBellSound(nextId);
                    playBell(nextId);
                  }}
                  className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer truncate max-w-[140px]"
                  aria-label={isEn ? 'Alarm bell sound' : 'Chọn chuông báo'}
                >
                  {BELL_SOUND_OPTIONS.map((b) => (
                    <option key={b.id} value={b.id} className="bg-white dark:bg-slate-900">
                      {isEn ? b.labelEn : b.labelVi}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => playBell()}
                  className="cs-deck-btn px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-900/65 text-amber-800 dark:text-amber-300 text-[10px] font-semibold cursor-pointer"
                >
                  {isEn ? 'Test' : 'Thử'}
                </button>
              </div>

              <button
                type="button"
                data-ripple="true"
                onClick={toggleBgPlaying}
                className={`group/amb cs-deck-btn flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                  isBgPlaying && bgSound !== 'off'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-200/70 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isBgPlaying && bgSound !== 'off' ? (
                  <Volume2 className="w-3.5 h-3.5 icon-anim-wave" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 group-hover/amb:scale-110 transition-transform" />
                )}
                <span>{isEn ? 'Ambient' : 'Nhạc nền'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-200/70 dark:border-white/10">
            {alarmRinging && (
              <button
                type="button"
                data-ripple="true"
                onClick={dismissAlarm}
                className="cs-deck-btn px-4 py-2.5 rounded text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                {isEn ? 'Stop Bell' : 'Tắt chuông'}
              </button>
            )}
            <button
              type="button"
              data-ripple="true"
              onClick={toggleTimer}
              className={`group/start cs-deck-btn px-6 py-2.5 rounded text-xs sm:text-sm font-semibold text-white flex items-center gap-2 transition-all cursor-pointer ${
                isTimerRunning
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isTimerRunning ? (
                <Pause className="w-4 h-4 group-hover/start:scale-110 transition-transform" />
              ) : (
                <Play className="w-4 h-4 fill-white group-hover/start:translate-x-0.5 transition-transform" />
              )}
              {isTimerRunning
                ? isEn
                  ? 'Pause'
                  : 'Tạm dừng'
                : isEn
                ? 'Start Focus'
                : 'Bắt đầu học'}
            </button>
            <button
              type="button"
              data-ripple="true"
              onClick={resetTimer}
              className="group/rst cs-deck-btn p-2.5 text-slate-500 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-all cursor-pointer"
              title={isEn ? 'Reset Timer' : 'Đặt lại đồng hồ'}
            >
              <RotateCcw className="w-4 h-4 group-hover/rst:-rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Quick Classroom Notes */}
        <div className="group lg:col-span-7 sci-frame bg-white/90 dark:bg-slate-900/80 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-slate-200/90 dark:border-white/10 hover:border-sky-400/60 rounded-xl p-6 sm:p-7 shadow-xs flex flex-col transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-sky-400 icon-anim-book" />
              {isEn ? 'Personal Study Quick Notes' : 'Sổ tay ghi chú bài học cá nhân'}
            </h3>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {notes.length} {isEn ? 'notes' : 'ghi chú'}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              placeholder={
                isEn
                  ? 'Write a quick formula or study reminder...'
                  : 'Ghi lại công thức hoặc mẹo học nhanh...'
              }
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/90 dark:bg-slate-800/60 border border-slate-300/80 dark:border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
            />
            <button
              type="button"
              data-ripple="true"
              onClick={handleAddNote}
              className="group/add cs-deck-btn px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 icon-anim-plus" />
              {isEn ? 'Save' : 'Lưu'}
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-56 pr-1">
            {notes.map((n) => (
              <div
                key={n.id}
                className="animate-msg-in p-3 bg-slate-50/85 dark:bg-slate-800/45 rounded-lg border border-slate-200/70 dark:border-white/10 hover:border-sky-400/65 hover:-translate-y-0.5 flex items-start justify-between gap-3 text-xs transition-all"
              >
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{n.text}</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">{n.date}</span>
                </div>
                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => handleDeleteNote(n.id)}
                  className="text-slate-400 hover:text-red-500 hover:scale-110 p-1 rounded transition-all cursor-pointer"
                  aria-label={isEn ? 'Delete note' : 'Xóa ghi chú'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5B: Dedicated Live Meet & Shared 3D Classroom Frame */}
      <LiveMeetShowcaseCard
        id="classroom-live-meet"
        isEn={isEn}
        onOpenMeet={() => onNavigate('live_meet')}
      />

      {/* SECTION 6: Complete Lecture Directory (Target of Mục lục, Lazy-Loaded) */}
      <div className="cv-auto">
        <Suspense
          fallback={
            <div className="py-10 text-center text-xs text-slate-400">
              {isEn ? 'Loading lecture directory...' : 'Đang tải mục lục bài giảng...'}
            </div>
          }
        >
          <LectureDirectorySection
            id="classroom-lecture-directory"
            subjectFilter={directorySubject}
            onSubjectFilterChange={setDirectorySubject}
            onSelectLecture={handleSelectLectureFromDirectory}
            onSelectCsTrack={handleSelectCsTrackFromDirectory}
          />
        </Suspense>
      </div>

      {/* SECTION 7: Multi-Device App Download Guide & Full Feature Matrix */}
      <div className="cv-auto">
        <AppDownloadGuideSection
          id="classroom-app-download"
          onOpenInstallApp={onOpenInstallApp}
          showFeatureMatrix={true}
        />
      </div>

      {/* SECTION 8: Community Reviews, Star Ratings & Favorite Votes */}
      <div className="cv-auto">
        <PlatformReviews id="platform-reviews" />
      </div>

      {/* Synapse Pre (120k / 3 tháng) Registration & Admin Approval Modal */}
      <SynapsePremiumGateModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onEnterPremium={() => {
          setShowPremiumModal(false);
          navigate({
            subject: 'synapse_v2',
            futureTab: 'what_if_physics_3d',
            synapseMode: 'catalog',
            tutorOpen: false,
          });
        }}
      />
    </div>
  );
};
