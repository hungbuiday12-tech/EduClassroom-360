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
  inputFormat: string;
  outputFormat: string;
  sampleCases: Array<{ input: string; output: string; explanation: string }>;
  fullCpp: string;
  fullPy: string;
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
    probDesc: 'Cho mảng N phần tử (1-indexed) và Q truy vấn: `1 l r v` cộng v vào mọi phần tử thuộc [l, r]; `2 l r` in tổng đoạn [l, r].',
    inputFormat: 'Dòng 1: N, Q. Dòng 2: N số nguyên A[1..N]. Q dòng sau: mỗi dòng `1 l r v` hoặc `2 l r`.',
    outputFormat: 'Với mỗi truy vấn loại 2, in ra tổng đoạn [l, r] trên một dòng.',
    sampleCases: [
      { input: '4 3\n10 20 30 40\n2 1 4\n1 1 2 5\n2 1 3', output: '100\n70', explanation: 'Tổng ban đầu [1,4] = 100. Sau khi cộng 5 vào [1,2], mảng thành [15,25,30,40] nên tổng [1,3] = 70.' }
    ],
    fullCpp: `#include <iostream>
#include <vector>
using namespace std;

int n, q;
vector<long long> a, st, lazy;

void build(int id, int l, int r) {
    if (l == r) { st[id] = a[l]; return; }
    int mid = (l + r) >> 1;
    build(id << 1, l, mid);
    build(id << 1 | 1, mid + 1, r);
    st[id] = st[id << 1] + st[id << 1 | 1];
}

void push(int id, int l, int r) {
    if (!lazy[id]) return;
    int mid = (l + r) >> 1;
    st[id << 1] += lazy[id] * (mid - l + 1);
    lazy[id << 1] += lazy[id];
    st[id << 1 | 1] += lazy[id] * (r - mid);
    lazy[id << 1 | 1] += lazy[id];
    lazy[id] = 0;
}

void update(int id, int l, int r, int u, int v, long long val) {
    if (v < l || r < u) return;
    if (u <= l && r <= v) {
        st[id] += val * (r - l + 1);
        lazy[id] += val;
        return;
    }
    push(id, l, r);
    int mid = (l + r) >> 1;
    update(id << 1, l, mid, u, v, val);
    update(id << 1 | 1, mid + 1, r, u, v, val);
    st[id] = st[id << 1] + st[id << 1 | 1];
}

long long query(int id, int l, int r, int u, int v) {
    if (v < l || r < u) return 0;
    if (u <= l && r <= v) return st[id];
    push(id, l, r);
    int mid = (l + r) >> 1;
    return query(id << 1, l, mid, u, v) + query(id << 1 | 1, mid + 1, r, u, v);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    if (!(cin >> n >> q)) return 0;
    a.assign(n + 1, 0);
    st.assign(4 * n + 5, 0);
    lazy.assign(4 * n + 5, 0);
    for (int i = 1; i <= n; ++i) cin >> a[i];
    build(1, 1, n);
    while (q--) {
        int t, l, r;
        cin >> t >> l >> r;
        if (t == 1) {
            long long v; cin >> v;
            update(1, 1, n, l, r, v);
        } else {
            cout << query(1, 1, n, l, r) << '\\n';
        }
    }
    return 0;
}`,
    fullPy: `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n, q = next(it), next(it)
    a = [0] + [next(it) for _ in range(n)]
    st = [0] * (4 * n + 5)
    lazy = [0] * (4 * n + 5)

    def build(node, l, r):
        if l == r:
            st[node] = a[l]
            return
        mid = (l + r) // 2
        build(node * 2, l, mid)
        build(node * 2 + 1, mid + 1, r)
        st[node] = st[node * 2] + st[node * 2 + 1]

    def push(node, l, r):
        if lazy[node]:
            mid = (l + r) // 2
            st[node * 2] += lazy[node] * (mid - l + 1)
            lazy[node * 2] += lazy[node]
            st[node * 2 + 1] += lazy[node] * (r - mid)
            lazy[node * 2 + 1] += lazy[node]
            lazy[node] = 0

    def update(node, l, r, u, v, val):
        if v < l or r < u:
            return
        if u <= l and r <= v:
            st[node] += val * (r - l + 1)
            lazy[node] += val
            return
        push(node, l, r)
        mid = (l + r) // 2
        update(node * 2, l, mid, u, v, val)
        update(node * 2 + 1, mid + 1, r, u, v, val)
        st[node] = st[node * 2] + st[node * 2 + 1]

    def query(node, l, r, u, v):
        if v < l or r < u:
            return 0
        if u <= l and r <= v:
            return st[node]
        push(node, l, r)
        mid = (l + r) // 2
        return query(node * 2, l, mid, u, v) + query(node * 2 + 1, mid + 1, r, u, v)

    build(1, 1, n)
    out = []
    for _ in range(q):
        t = next(it)
        l, r = next(it), next(it)
        if t == 1:
            v = next(it)
            update(1, 1, n, l, r, v)
        else:
            out.append(str(query(1, 1, n, l, r)))
    sys.stdout.write("\\n".join(out))

solve()`
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
    probDesc: 'Cho hoán vị N phần tử (N ≤ 2·10⁵). Đếm số cặp chỉ số i < j thỏa mãn A[i] > A[j].',
    inputFormat: 'Dòng 1: số nguyên N. Dòng 2: N số nguyên của mảng A.',
    outputFormat: 'Một số nguyên duy nhất là số cặp nghịch thế.',
    sampleCases: [
      { input: '4\n4 3 2 1', output: '6', explanation: 'Mọi cặp trong 4 phần tử đều nghịch thế: C(4,2) = 6.' }
    ],
    fullCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    vector<long long> a(n), vals(n);
    for (int i = 0; i < n; ++i) { cin >> a[i]; vals[i] = a[i]; }
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    int m = (int)vals.size();
    vector<long long> bit(m + 1, 0);
    auto add = [&](int idx) {
        for (; idx <= m; idx += idx & -idx) bit[idx]++;
    };
    auto sum = [&](int idx) {
        long long s = 0;
        for (; idx > 0; idx -= idx & -idx) s += bit[idx];
        return s;
    };
    long long ans = 0;
    for (int i = 0; i < n; ++i) {
        int id = (int)(lower_bound(vals.begin(), vals.end(), a[i]) - vals.begin()) + 1;
        ans += sum(m) - sum(id);
        add(id);
    }
    cout << ans << '\\n';
    return 0;
}`,
    fullPy: `import sys
from bisect import bisect_left

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))
    vals = sorted(set(a))
    m = len(vals)
    bit = [0] * (m + 1)

    def add(idx):
        while idx <= m:
            bit[idx] += 1
            idx += idx & -idx

    def query(idx):
        s = 0
        while idx > 0:
            s += bit[idx]
            idx -= idx & -idx
        return s

    ans = 0
    for i, x in enumerate(a):
        idx = bisect_left(vals, x) + 1
        ans += i - query(idx)
        add(idx)
    print(ans)

solve()`
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
    probDesc: 'Cho đồ thị có hướng N đỉnh (1..N), M cạnh u -> v. Hãy đếm và in ra số thành phần liên thông mạnh (SCC).',
    inputFormat: 'Dòng 1: N, M. M dòng tiếp theo, mỗi dòng gồm 2 số u v biểu diễn cạnh có hướng u -> v.',
    outputFormat: 'Một số nguyên duy nhất là số lượng SCC.',
    sampleCases: [
      { input: '4 4\n1 2\n2 3\n3 1\n3 4', output: '2', explanation: 'Gồm 2 SCC là {1, 2, 3} và {4}.' }
    ],
    fullCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int timer = 0, sccCnt = 0;
vector<vector<int>> adj;
vector<int> num, low, comp, st;

void dfs(int u) {
    num[u] = low[u] = ++timer;
    st.push_back(u);
    for (int v : adj[u]) {
        if (!num[v]) {
            dfs(v);
            low[u] = min(low[u], low[v]);
        } else if (!comp[v]) {
            low[u] = min(low[u], num[v]);
        }
    }
    if (low[u] == num[u]) {
        ++sccCnt;
        while (true) {
            int w = st.back();
            st.pop_back();
            comp[w] = sccCnt;
            if (w == u) break;
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    adj.assign(n + 1, {});
    num.assign(n + 1, 0);
    low.assign(n + 1, 0);
    comp.assign(n + 1, 0);
    for (int i = 0; i < m; ++i) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v);
    }
    for (int i = 1; i <= n; ++i) if (!num[i]) dfs(i);
    cout << sccCnt << '\\n';
    return 0;
}`,
    fullPy: `import sys
sys.setrecursionlimit(200000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n, m = next(it), next(it)
    adj = [[] for _ in range(n + 1)]
    for _ in range(m):
        u, v = next(it), next(it)
        adj[u].append(v)

    num = [0] * (n + 1)
    low = [0] * (n + 1)
    comp = [0] * (n + 1)
    st = []
    timer = 0
    scc = 0

    def dfs(u):
        nonlocal timer, scc
        timer += 1
        num[u] = low[u] = timer
        st.append(u)
        for v in adj[u]:
            if not num[v]:
                dfs(v)
                if low[v] < low[u]:
                    low[u] = low[v]
            elif not comp[v]:
                if num[v] < low[u]:
                    low[u] = num[v]
        if low[u] == num[u]:
            scc += 1
            while True:
                w = st.pop()
                comp[w] = scc
                if w == u:
                    break

    for i in range(1, n + 1):
        if not num[i]:
            dfs(i)
    print(scc)

solve()`
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
    probDesc: 'Cho cây N đỉnh (1..N). Trả lời Q truy vấn tìm độ dài đường đi ngắn nhất (số cạnh) giữa hai đỉnh u và v.',
    inputFormat: 'Dòng 1: N, Q. N-1 dòng tiếp theo: mỗi dòng chứa u, v là một cạnh cây. Q dòng sau: mỗi dòng chứa u, v.',
    outputFormat: 'In kết quả từng truy vấn trên một dòng.',
    sampleCases: [
      { input: '5 2\n1 2\n1 3\n2 4\n2 5\n4 5\n3 4', output: '2\n3', explanation: '4-2-5 có độ dài 2; 3-1-2-4 có độ dài 3.' }
    ],
    fullCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

const int LOG = 19;
vector<vector<int>> adj, up;
vector<int> depth;

void dfs(int u, int p) {
    up[u][0] = p;
    for (int k = 1; k < LOG; ++k) up[u][k] = up[up[u][k - 1]][k - 1];
    for (int v : adj[u]) {
        if (v != p) {
            depth[v] = depth[u] + 1;
            dfs(v, u);
        }
    }
}

int lca(int u, int v) {
    if (depth[u] < depth[v]) swap(u, v);
    int diff = depth[u] - depth[v];
    for (int k = 0; k < LOG; ++k) if ((diff >> k) & 1) u = up[u][k];
    if (u == v) return u;
    for (int k = LOG - 1; k >= 0; --k)
        if (up[u][k] != up[v][k]) { u = up[u][k]; v = up[v][k]; }
    return up[u][0];
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    adj.assign(n + 1, {});
    up.assign(n + 1, vector<int>(LOG, 1));
    depth.assign(n + 1, 0);
    for (int i = 0; i < n - 1; ++i) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    dfs(1, 1);
    while (q--) {
        int u, v; cin >> u >> v;
        int w = lca(u, v);
        cout << depth[u] + depth[v] - 2 * depth[w] << '\\n';
    }
    return 0;
}`,
    fullPy: `import sys
sys.setrecursionlimit(200000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n, q = next(it), next(it)
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = next(it), next(it)
        adj[u].append(v)
        adj[v].append(u)
    LOG = 19
    up = [[1] * LOG for _ in range(n + 1)]
    depth = [0] * (n + 1)

    def dfs(u, p):
        up[u][0] = p
        for k in range(1, LOG):
            up[u][k] = up[up[u][k - 1]][k - 1]
        for v in adj[u]:
            if v != p:
                depth[v] = depth[u] + 1
                dfs(v, u)

    def lca(u, v):
        if depth[u] < depth[v]:
            u, v = v, u
        diff = depth[u] - depth[v]
        for k in range(LOG):
            if (diff >> k) & 1:
                u = up[u][k]
        if u == v:
            return u
        for k in range(LOG - 1, -1, -1):
            if up[u][k] != up[v][k]:
                u, v = up[u][k], up[v][k]
        return up[u][0]

    dfs(1, 1)
    out = []
    for _ in range(q):
        u, v = next(it), next(it)
        w = lca(u, v)
        out.append(str(depth[u] + depth[v] - 2 * depth[w]))
    sys.stdout.write("\\n".join(out))

solve()`
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
    probDesc: 'Cho mảng N số nguyên không âm. Tìm giá trị lớn nhất của (A[i] XOR A[j]) với i ≠ j.',
    inputFormat: 'Dòng 1: số nguyên N (N ≥ 2). Dòng 2: N số nguyên A[1..N].',
    outputFormat: 'Một số nguyên duy nhất là giá trị XOR cực đại.',
    sampleCases: [
      { input: '4\n3 10 5 25', output: '28', explanation: '5 XOR 25 = 00101 XOR 11001 = 11100 = 28.' }
    ],
    fullCpp: `#include <iostream>
#include <vector>
#include <array>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];
    vector<array<int, 2>> nxt(1, {0, 0});
    auto insert = [&](int x) {
        int cur = 0;
        for (int b = 30; b >= 0; --b) {
            int bit = (x >> b) & 1;
            if (!nxt[cur][bit]) {
                nxt[cur][bit] = (int)nxt.size();
                nxt.push_back({0, 0});
            }
            cur = nxt[cur][bit];
        }
    };
    auto maxXor = [&](int x) {
        int cur = 0, ans = 0;
        for (int b = 30; b >= 0; --b) {
            int bit = (x >> b) & 1;
            if (nxt[cur][bit ^ 1]) {
                ans |= (1 << b);
                cur = nxt[cur][bit ^ 1];
            } else {
                cur = nxt[cur][bit];
            }
        }
        return ans;
    };
    insert(a[0]);
    int ans = 0;
    for (int i = 1; i < n; ++i) {
        ans = max(ans, maxXor(a[i]));
        insert(a[i]);
    }
    cout << ans << '\\n';
    return 0;
}`,
    fullPy: `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))
    nxt = [[0, 0]]

    def insert(x):
        cur = 0
        for b in range(30, -1, -1):
            bit = (x >> b) & 1
            if not nxt[cur][bit]:
                nxt[cur][bit] = len(nxt)
                nxt.append([0, 0])
            cur = nxt[cur][bit]

    def max_xor(x):
        cur = ans = 0
        for b in range(30, -1, -1):
            bit = (x >> b) & 1
            if nxt[cur][bit ^ 1]:
                ans |= (1 << b)
                cur = nxt[cur][bit ^ 1]
            else:
                cur = nxt[cur][bit]
        return ans

    insert(a[0])
    ans = 0
    for x in a[1:]:
        ans = max(ans, max_xor(x))
        insert(x)
    print(ans)

solve()`
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
    probDesc: 'Có N công nhân (1..N) và M công việc (1..M), cùng K cặp (u, v) cho biết công nhân u làm được việc v. Mỗi người nhận tối đa 1 việc và ngược lại. Tìm số cặp ghép lớn nhất.',
    inputFormat: 'Dòng 1: N, M, K. K dòng sau: mỗi dòng gồm u (1..N) và v (1..M).',
    outputFormat: 'Một số nguyên duy nhất là số cặp ghép tối đa.',
    sampleCases: [
      { input: '3 3 4\n1 1\n1 2\n2 2\n3 3', output: '3', explanation: 'Ghép (1,1), (2,2), (3,3) được 3 cặp.' }
    ],
    fullCpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

struct Edge { int v, cap, flow, rev; };

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, k;
    if (!(cin >> n >> m >> k)) return 0;
    int S = 0, T = n + m + 1, V = T + 1;
    vector<vector<Edge>> g(V);
    auto addEdge = [&](int u, int v, int c) {
        g[u].push_back({v, c, 0, (int)g[v].size()});
        g[v].push_back({u, 0, 0, (int)g[u].size() - 1});
    };
    for (int i = 1; i <= n; ++i) addEdge(S, i, 1);
    for (int j = 1; j <= m; ++j) addEdge(n + j, T, 1);
    for (int i = 0; i < k; ++i) {
        int u, v; cin >> u >> v;
        addEdge(u, n + v, 1);
    }
    vector<int> lvl(V), ptr(V);
    auto bfs = [&]() {
        fill(lvl.begin(), lvl.end(), -1);
        queue<int> q; q.push(S); lvl[S] = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (auto &e : g[u]) {
                if (e.cap > e.flow && lvl[e.v] == -1) {
                    lvl[e.v] = lvl[u] + 1;
                    q.push(e.v);
                }
            }
        }
        return lvl[T] != -1;
    };
    auto dfs = [&](auto& self, int u, int pushed) -> int {
        if (!pushed || u == T) return pushed;
        for (int &cid = ptr[u]; cid < (int)g[u].size(); ++cid) {
            auto &e = g[u][cid];
            if (lvl[u] + 1 != lvl[e.v] || e.cap == e.flow) continue;
            int tr = self(self, e.v, min(pushed, e.cap - e.flow));
            if (tr > 0) {
                e.flow += tr;
                g[e.v][e.rev].flow -= tr;
                return tr;
            }
        }
        return 0;
    };
    int flow = 0;
    while (bfs()) {
        fill(ptr.begin(), ptr.end(), 0);
        while (int pushed = dfs(dfs, S, 1e9)) flow += pushed;
    }
    cout << flow << '\\n';
    return 0;
}`,
    fullPy: `import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n, m, k = next(it), next(it), next(it)
    S, T = 0, n + m + 1
    V = T + 1
    g = [[] for _ in range(V)]

    def add_edge(u, v, cap):
        g[u].append([v, cap, len(g[v])])
        g[v].append([u, 0, len(g[u]) - 1])

    for i in range(1, n + 1):
        add_edge(S, i, 1)
    for j in range(1, m + 1):
        add_edge(n + j, T, 1)
    for _ in range(k):
        u, v = next(it), next(it)
        add_edge(u, n + v, 1)

    flow = 0
    while True:
        lvl = [-1] * V
        lvl[S] = 0
        q = deque([S])
        while q:
            u = q.popleft()
            for v, cap, _ in g[u]:
                if cap > 0 and lvl[v] == -1:
                    lvl[v] = lvl[u] + 1
                    q.append(v)
        if lvl[T] == -1:
            break
        ptr = [0] * V

        def dfs(u, pushed):
            if u == T or pushed == 0:
                return pushed
            while ptr[u] < len(g[u]):
                v, cap, rev = g[u][ptr[u]]
                if lvl[v] == lvl[u] + 1 and cap > 0:
                    tr = dfs(v, min(pushed, cap))
                    if tr > 0:
                        g[u][ptr[u]][1] -= tr
                        g[v][rev][1] += tr
                        return tr
                ptr[u] += 1
            return 0

        while True:
            pushed = dfs(S, 10**9)
            if pushed == 0:
                break
            flow += pushed
    print(flow)

solve()`
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
    probDesc: 'Cho số nguyên N (0 ≤ N ≤ 10¹⁸), biết F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2). Tính F(N) mod (10⁹ + 7).',
    inputFormat: 'Một dòng duy nhất chứa số nguyên N.',
    outputFormat: 'In ra F(N) mod 1000000007.',
    sampleCases: [
      { input: '10', output: '55', explanation: 'Dãy Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55.' }
    ],
    fullCpp: `#include <iostream>
#include <array>
using namespace std;

const long long MOD = 1000000007LL;
using Mat = array<array<long long, 2>, 2>;

Mat mul(const Mat& A, const Mat& B) {
    Mat C = {{{0, 0}, {0, 0}}};
    for (int i = 0; i < 2; ++i)
        for (int k = 0; k < 2; ++k)
            for (int j = 0; j < 2; ++j)
                C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;
    return C;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n;
    if (!(cin >> n)) return 0;
    Mat res = {{{1, 0}, {0, 1}}};
    Mat base = {{{1, 1}, {1, 0}}};
    while (n > 0) {
        if (n & 1LL) res = mul(res, base);
        base = mul(base, base);
        n >>= 1LL;
    }
    cout << res[0][1] << '\\n';
    return 0;
}`,
    fullPy: `import sys

def solve():
    raw = sys.stdin.read().strip()
    if not raw:
        return
    n = int(raw.split()[0])
    MOD = 10**9 + 7

    def mat_mul(A, B):
        return [
            [(A[0][0] * B[0][0] + A[0][1] * B[1][0]) % MOD,
             (A[0][0] * B[0][1] + A[0][1] * B[1][1]) % MOD],
            [(A[1][0] * B[0][0] + A[1][1] * B[1][0]) % MOD,
             (A[1][0] * B[0][1] + A[1][1] * B[1][1]) % MOD],
        ]

    res = [[1, 0], [0, 1]]
    base = [[1, 1], [1, 0]]
    while n > 0:
        if n & 1:
            res = mat_mul(res, base)
        base = mat_mul(base, base)
        n >>= 1
    print(res[0][1])

solve()`
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
    probDesc: 'Cho ma trận chi phí đi lại giữa N thành phố (0..N-1, N ≤ 16). Xuất phát từ thành phố 0, đi qua tất cả thành phố đúng một lần rồi quay về 0 với tổng chi phí nhỏ nhất.',
    inputFormat: 'Dòng 1: số nguyên N. N dòng sau: mỗi dòng N số nguyên C[i][0..N-1].',
    outputFormat: 'Một số nguyên duy nhất là tổng chi phí hành trình nhỏ nhất.',
    sampleCases: [
      { input: '3\n0 1 100\n100 0 2\n3 100 0', output: '6', explanation: 'Chu trình tối ưu 0 -> 1 -> 2 -> 0 có chi phí 1 + 2 + 3 = 6.' }
    ],
    fullCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    vector<vector<long long>> d(n, vector<long long>(n));
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j) cin >> d[i][j];
    const long long INF = 1e18;
    vector<vector<long long>> dp(1 << n, vector<long long>(n, INF));
    dp[1][0] = 0;
    for (int mask = 1; mask < (1 << n); ++mask) {
        for (int u = 0; u < n; ++u) {
            if (dp[mask][u] == INF) continue;
            for (int v = 0; v < n; ++v) {
                if (!(mask & (1 << v))) {
                    int nxt = mask | (1 << v);
                    dp[nxt][v] = min(dp[nxt][v], dp[mask][u] + d[u][v]);
                }
            }
        }
    }
    long long ans = INF;
    int full = (1 << n) - 1;
    for (int u = 0; u < n; ++u) ans = min(ans, dp[full][u] + d[u][0]);
    cout << ans << '\\n';
    return 0;
}`,
    fullPy: `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n = next(it)
    d = [[next(it) for _ in range(n)] for _ in range(n)]
    INF = 10**18
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0
    for mask in range(1, 1 << n):
        for u in range(n):
            if dp[mask][u] == INF:
                continue
            for v in range(n):
                if not ((mask >> v) & 1):
                    nxt = mask | (1 << v)
                    val = dp[mask][u] + d[u][v]
                    if val < dp[nxt][v]:
                        dp[nxt][v] = val
    full = (1 << n) - 1
    print(min(dp[full][u] + d[u][0] for u in range(n)))

solve()`
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
    probDesc: 'Cho cây N đỉnh (gốc tại 1), mỗi đỉnh có trọng số ban đầu W[i]. Thực hiện Q truy vấn: `1 u x` gán W[u] = x; `2 u` in tổng trọng số cây con gốc u.',
    inputFormat: 'Dòng 1: N, Q. Dòng 2: N trọng số W[1..N]. N-1 dòng tiếp: cạnh u v. Q dòng sau: truy vấn `1 u x` hoặc `2 u`.',
    outputFormat: 'Với mỗi truy vấn loại 2, in ra tổng trọng số cây con gốc u trên một dòng.',
    sampleCases: [
      { input: '5 3\n1 2 3 4 5\n1 2\n1 3\n2 4\n2 5\n2 2\n1 4 10\n2 1', output: '11\n21', explanation: 'Cây con 2 gồm {2,4,5}: 2+4+5 = 11. Sau khi đổi W[4]=10, tổng cả cây (gốc 1) là 1+2+3+10+5 = 21.' }
    ],
    fullCpp: `#include <iostream>
#include <vector>
using namespace std;

int n, q, timer = 0;
vector<vector<int>> adj;
vector<int> tin, tout;
vector<long long> w, bit;

void dfs(int u, int p) {
    tin[u] = ++timer;
    for (int v : adj[u]) if (v != p) dfs(v, u);
    tout[u] = timer;
}

void add(int idx, long long delta) {
    for (; idx <= n; idx += idx & -idx) bit[idx] += delta;
}

long long sum(int idx) {
    long long s = 0;
    for (; idx > 0; idx -= idx & -idx) s += bit[idx];
    return s;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    if (!(cin >> n >> q)) return 0;
    w.assign(n + 1, 0);
    adj.assign(n + 1, {});
    tin.assign(n + 1, 0);
    tout.assign(n + 1, 0);
    bit.assign(n + 1, 0);
    for (int i = 1; i <= n; ++i) cin >> w[i];
    for (int i = 0; i < n - 1; ++i) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    dfs(1, 0);
    for (int i = 1; i <= n; ++i) add(tin[i], w[i]);
    while (q--) {
        int t; cin >> t;
        if (t == 1) {
            int u; long long x; cin >> u >> x;
            add(tin[u], x - w[u]);
            w[u] = x;
        } else {
            int u; cin >> u;
            cout << sum(tout[u]) - sum(tin[u] - 1) << '\\n';
        }
    }
    return 0;
}`,
    fullPy: `import sys
sys.setrecursionlimit(200000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n, q = next(it), next(it)
    w = [0] + [next(it) for _ in range(n)]
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = next(it), next(it)
        adj[u].append(v)
        adj[v].append(u)

    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    timer = 0

    def dfs(u, p):
        nonlocal timer
        timer += 1
        tin[u] = timer
        for v in adj[u]:
            if v != p:
                dfs(v, u)
        tout[u] = timer

    dfs(1, 0)
    bit = [0] * (n + 1)

    def add(idx, delta):
        while idx <= n:
            bit[idx] += delta
            idx += idx & -idx

    def pref(idx):
        s = 0
        while idx > 0:
            s += bit[idx]
            idx -= idx & -idx
        return s

    for i in range(1, n + 1):
        add(tin[i], w[i])

    out = []
    for _ in range(q):
        t = next(it)
        if t == 1:
            u, x = next(it), next(it)
            add(tin[u], x - w[u])
            w[u] = x
        else:
            u = next(it)
            out.append(str(pref(tout[u]) - pref(tin[u] - 1)))
    sys.stdout.write("\\n".join(out))

solve()`
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
    probDesc: 'Cho mảng N phần tử (1-indexed) và Q truy vấn [L, R]. Đếm số lượng giá trị khác nhau trong đoạn A[L..R].',
    inputFormat: 'Dòng 1: N, Q. Dòng 2: N số nguyên A[1..N]. Q dòng sau: mỗi dòng chứa L, R.',
    outputFormat: 'In kết quả từng truy vấn trên một dòng.',
    sampleCases: [
      { input: '5 3\n1 1 2 1 3\n1 5\n2 4\n1 2', output: '3\n2\n1', explanation: '[1..5] có {1,2,3} (3 giá trị); [2..4] có {1,2} (2 giá trị); [1..2] chỉ có {1} (1 giá trị).' }
    ],
    fullCpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

struct Query { int l, r, idx; };

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> a(n + 1), vals;
    for (int i = 1; i <= n; ++i) { cin >> a[i]; vals.push_back(a[i]); }
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    for (int i = 1; i <= n; ++i)
        a[i] = (int)(lower_bound(vals.begin(), vals.end(), a[i]) - vals.begin());

    vector<Query> qs(q);
    for (int i = 0; i < q; ++i) { cin >> qs[i].l >> qs[i].r; qs[i].idx = i; }
    int B = max(1, (int)sqrt(n));
    sort(qs.begin(), qs.end(), [&](const Query& x, const Query& y) {
        int bx = x.l / B, by = y.l / B;
        if (bx != by) return bx < by;
        return (bx & 1) ? x.r > y.r : x.r < y.r;
    });

    vector<int> cnt(vals.size(), 0), ans(q);
    int distinct = 0, curL = 1, curR = 0;
    auto add = [&](int pos) { if (++cnt[a[pos]] == 1) distinct++; };
    auto rem = [&](int pos) { if (--cnt[a[pos]] == 0) distinct--; };

    for (auto& qr : qs) {
        while (curL > qr.l) add(--curL);
        while (curR < qr.r) add(++curR);
        while (curL < qr.l) rem(curL++);
        while (curR > qr.r) rem(curR--);
        ans[qr.idx] = distinct;
    }
    for (int x : ans) cout << x << '\\n';
    return 0;
}`,
    fullPy: `import sys
from collections import defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n, q = next(it), next(it)
    a = [0] + [next(it) for _ in range(n)]
    qs = [(next(it), next(it), i) for i in range(q)]
    B = max(1, int(n ** 0.5))
    qs.sort(key=lambda item: (item[0] // B, -item[1] if (item[0] // B) & 1 else item[1]))

    cnt = defaultdict(int)
    distinct = 0
    cur_l, cur_r = 1, 0
    ans = [0] * q

    for l, r, idx in qs:
        while cur_l > l:
            cur_l -= 1
            if cnt[a[cur_l]] == 0:
                distinct += 1
            cnt[a[cur_l]] += 1
        while cur_r < r:
            cur_r += 1
            if cnt[a[cur_r]] == 0:
                distinct += 1
            cnt[a[cur_r]] += 1
        while cur_l < l:
            cnt[a[cur_l]] -= 1
            if cnt[a[cur_l]] == 0:
                distinct -= 1
            cur_l += 1
        while cur_r > r:
            cnt[a[cur_r]] -= 1
            if cnt[a[cur_r]] == 0:
                distinct -= 1
            cur_r -= 1
        ans[idx] = distinct

    sys.stdout.write("\\n".join(map(str, ans)))

solve()`
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
    inputFormat: s.inputFormat,
    outputFormat: s.outputFormat,
    sampleCases: s.sampleCases,
    solutionAnalysis: s.theory1,
    fullSolutionCpp: s.fullCpp,
    fullSolutionPython: s.fullPy
  }
}));
