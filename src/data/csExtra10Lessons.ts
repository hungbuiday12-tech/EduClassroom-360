import { CSLesson } from '../types';

const EXTRA_CS_SPECS: Array<{
  id: string;
  num: number;
  title: string;
  topic: string;
  phase: CSLesson['vnoiPhase'];
  time: string;
  space: string;
  theory1: string;
  cpp: string;
  py: string;
  probTitle: string;
  probDesc: string;
}> = [
  {
    id: 'cs-extra-1',
    num: 13,
    title: 'Segment Tree với Lazy Propagation (Cập nhật Đoạn)',
    topic: 'Cây phân đoạn nâng cao',
    phase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    time: 'O((N + Q) log N)',
    space: 'O(4N)',
    theory1: 'Lưu giá trị chờ `lazy[id]` trên các nút cha và chỉ đẩy xuống nút con (`push`) khi truy vấn đi qua.',
    cpp: `void push(int id, int l, int r) {
    if (!lazy[id]) return;
    int mid = (l + r) >> 1;
    st[id << 1] += lazy[id] * (mid - l + 1);
    lazy[id << 1] += lazy[id];
    st[id << 1 | 1] += lazy[id] * (r - mid);
    lazy[id << 1 | 1] += lazy[id];
    lazy[id] = 0;
}`,
    py: `def push(node, l, r):
    if lazy[node] == 0:
        return
    mid = (l + r) // 2
    st[node * 2] += lazy[node] * (mid - l + 1)
    lazy[node * 2] += lazy[node]
    st[node * 2 + 1] += lazy[node] * (r - mid)
    lazy[node * 2 + 1] += lazy[node]
    lazy[node] = 0`,
    probTitle: 'Cộng đoạn & Tính tổng đoạn [L, R]',
    probDesc: 'Cho mảng N phần tử và Q truy vấn cộng v vào đoạn [l, r] hoặc hỏi tổng đoạn [l, r].'
  },
  {
    id: 'cs-extra-2',
    num: 14,
    title: 'Cây Fenwick (Binary Indexed Tree) & Đếm Nghịch thế',
    topic: 'Cấu trúc dữ liệu gọn nhẹ',
    phase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    time: 'O(N log N)',
    space: 'O(N)',
    theory1: 'Tận dụng bit 1 thấp nhất `i & (-i)` để cập nhật điểm và tính tổng tiền tố cực nhanh trong 10 dòng code.',
    cpp: `void add(int idx, long long v) {
    for (; idx <= n; idx += idx & -idx) bit[idx] += v;
}
long long sum(int idx) {
    long long s = 0;
    for (; idx > 0; idx -= idx & -idx) s += bit[idx];
    return s;
}`,
    py: `def add(idx, val):
    while idx <= n:
        bit[idx] += val
        idx += idx & -idx

def prefix_sum(idx):
    s = 0
    while idx > 0:
        s += bit[idx]
        idx -= idx & -idx
    return s`,
    probTitle: 'Đếm số cặp nghịch thế trong mảng',
    probDesc: 'Cho hoán vị N phần tử (N ≤ 2·10⁵). Đếm số cặp i < j mà A[i] > A[j].'
  },
  {
    id: 'cs-extra-3',
    num: 15,
    title: 'Thuật toán Tarjan tìm Thành phần Liên thông Mạnh (SCC) & Cầu Khớp',
    topic: 'Đồ thị DFS chuyên sâu',
    phase: 'Phase 3 · Quy hoạch động & Đồ thị',
    time: 'O(V + E)',
    space: 'O(V + E)',
    theory1: 'Duy trì thời gian thăm `num[u]` và giá trị `low[u]` — đỉnh thấp nhất chạm tới được từ cây con u.',
    cpp: `void dfs(int u) {
    num[u] = low[u] = ++timer;
    st.push_back(u);
    for (int v : adj[u]) {
        if (!num[v]) { dfs(v); low[u] = min(low[u], low[v]); }
        else if (!comp[v]) low[u] = min(low[u], num[v]);
    }
    if (low[u] == num[u]) { ++sccCnt; /* pop stack until u */ }
}`,
    py: `def dfs(u):
    nonlocal timer, scc_cnt
    timer += 1
    num[u] = low[u] = timer
    stack.append(u)
    for v in adj[u]:
        if not num[v]:
            dfs(v)
            low[u] = min(low[u], low[v])
        elif not comp[v]:
            low[u] = min(low[u], num[v])`,
    probTitle: 'Đếm Thành phần liên thông mạnh',
    probDesc: 'Cho đồ thị có hướng N đỉnh M cạnh, in ra số thành phần liên thông mạnh.'
  },
  {
    id: 'cs-extra-4',
    num: 16,
    title: 'Lowest Common Ancestor (LCA) bằng Binary Lifting',
    topic: 'Cây & Nhảy nhị phân',
    phase: 'Phase 3 · Quy hoạch động & Đồ thị',
    time: 'O((N + Q) log N)',
    space: 'O(N log N)',
    theory1: 'Lưu tổ tiên bậc 2^k của mỗi đỉnh `up[u][k] = up[up[u][k-1]][k-1]` để nhảy lên đồng độ sâu rồi tìm LCA.',
    cpp: `int lca(int u, int v) {
    if (depth[u] < depth[v]) swap(u, v);
    int diff = depth[u] - depth[v];
    for (int k = 0; k < 20; ++k) if ((diff >> k) & 1) u = up[u][k];
    if (u == v) return u;
    for (int k = 19; k >= 0; --k)
        if (up[u][k] != up[v][k]) { u = up[u][k]; v = up[v][k]; }
    return up[u][0];
}`,
    py: `def lca(u, v):
    if depth[u] < depth[v]:
        u, v = v, u
    diff = depth[u] - depth[v]
    for k in range(20):
        if (diff >> k) & 1:
            u = up[u][k]
    if u == v:
        return u
    for k in range(19, -1, -1):
        if up[u][k] != up[v][k]:
            u, v = up[u][k], up[v][k]
    return up[u][0]`,
    probTitle: 'Khoảng cách giữa 2 đỉnh trên cây',
    probDesc: 'Trả lời Q truy vấn khoảng cách đường đi duy nhất giữa (u, v) trên cây N đỉnh.'
  },
  {
    id: 'cs-extra-5',
    num: 17,
    title: 'Trie (Cây tiền tố) & Xử lý Xâu nhị phân XOR lớn nhất',
    topic: 'Xâu & Thao tác Bit',
    phase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    time: 'O(N · 30)',
    space: 'O(N · 30)',
    theory1: 'Dựng cây nhị phân độ sâu 30 bit; với mỗi số x ưu tiên rẽ nhánh bit đối lập (1 - bit) từ MSB xuống LSB.',
    cpp: `int maxXor(int x) {
    int cur = 0, ans = 0;
    for (int b = 30; b >= 0; --b) {
        int bit = (x >> b) & 1;
        if (nxt[cur][bit ^ 1]) { ans |= (1 << b); cur = nxt[cur][bit ^ 1]; }
        else cur = nxt[cur][bit];
    }
    return ans;
}`,
    py: `def max_xor(x):
    cur = ans = 0
    for b in range(30, -1, -1):
        bit = (x >> b) & 1
        if nxt[cur][bit ^ 1]:
            ans |= (1 << b)
            cur = nxt[cur][bit ^ 1]
        else:
            cur = nxt[cur][bit]
    return ans`,
    probTitle: 'Cặp số có XOR cực đại',
    probDesc: 'Tìm giá trị lớn nhất của A[i] XOR A[j] trong mảng N số nguyên dương.'
  },
  {
    id: 'cs-extra-6',
    num: 18,
    title: 'Luồng Cực Đại trên Mạng (Dinic Max Flow)',
    topic: 'Đồ thị Luồng',
    phase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    time: 'O(E √V) trên mạng đơn vị',
    space: 'O(V + E)',
    theory1: 'Kết hợp BFS dựng đồ thị phân tầng (Level Graph) và DFS đẩy Blocking Flow với tối ưu current-arc.',
    cpp: `bool bfs() {
    fill(lvl.begin(), lvl.end(), -1);
    queue<int> q; q.push(S); lvl[S] = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (auto &e : g[u]) if (e.cap > e.flow && lvl[e.v] == -1) {
            lvl[e.v] = lvl[u] + 1; q.push(e.v);
        }
    }
    return lvl[T] != -1;
}`,
    py: `from collections import deque
def bfs():
    lvl = [-1] * n
    lvl[S] = 0
    q = deque([S])
    while q:
        u = q.popleft()
        for v, cap, flow in g[u]:
            if cap > flow and lvl[v] == -1:
                lvl[v] = lvl[u] + 1
                q.append(v)
    return lvl[T] != -1`,
    probTitle: 'Cặp ghép cực đại hai phía',
    probDesc: 'Tìm số cặp ghép lớn nhất giữa N công nhân và M công việc.'
  },
  {
    id: 'cs-extra-7',
    num: 19,
    title: 'Nhân Ma Trận Tối Ưu Truy Hồi Tuyến Tính',
    topic: 'Toán rời rạc & Quy hoạch động',
    phase: 'Phase 2 · Kỹ thuật tối ưu kinh điển',
    time: 'O(K³ log N)',
    space: 'O(K²)',
    theory1: 'Biểu diễn công thức truy hồi bậc K thành phép nhân ma trận chuyển trạng thái lũy thừa bậc N.',
    cpp: `Matrix power(Matrix A, long long p) {
    Matrix res = Matrix::identity();
    while (p > 0) {
        if (p & 1) res = res * A;
        A = A * A;
        p >>= 1;
    }
    return res;
}`,
    py: `def mat_pow(A, p, mod):
    k = len(A)
    res = [[1 if i == j else 0 for j in range(k)] for i in range(k)]
    while p:
        if p & 1:
            res = mat_mul(res, A, mod)
        A = mat_mul(A, A, mod)
        p >>= 1
    return res`,
    probTitle: 'Số Fibonacci thứ N với N ≤ 10^18',
    probDesc: 'Tính F(N) mod 10^9 + 7 trong thời gian O(log N).'
  },
  {
    id: 'cs-extra-8',
    num: 20,
    title: 'Quy Hoạch Động Bitmask (Bitmask DP)',
    topic: 'Quy hoạch động trạng thái tập hợp',
    phase: 'Phase 3 · Quy hoạch động & Đồ thị',
    time: 'O(N² · 2^N)',
    space: 'O(N · 2^N)',
    theory1: 'Mã hóa tập con các đỉnh đã đi qua bằng số nguyên N bit `mask`, chuyển trạng thái qua toán tử bit.',
    cpp: `for (int mask = 1; mask < (1 << n); ++mask)
    for (int u = 0; u < n; ++u) if (mask >> u & 1)
        for (int v = 0; v < n; ++v) if (!(mask >> v & 1))
            dp[mask | (1 << v)][v] = min(dp[mask | (1 << v)][v], dp[mask][u] + dist[u][v]);`,
    py: `for mask in range(1, 1 << n):
    for u in range(n):
        if (mask >> u) & 1:
            for v in range(n):
                if not ((mask >> v) & 1):
                    nxt = mask | (1 << v)
                    dp[nxt][v] = min(dp[nxt][v], dp[mask][u] + dist[u][v])`,
    probTitle: 'Bài toán Người du lịch (TSP)',
    probDesc: 'Đi qua tất cả N thành phố (N ≤ 16) với tổng chi phí nhỏ nhất.'
  },
  {
    id: 'cs-extra-9',
    num: 21,
    title: 'Euler Tour on Tree (Trải phẳng cây thành mảng)',
    topic: 'Cây & Cấu trúc dữ liệu',
    phase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    time: 'O(N + Q log N)',
    space: 'O(N)',
    theory1: 'Gán `tin[u]` và `tout[u]` theo thứ tự DFS; mọi đỉnh thuộc cây con gốc u nằm trọn trong đoạn `[tin[u], tout[u]]`.',
    cpp: `void dfs(int u, int p) {
    tin[u] = ++timer;
    for (int v : adj[u]) if (v != p) dfs(v, u);
    tout[u] = timer;
}`,
    py: `def dfs(u, p):
    nonlocal timer
    timer += 1
    tin[u] = timer
    for v in adj[u]:
        if v != p:
            dfs(v, u)
    tout[u] = timer`,
    probTitle: 'Tổng giá trị cây con động',
    probDesc: 'Cập nhật trọng số đỉnh u và hỏi tổng trọng số toàn bộ cây con gốc u.'
  },
  {
    id: 'cs-extra-10',
    num: 22,
    title: 'Thuật toán Mo (Chia căn truy vấn đoạn Offline)',
    topic: 'Chia căn (Sqrt Decomposition)',
    phase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    time: 'O((N + Q) √N)',
    space: 'O(N)',
    theory1: 'Sắp xếp truy vấn [L, R] theo cặp `(L / B, R)` với `B = √N` rồi trượt 2 con trỏ thêm/xóa phần tử.',
    cpp: `sort(queries.begin(), queries.end(), [&](auto &a, auto &b) {
    int ba = a.l / B, bb = b.l / B;
    return ba != bb ? ba < bb : (ba & 1 ? a.r > b.r : a.r < b.r);
});`,
    py: `B = max(1, int(n ** 0.5))
queries.sort(key=lambda q: (q[0] // B, -q[1] if (q[0] // B) & 1 else q[1]))`,
    probTitle: 'Đếm số giá trị phân biệt trong [L, R]',
    probDesc: 'Trả lời Q truy vấn đếm số phần tử khác nhau trong đoạn [L, R].'
  }
];

export const CS_EXTRA_10_LESSONS: CSLesson[] = EXTRA_CS_SPECS.map((s) => ({
  id: s.id,
  level: 'Nâng cao / HSG',
  vnoiPhase: s.phase,
  vnoiTag: 'VNOI · Chuyên đề HSG',
  lessonNumber: s.num,
  title: s.title,
  topic: s.topic,
  estimatedMinutes: 25,
  theory: [s.theory1],
  complexity: {
    time: s.time,
    space: s.space
  },
  codeExamples: [
    {
      language: 'cpp',
      title: `C++20 Chuẩn Thi Đấu · ${s.topic}`,
      code: s.cpp,
      explanation: s.theory1
    },
    {
      language: 'python',
      title: `Python 3 · ${s.topic}`,
      code: s.py,
      explanation: s.theory1
    }
  ],
  practiceProblem: {
    id: `${s.id}-prob`,
    title: s.probTitle,
    difficulty: 'Hard',
    description: s.probDesc,
    inputFormat: 'Dòng đầu chứa N, Q. Các dòng sau chứa dữ liệu mảng/cạnh và truy vấn.',
    outputFormat: 'In kết quả tương ứng trên từng dòng.',
    sampleCases: [
      { input: '5 2\n1 2 3 4 5\n1 5\n2 4', output: '15\n9', explanation: 'Ví dụ minh họa truy vấn đoạn.' }
    ],
    solutionAnalysis: s.theory1,
    fullSolutionCpp: s.cpp,
    fullSolutionPython: s.py
  }
}));
