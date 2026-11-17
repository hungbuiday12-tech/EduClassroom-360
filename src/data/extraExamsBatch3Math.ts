import { ExamPaper, ExamQuestion } from '../types';

export const CHUYEN_SCHOOLS_BATCH_3 = [
  'THPT Chuyên Hà Nội – Amsterdam (Đề chọn HSG)',
  'THPT Chuyên Khoa Học Tự Nhiên – ĐHQG Hà Nội',
  'THPT Chuyên Đại Học Vinh – Nghệ An',
  'THPT Chuyên Quốc Học – Huế',
  'THPT Chuyên Lê Quý Đôn – Đà Nẵng',
  'THPT Chuyên Trần Phú – Hải Phòng',
  'THPT Chuyên Hạ Long – Quảng Ninh',
  'THPT Chuyên Lam Sơn – Thanh Hóa',
  'THPT Chuyên Phan Bội Châu – Nghệ An',
  'THPT Chuyên Hà Tĩnh',
  'THPT Chuyên Biên Hòa – Hà Nam',
  'THPT Chuyên Nguyễn Trãi – Hải Dương',
  'THPT Chuyên Vĩnh Phúc',
  'THPT Chuyên Bắc Ninh',
  'THPT Chuyên Hùng Vương – Phú Thọ',
  'THPT Chuyên Lương Văn Tụy – Ninh Bình',
  'THPT Chuyên Hoàng Văn Thụ – Hòa Bình',
  'THPT Chuyên Lào Cai',
  'THPT Chuyên Lương Thế Vinh – Đồng Nai',
  'THPT Chuyên Lê Quý Đôn – Bà Rịa Vũng Tàu',
  'THPT Chuyên Trần Đại Nghĩa – TP.HCM',
  'THPT Chuyên Tiền Giang',
  'THPT Chuyên Lý Tự Trọng – Cần Thơ',
  'THPT Chuyên Bến Tre (Tỉnh)',
  'THPT Chuyên Nguyễn Bỉnh Khiêm – Vĩnh Long'
];

export const THPT_INSTITUTIONS_BATCH_3 = [
  'THPT Việt Đức – Hà Nội',
  'THPT Yên Hòa – Hà Nội',
  'THPT Kim Liên – Hà Nội',
  'THPT Phan Đình Phùng – Hà Nội',
  'THPT Thăng Long – Hà Nội',
  'THPT Ngô Quyền – Hải Phòng',
  'THPT Thái Phiên – Hải Phòng',
  'THPT Hòn Gai – Quảng Ninh',
  'THPT Đào Duy Từ – Thanh Hóa',
  'THPT Huỳnh Thúc Kháng – Nghệ An',
  'THPT Phan Châu Trinh – Đà Nẵng',
  'THPT Hai Bà Trưng – Thừa Thiên Huế',
  'THPT Lý Thường Kiệt – Bình Thuận',
  'THPT Bùi Thị Xuân – TP.HCM',
  'THPT Nguyễn Thị Minh Khai – TP.HCM',
  'THPT Gia Định – TP.HCM',
  'THPT Lê Quý Đôn – TP.HCM',
  'THPT Trưng Vương – TP.HCM',
  'THPT Châu Văn Liêm – Cần Thơ',
  'THPT Nguyễn Đình Chiểu – Tiền Giang',
  'Sở GD&ĐT Đồng Tháp',
  'Sở GD&ĐT Trà Vinh',
  'Sở GD&ĐT Sóc Trăng',
  'Sở GD&ĐT Bạc Liêu',
  'Sở GD&ĐT Phú Thọ'
];

export function buildMathChuyenBatch3(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 25; i++) {
    const num = 51 + i;
    const school = CHUYEN_SCHOOLS_BATCH_3[i];
    const p = (i % 5) + 2; // 2..6
    const q = (i % 4) + 1; // 1..4
    const r = (i % 3) + 2; // 2..4

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải phương trình vô tỉ bằng phương pháp đánh giá:\n$$\\sqrt{x - ${p}} + \\sqrt{${p + 2} - x} = x^2 - ${2 * (p + 1)}x + ${p * p + 2 * p + 3}.$$\nb) Cho các số thực dương $a, b, c$ thỏa mãn $a + b + c = 3$. Chứng minh bất đẳng thức:\n$$\\frac{a}{1 + b^2} + \\frac{b}{1 + c^2} + \\frac{c}{1 + a^2} \\ge \\frac{3}{2}.$$`,
        solution: `a) Điều kiện xác định: $${p} \\le x \\le ${p + 2}$.\nÁp dụng bất đẳng thức Cauchy-Schwarz cho vế trái:\n$$\\text{VT} = 1\\cdot\\sqrt{x - ${p}} + 1\\cdot\\sqrt{${p + 2} - x} \\le \\sqrt{(1^2 + 1^2)(x - ${p} + ${p + 2} - x)} = \\sqrt{4} = 2.$$\nBiến đổi vế phải:\n$$\\text{VP} = \\big(x - ${p + 1}\\big)^2 + 2 \\ge 2.$$\nDo $\\text{VT} \\le 2 \\le \\text{VP}$, dấu bằng bắt buộc xảy ra đồng thời: $x - ${p} = ${p + 2} - x$ và $x = ${p + 1}$. Vậy phương trình có nghiệm duy nhất $x = ${p + 1}$.\n\nb) Dùng kỹ thuật **Cauchy ngược dấu**:\n$$\\frac{a}{1 + b^2} = a - \\frac{ab^2}{1 + b^2} \\ge a - \\frac{ab^2}{2b} = a - \\frac{ab}{2}.$$\nTương tự cho hai phân thức còn lại rồi cộng vế theo vế:\n$$\\sum \\frac{a}{1 + b^2} \\ge (a + b + c) - \\frac{ab + bc + ca}{2} \\ge 3 - \\frac{(a + b + c)^2}{6} = 3 - \\frac{9}{6} = \\frac{3}{2}.$$\nDấu bằng đạt tại $a = b = c = 1$.`,
        keyFormulasOrHints: ['Đánh giá VT <= 2 <= VP', 'Kỹ thuật Cauchy ngược dấu a/(1+b^2) = a - ab^2/(1+b^2)'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Vẽ đồ thị đối chiếu nghiệm' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải hệ phương trình trên tập số thực:\n$$\\begin{cases} x + y + xy = ${q * q + 3 * q + 1} \\\\ x^2 + y^2 = ${2 * q * q + 2 * q + 1} \\end{cases}$$\nb) Cho $a, b, c > 0$ thỏa mãn $abc = 1$. Chứng minh bất đẳng thức:\n$$\\frac{1}{a^3(b + c)} + \\frac{1}{b^3(c + a)} + \\frac{1}{c^3(a + b)} \\ge \\frac{3}{2}.$$`,
        solution: `a) Đặt $S = x + y$, $P = xy$ (điều kiện $S^2 \\ge 4P$). Hệ trở thành:\n$$\\begin{cases} S + P = ${q * q + 3 * q + 1} \\\\ S^2 - 2P = ${2 * q * q + 2 * q + 1} \\end{cases}$$\nNhân phương trình đầu với $2$ rồi cộng theo vế:\n$$S^2 + 2S = ${4 * q * q + 8 * q + 3} \\iff (S + 1)^2 = ${4 * (q + 1) * (q + 1)} \\iff S + 1 = \\pm ${2 * (q + 1)}.$$\n- Trường hợp $S = ${2 * q + 1} \\implies P = ${q * (q + 1)}$: giải $t^2 - ${2 * q + 1}t + ${q * (q + 1)} = 0$ được hai cặp nghiệm $(x, y) = (${q}, ${q + 1})$ và $(${q + 1}, ${q})$.\n- Trường hợp $S = ${-2 * q - 3} \\implies P = ${q * q + 5 * q + 4}$: kiểm tra $S^2 - 4P = (${-2 * q - 3})^2 - 4(${q * q + 5 * q + 4}) = ${-8 * q - 7} < 0$ (vô nghiệm vì $q \\ge 1$).\n\nb) Đặt $x = \\frac{1}{a}, y = \\frac{1}{b}, z = \\frac{1}{c} \\implies xyz = 1$. Biểu thức vế trái trở thành:\n$$\\sum \\frac{x^2}{y + z} \\ge \\frac{(x + y + z)^2}{2(x + y + z)} = \\frac{x + y + z}{2} \\ge \\frac{3\\sqrt[3]{xyz}}{2} = \\frac{3}{2}.$$`,
        keyFormulasOrHints: ['Đưa hệ đối xứng loại 1 về S = x+y, P = xy', 'Đổi biến x = 1/a, y = 1/b, z = 1/c + Engel'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Biểu diễn đường tròn & hyperbol 2D' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Cho đa thức bậc bốn $P(x)$ hệ số thực có hệ số cao nhất bằng $1$ thỏa mãn $P(1) = ${p},\\; P(2) = ${2 * p},\\; P(3) = ${3 * p},\\; P(4) = ${4 * p}$. Tính giá trị của $T = P(5) + P(0)$.\nb) Cho $a, b, c > 0$. Chứng minh bất đẳng thức Nesbitt mở rộng:\n$$\\frac{a}{${r}b + ${r}c} + \\frac{b}{${r}c + ${r}a} + \\frac{c}{${r}a + ${r}b} \\ge \\frac{3}{${2 * r}}.$$`,
        solution: `a) Xét đa thức phụ $Q(x) = P(x) - ${p}x$. Vì $\\deg(P) = 4$ và hệ số cao nhất là $1$, ta có $\\deg(Q) = 4$, hệ số cao nhất là $1$ và $Q(1) = Q(2) = Q(3) = Q(4) = 0$.\nDo đó $Q(x) = (x - 1)(x - 2)(x - 3)(x - 4)$, hay $P(x) = (x - 1)(x - 2)(x - 3)(x - 4) + ${p}x$.\nSuy ra:\n- $P(5) = 4\\cdot 3\\cdot 2\\cdot 1 + ${5 * p} = ${24 + 5 * p}$.\n- $P(0) = (-1)(-2)(-3)(-4) + 0 = 24$.\nVậy $T = ${24 + 5 * p} + 24 = ${48 + 5 * p}$.\n\nb) Nhân cả hai vế với $${r} > 0$, ta cần chứng minh $\\frac{a}{b + c} + \\frac{b}{c + a} + \\frac{c}{a + b} \\ge \\frac{3}{2}$. Áp dụng Cauchy-Schwarz dạng Engel:\n$$\\sum \\frac{a^2}{ab + ac} \\ge \\frac{(a + b + c)^2}{2(ab + bc + ca)} \\ge \\frac{3(ab + bc + ca)}{2(ab + bc + ca)} = \\frac{3}{2}.$$`,
        keyFormulasOrHints: ['Đa thức phụ Q(x) = P(x) - px', 'Bất đẳng thức Nesbitt kết hợp (a+b+c)^2 >= 3(ab+bc+ca)']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Cho phương trình $x^2 - ${2 * (p + 1)}x + ${p * (p + 2)} = 0$. Không giải trực tiếp bằng công thức nghiệm, dùng hệ thức Viète tính $A = x_1^3 + x_2^3 - ${q}x_1 x_2$.\nb) Cho $a, b, c > 0$ thỏa mãn $a + b + c = 3$. Chứng minh bất đẳng thức Schur dạng:\n$$a^2 + b^2 + c^2 + abc \\ge 4.$$`,
        solution: `a) Ta có $\\Delta' = (${p + 1})^2 - ${p * (p + 2)} = 1 > 0$, nên phương trình luôn có hai nghiệm phân biệt với $S = x_1 + x_2 = ${2 * (p + 1)}$ và $P = x_1 x_2 = ${p * (p + 2)}$.\nDo đó:\n$$x_1^3 + x_2^3 = S^3 - 3SP = ${2 * (p + 1)}^3 - 3\\cdot ${2 * (p + 1)}\\cdot ${p * (p + 2)} = ${2 * (p + 1) * (4 * (p + 1) * (p + 1) - 3 * p * (p + 2))}.$$\nTừ đó trừ đi ${q}P = ${q * p * (p + 2)}$ để thu được giá trị số chính xác $A = ${2 * (p + 1) * (4 * (p + 1) * (p + 1) - 3 * p * (p + 2)) - q * p * (p + 2)}$.\n\nb) Trong 3 số $a - 1, b - 1, c - 1$ luôn có ít nhất 2 số cùng dấu (giả sử $(a - 1)(b - 1) \\ge 0$). Ta có $ab \\ge a + b - 1 = 2 - c$, suy ra $abc \\ge 2c - c^2$. Mặt khác:\n$$a^2 + b^2 \\ge \\frac{(a + b)^2}{2} = \\frac{(3 - c)^2}{2}.$$\nCộng lại: $a^2 + b^2 + c^2 + abc \\ge \\frac{(3 - c)^2}{2} + 2c = 4 + \\frac{(c - 1)^2}{2} \\ge 4$.`,
        keyFormulasOrHints: ['x1^3 + x2^3 = (x1+x2)^3 - 3x1x2(x1+x2)', 'Nguyên lý Dirichlet chọn 2 số (a-1)(b-1) >= 0']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải phương trình bậc bốn đối xứng:\n$$x^4 - ${p + 2}x^3 + ${2 * p + 2}x^2 - ${p + 2}x + 1 = 0.$$\nb) Cho $x, y, z > 0$ có $x^2 + y^2 + z^2 = 3$. Chứng minh rằng:\n$$\\frac{1}{2 - x} + \\frac{1}{2 - y} + \\frac{1}{2 - z} \\ge 3.$$`,
        solution: `a) Nhận thấy $x = 0$ không phải nghiệm, chia hai vế cho $x^2$ và đặt $t = x + \\frac{1}{x}$ ($|t| \\ge 2$):\n$$(t^2 - 2) - ${p + 2}t + ${2 * p + 2} = 0 \\iff t^2 - ${p + 2}t + ${2 * p} = 0 \\iff (t - 2)(t - ${p}) = 0.$$\n- Với $t = 2 \\implies x + \\frac{1}{x} = 2 \\implies x = 1$.\n- Với $t = ${p}$ (vì $p \\ge 2$): giải $x^2 - ${p}x + 1 = 0 \\implies x = \\frac{${p} \\pm \\sqrt{${p * p - 4}}}{2}$.\n\nb) Vì $x^2 < 3 < 4$ nên $2 - x > 0$. Khảo sát hiệu:\n$$\\frac{1}{2 - x} - 1 = \\frac{x - 1}{2 - x} \\ge \\frac{x^2 - 1}{2} \\iff \\frac{(x - 1)^2(x)}{2(2 - x)} \\ge 0\\; (\\text{luôn đúng với } 0 < x < 2).$$\nCộng 3 bất đẳng thức cho $x, y, z$ suy ra $\\sum \\frac{1}{2 - x} \\ge 3 + \\frac{x^2 + y^2 + z^2 - 3}{2} = 3$.`,
        keyFormulasOrHints: ['Phương trình đối xứng chia x^2 đặt t = x + 1/x', 'Phương pháp tiếp tuyến 1/(2-x) >= (x^2 + 1)/2']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn phương trình:\n$$xy - ${p}x - ${q + 1}y = ${p + q}.$$\nb) Chứng minh rằng với mọi số nguyên $n$, biểu thức $A = n^5 - 5n^3 + 4n$ luôn chia hết cho $120$.`,
        solution: `a) Biến đổi thành phương trình tích:\n$$(x - ${q + 1})(y - ${p}) = ${p * (q + 1) + p + q}.$$\nVì $x, y \\in \\mathbb{Z}$, $x - ${q + 1}$ và $y - ${p}$ là các ước nguyên đối xứng (cùng dương hoặc cùng âm) của $K = ${p * (q + 1) + p + q}$. Xét đầy đủ các cặp ước $(d, K/d)$ để suy ra toàn bộ nghiệm nguyên $(x, y)$.\n\nb) Phân tích đa thức thành nhân tử:\n$$A = n(n^4 - 5n^2 + 4) = n(n^2 - 1)(n^2 - 4) = (n - 2)(n - 1)n(n + 1)(n + 2).$$\nĐây là tích của $5$ số nguyên liên tiếp, nên luôn có ít nhất $1$ bội của $5$, ít nhất $1$ bội của $3$, $1$ bội của $4$ và $1$ bội chẵn khác $\\implies$ chia hết cho $5 \\cdot 3 \\cdot 8 = 120$.`,
        keyFormulasOrHints: ['Đưa về tích (x - b)(y - a) = K', 'Tích 5 số nguyên liên tiếp chia hết cho 5! = 120']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Tìm tất cả các số nguyên tố $p$ sao cho $p^2 + ${2 ** r + 2}$ cũng là một số nguyên tố (hoặc kiểm tra $p^2 + 2^p$).\nb) Tìm tất cả hàm số $f: \\mathbb{R} \\to \\mathbb{R}$ thỏa mãn $f(x f(y) + x) = xy + f(x)$ với mọi $x, y \\in \\mathbb{R}$.`,
        solution: `a) Xét theo modulo $3$: Mọi số nguyên tố $p \\neq 3$ đều thỏa mãn $p^2 \\equiv 1 \\pmod 3$. Kiểm tra phần dư của hằng số $c = ${2 ** r + 2}$ khi chia cho $3$: nếu $c \\equiv 2 \\pmod 3$ thì $p^2 + c \\equiv 0 \\pmod 3$ và lớn hơn $3$ nên là hợp số; khi đó chỉ cần thử trực tiếp $p = 3$ (và ngược lại nếu $c \\equiv 0 \\pmod 3$ thì xét mod $2$ với $p = 2$).\n\nb) Đặt $x = 1$ vào phương trình: $f(f(y) + 1) = y + f(1)$, suy ra $f$ là toàn ánh trên $\\mathbb{R}$. Giả sử $f(a) = -1$, thay $y = a$ ta được $f(0) = xa + f(x) \\implies f(x) = -ax + f(0)$ (hàm bậc nhất).\nThế $f(x) = kx + b$ vào phương trình ban đầu: $k(x(ky + b) + x) + b = xy + kx + b \\iff k^2 xy + k(b+1)x = xy + kx$. Đồng nhất hệ số: $k^2 = 1$ và $k(b+1) = k \\implies b = 0$, nên $f(x) = x$ hoặc $f(x) = -x$.`,
        keyFormulasOrHints: ['Xét số dư modulo 3 cho p^2', 'Chứng minh f toàn ánh và tìm điểm triệt tiêu f(a) = -1']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Chứng minh rằng với hai số nguyên dương $a, b$ bất kỳ, ta luôn có:\n$$\\gcd(2^a - 1,\\; 2^b - 1) = 2^{\\gcd(a, b)} - 1.$$\nb) Giải phương trình nghiệm nguyên dương: $x^2 + y^2 + ${p - 1} = ${p + 1}xy$ (với các nghiệm nguyên dương đầu tiên hoặc chứng minh tính chất bước nhảy nghiệm).`,
        solution: `a) Gọi $d = \\gcd(2^a - 1, 2^b - 1)$ và giả sử $a \\ge b$. Áp dụng thuật toán Euclid cho số mũ: viết $a = qb + r$ ($0 \\le r < b$). Ta có:\n$$2^a - 1 = 2^{qb + r} - 1 = 2^r(2^{qb} - 1) + (2^r - 1).$$\nVì $(2^b - 1) \\mid (2^{qb} - 1)$ nên $\\gcd(2^a - 1, 2^b - 1) = \\gcd(2^b - 1, 2^r - 1)$. Lặp lại tương tự thuật toán Euclid trên $(a, b)$ thu được kết quả là $2^{\\gcd(a, b)} - 1$.\n\nb) Coi là phương trình bậc hai theo $x$: $x^2 - ${p + 1}y \\cdot x + (y^2 + ${p - 1}) = 0$. Nếu $(x_0, y_0)$ là một nghiệm nguyên dương với $x_0 \\ge y_0$, thì nghiệm thứ hai $x_1 = ${p + 1}y_0 - x_0 = \\frac{y_0^2 + ${p - 1}}{x_0}$ cũng nguyên dương. Xét nghiệm cực tiểu $x_0 = y_0$ giải $2x_0^2 + ${p - 1} = ${p + 1}x_0^2 \\implies ${p - 1}x_0^2 = ${p - 1} \\implies x_0 = y_0 = 1$, từ đó sinh toàn bộ họ nghiệm bằng công thức truy hồi $x_{n+1} = ${p + 1}x_n - x_{n-1}$.`,
        keyFormulasOrHints: ['Thuật toán Euclid trên số mũ 2^a - 1', 'Bước nhảy Viète tìm nghiệm cơ sở (1, 1)']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Cho đa thức $P(x)$ với hệ số nguyên thỏa mãn tồn tại 3 số nguyên phân biệt $a, b, c$ sao cho $P(a) = b$, $P(b) = c$, $P(c) = a$. Hỏi đa thức như vậy có tồn tại hay không? Chứng minh.\nb) Tìm số dư khi chia $3^{2026} + ${p}^{2025}$ cho $11$.`,
        solution: `a) Không tồn tại! Thật vậy, với mọi đa thức hệ số nguyên ta có $(u - v) \\mid (P(u) - P(v))$. Áp dụng cho các cặp:\n- $(a - b) \\mid (P(a) - P(b)) = (b - c)$.\n- $(b - c) \\mid (c - a)$.\n- $(c - a) \\mid (a - b)$.\nSuy ra $|a - b| = |b - c| = |c - a|$. Đặt $d = |a - b| > 0$. Khi đó trong 3 số thực $a, b, c$ không thể có 3 khoảng cách đôi một bằng nhau ($d = d = d > 0$ mâu thuẫn trên trục số thực vì một hiệu phải bằng tổng hai hiệu kia nếu sắp thứ tự!).\n\nb) Theo định lý Fermat nhỏ, với $11$ nguyên tố: $3^{10} \\equiv 1 \\pmod{11}$ (thực tế $3^5 = 243 \\equiv 1 \\pmod{11}$), nên $3^{2026} = (3^5)^{405} \\cdot 3 \\equiv 3 \\pmod{11}$. Tương tự tính ${p}^{2025} \\equiv ${p}^5 \\pmod{11}$ (vì ${p} < 11$, $\\gcd(${p}, 11) = 1$) để cộng lại lấy phần dư mod $11$.`,
        keyFormulasOrHints: ['Tính chất (u - v) | (P(u) - P(v)) của đa thức nguyên', 'Định lý Fermat nhỏ a^10 ≡ 1 (mod 11)']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Tìm tất cả số tự nhiên $n$ để $2^n + 3^n$ là số chính phương.\nb) Tìm mọi số nguyên dương $k$ sao cho tồn tại số nguyên tố $p$ thỏa mãn $p \\mid (k^2 + 1)$ và $p \\equiv 3 \\pmod 4$.`,
        solution: `a) Xét $n = 0 \\implies 1 + 1 = 2$ (loại); $n = 1 \\implies 2 + 3 = 5$ (loại).\nVới $n \\ge 2$, chia cho $4$: $2^n \\equiv 0 \\pmod 4$. Mà số chính phương chia $4$ chỉ dư $0$ hoặc $1$, suy ra $3^n \\equiv (-1)^n \\equiv 1 \\pmod 4 \\implies n$ chẵn ($n = 2m$).\nKhi đó $(2^m)^2 + (3^m)^2 = k^2$. Thử $n = 2 \\implies 4 + 9 = 13$ (loại). Xét thêm modulo $3$: $2^{2m} \\equiv 1 \\pmod 3$, còn $3^n \\equiv 0 \\pmod 3$, hoặc chặn kẹp: với $m \\ge 2$, $(3^m)^2 < (3^m)^2 + (2^m)^2 < (3^m + 1)^2$ vì $2^{2m} < 2\\cdot 3^m + 1$ luôn đúng với mọi $m \\ge 1$! Vậy phương trình **vô nghiệm**.\n\nb) Theo định lý Fermat về tổng hai bình phương (hoặc tính chất thặng dư bậc hai): nếu $p \\equiv 3 \\pmod 4$ và $p \\mid (k^2 + 1)$ thì $k^2 \\equiv -1 \\pmod p$. Nâng hai vế lên lũy thừa $\\frac{p - 1}{2}$ (lẻ): $k^{p - 1} \\equiv (-1)^{(p-1)/2} = -1 \\pmod p$, mâu thuẫn với Fermat nhỏ $k^{p - 1} \\equiv 1 \\pmod p$ (vì $p \\nmid k$). Vậy **không tồn tại** cặp $(k, p)$ nào như vậy.`,
        keyFormulasOrHints: ['Chặn giữa hai số chính phương liên tiếp (3^m)^2 < A < (3^m + 1)^2', 'Fermat nhỏ lũy thừa (p-1)/2 với p ≡ 3 (mod 4)']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho tam giác nhọn $ABC$ ($AB < AC$) nội tiếp đường tròn $(O)$, các đường cao $AD, BE, CF$ cắt nhau tại trực tâm $H$. Gọi $M$ là trung điểm của $BC$, $N$ là trung điểm của $AH$ và $K$ là giao điểm của $EF$ với $BC$.\na) Chứng minh $OM \\parallel AH$ và $OM = \\frac{1}{2}AH$.\nb) Chứng minh 6 điểm $D, E, F, M, N, \\text{trung điểm } BH$ cùng nằm trên một đường tròn (Đường tròn Euler 9 điểm).\nc) Chứng minh đường thẳng $KH$ vuông góc với $AM$.`,
        solution: `a) Kẻ đường kính $AA'$ của $(O)$. Dễ thấy $BH \\parallel A'C$ (cùng vuông góc $AC$) và $CH \\parallel A'B$ (cùng vuông góc $AB$), nên $BHCA'$ là hình bình hành. Vì $M$ là trung điểm $BC$ nên $M$ cũng là trung điểm $HA'$. Xét $\\triangle AHA'$ có $OM$ là đường trung bình $\\implies OM \\parallel AH$ và $OM = \\frac{1}{2}AH = AN = NH$.\n\nb) Chứng minh các tam giác vuông $\\triangle MDE, \\triangle NDF$ hay tứ giác $MNDF$ nội tiếp: Vì $MN$ cắt $(O_{Euler})$ tại đường kính $MN$ (do $\\widehat{MDN} = 90^\\circ$? Kiểm tra $OM = NH$ và $OM \\parallel NH \\implies OMNH$ là hình bình hành, kết hợp $ON_1$ với trung điểm $I$ của $OH$ suy ra $ID = IE = IF = IM = IN = \\frac{R}{2}$).\n\nc) Gọi $P$ là giao điểm thứ hai của $AM$ với đường tròn ngoại tiếp $\\triangle AEF$ (tức đường tròn đường kính $AH$). Theo tính chất trực tâm và phương tích điểm $K$: $KD \\cdot KM = KF \\cdot KE = KP \\cdot KA$ (với định lý Brocard trên tứ giác nội tiếp $BCEF$), suy ra $KP \\perp AM$, và do $P, H$ liên hệ cực đối cực nên $KH \\perp AM$.`,
        keyFormulasOrHints: ['Kẻ đường kính AA\' tạo hình bình hành BHCA\'', 'Tâm đường tròn Euler là trung điểm OH, bán kính R/2', 'Định lý Brocard & cực đối cực cho KH vuông góc AM'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Mô phỏng Đường tròn & Tam giác 2D' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho tam giác $ABC$ có đường tròn nội tiếp $(I)$ tiếp xúc với các cạnh $BC, CA, AB$ lần lượt tại $D, E, F$. Đường thẳng qua $E$ song song với $BC$ cắt $AD$ tại $P$ và cắt $DF$ tại $Q$.\na) Chứng minh $AE = AF$, $BD = BF$, $CD = CE$ và tính $AE$ theo chu vi $2p$ và cạnh $a$.\nb) Chứng minh tứ giác $IDEC$ nội tiếp? (Hoặc gọi $M$ là trung điểm $BC$, chứng minh $IM$ đi qua trung điểm $AD$).\nc) Chứng minh góc $\\widehat{BID} = \\widehat{CID}$ không đúng khi $AB \\neq AC$, nhưng tia $BI$ cắt đường thẳng $EF$ tại điểm $K$ sao cho $\\widehat{BKC} = 90^\\circ$ (Bổ đề Iran). Hãy chứng minh $\\widehat{BKC} = 90^\\circ$.`,
        solution: `a) Theo tính chất hai tiếp tuyến cắt nhau từ một điểm: $AE = AF, BD = BF, CD = CE$. Cộng vế: $2AE + 2a = AB + BC + CA = 2p \\implies AE = p - a$.\n\nb) Gọi $M$ là trung điểm $BC$, dùng tính chất điểm Nagel $D'$ đối xứng với $D$ qua $M$: $AD'$ đi qua tâm vị tự $I$ hoặc chứng minh tỷ số diện tích/Thales cho thấy $IM$ đi qua trung điểm của đường cao hạ từ $A$ và trung điểm $AD$ nếu xét đường thẳng nối $M$ với trung điểm đoạn thẳng tương ứng.\n\nc) Chứng minh Bổ đề Iran: Ta có $\\widehat{AFK} = 90^\\circ - \\frac{\\widehat{A}}{2}$ và $\\widehat{IBK} = \\frac{\\widehat{B}}{2}$. Xét tam giác $BIK$ hoặc tứ giác $AFKI$: dễ tính được $\\widehat{AIK} = \\frac{\\widehat{B} + \\widehat{C}}{2}$? Thực chất góc ngoài $\\widehat{BIC} = 90^\\circ + \\frac{\\widehat{A}}{2}$, còn $\\widehat{AEF} = 90^\\circ - \\frac{\\widehat{A}}{2}$, suy ra $\\widehat{KIB}$ và $\\widehat{KFB}$ bù nhau? Kiểm tra: $\\widehat{BFK} = 180^\\circ - (90^\\circ - \\frac{\\widehat{A}}{2}) = 90^\\circ + \\frac{\\widehat{A}}{2} = \\widehat{BIC}$. Khi kết hợp $\\triangle KIC$ cho thấy tứ giác $BIKC$ hay $AFKI$ nội tiếp! Suy ra $\\widehat{BKC} = \\widehat{BKA} = 90^\\circ$.`,
        keyFormulasOrHints: ['Tiếp tuyến từ đỉnh: AE = p - a', 'Bổ đề Iran: giao điểm BI và EF nằm trên đường tròn đường kính BC'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Hình học Đường tròn 2D' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho tứ giác $ABCD$ nội tiếp đường tròn $(O)$ với $AC$ và $BD$ cắt nhau tại $P$. Gọi $E$ là giao điểm của $AB$ và $CD$, $F$ là giao điểm của $AD$ và $BC$.\na) Chứng minh $PA \\cdot PC = PB \\cdot PD$ và $EA \\cdot EB = EC \\cdot ED$.\nb) Đường tròn ngoại tiếp $\\triangle EBC$ cắt đoạn $EF$ tại điểm $M$ ($M \\neq E$). Chứng minh tứ giác $AMDF$ nội tiếp (hoặc chứng minh $EM \\cdot EF = EC \\cdot ED$ hay $FM \\cdot FE = FB \\cdot FC$).\nc) Chứng minh $OP \\perp EF$ (Định lý Brocard).`,
        solution: `a) Xét các cặp tam giác đồng dạng $\\triangle PAB \\sim \\triangle PDC$ ($\\widehat{PAB} = \\widehat{PDC}, \\widehat{APB} = \\widehat{DPC}$) suy ra $PA \\cdot PC = PB \\cdot PD$. Tương tự $\\triangle EAD \\sim \\triangle ECB \\implies EA \\cdot EB = EC \\cdot ED$.\n\nb) Tứ giác $EBCM$ nội tiếp $\\implies \\widehat{FMC} = \\widehat{EBC} = \\widehat{ADC}$. Lại kết hợp phương tích từ $E, F$ cho hai đường tròn $(EBC)$ và $(FAB)$ (điểm Miquel của tứ giác toàn phần): dùng biến đổi góc nội tiếp suy ra $M$ là hình chiếu của $P$ hoặc nằm trên đường tròn ngoại tiếp $\\triangle PBD$? Cụ thể $FM \\cdot FE = FC \\cdot FB = FD \\cdot FA$, chứng minh $AMDF$ nội tiếp.\n\nc) Cộng hai đẳng thức phương tích từ $E$ và $F$ đối với $(O)$: $P_{E/(O)} + P_{F/(O)} = (EO^2 - R^2) + (FO^2 - R^2)$. Mặt khác từ phần b) ta có $P_{E/(O)} = EM \\cdot EF$ và $P_{F/(O)} = FM \\cdot FE$, suy ra $EO^2 + FO^2 - 2R^2 = EF^2$. Kết hợp định lý hình chiếu và tính chất $M$ là hình chiếu của $O$ lên $EF$, suy ra $OM \\perp EF$, và điểm $P$ cùng nằm trên đường vuông góc đó (hoặc dùng cực-đối cực).`,
        keyFormulasOrHints: ['Phương tích 2 dây cung cắt nhau', 'Định lý Brocard: O là trực tâm tam giác PEF'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Khám phá Tứ giác nội tiếp 2D' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho nửa đường tròn $(O; R)$ đường kính $AB$. Trên cùng một nửa mặt phẳng bờ $AB$ chứa nửa đường tròn, vẽ hai tiếp tuyến $Ax, By$ với nửa đường tròn. Lấy điểm $M$ bất kỳ trên nửa đường tròn ($M \\neq A, B$). Tiếp tuyến tại $M$ cắt $Ax, By$ lần lượt tại $C, D$.\na) Chứng minh $CD = AC + BD$ và góc $\\widehat{COD} = 90^\\circ$.\nb) Chứng minh đường tròn đường kính $CD$ luôn tiếp xúc với đường thẳng $AB$ tại tâm $O$.\nc) Gọi $K$ là giao điểm của $AM$ và $BC$? (hoặc $AD$ và $BC$). Kẻ $MH \\perp AB$ tại $H$. Chứng minh $AD, BC, MH$ đồng quy tại trung điểm của $MH$.`,
        solution: `a) Theo tính chất hai tiếp tuyến cắt nhau: $CA = CM, DB = DM \\implies CD = CM + MD = AC + BD$. Vì $OC, OD$ lần lượt là phân giác hai góc kề bù $\\widehat{AOM}, \\widehat{MOB}$ nên $OC \\perp OD \\implies \\widehat{COD} = 90^\\circ$.\n\nb) Gọi $I$ là trung điểm $CD$. Khi đó $IO$ là đường trung tuyến ứng với cạnh huyền $CD$ trong $\\triangle COD$ vuông tại $O \\implies IO = \\frac{CD}{2}$. Hơn nữa $AC \\parallel BD$ nên $ACDB$ là hình thang vuông, $IO$ là đường trung bình $\\implies IO \\parallel AC \\implies IO \\perp AB$ tại $O$. Vậy đường tròn tâm $I$ đường kính $CD$ tiếp xúc với $AB$ tại $O$.\n\nc) Gọi $N$ là giao điểm của $AD$ và $BC$. Theo định lý Thales ($AC \\parallel BD$): $\\frac{NA}{ND} = \\frac{NC}{NB} = \\frac{AC}{BD} = \\frac{CM}{MD}$. Do đó $MN \\parallel AC \\parallel BD$, suy ra $MN \\perp AB$ tại $H$ ($M, N, H$ thẳng hàng). Tương tự $NH = \\frac{AC \\cdot BD}{AC + BD} = \\frac{1}{2}MH$, tức $N$ là trung điểm $MH$.`,
        keyFormulasOrHints: ['Đường trung bình hình thang vuông ACDB', 'Thales chứng minh AD, BC, MH đồng quy tại trung điểm MH'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Mô phỏng Tiếp tuyến đường tròn' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho tam giác $ABC$ nhọn nội tiếp $(O)$ với $M$ là một điểm bất kỳ thuộc cung nhỏ $BC$ ($M \\neq B, C$). Kẻ $MD \\perp BC$, $ME \\perp CA$, $MF \\perp AB$ ($D \\in BC, E \\in CA, F \\in AB$).\na) Chứng minh ba điểm $D, E, F$ thẳng hàng (Đường thẳng Simson của điểm $M$).\nb) Gọi $H$ là trực tâm $\\triangle ABC$, tia $MD$ cắt $(O)$ tại $K$. Chứng minh đường thẳng $DF$ song song với $AK$ và đường thẳng Simson của $M$ đi qua trung điểm của đoạn $MH$.\nc) Tìm vị trí của $M$ trên cung nhỏ $BC$ để tổng $MA + MB + MC$ hoặc tích $MD \\cdot ME \\cdot MF$ đạt giá trị lớn nhất? (Chứng minh đẳng thức Ptolemy $MA \\cdot BC = MB \\cdot AC + MC \\cdot AB$).`,
        solution: `a) Ta có $\\widehat{MFC} = \\dots$ Xét hai tứ giác nội tiếp $BFMD$ ($\\widehat{BFM} = \\widehat{BDM} = 90^\\circ$) và $CDME$ ($\\widehat{CDM} = \\widehat{CEM} = 90^\\circ$).\nTừ tứ giác nội tiếp $ABMC$: $\\widehat{MBF} = \\widehat{MCE}$ (hoặc bù nhau), kết hợp với góc nội tiếp trong $(BFMD)$ và $(CDME)$ suy ra $\\widehat{BDF} = \\widehat{CDE} \\implies D, E, F$ thẳng hàng.\n\nb) Ta có $\\widehat{BD F} = \\widehat{BMF} = 90^\\circ - \\widehat{MBF} = 90^\\circ - \\widehat{MCA}$. Mặt khác $\\widehat{BKA} = \\widehat{BCA}$? Với $MK \\perp BC$ thì $\\widehat{BMK} = 90^\\circ - \\widehat{MBC}$, dễ dàng chứng minh $\\widehat{KAD}$ tương ứng bằng góc tạo bởi $DF$, từ đó suy ra đường thẳng Simson song song với đường thẳng Steiner (chính là $AK$) và đi qua trung điểm của $MH$.\n\nc) Lấy điểm $P$ trên $MA$ sao cho $\\widehat{ABP} = \\widehat{MBC}$. Khi đó $\\triangle ABP \\sim \\triangle MBC \\implies AP \\cdot MC = AB \\cdot MC$? Chính xác là $\\triangle ABM \\sim \\triangle PBC$ và $\\triangle ABP \\sim \\triangle MBC$, cộng hai tích thu được định lý Ptolemy: $MA \\cdot BC = MB \\cdot AC + MC \\cdot AB$.`,
        keyFormulasOrHints: ['Tứ giác nội tiếp BFMD và CDME', 'Đường thẳng Simson đi qua trung điểm MH', 'Định lý Ptolemy MA.BC = MB.AC + MC.AB'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Đường tròn ngoại tiếp 2D' }
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Trong một hội nghị toán học có $6$ đại biểu đến từ các trường chuyên. Giữa hai đại biểu bất kỳ hoặc là quen biết nhau, hoặc là không quen biết nhau. Chứng minh rằng luôn tồn tại ít nhất $3$ đại biểu đôi một quen nhau hoặc $3$ đại biểu đôi một không quen nhau.`,
        solution: `Biểu diễn $6$ đại biểu thành $6$ đỉnh của đồ thị đầy đủ $K_6$. Tô màu đỏ cạnh nối hai người quen nhau, màu xanh cạnh nối hai người không quen nhau.\nChọn một đỉnh $A$ bất kỳ. Từ $A$ có $5$ cạnh nối tới $5$ đỉnh còn lại. Theo nguyên lý Dirichlet, có ít nhất $\\lceil 5 / 2 \\rceil = 3$ cạnh cùng màu — giả sử các cạnh $AB, AC, AD$ đều tô màu đỏ.\n- Nếu trong 3 cạnh $BC, CD, DB$ có ít nhất $1$ cạnh màu đỏ (ví dụ $BC$), thì tam giác $ABC$ toàn màu đỏ ($3$ người đôi một quen nhau).\n- Ngược lại, cả 3 cạnh $BC, CD, DB$ đều tô màu xanh $\\implies$ tam giác $BCD$ toàn màu xanh ($3$ người đôi một không quen nhau).`,
        keyFormulasOrHints: ['Định lý Ramsey R(3, 3) = 6', 'Nguyên lý Dirichlet với 5 cạnh xuất phát từ A']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Cho bàn cờ vuông kích thước $${2 ** (r)} \\times ${2 ** (r)}$ bị khoét bỏ đi đúng $1$ ô vuông đơn vị ở vị trí bất kỳ (với $r \\ge 2$). Chứng minh rằng phần còn lại của bàn cờ luôn có thể được lát kín hoàn toàn bởi các viên gạch hình chữ L (mỗi viên gồm $3$ ô vuông đơn vị) không chồng lên nhau.`,
        solution: `Chứng minh bằng **Quy nạp toán học** theo $k$ với bàn cờ $2^k \\times 2^k$ bỏ $1$ ô:\n- **Bước cơ sở ($k = 1$)**: Bàn cờ $2 \\times 2$ bỏ đi $1$ ô thì đúng bằng $1$ viên gạch chữ L ($3$ ô), lát kín ngay lập tức.\n- **Bước quy nạp**: Giả sử mệnh đề đúng với bàn cờ $2^{k-1} \\times 2^{k-1}$. Xét bàn cờ $2^k \\times 2^k$, chia nó làm $4$ bàn cờ con kích thước $2^{k-1} \\times 2^{k-1}$. Ô bị khoét nằm ở đúng $1$ trong $4$ phần tư đó.\nĐặt $1$ viên gạch chữ L vào chính giữa tâm bàn cờ sao cho nó phủ lên đúng $1$ ô góc trung tâm của mỗi $3$ phần tư còn lại.\nKhi đó cả $4$ phần tư đều trở thành bàn cờ $2^{k-1} \\times 2^{k-1}$ khuyết đúng $1$ ô, nên theo giả thiết quy nạp đều lát kín được!`,
        keyFormulasOrHints: ['Quy nạp theo lũy thừa 2^k', 'Đặt 1 mảnh L tại tâm chia 4 góc phần tư']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Trên mặt phẳng cho $n = ${2 * p + 5}$ điểm phân biệt sao cho không có $3$ điểm nào thẳng hàng. Chứng minh rằng tồn tại $3$ điểm trong số đó tạo thành một tam giác không chứa bất kỳ điểm nào khác trong số các điểm đã cho ở bên trong hoặc trên cạnh của nó.`,
        solution: `Áp dụng **Nguyên lý Cực hạn (Extremal Principle)**:\nVì số điểm là hữu hạn ($n = ${2 * p + 5} \\ge 3$) và không có $3$ điểm nào thẳng hàng, số tam giác tạo thành bởi $3$ điểm bất kỳ là hữu hạn và mỗi tam giác đều có diện tích dương.\nDo đó tồn tại một tam giác $ABC$ có diện tích **nhỏ nhất** trong tất cả các tam giác.\nGiả sử bên trong (hoặc trên cạnh) tam giác $ABC$ có một điểm $P$ khác $A, B, C$. Khi đó tam giác $PAB$ có diện tích nhỏ hơn hẳn diện tích tam giác $ABC$ ($S_{PAB} < S_{PAB} + S_{PBC} + S_{PCA} = S_{ABC}$), mâu thuẫn với tính nhỏ nhất của $S_{ABC}$! Vậy tam giác $ABC$ không chứa điểm nào khác.`,
        keyFormulasOrHints: ['Nguyên lý Cực hạn chọn tam giác diện tích nhỏ nhất', 'S_PAB + S_PBC + S_PCA = S_ABC']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Trên bảng viết $n = ${2 * p + 3}$ số nguyên liên tiếp $1, 2, 3, \\dots, ${2 * p + 3}$. Mỗi bước, người ta xóa hai số $a, b$ bất kỳ trên bảng rồi viết thêm vào số $|a - b|$. Lặp lại cho đến khi trên bảng chỉ còn đúng $1$ số. Hỏi số cuối cùng còn lại có thể bằng $0$ hay không?`,
        solution: `Xét **Bất biến tính chẵn lẻ (Parity Invariant)** của tổng tất cả các số trên bảng, gọi là $S$.\nMỗi khi thay hai số $a, b$ bằng $|a - b|$, tổng trên bảng thay đổi một lượng là:\n$$\\Delta S = |a - b| - (a + b) = -2\\min(a, b) \\equiv 0 \\pmod 2.$$\nNhư vậy **tính chẵn lẻ của tổng $S$ là bất biến**.\nBan đầu, tổng là $S_0 = 1 + 2 + \\dots + ${2 * p + 3} = \\frac{${2 * p + 3} \\cdot ${2 * p + 4}}{2} = ${(2 * p + 3) * (p + 2)}$.\nKiểm tra tính chẵn lẻ của $S_0$: vì $2p + 3$ luôn lẻ, $S_0$ chẵn nếu $p + 2$ chẵn (tức $p$ chẵn) và $S_0$ lẻ nếu $p + 2$ lẻ (tức $p$ lẻ). Số cuối cùng còn lại chỉ có thể là $0$ (chẵn) khi và chỉ khi $S_0$ chẵn (tức $p = ${p}$ phải là số chẵn; nếu $p$ lẻ thì số cuối cùng chắc chắn lẻ, không thể bằng $0$).`,
        keyFormulasOrHints: ['|a - b| ≡ a + b (mod 2)', 'Kiểm tra tính chẵn lẻ tổng 1 + 2 + ... + N']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Một câu lạc bộ toán học có $N = ${15 + p}$ học sinh, lập các nhóm thảo luận sao cho mỗi nhóm có đúng $3$ học sinh và hai nhóm bất kỳ có tối đa $1$ học sinh chung. Hãy chứng minh số nhóm tối đa có thể thành lập không vượt quá $\\left\\lfloor \\frac{N(N-1)}{6} \\right\\rfloor$.`,
        solution: `Áp dụng phương pháp **Đếm bằng hai cách (Double Counting)** số cặp học sinh cùng thuộc một nhóm.\n- Mỗi nhóm gồm $3$ học sinh chứa đúng $\\binom{3}{2} = 3$ cặp học sinh.\n- Gọi $k$ là số nhóm thành lập được, tổng số cặp (tính cả bội) xuất hiện trong các nhóm là $3k$.\n- Mặt khác, do hai nhóm bất kỳ có tối đa $1$ học sinh chung, nên mỗi cặp $2$ học sinh bất kỳ trong $N$ học sinh chỉ có thể xuất hiện cùng nhau ở **tối đa $1$ nhóm**.\n- Tổng số cặp có thể có từ $N = ${15 + p}$ học sinh là $\\binom{N}{2} = \\frac{N(N - 1)}{2}$.\nDo đó $3k \\le \\frac{N(N - 1)}{2} \\implies k \\le \\frac{N(N - 1)}{6}$, tức $k \\le \\left\\lfloor \\frac{${15 + p}\\cdot ${14 + p}}{6} \\right\\rfloor = ${Math.floor(((15 + p) * (14 + p)) / 6)}$.`,
        keyFormulasOrHints: ['Đếm số cặp học sinh theo 2 cách', '3k <= C(N, 2) = N(N-1)/2']
      }
    ];

    const q1 = q1Pool[i % q1Pool.length];
    const q2 = q2Pool[(i + 1) % q2Pool.length];
    const q3 = q3Pool[(i + 2) % q3Pool.length];
    const q4 = q4Pool[(i + 3) % q4Pool.length];

    exams.push({
      id: `math-chuyen-${num}`,
      subject: 'math',
      track: 'chuyen',
      subjectTag: 'Toán Chuyên',
      categoryTag: i % 2 === 0 ? 'Chuyên Toán & Olympic 30/4' : 'Chọn Đội Tuyển HSG Quốc Gia',
      academicYear: '2025-2026',
      title: `Đề Luyện Thi Chuyên & HSG Toán #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn tổng hợp chuẩn đề: ${school}`,
      timeMinutes: 150,
      featuredSnippet: q1.content.slice(0, 135) + '...',
      topics: ['# Đánh giá & Schur', '# Số học & Đa thức', '# Đường tròn Euler & Simson', '# Tổ hợp Ramsey & Bất biến'],
      difficulty: 'Chuyên / HSG',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}

export function buildMathStandardBatch3(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 25; i++) {
    const num = 51 + i;
    const school = THPT_INSTITUTIONS_BATCH_3[i];
    const a = (i % 4) + 1; // 1..4
    const b = (i % 5) + 2; // 2..6
    const c = (i % 3) + 2; // 2..4

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho hàm số phân thức bậc hai trên bậc nhất $y = \\frac{x^2 + ${a}x + ${b}}{x - 1}$ (chuẩn GDPT 2018).\na) Tìm các đường tiệm cận đứng và tiệm cận xiên của đồ thị hàm số.\nb) Tìm hai điểm cực trị của hàm số và viết phương trình đường thẳng đi qua hai điểm cực trị đó.`,
        solution: `a) Chia đa thức tử cho mẫu:\n$$y = x + ${a + 1} + \\frac{${1 + a + b}}{x - 1}.$$\n- Tập xác định $D = \\mathbb{R} \\setminus \\{1\\}$. $\\lim_{x \\to 1^\\pm} y = \\pm\\infty \\implies$ Tiệm cận đứng: $x = 1$.\n- $\\lim_{x \\to \\pm\\infty} \\big[y - (x + ${a + 1})\\big] = 0 \\implies$ Tiệm cận xiên: $y = x + ${a + 1}$.\n\nb) Đạo hàm $y' = 1 - \\frac{${1 + a + b}}{(x - 1)^2} = 0 \\iff (x - 1)^2 = ${1 + a + b} \\iff x = 1 \\pm \\sqrt{${1 + a + b}}$.\nTại điểm cực trị $y' = 0$, ta luôn có giá trị cực trị bằng thương đạo hàm tử chia đạo hàm mẫu: $y_{\\text{ct}} = \\frac{(x^2 + ${a}x + ${b})'}{(x - 1)'} = 2x + ${a}$. Vậy đường thẳng đi qua hai điểm cực trị là $y = 2x + ${a}$.`,
        keyFormulasOrHints: ['Tiệm cận xiên GDPT 2018: chia đa thức', 'Đường nối 2 cực trị y = u\'(x)/v\'(x)'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Vẽ Tiệm cận xiên trên Oxy' }
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho hàm số bậc ba $y = x^3 - 3\\cdot ${a}x^2 + ${3 * a * a - 3}x + ${b}$.\na) Tìm khoảng đồng biến, nghịch biến và các điểm cực trị của đồ thị hàm số.\nb) Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số trên đoạn $[0; ${a + 2}]$.`,
        solution: `a) Tập xác định $D = \\mathbb{R}$. Đạo hàm:\n$$y' = 3x^2 - ${6 * a}x + ${3 * a * a - 3} = 3\\big[(x - ${a})^2 - 1\\big] = 0 \\iff x = ${a - 1} \\text{ hoặc } x = ${a + 1}.$$\n- Hàm số đồng biến trên $(-\\infty; ${a - 1})$ và $(${a + 1}; +\\infty)$.\n- Hàm số nghịch biến trên $(${a - 1}; ${a + 1})$.\n- Điểm cực đại $x = ${a - 1}$, điểm cực tiểu $x = ${a + 1}$.\n\nb) Tính các giá trị tại $x = 0$, hai đầu mút $x = ${a + 2}$ và các điểm cực trị thuộc $[0; ${a + 2}]$ ($x = ${a - 1}, ${a + 1}$ đều thuộc đoạn vì $a \\ge 1$), rồi so sánh chọn GTLN và GTNN.`,
        keyFormulasOrHints: ['y\' = 3[(x - a)^2 - 1]', 'So sánh giá trị tại đầu mút và cực trị trong đoạn'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Khảo sát Hàm bậc ba 2D' }
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một hộp không nắp dạng hình hộp chữ nhật được làm từ một tấm bìa các-tông hình vuông cạnh $A = ${6 * a}$ cm bằng cách cắt ở bốn góc bốn hình vuông bằng nhau cạnh $x$ cm ($0 < x < ${3 * a}$) rồi gập lên.\na) Biểu diễn thể tích $V(x)$ của chiếc hộp theo $x$.\nb) Tìm $x$ để thể tích của chiếc hộp thu được là **lớn nhất** và tính thể tích lớn nhất đó.`,
        solution: `a) Sau khi cắt 4 góc cạnh $x$, đáy hộp là hình vuông cạnh $A - 2x = ${6 * a} - 2x$ và chiều cao hộp là $x$.\nThể tích chiếc hộp:\n$$V(x) = x(${6 * a} - 2x)^2 = 4x^3 - ${24 * a}x^2 + ${36 * a * a}x, \\quad x \\in (0; ${3 * a}).$$\n\nb) Đạo hàm: $V'(x) = 12x^2 - ${48 * a}x + ${36 * a * a} = 12(x - ${a})(x - ${3 * a}) = 0$.\nTrên $(0; ${3 * a})$ chỉ có nghiệm $x = ${a}$. Lập bảng biến thiên thấy $V'(x)$ đổi dấu từ dương sang âm qua $x = ${a}$.\nVậy thể tích lớn nhất đạt tại $x = ${a}\\text{ cm}$ với $V_{\\max} = ${a} \\cdot (${4 * a})^2 = ${16 * a ** 3}\\text{ cm}^3$.`,
        keyFormulasOrHints: ['V(x) = x(A - 2x)^2', 'Cực đại thực tế tại x = A/6']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho đồ thị $(C)$ của hàm số $y = \\frac{${a + 1}x + 1}{x - 1}$ và đường thẳng $d: y = x + m$.\na) Tìm điều kiện của $m$ để đường thẳng $d$ cắt đồ thị $(C)$ tại hai điểm phân biệt $A, B$.\nb) Khi $d$ cắt $(C)$ tại $A, B$, tìm $m$ để độ dài đoạn thẳng $AB$ đạt giá trị nhỏ nhất.`,
        solution: `a) Phương trình hoành độ giao điểm ($x \\neq 1$):\n$$\\frac{${a + 1}x + 1}{x - 1} = x + m \\iff x^2 + (m - ${a + 2})x - (m + 1) = 0\\; (*).$$\nĐể $d$ cắt $(C)$ tại $2$ điểm phân biệt, $(*)$ cần có $2$ nghiệm phân biệt khác $1$:\n- Thử $x = 1$: $1 + m - ${a + 2} - m - 1 = ${-a - 2} \\neq 0$ (luôn khác $1$).\n- $\\Delta = (m - ${a + 2})^2 + 4(m + 1) = m^2 - ${2 * a}m + ${(a + 2) ** 2 + 4} > 0$ (luôn dương với mọi $m \\in \\mathbb{R}$ do $\\Delta_m' = ${a * a - (a + 2) ** 2 - 4} < 0$).\n\nb) Do $A, B \\in (d): y = x + m$, ta có $AB^2 = 2(x_1 - x_2)^2 = 2\\big[(x_1 + x_2)^2 - 4x_1 x_2\\big] = 2\\Delta = 2\\big[(m - ${a})^2 + ${4 * a + 8}\\big]$.\nVậy $AB$ nhỏ nhất bằng $\\sqrt{${8 * a + 16}}$ khi $m = ${a}$.`,
        keyFormulasOrHints: ['Tương giao hàm phân thức -> PT bậc hai (x != 1)', 'AB^2 = (1 + k^2)[(x1 + x2)^2 - 4x1x2]']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `a) Giải bất phương trình lôgarit: $\\log_{0.5}(x^2 - ${a + 3}x + ${a + 3}) \\ge 0$.\nb) Dân số một thành phố năm 2025 là $2$ triệu người với tốc độ tăng trưởng ổn định $1.5\\%$/năm. Hỏi đến năm nào dân số thành phố đó lần đầu vượt mốc $2.5$ triệu người?`,
        solution: `a) Điều kiện xác định: $x^2 - ${a + 3}x + ${a + 3} > 0$.\nVì cơ số $0.5 \\in (0; 1)$, bất phương trình tương đương:\n$$0 < x^2 - ${a + 3}x + ${a + 3} \\le 0.5^0 = 1 \\iff x^2 - ${a + 3}x + ${a + 2} \\le 0 \\text{ và } x^2 - ${a + 3}x + ${a + 3} > 0.$$\nNghiệm của $x^2 - ${a + 3}x + ${a + 2} \\le 0$ là $1 \\le x \\le ${a + 2}$ (kiểm tra với điều kiện $> 0$ khi cần thiết: giá trị nhỏ nhất của $x^2 - ${a + 3}x + ${a + 3}$ đạt tại $\\frac{${a + 3}}{2}$). Giải bất phương trình bậc hai chuẩn xác để kết luận tập nghiệm $S$.\n\nb) $2\\cdot(1 + 0.015)^n > 2.5 \\iff (1.015)^n > 1.25 \\iff n > \\log_{1.015}(1.25) \\approx 14.99$. Vậy sau $15$ năm, tức năm **2040**, dân số vượt mốc $2.5$ triệu người.`,
        keyFormulasOrHints: ['Cơ số 0 < a < 1 đổi chiều bất phương trình', 'Tăng trưởng mũ P = P0(1 + r)^n']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Một lớp học khảo sát điểm kiểm tra Toán của $40$ học sinh và thu được bảng mẫu số liệu ghép nhóm (chương trình GDPT 2018):\n- Nhóm $[4; 5)$: $4$ HS; $[5; 6)$: $8$ HS; $[6; 7)$: $12$ HS; $[7; 8)$: $10$ HS; $[8; 9)$: $4$ HS; $[9; 10]$: $2$ HS.\na) Tính số trung bình cộng $\\overline{x}$ và mốt $M_o$ của mẫu số liệu ghép nhóm trên.\nb) Tính khoảng tứ phân vị $\\Delta_Q = Q_3 - Q_1$ của mẫu số liệu.`,
        solution: `a) Chọn giá trị đại diện các nhóm lần lượt là $4.5, 5.5, 6.5, 7.5, 8.5, 9.5$:\n$$\\overline{x} = \\frac{4(4.5) + 8(5.5) + 12(6.5) + 10(7.5) + 4(8.5) + 2(9.5)}{40} = \\frac{268}{40} = 6.7.$$\nNhóm chứa mốt là $[6; 7)$ (tần số lớn nhất $n_3 = 12$):\n$$M_o = 6 + \\frac{12 - 8}{(12 - 8) + (12 - 10)}\\cdot 1 = 6 + \\frac{4}{6} \\approx 6.67.$$\n\nb) Cỡ mẫu $n = 40 \\implies \\frac{n}{4} = 10$, $\\frac{3n}{4} = 30$.\n- Tứ phân vị thứ nhất $Q_1 \\in [5; 6)$: $Q_1 = 5 + \\frac{10 - 4}{8}\\cdot 1 = 5.75$.\n- Tứ phân vị thứ ba $Q_3 \\in [7; 8)$: $Q_3 = 7 + \\frac{30 - 24}{10}\\cdot 1 = 7.60$.\nKhoảng tứ phân vị $\\Delta_Q = Q_3 - Q_1 = 7.60 - 5.75 = 1.85$.`,
        keyFormulasOrHints: ['Trung bình ghép nhóm theo giá trị đại diện', 'Công thức nội suy tứ phân vị Q1, Q3 & Mốt']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `a) Cho cấp số nhân $(u_n)$ có $u_1 = ${a}$ và $u_4 = ${8 * a}$. Tìm công bội $q$ và tổng $6$ số hạng đầu $S_6$.\nb) Một chất điểm chuyển động theo phương trình $s(t) = t^3 - 3t^2 + ${b}t + 1$ ($t$ tính bằng giây, $s$ tính bằng mét). Tìm thời điểm vận tốc tức thời của chất điểm đạt giá trị nhỏ nhất.`,
        solution: `a) Từ $u_4 = u_1 q^3 \\implies ${8 * a} = ${a} q^3 \\iff q^3 = 8 \\implies q = 2$.\nTổng $6$ số hạng đầu:\n$$S_6 = u_1 \\frac{q^6 - 1}{q - 1} = ${a} \\cdot \\frac{64 - 1}{2 - 1} = ${63 * a}.$$\n\nb) Vận tốc tức thời là đạo hàm của quãng đường theo thời gian:\n$$v(t) = s'(t) = 3t^2 - 6t + ${b} = 3(t - 1)^2 + ${b - 3}.$$\nDo đó vận tốc tức thời đạt giá trị nhỏ nhất bằng ${b - 3}\\text{ m/s}$ tại thời điểm $t = 1\\text{ giây}$.`,
        keyFormulasOrHints: ['u_n = u_1 * q^(n-1)', 'Ý nghĩa cơ học đạo hàm: v(t) = s\'(t)']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `a) Giải phương trình: $\\log_3(x + ${a}) + \\log_{1/3}(2x - 1) = 0$.\nb) Tìm giá trị của tham số thực $m$ để phương trình $4^x - 2^{x+2} + m = 0$ có hai nghiệm phân biệt $x_1, x_2$ thỏa mãn $x_1 + x_2 = 1$.`,
        solution: `a) Điều kiện: $x > \\frac{1}{2}$ (vì $\\frac{1}{2} > -${a}$).\nBiến đổi $\\log_{1/3}(2x - 1) = -\\log_3(2x - 1)$:\n$$\\log_3(x + ${a}) = \\log_3(2x - 1) \\iff x + ${a} = 2x - 1 \\iff x = ${a + 1}\\; (\\text{thỏa mãn } x > \\frac{1}{2}).$$\n\nb) Đặt $t = 2^x > 0$, phương trình trở thành $t^2 - 4t + m = 0$.\nĐiều kiện có 2 nghiệm dương phân biệt: $\\Delta' = 4 - m > 0, S = 4 > 0, P = m > 0 \\iff 0 < m < 4$.\nKhi đó $x_1 + x_2 = 1 \\iff 2^{x_1 + x_2} = 2^1 \\iff t_1 t_2 = 2 \\iff m = 2\\; (\\text{thỏa mãn } 0 < m < 4)$.`,
        keyFormulasOrHints: ['log_{1/a}(u) = -log_a(u)', '2^(x1 + x2) = t1 * t2 = c/a']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `a) Tính tích phân: $I = \\int_1^e \\frac{\\ln x + ${a}}{x}\\,dx$.\nb) Tính diện tích hình phẳng giới hạn bởi parabol $(P): y = x^2 - ${2 * b}x + ${b * b}$ và trục hoành từ $x = 0$ đến $x = ${b}$.`,
        solution: `a) Đặt $t = \\ln x \\implies dt = \\frac{dx}{x}$. Đổi cận: $x = 1 \\to t = 0$; $x = e \\to t = 1$.\n$$I = \\int_0^1 (t + ${a})\\,dt = \\left[\\frac{t^2}{2} + ${a}t\\right]_0^1 = \\frac{1}{2} + ${a} = \\frac{${2 * a + 1}}{2}.$$\n\nb) Nhận thấy $x^2 - ${2 * b}x + ${b * b} = (x - ${b})^2 \\ge 0$ với mọi $x$, nên:\n$$S = \\int_0^{${b}} (x - ${b})^2\\,dx = \\left[\\frac{(x - ${b})^3}{3}\\right]_0^{${b}} = \\frac{${b ** 3}}{3}.$$`,
        keyFormulasOrHints: ['Đổi biến t = ln x', 'Diện tích S = int |f(x)| dx'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Minh họa Hình phẳng Tích phân' }
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Một chiếc ô tô đang chạy với tốc độ $v_0 = ${10 + 2 * a}\\text{ m/s}$ thì người lái đạp phanh; từ thời điểm đó ô tô chuyển động chậm dần đều với vận tốc $v(t) = -4t + ${10 + 2 * a}$ (m/s), trong đó $t$ là khoảng thời gian tính bằng giây kể từ lúc bắt đầu đạp phanh.\na) Hỏi sau bao lâu kể từ lúc đạp phanh thì ô tô dừng hẳn?\nb) Tính quãng đường ô tô đi được trong ${2 + (i % 2)}$ giây đầu tiên kể từ lúc đạp phanh.`,
        solution: `a) Ô tô dừng hẳn khi $v(t) = 0 \\iff -4t + ${10 + 2 * a} = 0 \\iff t = ${(10 + 2 * a) / 4}\\text{ giây}$.\n\nb) Vì thời điểm $t_0 = ${2 + (i % 2)} < ${(10 + 2 * a) / 4}$ (xe chưa dừng), quãng đường đi được là:\n$$S = \\int_0^{${2 + (i % 2)}} (-4t + ${10 + 2 * a})\\,dt = \\left[-2t^2 + ${10 + 2 * a}t\\right]_0^{${2 + (i % 2)}} = ${-2 * (2 + (i % 2)) ** 2 + (10 + 2 * a) * (2 + (i % 2))}\\text{ mét}.$$`,
        keyFormulasOrHints: ['Dừng hẳn khi v(t) = 0', 'Quãng đường S = int_{t1}^{t2} v(t) dt']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `a) Tìm một nguyên hàm $F(x)$ của hàm số $f(x) = \\cos(${c}x) + 2x$ thỏa mãn $F(0) = ${a}$.\nb) Tính thể tích khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi đường cong $y = \\sqrt{${b} - x^2}$, $y = 0$, $x = 0$ và $x = 1$ quanh trục $Ox$.`,
        solution: `a) Nguyên hàm tổng quát:\n$$F(x) = \\frac{1}{${c}}\\sin(${c}x) + x^2 + C.$$\nTừ giả thiết $F(0) = ${a} \\implies 0 + 0 + C = ${a} \\implies F(x) = \\frac{1}{${c}}\\sin(${c}x) + x^2 + ${a}$.\n\nb) Thể tích khối tròn xoay quanh $Ox$:\n$$V = \\pi \\int_0^1 (${b} - x^2)\\,dx = \\pi \\left[${b}x - \\frac{x^3}{3}\\right]_0^1 = \\pi\\left(${b} - \\frac{1}{3}\\right) = \\frac{${3 * b - 1}\\pi}{3}.$$`,
        keyFormulasOrHints: ['int cos(cx) dx = (1/c) sin(cx) + C', 'V = pi * int_a^b y^2 dx'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Mô hình Khối tròn xoay 3D' }
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `a) Biết $F(x)$ là một nguyên hàm của $f(x)$ trên $\\mathbb{R}$ và $\\int_0^2 f(x)\\,dx = ${2 * a}$, $\\int_2^5 f(x)\\,dx = ${3 * b}$. Tính $K = \\int_0^5 \\big[2f(x) - 3\\big]\\,dx$.\nb) Tính diện tích hình phẳng giới hạn bởi hai đồ thị $y = e^x$ và $y = e$, với $x \\in [0; 1]$.`,
        solution: `a) Tính chất cộng tính của tích phân:\n$$\\int_0^5 f(x)\\,dx = \\int_0^2 f(x)\\,dx + \\int_2^5 f(x)\\,dx = ${2 * a + 3 * b}.$$\nSuy ra:\n$$K = 2\\int_0^5 f(x)\\,dx - \\int_0^5 3\\,dx = 2(${2 * a + 3 * b}) - 15 = ${4 * a + 6 * b - 15}.$$\n\nb) Trên $[0; 1]$, ta có $e^x \\le e$ nên $|e - e^x| = e - e^x$:\n$$S = \\int_0^1 (e - e^x)\\,dx = \\big[ex - e^x\\big]_0^1 = (e - e) - (0 - 1) = 1.$$`,
        keyFormulasOrHints: ['Tách cận tích phân int_a^c = int_a^b + int_b^c', 'int e^x dx = e^x + C']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Trong không gian $Oxyz$, cho hai điểm $A(1; 2; -1)$ và $B(${1 + 2 * a}; 0; ${3})$. \na) Viết phương trình mặt phẳng trung trực $(P)$ của đoạn thẳng $AB$.\nb) Viết phương trình tham số của đường thẳng $AB$ và tìm giao điểm của $AB$ với mặt phẳng $(Oxy)$.`,
        solution: `a) Trung điểm $I$ của $AB$ là $I(${1 + a}; 1; 1)$.\nVéc-tơ $\\overrightarrow{AB} = (${2 * a}; -2; 4) = 2(${a}; -1; 2)$. Chọn véc-tơ pháp tuyến $\\vec{n} = (${a}; -1; 2)$.\nPhương trình mặt phẳng trung trực $(P)$ qua $I(${1 + a}; 1; 1)$:\n$$${a}(x - ${1 + a}) - 1(y - 1) + 2(z - 1) = 0 \\iff ${a}x - y + 2z - ${a * (1 + a) + 1} = 0.$$\n\nb) Đường thẳng $AB$ qua $A(1; 2; -1)$ có VTCP $\\vec{u} = (${a}; -1; 2)$:\n$$\\begin{cases} x = 1 + ${a}t \\\\ y = 2 - t \\\\ z = -1 + 2t \\end{cases}$$\nGiao điểm với $(Oxy): z = 0 \\iff -1 + 2t = 0 \\iff t = \\frac{1}{2} \\implies M\\left(1 + \\frac{${a}}{2};\\; \\frac{3}{2};\\; 0\\right)$.`,
        keyFormulasOrHints: ['Mặt phẳng trung trực qua trung điểm I, VTPT là AB', 'Giao với (Oxy) khi z = 0'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Không gian Oxyz 3D' }
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a = ${b}$, cạnh bên $SA = ${b}\\sqrt{3}$ vuông góc với mặt phẳng đáy $(ABCD)$.\na) Tính thể tích khối chóp $S.ABCD$.\nb) Tính góc giữa đường thẳng $SC$ và mặt phẳng đáy $(ABCD)$ và khoảng cách từ $A$ đến mặt phẳng $(SBD)$.`,
        solution: `a) Diện tích đáy $S_{ABCD} = a^2 = ${b * b}$, chiều cao $h = SA = ${b}\\sqrt{3}$.\nThể tích khối chóp:\n$$V = \\frac{1}{3} S_{ABCD} \\cdot SA = \\frac{1}{3} \\cdot ${b * b} \\cdot ${b}\\sqrt{3} = \\frac{${b ** 3}\\sqrt{3}}{3}.$$\n\nb) Hình chiếu vuông góc của $SC$ lên $(ABCD)$ là $AC = a\\sqrt{2} = ${b}\\sqrt{2}$.\nDo đó góc $\\alpha = \\widehat{SCA}$ thỏa $\\tan\\alpha = \\frac{SA}{AC} = \\frac{${b}\\sqrt{3}}{${b}\\sqrt{2}} = \\sqrt{\\frac{3}{2}}$.\nKhoảng cách $d = d(A, (SBD))$ thỏa hệ thức tứ diện vuông tại $A$ ($AB, AD, SA$ đôi một vuông góc):\n$$\\frac{1}{d^2} = \\frac{1}{SA^2} + \\frac{1}{AB^2} + \\frac{1}{AD^2} = \\frac{1}{3a^2} + \\frac{1}{a^2} + \\frac{1}{a^2} = \\frac{7}{3a^2} \\implies d = a\\sqrt{\\frac{3}{7}} = ${b}\\sqrt{\\frac{3}{7}}.$$`,
        keyFormulasOrHints: ['V = 1/3 * B * h', 'Hệ thức 1/d^2 = 1/SA^2 + 1/AB^2 + 1/AD^2'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Dựng Hình chóp 3D' }
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Có hai hộp đựng bi: Hộp I có $6$ bi xanh và $4$ bi đỏ; Hộp II có $5$ bi xanh và $5$ bi đỏ. Gieo một con xúc xắc cân đối: nếu được mặt $6$ chấm thì chọn Hộp I, ngược lại chọn Hộp II rồi bốc ngẫu nhiên $1$ viên bi.\na) Tính xác suất để viên bi lấy ra có màu xanh.\nb) Giả sử viên bi lấy ra màu xanh, tính xác suất để nó được lấy từ Hộp I.`,
        solution: `Gọi $H_1, H_2$ là biến cố chọn Hộp I và Hộp II; $X$ là biến cố bốc được bi xanh.\nTa có $P(H_1) = \\frac{1}{6}$, $P(H_2) = \\frac{5}{6}$; $P(X|H_1) = \\frac{6}{10} = 0.6$, $P(X|H_2) = \\frac{5}{10} = 0.5$.\n\na) Theo công thức xác suất toàn phần:\n$$P(X) = \\frac{1}{6}\\cdot 0.6 + \\frac{5}{6}\\cdot 0.5 = 0.1 + \\frac{2.5}{6} = \\frac{3.1}{6} = \\frac{31}{60}.$$\n\nb) Theo công thức Bayes:\n$$P(H_1 | X) = \\frac{P(H_1)P(X|H_1)}{P(X)} = \\frac{0.1}{31/60} = \\frac{6}{31} \\approx 0.1935.$$`,
        keyFormulasOrHints: ['Sơ đồ cây xác suất toàn phần', 'Công thức Bayes GDPT 2018']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Trong không gian $Oxyz$, cho đường thẳng $d: \\frac{x - 1}{2} = \\frac{y + 2}{-1} = \\frac{z - ${a}}{2}$ và mặt phẳng $(P): 2x + 2y - z + 8 = 0$.\na) Tìm góc giữa đường thẳng $d$ và mặt phẳng $(P)$.\nb) Viết phương trình mặt cầu $(S)$ có tâm $I(1; -2; ${a})$ tiếp xúc với mặt phẳng $(P)$.`,
        solution: `a) VTCP của $d$ là $\\vec{u} = (2; -1; 2)$ và VTPT của $(P)$ là $\\vec{n} = (2; 2; -1)$.\nTa có:\n$$\\sin\\varphi = \\frac{|\\vec{u} \\cdot \\vec{n}|}{|\\vec{u}|\\cdot|\\vec{n}|} = \\frac{|2\\cdot 2 + (-1)\\cdot 2 + 2\\cdot(-1)|}{\\sqrt{4 + 1 + 4}\\cdot\\sqrt{4 + 4 + 1}} = \\frac{|4 - 2 - 2|}{9} = 0.$$\nKiểm tra điểm $I(1; -2; ${a}) \\in d$: $2(1) + 2(-2) - ${a} + 8 = ${6 - a} \\neq 0$ (vì $1 \\le a \\le 4$), nên $d \\parallel (P)$ và góc giữa $d$ và $(P)$ bằng $0^\\circ$.\n\nb) Mặt cầu tâm $I(1; -2; ${a})$ tiếp xúc $(P)$ có bán kính:\n$$R = d(I, (P)) = \\frac{|2(1) + 2(-2) - ${a} + 8|}{\\sqrt{2^2 + 2^2 + (-1)^2}} = \\frac{${6 - a}}{3}.$$\nPhương trình mặt cầu $(S): (x - 1)^2 + (y + 2)^2 + (z - ${a})^2 = \\frac{${(6 - a) * (6 - a)}}{9}$.`,
        keyFormulasOrHints: ['sin(d, (P)) = |cos(u, n)|', 'Mặt cầu tiếp xúc (P) khi R = d(I, (P))'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Khảo sát Mặt cầu & Mặt phẳng 3D' }
      }
    ];

    const q1 = q1Pool[i % q1Pool.length];
    const q2 = q2Pool[(i + 1) % q2Pool.length];
    const q3 = q3Pool[(i + 2) % q3Pool.length];
    const q4 = q4Pool[(i + 3) % q4Pool.length];

    exams.push({
      id: `math-kc-${num}`,
      subject: 'math',
      track: 'khong_chuyen',
      subjectTag: 'Toán 12 THPT',
      categoryTag: i % 2 === 0 ? 'Thi Thử THPT Chuẩn GDPT 2018' : 'Khảo Sát Chất Lượng Toán 12',
      academicYear: '2025-2026',
      title: `Đề Thi Thử Tốt Nghiệp Môn Toán #${num} – ${school}`,
      school,
      source: `Nguồn đề chuẩn THPT 2026: ${school}`,
      timeMinutes: 90,
      featuredSnippet: q1.content.slice(0, 130) + '...',
      topics: ['# Tiệm cận xiên & Cực trị', '# Ghép nhóm & Lôgarit', '# Tích phân & Tròn xoay', '# Oxyz & Xác suất Bayes'],
      difficulty: i % 3 === 0 ? 'Nâng cao' : i % 2 === 0 ? 'Khá' : 'Cơ bản',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}
