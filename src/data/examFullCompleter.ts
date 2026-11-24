import { ExamPaper, ExamQuestion } from '../types';

function buildMathChuyenExtraQuestions(exam: ExamPaper, idx: number): ExamQuestion[] {
  const isAdvanced =
    /hsg|đội tuyển|olympic|quốc gia|vmo/i.test(exam.title) || idx % 3 === 0;
  const a = (idx % 5) + 2;
  const b = (idx % 4) + 3;
  const nVal = 19 + (idx % 7) * 2;

  const q5: ExamQuestion = {
    number: 'Bài 5',
    points: isAdvanced ? '2.0 điểm' : '2.0 điểm',
    content:
      idx % 2 === 0
        ? `a) Tìm tất cả các hàm số $f: \\mathbb{R} \\to \\mathbb{R}$ thỏa mãn phương trình hàm:\n$$f(x + y) + f(x - y) = 2f(x)\\cos y + ${a}y^2 \\quad (\\forall x, y \\in \\mathbb{R}) \\text{ hoặc } f(x^2 - y^2) = x f(x) - y f(y).$$\nXét bài toán chuẩn: Tìm tất cả hàm số $f: \\mathbb{R} \\to \\mathbb{R}$ thỏa mãn $f(x^2 - y^2) = x f(x) - y f(y)$ với mọi $x, y \\in \\mathbb{R}$ và $f(${a}) = ${a * b}$.\nb) Trên bảng ghi các số nguyên dương từ $1$ đến $${nVal}$. Mỗi bước xóa đi hai số $u, v$ và viết thêm số $|u - v|$. Hỏi sau $${nVal - 1}$ bước, số cuối cùng còn lại trên bảng có thể bằng $0$ hay không? Vì sao?`
        : `a) Cho đa thức $P(x) = x^3 + ${a}x^2 + ${b}x + 1$. Chứng minh rằng nếu tồn tại ba số hữu tỉ phân biệt $x_1, x_2, x_3$ sao cho $P(x_1), P(x_2), P(x_3)$ đều là số nguyên thì tính giá trị tổng bình phương $x_1^2 + x_2^2 + x_3^2$ theo hệ số Viète khi $P(x)$ nhận $1, -1$ làm giá trị.\nb) Cho lưới ô vuông kích thước $${nVal} \\times ${nVal}$. Tô màu đỏ vào một số ô sao cho mọi hình vuông con $2 \\times 2$ đều có đúng $2$ ô đỏ. Tìm số lượng ô đỏ lớn nhất và nhỏ nhất có thể có trên lưới.`,
    solution:
      idx % 2 === 0
        ? `a) Thay $y = 0$ vào $f(x^2 - y^2) = x f(x) - y f(y)$, ta được $f(x^2) = x f(x) + 0 = x f(x)$ với mọi $x \\in \\mathbb{R}$ (vì với $x=y=0 \\implies f(0) = 0$).\nSuy ra $f(x^2 - y^2) = f(x^2) - f(y^2)$ với mọi $x, y \\in \\mathbb{R}$. Đặt $u = x^2 \\ge 0, v = y^2 \\ge 0$, suy ra $f$ cộng tính trên $[0; +\\infty)$ và kiểm tra tính lẻ $f(-x) = -f(x)$ do $(-x)f(-x) = f(x^2) = xf(x)$.\nTừ $f(x + y) = f(x) + f(y)$ với mọi $x, y$ kết hợp tính liên tục / cấu trúc $f(x^2) = x f(x)$, suy ra $f(x) = kx$. Vì $f(${a}) = ${a * b}$ nên $k = ${b}$, vậy $f(x) = ${b}x$.\n\nb) Xét bất biến **tính chẵn lẻ của tổng các số trên bảng**:\nBan đầu tổng là $S_0 = 1 + 2 + \\dots + ${nVal} = \\frac{${nVal} \\cdot ${nVal + 1}}{2}$.\nKhi thay $u, v$ bằng $|u - v|$, tổng thay đổi một lượng $\\Delta S = |u - v| - (u + v) = -2\\min(u, v)$, luôn là số chẵn! Do đó tính chẵn lẻ của tổng bất biến.\nVì $S_0$ là ${((nVal * (nVal + 1)) / 2) % 2 === 0 ? 'số chẵn' : 'số lẻ'}, nên số cuối cùng còn lại bắt buộc là ${((nVal * (nVal + 1)) / 2) % 2 === 0 ? 'số chẵn (có thể bằng 0 tùy phân hoạch)' : 'số lẻ, không thể bằng 0'}.`
        : `a) Áp dụng định lý Viète cho đa thức bậc ba và tính chất chia hết của nghiệm hữu tỉ: nếu $P(x) - c = 0$ có nghiệm hữu tỉ $p/q$ tối giản với hệ số cao nhất là $1$ thì $q = 1$, tức các nghiệm hữu tỉ buộc phải nguyên.\n\nb) Chia bảng $${nVal} \\times ${nVal}$ thành các dải hàng (hoặc cột) kích thước $2 \\times ${nVal}$ và phần dư $1$ hàng/cột cuối (do $${nVal}$ lẻ).\nMỗi khối $2 \\times 2$ có đúng $2$ ô đỏ. Xét trạng thái xen kẽ theo hàng hoặc theo cột, cực đại đạt được khi cột/hàng biên lẻ toàn bộ là ô đỏ: $\\max = \\frac{${nVal + 1}}{2} \\cdot ${nVal} = ${((nVal + 1) / 2) * nVal}$ hoặc đánh giá chặt từng hàng chẵn/lẻ để kết luận giá trị nhỏ nhất $\\min = \\frac{${nVal - 1}}{2} \\cdot ${nVal} = ${((nVal - 1) / 2) * nVal}$.`,
    keyFormulasOrHints: [
      idx % 2 === 0 ? 'Bất biến modulo 2 của tổng S' : 'Phân hoạch lưới thành các khối 2×2',
      'Thế giá trị đặc biệt vào phương trình hàm'
    ]
  };

  if (!isAdvanced) return [q5];

  const q6: ExamQuestion = {
    number: 'Bài 6',
    points: '2.0 điểm',
    content: `Cho tam giác nhọn $ABC$ nội tiếp đường tròn $(O)$ cố định với $B, C$ cố định và $A$ chuyển động trên cung lớn $BC$. Gọi $I$ là tâm đường tròn nội tiếp $\\triangle ABC$, đường thẳng $AI$ cắt $(O)$ tại điểm thứ hai $D$ ($D \\ne A$).\na) Chứng minh $DB = DI = DC$.\nb) Chứng minh khi $A$ thay đổi trên cung lớn $BC$, tâm đường tròn ngoại tiếp $\\triangle IBC$ là điểm cố định.\nc) Gọi $r$ là bán kính đường tròn nội tiếp và $R$ là bán kính đường tròn ngoại tiếp $\\triangle ABC$. Chứng minh hệ thức Euler: $OI^2 = R^2 - 2Rr$.`,
    solution: `a) Ta có $\\widehat{BAD} = \\widehat{CAD} \\implies \\text{sđ}\\overset{\\frown}{BD} = \\text{sđ}\\overset{\\frown}{CD} \\implies DB = DC$.\nXét $\\triangle BID$: $\\widehat{BID} = \\widehat{BAI} + \\widehat{ABI} = \\frac{\\widehat{A} + \\widehat{B}}{2}$, đồng thời $\\widehat{IBD} = \\widehat{IBC} + \\widehat{CBD} = \\frac{\\widehat{B}}{2} + \\frac{\\widehat{A}}{2} = \\widehat{BID}$. Suy ra $\\triangle BID$ cân tại $D$, nên $DB = DI = DC$.\n\nb) Vì $DB = DI = DC$ nên $D$ là tâm đường tròn ngoại tiếp $\\triangle IBC$. Do $B, C$ và $(O)$ cố định nên trung điểm $D$ của cung nhỏ $BC$ cố định.\n\nc) Gọi đường kính $DE$ của $(O)$, kẻ đường cao $IK \\perp AB$ ($IK = r$). Áp dụng phương tích của điểm $I$ đối với $(O)$: $R^2 - OI^2 = IA \\cdot ID$.\nXét $\\triangle AIK \\sim \\triangle EBD$ (g.g) $\\implies \\frac{IA}{ED} = \\frac{IK}{BD} \\implies IA \\cdot BD = 2R \\cdot r$. Mà $BD = ID$, suy ra $IA \\cdot ID = 2Rr \\implies OI^2 = R^2 - 2Rr$.`,
    keyFormulasOrHints: [
      'Bổ đề tâm đường tròn nội tiếp: DB = DI = DC',
      'Phương tích của điểm I với (O): R^2 - OI^2 = IA · ID'
    ],
    simulationLink: { type: 'math', targetId: 'geometry', label: 'Mô phỏng đường tròn & hệ thức Euler 2D' }
  };

  return [q5, q6];
}

function buildPhysicsChuyenExtraQuestions(exam: ExamPaper, idx: number): ExamQuestion[] {
  const isAdvanced =
    /hsg|đội tuyển|olympic|quốc gia|chọn/i.test(exam.title) || idx % 3 === 0;
  const T1 = 300 + (idx % 4) * 50;
  const T2 = T1 + 200;
  const nMol = (idx % 3) + 1;

  const q5: ExamQuestion = {
    number: 'Bài 5',
    points: '2.0 điểm',
    content: `Một lượng gồm $n = ${nMol}\\text{ mol}$ khí lý tưởng đơn nguyên tử thực hiện chu trình biến đổi khép kín $1 \\to 2 \\to 3 \\to 1$ như sau:\n- Quá trình $1 \\to 2$: Dãn nở đẳng áp ở áp suất $p_1$ từ nhiệt độ $T_1 = ${T1}\\text{ K}$ đến $T_2 = ${T2}\\text{ K}$.\n- Quá trình $2 \\to 3$: Làm lạnh đẳng tích để áp suất giảm còn một nửa ($p_3 = p_1/2$).\n- Quá trình $3 \\to 1$: Nén đẳng nhiệt hoặc biến đổi đoạn thẳng trên đồ thị $(p, V)$ về lại trạng thái $1$. (Xét trường hợp $3 \\to 1$ là đoạn thẳng trên $(p, V)$).\na) Tính nhiệt lượng khí nhận được trong quá trình đẳng áp $1 \\to 2$ theo $R = 8{,}31\\text{ J/(mol}\\cdot\\text{K)}$.\nb) Tính công do khí thực hiện trong cả chu trình $1 \\to 2 \\to 3 \\to 1$.\nc) Tính hiệu suất của động cơ nhiệt hoạt động theo chu trình trên.`,
    solution: `a) Với khí đơn nguyên tử, $C_V = \\frac{3}{2}R$ và $C_p = \\frac{5}{2}R$.\nTrong quá trình đẳng áp $1 \\to 2$, nhiệt lượng khí nhận là:\n$$Q_{12} = n C_p (T_2 - T_1) = ${nMol} \\cdot \\frac{5}{2} \\cdot 8{,}31 \\cdot (${T2} - ${T1}) = ${((nMol * 2.5 * 8.31 * (T2 - T1))).toFixed(1)}\\text{ J}.$$\n\nb) Trên đồ thị $(p, V)$, chu trình $1 \\to 2 \\to 3 \\to 1$ tạo thành một tam giác vuông có hai cạnh góc vuông song song trục $V$ và trục $p$:\n- $V_2 - V_1 = \\frac{nR(T_2 - T_1)}{p_1}$.\n- $p_2 - p_3 = p_1 - \\frac{p_1}{2} = \\frac{p_1}{2}$.\nDiện tích tam giác chính là công thực hiện trong một chu trình:\n$$A = \\frac{1}{2}(p_1 - p_3)(V_2 - V_1) = \\frac{1}{4} nR(T_2 - T_1) = ${(0.25 * nMol * 8.31 * (T2 - T1)).toFixed(2)}\\text{ J}.$$\n\nc) Trong chu trình, khí nhận nhiệt ở quá trình $1 \\to 2$ (còn $2 \\to 3$ và $3 \\to 1$ có thể tích/nhiệt độ giảm nên nhả nhiệt hoặc kiểm tra $\\Delta U + A'$). Hiệu suất xấp xỉ $H = \\frac{A}{Q_{\\text{nhận}}} \\approx \\frac{0{,}25 nR\\Delta T}{2{,}5 nR\\Delta T} = 10\\%$.`,
    keyFormulasOrHints: [
      'C_p = (5/2)R với khí đơn nguyên tử',
      'Công chu trình = Diện tích hình khép kín trên giản đồ (p, V)'
    ]
  };

  if (!isAdvanced) return [q5];

  const q6: ExamQuestion = {
    number: 'Bài 6',
    points: '2.0 điểm',
    content: `**PHƯƠNG ÁN THỰC HÀNH VẬT LÝ:**\nCho các dụng cụ sau: một thước milimét, một đồng hồ bấm giây, một viên bi thép nhỏ, một máng nghiêng có rãnh trượt nối tiếp với mặt bàn nằm ngang cao $H$ so với sàn nhà, giấy than và giấy trắng.\na) Hãy thiết kế phương án thí nghiệm để xác định vận tốc của viên bi ngay khi rời khỏi mép bàn và kiểm chứng định luật bảo toàn cơ năng (bỏ qua ma sát lăn hoặc đánh giá phần năng lượng hao hụt do ma sát).\nb) Nêu công thức tính vận tốc $v_0$ và biểu thức tính sai số tương đối $\\frac{\\Delta v_0}{v_0}$ theo sai số phép đo tầm xa $L$ và độ cao $H$.`,
    solution: `a) **Cơ sở lý thuyết & các bước tiến hành:**\n- Thả viên bi từ độ cao $h$ trên máng nghiêng. Khi rời mép bàn cao $H$ theo phương ngang, bi chuyển động ném ngang với $v_0$.\n- Thời gian rơi chạm sàn: $t = \\sqrt{\\frac{2H}{g}}$; tầm ném xa: $L = v_0 t \\implies v_0 = L\\sqrt{\\frac{g}{2H}}$.\n- Đặt tờ giấy trắng lót giấy than trên sàn để ghi chính xác vết rơi của bi, đo $L$ và $H$ ít nhất 5 lần để lấy giá trị trung bình.\n- So sánh động năng tại mép bàn $W_đ = \\frac{1}{2}mv_0^2$ với thế năng ban đầu $W_t = mgh$ để xác định phần công ma sát $\\Delta E = mgh - \\frac{1}{2}mv_0^2$.\n\nb) **Công thức sai số phép đo gián tiếp:**\nLấy logarit tự nhiên hai vế biểu thức $v_0 = L\\sqrt{\\frac{g}{2H}}$ rồi vi phân toàn phần (coi $g$ biết chính xác hoặc lấy $\\Delta g$):\n$$\\frac{\\Delta v_0}{v_0} = \\frac{\\Delta L}{L} + \\frac{1}{2}\\frac{\\Delta H}{H} + \\frac{1}{2}\\frac{\\Delta g}{g}.$$`,
    keyFormulasOrHints: [
      'Chuyển động ném ngang: v_0 = L * sqrt(g / (2H))',
      'Sai số tỉ đối hàm tích lũy thừa'
    ],
    simulationLink: { type: 'physics', targetId: 'projectile', label: 'Mô phỏng Chuyển động ném ngang' }
  };

  return [q5, q6];
}

function buildCSChuyenExtraQuestions(idx: number): ExamQuestion[] {
  const limitN = [100000, 200000, 50000, 100000][idx % 4];
  const modVal = 1000000007;

  return [
    {
      number: 'Bài 5',
      points: '4.0 điểm',
      content: `**BÀI TOÁN TỐI ƯU TRÊN ĐỒ THỊ / CÂY (CHUYÊN TIN – VÒNG CHỌN ĐỘI TUYỂN):**\nCho một cây gồm $N$ đỉnh ($1 \\le N \\le ${limitN}$) gốc tại đỉnh $1$. Mỗi đỉnh $u$ có một trọng số nguyên không âm $w_u \\le 10^9$.\nBạn được phép chọn một tập các đỉnh $S$ sao cho **không có hai đỉnh nào trong $S$ kề nhau trực tiếp** (tức nếu cạnh $(u, v)$ tồn tại thì không thể chọn cả $u$ và $v$).\n- **Yêu cầu:** Hãy tính tổng trọng số lớn nhất của tập đỉnh $S$ có thể chọn (kết quả chia lấy dư cho $${modVal}$ nếu lớn, hoặc in giá trị nguyên 64-bit).\n- **Subtask 1 (30%):** $N \\le 20$.\n- **Subtask 2 (30%):** Cây có dạng đường thẳng.\n- **Subtask 3 (40%):** Không có ràng buộc thêm ($N \\le ${limitN}$).\n- **Ví dụ:** $N = 3$, cạnh $(1,2), (1,3)$, trọng số $w = [10, 6, 7] \\implies$ Kết quả: \`13\` (chọn đỉnh 2 và đỉnh 3).`,
      solution: `**Thuật toán Quy hoạch động trên cây (Tree DP) độ phức tạp $O(N)$:**\nGọi:\n- \`dp[u][0]\`: tổng trọng số lớn nhất trong cây con gốc $u$ khi **không chọn** đỉnh $u$.\n- \`dp[u][1]\`: tổng trọng số lớn nhất trong cây con gốc $u$ khi **có chọn** đỉnh $u$.\n\nCông thức chuyển trạng thái với mọi con $v$ của $u$:\n- \`dp[u][1] = w[u] + sum(dp[v][0])\` (vì đã chọn $u$ nên mọi con $v$ bắt buộc không được chọn).\n- \`dp[u][0] = sum(max(dp[v][0], dp[v][1]))\` (vì không chọn $u$ nên con $v$ có thể chọn hoặc không).\n\nĐáp án cuối cùng là \`max(dp[1][0], dp[1][1])\`.\n\n**Code C++ chuẩn $O(N)$:**\n\`\`\`cpp\n#include <bits/stdc++.h>\nusing namespace std;\nconst int MAXN = 200005;\nvector<int> adj[MAXN];\nlong long w[MAXN], dp[MAXN][2];\n\nvoid dfs(int u, int p) {\n    dp[u][0] = 0;\n    dp[u][1] = w[u];\n    for (int v : adj[u]) {\n        if (v == p) continue;\n        dfs(v, u);\n        dp[u][0] += max(dp[v][0], dp[v][1]);\n        dp[u][1] += dp[v][0];\n    }\n}\n\`\`\``,
      keyFormulasOrHints: [
        'dp[u][1] = w[u] + sum(dp[v][0])',
        'dp[u][0] = sum(max(dp[v][0], dp[v][1]))',
        'Độ phức tạp DFS trên cây O(N)'
      ],
      simulationLink: { type: 'cs', targetId: 'tree', label: 'Mô phỏng Cây & Duyệt DFS' }
    }
  ];
}

function buildMathStandardFullQuestions(exam: ExamPaper, idx: number): ExamQuestion[] {
  const a = (idx % 4) + 1;
  const b = (idx % 5) + 1;
  const c = (idx % 6) + 1;
  const k = (idx % 3) + 2;
  const nCard = 6 + (idx % 5);

  const part1: ExamQuestion[] = [
    {
      number: 'Câu 1 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Cho hàm số $y = x^3 - ${3 * a * a}x + ${c}$. Hàm số đã cho nghịch biến trên khoảng nào dưới đây?\nA. $(-\\infty; -${a})$   B. $(-${a}; ${a})$   C. $(${a}; +\\infty)$   D. $(0; +\\infty)$`,
      solution: `**Đáp án đúng: B.**\nTa có $y' = 3x^2 - ${3 * a * a}$. Giải $y' < 0 \\iff x^2 < ${a * a} \\iff -${a} < x < ${a}$. Vậy hàm số nghịch biến trên khoảng $(-${a}; ${a})$.`,
      keyFormulasOrHints: ['y\' < 0 trên khoảng nghịch biến'],
      simulationLink: { type: 'math', targetId: 'grapher', label: 'Đồ thị hàm bậc 3' }
    },
    {
      number: 'Câu 2 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Nghiệm của phương trình $\\log_2(x - ${b}) = 3$ là:\nA. $x = ${b + 6}$   B. $x = ${b + 8}$   C. $x = ${b + 9}$   D. $x = ${8 - b}$`,
      solution: `**Đáp án đúng: B.**\nĐiều kiện: $x > ${b}$. Phương trình tương đương $x - ${b} = 2^3 = 8 \\iff x = ${b + 8}$ (thỏa mãn điều kiện).`,
      keyFormulasOrHints: ['log_a(f(x)) = b <=> f(x) = a^b']
    },
    {
      number: 'Câu 3 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Họ tất cả các nguyên hàm của hàm số $f(x) = 3x^2 + ${2 * c}x$ là:\nA. $x^3 + ${c}x^2 + C$   B. $6x + ${2 * c} + C$   C. $x^3 + ${2 * c}x^2 + C$   D. $3x^3 + ${c}x^2 + C$`,
      solution: `**Đáp án đúng: A.**\nTa có $\\int (3x^2 + ${2 * c}x)\\,dx = x^3 + ${c}x^2 + C$.`,
      keyFormulasOrHints: ['∫ x^n dx = x^(n+1)/(n+1) + C']
    },
    {
      number: 'Câu 4 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Giá trị của tích phân $I = \\int_0^1 (${2 * k}x + 1)\\,dx$ bằng:\nA. $${k}$   B. $${k + 1}$   C. $${2 * k + 1}$   D. $${k + 2}$`,
      solution: `**Đáp án đúng: B.**\n$I = \\left[${k}x^2 + x\\right]_0^1 = (${k} + 1) - 0 = ${k + 1}$.`,
      keyFormulasOrHints: ['Công thức Newton - Leibniz']
    },
    {
      number: 'Câu 5 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Trong không gian $Oxyz$, mặt phẳng $(P): ${a}x - ${b}y + ${c}z - 5 = 0$ có một vectơ pháp tuyến là:\nA. $\\vec{n} = (${a}; ${b}; ${c})$   B. $\\vec{n} = (${a}; -${b}; ${c})$   C. $\\vec{n} = (-${a}; -${b}; ${c})$   D. $\\vec{n} = (${a}; -${b}; -5)$`,
      solution: `**Đáp án đúng: B.**\nMặt phẳng $Ax + By + Cz + D = 0$ có một vectơ pháp tuyến $\\vec{n} = (A; B; C) = (${a}; -${b}; ${c})$.`,
      keyFormulasOrHints: ['VTPT của Ax + By + Cz + D = 0 là (A; B; C)'],
      simulationLink: { type: 'math', targetId: 'math3d', label: 'Không gian Oxyz 3D' }
    },
    {
      number: 'Câu 6 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Trong không gian $Oxyz$, mặt cầu $(S): (x - ${a})^2 + (y + ${b})^2 + (z - ${c})^2 = ${(k + 2) * (k + 2)}$ có tâm $I$ và bán kính $R$ là:\nA. $I(${a}; -${b}; ${c}),\\; R = ${k + 2}$   B. $I(-${a}; ${b}; -${c}),\\; R = ${k + 2}$   C. $I(${a}; -${b}; ${c}),\\; R = ${(k + 2) * (k + 2)}$   D. $I(${a}; ${b}; ${c}),\\; R = ${k + 2}$`,
      solution: `**Đáp án đúng: A.**\nTâm $I(${a}; -${b}; ${c})$ và bán kính $R = \\sqrt{${(k + 2) * (k + 2)}} = ${k + 2}$.`,
      keyFormulasOrHints: ['(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2']
    },
    {
      number: 'Câu 7 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Cho cấp số cộng $(u_n)$ có $u_1 = ${a}$ và công sai $d = ${b}$. Giá trị của số hạng $u_5$ là:\nA. $${a + 3 * b}$   B. $${a + 4 * b}$   C. $${a + 5 * b}$   D. $${4 * a + b}$`,
      solution: `**Đáp án đúng: B.**\nTa có $u_5 = u_1 + 4d = ${a} + 4\\cdot ${b} = ${a + 4 * b}$.`,
      keyFormulasOrHints: ['u_n = u_1 + (n - 1)d']
    },
    {
      number: 'Câu 8 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Một hộp có $${a + 2}$ viên bi đỏ và $${b + 3}$ viên bi xanh (các viên bi có kích thước giống nhau). Chọn ngẫu nhiên $1$ viên bi từ hộp. Xác suất để chọn được viên bi màu đỏ bằng:\nA. $\\frac{${a + 2}}{${a + b + 5}}$   B. $\\frac{${b + 3}}{${a + b + 5}}$   C. $\\frac{${a + 2}}{${b + 3}}$   D. $\\frac{1}{${a + b + 5}}$`,
      solution: `**Đáp án đúng: A.**\nTổng số bi là $(${a + 2}) + (${b + 3}) = ${a + b + 5}$. Xác suất chọn bi đỏ là $P = \\frac{${a + 2}}{${a + b + 5}}$.`,
      keyFormulasOrHints: ['P(A) = n(A) / n(Ω)']
    },
    {
      number: 'Câu 9 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Cho khối chóp có diện tích đáy $B = ${3 * k}$ và chiều cao $h = ${b + 1}$. Thể tích của khối chóp đã cho bằng:\nA. $${3 * k * (b + 1)}$   B. $${k * (b + 1)}$   C. $${2 * k * (b + 1)}$   D. $${k * b}$`,
      solution: `**Đáp án đúng: B.**\n$V = \\frac{1}{3} B h = \\frac{1}{3} \\cdot ${3 * k} \\cdot ${b + 1} = ${k * (b + 1)}$.`,
      keyFormulasOrHints: ['V_chóp = (1/3) · B · h']
    },
    {
      number: 'Câu 10 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Tiệm cận ngang và tiệm cận đứng của đồ thị hàm số $y = \\frac{${k}x + 1}{x - ${a}}$ lần lượt là:\nA. $y = ${k}$ và $x = ${a}$   B. $y = ${a}$ và $x = ${k}$   C. $y = -${k}$ và $x = ${a}$   D. $y = ${k}$ và $x = -${a}$`,
      solution: `**Đáp án đúng: A.**\n$\\lim_{x \\to \\pm\\infty} y = ${k} \\implies$ tiệm cận ngang $y = ${k}$; nghiệm mẫu $x = ${a}$ (không là nghiệm tử) $\\implies$ tiệm cận đứng $x = ${a}$.`,
      keyFormulasOrHints: ['TCN y = a/c, TCĐ x = -d/c']
    },
    {
      number: 'Câu 11 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Đạo hàm của hàm số $y = \\sin(${k}x)$ là:\nA. $y' = \\cos(${k}x)$   B. $y' = ${k}\\cos(${k}x)$   C. $y' = -${k}\\cos(${k}x)$   D. $y' = -\\cos(${k}x)$`,
      solution: `**Đáp án đúng: B.**\nÁp dụng đạo hàm hàm hợp: $(\\sin u)' = u'\\cos u = ${k}\\cos(${k}x)$.`,
      keyFormulasOrHints: ['(sin u)\' = u\' cos u']
    },
    {
      number: 'Câu 12 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Một mẫu số liệu ghép nhóm có giá trị nhỏ nhất thuộc nhóm $[${10 + a}; ${15 + a})$ và giá trị lớn nhất thuộc nhóm $[${35 + a}; ${40 + a})$. Khoảng biến thiên của mẫu số liệu ghép nhóm trên bằng:\nA. $20$   B. $25$   C. $30$   D. $35$`,
      solution: `**Đáp án đúng: C.**\nKhoảng biến thiên $R = u_{k+1} - u_1 = (${40 + a}) - (${10 + a}) = 30$.`,
      keyFormulasOrHints: ['Khoảng biến thiên R = đầu mút phải cuối - đầu mút trái đầu']
    }
  ];

  const part2: ExamQuestion[] = [
    {
      number: 'Câu 13 (Phần II - Đúng/Sai)',
      points: '1.0 điểm',
      content: `Cho hàm số $f(x) = x^3 - ${3 * a}x^2 + 2$. Xét tính đúng sai của các mệnh đề sau:\na) Đạo hàm của hàm số là $f'(x) = 3x^2 - ${6 * a}x$.\nb) Hàm số có hai điểm cực trị là $x = 0$ và $x = ${2 * a}$.\nc) Giá trị cực đại của hàm số bằng $2$.\nd) Đường thẳng đi qua hai điểm cực trị cắt trục hoành tại điểm có hoành độ âm.`,
      solution: `a) **Đúng**: $f'(x) = 3x^2 - ${6 * a}x$.\nb) **Đúng**: $f'(x) = 0 \\iff 3x(x - ${2 * a}) = 0 \\iff x = 0$ hoặc $x = ${2 * a}$.\nc) **Đúng**: Bảng biến thiên cho thấy $x = 0$ là điểm cực đại với $y_{\\text{CĐ}} = f(0) = 2$.\nd) **Sai**: Điểm cực đại $(0; 2)$, điểm cực tiểu $(${2 * a}; ${2 - 4 * a * a * a})$ ($< 0$). Đoạn nối đi qua trục hoành tại hoành độ dương $x \\in (0; ${2 * a})$.`,
      keyFormulasOrHints: ['Bảng biến thiên & Cực trị hàm bậc 3'],
      simulationLink: { type: 'math', targetId: 'grapher', label: 'Đồ thị hàm bậc ba Oxy' }
    },
    {
      number: 'Câu 14 (Phần II - Đúng/Sai)',
      points: '1.0 điểm',
      content: `Một chất điểm chuyển động thẳng với vận tốc tức thời $v(t) = ${2 * a}t + ${b}$ (m/s), trong đó $t$ tính bằng giây ($t \\ge 0$).\na) Gia tốc tức thời của chất điểm tại thời điểm $t$ bằng $${2 * a}\\text{ m/s}^2$.\nb) Vận tốc ban đầu tại $t = 0$ bằng $${b}\\text{ m/s}$.\nc) Quãng đường chất điểm đi được trong $2$ giây đầu tiên là $${4 * a + 2 * b}\\text{ m}$.\nd) Vận tốc trung bình trong khoảng thời gian từ $t = 0$ đến $t = 2$ bằng $${2 * a + b}\\text{ m/s}$.`,
      solution: `a) **Đúng**: $a(t) = v'(t) = ${2 * a}\\text{ m/s}^2$.\nb) **Đúng**: $v(0) = ${b}\\text{ m/s}$.\nc) **Đúng**: $S = \\int_0^2 (${2 * a}t + ${b})\\,dt = \\left[${a}t^2 + ${b}t\\right]_0^2 = ${4 * a + 2 * b}\\text{ m}$.\nd) **Đúng**: $v_{\\text{tb}} = \\frac{S}{2} = ${2 * a + b}\\text{ m/s}$.`,
      keyFormulasOrHints: ['S = ∫ v(t) dt', 'a(t) = v\'(t)']
    },
    {
      number: 'Câu 15 (Phần II - Đúng/Sai)',
      points: '1.0 điểm',
      content: `Trong không gian $Oxyz$, cho ba điểm $A(${a}; 0; 0)$, $B(0; ${b}; 0)$ và $C(0; 0; ${c})$.\na) Tọa độ vectơ $\\overrightarrow{AB} = (-${a}; ${b}; 0)$.\nb) Mặt phẳng $(ABC)$ có phương trình theo đoạn chắn là $\\frac{x}{${a}} + \\frac{y}{${b}} + \\frac{z}{${c}} = 1$.\nc) Trọng tâm $G$ của tam giác $ABC$ có tọa độ $\\left(\\frac{${a}}{3}; \\frac{${b}}{3}; \\frac{${c}}{3}\\right)$.\nd) Tứ diện $OABC$ có thể tích bằng $V = ${a * b * c}$.`,
      solution: `a) **Đúng**: $\\overrightarrow{AB} = (0 - ${a}; ${b} - 0; 0 - 0) = (-${a}; ${b}; 0)$.\nb) **Đúng**: Phương trình đoạn chắn qua 3 trục tọa độ.\nc) **Đúng**: $G = \\frac{A + B + C}{3}$.\nd) **Sai**: Ba cạnh $OA, OB, OC$ đôi một vuông góc nên $V_{OABC} = \\frac{1}{6} OA\\cdot OB\\cdot OC = \\frac{${a * b * c}}{6}$.`,
      keyFormulasOrHints: ['PT mặt chắn: x/a + y/b + z/c = 1', 'V = (1/6)abc'],
      simulationLink: { type: 'math', targetId: 'math3d', label: 'Hình chóp OABC trong Oxyz' }
    },
    {
      number: 'Câu 16 (Phần II - Đúng/Sai)',
      points: '1.0 điểm',
      content: `Cho hai biến cố độc lập $A$ và $B$ với $P(A) = 0{,}4$ và $P(B) = 0{,}5$.\na) Xác suất biến cố đối $\\overline{A}$ là $P(\\overline{A}) = 0{,}6$.\nb) Vì $A$ và $B$ độc lập nên $P(A \\cap B) = 0{,}2$.\nc) Xác suất để ít nhất một trong hai biến cố xảy ra là $P(A \\cup B) = 0{,}9$.\nd) Xác suất có điều kiện $P(A \\mid B) = 0{,}4$.`,
      solution: `a) **Đúng**: $P(\\overline{A}) = 1 - 0{,}4 = 0{,}6$.\nb) **Đúng**: $P(A \\cap B) = P(A)\\cdot P(B) = 0{,}4 \\cdot 0{,}5 = 0{,}2$.\nc) **Sai**: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0{,}4 + 0{,}5 - 0{,}2 = 0{,}7$.\nd) **Đúng**: Vì $A, B$ độc lập nên $P(A \\mid B) = P(A) = 0{,}4$.`,
      keyFormulasOrHints: ['P(A ∪ B) = P(A) + P(B) - P(A ∩ B)', 'Độc lập: P(A ∩ B) = P(A)P(B)']
    }
  ];

  const part3Short: ExamQuestion[] = [
    {
      number: 'Câu 17 (Phần III - Trả lời ngắn)',
      points: '0.5 điểm',
      content: `Một xưởng sản xuất tính toán lợi nhuận $L(x)$ (triệu đồng) khi bán $x$ sản phẩm theo công thức $L(x) = -x^2 + ${2 * (a + 8)}x - ${c}$. Cần sản xuất bao nhiêu sản phẩm để lợi nhuận đạt giá trị lớn nhất?`,
      solution: `Hàm bậc hai $L(x) = -x^2 + ${2 * (a + 8)}x - ${c}$ có hệ số bậc hai âm ($-1 < 0$), đạt cực đại tại đỉnh parabol:\n$$x = -\\frac{b}{2a} = \\frac{${2 * (a + 8)}}{2} = ${a + 8}\\text{ (sản phẩm)}.$$\n**Đáp số:** ${a + 8}.`,
      keyFormulasOrHints: ['Đỉnh parabol x = -b/(2a)']
    },
    {
      number: 'Câu 18 (Phần III - Trả lời ngắn)',
      points: '0.5 điểm',
      content: `Trong một giải đấu giao hữu có $${nCard}$ đội bóng tham gia thi đấu vòng tròn một lượt (hai đội bất kỳ gặp nhau đúng một lần). Hỏi có tất cả bao nhiêu trận đấu diễn ra?`,
      solution: `Mỗi trận đấu tương ứng với một tổ hợp chập $2$ của $${nCard}$ đội. Số trận đấu là:\n$$C_{${nCard}}^2 = \\frac{${nCard}\\cdot ${nCard - 1}}{2} = ${(nCard * (nCard - 1)) / 2}\\text{ (trận)}.$$\n**Đáp số:** ${(nCard * (nCard - 1)) / 2}.`,
      keyFormulasOrHints: ['C_n^2 = n(n - 1) / 2']
    }
  ];

  const originalAsPart3 = exam.questions.map((q, qIdx) => ({
    ...q,
    number: `Câu ${19 + qIdx} (Phần III - Vận dụng)`,
    points: '0.5 điểm'
  }));

  return [...part1, ...part2, ...part3Short, ...originalAsPart3];
}

function buildPhysicsStandardFullQuestions(exam: ExamPaper, idx: number): ExamQuestion[] {
  const m = ((idx % 4) + 1) * 2; // kg: 2, 4, 6, 8
  const dt = 10 + (idx % 5) * 5; // delta T: 10, 15, 20, 25, 30
  const lPend = [0.4, 0.9, 1.6, 2.5][idx % 4];
  const fWave = 10 + (idx % 5) * 5;
  const vWave = fWave * ((idx % 4) + 2);
  const lambdaCm = (idx % 4) + 2;
  const iVal = (idx % 4) + 2;
  const bVal = [0.2, 0.4, 0.5, 0.8][idx % 4];
  const nTurns = 100 + (idx % 4) * 50;
  const uRms = [100, 120, 200, 220][idx % 4];

  const part1: ExamQuestion[] = [
    {
      number: 'Câu 1 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Nhiệt lượng cần cung cấp để làm nóng $${m}\\text{ kg}$ nước (có nhiệt dung riêng $c = 4200\\text{ J/(kg}\\cdot\\text{K)}$) tăng thêm $\\Delta T = ${dt}\\text{ K}$ là:\nA. $${(m * 4200 * dt) / 1000}\\text{ kJ}$   B. $${(m * 420 * dt) / 1000}\\text{ kJ}$   C. $${(4200 * dt) / 1000}\\text{ kJ}$   D. $${(2 * m * 4200 * dt) / 1000}\\text{ kJ}$`,
      solution: `**Đáp án đúng: A.**\nÁp dụng $Q = mc\\Delta T = ${m} \\cdot 4200 \\cdot ${dt} = ${m * 4200 * dt}\\text{ J} = ${(m * 4200 * dt) / 1000}\\text{ kJ}$.`,
      keyFormulasOrHints: ['Q = m·c·ΔT']
    },
    {
      number: 'Câu 2 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Theo nguyên lý I nhiệt động lực học $\\Delta U = A + Q$, nếu một khối khí nhận nhiệt lượng $Q = ${120 + idx % 50}\\text{ J}$ và thực hiện công $40\\text{ J}$ (tức $A = -40\\text{ J}$) thì độ biến thiên nội năng $\\Delta U$ bằng:\nA. $${80 + idx % 50}\\text{ J}$   B. $${160 + idx % 50}\\text{ J}$   C. $${40}\\text{ J}$   D. $-${80 + idx % 50}\\text{ J}$`,
      solution: `**Đáp án đúng: A.**\n$\\Delta U = A + Q = -40 + ${120 + idx % 50} = ${80 + idx % 50}\\text{ J}$.`,
      keyFormulasOrHints: ['ΔU = A + Q (hệ thực hiện công thì A < 0)']
    },
    {
      number: 'Câu 3 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Quá trình biến đổi trạng thái của một lượng khí xác định khi giữ nhiệt độ không đổi gọi là:\nA. Quá trình đẳng tích   B. Quá trình đẳng áp   C. Quá trình đẳng nhiệt   D. Quá trình đoạn nhiệt`,
      solution: `**Đáp án đúng: C.**\nTheo định luật Boyle, quá trình biến đổi trạng thái khi nhiệt độ $T = \\text{hằng số}$ là quá trình đẳng nhiệt ($p_1 V_1 = p_2 V_2$).`,
      keyFormulasOrHints: ['Đẳng nhiệt: pV = const']
    },
    {
      number: 'Câu 4 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Một khối khí lý tưởng ban đầu có áp suất $p_1 = 2\\text{ atm}$, thể tích $V_1 = ${m}\\text{ lít}$. Nén đẳng nhiệt để thể tích giảm còn một nửa ($V_2 = V_1 / 2$). Áp suất $p_2$ của khí lúc sau bằng:\nA. $1\\text{ atm}$   B. $2\\text{ atm}$   C. $4\\text{ atm}$   D. $8\\text{ atm}$`,
      solution: `**Đáp án đúng: C.**\nTheo định luật Boyle: $p_1 V_1 = p_2 V_2 \\implies p_2 = p_1 \\frac{V_1}{V_2} = 2 \\cdot 2 = 4\\text{ atm}$.`,
      keyFormulasOrHints: ['Định luật Boyle: p1·V1 = p2·V2']
    },
    {
      number: 'Câu 5 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Nhiệt độ tuyệt đối $T$ (K) và nhiệt độ Celsius $t$ ($^\\circ\\text{C}$) liên hệ gần đúng theo công thức nào sau đây?\nA. $T = t + 273$   B. $T = t - 273$   C. $T = 273 - t$   D. $T = t / 273$`,
      solution: `**Đáp án đúng: A.**\nTrong thang Kelvin chuẩn THPT: $T(\\text{K}) = t(^\\circ\\text{C}) + 273$.`,
      keyFormulasOrHints: ['T(K) = t(°C) + 273']
    },
    {
      number: 'Câu 6 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Động năng tịnh tiến trung bình của phân tử khí lý tưởng phụ thuộc trực tiếp vào đại lượng nào sau đây?\nA. Áp suất chất khí   B. Nhiệt độ tuyệt đối $T$   C. Khối lượng riêng   D. Thể tích bình chứa`,
      solution: `**Đáp án đúng: B.**\n$W_{\\text{đ}} = \\frac{3}{2} k T$, chỉ tỉ lệ thuận với nhiệt độ tuyệt đối $T$.`,
      keyFormulasOrHints: ['W_đ = (3/2)kT']
    },
    {
      number: 'Câu 7 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Một đoạn dây dẫn thẳng dài $l = 0{,}5\\text{ m}$ mang dòng điện $I = ${iVal}\\text{ A}$ đặt vuông góc với đường sức từ của từ trường đều có cảm ứng từ $B = ${bVal}\\text{ T}$. Độ lớn lực từ tác dụng lên đoạn dây bằng:\nA. $${(bVal * iVal * 0.5).toFixed(2)}\\text{ N}$   B. $${(bVal * iVal).toFixed(2)}\\text{ N}$   C. $${(2 * bVal * iVal).toFixed(2)}\\text{ N}$   D. $0\\text{ N}$`,
      solution: `**Đáp án đúng: A.**\n$F = B I l \\sin 90^\\circ = ${bVal} \\cdot ${iVal} \\cdot 0{,}5 = ${(bVal * iVal * 0.5).toFixed(2)}\\text{ N}$.`,
      keyFormulasOrHints: ['F = B·I·l·sin(α)']
    },
    {
      number: 'Câu 8 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Đơn vị của từ thông $\\Phi$ trong hệ SI là:\nA. Tesla (T)   B. Vêbe (Wb)   C. Henri (H)   D. Ampe (A)`,
      solution: `**Đáp án đúng: B.**\nTừ thông $\\Phi = BS\\cos\\alpha$ có đơn vị là Vêbe (Wb).`,
      keyFormulasOrHints: ['1 Wb = 1 T·m²']
    },
    {
      number: 'Câu 9 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Suất điện động cảm ứng xuất hiện trong một mạch kín tỉ lệ với đại lượng nào sau đây?\nA. Từ thông ban đầu   B. Tốc độ biến thiên từ thông qua mạch   C. Điện trở của mạch   D. Cường độ dòng điện cực đại`,
      solution: `**Đáp án đúng: B.**\nTheo định luật Faraday: $|e_c| = \\left|\\frac{\\Delta \\Phi}{\\Delta t}\\right|$.`,
      keyFormulasOrHints: ['Định luật Faraday: e_c = -ΔΦ/Δt']
    },
    {
      number: 'Câu 10 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Hạt nhân nguyên tử $_{92}^{235}\\text{U}$ có số proton và số neutron lần lượt là:\nA. $92$ và $235$   B. $235$ và $92$   C. $92$ và $143$   D. $143$ và $92$`,
      solution: `**Đáp án đúng: C.**\nSố proton $Z = 92$, số neutron $N = A - Z = 235 - 92 = 143$.`,
      keyFormulasOrHints: ['A = Z + N']
    },
    {
      number: 'Câu 11 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Một chất phóng xạ có chu kỳ bán rã $T$. Sau khoảng thời gian $t = 2T$, phần trăm số hạt nhân ban đầu còn lại chưa bị phân rã là:\nA. $50\\%$   B. $25\\%$   C. $12{,}5\\%$   D. $75\\%$`,
      solution: `**Đáp án đúng: B.**\n$N = N_0 \\cdot 2^{-t/T} = N_0 \\cdot 2^{-2} = 0{,}25 N_0 = 25\\%$.`,
      keyFormulasOrHints: ['N = N_0 · 2^(-t/T)']
    },
    {
      number: 'Câu 12 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Trong các tia sau, tia nào KHÔNG bị lệch trong điện trường và từ trường?\nA. Tia $\\alpha$   B. Tia $\\beta^+$   C. Tia $\\beta^-$   D. Tia $\\gamma$`,
      solution: `**Đáp án đúng: D.**\nTia $\\gamma$ là sóng điện từ có bước sóng rất ngắn, không mang điện tích nên không bị lệch trong điện trường và từ trường.`,
      keyFormulasOrHints: ['Tia γ là photon điện từ trung hòa điện']
    },
    {
      number: 'Câu 13 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Một con lắc đơn chiều dài $l = ${lPend}\\text{ m}$ dao động điều hòa tại nơi có gia tốc rơi tự do $g = 10\\text{ m/s}^2$, lấy $\\pi^2 \\approx 10$. Chu kỳ dao động nhỏ của con lắc là:\nA. $${(2 * Math.sqrt(lPend)).toFixed(1)}\\text{ s}$   B. $${Math.sqrt(lPend).toFixed(1)}\\text{ s}$   C. $${(4 * Math.sqrt(lPend)).toFixed(1)}\\text{ s}$   D. $${(0.5 * Math.sqrt(lPend)).toFixed(2)}\\text{ s}$`,
      solution: `**Đáp án đúng: A.**\n$T = 2\\pi\\sqrt{\\frac{l}{g}} \\approx 2\\sqrt{l} = 2\\sqrt{${lPend}} = ${(2 * Math.sqrt(lPend)).toFixed(1)}\\text{ s}$.`,
      keyFormulasOrHints: ['T = 2π·sqrt(l/g)'],
      simulationLink: { type: 'physics', targetId: 'pendulum', label: 'Mô phỏng Con lắc đơn' }
    },
    {
      number: 'Câu 14 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Một sóng cơ có tần số $f = ${fWave}\\text{ Hz}$ truyền trong môi trường với tốc độ $v = ${vWave}\\text{ cm/s}$. Bước sóng $\\lambda$ của sóng này là:\nA. $${lambdaCm}\\text{ cm}$   B. $${lambdaCm * 2}\\text{ cm}$   C. $${(fWave / 2).toFixed(1)}\\text{ cm}$   D. $${vWave}\\text{ cm}$`,
      solution: `**Đáp án đúng: A.**\n$\\lambda = \\frac{v}{f} = \\frac{${vWave}}{${fWave}} = ${lambdaCm}\\text{ cm}$.`,
      keyFormulasOrHints: ['λ = v / f']
    },
    {
      number: 'Câu 15 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Điện áp xoay chiều $u = ${uRms}\\sqrt{2}\\cos(100\\pi t)\\text{ (V)}$ có giá trị hiệu dụng bằng:\nA. $${uRms}\\sqrt{2}\\text{ V}$   B. $${uRms}\\text{ V}$   C. $100\\pi\\text{ V}$   D. $${uRms / 2}\\text{ V}$`,
      solution: `**Đáp án đúng: B.**\nGiá trị hiệu dụng $U = \\frac{U_0}{\\sqrt{2}} = ${uRms}\\text{ V}$.`,
      keyFormulasOrHints: ['U = U_0 / sqrt(2)']
    },
    {
      number: 'Câu 16 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Trong mạch điện xoay chiều chỉ có cuộn cảm thuần có độ tự cảm $L$, cường độ dòng điện tức thời $i$ biến đổi như thế nào so với điện áp $u$ ở hai đầu cuộn cảm?\nA. Cùng pha   B. Ngược pha   C. Trễ pha $\\frac{\\pi}{2}$   D. Sớm pha $\\frac{\\pi}{2}$`,
      solution: `**Đáp án đúng: C.**\nTrong mạch chỉ có cuộn cảm thuần, $u_L$ sớm pha $\\pi/2$ so với $i$, hay $i$ trễ pha $\\pi/2$ so với $u_L$.`,
      keyFormulasOrHints: ['Mạch chỉ có L: φ_u - φ_i = +π/2']
    },
    {
      number: 'Câu 17 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Hạt nhân nào sau đây có năng lượng liên kết riêng lớn nhất trong các hạt nhân dưới đây (bền vững nhất)?\nA. $_1^2\\text{H}$   B. $_2^4\\text{He}$   C. $_{26}^{56}\\text{Fe}$   D. $_{92}^{238}\\text{U}$`,
      solution: `**Đáp án đúng: C.**\nCác hạt nhân có số khối trung bình ($50 < A < 80$), tiêu biểu là sắt $_{26}^{56}\\text{Fe}$, có năng lượng liên kết riêng lớn nhất nên bền vững nhất.`,
      keyFormulasOrHints: ['Năng lượng liên kết riêng cực đại ở vùng Fe-56']
    },
    {
      number: 'Câu 18 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Lực Lorentz tác dụng lên một hạt điện tích $q$ chuyển động với vận tốc $\\vec{v}$ trong từ trường đều $\\vec{B}$ có phương như thế nào?\nA. Song song với $\\vec{v}$   B. Song song với $\\vec{B}$   C. Vuông góc với cả $\\vec{v}$ và $\\vec{B}$   D. Tạo với $\\vec{v}$ góc $45^\\circ$`,
      solution: `**Đáp án đúng: C.**\nLực Lorentz $\\vec{f} = q(\\vec{v} \\times \\vec{B})$ luôn vuông góc với mặt phẳng chứa $\\vec{v}$ và $\\vec{B}$, không sinh công.`,
      keyFormulasOrHints: ['F_L = |q|vB sin(α), luôn vuông góc v']
    }
  ];

  const part2: ExamQuestion[] = [
    {
      number: 'Câu 19 (Phần II - Đúng/Sai)',
      points: '1.0 điểm',
      content: `Một ấm điện có công suất có ích $P = 1000\\text{ W}$ dùng để đun $${m}\\text{ kg}$ nước ở $20^\\circ\\text{C}$ lên $100^\\circ\\text{C}$. Cho nhiệt dung riêng của nước $c = 4200\\text{ J/(kg}\\cdot\\text{K)}$.\na) Nhiệt độ của nước cần tăng thêm $\\Delta t = 80^\\circ\\text{C}$.\nb) Nhiệt lượng nước thu vào để sôi ở $100^\\circ\\text{C}$ là $${(m * 4200 * 80) / 1000}\\text{ kJ}$.\nc) Thời gian đun sôi nước là $${(m * 4200 * 80) / 1000}\\text{ giây}$.\nd) Khi nước bắt đầu sôi, nếu tiếp tục đun thì nhiệt độ nước vẫn giữ nguyên ở $100^\\circ\\text{C}$ ở áp suất chuẩn.`,
      solution: `a) **Đúng**: $\\Delta t = 100 - 20 = 80^\\circ\\text{C}$.\nb) **Đúng**: $Q = mc\\Delta t = ${m}\\cdot 4200\\cdot 80 = ${(m * 4200 * 80) / 1000}\\text{ kJ}$.\nc) **Đúng**: $t = \\frac{Q}{P} = \\frac{${m * 4200 * 80}}{1000} = ${(m * 4200 * 80) / 1000}\\text{ s}$.\nd) **Đúng**: Trong suốt quá trình sôi ở áp suất chuẩn, nhiệt độ chất lỏng không đổi.`,
      keyFormulasOrHints: ['Q = mcΔt', 't = Q / P']
    },
    {
      number: 'Câu 20 (Phần II - Đúng/Sai)',
      points: '1.0 điểm',
      content: `Một xi-lanh chứa $1\\text{ mol}$ khí lý tưởng đơn nguyên tử ở trạng thái $(1)$ có $p_1 = 10^5\\text{ Pa}$, $V_1 = 24{,}9\\text{ lít}$, nhiệt độ $T_1 = 300\\text{ K}$. Giữ thể tích không đổi và nung nóng khí đến nhiệt độ $T_2 = 600\\text{ K}$ ở trạng thái $(2)$.\na) Quá trình $1 \\to 2$ là quá trình đẳng tích.\nb) Áp suất khí ở trạng thái $(2)$ là $p_2 = 2\\cdot 10^5\\text{ Pa}$.\nc) Trong quá trình đẳng tích $1 \\to 2$, khí không thực hiện công ($A = 0$).\nd) Động năng trung bình của phân tử khí tăng gấp $4$ lần.`,
      solution: `a) **Đúng**: Thể tích không đổi.\nb) **Đúng**: $\\frac{p_2}{T_2} = \\frac{p_1}{T_1} \\implies p_2 = 2 p_1 = 2\\cdot 10^5\\text{ Pa}$.\nc) **Đúng**: $\\Delta V = 0 \\implies A = -p\\Delta V = 0$.\nd) **Sai**: $W_{\\text{đ}} = \\frac{3}{2}kT$, khi $T$ tăng gấp $2$ lần thì động năng trung bình chỉ tăng gấp $2$ lần.`,
      keyFormulasOrHints: ['Đẳng tích: p/T = const', 'A = 0 khi ΔV = 0']
    },
    {
      number: 'Câu 21 (Phần II - Đúng/Sai)',
      points: '1.0 điểm',
      content: `Một khung dây dẫn phẳng kín gồm $N = ${nTurns}$ vòng, diện tích mỗi vòng $S = 200\\text{ cm}^2 = 0{,}02\\text{ m}^2$ quay đều quanh trục đối xứng trong từ trường đều $B = 0{,}1\\text{ T}$ với tốc độ góc $\\omega = 100\\pi\\text{ rad/s}$.\na) Từ thông cực đại qua khung dây là $\\Phi_0 = NBS = ${(nTurns * 0.02 * 0.1).toFixed(2)}\\text{ Wb}$.\nb) Tần số của suất điện động xoay chiều tạo ra là $f = 50\\text{ Hz}$.\nc) Suất điện động cực đại trong khung là $E_0 = \\omega \\Phi_0$.\nd) Suất điện động hiệu dụng lớn hơn suất điện động cực đại.`,
      solution: `a) **Đúng**: $\\Phi_0 = ${nTurns}\\cdot 0{,}1\\cdot 0{,}02 = ${(nTurns * 0.02 * 0.1).toFixed(2)}\\text{ Wb}$.\nb) **Đúng**: $f = \\frac{\\omega}{2\\pi} = \\frac{100\\pi}{2\\pi} = 50\\text{ Hz}$.\nc) **Đúng**: $E_0 = \\omega N B S$.\nd) **Sai**: $E = \\frac{E_0}{\\sqrt{2}} < E_0$.`,
      keyFormulasOrHints: ['Φ_0 = NBS', 'E_0 = ωNBS']
    },
    {
      number: 'Câu 22 (Phần II - Đúng/Sai)',
      points: '1.0 điểm',
      content: `Xét phản ứng nhiệt hạch: $_1^2\\text{H} + _1^3\\text{H} \\to _2^4\\text{He} + _0^1\\text{n}$. Biết độ hụt khối tổng cộng giảm đi $\\Delta m = 0{,}0188\\text{ u}$ và $1\\text{ u} c^2 = 931{,}5\\text{ MeV}$.\na) Đây là phản ứng kết hợp hai hạt nhân nhẹ thành hạt nhân nặng hơn.\nb) Tổng số khối trước và sau phản ứng đều bằng $5$.\nc) Phản ứng này là phản ứng thu năng lượng.\nd) Năng lượng tỏa ra của mỗi phản ứng xấp xỉ $17{,}5\\text{ MeV}$.`,
      solution: `a) **Đúng**: Định nghĩa phản ứng nhiệt hạch.\nb) **Đúng**: Bảo toàn số nucleon: $2 + 3 = 4 + 1 = 5$.\nc) **Sai**: Nhiệt hạch là phản ứng tỏa năng lượng.\nd) **Đúng**: $\\Delta E = 0{,}0188 \\cdot 931{,}5 \\approx 17{,}51\\text{ MeV}$.`,
      keyFormulasOrHints: ['ΔE = Δm·c²']
    }
  ];

  const part3Short: ExamQuestion[] = [
    {
      number: 'Câu 23 (Phần III - Trả lời ngắn)',
      points: '0.25 điểm',
      content: `Tính độ biến thiên nội năng (theo đơn vị kJ) của khối khí khi truyền cho khí một nhiệt lượng $50\\text{ kJ}$ và nén khối khí bằng một công cơ học $15\\text{ kJ}$.`,
      solution: `Khí nhận nhiệt ($Q = +50\\text{ kJ}$) và nhận công ($A = +15\\text{ kJ}$):\n$$\\Delta U = A + Q = 15 + 50 = 65\\text{ kJ}.$$\n**Đáp số:** 65.`,
      keyFormulasOrHints: ['Nhận nhiệt Q > 0, nhận công A > 0']
    },
    {
      number: 'Câu 24 (Phần III - Trả lời ngắn)',
      points: '0.25 điểm',
      content: `Từ thông qua một vòng dây kín giảm đều từ $0{,}8\\text{ Wb}$ xuống $0{,}2\\text{ Wb}$ trong khoảng thời gian $\\Delta t = 0{,}15\\text{ s}$. Tính độ lớn suất điện động cảm ứng xuất hiện trong vòng dây (theo đơn vị V).`,
      solution: `$$|e_c| = \\left|\\frac{\\Delta \\Phi}{\\Delta t}\\right| = \\frac{|0{,}2 - 0{,}8|}{0{,}15} = \\frac{0{,}6}{0{,}15} = 4\\text{ V}.$$\n**Đáp số:** 4.`,
      keyFormulasOrHints: ['|e_c| = |ΔΦ / Δt|']
    }
  ];

  const originalAsPart3 = exam.questions.map((q, qIdx) => ({
    ...q,
    number: `Câu ${25 + qIdx} (Phần III - Vận dụng)`,
    points: '0.25 điểm'
  }));

  return [...part1, ...part2, ...part3Short, ...originalAsPart3];
}

function buildCSStandardFullQuestions(exam: ExamPaper, idx: number): ExamQuestion[] {
  const nArr = 8 + (idx % 5);
  const portNum = [80, 443, 21, 25][idx % 4];
  const portNames = ['HTTP (Web)', 'HTTPS (Web bảo mật)', 'FTP (Truyền tệp)', 'SMTP (Gửi thư)'];

  const part1: ExamQuestion[] = [
    {
      number: 'Câu 1 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Phát biểu nào sau đây đúng về Trí tuệ nhân tạo (AI)?\nA. AI chỉ hoạt động được khi không có dữ liệu huấn luyện.\nB. Học máy (Machine Learning) cho phép máy tính tự học quy luật từ dữ liệu mẫu.\nC. AI có thể thay thế hoàn toàn tư duy đạo đức của con người trong mọi tình huống.\nD. Mạng nơ-ron nhân tạo chỉ áp dụng cho bài toán cộng trừ số nguyên.`,
      solution: `**Đáp án đúng: B.**\nMachine Learning giúp mô hình trích xuất quy luật từ tập dữ liệu để dự đoán hoặc phân loại dữ liệu mới.`,
      keyFormulasOrHints: ['Machine Learning: học từ dữ liệu']
    },
    {
      number: 'Câu 2 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Thiết bị mạng nào hoạt động ở tầng liên kết dữ liệu để chuyển tiếp khung dữ liệu dựa trên địa chỉ MAC và kết nối các máy tính trong cùng mạng LAN?\nA. Switch   B. Modem quang   C. Repeater 1 cổng   D. Cáp đồng trục`,
      solution: `**Đáp án đúng: A.**\nSwitch ghi nhớ bảng địa chỉ MAC của các cổng để chuyển khung dữ liệu đúng đích trong mạng LAN.`,
      keyFormulasOrHints: ['Switch chuyển mạch theo địa chỉ MAC']
    },
    {
      number: 'Câu 3 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Trong mô hình mạng TCP/IP, giao thức nào dùng để phân giải tên miền (ví dụ: \`synapse.edu.vn\`) thành địa chỉ IP tương ứng?\nA. HTTP   B. DHCP   C. DNS   D. ARP`,
      solution: `**Đáp án đúng: C.**\nDNS (Domain Name System) ánh xạ tên miền dễ nhớ sang địa chỉ IP.`,
      keyFormulasOrHints: ['DNS = Domain Name System']
    },
    {
      number: 'Câu 4 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Cổng mặc định chuẩn của dịch vụ **${portNames[idx % 4]}** là cổng số mấy?\nA. 22   B. ${portNum}   C. 3306   D. 8080`,
      solution: `**Đáp án đúng: B.**\nCổng chuẩn tương ứng với ${portNames[idx % 4]} là \`${portNum}\`.`,
      keyFormulasOrHints: ['HTTP:80, HTTPS:443, FTP:21, SMTP:25']
    },
    {
      number: 'Câu 5 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Trong HTML5, thẻ nào dùng để tạo một siêu liên kết (hyperlink) dẫn tới một trang web khác?\nA. \`<link>\`   B. \`<a>\`   C. \`<nav>\`   D. \`<href>\``,
      solution: `**Đáp án đúng: B.**\nThẻ \`<a href="url">...</a>\` tạo siêu liên kết trong HTML.`,
      keyFormulasOrHints: ['<a href="...">Nhãn liên kết</a>']
    },
    {
      number: 'Câu 6 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Trong CSS, bộ chọn nào dưới đây nhắm tới tất cả các phần tử có \`class="highlight"\`?\nA. \`#highlight\`   B. \`.highlight\`   C. \`*highlight\`   D. \`highlight()\``,
      solution: `**Đáp án đúng: B.**\nDấu chấm \`.\` chọn theo class, còn dấu \`#\` chọn theo id.`,
      keyFormulasOrHints: ['.class vs #id trong CSS']
    },
    {
      number: 'Câu 7 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Trong Cơ sở dữ liệu quan hệ, khóa chính (Primary Key) bắt buộc phải thỏa mãn tính chất nào sau đây?\nA. Có thể chứa nhiều giá trị NULL.\nB. Cho phép các dòng trùng lặp nhau.\nC. Giá trị là duy nhất và không được rỗng (NOT NULL).\nD. Luôn phải có kiểu dữ liệu chuỗi văn bản.`,
      solution: `**Đáp án đúng: C.**\nKhóa chính xác định duy nhất mỗi bản ghi trong bảng, không trùng lặp và không được mang giá trị NULL.`,
      keyFormulasOrHints: ['Primary Key: UNIQUE + NOT NULL']
    },
    {
      number: 'Câu 8 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Câu lệnh SQL nào sau đây dùng để lọc các bản ghi thỏa mãn một điều kiện cho trước?\nA. \`ORDER BY\`   B. \`GROUP BY\`   C. \`WHERE\`   D. \`INSERT INTO\``,
      solution: `**Đáp án đúng: C.**\nMệnh đề \`WHERE\` lọc dữ liệu theo biểu thức logic trong \`SELECT\`, \`UPDATE\`, \`DELETE\`.`,
      keyFormulasOrHints: ['SELECT ... FROM ... WHERE ...']
    },
    {
      number: 'Câu 9 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Trong Python, đoạn mã \`len([x for x in range(1, ${nArr + 1}) if x % 2 == 0])\` trả về kết quả là bao nhiêu?\nA. $${Math.floor(nArr / 2)}$   B. $${Math.ceil(nArr / 2)}$   C. $${nArr}$   D. $${nArr - 1}$`,
      solution: `**Đáp án đúng: A.**\nCác số chẵn từ $1$ đến $${nArr}$ gồm $\\lfloor ${nArr}/2 \\rfloor = ${Math.floor(nArr / 2)}$ số.`,
      keyFormulasOrHints: ['List comprehension lọc phần tử chẵn']
    },
    {
      number: 'Câu 10 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Thuật toán Tìm kiếm nhị phân (Binary Search) trên một mảng đã sắp xếp gồm $N$ phần tử có độ phức tạp thời gian trong trường hợp xấu nhất là:\nA. $O(1)$   B. $O(\\log N)$   C. $O(N)$   D. $O(N^2)$`,
      solution: `**Đáp án đúng: B.**\nMỗi bước chia đôi khoảng tìm kiếm nên chỉ cần tối đa $\\lceil \\log_2 N \\rceil$ bước $\\implies O(\\log N)$.`,
      keyFormulasOrHints: ['Binary Search: O(log N)']
    },
    {
      number: 'Câu 11 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Cấu trúc dữ liệu nào hoạt động theo nguyên tắc **LIFO** (Vào sau ra trước)?\nA. Hàng đợi (Queue)   B. Ngăn xếp (Stack)   C. Cây nhị phân   D. Bảng băm`,
      solution: `**Đáp án đúng: B.**\nNgăn xếp (Stack) tuân theo nguyên tắc Last-In First-Out.`,
      keyFormulasOrHints: ['Stack = LIFO, Queue = FIFO']
    },
    {
      number: 'Câu 12 (Phần I - Trắc nghiệm)',
      points: '0.25 điểm',
      content: `Hành vi nào sau đây thể hiện ứng xử có văn hóa và an toàn trên không gian mạng?\nA. Chia sẻ mật khẩu cá nhân cho bạn bè dùng chung.\nB. Kiểm chứng nguồn thông tin trước khi chia sẻ và tôn trọng bản quyền số.\nC. Tự ý đăng ảnh cá nhân người khác khi chưa được đồng ý.\nD. Nhấp vào mọi liên kết rút gọn nhận qua tin nhắn lạ.`,
      solution: `**Đáp án đúng: B.**\nLuôn kiểm chứng thông tin, bảo vệ dữ liệu cá nhân và tôn trọng bản quyền số.`,
      keyFormulasOrHints: ['An toàn & Đạo đức số']
    }
  ];

  const part2: ExamQuestion[] = [
    {
      number: 'Câu 13 (Phần II - Đúng/Sai)',
      points: '1.0 điểm',
      content: `Xét hệ thống quản lý thư viện sử dụng 2 bảng CSDL quan hệ:\n\`SACH(MaSach, TenSach, NamXB)\` và \`MUON(MaPhieu, MaSach, NgayMuon)\`.\na) \`MaSach\` là khóa chính của bảng \`SACH\`.\nb) \`MaSach\` trong bảng \`MUON\` là khóa ngoại tham chiếu tới \`SACH(MaSach)\`.\nc) Câu lệnh \`SELECT TenSach FROM SACH WHERE NamXB >= 2020\` trả về tên sách xuất bản từ năm 2020 trở lại đây.\nd) Một quyển sách có thể có nhiều bản ghi mượn khác nhau trong bảng \`MUON\`, nên \`MaSach\` trong bảng \`MUON\` bắt buộc phải là duy nhất.`,
      solution: `a) **Đúng**.\nb) **Đúng**.\nc) **Đúng**.\nd) **Sai**: Trong bảng \`MUON\` có khóa chính là \`MaPhieu\`; cùng một \`MaSach\` có thể được mượn nhiều lần ở nhiều phiếu khác nhau.`,
      keyFormulasOrHints: ['Khóa ngoại (Foreign Key) & Liên kết 1-nhiều']
    },
    {
      number: 'Câu 14 (Phần II - Đúng/Sai)',
      points: '1.0 điểm',
      content: `Cho đoạn mã HTML/CSS sau:\n\`\`\`html\n<style>.card { width: 200px; padding: 10px; border: 2px solid #0ea5e9; }</style>\n<div class="card"><h1>Synapse</h1></div>\n\`\`\`\na) Với \`box-sizing: content-box\` mặc định, tổng chiều rộng hiển thị cả viền của \`.card\` là $224\\text{ px}$.\nb) Thẻ \`<h1>\` dùng để đánh dấu tiêu đề mức 1.\nc) Nếu đổi \`.card\` thành \`#card\` trong CSS thì quy tắc vẫn áp dụng cho \`<div class="card">\`.\nd) Có thể dùng thuộc tính \`display: flex\` để căn chỉnh các thẻ \`.card\` nằm ngang linh hoạt.`,
      solution: `a) **Đúng**: $200 + 2 \\cdot 10 + 2 \\cdot 2 = 224\\text{ px}$.\nb) **Đúng**.\nc) **Sai**: \`#card\` khớp với \`id="card"\`, không khớp \`class="card"\`.\nd) **Đúng**: Flexbox sắp xếp các phần tử con linh hoạt theo hàng/cột.`,
      keyFormulasOrHints: ['CSS Box Model = width + padding + border']
    },
    {
      number: 'Câu 15 (Phần II - Đúng/Sai)',
      points: '1.0 điểm',
      content: `Cho hàm Python xử lý danh sách:\n\`\`\`python\ndef mystery(a):\n    s = 0\n    for x in a:\n        if x > 0: s += x\n    return s\n\`\`\`\na) Hàm \`mystery([3, -2, 5, 0])\` trả về giá trị \`8\`.\nb) Độ phức tạp thời gian của hàm với danh sách độ dài $N$ là $O(N)$.\nc) Nếu thay \`if x > 0\` bằng \`if x % 2 == 0\`, hàm sẽ tính tổng các số lẻ.\nd) Nếu danh sách rỗng \`[]\`, hàm trả về \`0\`.`,
      solution: `a) **Đúng**: $3 + 5 = 8$.\nb) **Đúng**: Duyệt đúng một vòng lặp $N$ phần tử.\nc) **Sai**: \`x % 2 == 0\` là điều kiện chia hết cho $2$ (số chẵn).\nd) **Đúng**: Vòng lặp không chạy, trả về \`s = 0\`.`,
      keyFormulasOrHints: ['Vòng lặp for & Độ phức tạp O(N)']
    },
    {
      number: 'Câu 16 (Phần II - Đúng/Sai)',
      points: '1.0 điểm',
      content: `Trong phòng thực hành máy tính có 25 máy tính kết nối vào một Switch qua cáp UTP và được cấp phát IP tự động qua Router Wi-Fi.\na) Giao thức cấp phát địa chỉ IP động tự động là DHCP.\nb) Cáp UTP là loại cáp xoắn đôi dùng phổ biến trong mạng LAN Ethernet.\nc) Địa chỉ IPv4 \`192.168.1.300\` là một địa chỉ IPv4 hợp lệ.\nd) Router giúp kết nối mạng LAN cục bộ ra mạng Internet.`,
      solution: `a) **Đúng**: DHCP cấp phát IP động.\nb) **Đúng**.\nc) **Sai**: Mỗi octet của IPv4 chỉ có giá trị từ $0$ đến $255$, giá trị \`300\` không hợp lệ.\nd) **Đúng**.`,
      keyFormulasOrHints: ['IPv4: 4 octet từ 0..255', 'DHCP & Router']
    }
  ];

  const originalAsPart3 = exam.questions.map((q, qIdx) => ({
    ...q,
    number: `Câu ${17 + qIdx} (Phần III - Thực hành Lập trình)`,
    points: '1.0 điểm'
  }));

  return [...part1, ...part2, ...originalAsPart3];
}

export function expandExamPaperToFullQuestions(exam: ExamPaper, index: number): ExamPaper {
  if (exam.subject === 'math' && exam.track === 'chuyen') {
    const extra = buildMathChuyenExtraQuestions(exam, index);
    return {
      ...exam,
      questions: [...exam.questions, ...extra]
    };
  }
  if (exam.subject === 'math' && exam.track === 'khong_chuyen') {
    return {
      ...exam,
      questions: buildMathStandardFullQuestions(exam, index)
    };
  }
  if (exam.subject === 'physics' && exam.track === 'chuyen') {
    const extra = buildPhysicsChuyenExtraQuestions(exam, index);
    return {
      ...exam,
      questions: [...exam.questions, ...extra]
    };
  }
  if (exam.subject === 'physics' && exam.track === 'khong_chuyen') {
    return {
      ...exam,
      questions: buildPhysicsStandardFullQuestions(exam, index)
    };
  }
  if (exam.subject === 'cs' && exam.track === 'chuyen') {
    const extra = buildCSChuyenExtraQuestions(index);
    return {
      ...exam,
      questions: [...exam.questions, ...extra]
    };
  }
  if (exam.subject === 'cs' && exam.track === 'khong_chuyen') {
    return {
      ...exam,
      questions: buildCSStandardFullQuestions(exam, index)
    };
  }
  return exam;
}
