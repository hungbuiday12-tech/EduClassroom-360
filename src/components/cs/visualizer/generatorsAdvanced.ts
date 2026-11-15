import { GraphEdge2D, GraphNode2D, VizStep } from './types';

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

// =====================================================================
// 10. MẢNG 2 CHIỀU: BFS / DIJKSTRA MÊ CUNG & CỘNG DỒN 2D
// =====================================================================
export function generateGridSteps(
  rows: number,
  cols: number,
  walls: boolean[][],
  weights: number[][],
  start: { r: number; c: number },
  end: { r: number; c: number },
  mode: 'bfs' | 'dijkstra' | 'prefix2d',
  rect: { r1: number; c1: number; r2: number; c2: number }
): VizStep[] {
  const R = Math.max(3, Math.min(8, rows));
  const C = Math.max(3, Math.min(10, cols));
  const steps: VizStep[] = [];

  if (mode === 'prefix2d') {
    const P: number[][] = Array.from({ length: R + 1 }, () => Array(C + 1).fill(0));
    for (let r = 1; r <= R; r++) {
      for (let c = 1; c <= C; c++) {
        P[r][c] = weights[r - 1][c - 1] + P[r - 1][c] + P[r][c - 1] - P[r - 1][c - 1];
      }
    }
    const r1 = Math.max(1, Math.min(R, rect.r1 + 1));
    const c1 = Math.max(1, Math.min(C, rect.c1 + 1));
    const r2 = Math.max(r1, Math.min(R, rect.r2 + 1));
    const c2 = Math.max(c1, Math.min(C, rect.c2 + 1));

    const total = P[r2][c2];
    const topStrip = P[r1 - 1][c2];
    const leftStrip = P[r2][c1 - 1];
    const cornerAdd = P[r1 - 1][c1 - 1];
    const ans = total - topStrip - leftStrip + cornerAdd;

    steps.push({
      stepIndex: 0,
      title: `Bảng Cộng dồn 2D P[r][c] đã sẵn sàng (${R}×${C})`,
      description: `Công thức dựng bảng: P[r][c] = A[r][c] + P[r-1][c] + P[r][c-1] - P[r-1][c-1]. Chọn 2 góc trên ma trận để tính tổng hình chữ nhật O(1).`,
      formula: `P[r][c] = A[r][c] + P[r-1][c] + P[r][c-1] - P[r-1][c-1]`,
      statusTag: 'init',
      variables: [
        { name: 'Hình chữ nhật', value: `(${r1 - 1},${c1 - 1}) → (${r2 - 1},${c2 - 1})` }
      ],
      state: { mode, R, C, weights, P, r1, c1, r2, c2, phase: 0 }
    });

    steps.push({
      stepIndex: 1,
      title: `Bước 1: Cộng toàn bộ vùng P[${r2}][${c2}] = ${total}`,
      description: `Lấy tổng từ góc (1,1) tới góc dưới phải (${r2},${c2}).`,
      statusTag: 'compare',
      variables: [{ name: `+ P[${r2}][${c2}]`, value: String(total), highlight: 'info' }],
      state: { mode, R, C, weights, P, r1, c1, r2, c2, phase: 1 }
    });

    steps.push({
      stepIndex: 2,
      title: `Bước 2: Trừ dải trên P[${r1 - 1}][${c2}] = ${topStrip} & dải trái P[${r2}][${c1 - 1}] = ${leftStrip}`,
      description: `Loại bỏ phần thừa phía trên và bên trái hình chữ nhật cần tính. Chú ý góc trên trái (${r1 - 1},${c1 - 1}) bị trừ tới 2 lần!`,
      statusTag: 'discard',
      variables: [
        { name: `- P[${r1 - 1}][${c2}]`, value: String(topStrip), highlight: 'warn' },
        { name: `- P[${r2}][${c1 - 1}]`, value: String(leftStrip), highlight: 'warn' }
      ],
      state: { mode, R, C, weights, P, r1, c1, r2, c2, phase: 2 }
    });

    steps.push({
      stepIndex: 3,
      title: `Bước 3: Cộng bù P[${r1 - 1}][${c1 - 1}] = ${cornerAdd} ⇒ Kết quả = ${ans}`,
      description: `Theo nguyên lý Bù - Trừ (Inclusion-Exclusion): ${total} - ${topStrip} - ${leftStrip} + ${cornerAdd} = ${ans}.`,
      formula: `Sum = ${total} - ${topStrip} - ${leftStrip} + ${cornerAdd} = ${ans}`,
      statusTag: 'done',
      variables: [{ name: 'Tổng vùng O(1)', value: String(ans), highlight: 'success' }],
      state: { mode, R, C, weights, P, r1, c1, r2, c2, phase: 3, ans }
    });

    return steps;
  }

  // Grid BFS or Dijkstra
  const dist: number[][] = Array.from({ length: R }, () => Array(C).fill(Infinity));
  const visited: boolean[][] = Array.from({ length: R }, () => Array(C).fill(false));
  const parent: ({ r: number; c: number } | null)[][] = Array.from({ length: R }, () =>
    Array(C).fill(null)
  );

  dist[start.r][start.c] = 0;
  const pq: { r: number; c: number; d: number }[] = [{ r: start.r, c: start.c, d: 0 }];
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ];

  steps.push({
    stepIndex: 0,
    title: `Khởi tạo ${mode === 'bfs' ? 'BFS Loang trên lưới 2D' : 'Dijkstra trên lưới có trọng số'}`,
    description: `Tìm đường đi ngắn nhất từ S(${start.r},${start.c}) đến T(${end.r},${end.c}). Bấm vào ô lưới để đặt/xóa tường cản (#).`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [
      { name: 'S → T', value: `(${start.r},${start.c}) → (${end.r},${end.c})` },
      { name: 'Hàng đợi', value: `(${start.r},${start.c}):0` }
    ],
    state: {
      mode,
      R,
      C,
      walls,
      weights,
      start,
      end,
      dist: clone(dist),
      visited: clone(visited),
      current: null,
      frontier: clone(pq),
      path: []
    }
  });

  let found = false;
  while (pq.length > 0 && steps.length < 180) {
    if (mode === 'dijkstra') {
      pq.sort((a, b) => a.d - b.d);
    }
    const cur = pq.shift()!;
    if (visited[cur.r][cur.c]) continue;
    visited[cur.r][cur.c] = true;

    if (cur.r === end.r && cur.c === end.c) {
      found = true;
      break;
    }

    const relaxedCells: string[] = [];
    for (const [dr, dc] of dirs) {
      const nr = cur.r + dr;
      const nc = cur.c + dc;
      if (nr < 0 || nr >= R || nc < 0 || nc >= C || walls[nr][nc] || visited[nr][nc]) continue;
      const stepCost = mode === 'bfs' ? 1 : weights[nr][nc];
      const nd = dist[cur.r][cur.c] + stepCost;
      if (nd < dist[nr][nc]) {
        dist[nr][nc] = nd;
        parent[nr][nc] = { r: cur.r, c: cur.c };
        pq.push({ r: nr, c: nc, d: nd });
        relaxedCells.push(`(${nr},${nc})=${nd}`);
      }
    }

    steps.push({
      stepIndex: steps.length,
      title: `Duyệt ô (${cur.r}, ${cur.c}) với dist = ${dist[cur.r][cur.c]}`,
      description:
        relaxedCells.length > 0
          ? `Loang sang các ô kề: ${relaxedCells.join(', ')}.`
          : `Không cập nhật thêm ô kề mới nào từ (${cur.r}, ${cur.c}).`,
      activeCodeLine: 4,
      statusTag: relaxedCells.length > 0 ? 'update' : 'compare',
      variables: [
        { name: 'Ô đang xét', value: `(${cur.r},${cur.c})`, highlight: 'active' },
        { name: 'dist', value: String(dist[cur.r][cur.c]), highlight: 'info' },
        { name: 'Frontier size', value: String(pq.length) }
      ],
      state: {
        mode,
        R,
        C,
        walls,
        weights,
        start,
        end,
        dist: clone(dist),
        visited: clone(visited),
        current: { r: cur.r, c: cur.c },
        frontier: clone(pq),
        path: []
      }
    });
  }

  const path: { r: number; c: number }[] = [];
  if (found || dist[end.r][end.c] < Infinity) {
    let curr: { r: number; c: number } | null = end;
    while (curr) {
      path.push(curr);
      curr = parent[curr.r][curr.c];
    }
    path.reverse();
  }

  steps.push({
    stepIndex: steps.length,
    title:
      path.length > 0
        ? `Tìm thấy đường ngắn nhất S → T! Chi phí = ${dist[end.r][end.c]}`
        : 'Không có đường đi từ S đến T (bị tường chắn kín)!',
    description:
      path.length > 0
        ? `Độ dài ${path.length - 1} bước, tổng chi phí = ${dist[end.r][end.c]}. Lộ trình: ${path
            .map((p) => `(${p.r},${p.c})`)
            .join(' → ')}.`
        : 'Hãy xóa bớt tường cản để mở đường đi.',
    statusTag: path.length > 0 ? 'done' : 'discard',
    variables: [
      {
        name: 'Chi phí T',
        value: dist[end.r][end.c] < Infinity ? String(dist[end.r][end.c]) : '∞',
        highlight: path.length > 0 ? 'success' : 'warn'
      }
    ],
    state: {
      mode,
      R,
      C,
      walls,
      weights,
      start,
      end,
      dist: clone(dist),
      visited: clone(visited),
      current: end,
      frontier: [],
      path
    }
  });

  return steps;
}

// =====================================================================
// 11. DP: CÁI TÚI 0/1 (KNAPSACK)
// =====================================================================
export function generateKnapsackSteps(
  items: { w: number; v: number }[],
  capacity: number
): VizStep[] {
  const safeItems = items.slice(0, 6);
  const N = safeItems.length;
  const W = Math.max(1, Math.min(12, capacity || 7));
  const dp: number[][] = Array.from({ length: N + 1 }, () => Array(W + 1).fill(0));
  const steps: VizStep[] = [];

  steps.push({
    stepIndex: 0,
    title: `Khởi tạo bảng DP Cái Túi 0/1 (${N} vật, sức chứa W = ${W})`,
    description: `Hàng i=0 (không có vật nào) và cột w=0 đều có giá trị dp[i][w] = 0.`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [
      { name: 'Số vật N', value: String(N) },
      { name: 'Sức chứa W', value: String(W) }
    ],
    state: { items: safeItems, W, dp: clone(dp), curI: 0, curW: 0, deps: [], chosenIndices: [] }
  });

  for (let i = 1; i <= N; i++) {
    const { w: wi, v: vi } = safeItems[i - 1];
    for (let w = 0; w <= W; w++) {
      const skipVal = dp[i - 1][w];
      const canTake = w >= wi;
      const takeVal = canTake ? dp[i - 1][w - wi] + vi : -1;
      const took = canTake && takeVal > skipVal;
      dp[i][w] = took ? takeVal : skipVal;

      const deps = [{ r: i - 1, c: w, label: 'Không chọn' }];
      if (canTake) deps.push({ r: i - 1, c: w - wi, label: `Chọn (+${vi})` });

      steps.push({
        stepIndex: steps.length,
        title: `dp[${i}][${w}] = ${dp[i][w]} (Vật #${i}: w=${wi}, v=${vi})`,
        description: canTake
          ? `So sánh: Không chọn = dp[${i - 1}][${w}] (${skipVal}) vs Chọn = dp[${i - 1}][${w - wi}] + ${vi} (${takeVal}) ⇒ Chọn max = ${dp[i][w]}.`
          : `Sức chứa w=${w} < w_${i}=${wi} ⇒ Không thể chọn vật #${i}, kế thừa dp[${i - 1}][${w}] = ${skipVal}.`,
        formula: canTake
          ? `dp[${i}][${w}] = max(${skipVal}, ${dp[i - 1][w - wi]} + ${vi}) = ${dp[i][w]}`
          : `dp[${i}][${w}] = dp[${i - 1}][${w}] = ${skipVal}`,
        activeCodeLine: took ? 4 : 2,
        statusTag: took ? 'update' : 'compare',
        variables: [
          { name: 'Ô đang điền', value: `dp[${i}][${w}]`, highlight: 'active' },
          { name: 'Không chọn', value: String(skipVal) },
          { name: 'Chọn vật #' + i, value: canTake ? String(takeVal) : 'Không vừa', highlight: took ? 'success' : undefined }
        ],
        state: { items: safeItems, W, dp: clone(dp), curI: i, curW: w, deps, chosenIndices: [] }
      });
    }
  }

  // Backtrack
  const chosenIndices: number[] = [];
  const traceCells: { r: number; c: number }[] = [];
  let remW = W;
  for (let i = N; i >= 1; i--) {
    traceCells.push({ r: i, c: remW });
    if (dp[i][remW] !== dp[i - 1][remW]) {
      chosenIndices.push(i);
      remW -= safeItems[i - 1].w;
    }
  }
  chosenIndices.reverse();

  steps.push({
    stepIndex: steps.length,
    title: `Truy vết xong! Giá trị lớn nhất = ${dp[N][W]}`,
    description: `Các vật được chọn: ${
      chosenIndices.length > 0
        ? chosenIndices.map((idx) => `#${idx}(w=${safeItems[idx - 1].w}, v=${safeItems[idx - 1].v})`).join(', ')
        : 'Không có'
    }. Tổng trọng lượng = ${chosenIndices.reduce((s, idx) => s + safeItems[idx - 1].w, 0)}/${W}.`,
    activeCodeLine: 5,
    statusTag: 'done',
    variables: [
      { name: 'Giá trị Max', value: String(dp[N][W]), highlight: 'success' },
      { name: 'Vật đã chọn', value: chosenIndices.map((x) => `#${x}`).join(', ') || '0' }
    ],
    state: { items: safeItems, W, dp: clone(dp), curI: N, curW: W, deps: [], chosenIndices, traceCells }
  });

  return steps;
}

// =====================================================================
// 12. DP: DÃY CON TĂNG DÀI NHẤT (LIS O(N log N) + O(N^2))
// =====================================================================
export function generateLisSteps(rawArr: number[]): VizStep[] {
  const arr = (rawArr.length ? rawArr : [3, 1, 5, 2, 6, 4, 9, 7]).slice(0, 14);
  const n = arr.length;
  const dp = Array(n).fill(1);
  const tails: number[] = [];
  const tailsIndices: number[] = [];
  const parent = Array(n).fill(-1);
  const steps: VizStep[] = [];

  steps.push({
    stepIndex: 0,
    title: 'Khởi tạo Dãy Con Tăng Dài Nhất (LIS O(N log N))',
    description: `Dùng mảng tails[k] lưu giá trị kết thúc nhỏ nhất của một dãy con tăng độ dài k+1.`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [
      { name: 'N', value: String(n) },
      { name: 'tails[]', value: '[]' }
    ],
    state: { arr, idx: -1, dp: [...dp], tails: [], lisIndices: [], replacedPos: -1 }
  });

  for (let i = 0; i < n; i++) {
    // lower_bound in tails
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < arr[i]) lo = mid + 1;
      else hi = mid;
    }
    const pos = lo;
    const isAppend = pos === tails.length;
    tails[pos] = arr[i];
    tailsIndices[pos] = i;
    if (pos > 0) parent[i] = tailsIndices[pos - 1];
    dp[i] = pos + 1;

    steps.push({
      stepIndex: steps.length,
      title: `i=${i} (a[i]=${arr[i]}): ${isAppend ? `Mở rộng tails[${pos}] = ${arr[i]}` : `Thay thế tails[${pos}] ← ${arr[i]}`}`,
      description: isAppend
        ? `a[${i}]=${arr[i]} lớn hơn mọi phần tử trong tails[] ⇒ Kéo dài độ dài LIS lên ${tails.length}!`
        : `Tìm được lower_bound tại pos=${pos} trong tails[]. Ghi đè tails[${pos}] = ${arr[i]} để giữ đuôi nhỏ hơn cho tương lai.`,
      activeCodeLine: isAppend ? 3 : 4,
      statusTag: isAppend ? 'update' : 'compare',
      variables: [
        { name: 'a[i]', value: String(arr[i]), highlight: 'active' },
        { name: 'lower_bound pos', value: String(pos) },
        { name: 'tails[]', value: `[${tails.join(', ')}]`, highlight: 'info' },
        { name: 'dp[i]', value: String(dp[i]), highlight: 'success' }
      ],
      state: { arr, idx: i, dp: [...dp], tails: [...tails], lisIndices: [], replacedPos: pos }
    });
  }

  // Reconstruct LIS
  const lisIndices: number[] = [];
  let cur = tailsIndices[tailsIndices.length - 1];
  while (cur !== undefined && cur !== -1) {
    lisIndices.push(cur);
    cur = parent[cur];
  }
  lisIndices.reverse();

  steps.push({
    stepIndex: steps.length,
    title: `Hoàn tất! Độ dài LIS = ${tails.length}`,
    description: `Một dãy con tăng dài nhất: [${lisIndices.map((idx) => arr[idx]).join(', ')}] (tại các chỉ số ${lisIndices.join(', ')}).`,
    statusTag: 'done',
    variables: [
      { name: 'Độ dài LIS', value: String(tails.length), highlight: 'success' },
      { name: 'Dãy LIS', value: `[${lisIndices.map((idx) => arr[idx]).join(', ')}]`, highlight: 'success' }
    ],
    state: { arr, idx: n - 1, dp: [...dp], tails: [...tails], lisIndices, replacedPos: -1 }
  });

  return steps;
}

// =====================================================================
// 13. DP: XÂU CON CHUNG DÀI NHẤT (LCS)
// =====================================================================
export function generateLcsSteps(rawA: string, rawB: string): VizStep[] {
  const A = (rawA || 'ABCBDAB').slice(0, 10);
  const B = (rawB || 'BDCABA').slice(0, 10);
  const n = A.length;
  const m = B.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  const steps: VizStep[] = [];

  steps.push({
    stepIndex: 0,
    title: `Khởi tạo bảng DP LCS cho A="${A}" và B="${B}"`,
    description: `Xây dựng ma trận dp[${n + 1}][${m + 1}] với hàng 0 và cột 0 bằng 0.`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [
      { name: 'Xâu A', value: A },
      { name: 'Xâu B', value: B }
    ],
    state: { A, B, dp: clone(dp), curI: 0, curJ: 0, dir: null, traceCells: [], lcsStr: '' }
  });

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const match = A[i - 1] === B[j - 1];
      let dir: 'diag' | 'up' | 'left';
      if (match) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        dir = 'diag';
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        dp[i][j] = dp[i - 1][j];
        dir = 'up';
      } else {
        dp[i][j] = dp[i][j - 1];
        dir = 'left';
      }

      steps.push({
        stepIndex: steps.length,
        title: `dp[${i}][${j}] = ${dp[i][j]} ('${A[i - 1]}' ${match ? '==' : '≠'} '${B[j - 1]}')`,
        description: match
          ? `Khớp ký tự '${A[i - 1]}'! Cộng 1 từ ô chéo trên trái dp[${i - 1}][${j - 1}] = ${dp[i - 1][j - 1]}.`
          : `Khác nhau ⇒ Lấy max(trên dp[${i - 1}][${j}]=${dp[i - 1][j]}, trái dp[${i}][${j - 1}]=${dp[i][j - 1]}) = ${dp[i][j]}.`,
        activeCodeLine: match ? 2 : 3,
        statusTag: match ? 'update' : 'compare',
        variables: [
          { name: 'Cặp ký tự', value: `A[${i - 1}]='${A[i - 1]}', B[${j - 1}]='${B[j - 1]}'`, highlight: match ? 'success' : undefined },
          { name: `dp[${i}][${j}]`, value: String(dp[i][j]), highlight: 'active' }
        ],
        state: { A, B, dp: clone(dp), curI: i, curJ: j, dir, traceCells: [], lcsStr: '' }
      });
    }
  }

  // Backtrack
  const traceCells: { r: number; c: number; matched: boolean }[] = [];
  let r = n;
  let c = m;
  let lcsChars: string[] = [];
  while (r > 0 && c > 0) {
    if (A[r - 1] === B[c - 1]) {
      traceCells.push({ r, c, matched: true });
      lcsChars.push(A[r - 1]);
      r--;
      c--;
    } else if (dp[r - 1][c] >= dp[r][c - 1]) {
      traceCells.push({ r, c, matched: false });
      r--;
    } else {
      traceCells.push({ r, c, matched: false });
      c--;
    }
  }
  const lcsStr = lcsChars.reverse().join('');

  steps.push({
    stepIndex: steps.length,
    title: `Hoàn tất LCS! Độ dài = ${dp[n][m]}, Xâu chung = "${lcsStr}"`,
    description: `Truy vết ngược từ (${n},${m}) thu được xâu con chung dài nhất "${lcsStr}".`,
    activeCodeLine: 4,
    statusTag: 'done',
    variables: [{ name: 'LCS', value: `"${lcsStr}" (len=${dp[n][m]})`, highlight: 'success' }],
    state: { A, B, dp: clone(dp), curI: n, curJ: m, dir: null, traceCells, lcsStr }
  });

  return steps;
}

// =====================================================================
// 14. ĐỒ THỊ: DIJKSTRA / BFS / DFS / KRUSKAL MST
// =====================================================================
export function generateGraphSteps(
  nodes: GraphNode2D[],
  edges: GraphEdge2D[],
  startId: string,
  targetId: string,
  directed: boolean,
  algo: 'dijkstra' | 'bfs' | 'dfs' | 'kruskal'
): VizStep[] {
  const steps: VizStep[] = [];
  if (nodes.length === 0) return steps;

  const adj = new Map<string, { to: string; w: number; edgeId: string }[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) {
    adj.get(e.u)?.push({ to: e.v, w: e.w, edgeId: e.id });
    if (!directed && e.u !== e.v) {
      adj.get(e.v)?.push({ to: e.u, w: e.w, edgeId: e.id });
    }
  }

  if (algo === 'kruskal') {
    const sortedEdges = [...edges].sort((a, b) => a.w - b.w);
    const parent: Record<string, string> = {};
    for (const n of nodes) parent[n.id] = n.id;
    const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    const mstEdgeIds: string[] = [];
    let totalWeight = 0;

    steps.push({
      stepIndex: 0,
      title: 'Kruskal MST: Sắp xếp cạnh theo trọng số tăng dần',
      description: `Sắp xếp ${sortedEdges.length} cạnh tăng dần: ${sortedEdges.map((e) => `${e.u}-${e.v}(${e.w})`).join(', ')}. Dùng DSU để tránh tạo chu trình.`,
      statusTag: 'init',
      variables: [
        { name: 'Tổng MST', value: '0' },
        { name: 'Số cạnh chọn', value: `0 / ${nodes.length - 1}` }
      ],
      state: { algo, nodes, edges, mstEdgeIds: [], skippedEdgeIds: [], checkingEdgeId: null, dsuParent: { ...parent }, totalWeight: 0 }
    });

    const skippedEdgeIds: string[] = [];
    for (const e of sortedEdges) {
      const ru = find(e.u);
      const rv = find(e.v);
      const accept = ru !== rv;
      if (accept) {
        parent[ru] = rv;
        mstEdgeIds.push(e.id);
        totalWeight += e.w;
      } else {
        skippedEdgeIds.push(e.id);
      }

      steps.push({
        stepIndex: steps.length,
        title: `Xét cạnh ${e.u} — ${e.v} (trọng số ${e.w}): ${accept ? 'CHỌN VÀO MST' : 'BỎ QUA (TẠO CHU TRÌNH)'}`,
        description: accept
          ? `find(${e.u})=${ru} ≠ find(${e.v})=${rv} ⇒ Hợp nhất hai thành phần liên thông, tổng MST = ${totalWeight}.`
          : `find(${e.u}) = find(${e.v}) = ${ru} ⇒ Đã cùng thành phần, thêm cạnh sẽ tạo chu trình!`,
        statusTag: accept ? 'update' : 'discard',
        variables: [
          { name: 'Cạnh', value: `${e.u}-${e.v} (w=${e.w})`, highlight: accept ? 'success' : 'warn' },
          { name: 'Tổng MST', value: String(totalWeight), highlight: 'info' },
          { name: 'Số cạnh', value: `${mstEdgeIds.length} / ${Math.max(0, nodes.length - 1)}` }
        ],
        state: {
          algo,
          nodes,
          edges,
          mstEdgeIds: [...mstEdgeIds],
          skippedEdgeIds: [...skippedEdgeIds],
          checkingEdgeId: e.id,
          dsuParent: { ...parent },
          totalWeight
        }
      });
    }

    steps.push({
      stepIndex: steps.length,
      title: `Hoàn tất Cây khung nhỏ nhất MST = ${totalWeight}`,
      description: `Đã chọn ${mstEdgeIds.length} cạnh với tổng trọng số nhỏ nhất = ${totalWeight}.`,
      statusTag: 'done',
      variables: [{ name: 'Tổng trọng số MST', value: String(totalWeight), highlight: 'success' }],
      state: { algo, nodes, edges, mstEdgeIds: [...mstEdgeIds], skippedEdgeIds, checkingEdgeId: null, dsuParent: { ...parent }, totalWeight }
    });
    return steps;
  }

  if (algo === 'bfs' || algo === 'dfs') {
    const visited = new Set<string>();
    const parent: Record<string, string | null> = {};
    const order: string[] = [];
    const treeEdgeIds: string[] = [];
    for (const n of nodes) parent[n.id] = null;

    if (algo === 'bfs') {
      const q: string[] = [startId];
      visited.add(startId);
      steps.push({
        stepIndex: 0,
        title: `Khởi tạo BFS từ đỉnh ${startId}`,
        description: `Đẩy ${startId} vào Queue và đánh dấu đã thăm.`,
        statusTag: 'init',
        variables: [{ name: 'Queue', value: `[${startId}]` }],
        state: { algo, nodes, edges, currentId: startId, visitedIds: [startId], frontierIds: [startId], order: [], treeEdgeIds: [], pathIds: [], parent: { ...parent } }
      });

      while (q.length > 0) {
        const u = q.shift()!;
        order.push(u);
        const added: string[] = [];
        for (const nb of adj.get(u) || []) {
          if (!visited.has(nb.to)) {
            visited.add(nb.to);
            parent[nb.to] = u;
            treeEdgeIds.push(nb.edgeId);
            q.push(nb.to);
            added.push(nb.to);
          }
        }
        steps.push({
          stepIndex: steps.length,
          title: `BFS thăm đỉnh ${u} (Thứ tự #${order.length})`,
          description: added.length ? `Đẩy các đỉnh kề chưa thăm vào Queue: [${added.join(', ')}].` : `Không có đỉnh kề mới từ ${u}.`,
          statusTag: added.length ? 'update' : 'compare',
          variables: [
            { name: 'Đang thăm', value: u, highlight: 'active' },
            { name: 'Queue', value: `[${q.join(', ')}]`, highlight: 'info' },
            { name: 'Thứ tự duyệt', value: order.join(' → ') }
          ],
          state: {
            algo,
            nodes,
            edges,
            currentId: u,
            visitedIds: Array.from(visited),
            frontierIds: [...q],
            order: [...order],
            treeEdgeIds: [...treeEdgeIds],
            pathIds: [],
            parent: { ...parent }
          }
        });
      }
    } else {
      const stack: { u: string; edgeId: string | null }[] = [{ u: startId, edgeId: null }];
      steps.push({
        stepIndex: 0,
        title: `Khởi tạo DFS từ đỉnh ${startId}`,
        description: `Đưa ${startId} vào ngăn xếp Stack để duyệt theo chiều sâu.`,
        statusTag: 'init',
        variables: [{ name: 'Stack', value: `[${startId}]` }],
        state: { algo, nodes, edges, currentId: startId, visitedIds: [], frontierIds: [startId], order: [], treeEdgeIds: [], pathIds: [], parent: { ...parent } }
      });

      while (stack.length > 0) {
        const item = stack.pop()!;
        const u = item.u;
        if (visited.has(u)) continue;
        visited.add(u);
        order.push(u);
        if (item.edgeId) treeEdgeIds.push(item.edgeId);

        const neighbors = [...(adj.get(u) || [])].reverse();
        for (const nb of neighbors) {
          if (!visited.has(nb.to)) {
            if (parent[nb.to] === null && nb.to !== startId) parent[nb.to] = u;
            stack.push({ u: nb.to, edgeId: nb.edgeId });
          }
        }

        steps.push({
          stepIndex: steps.length,
          title: `DFS thăm sâu đỉnh ${u} (Thứ tự #${order.length})`,
          description: `Đánh dấu đã thăm ${u} và đẩy các đỉnh kề chưa thăm lên Stack.`,
          statusTag: 'update',
          variables: [
            { name: 'Đang thăm', value: u, highlight: 'active' },
            { name: 'Stack', value: `[${stack.map((s) => s.u).join(', ')}]`, highlight: 'info' },
            { name: 'Thứ tự duyệt', value: order.join(' → ') }
          ],
          state: {
            algo,
            nodes,
            edges,
            currentId: u,
            visitedIds: Array.from(visited),
            frontierIds: stack.map((s) => s.u),
            order: [...order],
            treeEdgeIds: [...treeEdgeIds],
            pathIds: [],
            parent: { ...parent }
          }
        });
      }
    }

    const pathIds: string[] = [];
    if (visited.has(targetId)) {
      let cur: string | null = targetId;
      while (cur) {
        pathIds.push(cur);
        cur = parent[cur];
      }
      pathIds.reverse();
    }

    steps.push({
      stepIndex: steps.length,
      title: `Hoàn tất ${algo.toUpperCase()}! Thứ tự: ${order.join(' → ')}`,
      description: pathIds.length ? `Đường từ ${startId} đến ${targetId}: ${pathIds.join(' → ')}.` : `Đã duyệt toàn bộ thành phần liên thông chứa ${startId}.`,
      statusTag: 'done',
      variables: [{ name: 'Thứ tự', value: order.join(' → '), highlight: 'success' }],
      state: {
        algo,
        nodes,
        edges,
        currentId: targetId,
        visitedIds: Array.from(visited),
        frontierIds: [],
        order: [...order],
        treeEdgeIds: [...treeEdgeIds],
        pathIds,
        parent: { ...parent }
      }
    });
    return steps;
  }

  // Dijkstra
  const dist: Record<string, number> = {};
  const parent: Record<string, string | null> = {};
  const settled = new Set<string>();
  for (const n of nodes) {
    dist[n.id] = Infinity;
    parent[n.id] = null;
  }
  dist[startId] = 0;
  const pq: { d: number; u: string }[] = [{ d: 0, u: startId }];

  steps.push({
    stepIndex: 0,
    title: `Khởi tạo Dijkstra từ nguồn ${startId} → đích ${targetId}`,
    description: `Gán dist[${startId}] = 0, mọi đỉnh khác = ∞. Đẩy (0, ${startId}) vào Priority Queue.`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [
      { name: 'Priority Queue', value: `(0, ${startId})`, highlight: 'info' },
      { name: 'Đã chốt', value: 'Rỗng' }
    ],
    state: {
      algo: 'dijkstra',
      nodes,
      edges,
      dist: { ...dist },
      parent: { ...parent },
      settledIds: [],
      pq: clone(pq),
      currentId: null,
      relaxEdgeId: null,
      pathEdgeIds: [],
      pathIds: []
    }
  });

  while (pq.length > 0 && steps.length < 150) {
    pq.sort((a, b) => a.d - b.d);
    const { d, u } = pq.shift()!;
    if (d > dist[u] || settled.has(u)) continue;
    settled.add(u);

    steps.push({
      stepIndex: steps.length,
      title: `Pop (d=${d}, u=${u}) từ Priority Queue & Chốt dist[${u}] = ${d}`,
      description: `Đỉnh ${u} có khoảng cách nhỏ nhất hiện tại (${d}), chốt đường ngắn nhất tới ${u}.`,
      activeCodeLine: 2,
      statusTag: 'compare',
      variables: [
        { name: 'Đang chốt u', value: `${u} (dist=${d})`, highlight: 'active' },
        { name: 'PQ còn lại', value: pq.map((x) => `(${x.d},${x.u})`).join(', ') || 'Rỗng' },
        { name: 'Đã chốt', value: Array.from(settled).join(', ') }
      ],
      state: {
        algo: 'dijkstra',
        nodes,
        edges,
        dist: { ...dist },
        parent: { ...parent },
        settledIds: Array.from(settled),
        pq: clone(pq),
        currentId: u,
        relaxEdgeId: null,
        pathEdgeId: null,
        pathEdgeIds: [],
        pathIds: []
      }
    });

    for (const nb of adj.get(u) || []) {
      const cand = dist[u] + nb.w;
      const improved = cand < dist[nb.to];
      const oldDist = dist[nb.to];
      if (improved) {
        dist[nb.to] = cand;
        parent[nb.to] = u;
        pq.push({ d: cand, u: nb.to });
      }
      steps.push({
        stepIndex: steps.length,
        title: `Thư giãn cạnh ${u} → ${nb.to} (w=${nb.w}): ${improved ? `Cập nhật dist[${nb.to}] = ${cand}` : `Giữ nguyên (${oldDist === Infinity ? '∞' : oldDist} ≤ ${cand})`}`,
        description: improved
          ? `dist[${u}] + ${nb.w} = ${cand} < ${oldDist === Infinity ? '∞' : oldDist} ⇒ Gán dist[${nb.to}] = ${cand}, parent[${nb.to}] = ${u} và đẩy (${cand}, ${nb.to}) vào PQ.`
          : `Đường qua ${u} có tổng ${cand} không tốt hơn khoảng cách hiện có của ${nb.to}.`,
        formula: `dist[${nb.to}] = min(${oldDist === Infinity ? '∞' : oldDist}, ${dist[u]} + ${nb.w}) = ${dist[nb.to]}`,
        activeCodeLine: improved ? 6 : 5,
        statusTag: improved ? 'update' : 'compare',
        variables: [
          { name: 'Cạnh', value: `${u} → ${nb.to} (w=${nb.w})` },
          { name: `dist[${nb.to}]`, value: dist[nb.to] === Infinity ? '∞' : String(dist[nb.to]), highlight: improved ? 'success' : undefined },
          { name: 'PQ', value: [...pq].sort((a, b) => a.d - b.d).map((x) => `(${x.d},${x.u})`).join(', ') || 'Rỗng' }
        ],
        state: {
          algo: 'dijkstra',
          nodes,
          edges,
          dist: { ...dist },
          parent: { ...parent },
          settledIds: Array.from(settled),
          pq: [...pq].sort((a, b) => a.d - b.d),
          currentId: u,
          relaxEdgeId: nb.edgeId,
          relaxTargetId: nb.to,
          pathEdgeIds: [],
          pathIds: []
        }
      });
    }
  }

  // Build path to targetId
  const pathIds: string[] = [];
  const pathEdgeIds: string[] = [];
  if (dist[targetId] < Infinity) {
    let cur: string | null = targetId;
    while (cur) {
      pathIds.push(cur);
      const p: string | null = parent[cur];
      if (p) {
        const foundEdge = edges.find((e) => (e.u === p && e.v === cur) || (!directed && e.v === p && e.u === cur));
        if (foundEdge) pathEdgeIds.push(foundEdge.id);
      }
      cur = p;
    }
    pathIds.reverse();
  }

  steps.push({
    stepIndex: steps.length,
    title:
      dist[targetId] < Infinity
        ? `Hoàn tất Dijkstra! Đường ngắn nhất ${startId} → ${targetId} = ${dist[targetId]}`
        : `Không có đường đi từ ${startId} đến ${targetId}`,
    description:
      dist[targetId] < Infinity
        ? `Lộ trình tối ưu: ${pathIds.join(' → ')} với tổng trọng số = ${dist[targetId]}.`
        : `Đỉnh ${targetId} không thể tới được từ ${startId}.`,
    statusTag: 'done',
    variables: [
      {
        name: `dist[${targetId}]`,
        value: dist[targetId] < Infinity ? String(dist[targetId]) : '∞',
        highlight: dist[targetId] < Infinity ? 'success' : 'warn'
      },
      { name: 'Đường đi', value: pathIds.join(' → ') || 'Không có' }
    ],
    state: {
      algo: 'dijkstra',
      nodes,
      edges,
      dist: { ...dist },
      parent: { ...parent },
      settledIds: Array.from(settled),
      pq: [],
      currentId: targetId,
      relaxEdgeId: null,
      pathEdgeIds,
      pathIds
    }
  });

  return steps;
}

// =====================================================================
// 15. CÂY PHÂN ĐOẠN (SEGMENT TREE)
// =====================================================================
export interface SegNodeState {
  node: number;
  l: number;
  r: number;
  val: number;
  status: 'idle' | 'split' | 'cover' | 'skip' | 'updated';
}

export function generateSegmentTreeSteps(
  rawArr: number[],
  op: 'query' | 'update',
  qL: number,
  qR: number,
  updIdx: number,
  updVal: number
): VizStep[] {
  const arr = (rawArr.length ? rawArr : [3, 1, 4, 1, 5, 9, 2, 6]).slice(0, 8);
  const n = arr.length;
  const tree: Record<number, { l: number; r: number; val: number }> = {};

  const build = (node: number, l: number, r: number) => {
    if (l === r) {
      tree[node] = { l, r, val: arr[l] };
      return;
    }
    const mid = (l + r) >> 1;
    build(2 * node, l, mid);
    build(2 * node + 1, mid + 1, r);
    tree[node] = { l, r, val: tree[2 * node].val + tree[2 * node + 1].val };
  };
  build(1, 0, n - 1);

  const makeSnapshot = (statuses: Record<number, SegNodeState['status']>) => {
    const out: Record<number, SegNodeState> = {};
    for (const k of Object.keys(tree)) {
      const id = Number(k);
      out[id] = { ...tree[id], node: id, status: statuses[id] || 'idle' };
    }
    return out;
  };

  const steps: VizStep[] = [];
  const L = Math.max(0, Math.min(n - 1, qL));
  const R = Math.max(L, Math.min(n - 1, qR));

  if (op === 'query') {
    const statuses: Record<number, SegNodeState['status']> = {};
    let total = 0;

    steps.push({
      stepIndex: 0,
      title: `Cây Phân Đoạn: Truy vấn Tổng đoạn [${L}..${R}]`,
      description: `Bắt đầu từ nút gốc [0..${n - 1}] = ${tree[1].val}. Mỗi nút phân loại thành COVER (nằm trọn), SPLIT (giao một phần) hoặc SKIP (nằm ngoài).`,
      activeCodeLine: 0,
      statusTag: 'init',
      variables: [
        { name: 'Truy vấn [ql, qr]', value: `[${L}, ${R}]` },
        { name: 'Tổng tích lũy', value: '0' }
      ],
      state: { arr: [...arr], n, nodes: makeSnapshot(statuses), op, L, R, total: 0 }
    });

    const query = (node: number, l: number, r: number): number => {
      if (R < l || r < L) {
        statuses[node] = 'skip';
        steps.push({
          stepIndex: steps.length,
          title: `Nút #${node} [${l}..${r}]: Ngoài khoảng ⇒ SKIP (trả về 0)`,
          description: `Đoạn nút [${l}..${r}] không giao với truy vấn [${L}..${R}], cắt nhánh ngay!`,
          activeCodeLine: 1,
          statusTag: 'discard',
          variables: [
            { name: 'Nút hiện tại', value: `#${node} [${l}..${r}]` },
            { name: 'Trạng thái', value: 'SKIP (0)', highlight: 'warn' }
          ],
          state: { arr: [...arr], n, nodes: makeSnapshot(statuses), op, L, R, total }
        });
        return 0;
      }
      if (L <= l && r <= R) {
        statuses[node] = 'cover';
        total += tree[node].val;
        steps.push({
          stepIndex: steps.length,
          title: `Nút #${node} [${l}..${r}]: Nằm trọn ⇒ COVER (+${tree[node].val})`,
          description: `Đoạn [${l}..${r}] nằm hoàn toàn trong [${L}..${R}]. Lấy luôn st[${node}] = ${tree[node].val} mà không cần đi xuống sâu hơn!`,
          activeCodeLine: 2,
          statusTag: 'update',
          variables: [
            { name: 'Nút hiện tại', value: `#${node} [${l}..${r}]`, highlight: 'success' },
            { name: 'Cộng thêm', value: String(tree[node].val), highlight: 'success' },
            { name: 'Tổng hiện tại', value: String(total), highlight: 'info' }
          ],
          state: { arr: [...arr], n, nodes: makeSnapshot(statuses), op, L, R, total }
        });
        return tree[node].val;
      }

      statuses[node] = 'split';
      const mid = (l + r) >> 1;
      steps.push({
        stepIndex: steps.length,
        title: `Nút #${node} [${l}..${r}]: Giao một phần ⇒ SPLIT (${l}..${mid} & ${mid + 1}..${r})`,
        description: `Tách xuống hai nút con trái #${2 * node} [${l}..${mid}] và phải #${2 * node + 1} [${mid + 1}..${r}].`,
        activeCodeLine: 3,
        statusTag: 'compare',
        variables: [
          { name: 'Nút hiện tại', value: `#${node} [${l}..${r}]`, highlight: 'active' },
          { name: 'Tổng hiện tại', value: String(total) }
        ],
        state: { arr: [...arr], n, nodes: makeSnapshot(statuses), op, L, R, total }
      });
      return query(2 * node, l, mid) + query(2 * node + 1, mid + 1, r);
    };

    const finalAns = query(1, 0, n - 1);
    steps.push({
      stepIndex: steps.length,
      title: `Hoàn tất Truy vấn Sum[${L}..${R}] = ${finalAns}`,
      description: `Tổng của đoạn a[${L}..${R}] = ${finalAns}, chỉ lấy trọn ở các nút màu xanh lá (COVER).`,
      statusTag: 'done',
      variables: [{ name: `Sum[${L}..${R}]`, value: String(finalAns), highlight: 'success' }],
      state: { arr: [...arr], n, nodes: makeSnapshot(statuses), op, L, R, total: finalAns }
    });
    return steps;
  }

  // Update point
  const idx = Math.max(0, Math.min(n - 1, updIdx));
  const statuses: Record<number, SegNodeState['status']> = {};
  const nextArr = [...arr];

  steps.push({
    stepIndex: 0,
    title: `Cập nhật điểm: Gán a[${idx}] = ${updVal} (cũ = ${arr[idx]})`,
    description: `Đi từ gốc xuống lá quản lý vị trí [${idx}..${idx}], sau đó cập nhật ngược tổng lên các nút cha.`,
    statusTag: 'init',
    variables: [{ name: 'Mục tiêu', value: `a[${idx}] ← ${updVal}` }],
    state: { arr: [...nextArr], n, nodes: makeSnapshot(statuses), op, idx, updVal }
  });

  const upd = (node: number, l: number, r: number) => {
    statuses[node] = 'split';
    if (l === r) {
      tree[node].val = updVal;
      nextArr[idx] = updVal;
      statuses[node] = 'updated';
      steps.push({
        stepIndex: steps.length,
        title: `Chạm nút lá #${node} [${idx}..${idx}]: Ghi giá trị mới = ${updVal}`,
        description: `Cập nhật lá st[${node}] = ${updVal} và bắt đầu quay ngược lên cập nhật tổng nút cha.`,
        statusTag: 'update',
        variables: [{ name: `st[${node}]`, value: String(updVal), highlight: 'success' }],
        state: { arr: [...nextArr], n, nodes: makeSnapshot(statuses), op, idx, updVal }
      });
      return;
    }
    const mid = (l + r) >> 1;
    if (idx <= mid) upd(2 * node, l, mid);
    else upd(2 * node + 1, mid + 1, r);

    tree[node].val = tree[2 * node].val + tree[2 * node + 1].val;
    statuses[node] = 'updated';
    steps.push({
      stepIndex: steps.length,
      title: `Cập nhật ngược nút #${node} [${l}..${r}] = ${tree[2 * node].val} + ${tree[2 * node + 1].val} = ${tree[node].val}`,
      description: `Nút #${node} tổng hợp lại giá trị từ hai con.`,
      statusTag: 'update',
      variables: [{ name: `st[${node}]`, value: String(tree[node].val), highlight: 'success' }],
      state: { arr: [...nextArr], n, nodes: makeSnapshot(statuses), op, idx, updVal }
    });
  };
  upd(1, 0, n - 1);

  return steps;
}

// =====================================================================
// 16. QUAY LUI: XẾP N QUÂN HẬU (N-QUEENS)
// =====================================================================
export function generateNQueensSteps(rawN: number): VizStep[] {
  const N = Math.max(4, Math.min(7, rawN || 4));
  const queens: number[] = Array(N).fill(-1);
  const colUsed = Array(N).fill(false);
  const d1Used = Array(2 * N).fill(false);
  const d2Used = Array(2 * N).fill(false);
  const steps: VizStep[] = [];
  let foundSolution = false;

  steps.push({
    stepIndex: 0,
    title: `Khởi tạo Quay lui ${N}-Queens trên bàn cờ ${N}×${N}`,
    description: `Thử đặt mỗi hàng 1 quân hậu sao cho không quân nào ăn nhau theo cột, đường chéo chính (r-c+N) hoặc đường chéo phụ (r+c).`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [{ name: 'N', value: String(N) }],
    state: { N, queens: [...queens], tryRow: 0, tryCol: -1, conflict: false, solved: false }
  });

  const solve = (r: number) => {
    if (foundSolution || steps.length > 140) return;
    if (r === N) {
      foundSolution = true;
      steps.push({
        stepIndex: steps.length,
        title: `Tìm thấy nghiệm hợp lệ cho ${N}-Queens!`,
        description: `Vị trí cột của các hàng: [${queens.join(', ')}].`,
        activeCodeLine: 1,
        statusTag: 'done',
        variables: [{ name: 'Nghiệm (cột)', value: `[${queens.join(', ')}]`, highlight: 'success' }],
        state: { N, queens: [...queens], tryRow: N - 1, tryCol: -1, conflict: false, solved: true }
      });
      return;
    }

    for (let c = 0; c < N; c++) {
      if (foundSolution || steps.length > 140) return;
      const d1 = r - c + N;
      const d2 = r + c;
      const conflict = colUsed[c] || d1Used[d1] || d2Used[d2];
      if (conflict) {
        steps.push({
          stepIndex: steps.length,
          title: `Thử (${r}, ${c}): BỊ KHỐNG CHẾ ⇒ Bỏ qua`,
          description: `Ô (${r}, ${c}) bị quân hậu khác khống chế (${colUsed[c] ? 'cùng cột' : d1Used[d1] ? 'chéo chính' : 'chéo phụ'}).`,
          activeCodeLine: 3,
          statusTag: 'discard',
          variables: [
            { name: 'Thử ô', value: `(${r}, ${c})`, highlight: 'warn' },
            { name: 'Hậu đã đặt', value: `${r}/${N}` }
          ],
          state: { N, queens: [...queens], tryRow: r, tryCol: c, conflict: true, solved: false }
        });
        continue;
      }

      queens[r] = c;
      colUsed[c] = d1Used[d1] = d2Used[d2] = true;
      steps.push({
        stepIndex: steps.length,
        title: `Đặt Hậu ở (${r}, ${c}) & Đệ quy xuống hàng ${r + 1}`,
        description: `Ô (${r}, ${c}) an toàn. Đánh dấu cột ${c} và 2 đường chéo, tiến tới hàng ${r + 1}.`,
        activeCodeLine: 4,
        statusTag: 'update',
        variables: [
          { name: 'Đặt Hậu', value: `(${r}, ${c})`, highlight: 'success' },
          { name: 'Hàng tiếp', value: String(r + 1) }
        ],
        state: { N, queens: [...queens], tryRow: r, tryCol: c, conflict: false, solved: false }
      });

      solve(r + 1);
      if (foundSolution) return;

      queens[r] = -1;
      colUsed[c] = d1Used[d1] = d2Used[d2] = false;
      steps.push({
        stepIndex: steps.length,
        title: `Quay lui (Backtrack): Gỡ Hậu khỏi (${r}, ${c})`,
        description: `Nhánh con từ (${r}, ${c}) bế tắc ⇒ Gỡ hậu để thử cột khác trên hàng ${r}.`,
        activeCodeLine: 5,
        statusTag: 'backtrack',
        variables: [{ name: 'Gỡ Hậu', value: `(${r}, ${c})`, highlight: 'warn' }],
        state: { N, queens: [...queens], tryRow: r, tryCol: c, conflict: false, solved: false }
      });
    }
  };

  solve(0);
  return steps;
}
