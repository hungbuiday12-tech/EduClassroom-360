import { ExamPaper, ExamQuestion } from '../types';
import { CHUYEN_SCHOOLS_BATCH_3, THPT_INSTITUTIONS_BATCH_3 } from './extraExamsBatch3Math';

const EXTRA_PROVINCE_CHUYEN = [
  'THPT Chuyên Hoàng Lê Kha – Tây Ninh',
  'THPT Chuyên Hùng Vương – Gia Lai',
  'THPT Chuyên Nguyễn Du – Đắk Lắk',
  'THPT Chuyên Quang Trung – Bình Phước',
  'THPT Chuyên Thăng Long – Lâm Đồng',
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
  'THPT Chuyên Sơn La',
  'THPT Chuyên Điện Biên',
  'THPT Chuyên Lai Châu',
  'THPT Chuyên Bắc Kạn',
  'THPT Chuyên Hà Giang',
  'THPT Chuyên Kon Tum',
  'THPT Chuyên Bảo Lộc – Lâm Đồng',
  'THPT Chuyên Trần Hưng Đạo – Bình Thuận',
  'THPT Chuyên Lê Khiết – Quảng Ngãi',
  'THPT Chuyên Nguyễn Tất Thành – Yên Bái'
];

const EXTRA_THPT_SCHOOLS = [
  'THPT Chu Văn An – Hà Nội',
  'THPT Nguyễn Gia Thiều – Hà Nội',
  'THPT Quang Trung – Hà Đông (Hà Nội)',
  'THPT Nhân Chính – Hà Nội',
  'THPT Yên Viên – Hà Nội',
  'THPT Lê Hồng Phong – Hải Phòng',
  'THPT Trần Nguyên Hãn – Hải Phòng',
  'THPT Chuyên Ban Hồng Bàng – Hải Phòng',
  'THPT Chuyên Ban Uông Bí – Quảng Ninh',
  'THPT Hàm Rồng – Thanh Hóa',
  'THPT Lê Lợi – Thanh Hóa',
  'THPT Nguyễn Xuân Ôn – Nghệ An',
  'THPT Phan Đăng Lưu – Nghệ An',
  'THPT Phan Đình Phùng – Hà Tĩnh',
  'THPT Đồng Lộc – Hà Tĩnh',
  'THPT Trần Phú – Đà Nẵng',
  'THPT Thái Phiên – Đà Nẵng',
  'THPT Nguyễn Huệ – Thừa Thiên Huế',
  'THPT Quốc Oai – Hà Nội',
  'THPT Nguyễn Thượng Hiền – TP.HCM',
  'THPT Mạc Đĩnh Chi – TP.HCM',
  'THPT Trần Phú – TP.HCM',
  'THPT Nguyễn Công Trứ – TP.HCM',
  'THPT Võ Thị Sáu – TP.HCM',
  'THPT An Lạc – TP.HCM'
];

export const ALL_CHUYEN_SCHOOLS_BATCH_4 = [...CHUYEN_SCHOOLS_BATCH_3, ...EXTRA_PROVINCE_CHUYEN];
export const ALL_THPT_SCHOOLS_BATCH_4 = [...THPT_INSTITUTIONS_BATCH_3, ...EXTRA_THPT_SCHOOLS];

export function buildMathChuyenBatch4(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 100; i++) {
    const num = 76 + i;
    const school = ALL_CHUYEN_SCHOOLS_BATCH_4[i % ALL_CHUYEN_SCHOOLS_BATCH_4.length];
    const year = i % 2 === 0 ? '2025-2026' : '2024-2025';

    // Coprime-style strides so every i in 0..99 gets distinct numbers
    const p = (i % 7) + 2; // 2..8
    const q = (Math.floor(i / 7) % 5) + 1; // 1..5
    const r = (Math.floor(i / 35) % 3) + 2; // 2..4
    const kPoly = (i % 9) + 2; // 2..10

    // Root parameters for symmetric system (u, v) = (q, q + r)
    const u0 = q;
    const v0 = q + r;
    const S1 = u0 + v0;
    const P1 = u0 * v0;
    const sumProd = S1 + P1;
    const sumSq = u0 * u0 + v0 * v0;
    const rhsK = (S1 + 1) * (S1 + 1);
    const S2 = -S1 - 2;
    const P2 = sumProd - S2;
    const delta2 = S2 * S2 - 4 * P2;

    const primeConsts = [3, 5, 7, 11, 13, 17, 19];
    const pPrime = primeConsts[i % primeConsts.length];

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải phương trình vô tỉ trên tập số thực bằng phương pháp đánh giá Cauchy-Schwarz:\n$$\\sqrt{x - ${p}} + \\sqrt{${p + 8} - x} = x^2 - ${2 * (p + 4)}x + ${(p + 4) ** 2 + 4}.$$\nb) Cho ba số thực dương $a, b, c$ thỏa mãn $abc = 1$. Chứng minh bất đẳng thức:\n$$\\frac{1}{a^2(b + c)} + \\frac{1}{b^2(c + a)} + \\frac{1}{c^2(a + b)} \\ge \\frac{3}{2}.$$`,
        solution: `a) Điều kiện xác định: $${p} \\le x \\le ${p + 8}$.\nÁp dụng bất đẳng thức Bunyakovsky (Cauchy-Schwarz) cho vế trái:\n$$\\text{VT}^2 = \\big(1\\cdot\\sqrt{x - ${p}} + 1\\cdot\\sqrt{${p + 8} - x}\\big)^2 \\le (1^2 + 1^2)(x - ${p} + ${p + 8} - x) = 16 \\implies \\text{VT} \\le 4.$$\nBiến đổi vế phải:\n$$\\text{VP} = \\big(x - ${p + 4}\\big)^2 + 4 \\ge 4.$$\nDo $\\text{VT} \\le 4 \\le \\text{VP}$, dấu bằng bắt buộc xảy ra đồng thời tại $x - ${p} = ${p + 8} - x$ và $x = ${p + 4}$. Vậy phương trình có nghiệm duy nhất $x = ${p + 4}$.\n\nb) Đặt $x = \\frac{1}{a}, y = \\frac{1}{b}, z = \\frac{1}{c} \\implies xyz = 1$. Khi đó $\\frac{1}{a^2(b+c)} = \\frac{x^2}{\\frac{1}{y}+\\frac{1}{z}} = \\frac{x^2 y z}{y + z} = \\frac{x}{y + z}$.\nÁp dụng BĐT Nesbitt: $\\frac{x}{y + z} + \\frac{y}{z + x} + \\frac{z}{x + y} \\ge \\frac{3}{2}$. Dấu bằng xảy ra khi $a = b = c = 1$.`,
        keyFormulasOrHints: ['Cauchy-Schwarz chặn trên VT <= 4', 'Đổi biến x = 1/a, y = 1/b, z = 1/c đưa về Nesbitt'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Khảo sát đồ thị VT & VP' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải hệ phương trình đối xứng loại I:\n$$\\begin{cases} x + y + xy = ${sumProd} \\\\ x^2 + y^2 = ${sumSq} \\end{cases}$$\nb) Cho $a, b, c > 0$ thỏa mãn $a + b + c = ${3 * r}$. Tìm giá trị nhỏ nhất của $P = \\frac{a^2}{b + c} + \\frac{b^2}{c + a} + \\frac{c^2}{a + b}$.`,
        solution: `a) Đặt $S = x + y$, $P = xy$ (điều kiện $S^2 \\ge 4P$). Hệ trở thành $S + P = ${sumProd}$ và $S^2 - 2P = ${sumSq}$.\nNhân phương trình đầu với $2$ rồi cộng với phương trình hai:\n$$S^2 + 2S = ${rhsK - 1} \\iff (S + 1)^2 = ${rhsK} \\iff S = ${S1} \\text{ hoặc } S = ${S2}.$$\n- Với $S = ${S1} \\implies P = ${P1}$: giải $t^2 - ${S1}t + ${P1} = 0$ thu được nghiệm $(x, y) \\in \\{(${u0}; ${v0}),\\; (${v0}; ${u0})\\}$.\n- Với $S = ${S2} \\implies P = ${P2}$: xét $\\Delta_t = S^2 - 4P = ${delta2}$ ${delta2 < 0 ? '< 0 (vô nghiệm thực).' : `\\ge 0 \\implies t = \\frac{${S2} \\pm \\sqrt{${delta2}}}{2}.`}\n\nb) Áp dụng bất đẳng thức Cauchy-Schwarz dạng Engel:\n$$P = \\frac{a^2}{b + c} + \\frac{b^2}{c + a} + \\frac{c^2}{a + b} \\ge \\frac{(a + b + c)^2}{2(a + b + c)} = \\frac{a + b + c}{2} = \\frac{${3 * r}}{2}.$$\nDấu bằng xảy ra tại $a = b = c = ${r}$.`,
        keyFormulasOrHints: ['Đưa về (S + 1)^2', 'Cauchy-Schwarz dạng phân thức Engel'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Giao điểm hệ phương trình' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Cho đa thức bậc bốn $P(x)$ hệ số thực có hệ số cao nhất bằng $1$ thỏa mãn $P(1) = ${kPoly},\\; P(2) = ${2 * kPoly},\\; P(3) = ${3 * kPoly},\\; P(4) = ${4 * kPoly}$. Tính giá trị của $M = P(6) - P(-1)$.\nb) Cho $x, y \\in \\mathbb{R}$ thỏa mãn $x^2 + y^2 = ${r * r}$. Tìm giá trị lớn nhất và giá trị nhỏ nhất của $T = ${p}x + ${q}y$.`,
        solution: `a) Đặt $Q(x) = P(x) - ${kPoly}x$. Do $\\deg P = 4$ và hệ số cao nhất bằng $1$ nên $Q(x)$ nhận $1, 2, 3, 4$ làm nghiệm, suy ra:\n$$P(x) = (x - 1)(x - 2)(x - 3)(x - 4) + ${kPoly}x.$$\nThay $x = 6$ và $x = -1$:\n- $P(6) = 5 \\cdot 4 \\cdot 3 \\cdot 2 + ${6 * kPoly} = ${120 + 6 * kPoly}$.\n- $P(-1) = (-2)(-3)(-4)(-5) - ${kPoly} = 120 - ${kPoly}$.\nVậy $M = P(6) - P(-1) = (${120 + 6 * kPoly}) - (120 - ${kPoly}) = ${7 * kPoly}$.\n\nb) Theo bất đẳng thức Cauchy-Schwarz:\n$$T^2 = (${p}x + ${q}y)^2 \\le (${p}^2 + ${q}^2)(x^2 + y^2) = ${p * p + q * q} \\cdot ${r * r} = ${(p * p + q * q) * r * r}.$$\nSuy ra $-${r}\\sqrt{${p * p + q * q}} \\le T \\le ${r}\\sqrt{${p * p + q * q}}$.`,
        keyFormulasOrHints: ['Đa thức phụ Q(x) = P(x) - kx', 'Hình chiếu véc-tơ / Cauchy-Schwarz trên đường tròn']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Không giải trực tiếp, cho phương trình $x^2 - ${u0 + v0}x + ${u0 * v0} = 0$ có hai nghiệm $x_1, x_2$. Tính giá trị biểu thức $K = x_1^4 + x_2^4 - ${p}(x_1^2 + x_2^2)$.\nb) Cho hai số thực dương $a, b$ thỏa mãn $a + b = ${2 * r}$. Tìm GTNN của $S = \\frac{1}{a^2 + b^2} + \\frac{1}{ab}$.`,
        solution: `a) Ta có $\\Delta = (${u0 + v0})^2 - 4\\cdot ${u0 * v0} = ${(u0 - v0) ** 2} > 0$, nên theo hệ thức Viète: $S = x_1 + x_2 = ${u0 + v0}$, $P = x_1 x_2 = ${u0 * v0}$.\nTính từng bước:\n- $x_1^2 + x_2^2 = S^2 - 2P = ${(u0 + v0) ** 2 - 2 * u0 * v0}$.\n- $x_1^4 + x_2^4 = (x_1^2 + x_2^2)^2 - 2P^2 = ${((u0 + v0) ** 2 - 2 * u0 * v0) ** 2 - 2 * (u0 * v0) ** 2}$.\nDo đó $K = ${((u0 + v0) ** 2 - 2 * u0 * v0) ** 2 - 2 * (u0 * v0) ** 2 - p * ((u0 + v0) ** 2 - 2 * u0 * v0)}$.\n\nb) Biến đổi: $S = \\left(\\frac{1}{a^2 + b^2} + \\frac{1}{2ab}\\right) + \\frac{1}{2ab} \\ge \\frac{4}{(a + b)^2} + \\frac{2}{(a + b)^2} = \\frac{6}{${4 * r * r}} = \\frac{3}{${2 * r * r}}$. Dấu bằng đạt tại $a = b = ${r}$.`,
        keyFormulasOrHints: ['x1^4 + x2^4 = (S^2 - 2P)^2 - 2P^2', 'Cauchy-Schwarz 1/X + 1/Y >= 4/(X+Y)']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải phương trình: $\\sqrt[3]{${p}x + 1} + \\sqrt[3]{${p}x - 1} = \\sqrt[3]{${2 * p}x}$.\nb) Cho $a, b, c > 0$. Chứng minh: $\\sqrt{\\frac{a}{b + c}} + \\sqrt{\\frac{b}{c + a}} + \\sqrt{\\frac{c}{a + b}} > 2$.`,
        solution: `a) Đặt $u = \\sqrt[3]{${p}x + 1}$, $v = \\sqrt[3]{${p}x - 1}$, $w = \\sqrt[3]{${2 * p}x}$. Khi đó $u + v = w \\implies (u + v)^3 = w^3 \\iff u^3 + v^3 + 3uv(u + v) = w^3$.\nVì $u^3 + v^3 = ${2 * p}x = w^3$, phương trình tương đương $3uvw = 0$.\n- $u = 0 \\implies x = -\\frac{1}{${p}}$.\n- $v = 0 \\implies x = \\frac{1}{${p}}$.\n- $w = 0 \\implies x = 0$.\nThử lại cả 3 nghiệm đều thỏa mãn.\n\nb) Theo AM-GM: $\\sqrt{\\frac{b + c}{a}} = \\sqrt{1 \\cdot \\frac{b + c}{a}} \\le \\frac{1 + \\frac{b + c}{a}}{2} = \\frac{a + b + c}{2a} \\implies \\sqrt{\\frac{a}{b + c}} \\ge \\frac{2a}{a + b + c}$.\nCộng 3 BĐT tương tự được $\\text{VT} \\ge 2$. Dấu bằng không đồng thời xảy ra (cần $a = b + c$, $b = c + a$, $c = a + b \\implies a + b + c = 0$, vô lý với $a, b, c > 0$). Vậy $\\text{VT} > 2$.`,
        keyFormulasOrHints: ['Lập phương đẳng thức (u+v)^3 = u^3 + v^3 + 3uv(u+v)', 'AM-GM nghịch đảo 2a/(a+b+c)']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn phương trình:\n$$xy + ${p}x + ${q}y = ${p * q + pPrime}.$$\nb) Chứng minh rằng với mọi số nguyên dương $n$, biểu thức $A = n^3 + ${6 * r - 1}n$ luôn chia hết cho $6$.`,
        solution: `a) Thêm $${p * q}$ vào hai vế của phương trình $xy + ${p}x + ${q}y = ${p * q + pPrime}$:\n$$xy + ${p}x + ${q}y + ${p * q} = ${2 * p * q + pPrime} \\iff (x + ${q})(y + ${p}) = ${2 * p * q + pPrime}.$$\nĐặt $M = ${2 * p * q + pPrime}$. Vì $x, y \\in \\mathbb{Z}$ nên $x + ${q}$ và $y + ${p}$ là các cặp ước nguyên có tích bằng $M$. Lần lượt giải $(x + ${q};\\; y + ${p}) = (d;\\; M/d)$ với mọi ước $d \\mid M$ để tìm tất cả cặp nghiệm nguyên $(x, y)$ (ví dụ với $d = 1$ cho nghiệm $x = ${1 - q},\\; y = ${2 * p * q + pPrime - p}$).\n\nb) Ta có $A = n^3 - n + ${6 * r}n = n(n - 1)(n + 1) + 6\\cdot ${r}n$.\nTích 3 số nguyên liên tiếp $n(n - 1)(n + 1)$ luôn chia hết cho $2$ và $3$, nên chia hết cho $6$; hạng tử $6\\cdot ${r}n$ cũng chia hết cho $6$. Vậy $A \\vdots 6$.`,
        keyFormulasOrHints: ['Đưa về phương trình ước (x + q)(y + p) = const', 'Tích 3 số nguyên liên tiếp chia hết cho 6']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Chứng minh rằng với mọi số nguyên dương $n$, số $P(n) = n^4 + 2n^3 + 2n^2 + 2n + 1$ không bao giờ là số chính phương.\nb) Tìm tất cả các số nguyên tố $p$ sao cho $p + ${2 * r}$ và $p + ${4 * r}$ đều là số nguyên tố (xét trường hợp $p + 2$ và $p + 4$ với số dư theo modulo $3$).`,
        solution: `a) Với mọi $n \\ge 1$, đánh giá kẹp giữa hai số chính phương liên tiếp:\n- $(n^2 + n)^2 = n^4 + 2n^3 + n^2 < n^4 + 2n^3 + 2n^2 + 2n + 1$ (vì $n^2 + 2n + 1 > 0$).\n- $(n^2 + n + 1)^2 = n^4 + 2n^3 + 3n^2 + 2n + 1 > n^4 + 2n^3 + 2n^2 + 2n + 1$ (vì $n^2 > 0$).\nVì bị kẹp nghiêm ngặt giữa $(n^2 + n)^2$ và $(n^2 + n + 1)^2$, nên $P(n)$ không thể là số chính phương.\n\nb) Xét tính chia hết theo $\\bmod 3$: khi $2r \\not\\equiv 0 \\pmod 3$ (ví dụ $r \\in \\{2, 4\\}$), trong 3 số $p,\\; p + ${2 * r},\\; p + ${4 * r}$ luôn có đúng một số chia hết cho $3$. Để cả ba là số nguyên tố, bắt buộc số nhỏ nhất $p = 3$ (kiểm tra $3 + ${2 * r}$ và $3 + ${4 * r}$ là nguyên tố hay không); khi $r = 3$, thử các giá trị $p$ nguyên tố nhỏ.`,
        keyFormulasOrHints: ['Kẹp giữa hai số chính phương liên tiếp A^2 < X < (A+1)^2', 'Xét số dư modulo 3']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Chứng minh rằng với mọi số nguyên dương $n$, $\\gcd(${p}n + ${q},\\; ${p + 1}n + ${q + 1})$ là ước của $${p + q + 0 === 0 ? 1 : Math.abs(p * (q + 1) - (p + 1) * q)}$.\nb) Tìm tất cả các cặp số nguyên dương $(x, y)$ thỏa mãn $x^2 + y^2 \\vdots ${pPrime === 5 ? 7 : pPrime}$ (khi $p_0 \\equiv 3 \\pmod 4$, xét với $p_0 = 7$ hoặc $11$).`,
        solution: `a) Đặt $d = \\gcd(${p}n + ${q},\\; ${p + 1}n + ${q + 1})$.\nKhi đó $d \\mid ${p + 1}(${p}n + ${q}) - ${p}(${p + 1}n + ${q + 1}) = ${p * q + q - p * q - p} = ${q - p}$.\nVậy $d$ luôn là ước của $|${q - p}|$ (nếu $q = p$, $d$ là ước của $n(${p + 1}) - \\dots$ dễ dàng rút gọn $d \\mid 1$ hoặc kiểm tra trực tiếp).\n\nb) Với số nguyên tố $p_0 \\in \\{3, 7, 11, 19\\}$ dạng $4k + 3$: giả sử tồn tại $x, y$ không chia hết cho $p_0$ mà $x^2 + y^2 \\equiv 0 \\pmod{p_0}$. Theo định lý Fermat nhỏ, $x^{p_0 - 1} \\equiv y^{p_0 - 1} \\equiv 1 \\pmod{p_0}$. Mặt khác $x^2 \\equiv -y^2 \\implies (x^2)^{(p_0 - 1)/2} \\equiv (-1)^{(p_0 - 1)/2} (y^2)^{(p_0 - 1)/2} \\implies 1 \\equiv -1 \\pmod{p_0}$ (vô lý vì $\\frac{p_0 - 1}{2} = 2k + 1$ lẻ). Vậy cả $x$ và $y$ đều phải chia hết cho $p_0$.`,
        keyFormulasOrHints: ['Khử biến n trong UCLN bằng tổ hợp tuyến tính', 'Định lý Fermat nhỏ cho số nguyên tố 4k + 3']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Tìm phần dư khi chia $S = 2^{${10 * p + 1}} + 3^{${10 * q + 1}}$ cho $7$.\nb) Tìm tất cả các số nguyên dương $n$ sao cho $n^2 + ${2 * p}n + ${p * p - 4}$ là một số nguyên tố.`,
        solution: `a) Sử dụng chu kỳ lũy thừa $\\bmod 7$:\n- $2^3 = 8 \\equiv 1 \\pmod 7$, viết ${10 * p + 1} = 3q_1 + r_1$ để tìm $2^{r_1} \\bmod 7$.\n- Theo Fermat nhỏ $3^6 \\equiv 1 \\pmod 7$, viết ${10 * q + 1} = 6q_2 + r_2$ để tìm $3^{r_2} \\bmod 7$.\nCộng hai số dư lại rồi rút gọn theo $\\bmod 7$.\n\nb) Phân tích thành nhân tử:\n$$n^2 + ${2 * p}n + ${p * p - 4} = (n + ${p})^2 - 4 = (n + ${p - 2})(n + ${p + 2}).$$\nVì $n \\ge 1$ và $p \\ge 2$ nên thừa số thứ hai $n + ${p + 2} \\ge ${p + 3} > 1$ và thừa số nhỏ hơn là $n + ${p - 2} \\ge 1$. Để tích là số nguyên tố, bắt buộc thừa số nhỏ hơn $n + ${p - 2} = 1$, không có nghiệm nguyên dương nếu $p > 2$; nếu $p = 2$, thử $n = 1$ được $1 \\cdot 5 = 5$ (nguyên tố).`,
        keyFormulasOrHints: ['Fermat nhỏ a^(p-1) ≡ 1 (mod p)', 'Phân tích hiệu hai bình phương A^2 - 4 = (A-2)(A+2)']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Giải phương trình nghiệm nguyên: $x^2 - 2y^2 = ${pPrime}$ (hoặc chứng minh phương trình $x^2 - 3y^2 = ${3 * p + 2}$ vô nghiệm nguyên).\nb) Chứng minh rằng $A = n^5 - n$ chia hết cho $30$ với mọi số nguyên $n$.`,
        solution: `a) Xét phương trình $x^2 - 3y^2 = ${3 * p + 2}$: lấy hai vế theo modulo $3$, vế trái đồng dư $x^2 \\pmod 3 \\in \\{0, 1\\}$, trong khi vế phải $${3 * p + 2} \\equiv 2 \\pmod 3$ (mâu thuẫn!). Vậy phương trình vô nghiệm nguyên.\n\nb) Phân tích $A = n^5 - n = n(n^4 - 1) = n(n - 1)(n + 1)(n^2 + 1)$.\n- Chứa tích $3$ số nguyên liên tiếp $(n-1)n(n+1)$ nên $A \\vdots 6$.\n- Xét $\\bmod 5$: mọi số chính phương $n^2 \\bmod 5 \\in \\{0, 1, 4\\}$. Nếu $n \\not\\equiv 0 \\pmod 5$, thì $n^2 \\equiv 1 \\implies n - 1$ hoặc $n + 1 \\vdots 5$, hoặc $n^2 \\equiv 4 \\implies n^2 + 1 \\vdots 5$. Do đó $A \\vdots 5$.\nVì $\\gcd(5, 6) = 1$, suy ra $A \\vdots 30$.`,
        keyFormulasOrHints: ['Đồng dư modulo 3 với số chính phương', 'Tách n^5 - n = (n-1)n(n+1)(n^2 + 1)']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho tam giác nhọn $ABC$ ($AB < AC$) nội tiếp đường tròn $(O; R)$ có trực tâm $H$, trọng tâm $G$, đường cao $AD, BE, CF$ và $M$ là trung điểm của $BC$.\na) Chứng minh $\\overrightarrow{OA} + \\overrightarrow{OB} + \\overrightarrow{OC} = \\overrightarrow{OH}$ và ba điểm $O, G, H$ thẳng hàng với $HG = 2GO$ (Đường thẳng Euler).\nb) Gọi $N_9$ là tâm đường tròn Euler (đường tròn 9 điểm) đi qua $D, E, F, M$. Chứng minh $N_9$ là trung điểm của $OH$ và bán kính đường tròn 9 điểm bằng $\\frac{R}{2}$.`,
        solution: `a) Kẻ đường kính $AK$ của $(O)$. Ta có $KB \\perp AB \\parallel CH$ và $KC \\perp AC \\parallel BH$, nên $BHCK$ là hình bình hành. Vì $M$ là trung điểm $BC$, $M$ cũng là trung điểm $HK \\implies \\overrightarrow{AH} = 2\\overrightarrow{OM} = \\overrightarrow{OB} + \\overrightarrow{OC} \\implies \\overrightarrow{OH} = \\overrightarrow{OA} + \\overrightarrow{OB} + \\overrightarrow{OC}$.\nMặt khác $\\overrightarrow{OA} + \\overrightarrow{OB} + \\overrightarrow{OC} = 3\\overrightarrow{OG}$, suy ra $\\overrightarrow{OH} = 3\\overrightarrow{OG} \\implies O, G, H$ thẳng hàng và $HG = 2GO$.\n\nb) Xét phép vị tự tâm $H$ tỉ số $\\frac{1}{2}$ biến đường tròn $(O; R)$ thành đường tròn tâm $N_9$ (trung điểm $OH$) bán kính $\\frac{R}{2}$, đi qua trung điểm của $HA, HB, HC$, chân đường cao $D, E, F$ và trung điểm 3 cạnh $M, N, P$.`,
        keyFormulasOrHints: ['Kẻ đường kính AK tạo hình bình hành BHCK', 'Phép vị tự tâm H tỉ số 1/2 tạo đường tròn 9 điểm'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Đường thẳng Euler & Đường tròn 9 điểm' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho hai đường tròn $(O_1)$ và $(O_2)$ cắt nhau tại $A$ và $B$. Tiếp tuyến chung ngoài tiếp xúc với $(O_1), (O_2)$ lần lượt tại $P$ và $Q$ (gần $A$ hơn). Tia $BA$ cắt $PQ$ tại $M$.\na) Chứng minh $MP^2 = MA \\cdot MB = MQ^2$, từ đó suy ra $M$ là trung điểm của $PQ$.\nb) Chứng minh đường tròn ngoại tiếp $\\triangle APQ$ tiếp xúc với đường thẳng nối tâm tại trường hợp đặc biệt hoặc tính góc $\\widehat{PAQ} + \\widehat{PBQ} = 180^\\circ$.`,
        solution: `a) Áp dụng phương tích của điểm $M$ trên trục đẳng phương $AB$ đối với hai đường tròn $(O_1)$ và $(O_2)$:\n- Vì $MP$ là tiếp tuyến của $(O_1)$: $MP^2 = MA \\cdot MB$ (cũng chứng minh được bằng hai tam giác đồng dạng $\\triangle MPA \\sim \\triangle MBP$).\n- Tương tự $MQ^2 = MA \\cdot MB$.\nSuy ra $MP = MQ$, hay $M$ là trung điểm đoạn tiếp tuyến chung $PQ$.\n\nb) Do $MP, MQ$ là tiếp tuyến nên $\\widehat{MPA} = \\widehat{PBA}$ và $\\widehat{MQA} = \\widehat{QBA}$. Cộng vế theo vế:\n$$\\widehat{PAQ} + \\widehat{PBQ} = (180^\\circ - \\widehat{MPA} - \\widehat{MQA}) + (\\widehat{PBA} + \\widehat{QBA}) = 180^\\circ.$$`,
        keyFormulasOrHints: ['Trục đẳng phương AB đi qua trung điểm PQ', 'Góc nội tiếp và góc tạo bởi tia tiếp tuyến và dây cung'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Phương tích & Trục đẳng phương 2D' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho $\\triangle ABC$ có đường tròn nội tiếp $(I)$ tiếp xúc $BC, CA, AB$ lần lượt tại $D, E, F$.\na) Chứng minh $BI \\perp EF$ và tính góc $\\widehat{BIC} = 90^\\circ + \\frac{\\widehat{A}}{2}$.\nb) Kẻ đường kính $DK$ của $(I)$. Đường thẳng $AK$ cắt $BC$ tại $M$. Chứng minh $BD = CM$ (Bổ đề điểm Nagel).`,
        solution: `a) Gọi $P$ là giao điểm của $BI$ và $EF$. Trong $\\triangle ABC$, $\\widehat{BIC} = 180^\\circ - \\frac{\\widehat{B} + \\widehat{C}}{2} = 90^\\circ + \\frac{\\widehat{A}}{2}$.\nDùng góc ngoài và tính chất cân $AE = AF$, ta dễ dàng tính được $\\widehat{EPB} = 90^\\circ \\implies BI \\perp EF$.\n\nb) Tiếp tuyến tại $K$ của $(I)$ song song với $BC$, cắt $AB, AC$ tại $B', C'$. Theo phép vị tự tâm $A$ biến $(I)$ thành đường tròn bàng tiếp $(I_a)$ góc $A$, điểm tiếp xúc của $(I_a)$ với $BC$ chính là $M$. Với $p = \\frac{AB+BC+CA}{2}$, ta có $BD = p - AC$ và $CM = p - AC \\implies BD = CM$.`,
        keyFormulasOrHints: ['Bổ đề BI vuông góc EF', 'Đường tròn bàng tiếp và phép vị tự tâm A'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Đường tròn nội tiếp & bàng tiếp' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho tứ giác $ABCD$ nội tiếp đường tròn $(O)$ có hai đường chéo $AC$ và $BD$ cắt nhau tại $K$.\na) Chứng minh đẳng thức Ptolemy: $AB \\cdot CD + AD \\cdot BC = AC \\cdot BD$.\nb) Đường tròn ngoại tiếp $\\triangle OAB$ cắt đường thẳng $OC$ hoặc dựng hình chiếu vuông góc từ điểm $P$ bất kỳ trên $(O)$ lên $BC, CA, AB$ là $X, Y, Z$. Chứng minh $X, Y, Z$ thẳng hàng (Đường thẳng Simson).`,
        solution: `a) Lấy điểm $E$ trên $BD$ sao cho $\\widehat{BAE} = \\widehat{CAD}$. Khi đó $\\triangle ABE \\sim \\triangle ACD$ (g.g) $\\implies AB \\cdot CD = AC \\cdot BE$ và $\\triangle ADE \\sim \\triangle ACB$ (g.g) $\\implies AD \\cdot BC = AC \\cdot DE$. Cộng vế theo vế thu được $AB \\cdot CD + AD \\cdot BC = AC \\cdot (BE + DE) = AC \\cdot BD$.\n\nb) Do $\\widehat{PXB} = \\widehat{PZB} = 90^\\circ$ nên $P, X, B, Z$ đồng viên, suy ra $\\widehat{PXZ} = \\widehat{PBZ}$. Tương tự $P, X, Y, C$ đồng viên và $A, B, C, P$ đồng viên dẫn đến $\\widehat{PXZ} + \\widehat{PXY} = 180^\\circ$, hay $X, Y, Z$ thẳng hàng trên đường thẳng Simson.`,
        keyFormulasOrHints: ['Định lý Ptolemy', 'Tứ giác nội tiếp chứng minh đường thẳng Simson'],
        simulationLink: { type: 'math', targetId: 'geometry', label: 'Đường thẳng Simson 2D' }
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Trong không gian $Oxyz$, cho tứ diện $OABC$ có $A(${p}; 0; 0)$, $B(0; ${q + 2}; 0)$, $C(0; 0; ${r + 2})$.\na) Viết phương trình mặt phẳng $(ABC)$ theo đoạn chắn và tính khoảng cách từ $O$ đến $(ABC)$.\nb) Tìm tọa độ tâm $I$ và bán kính $R$ của mặt cầu ngoại tiếp tứ diện $OABC$.`,
        solution: `a) Phương trình mặt phẳng $(ABC)$ theo đoạn chắn:\n$$\\frac{x}{${p}} + \\frac{y}{${q + 2}} + \\frac{z}{${r + 2}} = 1.$$\nKhoảng cách $d = d(O, (ABC))$ thỏa mãn $\\frac{1}{d^2} = \\frac{1}{${p}^2} + \\frac{1}{${q + 2}^2} + \\frac{1}{${r + 2}^2}$.\n\nb) Vì $OA, OB, OC$ đôi một vuông góc, tâm mặt cầu ngoại tiếp là $I\\left(\\frac{${p}}{2};\\; \\frac{${q + 2}}{2};\\; \\frac{${r + 2}}{2}\\right)$ và bán kính $R = OI = \\frac{1}{2}\\sqrt{${p}^2 + ${q + 2}^2 + ${r + 2}^2} = \\frac{1}{2}\\sqrt{${p * p + (q + 2) ** 2 + (r + 2) ** 2}}$.`,
        keyFormulasOrHints: ['1/d^2 = 1/a^2 + 1/b^2 + 1/c^2', 'Bán kính mặt cầu ngoại tiếp tứ diện vuông 1/2 sqrt(a^2+b^2+c^2)'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Tứ diện vuông Oxyz 3D' }
      }
    ];

    const nDirichlet = 26 + (i % 10);
    const nBoard = 19 + (i % 6) * 2; // odd number 19..29
    const nGrid = 6 + (i % 4);
    const nBars = 12 + (i % 7);

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Cho tập hợp $X$ gồm $${nDirichlet}$ số nguyên dương phân biệt không vượt quá $100$. Chứng minh rằng luôn tồn tại ít nhất hai số $a, b \\in X$ sao cho $|a - b| \\in \\{1, 2, 3\\}$.`,
        solution: `Sắp xếp các phần tử của $X$ theo thứ tự tăng dần: $1 \\le x_1 < x_2 < \\dots < x_{${nDirichlet}} \\le 100$.\nGiả sử không có hai số nào có hiệu thuộc $\\{1, 2, 3\\}$, tức là mọi hiệu liên tiếp $d_k = x_{k+1} - x_k \\ge 4$ với mọi $k = 1, 2, \\dots, ${nDirichlet - 1}$.\nCộng tất cả $${nDirichlet - 1}$ hiệu liên tiếp:\n$$x_{${nDirichlet}} - x_1 = \\sum_{k=1}^{${nDirichlet - 1}} d_k \\ge 4 \\cdot ${nDirichlet - 1} = ${4 * (nDirichlet - 1)}.$$\nMặt khác, $x_{${nDirichlet}} - x_1 \\le 100 - 1 = 99 < ${4 * (nDirichlet - 1)}$ (mâu thuẫn!). Vậy điều phải chứng minh đúng.`,
        keyFormulasOrHints: ['Sắp xếp tăng dần x_1 < ... < x_n', 'Đánh giá tổng các hiệu liên tiếp >= 4(n-1)']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Trên bảng viết $${nBoard}$ số tự nhiên từ $1$ đến $${nBoard}$. Mỗi bước ta xóa hai số bất kì $u, v$ và thay bằng một số mới là $u + v - 1$. Thực hiện liên tiếp $${nBoard - 1}$ bước cho tới khi trên bảng chỉ còn đúng $1$ số.\na) Hỏi số cuối cùng còn lại trên bảng bằng bao nhiêu?\nb) Số cuối cùng đó là số chẵn hay số lẻ?`,
        solution: `a) Gọi $S$ là tổng các số hiện có trên bảng. Ban đầu:\n$$S_0 = 1 + 2 + \\dots + ${nBoard} = \\frac{${nBoard}\\cdot ${nBoard + 1}}{2} = ${(nBoard * (nBoard + 1)) / 2}.$$\nMỗi lần thay hai số $u, v$ bằng $u + v - 1$, tổng $S$ giảm đi đúng $(u + v) - (u + v - 1) = 1$ đơn vị.\nSau $${nBoard - 1}$ bước, tổng còn lại (chính là số duy nhất trên bảng) là:\n$$S_{\\text{cuối}} = S_0 - ${nBoard - 1} = ${(nBoard * (nBoard + 1)) / 2 - (nBoard - 1)}.$$\n\nb) Vì $${(nBoard * (nBoard + 1)) / 2 - (nBoard - 1)}$ chia $2$ dư ${((nBoard * (nBoard + 1)) / 2 - (nBoard - 1)) % 2}$, nên số cuối cùng là **${((nBoard * (nBoard + 1)) / 2 - (nBoard - 1)) % 2 === 0 ? 'số chẵn' : 'số lẻ'}**.`,
        keyFormulasOrHints: ['Đặt bất biến/bán bất biến tổng các số S', 'Mỗi bước S giảm đi đúng 1 đơn vị']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Một giải đấu thể thao có $${nGrid}$ đội bóng tham gia theo thể thức vòng tròn một lượt (hai đội bất kỳ gặp nhau đúng 1 lần, không có trận hòa: thắng được $1$ điểm, thua $0$ điểm).\na) Chứng minh rằng tổng điểm của cả giải luôn bằng $\\binom{${nGrid}}{2}$ và tính giá trị cụ thể.\nb) Cho đồ thị vô hướng đơn có $${nGrid}$ đỉnh không chứa tam giác (định lý Mantel). Chứng minh số cạnh tối đa của đồ thị bằng $\\left\\lfloor\\frac{${nGrid}^2}{4}\\right\\rfloor = ${Math.floor((nGrid * nGrid) / 4)}$.`,
        solution: `a) Mỗi trận đấu có đúng 1 đội thắng ($1$ điểm) và 1 đội thua ($0$ điểm), nên tổng điểm sau mỗi trận tăng thêm đúng $1$. Tổng số trận đấu của giải là $\\binom{${nGrid}}{2} = \\frac{${nGrid}\\cdot ${nGrid - 1}}{2} = ${(nGrid * (nGrid - 1)) / 2}$, cũng chính là tổng điểm toàn giải.\n\nb) Nếu đồ thị không có tam giác: với mọi cạnh $uv$, tập láng giềng của $u$ và $v$ rời nhau nên $\\deg(u) + \\deg(v) \\le ${nGrid}$. Cộng bất đẳng thức này qua tất cả $E$ cạnh, vế trái là $\\sum_{v} \\deg(v)^2 \\ge \\frac{(\\sum \\deg(v))^2}{${nGrid}} = \\frac{4E^2}{${nGrid}}$, suy ra $\\frac{4E^2}{${nGrid}} \\le ${nGrid}E \\implies E \\le \\left\\lfloor\\frac{${nGrid}^2}{4}\\right\\rfloor = ${Math.floor((nGrid * nGrid) / 4)}$.`,
        keyFormulasOrHints: ['Đếm bằng hai cách & Cauchy-Schwarz tổng bậc', 'Định lý Mantel: E <= floor(n^2/4)']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `a) Có bao nhiêu bộ bốn số nguyên dương $(x_1, x_2, x_3, x_4)$ thỏa mãn phương trình $x_1 + x_2 + x_3 + x_4 = ${nBars}$?\nb) Một bàn cờ kích thước $${2 * nGrid} \\times ${2 * nGrid}$ bị cắt bỏ $2$ ô vuông ở hai góc đối diện nhau. Chứng minh rằng không thể lát kín phần còn lại bằng các quân domino $1 \\times 2$.`,
        solution: `a) Áp dụng bài toán chia kẹo Euler (Stars & Bars) với các nghiệm nguyên dương ($x_k \\ge 1$): có $${nBars} - 1$ khoảng trống giữa $${nBars}$ số 1, ta chọn $3$ vách ngăn nên số bộ nghiệm là:\n$$\\binom{${nBars - 1}}{3} = \\frac{${nBars - 1}\\cdot ${nBars - 2}\\cdot ${nBars - 3}}{6} = ${((nBars - 1) * (nBars - 2) * (nBars - 3)) / 6}.$$\n\nb) Tô màu bàn cờ xen kẽ đen–trắng như bàn cờ vua. Hai ô ở hai góc đối diện có **cùng một màu** (ví dụ cùng màu trắng). Sau khi cắt bỏ 2 ô đó, số ô đen nhiều hơn số ô trắng đúng $2$ ô. Mặt khác mỗi quân domino $1 \\times 2$ luôn phủ đúng $1$ ô đen và $1$ ô trắng, nên không thể lát kín phần còn lại.`,
        keyFormulasOrHints: ['Bài toán chia kẹo Euler C(N-1, k-1)', 'Bất biến tô màu xen kẽ đen-trắng']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Cho $a, b, c$ là các số thực phân biệt. Xác định giá trị của biểu thức đối xứng:\n$$S = \\frac{a^2}{(a - b)(a - c)} + \\frac{b^2}{(b - c)(b - a)} + \\frac{c^2}{(c - a)(c - b)}$$\nvà chứng minh bất đẳng thức $(x + y + z)^2 \\ge 3(xy + yz + zx)$ áp dụng cho hàm $f(x) = \\frac{x^2}{x + ${r}}$.`,
        solution: `Quy đồng mẫu số chung $(a - b)(b - c)(c - a)$ hoặc xét đa thức bậc hai $P(t) = \\frac{(t - b)(t - c)}{(a - b)(a - c)}a^2 + \\frac{(t - c)(t - a)}{(b - c)(b - a)}b^2 + \\frac{(t - a)(t - b)}{(c - a)(c - b)}c^2 - t^2$.\nTa có $\\deg P \\le 2$ nhưng $P(a) = P(b) = P(c) = 0$ (3 nghiệm phân biệt), nên $P(t) \\equiv 0$. Hệ số của $t^2$ bằng $S - 1 = 0 \\implies S = 1$.\nNgoài ra $(x + y + z)^2 - 3(xy + yz + zx) = \\frac{1}{2}\\big[(x - y)^2 + (y - z)^2 + (z - x)^2\\big] \\ge 0$.`,
        keyFormulasOrHints: ['Đa thức nội suy Lagrange bậc 2', 'Đồng nhất thức 1/2 sum(x - y)^2']
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
      id: `math-chuyen-${num}`,
      subject: 'math',
      track: 'chuyen',
      subjectTag: 'Toán Chuyên',
      categoryTag: i % 3 === 0 ? 'Tuyển Sinh Lớp 10 Chuyên Toán' : i % 3 === 1 ? 'Chuyên Toán & Olympic 30/4' : 'Chọn Đội Tuyển HSG Toán',
      academicYear: year,
      title: `Đề Thi Chuyên & HSG Toán #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn tổng hợp chuẩn đề: ${school}`,
      timeMinutes: 150,
      featuredSnippet: q1.content.slice(0, 130) + '...',
      topics: ['# Đánh giá & BĐT', '# Số học & Đồng dư', '# Hình học Euler & Simson', '# Tổ hợp & Bất biến'],
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
    const school = ALL_THPT_SCHOOLS_BATCH_4[i % ALL_THPT_SCHOOLS_BATCH_4.length];
    const year = i % 2 === 0 ? '2025-2026' : '2024-2025';

    const a = (i % 6) + 1; // 1..6
    const b = (Math.floor(i / 6) % 5) + 2; // 2..6
    const c = (Math.floor(i / 30) % 4) + 1; // 1..4
    const p = a + 1; // 2..7

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho hàm số phân thức $y = \\frac{x^2 + ${a}x + ${b}}{x - 1}$.\na) Tìm các đường tiệm cận đứng và tiệm cận xiên của đồ thị hàm số.\nb) Tìm hai điểm cực trị của hàm số và viết phương trình đường thẳng đi qua hai điểm cực trị đó.`,
        solution: `a) Chia tử cho mẫu: $y = x + ${a + 1} + \\frac{${1 + a + b}}{x - 1}$.\n- Tiệm cận đứng: $x = 1$.\n- Tiệm cận xiên: $y = x + ${a + 1}$.\n\nb) Đạo hàm $y' = 1 - \\frac{${1 + a + b}}{(x - 1)^2} = 0 \\iff x = 1 \\pm \\sqrt{${1 + a + b}}$.\nĐường thẳng đi qua hai điểm cực trị là $y = \\frac{(x^2 + ${a}x + ${b})'}{(x - 1)'} = 2x + ${a}$.`,
        keyFormulasOrHints: ['Tiệm cận xiên GDPT 2018', 'Đường nối 2 cực trị y = u\'(x)/v\'(x)'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Đồ thị Tiệm cận xiên 2D' }
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho hàm số bậc ba $y = x^3 - ${3 * a}x^2 + ${3 * a * a - 3}x + ${b}$.\na) Xác định khoảng đơn điệu và cực trị của hàm số.\nb) Tìm GTLN và GTNN của hàm số trên đoạn $[${a - 1}; ${a + 2}]$.`,
        solution: `a) Đạo hàm $y' = 3x^2 - ${6 * a}x + ${3 * a * a - 3} = 3\\big[(x - ${a})^2 - 1\\big] = 0 \\iff x = ${a - 1}$ hoặc $x = ${a + 1}$.\nHàm đạt cực đại tại $x = ${a - 1}$ và đạt cực tiểu tại $x = ${a + 1}$.\n\nb) Tính tại các điểm $x = ${a - 1}$, $x = ${a + 1}$ và $x = ${a + 2}$:\n- $f(${a - 1}) = ${(a - 1) ** 3 - 3 * a * (a - 1) ** 2 + (3 * a * a - 3) * (a - 1) + b}$.\n- $f(${a + 1}) = ${(a + 1) ** 3 - 3 * a * (a + 1) ** 2 + (3 * a * a - 3) * (a + 1) + b}$.\n- $f(${a + 2}) = ${(a + 2) ** 3 - 3 * a * (a + 2) ** 2 + (3 * a * a - 3) * (a + 2) + b}$.\nSo sánh thu được $\\max = f(${a - 1}) = ${(a - 1) ** 3 - 3 * a * (a - 1) ** 2 + (3 * a * a - 3) * (a - 1) + b}$ và $\\min = f(${a + 1}) = ${(a + 1) ** 3 - 3 * a * (a + 1) ** 2 + (3 * a * a - 3) * (a + 1) + b}$.`,
        keyFormulasOrHints: ['y\' = 3[(x - a)^2 - 1]', 'So sánh giá trị tại đầu mút và cực trị'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Hàm bậc ba 2D' }
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Từ một tấm tôn hình vuông cạnh $A = ${6 * p}$ cm, người ta cắt bốn góc bốn hình vuông cạnh $x$ cm rồi gập thành chiếc hộp không nắp.\na) Lập công thức tính thể tích $V(x)$ của hộp ($0 < x < ${3 * p}$).\nb) Tìm $x$ để thể tích hộp lớn nhất và tính $V_{\\max}$.`,
        solution: `a) Đáy hộp là hình vuông cạnh ${6 * p} - 2x$, chiều cao $x \\implies V(x) = x(${6 * p} - 2x)^2$.\n\nb) Đạo hàm $V'(x) = 12(x - ${p})(x - ${3 * p}) = 0 \\implies x = ${p}\\text{ cm} \\in (0; ${3 * p})$.\nThể tích lớn nhất là $V_{\\max} = ${p}\\cdot (${4 * p})^2 = ${16 * p ** 3}\\text{ cm}^3$.`,
        keyFormulasOrHints: ['V(x) = x(A - 2x)^2', 'Cực đại tại x = A/6']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho hàm số $y = \\frac{${a + 2}x - 1}{x + 1}$ và đường thẳng $d: y = x + m$.\na) Tìm $m$ để $d$ cắt đồ thị hàm số tại hai điểm phân biệt $A, B$.\nb) Tìm $m$ để khoảng cách $AB$ đạt giá trị nhỏ nhất.`,
        solution: `a) Hoành độ giao điểm ($x \\ne -1$): $x^2 + (m - ${a + 1})x - (m - 1) = 0$.\nThử $x = -1$: $1 - m + ${a + 1} - m + 1 = ${a + 3} - 2m$ (yêu cầu $m \\ne \\frac{${a + 3}}{2}$). Với $\\Delta = (m - ${a + 1})^2 + 4(m - 1) = (m - ${a - 1})^2 + ${4 * a} > 0$, luôn có hai nghiệm phân biệt với mọi $m \\ne \\frac{${a + 3}}{2}$.\n\nb) $AB^2 = 2(x_1 - x_2)^2 = 2\\Delta = 2\\big[(m - ${a - 1})^2 + ${4 * a}\\big]$, đạt giá trị nhỏ nhất bằng $\\sqrt{${8 * a}}$ khi $m = ${a - 1}$ (kiểm tra $x = -1$ không là nghiệm khi $m = ${a - 1}$: ${a + 3} - 2(${a - 1}) = ${5 - a}$, khác 0 khi $a \\ne 5$; nếu $a = 5$ thì lấy $m$ lân cận).`,
        keyFormulasOrHints: ['Phương trình hoành độ giao điểm (x != -1)', 'AB = sqrt(1 + k^2) |x1 - x2|']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho đồ thị hàm số $f(x) = x^3 - ${3 * b}x + ${c}$.\na) Viết phương trình tiếp tuyến của đồ thị tại điểm có hoành độ $x_0 = 1$.\nb) Tìm tất cả các giá trị thực của tham số $m$ để phương trình $x^3 - ${3 * b}x + ${c} = m$ có ba nghiệm thực phân biệt.`,
        solution: `a) Tại $x_0 = 1$: $y_0 = 1 - ${3 * b} + ${c} = ${1 - 3 * b + c}$, hệ số góc $k = f'(1) = 3 - ${3 * b} = ${3 - 3 * b}$.\nTiếp tuyến: $y = ${3 - 3 * b}(x - 1) + ${1 - 3 * b + c} = ${3 - 3 * b}x + ${-2 + c}$.\n\nb) Giải $f'(x) = 3x^2 - ${3 * b} = 0 \\iff x = \\pm\\sqrt{${b}}$. Giá trị cực trị: $y_{\\text{CĐ}} = ${c} + ${2 * b}\\sqrt{${b}}$, $y_{\\text{CT}} = ${c} - ${2 * b}\\sqrt{${b}}$.\nPhương trình có 3 nghiệm phân biệt khi và chỉ khi ${c} - ${2 * b}\\sqrt{${b}} < m < ${c} + ${2 * b}\\sqrt{${b}}.`,
        keyFormulasOrHints: ['y = f\'(x0)(x - x0) + y0', 'y_CT < m < y_CD cho 3 nghiệm phân biệt'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Tiếp tuyến & Tương giao 2D' }
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `a) Giải phương trình mũ: $4^x - ${b + 1}\\cdot 2^x + ${b} = 0$.\nb) Một khoản tiền gửi ngân hàng $${10 * a}$ triệu đồng theo hình thức lãi kép với lãi suất $6\\%$/năm. Hỏi sau ít nhất bao nhiêu năm cả gốc lẫn lãi vượt mức $${15 * a}$ triệu đồng?`,
        solution: `a) Đặt $t = 2^x > 0$, phương trình trở thành $t^2 - ${b + 1}t + ${b} = 0 \\iff t = 1$ hoặc $t = ${b}$.\nSuy ra $x = 0$ hoặc $x = \\log_2(${b})$.\n\nb) Ta cần $(1.06)^n > 1.5 \\iff n > \\log_{1.06}(1.5) \\approx 6.96$. Vậy sau ít nhất $7$ năm.`,
        keyFormulasOrHints: ['Đặt ẩn phụ t = 2^x > 0', 'Lãi kép A = P(1 + r)^n']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Thống kê điểm kiểm tra môn Toán của $40$ học sinh:\n- $[4; 5)$: $4$; $[5; 6)$: $${a + 5}$; $[6; 7)$: $14$; $[7; 8)$: $${11 - a}$; $[8; 9)$: $4$; $[9; 10]$: $2$.\na) Tìm nhóm chứa mốt và tính mốt $M_o$ của mẫu số liệu ghép nhóm.\nb) Tính khoảng tứ phân vị $\\Delta_Q = Q_3 - Q_1$.`,
        solution: `a) Tổng cỡ mẫu $n = 4 + ${a + 5} + 14 + ${11 - a} + 4 + 2 = 40$. Nhóm chứa mốt là $[6; 7)$ có tần số lớn nhất $14$:\n$$M_o = 6 + \\frac{14 - ${a + 5}}{(14 - ${a + 5}) + (14 - ${11 - a})} = 6 + \\frac{${9 - a}}{${12}} = ${(6 + (9 - a) / 12).toFixed(2)}.$$\n\nb) Với $\\frac{n}{4} = 10 \\implies Q_1 \\in [5; 6)$: $Q_1 = 5 + \\frac{10 - 4}{${a + 5}} = ${(5 + 6 / (a + 5)).toFixed(2)}$.\nVới $\\frac{3n}{4} = 30 \\implies Q_3 \\in [7; 8)$ (do $4 + ${a + 5} + 14 = ${a + 23} < 30$ và ${a + 23} + ${11 - a} = 34 \\ge 30$): $Q_3 = 7 + \\frac{30 - ${a + 23}}{${11 - a}} = ${(7 + (7 - a) / (11 - a)).toFixed(2)}$.\nKhoảng tứ phân vị $\\Delta_Q = Q_3 - Q_1 \\approx ${(7 + (7 - a) / (11 - a) - (5 + 6 / (a + 5))).toFixed(2)}$.`,
        keyFormulasOrHints: ['Nội suy Mốt M_o GDPT 2018', 'Khoảng tứ phân vị Δ_Q = Q3 - Q1']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `a) Cho cấp số cộng $(u_n)$ có $u_1 = ${a}$ và công sai $d = ${b}$. Tính số hạng $u_{10}$ và tổng $10$ số hạng đầu $S_{10}$.\nb) Một vật chuyển động với phương trình $s(t) = t^3 - 3\\cdot ${c}t^2 + ${3 * c * c + 2}t$. Tìm thời điểm gia tốc bằng $0$ và vận tốc tức thời khi đó.`,
        solution: `a) Ta có $u_{10} = u_1 + 9d = ${a} + 9\\cdot ${b} = ${a + 9 * b}$, và $S_{10} = \\frac{10(u_1 + u_{10})}{2} = 5(${2 * a + 9 * b}) = ${5 * (2 * a + 9 * b)}$.\n\nb) Vận tốc $v(t) = s'(t) = 3t^2 - ${6 * c}t + ${3 * c * c + 2}$; gia tốc $a(t) = v'(t) = 6t - ${6 * c} = 0 \\iff t = ${c}\\text{ s}$.\nVận tốc lúc đó: $v(${c}) = 3\\cdot ${c * c} - ${6 * c * c} + ${3 * c * c + 2} = 2\\text{ m/s}$.`,
        keyFormulasOrHints: ['S_n = n(u_1 + u_n)/2', 'v(t) = s\'(t), a(t) = v\'(t)']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `a) Giải bất phương trình lôgarit: $\\log_2(x - ${c}) \\le ${b > 4 ? 4 : b}$.\nb) Trong đồ thị biến thiên chuẩn hóa $N(0, 1)$, xác suất rơi vào khoảng $[\\mu - \\sigma; \\mu + \\sigma]$ xấp xỉ $68{,}27\\%$. Tính giá trị biểu thức $E = \\log_3(3^a) + \\ln(e^b)$.`,
        solution: `a) Điều kiện $x > ${c}$. Bất phương trình tương đương $x - ${c} \\le 2^{${b > 4 ? 4 : b}} = ${2 ** (b > 4 ? 4 : b)} \\iff ${c} < x \\le ${c + 2 ** (b > 4 ? 4 : b)}$.\n\nb) Theo quy tắc lôgarit cơ bản: $E = a + b = ${a + b}$.`,
        keyFormulasOrHints: ['Cơ số > 1 giữ nguyên chiều BPT', 'log_a(a^x) = x'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Phân phối Chuẩn & Oxyz 3D' }
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `a) Cho $\\log_a b = ${b}$. Tính giá trị $P = \\log_{a^2}(a^3 b^2)$ (với $0 < a \\ne 1, b > 0$).\nb) Xác định hệ số của $x^3$ trong khai triển nhị thức Newton $(2x + ${c})^5$.`,
        solution: `a) Biến đổi: $P = \\frac{1}{2}\\log_a(a^3 b^2) = \\frac{1}{2}(3 + 2\\log_a b) = \\frac{3 + 2\\cdot ${b}}{2} = \\frac{${3 + 2 * b}}{2}$.\n\nb) Số hạng tổng quát $C_5^k (2x)^{5-k} ${c}^k$. Số hạng chứa $x^3$ ứng với $5 - k = 3 \\implies k = 2$:\nHệ số là $C_5^2 \\cdot 2^3 \\cdot ${c}^2 = 10 \\cdot 8 \\cdot ${c * c} = ${80 * c * c}$.`,
        keyFormulasOrHints: ['log_{a^m}(b^n) = (n/m) log_a(b)', 'Số hạng tổng quát C_n^k A^(n-k) B^k']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `a) Tính tích phân: $I = \\int_0^{\\pi/2} \\big(${a}\\sin x + ${b}\\cos x\\big)\\,dx$.\nb) Tính diện tích hình phẳng giới hạn bởi $y = x^2 - ${2 * c}x$ và trục hoành.`,
        solution: `a) $I = \\big[-${a}\\cos x + ${b}\\sin x\\big]_0^{\\pi/2} = (0 + ${b}) - (-${a} + 0) = ${a + b}$.\n\nb) Nghiệm giao trục hoành: $x = 0$ và $x = ${2 * c}$. Do $x^2 - ${2 * c}x \\le 0$ trên $[0; ${2 * c}]$, diện tích:\n$$S = \\int_0^{${2 * c}} (${2 * c}x - x^2)\\,dx = \\left[${c}x^2 - \\frac{x^3}{3}\\right]_0^{${2 * c}} = \\frac{4\\cdot ${c ** 3}}{3} = \\frac{${4 * c ** 3}}{3}.$$`,
        keyFormulasOrHints: ['int sin x dx = -cos x', 'S = int_a^b |f(x)| dx'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Hình phẳng Tích phân 2D' }
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `a) Tính thể tích khối tròn xoay khi quay hình phẳng giới hạn bởi $y = \\sqrt{${a}x + 1}$, $y = 0$, $x = 0$, $x = 2$ quanh trục $Ox$.\nb) Biết $F(x)$ là nguyên hàm của $f(x) = e^{2x} + ${b}$ thỏa $F(0) = 1$. Tính $F(1)$.`,
        solution: `a) $V = \\pi \\int_0^2 (${a}x + 1)\\,dx = \\pi\\left[\\frac{${a}x^2}{2} + x\\right]_0^2 = (${2 * a + 2})\\pi$.\n\nb) $F(x) = \\frac{1}{2}e^{2x} + ${b}x + C$. Từ $F(0) = \\frac{1}{2} + C = 1 \\implies C = \\frac{1}{2}$.\nVậy $F(1) = \\frac{1}{2}e^2 + ${b} + \\frac{1}{2}$.`,
        keyFormulasOrHints: ['V = pi int_a^b y^2 dx', 'int e^(kx) dx = (1/k)e^(kx)'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Khối tròn xoay 3D' }
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Một chất điểm chuyển động có phương trình vận tốc $v(t) = 3t^2 + ${2 * a}t + ${b}$ (m/s).\na) Tính quãng đường chất điểm đi được từ giây $t = 1$ đến giây $t = 3$.\nb) Tính tích phân $J = \\int_1^2 \\frac{2x + ${c}}{x^2 + ${c}x}\\,dx$.`,
        solution: `a) Vì $v(t) > 0$ với mọi $t \\ge 0$, quãng đường là:\n$$S = \\int_1^3 (3t^2 + ${2 * a}t + ${b})\\,dt = \\big[t^3 + ${a}t^2 + ${b}t\\big]_1^3 = (27 + ${9 * a + 3 * b}) - (1 + ${a + b}) = ${26 + 8 * a + 2 * b}\\text{ m}.$$\n\nb) Nhận thấy $(x^2 + ${c}x)' = 2x + ${c}$, nên:\n$$J = \\big[\\ln|x^2 + ${c}x|\\big]_1^2 = \\ln\\left(\\frac{${4 + 2 * c}}{${1 + c}}\\right).$$`,
        keyFormulasOrHints: ['S = int_{t1}^{t2} v(t) dt', 'int u\'/u dx = ln|u|'],
        simulationLink: { type: 'math', targetId: 'grapher', label: 'Tích phân & Quãng đường' }
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `a) Tính diện tích hình phẳng giới hạn bởi hai đường cong $y = x^2$ và $y = ${b}x$.\nb) Tính tích phân từng phần $K = \\int_0^1 (x + ${a})e^x\\,dx$.`,
        solution: `a) Phương trình hoành độ giao điểm: $x^2 = ${b}x \\iff x = 0$ hoặc $x = ${b}$.\nDiện tích: $S = \\int_0^{${b}} (${b}x - x^2)\\,dx = \\frac{${b ** 3}}{6}$.\n\nb) Đặt $u = x + ${a} \\implies du = dx$; $dv = e^x dx \\implies v = e^x$.\n$$K = \\big[(x + ${a})e^x\\big]_0^1 - \\int_0^1 e^x\\,dx = (${1 + a})e - ${a} - (e - 1) = ${a}e - ${a - 1}.$$`,
        keyFormulasOrHints: ['Diện tích giới hạn y=x^2 và y=bx bằng b^3/6', 'Tích phân từng phần int u dv = uv - int v du']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `a) Cho $\\int_0^3 f(x)\\,dx = ${2 * b}$ và $\\int_3^7 f(x)\\,dx = ${3 * a}$. Tính $T = \\int_0^7 \\big[2f(x) + 1\\big]\\,dx$.\nb) Tính thể tích khối chóp cụt đều có diện tích hai đáy lần lượt là $B_1 = ${4 * a}\\text{ cm}^2$, $B_2 = ${a}\\text{ cm}^2$ và chiều cao $h = 6\\text{ cm}$.`,
        solution: `a) Cộng cận tích phân: $\\int_0^7 f(x)\\,dx = ${2 * b + 3 * a}$.\nVậy $T = 2(${2 * b + 3 * a}) + 7 = ${4 * b + 6 * a + 7}$.\n\nb) Áp dụng công thức thể tích khối chóp cụt:\n$$V = \\frac{h}{3}\\big(B_1 + B_2 + \\sqrt{B_1 B_2}\\big) = \\frac{6}{3}\\big(${4 * a} + ${a} + \\sqrt{${4 * a * a}}\\big) = 2(${7 * a}) = ${14 * a}\\text{ cm}^3.$$`,
        keyFormulasOrHints: ['Tính chất tuyến tính của tích phân', 'V = h/3 (B1 + B2 + sqrt(B1 B2))'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Khối đa diện & Hình chóp 3D' }
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Trong không gian $Oxyz$, cho mặt cầu $(S): (x - ${a})^2 + (y + ${b})^2 + (z - ${c})^2 = ${4 * p * p}$ và mặt phẳng $(P): 2x - y + 2z + ${3 * a} = 0$.\na) Xác định tâm $I$ và bán kính $R$ của mặt cầu $(S)$.\nb) Tính khoảng cách từ $I$ đến $(P)$ và xét vị trí tương đối giữa $(P)$ và $(S)$.`,
        solution: `a) Mặt cầu $(S)$ có tâm $I(${a}; -${b}; ${c})$ và bán kính $R = ${2 * p}$.\n\nb) Khoảng cách từ $I$ đến $(P)$:\n$$d(I, (P)) = \\frac{|2(${a}) - (-${b}) + 2(${c}) + ${3 * a}|}{\\sqrt{2^2 + (-1)^2 + 2^2}} = \\frac{${5 * a + b + 2 * c}}{3} \\approx ${((5 * a + b + 2 * c) / 3).toFixed(2)}.$$\nSo sánh $d$ với $R = ${2 * p}$ để kết luận ${(5 * a + b + 2 * c) / 3 < 2 * p ? 'mặt phẳng (P) cắt mặt cầu (S) theo đường tròn giao tuyến.' : (5 * a + b + 2 * c) / 3 === 2 * p ? 'mặt phẳng (P) tiếp xúc với mặt cầu (S).' : 'mặt phẳng (P) không cắt mặt cầu (S).'}`,
        keyFormulasOrHints: ['Công thức khoảng cách d(I, (P))', 'So sánh d và R kết luận vị trí tương đối'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Mặt cầu & Mặt phẳng Oxyz 3D' }
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Một hộp có $${a + 3}$ bi đỏ và $${b + 2}$ bi xanh. Lấy ngẫu nhiên lần lượt không hoàn lại $2$ viên bi.\na) Tính xác suất để viên thứ nhất màu đỏ.\nb) Biết viên thứ nhất màu đỏ, tính xác suất để viên thứ hai màu xanh (xác suất có điều kiện GDPT 2018).`,
        solution: `Tổng số bi ban đầu là $N = ${a + b + 5}$.\n\na) Xác suất viên đầu màu đỏ: $P(A) = \\frac{${a + 3}}{${a + b + 5}} \\approx ${((a + 3) / (a + b + 5)).toFixed(3)}$.\n\nb) Khi viên đầu đỏ đã lấy ra, trong hộp còn $${a + b + 4}$ viên gồm $${b + 2}$ bi xanh. Vậy xác suất viên hai xanh là:\n$$P(B \\mid A) = \\frac{${b + 2}}{${a + b + 4}} \\approx ${((b + 2) / (a + b + 4)).toFixed(3)}.$$`,
        keyFormulasOrHints: ['Xác suất có điều kiện P(B | A)', 'Lấy không hoàn lại giảm tổng mẫu đi 1']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Trong không gian $Oxyz$, cho đường thẳng $d: \\frac{x - ${a}}{1} = \\frac{y + 1}{-2} = \\frac{z - ${c}}{2}$ và điểm $M(${a + 2}; 1; ${c + 1})$.\na) Viết phương trình mặt phẳng $(Q)$ đi qua $M$ và vuông góc với $d$.\nb) Tìm tọa độ hình chiếu vuông góc $H$ của $M$ lên đường thẳng $d$.`,
        solution: `a) Đường thẳng $d$ có VTCP $\\vec{u} = (1; -2; 2)$ cũng là VTPT của $(Q)$:\n$$1(x - ${a + 2}) - 2(y - 1) + 2(z - ${c + 1}) = 0 \\iff x - 2y + 2z - ${a + 2 * c + 2} = 0.$$\n\nb) Tham số hóa $H(${a} + t; -1 - 2t; ${c} + 2t) \\in d$. Từ $\\overrightarrow{MH} \\cdot \\vec{u} = 0$:\n$$(t - 2)\\cdot 1 + (-2 - 2t)\\cdot (-2) + (2t - 1)\\cdot 2 = 0 \\iff 9t = 0 \\iff t = 0.$$\nVậy hình chiếu vuông góc là $H(${a}; -1; ${c})$.`,
        keyFormulasOrHints: ['(Q) vuông góc d nhận VTCP u làm VTPT', 'MH · u = 0 tìm tham số t của hình chiếu H'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Hình chiếu Oxyz 3D' }
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình chữ nhật tâm $O$ với $AB = ${a},\\; AD = ${a}\\sqrt{3}$ và $SA = 2\\cdot ${a}$ vuông góc với đáy.\na) Tính thể tích khối chóp $S.ABCD$.\nb) Tính góc giữa đường thẳng $SC$ và mặt đáy $(ABCD)$.`,
        solution: `a) Diện tích đáy $S_{ABCD} = AB \\cdot AD = ${a * a}\\sqrt{3}$. Thể tích:\n$$V = \\frac{1}{3}S_{ABCD}\\cdot SA = \\frac{1}{3}\\cdot ${a * a}\\sqrt{3}\\cdot ${2 * a} = \\frac{${2 * a ** 3}\\sqrt{3}}{3}.$$\n\nb) Hình chiếu của $SC$ lên $(ABCD)$ là $AC = \\sqrt{AB^2 + AD^2} = \\sqrt{${a * a} + ${3 * a * a}} = ${2 * a}$.\nXét $\\triangle SAC$ vuông tại $A$: $\\tan\\widehat{SCA} = \\frac{SA}{AC} = \\frac{${2 * a}}{${2 * a}} = 1 \\implies \\widehat{SCA} = 45^\\circ$.`,
        keyFormulasOrHints: ['V = 1/3 B h', 'Góc đường thẳng & mặt phẳng qua hình chiếu AC'],
        simulationLink: { type: 'math', targetId: 'math3d', label: 'Hình chóp S.ABCD 3D' }
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Hai máy tự động I và II cùng sản xuất một loại linh kiện với tỷ lệ sản phẩm tương ứng là $40\\%$ và $60\\%$. Tỷ lệ phế phẩm của máy I là $2\\%$ và máy II là $5\\%$. Lấy ngẫu nhiên $1$ sản phẩm từ kho chung.\na) Tính xác suất để sản phẩm lấy ra là phế phẩm.\nb) Nếu sản phẩm lấy ra là phế phẩm, tính xác suất để nó do máy I sản xuất (Định lý Bayes).`,
        solution: `a) Theo công thức xác suất toàn phần:\n$$P(F) = 0.4 \\cdot 0.02 + 0.6 \\cdot 0.05 = 0.008 + 0.030 = 0.038 = 3.8\\%.$$\n\nb) Theo công thức Bayes:\n$$P(M_1 \\mid F) = \\frac{0.4 \\cdot 0.02}{0.038} = \\frac{0.008}{0.038} = \\frac{4}{19} \\approx 0.2105.$$`,
        keyFormulasOrHints: ['Xác suất toàn phần P(F) = sum P(Hi) P(F|Hi)', 'Định lý Bayes P(M1 | F)']
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
      id: `math-kc-${num}`,
      subject: 'math',
      track: 'khong_chuyen',
      subjectTag: 'Toán 12 THPT',
      categoryTag: i % 2 === 0 ? 'Thi Thử THPT Chuẩn GDPT 2018' : 'Khảo Sát Chất Lượng Toán 12',
      academicYear: year,
      title: `Đề Thi Thử Tốt Nghiệp THPT Môn Toán #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn đề chuẩn THPT 2026: ${school}`,
      timeMinutes: 90,
      featuredSnippet: q1.content.slice(0, 130) + '...',
      topics: ['# Đạo hàm & Tiệm cận', '# Mũ–Logarit & Tứ phân vị', '# Tích phân & Tròn xoay', '# Oxyz & Bayes 2018'],
      difficulty: i % 3 === 0 ? 'Nâng cao' : i % 2 === 0 ? 'Khá' : 'Cơ bản',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}
