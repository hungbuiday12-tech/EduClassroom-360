import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CODING_PROBLEMS } from '../../data/curriculumData';
import { CodeLanguage, CodingProblem, SubmissionRecord, TestResult } from '../../types';
import { executeCode, judgeProblem } from './codeRunner';
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
  Sparkles
} from 'lucide-react';

interface CodeJudgeLabProps {
  onScoreEarned?: (xp: number) => void;
}

export const CodeJudgeLab: React.FC<CodeJudgeLabProps> = ({ onScoreEarned }) => {
  const [selectedProblemId, setSelectedProblemId] = useState<string>('SUM2');
  const problem = CODING_PROBLEMS.find((p) => p.id === selectedProblemId) || CODING_PROBLEMS[0];

  const [language, setLanguage] = useState<CodeLanguage>('cpp');
  const [code, setCode] = useState<string>(problem.cppTemplate);
  const [fontSize, setFontSize] = useState<number>(14);

  // Bottom tabs: 'custom_run' | 'judge_results' | 'history'
  const [activeConsoleTab, setActiveConsoleTab] = useState<'custom_run' | 'judge_results' | 'history'>('custom_run');

  // Custom Run state
  const [customInput, setCustomInput] = useState<string>(problem.sampleCases[0]?.input || '');
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

  // When problem or language changes, load default template
  const handleProblemChange = (prob: CodingProblem) => {
    setSelectedProblemId(prob.id);
    setCode(language === 'cpp' ? prob.cppTemplate : prob.pythonTemplate);
    setCustomInput(prob.sampleCases[0]?.input || '');
    setCustomOutput('');
    setCustomStderr('');
    setCustomRuntime(null);
    setJudgeResults(null);
    setJudgeScore(null);
  };

  const handleLanguageChange = (lang: CodeLanguage) => {
    setLanguage(lang);
    setCode(lang === 'cpp' ? problem.cppTemplate : problem.pythonTemplate);
  };

  const handleResetTemplate = () => {
    setCode(language === 'cpp' ? problem.cppTemplate : problem.pythonTemplate);
  };

  // Run with custom stdin
  const handleRunCustom = async () => {
    setIsRunningCustom(true);
    setActiveConsoleTab('custom_run');
    setCustomOutput('Đang biên dịch và thực thi...');
    setCustomStderr('');

    const res = await executeCode(problem.id, language, code, customInput);
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

    const result = await judgeProblem(problem, language, code);
    setIsJudging(false);
    setJudgeResults(result.results);
    setJudgeScore(result.score);
    setJudgeVerdict(result.verdict);

    // Save submission
    const newSub: SubmissionRecord = {
      id: Date.now().toString(),
      problemId: problem.id,
      problemTitle: problem.title,
      language,
      passedCount: result.passedCount,
      totalCount: result.totalCount,
      score: result.score,
      status: result.verdict === 'Accepted' ? 'Accepted' : result.score > 0 ? 'Partial' : 'Wrong Answer',
      submittedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
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
      if (onScoreEarned) onScoreEarned(result.score);
    }
  };

  // Handle Tab key in editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      target.value = val.substring(0, start) + '    ' + val.substring(end);
      target.selectionStart = target.selectionEnd = start + 4;
      setCode(target.value);
    }
    // Ctrl+Enter or Cmd+Enter to Run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCustom();
    }
  };

  return (
    <div className="space-y-6">
      {/* Subject Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-500" />
            Lập trình thi đấu & Chấm test trực tuyến (Online Judge)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Không gian viết mã nguồn C++ và Python, hệ thống nộp bài tự động chấm ngầm nhiều test cases
          </p>
        </div>

        {/* Problem Selector Bar */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto max-w-full">
          {CODING_PROBLEMS.map((p) => {
            const isSel = p.id === selectedProblemId;
            return (
              <button
                key={p.id}
                onClick={() => handleProblemChange(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  isSel
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {p.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split: Left Statement, Right IDE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Problem Statement */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {problem.category}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                problem.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' :
                problem.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
              }`}>
                {problem.difficulty}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
              {problem.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 font-mono tabular-nums">
              <span>Giới hạn thời gian: {problem.timeLimit}</span>
              <span aria-hidden="true">·</span>
              <span>Bộ nhớ: {problem.memoryLimit}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">
              Mô tả bài toán
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {problem.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">
              Định dạng dữ liệu
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
              <strong>Đầu vào:</strong> {problem.inputFormat}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              <strong>Đầu ra:</strong> {problem.outputFormat}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">
              Ràng buộc dữ liệu
            </h3>
            <ul className="list-disc list-inside text-xs font-mono text-slate-600 dark:text-slate-400 space-y-0.5">
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Sample Cases */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Ví dụ mẫu (Sample Tests)
            </h3>
            {problem.sampleCases.map((sc, i) => (
              <div key={sc.id} className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-3 border border-slate-100 dark:border-slate-800 text-xs font-mono">
                <div className="text-[11px] font-semibold text-slate-500 mb-2">
                  Test #{i + 1}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Input</span>
                    <pre className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 mt-1 whitespace-pre-wrap">
                      {sc.input}
                    </pre>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Output</span>
                    <pre className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 mt-1 whitespace-pre-wrap text-emerald-600 dark:text-emerald-400 font-semibold">
                      {sc.expectedOutput}
                    </pre>
                  </div>
                </div>
                {sc.explanation && (
                  <p className="text-[11px] text-slate-500 font-sans mt-2">
                    Giải thích: {sc.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Code Editor + Runner & Judge Console */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          {/* Editor Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => handleLanguageChange('cpp')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  language === 'cpp'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 text-blue-500" />
                C++ (G++ 17)
              </button>
              <button
                onClick={() => handleLanguageChange('python')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  language === 'python'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 text-amber-500" />
                Python 3
              </button>
            </div>

            {/* Actions: Reset, Font, Run, Submit */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetTemplate}
                title="Khôi phục mã mẫu gốc"
                className="p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <select
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-slate-700 dark:text-slate-300"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
              </select>

              <button
                onClick={handleRunCustom}
                disabled={isRunningCustom || isJudging}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                Chạy thử
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isRunningCustom || isJudging}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                Nộp bài (Submit)
              </button>
            </div>
          </div>

          {/* Code Textarea Area */}
          <div className="relative flex bg-slate-950 text-slate-100 font-mono">
            {/* Line numbers column */}
            <div className="py-3 px-2 text-right select-none text-slate-600 text-xs border-r border-slate-800 font-mono w-10">
              {code.split('\n').map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Editable code area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="flex-1 w-full h-[360px] p-3 bg-transparent text-slate-100 font-mono resize-none focus:outline-none leading-6 text-xs whitespace-pre"
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>

          {/* Console / Judge Results Panel */}
          <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col">
            {/* Tabs */}
            <div className="flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-4 text-xs font-medium">
                <button
                  onClick={() => setActiveConsoleTab('custom_run')}
                  className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeConsoleTab === 'custom_run'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Chạy thử (Custom Input)
                </button>

                <button
                  onClick={() => setActiveConsoleTab('judge_results')}
                  className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeConsoleTab === 'judge_results'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  Chấm Test ({judgeScore !== null ? `${judgeScore}/100` : 'Chưa nộp'})
                </button>

                <button
                  onClick={() => setActiveConsoleTab('history')}
                  className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeConsoleTab === 'history'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Lịch sử ({submissions.length})
                </button>
              </div>

              {judgeScore !== null && (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className={`font-bold ${
                    judgeScore === 100 ? 'text-emerald-600 dark:text-emerald-400' :
                    judgeScore > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {judgeVerdict} ({judgeScore}/100)
                  </span>
                </div>
              )}
            </div>

            {/* Tab 1: Custom Run */}
            {activeConsoleTab === 'custom_run' && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Dữ liệu đầu vào (Standard Input):
                  </span>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    rows={4}
                    placeholder="Nhập stdin tại đây..."
                    className="w-full text-xs font-mono p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Kết quả in ra (Standard Output):
                    </span>
                    {customRuntime !== null && (
                      <span className="text-[11px] font-mono text-slate-400">
                        {customRuntime}ms
                      </span>
                    )}
                  </div>
                  <pre className="w-full h-24 p-2.5 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg overflow-y-auto whitespace-pre-wrap border border-slate-800">
                    {customStderr ? (
                      <span className="text-red-400">{customStderr}</span>
                    ) : customOutput ? (
                      customOutput
                    ) : (
                      <span className="text-slate-600">Nhấn "Chạy thử" để xem output...</span>
                    )}
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 2: Judge Results Matrix */}
            {activeConsoleTab === 'judge_results' && (
              <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
                {isJudging ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2" />
                    Đang chấm các test cases ngầm...
                  </div>
                ) : judgeResults ? (
                  <div className="space-y-2">
                    {judgeResults.map((r, i) => (
                      <div
                        key={r.testId}
                        className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between ${
                          r.passed
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300'
                            : 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-900 dark:text-red-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {r.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                          )}
                          <div>
                            <span className="font-semibold">Test #{i + 1}: {r.status}</span>
                            <span className="text-slate-400 mx-2">·</span>
                            <span className="text-slate-500 text-[11px]">
                              Input: <code className="bg-black/10 px-1 rounded">{r.input.length > 20 ? r.input.slice(0, 20) + '...' : r.input}</code>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          <span className="text-[11px] text-slate-500">
                            {r.runtimeMs}ms
                          </span>
                          {!r.passed && (
                            <div className="text-[11px] text-red-600">
                              Kỳ vọng: {r.expected} | Nhận: {r.actual}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">
                    Chưa có kết quả chấm. Hãy nhấn nút "Nộp bài (Submit)" ở trên để chấm toàn bộ test cases!
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: History */}
            {activeConsoleTab === 'history' && (
              <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
                {submissions.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    Chưa có bài nộp nào trong phiên học này.
                  </div>
                ) : (
                  submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}>
                          {sub.status}
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold font-sans">
                          {sub.problemTitle}
                        </span>
                        <span className="text-slate-400 uppercase text-[10px]">
                          [{sub.language}]
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                        <span>Điểm: {sub.score}/100</span>
                        <span>Đúng: {sub.passedCount}/{sub.totalCount} test</span>
                        <span>{sub.submittedAt}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
