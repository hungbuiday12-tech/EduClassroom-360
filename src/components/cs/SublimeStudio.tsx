import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  CodeLanguage,
  CodingProblem,
  TestCase,
  TestResult
} from '../../types';
import { executeCode, compareOutputs } from './codeRunner';
import {
  analyzeProblemAndGenerateTests,
  extractSamplesFromText,
  UserSamplePair
} from './problemAnalyzer';
import { SublimeEditor, SublimeTabItem } from './SublimeEditor';
import { useLanguage } from '../../context/LanguageContext';
import { FormattedText } from '../common/MathRenderer';
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
  X
} from 'lucide-react';

interface SublimeStudioProps {
  onScoreEarned?: (xp: number) => void;
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

export const SublimeStudio: React.FC<SublimeStudioProps> = ({ onScoreEarned }) => {
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

  // Runner & Judge State
  const [customOutput, setCustomOutput] = useState<string>('');
  const [customStderr, setCustomStderr] = useState<string>('');
  const [customRuntimeMs, setCustomRuntimeMs] = useState<number | null>(null);
  const [isRunningCustom, setIsRunningCustom] = useState<boolean>(false);

  const [isJudging, setIsJudging] = useState<boolean>(false);
  const [judgeResults, setJudgeResults] = useState<TestResult[] | null>(null);
  const [judgeScore, setJudgeScore] = useState<number | null>(null);
  const [judgeVerdict, setJudgeVerdict] = useState<string | null>(null);

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

  // Text/Code File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      setRawText(text);
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
      const result = await analyzeProblemAndGenerateTests({
        text: rawText.trim(),
        imageBase64: uploadedImagePreview,
        mimeType: uploadedMimeType,
        fileName: uploadedFileName,
        userSamples: validSamples,
        referenceCode: showRefCodeBox && refCode.trim() ? refCode : undefined,
        referenceLang: refLang
      });

      setProblem(result.problem);
      setDiagnosticNote(result.diagnosticNote);
      setAnalysisSource(result.source);

      const firstIn = result.problem.sampleCases[0]?.input || result.problem.hiddenCases[0]?.input || '';
      setCustomInput(firstIn);
      setCustomOutput('');
      setCustomStderr('');
      setJudgeResults(null);
      setJudgeScore(null);
      setJudgeVerdict(null);
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
    setInputMode('text');
    setRawText(
      `Tìm tổng đoạn con liên tiếp lớn nhất (Maximum Subarray Sum)\nCho mảng gồm N số nguyên a[1], a[2], ..., a[N]. Hãy tìm tổng lớn nhất của một đoạn con liên tiếp khác rỗng.\nInput:\nDòng 1: Số nguyên N (1 <= N <= 10^5).\nDòng 2: N số nguyên.\nOutput:\nMột số nguyên duy nhất là tổng lớn nhất.`
    );
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

    const res = await executeCode(problem?.id || 'CUSTOM', langToRun, codeToRun, customInput);
    setIsRunningCustom(false);
    setCustomOutput(res.stdout);
    setCustomStderr(res.stderr);
    setCustomRuntimeMs(res.runtimeMs);
  };

  // Judge All Test Cases
  const handleJudgeAll = async () => {
    if (!problem) return;
    setIsJudging(true);
    setIsConsoleOpen(true);
    setConsoleTab('judge');
    setMobilePane('console');
    setJudgeResults(null);

    const allCases = [...problem.sampleCases, ...problem.hiddenCases];
    const results: TestResult[] = [];
    let passed = 0;

    const langToRun: CodeLanguage = activeFile === 'solution.py' ? 'python' : selectedLang;
    const codeToRun = langToRun === 'python' ? pyCode : cppCode;

    for (let i = 0; i < allCases.length; i++) {
      const tc = allCases[i];
      const res = await executeCode(problem.id, langToRun, codeToRun, tc.input);

      if (res.isError) {
        results.push({
          testId: tc.id,
          passed: false,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: res.stderr,
          runtimeMs: res.runtimeMs,
          status: res.stderr.includes('TLE') ? 'Time Limit Exceeded' : 'Runtime Error'
        });
        continue;
      }

      const isPass = compareOutputs(res.stdout, tc.expectedOutput);
      if (isPass) passed++;

      results.push({
        testId: tc.id,
        passed: isPass,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: res.stdout,
        runtimeMs: res.runtimeMs,
        status: isPass ? 'Accepted' : 'Wrong Answer'
      });
    }

    const finalScore = allCases.length > 0 ? Math.round((passed / allCases.length) * 100) : 100;
    const verdict = finalScore === 100 ? 'Accepted' : finalScore > 0 ? 'Partial' : 'Wrong Answer';

    setIsJudging(false);
    setJudgeResults(results);
    setJudgeScore(finalScore);
    setJudgeVerdict(verdict);

    if (finalScore === 100 && allCases.length > 0) {
      confetti({ particleCount: 95, spread: 75, origin: { y: 0.6 } });
      onScoreEarned?.(120);
    } else if (finalScore > 0) {
      onScoreEarned?.(Math.floor(finalScore * 0.5));
    }
  };

  // Sidebar Test Case CRUD
  const handleAddCustomTest = () => {
    if (!problem) return;
    const newId = Date.now();
    const newTc: TestCase = {
      id: newId,
      input: customInput || '1\n0',
      expectedOutput: customOutput.trim() || '0',
      isSample: false
    };
    setProblem({
      ...problem,
      hiddenCases: [...problem.hiddenCases, newTc]
    });
    setEditingTestId(newId);
    setEditTestInput(newTc.input);
    setEditTestOutput(newTc.expectedOutput);
  };

  const handleSaveEditedTest = (testId: number) => {
    if (!problem) return;
    const updateList = (list: TestCase[]) =>
      list.map((tc) =>
        tc.id === testId ? { ...tc, input: editTestInput, expectedOutput: editTestOutput } : tc
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

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen bg-[#1e1f1c] text-[#f8f8f2] flex flex-col overflow-hidden'
          : 'relative space-y-3'
      }
    >
      {/* Save Notification Toast */}
      {saveFlash && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2 bg-[#a6e22e] text-[#272822] font-mono text-xs font-bold rounded-lg shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Saved {activeFile} (Ctrl+S)</span>
        </div>
      )}

      {/* MODAL: PROBLEM UPLOAD & TEST SUITE ANALYZER */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-[#1e1f1c] border border-[#3e3d32] rounded-2xl p-4 sm:p-6 shadow-2xl text-[#f8f8f2] space-y-4 my-auto max-h-[94vh] overflow-y-auto">
            <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#3e3d32]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#a6e22e]/15 text-[#a6e22e] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {uiLang === 'en'
                      ? 'Submit Problem & Generate Test Suite'
                      : 'Gửi Đề Bài & Bộ Test Mẫu — Tự Động Sinh Bộ Test'}
                  </h3>
                  <p className="text-[11px] text-[#90908a]">
                    {uiLang === 'en'
                      ? 'Paste problem statement, upload image/file, and attach sample Input/Output pairs.'
                      : 'Dán đề bài hoặc tải ảnh/file, kèm test mẫu để hệ thống phân tích và sinh bộ test chuẩn xác.'}
                  </p>
                </div>
              </div>

              {problem && (
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-[#90908a] hover:text-white bg-[#272822] border border-[#3e3d32] rounded-lg shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Input Mode Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#171814] rounded-xl border border-[#3e3d32]">
              {[
                { id: 'text' as const, icon: Code2, label: '1. Nhập / Dán đề' },
                { id: 'image' as const, icon: ImageIcon, label: '2. Ảnh chụp đề' },
                { id: 'file' as const, icon: FileText, label: '3. Tải file (.txt)' }
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setInputMode(m.id)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      inputMode === m.id
                        ? 'bg-[#a6e22e] text-[#272822] font-bold shadow'
                        : 'text-[#90908a] hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mode Content */}
            {inputMode === 'text' && (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-[#66d9ef]">
                    Nội dung đề bài (Tiêu đề, Mô tả, Input/Output):
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={loadDemoToModal}
                      className="text-[11px] px-2.5 py-1 rounded bg-[#272822] hover:bg-[#3e3d32] border border-[#3e3d32] text-[#e6db74]"
                    >
                      Nạp ví dụ mẫu
                    </button>
                    {rawText.trim() && (
                      <button
                        type="button"
                        onClick={handleAutoExtractSamples}
                        className="text-[11px] px-2.5 py-1 rounded bg-[#272822] hover:bg-[#3e3d32] border border-[#3e3d32] text-[#a6e22e]"
                      >
                        Tự tách Sample từ đề
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Ví dụ: Cho mảng gồm N số nguyên. Tìm tổng dãy con liên tiếp lớn nhất..."
                  rows={5}
                  className="w-full px-3.5 py-2.5 bg-[#272822] border border-[#3e3d32] rounded-xl font-mono text-xs text-[#f8f8f2] focus:outline-none focus:border-[#66d9ef]"
                />
              </div>
            )}

            {inputMode === 'image' && (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-[#3e3d32] hover:border-[#a6e22e] rounded-xl p-6 text-center bg-[#272822]/70 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="sublime-image-upload"
                  />
                  <label htmlFor="sublime-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <ImageIcon className="w-8 h-8 text-[#e6db74]" />
                    <p className="text-xs font-semibold text-[#f8f8f2]">
                      Chọn ảnh chụp đề bài (PNG, JPG, WEBP)
                    </p>
                  </label>
                </div>
                {uploadedImagePreview && (
                  <div className="p-2.5 bg-[#272822] rounded-xl border border-[#3e3d32] flex items-center gap-3">
                    <img
                      src={uploadedImagePreview}
                      alt="Uploaded problem"
                      className="w-14 h-14 object-cover rounded-lg border border-[#3e3d32]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#a6e22e]">Đã tải ảnh đề bài</div>
                      <div className="text-[11px] font-mono text-[#90908a] truncate">{uploadedFileName}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {inputMode === 'file' && (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-[#3e3d32] hover:border-[#66d9ef] rounded-xl p-6 text-center bg-[#272822]/70 transition-colors">
                  <input
                    type="file"
                    accept=".txt,.md,.cpp,.py"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="sublime-file-upload"
                  />
                  <label htmlFor="sublime-file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8 text-[#66d9ef]" />
                    <p className="text-xs font-semibold text-[#f8f8f2]">
                      Chọn tệp văn bản đề bài (.txt, .md)
                    </p>
                  </label>
                </div>
                {rawText && (
                  <div className="p-2.5 bg-[#272822] rounded-xl border border-[#3e3d32] text-[11px] font-mono text-[#f8f8f2] max-h-28 overflow-y-auto whitespace-pre-wrap">
                    {rawText}
                  </div>
                )}
              </div>
            )}

            {/* Dynamic Sample Test Pairs */}
            <div className="space-y-2 pt-2 border-t border-[#3e3d32]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#e6db74]">
                  Bộ Test Mẫu Kèm Theo ({userSamples.length}) — Giúp đối chiếu & sinh test ẩn chính xác:
                </span>
                <button
                  type="button"
                  onClick={() => setUserSamples([...userSamples, { input: '', expectedOutput: '' }])}
                  className="px-2.5 py-1 rounded bg-[#272822] hover:bg-[#3e3d32] border border-[#3e3d32] text-[11px] text-[#a6e22e] flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3 h-3" />
                  <span>Thêm test</span>
                </button>
              </div>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {userSamples.map((sp, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2.5 rounded-xl bg-[#272822] border border-[#3e3d32]">
                    <div className="sm:col-span-6">
                      <div className="text-[10px] font-mono text-[#90908a] mb-1">Input mẫu #{idx + 1}</div>
                      <textarea
                        value={sp.input}
                        onChange={(e) => {
                          const next = [...userSamples];
                          next[idx] = { ...next[idx], input: e.target.value };
                          setUserSamples(next);
                        }}
                        rows={2}
                        placeholder="Ví dụ: 5&#10;1 2 3 4 5"
                        className="w-full p-2 bg-[#171814] border border-[#3e3d32] rounded-lg font-mono text-[11px] text-[#f8f8f2] focus:outline-none focus:border-[#66d9ef]"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <div className="text-[10px] font-mono text-[#90908a] mb-1">Output mong đợi #{idx + 1}</div>
                      <textarea
                        value={sp.expectedOutput}
                        onChange={(e) => {
                          const next = [...userSamples];
                          next[idx] = { ...next[idx], expectedOutput: e.target.value };
                          setUserSamples(next);
                        }}
                        rows={2}
                        placeholder="Ví dụ: 15"
                        className="w-full p-2 bg-[#171814] border border-[#3e3d32] rounded-lg font-mono text-[11px] text-[#a6e22e] focus:outline-none focus:border-[#a6e22e]"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-end justify-end">
                      {userSamples.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setUserSamples(userSamples.filter((_, i) => i !== idx))}
                          className="p-2 rounded-lg bg-[#171814] hover:bg-[#f92672]/20 text-[#90908a] hover:text-[#f92672]"
                          title="Xóa test này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Reference AC Code Oracle */}
            <div>
              <button
                type="button"
                onClick={() => setShowRefCodeBox(!showRefCodeBox)}
                className="text-[11px] font-semibold text-[#66d9ef] hover:underline flex items-center gap-1"
              >
                <span>{showRefCodeBox ? '▼ Ẩn code AC tham khảo' : '+ Đính kèm Code AC chuẩn (tùy chọn để tự sinh thêm test ẩn)'}</span>
              </button>
              {showRefCodeBox && (
                <div className="mt-2 p-3 rounded-xl bg-[#272822] border border-[#3e3d32] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#90908a]">Ngôn ngữ code tham khảo:</span>
                    <div className="flex gap-1">
                      {(['cpp', 'python'] as const).map((lg) => (
                        <button
                          key={lg}
                          type="button"
                          onClick={() => setRefLang(lg)}
                          className={`px-2.5 py-0.5 rounded text-[11px] font-mono ${
                            refLang === lg ? 'bg-[#66d9ef] text-[#272822] font-bold' : 'bg-[#171814] text-[#90908a]'
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
                    className="w-full p-2 bg-[#171814] border border-[#3e3d32] rounded-lg font-mono text-[11px] text-[#f8f8f2] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {analysisError && (
              <div className="p-2.5 bg-[#f92672]/15 border border-[#f92672]/40 rounded-xl text-xs text-[#f92672] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{analysisError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#3e3d32]">
              <span className="text-[11px] text-[#90908a] font-mono">
                {isAnalyzing ? 'Đang phân tích đề bài & sinh bộ test...' : 'Hệ thống hỗ trợ tự động phân tích đề & chạy thật C++/Python'}
              </span>
              <button
                type="button"
                onClick={handleAnalyzeProblem}
                disabled={isAnalyzing}
                className="px-5 py-2.5 rounded-xl bg-[#a6e22e] hover:bg-[#b8f242] text-[#272822] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzing ? 'Đang phân tích...' : 'Phân tích Đề & Sinh Bộ Test'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP COMPACT BAR (Hidden when fullscreen for pure 100vw x 100vh IDE) */}
      {!isFullscreen && (
        <div className="bg-[#1e1f1c] border border-[#3e3d32] rounded-2xl p-3 sm:p-4 text-[#f8f8f2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#f92672]/20 text-[#f92672] border border-[#f92672]/30">
                Sublime Text 4 • Monokai
              </span>
              {analysisSource && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#a6e22e]/15 text-[#a6e22e] border border-[#a6e22e]/30">
                  {allTests.length} test cases
                </span>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white truncate">
              {problem ? problem.title : 'Studio Lập Trình Tự Do — Gửi Đề & Bộ Test'}
            </h2>
            {diagnosticNote && (
              <p className="text-[11px] text-[#90908a] truncate mt-0.5">{diagnosticNote}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#272822] hover:bg-[#3e3d32] text-[#e6db74] border border-[#e6db74]/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Gửi Đề + Test Mới</span>
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#66d9ef] hover:bg-[#7fe4f7] text-[#272822] text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Full Màn Hình (Split)</span>
            </button>
          </div>
        </div>
      )}

      {/* MOBILE / SMALL IPAD PANE SWITCHER (<md) */}
      <div className="md:hidden grid grid-cols-3 gap-1 p-1 bg-[#171814] border border-[#3e3d32] rounded-xl">
        {[
          { id: 'problem' as const, label: `Đề & Test (${allTests.length})` },
          { id: 'editor' as const, label: 'Code Sublime' },
          { id: 'console' as const, label: judgeScore !== null ? `Chấm (${judgeScore}%)` : 'Console' }
        ].map((pane) => (
          <button
            key={pane.id}
            onClick={() => setMobilePane(pane.id)}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition-colors ${
              mobilePane === pane.id
                ? 'bg-[#272822] text-[#a6e22e] border border-[#3e3d32]'
                : 'text-[#90908a]'
            }`}
          >
            {pane.label}
          </button>
        ))}
      </div>

      {/* MAIN SPLIT-SCREEN IDE WORKSPACE */}
      <div
        className={`flex flex-1 overflow-hidden border border-[#3e3d32] bg-[#272822] ${
          isFullscreen ? 'h-screen border-0 rounded-none' : 'rounded-2xl h-[76vh] min-h-[580px] shadow-2xl'
        }`}
      >
        {/* LEFT PANEL: PROBLEM STATEMENT & TEST SUITE */}
        {(isSidebarOpen || mobilePane === 'problem') && (
          <div
            className={`${
              mobilePane === 'problem' ? 'flex w-full' : 'hidden md:flex md:w-[40%] lg:w-[35%]'
            } bg-[#1e1f1c] border-r border-[#3e3d32] flex-col shrink-0 overflow-hidden`}
          >
            <div className="h-9 px-3 bg-[#171814] border-b border-[#3e3d32] flex items-center justify-between text-xs font-bold text-[#f8f8f2]">
              <span className="flex items-center gap-1.5 text-[#e6db74] truncate">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Đề Bài & Bộ Test ({allTests.length})</span>
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-2 py-0.5 rounded bg-[#272822] hover:bg-[#3e3d32] text-[10px] text-[#66d9ef] border border-[#3e3d32]"
                >
                  Đổi đề
                </button>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="hidden md:inline-flex p-1 hover:bg-[#3e3d32] rounded text-[#90908a] hover:text-white"
                  title="Thu gọn"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs text-[#f8f8f2]">
              {problem ? (
                <>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2">{problem.title}</h4>
                    <div className="text-xs text-[#d8d8d0] leading-relaxed bg-[#272822] p-3 rounded-xl border border-[#3e3d32]">
                      <FormattedText text={problem.description} />
                    </div>
                  </div>

                  {problem.inputFormat && (
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#66d9ef] mb-1">
                        Định dạng Input
                      </div>
                      <div className="font-mono text-[11px] text-[#d8d8d0] bg-[#272822] p-2.5 rounded-xl border border-[#3e3d32] whitespace-pre-line">
                        {problem.inputFormat}
                      </div>
                    </div>
                  )}

                  {problem.outputFormat && (
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#a6e22e] mb-1">
                        Định dạng Output
                      </div>
                      <div className="font-mono text-[11px] text-[#a6e22e] bg-[#272822] p-2.5 rounded-xl border border-[#3e3d32] whitespace-pre-line">
                        {problem.outputFormat}
                      </div>
                    </div>
                  )}

                  {/* Test Suite Section with Add/Edit/Load */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#e6db74] flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        Bộ Test Kiểm Thử ({allTests.length})
                      </span>
                      <button
                        onClick={handleAddCustomTest}
                        className="px-2 py-1 rounded bg-[#272822] hover:bg-[#3e3d32] border border-[#3e3d32] text-[10px] text-[#a6e22e] font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm test</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {allTests.map((tc, idx) => {
                        const isEditing = editingTestId === tc.id;
                        const lastResult = judgeResults?.find((r) => r.testId === tc.id);
                        return (
                          <div
                            key={tc.id}
                            className={`p-2.5 rounded-xl bg-[#272822] border transition-colors ${
                              lastResult
                                ? lastResult.passed
                                  ? 'border-[#a6e22e]/60'
                                  : 'border-[#f92672]/60'
                                : 'border-[#3e3d32] hover:border-[#66d9ef]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold font-mono text-white">Test #{idx + 1}</span>
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                                    tc.isSample
                                      ? 'bg-[#66d9ef]/20 text-[#66d9ef]'
                                      : 'bg-[#ae81ff]/20 text-[#ae81ff]'
                                  }`}
                                >
                                  {tc.isSample ? 'Mẫu' : 'Ẩn'}
                                </span>
                                {lastResult && (
                                  <span
                                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                      lastResult.passed
                                        ? 'bg-[#a6e22e]/20 text-[#a6e22e]'
                                        : 'bg-[#f92672]/20 text-[#f92672]'
                                    }`}
                                  >
                                    {lastResult.status}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setCustomInput(tc.input);
                                    setConsoleTab('output');
                                    setMobilePane('editor');
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-[#171814] hover:bg-[#3e3d32] text-[10px] text-[#e6db74]"
                                  title="Nạp vào stdin"
                                >
                                  Nạp
                                </button>
                                <button
                                  onClick={() => {
                                    if (isEditing) {
                                      setEditingTestId(null);
                                    } else {
                                      setEditingTestId(tc.id);
                                      setEditTestInput(tc.input);
                                      setEditTestOutput(tc.expectedOutput);
                                    }
                                  }}
                                  className="p-1 rounded hover:bg-[#3e3d32] text-[#90908a] hover:text-white"
                                  title="Sửa test"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTest(tc.id)}
                                  className="p-1 rounded hover:bg-[#f92672]/20 text-[#90908a] hover:text-[#f92672]"
                                  title="Xóa test"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {isEditing ? (
                              <div className="space-y-1.5 mt-2">
                                <textarea
                                  value={editTestInput}
                                  onChange={(e) => setEditTestInput(e.target.value)}
                                  rows={2}
                                  className="w-full p-1.5 bg-[#171814] border border-[#3e3d32] rounded font-mono text-[10px] text-[#f8f8f2]"
                                />
                                <textarea
                                  value={editTestOutput}
                                  onChange={(e) => setEditTestOutput(e.target.value)}
                                  rows={2}
                                  className="w-full p-1.5 bg-[#171814] border border-[#3e3d32] rounded font-mono text-[10px] text-[#a6e22e]"
                                />
                                <button
                                  onClick={() => handleSaveEditedTest(tc.id)}
                                  className="w-full py-1 rounded bg-[#a6e22e] text-[#272822] font-bold text-[10px]"
                                >
                                  Lưu thay đổi test
                                </button>
                              </div>
                            ) : (
                              <div className="font-mono text-[10px] space-y-0.5 text-[#90908a]">
                                <div className="truncate">
                                  In: <span className="text-[#e6db74]">{tc.input.replace(/\n/g, ' ↵ ')}</span>
                                </div>
                                <div className="truncate">
                                  Out: <span className="text-[#a6e22e] font-bold">{tc.expectedOutput.replace(/\n/g, ' ↵ ')}</span>
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
                  <Upload className="w-10 h-10 text-[#e6db74] mx-auto" />
                  <p className="text-xs text-[#90908a]">Chưa có đề bài. Bấm nút bên dưới để gửi đề và bộ test.</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#a6e22e] text-[#272822] font-bold text-xs"
                  >
                    Gửi Đề Bài Ngay
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RIGHT PANEL: SUBLIME TEXT 4 MONOKAI EDITOR + CONSOLE */}
        <div
          className={`${
            mobilePane === 'problem' ? 'hidden md:flex' : 'flex'
          } flex-1 flex-col bg-[#272822] min-w-0 overflow-hidden`}
        >
          {/* Sublime Editor Pane */}
          <div className={`${mobilePane === 'console' ? 'hidden md:flex' : 'flex'} flex-1 flex-col min-h-0`}>
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
          <div className="bg-[#1e1f1c] border-t border-[#3e3d32] px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleRunCustom}
                disabled={isRunningCustom || isJudging}
                className="px-3.5 py-1.5 rounded-lg bg-[#3e3d32] hover:bg-[#49483e] text-[#f8f8f2] text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-[#a6e22e]" />
                <span>{isRunningCustom ? 'Đang chạy...' : 'Chạy Test (Ctrl+Enter)'}</span>
              </button>

              <button
                onClick={handleJudgeAll}
                disabled={isJudging || isRunningCustom || !problem}
                className="px-4 py-1.5 rounded-lg bg-[#a6e22e] hover:bg-[#b8f242] text-[#272822] text-xs font-bold flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isJudging ? 'Đang chấm...' : `Nộp Chấm (${allTests.length} tests)`}</span>
              </button>
            </div>

            {judgeScore !== null && (
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  judgeVerdict === 'Accepted'
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

          {/* Console / Judge Output */}
          {(isConsoleOpen || mobilePane === 'console') && (
            <div
              className={`${
                mobilePane === 'console' ? 'flex-1 md:flex-none md:h-48' : 'hidden md:flex md:h-48'
              } bg-[#171814] border-t border-[#3e3d32] flex-col font-mono text-xs text-[#f8f8f2] shrink-0 overflow-hidden`}
            >
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#3e3d32] bg-[#1e1f1c]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConsoleTab('output')}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                      consoleTab === 'output' ? 'bg-[#3e3d32] text-[#e6db74]' : 'text-[#90908a] hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3 h-3 inline mr-1" />
                    Stdin / Output
                  </button>
                  <button
                    onClick={() => setConsoleTab('judge')}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                      consoleTab === 'judge' ? 'bg-[#3e3d32] text-[#a6e22e]' : 'text-[#90908a] hover:text-white'
                    }`}
                  >
                    Kết quả Chấm ({judgeResults ? `${judgeResults.filter((r) => r.passed).length}/${judgeResults.length}` : allTests.length})
                  </button>
                </div>
                {customRuntimeMs !== null && consoleTab === 'output' && (
                  <span className="text-[10px] text-[#66d9ef]">{customRuntimeMs}ms</span>
                )}
              </div>

              {consoleTab === 'output' ? (
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-2.5 overflow-hidden">
                  <div className="flex flex-col min-h-0">
                    <span className="text-[#90908a] text-[10px] mb-1">Standard Input (stdin):</span>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Nhập input chạy thử..."
                      className="flex-1 p-2 bg-[#272822] border border-[#3e3d32] rounded-lg text-[#f8f8f2] text-xs font-mono resize-none focus:outline-none focus:border-[#66d9ef]"
                    />
                  </div>
                  <div className="flex flex-col min-h-0">
                    <span className="text-[#90908a] text-[10px] mb-1">Output / Compiler Log:</span>
                    <div className="flex-1 p-2 bg-[#272822] border border-[#3e3d32] rounded-lg text-xs font-mono whitespace-pre-wrap overflow-y-auto">
                      {customStderr ? (
                        <span className="text-[#f92672]">{customStderr}</span>
                      ) : customOutput ? (
                        <span className="text-[#a6e22e]">{customOutput}</span>
                      ) : (
                        <span className="text-[#75715e]">// Kết quả thực thi C++ / Python sẽ hiện tại đây...</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                  {judgeResults && judgeResults.length > 0 ? (
                    judgeResults.map((tr, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          tr.passed
                            ? 'bg-[#a6e22e]/10 border-[#a6e22e]/30 text-[#a6e22e]'
                            : 'bg-[#f92672]/10 border-[#f92672]/30 text-[#f92672]'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold shrink-0">
                          {tr.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>Test #{i + 1}: {tr.status}</span>
                          <span className="text-[10px] font-normal text-[#90908a]">({tr.runtimeMs}ms)</span>
                        </div>
                        {!tr.passed && (
                          <div className="text-[10px] text-[#f8f8f2] truncate">
                            Exp: <span className="text-[#a6e22e]">{tr.expected.replace(/\n/g, ' ')}</span> | Got:{' '}
                            <span className="text-[#f92672]">{tr.actual.replace(/\n/g, ' ')}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-[#75715e]">
                      Bấm "Nộp Chấm" để chạy kiểm tra toàn bộ test cases.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
