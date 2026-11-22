import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { CS_LESSONS } from '../../data/csLessonsData';
import { CODING_PROBLEMS } from '../../data/curriculumData';
import { CS_SPECIALIZED_TRACKS, CSTrackId } from '../../data/csTracksData';
import { CS_TRACK_STAGE_DETAILS } from '../../data/csTrackStageDetails';
import {
  CodeLanguage,
  CodingProblem,
  SubmissionRecord,
  TestResult,
  CSLesson,
  CSLevel
} from '../../types';
import { executeCode, judgeProblem, parseTimeLimitMs } from './codeRunner';
import {
  analyzeCodeMistakeWithAI,
  CodeMistakeAnalysis,
  LESSON_HIDDEN_TEST_CASES
} from './problemAnalyzer';
import { CodeMistakeAnalysisPanel } from './CodeMistakeAnalysisPanel';
import { LiveCodeTraceVisualizer, ThoughtSnapshot } from './LiveCodeTraceVisualizer';
import { setLiveWorkspaceContext } from '../../lib/liveCoPilotBridge';
import { SublimeStudio, SublimeStarterPreset } from './SublimeStudio';
import { SublimeEditor, MonokaiCodeBlock } from './SublimeEditor';
import { ViewportPortal } from '../common/ViewportPortal';
import { FormattedText } from '../common/MathRenderer';
import { InteractiveLectureRoom } from '../common/InteractiveLectureRoom';
import { LectureThumbnail } from '../common/LectureThumbnail';
import { buildCSLectureSteps } from '../../data/lectureStepsBuilder';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { AlgorithmVisualizer } from './AlgorithmVisualizer';
import { CS3DVisualizer } from './CS3DVisualizer';
import { AlgoId, LESSON_TO_ALGO_MAP, LESSON_TO_CS3D_MAP } from './visualizer/types';
import {
  progressDailyQuest,
  recordGrowthStat,
  recordMistake
} from '../../lib/learningGrowthStore';
import {
  Activity,
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
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const { location, navigate, goBack } = useNavigation();
  // Top View Mode: 'curriculum' (VNOI Roadmap & Bài giảng), 'judge' (Trình chấm online), or 'custom' (Sublime Studio)
  const viewMode = location.csViewMode;
  // Sub-view inside curriculum: 'roadmap' (VNOI Roadmap grid) or 'lecture' (Dedicated teaching classroom)
  const curriculumSubView = location.csSubView;
  const lessonTab = location.csLessonTab;

  // Active CS Roadmap Track ('vnoi' | 'openedg_cpp' | 'roadmap_sh_cpp' | 'learncpp' | 'github_career') synced via URL/NavContext
  const selectedTrackId: CSTrackId = location.csTrackId || 'vnoi';
  const setSelectedTrackId = (nextTrack: CSTrackId) => {
    navigate({ csTrackId: nextTrack, csViewMode: 'curriculum', csSubView: 'roadmap' });
  };
  const [completedTrackStageIds, setCompletedTrackStageIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('synapse_cs_track_completed_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [trackQuizSelections, setTrackQuizSelections] = useState<Record<string, number>>({});
  const [trackQuizChecked, setTrackQuizChecked] = useState<Record<string, boolean>>({});
  const [sublimePreset, setSublimePreset] = useState<SublimeStarterPreset | null>(null);

  const toggleTrackStageCompleted = (stageId: string) => {
    setCompletedTrackStageIds((prev) => {
      const exists = prev.includes(stageId);
      const next = exists ? prev.filter((id) => id !== stageId) : [...prev, stageId];
      try {
        localStorage.setItem('synapse_cs_track_completed_v1', JSON.stringify(next));
      } catch {}
      if (!exists && onScoreEarned) {
        onScoreEarned(25);
      }
      return next;
    });
  };

  const launchStageInSublime = (stageId: string, overrideCppCode?: string) => {
    const detail = CS_TRACK_STAGE_DETAILS[stageId];
    if (!detail) {
      navigate({ csViewMode: 'custom' });
      return;
    }
    const { labStarter } = detail;
    setSublimePreset({
      key: `${stageId}-${Date.now()}`,
      title: isEn ? labStarter.titleEn : labStarter.title,
      description: isEn ? labStarter.descriptionEn : labStarter.description,
      inputFormat: labStarter.inputFormat,
      outputFormat: labStarter.outputFormat,
      sampleInput: labStarter.sampleInput,
      sampleOutput: labStarter.sampleOutput,
      starterCpp: overrideCppCode || labStarter.starterCpp
    });
    navigate({ csViewMode: 'custom' });
  };

  const handleCheckStageQuiz = (quizId: string, selectedIdx: number, correctIdx: number) => {
    const alreadyChecked = Boolean(trackQuizChecked[quizId]);
    setTrackQuizSelections((prev) => ({ ...prev, [quizId]: selectedIdx }));
    setTrackQuizChecked((prev) => ({ ...prev, [quizId]: true }));
    if (!alreadyChecked && selectedIdx === correctIdx && onScoreEarned) {
      onScoreEarned(15);
    }
  };

  const activeSpecializedTrack = useMemo(
    () => CS_SPECIALIZED_TRACKS.find((tr) => tr.id === selectedTrackId) || null,
    [selectedTrackId]
  );

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

  // Code language & sample code tier ('basic' | 'advanced') for curriculum & Online Judge
  const [curriculumLang, setCurriculumLang] = useState<CodeLanguage>('cpp');
  const [codeSampleTier, setCodeSampleTier] = useState<'basic' | 'advanced'>('basic');
  const [showJudgeSampleDrawer, setShowJudgeSampleDrawer] = useState<boolean>(false);
  const [revealedSolution, setRevealedSolution] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [lessonCodeMap, setLessonCodeMap] = useState<Record<string, { cpp: string; python: string }>>({});
  const [lessonPracticeMap, setLessonPracticeMap] = useState<Record<string, LessonPracticeRunState>>({});
  const [vizDimMode, setVizDimMode] = useState<'2d' | '3d'>('2d');

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
    pythonTemplate: DEFAULT_PRACTICE_PYTHON,
    basicSolutionCpp: p.basicSolutionCpp,
    basicSolutionPython: p.basicSolutionPython,
    advancedSolutionCpp: p.fullSolutionCpp,
    advancedSolutionPython: p.fullSolutionPython,
    solutionAnalysis: p.solutionAnalysis
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

  // Bottom tabs: 'custom_run' | 'judge_results' | 'history' | 'trace'
  const [activeConsoleTab, setActiveConsoleTab] = useState<'custom_run' | 'judge_results' | 'history' | 'trace'>('custom_run');
  const [thoughtHistory, setThoughtHistory] = useState<ThoughtSnapshot[]>([]);
  const lastThoughtCodeRef = React.useRef<string>('');

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

  const recordThought = (eventLabel: string, verdictBadge?: string, overrideCode?: string) => {
    const snapCode = overrideCode ?? code;
    const charDelta = snapCode.length - lastThoughtCodeRef.current.length;
    lastThoughtCodeRef.current = snapCode;
    const snap: ThoughtSnapshot = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      eventLabel,
      verdictBadge,
      language: judgeLang,
      code: snapCode,
      charDelta
    };
    setThoughtHistory((prev) => [...prev.slice(-24), snap]);
  };

  React.useEffect(() => {
    if (viewMode !== 'judge') return;
    setLiveWorkspaceContext({
      subject: 'cs',
      title: currentProblem.title,
      summary: `Lang: ${judgeLang} · Difficulty: ${currentProblem.difficulty}${judgeVerdict ? ` · Verdict: ${judgeVerdict} (${judgeScore}/100)` : ''}`,
      codeSnippet: code.slice(0, 1500),
      language: judgeLang,
      paramsSummary: customStderr ? customStderr.slice(0, 400) : undefined
    });
  }, [viewMode, currentProblem.title, currentProblem.difficulty, judgeLang, code, judgeVerdict, judgeScore, customStderr]);

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

    const res = await executeCode(currentProblem.id, judgeLang, code, customInput, {
      ioMode: currentProblem.ioMode || 'standard',
      inputFileName: currentProblem.inputFileName,
      outputFileName: currentProblem.outputFileName,
      timeLimitEnabled: currentProblem.timeLimitEnabled ?? true,
      timeLimitMs:
        currentProblem.timeLimitMs !== undefined
          ? currentProblem.timeLimitMs
          : parseTimeLimitMs(currentProblem.timeLimit),
      problemDesc: currentProblem.description
    });
    setIsRunningCustom(false);
    setCustomOutput(res.stdout);
    setCustomStderr(res.stderr);
    setCustomRuntime(res.runtimeMs);
    recordThought('Chạy thử', res.stderr ? 'ERR' : `${res.runtimeMs}ms`, code);
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
    recordThought('Nộp bài', `${result.score}/100 · ${result.verdict}`, code);

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
      recordGrowthStat('codeAcceptedCount', 1);
      progressDailyQuest('practice_quiz_or_code', 1);
    } else {
      if (result.score > 0 && onScoreEarned) {
        onScoreEarned(Math.floor(result.score * 0.4));
      }
      recordMistake({
        subject: 'cs',
        sourceType: 'cs_judge',
        lessonKey: currentProblem.id,
        lessonTitle: currentProblem.title,
        prompt: `${currentProblem.title}: ${currentProblem.description.slice(0, 260)}`,
        userAnswer: `${judgeLang.toUpperCase()} (${result.passedCount}/${result.totalCount} test · ${result.verdict})`,
        correctAnswer: currentProblem.advancedSolutionCpp || currentProblem.basicSolutionCpp || currentProblem.solutionAnalysis || 'Xem lời giải tối ưu',
        explanation: currentProblem.solutionAnalysis || `Cần vượt qua toàn bộ ${result.totalCount} test (cả test ẩn & giới hạn thời gian).`
      });
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

    const res = await executeCode(prob.id, curriculumLang, codeToRun, state.customIn, {
      ioMode: 'standard',
      timeLimitEnabled: true,
      timeLimitMs: 1000,
      problemDesc: prob.description
    });
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
        fallbackSampleCpp: prob.basicSolutionCpp || prob.fullSolutionCpp,
        fallbackSamplePython: prob.basicSolutionPython || prob.fullSolutionPython,
        fallbackAdvancedCpp: prob.fullSolutionCpp,
        fallbackAdvancedPython: prob.fullSolutionPython
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
      recordGrowthStat('codeAcceptedCount', 1);
      progressDailyQuest('practice_quiz_or_code', 1);
    } else {
      recordMistake({
        subject: 'cs',
        sourceType: 'cs_judge',
        lessonKey: codingProb.id,
        lessonTitle: codingProb.title,
        prompt: `${codingProb.title}: ${codingProb.description.slice(0, 260)}`,
        userAnswer: `${curriculumLang.toUpperCase()} (${result.passedCount}/${result.totalCount} test · ${result.verdict})`,
        correctAnswer: codingProb.advancedSolutionCpp || codingProb.basicSolutionCpp || codingProb.solutionAnalysis || 'Xem lời giải mẫu',
        explanation: codingProb.solutionAnalysis || 'Kiểm tra lại điều kiện biên và độ phức tạp thuật toán.'
      });
    }
    if (xpDelta > 0 && onScoreEarned) {
      onScoreEarned(xpDelta);
    }

    void runLessonMistakeAnalysis(prob, curriculumLang, codeToJudge, result.score, result.results);
  };

  const renderJudgeActionToolbar = (detached: boolean) => (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-slate-950 shrink-0 ${
        detached ? 'border-b border-slate-800' : 'border-t border-slate-800'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            handleRunCustom();
            setMobileJudgePane('console');
          }}
          disabled={isRunningCustom || isJudging}
          className="sheen-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/60 text-slate-100 text-xs font-bold transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          <Play className="w-3.5 h-3.5 text-sky-400" />
          <span>{isRunningCustom ? 'Đang chạy...' : 'Chạy thử (Run)'}</span>
        </button>

        <button
          onClick={() => {
            handleSubmitCode();
            setMobileJudgePane('console');
          }}
          disabled={isRunningCustom || isJudging}
          className="cs-deck-btn sheen-btn flex items-center gap-1.5 px-4 py-1.5 rounded-[4px] bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold transition-all shadow disabled:opacity-50 whitespace-nowrap"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isJudging ? 'Đang chấm...' : 'Nộp bài (Submit)'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveConsoleTab('trace');
            setMobileJudgePane('console');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Trace 1-1</span>
        </button>
      </div>

      {judgeScore !== null && (
        <span
          className={`text-xs font-mono font-bold tabular-nums ${
            judgeScore === 100
              ? 'text-emerald-400'
              : judgeScore > 0
              ? 'text-amber-400'
              : 'text-rose-400'
          }`}
        >
          {judgeVerdict} · {judgeScore}/100
        </span>
      )}
    </div>
  );

  const renderJudgeConsole = (detached: boolean) => (
    <div
      className={`${
        detached
          ? mobileJudgePane === 'console'
            ? 'flex min-h-[380px] h-[64vh] lg:h-[290px]'
            : activeConsoleTab === 'trace'
            ? 'hidden lg:flex h-[340px]'
            : 'hidden lg:flex h-[280px]'
          : mobileJudgePane === 'console'
          ? 'flex-1 lg:flex-none lg:h-64'
          : activeConsoleTab === 'trace'
          ? 'hidden lg:flex lg:h-72'
          : 'hidden lg:flex lg:h-52'
      } ${detached ? '' : 'border-t border-slate-800'} bg-slate-950 flex-col shrink-0 overflow-hidden font-mono text-xs text-slate-100`}
    >
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-slate-800 bg-slate-900 overflow-x-auto">
        <button
          onClick={() => setActiveConsoleTab('custom_run')}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-[4px] transition-all shrink-0 whitespace-nowrap ${
            activeConsoleTab === 'custom_run'
              ? 'bg-sky-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Custom Test Stdin
        </button>
        <button
          onClick={() => setActiveConsoleTab('judge_results')}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-[4px] transition-all shrink-0 whitespace-nowrap ${
            activeConsoleTab === 'judge_results'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Kết quả Chấm {judgeScore !== null ? `(${judgeScore}/100)` : ''}
        </button>
        <button
          onClick={() => setActiveConsoleTab('trace')}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-[4px] transition-all shrink-0 whitespace-nowrap ${
            activeConsoleTab === 'trace'
              ? 'bg-cyan-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Activity className="w-3 h-3 inline mr-1" />
          Trace &amp; Replay ({thoughtHistory.length})
        </button>
        <button
          onClick={() => setActiveConsoleTab('history')}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-[4px] transition-all shrink-0 whitespace-nowrap ${
            activeConsoleTab === 'history'
              ? 'bg-sky-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Lịch sử ({submissions.length})
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        {activeConsoleTab === 'custom_run' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
            <div className="flex flex-col">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Input Stdin tùy chỉnh:
              </div>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 min-h-[110px] p-2.5 bg-[#131722] text-slate-100 font-mono text-xs rounded-[4px] focus:outline-none focus:border-sky-500 resize-none border border-slate-800"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <span>Output chương trình:</span>
                {customRuntime !== null && (
                  <span className="text-sky-400 font-mono tabular-nums">{customRuntime}ms</span>
                )}
              </div>
              <div className="flex-1 min-h-[110px] p-2.5 bg-[#131722] text-slate-100 font-mono text-xs rounded-[4px] overflow-y-auto border border-slate-800">
                {customStderr ? (
                  <span className="text-rose-400">{customStderr}</span>
                ) : customOutput ? (
                  <span className="text-emerald-400 whitespace-pre">{customOutput}</span>
                ) : (
                  <span className="text-slate-500 italic">
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
                <div className="flex items-center justify-between p-2.5 rounded-[4px] bg-[#131722] border border-slate-800">
                  <span
                    className={`text-xs font-bold ${
                      judgeScore === 100
                        ? 'text-emerald-400'
                        : judgeScore && judgeScore > 0
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {judgeVerdict}
                  </span>
                  <span className="text-sm font-bold text-white tabular-nums">{judgeScore} / 100 Điểm</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {judgeResults.map((tr, tIdx) => (
                    <div
                      key={tIdx}
                      className={`p-2 rounded-[4px] border text-[11px] font-mono space-y-1 ${
                        tr.passed
                          ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/35 text-rose-400'
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
                        <div className="text-[10px] text-slate-200 truncate">
                          Exp: {tr.expected.replace(/\n/g, ' ')} | Got: {tr.actual.replace(/\n/g, ' ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">
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
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-1.5">Thời gian</th>
                      <th>Bài</th>
                      <th>Ngôn ngữ</th>
                      <th>Điểm</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="border-b border-slate-800/60 font-mono">
                        <td className="py-1.5 text-slate-400 tabular-nums">{sub.submittedAt}</td>
                        <td className="font-sans font-medium text-slate-100">{sub.problemTitle}</td>
                        <td className="uppercase text-sky-400">{sub.language}</td>
                        <td className="font-bold text-emerald-400 tabular-nums">{sub.score}/100</td>
                        <td>
                          <span
                            className={`text-[11px] font-bold ${
                              sub.status === 'Accepted'
                                ? 'text-emerald-400'
                                : 'text-rose-400'
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
              <div className="text-center py-6 text-xs text-slate-500">
                Chưa có lượt nộp bài nào.
              </div>
            )}
          </div>
        )}

        {activeConsoleTab === 'trace' && (
          <div className="-m-3 h-full flex flex-col">
            <LiveCodeTraceVisualizer
              code={code}
              language={judgeLang}
              stdinInput={customInput}
              isEn={isEn}
              thoughtHistory={thoughtHistory}
              onRestoreCode={(restored, lang) => {
                setJudgeLang(lang);
                setCode(restored);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-20 overflow-x-hidden">
      {/* Header Banner */}
      <div className="sci-frame sci-scan-bar bg-white/95 dark:bg-slate-900/95 rounded-md p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <button
                onClick={viewMode !== 'curriculum' ? goBack : onBack || goBack}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>{t('nav.back_prev', 'Quay lại trang trước', 'Back')}</span>
              </button>
              {viewMode !== 'curriculum' && (
                <button
                  onClick={() => navigate({ csViewMode: 'curriculum' })}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 icon-anim-book" />
                  <span>{t('cs.goto_curriculum', 'VNOI Roadmap', 'VNOI Roadmap')}</span>
                </button>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span className="syn-live-square bg-emerald-500" />
                Tin Học Chuyên Sâu · 5 Lộ Trình (VNOI + 4 Tracks C++)
              </span>
              <span className="text-slate-400" aria-hidden="true">·</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                12 Bài VNOI · 18 Chặng C++ · Sublime Studio
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              5 Lộ Trình Tin Học (VNOI &amp; C++ Quốc Tế) · Trình Chấm Online Judge
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Tổng hợp 5 lộ trình học tập (VNOI Roadmap 12 bài, OpenEDG C++, Roadmap.sh, LearnCpp.com &amp; GitHub Career Track 18 chặng), code mẫu C++/Python và trình chấm test tự động.
            </p>
          </div>
        </div>

        {/* View Mode Switcher (Large Interactive Square Command Deck) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-stretch gap-2 bg-slate-100/90 dark:bg-slate-950/80 p-2 rounded-md border border-slate-200 dark:border-slate-800 shadow-inner">
          <button
            onClick={() => navigate({ csViewMode: 'curriculum' })}
            className={`group cs-deck-btn flex-1 min-w-fit flex items-center justify-center sm:justify-start gap-3 px-4 sm:px-5 py-3 min-h-[48px] rounded-[4px] text-[13px] sm:text-sm font-bold whitespace-nowrap cursor-pointer ${
              viewMode === 'curriculum'
                ? 'text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.6)]'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-blue-500/70 hover:text-blue-600 dark:hover:text-blue-300'
            }`}
          >
            {viewMode === 'curriculum' && (
              <motion.span
                layoutId="cs-viewmode-active"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 z-0"
              />
            )}
            <span
              className={`relative z-10 w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 ${
                viewMode === 'curriculum'
                  ? 'bg-white/20 text-white border border-white/25'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-800/60'
              }`}
            >
              <BookOpen className="w-[18px] h-[18px] icon-anim-book" />
            </span>
            <span className="relative z-10">
              {t('cs.tab.curriculum', '1. VNOI Roadmap & Bài Giảng', '1. VNOI Roadmap & Lectures')}
            </span>
          </button>

          <button
            onClick={() => navigate({ csViewMode: 'judge' })}
            className={`group cs-deck-btn flex-1 min-w-fit flex items-center justify-center sm:justify-start gap-3 px-4 sm:px-5 py-3 min-h-[48px] rounded-[4px] text-[13px] sm:text-sm font-bold whitespace-nowrap cursor-pointer ${
              viewMode === 'judge'
                ? 'text-white shadow-[0_10px_24px_-8px_rgba(5,150,105,0.6)]'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/70 hover:text-emerald-600 dark:hover:text-emerald-300'
            }`}
          >
            {viewMode === 'judge' && (
              <motion.span
                layoutId="cs-viewmode-active"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 z-0"
              />
            )}
            <span
              className={`relative z-10 w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                viewMode === 'judge'
                  ? 'bg-white/20 text-white border border-white/25'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/60'
              }`}
            >
              <Code2 className="w-[18px] h-[18px] icon-anim-code" />
            </span>
            <span className="relative z-10">
              {t('cs.tab.judge', '2. Trình Chấm Online Judge', '2. Standard Online Judge')}
            </span>
          </button>

          <button
            onClick={() => navigate({ csViewMode: 'custom' })}
            className={`group cs-deck-btn flex-1 min-w-fit flex items-center justify-center sm:justify-start gap-3 px-4 sm:px-5 py-3 min-h-[48px] rounded-[4px] text-[13px] sm:text-sm font-bold whitespace-nowrap cursor-pointer ${
              viewMode === 'custom'
                ? 'text-slate-950 shadow-[0_10px_24px_-8px_rgba(245,158,11,0.65)]'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-amber-500/70 hover:text-amber-700 dark:hover:text-amber-300'
            }`}
          >
            {viewMode === 'custom' && (
              <motion.span
                layoutId="cs-viewmode-active"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 z-0"
              />
            )}
            <span
              className={`relative z-10 w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${
                viewMode === 'custom'
                  ? 'bg-slate-950/15 text-slate-950 border border-slate-950/20'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/60'
              }`}
            >
              <Sparkles className="w-[18px] h-[18px] icon-anim-star" />
            </span>
            <span className="relative z-10">
              {t('cs.tab.custom', '3. Tự Do Giải Đề (Sublime Studio)', '3. Free Problem Solver')}
            </span>
          </button>

          <button
            onClick={() => {
              navigate({ csViewMode: 'visualizer' });
              window.dispatchEvent(new Event('educlassroom:cs-viz-reset'));
            }}
            className={`group cs-deck-btn flex-1 min-w-fit flex items-center justify-center sm:justify-start gap-3 px-4 sm:px-5 py-3 min-h-[48px] rounded-[4px] text-[13px] sm:text-sm font-bold whitespace-nowrap cursor-pointer ${
              viewMode === 'visualizer'
                ? 'text-white shadow-[0_10px_24px_-8px_rgba(2,132,199,0.6)]'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-sky-500/75 hover:text-sky-600 dark:hover:text-sky-300'
            }`}
          >
            {viewMode === 'visualizer' && (
              <motion.span
                layoutId="cs-viewmode-active"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-sky-500 via-cyan-600 to-blue-600 z-0"
              />
            )}
            <span
              className={`relative z-10 w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 ${
                viewMode === 'visualizer'
                  ? 'bg-white/20 text-white border border-white/25'
                  : 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/70 dark:border-sky-800/60'
              }`}
            >
              <GitBranch className="w-[18px] h-[18px] icon-anim-branch" />
            </span>
            <span className="relative z-10">
              {t('cs.tab.visualizer', '4. Đồ Thị & Mô Phỏng Thuật Toán', '4. Algorithm Visualizer')}
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/* MODE 1: CS ROADMAPS (VNOI + 4 C++ CAREER/STUDY TRACKS)       */}
      {/* ============================================================= */}
      {viewMode === 'curriculum' && curriculumSubView === 'roadmap' && (
        <div className="space-y-6">
          {/* Roadmap Track Selector Bar */}
          <div className="sci-frame bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <button
                  onClick={onBack || goBack}
                  className="mt-0.5 flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 whitespace-nowrap"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại</span>
                </button>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    {selectedTrackId === 'vnoi'
                      ? isEn
                        ? `VNOI Competitive Roadmap (${CS_LESSONS.length} Core Lessons)`
                        : `Lộ Trình VNOI Roadmap (${CS_LESSONS.length} Bài Giảng Chuyên Đề)`
                      : isEn
                      ? activeSpecializedTrack?.titleEn
                      : activeSpecializedTrack?.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {selectedTrackId === 'vnoi'
                      ? isEn
                        ? 'Choose a structured CS & C++ track (VNOI Competitive, OpenEDG Certification, Roadmap.sh, LearnCpp.com, or GitHub Career Track) and practice step by step.'
                        : 'Chọn lộ trình học tập phù hợp (VNOI Thi đấu, Chứng chỉ OpenEDG, Roadmap.sh, LearnCpp.com hoặc GitHub Career Track) và bấm vào bài học để thực hành.'
                      : isEn
                      ? activeSpecializedTrack?.summaryEn
                      : activeSpecializedTrack?.summary}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                {isEn ? '5 CS & C++ Roadmaps' : '5 Lộ trình Tin học & C++'}
              </span>
            </div>

            {/* 5-Track Selector */}
            <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTrackId('vnoi')}
                className={`px-3 py-2 rounded-[4px] text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer ${
                  selectedTrackId === 'vnoi'
                    ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500/60'
                }`}
              >
                {isEn ? `VNOI Roadmap (${CS_LESSONS.length})` : `VNOI Roadmap (${CS_LESSONS.length} bài)`}
              </button>
              {CS_SPECIALIZED_TRACKS.map((track) => {
                const isActive = selectedTrackId === track.id;
                const doneCount = track.stages.filter((s) => completedTrackStageIds.includes(s.id)).length;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => setSelectedTrackId(track.id)}
                    className={`px-3 py-2 rounded-[4px] text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-sky-600 border-sky-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-500/60'
                    }`}
                  >
                    <span>{track.shortName}</span>
                    <span className={`text-[10px] font-mono tabular-nums ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                      ({doneCount}/{track.stages.length})
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedTrackId === 'vnoi' && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedPhase('all')}
                  className={`px-3 py-1.5 rounded-[4px] text-xs font-bold whitespace-nowrap transition-colors border ${
                    selectedPhase === 'all'
                      ? 'bg-sky-600 border-sky-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-sky-500/60'
                  }`}
                >
                  {isEn ? `All Phases (${CS_LESSONS.length})` : `Tất cả Phase (${CS_LESSONS.length})`}
                </button>
                {vnoiPhases.map((phase) => (
                  <button
                    key={phase}
                    onClick={() => setSelectedPhase(phase)}
                    className={`px-3 py-1.5 rounded-[4px] text-xs font-bold whitespace-nowrap transition-colors border ${
                      selectedPhase === phase
                        ? 'bg-sky-600 border-sky-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-sky-500/60'
                    }`}
                  >
                    {phase}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedTrackId === 'vnoi' ? (
            /* VNOI Roadmap Progression Cards Grid */
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
                  className="group sci-frame text-left bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 rounded-md p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
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
                          <span className="font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                            {t('', 'Bài', 'Lesson')} {l.lessonNumber}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{l.vnoiPhase || l.level}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{l.estimatedMinutes}{t('', 'p', 'm')}</span>
                        </div>

                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                          {l.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {l.topic}
                    </p>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 rounded px-2.5 py-1.5 leading-snug">
                      <span className="font-bold">{isEn ? 'Outcome: ' : 'Học xong làm được: '}</span>
                      {l.practiceProblem?.title || l.topic}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 truncate">
                      {l.complexity.time}
                    </span>
                    <span className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 shrink-0">
                      {t('', 'Vào giảng bài', 'Open Lesson')} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : activeSpecializedTrack ? (
            /* Specialized International & Career C++ Roadmap Board */
            <div className="space-y-4">
              {/* Track Overview & Progress Summary */}
              {(() => {
                const totalStages = activeSpecializedTrack.stages.length;
                const doneStages = activeSpecializedTrack.stages.filter((s) =>
                  completedTrackStageIds.includes(s.id)
                ).length;
                const pct = Math.round((doneStages / Math.max(1, totalStages)) * 100);
                return (
                  <div className="sci-frame bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-sky-600 dark:text-sky-400">
                          {isEn ? activeSpecializedTrack.categoryLabelEn : activeSpecializedTrack.categoryLabel}
                        </span>
                        <span className="text-slate-400" aria-hidden="true">·</span>
                        <span className="font-mono text-slate-500 dark:text-slate-400">
                          {activeSpecializedTrack.officialRef}
                        </span>
                        <span className="text-slate-400" aria-hidden="true">·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                          ~{activeSpecializedTrack.estimatedWeeks} {isEn ? 'weeks' : 'tuần học'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-white">
                          {isEn ? 'Target Audience: ' : 'Đối tượng: '}
                        </strong>
                        {isEn ? activeSpecializedTrack.targetAudienceEn : activeSpecializedTrack.targetAudience}
                      </p>
                    </div>

                    <div className="min-w-[220px] space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600 dark:text-slate-300">
                          {isEn ? 'Completion Progress' : 'Tiến độ hoàn thành'}
                        </span>
                        <span className="text-sky-600 dark:text-sky-400 tabular-nums">
                          {doneStages}/{totalStages} {isEn ? 'stages' : 'chặng'} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Stages Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                {activeSpecializedTrack.stages.map((stage) => {
                  const isDone = completedTrackStageIds.includes(stage.id);
                  const isExpanded = expandedStageId === stage.id;
                  const stageDetail = CS_TRACK_STAGE_DETAILS[stage.id];
                  const linkedLessons = CS_LESSONS.filter((l) => stage.linkedLessonIds.includes(l.id));
                  return (
                    <div
                      key={stage.id}
                      className={`sci-frame bg-white/95 dark:bg-slate-900/95 border rounded-md p-5 shadow-sm flex flex-col justify-between gap-4 transition-colors ${
                        isExpanded
                          ? 'lg:col-span-2 border-sky-500 dark:border-sky-500'
                          : isDone
                          ? 'border-emerald-400/70 dark:border-emerald-600/60'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                              <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                                {isEn ? `Stage ${stage.stepNumber}` : `Chặng ${stage.stepNumber}`}
                              </span>
                              <span className="text-slate-400" aria-hidden="true">·</span>
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {stage.phaseCode}
                              </span>
                              <span className="text-slate-400" aria-hidden="true">·</span>
                              <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                                ~{stage.estimatedHours} {isEn ? 'hrs' : 'giờ'}
                              </span>
                            </div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                              {isEn ? stage.titleEn : stage.title}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleTrackStageCompleted(stage.id)}
                            className={`px-2.5 py-1.5 rounded-[4px] border text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
                              isDone
                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isDone ? (isEn ? 'Done' : 'Đã xong') : (isEn ? 'Mark Done' : 'Đánh dấu')}</span>
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {isEn ? stage.descriptionEn : stage.description}
                        </p>

                        <div className="space-y-1.5">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {isEn ? 'Core Topics' : 'Kiến thức trọng tâm'}
                          </div>
                          <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-200">
                            {stage.topics.map((tp, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-sky-500 font-bold mt-0.5">•</span>
                                <span>{tp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 rounded px-3 py-2 leading-snug">
                          <span className="font-bold">{isEn ? 'Exit Goal: ' : 'Mục tiêu đầu ra: '}</span>
                          {isEn ? stage.practiceGoalEn : stage.practiceGoal}
                        </div>

                        {/* Expandable Interactive Mini-Classroom: 30s Intuition, C++20 Sample, Common Pitfalls, Interactive Quiz */}
                        {isExpanded && stageDetail && (
                          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-4">
                            {/* 1. 30-Second Intuition */}
                            <div className="rounded-[4px] bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/60 p-3.5 space-y-1">
                              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5" />
                                <span>{isEn ? '30-Second Intuition' : 'Hiểu nhanh bản chất trong 30 giây'}</span>
                              </div>
                              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                                {isEn ? stageDetail.quickIntuitionEn : stageDetail.quickIntuition}
                              </p>
                            </div>

                            {/* 2. Runnable C++20 Code Sample */}
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                  <Code2 className="w-4 h-4 text-indigo-500" />
                                  <span>{isEn ? stageDetail.codeTitleEn : stageDetail.codeTitle}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => launchStageInSublime(stage.id, stageDetail.cppCode)}
                                  className="px-2.5 py-1 rounded-[4px] bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Play className="w-3 h-3" />
                                  <span>{isEn ? 'Run Sample in Sublime Studio' : 'Chạy Code mẫu trong Sublime Studio'}</span>
                                </button>
                              </div>
                              <MonokaiCodeBlock code={stageDetail.cppCode} language="cpp" />
                            </div>

                            {/* 3. Common Pitfalls & Checkpoint Quiz */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {/* Common Mistakes */}
                              <div className="rounded-[4px] bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 p-3.5 space-y-2">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                                  {isEn ? 'Common Pitfalls to Avoid' : 'Lỗi hay gặp cần tránh'}
                                </div>
                                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
                                  {(isEn ? stageDetail.commonMistakesEn : stageDetail.commonMistakes).map((err, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-amber-600 dark:text-amber-400 font-bold">!</span>
                                      <span>{err}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Checkpoint Quiz (2 questions) */}
                              <div className="rounded-[4px] bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3.5 space-y-3">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
                                  <span>{isEn ? 'Stage Self-Check Quiz' : 'Quiz kiểm tra chặng (+15 XP/câu)'}</span>
                                </div>
                                {stageDetail.checkpointQuiz.map((q, qIdx) => {
                                  const selectedOpt = trackQuizSelections[q.id];
                                  const isChecked = Boolean(trackQuizChecked[q.id]);
                                  const isCorrect = selectedOpt === q.correctIndex;
                                  const opts = isEn ? q.optionsEn : q.options;
                                  return (
                                    <div key={q.id} className="space-y-2 pb-2.5 border-b last:border-b-0 last:pb-0 border-slate-200 dark:border-slate-800">
                                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                                        {qIdx + 1}. {isEn ? q.questionEn : q.question}
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                        {opts.map((opt, optIdx) => {
                                          const picked = selectedOpt === optIdx;
                                          const rightOpt = optIdx === q.correctIndex;
                                          let btnCls =
                                            'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sky-500';
                                          if (isChecked) {
                                            if (rightOpt) {
                                              btnCls = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200';
                                            } else if (picked) {
                                              btnCls = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-200';
                                            }
                                          }
                                          return (
                                            <button
                                              key={optIdx}
                                              type="button"
                                              onClick={() => handleCheckStageQuiz(q.id, optIdx, q.correctIndex)}
                                              className={`text-left px-2.5 py-1.5 rounded-[4px] border text-[11px] font-medium transition-colors cursor-pointer ${btnCls}`}
                                            >
                                              {opt}
                                            </button>
                                          );
                                        })}
                                      </div>
                                      {isChecked && (
                                        <div
                                          className={`text-[11px] leading-relaxed flex items-start gap-1.5 ${
                                            isCorrect
                                              ? 'text-emerald-700 dark:text-emerald-300'
                                              : 'text-amber-700 dark:text-amber-300'
                                          }`}
                                        >
                                          {isCorrect ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                          ) : (
                                            <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                          )}
                                          <span>{isEn ? q.explanationEn : q.explanation}</span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                        {stageDetail && (
                          <button
                            type="button"
                            onClick={() => setExpandedStageId(isExpanded ? null : stage.id)}
                            className={`px-2.5 py-1.5 rounded-[4px] border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                              isExpanded
                                ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900'
                                : 'bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            <Zap className="w-3 h-3" />
                            <span>
                              {isExpanded
                                ? isEn
                                  ? 'Hide Mini-Lesson'
                                  : 'Thu gọn bài học'
                                : isEn
                                ? '30s Lesson & Quiz'
                                : 'Bài học & Quiz (30s + C++20)'}
                            </span>
                          </button>
                        )}
                        {linkedLessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => {
                              setRevealedSolution(false);
                              navigate({
                                csLessonId: lesson.id,
                                csLessonTab: 'lecture',
                                csSubView: 'lecture'
                              });
                            }}
                            className="px-2.5 py-1.5 rounded-[4px] bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>{isEn ? `Lesson ${lesson.lessonNumber}` : `Bài ${lesson.lessonNumber}`}</span>
                          </button>
                        ))}
                        {stage.linkedAlgoId && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate({ csViewMode: 'visualizer', csAlgoId: stage.linkedAlgoId })
                            }
                            className="px-2.5 py-1.5 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <GitBranch className="w-3 h-3" />
                            <span>{isEn ? 'Algorithm Visual' : 'Mô phỏng thuật toán'}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => launchStageInSublime(stage.id)}
                          className="ml-auto px-2.5 py-1.5 rounded-[4px] bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-300/70 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{isEn ? 'Practice in Sublime Studio' : 'Thực hành Sublime Studio'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {viewMode === 'curriculum' && curriculumSubView === 'lecture' && (
        <div className="space-y-5">
          {/* Dedicated Lesson Classroom Header Bar */}
          <div className="sci-frame bg-white/95 dark:bg-slate-900/95 rounded-md p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('btn.back', 'Quay lại', 'Back')}</span>
                </button>
                <button
                  onClick={() => navigate({ csSubView: 'roadmap' })}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] text-xs font-semibold bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                >
                  <span>{t('', 'Danh sách VNOI', 'VNOI List')}</span>
                </button>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    {currentLesson.vnoiPhase || currentLesson.level}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{t('', 'Bài', 'Lesson')} {currentLesson.lessonNumber} / {CS_LESSONS.length}</span>
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
                  className="px-2.5 py-1.5 rounded-[4px] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
                >
                  {t('', '← Bài trước', '← Prev Lesson')}
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
                  className="px-2.5 py-1.5 rounded-[4px] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
                >
                  {t('', 'Bài tiếp →', 'Next Lesson →')}
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
                  <span className="font-mono text-sky-600 dark:text-sky-400">
                    Space: {currentLesson.complexity.space}
                  </span>
                </div>
              </div>

              {/* 4 Lesson Room Sub-tabs */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 dark:bg-slate-950/80 rounded-md border border-slate-200 dark:border-slate-800 shrink-0">
                <button
                  onClick={() => navigate({ csLessonTab: 'lecture' })}
                  className={`group cs-deck-btn min-h-[40px] flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-[4px] text-[11px] sm:text-[13px] font-bold whitespace-nowrap cursor-pointer ${
                    lessonTab === 'lecture'
                      ? 'text-white shadow-md shadow-blue-500/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800 hover:text-blue-600 dark:hover:text-blue-300'
                  }`}
                >
                  {lessonTab === 'lecture' && (
                    <motion.span
                      layoutId="cs-lessontab-active"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-blue-600 to-indigo-600 z-0"
                    />
                  )}
                  <BookOpen className="relative z-10 w-4 h-4 icon-anim-book shrink-0" />
                  <span className="relative z-10 truncate">{t('', '1. Bài Giảng', '1. Lecture')}</span>
                </button>
                <button
                  onClick={() => navigate({ csLessonTab: 'code' })}
                  className={`group cs-deck-btn min-h-[40px] flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-[4px] text-[11px] sm:text-[13px] font-bold whitespace-nowrap cursor-pointer ${
                    lessonTab === 'code'
                      ? 'text-white shadow-md shadow-emerald-500/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800 hover:text-emerald-600 dark:hover:text-emerald-300'
                  }`}
                >
                  {lessonTab === 'code' && (
                    <motion.span
                      layoutId="cs-lessontab-active"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-emerald-600 to-teal-600 z-0"
                    />
                  )}
                  <Code2 className="relative z-10 w-4 h-4 icon-anim-code shrink-0" />
                  <span className="relative z-10 truncate">2. Code C++ / Py</span>
                </button>
                <button
                  onClick={() => navigate({ csLessonTab: 'practice' })}
                  className={`group cs-deck-btn min-h-[40px] flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-[4px] text-[11px] sm:text-[13px] font-bold whitespace-nowrap cursor-pointer ${
                    lessonTab === 'practice'
                      ? 'text-white shadow-md shadow-amber-500/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800 hover:text-amber-600 dark:hover:text-amber-300'
                  }`}
                >
                  {lessonTab === 'practice' && (
                    <motion.span
                      layoutId="cs-lessontab-active"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-amber-600 to-orange-500 z-0"
                    />
                  )}
                  <Award className="relative z-10 w-4 h-4 icon-anim-award shrink-0" />
                  <span className="relative z-10 truncate">3. Chấm Code</span>
                </button>
                <button
                  onClick={() => navigate({ csLessonTab: 'visualizer' })}
                  className={`group cs-deck-btn min-h-[40px] flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-[4px] text-[11px] sm:text-[13px] font-bold whitespace-nowrap cursor-pointer ${
                    lessonTab === 'visualizer'
                      ? 'text-white shadow-md shadow-sky-500/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800 hover:text-sky-600 dark:hover:text-sky-300'
                  }`}
                >
                  {lessonTab === 'visualizer' && (
                    <motion.span
                      layoutId="cs-lessontab-active"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-sky-500 to-cyan-600 z-0"
                    />
                  )}
                  <GitBranch className="relative z-10 w-4 h-4 icon-anim-branch shrink-0" />
                  <span className="relative z-10 truncate">4. Mô Phỏng</span>
                </button>
              </div>
            </div>

            {/* Beginner-Friendly 3-Step Guided Learning Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <div className="flex items-center gap-2 px-3 py-2 rounded bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">01</span>
                <span><strong>Hiểu nhanh 30s &amp; Chạy tay:</strong> Nắm ý tưởng đời thực + xem bảng giá trị biến chạy từng bước.</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-900/50 text-sky-900 dark:text-sky-200">
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0">02</span>
                <span><strong>Đọc Code C++ / Python &amp; Tránh bẫy:</strong> Biết ngay lỗi WA / TLE hay gặp để không mắc phải.</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-amber-900 dark:text-amber-200">
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">03</span>
                <span><strong>Thực hành ngay:</strong> Chạy thử mô phỏng trực quan &amp; nộp bài ở phòng Online Judge.</span>
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

          {/* LESSON TAB 2: ILLUSTRATED CODE (DUAL TIER: CƠ BẢN vs NÂNG CAO / CHUYÊN) */}
          {lessonTab === 'code' &&
            (() => {
              const activeCodeEx =
                currentLesson.codeExamples.find((e) => e.language === curriculumLang) ||
                currentLesson.codeExamples[0];
              const hasBasic = Boolean(activeCodeEx?.basicCode && activeCodeEx.basicCode.trim());
              const effectiveTier = codeSampleTier === 'basic' && hasBasic ? 'basic' : 'advanced';
              const displayTitle =
                effectiveTier === 'basic'
                  ? activeCodeEx?.basicTitle || activeCodeEx?.title
                  : activeCodeEx?.advancedTitle || activeCodeEx?.title;
              const displayCode =
                effectiveTier === 'basic'
                  ? activeCodeEx?.basicCode || activeCodeEx?.code || '// Không có code mẫu'
                  : activeCodeEx?.advancedCode || activeCodeEx?.code || '// Không có code mẫu';
              const displayExplanation =
                effectiveTier === 'basic'
                  ? activeCodeEx?.basicExplanation || activeCodeEx?.explanation || ''
                  : activeCodeEx?.advancedExplanation || activeCodeEx?.explanation || '';

              return (
                <div className="sci-frame bg-white/95 dark:bg-slate-900/95 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => navigate({ csLessonTab: 'lecture' })}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] text-xs font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shrink-0 whitespace-nowrap"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Quay lại Bài giảng</span>
                      </button>
                      <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {effectiveTier === 'basic'
                            ? 'Code Minh Họa Cơ Bản (Thuật toán tối giản)'
                            : 'Code Minh Họa Nâng Cao / Chuyên (DP · STL · VNOI)'}
                        </h3>
                        <div className="text-xs text-slate-500">{displayTitle}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {hasBasic && (
                        <div className="flex items-center bg-slate-200/80 dark:bg-slate-950 p-1 rounded-[4px] border border-slate-300 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => setCodeSampleTier('basic')}
                            className={`px-3 py-1 rounded-[3px] text-xs font-bold whitespace-nowrap transition-all ${
                              effectiveTier === 'basic'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Cơ bản (Tối giản)
                          </button>
                          <button
                            type="button"
                            onClick={() => setCodeSampleTier('advanced')}
                            className={`px-3 py-1 rounded-[3px] text-xs font-bold whitespace-nowrap transition-all ${
                              effectiveTier === 'advanced'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Nâng cao / Chuyên
                          </button>
                        </div>
                      )}

                      <div className="flex items-center bg-slate-200/80 dark:bg-slate-950 p-1 rounded-[4px] border border-slate-300 dark:border-slate-800">
                        <button
                          onClick={() => setCurriculumLang('cpp')}
                          className={`px-3 py-1 rounded-[3px] text-xs font-bold whitespace-nowrap transition-all ${
                            curriculumLang === 'cpp'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          C++ 17/20 STL
                        </button>
                        <button
                          onClick={() => setCurriculumLang('python')}
                          className={`px-3 py-1 rounded-[3px] text-xs font-bold whitespace-nowrap transition-all ${
                            curriculumLang === 'python'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Python 3
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-slate-950">
                    <MonokaiCodeBlock
                      code={displayCode}
                      language={curriculumLang}
                      title={
                        effectiveTier === 'basic'
                          ? curriculumLang === 'cpp'
                            ? 'basic_example.cpp'
                            : 'basic_example.py'
                          : curriculumLang === 'cpp'
                          ? 'advanced_example.cpp'
                          : 'advanced_example.py'
                      }
                      onCopy={() => handleCopy(displayCode)}
                      copied={copiedText === displayCode}
                    />
                  </div>

                  {displayExplanation && (
                    <div
                      className={`px-4 sm:px-6 py-3 border-t text-xs font-medium ${
                        effectiveTier === 'basic'
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-300'
                          : 'bg-sky-50/60 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/30 text-sky-900 dark:text-sky-300'
                      }`}
                    >
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
                  <div className="sci-frame bg-white/95 dark:bg-slate-900/95 rounded-md p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => navigate({ csLessonTab: 'lecture' })}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Quay lại Bài giảng</span>
                        </button>
                        <Award className="w-5 h-5 text-amber-500 shrink-0" />
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                          Bài Tập Tự Code: {prob.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleLoadIntoJudge(prob)}
                        className="sheen-btn flex items-center gap-2 px-3.5 py-2 rounded-[4px] bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all whitespace-nowrap"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-sky-500" />
                        <span>Mở trong Online Judge toàn màn hình</span>
                      </button>
                    </div>

                    <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                      <FormattedText text={prob.description} />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-[4px] border border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-slate-900 dark:text-white mb-1">
                            Định dạng Input:
                          </div>
                          <div className="font-mono text-slate-600 dark:text-slate-300 whitespace-pre-line">
                            {prob.inputFormat}
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-[4px] border border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-slate-900 dark:text-white mb-1">
                            Định dạng Output:
                          </div>
                          <div className="font-mono text-slate-600 dark:text-slate-300 whitespace-pre-line">
                            {prob.outputFormat}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
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
                            className="bg-slate-950 text-slate-100 rounded-[4px] border border-slate-800 p-3 font-mono text-xs space-y-1.5"
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
                    <div className="syn-conic-border shadow-xl">
                      <div className="syn-conic-border-spin" aria-hidden="true" />
                      <div className="relative z-10 rounded-[5px] overflow-hidden border border-slate-800 bg-[#131722]">
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
                        <div className="bg-slate-950 border-t border-slate-800 px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={handleRunLessonCustom}
                              disabled={pState.isRunning || pState.isJudging}
                              className="sheen-btn px-3.5 py-1.5 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/60 text-slate-100 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              <Play className="w-3.5 h-3.5 text-sky-400" />
                              <span>{pState.isRunning ? t('', 'Đang chạy...', 'Running...') : t('', 'Chạy Thử (Stdin)', 'Run Sample (Stdin)')}</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleSubmitLessonPractice}
                              disabled={pState.isRunning || pState.isJudging}
                              className="cs-deck-btn sheen-btn px-4 py-1.5 rounded-[4px] bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all disabled:opacity-50 whitespace-nowrap"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>
                                {pState.isJudging
                                  ? t('', 'Đang chấm...', 'Judging...')
                                  : t('', `Nộp Bài & Chấm Điểm (${totalTestsCount} tests)`, `Submit & Grade (${totalTestsCount} tests)`)}
                              </span>
                            </button>
                          </div>

                          {pState.score !== null && (
                            <span
                              className={`text-xs font-mono font-bold tabular-nums ${
                                pState.score === 100
                                  ? 'text-emerald-400'
                                  : pState.score > 0
                                  ? 'text-amber-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              {pState.verdict} · {pState.score}/100 {t('', 'điểm', 'pts')}
                            </span>
                          )}
                        </div>

                        {/* Stdin / Output Console */}
                        <div className="bg-slate-950 border-t border-slate-800 p-3 grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs text-slate-100">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400">
                              Input chạy thử (Stdin):
                            </span>
                            <textarea
                              value={pState.customIn}
                              onChange={(e) => updateLessonPracticeState(prob, { customIn: e.target.value })}
                              rows={3}
                              className="w-full p-2 bg-[#131722] border border-slate-800 rounded-[4px] text-xs text-slate-100 focus:outline-none focus:border-sky-500 resize-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
                              <span>Output chương trình:</span>
                              {pState.runtimeMs !== null && (
                                <span className="text-sky-400 tabular-nums">{pState.runtimeMs}ms</span>
                              )}
                            </div>
                            <div className="flex-1 min-h-[76px] max-h-[110px] p-2 bg-[#131722] border border-slate-800 rounded-[4px] overflow-y-auto whitespace-pre-wrap">
                              {pState.customErr ? (
                                <span className="text-rose-400">{pState.customErr}</span>
                              ) : pState.customOut ? (
                                <span className="text-emerald-400">{pState.customOut}</span>
                              ) : (
                                <span className="text-slate-500">// Kết quả chạy thử sẽ hiện tại đây...</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grading Verdict, Failed Tests & AI Mistake Diagnosis */}
                    {(pState.results || pState.isJudging) && (
                      <div>
                        {pState.isJudging && !pState.results ? (
                          <div className="p-5 rounded-[4px] bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs font-mono text-sky-600 dark:text-sky-400">
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

                    {/* Sample Solutions: Cơ bản (Tối giản) vs Nâng cao / Chuyên */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setRevealedSolution(!isSolutionShown)}
                        className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1.5"
                      >
                        <span>
                          {isSolutionShown
                            ? 'Ẩn code mẫu 2 cấp độ (Cơ bản & Nâng cao / Chuyên)'
                            : 'Xem gợi ý & code mẫu 2 cấp độ (Cơ bản & Nâng cao / Chuyên)'}
                        </span>
                      </button>

                      {isSolutionShown && (() => {
                        const hasBasicSol = Boolean(
                          curriculumLang === 'cpp' ? prob.basicSolutionCpp : prob.basicSolutionPython
                        );
                        const activeTier = codeSampleTier === 'basic' && hasBasicSol ? 'basic' : 'advanced';
                        const activeSolCode =
                          activeTier === 'basic'
                            ? curriculumLang === 'cpp'
                              ? prob.basicSolutionCpp || prob.fullSolutionCpp
                              : prob.basicSolutionPython || prob.fullSolutionPython
                            : curriculumLang === 'cpp'
                            ? prob.fullSolutionCpp
                            : prob.fullSolutionPython;
                        const activeSolAnalysis =
                          activeTier === 'basic'
                            ? prob.basicAnalysis || prob.solutionAnalysis
                            : prob.solutionAnalysis;

                        return (
                          <div className="mt-3 p-5 rounded-md bg-slate-100/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                  Code Mẫu &amp; Chiến Lược Giải:
                                </h4>
                                {hasBasicSol && (
                                  <div className="inline-flex items-center p-0.5 rounded-[4px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                    <button
                                      type="button"
                                      onClick={() => setCodeSampleTier('basic')}
                                      className={`px-2.5 py-1 rounded-[3px] text-[11px] font-bold ${
                                        activeTier === 'basic'
                                          ? 'bg-emerald-600 text-white'
                                          : 'text-slate-600 dark:text-slate-300'
                                      }`}
                                    >
                                      Cơ bản (Tối giản)
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setCodeSampleTier('advanced')}
                                      className={`px-2.5 py-1 rounded-[3px] text-[11px] font-bold ${
                                        activeTier === 'advanced'
                                          ? 'bg-amber-600 text-white'
                                          : 'text-slate-600 dark:text-slate-300'
                                      }`}
                                    >
                                      Nâng cao / Chuyên (DP · Tối ưu)
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setCurriculumLang('cpp')}
                                  className={`px-2.5 py-1 rounded-[4px] text-[11px] font-bold border ${
                                    curriculumLang === 'cpp'
                                      ? 'bg-sky-600 border-sky-500 text-white'
                                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  C++
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCurriculumLang('python')}
                                  className={`px-2.5 py-1 rounded-[4px] text-[11px] font-bold border ${
                                    curriculumLang === 'python'
                                      ? 'bg-sky-600 border-sky-500 text-white'
                                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  Python
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLessonCode(prob.id, curriculumLang, activeSolCode)}
                                  className="sheen-btn px-2.5 py-1 rounded-[4px] bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold"
                                >
                                  {activeTier === 'basic'
                                    ? 'Nạp Code Cơ Bản Vào Editor'
                                    : 'Nạp Code Nâng Cao Vào Editor'}
                                </button>
                              </div>
                            </div>

                            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                              <FormattedText text={activeSolAnalysis} />
                            </div>

                            <MonokaiCodeBlock
                              code={activeSolCode}
                              language={curriculumLang}
                              title={
                                activeTier === 'basic'
                                  ? curriculumLang === 'cpp'
                                    ? 'basic_solution.cpp'
                                    : 'basic_solution.py'
                                  : curriculumLang === 'cpp'
                                  ? 'advanced_solution.cpp'
                                  : 'advanced_solution.py'
                              }
                              onCopy={() => handleCopy(activeSolCode)}
                              copied={copiedText === activeSolCode}
                              maxHeightClass="max-h-[360px]"
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* LESSON TAB 4: ALGORITHM VISUALIZER (2D + 3D SWITCHER) */}
          {lessonTab === 'visualizer' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-900/95 border border-slate-700/80">
                <div className="text-xs font-semibold text-slate-300">
                  {t('', 'Chế độ mô phỏng cho bài học:', 'Simulation engine for lesson:')}{' '}
                  <span className="text-sky-400 font-bold">{currentLesson.title}</span>
                </div>
                <div className="inline-flex items-center p-1 rounded-md bg-slate-950 border border-slate-800 gap-1">
                  <button
                    type="button"
                    onClick={() => setVizDimMode('2d')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                      vizDimMode === '2d'
                        ? 'bg-sky-600 text-white shadow'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {t('', 'Mô phỏng 2D (Từng bước)', '2D Step-by-Step')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setVizDimMode('3d')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                      vizDimMode === '3d'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {t('', 'Mô phỏng 3D WebGL (Không gian)', '3D WebGL Spatial')}
                  </button>
                </div>
              </div>

              {vizDimMode === '2d' ? (
                <AlgorithmVisualizer
                  initialAlgoId={LESSON_TO_ALGO_MAP[currentLesson.id] || 'coord_hull'}
                  embeddedLessonTitle={currentLesson.title}
                  onBack={() => navigate({ csLessonTab: 'lecture' })}
                  onScoreEarned={onScoreEarned}
                />
              ) : (
                <CS3DVisualizer
                  initialMode={LESSON_TO_CS3D_MAP[currentLesson.id] || 'sort_3d'}
                  onBack={() => setVizDimMode('2d')}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* MODE 2: TRÌNH CHẤM ONLINE JUDGE (SYNAPSE ARCHITECTURAL IDE)   */}
      {/* ============================================================= */}
      {viewMode === 'judge' && (
        <ViewportPortal active={isJudgeFullscreen}>
          <div
            className={
              isJudgeFullscreen
                ? 'fixed inset-0 z-[100] w-screen h-[100dvh] bg-slate-950 flex flex-col overflow-hidden'
                : 'space-y-3'
            }
          >
            {/* Persistent Fullscreen Top Bar with Back / Exit button */}
            {isJudgeFullscreen && (
              <div className="syn-top-laser bg-slate-950 border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <button
                    onClick={() => {
                      setIsJudgeFullscreen(false);
                      goBack();
                    }}
                    className="px-2.5 py-1.5 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Quay lại</span>
                  </button>
                  <button
                    onClick={() => setIsJudgeFullscreen(false)}
                    className="px-2.5 py-1.5 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-sky-500/40 text-sky-400 text-xs font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap"
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
                  className="p-1.5 rounded-[4px] bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25 shrink-0"
                  title="Thoát toàn màn hình (Esc)"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Pane Switcher (<lg) */}
            <div className="lg:hidden grid grid-cols-3 gap-1 p-1 bg-slate-950 border border-slate-800 rounded-md shrink-0">
              {[
                { id: 'problem' as const, label: 'Đề Bài & Test' },
                { id: 'editor' as const, label: 'Code Sublime' },
                { id: 'console' as const, label: judgeScore !== null ? `Kết quả (${judgeScore}%)` : 'Console' }
              ].map((pane) => (
                <button
                  key={pane.id}
                  onClick={() => setMobileJudgePane(pane.id)}
                  className={`py-2 px-2 rounded-[4px] text-xs font-bold transition-colors whitespace-nowrap ${
                    mobileJudgePane === pane.id
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {pane.label}
                </button>
              ))}
            </div>

            <div className={isJudgeFullscreen ? 'flex flex-1 min-h-0 overflow-hidden' : `syn-conic-border shadow-xl ${mobileJudgePane === 'console' ? 'hidden lg:block' : ''}`}>
              {!isJudgeFullscreen && <div className="syn-conic-border-spin" aria-hidden="true" />}
              <div
                className={`relative z-10 flex flex-1 min-h-0 overflow-hidden ${
                  isJudgeFullscreen
                    ? 'border-0 rounded-none bg-slate-950'
                    : 'rounded-[5px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 min-h-[540px] sm:min-h-[600px] lg:h-[74vh]'
                }`}
              >
                {/* Left Column: Problem details & Sample cases */}
                {(isJudgeSidebarOpen || mobileJudgePane === 'problem') && (
                  <div
                    className={`${
                      mobileJudgePane === 'problem' ? 'flex w-full' : 'hidden lg:flex lg:w-[33%] xl:w-[30%]'
                    } ${
                      isJudgeFullscreen
                        ? 'bg-slate-950 border-r border-slate-800 text-slate-100'
                        : 'bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                    } flex-col shrink-0 min-h-0 overflow-hidden`}
                  >
                    <div
                      className={`p-3.5 border-b space-y-2 shrink-0 ${
                        isJudgeFullscreen
                          ? 'bg-slate-900/90 border-slate-800'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {!isJudgeFullscreen && (
                            <button
                              onClick={goBack}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-[4px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-sky-700 dark:text-sky-400 shrink-0 whitespace-nowrap"
                              title="Quay lại trang trước"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>Quay lại</span>
                            </button>
                          )}
                          <label className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider truncate">
                            Chọn đề bài:
                          </label>
                        </div>
                        <button
                          onClick={() => setIsJudgeFullscreen(!isJudgeFullscreen)}
                          className={`hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded-[4px] border text-[11px] font-bold shrink-0 whitespace-nowrap ${
                            isJudgeFullscreen
                              ? 'bg-slate-950 border-slate-700 text-sky-400 hover:bg-slate-800'
                              : 'bg-sky-50 dark:bg-slate-800 border-sky-200 dark:border-slate-700 text-sky-700 dark:text-sky-400 hover:bg-sky-100'
                          }`}
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
                        className={`w-full border rounded-[4px] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-sky-500 ${
                          isJudgeFullscreen
                            ? 'bg-slate-950 border-slate-700 text-slate-100'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                        }`}
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

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h3 className={`text-sm font-extrabold ${isJudgeFullscreen ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                            {currentProblem.title}
                          </h3>
                          <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0">
                            {currentProblem.difficulty}
                          </span>
                        </div>
                        <div
                          className={`leading-relaxed p-3 rounded-[4px] border ${
                            isJudgeFullscreen
                              ? 'text-slate-300 bg-slate-900/90 border-slate-800'
                              : 'text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <FormattedText text={currentProblem.description} />
                        </div>
                      </div>

                      {/* I/O Format */}
                      <div className="space-y-2 text-[11px]">
                        <div
                          className={`p-2.5 rounded-[4px] border ${
                            isJudgeFullscreen
                              ? 'bg-slate-900/90 border-slate-800 text-slate-300'
                              : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="font-bold text-sky-600 dark:text-sky-400 block mb-0.5">Input:</span>
                          <span className="font-mono whitespace-pre-line">{currentProblem.inputFormat}</span>
                        </div>
                        <div
                          className={`p-2.5 rounded-[4px] border ${
                            isJudgeFullscreen
                              ? 'bg-slate-900/90 border-slate-800 text-slate-300'
                              : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">Output:</span>
                          <span className="font-mono whitespace-pre-line">{currentProblem.outputFormat}</span>
                        </div>
                        <div
                          className={`p-2.5 rounded-[4px] border ${
                            isJudgeFullscreen
                              ? 'bg-slate-900/90 border-slate-800 text-slate-300'
                              : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">Ràng buộc:</span>
                          <span className="font-mono">
                            {Array.isArray(currentProblem.constraints)
                              ? currentProblem.constraints.join(' · ')
                              : currentProblem.constraints}
                          </span>
                        </div>
                      </div>

                      {/* Sample test */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">
                          Test ví dụ ({currentProblem.sampleCases.length} mẫu + {currentProblem.hiddenCases.length} test ẩn):
                        </span>
                        {currentProblem.sampleCases.map((sc, sIdx) => (
                          <div
                            key={sIdx}
                            className={`border p-3 rounded-[4px] font-mono text-[11px] space-y-1 ${
                              isJudgeFullscreen
                                ? 'bg-slate-900/90 border-slate-800'
                                : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px]">
                              <span>Ví dụ #{sIdx + 1}</span>
                              <button
                                onClick={() => {
                                  setCustomInput(sc.input);
                                  setActiveConsoleTab('custom_run');
                                  setMobileJudgePane('editor');
                                }}
                                className="text-sky-600 dark:text-sky-400 hover:underline font-semibold"
                              >
                                Nạp stdin
                              </button>
                            </div>
                            <div>
                              <span className="text-slate-500">In: </span>
                              <span className="text-amber-600 dark:text-amber-300 whitespace-pre-wrap">{sc.input.trim()}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Out: </span>
                              <span className="text-emerald-700 dark:text-emerald-400 font-bold whitespace-pre-wrap">{sc.expectedOutput.trim()}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Dual-tier Sample Code Drawer in Online Judge */}
                      {(currentProblem.basicSolutionCpp ||
                        currentProblem.advancedSolutionCpp ||
                        currentProblem.basicSolutionPython ||
                        currentProblem.advancedSolutionPython) && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                          <button
                            type="button"
                            onClick={() => setShowJudgeSampleDrawer((v) => !v)}
                            className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1.5"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                            <span>
                              {showJudgeSampleDrawer
                                ? 'Ẩn Code Mẫu (Cơ bản & Nâng cao / Chuyên)'
                                : 'Xem Code Mẫu 2 Cấp Độ (Cơ bản & Nâng cao / Chuyên)'}
                            </span>
                          </button>

                          {showJudgeSampleDrawer && (() => {
                            const hasBasic = Boolean(
                              judgeLang === 'cpp'
                                ? currentProblem.basicSolutionCpp
                                : currentProblem.basicSolutionPython
                            );
                            const hasAdv = Boolean(
                              judgeLang === 'cpp'
                                ? currentProblem.advancedSolutionCpp
                                : currentProblem.advancedSolutionPython
                            );
                            const tier =
                              codeSampleTier === 'advanced' && hasAdv
                                ? 'advanced'
                                : hasBasic
                                ? 'basic'
                                : 'advanced';
                            const sampleCode =
                              tier === 'basic'
                                ? judgeLang === 'cpp'
                                  ? currentProblem.basicSolutionCpp || currentProblem.advancedSolutionCpp || ''
                                  : currentProblem.basicSolutionPython || currentProblem.advancedSolutionPython || ''
                                : judgeLang === 'cpp'
                                ? currentProblem.advancedSolutionCpp || currentProblem.basicSolutionCpp || ''
                                : currentProblem.advancedSolutionPython || currentProblem.basicSolutionPython || '';

                            return (
                              <div
                                className={`p-3 rounded-[4px] border space-y-2 ${
                                  isJudgeFullscreen
                                    ? 'bg-slate-900/95 border-slate-800'
                                    : 'bg-white dark:bg-slate-900/95 border-slate-200 dark:border-slate-800'
                                }`}
                              >
                                <div className="flex flex-wrap items-center justify-between gap-1.5">
                                  <div className="inline-flex items-center p-0.5 rounded-[4px] bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                    {hasBasic && (
                                      <button
                                        type="button"
                                        onClick={() => setCodeSampleTier('basic')}
                                        className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold ${
                                          tier === 'basic'
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-slate-600 dark:text-slate-400'
                                        }`}
                                      >
                                        Cơ bản (Tối giản)
                                      </button>
                                    )}
                                    {hasAdv && (
                                      <button
                                        type="button"
                                        onClick={() => setCodeSampleTier('advanced')}
                                        className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold ${
                                          tier === 'advanced'
                                            ? 'bg-amber-600 text-white'
                                            : 'text-slate-600 dark:text-slate-400'
                                        }`}
                                      >
                                        Nâng cao / Chuyên
                                      </button>
                                    )}
                                  </div>
                                  {sampleCode && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCode(sampleCode);
                                        setMobileJudgePane('editor');
                                      }}
                                      className="px-2 py-1 rounded-[3px] bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
                                    >
                                      Nạp vào Editor
                                    </button>
                                  )}
                                </div>

                                {(tier === 'basic'
                                  ? (currentProblem.basicAnalysis || currentProblem.solutionAnalysis)
                                  : currentProblem.solutionAnalysis) && (
                                  <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                                    <FormattedText
                                      text={
                                        tier === 'basic'
                                          ? (currentProblem.basicAnalysis || currentProblem.solutionAnalysis || '')
                                          : (currentProblem.solutionAnalysis || '')
                                      }
                                    />
                                  </div>
                                )}

                                {sampleCode && (
                                  <MonokaiCodeBlock
                                    code={sampleCode}
                                    language={judgeLang}
                                    title={
                                      tier === 'basic'
                                        ? judgeLang === 'cpp'
                                          ? 'basic.cpp'
                                          : 'basic.py'
                                        : judgeLang === 'cpp'
                                        ? 'advanced.cpp'
                                        : 'advanced.py'
                                    }
                                    onCopy={() => handleCopy(sampleCode)}
                                    copied={copiedText === sampleCode}
                                    maxHeightClass="max-h-[260px]"
                                  />
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Right Column: Synchronized Sublime Editor & Console */}
                <div
                  className={`${
                    mobileJudgePane === 'problem' ? 'hidden lg:flex' : 'flex'
                  } flex-1 flex-col bg-[#131722] min-w-0 min-h-0 overflow-hidden`}
                >
                  {/* Sublime Editor */}
                  <div className={`${mobileJudgePane === 'console' ? 'hidden lg:flex' : 'flex'} flex-1 flex-col min-h-0 overflow-hidden`}>
                    <SublimeEditor
                      value={code}
                      onChange={(val) => {
                        setCode(val);
                        if (Math.abs(val.length - lastThoughtCodeRef.current.length) >= 25) {
                          recordThought(judgeLang === 'python' ? 'Gõ Python' : 'Gõ C++', undefined, val);
                        }
                      }}
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

                  {/* Action Toolbar & Console docked inside right column when Fullscreen */}
                  {isJudgeFullscreen && renderJudgeActionToolbar(false)}
                  {isJudgeFullscreen && renderJudgeConsole(false)}
                </div>
              </div>
            </div>

            {/* BELOW CODE EDITOR (Normal mode): Dedicated Action Toolbar + Input/Output & Console */}
            {!isJudgeFullscreen && (
              <div className="mt-3 rounded-[5px] border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-xl overflow-hidden">
                {renderJudgeActionToolbar(true)}
                {renderJudgeConsole(true)}
              </div>
            )}
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
          initialPreset={sublimePreset}
          onPresetConsumed={() => setSublimePreset(null)}
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
