import { MathLecture } from '../types';

// Chương trình Toán 10 GDPT 2006 (SGK Đại số 10 & Hình học 10 · NXB Giáo dục Việt Nam 2006)
// Đầy đủ 20 bài phủ hết 6 chương Đại số 10 + 3 chương Hình học 10, kèm Mô phỏng 2D & 3D

export const MATH_GDPT_2006_GRADE_10: MathLecture[] = [
  // ==================== ĐẠI SỐ 10 · CHƯƠNG I: MỆNH ĐỀ. TẬP HỢP ====================
  {
    id: 'math-2006-10-1',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 1,
    stageLabel: 'Toán 10 (2006) · ĐS Chương I: Mệnh đề. Tập hợp',
    sourceTag: 'SGK Đại số 10 (2006) · Bài 1',
    title: 'Bài 1 (2006): Mệnh đề & Mệnh đề chứa biến (∀, ∃)',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Mệnh đề logic, mệnh đề phủ định, mệnh đề kéo theo $P \\Rightarrow Q$ (điều kiện cần/đủ), mệnh đề đảo – tương đương và kĩ hiệu $\\forall, \\exists$.',
    mnemonics: [
      'Trong $P \\Rightarrow Q$: $P$ đứng trước mũi tên là điều kiện ĐỦ; $Q$ đứng sau mũi tên là điều kiện CẦN.',
      'Phủ định của $\\forall$ là $\\exists$ (và ngược lại), đồng thời phủ định mệnh đề điều kiện.'
    ],
    commonTraps: [
      'Đảo ngược vai trò "điều kiện cần" và "điều kiện đủ".',
      'Quên đổi dấu $\\ge$ thành $<$ khi lấy mệnh đề phủ định.'
    ],
    theory: [
      '1. Mệnh đề kéo theo & Tương đương: $P \\Rightarrow Q$ chỉ sai khi $P$ đúng, $Q$ sai. Nếu $P \\Rightarrow Q$ và $Q \\Rightarrow P$ đều đúng thì $P \\Leftrightarrow Q$ ("$P$ là điều kiện cần và đủ để có $Q$").',
      '2. Phủ định chứa lượng từ: $\\overline{\\forall x \\in X, P(x)} \\equiv \\exists x \\in X, \\overline{P(x)}$; $\\overline{\\exists x \\in X, P(x)} \\equiv \\forall x \\in X, \\overline{P(x)}$.'
    ],
    keyFormulas: [
      '\\overline{\\forall x \\in X,\\, P(x)} \\equiv \\exists x \\in X,\\, \\overline{P(x)}',
      'P \\Leftrightarrow Q \\iff (P \\Rightarrow Q) \\text{ và } (Q \\Rightarrow P)'
    ],
    flashcards: [
      { front: 'Phủ định của mệnh đề "$\\forall x \\in \\mathbb{R}, x^2 + 2 \\ge 2$"?', back: '$\\exists x \\in \\mathbb{R}, x^2 + 2 < 2$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Đại số 10 (2006) · Chương I',
        question: 'Mệnh đề nào sau đây ĐÚNG?',
        options: [
          'A. $\\forall x \\in \\mathbb{R},\\, x^2 + 1 > 0$',
          'B. $\\forall x \\in \\mathbb{R},\\, x^2 > 0$',
          'C. $\\exists x \\in \\mathbb{R},\\, x^2 < 0$',
          'D. $\\forall n \\in \\mathbb{N},\\, n^2 \\vdots 2$'
        ],
        correctIndex: 0,
        explanation: 'Vì $x^2 \\ge 0\\ \\forall x \\in \\mathbb{R}$ nên $x^2 + 1 \\ge 1 > 0$ luôn đúng.'
      }
    ],
    essayProblems: [
      {
        source: 'Đại số 10 (2006) · Phép phản chứng',
        question: 'Sử dụng lập luận phản chứng, chứng minh nếu $n^2$ là số lẻ ($n \\in \\mathbb{N}$) thì $n$ là số lẻ.',
        hints: ['Giả sử ngược lại $n$ là số chẵn ($n = 2k$) rồi suy ra điều mâu thuẫn.'],
        solutionSteps: [
          'Bước 1: Giả sử $n$ là số chẵn, tức $n = 2k\\ (k \\in \\mathbb{N})$.',
          'Bước 2: Khi đó $n^2 = 4k^2 = 2(2k^2)$ là số chẵn (mâu thuẫn giả thiết $n^2$ lẻ). Vậy $n$ phải là số lẻ.'
        ],
        finalAnswer: '$n$ là số lẻ (đpcm).'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: 1, b: 0, c: 1, d: 0 }, color: '#059669', name: 'y = x² + 1 > 0' }
  },
  {
    id: 'math-2006-10-2',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 2,
    stageLabel: 'Toán 10 (2006) · ĐS Chương I: Mệnh đề. Tập hợp',
    sourceTag: 'SGK Đại số 10 (2006) · Bài 2–5',
    title: 'Bài 2 (2006): Tập hợp, Các phép toán trên tập hợp & Số gần đúng',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 17,
    description:
      'Tập hợp, tập con, giao – hợp – hiệu – phần bù trên các tập con của $\\mathbb{R}$ (khoảng, đoạn, nửa khoảng) và sai số tuyệt đối, quy tròn số gần đúng.',
    mnemonics: [
      'Khi tìm $A \\cap B, A \\cup B, A \\setminus B$ trên khoảng đoạn, luôn biểu diễn cả $A$ và $B$ trên trục số trước.',
      'Quy tắc làm tròn số gần đúng theo độ chính xác $d$: làm tròn đến hàng lớn hơn hàng của $d$ một bậc.'
    ],
    commonTraps: [
      'Nhầm mút ngoặc tròn $($ thành ngoặc vuông $[$ khi lấy phần bù $C_{\\mathbb{R}} A$.'
    ],
    theory: [
      '1. Các phép toán tập hợp: $A \\cap B = \\{x \\mid x \\in A \\text{ và } x \\in B\\}$; $A \\cup B = \\{x \\mid x \\in A \\text{ hoặc } x \\in B\\}$; $A \\setminus B = \\{x \\mid x \\in A \\text{ và } x \\notin B\\}$.',
      '2. Các tập con thường dùng của $\\mathbb{R}$: Khoảng $(a; b)$, đoạn $[a; b]$, nửa khoảng $[a; b), (a; b]$. Sai số tuyệt đối $\\Delta_a = |\\bar{a} - a| \\le d$.'
    ],
    keyFormulas: [
      'n(A \\cup B) = n(A) + n(B) - n(A \\cap B)',
      'C_{\\mathbb{R}} A = \\mathbb{R} \\setminus A'
    ],
    flashcards: [
      { front: 'Cho $A = (-\\infty; 3]$ và $B = (1; +\\infty)$. Tìm $A \\cap B$?', back: '$(1; 3]$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Đại số 10 (2006) · Bài 3',
        question: 'Cho $A = [-2; 4)$ và $B = (0; 6]$. Tập hợp $A \\setminus B$ là:',
        options: ['A. $[-2; 0]$', 'B. $[-2; 0)$', 'C. $(4; 6]$', 'D. $(0; 4)$'],
        correctIndex: 0,
        explanation: 'Phần thuộc $[-2; 4)$ nhưng không thuộc $(0; 6]$ là $[-2; 0]$ (chú ý $0 \\notin B$ nên $0 \\in A \\setminus B$).'
      }
    ],
    essayProblems: [
      {
        source: 'Đại số 10 (2006) · Toán tập hợp có lời văn',
        question: 'Lớp 10A có 45 học sinh, trong đó có 25 em thích Toán, 20 em thích Vật lí và 10 em thích cả hai môn. Hỏi có bao nhiêu em không thích môn nào trong hai môn trên?',
        hints: ['Tính $n(T \\cup L) = n(T) + n(L) - n(T \\cap L)$, rồi lấy $45 - n(T \\cup L)$.'],
        solutionSteps: [
          'Bước 1: Số học sinh thích ít nhất một trong hai môn: $25 + 20 - 10 = 35$ em.',
          'Bước 2: Số học sinh không thích môn nào: $45 - 35 = 10$ em.'
        ],
        finalAnswer: '$10$ học sinh.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'linear', params: { a: 1, b: 0, c: 0, d: 0 }, color: '#0d9488', name: 'Trục số ℝ & Tập hợp' }
  },
  // ==================== ĐẠI SỐ 10 · CHƯƠNG II: HÀM SỐ BẬC NHẤT VÀ BẬC HAI ====================
  {
    id: 'math-2006-10-3',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 3,
    stageLabel: 'Toán 10 (2006) · ĐS Chương II: Hàm số bậc nhất và bậc hai',
    sourceTag: 'SGK Đại số 10 (2006) · Bài 1',
    title: 'Bài 3 (2006): Đại cương về Hàm số (Tập xác định, Tính chẵn lẻ, Biến thiên)',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      'Tìm tập xác định của hàm số chứa mẫu và căn thức, định nghĩa hàm đồng biến/nghịch biến trên khoảng $K$ và xét tính chẵn – lẻ của hàm số.',
    mnemonics: [
      'Điều kiện hàm chẵn/lẻ: trước hết tập xác định $D$ PHẢI đối xứng ($x \\in D \\Rightarrow -x \\in D$).',
      'Hàm chẵn: $f(-x) = f(x)$ (đối xứng trục $Oy$); Hàm lẻ: $f(-x) = -f(x)$ (đối xứng tâm $O$).'
    ],
    commonTraps: [
      'Quên kiểm tra tính đối xứng của tập xác định $D$ trước khi tính $f(-x)$ (ví dụ $y = \\sqrt{x}$ không chẵn không lẻ).'
    ],
    theory: [
      '1. Tập xác định: Là tập hợp tất cả giá trị $x \\in \\mathbb{R}$ sao cho biểu thức $f(x)$ có nghĩa (mẫu $\\neq 0$, trong căn bậc chẵn $\\ge 0$, mẫu chứa căn $> 0$).',
      '2. Tính chẵn – lẻ & Biến thiên: Với $D$ đối xứng, $f$ chẵn nếu $f(-x) = f(x)$ $\\forall x \\in D$; $f$ lẻ nếu $f(-x) = -f(x)$ $\\forall x \\in D$. Hàm đồng biến trên $K$ nếu $\\frac{f(x_2)-f(x_1)}{x_2-x_1} > 0\\ \\forall x_1 \\neq x_2 \\in K$.'
    ],
    keyFormulas: [
      'f \\text{ chẵn}: f(-x) = f(x); \\quad f \\text{ lẻ}: f(-x) = -f(x)',
      '\\frac{1}{\\sqrt{A}} \\text{ có nghĩa} \\iff A > 0'
    ],
    flashcards: [
      { front: 'Hàm số $y = x^3 - 3x$ là hàm chẵn hay hàm lẻ?', back: '$f(-x) = -x^3 + 3x = -f(x)$ trên $D = \\mathbb{R} \\Rightarrow$ Hàm lẻ.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Đại số 10 (2006) · Bài 1',
        question: 'Tập xác định của hàm số $y = \\frac{x + 1}{\\sqrt{4 - 2x}}$ là:',
        options: ['A. $(-\\infty; 2)$', 'B. $(-\\infty; 2]$', 'C. $(2; +\\infty)$', 'D. $\\mathbb{R} \\setminus \\{2\\}$'],
        correctIndex: 0,
        explanation: 'Căn nằm dưới mẫu nên $4 - 2x > 0 \\iff x < 2$, tức $D = (-\\infty; 2)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đại số 10 (2006) · Tính chẵn lẻ',
        question: 'Xét tính chẵn, lẻ của hàm số $y = |x + 1| + |x - 1|$.',
        hints: ['Kiểm tra $D = \\mathbb{R}$ đối xứng rồi thay $-x$ vào biểu thức trị tuyệt đối.'],
        solutionSteps: [
          'Bước 1: $D = \\mathbb{R}$ là tập đối xứng.',
          'Bước 2: $f(-x) = |-x + 1| + |-x - 1| = |x - 1| + |x + 1| = f(x)\\ \\forall x \\in \\mathbb{R}$. Vậy hàm số là hàm chẵn.'
        ],
        finalAnswer: 'Hàm số đã cho là hàm số chẵn.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'abs', params: { a: 1, b: 0, c: 0, d: 0 }, color: '#059669', name: 'y = |x| (Hàm chẵn)' }
  },
  {
    id: 'math-2006-10-4',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 4,
    stageLabel: 'Toán 10 (2006) · ĐS Chương II: Hàm số bậc nhất và bậc hai',
    sourceTag: 'SGK Đại số 10 (2006) · Bài 2–3',
    title: 'Bài 4 (2006): Hàm số bậc nhất & Hàm số bậc hai y = ax² + bx + c',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 17,
    description:
      'Đồ thị hàm bậc nhất, hàm giá trị tuyệt đối $y = |ax+b|$, lập bảng biến thiên – tìm đỉnh $I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right)$ và vẽ đồ thị Parabol $y = ax^2 + bx + c$.',
    mnemonics: [
      'Hoành độ đỉnh Parabol luôn nhớ $x_I = -\\frac{b}{2a}$, tung độ đỉnh thế $x_I$ trực tiếp vào hàm số $y_I = f(x_I)$ (đỡ nhầm dấu $-\\Delta/4a$).',
      'Khi $a > 0$: nghịch biến trên $(-\\infty; x_I)$, đồng biến trên $(x_I; +\\infty)$.'
    ],
    commonTraps: [
      'Nhầm công thức hoành độ đỉnh $-\\frac{b}{2a}$ thành $-\\frac{b}{a}$.'
    ],
    theory: [
      '1. Hàm số $y = ax^2 + bx + c\\ (a \\neq 0)$: Đồ thị là Parabol có đỉnh $I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right)$, nhận đường thẳng $x = -\\frac{b}{2a}$ làm trục đối xứng.',
      '2. Sự biến thiên: Khi $a > 0$, hàm số đạt giá trị nhỏ nhất tại đỉnh $I$ và quay bề lõm lên trên. Khi $a < 0$, hàm số đạt giá trị lớn nhất tại đỉnh $I$ và quay bề lõm xuống dưới.'
    ],
    keyFormulas: [
      'I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right), \\quad \\text{Trục đối xứng } x = -\\frac{b}{2a}'
    ],
    flashcards: [
      { front: 'Đỉnh của Parabol $y = x^2 - 4x + 1$ là điểm nào?', back: '$x_I = 2,\\ y_I = 4 - 8 + 1 = -3 \\Rightarrow I(2; -3)$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Đại số 10 (2006) · Bài 3',
        question: 'Hàm số $y = -x^2 + 4x + 5$ đồng biến trên khoảng nào?',
        options: ['A. $(-\\infty; 2)$', 'B. $(2; +\\infty)$', 'C. $(-\\infty; -2)$', 'D. $(-2; +\\infty)$'],
        correctIndex: 0,
        explanation: 'Hoành độ đỉnh $x_I = -\\frac{4}{2(-1)} = 2$. Vì $a = -1 < 0$ nên hàm đồng biến trên $(-\\infty; 2)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đại số 10 (2006) · Xác định Parabol',
        question: 'Tìm $a, b, c$ để Parabol $(P): y = ax^2 + bx + c$ có đỉnh $I(1; 4)$ và đi qua điểm $A(0; 3)$.',
        hints: ['Dùng $c = 3$, $-b/(2a) = 1$ và $a + b + 3 = 4$.'],
        solutionSteps: [
          'Bước 1: $A(0; 3) \\in (P) \\Rightarrow c = 3$.',
          'Bước 2: Đỉnh $I(1; 4) \\Rightarrow -\\frac{b}{2a} = 1 \\iff b = -2a$ và $a + b + 3 = 4 \\iff a + b = 1$.',
          'Bước 3: Thay $b = -2a \\Rightarrow -a = 1 \\iff a = -1, b = 2$.'
        ],
        finalAnswer: '$(P): y = -x^2 + 2x + 3$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: -1, b: 2, c: 3, d: 0 }, color: '#2563eb', name: 'y = -x² + 2x + 3' }
  },
  // ==================== ĐẠI SỐ 10 · CHƯƠNG III: PHƯƠNG TRÌNH. HỆ PHƯƠNG TRÌNH ====================
  {
    id: 'math-2006-10-5',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 5,
    stageLabel: 'Toán 10 (2006) · ĐS Chương III: Phương trình. Hệ phương trình',
    sourceTag: 'SGK Đại số 10 (2006) · Bài 1–2',
    title: 'Bài 5 (2006): Phương trình tương đương & Phương trình chứa căn, trị tuyệt đối',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Phân biệt phép biến đổi tương đương ($\\iff$) và phương trình hệ quả ($\\Rightarrow$), giải biện luận $ax + b = 0$, phương trình chứa ẩn ở mẫu, dấu giá trị tuyệt đối và căn thức.',
    mnemonics: [
      '$\\sqrt{A} = B \\iff \\begin{cases} B \\ge 0 \\\\ A = B^2 \\end{cases}$ (tự động bảo đảm $A = B^2 \\ge 0$).',
      'Khi bình phương hoặc khử mẫu chỉ thu được phương trình hệ quả, BẮT BUỘC thử lại nghiệm vào phương trình ban đầu!'
    ],
    commonTraps: [
      'Bình phương hai vế $\\sqrt{f(x)} = g(x)$ mà quên điều kiện $g(x) \\ge 0$, dẫn tới nhận nghiệm ngoại lai.'
    ],
    theory: [
      '1. Biện luận $ax + b = 0$: Nếu $a \\neq 0$ có nghiệm duy nhất $x = -\\frac{b}{a}$; nếu $a = 0, b \\neq 0$ vô nghiệm; nếu $a = 0, b = 0$ nghiệm đúng $\\forall x \\in \\mathbb{R}$.',
      '2. Phương trình căn & Trị tuyệt đối: $|A| = B \\iff B \\ge 0$ và $(A = B \\text{ hoặc } A = -B)$. $|A| = |B| \\iff A = B$ hoặc $A = -B$. $\\sqrt{A} = \\sqrt{B} \\iff A \\ge 0$ (hoặc $B \\ge 0$) và $A = B$.'
    ],
    keyFormulas: [
      '\\sqrt{A} = B \\iff \\begin{cases} B \\ge 0 \\\\ A = B^2 \\end{cases}',
      '|A| = B \\iff \\begin{cases} B \\ge 0 \\\\ A = \\pm B \\end{cases}'
    ],
    flashcards: [
      { front: 'Phương trình $\\sqrt{x^2 - 3} = x - 3$ có nghiệm nào?', back: 'ĐK $x \\ge 3$, bình phương: $x^2 - 3 = x^2 - 6x + 9 \\iff 6x = 12 \\iff x = 2$ (loại vì $2 < 3$). Vô nghiệm!' }
    ],
    sampleProblems: [
      {
        source: 'SGK Đại số 10 (2006) · Bài 2',
        question: 'Số nghiệm của phương trình $\\sqrt{3x + 1} = x - 1$ là:',
        options: ['A. $1$', 'B. $2$', 'C. $0$', 'D. $3$'],
        correctIndex: 0,
        explanation: 'ĐK $x \\ge 1$. Bình phương: $3x + 1 = x^2 - 2x + 1 \\iff x^2 - 5x = 0 \\iff x = 0$ (loại) hoặc $x = 5$ (nhận). Có 1 nghiệm.'
      }
    ],
    essayProblems: [
      {
        source: 'Đại số 10 (2006) · Giải biện luận',
        question: 'Giải phương trình $|2x - 1| = x + 2$.',
        hints: ['Đặt điều kiện vế phải $x + 2 \\ge 0$ rồi chia 2 trường hợp $2x - 1 = \\pm(x + 2)$.'],
        solutionSteps: [
          'Bước 1: ĐK $x + 2 \\ge 0 \\iff x \\ge -2$.',
          'Bước 2: $2x - 1 = x + 2 \\Rightarrow x = 3$ (nhận) hoặc $2x - 1 = -x - 2 \\Rightarrow 3x = -1 \\Rightarrow x = -\\frac{1}{3}$ (nhận).'
        ],
        finalAnswer: '$x \\in \\{-\\frac{1}{3}; 3\\}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'conic_sections_3d',
    defaultGraphConfig: { type: 'sqrt', params: { a: 3, b: 1, c: 0, d: 0 }, color: '#0d9488', name: 'y = √(3x+1)' }
  },
  {
    id: 'math-2006-10-6',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 6,
    stageLabel: 'Toán 10 (2006) · ĐS Chương III: Phương trình. Hệ phương trình',
    sourceTag: 'SGK Đại số 10 (2006) · Bài 3',
    title: 'Bài 6 (2006): Hệ phương trình bậc nhất nhiều ẩn & Hệ đối xứng',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Phương pháp Gauss (khử ẩn dần) giải hệ ba phương trình bậc nhất ba ẩn, định thức cấp hai $D, D_x, D_y$ và hệ phương trình đối xứng loại I ($S = x+y, P = xy$).',
    mnemonics: [
      'Với hệ 3 ẩn, dùng 1 phương trình làm chuẩn để khử cùng 1 ẩn ở 2 phương trình còn lại.',
      'Hệ đối xứng loại I ($x, y$ đổi vai trò không đổi hệ): đặt $S = x + y$, $P = xy$ (nhớ ĐK $S^2 - 4P \\ge 0$).'
    ],
    commonTraps: [
      'Quên kiểm tra điều kiện $S^2 \\ge 4P$ khi giải hệ đối xứng loại I.'
    ],
    theory: [
      '1. Hệ ba phương trình bậc nhất ba ẩn: Dùng phương pháp cộng đại số khử dần ẩn đưa về dạng tam giác trên, giải ngược từ dưới lên.',
      '2. Hệ đối xứng loại I (mở rộng SGK 2006): Đưa về tổng $S = x + y$ và tích $P = xy$, sau khi tìm được $(S; P)$ thỏa $S^2 - 4P \\ge 0$ thì $x, y$ là hai nghiệm của $t^2 - St + P = 0$.'
    ],
    keyFormulas: [
      'x^2 + y^2 = S^2 - 2P, \\quad S^2 - 4P \\ge 0'
    ],
    flashcards: [
      { front: 'Tổng $x + y + z$ của nghiệm hệ $\\begin{cases} x+y=3 \\\\ y+z=5 \\\\ z+x=4 \\end{cases}$?', back: 'Cộng 3 PT: $2(x+y+z) = 12 \\Rightarrow x+y+z = 6$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Đại số 10 (2006) · Bài 3',
        question: 'Nghiệm $(x; y; z)$ của hệ $\\begin{cases} x + y + z = 6 \\\\ y + z = 5 \\\\ z = 3 \\end{cases}$ là:',
        options: ['A. $(1; 2; 3)$', 'B. $(2; 1; 3)$', 'C. $(1; 3; 2)$', 'D. $(3; 2; 1)$'],
        correctIndex: 0,
        explanation: 'Thế $z = 3$ lên trên: $y = 5 - 3 = 2$, $x = 6 - 5 = 1$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đại số 10 (2006) · Hệ ba ẩn',
        question: 'Giải hệ $\\begin{cases} x + y - z = 1 \\\\ 2x - y + z = 5 \\\\ x + 2y + 3z = 14 \\end{cases}$.',
        hints: ['Cộng PT1 và PT2 khử cả $y$ và $z$ để tìm ngay $x$.'],
        solutionSteps: [
          'Bước 1: Cộng PT1 + PT2: $3x = 6 \\Rightarrow x = 2$.',
          'Bước 2: Thay $x = 2$ vào PT1 và PT3: $\\begin{cases} y - z = -1 \\\\ 2y + 3z = 12 \\end{cases} \\Rightarrow y = z - 1 \\Rightarrow 2(z-1) + 3z = 12 \\Rightarrow 5z = 14$.',
          'Bước 3: $z = \\frac{14}{5}$, $y = \\frac{14}{5} - 1 = \\frac{9}{5}$.'
        ],
        finalAnswer: '$(x; y; z) = \\left(2; \\frac{9}{5}; \\frac{14}{5}\\right)$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz',
    defaultGraphConfig: { type: 'linear', params: { a: -1, b: 6, c: 0, d: 0 }, color: '#0284c7', name: 'Giao tuyến mặt phẳng 3 ẩn' }
  },
  // ==================== ĐẠI SỐ 10 · CHƯƠNG IV: BẤT ĐẲNG THỨC. BẤT PHƯƠNG TRÌNH ====================
  {
    id: 'math-2006-10-7',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 7,
    stageLabel: 'Toán 10 (2006) · ĐS Chương IV: Bất đẳng thức. Bất phương trình',
    sourceTag: 'SGK Đại số 10 (2006) · Bài 1',
    title: 'Bài 7 (2006): Bất đẳng thức & Bất đẳng thức Cô-si (AM-GM)',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Tính chất cơ bản của bất đẳng thức, bất đẳng thức Cô-si cho 2 số và 3 số không âm cùng kỹ thuật chọn điểm rơi tìm GTLN – GTNN.',
    mnemonics: [
      'Cô-si 2 số không âm: $a + b \\ge 2\\sqrt{ab}$; 3 số không âm: $a + b + c \\ge 3\\sqrt[3]{abc}$. Dấu "=" xảy ra khi các số BẰNG NHAU.',
      'Điều kiện bắt buộc để dùng Cô-si: các số hạng phải KHÔNG ÂM ($\\ge 0$) và tích triệt tiêu được ẩn.'
    ],
    commonTraps: [
      'Áp dụng Cô-si cho số có thể âm (ví dụ $x + \\frac{1}{x} \\ge 2$ khi chưa biết $x > 0$).',
      'Quên kiểm tra dấu "=" xảy ra có tồn tại giá trị $x$ thỏa mãn không.'
    ],
    theory: [
      '1. Bất đẳng thức Cô-si (AM-GM): Với hai số $a, b \\ge 0$: $\\frac{a+b}{2} \\ge \\sqrt{ab}$. Với $a, b, c \\ge 0$: $\\frac{a+b+c}{3} \\ge \\sqrt[3]{abc}$. Đẳng thức xảy ra khi các số bằng nhau.',
      '2. Hệ quả hay dùng: Với $x > 0$: $x + \\frac{1}{x} \\ge 2$; với $a, b > 0$: $(a+b)\\left(\\frac{1}{a} + \\frac{1}{b}\\right) \\ge 4$, hay $\\frac{1}{a} + \\frac{1}{b} \\ge \\frac{4}{a+b}$.'
    ],
    keyFormulas: [
      'a + b \\ge 2\\sqrt{ab} \\quad (a, b \\ge 0)',
      '\\frac{1}{a} + \\frac{1}{b} \\ge \\frac{4}{a + b} \\quad (a, b > 0)',
      '|a + b| \\le |a| + |b|'
    ],
    flashcards: [
      { front: 'Giá trị nhỏ nhất của $y = x + \\frac{9}{x}$ với $x > 0$?', back: '$x + \\frac{9}{x} \\ge 2\\sqrt{x \\cdot \\frac{9}{x}} = 6$, đạt được khi $x = 3$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Đại số 10 (2006) · Bài 1',
        question: 'Với mọi $x > 0$, giá trị nhỏ nhất của biểu thức $P = 2x + \\frac{8}{x}$ bằng:',
        options: ['A. $8$', 'B. $4$', 'C. $16$', 'D. $6$'],
        correctIndex: 0,
        explanation: '$2x + \\frac{8}{x} \\ge 2\\sqrt{2x \\cdot \\frac{8}{x}} = 2\\cdot 4 = 8$, dấu "=" tại $2x = \\frac{8}{x} \\iff x = 2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đại số 10 (2006) · Kỹ thuật tách Cô-si',
        question: 'Cho $x > 1$. Tìm giá trị nhỏ nhất của $S = x + \\frac{4}{x - 1}$.',
        hints: ['Viết $x = (x - 1) + 1$ để tích $(x - 1)\\cdot\\frac{4}{x-1}$ khử hết biến.'],
        solutionSteps: [
          'Bước 1: Vì $x > 1 \\Rightarrow x - 1 > 0$. Ta viết $S = (x - 1) + \\frac{4}{x - 1} + 1$.',
          'Bước 2: Áp dụng Cô-si: $(x - 1) + \\frac{4}{x - 1} \\ge 2\\sqrt{4} = 4 \\Rightarrow S \\ge 4 + 1 = 5$.',
          'Bước 3: Dấu "=" xảy ra $\\iff x - 1 = \\frac{4}{x - 1} \\iff x - 1 = 2 \\iff x = 3$ (thỏa $x > 1$).'
        ],
        finalAnswer: '$\\min S = 5$ tại $x = 3$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'rational', params: { a: 1, b: 0, c: 1, d: 0 }, color: '#059669', name: 'y = x + 1/x (Cực tiểu AM-GM)' }
  },
  {
    id: 'math-2006-10-8',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 8,
    stageLabel: 'Toán 10 (2006) · ĐS Chương IV: Bất đẳng thức. Bất phương trình',
    sourceTag: 'SGK Đại số 10 (2006) · Bài 2–4',
    title: 'Bài 8 (2006): Dấu nhị thức bậc nhất & Hệ BPT bậc nhất hai ẩn',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 17,
    description:
      'Quy tắc xét dấu nhị thức bậc nhất $f(x) = ax + b$ ("Phải cùng – Trái khác"), giải bất phương trình tích – thương và biểu diễn miền nghiệm hệ BPT bậc nhất hai ẩn.',
    mnemonics: [
      'Nhị thức $ax + b\\ (a \\neq 0)$ có nghiệm $x_0 = -\\frac{b}{a}$: Bên PHẢI $x_0$ cùng dấu $a$, bên TRÁI $x_0$ trái dấu $a$.',
      'Miền nghiệm của hệ BPT bậc nhất hai ẩn là giao của các nửa mặt phẳng (thường là một đa giác lồi).'
    ],
    commonTraps: [
      'Nhân chéo khử mẫu khi giải bất phương trình chứa ẩn ở mẫu (SAI khi chưa biết dấu mẫu!).',
      'Đặt dấu $= 0$ vào tập nghiệm cho giá trị làm mẫu thức bằng $0$ (phải đánh dấu `||` không xác định).'
    ],
    theory: [
      '1. Dấu nhị thức bậc nhất $f(x) = ax + b\\ (a \\neq 0)$: Cùng dấu với $a$ khi $x > -\\frac{b}{a}$ ("phải cùng") và trái dấu với $a$ khi $x < -\\frac{b}{a}$ ("trái khác").',
      '2. Bất phương trình tích – thương: Chuyển hết sang một vế để vế phải bằng $0$, quy đồng (nếu có phân thức), tìm nghiệm tử và mẫu rồi lập bảng xét dấu đan xen.'
    ],
    keyFormulas: [
      'f(x) = ax + b \\quad (a \\neq 0): \\text{ Phải cùng dấu } a,\\ \\text{Trái khác dấu } a',
      '\\frac{A(x)}{B(x)} > 0 \\iff A(x)\\text{ và }B(x)\\text{ cùng dấu}'
    ],
    flashcards: [
      { front: 'Nghiệm của bất phương trình $\\frac{x - 1}{x + 2} \\le 0$?', back: 'Nghiệm tử $1$, mẫu $-2$ (loại). Bảng xét dấu cho $-2 < x \\le 1$, tức $(-2; 1]$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Đại số 10 (2006) · Bài 3',
        question: 'Tập nghiệm của bất phương trình $\\frac{2x - 4}{x + 1} \\ge 0$ là:',
        options: [
          'A. $(-\\infty; -1) \\cup [2; +\\infty)$',
          'B. $(-\\infty; -1] \\cup [2; +\\infty)$',
          'C. $(-1; 2]$',
          'D. $[2; +\\infty)$'
        ],
        correctIndex: 0,
        explanation: 'Nghiệm tử $x = 2$ (lấy dấu $=$), nghiệm mẫu $x = -1$ (không lấy). Xét dấu ngoài cùng dấu $+$, nên tập nghiệm là $(-\\infty; -1) \\cup [2; +\\infty)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đại số 10 (2006) · Lập bảng xét dấu',
        question: 'Giải bất phương trình $\\frac{2}{x - 1} \\ge 1$.',
        hints: ['Chuyển $1$ sang vế trái quy đồng $\\frac{2 - (x - 1)}{x - 1} = \\frac{3 - x}{x - 1} \\ge 0$, KHÔNG nhân chéo!'],
        solutionSteps: [
          'Bước 1: ĐK $x \\neq 1$. Chuyển vế: $\\frac{2 - x + 1}{x - 1} \\ge 0 \\iff \\frac{3 - x}{x - 1} \\ge 0$.',
          'Bước 2: Lập bảng xét dấu nhị thức $3 - x$ (nghiệm $3$) và $x - 1$ (nghiệm $1$). Chọn khoảng mang dấu dương: $1 < x \\le 3$.'
        ],
        finalAnswer: '$S = (1; 3]$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz',
    defaultGraphConfig: { type: 'linear', params: { a: 2, b: -4, c: 0, d: 0 }, color: '#0284c7', name: 'f(x) = 2x - 4' }
  },
  {
    id: 'math-2006-10-9',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 9,
    stageLabel: 'Toán 10 (2006) · ĐS Chương IV: Bất đẳng thức. Bất phương trình',
    sourceTag: 'SGK Đại số 10 (2006) · Bài 5',
    title: 'Bài 9 (2006): Dấu của Tam thức bậc hai & Bất phương trình bậc hai',
    grade: 'Lớp 10 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description:
      'Định lí về dấu tam thức bậc hai $f(x) = ax^2 + bx + c$ ("Trong trái – Ngoài cùng"), điều kiện tam thức không đổi dấu trên $\\mathbb{R}$ và giải BPT bậc hai, BPT chứa căn.',
    mnemonics: [
      'Tam thức $ax^2 + bx + c$ có 2 nghiệm $x_1 < x_2$: **Trong khoảng hai nghiệm TRÁI dấu $a$, ngoài khoảng CÙNG dấu $a$**.',
      '$ax^2 + bx + c > 0\\ \\forall x \\in \\mathbb{R} \\iff a > 0$ và $\\Delta < 0$ (nếu $a$ chứa tham số nhớ xét riêng $a = 0$!).'
    ],
    commonTraps: [
      'Quên xét trường hợp hệ số $a = 0$ khi bài toán chứa tham số $m$ ở hệ số của $x^2$.'
    ],
    theory: [
      '1. Định lí về dấu tam thức bậc hai $f(x) = ax^2 + bx + c\\ (a \\neq 0)$:\n• $\\Delta < 0$: $f(x)$ cùng dấu $a$ với mọi $x \\in \\mathbb{R}$.\n• $\\Delta = 0$: $f(x)$ cùng dấu $a$ với mọi $x \\neq -\\frac{b}{2a}$.\n• $\\Delta > 0$ (2 nghiệm $x_1 < x_2$): $f(x)$ trái dấu $a$ trên $(x_1; x_2)$, cùng dấu $a$ trên $(-\\infty; x_1) \\cup (x_2; +\\infty)$.',
      '2. Giải bất phương trình căn cơ bản: $\\sqrt{A} < B \\iff A \\ge 0, B > 0, A < B^2$. $\\sqrt{A} > B \\iff (B < 0, A \\ge 0)$ hoặc $(B \\ge 0, A > B^2)$.'
    ],
    keyFormulas: [
      'f(x) > 0\\ \\forall x \\in \\mathbb{R} \\iff a > 0 \\text{ và } \\Delta < 0',
      'f(x) \\le 0\\ \\forall x \\in \\mathbb{R} \\iff a < 0 \\text{ và } \\Delta \\le 0'
    ],
    flashcards: [
      { front: 'Tam thức $f(x) = -x^2 + 5x - 6$ dương trên khoảng nào?', back: 'Nghiệm $2, 3$; $a = -1 < 0$. "Trong trái" nên $f(x) > 0$ trên $(2; 3)$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Đại số 10 (2006) · Bài 5',
        question: 'Tìm tất cả giá trị $m$ để tam thức $f(x) = x^2 - 2mx + 4 > 0$ với mọi $x \\in \\mathbb{R}$:',
        options: ['A. $-2 < m < 2$', 'B. $-2 \\le m \\le 2$', 'C. $m > 2$ hoặc $m < -2$', 'D. $m > 0$'],
        correctIndex: 0,
        explanation: 'Vì $a = 1 > 0$, cần $\\Delta\' = m^2 - 4 < 0 \\iff -2 < m < 2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đại số 10 (2006) · Bất phương trình tam thức chứa tham số',
        question: 'Tìm $m$ để bất phương trình $m x^2 - 2mx + m + 2 > 0$ nghiệm đúng với mọi $x \\in \\mathbb{R}$.',
        hints: ['Xét riêng $m = 0$ trước, sau đó xét $m > 0$ và $\\Delta\' < 0$.'],
        solutionSteps: [
          'Bước 1: Với $m = 0$: $2 > 0$ luôn đúng $\\forall x \\in \\mathbb{R} \\Rightarrow m = 0$ nhận.',
          'Bước 2: Với $m \\neq 0$: cần $\\begin{cases} m > 0 \\\\ \\Delta\' = m^2 - m(m+2) = -2m < 0 \\end{cases} \\iff m > 0$.',
          'Bước 3: Kết hợp hai trường hợp: $m \\ge 0$.'
        ],
        finalAnswer: '$m \\ge 0$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: -1, b: 5, c: -6, d: 0 }, color: '#059669', name: 'f(x) = -x² + 5x - 6' }
  },
  // ==================== ĐẠI SỐ 10 · CHƯƠNG V: THỐNG KÊ ====================
  {
    id: 'math-2006-10-10',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 10,
    stageLabel: 'Toán 10 (2006) · ĐS Chương V: Thống kê',
    sourceTag: 'SGK Đại số 10 (2006) · Bài 1–4',
    title: 'Bài 10 (2006): Bảng tần số, Số trung bình, Trung vị, Mốt & Độ lệch chuẩn',
    grade: 'Lớp 10 · Đại số & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      'Lập bảng phân bố tần số – tần suất ghép lớp, tính số trung bình cộng $\\bar{x}$, số trung vị $M_e$, mốt $M_o$, phương sai $s^2$ và độ lệch chuẩn $s$.',
    mnemonics: [
      'Phương sai $s^2 = \\overline{x^2} - (\\bar{x})^2$ luôn $\\ge 0$; Độ lệch chuẩn $s = \\sqrt{s^2}$ đo mức độ phân tán quanh $\\bar{x}$.',
      'Khi tính số trung vị $M_e$, PHẢI sắp xếp mẫu số liệu theo thứ tự không giảm trước!'
    ],
    commonTraps: [
      'Tìm số trung vị trên dãy số liệu chưa được sắp xếp tăng dần.',
      'Nhầm phương sai $s^2$ với độ lệch chuẩn $s = \\sqrt{s^2}$.'
    ],
    theory: [
      '1. Các số đo xu thế trung tâm: Số trung bình cộng $\\bar{x} = \\frac{1}{n}\\sum n_i x_i$ (với bảng ghép lớp lấy $c_i$ là giá trị đại diện mỗi lớp). Số trung vị $M_e$ là giá trị đứng chính giữa dãy đã sắp xếp. Mốt $M_o$ là giá trị có tần số lớn nhất.',
      '2. Các số đo độ phân tán: Phương sai $s^2 = \\frac{1}{n}\\sum n_i(x_i - \\bar{x})^2 = \\left(\\frac{1}{n}\\sum n_i x_i^2\\right) - (\\bar{x})^2$. Độ lệch chuẩn $s = \\sqrt{s^2}$.'
    ],
    keyFormulas: [
      '\\bar{x} = \\frac{1}{n}\\sum_{i=1}^k n_i x_i',
      's^2 = \\frac{1}{n}\\sum_{i=1}^k n_i(x_i - \\bar{x})^2, \\quad s = \\sqrt{s^2}'
    ],
    flashcards: [
      { front: 'Cho mẫu số liệu $2, 4, 4, 6, 9$. Tìm số trung bình, trung vị và mốt?', back: '$\\bar{x} = 25/5 = 5$; $M_e = 4$; $M_o = 4$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Đại số 10 (2006) · Chương V',
        question: 'Cho mẫu số liệu điểm kiểm tra: $5, 7, 7, 8, 9, 10$. Số trung vị $M_e$ của mẫu là:',
        options: ['A. $7{,}5$', 'B. $7$', 'C. $8$', 'D. $7{,}67$'],
        correctIndex: 0,
        explanation: 'Mẫu có $n = 6$ (chẵn) đã sắp tăng dần, hai số ở giữa là $7$ và $8$ nên $M_e = \\frac{7+8}{2} = 7{,}5$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đại số 10 (2006) · Tính phương sai & độ lệch chuẩn',
        question: 'Cho mẫu số liệu $1, 2, 3, 4, 5$. Tính số trung bình $\\bar{x}$, phương sai $s^2$ và độ lệch chuẩn $s$.',
        hints: ['Dùng $s^2 = \\frac{1}{5}\\sum (x_i - \\bar{x})^2$.'],
        solutionSteps: [
          'Bước 1: $\\bar{x} = \\frac{1+2+3+4+5}{5} = 3$.',
          'Bước 2: $s^2 = \\frac{(1-3)^2 + (2-3)^2 + 0 + (4-3)^2 + (5-3)^2}{5} = \\frac{4+1+0+1+4}{5} = 2$.',
          'Bước 3: Độ lệch chuẩn $s = \\sqrt{2} \\approx 1{,}414$.'
        ],
        finalAnswer: '$\\bar{x} = 3$; $s^2 = 2$; $s = \\sqrt{2}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: -0.5, b: 0, c: 3, d: 0 }, color: '#0d9488', name: 'Phân phối thống kê mẫu' }
  },
  // ==================== ĐẠI SỐ 10 · CHƯƠNG VI: CUNG VÀ GÓC LƯỢNG GIÁC ====================
  {
    id: 'math-2006-10-11',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 11,
    stageLabel: 'Toán 10 (2006) · ĐS Chương VI: Cung & Công thức lượng giác',
    sourceTag: 'SGK Đại số 10 (2006) · Bài 1–2',
    title: 'Bài 11 (2006): Cung – Góc lượng giác & Giá trị lượng giác trên đường tròn đơn vị',
    grade: 'Lớp 10 · Lượng giác',
    category: 'Lượng giác & Mũ',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Đổi đơn vị độ và radian ($180^\\circ = \\pi\\text{ rad}$), độ dài cung tròn $l = R\\alpha$, đường tròn lượng giác, dấu $\\sin, \\cos, \\tan, \\cot$ ở 4 góc phần tư và cung liên kết.',
    mnemonics: [
      'Ghi nhớ góc liên kết: **Cos đối – Sin bù – Phụ chéo – Khác pi tan cot**.',
      'Trục $\\cos$ là hoành độ $Ox$, trục $\\sin$ là tung độ $Oy$.'
    ],
    commonTraps: [
      'Xác định sai dấu của $\\sin\\alpha$ hoặc $\\cos\\alpha$ khi góc $\\alpha$ thuộc góc phần tư II, III, IV.'
    ],
    theory: [
      '1. Radian & Đường tròn lượng giác: $\\alpha\\text{ (rad)} = \\frac{a^\\circ \\cdot \\pi}{180}$. Đường tròn lượng giác có tâm $O(0;0)$, bán kính $R = 1$, điểm gốc $A(1; 0)$, chiều dương ngược chiều kim đồng hồ.',
      '2. Các hằng đẳng thức lượng giác cơ bản: $\\sin^2\\alpha + \\cos^2\\alpha = 1$; $1 + \\tan^2\\alpha = \\frac{1}{\\cos^2\\alpha}$; $1 + \\cot^2\\alpha = \\frac{1}{\\sin^2\\alpha}$; $\\tan\\alpha\\cdot\\cot\\alpha = 1$.'
    ],
    keyFormulas: [
      'l = R\\alpha \\ (\\alpha\\text{ tính bằng rad}), \\quad \\sin^2\\alpha + \\cos^2\\alpha = 1',
      '1 + \\tan^2\\alpha = \\frac{1}{\\cos^2\\alpha}, \\quad 1 + \\cot^2\\alpha = \\frac{1}{\\sin^2\\alpha}'
    ],
    flashcards: [
      { front: 'Nếu $\\frac{\\pi}{2} < \\alpha < \\pi$ thì dấu của $\\sin\\alpha$ và $\\cos\\alpha$ là gì?', back: 'Góc phần tư II: $\\sin\\alpha > 0$, $\\cos\\alpha < 0$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Đại số 10 (2006) · Chương VI',
        question: 'Cho $\\sin\\alpha = \\frac{3}{5}$ và $\\frac{\\pi}{2} < \\alpha < \\pi$. Giá trị của $\\cos\\alpha$ là:',
        options: ['A. $-\\frac{4}{5}$', 'B. $\\frac{4}{5}$', 'C. $-\\frac{3}{4}$', 'D. $\\frac{16}{25}$'],
        correctIndex: 0,
        explanation: '$\\cos^2\\alpha = 1 - \\frac{9}{25} = \\frac{16}{25}$. Vì $\\alpha \\in \\left(\\frac{\\pi}{2}; \\pi\\right) \\Rightarrow \\cos\\alpha < 0 \\Rightarrow \\cos\\alpha = -\\frac{4}{5}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đại số 10 (2006) · Tính giá trị lượng giác',
        question: 'Cho $\\tan\\alpha = 2$. Tính giá trị biểu thức $P = \\frac{3\\sin\\alpha - 2\\cos\\alpha}{\\sin\\alpha + 3\\cos\\alpha}$.',
        hints: ['Chia cả tử và mẫu cho $\\cos\\alpha \\neq 0$ để xuất hiện $\\tan\\alpha$.'],
        solutionSteps: [
          'Bước 1: Vì $\\tan\\alpha = 2$ nên $\\cos\\alpha \\neq 0$. Chia cả tử và mẫu cho $\\cos\\alpha$:',
          'Bước 2: $P = \\frac{3\\tan\\alpha - 2}{\\tan\\alpha + 3} = \\frac{3\\cdot 2 - 2}{2 + 3} = \\frac{4}{5}$.'
        ],
        finalAnswer: '$P = \\frac{4}{5}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'circle_theorems_3d',
    defaultGraphConfig: { type: 'trig_sin', params: { a: 1, b: 1, c: 0, d: 0 }, color: '#0284c7', name: 'y = sin(x)' }
  },
  {
    id: 'math-2006-10-12',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 12,
    stageLabel: 'Toán 10 (2006) · ĐS Chương VI: Cung & Công thức lượng giác',
    sourceTag: 'SGK Đại số 10 (2006) · Bài 3',
    title: 'Bài 12 (2006): Công thức Lượng giác (Cộng, Nhân đôi, Hạ bậc, Tích ↔ Tổng)',
    grade: 'Lớp 10 · Lượng giác',
    category: 'Lượng giác & Mũ',
    difficulty: 'Vận dụng',
    readTimeMinutes: 20,
    description:
      'Hệ thống đầy đủ công thức cộng, công thức nhân đôi $\\sin 2a, \\cos 2a$, công thức hạ bậc và công thức biến đổi tích thành tổng – tổng thành tích.',
    mnemonics: [
      'Công thức cộng: **Sin thì sin cos cos sin; Cos thì cos cos sin sin dấu trừ**.',
      'Hạ bậc thuộc lòng: $\\cos^2 a = \\frac{1 + \\cos 2a}{2}$; $\\sin^2 a = \\frac{1 - \\cos 2a}{2}$.'
    ],
    commonTraps: [
      'Nhầm dấu $+$ và $-$ trong $\\cos(a + b) = \\cos a\\cos b - \\sin a\\sin b$.',
      'Nhầm $\\cos a - \\cos b = -2\\sin\\frac{a+b}{2}\\sin\\frac{a-b}{2}$ thiếu dấu trừ phía trước.'
    ],
    theory: [
      '1. Công thức cộng & Nhân đôi: $\\sin(a\\pm b) = \\sin a\\cos b \\pm \\cos a\\sin b$; $\\cos(a\\pm b) = \\cos a\\cos b \\mp \\sin a\\sin b$; $\\tan(a\\pm b) = \\frac{\\tan a \\pm \\tan b}{1 \\mp \\tan a\\tan b}$. Nhân đôi: $\\sin 2a = 2\\sin a\\cos a$; $\\cos 2a = \\cos^2 a - \\sin^2 a = 2\\cos^2 a - 1 = 1 - 2\\sin^2 a$.',
      '2. Hạ bậc & Tổng – Tích: $\\cos a\\cos b = \\frac{1}{2}[\\cos(a-b) + \\cos(a+b)]$; $\\sin a\\sin b = \\frac{1}{2}[\\cos(a-b) - \\cos(a+b)]$; $\\sin a\\cos b = \\frac{1}{2}[\\sin(a-b) + \\sin(a+b)]$.'
    ],
    keyFormulas: [
      '\\sin 2a = 2\\sin a\\cos a, \\quad \\cos 2a = 2\\cos^2 a - 1 = 1 - 2\\sin^2 a',
      '\\cos^2 a = \\frac{1 + \\cos 2a}{2}, \\quad \\sin^2 a = \\frac{1 - \\cos 2a}{2}'
    ],
    flashcards: [
      { front: 'Rút gọn $\\cos^2 15^\\circ - \\sin^2 15^\\circ$?', back: 'Áp dụng $\\cos 2a$: $\\cos(2\\cdot 15^\\circ) = \\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Đại số 10 (2006) · Chương VI',
        question: 'Giá trị của biểu thức $\\sin 75^\\circ \\cos 15^\\circ + \\cos 75^\\circ \\sin 15^\\circ$ bằng:',
        options: ['A. $1$', 'B. $\\frac{\\sqrt{3}}{2}$', 'C. $\\frac{1}{2}$', 'D. $0$'],
        correctIndex: 0,
        explanation: 'Dùng công thức cộng: $\\sin(75^\\circ + 15^\\circ) = \\sin 90^\\circ = 1$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đại số 10 (2006) · Chứng minh đẳng thức lượng giác',
        question: 'Chứng minh đẳng thức $\\frac{1 - \\cos 2x}{\\sin 2x} = \\tan x$ (với $\\sin 2x \\neq 0$).',
        hints: ['Thay $1 - \\cos 2x = 2\\sin^2 x$ và $\\sin 2x = 2\\sin x\\cos x$.'],
        solutionSteps: [
          'Bước 1: Tử thức $1 - \\cos 2x = 2\\sin^2 x$; mẫu thức $\\sin 2x = 2\\sin x\\cos x$.',
          'Bước 2: $\\frac{2\\sin^2 x}{2\\sin x\\cos x} = \\frac{\\sin x}{\\cos x} = \\tan x$ (đpcm).'
        ],
        finalAnswer: '$\\text{VT} = \\tan x = \\text{VP}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'trig_cos', params: { a: 1, b: 2, c: 0, d: 0 }, color: '#059669', name: 'y = cos(2x)' }
  },
  // ==================== HÌNH HỌC 10 · CHƯƠNG I: VECTƠ ====================
  {
    id: 'math-2006-10-13',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 13,
    stageLabel: 'Toán 10 (2006) · HH Chương I: Vectơ',
    sourceTag: 'SGK Hình học 10 (2006) · Bài 1–3',
    title: 'Bài 13 (2006): Định nghĩa Vectơ, Tổng – Hiệu & Tích vectơ với một số',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 17,
    description:
      'Vectơ cùng phương – cùng hướng – bằng nhau, quy tắc 3 điểm, quy tắc hình bình hành, quy tắc hiệu, tính chất trung điểm – trọng tâm tam giác và điều kiện thẳng hàng.',
    mnemonics: [
      'Quy tắc cộng nối đuôi: $\\vec{AB} + \\vec{BC} = \\vec{AC}$. Quy tắc trừ chung gốc (đổi ngược): $\\vec{OB} - \\vec{OA} = \\vec{AB}$.',
      'Ba điểm $A, B, C$ thẳng hàng $\\iff \\vec{AB} = k\\vec{AC}$.'
    ],
    commonTraps: [
      'Nhầm thứ tự điểm trong quy tắc trừ: $\\vec{OA} - \\vec{OB} = \\vec{BA}$ (không phải $\\vec{AB}$!).'
    ],
    theory: [
      '1. Cộng – trừ vectơ: Quy tắc 3 điểm $\\vec{AB} + \\vec{BC} = \\vec{AC}$; quy tắc hình bình hành $ABCD$: $\\vec{AB} + \\vec{AD} = \\vec{AC}$. Trung điểm $I$ của $AB$: $\\vec{IA} + \\vec{IB} = \\vec{0}$ và $\\vec{MA} + \\vec{MB} = 2\\vec{MI}$.',
      '2. Trọng tâm & Tích với số $k$: Trọng tâm $G$ của $\\triangle ABC$: $\\vec{GA} + \\vec{GB} + \\vec{GC} = \\vec{0}$, $\\vec{MA} + \\vec{MB} + \\vec{MC} = 3\\vec{MG}$. Hai vectơ $\\vec{a}, \\vec{b}$ ($\\vec{b} \\neq \\vec{0}$) cùng phương $\\iff \\exists k \\in \\mathbb{R}: \\vec{a} = k\\vec{b}$.'
    ],
    keyFormulas: [
      '\\vec{AB} + \\vec{BC} = \\vec{AC}, \\quad \\vec{OB} - \\vec{OA} = \\vec{AB}',
      '\\vec{MA} + \\vec{MB} = 2\\vec{MI}, \\quad \\vec{MA} + \\vec{MB} + \\vec{MC} = 3\\vec{MG}'
    ],
    flashcards: [
      { front: 'Cho hình bình hành $ABCD$ tâm $O$. Tổng $\\vec{OA} + \\vec{OB} + \\vec{OC} + \\vec{OD}$ bằng?', back: '$(\\vec{OA} + \\vec{OC}) + (\\vec{OB} + \\vec{OD}) = \\vec{0} + \\vec{0} = \\vec{0}$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 10 (2006) · HH Chương I',
        question: 'Cho tam giác $ABC$ đều cạnh $a$. Độ dài của vectơ tổng $\\vec{AB} + \\vec{AC}$ là:',
        options: ['A. $a\\sqrt{3}$', 'B. $2a$', 'C. $a$', 'D. $\\frac{a\\sqrt{3}}{2}$'],
        correctIndex: 0,
        explanation: 'Gọi $M$ là trung điểm $BC$, ta có $\\vec{AB} + \\vec{AC} = 2\\vec{AM}$. Đường cao tam giác đều $AM = \\frac{a\\sqrt{3}}{2} \\Rightarrow |2\\vec{AM}| = a\\sqrt{3}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 10 (2006) · Biến đổi đẳng thức vectơ',
        question: 'Cho 4 điểm $A, B, C, D$ bất kì và gọi $I, J$ lần lượt là trung điểm của $AB, CD$. Chứng minh $\\vec{AC} + \\vec{BD} = 2\\vec{IJ}$.',
        hints: ['Chèn điểm $I, J$ vào $\\vec{AC}$ và $\\vec{BD}$ rồi cộng lại, dùng $\\vec{IA} + \\vec{IB} = \\vec{0}$ và $\\vec{JC} + \\vec{JD} = \\vec{0}$.'],
        solutionSteps: [
          'Bước 1: $\\vec{AC} = \\vec{AI} + \\vec{IJ} + \\vec{JC}$ và $\\vec{BD} = \\vec{BI} + \\vec{IJ} + \\vec{JD}$.',
          'Bước 2: Cộng vế theo vế: $\\vec{AC} + \\vec{BD} = (\\vec{AI} + \\vec{BI}) + 2\\vec{IJ} + (\\vec{JC} + \\vec{JD}) = \\vec{0} + 2\\vec{IJ} + \\vec{0} = 2\\vec{IJ}$.'
        ],
        finalAnswer: '$\\vec{AC} + \\vec{BD} = 2\\vec{IJ}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  {
    id: 'math-2006-10-14',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 14,
    stageLabel: 'Toán 10 (2006) · HH Chương I: Vectơ',
    sourceTag: 'SGK Hình học 10 (2006) · Bài 4',
    title: 'Bài 14 (2006): Hệ trục tọa độ Oxy & Tọa độ điểm – vectơ',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Biểu thức tọa độ các phép toán cộng/trừ/nhân số với vectơ, tọa độ vectơ $\\vec{AB} = (x_B - x_A; y_B - y_A)$, trung điểm và trọng tâm tam giác.',
    mnemonics: [
      'Tọa độ vectơ $\\vec{AB}$ lấy **Ngọn trừ Gốc** ($B - A$).',
      'Trung điểm chia $2$, Trọng tâm chia $3$.'
    ],
    commonTraps: [
      'Nhầm thứ tự $A - B$ khi tính tọa độ $\\vec{AB}$.'
    ],
    theory: [
      '1. Tọa độ vectơ: Nếu $\\vec{u} = x\\vec{i} + y\\vec{j}$ thì $\\vec{u} = (x; y)$. Với $\\vec{a} = (a_1; a_2), \\vec{b} = (b_1; b_2)$: $\\vec{a} \\pm \\vec{b} = (a_1 \\pm b_1; a_2 \\pm b_2)$; $k\\vec{a} = (ka_1; ka_2)$.',
      '2. Tọa độ điểm đặc biệt: Trung điểm $I$ của $AB$ có $x_I = \\frac{x_A+x_B}{2}, y_I = \\frac{y_A+y_B}{2}$. Trọng tâm $G$ của $\\triangle ABC$ có $x_G = \\frac{x_A+x_B+x_C}{3}, y_G = \\frac{y_A+y_B+y_C}{3}$.'
    ],
    keyFormulas: [
      '\\vec{AB} = (x_B - x_A;\\ y_B - y_A)',
      'G\\left(\\frac{x_A+x_B+x_C}{3};\\ \\frac{y_A+y_B+y_C}{3}\\right)'
    ],
    flashcards: [
      { front: 'Hai vectơ $\\vec{u} = (2; -4)$ và $\\vec{v} = (m; 6)$ cùng phương khi $m$ bằng?', back: '$\\frac{m}{2} = \\frac{6}{-4} \\iff m = -3$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 10 (2006) · Bài 4',
        question: 'Trong mặt phẳng $Oxy$, cho $A(1; 2), B(3; -4), C(5; 8)$. Tọa độ trọng tâm $G$ của $\\triangle ABC$ là:',
        options: ['A. $(3; 2)$', 'B. $(9; 6)$', 'C. $(2; 3)$', 'D. $(3; -2)$'],
        correctIndex: 0,
        explanation: '$x_G = \\frac{1+3+5}{3} = 3$; $y_G = \\frac{2-4+8}{3} = 2 \\Rightarrow G(3; 2)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 10 (2006) · Hình bình hành Oxy',
        question: 'Cho $A(1; 1), B(3; 2), C(4; 5)$. Tìm tọa độ đỉnh $D$ để $ABCD$ là hình bình hành.',
        hints: ['Dùng điều kiện $\\vec{AB} = \\vec{DC}$.'],
        solutionSteps: [
          'Bước 1: $\\vec{AB} = (2; 1)$ và $\\vec{DC} = (4 - x_D; 5 - y_D)$.',
          'Bước 2: $\\vec{AB} = \\vec{DC} \\iff 4 - x_D = 2$ và $5 - y_D = 1 \\iff x_D = 2, y_D = 4$.'
        ],
        finalAnswer: '$D(2; 4)$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  // ==================== HÌNH HỌC 10 · CHƯƠNG II: TÍCH VÔ HƯỚNG & HỆ THỨC LƯỢNG ====================
  {
    id: 'math-2006-10-15',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 15,
    stageLabel: 'Toán 10 (2006) · HH Chương II: Tích vô hướng & Hệ thức lượng tam giác',
    sourceTag: 'SGK Hình học 10 (2006) · Bài 1–2',
    title: 'Bài 15 (2006): Giá trị lượng giác 0°–180° & Tích vô hướng hai vectơ',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Góc bù nhau ($\\sin(180^\\circ - \\alpha) = \\sin\\alpha$, $\\cos(180^\\circ - \\alpha) = -\\cos\\alpha$), định nghĩa tích vô hướng, biểu thức tọa độ và công thức tính độ dài – góc giữa hai vectơ.',
    mnemonics: [
      'Tích vô hướng là MỘT SỐ (không phải vectơ!): $\\vec{a}\\cdot\\vec{b} = x_1x_2 + y_1y_2$.',
      'Hai vectơ vuông góc $\\iff \\vec{a}\\cdot\\vec{b} = 0$.'
    ],
    commonTraps: [
      'Nhầm góc giữa $\\vec{AB}$ và $\\vec{BC}$ trong tam giác là $\\widehat{B}$ (thực chất phải đưa về chung gốc nên góc là $180^\\circ - \\widehat{B}$!).'
    ],
    theory: [
      '1. Định nghĩa & Biểu thức tọa độ: $\\vec{a}\\cdot\\vec{b} = |\\vec{a}||\\vec{b}|\\cos(\\vec{a}, \\vec{b}) = x_1 x_2 + y_1 y_2$. Độ dài vectơ $|\\vec{a}| = \\sqrt{x_1^2 + y_1^2}$. Khoảng cách $AB = \\sqrt{(x_B-x_A)^2 + (y_B-y_A)^2}$.',
      '2. Góc giữa hai vectơ: $\\cos(\\vec{a}, \\vec{b}) = \\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}||\\vec{b}|} = \\frac{x_1 x_2 + y_1 y_2}{\\sqrt{x_1^2+y_1^2}\\sqrt{x_2^2+y_2^2}}$.'
    ],
    keyFormulas: [
      '\\vec{a}\\cdot\\vec{b} = |\\vec{a}||\\vec{b}|\\cos(\\vec{a}, \\vec{b}) = x_1 x_2 + y_1 y_2',
      '\\vec{a} \\perp \\vec{b} \\iff x_1 x_2 + y_1 y_2 = 0'
    ],
    flashcards: [
      { front: 'Tam giác $ABC$ đều cạnh $a$. Tích vô hướng $\\vec{AB}\\cdot\\vec{BC}$ bằng?', back: 'Góc $(\\vec{AB}, \\vec{BC}) = 120^\\circ \\Rightarrow a\\cdot a\\cdot\\cos 120^\\circ = -\\frac{a^2}{2}$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 10 (2006) · Bài 2',
        question: 'Cho $\\vec{a} = (3; -4)$ và $\\vec{b} = (4; 3)$. Góc giữa hai vectơ $\\vec{a}$ và $\\vec{b}$ là:',
        options: ['A. $90^\\circ$', 'B. $0^\\circ$', 'C. $60^\\circ$', 'D. $45^\\circ$'],
        correctIndex: 0,
        explanation: '$\\vec{a}\\cdot\\vec{b} = 3\\cdot 4 + (-4)\\cdot 3 = 0 \\Rightarrow \\vec{a} \\perp \\vec{b}$, góc bằng $90^\\circ$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 10 (2006) · Tích vô hướng Oxy',
        question: 'Trong mặt phẳng $Oxy$, cho $A(1; 2), B(4; 6), C(-3; 5)$. Chứng minh tam giác $ABC$ vuông tại $A$ và tính diện tích $\\triangle ABC$.',
        hints: ['Tính $\\vec{AB}, \\vec{AC}$ rồi kiểm tra $\\vec{AB}\\cdot\\vec{AC} = 0$.'],
        solutionSteps: [
          'Bước 1: $\\vec{AB} = (3; 4)$, $\\vec{AC} = (-4; 3)$.',
          'Bước 2: $\\vec{AB}\\cdot\\vec{AC} = 3(-4) + 4\\cdot 3 = 0 \\Rightarrow AB \\perp AC$ tại $A$.',
          'Bước 3: $AB = 5$, $AC = 5 \\Rightarrow S_{\\triangle ABC} = \\frac{1}{2}\\cdot 5 \\cdot 5 = 12{,}5$.'
        ],
        finalAnswer: '$\\triangle ABC$ vuông cân tại $A$, diện tích $S = 12{,}5$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  {
    id: 'math-2006-10-16',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 16,
    stageLabel: 'Toán 10 (2006) · HH Chương II: Tích vô hướng & Hệ thức lượng tam giác',
    sourceTag: 'SGK Hình học 10 (2006) · Bài 3',
    title: 'Bài 16 (2006): Định lí Côsin, Định lí Sin, Trung tuyến & Diện tích tam giác',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Định lí Côsin $a^2 = b^2 + c^2 - 2bc\\cos A$, định lí Sin $\\frac{a}{\\sin A} = 2R$, công thức độ dài đường trung tuyến $m_a^2$ và 5 công thức tính diện tích tam giác.',
    mnemonics: [
      'Biết 2 cạnh và góc xen giữa $\\to$ dùng Định lí Côsin. Biết cạnh và góc đối diện $\\to$ dùng Định lí Sin.',
      'Trung tuyến $m_a^2 = \\frac{b^2 + c^2}{2} - \\frac{a^2}{4}$.'
    ],
    commonTraps: [
      'Nhầm $R$ (bán kính ngoại tiếp) và $r$ (bán kính nội tiếp) trong $S = \\frac{abc}{4R}$ và $S = p\\cdot r$.'
    ],
    theory: [
      '1. Định lí Côsin & Trung tuyến: $a^2 = b^2 + c^2 - 2bc\\cos A \\Rightarrow \\cos A = \\frac{b^2+c^2-a^2}{2bc}$. Độ dài trung tuyến xuất phát từ $A$: $m_a^2 = \\frac{2(b^2+c^2) - a^2}{4}$.',
      '2. Định lí Sin & Diện tích: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$. Diện tích: $S = \\frac{1}{2}bc\\sin A = \\frac{abc}{4R} = pr = \\sqrt{p(p-a)(p-b)(p-c)}$ (với $p = \\frac{a+b+c}{2}$).'
    ],
    keyFormulas: [
      'a^2 = b^2 + c^2 - 2bc\\cos A, \\quad \\frac{a}{\\sin A} = 2R',
      'S = \\frac{1}{2}bc\\sin A = \\sqrt{p(p-a)(p-b)(p-c)} = \\frac{abc}{4R} = pr'
    ],
    flashcards: [
      { front: 'Tam giác $ABC$ có $BC = 6, \\widehat{A} = 30^\\circ$. Bán kính đường tròn ngoại tiếp $R$ bằng?', back: '$2R = \\frac{6}{\\sin 30^\\circ} = 12 \\Rightarrow R = 6$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 10 (2006) · Bài 3',
        question: 'Tam giác $ABC$ có $a = 5, b = 6, c = 7$. Số đo $\\cos A$ bằng:',
        options: ['A. $\\frac{5}{7}$', 'B. $\\frac{1}{5}$', 'C. $\\frac{19}{35}$', 'D. $\\frac{3}{7}$'],
        correctIndex: 0,
        explanation: '$\\cos A = \\frac{b^2 + c^2 - a^2}{2bc} = \\frac{36 + 49 - 25}{2\\cdot 6\\cdot 7} = \\frac{60}{84} = \\frac{5}{7}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 10 (2006) · Giải tam giác',
        question: 'Tam giác $ABC$ có $a = 13, b = 14, c = 15$. Tính diện tích $S$, bán kính ngoại tiếp $R$ và bán kính nội tiếp $r$.',
        hints: ['Tính $p = 21$, dùng Heron tìm $S$, sau đó suy ra $r = S/p$ và $R = abc/(4S)$.'],
        solutionSteps: [
          'Bước 1: $p = \\frac{13+14+15}{2} = 21$.',
          'Bước 2: $S = \\sqrt{21 \\cdot 8 \\cdot 7 \\cdot 6} = 84$.',
          'Bước 3: $r = \\frac{S}{p} = \\frac{84}{21} = 4$; $R = \\frac{13\\cdot 14\\cdot 15}{4\\cdot 84} = \\frac{65}{8} = 8{,}125$.'
        ],
        finalAnswer: '$S = 84;\\ r = 4;\\ R = 8{,}125$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  },
  // ==================== HÌNH HỌC 10 · CHƯƠNG III: PHƯƠNG PHÁP TỌA ĐỘ TRONG MẶT PHẲNG ====================
  {
    id: 'math-2006-10-17',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 17,
    stageLabel: 'Toán 10 (2006) · HH Chương III: Phương pháp tọa độ Oxy',
    sourceTag: 'SGK Hình học 10 (2006) · Bài 1',
    title: 'Bài 17 (2006): Phương trình Đường thẳng, Góc & Khoảng cách trong Oxy',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Phương trình tham số, phương trình tổng quát, vị trí tương đối hai đường thẳng, góc giữa hai đường thẳng và công thức khoảng cách từ điểm tới đường thẳng.',
    mnemonics: [
      'VTPT $\\vec{n} = (A; B)$ vuông góc VTCP $\\vec{u} = (-B; A)$.',
      'Góc giữa hai đường thẳng luôn $\\le 90^\\circ$ nên tử thức phải có dấu trị tuyệt đối $|\\vec{n}_1\\cdot\\vec{n}_2|$.'
    ],
    commonTraps: [
      'Quên dấu giá trị tuyệt đối trên tử số công thức khoảng cách hoặc góc giữa hai đường thẳng.'
    ],
    theory: [
      '1. Phương trình đường thẳng: Tổng quát $Ax + By + C = 0$ (VTPT $\\vec{n} = (A; B)$); Tham số $\\begin{cases} x = x_0 + u_1 t \\\\ y = y_0 + u_2 t \\end{cases}$ (VTCP $\\vec{u} = (u_1; u_2)$).',
      '2. Góc và Khoảng cách: $\\cos(\\Delta_1, \\Delta_2) = \\frac{|A_1 A_2 + B_1 B_2|}{\\sqrt{A_1^2+B_1^2}\\sqrt{A_2^2+B_2^2}}$; $d(M_0, \\Delta) = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2+B^2}}$.'
    ],
    keyFormulas: [
      'd(M_0, \\Delta) = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2+B^2}}',
      '\\cos(\\Delta_1, \\Delta_2) = \\frac{|\\vec{n}_1\\cdot\\vec{n}_2|}{|\\vec{n}_1||\\vec{n}_2|}'
    ],
    flashcards: [
      { front: 'Đường thẳng $2x - 3y + 5 = 0$ có một vectơ chỉ phương là gì?', back: 'VTPT $\\vec{n}=(2; -3) \\Rightarrow$ VTCP $\\vec{u} = (3; 2)$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 10 (2006) · Bài 1',
        question: 'Khoảng cách từ điểm $A(2; -1)$ đến đường thẳng $\\Delta: 3x - 4y - 20 = 0$ là:',
        options: ['A. $2$', 'B. $10$', 'C. $4$', 'D. $1$'],
        correctIndex: 0,
        explanation: '$d = \\frac{|3\\cdot 2 - 4(-1) - 20|}{\\sqrt{3^2 + (-4)^2}} = \\frac{|-10|}{5} = 2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 10 (2006) · Đường cao tam giác',
        question: 'Cho $A(1; 2), B(3; 1), C(5; 4)$. Viết phương trình tổng quát đường cao $AH$ của tam giác $ABC$.',
        hints: ['Đường cao $AH \\perp BC$ nên nhận $\\vec{BC}$ làm VTPT.'],
        solutionSteps: [
          'Bước 1: $AH \\perp BC \\Rightarrow$ VTPT của $AH$ là $\\vec{n} = \\vec{BC} = (2; 3)$.',
          'Bước 2: Đi qua $A(1; 2)$: $2(x - 1) + 3(y - 2) = 0 \\iff 2x + 3y - 8 = 0$.'
        ],
        finalAnswer: '$2x + 3y - 8 = 0$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'line_plane_oxyz'
  },
  {
    id: 'math-2006-10-18',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 18,
    stageLabel: 'Toán 10 (2006) · HH Chương III: Phương pháp tọa độ Oxy',
    sourceTag: 'SGK Hình học 10 (2006) · Bài 2',
    title: 'Bài 18 (2006): Phương trình Đường tròn & Phương trình Tiếp tuyến',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Phương trình đường tròn dạng chuẩn $(x-a)^2 + (y-b)^2 = R^2$ và dạng khai triển $x^2 + y^2 - 2ax - 2by + c = 0$, điều kiện tồn tại và viết phương trình tiếp tuyến.',
    mnemonics: [
      'Từ $x^2 + y^2 - 2ax - 2by + c = 0$: lấy hệ số $x, y$ CHIA CHO $-2$ để được tâm $I(a; b)$; bán kính $R = \\sqrt{a^2 + b^2 - c}$ ($a^2 + b^2 - c > 0$).',
      'Tiếp tuyến $\\Delta$ tiếp xúc $(I; R) \\iff d(I, \\Delta) = R$.'
    ],
    commonTraps: [
      'Quên chia cho $-2$ (chỉ chia $2$ hoặc quên đổi dấu) khi đọc tọa độ tâm đường tròn.',
      'Quên điều kiện hệ số của $x^2$ và $y^2$ phải BẰNG NHAU.'
    ],
    theory: [
      '1. Hai dạng phương trình đường tròn: Tâm $I(a; b)$, bán kính $R$: $(x - a)^2 + (y - b)^2 = R^2$. Khai triển: $x^2 + y^2 - 2ax - 2by + c = 0$ là đường tròn khi và chỉ khi $a^2 + b^2 - c > 0$, khi đó $R = \\sqrt{a^2 + b^2 - c}$.',
      '2. Phương trình tiếp tuyến tại điểm $M_0(x_0; y_0) \\in (C)$: $(x_0 - a)(x - x_0) + (y_0 - b)(y - y_0) = 0$.'
    ],
    keyFormulas: [
      '(x - a)^2 + (y - b)^2 = R^2',
      'x^2 + y^2 - 2ax - 2by + c = 0 \\implies R = \\sqrt{a^2 + b^2 - c}\\ (a^2+b^2-c>0)'
    ],
    flashcards: [
      { front: 'Đường tròn $x^2 + y^2 + 6x - 8y + 9 = 0$ có tâm và bán kính là gì?', back: 'Tâm $I(-3; 4)$, $R = \\sqrt{(-3)^2 + 4^2 - 9} = \\sqrt{16} = 4$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 10 (2006) · Bài 2',
        question: 'Đường tròn tâm $I(2; -1)$ đi qua $M(5; 3)$ có phương trình là:',
        options: [
          'A. $(x - 2)^2 + (y + 1)^2 = 25$',
          'B. $(x - 2)^2 + (y + 1)^2 = 5$',
          'C. $(x + 2)^2 + (y - 1)^2 = 25$',
          'D. $(x - 2)^2 + (y - 1)^2 = 25$'
        ],
        correctIndex: 0,
        explanation: 'Bán kính $R^2 = IM^2 = (5-2)^2 + (3+1)^2 = 9 + 16 = 25$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 10 (2006) · Tiếp tuyến song song',
        question: 'Viết phương trình tiếp tuyến của đường tròn $(C): (x - 1)^2 + (y - 2)^2 = 5$ biết tiếp tuyến song song với đường thẳng $d: 2x + y - 3 = 0$.',
        hints: ['Đặt tiếp tuyến $\\Delta: 2x + y + m = 0\\ (m \\neq -3)$ rồi giải $d(I, \\Delta) = \\sqrt{5}$.'],
        solutionSteps: [
          'Bước 1: Tâm $I(1; 2)$, bán kính $R = \\sqrt{5}$. Do $\\Delta \\parallel d \\Rightarrow \\Delta: 2x + y + m = 0\\ (m \\neq -3)$.',
          'Bước 2: $d(I, \\Delta) = \\frac{|2\\cdot 1 + 2 + m|}{\\sqrt{5}} = \\sqrt{5} \\iff |m + 4| = 5 \\iff m = 1$ hoặc $m = -9$ (cả hai thỏa $m \\neq -3$).'
        ],
        finalAnswer: '$2x + y + 1 = 0$ và $2x + y - 9 = 0$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  },
  {
    id: 'math-2006-10-19',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 19,
    stageLabel: 'Toán 10 (2006) · HH Chương III: Phương pháp tọa độ Oxy',
    sourceTag: 'SGK Hình học 10 (2006) · Bài 3',
    title: 'Bài 19 (2006): Phương trình Đường Elip (E): x²/a² + y²/b² = 1',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Định nghĩa Elip là tập hợp điểm $MF_1 + MF_2 = 2a$, phương trình chính tắc Elip $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1\\ (a > b > 0)$, tiêu cự $2c$, độ dài trục lớn – trục nhỏ và tâm sai.',
    mnemonics: [
      'Trong Elip, $a$ LUÔN LỚN NHẤT: $a^2 = b^2 + c^2 \\iff c^2 = a^2 - b^2$.',
      'Trục lớn $A_1 A_2 = 2a$, trục nhỏ $B_1 B_2 = 2b$, tiêu cự $F_1 F_2 = 2c$.'
    ],
    commonTraps: [
      'Nhầm $c^2 = a^2 + b^2$ (đó là của Hypebol; Elip có $c^2 = a^2 - b^2$).',
      'Quên nhân đôi $a, b, c$ khi đề hỏi độ dài trục lớn, trục nhỏ, tiêu cự.'
    ],
    theory: [
      '1. Định nghĩa Elip: Cho hai điểm cố định $F_1, F_2$ với $F_1 F_2 = 2c > 0$. Elip là tập hợp các điểm $M$ sao cho $MF_1 + MF_2 = 2a$ (với $a > c$).',
      '2. Phương trình chính tắc: $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ (với $b^2 = a^2 - c^2 > 0$). Các đỉnh $(\\pm a; 0)$ và $(0; \\pm b)$, hai tiêu điểm $F_1(-c; 0), F_2(c; 0)$, tâm sai $e = \\frac{c}{a} < 1$.'
    ],
    keyFormulas: [
      '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 \\quad (a > b > 0,\\ c^2 = a^2 - b^2)',
      'MF_1 + MF_2 = 2a, \\quad e = \\frac{c}{a} < 1'
    ],
    flashcards: [
      { front: 'Elip $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$ có tiêu cự bằng bao nhiêu?', back: '$a^2 = 25, b^2 = 9 \\Rightarrow c = \\sqrt{25 - 9} = 4 \\Rightarrow$ Tiêu cự $2c = 8$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 10 (2006) · Bài 3',
        question: 'Elip $(E): 4x^2 + 9y^2 = 36$ có độ dài trục lớn bằng:',
        options: ['A. $6$', 'B. $3$', 'C. $4$', 'D. $2$'],
        correctIndex: 0,
        explanation: 'Chia cho $36$: $\\frac{x^2}{9} + \\frac{y^2}{4} = 1 \\Rightarrow a = 3 \\Rightarrow$ Trục lớn $2a = 6$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 10 (2006) · Viết phương trình Elip',
        question: 'Viết phương trình chính tắc của Elip $(E)$ có một tiêu điểm $F_2(3; 0)$ và đi qua điểm $M(0; 4)$.',
        hints: ['Từ $F_2(3;0) \\Rightarrow c = 3$; $M(0; 4)$ nằm trên trục nhỏ $\\Rightarrow b = 4$.'],
        solutionSteps: [
          'Bước 1: $c = 3$, thay $M(0; 4)$ vào phương trình chính tắc được $\\frac{16}{b^2} = 1 \\Rightarrow b^2 = 16$.',
          'Bước 2: $a^2 = b^2 + c^2 = 16 + 9 = 25$. Vậy $(E): \\frac{x^2}{25} + \\frac{y^2}{16} = 1$.'
        ],
        finalAnswer: '$(E): \\frac{x^2}{25} + \\frac{y^2}{16} = 1$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'conic_sections_3d'
  },
  {
    id: 'math-2006-10-20',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 10',
    lessonNumber: 20,
    stageLabel: 'Toán 10 (2006) · HH Chương III: Phương pháp tọa độ Oxy',
    sourceTag: 'SGK Hình học 10 (2006) · Ôn tập cuối năm',
    title: 'Bài 20 (2006): Tổng hợp Đường thẳng – Đường tròn – Elip & Đường đối xứng',
    grade: 'Lớp 10 · Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 19,
    description:
      'Kỹ thuật viết phương trình đường phân giác hai đường thẳng, tìm hình chiếu vuông góc – điểm đối xứng qua đường thẳng và bài toán tương giao đường thẳng với đường tròn, Elip.',
    mnemonics: [
      'Điểm $M(x; y)$ cách đều $\\Delta_1$ và $\\Delta_2 \\iff d(M, \\Delta_1) = d(M, \\Delta_2)$ (thu được cặp đường phân giác).',
      'Tìm hình chiếu $H$ của $M$ lên $d$: viết đường thẳng qua $M$ vuông góc $d$ rồi tìm giao điểm.'
    ],
    commonTraps: [
      'Quên có TỚI HAI đường phân giác vuông góc nhau của hai đường thẳng cắt nhau.'
    ],
    theory: [
      '1. Đường phân giác của góc tạo bởi hai đường thẳng $\\Delta_1, \\Delta_2$: $\\frac{|A_1 x + B_1 y + C_1|}{\\sqrt{A_1^2 + B_1^2}} = \\frac{|A_2 x + B_2 y + C_2|}{\\sqrt{A_2^2 + B_2^2}}$.',
      '2. Điểm đối xứng & Hình chiếu: Hình chiếu $H$ của $M$ lên $\\Delta$ là giao điểm của $\\Delta$ và đường thẳng qua $M$ vuông góc với $\\Delta$; điểm đối xứng $M\'$ thỏa $H$ là trung điểm $MM\'$ ($\\vec{OM\'} = 2\\vec{OH} - \\vec{OM}$).'
    ],
    keyFormulas: [
      '\\frac{A_1 x + B_1 y + C_1}{\\sqrt{A_1^2+B_1^2}} = \\pm \\frac{A_2 x + B_2 y + C_2}{\\sqrt{A_2^2+B_2^2}}',
      'x_{M\'} = 2x_H - x_M, \\quad y_{M\'} = 2y_H - y_M'
    ],
    flashcards: [
      { front: 'Điểm đối xứng với $M(3; -5)$ qua đường thẳng $x = 1$?', back: 'Trung điểm nằm trên $x=1$ nên $x\' = 2\\cdot 1 - 3 = -1$, $y\' = -5 \\Rightarrow M\'(-1; -5)$.' }
    ],
    sampleProblems: [
      {
        source: 'Ôn tập Hình học 10 (2006)',
        question: 'Hình chiếu vuông góc của điểm $M(2; 3)$ lên đường thẳng $\\Delta: x - y + 1 = 0$ là điểm:',
        options: ['A. $(2; 3)$', 'B. $(3; 2)$', 'C. $(1; 2)$', 'D. $(0; 1)$'],
        correctIndex: 0,
        explanation: 'Thử tọa độ $M(2; 3)$ vào $\\Delta$: $2 - 3 + 1 = 0$, chứng tỏ $M \\in \\Delta$ nên hình chiếu chính là $M(2; 3)$!'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 10 (2006) · Tìm hình chiếu & đối xứng',
        question: 'Tìm hình chiếu $H$ và điểm đối xứng $M\'$ của $M(1; 4)$ qua đường thẳng $\\Delta: x + y - 1 = 0$.',
        hints: ['Đường thẳng $d$ qua $M$ vuông góc $\\Delta$ có dạng $x - y + c = 0$.'],
        solutionSteps: [
          'Bước 1: $d \\perp \\Delta$ đi qua $M(1; 4)$ có phương trình: $1(x - 1) - 1(y - 4) = 0 \\iff x - y + 3 = 0$.',
          'Bước 2: Tọa độ $H$ thỏa hệ $\\begin{cases} x + y = 1 \\\\ x - y = -3 \\end{cases} \\iff H(-1; 2)$.',
          'Bước 3: $M\'$ đối xứng $M$ qua $H$: $x_{M\'} = 2(-1) - 1 = -3$, $y_{M\'} = 2(2) - 4 = 0 \\Rightarrow M\'(-3; 0)$.'
        ],
        finalAnswer: '$H(-1; 2)$; $M\'(-3; 0)$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'conic_sections_3d'
  }
];
