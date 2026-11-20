import React, { Suspense, lazy, useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUp,
  Code2,
  Compass,
  Download,
  FileText,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Video,
  Zap
} from 'lucide-react';
import { AITutorMode, SubjectType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { useFocusTimer } from '../context/FocusTimerContext';
import { CURRICULUM_COUNTS } from '../data/curriculumCounts';
import { getPhysicsSimCounts } from '../data/physicsDomainsData';
import {
  GROWTH_UPDATED_EVENT,
  getErrorNotebook,
  getFlashcards,
  getStreakState
} from '../lib/learningGrowthStore';
import { PlatformReviews } from './common/PlatformReviews';
import { AppDownloadGuideSection } from './common/AppDownloadGuideSection';
import { LiveMeetShowcaseCard } from './meet/LiveMeetShowcaseCard';
import type { DirectorySubjectFilter } from './common/LectureDirectorySection';

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

type UtilityTab = 'directory' | 'focus_notes' | 'community' | 'app_docs';

export const ClassroomOverview: React.FC<ClassroomOverviewProps> = ({
  onNavigate,
  xp,
  onOpenTutor,
  onOpenSettings,
  onOpenInstallApp
}) => {
  const { user, openAuthModal } = useAuth();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const {
    reviewScrollTick,
    directoryScrollTick,
    directoryFilterRequest,
    navigate
  } = useNavigation();

  const {
    timeLeft,
    isRunning,
    startPause,
    resetTimer
  } = useFocusTimer();

  const [activeTab, setActiveTab] = useState<UtilityTab>('directory');
  const [directorySubject, setDirectorySubject] = useState<DirectorySubjectFilter>('all');
  const [growthTick, setGrowthTick] = useState(0);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [askInput, setAskInput] = useState('');
  const [askSubject, setAskSubject] = useState<'math' | 'physics' | 'cs'>('math');

  const [notes, setNotes] = useState<{ id: string; text: string; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem('edusim_notes');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: '1',
              text: "Đạo hàm hàm bậc 3: y' = 3ax² + 2bx + c",
              date: '2026'
            },
            {
              id: '2',
              text: 'Con lắc lò xo: T = 2π√(m/k), cơ năng tỉ lệ A²',
              date: '2026'
            }
          ];
    } catch {
      return [];
    }
  });
  const [newNoteText, setNewNoteText] = useState('');

  useEffect(() => {
    const onGrowthUpdate = () => setGrowthTick((t) => t + 1);
    window.addEventListener(GROWTH_UPDATED_EVENT, onGrowthUpdate);
    return () => window.removeEventListener(GROWTH_UPDATED_EVENT, onGrowthUpdate);
  }, []);

  useEffect(() => {
    if (reviewScrollTick > 0) setActiveTab('community');
  }, [reviewScrollTick]);

  useEffect(() => {
    if (directoryScrollTick > 0) {
      setActiveTab('directory');
      if (directoryFilterRequest) setDirectorySubject(directoryFilterRequest);
    }
  }, [directoryScrollTick, directoryFilterRequest]);

  const streakSummary = React.useMemo(() => {
    void growthTick;
    const streak = getStreakState(user?.uid);
    const unresolvedErrors = getErrorNotebook(user?.uid).filter((e) => !e.resolved).length;
    const dueCards = getFlashcards(user?.uid).filter((c) => new Date(c.dueAt).getTime() <= Date.now()).length;
    return {
      currentStreak: streak.currentStreak,
      unresolvedErrors,
      dueCards
    };
  }, [growthTick, user?.uid]);

  const phyCounts = React.useMemo(() => getPhysicsSimCounts(), []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAskSubmit = (promptText?: string) => {
    const text = (promptText ?? askInput).trim();
    if (text) {
      window.dispatchEvent(
        new CustomEvent('educlassroom:open-tutor-with-payload', {
          detail: {
            subject: askSubject,
            initialPrompt: text
          }
        })
      );
      setAskInput('');
    } else if (onOpenTutor) {
      onOpenTutor(askSubject);
    }
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

  const handleDownloadDocx = async () => {
    if (downloadingDocx) return;
    setDownloadingDocx(true);
    try {
      const { downloadSynapsePresentationDocx } = await import('../utils/productDocxExporter');
      await downloadSynapsePresentationDocx();
    } catch (err) {
      console.error('Export DOCX failed:', err);
    } finally {
      setDownloadingDocx(false);
    }
  };

  const subjects = [
    {
      id: 'math' as SubjectType,
      name: isEn ? 'Mathematics' : 'Toán học',
      meta: `${CURRICULUM_COUNTS.mathLectures} ${isEn ? 'lessons · 2D & 3D' : 'bài học · 2D & Oxyz 3D'}`,
      desc: isEn
        ? 'Functions, calculus, vectors & 3D geometry.'
        : 'Hàm số, đạo hàm, tích phân & hình học không gian Oxyz.',
      icon: Compass,
      accent: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-indigo-50 dark:bg-sky-950/40'
    },
    {
      id: 'physics' as SubjectType,
      name: isEn ? 'Physics' : 'Vật lí',
      meta: `${phyCounts.count2D} Lab 2D · ${phyCounts.count3D} 3D`,
      desc: isEn
        ? 'Mechanics, oscillations, electricity & optics.'
        : 'Cơ học, dao động sóng, điện xoay chiều & quang học.',
      icon: Zap,
      accent: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40'
    },
    {
      id: 'cs' as SubjectType,
      name: isEn ? 'Computer Science' : 'Tin học',
      meta: isEn ? '5 VNOI/C++ tracks · IDE' : '5 lộ trình VNOI & C++ · IDE',
      desc: isEn
        ? 'Algorithms, C++/Python & step-by-step code trace.'
        : 'Thuật toán, lập trình C++/Python & truy vết code 1-1.',
      icon: Code2,
      accent: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-slate-900'
    }
  ];

  const quickPrompts = isEn
    ? [
        'Explain cubic function extrema step by step',
        'How does a spring pendulum conserve energy?',
        'Trace Dijkstra shortest path algorithm'
      ]
    : [
        'Giải thích cực trị hàm bậc 3 từng bước',
        'Con lắc lò xo bảo toàn cơ năng như thế nào?',
        'Mô phỏng thuật toán Dijkstra tìm đường ngắn nhất'
      ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16">
      {/* 1. ASTRA AI-STYLE CENTERED HERO + INTERACTIVE PROMPT BAR */}
      <section className="pt-6 sm:pt-10 text-center space-y-6">
        <div className="space-y-3 max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
            {user
              ? `${isEn ? 'Welcome back' : 'Chào mừng trở lại'}, ${user.displayName || user.username}`
              : isEn
              ? 'Your Personal STEM Learning Companion'
              : 'Trợ lí học tập Toán · Vật lí · Tin học thông minh'}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.14] text-balance">
            {isEn
              ? 'What would you like to master today?'
              : 'Hôm nay bạn muốn chinh phục kiến thức gì?'}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Ask Syn AI any step-by-step question, or jump straight into interactive 2D/3D lessons.'
              : 'Đặt câu hỏi cho Syn AI giải thích từng bước, hoặc chọn ngay môn học bên dưới.'}
          </p>
        </div>

        {/* Astra-Style Floating Prompt Box */}
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgba(79,70,229,0.08)] p-2.5 transition focus-within:border-sky-500">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskSubmit()}
              placeholder={
                isEn
                  ? 'Ask a Math, Physics, or CS question...'
                  : 'Nhập bài tập hoặc câu hỏi Toán, Vật lí, Tin học...'
              }
              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleAskSubmit()}
              aria-label="Ask Syn AI"
              className="w-10 h-10 rounded-xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shrink-0 transition cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 px-2">
            <div className="flex items-center gap-1">
              {(
                [
                  { id: 'math', vi: 'Toán', en: 'Math' },
                  { id: 'physics', vi: 'Vật lí', en: 'Physics' },
                  { id: 'cs', vi: 'Tin học', en: 'CS' }
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setAskSubject(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    askSubject === s.id
                      ? 'bg-indigo-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isEn ? s.en : s.vi}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              <span>{xp.toLocaleString()} XP</span>
              <span>·</span>
              <span>
                {streakSummary.currentStreak} {isEn ? 'day streak' : 'ngày liên tiếp'}
              </span>
              {!user && (
                <>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    {isEn ? 'Sign in' : 'Đăng nhập'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Subtle Quick Prompt Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAskSubmit(q)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 hover:border-sky-300 dark:hover:border-sky-700 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-300 transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* 2. CLEAN 3-SUBJECT LEARNING CARDS */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEn ? 'Choose a Subject' : 'Chọn môn học'}
          </h2>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => onNavigate('exams')}
              className="hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
            >
              {isEn ? 'Exams' : 'Kiểm tra'}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigate('arena')}
              className="hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
            >
              {isEn ? 'Arena' : 'Thi đấu'}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigate('forum')}
              className="hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
            >
              {isEn ? 'Community' : 'Cộng đồng'}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigate('roadmap')}
              className="hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
            >
              {isEn ? 'Roadmap' : 'Lộ trình'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map((subj) => {
            const Icon = subj.icon;
            return (
              <button
                key={subj.id}
                type="button"
                onClick={() => onNavigate(subj.id)}
                className="group text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`w-10 h-10 rounded-xl ${subj.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${subj.accent}`} />
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {subj.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {subj.meta}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {subj.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. SYNAPSE PRE & LIVE MEET 3D */}
      <section className="space-y-5">
        {/* Astra-style Clean Upgrade Banner for Synapse Pre */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/90 via-white to-sky-50/80 dark:from-sky-950/50 dark:via-slate-900 dark:to-slate-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
              {isEn ? 'Synapse Pre · 120,000 VND / 3 months' : 'Synapse Pre · 120.000đ / 3 tháng'}
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {isEn
                ? 'Syn AI Pro, Voice OS, Live Meet 3D Pro & 3D/4D Labs'
                : 'Nâng cấp Syn AI Pro, Voice OS, Live Meet 3D Pro & Không gian Lab 3D/4D'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {isEn
                ? 'Unlock faster high-precision Syn AI Pro, hands-free Voice OS, What-If Physics 3D, AlgoCity 3D, Quantum Holodeck & WebAR.'
                : 'Mở khóa Syn AI Pro phản hồi nhanh & chính xác vượt bậc, Voice OS, Vũ Trụ What-If 3D, AlgoCity 3D, Lượng tử & WebAR.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('synapse_v2')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-5 py-3 text-sm font-semibold shadow-sm transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isEn ? 'Open Synapse Pre' : 'Khám phá Synapse Pre'}</span>
          </button>
        </div>

        <LiveMeetShowcaseCard
          id="live-meet-showcase"
          isEn={isEn}
          onOpenMeet={() => onNavigate('live_meet')}
        />
      </section>

      {/* 4. PERSONAL WORKSPACE TABS (Zero Vertical Bloat) */}
      <section className="space-y-5 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEn ? 'Study Resources' : 'Tài nguyên & Công cụ học tập'}
          </h2>

          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {(
              [
                { id: 'directory', vi: 'Mục lục bài giảng', en: 'Curriculum' },
                { id: 'focus_notes', vi: 'Pomodoro & Ghi chú', en: 'Focus & Notes' },
                { id: 'community', vi: 'Đánh giá', en: 'Reviews' },
                { id: 'app_docs', vi: 'Tải App & Thuyết minh', en: 'App & Docs' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isEn ? tab.en : tab.vi}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'directory' && (
          <Suspense
            fallback={
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-sm text-slate-500">
                {isEn ? 'Loading curriculum directory...' : 'Đang tải mục lục bài giảng...'}
              </div>
            }
          >
            <LectureDirectorySection
              id="overview-lecture-directory"
              subjectFilter={directorySubject}
              onSubjectFilterChange={setDirectorySubject}
              onSelectLecture={(target) => {
                navigate({ subject: target.subject });
              }}
            />
          </Suspense>
        )}

        {activeTab === 'focus_notes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Focus Timer (Pomodoro)' : 'Đồng hồ tập trung (Pomodoro)'}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {isRunning ? (isEn ? 'Running' : 'Đang chạy') : isEn ? 'Paused' : 'Tạm dừng'}
                </span>
              </div>

              <div className="text-4xl font-mono font-bold tabular-nums text-sky-600 dark:text-sky-400 py-2">
                {formatTimer(timeLeft)}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={startPause}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRunning ? (isEn ? 'Pause' : 'Tạm dừng') : isEn ? 'Start' : 'Bắt đầu'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetTimer}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Reset' : 'Đặt lại'}</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEn ? 'Quick Study Notes' : 'Ghi chú học tập nhanh'}
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  placeholder={isEn ? 'Write a formula or reminder...' : 'Ghi nhanh công thức hoặc lưu ý...'}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="inline-flex items-center gap-1 rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Add' : 'Thêm'}</span>
                </button>
              </div>

              <ul className="space-y-2 max-h-44 overflow-y-auto">
                {notes.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-start justify-between gap-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 px-3 py-2 text-xs text-slate-700 dark:text-slate-200"
                  >
                    <span>{n.text}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(n.id)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer shrink-0"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'community' && <PlatformReviews />}

        {activeTab === 'app_docs' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Project Documentation (.docx)' : 'Tải file Thuyết minh Dự án (.docx)'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isEn
                    ? 'Full specification of all STEM simulations, Live Meet 3D, and Synapse Pre features.'
                    : 'Bản thuyết minh đầy đủ toàn bộ tính năng mô phỏng, Phòng học trực tuyến 3D và Synapse Pre.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadDocx}
                  disabled={downloadingDocx}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 text-xs font-semibold cursor-pointer disabled:opacity-60"
                >
                  <FileText className="w-4 h-4" />
                  <span>
                    {downloadingDocx
                      ? isEn
                        ? 'Generating...'
                        : 'Đang tạo file...'
                      : isEn
                      ? 'Download .docx'
                      : 'Tải Thuyết Minh (.docx)'}
                  </span>
                </button>
                {onOpenSettings && (
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Graphics & Settings' : 'Cài đặt Đồ họa'}</span>
                  </button>
                )}
              </div>
            </div>

            <AppDownloadGuideSection id="overview-app-download" onOpenInstallApp={onOpenInstallApp} />
          </div>
        )}
      </section>
    </div>
  );
};
