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
  Atom
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
import { CS_LESSONS } from '../data/csLessonsData';
import { PlatformReviews } from './common/PlatformReviews';
import {
  LectureDirectorySection,
  DirectorySubjectFilter,
  LectureDirectoryTarget
} from './common/LectureDirectorySection';

interface ClassroomOverviewProps {
  onNavigate: (subject: SubjectType) => void;
  xp: number;
  onOpenTutor?: (subject?: 'math' | 'physics' | 'cs', mode?: AITutorMode) => void;
  onOpenSettings?: () => void;
}

export const ClassroomOverview: React.FC<ClassroomOverviewProps> = ({
  onNavigate,
  xp,
  onOpenTutor,
  onOpenSettings
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
      title: isEn ? 'Math AI Tutor' : 'AI Toán Học',
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
      title: isEn ? 'Physics AI Tutor' : 'AI Vật Lí',
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
      title: isEn ? 'CS & Code AI Tutor' : 'AI Tin Học & Code',
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
      {/* HERO: Centered Modern Academic STEM Atelier */}
      <section className="sci-frame relative overflow-hidden rounded-lg bg-gradient-to-b from-[#0b1730] via-[#0f2144] to-[#091328] text-white px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16 border border-sky-400/25 shadow-[0_24px_64px_-20px_rgba(15,23,42,0.72)]">
        {/* Precision Blueprint Drafting Grid & Subtle Focal Glow */}
        <div className="absolute inset-0 sci-blueprint-bg opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.18),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(14,165,233,0.12),transparent_55%)] pointer-events-none" />

        {/* Left Educational Schematic: Coordinate Parabola & Harmonic Wave (Desktop) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 240 260"
          className="hidden lg:block absolute left-4 top-6 w-52 h-56 opacity-40 pointer-events-none"
        >
          <line x1="28" y1="220" x2="220" y2="220" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.45" />
          <line x1="44" y1="20" x2="44" y2="236" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.45" />
          <path
            d="M44 195 Q110 25 196 175"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="animate-electric-flow"
          />
          <path
            d="M32 135 Q70 88 108 135 T184 135 T224 135"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="1.6"
            strokeDasharray="5 5"
            className="sci-oscilloscope-path"
          />
          <circle cx="114" cy="96" r="4.5" fill="#fbbf24" />
          <line x1="64" y1="96" x2="176" y2="96" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.7" />
          <text x="196" y="212" fill="#7dd3fc" fontSize="10" fontFamily="monospace">Oxy</text>
          <text x="122" y="88" fill="#fde68a" fontSize="10" fontFamily="monospace">f'(x)=0</text>
        </svg>

        {/* Right Educational Schematic: Bohr Atom & Logic Circuit Graph (Desktop) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 240 260"
          className="hidden lg:block absolute right-4 top-6 w-52 h-56 opacity-40 pointer-events-none"
        >
          <g className="physics-anim-orbit" style={{ transformOrigin: '132px 108px' }}>
            <ellipse cx="132" cy="108" rx="68" ry="26" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <ellipse cx="132" cy="108" rx="68" ry="26" transform="rotate(60 132 108)" fill="none" stroke="#fbbf24" strokeWidth="1.4" />
            <ellipse cx="132" cy="108" rx="68" ry="26" transform="rotate(-60 132 108)" fill="none" stroke="#34d399" strokeWidth="1.4" />
          </g>
          <circle cx="132" cy="108" r="8" fill="#f59e0b" />
          <circle cx="200" cy="108" r="3.5" fill="#38bdf8" />
          <circle cx="96" cy="52" r="3.5" fill="#34d399" />
          <path
            d="M42 214 L92 184 L148 214 L204 188"
            fill="none"
            stroke="#34d399"
            strokeWidth="1.8"
            className="animate-electric-flow"
          />
          <circle cx="92" cy="184" r="4" fill="#34d399" />
          <circle cx="148" cy="214" r="4" fill="#38bdf8" />
          <circle cx="204" cy="188" r="4" fill="#fbbf24" />
        </svg>

        {/* Centered Academic Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="text-xs sm:text-sm font-medium tracking-wider text-sky-300">
            {t(
              'overview.badge',
              'Học viện Mô phỏng Trực quan · Toán · Vật lí · Tin học (Lớp 9 – 12)',
              'Interactive STEM Academy · Math · Physics · Computer Science (Grades 9–12)'
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.7rem] font-semibold tracking-tight text-white leading-[1.18] text-balance max-w-3xl mx-auto">
            {t(
              'overview.heroTitle',
              'Bục giảng ảo: Khám phá trực quan Toán học, Vật lí & Tin học (Lớp 9 – 12)',
              'Synapse Classroom: Math, Physics & Computer Science (Grades 9–12)'
            )}
          </h1>

          <p className="text-sm sm:text-base font-normal text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t(
              'overview.heroDesc',
              'Bài giảng 5 phần tích hợp đồ thị hàm số & 7 cảnh Oxyz 3D (Toán), phòng thí nghiệm 2D/3D 60 FPS (Lí), cùng IDE Sublime Text 4 + chấm code AI & 16 đồ thị thuật toán (Tin).',
              '5-step lectures with 2D/3D graphers and Oxyz geometry (Math), real-time 60fps 2D/3D labs (Physics), and Sublime Text 4 coding studio with AI grading & 16 algorithm visualizers (CS).'
            )}
          </p>

          {/* 2 Primary Large Square Educational Action Buttons Centered */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
            <button
              type="button"
              onClick={() => scrollToLectureDirectory('all')}
              className="min-h-[52px] px-7 py-3.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm sm:text-base font-semibold shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-5 h-5 shrink-0" />
              <span>
                {isEn ? `Explore ${totalLessons} Lectures` : `Khám phá ${totalLessons} Bài giảng`}
              </span>
              <ChevronDown className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('physics_sims')}
              className="min-h-[52px] px-7 py-3.5 rounded bg-white/10 hover:bg-white/18 border border-white/25 hover:border-sky-300/60 text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Atom className="w-5 h-5 text-amber-300 shrink-0" />
              <span>{isEn ? 'Open 2D/3D Simulations' : 'Mở Phòng Mô phỏng 2D/3D'}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {/* Centered Academic Metrics & Learner Mastery Bar */}
          <div className="mt-6 pt-6 border-t border-white/12 grid grid-cols-1 md:grid-cols-12 gap-5 items-center text-left">
            <div className="md:col-span-7 grid grid-cols-3 gap-4 text-center md:text-left">
              <div>
                <div className="font-display text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                  {totalLessons}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {isEn ? 'Interactive Lessons' : 'Bài giảng tương tác'}
                </div>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-semibold text-sky-300 tabular-nums">
                  60 FPS
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {isEn ? '2D/3D Physics & Graphs' : 'Mô phỏng 2D/3D'}
                </div>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-semibold text-amber-300 tabular-nums">
                  {totalExams}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {isEn ? 'Curated Exam Papers' : 'Đề thi chuẩn'}
                </div>
              </div>
            </div>

            <div className="md:col-span-5 rounded bg-white/[0.07] border border-white/15 px-4 py-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-white truncate">
                    {user ? user.displayName : isEn ? 'Guest Learner' : 'Học sinh thử nghiệm'}
                  </span>
                  <span className="font-mono font-semibold text-amber-300 tabular-nums shrink-0">
                    Lv.{currentLevel} · {currentXP} XP
                  </span>
                </div>
                <div className="w-full bg-white/12 h-2 rounded-sm overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full rounded-sm transition-all duration-500"
                    style={{ width: `${xpProgressPct}%` }}
                  />
                </div>
              </div>

              {user ? (
                onOpenSettings && (
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="min-h-[42px] px-3.5 py-2 rounded bg-white/12 hover:bg-white/22 border border-white/15 text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
                  >
                    <Settings className="w-4 h-4 text-sky-300" />
                    <span>{isEn ? 'Settings' : 'Cài đặt'}</span>
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="min-h-[42px] px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isEn ? 'Sign In' : 'Đăng nhập'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TABLE OF CONTENTS (MỤC LỤC TRANG CHÍNH) */}
      <section className="sci-frame rounded-xl bg-white/90 dark:bg-slate-900/82 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-sky-200/85 dark:border-sky-500/25 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70 dark:border-white/10">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-blue-600 dark:text-sky-400 shrink-0" />
            <h2 className="font-display text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              {isEn ? 'Table of Contents · Jump to Lectures' : 'Mục Lục Trang Chính · Cuộn Nhanh Xuống Bài Giảng'}
            </h2>
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
            className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg bg-gradient-to-r from-sky-50 via-blue-50/70 to-sky-50 dark:from-blue-950/60 dark:via-slate-900/80 dark:to-sky-950/50 hover:from-sky-100 hover:to-blue-100 dark:hover:from-blue-900/70 dark:hover:to-sky-950/80 border border-sky-300/85 dark:border-sky-500/40 hover:border-blue-600 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <div className="relative z-10 min-w-0">
              <span className="font-mono text-[11px] font-bold text-blue-700 dark:text-sky-400 block">
                01 · {isEn ? 'ALL LECTURES' : 'DANH SÁCH BÀI GIẢNG'}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-sky-200 truncate block transition-colors">
                {isEn ? `View All ${totalLessons} Lectures` : `Xem toàn bộ ${totalLessons} bài giảng`}
              </span>
            </div>
            <span className="relative z-10 w-8 h-8 rounded-md bg-blue-600/10 dark:bg-sky-400/15 group-hover:bg-blue-600 text-blue-700 dark:text-sky-300 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => scrollToLectureDirectory('math')}
            className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg bg-slate-50/95 dark:bg-slate-800/65 hover:bg-sky-50 dark:hover:bg-sky-950/45 border border-slate-300/85 dark:border-white/10 hover:border-sky-500/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <div className="relative z-10 min-w-0">
              <span className="font-mono text-[11px] font-bold text-sky-700 dark:text-sky-400 block">
                02 · {isEn ? 'MATHEMATICS' : 'TOÁN HỌC'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300 truncate block transition-colors">
                {isEn ? `Math (${MATH_LECTURES.length} lessons)` : `Bài giảng Toán (${MATH_LECTURES.length} bài)`}
              </span>
            </div>
            <span className="relative z-10 w-8 h-8 rounded-md bg-sky-500/10 group-hover:bg-sky-600 text-sky-600 dark:text-sky-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => scrollToLectureDirectory('physics')}
            className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg bg-slate-50/95 dark:bg-slate-800/65 hover:bg-amber-50 dark:hover:bg-amber-950/45 border border-slate-300/85 dark:border-white/10 hover:border-amber-500/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <div className="relative z-10 min-w-0">
              <span className="font-mono text-[11px] font-bold text-amber-700 dark:text-amber-400 block">
                03 · {isEn ? 'PHYSICS' : 'VẬT LÍ'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 truncate block transition-colors">
                {isEn ? `Physics (${PHYSICS_LESSONS.length} labs)` : `Bài giảng Vật lí (${PHYSICS_LESSONS.length} bài)`}
              </span>
            </div>
            <span className="relative z-10 w-8 h-8 rounded-md bg-amber-500/12 group-hover:bg-amber-500 text-amber-600 dark:text-amber-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => scrollToLectureDirectory('cs')}
            className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg bg-slate-50/95 dark:bg-slate-800/65 hover:bg-emerald-50 dark:hover:bg-emerald-950/45 border border-slate-300/85 dark:border-white/10 hover:border-emerald-500/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <div className="relative z-10 min-w-0">
              <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block">
                04 · {isEn ? 'COMPUTER SCIENCE' : 'TIN HỌC'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 truncate block transition-colors">
                {isEn ? `CS & VNOI (${CS_LESSONS.length} modules)` : `Bài giảng Tin học (${CS_LESSONS.length} bài)`}
              </span>
            </div>
            <span className="relative z-10 w-8 h-8 rounded-md bg-emerald-500/12 group-hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => scrollToSection('classroom-exams-banner')}
            className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg bg-slate-50/95 dark:bg-slate-800/65 hover:bg-blue-50 dark:hover:bg-blue-950/45 border border-slate-300/85 dark:border-white/10 hover:border-blue-500/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <div className="relative z-10 min-w-0">
              <span className="font-mono text-[11px] font-bold text-blue-700 dark:text-sky-400 block">
                05 · {isEn ? 'EXAM ARCHIVE' : 'KHO ĐỀ THI'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-sky-300 truncate block transition-colors">
                {isEn ? `${totalExams} Official Exams` : `${totalExams} Đề thi & AI chấm`}
              </span>
            </div>
            <span className="relative z-10 w-8 h-8 rounded-md bg-blue-500/12 group-hover:bg-blue-600 text-blue-600 dark:text-sky-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => scrollToSection('classroom-utilities')}
            className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg bg-slate-50/95 dark:bg-slate-800/65 hover:bg-teal-50 dark:hover:bg-teal-950/45 border border-slate-300/85 dark:border-white/10 hover:border-teal-500/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <div className="relative z-10 min-w-0">
              <span className="font-mono text-[11px] font-bold text-teal-700 dark:text-teal-400 block">
                06 · {isEn ? 'STUDY UTILITIES' : 'TIỆN ÍCH HỌC TẬP'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 truncate block transition-colors">
                {isEn ? 'Focus Timer & Quick Notes' : 'Đồng hồ tập trung & Sổ tay'}
              </span>
            </div>
            <span className="relative z-10 w-8 h-8 rounded-md bg-teal-500/12 group-hover:bg-teal-600 text-teal-600 dark:text-teal-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* FLAGSHIP GATEWAY: LỚP HỌC ẢO · SYNAPSE V2 */}
      <section
        data-ripple="true"
        onClick={() => onNavigate('synapse_v2')}
        className="group sci-frame relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-950 via-[#0a1a36] to-slate-900 text-white p-6 sm:p-8 border border-sky-400/45 hover:border-sky-300/85 shadow-[0_20px_55px_-16px_rgba(2,132,199,0.34)] cursor-pointer transition-all"
      >
        <div className="absolute inset-0 sci-blueprint-bg opacity-35 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-sky-500/30 to-blue-600/40 border border-sky-300/50 flex items-center justify-center shrink-0 shadow-inner">
              <Orbit className="w-8 h-8 text-sky-300 icon-anim-cosmos" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="text-[11px] font-mono font-extrabold uppercase tracking-[0.2em] text-sky-300">
                {isEn ? 'SYNAPSE V2 · 30 FUTURISTIC 3D HOLOGRAPHIC CHAMBERS' : 'LỚP HỌC ẢO · SYNAPSE V2 · 30 ĐẠI CÔNG TRÌNH TƯƠNG LAI'}
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white">
                {isEn
                  ? 'Explore 30 Futuristic 3D Physics, Space Science, Computer Science & Math Megastructures'
                  : 'Bước vào 30 Khung Lớp Học Ảo Vật Lí, Vũ Trụ, Khoa Học Vi Tính & Đại Công Trình 3D'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {isEn
                  ? 'CERN LHC · Double-Slit Laser · James Webb · Dyson Black Hole · Tokamak Fusion · LiDAR SLAM Core · Solar Thermal Tower · 7T MRI Ring · Sagnac Gyro · Metamaterial Cloak · Acoustic Levitation & Photonic Tensor Core.'
                  : 'Máy Gia Tốc LHC · Laser Khe Kép · Kính James Webb · Hố Đen Dyson · Lò Tokamak · LiDAR SLAM · Tháp Nhiệt Mặt Trời · Vòng Cộng Hưởng MRI 7T · Con Quay Laser Sagnac · Áo Tàng Hình Siêu Vật Liệu · Bẫy Sóng Âm & Chip Quang Tử.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('synapse_v2');
            }}
            className="group/btn cs-deck-btn shrink-0 px-6 py-3.5 rounded-md bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 hover:from-sky-300 hover:to-blue-300 text-slate-950 font-black text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Orbit className="w-4 h-4 icon-anim-cosmos" />
            <span>{isEn ? 'Launch Synapse v2 World' : 'Khởi động Lớp học ảo · Synapse v2'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* GATEWAY: HỌC CẢM GIÁC 3D · WEBCAM HAND-GESTURE & OXYZ LAB */}
      <section
        data-ripple="true"
        onClick={() => onNavigate('spatial_3d')}
        className="group sci-frame relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-950 via-[#08222a] to-slate-900 text-white p-6 sm:p-7 border border-teal-400/45 hover:border-cyan-300/90 shadow-[0_20px_55px_-16px_rgba(20,184,166,0.3)] cursor-pointer transition-all"
      >
        <div className="absolute inset-0 sci-blueprint-bg opacity-30 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-teal-500/30 to-cyan-500/35 border border-teal-300/50 flex items-center justify-center shrink-0">
              <Hand className="w-7 h-7 text-teal-300" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="text-[11px] font-mono font-extrabold uppercase tracking-[0.18em] text-teal-300">
                {isEn
                  ? 'SPATIAL 2D/3D GESTURE LAB · 10-FINGERTIP AI SENSOR'
                  : 'KHU VỰC MỚI · HỌC CẢM GIÁC 3D · CẢM BIẾN 10 ĐẦU NGÓN TAY'}
              </div>
              <h2 className="font-display text-lg sm:text-xl font-black tracking-tight text-white">
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
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('spatial_3d');
            }}
            className="cs-deck-btn shrink-0 px-5 py-3.5 rounded-md bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Hand className="w-4 h-4" />
            <span>{isEn ? 'Open Spatial 3D Lab' : 'Vào Học cảm giác 3D'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
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
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('math');
                }}
                className="w-full min-h-[48px] px-5 py-3 rounded bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'Open 2D & Oxyz 3D Lab' : 'Vào Toán · Đồ thị & Oxyz 3D'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
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
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('physics_sims');
                }}
                className="w-full min-h-[48px] px-4 py-3 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Atom className="w-4 h-4 shrink-0" />
                <span>{isEn ? '2D/3D Domains' : 'Mô phỏng 2D/3D'}</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('physics');
                }}
                className="w-full min-h-[48px] px-4 py-3 rounded bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-semibold border border-amber-500/40 flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
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
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isEn
                  ? `Computer Science (${CS_LESSONS.length})`
                  : `Tin học Sublime 4 (${CS_LESSONS.length} bài)`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Sublime Text 4 style IDE, automated C++20 & Python 3 judge, and 16 interactive visualizers (Oxy, Strings, Arrays, DP, Binary Search, Dijkstra).'
                  : 'Trình soạn thảo Sublime Text 4, chấm bài C++/Python + phân tích lỗi AI và 16 đồ thị mô phỏng (Oxy, Xâu, Mảng, DP, Dijkstra).'}
              </p>
            </div>

            <div className="relative z-10 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('cs');
                }}
                className="w-full min-h-[48px] px-5 py-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Code2 className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'Open Code Judge Lab' : 'Vào Tin Học & Code Judge'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              {isEn ? 'Roadmap, Weekly Arena & AI Tutors' : 'Lộ Trình Chuẩn, Đấu Trường Tuần & Gia Sư AI'}
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
                <GitBranch className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
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
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('roadmap');
                }}
                className="cs-deck-btn w-full px-5 py-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
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
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('arena');
                }}
                className="cs-deck-btn w-full px-5 py-3 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-extrabold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
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
              <div className="w-12 h-12 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200/90 dark:border-teal-800/70 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isEn ? '3 Specialized AI Tutors' : '3 Trợ Lý AI (Toán · Lí · Tin)'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn
                  ? 'Independent AI tutors for Math, Physics & CS with Guided Hints, Full Solution, and Diagnostic Roadmap modes.'
                  : '3 Gia sư AI độc lập cho từng môn với 3 chế độ thực chiến: Giảng gợi mở, Giải 4 bước, và Test năng lực vẽ lộ trình.'}
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTutor?.('math', 'explain_no_answer');
                }}
                className="cs-deck-btn w-full px-5 py-3 rounded-md bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 icon-anim-star" />
                <span>{t('overview.openTutor', 'Mở 3 Trợ Lý AI (Toán - Lí - Tin)', 'Launch 3 AI Tutors')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Dedicated 3 Subject AI Assistants × 3 Modes */}
      {onOpenTutor && (
        <section className="sci-frame rounded-xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-slate-200/90 dark:border-white/10 p-6 sm:p-7 shadow-[0_14px_42px_-16px_rgba(15,23,42,0.12)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/70 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-sky-400">
                <Sparkles className="w-4 h-4" />
                <span>
                  {isEn
                    ? '3 Independent AI Tutors · 3 Study Modes Each'
                    : '3 Gia Sư AI Độc Lập · Mỗi AI 3 Chế Độ Thực Chiến'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Real-time AI streaming. Pick a subject tutor and mode below, or press Left Ctrl + D (Math), Left Ctrl + F (Physics), Left Ctrl + G (CS).'
                  : 'Chọn nhanh AI theo từng môn bên dưới hoặc dùng phím tắt Ctrl(trái)+D (Toán), Ctrl(trái)+F (Lí), Ctrl(trái)+G (Tin).'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiCards.map((item) => (
              <div
                key={item.subj}
                className={`rounded-lg border p-4 sm:p-5 flex flex-col justify-between gap-3.5 ${item.accent}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${item.badge}`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        {item.sub}
                      </p>
                    </div>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/90 dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 shrink-0">
                    {item.shortcut}
                  </kbd>
                </div>

                <div className="space-y-2">
                  {aiModes.map((m) => (
                    <button
                      key={m.mode}
                      type="button"
                      onClick={() => onOpenTutor(item.subj, m.mode)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-md bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 text-xs font-bold flex items-center justify-between gap-2 transition-colors cursor-pointer ${item.btn}`}
                    >
                      <span className="truncate">{m.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: Featured Exam Bank Banner */}
      <section
        id="classroom-exams-banner"
        data-ripple="true"
        onClick={() => onNavigate('exams')}
        className="scroll-mt-24 sci-frame relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-950 via-[#0a1a36] to-slate-900 border border-sky-500/35 p-6 sm:p-8 shadow-xl cursor-pointer hover:border-sky-400/75 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6"
      >
        <div className="space-y-2 max-w-2xl min-w-0">
          <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 tabular-nums">
            {isEn
              ? `2025 - 2026 Exam Archive · ${chuyenExams} Specialized & ${standardExams} Standard`
              : `Kho Đề Thi Chuẩn 2025 - 2026 · ${chuyenExams} Chuyên & ${standardExams} Không Chuyên`}
          </div>
          <h3 className="font-display text-lg sm:text-2xl font-extrabold text-white tracking-tight tabular-nums">
            {isEn
              ? `${totalExams} Full Exam Bank, AI Photo Grading & Step-by-Step Solutions`
              : `Kho ${totalExams} Đề Thi, Nộp Ảnh Chấm Điểm AI & Giải Chi Tiết (Toán · Lí · Tin)`}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isEn
              ? 'Official and specialized Olympiad exams with built-in timer, handwritten photo submission for AI grading (0–10), and interactive follow-up Q&A.'
              : 'Tuyển tập đề thi từ KHTN, Sư Phạm, Amsterdam, Lê Hồng Phong và nhiều tỉnh thành... kèm đồng hồ bấm giờ, nộp ảnh để AI chấm điểm và hỏi đáp phần chưa hiểu.'}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('exams');
          }}
          className="cs-deck-btn shrink-0 w-full sm:w-auto px-6 py-3 rounded-md bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <span>{isEn ? `Explore ${totalExams} exams` : `Khám phá ${totalExams} đề thi`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* SECTION 5: Classroom Focus Utilities (Synced Study-Format Pomodoro + Bells + Quick Notebook) */}
      <section id="classroom-utilities" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Focus Timer synced with Bottom-Left Floating Widget */}
        <div className="lg:col-span-5 sci-frame bg-white/90 dark:bg-slate-900/80 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-sky-200/85 dark:border-sky-500/25 rounded-xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                {isEn ? 'Focus Timer & Study Formats' : 'Đồng hồ tập trung & Hình thức học'}
              </h3>
              <button
                type="button"
                onClick={() => setIsWidgetOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-950/60 border border-sky-300/70 dark:border-sky-700/60 text-[11px] font-bold text-sky-800 dark:text-sky-300 hover:bg-sky-100 cursor-pointer"
                title={isEn ? 'Open corner mini widget' : 'Mở khung bấm giờ góc trái'}
              >
                <PanelBottomOpen className="w-3.5 h-3.5" />
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
                    onClick={() => setStudyFormat(preset.id)}
                    className={`px-2 py-1.5 rounded-md text-[11px] font-bold border transition-all cursor-pointer truncate ${
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
              <div className="flex items-center gap-1 p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => switchPhase('focus')}
                  className={`px-2.5 py-1 rounded-sm font-bold cursor-pointer ${
                    phase === 'focus'
                      ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-sky-300 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  {isEn ? 'Focus' : 'Tập trung'}
                </button>
                <button
                  type="button"
                  onClick={() => switchPhase('break')}
                  className={`px-2.5 py-1 rounded-sm font-bold cursor-pointer ${
                    phase === 'break'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  {isEn ? 'Break' : 'Nghỉ ngơi'}
                </button>
              </div>
              <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                {completedSessions} {isEn ? 'done' : 'phiên'}
              </span>
            </div>

            {/* SVG Circular Ring */}
            <div className="flex flex-col items-center justify-center py-1">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140" aria-hidden="true">
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
                  <div className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
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
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-md bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <Bell className="w-3.5 h-3.5 text-amber-500 shrink-0" />
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
                  onClick={() => playBell()}
                  className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold cursor-pointer"
                >
                  {isEn ? 'Test' : 'Thử'}
                </button>
              </div>

              <button
                type="button"
                onClick={toggleBgPlaying}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                  isBgPlaying && bgSound !== 'off'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-200/70 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isBgPlaying && bgSound !== 'off' ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
                <span>{isEn ? 'Ambient' : 'Nhạc nền'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-200/70 dark:border-white/10">
            {alarmRinging && (
              <button
                type="button"
                onClick={dismissAlarm}
                className="px-4 py-2.5 rounded-md text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                {isEn ? 'Stop Bell' : 'Tắt chuông'}
              </button>
            )}
            <button
              onClick={toggleTimer}
              className={`cs-deck-btn px-6 py-2.5 rounded-md text-xs sm:text-sm font-bold text-white flex items-center gap-2 transition-colors cursor-pointer ${
                isTimerRunning
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTimerRunning
                ? isEn
                  ? 'Pause'
                  : 'Tạm dừng'
                : isEn
                ? 'Start Focus'
                : 'Bắt đầu học'}
            </button>
            <button
              onClick={resetTimer}
              className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              title={isEn ? 'Reset Timer' : 'Đặt lại đồng hồ'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Classroom Notes */}
        <div className="lg:col-span-7 sci-frame bg-white/90 dark:bg-slate-900/80 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-slate-200/90 dark:border-white/10 rounded-xl p-6 sm:p-7 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-sky-400" />
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
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/90 dark:bg-slate-800/60 border border-slate-300/80 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={handleAddNote}
              className="cs-deck-btn px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {isEn ? 'Save' : 'Lưu'}
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-56 pr-1">
            {notes.map((n) => (
              <div
                key={n.id}
                className="p-3 bg-slate-50/85 dark:bg-slate-800/45 rounded-xl border border-slate-200/70 dark:border-white/10 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{n.text}</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">{n.date}</span>
                </div>
                <button
                  onClick={() => handleDeleteNote(n.id)}
                  className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
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
      />

      {/* SECTION 7: Community Reviews, Star Ratings & Favorite Votes */}
      <div className="cv-auto">
        <PlatformReviews id="platform-reviews" />
      </div>
    </div>
  );
};
