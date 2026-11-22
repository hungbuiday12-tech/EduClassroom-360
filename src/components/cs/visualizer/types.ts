import type { CS3DSimMode } from '../CS3DVisualizer';

export type AlgoCategory =
  | 'all'
  | 'coord'
  | 'string'
  | 'array'
  | 'binary_search'
  | 'matrix_dp'
  | 'graph_tree';

export type AlgoId =
  | 'coord_hull'
  | 'coord_sweep'
  | 'string_kmp'
  | 'string_palindrome'
  | 'array_prefix_kadane'
  | 'array_two_pointers'
  | 'array_sort_stack'
  | 'binary_search'
  | 'matrix_grid'
  | 'dp_knapsack'
  | 'dp_lis'
  | 'dp_lcs'
  | 'graph_algo'
  | 'tree_segtree'
  | 'backtrack_nqueens'
  | 'number_sieve';

export interface AlgoCatalogItem {
  id: AlgoId;
  category: Exclude<AlgoCategory, 'all'>;
  titleVi: string;
  titleEn: string;
  shortTag: string;
  complexity: string;
  summaryVi: string;
  summaryEn: string;
  pseudocode: string[];
}

export interface VariableWatchItem {
  name: string;
  value: string;
  highlight?: 'info' | 'active' | 'success' | 'warn';
}

export interface VizStep<TState = any> {
  stepIndex: number;
  title: string;
  description: string;
  formula?: string;
  activeCodeLine?: number;
  statusTag?: 'init' | 'compare' | 'update' | 'discard' | 'backtrack' | 'done';
  variables: VariableWatchItem[];
  state: TState;
}

export interface Point2D {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface Segment2D {
  id: string;
  label: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface GraphNode2D {
  id: string;
  label: string;
  x: number; // normalized 0..100 or SVG coords 0..760
  y: number;
}

export interface GraphEdge2D {
  id: string;
  u: string;
  v: string;
  w: number;
}

export const LESSON_TO_ALGO_MAP: Record<string, AlgoId> = {
  'cs-1': 'array_prefix_kadane',
  'cs-2': 'number_sieve',
  'cs-3': 'string_palindrome',
  'cs-4': 'backtrack_nqueens',
  'cs-5': 'binary_search',
  'cs-6': 'array_two_pointers',
  'cs-7': 'dp_knapsack',
  'cs-8': 'graph_algo',
  'cs-9': 'tree_segtree',
  'cs-10': 'number_sieve',
  'cs-11': 'array_sort_stack',
  'cs-12': 'string_kmp',
  'cs-13': 'tree_segtree',
  'cs-14': 'tree_segtree',
  'cs-15': 'string_kmp',
  'cs-16': 'string_palindrome',
  'cs-17': 'graph_algo',
  'cs-18': 'graph_algo',
  'cs-19': 'tree_segtree',
  'cs-20': 'dp_knapsack',
  'cs-21': 'coord_hull',
  'cs-22': 'matrix_grid'
};

export const LESSON_TO_CS3D_MAP: Record<string, CS3DSimMode> = {
  'cs-1': 'sort_3d',
  'cs-2': 'bst_3d',
  'cs-3': 'trie_3d',
  'cs-4': 'maze_3d',
  'cs-5': 'bst_3d',
  'cs-6': 'sort_3d',
  'cs-7': 'dp_table_3d',
  'cs-8': 'graph_3d',
  'cs-9': 'segtree_3d',
  'cs-10': 'bst_3d',
  'cs-11': 'stack_queue_3d',
  'cs-12': 'trie_3d',
  'cs-13': 'segtree_3d',
  'cs-14': 'segtree_3d',
  'cs-15': 'trie_3d',
  'cs-16': 'trie_3d',
  'cs-17': 'graph_3d',
  'cs-18': 'flow_network_3d',
  'cs-19': 'segtree_3d',
  'cs-20': 'dp_table_3d',
  'cs-21': 'dp_table_3d',
  'cs-22': 'spatial_octree_3d'
};

export const ALGO_CATALOG: AlgoCatalogItem[] = [
  {
    id: 'coord_hull',
    category: 'coord',
    titleVi: 'Tọa độ Oxy: Bao lồi (Convex Hull)',
    titleEn: '2D Coordinates: Convex Hull (Monotone Chain)',
    shortTag: 'Oxy · Hình học',
    complexity: 'O(N log N)',
    summaryVi:
      'Sắp xếp điểm theo hoành độ Ox, dùng tích có hướng (Cross Product) dựng bao dưới và bao trên.',
    summaryEn:
      'Sort 2D points by x, use vector cross product to construct lower & upper convex hull.',
    pseudocode: [
      'sort(pts by x, then y)',
      'for p in pts: // Lower Hull',
      '  while len(L)>=2 and cross(L[-2], L[-1], p) <= 0: L.pop()',
      '  L.push(p)',
      'for p in reversed(pts): // Upper Hull',
      '  while len(U)>=2 and cross(U[-2], U[-1], p) <= 0: U.pop()',
      '  U.push(p)',
      'hull = L[:-1] + U[:-1]'
    ]
  },
  {
    id: 'coord_sweep',
    category: 'coord',
    titleVi: 'Tọa độ Oxy: Đường quét & Giao đoạn thẳng',
    titleEn: '2D Coordinates: Line Sweep & Segment Intersection',
    shortTag: 'Oxy · Sweep Line',
    complexity: 'O(N² / (N+K) log N)',
    summaryVi:
      'Quét đường thẳng đứng x = x_sweep qua các đầu mút đoạn thẳng, kiểm tra định hướng CCW để tìm giao điểm.',
    summaryEn:
      'Sweep a vertical line across segment endpoints and test CCW orientation for intersections.',
    pseudocode: [
      'events = sort([(x_start, ADD, seg), (x_end, REM, seg)])',
      'for (x, type, seg) in events:',
      '  if type == ADD:',
      '    for act in activeSet: checkIntersect(seg, act)',
      '    activeSet.insert(seg)',
      '  else: activeSet.remove(seg)'
    ]
  },
  {
    id: 'string_kmp',
    category: 'string',
    titleVi: 'Xâu: KMP & Hàm tiền tố π[i]',
    titleEn: 'Strings: KMP Pattern Matching & Prefix Function',
    shortTag: 'Xâu · KMP',
    complexity: 'O(|T| + |P|)',
    summaryVi:
      'Tính mảng tiền tố π (LPS) để không bao giờ lùi con trỏ i trên văn bản T khi gặp ký tự không khớp.',
    summaryEn:
      'Precompute prefix function π (LPS) to skip redundant comparisons without backtracking i.',
    pseudocode: [
      '// Pha 1: Tính mảng π cho P',
      'for i = 1..m-1:',
      '  while j > 0 and P[i] != P[j]: j = pi[j-1]',
      '  if P[i] == P[j]: j += 1; pi[i] = j',
      '// Pha 2: Khớp mẫu P trong T',
      'for i = 0..n-1:',
      '  while j > 0 and T[i] != P[j]: j = pi[j-1]',
      '  if T[i] == P[j]: j += 1',
      '  if j == m: recordMatch(i - m + 1); j = pi[j-1]'
    ]
  },
  {
    id: 'string_palindrome',
    category: 'string',
    titleVi: 'Xâu: Đối xứng Palindrome & Mở rộng tâm',
    titleEn: 'Strings: Palindrome Two-Pointers & Expand Center',
    shortTag: 'Xâu · Palindrome',
    complexity: 'O(N) / O(N²)',
    summaryVi:
      'Kiểm tra đối xứng bằng hai con trỏ l, r hoặc mở rộng từ mọi tâm lẻ/chẵn để tìm xâu con đối xứng dài nhất.',
    summaryEn:
      'Verify palindromes via converging pointers or expand around every odd/even center.',
    pseudocode: [
      'for center in 0..n-1:',
      '  expand(center, center)     // Tâm lẻ',
      '  expand(center, center + 1) // Tâm chẵn',
      'func expand(l, r):',
      '  while l >= 0 and r < n and S[l] == S[r]:',
      '    updateBest(l, r); l--; r++'
    ]
  },
  {
    id: 'array_prefix_kadane',
    category: 'array',
    titleVi: 'Mảng 1D: Cộng dồn (Prefix Sum) & Kadane',
    titleEn: '1D Array: Prefix Sum & Kadane Max Subarray',
    shortTag: 'Mảng 1D · O(1)/O(N)',
    complexity: 'O(N)',
    summaryVi:
      'Biểu đồ cột mảng a[i], mảng cộng dồn pref[i] truy vấn đoạn [L, R] trong O(1) và thuật toán Kadane tìm đoạn tổng lớn nhất.',
    summaryEn:
      'Visualize 1D array bars, O(1) prefix sum range queries, and Kadane maximum subarray.',
    pseudocode: [
      'pref[0] = 0; cur = 0; best = -INF',
      'for i = 0..n-1:',
      '  pref[i+1] = pref[i] + a[i]',
      '  cur = max(a[i], cur + a[i])',
      '  best = max(best, cur)',
      '// Query [L, R] = pref[R+1] - pref[L]'
    ]
  },
  {
    id: 'array_two_pointers',
    category: 'array',
    titleVi: 'Mảng 1D: Hai Con Trỏ & Cửa Sổ Trượt',
    titleEn: '1D Array: Two Pointers & Sliding Window',
    shortTag: 'Mảng 1D · L..R',
    complexity: 'O(N)',
    summaryVi:
      'Di chuyển đồng thời hai con trỏ L và R để tìm đoạn con liên tiếp dài nhất có tổng ≤ S.',
    summaryEn:
      'Slide left (L) and right (R) pointers in linear time to find longest subarray with sum ≤ S.',
    pseudocode: [
      'L = 0; curSum = 0; bestLen = 0',
      'for R = 0..n-1:',
      '  curSum += a[R]',
      '  while curSum > S and L <= R:',
      '    curSum -= a[L]; L += 1',
      '  bestLen = max(bestLen, R - L + 1)'
    ]
  },
  {
    id: 'array_sort_stack',
    category: 'array',
    titleVi: 'Mảng 1D: QuickSort / MergeSort & Stack Đơn Điệu',
    titleEn: '1D Array: QuickSort / MergeSort & Monotonic Stack',
    shortTag: 'Sort · Stack',
    complexity: 'O(N log N) / O(N)',
    summaryVi:
      'Quan sát chia để trị QuickSort, MergeSort hoặc ngăn xếp đơn điệu tìm phần tử nhỏ hơn gần nhất bên trái.',
    summaryEn:
      'Trace QuickSort partitions, MergeSort merges, or Monotonic Stack nearest smaller element.',
    pseudocode: [
      '// Monotonic Stack (Nearest Smaller Left)',
      'for i = 0..n-1:',
      '  while st not empty and a[st.top()] >= a[i]:',
      '    st.pop()',
      '  ans[i] = st.empty() ? -1 : st.top()',
      '  st.push(i)'
    ]
  },
  {
    id: 'binary_search',
    category: 'binary_search',
    titleVi: 'Chặt Nhị Phân (Mảng & Chặt Kết Quả)',
    titleEn: 'Binary Search (Array & Binary Search on Answer)',
    shortTag: 'O(log N) · Đồ thị f(mid)',
    complexity: 'O(log N) / O(N log Sum)',
    summaryVi:
      'Thu hẹp nửa khoảng [lo, hi] trên mảng sắp xếp hoặc vẽ đồ thị hàm đơn điệu f(mid) để chặt nhị phân kết quả chia K đoạn.',
    summaryEn:
      'Narrow [lo, hi] on sorted arrays or inspect the monotonic f(mid) curve for Binary Search on Answer.',
    pseudocode: [
      'lo = max(a); hi = sum(a); ans = hi',
      'while lo <= hi:',
      '  mid = (lo + hi) >> 1',
      '  if segmentsNeeded(mid) <= K:',
      '    ans = mid; hi = mid - 1  // Thử nhỏ hơn',
      '  else: lo = mid + 1         // Cần tăng ngưỡng'
    ]
  },
  {
    id: 'matrix_grid',
    category: 'matrix_dp',
    titleVi: 'Mảng 2D: Loang BFS/Dijkstra & Cộng Dồn 2D',
    titleEn: '2D Matrix: Grid BFS/Dijkstra & 2D Prefix Sum',
    shortTag: 'Mảng 2D · Grid',
    complexity: 'O(R·C) / O(1) Query',
    summaryVi:
      'Tương tác trực tiếp trên ma trận 2D: đặt tường, tìm đường ngắn nhất S→T bằng BFS/Dijkstra hoặc tính tổng hình chữ nhật O(1).',
    summaryEn:
      'Interactive 2D matrix: toggle walls, animate BFS/Dijkstra shortest path, or visualize 2D inclusion-exclusion.',
    pseudocode: [
      'queue.push(S); dist[S] = 0',
      'while !queue.empty():',
      '  (r, c) = queue.pop()',
      '  for (nr, nc) in 4_neighbors(r, c):',
      '    if valid(nr, nc) and dist[nr][nc] > dist[r][c] + cost:',
      '      dist[nr][nc] = dist[r][c] + cost; queue.push((nr, nc))'
    ]
  },
  {
    id: 'dp_knapsack',
    category: 'matrix_dp',
    titleVi: 'DP: Cái Túi 0/1 (Knapsack) & Bảng Phương Án',
    titleEn: 'DP: 0/1 Knapsack Table & Backtracking',
    shortTag: 'DP · Bảng 2D',
    complexity: 'O(N · W)',
    summaryVi:
      'Điền bảng dp[i][w] theo công thức chuyển trạng thái Chọn / Không chọn và truy vết ngược các món đồ được lấy.',
    summaryEn:
      'Fill dp[i][w] transitions step by step and backtrack the optimal selected items.',
    pseudocode: [
      'for i = 1..N:',
      '  for w = 0..W:',
      '    dp[i][w] = dp[i-1][w] // Không chọn vật i',
      '    if w >= weight[i]:',
      '      dp[i][w] = max(dp[i][w], dp[i-1][w - weight[i]] + val[i])',
      '// Truy vết từ dp[N][W] ngược về i=1'
    ]
  },
  {
    id: 'dp_lis',
    category: 'matrix_dp',
    titleVi: 'DP: Dãy Con Tăng Dài Nhất (LIS O(N²) & O(N log N))',
    titleEn: 'DP: Longest Increasing Subsequence',
    shortTag: 'DP · LIS',
    complexity: 'O(N log N)',
    summaryVi:
      'Mô phỏng đồng thời mảng dp[i] cổ điển và mảng tails[] chặt nhị phân lower_bound để dựng LIS tối ưu.',
    summaryEn:
      'Animate classical dp[i] and Patience Sorting tails[] with binary search replacement.',
    pseudocode: [
      'tails = []',
      'for i = 0..n-1:',
      '  pos = lower_bound(tails, a[i])',
      '  if pos == len(tails): tails.push(a[i])',
      '  else: tails[pos] = a[i]',
      '  dp[i] = pos + 1'
    ]
  },
  {
    id: 'dp_lcs',
    category: 'matrix_dp',
    titleVi: 'DP: Xâu Con Chung Dài Nhất (LCS)',
    titleEn: 'DP: Longest Common Subsequence Matrix',
    shortTag: 'DP · Xâu 2D',
    complexity: 'O(|A| · |B|)',
    summaryVi:
      'Bảng DP 2 chiều so khớp hai xâu A và B, mũi tên chéo khi A[i-1] == B[j-1] và truy vết xâu chung dài nhất.',
    summaryEn:
      'Step through the 2D LCS matrix with diagonal match transitions and string reconstruction.',
    pseudocode: [
      'for i = 1..|A|:',
      '  for j = 1..|B|:',
      '    if A[i-1] == B[j-1]: dp[i][j] = dp[i-1][j-1] + 1',
      '    else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
      '// Truy vết từ (|A|, |B|) về (0, 0)'
    ]
  },
  {
    id: 'graph_algo',
    category: 'graph_tree',
    titleVi: 'Đồ thị: Dijkstra · BFS · DFS · Kruskal MST',
    titleEn: 'Graph: Dijkstra · BFS · DFS · Kruskal MST',
    shortTag: 'Đồ thị · PQ/DSU',
    complexity: 'O((V+E) log V)',
    summaryVi:
      'Đồ thị tương tác kéo thả đỉnh, tùy chỉnh cạnh có hướng/vô hướng, mô phỏng Priority Queue (Dijkstra), BFS, DFS và DSU (Kruskal).',
    summaryEn:
      'Interactive draggable node-edge graph visualizing Dijkstra Priority Queue, BFS, DFS, and Kruskal MST.',
    pseudocode: [
      'dist[S] = 0; pq.push((0, S))',
      'while !pq.empty():',
      '  (d, u) = pq.pop()',
      '  if d > dist[u]: continue',
      '  for (v, w) in adj[u]:',
      '    if dist[u] + w < dist[v]:',
      '      dist[v] = dist[u] + w; parent[v] = u; pq.push((dist[v], v))'
    ]
  },
  {
    id: 'tree_segtree',
    category: 'graph_tree',
    titleVi: 'Cây Phân Đoạn (Segment Tree)',
    titleEn: 'Segment Tree: Range Query & Point Update',
    shortTag: 'Cây · O(log N)',
    complexity: 'O(log N)',
    summaryVi:
      'Vẽ cây nhị phân quản lý đoạn [l..r], mô phỏng đệ quy truy vấn tổng/min đoạn [L, R] và cập nhật điểm a[idx] = val.',
    summaryEn:
      'Interactive binary tree over array intervals visualizing O(log N) range queries and point updates.',
    pseudocode: [
      'func query(node, l, r, ql, qr):',
      '  if qr < l or r < ql: return 0           // Bỏ qua [SKIP]',
      '  if ql <= l and r <= qr: return st[node] // Lấy trọn [COVER]',
      '  mid = (l + r) / 2                       // Chia đôi [SPLIT]',
      '  return query(2*node, l, mid, ql, qr) + query(2*node+1, mid+1, r, ql, qr)'
    ]
  },
  {
    id: 'backtrack_nqueens',
    category: 'graph_tree',
    titleVi: 'Quay Lui (Backtracking): Xếp N Quân Hậu',
    titleEn: 'Backtracking: N-Queens Chessboard',
    shortTag: 'Đệ quy · Quay lui',
    complexity: 'O(N!)',
    summaryVi:
      'Bàn cờ N×N trực quan hóa tia khống chế hàng/cột/hai đường chéo và quá trình thử-sai quay lui.',
    summaryEn:
      'Visualize row/column/diagonal attack beams and recursive backtracking on an N×N board.',
    pseudocode: [
      'func tryRow(r):',
      '  if r == N: recordSolution(); return',
      '  for c = 0..N-1:',
      '    if !col[c] and !diag1[r-c+N] and !diag2[r+c]:',
      '      placeQueen(r, c); tryRow(r + 1)',
      '      removeQueen(r, c) // Quay lui'
    ]
  },
  {
    id: 'number_sieve',
    category: 'array',
    titleVi: 'Số học: Sàng Eratosthenes & Lũy Thừa Nhị Phân',
    titleEn: 'Number Theory: Sieve of Eratosthenes & Binary Exponentiation',
    shortTag: 'Số học · O(N log log N)',
    complexity: 'O(N log log N) / O(log B)',
    summaryVi:
      'Lưới số 2..N gạch bội số nguyên tố p²..N hoặc theo dõi từng bit khi tính a^b mod m.',
    summaryEn:
      'Animate Eratosthenes prime sieving on a 2..N grid or bit-by-bit modular binary exponentiation.',
    pseudocode: [
      'isPrime[2..N] = true',
      'for p = 2..sqrt(N):',
      '  if isPrime[p]:',
      '    for m = p*p; m <= N; m += p:',
      '      isPrime[m] = false // Gạch bội của p'
    ]
  }
];
