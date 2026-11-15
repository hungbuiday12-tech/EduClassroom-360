import React, { useMemo, useRef, useState } from 'react';
import { GraphEdge2D, GraphNode2D, VizStep } from '../types';

interface GraphAlgoCanvasProps {
  step: VizStep;
  directed: boolean;
  startId: string;
  targetId: string;
  onMoveNode?: (id: string, x: number, y: number) => void;
}

export const GraphAlgoCanvas: React.FC<GraphAlgoCanvasProps> = ({
  step,
  directed,
  startId,
  targetId,
  onMoveNode
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const W = 700;
  const H = 400;
  const st = step.state || {};
  const algo: 'dijkstra' | 'bfs' | 'dfs' | 'kruskal' = st.algo || 'dijkstra';
  const nodes: GraphNode2D[] = st.nodes || [];
  const edges: GraphEdge2D[] = st.edges || [];

  const nodeMap = useMemo(() => {
    const m = new Map<string, GraphNode2D>();
    nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  const reverseEdgeSet = useMemo(() => {
    const pairs = new Set(edges.map((e) => `${e.u}->${e.v}`));
    const rev = new Set<string>();
    if (directed) {
      edges.forEach((e) => {
        if (pairs.has(`${e.v}->${e.u}`)) {
          rev.add(e.id);
        }
      });
    }
    return rev;
  }, [edges, directed]);

  const toSvgCoords = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(36, Math.min(W - 36, ((clientX - rect.left) / rect.width) * W));
    const y = Math.max(36, Math.min(H - 36, ((clientY - rect.top) / rect.height) * H));
    return { x: Math.round(x), y: Math.round(y) };
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingId || !onMoveNode) return;
    const { x, y } = toSvgCoords(e.clientX, e.clientY);
    onMoveNode(draggingId, x, y);
  };

  const handlePointerUp = () => {
    if (draggingId) setDraggingId(null);
  };

  const settledSet = new Set<string>(st.settledIds || []);
  const visitedSet = new Set<string>(st.visitedIds || []);
  const frontierSet = new Set<string>(
    algo === 'dijkstra'
      ? (st.pq || []).map((item: { u: string }) => item.u)
      : st.frontierIds || []
  );
  const pathNodeSet = new Set<string>(st.pathIds || []);
  const pathEdgeSet = new Set<string>(st.pathEdgeIds || []);
  const treeEdgeSet = new Set<string>(st.treeEdgeIds || []);
  const mstEdgeSet = new Set<string>(st.mstEdgeIds || []);
  const skippedEdgeSet = new Set<string>(st.skippedEdgeIds || []);
  const orderList: string[] = st.order || [];
  const distMap: Record<string, number> = st.dist || {};
  const parentMap: Record<string, string | null> = st.parent || {};

  // Build path edges for BFS/DFS when finished
  const bfsDfsPathEdgeSet = useMemo(() => {
    const set = new Set<string>();
    if ((algo === 'bfs' || algo === 'dfs') && pathNodeSet.size >= 2) {
      const pArr: string[] = st.pathIds || [];
      for (let i = 0; i < pArr.length - 1; i++) {
        const a = pArr[i];
        const b = pArr[i + 1];
        const found = edges.find(
          (e) => (e.u === a && e.v === b) || (!directed && e.u === b && e.v === a)
        );
        if (found) set.add(found.id);
      }
    }
    return set;
  }, [algo, edges, directed, pathNodeSet.size, st.pathIds]);

  const sortedKruskalEdges = useMemo(
    () => (algo === 'kruskal' ? [...edges].sort((a, b) => a.w - b.w) : []),
    [algo, edges]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
        <span>
          Sân khấu Đồ thị tương tác · Kéo thả bất kỳ đỉnh nào để sắp xếp bố cục
        </span>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Đã chốt / Đường tối ưu
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Đang xét / Thư giãn
          </span>
          <span className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Đang chờ (Frontier)
          </span>
        </div>
      </div>

      {/* Interactive SVG Graph Stage */}
      <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/90 overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full h-auto max-h-[420px] select-none touch-none"
        >
          <defs>
            <pattern id="graph-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1" fill="currentColor" className="text-slate-300/70 dark:text-slate-800" />
            </pattern>
            <marker id="arrow-idle" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7 z" fill="#94a3b8" />
            </marker>
            <marker id="arrow-active" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
              <path d="M0,1 L8,4.5 L0,8 z" fill="#f59e0b" />
            </marker>
            <marker id="arrow-done" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
              <path d="M0,1 L8,4.5 L0,8 z" fill="#10b981" />
            </marker>
            <marker id="arrow-tree" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7 z" fill="#0ea5e9" />
            </marker>
          </defs>

          <rect width={W} height={H} fill="url(#graph-dots)" />

          {/* Edges */}
          {edges.map((e) => {
            const nu = nodeMap.get(e.u);
            const nv = nodeMap.get(e.v);
            if (!nu || !nv) return null;

            const dx = nv.x - nu.x;
            const dy = nv.y - nu.y;
            const len = Math.max(1, Math.hypot(dx, dy));
            const ux = dx / len;
            const uy = dy / len;
            const nx = -uy;
            const ny = ux;
            const nodeR = 23;

            const isPath = pathEdgeSet.has(e.id) || bfsDfsPathEdgeSet.has(e.id) || mstEdgeSet.has(e.id);
            const isRelax = st.relaxEdgeId === e.id || st.checkingEdgeId === e.id;
            const isTree = treeEdgeSet.has(e.id);
            const isSkipped = skippedEdgeSet.has(e.id);

            let stroke = '#94a3b8';
            let strokeWidth = 2;
            let dashArray: string | undefined = undefined;
            let markerEnd = directed ? 'url(#arrow-idle)' : undefined;

            if (isPath) {
              stroke = '#10b981';
              strokeWidth = 3.5;
              markerEnd = directed ? 'url(#arrow-done)' : undefined;
            } else if (isRelax) {
              stroke = '#f59e0b';
              strokeWidth = 3.2;
              markerEnd = directed ? 'url(#arrow-active)' : undefined;
            } else if (isTree) {
              stroke = '#0ea5e9';
              strokeWidth = 2.6;
              markerEnd = directed ? 'url(#arrow-tree)' : undefined;
            } else if (isSkipped) {
              stroke = '#f43f5e';
              strokeWidth = 1.6;
              dashArray = '5 4';
            }

            const curveSign = reverseEdgeSet.has(e.id) ? 1 : 0;
            const curveOffset = curveSign * 22;

            const x1 = nu.x + ux * nodeR;
            const y1 = nu.y + uy * nodeR;
            const x2 = nv.x - ux * (directed ? nodeR + 4 : nodeR);
            const y2 = nv.y - uy * (directed ? nodeR + 4 : nodeR);

            const mx = (nu.x + nv.x) / 2 + nx * curveOffset;
            const my = (nu.y + nv.y) / 2 + ny * curveOffset;
            const labelX = (nu.x + nv.x) / 2 + nx * (curveOffset ? curveOffset * 1.15 : 10);
            const labelY = (nu.y + nv.y) / 2 + ny * (curveOffset ? curveOffset * 1.15 : 10);

            return (
              <g key={e.id}>
                {curveOffset !== 0 ? (
                  <path
                    d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    markerEnd={markerEnd}
                    opacity={isSkipped ? 0.55 : 0.95}
                  />
                ) : (
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    markerEnd={markerEnd}
                    opacity={isSkipped ? 0.55 : 0.95}
                  />
                )}

                {/* Weight Badge */}
                {(algo === 'dijkstra' || algo === 'kruskal' || e.w !== 1) && (
                  <g transform={`translate(${labelX}, ${labelY})`}>
                    <rect
                      x={-11}
                      y={-9}
                      width={22}
                      height={18}
                      rx={5}
                      className="fill-white dark:fill-slate-900"
                      stroke={isPath ? '#10b981' : isRelax ? '#f59e0b' : '#cbd5e1'}
                      strokeWidth={1.2}
                    />
                    <text
                      x={0}
                      y={3.5}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={700}
                      className={`font-mono tabular-nums ${
                        isPath
                          ? 'fill-emerald-600 dark:fill-emerald-400'
                          : isRelax
                          ? 'fill-amber-600 dark:fill-amber-400'
                          : 'fill-slate-700 dark:fill-slate-200'
                      }`}
                    >
                      {e.w}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((n) => {
            const isCurrent = st.currentId === n.id;
            const isSettled = settledSet.has(n.id) || visitedSet.has(n.id);
            const isPathNode = pathNodeSet.has(n.id);
            const isFrontier = frontierSet.has(n.id);
            const isRelaxTarget = st.relaxTargetId === n.id;
            const isStart = n.id === startId && algo !== 'kruskal';
            const isTarget = n.id === targetId && algo !== 'kruskal';

            let circleFill = 'fill-white dark:fill-slate-900';
            let circleStroke = '#64748b';
            let textFill = 'fill-slate-900 dark:fill-white';

            if (isPathNode) {
              circleFill = 'fill-emerald-600';
              circleStroke = '#10b981';
              textFill = 'fill-white';
            } else if (isCurrent) {
              circleFill = 'fill-amber-500';
              circleStroke = '#d97706';
              textFill = 'fill-slate-950';
            } else if (isRelaxTarget) {
              circleFill = 'fill-amber-100 dark:fill-amber-950';
              circleStroke = '#f59e0b';
            } else if (isSettled) {
              circleFill = 'fill-emerald-500/20 dark:fill-emerald-950';
              circleStroke = '#10b981';
              textFill = 'fill-emerald-800 dark:fill-emerald-200';
            } else if (isFrontier) {
              circleFill = 'fill-sky-500/15 dark:fill-sky-950';
              circleStroke = '#0ea5e9';
              textFill = 'fill-sky-700 dark:fill-sky-300';
            }

            const orderPos = orderList.indexOf(n.id);
            const distVal = distMap[n.id];

            return (
              <g
                key={n.id}
                transform={`translate(${n.x}, ${n.y})`}
                onPointerDown={(ev) => {
                  ev.stopPropagation();
                  setDraggingId(n.id);
                }}
                className="cursor-grab active:cursor-grabbing"
              >
                {(isCurrent || isPathNode) && (
                  <circle
                    r={28}
                    fill="none"
                    stroke={isPathNode ? '#10b981' : '#f59e0b'}
                    strokeWidth={2}
                    strokeDasharray={isCurrent ? '4 3' : undefined}
                    opacity={0.7}
                  />
                )}
                <circle
                  r={22}
                  className={circleFill}
                  stroke={circleStroke}
                  strokeWidth={2.4}
                />
                <text
                  y={4}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={800}
                  className={`font-mono ${textFill}`}
                >
                  {n.label}
                </text>

                {/* Start / Target markers */}
                {isStart && (
                  <g transform="translate(-19, -22)">
                    <rect width={16} height={14} rx={4} fill="#2563eb" />
                    <text x={8} y={10} textAnchor="middle" fontSize={9} fontWeight={800} fill="#fff">
                      S
                    </text>
                  </g>
                )}
                {isTarget && (
                  <g transform="translate(5, -22)">
                    <rect width={16} height={14} rx={4} fill="#e11d48" />
                    <text x={8} y={10} textAnchor="middle" fontSize={9} fontWeight={800} fill="#fff">
                      T
                    </text>
                  </g>
                )}

                {/* Dijkstra dist badge below node */}
                {algo === 'dijkstra' && (
                  <g transform="translate(0, 32)">
                    <rect
                      x={-22}
                      y={-8}
                      width={44}
                      height={16}
                      rx={4}
                      className="fill-white/95 dark:fill-slate-900/95"
                      stroke={distVal !== undefined && distVal < Infinity ? '#10b981' : '#cbd5e1'}
                      strokeWidth={1}
                    />
                    <text
                      y={3}
                      textAnchor="middle"
                      fontSize={9.5}
                      fontWeight={700}
                      className={`font-mono tabular-nums ${
                        distVal !== undefined && distVal < Infinity
                          ? 'fill-emerald-700 dark:fill-emerald-300'
                          : 'fill-slate-400'
                      }`}
                    >
                      d={distVal === undefined || distVal === Infinity ? '∞' : distVal}
                    </text>
                  </g>
                )}

                {/* BFS/DFS traversal index */}
                {(algo === 'bfs' || algo === 'dfs') && orderPos !== -1 && (
                  <g transform="translate(0, 32)">
                    <rect
                      x={-16}
                      y={-8}
                      width={32}
                      height={16}
                      rx={4}
                      className="fill-sky-50 dark:fill-sky-950"
                      stroke="#0ea5e9"
                      strokeWidth={1}
                    />
                    <text
                      y={3}
                      textAnchor="middle"
                      fontSize={9.5}
                      fontWeight={700}
                      className="font-mono tabular-nums fill-sky-700 dark:fill-sky-300"
                    >
                      #{orderPos + 1}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Live Auxiliary Data Structures */}
      {algo === 'dijkstra' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-3">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
              Bảng Khoảng Cách dist[] &amp; Truy vết parent[]
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono tabular-nums border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-1 text-left">Đỉnh</th>
                    {nodes.map((n) => (
                      <th key={n.id} className="py-1 px-1.5 text-center">
                        {n.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-800/60">
                    <td className="py-1 text-slate-500">dist</td>
                    {nodes.map((n) => {
                      const d = distMap[n.id];
                      const settled = settledSet.has(n.id);
                      return (
                        <td
                          key={n.id}
                          className={`py-1 px-1.5 text-center font-bold ${
                            settled
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : d !== undefined && d < Infinity
                              ? 'text-sky-600 dark:text-sky-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {d === undefined || d === Infinity ? '∞' : d}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-500">parent</td>
                    {nodes.map((n) => (
                      <td key={n.id} className="py-1 px-1.5 text-center text-slate-600 dark:text-slate-300">
                        {parentMap[n.id] || '—'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-3 space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Hàng đợi Ưu tiên Min-Heap (Priority Queue)
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs tabular-nums">
              {(st.pq || []).length > 0 ? (
                (st.pq as { d: number; u: string }[]).map((item, idx) => (
                  <span
                    key={`${item.u}-${item.d}-${idx}`}
                    className={`px-2 py-1 rounded-md border ${
                      idx === 0
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold'
                        : 'border-sky-300 dark:border-sky-800 bg-sky-50/70 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300'
                    }`}
                  >
                    ({item.d}, {item.u})
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic text-xs">Priority Queue rỗng</span>
              )}
            </div>
          </div>
        </div>
      )}

      {(algo === 'bfs' || algo === 'dfs') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-3">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              {algo === 'bfs' ? 'Queue (FIFO)' : 'Stack (LIFO)'}
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {(st.frontierIds || []).length > 0 ? (
                (st.frontierIds as string[]).map((id, idx) => (
                  <span
                    key={`${id}-${idx}`}
                    className="px-2 py-0.5 rounded border border-sky-400/60 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold"
                  >
                    {id}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">Rỗng</span>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-3">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Thứ tự đã thăm ({orderList.length}/{nodes.length})
            </div>
            <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {orderList.length ? orderList.join(' → ') : 'Chưa duyệt đỉnh nào'}
            </div>
          </div>
        </div>
      )}

      {algo === 'kruskal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span>Danh sách cạnh đã sắp xếp theo trọng số</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                Tổng MST = {st.totalWeight ?? 0}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px] tabular-nums">
              {sortedKruskalEdges.map((e) => {
                const chosen = mstEdgeSet.has(e.id);
                const skipped = skippedEdgeSet.has(e.id);
                const checking = st.checkingEdgeId === e.id;
                return (
                  <span
                    key={e.id}
                    className={`px-2 py-1 rounded-md border ${
                      chosen
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold'
                        : skipped
                        ? 'border-rose-400/60 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 line-through'
                        : checking
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {e.u}-{e.v} ({e.w})
                  </span>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-3 space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Cấu trúc DSU (parent[u])
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-xs tabular-nums">
              {nodes.map((n) => (
                <div
                  key={n.id}
                  className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                >
                  <span className="text-slate-400">{n.id}→</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    {(st.dsuParent && st.dsuParent[n.id]) || n.id}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
