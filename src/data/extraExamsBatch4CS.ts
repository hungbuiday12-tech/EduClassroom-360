import { ExamPaper, ExamQuestion } from '../types';
import { ALL_CHUYEN_SCHOOLS_BATCH_4, ALL_THPT_SCHOOLS_BATCH_4 } from './extraExamsBatch4Math';

export function buildCSChuyenBatch4(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 100; i++) {
    const num = 76 + i;
    const school = ALL_CHUYEN_SCHOOLS_BATCH_4[i % ALL_CHUYEN_SCHOOLS_BATCH_4.length];
    const year = i % 2 === 0 ? '2025-2026' : '2024-2025';

    const limitN = 100000 + (i % 10) * 50000;
    const modVal = [1000000007, 998244353, 1000000009][i % 3];
    const kVal = 2 + (i % 6);

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho xâu ký tự $S$ độ dài $N \\le ${limitN}$. Hãy trình bày thuật toán **Z-Function** tính mảng $Z[0..N-1]$ (với $Z[i]$ là độ dài tiền tố chung dài nhất giữa $S$ và $S[i..N-1]$) trong thời gian tuyến tính $\\mathcal{O}(N)$ và áp dụng tìm mọi vị trí xuất hiện của mẫu $P$ trong văn bản $T$.`,
        solution: `Ghép $S = P + \\text{"\\#"} + T$, tính mảng $Z$ bằng cửa sổ $[L, R]$; mọi vị trí $i > |P|$ có $Z[i] = |P|$ là một lần xuất hiện của $P$ trong $T$:\n\`\`\`cpp\nvector<int> zFunc(const string& s) {\n    int n = s.size();\n    vector<int> z(n, 0);\n    for (int i = 1, l = 0, r = 0; i < n; i++) {\n        if (i <= r) z[i] = min(r - i + 1, z[i - l]);\n        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;\n        if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }\n    }\n    return z;\n}\n\`\`\``,
        keyFormulasOrHints: ['Z-box [L, R] giúp tái sử dụng z[i - L]', 'Ghép P + "#" + T để khớp mẫu O(|T| + |P|)'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Mô phỏng Thuật toán Xâu 2D/3D' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho xâu $S$ ($|S| \\le ${limitN}$). Sử dụng **Thuật toán Manacher** tìm độ dài xâu con liên tiếp đối xứng (Palindrome) dài nhất của $S$ trong $\\mathcal{O}(N)$ thời gian và $\\mathcal{O}(N)$ bộ nhớ.`,
        solution: `Chèn ký tự phân cách \`#\` xen giữa mọi ký tự ($T = \\text{"\\string^\\#"} + \\dots + \\text{"\\#\\$"}$) để quy mọi tâm đối xứng về tâm lẻ, duy trì tâm $C$ và biên phải $R$:\n\`\`\`cpp\nint manacher(const string& s) {\n    string t = "^#";\n    for (char c : s) { t.push_back(c); t.push_back('#'); }\n    t.push_back('$');\n    int n = t.size(), c = 0, r = 0, best = 0;\n    vector<int> p(n, 0);\n    for (int i = 1; i < n - 1; i++) {\n        if (i < r) p[i] = min(r - i, p[2 * c - i]);\n        while (t[i + p[i] + 1] == t[i - p[i] - 1]) p[i]++;\n        if (i + p[i] > r) { c = i; r = i + p[i]; }\n        best = max(best, p[i]);\n    }\n    return best;\n}\n\`\`\``,
        keyFormulasOrHints: ['Biến đổi chẵn/lẻ thành tâm lẻ bằng ký tự #', 'Đối xứng gương mirr = 2*C - i']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho $Q \\le ${limitN}$ truy vấn, mỗi truy vấn yêu cầu tính tổ hợp $\\binom{n}{k} \\bmod ${modVal}$ ($0 \\le k \\le n \\le 10^6$). Hãy viết chương trình giải quyết trong $\\mathcal{O}(N + Q)$.`,
        solution: `Tiền xử lý \`fact[i]\` và \`invFact[i]\` theo định lý Fermat nhỏ $a^{-1} \\equiv a^{M-2} \\pmod M$:\n\`\`\`cpp\nconst long long MOD = ${modVal};\nlong long binpow(long long a, long long b) {\n    long long res = 1;\n    while (b) { if (b & 1) res = res * a % MOD; a = a * a % MOD; b >>= 1; }\n    return res;\n}\n\`\`\``,
        keyFormulasOrHints: ['Nghịch đảo modulo bằng lũy thừa nhị phân', 'invFact[i - 1] = invFact[i] * i % MOD']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho dãy $N \\le ${limitN}$ số nguyên dương và số nguyên dương $S$. Dùng kỹ thuật **Hai con trỏ (Two Pointers)** đếm số đoạn con liên tiếp $[L, R]$ có tổng $\\le S$ trong thời gian $\\mathcal{O}(N)$.`,
        solution: `Với mỗi đầu phải $r$, tăng $l$ tới khi tổng đoạn $[l, r] \\le S$, cộng thêm $(r - l + 1)$ đoạn kết thúc tại $r$:\n\`\`\`cpp\nlong long sum = 0, ans = 0;\nfor (int l = 0, r = 0; r < n; r++) {\n    sum += a[r];\n    while (sum > S) sum -= a[l++];\n    ans += (r - l + 1);\n}\n\`\`\``,
        keyFormulasOrHints: ['Mảng dương nên tổng đơn điệu theo l, r', 'Cộng (r - l + 1) đoạn kết thúc tại r']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho dãy số nguyên $A$ gồm $N \\le 40$ phần tử. Đếm số tập con có tổng các phần tử bằng $S$ bằng kỹ thuật **Chia đôi tập hợp (Meet-in-the-Middle)** trong $\\mathcal{O}(2^{N/2} N)$.`,
        solution: `Sinh toàn bộ $2^{N/2}$ tổng tập con cho nửa trái \`L\` và nửa phải \`R\`, sắp xếp \`R\` và dùng \`equal_range(S - x)\` (tức \`upper_bound - lower_bound\`) để đếm trong thời gian dưới $0.2\\text{s}$.`,
        keyFormulasOrHints: ['Chia đôi tập N = 40 thành hai tập 20', 'Sắp xếp + tìm kiếm nhị phân S - x']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho đồ thị đầy đủ $N$ thành phố ($N \\le 16$) với ma trận chi phí $C[i][j]$. Xuất phát từ $0$, dùng **Quy hoạch động Bitmask** tìm chu trình Hamilton đi qua mỗi thành phố đúng 1 lần quay về $0$ có tổng chi phí nhỏ nhất.`,
        solution: `Định nghĩa \`dp[mask][u]\` là chi phí nhỏ nhất đi qua tập bit \`mask\` kết thúc tại \`u\`:\n\`\`\`cpp\ndp[1][0] = 0;\nfor (int mask = 1; mask < (1 << n); mask++)\n  for (int u = 0; u < n; u++) if (mask >> u & 1)\n    for (int v = 0; v < n; v++) if (!(mask >> v & 1))\n      dp[mask | (1 << v)][v] = min(dp[mask | (1 << v)][v], dp[mask][u] + c[u][v]);\n\`\`\``,
        keyFormulasOrHints: ['Bitmask 0..(2^N - 1)', 'Đáp án min(dp[(1<<n)-1][u] + c[u][0])'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Bảng QHĐ Bitmask 2D/3D' }
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho $N \\le ${limitN}$ điểm tăng dần $x_1 < x_2 < \\dots < x_N$ và hằng số $K$. Phân hoạch dãy thành các nhóm liên tiếp với chi phí mỗi nhóm $[l, r]$ là $(x_r - x_l)^2 + K$. Tối ưu công thức DP bằng **Bao lồi QHĐ (Convex Hull Trick)** về $\\mathcal{O}(N)$.`,
        solution: `Công thức DP: $dp[i] = x_i^2 + K + \\min_{j < i}(-2x_{j+1}\\cdot x_i + dp[j] + x_{j+1}^2)$.\nVì hệ số góc $m_j = -2x_{j+1}$ giảm dần và $x_i$ tăng dần nên ta dùng \`deque\` quản lý bao dưới lồi và kiểm tra giao điểm bằng kiểu \`__int128\` để tránh tràn số trong $\\mathcal{O}(N)$.`,
        keyFormulasOrHints: ['dp[i] = min(m_j x_i + c_j) + const', 'Dùng __int128 tránh tràn khi nhân chéo']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho $N$ đống đá xếp hàng ($N \\le 300$), đống $i$ có $a_i$ viên. Mỗi lần gộp hai đống kề nhau tốn chi phí bằng tổng số viên mới. Dùng **Quy hoạch động khoảng (Interval DP)** tìm tổng chi phí gộp nhỏ nhất.`,
        solution: `$dp[l][r] = \\min_{l \\le k < r}(dp[l][k] + dp[k+1][r]) + (pref[r] - pref[l-1])$, duyệt theo độ dài đoạn $len = 2..N$. Độ phức tạp $\\mathcal{O}(N^3)$.`,
        keyFormulasOrHints: ['Duyệt theo độ dài đoạn len = 2..N', 'Tách điểm chia k tối ưu trong [l, r)']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho cái túi sức chứa $W \\le 10^4$ và $N \\le 1000$ đồ vật (khối lượng $w_i$, giá trị $v_i$, tối đa $1$ lần chọn). Hãy cài đặt **0/1 Knapsack** tối ưu bộ nhớ $\\mathcal{O}(W)$ kết hợp tìm **Dãy con tăng dài nhất (LIS)** trong $\\mathcal{O}(N\\log N)$ bằng \`lower_bound\`.`,
        solution: `Với 0/1 Knapsack 1D: duyệt ngược \`for (int j = W; j >= w[i]; j--)\`.\nVới LIS $\\mathcal{O}(N\\log N)$: duy trì mảng \`tails[]\`, với mỗi \`x\`, tìm \`auto it = lower_bound(tails.begin(), tails.end(), x)\`; nếu là \`end()\` thì \`push_back(x)\`, ngược lại gán \`*it = x\`.`,
        keyFormulasOrHints: ['Knapsack 1D duyệt j từ W về w[i]', 'Patience Sorting lower_bound cho LIS O(N log N)']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho cây $N \\le ${limitN}$ đỉnh có trọng số $w_u$. Tính tổng trọng số lớn nhất của **Tập độc lập cực đại (Maximum Independent Set)** và **Đường kính cây (Tree Diameter)** chỉ bằng $\\mathcal{O}(N)$ DFS.`,
        solution: `Tree DP: \`dp[u][1] = w[u] + sum dp[v][0]\`, \`dp[u][0] = sum max(dp[v][0], dp[v][1])\`.\nĐường kính cây: DFS/BFS $2$ lần (từ đỉnh $1$ tìm đỉnh xa nhất $u$, từ $u$ tìm đỉnh xa nhất $v$).`,
        keyFormulasOrHints: ['Tree DP 2 trạng thái dp[u][0/1]', '2 lần BFS/DFS tìm đường kính cây']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho mạng giao thông có hướng $N \\le 200$ đỉnh, $M \\le 2000$ cung có khả năng thông qua $c(u, v) \\le 10^9$. Cài đặt thuật toán **Edmonds-Karp / Dinic** tìm **Luồng cực đại (Max Flow)** từ nguồn $1$ tới đích $N$.`,
        solution: `Dùng BFS tìm đường tăng luồng ngắn nhất từ $1$ đến $N$ trên đồ thị thặng dư, tìm nút thắt \`push = min(cap[parent[v]][v])\`, cộng dồn \`cap[u][v] -= push; cap[v][u] += push\` cho tới khi không còn đường tăng luồng.`,
        keyFormulasOrHints: ['Cung thuận trừ push, cung ngược cộng push', 'Định lý Max-Flow Min-Cut'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Mô phỏng Luồng Cực đại 3D' }
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho đơn đồ thị vô hướng $N, M \\le ${limitN}$. Cài đặt **Thuật toán Tarjan** ($\mathcal{O}(N + M)$) tìm tất cả **Cạnh Cầu** và **Đỉnh Khớp** của đồ thị.`,
        solution: `Tính mảng thời gian thăm \`num[u]\` và giá trị nhỏ nhất vươn lên qua 1 cạnh ngược \`low[u]\`. Cạnh $(u, v)$ là cầu khi \`low[v] > num[u]\`; đỉnh $u$ là khớp nếu là gốc có $> 1$ nhánh con hoặc không phải gốc và có con $v$ thỏa \`low[v] >= num[u]\`.`,
        keyFormulasOrHints: ['Cầu: low[v] > num[u]', 'Khớp: low[v] >= num[u] (xét riêng đỉnh gốc)']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho đồ thị có hướng có trọng số không âm $N, M \\le ${limitN}$. Dùng **Dijkstra** đếm số đường đi ngắn nhất từ $1$ đến $N$ theo modulo $${modVal}$.`,
        solution: `Song song với \`dist[v]\`, lưu \`ways[v]\`: khi tìm được đường tốt hơn hẳn (\`<\`) thì gán \`ways[v] = ways[u]\`; khi tìm được đường bằng nhau (\`==\`) thì cộng \`ways[v] = (ways[v] + ways[u]) % MOD\`.`,
        keyFormulasOrHints: ['Priority Queue O((N + M) log N)', 'Cập nhật ways[v] cho cả 2 nhánh < và ==']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho mê cung lưới $R \\times C$ ($R, C \\le 500$) có ô trống \`.\` và tường \`#\`. Hãy phân tích **Thuật toán tìm đường A* Heuristic** (với $f(n) = g(n) + h(n)$) và chứng minh tính tối ưu khi $h$ là khoảng cách Manhattan.`,
        solution: `Hàm Heuristic Manhattan $h(x, y) = |R - 1 - x| + |C - 1 - y|$ luôn nhỏ hơn hoặc bằng độ dài đường đi ngắn nhất thực tế trên lưới $4$ hướng (tức *Admissible*), nên A* luôn tìm được đáp án tối ưu giống BFS nhưng mở rộng ít trạng thái hơn đáng kể.`,
        keyFormulasOrHints: ['f(n) = g(n) + h(n)', 'Manhattan Heuristic luôn Admissible trên lưới 4 hướng'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'A* Heuristic & Octree 3D' }
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho đồ thị vô hướng có trọng số gồm $N \\le ${limitN}$ đỉnh và $M$ cạnh. Dùng **DSU (Union-Find)** và thuật toán **Kruskal** tìm **Cây khung nhỏ nhất (MST)**; kiểm tra xem đồ thị có liên thông hay không.`,
        solution: `Sắp xếp các cạnh theo trọng số tăng dần. Dùng DSU với nén đường đi (Path Compression) và gộp theo hạng (Union by Size/Rank). Thêm cạnh $(u, v)$ nếu \`find(u) != find(v)\` cho tới khi thu được $N - 1$ cạnh.`,
        keyFormulasOrHints: ['DSU Path Compression + Rank O(alpha(N))', 'Kruskal O(M log M)']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho mảng $A$ gồm $N \\le ${limitN}$ phần tử và $Q \\le ${limitN}$ truy vấn: \`1 L R V\` cộng thêm $V$ vào đoạn $[L, R]$; \`2 L R\` tính tổng đoạn $[L, R]$. Thiết kế **Segment Tree Lazy Propagation** đạt $\\mathcal{O}(\\log N)$ mỗi truy vấn.`,
        solution: `Mỗi nút cây lưu \`tree[node]\` (tổng đoạn) và \`lazy[node]\` (lượng cộng chờ đẩy). Khi cập nhật lồng trọn $[ql, qr] \\supseteq [l, r]$, tăng ngay \`tree[node] += v * (r - l + 1)\`, \`lazy[node] += v\` rồi dừng. Trước khi đi xuống 2 con, gọi \`push(node, l, r)\` để xả \`lazy\`.`,
        keyFormulasOrHints: ['Cập nhật lười Lazy Tag lazy[node]', 'Xả push() trước khi rẽ 2 nhánh con'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Segment Tree 3D' }
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho cây $N \\le ${limitN}$ đỉnh, mỗi đỉnh có giá trị $a[u]$, và $Q$ truy vấn: cập nhật $a[u] = x$ hoặc tìm $\\max$ trên đường đi đơn từ $u$ đến $v$. Hãy sử dụng **Heavy-Light Decomposition (HLD)** kết hợp Segment Tree đạt $\\mathcal{O}(\\log^2 N)$ mỗi truy vấn.`,
        solution: `DFS lần 1 tìm kích thước cây con \`sz[u]\` và chọn đỉnh con lớn nhất làm \`heavy[u]\`. DFS lần 2 gán thứ tự liên tiếp \`pos[u]\` ưu tiên đi theo \`heavy[u]\` trước để mỗi Heavy Chain trở thành một đoạn liên tiếp trên Segment Tree. Khi truy vấn đường $(u, v)$, nhảy \`u = par[head[u]]\` tối đa $\\mathcal{O}(\\log N)$ lần.`,
        keyFormulasOrHints: ['Heavy Child là con có sz[v] lớn nhất', 'Độ phức tạp truy vấn đường đi O(log^2 N)']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho dãy $N \\le ${limitN}$ số nguyên dương ($a_i \\le 10^9$). Hãy kết hợp **Rời rạc hóa (Coordinate Compression)** và **Cây Fenwick (BIT)** để đếm số cặp nghịch thế $(i < j, a_i > a_j)$ trong $\\mathcal{O}(N\\log N)$.`,
        solution: `Nén $a_i$ về miền $[1..N]$ bằng \`sort + unique + lower_bound\`. Sau đó duyệt ngược $i = N \\to 1$, cộng \`bit.prefix(a[i] - 1)\` vào kết quả và gọi \`bit.add(a[i], 1)\` với vòng nhảy \`i += i & -i\`.`,
        keyFormulasOrHints: ['i & -i lấy bit 1 thấp nhất', 'Duyệt phải qua trái đếm phần tử nhỏ hơn']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho tập $N \\le ${limitN}$ số nguyên không âm $A_i < 2^{30}$. Thiết kế **Binary Trie (Cây tiền tố nhị phân 30 bit)** để tìm cặp hai số có phép toán $A_i \\oplus A_j$ (**XOR lớn nhất**) trong $\\mathcal{O}(N\\log(\\max A))$.`,
        solution: `Chèn từng số $A_i$ theo thứ tự từ bit cao nhất ($29$) xuống bit $0$ vào cây nhị phân gồm $2$ nhánh \`0\` và \`1\`. Khi truy vấn cho $x$, ở mỗi bit $b = (x \\gg k) \\& 1$, luôn ưu tiên đi vào nhánh ngược \`1 - b\` nếu tồn tại để đóng góp $2^k$ vào kết quả XOR.`,
        keyFormulasOrHints: ['Duyệt từ bit MSB (29) xuống LSB (0)', 'Ưu tiên rẽ nhánh bit đối 1 - b'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Cây Tiền tố Trie 3D' }
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho $N \\le ${limitN}$ phần tử và chỉ số $k = ${kVal}$. Dùng **Hàng đợi hai đầu đơn điệu (Monotonic Deque)** tìm giá trị nhỏ nhất (hoặc lớn nhất) trong mọi cửa sổ trượt kích thước đúng bằng $k$ trong thời gian tuyến tính $\\mathcal{O}(N)$.`,
        solution: `Lưu chỉ số trong \`deque<int> dq\`: trước khi đẩy $i$, loại bỏ khỏi \`back\` mọi chỉ số $j$ có $a[j] \\ge a[i]$ (khi tìm min); loại bỏ khỏi \`front\` nếu $dq.front() \\le i - k$. Khi $i \\ge k - 1$, đáp án cửa sổ kết thúc tại $i$ là \`a[dq.front()]\`.`,
        keyFormulasOrHints: ['Mỗi phần tử vào/ra deque tối đa 1 lần -> O(N)', 'Loại phần tử quá hạn i - k ở đầu deque']
      }
    ];

    const s1 = i % 5;
    const s2 = (i + Math.floor(i / 5)) % 5;
    const s3 = (i + 2 * Math.floor(i / 5)) % 5;
    const s4 = (i + 3 * Math.floor(i / 5)) % 5;

    const q1 = q1Pool[s1];
    const q2 = q2Pool[s2];
    const q3 = q3Pool[s3];
    const q4 = q4Pool[s4];

    exams.push({
      id: `cs-chuyen-${num}`,
      subject: 'cs',
      track: 'chuyen',
      subjectTag: 'Tin Học Chuyên',
      categoryTag: i % 2 === 0 ? 'Chuyên Tin & VNOI HSG Quốc Gia' : 'Tuyển Sinh Lớp 10 Chuyên Tin',
      academicYear: year,
      title: `Đề Luyện Thi Chuyên & HSG Tin Học #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn tổng hợp chuẩn đề: ${school}`,
      timeMinutes: 180,
      featuredSnippet: q1.content.slice(0, 130) + '...',
      topics: ['# Z-Func & Manacher & Two Pointers', '# Bitmask TSP & CHT & Tree DP', '# MaxFlow & Tarjan & A*', '# Lazy SegTree & HLD & BIT & Trie'],
      difficulty: 'Chuyên / HSG',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}

export function buildCSStandardBatch4(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 100; i++) {
    const num = 76 + i;
    const school = ALL_THPT_SCHOOLS_BATCH_4[i % ALL_THPT_SCHOOLS_BATCH_4.length];
    const year = i % 2 === 0 ? '2025-2026' : '2024-2025';

    const limitN = 1000 + (i % 10) * 500;
    const kDiv = 2 + (i % 7);

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho số nguyên dương $N$ ($N \\le 10^{12}$).\na) Tính tổng các chữ số và chữ số lớn nhất của $N$.\nb) Kiểm tra xem $N$ có chia hết cho $${kDiv}$ hay không và in ra tất cả ước nguyên dương của tổng chữ số đó.`,
        solution: `Code Python mẫu:\n\`\`\`python\ns = input().strip()\ndigits = [int(c) for c in s]\ntotal = sum(digits)\nprint(total, max(digits))\nprint("YES" if int(s) % ${kDiv} == 0 else "NO")\ndivs = [d for d in range(1, total + 1) if total % d == 0]\nprint(*divs)\n\`\`\``,
        keyFormulasOrHints: ['Chuyển số sang xâu dễ duyệt từng chữ số', 'Tìm ước từ 1 đến total']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Nhập hai số nguyên $a, b$ ($a, b > 0$).\na) Dùng thuật toán Euclid tìm Ước chung lớn nhất $\\gcd(a, b)$.\nb) Tính Bội chung nhỏ nhất $\\text{lcm}(a, b)$ sao cho không bị tràn số trong C++ / Python.`,
        solution: `Code C++ mẫu:\n\`\`\`cpp\nlong long a, b; cin >> a >> b;\nlong long g = std::gcd(a, b);\nlong long lcm = (a / g) * b; // chia trước khi nhân tránh tràn!\ncout << g << " " << lcm << '\\n';\n\`\`\``,
        keyFormulasOrHints: ['Euclid gcd(a, b) = gcd(b, a % b)', 'lcm = (a / gcd) * b chia trước để tránh tràn 64-bit']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Nhập một số tự nhiên $N$ ($0 \\le N \\le 10^9$). Hãy viết hàm chuyển đổi $N$ sang hệ nhị phân (cơ số 2) và đếm số lượng bit \`1\` trong biểu diễn nhị phân đó.`,
        solution: `Code Python mẫu:\n\`\`\`python\nn = int(input())\nb = bin(n)[2:]\nprint(b, b.count('1'))\n\`\`\``,
        keyFormulasOrHints: ['Chia liên tiếp cho 2 lấy dư hoặc dùng bin(n)', 'Đếm số lượng bit 1']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho số nguyên dương $N$ ($1 \\le N \\le 10^9$). Hãy kiểm tra xem $N$ có phải là **số nguyên tố** hay không bằng vòng lặp tối ưu $\\mathcal{O}(\\sqrt{N})$.`,
        solution: `Code Python mẫu:\n\`\`\`python\ndef is_prime(n):\n    if n < 2: return False\n    d = 2\n    while d * d <= n:\n        if n % d == 0: return False\n        d += 1\n    return True\nprint("YES" if is_prime(int(input())) else "NO")\n\`\`\``,
        keyFormulasOrHints: ['Kiểm tra ước đến d * d <= n', 'Độ phức tạp O(sqrt(N))']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Viết chương trình tính gần đúng số $\\pi$ hoặc tổng $S = \\sum_{i=1}^{N} \\frac{1}{i(i+1)}$ với $N \\le ${limitN}$, làm tròn $4$ chữ số thập phân.`,
        solution: `Nhận xét $\\frac{1}{i(i+1)} = \\frac{1}{i} - \\frac{1}{i+1}$, nên tổng rút gọn chính xác thành $\\frac{N}{N + 1}$:\n\`\`\`python\nn = int(input())\nprint(f"{n / (n + 1):.4f}")\n\`\`\``,
        keyFormulasOrHints: ['Tách phân thức 1/(i(i+1)) = 1/i - 1/(i+1)', 'Độ phức tạp O(1) sau rút gọn']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho dãy $N \\le ${limitN}$ số nguyên. Hãy cài đặt thuật toán **Tìm kiếm nhị phân (Binary Search)** trên mảng đã sắp xếp để kiểm tra sự tồn tại của giá trị $X$ và tìm vị trí đầu tiên $\\ge X$.`,
        solution: `Code Python mẫu:\n\`\`\`python\nfrom bisect import bisect_left\nn, x = map(int, input().split())\na = sorted(map(int, input().split()))\npos = bisect_left(a, x)\nprint(pos + 1 if pos < n else -1)\n\`\`\``,
        keyFormulasOrHints: ['Binary Search chia đôi khoảng [lo, hi]', 'Độ phức tạp O(log N)'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Mô phỏng Tìm kiếm Nhị phân' }
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho mảng $A$ gồm $N \\le 10^5$ số nguyên và $Q$ truy vấn tính tổng đoạn $[L, R]$. Dùng **Mảng cộng dồn (Prefix Sum)** trả lời mỗi truy vấn trong $\\mathcal{O}(1)$.`,
        solution: `Code Python mẫu:\n\`\`\`python\npref = [0] * (n + 1)\nfor i in range(1, n + 1):\n    pref[i] = pref[i - 1] + a[i - 1]\n# Tổng [L, R] = pref[R] - pref[L - 1]\n\`\`\``,
        keyFormulasOrHints: ['pref[i] = pref[i - 1] + a[i - 1]', 'Truy vấn O(1)']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho mảng $N \\le ${limitN}$ số nguyên. Hãy tìm **giá trị lớn thứ nhì phân biệt** và đếm số lần xuất hiện của giá trị lớn nhất trong mảng chỉ với một lần duyệt $\\mathcal{O}(N)$.`,
        solution: `Code Python mẫu:\n\`\`\`python\na = list(map(int, input().split()))\nmx = max(a)\nsecond = max((x for x in a if x < mx), default=None)\nprint(mx, a.count(mx), second if second is not None else "NONE")\n\`\`\``,
        keyFormulasOrHints: ['Xử lý trường hợp mọi phần tử bằng nhau', 'Độ phức tạp O(N)']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cài đặt thuật toán **Sắp xếp chèn (Insertion Sort)** hoặc **Sắp xếp trộn (Merge Sort)** để sắp xếp một dãy số tăng dần và giải thích độ phức tạp thời gian của thuật toán đã chọn.`,
        solution: `Insertion Sort có độ phức tạp $\\mathcal{O}(N^2)$ (rất nhanh $\\mathcal{O}(N)$ khi mảng gần sắp xếp); Merge Sort luôn đảm bảo $\\mathcal{O}(N\\log N)$ nhờ chiến lược chia để trị.`,
        keyFormulasOrHints: ['Insertion Sort O(N^2)', 'Merge Sort chia để trị O(N log N)'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Mô phỏng Thuật toán Sắp xếp' }
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho dãy $N \\le ${limitN}$ số nguyên. Hãy loại bỏ các phần tử trùng lặp trong mảng mà vẫn giữ nguyên thứ tự xuất hiện ban đầu.`,
        solution: `Code Python mẫu $\\mathcal{O}(N)$:\n\`\`\`python\nseen, res = set(), []\nfor x in a:\n    if x not in seen:\n        seen.add(x)\n        res.append(x)\nprint(*res)\n\`\`\``,
        keyFormulasOrHints: ['Dùng set() kiểm tra tồn tại trong O(1)', 'Giữ nguyên thứ tự gốc']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Cho hai xâu $S_1, S_2$ gồm chữ cái thường. Kiểm tra xem hai xâu có phải là **đảo chữ (Anagram)** của nhau hay không.`,
        solution: `Dùng bảng đếm 26 ký tự \`Counter(s1) == Counter(s2)\` trong $\\mathcal{O}(|S_1| + |S_2|)$.`,
        keyFormulasOrHints: ['So sánh bảng tần suất ký tự', 'Độ phức tạp O(N)']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Cho ma trận vuông $N \\times N$ ($N \\le 100$). Tính tổng các phần tử trên **đường chéo chính**, **đường chéo phụ** và kiểm tra ma trận có đối xứng qua đường chéo chính hay không.`,
        solution: `Đường chéo chính: \`a[i][i]\`; đường chéo phụ: \`a[i][n-1-i]\`; ma trận đối xứng khi \`a[i][j] == a[j][i]\` với mọi $i, j$.`,
        keyFormulasOrHints: ['Đối xứng qua đường chéo chính: a[i][j] = a[j][i]', 'Đường chéo phụ: i + j = n - 1']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Nhập vào một câu văn bản bất kì. Chuẩn hóa xâu (xóa dấu cách thừa đầu/cuối và giữa các từ), viết hoa chữ cái đầu mỗi từ và đếm số lượng từ trong câu.`,
        solution: `Code Python mẫu:\n\`\`\`python\nwords = input().strip().split()\nprint(" ".join(w.capitalize() for w in words))\nprint(len(words))\n\`\`\``,
        keyFormulasOrHints: ['split() tự động bỏ khoảng trắng dư', 'capitalize() viết hoa chữ cái đầu']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Cho xâu ký tự $S$. Kiểm tra xem $S$ có phải **xâu đối xứng (Palindrome)** không và in ra ký tự xuất hiện nhiều lần nhất trong $S$.`,
        solution: `Code Python mẫu:\n\`\`\`python\nfrom collections import Counter\ns = input().strip()\nprint("YES" if s == s[::-1] else "NO")\nif s: print(Counter(s).most_common(1)[0][0])\n\`\`\``,
        keyFormulasOrHints: ['s == s[::-1] kiểm tra đối xứng', 'Counter(s).most_common(1)']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Cho bảng dữ liệu $R \\times C$ gồm điểm thi của $R$ học sinh ở $C$ môn. Tính điểm trung bình của từng học sinh và tìm môn học có điểm trung bình cao nhất.`,
        solution: `Duyệt theo từng hàng tính trung bình $\\frac{1}{C}\\sum_{j} a_{i,j}$ và duyệt theo cột tính trung bình $\\frac{1}{R}\\sum_{i} a_{i,j}$ để tìm cột lớn nhất.`,
        keyFormulasOrHints: ['Tổng theo hàng vs Tổng theo cột trên ma trận 2D']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Cho mảng $N \\le 10^5$ số nguyên và tổng mục tiêu $K$. Dùng **Từ điển / Hash Map** đếm số cặp chỉ số $i < j$ sao cho $A_i + A_j = K$ trong $\\mathcal{O}(N)$.`,
        solution: `Code Python mẫu:\n\`\`\`python\nfrom collections import defaultdict\ncnt = defaultdict(int)\nans = 0\nfor x in a:\n    ans += cnt[K - x]\n    cnt[x] += 1\nprint(ans)\n\`\`\``,
        keyFormulasOrHints: ['Dùng Hash Map / dict tra cứu O(1)', 'Cộng cnt[K - x] trước khi tăng cnt[x]']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Cho dãy dấu ngoặc gồm \`(), [], {}\`. Dùng cấu trúc **Ngăn xếp (Stack)** kiểm tra dãy ngoặc có cân bằng hợp lệ hay không.`,
        solution: `Đẩy ngoặc mở vào stack; khi gặp ngoặc đóng kiểm tra đỉnh stack có khớp cặp mở tương ứng không rồi \`pop()\`. Cuối cùng stack phải rỗng.`,
        keyFormulasOrHints: ['LIFO Stack khớp cặp đóng mở gần nhất', 'Cuối cùng kiểm tra stack rỗng'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Mô phỏng Ngăn xếp Stack 3D' }
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Viết chương trình đọc dữ liệu từ tệp \`DATA.INP\` (gồm $N$ số nguyên), lọc ra các số chia hết cho $${kDiv}$ và ghi theo thứ tự giảm dần ra tệp \`DATA.OUT\`.`,
        solution: `Code Python mẫu:\n\`\`\`python\nwith open("DATA.INP", "r") as f:\n    nums = [int(x) for x in f.read().split()]\nout = sorted([x for x in nums if x % ${kDiv} == 0], reverse=True)\nwith open("DATA.OUT", "w") as f:\n    f.write(" ".join(map(str, out)))\n\`\`\``,
        keyFormulasOrHints: ['Sử dụng with open() để tự động đóng tệp', 'sorted(..., reverse=True)']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Viết hàm đệ quy có nhớ (hoặc bảng quy hoạch động) tính số Fibonacci thứ $N$ ($0 \\le N \\le 90$) và chỉ ra tại sao đệ quy thuần túy $F(n-1)+F(n-2)$ bị quá thời gian (TLE).`,
        solution: `Đệ quy thuần túy tính lại nhánh trùng lặp tốn $\\mathcal{O}(\\varphi^N)$, còn dùng mảng nhớ hoặc vòng lặp dưới lên chỉ tốn $\\mathcal{O}(N)$ thời gian và xử lý được tới $N = 90$ với kiểu 64-bit.`,
        keyFormulasOrHints: ['Memoization khử trùng lặp nhánh đệ quy', 'Dùng kiểu 64-bit long long cho F(90)']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Cho đồ thị mê cung $R \\times C$ gồm ô đi được \`.\` và vật cản \`#\`. Dùng **BFS hàng đợi** tìm số bước ngắn nhất đi từ góc trên trái $(1, 1)$ đến góc dưới phải $(R, C)$.`,
        solution: `Khởi tạo \`dist[0][0] = 0\`, đẩy \`(0, 0)\` vào \`queue\`. Mỗi bước mở rộng 4 hướng kề chưa thăm thỏa ô là \`.\`. Kết quả là \`dist[R-1][C-1]\`.`,
        keyFormulasOrHints: ['BFS đảm bảo tìm đường ngắn nhất không trọng số', 'Mảng dist[][] vừa lưu khoảng cách vừa đánh dấu đã thăm'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'BFS Lưới 2D & 3D' }
      }
    ];

    const s1 = i % 5;
    const s2 = (i + Math.floor(i / 5)) % 5;
    const s3 = (i + 2 * Math.floor(i / 5)) % 5;
    const s4 = (i + 3 * Math.floor(i / 5)) % 5;

    const q1 = q1Pool[s1];
    const q2 = q2Pool[s2];
    const q3 = q3Pool[s3];
    const q4 = q4Pool[s4];

    exams.push({
      id: `cs-kc-${num}`,
      subject: 'cs',
      track: 'khong_chuyen',
      subjectTag: 'Tin Học Phổ Thông',
      categoryTag: i % 2 === 0 ? 'Thi THPT Chuẩn GDPT 2018' : 'Khảo Sát Lập Trình Cơ Bản',
      academicYear: year,
      title: `Đề Kiểm Tra Tin Học & Lập Trình #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn đề chuẩn THPT 2026: ${school}`,
      timeMinutes: 50,
      featuredSnippet: q1.content.slice(0, 130) + '...',
      topics: ['# Số học & Cơ số 2', '# Binary Search & Prefix Sum', '# Xâu & Ma trận 2D', '# Stack & File I/O & BFS'],
      difficulty: i % 3 === 0 ? 'Nâng cao' : i % 2 === 0 ? 'Khá' : 'Cơ bản',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}
