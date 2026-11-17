import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  CodeLanguage,
  CodingProblem,
  ProblemIOMode,
  TestCase,
  TestDifficultyTier,
  TestResult
} from '../../types';
import { executeCode, judgeProblem, parseTimeLimitMs } from './codeRunner';
import {
  analyzeProblemAndGenerateTests,
  analyzeCodeMistakeWithAI,
  CodeMistakeAnalysis,
  detectProblemExecutionConfig,
  extractSamplesFromText,
  UserSamplePair
} from './problemAnalyzer';
import { CodeMistakeAnalysisPanel } from './CodeMistakeAnalysisPanel';
import { SublimeEditor, SublimeTabItem } from './SublimeEditor';
import { ViewportPortal } from '../common/ViewportPortal';
import { useLanguage } from '../../context/LanguageContext';
import { FormattedText } from '../common/MathRenderer';
import { VoiceMicButton } from '../common/VoiceMicButton';
import {
  Play,
  Send,
  Upload,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Check,
  Code2,
  Terminal,
  Layers,
  AlertCircle,
  Edit3,
  BookOpen,
  X,
  ArrowLeft,
  Minimize2,
  Clock
} from 'lucide-react';

function formatMsLabel(enabled?: boolean, ms?: number | null, isEn = false): string {
  if (enabled === false || ms === null) return isEn ? 'Unlimited' : 'Không giới hạn';
  const val = ms ?? 1000;
  const sec = val / 1000;
  return `${Number.isInteger(sec) ? sec.toFixed(1) : sec.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}s`;
}

function getTimeLimitMsFromInput(enabled: boolean, secStr: string): number | null {
  if (!enabled) return null;
  const parsed = Number(String(secStr).replace(',', '.'));
  if (Number.isNaN(parsed) || parsed <= 0) return 1000;
  return Math.max(50, Math.round(parsed * 1000));
}

interface SublimeStudioProps {
  onScoreEarned?: (xp: number) => void;
  onBack?: () => void;
}

const DEFAULT_CLEAN_CPP = `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    // Viết mã nguồn C++ tại đây...
    
    return 0;
}`;

const DEFAULT_CLEAN_PYTHON = `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    # Viết mã nguồn Python tại đây...

if __name__ == '__main__':
    solve()
`;

export const SublimeStudio: React.FC<SublimeStudioProps> = ({ onScoreEarned, onBack }) => {
  const { language: uiLang } = useLanguage();

  // Current analyzed problem
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [diagnosticNote, setDiagnosticNote] = useState<string>('');
  const [analysisSource, setAnalysisSource] = useState<'ai' | 'local-oracle' | 'local-inferred' | 'template' | null>(null);

  // Problem Upload & Analyzer Modal
  const [showUploadModal, setShowUploadModal] = useState<boolean>(true);
  const [inputMode, setInputMode] = useState<'text' | 'image' | 'file'>('text');
  const [rawText, setRawText] = useState<string>('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string>('image/png');
  const [userSamples, setUserSamples] = useState<UserSamplePair[]>([
    { input: '', expectedOutput: '' }
  ]);
  const [showRefCodeBox, setShowRefCodeBox] = useState<boolean>(false);
  const [refCode, setRefCode] = useState<string>('');
  const [refLang, setRefLang] = useState<CodeLanguage>('cpp');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Execution Configuration (TLE & File I/O vs Standard I/O)
  const [cfgTimeLimitEnabled, setCfgTimeLimitEnabled] = useState<boolean>(true);
  const [cfgTimeLimitSec, setCfgTimeLimitSec] = useState<string>('1.0');
  const [cfgIoMode, setCfgIoMode] = useState<ProblemIOMode>('standard');
  const [cfgInputFileName, setCfgInputFileName] = useState<string>('INPUT.INP');
  const [cfgOutputFileName, setCfgOutputFileName] = useState<string>('OUTPUT.OUT');
  const [userTouchedExecConfig, setUserTouchedExecConfig] = useState<boolean>(false);

  // Sublime Editor State
  const [selectedLang, setSelectedLang] = useState<CodeLanguage>('cpp');
  const [cppCode, setCppCode] = useState<string>(DEFAULT_CLEAN_CPP);
  const [pyCode, setPyCode] = useState<string>(DEFAULT_CLEAN_PYTHON);
  const [customInput, setCustomInput] = useState<string>('');
  const [activeFile, setActiveFile] = useState<'main.cpp' | 'solution.py' | 'input.txt'>('main.cpp');

  // Layout & Fullscreen
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(true);
  const [consoleTab, setConsoleTab] = useState<'output' | 'judge'>('output');
  const [mobilePane, setMobilePane] = useState<'problem' | 'editor' | 'console'>('editor');
  const [fontSize, setFontSize] = useState<number>(14);
  const [saveFlash, setSaveFlash] = useState<boolean>(false);

  // Inline test editor in sidebar
  const [editingTestId, setEditingTestId] = useState<number | null>(null);
  const [editTestInput, setEditTestInput] = useState<string>('');
  const [editTestOutput, setEditTestOutput] = useState<string>('');
  const [editTestTier, setEditTestTier] = useState<TestDifficultyTier>('Trung bình');
  const [editTestTimeMode, setEditTestTimeMode] = useState<'inherit' | 'unlimited' | 'custom'>('inherit');
  const [editTestTimeMs, setEditTestTimeMs] = useState<string>('1000');

  // Runner & Judge State
  const [customOutput, setCustomOutput] = useState<string>('');
  const [customStderr, setCustomStderr] = useState<string>('');
  const [customRuntimeMs, setCustomRuntimeMs] = useState<number | null>(null);
  const [isRunningCustom, setIsRunningCustom] = useState<boolean>(false);

  const [isJudging, setIsJudging] = useState<boolean>(false);
  const [judgeResults, setJudgeResults] = useState<TestResult[] | null>(null);
  const [judgeScore, setJudgeScore] = useState<number | null>(null);
  const [judgeVerdict, setJudgeVerdict] = useState<string | null>(null);
  const [mistakeAnalysis, setMistakeAnalysis] = useState<CodeMistakeAnalysis | null>(null);
  const [isAnalyzingMistake, setIsAnalyzingMistake] = useState<boolean>(false);
  const resultSectionRef = useRef<HTMLDivElement | null>(null);

  // Escape exits fullscreen cleanly
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === 'F11') {
        e.preventDefault();
        setIsFullscreen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  const activeEditorValue =
    activeFile === 'main.cpp' ? cppCode : activeFile === 'solution.py' ? pyCode : customInput;

  const handleEditorChange = (val: string) => {
    if (activeFile === 'main.cpp') setCppCode(val);
    else if (activeFile === 'solution.py') setPyCode(val);
    else setCustomInput(val);
  };

  const handleSelectTab = (tabId: string) => {
    const file = tabId as 'main.cpp' | 'solution.py' | 'input.txt';
    setActiveFile(file);
    if (file === 'main.cpp') setSelectedLang('cpp');
    else if (file === 'solution.py') setSelectedLang('python');
  };

  const editorTabs: SublimeTabItem[] = useMemo(
    () => [
      { id: 'main.cpp', label: 'main.cpp', language: 'cpp', dirty: cppCode !== DEFAULT_CLEAN_CPP },
      { id: 'solution.py', label: 'solution.py', language: 'python', dirty: pyCode !== DEFAULT_CLEAN_PYTHON },
      { id: 'input.txt', label: 'input.txt', language: 'text', dirty: Boolean(customInput) }
    ],
    [cppCode, pyCode, customInput]
  );

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setUploadedMimeType(file.type || 'image/png');
    const reader = new FileReader();
    reader.onload = () => setUploadedImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Paste screenshot (Ctrl+V) inside Sublime Upload Modal
  useEffect(() => {
    if (!showUploadModal) return;
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            setInputMode('image');
            setUploadedFileName(file.name || 'pasted-problem.png');
            setUploadedMimeType(file.type || 'image/png');
            const reader = new FileReader();
            reader.onload = () => setUploadedImagePreview(reader.result as string);
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [showUploadModal]);

  const applyAutoDetectedExecConfig = (text: string) => {
    if (userTouchedExecConfig) return;
    const detected = detectProblemExecutionConfig(text);
    setCfgTimeLimitEnabled(detected.timeLimitEnabled);
    if (detected.timeLimitMs !== null) {
      const sec = detected.timeLimitMs / 1000;
      setCfgTimeLimitSec(Number.isInteger(sec) ? sec.toFixed(1) : String(sec));
    }
    setCfgIoMode(detected.ioMode);
    setCfgInputFileName(detected.inputFileName);
    setCfgOutputFileName(detected.outputFileName);
  };

  // Text/Code File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      setRawText(text);
      applyAutoDetectedExecConfig(text);
      const parsed = extractSamplesFromText(text);
      if (parsed.length > 0) setUserSamples(parsed);
    };
    reader.readAsText(file);
  };

  const handleAutoExtractSamples = () => {
    const extracted = extractSamplesFromText(rawText);
    if (extracted.length > 0) {
      setUserSamples(extracted);
    }
  };

  // Analyze problem + generate verified test suite
  const handleAnalyzeProblem = async () => {
    const validSamples = userSamples.filter(
      (s) => s.input.trim().length > 0 || s.expectedOutput.trim().length > 0
    );

    if (!rawText.trim() && !uploadedImagePreview && validSamples.length === 0) {
      setAnalysisError('Vui lòng nhập đề bài, tải ảnh đề, hoặc nhập ít nhất 1 test mẫu.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const configuredTlMs = getTimeLimitMsFromInput(cfgTimeLimitEnabled, cfgTimeLimitSec);
      const result = await analyzeProblemAndGenerateTests({
        text: rawText.trim(),
        imageBase64: uploadedImagePreview,
        mimeType: uploadedMimeType,
        fileName: uploadedFileName,
        userSamples: validSamples,
        referenceCode: showRefCodeBox && refCode.trim() ? refCode : undefined,
        referenceLang: refLang,
        timeLimitEnabled: cfgTimeLimitEnabled,
        timeLimitMs: configuredTlMs,
        ioMode: cfgIoMode,
        inputFileName: cfgIoMode === 'file' ? cfgInputFileName.trim() || 'INPUT.INP' : '',
        outputFileName: cfgIoMode === 'file' ? cfgOutputFileName.trim() || 'OUTPUT.OUT' : '',
        userConfiguredExecution: userTouchedExecConfig
      });

      setProblem(result.problem);
      setDiagnosticNote(result.diagnosticNote);
      setAnalysisSource(result.source);

      // Sync UI config with resolved problem config
      setCfgTimeLimitEnabled(result.problem.timeLimitEnabled ?? true);
      if (result.problem.timeLimitMs !== null && result.problem.timeLimitMs !== undefined) {
        const s = result.problem.timeLimitMs / 1000;
        setCfgTimeLimitSec(Number.isInteger(s) ? s.toFixed(1) : String(s));
      }
      setCfgIoMode(result.problem.ioMode || 'standard');
      if (result.problem.inputFileName) setCfgInputFileName(result.problem.inputFileName);
      if (result.problem.outputFileName) setCfgOutputFileName(result.problem.outputFileName);

      const firstIn = result.problem.sampleCases[0]?.input || result.problem.hiddenCases[0]?.input || '';
      setCustomInput(firstIn);
      setCustomOutput('');
      setCustomStderr('');
      setJudgeResults(null);
      setJudgeScore(null);
      setJudgeVerdict(null);
      setMistakeAnalysis(null);
      setShowUploadModal(false);
      setIsSidebarOpen(true);
      setMobilePane('problem');
    } catch (err: any) {
      setAnalysisError(err?.message || 'Không thể phân tích đề bài. Vui lòng thử lại.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load quick demo example into modal so user can test immediately
  const loadDemoToModal = () => {
    const demoText =
      `Tìm tổng đoạn con liên tiếp lớn nhất (Maximum Subarray Sum)\nCho mảng gồm N số nguyên a[1], a[2], ..., a[N]. Hãy tìm tổng lớn nhất của một đoạn con liên tiếp khác rỗng.\nInput:\nDòng 1: Số nguyên N (1 <= N <= 10^5).\nDòng 2: N số nguyên.\nOutput:\nMột số nguyên duy nhất là tổng lớn nhất.`;
    setInputMode('text');
    setRawText(demoText);
    setUserTouchedExecConfig(false);
    setCfgTimeLimitEnabled(true);
    setCfgTimeLimitSec('1.0');
    setCfgIoMode('standard');
    setUserSamples([
      { input: '8\n-2 -3 4 -1 -2 1 5 -3', expectedOutput: '7' },
      { input: '5\n-1 -2 -3 -4 -5', expectedOutput: '-1' }
    ]);
  };

  // Run Custom Input
  const handleRunCustom = async () => {
    setIsRunningCustom(true);
    setIsConsoleOpen(true);
    setConsoleTab('output');
    setMobilePane('console');
    setCustomOutput('');
    setCustomStderr('');

    const langToRun: CodeLanguage = activeFile === 'solution.py' ? 'python' : selectedLang;
    const codeToRun = langToRun === 'python' ? pyCode : cppCode;

    const tlEnabled = problem ? problem.timeLimitEnabled ?? true : cfgTimeLimitEnabled;
    const tlMs = problem
      ? problem.timeLimitMs !== undefined
        ? problem.timeLimitMs
        : parseTimeLimitMs(problem.timeLimit)
      : getTimeLimitMsFromInput(cfgTimeLimitEnabled, cfgTimeLimitSec);

    const res = await executeCode(problem?.id || 'CUSTOM', langToRun, codeToRun, customInput, {
      ioMode: problem?.ioMode || cfgIoMode || 'standard',
      inputFileName: problem?.inputFileName || cfgInputFileName,
      outputFileName: problem?.outputFileName || cfgOutputFileName,
      timeLimitEnabled: tlEnabled,
      timeLimitMs: tlMs,
      problemDesc: problem?.description
    });
    setIsRunningCustom(false);
    setCustomOutput(res.stdout);
    setCustomStderr(res.stderr);
    setCustomRuntimeMs(res.runtimeMs);
  };

  const runMistakeAnalysis = async (
    targetProblem: CodingProblem,
    langToAnalyze: CodeLanguage,
    codeToAnalyze: string,
    finalScore: number,
    results: TestResult[]
  ) => {
    setIsAnalyzingMistake(true);
    const failed = results
      .map((r, i) => ({ ...r, testNumber: i + 1 }))
      .filter((r) => !r.passed)
      .map((r) => ({
        index: r.testNumber,
        input: r.input,
        expected: r.expected,
        actual: r.actual,
        status: r.status
      }));

    try {
      const analysisRes = await analyzeCodeMistakeWithAI({
        problemTitle: targetProblem.title,
        problemDescription: targetProblem.description,
        inputFormat: targetProblem.inputFormat,
        outputFormat: targetProblem.outputFormat,
        language: langToAnalyze,
        userCode: codeToAnalyze,
        score: finalScore,
        failedTests: failed
      });
      setMistakeAnalysis(analysisRes);
    } finally {
      setIsAnalyzingMistake(false);
    }
  };

  // Judge All Test Cases
  const handleJudgeAll = async () => {
    if (!problem) return;
    const allCases = [...problem.sampleCases, ...problem.hiddenCases];
    if (allCases.length === 0) {
      setIsConsoleOpen(true);
      setConsoleTab('judge');
      return;
    }

    setIsJudging(true);
    setIsConsoleOpen(true);
    setConsoleTab('judge');
    setMobilePane('console');
    setJudgeResults(null);
    setMistakeAnalysis(null);

    const langToRun: CodeLanguage = activeFile === 'solution.py' ? 'python' : selectedLang;
    const codeToRun = langToRun === 'python' ? pyCode : cppCode;

    const judgeRes = await judgeProblem(problem, langToRun, codeToRun);

    setIsJudging(false);
    setJudgeResults(judgeRes.results);
    setJudgeScore(judgeRes.score);
    setJudgeVerdict(judgeRes.verdict);

    if (judgeRes.score === 100 && allCases.length > 0) {
      confetti({ particleCount: 95, spread: 75, origin: { y: 0.6 } });
      onScoreEarned?.(120);
    } else if (judgeRes.score > 0) {
      onScoreEarned?.(Math.floor(judgeRes.score * 0.5));
    }

    if (!isFullscreen) {
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 120);
    }

    void runMistakeAnalysis(problem, langToRun, codeToRun, judgeRes.score, judgeRes.results);
  };

  // Sidebar Test Case CRUD
  const handleAddCustomTest = () => {
    if (!problem) return;
    const newId = Date.now();
    const currentHiddenCount = problem.hiddenCases.length;
    const autoTier: TestDifficultyTier =
      currentHiddenCount === 0
        ? 'Cơ bản'
        : currentHiddenCount === 1
        ? 'Trung bình'
        : currentHiddenCount === 2
        ? 'Nâng cao'
        : 'Thử thách';
    const newTc: TestCase = {
      id: newId,
      input: customInput || '1\n0',
      expectedOutput: customOutput.trim() || '0',
      isSample: false,
      difficulty: autoTier
    };
    setProblem({
      ...problem,
      hiddenCases: [...problem.hiddenCases, newTc]
    });
    setEditingTestId(newId);
    setEditTestInput(newTc.input);
    setEditTestOutput(newTc.expectedOutput);
    setEditTestTier(autoTier);
    setEditTestTimeMode('inherit');
    setEditTestTimeMs(String(problem.timeLimitMs ?? 1000));
  };

  const handleSaveEditedTest = (testId: number) => {
    if (!problem) return;
    const patchTimeFields = (): Partial<TestCase> => {
      if (editTestTimeMode === 'inherit') {
        return { timeLimitEnabled: undefined, timeLimitMs: undefined };
      }
      if (editTestTimeMode === 'unlimited') {
        return { timeLimitEnabled: false, timeLimitMs: null };
      }
      const parsedMs = Math.max(50, Math.round(Number(editTestTimeMs) || 1000));
      return { timeLimitEnabled: true, timeLimitMs: parsedMs };
    };
    const timePatch = patchTimeFields();

    const updateList = (list: TestCase[]) =>
      list.map((tc) =>
        tc.id === testId
          ? {
              ...tc,
              input: editTestInput,
              expectedOutput: editTestOutput,
              difficulty: editTestTier,
              ...timePatch
            }
          : tc
      );
    setProblem({
      ...problem,
      sampleCases: updateList(problem.sampleCases),
      hiddenCases: updateList(problem.hiddenCases)
    });
    setEditingTestId(null);
  };

  const handleDeleteTest = (testId: number) => {
    if (!problem) return;
    setProblem({
      ...problem,
      sampleCases: problem.sampleCases.filter((t) => t.id !== testId),
      hiddenCases: problem.hiddenCases.filter((t) => t.id !== testId)
    });
  };

  const allTests = problem ? [...problem.sampleCases, ...problem.hiddenCases] : [];

  const createCustomBlankProblem = (samples?: UserSamplePair[]): CodingProblem => {
    const validSamples = (samples || []).filter(
      (s) => s.input.trim().length > 0 || s.expectedOutput.trim().length > 0
    );
    const finalSamples: TestCase[] =
      validSamples.length > 0
        ? validSamples.map((s, idx) => ({
            id: idx + 1,
            input: s.input,
            expectedOutput: s.expectedOutput,
            isSample: true
          }))
        : [
            {
              id: Date.now(),
              input: '2 3',
              expectedOutput: '5',
              isSample: true
            }
          ];

    const tlEnabled = cfgTimeLimitEnabled;
    const tlMs = getTimeLimitMsFromInput(tlEnabled, cfgTimeLimitSec);
    const tlLabel = formatMsLabel(tlEnabled, tlMs, uiLang === 'en');
    const inFile = cfgIoMode === 'file' ? cfgInputFileName.trim() || 'INPUT.INP' : '';
    const outFile = cfgIoMode === 'file' ? cfgOutputFileName.trim() || 'OUTPUT.OUT' : '';
    const firstLine = rawText.trim().split('\n')[0]?.trim();

    return {
      id: 'CUSTOM_FREE_' + Date.now(),
      title: firstLine ? firstLine.slice(0, 80) : 'Đề Tự Tạo & Bộ Test Tùy Chỉnh',
      category: 'Tự tạo',
      difficulty: 'Medium',
      timeLimit: tlLabel,
      timeLimitEnabled: tlEnabled,
      timeLimitMs: tlMs,
      ioMode: cfgIoMode,
      inputFileName: inFile,
      outputFileName: outFile,
      memoryLimit: '256MB',
      description:
        rawText.trim() ||
        'Bài tập tự do. Bạn có thể bấm "Thêm test" hoặc biểu tượng Sửa ở cột bên trái để tự tạo bộ test chấm bài, hoặc bấm "Đổi đề" để AI sinh bộ test ẩn.',
      inputFormat:
        cfgIoMode === 'file' ? `Đọc dữ liệu từ file ${inFile}.` : 'Đọc dữ liệu chuẩn (stdin).',
      outputFormat:
        cfgIoMode === 'file' ? `Ghi kết quả ra file ${outFile}.` : 'In kết quả chuẩn (stdout).',
      constraints: [
        tlEnabled && tlMs ? `Thời gian: ${tlLabel} (${tlMs}ms)` : 'Thời gian: Không giới hạn (No TLE)',
        cfgIoMode === 'file' ? `Đọc/Ghi File: ${inFile} → ${outFile}` : 'Đọc/Ghi Chuẩn: stdin / stdout',
        'Bộ nhớ: 256MB'
      ],
      sampleCases: finalSamples,
      hiddenCases: [],
      cppTemplate: DEFAULT_CLEAN_CPP,
      pythonTemplate: DEFAULT_CLEAN_PYTHON
    };
  };

  const handleDismissModal = () => {
    if (!problem) {
      const fallbackProblem = createCustomBlankProblem(userSamples);
      setProblem(fallbackProblem);
      setAnalysisSource('template');
      setDiagnosticNote('Đã khởi tạo đề & bộ test tự tạo — bạn có thể thêm/sửa test bên trái rồi bấm Nộp Chấm.');
      if (fallbackProblem.sampleCases[0]?.input) {
        setCustomInput(fallbackProblem.sampleCases[0].input);
      }
    }
    setShowUploadModal(false);
  };

  const isDarkIDE = isFullscreen;

  return (
    <>
      {/* MODAL: PROBLEM UPLOAD & TEST SUITE ANALYZER */}
      <ViewportPortal active={showUploadModal}>
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[110] bg-slate-950/75 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto"
              onClick={handleDismissModal}
            >
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.975 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                className="syn-conic-border max-w-2xl w-full my-auto shadow-[0_24px_64px_-16px_rgba(2,132,199,0.45)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="syn-conic-border-spin" aria-hidden="true" />
                <div className="relative z-10 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[5px] text-slate-900 dark:text-slate-100 flex flex-col max-h-[90dvh] overflow-hidden sci-frame">
                  {/* STICKY MODAL HEADER — single row guaranteed, never wraps [X] */}
                  <div className="syn-top-laser bg-slate-50 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (!problem && onBack) {
                            setShowUploadModal(false);
                            onBack();
                          } else {
                            setShowUploadModal(false);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-[4px] bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-sky-500 text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 shrink-0 whitespace-nowrap transition-colors"
                        title={uiLang === 'en' ? 'Back' : 'Quay lại'}
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{uiLang === 'en' ? 'Back' : 'Quay lại'}</span>
                      </button>
                      <div className="w-9 h-9 rounded-[4px] bg-sky-500/15 border border-sky-500/35 text-sky-600 dark:text-sky-400 hidden sm:flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 icon-anim-star" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                          {uiLang === 'en'
                            ? 'Submit Problem & Generate Test Suite'
                            : 'Gửi Đề Bài & Bộ Test Mẫu'}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {uiLang === 'en'
                            ? 'Paste statement, upload image/file, and attach sample Input/Output pairs.'
                            : 'Dán đề bài hoặc tải ảnh/file, kèm test mẫu để hệ thống phân tích và sinh bộ test chuẩn xác.'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDismissModal}
                      className="w-8 h-8 rounded-[4px] bg-white dark:bg-slate-950 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-300 dark:border-slate-700 hover:border-rose-500/60 text-slate-500 dark:text-slate-400 hover:text-rose-500 flex items-center justify-center shrink-0 transition-colors"
                      aria-label={uiLang === 'en' ? 'Close' : 'Đóng'}
                      title={uiLang === 'en' ? 'Close dialog & open free editor' : 'Đóng hộp thoại để code tự do'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* SCROLLABLE BODY (never clips bottom CTAs) */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
                    {/* Input Mode Tabs */}
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-[5px] border border-slate-200 dark:border-slate-800">
                      {[
                        { id: 'text' as const, icon: Code2, label: uiLang === 'en' ? '1. Paste Statement' : '1. Nhập / Dán đề' },
                        { id: 'image' as const, icon: ImageIcon, label: uiLang === 'en' ? '2. Problem Image' : '2. Ảnh chụp đề' },
                        { id: 'file' as const, icon: FileText, label: uiLang === 'en' ? '3. Upload (.txt)' : '3. Tải file (.txt)' }
                      ].map((m) => {
                        const Icon = m.icon;
                        const active = inputMode === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setInputMode(m.id)}
                            className={`relative py-2 px-2 text-xs font-bold rounded-[4px] flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                              active
                                ? 'text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="sublime-upload-tab-active"
                                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 z-0 shadow-sm"
                              />
                            )}
                            <Icon className="relative z-10 w-3.5 h-3.5 shrink-0" />
                            <span className="relative z-10 truncate">{m.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Mode Content */}
                    {inputMode === 'text' && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-xs font-bold text-sky-700 dark:text-sky-400">
                            {uiLang === 'en'
                              ? 'Problem Statement (Title, Description, Input/Output):'
                              : 'Nội dung đề bài (Tiêu đề, Mô tả, Input/Output):'}
                          </label>
                          <div className="flex items-center gap-1.5">
                            <VoiceMicButton
                              language={uiLang}
                              size="sm"
                              showLabel={true}
                              onTranscript={(spoken) =>
                                setRawText((prev) => (prev.trim() ? `${prev.trim()} ${spoken}` : spoken))
                              }
                            />
                            <button
                              type="button"
                              onClick={loadDemoToModal}
                              className="text-[11px] px-2.5 py-1 rounded-[4px] bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-amber-700 dark:text-amber-300 font-semibold cursor-pointer whitespace-nowrap"
                            >
                              {uiLang === 'en' ? 'Load Demo' : 'Nạp ví dụ mẫu'}
                            </button>
                            {rawText.trim() && (
                              <button
                                type="button"
                                onClick={handleAutoExtractSamples}
                                className="text-[11px] px-2.5 py-1 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-semibold cursor-pointer whitespace-nowrap"
                              >
                                {uiLang === 'en' ? 'Extract Samples' : 'Tự tách Sample từ đề'}
                              </button>
                            )}
                          </div>
                        </div>
                        <textarea
                          value={rawText}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRawText(val);
                            applyAutoDetectedExecConfig(val);
                          }}
                          placeholder={
                            uiLang === 'en'
                              ? 'Example: Given an array of N integers... (Supports Ctrl+V image paste or Voice)'
                              : 'Ví dụ: Cho mảng gồm N số nguyên... (Hỗ trợ Ctrl+V dán ảnh đề hoặc bấm Giọng nói)'
                          }
                          rows={4}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[4px] font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
                        />
                      </div>
                    )}

                    {inputMode === 'image' && (
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 rounded-[5px] p-6 text-center bg-slate-50 dark:bg-slate-900/70 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="sublime-image-upload"
                          />
                          <label htmlFor="sublime-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <ImageIcon className="w-8 h-8 text-sky-500" />
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                              {uiLang === 'en'
                                ? 'Select problem screenshot (PNG, JPG, WEBP) or Ctrl+V'
                                : 'Chọn ảnh chụp đề bài (PNG, JPG, WEBP) hoặc dán Ctrl+V'}
                            </p>
                          </label>
                        </div>
                        {uploadedImagePreview && (
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-[4px] border border-slate-300 dark:border-slate-700 flex items-center gap-3">
                            <img
                              src={uploadedImagePreview}
                              alt="Uploaded problem"
                              className="w-14 h-14 object-cover rounded-[4px] border border-slate-300 dark:border-slate-700"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                {uiLang === 'en' ? 'Problem image loaded' : 'Đã tải ảnh đề bài'}
                              </div>
                              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">{uploadedFileName}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {inputMode === 'file' && (
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 rounded-[5px] p-6 text-center bg-slate-50 dark:bg-slate-900/70 transition-colors">
                          <input
                            type="file"
                            accept=".txt,.md,.cpp,.py"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="sublime-file-upload"
                          />
                          <label htmlFor="sublime-file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <FileText className="w-8 h-8 text-sky-500" />
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                              {uiLang === 'en'
                                ? 'Choose problem text file (.txt, .md)'
                                : 'Chọn tệp văn bản đề bài (.txt, .md)'}
                            </p>
                          </label>
                        </div>
                        {rawText && (
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-[4px] border border-slate-300 dark:border-slate-700 text-[11px] font-mono text-slate-800 dark:text-slate-200 max-h-28 overflow-y-auto whitespace-pre-wrap">
                            {rawText}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Dynamic Sample Test Pairs */}
                    <div className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {uiLang === 'en'
                            ? `Sample Test Cases (${userSamples.length}) — For accurate verification & hidden test generation:`
                            : `Bộ Test Mẫu Kèm Theo (${userSamples.length}) — Giúp đối chiếu & sinh test ẩn chính xác:`}
                        </span>
                        <button
                          type="button"
                          onClick={() => setUserSamples([...userSamples, { input: '', expectedOutput: '' }])}
                          className="px-2.5 py-1 rounded-[4px] bg-slate-100 dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-300 dark:border-slate-700 hover:border-sky-500 text-[11px] text-sky-700 dark:text-sky-400 flex items-center gap-1 font-bold shrink-0 whitespace-nowrap"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{uiLang === 'en' ? 'Add test' : 'Thêm test'}</span>
                        </button>
                      </div>

                      <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                        {userSamples.map((sp, idx) => (
                          <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2.5 rounded-[4px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <div className="sm:col-span-6">
                              <div className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                Input #{idx + 1}
                              </div>
                              <textarea
                                value={sp.input}
                                onChange={(e) => {
                                  const next = [...userSamples];
                                  next[idx] = { ...next[idx], input: e.target.value };
                                  setUserSamples(next);
                                }}
                                rows={2}
                                placeholder="Ví dụ: 5&#10;1 2 3 4 5"
                                className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] font-mono text-[11px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
                              />
                            </div>
                            <div className="sm:col-span-5">
                              <div className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                {uiLang === 'en' ? `Expected Output #${idx + 1}` : `Output mong đợi #${idx + 1}`}
                              </div>
                              <textarea
                                value={sp.expectedOutput}
                                onChange={(e) => {
                                  const next = [...userSamples];
                                  next[idx] = { ...next[idx], expectedOutput: e.target.value };
                                  setUserSamples(next);
                                }}
                                rows={2}
                                placeholder="Ví dụ: 15"
                                className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] font-mono text-[11px] text-emerald-700 dark:text-emerald-400 focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="sm:col-span-1 flex items-end justify-end">
                              {userSamples.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setUserSamples(userSamples.filter((_, i) => i !== idx))}
                                  className="p-2 rounded-[4px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500"
                                  title={uiLang === 'en' ? 'Remove test' : 'Xóa test này'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Execution Configuration: Time Limit (TLE) & File I/O vs Standard I/O */}
                    <div className="p-3 rounded-[4px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-sky-500" />
                          {uiLang === 'en'
                            ? 'Execution Settings (Time Limit TLE & File I/O)'
                            : 'Cấu hình Thực Thi (Giới hạn TLE & Đọc/Ghi File)'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {cfgTimeLimitEnabled
                            ? `${getTimeLimitMsFromInput(true, cfgTimeLimitSec)}ms`
                            : uiLang === 'en'
                            ? 'Unlimited'
                            : 'Không giới hạn'}
                          {' · '}
                          {cfgIoMode === 'file' ? 'File I/O' : 'Stdin/Stdout'}
                        </span>
                      </div>

                      {/* Time Limit Toggle + Duration */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            {uiLang === 'en' ? 'Time Limit (TLE):' : 'Giới hạn thời gian chạy:'}
                          </span>
                          <div className="grid grid-cols-2 gap-1 p-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[4px]">
                            <button
                              type="button"
                              onClick={() => {
                                setUserTouchedExecConfig(true);
                                setCfgTimeLimitEnabled(true);
                              }}
                              className={`px-2.5 py-1 rounded-[3px] text-[11px] font-bold transition-colors ${
                                cfgTimeLimitEnabled
                                  ? 'bg-sky-600 text-white'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              {uiLang === 'en' ? 'Limited (TLE)' : 'Có giới hạn (TLE)'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setUserTouchedExecConfig(true);
                                setCfgTimeLimitEnabled(false);
                              }}
                              className={`px-2.5 py-1 rounded-[3px] text-[11px] font-bold transition-colors ${
                                !cfgTimeLimitEnabled
                                  ? 'bg-emerald-600 text-white'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              {uiLang === 'en' ? 'No Time Limit' : 'Không giới hạn'}
                            </button>
                          </div>
                        </div>

                        {cfgTimeLimitEnabled ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {['0.5', '1.0', '2.0', '3.0', '5.0'].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => {
                                  setUserTouchedExecConfig(true);
                                  setCfgTimeLimitSec(preset);
                                }}
                                className={`px-2 py-1 rounded-[4px] font-mono text-[11px] border transition-colors ${
                                  Number(cfgTimeLimitSec) === Number(preset)
                                    ? 'bg-sky-600 border-sky-500 text-white font-bold'
                                    : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-400'
                                }`}
                              >
                                {preset}s
                              </button>
                            ))}
                            <div className="flex items-center gap-1 ml-auto">
                              <input
                                type="number"
                                min="0.05"
                                max="60"
                                step="0.1"
                                value={cfgTimeLimitSec}
                                onChange={(e) => {
                                  setUserTouchedExecConfig(true);
                                  setCfgTimeLimitSec(e.target.value);
                                }}
                                className="w-16 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] font-mono text-[11px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
                              />
                              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                {uiLang === 'en' ? 'sec' : 'giây'} ({getTimeLimitMsFromInput(true, cfgTimeLimitSec)}ms)
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1.5 rounded-[4px]">
                            {uiLang === 'en'
                              ? 'Time limit disabled: programs run without TLE interruption (up to 50M safety steps).'
                              : 'Đã tắt giới hạn TLE: code chạy tự do không bị ngắt thời gian (chỉ bảo vệ chống treo trình duyệt ở 50 triệu bước).'}
                          </div>
                        )}
                      </div>

                      {/* I/O Mode Toggle + Filenames */}
                      <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            {uiLang === 'en' ? 'I/O Mode:' : 'Chế độ Đọc / Ghi dữ liệu:'}
                          </span>
                          <div className="grid grid-cols-2 gap-1 p-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[4px]">
                            <button
                              type="button"
                              onClick={() => {
                                setUserTouchedExecConfig(true);
                                setCfgIoMode('standard');
                              }}
                              className={`px-2.5 py-1 rounded-[3px] text-[11px] font-bold transition-colors ${
                                cfgIoMode === 'standard'
                                  ? 'bg-sky-600 text-white'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              {uiLang === 'en' ? 'Standard (stdin/stdout)' : 'Chuẩn (stdin / stdout)'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setUserTouchedExecConfig(true);
                                setCfgIoMode('file');
                              }}
                              className={`px-2.5 py-1 rounded-[3px] text-[11px] font-bold transition-colors ${
                                cfgIoMode === 'file'
                                  ? 'bg-amber-600 text-white'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              {uiLang === 'en' ? 'File I/O (.INP/.OUT)' : 'Đọc/Ghi File (.INP/.OUT)'}
                            </button>
                          </div>
                        </div>

                        {cfgIoMode === 'file' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                                {uiLang === 'en' ? 'Input filename:' : 'Tên File Input:'}
                              </label>
                              <input
                                type="text"
                                value={cfgInputFileName}
                                onChange={(e) => {
                                  setUserTouchedExecConfig(true);
                                  setCfgInputFileName(e.target.value);
                                }}
                                placeholder="BAI1.INP"
                                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                                {uiLang === 'en' ? 'Output filename:' : 'Tên File Output:'}
                              </label>
                              <input
                                type="text"
                                value={cfgOutputFileName}
                                onChange={(e) => {
                                  setUserTouchedExecConfig(true);
                                  setCfgOutputFileName(e.target.value);
                                }}
                                placeholder="BAI1.OUT"
                                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] font-mono text-xs text-emerald-700 dark:text-emerald-400 focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <p className="sm:col-span-2 text-[10px] font-mono text-amber-700 dark:text-amber-300">
                              {uiLang === 'en'
                                ? `Enforces freopen / ifstream / ofstream / open("${cfgInputFileName || 'INPUT.INP'}") & "${cfgOutputFileName || 'OUTPUT.OUT'}" (standard cin/cout without file open will report an error).`
                                : `Bắt buộc mở đúng file qua freopen / ifstream / ofstream / fopen / open("${cfgInputFileName || 'INPUT.INP'}") & "${cfgOutputFileName || 'OUTPUT.OUT'}" — code chỉ dùng cin/cout thường sẽ báo lỗi ngay.`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Optional Reference AC Code Oracle */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowRefCodeBox(!showRefCodeBox)}
                        className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                      >
                        <span>
                          {showRefCodeBox
                            ? '▼ Ẩn code AC tham khảo'
                            : '+ Đính kèm Code AC chuẩn (tùy chọn để tự sinh thêm test ẩn)'}
                        </span>
                      </button>
                      {showRefCodeBox && (
                        <div className="mt-2 p-3 rounded-[4px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">Ngôn ngữ code tham khảo:</span>
                            <div className="flex gap-1">
                              {(['cpp', 'python'] as const).map((lg) => (
                                <button
                                  key={lg}
                                  type="button"
                                  onClick={() => setRefLang(lg)}
                                  className={`px-2.5 py-0.5 rounded-[4px] text-[11px] font-mono border ${
                                    refLang === lg
                                      ? 'bg-sky-600 border-sky-500 text-white font-bold'
                                      : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                                  }`}
                                >
                                  {lg === 'cpp' ? 'C++' : 'Python'}
                                </button>
                              ))}
                            </div>
                          </div>
                          <textarea
                            value={refCode}
                            onChange={(e) => setRefCode(e.target.value)}
                            rows={4}
                            placeholder="Dán code AC dùng để chạy sinh output cho bộ test ẩn (nếu có)..."
                            className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] font-mono text-[11px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      )}
                    </div>

                    {analysisError && (
                      <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700/60 rounded-[4px] text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{analysisError}</span>
                      </div>
                    )}
                  </div>

                  {/* PINNED FOOTER — always visible, crisp square buttons */}
                  <div className="bg-slate-50 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono min-w-0">
                      <span
                        className={`syn-live-square shrink-0 ${
                          isAnalyzing ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
                      />
                      <span className="truncate">
                        {isAnalyzing
                          ? uiLang === 'en'
                            ? 'Analyzing & generating test suite...'
                            : 'Đang phân tích đề bài & sinh bộ test...'
                          : uiLang === 'en'
                          ? 'Skip to enter free coding & custom test mode'
                          : 'Hoặc vào thẳng trình soạn thảo code tự do'}
                      </span>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 justify-end shrink-0">
                      <button
                        type="button"
                        onClick={handleDismissModal}
                        className="px-3.5 py-2 rounded-[4px] bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs transition-colors whitespace-nowrap"
                      >
                        {uiLang === 'en' ? 'Free Coding Mode' : 'Vào Code & Tạo Test Tự Do'}
                      </button>
                      <button
                        type="button"
                        onClick={handleAnalyzeProblem}
                        disabled={isAnalyzing}
                        className="cs-deck-btn sheen-btn px-4.5 py-2 rounded-[4px] bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_8px_22px_-6px_rgba(2,132,199,0.55)] transition-all disabled:opacity-50 whitespace-nowrap"
                      >
                        <Sparkles className="w-4 h-4 icon-anim-star" />
                        <span>
                          {isAnalyzing
                            ? uiLang === 'en'
                              ? 'Analyzing...'
                              : 'Đang phân tích...'
                            : uiLang === 'en'
                            ? 'Analyze & Generate Tests'
                            : 'Phân tích Đề & Sinh Bộ Test'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ViewportPortal>

      {/* MAIN IDE WORKSPACE (Portaled cleanly to document.body when Fullscreen) */}
      <ViewportPortal active={isFullscreen}>
        <div
          className={
            isFullscreen
              ? 'fixed inset-0 z-[100] w-screen h-[100dvh] bg-slate-950 text-slate-100 flex flex-col overflow-hidden'
              : 'relative space-y-4 pb-20'
          }
        >
          {/* Save Notification Toast */}
          {saveFlash && (
            <div className="fixed top-5 right-5 z-[120] px-4 py-2 bg-emerald-600 text-white font-mono text-xs font-bold rounded-[4px] border border-emerald-400 shadow-2xl flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Saved {activeFile} (Ctrl+S)</span>
            </div>
          )}

          {/* FULLSCREEN TOP BAR WITH BACK & PANE TOGGLES */}
          {isFullscreen && (
            <div className="syn-top-laser bg-slate-950 border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {onBack && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsFullscreen(false);
                      onBack();
                    }}
                    className="px-2.5 py-1.5 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{uiLang === 'en' ? 'Back' : 'Quay lại'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="px-2.5 py-1.5 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-sky-500/40 text-sky-400 text-xs font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-colors"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>{uiLang === 'en' ? 'Exit (Esc)' : 'Thu nhỏ (Esc)'}</span>
                </button>
                <span className="text-xs font-bold text-white truncate hidden sm:inline">
                  {problem ? problem.title : 'Sublime Text 4 Studio — Code Tự Do'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="px-2.5 py-1.5 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1 whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{uiLang === 'en' ? 'Change Problem' : 'Đổi đề'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen((p) => !p)}
                  className="hidden md:inline-flex px-2.5 py-1.5 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap"
                >
                  {isSidebarOpen ? 'Ẩn đề' : 'Hiện đề'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConsoleOpen((p) => !p)}
                  className="hidden md:inline-flex px-2.5 py-1.5 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap"
                >
                  {isConsoleOpen ? 'Ẩn Console' : 'Hiện Console'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="p-1.5 rounded-[4px] bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25"
                  title="Thoát toàn màn hình (Esc)"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TOP COMPACT BAR (Normal mode — Synapse architectural style, zero static pills) */}
          {!isFullscreen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="sci-frame sci-scan-bar bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md p-3.5 sm:p-4 text-slate-900 dark:text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5 text-[11px]">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="px-2.5 py-1 rounded-[4px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-sky-700 dark:text-sky-400 text-[11px] font-bold flex items-center gap-1 shrink-0 whitespace-nowrap transition-colors"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>{uiLang === 'en' ? 'Back' : 'Quay lại'}</span>
                    </button>
                  )}
                  <span className="inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    <span className="syn-live-square bg-sky-500" />
                    Sublime Text 4 · Monokai
                  </span>
                  {(analysisSource || problem) && (
                    <>
                      <span className="text-slate-400" aria-hidden="true">·</span>
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {allTests.length} test cases
                      </span>
                      {problem && (
                        <>
                          <span className="text-slate-400" aria-hidden="true">·</span>
                          <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                            TLE: {formatMsLabel(problem.timeLimitEnabled, problem.timeLimitMs, uiLang === 'en')}
                          </span>
                          <span className="text-slate-400" aria-hidden="true">·</span>
                          <span className="font-mono font-semibold text-sky-600 dark:text-sky-400">
                            {problem.ioMode === 'file'
                              ? `File (${problem.inputFileName || 'INPUT.INP'} → ${problem.outputFileName || 'OUTPUT.OUT'})`
                              : 'Stdin / Stdout'}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {problem ? problem.title : 'Studio Lập Trình Tự Do — Gửi Đề & Bộ Test'}
                </h2>
                {diagnosticNote && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{diagnosticNote}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="sheen-btn px-3.5 py-2 rounded-[4px] bg-amber-50 dark:bg-amber-950/35 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-400/50 text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uiLang === 'en' ? 'New Problem + Tests' : 'Gửi Đề + Test Mới'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="cs-deck-btn sheen-btn px-4 py-2 rounded-[4px] bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_8px_20px_-6px_rgba(2,132,199,0.5)] transition-all whitespace-nowrap"
                >
                  <Code2 className="w-3.5 h-3.5 icon-anim-code" />
                  <span>{uiLang === 'en' ? 'Split Fullscreen' : 'Full Màn Hình (Split)'}</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* MOBILE / SMALL IPAD PANE SWITCHER (<md) */}
          <div
            className={`md:hidden grid grid-cols-3 gap-1 p-1 shrink-0 ${
              isDarkIDE
                ? 'bg-slate-950 border-b border-slate-800'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md'
            }`}
          >
            {[
              { id: 'problem' as const, label: `Đề & Test (${allTests.length})` },
              { id: 'editor' as const, label: 'Code Sublime' },
              { id: 'console' as const, label: judgeScore !== null ? `Chấm (${judgeScore}%)` : 'Console' }
            ].map((pane) => (
              <button
                key={pane.id}
                type="button"
                onClick={() => setMobilePane(pane.id)}
                className={`py-2 px-2 rounded-[4px] text-xs font-bold transition-colors whitespace-nowrap ${
                  mobilePane === pane.id
                    ? 'bg-sky-600 text-white shadow-xs'
                    : isDarkIDE
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {pane.label}
              </button>
            ))}
          </div>

          {/* MAIN SPLIT-SCREEN IDE WORKSPACE */}
          <div className={isFullscreen ? 'flex flex-1 min-h-0 overflow-hidden' : 'syn-conic-border shadow-xl'}>
            {!isFullscreen && <div className="syn-conic-border-spin" aria-hidden="true" />}
            <div
              className={`relative z-10 flex flex-1 min-h-0 overflow-hidden ${
                isFullscreen
                  ? 'border-0 rounded-none bg-slate-950'
                  : 'rounded-[5px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 h-[72vh] sm:h-[76vh] min-h-[480px] sm:min-h-[560px]'
              }`}
            >
              {/* LEFT PANEL: PROBLEM STATEMENT & TEST SUITE */}
              {(isSidebarOpen || mobilePane === 'problem') && (
                <div
                  className={`${
                    mobilePane === 'problem' ? 'flex w-full' : 'hidden md:flex md:w-[40%] lg:w-[35%]'
                  } ${
                    isDarkIDE
                      ? 'bg-slate-950 border-r border-slate-800 text-slate-100'
                      : 'bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                  } flex-col shrink-0 min-h-0 overflow-hidden`}
                >
                  <div
                    className={`h-9 px-3 border-b flex items-center justify-between text-xs font-bold shrink-0 ${
                      isDarkIDE
                        ? 'bg-slate-900/90 border-slate-800 text-slate-100'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 truncate">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Đề Bài &amp; Bộ Test ({allTests.length})</span>
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(true)}
                        className={`px-2 py-0.5 rounded-[4px] border text-[10px] font-bold whitespace-nowrap ${
                          isDarkIDE
                            ? 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-sky-400'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700 text-sky-700 dark:text-sky-400'
                        }`}
                      >
                        Đổi đề
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="hidden md:inline-flex p-1 rounded-[4px] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        title="Thu gọn"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs">
                    {problem ? (
                      <>
                        <div>
                          <h4 className={`text-sm font-extrabold mb-2 ${isDarkIDE ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                            {problem.title}
                          </h4>
                          <div
                            className={`text-xs leading-relaxed p-3 rounded-[4px] border ${
                              isDarkIDE
                                ? 'text-slate-300 bg-slate-900/90 border-slate-800'
                                : 'text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <FormattedText text={problem.description} />
                          </div>
                        </div>

                        {problem.inputFormat && (
                          <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 mb-1">
                              Định dạng Input
                            </div>
                            <div
                              className={`font-mono text-[11px] p-2.5 rounded-[4px] border whitespace-pre-line ${
                                isDarkIDE
                                  ? 'text-slate-300 bg-slate-900/90 border-slate-800'
                                  : 'text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
                              }`}
                            >
                              {problem.inputFormat}
                            </div>
                          </div>
                        )}

                        {problem.outputFormat && (
                          <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                              Định dạng Output
                            </div>
                            <div
                              className={`font-mono text-[11px] p-2.5 rounded-[4px] border whitespace-pre-line ${
                                isDarkIDE
                                  ? 'text-emerald-400 bg-slate-900/90 border-slate-800'
                                  : 'text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
                              }`}
                            >
                              {problem.outputFormat}
                            </div>
                          </div>
                        )}

                        {/* Live Problem Execution Config Strip (TLE & File I/O) */}
                        <div
                          className={`p-2.5 rounded-[4px] border space-y-2 ${
                            isDarkIDE
                              ? 'bg-slate-900/90 border-slate-800'
                              : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Giới hạn TLE &amp; Đọc/Ghi File
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const nextEnabled = problem.timeLimitEnabled === false;
                                const nextMs = nextEnabled ? problem.timeLimitMs ?? 1000 : null;
                                setProblem({
                                  ...problem,
                                  timeLimitEnabled: nextEnabled,
                                  timeLimitMs: nextMs,
                                  timeLimit: formatMsLabel(nextEnabled, nextMs, uiLang === 'en')
                                });
                              }}
                              className={`px-2 py-0.5 rounded-[3px] border text-[10px] font-mono font-bold transition-colors ${
                                problem.timeLimitEnabled === false
                                  ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-500'
                                  : 'bg-sky-600/15 border-sky-500/40 text-sky-500'
                              }`}
                            >
                              {problem.timeLimitEnabled === false ? 'Không giới hạn' : 'TLE: Có giới hạn'}
                            </button>
                          </div>

                          {problem.timeLimitEnabled !== false && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">TLE (giây):</span>
                              {['0.5', '1.0', '2.0', '5.0'].map((s) => {
                                const ms = Math.round(Number(s) * 1000);
                                const active = (problem.timeLimitMs ?? 1000) === ms;
                                return (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() =>
                                      setProblem({
                                        ...problem,
                                        timeLimitEnabled: true,
                                        timeLimitMs: ms,
                                        timeLimit: `${s}s`
                                      })
                                    }
                                    className={`px-1.5 py-0.5 rounded-[3px] font-mono text-[10px] border ${
                                      active
                                        ? 'bg-sky-600 border-sky-500 text-white font-bold'
                                        : isDarkIDE
                                        ? 'bg-slate-950 border-slate-700 text-slate-300'
                                        : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                                    }`}
                                  >
                                    {s}s
                                  </button>
                                );
                              })}
                              <input
                                type="number"
                                min="0.05"
                                max="60"
                                step="0.1"
                                value={((problem.timeLimitMs ?? 1000) / 1000).toString()}
                                onChange={(e) => {
                                  const sec = Math.max(0.05, Number(e.target.value) || 1);
                                  const ms = Math.round(sec * 1000);
                                  setProblem({
                                    ...problem,
                                    timeLimitEnabled: true,
                                    timeLimitMs: ms,
                                    timeLimit: formatMsLabel(true, ms, uiLang === 'en')
                                  });
                                }}
                                className={`w-14 ml-auto px-1.5 py-0.5 rounded-[3px] border font-mono text-[10px] ${
                                  isDarkIDE
                                    ? 'bg-slate-950 border-slate-700 text-slate-100'
                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                                }`}
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Luồng I/O:</span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setProblem({
                                    ...problem,
                                    ioMode: 'standard'
                                  })
                                }
                                className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold border ${
                                  (problem.ioMode || 'standard') === 'standard'
                                    ? 'bg-sky-600 border-sky-500 text-white'
                                    : isDarkIDE
                                    ? 'bg-slate-950 border-slate-700 text-slate-400'
                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                Stdin/Stdout
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setProblem({
                                    ...problem,
                                    ioMode: 'file',
                                    inputFileName: problem.inputFileName || cfgInputFileName || 'INPUT.INP',
                                    outputFileName: problem.outputFileName || cfgOutputFileName || 'OUTPUT.OUT'
                                  })
                                }
                                className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold border ${
                                  problem.ioMode === 'file'
                                    ? 'bg-amber-600 border-amber-500 text-white'
                                    : isDarkIDE
                                    ? 'bg-slate-950 border-slate-700 text-slate-400'
                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                Đọc/Ghi File
                              </button>
                            </div>
                          </div>

                          {problem.ioMode === 'file' && (
                            <div className="grid grid-cols-2 gap-1.5">
                              <input
                                type="text"
                                value={problem.inputFileName || ''}
                                onChange={(e) =>
                                  setProblem({ ...problem, inputFileName: e.target.value })
                                }
                                placeholder="INPUT.INP"
                                className={`px-2 py-1 rounded-[3px] border font-mono text-[10px] ${
                                  isDarkIDE
                                    ? 'bg-slate-950 border-slate-700 text-amber-300'
                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-amber-300'
                                }`}
                              />
                              <input
                                type="text"
                                value={problem.outputFileName || ''}
                                onChange={(e) =>
                                  setProblem({ ...problem, outputFileName: e.target.value })
                                }
                                placeholder="OUTPUT.OUT"
                                className={`px-2 py-1 rounded-[3px] border font-mono text-[10px] ${
                                  isDarkIDE
                                    ? 'bg-slate-950 border-slate-700 text-emerald-400'
                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-emerald-700 dark:text-emerald-400'
                                }`}
                              />
                            </div>
                          )}
                        </div>

                        {/* Test Suite Section with Add/Edit/Load */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5" />
                              Bộ Test Kiểm Thử ({allTests.length})
                            </span>
                            <button
                              type="button"
                              onClick={handleAddCustomTest}
                              className={`px-2 py-1 rounded-[4px] border text-[10px] font-bold flex items-center gap-1 whitespace-nowrap ${
                                isDarkIDE
                                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-emerald-400'
                                  : 'bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 text-emerald-700 dark:text-emerald-400'
                              }`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>Thêm test</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {allTests.map((tc, idx) => {
                              const isEditing = editingTestId === tc.id;
                              const lastResult = judgeResults?.find((r) => r.testId === tc.id);
                              const hasTimeOverride = tc.timeLimitEnabled !== undefined || tc.timeLimitMs !== undefined;
                              return (
                                <div
                                  key={tc.id}
                                  className={`p-2.5 rounded-[4px] border border-l-2 transition-colors ${
                                    lastResult
                                      ? lastResult.passed
                                        ? isDarkIDE
                                          ? 'bg-slate-900/90 border-emerald-500/50 border-l-emerald-400'
                                          : 'bg-emerald-50/50 dark:bg-slate-900 border-emerald-300 dark:border-emerald-600/50 border-l-emerald-500'
                                        : isDarkIDE
                                        ? 'bg-slate-900/90 border-rose-500/50 border-l-rose-400'
                                        : 'bg-rose-50/50 dark:bg-slate-900 border-rose-300 dark:border-rose-600/50 border-l-rose-500'
                                      : isDarkIDE
                                      ? 'bg-slate-900/80 border-slate-800 border-l-sky-500/70 hover:border-sky-500/60'
                                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 border-l-sky-500 hover:border-sky-400'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2 mb-1.5">
                                    {/* Zero pills: crisp typographic status strip */}
                                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] min-w-0">
                                      <span className={`font-bold font-mono ${isDarkIDE ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                        Test #{idx + 1}
                                      </span>
                                      <span className="text-slate-400" aria-hidden="true">·</span>
                                      <span className={`text-[10px] font-semibold ${tc.isSample ? 'text-sky-600 dark:text-sky-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                        {tc.isSample ? 'Mẫu' : 'Ẩn'}
                                      </span>
                                      {(tc.difficulty || tc.isSample) && (
                                        <>
                                          <span className="text-slate-400" aria-hidden="true">·</span>
                                          <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                                            {tc.difficulty || 'Cơ bản'}
                                          </span>
                                        </>
                                      )}
                                      {hasTimeOverride && (
                                        <>
                                          <span className="text-slate-400" aria-hidden="true">·</span>
                                          <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400">
                                            {tc.timeLimitEnabled === false
                                              ? 'Không giới hạn'
                                              : formatMsLabel(true, tc.timeLimitMs ?? problem.timeLimitMs ?? 1000, uiLang === 'en')}
                                          </span>
                                        </>
                                      )}
                                      {lastResult && (
                                        <>
                                          <span className="text-slate-400" aria-hidden="true">·</span>
                                          <span
                                            className={`text-[10px] font-mono font-bold ${
                                              lastResult.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                            }`}
                                          >
                                            {lastResult.status}
                                          </span>
                                        </>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCustomInput(tc.input);
                                          setConsoleTab('output');
                                          setMobilePane('editor');
                                        }}
                                        className={`px-2 py-0.5 rounded-[4px] border text-[10px] font-bold whitespace-nowrap ${
                                          isDarkIDE
                                            ? 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-sky-400'
                                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 border-slate-200 dark:border-slate-700 text-sky-700 dark:text-sky-400'
                                        }`}
                                        title={problem.ioMode === 'file' ? `Nạp vào ${problem.inputFileName || 'INPUT.INP'}` : 'Nạp vào stdin'}
                                      >
                                        Nạp
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isEditing) {
                                            setEditingTestId(null);
                                          } else {
                                            setEditingTestId(tc.id);
                                            setEditTestInput(tc.input);
                                            setEditTestOutput(tc.expectedOutput);
                                            setEditTestTier(tc.difficulty || (tc.isSample ? 'Cơ bản' : 'Trung bình'));
                                            setEditTestTimeMode(
                                              tc.timeLimitEnabled === false
                                                ? 'unlimited'
                                                : tc.timeLimitMs !== undefined && tc.timeLimitMs !== null
                                                ? 'custom'
                                                : 'inherit'
                                            );
                                            setEditTestTimeMs(String(tc.timeLimitMs ?? problem.timeLimitMs ?? 1000));
                                          }
                                        }}
                                        className="p-1 rounded-[4px] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                        title="Sửa test"
                                      >
                                        <Edit3 className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteTest(tc.id)}
                                        className="p-1 rounded-[4px] hover:bg-rose-500/15 text-slate-400 hover:text-rose-500"
                                        title="Xóa test"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>

                                  {isEditing ? (
                                    <div className="space-y-1.5 mt-2">
                                      <select
                                        value={editTestTier}
                                        onChange={(e) => setEditTestTier(e.target.value as TestDifficultyTier)}
                                        className="w-full p-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-[10px] font-semibold text-slate-800 dark:text-amber-300"
                                      >
                                        <option value="Cơ bản">Mức 1: Cơ bản</option>
                                        <option value="Trung bình">Mức 2: Trung bình</option>
                                        <option value="Nâng cao">Mức 3: Nâng cao (Biên)</option>
                                        <option value="Thử thách">Mức 4: Thử thách (Giới hạn lớn)</option>
                                      </select>
                                      <div className="flex items-center gap-1.5">
                                        <select
                                          value={editTestTimeMode}
                                          onChange={(e) =>
                                            setEditTestTimeMode(e.target.value as 'inherit' | 'unlimited' | 'custom')
                                          }
                                          className="flex-1 p-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] text-[10px] font-mono text-slate-800 dark:text-sky-300"
                                        >
                                          <option value="inherit">TLE: Theo cấu hình đề ({formatMsLabel(problem.timeLimitEnabled, problem.timeLimitMs, uiLang === 'en')})</option>
                                          <option value="unlimited">TLE: Không giới hạn</option>
                                          <option value="custom">TLE: Tùy chỉnh riêng (ms)</option>
                                        </select>
                                        {editTestTimeMode === 'custom' && (
                                          <input
                                            type="number"
                                            min="50"
                                            max="60000"
                                            step="50"
                                            value={editTestTimeMs}
                                            onChange={(e) => setEditTestTimeMs(e.target.value)}
                                            className="w-20 p-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] font-mono text-[10px] text-slate-900 dark:text-slate-100"
                                            placeholder="1000"
                                          />
                                        )}
                                      </div>
                                      <textarea
                                        value={editTestInput}
                                        onChange={(e) => setEditTestInput(e.target.value)}
                                        rows={2}
                                        className="w-full p-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] font-mono text-[10px] text-slate-900 dark:text-slate-100"
                                      />
                                      <textarea
                                        value={editTestOutput}
                                        onChange={(e) => setEditTestOutput(e.target.value)}
                                        rows={2}
                                        className="w-full p-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-[4px] font-mono text-[10px] text-emerald-700 dark:text-emerald-400"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleSaveEditedTest(tc.id)}
                                        className="w-full py-1.5 rounded-[4px] bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px]"
                                      >
                                        Lưu thay đổi test
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="font-mono text-[10px] space-y-0.5 text-slate-500 dark:text-slate-400">
                                      <div className="truncate">
                                        In: <span className="text-amber-600 dark:text-amber-300">{tc.input.replace(/\n/g, ' ↵ ')}</span>
                                      </div>
                                      <div className="truncate">
                                        Out: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{tc.expectedOutput.replace(/\n/g, ' ↵ ')}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 space-y-3">
                        <Upload className="w-10 h-10 text-sky-500 mx-auto" />
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Chưa có đề bài. Bấm nút bên dưới để gửi đề và bộ test.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowUploadModal(true)}
                          className="cs-deck-btn px-4 py-2 rounded-[4px] bg-sky-600 text-white font-bold text-xs"
                        >
                          Gửi Đề Bài Ngay
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* RIGHT PANEL: SUBLIME SYNTAX EDITOR + CONSOLE */}
              <div
                className={`${
                  mobilePane === 'problem' ? 'hidden md:flex' : 'flex'
                } flex-1 flex-col bg-[#131722] min-w-0 min-h-0 overflow-hidden`}
              >
                {/* Sublime Editor Pane */}
                <div className={`${mobilePane === 'console' ? 'hidden md:flex' : 'flex'} flex-1 flex-col min-h-0 overflow-hidden`}>
                  <SublimeEditor
                    value={activeEditorValue}
                    onChange={handleEditorChange}
                    language={activeFile === 'solution.py' ? 'python' : activeFile === 'input.txt' ? 'text' : 'cpp'}
                    tabs={editorTabs}
                    activeTabId={activeFile}
                    onSelectTab={handleSelectTab}
                    fontSize={fontSize}
                    onFontSizeChange={setFontSize}
                    onRun={handleRunCustom}
                    onSave={() => {
                      setSaveFlash(true);
                      setTimeout(() => setSaveFlash(false), 1200);
                    }}
                    onReset={() => {
                      if (activeFile === 'main.cpp') setCppCode(DEFAULT_CLEAN_CPP);
                      else if (activeFile === 'solution.py') setPyCode(DEFAULT_CLEAN_PYTHON);
                    }}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    isConsoleOpen={isConsoleOpen}
                    onToggleConsole={() => setIsConsoleOpen(!isConsoleOpen)}
                    placeholder={
                      activeFile === 'solution.py'
                        ? '# Viết code Python 3 tại đây...'
                        : activeFile === 'input.txt'
                        ? 'Nhập dữ liệu stdin tùy chỉnh...'
                        : '// Viết code C++ tại đây...'
                    }
                    statusRightExtra={judgeScore !== null ? `Score: ${judgeScore}/100` : undefined}
                  />
                </div>

                {/* Action Toolbar */}
                <div className="bg-slate-950 border-t border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRunCustom}
                      disabled={isRunningCustom || isJudging}
                      className="sheen-btn px-3.5 py-1.5 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/60 text-slate-100 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5 text-sky-400" />
                      <span>{isRunningCustom ? 'Đang chạy...' : 'Chạy Test (Ctrl+Enter)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleJudgeAll}
                      disabled={isJudging || isRunningCustom || !problem}
                      className="cs-deck-btn sheen-btn px-4 py-1.5 rounded-[4px] bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_6px_18px_-6px_rgba(16,185,129,0.55)] transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isJudging ? 'Đang chấm...' : `Nộp Chấm (${allTests.length} tests)`}</span>
                    </button>
                  </div>

                  {judgeScore !== null && (
                    <span
                      className={`text-xs font-mono font-bold tabular-nums ${
                        judgeVerdict === 'Accepted'
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

                {/* Console / Judge Output */}
                {(isConsoleOpen || mobilePane === 'console') && (
                  <div
                    className={`${
                      mobilePane === 'console'
                        ? 'flex-1 md:flex-none md:h-52'
                        : isFullscreen && consoleTab === 'judge'
                        ? 'hidden md:flex md:h-80'
                        : 'hidden md:flex md:h-48'
                    } bg-slate-950 border-t border-slate-800 flex-col font-mono text-xs text-slate-100 shrink-0 overflow-hidden`}
                  >
                    <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 bg-slate-900">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setConsoleTab('output')}
                          className={`relative px-2.5 py-1 rounded-[4px] text-[11px] font-bold transition-colors whitespace-nowrap ${
                            consoleTab === 'output'
                              ? 'bg-sky-600 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <Terminal className="w-3 h-3 inline mr-1" />
                          {problem?.ioMode === 'file'
                            ? `${problem.inputFileName || 'INPUT.INP'} / ${problem.outputFileName || 'OUTPUT.OUT'}`
                            : 'Stdin / Output'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConsoleTab('judge')}
                          className={`relative px-2.5 py-1 rounded-[4px] text-[11px] font-bold transition-colors whitespace-nowrap ${
                            consoleTab === 'judge'
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          Kết quả Chấm ({judgeResults ? `${judgeResults.filter((r) => r.passed).length}/${judgeResults.length}` : allTests.length})
                        </button>
                      </div>
                      {customRuntimeMs !== null && consoleTab === 'output' && (
                        <span className="text-[10px] text-sky-400 tabular-nums">{customRuntimeMs}ms</span>
                      )}
                    </div>

                    {consoleTab === 'output' ? (
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-2.5 overflow-hidden">
                        <div className="flex flex-col min-h-0">
                          <span className="text-slate-400 text-[10px] mb-1">
                            {problem?.ioMode === 'file'
                              ? `Nội dung File Input (${problem.inputFileName || 'INPUT.INP'}):`
                              : 'Standard Input (stdin):'}
                          </span>
                          <textarea
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder="Nhập input chạy thử..."
                            className="flex-1 p-2 bg-[#131722] border border-slate-800 rounded-[4px] text-slate-100 text-xs font-mono resize-none focus:outline-none focus:border-sky-500"
                          />
                        </div>
                        <div className="flex flex-col min-h-0">
                          <span className="text-slate-400 text-[10px] mb-1">
                            {problem?.ioMode === 'file'
                              ? `Nội dung File Output (${problem.outputFileName || 'OUTPUT.OUT'}) / Log:`
                              : 'Output / Compiler Log:'}
                          </span>
                          <div className="flex-1 p-2 bg-[#131722] border border-slate-800 rounded-[4px] text-xs font-mono whitespace-pre-wrap overflow-y-auto">
                            {customStderr ? (
                              <span className="text-rose-400">{customStderr}</span>
                            ) : customOutput ? (
                              <span className="text-emerald-400">{customOutput}</span>
                            ) : (
                              <span className="text-slate-500">// Kết quả thực thi C++ / Python sẽ hiện tại đây...</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 font-sans">
                        {judgeResults && judgeResults.length > 0 ? (
                          isFullscreen ? (
                            <CodeMistakeAnalysisPanel
                              darkSurface={true}
                              score={judgeScore}
                              verdict={judgeVerdict}
                              results={judgeResults}
                              language={activeFile === 'solution.py' ? 'python' : selectedLang}
                              analysis={mistakeAnalysis}
                              isAnalyzingMistake={isAnalyzingMistake}
                              onRetryAnalyze={() => {
                                if (!problem || !judgeResults || judgeScore === null) return;
                                const lang = activeFile === 'solution.py' ? 'python' : selectedLang;
                                const codeToAnalyze = lang === 'python' ? pyCode : cppCode;
                                void runMistakeAnalysis(problem, lang, codeToAnalyze, judgeScore, judgeResults);
                              }}
                              onApplySampleCode={(sample) => {
                                const lang = activeFile === 'solution.py' ? 'python' : selectedLang;
                                if (lang === 'python') {
                                  setPyCode(sample);
                                  setActiveFile('solution.py');
                                  setSelectedLang('python');
                                } else {
                                  setCppCode(sample);
                                  setActiveFile('main.cpp');
                                  setSelectedLang('cpp');
                                }
                              }}
                            />
                          ) : (
                            <div className="space-y-1.5 font-mono">
                              {judgeResults.map((tr, i) => (
                                <div
                                  key={i}
                                  className={`p-2 rounded-[4px] border text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                    tr.passed
                                      ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400'
                                      : 'bg-rose-500/10 border-rose-500/35 text-rose-400'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 font-bold shrink-0">
                                    {tr.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                    <span>Test #{i + 1}: {tr.status}</span>
                                    <span className="text-[10px] font-normal text-slate-400 tabular-nums">({tr.runtimeMs}ms)</span>
                                  </div>
                                  {!tr.passed && (
                                    <div className="text-[10px] text-slate-200 truncate">
                                      Exp: <span className="text-emerald-400">{tr.expected.replace(/\n/g, ' ')}</span> | Got:{' '}
                                      <span className="text-rose-400">{tr.actual.replace(/\n/g, ' ')}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )
                        ) : (
                          <div className="text-center py-6 text-slate-500 font-mono">
                            Bấm "Nộp Chấm" để chạy kiểm tra toàn bộ test cases và phân tích lỗi AI.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BELOW IDE: DETAILED SCORE, FAILED TESTS & AI CODE MISTAKE ANALYSIS */}
          {!isFullscreen && (judgeResults || isJudging) && (
            <div ref={resultSectionRef} className="pt-2">
              {isJudging && !judgeResults ? (
                <div className="sci-frame bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md p-6 text-center text-xs text-sky-600 dark:text-sky-400 font-mono">
                  Đang chấm bài trên {allTests.length} test cases...
                </div>
              ) : (
                <CodeMistakeAnalysisPanel
                  darkSurface={false}
                  score={judgeScore}
                  verdict={judgeVerdict}
                  results={judgeResults}
                  language={activeFile === 'solution.py' ? 'python' : selectedLang}
                  analysis={mistakeAnalysis}
                  isAnalyzingMistake={isAnalyzingMistake}
                  onRetryAnalyze={() => {
                    if (!problem || !judgeResults || judgeScore === null) return;
                    const lang = activeFile === 'solution.py' ? 'python' : selectedLang;
                    const codeToAnalyze = lang === 'python' ? pyCode : cppCode;
                    void runMistakeAnalysis(problem, lang, codeToAnalyze, judgeScore, judgeResults);
                  }}
                  onApplySampleCode={(sample) => {
                    const lang = activeFile === 'solution.py' ? 'python' : selectedLang;
                    if (lang === 'python') {
                      setPyCode(sample);
                      setActiveFile('solution.py');
                      setSelectedLang('python');
                    } else {
                      setCppCode(sample);
                      setActiveFile('main.cpp');
                      setSelectedLang('cpp');
                    }
                  }}
                />
              )}
            </div>
          )}
        </div>
      </ViewportPortal>
    </>
  );
};
