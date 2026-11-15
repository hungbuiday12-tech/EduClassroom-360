import React from 'react';
import { Crown } from 'lucide-react';
import { VizStep } from '../types';

interface MatrixDpVisualizerProps {
  algoId: 'matrix_grid' | 'dp_knapsack' | 'dp_lis' | 'dp_lcs' | 'backtrack_nqueens';
  step: VizStep;
  onToggleWall?: (r: number, c: number) => void;
  onSelectRectCell?: (r: number, c: number) => void;
}

export const MatrixDpVisualizer: React.FC<MatrixDpVisualizerProps> = ({
  algoId,
  step,
  onToggleWall,
  onSelectRectCell
}) => {
  const st = step.state || {};

  // -------------------------------------------------------------------
  // 1. 2D MATRIX: BFS/DIJKSTRA MAZE & 2D PREFIX SUM
  // -------------------------------------------------------------------
  if (algoId === 'matrix_grid') {
    const R: number = st.R || 5;
    const C: number = st.C || 7;
    const weights: number[][] = st.weights || [];

    if (st.mode === 'prefix2d') {
      const P: number[][] = st.P || [];
      const r1: number = st.r1 ?? 2;
      const c1: number = st.c1 ?? 2;
      const r2: number = st.r2 ?? 4;
      const c2: number = st.c2 ?? 5;
      const phase: number = st.phase ?? 3;

      return (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>Ma trận gốc A[r][c] &amp; Bù-Trừ Cộng dồn 2D · Bấm ô để đổi góc hình chữ nhật</span>
            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              Vùng ({r1 - 1},{c1 - 1}) → ({r2 - 1},{c2 - 1})
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Matrix A */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Ma trận A (0-based)
              </div>
              <div className="overflow-x-auto">
                <table className="border-collapse font-mono text-xs tabular-nums">
                  <tbody>
                    {Array.from({ length: R }).map((_, r) => (
                      <tr key={r}>
                        {Array.from({ length: C }).map((__, c) => {
                          const r1b = r + 1;
                          const c1b = c + 1;
                          const inTarget = r1b >= r1 && r1b <= r2 && c1b >= c1 && c1b <= c2;
                          const inTotal = r1b <= r2 && c1b <= c2;
                          const inTop = r1b < r1 && c1b <= c2;
                          const inLeft = r1b <= r2 && c1b < c1;
                          const inCorner = r1b < r1 && c1b < c1;

                          let cls =
                            'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                          if (inTarget) {
                            cls =
                              'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                          } else if (phase >= 3 && inCorner) {
                            cls =
                              'bg-sky-500/20 border-sky-500 text-sky-800 dark:text-sky-200';
                          } else if (phase >= 2 && (inTop || inLeft)) {
                            cls =
                              'bg-rose-500/15 border-rose-400 text-rose-700 dark:text-rose-300';
                          } else if (phase === 1 && inTotal) {
                            cls =
                              'bg-indigo-500/15 border-indigo-400 text-indigo-700 dark:text-indigo-300';
                          }

                          return (
                            <td key={c} className="p-0.5">
                              <button
                                type="button"
                                onClick={() => onSelectRectCell?.(r, c)}
                                className={`w-10 h-10 rounded-md border flex items-center justify-center transition-colors ${cls}`}
                              >
                                {weights[r]?.[c] ?? 0}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Prefix Matrix P */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Bảng Cộng dồn P[1..{R}][1..{C}]
              </div>
              <div className="overflow-x-auto">
                <table className="border-collapse font-mono text-xs tabular-nums">
                  <tbody>
                    {Array.from({ length: R }).map((_, r0) => {
                      const r = r0 + 1;
                      return (
                        <tr key={r}>
                          {Array.from({ length: C }).map((__, c0) => {
                            const c = c0 + 1;
                            const isMain = r === r2 && c === c2;
                            const isSub =
                              (r === r1 - 1 && c === c2) || (r === r2 && c === c1 - 1);
                            const isAdd = r === r1 - 1 && c === c1 - 1;
                            return (
                              <td key={c} className="p-0.5">
                                <div
                                  className={`w-10 h-10 rounded-md border flex items-center justify-center ${
                                    isMain
                                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 font-bold text-emerald-700 dark:text-emerald-300'
                                      : isSub
                                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 font-bold text-rose-700 dark:text-rose-300'
                                      : isAdd
                                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 font-bold text-sky-700 dark:text-sky-300'
                                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  {P[r]?.[c] ?? 0}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Maze BFS / Dijkstra
    const walls: boolean[][] = st.walls || [];
    const dist: number[][] = st.dist || [];
    const visited: boolean[][] = st.visited || [];
    const path: { r: number; c: number }[] = st.path || [];
    const start = st.start || { r: 0, c: 0 };
    const end = st.end || { r: R - 1, c: C - 1 };
    const frontier: { r: number; c: number }[] = st.frontier || [];

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span>
            Bấm vào ô bất kỳ (trừ S và T) để bật/tắt tường cản (#)
          </span>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <span className="text-sky-600 dark:text-sky-400">■ S (Xuất phát)</span>
            <span className="text-amber-600 dark:text-amber-400">■ T (Đích)</span>
            <span className="text-emerald-600 dark:text-emerald-400">■ Đường ngắn nhất</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="inline-block p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            {Array.from({ length: R }).map((_, r) => (
              <div key={r} className="flex gap-1 mb-1 last:mb-0">
                {Array.from({ length: C }).map((__, c) => {
                  const isWall = walls[r]?.[c];
                  const isStart = r === start.r && c === start.c;
                  const isEnd = r === end.r && c === end.c;
                  const isCurrent = st.current?.r === r && st.current?.c === c;
                  const onPath = path.some((p) => p.r === r && p.c === c);
                  const isVisited = visited[r]?.[c];
                  const inFrontier = frontier.some((f) => f.r === r && f.c === c);
                  const dVal = dist[r]?.[c];

                  let cellCls =
                    'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200';
                  if (isWall) {
                    cellCls = 'bg-slate-800 dark:bg-slate-700 border-slate-900 text-slate-400';
                  } else if (isStart) {
                    cellCls = 'bg-sky-600 border-sky-700 text-white font-bold';
                  } else if (isEnd) {
                    cellCls = 'bg-amber-500 border-amber-600 text-slate-950 font-bold';
                  } else if (onPath) {
                    cellCls = 'bg-emerald-500 border-emerald-600 text-white font-bold';
                  } else if (isCurrent) {
                    cellCls = 'bg-indigo-600 border-indigo-700 text-white font-bold';
                  } else if (isVisited) {
                    cellCls =
                      'bg-sky-50 dark:bg-sky-950/50 border-sky-400/60 text-sky-700 dark:text-sky-300';
                  } else if (inFrontier) {
                    cellCls =
                      'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-700 dark:text-amber-300';
                  }

                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onClick={() => onToggleWall?.(r, c)}
                      className={`w-12 h-12 rounded-lg border flex flex-col items-center justify-center font-mono transition-colors ${cellCls}`}
                    >
                      <span className="text-[11px] font-bold">
                        {isWall ? '#' : isStart ? 'S' : isEnd ? 'T' : st.mode === 'dijkstra' ? `w=${weights[r]?.[c] ?? 1}` : ''}
                      </span>
                      {!isWall && (
                        <span className="text-[10px] tabular-nums opacity-90">
                          {Number.isFinite(dVal) ? `d=${dVal}` : '∞'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 2. DP KNAPSACK TABLE
  // -------------------------------------------------------------------
  if (algoId === 'dp_knapsack') {
    const items: { w: number; v: number }[] = st.items || [];
    const W: number = st.W || 7;
    const dp: number[][] = st.dp || [];
    const deps: { r: number; c: number; label: string }[] = st.deps || [];
    const traceCells: { r: number; c: number }[] = st.traceCells || [];
    const chosen: number[] = st.chosenIndices || [];

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span>Bảng DP Cái Túi dp[i][w] · i = xét đến vật thứ i, w = sức chứa</span>
          {chosen.length > 0 && (
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              Vật đã chọn: {chosen.map((x) => `#${x}`).join(', ')}
            </span>
          )}
        </div>

        <div className="overflow-x-auto pb-2">
          <table className="border-collapse font-mono text-xs tabular-nums min-w-max">
            <thead>
              <tr>
                <th className="p-1.5 text-left text-[11px] text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  Vật \ w
                </th>
                {Array.from({ length: W + 1 }, (_, w) => (
                  <th
                    key={w}
                    className={`w-10 p-1.5 text-center border-b border-slate-200 dark:border-slate-800 ${
                      w === st.curW ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {w}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dp.map((row, i) => (
                <tr key={i}>
                  <td className="p-1.5 pr-3 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                    {i === 0 ? 'i=0 (Rỗng)' : `#${i} (w=${items[i - 1]?.w}, v=${items[i - 1]?.v})`}
                  </td>
                  {row.map((val, w) => {
                    const isCur = i === st.curI && w === st.curW;
                    const isDep = deps.some((d) => d.r === i && d.c === w);
                    const isTrace = traceCells.some((t) => t.r === i && t.c === w);

                    return (
                      <td key={w} className="p-0.5">
                        <div
                          className={`w-10 h-9 rounded-md border flex items-center justify-center transition-colors ${
                            isCur
                              ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-extrabold'
                              : isTrace
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold'
                              : isDep
                              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {val}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 3. DP LIS (BAR CHART + TAILS[])
  // -------------------------------------------------------------------
  if (algoId === 'dp_lis') {
    const arr: number[] = st.arr || [];
    const dp: number[] = st.dp || [];
    const tails: number[] = st.tails || [];
    const lisIndices: number[] = st.lisIndices || [];
    const maxVal = Math.max(1, ...arr.map(Math.abs));

    return (
      <div className="space-y-5">
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex items-end gap-2 min-w-max h-48 pt-6 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            {arr.map((v, idx) => {
              const hPct = Math.max(15, Math.round((Math.abs(v) / maxVal) * 76));
              const isCurr = idx === st.idx;
              const inLis = lisIndices.includes(idx);
              return (
                <div key={idx} className="w-11 h-full flex flex-col items-center justify-end gap-1">
                  <span className="text-[11px] font-mono font-bold tabular-nums text-slate-700 dark:text-slate-200">
                    {v}
                  </span>
                  <div
                    style={{ height: `${hPct}%` }}
                    className={`w-8 rounded-t-lg transition-all ${
                      isCurr
                        ? 'bg-amber-500'
                        : inLis
                        ? 'bg-emerald-500'
                        : idx < (st.idx ?? 0)
                        ? 'bg-sky-500/70'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                  <span className="text-[10px] font-mono text-slate-500 tabular-nums pb-1">
                    dp={dp[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Mảng tails[] (Độ dài LIS hiện tại = {tails.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tails.length > 0 ? (
              tails.map((tv, idx) => (
                <div
                  key={idx}
                  className={`w-12 py-1.5 rounded-lg border text-center font-mono tabular-nums ${
                    idx === st.replacedPos
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold'
                      : 'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold'
                  }`}
                >
                  <div className="text-[9px] text-slate-400">len {idx + 1}</div>
                  <div className="text-xs">{tv}</div>
                </div>
              ))
            ) : (
              <span className="text-xs font-mono text-slate-400">tails[] đang rỗng</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 4. DP LCS MATRIX
  // -------------------------------------------------------------------
  if (algoId === 'dp_lcs') {
    const A: string = st.A || '';
    const B: string = st.B || '';
    const dp: number[][] = st.dp || [];
    const traceCells: { r: number; c: number; matched: boolean }[] = st.traceCells || [];

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span>Ma trận DP LCS · Khớp ký tự lấy chéo trên-trái (↖ +1)</span>
          {st.lcsStr && (
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              LCS = "{st.lcsStr}"
            </span>
          )}
        </div>

        <div className="overflow-x-auto pb-2">
          <table className="border-collapse font-mono text-xs tabular-nums min-w-max">
            <thead>
              <tr>
                <th className="w-10 h-9 border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  A \ B
                </th>
                <th className="w-10 h-9 border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  ∅
                </th>
                {B.split('').map((ch, j) => (
                  <th
                    key={j}
                    className={`w-10 h-9 border-b border-slate-200 dark:border-slate-800 font-bold ${
                      j + 1 === st.curJ ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {ch}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dp.map((row, i) => (
                <tr key={i}>
                  <td
                    className={`w-10 h-9 text-center font-bold border-r border-slate-200 dark:border-slate-800 ${
                      i === st.curI ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {i === 0 ? '∅' : A[i - 1]}
                  </td>
                  {row.map((val, j) => {
                    const isCur = i === st.curI && j === st.curJ;
                    const trace = traceCells.find((t) => t.r === i && t.c === j);
                    return (
                      <td key={j} className="p-0.5">
                        <div
                          className={`w-10 h-9 rounded-md border flex items-center justify-center ${
                            isCur
                              ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-extrabold'
                              : trace?.matched
                              ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                              : trace
                              ? 'border-sky-400 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {val}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 5. BACKTRACKING N-QUEENS
  // -------------------------------------------------------------------
  if (algoId === 'backtrack_nqueens') {
    const N: number = st.N || 4;
    const queens: number[] = st.queens || [];
    const tryRow: number = st.tryRow ?? -1;
    const tryCol: number = st.tryCol ?? -1;

    const isAttackedByPlaced = (r: number, c: number) => {
      for (let qr = 0; qr < N; qr++) {
        const qc = queens[qr];
        if (qc === -1 || qr === r) continue;
        if (qc === c || Math.abs(qr - r) === Math.abs(qc - c)) return true;
      }
      return false;
    };

    return (
      <div className="space-y-3">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          Bàn cờ Quay lui {N}×{N} · Các ô đỏ nhạt đang nằm trong tầm chiếu của Hậu đã đặt
        </div>
        <div className="inline-block p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950">
          {Array.from({ length: N }).map((_, r) => (
            <div key={r} className="flex">
              {Array.from({ length: N }).map((__, c) => {
                const hasQueen = queens[r] === c;
                const isTrying = r === tryRow && c === tryCol;
                const darkSquare = (r + c) % 2 === 1;
                const attacked = !hasQueen && isAttackedByPlaced(r, c);

                let bg = darkSquare
                  ? 'bg-slate-200 dark:bg-slate-800'
                  : 'bg-white dark:bg-slate-900';
                if (hasQueen) {
                  bg = st.solved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-sky-500 text-white';
                } else if (isTrying && st.conflict) {
                  bg = 'bg-rose-500/80 text-white';
                } else if (attacked) {
                  bg = darkSquare
                    ? 'bg-rose-100/70 dark:bg-rose-950/40'
                    : 'bg-rose-50/70 dark:bg-rose-950/25';
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-11 h-11 sm:w-12 sm:h-12 border border-slate-300/60 dark:border-slate-700/60 flex items-center justify-center transition-colors ${bg}`}
                  >
                    {hasQueen ? (
                      <Crown className="w-5 h-5" />
                    ) : isTrying && st.conflict ? (
                      <span className="font-mono font-bold text-xs">✕</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
