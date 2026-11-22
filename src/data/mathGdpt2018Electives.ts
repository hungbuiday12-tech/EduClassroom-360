import { MathLecture } from '../types';

export const MATH_GDPT_ELECTIVES: MathLecture[] = [
  // ==========================================================
  // 9 CHUYÊN ĐỀ HỌC TẬP TOÁN GDPT 2018 (LỚP 10 – 11 – 12)
  // ==========================================================
  {
    id: 'math-cd-10-1',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Cơ bản',
    lessonNumber: 1,
    stageLabel: 'Chuyên đề GDPT 2018 · Lớp 10',
    sourceTag: 'Chuyên đề học tập Toán 10 KNTT · Chuyên đề 1',
    title: 'Chuyên đề 10.1: Hệ phương trình bậc nhất ba ẩn',
    grade: 'Chuyên đề Toán 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Giải hệ phương trình bậc nhất ba ẩn $x, y, z$ bằng phương pháp Gauss (khử ẩn bậc thang) và ứng dụng giải bài toán hóa học, vật lí mạch điện, kinh tế thực tiễn.',
    mnemonics: ['Phương pháp Gauss: Khử $x$ ở PT (2), (3) theo PT (1), rồi khử $y$ ở PT (3) theo PT (2) để đưa về dạng tam giác!'],
    commonTraps: ['Nhân/trừ hai phương trình sai dấu hoặc quên kiểm tra trường hợp hệ vô nghiệm / vô số nghiệm bậc thang.'],
    theory: [
      '1. Dạng tổng quát: $a_i x + b_i y + c_i z = d_i$ ($i=1,2,3$).',
      '2. Phép biến đổi sơ cấp: đổi chỗ 2 PT, nhân PT với số $k\\neq 0$, cộng bội của PT này vào PT khác.'
    ],
    keyFormulas: ['\\begin{cases} a_1x + b_1y + c_1z = d_1 \\\\ b_2\'y + c_2\'z = d_2\' \\\\ c_3\'\'z = d_3\'\' \\end{cases}'],
    flashcards: [{ front: 'Nếu ở dòng cuối của dạng tam giác ta thu được $0z = 5$, hệ có bao nhiêu nghiệm?', back: 'Hệ VÔ NGHIỆM (nếu $0z = 0$ thì vô số nghiệm).' }],
    sampleProblems: [
      {
        source: 'Chuyên đề Toán 10 KNTT · CĐ 1',
        question: 'Nghiệm của hệ $\\begin{cases} x+y+z=6 \\\\ y+z=5 \\\\ z=3 \\end{cases}$ là:',
        options: ['A. $(1; 2; 3)$', 'B. $(2; 1; 3)$', 'C. $(1; 3; 2)$', 'D. $(3; 2; 1)$'],
        correctIndex: 0,
        explanation: 'Thế ngược từ dưới lên: $z=3 \\implies y=2 \\implies x=1$.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề 10 · Định luật Kirchhoff mạch điện',
        question: 'Giải hệ: $\\begin{cases} x + y + z = 6 \\\\ 2x - y + z = 3 \\\\ x + 2y - z = 2 \\end{cases}$.',
        hints: ['Cộng PT (1) và (3) để khử $z$.'],
        solutionSteps: ['Bước 1: Cộng (1)+(3) $\\implies 2x+3y=8$; cộng (2)+(3) $\\implies 3x+y=5$.', 'Bước 2: Giải ra $x=1, y=2, z=3$.'],
        finalAnswer: '$(x; y; z) = (1; 2; 3)$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz',
    defaultGraphConfig: { type: 'linear', params: { a: -2, b: 3, c: 0, d: 0 }, color: '#3b82f6', name: 'Giao tuyến hệ phương trình' }
  },
  {
    id: 'math-cd-10-2',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Cơ bản',
    lessonNumber: 2,
    stageLabel: 'Chuyên đề GDPT 2018 · Lớp 10',
    sourceTag: 'Chuyên đề học tập Toán 10 KNTT · Chuyên đề 2',
    title: 'Chuyên đề 10.2: Phương pháp quy nạp toán học & Nhị thức Newton',
    grade: 'Chuyên đề Toán 10 · Tổ hợp',
    category: 'Đại số & Xác suất',
    difficulty: 'Vận dụng',
    readTimeMinutes: 18,
    description: 'Chứng minh đẳng thức/bất đẳng thức/chia hết bằng quy nạp toán học 2 bước và khai triển Nhị thức Newton $(a+b)^n$ với $n$ nguyên dương tổng quát.',
    mnemonics: ['Quy nạp gồm 2 bước: (1) Kiểm tra với $n = n_0$; (2) Giả sử đúng với $n = k \\ge n_0$, chứng minh đúng với $n = k + 1$.'],
    commonTraps: ['Quên bước cơ sở $n = n_0$ hoặc viết số hạng thứ $k+1$ của $(a+b)^n$ nhầm dấu trừ $(-b)^k$.'],
    theory: [
      '1. Số hạng tổng quát thứ $k+1$ trong $(a+b)^n$: $T_{k+1} = C_n^k a^{n-k} b^k$.',
      '2. Tổng hệ số: thay $x = 1$; tổng đan dấu: thay $x = -1$.'
    ],
    keyFormulas: ['(a+b)^n = \\sum_{k=0}^n C_n^k a^{n-k} b^k', '\\sum_{k=0}^n C_n^k = 2^n'],
    flashcards: [{ front: 'Tính tổng $S = C_n^0 + C_n^1 + \\dots + C_n^n$?', back: 'Thay $a=1, b=1$ vào $(a+b)^n$ được $S = 2^n$.' }],
    sampleProblems: [
      {
        source: 'Chuyên đề Toán 10 KNTT · CĐ 2',
        question: 'Số hạng chứa $x^4$ trong khai triển $(x - 2)^6$ có hệ số là:',
        options: ['A. $60$', 'B. $-60$', 'C. $15$', 'D. $240$'],
        correctIndex: 0,
        explanation: '$C_6^2 x^4 (-2)^2 = 15 \\cdot 4 x^4 = 60 x^4$.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề 10 · Quy nạp toán học',
        question: 'Chứng minh với mọi $n \\ge 1$, $1 + 3 + 5 + \\dots + (2n - 1) = n^2$.',
        hints: ['Kiểm tra $n=1$, giả sử đúng với $n=k$ rồi cộng thêm $(2k+1)$.'],
        solutionSteps: ['Bước 1: $n=1$: $1 = 1^2$ đúng.', 'Bước 2: Giả sử đúng với $k$, với $k+1$: $k^2 + (2k+1) = (k+1)^2$.'],
        finalAnswer: 'Đúng với mọi $n \\in \\mathbb{N}^*$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '3 * e^(-0.4 * x * x)', params: { a: 3, b: 1, c: 0, d: 0 }, color: '#8b5cf6', name: 'Hệ số Nhị thức Newton (Tam giác Pascal)' }
  },
  {
    id: 'math-10-6',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Nâng cao',
    lessonNumber: 3,
    stageLabel: 'Chuyên đề GDPT 2018 · Lớp 10',
    sourceTag: 'Chuyên đề học tập Toán 10 KNTT · Chuyên đề 3',
    title: 'Chuyên đề 10.3: Ba đường conic và ứng dụng thực tiễn',
    grade: 'Chuyên đề Toán 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 19,
    description: 'Định nghĩa thống nhất 3 đường conic theo tâm sai $e$ và đường chuẩn $\\Delta$: $MF = e \\cdot d(M, \\Delta)$ ($e<1$ Elip, $e=1$ Parabol, $e>1$ Hypebol), thiết diện mặt nón và quỹ đạo thiên thể.',
    mnemonics: ['Tâm sai $e = \\frac{c}{a}$: $0<e<1 \\implies$ Elip; $e = 1 \\implies$ Parabol; $e > 1 \\implies$ Hypebol!'],
    commonTraps: ['Nhầm phương trình đường chuẩn của Elip $x = \\pm\\frac{a}{e} = \\pm\\frac{a^2}{c}$ với tiêu điểm $F(\\pm c; 0)$.'],
    theory: [
      '1. Bán kính qua tiêu của Elip: $MF_1 = a + ex$, $MF_2 = a - ex$.',
      '2. Ứng dụng: Gương parabol hội tụ ánh sáng tại tiêu điểm; quỹ đạo hành tinh theo định luật Kepler là Elip.'
    ],
    keyFormulas: ['\\frac{MF}{d(M,\\Delta)} = e', 'e = \\frac{c}{a}', '\\Delta: x = \\pm\\frac{a}{e}'],
    flashcards: [{ front: 'Quỹ đạo một sao chổi bay quanh Mặt Trời có tâm sai $e = 1{,}2$ có dạng đường gì?', back: 'Vì $e > 1$ nên quỹ đạo là đường Hypebol (thoát khỏi Hệ Mặt Trời).' }],
    sampleProblems: [
      {
        source: 'Chuyên đề Toán 10 KNTT · CĐ 3',
        question: 'Elip $(E): \\frac{x^2}{25} + \\frac{y^2}{16} = 1$ có tâm sai $e$ bằng:',
        options: ['A. $\\frac{3}{5}$', 'B. $\\frac{4}{5}$', 'C. $\\frac{5}{3}$', 'D. $\\frac{9}{25}$'],
        correctIndex: 0,
        explanation: '$a=5, b=4 \\implies c = 3 \\implies e = \\frac{c}{a} = \\frac{3}{5}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề 10 · Đường chuẩn Conic',
        question: 'Viết phương trình đường chuẩn của Elip $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$.',
        hints: ['Tính $c = \\sqrt{a^2-b^2}$, đường chuẩn $x = \\pm\\frac{a^2}{c}$.'],
        solutionSteps: ['Bước 1: $a=5, b=3 \\implies c=4$.', 'Bước 2: Đường chuẩn $x = \\pm\\frac{25}{4}$.'],
        finalAnswer: '$x = \\pm\\frac{25}{4}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'conic_sections_3d'
  },
  {
    id: 'math-cd-11-1',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Cơ bản',
    lessonNumber: 4,
    stageLabel: 'Chuyên đề GDPT 2018 · Lớp 11',
    sourceTag: 'Chuyên đề học tập Toán 11 KNTT · Chuyên đề 1',
    title: 'Chuyên đề 11.1: Phép biến hình trong mặt phẳng',
    grade: 'Chuyên đề Toán 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description: 'Trong GDPT 2018, các phép dời hình (tịnh tiến $T_{\\vec{v}}$, đối xứng trục, đối xứng tâm, quay $Q_{(O,\\varphi)}$) và phép đồng dạng (vị tự $V_{(O,k)}$) chuyển thành Chuyên đề 11.1.',
    mnemonics: ['Tịnh tiến: $M\' = M + \\vec{v}$; Quay $(O; 90^\\circ)$: $(x; y) \\mapsto (-y; x)$; Vị tự tâm $O$ tỉ số $k$: $\\vec{OM\'} = k\\vec{OM}$.'],
    commonTraps: ['Nhầm dấu phép quay $+90^\\circ$ $(-y; x)$ với $-90^\\circ$ $(y; -x)$, hoặc quên tỉ số $|k|$ khi biến đổi bán kính đường tròn.'],
    theory: [
      '1. Phép dời hình bảo toàn khoảng cách giữa hai điểm bất kì.',
      '2. Phép vị tự tỉ số $k$ biến đường tròn bán kính $R$ thành đường tròn bán kính $|k|R$.'
    ],
    keyFormulas: ['T_{\\vec{v}}(M) = M\' \\iff \\vec{MM\'} = \\vec{v}', 'V_{(O,k)}(M)=M\' \\iff \\vec{OM\'} = k\\vec{OM}'],
    flashcards: [{ front: 'Ảnh của $M(2; 3)$ qua phép quay $Q_{(O, 90^\\circ)}$ là?', back: '$M\'(-3; 2)$.' }],
    sampleProblems: [
      {
        source: 'Chuyên đề Toán 11 KNTT · CĐ 1',
        question: 'Trong $Oxy$, ảnh của điểm $A(1; -2)$ qua phép tịnh tiến theo $\\vec{v} = (3; 5)$ là:',
        options: ['A. $(4; 3)$', 'B. $(-2; -7)$', 'C. $(3; 5)$', 'D. $(4; -7)$'],
        correctIndex: 0,
        explanation: '$A\'(1+3; -2+5) = (4; 3)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề 11 · Phép vị tự đường tròn',
        question: 'Tìm ảnh của đường tròn $(x-1)^2 + (y+2)^2 = 4$ qua phép vị tự tâm $O$ tỉ số $k = -2$.',
        hints: ['Tìm tâm mới $I\' = V_{(O,-2)}(I)$ và bán kính mới $R\' = |k|R$.'],
        solutionSteps: ['Bước 1: $I(1;-2) \\mapsto I\'(-2; 4)$; $R\' = |-2|\\cdot 2 = 4$.', 'Bước 2: Phương trình $(x+2)^2 + (y-4)^2 = 16$.'],
        finalAnswer: '$(x+2)^2 + (y-4)^2 = 16$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  },
  {
    id: 'math-cd-11-2',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Nâng cao',
    lessonNumber: 5,
    stageLabel: 'Chuyên đề GDPT 2018 · Lớp 11',
    sourceTag: 'Chuyên đề học tập Toán 11 KNTT · Chuyên đề 2',
    title: 'Chuyên đề 11.2: Một vài khái niệm về lí thuyết đồ thị',
    grade: 'Chuyên đề Toán 11 · Toán rời rạc',
    category: 'Đại số & Xác suất',
    difficulty: 'Vận dụng',
    readTimeMinutes: 18,
    description: 'Đồ thị vô hướng, bậc của đỉnh, đường đi Euler (bài toán 7 cây cầu Konigsberg), chu trình Hamilton và thuật toán tìm đường đi ngắn nhất.',
    mnemonics: ['Tổng bậc tất cả các đỉnh = $2 \\times$ số cạnh (luôn chẵn); đồ thị liên thông có chu trình Euler $\\iff$ mọi đỉnh đều có bậc CHẴN!'],
    commonTraps: ['Nhầm điều kiện có chu trình Euler (0 đỉnh bậc lẻ) với đường đi Euler (đúng 2 đỉnh bậc lẻ).'],
    theory: [
      '1. Định lí bắt tay: $\\sum_{v \\in V} \\deg(v) = 2|E| \\implies$ số đỉnh bậc lẻ luôn là số chẵn.',
      '2. Đồ thị Euler: liên thông và mọi đỉnh bậc chẵn; Nửa Euler: liên thông và có đúng 2 đỉnh bậc lẻ.'
    ],
    keyFormulas: ['\\sum_{v\\in V} \\deg(v) = 2|E|'],
    flashcards: [{ front: 'Đồ thị liên thông có 4 đỉnh bậc lẻ có đường đi Euler không?', back: 'Không! Chỉ có đường đi Euler khi có $0$ hoặc $2$ đỉnh bậc lẻ.' }],
    sampleProblems: [
      {
        source: 'Chuyên đề Toán 11 KNTT · CĐ 2',
        question: 'Một đồ thị vô hướng đơn có 6 đỉnh đều có bậc bằng 3. Số cạnh của đồ thị là:',
        options: ['A. $9$', 'B. $18$', 'C. $6$', 'D. $12$'],
        correctIndex: 0,
        explanation: '$2|E| = 6 \\cdot 3 = 18 \\implies |E| = 9$ cạnh.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề 11 · Đồ thị Euler',
        question: 'Một mạng đường phố gồm 5 ngã tư có bậc lần lượt là $2, 2, 3, 3, 4$. Có thể đi qua mỗi đoạn phố đúng 1 lần không?',
        hints: ['Đếm số đỉnh bậc lẻ.'],
        solutionSteps: ['Bước 1: Có đúng 2 đỉnh bậc lẻ ($3, 3$), đồ thị liên thông nên có đường đi Euler (xuất phát từ 1 đỉnh bậc 3, kết thúc ở đỉnh bậc 3 kia).'],
        finalAnswer: 'Có thể thực hiện được (đường đi Euler).'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'line_plane_oxyz'
  },
  {
    id: 'math-cd-11-3',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Cơ bản',
    lessonNumber: 6,
    stageLabel: 'Chuyên đề GDPT 2018 · Lớp 11',
    sourceTag: 'Chuyên đề học tập Toán 11 KNTT · Chuyên đề 3',
    title: 'Chuyên đề 11.3: Một số yếu tố vẽ kĩ thuật',
    grade: 'Chuyên đề Toán 11 · Hình học họa hình',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description: 'Hình chiếu vuông góc trên 3 mặt phẳng (đứng, bằng, cạnh), bản vẽ kĩ thuật khối đa diện / khối tròn xoay và hình biểu diễn trực quan không gian 3D.',
    mnemonics: ['3 hình chiếu: Đứng (nhìn từ trước), Bằng (nhìn từ trên xuống, đặt dưới hình đứng), Cạnh (nhìn từ trái sang, đặt bên phải hình đứng).'],
    commonTraps: ['Vẽ sai vị trí chuẩn (bằng đặt dưới đứng, cạnh đặt bên phải đứng) hoặc quên nét đứt cho cạnh khuất.'],
    theory: [
      '1. Nét liền đậm biểu diễn cạnh thấy; nét đứt biểu diễn cạnh khuất.',
      '2. Đọc kích thước dài – rộng – cao của vật thể từ bộ 3 hình chiếu.'
    ],
    keyFormulas: ['S_{\\text{hình chiếu}} = S \\cdot \\cos\\varphi'],
    flashcards: [{ front: 'Hình chiếu đứng, bằng, cạnh của hình cầu bán kính $R$ là hình gì?', back: 'Cả 3 hình chiếu đều là hình tròn bán kính $R$.' }],
    sampleProblems: [
      {
        source: 'Chuyên đề Toán 11 KNTT · CĐ 3',
        question: 'Hình trụ tròn xoay đặt thẳng đứng có hình chiếu đứng và hình chiếu bằng lần lượt là:',
        options: ['A. Hình chữ nhật và Hình tròn', 'B. Hình tròn và Hình chữ nhật', 'C. Hai hình tam giác', 'D. Hai hình tròn'],
        correctIndex: 0,
        explanation: 'Nhìn từ trước ra hình chữ nhật, nhìn từ trên xuống ra hình tròn.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề 11 · Đọc bản vẽ kĩ thuật',
        question: 'Một khối hộp chữ nhật dài $6$, rộng $4$, cao $3$ bị khoét rỗng một hình trụ bán kính $1$ xuyên suốt chiều cao. Tính thể tích phần còn lại.',
        hints: ['$V = V_{\\text{hộp}} - V_{\\text{trụ}}$.'],
        solutionSteps: ['Bước 1: $V_{\\text{hộp}} = 6\\cdot 4\\cdot 3 = 72$; $V_{\\text{trụ}} = \\pi\\cdot 1^2\\cdot 3 = 3\\pi$.', 'Bước 2: $V = 72 - 3\\pi$.'],
        finalAnswer: '$72 - 3\\pi$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  {
    id: 'math-cd-12-1',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Nâng cao',
    lessonNumber: 7,
    stageLabel: 'Chuyên đề GDPT 2018 · Lớp 12',
    sourceTag: 'Chuyên đề học tập Toán 12 KNTT · Chuyên đề 1',
    title: 'Chuyên đề 12.1: Biến ngẫu nhiên rời rạc & Các số đặc trưng',
    grade: 'Chuyên đề Toán 12 · Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Vận dụng',
    readTimeMinutes: 19,
    description: 'Bảng phân bố xác suất, kì vọng $E(X) = \\sum x_i p_i$, phương sai $V(X) = E(X^2) - [E(X)]^2$, phép thử Bernoulli và phân bố nhị thức $B(n; p)$.',
    mnemonics: ['Phân bố nhị thức $X \\sim B(n; p)$: $P(X=k) = C_n^k p^k (1-p)^{n-k}$, $E(X) = np$, $V(X) = np(1-p)$!'],
    commonTraps: ['Nhầm $V(X) = \\sum x_i^2 p_i$ mà quên trừ $[E(X)]^2$.'],
    theory: [
      '1. $\\sum_{i=1}^k p_i = 1$; Kì vọng $E(X) = \\sum x_i p_i$.',
      '2. Phương sai $V(X) = \\sum x_i^2 p_i - [E(X)]^2$; Độ lệch chuẩn $\\sigma(X) = \\sqrt{V(X)}$.'
    ],
    keyFormulas: ['E(X) = \\sum x_i p_i', 'V(X) = E(X^2) - [E(X)]^2', 'X\\sim B(n;p): E(X)=np,\\ V(X)=np(1-p)'],
    flashcards: [{ front: 'Tung đồng xu cân đối $10$ lần, gọi $X$ là số lần ra mặt sấp. Tính $E(X)$ và $V(X)$?', back: '$X\\sim B(10; 0{,}5) \\implies E(X) = 5, V(X) = 10\\cdot 0{,}5\\cdot 0{,}5 = 2{,}5$.' }],
    sampleProblems: [
      {
        source: 'Chuyên đề Toán 12 KNTT · CĐ 1',
        question: 'Cho biến ngẫu nhiên rời rạc $X$ nhận các giá trị $0, 1, 2$ với xác suất tương ứng $0{,}2; 0{,}5; 0{,}3$. Kì vọng $E(X)$ bằng:',
        options: ['A. $1{,}1$', 'B. $1{,}0$', 'C. $1{,}2$', 'D. $0{,}9$'],
        correctIndex: 0,
        explanation: '$E(X) = 0(0{,}2) + 1(0{,}5) + 2(0{,}3) = 1{,}1$.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề 12 · Phân bố nhị thức',
        question: 'Tỉ lệ hạt nảy mầm là $0{,}8$. Gieo độc lập $5$ hạt. Tính xác suất có đúng $4$ hạt nảy mầm.',
        hints: ['Áp dụng $P(X=4) = C_5^4 (0{,}8)^4 (0{,}2)^1$.'],
        solutionSteps: ['Bước 1: $P(X=4) = 5 \\cdot 0{,}4096 \\cdot 0{,}2 = 0{,}4096$.'],
        finalAnswer: '$0{,}4096$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '3.2 * e^(-0.5 * x * x)', params: { a: 3.2, b: 1, c: 0, d: 0 }, color: '#6366f1', name: 'Phân phối xác suất biến ngẫu nhiên' }
  },
  {
    id: 'math-cd-12-2',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Nâng cao',
    lessonNumber: 8,
    stageLabel: 'Chuyên đề GDPT 2018 · Lớp 12',
    sourceTag: 'Chuyên đề học tập Toán 12 KNTT · Chuyên đề 2',
    title: 'Chuyên đề 12.2: Ứng dụng toán học giải bài toán tối ưu (Quy hoạch tuyến tính)',
    grade: 'Chuyên đề Toán 12 · Tối ưu hóa',
    category: 'Đại số',
    difficulty: 'Vận dụng',
    readTimeMinutes: 19,
    description: 'Mô hình hóa bài toán sản xuất – vận tải về bài toán quy hoạch tuyến tính, xác định miền chấp nhận (đa giác lồi) và tìm GTLN/GTNN của hàm mục tiêu $F(x, y) = ax + by$.',
    mnemonics: ['Nếu miền chấp nhận là đa giác lồi khép kín, GTLN và GTNN của $F(x,y) = ax + by$ luôn đạt tại một trong các ĐỈNH của đa giác!'],
    commonTraps: ['Bỏ sót điều kiện nguyên không âm $x \\ge 0, y \\ge 0$ hoặc tìm sai giao điểm hai đường thẳng biên.'],
    theory: [
      '1. Lập các ràng buộc tuyến tính $\\sum a_{ij}x_j \\le b_i$.',
      '2. Tìm tất cả các đỉnh của miền nghiệm rồi thay vào hàm mục tiêu $F(x, y)$ để chọn $\\max / \\min$.'
    ],
    keyFormulas: ['\\max/\\min_{x,y\\in\\Omega} (ax+by) = \\max/\\min_{\\text{đỉnh } M_i} F(M_i)'],
    flashcards: [{ front: 'Tại sao đường mức $ax+by = k$ giúp tìm cực trị nhanh?', back: 'Dịch chuyển song song đường thẳng $ax+by=k$ qua miền đa giác, vị trí chạm đỉnh đầu/cuối là $\\min / \\max$.' }],
    sampleProblems: [
      {
        source: 'Chuyên đề Toán 12 KNTT · CĐ 2',
        question: 'Miền nghiệm của hệ $x\\ge 0, y\\ge 0, x+y \\le 4$ là tam giác có các đỉnh $(0;0), (4;0), (0;4)$. Giá trị lớn nhất của $F = 3x + 5y$ là:',
        options: ['A. $20$', 'B. $12$', 'C. $0$', 'D. $32$'],
        correctIndex: 0,
        explanation: '$F(0;0)=0, F(4;0)=12, F(0;4)=20 \\implies \\max F = 20$.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề 12 · Tối ưu kế hoạch sản xuất',
        question: 'Xưởng may tạo áo A ($x$ cái, lãi $30$k) và áo B ($y$ cái, lãi $40$k) biết $x+y \\le 10$, $2x+y \\le 16$, $x,y\\ge 0$. Tìm $F_{\\max}$.',
        hints: ['Các đỉnh là $(0;0), (8;0), (6;4), (0;10)$.'],
        solutionSteps: ['Bước 1: $F(8;0)=240$, $F(6;4)=340$, $F(0;10)=400$.', 'Bước 2: Lãi cao nhất $400$ nghìn khi $(x;y)=(0;10)$.'],
        finalAnswer: '$400$ nghìn đồng tại $(0; 10)$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'linear', params: { a: -0.75, b: 4, c: 0, d: 0 }, color: '#10b981', name: 'Đường đồng mức F(x, y) = max' }
  },
  {
    id: 'math-cd-12-3',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Cơ bản',
    lessonNumber: 9,
    stageLabel: 'Chuyên đề GDPT 2018 · Lớp 12',
    sourceTag: 'Chuyên đề học tập Toán 12 KNTT · Chuyên đề 3',
    title: 'Chuyên đề 12.3: Ứng dụng toán học trong tài chính (Lãi kép & Trả góp)',
    grade: 'Chuyên đề Toán 12 · Tài chính',
    category: 'Lượng giác & Mũ',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Tiền tệ theo thời gian, công thức lãi kép $A = P(1+r)^n$, gửi tiết kiệm định kì, vay trả góp đều hàng tháng, lạm phát và kế hoạch tài chính cá nhân.',
    mnemonics: ['Trả góp đều $m$ mỗi tháng từ khoản nợ $A_0$ lãi suất $r$: $m = A_0\\cdot\\frac{r(1+r)^n}{(1+r)^n - 1}$!'],
    commonTraps: ['Dùng lãi suất NĂM $r_{\\text{năm}}$ cho số kì THÁNG $n$ mà quên chia $12$.'],
    theory: [
      '1. Lãi kép 1 lần: $A_n = P(1+r)^n$.',
      '2. Gửi đều cuối mỗi kì số tiền $a$: $S_n = a\\frac{(1+r)^n - 1}{r}$.',
      '3. Vay $A_0$ trả góp cuối mỗi kì số tiền $m$: $m = \\frac{A_0 r (1+r)^n}{(1+r)^n - 1}$.'
    ],
    keyFormulas: ['A_n = P(1+r)^n', 'm = \\frac{A_0 r (1+r)^n}{(1+r)^n - 1}'],
    flashcards: [{ front: 'Gửi $10$ triệu lãi suất kép $8\\%$/năm, sau $3$ năm thu được bao nhiêu?', back: '$10(1{,}08)^3 = 12{,}597$ triệu đồng.' }],
    sampleProblems: [
      {
        source: 'Chuyên đề Toán 12 KNTT · CĐ 3',
        question: 'Gửi $200$ triệu đồng lãi kép $0{,}5\\%$/tháng. Sau $12$ tháng số tiền cả gốc và lãi xấp xỉ:',
        options: ['A. $212{,}34$ triệu', 'B. $212{,}00$ triệu', 'C. $224{,}00$ triệu', 'D. $206{,}00$ triệu'],
        correctIndex: 0,
        explanation: '$200 \\cdot (1{,}005)^{12} \\approx 212{,}34$ triệu.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề 12 · Trả góp',
        question: 'Vay $100$ triệu đồng lãi suất $1\\%$/tháng, trả góp đều trong $12$ tháng. Tính số tiền trả hàng tháng.',
        hints: ['Thay $A_0 = 100, r = 0{,}01, n = 12$ vào công thức trả góp.'],
        solutionSteps: ['Bước 1: $m = \\frac{100 \\cdot 0{,}01 \\cdot (1{,}01)^{12}}{(1{,}01)^{12} - 1} \\approx 8{,}885$ triệu đồng/tháng.'],
        finalAnswer: 'Khoảng $8{,}885$ triệu đồng/tháng.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'exponential', params: { a: 1, b: 0.15, c: 0, d: 0 }, color: '#f59e0b', name: 'Tăng trưởng lãi kép (1 + r)^t' }
  },
  // ==========================================================
  // CÁC CHUYÊN ĐỀ NÂNG CAO & BỒI DƯỠNG HSG (BẢO TỒN TỪ CT 2006 / ÔN THI)
  // ==========================================================
  {
    id: 'math-3',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Nâng cao',
    lessonNumber: 10,
    stageLabel: 'Chuyên đề Nâng cao & Bồi dưỡng HSG',
    sourceTag: 'Chuyên đề Nâng cao · Hàm bậc 4 trùng phương',
    title: 'Chuyên đề NC: Hàm bậc bốn trùng phương & Biện luận cực trị tham số',
    grade: 'Chuyên Toán · Giải tích',
    category: 'Giải tích',
    difficulty: 'Vận dụng',
    readTimeMinutes: 16,
    description: 'Khảo sát chuyên sâu $y = ax^4 + bx^2 + c$: điều kiện có 3 cực trị ($ab < 0$), diện tích và tính chất tam giác tạo bởi 3 điểm cực trị (vuông cân, đều, trọng tâm).',
    mnemonics: ['$ab < 0 \\implies$ có 3 cực trị (chữ W hoặc M); 3 cực trị tạo thành tam giác vuông cân $\\iff b^3 + 8a = 0$, tam giác đều $\\iff b^3 + 24a = 0$!'],
    commonTraps: ['Áp dụng công thức nhanh cực trị tam giác mà quên kiểm tra điều kiện $ab < 0$.'],
    theory: ['1. $y\' = 4ax^3 + 2bx = 2x(2ax^2+b)$.', '2. Tọa độ 3 cực trị: $A(0; c)$ và $B, C\\left(\\pm\\sqrt{-\\frac{b}{2a}}; c - \\frac{b^2}{4a}\\right)$.'],
    keyFormulas: ['ab < 0 \\implies 3 \\text{ cực trị}', 'b^3 + 8a = 0 \\text{ (vuông cân)}', 'b^3 + 24a = 0 \\text{ (đều)}'],
    flashcards: [{ front: 'Điều kiện để $y = x^4 - 2mx^2 + 1$ có 3 điểm cực trị là?', back: '$ab < 0 \\iff 1\\cdot(-2m) < 0 \\iff m > 0$.' }],
    sampleProblems: [
      {
        source: 'Chuyên đề Nâng cao · Trùng phương',
        question: 'Giá trị của $m$ để đồ thị $y = x^4 - 2mx^2 + 2$ có 3 cực trị tạo thành tam giác vuông cân là:',
        options: ['A. $m = 1$', 'B. $m = -1$', 'C. $m = 2$', 'D. $m = \\sqrt[3]{3}$'],
        correctIndex: 0,
        explanation: '$b = -2m, a = 1$. Tam giác vuông cân $\\iff (-2m)^3 + 8 = 0 \\iff m = 1$.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề NC · Cực trị trùng phương',
        question: 'Tìm $m$ để đồ thị $y = x^4 - 2(m+1)x^2 + m^2$ có 3 điểm cực trị tạo thành tam giác đều.',
        hints: ['Dùng $ab < 0$ và $b^3 + 24a = 0$.'],
        solutionSteps: ['Bước 1: $m > -1$; $(-2(m+1))^3 + 24 = 0 \\implies (m+1)^3 = 3 \\implies m = \\sqrt[3]{3} - 1$.'],
        finalAnswer: '$m = \\sqrt[3]{3} - 1$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'custom', customExpr: 'x^4 - 2*x^2', params: { a: 1, b: -2, c: 0, d: 0 }, color: '#4f46e5', name: 'y = x⁴ - 2x² (3 cực trị)' }
  },
  {
    id: 'math-9',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Chuyên / HSG',
    lessonNumber: 11,
    stageLabel: 'Chuyên đề Nâng cao & Bồi dưỡng HSG',
    sourceTag: 'Chuyên đề HSG · Số phức',
    title: 'Chuyên đề HSG: Số phức, Mô-đun & Quỹ tích mặt phẳng phức',
    grade: 'Chuyên Toán · Số phức',
    category: 'Số phức',
    difficulty: 'Vận dụng',
    readTimeMinutes: 18,
    description: 'Số phức $z = a + bi$ ($i^2 = -1$), số phức liên hợp $\\bar{z}$, mô-đun $|z| = \\sqrt{a^2+b^2}$, biểu diễn hình học (đường tròn, elip, đường thẳng) và cực trị mô-đun $|z_1 - z_2|$.',
    mnemonics: ['$|z - (a+bi)| = R$ là đường tròn tâm $I(a; b)$ bán kính $R$; $|z - z_1| + |z - z_2| = 2a$ là Elip!'],
    commonTraps: ['Nhầm $i^2 = 1$ (đúng là $i^2 = -1$) hoặc đọc sai tọa độ tâm của $|z - 2 + 3i| = R$ là $(2; -3)$.'],
    theory: ['1. $z\\cdot\\bar{z} = |z|^2 = a^2 + b^2$.', '2. Bất đẳng thức tam giác: $||z_1| - |z_2|| \\le |z_1 + z_2| \\le |z_1| + |z_2|$.'],
    keyFormulas: ['|z| = \\sqrt{a^2+b^2}', 'z\\cdot\\bar{z} = |z|^2', '|z - z_0| = R'],
    flashcards: [{ front: 'Tính mô-đun của $z = (1+2i)(3-i)$?', back: '$|z| = |1+2i|\\cdot|3-i| = \\sqrt{5}\\cdot\\sqrt{10} = 5\\sqrt{2}$.' }],
    sampleProblems: [
      {
        source: 'Chuyên đề HSG · Số phức',
        question: 'Phần thực và phần ảo của số phức $z = \\frac{1 + 3i}{1 - i}$ là:',
        options: ['A. $-1$ và $2$', 'B. $1$ và $2$', 'C. $-1$ và $-2$', 'D. $2$ và $-1$'],
        correctIndex: 0,
        explanation: '$z = \\frac{(1+3i)(1+i)}{2} = \\frac{-2+4i}{2} = -1 + 2i$.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề HSG · Cực trị mô-đun số phức',
        question: 'Cho $|z - 3 - 4i| = 2$. Tìm giá trị lớn nhất của $|z|$.',
        hints: ['$|z|_{\\max} = OI + R$.'],
        solutionSteps: ['Bước 1: Tâm $I(3; 4)$ có $OI = 5$, bán kính $R = 2$.', 'Bước 2: $|z|_{\\max} = OI + R = 5 + 2 = 7$.'],
        finalAnswer: '$\\max|z| = 7$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  },
  {
    id: 'math-11',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Nâng cao',
    lessonNumber: 12,
    stageLabel: 'Chuyên đề Nâng cao & Bồi dưỡng HSG',
    sourceTag: 'Chuyên đề Nâng cao · Cực trị hàm trị tuyệt đối',
    title: 'Chuyên đề NC: Cực trị hàm $|f(x)|$, $f(|x|)$ & Hàm hợp',
    grade: 'Chuyên Toán · Giải tích',
    category: 'Giải tích',
    difficulty: 'Vận dụng',
    readTimeMinutes: 17,
    description: 'Kỹ thuật đếm nhanh số điểm cực trị của $y = |f(x)|$ (tổng số cực trị của $f$ và số giao điểm cắt ngang trục $Ox$), hàm chẵn $y = f(|x|)$ ($2k+1$ cực trị) và ghép trục hàm hợp.',
    mnemonics: ['Số cực trị $|f(x)| = a + b$ ($a$: cực trị $f$; $b$: nghiệm bội lẻ của $f(x)=0$). Số cực trị $f(|x|) = 2k + 1$ ($k$: số cực trị dương của $f$)!'],
    commonTraps: ['Đếm cả nghiệm kép (tiếp xúc trục $Ox$) vào số cực trị mới của $|f(x)|$!'],
    theory: ['1. $y = |f(x)|$: giữ phần trên $Ox$, lật đối xứng phần dưới $Ox$ lên trên.', '2. $y = f(|x|)$: giữ phần $x \\ge 0$, lấy đối xứng qua $Oy$.'],
    keyFormulas: ['\\text{CT}(|f|) = a + b', '\\text{CT}(f(|x|)) = 2k + 1'],
    flashcards: [{ front: 'Hàm $f(x)$ có 2 cực trị dương $x=1, x=3$. Hàm $y = f(|x|)$ có mấy cực trị?', back: '$2 \\cdot 2 + 1 = 5$ điểm cực trị.' }],
    sampleProblems: [
      {
        source: 'Chuyên đề NC · Trị tuyệt đối',
        question: 'Hàm $f(x) = x^3 - 3x + 1$ có 2 cực trị và cắt $Ox$ tại 3 điểm phân biệt. Hàm $y = |f(x)|$ có bao nhiêu điểm cực trị?',
        options: ['A. $5$', 'B. $3$', 'C. $2$', 'D. $4$'],
        correctIndex: 0,
        explanation: 'Số cực trị = $2 + 3 = 5$.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề NC · Tham số hàm trị tuyệt đối',
        question: 'Tìm $m$ nguyên thuộc $[-5; 5]$ để $y = |x^3 - 3x + m|$ có đúng $5$ điểm cực trị.',
        hints: ['$y=f(x)+m$ cắt $Ox$ tại 3 điểm $\\iff y_{\\text{CĐ}}\\cdot y_{\\text{CT}} < 0$.'],
        solutionSteps: ['Bước 1: $f(x)=x^3-3x$ có CĐ $2$, CT $-2$.', 'Bước 2: $(2+m)(-2+m) < 0 \\iff -2 < m < 2 \\implies m \\in \\{-1; 0; 1\\}$.'],
        finalAnswer: 'Có $3$ giá trị nguyên: $m \\in \\{-1; 0; 1\\}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'custom', customExpr: 'abs(x^3 - 3*x + 1)', params: { a: 1, b: -3, c: 1, d: 0 }, color: '#ec4899', name: 'y = |x³ - 3x + 1| (5 cực trị)' }
  },
  {
    id: 'math-12-3',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Nâng cao',
    lessonNumber: 13,
    stageLabel: 'Chuyên đề Nâng cao & Bồi dưỡng HSG',
    sourceTag: 'Chuyên đề Nâng cao · Khối tròn xoay 3D',
    title: 'Chuyên đề NC: Mặt nón, Mặt trụ & Mặt cầu ngoại tiếp hình chóp 3D',
    grade: 'Chuyên Toán · Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 17,
    description: 'Chuyên sâu khối tròn xoay $S_{xq}, V_{\\text{nón}}, V_{\\text{trụ}}, V_{\\text{cầu}}$, thiết diện qua trục / song song trục và công thức bán kính mặt cầu ngoại tiếp hình chóp, lăng trụ.',
    mnemonics: ['Chóp có $SA \\perp$ đáy: $R_{mc} = \\sqrt{R_{\\text{đáy}}^2 + \\frac{SA^2}{4}}$; Chóp đều cạnh bên $b$ cao $h$: $R_{mc} = \\frac{b^2}{2h}$!'],
    commonTraps: ['Nhầm $S_{xq}$ nón ($\\pi rl$) với $S_{xq}$ trụ ($2\\pi rh$) hoặc quên chia $2$ đường cao $h$ trong công thức mặt cầu ngoại tiếp.'],
    theory: ['1. Nón: $l^2 = r^2 + h^2, V = \\frac{1}{3}\\pi r^2 h$.', '2. Mặt cầu ngoại tiếp lăng trụ đứng: $R = \\sqrt{R_{\\text{đáy}}^2 + (h/2)^2}$.'],
    keyFormulas: ['R_{mc} = \\sqrt{R_{\\text{đáy}}^2 + \\frac{h^2}{4}}', 'R_{\\text{chóp đều}} = \\frac{b^2}{2h}'],
    flashcards: [{ front: 'Hình chóp $S.ABC$ có $SA \\perp (ABC)$, $SA = 6$, đáy tam giác vuông cạnh huyền $BC = 8$. Tính $R_{mc}$?', back: '$R_{\\text{đáy}} = 4 \\implies R_{mc} = \\sqrt{4^2 + 3^2} = 5$.' }],
    sampleProblems: [
      {
        source: 'Chuyên đề NC · Mặt cầu ngoại tiếp',
        question: 'Hình lập phương cạnh $a$ có mặt cầu ngoại tiếp bán kính bằng:',
        options: ['A. $\\frac{a\\sqrt{3}}{2}$', 'B. $\\frac{a\\sqrt{2}}{2}$', 'C. $a\\sqrt{3}$', 'D. $\\frac{a}{2}$'],
        correctIndex: 0,
        explanation: 'Đường kính mặt cầu là đường chéo hình lập phương $a\\sqrt{3} \\implies R = \\frac{a\\sqrt{3}}{2}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề NC · Thiết diện trụ',
        question: 'Hình trụ bán kính $R = 5$, cao $h = 7$. Mặt phẳng song song trục cách trục $3$ cắt hình trụ theo thiết diện diện tích bao nhiêu?',
        hints: ['Nửa dây cung đáy $d_{\\text{nửa}} = \\sqrt{5^2 - 3^2} = 4$.'],
        solutionSteps: ['Bước 1: Thiết diện là hình chữ nhật rộng $2\\cdot 4 = 8$, cao $7$.', 'Bước 2: $S = 8 \\cdot 7 = 56$.'],
        finalAnswer: '$56$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'sphere_plane'
  },
  {
    id: 'math-12-6',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Nâng cao',
    lessonNumber: 14,
    stageLabel: 'Chuyên đề Nâng cao & Bồi dưỡng HSG',
    sourceTag: 'Chuyên đề Nâng cao · Mũ & Lôgarit VDC',
    title: 'Chuyên đề NC: Phương trình & BPT Mũ – Lôgarit chứa tham số (VDC)',
    grade: 'Chuyên Toán · Giải tích',
    category: 'Lượng giác & Mũ',
    difficulty: 'Vận dụng',
    readTimeMinutes: 18,
    description: 'Kỹ thuật hàm đặc trưng $f(u) = f(v)$, cô lập tham số $m$, đặt ẩn phụ $t = a^x > 0$ kèm điều kiện nghiệm nguyên cho bất phương trình mũ – lôgarit vận dụng cao.',
    mnemonics: ['Hàm đặc trưng: biến đổi 2 vế về dạng $f(u) = f(v)$ với $f\'(t) > 0$ (hoặc $<0$) $\\implies u = v$!'],
    commonTraps: ['Quên miền giá trị $t = a^x > 0$ khi quy về phương trình bậc hai có 2 nghiệm $t_1, t_2$ cùng dương.'],
    theory: ['1. $4^x - m\\cdot 2^x + n = 0$: đặt $t = 2^x > 0$, yêu cầu 2 nghiệm thực $\\iff t_1, t_2 > 0$.', '2. Đếm nghiệm nguyên BPT tích: lập bảng xét dấu hai thừa số trên miền xác định.'],
    keyFormulas: ['f(u) = f(v)\\ (f \\text{ đơn điệu}) \\iff u = v'],
    flashcards: [{ front: 'Điều kiện để $t^2 - mt + m - 1 = 0$ cho 2 nghiệm $x$ phân biệt với $t = 2^x$?', back: '$\\Delta > 0, S = m > 0, P = m - 1 > 0 \\implies m > 1$ và $m \\neq 2$.' }],
    sampleProblems: [
      {
        source: 'Chuyên đề NC · Hàm đặc trưng',
        question: 'Số nghiệm thực của phương trình $2^x + x = 2^{2-x} + 2 - x$ là:',
        options: ['A. $1$ (tại $x=1$)', 'B. $2$', 'C. $0$', 'D. $3$'],
        correctIndex: 0,
        explanation: 'Xét $f(t) = 2^t + t$ đồng biến $\\implies f(x) = f(2-x) \\iff x = 2 - x \\iff x = 1$.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên đề NC · BPT Mũ VDC',
        question: 'Có bao nhiêu số nguyên $x \\ge -2$ thỏa mãn $(2^x - 8)\\sqrt{5 - x} \\le 0$?',
        hints: ['ĐK $-2 \\le x \\le 5$; nếu $x=5$ thỏa mãn ngay, nếu $x < 5$ thì cần $2^x - 8 \\le 0$.'],
        solutionSteps: ['Bước 1: ĐK xác định $x \\le 5$, kết hợp giả thiết cho $-2 \\le x \\le 5$.', 'Bước 2: Với $x = 5$, bất phương trình thành $0 \\le 0$ (thỏa mãn). Với $-2 \\le x < 5$, $\\sqrt{5-x} > 0 \\implies 2^x \\le 8 \\iff x \\le 3$. Vậy nghiệm nguyên là $x \\in \\{-2; -1; 0; 1; 2; 3; 5\\}$.'],
        finalAnswer: 'Có $7$ số nguyên: $x \\in \\{-2; -1; 0; 1; 2; 3; 5\\}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'exponential', params: { a: 1, b: 0.693, c: 0, d: -8 }, color: '#ef4444', name: 'y = 2^x - 8' }
  }
];
