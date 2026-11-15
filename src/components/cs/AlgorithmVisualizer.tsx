import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ALGO_CATALOG,
  AlgoCategory,
  AlgoId,
  GraphEdge2D,
  GraphNode2D,
  Point2D,
  Segment2D,
  VizStep
} from './visualizer/types';
import {
  generateBinarySearchSteps,
  generateConvexHullSteps,
  generateKmpSteps,
  generateNumberSieveSteps,
  generatePalindromeSteps,
  generatePrefixKadaneSteps,
  generateSegmentSweepSteps,
  generateSortStackSteps,
  generateTwoPointersSteps
} from './visualizer/generatorsCore';
import {
  generateGraphSteps,
  generateGridSteps,
  generateKnapsackSteps,
  generateLcsSteps,
  generateLisSteps,
  generateNQueensSteps,
  generateSegmentTreeSteps
} from './visualizer/generatorsAdvanced';
import { CoordinateGeoCanvas } from './visualizer/renderers/CoordinateGeoCanvas';
import { ArrayStringVisualizer } from './visualizer/renderers/ArrayStringVisualizer';
import { MatrixDpVisualizer } from './visualizer/renderers/MatrixDpVisualizer';
import { GraphAlgoCanvas } from './visualizer/renderers/GraphAlgoCanvas';
import { ViewportPortal } from '../common/ViewportPortal';
import {
  ArrowLeft,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

interface AlgorithmVisualizerProps {
  initialAlgoId?: AlgoId;
  embeddedLessonTitle?: string;
  onBack?: () => void;
  onScoreEarned?: (xp: number) => void;
}

const CATEGORY_TABS: { id: AlgoCategory; label: string }[] = [
  { id: 'all', label: 'Tất cả (16)' },
  { id: 'coord', label: 'Tọa độ Oxy' },
  { id: 'string', label: 'Xâu (String)' },
  { id: 'array', label: 'Mảng 1D & Số học' },
  { id: 'binary_search', label: 'Chặt nhị phân' },
  { id: 'matrix_dp', label: 'Mảng 2D & DP' },
  { id: 'graph_tree', label: 'Đồ thị · Cây · Quay lui' }
];

const DEFAULT_HULL_POINTS: Point2D[] = [
  { id: 'p0', x: 1, y: 2, label: 'A' },
  { id: 'p1', x: 3, y: 7, label: 'B' },
  { id: 'p2', x: 4, y: 4, label: 'C' },
  { id: 'p3', x: 6, y: 1, label: 'D' },
  { id: 'p4', x: 7, y: 6, label: 'E' },
  { id: 'p5', x: 9, y: 3, label: 'F' },
  { id: 'p6', x: 5, y: 8, label: 'G' },
  { id: 'p7', x: 2, y: 4, label: 'H' }
];

const DEFAULT_SEGMENTS: Segment2D[] = [
  { id: 's1', label: 'S1', x1: 1, y1: 2, x2: 7, y2: 7 },
  { id: 's2', label: 'S2', x1: 2, y1: 8, x2: 8, y2: 2 },
  { id: 's3', label: 'S3', x1: 3, y1: 1, x2: 9, y2: 5 },
  { id: 's4', label: 'S4', x1: 5, y1: 8, x2: 10, y2: 8 }
];

const DEFAULT_GRAPH_NODES: GraphNode2D[] = [
  { id: 'A', label: 'A', x: 100, y: 200 },
  { id: 'B', label: 'B', x: 260, y: 95 },
  { id: 'C', label: 'C', x: 260, y: 305 },
  { id: 'D', label: 'D', x: 440, y: 95 },
  { id: 'E', label: 'E', x: 440, y: 305 },
  { id: 'F', label: 'F', x: 600, y: 200 }
];

const DEFAULT_GRAPH_EDGES: GraphEdge2D[] = [
  { id: 'e1', u: 'A', v: 'B', w: 4 },
  { id: 'e2', u: 'A', v: 'C', w: 2 },
  { id: 'e3', u: 'C', v: 'B', w: 1 },
  { id: 'e4', u: 'B', v: 'D', w: 5 },
  { id: 'e5', u: 'C', v: 'D', w: 8 },
  { id: 'e6', u: 'C', v: 'E', w: 10 },
  { id: 'e7', u: 'D', v: 'E', w: 2 },
  { id: 'e8', u: 'D', v: 'F', w: 6 },
  { id: 'e9', u: 'E', v: 'F', w: 3 }
];

const INITIAL_WALLS: boolean[][] = [
  [false, false, false, true, false, false, false],
  [false, true, false, true, false, true, false],
  [false, true, false, false, false, true, false],
  [false, false, true, true, false, false, false],
  [false, false, false, false, false, true, false]
];

const INITIAL_WEIGHTS: number[][] = [
  [1, 3, 2, 5, 1, 2, 1],
  [2, 9, 1, 4, 2, 8, 1],
  [1, 8, 2, 1, 3, 7, 2],
  [2, 1, 6, 9, 1, 2, 1],
  [3, 2, 1, 2, 1, 5, 1]
];

function parseNumberArray(text: string, fallback: number[]): number[] {
  const nums = text
    .split(/[\s,;]+/)
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n));
  return nums.length ? nums : fallback;
}

function parsePointsInput(text: string): Point2D[] {
  const tokens = text
    .split(/[;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const pts: Point2D[] = [];
  tokens.forEach((tok, idx) => {
    const parts = tok.split(/[,\s]+/).map(Number);
    if (parts.length >= 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
      const label = String.fromCharCode(65 + (idx % 26)) + (idx >= 26 ? String(Math.floor(idx / 26)) : '');
      pts.push({ id: `p-${idx}`, x: parts[0], y: parts[1], label });
    }
  });
  return pts;
}

function parseSegmentsInput(text: string): Segment2D[] {
  const lines = text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const segs: Segment2D[] = [];
  lines.forEach((line, idx) => {
    const nums = line.split(/[,\s]+/).map(Number);
    if (nums.length >= 4 && nums.slice(0, 4).every(Number.isFinite)) {
      segs.push({
        id: `seg-${idx}`,
        label: `S${idx + 1}`,
        x1: nums[0],
        y1: nums[1],
        x2: nums[2],
        y2: nums[3]
      });
    }
  });
  return segs.length ? segs : DEFAULT_SEGMENTS;
}

function parseKnapsackItems(text: string): { w: number; v: number }[] {
  const tokens = text
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const items: { w: number; v: number }[] = [];
  tokens.forEach((tok) => {
    const [wStr, vStr] = tok.split(/[:\s]+/);
    const w = Math.max(1, Math.min(12, Math.round(Number(wStr))));
    const v = Math.max(1, Math.min(99, Math.round(Number(vStr))));
    if (Number.isFinite(w) && Number.isFinite(v)) items.push({ w, v });
  });
  return items.length
    ? items
    : [
        { w: 2, v: 3 },
        { w: 3, v: 4 },
        { w: 4, v: 5 },
        { w: 5, v: 8 }
      ];
}

function parseGraphEdges(
  text: string,
  prevNodes: GraphNode2D[]
): { nodes: GraphNode2D[]; edges: GraphEdge2D[] } {
  const lines = text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const edges: GraphEdge2D[] = [];
  const idSet = new Set<string>();
  lines.forEach((line, idx) => {
    const parts = line.split(/[\s,]+/);
    if (parts.length >= 2) {
      const u = parts[0].toUpperCase();
      const v = parts[1].toUpperCase();
      const w = parts[2] !== undefined && Number.isFinite(Number(parts[2])) ? Number(parts[2]) : 1;
      if (u && v) {
        idSet.add(u);
        idSet.add(v);
        edges.push({ id: `ge-${idx}-${u}-${v}`, u, v, w });
      }
    }
  });

  if (idSet.size === 0) {
    return { nodes: prevNodes, edges: DEFAULT_GRAPH_EDGES };
  }

  const prevMap = new Map(prevNodes.map((n) => [n.id, n]));
  const ids = Array.from(idSet);
  const nodes: GraphNode2D[] = ids.map((id, idx) => {
    const existing = prevMap.get(id);
    if (existing) return existing;
    const angle = (2 * Math.PI * idx) / Math.max(1, ids.length) - Math.PI / 2;
    return {
      id,
      label: id,
      x: Math.round(350 + 200 * Math.cos(angle)),
      y: Math.round(200 + 130 * Math.sin(angle))
    };
  });

  return { nodes, edges };
}

export const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({
  initialAlgoId = 'coord_hull',
  embeddedLessonTitle,
  onBack,
  onScoreEarned
}) => {
  const [category, setCategory] = useState<AlgoCategory>('all');
  const [algoId, setAlgoId] = useState<AlgoId>(initialAlgoId);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync if prop changes from lesson navigation
  useEffect(() => {
    setAlgoId(initialAlgoId);
    setStepIdx(0);
    setIsPlaying(false);
  }, [initialAlgoId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  // Playback state
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const rewardedAlgosRef = useRef<Set<string>>(new Set());

  // -------------------------------------------------------------------
  // Algorithm-specific Interactive Inputs
  // -------------------------------------------------------------------
  // 1. Coord Hull
  const [hullPoints, setHullPoints] = useState<Point2D[]>(DEFAULT_HULL_POINTS);
  const [hullText, setHullText] = useState<string>(
    DEFAULT_HULL_POINTS.map((p) => `${p.x},${p.y}`).join('; ')
  );

  // 2. Coord Sweep
  const [segText, setSegText] = useState<string>(
    DEFAULT_SEGMENTS.map((s) => `${s.x1},${s.y1},${s.x2},${s.y2}`).join('\n')
  );

  // 3. KMP
  const [kmpText, setKmpText] = useState<string>('ABABDABACDABABCABAB');
  const [kmpPattern, setKmpPattern] = useState<string>('ABABCABAB');

  // 4. Palindrome
  const [palStr, setPalStr] = useState<string>('BABADCBAB');

  // 5. Prefix Sum & Kadane
  const [prefixArrText, setPrefixArrText] = useState<string>('-2, -3, 4, -1, -2, 1, 5, -3');
  const [queryL, setQueryL] = useState<number>(2);
  const [queryR, setQueryR] = useState<number>(6);

  // 6. Two Pointers
  const [tpArrText, setTpArrText] = useState<string>('3, 1, 2, 7, 4, 2, 1, 1, 5');
  const [tpTargetS, setTpTargetS] = useState<number>(8);

  // 7. Sort & Stack
  const [sortArrText, setSortArrText] = useState<string>('4, 7, 2, 5, 8, 3, 6, 1');
  const [sortMode, setSortMode] = useState<'monostack' | 'quicksort' | 'mergesort'>('monostack');

  // 8. Binary Search
  const [bsMode, setBsMode] = useState<'array' | 'answer'>('answer');
  const [bsArrText, setBsArrText] = useState<string>('7, 2, 5, 10, 8, 4, 6');
  const [bsTarget, setBsTarget] = useState<number>(23);
  const [bsKParts, setBsKParts] = useState<number>(3);

  // 9. Matrix 2D
  const [gridMode, setGridMode] = useState<'bfs' | 'dijkstra' | 'prefix2d'>('bfs');
  const [gridWalls, setGridWalls] = useState<boolean[][]>(INITIAL_WALLS);
  const [gridWeights, setGridWeights] = useState<number[][]>(INITIAL_WEIGHTS);
  const [gridRect, setGridRect] = useState<{ r1: number; c1: number; r2: number; c2: number }>({
    r1: 1,
    c1: 1,
    r2: 3,
    c2: 4
  });
  const rectCornerTurnRef = useRef<0 | 1>(0);

  // 10. Knapsack
  const [knapText, setKnapText] = useState<string>('2:3, 3:4, 4:5, 5:8');
  const [knapW, setKnapW] = useState<number>(7);

  // 11. LIS
  const [lisArrText, setLisArrText] = useState<string>('3, 1, 5, 2, 6, 4, 9, 7');

  // 12. LCS
  const [lcsA, setLcsA] = useState<string>('ABCBDAB');
  const [lcsB, setLcsB] = useState<string>('BDCABA');

  // 13. Graph
  const [graphSubAlgo, setGraphSubAlgo] = useState<'dijkstra' | 'bfs' | 'dfs' | 'kruskal'>('dijkstra');
  const [graphDirected, setGraphDirected] = useState<boolean>(false);
  const [graphStart, setGraphStart] = useState<string>('A');
  const [graphTarget, setGraphTarget] = useState<string>('F');
  const [graphNodes, setGraphNodes] = useState<GraphNode2D[]>(DEFAULT_GRAPH_NODES);
  const [graphEdgeText, setGraphEdgeText] = useState<string>(
    DEFAULT_GRAPH_EDGES.map((e) => `${e.u} ${e.v} ${e.w}`).join('\n')
  );

  // 14. Segment Tree
  const [segArrText, setSegArrText] = useState<string>('3, 1, 4, 1, 5, 9, 2, 6');
  const [segOp, setSegOp] = useState<'query' | 'update'>('query');
  const [segQL, setSegQL] = useState<number>(1);
  const [segQR, setSegQR] = useState<number>(5);
  const [segUpdIdx, setSegUpdIdx] = useState<number>(3);
  const [segUpdVal, setSegUpdVal] = useState<number>(10);

  // 15. N-Queens
  const [queensN, setQueensN] = useState<number>(4);

  // 16. Number Theory
  const [numMode, setNumMode] = useState<'sieve' | 'binpow'>('sieve');
  const [sieveN, setSieveN] = useState<number>(36);
  const [powA, setPowA] = useState<number>(3);
  const [powB, setPowB] = useState<number>(13);
  const [powM, setPowM] = useState<number>(1000);

  const parsedGraph = useMemo(
    () => parseGraphEdges(graphEdgeText, graphNodes),
    [graphEdgeText, graphNodes]
  );

  // Build steps for active algorithm
  const steps: VizStep[] = useMemo(() => {
    switch (algoId) {
      case 'coord_hull':
        return generateConvexHullSteps(hullPoints);
      case 'coord_sweep':
        return generateSegmentSweepSteps(parseSegmentsInput(segText));
      case 'string_kmp':
        return generateKmpSteps(kmpText, kmpPattern);
      case 'string_palindrome':
        return generatePalindromeSteps(palStr);
      case 'array_prefix_kadane':
        return generatePrefixKadaneSteps(
          parseNumberArray(prefixArrText, [-2, -3, 4, -1, -2, 1, 5, -3]),
          queryL,
          queryR
        );
      case 'array_two_pointers':
        return generateTwoPointersSteps(
          parseNumberArray(tpArrText, [3, 1, 2, 7, 4, 2, 1, 1, 5]),
          tpTargetS
        );
      case 'array_sort_stack':
        return generateSortStackSteps(
          parseNumberArray(sortArrText, [4, 7, 2, 5, 8, 3, 6, 1]),
          sortMode
        );
      case 'binary_search':
        return generateBinarySearchSteps(
          parseNumberArray(
            bsArrText,
            bsMode === 'array' ? [2, 5, 8, 12, 16, 23, 38, 56, 72, 91] : [7, 2, 5, 10, 8, 4, 6]
          ),
          bsTarget,
          bsMode,
          bsKParts
        );
      case 'matrix_grid':
        return generateGridSteps(
          5,
          7,
          gridWalls,
          gridWeights,
          { r: 0, c: 0 },
          { r: 4, c: 6 },
          gridMode,
          gridRect
        );
      case 'dp_knapsack':
        return generateKnapsackSteps(parseKnapsackItems(knapText), knapW);
      case 'dp_lis':
        return generateLisSteps(parseNumberArray(lisArrText, [3, 1, 5, 2, 6, 4, 9, 7]));
      case 'dp_lcs':
        return generateLcsSteps(lcsA, lcsB);
      case 'graph_algo': {
        const validStart = parsedGraph.nodes.some((n) => n.id === graphStart)
          ? graphStart
          : parsedGraph.nodes[0]?.id || 'A';
        const validTarget = parsedGraph.nodes.some((n) => n.id === graphTarget)
          ? graphTarget
          : parsedGraph.nodes[parsedGraph.nodes.length - 1]?.id || validStart;
        return generateGraphSteps(
          parsedGraph.nodes,
          parsedGraph.edges,
          validStart,
          validTarget,
          graphSubAlgo === 'kruskal' ? false : graphDirected,
          graphSubAlgo
        );
      }
      case 'tree_segtree':
        return generateSegmentTreeSteps(
          parseNumberArray(segArrText, [3, 1, 4, 1, 5, 9, 2, 6]),
          segOp,
          segQL,
          segQR,
          segUpdIdx,
          segUpdVal
        );
      case 'backtrack_nqueens':
        return generateNQueensSteps(queensN);
      case 'number_sieve':
        return generateNumberSieveSteps(sieveN, numMode, powA, powB, powM);
      default:
        return [];
    }
  }, [
    algoId,
    hullPoints,
    segText,
    kmpText,
    kmpPattern,
    palStr,
    prefixArrText,
    queryL,
    queryR,
    tpArrText,
    tpTargetS,
    sortArrText,
    sortMode,
    bsMode,
    bsArrText,
    bsTarget,
    bsKParts,
    gridWalls,
    gridWeights,
    gridMode,
    gridRect,
    knapText,
    knapW,
    lisArrText,
    lcsA,
    lcsB,
    parsedGraph,
    graphStart,
    graphTarget,
    graphDirected,
    graphSubAlgo,
    segArrText,
    segOp,
    segQL,
    segQR,
    segUpdIdx,
    segUpdVal,
    queensN,
    numMode,
    sieveN,
    powA,
    powB,
    powM
  ]);

  // Clamp stepIdx when steps regenerate
  useEffect(() => {
    setStepIdx((prev) => Math.max(0, Math.min(prev, Math.max(0, steps.length - 1))));
  }, [steps.length]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const intervalMs = Math.max(120, Math.round(900 / speed));
    const timer = window.setInterval(() => {
      setStepIdx((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [isPlaying, speed, stepIdx, steps.length]);

  // Award XP when user completes simulation
  useEffect(() => {
    if (
      steps.length > 1 &&
      stepIdx === steps.length - 1 &&
      onScoreEarned &&
      !rewardedAlgosRef.current.has(algoId)
    ) {
      rewardedAlgosRef.current.add(algoId);
      onScoreEarned(15);
    }
  }, [stepIdx, steps.length, algoId, onScoreEarned]);

  const currentMeta = useMemo(
    () => ALGO_CATALOG.find((a) => a.id === algoId) || ALGO_CATALOG[0],
    [algoId]
  );

  const visibleAlgos = useMemo(() => {
    if (category === 'all') return ALGO_CATALOG;
    return ALGO_CATALOG.filter((a) => a.category === category);
  }, [category]);

  const currentStep: VizStep = steps[Math.min(stepIdx, Math.max(0, steps.length - 1))] || {
    stepIndex: 0,
    title: 'Sẵn sàng',
    description: 'Nhấn Play hoặc Bước tiếp để quan sát mô phỏng.',
    variables: [],
    state: {}
  };

  const handleSelectAlgo = (nextId: AlgoId) => {
    setAlgoId(nextId);
    setStepIdx(0);
    setIsPlaying(false);
  };

  // Canvas Interaction Handlers
  const handleAddHullPoint = (x: number, y: number) => {
    if (hullPoints.length >= 20) return;
    if (hullPoints.some((p) => p.x === x && p.y === y)) return;
    const idx = hullPoints.length;
    const label =
      String.fromCharCode(65 + (idx % 26)) + (idx >= 26 ? String(Math.floor(idx / 26)) : '');
    const next = [...hullPoints, { id: `p-${Date.now()}`, x, y, label }];
    setHullPoints(next);
    setHullText(next.map((p) => `${p.x},${p.y}`).join('; '));
  };

  const handleToggleGridWall = (r: number, c: number) => {
    if ((r === 0 && c === 0) || (r === 4 && c === 6)) return;
    setGridWalls((prev) =>
      prev.map((row, ri) => (ri === r ? row.map((val, ci) => (ci === c ? !val : val)) : row))
    );
  };

  const handleSelectGridRectCell = (r: number, c: number) => {
    if (rectCornerTurnRef.current === 0) {
      setGridRect((prev) => ({
        r1: Math.min(r, prev.r2),
        c1: Math.min(c, prev.c2),
        r2: Math.max(r, prev.r2),
        c2: Math.max(c, prev.c2)
      }));
      rectCornerTurnRef.current = 1;
    } else {
      setGridRect((prev) => ({
        r1: Math.min(prev.r1, r),
        c1: Math.min(prev.c1, c),
        r2: Math.max(prev.r1, r),
        c2: Math.max(prev.c1, c)
      }));
      rectCornerTurnRef.current = 0;
    }
  };

  const handleMoveGraphNode = (id: string, x: number, y: number) => {
    setGraphNodes((prev) => {
      const exists = prev.some((n) => n.id === id);
      if (exists) return prev.map((n) => (n.id === id ? { ...n, x, y } : n));
      return [...prev, { id, label: id, x, y }];
    });
  };

  // Status badge label (dual-coded text, no decorative pulse)
  const statusLabel = (() => {
    switch (currentStep.statusTag) {
      case 'init':
        return { text: 'Khởi tạo', cls: 'text-slate-600 dark:text-slate-300' };
      case 'compare':
        return { text: 'So sánh / Kiểm tra', cls: 'text-sky-600 dark:text-sky-400' };
      case 'update':
        return { text: 'Cập nhật trạng thái', cls: 'text-amber-600 dark:text-amber-400' };
      case 'discard':
        return { text: 'Loại bỏ nhánh', cls: 'text-rose-600 dark:text-rose-400' };
      case 'backtrack':
        return { text: 'Quay lui (Backtrack)', cls: 'text-orange-600 dark:text-orange-400' };
      case 'done':
        return { text: 'Hoàn tất kết quả', cls: 'text-emerald-600 dark:text-emerald-400' };
      default:
        return { text: 'Thực thi', cls: 'text-slate-600 dark:text-slate-300' };
    }
  })();

  // -------------------------------------------------------------------
  // Parameter Controls Strip tailored to active AlgoId
  // -------------------------------------------------------------------
  const renderInputControls = () => {
    switch (algoId) {
      case 'coord_hull':
        return (
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
              Điểm (x,y; ...):
            </label>
            <input
              type="text"
              value={hullText}
              onChange={(e) => {
                setHullText(e.target.value);
                const parsed = parsePointsInput(e.target.value);
                if (parsed.length > 0) setHullPoints(parsed);
              }}
              className="flex-1 min-w-[210px] px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={() => {
                setHullPoints(DEFAULT_HULL_POINTS);
                setHullText(DEFAULT_HULL_POINTS.map((p) => `${p.x},${p.y}`).join('; '));
                setStepIdx(0);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Mẫu chuẩn
            </button>
            <button
              type="button"
              onClick={() => {
                const colinear: Point2D[] = [
                  { id: 'c0', x: 1, y: 1, label: 'A' },
                  { id: 'c1', x: 3, y: 3, label: 'B' },
                  { id: 'c2', x: 5, y: 5, label: 'C' },
                  { id: 'c3', x: 8, y: 2, label: 'D' },
                  { id: 'c4', x: 7, y: 7, label: 'E' },
                  { id: 'c5', x: 2, y: 6, label: 'F' }
                ];
                setHullPoints(colinear);
                setHullText(colinear.map((p) => `${p.x},${p.y}`).join('; '));
                setStepIdx(0);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Có điểm thẳng hàng
            </button>
            <button
              type="button"
              onClick={() => {
                const next = hullPoints.slice(0, -1);
                setHullPoints(next);
                setHullText(next.map((p) => `${p.x},${p.y}`).join('; '));
              }}
              className="px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              Xóa điểm cuối
            </button>
          </div>
        );

      case 'coord_sweep':
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Mỗi dòng 1 đoạn thẳng (x1, y1, x2, y2):
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSegText(DEFAULT_SEGMENTS.map((s) => `${s.x1},${s.y1},${s.x2},${s.y2}`).join('\n'));
                    setStepIdx(0);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                >
                  Mẫu cắt chữ X
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSegText('1,2,8,2\n2,6,9,1\n3,1,6,7\n5,4,10,6');
                    setStepIdx(0);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                >
                  Nhiều giao điểm
                </button>
              </div>
            </div>
            <textarea
              rows={2}
              value={segText}
              onChange={(e) => setSegText(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-100"
            />
          </div>
        );

      case 'string_kmp':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Văn bản T:</span>
              <input
                type="text"
                value={kmpText}
                onChange={(e) => {
                  setKmpText(e.target.value.toUpperCase());
                  setStepIdx(0);
                }}
                className="w-48 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Mẫu P:</span>
              <input
                type="text"
                value={kmpPattern}
                onChange={(e) => {
                  setKmpPattern(e.target.value.toUpperCase());
                  setStepIdx(0);
                }}
                className="w-36 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setKmpText('ABABABABAC');
                setKmpPattern('ABABAC');
                setStepIdx(0);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
            >
              Mẫu lặp tiền tố
            </button>
          </div>
        );

      case 'string_palindrome':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Xâu S:</span>
              <input
                type="text"
                value={palStr}
                onChange={(e) => {
                  setPalStr(e.target.value.toUpperCase());
                  setStepIdx(0);
                }}
                className="w-48 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setPalStr('ABBAACAA');
                setStepIdx(0);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
            >
              Mẫu tâm chẵn ABBA
            </button>
          </div>
        );

      case 'array_prefix_kadane':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs flex-1 min-w-[200px]">
              <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">Mảng a[]:</span>
              <input
                type="text"
                value={prefixArrText}
                onChange={(e) => {
                  setPrefixArrText(e.target.value);
                  setStepIdx(0);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
              />
            </label>
            <label className="flex items-center gap-1 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">L:</span>
              <input
                type="number"
                min={0}
                max={15}
                value={queryL}
                onChange={(e) => setQueryL(Number(e.target.value))}
                className="w-14 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs tabular-nums"
              />
            </label>
            <label className="flex items-center gap-1 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">R:</span>
              <input
                type="number"
                min={0}
                max={15}
                value={queryR}
                onChange={(e) => setQueryR(Number(e.target.value))}
                className="w-14 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs tabular-nums"
              />
            </label>
          </div>
        );

      case 'array_two_pointers':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs flex-1 min-w-[200px]">
              <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">Mảng a[]:</span>
              <input
                type="text"
                value={tpArrText}
                onChange={(e) => {
                  setTpArrText(e.target.value);
                  setStepIdx(0);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Tổng tối đa S:</span>
              <input
                type="number"
                min={1}
                max={100}
                value={tpTargetS}
                onChange={(e) => {
                  setTpTargetS(Math.max(1, Number(e.target.value)));
                  setStepIdx(0);
                }}
                className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs tabular-nums"
              />
            </label>
          </div>
        );

      case 'array_sort_stack':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              {(
                [
                  { id: 'monostack', label: 'Stack Đơn Điệu' },
                  { id: 'quicksort', label: 'QuickSort' },
                  { id: 'mergesort', label: 'MergeSort' }
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSortMode(m.id);
                    setStepIdx(0);
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                    sortMode === m.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-1.5 text-xs flex-1 min-w-[180px]">
              <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">Mảng:</span>
              <input
                type="text"
                value={sortArrText}
                onChange={(e) => {
                  setSortArrText(e.target.value);
                  setStepIdx(0);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
              />
            </label>
          </div>
        );

      case 'binary_search':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => {
                  setBsMode('answer');
                  setBsArrText('7, 2, 5, 10, 8, 4, 6');
                  setStepIdx(0);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                  bsMode === 'answer' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Chặt Kết Quả (Đồ thị f(mid))
              </button>
              <button
                type="button"
                onClick={() => {
                  setBsMode('array');
                  setBsArrText('2, 5, 8, 12, 16, 23, 38, 56, 72, 91');
                  setStepIdx(0);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                  bsMode === 'array' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Chặt Mảng lower_bound
              </button>
            </div>
            <label className="flex items-center gap-1.5 text-xs flex-1 min-w-[180px]">
              <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">Mảng:</span>
              <input
                type="text"
                value={bsArrText}
                onChange={(e) => {
                  setBsArrText(e.target.value);
                  setStepIdx(0);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
              />
            </label>
            {bsMode === 'array' ? (
              <label className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Target:</span>
                <input
                  type="number"
                  value={bsTarget}
                  onChange={(e) => {
                    setBsTarget(Number(e.target.value));
                    setStepIdx(0);
                  }}
                  className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs tabular-nums"
                />
              </label>
            ) : (
              <label className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Số đoạn K:</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={bsKParts}
                  onChange={(e) => {
                    setBsKParts(Math.max(1, Number(e.target.value)));
                    setStepIdx(0);
                  }}
                  className="w-14 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs tabular-nums"
                />
              </label>
            )}
          </div>
        );

      case 'matrix_grid':
        return (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              {(
                [
                  { id: 'bfs', label: 'BFS Mê Cung' },
                  { id: 'dijkstra', label: 'Dijkstra Có Trọng Số' },
                  { id: 'prefix2d', label: 'Cộng Dồn 2D (Bù-Trừ)' }
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setGridMode(m.id);
                    setStepIdx(0);
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    gridMode === m.id ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {gridMode !== 'prefix2d' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setGridWalls(INITIAL_WALLS);
                      setStepIdx(0);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-medium"
                  >
                    Mê cung mẫu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGridWalls(Array.from({ length: 5 }, () => Array(7).fill(false)));
                      setStepIdx(0);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-medium"
                  >
                    Xóa hết tường
                  </button>
                </>
              )}
              {(gridMode === 'dijkstra' || gridMode === 'prefix2d') && (
                <button
                  type="button"
                  onClick={() => {
                    setGridWeights(
                      Array.from({ length: 5 }, () =>
                        Array.from({ length: 7 }, () => Math.floor(Math.random() * 9) + 1)
                      )
                    );
                    setStepIdx(0);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-medium"
                >
                  Ngẫu nhiên trọng số
                </button>
              )}
            </div>
          </div>
        );

      case 'dp_knapsack':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs flex-1 min-w-[200px]">
              <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                Đồ vật (w:v):
              </span>
              <input
                type="text"
                value={knapText}
                onChange={(e) => {
                  setKnapText(e.target.value);
                  setStepIdx(0);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Sức chứa W:</span>
              <input
                type="number"
                min={2}
                max={12}
                value={knapW}
                onChange={(e) => {
                  setKnapW(Math.max(2, Math.min(12, Number(e.target.value))));
                  setStepIdx(0);
                }}
                className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs tabular-nums"
              />
            </label>
          </div>
        );

      case 'dp_lis':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs flex-1">
              <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">Dãy số a[]:</span>
              <input
                type="text"
                value={lisArrText}
                onChange={(e) => {
                  setLisArrText(e.target.value);
                  setStepIdx(0);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setLisArrText('10, 9, 2, 5, 3, 7, 101, 18');
                setStepIdx(0);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-medium"
            >
              Mẫu LeetCode 300
            </button>
          </div>
        );

      case 'dp_lcs':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Xâu A:</span>
              <input
                type="text"
                value={lcsA}
                onChange={(e) => {
                  setLcsA(e.target.value.toUpperCase());
                  setStepIdx(0);
                }}
                className="w-32 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Xâu B:</span>
              <input
                type="text"
                value={lcsB}
                onChange={(e) => {
                  setLcsB(e.target.value.toUpperCase());
                  setStepIdx(0);
                }}
                className="w-32 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
              />
            </label>
          </div>
        );

      case 'graph_algo':
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                {(
                  [
                    { id: 'dijkstra', label: 'Dijkstra' },
                    { id: 'bfs', label: 'BFS' },
                    { id: 'dfs', label: 'DFS' },
                    { id: 'kruskal', label: 'Kruskal MST' }
                  ] as const
                ).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setGraphSubAlgo(g.id);
                      setStepIdx(0);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      graphSubAlgo === g.id ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              {graphSubAlgo !== 'kruskal' && (
                <>
                  <label className="flex items-center gap-1 text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Từ S:</span>
                    <select
                      value={graphStart}
                      onChange={(e) => {
                        setGraphStart(e.target.value);
                        setStepIdx(0);
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
                    >
                      {parsedGraph.nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.id}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-1 text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Đến T:</span>
                    <select
                      value={graphTarget}
                      onChange={(e) => {
                        setGraphTarget(e.target.value);
                        setStepIdx(0);
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
                    >
                      {parsedGraph.nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.id}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={graphDirected}
                      onChange={(e) => {
                        setGraphDirected(e.target.checked);
                        setStepIdx(0);
                      }}
                      className="rounded border-slate-300"
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Có hướng</span>
                  </label>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setGraphNodes(DEFAULT_GRAPH_NODES);
                  setGraphEdgeText(DEFAULT_GRAPH_EDGES.map((e) => `${e.u} ${e.v} ${e.w}`).join('\n'));
                  setGraphStart('A');
                  setGraphTarget('F');
                  setStepIdx(0);
                }}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-medium"
              >
                Mẫu 6 đỉnh
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                Cạnh (u v w):
              </span>
              <textarea
                rows={2}
                value={graphEdgeText}
                onChange={(e) => setGraphEdgeText(e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
              />
            </div>
          </div>
        );

      case 'tree_segtree':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSegOp('query');
                  setStepIdx(0);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                  segOp === 'query' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Truy vấn đoạn [L, R]
              </button>
              <button
                type="button"
                onClick={() => {
                  setSegOp('update');
                  setStepIdx(0);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                  segOp === 'update' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Cập nhật điểm a[idx]
              </button>
            </div>
            <label className="flex items-center gap-1.5 text-xs flex-1 min-w-[160px]">
              <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">Mảng:</span>
              <input
                type="text"
                value={segArrText}
                onChange={(e) => {
                  setSegArrText(e.target.value);
                  setStepIdx(0);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs"
              />
            </label>
            {segOp === 'query' ? (
              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1">
                  <span>L:</span>
                  <input
                    type="number"
                    min={0}
                    max={7}
                    value={segQL}
                    onChange={(e) => setSegQL(Number(e.target.value))}
                    className="w-12 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono tabular-nums"
                  />
                </label>
                <label className="flex items-center gap-1">
                  <span>R:</span>
                  <input
                    type="number"
                    min={0}
                    max={7}
                    value={segQR}
                    onChange={(e) => setSegQR(Number(e.target.value))}
                    className="w-12 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono tabular-nums"
                  />
                </label>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1">
                  <span>idx:</span>
                  <input
                    type="number"
                    min={0}
                    max={7}
                    value={segUpdIdx}
                    onChange={(e) => setSegUpdIdx(Number(e.target.value))}
                    className="w-12 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono tabular-nums"
                  />
                </label>
                <label className="flex items-center gap-1">
                  <span>val:</span>
                  <input
                    type="number"
                    value={segUpdVal}
                    onChange={(e) => setSegUpdVal(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono tabular-nums"
                  />
                </label>
              </div>
            )}
          </div>
        );

      case 'backtrack_nqueens':
        return (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Kích thước bàn cờ N×N:
            </span>
            {[4, 5, 6, 7].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setQueensN(n);
                  setStepIdx(0);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono tabular-nums ${
                  queensN === n
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {n}×{n}
              </button>
            ))}
          </div>
        );

      case 'number_sieve':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => {
                  setNumMode('sieve');
                  setStepIdx(0);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                  numMode === 'sieve' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Sàng Eratosthenes
              </button>
              <button
                type="button"
                onClick={() => {
                  setNumMode('binpow');
                  setStepIdx(0);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                  numMode === 'binpow' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Lũy Thừa Nhị Phân
              </button>
            </div>
            {numMode === 'sieve' ? (
              <label className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Giới hạn N:</span>
                <input
                  type="range"
                  min={15}
                  max={60}
                  value={sieveN}
                  onChange={(e) => {
                    setSieveN(Number(e.target.value));
                    setStepIdx(0);
                  }}
                />
                <span className="font-mono font-bold tabular-nums w-6">{sieveN}</span>
              </label>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1">
                  <span>a:</span>
                  <input
                    type="number"
                    value={powA}
                    onChange={(e) => setPowA(Number(e.target.value))}
                    className="w-14 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono tabular-nums"
                  />
                </label>
                <label className="flex items-center gap-1">
                  <span>b:</span>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={powB}
                    onChange={(e) => setPowB(Number(e.target.value))}
                    className="w-14 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono tabular-nums"
                  />
                </label>
                <label className="flex items-center gap-1">
                  <span>mod:</span>
                  <input
                    type="number"
                    min={2}
                    value={powM}
                    onChange={(e) => setPowM(Math.max(2, Number(e.target.value)))}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono tabular-nums"
                  />
                </label>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // -------------------------------------------------------------------
  // Main Visual Stage Dispatcher
  // -------------------------------------------------------------------
  const renderVisualStage = () => {
    if (algoId === 'coord_hull' || algoId === 'coord_sweep') {
      return (
        <CoordinateGeoCanvas
          algoId={algoId}
          step={currentStep}
          onAddPoint={algoId === 'coord_hull' ? handleAddHullPoint : undefined}
        />
      );
    }
    if (
      algoId === 'string_kmp' ||
      algoId === 'string_palindrome' ||
      algoId === 'array_prefix_kadane' ||
      algoId === 'array_two_pointers' ||
      algoId === 'array_sort_stack' ||
      algoId === 'binary_search' ||
      algoId === 'number_sieve' ||
      algoId === 'tree_segtree'
    ) {
      return <ArrayStringVisualizer algoId={algoId} step={currentStep} />;
    }
    if (
      algoId === 'matrix_grid' ||
      algoId === 'dp_knapsack' ||
      algoId === 'dp_lis' ||
      algoId === 'dp_lcs' ||
      algoId === 'backtrack_nqueens'
    ) {
      return (
        <MatrixDpVisualizer
          algoId={algoId}
          step={currentStep}
          onToggleWall={gridMode !== 'prefix2d' ? handleToggleGridWall : undefined}
          onSelectRectCell={gridMode === 'prefix2d' ? handleSelectGridRectCell : undefined}
        />
      );
    }
    if (algoId === 'graph_algo') {
      return (
        <GraphAlgoCanvas
          step={currentStep}
          directed={graphSubAlgo === 'kruskal' ? false : graphDirected}
          startId={graphStart}
          targetId={graphTarget}
          onMoveNode={handleMoveGraphNode}
        />
      );
    }
    return null;
  };

  const mainShell = (
    <div
      className={`space-y-4 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 overflow-y-auto'
          : ''
      }`}
    >
      {/* Top Bar: Selector & Categories */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {onBack && !isFullscreen && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại</span>
              </button>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {currentMeta.shortTag}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {currentMeta.complexity}
                </span>
                {embeddedLessonTitle && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="truncate max-w-[260px]">{embeddedLessonTitle}</span>
                  </>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                {currentMeta.titleVi}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={algoId}
              onChange={(e) => handleSelectAlgo(e.target.value as AlgoId)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[270px]"
            >
              {visibleAlgos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.titleVi}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsFullscreen((f) => !f)}
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Category Filter Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategory(cat.id);
                if (cat.id !== 'all') {
                  const first = ALGO_CATALOG.find((a) => a.category === cat.id);
                  if (first && ALGO_CATALOG.find((a) => a.id === algoId)?.category !== cat.id) {
                    handleSelectAlgo(first.id);
                  }
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Algorithm Quick Buttons inside selected category */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          {visibleAlgos.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectAlgo(item.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                algoId === item.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                  : 'bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 text-slate-600 dark:text-slate-300 hover:border-blue-400'
              }`}
            >
              {item.titleVi.replace(/^.*?: /, '')}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Zone Sandbox Layout: 65% Stage + 35% Trace Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT ZONE: Interactive Input Bar + Visual Stage + Playback Transport */}
        <div className="lg:col-span-8 space-y-4">
          {/* Custom Inputs & Presets */}
          <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Dữ Liệu Đầu Vào &amp; Tùy Chỉnh Trực Tiếp</span>
            </div>
            {renderInputControls()}
          </div>

          {/* Primary Visual Stage */}
          <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            {renderVisualStage()}
          </div>

          {/* Playback Scrubber Bar */}
          <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIdx(0);
                  }}
                  title="Về bước đầu"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <ChevronFirst className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIdx((p) => Math.max(0, p - 1));
                  }}
                  disabled={stepIdx <= 0}
                  title="Lùi 1 bước"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (stepIdx >= steps.length - 1) setStepIdx(0);
                    setIsPlaying((p) => !p);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Tạm dừng' : stepIdx >= steps.length - 1 ? 'Chạy lại' : 'Chạy tự động'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIdx((p) => Math.min(steps.length - 1, p + 1));
                  }}
                  disabled={stepIdx >= steps.length - 1}
                  title="Tiến 1 bước"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIdx(Math.max(0, steps.length - 1));
                  }}
                  title="Tới bước cuối"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <ChevronLast className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIdx(0);
                  }}
                  title="Đặt lại"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speed & Step Counter */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                  {[0.5, 1, 2, 4].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setSpeed(spd)}
                      className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold tabular-nums ${
                        speed === spd
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                  Bước {Math.min(stepIdx + 1, Math.max(1, steps.length))} / {Math.max(1, steps.length)}
                </span>
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={Math.max(0, steps.length - 1)}
              value={Math.min(stepIdx, Math.max(0, steps.length - 1))}
              onChange={(e) => {
                setIsPlaying(false);
                setStepIdx(Number(e.target.value));
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* RIGHT ZONE: Step Explanation, Formula, Watch Table, Pseudocode */}
        <div className="lg:col-span-4 space-y-4">
          {/* Step Explanation */}
          <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className={`font-bold ${statusLabel.cls}`}>{statusLabel.text}</span>
              <span className="text-slate-400 tabular-nums">#{currentStep.stepIndex + 1}</span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
              {currentStep.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentStep.description}
            </p>
            {currentStep.formula && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-sky-700 dark:text-sky-300 break-words">
                {currentStep.formula}
              </div>
            )}
          </div>

          {/* Variable Watch Table */}
          <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2.5">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
              Trạng Thái Biến (Variable Watch)
            </div>
            {currentStep.variables && currentStep.variables.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs tabular-nums">
                {currentStep.variables.map((v, idx) => (
                  <div key={idx} className="py-1.5 flex items-start justify-between gap-3">
                    <span className="text-slate-500 dark:text-slate-400 shrink-0">{v.name}</span>
                    <span
                      className={`text-right font-bold break-all ${
                        v.highlight === 'success'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : v.highlight === 'warn'
                          ? 'text-rose-600 dark:text-rose-400'
                          : v.highlight === 'active'
                          ? 'text-amber-600 dark:text-amber-400'
                          : v.highlight === 'info'
                          ? 'text-sky-600 dark:text-sky-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {v.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">Chưa có biến theo dõi.</div>
            )}
          </div>

          {/* Pseudocode Trace */}
          <div className="bg-slate-950 text-slate-200 rounded-2xl p-4 border border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="font-bold text-slate-200">Mã Giả Thuật Toán</span>
              <span>{currentMeta.complexity}</span>
            </div>
            <div className="space-y-0.5 font-mono text-[11px] leading-relaxed overflow-x-auto">
              {currentMeta.pseudocode.map((line, lIdx) => {
                const isActive = currentStep.activeCodeLine === lIdx;
                return (
                  <div
                    key={lIdx}
                    className={`px-2 py-0.5 rounded flex items-start gap-2 whitespace-pre ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 font-bold'
                        : 'text-slate-300/90'
                    }`}
                  >
                    <span className="text-slate-500 select-none w-4 shrink-0 text-right tabular-nums">
                      {lIdx + 1}
                    </span>
                    <span>{line}</span>
                  </div>
                );
              })}
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              {currentMeta.summaryVi}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return <ViewportPortal active={isFullscreen}>{mainShell}</ViewportPortal>;
};
