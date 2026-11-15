import React, { useState } from 'react';
import { CodeLanguage, TestResult } from '../../types';
import { CodeMistakeAnalysis } from './problemAnalyzer';
import { MonokaiCodeBlock } from './SublimeEditor';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Code2,
  Loader2,
  RefreshCw,
  Sparkles,
  Wrench,
  XCircle
} from 'lucide-react';

interface CodeMistakeAnalysisPanelProps {
  score: number | null;
  verdict: string | null;
  results: TestResult[] | null;
  language: CodeLanguage;
  analysis: CodeMistakeAnalysis | null;
  isAnalyzingMistake: boolean;
  onRetryAnalyze?: () => void;
  onApplySampleCode?: (code: string) => void;
  darkSurface?: boolean;
}

export const CodeMistakeAnalysisPanel: React.FC<CodeMistakeAnalysisPanelProps> = ({
  score,
  verdict,
  results,
  language,
  analysis,
  isAnalyzingMistake,
  onRetryAnalyze,
  onApplySampleCode,
  darkSurface = false
}) => {
  const [copiedSample, setCopiedSample] = useState(false);

  if (score === null || !results) return null;

  const passedCount = results.filter((r) => r.passed).length;
  const failedResults = results
    .map((r, idx) => ({ ...r, testNumber: idx + 1 }))
    .filter((r) => !r.passed);

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 1800);
  };

  const containerCls = darkSurface
    ? 'bg-[#1e1f1c] border border-[#3e3d32] text-[#f8f8f2] rounded-2xl p-4 sm:p-5 space-y-5'
    : 'bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl p-4 sm:p-5 space-y-5 shadow-xs';

  const subCardCls = darkSurface
    ? 'bg-[#272822] border border-[#3e3d32] rounded-xl p-3.5'
    : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 rounded-xl p-3.5';

  return (
    <div className={containerCls}>
      {/* 1. Score Banner & Verdict */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-[#3e3d32]">
        <div className="flex flex-wrap items-center gap-3">
          {score === 100 ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-extrabold">
                Kết Quả Chấm Bài: <span className="font-mono tabular-nums">{score} / 100 Điểm</span>
              </h3>
              <span
                className={`text-xs font-mono font-bold ${
                  verdict === 'Accepted'
                    ? 'text-emerald-500'
                    : score > 0
                    ? 'text-amber-500'
                    : 'text-rose-500'
                }`}
              >
                · {verdict}
              </span>
            </div>
            <p className={`text-xs mt-0.5 tabular-nums ${darkSurface ? 'text-[#90908a]' : 'text-slate-500 dark:text-slate-400'}`}>
              Đạt {passedCount}/{results.length} test case
              {failedResults.length > 0
                ? ` · Sai ${failedResults.length} test (${failedResults.map((f) => `#${f.testNumber}`).join(', ')})`
                : ' · Vượt qua toàn bộ test mẫu & test ẩn'}
            </p>
          </div>
        </div>

        {onRetryAnalyze && (
          <button
            type="button"
            onClick={onRetryAnalyze}
            disabled={isAnalyzingMistake}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
              darkSurface
                ? 'bg-[#272822] hover:bg-[#3e3d32] border border-[#3e3d32] text-[#66d9ef]'
                : 'bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzingMistake ? 'animate-spin' : ''}`} />
            <span>{isAnalyzingMistake ? 'AI đang phân tích...' : 'Phân tích AI lại'}</span>
          </button>
        )}
      </div>

      {/* 2. All Tests Overview Grid (Progressive Difficulty Ladder) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {results.map((tr, i) => (
          <div
            key={i}
            className={`p-2.5 rounded-xl border font-mono text-xs flex flex-col gap-1 ${
              tr.passed
                ? darkSurface
                  ? 'bg-[#a6e22e]/10 border-[#a6e22e]/35 text-[#a6e22e]'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : darkSurface
                ? 'bg-[#f92672]/10 border-[#f92672]/40 text-[#f92672]'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
            }`}
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="font-bold flex items-center gap-1">
                {tr.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                Test #{i + 1}
              </span>
              <span className="text-[10px] tabular-nums">{tr.passed ? `${tr.runtimeMs}ms` : tr.status}</span>
            </div>
            {tr.difficulty && (
              <div className={`text-[10px] font-sans font-semibold ${darkSurface ? 'text-[#90908a]' : 'text-slate-500 dark:text-slate-400'}`}>
                Mức: {tr.difficulty}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. Detailed Failed Tests Comparison */}
      {failedResults.length > 0 && (
        <div className="space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
            <XCircle className="w-4 h-4" />
            <span>Chi Tiết Các Test Bị Sai ({failedResults.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {failedResults.slice(0, 6).map((ft) => (
              <div key={ft.testNumber} className={`${subCardCls} space-y-2 font-mono text-xs`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-rose-500">
                    Test #{ft.testNumber}{ft.difficulty ? ` (${ft.difficulty})` : ''} · {ft.status}
                  </span>
                  <span className={`text-[10px] tabular-nums ${darkSurface ? 'text-[#90908a]' : 'text-slate-400'}`}>
                    {ft.runtimeMs}ms
                  </span>
                </div>
                <div>
                  <div className={`text-[10px] mb-0.5 ${darkSurface ? 'text-[#90908a]' : 'text-slate-500'}`}>
                    Input:
                  </div>
                  <pre className="p-2 rounded-lg bg-slate-900 text-amber-300 text-[11px] overflow-x-auto max-h-24">
                    {ft.input.trim() || '(trống)'}
                  </pre>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className={`text-[10px] mb-0.5 ${darkSurface ? 'text-[#a6e22e]' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      Đáp án đúng:
                    </div>
                    <pre className="p-2 rounded-lg bg-slate-900 text-emerald-400 text-[11px] overflow-x-auto max-h-24">
                      {ft.expected.trim() || '(trống)'}
                    </pre>
                  </div>
                  <div>
                    <div className="text-[10px] mb-0.5 text-rose-500">Code bạn in ra:</div>
                    <pre className="p-2 rounded-lg bg-slate-900 text-rose-400 text-[11px] overflow-x-auto max-h-24 whitespace-pre-wrap">
                      {ft.actual.trim() || '(không in gì)'}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. AI Mistake Analysis & Simple Sample Code */}
      <div className="pt-2 border-t border-slate-200/60 dark:border-[#3e3d32] space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bot className={`w-5 h-5 ${darkSurface ? 'text-[#66d9ef]' : 'text-blue-600 dark:text-blue-400'}`} />
            <h4 className="text-sm font-extrabold">
              {score < 100
                ? 'Phân Tích Chỗ Sai Trong Code & Code Mẫu Đơn Giản (AI)'
                : 'Nhận Xét & Tối Ưu Hóa Code (AI)'}
            </h4>
          </div>
          {analysis && (
            <span className={`text-[11px] font-mono ${darkSurface ? 'text-[#90908a]' : 'text-slate-500 dark:text-slate-400'}`}>
              {analysis.source === 'ai' ? 'Gemini AI' : 'Kiểm tra cục bộ'}
            </span>
          )}
        </div>

        {isAnalyzingMistake ? (
          <div className={`${subCardCls} flex items-center gap-3 py-5`}>
            <Loader2 className="w-5 h-5 animate-spin text-blue-500 shrink-0" />
            <div className="text-xs">
              <div className="font-bold">AI đang đối chiếu mã nguồn của bạn với các test bị sai...</div>
              <div className={darkSurface ? 'text-[#90908a]' : 'text-slate-500 dark:text-slate-400'}>
                Đang tìm dòng code lỗi, giải thích nguyên nhân và viết lại code mẫu đơn giản nhất.
              </div>
            </div>
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            {/* Summary */}
            <div className={`${subCardCls} text-xs leading-relaxed`}>
              <div className="font-bold mb-1 flex items-center gap-1.5 text-amber-500">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chẩn đoán tổng quan</span>
              </div>
              <p>{analysis.summary}</p>
            </div>

            {/* Specific Mistakes */}
            {analysis.mistakes.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-rose-500" />
                  <span>Các điểm cần sửa trong code của bạn:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {analysis.mistakes.map((m, idx) => (
                    <div key={idx} className={`${subCardCls} space-y-1.5 text-xs`}>
                      <div className="font-mono text-[11px] font-bold text-amber-500">
                        {idx + 1}. {m.location} · {m.issue}
                      </div>
                      <p className={`leading-relaxed ${darkSurface ? 'text-[#d8d8d0]' : 'text-slate-700 dark:text-slate-300'}`}>
                        {m.explanation}
                      </p>
                      <div className={`text-[11px] font-semibold ${darkSurface ? 'text-[#a6e22e]' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        Cách sửa: {m.fixHint}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simple Sample Code */}
            {analysis.simpleSampleCode && (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-emerald-500" />
                    <span>
                      Code Mẫu Đơn Giản &amp; Dễ Hiểu ({language === 'python' ? 'Python 3' : 'C++17/20'})
                    </span>
                  </div>
                  {onApplySampleCode && (
                    <button
                      type="button"
                      onClick={() => onApplySampleCode(analysis.simpleSampleCode)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        darkSurface
                          ? 'bg-[#a6e22e] hover:bg-[#b8f242] text-[#272822]'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      Nạp Code Mẫu Vào Editor
                    </button>
                  )}
                </div>

                <MonokaiCodeBlock
                  code={analysis.simpleSampleCode}
                  language={language}
                  title={language === 'python' ? 'simple_sample.py' : 'simple_sample.cpp'}
                  onCopy={() => handleCopy(analysis.simpleSampleCode)}
                  copied={copiedSample}
                  maxHeightClass="max-h-[340px]"
                />

                {analysis.simpleCodeExplanation && (
                  <div className={`${subCardCls} text-xs leading-relaxed space-y-1`}>
                    <div className="font-bold text-emerald-500">Giải thích code mẫu đơn giản:</div>
                    <p>{analysis.simpleCodeExplanation}</p>
                    {analysis.complexityNote && (
                      <div className={`text-[11px] font-mono pt-1 ${darkSurface ? 'text-[#66d9ef]' : 'text-blue-600 dark:text-blue-400'}`}>
                        Độ phức tạp: {analysis.complexityNote}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
