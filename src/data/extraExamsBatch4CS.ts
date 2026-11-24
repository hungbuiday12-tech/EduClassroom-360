import { ExamPaper, ExamQuestion } from '../types';
import { CHUYEN_SCHOOLS_BATCH_3, THPT_INSTITUTIONS_BATCH_3 } from './extraExamsBatch3Math';
import { safeExamSnippet } from './examSnippetHelper';

export function buildCSChuyenBatch4(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 100; i++) {
    const num = 76 + i;
    const school = CHUYEN_SCHOOLS_BATCH_3[i % CHUYEN_SCHOOLS_BATCH_3.length];
    const limitN = 100000 + (i % 8) * 25000;
    const shift = Math.floor(i / 4);

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho $N$ đoạn thẳng trên trục số $[l_i, r_i]$ ($N \\le ${limitN}$). Hãy tìm số lượng lớn nhất các đoạn thẳng có thể chọn sao cho **không có hai đoạn nào giao nhau** (Activity Selection) và giải thích vì sao phải sắp xếp theo đầu mút phải $r_i$ tăng dần.`,
        solution: `Sắp xếp các đoạn tăng dần theo đầu mút phải $r_i$. Luôn chọn đoạn kết thúc sớm nhất hợp lệ (\`l_i >= last_end\`), vì việc kết thúc sớm nhất để lại khoảng thời gian phía sau rộng nhất cho các đoạn tiếp theo:\n\`\`\`cpp\nsort(segs.begin(), segs.end(), [](auto& a, auto& b) { return a.r < b.r; });\nint cnt = 0, last_r = INT_MIN;\nfor (auto& s : segs) {\n    if (s.l >= last_r) { ++cnt; last_r = s.r; }\n}\n\`\`\``,
        keyFormulasOrHints: ['Tham lam sắp xếp theo r_i tăng dần', 'Độ phức tạp O(N log N)'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Mô phỏng Tham lam & Sắp xếp' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho mảng $A$ gồm $N$ số nguyên ($N \\le ${limitN}$) và $Q$ truy vấn cập nhật cộng giá trị $v$ cho cả đoạn $[L, R]$, sau đó mới hỏi giá trị cuối cùng của toàn mảng. Hãy cài đặt kỹ thuật **Mảng hiệu (Difference Array)** để xử lý mỗi truy vấn trong $\\mathcal{O}(1)$.`,
        solution: `Khởi tạo mảng hiệu \`diff[i] = A[i] - A[i - 1]\`. Với mỗi cập nhật đoạn $[L, R]$ thêm $v$, chỉ sửa đúng $2$ vị trí: \`diff[L] += v; diff[R + 1] -= v;\`.\nCuối cùng cộng dồn tiền tố một lượt từ $1$ đến $N$ để khôi phục mảng kết quả trong $\\mathcal{O}(N + Q)$.`,
        keyFormulasOrHints: ['Difference Array: diff[L] += v, diff[R+1] -= v', 'Khôi phục mảng bằng Prefix Sum']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho dãy số nguyên dương $A$ gồm $N$ phần tử ($N \\le ${limitN}$) và số nguyên dương $K$. Hãy sử dụng **Tìm kiếm nhị phân trên đáp án (Binary Search on Answer)** để tìm giá trị $X$ lớn nhất sao cho có thể cắt các thanh gỗ độ dài $A_i$ thành ít nhất $K$ đoạn có độ dài đúng bằng $X$.`,
        solution: `Hàm kiểm tra $f(X) = \\sum_{i=1}^N \\lfloor A_i / X \\rfloor \\ge K$ có tính đơn điệu giảm theo $X$. Chặt nhị phân trên đoạn $[1, \\max A_i]$:\n\`\`\`cpp\nlong long lo = 1, hi = maxA, ans = 0;\nwhile (lo <= hi) {\n    long long mid = lo + (hi - lo) / 2;\n    long long pieces = 0;\n    for (long long a : A) pieces += a / mid;\n    if (pieces >= K) { ans = mid; lo = mid + 1; }\n    else hi = mid - 1;\n}\n\`\`\``,
        keyFormulasOrHints: ['Binary Search on Answer cho hàm đơn điệu', 'Độ phức tạp O(N log(maxA))']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho một đồ thị hoặc dãy số $N$ phần tử ($N \\le 2\\cdot 10^5$). Hãy dùng **Ngăn xếp đơn điệu (Monotonic Stack)** để tìm với mỗi phần tử $A_i$, chỉ số gần nhất bên trái có giá trị nhỏ hơn hẳn $A_i$ (Nearest Smaller Element) trong thời gian $\\mathcal{O}(N)$.`,
        solution: `Duy trì ngăn xếp lưu các chỉ số sao cho giá trị $A$ trên ngăn xếp tăng ngặt từ đáy lên đỉnh:\n\`\`\`cpp\nstack<int> st;\nfor (int i = 1; i <= n; ++i) {\n    while (!st.empty() && a[st.top()] >= a[i]) st.pop();\n    L[i] = st.empty() ? 0 : st.top();\n    st.push(i);\n}\n\`\`\`\nMỗi phần tử được đẩy vào và lấy ra tối đa $1$ lần nên tổng độ phức tạp là $\\mathcal{O}(N)$.`,
        keyFormulasOrHints: ['Monotonic Stack duy trì thứ tự tăng ngặt', 'Mỗi phần tử push/pop tối đa 1 lần => O(N)']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho dãy $N$ số nguyên ($N \\le 10^5$). Hãy trình bày thuật toán tìm độ dài **Dãy con tăng dài nhất (LIS)** trong $\\mathcal{O}(N\\log N)$ bằng kết hợp Quy hoạch động và \`lower_bound\`.`,
        solution: `Gọi \`tail[k]\` là giá trị kết thúc nhỏ nhất có thể của một dãy con tăng độ dài $k + 1$. Với mỗi $x \\in A$, tìm vị trí đầu tiên $\\ge x$ trong \`tail\` bằng \`lower_bound\` để thay thế (hoặc nối vào cuối nếu $x$ lớn hơn mọi phần tử):\n\`\`\`cpp\nvector<int> tail;\nfor (int x : a) {\n    auto it = lower_bound(tail.begin(), tail.end(), x);\n    if (it == tail.end()) tail.push_back(x);\n    else *it = x;\n}\ncout << tail.size();\n\`\`\``,
        keyFormulasOrHints: ['Mảng tail luôn giữ tính tăng dần', 'lower_bound cho LIS tăng ngặt, upper_bound cho không giảm'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Mô phỏng LIS O(N log N)' }
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho $N$ chữ số và giới hạn $R \\le 10^{18}$. Trình bày cấu trúc tổng quát của **Quy hoạch động chữ số (Digit DP)** để đếm số nguyên trong đoạn $[L, R]$ có tổng các chữ số chia hết cho $D$ ($D \\le 100$).`,
        solution: `Xây dựng hàm đệ quy có nhớ \`dp(pos, rem, tight)\`: đang xét chữ số thứ \`pos\`, tổng chữ số hiện tại mod $D$ là \`rem\`, cờ \`tight\` cho biết tiền tố có đang bám sát biên trên hay không. Trả về $1$ nếu \`pos == len && rem == 0\`. Kết quả là \`solve(R) - solve(L - 1)\`.`,
        keyFormulasOrHints: ['Trạng thái (pos, rem, tight)', 'solve(R) - solve(L - 1)']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho lưới chữ nhật $N \\times M$ ($N, M \\le 1000$) gồm các ô có trọng số $C[i][j]$ và một số ô vật cản. Tính tổng giá trị lớn nhất khi đi từ $(1, 1)$ đến $(N, M)$ chỉ đi sang phải hoặc xuống dưới, đồng thời **đếm số đường đi** trong $\\mathcal{O}(NM)$.`,
        solution: `Dùng $dp[i][j] = \\max(dp[i-1][j], dp[i][j-1]) + C[i][j]$ (bỏ qua ô vật cản). Nếu cần đếm đường đi tối ưu, giữ thêm mảng \`cnt[i][j]\` cộng dồn từ ô trước đạt giá trị max bằng nhau.`,
        keyFormulasOrHints: ['DP trên lưới 2D O(NM)', 'Xử lý ô vật cản bằng trạng thái không hợp lệ']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho cây $N$ đỉnh ($N \\le 10^5$). Sử dụng **Kỹ thuật DP đổi gốc (Rerooting DP)** để tính với **mỗi** đỉnh $u \\in [1..N]$ tổng khoảng cách từ $u$ đến tất cả $N - 1$ đỉnh còn lại trong thời gian tuyến tính $\\mathcal{O}(N)$.`,
        solution: `1. DFS lần 1 tính kích thước cây con \`sz[u]\` và \`ans[1]\` (tổng khoảng cách từ gốc $1$).\n2. DFS lần 2 chuyển gốc từ cha $u$ sang con $v$: các đỉnh trong cây con $v$ (gồm \`sz[v]\` đỉnh) gần hơn $1$ bước, còn \`N - sz[v]\` đỉnh ngoài xa hơn $1$ bước:\n$$ans[v] = ans[u] - sz[v] + (N - sz[v]) = ans[u] + N - 2\\cdot sz[v].$$`,
        keyFormulasOrHints: ['Rerooting DP 2 lượt DFS', 'ans[v] = ans[u] + N - 2*sz[v]']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho đồ thị vô hướng $N$ đỉnh, $M$ cạnh ($N, M \\le 10^5$). Hãy trình bày thuật toán **Kruskal** kết hợp cấu trúc **Disjoint Set Union (DSU)** có nén đường (Path Compression) và gộp theo kích thước/hạng để tìm **Cây khung nhỏ nhất (MST)**.`,
        solution: `Sắp xếp các cạnh tăng dần theo trọng số $w$. Duyệt từng cạnh $(u, v, w)$: nếu \`find(u) != find(v)\` thì gộp hai tập \`unite(u, v)\` và cộng $w$ vào tổng MST cho đủ $N - 1$ cạnh. Độ phức tạp $\\mathcal{O}(M\\log M)$.`,
        keyFormulasOrHints: ['Kruskal sắp xếp cạnh + DSU O(M log M)', 'DSU Path Compression + Union by Size'],
        simulationLink: { type: 'cs', targetId: 'visualizer', label: 'Mô phỏng Kruskal & DSU' }
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho một cây $N$ đỉnh có gốc tại $1$ ($N \\le 10^5$) và $Q$ truy vấn tìm **Tổ tiên chung gần nhất (LCA)** của hai đỉnh $(u, v)$. Trình bày phương pháp **Nâng nhị phân (Binary Lifting)** đạt độ phức tạp $\\mathcal{O}((N + Q)\\log N)$.`,
        solution: `Tiền xử lý mảng \`up[u][k]\` là tổ tiên thứ $2^k$ của $u$ với công thức \`up[u][k] = up[up[u][k-1]][k-1]\`.\nKhi tìm \`LCA(u, v)\`: đưa đỉnh sâu hơn lên ngang độ sâu đỉnh kia theo biểu diễn nhị phân hiệu độ sâu, nếu $u == v$ thì trả về $u$; ngược lại nhảy đồng thời từ $k = \\log N$ xuống $0$ mỗi khi \`up[u][k] != up[v][k]\`, cuối cùng trả về \`up[u][0]\`.`,
        keyFormulasOrHints: ['Bảng nhảy up[u][k] = up[up[u][k-1]][k-1]', 'Cân bằng độ sâu rồi nhảy đồng thời']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho đồ thị có hướng $N$ đỉnh, $M$ cạnh ($N, M \\le 10^5$). Hãy trình bày thuật toán **Kosaraju** (hoặc Tarjan) để phân rã đồ thị thành các **Thành phần liên thông mạnh (SCC)** và xây dựng đồ thị DAG cô đặc.`,
        solution: `Thuật toán Kosaraju:\n1. DFS trên đồ thị gốc $G$ ghi lại thứ tự hoàn thành (đẩy vào stack khi thoát DFS).\n2. Đảo chiều toàn bộ cạnh để được đồ thị chuyển vị $G^T$.\n3. Lần lượt lấy đỉnh từ đỉnh stack và DFS trên $G^T$: mỗi lần DFS thu được đúng một thành phần liên thông mạnh trong $\\mathcal{O}(N + M)$.`,
        keyFormulasOrHints: ['Kosaraju 2 lượt DFS trên G và G^T', 'Độ phức tạp tuyến tính O(N + M)']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho mảng $A$ gồm $N$ phần tử ($N \\le 10^5$) và $Q$ truy vấn thuộc hai loại: (1) cộng thêm $v$ cho mọi phần tử trong đoạn $[L, R]$; (2) tính tổng đoạn $[L, R]$. Hãy cài đặt **Cây phân đoạn (Segment Tree) với Cập nhật lười (Lazy Propagation)** chạy trong $\\mathcal{O}((N + Q)\\log N)$.`,
        solution: `Mỗi nút quản lý đoạn $[l, r]$ lưu tổng \`sum\` và giá trị chờ \`lazy\`. Khi thăm một nút có \`lazy != 0\`, đẩy \`lazy\` xuống hai nút con (\`pushDown\`) rồi mới đệ quy tiếp. Cập nhật hay truy vấn đoạn mất $\\mathcal{O}(\\log N)$.`,
        keyFormulasOrHints: ['Lazy Propagation đẩy dồn lazy khi đi xuống', 'Cập nhật tổng nút con: st[id] += val * (r - l + 1)']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho đa giác lồi $N$ đỉnh ($N \\le 10^5$) theo thứ tự ngược chiều kim đồng hồ và $Q$ điểm truy vấn $P$. Hãy trình bày thuật toán sử dụng **Tích có hướng (Cross Product)** và tìm kiếm nhị phân để kiểm tra điểm $P$ có nằm trong đa giác lồi trong $\\mathcal{O}(\\log N)$ mỗi điểm.`,
        solution: `Chọn đỉnh gốc $A_0$. Kiểm tra $P$ có nằm trong góc $\\widehat{A_1 A_0 A_{n-1}}$ không bằng tích có hướng. Sau đó chặt nhị phân tìm cung tam giác $(A_0, A_k, A_{k+1})$ chứa tia $A_0 P$, cuối cùng kiểm tra $P$ nằm cùng phía với $A_0$ so với cạnh $A_k A_{k+1}$.`,
        keyFormulasOrHints: ['Cross product (B - A) x (C - A)', 'Chặt nhị phân góc từ đỉnh A_0']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho mảng $N$ phần tử ($N \\le 10^5$) và $Q$ truy vấn $[L, R]$ đếm số lượng giá trị phân biệt xuất hiện trong đoạn $[L, R]$. Hãy trình bày **Thuật toán Mo (Mo's Algorithm)** giải bài toán offline trong $\\mathcal{O}((N + Q)\\sqrt{N})$.`,
        solution: `Chia mảng thành các block kích thước $B = \\lfloor\\sqrt{N}\\rfloor$. Sắp xếp các truy vấn theo cặp $(\\lfloor L / B \\rfloor, R)$ (tối ưu dấu zic-zac theo tính chẵn lẻ block của $L$). Duy trì hai con trỏ \`curL, curR\` và mảng tần số \`freq[]\` cập nhật biến \`distinct\` mỗi khi thêm/bớt 1 phần tử trong $\\mathcal{O}(1)$.`,
        keyFormulasOrHints: ['Block size sqrt(N)', 'Sắp xếp truy vấn offline giảm dịch chuyển con trỏ']
      }
    ];

    const q1 = q1Pool[(i + shift) % q1Pool.length];
    const q2 = q2Pool[(i + 1 + shift) % q2Pool.length];
    const q3 = q3Pool[(i + 2 + shift) % q3Pool.length];
    const q4 = q4Pool[(i + 3 + shift) % q4Pool.length];

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
      topics: ['# Tham lam & Chặt nhị phân', '# LIS & Digit DP & Rerooting', '# Kruskal DSU & LCA & SCC', '# Lazy Segment Tree & Mo'],
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
    const school = THPT_INSTITUTIONS_BATCH_3[i % THPT_INSTITUTIONS_BATCH_3.length];
    const limitN = 1000 + (i % 10) * 500;
    const shift = Math.floor(i / 4);

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Nhập vào số nguyên dương $N$ ($N \\le 10^9$). Hãy kiểm tra xem $N$ có phải là **số hoàn hảo** (tổng các ước dương thực sự nhỏ hơn $N$ bằng chính $N$, ví dụ $6 = 1 + 2 + 3$) hay không trong thời gian $\\mathcal{O}(\\sqrt{N})$.`,
        solution: `Code Python mẫu:\n\`\`\`python\nn = int(input())\nif n < 2:\n    print("NO")\nelse:\n    s = 1\n    d = 2\n    while d * d <= n:\n        if n % d == 0:\n            s += d\n            if d * d != n:\n                s += n // d\n        d += 1\n    print("YES" if s == n else "NO")\n\`\`\``,
        keyFormulasOrHints: ['Duyệt ước đến căn bậc hai của N', 'Cộng cả cặp ước d và N // d']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Nhập vào số nguyên dương $N$. In ra số lượng chữ số chẵn, số lượng chữ số lẻ và chữ số lớn nhất trong biểu diễn thập phân của $N$.`,
        solution: `Code Python mẫu:\n\`\`\`python\ns = input().strip()\neven = sum(1 for c in s if int(c) % 2 == 0)\nodd = len(s) - even\nprint(f"Chan: {even}, Le: {odd}, Max: {max(s)}")\n\`\`\``,
        keyFormulasOrHints: ['Xử lý chuỗi số rất tiện lợi trong Python', 'max(s) tìm chữ số lớn nhất']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Viết chương trình tính Bội chung nhỏ nhất (BCNN) của hai số nguyên dương $a, b$ nhập từ bàn phím dựa trên công thức $\\text{BCNN}(a, b) = \\frac{a \\cdot b}{\\text{UCLN}(a, b)}$.`,
        solution: `Code Python mẫu:\n\`\`\`python\nimport math\na, b = map(int, input().split())\ng = math.gcd(a, b)\nprint((a // g) * b)\n\`\`\``,
        keyFormulasOrHints: ['Chia trước nhân sau (a // g) * b tránh tràn số ở C++']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho dãy số nguyên $A$ gồm $N$ phần tử ($N \\le ${limitN}$).\na) Tìm phần tử lớn thứ hai (giá trị nhỏ hơn hẳn giá trị lớn nhất) trong dãy $A$ chỉ bằng **một vòng lặp** $\\mathcal{O}(N)$.\nb) Đếm số lần xuất hiện của mỗi giá trị trong dãy bằng từ điển (Dictionary).`,
        solution: `Code Python mẫu:\n\`\`\`python\nfrom collections import Counter\nn = int(input())\na = list(map(int, input().split()))\nmx1 = mx2 = float('-inf')\nfor x in a:\n    if x > mx1:\n        mx2, mx1 = mx1, x\n    elif mx1 > x > mx2:\n        mx2 = x\nprint("Lon thu hai:", mx2 if mx2 != float('-inf') else "Khong co")\nprint(dict(Counter(a)))\n\`\`\``,
        keyFormulasOrHints: ['Duy trì hai biến mx1, mx2 trong một lượt duyệt', 'Counter đếm tần suất trong O(N)']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho dãy $N$ số nguyên ($N \\le ${limitN}$) đã được **sắp xếp tăng dần**. Hãy viết hàm **Tìm kiếm nhị phân** (không dùng thư viện có sẵn) để tìm chỉ số đầu tiên mà giá trị $X$ xuất hiện (hoặc $-1$ nếu không tìm thấy).`,
        solution: `Code Python mẫu:\n\`\`\`python\ndef binary_search_first(a, x):\n    lo, hi, res = 0, len(a) - 1, -1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if a[mid] == x:\n            res = mid\n            hi = mid - 1  # tiếp tục tìm bên trái\n        elif a[mid] < x:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return res\n\`\`\``,
        keyFormulasOrHints: ['Khi tìm thấy a[mid] == x vẫn dịch hi = mid - 1 để tìm vị trí đầu tiên']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho ma trận vuông kích thước $N \\times N$ ($N \\le 100$). Tính tổng các phần tử trên **đường chéo chính** ($i = j$) và tổng các phần tử trên **đường chéo phụ** ($i + j = N - 1$), lưu ý nếu $N$ lẻ không tính phần tử tâm hai lần khi tính hợp hai đường chéo.`,
        solution: `Code Python mẫu:\n\`\`\`python\nn = int(input())\nmat = [list(map(int, input().split())) for _ in range(n)]\nmain_diag = sum(mat[i][i] for i in range(n))\nanti_diag = sum(mat[i][n - 1 - i] for i in range(n))\ntotal = main_diag + anti_diag - (mat[n // 2][n // 2] if n % 2 == 1 else 0)\nprint(main_diag, anti_diag, total)\n\`\`\``,
        keyFormulasOrHints: ['Đường chéo chính: mat[i][i]', 'Đường chéo phụ: mat[i][n - 1 - i]']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Nhập vào một xâu ký tự $S$ chỉ gồm chữ cái in thường. Hãy thực hiện **Mã hóa độ dài chạy (Run-Length Encoding)** xâu $S$ (ví dụ \`aaabbc\` thành \`a3b2c1\`).`,
        solution: `Code Python mẫu:\n\`\`\`python\ns = input().strip()\nif s:\n    res = []\n    cnt = 1\n    for i in range(1, len(s)):\n        if s[i] == s[i - 1]:\n            cnt += 1\n        else:\n            res.append(f"{s[i - 1]}{cnt}")\n            cnt = 1\n    res.append(f"{s[-1]}{cnt}")\n    print("".join(res))\n\`\`\``,
        keyFormulasOrHints: ['So sánh s[i] với s[i - 1] đếm đoạn liên tiếp giống nhau', 'Nhớ xuất nhóm ký tự cuối cùng sau vòng lặp']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Nhập vào hai xâu $S_1$ và $S_2$ (chỉ gồm chữ cái tiếng Anh). Kiểm tra xem hai xâu có phải là **đảo chữ (Anagram)** của nhau hay không (không phân biệt hoa/thường và bỏ qua khoảng trắng).`,
        solution: `Code Python mẫu:\n\`\`\`python\nfrom collections import Counter\ns1 = "".join(c.lower() for c in input() if c.isalpha())\ns2 = "".join(c.lower() for c in input() if c.isalpha())\nprint("YES" if Counter(s1) == Counter(s2) else "NO")\n\`\`\``,
        keyFormulasOrHints: ['Chuẩn hóa lowercase và lọc chữ cái', 'So sánh Counter hai xâu trong O(N)']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Viết hàm kiểm tra một mật khẩu nhập vào có đủ độ mạnh theo quy chuẩn hay không: độ dài $\\ge 8$, chứa ít nhất $1$ chữ hoa, $1$ chữ thường, $1$ chữ số và $1$ ký tự đặc biệt.`,
        solution: `Code Python mẫu:\n\`\`\`python\npw = input()\nhas_up = any(c.isupper() for c in pw)\nhas_lo = any(c.islower() for c in pw)\nhas_di = any(c.isdigit() for c in pw)\nhas_sp = any(not c.isalnum() for c in pw)\nprint("STRONG" if len(pw) >= 8 and has_up and has_lo and has_di and has_sp else "WEAK")\n\`\`\``,
        keyFormulasOrHints: ['any() kết hợp isupper, islower, isdigit, isalnum']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Thiết kế hệ thống bảng quan hệ SQL cơ bản quản lý thư viện trường học gồm bảng \`Sach(MaSach, TenSach, TacGia, NamXB)\` và \`MuonTra(MaPhieu, MaSach, MaHS, NgayMuon, DaTra)\`. Viết câu truy vấn SQL liệt kê tên các sách chưa được trả (\`DaTra = 0\`) xuất bản sau năm $2020$.`,
        solution: `Câu truy vấn SQL chuẩn:\n\`\`\`sql\nSELECT S.MaSach, S.TenSach, M.MaHS, M.NgayMuon\nFROM Sach S\nINNER JOIN MuonTra M ON S.MaSach = M.MaSach\nWHERE M.DaTra = 0 AND S.NamXB > 2020\nORDER BY M.NgayMuon DESC;\n\`\`\``,
        keyFormulasOrHints: ['INNER JOIN nối khóa ngoại MaSach', 'Lọc điều kiện kết hợp WHERE và AND']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Trình bày giải thuật **Sắp xếp chèn (Insertion Sort)** trên mảng $A = [5, 2, 9, 1, 6]$ qua từng bước và nêu độ phức tạp thời gian trong trường hợp tốt nhất và xấu nhất.`,
        solution: `Các bước Insertion Sort tăng dần:\n- Khởi tạo: \`[5 | 2, 9, 1, 6]\`\n- Bước 1 (chèn 2): \`[2, 5 | 9, 1, 6]\`\n- Bước 2 (chèn 9): \`[2, 5, 9 | 1, 6]\`\n- Bước 3 (chèn 1): \`[1, 2, 5, 9 | 6]\`\n- Bước 4 (chèn 6): \`[1, 2, 5, 6, 9]\`\nĐộ phức tạp: tốt nhất $\\mathcal{O}(N)$ (mảng đã sắp sẵn), xấu nhất $\\mathcal{O}(N^2)$ (mảng ngược).`,
        keyFormulasOrHints: ['Chèn phần tử vào đoạn đã sắp bên trái', 'Tốt nhất O(N), xấu nhất O(N^2)']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Viết chương trình dùng **Hàng đợi (Queue / deque)** để mô phỏng bài toán Josephus cơ bản hoặc sinh tất cả các số nhị phân từ $1$ đến $N$ ($N \\le 1000$) theo thứ tự tăng dần mà không dùng phép chia lấy dư.`,
        solution: `Code Python dùng \`collections.deque\`:\n\`\`\`python\nfrom collections import deque\nn = int(input())\nq = deque(["1"])\nfor _ in range(n):\n    cur = q.popleft()\n    print(cur)\n    q.append(cur + "0")\n    q.append(cur + "1")\n\`\`\``,
        keyFormulasOrHints: ['Hàng đợi BFS sinh cây nhị phân tiền tố', 'Từ s đẩy tiếp s+"0" và s+"1" vào cuối queue']
      }
    ];

    const q1 = q1Pool[(i + shift) % q1Pool.length];
    const q2 = q2Pool[(i + 1 + shift) % q2Pool.length];
    const q3 = q3Pool[(i + 2 + shift) % q3Pool.length];
    const q4 = q4Pool[(i + 3 + shift) % q4Pool.length];

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
      topics: ['# Số học & UCLN', '# Tìm kiếm nhị phân & Ma trận', '# Xâu RLE & Anagram', '# SQL & Hàng đợi'],
      difficulty: i % 3 === 0 ? 'Nâng cao' : i % 2 === 0 ? 'Khá' : 'Cơ bản',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}
