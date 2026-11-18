import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  ArrowLeft,
  Box,
  ChevronLeft,
  ChevronRight,
  Code2,
  GitFork,
  Grid3X3,
  Layers,
  Maximize2,
  Minimize2,
  Network,
  Pause,
  Play,
  RotateCcw,
  Shuffle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';

export type CS3DSimMode = 'sort_3d' | 'bst_3d' | 'graph_3d' | 'maze_3d' | 'stack_queue_3d';

interface CS3DVisualizerProps {
  onBack?: () => void;
}

interface StepFrame {
  label: string;
  codeLine: number;
  // sort_3d
  arr?: number[];
  compareIdx?: [number, number];
  pivotIdx?: number;
  sortedIdx?: number[];
  // bst_3d
  bstNodes?: { val: number; x: number; y: number; z: number; parentIdx: number }[];
  bstActive?: number[];
  bstFound?: number;
  // graph_3d
  graphDist?: number[];
  graphVisited?: boolean[];
  graphCurrent?: number;
  graphActiveEdge?: [number, number];
  // maze_3d
  mazeVisited?: boolean[][];
  mazeFrontier?: [number, number][];
  mazePath?: [number, number][];
  // stack_queue_3d
  sqItems?: number[];
  sqKind?: 'stack' | 'queue';
  sqHighlightIdx?: number;
}

interface ModeMeta {
  id: CS3DSimMode;
  titleVi: string;
  titleEn: string;
  tag: string;
  code: string[];
  icon: React.FC<{ className?: string }>;
}

const MODE_CATALOG: ModeMeta[] = [
  {
    id: 'sort_3d',
    titleVi: 'Tháp Sắp Xếp 3D (QuickSort / Bubble)',
    titleEn: '3D Sorting Pillars (QuickSort)',
    tag: 'O(N log N)',
    icon: Layers,
    code: [
      'void quickSort(vector<int>& a, int l, int r) {',
      '  if (l >= r) return;',
      '  int pivot = a[r], i = l;',
      '  for (int j = l; j < r; j++)',
      '    if (a[j] < pivot) swap(a[i++], a[j]);',
      '  swap(a[i], a[r]); // Đặt pivot đúng vị trí',
      '  quickSort(a, l, i - 1); quickSort(a, i + 1, r);',
      '}'
    ]
  },
  {
    id: 'bst_3d',
    titleVi: 'Cây Tìm Kiếm Nhị Phân 3D (BST)',
    titleEn: '3D Binary Search Tree',
    tag: 'O(log N)',
    icon: GitFork,
    code: [
      'Node* searchBST(Node* root, int key) {',
      '  if (!root || root->val == key) return root;',
      '  if (key < root->val)',
      '    return searchBST(root->left, key);',
      '  return searchBST(root->right, key);',
      '}'
    ]
  },
  {
    id: 'graph_3d',
    titleVi: 'Đồ Thị 3D & Đường Đi Dijkstra',
    titleEn: '3D Spatial Graph & Dijkstra',
    tag: 'O((V+E) log V)',
    icon: Network,
    code: [
      'dist[S] = 0; pq.push({0, S});',
      'while (!pq.empty()) {',
      '  auto [d, u] = pq.top(); pq.pop();',
      '  for (auto [v, w] : adj[u])',
      '    if (dist[u] + w < dist[v])',
      '      dist[v] = dist[u] + w, pq.push({dist[v], v});',
      '}'
    ]
  },
  {
    id: 'maze_3d',
    titleVi: 'Mê Cung 3D & Loang BFS Ngắn Nhất',
    titleEn: '3D Voxel Maze & BFS Wave',
    tag: 'O(R · C)',
    icon: Grid3X3,
    code: [
      'q.push({0, 0}); visited[0][0] = true;',
      'while (!q.empty()) {',
      '  auto [r, c] = q.front(); q.pop();',
      '  if (r == R-1 && c == C-1) break; // Đích!',
      '  for (auto [dr, dc] : dirs4)',
      '    if (canVisit(r+dr, c+dc)) q.push({r+dr, c+dc});',
      '}'
    ]
  },
  {
    id: 'stack_queue_3d',
    titleVi: 'Ngăn Xếp LIFO & Hàng Đợi FIFO 3D',
    titleEn: '3D Stack (LIFO) & Queue (FIFO)',
    tag: 'O(1) Ops',
    icon: Box,
    code: [
      '// Stack LIFO: push() / pop() trên đỉnh',
      'st.push(val); top = st.top(); st.pop();',
      '// Queue FIFO: push() cuối, pop() đầu hàng',
      'q.push(val); front = q.front(); q.pop();'
    ]
  }
];

const GRAPH_NODES_3D: [number, number, number][] = [
  [-2.6, 1.0, 0.4],  // 0: S
  [-1.0, 2.1, -1.2], // 1: A
  [-0.9, 0.3, 1.5],  // 2: B
  [0.9, 2.2, 0.9],   // 3: C
  [1.0, 0.4, -1.3],  // 4: D
  [2.7, 1.3, 0.1]    // 5: T
];

const GRAPH_EDGES_3D: [number, number, number][] = [
  [0, 1, 4],
  [0, 2, 2],
  [2, 1, 1],
  [1, 3, 5],
  [2, 4, 7],
  [2, 3, 8],
  [3, 4, 2],
  [3, 5, 6],
  [4, 5, 3]
];

const MAZE_WALLS: number[][] = [
  [0, 0, 1, 0, 0, 0, 0],
  [0, 1, 1, 0, 1, 1, 0],
  [0, 0, 0, 0, 1, 0, 0],
  [1, 1, 0, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0]
];

function buildQuickSortSteps(initial: number[]): StepFrame[] {
  const a = [...initial];
  const sorted = new Set<number>();
  const frames: StepFrame[] = [
    {
      label: `Khởi tạo mảng [${a.join(', ')}]`,
      codeLine: 0,
      arr: [...a],
      sortedIdx: []
    }
  ];

  const qs = (l: number, r: number) => {
    if (l >= r) {
      if (l === r && l >= 0 && l < a.length) sorted.add(l);
      return;
    }
    const pivot = a[r];
    let i = l;
    frames.push({
      label: `Chọn pivot = a[${r}] = ${pivot} trên đoạn [${l}..${r}]`,
      codeLine: 2,
      arr: [...a],
      pivotIdx: r,
      sortedIdx: Array.from(sorted)
    });
    for (let j = l; j < r; j++) {
      frames.push({
        label: `So sánh a[${j}] (${a[j]}) < pivot (${pivot})`,
        codeLine: 4,
        arr: [...a],
        compareIdx: [i, j],
        pivotIdx: r,
        sortedIdx: Array.from(sorted)
      });
      if (a[j] < pivot) {
        if (i !== j) {
          const tmp = a[i];
          a[i] = a[j];
          a[j] = tmp;
          frames.push({
            label: `Hoán đổi a[${i}] ↔ a[${j}]`,
            codeLine: 4,
            arr: [...a],
            compareIdx: [i, j],
            pivotIdx: r,
            sortedIdx: Array.from(sorted)
          });
        }
        i++;
      }
    }
    const tmp = a[i];
    a[i] = a[r];
    a[r] = tmp;
    sorted.add(i);
    frames.push({
      label: `Đưa pivot ${pivot} vào đúng vị trí chốt i = ${i}`,
      codeLine: 5,
      arr: [...a],
      pivotIdx: i,
      sortedIdx: Array.from(sorted)
    });
    qs(l, i - 1);
    qs(i + 1, r);
  };

  qs(0, a.length - 1);
  for (let k = 0; k < a.length; k++) sorted.add(k);
  frames.push({
    label: `Hoàn tất sắp xếp: [${a.join(', ')}]`,
    codeLine: 7,
    arr: [...a],
    sortedIdx: Array.from(sorted)
  });
  return frames;
}

function buildBstSteps(target: number): StepFrame[] {
  const vals = [50, 28, 74, 15, 40, 62, 88, 9, 21, 35, 46, 58, 69, 81, 95];
  interface BNode {
    val: number;
    x: number;
    y: number;
    z: number;
    parentIdx: number;
    left: number;
    right: number;
  }
  const nodes: BNode[] = [];
  const insert = (v: number) => {
    if (nodes.length === 0) {
      nodes.push({ val: v, x: 0, y: 2.9, z: 0, parentIdx: -1, left: -1, right: -1 });
      return;
    }
    let cur = 0;
    let depth = 0;
    let span = 2.1;
    while (true) {
      depth++;
      if (v < nodes[cur].val) {
        if (nodes[cur].left === -1) {
          const idx = nodes.length;
          nodes[cur].left = idx;
          nodes.push({
            val: v,
            x: nodes[cur].x - span,
            y: 2.9 - depth * 0.78,
            z: (depth % 2 === 0 ? 1 : -1) * 0.35,
            parentIdx: cur,
            left: -1,
            right: -1
          });
          return;
        }
        cur = nodes[cur].left;
      } else {
        if (nodes[cur].right === -1) {
          const idx = nodes.length;
          nodes[cur].right = idx;
          nodes.push({
            val: v,
            x: nodes[cur].x + span,
            y: 2.9 - depth * 0.78,
            z: (depth % 2 === 0 ? 1 : -1) * 0.35,
            parentIdx: cur,
            left: -1,
            right: -1
          });
          return;
        }
        cur = nodes[cur].right;
      }
      span *= 0.54;
    }
  };
  vals.forEach(insert);

  const flat = nodes.map((n) => ({ val: n.val, x: n.x, y: n.y, z: n.z, parentIdx: n.parentIdx }));
  const frames: StepFrame[] = [
    {
      label: `Khởi tạo cây BST 15 nút · Tìm giá trị key = ${target}`,
      codeLine: 0,
      bstNodes: flat,
      bstActive: []
    }
  ];
  let cur = 0;
  const path: number[] = [];
  while (cur !== -1) {
    path.push(cur);
    const nv = nodes[cur].val;
    if (nv === target) {
      frames.push({
        label: `Đã tìm thấy key = ${target} tại nút [${cur}]!`,
        codeLine: 1,
        bstNodes: flat,
        bstActive: [...path],
        bstFound: cur
      });
      return frames;
    }
    if (target < nv) {
      frames.push({
        label: `${target} < ${nv} → Rẽ sang nhánh TRÁI`,
        codeLine: 3,
        bstNodes: flat,
        bstActive: [...path]
      });
      cur = nodes[cur].left;
    } else {
      frames.push({
        label: `${target} > ${nv} → Rẽ sang nhánh PHẢI`,
        codeLine: 4,
        bstNodes: flat,
        bstActive: [...path]
      });
      cur = nodes[cur].right;
    }
  }
  frames.push({
    label: `Không tồn tại key = ${target} trong cây BST.`,
    codeLine: 1,
    bstNodes: flat,
    bstActive: [...path]
  });
  return frames;
}

function buildGraphDijkstraSteps(): StepFrame[] {
  const n = GRAPH_NODES_3D.length;
  const dist = new Array(n).fill(Infinity);
  const visited = new Array(n).fill(false);
  dist[0] = 0;

  const frames: StepFrame[] = [
    {
      label: 'Khởi tạo Dijkstra từ đỉnh S(0): dist[S] = 0, các đỉnh khác = ∞',
      codeLine: 0,
      graphDist: [...dist],
      graphVisited: [...visited],
      graphCurrent: 0
    }
  ];

  for (let iter = 0; iter < n; iter++) {
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!visited[i] && (u === -1 || dist[i] < dist[u])) u = i;
    }
    if (u === -1 || dist[u] === Infinity) break;
    visited[u] = true;
    frames.push({
      label: `Lấy đỉnh u=${u} có dist=${dist[u]} nhỏ nhất ra khỏi Priority Queue`,
      codeLine: 2,
      graphDist: [...dist],
      graphVisited: [...visited],
      graphCurrent: u
    });

    for (const [a, b, w] of GRAPH_EDGES_3D) {
      const v = a === u ? b : b === u ? a : -1;
      if (v === -1) continue;
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        frames.push({
          label: `Nới lỏng cạnh (${u}→${v}, w=${w}): cập nhật dist[${v}] = ${dist[v]}`,
          codeLine: 5,
          graphDist: [...dist],
          graphVisited: [...visited],
          graphCurrent: u,
          graphActiveEdge: [u, v]
        });
      }
    }
  }
  frames.push({
    label: `Hoàn tất Dijkstra! Đường đi ngắn nhất S→T(5) = ${dist[5]}`,
    codeLine: 6,
    graphDist: [...dist],
    graphVisited: [...visited],
    graphCurrent: 5
  });
  return frames;
}

function buildMazeBfsSteps(): StepFrame[] {
  const R = 7;
  const C = 7;
  const vis = Array.from({ length: R }, () => Array(C).fill(false));
  const parent: ([number, number] | null)[][] = Array.from({ length: R }, () => Array(C).fill(null));
  const q: [number, number][] = [[0, 0]];
  vis[0][0] = true;

  const cloneVis = () => vis.map((row) => [...row]);
  const frames: StepFrame[] = [
    {
      label: 'Bắt đầu loang BFS từ ô (0,0) → đích (6,6)',
      codeLine: 0,
      mazeVisited: cloneVis(),
      mazeFrontier: [[0, 0]],
      mazePath: []
    }
  ];

  const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
  ];
  let found = false;
  while (q.length > 0 && !found) {
    const levelSize = q.length;
    const nextFrontier: [number, number][] = [];
    for (let k = 0; k < levelSize; k++) {
      const [r, c] = q.shift()!;
      if (r === R - 1 && c === C - 1) {
        found = true;
        break;
      }
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && !vis[nr][nc] && MAZE_WALLS[nr][nc] === 0) {
          vis[nr][nc] = true;
          parent[nr][nc] = [r, c];
          q.push([nr, nc]);
          nextFrontier.push([nr, nc]);
        }
      }
    }
    if (nextFrontier.length > 0) {
      frames.push({
        label: `Loang thêm ${nextFrontier.length} ô biên mới trên mê cung 3D`,
        codeLine: 5,
        mazeVisited: cloneVis(),
        mazeFrontier: nextFrontier,
        mazePath: []
      });
    }
  }

  const path: [number, number][] = [];
  let cur: [number, number] | null = [R - 1, C - 1];
  while (cur) {
    path.push(cur);
    cur = parent[cur[0]][cur[1]];
  }
  path.reverse();
  frames.push({
    label: `Tìm thấy đường ngắn nhất dài ${path.length - 1} bước!`,
    codeLine: 3,
    mazeVisited: cloneVis(),
    mazeFrontier: [],
    mazePath: path
  });
  return frames;
}

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const r = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|Software|Basic Render/i.test(r);
  } catch {
    return false;
  }
}

export const CS3DVisualizer: React.FC<CS3DVisualizerProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode } = useBackgroundTheme();

  const [mode, setMode] = useState<CS3DSimMode>('sort_3d');
  const [sortSeed, setSortSeed] = useState<number[]>([7, 3, 9, 2, 6, 4, 8, 5, 1]);
  const [bstTarget, setBstTarget] = useState<number>(46);
  const [sqKind, setSqKind] = useState<'stack' | 'queue'>('stack');
  const [sqItems, setSqItems] = useState<number[]>([12, 25, 38, 44]);
  const [sqLabel, setSqLabel] = useState<string>('Khởi tạo cấu trúc Stack/Queue 3D');

  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMult, setSpeedMult] = useState<0.5 | 1 | 2>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const resetCamRef = useRef<(() => void) | null>(null);
  const enteredNativeFsRef = useRef<boolean>(false);

  const steps: StepFrame[] = useMemo(() => {
    if (mode === 'sort_3d') return buildQuickSortSteps(sortSeed);
    if (mode === 'bst_3d') return buildBstSteps(bstTarget);
    if (mode === 'graph_3d') return buildGraphDijkstraSteps();
    if (mode === 'maze_3d') return buildMazeBfsSteps();
    return [
      {
        label: sqLabel,
        codeLine: sqKind === 'stack' ? 1 : 3,
        sqItems,
        sqKind,
        sqHighlightIdx: sqKind === 'stack' ? sqItems.length - 1 : 0
      }
    ];
  }, [bstTarget, mode, sortSeed, sqItems, sqKind, sqLabel]);

  const safeStepIdx = Math.min(stepIdx, Math.max(0, steps.length - 1));
  const currentFrame = steps[safeStepIdx] || steps[0];
  const frameRef = useRef<StepFrame>(currentFrame);
  frameRef.current = currentFrame;
  const modeRef = useRef<CS3DSimMode>(mode);
  modeRef.current = mode;

  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(mode !== 'stack_queue_3d');
  }, [mode, sortSeed, bstTarget]);

  // Step auto-playback timer
  useEffect(() => {
    if (!isPlaying || mode === 'stack_queue_3d' || steps.length <= 1) return;
    const ms = Math.round(750 / speedMult);
    const id = window.setInterval(() => {
      setStepIdx((prev) => {
        if (prev + 1 >= steps.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, ms);
    return () => window.clearInterval(id);
  }, [isPlaying, mode, speedMult, steps.length]);

  // Fullscreen ESC & native sync
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('pre-fullscreen-active', isFullscreen);
    const onFsChange = () => {
      if (!document.fullscreenElement && enteredNativeFsRef.current) {
        enteredNativeFsRef.current = false;
        setIsFullscreen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        enteredNativeFsRef.current = false;
        setIsFullscreen(false);
        try {
          if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
        } catch {}
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('pre-fullscreen-active');
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onKey);
    };
  }, [isFullscreen]);

  // Three.js WebGL 3D Stage
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && perfMode !== 'smooth',
        powerPreference: 'high-performance'
      });
    } catch {
      return;
    }

    const hostDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : perfMode === 'smooth' ? Math.min(hostDpr, 1.15) : Math.min(hostDpr, 1.75)
    );
    renderer.setSize(container.clientWidth || 760, container.clientHeight || 420);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const onLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onRestored = () => setContextLost(false);
    renderer.domElement.addEventListener('webglcontextlost', onLost);
    renderer.domElement.addEventListener('webglcontextrestored', onRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b18);
    scene.fog = new THREE.FogExp2(0x050b18, 0.022);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(
      46,
      (container.clientWidth || 760) / (container.clientHeight || 420),
      0.1,
      100
    );
    camera.position.set(0, 4.6, 8.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.target.set(0, 1.1, 0);
    controls.update();

    scene.add(new THREE.HemisphereLight(0x93c5fd, 0x0f172a, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(6, 11, 7);
    scene.add(key);

    const grid = new THREE.GridHelper(16, 16, 0x10b981, 0x1e293b);
    scene.add(grid);

    // 1. SORTING PILLARS (up to 12)
    const sortGroup = new THREE.Group();
    scene.add(sortGroup);
    const pillarMats: THREE.MeshPhysicalMaterial[] = [];
    const pillarMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 12; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.25,
        metalness: 0.55,
        clearcoat: 0.6
      });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1, 0.55), mat);
      sortGroup.add(mesh);
      pillarMats.push(mat);
      pillarMeshes.push(mesh);
    }

    // 2. BST 3D GROUP
    const bstGroup = new THREE.Group();
    scene.add(bstGroup);
    const bstNodeMeshes: THREE.Mesh[] = [];
    const bstNodeMats: THREE.MeshStandardMaterial[] = [];
    const bstEdges: THREE.Line[] = [];
    for (let i = 0; i < 18; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.3,
        roughness: 0.25,
        metalness: 0.6
      });
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), mat);
      s.visible = false;
      bstGroup.add(s);
      bstNodeMeshes.push(s);
      bstNodeMats.push(mat);

      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
        new THREE.LineBasicMaterial({ color: 0x475569 })
      );
      line.visible = false;
      bstGroup.add(line);
      bstEdges.push(line);
    }

    // 3. GRAPH 3D GROUP
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);
    const gNodeMeshes: THREE.Mesh[] = [];
    const gNodeMats: THREE.MeshStandardMaterial[] = [];
    GRAPH_NODES_3D.forEach(([x, y, z]) => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35,
        roughness: 0.22,
        metalness: 0.7
      });
      const sp = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), mat);
      sp.position.set(x, y, z);
      graphGroup.add(sp);
      gNodeMeshes.push(sp);
      gNodeMats.push(mat);
    });
    const gEdgeLines: { u: number; v: number; mat: THREE.LineBasicMaterial }[] = [];
    GRAPH_EDGES_3D.forEach(([u, v]) => {
      const mat = new THREE.LineBasicMaterial({ color: 0x64748b });
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...GRAPH_NODES_3D[u]),
        new THREE.Vector3(...GRAPH_NODES_3D[v])
      ]);
      graphGroup.add(new THREE.Line(geo, mat));
      gEdgeLines.push({ u, v, mat });
    });

    // 4. MAZE 3D GROUP (7x7)
    const mazeGroup = new THREE.Group();
    scene.add(mazeGroup);
    const mazeTiles: THREE.Mesh[][] = [];
    const mazeTileMats: THREE.MeshStandardMaterial[][] = [];
    for (let r = 0; r < 7; r++) {
      const rowM: THREE.Mesh[] = [];
      const rowMat: THREE.MeshStandardMaterial[] = [];
      for (let c = 0; c < 7; c++) {
        const isWall = MAZE_WALLS[r][c] === 1;
        const mat = new THREE.MeshStandardMaterial({
          color: isWall ? 0x334155 : 0x0f172a,
          roughness: 0.45,
          metalness: 0.5
        });
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.72, isWall ? 0.85 : 0.14, 0.72), mat);
        box.position.set((c - 3) * 0.84, isWall ? 0.42 : 0.07, (r - 3) * 0.84);
        mazeGroup.add(box);
        rowM.push(box);
        rowMat.push(mat);
      }
      mazeTiles.push(rowM);
      mazeTileMats.push(rowMat);
    }

    // 5. STACK / QUEUE 3D GROUP
    const sqGroup = new THREE.Group();
    scene.add(sqGroup);
    const sqSpindle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 3.6, 16),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 })
    );
    sqSpindle.position.set(0, 1.8, 0);
    sqGroup.add(sqSpindle);
    const sqBoxes: THREE.Mesh[] = [];
    const sqMats: THREE.MeshPhysicalMaterial[] = [];
    for (let i = 0; i < 10; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        roughness: 0.2,
        metalness: 0.45,
        clearcoat: 0.7
      });
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.45, 0.75), mat);
      b.visible = false;
      sqGroup.add(b);
      sqBoxes.push(b);
      sqMats.push(mat);
    }

    resetCamRef.current = () => {
      camera.position.set(0, 4.6, 8.2);
      controls.target.set(0, 1.1, 0);
      controls.update();
    };

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth || 760;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    let rafId = 0;
    let alive = true;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        rafId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (!alive) return;
        const s = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (s === gl.UNSIGNALED) rafId = window.setTimeout(poll, 5);
        else {
          gl.deleteSync(sync);
          rafId = window.setTimeout(cb, 80);
        }
      };
      rafId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (!alive) return;
      const dt = Math.min(0.05, clock.getDelta());
      const tNow = clock.elapsedTime;
      const m = modeRef.current;
      const f = frameRef.current;

      sortGroup.visible = m === 'sort_3d';
      bstGroup.visible = m === 'bst_3d';
      graphGroup.visible = m === 'graph_3d';
      mazeGroup.visible = m === 'maze_3d';
      sqGroup.visible = m === 'stack_queue_3d';

      if (m === 'sort_3d' && f.arr) {
        const arr = f.arr;
        const sortedSet = new Set(f.sortedIdx || []);
        const [ci, cj] = f.compareIdx || [-1, -1];
        for (let i = 0; i < pillarMeshes.length; i++) {
          const mesh = pillarMeshes[i];
          const mat = pillarMats[i];
          if (i >= arr.length) {
            mesh.visible = false;
            continue;
          }
          mesh.visible = true;
          const h = Math.max(0.35, arr[i] * 0.34);
          const tx = (i - (arr.length - 1) / 2) * 0.78;
          mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, h, 14, dt);
          mesh.position.x = THREE.MathUtils.damp(mesh.position.x, tx, 14, dt);
          mesh.position.y = mesh.scale.y * 0.5;
          if (f.pivotIdx === i) {
            mat.color.setHex(0xf59e0b);
            mat.emissive.setHex(0xd97706);
            mat.emissiveIntensity = 0.65;
          } else if (i === ci || i === cj) {
            mat.color.setHex(0xf43f5e);
            mat.emissive.setHex(0xe11d48);
            mat.emissiveIntensity = 0.75;
          } else if (sortedSet.has(i)) {
            mat.color.setHex(0x10b981);
            mat.emissive.setHex(0x059669);
            mat.emissiveIntensity = 0.45;
          } else {
            mat.color.setHex(0x38bdf8);
            mat.emissive.setHex(0x0284c7);
            mat.emissiveIntensity = 0.2;
          }
        }
      } else if (m === 'bst_3d' && f.bstNodes) {
        const activeSet = new Set(f.bstActive || []);
        bstGroup.rotation.y = Math.sin(tNow * 0.35) * 0.14;
        f.bstNodes.forEach((bn, i) => {
          const sp = bstNodeMeshes[i];
          const mat = bstNodeMats[i];
          const edge = bstEdges[i];
          if (!sp) return;
          sp.visible = true;
          sp.position.set(bn.x, bn.y, bn.z);
          if (f.bstFound === i) {
            mat.color.setHex(0x10b981);
            mat.emissive.setHex(0x10b981);
            mat.emissiveIntensity = 1.3;
          } else if (activeSet.has(i)) {
            mat.color.setHex(0xfbbf24);
            mat.emissive.setHex(0xf59e0b);
            mat.emissiveIntensity = 0.95;
          } else {
            mat.color.setHex(0x38bdf8);
            mat.emissive.setHex(0x0284c7);
            mat.emissiveIntensity = 0.25;
          }
          if (bn.parentIdx >= 0 && f.bstNodes![bn.parentIdx]) {
            const p = f.bstNodes![bn.parentIdx];
            const posArr = new Float32Array([p.x, p.y, p.z, bn.x, bn.y, bn.z]);
            edge.geometry.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
            edge.visible = true;
            (edge.material as THREE.LineBasicMaterial).color.setHex(
              activeSet.has(i) && activeSet.has(bn.parentIdx) ? 0xfbbf24 : 0x475569
            );
          } else {
            edge.visible = false;
          }
        });
      } else if (m === 'graph_3d') {
        const vis = f.graphVisited || [];
        gNodeMeshes.forEach((sp, i) => {
          const mat = gNodeMats[i];
          if (f.graphCurrent === i) {
            mat.color.setHex(0xf59e0b);
            mat.emissive.setHex(0xf59e0b);
            mat.emissiveIntensity = 1.25;
          } else if (vis[i]) {
            mat.color.setHex(0x10b981);
            mat.emissive.setHex(0x059669);
            mat.emissiveIntensity = 0.7;
          } else {
            mat.color.setHex(0x38bdf8);
            mat.emissive.setHex(0x0284c7);
            mat.emissiveIntensity = 0.25;
          }
        });
        gEdgeLines.forEach(({ u, v, mat }) => {
          const act = f.graphActiveEdge;
          const isAct = act && ((act[0] === u && act[1] === v) || (act[0] === v && act[1] === u));
          mat.color.setHex(isAct ? 0xfbbf24 : vis[u] && vis[v] ? 0x10b981 : 0x475569);
        });
      } else if (m === 'maze_3d') {
        const vis = f.mazeVisited || [];
        const frontSet = new Set((f.mazeFrontier || []).map(([r, c]) => `${r},${c}`));
        const pathSet = new Set((f.mazePath || []).map(([r, c]) => `${r},${c}`));
        for (let r = 0; r < 7; r++) {
          for (let c = 0; c < 7; c++) {
            const tile = mazeTiles[r][c];
            const mat = mazeTileMats[r][c];
            if (MAZE_WALLS[r][c] === 1) continue;
            const keyStr = `${r},${c}`;
            if (pathSet.has(keyStr)) {
              mat.color.setHex(0xfbbf24);
              mat.emissive.setHex(0xf59e0b);
              mat.emissiveIntensity = 1.0;
              tile.position.y = 0.2;
            } else if (frontSet.has(keyStr)) {
              mat.color.setHex(0x22d3ee);
              mat.emissive.setHex(0x06b6d4);
              mat.emissiveIntensity = 0.85;
              tile.position.y = 0.14;
            } else if (vis[r]?.[c]) {
              mat.color.setHex(0x10b981);
              mat.emissive.setHex(0x059669);
              mat.emissiveIntensity = 0.35;
              tile.position.y = 0.09;
            } else {
              mat.color.setHex(0x0f172a);
              mat.emissive.setHex(0x000000);
              mat.emissiveIntensity = 0;
              tile.position.y = 0.07;
            }
          }
        }
      } else if (m === 'stack_queue_3d' && f.sqItems) {
        const isStack = f.sqKind === 'stack';
        sqSpindle.visible = isStack;
        sqBoxes.forEach((b, i) => {
          const mat = sqMats[i];
          if (i >= f.sqItems!.length) {
            b.visible = false;
            return;
          }
          b.visible = true;
          const tx = isStack ? 0 : (i - (f.sqItems!.length - 1) / 2) * 1.32;
          const ty = isStack ? 0.35 + i * 0.55 : 0.45;
          b.position.x = THREE.MathUtils.damp(b.position.x, tx, 12, dt);
          b.position.y = THREE.MathUtils.damp(b.position.y, ty, 12, dt);
          const isHot = i === f.sqHighlightIdx;
          mat.color.setHex(isHot ? 0xfbbf24 : isStack ? 0x10b981 : 0x38bdf8);
          mat.emissive.setHex(isHot ? 0xd97706 : 0x0f172a);
          mat.emissiveIntensity = isHot ? 0.7 : 0.15;
        });
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else rafId = requestAnimationFrame(tick);
    };

    if (isSoftwareGl) afterDraw(tick);
    else rafId = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      clearTimeout(rafId);
      ro.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh || (obj as THREE.Line).isLine) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material.dispose();
        }
      });
      envRT.dispose();
      renderer.dispose();
    };
  }, [perfMode]);

  const activeMeta = MODE_CATALOG.find((c) => c.id === mode) || MODE_CATALOG[0];

  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        const req = stageRef.current?.requestFullscreen?.();
        if (req && typeof req.then === 'function') {
          req.then(() => {
            enteredNativeFsRef.current = true;
          }).catch(() => {});
        }
      } catch {}
    } else {
      enteredNativeFsRef.current = false;
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      } catch {}
    }
  };

  return (
    <div
      ref={stageRef}
      className={
        isFullscreen
          ? 'fixed inset-0 z-[140] w-screen h-screen overflow-y-auto bg-slate-950 p-3 sm:p-5 flex flex-col gap-3'
          : 'sci-frame rounded-xl bg-slate-950 text-slate-100 border border-emerald-500/35 overflow-hidden shadow-lg'
      }
    >
      {/* Top Mode Switcher + Playback Bar */}
      <div className="px-4 py-3 bg-slate-900/95 border-b border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {onBack && !isFullscreen && (
            <button
              type="button"
              onClick={onBack}
              className="px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back' : 'Quay lại'}</span>
            </button>
          )}
          {MODE_CATALOG.map((item) => {
            const Icon = item.icon;
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`px-3 py-1.5 rounded text-xs font-bold border flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{isEn ? item.titleEn : item.titleVi}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleToggleFullscreen}
          className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          title={isFullscreen ? 'Thu nhỏ (Esc)' : 'Toàn màn hình'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isFullscreen ? (isEn ? 'Exit Fullscreen' : 'Thu nhỏ') : isEn ? 'Fullscreen' : 'Toàn màn hình'}</span>
        </button>
      </div>

      {/* Main Split: 3D Stage + Controls & Code Trace */}
      <div className={`p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 ${isFullscreen ? 'flex-1 min-h-0' : ''}`}>
        <div className="lg:col-span-8 flex flex-col gap-3 min-h-0">
          <div
            className={`relative w-full rounded-lg overflow-hidden border border-emerald-500/30 bg-[#050b18] ${
              isFullscreen ? 'flex-1 min-h-[380px]' : 'h-[360px] sm:h-[430px]'
            }`}
          >
            <div ref={mountRef} className="absolute inset-0 w-full h-full" />

            {contextLost && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/90 text-emerald-300 text-xs font-mono">
                Restoring 3D Code WebGL...
              </div>
            )}

            <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded bg-slate-950/88 border border-emerald-400/35 text-[11px] font-mono font-bold text-emerald-300">
              {isEn ? activeMeta.titleEn : activeMeta.titleVi} · {activeMeta.tag}
            </div>

            <button
              type="button"
              onClick={() => resetCamRef.current?.()}
              className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded border border-slate-700 bg-slate-950/88 text-slate-200 cursor-pointer"
              title="Reset 3D Camera"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step Playback Bar */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="font-mono text-emerald-300 font-semibold truncate max-w-md">
              {currentFrame.label}
            </div>

            {mode !== 'stack_queue_3d' ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIdx((s) => Math.max(0, s - 1));
                  }}
                  className="p-1.5 rounded bg-slate-800 border border-slate-700 cursor-pointer"
                  title="Prev step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (safeStepIdx >= steps.length - 1) setStepIdx(0);
                    setIsPlaying((p) => !p);
                  }}
                  className={`px-3 py-1.5 rounded font-bold flex items-center gap-1 cursor-pointer ${
                    isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? (isEn ? 'Pause' : 'Tạm dừng') : isEn ? 'Run 3D' : 'Chạy 3D'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIdx((s) => Math.min(steps.length - 1, s + 1));
                  }}
                  className="p-1.5 rounded bg-slate-800 border border-slate-700 cursor-pointer"
                  title="Next step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1 ml-1">
                  {([0.5, 1, 2] as const).map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => setSpeedMult(sp)}
                      className={`px-2 py-1 rounded text-[11px] font-mono border cursor-pointer ${
                        speedMult === sp
                          ? 'bg-cyan-600 border-cyan-400 text-white font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>
                <span className="font-mono text-[11px] text-slate-400 ml-1 tabular-nums">
                  {safeStepIdx + 1}/{steps.length}
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSqKind((k) => (k === 'stack' ? 'queue' : 'stack'))}
                  className="px-2.5 py-1.5 rounded bg-sky-600 text-white font-bold cursor-pointer"
                >
                  {sqKind === 'stack' ? 'Mode: Stack (LIFO)' : 'Mode: Queue (FIFO)'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (sqItems.length >= 9) return;
                    const v = Math.floor(Math.random() * 89 + 10);
                    setSqItems((prev) => [...prev, v]);
                    setSqLabel(`Push(${v}) vào ${sqKind === 'stack' ? 'đỉnh Stack' : 'cuối Queue'}`);
                  }}
                  className="px-2.5 py-1.5 rounded bg-emerald-600 text-white font-bold cursor-pointer"
                >
                  + Push
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (sqItems.length === 0) return;
                    const removed = sqKind === 'stack' ? sqItems[sqItems.length - 1] : sqItems[0];
                    setSqItems((prev) => (sqKind === 'stack' ? prev.slice(0, -1) : prev.slice(1)));
                    setSqLabel(`Pop() lấy ra phần tử ${removed}`);
                  }}
                  className="px-2.5 py-1.5 rounded bg-rose-600 text-white font-bold cursor-pointer"
                >
                  - Pop
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Parameters & Live Code Trace */}
        <div className="lg:col-span-4 space-y-3 text-xs">
          {mode === 'sort_3d' && (
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-300 flex items-center justify-between">
                <span>{isEn ? 'Randomize Array' : 'Đổi Dữ liệu Mảng'}</span>
                <button
                  type="button"
                  onClick={() =>
                    setSortSeed(
                      Array.from({ length: 9 }, () => Math.floor(Math.random() * 9) + 1)
                    )
                  }
                  className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>{isEn ? 'Shuffle' : 'Trộn ngẫu nhiên'}</span>
                </button>
              </div>
              <div className="font-mono text-[11px] text-slate-300">
                [{currentFrame.arr?.join(', ')}]
              </div>
            </div>
          )}

          {mode === 'bst_3d' && (
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-300">
                {isEn ? 'Select Target Key in BST' : 'Chọn Giá trị cần Tìm trong Cây'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[9, 21, 35, 46, 62, 81, 95, 77].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBstTarget(val)}
                    className={`px-2.5 py-1 rounded font-mono font-bold border cursor-pointer ${
                      bstTarget === val
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'graph_3d' && currentFrame.graphDist && (
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-300">Bảng khoảng cách dist[] từ S(0)</div>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                {currentFrame.graphDist.map((d, i) => (
                  <div
                    key={i}
                    className="p-1.5 rounded bg-slate-950 border border-slate-800 flex justify-between"
                  >
                    <span className="text-slate-400">V{i}</span>
                    <span className="text-cyan-300 font-bold">{d === Infinity ? '∞' : d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Line-by-Line Highlighter */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              <span>{isEn ? 'Live C++ Execution Trace' : 'Theo Dõi Dòng Code C++'}</span>
            </div>
            <div className="rounded bg-slate-950 border border-slate-800 p-2 font-mono text-[11px] space-y-0.5 overflow-x-auto">
              {activeMeta.code.map((line, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-0.5 rounded whitespace-pre ${
                    currentFrame.codeLine === idx
                      ? 'bg-emerald-600/30 border-l-2 border-emerald-400 text-emerald-200 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-200">
              {isEn ? '3D Controls' : 'Điều khiển Không gian 3D'}
            </div>
            <div>• {isEn ? 'Drag to orbit 360° · Scroll to zoom' : 'Kéo chuột xoay 360° · Cuộn để thu phóng'}</div>
            <div>• {isEn ? 'Amber: active node/pivot · Emerald: completed/path' : 'Vàng: đang xét · Xanh lục: hoàn tất / đường đi'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
