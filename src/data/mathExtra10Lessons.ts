import { MathLecture } from '../types';

const TOPICS: Array<{
  id: string;
  num: number;
  grade: string;
  gradeGroup: MathLecture['gradeGroup'];
  title: string;
  cat: MathLecture['category'];
  sim2d: 'grapher' | 'geometry';
  sim3d: MathLecture['sim3dMode'];
  formula: string;
  desc: string;
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}> = [
  {
    id: 'math-extra-1',
    num: 91,
    grade: 'Lớp 12',
    gradeGroup: 'Lớp 12',
    title: 'Kỹ thuật Hàm đặc trưng giải Phương trình Mũ & Lôgarit',
    cat: 'Lượng giác & Mũ',
    sim2d: 'grapher',
    sim3d: 'tangent_surface_3d',
    formula: 'f(u) = f(v) \\text{ và } f\'(t) > 0 \\implies u = v',
    desc: 'Sử dụng tính đơn điệu của hàm số đặc trưng để xử lý nhanh phương trình mũ–lôgarit chứa tham số.',
    q: 'Nếu hàm số $f(t) = 2^t + t$ đồng biến trên $\\mathbb{R}$ và $2^x + x = 2^{3y} + 3y$, ta suy ra:',
    opts: ['$x = 3y$', '$x + 3y = 0$', '$x = y^3$', '$x = 2y$'],
    ans: 0,
    exp: 'Vì $f\'(t) = 2^t\\ln 2 + 1 > 0$ mọi $t$ nên $f(x) = f(3y) \\iff x = 3y$.'
  },
  {
    id: 'math-extra-2',
    num: 92,
    grade: 'Lớp 12',
    gradeGroup: 'Lớp 12',
    title: 'Tích phân từng phần & Đổi biến loại 2 cho Hàm ẩn',
    cat: 'Giải tích',
    sim2d: 'grapher',
    sim3d: 'integral_disks_3d',
    formula: '\\int_a^b u\\,dv = \\big[uv\\big]_a^b - \\int_a^b v\\,du',
    desc: 'Rút gọn biểu thức chứa $f(x)$ và $f\'(x)$ bằng tích phân từng phần và đồng nhất hàm.',
    q: 'Biết $\\int_0^1 f(x)\\,dx = 4$. Giá trị của $\\int_0^1 (2f(x) + 3x^2)\\,dx$ bằng:',
    opts: ['9', '11', '8', '10'],
    ans: 0,
    exp: '$2\\int_0^1 f(x)\\,dx + \\big[x^3\\big]_0^1 = 2\\cdot 4 + 1 = 9$.'
  },
  {
    id: 'math-extra-3',
    num: 93,
    grade: 'Lớp 12',
    gradeGroup: 'Lớp 12',
    title: 'Cực trị khoảng cách và góc trong Hình học Oxyz',
    cat: 'Hình học',
    sim2d: 'geometry',
    sim3d: 'line_plane_oxyz',
    formula: 'd(M, (P)) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}',
    desc: 'Kỹ thuật hình chiếu, mặt cầu tiếp xúc và bất đẳng thức vectơ tối ưu khoảng cách Oxyz.',
    q: 'Khoảng cách từ điểm $M(1;2;2)$ đến mặt phẳng $(P): 2x - 2y + z + 3 = 0$ bằng:',
    opts: ['1', '3', '2/3', '5/3'],
    ans: 0,
    exp: '$d = |2 - 4 + 2 + 3| / \\sqrt{4 + 4 + 1} = 3 / 3 = 1$.'
  },
  {
    id: 'math-extra-4',
    num: 94,
    grade: 'Lớp 11',
    gradeGroup: 'Lớp 11',
    title: 'Xác suất có điều kiện & Công thức Bayes ứng dụng',
    cat: 'Đại số & Xác suất',
    sim2d: 'grapher',
    sim3d: 'probability_bell_3d',
    formula: 'P(A|B) = \\frac{P(A\\cap B)}{P(B)}',
    desc: 'Phân tích cây xác suất và định lý xác suất toàn phần trong các bài toán kiểm định y sinh & kỹ thuật.',
    q: 'Cho $P(B) = 0{,}5$ và $P(A\\cap B) = 0{,}2$. Giá trị $P(A|B)$ bằng:',
    opts: ['0,25', '0,4', '0,1', '0,7'],
    ans: 1,
    exp: '$P(A|B) = 0{,}2 / 0{,}5 = 0{,}4$.'
  },
  {
    id: 'math-extra-5',
    num: 95,
    grade: 'Lớp 12',
    gradeGroup: 'Lớp 12',
    title: 'Thể tích Khối tròn xoay tạo bởi Hai đường cong',
    cat: 'Giải tích',
    sim2d: 'grapher',
    sim3d: 'revolution_solid',
    formula: 'V = \\pi \\int_a^b \\big|f^2(x) - g^2(x)\\big|\\,dx',
    desc: 'Tính chính xác thể tích vật thể tròn xoay bằng phương pháp lát cắt vòng đệm (washer method).',
    q: 'Quay hình phẳng giới hạn bởi $y = x$, $y = 0$, $x = 0$, $x = 2$ quanh trục $Ox$ thu được khối nón có thể tích:',
    opts: ['$\\frac{8\\pi}{3}$', '$4\\pi$', '$\\frac{4\\pi}{3}$', '$8\\pi$'],
    ans: 0,
    exp: '$V = \\pi \\int_0^2 x^2\\,dx = \\frac{8\\pi}{3}$.'
  },
  {
    id: 'math-extra-6',
    num: 96,
    grade: 'Chuyên Toán',
    gradeGroup: 'Chuyên Toán',
    title: 'Bất đẳng thức Cauchy-Schwarz dạng Engel & Đổi biến p-q-r',
    cat: 'Đại số',
    sim2d: 'grapher',
    sim3d: 'conic_sections_3d',
    formula: '\\sum_{i=1}^n \\frac{a_i^2}{b_i} \\ge \\frac{(\\sum a_i)^2}{\\sum b_i} \\quad (b_i > 0)',
    desc: 'Ứng dụng bất đẳng thức cộng mẫu số Engel và phương pháp chuẩn hóa 3 biến đối xứng.',
    q: 'Với $a, b, c > 0$ và $a + b + c = 3$, giá trị nhỏ nhất của $\\frac{1}{a} + \\frac{1}{b} + \\frac{1}{c}$ là:',
    opts: ['1', '3', '6', '9'],
    ans: 1,
    exp: '$\\sum \\frac{1}{a} \\ge \\frac{(1+1+1)^2}{a+b+c} = \\frac{9}{3} = 3$.'
  },
  {
    id: 'math-extra-7',
    num: 97,
    grade: 'Chuyên Toán',
    gradeGroup: 'Chuyên Toán',
    title: 'Số học Đồng dư, Định lý Fermat nhỏ & Thặng dư Trung Hoa',
    cat: 'Số học & Tổ hợp',
    sim2d: 'geometry',
    sim3d: 'oxyz_vector',
    formula: 'a^{p-1} \\equiv 1 \\pmod p \\quad (\\gcd(a,p) = 1)',
    desc: 'Giải hệ đồng dư tuyến tính và tìm số dư lũy thừa lớn trong các đề thi HSG Toán.',
    q: 'Số dư của $2^{100}$ khi chia cho $7$ là:',
    opts: ['1', '2', '4', '6'],
    ans: 1,
    exp: '$2^3 = 8 \\equiv 1 \\pmod 7 \\implies 2^{100} = (2^3)^{33}\\cdot 2 \\equiv 2 \\pmod 7$.'
  },
  {
    id: 'math-extra-8',
    num: 98,
    grade: 'Chuyên Toán',
    gradeGroup: 'Chuyên Toán',
    title: 'Đường tròn Euler, Đường thẳng Simson & Cực đối cực',
    cat: 'Hình học',
    sim2d: 'geometry',
    sim3d: 'circle_theorems_3d',
    formula: '\\vec{OH} = \\vec{OA} + \\vec{OB} + \\vec{OC} = 3\\vec{OG}',
    desc: 'Liên kết tính chất đồng viên, trực tâm và điểm Miquel trong hình học phẳng Olympic.',
    q: 'Trong tam giác $ABC$ có tâm ngoại tiếp $O$, trọng tâm $G$ và trực tâm $H$. Hệ thức nào luôn đúng?',
    opts: ['$\\vec{OH} = 3\\vec{OG}$', '$\\vec{OH} = 2\\vec{OG}$', '$\\vec{OG} = 3\\vec{OH}$', '$\\vec{OH} = \\vec{OG}$'],
    ans: 0,
    exp: 'Định lý đường thẳng Euler khẳng định $O, G, H$ thẳng hàng và $\\vec{OH} = 3\\vec{OG}$.'
  },
  {
    id: 'math-extra-9',
    num: 99,
    grade: 'Lớp 11',
    gradeGroup: 'Lớp 11',
    title: 'Thiết diện Hình chóp & Tỉ số Thể tích Đa diện',
    cat: 'Hình học',
    sim2d: 'geometry',
    sim3d: 'pyramid_section',
    formula: '\\frac{V_{S.A\'B\'C\'}}{V_{S.ABC}} = \\frac{SA\'}{SA}\\cdot\\frac{SB\'}{SB}\\cdot\\frac{SC\'}{SC}',
    desc: 'Phương pháp xác định thiết diện song song và công thức Simson-tỉ số thể tích tứ diện.',
    q: 'Cho tứ diện $SABC$, lấy trung điểm $M, N, P$ lần lượt trên $SA, SB, SC$. Tỉ số $V_{S.MNP}/V_{S.ABC}$ bằng:',
    opts: ['1/2', '1/4', '1/8', '1/6'],
    ans: 2,
    exp: 'Tỉ số thể tích bằng $(1/2)\\cdot(1/2)\\cdot(1/2) = 1/8$.'
  },
  {
    id: 'math-extra-10',
    num: 100,
    grade: 'Lớp 12',
    gradeGroup: 'Lớp 12',
    title: 'Tối ưu hóa Kinh tế & Kỹ thuật bằng Đạo hàm',
    cat: 'Giải tích',
    sim2d: 'grapher',
    sim3d: 'sphere_plane',
    formula: 'f\'(x_0) = 0,\\; f\'\'(x_0) < 0 \\implies \\text{Cực đại địa phương}',
    desc: 'Thiết lập hàm mục tiêu chi phí, lợi nhuận và hình học thực tế tìm cực trị toàn cục trên miền đóng.',
    q: 'Hình chữ nhật có chu vi không đổi $20\\text{ cm}$ đạt diện tích lớn nhất bằng bao nhiêu?',
    opts: ['20 cm²', '25 cm²', '24 cm²', '16 cm²'],
    ans: 1,
    exp: 'Nửa chu vi $x + y = 10 \\implies S = xy \\le (x+y)^2/4 = 25\\text{ cm}^2$ khi là hình vuông cạnh 5.'
  }
];

export const MATH_EXTRA_10_LESSONS: MathLecture[] = TOPICS.map((t) => ({
  id: t.id,
  track: t.gradeGroup === 'Chuyên Toán' ? 'chuyen' : 'khong_chuyen',
  gradeGroup: t.gradeGroup,
  tier: t.gradeGroup === 'Chuyên Toán' ? 'Chuyên / HSG' : 'Nâng cao',
  lessonNumber: t.num,
  stageLabel: `${t.grade} · Chuyên đề Mở rộng`,
  sourceTag: 'Synapse Curriculum · Chuyên đề Trọng tâm',
  title: t.title,
  grade: t.grade,
  category: t.cat,
  difficulty: 'Vận dụng',
  readTimeMinutes: 15,
  description: t.desc,
  theory: [t.desc, `Công thức cốt lõi: $${t.formula}$`],
  keyFormulas: [t.formula],
  sampleProblems: [
    {
      source: 'Synapse Practice',
      question: t.q,
      options: t.opts,
      correctIndex: t.ans,
      explanation: t.exp
    }
  ],
  sim2dMode: t.sim2d,
  sim3dMode: t.sim3d
}));
