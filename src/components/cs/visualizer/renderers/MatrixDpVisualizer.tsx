import React from 'react';
import { Crown } from 'lucide-react';
import { VizStep } from '../types';

interface MatrixDpVisualizerProps {
  algoId: 'matrix_grid' | 'dp_knapsack' | 'dp_lis' | 'dp_lcs' | 'backtrack_nqueens';
  step: VizStep;
  onToggleWall?: (r: number, c: number) => void;
  onSelectRectCell?: (r: number, c: number) => void;
}

const CyberHudCorners: React.FC = () => (
  <>
    <span className="pointer-events-none absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400/70 rounded-tl-xs z-10" />
    <span className="pointer-events-none absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/70 rounded-tr-xs z-10" />
    <span className="pointer-events-none absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400/55 rounded-bl-xs z-10" />
    <span className="pointer-events-none absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400/55 rounded-br-xs z-10" />
  </>
);

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
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
            <span className="font-mono text-[11px] text-cyan-200/85">
              PREFIX_2D_MATRIX · Bấm ô để đổi góc hình chữ nhật
            </span>
            <span className="font-mono text-[11px] text-emerald-400 font-bold tabular-nums">
              Vùng ({r1 - 1},{c1 - 1}) → ({r2 - 1},{c2 - 1})
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Matrix A */}
            <div className="relative rounded-xl border border-cyan-500/30 algo-stage-grid p-4 space-y-2 shadow-[inset_0_0_26px_rgba(6,182,212,0.08)]">
              <CyberHudCorners />
              <div className="relative z-10 text-xs font-mono font-bold text-cyan-200">
                MA TRẬN A (0-BASED)
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
                            'bg-[#081529] border-cyan-500/20 text-slate-300 hover:border-cyan-400/60';
                          if (inTarget) {
                            cls =
                              'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.28)]';
                          } else if (phase >= 3 && inCorner) {
                            cls =
                              'bg-cyan-500/20 border-cyan-400 text-cyan-200';
                          } else if (phase >= 2 && (inTop || inLeft)) {
                            cls =
                              'bg-rose-500/18 border-rose-400/70 text-rose-300';
                          } else if (phase === 1 && inTotal) {
                            cls =
                              'bg-indigo-500/20 border-indigo-400/70 text-indigo-300';
                          }

                          return (
                            <td key={c} className="p-0.5">
                              <button
                                type="button"
                                onClick={() => onSelectRectCell?.(r, c)}
                                className={`w-10 h-10 rounded-md border flex items-center justify-center transition-all cursor-pointer ${cls}`}
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
            <div className="relative rounded-xl border border-cyan-500/30 algo-stage-grid p-4 space-y-2 shadow-[inset_0_0_26px_rgba(6,182,212,0.08)]">
              <CyberHudCorners />
              <div className="relative z-10 text-xs font-mono font-bold text-cyan-200">
                BẢNG CỘNG DỒN P[1..{R}][1..{C}]
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
                                      ? 'border-emerald-400 bg-emerald-500/20 font-bold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                                      : isSub
                                      ? 'border-rose-400 bg-rose-500/20 font-bold text-rose-300'
                                      : isAdd
                                      ? 'border-cyan-400 bg-cyan-500/20 font-bold text-cyan-300'
                                      : 'border-cyan-500/15 bg-[#081529] text-slate-300'
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
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <span className="font-mono text-[11px] text-cyan-200/85">
            GRID_PATHFINDER · Bấm ô bất kỳ (trừ S và T) để bật/tắt tường cản (#)
          </span>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <span className="text-sky-400">■ S (Xuất phát)</span>
            <span className="text-amber-400">■ T (Đích)</span>
            <span className="text-emerald-400">■ Đường ngắn nhất</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="relative inline-block p-4 rounded-xl border border-cyan-500/35 algo-stage-grid shadow-[inset_0_0_32px_rgba(6,182,212,0.09)]">
            <CyberHudCorners />
            {Array.from({ length: R }).map((_, r) => (
              <div key={r} className="flex gap-1.5 mb-1.5 last:mb-0">
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
                    'bg-[#081529] border-cyan-500/20 text-slate-300 hover:border-cyan-400/60';
                  if (isWall) {
                    cellCls = 'bg-[#020610] border-slate-700/70 text-slate-600';
                  } else if (isStart) {
                    cellCls = 'bg-sky-500/25 border-sky-400 text-sky-200 font-bold shadow-[0_0_12px_rgba(56,189,248,0.35)]';
                  } else if (isEnd) {
                    cellCls = 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold shadow-[0_0_12px_rgba(251,191,36,0.35)]';
                  } else if (onPath) {
                    cellCls = 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_14px_rgba(16,185,129,0.4)]';
                  } else if (isCurrent) {
                    cellCls = 'bg-indigo-500/30 border-indigo-400 text-indigo-200 font-bold shadow-[0_0_12px_rgba(129,140,248,0.4)]';
                  } else if (isVisited) {
                    cellCls =
                      'bg-cyan-500/12 border-cyan-500/45 text-cyan-200';
                  } else if (inFrontier) {
                    cellCls =
                      'bg-amber-500/12 border-amber-400/50 text-amber-300';
                  }

                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onClick={() => onToggleWall?.(r, c)}
                      className={`w-12 h-12 rounded-lg border flex flex-col items-center justify-center font-mono transition-all cursor-pointer ${cellCls}`}
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
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <span className="font-mono text-[11px] text-amber-200/85">
            KNAPSACK_DP[i][w] · i = vật thứ i, w = sức chứa còn lại
          </span>
          {chosen.length > 0 && (
            <span className="font-mono font-bold text-emerald-400">
              Vật đã chọn: {chosen.map((x) => `#${x}`).join(', ')}
            </span>
          )}
        </div>

        <div className="relative overflow-x-auto pb-2 rounded-xl border border-amber-500/30 algo-stage-grid p-4 shadow-[inset_0_0_28px_rgba(245,158,11,0.08)]">
          <CyberHudCorners />
          <table className="relative z-10 border-collapse font-mono text-xs tabular-nums min-w-max">
            <thead>
              <tr>
                <th className="p-1.5 text-left text-[11px] text-slate-400 border-b border-cyan-500/20">
                  Vật \ w
                </th>
                {Array.from({ length: W + 1 }, (_, w) => (
                  <th
                    key={w}
                    className={`w-10 p-1.5 text-center border-b border-cyan-500/20 ${
                      w === st.curW ? 'text-amber-300 font-bold' : 'text-slate-400'
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
                  <td className="p-1.5 pr-3 text-[11px] font-semibold text-cyan-200/90 border-r border-cyan-500/20 whitespace-nowrap">
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
                              ? 'border-amber-400 bg-amber-500/25 text-amber-200 font-extrabold shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                              : isTrace
                              ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold'
                              : isDep
                              ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 font-bold'
                              : 'border-cyan-500/15 bg-[#081529] text-slate-300'
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
          <div className="relative inline-flex items-end gap-2 min-w-max h-48 pt-6 px-4 algo-stage-grid rounded-xl border border-indigo-500/35 shadow-[inset_0_0_32px_rgba(129,140,248,0.09)]">
            <CyberHudCorners />
            {arr.map((v, idx) => {
              const hPct = Math.max(15, Math.round((Math.abs(v) / maxVal) * 76));
              const isCurr = idx === st.idx;
              const inLis = lisIndices.includes(idx);
              return (
                <div key={idx} className="w-11 h-full flex flex-col items-center justify-end gap-1">
                  <span className="text-[11px] font-mono font-bold tabular-nums text-cyan-100">
                    {v}
                  </span>
                  <div
                    style={{ height: `${hPct}%` }}
                    className={`w-8 rounded-t-lg transition-all border ${
                      isCurr
                        ? 'bg-amber-400/90 border-amber-200 shadow-[0_0_14px_rgba(251,191,36,0.5)]'
                        : inLis
                        ? 'bg-emerald-400/90 border-emerald-200 shadow-[0_0_14px_rgba(52,211,153,0.45)]'
                        : idx < (st.idx ?? 0)
                        ? 'bg-cyan-500/75 border-cyan-300/60'
                        : 'bg-slate-700/70 border-slate-500/40'
                    }`}
                  />
                  <span className="text-[10px] font-mono text-indigo-300/80 tabular-nums pb-1">
                    dp={dp[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-mono font-semibold text-cyan-200">
            TAILS[] MONOTONIC ARRAY (LIS LEN = {tails.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tails.length > 0 ? (
              tails.map((tv, idx) => (
                <div
                  key={idx}
                  className={`w-12 py-1.5 rounded-lg border text-center font-mono tabular-nums ${
                    idx === st.replacedPos
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200 font-bold shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                      : 'border-emerald-400/70 bg-emerald-500/15 text-emerald-300 font-bold'
                  }`}
                >
                  <div className="text-[9px] text-slate-400">len {idx + 1}</div>
                  <div className="text-xs">{tv}</div>
                </div>
              ))
            ) : (
              <span className="text-xs font-mono text-slate-500">tails[] đang rỗng</span>
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
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <span className="font-mono text-[11px] text-pink-200/85">
            LCS_DP_MATRIX · Khớp ký tự lấy chéo trên-trái (↖ +1)
          </span>
          {st.lcsStr && (
            <span className="font-mono font-bold text-emerald-400">
              LCS = "{st.lcsStr}"
            </span>
          )}
        </div>

        <div className="relative overflow-x-auto pb-2 rounded-xl border border-pink-500/30 algo-stage-grid p-4 shadow-[inset_0_0_28px_rgba(236,72,153,0.08)]">
          <CyberHudCorners />
          <table className="relative z-10 border-collapse font-mono text-xs tabular-nums min-w-max">
            <thead>
              <tr>
                <th className="w-10 h-9 border-b border-cyan-500/20 text-slate-400">
                  A \ B
                </th>
                <th className="w-10 h-9 border-b border-cyan-500/20 text-slate-400">
                  ∅
                </th>
                {B.split('').map((ch, j) => (
                  <th
                    key={j}
                    className={`w-10 h-9 border-b border-cyan-500/20 font-bold ${
                      j + 1 === st.curJ ? 'text-cyan-300' : 'text-slate-200'
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
                    className={`w-10 h-9 text-center font-bold border-r border-cyan-500/20 ${
                      i === st.curI ? 'text-cyan-300' : 'text-slate-200'
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
                              ? 'border-amber-400 bg-amber-500/25 text-amber-200 font-extrabold shadow-[0_0_10px_rgba(251,191,36,0.35)]'
                              : trace?.matched
                              ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold'
                              : trace
                              ? 'border-cyan-400 bg-cyan-500/18 text-cyan-200'
                              : 'border-cyan-500/15 bg-[#081529] text-slate-300'
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
        <div className="font-mono text-[11px] text-orange-200/85">
          BACKTRACK_BOARD {N}×{N} · Các ô đỏ sẫm đang nằm trong tầm chiếu của Hậu đã đặt
        </div>
        <div className="relative inline-block p-4 rounded-xl border border-orange-500/35 algo-stage-grid shadow-[inset_0_0_32px_rgba(249,115,22,0.09)]">
          <CyberHudCorners />
          {Array.from({ length: N }).map((_, r) => (
            <div key={r} className="flex">
              {Array.from({ length: N }).map((__, c) => {
                const hasQueen = queens[r] === c;
                const isTrying = r === tryRow && c === tryCol;
                const darkSquare = (r + c) % 2 === 1;
                const attacked = !hasQueen && isAttackedByPlaced(r, c);

                let bg = darkSquare
                  ? 'bg-[#071326] border-cyan-500/15'
                  : 'bg-[#0d1f3a] border-cyan-500/20';
                if (hasQueen) {
                  bg = st.solved
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 shadow-[inset_0_0_12px_rgba(16,185,129,0.45)]'
                    : 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[inset_0_0_12px_rgba(34,211,238,0.4)]';
                } else if (isTrying && st.conflict) {
                  bg = 'bg-rose-500/35 border-rose-400 text-rose-200';
                } else if (attacked) {
                  bg = darkSquare
                    ? 'bg-rose-950/55 border-rose-500/25'
                    : 'bg-rose-900/40 border-rose-500/25';
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-11 h-11 sm:w-12 sm:h-12 border flex items-center justify-center transition-colors ${bg}`}
                  >
                    {hasQueen ? (
                      <Crown className="w-5 h-5 drop-shadow-[0_0_6px_rgba(34,211,238,0.65)]" />
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
