import React, { useState, useEffect, useMemo } from 'react';
import { CurriculumTrack, FunctionPlotConfig, MathLecture, SpecializedTier } from '../../types';
import { MATH_LECTURES } from '../../data/curriculumData';
import { Math3DMode } from './Math3DView';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Search,
  Zap,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Layers,
  Award,
  Sparkles,
  Copy,
  Check,
  Compass,
  LineChart,
  HelpCircle,
  Clock,
  ArrowLeft,
  Box,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MathFormula, FormattedText } from '../common/MathRenderer';
import { ViewportPortal } from '../common/ViewportPortal';
import { InteractiveLectureRoom } from '../common/InteractiveLectureRoom';
import { LectureThumbnail } from '../common/LectureThumbnail';
import { buildMathLectureSteps } from '../../data/lectureStepsBuilder';
import { useNavigation } from '../../context/NavigationContext';

interface MathLecturesProps {
  onNavigateTab?: (
    tab: 'grapher' | 'geometry' | 'math3d' | 'lectures',
    opts?: { graphConfig?: Partial<FunctionPlotConfig>; mode3d?: Math3DMode }
  ) => void;
}

const get3DModeLabel = (mode?: Math3DMode): string => {
  switch (mode) {
    case 'circle_theorems_3d':
      return 'Đường Tròn & Hình Nón Tiếp Tuyến 3D';
    case 'conic_sections_3d':
      return 'Mặt Nón Conic 3D';
    case 'line_plane_oxyz':
      return 'Đường & Mặt Oxyz 3D';
    case 'integral_disks_3d':
      return 'Tích Phân Đĩa Trụ 3D';
    case 'sphere_plane':
      return 'Mặt Cầu & Mặt Phẳng 3D';
    case 'pyramid_section':
      return 'Khối Chóp & Thiết Diện 3D';
    case 'revolution_solid':
      return 'Khối Tròn Xoay 3D';
    default:
      return 'Hệ Trục Oxyz 3D';
  }
};

export const MathLectures: React.FC<MathLecturesProps> = ({ onNavigateTab }) => {
  const { addXP } = useAuth();
  const { t } = useLanguage();

  // 2-Zone Track State: 'khong_chuyen' (GDPT 9-12) vs 'chuyen' (CB -> NC -> Chuyên/HSG)
  const [selectedTrack, setSelectedTrack] = useState<CurriculumTrack>('khong_chuyen');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<'all' | SpecializedTier>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { location, navigate } = useNavigation();
  const viewMode = location.mathViewMode;
  const activeLectureId = location.mathLectureId;
  const [activeTab, setActiveTab] = useState<'theory' | 'flashcards' | 'quiz'>('theory');

  // Interactive Quiz State (MCQ)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Record<string, boolean>>({});

  // Essay Hints & Solutions Toggle State
  const [revealedEssayHints, setRevealedEssayHints] = useState<Record<string, boolean>>({});
  const [revealedEssaySolutions, setRevealedEssaySolutions] = useState<Record<string, boolean>>({});

  // Flashcards state
  const [currentCardIdx, setCurrentCardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Focus / Fullscreen Mode State
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // Copy Formula State
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Categories list for Không Chuyên (GDPT 2018)
  const categories = [
    { id: 'all', label: t('cat.all', 'Tất cả chuyên đề', 'All Topics') },
    { id: 'Đại số', label: t('cat.alg', 'Đại số & Hàm số (9–10)', 'Algebra (9–10)') },
    { id: 'Giải tích', label: t('cat.calc', 'Giải tích (11–12)', 'Calculus (11–12)') },
    { id: 'Hình học', label: t('cat.geo', 'Hình học (9–12)', 'Geometry (9–12)') },
    { id: 'Lượng giác & Mũ', label: t('cat.trig', 'Lượng giác, Mũ & Log', 'Trig, Exp & Log') },
    { id: 'Đại số & Xác suất', label: t('cat.prob', 'Thống kê, Tổ hợp & Xác suất', 'Statistics & Probability') }
  ];

  const gradeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Lớp 9': 0,
      'Lớp 10': 0,
      'Lớp 11': 0,
      'Lớp 12': 0
    };
    MATH_LECTURES.forEach((lec) => {
      if ((lec.track || 'khong_chuyen') !== 'khong_chuyen') return;
      const g =
        lec.gradeGroup ||
        (lec.grade.includes('Lớp 9')
          ? 'Lớp 9'
          : lec.grade.includes('Lớp 10')
            ? 'Lớp 10'
            : lec.grade.includes('Lớp 11')
              ? 'Lớp 11'
              : lec.grade.includes('Lớp 12')
                ? 'Lớp 12'
                : '');
      if (g && g in counts) counts[g] += 1;
    });
    return counts;
  }, []);

  const availableChapters = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    MATH_LECTURES.forEach((lec) => {
      const lecTrack = lec.track || 'khong_chuyen';
      if (lecTrack !== selectedTrack) return;
      if (selectedTrack === 'khong_chuyen') {
        const matchesGrade =
          selectedGrade === 'all' ||
          lec.gradeGroup === selectedGrade ||
          lec.grade.includes(selectedGrade);
        const matchesCategory =
          selectedCategory === 'all' || lec.category === selectedCategory;
        if (!matchesGrade || !matchesCategory) return;
      } else {
        const matchesTier = selectedTier === 'all' || lec.tier === selectedTier;
        if (!matchesTier) return;
      }
      if (lec.stageLabel && !seen.has(lec.stageLabel)) {
        seen.add(lec.stageLabel);
        list.push(lec.stageLabel);
      }
    });
    return list;
  }, [selectedTrack, selectedGrade, selectedCategory, selectedTier]);

  // Filtered and chronologically sorted lectures
  const filteredLectures = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const getGradeRank = (lec: MathLecture): number => {
      if (lec.gradeGroup === 'Lớp 9' || lec.grade.includes('Lớp 9')) return 9;
      if (lec.gradeGroup === 'Lớp 10' || lec.grade.includes('Lớp 10')) return 10;
      if (lec.gradeGroup === 'Lớp 11' || lec.grade.includes('Lớp 11')) return 11;
      if (lec.gradeGroup === 'Lớp 12' || lec.grade.includes('Lớp 12')) return 12;
      return 99;
    };

    return MATH_LECTURES.filter((lec) => {
      const lecTrack = lec.track || 'khong_chuyen';
      if (lecTrack !== selectedTrack) return false;

      if (selectedTrack === 'khong_chuyen') {
        const matchesGrade =
          selectedGrade === 'all' ||
          lec.gradeGroup === selectedGrade ||
          lec.grade.includes(selectedGrade);
        const matchesCategory =
          selectedCategory === 'all' || lec.category === selectedCategory;
        if (!matchesGrade || !matchesCategory) return false;
      } else {
        const matchesTier = selectedTier === 'all' || lec.tier === selectedTier;
        if (!matchesTier) return false;
      }

      if (selectedChapter !== 'all' && lec.stageLabel !== selectedChapter) {
        return false;
      }

      if (!q) return true;
      return (
        lec.title.toLowerCase().includes(q) ||
        lec.description.toLowerCase().includes(q) ||
        (lec.stageLabel ? lec.stageLabel.toLowerCase().includes(q) : false) ||
        lec.keyFormulas.some((f) => f.toLowerCase().includes(q))
      );
    }).sort((a, b) => {
      if (selectedTrack === 'khong_chuyen') {
        const ga = getGradeRank(a);
        const gb = getGradeRank(b);
        if (ga !== gb) return ga - gb;
      }
      const na = a.lessonNumber ?? 999;
      const nb = b.lessonNumber ?? 999;
      return na - nb;
    });
  }, [selectedTrack, selectedGrade, selectedCategory, selectedTier, selectedChapter, searchQuery]);

  // Ensure activeLecture always matches current track/filter
  const activeLecture: MathLecture = useMemo(() => {
    const match = filteredLectures.find((l) => l.id === activeLectureId);
    if (match) return match;
    return filteredLectures[0] || MATH_LECTURES[0];
  }, [filteredLectures, activeLectureId]);

  useEffect(() => {
    setCurrentCardIdx(0);
    setIsFlipped(false);
  }, [activeLecture.id]);

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
      } catch {
        // ignore auth context errors
      }
    }
  };

  const currentLecIndex = filteredLectures.findIndex((l) => l.id === activeLecture.id);
  const prevLecture = currentLecIndex > 0 ? filteredLectures[currentLecIndex - 1] : null;
  const nextLecture =
    currentLecIndex >= 0 && currentLecIndex < filteredLectures.length - 1
      ? filteredLectures[currentLecIndex + 1]
      : null;

  const handleOpenLecture = (lecId: string) => {
    setActiveTab('theory');
    navigate({ mathViewMode: 'lecture', mathLectureId: lecId });
  };

  const handleOpen2DSimForLecture = (lec: MathLecture) => {
    if (!onNavigateTab) return;
    if (lec.sim2dMode === 'geometry') {
      onNavigateTab('geometry');
      return;
    }
    const fallbackConfig: Partial<FunctionPlotConfig> = lec.defaultGraphConfig || {
      type: 'quadratic',
      params: { a: 1, b: -2, c: -3, d: 0 },
      color: '#4f46e5',
      name: lec.title.split(':')[0]
    };
    onNavigateTab('grapher', { graphConfig: fallbackConfig });
  };

  const handleOpen3DSimForLecture = (lec: MathLecture) => {
    if (!onNavigateTab) return;
    onNavigateTab('math3d', { mode3d: lec.sim3dMode || 'oxyz_vector' });
  };

  const handleOpen2DSim = () => {
    handleOpen2DSimForLecture(activeLecture);
  };

  const handleOpen3DSim = () => {
    handleOpen3DSimForLecture(activeLecture);
  };

  const khongChuyenCount = MATH_LECTURES.filter((l) => (l.track || 'khong_chuyen') === 'khong_chuyen').length;
  const chuyenCount = MATH_LECTURES.filter((l) => l.track === 'chuyen').length;
  const essayList = activeLecture.essayProblems || [];

  return (
    <ViewportPortal active={isFocusMode}>
      <div
        className={
          isFocusMode
            ? 'fixed inset-0 z-[100] h-[100dvh] w-screen p-4 sm:p-8 bg-slate-100/98 dark:bg-slate-950/98 backdrop-blur-2xl flex flex-col overflow-y-auto'
            : 'space-y-6'
        }
      >
        {isFocusMode && (
          <div className="sticky top-0 z-20 mb-4 flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-white/95 dark:bg-slate-900/95 border border-blue-200 dark:border-sky-800 shadow-md backdrop-blur-md">
            <button
              onClick={() => setIsFocusMode(false)}
              className="cs-deck-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-blue-700 text-white hover:bg-blue-800 transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại chế độ thường (Esc)</span>
            </button>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
              Đang đọc tập trung: {activeLecture.title}
            </span>
          </div>
        )}

        {/* Top Banner, Track Switcher & Search Controls (Shown in Catalog Mode) */}
        {viewMode === 'catalog' && (
          <>
            <div className="sci-frame sci-blueprint-bg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-blue-700 dark:text-sky-400 uppercase tracking-wider">
                      Toán Học 9–12 &amp; Bồi Dưỡng Chuyên
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{khongChuyenCount} bài GDPT Không chuyên</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{chuyenCount} chuyên đề Chuyên Toán</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    Chọn Khung Chương Trình &amp; Chuyên Đề Toán Học Tương Tác
                  </h2>
                </div>

                {/* Quick 2D / 3D Simulation Launch Buttons */}
                {onNavigateTab && (
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
                    <button
                      type="button"
                      data-ripple="true"
                      onClick={() => handleOpen2DSimForLecture(filteredLectures[0] || activeLecture)}
                      className="group cs-deck-btn flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-sm whitespace-nowrap cursor-pointer"
                    >
                      <LineChart className="w-4 h-4 icon-anim-wave" />
                      <span>Mô phỏng 2D</span>
                    </button>
                    <button
                      type="button"
                      data-ripple="true"
                      onClick={() => handleOpen3DSimForLecture(filteredLectures[0] || activeLecture)}
                      className="group sim-btn-3d cs-deck-btn flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-sm whitespace-nowrap cursor-pointer"
                    >
                      <Box className="w-4 h-4 icon-anim-3d-cube" />
                      <span>Mô phỏng 3D</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 2 Separate Animated Framed Track Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Khung 1: Khu Không Chuyên (GDPT 9-12) */}
                <div
                  style={
                    {
                      '--math-accent': '#1d4ed8',
                      '--math-secondary': '#0ea5e9'
                    } as React.CSSProperties
                  }
                  className={`math-zone-frame group ${
                    selectedTrack === 'khong_chuyen'
                      ? 'math-zone-active shadow-[0_14px_34px_-12px_rgba(29,78,216,0.38)]'
                      : 'shadow-xs'
                  }`}
                >
                  <div aria-hidden="true" className="math-geo-ring" />
                  <button
                    type="button"
                    data-ripple="true"
                    onClick={() => {
                      setSelectedTrack('khong_chuyen');
                      setSelectedChapter('all');
                    }}
                    className={`relative z-10 w-full h-full text-left rounded-[0.5rem] p-4 sm:p-5 overflow-hidden transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                      selectedTrack === 'khong_chuyen'
                        ? 'bg-gradient-to-br from-blue-700 via-blue-600 to-sky-600 text-white'
                        : 'bg-slate-50/95 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <span aria-hidden="true" className="math-grid-sheen" />
                    <div className="relative z-10 flex items-start gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                          selectedTrack === 'khong_chuyen'
                            ? 'bg-white/20 text-white'
                            : 'bg-sky-100 dark:bg-sky-950/60 text-blue-700 dark:text-sky-400'
                        }`}
                      >
                        <Compass className="w-6 h-6 icon-anim-compass" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="text-sm sm:text-base font-extrabold leading-snug">
                          Khu GDPT 2018 (Lớp 9–12)
                        </div>
                        <div
                          className={`text-xs leading-relaxed ${
                            selectedTrack === 'khong_chuyen'
                              ? 'text-sky-100'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          Lớp 9 · Lớp 10 · Lớp 11 · Lớp 12 · {khongChuyenCount} bài chuẩn BGD
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 shrink-0 flex items-center gap-1.5 text-xs font-bold whitespace-nowrap">
                      {selectedTrack === 'khong_chuyen' ? (
                        <span className="inline-flex items-center gap-1 text-white">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Đang mở</span>
                        </span>
                      ) : (
                        <span className="text-blue-700 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform">
                          Chọn khu →
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                {/* Khung 2: Khu Chuyên Toán & Chuyên đề GDPT 2018 */}
                <div
                  style={
                    {
                      '--math-accent': '#d97706',
                      '--math-secondary': '#f59e0b'
                    } as React.CSSProperties
                  }
                  className={`math-zone-frame group ${
                    selectedTrack === 'chuyen'
                      ? 'math-zone-active shadow-[0_14px_34px_-12px_rgba(217,119,6,0.45)]'
                      : 'shadow-xs'
                  }`}
                >
                  <div aria-hidden="true" className="math-geo-ring" />
                  <button
                    type="button"
                    data-ripple="true"
                    onClick={() => {
                      setSelectedTrack('chuyen');
                      setSelectedChapter('all');
                    }}
                    className={`relative z-10 w-full h-full text-left rounded-[0.5rem] p-4 sm:p-5 overflow-hidden transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                      selectedTrack === 'chuyen'
                        ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-slate-950'
                        : 'bg-slate-50/95 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <span aria-hidden="true" className="math-grid-sheen" />
                    <div className="relative z-10 flex items-start gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                          selectedTrack === 'chuyen'
                            ? 'bg-slate-950/15 text-slate-950'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        <Award className="w-6 h-6 icon-anim-award" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="text-sm sm:text-base font-extrabold leading-snug">
                          Khu Chuyên Toán &amp; Chuyên đề GDPT 2018
                        </div>
                        <div
                          className={`text-xs leading-relaxed ${
                            selectedTrack === 'chuyen'
                              ? 'text-slate-900/85 font-medium'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          9 Chuyên đề 10–12 + Bồi dưỡng HSG / Olympic · {chuyenCount} chuyên đề
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 shrink-0 flex items-center gap-1.5 text-xs font-bold whitespace-nowrap">
                      {selectedTrack === 'chuyen' ? (
                        <span className="inline-flex items-center gap-1 text-slate-950">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Đang mở</span>
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                          Chọn khu →
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Filter Strip + Search Box */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                {selectedTrack === 'khong_chuyen' ? (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <span className="text-xs font-semibold text-slate-500 shrink-0 mr-1">
                      {t('grade.label', 'Khối lớp:', 'Grade:')}
                    </span>
                    {[
                      { id: 'all', label: t('grade.all', `Tất cả (${khongChuyenCount})`, `All (${khongChuyenCount})`) },
                      { id: 'Lớp 9', label: `${t('grade.9', 'Lớp 9', 'Grade 9')} (${gradeCounts['Lớp 9']})` },
                      { id: 'Lớp 10', label: `${t('grade.10', 'Lớp 10', 'Grade 10')} (${gradeCounts['Lớp 10']})` },
                      { id: 'Lớp 11', label: `${t('grade.11', 'Lớp 11', 'Grade 11')} (${gradeCounts['Lớp 11']})` },
                      { id: 'Lớp 12', label: `${t('grade.12', 'Lớp 12', 'Grade 12')} (${gradeCounts['Lớp 12']})` }
                    ].map((g) => (
                      <button
                        key={g.id}
                        onClick={() => {
                          setSelectedGrade(g.id);
                          setSelectedChapter('all');
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
                          selectedGrade === g.id
                            ? 'bg-blue-700 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <span className="text-xs font-semibold text-slate-500 shrink-0 mr-1">
                      Trình độ Chuyên:
                    </span>
                    {(['all', 'Cơ bản', 'Nâng cao', 'Chuyên / HSG'] as const).map((tier) => (
                      <button
                        key={tier}
                        onClick={() => {
                          setSelectedTier(tier);
                          setSelectedChapter('all');
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                          selectedTier === tier
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {tier === 'all' ? 'Tất cả lộ trình Chuyên' : tier}
                      </button>
                    ))}
                  </div>
                )}

                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài giảng, công thức..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Category Filter Chips (only when in Không Chuyên track) */}
              {selectedTrack === 'khong_chuyen' && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedChapter('all');
                      }}
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
              )}

              {/* Chapter GDPT 2018 Filter Strip */}
              {availableChapters.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-100/80 dark:border-slate-800/70">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 mr-1">
                    Chương GDPT 2018:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedChapter('all')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md whitespace-nowrap transition-all ${
                      selectedChapter === 'all'
                        ? selectedTrack === 'chuyen'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Tất cả chương ({availableChapters.length})
                  </button>
                  {availableChapters.map((chap) => (
                    <button
                      key={chap}
                      type="button"
                      onClick={() => setSelectedChapter(chap)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-all ${
                        selectedChapter === chap
                          ? selectedTrack === 'chuyen'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-blue-700 text-white shadow-xs'
                          : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {chap}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Catalog Grid of Animated Framed Math Lectures */}
            {filteredLectures.length === 0 ? (
              <div className="p-10 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-xs text-slate-500">
                Không tìm thấy chuyên đề phù hợp bộ lọc hiện tại.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLectures.map((lec) => {
                  const isChuyen = lec.track === 'chuyen';
                  return (
                    <div
                      key={lec.id}
                      style={
                        {
                          '--math-accent': isChuyen ? '#f59e0b' : '#0284c7',
                          '--math-secondary': isChuyen ? '#f97316' : '#2563eb'
                        } as React.CSSProperties
                      }
                      className="math-card-frame group shadow-xs hover:shadow-[0_18px_40px_-14px_rgba(2,132,199,0.34)]"
                    >
                      <div aria-hidden="true" className="math-geo-ring" />
                      <div
                        onClick={() => handleOpenLecture(lec.id)}
                        className="relative z-10 h-full cursor-pointer p-5 rounded-[0.65rem] bg-white/95 dark:bg-slate-900/95 text-left transition-colors flex flex-col justify-between gap-4 overflow-hidden"
                      >
                        <span aria-hidden="true" className="math-grid-sheen" />
                        <div className="relative z-10 space-y-2.5">
                          <div className="flex items-start gap-3">
                            <LectureThumbnail
                              subject="math"
                              id={lec.id}
                              category={lec.category}
                              sim2dMode={lec.sim2dMode}
                              sim3dMode={lec.sim3dMode}
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                <span
                                  className={`font-bold ${
                                    isChuyen
                                      ? 'text-amber-600 dark:text-amber-400'
                                      : 'text-blue-700 dark:text-sky-400'
                                  }`}
                                >
                                  {isChuyen && lec.tier ? `Chuyên · ${lec.tier}` : lec.gradeGroup || lec.grade}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{lec.category || 'Toán học'}</span>
                                {lec.readTimeMinutes && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="tabular-nums">{lec.readTimeMinutes} phút</span>
                                  </>
                                )}
                              </div>

                              {lec.stageLabel && (
                                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                                  {lec.stageLabel}
                                </div>
                              )}

                              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-blue-700 dark:group-hover:text-sky-400 transition-colors">
                                {lec.title}
                              </h3>
                            </div>
                          </div>

                          <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            <FormattedText text={lec.description} />
                          </div>
                        </div>

                        <div className="relative z-10 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                          {onNavigateTab ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                data-ripple="true"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpen2DSimForLecture(lec);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                              >
                                {lec.sim2dMode === 'geometry' ? (
                                  <Compass className="w-3 h-3 icon-anim-compass" />
                                ) : (
                                  <LineChart className="w-3 h-3 icon-anim-wave" />
                                )}
                                <span>Mô phỏng 2D</span>
                              </button>
                              <button
                                type="button"
                                data-ripple="true"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpen3DSimForLecture(lec);
                                }}
                                className="sim-btn-3d inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/70 dark:border-sky-800/60 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                              >
                                <Box className="w-3 h-3 icon-anim-3d-cube" />
                                <span>Mô phỏng 3D</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                              {lec.sampleProblems.length} TN · {(lec.essayProblems || []).length} TL
                            </span>
                          )}
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1 whitespace-nowrap">
                            <span>Vào bài</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* DEDICATED TEACHING CLASSROOM VIEW */}
        {viewMode === 'lecture' && (
          <div className="space-y-4">
            {/* Classroom Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3 sm:p-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setIsFocusMode(false);
                    navigate({ mathViewMode: 'catalog' });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Danh sách Chuyên đề Toán</span>
                </button>

                {prevLecture && (
                  <button
                    onClick={() => handleOpenLecture(prevLecture.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                    title={prevLecture.title}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Bài trước</span>
                  </button>
                )}

                {nextLecture && (
                  <button
                    onClick={() => handleOpenLecture(nextLecture.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                    title={nextLecture.title}
                  >
                    <span className="hidden sm:inline">Bài tiếp</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {onNavigateTab && (
                  <>
                    <button
                      onClick={handleOpen2DSim}
                      className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors whitespace-nowrap"
                    >
                      {activeLecture.sim2dMode === 'geometry' ? (
                        <>
                          <Compass className="w-3.5 h-3.5 icon-anim-compass" />
                          <span>Mô phỏng 2D · Hình học</span>
                        </>
                      ) : (
                        <>
                          <LineChart className="w-3.5 h-3.5 icon-anim-wave" />
                          <span>Mô phỏng 2D · Đồ thị</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleOpen3DSim}
                      className="group sim-btn-3d flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-xl transition-colors whitespace-nowrap"
                    >
                      <Box className="w-3.5 h-3.5 icon-anim-3d-cube" />
                      <span>Mô phỏng 3D · {get3DModeLabel(activeLecture.sim3dMode)}</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  title={isFocusMode ? 'Thoát chế độ tập trung (Esc)' : 'Chế độ đọc tập trung'}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                    isFocusMode
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isFocusMode ? 'Thu nhỏ' : 'Tập trung'}</span>
                </button>
              </div>
            </div>

            {/* Sub-tabs Navigation */}
            <div className="flex items-center gap-2 bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('theory')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  activeTab === 'theory'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. Bài Giảng Chi Tiết Từng Bước</span>
              </button>

              <button
                onClick={() => setActiveTab('flashcards')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  activeTab === 'flashcards'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2. Thẻ ghi nhớ Flashcard</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>
                  3. Trắc nghiệm &amp; Tự luận ({activeLecture.sampleProblems.length} TN · {essayList.length} TL)
                </span>
              </button>
            </div>

            {/* TAB 1: DEDICATED INTERACTIVE LECTURE ROOM */}
            {activeTab === 'theory' && (
              <InteractiveLectureRoom
                lessonKey={activeLecture.id}
                subject="math"
                grade={activeLecture.gradeGroup || activeLecture.grade}
                subjectAccent={activeLecture.track === 'chuyen' ? 'amber' : 'indigo'}
                kicker={`${
                  activeLecture.track === 'chuyen'
                    ? `Chuyên Toán · ${activeLecture.tier || 'Nâng cao'}`
                    : activeLecture.gradeGroup || activeLecture.grade
                } · ${activeLecture.category || 'Toán học'} · ${activeLecture.difficulty || 'Thông hiểu'}${
                  activeLecture.readTimeMinutes ? ` · ${activeLecture.readTimeMinutes} phút` : ''
                }`}
                title={activeLecture.title}
                subtitle={activeLecture.description}
                steps={buildMathLectureSteps(activeLecture)}
                keyFormulas={activeLecture.keyFormulas}
                mnemonics={activeLecture.mnemonics}
                commonTraps={activeLecture.commonTraps}
                onEarnXP={(xp) => {
                  try {
                    addXP(xp);
                  } catch {
                    // ignore auth errors
                  }
                }}
                onOpenSim2D={onNavigateTab ? handleOpen2DSim : undefined}
                onOpenSim3D={onNavigateTab ? handleOpen3DSim : undefined}
                onNextLesson={nextLecture ? () => handleOpenLecture(nextLecture.id) : undefined}
                actions={[
                  ...(onNavigateTab
                    ? [
                        {
                          label:
                            activeLecture.sim2dMode === 'geometry'
                              ? t('', 'Mô phỏng 2D Hình học', '2D Geometry Sim')
                              : t('', 'Mô phỏng 2D Đồ thị', '2D Grapher Sim'),
                          onClick: handleOpen2DSim,
                          variant: 'primary' as const,
                          icon:
                            activeLecture.sim2dMode === 'geometry' ? (
                              <Compass className="w-3.5 h-3.5" />
                            ) : (
                              <LineChart className="w-3.5 h-3.5" />
                            )
                        },
                        {
                          label: `${t('', 'Mô phỏng 3D', '3D Sim')} · ${get3DModeLabel(activeLecture.sim3dMode)}`,
                          onClick: handleOpen3DSim,
                          variant: 'amber' as const,
                          icon: <Box className="w-3.5 h-3.5" />
                        }
                      ]
                    : []),
                  {
                    label: t('', 'Ôn thẻ Flashcard', 'Review Flashcards'),
                    onClick: () => setActiveTab('flashcards'),
                    variant: 'secondary' as const,
                    icon: <Layers className="w-3.5 h-3.5" />
                  },
                  {
                    label: t('', 'Làm Trắc nghiệm & Tự luận', 'Practice & Quiz'),
                    onClick: () => setActiveTab('quiz'),
                    variant: 'emerald' as const,
                    icon: <Award className="w-3.5 h-3.5" />
                  }
                ]}
              />
            )}

            {/* Flashcards & Quiz Card Container */}
            {activeTab !== 'theory' && (
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xs">

              {/* TAB 2: INTERACTIVE FLASHCARD DECK */}
              {activeTab === 'flashcards' && (
                <div className="space-y-5">
                  {activeLecture.flashcards && activeLecture.flashcards.length > 0 ? (
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-lg mb-2 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>{t('', 'Thẻ ghi nhớ kiểm tra kiến thức', 'Active Recall Flashcard')}</span>
                        <span className="font-mono tabular-nums">
                          {currentCardIdx + 1} / {activeLecture.flashcards.length}
                        </span>
                      </div>

                      {/* Flashcard container */}
                      <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="w-full max-w-lg min-h-[220px] p-6 bg-slate-50 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-800 rounded-2xl shadow-sm flex flex-col justify-between cursor-pointer select-none transition-all hover:border-indigo-400 group"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            {isFlipped ? t('', 'Đáp Án / Bí Kíp', 'Answer / Key Tip') : t('', 'Câu Hỏi Tự Vấn', 'Prompt Question')}
                          </span>
                          <span className="text-[11px] text-slate-400 group-hover:text-indigo-500 transition-colors">
                            {t('', 'Nhấp để lật thẻ', 'Click to flip')}
                          </span>
                        </div>

                        <div className="my-auto py-4 text-center">
                          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                            <FormattedText
                              text={
                                isFlipped
                                  ? activeLecture.flashcards[currentCardIdx].back
                                  : activeLecture.flashcards[currentCardIdx].front
                              }
                            />
                          </div>
                          {isFlipped && activeLecture.flashcards[currentCardIdx].tip && (
                            <div className="mt-3 text-xs text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/40 py-1.5 px-3 rounded-lg inline-block">
                              {t('', 'Mẹo:', 'Tip:')} <FormattedText text={activeLecture.flashcards[currentCardIdx].tip!} />
                            </div>
                          )}
                        </div>

                        <div className="text-center text-[11px] text-slate-400">
                          {isFlipped ? t('', 'Nhấp để xem câu hỏi', 'Click to see question') : t('', 'Nhấp vào thẻ để lật đáp án', 'Click card to reveal answer')}
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
                          className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                        >
                          {t('', '← Thẻ trước', '← Prev Card')}
                        </button>
                        <button
                          onClick={() => setIsFlipped(!isFlipped)}
                          className="px-5 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors whitespace-nowrap"
                        >
                          {isFlipped ? t('', 'Lật lại câu hỏi', 'Show Question') : t('', 'Lật xem đáp án', 'Reveal Answer')}
                        </button>
                        <button
                          disabled={currentCardIdx === activeLecture.flashcards.length - 1}
                          onClick={() => {
                            setCurrentCardIdx((prev) =>
                              Math.min(activeLecture.flashcards!.length - 1, prev + 1)
                            );
                            setIsFlipped(false);
                          }}
                          className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                        >
                          {t('', 'Thẻ tiếp →', 'Next Card →')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs italic text-center py-6">
                      {t('', 'Chuyên đề này đang cập nhật bộ thẻ Flashcard. Mời bạn làm bài tập Trắc nghiệm & Tự luận!', 'Flashcards are being updated for this topic. Try the Practice & Quiz exercises!')}
                    </p>
                  )}
                </div>
              )}

              {/* TAB 3: MCQ + ESSAY EXERCISES (VietJack / Loigiaihay) */}
              {activeTab === 'quiz' && (
                <div className="space-y-8">
                  {/* SECTION A: TRẮC NGHIỆM */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-500" />
                        Phần A: Trắc Nghiệm Vận Dụng ({activeLecture.sampleProblems.length} câu)
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        +25 XP cho mỗi đáp án đúng
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
                          <div className="space-y-1">
                            {prob.source && (
                              <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                                {prob.source}
                              </div>
                            )}
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                                Câu {qIdx + 1}: <FormattedText text={prob.question} />
                              </div>
                              {answeredCorrectly[qKey] && (
                                <span className="shrink-0 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                  +25 XP ✓
                                </span>
                              )}
                            </div>
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
                              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors whitespace-nowrap"
                            >
                              Kiểm tra đáp án &amp; Lời giải
                            </button>
                          ) : (
                            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-700/90 space-y-2 text-xs">
                              <div className="flex items-center gap-1.5 font-bold">
                                {isCorrect ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" /> Chính xác!
                                  </span>
                                ) : (
                                  <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <XCircle className="w-4 h-4" /> Chưa chính xác — Xem lời giải chi tiết:
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

                  {/* SECTION B: TỰ LUẬN (ESSAY) */}
                  {essayList.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-500" />
                          Phần B: Bài Tập Tự Luận &amp; Lời Giải Chi Tiết ({essayList.length} bài)
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Chuẩn VietJack / Loigiaihay
                        </span>
                      </div>

                      {essayList.map((essay, eIdx) => {
                        const essayKey = `${activeLecture.id}-essay-${eIdx}`;
                        const hintOpen = !!revealedEssayHints[essayKey];
                        const solOpen = !!revealedEssaySolutions[essayKey];

                        return (
                          <div
                            key={essayKey}
                            className="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3.5"
                          >
                            <div className="space-y-1.5">
                              {essay.source && (
                                <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                                  {essay.source}
                                </div>
                              )}
                              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                                Bài {eIdx + 1}: <FormattedText text={essay.question} />
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                              {essay.hints && essay.hints.length > 0 && (
                                <button
                                  onClick={() =>
                                    setRevealedEssayHints((prev) => ({
                                      ...prev,
                                      [essayKey]: !prev[essayKey]
                                    }))
                                  }
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors whitespace-nowrap"
                                >
                                  <HelpCircle className="w-3.5 h-3.5" />
                                  <span>{hintOpen ? 'Ẩn gợi ý' : 'Xem gợi ý hướng giải'}</span>
                                </button>
                              )}

                              <button
                                onClick={() =>
                                  setRevealedEssaySolutions((prev) => ({
                                    ...prev,
                                    [essayKey]: !prev[essayKey]
                                  }))
                                }
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs whitespace-nowrap"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{solOpen ? 'Thu gọn bài giải' : 'Xem lời giải chi tiết từng bước'}</span>
                              </button>
                            </div>

                            {hintOpen && essay.hints && (
                              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/70 dark:border-amber-900/50 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                                <div className="font-bold">Gợi ý phương pháp:</div>
                                {essay.hints.map((h, i) => (
                                  <div key={i}>
                                    <FormattedText text={h} />
                                  </div>
                                ))}
                              </div>
                            )}

                            {solOpen && (
                              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/90 space-y-2.5 text-xs">
                                <div className="font-bold text-emerald-700 dark:text-emerald-300 text-xs uppercase tracking-wide">
                                  Bài giải tham khảo chi tiết
                                </div>
                                <div className="space-y-2 text-slate-700 dark:text-slate-200 leading-relaxed">
                                  {essay.solutionSteps.map((step, sIdx) => (
                                    <div
                                      key={sIdx}
                                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
                                    >
                                      <FormattedText text={step} />
                                    </div>
                                  ))}
                                </div>
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                                  Đáp số: <FormattedText text={essay.finalAnswer} />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              </div>
            )}
          </div>
        )}
      </div>
    </ViewportPortal>
  );
};
