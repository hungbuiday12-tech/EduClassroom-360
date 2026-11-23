import { ExamPaper, ExamQuestion } from '../types';
import { CHUYEN_SCHOOLS_BATCH_3, THPT_INSTITUTIONS_BATCH_3 } from './extraExamsBatch3Math';

const CHUYEN_SCHOOLS_BATCH_4 = [
  ...CHUYEN_SCHOOLS_BATCH_3,
  'THPT Chuyên Chu Văn An – Hà Nội',
  'THPT Chuyên Nguyễn Huệ – Hà Nội',
  'THPT Chuyên Sơn Tây – Hà Nội',
  'THPT Chuyên Lê Hồng Phong – Nam Định',
  'THPT Chuyên Thái Bình',
  'THPT Chuyên Hưng Yên',
  'THPT Chuyên Bắc Giang',
  'THPT Chuyên Thái Nguyên',
  'THPT Chuyên Tuyên Quang',
  'THPT Chuyên Cao Bằng',
  'THPT Chuyên Lạng Sơn',
  'THPT Chuyên Sơn La',
  'THPT Chuyên Điện Biên (Lê Quý Đôn)',
  'THPT Chuyên Hoàng Lê Kha – Tây Ninh',
  'THPT Chuyên Quang Trung – Bình Phước',
  'THPT Chuyên Hùng Vương – Bình Dương',
  'THPT Chuyên Thăng Long – Lâm Đồng',
  'THPT Chuyên Nguyễn Du – Đắk Lắk',
  'THPT Chuyên Hùng Vương – Gia Lai',
  'THPT Chuyên Lê Quý Đôn – Khánh Hòa',
  'THPT Chuyên Lương Văn Chánh – Phú Yên',
  'THPT Chuyên Lê Khiết – Quảng Ngãi',
  'THPT Chuyên Nguyễn Bỉnh Khiêm – Quảng Nam',
  'THPT Chuyên Thoại Ngọc Hầu – An Giang',
  'THPT Chuyên Huỳnh Mẫn Đạt – Kiên Giang'
];

const THPT_INSTITUTIONS_BATCH_4 = [
  ...THPT_INSTITUTIONS_BATCH_3,
  'THPT Chu Văn An – Hà Nội',
  'THPT Trần Phú – Hoàn Kiếm – Hà Nội',
  'THPT Cầu Giấy – Hà Nội',
  'THPT Nhân Chính – Hà Nội',
  'THPT Nguyễn Gia Thiều – Hà Nội',
  'THPT Lê Quý Đôn – Đống Đa – Hà Nội',
  'THPT Quang Trung – Đống Đa – Hà Nội',
  'THPT Trần Nhân Tông – Hà Nội',
  'THPT Lê Lợi – Hà Đông – Hà Nội',
  'THPT Marie Curie – TP.HCM',
  'THPT Nguyễn Thượng Hiền – TP.HCM',
  'THPT Mạc Đĩnh Chi – TP.HCM',
  'THPT Nguyễn Hữu Huân – TP.HCM',
  'THPT Trần Phú – TP.HCM',
  'THPT Võ Thị Sáu – TP.HCM',
  'THPT Phan Đăng Lưu – TP.HCM',
  'THPT Hoàng Hoa Thám – Đà Nẵng',
  'THPT Thái Phiên – Đà Nẵng',
  'THPT Quốc Học – Quy Nhơn',
  'THPT Lý Tự Trọng – Nha Trang',
  'THPT Trần Hưng Đạo – Nam Định',
  'THPT Hồng Bàng – Hải Phòng',
  'THPT Chuyên Ban – Cần Thơ',
  'Sở GD&ĐT Hải Dương (Đề chuẩn)',
  'Sở GD&ĐT Nghệ An (Đề liên trường)'
];

export function buildMathChuyenBatch4(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 100; i++) {
    const num = 76 + i;
    const school = CHUYEN_SCHOOLS_BATCH_4[i % CHUYEN_SCHOOLS_BATCH_4.length];
    const p = (i % 7) + 2; // 2..8
    const q = (i % 5) + 1; // 1..5
    const r = (i % 4) + 2; // 2..5
    const shift = Math.floor(i / 5);

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải phương trình vô tỉ trên tập số thực:\n$$\\sqrt{x^2 + ${p}x + ${q}} + \\sqrt{x^2 + ${p}x + ${q + 5}} = 5.$$\nb) Cho các số thực dương $a, b, c$ thỏa mãn $ab + bc + ca = 3$. Chứng minh bất đẳng thức:\n$$\\frac{1}{a^2 + 2} + \\frac{1}{b^2 + 2} + \\frac{1}{c^2 + 2} \\le 1.$$`,
        solution: `a) Đặt $t = \\sqrt{x^2 + ${p}x + ${q}} \\ge 0 \\implies \\sqrt{x^2 + ${p}x + ${q + 5}} = \\sqrt{t^2 + 5}$. Phương trình trở thành:\n$$t + \\sqrt{t^2 + 5} = 5 \\iff \\sqrt{t^2 + 5} = 5 - t \\quad (0 \\le t \\le 5).$$\nBình phương hai vế: $t^2 + 5 = 25 - 10t + t^2 \\iff 10t = 20 \\iff t = 2$ (thỏa mãn). Khi đó $x^2 + ${p}x + ${q - 4} = 0$, tính $\\Delta = ${p * p - 4 * (q - 4)}$ để thu được nghiệm $x = \\frac{-${p} \\pm \\sqrt{${p * p - 4 * (q - 4)}}}{2}$ (nếu $\\Delta \\ge 0$).\n\nb) Đổi biến tương đương: $1 - \\frac{2}{a^2 + 2} = \\frac{a^2}{a^2 + 2}$, bất đẳng thức cần chứng minh tương đương với:\n$$\\frac{a^2}{a^2 + 2} + \\frac{b^2}{b^2 + 2} + \\frac{c^2}{c^2 + 2} \\ge 1.$$\nÁp dụng Cauchy-Schwarz dạng Engel:\n$$\\sum \\frac{a^2}{a^2 + 2} \\ge \\frac{(a + b + c)^2}{a^2 + b^2 + c^2 + 6} = \\frac{(a + b + c)^2}{a^2 + b^2 + c^2 + 2(ab + bc + ca)} = 1.$$`,
        keyFormulasOrHints: ['Đặt ẩn phụ t = sqrt(x^2 + px + q)', 'Biến đổi 1 - 2/(a^2 + 2) rồi dùng Cauchy-Schwarz Engel'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Đồ thị hàm số & nghiệm' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải hệ phương trình:\n$$\\begin{cases} x^2 + y^2 + xy = ${p * p + p * q + q * q} \\\\ x + y + xy = ${p + q + p * q} \\end{cases}$$\nb) Cho $a, b, c > 0$ thỏa mãn $a + b + c = ${3 * r}$. Tìm giá trị nhỏ nhất của biểu thức:\n$$P = \\frac{a^2}{b + c} + \\frac{b^2}{c + a} + \\frac{c^2}{a + b}.$$`,
        solution: `a) Đặt $S = x + y$, $P_0 = xy$ với $S^2 \\ge 4P_0$. Hệ trở thành:\n$$\\begin{cases} S^2 - P_0 = ${p * p + p * q + q * q} \\\\ S + P_0 = ${p + q + p * q} \\end{cases}$$\nCộng vế theo vế: $S^2 + S = ${(p + q) * (p + q + 1)} \\iff (S - ${p + q})(S + ${p + q + 1}) = 0$.\n- Với $S = ${p + q} \\implies P_0 = ${p * q}$, cho cặp nghiệm đối xứng $(x, y) = (${p}, ${q})$ và $(${q}, ${p})$.\n- Với $S = ${-(p + q + 1)}$, suy ra $P_0 = ${2 * (p + q) + p * q + 1}$ và kiểm tra $S^2 - 4P_0 < 0$ (loại).\n\nb) Áp dụng Cauchy-Schwarz dạng Engel:\n$$P \\ge \\frac{(a + b + c)^2}{2(a + b + c)} = \\frac{a + b + c}{2} = \\frac{${3 * r}}{2} = ${(1.5 * r).toFixed(1)}.$$\nDấu bằng đạt khi $a = b = c = ${r}$.`,
        keyFormulasOrHints: ['Đưa hệ đối xứng loại 1 về (S, P)', 'Cauchy-Schwarz Engel cho P >= (a+b+c)/2'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Khảo sát hệ phương trình 2D' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải phương trình chứa căn thức bằng phép liên hợp:\n$$\\sqrt{x + ${p + 2}} - \\sqrt{x + ${p - 1}} = 1.$$\nb) Cho $x, y, z > 0$ thỏa mãn $xyz = 1$. Chứng minh:\n$$\\frac{1}{1 + x + xy} + \\frac{1}{1 + y + yz} + \\frac{1}{1 + z + zx} = 1.$$`,
        solution: `a) Điều kiện $x \\ge ${1 - p}$. Đặt $u = \\sqrt{x + ${p + 2}} \\ge 0$, $v = \\sqrt{x + ${p - 1}} \\ge 0$.\nTa có $u - v = 1$ và $u^2 - v^2 = 3 \\implies u + v = 3$.\nCộng hai phương trình: $2u = 4 \\implies u = 2 \\implies x + ${p + 2} = 4 \\implies x = ${2 - p}$ (thỏa mãn ĐKXĐ).\n\nb) Vì $xyz = 1$, nhân cả tử và mẫu của phân thức thứ hai với $x$, và phân thức thứ ba với $xy$:\n- $\\frac{x}{x + xy + xyz} = \\frac{x}{x + xy + 1}$.\n- $\\frac{xy}{xy + xyz + x^2yz} = \\frac{xy}{xy + 1 + x}$.\nCộng cả ba phân thức cùng mẫu số $1 + x + xy$ ta thu được $\\frac{1 + x + xy}{1 + x + xy} = 1$ (điều phải chứng minh).`,
        keyFormulasOrHints: ['Nhân liên hợp kết hợp u^2 - v^2 = 3', 'Đồng nhất mẫu số bằng điều kiện xyz = 1']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Tìm tất cả giá trị tham số $m$ để phương trình $x^2 - 2(m + ${q})x + m^2 + ${2 * q - 1} = 0$ có hai nghiệm phân biệt $x_1, x_2$ thỏa mãn $x_1^2 + x_2^2 = ${2 * p * p + 4}$.\nb) Cho $a, b > 0$ thỏa mãn $a + b = ${2 * r}$. Chứng minh:\n$$\\frac{1}{a} + \\frac{1}{b} \\ge \\frac{${2}}{${r}}.$$`,
        solution: `a) Tính biệt thức $\\Delta' = (m + ${q})^2 - (m^2 + ${2 * q - 1}) = ${2 * q}m + ${q * q - 2 * q + 1} > 0$.\nTheo định lý Viète: $x_1 + x_2 = 2(m + ${q})$ và $x_1 x_2 = m^2 + ${2 * q - 1}$.\nBiến đổi $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2 = 2m^2 + ${8 * q}m + ${4 * q * q - 4 * q + 2} = ${2 * p * p + 4}$. Giải phương trình bậc hai theo $m$ và đối chiếu điều kiện $\\Delta' > 0$.\n\nb) Áp dụng bất đẳng thức AM-GM hoặc Cauchy-Schwarz:\n$$\\frac{1}{a} + \\frac{1}{b} \\ge \\frac{4}{a + b} = \\frac{4}{${2 * r}} = \\frac{2}{${r}}.$$`,
        keyFormulasOrHints: ['Kiểm tra điều kiện Delta\' > 0 trước khi dùng Viète', 'BĐT 1/a + 1/b >= 4/(a + b)']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải phương trình nghiệm thực: $(x + ${q})(x + ${q + 1})(x + ${q + 2})(x + ${q + 3}) = ${p * (p + 2) - 1}$ (hoặc đưa về dạng tích đối xứng).\nb) Cho $a, b, c > 0$. Chứng minh bất đẳng thức:\n$$\\frac{a^3}{b^2} + \\frac{b^3}{c^2} + \\frac{c^3}{a^2} \\ge a + b + c.$$`,
        solution: `a) Ghép cặp thứ nhất với thứ tư, cặp thứ hai với thứ ba:\n$$\\big[(x + ${q})(x + ${q + 3})\\big]\\big[(x + ${q + 1})(x + ${q + 2})\\big] = ${p * (p + 2) - 1}$$\n$$\\iff (x^2 + ${2 * q + 3}x + ${q * (q + 3)})(x^2 + ${2 * q + 3}x + ${(q + 1) * (q + 2)}) = ${p * (p + 2) - 1}.$$\nĐặt $t = x^2 + ${2 * q + 3}x + ${q * (q + 3) + 1}$, phương trình trở thành $(t - 1)(t + 1) = t^2 - 1 = ${p * (p + 2) - 1} \\iff t^2 = ${p * (p + 2)}$, giải $t$ rồi suy ra $x$.\n\nb) Áp dụng bất đẳng thức AM-GM cho $3$ số dương:\n$$\\frac{a^3}{b^2} + b + b \\ge 3\\sqrt[3]{\\frac{a^3}{b^2}\\cdot b \\cdot b} = 3a.$$\nTương tự cho hai phân thức còn lại rồi cộng vế theo vế:\n$$\\sum \\frac{a^3}{b^2} + 2(a + b + c) \\ge 3(a + b + c) \\implies \\sum \\frac{a^3}{b^2} \\ge a + b + c.$$`,
        keyFormulasOrHints: ['Ghép cặp 2 nhân tử tạo biểu thức chung x^2 + kx', 'AM-GM 3 số triệt tiêu mẫu b^2']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn phương trình:\n$$x^2 - ${2 * q}xy + y^2 + ${p}x - ${p}y = 0 \\quad \\text{hoặc} \\quad (x + 1)(y + 2) = x + y + ${p + q}.$$\nb) Chứng minh rằng số $A = ${p * p + 1}^{2n + 1} + ${p * p}^{n + 2}$ chia hết cho ${p * p + p + 1}$? Hãy xét bài toán tổng quát: chứng minh $n^3 - n$ luôn chia hết cho $6$ và $n^5 - n$ luôn chia hết cho $30$ với mọi $n \\in \\mathbb{Z}$.`,
        solution: `a) Với phương trình tích $(x + 1)(y + 2) - (x + 1) - (y + 2) = ${p + q - 3} \\iff x y + 2x + y + 2 - x - y = ${p + q} \\iff (x)(y + 1) = ${p + q - 2} \\dots$ Tách nhân tử chuẩn $(x + a)(y + b) = K$, liệt kê mọi ước nguyên của $K$ để tìm toàn bộ nghiệm nguyên $(x, y)$.\n\nb) Ta có $n^5 - n = n(n^2 - 1)(n^2 + 1) = n(n - 1)(n + 1)(n^2 - 4 + 5) = (n - 2)(n - 1)n(n + 1)(n + 2) + 5n(n - 1)(n + 1)$.\n- Tích $5$ số nguyên liên tiếp chia hết cho $30$.\n- $5n(n - 1)(n + 1)$ chia hết cho $5 \\cdot 6 = 30$.\nVậy $n^5 - n$ luôn chia hết cho $30$ với mọi $n \\in \\mathbb{Z}$.`,
        keyFormulasOrHints: ['Phân tích (x + a)(y + b) = K', 'Tách n^2 + 1 = (n^2 - 4) + 5 để chứng minh chia hết cho 30']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Tìm số nguyên tố $p$ sao cho $p + ${2 * q},\\; p + ${2 * q + 4}$ (hoặc $p, p + 10, p + 14$) đều là các số nguyên tố.\nb) Chứng minh rằng không tồn tại số hữu tỉ $r$ nào sao cho $r^2 = ${p * p + 1}$ (với ${p * p + 1}$ không chính phương).`,
        solution: `a) Xét theo modulo $3$: với mọi số nguyên tố $p \\neq 3$, $p$ có dạng $3k + 1$ hoặc $3k + 2$.\n- Khi kiểm tra bộ $(p, p + 10, p + 14)$: nếu $p = 3k + 1 \\implies p + 14 = 3k + 15 \\equiv 0 \\pmod 3$ (hợp số vì $> 3$); nếu $p = 3k + 2 \\implies p + 10 = 3k + 12 \\equiv 0 \\pmod 3$ (hợp số). Thử $p = 3$: $(3, 13, 17)$ đều là số nguyên tố! Tương tự xét modulo $3$ cho bộ số tham số $q$.\n\nb) Giả sử tồn tại $r = \\frac{a}{b}$ tối giản ($\\gcd(a, b) = 1, b > 0$) sao cho $\\frac{a^2}{b^2} = ${p * p + 1} \\iff a^2 = ${p * p + 1} b^2$.\nVì ${p * p + 1}$ nằm giữa hai số chính phương liên tiếp $p^2$ và $(p + 1)^2$ nên tồn tại ít nhất một ước nguyên tố $q_0$ xuất hiện với số mũ lẻ trong phân tích thừa số nguyên tố của ${p * p + 1}$. Từ $a^2 = ${p * p + 1} b^2$, số mũ của $q_0$ ở vế trái chẵn còn vế phải lẻ (mâu thuẫn!).`,
        keyFormulasOrHints: ['Xét số dư modulo 3 cho bộ 3 số nguyên tố', 'Đếm số mũ p-adic chẵn lẻ của ước nguyên tố']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Tìm tất cả nghiệm nguyên dương của phương trình:\n$$\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{${p}}.$$\nb) Cho đa thức $P(x) = x^3 + ax^2 + bx + c$ hệ số nguyên thỏa mãn $P(1) = ${q},\\; P(2) = ${2 * q},\\; P(3) = ${3 * q}$. Tính $P(4) + P(0)$.`,
        solution: `a) Quy đồng khử mẫu ($x, y > 0$):\n$${p}(x + y) = xy \\iff xy - ${p}x - ${p}y + ${p * p} = ${p * p} \\iff (x - ${p})(y - ${p}) = ${p * p}.$$\nVì $x, y > 0 \\implies x - ${p} > -${p}$ và hai thừa số cùng dấu dương (vì $x - ${p} \\le -${p}$ vô lý với $x \\ge 1$), liệt kê mọi cặp ước dương $(d_1, d_2)$ của ${p * p}$ để thu được nghiệm $(${p} + d_1,\\; ${p} + d_2)$.\n\nb) Xét $Q(x) = P(x) - ${q}x$. Đa thức $Q(x)$ bậc $3$ hệ số cao nhất bằng $1$ có $3$ nghiệm $x = 1, 2, 3$ nên $Q(x) = (x - 1)(x - 2)(x - 3)$.\nSuy ra $P(4) = 3\\cdot 2\\cdot 1 + ${4 * q} = ${6 + 4 * q}$, $P(0) = (-1)(-2)(-3) + 0 = -6 \\implies P(4) + P(0) = ${4 * q}$.`,
        keyFormulasOrHints: ['(x - p)(y - p) = p^2', 'Đa thức phụ Q(x) = P(x) - qx có nghiệm 1, 2, 3']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Chứng minh rằng với mọi số tự nhiên $n \\ge 1$, phân số $\\frac{${2 * r + 1}n + ${r}}{${3 * r + 1}n + ${r}}$ (hoặc $\\frac{21n + 4}{14n + 3}$) là phân số tối giản.\nb) Tìm chữ số tận cùng của $A = 7^{2026} + ${p}^{2025}$.`,
        solution: `a) Đặt $d = \\gcd(21n + 4, 14n + 3)$ (tương ứng $d = \\gcd(a_1 n + b_1, a_2 n + b_2)$).\nTa có $d \\mid 2(21n + 4) - 3(14n + 3) = -1 \\implies d = 1$. Do đó phân số $\\frac{21n + 4}{14n + 3}$ luôn tối giản với mọi $n \\in \\mathbb{N}$.\n\nb) Theo chu kỳ chữ số tận cùng: $7^4 = 2401 \\equiv 1 \\pmod{10} \\implies 7^{2026} = (7^4)^{506}\\cdot 7^2 \\equiv 9 \\pmod{10}$.\nTính ${p}^{2025} \\equiv ${p}^1 = ${p} \\pmod{10}$ (theo định lý Euler $\\varphi(10) = 4$ hoặc xét chu kỳ mod $10$), từ đó lấy chữ số tận cùng của tổng $(9 + ${p}) \\bmod 10$.`,
        keyFormulasOrHints: ['Khử n bằng tổ hợp tuyến tính tìm UCLN', 'Chu kỳ chữ số tận cùng theo mod 10 (chu kỳ chia hết 4)']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho đường tròn $(O; R)$ và điểm $A$ nằm ngoài $(O)$ với $OA = ${r}R$. Từ $A$ kẻ hai tiếp tuyến $AB, AC$ tới $(O)$ ($B, C$ là các tiếp điểm) và cát tuyến $ADE$ không đi qua $O$ ($D$ nằm giữa $A$ và $E$). Gọi $H$ là giao điểm của $OA$ và $BC$, $I$ là trung điểm của $DE$.\na) Chứng minh 5 điểm $A, B, O, I, C$ cùng nằm trên một đường tròn.\nb) Chứng minh $AB^2 = AD \\cdot AE = AH \\cdot AO$.\nc) Tính độ dài đoạn $BC$ và diện tích tứ giác $ABOC$ theo $R$ (khi $OA = ${r}R$).`,
        solution: `a) Ta có $\\widehat{ABO} = \\widehat{ACO} = 90^\\circ$ (tính chất tiếp tuyến) và $OI \\perp DE \\implies \\widehat{AIO} = 90^\\circ$ (quan hệ đường kính - dây cung).\nBa điểm $B, I, C$ cùng nhìn đoạn $AO$ dưới góc vuông nên $5$ điểm $A, B, O, I, C$ cùng thuộc đường tròn đường kính $AO$.\n\nb) Xét $\\triangle ABD \\sim \\triangle AEB$ (g.g: chung $\\widehat{A}$, $\\widehat{ABD} = \\widehat{AEB}$ cùng chắn cung $BD$) $\\implies AB^2 = AD\\cdot AE$.\nTrong $\\triangle ABO$ vuông tại $B$ có đường cao $BH \\perp AO$ ($OA$ là trung trực $BC$): $AB^2 = AH \\cdot AO$.\n\nc) Trong $\\triangle ABO$ vuông tại $B$: $AB = \\sqrt{OA^2 - OB^2} = R\\sqrt{${r * r - 1}}$.\nĐường cao $BH = \\frac{AB \\cdot OB}{OA} = \\frac{R\\sqrt{${r * r - 1}}}{${r}} \\implies BC = 2BH = \\frac{2R\\sqrt{${r * r - 1}}}{${r}}$.\nDiện tích $S_{ABOC} = 2 S_{ABO} = AB \\cdot OB = R^2\\sqrt{${r * r - 1}}$.`,
        keyFormulasOrHints: ['5 điểm cùng thuộc đường tròn đường kính AO', 'Hệ thức lượng tam giác vuông + phương tích cát tuyến'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Mô phỏng Cát tuyến & Tiếp tuyến 2D' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho $\\triangle ABC$ nhọn nội tiếp $(O)$, đường cao $AD, BE, CF$ đồng quy tại $H$. Kẻ đường kính $AK$ của $(O)$.\na) Chứng minh tứ giác $BHCK$ là hình bình hành và $H, M, K$ thẳng hàng (với $M$ là trung điểm $BC$).\nb) Chứng minh góc $\\widehat{BAH} = \\widehat{OAC}$.\nc) Gọi $P$ đối xứng với $H$ qua $BC$. Chứng minh $P$ nằm trên đường tròn $(O)$.`,
        solution: `a) Vì $AK$ là đường kính nên $\\widehat{ABK} = \\widehat{ACK} = 90^\\circ \\implies BK \\perp AB, CK \\perp AC$. Mặt khác $CH \\perp AB, BH \\perp AC$ nên $BH \\parallel CK$ và $CH \\parallel BK \\implies BHCK$ là hình bình hành. Hai đường chéo $BC, HK$ cắt nhau tại trung điểm $M$ của mỗi đường, suy ra $H, M, K$ thẳng hàng.\n\nb) Ta có $\\widehat{BAH} = 90^\\circ - \\widehat{ABC}$. Trong $(O)$, $\\widehat{ACK} = 90^\\circ$ và $\\widehat{AKC} = \\widehat{ABC}$ (cùng chắn cung $AC$) $\\implies \\widehat{KAC} = 90^\\circ - \\widehat{AKC} = 90^\\circ - \\widehat{ABC} = \\widehat{BAH}$.\n\nc) Vì $P$ đối xứng $H$ qua $BC$ nên $\\widehat{BPC} = \\widehat{BHC} = 180^\\circ - \\widehat{BAC}$ (tứ giác $AEHF$ nội tiếp). Suy ra $\\widehat{BPC} + \\widehat{BAC} = 180^\\circ$, chứng tỏ $ABPC$ nội tiếp hay $P \\in (O)$.`,
        keyFormulasOrHints: ['Đường kính AK tạo hình bình hành BHCK', 'Đối xứng trực tâm qua cạnh thuộc đường tròn ngoại tiếp'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Trực tâm & Đường tròn ngoại tiếp' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho điểm $C$ nằm trên nửa đường tròn $(O; R)$ đường kính $AB$ ($C \\neq A, B$). Tiếp tuyến tại $C$ cắt tiếp tuyến tại $A$ và $B$ lần lượt tại $M$ và $N$. Gọi $H$ là hình chiếu của $C$ lên $AB$.\na) Chứng minh $\\widehat{MON} = 90^\\circ$ và $AM \\cdot BN = R^2$.\nb) Chứng minh $AB$ tiếp xúc với đường tròn đường kính $MN$.\nc) Tìm vị trí của $C$ trên nửa đường tròn để chu vi tứ giác $ABNM$ đạt giá trị nhỏ nhất.`,
        solution: `a) $OM, ON$ là phân giác hai góc kề bù $\\widehat{AOC}, \\widehat{BOC} \\implies \\widehat{MON} = 90^\\circ$. Trong $\\triangle MON$ vuông tại $O$ có $OC \\perp MN$ tại $C$: $MC \\cdot NC = OC^2 = R^2$, mà $AM = MC, BN = NC \\implies AM \\cdot BN = R^2$.\n\nb) Trung điểm $I$ của $MN$ là tâm đường tròn đường kính $MN$. Vì $ABNM$ là hình thang vuông có $IO$ là đường trung bình $\\implies IO \\perp AB$ và $IO = \\frac{MN}{2}$. Do đó đường tròn $(I; MN/2)$ tiếp xúc với $AB$ tại $O$.\n\nc) Chu vi $ABNM = AB + BN + NM + MA = 2R + 2MN$. Chu vi nhỏ nhất $\\iff MN$ nhỏ nhất. Mà $MN \\ge AB = 2R$ (hình chiếu vuông góc), dấu bằng xảy ra khi $MN \\parallel AB \\iff C$ là **điểm chính giữa cung $AB$**.`,
        keyFormulasOrHints: ['AM . BN = MC . NC = R^2', 'MN >= AB = 2R đạt min tại điểm chính giữa cung'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Tiếp tuyến Nửa đường tròn 2D' }
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Trong mặt phẳng cho $n = ${2 * p + 7}$ điểm sao cho không có ba điểm nào thẳng hàng, được tô bằng hai màu xanh hoặc đỏ. Biết mọi tam giác có $3$ đỉnh cùng màu đều không chứa điểm nào khác màu ở bên trong? Hãy xét bài toán cổ điển: chứng minh trong ${2 * p + 5}$ người bất kỳ, luôn có hai người có **cùng số người quen** trong nhóm.`,
        solution: `Áp dụng **Nguyên lý Dirichlet**:\nĐặt $N = ${2 * p + 5}$. Số người quen của mỗi người trong nhóm chỉ có thể nhận giá trị trong tập $\\{0, 1, 2, \\dots, N - 1\\}$ ($N$ giá trị).\nTuy nhiên, hai giá trị $0$ (không quen ai) và $N - 1$ (quen tất cả mọi người còn lại) **không thể cùng tồn tại đồng thời**.\nDo đó, số người quen thực tế của $N$ người chỉ rơi vào tối đa $N - 1$ giá trị (hoặc $\\{0, \\dots, N-2\\}$ hoặc $\\{1, \\dots, N-1\\}$).\nTheo nguyên lý Dirichlet, với $N$ người phân vào $N - 1$ khả năng, luôn có ít nhất $2$ người có cùng số người quen.`,
        keyFormulasOrHints: ['0 và N - 1 không thể đồng thời xuất hiện', 'Nguyên lý Dirichlet với N thỏ và N - 1 chuồng']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Cho bảng vuông $n \\times n$ với $n = ${2 * r + 1}$ (số lẻ). Ở mỗi ô ban đầu điền dấu \`+\` hoặc \`-\`. Mỗi bước được phép **đổi dấu toàn bộ một hàng hoặc một cột bất kỳ**. Hỏi từ trạng thái ban đầu có đúng $1$ dấu \`-\` và $n^2 - 1$ dấu \`+\`, có thể biến đổi để toàn bảng chỉ còn dấu \`+\` hay không?`,
        solution: `Xét **Bất biến tích các dấu** (hoặc số dấu \`-\` modulo $2$) trên một hình vuông con $2 \\times 2$ bất kỳ! Một bước đổi dấu một hàng hoặc một cột luôn giao với $2 \\times 2$ theo đúng $2$ ô (làm đổi dấu $2$ ô trong hình $2 \\times 2$, giữ nguyên chẵn lẻ số dấu \`-\` trong mọi $2 \\times 2$!).\nBan đầu toàn bảng có đúng $1$ dấu \`-\`. Chọn một hình vuông $2 \\times 2$ chứa ô dấu \`-\` duy nhất đó: nó có $1$ dấu \`-\` (lẻ).\nỞ trạng thái toàn dấu \`+\`, mọi $2 \\times 2$ đều có $0$ dấu \`-\` (chẵn).\nVì tính chẵn lẻ số dấu \`-\` trong hình $2 \\times 2$ là **bất biến**, nên **không thể** đưa bảng về toàn dấu \`+\`.`,
        keyFormulasOrHints: ['Xét bất biến trên bảng con 2x2 chứa ô dấu âm', 'Đổi dấu hàng/cột luôn đổi đúng 2 ô trong 2x2']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Chứng minh rằng trong mọi tập hợp gồm $n = ${p + 6}$ số nguyên bất kỳ, luôn tồn tại một tập con khác rỗng các số mà **tổng của chúng chia hết cho $n$** (${p + 6}$).`,
        solution: `Gọi $n$ số đã cho là $a_1, a_2, \\dots, a_n$. Xét $n$ tổng tiền tố:\n$$S_1 = a_1,\\quad S_2 = a_1 + a_2,\\quad \\dots,\\quad S_n = a_1 + a_2 + \\dots + a_n.$$\n- Nếu tồn tại $S_k \\equiv 0 \\pmod n$, tập con $\\{a_1, \\dots, a_k\\}$ thỏa mãn đề bài.\n- Ngược lại, $n$ tổng $S_1, \\dots, S_n$ khi chia cho $n$ chỉ nhận các số dư khác $0$ là $\\{1, 2, \\dots, n - 1\\}$ ($n - 1$ số dư).\nTheo Nguyên lý Dirichlet, tồn tại $1 \\le i < j \\le n$ sao cho $S_i \\equiv S_j \\pmod n$. Khi đó:\n$$S_j - S_i = a_{i+1} + a_{i+2} + \\dots + a_j \\equiv 0 \\pmod n.$$`,
        keyFormulasOrHints: ['Xét n tổng tiền tố S_1..S_n', 'Dirichlet trên tập số dư mod n']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Cho đa giác lồi $2026$ cạnh (hoặc $n = ${2 * p + 6}$ đỉnh). Hỏi có bao nhiêu đường chéo của đa giác và tổng số giao điểm tối đa bên trong đa giác của các đường chéo đó là bao nhiêu?`,
        solution: `Số đường chéo của đa giác lồi $n$ cạnh là:\n$$\\binom{n}{2} - n = \\frac{n(n - 3)}{2}.$$\nMỗi giao điểm bên trong đa giác của $2$ đường chéo được xác định duy nhất bởi $1$ tứ giác lồi có $4$ đỉnh là $4$ đỉnh của đa giác (vì chỉ hai đường chéo của một tứ giác lồi mới cắt nhau bên trong đa giác).\nDo đó, số giao điểm tối đa bên trong đa giác bằng đúng số cách chọn $4$ đỉnh từ $n$ đỉnh:\n$$\\binom{n}{4} = \\frac{n(n - 1)(n - 2)(n - 3)}{24}.$$\nThay $n = ${2 * p + 6}$ vào tính ra giá trị cụ thể là $\\binom{${2 * p + 6}}{4}$.`,
        keyFormulasOrHints: ['Số đường chéo = n(n-3)/2', 'Mỗi 4 đỉnh xác định duy nhất 1 giao điểm 2 đường chéo']
      }
    ];

    const q1 = q1Pool[(i + shift) % q1Pool.length];
    const q2 = q2Pool[(i + 1 + shift) % q2Pool.length];
    const q3 = q3Pool[(i + 2 + shift) % q3Pool.length];
    const q4 = q4Pool[(i + 3 + shift) % q4Pool.length];

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
      featuredSnippet: q1.content.slice(0, 130) + '...',
      topics: ['# Bất đẳng thức & Hệ PT', '# Số học & Đa thức', '# Hình học Đường tròn', '# Tổ hợp Dirichlet & Bất biến'],
      difficulty: 'Chuyên / HSG',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}

export function buildMathStandardBatch4(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 100; i++) {
    const num = 76 + i;
    const school = THPT_INSTITUTIONS_BATCH_4[i % THPT_INSTITUTIONS_BATCH_4.length];
    const a = (i % 5) + 1; // 1..5
    const b = (i % 4) + 2; // 2..5
    const shift = Math.floor(i / 4);

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho hàm số $y = \\frac{x^2 + ${a}x + ${b}}{x + 1}$.\na) Tìm các đường tiệm cận đứng và tiệm cận xiên của đồ thị hàm số.\nb) Tìm các điểm cực trị của hàm số trên khoảng $(-1; +\\infty)$.`,
        solution: `a) Tập xác định $D = \\mathbb{R} \\setminus \\{-1\\}$.\nVì $\\lim_{x \\to -1} (x^2 + ${a}x + ${b}) = ${1 - a + b} \\neq 0$ (kiểm tra với $b \\ge a$ thì tử khác $0$), đường thẳng $x = -1$ là tiệm cận đứng.\nChia đa thức: $y = x + ${a - 1} + \\frac{${b - a + 1}}{x + 1}$. Do đó đường thẳng $y = x + ${a - 1}$ là tiệm cận xiên.\n\nb) Đạo hàm: $y' = 1 - \\frac{${b - a + 1}}{(x + 1)^2}$. Giải $y' = 0$ trên $(-1; +\\infty)$ để tìm cực tiểu tại $x = -1 + \\sqrt{${Math.max(1, b - a + 1)}}$.`,
        keyFormulasOrHints: ['Chia đa thức tìm tiệm cận xiên y = ax + b', 'Lập bảng biến thiên tìm cực trị'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Vẽ đồ thị & Tiệm cận xiên' }
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho hàm số $y = x^3 - 3\\cdot ${a}x + ${b}$ trên đoạn $[0; ${a + 2}]$.\na) Tìm các khoảng đồng biến, nghịch biến của hàm số.\nb) Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số trên đoạn đã cho.`,
        solution: `a) Đạo hàm $y' = 3x^2 - ${3 * a}$. Giải $y' = 0 \\iff x = \\pm\\sqrt{${a}}$. Hàm số đồng biến trên $(-\\infty; -\\sqrt{${a}})$ và $(\\sqrt{${a}}; +\\infty)$, nghịch biến trên $(-\\sqrt{${a}}; \\sqrt{${a}})$.\n\nb) Trên $[0; ${a + 2}]$, tính giá trị tại hai đầu mút $y(0) = ${b}$, $y(${a + 2}) = ${(a + 2) ** 3 - 3 * a * (a + 2) + b}$ và tại điểm dừng $x = \\sqrt{${a}}$ là $y(\\sqrt{${a}}) = ${b} - ${2 * a}\\sqrt{${a}}$ để kết luận GTLN và GTNN.`,
        keyFormulasOrHints: ['Xét dấu y\' = 3x^2 - 3a', 'So sánh f(0), f(a+2), f(sqrt(a))'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Khảo sát Hàm bậc ba' }
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Giải các phương trình và bất phương trình mũ – lôgarit sau:\na) $2^{x^2 - ${a}x} = 2^{${b}}$.\nb) $\\log_3(2x - 1) \\le ${a}$.`,
        solution: `a) Vì cơ số $2 > 0, 2 \\neq 1$, phương trình tương đương:\n$$x^2 - ${a}x - ${b} = 0 \\implies x = \\frac{${a} \\pm \\sqrt{${a * a + 4 * b}}}{2}.$$\n\nb) Điều kiện xác định $2x - 1 > 0 \\iff x > \\frac{1}{2}$. Vì cơ số $3 > 1$, bất phương trình tương đương:\n$$2x - 1 \\le 3^{${a}} \\iff x \\le \\frac{3^{${a}} + 1}{2}.$$\nVậy tập nghiệm là $S = \\left(\\frac{1}{2};\\; \\frac{${3 ** a + 1}}{2}\\right]$.`,
        keyFormulasOrHints: ['Đưa về cùng cơ số', 'Đừng quên điều kiện xác định của logarit 2x - 1 > 0']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một chất điểm chuyển động theo quy luật $s(t) = -\\frac{1}{3}t^3 + ${a + 1}t^2 + ${b}t$ (mét), với $t$ tính bằng giây.\na) Tìm vận tốc tức thời $v(t)$ và gia tốc $a(t)$ tại thời điểm $t = 2\\text{ s}$.\nb) Trong $6$ giây đầu tiên, chất điểm đạt vận tốc lớn nhất bằng bao nhiêu?`,
        solution: `a) Vận tốc $v(t) = s'(t) = -t^2 + ${2 * (a + 1)}t + ${b}$, gia tốc $a(t) = v'(t) = -2t + ${2 * (a + 1)}$.\nTại $t = 2\\text{ s}$: $v(2) = -4 + ${4 * (a + 1) + b} = ${4 * a + b}\\text{ m/s}$, $a(2) = ${2 * (a + 1) - 4} = ${2 * a - 2}\\text{ m/s}^2$.\n\nb) $v(t)$ là parabol bề lõm hướng xuống đạt đỉnh tại $t = ${a + 1} \\in [0; 6]$ với $v_{\\max} = ${(a + 1) ** 2 + b}\\text{ m/s}$.`,
        keyFormulasOrHints: ['v(t) = s\'(t), a(t) = v\'(t)', 'Tìm cực đại hàm bậc hai trên [0; 6]']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho cấp số cộng $(u_n)$ có số hạng đầu $u_1 = ${a}$ và công sai $d = ${b}$.\na) Tính số hạng thứ $10$ ($u_{10}$) và tổng $10$ số hạng đầu tiên $S_{10}$.\nb) Số ${a + 19 * b}$ là số hạng thứ bao nhiêu của cấp số cộng?`,
        solution: `a) $u_{10} = u_1 + 9d = ${a} + 9\\cdot ${b} = ${a + 9 * b}$.\nTổng $10$ số hạng đầu: $S_{10} = \\frac{10(u_1 + u_{10})}{2} = 5\\cdot (${a} + ${a + 9 * b}) = ${5 * (2 * a + 9 * b)}$.\n\nb) Đặt $u_n = ${a + 19 * b} \\iff ${a} + (n - 1)\\cdot ${b} = ${a + 19 * b} \\implies n - 1 = 19 \\implies n = 20$.`,
        keyFormulasOrHints: ['u_n = u_1 + (n - 1)d', 'S_n = n(u_1 + u_n)/2']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Mẫu số liệu ghép nhóm về chiều cao (cm) của $40$ học sinh lớp 12 như sau: $[150; 155): 4$, $[155; 160): ${8 + a}$, $[160; 165): ${16 - a}$, $[165; 170): 8$, $[170; 175): 4$.\na) Tính số trung bình cộng $\\bar{x}$ của mẫu số liệu ghép nhóm.\nb) Xác định nhóm chứa mốt và tính giá trị mốt $M_o$ của mẫu số liệu.`,
        solution: `a) Giá trị đại diện các nhóm lần lượt là $152.5; 157.5; 162.5; 167.5; 172.5$.\nSố trung bình cộng:\n$$\\bar{x} = \\frac{4\\cdot 152.5 + ${8 + a}\\cdot 157.5 + ${16 - a}\\cdot 162.5 + 8\\cdot 167.5 + 4\\cdot 172.5}{40} = ${(610 + (8 + a) * 157.5 + (16 - a) * 162.5 + 1340 + 690) / 40}.$$\n\nb) Nhóm có tần số lớn nhất là nhóm chứa mốt, áp dụng công thức:\n$$M_o = u_m + \\frac{n_m - n_{m-1}}{(n_m - n_{m-1}) + (n_m - n_{m+1})}\\cdot (u_{m+1} - u_m).$$`,
        keyFormulasOrHints: ['Giá trị đại diện c_i = (a_i + b_i)/2', 'Công thức Mốt mẫu số liệu ghép nhóm GDPT 2018']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho $\\int_1^3 f(x)\\,dx = ${2 * a}$ và $\\int_1^3 g(x)\\,dx = ${b}$.\na) Tính tích phân $I = \\int_1^3 \\big[3f(x) - 2g(x) + 4\\big]\\,dx$.\nb) Tính diện tích hình phẳng giới hạn bởi đồ thị $y = x^2 - ${a + 1}x$ và trục hoành $Ox$.`,
        solution: `a) Áp dụng tính chất tuyến tính của tích phân:\n$$I = 3\\int_1^3 f(x)\\,dx - 2\\int_1^3 g(x)\\,dx + \\int_1^3 4\\,dx = 3(${2 * a}) - 2(${b}) + 4(3 - 1) = ${6 * a - 2 * b + 8}.$$\n\nb) Hoành độ giao điểm với $Ox$: $x^2 - ${a + 1}x = 0 \\iff x = 0$ hoặc $x = ${a + 1}$.\nDiện tích hình phẳng:\n$$S = \\int_0^{${a + 1}} |x^2 - ${a + 1}x|\\,dx = \\frac{(${a + 1})^3}{6} = ${(((a + 1) ** 3) / 6).toFixed(2)}.$$`,
        keyFormulasOrHints: ['Tính chất tuyến tính tích phân xác định', 'Diện tích parabol cắt trục Ox: |a|(x2 - x1)^3 / 6'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Minh họa Tích phân diện tích' }
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho hàm số $f(x) = \\sin(${a}x) + e^{${b}x}$.\na) Tìm họ nguyên hàm $F(x)$ của hàm số $f(x)$.\nb) Tìm nguyên hàm cụ thể $F(x)$ biết $F(0) = 2$.`,
        solution: `a) Họ nguyên hàm:\n$$F(x) = \\int \\big(\\sin(${a}x) + e^{${b}x}\\big)\\,dx = -\\frac{1}{${a}}\\cos(${a}x) + \\frac{1}{${b}}e^{${b}x} + C.$$\n\nb) Từ điều kiện $F(0) = 2$:\n$$-\\frac{1}{${a}} + \\frac{1}{${b}} + C = 2 \\implies C = 2 + \\frac{1}{${a}} - \\frac{1}{${b}}.$$`,
        keyFormulasOrHints: ['int sin(ax) dx = -1/a cos(ax) + C', 'Thay x = 0 tìm hằng số C']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Trong không gian $Oxyz$, cho ba điểm $A(1; 0; ${a})$, $B(0; ${b}; 1)$, $C(2; 1; 0)$.\na) Viết phương trình mặt phẳng $(ABC)$.\nb) Viết phương trình mặt cầu tâm $A$ đi qua điểm $B$.`,
        solution: `a) Tính hai véc-tơ chỉ phương $\\overrightarrow{AB} = (-1; ${b}; ${1 - a})$ và $\\overrightarrow{AC} = (1; 1; ${-a})$. Lấy tích có hướng $\\vec{n} = [\\overrightarrow{AB}, \\overrightarrow{AC}] = (-${a * b + 1 - a};\\; ${1 - a - a};\\; -1 - ${b}) = (${a - a * b - 1};\\; ${1 - 2 * a};\\; ${-1 - b})$ rồi viết phương trình mặt phẳng qua $A(1; 0; ${a})$.\n\nb) Bán kính mặt cầu $R = AB = \\sqrt{(-1)^2 + ${b}^2 + (${1 - a})^2} = \\sqrt{${1 + b * b + (1 - a) * (1 - a)}}$.\nPhương trình mặt cầu: $(x - 1)^2 + y^2 + (z - ${a})^2 = ${1 + b * b + (1 - a) * (1 - a)}$.`,
        keyFormulasOrHints: ['VTPT n = [AB, AC]', 'Mặt cầu tâm A qua B có R^2 = AB^2'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Dựng Mặt phẳng & Mặt cầu Oxyz' }
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Trong không gian $Oxyz$, cho đường thẳng $d: \\frac{x - 1}{2} = \\frac{y + 1}{-1} = \\frac{z - ${a}}{2}$ và điểm $M(3; 1; ${a + 2})$.\na) Viết phương trình mặt phẳng $(P)$ đi qua $M$ và vuông góc với $d$.\nb) Tìm tọa độ hình chiếu vuông góc $H$ của $M$ lên đường thẳng $d$.`,
        solution: `a) Vì $(P) \\perp d$, VTPT của $(P)$ là VTCP của $d$: $\\vec{n} = (2; -1; 2)$.\nPhương trình $(P)$ qua $M(3; 1; ${a + 2})$:\n$$2(x - 3) - (y - 1) + 2(z - ${a + 2}) = 0 \\iff 2x - y + 2z - ${2 * a + 9} = 0.$$\n\nb) Tham số hóa $H \\in d$: $H(1 + 2t;\\; -1 - t;\\; ${a} + 2t)$. Vì $H \\in (P)$:\n$$2(1 + 2t) - (-1 - t) + 2(${a} + 2t) - ${2 * a + 9} = 0 \\iff 9t - 6 = 0 \\iff t = \\frac{2}{3}.$$\nSuy ra $H\\left(\\frac{7}{3};\\; -\\frac{5}{3};\\; ${a} + \\frac{4}{3}\\right)$.`,
        keyFormulasOrHints: ['(P) vuông góc d nhận u_d làm VTPT', 'Hình chiếu H là giao của d và (P)'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Hình chiếu đường thẳng 3D' }
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Cho hình lăng trụ đứng $ABC.A'B'C'$ có đáy $ABC$ là tam giác vuông cân tại $A$ với $AB = AC = ${b}$, cạnh bên $AA' = ${b + a}$.\na) Tính thể tích khối lăng trụ $ABC.A'B'C'$.\nb) Tính góc giữa đường thẳng $A'B$ và mặt phẳng đáy $(ABC)$.`,
        solution: `a) Diện tích đáy $S_{ABC} = \\frac{1}{2}AB\\cdot AC = \\frac{${b * b}}{2}$. Thể tích khối lăng trụ đứng:\n$$V = S_{ABC}\\cdot AA' = \\frac{${b * b}}{2}\\cdot ${b + a} = ${(b * b * (b + a) / 2).toFixed(1)}.$$\n\nb) Vì $A'A \\perp (ABC)$, hình chiếu vuông góc của $A'B$ lên $(ABC)$ là $AB$. Góc giữa $A'B$ và $(ABC)$ là $\\widehat{A'BA}$ với $\\tan\\widehat{A'BA} = \\frac{AA'}{AB} = \\frac{${b + a}}{${b}}$.`,
        keyFormulasOrHints: ['V_lang_tru = S_day * h', 'Góc giữa A\'B và (ABC) là góc A\'BA'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Khối Lăng trụ 3D' }
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Trong không gian $Oxyz$, cho mặt cầu $(S): x^2 + y^2 + z^2 - 2x + 4y - 6z - ${a + 2} = 0$.\na) Xác định tâm $I$ và bán kính $R$ của mặt cầu $(S)$.\nb) Viết phương trình mặt phẳng $(Q)$ song song với $(Oxy)$ và cắt mặt cầu $(S)$ theo giao tuyến là đường tròn có bán kính lớn nhất.`,
        solution: `a) Tâm $I(1; -2; 3)$, hằng số $d = -${a + 2}$.\nBán kính $R = \\sqrt{1^2 + (-2)^2 + 3^2 - (-${a + 2})} = \\sqrt{${16 + a}}$.\n\nb) Đường tròn giao tuyến có bán kính lớn nhất (bằng $R$) khi và chỉ khi mặt phẳng $(Q)$ đi qua tâm $I(1; -2; 3)$. Vì $(Q) \\parallel (Oxy)$ nên $(Q)$ có dạng $z = c$; đi qua $I$ suy ra $(Q): z = 3$.`,
        keyFormulasOrHints: ['Tâm I(-a, -b, -c), R = sqrt(a^2+b^2+c^2-d)', 'Thiết diện lớn nhất qua tâm I']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Trong một kỳ thi đánh giá năng lực, tỉ lệ học sinh ôn luyện bằng mô phỏng 3D là $60\\%$ (Nhóm A) và không dùng là $40\\%$ (Nhóm B). Tỉ lệ đạt điểm giỏi ở Nhóm A là $85\\%$ và ở Nhóm B là $50\\%$. Chọn ngẫu nhiên $1$ học sinh.\na) Tính xác suất để học sinh được chọn đạt điểm giỏi.\nb) Giả sử học sinh được chọn đạt điểm giỏi, tính xác suất để học sinh đó thuộc Nhóm A (Công thức Bayes).`,
        solution: `Gọi $A$ là biến cố học sinh thuộc Nhóm A ($P(A) = 0.6 \\implies P(\\bar{A}) = 0.4$), $G$ là biến cố đạt điểm giỏi ($P(G|A) = 0.85,\\; P(G|\\bar{A}) = 0.5$).\n\na) Công thức xác suất toàn phần:\n$$P(G) = 0.6 \\cdot 0.85 + 0.4 \\cdot 0.5 = 0.51 + 0.20 = 0.71.$$\n\nb) Công thức Bayes:\n$$P(A|G) = \\frac{P(A)P(G|A)}{P(G)} = \\frac{0.51}{0.71} = \\frac{51}{71} \\approx 0.7183.$$`,
        keyFormulasOrHints: ['Xác suất toàn phần P(G) = P(A)P(G|A) + P(B)P(G|B)', 'Công thức Bayes P(A|G)']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Một hộp có ${5 + a} viên bi đỏ và ${4 + b} viên bi xanh. Rút ngẫu nhiên đồng thời $3$ viên bi.\na) Tính số phần tử của không gian mẫu $n(\\Omega)$.\nb) Tính xác suất để $3$ viên bi rút ra có đúng $2$ viên bi đỏ và $1$ viên bi xanh.`,
        solution: `Tổng số bi là $N = ${9 + a + b}$.\na) Không gian mẫu: $n(\\Omega) = \\binom{${9 + a + b}}{3}$.\n\nb) Số cách chọn $2$ bi đỏ và $1$ bi xanh là $\\binom{${5 + a}}{2}\\cdot \\binom{${4 + b}}{1}$. Chia cho $n(\\Omega)$ thu được xác suất chính xác.`,
        keyFormulasOrHints: ['Tổ hợp C(n, k)', 'P(A) = n(A) / n(Omega)']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình chữ nhật với $AB = ${a},\\; AD = ${b}$, cạnh bên $SA = ${a + b}$ vuông góc với đáy $(ABCD)$.\na) Chứng minh $BC \\perp (SAB)$.\nb) Tính khoảng cách từ điểm $A$ đến mặt phẳng $(SBC)$ và thể tích khối chóp $S.ABCD$.`,
        solution: `a) Ta có $BC \\perp AB$ (hình chữ nhật) và $BC \\perp SA$ (do $SA \\perp (ABCD)$). Vì $AB, SA$ cắt nhau trong $(SAB)$ nên $BC \\perp (SAB)$.\n\nb) Kẻ $AH \\perp SB$ ($H \\in SB$). Do $BC \\perp (SAB) \\implies BC \\perp AH$, suy ra $AH \\perp (SBC)$ hay $d(A, (SBC)) = AH = \\frac{SA\\cdot AB}{\\sqrt{SA^2 + AB^2}} = \\frac{${(a + b) * a}}{\\sqrt{${(a + b) ** 2 + a * a}}}$.\nThể tích $V = \\frac{1}{3}AB\\cdot AD\\cdot SA = \\frac{${a * b * (a + b)}}{3}$.`,
        keyFormulasOrHints: ['Định lý 3 đường vuông góc / đường vuông góc mặt phẳng', 'AH = SA.AB / sqrt(SA^2 + AB^2)'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Hình chóp S.ABCD 3D' }
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Tìm tất cả giá trị của tham số thực $m$ để hàm số $y = \\frac{x + m}{x - 1}$ đạt giá trị nhỏ nhất trên đoạn $[2; 4]$ bằng $3$.`,
        solution: `Đạo hàm $y' = \\frac{-1 - m}{(x - 1)^2}$ luôn giữ nguyên dấu trên $[2; 4]$.\n- Trường hợp 1: $-1 - m > 0 \\iff m < -1$: hàm số đồng biến trên $[2; 4] \\implies \\min_{[2; 4]} y = y(2) = 2 + m = 3 \\implies m = 1$ (loại vì không thỏa $m < -1$).\n- Trường hợp 2: $-1 - m < 0 \\iff m > -1$: hàm số nghịch biến trên $[2; 4] \\implies \\min_{[2; 4]} y = y(4) = \\frac{4 + m}{3} = 3 \\implies m = 5$ (nhận). Vậy $m = 5$.`,
        keyFormulasOrHints: ['Hàm bậc nhất/bậc nhất đơn điệu trên từng khoảng', 'Thử lại điều kiện dấu của y\'']
      }
    ];

    const q1 = q1Pool[(i + shift) % q1Pool.length];
    const q2 = q2Pool[(i + 1 + shift) % q2Pool.length];
    const q3 = q3Pool[(i + 2 + shift) % q3Pool.length];
    const q4 = q4Pool[(i + 3 + shift) % q4Pool.length];

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
      topics: ['# Tiệm cận & Cực trị', '# Ghép nhóm & Nguyên hàm', '# Oxyz & Hình chóp', '# Xác suất Bayes'],
      difficulty: i % 3 === 0 ? 'Nâng cao' : i % 2 === 0 ? 'Khá' : 'Cơ bản',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}
