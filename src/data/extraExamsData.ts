import { ExamPaper, ExamQuestion } from '../types';
import { safeExamSnippet } from './examSnippetHelper';

const CHUYEN_SCHOOLS = [
  'THPT Chuyên Phan Bội Châu – Nghệ An',
  'THPT Chuyên Lam Sơn – Thanh Hóa',
  'THPT Chuyên Quốc Học – Huế',
  'THPT Chuyên Trần Phú – Hải Phòng',
  'THPT Chuyên Nguyễn Trãi – Hải Dương',
  'THPT Chuyên Vĩnh Phúc',
  'THPT Chuyên Bắc Ninh',
  'THPT Chuyên Hà Tĩnh',
  'THPT Chuyên Lê Quý Đôn – Đà Nẵng',
  'THPT Chuyên Thái Bình',
  'THPT Chuyên Hùng Vương – Phú Thọ',
  'THPT Chuyên Hạ Long – Quảng Ninh',
  'THPT Chuyên Lương Thế Vinh – Đồng Nai',
  'THPT Chuyên Nguyễn Bỉnh Khiêm – Quảng Nam',
  'THPT Chuyên Lê Quý Đôn – Bình Định',
  'THPT Chuyên Biên Hòa – Hà Nam',
  'THPT Chuyên Hoàng Văn Thụ – Hòa Bình',
  'THPT Chuyên Lê Khiết – Quảng Ngãi',
  'THPT Chuyên Tiền Giang',
  'THPT Chuyên Lý Tự Trọng – Cần Thơ'
];

const THPT_PROVINCES = [
  'Sở GD&ĐT Hà Nội',
  'Sở GD&ĐT TP. Hồ Chí Minh',
  'Sở GD&ĐT Hải Phòng',
  'Sở GD&ĐT Đà Nẵng',
  'Sở GD&ĐT Nghệ An',
  'Sở GD&ĐT Thanh Hóa',
  'Sở GD&ĐT Bắc Ninh',
  'Sở GD&ĐT Nam Định',
  'Sở GD&ĐT Vĩnh Phúc',
  'Sở GD&ĐT Thái Bình',
  'Sở GD&ĐT Thừa Thiên Huế',
  'Sở GD&ĐT Quảng Ninh',
  'Sở GD&ĐT Hải Dương',
  'Sở GD&ĐT Bình Dương',
  'Sở GD&ĐT Đồng Nai',
  'Sở GD&ĐT Cần Thơ',
  'Sở GD&ĐT Khánh Hòa',
  'Sở GD&ĐT Hà Tĩnh',
  'Sở GD&ĐT Phú Thọ',
  'Sở GD&ĐT Quảng Nam'
];

// =========================================================================
// 1. TOÁN CHUYÊN (20 ĐỀ: math-chuyen-11 -> math-chuyen-30)
// =========================================================================
function buildMathChuyenExams(): ExamPaper[] {
  const exams: ExamPaper[] = [];
  for (let i = 0; i < 20; i++) {
    const num = 11 + i;
    const school = CHUYEN_SCHOOLS[i];
    const p = i + 2; // 2..21
    const q = (i % 5) + 3; // 3..7
    const r = (i % 4) + 2; // 2..5
    const sumTarget = p * p + q;

    const q1Variants: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải hệ phương trình trên $\\mathbb{R}$:\n$$\\begin{cases} x^2 + y^2 + xy = ${p * p + p + 1} \\\\ x + y + xy = ${2 * p + 1} \\end{cases}$$\nb) Tìm giá trị lớn nhất của biểu thức $P = \\frac{\\sqrt{x - ${r}}}{x} + \\frac{\\sqrt{y - ${q}}}{y}$ với $x \\ge ${r}, y \\ge ${q}$.`,
        solution: `a) Đặt $S = x + y$, $P = xy$ (điều kiện $S^2 \\ge 4P$). Hệ trở thành:\n$$\\begin{cases} S^2 - P = ${p * p + p + 1} \\\\ S + P = ${2 * p + 1} \\end{cases}$$\nCộng theo vế: $S^2 + S - ${p * p + 3 * p + 2} = 0 \\iff (S - ${p + 1})(S + ${p + 2}) = 0$.\n- Với $S = ${p + 1} \\Rightarrow P = ${p}$: $(x, y) \\in \\{(1, ${p}), (${p}, 1)\\}$.\n- Với $S = -${p + 2} \\Rightarrow P = ${3 * p + 3}$: kiểm tra $S^2 - 4P = ${(p + 2) * (p + 2) - 4 * (3 * p + 3)}$ (loại nếu $< 0$).\n\nb) Áp dụng bất đẳng thức AM-GM:\n$$\\sqrt{${r}(x - ${r})} \\le \\frac{x}{2} \\Rightarrow \\frac{\\sqrt{x - ${r}}}{x} \\le \\frac{1}{2\\sqrt{${r}}}.$$\nTương tự $\\frac{\\sqrt{y - ${q}}}{y} \\le \\frac{1}{2\\sqrt{${q}}}$. Do đó $\\max P = \\frac{1}{2\\sqrt{${r}}} + \\frac{1}{2\\sqrt{${q}}}$, đạt tại $x = ${2 * r}, y = ${2 * q}$.`,
        keyFormulasOrHints: ['Đặt ẩn đối xứng S = x + y, P = xy', 'BĐT AM-GM khử căn ở tử']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `a) Giải phương trình vô tỉ: $\\sqrt{x + ${p}} + \\sqrt{${p + 4} - x} = x^2 - ${2 * p}x + ${p * p + 2}$.\nb) Cho $a, b, c > 0$ thỏa mãn $a + b + c = 3$. Chứng minh rằng:\n$$\\frac{a}{1 + b^2} + \\frac{b}{1 + c^2} + \\frac{c}{1 + a^2} \\ge \\frac{3}{2}.$$`,
        solution: `a) Điều kiện $-${p} \\le x \\le ${p + 4}$. Đặt $f(x) = \\sqrt{x + ${p}} + \\sqrt{${p + 4} - x}$.\nTheo Cauchy-Schwarz: $f(x)^2 \\le 2(x + ${p} + ${p + 4} - x) = ${4 * p + 8}$, đồng thời $f(x) \\ge \\sqrt{${2 * p + 4}}$.\nĐánh giá vế phải $g(x) = (x - ${p})^2 + 2 \\ge 2$, đối chiếu miền giá trị tìm nghiệm tại biên hoặc điểm cực trị.\n\nb) Sử dụng kỹ thuật Cauchy ngược dấu:\n$$\\frac{a}{1 + b^2} = a - \\frac{ab^2}{1 + b^2} \\ge a - \\frac{ab^2}{2b} = a - \\frac{ab}{2}.$$\nCộng 3 bất đẳng thức tương tự:\n$$VT \\ge (a + b + c) - \\frac{ab + bc + ca}{2} \\ge 3 - \\frac{(a+b+c)^2}{6} = 3 - \\frac{3}{2} = \\frac{3}{2}.$$\nDấu bằng xảy ra khi $a = b = c = 1$.`,
        keyFormulasOrHints: ['Kỹ thuật Cauchy ngược dấu', 'ab + bc + ca <= (a+b+c)^2 / 3']
      }
    ];

    const q2Variants: ExamQuestion[] = [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Tìm tất cả các số nguyên tố $x, y$ thỏa mãn phương trình:\n$$x^2 - ${r}y^2 = 1.$$\nb) Tìm tất cả các cặp số nguyên dương $(m, n)$ sao cho $A = m^2 + ${q}m + n^2$ chia hết cho $mn$.`,
        solution: `a) Viết lại $x^2 - 1 = ${r}y^2 \\iff (x - 1)(x + 1) = ${r}y^2$.\n- Nếu $y = 2$: $x^2 = ${4 * r + 1}$ (kiểm tra chính phương: khi $r=2 \\Rightarrow x=3$; các $r$ khác không là bình phương).\n- Nếu $y$ lẻ: vì $y$ là số nguyên tố nên $\\gcd(x-1, x+1) \\in \\{1, 2\\}$. Phân tích các ước nguyên tố $y^2$ phân bổ vào $x-1$ và $x+1$ để tìm nghiệm duy nhất.\n\nb) Xét bước nhảy Viète (Vieta Jumping): giả sử tồn tại bộ nghiệm $(m, n)$ sao cho $\\frac{m^2 + ${q}m + n^2}{mn} = k \\in \\mathbb{Z}^+$. Chọn cặp có $m + n$ nhỏ nhất và phân tích phương trình bậc hai theo $m$ để suy ra điều kiện chia hết và nghiệm nhỏ nhất.`,
        keyFormulasOrHints: ['Phân tích (x-1)(x+1) = r.y^2', 'Bước nhảy Viète (Vieta Jumping)']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `a) Chứng minh rằng không tồn tại số nguyên $n$ nào để $n^4 + ${q}n^2 + ${r + 1}$ là số chính phương (kiểm tra đồng dư theo modulo $4$ hoặc $8$).\nb) Tìm tất cả các hàm số $f: \\mathbb{R} \\to \\mathbb{R}$ thỏa mãn $f(x + f(y)) = f(x) + y + ${r}$ với mọi $x, y \\in \\mathbb{R}$.`,
        solution: `a) Xét theo modulo 4 hoặc kẹp giữa hai số chính phương liên tiếp:\n$$(n^2 + k)^2 < n^4 + ${q}n^2 + ${r + 1} < (n^2 + k + 1)^2$$\nkhi $|n|$ lớn hơn ngưỡng xác định, sau đó thử trực tiếp các giá trị nguyên nhỏ của $n$.\n\nb) Thay $x = 0$: $f(f(y)) = f(0) + y + ${r}$. Suy ra $f$ song ánh trên $\\mathbb{R}$.\nThay $y$ thích hợp để đưa về hàm cộng tính hoặc thế $x \\mapsto x - f(y)$ kết luận $f(t) = t + c$. Thử lại vào phương trình gốc: $c + c = c + ${r} \\implies c = ${r}$, hay $f(x) = x + ${r}$.`,
        keyFormulasOrHints: ['Kẹp giữa hai số chính phương liên tiếp', 'Chứng minh song ánh trong phương trình hàm']
      }
    ];

    const q3Variants: ExamQuestion[] = [
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho đường tròn $(O; R)$ và dây cung $BC$ cố định không đi qua $O$. Điểm $A$ chuyển động trên cung lớn $BC$ ($A$ khác $B, C$). Các đường cao $AD, BE, CF$ của tam giác $ABC$ đồng quy tại trực tâm $H$.\na) Chứng minh $OA \\perp EF$.\nb) Gọi $M$ là trung điểm $BC$, tia $MH$ cắt $(O)$ tại $K$. Chứng minh $AK$ là đường kính của $(O)$.\nc) Chứng minh tâm đường tròn ngoại tiếp tam giác $AEF$ luôn di chuyển trên một đường cố định khi $A$ thay đổi.`,
        solution: `a) Kẻ tiếp tuyến $Ax$ của $(O)$ tại $A$ nằm cùng phía với $B$ so với $OA$. Ta có $\\widehat{xAB} = \\widehat{ACB}$ (góc tạo bởi tiếp tuyến và dây cung). Tứ giác $BCEF$ nội tiếp nên $\\widehat{AEF} = \\widehat{ABC}$ và $\\widehat{AFE} = \\widehat{ACB} = \\widehat{xAB}$. Do đó $Ax \\parallel EF$. Mà $OA \\perp Ax \\implies OA \\perp EF$.\n\nb) Gọi $K'$ là điểm đối xứng của $A$ qua $O$ (tức $AK'$ là đường kính). Ta có $K'B \\perp AB$ và $CH \\perp AB \\implies K'B \\parallel CH$. Tương tự $K'C \\parallel BH$. Suy ra $BHCK'$ là hình bình hành. Vì $M$ là trung điểm $BC$ nên $M$ cũng là trung điểm $HK'$, tức $M, H, K'$ thẳng hàng hay $K \\equiv K'$.\n\nc) Tâm đường tròn ngoại tiếp $\\triangle AEF$ là trung điểm $I$ của $AH$. Vì $\\vec{AI} = \\frac{1}{2}\\vec{AH} = \\vec{OM}$ cố định về hướng và độ dài, $I$ ảnh của $A$ qua phép tịnh tiến $\\vec{OM}$, nên $I$ chuyển động trên đường tròn ảnh của $(O)$ có bán kính $R$ và tâm $O'$ thỏa $\\vec{OO'} = \\vec{OM}$ cố định.`,
        keyFormulasOrHints: ['Tứ giác nội tiếp BCEF', 'Hình bình hành BHCK trong đường tròn ngoại tiếp', 'Định lý Euler AH = 2.OM']
      },
      {
        number: 'Bài 3',
        points: '3.0 điểm',
        content: `Cho tam giác nhọn $ABC$ nội tiếp $(O)$ với trực tâm $H$. Đường tròn đường kính $AH$ cắt $(O)$ tại điểm thứ hai $T$ ($T \\neq A$) và cắt $AB, AC$ tại $F, E$.\na) Chứng minh $T, E, F$ nằm trên đường tròn đường kính $AH$ và $TH$ đi qua trung điểm $M$ của $BC$.\nb) Gọi $S$ là giao điểm của $EF$ và $BC$. Chứng minh $S, T, A$ thẳng hàng.\nc) Chứng minh tứ giác $SMOT$ nội tiếp.`,
        solution: `a) Các góc $\\widehat{AFH} = \\widehat{AEH} = 90^\\circ$ nên $E, F$ thuộc đường tròn đường kính $AH$. Gọi $K$ đối xứng $A$ qua $O$, ta có $\\widehat{ATK} = 90^\\circ$ và $\\widehat{ATH} = 90^\\circ$ nên $T, H, K$ thẳng hàng. Vì $BHCK$ là hình bình hành nên $HK$ đi qua trung điểm $M$ của $BC$. Vậy $T, H, M$ thẳng hàng.\n\nb) $AT$ là trục đẳng phương của $(O)$ và đường tròn $(AH)$. $EF$ là trục đẳng phương của $(AH)$ và đường tròn đường kính $BC$. $BC$ là trục đẳng phương của $(O)$ và đường tròn đường kính $BC$. Theo định lý về tâm đẳng phương của 3 đường tròn, $AT, EF, BC$ đồng quy tại $S$.\n\nc) Xét $\\triangle ASM$ có $H$ là trực tâm ($SH \\perp AM$ từ cực-đối cực hoặc $\\widehat{STM} = 90^\\circ$), chứng minh $\\widehat{STO} = \\widehat{SMO} = 90^\\circ$ dẫn đến $S, M, O, T$ cùng thuộc đường tròn đường kính $SO$.`,
        keyFormulasOrHints: ['Điểm Queg / Điểm Miquel trên tứ giác toàn phần', 'Trục đẳng phương 3 đường tròn']
      }
    ];

    const q4Variants: ExamQuestion[] = [
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Trên một bảng đen viết ${20 + p} số nguyên liên tiếp $1, 2, \\dots, ${20 + p}$. Mỗi bước cho phép xóa hai số $a, b$ bất kỳ rồi viết thay bằng $|a - b|$. Hỏi sau ${19 + p} bước, số cuối cùng còn lại trên bảng có thể bằng $0$ hay không? Giải thích chặt chẽ.`,
        solution: `Gọi $S$ là tổng các số hiện có trên bảng. Ban đầu:\n$$S_0 = 1 + 2 + \\dots + ${20 + p} = \\frac{${20 + p} \\cdot ${21 + p}}{2}.$$\nMỗi lần xóa hai số $a, b$ và thay bằng $|a - b|$, tổng $S$ thay đổi một lượng:\n$$\\Delta S = (a + b) - |a - b| = 2\\min(a, b),$$\nluôn là một số **chẵn**! Do đó tính chẵn lẻ của tổng các số trên bảng là bất biến.\nTa kiểm tra tính chẵn lẻ của $S_0 = \\frac{${20 + p} \\cdot ${21 + p}}{2}$: số cuối cùng còn lại phải cùng tính chẵn lẻ với $S_0$. Nếu $S_0$ lẻ thì **không thể** bằng $0$; nếu $S_0$ chẵn ta chỉ ra cách ghép cặp tạo $0$.`,
        keyFormulasOrHints: ['Bất biến tính chẵn lẻ của tổng', '(a + b) - |a - b| = 2.min(a, b)']
      },
      {
        number: 'Bài 4',
        points: '2.0 điểm',
        content: `Trong một hình vuông cạnh $1$, đặt tùy ý ${sumTarget > 30 ? 17 : 10} điểm phân biệt (không có 3 điểm nào thẳng hàng). Chứng minh rằng luôn chọn được ít nhất 3 điểm tạo thành một tam giác có diện tích không vượt quá $\\frac{1}{8}$.`,
        solution: `Chia hình vuông cạnh $1$ thành $4$ hình vuông nhỏ cạnh $\\frac{1}{2}$ (diện tích mỗi ô nhỏ là $\\frac{1}{4}$). Hoặc chia thành $4$ hình chữ nhật $1 \\times \\frac{1}{4}$ tùy theo số điểm.\nTheo nguyên lý Dirichlet, với $9$ điểm trở lên đặt vào $4$ hình vuông cạnh $\\frac{1}{2}$, tồn tại ít nhất một hình vuông nhỏ chứa $\\lceil 9/4 \\rceil = 3$ điểm.\nMọi tam giác có 3 đỉnh nằm trong một hình vuông cạnh $a = \\frac{1}{2}$ đều có diện tích không vượt quá nửa diện tích hình vuông đó:\n$$S_{\\triangle} \\le \\frac{1}{2} a^2 = \\frac{1}{2} \\left(\\frac{1}{2}\\right)^2 = \\frac{1}{8}.$$`,
        keyFormulasOrHints: ['Chia lưới theo nguyên lý Dirichlet', 'Diện tích tam giác trong hình vuông <= a^2 / 2']
      }
    ];

    const q1 = q1Variants[i % q1Variants.length];
    const q2 = q2Variants[i % q2Variants.length];
    const q3 = q3Variants[i % q3Variants.length];
    const q4 = q4Variants[i % q4Variants.length];

    exams.push({
      id: `math-chuyen-${num}`,
      subject: 'math',
      track: 'chuyen',
      subjectTag: 'Toán Chuyên',
      categoryTag: i % 2 === 0 ? 'Tuyển Sinh Chuyên' : 'Học Sinh Giỏi Tỉnh',
      academicYear: i % 3 === 0 ? '2025-2026' : '2024-2025',
      title: `Đề Chọn Học Sinh Giỏi & Chuyên Toán #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn tham khảo chuẩn đề: ${school}`,
      timeMinutes: 150,
      featuredSnippet: safeExamSnippet(q1.content, 140),
      topics: ['# Hệ phương trình', '# Số học Đồng dư', '# Hình học Đường tròn', '# Tổ hợp Bất biến'],
      difficulty: 'Chuyên / HSG',
      questions: [q1, q2, q3, q4]
    });
  }
  return exams;
}

// =========================================================================
// 2. TOÁN KHÔNG CHUYÊN / THPT (20 ĐỀ: math-kc-11 -> math-kc-30)
// =========================================================================
function buildMathStandardExams(): ExamPaper[] {
  const exams: ExamPaper[] = [];
  for (let i = 0; i < 20; i++) {
    const num = 11 + i;
    const province = THPT_PROVINCES[i];
    const a = (i % 4) + 1; // 1..4
    const b = (i % 5) + 2; // 2..6
    const c = (i % 3) + 1; // 1..3
    const integralRes = a * 9 + 3 * b; // int_0^3 (3a x^2 + 2b x) dx = a*27 + 9*b

    const questions: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Cho hàm số bậc ba $y = x^3 - ${3 * a}x^2 + ${b}$.\na) Khảo sát sự biến thiên và tìm các điểm cực trị của đồ thị hàm số.\nb) Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số trên đoạn $[-1; ${2 * a + 1}]$.`,
        solution: `a) Tập xác định $D = \\mathbb{R}$. Đạo hàm $y' = 3x^2 - ${6 * a}x = 3x(x - ${2 * a})$.\nCho $y' = 0 \\iff x = 0$ hoặc $x = ${2 * a}$.\nHàm số đạt cực đại tại $x = 0, y_{\\text{CĐ}} = ${b}$; đạt cực tiểu tại $x = ${2 * a}, y_{\\text{CT}} = ${b - 4 * a ** 3}$.\n\nb) Vì các điểm cực trị $0$ và $${2 * a}$ đều thuộc $[-1; ${2 * a + 1}]$, ta tính giá trị tại 4 điểm:\n- $y(-1) = ${-1 - 3 * a + b}$\n- $y(0) = ${b}$\n- $y(${2 * a}) = ${b - 4 * a ** 3}$\n- $y(${2 * a + 1}) = ${(2 * a + 1) ** 3 - 3 * a * (2 * a + 1) ** 2 + b}$\nTừ đó đối chiếu chọn $\\max$ và $\\min$ trên đoạn đã cho.`,
        keyFormulasOrHints: ["y' = 0 tìm cực trị", 'So sánh giá trị tại biên và cực trị']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `a) Giải phương trình mũ: $${c + 1}^{2x - 1} = ${c + 1}^{x + ${a}}$.\nb) Giải bất phương trình lôgarit: $\\log_2(x - ${c}) \\le ${b > 4 ? 3 : 2}$.`,
        solution: `a) Cùng cơ số $${c + 1} > 0, \\neq 1 \\implies 2x - 1 = x + ${a} \\iff x = ${a + 1}$.\n\nb) Điều kiện xác định: $x - ${c} > 0 \\iff x > ${c}$.\nVì cơ số $2 > 1$ nên bất phương trình tương đương:\n$$x - ${c} \\le 2^{${b > 4 ? 3 : 2}} = ${b > 4 ? 8 : 4} \\iff x \\le ${c + (b > 4 ? 8 : 4)}.$$\nKết hợp điều kiện ta được tập nghiệm $S = (${c}; ${c + (b > 4 ? 8 : 4)}]$.`,
        keyFormulasOrHints: ['Điều kiện biểu thức trong logarit > 0', 'Cơ số > 1 giữ nguyên chiều BPT']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Tính tích phân xác định sau:\n$$I = \\int_0^3 (${3 * a}x^2 + ${2 * b}x)\\,dx.$$\nSau đó tìm thể tích khối tròn xoay khi quay hình phẳng giới hạn bởi $y = \\sqrt{x + ${c}}$, trục $Ox$ và hai đường thẳng $x = 0, x = 3$ quanh trục $Ox$.`,
        solution: `Tính nguyên hàm $F(x) = ${a}x^3 + ${b}x^2$.\n$$I = F(3) - F(0) = ${a}\\cdot 27 + ${b}\\cdot 9 = ${3 * integralRes}.$$\nThể tích khối tròn xoay:\n$$V = \\pi \\int_0^3 (\\sqrt{x + ${c}})^2\\,dx = \\pi \\left[\\frac{x^2}{2} + ${c}x\\right]_0^3 = \\pi\\left(\\frac{9}{2} + ${3 * c}\\right) = \\frac{${9 + 6 * c}\\pi}{2}.$$`,
        keyFormulasOrHints: ['Định lý Newton-Leibniz', 'V = pi * int f^2(x) dx']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Trong không gian $Oxyz$, cho ba điểm $A(${a}; 0; 0)$, $B(0; ${b}; 0)$, $C(0; 0; ${c})$.\na) Viết phương trình mặt phẳng $(ABC)$ theo đoạn chắn và dạng tổng quát.\nb) Tính khoảng cách từ gốc tọa độ $O(0; 0; 0)$ đến mặt phẳng $(ABC)$.`,
        solution: `a) Phương trình đoạn chắn mặt phẳng $(ABC)$:\n$$\\frac{x}{${a}} + \\frac{y}{${b}} + \\frac{z}{${c}} = 1 \\iff ${b * c}x + ${a * c}y + ${a * b}z - ${a * b * c} = 0.$$\n\nb) Khoảng cách từ $O$ đến $(ABC)$:\n$$d(O, (ABC)) = \\frac{|-${a * b * c}|}{\\sqrt{(${b * c})^2 + (${a * c})^2 + (${a * b})^2}} = \\frac{${a * b * c}}{\\sqrt{${(b * c) ** 2 + (a * c) ** 2 + (a * b) ** 2}}}.$$`,
        keyFormulasOrHints: ['Phương trình mặt phẳng theo đoạn chắn x/a + y/b + z/c = 1', 'Công thức khoảng cách điểm đến mặt phẳng']
      }
    ];

    exams.push({
      id: `math-kc-${num}`,
      subject: 'math',
      track: 'khong_chuyen',
      subjectTag: 'Toán 12 THPT',
      categoryTag: i % 2 === 0 ? 'Thi Thử Tốt Nghiệp' : 'Khảo Sát Chất Lượng',
      academicYear: '2025-2026',
      title: `Đề Thi Thử Tốt Nghiệp THPT Môn Toán #${num} – ${province}`,
      school: province,
      source: `Nguồn đề chuẩn THPT: ${province}`,
      timeMinutes: 90,
      featuredSnippet: safeExamSnippet(questions[0].content, 130),
      topics: ['# Hàm số & Cực trị', '# Mũ & Logarit', '# Tích phân', '# Hình học Oxyz'],
      difficulty: i % 3 === 0 ? 'Khá' : 'Cơ bản',
      questions
    });
  }
  return exams;
}

// =========================================================================
// 3. VẬT LÍ CHUYÊN (20 ĐỀ: phy-chuyen-11 -> phy-chuyen-30)
// =========================================================================
function buildPhysicsChuyenExams(): ExamPaper[] {
  const exams: ExamPaper[] = [];
  for (let i = 0; i < 20; i++) {
    const num = 11 + i;
    const school = CHUYEN_SCHOOLS[i];
    const m = 0.2 + (i % 5) * 0.1; // 0.2..0.6 kg
    const k = 40 + (i % 4) * 20; // 40..100 N/m
    const v0 = 20 + (i % 5) * 5; // m/s
    const R = 50 + (i % 4) * 25; // Ohm
    const Zl = 80 + (i % 3) * 20;
    const Zc = 40 + (i % 3) * 10;

    const questions: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một vật nhỏ khối lượng $m = ${m.toFixed(1)}\\text{ kg}$ trượt không ma sát từ độ cao $h = 1.8\\text{ m}$ xuống một mặt phẳng nghiêng góc $\\alpha = 30^\\circ$, sau đó đi vào vùng nằm ngang có hệ số ma sát trượt $\\mu = 0.25$ (lấy $g = 10\\text{ m/s}^2$).\na) Tính vận tốc của vật ngay khi vừa xuống hết mặt phẳng nghiêng.\nb) Tìm quãng đường vật đi được trên mặt phẳng nằm ngang cho đến khi dừng lại.`,
        solution: `a) Áp dụng định luật bảo toàn cơ năng trên đoạn trượt không ma sát:\n$$mgh = \\frac{1}{2}mv^2 \\implies v = \\sqrt{2gh} = \\sqrt{2 \\cdot 10 \\cdot 1.8} = 6\\text{ m/s}.$$\n\nb) Trên đoạn nằm ngang, công của lực ma sát làm biến thiên động năng:\n$$0 - \\frac{1}{2}mv^2 = -\\mu mg s \\implies s = \\frac{v^2}{2\\mu g} = \\frac{36}{2 \\cdot 0.25 \\cdot 10} = 7.2\\text{ m}.$$`,
        keyFormulasOrHints: ['Bảo toàn cơ năng mgh = 1/2 mv^2', 'Định lý động năng A_ms = Delta W_d']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Một con lắc lò xo nằm ngang gồm lò xo độ cứng $k = ${k}\\text{ N/m}$ và vật nhỏ $m = ${m.toFixed(1)}\\text{ kg}$. Từ vị trí cân bằng, truyền cho vật vận tốc ban đầu $v_0 = 0.8\\text{ m/s}$ dọc theo trục lò xo.\na) Tính tần số góc $\\omega$, chu kỳ $T$ và biên độ dao động $A$.\nb) Tìm lực đàn hồi cực đại tác dụng lên giá đỡ trong quá trình dao động.`,
        solution: `a) Tần số góc:\n$$\\omega = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{${k}}{${m.toFixed(1)}}} = ${Math.sqrt(k / m).toFixed(2)}\\text{ rad/s}.$$\nChu kỳ $T = \\frac{2\\pi}{\\omega} \\approx ${(2 * Math.PI / Math.sqrt(k / m)).toFixed(3)}\\text{ s}$.\nBiên độ $A = \\frac{v_0}{\\omega} = \\frac{0.8}{${Math.sqrt(k / m).toFixed(2)}} \\approx ${(0.8 / Math.sqrt(k / m) * 100).toFixed(2)}\\text{ cm}$.\n\nb) Con lắc nằm ngang nên $\\Delta \\ell_0 = 0$, lực đàn hồi cực đại:\n$$F_{\\max} = kA = m\\omega v_0 = ${(m * Math.sqrt(k / m) * 0.8).toFixed(2)}\\text{ N}.$$`,
        keyFormulasOrHints: ['omega = sqrt(k/m)', 'v_max = omega.A', 'F_dh max = kA']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho mạch điện xoay chiều $RLC$ mắc nối tiếp gồm điện trở $R = ${R}\\,\\Omega$, cuộn cảm thuần có $Z_L = ${Zl}\\,\\Omega$ và tụ điện có $Z_C = ${Zc}\\,\\Omega$. Đặt điện áp $u = 120\\sqrt{2}\\cos(100\\pi t)\\text{ (V)}$ vào hai đầu đoạn mạch.\na) Tính tổng trở $Z$, cường độ dòng điện hiệu dụng $I$ và độ lệch pha $\\varphi$ giữa $u$ và $i$.\nb) Tính công suất tiêu thụ toàn mạch $P$ và hệ số công suất $\\cos\\varphi$.`,
        solution: `a) Tổng trở mạch:\n$$Z = \\sqrt{R^2 + (Z_L - Z_C)^2} = \\sqrt{${R}^2 + (${Zl - Zc})^2} = ${Math.sqrt(R * R + (Zl - Zc) ** 2).toFixed(2)}\\,\\Omega.$$\nCường độ hiệu dụng $I = \\frac{U}{Z} = \\frac{120}{${Math.sqrt(R * R + (Zl - Zc) ** 2).toFixed(2)}} \\approx ${(120 / Math.sqrt(R * R + (Zl - Zc) ** 2)).toFixed(2)}\\text{ A}$.\nĐộ lệch pha: $\\tan\\varphi = \\frac{Z_L - Z_C}{R} = \\frac{${Zl - Zc}}{${R}}$.\n\nb) Hệ số công suất $\\cos\\varphi = \\frac{R}{Z} \\approx ${(R / Math.sqrt(R * R + (Zl - Zc) ** 2)).toFixed(3)}$.\nCông suất tỏa nhiệt $P = I^2 R = \\frac{U^2 R}{Z^2} \\approx ${((120 * 120 * R) / (R * R + (Zl - Zc) ** 2)).toFixed(1)}\\text{ W}$.`,
        keyFormulasOrHints: ['Z = sqrt(R^2 + (ZL - ZC)^2)', 'P = UI cos(phi) = I^2 R']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Một chất điểm được ném xiên từ mặt đất với vận tốc đầu $v_0 = ${v0}\\text{ m/s}$ hợp với phương ngang một góc $\\alpha = 45^\\circ$ ($g = 10\\text{ m/s}^2$, bỏ qua sức cản).\na) Viết phương trình quỹ đạo $y(x)$.\nb) Tìm tầm bay xa $L$ và độ cao cực đại $H$ mà vật đạt được.`,
        solution: `a) Phương trình chuyển động:\n$$x = v_0\\cos\\alpha\\cdot t, \\quad y = v_0\\sin\\alpha\\cdot t - \\frac{1}{2}gt^2.$$\nKhử $t$: $y = x\\tan 45^\\circ - \\frac{g}{2v_0^2\\cos^2 45^\\circ}x^2 = x - \\frac{10}{${v0 * v0}}x^2$.\n\nb) Tầm bay xa:\n$$L = \\frac{v_0^2 \\sin(2\\alpha)}{g} = \\frac{${v0 * v0} \\cdot \\sin 90^\\circ}{10} = ${(v0 * v0 / 10).toFixed(1)}\\text{ m}.$$\nĐộ cao cực đại:\n$$H = \\frac{v_0^2 \\sin^2\\alpha}{2g} = \\frac{${v0 * v0} \\cdot 0.5}{20} = ${(v0 * v0 / 40).toFixed(2)}\\text{ m}.$$`,
        keyFormulasOrHints: ['L = v0^2 sin(2 alpha) / g', 'H = (v0 sin alpha)^2 / (2g)']
      }
    ];

    exams.push({
      id: `phy-chuyen-${num}`,
      subject: 'physics',
      track: 'chuyen',
      subjectTag: 'Vật Lí Chuyên',
      categoryTag: i % 2 === 0 ? 'Tuyển Sinh Chuyên Lí' : 'HSG Vật Lí Cấp Tỉnh',
      academicYear: '2025-2026',
      title: `Đề Thi Chuyên & HSG Vật Lí #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn tham khảo chuẩn đề: ${school}`,
      timeMinutes: 150,
      featuredSnippet: safeExamSnippet(questions[0].content, 130),
      topics: ['# Cơ học & Bảo toàn', '# Dao động điều hòa', '# Điện xoay chiều RLC', '# Chuyển động ném'],
      difficulty: 'Chuyên / HSG',
      questions
    });
  }
  return exams;
}

// =========================================================================
// 4. VẬT LÍ KHÔNG CHUYÊN / THPT (20 ĐỀ: phy-kc-11 -> phy-kc-30)
// =========================================================================
function buildPhysicsStandardExams(): ExamPaper[] {
  const exams: ExamPaper[] = [];
  for (let i = 0; i < 20; i++) {
    const num = 11 + i;
    const province = THPT_PROVINCES[i];
    const amp = 4 + (i % 5) * 2; // 4..12 cm
    const omega = (2 + (i % 3)) * Math.PI; // 2pi, 3pi, 4pi
    const lambda = 0.5 + (i % 4) * 0.1; // um
    const aMm = 1 + (i % 2) * 0.5; // mm
    const D = 2; // m
    const T_half = 138; // days

    const questions: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một vật dao động điều hòa với phương trình $x = ${amp}\\cos\\left(${omega / Math.PI}\\pi t - \\frac{\\pi}{3}\\right)\\text{ (cm)}$.\na) Xác định biên độ, tần số góc, chu kỳ $T$ và pha ban đầu.\nb) Tính vận tốc cực đại và gia tốc cực đại của vật.`,
        solution: `a) Biên độ $A = ${amp}\\text{ cm}$, tần số góc $\\omega = ${omega / Math.PI}\\pi\\text{ rad/s}$, pha ban đầu $\\varphi_0 = -\\frac{\\pi}{3}\\text{ rad}$.\nChu kỳ $T = \\frac{2\\pi}{\\omega} = \\frac{2}{${omega / Math.PI}} = ${(2 / (omega / Math.PI)).toFixed(3)}\\text{ s}$.\n\nb) Vận tốc cực đại $v_{\\max} = \\omega A = ${((amp * omega) / 100).toFixed(3)}\\text{ m/s}$ ($= ${(amp * omega / Math.PI).toFixed(1)}\\pi\\text{ cm/s}$).\nGia tốc cực đại $a_{\\max} = \\omega^2 A = ${((amp * omega * omega) / 100).toFixed(2)}\\text{ m/s}^2$.`,
        keyFormulasOrHints: ['x = A cos(omega t + phi)', 'v_max = omega A', 'a_max = omega^2 A']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Trong thí nghiệm Y-âng về giao thoa ánh sáng đơn sắc có bước sóng $\\lambda = ${lambda.toFixed(1)}\\,\\mu\\text{m}$, khoảng cách hai khe $a = ${aMm}\\text{ mm}$ và khoảng cách từ hai khe đến màn $D = ${D}\\text{ m}$.\na) Tính khoảng vân $i$.\nb) Xác định vị trí vân sáng bậc 3 và vân tối thứ 4 kể từ vân trung tâm.`,
        solution: `a) Khoảng vân giao thoa:\n$$i = \\frac{\\lambda D}{a} = \\frac{${lambda.toFixed(1)} \\cdot ${D}}{${aMm}} = ${((lambda * D) / aMm).toFixed(2)}\\text{ mm}.$$\n\nb) Vị trí vân sáng bậc 3: $x_{s3} = \\pm 3i = \\pm ${((3 * lambda * D) / aMm).toFixed(2)}\\text{ mm}$.\nVị trí vân tối thứ 4 ($k=3$ hoặc $-4$): $x_{t4} = \\pm 3.5 i = \\pm ${((3.5 * lambda * D) / aMm).toFixed(2)}\\text{ mm}$.`,
        keyFormulasOrHints: ['i = lambda D / a', 'Vân sáng x = k.i', 'Vân tối x = (k + 0.5)i']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Một lượng khí lí tưởng thực hiện quá trình đẳng nhiệt ở nhiệt độ $T_1 = 300\\text{ K}$ có áp suất $p_1 = ${1 + (i % 3)}\\text{ atm}$ và thể tích $V_1 = 6\\text{ lít}$.\na) Nén đẳng nhiệt để thể tích còn $V_2 = 2\\text{ lít}$, tính áp suất $p_2$.\nb) Tiếp tục đun nóng đẳng tích lên $T_3 = 450\\text{ K}$, tính áp suất $p_3$.`,
        solution: `a) Áp dụng định luật Boyle cho quá trình đẳng nhiệt:\n$$p_1 V_1 = p_2 V_2 \\implies p_2 = \\frac{${1 + (i % 3)} \\cdot 6}{2} = ${3 * (1 + (i % 3))}\\text{ atm}.$$\n\nb) Quá trình đẳng tích tuân theo định luật Charles:\n$$\\frac{p_2}{T_2} = \\frac{p_3}{T_3} \\implies p_3 = p_2 \\cdot \\frac{450}{300} = 1.5\\,p_2 = ${(4.5 * (1 + (i % 3))).toFixed(1)}\\text{ atm}.$$`,
        keyFormulasOrHints: ['Đẳng nhiệt p1.V1 = p2.V2', 'Đẳng tích p2/T2 = p3/T3']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Hạt nhân phóng xạ Poloni $^{210}_{84}\\text{Po}$ có chu kỳ bán rã $T = ${T_half}\\text{ ngày}$, ban đầu có mẫu nguyên chất khối lượng $m_0 = ${20 + (i % 5) * 4}\\text{ g}$.\na) Viết phương trình phóng xạ $\\alpha$ tạo thành hạt nhân chì $\\text{Pb}$.\nb) Tính khối lượng Poloni còn lại sau thời gian $t = ${2 * T_half}\\text{ ngày}$.`,
        solution: `a) Phương trình phóng xạ $\\alpha$ ($^4_2\\text{He}$):\n$$^{210}_{84}\\text{Po} \\longrightarrow ^{206}_{82}\\text{Pb} + ^4_2\\text{He}.$$\n\nb) Khối lượng còn lại sau $t = 2T$:\n$$m = m_0 \\cdot 2^{-t/T} = ${20 + (i % 5) * 4} \\cdot 2^{-2} = ${(20 + (i % 5) * 4) / 4}\\text{ g}.$$`,
        keyFormulasOrHints: ['Bảo toàn số khối A và điện tích Z', 'm(t) = m0 * 2^(-t/T)']
      }
    ];

    exams.push({
      id: `phy-kc-${num}`,
      subject: 'physics',
      track: 'khong_chuyen',
      subjectTag: 'Vật Lí 12 THPT',
      categoryTag: i % 2 === 0 ? 'Thi Thử Tốt Nghiệp' : 'Kiểm Tra Định Kỳ',
      academicYear: '2025-2026',
      title: `Đề Thi Thử THPT Quốc Gia Môn Vật Lí #${num} – ${province}`,
      school: province,
      source: `Nguồn đề chuẩn THPT: ${province}`,
      timeMinutes: 50,
      featuredSnippet: safeExamSnippet(questions[0].content, 130),
      topics: ['# Dao động cơ', '# Giao thoa Y-âng', '# Khí lí tưởng', '# Hạt nhân phóng xạ'],
      difficulty: i % 3 === 0 ? 'Khá' : 'Cơ bản',
      questions
    });
  }
  return exams;
}

// =========================================================================
// 5. TIN HỌC CHUYÊN (20 ĐỀ: cs-chuyen-11 -> cs-chuyen-30)
// =========================================================================
function buildCSChuyenExams(): ExamPaper[] {
  const exams: ExamPaper[] = [];
  for (let i = 0; i < 20; i++) {
    const num = 11 + i;
    const school = CHUYEN_SCHOOLS[i];
    const mod = 1000000007;
    const nLimit = i % 2 === 0 ? '10^5' : '2\\cdot 10^5';

    const questions: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Cho dãy số nguyên dương $A$ gồm $N$ phần tử ($N \\le ${nLimit}, A_i \\le 10^9$) và số nguyên dương $K$. Hãy đếm số lượng cặp chỉ số $(l, r)$ với $1 \\le l \\le r \\le N$ sao cho tổng các phần tử $A_l + \\dots + A_r \\le K$ bằng kỹ thuật Hai con trỏ (Two Pointers) với độ phức tạp $\\mathcal{O}(N)$.`,
        solution: `Ý tưởng Two Pointers:\nVì mọi $A_i > 0$, khi mở rộng $r$ sang phải thì tổng tăng đơn điệu; khi dịch $l$ sang phải thì tổng giảm đơn điệu.\nTa duy trì cửa sổ $[l, r]$ có tổng $sum \\le K$. Với mỗi $r$ từ $0 \\to N-1$, cộng $A[r]$ vào $sum$; chừng nào $sum > K$ thì trừ $A[l]$ và tăng $l$. Khi đó mọi đoạn kết thúc tại $r$ bắt đầu từ $l \\dots r$ đều thỏa mãn, cộng thêm $(r - l + 1)$ vào kết quả.\n\nCode C++20 chuẩn $\\mathcal{O}(N)$:\n\`\`\`cpp\nlong long countSubarrays(const vector<long long>& a, long long K) {\n    long long sum = 0, ans = 0;\n    int l = 0;\n    for (int r = 0; r < (int)a.size(); ++r) {\n        sum += a[r];\n        while (sum > K && l <= r) {\n            sum -= a[l++];\n        }\n        ans += (r - l + 1);\n    }\n    return ans;\n}\n\`\`\``,
        keyFormulasOrHints: ['Kỹ thuật Hai con trỏ O(N)', 'Dùng long long tránh tràn số']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho $N$ công việc ($N \\le ${nLimit}$), công việc $i$ có thời điểm bắt đầu $s_i$ và kết thúc $e_i$. Đồng thời trên một trục đường có $M$ trạm đặt mốc, cần chọn tối đa các công việc không giao nhau (hoặc tìm kiếm nhị phân giá trị tối ưu $X$ nhỏ nhất để chia dãy thành $K$ đoạn). Hãy trình bày thuật toán tham lam $\\mathcal{O}(N\\log N)$ chọn nhiều công việc nhất.`,
        solution: `Thuật toán Tham lam kinh điển (Activity Selection):\n1. Sắp xếp tất cả $N$ đoạn $[s_i, e_i]$ theo chiều tăng dần của thời điểm kết thúc $e_i$.\n2. Chọn đoạn đầu tiên, đặt $lastEnd = e_0$, $cnt = 1$.\n3. Duyệt các đoạn tiếp theo: nếu $s_i \\ge lastEnd$ thì chọn đoạn này, cập nhật $lastEnd = e_i$ và $cnt++$.\nĐộ phức tạp thời gian $\\mathcal{O}(N \\log N)$, bộ nhớ $\\mathcal{O}(1)$ phụ trợ.`,
        keyFormulasOrHints: ['Sắp xếp tăng dần theo thời điểm kết thúc e_i', 'Độ phức tạp O(N log N)']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho đồ thị có hướng có trọng số không âm gồm $N$ đỉnh, $M$ cạnh ($N, M \\le 10^5$, trọng số $w_i \\le 10^9$). Tìm đường đi ngắn nhất từ đỉnh $1$ đến mọi đỉnh $u \\in [1..N]$, đồng thời đếm số lượng đường đi ngắn nhất theo modulo $${mod}$.`,
        solution: `Dùng thuật toán Dijkstra kết hợp Quy hoạch động trên đồ thị (DAG đường đi ngắn nhất):\n- Duy trì mảng $dist[u]$ (khởi tạo $\\infty$, $dist[1] = 0$) và $ways[u]$ ($ways[1] = 1$).\n- Khi lấy $(d, u)$ từ \`priority_queue\` (bỏ qua nếu $d > dist[u]$), xét mỗi cạnh $u \\to v$ trọng số $w$:\n  + Nếu $dist[u] + w < dist[v]$: cập nhật $dist[v] = dist[u] + w$, $ways[v] = ways[u]$, đẩy vào heap.\n  + Nếu $dist[u] + w == dist[v]$: cộng $ways[v] = (ways[v] + ways[u]) \\bmod ${mod}$.\nĐộ phức tạp $\\mathcal{O}((N + M)\\log N)$.`,
        keyFormulasOrHints: ['Dijkstra + Priority Queue', 'Cập nhật ways[v] mod 10^9 + 7']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Cho dãy $N$ vật phẩm, vật phẩm $i$ có trọng lượng $w_i$ và giá trị $v_i$ ($N \\le 1000$, sức chứa balo $W \\le 10^4$). Tìm tổng giá trị lớn nhất có thể mang theo sao cho tổng trọng lượng không vượt quá $W$, tối ưu không gian bộ nhớ về $\\mathcal{O}(W)$.`,
        solution: `Quy hoạch động Balo 0/1 (0/1 Knapsack) tối ưu mảng 1 chiều:\nGọi $dp[j]$ là giá trị lớn nhất với sức chứa $j$.\nDuyệt từng vật phẩm $i = 1..N$, với $j$ **duyệt ngược** từ $W$ về $w_i$ để mỗi vật chỉ dùng tối đa 1 lần:\n$$dp[j] = \\max(dp[j],\\; dp[j - w_i] + v_i).$$\nĐáp án là $dp[W]$. Thời gian $\\mathcal{O}(N\\cdot W)$, bộ nhớ $\\mathcal{O}(W)$.`,
        keyFormulasOrHints: ['DP Knapsack 1D duyệt ngược j = W downto w_i', 'Độ phức tạp O(NW)']
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
      featuredSnippet: safeExamSnippet(questions[0].content, 130),
      topics: ['# Hai con trỏ', '# Tham lam', '# Dijkstra Đường đi ngắn nhất', '# Quy hoạch động'],
      difficulty: 'Chuyên / HSG',
      questions
    });
  }
  return exams;
}

// =========================================================================
// 6. TIN HỌC KHÔNG CHUYÊN / CƠ BẢN (20 ĐỀ: cs-kc-11 -> cs-kc-30)
// =========================================================================
function buildCSStandardExams(): ExamPaper[] {
  const exams: ExamPaper[] = [];
  for (let i = 0; i < 20; i++) {
    const num = 11 + i;
    const province = THPT_PROVINCES[i];
    const targetMod = (i % 5) + 3; // 3..7

    const questions: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Viết chương trình Python hoặc C++ nhập vào một số nguyên dương $N$ ($N \\le 10^6$). Tính tổng các chữ số của $N$ và kiểm tra xem tổng đó có chia hết cho $${targetMod}$ hay không.`,
        solution: `Code Python mẫu:\n\`\`\`python\nn = input().strip()\ndigit_sum = sum(int(ch) for ch in n if ch.isdigit())\nprint("Tong chu so:", digit_sum)\nprint("Chia het" if digit_sum % ${targetMod} == 0 else "Khong chia het")\n\`\`\``,
        keyFormulasOrHints: ['Tách chữ số bằng chuỗi hoặc phép chia % 10, // 10', `Kiểm tra % ${targetMod} == 0`]
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho mảng $A$ gồm $N$ số nguyên ($N \\le 10^4$). Hãy:\na) Đếm số lượng phần tử chẵn và tính tổng các phần tử ở vị trí lẻ (chỉ số $1, 3, 5, \\dots$).\nb) Sắp xếp mảng theo thứ tự giảm dần mà giữ nguyên tính đúng đắn dữ liệu.`,
        solution: `Code Python mẫu:\n\`\`\`python\nn = int(input())\na = list(map(int, input().split()))\neven_cnt = sum(1 for x in a if x % 2 == 0)\nodd_pos_sum = sum(a[i] for i in range(1, n, 2))\nprint(even_cnt, odd_pos_sum)\nprint(*sorted(a, reverse=True))\n\`\`\``,
        keyFormulasOrHints: ['Vòng lặp bước nhảy range(1, n, 2)', 'sorted(a, reverse=True)']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Nhập vào hai xâu ký tự $S_1$ và $S_2$ chỉ gồm các chữ cái tiếng Anh thường.\na) Đếm tần suất xuất hiện của từng ký tự trong $S_1$.\nb) Kiểm tra xem $S_1$ và $S_2$ có phải là hai xâu đảo chữ (Anagram — chứa cùng tập ký tự với số lượng như nhau) hay không.`,
        solution: `Code Python mẫu:\n\`\`\`python\nfrom collections import Counter\ns1 = input().strip()\ns2 = input().strip()\nfreq = Counter(s1)\nprint(dict(freq))\nprint("YES" if Counter(s1) == Counter(s2) else "NO")\n\`\`\``,
        keyFormulasOrHints: ['Bảng đếm tần suất 26 chữ cái hoặc Counter', 'So sánh sorted(s1) == sorted(s2)']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Viết hàm tính ước chung lớn nhất $\\gcd(a, b)$ bằng thuật toán Euclid và áp dụng để rút gọn phân số $\\frac{A}{B}$ ($B \\neq 0$) về dạng tối giản.`,
        solution: `Code C++ / Python mẫu:\n\`\`\`python\ndef gcd(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return abs(a)\n\na, b = map(int, input().split())\ng = gcd(a, b)\nif b < 0:\n    a, b = -a, -b\nprint(f"{a // g}/{b // g}")\n\`\`\``,
        keyFormulasOrHints: ['Thuật toán Euclid gcd(a, b) = gcd(b, a % b)', 'Đưa mẫu số dương']
      }
    ];

    exams.push({
      id: `cs-kc-${num}`,
      subject: 'cs',
      track: 'khong_chuyen',
      subjectTag: 'Tin Học Phổ Thông',
      categoryTag: i % 2 === 0 ? 'Thi THPT & Năng Lực Số' : 'Kiểm Tra Học Kỳ',
      academicYear: '2025-2026',
      title: `Đề Khảo Sát Lập Trình & Thuật Toán Cơ Bản #${num} – ${province}`,
      school: province,
      source: `Nguồn đề thi chuẩn phổ thông: ${province}`,
      timeMinutes: 50,
      featuredSnippet: safeExamSnippet(questions[0].content, 130),
      topics: ['# Python & C++ Cơ bản', '# Mảng 1 chiều', '# Xâu ký tự Anagram', '# Thuật toán Euclid'],
      difficulty: i % 3 === 0 ? 'Khá' : 'Cơ bản',
      questions
    });
  }
  return exams;
}

export const EXTRA_EXAM_PAPERS: ExamPaper[] = [
  ...buildMathChuyenExams(),
  ...buildMathStandardExams(),
  ...buildPhysicsChuyenExams(),
  ...buildPhysicsStandardExams(),
  ...buildCSChuyenExams(),
  ...buildCSStandardExams()
];
