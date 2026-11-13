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
import { SublimeStudio } from './SublimeStudio';
import { SublimeEditor, MonokaiCodeBlock } from './SublimeEditor';
import { ViewportPortal } from '../common/ViewportPortal';
import { FormattedText } from '../common/MathRenderer';
import { useLanguage } from '../../context/LanguageContext';
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
  Minimize2
} from 'lucide-react';

interface CodeJudgeLabProps {
  onScoreEarned?: (xp: number) => void;
  onBack?: () => void;
}

export const CodeJudgeLab: React.FC<CodeJudgeLabProps> = ({ onScoreEarned, onBack }) => {
  const { t } = useLanguage();
  // Top View Mode: 'curriculum' (Bài giảng & Code mẫu), 'judge' (Trình chấm online), or 'custom' (Sublime Studio)
  const [viewMode, setViewMode] = useState<'curriculum' | 'judge' | 'custom'>('curriculum');

  // Level filter for curriculum: 'all' | 'Cơ bản' | 'Trung cấp' | 'Nâng cao / HSG'
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredLessons = useMemo(() => {
    if (selectedLevel === 'all') return CS_LESSONS;
    return CS_LESSONS.filter((l) => l.level === selectedLevel);
  }, [selectedLevel]);

  // Current selected lesson
  const [selectedLessonId, setSelectedLessonId] = useState<string>('cs-1');
  const currentLesson: CSLesson = useMemo(() => {
    return (
      CS_LESSONS.find((l) => l.id === selectedLessonId) ||
      filteredLessons[0] ||
      CS_LESSONS[0]
    );
  }, [selectedLessonId, filteredLessons]);

  // Code language for curriculum illustrated code
  const [curriculumLang, setCurriculumLang] = useState<CodeLanguage>('cpp');
  const [revealedSolution, setRevealedSolution] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

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
      explanation: s.explanation
    })),
    hiddenCases: [],
    cppTemplate: p.fullSolutionCpp,
    pythonTemplate: p.fullSolutionPython
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
    setViewMode('judge');
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

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {viewMode !== 'curriculum' ? (
              <button
                onClick={() => setViewMode('curriculum')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('nav.back_curriculum', 'Quay lại Bài giảng Tin học', 'Back to CS Curriculum')}</span>
              </button>
            ) : (
              onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('nav.back_home', 'Quay lại Lớp học', 'Back to Classroom')}</span>
                </button>
              )
            )}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Tin Học & Lập Trình Chuyên Tin
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Cơ bản ➜ Nâng cao / HSG • C++ & Python
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Kho Luyện Tin Học & Trình Chấm Online Judge
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Lộ trình bài giảng chuẩn thuật toán quốc tế, code mẫu song ngữ C++/Python, bài tập củng cố và hệ thống chấm test tự động.
          </p>
        </div>

        {/* View Mode Switcher (Bài giảng vs Online Judge vs Sublime Studio) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => setViewMode('curriculum')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'curriculum'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('cs.tab.curriculum', '1. Lộ Trình Bài Giảng & Code Mẫu', '1. Curriculum & Sample Code')}</span>
          </button>
          <button
            onClick={() => setViewMode('judge')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'judge'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>{t('cs.tab.judge', '2. Trình Chấm Online Judge', '2. Standard Online Judge')}</span>
          </button>
          <button
            onClick={() => setViewMode('custom')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'custom'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t('cs.tab.custom', '3. ⚡ Tự Do Giải Đề (Sublime Studio)', '3. ⚡ Free Problem Solver (Sublime Studio)')}</span>
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/* MODE 1: LỘ TRÌNH BÀI GIẢNG & CODE MINH HỌA (Cơ bản -> HSG)  */}
      {/* ============================================================= */}
      {viewMode === 'curriculum' && (
        <div className="space-y-6">
          {/* Level Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['all', 'Cơ bản', 'Trung cấp', 'Nâng cao / HSG'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  selectedLevel === lvl
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                    : 'bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {lvl === 'all' ? 'Tất cả cấp độ (9 bài)' : `${lvl}`}
              </button>
            ))}
          </div>

          {/* Lessons Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filteredLessons.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setSelectedLessonId(l.id);
                  setRevealedSolution(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  currentLesson.id === l.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 font-semibold'
                    : 'bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    currentLesson.id === l.id
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300'
                  }`}
                >
                  Bài {l.lessonNumber}
                </span>
                <span>{l.title.split(':')[0]}</span>
              </button>
            ))}
          </div>

          {/* Current Lesson Hero Header */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                      currentLesson.level === 'Cơ bản'
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                        : currentLesson.level === 'Trung cấp'
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                        : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                    }`}
                  >
                    {currentLesson.level} • Bài {currentLesson.lessonNumber}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentLesson.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Chủ đề: {currentLesson.topic} ({currentLesson.estimatedMinutes} phút học)
                </p>
              </div>

              {/* Complexity Badges */}
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-right">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Độ phức tạp Thời gian
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {currentLesson.complexity.time}
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-right">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Bộ nhớ Space
                  </div>
                  <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    {currentLesson.complexity.space}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Theory breakdown */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                1. Bài Giảng Lý Thuyết & Kỹ Thuật Lập Trình
              </h3>
            </div>

            <div className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-slate-50/60 dark:bg-slate-800/40 p-4 sm:p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              {currentLesson.theory.map((line, idx) => (
                <div key={idx}>
                  <FormattedText text={line} />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Illustrated Code (C++ / Python) */}
          {(() => {
            const activeCodeEx =
              currentLesson.codeExamples.find((e) => e.language === curriculumLang) ||
              currentLesson.codeExamples[0];
            const displayCode = activeCodeEx?.code || '// Không có code mẫu';
            const displayExplanation = activeCodeEx?.explanation || '';

            return (
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        2. Code Minh Họa Chuẩn Thi HSG Quốc Gia
                      </h3>
                      <div className="text-xs text-slate-500">{activeCodeEx?.title}</div>
                    </div>
                  </div>

                  {/* Language Switcher */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-1 rounded-lg">
                      <button
                        onClick={() => setCurriculumLang('cpp')}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                          curriculumLang === 'cpp'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        C++ 17/20 STL
                      </button>
                      <button
                        onClick={() => setCurriculumLang('python')}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
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

                {/* Authentic Sublime Monokai Code Block */}
                <div className="p-3 sm:p-4 bg-[#171814]">
                  <MonokaiCodeBlock
                    code={displayCode}
                    language={curriculumLang}
                    title={curriculumLang === 'cpp' ? 'example.cpp' : 'example.py'}
                    onCopy={() => handleCopy(displayCode)}
                    copied={copiedText === displayCode}
                  />
                </div>

                {/* Code analysis note */}
                {displayExplanation && (
                  <div className="px-4 sm:px-6 py-3 bg-blue-50/50 dark:bg-blue-950/20 border-t border-blue-100 dark:border-blue-900/30 text-xs text-blue-800 dark:text-blue-300 font-medium">
                    <FormattedText text={displayExplanation} />
                  </div>
                )}
              </div>
            );
          })()}

          {/* Section 3: Consolidation Problem + Step-by-Step Solution */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  3. Bài Tập Củng Cố Sau Bài Học: {currentLesson.practiceProblem.title}
                </h3>
              </div>

              {/* Action Button: Load into Online Judge */}
              <button
                onClick={() => handleLoadIntoJudge(currentLesson.practiceProblem)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/20"
              >
                <Zap className="w-4 h-4" />
                <span>Nạp Bài Vào Trình Chấm Online Judge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Problem Details */}
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <p className="leading-relaxed">{currentLesson.practiceProblem.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <div className="font-semibold text-slate-900 dark:text-white mb-1">
                    Định dạng Input:
                  </div>
                  <div className="font-mono text-slate-600 dark:text-slate-300">
                    {currentLesson.practiceProblem.inputFormat}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <div className="font-semibold text-slate-900 dark:text-white mb-1">
                    Định dạng Output:
                  </div>
                  <div className="font-mono text-slate-600 dark:text-slate-300">
                    {currentLesson.practiceProblem.outputFormat}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Độ khó: {currentLesson.practiceProblem.difficulty} | Thời gian: 1.0s | Bộ nhớ: 256MB
              </div>
            </div>

            {/* Sample Cases Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Ví dụ mẫu (Sample Cases):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentLesson.practiceProblem.sampleCases.map((sc, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-xs space-y-1.5"
                  >
                    <div className="text-slate-400 text-[10px] uppercase font-bold">
                      Ví dụ {idx + 1}
                    </div>
                    <div>
                      <span className="text-slate-500">Input:</span>
                      <pre className="text-emerald-400">{sc.input.trim()}</pre>
                    </div>
                    <div>
                      <span className="text-slate-500">Output:</span>
                      <pre className="text-amber-400">{sc.output.trim()}</pre>
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

            {/* Collapsible Step-by-Step Solution & Full Code */}
            <div className="pt-2">
              <button
                onClick={() => setRevealedSolution(!revealedSolution)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
              >
                <span>
                  {revealedSolution
                    ? 'Ẩn lời giải chi tiết & source code mẫu'
                    : 'Xem lời giải chi tiết & source code mẫu chuẩn AC'}
                </span>
              </button>

              {revealedSolution && (
                <div className="mt-3 p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-4 animate-fadeIn">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Phân tích thuật toán & Chiến lược tối ưu:
                    </h4>
                    <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      <FormattedText text={currentLesson.practiceProblem.solutionAnalysis} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Source code mẫu giải thuật ({curriculumLang === 'cpp' ? 'C++' : 'Python'}):
                    </span>
                    <MonokaiCodeBlock
                      code={
                        curriculumLang === 'cpp'
                          ? currentLesson.practiceProblem.fullSolutionCpp
                          : currentLesson.practiceProblem.fullSolutionPython
                      }
                      language={curriculumLang}
                      title={curriculumLang === 'cpp' ? 'solution.cpp' : 'solution.py'}
                      maxHeightClass="max-h-[360px]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
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
                    onClick={() => setIsJudgeFullscreen(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#272822] hover:bg-[#3e3d32] border border-[#3e3d32] text-[#66d9ef] text-xs font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Quay lại / Thu nhỏ (Esc)</span>
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
                isJudgeFullscreen ? 'border-0 rounded-none' : 'rounded-2xl min-h-[600px] lg:h-[78vh] shadow-2xl'
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
                    <label className="text-[11px] font-bold text-[#e6db74] uppercase tracking-wider">
                      Chọn đề bài chấm:
                    </label>
                    <button
                      onClick={() => setIsJudgeFullscreen(!isJudgeFullscreen)}
                      className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded bg-[#272822] hover:bg-[#3e3d32] border border-[#3e3d32] text-[11px] text-[#66d9ef]"
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
                                <div className="flex items-center justify-between font-bold">
                                  <span>Test #{tIdx + 1}</span>
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
          onBack={() => setViewMode('curriculum')}
        />
      )}
    </div>
  );
};
