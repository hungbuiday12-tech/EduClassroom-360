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
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Bảng hàm tiền tố π (LPS) cho mẫu P = "{P}"
            </span>
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              {phase === 'pi' ? 'Đang tính π[i]' : 'Đã hoàn tất π'}
            </span>
          </div>
          <div className="overflow-x-auto pb-1">
            <div className="inline-flex gap-1.5 min-w-max">
              {P.split('').map((ch, idx) => {
                const isActive = phase === 'pi' && (idx === i || idx === j);
                return (
                  <div
                    key={`pi-${idx}`}
                    className={`w-10 rounded-lg border text-center py-1.5 font-mono transition-colors ${
                      idx === i && phase === 'pi'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50'
                        : idx === j && phase === 'pi'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 tabular-nums">{idx}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{ch}</div>
                    <div
                      className={`text-xs font-bold tabular-nums mt-0.5 ${
                        isActive ? 'text-sky-600 dark:text-sky-400' : 'text-emerald-600 dark:text-emerald-400'
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
        <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Đối chiếu Văn bản T và Xâu mẫu P trượt theo π
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
              Đã khớp: {matches.length} vị trí {matches.length ? `(${matches.join(', ')})` : ''}
            </span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="inline-block min-w-max space-y-2">
              {/* Text T row */}
              <div className="flex items-center gap-1">
                <span className="w-7 text-[11px] font-mono font-bold text-slate-500 shrink-0">T:</span>
                {T.split('').map((ch, idx) => {
                  const inMatchedSpan = matches.some((mStart) => idx >= mStart && idx < mStart + P.length);
                  const isCurrI = phase !== 'pi' && idx === i;
                  return (
                    <div
                      key={`t-${idx}`}
                      className={`w-8 h-11 rounded-md border flex flex-col items-center justify-center font-mono transition-colors ${
                        isCurrI
                          ? st.compareOk === false
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                            : 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300'
                          : inMatchedSpan
                          ? 'border-emerald-500/70 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
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
                  <span className="w-7 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">
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
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                            : prefixMatched
                            ? 'border-emerald-500/60 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/70 text-slate-500'
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
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Mở rộng từ tâm · Tốt nhất hiện tại: "{S.slice(bestL, bestR + 1)}" (dài {bestR - bestL + 1})
          </span>
          <span className="font-mono text-slate-500 dark:text-slate-400">
            {st.match ? 'KHỚP ĐỐI XỨNG' : 'KHÔNG KHỚP'}
          </span>
        </div>

        <div className="overflow-x-auto py-3">
          <div className="inline-flex gap-1.5 min-w-max">
            {S.split('').map((ch, idx) => {
              const isPointer = idx === l || idx === r;
              const inWindow = idx >= l && idx <= r;
              const inBest = idx >= bestL && idx <= bestR;
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono font-bold h-4 text-sky-600 dark:text-sky-400">
                    {idx === l && idx === r ? 'L,R' : idx === l ? 'L' : idx === r ? 'R' : ''}
                  </span>
                  <div
                    className={`w-10 h-12 rounded-lg border-2 flex flex-col items-center justify-center font-mono transition-colors ${
                      isPointer
                        ? st.match
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                          : 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                        : inWindow
                        ? 'border-sky-400 bg-sky-50/70 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300'
                        : inBest
                        ? 'border-amber-400/70 bg-amber-50/50 dark:bg-amber-950/20 text-slate-800 dark:text-slate-100'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className="text-sm font-extrabold">{ch}</span>
                    <span className="text-[9px] text-slate-400 tabular-nums">{idx}</span>
                  </div>
                  <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 h-3">
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
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span>Biểu đồ cột Mảng a[i] &amp; Đoạn cực đại Kadane</span>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-sky-600 dark:text-sky-400">■ Đoạn đang xét</span>
            <span className="text-emerald-600 dark:text-emerald-400">■ Best Kadane</span>
            {st.showQuery && <span className="text-amber-600 dark:text-amber-400">■ Truy vấn [L..R]</span>}
          </div>
        </div>

        {/* Bar chart supporting negative & positive values */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex items-center gap-1.5 min-w-max h-48 px-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            {arr.map((v, idx) => {
              const pct = Math.max(12, Math.round((Math.abs(v) / maxAbs) * 70));
              const inBest = st.bestR >= st.bestL && idx >= st.bestL && idx <= st.bestR;
              const inCur = st.curR >= st.curL && idx >= st.curL && idx <= st.curR;
              const isCurr = idx === st.idx;
              const inQuery = st.showQuery && idx >= st.qL && idx <= st.qR;

              const barColor = isCurr
                ? 'bg-amber-500'
                : inBest
                ? 'bg-emerald-500'
                : inCur
                ? 'bg-sky-500'
                : v < 0
                ? 'bg-rose-400/75 dark:bg-rose-500/60'
                : 'bg-slate-400/80 dark:bg-slate-600';

              return (
                <div key={idx} className="w-11 h-full flex flex-col items-center justify-center relative">
                  {/* Upper positive half */}
                  <div className="h-1/2 w-full flex flex-col items-center justify-end pb-0.5">
                    {v >= 0 && (
                      <>
                        <span className="text-[10px] font-mono font-bold tabular-nums text-slate-700 dark:text-slate-200">
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
                  {/* Zero baseline */}
                  <div className="w-full h-px bg-slate-300 dark:bg-slate-700" />
                  {/* Lower negative half */}
                  <div className="h-1/2 w-full flex flex-col items-center justify-start pt-0.5">
                    {v < 0 && (
                      <>
                        <div
                          style={{ height: `${pct}%` }}
                          className={`w-7 rounded-b-md transition-all ${barColor} ${
                            inQuery ? 'ring-2 ring-amber-400' : ''
                          }`}
                        />
                        <span className="text-[10px] font-mono font-bold tabular-nums text-rose-600 dark:text-rose-400">
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
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Mảng Cộng Dồn pref[0..{arr.length}] (pref[i+1] = pref[i] + a[i])
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
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                        : idx === st.idx + 1
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
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
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Tổng cửa sổ [L..R] = {curSum} / Giới hạn S = {S}
            </span>
            <span
              className={`font-mono font-bold ${
                curSum > S ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {curSum > S ? 'VƯỢT NGƯỠNG (Cần tăng L)' : 'HỢP LỆ (≤ S)'}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all ${
                curSum > S ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.round((curSum / Math.max(1, S)) * 100))}%` }}
            />
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="inline-flex items-end gap-2 min-w-max h-48 pt-6 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            {arr.map((v, idx) => {
              const inWindow = R >= L && idx >= L && idx <= R;
              const inBest = st.bestR >= st.bestL && st.bestL >= 0 && idx >= st.bestL && idx <= st.bestR;
              const hPct = Math.max(15, Math.round((v / maxVal) * 78));
              return (
                <div key={idx} className="w-11 h-full flex flex-col items-center justify-end gap-1">
                  <div className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 h-4">
                    {idx === L && idx === R ? 'L,R' : idx === L ? 'L' : idx === R ? 'R' : ''}
                  </div>
                  <div className="text-[11px] font-mono font-bold tabular-nums text-slate-700 dark:text-slate-200">
                    {v}
                  </div>
                  <div
                    style={{ height: `${hPct}%` }}
                    className={`w-8 rounded-t-lg transition-all ${
                      inWindow
                        ? curSum > S
                          ? 'bg-rose-500'
                          : 'bg-sky-500'
                        : inBest
                        ? 'bg-emerald-500/75'
                        : 'bg-slate-300 dark:bg-slate-700'
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
              <div className="inline-flex items-end gap-1.5 min-w-max h-52 pt-6 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                {arr.map((v, idx) => {
                  const hPct = Math.max(14, Math.round((Math.abs(v) / maxVal) * 78));
                  const isCurr = idx === st.idx || idx === st.jPtr;
                  const isPivot = idx === st.pivotIdx;
                  const inStack = Array.isArray(st.stack) && st.stack.includes(idx);
                  const isSorted = Array.isArray(st.sortedFlags) && st.sortedFlags[idx];
                  const inRange =
                    typeof st.l === 'number' && typeof st.r === 'number' && idx >= st.l && idx <= st.r;

                  const barCls = isPivot
                    ? 'bg-amber-500'
                    : isCurr
                    ? 'bg-sky-500'
                    : inStack || isSorted
                    ? 'bg-emerald-500'
                    : inRange
                    ? 'bg-indigo-400 dark:bg-indigo-500/70'
                    : 'bg-slate-300 dark:bg-slate-700';

                  return (
                    <div key={idx} className="w-10 h-full flex flex-col items-center justify-end gap-1">
                      <span className="text-[11px] font-mono font-bold tabular-nums text-slate-700 dark:text-slate-200">
                        {v}
                      </span>
                      <div style={{ height: `${hPct}%` }} className={`w-7 rounded-t-md transition-all ${barCls}`} />
                      <span className="text-[10px] font-mono text-slate-400 tabular-nums pb-1">[{idx}]</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {mode === 'monostack' && (
            <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex flex-col justify-between">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                Ngăn xếp Đơn điệu (Top ở trên)
              </div>
              <div className="flex flex-col-reverse gap-1.5 min-h-[120px] justify-start">
                {(st.stack as number[] | undefined)?.length ? (
                  (st.stack as number[]).map((sIdx) => (
                    <div
                      key={`st-${sIdx}`}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/50 text-xs font-mono flex items-center justify-between text-emerald-700 dark:text-emerald-300 tabular-nums"
                    >
                      <span>idx {sIdx}</span>
                      <span className="font-bold">val = {arr[sIdx]}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 text-center py-6 font-mono">Stack rỗng</div>
                )}
              </div>
            </div>
          )}
        </div>

        {mode === 'monostack' && Array.isArray(st.ans) && (
          <div className="overflow-x-auto pb-1">
            <div className="inline-flex gap-1.5 min-w-max items-center">
              <span className="text-xs font-mono font-bold text-slate-500 mr-1">ans[]:</span>
              {(st.ans as number[]).map((aVal, idx) => (
                <div
                  key={`ans-${idx}`}
                  className={`w-10 py-1 rounded border text-center font-mono text-xs tabular-nums ${
                    idx === st.idx
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 font-bold text-sky-700 dark:text-sky-300'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
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
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Tìm <span className="font-mono font-bold text-slate-900 dark:text-white">lower_bound({st.target})</span> — phần tử đầu tiên ≥ {st.target}
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="inline-flex gap-1.5 min-w-max pt-5">
              {arr.map((v, idx) => {
                const inRange = idx >= st.lo && idx <= st.hi;
                const isMid = idx === st.mid;
                const isAns = idx === st.ansIdx;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono font-bold h-4 text-sky-600 dark:text-sky-400">
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
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 scale-105'
                          : isAns
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : inRange
                          ? 'border-sky-300 dark:border-sky-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 text-slate-400 opacity-50'
                      }`}
                    >
                      <span className="text-sm font-extrabold">{v}</span>
                      <span className="text-[9px] text-slate-400">[{idx}]</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 h-3">
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
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Đồ thị hàm đơn điệu f(mid) = Số đoạn cần chia (Mục tiêu f(mid) ≤ K = {K})
          </span>
          <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
            Vùng nghiệm: [lo={st.lo}, hi={st.hi}] · ans={st.bestAns}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[260px]">
            {/* Active search range [lo, hi] band */}
            {typeof st.lo === 'number' && typeof st.hi === 'number' && st.lo <= st.hi && (
              <rect
                x={px(Math.max(minX, st.lo))}
                y={PAD / 2}
                width={Math.max(2, px(Math.min(maxX, st.hi)) - px(Math.max(minX, st.lo)))}
                height={H - PAD * 1.5}
                fill="rgba(14, 165, 233, 0.1)"
              />
            )}

            {/* Axes */}
            <line x1={PAD} y1={H - PAD} x2={W - PAD / 2} y2={H - PAD} stroke="#64748b" strokeWidth={1.5} />
            <line x1={PAD} y1={PAD / 2} x2={PAD} y2={H - PAD} stroke="#64748b" strokeWidth={1.5} />

            {/* Threshold line y = K */}
            <line
              x1={PAD}
              y1={py(K)}
              x2={W - PAD / 2}
              y2={py(K)}
              stroke="#10b981"
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
            <text x={W - PAD} y={py(K) - 5} textAnchor="end" className="fill-emerald-600 dark:fill-emerald-400 text-[10px] font-bold font-mono">
              Giới hạn K = {K}
            </text>

            {/* Curve f(x) */}
            {curve.length > 1 && (
              <polyline
                points={curve.map((p) => `${px(p.x)},${py(p.segs)}`).join(' ')}
                fill="none"
                stroke="#6366f1"
                strokeWidth={2.5}
              />
            )}

            {/* Tested points */}
            {tested.map((tp, idx) => (
              <g key={idx}>
                <circle
                  cx={px(tp.mid)}
                  cy={py(tp.segs)}
                  r={tp.mid === st.mid ? 6.5 : 4.5}
                  fill={tp.ok ? '#10b981' : '#e11d48'}
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
                {tp.mid === st.mid && (
                  <text
                    x={px(tp.mid)}
                    y={py(tp.segs) - 10}
                    textAnchor="middle"
                    className="fill-slate-900 dark:fill-white text-[10px] font-bold font-mono"
                  >
                    mid={tp.mid} ({tp.segs})
                  </text>
                )}
              </g>
            ))}

            <text x={W / 2} y={H - 8} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">
              Ngưỡng tổng tối đa mỗi đoạn (mid: {minX} → {maxX})
            </text>
          </svg>
        </div>

        {/* Live Partition Preview */}
        {Array.isArray(st.groups) && st.groups.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Cách chia mảng khi mid = {st.mid} ({st.groups.length} đoạn):
            </div>
            <div className="flex flex-wrap gap-2">
              {(st.groups as number[][]).map((grp, gIdx) => (
                <div
                  key={gIdx}
                  className="px-3 py-2 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50/70 dark:bg-sky-950/30 font-mono text-xs flex items-center gap-2"
                >
                  <span className="text-slate-800 dark:text-slate-100 font-semibold">
                    [{grp.join(', ')}]
                  </span>
                  <span className="text-sky-700 dark:text-sky-300 font-bold tabular-nums">
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
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Tính {st.origA}^{st.origB} mod {st.m} · Duyệt từ bit thấp (LSB) → bit cao (MSB)
          </div>
          <div className="flex flex-wrap gap-2">
            {bits.map((bit, idx) => (
              <div
                key={idx}
                className={`w-14 py-2 rounded-xl border-2 text-center font-mono transition-all ${
                  idx === st.bitIdx
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40'
                    : idx < st.bitIdx
                    ? 'border-emerald-500/60 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="text-[10px] text-slate-400">2^{idx}</div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white">{bit}</div>
                <div className="text-[9px] font-semibold text-slate-500">
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
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span>Lưới Sàng Eratosthenes 2..{N}</span>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400">■ Nguyên tố</span>
            <span className="text-amber-600 dark:text-amber-400">■ p đang sàng</span>
            <span className="text-rose-500">■ Hợp số (đã gạch)</span>
          </div>
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-10 gap-1.5">
          {Array.from({ length: N - 1 }, (_, k) => k + 2).map((num) => {
            const s = status[num] || 'unmarked';
            const isP = num === st.p;
            const justCrossed = currentMult.includes(num);
            return (
              <div
                key={num}
                className={`py-2 rounded-lg border text-center font-mono text-xs font-bold tabular-nums transition-colors ${
                  isP
                    ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
                    : justCrossed
                    ? 'border-rose-500 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 line-through'
                    : s === 'prime'
                    ? 'border-emerald-500/70 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : s === 'crossed'
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 text-slate-400 line-through'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
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
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span>
            {st.op === 'query'
              ? `Truy vấn Sum[${st.L}..${st.R}] · Tổng hiện tại = ${st.total ?? 0}`
              : `Cập nhật a[${st.idx}] = ${st.updVal}`}
          </span>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400">● COVER/UPDATED</span>
            <span className="text-amber-600 dark:text-amber-400">● SPLIT</span>
            <span className="text-rose-500">● SKIP</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px] h-auto max-h-[340px]">
            {/* Edges */}
            {nodeList.map((nd) => {
              if (nd.node === 1) return null;
              const parentId = Math.floor(nd.node / 2);
              const p1 = getPos(parentId);
              const p2 = getPos(nd.node);
              return (
                <line
                  key={`e-${nd.node}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#94a3b8"
                  strokeOpacity={0.5}
                  strokeWidth={1.5}
                />
              );
            })}

            {/* Nodes */}
            {nodeList.map((nd) => {
              const { x, y } = getPos(nd.node);
              const fill =
                nd.status === 'cover' || nd.status === 'updated'
                  ? '#10b981'
                  : nd.status === 'split'
                  ? '#f59e0b'
                  : nd.status === 'skip'
                  ? '#e11d48'
                  : '#334155';

              return (
                <g key={`n-${nd.node}`}>
                  <rect
                    x={x - 32}
                    y={y - 20}
                    width={64}
                    height={40}
                    rx={8}
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth={1.5}
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
                    className="fill-white/85 text-[9px] font-mono tabular-nums"
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
          <span className="text-xs font-mono font-bold text-slate-500 mr-1">a[]:</span>
          {arr.map((v, idx) => {
            const inQuery = st.op === 'query' && idx >= st.L && idx <= st.R;
            const isUpd = st.op === 'update' && idx === st.idx;
            return (
              <div
                key={`st-arr-${idx}`}
                className={`w-11 py-1.5 rounded-lg border text-center font-mono tabular-nums ${
                  isUpd || inQuery
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
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
