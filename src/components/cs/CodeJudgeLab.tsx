import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { CS_LESSONS } from '../../data/csLessonsData';
import { CODING_PROBLEMS } from '../../data/curriculumData';
import {
  CodeLanguage,
  CodingProblem,
  SubmissionRecord,
  TestResult,
  CSLesson,
  CSLevel
} from '../../types';
import { executeCode, judgeProblem } from './codeRunner';
import {
  analyzeCodeMistakeWithAI,
  CodeMistakeAnalysis,
  LESSON_HIDDEN_TEST_CASES
} from './problemAnalyzer';
import { CodeMistakeAnalysisPanel } from './CodeMistakeAnalysisPanel';
import { SublimeStudio } from './SublimeStudio';
import { SublimeEditor, MonokaiCodeBlock } from './SublimeEditor';
import { ViewportPortal } from '../common/ViewportPortal';
import { FormattedText } from '../common/MathRenderer';
import { InteractiveLectureRoom } from '../common/InteractiveLectureRoom';
import { LectureThumbnail } from '../common/LectureThumbnail';
import { buildCSLectureSteps } from '../../data/lectureStepsBuilder';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { AlgorithmVisualizer } from './AlgorithmVisualizer';
import { AlgoId, LESSON_TO_ALGO_MAP } from './visualizer/types';
import {
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Code2,
  FileCode2,
  Award,
  Layers,
  Sparkles,
  BookOpen,
  ChevronRight,
  Copy,
  Check,
  Zap,
  ArrowRight,
  ArrowLeft,
  Maximize2,
  Minimize2,
  GitBranch
} from 'lucide-react';

interface CodeJudgeLabProps {
  onScoreEarned?: (xp: number) => void;
  onBack?: () => void;
}

const DEFAULT_PRACTICE_CPP = `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    // Tự viết code C++ giải bài tập tại đây...
    
    return 0;
}`;

const DEFAULT_PRACTICE_PYTHON = `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    # Tự viết code Python giải bài tập tại đây...

if __name__ == '__main__':
    solve()
`;

interface LessonPracticeRunState {
  customIn: string;
  customOut: string;
  customErr: string;
  runtimeMs: number | null;
  isRunning: boolean;
  isJudging: boolean;
  results: TestResult[] | null;
  score: number | null;
  verdict: string | null;
  mistakeAnalysis: CodeMistakeAnalysis | null;
  isAnalyzingMistake: boolean;
  submitted: boolean;
  awardedXp: number;
}

export const CodeJudgeLab: React.FC<CodeJudgeLabProps> = ({ onScoreEarned, onBack }) => {
  const { t } = useLanguage();
  const { location, navigate, goBack } = useNavigation();
  // Top View Mode: 'curriculum' (VNOI Roadmap & Bài giảng), 'judge' (Trình chấm online), or 'custom' (Sublime Studio)
  const viewMode = location.csViewMode;
  // Sub-view inside curriculum: 'roadmap' (VNOI Roadmap grid) or 'lecture' (Dedicated teaching classroom)
  const curriculumSubView = location.csSubView;
  const lessonTab = location.csLessonTab;

  // VNOI Phase filter: 'all' | phase name
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  const vnoiPhases = [
    'Phase 0 · Nhập môn & Độ phức tạp',
    'Phase 1 · Cơ bản & Số học sơ cấp',
    'Phase 2 · Kỹ thuật tối ưu kinh điển',
    'Phase 3 · Quy hoạch động & Đồ thị',
    'Phase 4 · Cấu trúc dữ liệu & HSG'
  ];

  const filteredLessons = useMemo(() => {
    if (selectedPhase === 'all') return CS_LESSONS;
    return CS_LESSONS.filter((l) => l.vnoiPhase === selectedPhase);
  }, [selectedPhase]);

  // Current selected lesson
  const selectedLessonId = location.csLessonId;
  const currentLesson: CSLesson = useMemo(() => {
    return (
      CS_LESSONS.find((l) => l.id === selectedLessonId) ||
      filteredLessons[0] ||
      CS_LESSONS[0]
    );
  }, [selectedLessonId, filteredLessons]);

  // Code language for curriculum illustrated code & practice editor
  const [curriculumLang, setCurriculumLang] = useState<CodeLanguage>('cpp');
  const [revealedSolution, setRevealedSolution] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [lessonCodeMap, setLessonCodeMap] = useState<Record<string, { cpp: string; python: string }>>({});
  const [lessonPracticeMap, setLessonPracticeMap] = useState<Record<string, LessonPracticeRunState>>({});

  // Helper to convert CSLesson practice problem to CodingProblem
  const toCodingProblem = (p: CSLesson['practiceProblem']): CodingProblem => ({
    id: p.id,
    title: p.title,
    category: 'Luyện tập',
    difficulty: p.difficulty,
    timeLimit: '1.0s',
    memoryLimit: '256MB',
    description: p.description,
    inputFormat: p.inputFormat,
    outputFormat: p.outputFormat,
    constraints: ['Thời gian chạy 1.0s, bộ nhớ 256MB'],
    sampleCases: p.sampleCases.map((s, idx) => ({
      id: idx + 1,
      input: s.input,
      expectedOutput: s.output,
      isSample: true,
      explanation: s.explanation,
      difficulty: 'Cơ bản'
    })),
    hiddenCases: (LESSON_HIDDEN_TEST_CASES[p.id] || []).map((tc, idx) => ({
      id: p.sampleCases.length + idx + 1,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isSample: false,
      difficulty: tc.difficulty
    })),
    cppTemplate: DEFAULT_PRACTICE_CPP,
    pythonTemplate: DEFAULT_PRACTICE_PYTHON
  });

  // -----------------------------------------------------------------
  // Online Judge state
  // -----------------------------------------------------------------
  const [selectedProblemId, setSelectedProblemId] = useState<string>('SUM2');
  const currentProblem: CodingProblem = useMemo(() => {
    // Check if matching in CODING_PROBLEMS or in CS_LESSONS practice problems
    const inProblems = CODING_PROBLEMS.find((p) => p.id === selectedProblemId);
    if (inProblems) return inProblems;

    const inLessons = CS_LESSONS.find((l) => l.practiceProblem.id === selectedProblemId);
    if (inLessons) return toCodingProblem(inLessons.practiceProblem);

    return CODING_PROBLEMS[0];
  }, [selectedProblemId]);

  const [judgeLang, setJudgeLang] = useState<CodeLanguage>('cpp');
  const [code, setCode] = useState<string>(currentProblem.cppTemplate);
  const [fontSize, setFontSize] = useState<number>(14);
  const [isJudgeFullscreen, setIsJudgeFullscreen] = useState<boolean>(false);
  const [isJudgeSidebarOpen, setIsJudgeSidebarOpen] = useState<boolean>(true);
  const [mobileJudgePane, setMobileJudgePane] = useState<'problem' | 'editor' | 'console'>('editor');

  // Bottom tabs: 'custom_run' | 'judge_results' | 'history'
  const [activeConsoleTab, setActiveConsoleTab] = useState<'custom_run' | 'judge_results' | 'history'>('custom_run');

  // Custom Run state
  const [customInput, setCustomInput] = useState<string>(currentProblem.sampleCases[0]?.input || '');
  const [customOutput, setCustomOutput] = useState<string>('');
  const [customStderr, setCustomStderr] = useState<string>('');
  const [customRuntime, setCustomRuntime] = useState<number | null>(null);
  const [isRunningCustom, setIsRunningCustom] = useState<boolean>(false);

  // Judge State
  const [isJudging, setIsJudging] = useState<boolean>(false);
  const [judgeResults, setJudgeResults] = useState<TestResult[] | null>(null);
  const [judgeScore, setJudgeScore] = useState<number | null>(null);
  const [judgeVerdict, setJudgeVerdict] = useState<string | null>(null);

  // Submissions history
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isJudgeFullscreen) setIsJudgeFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isJudgeFullscreen]);

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Switch to Online Judge with a specific problem pre-loaded
  const handleLoadIntoJudge = (prob: CSLesson['practiceProblem']) => {
    const cp = toCodingProblem(prob);
    setSelectedProblemId(cp.id);
    setCode(judgeLang === 'cpp' ? cp.cppTemplate : cp.pythonTemplate);
    setCustomInput(cp.sampleCases[0]?.input || '');
    setCustomOutput('');
    setCustomStderr('');
    setCustomRuntime(null);
    setJudgeResults(null);
    setJudgeScore(null);
    navigate({ csViewMode: 'judge' });
  };

  // When problem or language changes in Judge
  const handleProblemChange = (prob: CodingProblem) => {
    setSelectedProblemId(prob.id);
    setCode(judgeLang === 'cpp' ? prob.cppTemplate : prob.pythonTemplate);
    setCustomInput(prob.sampleCases[0]?.input || '');
    setCustomOutput('');
    setCustomStderr('');
    setCustomRuntime(null);
    setJudgeResults(null);
    setJudgeScore(null);
  };

  const handleLanguageChange = (lang: CodeLanguage) => {
    setJudgeLang(lang);
    setCode(lang === 'cpp' ? currentProblem.cppTemplate : currentProblem.pythonTemplate);
  };

  const handleResetTemplate = () => {
    setCode(judgeLang === 'cpp' ? currentProblem.cppTemplate : currentProblem.pythonTemplate);
  };

  // Run with custom stdin
  const handleRunCustom = async () => {
    setIsRunningCustom(true);
    setActiveConsoleTab('custom_run');
    setCustomOutput('Đang biên dịch và thực thi...');
    setCustomStderr('');

    const res = await executeCode(currentProblem.id, judgeLang, code, customInput);
    setIsRunningCustom(false);
    setCustomOutput(res.stdout);
    setCustomStderr(res.stderr);
    setCustomRuntime(res.runtimeMs);
  };

  // Submit and Judge
  const handleSubmitCode = async () => {
    setIsJudging(true);
    setActiveConsoleTab('judge_results');
    setJudgeResults(null);

    const result = await judgeProblem(currentProblem, judgeLang, code);
    setIsJudging(false);
    setJudgeResults(result.results);
    setJudgeScore(result.score);
    setJudgeVerdict(result.verdict);

    // Save submission
    const newSub: SubmissionRecord = {
      id: Date.now().toString(),
      problemId: currentProblem.id,
      problemTitle: currentProblem.title,
      language: judgeLang,
      passedCount: result.passedCount,
      totalCount: result.totalCount,
      score: result.score,
      status:
        result.verdict === 'Accepted'
          ? 'Accepted'
          : result.score > 0
          ? 'Partial'
          : 'Wrong Answer',
      submittedAt: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
    setSubmissions([newSub, ...submissions]);

    if (result.score === 100) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onScoreEarned) onScoreEarned(100);
    } else if (result.score > 0) {
      if (onScoreEarned) onScoreEarned(Math.floor(result.score * 0.4));
    }
  };

  // Per-lesson inline self-coding helpers
  const getLessonCode = (probId: string, lang: CodeLanguage): string => {
    const entry = lessonCodeMap[probId];
    if (entry) return lang === 'cpp' ? entry.cpp : entry.python;
    return lang === 'cpp' ? DEFAULT_PRACTICE_CPP : DEFAULT_PRACTICE_PYTHON;
  };

  const setLessonCode = (probId: string, lang: CodeLanguage, value: string) => {
    setLessonCodeMap((prev) => {
      const existing = prev[probId] || {
        cpp: DEFAULT_PRACTICE_CPP,
        python: DEFAULT_PRACTICE_PYTHON
      };
      return {
        ...prev,
        [probId]: {
          ...existing,
          [lang]: value
        }
      };
    });
  };

  const getLessonPracticeState = (prob: CSLesson['practiceProblem']): LessonPracticeRunState => {
    return (
      lessonPracticeMap[prob.id] || {
        customIn: prob.sampleCases[0]?.input || '',
        customOut: '',
        customErr: '',
        runtimeMs: null,
        isRunning: false,
        isJudging: false,
        results: null,
        score: null,
        verdict: null,
        mistakeAnalysis: null,
        isAnalyzingMistake: false,
        submitted: false,
        awardedXp: 0
      }
    );
  };

  const updateLessonPracticeState = (
    prob: CSLesson['practiceProblem'],
    patch: Partial<LessonPracticeRunState>
  ) => {
    setLessonPracticeMap((prev) => {
      const current = prev[prob.id] || {
        customIn: prob.sampleCases[0]?.input || '',
        customOut: '',
        customErr: '',
        runtimeMs: null,
        isRunning: false,
        isJudging: false,
        results: null,
        score: null,
        verdict: null,
        mistakeAnalysis: null,
        isAnalyzingMistake: false,
        submitted: false,
        awardedXp: 0
      };
      return {
        ...prev,
        [prob.id]: { ...current, ...patch }
      };
    });
  };

  const handleRunLessonCustom = async () => {
    const prob = currentLesson.practiceProblem;
    const state = getLessonPracticeState(prob);
    const codeToRun = getLessonCode(prob.id, curriculumLang);

    updateLessonPracticeState(prob, {
      isRunning: true,
      customOut: 'Đang biên dịch và thực thi...',
      customErr: ''
    });

    const res = await executeCode(prob.id, curriculumLang, codeToRun, state.customIn);
    updateLessonPracticeState(prob, {
      isRunning: false,
      customOut: res.stdout,
      customErr: res.stderr,
      runtimeMs: res.runtimeMs
    });
  };

  const runLessonMistakeAnalysis = async (
    prob: CSLesson['practiceProblem'],
    lang: CodeLanguage,
    codeToAnalyze: string,
    score: number,
    results: TestResult[]
  ) => {
    updateLessonPracticeState(prob, { isAnalyzingMistake: true });
    const failed = results
      .map((r, idx) => ({ ...r, testNumber: idx + 1 }))
      .filter((r) => !r.passed)
      .map((r) => ({
        index: r.testNumber,
        input: r.input,
        expected: r.expected,
        actual: r.actual,
        status: r.status
      }));

    try {
      const analysis = await analyzeCodeMistakeWithAI({
        problemTitle: prob.title,
        problemDescription: prob.description,
        inputFormat: prob.inputFormat,
        outputFormat: prob.outputFormat,
        language: lang,
        userCode: codeToAnalyze,
        score,
        failedTests: failed,
        fallbackSampleCpp: prob.fullSolutionCpp,
        fallbackSamplePython: prob.fullSolutionPython
      });
      updateLessonPracticeState(prob, { mistakeAnalysis: analysis, isAnalyzingMistake: false });
    } catch {
      updateLessonPracticeState(prob, { isAnalyzingMistake: false });
    }
  };

  const handleSubmitLessonPractice = async () => {
    const prob = currentLesson.practiceProblem;
    const codingProb = toCodingProblem(prob);
    const codeToJudge = getLessonCode(prob.id, curriculumLang);
    const prevState = getLessonPracticeState(prob);

    updateLessonPracticeState(prob, {
      isJudging: true,
      results: null,
      mistakeAnalysis: null
    });

    const result = await judgeProblem(codingProb, curriculumLang, codeToJudge);
    const targetXp = result.score === 100 ? 100 : result.score > 0 ? Math.floor(result.score * 0.4) : 0;
    const xpDelta = Math.max(0, targetXp - prevState.awardedXp);

    updateLessonPracticeState(prob, {
      isJudging: false,
      results: result.results,
      score: result.score,
      verdict: result.verdict,
      submitted: true,
      awardedXp: Math.max(prevState.awardedXp, targetXp)
    });

    // Automatically reveal sample & optimal solution right after submission
    setRevealedSolution(true);

    const newSub: SubmissionRecord = {
      id: Date.now().toString(),
      problemId: codingProb.id,
      problemTitle: codingProb.title,
      language: curriculumLang,
      passedCount: result.passedCount,
      totalCount: result.totalCount,
      score: result.score,
      status:
        result.verdict === 'Accepted'
          ? 'Accepted'
          : result.score > 0
          ? 'Partial'
          : 'Wrong Answer',
      submittedAt: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
    setSubmissions((prev) => [newSub, ...prev]);

    if (result.score === 100) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
    if (xpDelta > 0 && onScoreEarned) {
      onScoreEarned(xpDelta);
    }

    void runLessonMistakeAnalysis(prob, curriculumLang, codeToJudge, result.score, result.results);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <button
              onClick={viewMode !== 'curriculum' ? goBack : onBack || goBack}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('nav.back_prev', 'Quay lại trang trước', 'Back')}</span>
            </button>
            {viewMode !== 'curriculum' && (
              <button
                onClick={() => navigate({ csViewMode: 'curriculum' })}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 hover:bg-blue-100 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('cs.goto_curriculum', 'VNOI Roadmap', 'VNOI Roadmap')}</span>
              </button>
            )}
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Tin Học Chuyên Sâu · VNOI Roadmap
            </span>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Phase 0 ➜ Phase 4 · C++ &amp; Python
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Lộ Trình VNOI Roadmap &amp; Trình Chấm Online Judge
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Hệ thống bài giảng chi tiết từng phần theo chuẩn VNOI Wiki, code mẫu song ngữ C++/Python và trình chấm test tự động.
          </p>
        </div>

        {/* View Mode Switcher (VNOI Roadmap vs Online Judge vs Sublime Studio) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => navigate({ csViewMode: 'curriculum' })}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              viewMode === 'curriculum'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('cs.tab.curriculum', '1. VNOI Roadmap & Bài Giảng', '1. VNOI Roadmap & Lectures')}</span>
          </button>
          <button
            onClick={() => navigate({ csViewMode: 'judge' })}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              viewMode === 'judge'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>{t('cs.tab.judge', '2. Trình Chấm Online Judge', '2. Standard Online Judge')}</span>
          </button>
          <button
            onClick={() => navigate({ csViewMode: 'custom' })}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              viewMode === 'custom'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{t('cs.tab.custom', '3. Tự Do Giải Đề (Sublime Studio)', '3. Free Problem Solver')}</span>
          </button>
          <button
            onClick={() => navigate({ csViewMode: 'visualizer' })}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              viewMode === 'visualizer'
                ? 'bg-sky-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>{t('cs.tab.visualizer', '4. Đồ Thị & Mô Phỏng Thuật Toán', '4. Algorithm Visualizer')}</span>
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/* MODE 1: VNOI ROADMAP BROWSER & DEDICATED LECTURE ROOM        */}
      {/* ============================================================= */}
      {viewMode === 'curriculum' && curriculumSubView === 'roadmap' && (
        <div className="space-y-6">
          {/* VNOI Phase Filter Bar */}
          <div className="bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <button
                  onClick={onBack || goBack}
                  className="mt-0.5 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 whitespace-nowrap"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại</span>
                </button>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    Bản Đồ Học Tập Tin Học Theo Lộ Trình VNOI Roadmap ({CS_LESSONS.length} Bài Giảng Chuyên Đề)
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Bấm vào bất kỳ bài nào dưới đây để mở ngay giao diện Giảng bài chi tiết từng bước, Code mẫu và Bài tập tự chấm.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                5 Giai đoạn · 12 Chuyên đề cốt lõi
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedPhase('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedPhase === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Tất cả Phase ({CS_LESSONS.length})
              </button>
              {vnoiPhases.map((phase) => (
                <button
                  key={phase}
                  onClick={() => setSelectedPhase(phase)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedPhase === phase
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {phase}
                </button>
              ))}
            </div>
          </div>

          {/* VNOI Roadmap Progression Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setRevealedSolution(false);
                  navigate({
                    csLessonId: l.id,
                    csLessonTab: 'lecture',
                    csSubView: 'lecture'
                  });
                }}
                className="group text-left bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <LectureThumbnail
                      subject="cs"
                      id={l.id}
                      lessonNumber={l.lessonNumber}
                      category={l.vnoiPhase || l.level}
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                          Bài {l.lessonNumber}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{l.vnoiPhase || l.level}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{l.estimatedMinutes}p</span>
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {l.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {l.topic}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 truncate">
                    {l.complexity.time}
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 shrink-0">
                    Vào giảng bài <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'curriculum' && curriculumSubView === 'lecture' && (
        <div className="space-y-5">
          {/* Dedicated Lesson Classroom Header Bar */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại</span>
                </button>
                <button
                  onClick={() => navigate({ csSubView: 'roadmap' })}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                >
                  <span>Danh sách VNOI</span>
                </button>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {currentLesson.vnoiPhase || currentLesson.level}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Bài {currentLesson.lessonNumber} / {CS_LESSONS.length}</span>
                  {currentLesson.vnoiTag && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{currentLesson.vnoiTag}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Prev / Next Lesson Quick Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentLesson.lessonNumber <= 1}
                  onClick={() => {
                    const prev = CS_LESSONS.find((x) => x.lessonNumber === currentLesson.lessonNumber - 1);
                    if (prev) {
                      setRevealedSolution(false);
                      navigate({ csLessonId: prev.id });
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
                >
                  ← Bài trước
                </button>
                <button
                  disabled={currentLesson.lessonNumber >= CS_LESSONS.length}
                  onClick={() => {
                    const next = CS_LESSONS.find((x) => x.lessonNumber === currentLesson.lessonNumber + 1);
                    if (next) {
                      setRevealedSolution(false);
                      navigate({ csLessonId: next.id });
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
                >
                  Bài tiếp →
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {currentLesson.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>{currentLesson.topic}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    Time: {currentLesson.complexity.time}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    Space: {currentLesson.complexity.space}
                  </span>
                </div>
              </div>

              {/* 3 Lesson Room Sub-tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto shrink-0">
                <button
                  onClick={() => navigate({ csLessonTab: 'lecture' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    lessonTab === 'lecture'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>1. Bài Giảng Chi Tiết</span>
                </button>
                <button
                  onClick={() => navigate({ csLessonTab: 'code' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    lessonTab === 'code'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>2. Code Mẫu C++ / Python</span>
                </button>
                <button
                  onClick={() => navigate({ csLessonTab: 'practice' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    lessonTab === 'practice'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>3. Bài Tập &amp; Chấm Code</span>
                </button>
                <button
                  onClick={() => navigate({ csLessonTab: 'visualizer' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    lessonTab === 'visualizer'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>4. Mô Phỏng Trực Quan</span>
                </button>
              </div>
            </div>
          </div>

          {/* LESSON TAB 1: DEDICATED STEP-BY-STEP INTERACTIVE LECTURE */}
          {lessonTab === 'lecture' && (
            <InteractiveLectureRoom
              lessonKey={currentLesson.id}
              subject="cs"
              grade={currentLesson.level}
              subjectAccent="blue"
              kicker={`${currentLesson.vnoiPhase || currentLesson.level} · Bài ${currentLesson.lessonNumber} · Thời lượng ~${currentLesson.estimatedMinutes} phút`}
              title={currentLesson.title}
              subtitle={currentLesson.topic}
              steps={buildCSLectureSteps(currentLesson)}
              onEarnXP={onScoreEarned}
              onOpenSim2D={() => navigate({ csLessonTab: 'visualizer' })}
              onNextLesson={(() => {
                const nextLesson = CS_LESSONS.find(
                  (x) => x.lessonNumber === currentLesson.lessonNumber + 1
                );
                return nextLesson
                  ? () => {
                      setRevealedSolution(false);
                      navigate({ csLessonId: nextLesson.id });
                    }
                  : undefined;
              })()}
              actions={[
                {
                  label: 'Xem Code Minh Họa C++/Python',
                  onClick: () => navigate({ csLessonTab: 'code' }),
                  variant: 'primary',
                  icon: <Code2 className="w-4 h-4" />
                },
                {
                  label: 'Làm Bài Tập & Chấm Online Judge',
                  onClick: () => handleLoadIntoJudge(currentLesson.practiceProblem),
                  variant: 'emerald',
                  icon: <Zap className="w-4 h-4" />
                }
              ]}
            />
          )}

          {/* LESSON TAB 2: ILLUSTRATED CODE (C++ / PYTHON) */}
          {lessonTab === 'code' &&
            (() => {
              const activeCodeEx =
                currentLesson.codeExamples.find((e) => e.language === curriculumLang) ||
                currentLesson.codeExamples[0];
              const displayCode = activeCodeEx?.code || '// Không có code mẫu';
              const displayExplanation = activeCodeEx?.explanation || '';

              return (
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => navigate({ csLessonTab: 'lecture' })}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shrink-0 whitespace-nowrap"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Quay lại Bài giảng</span>
                      </button>
                      <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          Code Minh Họa Chuẩn Thi VNOI / HSG Quốc Gia
                        </h3>
                        <div className="text-xs text-slate-500">{activeCodeEx?.title}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                          onClick={() => setCurriculumLang('cpp')}
                          className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                            curriculumLang === 'cpp'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          C++ 17/20 STL
                        </button>
                        <button
                          onClick={() => setCurriculumLang('python')}
                          className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                            curriculumLang === 'python'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Python 3
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-[#171814]">
                    <MonokaiCodeBlock
                      code={displayCode}
                      language={curriculumLang}
                      title={curriculumLang === 'cpp' ? 'example.cpp' : 'example.py'}
                      onCopy={() => handleCopy(displayCode)}
                      copied={copiedText === displayCode}
                    />
                  </div>

                  {displayExplanation && (
                    <div className="px-4 sm:px-6 py-3 bg-blue-50/50 dark:bg-blue-950/20 border-t border-blue-100 dark:border-blue-900/30 text-xs text-blue-800 dark:text-blue-300 font-medium">
                      <FormattedText text={displayExplanation} />
                    </div>
                  )}
                </div>
              );
            })()}

          {/* LESSON TAB 3: INTERACTIVE SELF-CODING PRACTICE + GRADING + SAMPLE/OPTIMAL REVEAL */}
          {lessonTab === 'practice' &&
            (() => {
              const prob = currentLesson.practiceProblem;
              const pState = getLessonPracticeState(prob);
              const hiddenTests = LESSON_HIDDEN_TEST_CASES[prob.id] || [];
              const totalTestsCount = prob.sampleCases.length + hiddenTests.length;
              const currentPracticeCode = getLessonCode(prob.id, curriculumLang);
              const isSolutionShown = revealedSolution || pState.submitted;

              return (
                <div className="space-y-5">
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => navigate({ csLessonTab: 'lecture' })}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Quay lại Bài giảng</span>
                        </button>
                        <Award className="w-5 h-5 text-amber-500 shrink-0" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          Bài Tập Tự Code: {prob.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleLoadIntoJudge(prob)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all whitespace-nowrap"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Mở trong Online Judge toàn màn hình</span>
                      </button>
                    </div>

                    <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                      <FormattedText text={prob.description} />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                          <div className="font-semibold text-slate-900 dark:text-white mb-1">
                            Định dạng Input:
                          </div>
                          <div className="font-mono text-slate-600 dark:text-slate-300 whitespace-pre-line">
                            {prob.inputFormat}
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                          <div className="font-semibold text-slate-900 dark:text-white mb-1">
                            Định dạng Output:
                          </div>
                          <div className="font-mono text-slate-600 dark:text-slate-300 whitespace-pre-line">
                            {prob.outputFormat}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        Độ khó: {prob.difficulty} · Bộ test: {prob.sampleCases.length} mẫu + {hiddenTests.length} test ẩn ({totalTestsCount} tests) · Thời gian: 1.0s
                      </div>
                    </div>

                    {/* Sample Cases */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Ví dụ mẫu (Sample Cases):
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {prob.sampleCases.map((sc, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                              <span>Ví dụ {idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => updateLessonPracticeState(prob, { customIn: sc.input })}
                                className="text-sky-400 hover:underline normal-case font-semibold"
                              >
                                Nạp vào Stdin chạy thử
                              </button>
                            </div>
                            <div>
                              <span className="text-slate-500">Input:</span>
                              <pre className="text-emerald-400 whitespace-pre-wrap">{sc.input.trim()}</pre>
                            </div>
                            <div>
                              <span className="text-slate-500">Output:</span>
                              <pre className="text-amber-400 whitespace-pre-wrap">{sc.output.trim()}</pre>
                            </div>
                            {sc.explanation && (
                              <div className="text-slate-400 text-[11px] font-sans pt-1 border-t border-slate-800">
                                {sc.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Embedded Self-Coding Workspace */}
                    <div className="rounded-2xl overflow-hidden border border-[#3e3d32] bg-[#272822] shadow-xl">
                      <div className="h-[340px] sm:h-[380px] flex flex-col">
                        <SublimeEditor
                          value={currentPracticeCode}
                          onChange={(val) => setLessonCode(prob.id, curriculumLang, val)}
                          language={curriculumLang}
                          tabs={[
                            { id: 'cpp', label: 'main.cpp', language: 'cpp', dirty: currentPracticeCode !== DEFAULT_PRACTICE_CPP },
                            { id: 'python', label: 'solution.py', language: 'python', dirty: currentPracticeCode !== DEFAULT_PRACTICE_PYTHON }
                          ]}
                          activeTabId={curriculumLang}
                          onSelectTab={(id) => setCurriculumLang(id as CodeLanguage)}
                          fontSize={fontSize}
                          onFontSizeChange={setFontSize}
                          onRun={handleRunLessonCustom}
                          onReset={() =>
                            setLessonCode(
                              prob.id,
                              curriculumLang,
                              curriculumLang === 'cpp' ? DEFAULT_PRACTICE_CPP : DEFAULT_PRACTICE_PYTHON
                            )
                          }
                          placeholder={
                            curriculumLang === 'python'
                              ? '# Tự viết code Python 3 tại đây và bấm Nộp Bài...'
                              : '// Tự viết code C++ tại đây và bấm Nộp Bài...'
                          }
                          statusRightExtra={pState.score !== null ? `Score: ${pState.score}/100` : undefined}
                        />
                      </div>

                      {/* Action Bar */}
                      <div className="bg-[#1e1f1c] border-t border-[#3e3d32] px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleRunLessonCustom}
                            disabled={pState.isRunning || pState.isJudging}
                            className="px-3.5 py-1.5 rounded-lg bg-[#3e3d32] hover:bg-[#49483e] text-[#f8f8f2] text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                          >
                            <Play className="w-3.5 h-3.5 text-[#66d9ef]" />
                            <span>{pState.isRunning ? 'Đang chạy...' : 'Chạy Thử (Stdin)'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleSubmitLessonPractice}
                            disabled={pState.isRunning || pState.isJudging}
                            className="px-4 py-1.5 rounded-lg bg-[#a6e22e] hover:bg-[#b8f242] text-[#272822] text-xs font-bold flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>
                              {pState.isJudging
                                ? 'Đang chấm...'
                                : `Nộp Bài & Chấm Điểm (${totalTestsCount} tests)`}
                            </span>
                          </button>
                        </div>

                        {pState.score !== null && (
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold tabular-nums ${
                              pState.score === 100
                                ? 'bg-[#a6e22e]/20 text-[#a6e22e]'
                                : pState.score > 0
                                ? 'bg-[#e6db74]/20 text-[#e6db74]'
                                : 'bg-[#f92672]/20 text-[#f92672]'
                            }`}
                          >
                            {pState.verdict} · {pState.score}/100 điểm
                          </span>
                        )}
                      </div>

                      {/* Stdin / Output Console */}
                      <div className="bg-[#171814] border-t border-[#3e3d32] p-3 grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs text-[#f8f8f2]">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase text-[#90908a]">
                            Input chạy thử (Stdin):
                          </span>
                          <textarea
                            value={pState.customIn}
                            onChange={(e) => updateLessonPracticeState(prob, { customIn: e.target.value })}
                            rows={3}
                            className="w-full p-2 bg-[#272822] border border-[#3e3d32] rounded-lg text-xs text-[#f8f8f2] focus:outline-none focus:border-[#66d9ef] resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#90908a]">
                            <span>Output chương trình:</span>
                            {pState.runtimeMs !== null && (
                              <span className="text-[#66d9ef] tabular-nums">{pState.runtimeMs}ms</span>
                            )}
                          </div>
                          <div className="flex-1 min-h-[76px] max-h-[110px] p-2 bg-[#272822] border border-[#3e3d32] rounded-lg overflow-y-auto whitespace-pre-wrap">
                            {pState.customErr ? (
                              <span className="text-[#f92672]">{pState.customErr}</span>
                            ) : pState.customOut ? (
                              <span className="text-[#a6e22e]">{pState.customOut}</span>
                            ) : (
                              <span className="text-[#75715e]">// Kết quả chạy thử sẽ hiện tại đây...</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grading Verdict, Failed Tests & AI Mistake Diagnosis (Published on Submission) */}
                    {(pState.results || pState.isJudging) && (
                      <div>
                        {pState.isJudging && !pState.results ? (
                          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/70 text-center text-xs font-mono text-blue-600 dark:text-blue-400">
                            Đang chấm bài tập qua {totalTestsCount} test cases...
                          </div>
                        ) : (
                          <CodeMistakeAnalysisPanel
                            darkSurface={false}
                            score={pState.score}
                            verdict={pState.verdict}
                            results={pState.results}
                            language={curriculumLang}
                            analysis={pState.mistakeAnalysis}
                            isAnalyzingMistake={pState.isAnalyzingMistake}
                            onRetryAnalyze={() => {
                              if (!pState.results || pState.score === null) return;
                              void runLessonMistakeAnalysis(
                                prob,
                                curriculumLang,
                                currentPracticeCode,
                                pState.score,
                                pState.results
                              );
                            }}
                            onApplySampleCode={(sample) => setLessonCode(prob.id, curriculumLang, sample)}
                          />
                        )}
                      </div>
                    )}

                    {/* Sample & Optimal VNOI Solution (Automatically Revealed Upon Submission, or Manual Toggle) */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setRevealedSolution(!isSolutionShown)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
                      >
                        <span>
                          {isSolutionShown
                            ? 'Ẩn code mẫu / lời giải tối ưu chuẩn VNOI'
                            : 'Xem gợi ý & code mẫu tối ưu chuẩn VNOI'}
                        </span>
                      </button>

                      {isSolutionShown && (
                        <div className="mt-3 p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-4 animate-fadeIn">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                              Code Mẫu / Tối Ưu Chuẩn VNOI &amp; Chiến Lược Giải:
                            </h4>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setCurriculumLang('cpp')}
                                className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                                  curriculumLang === 'cpp'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                C++
                              </button>
                              <button
                                type="button"
                                onClick={() => setCurriculumLang('python')}
                                className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                                  curriculumLang === 'python'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                Python
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setLessonCode(
                                    prob.id,
                                    curriculumLang,
                                    curriculumLang === 'cpp' ? prob.fullSolutionCpp : prob.fullSolutionPython
                                  )
                                }
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold"
                              >
                                Nạp Code Tối Ưu Vào Editor
                              </button>
                            </div>
                          </div>

                          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                            <FormattedText text={prob.solutionAnalysis} />
                          </div>

                          <MonokaiCodeBlock
                            code={curriculumLang === 'cpp' ? prob.fullSolutionCpp : prob.fullSolutionPython}
                            language={curriculumLang}
                            title={curriculumLang === 'cpp' ? 'optimal_solution.cpp' : 'optimal_solution.py'}
                            onCopy={() =>
                              handleCopy(curriculumLang === 'cpp' ? prob.fullSolutionCpp : prob.fullSolutionPython)
                            }
                            copied={
                              copiedText ===
                              (curriculumLang === 'cpp' ? prob.fullSolutionCpp : prob.fullSolutionPython)
                            }
                            maxHeightClass="max-h-[360px]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* LESSON TAB 4: ALGORITHM VISUALIZER */}
          {lessonTab === 'visualizer' && (
            <AlgorithmVisualizer
              initialAlgoId={LESSON_TO_ALGO_MAP[currentLesson.id] || 'coord_hull'}
              embeddedLessonTitle={currentLesson.title}
              onBack={() => navigate({ csLessonTab: 'lecture' })}
              onScoreEarned={onScoreEarned}
            />
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* MODE 2: TRÌNH CHẤM ONLINE JUDGE (SUBLIME MONOKAI + FULLSCREEN) */}
      {/* ============================================================= */}
      {viewMode === 'judge' && (
        <ViewportPortal active={isJudgeFullscreen}>
          <div
            className={
              isJudgeFullscreen
                ? 'fixed inset-0 z-[100] w-screen h-[100dvh] bg-[#1e1f1c] flex flex-col overflow-hidden'
                : 'space-y-3'
            }
          >
            {/* Persistent Fullscreen Top Bar with Back / Exit button */}
            {isJudgeFullscreen && (
              <div className="bg-[#171814] border-b border-[#3e3d32] px-3 py-2 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => {
                      setIsJudgeFullscreen(false);
                      goBack();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#272822] hover:bg-[#3e3d32] border border-[#3e3d32] text-[#f8f8f2] text-xs font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Quay lại</span>
                  </button>
                  <button
                    onClick={() => setIsJudgeFullscreen(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#272822] hover:bg-[#3e3d32] border border-[#3e3d32] text-[#66d9ef] text-xs font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Thu nhỏ (Esc)</span>
                  </button>
                  <span className="text-xs font-bold text-white truncate hidden sm:inline">
                    {currentProblem.title}
                  </span>
                </div>
                <button
                  onClick={() => setIsJudgeFullscreen(false)}
                  className="p-1.5 rounded-lg bg-[#f92672]/20 text-[#f92672] border border-[#f92672]/40 hover:bg-[#f92672]/30"
                  title="Thoát toàn màn hình (Esc)"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Pane Switcher (<lg) */}
            <div className="lg:hidden grid grid-cols-3 gap-1 p-1 bg-[#171814] border-b lg:border border-[#3e3d32] lg:rounded-xl shrink-0">
              {[
                { id: 'problem' as const, label: 'Đề Bài & Test' },
                { id: 'editor' as const, label: 'Code Sublime' },
                { id: 'console' as const, label: judgeScore !== null ? `Kết quả (${judgeScore}%)` : 'Console' }
              ].map((pane) => (
                <button
                  key={pane.id}
                  onClick={() => setMobileJudgePane(pane.id)}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-colors ${
                    mobileJudgePane === pane.id
                      ? 'bg-[#272822] text-[#a6e22e] border border-[#3e3d32]'
                      : 'text-[#90908a]'
                  }`}
                >
                  {pane.label}
                </button>
              ))}
            </div>

            <div
              className={`flex flex-1 min-h-0 overflow-hidden border border-[#3e3d32] bg-[#272822] ${
                isJudgeFullscreen ? 'border-0 rounded-none' : 'rounded-2xl min-h-[460px] sm:min-h-[560px] lg:h-[78vh] shadow-2xl'
              }`}
            >
              {/* Left Column: Problem details & Sample cases */}
              {(isJudgeSidebarOpen || mobileJudgePane === 'problem') && (
                <div
                  className={`${
                    mobileJudgePane === 'problem' ? 'flex w-full' : 'hidden lg:flex lg:w-[38%] xl:w-[35%]'
                  } bg-[#1e1f1c] border-r border-[#3e3d32] flex-col shrink-0 min-h-0 overflow-hidden`}
                >
                <div className="p-3.5 border-b border-[#3e3d32] bg-[#171814] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {!isJudgeFullscreen && (
                        <button
                          onClick={goBack}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#272822] hover:bg-[#3e3d32] border border-[#3e3d32] text-[11px] font-bold text-[#66d9ef] shrink-0"
                          title="Quay lại trang trước"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          <span>Quay lại</span>
                        </button>
                      )}
                      <label className="text-[11px] font-bold text-[#e6db74] uppercase tracking-wider truncate">
                        Chọn đề bài:
                      </label>
                    </div>
                    <button
                      onClick={() => setIsJudgeFullscreen(!isJudgeFullscreen)}
                      className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded bg-[#272822] hover:bg-[#3e3d32] border border-[#3e3d32] text-[11px] text-[#66d9ef] shrink-0"
                    >
                      {isJudgeFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                      <span>{isJudgeFullscreen ? 'Thu nhỏ' : 'Split Fullscreen'}</span>
                    </button>
                  </div>
                  <select
                    value={currentProblem.id}
                    onChange={(e) => {
                      const prob = CODING_PROBLEMS.find((p) => p.id === e.target.value);
                      if (prob) {
                        handleProblemChange(prob);
                      } else {
                        const lessonProb = CS_LESSONS.find((l) => l.practiceProblem.id === e.target.value)?.practiceProblem;
                        if (lessonProb) handleProblemChange(toCodingProblem(lessonProb));
                      }
                    }}
                    className="w-full bg-[#272822] border border-[#3e3d32] rounded-xl px-3 py-2 text-xs font-semibold text-[#f8f8f2] focus:outline-none focus:border-[#66d9ef]"
                  >
                    <optgroup label="Bài tập củng cố theo bài giảng:">
                      {CS_LESSONS.map((l) => (
                        <option key={l.practiceProblem.id} value={l.practiceProblem.id}>
                          Bài {l.lessonNumber}: {l.practiceProblem.title} ({l.practiceProblem.difficulty})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Bộ đề Olympic tổng hợp:">
                      {CODING_PROBLEMS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.difficulty})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-[#d8d8d0]">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="text-sm font-bold text-white">{currentProblem.title}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#66d9ef]/20 text-[#66d9ef] shrink-0">
                        {currentProblem.difficulty}
                      </span>
                    </div>
                    <div className="leading-relaxed bg-[#272822] p-3 rounded-xl border border-[#3e3d32]">
                      <FormattedText text={currentProblem.description} />
                    </div>
                  </div>

                  {/* I/O Format */}
                  <div className="space-y-2 text-[11px]">
                    <div className="bg-[#272822] p-2.5 rounded-xl border border-[#3e3d32]">
                      <span className="font-bold text-[#66d9ef] block mb-0.5">Input:</span>
                      <span className="font-mono whitespace-pre-line">{currentProblem.inputFormat}</span>
                    </div>
                    <div className="bg-[#272822] p-2.5 rounded-xl border border-[#3e3d32]">
                      <span className="font-bold text-[#a6e22e] block mb-0.5">Output:</span>
                      <span className="font-mono whitespace-pre-line">{currentProblem.outputFormat}</span>
                    </div>
                    <div className="bg-[#272822] p-2.5 rounded-xl border border-[#3e3d32]">
                      <span className="font-bold text-[#e6db74] block mb-0.5">Ràng buộc:</span>
                      <span className="font-mono">
                        {Array.isArray(currentProblem.constraints)
                          ? currentProblem.constraints.join(' • ')
                          : currentProblem.constraints}
                      </span>
                    </div>
                  </div>

                  {/* Sample test */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-[#e6db74] uppercase tracking-wider block">
                      Test ví dụ ({currentProblem.sampleCases.length} mẫu + {currentProblem.hiddenCases.length} test ẩn):
                    </span>
                    {currentProblem.sampleCases.map((sc, sIdx) => (
                      <div key={sIdx} className="bg-[#272822] border border-[#3e3d32] p-3 rounded-xl font-mono text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-[#90908a] text-[10px]">
                          <span>Ví dụ #{sIdx + 1}</span>
                          <button
                            onClick={() => {
                              setCustomInput(sc.input);
                              setActiveConsoleTab('custom_run');
                              setMobileJudgePane('editor');
                            }}
                            className="text-[#66d9ef] hover:underline"
                          >
                            Nạp stdin
                          </button>
                        </div>
                        <div>
                          <span className="text-[#90908a]">In: </span>
                          <span className="text-[#e6db74] whitespace-pre-wrap">{sc.input.trim()}</span>
                        </div>
                        <div>
                          <span className="text-[#90908a]">Out: </span>
                          <span className="text-[#a6e22e] font-bold whitespace-pre-wrap">{sc.expectedOutput.trim()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Right Column: Sublime Text 4 Monokai Editor & Console */}
            <div
              className={`${
                mobileJudgePane === 'problem' ? 'hidden lg:flex' : 'flex'
              } flex-1 flex-col bg-[#272822] min-w-0 min-h-0 overflow-hidden`}
            >
              {/* Sublime Editor */}
              <div className={`${mobileJudgePane === 'console' ? 'hidden lg:flex' : 'flex'} flex-1 flex-col min-h-0 overflow-hidden`}>
                <SublimeEditor
                  value={code}
                  onChange={setCode}
                  language={judgeLang}
                  tabs={[
                    { id: 'cpp', label: 'main.cpp', language: 'cpp', dirty: true },
                    { id: 'python', label: 'solution.py', language: 'python', dirty: true }
                  ]}
                  activeTabId={judgeLang}
                  onSelectTab={(id) => handleLanguageChange(id as CodeLanguage)}
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                  onRun={handleRunCustom}
                  onReset={handleResetTemplate}
                  isFullscreen={isJudgeFullscreen}
                  onToggleFullscreen={() => setIsJudgeFullscreen(!isJudgeFullscreen)}
                  isSidebarOpen={isJudgeSidebarOpen}
                  onToggleSidebar={() => setIsJudgeSidebarOpen(!isJudgeSidebarOpen)}
                  statusRightExtra={judgeScore !== null ? `Score: ${judgeScore}/100` : undefined}
                />
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 border-t border-[#3e3d32] bg-[#1e1f1c] shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleRunCustom();
                      setMobileJudgePane('console');
                    }}
                    disabled={isRunningCustom || isJudging}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#3e3d32] hover:bg-[#49483e] text-[#f8f8f2] text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 text-[#66d9ef]" />
                    <span>{isRunningCustom ? 'Đang chạy...' : 'Chạy thử (Run)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleSubmitCode();
                      setMobileJudgePane('console');
                    }}
                    disabled={isRunningCustom || isJudging}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#a6e22e] hover:bg-[#b8f242] text-[#272822] text-xs font-bold transition-all shadow disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isJudging ? 'Đang chấm...' : 'Nộp bài (Submit)'}</span>
                  </button>
                </div>

                {judgeScore !== null && (
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                      judgeScore === 100
                        ? 'bg-[#a6e22e]/20 text-[#a6e22e] border border-[#a6e22e]/40'
                        : judgeScore > 0
                        ? 'bg-[#e6db74]/20 text-[#e6db74] border border-[#e6db74]/40'
                        : 'bg-[#f92672]/20 text-[#f92672] border border-[#f92672]/40'
                    }`}
                  >
                    {judgeVerdict} ({judgeScore}/100)
                  </span>
                )}
              </div>

              {/* Console Output Bar */}
              <div
                className={`${
                  mobileJudgePane === 'console' ? 'flex-1 lg:flex-none lg:h-52' : 'hidden lg:flex lg:h-52'
                } border-t border-[#3e3d32] bg-[#171814] flex-col shrink-0 overflow-hidden font-mono text-xs text-[#f8f8f2]`}
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-[#3e3d32] bg-[#1e1f1c] overflow-x-auto">
                  <button
                    onClick={() => setActiveConsoleTab('custom_run')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-all shrink-0 ${
                      activeConsoleTab === 'custom_run'
                        ? 'bg-[#3e3d32] text-[#e6db74]'
                        : 'text-[#90908a] hover:text-white'
                    }`}
                  >
                    Custom Test Stdin
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab('judge_results')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-all shrink-0 ${
                      activeConsoleTab === 'judge_results'
                        ? 'bg-[#3e3d32] text-[#a6e22e]'
                        : 'text-[#90908a] hover:text-white'
                    }`}
                  >
                    Kết quả Chấm {judgeScore !== null ? `(${judgeScore}/100)` : ''}
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab('history')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-all shrink-0 ${
                      activeConsoleTab === 'history'
                        ? 'bg-[#3e3d32] text-[#66d9ef]'
                        : 'text-[#90908a] hover:text-white'
                    }`}
                  >
                    Lịch sử ({submissions.length})
                  </button>
                </div>

                <div className="flex-1 p-3 overflow-y-auto">
                  {activeConsoleTab === 'custom_run' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
                      <div className="flex flex-col">
                        <div className="text-[10px] font-bold text-[#90908a] uppercase tracking-wider mb-1">
                          Input Stdin tùy chỉnh:
                        </div>
                        <textarea
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          className="flex-1 min-h-[84px] p-2.5 bg-[#272822] text-[#f8f8f2] font-mono text-xs rounded-lg focus:outline-none focus:border-[#66d9ef] resize-none border border-[#3e3d32]"
                        />
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center justify-between text-[10px] font-bold text-[#90908a] uppercase tracking-wider mb-1">
                          <span>Output chương trình:</span>
                          {customRuntime !== null && (
                            <span className="text-[#66d9ef] font-mono">{customRuntime}ms</span>
                          )}
                        </div>
                        <div className="flex-1 min-h-[84px] p-2.5 bg-[#272822] text-[#f8f8f2] font-mono text-xs rounded-lg overflow-y-auto border border-[#3e3d32]">
                          {customStderr ? (
                            <span className="text-[#f92672]">{customStderr}</span>
                          ) : customOutput ? (
                            <span className="text-[#a6e22e] whitespace-pre">{customOutput}</span>
                          ) : (
                            <span className="text-[#75715e] italic">
                              Bấm "Chạy thử (Run)" để xem kết quả xuất ra...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeConsoleTab === 'judge_results' && (
                    <div className="space-y-2.5">
                      {judgeResults ? (
                        <>
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#272822] border border-[#3e3d32]">
                            <span
                              className={`text-xs font-bold ${
                                judgeScore === 100
                                  ? 'text-[#a6e22e]'
                                  : judgeScore && judgeScore > 0
                                  ? 'text-[#e6db74]'
                                  : 'text-[#f92672]'
                              }`}
                            >
                              {judgeVerdict}
                            </span>
                            <span className="text-sm font-bold text-white">{judgeScore} / 100 Điểm</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {judgeResults.map((tr, tIdx) => (
                              <div
                                key={tIdx}
                                className={`p-2 rounded-lg border text-[11px] font-mono space-y-1 ${
                                  tr.passed
                                    ? 'bg-[#a6e22e]/10 border-[#a6e22e]/30 text-[#a6e22e]'
                                    : 'bg-[#f92672]/10 border-[#f92672]/30 text-[#f92672]'
                                }`}
                              >
                                <div className="flex items-center justify-between font-bold gap-2">
                                  <span>
                                    Test #{tIdx + 1}
                                    {tr.difficulty ? ` · ${tr.difficulty}` : ''}
                                  </span>
                                  <span>{tr.passed ? 'ACCEPTED' : tr.status}</span>
                                </div>
                                {!tr.passed && (
                                  <div className="text-[10px] text-[#f8f8f2] truncate">
                                    Exp: {tr.expected.replace(/\n/g, ' ')} | Got: {tr.actual.replace(/\n/g, ' ')}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-6 text-xs text-[#75715e]">
                          Bấm "Nộp bài (Submit)" để chấm điểm với bộ test tự động.
                        </div>
                      )}
                    </div>
                  )}

                  {activeConsoleTab === 'history' && (
                    <div className="space-y-2">
                      {submissions.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-[#3e3d32] text-[#90908a]">
                                <th className="py-1.5">Thời gian</th>
                                <th>Bài</th>
                                <th>Ngôn ngữ</th>
                                <th>Điểm</th>
                                <th>Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody>
                              {submissions.map((sub) => (
                                <tr key={sub.id} className="border-b border-[#3e3d32]/50 font-mono">
                                  <td className="py-1.5 text-[#90908a]">{sub.submittedAt}</td>
                                  <td className="font-sans font-medium text-[#f8f8f2]">{sub.problemTitle}</td>
                                  <td className="uppercase text-[#66d9ef]">{sub.language}</td>
                                  <td className="font-bold text-[#a6e22e]">{sub.score}/100</td>
                                  <td>
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        sub.status === 'Accepted'
                                          ? 'bg-[#a6e22e]/20 text-[#a6e22e]'
                                          : 'bg-[#f92672]/20 text-[#f92672]'
                                      }`}
                                    >
                                      {sub.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-6 text-xs text-[#75715e]">
                          Chưa có lượt nộp bài nào.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        </ViewportPortal>
      )}

      {/* ============================================================= */}
      {/* MODE 3: TỰ DO GIẢI ĐỀ & AI SINH TEST (SUBLIME TEXT STUDIO)   */}
      {/* ============================================================= */}
      {viewMode === 'custom' && (
        <SublimeStudio
          onScoreEarned={onScoreEarned}
          onBack={goBack}
        />
      )}

      {/* ============================================================= */}
      {/* MODE 4: ĐỒ THỊ & MÔ PHỎNG THUẬT TOÁN TRỰC QUAN               */}
      {/* ============================================================= */}
      {viewMode === 'visualizer' && (
        <AlgorithmVisualizer
          initialAlgoId={(location.csAlgoId as AlgoId) || 'coord_hull'}
          onBack={goBack}
          onScoreEarned={onScoreEarned}
        />
      )}
    </div>
  );
};
