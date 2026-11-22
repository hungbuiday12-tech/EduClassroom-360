import { MathLecture } from '../types';

// Chương trình Toán 10 GDPT 2018 (Thông tư 32/2018/TT-BGDĐT · SGK Kết nối tri thức với cuộc sống)
// Đầy đủ 27 bài thuộc 9 chương (Chương I -> Chương IX)

export const MATH_GDPT_10_LESSONS: MathLecture[] = [
  // ==================== CHƯƠNG I. MỆNH ĐỀ VÀ TẬP HỢP ====================
  {
    id: 'math-10-b1',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 1,
    stageLabel: 'Chương I · Mệnh đề và Tập hợp',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 1',
    title: 'Bài 1: Mệnh đề',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Khái niệm mệnh đề toán học, mệnh đề chứa biến, mệnh đề phủ định, mệnh đề kéo theo $P \\Rightarrow Q$, mệnh đề đảo – tương đương $P \\Leftrightarrow Q$ và kí hiệu với mọi ($\\forall$), tồn tại ($\\exists$).',
    mnemonics: [
      'Phủ định của $\\forall x \\in X, P(x)$ là $\\exists x \\in X, \\overline{P(x)}$ (đổi $\\forall \\leftrightarrow \\exists$ và phủ định điều kiện).',
      'Mệnh đề kéo theo $P \\Rightarrow Q$ chỉ sai duy nhất khi $P$ đúng mà $Q$ sai.'
    ],
    commonTraps: [
      'Nhầm câu nghi vấn, câu cảm thán là mệnh đề (chỉ câu khẳng định đúng hoặc sai mới là mệnh đề).',
      'Quên đổi dấu $\\ge$ thành $<$ (hoặc $=$ thành $\\neq$) khi lấy phủ định.'
    ],
    theory: [
      '1. Mệnh đề và mệnh đề chứa biến: Mệnh đề là câu khẳng định có tính đúng hoặc sai (không thể vừa đúng vừa sai). Mệnh đề chứa biến $P(x)$ chỉ xác định đúng sai khi thay giá trị cụ thể của $x$.',
      '2. Phủ định, kéo theo, đảo và tương đương: Phủ định của $P$ là $\\overline{P}$. $P \\Rightarrow Q$ ("$P$ là điều kiện đủ để có $Q$", "$Q$ là điều kiện cần để có $P$"). Nếu $P \\Rightarrow Q$ và $Q \\Rightarrow P$ đều đúng thì $P \\Leftrightarrow Q$.'
    ],
    keyFormulas: [
      '\\overline{\\forall x \\in X,\\, P(x)} \\equiv \\exists x \\in X,\\, \\overline{P(x)}',
      '\\overline{\\exists x \\in X,\\, P(x)} \\equiv \\forall x \\in X,\\, \\overline{P(x)}',
      'P \\Leftrightarrow Q \\iff (P \\Rightarrow Q) \\text{ và } (Q \\Rightarrow P)'
    ],
    flashcards: [
      {
        front: 'Phủ định của mệnh đề "$\\forall x \\in \\mathbb{R}, x^2 + 1 > 0$" là gì?',
        back: '$\\exists x \\in \\mathbb{R}, x^2 + 1 \\le 0$.'
      }
    ],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 1',
        question: 'Phủ định của mệnh đề $P: "\\exists x \\in \\mathbb{R},\\, 2x^2 - 3x + 1 \\le 0"$ là:',
        options: [
          'A. $\\forall x \\in \\mathbb{R},\\, 2x^2 - 3x + 1 > 0$',
          'B. $\\exists x \\in \\mathbb{R},\\, 2x^2 - 3x + 1 > 0$',
          'C. $\\forall x \\in \\mathbb{R},\\, 2x^2 - 3x + 1 \\ge 0$',
          'D. $\\exists x \\in \\mathbb{R},\\, 2x^2 - 3x + 1 < 0$'
        ],
        correctIndex: 0,
        explanation: 'Phủ định của $\\exists$ là $\\forall$, phủ định của $\\le 0$ là $> 0$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Suy luận mệnh đề',
        question: 'Xét tính đúng sai và lập mệnh đề phủ định của $A: "\\forall n \\in \\mathbb{N},\\, n^2 + n$ chia hết cho $2"$.',
        hints: ['Phân tích $n^2 + n = n(n + 1)$ là tích hai số tự nhiên liên tiếp.'],
        solutionSteps: [
          'Bước 1: $n^2 + n = n(n + 1)$ luôn chia hết cho $2$ nên $A$ ĐÚNG.',
          'Bước 2: Phủ định $\\overline{A}: "\\exists n \\in \\mathbb{N},\\, n^2 + n$ không chia hết cho $2"$.'
        ],
        finalAnswer: '$A$ đúng; $\\overline{A}: \\exists n \\in \\mathbb{N},\\, n^2 + n \\not\\vdots 2$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: 2, b: -3, c: 1, d: 0 }, color: '#2563eb', name: 'y = 2x² - 3x + 1' }
  },
  {
    id: 'math-10-3',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 2,
    stageLabel: 'Chương I · Mệnh đề và Tập hợp',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 2',
    title: 'Bài 2: Tập hợp và các phép toán trên tập hợp',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      'Cách xác định tập hợp, tập con – hai tập hợp bằng nhau, các tập con của $\\mathbb{R}$ (khoảng, đoạn, nửa khoảng) và phép giao ($A \\cap B$), hợp ($A \\cup B$), hiệu ($A \\setminus B$), phần bù.',
    mnemonics: [
      'Giao ($\\cap$): phần chung; Hợp ($\\cup$): gom tất cả; Hiệu ($A \\setminus B$): thuộc $A$ bỏ $B$.',
      'Vẽ trục số trước khi lấy giao/hợp/hiệu các khoảng đoạn để không nhầm đầu mút.'
    ],
    commonTraps: [
      'Nhầm ngoặc tròn $($ (không lấy mút) và ngoặc vuông $[$ (lấy mút) khi lấy phần bù $C_{\\mathbb{R}} A$.'
    ],
    theory: [
      '1. Tập hợp và tập con: $A \\subset B \\iff \\forall x (x \\in A \\Rightarrow x \\in B)$. Tập rỗng $\\varnothing$ là con mọi tập hợp. Số tập con của tập có $n$ phần tử là $2^n$.',
      '2. Phép toán trên tập hợp: $A \\cap B$, $A \\cup B$, $A \\setminus B$ và phần bù $C_E A = E \\setminus A$ (khi $A \\subset E$).'
    ],
    keyFormulas: [
      'n(A \\cup B) = n(A) + n(B) - n(A \\cap B)',
      'A \\cap B = \\{x \\mid x \\in A \\text{ và } x \\in B\\}',
      'C_E A = E \\setminus A'
    ],
    flashcards: [
      {
        front: 'Phần bù của $[-2; 5)$ trong $\\mathbb{R}$?',
        back: '$(-\\infty; -2) \\cup [5; +\\infty)$.'
      }
    ],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 2',
        question: 'Cho $A = (-3; 4]$ và $B = [1; 7)$. Tập hợp $A \\cap B$ là:',
        options: ['A. $[1; 4]$', 'B. $(-3; 7)$', 'C. $(-3; 1)$', 'D. $(4; 7)$'],
        correctIndex: 0,
        explanation: 'Phần chung của $(-3; 4]$ và $[1; 7)$ là $[1; 4]$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Tham số tập hợp',
        question: 'Cho $A = [m - 1; m + 3]$ và $B = (-2; 5)$. Tìm $m$ để $A \\subset B$.',
        hints: ['$-2 < m - 1$ và $m + 3 < 5$.'],
        solutionSteps: [
          'Bước 1: $A \\subset (-2; 5) \\iff \\begin{cases} m - 1 > -2 \\\\ m + 3 < 5 \\end{cases} \\iff -1 < m < 2$.'
        ],
        finalAnswer: '$-1 < m < 2$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'linear', params: { a: 1, b: -1, c: 0, d: 0 }, color: '#0ea5e9', name: 'Biểu diễn tập hợp số' }
  },

  // ==================== CHƯƠNG II. BẤT PHƯƠNG TRÌNH & HỆ BPT BẬC NHẤT HAI ẨN ====================
  {
    id: 'math-10-b3',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 3,
    stageLabel: 'Chương II · BPT & Hệ BPT Bậc Nhất Hai Ẩn',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 3',
    title: 'Bài 3: Bất phương trình bậc nhất hai ẩn',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Nhận dạng bất phương trình bậc nhất hai ẩn $ax + by \\le c$ và biểu diễn miền nghiệm bằng nửa mặt phẳng bờ đường thẳng $ax + by = c$.',
    mnemonics: [
      '3 bước vẽ miền nghiệm: Vẽ bờ $ax+by=c$ -> Thử điểm $O(0;0)$ (nếu không thuộc bờ) -> Gạch bỏ phần không thỏa mãn.'
    ],
    commonTraps: ['Thử $O(0;0)$ khi đường bờ đi qua gốc tọa độ.'],
    theory: [
      '1. Định nghĩa: Bất phương trình dạng $ax + by \\le c$ (hoặc $<, >, \\ge$) với $a, b$ không đồng thời bằng $0$.',
      '2. Miền nghiệm: Đường thẳng $ax + by = c$ chia $Oxy$ thành hai nửa mặt phẳng, chọn nửa thỏa mãn bất phương trình.'
    ],
    keyFormulas: ['ax + by \\le c \\quad (a^2 + b^2 \\neq 0)'],
    flashcards: [{ front: 'Điểm $(1; 2)$ có thuộc miền nghiệm $2x - 3y + 5 > 0$?', back: '$2(1)-3(2)+5 = 1 > 0 \\implies$ Có.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 3',
        question: 'Cặp số $(x; y)$ nào là nghiệm của $3x - 2y \\ge 6$?',
        options: ['A. $(2; -1)$', 'B. $(0; 0)$', 'C. $(1; 1)$', 'D. $(-1; -2)$'],
        correctIndex: 0,
        explanation: '$3(2) - 2(-1) = 8 \\ge 6$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Bài toán thực tế',
        question: 'Áo giá 200 nghìn, quần giá 300 nghìn, chi tối đa 1,5 triệu. Lập bất phương trình biểu thị số áo $x$ và số quần $y$.',
        hints: ['$200x + 300y \\le 1500$.'],
        solutionSteps: ['Bước 1: $200x + 300y \\le 1500 \\iff 2x + 3y \\le 15$ ($x, y \\in \\mathbb{N}$).'],
        finalAnswer: '$2x + 3y \\le 15$ ($x, y \\in \\mathbb{N}$).'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz',
    defaultGraphConfig: { type: 'linear', params: { a: 1.5, b: -3, c: 0, d: 0 }, color: '#10b981', name: 'Đường bờ 3x - 2y = 6' }
  },
  {
    id: 'math-10-b4',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 4,
    stageLabel: 'Chương II · BPT & Hệ BPT Bậc Nhất Hai Ẩn',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 4',
    title: 'Bài 4: Hệ bất phương trình bậc nhất hai ẩn',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Tìm miền nghiệm đa giác lồi của hệ bất phương trình bậc nhất hai ẩn và giải bài toán tối ưu $F(x; y) = ax + by$ tại các đỉnh miền nghiệm.',
    mnemonics: ['GTLN/GTNN của $F(x; y) = ax + by$ trên đa giác lồi luôn đạt tại một trong các ĐỈNH của miền nghiệm.'],
    commonTraps: ['Quên điều kiện $x \\ge 0, y \\ge 0$ trong bài toán thực tế.'],
    theory: [
      '1. Miền nghiệm của hệ BPT là giao các miền nghiệm từng BPT thành phần (thường là miền đa giác lồi).',
      '2. Tối ưu hóa: Tính giá trị $F(x; y) = ax + by$ tại tất cả các đỉnh của miền đa giác rồi chọn min/max.'
    ],
    keyFormulas: ['F(x; y) = ax + by \\text{ đạt GTLN/GTNN tại đỉnh đa giác nghiệm}'],
    flashcards: [{ front: 'Cực trị hàm $F(x;y)=ax+by$ trên đa giác lồi đạt ở đâu?', back: 'Tại một trong các đỉnh của đa giác.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 4',
        question: 'Giá trị lớn nhất của $F(x; y) = 2x + 3y$ với $x \\ge 0, y \\ge 0, x + y \\le 4$ là:',
        options: ['A. $12$', 'B. $8$', 'C. $0$', 'D. $10$'],
        correctIndex: 0,
        explanation: 'Tại các đỉnh $(0;0), (4;0), (0;4)$ có $F$ lần lượt là $0, 8, 12$. Max là $12$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Tối ưu sản xuất',
        question: 'Tìm GTNN của $F(x; y) = x + 2y$ với $x \\ge 0, y \\ge 0, x + y \\ge 2, 2x + y \\le 6$.',
        hints: ['Tính $F$ tại các đỉnh $(2;0), (3;0), (0;6), (0;2)$.'],
        solutionSteps: ['Bước 1: $F(2;0)=2, F(3;0)=3, F(0;6)=12, F(0;2)=4$.'],
        finalAnswer: '$\\min F = 2$ tại $(2; 0)$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz',
    defaultGraphConfig: { type: 'linear', params: { a: -1, b: 4, c: 0, d: 0 }, color: '#2563eb', name: 'Bờ x + y = 4' }
  },

  // ==================== CHƯƠNG III. HỆ THỨC LƯỢNG TRONG TAM GIÁC ====================
  {
    id: 'math-10-b5',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 5,
    stageLabel: 'Chương III · Hệ Thức Lượng Trong Tam Giác',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 5',
    title: 'Bài 5: Giá trị lượng giác của một góc từ 0° đến 180°',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Mở rộng định nghĩa $\\sin\\alpha, \\cos\\alpha, \\tan\\alpha, \\cot\\alpha$ trên nửa đường tròn đơn vị cho góc $\\alpha \\in [0^\\circ; 180^\\circ]$ và tính chất hai góc bù nhau.',
    mnemonics: ['Hai góc bù nhau: $\\sin$ giữ nguyên dương, $\\cos, \\tan, \\cot$ đổi dấu.'],
    commonTraps: ['Quên $\\cos\\alpha < 0$ khi góc $\\alpha$ là góc tù ($90^\\circ < \\alpha < 180^\\circ$).'],
    theory: [
      '1. Trên nửa đường tròn đơn vị, điểm $M(x_0; y_0)$ ứng với góc $\\alpha$ cho $\\sin\\alpha = y_0 \\ge 0, \\cos\\alpha = x_0$.',
      '2. Quan hệ bù nhau: $\\sin(180^\\circ - \\alpha) = \\sin\\alpha$, $\\cos(180^\\circ - \\alpha) = -\\cos\\alpha$.'
    ],
    keyFormulas: [
      '\\sin^2\\alpha + \\cos^2\\alpha = 1',
      '\\sin(180^\\circ - \\alpha) = \\sin\\alpha,\\quad \\cos(180^\\circ - \\alpha) = -\\cos\\alpha'
    ],
    flashcards: [{ front: 'Tính $\\cos 120^\\circ$ và $\\sin 150^\\circ$?', back: '$\\cos 120^\\circ = -\\frac{1}{2};\\, \\sin 150^\\circ = \\frac{1}{2}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 5',
        question: 'Cho góc tù $\\alpha$ có $\\sin\\alpha = \\frac{3}{5}$. Giá trị $\\cos\\alpha$ là:',
        options: ['A. $-\\frac{4}{5}$', 'B. $\\frac{4}{5}$', 'C. $-\\frac{3}{4}$', 'D. $\\frac{2}{5}$'],
        correctIndex: 0,
        explanation: '$\\cos^2\\alpha = \\frac{16}{25}$ và góc tù nên $\\cos\\alpha = -\\frac{4}{5}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Giá trị lượng giác',
        question: 'Cho $\\tan\\alpha = -2$. Tính $P = \\frac{2\\sin\\alpha + 3\\cos\\alpha}{\\sin\\alpha - 2\\cos\\alpha}$.',
        hints: ['Chia tử và mẫu cho $\\cos\\alpha \\neq 0$.'],
        solutionSteps: ['Bước 1: $P = \\frac{2\\tan\\alpha + 3}{\\tan\\alpha - 2} = \\frac{-4 + 3}{-2 - 2} = \\frac{1}{4}$.'],
        finalAnswer: '$P = \\frac{1}{4}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  },
  {
    id: 'math-10',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 6,
    stageLabel: 'Chương III · Hệ Thức Lượng Trong Tam Giác',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 6',
    title: 'Bài 6: Hệ thức lượng trong tam giác (Định lí Cosin, Sin & Diện tích)',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Định lí Côsin tính cạnh và góc tam giác bất kỳ, Định lí Sin liên hệ bán kính ngoại tiếp $R$ và các công thức tính diện tích tam giác ($\\frac{1}{2}ab\\sin C$, Heron, $pr$, $\\frac{abc}{4R}$).',
    mnemonics: ['Định lí Côsin: $a^2 = b^2 + c^2 - 2bc\\cos A$. Định lí Sin: $\\frac{a}{\\sin A} = 2R$.'],
    commonTraps: ['Nhầm $2R$ thành $R$ trong $\\frac{a}{\\sin A} = 2R$.'],
    theory: [
      '1. Định lí Côsin: $a^2 = b^2 + c^2 - 2bc\\cos A$. Định lí Sin: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$.',
      '2. Diện tích: $S = \\frac{1}{2}ab\\sin C = \\frac{abc}{4R} = pr = \\sqrt{p(p-a)(p-b)(p-c)}$.'
    ],
    keyFormulas: [
      'a^2 = b^2 + c^2 - 2bc\\cos A',
      '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R',
      'S = \\sqrt{p(p-a)(p-b)(p-c)} = \\frac{1}{2}ab\\sin C = pr'
    ],
    flashcards: [{ front: 'Tam giác cạnh $5, 6, 7$ có diện tích bao nhiêu?', back: '$p = 9 \\implies S = \\sqrt{9\\cdot 4\\cdot 3\\cdot 2} = 6\\sqrt{6}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 6',
        question: 'Tam giác $ABC$ có $b = 8, c = 5, \\widehat{A} = 60^\\circ$. Cạnh $a$ bằng:',
        options: ['A. $7$', 'B. $49$', 'C. $\\sqrt{129}$', 'D. $6$'],
        correctIndex: 0,
        explanation: '$a^2 = 64 + 25 - 40 = 49 \\implies a = 7$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Giải tam giác',
        question: 'Tam giác $ABC$ có $a = 13, b = 14, c = 15$. Tính $S, R, r$.',
        hints: ['Dùng Heron với $p = 21$.'],
        solutionSteps: ['Bước 1: $S = \\sqrt{21\\cdot 8\\cdot 7\\cdot 6} = 84$. $r = \\frac{84}{21} = 4$; $R = \\frac{13\\cdot 14\\cdot 15}{4\\cdot 84} = 8{,}125$.'],
        finalAnswer: '$S = 84$, $r = 4$, $R = 8{,}125$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },

  // ==================== CHƯƠNG IV. VECTƠ ====================
  {
    id: 'math-10-b7',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 7,
    stageLabel: 'Chương IV · Vectơ',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 7',
    title: 'Bài 7: Các khái niệm mở đầu về Vectơ',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Định nghĩa vectơ có hướng, giá và độ dài; hai vectơ cùng phương, cùng hướng, bằng nhau và vectơ-không $\\vec{0}$.',
    mnemonics: ['Hai vectơ bằng nhau $\\iff$ CÙNG HƯỚNG và CÙNG ĐỘ DÀI.'],
    commonTraps: ['Nhầm cùng phương (song song hoặc trùng giá) với cùng hướng.'],
    theory: [
      '1. Vectơ là đoạn thẳng có hướng. $\\vec{AB} = \\vec{DC} \\iff ABCD$ là hình bình hành (khi không thẳng hàng).',
      '2. Vectơ-không $\\vec{0}$ có điểm đầu trùng điểm cuối, cùng phương và cùng hướng với mọi vectơ.'
    ],
    keyFormulas: ['\\vec{a} = \\vec{b} \\iff \\text{cùng hướng và } |\\vec{a}| = |\\vec{b}|'],
    flashcards: [{ front: 'Hình bình hành $ABCD$ có $\\vec{AB}$ bằng vectơ nào?', back: '$\\vec{DC}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 7',
        question: 'Cho hình bình hành $ABCD$. Vectơ bằng $\\vec{AB}$ là:',
        options: ['A. $\\vec{DC}$', 'B. $\\vec{CD}$', 'C. $\\vec{DA}$', 'D. $\\vec{BC}$'],
        correctIndex: 0,
        explanation: 'Cùng hướng và cùng độ dài với $\\vec{AB}$ là $\\vec{DC}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Đếm vectơ',
        question: 'Từ $5$ điểm phân biệt lập được bao nhiêu vectơ khác $\\vec{0}$?',
        hints: ['$5 \\times 4$.'],
        solutionSteps: ['Bước 1: $5 \\times 4 = 20$ vectơ.'],
        finalAnswer: '$20$ vectơ.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  {
    id: 'math-10-b8',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 8,
    stageLabel: 'Chương IV · Vectơ',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 8',
    title: 'Bài 8: Tổng và hiệu của hai vectơ',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description:
      'Quy tắc ba điểm cộng nối đuôi, quy tắc hình bình hành, quy tắc hiệu $\\vec{OB} - \\vec{OA} = \\vec{AB}$ và tính chất vectơ đối.',
    mnemonics: ['Cộng nối đuôi: $\\vec{AB}+\\vec{BC}=\\vec{AC}$. Hiệu chung gốc: $\\vec{AB}-\\vec{AC}=\\vec{CB}$.'],
    commonTraps: ['Nhầm $\\vec{AB} - \\vec{AC}$ thành $\\vec{BC}$.'],
    theory: [
      '1. Quy tắc ba điểm & Hình bình hành: $\\vec{AB} + \\vec{BC} = \\vec{AC}$; $\\vec{AB} + \\vec{AD} = \\vec{AC}$.',
      '2. Hiệu hai vectơ: $\\vec{OB} - \\vec{OA} = \\vec{AB}$; $\\vec{AB} + \\vec{BA} = \\vec{0}$.'
    ],
    keyFormulas: ['\\vec{AB} + \\vec{BC} = \\vec{AC}', '\\vec{OB} - \\vec{OA} = \\vec{AB}'],
    flashcards: [{ front: 'Hình vuông $ABCD$ cạnh $a$ có $|\\vec{AB}+\\vec{AD}|$ bằng?', back: '$a\\sqrt{2}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 8',
        question: 'Tổng $\\vec{MN} + \\vec{PQ} + \\vec{NP} + \\vec{QM}$ bằng:',
        options: ['A. $\\vec{0}$', 'B. $\\vec{MP}$', 'C. $\\vec{NQ}$', 'D. $2\\vec{MN}$'],
        correctIndex: 0,
        explanation: 'Ghép nối đuôi $\\vec{MN}+\\vec{NP}+\\vec{PQ}+\\vec{QM} = \\vec{0}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Hợp lực vuông góc',
        question: 'Hai lực vuông góc độ lớn $30\\text{ N}$ và $40\\text{ N}$. Tính $|\\vec{F}_1 + \\vec{F}_2|$.',
        hints: ['Định lí Pythagore.'],
        solutionSteps: ['Bước 1: $F = \\sqrt{30^2 + 40^2} = 50\\text{ N}$.'],
        finalAnswer: '$50\\text{ N}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  {
    id: 'math-10-4',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 9,
    stageLabel: 'Chương IV · Vectơ',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 9',
    title: 'Bài 9: Tích của một vectơ với một số',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description:
      'Định nghĩa $k\\vec{a}$, hệ thức trung điểm $\\vec{MA} + \\vec{MB} = 2\\vec{MI}$, hệ thức trọng tâm $\\vec{MA} + \\vec{MB} + \\vec{MC} = 3\\vec{MG}$ và điều kiện 3 điểm thẳng hàng.',
    mnemonics: ['Trung điểm $I$: $\\vec{MA}+\\vec{MB}=2\\vec{MI}$. Trọng tâm $G$: $\\vec{MA}+\\vec{MB}+\\vec{MC}=3\\vec{MG}$.'],
    commonTraps: ['Quên trị tuyệt đối $|k|$ trong $|k\\vec{a}| = |k|\\cdot|\\vec{a}|$.'],
    theory: [
      '1. Tích $k\\vec{a}$ cùng hướng $\\vec{a}$ khi $k > 0$, ngược hướng khi $k < 0$.',
      '2. Ba điểm $A, B, C$ thẳng hàng $\\iff \\exists k \\neq 0: \\vec{AB} = k\\vec{AC}$.'
    ],
    keyFormulas: [
      '\\vec{MA} + \\vec{MB} = 2\\vec{MI}',
      '\\vec{MA} + \\vec{MB} + \\vec{MC} = 3\\vec{MG}',
      'A, B, C \\text{ thẳng hàng} \\iff \\vec{AB} = k\\vec{AC}'
    ],
    flashcards: [{ front: 'Biểu diễn $\\vec{AG}$ ($G$ là trọng tâm $\\triangle ABC$) theo $\\vec{AB}, \\vec{AC}$?', back: '$\\frac{1}{3}(\\vec{AB} + \\vec{AC})$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 9',
        question: 'Tam giác $ABC$ có trọng tâm $G$, trung điểm $BC$ là $I$. Khẳng định đúng là:',
        options: ['A. $\\vec{GA} = -2\\vec{GI}$', 'B. $\\vec{GA} = 2\\vec{GI}$', 'C. $\\vec{GB} + \\vec{GC} = \\vec{GA}$', 'D. $\\vec{AB} + \\vec{AC} = 3\\vec{AG}$'],
        correctIndex: 0,
        explanation: '$GA = 2GI$ và $\\vec{GA}$ ngược hướng $\\vec{GI}$ nên $\\vec{GA} = -2\\vec{GI}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Trung điểm & Trọng tâm',
        question: 'Cho tứ giác $ABCD$, $M, N$ là trung điểm $AB, CD$. Chứng minh $\\vec{AD} + \\vec{BC} = 2\\vec{MN}$.',
        hints: ['Xen điểm $M, N$ vào $\\vec{AD}$ và $\\vec{BC}$ rồi cộng lại.'],
        solutionSteps: ['Bước 1: $\\vec{AD} = \\vec{AM} + \\vec{MN} + \\vec{ND}$; $\\vec{BC} = \\vec{BM} + \\vec{MN} + \\vec{NC}$.', 'Bước 2: Cộng vế theo vế, do $\\vec{AM}+\\vec{BM}=\\vec{0}$ và $\\vec{ND}+\\vec{NC}=\\vec{0}$ nên $\\vec{AD}+\\vec{BC}=2\\vec{MN}$.'],
        finalAnswer: 'Đã chứng minh $\\vec{AD} + \\vec{BC} = 2\\vec{MN}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  {
    id: 'math-10-b10',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 10,
    stageLabel: 'Chương IV · Vectơ',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 10',
    title: 'Bài 10: Vectơ trong mặt phẳng tọa độ',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description:
      'Tọa độ vectơ $\\vec{u} = (x; y)$, tọa độ $\\vec{AB} = (x_B - x_A; y_B - y_A)$, điều kiện hai vectơ cùng phương, tọa độ trung điểm và trọng tâm tam giác.',
    mnemonics: ['$\\%\\vec{AB} = B - A$; cùng phương $\\iff x_1y_2 - x_2y_1 = 0$.'],
    commonTraps: ['Trừ ngược tọa độ đầu trừ cuối khi tính $\\vec{AB}$.'],
    theory: [
      '1. $\\vec{AB} = (x_B - x_A; y_B - y_A)$.',
      '2. Trung điểm $I\\left(\\frac{x_A+x_B}{2}; \\frac{y_A+y_B}{2}\\right)$, trọng tâm $G\\left(\\frac{x_A+x_B+x_C}{3}; \\frac{y_A+y_B+y_C}{3}\\right)$.'
    ],
    keyFormulas: [
      '\\vec{AB} = (x_B - x_A;\\, y_B - y_A)',
      'x_1y_2 - x_2y_1 = 0 \\iff \\vec{u}, \\vec{v} \\text{ cùng phương}'
    ],
    flashcards: [{ front: '$A(1;4), B(-3;2) \\implies \\vec{AB}$ và trung điểm $I$?', back: '$\\vec{AB}=(-4;-2)$, $I(-1;3)$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 10',
        question: 'Cho $\\vec{a} = (2; -3), \\vec{b} = (-1; 4)$. Tọa độ $2\\vec{a} - \\vec{b}$ là:',
        options: ['A. $(5; -10)$', 'B. $(3; -2)$', 'C. $(5; -2)$', 'D. $(3; -10)$'],
        correctIndex: 0,
        explanation: '$(4 - (-1); -6 - 4) = (5; -10)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Hình bình hành',
        question: 'Cho $A(1; 2), B(3; -1), C(4; 5)$. Tìm $D$ để $ABCD$ là hình bình hành.',
        hints: ['$\\vec{AB} = \\vec{DC}$.'],
        solutionSteps: ['Bước 1: $(2; -3) = (4 - x_D; 5 - y_D) \\implies D(2; 8)$.'],
        finalAnswer: '$D(2; 8)$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  {
    id: 'math-10-2',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 11,
    stageLabel: 'Chương IV · Vectơ',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 11',
    title: 'Bài 11: Tích vô hướng của hai vectơ',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Định nghĩa tích vô hướng $\\vec{a}\\cdot\\vec{b} = |\\vec{a}||\\vec{b}|\\cos(\\vec{a},\\vec{b})$, biểu thức tọa độ $x_1x_2 + y_1y_2$, góc và điều kiện vuông góc.',
    mnemonics: ['Vuông góc $\\iff x_1x_2 + y_1y_2 = 0$.'],
    commonTraps: ['Nhầm góc $(\\vec{AB}, \\vec{BC})$ là $\\widehat{B}$ thay vì $180^\\circ - \\widehat{B}$.'],
    theory: [
      '1. $\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos(\\vec{a}, \\vec{b}) = x_1x_2 + y_1y_2$.',
      '2. $\\vec{a} \\perp \\vec{b} \\iff \\vec{a} \\cdot \\vec{b} = 0$.'
    ],
    keyFormulas: [
      '\\vec{a} \\cdot \\vec{b} = x_1x_2 + y_1y_2',
      '\\cos(\\vec{a}, \\vec{b}) = \\frac{x_1x_2 + y_1y_2}{\\sqrt{x_1^2+y_1^2}\\sqrt{x_2^2+y_2^2}}'
    ],
    flashcards: [{ front: 'Tam giác đều $ABC$ cạnh $a$ có $\\vec{AB} \\cdot \\vec{BC}$ bằng?', back: '$-\\frac{a^2}{2}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 11',
        question: 'Cho $\\vec{u} = (3; -2), \\vec{v} = (4; m)$. Tìm $m$ để $\\vec{u} \\perp \\vec{v}$:',
        options: ['A. $6$', 'B. $-6$', 'C. $\\frac{8}{3}$', 'D. $-\\frac{8}{3}$'],
        correctIndex: 0,
        explanation: '$3\\cdot 4 - 2m = 0 \\implies m = 6$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Vuông góc',
        question: 'Cho $A(1; 1), B(4; 1), C(1; 5)$. Chứng minh $\\triangle ABC$ vuông tại $A$.',
        hints: ['Tính $\\vec{AB}\\cdot\\vec{AC}$.'],
        solutionSteps: ['Bước 1: $\\vec{AB}=(3;0), \\vec{AC}=(0;4) \\implies \\vec{AB}\\cdot\\vec{AC} = 0$.'],
        finalAnswer: '$\\triangle ABC$ vuông tại $A$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },

  // ==================== CHƯƠNG V. THỐNG KÊ MẪU SỐ LIỆU KHÔNG GHÉP NHÓM ====================
  {
    id: 'math-10-b12',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 12,
    stageLabel: 'Chương V · Thống Kê Mẫu Số Liệu Không Ghép Nhóm',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 12',
    title: 'Bài 12: Số gần đúng và sai số',
    grade: 'Lớp 10 · Thống kê & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Số gần đúng, sai số tuyệt đối $\\Delta_a$, sai số tương đối $\\delta_a = \\frac{\\Delta_a}{|a|}$ và quy tắc quy tròn số theo độ chính xác $d$.',
    mnemonics: ['Hàng cao nhất của $d$ ở hàng nào thì quy tròn số $a$ đến hàng CAO HƠN 1 BẬC bên trái hàng đó.'],
    commonTraps: ['Quy tròn cùng hàng với $d$.'],
    theory: [
      '1. $\\Delta_a = |\\overline{a} - a| \\le d$, sai số tương đối $\\delta_a \\le \\frac{d}{|a|}$.',
      '2. Quy tròn: Tìm hàng của chữ số khác $0$ đầu tiên bên trái của $d$, rồi làm tròn $a$ đến hàng liền trước nó.'
    ],
    keyFormulas: ['\\Delta_a = |\\overline{a} - a| \\le d', '\\delta_a = \\frac{\\Delta_a}{|a|} \\le \\frac{d}{|a|}'],
    flashcards: [{ front: 'Quy tròn $3{,}14159 \\pm 0{,}002$?', back: '$3{,}14$ (vì $d$ ở hàng phần nghìn nên quy tròn đến hàng phần trăm).' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 12',
        question: 'Số quy tròn của $1745{,}25$ với độ chính xác $d = 0{,}04$ là:',
        options: ['A. $1745{,}3$', 'B. $1745{,}2$', 'C. $1745$', 'D. $1750$'],
        correctIndex: 0,
        explanation: '$d$ ở hàng phần trăm nên quy tròn đến hàng phần chục: $1745{,}3$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Sai số tương đối',
        question: 'Ước lượng sai số tương đối của $L = 250\\text{ m} \\pm 0{,}5\\text{ m}$.',
        hints: ['$\\delta_L \\le d / |a|$.'],
        solutionSteps: ['Bước 1: $\\delta_L \\le \\frac{0{,}5}{250} = 0{,}2\\%$.'],
        finalAnswer: '$\\delta_L \\le 0{,}2\\%$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '3 * e^(-0.5 * x * x)', params: { a: 3, b: 1, c: 0, d: 0 }, color: '#6366f1', name: 'Phân phối sai số đo đạc' }
  },
  {
    id: 'math-10-b13',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 13,
    stageLabel: 'Chương V · Thống Kê Mẫu Số Liệu Không Ghép Nhóm',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 13',
    title: 'Bài 13: Các số đặc trưng đo xu thế trung tâm',
    grade: 'Lớp 10 · Thống kê & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      'Số trung bình cộng $\\overline{x}$, Trung vị $M_e$, Tứ phân vị $Q_1, Q_2, Q_3$ và Mốt $M_o$ của mẫu số liệu không ghép nhóm.',
    mnemonics: ['Luôn SẮP XẾP TĂNG DẦN trước khi tìm $M_e$ và $Q_1, Q_2, Q_3$.'],
    commonTraps: ['Quên sắp xếp dãy số trước khi xác định tứ phân vị.'],
    theory: [
      '1. $\\overline{x} = \\frac{1}{n}\\sum x_i$; $M_e$ là giá trị ở giữa (nếu $n$ chẵn lấy TBC hai số giữa).',
      '2. Tứ phân vị chia mẫu thành 4 phần bằng nhau: $Q_2 = M_e$, $Q_1$ là trung vị nửa trái, $Q_3$ là trung vị nửa phải.'
    ],
    keyFormulas: ['\\overline{x} = \\frac{1}{n}\\sum_{i=1}^n x_i', 'Q_2 = M_e'],
    flashcards: [{ front: 'Mẫu $2, 3, 5, 6, 8, 9, 12$ có $Q_1, Q_2, Q_3$ là?', back: '$Q_1=3, Q_2=6, Q_3=9$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 13',
        question: 'Trung vị của mẫu $4; 8; 2; 6; 10; 12$ là:',
        options: ['A. $7$', 'B. $6$', 'C. $8$', 'D. $4$'],
        correctIndex: 0,
        explanation: 'Sắp xếp $2, 4, 6, 8, 10, 12 \\implies M_e = \\frac{6+8}{2} = 7$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Tứ phân vị',
        question: 'Tìm $Q_1, Q_2, Q_3$ của mẫu điểm: $5, 7, 8, 6, 9, 7, 10, 8$.',
        hints: ['Sắp xếp $5, 6, 7, 7, 8, 8, 9, 10$.'],
        solutionSteps: ['Bước 1: $Q_2 = \\frac{7+8}{2} = 7{,}5$; $Q_1 = \\frac{6+7}{2} = 6{,}5$; $Q_3 = \\frac{8+9}{2} = 8{,}5$.'],
        finalAnswer: '$Q_1 = 6{,}5;\\, Q_2 = 7{,}5;\\, Q_3 = 8{,}5$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '3 * e^(-0.5 * x * x)', params: { a: 3, b: 1, c: 0, d: 0 }, color: '#4f46e5', name: 'Xu thế trung tâm phân phối chuẩn' }
  },
  {
    id: 'math-10-b14',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 14,
    stageLabel: 'Chương V · Thống Kê Mẫu Số Liệu Không Ghép Nhóm',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 14',
    title: 'Bài 14: Các số đặc trưng đo độ phân tán',
    grade: 'Lớp 10 · Thống kê & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description:
      'Khoảng biến thiên $R$, khoảng tứ phân vị $\\Delta_Q = Q_3 - Q_1$, phương sai $s^2$, độ lệch chuẩn $s$ và phát hiện giá trị ngoại lệ.',
    mnemonics: ['Ngoại lệ khi nằm ngoài $[Q_1 - 1{,}5\\Delta_Q;\\, Q_3 + 1{,}5\\Delta_Q]$.'],
    commonTraps: ['Quên căn bậc hai khi tính độ lệch chuẩn $s = \\sqrt{s^2}$.'],
    theory: [
      '1. $R = x_{\\max} - x_{\\min}$; $\\Delta_Q = Q_3 - Q_1$.',
      '2. $s^2 = \\frac{1}{n}\\sum (x_i - \\overline{x})^2$; $s = \\sqrt{s^2}$.'
    ],
    keyFormulas: ['R = x_{\\max} - x_{\\min},\\quad \\Delta_Q = Q_3 - Q_1', 's^2 = \\frac{1}{n}\\sum_{i=1}^n (x_i - \\overline{x})^2,\\quad s = \\sqrt{s^2}'],
    flashcards: [{ front: '$Q_1=10, Q_3=18 \\implies$ ngưỡng ngoại lệ trên?', back: '$18 + 1{,}5(8) = 30$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 14',
        question: 'Phương sai của mẫu $\{2; 4; 6; 8\}$ là:',
        options: ['A. $5$', 'B. $\\sqrt{5}$', 'C. $20$', 'D. $4$'],
        correctIndex: 0,
        explanation: '$\\overline{x} = 5 \\implies s^2 = \\frac{9+1+1+9}{4} = 5$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Độ phân tán',
        question: 'Tính phương sai và độ lệch chuẩn của dãy $6, 7, 7, 8, 7$.',
        hints: ['$\\overline{x} = 7$.'],
        solutionSteps: ['Bước 1: $s^2 = \\frac{1+0+0+1+0}{5} = 0{,}4 \\implies s = \\sqrt{0{,}4} \\approx 0{,}63$.'],
        finalAnswer: '$s^2 = 0{,}4;\\, s \\approx 0{,}63$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '3 * e^(-0.25 * x * x)', params: { a: 3, b: 1, c: 0, d: 0 }, color: '#0ea5e9', name: 'Độ phân tán & độ lệch chuẩn σ' }
  },

  // ==================== CHƯƠNG VI. HÀM SỐ, ĐỒ THỊ VÀ ỨNG DỤNG ====================
  {
    id: 'math-10-b15',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 15,
    stageLabel: 'Chương VI · Hàm Số, Đồ Thị & Ứng Dụng',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 15',
    title: 'Bài 15: Hàm số',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Khái niệm hàm số $y = f(x)$, tập xác định, tập giá trị, đồ thị hàm số và sự đồng biến – nghịch biến trên khoảng $(a; b)$.',
    mnemonics: ['Đồ thị đồng biến đi LÊN từ trái sang phải; nghịch biến đi XUỐNG.'],
    commonTraps: ['Quên giao các điều kiện khi hàm vừa có mẫu thức vừa có căn thức.'],
    theory: [
      '1. Tập xác định $D$: Tập giá trị $x$ làm $f(x)$ có nghĩa (mẫu $\\neq 0$, trong căn $\\ge 0$).',
      '2. Đồng biến trên $K$: $\\forall x_1 < x_2 \\in K \\Rightarrow f(x_1) < f(x_2)$. Nghịch biến: $f(x_1) > f(x_2)$.'
    ],
    keyFormulas: ['\\frac{1}{A(x)}: A(x)\\neq 0;\\quad \\sqrt{B(x)}: B(x)\\ge 0'],
    flashcards: [{ front: 'TXĐ của $y = \\frac{\\sqrt{x-1}}{x-3}$?', back: '$D = [1; +\\infty) \\setminus \\{3\\}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 15',
        question: 'Tập xác định của hàm số $y = \\sqrt{4 - 2x}$ là:',
        options: ['A. $(-\\infty; 2]$', 'B. $[2; +\\infty)$', 'C. $(-\\infty; 2)$', 'D. $\\mathbb{R} \\setminus \\{2\\}$'],
        correctIndex: 0,
        explanation: '$4 - 2x \\ge 0 \\iff x \\le 2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Tính đơn điệu',
        question: 'Xét tính đồng biến, nghịch biến của $y = 2x^2 - 4x + 1$ trên $(1; +\\infty)$.',
        hints: ['Lập tỉ số $\\frac{f(x_2)-f(x_1)}{x_2-x_1} = 2(x_1+x_2-2)$.'],
        solutionSteps: ['Bước 1: Với $x_1, x_2 > 1$, $x_1+x_2-2 > 0 \\implies$ tỉ số $> 0$, hàm số đồng biến.'],
        finalAnswer: 'Hàm số đồng biến trên $(1; +\\infty)$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'sqrt', params: { a: 1, b: -1, c: 0, d: 0 }, color: '#0284c7', name: 'Đồ thị hàm căn thức' }
  },
  {
    id: 'math-10-b16',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 16,
    stageLabel: 'Chương VI · Hàm Số, Đồ Thị & Ứng Dụng',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 16',
    title: 'Bài 16: Hàm số bậc hai',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Đồ thị Parabol $y = ax^2 + bx + c$ ($a \\neq 0$), tọa độ đỉnh $I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right)$, trục đối xứng $x = -\\frac{b}{2a}$ và GTLN/GTNN.',
    mnemonics: ['$a > 0$: bề lõm quay LÊN; $a < 0$: bề lõm quay XUỐNG.'],
    commonTraps: ['Quên dấu trừ ở hoành độ đỉnh $x_I = -\\frac{b}{2a}$.'],
    theory: [
      '1. Đỉnh $I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right)$, trục đối xứng $x = -\\frac{b}{2a}$.',
      '2. Nếu $a > 0$: giảm trên $(-\\infty; -\\frac{b}{2a})$, tăng trên $(-\\frac{b}{2a}; +\\infty)$.'
    ],
    keyFormulas: ['I\\left(-\\frac{b}{2a};\\, -\\frac{\\Delta}{4a}\\right),\\quad x = -\\frac{b}{2a}'],
    flashcards: [{ front: 'Đỉnh của $y = x^2 - 4x + 5$?', back: '$I(2; 1)$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 16',
        question: 'Trục đối xứng của $y = -2x^2 + 8x - 3$ là:',
        options: ['A. $x = 2$', 'B. $x = -2$', 'C. $x = 4$', 'D. $y = 5$'],
        correctIndex: 0,
        explanation: '$x = -\\frac{8}{2(-2)} = 2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Lập Parabol',
        question: 'Tìm Parabol $(P): y = ax^2 + bx + 2$ qua $M(1; -1)$ và có trục đối xứng $x = 2$.',
        hints: ['$-\\frac{b}{2a} = 2$ và $a + b + 2 = -1$.'],
        solutionSteps: ['Bước 1: $b = -4a$, thế vào $a - 4a + 2 = -1 \\implies a = 1, b = -4$.'],
        finalAnswer: '$y = x^2 - 4x + 2$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'conic_sections_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: 1, b: -4, c: 2, d: 0 }, color: '#4f46e5', name: 'Parabol y = x² - 4x + 2' }
  },
  {
    id: 'math-10-1',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 17,
    stageLabel: 'Chương VI · Hàm Số, Đồ Thị & Ứng Dụng',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 17',
    title: 'Bài 17: Dấu của tam thức bậc hai',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Định lí dấu tam thức bậc hai $f(x) = ax^2 + bx + c$, giải bất phương trình bậc hai một ẩn và bài toán tham số $m$ để $f(x) > 0, \\forall x \\in \\mathbb{R}$.',
    mnemonics: ['$\\Delta > 0$: TRONG TRÁI — NGOÀI CÙNG; $\\Delta \\le 0$: luôn cùng dấu hệ số $a$.'],
    commonTraps: ['Quên xét trường hợp $a = 0$ khi $a$ chứa tham số $m$.'],
    theory: [
      '1. $\\Delta < 0$: $f(x)$ cùng dấu $a$ với mọi $x \\in \\mathbb{R}$. $\\Delta = 0$: cùng dấu $a$ với $x \\neq -\\frac{b}{2a}$.',
      '2. $\\Delta > 0$: trong khoảng 2 nghiệm trái dấu $a$, ngoài khoảng 2 nghiệm cùng dấu $a$.'
    ],
    keyFormulas: ['ax^2 + bx + c > 0\\,\\forall x\\in\\mathbb{R} \\iff a > 0 \\text{ và } \\Delta < 0'],
    flashcards: [{ front: 'Điều kiện $ax^2+bx+c \\ge 0\\,\\forall x\\in\\mathbb{R}$ ($a\\neq 0$)?', back: '$a > 0$ và $\\Delta \\le 0$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 17',
        question: 'Tập nghiệm của $x^2 - 5x + 6 \\le 0$ là:',
        options: ['A. $[2; 3]$', 'B. $(-\\infty; 2] \\cup [3; +\\infty)$', 'C. $(2; 3)$', 'D. $[-3; -2]$'],
        correctIndex: 0,
        explanation: 'Hai nghiệm $2, 3$ và $a = 1 > 0 \\implies [2; 3]$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Tham số BPT',
        question: 'Tìm $m$ để $x^2 - 2mx + 3m - 2 > 0, \\forall x \\in \\mathbb{R}$.',
        hints: ['$\\Delta\' < 0$.'],
        solutionSteps: ['Bước 1: $\\Delta\' = m^2 - 3m + 2 < 0 \\iff 1 < m < 2$.'],
        finalAnswer: '$1 < m < 2$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'conic_sections_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: 1, b: -5, c: 6, d: 0 }, color: '#ef4444', name: 'y = x² - 5x + 6' }
  },
  {
    id: 'math-10-b18',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 18,
    stageLabel: 'Chương VI · Hàm Số, Đồ Thị & Ứng Dụng',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 18',
    title: 'Bài 18: Phương trình quy về phương trình bậc hai',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description:
      'Giải phương trình $\\sqrt{ax^2+bx+c} = \\sqrt{dx^2+ex+f}$ và $\\sqrt{ax^2+bx+c} = dx + e$ bằng phép bình phương kèm kiểm tra điều kiện.',
    mnemonics: ['Bình phương giải $\\sqrt{A} = B$ luôn kèm $B \\ge 0$ (hoặc thử lại nghiệm).'],
    commonTraps: ['Nhận nhầm nghiệm ngoại lai làm $dx + e < 0$.'],
    theory: [
      '1. $\\sqrt{A} = \\sqrt{B} \\Rightarrow A = B$ rồi thử lại điều kiện $A \\ge 0$.',
      '2. $\\sqrt{A} = B \\iff B \\ge 0$ và $A = B^2$.'
    ],
    keyFormulas: ['\\sqrt{A} = B \\iff B \\ge 0 \\text{ và } A = B^2'],
    flashcards: [{ front: 'Giải $\\sqrt{x^2-2x-3} = x-3$?', back: 'ĐK $x\\ge 3$, bình phương ra $4x=12 \\implies x=3$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 18',
        question: 'Nghiệm của $\\sqrt{x^2 - 2x - 3} = x - 3$ là:',
        options: ['A. $x = 3$', 'B. $x = 3; x = -1$', 'C. Vô nghiệm', 'D. $x = 4$'],
        correctIndex: 0,
        explanation: 'ĐK $x \\ge 3$, bình phương cho $4x = 12 \\iff x = 3$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Phương trình căn',
        question: 'Giải phương trình $\\sqrt{2x^2 + 3x - 5} = x + 1$.',
        hints: ['ĐK $x \\ge -1$.'],
        solutionSteps: ['Bước 1: $2x^2+3x-5 = x^2+2x+1 \\iff x^2+x-6=0 \\implies x=2$ (nhận), $x=-3$ (loại).'],
        finalAnswer: '$x = 2$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'conic_sections_3d',
    defaultGraphConfig: { type: 'sqrt', params: { a: 1, b: -3, c: 0, d: 0 }, color: '#0ea5e9', name: 'Phương trình chứa căn' }
  },

  // ==================== CHƯƠNG VII. PHƯƠNG PHÁP TỌA ĐỘ TRONG MẶT PHẲNG ====================
  {
    id: 'math-10-5',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 19,
    stageLabel: 'Chương VII · Phương Pháp Tọa Độ Trong Mặt Phẳng',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 19',
    title: 'Bài 19: Phương trình đường thẳng',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Vectơ pháp tuyến $\\vec{n}(a; b)$, vectơ chỉ phương $\\vec{u}(u_1; u_2)$, phương trình tổng quát và phương trình tham số đường thẳng trong $Oxy$.',
    mnemonics: ['VTCP $\\vec{u}=(p;q) \\Rightarrow$ VTPT $\\vec{n}=(-q;p)$.'],
    commonTraps: ['Nhầm lẫn VTPT và VTCP khi đọc phương trình tổng quát.'],
    theory: [
      '1. PTTQ: $a(x - x_0) + b(y - y_0) = 0$ với VTPT $\\vec{n}(a; b)$.',
      '2. PTTS: $x = x_0 + u_1 t, y = y_0 + u_2 t$ với VTCP $\\vec{u}(u_1; u_2)$.'
    ],
    keyFormulas: ['a(x - x_0) + b(y - y_0) = 0', '\\vec{u}=(u_1; u_2) \\implies \\vec{n}=(-u_2; u_1)'],
    flashcards: [{ front: 'Đường thẳng qua $A(2;0), B(0;-3)$?', back: '$\\frac{x}{2}+\\frac{y}{-3}=1 \\iff 3x-2y-6=0$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 19',
        question: 'VTPT của đường thẳng $2x - 5y + 3 = 0$ là:',
        options: ['A. $(2; -5)$', 'B. $(5; 2)$', 'C. $(-5; 2)$', 'D. $(2; 5)$'],
        correctIndex: 0,
        explanation: 'Đọc trực tiếp hệ số $x, y$ là $(2; -5)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Đường cao',
        question: 'Cho $A(1;2), B(3;5), C(-1;4)$. Viết PT đường cao $AH$.',
        hints: ['VTPT là $\\vec{BC}=(-4;-1)$.'],
        solutionSteps: ['Bước 1: $4(x-1)+1(y-2)=0 \\iff 4x+y-6=0$.'],
        finalAnswer: '$4x + y - 6 = 0$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'line_plane_oxyz',
    defaultGraphConfig: { type: 'linear', params: { a: -4, b: 6, c: 0, d: 0 }, color: '#2563eb', name: '4x + y - 6 = 0' }
  },
  {
    id: 'math-10-b20',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 20,
    stageLabel: 'Chương VII · Phương Pháp Tọa Độ Trong Mặt Phẳng',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 20',
    title: 'Bài 20: Đường thẳng trong mặt phẳng tọa độ (Vị trí tương đối, Góc, Khoảng cách)',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Vị trí tương đối hai đường thẳng (cắt, song song, trùng), góc giữa hai đường thẳng và công thức khoảng cách $d(M_0; \\Delta)$.',
    mnemonics: ['Góc & Khoảng cách luôn có dấu GIÁ TRỊ TUYỆT ĐỐI ở tử số.'],
    commonTraps: ['Quên trị tuyệt đối $|ax_0 + by_0 + c|$ khi tính khoảng cách.'],
    theory: [
      '1. Giải hệ 2 PT đường thẳng để xét cắt / song song / trùng.',
      '2. $\\cos\\varphi = \\frac{|\\vec{n}_1 \\cdot \\vec{n}_2|}{|\\vec{n}_1||\\vec{n}_2|}$; $d(M_0; \\Delta) = \\frac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}$.'
    ],
    keyFormulas: ['d(M_0; \\Delta) = \\frac{|ax_0 + by_0 + c|}{\\sqrt{a^2 + b^2}}', '\\cos(\\Delta_1,\\Delta_2) = \\frac{|a_1a_2+b_1b_2|}{\\sqrt{a_1^2+b_1^2}\\sqrt{a_2^2+b_2^2}}'],
    flashcards: [{ front: 'Khoảng cách $M(1;-2)$ tới $3x-4y+4=0$?', back: '$\\frac{|3+8+4|}{5} = 3$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 20',
        question: 'Khoảng cách giữa $d_1: 3x+4y-10=0$ và $d_2: 3x+4y+5=0$ là:',
        options: ['A. $3$', 'B. $15$', 'C. $1$', 'D. $5$'],
        correctIndex: 0,
        explanation: '$\\frac{|-10-5|}{5} = 3$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Góc 2 đường thẳng',
        question: 'Tính cosin góc giữa $d_1: x - 2y + 1 = 0$ và $d_2: 3x + y - 2 = 0$.',
        hints: ['Dùng $\\vec{n}_1=(1;-2), \\vec{n}_2=(3;1)$.'],
        solutionSteps: ['Bước 1: $\\cos\\varphi = \\frac{|3-2|}{\\sqrt{5}\\sqrt{10}} = \\frac{1}{5\\sqrt{2}}$.'],
        finalAnswer: '$\\cos\\varphi = \\frac{1}{5\\sqrt{2}}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'line_plane_oxyz'
  },
  {
    id: 'math-10-b21',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 21,
    stageLabel: 'Chương VII · Phương Pháp Tọa Độ Trong Mặt Phẳng',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 21',
    title: 'Bài 21: Đường tròn trong mặt phẳng tọa độ',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Phương trình $(x - a)^2 + (y - b)^2 = R^2$, dạng khai triển $x^2 + y^2 - 2ax - 2by + c = 0$ và phương trình tiếp tuyến của đường tròn.',
    mnemonics: ['Chia hệ số $x, y$ cho $-2$ để lấy tâm $I(a; b)$, $R = \\sqrt{a^2 + b^2 - c}$.'],
    commonTraps: ['Quên điều kiện $a^2 + b^2 - c > 0$.'],
    theory: [
      '1. Đường tròn tâm $I(a; b)$ bán kính $R$: $(x - a)^2 + (y - b)^2 = R^2$.',
      '2. Tiếp tuyến tại $M_0(x_0; y_0) \\in (C)$: $(x_0 - a)(x - x_0) + (y_0 - b)(y - y_0) = 0$.'
    ],
    keyFormulas: ['(x - a)^2 + (y - b)^2 = R^2', 'R = \\sqrt{a^2 + b^2 - c}'],
    flashcards: [{ front: 'Tâm và bán kính $x^2+y^2-6x+4y-3=0$?', back: '$I(3; -2), R = 4$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 21',
        question: 'Đường tròn tâm $I(-2; 3)$ qua $A(1; 7)$ có phương trình:',
        options: ['A. $(x+2)^2+(y-3)^2=25$', 'B. $(x-2)^2+(y+3)^2=25$', 'C. $(x+2)^2+(y-3)^2=5$', 'D. $(x+2)^2+(y+3)^2=25$'],
        correctIndex: 0,
        explanation: '$R^2 = 3^2 + 4^2 = 25$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Tiếp tuyến',
        question: 'Viết tiếp tuyến $(C): (x-1)^2+(y+2)^2=10$ tại $M(2; 1)$.',
        hints: ['VTPT $\\vec{IM} = (1; 3)$.'],
        solutionSteps: ['Bước 1: $1(x-2)+3(y-1)=0 \\iff x+3y-5=0$.'],
        finalAnswer: '$x + 3y - 5 = 0$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  },
  {
    id: 'math-10-8',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 22,
    stageLabel: 'Chương VII · Phương Pháp Tọa Độ Trong Mặt Phẳng',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 22',
    title: 'Bài 22: Ba đường Conic (Elip, Hypebol, Parabol)',
    grade: 'Lớp 10 · Hình học tọa độ',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 18,
    description:
      'Phương trình chính tắc Elip $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$, Hypebol $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ và Parabol $y^2 = 2px$.',
    mnemonics: ['Elip: $a^2=b^2+c^2$; Hypebol: $c^2=a^2+b^2$; Parabol: $F(p/2; 0)$.'],
    commonTraps: ['Nhầm $c^2 = a^2 - b^2$ (Elip) với $c^2 = a^2 + b^2$ (Hypebol).'],
    theory: [
      '1. Elip: $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$, $MF_1+MF_2=2a$.',
      '2. Hypebol: $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$, $|MF_1-MF_2|=2a$. Parabol: $y^2 = 2px$.'
    ],
    keyFormulas: ['\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1', '\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1', 'y^2 = 2px'],
    flashcards: [{ front: 'Elip $\\frac{x^2}{25}+\\frac{y^2}{9}=1$ có tiêu cự?', back: '$c=4 \\implies 2c = 8$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 22',
        question: 'Parabol $y^2 = 8x$ có tiêu điểm $F$ là:',
        options: ['A. $(2; 0)$', 'B. $(4; 0)$', 'C. $(0; 2)$', 'D. $(-2; 0)$'],
        correctIndex: 0,
        explanation: '$2p=8 \\implies p=4 \\implies F(2; 0)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Lập PT Elip',
        question: 'Viết PT chính tắc Elip có $F_1(-3; 0)$ và qua $A(5; 0)$.',
        hints: ['$c=3, a=5$.'],
        solutionSteps: ['Bước 1: $b^2 = 25 - 9 = 16 \\implies \\frac{x^2}{25} + \\frac{y^2}{16} = 1$.'],
        finalAnswer: '$\\frac{x^2}{25} + \\frac{y^2}{16} = 1$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'conic_sections_3d'
  },

  // ==================== CHƯƠNG VIII. ĐẠI SỐ TỔ HỢP ====================
  {
    id: 'math-10-b23',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 23,
    stageLabel: 'Chương VIII · Đại Số Tổ Hợp',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 23',
    title: 'Bài 23: Quy tắc đếm',
    grade: 'Lớp 10 · Đại số tổ hợp',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description: 'Quy tắc cộng (phương án rời nhau) và Quy tắc nhân (công đoạn liên tiếp) kèm sơ đồ hình cây.',
    mnemonics: ['Chưa xong việc -> NHÂN; Xong việc chia trường hợp -> CỘNG.'],
    commonTraps: ['Đếm sót điều kiện chữ số đầu khác $0$.'],
    theory: [
      '1. Quy tắc cộng: $m + n$ cách cho các phương án loại trừ nhau.',
      '2. Quy tắc nhân: $m \\times n$ cách cho các bước liên tiếp.'
    ],
    keyFormulas: ['\\text{Cộng: } m + n;\\quad \\text{Nhân: } m \\times n'],
    flashcards: [{ front: '$A\\to B$ có 3 đường, $B\\to C$ có 4 đường. Số cách $A\\to C$?', back: '$3 \\times 4 = 12$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 23',
        question: 'Từ $1,2,3,4,5$ lập được bao nhiêu số $3$ chữ số đôi một khác nhau?',
        options: ['A. $60$', 'B. $125$', 'C. $10$', 'D. $24$'],
        correctIndex: 0,
        explanation: '$5 \\times 4 \\times 3 = 60$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Số chẵn',
        question: 'Từ $0..5$ lập được bao nhiêu số chẵn $3$ chữ số khác nhau?',
        hints: ['Chia TH $c=0$ và $c\\in\\{2,4\\}$.'],
        solutionSteps: ['Bước 1: $c=0$: $5\\cdot 4=20$. $c\\in\\{2,4\\}$: $2\\cdot 4\\cdot 4=32$. Tổng $52$.'],
        finalAnswer: '$52$ số.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '3 * e^(-0.35 * x * x)', params: { a: 3, b: 1, c: 0, d: 0 }, color: '#8b5cf6', name: 'Phân phối đếm tổ hợp' }
  },
  {
    id: 'math-10-7',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 24,
    stageLabel: 'Chương VIII · Đại Số Tổ Hợp',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 24',
    title: 'Bài 24: Hoán vị, chỉnh hợp và tổ hợp',
    grade: 'Lớp 10 · Đại số tổ hợp',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description: 'Hoán vị $P_n = n!$, Chỉnh hợp $A_n^k$ (có thứ tự) và Tổ hợp $C_n^k$ (không thứ tự).',
    mnemonics: ['Xếp hết -> $P_n$; Chọn có thứ tự -> $A_n^k$; Chọn không thứ tự -> $C_n^k$.'],
    commonTraps: ['Nhầm $A_n^k$ và $C_n^k$.'],
    theory: [
      '1. Hoán vị ($P_n$): Mỗi cách sắp xếp thứ tự tất cả $n$ phần tử khác nhau của tập hợp $A$ ($n \\ge 1$) gọi là một hoán vị của $n$ phần tử: $P_n = n! = n(n-1)\\cdots 2\\cdot 1$ (quy ước $0! = 1$).',
      '2. Chỉnh hợp ($A_n^k$): Chọn $k$ phần tử từ $n$ phần tử ($1 \\le k \\le n$) và **có sắp xếp thứ tự** (phân biệt chức vụ, chữ số khác nhau): $A_n^k = \\frac{n!}{(n-k)!} = n(n-1)\\cdots(n-k+1)$.',
      '3. Tổ hợp ($C_n^k$): Chọn $k$ phần tử từ $n$ phần tử ($0 \\le k \\le n$) **không xét thứ tự**: $C_n^k = \\frac{n!}{k!(n-k)!}$, với tính chất đối xứng $C_n^k = C_n^{n-k}$ và công thức Pascal $C_n^k + C_n^{k+1} = C_{n+1}^{k+1}$.'
    ],
    keyFormulas: ['P_n = n!,\\quad A_n^k = \\frac{n!}{(n-k)!},\\quad C_n^k = \\frac{n!}{k!(n-k)!}'],
    flashcards: [{ front: 'Chọn 3 bạn làm lớp trưởng, lớp phó, bí thư từ 20 bạn?', back: '$A_{20}^3 = 6840$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 24',
        question: 'Số tam giác tạo từ $10$ điểm không có $3$ điểm thẳng hàng là:',
        options: ['A. $120$', 'B. $720$', 'C. $30$', 'D. $1000$'],
        correctIndex: 0,
        explanation: '$C_{10}^3 = 120$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Chọn nhóm',
        question: 'Chọn $4$ học sinh từ $6$ nam và $4$ nữ sao cho có ít nhất $1$ nữ.',
        hints: ['Dùng phần bù $C_{10}^4 - C_6^4$.'],
        solutionSteps: ['Bước 1: $210 - 15 = 195$ cách.'],
        finalAnswer: '$195$ cách.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '3.2 * e^(-0.4 * x * x)', params: { a: 3.2, b: 1, c: 0, d: 0 }, color: '#8b5cf6', name: 'Phân phối tổ hợp C(n, k)' }
  },
  {
    id: 'math-10-b25',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 25,
    stageLabel: 'Chương VIII · Đại Số Tổ Hợp',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 25',
    title: 'Bài 25: Nhị thức Newton',
    grade: 'Lớp 10 · Đại số tổ hợp',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description: 'Khai triển $(a+b)^4$ và $(a+b)^5$ chuẩn GDPT 2018 bằng công thức tổ hợp và tam giác Pascal.',
    mnemonics: ['Tổng số mũ của $a$ và $b$ ở mỗi số hạng luôn bằng $n$.'],
    commonTraps: ['Quên dấu trừ khi khai triển hiệu $(a - b)^n$.'],
    theory: [
      '1. Công thức khai triển Nhị thức Newton tổng quát: $(a+b)^n = \\sum_{k=0}^n C_n^k a^{n-k}b^k$. Ở Toán 10 GDPT 2018 tập trung thành thạo $n = 4$ và $n = 5$ với số hạng tổng quát $T_{k+1} = C_n^k a^{n-k}b^k$.',
      '2. Quy luật Tam giác Pascal & Tính chất: Số hạng thứ $k+1$ có tổng số mũ của $a$ và $b$ luôn bằng $n$, các hệ số đối xứng qua tâm ($C_n^k = C_n^{n-k}$). Với $(a-b)^n$, dấu các số hạng đan xen $+, -, +, -$.',
      '3. Tổng hệ số: Thay $a = b = 1$ thu được tổng các hệ số $C_n^0 + C_n^1 + \\dots + C_n^n = 2^n$; thay $a = 1, b = -1$ thu được tổng đan dấu bằng $0$.'
    ],
    keyFormulas: ['(a+b)^4 = a^4+4a^3b+6a^2b^2+4ab^3+b^4', '(a+b)^5 = a^5+5a^4b+10a^3b^2+10a^2b^3+5ab^4+b^5'],
    flashcards: [{ front: 'Hệ số $x^2$ trong $(2x-1)^4$?', back: '$C_4^2 \\cdot 4 = 24$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 25',
        question: 'Hệ số của $x^3$ trong $(x+2)^5$ là:',
        options: ['A. $40$', 'B. $10$', 'C. $80$', 'D. $20$'],
        correctIndex: 0,
        explanation: '$C_5^2 \\cdot 2^2 = 10 \\cdot 4 = 40$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Nhị thức Newton',
        question: 'Tìm hệ số $x^2$ trong $(3x - 1/x)^4$.',
        hints: ['$4 - 2k = 2 \\implies k = 1$.'],
        solutionSteps: ['Bước 1: $C_4^1 \\cdot 3^3 (-1)^1 = -108$.'],
        finalAnswer: '$-108$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '3.2 * e^(-0.45 * x * x)', params: { a: 3.2, b: 1, c: 0, d: 0 }, color: '#a855f7', name: 'Hệ số Nhị thức Newton C(n, k)' }
  },

  // ==================== CHƯƠNG IX. TÍNH XÁC SUẤT THEO ĐỊNH NGHĨA CỔ ĐIỂN ====================
  {
    id: 'math-10-b26',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 26,
    stageLabel: 'Chương IX · Tính Xác Suất Theo Định Nghĩa Cổ Điển',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 26',
    title: 'Bài 26: Biến cố và định nghĩa cổ điển của xác suất',
    grade: 'Lớp 10 · Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description: 'Không gian mẫu $\\Omega$, biến cố $A$, biến cố đối $\\overline{A}$ và công thức $P(A) = \\frac{n(A)}{n(\\Omega)}$.',
    mnemonics: ['$0 \\le P(A) \\le 1$; $P(\\overline{A}) = 1 - P(A)$.'],
    commonTraps: ['Áp dụng cho phép thử không đồng khả năng.'],
    theory: [
      '1. Không gian mẫu $\\Omega$ là tập hợp tất cả các kết quả có thể xảy ra của phép thử ngẫu nhiên; mỗi biến cố $A$ là một tập con của $\\Omega$ ($A \\subset \\Omega$).',
      '2. Định nghĩa cổ điển của xác suất: Khi các kết quả của $\\Omega$ có cùng khả năng xuất hiện (đồng khả năng), xác suất của biến cố $A$ là $P(A) = \\frac{n(A)}{n(\\Omega)}$, thỏa mãn $0 \\le P(A) \\le 1$, $P(\\varnothing) = 0$, $P(\\Omega) = 1$.',
      '3. Biến cố đối $\\overline{A} = \\Omega \\setminus A$ (biến cố "$A$ không xảy ra") luôn có $n(\\overline{A}) = n(\\Omega) - n(A)$ và $P(\\overline{A}) = 1 - P(A)$.'
    ],
    keyFormulas: ['P(A) = \\frac{n(A)}{n(\\Omega)}', 'P(\\overline{A}) = 1 - P(A)'],
    flashcards: [{ front: 'Gieo 1 xúc xắc, xác suất ra mặt chẵn?', back: '$3/6 = 1/2$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 26',
        question: 'Tung đồng xu $2$ lần. Xác suất có đúng $1$ mặt ngửa là:',
        options: ['A. $\\frac{1}{2}$', 'B. $\\frac{1}{4}$', 'C. $\\frac{3}{4}$', 'D. $\\frac{1}{3}$'],
        correctIndex: 0,
        explanation: '$\\{SN, NS\\}$ trên $4$ kết quả $\\implies 2/4 = 1/2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Xác suất cổ điển',
        question: 'Gieo 2 xúc xắc, tính xác suất tổng số chấm bằng $7$.',
        hints: ['$6/36$.'],
        solutionSteps: ['Bước 1: $n(\\Omega)=36$, $n(A)=6 \\implies P(A)=1/6$.'],
        finalAnswer: '$\\frac{1}{6}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '2.8 * e^(-0.5 * x * x)', params: { a: 2.8, b: 1, c: 0, d: 0 }, color: '#6366f1', name: 'Phân phối xác suất cổ điển' }
  },
  {
    id: 'math-10-b27',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    lessonNumber: 27,
    stageLabel: 'Chương IX · Tính Xác Suất Theo Định Nghĩa Cổ Điển',
    sourceTag: 'SGK Toán 10 GDPT 2018 (KNTT) · Bài 27',
    title: 'Bài 27: Thực hành tính xác suất theo định nghĩa cổ điển',
    grade: 'Lớp 10 · Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Vận dụng tổ hợp $C_n^k$, sơ đồ cây và biến cố đối để tính xác suất các bài toán chọn mẫu.',
    mnemonics: ['Từ khóa "ÍT NHẤT 1" -> dùng ngay biến cố đối $P(A) = 1 - P(\\overline{A})$.'],
    commonTraps: ['Lệch cách đếm giữa $n(\\Omega)$ và $n(A)$.'],
    theory: [
      '1. Quy trình 3 bước tính xác suất cổ điển: Mô tả phép thử và tính số phần tử không gian mẫu $n(\\Omega)$ bằng quy tắc đếm / hoán vị / chỉnh hợp / tổ hợp; xác định biến cố $A$ và đếm $n(A)$; lập tỉ số $P(A) = \\frac{n(A)}{n(\\Omega)}$.',
      '2. Phương pháp biến cố đối: Khi đề bài chứa cụm từ "ít nhất một", "không ít hơn", "tồn tại", xét biến cố đối $\\overline{A}$ (không có phần tử nào thỏa mãn) để tính $P(A) = 1 - \\frac{n(\\overline{A})}{n(\\Omega)}$ nhanh và tránh đếm trùng.',
      '3. Sử dụng sơ đồ hình cây: Hữu ích cho phép thử nhiều bước liên tiếp với các nhánh đồng khả năng, giúp liệt kê trực quan mọi phần tử của không gian mẫu.'
    ],
    keyFormulas: ['P(A) = 1 - \\frac{n(\\overline{A})}{n(\\Omega)}'],
    flashcards: [{ front: 'Hộp 4 đỏ, 5 xanh, lấy 2 bi. XS có ít nhất 1 đỏ?', back: '$1 - \\frac{C_5^2}{C_9^2} = \\frac{13}{18}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 10 KNTT · Bài 27',
        question: 'Hộp có $5$ bi trắng, $3$ bi đen. Lấy ngẫu nhiên $2$ bi, xác suất $2$ bi khác màu là:',
        options: ['A. $\\frac{15}{28}$', 'B. $\\frac{13}{28}$', 'C. $\\frac{5}{14}$', 'D. $\\frac{3}{8}$'],
        correctIndex: 0,
        explanation: '$\\frac{5\\cdot 3}{C_8^2} = \\frac{15}{28}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 10 KNTT · Biến cố đối',
        question: 'Gieo đồng xu $4$ lần. Tính xác suất có ít nhất $1$ lần mặt sấp.',
        hints: ['$1 - 1/16$.'],
        solutionSteps: ['Bước 1: $1 - \\frac{1}{2^4} = \\frac{15}{16}$.'],
        finalAnswer: '$\\frac{15}{16}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '3.0 * e^(-0.5 * x * x)', params: { a: 3, b: 1, c: 0, d: 0 }, color: '#4f46e5', name: 'Mật độ xác suất nhị thức' }
  }
];
