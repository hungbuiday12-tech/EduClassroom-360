import React, { useState, useEffect } from 'react';
import { MathLecture } from '../../types';
import { MATH_LECTURES } from '../../data/curriculumData';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Search,
  Zap,
  AlertTriangle,
  RotateCcw,
  Maximize2,
  Minimize2,
  Layers,
  ArrowRight,
  ExternalLink,
  Award,
  Sparkles,
  Copy,
  Check,
  Compass,
  LineChart,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MathFormula, FormattedText } from '../common/MathRenderer';

interface MathLecturesProps {
  onNavigateTab?: (tab: 'grapher' | 'geometry' | 'lectures') => void;
}

export const MathLectures: React.FC<MathLecturesProps> = ({ onNavigateTab }) => {
  const { addXP } = useAuth();
  const { t } = useLanguage();

  const [activeLectureId, setActiveLectureId] = useState<string>(MATH_LECTURES[0].id);
  const [activeTab, setActiveTab] = useState<'theory' | 'flashcards' | 'quiz'>('theory');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Interactive Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Record<string, boolean>>({});

  // Flashcards state
  const [currentCardIdx, setCurrentCardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Focus / Fullscreen Mode State
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large'>('normal');

  // Copy Formula State
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const activeLecture = MATH_LECTURES.find((l) => l.id === activeLectureId) || MATH_LECTURES[0];

  // Reset flashcard flip when switching lecture
  useEffect(() => {
    setCurrentCardIdx(0);
    setIsFlipped(false);
  }, [activeLectureId]);

  // Escape key for focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  // Categories list
  const categories = [
    { id: 'all', label: t('cat.all', 'Tất cả chuyên đề', 'All Topics') },
    { id: 'Giải tích', label: t('cat.calc', 'Giải tích (11-12)', 'Calculus (11-12)') },
    { id: 'Hình học', label: t('cat.geo', 'Hình học (9-12)', 'Geometry (9-12)') },
    { id: 'Đại số', label: t('cat.alg', 'Đại số & Hàm số (9-10)', 'Algebra & Functions (9-10)') },
    { id: 'Lượng giác & Mũ', label: t('cat.trig', 'Lượng giác, Mũ & Logarit', 'Trig, Exp & Log') },
    { id: 'Số phức', label: t('cat.complex', 'Số phức', 'Complex Numbers') },
    { id: 'Đại số & Xác suất', label: t('cat.prob', 'Xác suất & Tổ hợp', 'Probability & Combinatorics') }
  ];

  // Filtered lectures
  const filteredLectures = MATH_LECTURES.filter((lec) => {
    const matchesGrade =
      selectedGrade === 'all' ||
      (selectedGrade === 'Lớp 9' && lec.grade.includes('Lớp 9')) ||
      (selectedGrade === 'Lớp 10' && lec.grade.includes('Lớp 10')) ||
      (selectedGrade === 'Lớp 11' && lec.grade.includes('Lớp 11')) ||
      (selectedGrade === 'Lớp 12' && lec.grade.includes('Lớp 12'));

    const matchesCategory =
      selectedCategory === 'all' || lec.category === selectedCategory;
    const matchesSearch =
      lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.keyFormulas.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesCategory && matchesSearch;
  });

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [`${activeLecture.id}-${qIdx}`]: optIdx
    }));
  };

  const handleCheckAnswer = (qIdx: number) => {
    const qKey = `${activeLecture.id}-${qIdx}`;
    const selectedOpt = selectedAnswers[qKey];
    const problem = activeLecture.sampleProblems[qIdx];
    const isCorrect = selectedOpt === problem.correctIndex;

    setShowExplanations((prev) => ({ ...prev, [qKey]: true }));

    if (isCorrect && !answeredCorrectly[qKey]) {
      setAnsweredCorrectly((prev) => ({ ...prev, [qKey]: true }));
      try {
        addXP(25);
      } catch {}
    }
  };

  const handleCopyFormula = (formula: string) => {
    try {
      navigator.clipboard.writeText(formula);
      setCopiedFormula(formula);
      setTimeout(() => setCopiedFormula(null), 1800);
    } catch {}
  };

  return (
    <div
      className={
        isFocusMode
          ? 'fixed inset-0 z-50 p-4 sm:p-8 bg-slate-100/98 dark:bg-slate-950/98 backdrop-blur-2xl flex flex-col overflow-y-auto'
          : 'space-y-6'
      }
    >
      {/* Top Banner & Search Controls */}
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Kho Tàng Bài Giảng Toán Học Trọng Tâm
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs font-mono text-slate-500">
                12 Chuyên đề THPT & Luyện Thi Đại Học
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              Hệ thống hóa Lý thuyết Cốt lõi, Bí kíp Phòng thi & Đấu trường Trắc nghiệm
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm công thức, tiệm cận, logarit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Grade Level Selector (Lớp 9, 10, 11, 12) */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-500 shrink-0 mr-1">
            {t('grade.label', 'Khối lớp:', 'Grade:')}
          </span>
          {[
            { id: 'all', label: t('grade.all', 'Tất cả (Lớp 9 - 12)', 'All (Grades 9-12)') },
            { id: 'Lớp 9', label: t('grade.9', 'Lớp 9', 'Grade 9') },
            { id: 'Lớp 10', label: t('grade.10', 'Lớp 10', 'Grade 10') },
            { id: 'Lớp 11', label: t('grade.11', 'Lớp 11', 'Grade 11') },
            { id: 'Lớp 12', label: t('grade.12', 'Lớp 12', 'Grade 12') }
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGrade(g.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                selectedGrade === g.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Lecture Selection Sidebar */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[780px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Danh sách bài giảng ({filteredLectures.length})
            </span>
          </div>

          {filteredLectures.map((lec) => {
            const isSelected = lec.id === activeLectureId;
            return (
              <div
                key={lec.id}
                onClick={() => setActiveLectureId(lec.id)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-xs'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:border-slate-300 hover:bg-white dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {lec.grade}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {lec.readTimeMinutes && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {lec.readTimeMinutes}p
                      </span>
                    )}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        lec.difficulty === 'Vận dụng cao'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                          : lec.difficulty === 'Vận dụng'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      }`}
                    >
                      {lec.difficulty || 'Thông hiểu'}
                    </span>
                  </div>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug mb-1">
                  {lec.title}
                </h4>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {lec.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Interactive Lecture Studio */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xs">
            {/* Lecture Top Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                    {activeLecture.category || 'Toán học THPT'}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {activeLecture.grade}
                  </span>
                </div>

                {/* Focus Mode & Font Size Adjuster */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setFontSizeLevel((prev) => (prev === 'normal' ? 'large' : 'normal'))
                    }
                    title="Chỉnh cỡ chữ đọc"
                    className="px-2 py-1 text-xs font-mono font-semibold rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {fontSizeLevel === 'normal' ? 'A+' : 'A-'}
                  </button>

                  <button
                    onClick={() => setIsFocusMode(!isFocusMode)}
                    title={isFocusMode ? 'Thoát chế độ tập trung (Esc)' : 'Chế độ đọc tập trung'}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      isFocusMode
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    <span>{isFocusMode ? 'Thu nhỏ' : 'Đọc tập trung'}</span>
                  </button>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-3 tracking-tight">
                {activeLecture.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {activeLecture.description}
              </p>

              {/* Direct Simulation Action Links */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                {activeLecture.defaultGraphConfig && onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('grapher')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                  >
                    <LineChart className="w-3.5 h-3.5" />
                    Khảo sát trực quan trên Đồ thị Oxy
                  </button>
                )}

                {(activeLecture.category === 'Hình học' || activeLecture.id === 'math-10') && onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('geometry')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Mở phòng thực hành Vẽ Hình Học & Đo đạc
                  </button>
                )}
              </div>
            </div>

            {/* Sub-tabs Navigation */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('theory')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'theory'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Lý thuyết & Bí kíp phòng thi
              </button>

              <button
                onClick={() => setActiveTab('flashcards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'flashcards'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Thẻ ghi nhớ Flashcard
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Đấu trường Trắc nghiệm ({activeLecture.sampleProblems.length} câu)
              </button>
            </div>

            {/* TAB 1: THEORY & INSIGHTS */}
            {activeTab === 'theory' && (
              <div
                className={`space-y-6 ${
                  fontSizeLevel === 'large' ? 'text-sm' : 'text-xs'
                }`}
              >
                {/* 1. Core Theory Section */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Tóm tắt kiến thức cốt lõi
                  </h3>
                  <div className="space-y-2.5">
                    {activeLecture.theory.map((item, idx) => (
                      <div
                        key={idx}
                        className="leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800"
                      >
                        <FormattedText text={item} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Key Formulas Vault */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Bảng công thức vàng cần thuộc
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeLecture.keyFormulas.map((f, i) => (
                      <div
                        key={i}
                        className="group relative flex items-center justify-between p-3 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/60 rounded-xl"
                      >
                        <span className="font-mono font-bold text-indigo-950 dark:text-indigo-200">
                          <MathFormula formula={f} />
                        </span>
                        <button
                          onClick={() => handleCopyFormula(f)}
                          title="Sao chép công thức"
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 transition-opacity"
                        >
                          {copiedFormula === f ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Mnemonics / Exam Hacks */}
                {activeLecture.mnemonics && activeLecture.mnemonics.length > 0 && (
                  <div className="p-4 bg-amber-50/80 dark:bg-amber-950/25 border border-amber-200/70 dark:border-amber-900/50 rounded-xl space-y-2">
                    <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 uppercase tracking-wide">
                      <Zap className="w-4 h-4 text-amber-500" />
                      Bí kíp phòng thi & Mẹo ghi nhớ siêu tốc
                    </h3>
                    <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200/90 pl-1">
                      {activeLecture.mnemonics.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold shrink-0">⚡</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 4. Common Traps / Pitfalls */}
                {activeLecture.commonTraps && activeLecture.commonTraps.length > 0 && (
                  <div className="p-4 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/50 rounded-xl space-y-2">
                    <h3 className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5 uppercase tracking-wide">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      Cạm bẫy hay sai lầm phổ biến của học sinh
                    </h3>
                    <ul className="space-y-1.5 text-xs text-rose-950 dark:text-rose-200/90 pl-1">
                      {activeLecture.commonTraps.map((trap, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold shrink-0">⚠️</span>
                          <span>{trap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INTERACTIVE FLASHCARD DECK */}
            {activeTab === 'flashcards' && (
              <div className="space-y-5">
                {activeLecture.flashcards && activeLecture.flashcards.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-lg mb-2 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Thẻ ghi nhớ kiểm tra kiến thức</span>
                      <span className="font-mono">
                        {currentCardIdx + 1} / {activeLecture.flashcards.length}
                      </span>
                    </div>

                    {/* Flashcard container */}
                    <div
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="w-full max-w-lg min-h-[220px] p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl shadow-sm flex flex-col justify-between cursor-pointer select-none transition-all hover:border-indigo-400 group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          {isFlipped ? 'Đáp Án / Bí Kíp' : 'Câu Hỏi Tự Vấn'}
                        </span>
                        <span className="text-[11px] text-slate-400 group-hover:text-indigo-500 transition-colors">
                          Nhấp để lật thẻ ↻
                        </span>
                      </div>

                      <div className="my-auto py-4 text-center">
                        <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                          {isFlipped
                            ? activeLecture.flashcards[currentCardIdx].back
                            : activeLecture.flashcards[currentCardIdx].front}
                        </p>
                        {isFlipped && activeLecture.flashcards[currentCardIdx].tip && (
                          <p className="mt-3 text-xs text-amber-700 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/40 py-1.5 px-3 rounded-lg inline-block">
                            💡 Mẹo: {activeLecture.flashcards[currentCardIdx].tip}
                          </p>
                        )}
                      </div>

                      <div className="text-center text-[11px] text-slate-400">
                        {isFlipped ? 'Nhấp để xem câu hỏi' : 'Nhấp vào thẻ để lật đáp án'}
                      </div>
                    </div>

                    {/* Flashcard Nav Buttons */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        disabled={currentCardIdx === 0}
                        onClick={() => {
                          setCurrentCardIdx((prev) => Math.max(0, prev - 1));
                          setIsFlipped(false);
                        }}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        ← Thẻ trước
                      </button>
                      <button
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="px-5 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
                      >
                        {isFlipped ? 'Lật lại câu hỏi' : 'Lật xem đáp án'}
                      </button>
                      <button
                        disabled={currentCardIdx === activeLecture.flashcards.length - 1}
                        onClick={() => {
                          setCurrentCardIdx((prev) =>
                            Math.min(activeLecture.flashcards!.length - 1, prev + 1)
                          );
                          setIsFlipped(false);
                        }}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        Thẻ tiếp →
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs italic text-center py-6">
                    Chuyên đề này đang cập nhật bộ thẻ Flashcard. Mời bạn làm câu hỏi trắc nghiệm!
                  </p>
                )}
              </div>
            )}

            {/* TAB 3: MASTERY PRACTICE QUIZ */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Chọn đáp án đúng nhất. Mỗi câu đúng nhận ngay +25 XP học thuật!
                  </span>
                </div>

                {activeLecture.sampleProblems.map((prob, qIdx) => {
                  const qKey = `${activeLecture.id}-${qIdx}`;
                  const selectedOpt = selectedAnswers[qKey];
                  const isChecked = showExplanations[qKey];
                  const isCorrect = selectedOpt === prob.correctIndex;

                  return (
                    <div
                      key={qIdx}
                      className="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          Câu {qIdx + 1}: <FormattedText text={prob.question} />
                        </div>
                        {answeredCorrectly[qKey] && (
                          <span className="shrink-0 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200">
                            +25 XP ✓
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {prob.options.map((opt, optIdx) => {
                          const isOptionSelected = selectedOpt === optIdx;
                          let btnStyle =
                            'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300';
                          if (isChecked) {
                            if (optIdx === prob.correctIndex) {
                              btnStyle =
                                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold';
                            } else if (isOptionSelected) {
                              btnStyle =
                                'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 font-semibold';
                            }
                          } else if (isOptionSelected) {
                            btnStyle =
                              'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold shadow-xs';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={isChecked}
                              onClick={() => handleSelectOption(qIdx, optIdx)}
                              className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs leading-relaxed transition-all ${btnStyle}`}
                            >
                              <FormattedText text={opt} />
                            </button>
                          );
                        })}
                      </div>

                      {!isChecked ? (
                        <button
                          disabled={selectedOpt === undefined}
                          onClick={() => handleCheckAnswer(qIdx)}
                          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
                        >
                          Kiểm tra đáp án & Lời giải
                        </button>
                      ) : (
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-700/90 space-y-2 text-xs">
                          <div className="flex items-center gap-1.5 font-bold">
                            {isCorrect ? (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Chính xác tuyệt đối!
                              </span>
                            ) : (
                              <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                                <XCircle className="w-4 h-4" /> Chưa chính xác! Xem lời giải chi tiết dưới đây:
                              </span>
                            )}
                          </div>
                          <div className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                            <FormattedText text={prob.explanation} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
