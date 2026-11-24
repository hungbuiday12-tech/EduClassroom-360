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
import { ALGO_THEME_PALETTE, AlgoThumbPreview } from './visualizer/AlgoThumbPreview';
import { CsStepAiTutorPanel } from './CsStepAiTutorPanel';
import {
  ArrowLeft,
  ArrowRight,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Cpu,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Terminal
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [algoId, setAlgoId] = useState<AlgoId>(initialAlgoId);
  const [vizViewMode, setVizViewMode] = useState<'gallery' | 'stage'>(() =>
    embeddedLessonTitle ? 'stage' : 'gallery'
  );
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync if prop changes from lesson navigation
  useEffect(() => {
    setAlgoId(initialAlgoId);
    setStepIdx(0);
    setIsPlaying(false);
    if (embeddedLessonTitle) {
      setVizViewMode('stage');
    }
  }, [initialAlgoId, embeddedLessonTitle]);

  useEffect(() => {
    const onVizReset = () => {
      if (!embeddedLessonTitle) {
        setIsFullscreen(false);
        setVizViewMode('gallery');
      }
    };
    window.addEventListener('educlassroom:cs-viz-reset', onVizReset);
    return () => window.removeEventListener('educlassroom:cs-viz-reset', onVizReset);
  }, [embeddedLessonTitle]);

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
    const kw = searchQuery.trim().toLowerCase();
    return ALGO_CATALOG.filter((a) => {
      if (category !== 'all' && a.category !== category) return false;
      if (kw) {
        const hay = `${a.titleVi} ${a.titleEn} ${a.shortTag} ${a.complexity} ${a.summaryVi}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [category, searchQuery]);

  const currentStep: VizStep = steps[Math.min(stepIdx, Math.max(0, steps.length - 1))] || {
    stepIndex: 0,
    title: 'Sẵn sàng',
    description: 'Nhấn Play hoặc Bước tiếp để quan sát mô phỏng.',
    variables: [],
    state: {}
  };

  const handleSelectAlgo = (nextId: AlgoId, enterStage = true) => {
    setAlgoId(nextId);
    setStepIdx(0);
    setIsPlaying(false);
    if (enterStage) {
      setVizViewMode('stage');
    }
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

  // Status label (dual-coded text, dark cyber HUD contrast)
  const statusLabel = (() => {
    switch (currentStep.statusTag) {
      case 'init':
        return { text: 'KHỞI TẠO', cls: 'text-slate-300' };
      case 'compare':
        return { text: 'SO SÁNH / KIỂM TRA', cls: 'text-cyan-300' };
      case 'update':
        return { text: 'CẬP NHẬT TRẠNG THÁI', cls: 'text-amber-300' };
      case 'discard':
        return { text: 'LOẠI BỎ NHÁNH', cls: 'text-rose-400' };
      case 'backtrack':
        return { text: 'QUAY LUI (BACKTRACK)', cls: 'text-orange-400' };
      case 'done':
        return { text: 'HOÀN TẤT KẾT QUẢ', cls: 'text-emerald-400' };
      default:
        return { text: 'THỰC THI', cls: 'text-slate-300' };
    }
  })();

  // -------------------------------------------------------------------
  // Parameter Controls Strip tailored to active AlgoId (Cyber HUD Style)
  // -------------------------------------------------------------------
  const cyberInputCls =
    'px-2.5 py-1.5 rounded-lg border border-cyan-500/30 bg-[#020710] text-xs font-mono text-emerald-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none';
  const cyberBtnCls =
    'px-2.5 py-1.5 rounded-lg border border-cyan-500/25 bg-[#081529] text-xs font-medium text-cyan-200 hover:border-emerald-400/60 hover:text-white transition-colors cursor-pointer';
  const cyberSegWrapCls = 'flex items-center gap-1 p-1 rounded-lg bg-[#020710] border border-cyan-500/20';
  const cyberSegBtnCls = (active: boolean) =>
    `px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
      active
        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
        : 'text-slate-300 hover:text-white'
    }`;

  const renderInputControls = () => {
    switch (algoId) {
      case 'coord_hull':
        return (
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-semibold text-cyan-200/85 shrink-0">
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
              className={`flex-1 min-w-[210px] ${cyberInputCls}`}
            />
            <button
              type="button"
              onClick={() => {
                setHullPoints(DEFAULT_HULL_POINTS);
                setHullText(DEFAULT_HULL_POINTS.map((p) => `${p.x},${p.y}`).join('; '));
                setStepIdx(0);
              }}
              className={cyberBtnCls}
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
              className={cyberBtnCls}
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
              className="px-2.5 py-1.5 rounded-lg border border-rose-500/35 bg-rose-950/30 text-xs font-medium text-rose-300 hover:bg-rose-900/40 cursor-pointer"
            >
              Xóa điểm cuối
            </button>
          </div>
        );

      case 'coord_sweep':
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-cyan-200/85">
                Mỗi dòng 1 đoạn thẳng (x1, y1, x2, y2):
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSegText(DEFAULT_SEGMENTS.map((s) => `${s.x1},${s.y1},${s.x2},${s.y2}`).join('\n'));
                    setStepIdx(0);
                  }}
                  className={cyberBtnCls}
                >
                  Mẫu cắt chữ X
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSegText('1,2,8,2\n2,6,9,1\n3,1,6,7\n5,4,10,6');
                    setStepIdx(0);
                  }}
                  className={cyberBtnCls}
                >
                  Nhiều giao điểm
                </button>
              </div>
            </div>
            <textarea
              rows={2}
              value={segText}
              onChange={(e) => setSegText(e.target.value)}
              className={`w-full ${cyberInputCls}`}
            />
          </div>
        );

      case 'string_kmp':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-cyan-200/85">Văn bản T:</span>
              <input
                type="text"
                value={kmpText}
                onChange={(e) => {
                  setKmpText(e.target.value.toUpperCase());
                  setStepIdx(0);
                }}
                className={`w-48 ${cyberInputCls}`}
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-cyan-200/85">Mẫu P:</span>
              <input
                type="text"
                value={kmpPattern}
                onChange={(e) => {
                  setKmpPattern(e.target.value.toUpperCase());
                  setStepIdx(0);
                }}
                className={`w-36 ${cyberInputCls}`}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setKmpText('ABABABABAC');
                setKmpPattern('ABABAC');
                setStepIdx(0);
              }}
              className={cyberBtnCls}
            >
              Mẫu lặp tiền tố
            </button>
          </div>
        );

      case 'string_palindrome':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-cyan-200/85">Xâu S:</span>
              <input
                type="text"
                value={palStr}
                onChange={(e) => {
                  setPalStr(e.target.value.toUpperCase());
                  setStepIdx(0);
                }}
                className={`w-48 ${cyberInputCls}`}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setPalStr('ABBAACAA');
                setStepIdx(0);
              }}
              className={cyberBtnCls}
            >
              Mẫu tâm chẵn ABBA
            </button>
          </div>
        );

      case 'array_prefix_kadane':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs flex-1 min-w-[200px]">
              <span className="font-semibold text-cyan-200/85 shrink-0">Mảng a[]:</span>
              <input
                type="text"
                value={prefixArrText}
                onChange={(e) => {
                  setPrefixArrText(e.target.value);
                  setStepIdx(0);
                }}
                className={`w-full ${cyberInputCls}`}
              />
            </label>
            <label className="flex items-center gap-1 text-xs">
              <span className="font-semibold text-cyan-200/85">L:</span>
              <input
                type="number"
                min={0}
                max={15}
                value={queryL}
                onChange={(e) => setQueryL(Number(e.target.value))}
                className={`w-14 tabular-nums ${cyberInputCls}`}
              />
            </label>
            <label className="flex items-center gap-1 text-xs">
              <span className="font-semibold text-cyan-200/85">R:</span>
              <input
                type="number"
                min={0}
                max={15}
                value={queryR}
                onChange={(e) => setQueryR(Number(e.target.value))}
                className={`w-14 tabular-nums ${cyberInputCls}`}
              />
            </label>
          </div>
        );

      case 'array_two_pointers':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs flex-1 min-w-[200px]">
              <span className="font-semibold text-cyan-200/85 shrink-0">Mảng a[]:</span>
              <input
                type="text"
                value={tpArrText}
                onChange={(e) => {
                  setTpArrText(e.target.value);
                  setStepIdx(0);
                }}
                className={`w-full ${cyberInputCls}`}
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-cyan-200/85">Tổng tối đa S:</span>
              <input
                type="number"
                min={1}
                max={100}
                value={tpTargetS}
                onChange={(e) => {
                  setTpTargetS(Math.max(1, Number(e.target.value)));
                  setStepIdx(0);
                }}
                className={`w-16 tabular-nums ${cyberInputCls}`}
              />
            </label>
          </div>
        );

      case 'array_sort_stack':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <div className={cyberSegWrapCls}>
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
                  className={cyberSegBtnCls(sortMode === m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-1.5 text-xs flex-1 min-w-[180px]">
              <span className="font-semibold text-cyan-200/85 shrink-0">Mảng:</span>
              <input
                type="text"
                value={sortArrText}
                onChange={(e) => {
                  setSortArrText(e.target.value);
                  setStepIdx(0);
                }}
                className={`w-full ${cyberInputCls}`}
              />
            </label>
          </div>
        );

      case 'binary_search':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <div className={cyberSegWrapCls}>
              <button
                type="button"
                onClick={() => {
                  setBsMode('answer');
                  setBsArrText('7, 2, 5, 10, 8, 4, 6');
                  setStepIdx(0);
                }}
                className={cyberSegBtnCls(bsMode === 'answer')}
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
                className={cyberSegBtnCls(bsMode === 'array')}
              >
                Chặt Mảng lower_bound
              </button>
            </div>
            <label className="flex items-center gap-1.5 text-xs flex-1 min-w-[180px]">
              <span className="font-semibold text-cyan-200/85 shrink-0">Mảng:</span>
              <input
                type="text"
                value={bsArrText}
                onChange={(e) => {
                  setBsArrText(e.target.value);
                  setStepIdx(0);
                }}
                className={`w-full ${cyberInputCls}`}
              />
            </label>
            {bsMode === 'array' ? (
              <label className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-cyan-200/85">Target:</span>
                <input
                  type="number"
                  value={bsTarget}
                  onChange={(e) => {
                    setBsTarget(Number(e.target.value));
                    setStepIdx(0);
                  }}
                  className={`w-16 tabular-nums ${cyberInputCls}`}
                />
              </label>
            ) : (
              <label className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-cyan-200/85">Số đoạn K:</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={bsKParts}
                  onChange={(e) => {
                    setBsKParts(Math.max(1, Number(e.target.value)));
                    setStepIdx(0);
                  }}
                  className={`w-14 tabular-nums ${cyberInputCls}`}
                />
              </label>
            )}
          </div>
        );

      case 'matrix_grid':
        return (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className={cyberSegWrapCls}>
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
                  className={cyberSegBtnCls(gridMode === m.id)}
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
                    className={cyberBtnCls}
                  >
                    Mê cung mẫu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGridWalls(Array.from({ length: 5 }, () => Array(7).fill(false)));
                      setStepIdx(0);
                    }}
                    className={cyberBtnCls}
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
                  className={cyberBtnCls}
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
              <span className="font-semibold text-cyan-200/85 shrink-0">
                Đồ vật (w:v):
              </span>
              <input
                type="text"
                value={knapText}
                onChange={(e) => {
                  setKnapText(e.target.value);
                  setStepIdx(0);
                }}
                className={`w-full ${cyberInputCls}`}
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-cyan-200/85">Sức chứa W:</span>
              <input
                type="number"
                min={2}
                max={12}
                value={knapW}
                onChange={(e) => {
                  setKnapW(Math.max(2, Math.min(12, Number(e.target.value))));
                  setStepIdx(0);
                }}
                className={`w-16 tabular-nums ${cyberInputCls}`}
              />
            </label>
          </div>
        );

      case 'dp_lis':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs flex-1">
              <span className="font-semibold text-cyan-200/85 shrink-0">Dãy số a[]:</span>
              <input
                type="text"
                value={lisArrText}
                onChange={(e) => {
                  setLisArrText(e.target.value);
                  setStepIdx(0);
                }}
                className={`w-full ${cyberInputCls}`}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setLisArrText('10, 9, 2, 5, 3, 7, 101, 18');
                setStepIdx(0);
              }}
              className={cyberBtnCls}
            >
              Mẫu LeetCode 300
            </button>
          </div>
        );

      case 'dp_lcs':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-cyan-200/85">Xâu A:</span>
              <input
                type="text"
                value={lcsA}
                onChange={(e) => {
                  setLcsA(e.target.value.toUpperCase());
                  setStepIdx(0);
                }}
                className={`w-32 ${cyberInputCls}`}
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-cyan-200/85">Xâu B:</span>
              <input
                type="text"
                value={lcsB}
                onChange={(e) => {
                  setLcsB(e.target.value.toUpperCase());
                  setStepIdx(0);
                }}
                className={`w-32 ${cyberInputCls}`}
              />
            </label>
          </div>
        );

      case 'graph_algo':
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className={cyberSegWrapCls}>
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
                    className={cyberSegBtnCls(graphSubAlgo === g.id)}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              {graphSubAlgo !== 'kruskal' && (
                <>
                  <label className="flex items-center gap-1 text-xs">
                    <span className="font-semibold text-cyan-200/85">Từ S:</span>
                    <select
                      value={graphStart}
                      onChange={(e) => {
                        setGraphStart(e.target.value);
                        setStepIdx(0);
                      }}
                      className={cyberInputCls}
                    >
                      {parsedGraph.nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.id}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-1 text-xs">
                    <span className="font-semibold text-cyan-200/85">Đến T:</span>
                    <select
                      value={graphTarget}
                      onChange={(e) => {
                        setGraphTarget(e.target.value);
                        setStepIdx(0);
                      }}
                      className={cyberInputCls}
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
                      className="rounded border-cyan-500/40 bg-[#020710] accent-emerald-400"
                    />
                    <span className="font-medium text-cyan-100">Có hướng</span>
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
                className={cyberBtnCls}
              >
                Mẫu 6 đỉnh
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs font-semibold text-cyan-200/85 shrink-0">
                Cạnh (u v w):
              </span>
              <textarea
                rows={2}
                value={graphEdgeText}
                onChange={(e) => setGraphEdgeText(e.target.value)}
                className={`flex-1 ${cyberInputCls}`}
              />
            </div>
          </div>
        );

      case 'tree_segtree':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <div className={cyberSegWrapCls}>
              <button
                type="button"
                onClick={() => {
                  setSegOp('query');
                  setStepIdx(0);
                }}
                className={cyberSegBtnCls(segOp === 'query')}
              >
                Truy vấn đoạn [L, R]
              </button>
              <button
                type="button"
                onClick={() => {
                  setSegOp('update');
                  setStepIdx(0);
                }}
                className={cyberSegBtnCls(segOp === 'update')}
              >
                Cập nhật điểm a[idx]
              </button>
            </div>
            <label className="flex items-center gap-1.5 text-xs flex-1 min-w-[160px]">
              <span className="font-semibold text-cyan-200/85 shrink-0">Mảng:</span>
              <input
                type="text"
                value={segArrText}
                onChange={(e) => {
                  setSegArrText(e.target.value);
                  setStepIdx(0);
                }}
                className={`w-full ${cyberInputCls}`}
              />
            </label>
            {segOp === 'query' ? (
              <div className="flex items-center gap-2 text-xs text-cyan-200/85">
                <label className="flex items-center gap-1">
                  <span>L:</span>
                  <input
                    type="number"
                    min={0}
                    max={7}
                    value={segQL}
                    onChange={(e) => setSegQL(Number(e.target.value))}
                    className={`w-12 tabular-nums ${cyberInputCls}`}
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
                    className={`w-12 tabular-nums ${cyberInputCls}`}
                  />
                </label>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-cyan-200/85">
                <label className="flex items-center gap-1">
                  <span>idx:</span>
                  <input
                    type="number"
                    min={0}
                    max={7}
                    value={segUpdIdx}
                    onChange={(e) => setSegUpdIdx(Number(e.target.value))}
                    className={`w-12 tabular-nums ${cyberInputCls}`}
                  />
                </label>
                <label className="flex items-center gap-1">
                  <span>val:</span>
                  <input
                    type="number"
                    value={segUpdVal}
                    onChange={(e) => setSegUpdVal(Number(e.target.value))}
                    className={`w-16 tabular-nums ${cyberInputCls}`}
                  />
                </label>
              </div>
            )}
          </div>
        );

      case 'backtrack_nqueens':
        return (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-cyan-200/85">
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
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono tabular-nums cursor-pointer transition-colors ${
                  queensN === n
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950'
                    : 'bg-[#081529] border border-cyan-500/25 text-cyan-200 hover:border-emerald-400/60'
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
            <div className={cyberSegWrapCls}>
              <button
                type="button"
                onClick={() => {
                  setNumMode('sieve');
                  setStepIdx(0);
                }}
                className={cyberSegBtnCls(numMode === 'sieve')}
              >
                Sàng Eratosthenes
              </button>
              <button
                type="button"
                onClick={() => {
                  setNumMode('binpow');
                  setStepIdx(0);
                }}
                className={cyberSegBtnCls(numMode === 'binpow')}
              >
                Lũy Thừa Nhị Phân
              </button>
            </div>
            {numMode === 'sieve' ? (
              <label className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-cyan-200/85">Giới hạn N:</span>
                <input
                  type="range"
                  min={15}
                  max={60}
                  value={sieveN}
                  onChange={(e) => {
                    setSieveN(Number(e.target.value));
                    setStepIdx(0);
                  }}
                  className="accent-emerald-400 cursor-pointer"
                />
                <span className="font-mono font-bold tabular-nums w-6 text-emerald-300">{sieveN}</span>
              </label>
            ) : (
              <div className="flex items-center gap-2 text-xs text-cyan-200/85">
                <label className="flex items-center gap-1">
                  <span>a:</span>
                  <input
                    type="number"
                    value={powA}
                    onChange={(e) => setPowA(Number(e.target.value))}
                    className={`w-14 tabular-nums ${cyberInputCls}`}
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
                    className={`w-14 tabular-nums ${cyberInputCls}`}
                  />
                </label>
                <label className="flex items-center gap-1">
                  <span>mod:</span>
                  <input
                    type="number"
                    min={2}
                    value={powM}
                    onChange={(e) => setPowM(Math.max(2, Number(e.target.value)))}
                    className={`w-16 tabular-nums ${cyberInputCls}`}
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

  // =========================================================================
  // VIEW 1: 16 INFORMATICS ALGORITHM FRAMES GALLERY (CYBER MATRIX EDITION)
  // =========================================================================
  if (vizViewMode === 'gallery' && !isFullscreen) {
    return (
      <div className="space-y-6 pb-8">
        {/* Informatics Command Header Banner */}
        <section className="relative overflow-hidden rounded-xl sci-frame sci-blueprint-bg border border-emerald-400/35 bg-gradient-to-br from-[#030b17] via-[#061326] to-[#0a192f] text-white p-6 sm:p-8 shadow-[0_24px_80px_-20px_rgba(16,185,129,0.36)]">
          {/* Matrix Grid + Laser Sweep */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                'radial-gradient(circle at 12% 20%, rgba(16,185,129,0.28) 0%, transparent 45%), radial-gradient(circle at 88% 75%, rgba(6,182,212,0.25) 0%, transparent 48%), linear-gradient(to right, rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.1) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 100% 100%, 26px 26px, 26px 26px'
            }}
          />
          <div
            aria-hidden="true"
            className="holo-scan-beam pointer-events-none absolute inset-x-0 h-16 opacity-40"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.22) 50%, transparent 100%)'
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-emerald-500/25 border border-white/20 hover:border-emerald-400/60 text-xs font-bold text-slate-100 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Quay lại</span>
                  </button>
                )}
                <span className="inline-flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-emerald-300">
                  <Terminal className="w-4 h-4 text-emerald-400 icon-anim-code" />
                  INFORMATICS LAB · {ALGO_CATALOG.length} MODULE THUẬT TOÁN
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {ALGO_CATALOG.length} Khung Mô Phỏng Thuật Toán &amp; Cấu Trúc Dữ Liệu
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Chọn một khung thuật toán bên dưới để chạy từng bước thực thi, theo dõi biến trực tiếp, chỉnh sửa dữ liệu đầu vào và đối chiếu mã giả chuẩn thi VNOI / HSG Quốc gia.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <button
                type="button"
                data-ripple="true"
                onClick={() => handleSelectAlgo(algoId, true)}
                className="group cs-deck-btn px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-slate-950 font-extrabold text-sm shadow-[0_12px_28px_-6px_rgba(16,185,129,0.55)] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Cpu className="w-4 h-4 icon-anim-code" />
                <span>Mở Phòng Mô Phỏng Đang Chọn</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-[11px] font-mono text-emerald-300/85 tabular-nums">
                +15 XP khi hoàn thành mô phỏng mỗi thuật toán
              </span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="relative z-10 mt-6 pt-5 border-t border-emerald-400/20 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap items-center gap-2 scrollbar-none pb-1 sm:pb-0 max-w-full">
              {CATEGORY_TABS.map((cat) => {
                const selected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`group cs-deck-btn min-h-[38px] px-3.5 py-2 rounded-md text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer border transition-all ${
                      selected
                        ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 border-emerald-200 shadow-[0_8px_20px_-4px_rgba(16,185,129,0.55)]'
                        : 'bg-slate-900/75 text-slate-200 border-emerald-500/25 hover:bg-emerald-950/60 hover:text-white hover:border-emerald-400/60'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm KMP, Dijkstra, DP, O(N log N)..."
                className="w-full pl-10 pr-4 py-2 rounded-md bg-slate-950/80 border border-emerald-400/30 focus:border-emerald-300 focus:outline-none text-xs text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </section>

        {/* 16 Animated Informatics Frames Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visibleAlgos.map((item, idx) => {
            const palette = ALGO_THEME_PALETTE[item.id];
            const cleanTitle = item.titleVi;
            const snippet = item.pseudocode.slice(0, 2);
            return (
              <div
                key={item.id}
                style={
                  {
                    '--algo-accent': palette.accent,
                    '--algo-secondary': palette.secondary
                  } as React.CSSProperties
                }
                className="algo-card-frame group shadow-[0_18px_45px_-16px_rgba(16,185,129,0.28)] hover:shadow-[0_24px_60px_-12px_rgba(6,182,212,0.52)]"
              >
                {/* Animated Cyber Circuit Conic Border Ring */}
                <div aria-hidden="true" className="algo-circuit-ring" />

                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => handleSelectAlgo(item.id, true)}
                  className="relative z-10 w-full h-full flex flex-col justify-between text-left rounded-[0.55rem] bg-gradient-to-br from-[#061121] via-[#071528] to-[#0a1a31] text-white overflow-hidden cursor-pointer"
                >
                  <div>
                    {/* Live Animated Informatics SVG Schematic */}
                    <AlgoThumbPreview
                      id={item.id}
                      accentHex={palette.accent}
                      secondaryHex={palette.secondary}
                      complexity={item.complexity}
                    />

                    {/* Card Content */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span className="font-bold text-emerald-300 tabular-nums">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-cyan-200/85 truncate">{item.shortTag}</span>
                      </div>

                      <h3 className="font-display text-base sm:text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                        {cleanTitle}
                      </h3>

                      <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-2">
                        {item.summaryVi}
                      </p>

                      {/* Mini Terminal Pseudocode Preview */}
                      <div className="mt-2 rounded-md bg-[#020710] border border-emerald-500/20 px-3 py-2 font-mono text-[10.5px] leading-relaxed text-emerald-300/85 overflow-hidden">
                        {snippet.map((line, lineIdx) => (
                          <div key={lineIdx} className="truncate">
                            <span className="text-slate-600 select-none mr-2">{lineIdx + 1}</span>
                            <span>{line}</span>
                            {lineIdx === snippet.length - 1 && (
                              <span className="algo-cursor-blink inline-block w-1.5 h-3 bg-emerald-400 ml-1 align-middle" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Launch Bar */}
                  <div className="px-5 py-3 border-t border-emerald-400/15 bg-gradient-to-r from-emerald-500/[0.06] to-cyan-500/[0.08] flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-[11px] text-slate-400">
                      Step Trace · Watch Variables
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-300 group-hover:text-white transition-colors shrink-0">
                      <span>Mở Mô Phỏng</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {visibleAlgos.length === 0 && (
          <div className="rounded-2xl border border-emerald-500/25 bg-[#061121] p-8 text-center text-slate-300 space-y-3">
            <p className="text-sm font-semibold">Không tìm thấy thuật toán nào khớp với "{searchQuery}".</p>
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-extrabold cursor-pointer"
            >
              Hiển thị tất cả {ALGO_CATALOG.length} khung thuật toán
            </button>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: INTERACTIVE STEP-BY-STEP ALGORITHM WORKBENCH STAGE (CYBER HUD)
  // =========================================================================
  const activePalette = ALGO_THEME_PALETTE[algoId];

  const mainShell = (
    <div
      style={
        {
          '--algo-accent': activePalette.accent,
          '--algo-secondary': activePalette.secondary
        } as React.CSSProperties
      }
      className={`space-y-4 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#020813] p-4 sm:p-6 overflow-y-auto'
          : ''
      }`}
    >
      {/* Sleek Cybernetic HUD Header Bar */}
      <div
        className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#040b18] via-[#061224] to-[#08172e] text-white border shadow-[0_18px_50px_-15px_rgba(6,182,212,0.35)]"
        style={{ borderColor: `${activePalette.accent}48` }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: `radial-gradient(circle at 12% 30%, ${activePalette.accent}33 0%, transparent 45%), linear-gradient(to right, rgba(56,189,248,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.08) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 24px 24px, 24px 24px'
          }}
        />
        <span className="pointer-events-none absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400/70 rounded-tl-xs" />
        <span className="pointer-events-none absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400/70 rounded-tr-xs" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {onBack && !isFullscreen && embeddedLessonTitle && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-slate-200 hover:bg-white/15 cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Bài giảng</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsFullscreen(false);
                setVizViewMode('gallery');
              }}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/45 text-emerald-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              <LayoutGrid className="w-3.5 h-3.5 icon-anim-list" />
              <span>{ALGO_CATALOG.length} Khung Thuật Toán</span>
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                <span className="font-extrabold tracking-wider" style={{ color: activePalette.accent }}>
                  {activePalette.codeTag}
                </span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="font-bold text-cyan-200/90">
                  {currentMeta.shortTag}
                </span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="text-emerald-300 font-semibold tabular-nums">
                  {currentMeta.complexity}
                </span>
                {embeddedLessonTitle && (
                  <>
                    <span className="text-slate-500" aria-hidden="true">·</span>
                    <span className="truncate max-w-[260px] text-slate-300">{embeddedLessonTitle}</span>
                  </>
                )}
              </div>
              <h2 className="font-display text-base sm:text-lg font-extrabold text-white mt-0.5">
                {currentMeta.titleVi}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={algoId}
              onChange={(e) => handleSelectAlgo(e.target.value as AlgoId, true)}
              className="px-3 py-1.5 rounded-xl border border-cyan-500/35 bg-[#020710] text-xs font-bold text-emerald-100 focus:border-emerald-400 focus:outline-none max-w-[260px] cursor-pointer"
            >
              {ALGO_CATALOG.map((a) => (
                <option key={a.id} value={a.id} className="bg-[#020710] text-emerald-100">
                  {a.titleVi}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsFullscreen((f) => !f)}
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
              className="p-2 rounded-xl border border-cyan-500/30 bg-[#081529] text-cyan-200 hover:border-emerald-400/60 hover:text-white cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Two-Zone Sandbox Layout: 65% Cyber Stage + 35% Terminal Trace Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT ZONE: Cyber Input Bar + Holographic Visual Stage + Playback Transport */}
        <div className="lg:col-span-8 space-y-4">
          {/* Custom Inputs & Presets */}
          <div className="rounded-2xl p-3.5 sm:p-4 bg-[#061121] border border-cyan-500/25 shadow-xs space-y-2.5 text-slate-200">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300/90">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>INPUT_STREAM · Dữ Liệu Đầu Vào &amp; Tùy Chỉnh Trực Tiếp</span>
            </div>
            {renderInputControls()}
          </div>

          {/* Primary Holographic Visual Stage */}
          <div
            className="relative overflow-hidden rounded-2xl p-4 sm:p-5 algo-stage-grid text-white border shadow-[0_22px_60px_-18px_rgba(6,182,212,0.38)]"
            style={{ borderColor: `${activePalette.accent}45` }}
          >
            {/* Sweeping Terminal Scan Beam */}
            <div
              aria-hidden="true"
              className="holo-scan-beam pointer-events-none absolute inset-x-0 h-14 opacity-30"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${activePalette.accent}26 50%, transparent 100%)`
              }}
            />

            {/* Binary / Hex Micro-stream along left edge matching Cyber HUD */}
            <div
              aria-hidden="true"
              className="algo-data-stream pointer-events-none absolute right-5 top-4 font-mono text-[9px] leading-3 text-emerald-400/40 select-none text-right hidden sm:block"
            >
              <div>0101</div>
              <div>1011</div>
              <div>0xAF</div>
              <div>1100</div>
            </div>

            {/* Crisp Corner HUD Reticles */}
            <span className="pointer-events-none absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400/75 rounded-tl-xs" />
            <span className="pointer-events-none absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400/75 rounded-tr-xs" />
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400/65 rounded-bl-xs" />
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400/65 rounded-br-xs" />

            <div className="relative z-10 overflow-x-auto max-w-full scrollbar-none">{renderVisualStage()}</div>

            <div className="relative z-10 mt-3 pt-2 border-t border-cyan-500/15 flex items-center justify-between font-mono text-[10px] text-slate-400">
              <span className="text-emerald-300/85 font-bold truncate">
                {activePalette.codeTag} · INTERACTIVE TRACE STAGE
              </span>
              <span className="text-cyan-300/85 tabular-nums shrink-0">{currentMeta.complexity}</span>
            </div>
          </div>

          {/* Cyber Playback Scrubber Bar */}
          <div className="rounded-2xl p-3.5 bg-[#061121] border border-cyan-500/25 text-white shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto flex-nowrap max-w-full scrollbar-none">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIdx(0);
                  }}
                  title="Về bước đầu"
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-lg border border-cyan-500/25 bg-[#020710] text-cyan-200 hover:border-emerald-400/60 hover:text-white shrink-0 cursor-pointer"
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
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-lg border border-cyan-500/25 bg-[#020710] text-cyan-200 disabled:opacity-35 hover:border-emerald-400/60 hover:text-white shrink-0 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (stepIdx >= steps.length - 1) setStepIdx(0);
                    setIsPlaying((p) => !p);
                  }}
                  className="min-h-[40px] flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 text-xs font-extrabold shadow-[0_8px_24px_-4px_rgba(16,185,129,0.55)] transition-all shrink-0 whitespace-nowrap cursor-pointer"
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
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-lg border border-cyan-500/25 bg-[#020710] text-cyan-200 disabled:opacity-35 hover:border-emerald-400/60 hover:text-white shrink-0 cursor-pointer"
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
                  className="p-2 rounded-lg border border-cyan-500/25 bg-[#020710] text-cyan-200 hover:border-emerald-400/60 hover:text-white cursor-pointer"
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
                  className="p-2 rounded-lg border border-cyan-500/25 bg-[#020710] text-slate-400 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speed & Step Counter */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#020710] border border-cyan-500/20">
                  {[0.5, 1, 2, 4].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setSpeed(spd)}
                      className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold tabular-nums cursor-pointer ${
                        speed === spd
                          ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-cyan-200 tabular-nums">
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
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          <CsStepAiTutorPanel
            isPaused={!isPlaying}
            simCategory="2d"
            algorithmName={currentMeta.titleVi}
            stepNumber={Math.min(stepIdx + 1, Math.max(1, steps.length))}
            totalSteps={Math.max(1, steps.length)}
            stepTitle={currentStep.title}
            stepDescription={currentStep.description}
            formula={currentStep.formula}
            activeCodeLineText={
              currentStep.activeCodeLine !== undefined && currentStep.activeCodeLine >= 0
                ? currentMeta.pseudocode[currentStep.activeCodeLine] || ''
                : ''
            }
            variablesSummary={(currentStep.variables || [])
              .map((v) => `${v.name}=${v.value}`)
              .join(', ')}
            codeSnippet={currentMeta.pseudocode.join('\n')}
          />
        </div>

        {/* RIGHT ZONE: Terminal Step Explanation, Variable Watch & Pseudocode */}
        <div className="lg:col-span-4 space-y-4">
          {/* Step Explanation */}
          <div className="relative rounded-2xl p-4 bg-[#061121] border border-cyan-500/25 text-white shadow-xs space-y-2.5">
            <span className="pointer-events-none absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/60" />
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className={`font-bold tracking-wider ${statusLabel.cls}`}>{statusLabel.text}</span>
              <span className="text-cyan-300/75 tabular-nums">STEP #{currentStep.stepIndex + 1}</span>
            </div>
            <h3 className="text-sm font-extrabold text-white leading-snug">
              {currentStep.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStep.description}
            </p>
            {currentStep.formula && (
              <div className="p-2.5 rounded-xl bg-[#020710] border border-emerald-500/25 font-mono text-[11px] text-emerald-300 break-words">
                {currentStep.formula}
              </div>
            )}
          </div>

          {/* Variable Watch Table */}
          <div className="rounded-2xl p-4 bg-[#061121] border border-emerald-500/25 text-white shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-300">
              <span>WATCH_VARIABLES</span>
              <span className="text-[10px] text-slate-400">LIVE STATE</span>
            </div>
            {currentStep.variables && currentStep.variables.length > 0 ? (
              <div className="divide-y divide-cyan-500/15 font-mono text-xs tabular-nums rounded-xl bg-[#020710] border border-cyan-500/20 px-3 py-1">
                {currentStep.variables.map((v, idx) => (
                  <div key={idx} className="py-1.5 flex items-start justify-between gap-3">
                    <span className="text-slate-400 shrink-0">{v.name}</span>
                    <span
                      className={`text-right font-bold break-all ${
                        v.highlight === 'success'
                          ? 'text-emerald-400'
                          : v.highlight === 'warn'
                          ? 'text-rose-400'
                          : v.highlight === 'active'
                          ? 'text-amber-300'
                          : v.highlight === 'info'
                          ? 'text-cyan-300'
                          : 'text-slate-100'
                      }`}
                    >
                      {v.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">Chưa có biến theo dõi.</div>
            )}
          </div>

          {/* Pseudocode Trace Terminal */}
          <div className="bg-[#020710] text-slate-200 rounded-2xl p-4 border border-cyan-500/25 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="font-bold text-emerald-300">PSEUDOCODE TRACE</span>
              <span className="text-cyan-300 tabular-nums">{currentMeta.complexity}</span>
            </div>
            <div className="space-y-0.5 font-mono text-[11px] leading-relaxed overflow-x-auto">
              {currentMeta.pseudocode.map((line, lIdx) => {
                const isActive = currentStep.activeCodeLine === lIdx;
                return (
                  <div
                    key={lIdx}
                    className={`px-2 py-0.5 rounded flex items-start gap-2 whitespace-pre border-l-2 ${
                      isActive
                        ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 font-bold'
                        : 'border-transparent text-slate-300/85'
                    }`}
                  >
                    <span className="text-slate-500 select-none w-4 shrink-0 text-right tabular-nums">
                      {lIdx + 1}
                    </span>
                    <span>{line}</span>
                    {isActive && (
                      <span className="algo-cursor-blink inline-block w-1.5 h-3.5 bg-emerald-400 ml-1 self-center" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="pt-2 border-t border-cyan-500/15 text-[11px] text-slate-400 leading-relaxed">
              {currentMeta.summaryVi}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return <ViewportPortal active={isFullscreen}>{mainShell}</ViewportPortal>;
};
