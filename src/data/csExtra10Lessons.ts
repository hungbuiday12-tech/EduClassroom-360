import { CSLesson } from '../types';

export const CS_EXTRA_10_LESSONS: CSLesson[] = [
  {
    id: 'cs-13',
    level: 'Nâng cao / HSG',
    vnoiPhase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    vnoiTag: 'VNOI Wiki · Fenwick Tree (BIT) & Nghịch thế',
    prerequisites: ['cs-6', 'cs-9'],
    lessonNumber: 13,
    title: 'Cây Fenwick (Binary Indexed Tree) & Bài toán Đếm Nghịch thế',
    topic: 'BIT O(log N) gọn nhẹ · Rời rạc hóa (Coordinate Compression) & Tổng tiền tố động',
    estimatedMinutes: 20,
    theory: [
      '1. Ý tưởng cốt lõi của Fenwick Tree (BIT): Mỗi chỉ số $i$ lưu tổng của đúng $i \\& (-i)$ phần tử kết thúc tại $i$ (với `i & -i` là bit 1 thấp nhất của $i$). Nhờ phép toán bit cực nhanh, cả hai thao tác `update(i, delta)` và `queryPrefix(i)` đều tốn $O(\\log N)$ với bộ nhớ đúng bằng $N+1$ (nhẹ hơn Segment Tree 4 lần!).',
      '2. Công thức nhảy chỉ số trong BIT: Khi cập nhật tại $i$: tiến lên `i += i & -i` cho đến $\\le N$. Khi lấy tổng tiền tố $[1..i]$: lùi xuống `i -= i & -i` cho đến $> 0$.',
      '3. Đếm cặp nghịch thế (Inversion Count): Duyệt ngược mảng từ phải sang trái; tại $a[i]$, số phần tử đứng sau nhỏ hơn $a[i]$ chính là `queryPrefix(a[i] - 1)`, sau đó gọi `update(a[i], 1)`. Nếu $a[i] \\le 10^9$, cần rời rạc hóa (nén giá trị) về $[1..N]$ trước!'
    ],
    complexity: {
      time: 'O(N log N) dựng & đếm nghịch thế, O(log N) mỗi truy vấn',
      space: 'O(N)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Fenwick Tree chuẩn thi HSG',
        basicTitle: 'C++ Cơ bản: Đếm nghịch thế bằng 2 vòng lặp for (O(N²))',
        basicCode: `#include <iostream>
using namespace std;

int main() {
    int a[5] = {3, 1, 4, 2, 5}, n = 5;
    long long inv = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (a[i] > a[j]) inv++;
    cout << inv << '\\n'; // 3
    return 0;
}`,
        basicExplanation: 'Kiểm tra trực tiếp mọi cặp i < j xem a[i] > a[j] để hiểu định nghĩa nghịch thế.',
        code: `#include <iostream>
#include <vector>
using namespace std;

struct Fenwick {
    int n;
    vector<long long> bit;
    Fenwick(int n) : n(n), bit(n + 1, 0) {}
    void add(int i, long long v) {
        for (; i <= n; i += i & -i) bit[i] += v;
    }
    long long sum(int i) {
        long long s = 0;
        for (; i > 0; i -= i & -i) s += bit[i];
        return s;
    }
    long long rangeSum(int l, int r) { return sum(r) - sum(l - 1); }
};`,
        explanation: 'Chỉ mất 8 dòng code để quản lý cập nhật điểm và tính tổng đoạn trong O(log N).'
      },
      {
        language: 'python',
        title: 'Python Fenwick Tree',
        basicTitle: 'Python Cơ bản: Đếm trực tiếp O(N²)',
        basicCode: `a = [3, 1, 4, 2, 5]
inv = sum(1 for i in range(len(a)) for j in range(i + 1, len(a)) if a[i] > a[j])
print(inv)`,
        basicExplanation: 'Viết biểu thức đếm trực tiếp cho dữ liệu nhỏ N ≤ 2000.',
        code: `class Fenwick:
    def __init__(self, n: int):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i: int, delta: int):
        while i <= self.n:
            self.bit[i] += delta
            i += i & -i

    def prefix(self, i: int) -> int:
        s = 0
        while i > 0:
            s += self.bit[i]
            i -= i & -i
        return s`,
        explanation: 'Toán tử i & -i hoạt động giống hệt trong Python trên số nguyên dương.'
      }
    ],
    practiceProblem: {
      id: 'CS_P13',
      title: 'Đếm số cặp nghịch thế bằng Fenwick Tree',
      difficulty: 'Medium',
      description: 'Cho hoán vị hoặc dãy gồm N số nguyên dương (1 ≤ N ≤ 10⁵, 1 ≤ a[i] ≤ N). Hãy đếm số cặp chỉ số (i, j) sao cho i < j và a[i] > a[j].',
      inputFormat: 'Dòng 1: Số nguyên dương N. Dòng 2: N số nguyên dương a[1..N].',
      outputFormat: 'In ra một số nguyên duy nhất là số cặp nghịch thế.',
      sampleCases: [
        {
          input: '5\n2 4 1 3 5',
          output: '3',
          explanation: 'Các cặp nghịch thế là (2, 1), (4, 1), (4, 3).'
        }
      ],
      solutionAnalysis: 'Duyệt i từ N về 1, cộng sum(a[i] - 1) vào kết quả rồi gọi add(a[i], 1). Độ phức tạp O(N log N).',
      basicAnalysis: 'Cơ bản: Hai vòng lặp lồng nhau kiểm tra trực tiếp mọi cặp i < j.',
      basicSolutionCpp: `#include <iostream>
using namespace std;
int a[100005];
int main() {
    int n; cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    long long ans = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (a[i] > a[j]) ans++;
    cout << ans;
    return 0;
}`,
      basicSolutionPython: `n = int(input())
a = list(map(int, input().split()))
ans = 0
for i in range(n):
    for j in range(i + 1, n):
        if a[i] > a[j]:
            ans += 1
print(ans)`,
      fullSolutionCpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    int mx = 1;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        if (a[i] > mx) mx = a[i];
    }
    vector<long long> bit(mx + 2, 0);
    auto add = [&](int idx, long long v) {
        for (; idx <= mx; idx += idx & -idx) bit[idx] += v;
    };
    auto sum = [&](int idx) {
        long long s = 0;
        for (; idx > 0; idx -= idx & -idx) s += bit[idx];
        return s;
    };
    long long ans = 0;
    for (int i = n - 1; i >= 0; i--) {
        ans += sum(a[i] - 1);
        add(a[i], 1);
    }
    cout << ans << '\\n';
    return 0;
}`,
      fullSolutionPython: `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    a = [int(x) for x in data[1:1 + n]]
    mx = max(a) if a else 1
    bit = [0] * (mx + 2)
    ans = 0
    for x in reversed(a):
        i = x - 1
        while i > 0:
            ans += bit[i]
            i -= i & -i
        i = x
        while i <= mx:
            bit[i] += 1
            i += i & -i
    print(ans)

solve()`
    }
  },
  {
    id: 'cs-14',
    level: 'Nâng cao / HSG',
    vnoiPhase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    vnoiTag: 'VNOI Wiki · Segment Tree Lazy Propagation',
    prerequisites: ['cs-9'],
    lessonNumber: 14,
    title: 'Segment Tree Lazy Propagation: Cập nhật & Truy vấn Đoạn O(log N)',
    topic: 'Cập nhật lười trên cây phân đoạn · Trì hoãn đẩy nhãn xuống nút con',
    estimatedMinutes: 24,
    theory: [
      '1. Vấn đề đặt ra: Khi cần cộng thêm giá trị $v$ cho TẤT CẢ phần tử trong đoạn $[L; R]$, nếu cập nhật từng phần tử sẽ mất $O(N \\log N)$ mỗi truy vấn. Lazy Propagation giải quyết thao tác Range Update chỉ trong $O(\\log N)$.',
      '2. Cơ chế Lazy Tag (`lazy[node]`): Khi đoạn $[start; end]$ nằm gọn trong $[L; R]$, ta cập nhật trực tiếp giá trị tổng trên nút `tree[node] += v * (end - start + 1)`, lưu phần chưa đẩy vào `lazy[node] += v` rồi DỪNG NGAY không đệ quy xuống con.',
      '3. Hàm `pushDown(node, start, end)`: Bất cứ khi nào phải rẽ nhánh xuống con trong `update` hoặc `query`, ta lập tức xả `lazy[node]` xuống `2*node` và `2*node+1`, cập nhật `tree` của hai con rồi đặt lại `lazy[node] = 0`.'
    ],
    complexity: {
      time: 'O(N) dựng cây, O(log N) cho cả Range Update & Range Query',
      space: 'O(4N)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Segment Tree Lazy Update (Cộng đoạn, Tổng đoạn)',
        basicTitle: 'C++ Cơ bản: Vòng lặp cộng trực tiếp đoạn [L..R]',
        basicCode: `#include <iostream>
using namespace std;
int main() {
    long long a[6] = {0, 1, 2, 3, 4, 5};
    for (int i = 2; i <= 4; i++) a[i] += 10;
    long long s = 0;
    for (int i = 1; i <= 5; i++) s += a[i];
    cout << s << '\\n'; // 45
    return 0;
}`,
        basicExplanation: 'Cách cài đặt thô bằng vòng for: dễ kiểm chứng đúng sai trên mảng nhỏ.',
        code: `struct LazySegTree {
    int n;
    vector<long long> tree, lazy;
    LazySegTree(int n) : n(n), tree(4 * n + 4, 0), lazy(4 * n + 4, 0) {}

    void push(int node, int l, int r) {
        if (lazy[node] == 0 || l == r) return;
        int mid = (l + r) >> 1;
        long long tag = lazy[node];
        tree[node << 1] += tag * (mid - l + 1);
        lazy[node << 1] += tag;
        tree[node << 1 | 1] += tag * (r - mid);
        lazy[node << 1 | 1] += tag;
        lazy[node] = 0;
    }

    void update(int node, int l, int r, int ql, int qr, long long v) {
        if (qr < l || r < ql) return;
        if (ql <= l && r <= qr) {
            tree[node] += v * (r - l + 1);
            lazy[node] += v;
            return;
        }
        push(node, l, r);
        int mid = (l + r) >> 1;
        update(node << 1, l, mid, ql, qr, v);
        update(node << 1 | 1, mid + 1, r, ql, qr, v);
        tree[node] = tree[node << 1] + tree[node << 1 | 1];
    }

    long long query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return tree[node];
        push(node, l, r);
        int mid = (l + r) >> 1;
        return query(node << 1, l, mid, ql, qr) + query(node << 1 | 1, mid + 1, r, ql, qr);
    }
};`,
        explanation: 'Hàm push() đảm bảo dữ liệu ở nút con luôn chính xác trước khi truy cập.'
      },
      {
        language: 'python',
        title: 'Python Lazy Segment Tree',
        basicTitle: 'Python Cơ bản: Mảng cộng dồn / Vòng lặp',
        basicCode: `a = [0, 1, 2, 3, 4, 5]
for i in range(2, 5):
    a[i] += 10
print(sum(a[1:6]))`,
        basicExplanation: 'Minh họa trên N = 5 trước khi tổng quát thành cây Segment Tree.',
        code: `class LazySeg:
    def __init__(self, a):
        self.n = len(a) - 1
        self.tree = [0] * (4 * self.n + 4)
        self.lazy = [0] * (4 * self.n + 4)
        if self.n > 0:
            self._build(a, 1, 1, self.n)

    def _build(self, a, node, l, r):
        if l == r:
            self.tree[node] = a[l]
            return
        mid = (l + r) // 2
        self._build(a, 2 * node, l, mid)
        self._build(a, 2 * node + 1, mid + 1, r)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]`,
        explanation: 'Triển khai hàm build, push, update, query tương tự bản C++.'
      }
    ],
    practiceProblem: {
      id: 'CS_P14',
      title: 'Cộng đoạn [L..R] và Tính tổng đoạn [L..R] (Lazy Propagation)',
      difficulty: 'Hard',
      description: 'Cho mảng A gồm N số nguyên (1 ≤ N ≤ 10⁵) và Q truy vấn: `1 L R V` cộng V vào mọi phần tử từ L đến R; `2 L R` in ra tổng các phần tử từ L đến R.',
      inputFormat: 'Dòng 1: N và Q. Dòng 2: N số nguyên A[1..N]. Q dòng sau mô tả truy vấn.',
      outputFormat: 'Mỗi truy vấn loại 2 in ra tổng đoạn trên 1 dòng.',
      sampleCases: [
        {
          input: '5 3\n1 2 3 4 5\n2 1 3\n1 2 4 10\n2 1 3',
          output: '6\n26',
          explanation: 'Tổng [1..3] ban đầu là 1+2+3 = 6. Sau khi cộng 10 vào [2..4], mảng là [1, 12, 13, 14, 5], tổng [1..3] = 26.'
        }
      ],
      solutionAnalysis: 'Dùng Segment Tree Lazy Propagation với `tree[node]` lưu tổng đoạn và `lazy[node]` lưu lượng cộng chờ đẩy.',
      basicAnalysis: 'Cơ bản: Duyệt vòng for [L..R] để cộng và tính tổng cho từng truy vấn.',
      basicSolutionCpp: `#include <iostream>
using namespace std;
long long a[100005];
int main() {
    int n, q; cin >> n >> q;
    for (int i = 1; i <= n; i++) cin >> a[i];
    while (q--) {
        int t, l, r; cin >> t >> l >> r;
        if (t == 1) {
            long long v; cin >> v;
            for (int i = l; i <= r; i++) a[i] += v;
        } else {
            long long s = 0;
            for (int i = l; i <= r; i++) s += a[i];
            cout << s << '\\n';
        }
    }
    return 0;
}`,
      basicSolutionPython: `n, q = map(int, input().split())
a = [0] + list(map(int, input().split()))
for _ in range(q):
    row = list(map(int, input().split()))
    if row[0] == 1:
        for i in range(row[1], row[2] + 1):
            a[i] += row[3]
    else:
        print(sum(a[row[1]:row[2] + 1]))`,
      fullSolutionCpp: `#include <iostream>
#include <vector>
using namespace std;

vector<long long> tree, lazy;

void build(const vector<long long>& a, int node, int l, int r) {
    if (l == r) { tree[node] = a[l]; return; }
    int mid = (l + r) >> 1;
    build(a, node << 1, l, mid);
    build(a, node << 1 | 1, mid + 1, r);
    tree[node] = tree[node << 1] + tree[node << 1 | 1];
}

void push(int node, int l, int r) {
    if (lazy[node] == 0 || l == r) return;
    int mid = (l + r) >> 1;
    long long v = lazy[node];
    tree[node << 1] += v * (mid - l + 1);
    lazy[node << 1] += v;
    tree[node << 1 | 1] += v * (r - mid);
    lazy[node << 1 | 1] += v;
    lazy[node] = 0;
}

void update(int node, int l, int r, int ql, int qr, long long v) {
    if (qr < l || r < ql) return;
    if (ql <= l && r <= qr) {
        tree[node] += v * (r - l + 1);
        lazy[node] += v;
        return;
    }
    push(node, l, r);
    int mid = (l + r) >> 1;
    update(node << 1, l, mid, ql, qr, v);
    update(node << 1 | 1, mid + 1, r, ql, qr, v);
    tree[node] = tree[node << 1] + tree[node << 1 | 1];
}

long long query(int node, int l, int r, int ql, int qr) {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return tree[node];
    push(node, l, r);
    int mid = (l + r) >> 1;
    return query(node << 1, l, mid, ql, qr) + query(node << 1 | 1, mid + 1, r, ql, qr);
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    tree.assign(4 * (n + 1), 0);
    lazy.assign(4 * (n + 1), 0);
    build(a, 1, 1, n);
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
      fullSolutionPython: `import sys
sys.setrecursionlimit(300000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n, q = int(data[0]), int(data[1])
    a = [0] + [int(x) for x in data[2:2 + n]]
    idx = 2 + n
    tree = [0] * (4 * (n + 1))
    lazy = [0] * (4 * (n + 1))

    def build(node, l, r):
        if l == r:
            tree[node] = a[l]
            return
        mid = (l + r) >> 1
        build(node << 1, l, mid)
        build(node << 1 | 1, mid + 1, r)
        tree[node] = tree[node << 1] + tree[node << 1 | 1]

    def push(node, l, r):
        if lazy[node] == 0 or l == r:
            return
        mid = (l + r) >> 1
        v = lazy[node]
        tree[node << 1] += v * (mid - l + 1)
        lazy[node << 1] += v
        tree[node << 1 | 1] += v * (r - mid)
        lazy[node << 1 | 1] += v
        lazy[node] = 0

    def update(node, l, r, ql, qr, v):
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr:
            tree[node] += v * (r - l + 1)
            lazy[node] += v
            return
        push(node, l, r)
        mid = (l + r) >> 1
        update(node << 1, l, mid, ql, qr, v)
        update(node << 1 | 1, mid + 1, r, ql, qr, v)
        tree[node] = tree[node << 1] + tree[node << 1 | 1]

    def query(node, l, r, ql, qr):
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return tree[node]
        push(node, l, r);
        mid = (l + r) >> 1
        return query(node << 1, l, mid, ql, qr) + query(node << 1 | 1, mid + 1, r, ql, qr)

    build(1, 1, n)
    out = []
    for _ in range(q):
        t = int(data[idx])
        if t == 1:
            update(1, 1, n, int(data[idx + 1]), int(data[idx + 2]), int(data[idx + 3]))
            idx += 4
        else:
            out.append(str(query(1, 1, n, int(data[idx + 1]), int(data[idx + 2]))))
            idx += 3
    print("\\n".join(out))

solve()`
    }
  },
  {
    id: 'cs-15',
    level: 'Nâng cao / HSG',
    vnoiPhase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    vnoiTag: 'VNOI Wiki · Trie (Cây Tiền tố) & Aho-Corasick',
    prerequisites: ['cs-3', 'cs-12'],
    lessonNumber: 15,
    title: 'Cây Tiền tố (Trie), XOR Max Trie & Tự động hóa Aho-Corasick',
    topic: 'Lưu trữ từ điển O(|S|) · Truy vấn tiền tố & Tìm kiếm đa mẫu đồng thời',
    estimatedMinutes: 22,
    theory: [
      '1. Cấu trúc Trie (Prefix Tree): Mỗi cạnh gán một ký tự (hoặc bit $0/1$ với Binary Trie). Mỗi nút lưu số từ đi qua `cnt` và số từ kết thúc `end`. Thao tác thêm và tìm xâu dài $L$ chỉ tốn $O(L)$, không phụ thuộc số từ $N$!',
      '2. Binary Trie cho bài toán XOR Max: Đưa các số nguyên 30-bit vào Trie từ bit cao nhất (bit 29) xuống bit 0. Để tối đa hóa $x \\oplus y$, tại mỗi tầng bit $b$, luôn ưu tiên rẽ sang nhánh bit đối ngược $1 - b$ nếu còn tồn tại.',
      '3. Tự động hóa Aho-Corasick: Là sự kết hợp giữa Trie và con trỏ thất bại `fail[u]` (tương tự KMP trên cây). Cho phép quét toàn bộ văn bản $T$ một lần duy nhất trong $O(|T| + \\sum |P_i| + \\text{matches})$ để phát hiện tất cả từ khóa trong từ điển.'
    ],
    complexity: {
      time: 'O(|S|) cho mỗi thao tác Insert / Query',
      space: 'O(Tổng độ dài các xâu × |Alphabet|)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Trie Từ điển & Đếm Tiền tố',
        basicTitle: 'C++ Cơ bản: Dùng vector<string> kiểm tra tiền tố từng từ',
        basicCode: `#include <iostream>
#include <vector>
#include <string>
using namespace std;
int main() {
    vector<string> words = {"code", "coding", "cpu", "cat"};
    string pref = "co";
    int cnt = 0;
    for (auto& w : words)
        if (w.rfind(pref, 0) == 0) cnt++;
    cout << cnt << '\\n';
    return 0;
}`,
        basicExplanation: 'Duyệt tuyến tính từng xâu trong danh sách khi số truy vấn ít.',
        code: `struct Trie {
    struct Node {
        int child[26]{};
        int pass = 0, end = 0;
        Node() { fill(begin(child), end(child), -1); }
    };
    vector<Node> nodes{Node()};

    void insert(const string& s) {
        int u = 0;
        for (char c : s) {
            int ch = c - 'a';
            if (nodes[u].child[ch] == -1) {
                nodes[u].child[ch] = (int)nodes.size();
                nodes.emplace_back();
            }
            u = nodes[u].child[ch];
            nodes[u].pass++;
        }
        nodes[u].end++;
    }

    int countPrefix(const string& p) {
        int u = 0;
        for (char c : p) {
            int ch = c - 'a';
            if (nodes[u].child[ch] == -1) return 0;
            u = nodes[u].child[ch];
        }
        return nodes[u].pass;
    }
};`,
        explanation: 'Mỗi bước đi xuống đúng 1 ký tự giúp đếm tiền tố trong O(|P|).'
      },
      {
        language: 'python',
        title: 'Python Dictionary Trie',
        basicTitle: 'Python Cơ bản: startswith()',
        basicCode: `words = ["code", "coding", "cpu", "cat"]
print(sum(1 for w in words if w.startswith("co")))`,
        basicExplanation: 'Dùng hàm startswith chuẩn Python cho danh sách nhỏ.',
        code: `class TrieNode:
    def __init__(self):
        self.ch = {}
        self.pass_cnt = 0

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str):
        cur = self.root
        for c in word:
            if c not in cur.ch:
                cur.ch[c] = TrieNode()
            cur = cur.ch[c]
            cur.pass_cnt += 1

    def count_prefix(self, pref: str) -> int:
        cur = self.root
        for c in pref:
            if c not in cur.ch:
                return 0
            cur = cur.ch[c]
        return cur.pass_cnt`,
        explanation: 'Dùng dict giúp tiết kiệm bộ nhớ với bảng chữ cái lớn.'
      }
    ],
    practiceProblem: {
      id: 'CS_P15',
      title: 'Từ điển Tiền tố với Cây Trie',
      difficulty: 'Medium',
      description: 'Cho N từ chỉ gồm chữ cái thường (a–z) và Q truy vấn. Mỗi truy vấn cho một xâu tiền tố P, hãy đếm xem có bao nhiêu từ trong N từ đã cho bắt đầu bằng tiền tố P.',
      inputFormat: 'Dòng 1: N và Q. N dòng tiếp theo: mỗi dòng 1 từ. Q dòng tiếp theo: mỗi dòng 1 tiền tố P.',
      outputFormat: 'Với mỗi truy vấn, in ra số từ có tiền tố P trên 1 dòng.',
      sampleCases: [
        {
          input: '4 2\ncode\ncoding\ncpu\ncat\nco\nc',
          output: '2\n4',
          explanation: 'Có 2 từ bắt đầu bằng "co" ("code", "coding") và 4 từ bắt đầu bằng "c".'
        }
      ],
      solutionAnalysis: 'Chèn N từ vào Trie, tăng `pass` ở mỗi nút đi qua. Mỗi truy vấn đi theo các ký tự của P và trả về `nodes[u].pass`.',
      basicAnalysis: 'Cơ bản: Lưu mảng xâu và dùng `startswith` / `substr` kiểm tra từng cặp.',
      basicSolutionCpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;
int main() {
    int n, q; cin >> n >> q;
    vector<string> w(n);
    for (int i = 0; i < n; i++) cin >> w[i];
    while (q--) {
        string p; cin >> p;
        int cnt = 0;
        for (auto& s : w) if (s.size() >= p.size() && s.compare(0, p.size(), p) == 0) cnt++;
        cout << cnt << '\\n';
    }
    return 0;
}`,
      basicSolutionPython: `n, q = map(int, input().split())
words = [input().strip() for _ in range(n)]
for _ in range(q):
    p = input().strip()
    print(sum(1 for w in words if w.startswith(p)))`,
      fullSolutionCpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

struct Node {
    int nxt[26];
    int pass = 0;
    Node() { fill(nxt, nxt + 26, -1); }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<Node> trie(1);
    for (int i = 0; i < n; i++) {
        string s; cin >> s;
        int u = 0;
        for (char c : s) {
            int k = c - 'a';
            if (trie[u].nxt[k] == -1) {
                trie[u].nxt[k] = (int)trie.size();
                trie.emplace_back();
            }
            u = trie[u].nxt[k];
            trie[u].pass++;
        }
    }
    while (q--) {
        string p; cin >> p;
        int u = 0;
        bool ok = true;
        for (char c : p) {
            int k = c - 'a';
            if (trie[u].nxt[k] == -1) { ok = false; break; }
            u = trie[u].nxt[k];
        }
        cout << (ok ? trie[u].pass : 0) << '\\n';
    }
    return 0;
}`,
      fullSolutionPython: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n, q = int(tokens[0]), int(tokens[1])
    root = {}
    idx = 2
    for _ in range(n):
        cur = root
        for c in tokens[idx]:
            if c not in cur:
                cur[c] = {'#': 0}
            cur = cur[c]
            cur['#'] += 1
        idx += 1
    out = []
    for _ in range(q):
        cur = root
        ok = True
        for c in tokens[idx]:
            if c not in cur:
                ok = False
                break
            cur = cur[c]
        out.append(str(cur['#'] if ok else 0))
        idx += 1
    print("\\n".join(out))

solve()`
    }
  },
  {
    id: 'cs-16',
    level: 'Trung cấp',
    vnoiPhase: 'Phase 2 · Kỹ thuật tối ưu kinh điển',
    vnoiTag: 'VNOI Wiki · Hàm Z (Z-Function) & Manacher O(N)',
    prerequisites: ['cs-3', 'cs-12'],
    lessonNumber: 16,
    title: 'Thuật toán Z-Function & Thuật toán Manacher (Xâu Đối xứng O(N))',
    topic: 'Hàm Z khớp tiền tố & Tìm xâu con đối xứng dài nhất tuyến tính',
    estimatedMinutes: 20,
    theory: [
      '1. Định nghĩa Z-Function: Cho xâu $S$ độ dài $N$. $Z[i]$ là độ dài tiền tố chung dài nhất (LCP) giữa xâu $S$ và hậu tố bắt đầu tại $i$ ($S[i..N-1]$). Quy ước $Z[0] = 0$.',
      '2. Cửa sổ $[L, R]$ trong Z-Function: Luôn duy trì đoạn $[L, R]$ là Z-box có $R$ lớn nhất từng thấy sao cho $S[L..R] == S[0..R-L]$. Khi tính $Z[i]$ với $i \\le R$, ta tận dụng ngay giá trị đã biết $Z[i - L]$ để nhảy cóc trong $O(N)$ tổng thời gian!',
      '3. Thuật toán Manacher: Chèn ký tự `#` xen giữa mọi ký tự của $S$ (ví dụ `"aba"` $\\to$ `"#a#b#a#"`). Khi đó mọi xâu con đối xứng (kể cả độ dài chẵn hay lẻ) đều có tâm lẻ, ta dùng tính đối xứng gương qua tâm $C$ trong cửa sổ $[L, R]$ để tìm độ dài xâu đối xứng dài nhất chỉ trong $O(N)$!'
    ],
    complexity: {
      time: 'O(N) tuyến tính tuyệt đối cho cả Z-Function và Manacher',
      space: 'O(N)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Xây dựng Mảng Z trong O(N)',
        basicTitle: 'C++ Cơ bản: Tính từng Z[i] bằng vòng while O(N²)',
        basicCode: `#include <iostream>
#include <string>
#include <vector>
using namespace std;
int main() {
    string s = "abacaba";
    int n = s.size();
    vector<int> z(n, 0);
    for (int i = 1; i < n; i++)
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
    for (int v : z) cout << v << " ";
    return 0;
}`,
        basicExplanation: 'Đếm trực tiếp số ký tự giống nhau tại mỗi vị trí i để hiểu rõ ý nghĩa mảng Z.',
        code: `vector<int> zFunction(const string& s) {
    int n = (int)s.size();
    vector<int> z(n, 0);
    for (int i = 1, l = 0, r = 0; i < n; i++) {
        if (i <= r) z[i] = min(r - i + 1, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }
    return z;
}`,
        explanation: 'Vì con trỏ phải R chỉ dịch tăng tối đa N lần nên toàn bộ vòng lặp chạy đúng O(N).'
      },
      {
        language: 'python',
        title: 'Python Z-Function O(N)',
        basicTitle: 'Python Cơ bản: Đếm LCP từng hậu tố',
        basicCode: `s = "abacaba"
z = [0] * len(s)
for i in range(1, len(s)):
    while i + z[i] < len(s) and s[z[i]] == s[i + z[i]]:
        z[i] += 1
print(z)`,
        basicExplanation: 'Cách tính trực tiếp độ dài tiền tố chung dài nhất.',
        code: `def z_function(s: str):
    n = len(s)
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > r:
            l, r = i, i + z[i] - 1
    return z`,
        explanation: 'Trả về mảng Z chỉ trong thời gian tuyến tính O(N).'
      }
    ],
    practiceProblem: {
      id: 'CS_P16',
      title: 'Tìm độ dài xâu con đối xứng dài nhất (Manacher O(N))',
      difficulty: 'Medium',
      description: 'Cho xâu ký tự S có độ dài từ 1 đến 10⁵. Hãy tìm độ dài của xâu con liên tiếp đối xứng (Palindrome) dài nhất bên trong S.',
      inputFormat: 'Một dòng duy nhất chứa xâu ký tự S.',
      outputFormat: 'In ra một số nguyên là độ dài xâu con đối xứng dài nhất.',
      sampleCases: [
        {
          input: 'babad',
          output: '3',
          explanation: 'Xâu con đối xứng dài nhất là "bab" hoặc "aba", độ dài 3.'
        }
      ],
      solutionAnalysis: 'Dùng thuật toán Manacher chèn ký tự phân cách `#` (ví dụ `^#b#a#b#a#d#$`) và tính mảng bán kính đối xứng `p[i]` trong O(N).',
      basicAnalysis: 'Cơ bản: Duyệt mọi tâm đối xứng lẻ và chẵn rồi mở rộng sang 2 bên (O(N²)).',
      basicSolutionCpp: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
int main() {
    string s; cin >> s;
    int n = s.size(), best = 1;
    for (int c = 0; c < n; c++) {
        for (int off : {0, 1}) {
            int l = c, r = c + off;
            while (l >= 0 && r < n && s[l] == s[r]) {
                best = max(best, r - l + 1);
                l--; r++;
            }
        }
    }
    cout << best;
    return 0;
}`,
      basicSolutionPython: `s = input().strip()
n = len(s)
best = 1
for c in range(n):
    for l, r in ((c, c), (c, c + 1)):
        while l >= 0 and r < n and s[l] == s[r]:
            best = max(best, r - l + 1)
            l -= 1
            r += 1
print(best)`,
      fullSolutionCpp: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string s;
    if (!(cin >> s)) return 0;
    string t = "^#";
    for (char c : s) { t.push_back(c); t.push_back('#'); }
    t.push_back('$');
    int n = (int)t.size();
    vector<int> p(n, 0);
    int c = 0, r = 0, best = 0;
    for (int i = 1; i < n - 1; i++) {
        int mirr = 2 * c - i;
        if (i < r) p[i] = min(r - i, p[mirr]);
        while (t[i + p[i] + 1] == t[i - p[i] - 1]) p[i]++;
        if (i + p[i] > r) { c = i; r = i + p[i]; }
        if (p[i] > best) best = p[i];
    }
    cout << best << '\\n';
    return 0;
}`,
      fullSolutionPython: `import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
    t = "^#" + "#".join(s) + "#$"
    n = len(t)
    p = [0] * n
    c = r = best = 0
    for i in range(1, n - 1):
        mirr = 2 * c - i
        if i < r:
            p[i] = min(r - i, p[mirr])
        while t[i + p[i] + 1] == t[i - p[i] - 1]:
            p[i] += 1
        if i + p[i] > r:
            c, r = i, i + p[i]
        if p[i] > best:
            best = p[i]
    print(best)

solve()`
    }
  },
  {
    id: 'cs-17',
    level: 'Nâng cao / HSG',
    vnoiPhase: 'Phase 3 · Quy hoạch động & Đồ thị',
    vnoiTag: 'VNOI Wiki · Tarjan Khớp–Cầu–SCC & Đường đi Euler',
    prerequisites: ['cs-8'],
    lessonNumber: 17,
    title: 'Thuật toán Tarjan (Khớp, Cầu, SCC) & Đường đi Euler (Hierholzer)',
    topic: 'Cây DFS (num/low) · Thành phần Liên thông mạnh & Chu trình qua mọi cạnh',
    estimatedMinutes: 25,
    theory: [
      '1. Cây DFS & Hai mảng kinh điển `num[u]`, `low[u]`: `num[u]` là thứ tự duyệt DFS vào đỉnh $u$; `low[u]` là giá trị `num` nhỏ nhất mà từ cây con gốc $u$ có thể nhảy ngược lên qua tối đa 1 cạnh ngược (back-edge).',
      '2. Nhận diện Cầu & Khớp bằng Tarjan: Cạnh $(u, v)$ trên cây DFS ($v$ là con của $u$) là **CẦU** nếu `low[v] > num[u]`. Đỉnh $u$ không phải gốc là **KHỚP** nếu tồn tại con $v$ sao cho `low[v] >= num[u]` (nếu là gốc DFS thì $u$ cần ít nhất 2 nhánh con độc lập).',
      '3. Chu trình & Đường đi Euler (Hierholzer): Đồ thị vô hướng liên thông có chu trình Euler khi mọi đỉnh bậc chẵn; có đường đi Euler khi có đúng 0 hoặc 2 đỉnh bậc lẻ. Thuật toán Hierholzer dùng stack xóa cạnh đã đi trong $O(V + E)$.'
    ],
    complexity: {
      time: 'O(V + E) cho cả Tarjan và Hierholzer',
      space: 'O(V + E)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Tarjan Đếm Khớp & Cầu trên Đồ thị Vô hướng',
        basicTitle: 'C++ Cơ bản: Thử xóa từng cạnh kiểm tra tính liên thông (O(E·(V+E)))',
        basicCode: `// Ý tưởng định nghĩa Cầu: một cạnh là Cầu nếu khi tạm ẩn nó đi,
// số thành phần liên thông của đồ thị tăng lên!`,
        basicExplanation: 'Cách kiểm tra theo đúng định nghĩa lý thuyết (phù hợp N ≤ 500).',
        code: `int timer = 0, bridges = 0;
vector<int> num, low;
vector<bool> isArticulation;

void dfs(int u, int p, const vector<vector<int>>& adj) {
    num[u] = low[u] = ++timer;
    int children = 0;
    for (int v : adj[u]) {
        if (v == p) continue;
        if (num[v]) {
            low[u] = min(low[u], num[v]);
        } else {
            children++;
            dfs(v, u, adj);
            low[u] = min(low[u], low[v]);
            if (low[v] > num[u]) bridges++;
            if (p != -1 && low[v] >= num[u]) isArticulation[u] = true;
        }
    }
    if (p == -1 && children > 1) isArticulation[u] = true;
}`,
        explanation: 'Chỉ một lần DFS duy nhất tính cả số Cầu và toàn bộ đỉnh Khớp.'
      },
      {
        language: 'python',
        title: 'Python Tarjan Bridges & Articulation Points',
        basicTitle: 'Python Cơ bản: DFS kiểm tra cầu O(E·(V+E))',
        basicCode: `# Với đồ thị nhỏ, có thể duyệt thử bỏ từng cạnh và BFS đếm đỉnh tới được.`,
        basicExplanation: 'Minh họa khái niệm đồ thị mất liên thông khi cắt cầu.',
        code: `def find_bridges(n, adj):
    num = [0] * (n + 1)
    low = [0] * (n + 1)
    timer = [0]
    bridges = []
    def dfs(u, p):
        timer[0] += 1
        num[u] = low[u] = timer[0]
        for v in adj[u]:
            if v == p: continue
            if num[v]:
                low[u] = min(low[u], num[v])
            else:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > num[u]:
                    bridges.append((u, v))
    for i in range(1, n + 1):
        if not num[i]: dfs(i, -1)
    return bridges`,
        explanation: 'Chú ý bật `sys.setrecursionlimit` nếu $N$ lên tới $10^5$.'
      }
    ],
    practiceProblem: {
      id: 'CS_P17',
      title: 'Đếm số Cầu của Đồ thị Vô hướng (Tarjan)',
      difficulty: 'Hard',
      description: 'Cho đơn đồ thị vô hướng gồm N đỉnh (1..N) và M cạnh (1 ≤ N, M ≤ 10⁵). Một cạnh được gọi là Cầu nếu khi xóa cạnh đó khỏi đồ thị, số thành phần liên thông tăng lên. Hãy đếm số cạnh Cầu.',
      inputFormat: 'Dòng 1: N và M. M dòng tiếp theo: mỗi dòng 2 đỉnh u, v biểu thị cạnh nối.',
      outputFormat: 'In ra số lượng cạnh Cầu.',
      sampleCases: [
        {
          input: '5 5\n1 2\n2 3\n3 1\n3 4\n4 5',
          output: '2',
          explanation: 'Chu trình 1-2-3 không có cầu; hai cạnh (3, 4) và (4, 5) là 2 cạnh cầu.'
        }
      ],
      solutionAnalysis: 'Chạy thuật toán Tarjan: tại mỗi cạnh cây (u → v), nếu low[v] > num[u] thì (u, v) là cầu.',
      basicAnalysis: 'Cơ bản: Lần lượt bỏ qua từng cạnh và chạy DFS/BFS kiểm tra xem hai đầu mút còn đi tới nhau được không.',
      basicSolutionCpp: `#include <iostream>
#include <vector>
using namespace std;

bool vis[1005];
vector<int> adj[1005];
int banU, banV;

void dfs(int u) {
    vis[u] = true;
    for (int v : adj[u]) {
        if ((u == banU && v == banV) || (u == banV && v == banU)) continue;
        if (!vis[v]) dfs(v);
    }
}

int main() {
    int n, m; cin >> n >> m;
    vector<pair<int, int>> edges(m);
    for (int i = 0; i < m; i++) {
        cin >> edges[i].first >> edges[i].second;
        adj[edges[i].first].push_back(edges[i].second);
        adj[edges[i].second].push_back(edges[i].first);
    }
    int ans = 0;
    for (auto e : edges) {
        fill(vis, vis + n + 1, false);
        banU = e.first; banV = e.second;
        dfs(banU);
        if (!vis[banV]) ans++;
    }
    cout << ans;
    return 0;
}`,
      basicSolutionPython: `n, m = map(int, input().split())
edges = [tuple(map(int, input().split())) for _ in range(m)]
adj = [[] for _ in range(n + 1)]
for u, v in edges:
    adj[u].append(v); adj[v].append(u)
ans = 0
for bu, bv in edges:
    vis = [False] * (n + 1)
    st = [bu]; vis[bu] = True
    while st:
        u = st.pop()
        for v in adj[u]:
            if (u == bu and v == bv) or (u == bv and v == bu): continue
            if not vis[v]:
                vis[v] = True; st.append(v)
    if not vis[bv]: ans += 1
print(ans)`,
      fullSolutionCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<pair<int, int>>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v; cin >> u >> v;
        adj[u].push_back({v, i});
        adj[v].push_back({u, i});
    }
    vector<int> num(n + 1, 0), low(n + 1, 0);
    int timer = 0, bridges = 0;
    auto dfs = [&](auto& self, int u, int peid) -> void {
        num[u] = low[u] = ++timer;
        for (auto [v, eid] : adj[u]) {
            if (eid == peid) continue;
            if (num[v]) {
                low[u] = min(low[u], num[v]);
            } else {
                self(self, v, eid);
                low[u] = min(low[u], low[v]);
                if (low[v] > num[u]) bridges++;
            }
        }
    };
    for (int i = 1; i <= n; i++) if (!num[i]) dfs(dfs, i, -1);
    cout << bridges << '\\n';
    return 0;
}`,
      fullSolutionPython: `import sys
sys.setrecursionlimit(300000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n, m = int(data[0]), int(data[1])
    adj = [[] for _ in range(n + 1)]
    idx = 2
    for eid in range(m):
        u, v = int(data[idx]), int(data[idx + 1])
        idx += 2
        adj[u].append((v, eid))
        adj[v].append((u, eid))
    num = [0] * (n + 1)
    low = [0] * (n + 1)
    timer = [0]
    bridges = [0]
    def dfs(u, peid):
        timer[0] += 1
        num[u] = low[u] = timer[0]
        for v, eid in adj[u]:
            if eid == peid: continue
            if num[v]:
                low[u] = min(low[u], num[v])
            else:
                dfs(v, eid)
                low[u] = min(low[u], low[v])
                if low[v] > num[u]:
                    bridges[0] += 1
    for i in range(1, n + 1):
        if not num[i]:
            dfs(i, -1)
    print(bridges[0])

solve()`
    }
  },
  {
    id: 'cs-18',
    level: 'Nâng cao / HSG',
    vnoiPhase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    vnoiTag: 'VNOI Wiki · Max Flow (Edmonds-Karp / Dinic) & Min Cut',
    prerequisites: ['cs-8'],
    lessonNumber: 18,
    title: 'Luồng Cực đại (Max Flow · Edmonds-Karp / Dinic) & Lát cắt Cực tiểu',
    topic: 'Đồ thị thặng dư (Residual Graph) · Định lý Ford-Fulkerson & Cặp ghép Cực đại',
    estimatedMinutes: 26,
    theory: [
      '1. Bài toán Luồng cực đại (Max Flow): Cho mạng có hướng với nguồn $S$, đích $T$, mỗi cung $(u, v)$ có khả năng thông qua $c(u, v)$. Cần tìm tổng lưu lượng lớn nhất có thể đẩy từ $S$ tới $T$ sao cho luồng qua mỗi cung không vượt sức chứa và bảo toàn luồng tại mọi đỉnh trung gian.',
      '2. Đồ thị thặng dư & Cung ngược: Khi đẩy lượng luồng $f$ dọc theo đường tăng luồng $S \\rightsquigarrow T$, ta trừ sức chứa thuận `cap[u][v] -= f` và CỘNG thêm sức chứa nghịch `cap[v][u] += f` để các bước sau có thể "hủy/chuyển hướng" luồng đã đẩy sai.',
      '3. Edmonds-Karp ($O(VE^2)$) vs Dinic ($O(V^2 E)$): Edmonds-Karp dùng BFS tìm đường tăng luồng ngắn nhất theo số cạnh; Dinic dựng đồ thị phân tầng (Level Graph) bằng BFS rồi đẩy đồng thời nhiều luồng (Blocking Flow) với tối ưu `ptr[]` chạy siêu nhanh trong thi đấu.',
      '4. Định lý Max-Flow Min-Cut: Giá trị Luồng cực đại luôn bằng tổng khả năng thông qua của Lát cắt hẹp nhất chia tách $S$ và $T$. Đây cũng là chìa khóa giải bài toán Cặp ghép cực đại đồ thị hai phía (Bipartite Matching) trong $O(E\\sqrt{V})$!'
    ],
    complexity: {
      time: 'O(VE²) với Edmonds-Karp, O(V²E) / O(E√V) với Dinic',
      space: 'O(V + E)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Thuật toán Edmonds-Karp tìm Max Flow',
        basicTitle: 'C++ Cơ bản: Minh họa luồng đẩy qua BFS đơn giản',
        basicCode: `// Ý tưởng cốt lõi: chừng nào BFS còn tìm được đường đi dương từ S -> T,
// tìm nút thắt cổ chai (bottleneck) nhỏ nhất và đẩy luồng + mở cung ngược!`,
        basicExplanation: 'Từng bước BFS tìm đường tăng luồng ngắn nhất trên ma trận sức chứa.',
        code: `long long maxFlowEK(int n, int s, int t, vector<vector<long long>>& cap) {
    long long total = 0;
    while (true) {
        vector<int> parent(n + 1, -1);
        queue<int> q;
        q.push(s); parent[s] = s;
        while (!q.empty() && parent[t] == -1) {
            int u = q.front(); q.pop();
            for (int v = 1; v <= n; v++) {
                if (parent[v] == -1 && cap[u][v] > 0) {
                    parent[v] = u;
                    q.push(v);
                }
            }
        }
        if (parent[t] == -1) break;
        long long push = 1e18;
        for (int v = t; v != s; v = parent[v])
            push = min(push, cap[parent[v]][v]);
        for (int v = t; v != s; v = parent[v]) {
            cap[parent[v]][v] -= push;
            cap[v][parent[v]] += push;
        }
        total += push;
    }
    return total;
}`,
        explanation: 'Cập nhật cả cung thuận cap[u][v] -= push lẫn cung ngược cap[v][u] += push.'
      },
      {
        language: 'python',
        title: 'Python Edmonds-Karp Max Flow',
        basicTitle: 'Python Cơ bản: BFS tìm đường tăng luồng',
        basicCode: `from collections import deque
# Dùng deque chạy BFS trên đồ thị thặng dư tìm bottleneck mỗi vòng.`,
        basicExplanation: 'Code sạch gọn với deque và danh sách kề.',
        code: `from collections import deque

def max_flow(n, s, t, cap):
    flow = 0
    while True:
        parent = [-1] * (n + 1)
        parent[s] = s
        q = deque([s])
        while q and parent[t] == -1:
            u = q.popleft()
            for v in range(1, n + 1):
                if parent[v] == -1 and cap[u][v] > 0:
                    parent[v] = u
                    q.append(v)
        if parent[t] == -1:
            break
        push = 10**18
        v = t
        while v != s:
            push = min(push, cap[parent[v]][v])
            v = parent[v]
        v = t
        while v != s:
            cap[parent[v]][v] -= push
            cap[v][parent[v]] += push
            v = parent[v]
        flow += push
    return flow`,
        explanation: 'Khi không còn đường tăng luồng từ S đến T thì giá trị flow thu được chính là Max Flow.'
      }
    ],
    practiceProblem: {
      id: 'CS_P18',
      title: 'Tìm Luồng Cực Đại từ Nguồn 1 đến Đích N',
      difficulty: 'Hard',
      description: 'Cho mạng có hướng N đỉnh (1..N) và M cung có hướng (1 ≤ N ≤ 200, 1 ≤ M ≤ 2000). Cung thứ i nối u → v với khả năng thông qua c (1 ≤ c ≤ 10⁹). Tính giá trị luồng cực đại từ đỉnh 1 đến đỉnh N.',
      inputFormat: 'Dòng 1: N và M. M dòng tiếp theo: u, v, c.',
      outputFormat: 'In ra một số nguyên là luồng cực đại.',
      sampleCases: [
        {
          input: '4 5\n1 2 10\n1 3 10\n2 3 2\n2 4 4\n3 4 12',
          output: '16',
          explanation: 'Đẩy 4 qua 1→2→4, đẩy 2 qua 1→2→3→4 và đẩy 10 qua 1→3→4, tổng cộng 4 + 2 + 10 = 16.'
        }
      ],
      solutionAnalysis: 'Dùng thuật toán Edmonds-Karp với BFS trên ma trận kề sức chứa thặng dư.',
      basicAnalysis: 'Cơ bản: Tìm đường tăng luồng bằng DFS trên đồ thị thặng dư.',
      basicSolutionCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

long long cap[205][205];
bool vis[205];
int n, m;

long long dfs(int u, long long flow) {
    if (u == n) return flow;
    vis[u] = true;
    for (int v = 1; v <= n; v++) {
        if (!vis[v] && cap[u][v] > 0) {
            long long pushed = dfs(v, min(flow, cap[u][v]));
            if (pushed > 0) {
                cap[u][v] -= pushed;
                cap[v][u] += pushed;
                return pushed;
            }
        }
    }
    return 0;
}

int main() {
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v; long long c; cin >> u >> v >> c;
        cap[u][v] += c;
    }
    long long ans = 0;
    while (true) {
        fill(vis, vis + n + 1, false);
        long long pushed = dfs(1, 1e18);
        if (pushed == 0) break;
        ans += pushed;
    }
    cout << ans;
    return 0;
}`,
      basicSolutionPython: `n, m = map(int, input().split())
cap = [[0] * (n + 1) for _ in range(n + 1)]
for _ in range(m):
    u, v, c = map(int, input().split())
    cap[u][v] += c
def dfs(u, flow, vis):
    if u == n: return flow
    vis[u] = True
    for v in range(1, n + 1):
        if not vis[v] and cap[u][v] > 0:
            p = dfs(v, min(flow, cap[u][v]), vis)
            if p > 0:
                cap[u][v] -= p; cap[v][u] += p
                return p
    return 0
ans = 0
while True:
    p = dfs(1, 10**18, [False] * (n + 1))
    if p == 0: break
    ans += p
print(ans)`,
      fullSolutionCpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<long long>> cap(n + 1, vector<long long>(n + 1, 0));
    for (int i = 0; i < m; i++) {
        int u, v; long long c;
        cin >> u >> v >> c;
        cap[u][v] += c;
    }
    long long total = 0;
    while (true) {
        vector<int> parent(n + 1, -1);
        queue<int> q;
        q.push(1);
        parent[1] = 1;
        while (!q.empty() && parent[n] == -1) {
            int u = q.front(); q.pop();
            for (int v = 1; v <= n; v++) {
                if (parent[v] == -1 && cap[u][v] > 0) {
                    parent[v] = u;
                    q.push(v);
                }
            }
        }
        if (parent[n] == -1) break;
        long long push = 1e18;
        for (int v = n; v != 1; v = parent[v])
            push = min(push, cap[parent[v]][v]);
        for (int v = n; v != 1; v = parent[v]) {
            cap[parent[v]][v] -= push;
            cap[v][parent[v]] += push;
        }
        total += push;
    }
    cout << total << '\\n';
    return 0;
}`,
      fullSolutionPython: `import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n, m = int(data[0]), int(data[1])
    cap = [[0] * (n + 1) for _ in range(n + 1)]
    idx = 2
    for _ in range(m):
        u, v, c = int(data[idx]), int(data[idx + 1]), int(data[idx + 2])
        idx += 3
        cap[u][v] += c
    total = 0
    while True:
        parent = [-1] * (n + 1)
        parent[1] = 1
        q = deque([1])
        while q and parent[n] == -1:
            u = q.popleft()
            for v in range(1, n + 1):
                if parent[v] == -1 and cap[u][v] > 0:
                    parent[v] = u
                    q.append(v)
        if parent[n] == -1:
            break
        push = 10**18
        v = n
        while v != 1:
            push = min(push, cap[parent[v]][v])
            v = parent[v]
        v = n
        while v != 1:
            cap[parent[v]][v] -= push
            cap[v][parent[v]] += push
            v = parent[v]
        total += push
    print(total)

solve()`
    }
  },
  {
    id: 'cs-19',
    level: 'Nâng cao / HSG',
    vnoiPhase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    vnoiTag: 'VNOI Wiki · Heavy-Light Decomposition (HLD)',
    prerequisites: ['cs-9', 'cs-14'],
    lessonNumber: 19,
    title: 'Heavy-Light Decomposition (HLD) & Truy vấn Đường đi Trên Cây',
    topic: 'Phân rã chuỗi nặng–nhẹ · Quy bài toán Cây về Segment Tree O(log² N)',
    estimatedMinutes: 26,
    theory: [
      '1. Ý tưởng phân rã Heavy-Light Decomposition: Với mỗi đỉnh $u$ trên cây gốc 1, chọn một đỉnh con $v$ có kích thước cây con `sz[v]` LỚN NHẤT làm **Heavy Child** (nối thành Heavy Chain), các con còn lại nối qua Light Edge.',
      '2. Tính chất vàng của HLD: Khi đi từ một đỉnh bất kì $u$ lên gốc, mỗi lần băng qua một Light Edge thì kích thước cây con ít nhất tăng GẤP ĐÔI! Do đó đường đi giữa hai đỉnh bất kì $u, v$ bị cắt thành tối đa $O(\\log N)$ đoạn liên tiếp trên mảng `pos[]`.',
      '3. Kết hợp Segment Tree: Đánh số lại toàn bộ cây theo DFS ưu tiên đi qua `heavy[u]` trước để mọi Heavy Chain nằm liên tiếp trên mảng tuyến tính. Mỗi truy vấn cập nhật/tìm max/tổng đường đi $(u, v)$ mất đúng $O(\\log^2 N)$.'
    ],
    complexity: {
      time: 'O(N) tiền xử lý DFS + O(log² N) mỗi truy vấn đường đi',
      space: 'O(N)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Hai bước DFS & Query Đường đi HLD',
        basicTitle: 'C++ Cơ bản: Leo trực tiếp từ u, v lên LCA (O(N))',
        basicCode: `// Leo trực tiếp hai đỉnh u và v bằng parent[] cho đến khi gặp nhau tại LCA,
// tổng giá trị trên đường đi được cộng dồn từng đỉnh (O(N) mỗi truy vấn).`,
        basicExplanation: 'Phiên bản cơ bản dễ hiểu cho cây nhỏ khi Q · N ≤ 10⁷.',
        code: `// DFS 1: tính parent, depth, sz, heavy[u]
int dfsSize(int u, int p) {
    parent[u] = p; depth[u] = depth[p] + 1; sz[u] = 1;
    int maxSub = 0;
    for (int v : adj[u]) if (v != p) {
        int s = dfsSize(v, u);
        sz[u] += s;
        if (s > maxSub) { maxSub = s; heavy[u] = v; }
    }
    return sz[u];
}
// DFS 2: ưu tiên heavy[u] trước để giữ chain liên tiếp trong pos[]
void dfsHld(int u, int h) {
    head[u] = h; pos[u] = ++curPos;
    if (heavy[u]) dfsHld(heavy[u], h);
    for (int v : adj[u])
        if (v != parent[u] && v != heavy[u]) dfsHld(v, v);
}`,
        explanation: 'Nhảy `u = parent[head[u]]` khi hai đầu chuỗi khác nhau cho tới khi cùng chuỗi.'
      },
      {
        language: 'python',
        title: 'Python Leo Cây & Tìm Tổng Đường Đi',
        basicTitle: 'Python Cơ bản: Truy vết parent hai đỉnh',
        basicCode: `def path_max(u, v, parent, depth, val):
    res = -10**18
    while u != v:
        if depth[u] < depth[v]: u, v = v, u
        res = max(res, val[u])
        u = parent[u]
    return max(res, val[u])`,
        basicExplanation: 'Leo trực tiếp theo depth để kiểm chứng logic truy vấn đường đi trên cây.',
        code: `def query_path(u, v, head, parent, depth, pos, seg_query):
    ans = 0
    while head[u] != head[v]:
        if depth[head[u]] < depth[head[v]]:
            u, v = v, u
        ans += seg_query(pos[head[u]], pos[u])
        u = parent[head[u]]
    if depth[u] > depth[v]:
        u, v = v, u
    ans += seg_query(pos[u], pos[v])
    return ans`,
        explanation: 'Mỗi bước vòng while nhảy qua đúng 1 chuỗi nặng nên chạy tối đa O(log N) lần.'
      }
    ],
    practiceProblem: {
      id: 'CS_P19',
      title: 'Cập nhật Đỉnh & Tìm Max trên Đường đi Cây (HLD)',
      difficulty: 'Hard',
      description: 'Cho cây N đỉnh (gốc 1), mỗi đỉnh có giá trị a[i]. Thực hiện Q truy vấn: `1 u x` gán a[u] = x; `2 u v` in ra giá trị lớn nhất trên đường đi đơn từ u đến v.',
      inputFormat: 'Dòng 1: N và Q. Dòng 2: N số a[1..N]. N-1 dòng tiếp: cạnh cây. Q dòng cuối: truy vấn.',
      outputFormat: 'Mỗi truy vấn loại 2 in ra kết quả trên một dòng.',
      sampleCases: [
        {
          input: '4 3\n1 5 3 2\n1 2\n1 3\n2 4\n2 4 3\n1 2 9\n2 4 3',
          output: '5\n9',
          explanation: 'Đường 4–2–1–3 có giá trị [2, 5, 1, 3] → max 5; sau khi đổi a[2] = 9 thì max thành 9.'
        }
      ],
      solutionAnalysis: 'Dùng HLD chuyển cây về mảng `pos[]` rồi chạy Segment Tree quản lý Max đoạn.',
      basicAnalysis: 'Cơ bản: Tiền xử lý depth và parent bằng 1 lần DFS, mỗi truy vấn loại 2 leo dần u và v về LCA.',
      basicSolutionCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
vector<int> adj[100005];
int par[100005], dep[100005], val[100005];
void dfs(int u, int p) {
    par[u] = p; dep[u] = dep[p] + 1;
    for (int v : adj[u]) if (v != p) dfs(v, u);
}
int main() {
    int n, q; cin >> n >> q;
    for (int i = 1; i <= n; i++) cin >> val[i];
    for (int i = 1; i < n; i++) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v); adj[v].push_back(u);
    }
    dfs(1, 0);
    while (q--) {
        int t, u, v; cin >> t >> u >> v;
        if (t == 1) val[u] = v;
        else {
            int ans = -1e9;
            while (u != v) {
                if (dep[u] < dep[v]) swap(u, v);
                ans = max(ans, val[u]);
                u = par[u];
            }
            cout << max(ans, val[u]) << '\\n';
        }
    }
    return 0;
}`,
      basicSolutionPython: `n, q = map(int, input().split())
val = [0] + list(map(int, input().split()))
adj = [[] for _ in range(n + 1)]
for _ in range(n - 1):
    u, v = map(int, input().split())
    adj[u].append(v); adj[v].append(u)
par = [0] * (n + 1); dep = [0] * (n + 1)
st = [(1, 0)]
while st:
    u, p = st.pop()
    par[u] = p
    for v in adj[u]:
        if v != p:
            dep[v] = dep[u] + 1; st.append((v, u))
for _ in range(q):
    t, u, v = map(int, input().split())
    if t == 1: val[u] = v
    else:
        ans = -10**9
        while u != v:
            if dep[u] < dep[v]: u, v = v, u
            ans = max(ans, val[u]); u = par[u]
        print(max(ans, val[u]))`,
      fullSolutionCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

const int INF = 1e9 + 7;
vector<vector<int>> adj;
vector<int> par, dep, heavy, head, pos, val, seg;
int curPos = 0, N;

int dfs1(int u, int p) {
    par[u] = p; dep[u] = dep[p] + 1;
    int sz = 1, mx = 0;
    for (int v : adj[u]) if (v != p) {
        int s = dfs1(v, u);
        sz += s;
        if (s > mx) { mx = s; heavy[u] = v; }
    }
    return sz;
}
void dfs2(int u, int h) {
    head[u] = h; pos[u] = ++curPos;
    if (heavy[u]) dfs2(heavy[u], h);
    for (int v : adj[u]) if (v != par[u] && v != heavy[u]) dfs2(v, v);
}
void upd(int p, int v) {
    for (seg[p += N - 1] = v; p > 1; p >>= 1) seg[p >> 1] = max(seg[p], seg[p ^ 1]);
}
int qry(int l, int r) {
    int res = -INF;
    for (l += N - 1, r += N; l < r; l >>= 1, r >>= 1) {
        if (l & 1) res = max(res, seg[l++]);
        if (r & 1) res = max(res, seg[--r]);
    }
    return res;
}
int main() {
    ios_base::sync_with_stdio(false); cin.tie(NULL);
    int q; if (!(cin >> N >> q)) return 0;
    adj.assign(N + 1, {}); par.assign(N + 1, 0); dep.assign(N + 1, 0);
    heavy.assign(N + 1, 0); head.assign(N + 1, 0); pos.assign(N + 1, 0);
    val.assign(N + 1, 0); seg.assign(2 * N + 4, -INF);
    for (int i = 1; i <= N; i++) cin >> val[i];
    for (int i = 1; i < N; i++) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v); adj[v].push_back(u);
    }
    dfs1(1, 0); dfs2(1, 1);
    for (int i = 1; i <= N; i++) upd(pos[i], val[i]);
    while (q--) {
        int t, u, v; cin >> t >> u >> v;
        if (t == 1) upd(pos[u], v);
        else {
            int ans = -INF;
            while (head[u] != head[v]) {
                if (dep[head[u]] < dep[head[v]]) swap(u, v);
                ans = max(ans, qry(pos[head[u]], pos[u]));
                u = par[head[u]];
            }
            if (dep[u] > dep[v]) swap(u, v);
            cout << max(ans, qry(pos[u], pos[v])) << '\\n';
        }
    }
    return 0;
}`,
      fullSolutionPython: `import sys
sys.setrecursionlimit(300000)

def solve():
    data = sys.stdin.read().split()
    if not data: return
    n, q = int(data[0]), int(data[1])
    val = [0] + [int(x) for x in data[2:2 + n]]
    idx = 2 + n
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = int(data[idx]), int(data[idx + 1]); idx += 2
        adj[u].append(v); adj[v].append(u)
    par = [0] * (n + 1); dep = [0] * (n + 1); heavy = [0] * (n + 1)
    head = [0] * (n + 1); pos = [0] * (n + 1); cur = [0]
    def dfs1(u, p):
        par[u] = p; dep[u] = dep[p] + 1
        sz = 1; mx = 0
        for v in adj[u]:
            if v != p:
                s = dfs1(v, u); sz += s
                if s > mx: mx = s; heavy[u] = v
        return sz
    def dfs2(u, h):
        cur[0] += 1; head[u] = h; pos[u] = cur[0]
        if heavy[u]: dfs2(heavy[u], h)
        for v in adj[u]:
            if v != par[u] and v != heavy[u]: dfs2(v, v)
    dfs1(1, 0); dfs2(1, 1)
    seg = [-10**18] * (2 * n + 4)
    def upd(p, v):
        p += n - 1; seg[p] = v
        while p > 1:
            p >>= 1; seg[p] = max(seg[p << 1], seg[p << 1 | 1])
    def qry(l, r):
        res = -10**18; l += n - 1; r += n
        while l < r:
            if l & 1: res = max(res, seg[l]); l += 1
            if r & 1: r -= 1; res = max(res, seg[r])
            l >>= 1; r >>= 1
        return res
    for i in range(1, n + 1): upd(pos[i], val[i])
    out = []
    for _ in range(q):
        t, u, v = int(data[idx]), int(data[idx + 1]), int(data[idx + 2]); idx += 3
        if t == 1: upd(pos[u], v)
        else:
            ans = -10**18
            while head[u] != head[v]:
                if dep[head[u]] < dep[head[v]]: u, v = v, u
                ans = max(ans, qry(pos[head[u]], pos[u])); u = par[head[u]]
            if dep[u] > dep[v]: u, v = v, u
            out.append(str(max(ans, qry(pos[u], pos[v]))))
    print("\\n".join(out))

solve()`
    }
  },
  {
    id: 'cs-20',
    level: 'Nâng cao / HSG',
    vnoiPhase: 'Phase 3 · Quy hoạch động & Đồ thị',
    vnoiTag: 'VNOI Wiki · DP Bitmask & DP Trên Cây (Tree DP)',
    prerequisites: ['cs-7', 'cs-8'],
    lessonNumber: 20,
    title: 'Quy hoạch động Trạng thái Bitmask & Quy hoạch động Trên Cây (Tree DP)',
    topic: 'Nén tập hợp bằng số nguyên bitmask (N ≤ 20) & Bài toán Người du lịch TSP',
    estimatedMinutes: 23,
    theory: [
      '1. Khái niệm Bitmask: Khi tập hợp có kích thước nhỏ $N \\le 20$, ta biểu diễn một tập con bằng số nguyên $N$-bit `mask` ($0 \\le mask < 2^N$). Bit thứ $i$ bằng 1 nghĩa là phần tử $i$ đã được chọn (`mask >> i & 1`).',
      '2. Các phép toán bit hay dùng: Bật bit $i$: `mask | (1 << i)`; Tắt bit $i$: `mask ^ (1 << i)`; Đếm số bit 1: `__builtin_popcount(mask)`. Bài toán Người du lịch (TSP) dùng `dp[mask][u]` đạt $O(N^2 2^N)$ thay vì $O(N!)$.',
      '3. DP Trên Cây (Tree DP): Tính trạng thái tại nút $u$ từ các nút con $v$ trong lúc duyệt DFS hậu thứ tự (Post-order). Ví dụ Tập độc lập Cực đại trên cây (Maximum Independent Set): `dp[u][0]` (không chọn $u$) $= \\sum \\max(dp[v][0], dp[v][1])$, `dp[u][1]` (chọn $u$) $= w[u] + \\sum dp[v][0]$.'
    ],
    complexity: {
      time: 'O(N²·2ⁿ) cho TSP Bitmask, O(N) cho Tree DP',
      space: 'O(N·2ⁿ) / O(N)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Bitmask DP: Bài toán Người du lịch TSP (Quay lại đỉnh 0)',
        basicTitle: 'C++ Cơ bản: Duyệt toàn bộ hoán vị next_permutation (O(N!))',
        basicCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;
int main() {
    // Với N <= 10, thử mọi hoán vị các thành phố 1..N-1 bằng next_permutation
    return 0;
}`,
        basicExplanation: 'Khi N ≤ 10 có thể sinh hoán vị, nhưng từ N = 14..20 bắt buộc phải dùng Bitmask DP.',
        code: `int tsp(int n, const vector<vector<int>>& dist) {
    const int INF = 1e9;
    vector<vector<int>> dp(1 << n, vector<int>(n, INF));
    dp[1][0] = 0;
    for (int mask = 1; mask < (1 << n); mask++) {
        for (int u = 0; u < n; u++) {
            if (!(mask >> u & 1) || dp[mask][u] >= INF) continue;
            for (int v = 0; v < n; v++) {
                if (mask >> v & 1) continue;
                int nmask = mask | (1 << v);
                dp[nmask][v] = min(dp[nmask][v], dp[mask][u] + dist[u][v]);
            }
        }
    }
    int ans = INF, full = (1 << n) - 1;
    for (int u = 0; u < n; u++) ans = min(ans, dp[full][u] + dist[u][0]);
    return ans;
}`,
        explanation: 'Trạng thái dp[mask][u] lưu chi phí nhỏ nhất đã đi qua tập mask và đang đứng tại u.'
      },
      {
        language: 'python',
        title: 'Python Bitmask TSP',
        basicTitle: 'Python Cơ bản: itertools.permutations',
        basicCode: `from itertools import permutations
# Duyệt mọi hành trình qua các thành phố còn lại khi N nhỏ.`,
        basicExplanation: 'Cách đối chiếu đáp án trên bộ test nhỏ.',
        code: `def tsp(n, dist):
    INF = 10**15
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0
    for mask in range(1, 1 << n):
        for u in range(n):
            if not (mask >> u & 1) or dp[mask][u] >= INF: continue
            for v in range(n):
                if not (mask >> v & 1):
                    nm = mask | (1 << v)
                    if dp[mask][u] + dist[u][v] < dp[nm][v]:
                        dp[nm][v] = dp[mask][u] + dist[u][v]
    return min(dp[(1 << n) - 1][u] + dist[u][0] for u in range(n))`,
        explanation: 'Dùng toán tử dịch bit trên Python rất trực quan và gọn.'
      }
    ],
    practiceProblem: {
      id: 'CS_P20',
      title: 'Hành trình Người Du Lịch Tối Thiểu (TSP Bitmask)',
      difficulty: 'Hard',
      description: 'Cho đồ thị đầy đủ gồm N thành phố (0..N-1, 2 ≤ N ≤ 15) và ma trận chi phí đi lại C[i][j]. Xuất phát từ thành phố 0, hãy tìm tổng chi phí nhỏ nhất để đi qua MỖI thành phố đúng 1 lần rồi quay trở về thành phố 0.',
      inputFormat: 'Dòng 1: N. N dòng tiếp theo: mỗi dòng gồm N số nguyên biểu thị ma trận C[i][j].',
      outputFormat: 'In ra chi phí nhỏ nhất tìm được.',
      sampleCases: [
        {
          input: '4\n0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0',
          output: '80',
          explanation: 'Chu trình 0 → 1 → 3 → 2 → 0 có chi phí 10 + 25 + 30 + 15 = 80.'
        }
      ],
      solutionAnalysis: 'Quy hoạch động bitmask `dp[mask][u]` với $O(N^2 2^N)$ xử lý mượt tới $N = 16$.',
      basicAnalysis: 'Cơ bản: Quay lui sinh hoán vị cho trường hợp N nhỏ.',
      basicSolutionCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int n, c[20][20], ans = 1e9;
bool used[20];
void ql(int u, int cnt, int cost) {
    if (cost >= ans) return;
    if (cnt == n) { ans = min(ans, cost + c[u][0]); return; }
    for (int v = 1; v < n; v++) if (!used[v]) {
        used[v] = true; ql(v, cnt + 1, cost + c[u][v]); used[v] = false;
    }
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) cin >> c[i][j];
    used[0] = true; ql(0, 1, 0);
    cout << ans;
    return 0;
}`,
      basicSolutionPython: `n = int(input())
c = [list(map(int, input().split())) for _ in range(n)]
ans = 10**18
used = [False] * n; used[0] = True
def ql(u, cnt, cost):
    global ans
    if cost >= ans: return
    if cnt == n: ans = min(ans, cost + c[u][0]); return
    for v in range(1, n):
        if not used[v]:
            used[v] = True; ql(v, cnt + 1, cost + c[u][v]); used[v] = False
ql(0, 1, 0); print(ans)`,
      fullSolutionCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false); cin.tie(NULL);
    int n; if (!(cin >> n)) return 0;
    vector<vector<long long>> c(n, vector<long long>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) cin >> c[i][j];
    const long long INF = 1e18;
    vector<vector<long long>> dp(1 << n, vector<long long>(n, INF));
    dp[1][0] = 0;
    for (int mask = 1; mask < (1 << n); mask++) {
        for (int u = 0; u < n; u++) {
            if (!(mask >> u & 1) || dp[mask][u] >= INF) continue;
            for (int v = 0; v < n; v++) {
                if (mask >> v & 1) continue;
                int nm = mask | (1 << v);
                dp[nm][v] = min(dp[nm][v], dp[mask][u] + c[u][v]);
            }
        }
    }
    long long ans = INF;
    int full = (1 << n) - 1;
    for (int u = 0; u < n; u++) ans = min(ans, dp[full][u] + c[u][0]);
    cout << ans << '\\n';
    return 0;
}`,
      fullSolutionPython: `import sys

def solve():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    c = [[int(data[1 + i * n + j]) for j in range(n)] for i in range(n)]
    INF = 10**18
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0
    for mask in range(1, 1 << n):
        for u in range(n):
            if not (mask >> u & 1) or dp[mask][u] >= INF: continue
            for v in range(n):
                if not (mask >> v & 1):
                    nm = mask | (1 << v)
                    val = dp[mask][u] + c[u][v]
                    if val < dp[nm][v]: dp[nm][v] = val
    full = (1 << n) - 1
    print(min(dp[full][u] + c[u][0] for u in range(n)))

solve()`
    }
  },
  {
    id: 'cs-21',
    level: 'Nâng cao / HSG',
    vnoiPhase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    vnoiTag: 'VNOI Wiki · Bao lồi QHĐ (CHT & Li Chao Tree)',
    prerequisites: ['cs-7', 'cs-11'],
    lessonNumber: 21,
    title: 'Kỹ thuật Bao lồi QHĐ (Convex Hull Trick) & Cây Li Chao',
    topic: 'Tối ưu công thức DP bậc nhất dp[i] = min(a_j·x_i + b_j) từ O(N²) xuống O(N) / O(N log X)',
    estimatedMinutes: 25,
    theory: [
      '1. Dấu hiệu nhận biết CHT: Công thức chuyển trạng thái Quy hoạch động có dạng `dp[i] = min_{j < i} (m_j * x_i + c_j) + const`, trong đó hệ số góc $m_j$ chỉ phụ thuộc $j$ và biến truy vấn $x_i$ chỉ phụ thuộc $i$ — tương ứng bài toán tìm đường thẳng thấp nhất tại hoành độ $x_i$!',
      '2. Hàng đợi hai đầu (Deque CHT): Khi hệ số góc $m_j$ giảm dần (hoặc tăng dần) đơn điệu, các đường thẳng hữu ích tạo thành bao dưới lồi. Mỗi lần thêm đường thẳng mới $l_3$, nếu giao điểm $(l_1, l_3)$ nằm bên trái giao điểm $(l_1, l_2)$ thì loại bỏ $l_2$ (bằng phép nhân chéo tránh sai số số thực!).',
      '3. Cây Li Chao (Li Chao Segment Tree): Khi hệ số góc KHÔNG đơn điệu, mỗi nút trên cây quản lý một đoạn $[L, R]$ giữ duy nhất đường thẳng tốt nhất tại điểm giữa `mid`. Thêm mới hoặc truy vấn đều mất $O(\\log(\\text{Coord}))$.'
    ],
    complexity: {
      time: 'O(N) với CHT đơn điệu, O(N log X) với Li Chao Tree',
      space: 'O(N)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Convex Hull Trick đơn điệu (Tìm Min)',
        basicTitle: 'C++ Cơ bản: Tính dp[i] bằng 2 vòng lặp (O(N²))',
        basicCode: `// Duyệt mọi j < i: dp[i] = min(dp[i], m[j] * x[i] + c[j]);`,
        basicExplanation: 'Đúng với mọi dữ liệu nhưng tốn O(N²), dễ TLE khi N = 10⁵.',
        code: `struct Line {
    long long m, c;
    long long eval(long long x) const { return m * x + c; }
};
// Loại l2 nếu l2 bị l1 và l3 che khuất (với m1 > m2 > m3)
bool bad(const Line& l1, const Line& l2, const Line& l3) {
    return (__int128)(l2.c - l1.c) * (l2.m - l3.m) >= (__int128)(l3.c - l2.c) * (l1.m - l2.m);
}`,
        explanation: 'Dùng __int128 khi kiểm tra giao điểm giúp tuyệt đối không tràn số với hệ số 10⁹.'
      },
      {
        language: 'python',
        title: 'Python CHT Bao Lồi',
        basicTitle: 'Python Cơ bản: Duyệt tất cả các đường thẳng',
        basicCode: `def query_naive(lines, x):
    return min(m * x + c for m, c in lines)`,
        basicExplanation: 'Minh họa phép tìm min(m*x + c) tại hoành độ x.',
        code: `from collections import deque

def is_bad(l1, l2, l3):
    return (l2[1] - l1[1]) * (l2[0] - l3[0]) >= (l3[1] - l2[1]) * (l1[0] - l2[0])

def add_line(hull: deque, m: int, c: int):
    while len(hull) >= 2 and is_bad(hull[-2], hull[-1], (m, c)):
        hull.pop()
    hull.append((m, c))`,
        explanation: 'Python hỗ trợ số nguyên lớn mặc định nên kiểm tra giao điểm không lo tràn số.'
      }
    ],
    practiceProblem: {
      id: 'CS_P21',
      title: 'Chi phí Chia Nhóm Tối Thiểu (CHT / DP O(N))',
      difficulty: 'Hard',
      description: 'Cho N điểm sắp xếp tăng dần x[1] < x[2] < ... < x[N] (1 ≤ N ≤ 10⁵) và hằng số K. Nếu ghép một nhóm liên tiếp từ l đến r sẽ tốn chi phí (x[r] - x[l])² + K. Hãy phân hoạch dãy thành các nhóm sao cho tổng chi phí là nhỏ nhất.',
      inputFormat: 'Dòng 1: N và K. Dòng 2: N số nguyên x[1..N] không giảm.',
      outputFormat: 'In ra tổng chi phí nhỏ nhất.',
      sampleCases: [
        {
          input: '4 10\n1 2 5 6',
          output: '22',
          explanation: 'Chia thành 2 nhóm [1, 2] và [5, 6]: ((2-1)² + 10) + ((6-5)² + 10) = 11 + 11 = 22.'
        }
      ],
      solutionAnalysis: 'Viết lại công thức: `dp[i] = min_{j < i} (dp[j] + (x[i] - x[j+1])² + K) = x[i]² + K + min (-2*x[j+1]*x[i] + (dp[j] + x[j+1]²))`. Hệ số góc `m_j = -2*x[j+1]` giảm dần và `x[i]` tăng dần nên chạy CHT Deque trong O(N)!',
      basicAnalysis: 'Cơ bản: Dùng vòng lặp DP 2 chiều O(N²).',
      basicSolutionCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n; long long K; cin >> n >> K;
    vector<long long> x(n + 1), dp(n + 1, 4e18);
    for (int i = 1; i <= n; i++) cin >> x[i];
    dp[0] = 0;
    for (int i = 1; i <= n; i++)
        for (int j = 0; j < i; j++) {
            long long d = x[i] - x[j + 1];
            dp[i] = min(dp[i], dp[j] + d * d + K);
        }
    cout << dp[n];
    return 0;
}`,
      basicSolutionPython: `n, K = map(int, input().split())
x = [0] + list(map(int, input().split()))
dp = [0] + [10**18] * n
for i in range(1, n + 1):
    for j in range(i):
        dp[i] = min(dp[i], dp[j] + (x[i] - x[j + 1])**2 + K)
print(dp[n])`,
      fullSolutionCpp: `#include <iostream>
#include <vector>
#include <deque>
using namespace std;

struct Line {
    long long m, c;
    long long eval(long long x) const { return m * x + c; }
};
bool bad(const Line& a, const Line& b, const Line& c) {
    return (__int128)(b.c - a.c) * (b.m - c.m) >= (__int128)(c.c - b.c) * (a.m - b.m);
}
int main() {
    ios_base::sync_with_stdio(false); cin.tie(NULL);
    int n; long long K;
    if (!(cin >> n >> K)) return 0;
    vector<long long> x(n + 1), dp(n + 1, 0);
    for (int i = 1; i <= n; i++) cin >> x[i];
    deque<Line> hull;
    hull.push_back({-2 * x[1], x[1] * x[1]});
    for (int i = 1; i <= n; i++) {
        while (hull.size() >= 2 && hull[0].eval(x[i]) >= hull[1].eval(x[i]))
            hull.pop_front();
        dp[i] = x[i] * x[i] + K + hull[0].eval(x[i]);
        if (i < n) {
            Line nl = {-2 * x[i + 1], dp[i] + x[i + 1] * x[i + 1]};
            if (hull.back().m == nl.m) {
                if (nl.c < hull.back().c) hull.pop_back();
                else continue;
            }
            while (hull.size() >= 2 && bad(hull[hull.size() - 2], hull.back(), nl))
                hull.pop_back();
            hull.push_back(nl);
        }
    }
    cout << dp[n] << '\\n';
    return 0;
}`,
      fullSolutionPython: `import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data: return
    n, K = int(data[0]), int(data[1])
    x = [0] + [int(v) for v in data[2:2 + n]]
    dp = [0] * (n + 1)
    hull = deque([(-2 * x[1], x[1] * x[1])])
    def eval_l(ln, v): return ln[0] * v + ln[1]
    def bad(a, b, c): return (b[1] - a[1]) * (b[0] - c[0]) >= (c[1] - b[1]) * (a[0] - b[0])
    for i in range(1, n + 1):
        while len(hull) >= 2 and eval_l(hull[0], x[i]) >= eval_l(hull[1], x[i]):
            hull.popleft()
        dp[i] = x[i] * x[i] + K + eval_l(hull[0], x[i])
        if i < n:
            nl = (-2 * x[i + 1], dp[i] + x[i + 1] * x[i + 1])
            if hull[-1][0] == nl[0]:
                if nl[1] < hull[-1][1]: hull.pop()
                else: continue
            while len(hull) >= 2 and bad(hull[-2], hull[-1], nl):
                hull.pop()
            hull.append(nl)
    print(dp[n])

solve()`
    }
  },
  {
    id: 'cs-22',
    level: 'Nâng cao / HSG',
    vnoiPhase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    vnoiTag: 'VNOI Wiki · Tìm đường A* Heuristic & Octree 3D',
    prerequisites: ['cs-8'],
    lessonNumber: 22,
    title: 'Thuật toán Tìm đường A* Heuristic & Phân hoạch Không gian Octree 3D',
    topic: 'Hàm đánh giá f(n) = g(n) + h(n) (Manhattan/Euclidean) & Cây bát phân 8 vùng 3D',
    estimatedMinutes: 22,
    theory: [
      '1. Từ Dijkstra đến Thuật toán A*: Thuật toán Dijkstra mở rộng đều theo mọi hướng vì chỉ xét khoảng cách thực từ gốc `g(n)`. Thuật toán A* sử dụng hàm ưu tiên $f(n) = g(n) + h(n)$, trong đó $h(n)$ là ước lượng khoảng cách từ $n$ tới đích (Heuristic).',
      '2. Điều kiện tối ưu (Admissible Heuristic): Nếu $h(n)$ không bao giờ ước lượng LỚN HƠN chi phí thực tế tới đích (ví dụ khoảng cách Manhattan trên lưới 4 hướng hoặc Euclidean trên không gian 3D), A* đảm bảo tìm ra đường đi NGẮN NHẤT mà duyệt ít ô hơn hẳn Dijkstra!',
      '3. Phân hoạch Không gian Octree 3D: Tương tự Quadtree trên mặt phẳng 2D chia một hình vuông thành 4 phần, Octree chia đệ quy một khối hộp lập phương 3D thành **8 khối hộp con (Octants)** theo 3 trục $X, Y, Z$ — cấu trúc xương sống của mọi Game Engine 3D, Robotics SLAM và phát hiện va chạm hàng triệu vật thể.'
    ],
    complexity: {
      time: 'O((V + E) log V) cho A*, O(log₈ Vol) cho truy vấn Octree',
      space: 'O(V) / O(N)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Tìm đường A* trên Lưới 2D/3D với Manhattan Heuristic',
        basicTitle: 'C++ Cơ bản: BFS tìm đường ngắn nhất không trọng số',
        basicCode: `// Với lưới không trọng số, BFS luôn tìm được đường ngắn nhất O(R·C)
// trong khi A* định hướng thẳng về đích nhờ hàm f = g + h.`,
        basicExplanation: 'BFS duyệt đồng tâm; A* ưu tiên nhánh hướng về mục tiêu.',
        code: `struct Node {
    int x, y, g, f;
    bool operator>(const Node& o) const { return f > o.f; }
};
int manhattan(int x1, int y1, int x2, int y2) {
    return abs(x1 - x2) + abs(y1 - y2);
}`,
        explanation: 'Khoảng cách Manhattan luôn ≤ đường đi thực trên lưới 4 hướng nên A* luôn tối ưu.'
      },
      {
        language: 'python',
        title: 'Python A* Heuristic Priority Queue',
        basicTitle: 'Python Cơ bản: BFS trên lưới bằng deque',
        basicCode: `from collections import deque
# Dùng deque mở rộng 4 hướng kề hợp lệ trên lưới.`,
        basicExplanation: 'Dùng để so sánh số bước mở rộng của BFS so với A*.',
        code: `import heapq

def a_star_grid(grid, sx, sy, tx, ty):
    R, C = len(grid), len(grid[0])
    g = {(sx, sy): 0}
    pq = [(abs(sx - tx) + abs(sy - ty), 0, sx, sy)]
    while pq:
        f, cur_g, x, y = heapq.heappop(pq)
        if (x, y) == (tx, ty):
            return cur_g
        if cur_g > g.get((x, y), 10**9):
            continue
        for dx, dy in ((1,0), (-1,0), (0,1), (0,-1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < R and 0 <= ny < C and grid[nx][ny] == 0:
                ng = cur_g + 1
                if ng < g.get((nx, ny), 10**9):
                    g[(nx, ny)] = ng
                    heapq.heappush(pq, (ng + abs(nx - tx) + abs(ny - ty), ng, nx, ny))
    return -1`,
        explanation: 'Ưu tiên mở rộng ô có f = g + h nhỏ nhất bằng heapq.'
      }
    ],
    practiceProblem: {
      id: 'CS_P22',
      title: 'Tìm đường Ngắn nhất trên Mê cung Có vật cản (A* / BFS)',
      difficulty: 'Medium',
      description: 'Cho lưới kích thước R × C (1 ≤ R, C ≤ 500) gồm các ô trống `.` và ô tường `#`. Xuất phát từ ô góc trên trái (1, 1), hãy tìm số bước ít nhất để đi tới ô góc dưới phải (R, C) bằng cách di chuyển sang 4 ô kề cạnh. In -1 nếu không có đường đi.',
      inputFormat: 'Dòng 1: R và C. R dòng tiếp theo: mỗi dòng C ký tự (`.` hoặc `#`).',
      outputFormat: 'In ra số bước ngắn nhất từ (1, 1) đến (R, C), hoặc -1.',
      sampleCases: [
        {
          input: '3 4\n..#.\n.#..\n...#',
          output: '-1',
          explanation: 'Ô đích (3, 4) bị tường `#` chặn hoặc không có đường đi hợp lệ.'
        },
        {
          input: '3 3\n..#\n.#.\n...',
          output: '4',
          explanation: 'Đường đi (1,1)→(2,1)→(3,1)→(3,2)→(3,3) tốn 4 bước.'
        }
      ],
      solutionAnalysis: 'Dùng thuật toán A* với hàm Heuristic Manhattan $h(x, y) = |R - x| + |C - y|$ (hoặc BFS O(R·C)) từ (0, 0) đến (R-1, C-1).',
      basicAnalysis: 'Cơ bản: Duyệt BFS bằng hàng đợi queue lưu tọa độ (r, c) và khoảng cách.',
      basicSolutionCpp: `#include <iostream>
#include <vector>
#include <queue>
#include <string>
using namespace std;
int main() {
    int r, c; cin >> r >> c;
    vector<string> g(r);
    for (int i = 0; i < r; i++) cin >> g[i];
    if (g[0][0] == '#' || g[r - 1][c - 1] == '#') { cout << -1; return 0; }
    vector<vector<int>> d(r, vector<int>(c, -1));
    queue<pair<int, int>> q;
    d[0][0] = 0; q.push({0, 0});
    int dx[4] = {1, -1, 0, 0}, dy[4] = {0, 0, 1, -1};
    while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        for (int k = 0; k < 4; k++) {
            int nx = x + dx[k], ny = y + dy[k];
            if (nx >= 0 && nx < r && ny >= 0 && ny < c && g[nx][ny] == '.' && d[nx][ny] == -1) {
                d[nx][ny] = d[x][y] + 1;
                q.push({nx, ny});
            }
        }
    }
    cout << d[r - 1][c - 1];
    return 0;
}`,
      basicSolutionPython: `from collections import deque
r, c = map(int, input().split())
g = [input().strip() for _ in range(r)]
if g[0][0] == '#' or g[r - 1][c - 1] == '#':
    print(-1)
else:
    d = [[-1] * c for _ in range(r)]
    d[0][0] = 0; q = deque([(0, 0)])
    while q:
        x, y = q.popleft()
        for dx, dy in ((1,0), (-1,0), (0,1), (0,-1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < r and 0 <= ny < c and g[nx][ny] == '.' and d[nx][ny] == -1:
                d[nx][ny] = d[x][y] + 1; q.append((nx, ny))
    print(d[r - 1][c - 1])`,
      fullSolutionCpp: `#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <cmath>
using namespace std;

struct State {
    int f, g, x, y;
    bool operator>(const State& o) const { return f > o.f; }
};

int main() {
    ios_base::sync_with_stdio(false); cin.tie(NULL);
    int r, c;
    if (!(cin >> r >> c)) return 0;
    vector<string> grid(r);
    for (int i = 0; i < r; i++) cin >> grid[i];
    if (grid[0][0] == '#' || grid[r - 1][c - 1] == '#') {
        cout << -1 << '\\n';
        return 0;
    }
    const int INF = 1e9;
    vector<vector<int>> g(r, vector<int>(c, INF));
    priority_queue<State, vector<State>, greater<State>> pq;
    g[0][0] = 0;
    pq.push({(r - 1) + (c - 1), 0, 0, 0});
    int dx[4] = {1, -1, 0, 0}, dy[4] = {0, 0, 1, -1};
    while (!pq.empty()) {
        auto cur = pq.top(); pq.pop();
        if (cur.x == r - 1 && cur.y == c - 1) {
            cout << cur.g << '\\n';
            return 0;
        }
        if (cur.g > g[cur.x][cur.y]) continue;
        for (int k = 0; k < 4; k++) {
            int nx = cur.x + dx[k], ny = cur.y + dy[k];
            if (nx >= 0 && nx < r && ny >= 0 && ny < c && grid[nx][ny] == '.') {
                int ng = cur.g + 1;
                if (ng < g[nx][ny]) {
                    g[nx][ny] = ng;
                    int h = abs(r - 1 - nx) + abs(c - 1 - ny);
                    pq.push({ng + h, ng, nx, ny});
                }
            }
        }
    }
    cout << -1 << '\\n';
    return 0;
}`,
      fullSolutionPython: `import sys, heapq

def solve():
    data = sys.stdin.read().split()
    if not data: return
    r, c = int(data[0]), int(data[1])
    grid = data[2:2 + r]
    if grid[0][0] == '#' or grid[r - 1][c - 1] == '#':
        print(-1); return
    INF = 10**9
    g = [[INF] * c for _ in range(r)]
    g[0][0] = 0
    pq = [(r + c - 2, 0, 0, 0)]
    while pq:
        f, cg, x, y = heapq.heappop(pq)
        if (x, y) == (r - 1, c - 1):
            print(cg); return
        if cg > g[x][y]: continue
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < r and 0 <= ny < c and grid[nx][ny] == '.':
                ng = cg + 1
                if ng < g[nx][ny]:
                    g[nx][ny] = ng
                    heapq.heappush(pq, (ng + (r - 1 - nx) + (c - 1 - ny), ng, nx, ny))
    print(-1)

solve()`
    }
  }
];
