import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Code2,
  GitMerge,
  Maximize2,
  Minimize2,
  Plus,
  RotateCcw,
  Sigma,
  StickyNote,
  Trash2,
  TrendingUp,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { InfiniteCanvasEdge, InfiniteCanvasNode } from '../../types';
import { FormattedText } from '../common/MathRenderer';

const STORAGE_KEY = 'synapse_infinite_canvas_v1';

const INITIAL_NODES: InfiniteCanvasNode[] = [
  {
    id: 'n_formula',
    kind: 'formula',
    x: 60,
    y: 70,
    width: 260,
    title: 'Định luật II Newton & Động học',
    accent: 'sky',
    content: '$$v(t) = v_0 + a t \\quad \\Rightarrow \\quad x(t) = x_0 + v_0 t + \\frac{1}{2}a t^2$$'
  },
  {
    id: 'n_graph',
    kind: 'graph',
    x: 380,
    y: 45,
    width: 280,
    title: 'Đồ thị Live: Sóng điều hòa / Parabol',
    accent: 'amber',
    content: 'Kéo thanh trượt để đổi hình dạng ngay trên bảng',
    graphType: 'sine',
    paramA: 1.4,
    paramB: 2.0
  },
  {
    id: 'n_solid',
    kind: 'solid3d',
    x: 720,
    y: 80,
    width: 250,
    title: 'Khối Đa Diện 3D Tương Tác',
    accent: 'emerald',
    content: 'Tự quay & minh họa tọa độ không gian Oxyz',
    solidKind: 'octahedron'
  },
  {
    id: 'n_code',
    kind: 'code',
    x: 380,
    y: 320,
    width: 290,
    title: 'Code C++: Tìm Cực Trị Bằng Tam Phân',
    accent: 'violet',
    content: `double l = -10, r = 10;\nfor(int it=0; it<80; ++it){\n  double m1 = l + (r-l)/3, m2 = r - (r-l)/3;\n  if(f(m1) < f(m2)) r = m2; else l = m1;\n}`
  }
];

const INITIAL_EDGES: InfiniteCanvasEdge[] = [
  { id: 'e1', fromId: 'n_formula', toId: 'n_graph', label: 'Biểu diễn đồ thị' },
  { id: 'e2', fromId: 'n_graph', toId: 'n_solid', label: 'Mở rộng 3D' },
  { id: 'e3', fromId: 'n_graph', toId: 'n_code', label: 'Tối ưu cực trị' }
];

const MiniGraphWidget: React.FC<{
  graphType: 'quadratic' | 'sine' | 'cubic';
  paramA: number;
  paramB: number;
}> = ({ graphType, paramA, paramB }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const W = c.width;
    const H = c.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#071122';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= W; px += 2) {
      const x = (px - W / 2) / 30;
      const y =
        graphType === 'quadratic'
          ? paramA * x * x + paramB
          : graphType === 'cubic'
          ? paramA * x * x * x - paramB * x
          : paramA * Math.sin(paramB * x);
      const py = H / 2 - y * 20;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }, [graphType, paramA, paramB]);
  return <canvas ref={ref} width={240} height={110} className="w-full rounded border border-slate-700" />;
};

const MiniSolid3DWidget: React.FC<{ solidKind: 'cube' | 'octahedron' | 'helix' }> = ({ solidKind }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const draw = (tMs: number) => {
      const t = tMs * 0.0012;
      const W = c.width;
      const H = c.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#071122';
      ctx.fillRect(0, 0, W, H);

      const proj = (x: number, y: number, z: number): [number, number] => {
        const rx = x * Math.cos(t) - z * Math.sin(t);
        const rz = x * Math.sin(t) + z * Math.cos(t);
        const ry = y * Math.cos(0.45) - rz * Math.sin(0.45);
        const f = 140 / (4.2 + rz);
        return [W / 2 + rx * f, H / 2 - ry * f];
      };

      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.8;

      if (solidKind === 'octahedron') {
        const verts: [number, number, number][] = [
          [0, 1.2, 0],
          [0, -1.2, 0],
          [1, 0, 0],
          [-1, 0, 0],
          [0, 0, 1],
          [0, 0, -1]
        ];
        const edges = [
          [0, 2], [0, 3], [0, 4], [0, 5],
          [1, 2], [1, 3], [1, 4], [1, 5],
          [2, 4], [4, 3], [3, 5], [5, 2]
        ];
        edges.forEach(([a, b]) => {
          const p1 = proj(...verts[a]);
          const p2 = proj(...verts[b]);
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.stroke();
        });
      } else if (solidKind === 'helix') {
        ctx.beginPath();
        for (let i = 0; i <= 70; i++) {
          const u = (i / 70) * Math.PI * 5;
          const pt = proj(Math.cos(u) * 0.9, -1.1 + (i / 70) * 2.2, Math.sin(u) * 0.9);
          if (i === 0) ctx.moveTo(pt[0], pt[1]);
          else ctx.lineTo(pt[0], pt[1]);
        }
        ctx.stroke();
      } else {
        const s = 0.85;
        const verts: [number, number, number][] = [
          [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
          [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
        ];
        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7]
        ];
        edges.forEach(([a, b]) => {
          const p1 = proj(...verts[a]);
          const p2 = proj(...verts[b]);
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.stroke();
        });
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [solidKind]);

  return <canvas ref={ref} width={220} height={115} className="w-full rounded border border-slate-700" />;
};

export const InfiniteStemCanvas: React.FC<{ language?: 'vi' | 'en' }> = () => {
  const [nodes, setNodes] = useState<InfiniteCanvasNode[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (Array.isArray(p.nodes) && p.nodes.length > 0) return p.nodes;
      }
    } catch {}
    return INITIAL_NODES;
  });
  const [edges, setEdges] = useState<InfiniteCanvasEdge[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (Array.isArray(p.edges)) return p.edges;
      }
    } catch {}
    return INITIAL_EDGES;
  });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.95);
  const [connectMode, setConnectMode] = useState(false);
  const [connectFromId, setConnectFromId] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const dragRef = useRef<{
    type: 'none' | 'pan' | 'node';
    nodeId?: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  }>({ type: 'none', startX: 0, startY: 0, origX: 0, origY: 0 });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
    } catch {}
  }, [nodes, edges]);

  const addNode = (kind: InfiniteCanvasNode['kind']) => {
    const id = `n_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    const baseX = Math.round((-pan.x + 120 + (nodes.length % 4) * 55) / zoom);
    const baseY = Math.round((-pan.y + 90 + (nodes.length % 3) * 45) / zoom);
    const created: InfiniteCanvasNode =
      kind === 'graph'
        ? {
            id,
            kind,
            x: baseX,
            y: baseY,
            width: 270,
            title: 'Đồ thị Live Mới',
            accent: 'amber',
            content: 'Điều chỉnh tham số a, b',
            graphType: 'quadratic',
            paramA: 1,
            paramB: -1
          }
        : kind === 'solid3d'
        ? {
            id,
            kind,
            x: baseX,
            y: baseY,
            width: 245,
            title: 'Khối 3D Mới',
            accent: 'emerald',
            content: 'Khối xoắn / hình lập phương 3D',
            solidKind: 'helix'
          }
        : kind === 'code'
        ? {
            id,
            kind,
            x: baseX,
            y: baseY,
            width: 280,
            title: 'Code C++ / Python',
            accent: 'violet',
            content: 'vector<int> a(n);\nsort(a.begin(), a.end());'
          }
        : kind === 'formula'
        ? {
            id,
            kind,
            x: baseX,
            y: baseY,
            width: 260,
            title: 'Công thức Toán / Lí',
            accent: 'sky',
            content: '$$E = \\frac{1}{2}mv^2 + mgh$$'
          }
        : {
            id,
            kind: 'note',
            x: baseX,
            y: baseY,
            width: 240,
            title: 'Ghi chú Tư duy',
            accent: 'rose',
            content: 'Chú ý kiểm tra điều kiện xác định trước khi bình phương 2 vế!'
          };

    setNodes((prev) => [...prev, created]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (d.type === 'none') return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (d.type === 'pan') {
      setPan({ x: d.origX + dx, y: d.origY + dy });
    } else if (d.type === 'node' && d.nodeId) {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === d.nodeId ? { ...n, x: d.origX + dx / zoom, y: d.origY + dy / zoom } : n
        )
      );
    }
  };

  const handlePointerUp = () => {
    dragRef.current.type = 'none';
  };

  const handleNodeClickForConnect = (nodeId: string) => {
    if (!connectMode) return;
    if (!connectFromId) {
      setConnectFromId(nodeId);
    } else if (connectFromId === nodeId) {
      setConnectFromId(null);
    } else {
      setEdges((prev) => [
        ...prev,
        { id: `e_${Date.now()}`, fromId: connectFromId, toId: nodeId }
      ]);
      setConnectFromId(null);
      setConnectMode(false);
    }
  };

  const accentBorder = (accent: InfiniteCanvasNode['accent']) =>
    accent === 'amber'
      ? 'border-amber-400/65'
      : accent === 'emerald'
      ? 'border-emerald-400/65'
      : accent === 'violet'
      ? 'border-violet-400/65'
      : accent === 'rose'
      ? 'border-rose-400/65'
      : 'border-sky-400/65';

  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-0 z-[110] bg-slate-950 p-3 flex flex-col gap-2'
          : 'sci-frame rounded-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-3 space-y-2.5'
      }
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => addNode('formula')}
            className="px-2.5 py-1.5 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Sigma className="w-3.5 h-3.5" />
            <span>+ Công thức</span>
          </button>
          <button
            type="button"
            onClick={() => addNode('graph')}
            className="px-2.5 py-1.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+ Đồ thị Live</span>
          </button>
          <button
            type="button"
            onClick={() => addNode('solid3d')}
            className="px-2.5 py-1.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Box className="w-3.5 h-3.5" />
            <span>+ Khối 3D</span>
          </button>
          <button
            type="button"
            onClick={() => addNode('code')}
            className="px-2.5 py-1.5 rounded bg-violet-500/15 hover:bg-violet-500/25 border border-violet-400/40 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>+ Code</span>
          </button>
          <button
            type="button"
            onClick={() => addNode('note')}
            className="px-2.5 py-1.5 rounded bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <StickyNote className="w-3.5 h-3.5" />
            <span>+ Ghi chú</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setConnectMode((v) => !v);
              setConnectFromId(null);
            }}
            className={`px-2.5 py-1.5 rounded border text-xs font-extrabold flex items-center gap-1 cursor-pointer ${
              connectMode
                ? 'bg-cyan-500 border-cyan-300 text-slate-950'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>
              {connectMode
                ? connectFromId
                  ? 'Chọn thẻ đích...'
                  : 'Chọn thẻ nguồn...'
                : 'Nối dây tư duy'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.45, +(z - 0.12).toFixed(2)))}
            className="p-1.5 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs font-bold px-1.5 tabular-nums">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.85, +(z + 0.12).toFixed(2)))}
            className="p-1.5 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
            title="Phóng to"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setPan({ x: 0, y: 0 });
              setZoom(0.95);
            }}
            className="p-1.5 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
            title="Về tâm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setFullscreen((f) => !f)}
            className="p-1.5 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
            title="Toàn màn hình"
          >
            {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Infinite Canvas Viewport */}
      <div
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            dragRef.current = {
              type: 'pan',
              startX: e.clientX,
              startY: e.clientY,
              origX: pan.x,
              origY: pan.y
            };
          }
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setZoom((z) => Math.max(0.45, Math.min(1.85, +(z - e.deltaY * 0.001).toFixed(2))));
          }
        }}
        className={`relative overflow-hidden rounded-md border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060c1a] infinite-canvas-dots cursor-grab active:cursor-grabbing select-none ${
          fullscreen ? 'flex-1' : 'h-[560px]'
        }`}
        style={{
          backgroundSize: `${Math.round(28 * zoom)}px ${Math.round(28 * zoom)}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      >
        <div
          className="absolute inset-0 origin-top-left pointer-events-none"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {/* SVG Thinking Wires */}
          <svg className="overflow-visible absolute inset-0 pointer-events-none" width="1" height="1">
            {edges.map((edge) => {
              const from = nodes.find((n) => n.id === edge.fromId);
              const to = nodes.find((n) => n.id === edge.toId);
              if (!from || !to) return null;
              const x1 = from.x + from.width / 2;
              const y1 = from.y + 68;
              const x2 = to.x + to.width / 2;
              const y2 = to.y + 68;
              const mx = (x1 + x2) / 2;
              return (
                <g key={edge.id}>
                  <path
                    d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    opacity="0.72"
                  />
                  <circle cx={x2} cy={y2} r="4.5" fill="#22d3ee" />
                </g>
              );
            })}
          </svg>

          {/* Draggable Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              onClick={() => handleNodeClickForConnect(node.id)}
              style={{ left: `${node.x}px`, top: `${node.y}px`, width: `${node.width}px` }}
              className={`pointer-events-auto absolute rounded-md bg-white/95 dark:bg-slate-900/95 border-2 ${accentBorder(
                node.accent
              )} shadow-lg p-3 space-y-2 ${
                connectFromId === node.id ? 'ring-2 ring-cyan-400' : ''
              }`}
            >
              <div
                onPointerDown={(e) => {
                  e.stopPropagation();
                  dragRef.current = {
                    type: 'node',
                    nodeId: node.id,
                    startX: e.clientX,
                    startY: e.clientY,
                    origX: node.x,
                    origY: node.y
                  };
                }}
                className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-800 cursor-move"
              >
                <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                  {node.title}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNodes((prev) => prev.filter((n) => n.id !== node.id));
                    setEdges((prev) =>
                      prev.filter((ed) => ed.fromId !== node.id && ed.toId !== node.id)
                    );
                  }}
                  className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {node.kind === 'graph' && (
                <div className="space-y-1.5">
                  <MiniGraphWidget
                    graphType={node.graphType || 'sine'}
                    paramA={node.paramA ?? 1.2}
                    paramB={node.paramB ?? 1.8}
                  />
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                    <label className="flex flex-col">
                      <span>a = {(node.paramA ?? 1.2).toFixed(1)}</span>
                      <input
                        type="range"
                        min={0.2}
                        max={2.8}
                        step={0.1}
                        value={node.paramA ?? 1.2}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setNodes((prev) =>
                            prev.map((x) => (x.id === node.id ? { ...x, paramA: v } : x))
                          );
                        }}
                        className="accent-amber-500"
                      />
                    </label>
                    <label className="flex flex-col">
                      <span>b = {(node.paramB ?? 1.8).toFixed(1)}</span>
                      <input
                        type="range"
                        min={-3}
                        max={4}
                        step={0.1}
                        value={node.paramB ?? 1.8}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setNodes((prev) =>
                            prev.map((x) => (x.id === node.id ? { ...x, paramB: v } : x))
                          );
                        }}
                        className="accent-amber-500"
                      />
                    </label>
                  </div>
                </div>
              )}

              {node.kind === 'solid3d' && (
                <div className="space-y-1.5">
                  <MiniSolid3DWidget solidKind={node.solidKind || 'octahedron'} />
                  <div className="flex gap-1">
                    {(['cube', 'octahedron', 'helix'] as const).map((sk) => (
                      <button
                        key={sk}
                        type="button"
                        onClick={() =>
                          setNodes((prev) =>
                            prev.map((x) => (x.id === node.id ? { ...x, solidKind: sk } : x))
                          )
                        }
                        className={`flex-1 py-1 rounded text-[10px] font-bold cursor-pointer ${
                          node.solidKind === sk
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {sk}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {node.kind === 'formula' && (
                <div className="text-xs text-slate-800 dark:text-slate-100">
                  <FormattedText text={node.content} />
                </div>
              )}

              {(node.kind === 'code' || node.kind === 'note') && (
                <textarea
                  value={node.content}
                  onChange={(e) => {
                    const v = e.target.value;
                    setNodes((prev) =>
                      prev.map((x) => (x.id === node.id ? { ...x, content: v } : x))
                    );
                  }}
                  rows={4}
                  className={`w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-[11px] resize-none ${
                    node.kind === 'code' ? 'font-mono text-emerald-600 dark:text-emerald-300' : ''
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-950/85 border border-slate-700 text-[10px] font-mono text-slate-300 pointer-events-none">
          Kéo nền để di chuyển · Kéo tiêu đề thẻ để sắp xếp · {nodes.length} khối · {edges.length} liên kết
        </div>
      </div>
    </div>
  );
};
