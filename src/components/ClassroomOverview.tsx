import React, { useState, useEffect } from 'react';
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
  Wand2,
  Camera,
  Grid3X3,
  Waves,
  Mic,
  Building2,
  PenTool
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { useFocusTimer, STUDY_FORMAT_PRESETS } from '../context/FocusTimerContext';
import { useAudio } from '../context/AudioContext';
import { BELL_SOUND_OPTIONS } from '../lib/soundEngine';
import { EXAM_PAPERS } from '../data/examData';
import { MATH_LECTURES } from '../data/curriculumData';
import { PHYSICS_LESSONS } from '../data/physicsLessonsData';
import { getPhysicsSimCounts } from '../data/physicsDomainsData';
import { CS_LESSONS } from '../data/csLessonsData';
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
import {
  LectureDirectorySection,
  DirectorySubjectFilter,
  LectureDirectoryTarget
} from './common/LectureDirectorySection';
import { downloadSynapsePresentationDocx } from '../utils/productDocxExporter';

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
  const totalExams = EXAM_PAPERS.length;
  const chuyenExams = EXAM_PAPERS.filter((e) => e.track === 'chuyen').length;
  const standardExams = EXAM_PAPERS.filter((e) => e.track === 'khong_chuyen').length;
  const csSpecializedStageCount = CS_SPECIALIZED_TRACKS.reduce((s, t) => s + t.stages.length, 0);
  const totalLessons = MATH_LECTURES.length + PHYSICS_LESSONS.length + CS_LESSONS.length;

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

  const aiModes = [
    {
      mode: 'explain_no_answer' as const,
      label: isEn
        ? '1. Guided Explain (No Final Answer)'
        : '1. Giảng gợi mở (Không lộ đáp án)'
    },
    {
      mode: 'full_solution' as const,
      label: isEn
        ? '2. Full Solution & 4-Step Method'
        : '2. Giải chi tiết & Phương pháp 4 bước'
    },
    {
      mode: 'diagnostic_roadmap' as const,
      label: isEn
        ? '3. Skill Test & Personalized Roadmap'
        : '3. Test năng lực & Vẽ lộ trình ngành'
    }
  ];

  return (
    <div className="space-y-10">
      {/* FRAMELESS BLENDED HERO STAGE: Typography floats directly over the animated scene */}
      <section className="relative bg-transparent border-0 shadow-none px-2 sm:px-6 pt-4 pb-8 sm:pt-8 sm:pb-12">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="text-xs sm:text-sm font-semibold tracking-wider text-accent-gradient hero-blend-shadow">
            {t(
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
                `Hệ sinh thái học tập STEM toàn diện cho Toán (2D & Oxyz 3D tách trang riêng), Vật lí (${phyCounts.domainCount} lĩnh vực · ${phyCounts.count2D} Lab 2D & ${phyCounts.count3D} mô hình 3D + 36 dụng cụ kéo thả), Tin học (5 lộ trình VNOI & C++ Quốc tế · IDE Sublime Text 4), Synapse Pre (30 Đại công trình tương lai & Phòng Lab AI 3D), Học cảm giác 3D 10 ngón tay, Syn AI (Syn Math · Syn Physics · Syn Code), Kho Đề thi chấm ảnh AI, Đấu trường tuần & App đa thiết bị.`,
                `Complete interactive STEM ecosystem: Math (standalone 2D & Oxyz 3D Studio), Physics (${phyCounts.domainCount} domains · ${phyCounts.count2D} 2D + ${phyCounts.count3D} 3D labs + 36 drag-and-drop tools), CS (5 VNOI & C++ roadmaps + Sublime Text 4 IDE), Synapse Pre (30 Futuristic Megastructures & AI 3D Labs), 10-finger Spatial 3D, Syn AI suite, AI-graded Exams, Weekly Arena & Cross-Device App.`
              );
            })()}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToLectureDirectory('all')}
              className="group cs-deck-btn min-h-[50px] px-7 py-3.5 rounded bg-accent-solid text-sm sm:text-base font-semibold shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer whitespace-nowrap"
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
              className="group cs-deck-btn min-h-[50px] px-7 py-3.5 rounded bg-white/60 dark:bg-slate-900/50 backdrop-blur-md border border-slate-300/75 dark:border-white/20 hover:border-sky-400 text-slate-900 dark:text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <Atom className="w-5 h-5 text-amber-500 dark:text-amber-300 icon-anim-atom shrink-0" />
              <span>{isEn ? 'Open 2D/3D Simulations' : 'Mở Phòng Mô phỏng 2D/3D'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            <button
              type="button"
              disabled={downloadingDocx}
              onClick={() => {
                if (downloadingDocx) return;
                setDownloadingDocx(true);
                void downloadSynapsePresentationDocx().finally(() => setDownloadingDocx(false));
              }}
              className="group cs-deck-btn min-h-[50px] px-6 py-3.5 rounded bg-emerald-600/95 hover:bg-emerald-500 disabled:opacity-70 border border-emerald-400/70 text-white text-sm sm:text-base font-semibold shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
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

          {/* Live Dynamic Background, Creature, Font, Color Palette & Cursor-Dodge Studio Bar */}
          <AppearanceStudioBar />

          {/* Frameless Inline Academic Metrics & Learner Mastery Strip */}
          <div className="mt-4 pt-5 border-t border-slate-300/50 dark:border-white/12 grid grid-cols-1 md:grid-cols-12 gap-5 items-center text-left">
            <div className="md:col-span-7 grid grid-cols-3 gap-4 text-center md:text-left">
              <div className="group/stat px-2 py-1">
                <div className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tabular-nums hero-blend-shadow">
                  {totalLessons}
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5 hero-blend-shadow">
                  {isEn ? 'Interactive Lessons' : 'Bài giảng nhiều phần'}
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
                {isEn ? `Math (${MATH_LECTURES.length} lessons)` : `Bài giảng Toán (${MATH_LECTURES.length} bài)`}
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
                {isEn ? `Physics (${PHYSICS_LESSONS.length} labs)` : `Bài giảng Vật lí (${PHYSICS_LESSONS.length} bài)`}
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
                  ? `CS 5 Roadmaps (${CS_LESSONS.length}+${csSpecializedStageCount})`
                  : `Tin học · 5 lộ trình (${CS_LESSONS.length} VNOI + ${csSpecializedStageCount} C++)`}
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
                  ? 'SYNAPSE PRE · 30 FUTURISTIC MEGASTRUCTURES & AI 3D LAB'
                  : 'SYNAPSE PRE · ĐẠI CÔNG TRÌNH TƯƠNG LAI & PHÒNG LAB AI 3D'}
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white">
                {isEn
                  ? '30 Futuristic 3D Megastructures, 3D Neural Galaxy, AI Sim Compiler & Audio FFT 3D'
                  : '30 Đại Công Trình Tương Lai 3D, Vũ Trụ Tri Thức 3D, Sinh Mô Phỏng AI & Quét Giấy Nháp'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {isEn
                  ? 'CERN LHC · James Webb · Dyson Black Hole · Tokamak Fusion alongside personal 3D Knowledge Galaxy, Text-to-Sim, Paper-to-Sim Vision & FFT 3D Acoustics.'
                  : 'Hợp nhất 30 đại công trình 3D (CERN LHC, James Webb, Hố đen Dyson, Lò Tokamak) cùng Vũ trụ Tri thức 3D, Sinh Mô Phỏng AI, Giấy Nháp → Sim & Sóng Âm FFT 3D.'}
              </p>
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
              onClick={() => navigate({ subject: 'synapse_v2', futureTab: 'megastructures', synapseMode: 'catalog', tutorOpen: false })}
              className="group/btn cs-deck-btn px-5 py-3 rounded bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-400 hover:from-sky-300 hover:to-indigo-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Orbit className="w-4 h-4 icon-anim-cosmos" />
              <span>{isEn ? 'Enter Synapse Pre' : 'Mở Synapse Pre'}</span>
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
      </section>

      {/* GATEWAY: HỌC CẢM GIÁC 3D · WEBCAM HAND-GESTURE & OXYZ LAB */}
      <section
        data-ripple="true"
        onClick={() => onNavigate('spatial_3d')}
        className="group sci-frame relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-950 via-[#08222a] to-slate-900 text-white p-6 sm:p-7 border border-teal-400/45 hover:border-cyan-300/90 hover:-translate-y-0.5 shadow-[0_20px_55px_-16px_rgba(20,184,166,0.3)] cursor-pointer transition-all"
      >
        <div className="absolute inset-0 sci-blueprint-bg opacity-30 pointer-events-none" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-teal-300/12 to-transparent -translate-x-[160%] group-hover-sheen"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 220 140"
          className="hidden md:block absolute right-14 top-1/2 -translate-y-1/2 w-52 h-32 opacity-22 group-hover:opacity-45 pointer-events-none transition-opacity"
        >
          <path d="M18 110 L58 48 L96 86 L140 30 L188 74" fill="none" stroke="#2dd4bf" strokeWidth="1.8" className="animate-electric-flow" />
          <circle cx="58" cy="48" r="4.5" fill="#2dd4bf" className="math-focus-pulse" />
          <circle cx="96" cy="86" r="4.5" fill="#38bdf8" />
          <circle cx="140" cy="30" r="4.5" fill="#fbbf24" className="math-focus-pulse" />
          <circle cx="188" cy="74" r="4.5" fill="#2dd4bf" />
        </svg>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-teal-500/30 to-cyan-500/35 border border-teal-300/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Hand className="w-7 h-7 text-teal-300 icon-anim-hand" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-teal-300">
                {isEn
                  ? 'SPATIAL 2D/3D GESTURE LAB · 10-FINGERTIP AI SENSOR'
                  : 'KHU VỰC MỚI · HỌC CẢM GIÁC 3D · CẢM BIẾN 10 ĐẦU NGÓN TAY'}
              </div>
              <h2 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-white">
                {isEn
                  ? '2D Interactive Geometry Studio & 15 Realistic 3D Models via Live Webcam Hand Tracking'
                  : 'Xưởng Hình Học 2D Trực Quan & 15 Mô Hình 3D Thực Tế Điều Khiển Bằng 10 Đầu Ngón Tay'}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {isEn
                  ? '6 2D Interactive Labs · 15 3D Kinetic Systems (Turbofan, Solar Orrery, Live Hand-IK Robot Arm, Wind Tunnel, Bridge) · Dual-Hand Sculpting.'
                  : '6 Xưởng hình học 2D (Đa giác Euler, Compa, Vector Oxy, Đối xứng, Conic) · 15 Mô hình 3D tiên tiến (Động cơ phản lực, Hệ Mặt Trời, Cánh tay Robot IK, Hầm gió) · Chụm ngón sáng tạo.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            data-ripple="true"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('spatial_3d');
            }}
            className="group/btn cs-deck-btn shrink-0 px-5 py-3.5 rounded bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-slate-950 font-semibold text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Hand className="w-4 h-4 icon-anim-hand" />
            <span>{isEn ? 'Open Spatial 3D Lab' : 'Vào Học cảm giác 3D'}</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* GATEWAY: HỌC CẢM GIÁC 3D · WEBCAM HAND-GESTURE & OXYZ LAB (already above) */}

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
                  ? `Interactive Math (${MATH_LECTURES.length})`
                  : `Toán học tương tác (${MATH_LECTURES.length} bài)`}
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
                  ? `Experimental Physics (${PHYSICS_LESSONS.length})`
                  : `Vật lí thực nghiệm (${PHYSICS_LESSONS.length} bài)`}
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
                  ? `CS · 5 Roadmaps (${CS_LESSONS.length}+${csSpecializedStageCount})`
                  : `Tin học · 5 Lộ Trình (${CS_LESSONS.length} VNOI + ${csSpecializedStageCount} C++)`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? '5 complete paths (VNOI CP + OpenEDG, Roadmap.sh, LearnCpp & GitHub C++ Career), Sublime Text 4 IDE, C++20/Python 3 Judge & 16 algo visualizers.'
                  : 'Đủ 5 lộ trình (VNOI Thi đấu + OpenEDG C++, Roadmap.sh, LearnCpp & GitHub C++), IDE Sublime Text 4, trình chấm C++/Python + AI & 16 đồ thị thuật toán.'}
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
                {isEn ? 'Syn AI Command Suite (3 Engines)' : 'Hệ Sinh Thái Syn AI (3 Động Cơ)'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Independent Syn Math, Syn Physics & Syn Code engines with Guided Hints, Full Solution, and Diagnostic Roadmap modes.'
                  : 'Bộ 3 Syn Math · Syn Physics · Syn Code độc lập với 3 chế độ thực chiến: Giảng gợi mở, Giải 4 bước, và Test vẽ lộ trình.'}
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
                <span>{t('overview.openTutor', 'Mở Trung Tâm Syn AI', 'Launch Syn AI Suite')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Dedicated Syn AI (Syn Math · Syn Physics · Syn Code) × 3 Modes */}
      {onOpenTutor && (
        <section className="sci-frame sci-scan-bar rounded-md bg-white/90 dark:bg-slate-900/80 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-slate-200/90 dark:border-white/10 p-6 sm:p-7 shadow-[0_14px_42px_-16px_rgba(15,23,42,0.12)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/70 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-sky-400">
                <Sparkles className="w-4 h-4 icon-anim-star" />
                <span>
                  {isEn
                    ? 'Syn AI Neural Suite · 3 Engines × 3 Tactical Modes'
                    : 'Syn AI Neural Suite · 3 Động Cơ × 3 Chế Độ Thực Chiến'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Real-time streaming & Voice Mic input. Launch Syn Math (Left Ctrl+D), Syn Physics (Left Ctrl+F), or Syn Code (Left Ctrl+G).'
                  : 'Hỗ trợ AI thời gian thực & nhập đề bằng Giọng nói. Mở nhanh bằng Ctrl(trái)+D (Syn Math), Ctrl(trái)+F (Syn Physics), Ctrl(trái)+G (Syn Code).'}
              </p>
            </div>
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
                        onClick={() => onOpenTutor(item.subj, m.mode)}
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
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-sky-400 icon-anim-clock" />
                {isEn ? 'Focus Timer & Study Formats' : 'Đồng hồ tập trung & Hình thức học'}
              </h3>
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

      {/* SECTION 6: Complete Lecture Directory (Target of Mục lục) */}
      <LectureDirectorySection
        id="classroom-lecture-directory"
        subjectFilter={directorySubject}
        onSubjectFilterChange={setDirectorySubject}
        onSelectLecture={handleSelectLectureFromDirectory}
        onSelectCsTrack={handleSelectCsTrackFromDirectory}
      />

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
    </div>
  );
};
