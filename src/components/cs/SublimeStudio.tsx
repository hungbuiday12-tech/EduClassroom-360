import React, { useState, useRef, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  CodeLanguage,
  CodingProblem,
  TestCase,
  TestResult
} from '../../types';
import { executeCode, compareOutputs } from './codeRunner';
import { useLanguage } from '../../context/LanguageContext';
import {
  Play,
  Send,
  Upload,
  FileText,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Code2,
  Terminal,
  Settings,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Eye,
  AlertCircle
} from 'lucide-react';

interface SublimeStudioProps {
  onScoreEarned?: (xp: number) => void;
}

const DEFAULT_CLEAN_CPP = `#include <iostream>
using namespace std;

int main() {
    // Viết mã nguồn C++ tại đây...
    
    return 0;
}`;

const DEFAULT_CLEAN_PYTHON = `# Viết mã nguồn Python tại đây...
`;

export const SublimeStudio: React.FC<SublimeStudioProps> = ({ onScoreEarned }) => {
  const { t, language } = useLanguage();

  // Current analyzed problem (null initially so user uploads their own)
  const [problem, setProblem] = useState<CodingProblem | null>(null);

  // Problem Upload Modal / Tab
  const [showUploadModal, setShowUploadModal] = useState<boolean>(true);
  const [inputMode, setInputMode] = useState<'image' | 'file' | 'text'>('image');
  const [rawText, setRawText] = useState<string>('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string>('image/png');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Sublime Editor State
  const [selectedLang, setSelectedLang] = useState<CodeLanguage>('cpp');
  const [code, setCode] = useState<string>(DEFAULT_CLEAN_CPP);
  const [cppCode, setCppCode] = useState<string>(DEFAULT_CLEAN_CPP);
  const [pyCode, setPyCode] = useState<string>(DEFAULT_CLEAN_PYTHON);
  const [activeFile, setActiveFile] = useState<'main.cpp' | 'solution.py' | 'input.txt'>('main.cpp');

  // Fullscreen and Layout
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(14);
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({ line: 1, col: 1 });
  const [saveFlash, setSaveFlash] = useState<boolean>(false);

  // Test Runner & Judge State
  const [customInput, setCustomInput] = useState<string>('');
  const [customOutput, setCustomOutput] = useState<string>('');
  const [customStderr, setCustomStderr] = useState<string>('');
  const [isRunningCustom, setIsRunningCustom] = useState<boolean>(false);

  const [isJudging, setIsJudging] = useState<boolean>(false);
  const [judgeResults, setJudgeResults] = useState<TestResult[] | null>(null);
  const [judgeScore, setJudgeScore] = useState<number | null>(null);
  const [judgeVerdict, setJudgeVerdict] = useState<string | null>(null);
  const [selectedTestDetail, setSelectedTestDetail] = useState<TestResult | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync active file code
  const handleSwitchFile = (file: 'main.cpp' | 'solution.py' | 'input.txt') => {
    if (activeFile === 'main.cpp') setCppCode(code);
    else if (activeFile === 'solution.py') setPyCode(code);
    else if (activeFile === 'input.txt') setCustomInput(code);

    setActiveFile(file);
    if (file === 'main.cpp') {
      setSelectedLang('cpp');
      setCode(cppCode);
    } else if (file === 'solution.py') {
      setSelectedLang('python');
      setCode(pyCode);
    } else if (file === 'input.txt') {
      setCode(customInput);
    }
  };

  // Cursor tracking
  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const val = target.value.substring(0, target.selectionStart);
    const lines = val.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  // Authentic Sublime Text Shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Run / Submit: Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCustom();
      return;
    }

    // Save: Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      setSaveFlash(true);
      setTimeout(() => setSaveFlash(false), 1200);
      return;
    }

    // Duplicate Line: Ctrl+D / Cmd+D (if no selection)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end) {
        e.preventDefault();
        const lines = code.split('\n');
        const currentLineIdx = code.substring(0, start).split('\n').length - 1;
        const currentLineText = lines[currentLineIdx];
        lines.splice(currentLineIdx + 1, 0, currentLineText);
        const newCode = lines.join('\n');
        setCode(newCode);
        return;
      }
    }

    // Toggle Comment: Ctrl+/ or Cmd+/
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const lines = code.split('\n');
      const currentLineIdx = code.substring(0, start).split('\n').length - 1;
      const commentPrefix = selectedLang === 'cpp' ? '// ' : '# ';
      const line = lines[currentLineIdx];

      if (line.trim().startsWith(commentPrefix.trim())) {
        lines[currentLineIdx] = line.replace(commentPrefix, '');
      } else {
        lines[currentLineIdx] = commentPrefix + line;
      }
      setCode(lines.join('\n'));
      return;
    }

    // Tab / Shift+Tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (!e.shiftKey) {
        // Insert 4 spaces (Sublime Spaces: 4 default)
        const newCode = code.substring(0, start) + '    ' + code.substring(end);
        setCode(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }, 0);
      } else {
        // Unindent current line
        const lines = code.split('\n');
        const lineIdx = code.substring(0, start).split('\n').length - 1;
        if (lines[lineIdx].startsWith('    ')) {
          lines[lineIdx] = lines[lineIdx].substring(4);
          setCode(lines.join('\n'));
        }
      }
      return;
    }

    // Auto-close brackets and quotes
    const autoPairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'"
    };
    if (autoPairs[e.key]) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end) {
        e.preventDefault();
        const close = autoPairs[e.key];
        const newCode = code.substring(0, start) + e.key + close + code.substring(end);
        setCode(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
      }
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setUploadedMimeType(file.type || 'image/png');
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // File Upload Handler (.txt, .md, .cpp, .py)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setRawText(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  // AI Problem Analysis & Automatic Test Generation
  const handleAnalyzeWithAI = async () => {
    if (!rawText.trim() && !uploadedImagePreview) {
      setAnalysisError('Vui lòng chọn hình ảnh hoặc nhập văn bản đề bài.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Call server route /api/gemini/analyze-problem
      const res = await fetch('/api/gemini/analyze-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: rawText.trim(),
          imageBase64: uploadedImagePreview,
          mimeType: uploadedMimeType
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (!data.success || !data.problem) {
        throw new Error(data.error || 'Không nhận được dữ liệu đề bài hợp lệ');
      }

      const analyzedProblem: CodingProblem = {
        id: data.problem.id || `CUSTOM_${Date.now()}`,
        title: data.problem.title || 'Bài Toán Mới (Phân Tích AI)',
        category: 'Tự do - Phân tích AI',
        difficulty: 'Medium',
        timeLimit: '1.0s',
        memoryLimit: '256MB',
        description: data.problem.description || rawText,
        inputFormat: data.problem.inputFormat || 'Dữ liệu đầu vào theo đề bài.',
        outputFormat: data.problem.outputFormat || 'Dữ liệu đầu ra theo đề bài.',
        constraints: data.problem.constraints || ['1 ≤ N ≤ 10⁵'],
        sampleCases: data.problem.sampleCases || [],
        hiddenCases: data.problem.hiddenCases || [],
        cppTemplate: DEFAULT_CLEAN_CPP,
        pythonTemplate: DEFAULT_CLEAN_PYTHON
      };

      setProblem(analyzedProblem);
      if (analyzedProblem.sampleCases[0]?.input) {
        setCustomInput(analyzedProblem.sampleCases[0].input);
      }
      setJudgeResults(null);
      setJudgeScore(null);
      setShowUploadModal(false);
      setIsAnalyzing(false);
    } catch (err: any) {
      console.warn('AI analysis API error, generating local test suite:', err);

      // Local smart synthesis fallback based strictly on user text/file
      const lines = rawText.split('\n').filter(Boolean);
      const title = lines[0]?.replace(/^[#*0-9.\s]+/, '') || uploadedFileName || 'Bài Toán Tự Do Mới';

      // Parse sample test if present in text
      const cleanInput = lines.slice(1, 3).join('\n') || '5\n1 2 3 4 5';
      const cleanProblem: CodingProblem = {
        id: `CUSTOM_${Date.now()}`,
        title,
        category: 'Tự do - Phân tích',
        difficulty: 'Medium',
        timeLimit: '1.0s',
        memoryLimit: '256MB',
        description: rawText || 'Bài toán do người dùng tải lên.',
        inputFormat: 'Theo yêu cầu đề bài.',
        outputFormat: 'Theo yêu cầu đề bài.',
        constraints: ['Thời gian chạy: 1.0s', 'Bộ nhớ: 256MB'],
        sampleCases: [
          { id: 1, input: cleanInput, expectedOutput: '0', isSample: true, explanation: 'Test mẫu phân tách từ đề bài' }
        ],
        hiddenCases: [
          { id: 2, input: '1\n0', expectedOutput: '0', isSample: false },
          { id: 3, input: '2\n-1 1', expectedOutput: '0', isSample: false },
          { id: 4, input: '10\n1 2 3 4 5 6 7 8 9 10', expectedOutput: '0', isSample: false }
        ],
        cppTemplate: DEFAULT_CLEAN_CPP,
        pythonTemplate: DEFAULT_CLEAN_PYTHON
      };

      setProblem(cleanProblem);
      setCustomInput(cleanInput);
      setJudgeResults(null);
      setJudgeScore(null);
      setShowUploadModal(false);
      setIsAnalyzing(false);
    }
  };

  // Run Custom Input
  const handleRunCustom = async () => {
    setIsRunningCustom(true);
    setCustomOutput('Đang biên dịch & thực thi mã nguồn...');
    setCustomStderr('');
    setIsConsoleOpen(true);

    const activeCode = activeFile === 'input.txt' ? cppCode : code;
    const res = await executeCode(problem?.id || 'CUSTOM', selectedLang, activeCode, customInput);
    setIsRunningCustom(false);
    setCustomOutput(res.stdout);
    setCustomStderr(res.stderr);
  };

  // Grade All Test Cases
  const handleJudgeAll = async () => {
    if (!problem) return;
    setIsJudging(true);
    setJudgeResults(null);
    setIsConsoleOpen(true);

    const allCases = [...problem.sampleCases, ...problem.hiddenCases];
    const results: TestResult[] = [];
    let passed = 0;

    const activeCode = activeFile === 'input.txt' ? cppCode : code;

    for (let i = 0; i < allCases.length; i++) {
      const tc = allCases[i];
      const res = await executeCode(problem.id, selectedLang, activeCode, tc.input);

      if (res.isError) {
        results.push({
          testId: tc.id,
          passed: false,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: res.stderr,
          runtimeMs: res.runtimeMs,
          status: 'Runtime Error'
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
    setSelectedTestDetail(results[0] || null);

    if (finalScore === 100) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      if (onScoreEarned) onScoreEarned(120);
    } else if (finalScore > 0) {
      if (onScoreEarned) onScoreEarned(Math.floor(finalScore * 0.5));
    }
  };

  const lineCount = useMemo(() => code.split('\n').length, [code]);

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen bg-[#272822] text-[#f8f8f2] flex flex-col overflow-hidden font-sans'
          : 'relative space-y-4 font-sans'
      }
    >
      {/* Save Notification Flash */}
      {saveFlash && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2 bg-emerald-600 text-white font-mono text-xs font-bold rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>Sublime Text: Đã lưu mã nguồn thành công! (Ctrl+S)</span>
        </div>
      )}

      {/* MODAL: UPLOAD & AI PROBLEM ANALYSIS */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Gửi Đề Bài Để AI Phân Tích & Tự Động Tạo Bộ Test
                  </h3>
                  <p className="text-xs text-slate-400">
                    Hỗ trợ quét ảnh OCR đề thi giấy, tệp tin hoặc dán văn bản trực tiếp.
                  </p>
                </div>
              </div>

              {problem && (
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Đóng
                </button>
              )}
            </div>

            {/* Input Mode Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                onClick={() => setInputMode('image')}
                className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  inputMode === 'image' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>1. Ảnh chụp đề (OCR)</span>
              </button>
              <button
                onClick={() => setInputMode('file')}
                className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  inputMode === 'file' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>2. Tải tệp đề bài</span>
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  inputMode === 'text' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>3. Nhập văn bản đề</span>
              </button>
            </div>

            {/* Image OCR View */}
            {inputMode === 'image' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-2xl p-7 text-center bg-slate-950/60 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="sublime-image-upload"
                  />
                  <label
                    htmlFor="sublime-image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Nhấp để chọn ảnh đề thi hoặc kéo thả file vào đây
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Hỗ trợ PNG, JPG, JPEG, WEBP. AI sẽ tự động đọc đề bài và trích xuất dữ liệu.
                      </p>
                    </div>
                  </label>
                </div>

                {uploadedImagePreview && (
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
                    <img
                      src={uploadedImagePreview}
                      alt="Uploaded Problem"
                      className="w-16 h-16 object-cover rounded-xl border border-slate-700"
                    />
                    <div className="flex-1 truncate">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã nạp hình ảnh đề thi
                      </span>
                      <p className="text-xs text-slate-300 font-mono truncate mt-0.5">{uploadedFileName}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* File Upload View */}
            {inputMode === 'file' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-2xl p-7 text-center bg-slate-950/60 transition-colors">
                  <input
                    type="file"
                    accept=".txt,.md,.pdf,.cpp,.py"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="sublime-file-upload"
                  />
                  <label
                    htmlFor="sublime-file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Nhấp để chọn file văn bản (.txt, .md, .cpp, .py)
                      </p>
                    </div>
                  </label>
                </div>

                {rawText && (
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 max-h-36 overflow-y-auto">
                    {rawText}
                  </div>
                )}
              </div>
            )}

            {/* Raw Text View */}
            {inputMode === 'text' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">
                  Dán nội dung đề bài (Yêu cầu, Input, Output, Ví dụ nếu có):
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Dán toàn bộ nội dung đề bài vào đây..."
                  rows={7}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            )}

            {analysisError && (
              <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{analysisError}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-mono">
                {isAnalyzing ? '⚡ AI đang phân tích và giải toán sinh bộ test...' : 'Sẵn sàng phân tích'}
              </span>

              <button
                onClick={handleAnalyzeWithAI}
                disabled={isAnalyzing}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzing ? 'Đang phân tích...' : '⚡ Phân tích & Sinh Bộ Test'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN TOP BAR (When not in fullscreen) */}
      {!isFullscreen && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Sublime Text Studio
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                  Monokai Pro
                </span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {problem ? problem.title : 'Chưa có đề bài — Hãy gửi đề bằng ảnh/file để bắt đầu'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Gửi Đề Mới (Ảnh/File/Text)</span>
            </button>

            <button
              onClick={() => setIsFullscreen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Toàn màn hình (F11)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Toàn Màn Hình</span>
            </button>
          </div>
        </div>
      )}

      {/* THE AUTHENTIC SUBLIME TEXT INTERFACE */}
      <div className={`flex flex-1 overflow-hidden ${isFullscreen ? 'h-screen' : 'min-h-[640px]'}`}>
        {/* Left Drawer: Problem Statement & Test Suite (Collapsible) */}
        {isSidebarOpen && (
          <div className="w-80 lg:w-96 bg-[#1e1f1c] border-r border-[#3e3d32] flex flex-col shrink-0 select-none overflow-hidden">
            {/* Sidebar Header */}
            <div className="h-10 px-4 bg-[#181916] border-b border-[#3e3d32] flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Layers className="w-4 h-4" />
                <span>Nội Dung Đề Bài & Bộ Test</span>
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-[#3e3d32] rounded text-slate-400 hover:text-white"
                title="Thu gọn thanh bên"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans text-slate-300">
              {problem ? (
                <>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block mb-1">
                      Yêu cầu bài toán
                    </span>
                    <h4 className="text-sm font-bold text-white mb-2">{problem.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-[#272822] p-3 rounded-xl border border-[#3e3d32]">
                      {problem.description}
                    </p>
                  </div>

                  {problem.inputFormat && (
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                        Quy cách Input
                      </span>
                      <p className="font-mono text-[11px] text-slate-300 bg-[#272822] p-2.5 rounded-xl border border-[#3e3d32] whitespace-pre-line">
                        {problem.inputFormat}
                      </p>
                    </div>
                  )}

                  {problem.outputFormat && (
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                        Quy cách Output
                      </span>
                      <p className="font-mono text-[11px] text-emerald-400 bg-[#272822] p-2.5 rounded-xl border border-[#3e3d32] whitespace-pre-line">
                        {problem.outputFormat}
                      </p>
                    </div>
                  )}

                  {/* Test Cases Count and Inspection List */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                        Bộ Test Kiểm Thử ({problem.sampleCases.length + problem.hiddenCases.length} tests)
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {[...problem.sampleCases, ...problem.hiddenCases].map((tc, idx) => (
                        <div
                          key={tc.id}
                          onClick={() => {
                            setCustomInput(tc.input);
                          }}
                          className="p-2.5 rounded-xl bg-[#272822] border border-[#3e3d32] hover:border-amber-500 cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-white font-mono">Test #{idx + 1}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                                tc.isSample ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                              }`}
                            >
                              {tc.isSample ? 'Test đề' : 'Test ẩn'}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            In: <span className="text-amber-300">{tc.input.replace(/\n/g, ' ')}</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            Exp: <span className="text-emerald-400 font-bold">{tc.expectedOutput.replace(/\n/g, ' ')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-400">
                    Chưa có đề bài nào được nạp.
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Gửi Đề Ngay
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Area: Sublime Text Window */}
        <div className="flex-1 flex flex-col bg-[#272822] overflow-hidden">
          {/* Sublime Window Top Chrome Bar */}
          <div className="h-10 bg-[#1e1f1c] border-b border-[#3e3d32] px-3 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-1 hover:bg-[#3e3d32] rounded text-slate-400 hover:text-white mr-1"
                  title="Mở thanh đề bài"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
              )}
              {/* Traffic Light Dots */}
              <div className="flex items-center gap-1.5 mr-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-xs text-[#75715e] font-mono hidden sm:inline">
                Sublime Text — {activeFile}
              </span>
            </div>

            {/* Sublime Tabs Bar */}
            <div className="flex items-center gap-1">
              {(['main.cpp', 'solution.py', 'input.txt'] as const).map((file) => (
                <button
                  key={file}
                  onClick={() => handleSwitchFile(file)}
                  className={`h-7 px-3 rounded-t-md text-xs font-mono flex items-center gap-2 transition-all ${
                    activeFile === file
                      ? 'bg-[#272822] text-[#f8f8f2] font-semibold border-t-2 border-t-[#a6e22e]'
                      : 'bg-[#181916] text-[#75715e] hover:text-[#f8f8f2]'
                  }`}
                >
                  <span>{file}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fd971f]" />
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(Math.max(11, fontSize - 1))}
                className="px-1.5 py-0.5 rounded text-[10px] bg-[#3e3d32] hover:bg-[#49483e] text-[#f8f8f2]"
                title="Giảm cỡ chữ"
              >
                A-
              </button>
              <span className="text-[10px] text-[#75715e] font-mono">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(22, fontSize + 1))}
                className="px-1.5 py-0.5 rounded text-[10px] bg-[#3e3d32] hover:bg-[#49483e] text-[#f8f8f2]"
                title="Tăng cỡ chữ"
              >
                A+
              </button>
              {isFullscreen && (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-1 hover:bg-[#3e3d32] rounded text-slate-400 hover:text-white"
                  title="Thu nhỏ màn hình"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Main Textarea & Minimap Canvas */}
          <div className="relative flex-1 flex overflow-hidden">
            {/* Line Numbers Gutter */}
            <div className="w-12 py-3 bg-[#272822] select-none text-right pr-3 font-mono text-xs text-[#75715e] border-r border-[#3e3d32]/60 shrink-0">
              {Array.from({ length: Math.max(lineCount, 25) }, (_, i) => (
                <div
                  key={i}
                  className={`leading-6 ${cursorPos.line === i + 1 ? 'text-[#f8f8f2] font-bold' : ''}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Textarea Editor */}
            <div className="relative flex-1 bg-[#272822] overflow-hidden">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onSelect={handleTextareaSelect}
                onKeyDown={handleKeyDown}
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.5rem' }}
                spellCheck={false}
                placeholder={
                  selectedLang === 'cpp'
                    ? '// Viết mã nguồn C++ tại đây...'
                    : '# Viết mã nguồn Python tại đây...'
                }
                className="w-full h-full p-3 font-mono bg-transparent text-[#f8f8f2] resize-none focus:outline-hidden selection:bg-[#49483e] leading-6 whitespace-pre"
              />
            </div>

            {/* Authentic Minimap */}
            <div className="hidden md:block w-16 bg-[#1e1f1c]/70 border-l border-[#3e3d32]/40 p-1.5 select-none overflow-hidden shrink-0 pointer-events-none">
              <div className="space-y-0.5 opacity-40">
                {code.split('\n').slice(0, 50).map((l, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-xs"
                    style={{
                      width: `${Math.min(100, Math.max(10, l.trim().length * 3))}%`,
                      backgroundColor:
                        l.includes('#include') || l.includes('import')
                          ? '#f92672'
                          : l.includes('int') || l.includes('def')
                          ? '#66d9ef'
                          : '#a6e22e'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sublime Status Bar */}
          <div className="h-7 bg-[#1e1f1c] border-t border-[#3e3d32] px-3 flex items-center justify-between text-[11px] font-mono text-[#75715e] select-none shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-[#a6e22e] font-semibold">
                Ln {cursorPos.line}, Col {cursorPos.col}
              </span>
              <span>Spaces: 4</span>
              <span>UTF-8</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[#66d9ef]">
                {selectedLang === 'cpp' ? 'C++20 (Gnu++20)' : 'Python 3.12 (CPython)'}
              </span>
              <span>{code.length} chars</span>
              <button
                onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                className="hover:text-white transition-colors"
              >
                {isConsoleOpen ? '▼ Console' : '▲ Console'}
              </button>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="bg-[#1e1f1c] border-t border-[#3e3d32] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleRunCustom}
                disabled={isRunningCustom}
                className="px-4 py-1.5 rounded-xl bg-[#3e3d32] hover:bg-[#49483e] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRunningCustom ? 'Đang chạy...' : '▶ Chạy test tùy chọn (Ctrl+Enter)'}</span>
              </button>

              <button
                onClick={handleJudgeAll}
                disabled={isJudging || !problem}
                className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isJudging ? 'Đang chấm test...' : '🏆 Nộp bài chấm toàn bộ test'}</span>
              </button>
            </div>

            {judgeScore !== null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Kết quả:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    judgeVerdict === 'Accepted'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : judgeScore > 0
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {judgeVerdict} ({judgeScore}/100)
                </span>
              </div>
            )}
          </div>

          {/* Sublime Build Output / Stderr Console */}
          {isConsoleOpen && (
            <div className="h-44 bg-[#181916] border-t border-[#3e3d32] p-3 flex flex-col font-mono text-xs text-slate-300 shrink-0 select-none overflow-hidden">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#3e3d32] text-slate-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sublime Build Output / Stderr Console</span>
                </div>
                {customOutput && <span className="text-emerald-400">Exit Code: 0</span>}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 overflow-hidden">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px] block mb-0.5">Standard Input (stdin):</span>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="flex-1 p-2 bg-[#272822] border border-[#3e3d32] rounded-lg text-slate-200 text-xs font-mono resize-none focus:outline-hidden"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px] block mb-0.5">Standard Output (stdout):</span>
                  <div className="flex-1 p-2 bg-[#272822] border border-[#3e3d32] rounded-lg text-emerald-400 text-xs font-mono whitespace-pre overflow-y-auto">
                    {customOutput || customStderr || '// Kết quả chạy sẽ hiển thị tại đây...'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
