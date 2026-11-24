import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  History,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Terminal
} from 'lucide-react';
import { safeFetchJson } from '../../lib/apiClient';
import { CsStepAiTutorPanel } from './CsStepAiTutorPanel';

export interface CodeTraceStep {
  step: number;
  line: number;
  event: string;
  note: string;
  variables: Record<string, any>;
  arrayPreview?: {
    name: string;
    values: number[];
    highlightIndices: number[];
  };
  outputSoFar: string;
}

export interface ThoughtSnapshot {
  id: string;
  timestamp: string;
  eventLabel: string;
  verdictBadge?: string;
  language: 'cpp' | 'python';
  code: string;
  charDelta: number;
}

interface LiveCodeTraceVisualizerProps {
  code: string;
  language: 'cpp' | 'python';
  stdinInput: string;
  isEn?: boolean;
  thoughtHistory: ThoughtSnapshot[];
  onRestoreCode?: (code: string, lang: 'cpp' | 'python') => void;
}

export const LiveCodeTraceVisualizer: React.FC<LiveCodeTraceVisualizerProps> = ({
  code,
  language,
  stdinInput,
  isEn = false,
  thoughtHistory,
  onRestoreCode
}) => {
  const [subTab, setSubTab] = useState<'trace' | 'thought'>('trace');
  const [steps, setSteps] = useState<CodeTraceStep[]>([]);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTracing, setIsTracing] = useState(false);
  const [traceError, setTraceError] = useState<string | null>(null);
  const [traceStdout, setTraceStdout] = useState('');
  const [traceSummary, setTraceSummary] = useState('');

  // Thought-trace scrub index
  const [thoughtIdx, setThoughtIdx] = useState(Math.max(0, thoughtHistory.length - 1));

  useEffect(() => {
    setThoughtIdx(Math.max(0, thoughtHistory.length - 1));
  }, [thoughtHistory.length]);

  const runLiveTrace = async () => {
    if (!code.trim() || isTracing) return;
    setIsTracing(true);
    setTraceError(null);
    setIsPlaying(false);

    const res = await safeFetchJson<{
      success?: boolean;
      summary?: string;
      stdout?: string;
      steps?: CodeTraceStep[];
      error?: string;
    }>(
      '/api/cs/trace-code',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, input: stdinInput })
      },
      20000
    );
    setIsTracing(false);

    if (!res.ok || !res.data?.steps) {
      setTraceError(
        res.error ||
          (isEn ? 'Could not trace code execution.' : 'Không thể truy vết từng dòng mã nguồn.')
      );
      return;
    }

    setSteps(res.data.steps);
    setTraceStdout(res.data.stdout || '');
    setTraceSummary(res.data.summary || '');
    setActiveStepIdx(0);
    setIsPlaying(res.data.steps.length > 1);
  };

  useEffect(() => {
    if (!isPlaying || steps.length <= 1) return;
    const id = setInterval(() => {
      setActiveStepIdx((prev) => {
        if (prev + 1 >= steps.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 650);
    return () => clearInterval(id);
  }, [isPlaying, steps.length]);

  const currentStep = steps[activeStepIdx] || null;
  const codeLines = useMemo(() => code.split('\n'), [code]);
  const activeThought = thoughtHistory[thoughtIdx] || null;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#0b101d] text-slate-100 font-sans text-xs">
      {/* Sub-Header Switch */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-slate-800 bg-slate-900 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSubTab('trace')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 cursor-pointer ${
              subTab === 'trace'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isEn ? 'Code-to-Animation Trace' : 'Chạy Từng Dòng & Hoạt Hình Biến'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('thought')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 cursor-pointer ${
              subTab === 'thought'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>
              {isEn ? 'Thought-Trace Replay' : 'Replay Tư Duy'} ({thoughtHistory.length})
            </span>
          </button>
        </div>

        {subTab === 'trace' && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={runLiveTrace}
              disabled={isTracing}
              className="px-3 py-1 rounded bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isTracing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isTracing ? (isEn ? 'Tracing...' : 'Đang truy vết...') : isEn ? 'Trace My Code' : 'Truy vết Code Ngay'}</span>
            </button>

            {steps.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStepIdx((p) => Math.max(0, p - 1));
                  }}
                  className="p-1 rounded bg-slate-800 border border-slate-700 hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying((v) => !v)}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span className="font-mono text-[10px] tabular-nums">
                    {activeStepIdx + 1}/{steps.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStepIdx((p) => Math.min(steps.length - 1, p + 1));
                  }}
                  className="p-1 rounded bg-slate-800 border border-slate-700 hover:text-white cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {subTab === 'trace' ? (
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5">
          {traceError && (
            <div className="p-2.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 font-mono text-[11px] whitespace-pre-wrap">
              {traceError}
            </div>
          )}

          {steps.length === 0 && !isTracing && !traceError && (
            <div className="py-6 text-center text-slate-400 space-y-2">
              <Code2 className="w-7 h-7 text-cyan-400 mx-auto" />
              <p className="text-xs">
                {isEn
                  ? 'Click "Trace My Code" to animate variables, array pointers & stdout line-by-line.'
                  : 'Bấm "Truy vết Code Ngay" để xem hoạt hình giá trị biến, mảng/DP và con trỏ chạy khớp từng dòng lệnh.'}
              </p>
            </div>
          )}

          {currentStep && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Highlighted Code Lines */}
              <div className="md:col-span-6 rounded border border-slate-800 bg-[#0d1117] p-2 font-mono text-[11px] max-h-48 overflow-y-auto">
                {codeLines.map((lineText, idx) => {
                  const lineNo = idx + 1;
                  const active = currentStep.line === lineNo;
                  return (
                    <div
                      key={lineNo}
                      className={`flex items-start gap-2 px-1.5 py-0.5 rounded ${
                        active ? 'bg-cyan-500/20 text-cyan-200 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <span className="w-6 text-right shrink-0 select-none text-slate-500 tabular-nums">
                        {lineNo}
                      </span>
                      <span className="whitespace-pre truncate">{lineText || ' '}</span>
                    </div>
                  );
                })}
              </div>

              {/* Variables + Animated Array Bars */}
              <div className="md:col-span-6 space-y-2">
                <div className="p-2 rounded border border-slate-800 bg-slate-900/90 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-cyan-300">
                    Step #{currentStep.step} (Line {currentStep.line}): {currentStep.note}
                  </span>
                  {traceSummary && (
                    <span className="text-[10px] text-slate-400 truncate max-w-[160px]">{traceSummary}</span>
                  )}
                </div>

                {/* Variable Inspector */}
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(currentStep.variables || {}).map(([k, v]) => (
                    <div
                      key={k}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[11px]"
                    >
                      <span className="text-amber-300">{k}</span>
                      <span className="text-slate-500"> = </span>
                      <span className="text-emerald-300">
                        {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Array / DP Visual Bars */}
                {currentStep.arrayPreview && currentStep.arrayPreview.values.length > 0 && (
                  <div className="p-2 rounded border border-slate-800 bg-slate-950 space-y-1.5">
                    <div className="text-[10px] font-mono text-slate-400">
                      Array {currentStep.arrayPreview.name}[]
                    </div>
                    <div className="flex items-end gap-1 h-20 pt-2">
                      {(() => {
                        const vals = currentStep.arrayPreview!.values;
                        const maxAbs = Math.max(1, ...vals.map((x) => Math.abs(x)));
                        return vals.map((val, idx) => {
                          const hl = currentStep.arrayPreview!.highlightIndices.includes(idx);
                          const pct = Math.max(15, Math.round((Math.abs(val) / maxAbs) * 100));
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full min-w-[18px]">
                              <div
                                style={{ height: `${pct}%` }}
                                className={`w-full rounded-t transition-all flex items-end justify-center text-[9px] font-mono font-bold pb-0.5 ${
                                  hl ? 'bg-amber-400 text-slate-950' : 'bg-sky-600/75 text-white'
                                }`}
                              >
                                {val}
                              </div>
                              <span className="text-[9px] font-mono text-slate-500 mt-0.5">{idx}</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}

                <div className="p-2 rounded border border-slate-800 bg-black/60 font-mono text-[11px] flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 truncate">
                    {currentStep.outputSoFar || traceStdout || '(no stdout yet)'}
                  </span>
                </div>
              </div>

              <div className="md:col-span-12">
                <CsStepAiTutorPanel
                  isPaused={!isPlaying}
                  simCategory="trace"
                  algorithmName={isEn ? `Code Execution Trace (${language.toUpperCase()})` : `Truy vết thực thi (${language.toUpperCase()})`}
                  stepNumber={activeStepIdx + 1}
                  totalSteps={steps.length}
                  stepTitle={`Line ${currentStep.line}: ${currentStep.note}`}
                  stepDescription={traceSummary || currentStep.note}
                  activeCodeLineText={codeLines[currentStep.line - 1] || ''}
                  variablesSummary={[
                    Object.entries(currentStep.variables || {})
                      .map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
                      .join(', '),
                    currentStep.arrayPreview
                      ? `${currentStep.arrayPreview.name}=[${currentStep.arrayPreview.values.join(', ')}]`
                      : '',
                    currentStep.outputSoFar ? `stdout="${currentStep.outputSoFar}"` : ''
                  ]
                    .filter(Boolean)
                    .join(' | ')}
                  codeSnippet={code}
                  isEn={isEn}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Thought-Trace Replay Panel */
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5">
          {thoughtHistory.length === 0 ? (
            <div className="py-6 text-center text-slate-400 space-y-2">
              <Clock className="w-7 h-7 text-amber-400 mx-auto" />
              <p className="text-xs">
                {isEn
                  ? 'As you edit, run tests, and submit code, every reasoning step is recorded here for replay.'
                  : 'Khi bạn gõ code, chạy thử hoặc Nộp Chấm, mọi bước suy nghĩ & sửa lỗi (WA → AC) sẽ tự động lưu tại đây để tua lại.'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, thoughtHistory.length - 1)}
                  value={thoughtIdx}
                  onChange={(e) => setThoughtIdx(Number(e.target.value))}
                  className="flex-1 accent-amber-400"
                />
                <span className="font-mono text-[11px] text-amber-300 tabular-nums">
                  #{thoughtIdx + 1}/{thoughtHistory.length}
                </span>
                {activeThought && onRestoreCode && (
                  <button
                    type="button"
                    onClick={() => onRestoreCode(activeThought.code, activeThought.language)}
                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{isEn ? 'Restore to Editor' : 'Khôi phục vào Editor'}</span>
                  </button>
                )}
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {thoughtHistory.map((snap, idx) => (
                  <button
                    key={snap.id}
                    type="button"
                    onClick={() => setThoughtIdx(idx)}
                    className={`px-2 py-1 rounded border text-[10px] font-mono whitespace-nowrap cursor-pointer ${
                      idx === thoughtIdx
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {snap.timestamp} · {snap.eventLabel}
                    {snap.verdictBadge ? ` (${snap.verdictBadge})` : ''}
                  </button>
                ))}
              </div>

              {activeThought && (
                <pre className="p-2.5 rounded bg-[#0d1117] border border-slate-800 font-mono text-[11px] text-slate-200 max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {activeThought.code}
                </pre>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
