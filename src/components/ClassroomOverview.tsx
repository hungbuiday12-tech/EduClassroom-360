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
  GitBranch
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { EXAM_PAPERS } from '../data/examData';
import { MATH_LECTURES } from '../data/curriculumData';
import { PHYSICS_LESSONS } from '../data/physicsLessonsData';
import { CS_LESSONS } from '../data/csLessonsData';

interface ClassroomOverviewProps {
  onNavigate: (subject: SubjectType) => void;
  xp: number;
  onOpenTutor?: (subject?: 'math' | 'physics' | 'cs', mode?: AITutorMode) => void;
}

export const ClassroomOverview: React.FC<ClassroomOverviewProps> = ({
  onNavigate,
  xp,
  onOpenTutor
}) => {
  const { user, openAuthModal } = useAuth();
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  const currentXP = user ? user.xp : xp;
  const totalExams = EXAM_PAPERS.length;
  const chuyenExams = EXAM_PAPERS.filter((e) => e.track === 'chuyen').length;
  const standardExams = EXAM_PAPERS.filter((e) => e.track === 'khong_chuyen').length;

  // Pomodoro Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

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

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setPomodoroSeconds(25 * 60);
  };

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
      accent: 'border-indigo-200 dark:border-indigo-900/70 bg-indigo-50/40 dark:bg-indigo-950/20',
      badge: 'bg-indigo-600 text-white',
      btn: 'hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300',
      icon: <Compass className="w-4 h-4" />
    },
    {
      subj: 'physics' as const,
      shortcut: isEn ? 'Left Ctrl+F' : 'Ctrl(trái)+F',
      title: isEn ? 'Physics AI Tutor' : 'AI Vật Lí',
      sub: isEn
        ? 'Mechanics · Thermodynamics · RLC · Waves & Nuclear'
        : 'Cơ · Nhiệt · Điện RLC · Sóng & Hạt nhân',
      accent: 'border-amber-200 dark:border-amber-900/70 bg-amber-50/40 dark:bg-amber-950/20',
      badge: 'bg-amber-600 text-white',
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
      accent: 'border-emerald-200 dark:border-emerald-900/70 bg-emerald-50/40 dark:bg-emerald-950/20',
      badge: 'bg-emerald-600 text-white',
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
    <div className="space-y-8">
      {/* Smart Digital Blackboard Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-5 sm:p-8 border border-slate-800 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl min-w-0">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              <span>
                {t(
                  'overview.badge',
                  'Phòng học trực tuyến thông minh · Hệ thống mô phỏng đa môn',
                  'Smart Virtual Classroom · Multi-Discipline Simulation'
                )}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {t(
                'overview.heroTitle',
                'Bục giảng ảo: Khám phá trực quan Toán học, Vật lí & Tin học (Lớp 9 - 12)',
                'Synapse Classroom: Math, Physics & Computer Science (Grades 9-12)'
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {t(
                'overview.heroDesc',
                'Trang bị các công cụ chuyên sâu: bài giảng 5 phần tích hợp đồ thị hàm số, hình học 2D & 7 cảnh Oxyz 3D (Toán), phòng thí nghiệm 2D/3D 60 FPS (Lí), và hệ thống giải đề Sublime Text 4 (Tin).',
                'Equipped with specialized interactive tools: 5-step lectures with 2D/3D graphers and Oxyz geometry (Math), real-time 60fps 2D/3D labs (Physics), and Sublime Text 4 coding studio with online judge (CS).'
              )}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 mt-5">
              <button
                onClick={() => onNavigate('roadmap')}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t('overview.gotoRoadmap', 'Bản đồ Quy trình Học', 'Study Roadmap')}</span>
              </button>
              <button
                onClick={() => onNavigate('arena')}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>{t('overview.gotoArena', 'Thi đấu & BXH Tuần', 'Weekly Arena')}</span>
              </button>
              {onOpenTutor && (
                <button
                  onClick={() => onOpenTutor('math', 'explain_no_answer')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {t('overview.openTutor', '3 Trợ Lý AI (Toán · Lí · Tin)', '3 AI Tutors (Math · Physics · CS)')}
                  </span>
                </button>
              )}
              <button
                onClick={() => onNavigate('math')}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-700/80 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>{t('overview.gotoMath', 'Toán · Lí · Tin', 'Math · Physics · CS')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Student Status Badge / Level */}
          <div className="shrink-0 w-full lg:w-auto lg:min-w-[260px] bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5">
            {user ? (
              <div className="flex items-center gap-3 mb-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover border border-indigo-400"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-500/30 border border-indigo-400 flex items-center justify-center text-amber-300 font-bold text-sm">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-xs text-indigo-200">@{user.username}</div>
                  <div className="text-sm font-bold text-white truncate max-w-[140px]">
                    {user.displayName}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-white/10">
                <div>
                  <div className="text-xs text-indigo-200">
                    {isEn ? 'Not signed in' : 'Chưa đăng nhập'}
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {isEn ? 'Save progress & grades' : 'Lưu học bạ & bài làm'}
                  </div>
                </div>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Sign In' : 'Đăng nhập'}</span>
                </button>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">
                  {isEn ? 'Experience Points:' : 'Điểm kinh nghiệm:'}
                </span>
                <span className="text-amber-300 font-bold tabular-nums">{currentXP} XP</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((currentXP % 500) / 500) * 100, 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 text-right">
                {isEn
                  ? `${500 - (currentXP % 500)} XP to next level`
                  : `${500 - (currentXP % 500)} XP nữa để lên cấp tiếp theo`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Interactive Disciplines Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Math Card */}
        <div
          onClick={() => onNavigate('math')}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              {isEn
                ? `Interactive Math (${MATH_LECTURES.length} lessons)`
                : `Toán học tương tác (${MATH_LECTURES.length} bài)`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEn
                ? 'Plot polynomials, logarithms, absolute values & integrals; interactive 2D geometry & 7 spatial Oxyz 3D scenes.'
                : 'Vẽ đồ thị đa thức, logarit, trị tuyệt đối, tô diện tích tích phân; hình học kéo thả & 7 mô hình Oxyz 3D trực quan.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>{isEn ? 'Open 2D & Oxyz 3D Lab' : 'Mở công cụ vẽ Oxy & 3D'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Physics Card */}
        <div
          onClick={() => onNavigate('physics')}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              {isEn
                ? `Experimental Physics (${PHYSICS_LESSONS.length} lessons)`
                : `Vật lí thực nghiệm (${PHYSICS_LESSONS.length} bài)`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEn
                ? '10 2D labs & 11 real-time 60 FPS 3D simulations: pendulums, circular motion, RLC AC phasors, Young wave interference.'
                : '10 phòng Lab 2D & 11 mô phỏng 3D 60 FPS: Con lắc, chuyển động tròn, mạch xoay chiều RLC Fresnel, giao thoa Y-âng.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>{isEn ? 'Open Physics Labs' : 'Mở phòng thí nghiệm'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CS Card */}
        <div
          onClick={() => onNavigate('cs')}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              {isEn
                ? `Computer Science Studio (${CS_LESSONS.length} modules)`
                : `Tin học Sublime 4 (${CS_LESSONS.length} bài)`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEn
                ? 'Sublime Text 4 style IDE, automated C++20 & Python 3 judge, and 16 interactive visualizers (Oxy, Strings, Arrays, DP, Binary Search, Dijkstra).'
                : 'Trình soạn thảo Sublime Text 4, chấm bài C++/Python tự động và 16 mô phỏng trực quan (Oxy, Xâu, Mảng 1D/2D, DP, Chặt nhị phân, Dijkstra).'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>{isEn ? 'Open Code Judge Lab' : 'Mở Code Judge Lab'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3 Core Learning Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Roadmap */}
        <div
          onClick={() => onNavigate('roadmap')}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              {isEn ? '5-Step Learning Process Map' : 'Bản đồ Qui trình Học tập 5 Bước'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEn
                ? 'Structured Math · Physics · CS progression from Grade 9 to 12 with prerequisites and mastery tracking.'
                : 'Lộ trình từng chặng Toán · Lí · Tin từ Lớp 9 đến Lớp 12 có kiến thức tiên quyết và theo dõi tiến độ.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>{isEn ? 'Open Roadmap' : 'Mở Bản đồ Lộ trình'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Socratic AI Tutor Quick Card */}
        <div
          onClick={() => onOpenTutor?.('math', 'explain_no_answer')}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              {isEn ? '3 Specialized Gemini AI Tutors' : '3 Trợ Lý Gemini AI Chuyên Môn'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEn
                ? 'Independent AI tutors for Math, Physics & CS with 3 modes each: Guided Hints, Full Solution, and Roadmap Test.'
                : 'Mỗi môn Toán · Vật lí · Tin học có 1 AI độc lập với 3 chế độ: Giảng không lộ đáp án, Giải chi tiết, và Test lộ trình ngành.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-violet-600 dark:text-violet-400">
            <span>{isEn ? 'Launch 3-AI System' : 'Mở Hệ thống 3 AI ngay'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Weekly Online Competition & Leaderboard */}
        <div
          onClick={() => onNavigate('arena')}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              {isEn ? 'Weekly Arena & Leaderboard' : 'Thi đấu Online & Xếp hạng Tuần'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEn
                ? 'Compete in MCQ or AI-graded Essay rounds (1 attempt/day/subject) with real-time weekly rankings.'
                : 'Thi Trắc nghiệm hoặc Tự luận (1 lần/ngày/môn). Bảng xếp hạng trực tuyến theo từng môn và Điểm Trung Bình.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>{isEn ? 'Enter Weekly Arena' : 'Vào Đấu trường Tuần'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Dedicated 3 Subject AI Assistants × 3 Modes Section */}
      {onOpenTutor && (
        <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>
                  {isEn
                    ? '3 Independent Gemini AI Tutors · 3 Study Modes Each'
                    : '3 Gia sư Gemini AI Độc Lập · Mỗi AI 3 Chế Độ Thực Chiến'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Real-time Gemini AI streaming. Pick a subject tutor and mode below, or press Left Ctrl + D (Math), Left Ctrl + F (Physics), Left Ctrl + G (CS).'
                  : 'Kết nối trực tiếp Gemini AI (stream thời gian thực). Chọn AI bên dưới hoặc dùng phím tắt Ctrl(trái)+D (Toán), Ctrl(trái)+F (Lí), Ctrl(trái)+G (Tin).'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiCards.map((item) => (
              <div
                key={item.subj}
                className={`rounded-xl border p-4 flex flex-col justify-between gap-3 ${item.accent}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.badge}`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        {item.sub}
                      </p>
                    </div>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 shrink-0">
                    {item.shortcut}
                  </kbd>
                </div>

                <div className="space-y-1.5">
                  {aiModes.map((m) => (
                    <button
                      key={m.mode}
                      type="button"
                      onClick={() => onOpenTutor(item.subj, m.mode)}
                      className={`w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] font-bold flex items-center justify-between gap-2 transition-colors ${item.btn}`}
                    >
                      <span className="truncate">{m.label}</span>
                      <ArrowRight className="w-3 h-3 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Exam Bank Banner */}
      <div
        onClick={() => onNavigate('exams')}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-5 sm:p-6 shadow-lg cursor-pointer hover:border-indigo-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6"
      >
        <div className="space-y-1.5 max-w-2xl min-w-0">
          <div className="text-xs font-semibold text-cyan-400">
            {isEn
              ? `2025 - 2026 Exam Archive · ${chuyenExams} Specialized & ${standardExams} Standard`
              : `Kho Đề Thi Chuẩn 2025 - 2026 · ${chuyenExams} Chuyên & ${standardExams} Không Chuyên`}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight tabular-nums">
            {isEn
              ? `${totalExams} Full Exam Bank, AI Photo Grading & Step-by-Step Solutions`
              : `Kho ${totalExams} Đề Thi, Nộp Ảnh Chấm Điểm AI & Giải Chi Tiết (Toán · Lí · Tin)`}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isEn
              ? 'Official and specialized Olympiad exams with built-in timer, handwritten photo submission for AI grading (0–10), and interactive follow-up Q&A.'
              : 'Tuyển tập đề thi từ KHTN, Sư Phạm, Amsterdam, Lê Hồng Phong và 20 tỉnh thành... kèm đồng hồ bấm giờ, nộp ảnh để AI chấm điểm và hỏi đáp phần chưa hiểu.'}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('exams');
          }}
          className="shrink-0 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span>{isEn ? `Explore ${totalExams} exams` : `Khám phá ${totalExams} đề thi`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Classroom Utilities: Focus Timer (Pomodoro) & Quick Notebook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pomodoro Focus Timer */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                {isEn ? 'Study Focus Timer (Pomodoro)' : 'Đồng hồ tập trung học tập (Pomodoro)'}
              </h3>
              <span className="text-xs text-slate-400">
                {isEn ? '25 min session' : 'Phiên 25 phút'}
              </span>
            </div>

            <div className="text-center py-6">
              <div className="text-5xl font-mono font-extrabold tracking-wider text-slate-900 dark:text-slate-100 tabular-nums">
                {formatTimer(pomodoroSeconds)}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {isTimerRunning
                  ? isEn ? 'Focus session in progress' : 'Đang trong phiên tập trung làm bài'
                  : isEn ? 'Ready to start studying' : 'Sẵn sàng bắt đầu buổi học'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={toggleTimer}
              className={`px-5 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 transition-colors ${
                isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTimerRunning
                ? isEn ? 'Pause' : 'Tạm dừng'
                : isEn ? 'Start Focus' : 'Bắt đầu học'}
            </button>
            <button
              onClick={resetTimer}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={isEn ? 'Reset 25 min' : 'Đặt lại 25 phút'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Classroom Notes */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              {isEn ? 'Personal Study Quick Notes' : 'Sổ tay ghi chú bài học cá nhân'}
            </h3>
            <span className="text-xs text-slate-400">
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
              className="flex-1 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleAddNote}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shrink-0 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              {isEn ? 'Save' : 'Lưu'}
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-48 pr-1">
            {notes.map((n) => (
              <div
                key={n.id}
                className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{n.text}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{n.date}</span>
                </div>
                <button
                  onClick={() => handleDeleteNote(n.id)}
                  className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
