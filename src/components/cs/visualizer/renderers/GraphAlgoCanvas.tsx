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
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <span className="font-mono text-[11px] text-cyan-200/85">
          GRAPH_NODE_MATRIX · Kéo thả bất kỳ đỉnh nào để sắp xếp bố cục
        </span>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] inline-block" /> Đã chốt / Tối ưu
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] inline-block" /> Đang xét / Thư giãn
          </span>
          <span className="inline-flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] inline-block" /> Frontier
          </span>
        </div>
      </div>

      {/* Interactive Cyber SVG Graph Stage */}
      <div className="relative rounded-xl border border-cyan-500/30 bg-[#040b18] overflow-hidden shadow-[inset_0_0_40px_rgba(6,182,212,0.08)]">
        <span className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/70 rounded-tl-xs z-10" />
        <span className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/70 rounded-tr-xs z-10" />
        <span className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400/60 rounded-bl-xs z-10" />
        <span className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400/60 rounded-br-xs z-10" />

        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full h-auto max-h-[420px] select-none touch-none"
        >
          <defs>
            <pattern id="graph-cyber-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#0d223f" strokeWidth="0.9" />
              <circle cx="12" cy="12" r="0.9" fill="#1e4976" />
            </pattern>
            <radialGradient id="graph-center-aura" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#040b18" stopOpacity="0" />
            </radialGradient>
            <filter id="graph-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="arrow-idle" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7 z" fill="#475569" />
            </marker>
            <marker id="arrow-active" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
              <path d="M0,1 L8,4.5 L0,8 z" fill="#fbbf24" />
            </marker>
            <marker id="arrow-done" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
              <path d="M0,1 L8,4.5 L0,8 z" fill="#34d399" />
            </marker>
            <marker id="arrow-tree" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7 z" fill="#22d3ee" />
            </marker>
          </defs>

          <rect width={W} height={H} fill="#040b18" />
          <rect width={W} height={H} fill="url(#graph-cyber-grid)" />
          <rect width={W} height={H} fill="url(#graph-center-aura)" />

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

            let stroke = '#334155';
            let strokeWidth = 2;
            let dashArray: string | undefined = undefined;
            let markerEnd = directed ? 'url(#arrow-idle)' : undefined;

            if (isPath) {
              stroke = '#34d399';
              strokeWidth = 3.5;
              markerEnd = directed ? 'url(#arrow-done)' : undefined;
            } else if (isRelax) {
              stroke = '#fbbf24';
              strokeWidth = 3.2;
              markerEnd = directed ? 'url(#arrow-active)' : undefined;
            } else if (isTree) {
              stroke = '#22d3ee';
              strokeWidth = 2.6;
              markerEnd = directed ? 'url(#arrow-tree)' : undefined;
            } else if (isSkipped) {
              stroke = '#fb7185';
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
                    opacity={isSkipped ? 0.5 : 0.95}
                    filter={isPath || isRelax || isTree ? 'url(#graph-glow)' : undefined}
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
                    opacity={isSkipped ? 0.5 : 0.95}
                    filter={isPath || isRelax || isTree ? 'url(#graph-glow)' : undefined}
                  />
                )}

                {/* Cyber Weight Badge */}
                {(algo === 'dijkstra' || algo === 'kruskal' || e.w !== 1) && (
                  <g transform={`translate(${labelX}, ${labelY})`}>
                    <rect
                      x={-11}
                      y={-9}
                      width={22}
                      height={18}
                      rx={5}
                      fill="#061224"
                      stroke={isPath ? '#34d399' : isRelax ? '#fbbf24' : '#1e3a5f'}
                      strokeWidth={1.3}
                    />
                    <text
                      x={0}
                      y={3.5}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={700}
                      className={`font-mono tabular-nums ${
                        isPath
                          ? 'fill-emerald-300'
                          : isRelax
                          ? 'fill-amber-300'
                          : 'fill-cyan-100'
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

            let circleFill = '#071426';
            let circleStroke = '#38bdf8';
            let textFill = '#e2e8f0';

            if (isPathNode) {
              circleFill = '#064e3b';
              circleStroke = '#34d399';
              textFill = '#ecfdf5';
            } else if (isCurrent) {
              circleFill = '#78350f';
              circleStroke = '#fbbf24';
              textFill = '#fef3c7';
            } else if (isRelaxTarget) {
              circleFill = '#451a03';
              circleStroke = '#f59e0b';
              textFill = '#fde68a';
            } else if (isSettled) {
              circleFill = '#042f2e';
              circleStroke = '#10b981';
              textFill = '#6ee7b7';
            } else if (isFrontier) {
              circleFill = '#082f49';
              circleStroke = '#22d3ee';
              textFill = '#67e8f9';
            } else {
              circleStroke = '#334155';
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
                {(isCurrent || isPathNode || isFrontier) && (
                  <circle
                    r={28}
                    fill="none"
                    stroke={isPathNode ? '#34d399' : isCurrent ? '#fbbf24' : '#22d3ee'}
                    strokeWidth={1.8}
                    strokeDasharray={isCurrent ? '4 3' : undefined}
                    opacity={0.75}
                    filter="url(#graph-glow)"
                  />
                )}
                <circle
                  r={22}
                  fill={circleFill}
                  stroke={circleStroke}
                  strokeWidth={2.4}
                  filter={isCurrent || isPathNode ? 'url(#graph-glow)' : undefined}
                />
                <text
                  y={4.5}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={800}
                  fill={textFill}
                  className="font-mono"
                >
                  {n.label}
                </text>

                {/* Start / Target markers */}
                {isStart && (
                  <g transform="translate(-20, -23)">
                    <rect width={16} height={14} rx={4} fill="#0284c7" stroke="#38bdf8" strokeWidth={0.8} />
                    <text x={8} y={10} textAnchor="middle" fontSize={9} fontWeight={800} fill="#fff">
                      S
                    </text>
                  </g>
                )}
                {isTarget && (
                  <g transform="translate(5, -23)">
                    <rect width={16} height={14} rx={4} fill="#e11d48" stroke="#fda4af" strokeWidth={0.8} />
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
                      fill="#040b18"
                      stroke={distVal !== undefined && distVal < Infinity ? '#10b981' : '#1e3a5f'}
                      strokeWidth={1}
                    />
                    <text
                      y={3}
                      textAnchor="middle"
                      fontSize={9.5}
                      fontWeight={700}
                      className={`font-mono tabular-nums ${
                        distVal !== undefined && distVal < Infinity
                          ? 'fill-emerald-300'
                          : 'fill-slate-500'
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
                      fill="#061428"
                      stroke="#22d3ee"
                      strokeWidth={1}
                    />
                    <text
                      y={3}
                      textAnchor="middle"
                      fontSize={9.5}
                      fontWeight={700}
                      className="font-mono tabular-nums fill-cyan-300"
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

      {/* Live Auxiliary Data Structures in Dark Cyber Panels */}
      {algo === 'dijkstra' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-xl border border-cyan-500/25 bg-[#061121] p-3">
            <div className="text-xs font-mono font-bold text-cyan-200 mb-2">
              DIST[] &amp; PARENT[] TABLE
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono tabular-nums border-collapse">
                <thead>
                  <tr className="border-b border-cyan-500/20 text-slate-400">
                    <th className="py-1 text-left">Đỉnh</th>
                    {nodes.map((n) => (
                      <th key={n.id} className="py-1 px-1.5 text-center text-cyan-200">
                        {n.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-800/80">
                    <td className="py-1 text-slate-400">dist</td>
                    {nodes.map((n) => {
                      const d = distMap[n.id];
                      const settled = settledSet.has(n.id);
                      return (
                        <td
                          key={n.id}
                          className={`py-1 px-1.5 text-center font-bold ${
                            settled
                              ? 'text-emerald-400'
                              : d !== undefined && d < Infinity
                              ? 'text-cyan-300'
                              : 'text-slate-500'
                          }`}
                        >
                          {d === undefined || d === Infinity ? '∞' : d}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-400">parent</td>
                    {nodes.map((n) => (
                      <td key={n.id} className="py-1 px-1.5 text-center text-slate-300">
                        {parentMap[n.id] || '—'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/25 bg-[#061121] p-3 space-y-2">
            <div className="text-xs font-mono font-bold text-cyan-200">
              MIN-HEAP PRIORITY QUEUE
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs tabular-nums">
              {(st.pq || []).length > 0 ? (
                (st.pq as { d: number; u: string }[]).map((item, idx) => (
                  <span
                    key={`${item.u}-${item.d}-${idx}`}
                    className={`px-2 py-1 rounded-md border ${
                      idx === 0
                        ? 'border-amber-400/70 bg-amber-500/15 text-amber-300 font-bold'
                        : 'border-cyan-500/35 bg-cyan-500/10 text-cyan-300'
                    }`}
                  >
                    ({item.d}, {item.u})
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic text-xs">Priority Queue rỗng</span>
              )}
            </div>
          </div>
        </div>
      )}

      {(algo === 'bfs' || algo === 'dfs') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-cyan-500/25 bg-[#061121] p-3">
            <div className="text-xs font-mono font-bold text-cyan-200 mb-1.5">
              {algo === 'bfs' ? 'QUEUE (FIFO)' : 'STACK (LIFO)'}
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {(st.frontierIds || []).length > 0 ? (
                (st.frontierIds as string[]).map((id, idx) => (
                  <span
                    key={`${id}-${idx}`}
                    className="px-2 py-0.5 rounded border border-cyan-400/60 bg-cyan-500/15 text-cyan-300 font-bold"
                  >
                    {id}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic">Rỗng</span>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-cyan-500/25 bg-[#061121] p-3">
            <div className="text-xs font-mono font-bold text-cyan-200 mb-1.5">
              THỨ TỰ ĐÃ THĂM ({orderList.length}/{nodes.length})
            </div>
            <div className="font-mono text-xs font-bold text-emerald-400">
              {orderList.length ? orderList.join(' → ') : 'Chưa duyệt đỉnh nào'}
            </div>
          </div>
        </div>
      )}

      {algo === 'kruskal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-xl border border-cyan-500/25 bg-[#061121] p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-200">
              <span>SORTED EDGE LIST</span>
              <span className="text-emerald-400 tabular-nums">
                MST WEIGHT = {st.totalWeight ?? 0}
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
                        ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 font-bold'
                        : skipped
                        ? 'border-rose-500/40 bg-rose-500/10 text-rose-400 line-through'
                        : checking
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300 font-bold'
                        : 'border-slate-700 bg-[#040b18] text-slate-300'
                    }`}
                  >
                    {e.u}-{e.v} ({e.w})
                  </span>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/25 bg-[#061121] p-3 space-y-2">
            <div className="text-xs font-mono font-bold text-cyan-200">
              DSU DISJOINT SET (parent[u])
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-xs tabular-nums">
              {nodes.map((n) => (
                <div
                  key={n.id}
                  className="px-2 py-1 rounded border border-cyan-500/25 bg-[#040b18]"
                >
                  <span className="text-slate-400">{n.id}→</span>
                  <span className="font-bold text-cyan-300">
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
