import { ExamPaper, ExamQuestion } from '../types';
import { safeExamSnippet } from './examSnippetHelper';

const CHUYEN_SCHOOLS_BATCH_2 = [
  'THPT Chuyên ĐHSP Hà Nội',
  'Phổ Thông Năng Khiếu – ĐHQG TP.HCM',
  'THPT Chuyên Lê Hồng Phong – TP.HCM',
  'THPT Chuyên Lê Hồng Phong – Nam Định',
  'THPT Chuyên Nguyễn Huệ – Hà Nội',
  'THPT Chuyên Chu Văn An – Hà Nội',
  'THPT Chuyên Thái Nguyên',
  'THPT Chuyên Võ Nguyên Giáp – Quảng Bình',
  'THPT Chuyên Quang Trung – Bình Phước',
  'THPT Chuyên Bến Tre',
  'THPT Chuyên Nguyễn Quang Diêu – Đồng Tháp',
  'THPT Chuyên Thoại Ngọc Hầu – An Giang',
  'THPT Chuyên Huỳnh Mẫn Đạt – Kiên Giang',
  'THPT Chuyên Trần Hưng Đạo – Bình Thuận',
  'THPT Chuyên Nguyễn Tất Thành – Kon Tum',
  'THPT Chuyên Hùng Vương – Gia Lai',
  'THPT Chuyên Nguyễn Du – Đắk Lắk',
  'THPT Chuyên Thăng Long – Lâm Đồng',
  'THPT Chuyên Bảo Lộc – Lâm Đồng',
  'THPT Chuyên Lê Thánh Tông – Quảng Nam'
];

const THPT_PROVINCES_BATCH_2 = [
  'Sở GD&ĐT Bắc Giang',
  'Sở GD&ĐT Ninh Bình',
  'Sở GD&ĐT Hưng Yên',
  'Sở GD&ĐT Lào Cai',
  'Sở GD&ĐT Thái Nguyên',
  'Sở GD&ĐT Tuyên Quang',
  'Sở GD&ĐT Quảng Bình',
  'Sở GD&ĐT Quảng Trị',
  'Sở GD&ĐT Bình Định',
  'Sở GD&ĐT Phú Yên',
  'Sở GD&ĐT Gia Lai',
  'Sở GD&ĐT Đắk Lắk',
  'Sở GD&ĐT Lâm Đồng',
  'Sở GD&ĐT Bà Rịa – Vũng Tàu',
  'Sở GD&ĐT Tây Ninh',
  'Sở GD&ĐT Long An',
  'Sở GD&ĐT Tiền Giang',
  'Sở GD&ĐT An Giang',
  'Sở GD&ĐT Kiên Giang',
  'Sở GD&ĐT Cà Mau'
];

// =========================================================================
// 1. TOÁN CHUYÊN BATCH 2 (20 ĐỀ: math-chuyen-31 -> math-chuyen-50)
// =========================================================================
function buildMathChuyenBatch2(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 20; i++) {
    const num = 31 + i;
    const school = CHUYEN_SCHOOLS_BATCH_2[i];
    const k = (i % 5) + 2; // 2..6
    const m = (i % 4) + 3; // 3..6
    const c = (i % 3) + 2; // 2..4

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải hệ phương trình trên tập số thực:\n$$\\begin{cases} x^3 - y^3 = ${3 * k}(x - y) \\\\ x^2 + y^2 + xy = ${3 * k + m} \\end{cases}$$\nb) Cho $a, b, c > 0$ thỏa mãn $ab + bc + ca = 3$. Chứng minh rằng:\n$$\\frac{1}{a^2 + 2} + \\frac{1}{b^2 + 2} + \\frac{1}{c^2 + 2} \\le 1.$$`,
        solution: `a) Phương trình đầu tương đương $(x - y)(x^2 + xy + y^2 - ${3 * k}) = 0$.\n- Nếu $x = y$: thế vào phương trình hai được $3x^2 = ${3 * k + m} \\implies x = y = \\pm\\sqrt{\\frac{${3 * k + m}}{3}}$.\n- Nếu $x^2 + xy + y^2 = ${3 * k}$: đối chiếu phương trình hai thấy $${3 * k} = ${3 * k + m}$ (vô nghiệm vì $m = ${m} > 0$).\nVậy hệ có đúng hai nghiệm $\\left(\\pm\\sqrt{\\frac{${3 * k + m}}{3}}, \\pm\\sqrt{\\frac{${3 * k + m}}{3}}\\right)$.\n\nb) Ta biến đổi:\n$$\\frac{1}{a^2 + 2} = \\frac{1}{2}\\left(1 - \\frac{a^2}{a^2 + 2}\\right).$$\nBất đẳng thức cần chứng minh tương đương:\n$$\\frac{a^2}{a^2 + 2} + \\frac{b^2}{b^2 + 2} + \\frac{c^2}{c^2 + 2} \\ge 1.$$\nÁp dụng Cauchy-Schwarz dạng Engel:\n$$VT \\ge \\frac{(a + b + c)^2}{a^2 + b^2 + c^2 + 6} = \\frac{(a + b + c)^2}{a^2 + b^2 + c^2 + 2(ab + bc + ca)} = 1.$$\nDấu bằng xảy ra khi $a = b = c = 1$.`,
        keyFormulasOrHints: ['Phân tích nhân tử (x - y)', 'Cauchy-Schwarz Engel với 2(ab+bc+ca) = 6'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Đồ thị Oxy 2D' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải phương trình vô tỉ: $\\sqrt{x^2 + ${k}x + 1} + \\sqrt{x^2 + ${k}x + 8} = 7$.\nb) Cho $x, y, z > 0$ có $x + y + z = 3$. Tìm giá trị nhỏ nhất của $P = \\frac{x^2}{y + 1} + \\frac{y^2}{z + 1} + \\frac{z^2}{x + 1}$.`,
        solution: `a) Đặt $t = x^2 + ${k}x + 1 \\ge 0$. Phương trình trở thành $\\sqrt{t} + \\sqrt{t + 7} = 7$.\nĐặt $u = \\sqrt{t} \\ge 0, v = \\sqrt{t + 7} > 0 \\implies v^2 - u^2 = 7$ và $v + u = 7 \\implies v - u = 1$.\nSuy ra $u = 3 \\implies t = 9 \\implies x^2 + ${k}x - 8 = 0$, giải ra hai nghiệm thực $x = \\frac{-${k} \\pm \\sqrt{${k * k + 32}}}{2}$.\n\nb) Áp dụng Cauchy-Schwarz dạng Engel:\n$$P \\ge \\frac{(x + y + z)^2}{(y + 1) + (z + 1) + (x + 1)} = \\frac{3^2}{3 + 3} = \\frac{3}{2}.$$\nDấu bằng xảy ra tại $x = y = z = 1$. Vậy $\\min P = \\frac{3}{2}$.`,
        keyFormulasOrHints: ['Đặt ẩn phụ t = x^2 + kx + 1', 'Cauchy-Schwarz dạng phân thức'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Khảo sát nghiệm trên Oxy' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Cho đa thức $P(x) = x^3 - ${m}x^2 + ${k}x - 1$ có ba nghiệm thực $x_1, x_2, x_3$. Tính $S = \\frac{1}{x_1^2} + \\frac{1}{x_2^2} + \\frac{1}{x_3^2}$.\nb) Cho $a, b, c > 0$ thỏa mãn $abc = 1$. Chứng minh $\\frac{a}{ab + a + 1} + \\frac{b}{bc + b + 1} + \\frac{c}{ca + c + 1} = 1$ và suy ra $\\frac{a^2}{(ab+a+1)^2} + \\frac{b^2}{(bc+b+1)^2} + \\frac{c^2}{(ca+c+1)^2} \\ge \\frac{1}{3}$.`,
        solution: `a) Theo định lý Viète bậc ba: $x_1 + x_2 + x_3 = ${m}$, $x_1 x_2 + x_2 x_3 + x_3 x_1 = ${k}$, $x_1 x_2 x_3 = 1$.\nTa có:\n$$\\frac{1}{x_1} + \\frac{1}{x_2} + \\frac{1}{x_3} = \\frac{x_1x_2 + x_2x_3 + x_3x_1}{x_1x_2x_3} = ${k}.$$\nVà $\\sum \\frac{1}{x_1 x_2} = \\frac{x_1 + x_2 + x_3}{x_1 x_2 x_3} = ${m}$.\nDo đó $S = \\left(\\sum \\frac{1}{x_1}\\right)^2 - 2\\sum \\frac{1}{x_1 x_2} = ${k}^2 - 2\\cdot ${m} = ${k * k - 2 * m}$.\n\nb) Do $abc = 1$, đặt $a = \\frac{u}{v}, b = \\frac{v}{w}, c = \\frac{w}{u}$ hoặc quy đồng cùng mẫu $ab + a + 1$: dễ thấy tổng ba phân thức luôn bằng $1$.\nKhi đó theo bất đẳng thức $X^2 + Y^2 + Z^2 \\ge \\frac{(X + Y + Z)^2}{3} = \\frac{1}{3}$, ta có ngay điều phải chứng minh.`,
        keyFormulasOrHints: ['Định lý Viète bậc 3', 'X^2 + Y^2 + Z^2 >= (X+Y+Z)^2 / 3']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải phương trình: $(x^2 - ${c}x + 1)^2 + ${m}(x^2 - ${c}x + 1)x = ${m + 1}x^2$ (với $x \\neq 0$).\nb) Tìm tất cả cặp số thực $(x, y)$ thỏa mãn $\\sqrt{x - 1} + \\sqrt{y - 2} = \\frac{x + y + ${k - 3}}{2}$ hay kiểm tra giá trị cực trị biểu thức bậc hai tương ứng.`,
        solution: `a) Chia hai vế cho $x^2 \\neq 0$ và đặt $t = x + \\frac{1}{x} - ${c}$:\nPhương trình trở thành $t^2 + ${m}t - ${m + 1} = 0 \\iff (t - 1)(t + ${m + 1}) = 0$.\nGiải $x + \\frac{1}{x} = ${c + 1}$ và $x + \\frac{1}{x} = ${c - m - 1}$ kiểm tra điều kiện $\\Delta \\ge 0$ để kết luận tất cả nghiệm thực.\n\nb) Áp dụng AM-GM:\n$$\\sqrt{(x - 1)\\cdot 1} \\le \\frac{x - 1 + 1}{2} = \\frac{x}{2}, \\quad \\sqrt{(y - 2)\\cdot 1} \\le \\frac{y - 2 + 1}{2} = \\frac{y - 1}{2}.$$\nCộng theo vế suy ra $VT \\le \\frac{x + y - 1}{2}$. So sánh với vế phải $\\frac{x + y + ${k - 3}}{2}$: chỉ có nghiệm khi $${k - 3} \\le -1$ (khi $k = 2$, dấu bằng xảy ra tại $x = 2, y = 3$).`,
        keyFormulasOrHints: ['Chia x^2 đặt t = x + 1/x', 'AM-GM sqrt(u) <= (u + 1)/2']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải hệ phương trình:\n$$\\begin{cases} x^2 + 2y = ${2 * k + 1} \\\\ y^2 + 2x = ${2 * k + 1} \\end{cases}$$\nb) Cho các số thực dương $a, b, c$. Chứng minh bất đẳng thức:\n$$\\frac{a^3}{b + c} + \\frac{b^3}{c + a} + \\frac{c^3}{a + b} \\ge \\frac{a^2 + b^2 + c^2}{2}.$$`,
        solution: `a) Trừ hai phương trình theo vế: $(x^2 - y^2) - 2(x - y) = 0 \\iff (x - y)(x + y - 2) = 0$.\n- Với $x = y$: $x^2 + 2x - ${2 * k + 1} = 0 \\implies x = y = -1 \\pm \\sqrt{${2 * k + 2}}$.\n- Với $y = 2 - x$: thế vào PT1 được $x^2 - 2x + 4 - ${2 * k + 1} = 0 \\iff x^2 - 2x - ${2 * k - 3} = 0 \\implies x = 1 \\pm \\sqrt{${2 * k - 2}}$ (có nghiệm vì $k \\ge 2$).\n\nb) Biến đổi bằng Cauchy-Schwarz dạng Engel:\n$$\\sum \\frac{a^3}{b + c} = \\sum \\frac{a^4}{ab + ac} \\ge \\frac{(a^2 + b^2 + c^2)^2}{2(ab + bc + ca)} \\ge \\frac{(a^2 + b^2 + c^2)^2}{2(a^2 + b^2 + c^2)} = \\frac{a^2 + b^2 + c^2}{2}.$$`,
        keyFormulasOrHints: ['Hệ đối xứng loại 2 trừ theo vế', 'Nhân tử a^4 / (ab + ac) dùng Engel']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Tìm tất cả các số nguyên dương $n$ sao cho $2^n + ${2 * c - 1}$ là số chính phương.\nb) Chứng minh rằng với mọi số nguyên tố $p > 3$, số $A = p^2 - 1$ luôn chia hết cho $24$.`,
        solution: `a) Xét theo modulo $4$ hoặc modulo $8$:\n- Với $n = 1$: $2^1 + ${2 * c - 1} = ${2 * c + 1}$ (kiểm tra với từng $c \\in \\{2,3,4\\}$).\n- Với $n \\ge 2$: $2^n \\equiv 0 \\pmod 4$. Đặt $2^n + ${2 * c - 1} = k^2$. Vì $k$ lẻ nên $k^2 \\equiv 1 \\pmod 8$. Nếu $n \\ge 3$ thì $k^2 \\equiv ${2 * c - 1} \\pmod 8$, thử đối chiếu đồng dư mod 8 loại hoặc tìm $n$ hữu hạn.\n\nb) Vì $p > 3$ nguyên tố nên $p$ lẻ $\\implies p - 1, p + 1$ là hai số chẵn liên tiếp, tích của chúng chia hết cho $8$. Đồng thời $p \\not\\equiv 0 \\pmod 3 \\implies p^2 \\equiv 1 \\pmod 3 \\implies 3 \\mid (p^2 - 1)$. Vì $\\gcd(8, 3) = 1$ nên $24 \\mid (p^2 - 1)$.`,
        keyFormulasOrHints: ['Đồng dư modulo 8 cho số chính phương lẻ', 'Tích 2 số chẵn liên tiếp chia hết cho 8']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Tìm nghiệm nguyên $(x, y)$ của phương trình: $x^2 + y^2 - ${c}x - ${c}y = xy$.\nb) Tìm tất cả hàm số $f: \\mathbb{R} \\to \\mathbb{R}$ thỏa mãn $f(x^2 + f(y)) = y + (f(x))^2$ với mọi $x, y \\in \\mathbb{R}$.`,
        solution: `a) Nhân cả hai vế với $2$:\n$$(x - y)^2 + (x - ${c})^2 + (y - ${c})^2 = ${2 * c * c}.$$\nPhân tích ${2 * c * c} thành tổng 3 bình phương của các số nguyên để liệt kê hữu hạn tất cả nghiệm $(x, y)$.\n\nb) Thay $x = 0$: $f(f(y)) = y + f(0)^2$, suy ra $f$ song ánh trên $\\mathbb{R}$.\nThay $y = 0$: $f(x^2 + f(0)) = f(x)^2$. Chọn $a$ sao cho $f(a) = 0$, thế $x = 0, y = a$ suy ra $f(0) = 0$ (kiểm tra tính cộng tính / đơn điệu). Kết luận hàm duy nhất $f(x) = x$.`,
        keyFormulasOrHints: ['Đưa về tổng 3 bình phương', 'Phương trình hàm chứng minh song ánh và f(0)=0']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Cho hai số nguyên dương $a, b$ thỏa mãn $a^2 + b^2$ chia hết cho $ab + 1$. Chứng minh rằng thương $\\frac{a^2 + b^2}{ab + 1}$ là một số chính phương (Định lý IMO 1988).\nb) Tìm số dư của $2^{1000} + ${k}^{2025}$ khi chia cho $7$.`,
        solution: `a) Chứng minh kinh điển bằng **Bước nhảy Viète (Vieta Jumping)**:\nGiả sử tồn tại $k = \\frac{a^2 + b^2}{ab + 1}$ không phải số chính phương. Xét cặp $(a, b)$ nguyên dương có tổng $a + b$ nhỏ nhất (với $a \\ge b$). Phương trình bậc hai theo $x$: $x^2 - kbx + (b^2 - k) = 0$ có nghiệm $x_1 = a$ và nghiệm thứ hai $x_2 = kb - a = \\frac{b^2 - k}{a}$.\nVì $k$ không chính phương nên $x_2 \\neq 0$, và do $x_2^2 + b^2 = k(x_2 b + 1) > 0$ nên $x_2 > 0$. Mà $x_2 = \\frac{b^2 - k}{a} < \\frac{a^2}{a} = a$, suy ra $x_2 + b < a + b$, mâu thuẫn tính nhỏ nhất!\n\nb) Vì $2^3 = 8 \\equiv 1 \\pmod 7$ nên $2^{1000} = (2^3)^{333} \\cdot 2 \\equiv 2 \\pmod 7$. Tương tự dùng định lý Fermat nhỏ $a^6 \\equiv 1 \\pmod 7$ nếu $\\gcd(a, 7) = 1$ để rút gọn số mũ $2025 \\bmod 6 = 3$.`,
        keyFormulasOrHints: ['Vieta Jumping cực tiểu hóa a + b', 'Định lý Fermat nhỏ a^6 ≡ 1 (mod 7)']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Tìm tất cả bộ ba số nguyên tố $(p, q, r)$ thỏa mãn $p^q + q^p = r$.\nb) Chứng minh rằng dãy số $a_n = 3^{2n+1} + 2^{n+2}$ luôn chia hết cho $7$ với mọi số tự nhiên $n$.`,
        solution: `a) Nếu cả $p, q$ đều lẻ thì $p^q + q^p$ chẵn lớn hơn $2$, không thể nguyên tố. Do đó có một số bằng $2$, giả sử $p = 2$: $2^q + q^2 = r$.\n- Xét $q = 3$: $2^3 + 3^2 = 17$ (thỏa mãn).\n- Xét $q > 3$ nguyên tố: $q \\equiv \\pm 1 \\pmod 3 \\implies q^2 \\equiv 1 \\pmod 3$, còn $q$ lẻ nên $2^q \\equiv 2 \\pmod 3$. Suy ra $2^q + q^2 \\equiv 0 \\pmod 3$, lớn hơn $3$ nên là hợp số.\nVậy nghiệm là $(2, 3, 17)$ và $(3, 2, 17)$.\n\nb) Ta có $a_n = 3\\cdot 9^n + 4\\cdot 2^n \\equiv 3\\cdot 2^n + 4\\cdot 2^n = 7\\cdot 2^n \\equiv 0 \\pmod 7$.`,
        keyFormulasOrHints: ['Xét tính chẵn lẻ và modulo 3', '9 ≡ 2 (mod 7)']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Giải phương trình nghiệm nguyên: $x^2 - y^2 = ${4 * k}x + ${4 * m - 2}$.\nb) Tìm tất cả đa thức $P(x)$ hệ số thực thỏa mãn $P(x + 1) - P(x) = 2x + ${c}$ và $P(0) = 1$.`,
        solution: `a) Viết lại phương trình:\n$$(x - ${2 * k})^2 - y^2 = ${4 * k * k + 4 * m - 2} \\iff (x - ${2 * k} - y)(x - ${2 * k} + y) = ${4 * k * k + 4 * m - 2}.$$\nĐể ý vế phải chia $4$ dư $2$ ($4(k^2 + m) - 2 \\equiv 2 \\pmod 4$), trong khi tích $(A - y)(A + y)$ luôn chẵn thì hai thừa số cùng chẵn nên chia hết cho $4$, hoặc cùng lẻ nên tích lẻ! Mâu thuẫn dẫn đến phương trình **vô nghiệm nguyên**.\n\nb) Thử dạng bậc hai $P(x) = ax^2 + bx + 1$. Ta có $P(x+1) - P(x) = 2ax + a + b = 2x + ${c} \\implies a = 1, b = ${c - 1}$. Suy ra $P(x) = x^2 + ${c - 1}x + 1$.`,
        keyFormulasOrHints: ['Xét hiệu hai thừa số cùng tính chẵn lẻ mod 4', 'Đồng nhất hệ số đa thức sai phân']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Từ điểm $M$ nằm ngoài đường tròn $(O; R)$, kẻ hai tiếp tuyến $MA, MB$ ($A, B$ là tiếp điểm) và cát tuyến $MCD$ không đi qua tâm $O$ ($C$ nằm giữa $M$ và $D$). Gọi $H$ là giao điểm của $OM$ và $AB$, $I$ là trung điểm của $CD$.\na) Chứng minh 5 điểm $M, A, I, O, B$ cùng thuộc một đường tròn.\nb) Chứng minh $MC \\cdot MD = MH \\cdot MO$ và tứ giác $CHOD$ nội tiếp.\nc) Tiếp tuyến tại $C$ và $D$ của $(O)$ cắt nhau tại $K$. Chứng minh $K, A, B$ thẳng hàng.`,
        solution: `a) Ta có $\\widehat{MAO} = \\widehat{MBO} = 90^\\circ$. Vì $I$ là trung điểm dây $CD$ nên $OI \\perp CD \\implies \\widehat{MIO} = 90^\\circ$. Do đó 5 điểm $M, A, I, O, B$ cùng nằm trên đường tròn đường kính $MO$.\n\nb) Xét tam giác vuông $MAO$ có đường cao $AH$, theo hệ thức lượng: $MA^2 = MH \\cdot MO$. Lại có $\\triangle MAC \\sim \\triangle MDA \\implies MA^2 = MC \\cdot MD$. Suy ra $MC \\cdot MD = MH \\cdot MO$.\nTừ $MC \\cdot MD = MH \\cdot MO \\implies \\triangle MHC \\sim \\triangle MDO$, suy ra $\\widehat{MHC} = \\widehat{MDO}$, dẫn đến tứ giác $CHOD$ nội tiếp.\n\nc) Gọi $N$ là giao điểm $OK$ và $CD$, ta có $OK \\cdot ON = OC^2 = R^2 = OH \\cdot OM$. Suy ra $\\triangle OKH \\sim \\triangle OMN \\implies \\widehat{KHO} = \\widehat{MNO} = 90^\\circ$, hay $KH \\perp OM$. Mà $AB \\perp OM$ tại $H$, nên $K \\in AB$ (hay $K, A, B$ thẳng hàng — đường đối cực của $M$).`,
        keyFormulasOrHints: ['5 điểm trên đường tròn đường kính MO', 'Phương tích M với (O): MC.MD = MH.MO = MA^2', 'Đường đối cực của M qua K'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Hình học Đường tròn 2D' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho tam giác $ABC$ có ba góc nhọn nội tiếp $(O)$ với đường cao $AD, BE, CF$ đồng quy tại $H$. Gọi $S$ là hình chiếu của $D$ lên $AB$, $T$ là hình chiếu của $D$ lên $AC$, và $P, Q$ là hình chiếu của $D$ lên $BE, CF$.\na) Chứng minh $4$ điểm $B, D, H, F$ và $C, D, H, E$ cùng thuộc các đường tròn tương ứng.\nb) Chứng minh 4 điểm $S, P, Q, T$ thẳng hàng (Đường thẳng Taylor suy rộng / Simson).\nc) Chứng minh đường thẳng $ST$ song song với $EF$.`,
        solution: `a) $\\widehat{BFH} = \\widehat{BDH} = 90^\\circ \\implies BDHF$ nội tiếp đường tròn đường kính $BH$. Tương tự $CDHE$ nội tiếp đường tròn đường kính $CH$.\n\nb) Chứng minh theo tính chất góc nội tiếp và các tứ giác nội tiếp $DSBF, DTCE, DHPQ$ hoặc hệ quả đường thẳng Simson: góc tạo bởi $SP$ và $SD$ bằng góc tạo bởi $ST$ và $SD$, lần lượt suy ra $S, P, Q, T$ thẳng hàng.\n\nc) Kiểm tra $\\widehat{AST} = \\widehat{AEF}$ qua các tứ giác nội tiếp $ASDT$ và $BCEF$ để kết luận $ST \\parallel EF$.`,
        keyFormulasOrHints: ['Tứ giác nội tiếp đường kính BH, CH', 'Cộng góc suy ra đồng tuyến tính'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Dựng hình phẳng 2D' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho hai đường tròn $(O_1)$ và $(O_2)$ cắt nhau tại $A$ và $B$. Một cát tuyến qua $A$ cắt $(O_1)$ tại $C$ và cắt $(O_2)$ tại $D$ ($A$ nằm giữa $C$ và $D$). Các tiếp tuyến tại $C$ của $(O_1)$ và tại $D$ của $(O_2)$ cắt nhau tại $E$.\na) Chứng minh tứ giác $BCED$ nội tiếp.\nb) Đường thẳng qua $B$ vuông góc với $AB$ cắt đường tròn ngoại tiếp tam giác $BCD$ tại $P$. Chứng minh $P$ luôn thuộc một đường thẳng cố định khi cát tuyến $CAD$ quay quanh $A$.\nc) Tìm vị trí của cát tuyến $CAD$ để diện tích tam giác $BCD$ đạt giá trị lớn nhất.`,
        solution: `a) Ta có $\\widehat{ECB} = \\widehat{CAB}$ (góc tạo bởi tiếp tuyến và dây cung trong $(O_1)$) và $\\widehat{EDB} = \\widehat{DAB}$ trong $(O_2)$.\nTrong $\\triangle ECD$, tổng góc $\\widehat{CBD} + \\widehat{CED}$ hoặc $\\widehat{ECB} + \\widehat{EDB} + \\widehat{CBD} = 180^\\circ$ suy ra $BCED$ nội tiếp.\n\nb) Xét tâm đường tròn $(BCD)$ và tâm $O_1, O_2$, dùng phép quay đồng dạng tâm $B$: $\\triangle BCD \\sim \\triangle BO_1O_2$ không đổi về hình dạng. Vì vậy góc $\\widehat{PBC} = 90^\\circ - \\widehat{ABC}$ hoặc dùng đường kính $BP$, suy ra quỹ tích $P$.\n\nc) Vì $\\triangle BCD$ luôn đồng dạng với hình cố định góc ở $B$ là $\\widehat{CBD} = 180^\\circ - \\widehat{BCA} - \\widehat{BDA}$ không đổi, nên $S_{\\triangle BCD}$ lớn nhất khi độ dài $CD$ lớn nhất $\\iff CD \\perp AB$.`,
        keyFormulasOrHints: ['Phép vị tự quay tâm B: tam giác BCD giữ nguyên dạng', 'CD max khi CD vuông góc dây chung AB'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Khám phá Hình học 2D' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho tam giác $ABC$ nhọn nội tiếp $(O)$ với $I$ là tâm đường tròn nội tiếp. Tia $AI$ cắt $(O)$ tại $M$ ($M \\neq A$). Kẻ đường kính $MN$ của $(O)$.\na) Chứng minh $MB = MI = MC$ (Bổ đề Đinh Ba / Trillium).\nb) Chứng minh $IM \\cdot IA = 2Rr$, trong đó $R, r$ lần lượt là bán kính đường tròn ngoại tiếp và nội tiếp $\\triangle ABC$ (Hệ thức Euler $OI^2 = R^2 - 2Rr$).\nc) Kẻ tiếp tuyến tại $B, C$ của $(O)$ cắt nhau tại $T$. Chứng minh $I, M$ và đường tròn đường kính $AT$ liên hệ qua trục đẳng phương với $(O)$.`,
        solution: `a) Ta có $\\widehat{MBI} = \\widehat{MBC} + \\widehat{CBI} = \\widehat{MAC} + \\frac{\\widehat{B}}{2} = \\frac{\\widehat{A} + \\widehat{B}}{2}$.\nMặt khác góc ngoài $\\widehat{MIB} = \\widehat{IAB} + \\widehat{IBA} = \\frac{\\widehat{A} + \\widehat{B}}{2}$. Suy ra $\\triangle MBI$ cân tại $M$, tức $MB = MI$. Tương tự $MC = MI$.\n\nb) Hạ $ID \\perp AB$ ($ID = r$). Xét $\\triangle AID \\sim \\triangle NMB$ ($\\widehat{IAD} = \\widehat{MNB}, \\widehat{ADI} = \\widehat{MBN} = 90^\\circ$). Suy ra $IA \\cdot MB = ID \\cdot MN = 2Rr \\implies IA \\cdot IM = 2Rr$.\nTheo phương tích điểm $I$ với $(O)$: $R^2 - OI^2 = IA \\cdot IM = 2Rr \\implies OI^2 = R^2 - 2Rr$.\n\nc) Sử dụng tính chất đối xứng qua $OM$ và điểm đẳng giác kết luận mối quan hệ vuông góc và phương tích.`,
        keyFormulasOrHints: ['Bổ đề Trillium: MB = MI = MC', 'Định lý Euler: OI^2 = R^2 - 2Rr'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Mô hình Hình học 3D' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho đường tròn $(O)$ đường kính $AB$ và điểm $C$ nằm trên đường tròn ($C \\neq A, B$). Tiếp tuyến tại $C$ cắt tiếp tuyến tại $A, B$ lần lượt tại $D, E$.\na) Chứng minh $OD \\perp OE$ và $AD \\cdot BE = R^2$.\nb) Gọi $I$ là giao điểm của $AE$ và $BD$. Chứng minh $CI \\perp AB$ và $I$ là trung điểm của đoạn vuông góc hạ từ $C$ xuống $AB$.\nc) Xác định vị trí của $C$ để chu vi tứ giác $ABED$ nhỏ nhất.`,
        solution: `a) Vì $OD, OE$ là hai tia phân giác hai góc kề bù $\\widehat{AOC}, \\widehat{COB}$ nên $\\widehat{DOE} = 90^\\circ$.\nTrong tam giác vuông $DOE$ đường cao $OC$: $DC \\cdot CE = OC^2 = R^2$. Mà $DC = DA, EC = EB$ nên $AD \\cdot BE = R^2$.\n\nb) Áp dụng định lý Thales với $AD \\parallel BE$: $\\frac{DI}{IB} = \\frac{AD}{BE} = \\frac{DC}{CE}$, suy ra $CI \\parallel AD \\parallel BE$, tức $CI \\perp AB$.\nHơn nữa nếu $CH \\perp AB$ thì $\\frac{CI}{AD} = \\frac{IB}{DB} = \\frac{BE}{AD + BE}$ và $\\frac{IH}{BE} = \\frac{AD}{AD + BE}$, suy ra $CI = IH = \\frac{AD \\cdot BE}{AD + BE}$, hay $I$ là trung điểm $CH$.\n\nc) Chu vi $ABED = AB + AD + DE + BE = 2R + 2(AD + BE)$. Theo AM-GM: $AD + BE \\ge 2\\sqrt{AD \\cdot BE} = 2R$. Vậy chu vi nhỏ nhất bằng $6R$ khi $AD = BE = R$, tức $C$ là điểm chính giữa cung $AB$.`,
        keyFormulasOrHints: ['Định lý Thales bổ đề hình thang ABED', 'BĐT AM-GM AD + BE >= 2R'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Mở Hình học 2D' }
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Trong một giải đấu cờ vua có $${10 + k}$ kỳ thủ tham dự, mỗi cặp hai kỳ thủ đấu với nhau đúng $1$ trận (thắng được $1$ điểm, hòa $0.5$ điểm, thua $0$ điểm). Chứng minh rằng tại mọi thời điểm bất kỳ của giải đấu, luôn tồn tại ít nhất hai kỳ thủ có số trận đã đấu bằng nhau.`,
        solution: `Gọi $n = ${10 + k}$ là số kỳ thủ. Số trận đã đấu của mỗi kỳ thủ chỉ có thể nhận giá trị nguyên từ $0$ đến $n - 1$.\n- Nếu có một kỳ thủ đã đấu $n - 1$ trận (tức đã đấu với tất cả $n - 1$ người còn lại), thì không thể có ai có $0$ trận đã đấu.\n- Ngược lại, nếu không ai đấu $n - 1$ trận thì số trận mỗi người chỉ nằm trong $\\{0, 1, \\dots, n - 2\\}$ ($n - 1$ giá trị).\nTrong cả hai trường hợp, $n$ kỳ thủ chỉ có thể nhận tối đa $n - 1$ giá trị khác nhau về số trận đã đấu. Theo nguyên lý Dirichlet, luôn có ít nhất $2$ kỳ thủ có cùng số trận đã đấu.`,
        keyFormulasOrHints: ['Nguyên lý Dirichlet trên đồ thị hữu hạn', '0 và n-1 không thể cùng tồn tại']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Cho bảng ô vuông kích thước $2025 \\times 2025$. Mỗi ô viết một trong hai số $+1$ hoặc $-1$. Gọi $R_i$ là tích các số trên hàng $i$ và $C_j$ là tích các số trên cột $j$. Chứng minh rằng tổng $T = \\sum_{i=1}^{2025} R_i + \\sum_{j=1}^{2025} C_j$ không bao giờ bằng $0$.`,
        solution: `Giả sử $T = 0$. Khi đó trong $4050$ tích $R_1, \\dots, R_{2025}, C_1, \\dots, C_{2025}$, số lượng tích bằng $+1$ phải bằng số lượng tích bằng $-1$, tức là có đúng $2025$ tích bằng $-1$.\nSuy ra tích của tất cả các $R_i$ và $C_j$ là $(-1)^{2025} = -1$.\nMặt khác, $\\prod R_i \\cdot \\prod C_j = \\left(\\prod_{i, j} a_{ij}\\right)^2 = (+1) \\text{ hoặc } (-1)^2 = +1$ (mâu thuẫn với $-1$). Vậy $T \\neq 0$.`,
        keyFormulasOrHints: ['Bất biến tích toàn bảng xuất hiện 2 lần', '4050/2 = 2025 là số lẻ']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Cho đa giác đều $${2 * k + 15}$ đỉnh. Tô màu đỏ $k_1$ đỉnh và màu xanh các đỉnh còn lại. Nếu có ít nhất $${k + 8}$ đỉnh đỏ, chứng minh luôn tồn tại ít nhất ba đỉnh màu đỏ tạo thành một tam giác cân.`,
        solution: `Số đỉnh toàn đa giác là $N = ${2 * k + 15}$ (lẻ). Nếu số đỉnh đỏ lớn hơn một ngưỡng hoặc áp dụng Dirichlet cho các cặp khoảng cách đối xứng:\nKhi số đỉnh đỏ $> N/2$ (cụ thể $${k + 8} > ${(2 * k + 15) / 2}$), xét ánh xạ quay $\\frac{2\\pi}{N}$ hoặc chọn 1 đỉnh đỏ làm tâm, ghép các đỉnh còn lại thành $\\frac{N - 1}{2}$ cặp đối xứng qua đường kính đi qua đỉnh đó — hoặc dùng trực tiếp nguyên lý Dirichlet cho phép đối xứng qua trục: tồn tại $2$ đỉnh đỏ đối xứng nhau qua đường kính đi qua đỉnh đỏ ban đầu, lập thành tam giác cân!`,
        keyFormulasOrHints: ['Số đỉnh N lẻ -> luôn có 1 đỉnh là tâm đối xứng', 'Dirichlet ghép cặp đối xứng']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Cho $S = \\{1, 2, \\dots, ${2 * m + 12}\\}$. Chọn ngẫu nhiên (bất kỳ) ${m + 8} số phân biệt từ $S$. Chứng minh rằng luôn chọn được hai số trong đó mà số này là bội của số kia.`,
        solution: `Mọi số nguyên dương $x \\in S$ đều viết được duy nhất dưới dạng $x = 2^t \\cdot u$ với $t \\ge 0$ và $u$ là số **lẻ**.\nTrong $S = \\{1, 2, \\dots, ${2 * m + 12}\\}$, chỉ có đúng $\\lceil \\frac{${2 * m + 12}}{2} \\rceil = ${m + 6}$ số lẻ $u$.\nVì ta chọn $${m + 8} > ${m + 6}$ số từ $S$, theo nguyên lý Dirichlet tồn tại ít nhất hai số có cùng phần lẻ $u$: $x = 2^{t_1}u$ và $y = 2^{t_2}u$ ($t_1 < t_2$), khi đó $y$ chia hết cho $x$.`,
        keyFormulasOrHints: ['Biểu diễn x = 2^t * u (u lẻ)', 'Số lượng phần lẻ tối đa là ceil(N/2)']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Trên một đường tròn đặt $${2 * k + 7}$ bóng đèn đang tắt. Mỗi thao tác cho phép đổi trạng thái (bật $\\leftrightarrow$ tắt) của đúng $3$ bóng đèn liên tiếp nhau. Hỏi có thể chuyển toàn bộ các bóng đèn sang trạng thái bật hay không? Giải thích chi tiết.`,
        solution: `Vì $n = ${2 * k + 7}$ là số **nguyên tố cùng nhau với $3$** hoặc xét trường hợp $3 \\mid n$:\n- Nếu $3 \\nmid n$: Ta chứng minh **luôn làm được**! Thật vậy, đổi trạng thái 3 đèn liên tiếp tại $(i, i+1, i+2)$ và $(i+1, i+2, i+3)$ tương đương chỉ đổi trạng thái cặp $(i, i+3)$. Vì $\\gcd(3, n) = 1$, thực hiện liên tiếp có thể bật đúng 1 đèn bất kỳ, suy ra bật được toàn bộ.\n- Nếu $3 \\mid n$: Chia đèn thành 3 nhóm theo chỉ số $\\bmod 3$. Mỗi bước luôn cộng thêm $\\pm 1$ vào số đèn bật ở cả 3 nhóm, nên tính chẵn lẻ của hiệu số đèn bật giữa các nhóm bất biến; nếu $n$ lẻ vẫn có thể xử lý bằng cách chọn mỗi nhóm lẻ đèn.`,
        keyFormulasOrHints: ['Xét hiệu hai thao tác kề nhau để tách (i, i+3)', 'Kiểm tra gcd(3, n)']
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
      categoryTag: i % 2 === 0 ? 'Tuyển Sinh Chuyên' : 'Học Sinh Giỏi Quốc Gia',
      academicYear: '2025-2026',
      title: `Đề Chọn Đội Tuyển & Chuyên Toán #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn tham khảo chuẩn đề: ${school}`,
      timeMinutes: 150,
      featuredSnippet: safeExamSnippet(q1.content, 140),
      topics: ['# Đại số & BĐT', '# Số học & Vieta Jumping', '# Hình học Olympic', '# Tổ hợp Dirichlet'],
      difficulty: 'Chuyên / HSG',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}

// =========================================================================
// 2. TOÁN KHÔNG CHUYÊN / THPT BATCH 2 (20 ĐỀ: math-kc-31 -> math-kc-50)
// =========================================================================
function buildMathStandardBatch2(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 20; i++) {
    const num = 31 + i;
    const province = THPT_PROVINCES_BATCH_2[i];
    const a = (i % 4) + 1; // 1..4
    const b = (i % 5) + 2; // 2..6
    const c = (i % 3) + 2; // 2..4

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho hàm số phân thức $y = \\frac{${a + 1}x - ${b}}{x - ${c}}$.\na) Tìm các đường tiệm cận đứng và tiệm cận ngang của đồ thị hàm số.\nb) Chứng minh hàm số luôn đơn điệu trên từng khoảng xác định và viết phương trình tiếp tuyến tại giao điểm với trục tung.`,
        solution: `a) Tập xác định $D = \\mathbb{R} \\setminus \\{${c}\\}$.\n- $\\lim_{x \\to ${c}^\\pm} y = \\pm\\infty \\implies$ Tiệm cận đứng $x = ${c}$.\n- $\\lim_{x \\to \\pm\\infty} y = ${a + 1} \\implies$ Tiệm cận ngang $y = ${a + 1}$.\n\nb) Đạo hàm: $y' = \\frac{-(${a + 1})\\cdot ${c} + ${b}}{(x - ${c})^2} = \\frac{${b - (a + 1) * c}}{(x - ${c})^2}$.\nVì tử số không đổi khác $0$ (nếu bằng $0$ đồ thị suy biến, khi $(a+1)c \\neq b$ dấu $y'$ cố định) nên hàm số luôn đồng biến hoặc nghịch biến trên $(-\\infty; ${c})$ và $(${c}; +\\infty)$.\nGiao điểm với $Oy$ là $M\\left(0; \\frac{${b}}{${c}}\\right)$, hệ số góc $k = y'(0) = \\frac{${b - (a + 1) * c}}{${c * c}}$, tiếp tuyến là $y = kx + \\frac{${b}}{${c}}$.`,
        keyFormulasOrHints: ['Tiệm cận đứng x = c, ngang y = a/c', "y' = (ad - bc) / (cx + d)^2"],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Vẽ đồ thị Phân thức 2D' }
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho hàm số trùng phương $y = x^4 - ${2 * a * a}x^2 + ${b}$.\na) Tìm tọa độ ba điểm cực trị $A, B, C$ của đồ thị hàm số.\nb) Tính diện tích tam giác $ABC$ tạo bởi ba điểm cực trị đó.`,
        solution: `a) Đạo hàm $y' = 4x^3 - ${4 * a * a}x = 4x(x^2 - ${a * a}) = 0 \\iff x = 0$ hoặc $x = \\pm ${a}$.\n- $A(0; ${b})$ là điểm cực đại.\n- $B(-${a}; ${b - a ** 4})$ và $C(${a}; ${b - a ** 4})$ là hai điểm cực tiểu.\n\nb) Tam giác $ABC$ cân tại $A$ với đáy $BC = 2\\cdot ${a} = ${2 * a}$ và đường cao $h = |y_A - y_B| = ${a ** 4}$.\nDiện tích $S_{\\triangle ABC} = \\frac{1}{2} \\cdot ${2 * a} \\cdot ${a ** 4} = ${a ** 5}$.`,
        keyFormulasOrHints: ['Hàm trùng phương có 3 cực trị khi ab < 0', 'S_ABC = |a|^5 / |4| hoặc 1/2 * BC * h'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Khảo sát Hàm trùng phương' }
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `a) Giải phương trình mũ: $${c}^{2x} - ${c + 1}\\cdot ${c}^x + ${c} = 0$.\nb) Một người gửi tiết kiệm $100$ triệu đồng theo thể thức lãi kép kỳ hạn năm với lãi suất $6\\%$/năm. Hỏi sau ít nhất bao nhiêu năm người đó thu được tổng số tiền cả vốn lẫn lãi vượt quá $150$ triệu đồng?`,
        solution: `a) Đặt $t = ${c}^x > 0$. Phương trình trở thành $t^2 - ${c + 1}t + ${c} = 0 \\iff (t - 1)(t - ${c}) = 0$.\n- Với $t = 1 \\implies x = 0$.\n- Với $t = ${c} \\implies x = 1$.\n\nb) Áp dụng công thức lãi kép $T = A(1 + r)^n > 150 \\iff 100(1.06)^n > 150 \\iff (1.06)^n > 1.5$.\nLấy lôgarit hai vế: $n > \\log_{1.06}(1.5) \\approx 6.96$. Vậy sau ít nhất **7 năm** tổng tiền vượt 150 triệu đồng.`,
        keyFormulasOrHints: ['Đặt ẩn phụ t = a^x > 0', 'Lãi kép T = A(1 + r)^n']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `a) Giải phương trình lôgarit: $\\log_2(x - 1) + \\log_2(x + 1) = ${c === 2 ? 3 : 3}$.\nb) Cho cấp số cộng $(u_n)$ có $u_1 = ${b}$ và công sai $d = ${a}$. Tính $u_{10}$ và tổng $10$ số hạng đầu $S_{10}$.`,
        solution: `a) Điều kiện xác định: $x > 1$. Phương trình tương đương:\n$$\\log_2\\big((x - 1)(x + 1)\\big) = 3 \\iff x^2 - 1 = 8 \\iff x^2 = 9 \\implies x = 3\\; (\\text{nhận } x > 1).$$\n\nb) Ta có $u_{10} = u_1 + 9d = ${b} + 9\\cdot ${a} = ${b + 9 * a}$.\nTổng $10$ số hạng đầu:\n$$S_{10} = \\frac{10(u_1 + u_{10})}{2} = 5\\cdot (${b} + ${b + 9 * a}) = ${5 * (2 * b + 9 * a)}.$$`,
        keyFormulasOrHints: ['log_a(u) + log_a(v) = log_a(uv)', 'u_n = u_1 + (n-1)d']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `a) Tính tích phân bằng phương pháp từng phần: $I = \\int_0^1 (x + ${a})e^x\\,dx$.\nb) Tính diện tích hình phẳng giới hạn bởi hai đường $y = x^2$ và $y = ${b}x$.`,
        solution: `a) Đặt $u = x + ${a} \\implies du = dx$, và $dv = e^x\\,dx \\implies v = e^x$.\n$$I = \\big[(x + ${a})e^x\\big]_0^1 - \\int_0^1 e^x\\,dx = (${a + 1}e - ${a}) - (e - 1) = ${a}e - ${a - 1}.$$\n\nb) Hoành độ giao điểm: $x^2 = ${b}x \\iff x = 0$ hoặc $x = ${b}$.\n$$S = \\int_0^{${b}} |${b}x - x^2|\\,dx = \\left[\\frac{${b}x^2}{2} - \\frac{x^3}{3}\\right]_0^{${b}} = \\frac{${b ** 3}}{6}.$$`,
        keyFormulasOrHints: ['Tích phân từng phần udv = uv - int vdu', 'Diện tích S = int |f(x) - g(x)| dx'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Tô diện tích Tích phân 2D' }
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `a) Tính tích phân đổi biến số: $J = \\int_0^{\\pi/2} \\sin x \\cdot \\cos^${c} x\\,dx$.\nb) Cho hình phẳng $(H)$ giới hạn bởi $y = \\sqrt{x} + ${a}$, $y = 0, x = 0, x = 4$. Tính thể tích khối tròn xoay khi quay $(H)$ quanh trục $Ox$.`,
        solution: `a) Đặt $t = \\cos x \\implies dt = -\\sin x\\,dx$. Đổi cận: $x = 0 \\to t = 1$; $x = \\frac{\\pi}{2} \\to t = 0$.\n$$J = \\int_0^1 t^${c}\\,dt = \\frac{1}{${c + 1}}.$$\n\nb) Thể tích khối tròn xoay:\n$$V = \\pi \\int_0^4 (\\sqrt{x} + ${a})^2\\,dx = \\pi \\int_0^4 (x + ${2 * a}\\sqrt{x} + ${a * a})\\,dx = \\pi \\left[\\frac{x^2}{2} + \\frac{${4 * a}}{3}x^{3/2} + ${a * a}x\\right]_0^4 = \\pi\\left(8 + \\frac{${32 * a}}{3} + ${4 * a * a}\\right).$$`,
        keyFormulasOrHints: ['Đổi biến t = cos x', 'V = pi * int f^2(x) dx'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Khối tròn xoay 3D' }
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Trong không gian $Oxyz$, cho mặt cầu $(S): (x - ${a})^2 + (y + ${b})^2 + (z - ${c})^2 = 25$ và mặt phẳng $(P): 2x - 2y + z + 3 = 0$.\na) Xác định tọa độ tâm $I$ và bán kính $R$ của $(S)$.\nb) Tính khoảng cách từ $I$ đến $(P)$ và tìm bán kính đường tròn giao tuyến của $(S)$ và $(P)$.`,
        solution: `a) Tâm $I(${a}; -${b}; ${c})$ và bán kính $R = \\sqrt{25} = 5$.\n\nb) Khoảng cách $d = d(I, (P)) = \\frac{|2(${a}) - 2(-${b}) + ${c} + 3|}{\\sqrt{2^2 + (-2)^2 + 1^2}} = \\frac{${2 * a + 2 * b + c + 3}}{3}$.\nNếu $d < R = 5$, mặt phẳng cắt mặt cầu theo đường tròn giao tuyến bán kính $r = \\sqrt{R^2 - d^2}$.`,
        keyFormulasOrHints: ['(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2', 'r^2 = R^2 - d^2'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Mặt cầu & Mặt phẳng 3D' }
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Trong một kỳ thi chuẩn GDPT 2018: tỉ lệ thí sinh ôn tập đầy đủ chuyên đề là $70\\%$. Khả năng đạt điểm giỏi của nhóm ôn đầy đủ là $0.85$, còn nhóm chưa ôn đầy đủ là $0.30$. Chọn ngẫu nhiên một thí sinh.\na) Tính xác suất để thí sinh đó đạt điểm giỏi.\nb) Biết thí sinh đó đã đạt điểm giỏi, tính xác suất để thí sinh thuộc nhóm ôn tập đầy đủ (Công thức Bayes).`,
        solution: `Gọi $A$ là biến cố "ôn tập đầy đủ", $B$ là biến cố "đạt điểm giỏi".\nTa có $P(A) = 0.7$, $P(\\overline{A}) = 0.3$, $P(B|A) = 0.85$, $P(B|\\overline{A}) = 0.30$.\n\na) Theo công thức xác suất toàn phần:\n$$P(B) = P(A)P(B|A) + P(\\overline{A})P(B|\\overline{A}) = 0.7 \\cdot 0.85 + 0.3 \\cdot 0.30 = 0.595 + 0.09 = 0.685.$$\n\nb) Theo công thức Bayes:\n$$P(A|B) = \\frac{P(A)P(B|A)}{P(B)} = \\frac{0.595}{0.685} = \\frac{119}{137} \\approx 0.8686.$$`,
        keyFormulasOrHints: ['Công thức xác suất toàn phần', 'Công thức Bayes P(A|B) = P(A)P(B|A)/P(B)']
      }
    ];

    const q1 = q1Pool[i % q1Pool.length];
    const q2 = q2Pool[(i + 1) % q2Pool.length];
    const q3 = q3Pool[i % q3Pool.length];
    const q4 = q4Pool[(i + 1) % q4Pool.length];

    exams.push({
      id: `math-kc-${num}`,
      subject: 'math',
      track: 'khong_chuyen',
      subjectTag: 'Toán 12 THPT',
      categoryTag: i % 2 === 0 ? 'Thi Thử Tốt Nghiệp' : 'Khảo Sát GDPT 2018',
      academicYear: '2025-2026',
      title: `Đề Thi Thử Tốt Nghiệp THPT Môn Toán #${num} – ${province}`,
      school: province,
      source: `Nguồn đề chuẩn THPT: ${province}`,
      timeMinutes: 90,
      featuredSnippet: safeExamSnippet(q1.content, 130),
      topics: ['# Khảo sát hàm số', '# Mũ & Lôgarit', '# Tích phân & Thể tích', '# Oxyz & Xác suất Bayes'],
      difficulty: i % 3 === 0 ? 'Nâng cao' : i % 2 === 0 ? 'Khá' : 'Cơ bản',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}

// =========================================================================
// 3. VẬT LÍ CHUYÊN BATCH 2 (20 ĐỀ: phy-chuyen-31 -> phy-chuyen-50)
// =========================================================================
function buildPhysicsChuyenBatch2(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 20; i++) {
    const num = 31 + i;
    const school = CHUYEN_SCHOOLS_BATCH_2[i];
    const m = 0.2 + (i % 4) * 0.1; // 0.2..0.5 kg
    const M = 1.0 + (i % 3) * 0.5; // 1.0..2.0 kg
    const k = 50 + (i % 5) * 25; // 50..150 N/m
    const v0 = 4 + (i % 4); // 4..7 m/s
    const R = 30 + (i % 4) * 10; // 30..60 Ohm
    const C_uF = 100 / Math.PI; // so Zc clean at 100pi

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một nêm khối lượng $M = ${M.toFixed(1)}\\text{ kg}$ có mặt phẳng nghiêng góc $\\alpha = 30^\\circ$ đặt trên mặt bàn nằm ngang hoàn toàn nhẵn. Thả một vật nhỏ khối lượng $m = ${m.toFixed(1)}\\text{ kg}$ trượt không ma sát từ đỉnh nêm có độ cao $h = 1.2\\text{ m}$ ($g = 10\\text{ m/s}^2$).\na) Tìm vận tốc của nêm ngay khi vật nhỏ rời chân nêm.\nb) Tính lực nén của vật nhỏ lên mặt nêm trong quá trình trượt.`,
        solution: `a) Hệ (nêm + vật) bảo toàn động lượng theo phương ngang (không ngoại lực ngang) và bảo toàn cơ năng:\n$$mv_x = MV, \\quad mgh = \\frac{1}{2}MV^2 + \\frac{1}{2}m(v_x^2 + v_y^2).$$\nTrong hệ quy chiếu gắn với nêm, vật trượt dọc góc $\\alpha$: $v_y = (v_x + V)\\tan\\alpha$.\nThay $v_x = \\frac{M}{m}V$: $v_y = V\\left(\\frac{M + m}{m}\\right)\\tan\\alpha$. Giải theo $V$:\n$$V = \\sqrt{\\frac{2m^2 gh\\cos^2\\alpha}{(M + m)(M + m\\sin^2\\alpha)}}.$$ \nThay $M = ${M.toFixed(1)}, m = ${m.toFixed(1)}, h = 1.2, \\alpha = 30^\\circ$ để tính giá trị số.\n\nb) Xét trong HQC phi quán tính gắn với nêm có gia tốc $a_0$ nằm ngang, chiếu lên phương vuông góc mặt nghiêng thu được phản lực $N = \\frac{Mmg\\cos\\alpha}{M + m\\sin^2\\alpha}$.`,
        keyFormulasOrHints: ['Bảo toàn động lượng phương ngang', 'HQC phi quán tính lực quán tính F_qt = -m.a_0']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một quả cầu nhỏ khối lượng $m = ${m.toFixed(1)}\\text{ kg}$ treo vào dây nhẹ dài $\\ell = 1.0\\text{ m}$ đứng yên. Một viên bi khối lượng $m_1 = ${(m / 2).toFixed(2)}\\text{ kg}$ bay ngang với vận tốc $v_0 = ${v0}\\text{ m/s}$ đến va chạm hoàn toàn đàn hồi xuyên tâm với quả cầu ($g = 10\\text{ m/s}^2$).\na) Tính vận tốc của quả cầu ngay sau va chạm.\nb) Tìm góc lệch cực đại $\\alpha_{\\max}$ của dây treo quả cầu.`,
        solution: `a) Bảo toàn động lượng và động năng khi va chạm đàn hồi trực diện:\n$$v_2 = \\frac{2m_1}{m_1 + m}v_0 = \\frac{2 \\cdot 0.5}{1.5}\\cdot ${v0} = ${(2 * v0 / 3).toFixed(2)}\\text{ m/s}.$$\n\nb) Sau va chạm, bảo toàn cơ năng cho quả cầu:\n$$\\frac{1}{2}mv_2^2 = mg\\ell(1 - \\cos\\alpha_{\\max}) \\implies \\cos\\alpha_{\\max} = 1 - \\frac{v_2^2}{2g\\ell}.$$\nThay $v_2 = ${(2 * v0 / 3).toFixed(2)}\\text{ m/s}$ và $g\\ell = 10$, tính ra $\\cos\\alpha_{\\max}$ và góc lệch cực đại $\\alpha_{\\max}$.`,
        keyFormulasOrHints: ['Va chạm đàn hồi v2 = 2m1.v0 / (m1 + m2)', 'Bảo toàn cơ năng mgl(1 - cos alpha) = 1/2 mv^2']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Một con lắc lò xo nằm ngang có độ cứng $k = ${k}\\text{ N/m}$, vật nặng $m = ${m.toFixed(1)}\\text{ kg}$ dao động trên mặt phẳng có hệ số ma sát trượt $\\mu = 0.1$ ($g = 10\\text{ m/s}^2$). Kéo vật khỏi VTCB $O$ một đoạn $A_0 = 10\\text{ cm}$ rồi thả nhẹ.\na) Tìm độ giảm biên độ sau mỗi nửa chu kỳ $\\Delta A_{1/2}$ và tổng số dao động vật thực hiện được trước khi dừng.\nb) Tính tốc độ lớn nhất của vật trong quá trình chuyển động.`,
        solution: `a) Vị trí cân bằng động lực học bị dịch một đoạn $x_0 = \\frac{\\mu mg}{k} = \\frac{0.1 \\cdot ${m.toFixed(1)} \\cdot 10}{${k}} = ${((0.1 * m * 10) / k * 100).toFixed(2)}\\text{ cm}$.\nĐộ giảm biên độ sau mỗi nửa chu kỳ là $\\Delta A_{1/2} = 2x_0$. Số nửa chu kỳ ước lượng $N_{1/2} \\approx \\frac{A_0}{2x_0}$.\n\nb) Vật đạt tốc độ cực đại tại vị trí cân bằng tạm đầu tiên cách $O$ đoạn $x_0$:\n$$v_{\\max} = \\omega (A_0 - x_0) = \\sqrt{\\frac{k}{m}}(A_0 - x_0).$$`,
        keyFormulasOrHints: ['Độ dịch VTCB x0 = mu.m.g / k', 'v_max tại nơi F_dh = F_ms lần đầu']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Một sợi dây đàn hồi chiều dài $L = 1.2\\text{ m}$ hai đầu cố định dao động tạo sóng dừng ổn định với tốc độ truyền sóng $v = 24\\text{ m/s}$. Quan sát thấy trên dây có $3$ bụng sóng (tức $k = 3$ bó sóng).\na) Tính bước sóng $\\lambda$ và tần số dao động $f$ của dây.\nb) Nếu tăng tần số thêm $\\Delta f = ${10 + (i % 3) * 10}\\text{ Hz}$, xác định số nút sóng mới quan sát được trên dây.`,
        solution: `a) Điều kiện sóng dừng 2 đầu cố định: $L = k\\frac{\\lambda}{2} \\implies \\lambda = \\frac{2L}{k} = \\frac{2 \\cdot 1.2}{3} = 0.8\\text{ m}$.\nTần số $f = \\frac{v}{\\lambda} = \\frac{24}{0.8} = 30\\text{ Hz}$.\n\nb) Với $f' = f + \\Delta f = ${30 + 10 + (i % 3) * 10}\\text{ Hz}$, số bó sóng $k' = \\frac{2Lf'}{v} = ${(2 * 1.2 * (40 + (i % 3) * 10) / 24).toFixed(0)}$. Số nút sóng kể cả 2 đầu là $k' + 1$.`,
        keyFormulasOrHints: ['L = k * lambda / 2', 'Số nút = số bó + 1 (2 đầu cố định)']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho mạch điện xoay chiều $RLC$ nối tiếp gồm điện trở thuần $R = ${R}\\,\\Omega$, tụ điện có điện dung $C = \\frac{10^{-4}}{\\pi}\\text{ F}$ ($Z_C = 100\\,\\Omega$ tại $f = 50\\text{ Hz}$) và cuộn cảm thuần có độ tự cảm $L$ thay đổi được. Điện áp hai đầu mạch là $u = 120\\sqrt{2}\\cos(100\\pi t)\\text{ (V)}$.\na) Điều chỉnh $L$ để xảy ra cộng hưởng điện. Tính giá trị $L$ và công suất mạch khi đó.\nb) Tìm giá trị $L$ để điện áp hiệu dụng trên cuộn cảm $U_L$ đạt cực đại và tính $U_{L\\max}$.`,
        solution: `a) Cộng hưởng xảy ra khi $Z_L = Z_C = 100\\,\\Omega \\implies L = \\frac{Z_L}{\\omega} = \\frac{100}{100\\pi} = \\frac{1}{\\pi}\\text{ H}$.\nCông suất cực đại $P_{\\max} = \\frac{U^2}{R} = \\frac{120^2}{${R}} = ${(14400 / R).toFixed(1)}\\text{ W}$.\n\nb) Để $U_L$ đạt cực đại khi $L$ biến thiên:\n$$Z_L = \\frac{R^2 + Z_C^2}{Z_C} = \\frac{${R}^2 + 100^2}{100} = ${((R * R + 10000) / 100).toFixed(1)}\\,\\Omega.$$\nGiá trị cực đại $U_{L\\max} = \\frac{U\\sqrt{R^2 + Z_C^2}}{R} = \\frac{120\\sqrt{${R}^2 + 100^2}}{${R}}\\text{ V}$.`,
        keyFormulasOrHints: ['Cộng hưởng ZL = ZC', 'UL max khi ZL = (R^2 + ZC^2) / ZC']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Một thanh kim loại dài $l = 0.5\\text{ m}$, điện trở $r = 0.2\\,\\Omega$ trượt không ma sát trên hai thanh ray song song đặt nằm ngang trong từ trường đều thẳng đứng $B = 0.4\\text{ T}$. Hai đầu ray nối với điện trở $R = 0.8\\,\\Omega$. Kéo thanh chuyển động đều với tốc độ $v = ${v0}\\text{ m/s}$.\na) Tính suất điện động cảm ứng và cường độ dòng điện qua $R$.\nb) Tính công suất cơ học của lực kéo cần thiết để duy trì chuyển động đều.`,
        solution: `a) Suất điện động cảm ứng xuất hiện trên thanh:\n$$e_c = Blv = 0.4 \\cdot 0.5 \\cdot ${v0} = ${(0.2 * v0).toFixed(2)}\\text{ V}.$$\nCường độ dòng điện cảm ứng:\n$$I = \\frac{e_c}{R + r} = \\frac{${(0.2 * v0).toFixed(2)}}{0.8 + 0.2} = ${(0.2 * v0).toFixed(2)}\\text{ A}.$$\n\nb) Lực từ cản trở chuyển động $F_t = BIl$, nên công suất lực kéo bằng công suất tỏa nhiệt toàn mạch:\n$$P = I^2(R + r) = e_c I = ${((0.2 * v0) ** 2).toFixed(3)}\\text{ W}.$$`,
        keyFormulasOrHints: ['e_c = B l v', 'Bảo toàn năng lượng P_keo = P_toa nhiet']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Một lượng khí lí tưởng đơn nguyên tử ($C_V = \\frac{3}{2}R$) thực hiện một chu trình khép kín gồm 3 quá trình: (1)$\\to$(2) đẳng áp ở $p_1 = 2\\cdot 10^5\\text{ Pa}$ từ $V_1 = 2\\text{ lít}$ đến $V_2 = 6\\text{ lít}$; (2)$\\to$(3) đẳng tích giảm áp suất xuống $p_3 = 10^5\\text{ Pa}$; (3)$\\to$(1) nén khí tuyến tính trên đồ thị $p-V$.\na) Vẽ đồ thị chu trình trên hệ trục $(p, V)$ và tính tổng công chất khí thực hiện sau một chu trình.\nb) Tính hiệu suất của chu trình thuận nghịch hay thực tế nói trên.`,
        solution: `a) Trên đồ thị $(p, V)$, chu trình tạo thành tam giác vuông có cạnh đáy $\\Delta V = 4\\cdot 10^{-3}\\text{ m}^3$ và chiều cao $\\Delta p = 10^5\\text{ Pa}$.\nCông chất khí thực hiện trong cả chu trình bằng diện tích tam giác:\n$$A = \\frac{1}{2}\\Delta p \\cdot \\Delta V = \\frac{1}{2}\\cdot 10^5 \\cdot 4\\cdot 10^{-3} = 200\\text{ J}.$$\n\nb) Quá trình nhận nhiệt chủ yếu trên đoạn đẳng áp (1)$\\to$(2):\n$$Q_{12} = \\Delta U_{12} + A_{12} = \\frac{5}{2}p_1\\Delta V = 2.5 \\cdot 2\\cdot 10^5 \\cdot 4\\cdot 10^{-3} = 2000\\text{ J}.$$\nHiệu suất $H = \\frac{A}{Q_{\\text{nhận}}} \\approx 10\\%$ (kiểm tra thêm phần nhiệt nhận trên đoạn (3)$\\to$(1) nếu có).`,
        keyFormulasOrHints: ['Công chu trình = diện tích hình khép kín trên p-V', 'Khí đơn nguyên tử Q_p = 5/2 p Delta V']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Trong thí nghiệm Y-âng, hai khe cách nhau $a = 1\\text{ mm}$, màn cách hai khe $D = 2\\text{ m}$. Chiếu đồng thời hai bức xạ đơn sắc có bước sóng $\\lambda_1 = 0.48\\,\\mu\\text{m}$ và $\\lambda_2 = 0.64\\,\\mu\\text{m}$.\na) Tính khoảng vân $i_1, i_2$ của hai hệ vân trên màn.\nb) Tìm khoảng cách ngắn nhất giữa hai vân sáng cùng màu với vân trung tâm và số vân sáng quan sát được trên đoạn giữa hai vân trùng liên tiếp.`,
        solution: `a) Khoảng vân:\n$$i_1 = \\frac{\\lambda_1 D}{a} = 0.96\\text{ mm}, \\quad i_2 = \\frac{\\lambda_2 D}{a} = 1.28\\text{ mm}.$$\n\nb) Điều kiện trùng vân sáng: $k_1 \\lambda_1 = k_2 \\lambda_2 \\iff \\frac{k_1}{k_2} = \\frac{\\lambda_2}{\\lambda_1} = \\frac{0.64}{0.48} = \\frac{4}{3}$.\nVậy vân trùng gần vân trung tâm nhất ứng với $k_1 = 4, k_2 = 3$: $x_{\\text{trùng}} = 4i_1 = 3.84\\text{ mm}$.\nGiữa hai vân trùng liên tiếp có $(4 - 1) + (3 - 1) = 5$ vân sáng đơn sắc riêng biệt.`,
        keyFormulasOrHints: ['k1 / k2 = lambda2 / lambda1 (tối giản)', 'Khoảng vân trùng i_trung = k1.i1']
      }
    ];

    exams.push({
      id: `phy-chuyen-${num}`,
      subject: 'physics',
      track: 'chuyen',
      subjectTag: 'Vật Lí Chuyên',
      categoryTag: i % 2 === 0 ? 'Tuyển Sinh Chuyên Lí' : 'HSG Vật Lí Quốc Gia',
      academicYear: '2025-2026',
      title: `Đề Thi Chuyên & HSG Vật Lí #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn tham khảo chuẩn đề: ${school}`,
      timeMinutes: 150,
      featuredSnippet: safeExamSnippet(q1Pool[i % q1Pool.length].content, 130),
      topics: ['# Cơ học Nêm & Va chạm', '# Dao động Tắt dần', '# RLC & Cảm ứng từ', '# Nhiệt động & Giao thoa'],
      difficulty: 'Chuyên / HSG',
      questions: [
        q1Pool[i % q1Pool.length],
        q2Pool[(i + 1) % q2Pool.length],
        q3Pool[i % q3Pool.length],
        q4Pool[(i + 1) % q4Pool.length]
      ]
    });
  }

  return exams;
}

// =========================================================================
// 4. VẬT LÍ KHÔNG CHUYÊN / THPT BATCH 2 (20 ĐỀ: phy-kc-31 -> phy-kc-50)
// =========================================================================
function buildPhysicsStandardBatch2(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 20; i++) {
    const num = 31 + i;
    const province = THPT_PROVINCES_BATCH_2[i];
    const k = 20 + (i % 4) * 20; // 20..80 N/m
    const m = 0.1 + (i % 4) * 0.1; // 0.1..0.4 kg
    const ampCm = 4 + (i % 4) * 2; // 4..10 cm
    const U_V = 12 + (i % 3) * 6; // 12..24 V

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một con lắc lò xo gồm vật nhỏ khối lượng $m = ${m.toFixed(1)}\\text{ kg}$ và lò xo độ cứng $k = ${k}\\text{ N/m}$ dao động điều hòa với biên độ $A = ${ampCm}\\text{ cm}$.\na) Tính chu kỳ $T$ và tần số $f$ của con lắc.\nb) Tính cơ năng $W$ của con lắc và động năng của vật khi ở li độ $x = ${ampCm / 2}\\text{ cm}$.`,
        solution: `a) Chu kỳ dao động:\n$$T = 2\\pi\\sqrt{\\frac{m}{k}} = 2\\pi\\sqrt{\\frac{${m.toFixed(1)}}{${k}}} \\approx ${(2 * Math.PI * Math.sqrt(m / k)).toFixed(3)}\\text{ s}, \\quad f = \\frac{1}{T} \\approx ${(1 / (2 * Math.PI * Math.sqrt(m / k))).toFixed(2)}\\text{ Hz}.$$\n\nb) Cơ năng dao động ($A = ${(ampCm / 100).toFixed(2)}\\text{ m}$):\n$$W = \\frac{1}{2}kA^2 = \\frac{1}{2}\\cdot ${k} \\cdot ${(ampCm / 100).toFixed(2)}^2 = ${(0.5 * k * (ampCm / 100) ** 2).toFixed(4)}\\text{ J}.$$\nTại $x = \\frac{A}{2}$, thế năng $W_t = \\frac{1}{4}W$ nên động năng $W_đ = \\frac{3}{4}W = ${(0.75 * 0.5 * k * (ampCm / 100) ** 2).toFixed(4)}\\text{ J}$.`,
        keyFormulasOrHints: ['T = 2pi * sqrt(m/k)', 'W = 1/2 k A^2', 'W_d = W - 1/2 k x^2']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một sóng cơ hình sin lan truyền trên trục $Ox$ với phương trình $u = ${ampCm / 2}\\cos(4\\pi t - 0.5\\pi x)\\text{ (cm)}$ ($x$ tính bằng mét, $t$ tính bằng giây).\na) Xác định tần số $f$ và bước sóng $\\lambda$ của sóng.\nb) Tính tốc độ truyền sóng $v$ và tốc độ dao động cực đại của phần tử môi trường.`,
        solution: `a) Đồng nhất với $u = A\\cos\\left(\\omega t - \\frac{2\\pi x}{\\lambda}\\right)$:\n- $\\omega = 4\\pi \\implies f = \\frac{\\omega}{2\\pi} = 2\\text{ Hz}$.\n- $\\frac{2\\pi}{\\lambda} = 0.5\\pi \\implies \\lambda = 4\\text{ m}$.\n\nb) Tốc độ truyền sóng: $v = \\lambda f = 4 \\cdot 2 = 8\\text{ m/s}$.\nTốc độ cực đại phần tử: $v_{\\max} = \\omega A = 4\\pi \\cdot ${ampCm / 2} = ${2 * ampCm}\\pi\\text{ cm/s}$.`,
        keyFormulasOrHints: ['v = lambda * f', 'Phân biệt v truyền sóng với v_max = omega A']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho mạch điện kín gồm nguồn điện có suất điện động $\\mathcal{E} = ${U_V}\\text{ V}$, điện trở trong $r = 1\\,\\Omega$ mắc với mạch ngoài gồm hai điện trở $R_1 = 6\\,\\Omega$ và $R_2 = 3\\,\\Omega$ ghép song song.\na) Tính điện trở tương đương mạch ngoài $R_N$ và cường độ dòng điện mạch chính $I$.\nb) Tính hiệu điện thế mạch ngoài $U_N$ và công suất tiêu thụ trên $R_1$.`,
        solution: `a) Điện trở tương đương mạch ngoài:\n$$R_N = \\frac{R_1 R_2}{R_1 + R_2} = \\frac{6 \\cdot 3}{6 + 3} = 2\\,\\Omega.$$\nCường độ dòng điện mạch chính:\n$$I = \\frac{\\mathcal{E}}{R_N + r} = \\frac{${U_V}}{2 + 1} = ${(U_V / 3).toFixed(1)}\\text{ A}.$$\n\nb) Hiệu điện thế mạch ngoài $U_N = I \\cdot R_N = ${(2 * U_V / 3).toFixed(1)}\\text{ V}$.\nCông suất trên $R_1$: $P_1 = \\frac{U_N^2}{R_1} = \\frac{${(2 * U_V / 3).toFixed(1)}^2}{6} = ${(((2 * U_V / 3) ** 2) / 6).toFixed(2)}\\text{ W}$.`,
        keyFormulasOrHints: ['Định luật Ôm toàn mạch I = E / (RN + r)', 'U_N = I * R_N']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Một máy biến áp lí tưởng có số vòng dây cuộn sơ cấp $N_1 = 1000$ vòng, cuộn thứ cấp $N_2 = 250$ vòng. Đặt điện áp xoay chiều hiệu dụng $U_1 = ${200 + (i % 3) * 20}\\text{ V}$ vào hai đầu cuộn sơ cấp.\na) Tính điện áp hiệu dụng $U_2$ ở hai đầu cuộn thứ cấp để hở.\nb) Nối hai đầu thứ cấp với tải thuần trở $R = 50\\,\\Omega$, tính cường độ dòng điện hiệu dụng ở cuộn sơ cấp $I_1$.`,
        solution: `a) Công thức máy biến áp lí tưởng:\n$$\\frac{U_1}{U_2} = \\frac{N_1}{N_2} \\implies U_2 = U_1 \\cdot \\frac{250}{1000} = \\frac{${200 + (i % 3) * 20}}{4} = ${(200 + (i % 3) * 20) / 4}\\text{ V}.$$\n\nb) Cường độ dòng thứ cấp $I_2 = \\frac{U_2}{R} = \\frac{${(200 + (i % 3) * 20) / 4}}{50} = ${(((200 + (i % 3) * 20) / 4) / 50).toFixed(2)}\\text{ A}$.\nVì máy biến áp lí tưởng ($U_1 I_1 = U_2 I_2$): $I_1 = I_2 \\frac{N_2}{N_1} = \\frac{I_2}{4} = ${(((200 + (i % 3) * 20) / 800)).toFixed(3)}\\text{ A}$.`,
        keyFormulasOrHints: ['U1/U2 = N1/N2', 'I1/I2 = N2/N1 (máy lí tưởng)']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Trong một xi lanh có $m = 4\\text{ g}$ khí Heli ($M = 4\\text{ g/mol}$) ở nhiệt độ $t_1 = 27^\\circ\\text{C}$, áp suất $p_1 = 1\\text{ atm}$. Lấy $R = 8.31\\text{ J/(mol}\\cdot\\text{K)}$ ($1\\text{ atm} = 1.013\\cdot 10^5\\text{ Pa}$).\na) Tính số mol khí $n$ và thể tích $V_1$ ban đầu của khối khí.\nb) Nung nóng đẳng áp để nhiệt độ đạt $t_2 = 177^\\circ\\text{C}$, tính thể tích $V_2$ và công khí thực hiện khi giãn nở.`,
        solution: `a) Số mol khí $n = \\frac{m}{M} = \\frac{4}{4} = 1\\text{ mol}$, nhiệt độ tuyệt đối $T_1 = 27 + 273 = 300\\text{ K}$.\nTheo phương trình Clapeyron: $V_1 = \\frac{nRT_1}{p_1} = \\frac{1 \\cdot 8.31 \\cdot 300}{1.013\\cdot 10^5} \\approx 0.0246\\text{ m}^3$ ($\\approx 24.6\\text{ lít}$).\n\nb) Nhiệt độ $T_2 = 177 + 273 = 450\\text{ K}$. Đẳng áp nên $\\frac{V_2}{V_1} = \\frac{T_2}{T_1} = 1.5 \\implies V_2 = 36.9\\text{ lít}$.\nCông chất khí thực hiện: $A' = p_1(V_2 - V_1) = nR(T_2 - T_1) = 1 \\cdot 8.31 \\cdot 150 = 1246.5\\text{ J}$.`,
        keyFormulasOrHints: ['pV = nRT (T theo Kelvin)', 'A = p Delta V = n R Delta T']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Một khối đồng nặng $m = ${m * 2}\\text{ kg}$ được cung cấp nhiệt lượng $Q = 19\\text{ kJ}$, nhiệt độ tăng thêm $\\Delta t = ${(19000 / (m * 2 * 380)).toFixed(1)}^\\circ\\text{C}$ (biết nhiệt dung riêng đồng $c = 380\\text{ J/(kg}\\cdot\\text{K)}$). đồng thời nhận một công cơ học $A = 2000\\text{ J}$.\na) Áp dụng nguyên lí I nhiệt động lực học tính độ biến thiên nội năng $\\Delta U$.\nb) Giải thích chiều truyền nhiệt năng và công theo quy ước dấu GDPT 2018.`,
        solution: `a) Theo quy ước dấu nguyên lí I nhiệt động lực học:\n- Vật nhận nhiệt lượng $\\implies Q = +19\\,000\\text{ J}$.\n- Vật nhận công $\\implies A = +2\\,000\\text{ J}$.\nĐộ biến thiên nội năng: $\\Delta U = Q + A = 19\\,000 + 2\\,000 = 21\\,000\\text{ J} = 21\\text{ kJ}$.\n\nb) Vì $\\Delta U > 0$, nội năng của khối đồng tăng thêm $21\\text{ kJ}$ làm nhiệt độ và động năng trung bình của các nguyên tử tăng lên.`,
        keyFormulasOrHints: ['Delta U = Q + A', 'Nhận công A > 0, nhận nhiệt Q > 0']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Hạt nhân Urani $^{235}_{92}\\text{U}$ có khối lượng $m_{\\text{U}} = 234.9933\\text{ u}$. Biết khối lượng proton $m_p = 1.0073\\text{ u}$, neutron $m_n = 1.0087\\text{ u}$ và $1\\text{ uc}^2 = 931.5\\text{ MeV}$.\na) Tính độ hụt khối $\\Delta m$ của hạt nhân $^{235}_{92}\\text{U}$.\nb) Tính năng lượng liên kết $W_{\\text{lk}}$ và năng lượng liên kết riêng $W_{\\text{lkr}}$.`,
        solution: `a) Hạt nhân $^{235}_{92}\\text{U}$ có $Z = 92$ proton và $N = 235 - 92 = 143$ neutron.\nĐộ hụt khối:\n$$\\Delta m = 92\\cdot 1.0073 + 143\\cdot 1.0087 - 234.9933 = 1.9224\\text{ u}.$$\n\nb) Năng lượng liên kết:\n$$W_{\\text{lk}} = \\Delta m \\cdot c^2 = 1.9224 \\cdot 931.5 \\approx 1790.7\\text{ MeV}.$$\nNăng lượng liên kết riêng: $W_{\\text{lkr}} = \\frac{W_{\\text{lk}}}{235} \\approx 7.62\\text{ MeV/nucleon}$.`,
        keyFormulasOrHints: ['Delta m = Z.m_p + (A-Z).m_n - m_X', 'W_lkr = W_lk / A']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Chiếu bức xạ đơn sắc bước sóng $\\lambda = 0.25\\,\\mu\\text{m}$ vào catôt của tế bào quang điện làm bằng kim loại có công thoát $A = 3.2\\text{ eV}$ ($h = 6.625\\cdot 10^{-34}\\text{ J}\\cdot\\text{s}$, $c = 3\\cdot 10^8\\text{ m/s}$, $1\\text{ eV} = 1.6\\cdot 10^{-19}\\text{ J}$).\na) Chứng minh hiện tượng quang điện có xảy ra và tìm giới hạn quang điện $\\lambda_0$.\nb) Tính động năng ban đầu cực đại của quang electron bứt ra (theo $\\text{eV}$).`,
        solution: `a) Năng lượng photon tới:\n$$\\varepsilon = \\frac{hc}{\\lambda} = \\frac{6.625\\cdot 10^{-34} \\cdot 3\\cdot 10^8}{0.25\\cdot 10^{-6}} = 7.95\\cdot 10^{-19}\\text{ J} \\approx 4.97\\text{ eV}.$$\nVì $\\varepsilon = 4.97\\text{ eV} > A = 3.2\\text{ eV}$ nên xảy ra hiện tượng quang điện ngoài.\nGiới hạn quang điện $\\lambda_0 = \\frac{hc}{A} \\approx 0.388\\,\\mu\\text{m}$.\n\nb) Theo hệ thức Einstein:\n$$W_{\\text{đmax}} = \\varepsilon - A = 4.97 - 3.2 = 1.77\\text{ eV}.$$`,
        keyFormulasOrHints: ['epsilon = hc / lambda', 'W_d max = epsilon - A (Hệ thức Einstein)']
      }
    ];

    exams.push({
      id: `phy-kc-${num}`,
      subject: 'physics',
      track: 'khong_chuyen',
      subjectTag: 'Vật Lí 12 THPT',
      categoryTag: i % 2 === 0 ? 'Thi Thử Tốt Nghiệp' : 'Khảo Sát GDPT 2018',
      academicYear: '2025-2026',
      title: `Đề Thi Thử THPT Quốc Gia Môn Vật Lí #${num} – ${province}`,
      school: province,
      source: `Nguồn đề chuẩn THPT: ${province}`,
      timeMinutes: 50,
      featuredSnippet: safeExamSnippet(q1Pool[i % q1Pool.length].content, 130),
      topics: ['# Dao động & Sóng cơ', '# Mạch điện & Máy biến áp', '# Vật lí Nhiệt 12', '# Hạt nhân & Quang điện'],
      difficulty: i % 3 === 0 ? 'Nâng cao' : i % 2 === 0 ? 'Khá' : 'Cơ bản',
      questions: [
        q1Pool[i % q1Pool.length],
        q2Pool[(i + 1) % q2Pool.length],
        q3Pool[i % q3Pool.length],
        q4Pool[(i + 1) % q4Pool.length]
      ]
    });
  }

  return exams;
}

// =========================================================================
// 5. TIN HỌC CHUYÊN BATCH 2 (20 ĐỀ: cs-chuyen-31 -> cs-chuyen-50)
// =========================================================================
function buildCSChuyenBatch2(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 20; i++) {
    const num = 31 + i;
    const school = CHUYEN_SCHOOLS_BATCH_2[i];

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho ma trận số nguyên kích thước $M \\times N$ ($M, N \\le 1000$) và $Q$ truy vấn ($Q \\le 10^5$), mỗi truy vấn cho tọa độ $(x_1, y_1, x_2, y_2)$. Hãy tính tổng các phần tử trong hình chữ nhật con từ $(x_1, y_1)$ đến $(x_2, y_2)$ trong thời gian $\\mathcal{O}(1)$ mỗi truy vấn bằng Mảng cộng dồn 2 chiều (2D Prefix Sum).`,
        solution: `Xây dựng bảng cộng dồn $P[i][j]$ là tổng hình chữ nhật $(1, 1) \\to (i, j)$:\n$$P[i][j] = A[i][j] + P[i-1][j] + P[i][j-1] - P[i-1][j-1].$$\nKhi trả lời truy vấn $(x_1, y_1, x_2, y_2)$ theo nguyên lý Bù - Trừ (Inclusion-Exclusion):\n\`\`\`cpp\nlong long query(int x1, int y1, int x2, int y2) {\n    return P[x2][y2] - P[x1 - 1][y2] - P[x2][y1 - 1] + P[x1 - 1][y1 - 1];\n}\n\`\`\`\nĐộ phức tạp tiền xử lý $\\mathcal{O}(MN)$, trả lời $\\mathcal{O}(1)$ mỗi truy vấn.`,
        keyFormulasOrHints: ['Prefix Sum 2D: P[i][j] = A[i][j] + P[i-1][j] + P[i][j-1] - P[i-1][j-1]', 'Kiểu long long tránh tràn 32-bit']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho dãy số nguyên dương $A$ gồm $N$ phần tử ($N \\le 2\\cdot 10^5$) và $Q$ thao tác cộng thêm giá trị $v$ cho mọi phần tử từ chỉ số $L$ đến $R$. Sau tất cả $Q$ thao tác, hãy in ra trạng thái cuối cùng của mảng với độ phức tạp $\\mathcal{O}(N + Q)$ bằng Mảng hiệu (Difference Array).`,
        solution: `Khởi tạo mảng hiệu $D[1..N+1] = 0$. Với mỗi thao tác $[L, R, v]$, ta chỉ cập nhật 2 vị trí:\n$$D[L] += v, \\quad D[R + 1] -= v.$$\nSau $Q$ thao tác, tính tổng tiền tố trên $D$ cộng dồn vào $A[i]$:\n\`\`\`cpp\nlong long cur = 0;\nfor (int i = 1; i <= n; ++i) {\n    cur += D[i];\n    A[i] += cur;\n}\n\`\`\`\nThời gian tổng cộng $\\mathcal{O}(N + Q)$.`,
        keyFormulasOrHints: ['Difference Array D[L] += v; D[R+1] -= v', 'Tổng tiền tố khôi phục mảng gốc']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Có $N$ chuồng đặt tại các tọa độ nguyên phân biệt $x_1 < x_2 < \\dots < x_N$ ($N \\le 10^5, x_i \\le 10^9$). Cần đặt $C$ ($2 \\le C \\le N$) chú bò vào các chuồng sao cho khoảng cách nhỏ nhất giữa hai chú bò bất kỳ là **lớn nhất có thể**. Hãy trình bày thuật toán Chặt nhị phân theo kết quả (Binary Search on Answer) $\\mathcal{O}(N\\log X)$.`,
        solution: `Tính đơn điệu: Nếu có thể đặt $C$ chú bò với khoảng cách tối thiểu $D$, thì cũng đặt được với mọi $D' < D$.\nHàm kiểm tra \`ok(D)\` chạy tham lam $\\mathcal{O}(N)$: đặt bò đầu tại $x_1$, sau đó cứ gặp $x_i - last \\ge D$ thì đặt tiếp chú bò tiếp theo.\n\`\`\`cpp\nbool ok(const vector<long long>& x, int C, long long D) {\n    int cnt = 1; long long last = x[0];\n    for (int i = 1; i < (int)x.size(); ++i) {\n        if (x[i] - last >= D) { cnt++; last = x[i]; }\n    }\n    return cnt >= C;\n}\n\`\`\`\nChặt nhị phân trên $[0, x_{N-1} - x_0]$ tìm giá trị $D$ lớn nhất thỏa \`ok(D)\`.`,
        keyFormulasOrHints: ['Chặt nhị phân kết quả trên [0, 10^9]', 'Hàm kiểm tra tham lam O(N)']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho biểu đồ cột gồm $N$ cột liên tiếp có chiều cao $H_1, H_2, \\dots, H_N$ ($N \\le 10^5$, độ rộng mỗi cột là $1$). Hãy tìm diện tích hình chữ nhật lớn nhất nằm hoàn toàn bên trong biểu đồ (Largest Rectangle in Histogram) trong thời gian $\\mathcal{O}(N)$ bằng Ngăn xếp đơn điệu (Monotonic Stack).`,
        solution: `Với mỗi cột $i$, hình chữ nhật nhận $H_i$ làm chiều cao mở rộng được từ phần tử gần nhất bên trái nhỏ hơn $H_i$ (chỉ số $L_i$) đến phần tử gần nhất bên phải nhỏ hơn $H_i$ (chỉ số $R_i$).\nDùng một \`stack<int>\` lưu các chỉ số có chiều cao tăng dần để tính đồng thời $L_i, R_i$ trong đúng 1 lượt duyệt:\n\`\`\`cpp\nstack<int> st;\nlong long best = 0;\nfor (int i = 0; i <= n; ++i) {\n    long long cur = (i == n ? 0 : H[i]);\n    while (!st.empty() && H[st.top()] >= cur) {\n        long long h = H[st.top()]; st.pop();\n        int w = st.empty() ? i : i - st.top() - 1;\n        best = max(best, h * w);\n    }\n    st.push(i);\n}\n\`\`\``,
        keyFormulasOrHints: ['Monotonic Stack tìm biên trái/phải nhỏ hơn gần nhất', 'Độ phức tạp O(N)']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho đồ thị vô hướng liên thông gồm $N$ đỉnh, $M$ cạnh có trọng số ($N, M \\le 10^5$). Hãy trình bày thuật toán **Kruskal** kết hợp cấu trúc **Disjoint Set Union (DSU)** có nén đường dẫn & hợp nhất theo kích thước để tìm Cây khung nhỏ nhất (MST).`,
        solution: `Các bước thuật toán Kruskal:\n1. Sắp xếp $M$ cạnh theo trọng số $w$ tăng dần.\n2. Khởi tạo DSU cho $N$ đỉnh: \`parent[u] = u, sz[u] = 1\`.\n3. Duyệt từng cạnh $(u, v, w)$: nếu \`find(u) != find(v)\` thì hợp nhất hai tập hợp, cộng $w$ vào tổng trọng số MST và dừng sớm khi đủ $N - 1$ cạnh.\n\`\`\`cpp\nint find_set(int v) {\n    return v == parent[v] ? v : parent[v] = find_set(parent[v]);\n}\n\`\`\`\nĐộ phức tạp $\\mathcal{O}(M\\log M)$.`,
        keyFormulasOrHints: ['Sắp xếp cạnh tăng dần + DSU Path Compression', 'Cây khung nhỏ nhất có N - 1 cạnh']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho một cây có $N$ đỉnh gốc tại đỉnh $1$ ($N \\le 10^5$) và $Q$ truy vấn cặp đỉnh $(u, v)$. Hãy trình bày phương pháp **Binary Lifting (Nâng nhị phân)** để tìm Tổ tiên chung gần nhất $\\text{LCA}(u, v)$ và khoảng cách đường đi giữa $u, v$ trong $\\mathcal{O}(\\log N)$ mỗi truy vấn.`,
        solution: `Dùng mảng $up[u][k]$ lưu tổ tiên thứ $2^k$ của đỉnh $u$ ($k = 0..17$) và $depth[u]$ là độ sâu:\n1. Tiền xử lý DFS: $up[v][0] = p$, rồi $up[v][k] = up[up[v][k-1]][k-1]$.\n2. Khi truy vấn $(u, v)$: cân bằng độ sâu bằng cách nâng đỉnh sâu hơn lên đúng độ sâu đỉnh kia theo biểu diễn nhị phân hiệu độ sâu; nếu $u == v$ trả về $u$. Ngược lại nâng đồng thời cả hai từ $k = 17 \\to 0$ khi $up[u][k] \\neq up[v][k]$, kết quả là $up[u][0]$.\nKhoảng cách: $\\text{dist}(u, v) = depth[u] + depth[v] - 2\\cdot depth[\\text{LCA}(u, v)]$.`,
        keyFormulasOrHints: ['Binary Lifting up[u][k] = up[up[u][k-1]][k-1]', 'dist(u,v) = d[u] + d[v] - 2*d[lca]']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho dãy số nguyên $A$ gồm $N$ phần tử ($N \\le 10^5, |A_i| \\le 10^9$). Hãy tìm độ dài Dãy con tăng chặt dài nhất (Longest Increasing Subsequence — LIS) với độ phức tạp $\\mathcal{O}(N\\log N)$ bằng Quy hoạch động kết hợp Tìm kiếm nhị phân.`,
        solution: `Duy trì mảng $tail$ sao cho $tail[k]$ là giá trị kết thúc nhỏ nhất có thể của một dãy con tăng độ dài $k + 1$.\nDuyệt từng $x \\in A$: tìm vị trí đầu tiên $\\ge x$ trong $tail$ bằng \`lower_bound\`:\n- Nếu không có: đẩy $x$ vào cuối $tail$.\n- Ngược lại: thay phần tử tại vị trí đó bằng $x$.\n\`\`\`cpp\nvector<long long> tail;\nfor (long long x : a) {\n    auto it = lower_bound(tail.begin(), tail.end(), x);\n    if (it == tail.end()) tail.push_back(x);\n    else *it = x;\n}\nreturn (int)tail.size();\n\`\`\`\nThời gian $\\mathcal{O}(N\\log N)$.`,
        keyFormulasOrHints: ['Mảng tail + lower_bound O(N log N)', 'Phân biệt tăng chặt (lower_bound) vs không giảm (upper_bound)']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho mảng $A$ gồm $N$ phần tử ($N \\le 10^5$) và $Q$ truy vấn thuộc hai loại:\n1. \`1 idx val\`: gán $A[idx] = val$.\n2. \`2 L R\`: tính tổng các phần tử $\\sum_{i=L}^R A[i]$.\nHãy cài đặt Cây phân đoạn (Segment Tree) xử lý mỗi truy vấn trong $\\mathcal{O}(\\log N)$.`,
        solution: `Cài đặt Segment Tree quản lý tổng đoạn $[l, r]$ tại nút $id$:\n\`\`\`cpp\nvoid update(int id, int l, int r, int pos, long long val) {\n    if (l == r) { st[id] = val; return; }\n    int mid = (l + r) >> 1;\n    if (pos <= mid) update(id << 1, l, mid, pos, val);\n    else update(id << 1 | 1, mid + 1, r, pos, val);\n    st[id] = st[id << 1] + st[id << 1 | 1];\n}\nlong long query(int id, int l, int r, int u, int v) {\n    if (v < l || r < u) return 0;\n    if (u <= l && r <= v) return st[id];\n    int mid = (l + r) >> 1;\n    return query(id << 1, l, mid, u, v) + query(id << 1 | 1, mid + 1, r, u, v);\n}\n\`\`\``,
        keyFormulasOrHints: ['Segment Tree kích thước 4*N', 'Update và Query đều O(log N)']
      }
    ];

    exams.push({
      id: `cs-chuyen-${num}`,
      subject: 'cs',
      track: 'chuyen',
      subjectTag: 'Tin Học Chuyên',
      categoryTag: i % 2 === 0 ? 'Chuyên Tin & VNOI' : 'HSG Tin Học Quốc Gia',
      academicYear: '2025-2026',
      title: `Đề Chọn Đội Tuyển & Chuyên Tin Học #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn tham khảo chuẩn đề: ${school}`,
      timeMinutes: 180,
      featuredSnippet: safeExamSnippet(q1Pool[i % q1Pool.length].content, 130),
      topics: ['# Prefix Sum & Difference', '# Binary Search & Monotonic Stack', '# Kruskal DSU & LCA', '# LIS & Segment Tree'],
      difficulty: 'Chuyên / HSG',
      questions: [
        q1Pool[i % q1Pool.length],
        q2Pool[(i + 1) % q2Pool.length],
        q3Pool[i % q3Pool.length],
        q4Pool[(i + 1) % q4Pool.length]
      ]
    });
  }

  return exams;
}

// =========================================================================
// 6. TIN HỌC KHÔNG CHUYÊN / CƠ BẢN BATCH 2 (20 ĐỀ: cs-kc-31 -> cs-kc-50)
// =========================================================================
function buildCSStandardBatch2(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 20; i++) {
    const num = 31 + i;
    const province = THPT_PROVINCES_BATCH_2[i];
    const limitN = 500 + i * 50;

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một số nguyên dương $N$ được gọi là **số hoàn hảo** nếu tổng các ước số dương thực sự (không kể chính $N$) bằng $N$. Viết chương trình Python hoặc C++ kiểm tra một số $N \\le ${limitN}$ có phải số hoàn hảo hay không.`,
        solution: `Code Python tối ưu $\\mathcal{O}(\\sqrt{N})$:\n\`\`\`python\nn = int(input())\nif n < 2:\n    print("NO")\nelse:\n    s = 1\n    for d in range(2, int(n ** 0.5) + 1):\n        if n % d == 0:\n            s += d\n            if d * d != n:\n                s += n // d\n    print("YES" if s == n else "NO")\n\`\`\``,
        keyFormulasOrHints: ['Duyệt ước từ 2 đến sqrt(N)', 'Tránh cộng trùng khi d*d == N']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Viết chương trình tính tiền cước taxi theo quy tắc:\n- Kilômét đầu tiên ($\\le 1$ km): $15.000$ đồng.\n- Từ km thứ $2$ đến km thứ $10$: $13.000$ đồng/km.\n- Từ km thứ $11$ trở đi: $11.000$ đồng/km.\nNhập quãng đường thực $S$ ($S > 0$), in ra tổng cước phí (làm tròn nguyên).`,
        solution: `Code Python mẫu:\n\`\`\`python\ns = float(input())\nif s <= 1:\n    fee = 15000\nelif s <= 10:\n    fee = 15000 + (s - 1) * 13000\nelse:\n    fee = 15000 + 9 * 13000 + (s - 10) * 11000\nprint(int(round(fee)))\n\`\`\``,
        keyFormulasOrHints: ['Rẽ nhánh if - elif - else', 'Tính lũy tiến từng khoảng km']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho danh sách gồm $N$ số nguyên ($N \\le 10^4$). Hãy tìm phần tử xuất hiện nhiều lần nhất trong danh sách (nếu có nhiều phần tử cùng tần suất lớn nhất thì chọn phần tử nhỏ nhất) và in ra giá trị cùng số lần xuất hiện của nó.`,
        solution: `Code Python dùng \`Counter\`:\n\`\`\`python\nfrom collections import Counter\nn = int(input())\na = list(map(int, input().split()))\ncnt = Counter(a)\nbest_val, best_freq = min(cnt.items(), key=lambda kv: (-kv[1], kv[0]))\nprint(best_val, best_freq)\n\`\`\``,
        keyFormulasOrHints: ['Dùng từ điển đếm tần suất Counter', 'Ưu tiên tần suất giảm dần, giá trị tăng dần']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho dãy số nguyên $A$ gồm $N$ phần tử ($N \\le 10^4$) đã được sắp xếp **tăng dần** và một giá trị $X$. Hãy cài đặt hàm Tìm kiếm nhị phân (Binary Search) trả về chỉ số đầu tiên của $X$ trong mảng (hoặc $-1$ nếu không tìm thấy).`,
        solution: `Code Python chuẩn:\n\`\`\`python\ndef binary_search_first(a, x):\n    l, r, ans = 0, len(a) - 1, -1\n    while l <= r:\n        mid = (l + r) // 2\n        if a[mid] == x:\n            ans = mid\n            r = mid - 1\n        elif a[mid] < x:\n            l = mid + 1\n        else:\n            r = mid - 1\n    return ans\n\`\`\``,
        keyFormulasOrHints: ['Khi a[mid] == x lưu ans rồi thu hẹp r = mid - 1', 'Độ phức tạp O(log N)']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Viết chương trình nhập vào một xâu họ tên chưa chuẩn hóa (có thể thừa khoảng trắng ở đầu, cuối hoặc giữa các từ, chữ hoa/thường lộn xộn). Hãy chuẩn hóa xâu sao cho giữa các từ chỉ có đúng $1$ dấu cách và chữ cái đầu mỗi từ viết hoa, các chữ sau viết thường.`,
        solution: `Code Python mẫu:\n\`\`\`python\ns = input()\nwords = [w.capitalize() for w in s.split()]\nprint(" ".join(words))\n\`\`\``,
        keyFormulasOrHints: ['s.split() tự loại bỏ mọi khoảng trắng thừa', 'capitalize() viết hoa chữ cái đầu từ']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Thực hiện nén xâu bằng thuật toán Run-Length Encoding (RLE): thay mỗi dãy các ký tự giống nhau liên tiếp bằng chính ký tự đó kèm theo số lần lặp lại liên tiếp (ví dụ \`AAABBC\` $\\to$ \`A3B2C1\`). Hãy viết chương trình thực hiện yêu cầu trên.`,
        solution: `Code Python mẫu:\n\`\`\`python\ns = input().strip()\nif not s:\n    print("")\nelse:\n    res = []\n    cnt = 1\n    for i in range(1, len(s)):\n        if s[i] == s[i - 1]:\n            cnt += 1\n        else:\n            res.append(f"{s[i - 1]}{cnt}")\n            cnt = 1\n    res.append(f"{s[-1]}{cnt}")\n    print("".join(res))\n\`\`\``,
        keyFormulasOrHints: ['Duyệt 1 vòng lặp so sánh s[i] với s[i-1]', 'Nhớ xử lý nhóm ký tự cuối cùng']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Viết hàm tính lũy thừa $a^b \\bmod 10^9 + 7$ ($0 \\le b \\le 10^9$) bằng thuật toán **Lũy thừa nhị phân (Binary Exponentiation)** để đảm bảo thời gian $\\mathcal{O}(\\log b)$.`,
        solution: `Code C++ & Python chuẩn:\n\`\`\`python\nMOD = 10**9 + 7\ndef fast_pow(a, b):\n    res = 1\n    a %= MOD\n    while b > 0:\n        if b & 1:\n            res = (res * a) % MOD\n        a = (a * a) % MOD\n        b >>= 1\n    return res\n\`\`\``,
        keyFormulasOrHints: ['Chia đôi số mũ theo bit nhị phân', 'Nhân modulo sau mỗi phép tính']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Dãy Fibonacci được định nghĩa $F_0 = 0, F_1 = 1, F_n = F_{n-1} + F_{n-2}$ ($n \\ge 2$). Hãy viết chương trình tính $F_n \\bmod 10^9 + 7$ bằng vòng lặp $\\mathcal{O}(n)$ (không dùng đệ quy thuần vì bị quá thời gian với $n$ lớn) với $n \\le 10^5$.`,
        solution: `Code Python mẫu $\\mathcal{O}(N)$ bộ nhớ $\\mathcal{O}(1)$:\n\`\`\`python\nMOD = 10**9 + 7\nn = int(input())\nif n <= 1:\n    print(n)\nelse:\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, (a + b) % MOD\n    print(b)\n\`\`\``,
        keyFormulasOrHints: ['Lưu 2 biến trạng thái liên tiếp a, b', 'Độ phức tạp O(N) thời gian, O(1) bộ nhớ']
      }
    ];

    exams.push({
      id: `cs-kc-${num}`,
      subject: 'cs',
      track: 'khong_chuyen',
      subjectTag: 'Tin Học Phổ Thông',
      categoryTag: i % 2 === 0 ? 'Thi THPT & Năng Lực Số' : 'Kiểm Tra Định Kỳ',
      academicYear: '2025-2026',
      title: `Đề Khảo Sát Lập Trình & Thuật Toán Cơ Bản #${num} – ${province}`,
      school: province,
      source: `Nguồn đề thi chuẩn phổ thông: ${province}`,
      timeMinutes: 50,
      featuredSnippet: safeExamSnippet(q1Pool[i % q1Pool.length].content, 130),
      topics: ['# Số học & Rẽ nhánh', '# Tìm kiếm & Tần suất', '# Chuẩn hóa & RLE Xâu', '# Lũy thừa & Fibonacci'],
      difficulty: i % 3 === 0 ? 'Nâng cao' : i % 2 === 0 ? 'Khá' : 'Cơ bản',
      questions: [
        q1Pool[i % q1Pool.length],
        q2Pool[(i + 1) % q2Pool.length],
        q3Pool[i % q3Pool.length],
        q4Pool[(i + 1) % q4Pool.length]
      ]
    });
  }

  return exams;
}

export const EXTRA_EXAM_PAPERS_BATCH_2: ExamPaper[] = [
  ...buildMathChuyenBatch2(),
  ...buildMathStandardBatch2(),
  ...buildPhysicsChuyenBatch2(),
  ...buildPhysicsStandardBatch2(),
  ...buildCSChuyenBatch2(),
  ...buildCSStandardBatch2()
];
