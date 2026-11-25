import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  ArrowLeft,
  Binary,
  Box,
  Camera,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cuboid,
  Download,
  GitBranch,
  GitFork,
  Grid3X3,
  Layers,
  Maximize2,
  Minimize2,
  Network,
  Pause,
  Play,
  QrCode,
  RotateCcw,
  RotateCw,
  Shuffle,
  Workflow
} from 'lucide-react';
import {
  captureCanvasPng,
  exportJsonFile,
  RecordVideoButton,
  useCanvasRecorder
} from '../common/SimProToolkit';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import { useRemoteController } from '../../context/RemoteControllerContext';
import { applySphericalOrbitDelta, subscribeRemoteCommand } from '../../lib/remoteControlBus';
import {
  createPostProcessingPipeline,
  PostProcessPipeline,
  createTroikaLabel,
  updateBillboardLabels,
  GPUParticlePool,
  OptimizedTrail,
} from '../../lib/three3DEnhancements';
import { CsStepAiTutorPanel } from './CsStepAiTutorPanel';

export type CS3DSimMode =
  | 'sort_3d'
  | 'bst_3d'
  | 'graph_3d'
  | 'maze_3d'
  | 'stack_queue_3d'
  | 'segtree_3d'
  | 'trie_3d'
  | 'dp_table_3d'
  | 'flow_network_3d'
  | 'spatial_octree_3d';

interface CS3DVisualizerProps {
  onBack?: () => void;
  initialMode?: CS3DSimMode;
}

interface SegNodeFrame {
  id: number;
  l: number;
  r: number;
  val: number;
  x: number;
  y: number;
  z: number;
  parentIdx: number;
  status: 'idle' | 'split' | 'cover' | 'skip';
}

interface TrieNodeFrame {
  char: string;
  x: number;
  y: number;
  z: number;
  parentIdx: number;
  isEnd: boolean;
  word?: string;
}

interface FlowEdgeFrame {
  u: number;
  v: number;
  cap: number;
  flow: number;
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
  // segtree_3d
  segNodes?: SegNodeFrame[];
  segTotal?: number;
  // trie_3d
  trieNodes?: TrieNodeFrame[];
  trieActivePath?: number[];
  trieFoundIdx?: number;
  // dp_table_3d
  dpGrid?: number[][];
  dpCur?: [number, number];
  dpDeps?: [number, number][];
  dpTrace?: [number, number][];
  // flow_network_3d
  flowEdges?: FlowEdgeFrame[];
  flowAugPath?: number[];
  flowTotal?: number;
  // spatial_octree_3d
  octVisited?: [number, number, number][];
  octFrontier?: [number, number, number][];
  octPath?: [number, number, number][];
  octCurrent?: [number, number, number];
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
    titleVi: 'Tháp Sắp Xếp 3D',
    titleEn: '3D Sorting Pillars',
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
    titleVi: 'Cây BST 3D',
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
    titleVi: 'Đồ Thị Dijkstra 3D',
    titleEn: '3D Dijkstra Graph',
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
    titleVi: 'Mê Cung BFS 3D',
    titleEn: '3D Voxel Maze BFS',
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
    titleVi: 'Stack & Queue 3D',
    titleEn: '3D Stack & Queue',
    tag: 'O(1) Ops',
    icon: Box,
    code: [
      '// Stack LIFO: push() / pop() trên đỉnh',
      'st.push(val); top = st.top(); st.pop();',
      '// Queue FIFO: push() cuối, pop() đầu hàng',
      'q.push(val); front = q.front(); q.pop();'
    ]
  },
  {
    id: 'segtree_3d',
    titleVi: 'Segment Tree 3D',
    titleEn: '3D Segment Tree',
    tag: 'O(log N)',
    icon: Binary,
    code: [
      'int query(int id, int l, int r, int ql, int qr) {',
      '  if (qr < l || r < ql) return 0; // SKIP',
      '  if (ql <= l && r <= qr) return st[id]; // COVER',
      '  int mid = (l + r) / 2; // SPLIT',
      '  return query(2*id, l, mid, ql, qr)',
      '       + query(2*id+1, mid+1, r, ql, qr);',
      '}'
    ]
  },
  {
    id: 'trie_3d',
    titleVi: 'Cây Tiền Tố Trie 3D',
    titleEn: '3D Trie Prefix Tree',
    tag: 'O(|S|)',
    icon: GitBranch,
    code: [
      'bool searchTrie(Node* root, string s) {',
      '  Node* cur = root;',
      '  for (char c : s) {',
      '    if (!cur->next[c - \'A\']) return false;',
      '    cur = cur->next[c - \'A\'];',
      '  }',
      '  return cur->isEnd;',
      '}'
    ]
  },
  {
    id: 'dp_table_3d',
    titleVi: 'Bảng QHĐ Knapsack 3D',
    titleEn: '3D DP Elevation Grid',
    tag: 'O(N · W)',
    icon: Layers,
    code: [
      'for (int i = 1; i <= N; i++) {',
      '  for (int w = 0; w <= W; w++) {',
      '    dp[i][w] = dp[i-1][w]; // Không chọn',
      '    if (w >= wt[i]) // Chọn vật i',
      '      dp[i][w] = max(dp[i][w], dp[i-1][w-wt[i]] + val[i]);',
      '  }',
      '}'
    ]
  },
  {
    id: 'flow_network_3d',
    titleVi: 'Luồng Cực Đại MaxFlow 3D',
    titleEn: '3D Max Flow Network',
    tag: 'O(V · E²)',
    icon: Workflow,
    code: [
      'while (int pushed = bfsAugment(S, T, parent)) {',
      '  totalFlow += pushed;',
      '  for (int v = T; v != S; v = parent[v]) {',
      '    int u = parent[v];',
      '    flow[u][v] += pushed; flow[v][u] -= pushed;',
      '  }',
      '}'
    ]
  },
  {
    id: 'spatial_octree_3d',
    titleVi: 'Octree & A* 3D Voxel',
    titleEn: '3D Octree A* Search',
    tag: 'O(E log V)',
    icon: Cuboid,
    code: [
      'pq.push({h(S), 0, S}); // f = g + h',
      'while (!pq.empty()) {',
      '  auto u = pq.top(); pq.pop();',
      '  if (u == Goal) return reconstructPath();',
      '  for (auto v : neighbors6(u))',
      '    if (g[u] + 1 < g[v]) pq.push({g[u]+1+h(v), v});',
      '}'
    ]
  }
];

const GRAPH_NODES_3D: [number, number, number][] = [
  [-2.8, 1.1, 0.4],
  [-1.1, 2.35, -1.25],
  [-0.95, 0.5, 1.55],
  [1.0, 2.4, 0.95],
  [1.05, 0.55, -1.35],
  [2.85, 1.4, 0.1]
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

const SEG_BASE_ARR = [3, 1, 4, 1, 5, 9, 2, 6];

const FLOW_NODES_3D: [number, number, number][] = [
  [-3.2, 1.6, 0],
  [-1.1, 2.75, 1.15],
  [-1.1, 0.65, -1.15],
  [1.1, 2.75, -1.1],
  [1.1, 0.65, 1.15],
  [3.2, 1.6, 0]
];

const FLOW_BASE_EDGES: { u: number; v: number; cap: number }[] = [
  { u: 0, v: 1, cap: 10 },
  { u: 0, v: 2, cap: 8 },
  { u: 1, v: 2, cap: 3 },
  { u: 1, v: 3, cap: 7 },
  { u: 2, v: 4, cap: 9 },
  { u: 3, v: 4, cap: 4 },
  { u: 3, v: 5, cap: 8 },
  { u: 4, v: 5, cap: 10 }
];

const OCTREE_OBSTACLES = new Set([
  '1,0,0', '1,1,0', '1,1,1', '2,1,1', '2,2,1', '1,2,2', '2,2,2', '2,1,2', '0,2,1', '2,3,1'
]);

// Reusable temp vectors for cylinder edge alignment (Zero GC inside render loop)
const _vecA = new THREE.Vector3();
const _vecB = new THREE.Vector3();
const _vecDir = new THREE.Vector3();
const _vecMid = new THREE.Vector3();
const _upAxis = new THREE.Vector3(0, 1, 0);
const _edgeQuat = new THREE.Quaternion();

function alignCylinderEdge(mesh: THREE.Mesh, ax: number, ay: number, az: number, bx: number, by: number, bz: number, radiusScale = 1) {
  _vecA.set(ax, ay, az);
  _vecB.set(bx, by, bz);
  _vecDir.subVectors(_vecB, _vecA);
  const len = _vecDir.length();
  if (len < 1e-4) {
    mesh.visible = false;
    return;
  }
  _vecMid.addVectors(_vecA, _vecB).multiplyScalar(0.5);
  mesh.position.copy(_vecMid);
  _vecDir.divideScalar(len);
  _edgeQuat.setFromUnitVectors(_upAxis, _vecDir);
  mesh.quaternion.copy(_edgeQuat);
  mesh.scale.set(radiusScale, len, radiusScale);
}

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
      nodes.push({ val: v, x: 0, y: 3.1, z: 0, parentIdx: -1, left: -1, right: -1 });
      return;
    }
    let cur = 0;
    let depth = 0;
    let span = 2.15;
    while (true) {
      depth++;
      if (v < nodes[cur].val) {
        if (nodes[cur].left === -1) {
          const idx = nodes.length;
          nodes[cur].left = idx;
          nodes.push({
            val: v,
            x: nodes[cur].x - span,
            y: 3.1 - depth * 0.82,
            z: (depth % 2 === 0 ? 1 : -1) * 0.42,
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
            y: 3.1 - depth * 0.82,
            z: (depth % 2 === 0 ? 1 : -1) * 0.42,
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
      label: `Lấy đỉnh V${u} có dist=${dist[u]} nhỏ nhất ra khỏi Priority Queue`,
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
          label: `Nới lỏng cạnh (V${u}→V${v}, w=${w}): cập nhật dist[V${v}] = ${dist[v]}`,
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
    label: `Hoàn tất Dijkstra! Đường đi ngắn nhất S→T(V5) = ${dist[5]}`,
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

function buildSegTreeSteps(ql: number, qr: number): StepFrame[] {
  const n = SEG_BASE_ARR.length; // 8 -> nodes 1..15
  const nodes: SegNodeFrame[] = [];
  const valArr = new Array(16).fill(0);
  const build = (id: number, l: number, r: number, depth: number, parentIdx: number) => {
    const mid = (l + r) >> 1;
    const spanCenter = (l + r) / 2 - (n - 1) / 2;
    const myIdx = nodes.length;
    nodes.push({
      id,
      l,
      r,
      val: 0,
      x: spanCenter * 0.92,
      y: 3.15 - depth * 0.85,
      z: (depth % 2 === 0 ? 1 : -1) * 0.32,
      parentIdx,
      status: 'idle'
    });
    if (l === r) {
      valArr[id] = SEG_BASE_ARR[l];
      nodes[myIdx].val = valArr[id];
      return;
    }
    build(id * 2, l, mid, depth + 1, myIdx);
    build(id * 2 + 1, mid + 1, r, depth + 1, myIdx);
    valArr[id] = valArr[id * 2] + valArr[id * 2 + 1];
    nodes[myIdx].val = valArr[id];
  };
  build(1, 0, n - 1, 0, -1);

  const statusMap = new Map<number, SegNodeFrame['status']>();
  const snapshot = (label: string, codeLine: number, total: number): StepFrame => ({
    label,
    codeLine,
    segTotal: total,
    segNodes: nodes.map((nd) => ({ ...nd, status: statusMap.get(nd.id) || 'idle' }))
  });

  const frames: StepFrame[] = [
    snapshot(`Khởi tạo Segment Tree 15 nút trên a = [${SEG_BASE_ARR.join(', ')}] · Query [${ql}..${qr}]`, 0, 0)
  ];

  let runningSum = 0;
  const query = (id: number, l: number, r: number): number => {
    if (qr < l || r < ql) {
      statusMap.set(id, 'skip');
      frames.push(snapshot(`Nút [${l}..${r}] ngoài đoạn [${ql}..${qr}] → SKIP (trả về 0)`, 1, runningSum));
      return 0;
    }
    if (ql <= l && r <= qr) {
      statusMap.set(id, 'cover');
      runningSum += valArr[id];
      frames.push(
        snapshot(`Nút [${l}..${r}] nằm trọn trong [${ql}..${qr}] → COVER (+${valArr[id]})`, 2, runningSum)
      );
      return valArr[id];
    }
    statusMap.set(id, 'split');
    frames.push(snapshot(`Nút [${l}..${r}] giao một phần → SPLIT xuống 2 con`, 3, runningSum));
    const mid = (l + r) >> 1;
    return query(id * 2, l, mid) + query(id * 2 + 1, mid + 1, r);
  };

  const finalSum = query(1, 0, n - 1);
  frames.push(snapshot(`Hoàn tất truy vấn Sum[${ql}..${qr}] = ${finalSum}!`, 5, finalSum));
  return frames;
}

function buildTrieSteps(word: string): StepFrame[] {
  const dict = ['CODE', 'CORE', 'DATA', 'NODE', 'NET'];
  interface TNode {
    char: string;
    depth: number;
    parentIdx: number;
    children: Record<string, number>;
    isEnd: boolean;
    word?: string;
    x: number;
    y: number;
    z: number;
  }
  const nodes: TNode[] = [
    { char: '*', depth: 0, parentIdx: -1, children: {}, isEnd: false, x: 0, y: 3.1, z: 0 }
  ];

  for (const w of dict) {
    let cur = 0;
    for (let i = 0; i < w.length; i++) {
      const ch = w[i];
      if (nodes[cur].children[ch] === undefined) {
        const idx = nodes.length;
        nodes[cur].children[ch] = idx;
        nodes.push({
          char: ch,
          depth: i + 1,
          parentIdx: cur,
          children: {},
          isEnd: false,
          x: 0,
          y: 3.1 - (i + 1) * 0.78,
          z: 0
        });
      }
      cur = nodes[cur].children[ch];
    }
    nodes[cur].isEnd = true;
    nodes[cur].word = w;
  }

  // Layout leaf counts recursively for balanced 3D X/Z spread
  const assignLayout = (idx: number, minX: number, maxX: number) => {
    const keys = Object.keys(nodes[idx].children).sort();
    nodes[idx].x = (minX + maxX) * 0.5;
    nodes[idx].z = idx === 0 ? 0 : Math.sin(idx * 1.45) * 0.65;
    if (keys.length === 0) return;
    const step = (maxX - minX) / keys.length;
    keys.forEach((k, kIdx) => {
      assignLayout(nodes[idx].children[k], minX + kIdx * step, minX + (kIdx + 1) * step);
    });
  };
  assignLayout(0, -3.2, 3.2);

  const flat: TrieNodeFrame[] = nodes.map((nd) => ({
    char: nd.char,
    x: nd.x,
    y: nd.y,
    z: nd.z,
    parentIdx: nd.parentIdx,
    isEnd: nd.isEnd,
    word: nd.word
  }));

  const frames: StepFrame[] = [
    {
      label: `Cây Trie từ điển [${dict.join(', ')}] · Tìm từ "${word}"`,
      codeLine: 1,
      trieNodes: flat,
      trieActivePath: [0]
    }
  ];

  let cur = 0;
  const path = [0];
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const nxt = nodes[cur].children[ch];
    if (nxt === undefined) {
      frames.push({
        label: `Không tìm thấy ký tự '${ch}' từ nút hiện tại → Trả về FALSE`,
        codeLine: 3,
        trieNodes: flat,
        trieActivePath: [...path]
      });
      return frames;
    }
    cur = nxt;
    path.push(cur);
    frames.push({
      label: `Khớp ký tự '${ch}' → Di chuyển xuống nút [${cur}] (độ sâu ${i + 1})`,
      codeLine: 4,
      trieNodes: flat,
      trieActivePath: [...path]
    });
  }

  frames.push({
    label: nodes[cur].isEnd
      ? `Từ "${word}" TỒN TẠI trọn vẹn (isEnd = true)!`
      : `"${word}" chỉ là tiền tố, chưa kết thúc từ (isEnd = false).`,
    codeLine: 6,
    trieNodes: flat,
    trieActivePath: [...path],
    trieFoundIdx: nodes[cur].isEnd ? cur : undefined
  });
  return frames;
}

function buildDpTable3DSteps(): StepFrame[] {
  const items = [
    { w: 2, v: 3 },
    { w: 3, v: 4 },
    { w: 4, v: 5 },
    { w: 5, v: 8 }
  ];
  const W = 7;
  const N = items.length;
  const dp = Array.from({ length: N + 1 }, () => Array(W + 1).fill(0));
  const cloneDp = () => dp.map((row) => [...row]);

  const frames: StepFrame[] = [
    {
      label: 'Khởi tạo lưới độ cao DP[0..4][0..7] = 0 (Knapsack 0/1)',
      codeLine: 0,
      dpGrid: cloneDp(),
      dpCur: [0, 0]
    }
  ];

  for (let i = 1; i <= N; i++) {
    const { w: wi, v: vi } = items[i - 1];
    for (let w = 1; w <= W; w++) {
      const deps: [number, number][] = [[i - 1, w]];
      let best = dp[i - 1][w];
      let line = 2;
      if (w >= wi) {
        deps.push([i - 1, w - wi]);
        if (dp[i - 1][w - wi] + vi > best) {
          best = dp[i - 1][w - wi] + vi;
          line = 4;
        }
      }
      dp[i][w] = best;
      frames.push({
        label: `Vật #${i}(w=${wi},v=${vi}), w=${w}: dp[${i}][${w}] = ${best}`,
        codeLine: line,
        dpGrid: cloneDp(),
        dpCur: [i, w],
        dpDeps: deps
      });
    }
  }

  const trace: [number, number][] = [];
  let cw = W;
  for (let i = N; i >= 1; i--) {
    trace.push([i, cw]);
    if (dp[i][cw] !== dp[i - 1][cw]) {
      cw -= items[i - 1].w;
    }
  }
  trace.push([0, cw]);
  frames.push({
    label: `Hoàn tất Knapsack 3D! Giá trị tối ưu = ${dp[N][W]}`,
    codeLine: 4,
    dpGrid: cloneDp(),
    dpTrace: trace
  });
  return frames;
}

function buildMaxFlowSteps(): StepFrame[] {
  const n = FLOW_NODES_3D.length;
  const edges: FlowEdgeFrame[] = FLOW_BASE_EDGES.map((e) => ({ ...e, flow: 0 }));
  const cloneEdges = () => edges.map((e) => ({ ...e }));

  const frames: StepFrame[] = [
    {
      label: 'Mạng luồng 6 đỉnh S(0) → T(5): Tất cả luồng ban đầu flow = 0',
      codeLine: 0,
      flowEdges: cloneEdges(),
      flowTotal: 0
    }
  ];

  let totalFlow = 0;
  // Iterative BFS Edmonds-Karp on directed capacity edges + residual reverse check
  while (true) {
    const parentEdge = new Array<number>(n).fill(-1);
    const parentDir = new Array<number>(n).fill(0);
    const vis = new Array(n).fill(false);
    const q: number[] = [0];
    vis[0] = true;

    while (q.length > 0 && !vis[5]) {
      const u = q.shift()!;
      for (let ei = 0; ei < edges.length; ei++) {
        const e = edges[ei];
        if (e.u === u && !vis[e.v] && e.cap - e.flow > 0) {
          vis[e.v] = true;
          parentEdge[e.v] = ei;
          parentDir[e.v] = 1;
          q.push(e.v);
        } else if (e.v === u && !vis[e.u] && e.flow > 0) {
          vis[e.u] = true;
          parentEdge[e.u] = ei;
          parentDir[e.u] = -1;
          q.push(e.u);
        }
      }
    }

    if (!vis[5]) break;

    let pushed = Infinity;
    const augNodes: number[] = [];
    let cur = 5;
    while (cur !== 0) {
      augNodes.push(cur);
      const ei = parentEdge[cur];
      const dir = parentDir[cur];
      const e = edges[ei];
      pushed = Math.min(pushed, dir === 1 ? e.cap - e.flow : e.flow);
      cur = dir === 1 ? e.u : e.v;
    }
    augNodes.push(0);
    augNodes.reverse();

    frames.push({
      label: `Tìm thấy đường tăng luồng: ${augNodes.map((x) => `V${x}`).join(' → ')} (bottleneck = +${pushed})`,
      codeLine: 1,
      flowEdges: cloneEdges(),
      flowAugPath: augNodes,
      flowTotal: totalFlow
    });

    cur = 5;
    while (cur !== 0) {
      const ei = parentEdge[cur];
      const dir = parentDir[cur];
      edges[ei].flow += dir * pushed;
      cur = dir === 1 ? edges[ei].u : edges[ei].v;
    }
    totalFlow += pushed;

    frames.push({
      label: `Bơm thêm +${pushed} vào mạng → Tổng luồng hiện tại = ${totalFlow}`,
      codeLine: 4,
      flowEdges: cloneEdges(),
      flowAugPath: augNodes,
      flowTotal: totalFlow
    });
  }

  frames.push({
    label: `Đạt Luồng Cực Đại (Max-Flow) = ${totalFlow}! Không còn đường tăng luồng.`,
    codeLine: 6,
    flowEdges: cloneEdges(),
    flowTotal: totalFlow
  });
  return frames;
}

function buildSpatialOctreeSteps(): StepFrame[] {
  const N = 4;
  const key = (x: number, y: number, z: number) => `${x},${y},${z}`;
  const gScore = new Map<string, number>();
  const parent = new Map<string, [number, number, number]>();
  const closed = new Set<string>();
  const closedArr: [number, number, number][] = [];
  const openSet = new Map<string, { x: number; y: number; z: number; f: number }>();

  const h = (x: number, y: number, z: number) => Math.abs(3 - x) + Math.abs(3 - y) + Math.abs(3 - z);
  gScore.set('0,0,0', 0);
  openSet.set('0,0,0', { x: 0, y: 0, z: 0, f: h(0, 0, 0) });

  const frames: StepFrame[] = [
    {
      label: 'A* 3D trên lưới Octree 4×4×4: Từ Voxel (0,0,0) → Đích (3,3,3)',
      codeLine: 0,
      octVisited: [],
      octFrontier: [[0, 0, 0]],
      octPath: [],
      octCurrent: [0, 0, 0]
    }
  ];

  const dirs = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1]
  ];

  while (openSet.size > 0) {
    let bestKey = '';
    let bestItem: { x: number; y: number; z: number; f: number } | null = null;
    for (const [k, item] of openSet.entries()) {
      if (!bestItem || item.f < bestItem.f) {
        bestItem = item;
        bestKey = k;
      }
    }
    if (!bestItem) break;
    openSet.delete(bestKey);
    closed.add(bestKey);
    closedArr.push([bestItem.x, bestItem.y, bestItem.z]);

    if (bestItem.x === 3 && bestItem.y === 3 && bestItem.z === 3) {
      const path: [number, number, number][] = [];
      let curK = '3,3,3';
      let curCoord: [number, number, number] | undefined = [3, 3, 3];
      while (curCoord) {
        path.push(curCoord);
        curCoord = parent.get(curK);
        if (curCoord) curK = key(curCoord[0], curCoord[1], curCoord[2]);
      }
      path.reverse();
      frames.push({
        label: `A* chạm đích (3,3,3)! Đường tối ưu qua ${path.length - 1} bước Voxel`,
        codeLine: 3,
        octVisited: [...closedArr],
        octFrontier: [],
        octPath: path,
        octCurrent: [3, 3, 3]
      });
      return frames;
    }

    const gCur = gScore.get(bestKey) ?? 0;
    for (const [dx, dy, dz] of dirs) {
      const nx = bestItem.x + dx;
      const ny = bestItem.y + dy;
      const nz = bestItem.z + dz;
      if (nx < 0 || nx >= N || ny < 0 || ny >= N || nz < 0 || nz >= N) continue;
      const nk = key(nx, ny, nz);
      if (OCTREE_OBSTACLES.has(nk) || closed.has(nk)) continue;
      const tentG = gCur + 1;
      if (tentG < (gScore.get(nk) ?? Infinity)) {
        gScore.set(nk, tentG);
        parent.set(nk, [bestItem.x, bestItem.y, bestItem.z]);
        openSet.set(nk, { x: nx, y: ny, z: nz, f: tentG + h(nx, ny, nz) });
      }
    }

    frames.push({
      label: `Mở rộng Voxel (${bestItem.x},${bestItem.y},${bestItem.z}) · f = ${bestItem.f}`,
      codeLine: 5,
      octVisited: [...closedArr],
      octFrontier: Array.from(openSet.values()).map((it) => [it.x, it.y, it.z]),
      octPath: [],
      octCurrent: [bestItem.x, bestItem.y, bestItem.z]
    });
  }

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

export const CS3DVisualizer: React.FC<CS3DVisualizerProps> = ({ onBack, initialMode = 'sort_3d' }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode } = useBackgroundTheme();
  const { openModal: openRemoteModal, controllerCount } = useRemoteController();

  const [mode, setMode] = useState<CS3DSimMode>(initialMode);
  const [sortSeed, setSortSeed] = useState<number[]>([7, 3, 9, 2, 6, 4, 8, 5, 1]);
  const [bstTarget, setBstTarget] = useState<number>(46);
  const [sqKind, setSqKind] = useState<'stack' | 'queue'>('stack');
  const [sqItems, setSqItems] = useState<number[]>([12, 25, 38, 44]);
  const [sqLabel, setSqLabel] = useState<string>('Khởi tạo cấu trúc Stack/Queue 3D');
  const [segQuery, setSegQuery] = useState<[number, number]>([1, 5]);
  const [trieWord, setTrieWord] = useState<string>('CODE');

  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMult, setSpeedMult] = useState<0.5 | 1 | 2>(1);
  const [autoOrbit, setAutoOrbit] = useState(false);
  const autoOrbitRef = useRef(false);
  autoOrbitRef.current = autoOrbit;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const resetCamRef = useRef<(() => void) | null>(null);
  const camPresetRef = useRef<((preset: 'iso' | 'top' | 'front') => void) | null>(null);
  const capturePngRef = useRef<(() => void) | null>(null);
  const enteredNativeFsRef = useRef<boolean>(false);

  const { isRecording, seconds: recSeconds, toggleRecording } = useCanvasRecorder(
    () => canvasElRef.current,
    `synapse-cs3d-${mode}`
  );

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const steps: StepFrame[] = useMemo(() => {
    switch (mode) {
      case 'sort_3d':
        return buildQuickSortSteps(sortSeed);
      case 'bst_3d':
        return buildBstSteps(bstTarget);
      case 'graph_3d':
        return buildGraphDijkstraSteps();
      case 'maze_3d':
        return buildMazeBfsSteps();
      case 'segtree_3d':
        return buildSegTreeSteps(segQuery[0], segQuery[1]);
      case 'trie_3d':
        return buildTrieSteps(trieWord);
      case 'dp_table_3d':
        return buildDpTable3DSteps();
      case 'flow_network_3d':
        return buildMaxFlowSteps();
      case 'spatial_octree_3d':
        return buildSpatialOctreeSteps();
      case 'stack_queue_3d':
      default:
        return [
          {
            label: sqLabel,
            codeLine: sqKind === 'stack' ? 1 : 3,
            sqItems,
            sqKind,
            sqHighlightIdx: sqKind === 'stack' ? sqItems.length - 1 : 0
          }
        ];
    }
  }, [bstTarget, mode, segQuery, sortSeed, sqItems, sqKind, sqLabel, trieWord]);

  const safeStepIdx = Math.min(stepIdx, Math.max(0, steps.length - 1));
  const currentFrame = steps[safeStepIdx] || steps[0];
  const frameRef = useRef<StepFrame>(currentFrame);
  frameRef.current = currentFrame;
  const modeRef = useRef<CS3DSimMode>(mode);
  modeRef.current = mode;
  const stepIdxRef = useRef<number>(safeStepIdx);
  stepIdxRef.current = safeStepIdx;

  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(mode !== 'stack_queue_3d');
  }, [mode, sortSeed, bstTarget, segQuery, trieWord]);

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

  // Three.js WebGL 3D Stage (10 Modes with Studio PBR & Soft Shadows)
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
      isSoftwareGl ? 1 : perfMode === 'smooth' ? Math.min(hostDpr, 1.2) : Math.min(hostDpr, 1.5)
    );
    renderer.setSize(container.clientWidth || 760, container.clientHeight || 420);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    canvasElRef.current = renderer.domElement;

    const onLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onRestored = () => setContextLost(false);
    renderer.domElement.addEventListener('webglcontextlost', onLost);
    renderer.domElement.addEventListener('webglcontextrestored', onRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040915);
    scene.fog = new THREE.FogExp2(0x040915, 0.02);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(
      45,
      (container.clientWidth || 760) / (container.clientHeight || 420),
      0.1,
      100
    );
    camera.position.set(0, 4.8, 8.6);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.target.set(0, 1.25, 0);
    controls.update();

    // 3-Point Studio Lighting Rig
    scene.add(new THREE.HemisphereLight(0x93c5fd, 0x0f172a, 0.85));
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(6, 11, 7);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -7;
      keyLight.shadow.camera.right = 7;
      keyLight.shadow.camera.top = 7;
      keyLight.shadow.camera.bottom = -7;
      keyLight.shadow.bias = -0.0006;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 0.95);
    rimLight.position.set(-7, 5, -6);
    scene.add(rimLight);

    // Matte studio pedestal disc + high-precision grid
    const stageDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(8.2, 8.5, 0.08, 48),
      new THREE.MeshStandardMaterial({ color: 0x081022, roughness: 0.72, metalness: 0.25 })
    );
    stageDisc.position.y = -0.05;
    stageDisc.receiveShadow = !isSoftwareGl;
    scene.add(stageDisc);

    const stageRim = new THREE.Mesh(
      new THREE.TorusGeometry(8.2, 0.028, 12, 72),
      new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.55, roughness: 0.25 })
    );
    stageRim.rotation.x = Math.PI / 2;
    stageRim.position.y = -0.01;
    scene.add(stageRim);

    const grid = new THREE.GridHelper(16, 16, 0x10b981, 0x172542);
    grid.position.y = 0.004;
    scene.add(grid);

    const edgeCylGeo = new THREE.CylinderGeometry(0.036, 0.036, 1, 10);

    // Post-processing (Bloom + SMAA) — bypassed on software WebGL or smooth mode
    let pipeline: PostProcessPipeline | null = null;
    if (!isSoftwareGl && perfMode !== 'smooth') {
      try {
        pipeline = createPostProcessingPipeline(renderer, scene, camera, {
          bloomIntensity: 0.44,
          luminanceThreshold: 0.78,
          enableSmaa: true,
        });
        pipeline.setSize(container.clientWidth || 760, container.clientHeight || 420);
      } catch {
        pipeline = null;
      }
    }

    // Bounded GPU Instanced Particle Pool & Packet Traversal Orb/Trail
    const csParticlePool = new GPUParticlePool(84, 0.055, 0x10b981, 0x059669);
    scene.add(csParticlePool.mesh);

    const csPacketOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 14, 12),
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfbbf24,
        emissiveIntensity: 1.6,
        roughness: 0.15,
      })
    );
    csPacketOrb.visible = false;
    scene.add(csPacketOrb);
    const csPacketTrail = new OptimizedTrail(48, 0xfbbf24, 0.88);
    scene.add(csPacketTrail.line);

    // Pre-allocated Troika 3D label helper (updates text worker ONLY when text changes)
    type TroikaLbl = ReturnType<typeof createTroikaLabel>;
    const setTroikaLabel = (
      lbl: TroikaLbl | undefined,
      text: string,
      x: number,
      y: number,
      z: number,
      colorHex = 0xf8fafc,
      visible = true
    ) => {
      if (!lbl) return;
      lbl.visible = visible;
      if (!visible) return;
      lbl.position.set(x, y, z);
      if (lbl.userData.lastColor !== colorHex) {
        lbl.color = colorHex;
        lbl.userData.lastColor = colorHex;
      }
      if (lbl.userData.lastText !== text) {
        lbl.text = text;
        lbl.userData.lastText = text;
        lbl.sync();
      }
    };

    // ---------------------------------------------------------
    // 1. SORTING PILLARS (with metallic cap collar)
    // ---------------------------------------------------------
    const sortGroup = new THREE.Group();
    scene.add(sortGroup);
    const pillarMats: THREE.MeshPhysicalMaterial[] = [];
    const pillarMeshes: THREE.Mesh[] = [];
    const capGeo = new THREE.BoxGeometry(0.6, 0.08, 0.6);
    const capMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.14,
      clearcoat: 0.9
    });
    const pillarCaps: THREE.Mesh[] = [];
    for (let i = 0; i < 12; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.16,
        metalness: 0.48,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08
      });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.54, 1, 0.54), mat);
      mesh.castShadow = !isSoftwareGl;
      mesh.receiveShadow = !isSoftwareGl;
      const cap = new THREE.Mesh(capGeo, capMat);
      sortGroup.add(mesh, cap);
      pillarMats.push(mat);
      pillarMeshes.push(mesh);
      pillarCaps.push(cap);
    }
    const sortLabels: TroikaLbl[] = Array.from({ length: 12 }, () => {
      const lbl = createTroikaLabel({ text: '', fontSize: 0.3, color: 0xf8fafc });
      lbl.visible = false;
      sortGroup.add(lbl);
      return lbl;
    });

    // ---------------------------------------------------------
    // 2. BST 3D GROUP (with glowing CylinderGeometry edges & halo)
    // ---------------------------------------------------------
    const bstGroup = new THREE.Group();
    scene.add(bstGroup);
    const bstNodeMeshes: THREE.Mesh[] = [];
    const bstNodeMats: THREE.MeshPhysicalMaterial[] = [];
    const bstEdgeMeshes: THREE.Mesh[] = [];
    const bstEdgeMats: THREE.MeshStandardMaterial[] = [];
    const bstHalo = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.035, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 1.2 })
    );
    bstHalo.visible = false;
    bstGroup.add(bstHalo);

    for (let i = 0; i < 18; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35,
        roughness: 0.15,
        metalness: 0.65,
        clearcoat: 1.0
      });
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 20), mat);
      s.castShadow = !isSoftwareGl;
      s.visible = false;
      bstGroup.add(s);
      bstNodeMeshes.push(s);
      bstNodeMats.push(mat);

      const eMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.3 });
      const edgeMesh = new THREE.Mesh(edgeCylGeo, eMat);
      edgeMesh.visible = false;
      bstGroup.add(edgeMesh);
      bstEdgeMeshes.push(edgeMesh);
      bstEdgeMats.push(eMat);
    }
    const bstLabels: TroikaLbl[] = Array.from({ length: 18 }, () => {
      const lbl = createTroikaLabel({ text: '', fontSize: 0.24, color: 0xe2e8f0 });
      lbl.visible = false;
      bstGroup.add(lbl);
      return lbl;
    });

    // ---------------------------------------------------------
    // 3. GRAPH 3D GROUP (3D Cylinder edges + glowing nodes)
    // ---------------------------------------------------------
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);
    const gNodeMeshes: THREE.Mesh[] = [];
    const gNodeMats: THREE.MeshPhysicalMaterial[] = [];
    GRAPH_NODES_3D.forEach(([x, y, z]) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4,
        roughness: 0.16,
        metalness: 0.72,
        clearcoat: 1.0
      });
      const sp = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 20), mat);
      sp.position.set(x, y, z);
      sp.castShadow = !isSoftwareGl;
      graphGroup.add(sp);
      gNodeMeshes.push(sp);
      gNodeMats.push(mat);
    });
    const gEdgeMeshes: { u: number; v: number; mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial }[] = [];
    GRAPH_EDGES_3D.forEach(([u, v]) => {
      const mat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.55, roughness: 0.3 });
      const mesh = new THREE.Mesh(edgeCylGeo, mat);
      const [ax, ay, az] = GRAPH_NODES_3D[u];
      const [bx, by, bz] = GRAPH_NODES_3D[v];
      alignCylinderEdge(mesh, ax, ay, az, bx, by, bz, 1.2);
      graphGroup.add(mesh);
      gEdgeMeshes.push({ u, v, mesh, mat });
    });
    const graphLabels: TroikaLbl[] = GRAPH_NODES_3D.map(([x, y, z], idx) => {
      const lbl = createTroikaLabel({
        text: `${idx}:∞`,
        position: [x, y + 0.56, z],
        fontSize: 0.25,
        color: 0xe0f2fe,
      });
      lbl.userData.lastText = `${idx}:∞`;
      graphGroup.add(lbl);
      return lbl;
    });

    // ---------------------------------------------------------
    // 4. MAZE 3D GROUP (glass walls + levitating beacon)
    // ---------------------------------------------------------
    const mazeGroup = new THREE.Group();
    scene.add(mazeGroup);
    const mazeTiles: THREE.Mesh[][] = [];
    const mazeTileMats: THREE.MeshPhysicalMaterial[][] = [];
    for (let r = 0; r < 7; r++) {
      const rowM: THREE.Mesh[] = [];
      const rowMat: THREE.MeshPhysicalMaterial[] = [];
      for (let c = 0; c < 7; c++) {
        const isWall = MAZE_WALLS[r][c] === 1;
        const mat = new THREE.MeshPhysicalMaterial({
          color: isWall ? 0x334155 : 0x0f172a,
          roughness: isWall ? 0.2 : 0.32,
          metalness: isWall ? 0.35 : 0.45,
          clearcoat: isWall ? 0.9 : 0.5,
          transparent: isWall,
          opacity: isWall ? 0.85 : 1
        });
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.74, isWall ? 0.92 : 0.16, 0.74), mat);
        box.position.set((c - 3) * 0.84, isWall ? 0.46 : 0.08, (r - 3) * 0.84);
        box.castShadow = !isSoftwareGl && isWall;
        box.receiveShadow = !isSoftwareGl;
        mazeGroup.add(box);
        rowM.push(box);
        rowMat.push(mat);
      }
      mazeTiles.push(rowM);
      mazeTileMats.push(rowMat);
    }
    const mazeStartRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.032, 10, 28),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x06b6d4, emissiveIntensity: 0.9 })
    );
    mazeStartRing.rotation.x = Math.PI / 2;
    mazeStartRing.position.set(-3 * 0.84, 0.22, -3 * 0.84);
    const mazeGoalRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.036, 10, 28),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 1.0 })
    );
    mazeGoalRing.rotation.x = Math.PI / 2;
    mazeGoalRing.position.set(3 * 0.84, 0.22, 3 * 0.84);
    const mazeStartLbl = createTroikaLabel({
      text: 'START',
      position: [-3 * 0.84, 0.62, -3 * 0.84],
      fontSize: 0.26,
      color: 0x22d3ee,
    });
    const mazeGoalLbl = createTroikaLabel({
      text: 'GOAL',
      position: [3 * 0.84, 0.62, 3 * 0.84],
      fontSize: 0.26,
      color: 0xfbbf24,
    });
    mazeGroup.add(mazeStartRing, mazeGoalRing, mazeStartLbl, mazeGoalLbl);

    // ---------------------------------------------------------
    // 5. STACK / QUEUE 3D GROUP
    // ---------------------------------------------------------
    const sqGroup = new THREE.Group();
    scene.add(sqGroup);
    const sqSpindle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 3.8, 18),
      new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15, clearcoat: 0.7 })
    );
    sqSpindle.position.set(0, 1.9, 0);
    sqGroup.add(sqSpindle);
    const sqBoxes: THREE.Mesh[] = [];
    const sqMats: THREE.MeshPhysicalMaterial[] = [];
    for (let i = 0; i < 10; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        roughness: 0.15,
        metalness: 0.55,
        clearcoat: 1.0
      });
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.46, 0.78), mat);
      b.castShadow = !isSoftwareGl;
      b.visible = false;
      sqGroup.add(b);
      sqBoxes.push(b);
      sqMats.push(mat);
    }
    const sqLabels: TroikaLbl[] = Array.from({ length: 10 }, () => {
      const lbl = createTroikaLabel({ text: '', fontSize: 0.27, color: 0xf8fafc });
      lbl.visible = false;
      sqGroup.add(lbl);
      return lbl;
    });

    // ---------------------------------------------------------
    // 6. SEGMENT TREE 3D GROUP (15 tree blocks + cylinder links)
    // ---------------------------------------------------------
    const segGroup = new THREE.Group();
    scene.add(segGroup);
    const segNodeMeshes: THREE.Mesh[] = [];
    const segNodeMats: THREE.MeshPhysicalMaterial[] = [];
    const segEdgeMeshes: THREE.Mesh[] = [];
    const segEdgeMats: THREE.MeshStandardMaterial[] = [];
    for (let i = 0; i < 15; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.18,
        metalness: 0.55,
        clearcoat: 0.9
      });
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.38, 0.38), mat);
      box.castShadow = !isSoftwareGl;
      segGroup.add(box);
      segNodeMeshes.push(box);
      segNodeMats.push(mat);

      const eMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.35 });
      const em = new THREE.Mesh(edgeCylGeo, eMat);
      em.visible = false;
      segGroup.add(em);
      segEdgeMeshes.push(em);
      segEdgeMats.push(eMat);
    }
    const segLabels: TroikaLbl[] = Array.from({ length: 15 }, () => {
      const lbl = createTroikaLabel({ text: '', fontSize: 0.2, color: 0xe2e8f0 });
      lbl.visible = false;
      segGroup.add(lbl);
      return lbl;
    });

    // ---------------------------------------------------------
    // 7. TRIE 3D GROUP (up to 24 prefix nodes + crown ring)
    // ---------------------------------------------------------
    const trieGroup = new THREE.Group();
    scene.add(trieGroup);
    const trieNodeMeshes: THREE.Mesh[] = [];
    const trieNodeMats: THREE.MeshPhysicalMaterial[] = [];
    const trieEdgeMeshes: THREE.Mesh[] = [];
    const trieEdgeMats: THREE.MeshStandardMaterial[] = [];
    const trieEndRings: THREE.Mesh[] = [];
    for (let i = 0; i < 24; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.16,
        metalness: 0.65,
        clearcoat: 1.0
      });
      const sp = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 1), mat);
      sp.castShadow = !isSoftwareGl;
      sp.visible = false;
      trieGroup.add(sp);
      trieNodeMeshes.push(sp);
      trieNodeMats.push(mat);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.32, 0.032, 10, 24),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.7 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.visible = false;
      trieGroup.add(ring);
      trieEndRings.push(ring);

      const eMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.5, roughness: 0.3 });
      const em = new THREE.Mesh(edgeCylGeo, eMat);
      em.visible = false;
      trieGroup.add(em);
      trieEdgeMeshes.push(em);
      trieEdgeMats.push(eMat);
    }
    const trieLabels: TroikaLbl[] = Array.from({ length: 24 }, () => {
      const lbl = createTroikaLabel({ text: '', fontSize: 0.23, color: 0xf8fafc });
      lbl.visible = false;
      trieGroup.add(lbl);
      return lbl;
    });

    // ---------------------------------------------------------
    // 8. DP TABLE 3D ELEVATION GRID (5 x 8 = 40 clearcoat blocks)
    // ---------------------------------------------------------
    const dpGroup = new THREE.Group();
    scene.add(dpGroup);
    const dpCells: THREE.Mesh[][] = [];
    const dpMats: THREE.MeshPhysicalMaterial[][] = [];
    for (let i = 0; i < 5; i++) {
      const rowM: THREE.Mesh[] = [];
      const rowMat: THREE.MeshPhysicalMaterial[] = [];
      for (let w = 0; w < 8; w++) {
        const mat = new THREE.MeshPhysicalMaterial({
          color: 0x1e293b,
          roughness: 0.16,
          metalness: 0.55,
          clearcoat: 1.0
        });
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.64, 1, 0.64), mat);
        box.position.set((w - 3.5) * 0.78, 0.1, (i - 2) * 0.84);
        box.castShadow = !isSoftwareGl;
        box.receiveShadow = !isSoftwareGl;
        dpGroup.add(box);
        rowM.push(box);
        rowMat.push(mat);
      }
      dpCells.push(rowM);
      dpMats.push(rowMat);
    }
    const dpFocusLbl = createTroikaLabel({ text: '', fontSize: 0.28, color: 0xfef08a });
    dpFocusLbl.visible = false;
    dpGroup.add(dpFocusLbl);

    // ---------------------------------------------------------
    // 9. FLOW NETWORK 3D (6 nodes + dual-layer glass/flow pipes)
    // ---------------------------------------------------------
    const flowGroup = new THREE.Group();
    scene.add(flowGroup);
    const flowNodeMeshes: THREE.Mesh[] = [];
    const flowNodeMats: THREE.MeshPhysicalMaterial[] = [];
    FLOW_NODES_3D.forEach(([x, y, z], idx) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: idx === 0 ? 0x0ea5e9 : idx === 5 ? 0xf59e0b : 0x64748b,
        emissive: idx === 0 ? 0x0284c7 : idx === 5 ? 0xd97706 : 0x1e293b,
        emissiveIntensity: 0.45,
        roughness: 0.15,
        metalness: 0.72,
        clearcoat: 1.0
      });
      const sp = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 20), mat);
      sp.position.set(x, y, z);
      sp.castShadow = !isSoftwareGl;
      flowGroup.add(sp);
      flowNodeMeshes.push(sp);
      flowNodeMats.push(mat);
    });
    const flowCoreCylGeo = new THREE.CylinderGeometry(0.095, 0.095, 1, 12);
    const flowOuterCylGeo = new THREE.CylinderGeometry(0.145, 0.145, 1, 14);
    const flowPipes: { u: number; v: number; cap: number; core: THREE.Mesh; coreMat: THREE.MeshStandardMaterial; outerMat: THREE.MeshPhysicalMaterial }[] = [];
    FLOW_BASE_EDGES.forEach(({ u, v, cap }) => {
      const outerMat = new THREE.MeshPhysicalMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.22,
        roughness: 0.08,
        clearcoat: 1.0,
        depthWrite: false
      });
      const outer = new THREE.Mesh(flowOuterCylGeo, outerMat);
      const [ax, ay, az] = FLOW_NODES_3D[u];
      const [bx, by, bz] = FLOW_NODES_3D[v];
      alignCylinderEdge(outer, ax, ay, az, bx, by, bz, 1);

      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.65,
        roughness: 0.25
      });
      const core = new THREE.Mesh(flowCoreCylGeo, coreMat);
      alignCylinderEdge(core, ax, ay, az, bx, by, bz, 0.2);
      flowGroup.add(outer, core);
      flowPipes.push({ u, v, cap, core, coreMat, outerMat });
    });
    const flowNodeLabels: TroikaLbl[] = FLOW_NODES_3D.map(([x, y, z], idx) => {
      const txt = idx === 0 ? 'S' : idx === 5 ? 'T' : `N${idx}`;
      const lbl = createTroikaLabel({
        text: txt,
        position: [x, y + 0.56, z],
        fontSize: 0.26,
        color: idx === 0 ? 0x38bdf8 : idx === 5 ? 0xfbbf24 : 0xe2e8f0,
      });
      lbl.userData.lastText = txt;
      flowGroup.add(lbl);
      return lbl;
    });
    const flowEdgeLabels: TroikaLbl[] = FLOW_BASE_EDGES.map(({ u, v, cap }) => {
      const [ax, ay, az] = FLOW_NODES_3D[u];
      const [bx, by, bz] = FLOW_NODES_3D[v];
      const txt = `0/${cap}`;
      const lbl = createTroikaLabel({
        text: txt,
        position: [(ax + bx) * 0.5, (ay + by) * 0.5 + 0.24, (az + bz) * 0.5],
        fontSize: 0.19,
        color: 0xa7f3d0,
      });
      lbl.userData.lastText = txt;
      flowGroup.add(lbl);
      return lbl;
    });

    // ---------------------------------------------------------
    // 10. SPATIAL OCTREE A* 3D VOXEL LATTICE (4x4x4)
    // ---------------------------------------------------------
    const octGroup = new THREE.Group();
    scene.add(octGroup);
    const octFrame = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3.8, 3.8, 3.8)),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
    );
    octFrame.position.set(0, 2.0, 0);
    octGroup.add(octFrame);

    const octBoxGeo = new THREE.BoxGeometry(0.56, 0.56, 0.56);
    const octVoxels: Map<string, { mesh: THREE.Mesh; mat: THREE.MeshPhysicalMaterial; isObs: boolean }> = new Map();
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        for (let z = 0; z < 4; z++) {
          const k = `${x},${y},${z}`;
          const isObs = OCTREE_OBSTACLES.has(k);
          const mat = new THREE.MeshPhysicalMaterial({
            color: isObs ? 0x334155 : 0x0f172a,
            transparent: !isObs,
            opacity: isObs ? 0.92 : 0.12,
            roughness: isObs ? 0.22 : 0.1,
            metalness: isObs ? 0.45 : 0.15,
            clearcoat: 0.85
          });
          const mesh = new THREE.Mesh(octBoxGeo, mat);
          mesh.position.set((x - 1.5) * 0.9, 0.65 + y * 0.9, (z - 1.5) * 0.9);
          mesh.castShadow = !isSoftwareGl && isObs;
          octGroup.add(mesh);
          octVoxels.set(k, { mesh, mat, isObs });
        }
      }
    }
    const octStartHalo = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.028, 10, 28),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x06b6d4, emissiveIntensity: 0.9 })
    );
    octStartHalo.position.set(-1.5 * 0.9, 0.65, -1.5 * 0.9);
    const octGoalHalo = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.028, 10, 28),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 1.0 })
    );
    octGoalHalo.position.set(1.5 * 0.9, 0.65 + 3 * 0.9, 1.5 * 0.9);
    const octStartLbl = createTroikaLabel({
      text: 'S(0,0,0)',
      position: [-1.5 * 0.9, 1.15, -1.5 * 0.9],
      fontSize: 0.22,
      color: 0x22d3ee,
    });
    const octGoalLbl = createTroikaLabel({
      text: 'G(3,3,3)',
      position: [1.5 * 0.9, 0.65 + 3 * 0.9 + 0.52, 1.5 * 0.9],
      fontSize: 0.22,
      color: 0xfbbf24,
    });
    octGroup.add(octStartHalo, octGoalHalo, octStartLbl, octGoalLbl);

    resetCamRef.current = () => {
      camera.position.set(0, 4.8, 8.6);
      controls.target.set(0, 1.25, 0);
      controls.update();
    };

    camPresetRef.current = (preset) => {
      if (preset === 'iso') {
        camera.position.set(5.4, 5.2, 7.6);
      } else if (preset === 'top') {
        camera.position.set(0.01, 10.6, 0.01);
      } else {
        camera.position.set(0, 3.1, 9.8);
      }
      controls.target.set(0, 1.25, 0);
      camera.updateProjectionMatrix();
      controls.update();
    };

    capturePngRef.current = () => {
      updateBillboardLabels(scene, camera);
      if (pipeline) pipeline.render(0);
      else renderer.render(scene, camera);
      captureCanvasPng(renderer.domElement, `synapse-cs3d-${modeRef.current}-${Date.now()}.png`);
    };

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth || 760;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      pipeline?.setSize(w, h);
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

    let lastStepSig = '';
    let lastTrailMode: CS3DSimMode | '' = '';

    const tick = () => {
      if (!alive) return;
      if (typeof document !== 'undefined' && document.hidden) {
        clock.getDelta();
        if (isSoftwareGl) afterDraw(tick);
        else rafId = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min(0.05, clock.getDelta());
      const tNow = clock.elapsedTime;
      const m = modeRef.current;
      const f = frameRef.current;
      const stepSig = `${m}|${stepIdxRef.current}|${f.label}`;
      const stepChanged = stepSig !== lastStepSig;
      if (stepChanged) lastStepSig = stepSig;

      if (m !== lastTrailMode) {
        csPacketTrail.clear();
        csPacketOrb.visible = false;
        lastTrailMode = m;
      }

      sortGroup.visible = m === 'sort_3d';
      bstGroup.visible = m === 'bst_3d';
      graphGroup.visible = m === 'graph_3d';
      mazeGroup.visible = m === 'maze_3d';
      sqGroup.visible = m === 'stack_queue_3d';
      segGroup.visible = m === 'segtree_3d';
      trieGroup.visible = m === 'trie_3d';
      dpGroup.visible = m === 'dp_table_3d';
      flowGroup.visible = m === 'flow_network_3d';
      octGroup.visible = m === 'spatial_octree_3d';

      let packetShown = false;

      if (m === 'sort_3d' && f.arr) {
        const arr = f.arr;
        const sortedSet = new Set(f.sortedIdx || []);
        const [ci, cj] = f.compareIdx || [-1, -1];
        for (let i = 0; i < pillarMeshes.length; i++) {
          const mesh = pillarMeshes[i];
          const cap = pillarCaps[i];
          const mat = pillarMats[i];
          if (i >= arr.length) {
            mesh.visible = false;
            cap.visible = false;
            setTroikaLabel(sortLabels[i], '', 0, 0, 0, 0xf8fafc, false);
            continue;
          }
          mesh.visible = true;
          cap.visible = true;
          const h = Math.max(0.35, arr[i] * 0.35);
          const tx = (i - (arr.length - 1) / 2) * 0.78;
          mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, h, 14, dt);
          mesh.position.x = THREE.MathUtils.damp(mesh.position.x, tx, 14, dt);
          const swapDist = Math.abs(tx - mesh.position.x);
          const targetZ = swapDist > 0.04 ? Math.sin(Math.min(1, swapDist / 0.85) * Math.PI) * 0.52 * (i % 2 === 0 ? 1 : -1) : 0;
          mesh.position.z = THREE.MathUtils.damp(mesh.position.z, targetZ, 14, dt);
          mesh.position.y = mesh.scale.y * 0.5;
          cap.position.set(mesh.position.x, mesh.scale.y + 0.04, mesh.position.z);

          let lblColor = 0xe2e8f0;
          if (f.pivotIdx === i) {
            mat.color.setHex(0xf59e0b);
            mat.emissive.setHex(0xd97706);
            mat.emissiveIntensity = 0.72;
            lblColor = 0xfef08a;
          } else if (i === ci || i === cj) {
            mat.color.setHex(0xf43f5e);
            mat.emissive.setHex(0xe11d48);
            mat.emissiveIntensity = 0.85;
            lblColor = 0xfda4af;
            if (stepChanged) {
              for (let s = 0; s < 3; s++) {
                csParticlePool.spawn(
                  mesh.position.x,
                  mesh.scale.y + 0.15,
                  mesh.position.z,
                  (Math.random() - 0.5) * 1.4,
                  0.9 + Math.random() * 1.1,
                  (Math.random() - 0.5) * 1.4,
                  0.65,
                  0.9,
                  0xf43f5e
                );
              }
            }
          } else if (sortedSet.has(i)) {
            mat.color.setHex(0x10b981);
            mat.emissive.setHex(0x059669);
            mat.emissiveIntensity = 0.45;
            lblColor = 0x6ee7b7;
          } else {
            mat.color.setHex(0x38bdf8);
            mat.emissive.setHex(0x0284c7);
            mat.emissiveIntensity = 0.22;
          }
          setTroikaLabel(sortLabels[i], String(arr[i]), mesh.position.x, mesh.scale.y + 0.34, mesh.position.z, lblColor, true);
        }
      } else if (m === 'bst_3d' && f.bstNodes) {
        const activeSet = new Set(f.bstActive || []);
        bstGroup.rotation.y = Math.sin(tNow * 0.35) * 0.12;
        bstHalo.visible = false;
        for (let i = 0; i < bstNodeMeshes.length; i++) {
          const bn = f.bstNodes[i];
          const sp = bstNodeMeshes[i];
          const mat = bstNodeMats[i];
          const edge = bstEdgeMeshes[i];
          const eMat = bstEdgeMats[i];
          if (!sp) continue;
          if (!bn) {
            sp.visible = false;
            edge.visible = false;
            setTroikaLabel(bstLabels[i], '', 0, 0, 0, 0xe2e8f0, false);
            continue;
          }
          sp.visible = true;
          sp.position.set(bn.x, bn.y, bn.z);
          let lblCol = 0xe2e8f0;
          if (f.bstFound === i) {
            mat.color.setHex(0x10b981);
            mat.emissive.setHex(0x10b981);
            mat.emissiveIntensity = 1.35;
            bstHalo.visible = true;
            bstHalo.position.set(bn.x, bn.y, bn.z);
            bstHalo.rotation.x = tNow * 1.6;
            bstHalo.rotation.y = tNow * 1.1;
            lblCol = 0x6ee7b7;
            if (stepChanged) {
              for (let s = 0; s < 8; s++) {
                csParticlePool.spawn(bn.x, bn.y, bn.z, (Math.random() - 0.5) * 2.2, (Math.random() - 0.2) * 2.0, (Math.random() - 0.5) * 2.2, 0.85, 1.0, 0x10b981);
              }
            }
          } else if (activeSet.has(i)) {
            mat.color.setHex(0xfbbf24);
            mat.emissive.setHex(0xf59e0b);
            mat.emissiveIntensity = 0.95;
            lblCol = 0xfef08a;
            if (stepChanged) {
              csParticlePool.spawn(bn.x, bn.y + 0.1, bn.z, (Math.random() - 0.5) * 1.1, 0.8, (Math.random() - 0.5) * 1.1, 0.65, 0.85, 0xfbbf24);
            }
          } else {
            mat.color.setHex(0x38bdf8);
            mat.emissive.setHex(0x0284c7);
            mat.emissiveIntensity = 0.28;
          }
          setTroikaLabel(bstLabels[i], String(bn.val), bn.x, bn.y + 0.42, bn.z, lblCol, true);

          if (bn.parentIdx >= 0 && f.bstNodes[bn.parentIdx]) {
            const p = f.bstNodes[bn.parentIdx];
            edge.visible = true;
            const hot = activeSet.has(i) && activeSet.has(bn.parentIdx);
            alignCylinderEdge(edge, p.x, p.y, p.z, bn.x, bn.y, bn.z, hot ? 1.4 : 0.85);
            eMat.color.setHex(hot ? 0xfbbf24 : 0x334155);
            eMat.emissive.setHex(hot ? 0xd97706 : 0x000000);
            eMat.emissiveIntensity = hot ? 0.65 : 0;
          } else {
            edge.visible = false;
          }
        }
      } else if (m === 'graph_3d') {
        const vis = f.graphVisited || [];
        const dists = f.graphDist || [];
        gNodeMeshes.forEach((sp, i) => {
          const mat = gNodeMats[i];
          const [nx, ny, nz] = GRAPH_NODES_3D[i];
          const d = dists[i];
          const dStr = d === undefined || d >= 999 || !Number.isFinite(d) ? '∞' : String(d);
          let lblCol = 0xe0f2fe;
          if (f.graphCurrent === i) {
            mat.color.setHex(0xf59e0b);
            mat.emissive.setHex(0xf59e0b);
            mat.emissiveIntensity = 1.25;
            sp.scale.setScalar(1.18 + Math.sin(tNow * 5) * 0.06);
            lblCol = 0xfef08a;
            if (stepChanged) {
              for (let s = 0; s < 5; s++) {
                csParticlePool.spawn(nx, ny + 0.15, nz, (Math.random() - 0.5) * 1.6, 0.7 + Math.random(), (Math.random() - 0.5) * 1.6, 0.75, 0.95, 0xfbbf24);
              }
            }
          } else if (vis[i]) {
            mat.color.setHex(0x10b981);
            mat.emissive.setHex(0x059669);
            mat.emissiveIntensity = 0.72;
            sp.scale.setScalar(1);
            lblCol = 0x6ee7b7;
          } else {
            mat.color.setHex(0x38bdf8);
            mat.emissive.setHex(0x0284c7);
            mat.emissiveIntensity = 0.28;
            sp.scale.setScalar(0.95);
          }
          setTroikaLabel(graphLabels[i], `${i}: ${dStr}`, nx, ny + 0.56, nz, lblCol, true);
        });
        gEdgeMeshes.forEach(({ u, v, mesh, mat }) => {
          const act = f.graphActiveEdge;
          const isAct = act && ((act[0] === u && act[1] === v) || (act[0] === v && act[1] === u));
          const bothVis = vis[u] && vis[v];
          mat.color.setHex(isAct ? 0xfbbf24 : bothVis ? 0x10b981 : 0x475569);
          mat.emissive.setHex(isAct ? 0xf59e0b : bothVis ? 0x059669 : 0x000000);
          mat.emissiveIntensity = isAct ? 0.9 : bothVis ? 0.4 : 0;
          const [ax, ay, az] = GRAPH_NODES_3D[u];
          const [bx, by, bz] = GRAPH_NODES_3D[v];
          alignCylinderEdge(mesh, ax, ay, az, bx, by, bz, isAct ? 1.7 : bothVis ? 1.3 : 0.9);
        });

        if (f.graphActiveEdge) {
          const [u, v] = f.graphActiveEdge;
          const a = GRAPH_NODES_3D[u];
          const b = GRAPH_NODES_3D[v];
          if (a && b) {
            const p = (tNow * 1.45) % 1;
            const px = THREE.MathUtils.lerp(a[0], b[0], p);
            const py = THREE.MathUtils.lerp(a[1], b[1], p);
            const pz = THREE.MathUtils.lerp(a[2], b[2], p);
            csPacketOrb.visible = true;
            csPacketOrb.position.set(px, py, pz);
            if (p < 0.06) csPacketTrail.clear();
            csPacketTrail.pushAndRender(px, py, pz, camera, 0.01, 30);
            packetShown = true;
          }
        }
      } else if (m === 'maze_3d') {
        const vis = f.mazeVisited || [];
        const frontSet = new Set((f.mazeFrontier || []).map(([r, c]) => `${r},${c}`));
        const pathSet = new Set((f.mazePath || []).map(([r, c]) => `${r},${c}`));
        mazeStartRing.rotation.z = tNow * 1.2;
        mazeGoalRing.rotation.z = -tNow * 1.5;
        for (let r = 0; r < 7; r++) {
          for (let c = 0; c < 7; c++) {
            const tile = mazeTiles[r][c];
            const mat = mazeTileMats[r][c];
            if (MAZE_WALLS[r][c] === 1) continue;
            const keyStr = `${r},${c}`;
            if (pathSet.has(keyStr)) {
              mat.color.setHex(0xfbbf24);
              mat.emissive.setHex(0xf59e0b);
              mat.emissiveIntensity = 1.05;
              tile.position.y = THREE.MathUtils.damp(tile.position.y, 0.24, 12, dt);
            } else if (frontSet.has(keyStr)) {
              mat.color.setHex(0x22d3ee);
              mat.emissive.setHex(0x06b6d4);
              mat.emissiveIntensity = 0.85;
              tile.position.y = THREE.MathUtils.damp(tile.position.y, 0.16, 12, dt);
              if (stepChanged) {
                csParticlePool.spawn(tile.position.x, 0.35, tile.position.z, (Math.random() - 0.5) * 0.9, 1.1, (Math.random() - 0.5) * 0.9, 0.55, 0.8, 0x22d3ee);
              }
            } else if (vis[r]?.[c]) {
              mat.color.setHex(0x10b981);
              mat.emissive.setHex(0x059669);
              mat.emissiveIntensity = 0.38;
              tile.position.y = THREE.MathUtils.damp(tile.position.y, 0.1, 12, dt);
            } else {
              mat.color.setHex(0x0f172a);
              mat.emissive.setHex(0x000000);
              mat.emissiveIntensity = 0;
              tile.position.y = 0.08;
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
            setTroikaLabel(sqLabels[i], '', 0, 0, 0, 0xf8fafc, false);
            return;
          }
          b.visible = true;
          const isHot = i === f.sqHighlightIdx;
          const tx = isStack ? 0 : (i - (f.sqItems!.length - 1) / 2) * 1.32;
          const hoverY = isHot ? Math.sin(tNow * 3.8) * 0.08 : 0;
          const ty = (isStack ? 0.35 + i * 0.55 : 0.45) + hoverY;
          b.position.x = THREE.MathUtils.damp(b.position.x, tx, 12, dt);
          b.position.y = THREE.MathUtils.damp(b.position.y, ty, 12, dt);
          b.scale.setScalar(isHot ? 1.07 + Math.sin(tNow * 4.5) * 0.04 : 1.0);
          mat.color.setHex(isHot ? 0xfbbf24 : isStack ? 0x10b981 : 0x38bdf8);
          mat.emissive.setHex(isHot ? 0xd97706 : 0x0f172a);
          mat.emissiveIntensity = isHot ? 0.8 + Math.sin(tNow * 4.5) * 0.15 : 0.18;
          if (isHot && stepChanged) {
            for (let s = 0; s < 5; s++) {
              csParticlePool.spawn(b.position.x, b.position.y + 0.25, 0, (Math.random() - 0.5) * 1.4, 0.9 + Math.random(), (Math.random() - 0.5) * 1.4, 0.65, 0.85, 0xfbbf24);
            }
          }
          setTroikaLabel(sqLabels[i], String(f.sqItems![i]), b.position.x, b.position.y, 0.52, isHot ? 0xfef08a : 0xf8fafc, true);
        });
      } else if (m === 'segtree_3d' && f.segNodes) {
        f.segNodes.forEach((nd, i) => {
          const box = segNodeMeshes[i];
          const mat = segNodeMats[i];
          const edge = segEdgeMeshes[i];
          const eMat = segEdgeMats[i];
          if (!box) return;
          const hoverSeg = nd.status === 'cover' || nd.status === 'split' ? Math.sin(tNow * 3.4 + i * 0.6) * 0.05 : 0;
          box.position.set(nd.x, nd.y + hoverSeg, nd.z);
          let lblCol = 0xe2e8f0;
          if (nd.status === 'cover') {
            mat.color.setHex(0x10b981);
            mat.emissive.setHex(0x059669);
            mat.emissiveIntensity = 0.95 + Math.sin(tNow * 4 + i) * 0.18;
            box.scale.setScalar(1.12 + Math.sin(tNow * 3.5 + i) * 0.04);
            lblCol = 0x6ee7b7;
            if (stepChanged) {
              csParticlePool.spawn(nd.x, nd.y + 0.15, nd.z, (Math.random() - 0.5) * 1.0, 0.9, (Math.random() - 0.5) * 1.0, 0.6, 0.85, 0x10b981);
            }
          } else if (nd.status === 'split') {
            mat.color.setHex(0xfbbf24);
            mat.emissive.setHex(0xd97706);
            mat.emissiveIntensity = 0.78 + Math.sin(tNow * 3.5 + i) * 0.15;
            box.scale.setScalar(1.06 + Math.sin(tNow * 3 + i) * 0.03);
            lblCol = 0xfef08a;
          } else if (nd.status === 'skip') {
            mat.color.setHex(0xf43f5e);
            mat.emissive.setHex(0x9f1239);
            mat.emissiveIntensity = 0.5;
            box.scale.setScalar(0.92);
            lblCol = 0xfda4af;
          } else {
            mat.color.setHex(0x38bdf8);
            mat.emissive.setHex(0x0284c7);
            mat.emissiveIntensity = 0.25;
            box.scale.setScalar(1.0);
          }
          setTroikaLabel(segLabels[i], `[${nd.l},${nd.r}]=${nd.val}`, nd.x, nd.y + 0.36, nd.z + 0.1, lblCol, true);

          if (nd.parentIdx >= 0 && f.segNodes![nd.parentIdx]) {
            const p = f.segNodes![nd.parentIdx];
            edge.visible = true;
            const lit = nd.status === 'cover' || nd.status === 'split';
            alignCylinderEdge(edge, p.x, p.y, p.z, nd.x, nd.y, nd.z, lit ? 1.25 : 0.75);
            eMat.color.setHex(nd.status === 'cover' ? 0x10b981 : nd.status === 'split' ? 0xfbbf24 : 0x334155);
          } else {
            edge.visible = false;
          }
        });
      } else if (m === 'trie_3d' && f.trieNodes) {
        const activeSet = new Set(f.trieActivePath || []);
        trieGroup.rotation.y = Math.sin(tNow * 0.3) * 0.14;
        for (let i = 0; i < trieNodeMeshes.length; i++) {
          const sp = trieNodeMeshes[i];
          const mat = trieNodeMats[i];
          const ring = trieEndRings[i];
          const edge = trieEdgeMeshes[i];
          const eMat = trieEdgeMats[i];
          const nd = f.trieNodes[i];
          if (!nd) {
            sp.visible = false;
            ring.visible = false;
            edge.visible = false;
            setTroikaLabel(trieLabels[i], '', 0, 0, 0, 0xf8fafc, false);
            continue;
          }
          sp.visible = true;
          sp.position.set(nd.x, nd.y, nd.z);
          sp.rotation.y = tNow * 0.8 + i * 0.2;
          ring.visible = nd.isEnd;
          ring.position.set(nd.x, nd.y, nd.z);
          let lblCol = 0xe2e8f0;
          if (f.trieFoundIdx === i) {
            mat.color.setHex(0x10b981);
            mat.emissive.setHex(0x10b981);
            mat.emissiveIntensity = 1.3;
            lblCol = 0x6ee7b7;
            if (stepChanged) {
              for (let s = 0; s < 6; s++) {
                csParticlePool.spawn(nd.x, nd.y, nd.z, (Math.random() - 0.5) * 1.8, (Math.random() - 0.2) * 1.8, (Math.random() - 0.5) * 1.8, 0.8, 0.9, 0x10b981);
              }
            }
          } else if (activeSet.has(i)) {
            mat.color.setHex(0xfbbf24);
            mat.emissive.setHex(0xf59e0b);
            mat.emissiveIntensity = 0.9;
            lblCol = 0xfef08a;
          } else {
            mat.color.setHex(0x38bdf8);
            mat.emissive.setHex(0x0284c7);
            mat.emissiveIntensity = 0.25;
          }
          const chTxt = nd.char || 'ROOT';
          setTroikaLabel(trieLabels[i], chTxt, nd.x, nd.y + 0.4, nd.z, lblCol, true);

          if (nd.parentIdx >= 0 && f.trieNodes[nd.parentIdx]) {
            const p = f.trieNodes[nd.parentIdx];
            edge.visible = true;
            const hot = activeSet.has(i) && activeSet.has(nd.parentIdx);
            alignCylinderEdge(edge, p.x, p.y, p.z, nd.x, nd.y, nd.z, hot ? 1.35 : 0.75);
            eMat.color.setHex(hot ? 0xfbbf24 : 0x334155);
          } else {
            edge.visible = false;
          }
        }
      } else if (m === 'dp_table_3d' && f.dpGrid) {
        const depSet = new Set((f.dpDeps || []).map(([r, c]) => `${r},${c}`));
        const traceSet = new Set((f.dpTrace || []).map(([r, c]) => `${r},${c}`));
        let focusFound = false;
        for (let i = 0; i < 5; i++) {
          for (let w = 0; w < 8; w++) {
            const val = f.dpGrid[i]?.[w] ?? 0;
            const cell = dpCells[i][w];
            const mat = dpMats[i][w];
            const h = Math.max(0.14, 0.14 + val * 0.22);
            cell.scale.y = THREE.MathUtils.damp(cell.scale.y, h, 12, dt);
            cell.position.y = cell.scale.y * 0.5;
            const isCur = f.dpCur && f.dpCur[0] === i && f.dpCur[1] === w;
            const kStr = `${i},${w}`;
            if (traceSet.has(kStr)) {
              mat.color.setHex(0x10b981);
              mat.emissive.setHex(0x059669);
              mat.emissiveIntensity = 0.85 + Math.sin(tNow * 3 + i + w) * 0.15;
            } else if (isCur) {
              mat.color.setHex(0xfbbf24);
              mat.emissive.setHex(0xd97706);
              mat.emissiveIntensity = 0.95 + Math.sin(tNow * 5) * 0.2;
              focusFound = true;
              setTroikaLabel(dpFocusLbl, `dp[${i}][${w}]=${val}`, cell.position.x, cell.scale.y + 0.45, cell.position.z, 0xfef08a, true);
              if (stepChanged) {
                csParticlePool.spawn(cell.position.x, cell.scale.y + 0.12, cell.position.z, (Math.random() - 0.5) * 1.1, 1.0, (Math.random() - 0.5) * 1.1, 0.6, 0.85, 0xfbbf24);
              }
            } else if (depSet.has(kStr)) {
              mat.color.setHex(0x22d3ee);
              mat.emissive.setHex(0x0891b2);
              mat.emissiveIntensity = 0.65 + Math.sin(tNow * 3.5 + w) * 0.12;
            } else if (val > 0) {
              mat.color.setHex(0x38bdf8);
              mat.emissive.setHex(0x0369a1);
              mat.emissiveIntensity = 0.28;
            } else {
              mat.color.setHex(0x1e293b);
              mat.emissive.setHex(0x000000);
              mat.emissiveIntensity = 0;
            }
          }
        }
        if (!focusFound) {
          setTroikaLabel(dpFocusLbl, '', 0, 0, 0, 0xfef08a, false);
        }
      } else if (m === 'flow_network_3d' && f.flowEdges) {
        const augSet = new Set<string>();
        const ap = f.flowAugPath || [];
        for (let k = 0; k < ap.length - 1; k++) {
          augSet.add(`${ap[k]}->${ap[k + 1]}`);
          augSet.add(`${ap[k + 1]}->${ap[k]}`);
        }
        const augNodeSet = new Set(ap);
        flowNodeMeshes.forEach((sp, i) => {
          const mat = flowNodeMats[i];
          const inAug = augNodeSet.has(i);
          mat.emissiveIntensity = inAug ? 1.05 : 0.4;
          sp.scale.setScalar(inAug ? 1.15 + Math.sin(tNow * 4) * 0.05 : 1);
          const [nx, ny, nz] = FLOW_NODES_3D[i];
          const txt = i === 0 ? 'S' : i === 5 ? `T (Σ=${f.flowTotal ?? 0})` : `N${i}`;
          setTroikaLabel(flowNodeLabels[i], txt, nx, ny + 0.58, nz, inAug ? 0xfef08a : i === 5 ? 0xfbbf24 : 0xe2e8f0, true);
        });
        f.flowEdges.forEach((fe, idx) => {
          const pipe = flowPipes[idx];
          if (!pipe) return;
          const ratio = Math.max(0.08, Math.min(1, fe.flow / Math.max(1, fe.cap)));
          const [ax, ay, az] = FLOW_NODES_3D[fe.u];
          const [bx, by, bz] = FLOW_NODES_3D[fe.v];
          alignCylinderEdge(pipe.core, ax, ay, az, bx, by, bz, ratio);
          const onAug = augSet.has(`${fe.u}->${fe.v}`);
          pipe.coreMat.color.setHex(onAug ? 0xfbbf24 : fe.flow === fe.cap ? 0x22d3ee : 0x10b981);
          pipe.coreMat.emissive.setHex(onAug ? 0xf59e0b : fe.flow > 0 ? 0x059669 : 0x0f172a);
          pipe.coreMat.emissiveIntensity = onAug ? 1.1 : fe.flow > 0 ? 0.65 : 0.1;
          pipe.outerMat.opacity = onAug ? 0.45 : 0.22;
          setTroikaLabel(
            flowEdgeLabels[idx],
            `${fe.flow}/${fe.cap}`,
            (ax + bx) * 0.5,
            (ay + by) * 0.5 + 0.24,
            (az + bz) * 0.5,
            onAug ? 0xfef08a : 0xa7f3d0,
            true
          );
        });

        if (ap.length >= 2) {
          const segCount = ap.length - 1;
          const cycle = (tNow * 1.15) % segCount;
          const segIdx = Math.min(segCount - 1, Math.floor(cycle));
          const segT = cycle - segIdx;
          const a = FLOW_NODES_3D[ap[segIdx]];
          const b = FLOW_NODES_3D[ap[segIdx + 1]];
          if (a && b) {
            const px = THREE.MathUtils.lerp(a[0], b[0], segT);
            const py = THREE.MathUtils.lerp(a[1], b[1], segT);
            const pz = THREE.MathUtils.lerp(a[2], b[2], segT);
            csPacketOrb.visible = true;
            csPacketOrb.position.set(px, py, pz);
            if (cycle < 0.06) csPacketTrail.clear();
            csPacketTrail.pushAndRender(px, py, pz, camera, 0.01, 30);
            packetShown = true;
          }
        }
      } else if (m === 'spatial_octree_3d') {
        const visSet = new Set((f.octVisited || []).map(([x, y, z]) => `${x},${y},${z}`));
        const frontSet = new Set((f.octFrontier || []).map(([x, y, z]) => `${x},${y},${z}`));
        const pathSet = new Set((f.octPath || []).map(([x, y, z]) => `${x},${y},${z}`));
        const curKey = f.octCurrent ? `${f.octCurrent[0]},${f.octCurrent[1]},${f.octCurrent[2]}` : '';
        octGroup.rotation.y = Math.sin(tNow * 0.25) * 0.22;

        octVoxels.forEach(({ mesh, mat, isObs }, k) => {
          if (isObs) return;
          if (k === curKey) {
            mat.color.setHex(0xfbbf24);
            mat.emissive.setHex(0xf59e0b);
            mat.emissiveIntensity = 1.2;
            mat.opacity = 0.95;
            mesh.scale.setScalar(1.12);
            if (stepChanged) {
              csParticlePool.spawn(mesh.position.x, mesh.position.y + 0.15, mesh.position.z, (Math.random() - 0.5) * 1.2, 1.0, (Math.random() - 0.5) * 1.2, 0.65, 0.9, 0xfbbf24);
            }
          } else if (pathSet.has(k)) {
            mat.color.setHex(0x10b981);
            mat.emissive.setHex(0x059669);
            mat.emissiveIntensity = 1.0;
            mat.opacity = 0.92;
            mesh.scale.setScalar(1.0);
          } else if (frontSet.has(k)) {
            mat.color.setHex(0x22d3ee);
            mat.emissive.setHex(0x06b6d4);
            mat.emissiveIntensity = 0.75;
            mat.opacity = 0.68;
            mesh.scale.setScalar(0.88);
          } else if (visSet.has(k)) {
            mat.color.setHex(0x38bdf8);
            mat.emissive.setHex(0x0284c7);
            mat.emissiveIntensity = 0.35;
            mat.opacity = 0.36;
            mesh.scale.setScalar(0.75);
          } else {
            mat.color.setHex(0x0f172a);
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
            mat.opacity = 0.08;
            mesh.scale.setScalar(0.65);
          }
        });
      }

      if (!packetShown && csPacketOrb.visible) {
        csPacketOrb.visible = false;
        csPacketTrail.clear();
      }

      csParticlePool.update(dt, 0);
      if (autoOrbitRef.current) {
        applySphericalOrbitDelta(
          camera,
          controls.target,
          dt * 0.36,
          0,
          0,
          controls.minDistance || 2,
          controls.maxDistance || 40
        );
      }
      controls.update();
      updateBillboardLabels(scene, camera);

      if (pipeline) pipeline.render(dt);
      else renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else rafId = requestAnimationFrame(tick);
    };

    if (isSoftwareGl) afterDraw(tick);
    else rafId = requestAnimationFrame(tick);

    const unsubRemote = subscribeRemoteCommand((cmd) => {
      if (cmd.type === 'orbit') {
        applySphericalOrbitDelta(
          camera,
          controls.target,
          cmd.yawDelta,
          cmd.pitchDelta,
          cmd.zoomDelta,
          controls.minDistance || 2,
          controls.maxDistance || 40
        );
        controls.update();
      } else if (cmd.type === 'reset_view') {
        resetCamRef.current?.();
      } else if (cmd.type === 'toggle_play') {
        setIsPlaying((prev) => !prev);
      } else if (cmd.type === 'slide_prev') {
        setIsPlaying(false);
        setStepIdx((prev) => Math.max(0, prev - 1));
      } else if (cmd.type === 'slide_next') {
        setIsPlaying(false);
        setStepIdx((prev) => prev + 1);
      }
    });

    return () => {
      unsubRemote();
      alive = false;
      canvasElRef.current = null;
      resetCamRef.current = null;
      camPresetRef.current = null;
      capturePngRef.current = null;
      cancelAnimationFrame(rafId);
      clearTimeout(rafId);
      ro.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
      pipeline?.dispose();
      csParticlePool.dispose();
      csPacketTrail.dispose();
      scene.traverse((obj) => {
        if (obj.userData?.isTroikaLabel && typeof (obj as any).dispose === 'function') {
          (obj as any).dispose();
          return;
        }
        if ((obj as THREE.Mesh).isMesh || (obj as THREE.Line).isLine || (obj as THREE.LineSegments).isLineSegments) {
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
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/95 border-b border-slate-800 rounded-lg flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-2">
        <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap items-center gap-1.5 scrollbar-none pb-0.5 sm:pb-0">
          {onBack && !isFullscreen && (
            <button
              type="button"
              onClick={onBack}
              className="min-h-[38px] px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1 shrink-0 whitespace-nowrap cursor-pointer"
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
                className={`min-h-[38px] px-3 py-1.5 rounded text-xs font-bold border flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
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

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={openRemoteModal}
            className={`min-h-[38px] px-2.5 py-1.5 rounded border text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              controllerCount > 0
                ? 'bg-emerald-950/90 border-emerald-400/70 text-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 border-sky-500/50 text-sky-300'
            }`}
            title={
              isEn
                ? 'Scan QR to use Phone as 3D Controller'
                : 'Quét QR dùng Điện thoại điều khiển 3D & Thuyết trình từ xa'
            }
          >
            <QrCode className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">{isEn ? 'QR Remote' : 'QR 3D'}</span>
            {controllerCount > 0 && (
              <span className="px-1 rounded-[3px] bg-emerald-500 text-slate-950 text-[10px] font-mono font-extrabold tabular-nums">
                {controllerCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="min-h-[38px] px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-100 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            title={isFullscreen ? 'Thu nhỏ (Esc)' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? (isEn ? 'Exit Fullscreen' : 'Thu nhỏ') : isEn ? 'Fullscreen' : 'Toàn màn hình'}</span>
          </button>
        </div>
      </div>

      {/* Main Split: 3D Stage + Controls & Code Trace */}
      <div className={`p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 ${isFullscreen ? 'flex-1 min-h-0' : ''}`}>
        <div className="lg:col-span-8 flex flex-col gap-3 min-h-0">
          <div
            className={`relative w-full rounded-lg overflow-hidden border border-emerald-500/30 bg-[#040915] ${
              isFullscreen ? 'flex-1 min-h-[260px] sm:min-h-[380px]' : 'h-[280px] sm:h-[380px] lg:h-[430px]'
            }`}
          >
            <div ref={mountRef} className="absolute inset-0 w-full h-full touch-none" />

            {contextLost && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/90 text-emerald-300 text-xs font-mono">
                Restoring 3D Code WebGL...
              </div>
            )}

            <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 max-w-[calc(100%-220px)] truncate px-2.5 py-1 rounded bg-slate-950/88 border border-emerald-400/35 text-[11px] font-mono font-bold text-emerald-300">
              {isEn ? activeMeta.titleEn : activeMeta.titleVi} · {activeMeta.tag}
            </div>

            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
              <div className="hidden sm:flex items-center gap-0.5 p-0.5 rounded border border-slate-700 bg-slate-950/90">
                {(['iso', 'top', 'front'] as const).map((cp) => (
                  <button
                    key={cp}
                    type="button"
                    onClick={() => camPresetRef.current?.(cp)}
                    className="px-1.5 py-1 rounded text-[10px] font-mono font-bold text-slate-300 hover:bg-slate-800 hover:text-emerald-300 cursor-pointer"
                    title={`Góc nhìn ${cp.toUpperCase()}`}
                  >
                    {cp.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setAutoOrbit((o) => !o)}
                className={`min-w-[34px] min-h-[34px] flex items-center justify-center p-1.5 rounded border cursor-pointer ${
                  autoOrbit
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'border-slate-700 bg-slate-950/88 text-slate-200 hover:text-white'
                }`}
                title={autoOrbit ? 'Tắt xoay tự động' : 'Tự xoay 360°'}
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoOrbit ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => capturePngRef.current?.()}
                className="min-w-[34px] min-h-[34px] flex items-center justify-center p-1.5 rounded border border-slate-700 bg-slate-950/88 text-sky-300 hover:text-white cursor-pointer"
                title="Chụp ảnh mô phỏng 3D (.png)"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <RecordVideoButton
                isRecording={isRecording}
                seconds={recSeconds}
                onClick={toggleRecording}
                compact
              />
              <button
                type="button"
                onClick={() => resetCamRef.current?.()}
                className="min-w-[34px] min-h-[34px] flex items-center justify-center p-1.5 rounded border border-slate-700 bg-slate-950/88 text-slate-200 cursor-pointer"
                title="Reset 3D Camera"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Step Playback Bar */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="font-mono text-emerald-300 font-semibold truncate max-w-full sm:max-w-md">
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
                  className="min-w-[38px] min-h-[38px] flex items-center justify-center p-1.5 rounded bg-slate-800 border border-slate-700 cursor-pointer"
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
                  className={`min-h-[38px] px-3 py-1.5 rounded font-bold flex items-center gap-1 cursor-pointer ${
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
                  className="min-w-[38px] min-h-[38px] flex items-center justify-center p-1.5 rounded bg-slate-800 border border-slate-700 cursor-pointer"
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
                <button
                  type="button"
                  onClick={() =>
                    exportJsonFile(`synapse-cs3d-${mode}-trace.json`, {
                      mode,
                      title: activeMeta.titleVi,
                      totalSteps: steps.length,
                      steps
                    })
                  }
                  className="ml-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 text-[10px] font-mono font-bold inline-flex items-center gap-1 cursor-pointer"
                  title="Xuất toàn bộ kịch bản bước chạy 3D (JSON)"
                >
                  <Download className="w-3 h-3" />
                  <span>Trace JSON</span>
                </button>
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

          <CsStepAiTutorPanel
            isPaused={mode === 'stack_queue_3d' || !isPlaying}
            simCategory="3d"
            algorithmName={isEn ? activeMeta.titleEn : activeMeta.titleVi}
            stepNumber={mode === 'stack_queue_3d' ? Math.max(1, sqItems.length) : safeStepIdx + 1}
            totalSteps={mode === 'stack_queue_3d' ? Math.max(1, sqItems.length) : Math.max(1, steps.length)}
            stepTitle={mode === 'stack_queue_3d' ? sqLabel : currentFrame.label}
            stepDescription={
              mode === 'stack_queue_3d'
                ? `${sqKind.toUpperCase()}: [${sqItems.join(', ')}]`
                : currentFrame.label
            }
            activeCodeLineText={activeMeta.code[currentFrame.codeLine] || ''}
            variablesSummary={[
              currentFrame.arr ? `arr=[${currentFrame.arr.join(', ')}]` : '',
              currentFrame.graphDist
                ? `dist=[${currentFrame.graphDist.map((d) => (d === Infinity ? '∞' : d)).join(', ')}]`
                : '',
              currentFrame.segTotal !== undefined ? `segSum=${currentFrame.segTotal}` : '',
              currentFrame.flowTotal !== undefined ? `maxFlow=${currentFrame.flowTotal}` : '',
              mode === 'stack_queue_3d' ? `${sqKind}=[${sqItems.join(', ')}]` : ''
            ]
              .filter(Boolean)
              .join(' | ')}
            codeSnippet={activeMeta.code.join('\n')}
            isEn={isEn}
          />
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
                    <span className="text-cyan-300 font-bold tabular-nums">{d === Infinity ? '∞' : d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === 'segtree_3d' && (
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-300 flex items-center justify-between">
                <span>Chọn đoạn truy vấn [L..R]</span>
                <span className="font-mono text-cyan-300 tabular-nums">Sum = {currentFrame.segTotal ?? 0}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    [1, 5],
                    [0, 3],
                    [2, 6],
                    [4, 7]
                  ] as [number, number][]
                ).map(([l, r]) => (
                  <button
                    key={`${l}-${r}`}
                    type="button"
                    onClick={() => setSegQuery([l, r])}
                    className={`px-2.5 py-1 rounded font-mono font-bold border cursor-pointer ${
                      segQuery[0] === l && segQuery[1] === r
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    [{l}..{r}]
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'trie_3d' && (
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-300">Chọn từ tra cứu trên cây Trie 3D</div>
              <div className="flex flex-wrap gap-1.5">
                {['CODE', 'CORE', 'DATA', 'NODE', 'NET', 'COS'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setTrieWord(w)}
                    className={`px-2.5 py-1 rounded font-mono font-bold border cursor-pointer ${
                      trieWord === w
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'flow_network_3d' && currentFrame.flowEdges && (
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-300 flex items-center justify-between">
                <span>Thông số Luồng Cạnh</span>
                <span className="font-mono text-amber-300 tabular-nums">MaxFlow = {currentFrame.flowTotal ?? 0}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                {currentFrame.flowEdges.map((e, i) => (
                  <div
                    key={i}
                    className="p-1.5 rounded bg-slate-950 border border-slate-800 flex justify-between"
                  >
                    <span className="text-slate-400">V{e.u}→V{e.v}</span>
                    <span className="text-emerald-300 font-bold tabular-nums">{e.flow}/{e.cap}</span>
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
                      ? 'bg-emerald-600/30 text-emerald-200 font-bold ring-1 ring-emerald-400/50'
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
