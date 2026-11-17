import React from 'react';
import { VizStep } from '../types';
import { SegNodeState } from '../generatorsAdvanced';

interface ArrayStringVisualizerProps {
  algoId:
    | 'string_kmp'
    | 'string_palindrome'
    | 'array_prefix_kadane'
    | 'array_two_pointers'
    | 'array_sort_stack'
    | 'binary_search'
    | 'number_sieve'
    | 'tree_segtree';
  step: VizStep;
}

const HudCornerReticles: React.FC = () => (
  <>
    <span className="pointer-events-none absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400/70 rounded-tl-xs z-10" />
    <span className="pointer-events-none absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/70 rounded-tr-xs z-10" />
    <span className="pointer-events-none absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400/55 rounded-bl-xs z-10" />
    <span className="pointer-events-none absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400/55 rounded-br-xs z-10" />
  </>
);

export const ArrayStringVisualizer: React.FC<ArrayStringVisualizerProps> = ({ algoId, step }) => {
  const st = step.state || {};

  // -------------------------------------------------------------------
  // 1. KMP STRING MATCHING
  // -------------------------------------------------------------------
  if (algoId === 'string_kmp') {
    const T: string = st.T || '';
    const P: string = st.P || '';
    const pi: number[] = st.pi || [];
    const phase: string = st.phase || 'pi';
    const i: number = st.i ?? 0;
    const j: number = st.j ?? 0;
    const matches: number[] = st.matches || [];
    const shiftOffset = phase === 'match' ? Math.max(0, i - j + (st.compareOk ? 1 : 0)) : 0;

    return (
      <div className="space-y-5">
        {/* LPS Pi Array */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-emerald-200">
              KMP_PI_TABLE · Hàm tiền tố π cho P = "{P}"
            </span>
            <span className="font-mono text-[11px] text-cyan-300">
              {phase === 'pi' ? 'Đang tính π[i]' : 'Đã hoàn tất π'}
            </span>
          </div>
          <div className="relative overflow-x-auto pb-1">
            <div className="relative inline-flex gap-1.5 min-w-max p-3 rounded-xl border border-emerald-500/30 algo-stage-grid shadow-[inset_0_0_28px_rgba(16,185,129,0.08)]">
              <HudCornerReticles />
              {P.split('').map((ch, idx) => {
                const isActive = phase === 'pi' && (idx === i || idx === j);
                return (
                  <div
                    key={`pi-${idx}`}
                    className={`w-10 rounded-lg border text-center py-1.5 font-mono transition-colors ${
                      idx === i && phase === 'pi'
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                        : idx === j && phase === 'pi'
                        ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                        : 'border-emerald-500/20 bg-[#081529]'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 tabular-nums">{idx}</div>
                    <div className="text-sm font-bold text-white">{ch}</div>
                    <div
                      className={`text-xs font-bold tabular-nums mt-0.5 ${
                        isActive ? 'text-cyan-300' : 'text-emerald-400'
                      }`}
                    >
                      {pi[idx] ?? 0}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Text T and Aligned Sliding Pattern P */}
        <div className="space-y-2 pt-3 border-t border-cyan-500/20">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono font-semibold text-cyan-200">
              TEXT_SCANNER · Đối chiếu T và xâu mẫu P trượt theo π
            </span>
            <span className="font-mono text-emerald-400 font-semibold tabular-nums">
              Đã khớp: {matches.length} vị trí {matches.length ? `(${matches.join(', ')})` : ''}
            </span>
          </div>

          <div className="relative overflow-x-auto pb-2 rounded-xl border border-cyan-500/30 algo-stage-grid p-3.5 shadow-[inset_0_0_28px_rgba(6,182,212,0.08)]">
            <HudCornerReticles />
            <div className="relative z-10 inline-block min-w-max space-y-2">
              {/* Text T row */}
              <div className="flex items-center gap-1">
                <span className="w-7 text-[11px] font-mono font-bold text-cyan-300 shrink-0">T:</span>
                {T.split('').map((ch, idx) => {
                  const inMatchedSpan = matches.some((mStart) => idx >= mStart && idx < mStart + P.length);
                  const isCurrI = phase !== 'pi' && idx === i;
                  return (
                    <div
                      key={`t-${idx}`}
                      className={`w-8 h-11 rounded-md border flex flex-col items-center justify-center font-mono transition-colors ${
                        isCurrI
                          ? st.compareOk === false
                            ? 'border-rose-400 bg-rose-500/20 text-rose-200'
                            : 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                          : inMatchedSpan
                          ? 'border-emerald-400/80 bg-emerald-500/20 text-emerald-300'
                          : 'border-cyan-500/20 bg-[#081529] text-slate-200'
                      }`}
                    >
                      <span className="text-[9px] text-slate-400 tabular-nums">{idx}</span>
                      <span className="text-xs font-bold">{ch}</span>
                    </div>
                  );
                })}
              </div>

              {/* Sliding Pattern P row */}
              {phase !== 'pi' && (
                <div className="flex items-center gap-1">
                  <span className="w-7 text-[11px] font-mono font-bold text-amber-400 shrink-0">
                    P:
                  </span>
                  {Array.from({ length: shiftOffset }).map((_, sp) => (
                    <div key={`sp-${sp}`} className="w-8 h-9 shrink-0" />
                  ))}
                  {P.split('').map((ch, pIdx) => {
                    const activeJ = pIdx === Math.min(P.length - 1, j);
                    const prefixMatched = pIdx < j;
                    return (
                      <div
                        key={`p-${pIdx}`}
                        className={`w-8 h-9 rounded-md border flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                          activeJ
                            ? 'border-amber-400 bg-amber-500/25 text-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                            : prefixMatched
                            ? 'border-emerald-400/60 bg-emerald-500/18 text-emerald-300'
                            : 'border-slate-700 bg-[#061121] text-slate-400'
                        }`}
                      >
                        {ch}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 2. PALINDROME EXPAND CENTER
  // -------------------------------------------------------------------
  if (algoId === 'string_palindrome') {
    const S: string = st.S || '';
    const l: number = st.l ?? 0;
    const r: number = st.r ?? 0;
    const bestL: number = st.bestL ?? 0;
    const bestR: number = st.bestR ?? 0;

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-mono font-semibold text-fuchsia-200">
            PALINDROME_EXPAND · Tốt nhất: "{S.slice(bestL, bestR + 1)}" (len {bestR - bestL + 1})
          </span>
          <span className={`font-mono font-bold ${st.match ? 'text-emerald-400' : 'text-rose-400'}`}>
            {st.match ? 'KHỚP ĐỐI XỨNG' : 'KHÔNG KHỚP'}
          </span>
        </div>

        <div className="relative overflow-x-auto rounded-xl border border-purple-500/30 algo-stage-grid p-4 shadow-[inset_0_0_28px_rgba(168,85,247,0.08)]">
          <HudCornerReticles />
          <div className="relative z-10 inline-flex gap-1.5 min-w-max">
            {S.split('').map((ch, idx) => {
              const isPointer = idx === l || idx === r;
              const inWindow = idx >= l && idx <= r;
              const inBest = idx >= bestL && idx <= bestR;
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono font-bold h-4 text-cyan-300">
                    {idx === l && idx === r ? 'L,R' : idx === l ? 'L' : idx === r ? 'R' : ''}
                  </span>
                  <div
                    className={`w-10 h-12 rounded-lg border-2 flex flex-col items-center justify-center font-mono transition-colors ${
                      isPointer
                        ? st.match
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                          : 'border-rose-400 bg-rose-500/20 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                        : inWindow
                        ? 'border-purple-400 bg-purple-500/20 text-purple-200'
                        : inBest
                        ? 'border-amber-400/70 bg-amber-500/15 text-amber-200'
                        : 'border-cyan-500/20 bg-[#081529] text-slate-200'
                    }`}
                  >
                    <span className="text-sm font-extrabold">{ch}</span>
                    <span className="text-[9px] text-slate-400 tabular-nums">{idx}</span>
                  </div>
                  <span className="text-[9px] font-mono text-amber-400 h-3">
                    {inBest ? '★' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 3. PREFIX SUM & KADANE
  // -------------------------------------------------------------------
  if (algoId === 'array_prefix_kadane') {
    const arr: number[] = st.arr || [];
    const pref: number[] = st.pref || [];
    const maxAbs = Math.max(1, ...arr.map((v) => Math.abs(v)));

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <span className="font-mono text-[11px] text-amber-200/85">KADANE_SIGNAL · Biểu đồ a[i] &amp; Đoạn cực đại</span>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-cyan-400">■ Đoạn đang xét</span>
            <span className="text-emerald-400">■ Best Kadane</span>
            {st.showQuery && <span className="text-amber-400">■ Truy vấn [L..R]</span>}
          </div>
        </div>

        {/* Bar chart supporting negative & positive values */}
        <div className="overflow-x-auto pb-2">
          <div className="relative inline-flex items-center gap-1.5 min-w-max h-48 px-3.5 algo-stage-grid rounded-xl border border-amber-500/30 shadow-[inset_0_0_32px_rgba(245,158,11,0.08)]">
            <HudCornerReticles />
            {arr.map((v, idx) => {
              const pct = Math.max(12, Math.round((Math.abs(v) / maxAbs) * 70));
              const inBest = st.bestR >= st.bestL && idx >= st.bestL && idx <= st.bestR;
              const inCur = st.curR >= st.curL && idx >= st.curL && idx <= st.curR;
              const isCurr = idx === st.idx;
              const inQuery = st.showQuery && idx >= st.qL && idx <= st.qR;

              const barColor = isCurr
                ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                : inBest
                ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]'
                : inCur
                ? 'bg-cyan-400'
                : v < 0
                ? 'bg-rose-500/75'
                : 'bg-slate-600/80';

              return (
                <div key={idx} className="w-11 h-full flex flex-col items-center justify-center relative">
                  <div className="h-1/2 w-full flex flex-col items-center justify-end pb-0.5">
                    {v >= 0 && (
                      <>
                        <span className="text-[10px] font-mono font-bold tabular-nums text-cyan-100">
                          {v}
                        </span>
                        <div
                          style={{ height: `${pct}%` }}
                          className={`w-7 rounded-t-md transition-all ${barColor} ${
                            inQuery ? 'ring-2 ring-amber-400' : ''
                          }`}
                        />
                      </>
                    )}
                  </div>
                  <div className="w-full h-px bg-cyan-500/35" />
                  <div className="h-1/2 w-full flex flex-col items-center justify-start pt-0.5">
                    {v < 0 && (
                      <>
                        <div
                          style={{ height: `${pct}%` }}
                          className={`w-7 rounded-b-md transition-all ${barColor} ${
                            inQuery ? 'ring-2 ring-amber-400' : ''
                          }`}
                        />
                        <span className="text-[10px] font-mono font-bold tabular-nums text-rose-400">
                          {v}
                        </span>
                      </>
                    )}
                    <span className="mt-auto text-[10px] font-mono text-slate-400 tabular-nums pb-0.5">
                      [{idx}]
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prefix Sum Array Row */}
        <div className="space-y-1.5">
          <div className="text-xs font-mono font-semibold text-cyan-200">
            PREFIX_ARRAY pref[0..{arr.length}] (pref[i+1] = pref[i] + a[i])
          </div>
          <div className="overflow-x-auto pb-1">
            <div className="inline-flex gap-1.5 min-w-max">
              {pref.map((pv, idx) => {
                const highlightQueryBound = st.showQuery && (idx === st.qL || idx === st.qR + 1);
                return (
                  <div
                    key={`pref-${idx}`}
                    className={`w-11 py-1.5 rounded-lg border text-center font-mono tabular-nums ${
                      highlightQueryBound
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                        : idx === st.idx + 1
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'border-cyan-500/20 bg-[#040b18] text-slate-200'
                    }`}
                  >
                    <div className="text-[9px] text-slate-400">p[{idx}]</div>
                    <div className="text-xs font-bold">{pv}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 4. TWO POINTERS & SLIDING WINDOW
  // -------------------------------------------------------------------
  if (algoId === 'array_two_pointers') {
    const arr: number[] = st.arr || [];
    const L: number = st.L ?? 0;
    const R: number = st.R ?? -1;
    const S: number = st.S ?? 1;
    const curSum: number = st.curSum ?? 0;
    const maxVal = Math.max(1, ...arr);

    return (
      <div className="space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-cyan-200 tabular-nums">
              WINDOW_SUM [L..R] = {curSum} / LIMIT S = {S}
            </span>
            <span
              className={`font-mono font-bold ${
                curSum > S ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {curSum > S ? 'VƯỢT NGƯỠNG (Tăng L)' : 'HỢP LỆ (≤ S)'}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#040b18] border border-cyan-500/25 overflow-hidden">
            <div
              className={`h-full transition-all ${
                curSum > S ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
              }`}
              style={{ width: `${Math.min(100, Math.round((curSum / Math.max(1, S)) * 100))}%` }}
            />
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="relative inline-flex items-end gap-2 min-w-max h-48 pt-6 px-4 algo-stage-grid rounded-xl border border-cyan-500/30 shadow-[inset_0_0_30px_rgba(34,211,238,0.08)]">
            <HudCornerReticles />
            {arr.map((v, idx) => {
              const inWindow = R >= L && idx >= L && idx <= R;
              const inBest = st.bestR >= st.bestL && st.bestL >= 0 && idx >= st.bestL && idx <= st.bestR;
              const hPct = Math.max(15, Math.round((v / maxVal) * 78));
              return (
                <div key={idx} className="w-11 h-full flex flex-col items-center justify-end gap-1">
                  <div className="text-[10px] font-mono font-bold text-cyan-300 h-4">
                    {idx === L && idx === R ? 'L,R' : idx === L ? 'L' : idx === R ? 'R' : ''}
                  </div>
                  <div className="text-[11px] font-mono font-bold tabular-nums text-white">
                    {v}
                  </div>
                  <div
                    style={{ height: `${hPct}%` }}
                    className={`w-8 rounded-t-lg transition-all border ${
                      inWindow
                        ? curSum > S
                          ? 'bg-rose-500/85 border-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.45)]'
                          : 'bg-cyan-400/90 border-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.45)]'
                        : inBest
                        ? 'bg-emerald-400/80 border-emerald-200'
                        : 'bg-slate-700/70 border-slate-600/50'
                    }`}
                  />
                  <div className="text-[10px] font-mono text-slate-400 tabular-nums pb-1">[{idx}]</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 5. SORT & MONOTONIC STACK
  // -------------------------------------------------------------------
  if (algoId === 'array_sort_stack') {
    const arr: number[] = st.arr || [];
    const maxVal = Math.max(1, ...arr.map(Math.abs));
    const mode: string = st.mode || 'monostack';

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className={mode === 'monostack' ? 'lg:col-span-8' : 'lg:col-span-12'}>
            <div className="overflow-x-auto pb-2">
              <div className="relative inline-flex items-end gap-1.5 min-w-max h-52 pt-6 px-4 algo-stage-grid rounded-xl border border-rose-500/30 shadow-[inset_0_0_30px_rgba(244,63,94,0.08)]">
                <HudCornerReticles />
                {arr.map((v, idx) => {
                  const hPct = Math.max(14, Math.round((Math.abs(v) / maxVal) * 78));
                  const isCurr = idx === st.idx || idx === st.jPtr;
                  const isPivot = idx === st.pivotIdx;
                  const inStack = Array.isArray(st.stack) && st.stack.includes(idx);
                  const isSorted = Array.isArray(st.sortedFlags) && st.sortedFlags[idx];
                  const inRange =
                    typeof st.l === 'number' && typeof st.r === 'number' && idx >= st.l && idx <= st.r;

                  const barCls = isPivot
                    ? 'bg-amber-400 border-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.45)]'
                    : isCurr
                    ? 'bg-cyan-400 border-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.45)]'
                    : inStack || isSorted
                    ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                    : inRange
                    ? 'bg-indigo-400/80 border-indigo-300'
                    : 'bg-slate-700/75 border-slate-600/50';

                  return (
                    <div key={idx} className="w-10 h-full flex flex-col items-center justify-end gap-1">
                      <span className="text-[11px] font-mono font-bold tabular-nums text-white">
                        {v}
                      </span>
                      <div style={{ height: `${hPct}%` }} className={`w-7 rounded-t-md border transition-all ${barCls}`} />
                      <span className="text-[10px] font-mono text-slate-400 tabular-nums pb-1">[{idx}]</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {mode === 'monostack' && (
            <div className="relative lg:col-span-4 algo-stage-grid rounded-xl border border-cyan-500/30 p-3.5 flex flex-col justify-between shadow-[inset_0_0_26px_rgba(6,182,212,0.08)]">
              <HudCornerReticles />
              <div className="text-xs font-mono font-bold text-cyan-200 mb-2">
                MONOTONIC STACK (TOP ↑)
              </div>
              <div className="flex flex-col-reverse gap-1.5 min-h-[120px] justify-start">
                {(st.stack as number[] | undefined)?.length ? (
                  (st.stack as number[]).map((sIdx) => (
                    <div
                      key={`st-${sIdx}`}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/50 text-xs font-mono flex items-center justify-between text-emerald-300 tabular-nums"
                    >
                      <span>idx {sIdx}</span>
                      <span className="font-bold">val = {arr[sIdx]}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 text-center py-6 font-mono">Stack rỗng</div>
                )}
              </div>
            </div>
          )}
        </div>

        {mode === 'monostack' && Array.isArray(st.ans) && (
          <div className="overflow-x-auto pb-1">
            <div className="inline-flex gap-1.5 min-w-max items-center">
              <span className="text-xs font-mono font-bold text-cyan-300 mr-1">ans[]:</span>
              {(st.ans as number[]).map((aVal, idx) => (
                <div
                  key={`ans-${idx}`}
                  className={`w-10 py-1 rounded border text-center font-mono text-xs tabular-nums ${
                    idx === st.idx
                      ? 'border-cyan-400 bg-cyan-500/20 font-bold text-cyan-200'
                      : 'border-cyan-500/20 bg-[#040b18] text-slate-200'
                  }`}
                >
                  {aVal}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 6. BINARY SEARCH (ARRAY & BINARY SEARCH ON ANSWER GRAPH)
  // -------------------------------------------------------------------
  if (algoId === 'binary_search') {
    if (st.mode === 'array') {
      const arr: number[] = st.arr || [];
      return (
        <div className="space-y-4">
          <div className="font-mono text-xs text-lime-200">
            LOWER_BOUND({st.target}) — phần tử đầu tiên ≥ {st.target}
          </div>
          <div className="relative overflow-x-auto pb-2 rounded-xl border border-lime-500/30 algo-stage-grid p-4 shadow-[inset_0_0_28px_rgba(132,204,22,0.08)]">
            <HudCornerReticles />
            <div className="relative z-10 inline-flex gap-1.5 min-w-max pt-3">
              {arr.map((v, idx) => {
                const inRange = idx >= st.lo && idx <= st.hi;
                const isMid = idx === st.mid;
                const isAns = idx === st.ansIdx;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono font-bold h-4 text-cyan-300">
                      {[
                        idx === st.lo ? 'lo' : '',
                        idx === st.mid ? 'mid' : '',
                        idx === st.hi ? 'hi' : ''
                      ]
                        .filter(Boolean)
                        .join(',')}
                    </span>
                    <div
                      className={`w-12 h-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono tabular-nums transition-all ${
                        isMid
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200 scale-105 shadow-[0_0_14px_rgba(251,191,36,0.35)]'
                          : isAns
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                          : inRange
                          ? 'border-lime-400/50 bg-[#081529] text-white'
                          : 'border-slate-800 bg-[#030812] text-slate-600 opacity-50'
                      }`}
                    >
                      <span className="text-sm font-extrabold">{v}</span>
                      <span className="text-[9px] text-slate-400">[{idx}]</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 h-3">
                      {!inRange && !isAns ? 'LOẠI' : isAns ? 'ỨNG VIÊN' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Binary Search on Answer: Monotonic Coordinate Graph f(mid) vs K!
    const curve: { x: number; segs: number; ok: boolean }[] = st.curveSamplePoints || [];
    const tested: { mid: number; segs: number; ok: boolean }[] = st.testedPoints || [];
    const K: number = st.K ?? 3;
    const minX = curve[0]?.x ?? 1;
    const maxX = curve[curve.length - 1]?.x ?? 30;
    const maxY = Math.max(K + 2, ...curve.map((p) => p.segs));
    const W = 620;
    const H = 260;
    const PAD = 38;
    const px = (x: number) => PAD + ((x - minX) / Math.max(1, maxX - minX)) * (W - 2 * PAD);
    const py = (y: number) => H - PAD - (y / Math.max(1, maxY)) * (H - 2 * PAD);

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-mono font-semibold text-lime-200">
            MONOTONIC_PLOT f(mid) ≤ K = {K}
          </span>
          <span className="font-mono text-[11px] text-emerald-400 tabular-nums">
            Vùng nghiệm: [lo={st.lo}, hi={st.hi}] · ans={st.bestAns}
          </span>
        </div>

        <div className="relative rounded-xl border border-lime-500/35 bg-[#040b18] overflow-hidden shadow-[inset_0_0_34px_rgba(132,204,22,0.09)]">
          <HudCornerReticles />
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[260px]">
            <defs>
              <pattern id="bs-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#0d223f" strokeWidth="0.9" />
                <circle cx="12" cy="12" r="0.8" fill="#1e4976" />
              </pattern>
              <radialGradient id="bs-center-aura" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#84cc16" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#040b18" stopOpacity="0" />
              </radialGradient>
              <filter id="bs-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width={W} height={H} fill="#040b18" />
            <rect width={W} height={H} fill="url(#bs-grid)" />
            <rect width={W} height={H} fill="url(#bs-center-aura)" />

            {/* Corner Binary Stream */}
            <g className="algo-data-stream font-mono text-[9px] fill-emerald-400/45 select-none pointer-events-none">
              <text x={12} y={24}>0101</text>
              <text x={12} y={35}>1011</text>
              <text x={12} y={46}>0xAF</text>
            </g>

            {/* Active search range [lo, hi] band */}
            {typeof st.lo === 'number' && typeof st.hi === 'number' && st.lo <= st.hi && (
              <rect
                x={px(Math.max(minX, st.lo))}
                y={PAD / 2}
                width={Math.max(2, px(Math.min(maxX, st.hi)) - px(Math.max(minX, st.lo)))}
                height={H - PAD * 1.5}
                fill="rgba(132, 204, 22, 0.1)"
              />
            )}

            {/* Axes */}
            <line x1={PAD} y1={H - PAD} x2={W - PAD / 2} y2={H - PAD} stroke="#38bdf8" strokeOpacity={0.55} strokeWidth={1.5} />
            <line x1={PAD} y1={PAD / 2} x2={PAD} y2={H - PAD} stroke="#38bdf8" strokeOpacity={0.55} strokeWidth={1.5} />

            {/* Threshold line y = K */}
            <line
              x1={PAD}
              y1={py(K)}
              x2={W - PAD / 2}
              y2={py(K)}
              stroke="#34d399"
              strokeWidth={1.6}
              className="holo-dash"
            />
            <text x={W - PAD} y={py(K) - 5} textAnchor="end" className="fill-emerald-400 text-[10px] font-bold font-mono">
              Giới hạn K = {K}
            </text>

            {/* Curve f(x) */}
            {curve.length > 1 && (
              <polyline
                points={curve.map((p) => `${px(p.x)},${py(p.segs)}`).join(' ')}
                fill="none"
                stroke="#84cc16"
                strokeWidth={2.6}
                filter="url(#bs-glow)"
              />
            )}

            {/* Tested points */}
            {tested.map((tp, idx) => (
              <g key={idx}>
                {tp.mid === st.mid && (
                  <circle
                    cx={px(tp.mid)}
                    cy={py(tp.segs)}
                    r={11}
                    fill={tp.ok ? '#34d399' : '#fb7185'}
                    fillOpacity={0.18}
                    stroke={tp.ok ? '#34d399' : '#fb7185'}
                    strokeOpacity={0.55}
                    strokeWidth={1.3}
                    className="algo-node-pulse"
                  />
                )}
                <circle
                  cx={px(tp.mid)}
                  cy={py(tp.segs)}
                  r={tp.mid === st.mid ? 6.5 : 4.5}
                  fill={tp.ok ? '#34d399' : '#fb7185'}
                  stroke="#040b18"
                  strokeWidth={1.6}
                  filter={tp.mid === st.mid ? 'url(#bs-glow)' : undefined}
                />
                {tp.mid === st.mid && (
                  <text
                    x={px(tp.mid)}
                    y={py(tp.segs) - 10}
                    textAnchor="middle"
                    className="fill-amber-300 text-[10px] font-bold font-mono tabular-nums"
                  >
                    mid={tp.mid} ({tp.segs})
                  </text>
                )}
              </g>
            ))}

            <text x={W / 2} y={H - 8} textAnchor="middle" className="fill-cyan-300/75 text-[10px] font-mono tabular-nums">
              Ngưỡng tổng tối đa mỗi đoạn (mid: {minX} → {maxX})
            </text>
          </svg>
        </div>

        {/* Live Partition Preview */}
        {Array.isArray(st.groups) && st.groups.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-semibold text-cyan-200">
              PARTITION WHEN mid = {st.mid} ({st.groups.length} đoạn):
            </div>
            <div className="flex flex-wrap gap-2">
              {(st.groups as number[][]).map((grp, gIdx) => (
                <div
                  key={gIdx}
                  className="px-3 py-2 rounded-xl border border-lime-500/35 bg-[#040b18] font-mono text-xs flex items-center gap-2"
                >
                  <span className="text-slate-100 font-semibold">
                    [{grp.join(', ')}]
                  </span>
                  <span className="text-lime-300 font-bold tabular-nums">
                    Σ={grp.reduce((a, b) => a + b, 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 7. NUMBER THEORY: SIEVE OF ERATOSTHENES & BINARY EXPONENTIATION
  // -------------------------------------------------------------------
  if (algoId === 'number_sieve') {
    if (st.mode === 'binpow') {
      const bits: string[] = st.bits || [];
      return (
        <div className="space-y-4">
          <div className="text-xs font-mono font-semibold text-purple-200 tabular-nums">
            MODULAR_EXP · {st.origA}^{st.origB} mod {st.m} · Duyệt LSB → MSB
          </div>
          <div className="relative flex flex-wrap gap-2 p-4 rounded-xl border border-purple-500/30 algo-stage-grid shadow-[inset_0_0_28px_rgba(168,85,247,0.08)]">
            <HudCornerReticles />
            {bits.map((bit, idx) => (
              <div
                key={idx}
                className={`w-14 py-2 rounded-xl border-2 text-center font-mono transition-all ${
                  idx === st.bitIdx
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                    : idx < st.bitIdx
                    ? 'border-emerald-400/70 bg-emerald-500/15 text-emerald-200'
                    : 'border-purple-500/25 bg-[#081529] text-slate-300'
                }`}
              >
                <div className="text-[10px] text-slate-400">2^{idx}</div>
                <div className="text-base font-extrabold text-white">{bit}</div>
                <div className="text-[9px] font-semibold text-cyan-300">
                  {bit === '1' ? 'NHÂN' : 'BỎ'}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const N: number = st.N || 36;
    const status: string[] = st.status || [];
    const currentMult: number[] = st.currentMult || [];

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <span className="font-mono text-[11px] text-purple-200/85">SIEVE_MATRIX 2..{N}</span>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-emerald-400">■ Nguyên tố</span>
            <span className="text-amber-400">■ p đang sàng</span>
            <span className="text-rose-400">■ Hợp số (gạch)</span>
          </div>
        </div>
        <div className="relative grid grid-cols-6 sm:grid-cols-9 md:grid-cols-10 gap-1.5 p-3.5 rounded-xl border border-purple-500/30 algo-stage-grid shadow-[inset_0_0_28px_rgba(192,132,252,0.08)]">
          <HudCornerReticles />
          {Array.from({ length: N - 1 }, (_, k) => k + 2).map((num) => {
            const s = status[num] || 'unmarked';
            const isP = num === st.p;
            const justCrossed = currentMult.includes(num);
            return (
              <div
                key={num}
                className={`py-2 rounded-lg border text-center font-mono text-xs font-bold tabular-nums transition-colors ${
                  isP
                    ? 'border-amber-400 bg-amber-500/25 text-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.35)]'
                    : justCrossed
                    ? 'border-rose-400 bg-rose-500/25 text-rose-300 line-through'
                    : s === 'prime'
                    ? 'border-emerald-400/75 bg-emerald-500/18 text-emerald-300'
                    : s === 'crossed'
                    ? 'border-slate-800 bg-[#020710] text-slate-600 line-through'
                    : 'border-cyan-500/20 bg-[#081529] text-slate-200'
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 8. SEGMENT TREE SVG BINARY TREE
  // -------------------------------------------------------------------
  if (algoId === 'tree_segtree') {
    const arr: number[] = st.arr || [];
    const nodesMap: Record<number, SegNodeState> = st.nodes || {};
    const nodeList = Object.values(nodesMap);
    const maxDepth = Math.max(1, ...nodeList.map((nd) => Math.floor(Math.log2(nd.node))));

    const W = 680;
    const rowH = 72;
    const H = (maxDepth + 1) * rowH + 30;

    const getPos = (nodeId: number) => {
      const depth = Math.floor(Math.log2(nodeId));
      const levelStart = 1 << depth;
      const idxInLevel = nodeId - levelStart;
      const countInLevel = levelStart;
      const x = ((idxInLevel + 0.5) / countInLevel) * W;
      const y = 34 + depth * rowH;
      return { x, y };
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <span className="font-mono text-[11px] text-emerald-200/90 tabular-nums">
            {st.op === 'query'
              ? `SEGTREE_QUERY Sum[${st.L}..${st.R}] · Tổng = ${st.total ?? 0}`
              : `SEGTREE_UPDATE a[${st.idx}] = ${st.updVal}`}
          </span>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <span className="text-emerald-400">● COVER/UPDATED</span>
            <span className="text-amber-400">● SPLIT</span>
            <span className="text-rose-400">● SKIP</span>
          </div>
        </div>

        <div className="relative rounded-xl border border-emerald-500/35 bg-[#040b18] overflow-x-auto shadow-[inset_0_0_32px_rgba(16,185,129,0.08)]">
          <HudCornerReticles />
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px] h-auto max-h-[340px]">
            <defs>
              <pattern id="segtree-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#0d223f" strokeWidth="0.9" />
                <circle cx="12" cy="12" r="0.8" fill="#1e4976" />
              </pattern>
              <radialGradient id="segtree-aura" cx="50%" cy="48%" r="55%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#040b18" stopOpacity="0" />
              </radialGradient>
              <filter id="segtree-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width={W} height={H} fill="#040b18" />
            <rect width={W} height={H} fill="url(#segtree-grid)" />
            <rect width={W} height={H} fill="url(#segtree-aura)" />

            {/* Corner Binary Telemetry */}
            <g className="algo-data-stream font-mono text-[9.5px] fill-emerald-400/45 select-none pointer-events-none">
              <text x={14} y={28}>0101</text>
              <text x={14} y={40}>1011</text>
              <text x={14} y={52}>0xAF</text>
              <text x={14} y={64}>1100</text>
            </g>

            {/* Edges */}
            {nodeList.map((nd) => {
              if (nd.node === 1) return null;
              const parentId = Math.floor(nd.node / 2);
              const p1 = getPos(parentId);
              const p2 = getPos(nd.node);
              const isLit = nd.status === 'cover' || nd.status === 'updated' || nd.status === 'split';
              return (
                <line
                  key={`e-${nd.node}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={
                    nd.status === 'cover' || nd.status === 'updated'
                      ? '#34d399'
                      : nd.status === 'split'
                      ? '#fbbf24'
                      : '#1e3a5f'
                  }
                  strokeOpacity={isLit ? 0.9 : 0.7}
                  strokeWidth={isLit ? 2.2 : 1.4}
                  className={isLit ? 'holo-dash' : undefined}
                  filter={isLit ? 'url(#segtree-glow)' : undefined}
                />
              );
            })}

            {/* Nodes */}
            {nodeList.map((nd) => {
              const { x, y } = getPos(nd.node);
              const isCover = nd.status === 'cover' || nd.status === 'updated';
              const isSplit = nd.status === 'split';
              const isSkip = nd.status === 'skip';
              const fill = isCover
                ? '#064e3b'
                : isSplit
                ? '#78350f'
                : isSkip
                ? '#4c0519'
                : '#081529';
              const stroke = isCover
                ? '#34d399'
                : isSplit
                ? '#fbbf24'
                : isSkip
                ? '#fb7185'
                : '#38bdf8';

              return (
                <g key={`n-${nd.node}`}>
                  <rect
                    x={x - 32}
                    y={y - 20}
                    width={64}
                    height={40}
                    rx={8}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isCover || isSplit ? 2 : 1.3}
                    filter={isCover || isSplit ? 'url(#segtree-glow)' : undefined}
                  />
                  <text
                    x={x}
                    y={y - 3}
                    textAnchor="middle"
                    className="fill-white text-[11px] font-bold font-mono tabular-nums"
                  >
                    {nd.val}
                  </text>
                  <text
                    x={x}
                    y={y + 11}
                    textAnchor="middle"
                    className="fill-cyan-200/80 text-[9px] font-mono tabular-nums"
                  >
                    [{nd.l}..{nd.r}]
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Base array */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono font-bold text-cyan-300 mr-1">a[]:</span>
          {arr.map((v, idx) => {
            const inQuery = st.op === 'query' && idx >= st.L && idx <= st.R;
            const isUpd = st.op === 'update' && idx === st.idx;
            return (
              <div
                key={`st-arr-${idx}`}
                className={`w-11 py-1.5 rounded-lg border text-center font-mono tabular-nums ${
                  isUpd || inQuery
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'border-cyan-500/20 bg-[#040b18] text-slate-200'
                }`}
              >
                <div className="text-[9px] text-slate-400">[{idx}]</div>
                <div className="text-xs font-bold">{v}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
