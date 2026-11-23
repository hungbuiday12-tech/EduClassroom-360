import { MathLecture } from '../types';

// Chương trình Toán 12 GDPT 2006 (SGK Giải tích 12 + Hình học 12 · NXB Giáo dục Việt Nam 2006)
// Đầy đủ 20 bài phủ hết 4 chương Giải tích 12 (gồm Số phức) + 3 chương Hình học 12, mỗi bài gắn Mô phỏng 2D & 3D

export const MATH_GDPT_2006_GRADE_12: MathLecture[] = [
  // ==================== GIẢI TÍCH 12 · CHƯƠNG I: ỨNG DỤNG ĐẠO HÀM ====================
  {
    id: 'math-2006-12-1',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 1,
    stageLabel: 'Toán 12 (2006) · GT Chương I: Ứng dụng Đạo hàm & Khảo sát hàm số',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 1',
    title: 'Bài 1 (2006): Sự đồng biến, nghịch biến của hàm số',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Cơ bản',
    readTimeMinutes: 17,
    description:
      'Định lí đơn điệu theo dấu đạo hàm $f\'(x)$, quy tắc lập bảng biến thiên, điều kiện đồng biến/nghịch biến trên $\\mathbb{R}$ của hàm bậc ba và hàm phân thức $y = \\frac{ax+b}{cx+d}$.',
    mnemonics: [
      'Hàm phân thức $y = \\frac{ax+b}{cx+d}$ có đạo hàm không đổi dấu $y\' = \\frac{ad-bc}{(cx+d)^2}$, KHÔNG BAO GIỜ có dấu $=$ tại $y\'=0$.',
      'Hàm bậc ba đồng biến trên $\\mathbb{R} \\iff a > 0$ và $\\Delta_{y\'} \\le 0$ (nhớ xét $a = 0$ nếu hệ số chứa tham số!).'
    ],
    commonTraps: [
      'Kết luận hàm phân thức $y = \\frac{x+1}{x-1}$ nghịch biến trên $\\mathbb{R} \\setminus \\{1\\}$ (SAI! Phải dùng chữ "và" giữa 2 khoảng $(-\\infty; 1)$ và $(1; +\\infty)$).'
    ],
    theory: [
      '1. Định lí mở rộng: Nếu $f\'(x) \\ge 0\\ \\forall x \\in K$ (chỉ bằng $0$ tại hữu hạn điểm thuộc $K$) thì $f(x)$ đồng biến trên $K$.',
      '2. Điều kiện hàm bậc ba $y = ax^3 + bx^2 + cx + d$: Đồng biến trên $\\mathbb{R} \\iff (a = b = 0, c > 0)$ hoặc $(a > 0, b^2 - 3ac \\le 0)$.'
    ],
    keyFormulas: [
      'y = \\frac{ax+b}{cx+d} \\implies y\' = \\frac{ad - bc}{(cx+d)^2}',
      'y = ax^3 + bx^2 + cx + d \\text{ đồng biến trên } \\mathbb{R} \\iff a > 0,\\ b^2 - 3ac \\le 0 \\text{ (với } a \\neq 0\\text{)}'
    ],
    flashcards: [
      { front: 'Hàm số $y = \\frac{2x - 1}{x + 1}$ có đồng biến hay nghịch biến trên từng khoảng xác định?', back: '$y\' = \\frac{2\\cdot 1 - (-1)\\cdot 1}{(x+1)^2} = \\frac{3}{(x+1)^2} > 0 \\Rightarrow$ Đồng biến trên $(-\\infty; -1)$ và $(-1; +\\infty)$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 1',
        question: 'Hàm số $y = -x^3 + 3x^2 - 1$ đồng biến trên khoảng nào sau đây?',
        options: ['A. $(0; 2)$', 'B. $(-\\infty; 0)$', 'C. $(2; +\\infty)$', 'D. $(-\\infty; 2)$'],
        correctIndex: 0,
        explanation: '$y\' = -3x^2 + 6x = 0 \\iff x = 0$ hoặc $x = 2$. "Trong trái – Ngoài cùng" nên $y\' > 0$ trên $(0; 2)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Tham số đơn điệu trên R',
        question: 'Tìm tất cả các giá trị thực của $m$ để hàm số $y = \\frac{1}{3}x^3 - mx^2 + (m + 2)x - 1$ đồng biến trên $\\mathbb{R}$.',
        hints: ['Tính $y\' = x^2 - 2mx + m + 2 \\ge 0\\ \\forall x \\in \\mathbb{R} \\iff \\Delta\' \\le 0$.'],
        solutionSteps: [
          'Bước 1: $y\' = x^2 - 2mx + m + 2$.',
          'Bước 2: Để hàm đồng biến trên $\\mathbb{R} \\iff y\' \\ge 0\\ \\forall x \\in \\mathbb{R} \\iff \\Delta\' = m^2 - (m + 2) \\le 0$.',
          'Bước 3: $m^2 - m - 2 \\le 0 \\iff -1 \\le m \\le 2$.'
        ],
        finalAnswer: '$-1 \\le m \\le 2$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'cubic', params: { a: -1, b: 3, c: 0, d: -1 }, color: '#059669', name: 'y = -x³ + 3x² - 1' }
  },
  {
    id: 'math-2006-12-2',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 2,
    stageLabel: 'Toán 12 (2006) · GT Chương I: Ứng dụng Đạo hàm & Khảo sát hàm số',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 2',
    title: 'Bài 2 (2006): Cực trị của hàm số (Cực đại – Cực tiểu)',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Phân biệt điểm cực trị của hàm số ($x_0$), giá trị cực trị ($y_0$), điểm cực trị của đồ thị ($M(x_0; y_0)$); quy tắc I (đổi dấu $f\'$) và quy tắc II (dấu $f\'\'(x_0)$).',
    mnemonics: [
      'Hàm bậc 3 có 2 cực trị $\\iff b^2 - 3ac > 0$. Hàm trùng phương $ax^4 + bx^2 + c$ có 3 cực trị $\\iff ab < 0$.',
      '$f\'(x)$ đổi dấu từ $+$ sang $-$ qua $x_0$: CỰC ĐẠI. Từ $-$ sang $+$: CỰC TIỂU.'
    ],
    commonTraps: [
      'Thấy $f\'(x_0) = 0$ liền kết luận $x_0$ là điểm cực trị mà không kiểm tra $f\'$ có ĐỔI DẤU qua $x_0$ hay không (ví dụ $y = x^3$ tại $x=0$).'
    ],
    theory: [
      '1. Điều kiện đủ: Nếu $f\'(x)$ đổi dấu khi qua $x_0$ thì $x_0$ là điểm cực trị (Quy tắc I). Nếu $f\'(x_0) = 0$ và $f\'\'(x_0) < 0$ thì $x_0$ là điểm cực đại; nếu $f\'\'(x_0) > 0$ thì $x_0$ là điểm cực tiểu (Quy tắc II).',
      '2. Cực trị hàm thường gặp: Hàm bậc ba có 2 cực trị hoặc 0 cực trị; hàm phân thức bậc nhất/bậc nhất không có cực trị; hàm bậc bốn trùng phương có 3 cực trị khi $ab < 0$ và 1 cực trị khi $ab \\ge 0$.'
    ],
    keyFormulas: [
      'f\'(x_0) = 0 \\text{ và } f\'\'(x_0) < 0 \\implies x_0 \\text{ cực đại}',
      'y = ax^4 + bx^2 + c \\text{ có 3 cực trị} \\iff a\\cdot b < 0'
    ],
    flashcards: [
      { front: 'Tìm $m$ để $y = x^4 - 2(m - 1)x^2 + 3$ có đúng 1 điểm cực trị?', back: '$a = 1 > 0$, có 1 cực trị $\\iff ab \\ge 0 \\iff -2(m - 1) \\ge 0 \\iff m \\le 1$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 2',
        question: 'Giá trị cực đại của hàm số $y = x^3 - 3x + 2$ là:',
        options: ['A. $4$', 'B. $-1$', 'C. $0$', 'D. $1$'],
        correctIndex: 0,
        explanation: '$y\' = 3x^2 - 3 = 0 \\iff x = \\pm 1$. Qua $x = -1$, $y\'$ đổi dấu $+ \\to -$ nên $x = -1$ là điểm cực đại, $y_{CĐ} = (-1)^3 - 3(-1) + 2 = 4$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Cực trị tại điểm cho trước',
        question: 'Tìm tham số $m$ để hàm số $y = \\frac{1}{3}x^3 - mx^2 + (m^2 - 4)x + 3$ đạt cực đại tại $x = 3$.',
        hints: ['Dùng Quy tắc II: $y\'(3) = 0$ và $y\'\'(3) < 0$.'],
        solutionSteps: [
          'Bước 1: $y\' = x^2 - 2mx + m^2 - 4$; $y\'\' = 2x - 2m$.',
          'Bước 2: $y\'(3) = 0 \\iff 9 - 6m + m^2 - 4 = 0 \\iff m^2 - 6m + 5 = 0 \\iff m = 1$ hoặc $m = 5$.',
          'Bước 3: Kiểm tra $y\'\'(3) < 0$: với $m = 1$, $y\'\'(3) = 4 > 0$ (cực tiểu, loại); với $m = 5$, $y\'\'(3) = -4 < 0$ (cực đại, nhận).'
        ],
        finalAnswer: '$m = 5$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: 0, c: -3, d: 2 }, color: '#0d9488', name: 'y = x³ - 3x + 2' }
  },
  {
    id: 'math-2006-12-3',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 3,
    stageLabel: 'Toán 12 (2006) · GT Chương I: Ứng dụng Đạo hàm & Khảo sát hàm số',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 3',
    title: 'Bài 3 (2006): Giá trị lớn nhất & Giá trị nhỏ nhất của hàm số',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      'Quy tắc tìm GTLN $\\max_{[a;b]} f(x)$ và GTNN $\\min_{[a;b]} f(x)$ trên một đoạn đóng $[a; b]$ và trên khoảng mở bằng bảng biến thiên, ứng dụng bài toán tối ưu thực tế.',
    mnemonics: [
      'Trên đoạn $[a; b]$ không cần lập bảng biến thiên: tìm các điểm $x_i \\in (a; b)$ làm $f\'(x_i) = 0$ hoặc không xác định $\\to$ tính $f(a), f(b), f(x_i)$ rồi chọn lớn nhất, nhỏ nhất.',
      'Hàm phân thức $y = \\frac{ax+b}{cx+d}$ liên tục trên $[u; v]$ luôn đạt GTLN và GTNN tại hai đầu mút $u$ và $v$.'
    ],
    commonTraps: [
      'Quên loại các nghiệm của $f\'(x) = 0$ nằm NGOÀI đoạn $[a; b]$ đang xét!'
    ],
    theory: [
      '1. Định lí Weierstrass: Mọi hàm số liên tục trên đoạn $[a; b]$ đều có giá trị lớn nhất và giá trị nhỏ nhất trên đoạn đó.',
      '2. Phương pháp trên khoảng mở $(a; b)$: Lập bảng biến thiên đầy đủ trên khoảng đang xét (lưu ý giá trị tại vô cực chỉ là giới hạn, không phải GTLN/GTNN đạt được).'
    ],
    keyFormulas: [
      '\\max_{[a;b]} f(x) = \\max\\{f(a),\\ f(b),\\ f(x_i)\\} \\quad (x_i \\in (a; b),\\ f\'(x_i) = 0)'
    ],
    flashcards: [
      { front: 'GTLN của $y = \\frac{x + 2}{x - 1}$ trên đoạn $[2; 4]$ là?', back: 'Hàm nghịch biến trên $[2; 4]$ nên $\\max = f(2) = \\frac{4}{1} = 4$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 3',
        question: 'Giá trị nhỏ nhất của hàm số $y = x^3 - 3x^2 - 9x + 5$ trên đoạn $[-2; 2]$ là:',
        options: ['A. $-17$', 'B. $10$', 'C. $3$', 'D. $-2$'],
        correctIndex: 0,
        explanation: '$y\' = 3x^2 - 6x - 9 = 0 \\iff x = -1 \\in (-2;2)$ hoặc $x = 3 \\notin [-2;2]$. Tính $f(-2) = 3, f(-1) = 10, f(2) = -17$. Vậy $\\min = -17$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Bài toán tối ưu',
        question: 'Từ một tấm bìa hình vuông cạnh $12\\text{ cm}$, người ta cắt ở bốn góc bốn hình vuông cạnh $x$ ($0 < x < 6$) để gấp thành cái hộp không nắp. Tìm $x$ để thể tích cái hộp lớn nhất.',
        hints: ['Thể tích $V(x) = x(12 - 2x)^2$, khảo sát trên $(0; 6)$.'],
        solutionSteps: [
          'Bước 1: $V(x) = x(12 - 2x)^2 = 4x^3 - 48x^2 + 144x$ với $x \\in (0; 6)$.',
          'Bước 2: $V\'(x) = 12x^2 - 96x + 144 = 0 \\iff x^2 - 8x + 12 = 0 \\iff x = 2 \\in (0; 6)$ hoặc $x = 6$ (loại).',
          'Bước 3: Lập bảng biến thiên thấy $V(x)$ đạt cực đại duy nhất tại $x = 2\\text{ cm}$, với $V_{\\max} = 128\\text{ cm}^3$.'
        ],
        finalAnswer: '$x = 2\\text{ cm}$ ($V_{\\max} = 128\\text{ cm}^3$).'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'cubic', params: { a: 4, b: -48, c: 144, d: 0 }, color: '#059669', name: 'V(x) = 4x³ - 48x² + 144x' }
  },
  {
    id: 'math-2006-12-4',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 4,
    stageLabel: 'Toán 12 (2006) · GT Chương I: Ứng dụng Đạo hàm & Khảo sát hàm số',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 4',
    title: 'Bài 4 (2006): Đường tiệm cận (Tiệm cận đứng & Tiệm cận ngang)',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      'Định nghĩa chuẩn tiệm cận ngang $y = y_0$ và tiệm cận đứng $x = x_0$ dựa trên giới hạn; kỹ thuật xác định nhanh số đường tiệm cận của hàm phân thức và hàm chứa căn.',
    mnemonics: [
      'Hàm $y = \\frac{ax+b}{cx+d}\\ (c\\neq 0, ad-bc\\neq 0)$ luôn có ĐÚNG 2 tiệm cận: TCĐ $x = -\\frac{d}{c}$ và TCN $y = \\frac{a}{c}$.',
      'Nghiệm của mẫu KHÔNG phải là TCĐ nếu nó đồng thời là nghiệm triệt tiêu được trên tử số (cần kiểm tra $\\lim_{x \\to x_0}$).'
    ],
    commonTraps: [
      'Đếm mọi nghiệm của mẫu thức thành tiệm cận đứng mà quên rút gọn nhân tử chung với tử thức hoặc quên kiểm tra điều kiện xác định của căn.'
    ],
    theory: [
      '1. Đường tiệm cận ngang (TCN): Đường thẳng $y = y_0$ là TCN nếu ít nhất một trong hai điều kiện sau thỏa mãn: $\\lim_{x \\to +\\infty} f(x) = y_0$ hoặc $\\lim_{x \\to -\\infty} f(x) = y_0$ (tối đa có 2 TCN).',
      '2. Đường tiệm cận đứng (TCĐ): Đường thẳng $x = x_0$ là TCĐ nếu ít nhất một trong bốn giới hạn một bên $\\lim_{x \\to x_0^\\pm} f(x)$ bằng $+\\infty$ hoặc $-\\infty$.'
    ],
    keyFormulas: [
      'y = \\frac{ax+b}{cx+d} \\implies \\text{TCĐ: } x = -\\frac{d}{c}, \\quad \\text{TCN: } y = \\frac{a}{c}'
    ],
    flashcards: [
      { front: 'Đồ thị hàm số $y = \\frac{x - 1}{x^2 - 1}$ có bao nhiêu tiệm cận đứng?', back: 'Rút gọn $\\frac{1}{x+1}$ ($x \\neq 1$): tại $x=1$ giới hạn bằng $1/2$ hữu hạn nên chỉ có 1 TCĐ là $x = -1$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 4',
        question: 'Tổng số tiệm cận đứng và tiệm cận ngang của đồ thị hàm số $y = \\frac{3x - 2}{x + 1}$ là:',
        options: ['A. $2$', 'B. $1$', 'C. $3$', 'D. $0$'],
        correctIndex: 0,
        explanation: 'TCĐ $x = -1$ và TCN $y = 3$, tổng cộng có $2$ đường tiệm cận.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Tiệm cận hàm chứa căn',
        question: 'Tìm tất cả các đường tiệm cận ngang và đứng của đồ thị $y = \\frac{\\sqrt{x^2 + 1}}{x - 2}$.',
        hints: ['Xét riêng $x \\to +\\infty$ và $x \\to -\\infty$ vì $\\sqrt{x^2} = |x|$.'],
        solutionSteps: [
          'Bước 1: $x \\to +\\infty$: $\\lim \\frac{\\sqrt{x^2+1}}{x-2} = +1$; $x \\to -\\infty$: $\\lim \\frac{-x\\sqrt{1+1/x^2}}{x(1-2/x)} = -1 \\Rightarrow$ Có 2 TCN là $y = 1$ và $y = -1$.',
          'Bước 2: Tử số tại $x = 2$ bằng $\\sqrt{5} \\neq 0 \\Rightarrow \\lim_{x \\to 2^+} y = +\\infty \\Rightarrow$ Có 1 TCĐ là $x = 2$.'
        ],
        finalAnswer: 'Hai TCN: $y = 1, y = -1$; Một TCĐ: $x = 2$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'conic_sections_3d',
    defaultGraphConfig: { type: 'rational', params: { a: 3, b: -2, c: 1, d: 1 }, color: '#0284c7', name: 'y = (3x - 2)/(x + 1)' }
  },
  {
    id: 'math-2006-12-5',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 5,
    stageLabel: 'Toán 12 (2006) · GT Chương I: Ứng dụng Đạo hàm & Khảo sát hàm số',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 5',
    title: 'Bài 5 (2006): Khảo sát – Nhận dạng Đồ thị & Bài toán Tương giao',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 20,
    description:
      'Đọc dấu hệ số $a, b, c, d$ từ đồ thị hàm bậc ba $y = ax^3+bx^2+cx+d$, hàm trùng phương $y = ax^4+bx^2+c$, hàm phân thức $y = \\frac{ax+b}{cx+d}$ và bài toán số nghiệm phương trình $f(x) = m$.',
    mnemonics: [
      'Nhìn nhánh phải cùng ($x \\to +\\infty$) để xác định dấu của hệ số cao nhất $a$ (đi lên $\\Rightarrow a > 0$, đi xuống $\\Rightarrow a < 0$).',
      'Số nghiệm của $f(x) = m$ chính là số giao điểm của đồ thị $(C): y = f(x)$ và đường thẳng nằm ngang $y = m$.'
    ],
    commonTraps: [
      'Nhầm vị trí giao điểm với trục tung $Oy$ (tung độ bằng $d$ hoặc $c$ hoặc $b/d$) và dấu của tổng/tích hai điểm cực trị $x_1 + x_2 = -\\frac{2b}{3a}$.'
    ],
    theory: [
      '1. Đồ thị 3 hàm số cơ bản SGK 2006: Hàm bậc ba có tâm đối xứng là điểm uốn $I$ ($y\'\'=0$); hàm bậc bốn trùng phương nhận trục $Oy$ làm trục đối xứng; hàm nhất biến nhận giao điểm hai tiệm cận $I(-d/c; a/c)$ làm tâm đối xứng.',
      '2. Tương giao đồ thị: Số nghiệm thực của phương trình $f(x) = g(x)$ bằng số giao điểm của đồ thị hai hàm số; cô lập tham số về dạng $f(x) = h(m)$ để biện luận bằng bảng biến thiên.'
    ],
    keyFormulas: [
      '\\text{Điểm uốn bậc ba: } y\'\' = 6ax + 2b = 0 \\iff x = -\\frac{b}{3a}',
      '\\text{Tâm đối xứng phân thức: } I\\left(-\\frac{d}{c};\\ \\frac{a}{c}\\right)'
    ],
    flashcards: [
      { front: 'Đồ thị hàm bậc ba $y = x^3 - 3x^2 + 2$ cắt đường thẳng $y = m$ tại 3 điểm phân biệt khi nào?', back: '$y_{CT} = -2, y_{CĐ} = 2 \\Rightarrow -2 < m < 2$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 5',
        question: 'Cho hàm số $y = x^4 - 2x^2 - 1$. Phương trình $x^4 - 2x^2 - 1 = m$ có đúng 4 nghiệm phân biệt khi:',
        options: ['A. $-2 < m < -1$', 'B. $m > -1$', 'C. $m = -2$', 'D. $-2 \\le m \\le -1$'],
        correctIndex: 0,
        explanation: 'Hàm trùng phương có $a = 1 > 0$, $y_{CĐ} = y(0) = -1$, $y_{CT} = y(\\pm 1) = -2$. Đường $y=m$ cắt tại 4 điểm $\\iff y_{CT} < m < y_{CĐ} \\iff -2 < m < -1$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Biện luận tương giao',
        question: 'Tìm tất cả các giá trị thực của $m$ để đường thẳng $d: y = x + m$ cắt đồ thị $(C): y = \\frac{2x - 1}{x - 1}$ tại hai điểm phân biệt.',
        hints: ['Lập phương trình hoành độ giao điểm với $x \\neq 1$, đưa về phương trình bậc hai rồi xét $\\Delta > 0$ và $x = 1$ không là nghiệm.'],
        solutionSteps: [
          'Bước 1: ĐK $x \\neq 1$. Phương trình giao điểm: $\\frac{2x - 1}{x - 1} = x + m \\iff 2x - 1 = (x + m)(x - 1) \\iff x^2 + (m - 3)x - m + 1 = 0$.',
          'Bước 2: Thay $x = 1$ vào VT: $1 + m - 3 - m + 1 = -1 \\neq 0$ (với mọi $m$).',
          'Bước 3: $\\Delta = (m - 3)^2 - 4(1 - m) = m^2 - 2m + 5 = (m - 1)^2 + 4 > 0\\ \\forall m \\in \\mathbb{R}$. Vậy luôn cắt tại 2 điểm phân biệt với mọi $m$.'
        ],
        finalAnswer: 'Mọi $m \\in \\mathbb{R}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: -3, c: 0, d: 2 }, color: '#059669', name: 'y = x³ - 3x² + 2' }
  },
  // ==================== GIẢI TÍCH 12 · CHƯƠNG II: LŨY THỪA, MŨ VÀ LÔGARIT ====================
  {
    id: 'math-2006-12-6',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 6,
    stageLabel: 'Toán 12 (2006) · GT Chương II: Lũy thừa – Mũ – Lôgarit',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 1–2',
    title: 'Bài 6 (2006): Lũy thừa & Hàm số Lũy thừa y = xᵅ (Chú ý tập xác định)',
    grade: 'Lớp 12 · Lượng giác & Mũ',
    category: 'Lượng giác & Mũ',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      'Quy tắc tính lũy thừa số mũ thực, điều kiện xác định của hàm số lũy thừa $y = [u(x)]^\\alpha$ (3 trường hợp của $\\alpha$) và công thức đạo hàm $(u^\\alpha)\' = \\alpha u^{\\alpha-1} u\'$.',
    mnemonics: [
      '3 trường hợp tập xác định của $u(x)^\\alpha$: (1) $\\alpha \\in \\mathbb{Z}^+$ $\\to u(x)$ xác định; (2) $\\alpha \\in \\mathbb{Z}^- \\cup \\{0\\}$ $\\to u(x) \\neq 0$; (3) $\\alpha \\notin \\mathbb{Z}$ (phân số/vô tỉ) $\\to u(x) > 0$.'
    ],
    commonTraps: [
      'Quên phân biệt $\\alpha$ nguyên âm ($u \\neq 0$) với $\\alpha$ không nguyên ($u > 0$) khi tìm tập xác định!'
    ],
    theory: [
      '1. Tính chất lũy thừa: Với $a > 0, b > 0$: $a^\\alpha a^\\beta = a^{\\alpha + \\beta}$, $(a^\\alpha)^\\beta = a^{\\alpha\\beta}$, $\\sqrt[n]{a^m} = a^{m/n}$.',
      '2. Hàm số lũy thừa $y = x^\\alpha$: Trên $(0; +\\infty)$, đạo hàm $(x^\\alpha)\' = \\alpha x^{\\alpha - 1}$. Hàm đồng biến khi $\\alpha > 0$, nghịch biến khi $\\alpha < 0$, đồ thị luôn đi qua $(1; 1)$.'
    ],
    keyFormulas: [
      '\\sqrt[n]{a^m} = a^{\\frac{m}{n}} \\ (a > 0), \\quad (x^\\alpha)\' = \\alpha x^{\\alpha - 1}',
      '\\alpha \\notin \\mathbb{Z}: \\ [u(x)]^\\alpha \\text{ có nghĩa} \\iff u(x) > 0'
    ],
    flashcards: [
      { front: 'Tập xác định của hàm số $y = (x^2 - 4)^{\\pi}$ là gì?', back: 'Số mũ $\\pi \\notin \\mathbb{Z} \\Rightarrow x^2 - 4 > 0 \\iff (-\\infty; -2) \\cup (2; +\\infty)$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 2',
        question: 'Tập xác định của hàm số $y = (x - 1)^{-3}$ là:',
        options: ['A. $\\mathbb{R} \\setminus \\{1\\}$', 'B. $(1; +\\infty)$', 'C. $\\mathbb{R}$', 'D. $[1; +\\infty)$'],
        correctIndex: 0,
        explanation: 'Số mũ $-3$ là số nguyên âm nên chỉ cần cơ số $x - 1 \\neq 0 \\iff x \\neq 1$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Rút gọn lũy thừa',
        question: 'Cho $a > 0$. Rút gọn biểu thức $P = a^{\\frac{1}{3}} \\cdot \\sqrt{a} : a^{\\frac{5}{6}}$.',
        hints: ['Đưa $\\sqrt{a} = a^{1/2}$ rồi dùng quy tắc cộng – trừ số mũ.'],
        solutionSteps: [
          'Bước 1: $P = a^{\\frac{1}{3}} \\cdot a^{\\frac{1}{2}} \\cdot a^{-\\frac{5}{6}} = a^{\\frac{1}{3} + \\frac{1}{2} - \\frac{5}{6}}$.',
          'Bước 2: Tính số mũ: $\\frac{2 + 3 - 5}{6} = 0 \\Rightarrow P = a^0 = 1$.'
        ],
        finalAnswer: '$P = 1$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'sqrt', params: { a: 1, b: 0, c: 0, d: 0 }, color: '#0d9488', name: 'y = x^(1/2)' }
  },
  {
    id: 'math-2006-12-7',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 7,
    stageLabel: 'Toán 12 (2006) · GT Chương II: Lũy thừa – Mũ – Lôgarit',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 3',
    title: 'Bài 7 (2006): Lôgarit & Các quy tắc tính Lôgarit',
    grade: 'Lớp 12 · Lượng giác & Mũ',
    category: 'Lượng giác & Mũ',
    difficulty: 'Cơ bản',
    readTimeMinutes: 17,
    description:
      'Định nghĩa $\\log_a b$, điều kiện tồn tại ($0 < a \\neq 1, b > 0$), lôgarit của tích – thương – lũy thừa, công thức đổi cơ số và lôgarit thập phân $\\lg$, lôgarit tự nhiên $\\ln$.',
    mnemonics: [
      'Đưa số mũ ra ngoài: mũ trên $\\log_a(b^\\alpha) = \\alpha\\log_a b$; mũ dưới $\\log_{a^\\beta} b = \\frac{1}{\\beta}\\log_a b$.',
      'Đổi cơ số: $\\log_a b = \\frac{\\log_c b}{\\log_c a}$ và $\\log_a b \\cdot \\log_b c = \\log_a c$.'
    ],
    commonTraps: [
      'Đưa số mũ chẵn ra ngoài làm mất dấu trị tuyệt đối khi chưa biết $x > 0$: $\\log_a(x^2) = 2\\log_a|x|$.',
      'Nhầm $\\log_a(b + c) = \\log_a b + \\log_a c$ (SAI!).'
    ],
    theory: [
      '1. Định nghĩa: Cho $0 < a \\neq 1$ và $b > 0$, $\\alpha = \\log_a b \\iff a^\\alpha = b$. Tính chất: $\\log_a 1 = 0, \\log_a a = 1, a^{\\log_a b} = b$.',
      '2. Quy tắc biến đổi: $\\log_a(bc) = \\log_a b + \\log_a c$; $\\log_a\\frac{b}{c} = \\log_a b - \\log_a c$; $\\log_{a^\\beta} b^\\alpha = \\frac{\\alpha}{\\beta}\\log_a b$.'
    ],
    keyFormulas: [
      '\\log_a(bc) = \\log_a b + \\log_a c, \\quad \\log_{a^\\beta}(b^\\alpha) = \\frac{\\alpha}{\\beta}\\log_a b',
      '\\log_a b = \\frac{\\log_c b}{\\log_c a} = \\frac{1}{\\log_b a}'
    ],
    flashcards: [
      { front: 'Biểu diễn $\\log_{25} 8$ theo $m = \\log_5 2$?', back: '$\\log_{5^2} 2^3 = \\frac{3}{2}\\log_5 2 = \\frac{3m}{2}$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 3',
        question: 'Với mọi $a > 0$ và $a \\neq 1$, giá trị của $\\log_{a^2}(a^5)$ bằng:',
        options: ['A. $\\frac{5}{2}$', 'B. $\\frac{2}{5}$', 'C. $3$', 'D. $10$'],
        correctIndex: 0,
        explanation: '$\\log_{a^2}(a^5) = \\frac{5}{2}\\log_a a = \\frac{5}{2}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Biểu diễn lôgarit',
        question: 'Cho $a = \\log_2 3$ và $b = \\log_3 5$. Hãy biểu diễn $\\log_6 15$ theo $a$ và $b$.',
        hints: ['Đổi $\\log_6 15$ về cơ số $3$ (hoặc cơ số $2$) và tách $6 = 2\\cdot 3$, $15 = 3\\cdot 5$.'],
        solutionSteps: [
          'Bước 1: Đổi về cơ số $3$: $\\log_6 15 = \\frac{\\log_3 15}{\\log_3 6} = \\frac{\\log_3 3 + \\log_3 5}{\\log_3 2 + \\log_3 3}$.',
          'Bước 2: Thay $\\log_3 5 = b$ và $\\log_3 2 = \\frac{1}{a}$: $\\log_6 15 = \\frac{1 + b}{\\frac{1}{a} + 1} = \\frac{a(1 + b)}{a + 1}$.'
        ],
        finalAnswer: '$\\frac{a(1 + b)}{a + 1}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'logarithmic', params: { a: 2, b: 1, c: 0, d: 0 }, color: '#059669', name: 'y = log₂(x)' }
  },
  {
    id: 'math-2006-12-8',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 8,
    stageLabel: 'Toán 12 (2006) · GT Chương II: Lũy thừa – Mũ – Lôgarit',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 4',
    title: 'Bài 8 (2006): Hàm số Mũ y = aˣ & Hàm số Lôgarit y = logₐx',
    grade: 'Lớp 12 · Lượng giác & Mũ',
    category: 'Lượng giác & Mũ',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Tập xác định, tập giá trị, tiệm cận, chiều biến thiên, đồ thị đối xứng qua đường phân giác $y = x$ và bảng đạo hàm của hàm số mũ – hàm số lôgarit.',
    mnemonics: [
      'Hàm mũ $y = a^x$: $x \\in \\mathbb{R}$, giá trị $> 0$, nhận $Ox$ ($y = 0$) làm TCN, qua $(0; 1)$.',
      'Hàm lôgarit $y = \\log_a x$: $x > 0$, giá trị $\\in \\mathbb{R}$, nhận $Oy$ ($x = 0$) làm TCĐ, qua $(1; 0)$.'
    ],
    commonTraps: [
      'Quên nhân $\\ln a$ trong $(a^u)\' = u\' a^u \\ln a$ và chia $\\ln a$ trong $(\\log_a u)\' = \\frac{u\'}{u \\ln a}$.'
    ],
    theory: [
      '1. Chiều biến thiên: Với $a > 1$: cả $y = a^x$ và $y = \\log_a x$ đều đồng biến. Với $0 < a < 1$: cả hai hàm đều nghịch biến.',
      '2. Đạo hàm: $(e^x)\' = e^x$; $(a^x)\' = a^x \\ln a$; $(\\ln x)\' = \\frac{1}{x}$; $(\\log_a x)\' = \\frac{1}{x \\ln a}$.'
    ],
    keyFormulas: [
      '(a^u)\' = u\' a^u \\ln a, \\quad (e^u)\' = u\' e^u',
      '(\\log_a u)\' = \\frac{u\'}{u \\ln a}, \\quad (\\ln u)\' = \\frac{u\'}{u}'
    ],
    flashcards: [
      { front: 'Đạo hàm của $y = \\ln(x^2 + 1)$ là?', back: '$y\' = \\frac{2x}{x^2 + 1}$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 4',
        question: 'Tập xác định của hàm số $y = \\log_2(x^2 - 4x + 3)$ là:',
        options: [
          'A. $(-\\infty; 1) \\cup (3; +\\infty)$',
          'B. $(1; 3)$',
          'C. $(-\\infty; 1] \\cup [3; +\\infty)$',
          'D. $\\mathbb{R} \\setminus \\{1; 3\\}$'
        ],
        correctIndex: 0,
        explanation: 'Biểu thức trong logarit phải dương: $x^2 - 4x + 3 > 0 \\iff x < 1$ hoặc $x > 3$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Bài toán lãi suất',
        question: 'Anh Nam gửi $100$ triệu đồng tiết kiệm với lãi suất kép $6\\%$/năm. Hỏi sau ít nhất bao nhiêu năm thì số tiền thu được vượt quá $150$ triệu đồng?',
        hints: ['Dùng công thức lãi kép $T_n = A(1 + r)^n > 150$.'],
        solutionSteps: [
          'Bước 1: $100(1 + 0{,}06)^n > 150 \\iff 1{,}06^n > 1{,}5$.',
          'Bước 2: Lấy lôgarit: $n > \\log_{1{,}06}(1{,}5) \\approx 6{,}96$. Vì $n$ nguyên dương nên ít nhất $7$ năm.'
        ],
        finalAnswer: '$7$ năm.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'exponential', params: { a: 2, b: 1, c: 0, d: 0 }, color: '#0284c7', name: 'y = 2^x' }
  },
  {
    id: 'math-2006-12-9',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 9,
    stageLabel: 'Toán 12 (2006) · GT Chương II: Lũy thừa – Mũ – Lôgarit',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 5',
    title: 'Bài 9 (2006): Phương trình Mũ & Phương trình Lôgarit',
    grade: 'Lớp 12 · Lượng giác & Mũ',
    category: 'Lượng giác & Mũ',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description:
      '4 phương pháp giải phương trình mũ và lôgarit: đưa về cùng cơ số, đặt ẩn phụ ($t = a^x > 0$ hoặc $t = \\log_a x$), lôgarit hóa hai vế và phương pháp hàm số đơn điệu.',
    mnemonics: [
      'Khi đặt $t = a^x$ bắt buộc có điều kiện $t > 0$.',
      'Giải phương trình $\\log_a f(x) + \\log_a g(x) = c$, BẮT BUỘC đặt ĐKXĐ $f(x) > 0, g(x) > 0$ TRƯỚC KHI gộp thành $\\log_a(fg)$!'
    ],
    commonTraps: [
      'Gộp $\\log_2(x-1) + \\log_2(x+1) = \\log_2(x^2-1)$ mà quên điều kiện $x > 1$, nhận nhầm nghiệm âm.'
    ],
    theory: [
      '1. Phương trình cơ bản: $a^{f(x)} = b\\ (b > 0) \\iff f(x) = \\log_a b$. $\\log_a f(x) = b \\iff f(x) = a^b$ (luôn $> 0$).',
      '2. Phương pháp đặt ẩn phụ: Với $m a^{2x} + n a^x + p = 0$ đặt $t = a^x > 0$; hoặc đặt $t = \\log_a x \\in \\mathbb{R}$.'
    ],
    keyFormulas: [
      'a^{f(x)} = b \\ (b > 0) \\iff f(x) = \\log_a b',
      '\\log_a f(x) = \\log_a g(x) \\iff \\begin{cases} f(x) > 0 \\text{ (hoặc } g(x) > 0\\text{)} \\\\ f(x) = g(x) \\end{cases}'
    ],
    flashcards: [
      { front: 'Phương trình $4^x - 6\\cdot 2^x + 8 = 0$ có tích hai nghiệm bằng?', back: '$t = 2^x > 0$: $t^2 - 6t + 8 = 0 \\Rightarrow t = 2, 4 \\Rightarrow x = 1, 2$. Tích $1\\cdot 2 = 2$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 5',
        question: 'Nghiệm của phương trình $\\log_3(2x - 1) = 2$ là:',
        options: ['A. $x = 5$', 'B. $x = 4{,}5$', 'C. $x = 4$', 'D. $x = \\frac{7}{2}$'],
        correctIndex: 0,
        explanation: '$2x - 1 = 3^2 = 9 \\iff 2x = 10 \\iff x = 5$ (thỏa ĐK $2x - 1 > 0$).'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Phương trình tích mũ',
        question: 'Giải phương trình $9^x - 4\\cdot 3^x + 3 = 0$.',
        hints: ['Đặt $t = 3^x > 0$.'],
        solutionSteps: [
          'Bước 1: Đặt $t = 3^x > 0$, phương trình trở thành $t^2 - 4t + 3 = 0$.',
          'Bước 2: Giải được $t = 1$ (nhận) hoặc $t = 3$ (nhận).',
          'Bước 3: $3^x = 1 \\iff x = 0$; $3^x = 3 \\iff x = 1$.'
        ],
        finalAnswer: '$x \\in \\{0; 1\\}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'exponential', params: { a: 3, b: 1, c: 0, d: 0 }, color: '#059669', name: 'y = 3^x' }
  },
  {
    id: 'math-2006-12-10',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 10,
    stageLabel: 'Toán 12 (2006) · GT Chương II: Lũy thừa – Mũ – Lôgarit',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 6',
    title: 'Bài 10 (2006): Bất phương trình Mũ & Bất phương trình Lôgarit',
    grade: 'Lớp 12 · Lượng giác & Mũ',
    category: 'Lượng giác & Mũ',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Quy tắc giữ chiều hay đảo chiều bất đẳng thức khi bỏ cơ số mũ/lôgarit ($a > 1$ giữ nguyên chiều, $0 < a < 1$ ĐỔI CHIỀU) và lưu ý bắt buộc đặt điều kiện biểu thức dưới dấu $\\log$ dương.',
    mnemonics: [
      'Cơ số $a > 1$: **Giữ chiều**. Cơ số $0 < a < 1$: **Đổi chiều**!',
      'Giải $\\log_a f(x) < b$ khi $0 < a < 1$: ngoài đổi chiều $f(x) > a^b$ còn phải nhớ trường hợp chiều ngược lại $\\log_a f(x) > b \\iff 0 < f(x) < a^b$!'
    ],
    commonTraps: [
      'Quên đổi chiều bất phương trình khi cơ số $a \\in (0; 1)$ như $\\left(\\frac{1}{2}\\right)^x$ hoặc $\\log_{0{,}5} x$.',
      'Quên chặn dưới $f(x) > 0$ khi giải $\\log_a f(x) < b$ với $a > 1$.'
    ],
    theory: [
      '1. Bất phương trình mũ cơ bản: $a^{f(x)} > a^{g(x)}$ tương đương $f(x) > g(x)$ nếu $a > 1$; và $f(x) < g(x)$ nếu $0 < a < 1$.',
      '2. Bất phương trình lôgarit: Với $a > 1$: $\\log_a f(x) > \\log_a g(x) \\iff f(x) > g(x) > 0$. Với $0 < a < 1$: $\\log_a f(x) > \\log_a g(x) \\iff 0 < f(x) < g(x)$.'
    ],
    keyFormulas: [
      'a > 1: \\log_a f(x) < b \\iff 0 < f(x) < a^b',
      '0 < a < 1: \\log_a f(x) < b \\iff f(x) > a^b'
    ],
    flashcards: [
      { front: 'Tập nghiệm của $\\log_{\\frac{1}{2}}(x - 1) \\ge -2$?', back: 'Cơ số $1/2 < 1 \\Rightarrow 0 < x - 1 \\le (1/2)^{-2} = 4 \\iff 1 < x \\le 5$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 6',
        question: 'Tập nghiệm của bất phương trình $\\log_2(3x - 2) < 3$ là:',
        options: ['A. $\\left(\\frac{2}{3}; \\frac{10}{3}\\right)$', 'B. $\\left(-\\infty; \\frac{10}{3}\\right)$', 'C. $\\left(\\frac{10}{3}; +\\infty\\right)$', 'D. $\\left[\\frac{2}{3}; \\frac{10}{3}\\right)$'],
        correctIndex: 0,
        explanation: 'Cơ số $2 > 1$: $0 < 3x - 2 < 2^3 = 8 \\iff 2 < 3x < 10 \\iff \\frac{2}{3} < x < \\frac{10}{3}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Bất phương trình mũ cơ số nhỏ hơn 1',
        question: 'Giải bất phương trình $\\left(\\frac{1}{3}\\right)^{x^2 - 2x} \\ge \\frac{1}{27}$.',
        hints: ['Viết $\\frac{1}{27} = \\left(\\frac{1}{3}\\right)^3$ và ĐỔI CHIỀU bất phương trình vì cơ số $\\frac{1}{3} < 1$.'],
        solutionSteps: [
          'Bước 1: Vì $0 < \\frac{1}{3} < 1$, bất phương trình tương đương $x^2 - 2x \\le 3$.',
          'Bước 2: $x^2 - 2x - 3 \\le 0 \\iff -1 \\le x \\le 3$.'
        ],
        finalAnswer: '$S = [-1; 3]$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'logarithmic', params: { a: 2, b: 3, c: -2, d: 0 }, color: '#0d9488', name: 'y = log₂(3x - 2)' }
  },
  // ==================== GIẢI TÍCH 12 · CHƯƠNG III: NGUYÊN HÀM - TÍCH PHÂN & ỨNG DỤNG ====================
  {
    id: 'math-2006-12-11',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 11,
    stageLabel: 'Toán 12 (2006) · GT Chương III: Nguyên hàm – Tích phân & Ứng dụng',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 1',
    title: 'Bài 11 (2006): Nguyên hàm & Các phương pháp tìm Nguyên hàm',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description:
      'Định nghĩa nguyên hàm, bảng nguyên hàm chuẩn và hàm hợp bậc nhất $(ax+b)$ (chia thêm $\\frac{1}{a}$), phương pháp đổi biến số và phương pháp nguyên hàm từng phần.',
    mnemonics: [
      'Nguyên hàm mở rộng $f(ax+b)$ luôn nhớ chia $\\frac{1}{a}$: $\\int e^{ax+b}dx = \\frac{1}{a}e^{ax+b} + C$.',
      'Nguyên hàm từng phần $\\int u\\,dv = uv - \\int v\\,du$: ưu tiên đặt $u$ theo **Nhất lô – Nhì đa – Tam lượng – Tứ mũ**.'
    ],
    commonTraps: [
      'Quên hằng số $+ C$ hoặc quên trị tuyệt đối trong $\\int \\frac{dx}{x} = \\ln|x| + C$.',
      'Nhầm dấu nguyên hàm $\\int \\sin x\\,dx = -\\cos x + C$ với đạo hàm.'
    ],
    theory: [
      '1. Bảng nguyên hàm cơ bản: $\\int x^\\alpha dx = \\frac{x^{\\alpha+1}}{\\alpha+1} + C\\ (\\alpha \\neq -1)$; $\\int \\frac{dx}{x} = \\ln|x| + C$; $\\int e^x dx = e^x + C$; $\\int \\cos x dx = \\sin x + C$; $\\int \\sin x dx = -\\cos x + C$; $\\int \\frac{dx}{\\cos^2 x} = \\tan x + C$.',
      '2. Phương pháp đổi biến & Từng phần: Đổi biến $t = u(x) \\Rightarrow dt = u\'(x)dx$. Từng phần: $\\int u\\,dv = uv - \\int v\\,du$.'
    ],
    keyFormulas: [
      '\\int f(ax+b)\\,dx = \\frac{1}{a}F(ax+b) + C',
      '\\int u\\,dv = uv - \\int v\\,du'
    ],
    flashcards: [
      { front: 'Tìm nguyên hàm $\\int (2x + \\cos 3x)\\,dx$?', back: '$x^2 + \\frac{1}{3}\\sin 3x + C$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 1',
        question: 'Họ nguyên hàm của hàm số $f(x) = e^{2x} + \\frac{1}{x}$ trên $(0; +\\infty)$ là:',
        options: [
          'A. $\\frac{1}{2}e^{2x} + \\ln x + C$',
          'B. $2e^{2x} + \\ln x + C$',
          'C. $\\frac{1}{2}e^{2x} - \\frac{1}{x^2} + C$',
          'D. $e^{2x} + \\ln x + C$'
        ],
        correctIndex: 0,
        explanation: '$\\int e^{2x}dx = \\frac{1}{2}e^{2x} + C$ và trên $(0; +\\infty)$ thì $\\ln|x| = \\ln x$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Tìm nguyên hàm thỏa điều kiện',
        question: 'Tìm một nguyên hàm $F(x)$ của $f(x) = x\\cos x$ biết $F(0) = 2$.',
        hints: ['Dùng nguyên hàm từng phần đặt $u = x, dv = \\cos x\\,dx$.'],
        solutionSteps: [
          'Bước 1: Đặt $u = x \\Rightarrow du = dx$; $dv = \\cos x\\,dx \\Rightarrow v = \\sin x$.',
          'Bước 2: $F(x) = x\\sin x - \\int \\sin x\\,dx = x\\sin x + \\cos x + C$.',
          'Bước 3: $F(0) = 0 + 1 + C = 2 \\iff C = 1$.'
        ],
        finalAnswer: '$F(x) = x\\sin x + \\cos x + 1$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'integral_disks_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: 1, b: 0, c: 0, d: 0 }, color: '#059669', name: 'Nguyên hàm ∫x²dx = x³/3', showIntegral: true, integralA: 0, integralB: 2 }
  },
  {
    id: 'math-2006-12-12',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 12,
    stageLabel: 'Toán 12 (2006) · GT Chương III: Nguyên hàm – Tích phân & Ứng dụng',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 2',
    title: 'Bài 12 (2006): Tích phân xác định & Công thức Newton–Leibniz',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description:
      'Định nghĩa tích phân qua hình thang cong, công thức Newton–Leibniz $\\int_a^b f(x)\\,dx = F(b) - F(a)$, tính chất tách cận và phương pháp đổi biến số – tích phân từng phần.',
    mnemonics: [
      'Đổi biến trong tích phân xác định: **Nhớ đổi cận** $x = a \\to t = u(a)$ và $x = b \\to t = u(b)$, không phải trả lại biến cũ!',
      'Tích phân hàm lẻ trên đoạn đối xứng $[-a; a]$ bằng $0$; hàm chẵn bằng $2\\int_0^a f(x)dx$.'
    ],
    commonTraps: [
      'Đổi biến $t = u(x)$ nhưng quên đổi hai cận tích phân!'
    ],
    theory: [
      '1. Công thức Newton–Leibniz: Nếu $F(x)$ là một nguyên hàm của $f(x)$ liên tục trên $[a; b]$ thì $\\int_a^b f(x)\\,dx = F(b) - F(a)$.',
      '2. Tính chất: $\\int_a^b f(x)dx = -\\int_b^a f(x)dx$; $\\int_a^b f(x)dx = \\int_a^c f(x)dx + \\int_c^b f(x)dx$; tích phân không phụ thuộc tên biến tích phân.'
    ],
    keyFormulas: [
      '\\int_a^b f(x)\\,dx = F(x)\\Big|_a^b = F(b) - F(a)',
      '\\int_a^b f(x)\\,dx = \\int_a^c f(x)\\,dx + \\int_c^b f(x)\\,dx'
    ],
    flashcards: [
      { front: 'Cho $\\int_0^2 f(x)\\,dx = 5$ và $\\int_2^5 f(x)\\,dx = -2$. Tính $\\int_0^5 f(x)\\,dx$?', back: '$5 + (-2) = 3$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 2',
        question: 'Giá trị của tích phân $I = \\int_1^e \\frac{1 + \\ln x}{x}\\,dx$ bằng:',
        options: ['A. $\\frac{3}{2}$', 'B. $\\frac{1}{2}$', 'C. $2$', 'D. $1$'],
        correctIndex: 0,
        explanation: 'Đặt $t = 1 + \\ln x \\Rightarrow dt = \\frac{dx}{x}$; cận $x=1 \\to t=1$, $x=e \\to t=2$. $I = \\int_1^2 t\\,dt = \\frac{t^2}{2}\\Big|_1^2 = \\frac{4-1}{2} = \\frac{3}{2}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Tích phân từng phần',
        question: 'Tính tích phân $I = \\int_1^e x \\ln x\\,dx$.',
        hints: ['Đặt $u = \\ln x \\Rightarrow du = \\frac{dx}{x}$; $dv = x\\,dx \\Rightarrow v = \\frac{x^2}{2}$.'],
        solutionSteps: [
          'Bước 1: $u = \\ln x \\Rightarrow du = \\frac{1}{x}dx$; $dv = x\\,dx \\Rightarrow v = \\frac{x^2}{2}$.',
          'Bước 2: $I = \\left.\\frac{x^2}{2}\\ln x\\right|_1^e - \\int_1^e \\frac{x}{2}\\,dx = \\frac{e^2}{2} - \\left.\\frac{x^2}{4}\\right|_1^e = \\frac{e^2}{2} - \\left(\\frac{e^2}{4} - \\frac{1}{4}\\right) = \\frac{e^2 + 1}{4}$.'
        ],
        finalAnswer: '$I = \\frac{e^2 + 1}{4}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'integral_disks_3d',
    defaultGraphConfig: { type: 'linear', params: { a: 1, b: 1, c: 0, d: 0 }, color: '#0284c7', name: 'Tích phân xác định', showIntegral: true, integralA: 0, integralB: 3 }
  },
  {
    id: 'math-2006-12-13',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 13,
    stageLabel: 'Toán 12 (2006) · GT Chương III: Nguyên hàm – Tích phân & Ứng dụng',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 3',
    title: 'Bài 13 (2006): Ứng dụng Tích phân tính Diện tích & Thể tích tròn xoay',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description:
      'Tính diện tích hình phẳng giới hạn bởi các đường cong, thể tích vật thể theo mặt cắt $S(x)$ và thể tích khối tròn xoay quay quanh trục $Ox$.',
    mnemonics: [
      'Diện tích hình phẳng: $S = \\int_a^b |f(x) - g(x)|\\,dx$ (KHÔNG có $\\pi$, PHẢI có trị tuyệt đối).',
      'Thể tích tròn xoay quanh $Ox$: $V = \\pi \\int_a^b [f(x)]^2\\,dx$ (LUÔN CÓ $\\pi$ và bình phương!).'
    ],
    commonTraps: [
      'Quên $\\pi$ khi tính thể tích tròn xoay hoặc viết sai thành $\\pi \\int_a^b [f(x) - g(x)]^2 dx$ (khi giới hạn bởi hai đường cùng phía $Ox$ phải là $\\pi \\int_a^b |f^2(x) - g^2(x)| dx$!).'
    ],
    theory: [
      '1. Diện tích hình phẳng: Giới hạn bởi $y = f(x), y = g(x), x = a, x = b$ là $S = \\int_a^b |f(x) - g(x)|\\,dx$. Nếu đề chưa cho $a, b$, giải $f(x) = g(x)$ lấy nghiệm nhỏ nhất và lớn nhất làm cận.',
      '2. Thể tích: Vật thể có diện tích thiết diện $S(x)$ vuông góc $Ox$: $V = \\int_a^b S(x)\\,dx$. Khối tròn xoay quay hình phẳng quanh $Ox$: $V = \\pi \\int_a^b [f(x)]^2\\,dx$.'
    ],
    keyFormulas: [
      'S = \\int_a^b |f(x) - g(x)|\\,dx',
      'V_{Ox} = \\pi \\int_a^b f^2(x)\\,dx, \\quad V_{\\text{thiết diện}} = \\int_a^b S(x)\\,dx'
    ],
    flashcards: [
      { front: 'Quay hình phẳng giới hạn bởi $y = \\sqrt{x}$, $y = 0$, $x = 0, x = 4$ quanh $Ox$ được thể tích bằng?', back: '$V = \\pi \\int_0^4 (\\sqrt{x})^2 dx = \\pi \\left.\\frac{x^2}{2}\\right|_0^4 = 8\\pi$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 3',
        question: 'Diện tích hình phẳng giới hạn bởi hai đồ thị $y = x^2$ và $y = 2x$ là:',
        options: ['A. $\\frac{4}{3}$', 'B. $\\frac{8}{3}$', 'C. $2$', 'D. $\\frac{4\\pi}{3}$'],
        correctIndex: 0,
        explanation: 'Hoành độ giao điểm $x^2 = 2x \\iff x = 0$ hoặc $x = 2$. $S = \\int_0^2 |x^2 - 2x|\\,dx = \\left|\\frac{x^3}{3} - x^2\\right|_0^2 = \\frac{4}{3}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Thể tích tròn xoay',
        question: 'Tính thể tích khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi $y = x^2$, $y = 0$, $x = 0, x = 2$ quanh trục $Ox$.',
        hints: ['Áp dụng $V = \\pi \\int_0^2 (x^2)^2\\,dx$.'],
        solutionSteps: [
          'Bước 1: $V = \\pi \\int_0^2 x^4\\,dx$.',
          'Bước 2: $V = \\pi \\left.\\frac{x^5}{5}\\right|_0^2 = \\frac{32\\pi}{5}$.'
        ],
        finalAnswer: '$V = \\frac{32\\pi}{5}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'integral_disks_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: 1, b: 0, c: 0, d: 0 }, color: '#0d9488', name: 'y = x² (Quay quanh Ox)', showIntegral: true, integralA: 0, integralB: 2 }
  },
  // ==================== GIẢI TÍCH 12 · CHƯƠNG IV: SỐ PHỨC (CHƯƠNG ĐẶC TRƯNG GDPT 2006) ====================
  {
    id: 'math-2006-12-14',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 14,
    stageLabel: 'Toán 12 (2006) · GT Chương IV: Số phức (Đặc trưng 2006)',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 1–2',
    title: 'Bài 14 (2006): Số phức z = a + bi, Môđun & Phép Cộng – Trừ – Nhân',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      'Đơn vị ảo $i^2 = -1$, phần thực $a$, phần ảo $b$, biểu diễn hình học $M(a; b)$, số phức liên hợp $\\bar{z} = a - bi$, môđun $|z| = \\sqrt{a^2 + b^2}$ và phép cộng – trừ – nhân.',
    mnemonics: [
      'Phần ảo của $z = a + bi$ là SỐ THỰC $b$, KHÔNG viết chữ $i$!',
      'Hai số phức bằng nhau $\\iff$ Phần thực bằng phần thực và Phần ảo bằng phần ảo.'
    ],
    commonTraps: [
      'Chọn phần ảo của $z = 5 - 3i$ là $-3i$ (SAI! Đúng là $-3$).'
    ],
    theory: [
      '1. Số phức $z = a + bi\\ (a, b \\in \\mathbb{R}, i^2 = -1)$: $a$ là phần thực, $b$ là phần ảo. Số phức liên hợp $\\bar{z} = a - bi$. Môđun $|z| = \\sqrt{a^2 + b^2}$ (chính là khoảng cách $OM$).',
      '2. Tính chất: $z \\cdot \\bar{z} = a^2 + b^2 = |z|^2$; $|z_1 z_2| = |z_1||z_2|$; $|\\bar{z}| = |z|$. Biểu diễn hình học $z = a + bi \\leftrightarrow$ điểm $M(a; b)$.'
    ],
    keyFormulas: [
      'i^2 = -1, \\quad |z| = \\sqrt{a^2 + b^2}, \\quad \\bar{z} = a - bi',
      'z\\cdot\\bar{z} = |z|^2'
    ],
    flashcards: [
      { front: 'Tính $i^{2026}$?', back: '$2026 = 4\\cdot 506 + 2 \\Rightarrow i^{2026} = (i^4)^{506} \\cdot i^2 = -1$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 1–2',
        question: 'Số phức liên hợp và môđun của $z = (2 - i)(1 + 3i)$ lần lượt là:',
        options: ['A. $\\bar{z} = 5 - 5i,\\ |z| = 5\\sqrt{2}$', 'B. $\\bar{z} = 5 + 5i,\\ |z| = 5$', 'C. $\\bar{z} = -1 - 5i,\\ |z| = \\sqrt{26}$', 'D. $\\bar{z} = 5 - 5i,\\ |z| = 50$'],
        correctIndex: 0,
        explanation: '$z = 2 + 6i - i - 3i^2 = 5 + 5i \\Rightarrow \\bar{z} = 5 - 5i$ và $|z| = \\sqrt{5^2 + 5^2} = 5\\sqrt{2}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Tập hợp điểm biểu diễn số phức',
        question: 'Tìm tập hợp điểm biểu diễn số phức $z = x + yi$ thỏa mãn $|z - 1 + 2i| = 3$.',
        hints: ['Thay $z = x + yi$, tính môđun $\\sqrt{(x-1)^2 + (y+2)^2} = 3$.'],
        solutionSteps: [
          'Bước 1: $z - 1 + 2i = (x - 1) + (y + 2)i$.',
          'Bước 2: $|z - 1 + 2i| = 3 \\iff \\sqrt{(x - 1)^2 + (y + 2)^2} = 3 \\iff (x - 1)^2 + (y + 2)^2 = 9$.'
        ],
        finalAnswer: 'Đường tròn tâm $I(1; -2)$, bán kính $R = 3$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  {
    id: 'math-2006-12-15',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 15,
    stageLabel: 'Toán 12 (2006) · GT Chương IV: Số phức (Đặc trưng 2006)',
    sourceTag: 'SGK Giải tích 12 (2006) · Bài 3–4',
    title: 'Bài 15 (2006): Phép chia Số phức & Phương trình bậc hai trên ℂ',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Phép chia số phức $\\frac{z_1}{z_2}$ bằng nhân liên hợp, căn bậc hai của số thực âm và công thức nghiệm phức của phương trình bậc hai $az^2 + bz + c = 0$ khi $\\Delta < 0$.',
    mnemonics: [
      'Chia cho số phức $z_2 \\neq 0$: nhân cả tử và mẫu với $\\bar{z}_2$ (mẫu biến thành số thực $|z_2|^2$).',
      'Khi $\\Delta < 0$, phương trình bậc hai hệ số thực luôn có 2 nghiệm phức liên hợp nhau: $z_{1,2} = \\frac{-b \\pm i\\sqrt{|\\Delta|}}{2a}$.'
    ],
    commonTraps: [
      'Quên đổi dấu $i^2 = -1$ khi tính $(a + bi)(a - bi) = a^2 + b^2$ (dễ nhầm thành $a^2 - b^2$).'
    ],
    theory: [
      '1. Phép chia: Với $z_2 \\neq 0$: $\\frac{z_1}{z_2} = \\frac{z_1 \\cdot \\bar{z}_2}{z_2 \\cdot \\bar{z}_2} = \\frac{z_1 \\cdot \\bar{z}_2}{|z_2|^2}$.',
      '2. Phương trình bậc hai $az^2 + bz + c = 0$ ($a, b, c \\in \\mathbb{R}, a \\neq 0$): Nếu $\\Delta < 0$, phương trình có hai nghiệm phức là $z_{1,2} = \\frac{-b \\pm i\\sqrt{-\\Delta}}{2a}$. Hệ thức Vi-ét $z_1 + z_2 = -\\frac{b}{a}, z_1 z_2 = \\frac{c}{a}$ vẫn đúng trên $\\mathbb{C}$.'
    ],
    keyFormulas: [
      '\\frac{z_1}{z_2} = \\frac{z_1 \\bar{z}_2}{|z_2|^2}, \\quad z_{1,2} = \\frac{-b \\pm i\\sqrt{|\\Delta|}}{2a} \\ (\\Delta < 0)'
    ],
    flashcards: [
      { front: 'Thực hiện phép chia $\\frac{3 + i}{1 - i}$?', back: '$\\frac{(3+i)(1+i)}{1^2 + 1^2} = \\frac{3 + 4i - 1}{2} = 1 + 2i$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 12 (2006) · Bài 4',
        question: 'Gọi $z_1, z_2$ là hai nghiệm phức của $z^2 - 4z + 13 = 0$. Giá trị $|z_1| + |z_2|$ bằng:',
        options: ['A. $2\\sqrt{13}$', 'B. $26$', 'C. $4$', 'D. $\\sqrt{13}$'],
        correctIndex: 0,
        explanation: '$\\Delta\' = 4 - 13 = -9 = (3i)^2 \\Rightarrow z_{1,2} = 2 \\pm 3i$. $|z_1| = |z_2| = \\sqrt{4+9} = \\sqrt{13} \\Rightarrow$ Tổng $= 2\\sqrt{13}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 12 (2006) · Tìm số phức thỏa phương trình',
        question: 'Tìm số phức $z$ thỏa mãn $(1 + 2i)z - 3 + 4i = 2z - 1$.',
        hints: ['Chuyển $z$ về một vế, hệ số tự do về vế kia rồi thực hiện phép chia số phức.'],
        solutionSteps: [
          'Bước 1: $(1 + 2i - 2)z = 2 - 4i \\iff (-1 + 2i)z = 2 - 4i$.',
          'Bước 2: $z = \\frac{2 - 4i}{-1 + 2i} = \\frac{-2(-1 + 2i)}{-1 + 2i} = -2$.'
        ],
        finalAnswer: '$z = -2$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  // ==================== HÌNH HỌC 12 · CHƯƠNG I & II: KHỐI ĐA DIỆN & MẶT TRÒN XOAY ====================
  {
    id: 'math-2006-12-16',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 16,
    stageLabel: 'Toán 12 (2006) · HH Chương I–II: Khối đa diện & Mặt tròn xoay',
    sourceTag: 'SGK Hình học 12 (2006) · Chương I',
    title: 'Bài 16 (2006): Khối đa diện & Thể tích Khối chóp – Khối lăng trụ',
    grade: 'Lớp 12 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description:
      'Khái niệm khối đa diện lồi, 5 khối đa diện đều ($\{3;3\}, \{4;3\}, \{3;4\}, \{5;3\}, \{3;5\}$), công thức thể tích khối chóp $V = \\frac{1}{3}B h$, lăng trụ $V = B h$ và tỉ số thể tích Simson.',
    mnemonics: [
      'Thể tích chóp CÓ $\\frac{1}{3}$; thể tích lăng trụ KHÔNG CÓ $\\frac{1}{3}$.',
      'Tam giác đều cạnh $a$: $h = \\frac{a\\sqrt{3}}{2}$, $S = \\frac{a^2\\sqrt{3}}{4}$. Tứ diện đều cạnh $a$: $V = \\frac{a^3\\sqrt{2}}{12}$.'
    ],
    commonTraps: [
      'Quên nhân $\\frac{1}{3}$ trong thể tích khối chóp, hoặc dùng $S_{\\text{đáy}}$ là chu vi.'
    ],
    theory: [
      '1. Thể tích khối đa diện: Khối chóp diện tích đáy $B$, chiều cao $h$: $V = \\frac{1}{3}B\\cdot h$. Khối lăng trụ: $V = B\\cdot h$ (khối hộp chữ nhật $V = abc$, lập phương $V = a^3$).',
      '2. Tỉ số thể tích khối chóp tam giác: Với $A\', B\', C\'$ nằm trên các tia $SA, SB, SC$: $\\frac{V_{S.A\'B\'C\'}}{V_{S.ABC}} = \\frac{SA\'}{SA}\\cdot\\frac{SB\'}{SB}\\cdot\\frac{SC\'}{SC}$.'
    ],
    keyFormulas: [
      'V_{\\text{chóp}} = \\frac{1}{3}Bh, \\quad V_{\\text{lăng trụ}} = Bh',
      '\\frac{V_{S.A\'B\'C\'}}{V_{S.ABC}} = \\frac{SA\'}{SA}\\cdot\\frac{SB\'}{SB}\\cdot\\frac{SC\'}{SC}'
    ],
    flashcards: [
      { front: 'Khối lăng trụ đứng tam giác đều tất cả các cạnh bằng $a$ có thể tích bằng?', back: '$V = B\\cdot h = \\frac{a^2\\sqrt{3}}{4}\\cdot a = \\frac{a^3\\sqrt{3}}{4}$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 12 (2006) · Chương I',
        question: 'Cho hình chóp $S.ABCD$ có đáy là hình vuông cạnh $a$, $SA \\perp (ABCD)$ và $SC$ tạo với đáy góc $45^\\circ$. Thể tích khối chóp là:',
        options: ['A. $\\frac{a^3\\sqrt{2}}{3}$', 'B. $a^3\\sqrt{2}$', 'C. $\\frac{a^3}{3}$', 'D. $\\frac{a^3\\sqrt{3}}{3}$'],
        correctIndex: 0,
        explanation: '$AC = a\\sqrt{2}$. Góc $(SC, (ABCD)) = \\widehat{SCA} = 45^\\circ \\Rightarrow SA = AC = a\\sqrt{2}$. $V = \\frac{1}{3}a^2\\cdot a\\sqrt{2} = \\frac{a^3\\sqrt{2}}{3}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 12 (2006) · Tỉ số thể tích',
        question: 'Cho hình chóp $S.ABC$ có thể tích $V = 24$. Gọi $M, N$ lần lượt là trung điểm $SB, SC$. Tính thể tích khối chóp $S.AMN$.',
        hints: ['Áp dụng công thức tỉ số thể tích với $A\' \\equiv A, B\' \\equiv M, C\' \\equiv N$.'],
        solutionSteps: [
          'Bước 1: $\\frac{V_{S.AMN}}{V_{S.ABC}} = \\frac{SA}{SA}\\cdot\\frac{SM}{SB}\\cdot\\frac{SN}{SC} = 1\\cdot\\frac{1}{2}\\cdot\\frac{1}{2} = \\frac{1}{4}$.',
          'Bước 2: $V_{S.AMN} = \\frac{1}{4}\\cdot 24 = 6$.'
        ],
        finalAnswer: '$V_{S.AMN} = 6$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  {
    id: 'math-2006-12-17',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 17,
    stageLabel: 'Toán 12 (2006) · HH Chương I–II: Khối đa diện & Mặt tròn xoay',
    sourceTag: 'SGK Hình học 12 (2006) · Chương II · Bài 1',
    title: 'Bài 17 (2006): Mặt Nón – Mặt Trụ tròn xoay & Thiết diện qua trục',
    grade: 'Lớp 12 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Mặt nón, khối nón ($l^2 = h^2 + R^2$), thiết diện qua trục hình nón/trụ, thiết diện qua đỉnh hình nón và đầy đủ công thức diện tích xung quanh – toàn phần – thể tích.',
    mnemonics: [
      'Hình trụ: $l = h$, thiết diện qua trục là hình chữ nhật kích thước $2R \\times h$.',
      'Hình nón: $l = \\sqrt{R^2 + h^2}$, thiết diện qua trục là tam giác cân cạnh đáy $2R$, cạnh bên $l$.'
    ],
    commonTraps: [
      'Nhầm bán kính đáy $R$ với đường kính đáy $2R$ khi đọc kích thước thiết diện qua trục.'
    ],
    theory: [
      '1. Hình nón (bán kính đáy $R$, đường cao $h$, đường sinh $l = \\sqrt{R^2 + h^2}$): $S_{xq} = \\pi R l$; $S_{tp} = \\pi R l + \\pi R^2$; $V = \\frac{1}{3}\\pi R^2 h$.',
      '2. Hình trụ (bán kính đáy $R$, đường cao $h = l$): $S_{xq} = 2\\pi R h$; $S_{tp} = 2\\pi R h + 2\\pi R^2$; $V = \\pi R^2 h$.'
    ],
    keyFormulas: [
      'S_{xq\\text{ nón}} = \\pi R l, \\quad V_{\\text{nón}} = \\frac{1}{3}\\pi R^2 h',
      'S_{xq\\text{ trụ}} = 2\\pi R h, \\quad V_{\\text{trụ}} = \\pi R^2 h'
    ],
    flashcards: [
      { front: 'Quay tam giác vuông $ABC$ vuông tại $A$ có $AB = 3, AC = 4$ quanh cạnh góc vuông $AB$ được khối nón có thể tích?', back: 'Trục quay $h = AB = 3$, bán kính đáy $R = AC = 4 \\Rightarrow V = \\frac{1}{3}\\pi\\cdot 4^2\\cdot 3 = 16\\pi$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 12 (2006) · Chương II',
        question: 'Thiết diện qua trục của một hình nón là tam giác đều cạnh $2a$. Thể tích của khối nón đó là:',
        options: ['A. $\\frac{\\pi a^3\\sqrt{3}}{3}$', 'B. $\\pi a^3\\sqrt{3}$', 'C. $\\frac{2\\pi a^3\\sqrt{3}}{3}$', 'D. $\\frac{\\pi a^3}{3}$'],
        correctIndex: 0,
        explanation: 'Thiết diện là tam giác đều cạnh $2a \\Rightarrow R = a, l = 2a \\Rightarrow h = a\\sqrt{3}$. $V = \\frac{1}{3}\\pi a^2 (a\\sqrt{3}) = \\frac{\\pi a^3\\sqrt{3}}{3}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 12 (2006) · Hình trụ ngoại tiếp lăng trụ',
        question: 'Tính thể tích khối trụ có thiết diện qua trục là hình vuông cạnh $4a$.',
        hints: ['Hình vuông cạnh $4a \\Rightarrow h = 4a$ và đường kính $2R = 4a$.'],
        solutionSteps: [
          'Bước 1: $2R = 4a \\Rightarrow R = 2a$; chiều cao $h = 4a$.',
          'Bước 2: $V = \\pi R^2 h = \\pi (2a)^2 (4a) = 16\\pi a^3$.'
        ],
        finalAnswer: '$V = 16\\pi a^3$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'revolution_solid'
  },
  {
    id: 'math-2006-12-18',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 18,
    stageLabel: 'Toán 12 (2006) · HH Chương I–II: Khối đa diện & Mặt tròn xoay',
    sourceTag: 'SGK Hình học 12 (2006) · Chương II · Bài 2',
    title: 'Bài 18 (2006): Mặt Cầu & Bán kính Mặt cầu ngoại tiếp Khối đa diện',
    grade: 'Lớp 12 · Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 20,
    description:
      'Vị trí tương đối mặt phẳng với mặt cầu ($r = \\sqrt{R^2 - d^2}$), diện tích $S = 4\\pi R^2$, thể tích $V = \\frac{4}{3}\\pi R^3$ và các công thức tính nhanh bán kính mặt cầu ngoại tiếp chóp/lăng trụ.',
    mnemonics: [
      'Chóp có cạnh bên $SA \\perp$ đáy: $R = \\sqrt{R_{\\text{đáy}}^2 + \\left(\\frac{SA}{2}\\right)^2}$.',
      'Hình hộp chữ nhật $a\\times b\\times c$: $R = \\frac{1}{2}\\sqrt{a^2 + b^2 + c^2}$.'
    ],
    commonTraps: [
      'Quên chia $2$ chiều cao $SA$ trong công thức $R^2 = R_{\\text{đáy}}^2 + (SA/2)^2$.'
    ],
    theory: [
      '1. Mặt cầu và giao tuyến mặt phẳng: Nếu $d = d(O, (P)) < R$ thì $(P)$ cắt mặt cầu $(O; R)$ theo đường tròn có bán kính $r = \\sqrt{R^2 - d^2}$.',
      '2. Mặt cầu ngoại tiếp hình chóp: (a) Hình chóp có cạnh bên $SA \\perp$ đáy: $R = \\sqrt{R_{\\text{đáy}}^2 + \\frac{SA^2}{4}}$; (b) Hình chóp đều cạnh bên $b$, đường cao $h$: $R = \\frac{b^2}{2h}$.'
    ],
    keyFormulas: [
      'r = \\sqrt{R^2 - d^2}, \\quad S = 4\\pi R^2, \\quad V = \\frac{4}{3}\\pi R^3',
      'SA \\perp \\text{đáy}:\\ R = \\sqrt{R_{\\text{đáy}}^2 + \\frac{h^2}{4}}; \\quad \\text{Chóp đều: } R = \\frac{b^2}{2h}'
    ],
    flashcards: [
      { front: 'Hình lập phương cạnh $a$ có bán kính mặt cầu ngoại tiếp bằng?', back: '$R = \\frac{1}{2}\\sqrt{a^2+a^2+a^2} = \\frac{a\\sqrt{3}}{2}$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 12 (2006) · Bài 2',
        question: 'Hình chóp $S.ABC$ có $SA \\perp (ABC)$, $SA = 2a$, đáy $ABC$ vuông tại $B$ với $AC = 2a$. Bán kính mặt cầu ngoại tiếp hình chóp là:',
        options: ['A. $a\\sqrt{2}$', 'B. $2a$', 'C. $a\\sqrt{3}$', 'D. $a$'],
        correctIndex: 0,
        explanation: 'Đáy vuông tại $B$ có cạnh huyền $AC = 2a \\Rightarrow R_{\\text{đáy}} = a$. Do đó $R = \\sqrt{a^2 + (2a/2)^2} = a\\sqrt{2}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 12 (2006) · Mặt cầu ngoại tiếp hình chóp',
        question: 'Cho hình chóp $S.ABCD$ đáy hình chữ nhật $AB = 3a, AD = 4a$, $SA \\perp (ABCD)$ và $SA = 5a$. Tính diện tích mặt cầu ngoại tiếp hình chóp.',
        hints: ['Tính $R_{\\text{đáy}} = \\frac{1}{2}\\sqrt{AB^2 + AD^2}$, rồi dùng công thức $R = \\sqrt{R_{\\text{đáy}}^2 + SA^2/4}$.'],
        solutionSteps: [
          'Bước 1: Đường chéo đáy $AC = \\sqrt{(3a)^2 + (4a)^2} = 5a \\Rightarrow R_{\\text{đáy}} = \\frac{5a}{2}$.',
          'Bước 2: $R = \\sqrt{\\left(\\frac{5a}{2}\\right)^2 + \\left(\\frac{5a}{2}\\right)^2} = \\frac{5a\\sqrt{2}}{2}$.',
          'Bước 3: Diện tích mặt cầu $S = 4\\pi R^2 = 4\\pi \\cdot \\frac{50a^2}{4} = 50\\pi a^2$.'
        ],
        finalAnswer: '$S = 50\\pi a^2$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'sphere_plane'
  },
  // ==================== HÌNH HỌC 12 · CHƯƠNG III: PHƯƠNG PHÁP TỌA ĐỘ TRONG KHÔNG GIAN OXYZ ====================
  {
    id: 'math-2006-12-19',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 19,
    stageLabel: 'Toán 12 (2006) · HH Chương III: Phương pháp tọa độ Oxyz',
    sourceTag: 'SGK Hình học 12 (2006) · Chương III · Bài 1–2',
    title: 'Bài 19 (2006): Hệ tọa độ Oxyz, Tích có hướng, Mặt phẳng & Mặt cầu',
    grade: 'Lớp 12 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 20,
    description:
      'Tọa độ điểm – vectơ, tích vô hướng & tích có hướng $[\\vec{u}, \\vec{v}]$, ứng dụng tính diện tích tam giác – thể tích tứ diện, phương trình mặt phẳng $Ax+By+Cz+D=0$ và phương trình mặt cầu.',
    mnemonics: [
      'Mặt phẳng chắn 3 trục tại $A(a;0;0), B(0;b;0), C(0;0;c)$: phương trình đoạn chắn $\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1$.',
      'Tích có hướng $[\\vec{u}, \\vec{v}]$ là MỘT VECTƠ vuông góc cả $\\vec{u}$ và $\\vec{v}$, dùng làm VTPT mặt phẳng.'
    ],
    commonTraps: [
      'Sai dấu thành phần giữa $y$ khi tính tích có hướng hai vectơ.'
    ],
    theory: [
      '1. Tích có hướng & Ứng dụng: $[\\vec{a}, \\vec{b}] = (a_2 b_3 - a_3 b_2;\\ a_3 b_1 - a_1 b_3;\\ a_1 b_2 - a_2 b_1)$. Diện tích $S_{\\triangle ABC} = \\frac{1}{2}|[\\vec{AB}, \\vec{AC}]|$; Thể tích $V_{ABCD} = \\frac{1}{6}|[\\vec{AB}, \\vec{AC}]\\cdot\\vec{AD}|$.',
      '2. Mặt phẳng & Mặt cầu: Mặt phẳng $(P): Ax + By + Cz + D = 0$ có VTPT $\\vec{n}=(A;B;C)$, khoảng cách $d(M_0, (P)) = \\frac{|Ax_0+By_0+Cz_0+D|}{\\sqrt{A^2+B^2+C^2}}$. Mặt cầu tâm $I(a;b;c)$ bán kính $R$: $(x-a)^2+(y-b)^2+(z-c)^2 = R^2$.'
    ],
    keyFormulas: [
      'S_{\\triangle ABC} = \\frac{1}{2}|[\\vec{AB}, \\vec{AC}]|, \\quad d(M_0,(P)) = \\frac{|Ax_0+By_0+Cz_0+D|}{\\sqrt{A^2+B^2+C^2}}',
      '\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1, \\quad (x-a)^2 + (y-b)^2 + (z-c)^2 = R^2'
    ],
    flashcards: [
      { front: 'Mặt cầu $x^2 + y^2 + z^2 - 2x + 4y - 6z - 2 = 0$ có tâm và bán kính là gì?', back: 'Tâm $I(1; -2; 3)$, $R = \\sqrt{1 + 4 + 9 - (-2)} = 4$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 12 (2006) · Bài 2',
        question: 'Trong không gian $Oxyz$, mặt phẳng $(P)$ đi qua $M(1; -2; 3)$ và nhận $\\vec{n} = (2; 1; -1)$ làm VTPT có phương trình:',
        options: [
          'A. $2x + y - z + 3 = 0$',
          'B. $2x + y - z - 3 = 0$',
          'C. $x - 2y + 3z - 3 = 0$',
          'D. $2x + y - z + 1 = 0$'
        ],
        correctIndex: 0,
        explanation: '$2(x - 1) + 1(y + 2) - 1(z - 3) = 0 \\iff 2x + y - z + 3 = 0$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 12 (2006) · Mặt cầu tiếp xúc mặt phẳng',
        question: 'Viết phương trình mặt cầu $(S)$ tâm $I(1; 2; -1)$ và tiếp xúc với mặt phẳng $(P): 2x - 2y + z + 6 = 0$.',
        hints: ['Vì $(S)$ tiếp xúc $(P)$ nên bán kính $R = d(I, (P))$.'],
        solutionSteps: [
          'Bước 1: $R = d(I, (P)) = \\frac{|2\\cdot 1 - 2\\cdot 2 + (-1) + 6|}{\\sqrt{2^2 + (-2)^2 + 1^2}} = \\frac{3}{3} = 1$.',
          'Bước 2: Phương trình $(S): (x - 1)^2 + (y - 2)^2 + (z + 1)^2 = 1$.'
        ],
        finalAnswer: '$(S): (x - 1)^2 + (y - 2)^2 + (z + 1)^2 = 1$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'sphere_plane'
  },
  {
    id: 'math-2006-12-20',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 12',
    lessonNumber: 20,
    stageLabel: 'Toán 12 (2006) · HH Chương III: Phương pháp tọa độ Oxyz',
    sourceTag: 'SGK Hình học 12 (2006) · Chương III · Bài 3',
    title: 'Bài 20 (2006): Phương trình Đường thẳng trong Oxyz, Góc & Khoảng cách',
    grade: 'Lớp 12 · Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 21,
    description:
      'Phương trình tham số – chính tắc của đường thẳng $d$ qua $M_0$ với VTCP $\\vec{u} = (a; b; c)$, vị trí tương đối hai đường thẳng – đường với mặt, công thức góc và khoảng cách.',
    mnemonics: [
      'Góc giữa đường thẳng $d$ và mặt phẳng $(P)$ dùng HÀM SIN: $\\sin(d, (P)) = \\frac{|\\vec{u}_d \\cdot \\vec{n}_P|}{|\\vec{u}_d|\\cdot|\\vec{n}_P|}$.',
      'Tìm giao điểm $d \\cap (P)$: viết $M(t)$ theo tham số đường thẳng $d$ rồi thay vào phương trình $(P)$ giải tìm $t$.'
    ],
    commonTraps: [
      'Nhầm $\\cos$ thay vì $\\sin$ trong công thức góc giữa đường thẳng và mặt phẳng (vì góc giữa $\\vec{u}_d$ và $\\vec{n}_P$ phụ với góc giữa $d$ và $(P)$!).'
    ],
    theory: [
      '1. Phương trình đường thẳng: Tham số $\\begin{cases} x = x_0 + at \\\\ y = y_0 + bt \\\\ z = z_0 + ct \\end{cases}$; Chính tắc ($abc \\neq 0$): $\\frac{x - x_0}{a} = \\frac{y - y_0}{b} = \\frac{z - z_0}{c}$.',
      '2. Khoảng cách: $d(M, \\Delta) = \\frac{|[\\vec{M_0 M}, \\vec{u}]|}{|\\vec{u}|}$. Khoảng cách hai đường chéo nhau $\\Delta_1, \\Delta_2$: $d(\\Delta_1, \\Delta_2) = \\frac{|[\\vec{u}_1, \\vec{u}_2] \\cdot \\vec{M_1 M_2}|}{|[\\vec{u}_1, \\vec{u}_2]|}$.'
    ],
    keyFormulas: [
      '\\sin(d, (P)) = \\frac{|\\vec{u}\\cdot\\vec{n}|}{|\\vec{u}||\\vec{n}|}, \\quad d(M, \\Delta) = \\frac{|[\\vec{M_0 M}, \\vec{u}]|}{|\\vec{u}|}',
      'd(\\Delta_1, \\Delta_2) = \\frac{|[\\vec{u}_1, \\vec{u}_2]\\cdot\\vec{M_1 M_2}|}{|[\\vec{u}_1, \\vec{u}_2]|}'
    ],
    flashcards: [
      { front: 'Đường thẳng $d$ đi qua $A(1; -1; 2)$ và vuông góc với $(P): 2x - y + 3z - 5 = 0$ có phương trình chính tắc?', back: 'Nhận $\\vec{u}_d = \\vec{n}_P = (2; -1; 3)$: $\\frac{x-1}{2} = \\frac{y+1}{-1} = \\frac{z-2}{3}$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 12 (2006) · Bài 3',
        question: 'Trong $Oxyz$, giao điểm của đường thẳng $d: \\begin{cases} x = 1 + t \\\\ y = 2 - t \\\\ z = 3 + 2t \\end{cases}$ và mặt phẳng $(P): x + y + z - 8 = 0$ là:',
        options: ['A. $(2; 1; 5)$', 'B. $(1; 2; 3)$', 'C. $(3; 0; 7)$', 'D. $(0; 3; 1)$'],
        correctIndex: 0,
        explanation: 'Thay vào $(P)$: $(1+t) + (2-t) + (3+2t) - 8 = 0 \\iff 2t - 2 = 0 \\iff t = 1 \\Rightarrow M(2; 1; 5)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 12 (2006) · Hình chiếu điểm lên đường thẳng',
        question: 'Trong không gian $Oxyz$, tìm tọa độ hình chiếu vuông góc $H$ của điểm $A(1; 0; 2)$ lên đường thẳng $d: \\frac{x - 1}{1} = \\frac{y}{1} = \\frac{z + 1}{2}$.',
        hints: ['Tham số hóa $H(1+t; t; -1+2t) \\in d$ và giải $\\vec{AH} \\cdot \\vec{u}_d = 0$.'],
        solutionSteps: [
          'Bước 1: $H \\in d \\Rightarrow H(1 + t; t; -1 + 2t)$, VTCP $\\vec{u}_d = (1; 1; 2)$.',
          'Bước 2: $\\vec{AH} = (t; t; 2t - 3)$. Do $AH \\perp d \\Rightarrow \\vec{AH}\\cdot\\vec{u}_d = 0 \\iff 1\\cdot t + 1\\cdot t + 2(2t - 3) = 0 \\iff 6t = 6 \\iff t = 1$.',
          'Bước 3: Thay $t = 1$ suy ra $H(2; 1; 1)$.'
        ],
        finalAnswer: '$H(2; 1; 1)$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'line_plane_oxyz'
  }
];
