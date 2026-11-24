import { ExamPaper, ExamQuestion } from '../types';
import { CHUYEN_SCHOOLS_BATCH_3, THPT_INSTITUTIONS_BATCH_3 } from './extraExamsBatch3Math';
import { safeExamSnippet } from './examSnippetHelper';

export function buildCSChuyenBatch3(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 25; i++) {
    const num = 51 + i;
    const school = CHUYEN_SCHOOLS_BATCH_3[i];
    const limitN = 100000 + i * 25000;

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho $Q$ truy vấn ($Q \\le ${limitN}$), mỗi truy vấn cho một số nguyên dương $X \\le 10^6$. Hãy viết chương trình phân tích $X$ thành thừa số nguyên tố cho cả $Q$ truy vấn trong tổng thời gian $\\mathcal{O}(M\\log\\log M + Q\\log X)$ bằng cách tiền xử lý mảng **Ước nguyên tố nhỏ nhất (SPF — Smallest Prime Factor)**.`,
        solution: `Tiền xử lý mảng \`spf[i]\` bằng Sàng Eratosthenes: mọi số nguyên tố $p$ gán cho các bội chưa có ước nhỏ hơn. Khi truy vấn $X$, chia liên tiếp cho \`spf[X]\`:\n\`\`\`cpp\nconst int MAXV = 1000000;\nint spf[MAXV + 1];\nvoid sieve() {\n    for (int i = 2; i <= MAXV; ++i) spf[i] = i;\n    for (int i = 2; i * i <= MAXV; ++i)\n        if (spf[i] == i)\n            for (int j = i * i; j <= MAXV; j += i)\n                if (spf[j] == j) spf[j] = i;\n}\nvector<int> factorize(int x) {\n    vector<int> primes;\n    while (x > 1) { primes.push_back(spf[x]); x /= spf[x]; }\n    return primes;\n}\n\`\`\``,
        keyFormulasOrHints: ['SPF Sieve tiền xử lý O(M log log M)', 'Mỗi lần phân tích tối đa log2(X) bước'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Mô phỏng Sàng & Chia trị' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho hai xâu ký tự $T$ (văn bản, $|T| \\le 2\\cdot 10^5$) và $P$ (mẫu, $|P| \\le 2\\cdot 10^5$). Hãy trình bày thuật toán **Knuth-Morris-Pratt (KMP)** xây dựng hàm tiền tố $\\pi$ để tìm tất cả các vị trí xuất hiện của $P$ trong $T$ trong thời gian tuyến tính $\\mathcal{O}(|T| + |P|)$.`,
        solution: `Xây dựng mảng \`pi[i]\` là độ dài tiền tố thực sự dài nhất của $P[0..i]$ đồng thời là hậu tố của $P[0..i]$. Sau đó ghép xâu $S = P + \\text{"\\#"} + T$ hoặc đối khớp trực tiếp:\n\`\`\`cpp\nvector<int> prefix_function(const string& s) {\n    int n = (int)s.size();\n    vector<int> pi(n, 0);\n    for (int i = 1; i < n; ++i) {\n        int j = pi[i - 1];\n        while (j > 0 && s[i] != s[j]) j = pi[j - 1];\n        if (s[i] == s[j]) ++j;\n        pi[i] = j;\n    }\n    return pi;\n}\n\`\`\`\nMọi vị trí $i > |P|$ trong $S$ có \`pi[i] == P.size()\` ứng với một lần xuất hiện của $P$ trong $T$.`,
        keyFormulasOrHints: ['Hàm tiền tố pi[i] trong O(N)', 'Lùi về j = pi[j - 1] khi không khớp']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho dãy số nguyên dương $A$ gồm $N$ phần tử ($N \\le ${limitN}$) và số nguyên dương $S$. Tìm độ dài đoạn con liên tiếp ngắn nhất có tổng các phần tử $\\ge S$ (in $-1$ nếu không tồn tại) bằng kỹ thuật **Hai con trỏ (Two Pointers)** với độ phức tạp $\\mathcal{O}(N)$.`,
        solution: `Vì $A_i > 0$, tổng đoạn $[L, R]$ tăng đơn điệu khi mở rộng $R$ và giảm khi co $L$. Dùng cửa sổ trượt $[L, R]$:\n\`\`\`cpp\nint n; long long S;\nlong long sum = 0;\nint ans = n + 1, l = 0;\nfor (int r = 0; r < n; ++r) {\n    sum += A[r];\n    while (sum >= S) {\n        ans = min(ans, r - l + 1);\n        sum -= A[l++];\n    }\n}\ncout << (ans > n ? -1 : ans);\n\`\`\``,
        keyFormulasOrHints: ['Cửa sổ trượt Two Pointers O(N)', 'Điều kiện mảng dương đảm bảo tính đơn điệu']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho $Q$ truy vấn ($Q \\le 10^5$), mỗi truy vấn cho hai số nguyên $n, k$ ($0 \\le k \\le n \\le 10^6$). Hãy tính giá trị tổ hợp $\\binom{n}{k} \\bmod (10^9 + 7)$ trong $\\mathcal{O}(1)$ mỗi truy vấn sau bước tiền xử lý $\\mathcal{O}(N)$.`,
        solution: `Tiền xử lý mảng giai thừa \`fact[i]\` và nghịch đảo giai thừa \`invFact[i]\` theo Định lý Fermat nhỏ ($p = 10^9 + 7$ là số nguyên tố nên $a^{-1} \\equiv a^{p - 2} \\pmod p$):\n\`\`\`cpp\nconst long long MOD = 1e9 + 7;\nlong long fact[1000001], invFact[1000001];\nlong long nCr(int n, int k) {\n    if (k < 0 || k > n) return 0;\n    return fact[n] * invFact[k] % MOD * invFact[n - k] % MOD;\n}\n\`\`\`\nTính ngược \`invFact[MAXN] = fast_pow(fact[MAXN], MOD - 2)\`, rồi \`invFact[i - 1] = invFact[i] * i % MOD\` để chỉ mất một lần lũy thừa nhị phân.`,
        keyFormulasOrHints: ['Nghịch đảo modulo bằng Fermat nhỏ a^(MOD - 2)', 'Truy hồi invFact[i - 1] = invFact[i] * i % MOD']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho dãy $N$ số nguyên ($N \\le 40$) và số nguyên $S$. Đếm số lượng tập con của $A$ có tổng các phần tử đúng bằng $S$. Vì $2^{40}$ quá lớn, hãy thiết kế thuật toán **Chia đôi tập hợp (Meet-in-the-Middle)** có độ phức tạp $\\mathcal{O}(2^{N/2}\\cdot N)$.`,
        solution: `Chia mảng $A$ thành hai nửa $L$ ($N/2$ phần tử đầu) và $R$ ($N - N/2$ phần tử cuối).\n1. Sinh tất cả $2^{|L|}$ tổng tập con của $L$ lưu vào \`sumL\`; sinh tất cả $2^{|R|}$ tổng tập con của $R$ lưu vào \`sumR\`.\n2. Sắp xếp \`sumR\` tăng dần. Với mỗi tổng $x \\in \\text{sumL}$, dùng \`upper_bound - lower_bound\` trên \`sumR\` để đếm số lượng $y = S - x$ trong $\\mathcal{O}(\\log(2^{N/2}))$.\nTổng thời gian xấp xỉ $2^{20} \\cdot 20 \\approx 2\\cdot 10^7$ phép tính, chạy dưới 0.2s.`,
        keyFormulasOrHints: ['Chia mảng làm 2 nửa kích thước <= 20', 'Sắp xếp nửa phải + tìm kiếm nhị phân S - x']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Có $N$ đồ vật ($N \\le 1000$), vật $i$ có trọng lượng $w_i$ và giá trị $v_i$, cùng một chiếc ba lô sức chứa tối đa $W$ ($W \\le 10^4$).\na) Nếu mỗi vật chỉ được chọn tối đa $1$ lần (**0/1 Knapsack**), viết công thức Quy hoạch động tối ưu bộ nhớ $1$ chiều.\nb) Nếu mỗi vật có thể chọn **vô hạn lần** (**Unbounded Knapsack**), chỉ ra sự khác biệt duy nhất trong thứ tự vòng lặp $j$.`,
        solution: `a) Với **0/1 Knapsack**, phải duyệt dung lượng $j$ **giảm dần** từ $W$ về $w_i$ để tránh dùng lại cùng một vật nhiều lần trong một trạng thái:\n\`\`\`cpp\nvector<long long> dp(W + 1, 0);\nfor (int i = 0; i < N; ++i)\n    for (int j = W; j >= w[i]; --j)\n        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);\n\`\`\`\n\nb) Với **Unbounded Knapsack**, đổi vòng lặp $j$ thành **tăng dần** từ $w_i$ đến $W$:\n\`\`\`cpp\nfor (int i = 0; i < N; ++i)\n    for (int j = w[i]; j <= W; ++j)\n        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);\n\`\`\``,
        keyFormulasOrHints: ['0/1 Knapsack duyệt j từ W giảm về w[i]', 'Unbounded Knapsack duyệt j từ w[i] tăng đến W'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Trực quan Quy hoạch động' }
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho hai xâu $A, B$ độ dài không quá $2000$. Hãy tìm độ dài **Xâu con chung dài nhất (LCS)** của $A$ và $B$, đồng thời **truy vết** để in ra một xâu con chung dài nhất cụ thể.`,
        solution: `Gọi $dp[i][j]$ là độ dài LCS của tiền tố $A[1..i]$ và $B[1..j]$:\n- Nếu $A[i] == B[j]$: $dp[i][j] = dp[i - 1][j - 1] + 1$.\n- Ngược lại: $dp[i][j] = \\max(dp[i - 1][j], dp[i][j - 1])$.\nTruy vết ngược từ $(n, m)$ về $(0, 0)$:\n\`\`\`cpp\nstring res = "";\nint i = n, j = m;\nwhile (i > 0 && j > 0) {\n    if (A[i - 1] == B[j - 1]) { res += A[i - 1]; --i; --j; }\n    else if (dp[i - 1][j] >= dp[i][j - 1]) --i;\n    else --j;\n}\nreverse(res.begin(), res.end());\n\`\`\``,
        keyFormulasOrHints: ['dp[i][j] = dp[i-1][j-1] + 1 khi A[i] == B[j]', 'Truy vết ngược rồi đảo xâu kết quả']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Có $N$ đống sỏi xếp thành hàng ($N \\le 400$), đống thứ $i$ có $a_i$ viên sỏi. Mỗi bước chỉ được ghép **hai đống kề nhau** thành một đống mới với chi phí bằng tổng số sỏi của hai đống đó. Hãy dùng **Quy hoạch động khoảng (Interval DP)** tìm tổng chi phí nhỏ nhất để gom toàn bộ thành 1 đống.`,
        solution: `Gọi $dp[l][r]$ là chi phí nhỏ nhất để gộp các đống từ $l$ đến $r$ thành 1 đống; $S(l, r) = pref[r] - pref[l - 1]$ là tổng số sỏi đoạn $[l, r]$.\nĐể gộp $[l, r]$, lần gộp cuối cùng gộp $[l, k]$ và $[k + 1, r]$ với mọi $l \\le k < r$:\n$$dp[l][r] = \\min_{l \\le k < r}\\big(dp[l][k] + dp[k + 1][r]\\big) + S(l, r).$$\nDuyệt theo độ dài đoạn $len$ tăng dần từ $2$ đến $N$. Độ phức tạp $\\mathcal{O}(N^3)$.`,
        keyFormulasOrHints: ['Interval DP duyệt theo độ dài đoạn len = 2..N', 'dp[l][r] = min(dp[l][k] + dp[k+1][r]) + sum(l, r)']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho đồ thị có hướng đầy đủ $N$ thành phố ($N \\le 18$) với ma trận chi phí đi lại $C[u][v]$. Xuất phát từ thành phố $0$, hãy tìm chi phí nhỏ nhất để đi qua tất cả các thành phố mỗi nơi đúng 1 lần (**Bài toán Người du lịch TSP**) bằng **Quy hoạch động Bitmask** trong $\\mathcal{O}(N^2 2^N)$.`,
        solution: `Dùng số nguyên \`mask\` $N$ bit biểu diễn tập các thành phố đã đi qua, và $dp[mask][u]$ là chi phí nhỏ nhất kết thúc tại $u$:\n\`\`\`cpp\nconst long long INF = 1e15;\nvector<vector<long long>> dp(1 << N, vector<long long>(N, INF));\ndp[1][0] = 0;\nfor (int mask = 1; mask < (1 << N); ++mask) {\n    for (int u = 0; u < N; ++u) {\n        if (!(mask & (1 << u)) || dp[mask][u] == INF) continue;\n        for (int v = 0; v < N; ++v) {\n            if (mask & (1 << v)) continue;\n            int nmask = mask | (1 << v);\n            dp[nmask][v] = min(dp[nmask][v], dp[mask][u] + C[u][v]);\n        }\n    }\n}\n\`\`\``,
        keyFormulasOrHints: ['Trạng thái dp[mask][u] với mask 0..2^N-1', 'mask | (1 << v) đánh dấu đã thăm v']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho một cây có $N$ đỉnh ($N \\le 10^5$), mỗi đỉnh $u$ có trọng số $w_u$. Hãy trình bày **Quy hoạch động trên cây (Tree DP)** tìm **Tập độc lập (Independent Set)** có tổng trọng số lớn nhất sao cho không có hai đỉnh kề nhau nào cùng được chọn.`,
        solution: `Với mỗi đỉnh $u$, định nghĩa $dp[u][0]$ là tổng lớn nhất trong cây con gốc $u$ nếu **không chọn** $u$, và $dp[u][1]$ nếu **chọn** $u$:\n- Nếu chọn $u$, các con $v$ bắt buộc không được chọn: $dp[u][1] = w_u + \\sum_{v} dp[v][0]$.\n- Nếu không chọn $u$, các con $v$ tự do chọn hoặc không: $dp[u][0] = \\sum_{v} \\max(dp[v][0], dp[v][1])$.\nThực hiện DFS 1 lần từ gốc $1$, đáp án là $\\max(dp[1][0], dp[1][1])$ trong $\\mathcal{O}(N)$.`,
        keyFormulasOrHints: ['Tree DP hai trạng thái dp[u][0] và dp[u][1]', 'Chọn cha thì không chọn con']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho đồ thị có hướng $N$ đỉnh, $M$ cạnh có trọng số dương ($N, M \\le 10^5$). Cài đặt thuật toán **Dijkstra** bằng \`priority_queue\` để không chỉ tìm độ dài đường đi ngắn nhất từ $1$ đến $N$, mà còn **đếm số lượng đường đi ngắn nhất** (chia lấy dư cho $10^9 + 7$).`,
        solution: `Duy trì song song hai mảng \`dist[u]\` và \`ways[u]\` (khởi tạo \`dist[1] = 0, ways[1] = 1\`):\nKhi xét cạnh $(u, v, w)$:\n- Nếu \`dist[u] + w < dist[v]\`: cập nhật \`dist[v] = dist[u] + w\`, \`ways[v] = ways[u]\`, rồi đẩy vào heap.\n- Nếu \`dist[u] + w == dist[v]\`: cộng dồn \`ways[v] = (ways[v] + ways[u]) % MOD\` (không cần đẩy lại vào heap).\nĐộ phức tạp $\\mathcal{O}((N + M)\\log N)$.`,
        keyFormulasOrHints: ['So sánh cả trường hợp < và == trong Dijkstra', 'ways[v] += ways[u] khi bằng nhau'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Mô phỏng Thuật toán Đồ thị' }
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho đồ thị có hướng gồm $N$ đỉnh, $M$ cạnh ($N, M \\le 10^5$) mô tả $M$ điều kiện tiên quyết giữa $N$ môn học. Hãy dùng thuật toán **Kahn (BFS theo bậc vào)** để kiểm tra đồ thị có là DAG (không chu trình) hay không và in ra một **thứ tự sắp xếp Topo** hợp lệ.`,
        solution: `Tính bậc vào \`indeg[v]\` cho mọi đỉnh. Đẩy tất cả đỉnh có \`indeg[v] == 0\` vào \`queue\`. Lần lượt lấy $u$ khỏi queue, thêm vào \`topo\`, với mỗi cạnh $u \\to v$ giảm \`indeg[v]\` đi $1$; nếu \`indeg[v] == 0\` thì đẩy $v$ vào queue.\nCuối cùng nếu \`topo.size() < N\` thì đồ thị **có chu trình** (vô nghiệm), ngược lại \`topo\` là thứ tự hợp lệ trong $\\mathcal{O}(N + M)$.`,
        keyFormulasOrHints: ['Thuật toán Kahn dùng hàng đợi + bậc vào indeg', 'Nếu số đỉnh thăm < N => có chu trình']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho đồ thị vô hướng gồm $N$ đỉnh, $M$ cạnh ($N, M \\le 10^5$). Hãy trình bày thuật toán **Tarjan** sử dụng hai mảng \`tin[u]\` (thời điểm thăm) và \`low[u]\` (thời điểm sớm nhất quay ngược được) để đếm số lượng **Cầu (Bridge)** và **Khớp (Articulation Point)** trên đồ thị.`,
        solution: `Trong cây DFS:\n- Cạnh $(u, v)$ (với $v$ là con trực tiếp của $u$) là **cầu** khi và chỉ khi \`low[v] > tin[u]\`.\n- Đỉnh $u$ là **khớp** nếu:\n  + $u$ là gốc cây DFS và có ít nhất $2$ con trực tiếp riêng biệt; HOẶC\n  + $u$ không phải gốc và tồn tại con trực tiếp $v$ thỏa mãn \`low[v] >= tin[u]\`.\nĐộ phức tạp một lượt DFS là $\\mathcal{O}(N + M)$.`,
        keyFormulasOrHints: ['Cầu: low[v] > tin[u]', 'Khớp: low[v] >= tin[u] (hoặc gốc >= 2 con)']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho lưới ô vuông kích thước $R \\times C$ ($R, C \\le 1000$) gồm các ô trống \`.\`, ô tường \`#\` và nhiều ngọn lửa \`F\` bùng phát đồng thời. Hãy trình bày thuật toán **BFS đa nguồn (Multi-source BFS)** tính thời gian ngắn nhất để lửa lan tới từng ô trống trên lưới.`,
        solution: `Khởi tạo mảng \`fireTime[r][c] = INF\` với mọi ô. Đưa **tất cả** các ô \`F\` vào hàng đợi \`queue\` ngay từ bước đầu với \`fireTime = 0\`.\nThực hiện BFS chuẩn 4 hướng: mỗi lần thăm ô kề chưa bị tường chắn có \`fireTime == INF\`, gán \`fireTime[nr][nc] = fireTime[r][c] + 1\` và đẩy vào queue.\nVì tất cả nguồn lửa xuất phát cùng mức $0$ trong BFS, giá trị đạt được ở mỗi ô đảm bảo là nhỏ nhất từ ngọn lửa gần nhất trong $\\mathcal{O}(RC)$.`,
        keyFormulasOrHints: ['Đưa toàn bộ nguồn xuất phát vào queue cùng lúc ở mức 0', 'Độ phức tạp O(R * C)']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho đồ thị có hướng có trọng số gồm $N$ đỉnh ($N \\le 400$), $M$ cạnh và $Q$ truy vấn tìm đường đi ngắn nhất từ $u$ tới $v$. Hãy trình bày thuật toán **Floyd-Warshall** và giải thích vì sao vòng lặp đỉnh trung gian $k$ **bắt buộc phải đặt ở ngoài cùng**.`,
        solution: `Cài đặt Floyd-Warshall $\\mathcal{O}(N^3)$:\n\`\`\`cpp\nfor (int k = 1; k <= N; ++k)\n    for (int i = 1; i <= N; ++i)\n        for (int j = 1; j <= N; ++j)\n            if (d[i][k] < INF && d[k][j] < INF)\n                d[i][j] = min(d[i][j], d[i][k] + d[k][j]);\n\`\`\`\n**Lý do**: \`d[i][j]\` ở bước $k$ mang nghĩa đường đi ngắn nhất từ $i$ đến $j$ chỉ được phép đi qua các đỉnh trung gian thuộc tập $\\{1, 2, \\dots, k\\}$. Nếu đặt $k$ ở trong cùng thì các đường đi trung gian chưa được tối ưu đầy đủ ở pha trước sẽ bị bỏ sót.`,
        keyFormulasOrHints: ['Vòng lặp k ở ngoài cùng đảm bảo quy hoạch động theo tập đỉnh trung gian', 'Độ phức tạp O(N^3) bộ nhớ O(N^2)']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho hoán vị hoặc mảng $N$ số nguyên ($N \\le 2\\cdot 10^5, |A_i| \\le 10^9$). Một cặp $(i, j)$ được gọi là **cặp nghịch thế (Inversion)** nếu $i < j$ và $A_i > A_j$. Hãy cài đặt cấu trúc **Fenwick Tree (BIT)** kết hợp nén số (Coordinate Compression) để đếm tổng số cặp nghịch thế trong $\\mathcal{O}(N\\log N)$.`,
        solution: `1. Nén giá trị các phần tử $A_i$ về miền $[1..N]$.\n2. Duyệt $i$ từ cuối mảng về đầu (hoặc từ đầu về cuối dùng \`query(N) - query(rank(A[i]))\`):\n\`\`\`cpp\nlong long inversions = 0;\nfor (int i = n - 1; i >= 0; --i) {\n    inversions += bit.query(rk[i] - 1);\n    bit.add(rk[i], 1);\n}\n\`\`\`\nMỗi thao tác Fenwick mất $\\mathcal{O}(\\log N)$, tổng thời gian $\\mathcal{O}(N\\log N)$.`,
        keyFormulasOrHints: ['Nén tọa độ bằng sort + unique + lower_bound', 'Fenwick Tree cập nhật và truy vấn tổng tiền tố O(log N)']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho $N$ từ điển ($N \\le 10^5$) và $Q$ truy vấn, mỗi truy vấn cho một xâu tiền tố $P$, yêu cầu đếm xem có bao nhiêu từ trong từ điển bắt đầu bằng tiền tố $P$. Hãy cài đặt **Cây tiền tố (Trie)** để xử lý mỗi từ và truy vấn trong $\\mathcal{O}(|S|)$.`,
        solution: `Mỗi nút của Trie lưu con trỏ \`child[26]\` và biến \`cntPrefix\` đếm số từ đi qua nút đó:\n\`\`\`cpp\nstruct Node { int nxt[26] = {}, cnt = 0; };\nvoid insert(const string& s) {\n    int u = 0;\n    for (char c : s) {\n        int id = c - 'a';\n        if (!trie[u].nxt[id]) { trie[u].nxt[id] = trie.size(); trie.emplace_back(); }\n        u = trie[u].nxt[id];\n        trie[u].cnt++;\n    }\n}\nint query(const string& p) {\n    int u = 0;\n    for (char c : p) { u = trie[u].nxt[c - 'a']; if (!u) return 0; }\n    return trie[u].cnt;\n}\n\`\`\``,
        keyFormulasOrHints: ['Trie lưu cnt số xâu đi qua mỗi nút', 'Truy vấn độc lập với số lượng từ N']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho mảng tĩnh $A$ gồm $N$ phần tử ($N \\le 10^5$) và $Q$ truy vấn ($Q \\le 10^6$), mỗi truy vấn yêu cầu tìm giá trị nhỏ nhất $\\min_{L \\le i \\le R} A[i]$ (RMQ). Hãy cài đặt **Bảng thưa (Sparse Table)** để trả lời mỗi truy vấn trong đúng $\\mathcal{O}(1)$ sau tiền xử lý $\\mathcal{O}(N\\log N)$.`,
        solution: `Đặt \`st[k][i]\` là giá trị nhỏ nhất đoạn dài $2^k$ bắt đầu từ $i$:\n- Khởi tạo \`st[0][i] = A[i]\`, công thức \`st[k][i] = min(st[k-1][i], st[k-1][i + (1 << (k-1))])\`.\n- Với truy vấn $[L, R]$, đặt $k = \\lfloor \\log_2(R - L + 1) \\rfloor$. Vì phép \`min\` có tính lũy đẳng (hai đoạn giao nhau vẫn không làm sai giá trị min):\n$$\\text{ans} = \\min\\big(st[k][L],\\; st[k][R - (1 \\ll k) + 1]\\big).$$`,
        keyFormulasOrHints: ['Tính lũy đẳng của phép min cho phép 2 đoạn giao nhau', 'Truy vấn RMQ trong O(1)']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Có $N$ sợi dây ($N \\le 10^5$) với độ dài $L_1, L_2, \\dots, L_N$. Chi phí nối hai sợi dây có độ dài $x$ và $y$ là $x + y$ (tạo thành sợi dây mới dài $x + y$). Hãy dùng thuật toán Tham lam kết hợp **Hàng đợi ưu tiên (Min-Heap)** tìm tổng chi phí nhỏ nhất để nối tất cả thành $1$ sợi duy nhất.`,
        solution: `Theo nguyên lý mã hóa Huffman, ở mỗi bước ta luôn nối **hai sợi dây ngắn nhất hiện có** để tổng chi phí phát sinh ít lặp lại ở các tầng trên:\n\`\`\`cpp\npriority_queue<long long, vector<long long>, greater<long long>> pq;\nfor (long long x : L) pq.push(x);\nlong long cost = 0;\nwhile (pq.size() > 1) {\n    long long a = pq.top(); pq.pop();\n    long long b = pq.top(); pq.pop();\n    cost += a + b;\n    pq.push(a + b);\n}\n\`\`\`\nĐộ phức tạp $\\mathcal{O}(N\\log N)$.`,
        keyFormulasOrHints: ['Min-Heap priority_queue với greater<long long>', 'Chiến lược tham lam nối 2 dây ngắn nhất']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Dãy Tribonacci định nghĩa $T_0 = 0, T_1 = 1, T_2 = 1$ và $T_n = T_{n-1} + T_{n-2} + T_{n-3}$ ($n \\ge 3$). Cho $N \\le 10^{18}$, hãy trình bày thuật toán **Nhân ma trận kết hợp Lũy thừa nhị phân** tính $T_N \\bmod (10^9 + 7)$ trong $\\mathcal{O}(\\log N)$.`,
        solution: `Viết hệ thức truy hồi dưới dạng nhân ma trận $3 \\times 3$:\n$$\\begin{pmatrix} T_n \\\\ T_{n-1} \\\\ T_{n-2} \\end{pmatrix} = \\begin{pmatrix} 1 & 1 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \\end{pmatrix}^{n - 2} \\begin{pmatrix} T_2 \\\\ T_1 \\\\ T_0 \\end{pmatrix}.$$\nTính lũy thừa bậc $n - 2$ của ma trận chuyển $M$ bằng thuật toán bình phương và nhân (Binary Exponentiation) trong $\\mathcal{O}(3^3 \\log N)$ thao tác modulo $10^9 + 7$.`,
        keyFormulasOrHints: ['Ma trận chuyển kích thước 3x3', 'Lũy thừa ma trận nhị phân chạy với N = 10^18']
      }
    ];

    const q1 = q1Pool[i % q1Pool.length];
    const q2 = q2Pool[(i + 1) % q2Pool.length];
    const q3 = q3Pool[(i + 2) % q3Pool.length];
    const q4 = q4Pool[(i + 3) % q4Pool.length];

    exams.push({
      id: `cs-chuyen-${num}`,
      subject: 'cs',
      track: 'chuyen',
      subjectTag: 'Tin Học Chuyên',
      categoryTag: i % 2 === 0 ? 'Chuyên Tin & HSG Quốc Gia' : 'VNOI & Olympic Tin Học',
      academicYear: '2025-2026',
      title: `Đề Chọn Đội Tuyển & Chuyên Tin Học #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn tổng hợp chuẩn đề: ${school}`,
      timeMinutes: 180,
      featuredSnippet: safeExamSnippet(q1.content, 130),
      topics: ['# SPF & KMP & Two Pointers', '# DP Knapsack & Bitmask', '# Dijkstra & Tarjan & Topo', '# BIT & Trie & Ma trận'],
      difficulty: 'Chuyên / HSG',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}

export function buildCSStandardBatch3(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 25; i++) {
    const num = 51 + i;
    const school = THPT_INSTITUTIONS_BATCH_3[i];
    const limitN = 1000 + i * 200;

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho số nguyên dương $N$ ($N \\le 10^9$).\na) Tính tổng các chữ số của $N$.\nb) Kiểm tra xem $N$ có phải là **số đối xứng (Palindrome)** hay không (ví dụ $12321$ là đối xứng, $123$ không đối xứng).`,
        solution: `Code Python mẫu:\n\`\`\`python\ns = input().strip()\ndigit_sum = sum(int(ch) for ch in s)\nprint(digit_sum)\nprint("YES" if s == s[::-1] else "NO")\n\`\`\``,
        keyFormulasOrHints: ['Xử lý trực tiếp trên chuỗi ký tự hoặc chia lấy dư % 10', 's[::-1] đảo ngược chuỗi']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Nhập vào tử số $a$ và mẫu số $b$ ($b \\neq 0$) của một phân số. Hãy sử dụng thuật toán **Euclid tìm Ước chung lớn nhất (UCLN)** để rút gọn phân số $\\frac{a}{b}$ về dạng tối giản (mẫu số dương).`,
        solution: `Code Python & C++ mẫu:\n\`\`\`python\nimport math\na, b = map(int, input().split())\ng = math.gcd(abs(a), abs(b))\na //= g\nb //= g\nif b < 0:\n    a, b = -a, -b\nprint(f"{a}/{b}")\n\`\`\``,
        keyFormulasOrHints: ['Thuật toán Euclid gcd(a, b) = gcd(b, a % b)', 'Đưa dấu âm lên tử nếu b < 0']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Nhập vào ba số thực dương $a, b, c$. Kiểm tra xem $a, b, c$ có thể là độ dài $3$ cạnh của một tam giác hay không; nếu có, hãy tính **chu vi** và **diện tích** tam giác đó theo công thức Heron.`,
        solution: `Code Python mẫu:\n\`\`\`python\nimport math\na, b, c = map(float, input().split())\nif a + b > c and a + c > b and b + c > a:\n    p = (a + b + c) / 2\n    area = math.sqrt(p * (p - a) * (p - b) * (p - c))\n    print(f"Chu vi: {2*p:.2f}, Dien tich: {area:.2f}")\nelse:\n    print("Khong tao thanh tam giac")\n\`\`\``,
        keyFormulasOrHints: ['Bất đẳng thức tam giác a + b > c', 'Công thức Heron sqrt(p(p-a)(p-b)(p-c))']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Viết chương trình nhập vào một số tự nhiên $N$ ($0 \\le N \\le 10^9$) ở hệ thập phân và chuyển đổi nó sang biểu diễn ở **hệ nhị phân (cơ số 2)** bằng vòng lặp chia lấy dư cho $2$.`,
        solution: `Code Python mẫu:\n\`\`\`python\nn = int(input())\nif n == 0:\n    print("0")\nelse:\n    bits = []\n    while n > 0:\n        bits.append(str(n % 2))\n        n //= 2\n    print("".join(reversed(bits)))\n\`\`\``,
        keyFormulasOrHints: ['Chia liên tiếp cho 2 lấy phần dư', 'Đọc kết quả dư theo chiều ngược lại']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho dãy số nguyên $A$ gồm $N$ phần tử ($N \\le ${limitN}$).\na) Đếm số lượng các số nguyên tố có mặt trong dãy $A$.\nb) Tạo một danh sách mới chỉ giữ lại lần xuất hiện đầu tiên của mỗi giá trị (loại bỏ các phần tử trùng lặp nhưng giữ nguyên thứ tự ban đầu).`,
        solution: `Code Python mẫu:\n\`\`\`python\ndef is_prime(x):\n    if x < 2: return False\n    for d in range(2, int(x ** 0.5) + 1):\n        if x % d == 0: return False\n    return True\n\nn = int(input())\na = list(map(int, input().split()))\nprint(sum(1 for x in a if is_prime(x)))\nseen, unique_a = set(), []\nfor x in a:\n    if x not in seen:\n        seen.add(x)\n        unique_a.append(x)\nprint(*unique_a)\n\`\`\``,
        keyFormulasOrHints: ['Dùng set kiểm tra xuất hiện lần đầu O(1)', 'Hàm kiểm tra số nguyên tố O(sqrt(x))']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho mảng $A$ gồm $N$ phần tử ($N \\le 10^5$) và $Q$ truy vấn ($Q \\le 10^5$), mỗi truy vấn cho cặp chỉ số $(L, R)$ ($1 \\le L \\le R \\le N$). Hãy dùng kỹ thuật **Mảng cộng dồn 1 chiều (Prefix Sum)** để tính nhanh tổng $\\sum_{i=L}^R A_i$ cho mỗi truy vấn.`,
        solution: `Code Python mẫu:\n\`\`\`python\nn, q = map(int, input().split())\na = list(map(int, input().split()))\npref = [0] * (n + 1)\nfor i in range(1, n + 1):\n    pref[i] = pref[i - 1] + a[i - 1]\nfor _ in range(q):\n    l, r = map(int, input().split())\n    print(pref[r] - pref[l - 1])\n\`\`\``,
        keyFormulasOrHints: ['pref[i] = pref[i - 1] + a[i - 1]', 'Tổng đoạn [L, R] = pref[R] - pref[L - 1] trong O(1)']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho dãy số nguyên $A$ gồm $N$ phần tử ($N \\le ${limitN}$). Hãy tìm **giá trị lớn thứ nhì (phân biệt với giá trị lớn nhất)** trong mảng chỉ bằng đúng một vòng lặp $\\mathcal{O}(N)$ mà không dùng sắp xếp (nếu mảng không có hai giá trị khác nhau thì in \`NONE\`).`,
        solution: `Code Python mẫu:\n\`\`\`python\nn = int(input())\na = list(map(int, input().split()))\nfirst = second = None\nfor x in a:\n    if first is None or x > first:\n        if first != x:\n            second = first\n        first = x\n    elif x < first and (second is None or x > second):\n        second = x\nprint(second if second is not None else "NONE")\n\`\`\``,
        keyFormulasOrHints: ['Duy trì hai biến first và second trong 1 lượt duyệt', 'Cẩn thận trường hợp nhiều giá trị lớn nhất trùng nhau']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cài đặt thuật toán **Sắp xếp chọn (Selection Sort)** hoặc **Sắp xếp nổi bọt (Bubble Sort)** để sắp xếp một mảng gồm $N$ phần tử tăng dần và đếm số lần thực hiện phép hoán đổi vị trí (\`swap\`).`,
        solution: `Code Python mẫu (Selection Sort):\n\`\`\`python\nn = int(input())\na = list(map(int, input().split()))\nswaps = 0\nfor i in range(n - 1):\n    min_idx = i\n    for j in range(i + 1, n):\n        if a[j] < a[min_idx]:\n            min_idx = j\n    if min_idx != i:\n        a[i], a[min_idx] = a[min_idx], a[i]\n        swaps += 1\nprint(*a)\nprint("So lan hoan doi:", swaps)\n\`\`\``,
        keyFormulasOrHints: ['Selection Sort chọn phần tử nhỏ nhất đoạn còn lại', 'Độ phức tạp O(N^2)'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Mô phỏng Thuật toán Sắp xếp' }
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Cho ma trận vuông $A$ kích thước $N \\times N$ ($N \\le 100$) gồm các số nguyên.\na) Tính tổng các phần tử trên **đường chéo chính** và **đường chéo phụ**.\nb) Tìm giá trị lớn nhất trên từng hàng của ma trận.`,
        solution: `Code Python mẫu:\n\`\`\`python\nn = int(input())\nmat = [list(map(int, input().split())) for _ in range(n)]\nmain_diag = sum(mat[i][i] for i in range(n))\nanti_diag = sum(mat[i][n - 1 - i] for i in range(n))\nprint(main_diag, anti_diag)\nfor row in mat:\n    print(max(row), end=" ")\n\`\`\``,
        keyFormulasOrHints: ['Đường chéo chính i == j', 'Đường chéo phụ i + j == N - 1']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Viết chương trình nhập vào hai xâu ký tự $S_1$ và $S_2$ chỉ gồm các chữ cái tiếng Anh thường. Hãy kiểm tra xem $S_1$ và $S_2$ có phải là **đảo chữ (Anagram)** của nhau hay không (tức là có cùng tập hợp ký tự và số lần xuất hiện từng ký tự).`,
        solution: `Code Python mẫu $\\mathcal{O}(N)$ dùng đếm tần suất:\n\`\`\`python\nfrom collections import Counter\ns1 = input().strip()\ns2 = input().strip()\nprint("YES" if Counter(s1) == Counter(s2) else "NO")\n\`\`\``,
        keyFormulasOrHints: ['So sánh bảng tần suất 26 chữ cái hoặc Counter', 'Tránh sắp xếp nếu muốn đạt O(N)']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Nhập vào một câu văn gồm nhiều từ cách nhau bởi khoảng trắng. Hãy tách các từ trong câu, loại bỏ các từ trùng lặp (phân biệt chữ hoa/thường) và in ra danh sách các từ đã được **sắp xếp theo thứ tự từ điển tăng dần**.`,
        solution: `Code Python mẫu:\n\`\`\`python\ns = input().strip()\nwords = sorted(set(s.split()))\nprint("\\n".join(words))\n\`\`\``,
        keyFormulasOrHints: ['s.split() tách từ bỏ dấu cách thừa', 'sorted(set(...)) lọc trùng và sắp xếp từ điển']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Nhập vào một xâu $S$ bất kỳ (có thể chứa chữ hoa, chữ thường, chữ số và ký tự đặc biệt). Hãy thống kê và in ra số lượng: chữ cái, chữ số, và ký tự đặc biệt xuất hiện trong $S$; đồng thời in ra chữ cái xuất hiện nhiều nhất.`,
        solution: `Code Python mẫu:\n\`\`\`python\nfrom collections import Counter\ns = input()\nletters = [c.lower() for c in s if c.isalpha()]\ndigits = sum(1 for c in s if c.isdigit())\nspecial = len(s) - len(letters) - digits\nprint(f"Chu cai: {len(letters)}, Chu so: {digits}, Dac biet: {special}")\nif letters:\n    ch, freq = Counter(letters).most_common(1)[0]\n    print(f"Chu cai nhieu nhat: {ch} ({freq} lan)")\n\`\`\``,
        keyFormulasOrHints: ['isalpha(), isdigit() phân loại ký tự', 'Counter().most_common(1)']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Cho mảng gồm $N$ số nguyên ($N \\le 10^5$) và một giá trị nguyên $K$. Hãy viết chương trình sử dụng **Từ điển / Hash Map** để đếm số lượng cặp chỉ số $(i, j)$ ($0 \\le i < j < N$) sao cho $A_i + A_j = K$ trong thời gian $\\mathcal{O}(N)$.`,
        solution: `Code Python mẫu $\\mathcal{O}(N)$:\n\`\`\`python\nfrom collections import defaultdict\nn, k = map(int, input().split())\na = list(map(int, input().split()))\ncnt = defaultdict(int)\nans = 0\nfor x in a:\n    ans += cnt[k - x]\n    cnt[x] += 1\nprint(ans)\n\`\`\``,
        keyFormulasOrHints: ['Cộng dồn cnt[k - x] trước khi cập nhật cnt[x] += 1', 'Độ phức tạp O(N)']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Cho một xâu chỉ chứa các ký tự ngoặc \`(\`, \`)\`, \`[\`, \`]\`, \`{\`, \`}\`. Hãy dùng cấu trúc **Ngăn xếp (Stack)** để kiểm tra xem dãy ngoặc có hợp lệ (cân bằng đúng cặp đóng mở) hay không.`,
        solution: `Code Python mẫu $\\mathcal{O}(N)$:\n\`\`\`python\ns = input().strip()\nmatch = {')': '(', ']': '[', '}': '{'}\nst = []\nok = True\nfor ch in s:\n    if ch in '([{':\n        st.append(ch)\n    elif ch in match:\n        if not st or st[-1] != match[ch]:\n            ok = False\n            break\n        st.pop()\nprint("VALID" if ok and not st else "INVALID")\n\`\`\``,
        keyFormulasOrHints: ['Gặp ngoặc mở đẩy vào stack; gặp ngoặc đóng khớp đỉnh stack', 'Cuối cùng stack phải rỗng']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Viết chương trình đọc dữ liệu điểm thi của học sinh từ tệp văn bản \`INPUT.TXT\` (dòng đầu là $N$, $N$ dòng tiếp theo mỗi dòng gồm \`Tên Điểm\`) và ghi ra tệp \`OUTPUT.TXT\` danh sách các học sinh đạt điểm $\\ge 8.0$ theo thứ tự điểm giảm dần.`,
        solution: `Code Python mẫu thao tác tệp chuẩn:\n\`\`\`python\nwith open("INPUT.TXT", "r", encoding="utf-8") as fin:\n    lines = [line.strip() for line in fin if line.strip()]\nn = int(lines[0])\nstudents = []\nfor line in lines[1:n+1]:\n    name, score = line.rsplit(maxsplit=1)\n    score = float(score)\n    if score >= 8.0:\n        students.append((name, score))\nstudents.sort(key=lambda x: -x[1])\nwith open("OUTPUT.TXT", "w", encoding="utf-8") as fout:\n    for name, score in students:\n        fout.write(f"{name} {score:.1f}\\n")\n\`\`\``,
        keyFormulasOrHints: ['Dùng with open() đảm bảo đóng file an toàn', 'rsplit(maxsplit=1) tách tên có dấu cách và điểm']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Viết hàm đệ quy có nhớ (Memoization) hoặc quy hoạch động cơ bản để tính hệ số nhị thức tổ hợp $C(n, k) = \\binom{n}{k}$ theo công thức Pascal ($C(n, k) = C(n - 1, k - 1) + C(n - 1, k)$, $0 \\le k \\le n \\le 50$).`,
        solution: `Code Python dùng bảng nhớ (hoặc \`@lru_cache\`):\n\`\`\`python\nfrom functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef C(n, k):\n    if k == 0 or k == n:\n        return 1\n    return C(n - 1, k - 1) + C(n - 1, k)\n\nn, k = map(int, input().split())\nprint(C(n, k))\n\`\`\``,
        keyFormulasOrHints: ['Công thức tam giác Pascal', 'Dùng memoization tránh tính trùng nhánh đệ quy']
      }
    ];

    const q1 = q1Pool[i % q1Pool.length];
    const q2 = q2Pool[(i + 1) % q2Pool.length];
    const q3 = q3Pool[(i + 2) % q3Pool.length];
    const q4 = q4Pool[(i + 3) % q4Pool.length];

    exams.push({
      id: `cs-kc-${num}`,
      subject: 'cs',
      track: 'khong_chuyen',
      subjectTag: 'Tin Học Phổ Thông',
      categoryTag: i % 2 === 0 ? 'Thi THPT Chuẩn GDPT 2018' : 'Khảo Sát Lập Trình Cơ Bản',
      academicYear: '2025-2026',
      title: `Đề Kiểm Tra Lập Trình & Tin Học Phổ Thông #${num} – ${school}`,
      school,
      source: `Nguồn đề chuẩn THPT 2026: ${school}`,
      timeMinutes: 50,
      featuredSnippet: safeExamSnippet(q1.content, 130),
      topics: ['# Số học & Cơ số 2', '# Prefix Sum & Sắp xếp', '# Ma trận 2D & Anagram', '# Stack & File I/O'],
      difficulty: i % 3 === 0 ? 'Nâng cao' : i % 2 === 0 ? 'Khá' : 'Cơ bản',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}
