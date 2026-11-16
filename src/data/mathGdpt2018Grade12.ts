import { MathLecture } from '../types';

export const MATH_GDPT_12_LESSONS: MathLecture[] = [
  // CHƯƠNG I: ỨNG DỤNG ĐẠO HÀM ĐỂ KHẢO SÁT VÀ VẼ ĐỒ THỊ HÀM SỐ
  {
    id: 'math-12-b1',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 1,
    stageLabel: 'Chương I · Ứng Dụng Đạo Hàm Khảo Sát Hàm Số',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 1',
    title: 'Bài 1: Tính đơn điệu và cực trị của hàm số',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description: 'Định lí về dấu của $f\'(x)$ xét khoảng đồng biến, nghịch biến; quy tắc tìm điểm cực đại, điểm cực tiểu và bài toán tham số $m$ trên hàm bậc 3, hàm phân thức.',
    mnemonics: ['$f\'(x)$ đổi dấu từ $+$ sang $-$ qua $x_0 \\implies x_0$ là điểm CỰC ĐẠI; từ $-$ sang $+ \\implies$ điểm CỰC TIỂU.'],
    commonTraps: ['Nhầm "Điểm cực trị của hàm số" ($x_0$) với "Giá trị cực trị của hàm số" ($y_0$) và "Điểm cực trị của đồ thị" ($M(x_0; y_0)$).'],
    theory: [
      '1. $f\'(x) \\ge 0$ trên $K$ (bằng $0$ tại hữu hạn điểm) $\\implies f$ đồng biến trên $K$.',
      '2. Cực trị: $x_0$ là điểm cực trị nếu $f\'(x)$ đổi dấu khi $x$ qua $x_0$ (hoặc $f\'(x_0)=0, f\'\'(x_0)\\neq 0$).',
      '3. Với hàm phân thức $\\frac{ax+b}{cx+d}$, luôn kết luận đơn điệu trên TỪNG KHOẢNG xác định, KHÔNG viết dấu hợp $\\cup$.'
    ],
    keyFormulas: ['f\'(x) > 0 \\implies f \\text{ đồng biến}', 'f\'(x_0) = 0,\\ f\'\'(x_0) < 0 \\implies x_0 \\text{ cực đại}'],
    flashcards: [{ front: 'Hàm $y = \\frac{x+2}{x-1}$ nghịch biến trên tập nào?', back: 'Nghịch biến trên từng khoảng $(-\\infty; 1)$ và $(1; +\\infty)$ (KHÔNG viết $\\mathbb{R}\\setminus\\{1\\}$).' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 1',
        question: 'Hàm số $y = x^3 - 3x^2 + 2$ nghịch biến trên khoảng nào sau đây?',
        options: ['A. $(0; 2)$', 'B. $(-\\infty; 0)$', 'C. $(2; +\\infty)$', 'D. $(0; +\\infty)$'],
        correctIndex: 0,
        explanation: '$y\' = 3x^2 - 6x < 0 \\iff 0 < x < 2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Đơn điệu chứa tham số',
        question: 'Tìm tất cả giá trị $m$ để hàm số $y = \\frac{1}{3}x^3 - mx^2 + (m+2)x - 1$ đồng biến trên $\\mathbb{R}$.',
        hints: ['$y\' \\ge 0, \\forall x\\in\\mathbb{R} \\iff \\Delta\' \\le 0$.'],
        solutionSteps: ['Bước 1: $y\' = x^2 - 2mx + m + 2$.', 'Bước 2: $\\Delta\' = m^2 - m - 2 \\le 0 \\iff -1 \\le m \\le 2$.'],
        finalAnswer: '$-1 \\le m \\le 2$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: -3, c: 0, d: 2 }, color: '#2563eb', name: 'y = x³ - 3x² + 2' }
  },
  {
    id: 'math-4',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 2,
    stageLabel: 'Chương I · Ứng Dụng Đạo Hàm Khảo Sát Hàm Số',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 2',
    title: 'Bài 2: Giá trị lớn nhất và giá trị nhỏ nhất của hàm số',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Quy trình 3 bước tìm $\\max_{[a;b]} f(x)$ và $\\min_{[a;b]} f(x)$ của hàm liên tục trên đoạn $[a; b]$, cùng phương pháp bảng biến thiên trên khoảng mở $(a; b)$.',
    mnemonics: ['Trên đoạn $[a; b]$: tìm các điểm tới hạn $x_i \\in (a; b)$ sao cho $f\'(x_i)=0$ hoặc không xác định, rồi so sánh $f(a), f(b), f(x_i)$.'],
    commonTraps: ['Nhận nhầm điểm $x_i$ nằm NGOÀI đoạn $[a; b]$ vào tập so sánh.'],
    theory: [
      '1. Nếu $f$ liên tục trên $[a; b]$ thì luôn tồn tại cả GTLN và GTNN trên $[a; b]$.',
      '2. Nếu xét trên khoảng $(a; b)$ hoặc nửa khoảng, phải lập Bảng biến thiên để kết luận.'
    ],
    keyFormulas: ['\\max_{[a;b]} f(x) = \\max\\{f(a), f(b), f(x_i)\\}'],
    flashcards: [{ front: 'Tìm GTLN của $y = x^3 - 3x + 2$ trên $[0; 2]$?', back: '$y\'=3x^2-3=0\\implies x=1\\in(0;2)$. $y(0)=2, y(1)=0, y(2)=4 \\implies \\max = 4$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 2',
        question: 'Giá trị nhỏ nhất của hàm số $y = x + \\frac{4}{x}$ trên đoạn $[1; 3]$ là:',
        options: ['A. $4$', 'B. $5$', 'C. $\\frac{13}{3}$', 'D. $2$'],
        correctIndex: 0,
        explanation: '$y\' = 1 - \\frac{4}{x^2} = 0 \\implies x = 2 \\in [1;3]$. $y(1)=5, y(2)=4, y(3)=\\frac{13}{3} \\implies \\min = 4$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Tối ưu thể tích hộp',
        question: 'Từ tấm tôn vuông cạnh $12\\text{ cm}$, cắt 4 góc 4 hình vuông cạnh $x$ để gập thành hộp không nắp. Tìm $x$ để thể tích hộp lớn nhất.',
        hints: ['$V(x) = x(12 - 2x)^2$ với $x \\in (0; 6)$.'],
        solutionSteps: ['Bước 1: $V\'(x) = (12-2x)(12-6x) = 0 \\implies x = 2\\text{ cm}$.', 'Bước 2: Tại $x=2$, $V_{\\max} = 2\\cdot 8^2 = 128\\text{ cm}^3$.'],
        finalAnswer: '$x = 2\\text{ cm}$, $V_{\\max} = 128\\text{ cm}^3$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: 0, c: -3, d: 2 }, color: '#0ea5e9', name: 'Cực trị & GTLN-GTNN' }
  },
  {
    id: 'math-2',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 3,
    stageLabel: 'Chương I · Ứng Dụng Đạo Hàm Khảo Sát Hàm Số',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 3',
    title: 'Bài 3: Đường tiệm cận của đồ thị hàm số (Đứng, Ngang & Xiên)',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description: 'Xác định đường tiệm cận đứng ($x=x_0$), tiệm cận ngang ($y=y_0$) và điểm mới GDPT 2018: ĐƯỜNG TIỆM CẬN XIÊN $y = ax + b$ với $a = \\lim_{x\\to\\pm\\infty}\\frac{f(x)}{x}, b = \\lim_{x\\to\\pm\\infty}(f(x)-ax)$.',
    mnemonics: ['Với hàm phân thức bậc 2 trên bậc 1 $\\frac{Ax^2+Bx+C}{Px+Q}$: chia đa thức được $ax + b + \\frac{r}{Px+Q} \\implies$ tiệm cận xiên là $y = ax + b$!'],
    commonTraps: ['Quên kiểm tra nghiệm của mẫu có làm tử bằng $0$ hay không trước khi kết luận tiệm cận đứng; hoặc quên tiệm cận xiên khi bậc tử = bậc mẫu + 1.'],
    theory: [
      '1. TCN $y = y_0$ nếu $\\lim_{x\\to+\\infty} f(x) = y_0$ hoặc $\\lim_{x\\to-\\infty} f(x) = y_0$.',
      '2. TCĐ $x = x_0$ nếu ít nhất một trong các giới hạn một bên $\\lim_{x\\to x_0^\\pm} f(x) = \\pm\\infty$.',
      '3. Tiệm cận xiên $y = ax + b$ ($a \\neq 0$) nếu $\\lim_{x\\to\\pm\\infty} [f(x) - (ax+b)] = 0$, với $a = \\lim \\frac{f(x)}{x}$ và $b = \\lim(f(x) - ax)$.'
    ],
    keyFormulas: ['a = \\lim_{x\\to\\pm\\infty}\\frac{f(x)}{x},\\quad b = \\lim_{x\\to\\pm\\infty}[f(x)-ax]', 'y = ax + b + \\frac{r}{px+q} \\implies \\text{TCX: } y = ax + b'],
    flashcards: [{ front: 'Tìm tiệm cận xiên của $y = \\frac{x^2 + 2x + 3}{x - 1}$?', back: 'Chia đa thức: $y = x + 3 + \\frac{6}{x-1} \\implies$ tiệm cận xiên là $y = x + 3$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 3 (Tiệm cận xiên)',
        question: 'Đường tiệm cận xiên của đồ thị hàm số $y = 2x - 1 + \\frac{3}{x + 2}$ là:',
        options: ['A. $y = 2x - 1$', 'B. $y = 2x + 3$', 'C. $x = -2$', 'D. $y = 2x$'],
        correctIndex: 0,
        explanation: 'Vì $\\lim_{x\\to\\pm\\infty} [f(x) - (2x-1)] = \\lim_{x\\to\\pm\\infty} \\frac{3}{x+2} = 0$ nên TCX là $y = 2x - 1$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Tiệm cận hàm chứa căn',
        question: 'Tìm tất cả các đường tiệm cận của đồ thị hàm số $y = \\frac{x^2 - x + 1}{x - 1}$.',
        hints: ['Chia tử cho mẫu và xét $x \\to 1^\\pm$.'],
        solutionSteps: ['Bước 1: $y = x + \\frac{1}{x-1}$.', 'Bước 2: TCĐ $x = 1$; TCX $y = x$ (không có TCN).'],
        finalAnswer: 'TCĐ: $x = 1$, TCX: $y = x$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    defaultGraphConfig: { type: 'rational', params: { a: 2, b: 1, c: 1, d: -1 }, color: '#0284c7', name: 'Đồ thị & Tiệm cận' }
  },
  {
    id: 'math-1',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 4,
    stageLabel: 'Chương I · Ứng Dụng Đạo Hàm Khảo Sát Hàm Số',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 4',
    title: 'Bài 4: Khảo sát sự biến thiên và vẽ đồ thị của hàm số',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 20,
    description: 'Khảo sát chuẩn GDPT 2018 cho 3 họ hàm trọng tâm: Bậc ba $y=ax^3+bx^2+cx+d$, Phân thức nhất biến $y=\\frac{ax+b}{cx+d}$ và hàm mới $y = \\frac{ax^2+bx+c}{px+q}$ (bậc 2 trên bậc 1 có tiệm cận xiên & tâm đối xứng là giao của TCĐ và TCX).',
    mnemonics: ['Hàm bậc 2 / bậc 1: Tâm đối xứng $I$ là giao điểm của TCĐ và TCX; nếu có 2 cực trị thì nằm đối xứng qua $I$!'],
    commonTraps: ['Vẫn tìm khảo sát hàm trùng phương trong cấu trúc GDPT 2018 cơ bản (hàm $\\frac{ax^2+bx+c}{px+q}$ thay thế hoàn toàn).'],
    theory: [
      '1. Quy trình 3 bước: (1) TXĐ; (2) Sự biến thiên (chiều biến thiên, cực trị, giới hạn – tiệm cận, bảng biến thiên); (3) Vẽ đồ thị (tâm/trục đối xứng, giao trục tọa độ).',
      '2. Tâm đối xứng của $y=\\frac{ax^2+bx+c}{px+q}$ là giao điểm của tiệm cận đứng $x=-q/p$ và tiệm cận xiên $y=mx+n$.'
    ],
    keyFormulas: ['x_{\\text{uốn}} = -\\frac{b}{3a}', 'I = \\text{TCĐ} \\cap \\text{TCX}'],
    flashcards: [{ front: 'Tâm đối xứng của đồ thị $y = \\frac{x^2 + 3}{x - 1}$ có tọa độ là bao nhiêu?', back: 'TCĐ $x = 1$; $y = x + 1 + \\frac{4}{x-1} \\implies$ TCX $y = x + 1$. Giao điểm $I(1; 2)$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 4',
        question: 'Đồ thị hàm số $y = \\frac{x^2 - 2x + 2}{x - 1}$ có tâm đối xứng là điểm:',
        options: ['A. $I(1; 0)$', 'B. $I(1; 1)$', 'C. $I(-1; 0)$', 'D. $I(0; -2)$'],
        correctIndex: 0,
        explanation: '$y = x - 1 + \\frac{1}{x-1}$. TCĐ $x = 1$, TCX $y = x - 1 \\implies$ giao $I(1; 0)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Khảo sát hàm bậc 2/1',
        question: 'Tìm $x$ cực đại và cực tiểu của hàm số $y = x + \\frac{4}{x}$.',
        hints: ['Giải $y\' = 1 - \\frac{4}{x^2} = 0$.'],
        solutionSteps: ['Bước 1: $y\' = 0 \\iff x = \\pm 2$.', 'Bước 2: $x_{\\text{CĐ}} = -2\\ (y=-4)$, $x_{\\text{CT}} = 2\\ (y=4)$.'],
        finalAnswer: '$x_{\\text{CĐ}} = -2$, $x_{\\text{CT}} = 2$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: -3, c: 0, d: 2 }, color: '#4f46e5', name: 'Khảo sát đồ thị hàm số' }
  },
  {
    id: 'math-12-b5',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 5,
    stageLabel: 'Chương I · Ứng Dụng Đạo Hàm Khảo Sát Hàm Số',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 5',
    title: 'Bài 5: Ứng dụng đạo hàm để giải quyết một số vấn đề liên quan đến thực tiễn',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Vận dụng',
    readTimeMinutes: 18,
    description: 'Bài toán tối ưu hóa kinh tế (chi phí sản xuất, lợi nhuận cực đại), tối ưu hình học (thể tích lớn nhất, diện tích vật liệu nhỏ nhất) và bài toán tốc độ thay đổi trong Vật lí – Sinh học.',
    mnemonics: ['4 bước giải toán thực tế bằng đạo hàm: (1) Đặt biến & điều kiện; (2) Lập hàm mục tiêu $f(x)$; (3) Tìm cực trị bằng $f\'(x)=0$; (4) Đối chiếu ĐK & kết luận.'],
    commonTraps: ['Quên ràng buộc miền giá trị thực tế của ẩn $x$ (độ dài dương, số lượng nguyên, góc nhọn...).'],
    theory: [
      '1. Tốc độ biến thiên tức thời của đại lượng $y = f(t)$ theo thời gian là $f\'(t)$.',
      '2. Lợi nhuận = Doanh thu $-$ Chi phí: $L(x) = R(x) - C(x)$; cực đại tại nghiệm $L\'(x) = 0$.'
    ],
    keyFormulas: ['L(x) = R(x) - C(x)', 'R_{\\text{biên}}(x) = R\'(x),\\ C_{\\text{biên}}(x) = C\'(x)'],
    flashcards: [{ front: 'Một hộ nuôi cá dự tính nếu thả $x$ con/$m^2$ thì mỗi con nặng $480 - 20x$ gam. Thả bao nhiêu con để tổng sản lượng cao nhất?', back: '$P(x) = x(480-20x) \\implies P\'(x) = 480 - 40x = 0 \\implies x = 12$ con/$m^2$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 5',
        question: 'Một doanh nghiệp sản xuất $x$ sản phẩm có chi phí $C(x) = x^3 - 3x^2 + 80x + 500$ và giá bán $116$ nghìn đồng/sp. Số sản phẩm $x$ để lợi nhuận cực đại là:',
        options: ['A. $x = 6$', 'B. $x = 4$', 'C. $x = 2$', 'D. $x = 8$'],
        correctIndex: 0,
        explanation: '$L(x) = 116x - C(x) = -x^3 + 3x^2 + 36x - 500 \\implies L\'(x) = -3x^2 + 6x + 36 = 0 \\implies x = 6$ (nhận vì $x > 0$).'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Bài toán tối ưu hình trụ',
        question: 'Cần làm một lon nước ngọt hình trụ thể tích $V = 250\\pi\\text{ cm}^3$ tốn ít vật liệu nhất (diện tích toàn phần nhỏ nhất). Tìm bán kính đáy $R$.',
        hints: ['$h = \\frac{250}{R^2}$, thế vào $S_{tp}(R) = 2\\pi R^2 + 2\\pi R h$.'],
        solutionSteps: ['Bước 1: $S_{tp}(R) = 2\\pi\\left(R^2 + \\frac{250}{R}\\right)$.', 'Bước 2: $S\'(R) = 2\\pi\\left(2R - \\frac{250}{R^2}\\right) = 0 \\implies R^3 = 125 \\implies R = 5\\text{ cm}$.'],
        finalAnswer: '$R = 5\\text{ cm}$ (khi đó $h = 2R = 10\\text{ cm}$).'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid'
  },
  // CHƯƠNG II: VECTƠ VÀ HỆ TRỤC TỌA ĐỘ TRONG KHÔNG GIAN
  {
    id: 'math-12-b6',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 6,
    stageLabel: 'Chương II · Vectơ & Hệ Trục Tọa Độ Trong Không Gian',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 6',
    title: 'Bài 6: Vectơ trong không gian',
    grade: 'Lớp 12 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description: 'Quy tắc hình hộp $\\vec{AB} + \\vec{AD} + \\vec{AA\'} = \\vec{AC\'}$, quy tắc trung điểm/trọng tâm tứ diện và tích vô hướng hai vectơ trong không gian 3D.',
    mnemonics: ['Quy tắc hình hộp: 3 cạnh xuất phát từ 1 đỉnh cộng lại bằng đường chéo hình hộp xuất phát từ đỉnh đó!'],
    commonTraps: ['Nhầm trọng tâm tứ diện $G$: $\\vec{GA} + \\vec{GB} + \\vec{GC} + \\vec{GD} = \\vec{0}$ (chia $4$ chứ không phải chia $3$).'],
    theory: [
      '1. Quy tắc hình hộp: $\\vec{AB} + \\vec{AD} + \\vec{AA\'} = \\vec{AC\'}$.',
      '2. Tích vô hướng: $\\vec{u}\\cdot\\vec{v} = |\\vec{u}|\\cdot|\\vec{v}|\\cos(\\vec{u}, \\vec{v})$.'
    ],
    keyFormulas: ['\\vec{AB}+\\vec{AD}+\\vec{AA\'} = \\vec{AC\'}', '\\vec{u}\\cdot\\vec{v} = |\\vec{u}||\\vec{v}|\\cos(\\vec{u},\\vec{v})'],
    flashcards: [{ front: 'Nếu $G$ là trọng tâm tứ diện $ABCD$ và $O$ tùy ý thì $\\vec{OG}$ bằng gì?', back: '$\\vec{OG} = \\frac{1}{4}(\\vec{OA} + \\vec{OB} + \\vec{OC} + \\vec{OD})$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 6',
        question: 'Cho hình lập phương $ABCD.A\'B\'C\'D\'$ cạnh $a$. Tích vô hướng $\\vec{AB}\\cdot\\vec{AD\'}$ bằng:',
        options: ['A. $0$', 'B. $a^2$', 'C. $a^2\\sqrt{2}$', 'D. $-a^2$'],
        correctIndex: 0,
        explanation: 'Vì $AB \\perp (ADD\'A\')$ nên $AB \\perp AD\' \\implies \\vec{AB}\\cdot\\vec{AD\'} = 0$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Hợp lực 3 vectơ 3D',
        question: 'Một chiếc đèn chùm nặng $30\\text{ N}$ treo bằng 3 dây xích đối xứng nhau hợp với phương thẳng đứng góc $30^\\circ$. Tính lực căng mỗi dây.',
        hints: ['Chiếu 3 lực căng lên phương thẳng đứng: $3T\\cos 30^\\circ = P$.'],
        solutionSteps: ['Bước 1: $3T\\cdot\\frac{\\sqrt{3}}{2} = 30 \\implies T = \\frac{20}{\\sqrt{3}} \\approx 11{,}55\\text{ N}$.'],
        finalAnswer: '$T = \\frac{20\\sqrt{3}}{3} \\approx 11{,}55\\text{ N}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  {
    id: 'math-12-b7',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 7,
    stageLabel: 'Chương II · Vectơ & Hệ Trục Tọa Độ Trong Không Gian',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 7',
    title: 'Bài 7: Hệ trục tọa độ trong không gian Oxyz',
    grade: 'Lớp 12 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description: 'Hệ tọa độ $Oxyz$ với $\\vec{i}, \\vec{j}, \\vec{k}$, tọa độ điểm $M(x;y;z)$, hình chiếu lên các trục/mặt phẳng tọa độ và tọa độ vectơ $\\vec{AB}$.',
    mnemonics: ['Chiếu $M(x; y; z)$ lên trục/mặt nào thì GIỮ NGUYÊN thành phần đó, các thành phần còn lại cho bằng $0$!'],
    commonTraps: ['Tính $\\vec{AB} = A - B$ thay vì lấy điểm sau trừ điểm đầu ($B - A$).'],
    theory: [
      '1. $\\vec{u} = x\\vec{i} + y\\vec{j} + z\\vec{k} \\iff \\vec{u} = (x; y; z)$.',
      '2. Hình chiếu của $M(x; y; z)$ lên $(Oxy)$ là $(x; y; 0)$, lên trục $Oz$ là $(0; 0; z)$.'
    ],
    keyFormulas: ['\\vec{AB} = (x_B - x_A;\\ y_B - y_A;\\ z_B - z_A)'],
    flashcards: [{ front: 'Điểm đối xứng của $M(2; -3; 5)$ qua mặt phẳng $(Oxz)$ là?', back: 'Giữ $x, z$, đổi dấu $y$: $M\'(2; 3; 5)$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 7',
        question: 'Trong $Oxyz$, cho $\\vec{a} = 2\\vec{i} - 3\\vec{k} + \\vec{j}$. Tọa độ vectơ $\\vec{a}$ là:',
        options: ['A. $(2; 1; -3)$', 'B. $(2; -3; 1)$', 'C. $(2; -3; 0)$', 'D. $(1; 2; -3)$'],
        correctIndex: 0,
        explanation: 'Thứ tự chuẩn là $(\\vec{i}; \\vec{j}; \\vec{k}) \\implies (2; 1; -3)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Hình bình hành trong Oxyz',
        question: 'Cho $A(1;0;2), B(3;1;-1), C(2;4;0)$. Tìm tọa độ đỉnh $D$ để $ABCD$ là hình bình hành.',
        hints: ['Dùng $\\vec{AB} = \\vec{DC}$.'],
        solutionSteps: ['Bước 1: $\\vec{AB} = (2; 1; -3)$, $\\vec{DC} = (2-x_D; 4-y_D; -z_D)$.', 'Bước 2: Suy ra $D(0; 3; 3)$.'],
        finalAnswer: '$D(0; 3; 3)$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  {
    id: 'math-12-b8',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 8,
    stageLabel: 'Chương II · Vectơ & Hệ Trục Tọa Độ Trong Không Gian',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 8',
    title: 'Bài 8: Biểu thức tọa độ của các phép toán vectơ',
    grade: 'Lớp 12 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description: 'Tọa độ tổng, hiệu, tích số, tích vô hướng $\\vec{a}\\cdot\\vec{b} = x_1x_2 + y_1y_2 + z_1z_2$, độ dài, góc giữa 2 vectơ, công thức trung điểm/trọng tâm và tích có hướng $[\\vec{a}, \\vec{b}]$.',
    mnemonics: ['Tích vô hướng ra SỐ, tích có hướng $[\\vec{a}, \\vec{b}]$ ra VECTƠ vuông góc với cả $\\vec{a}$ và $\\vec{b}$!'],
    commonTraps: ['Tính sai dấu thành phần giữa $z_1x_2 - x_1z_2$ của tích có hướng $[\\vec{a}, \\vec{b}]$.'],
    theory: [
      '1. $\\vec{a}\\cdot\\vec{b} = x_1x_2 + y_1y_2 + z_1z_2$; $\\vec{a} \\perp \\vec{b} \\iff \\vec{a}\\cdot\\vec{b} = 0$.',
      '2. Tích có hướng $[\\vec{a}, \\vec{b}] = (y_1z_2 - z_1y_2;\\ z_1x_2 - x_1z_2;\\ x_1y_2 - y_1x_2)$.'
    ],
    keyFormulas: ['\\cos(\\vec{a}, \\vec{b}) = \\frac{x_1x_2+y_1y_2+z_1z_2}{|\\vec{a}||\\vec{b}|}', 'S_{\\triangle ABC} = \\frac{1}{2}|[\\vec{AB}, \\vec{AC}]|'],
    flashcards: [{ front: 'Tính tích vô hướng $\\vec{a}=(1;2;-2)$ và $\\vec{b}=(2;-1;0)$?', back: '$1\\cdot 2 + 2(-1) + (-2)\\cdot 0 = 0$ (hai vectơ vuông góc).' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 8',
        question: 'Trong $Oxyz$, cho $A(1; 2; -1)$ và $B(3; -2; 3)$. Độ dài đoạn thẳng $AB$ bằng:',
        options: ['A. $6$', 'B. $36$', 'C. $2\\sqrt{6}$', 'D. $4$'],
        correctIndex: 0,
        explanation: '$\\vec{AB} = (2; -4; 4) \\implies AB = \\sqrt{4 + 16 + 16} = 6$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Diện tích tam giác 3D',
        question: 'Cho $A(1;0;0), B(0;2;0), C(0;0;3)$. Tính diện tích $\\triangle ABC$.',
        hints: ['Tính $[\\vec{AB}, \\vec{AC}]$.'],
        solutionSteps: ['Bước 1: $\\vec{AB}=(-1;2;0), \\vec{AC}=(-1;0;3) \\implies [\\vec{AB},\\vec{AC}] = (6; 3; 2)$.', 'Bước 2: $S = \\frac{1}{2}\\sqrt{36+9+4} = \\frac{7}{2}$.'],
        finalAnswer: '$S = \\frac{7}{2}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  // CHƯƠNG III: CÁC SỐ ĐẶC TRƯNG ĐO MỨC ĐỘ PHÂN TÁN CỦA MẪU SỐ LIỆU GHÉP NHÓM
  {
    id: 'math-12-b9',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 9,
    stageLabel: 'Chương III · Độ Phân Tán Mẫu Số Liệu Ghép Nhóm',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 9',
    title: 'Bài 9: Khoảng biến thiên và khoảng tứ phân vị của mẫu số liệu ghép nhóm',
    grade: 'Lớp 12 · Thống kê',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description: 'Chuyên đề mới GDPT 2018: tính khoảng biến thiên $R = a_{k+1} - a_1$ và khoảng tứ phân vị $\\Delta_Q = Q_3 - Q_1$ từ bảng phân bố tần số ghép nhóm để đo độ phân tán dữ liệu.',
    mnemonics: ['$R = \\text{đầu mút phải lớn nhất} - \\text{đầu mút trái nhỏ nhất}$; $\\Delta_Q = Q_3 - Q_1$ không bị ảnh hưởng bởi giá trị ngoại lệ!'],
    commonTraps: ['Lấy giá trị đại diện trừ nhau để tính $R$ thay vì đầu mút $[a_1; a_{k+1}]$ của nhóm đầu và nhóm cuối.'],
    theory: [
      '1. Khoảng biến thiên: $R = a_{k+1} - a_1$.',
      '2. Tứ phân vị thứ $r$ ($r=1,3$): $Q_r = u_m + \\frac{\\frac{rn}{4} - C}{n_m}(u_{m+1} - u_m)$, $\\Delta_Q = Q_3 - Q_1$.'
    ],
    keyFormulas: ['R = a_{k+1} - a_1', '\\Delta_Q = Q_3 - Q_1'],
    flashcards: [{ front: 'Bảng số liệu ghép nhóm chạy từ $[10; 20)$ đến $[50; 60)$ có khoảng biến thiên $R$ bằng bao nhiêu?', back: '$R = 60 - 10 = 50$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 9',
        question: 'Khoảng biến thiên của mẫu số liệu ghép nhóm $[0; 5), [5; 10), [10; 15), [15; 20)$ là:',
        options: ['A. $20$', 'B. $15$', 'C. $5$', 'D. $10$'],
        correctIndex: 0,
        explanation: '$R = 20 - 0 = 20$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Khoảng tứ phân vị',
        question: 'Cho bảng $n=40$: $[0;2):8$, $[2;4):12$, $[4;6):14$, $[6;8):6$. Tính $Q_1, Q_3$ và $\\Delta_Q$.',
        hints: ['$n/4 = 10$ rơi vào $[2;4)$; $3n/4 = 30$ rơi vào $[4;6)$.'],
        solutionSteps: ['Bước 1: $Q_1 = 2 + \\frac{10-8}{12}\\cdot 2 = 2{,}33$.', 'Bước 2: $Q_3 = 4 + \\frac{30-20}{14}\\cdot 2 = 5{,}43 \\implies \\Delta_Q \\approx 3{,}10$.'],
        finalAnswer: '$\\Delta_Q \\approx 3{,}10$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector'
  },
  {
    id: 'math-12-b10',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 10,
    stageLabel: 'Chương III · Độ Phân Tán Mẫu Số Liệu Ghép Nhóm',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 10',
    title: 'Bài 10: Phương sai và độ lệch chuẩn của mẫu số liệu ghép nhóm',
    grade: 'Lớp 12 · Thống kê',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Tính số trung bình $\\bar{x}$, phương sai $s^2 = \\frac{1}{n}\\sum n_i(c_i - \\bar{x})^2$ và độ lệch chuẩn $s = \\sqrt{s^2}$ để đánh giá độ ổn định của hai dãy số liệu.',
    mnemonics: ['Số liệu nào có phương sai / độ lệch chuẩn $s$ NHỎ HƠN thì có độ phân tán ít hơn (ổn định / đồng đều hơn).'],
    commonTraps: ['Quên lấy căn bậc hai từ phương sai $s^2$ để ra độ lệch chuẩn $s$, hoặc dùng sai giá trị đại diện $c_i = \\frac{a_i+a_{i+1}}{2}$.'],
    theory: [
      '1. Trung bình $\\bar{x} = \\frac{1}{n}\\sum n_i c_i$ với $c_i = \\frac{a_i + a_{i+1}}{2}$.',
      '2. Phương sai $s^2 = \\frac{1}{n}\\sum n_i c_i^2 - (\\bar{x})^2$; Độ lệch chuẩn $s = \\sqrt{s^2}$.'
    ],
    keyFormulas: ['s^2 = \\frac{1}{n}\\sum_{i=1}^k n_i c_i^2 - \\bar{x}^2', 's = \\sqrt{s^2}'],
    flashcards: [{ front: 'Phương sai của mẫu số liệu là $s^2 = 16$. Độ lệch chuẩn $s$ bằng bao nhiêu?', back: '$s = \\sqrt{16} = 4$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 10',
        question: 'So sánh điểm thi của lớp A ($s_A = 1{,}2$) và lớp B ($s_B = 2{,}1$) có cùng điểm trung bình. Lớp nào học đồng đều hơn?',
        options: ['A. Lớp A đồng đều hơn', 'B. Lớp B đồng đều hơn', 'C. Hai lớp như nhau', 'D. Không kết luận được'],
        correctIndex: 0,
        explanation: 'Độ lệch chuẩn $s_A < s_B$ nên điểm của lớp A ít phân tán (đồng đều) hơn.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Tính phương sai ghép nhóm',
        question: 'Mẫu gồm $[0;2): 2$, $[2;4): 4$, $[4;6): 4$. Tính phương sai $s^2$ và độ lệch chuẩn $s$.',
        hints: ['Giá trị đại diện là $1, 3, 5$; $n = 10$.'],
        solutionSteps: ['Bước 1: $\\bar{x} = \\frac{2\\cdot 1 + 4\\cdot 3 + 4\\cdot 5}{10} = 3{,}4$.', 'Bước 2: $s^2 = \\frac{2\\cdot 1 + 4\\cdot 9 + 4\\cdot 25}{10} - 3{,}4^2 = 13{,}8 - 11{,}56 = 2{,}24 \\implies s \\approx 1{,}50$.'],
        finalAnswer: '$s^2 = 2{,}24$, $s \\approx 1{,}50$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector'
  },
  // CHƯƠNG IV: NGUYÊN HÀM VÀ TÍCH PHÂN
  {
    id: 'math-12-b11',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 11,
    stageLabel: 'Chương IV · Nguyên Hàm & Tích Phân',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 11',
    title: 'Bài 11: Nguyên hàm',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Khái niệm họ nguyên hàm $\\int f(x)\\,dx = F(x) + C$, bảng nguyên hàm các hàm số sơ cấp (lũy thừa, lượng giác, mũ $e^x, a^x$) và bài toán tìm hằng số $C$ qua điều kiện $F(x_0) = y_0$.',
    mnemonics: ['Nhớ dấu ĐỐI của $\\int\\sin x\\,dx = -\\cos x + C$, và nhớ nhân thêm $\\frac{1}{a}$ khi lấy nguyên hàm $(ax+b)$!'],
    commonTraps: ['Nhầm dấu đạo hàm và nguyên hàm của $\\sin x, \\cos x$; quên trị tuyệt đối trong $\\int \\frac{1}{x}\\,dx = \\ln|x| + C$.'],
    theory: [
      '1. $\\int x^\\alpha\\,dx = \\frac{x^{\\alpha+1}}{\\alpha+1} + C$ ($\\alpha \\neq -1$); $\\int \\frac{1}{x}\\,dx = \\ln|x| + C$.',
      '2. $\\int \\cos x\\,dx = \\sin x + C$; $\\int \\sin x\\,dx = -\\cos x + C$; $\\int \\frac{1}{\\cos^2 x}\\,dx = \\tan x + C$.',
      '3. $\\int e^x\\,dx = e^x + C$; $\\int a^x\\,dx = \\frac{a^x}{\\ln a} + C$.'
    ],
    keyFormulas: ['\\int x^\\alpha\\,dx = \\frac{x^{\\alpha+1}}{\\alpha+1}+C', '\\int \\frac{1}{x}\\,dx = \\ln|x|+C', '\\int a^x\\,dx = \\frac{a^x}{\\ln a}+C'],
    flashcards: [{ front: 'Tìm nguyên hàm của $f(x) = \\sin 2x + e^{3x}$?', back: '$F(x) = -\\frac{1}{2}\\cos 2x + \\frac{1}{3}e^{3x} + C$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 11',
        question: 'Họ nguyên hàm của hàm số $f(x) = 3x^2 + \\frac{1}{x}$ trên $(0; +\\infty)$ là:',
        options: ['A. $x^3 + \\ln x + C$', 'B. $6x - \\frac{1}{x^2} + C$', 'C. $x^3 - \\ln x + C$', 'D. $3x^3 + \\ln x + C$'],
        correctIndex: 0,
        explanation: '$\\int 3x^2\\,dx = x^3$, $\\int \\frac{1}{x}\\,dx = \\ln x$ (do $x > 0$).'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Tìm nguyên hàm thỏa mãn điều kiện',
        question: 'Tìm nguyên hàm $F(x)$ của $f(x) = 2x - \\cos x$ biết $F(0) = 3$.',
        hints: ['$F(x) = x^2 - \\sin x + C$, thay $x = 0$ tìm $C$.'],
        solutionSteps: ['Bước 1: $F(x) = x^2 - \\sin x + C$.', 'Bước 2: $F(0) = C = 3 \\implies F(x) = x^2 - \\sin x + 3$.'],
        finalAnswer: '$F(x) = x^2 - \\sin x + 3$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'integral_disks_3d'
  },
  {
    id: 'math-5',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 12,
    stageLabel: 'Chương IV · Nguyên Hàm & Tích Phân',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 12',
    title: 'Bài 12: Tích phân',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description: 'Định nghĩa diện tích hình thang cong, công thức Newton – Leibniz $\\int_a^b f(x)\\,dx = F(b) - F(a)$, tính chất tách cận $\\int_a^b = \\int_a^c + \\int_c^b$ và tính tích phân chứa trị tuyệt đối.',
    mnemonics: ['Tích phân $\\int_a^b f(x)\\,dx$ phụ thuộc vào HÀM $f$ và CẬN $a, b$, KHÔNG phụ thuộc tên biến tích phân ($x$ hay $t$).'],
    commonTraps: ['Bỏ dấu giá trị tuyệt đối $\\int_a^b |f(x)|\\,dx$ mà không xét điểm đổi dấu $f(x)=0$ bên trong $(a; b)$.'],
    theory: [
      '1. Công thức Newton – Leibniz: $\\int_a^b f(x)\\,dx = F(b) - F(a)$.',
      '2. Quãng đường đi được từ $t_1$ đến $t_2$: $S = \\int_{t_1}^{t_2} v(t)\\,dt$.'
    ],
    keyFormulas: ['\\int_a^b f(x)\\,dx = F(b) - F(a)', '\\int_a^b f(x)\\,dx = \\int_a^c f(x)\\,dx + \\int_c^b f(x)\\,dx'],
    flashcards: [{ front: 'Cho $\\int_0^2 f(x)\\,dx = 5$ và $\\int_2^5 f(x)\\,dx = -2$. Tính $\\int_0^5 f(x)\\,dx$?', back: '$5 + (-2) = 3$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 12',
        question: 'Giá trị của tích phân $I = \\int_0^1 (3x^2 + 2e^x)\\,dx$ bằng:',
        options: ['A. $2e - 1$', 'B. $2e + 1$', 'C. $e - 1$', 'D. $2e$'],
        correctIndex: 0,
        explanation: '$\\left.(x^3 + 2e^x)\\right|_0^1 = (1 + 2e) - (0 + 2) = 2e - 1$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Quãng đường từ vận tốc',
        question: 'Một ô tô chạy với vận tốc $v(t) = 12 + 2t$ (m/s). Tính quãng đường ô tô đi được trong $5\\text{ s}$ đầu tiên.',
        hints: ['$S = \\int_0^5 (12 + 2t)\\,dt$.'],
        solutionSteps: ['Bước 1: $S = \\left.(12t + t^2)\\right|_0^5 = 60 + 25 = 85\\text{ m}$.'],
        finalAnswer: '$85\\text{ m}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'integral_disks_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: 1, b: 0, c: 0, d: 0 }, color: '#10b981', name: 'Diện tích dưới đường cong' }
  },
  {
    id: 'math-12-b13',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 13,
    stageLabel: 'Chương IV · Nguyên Hàm & Tích Phân',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 13',
    title: 'Bài 13: Ứng dụng hình học của tích phân',
    grade: 'Lớp 12 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Vận dụng',
    readTimeMinutes: 19,
    description: 'Tính diện tích hình phẳng giới hạn bởi hai đường cong $S = \\int_a^b |f(x)-g(x)|\\,dx$, thể tích vật thể theo diện tích thiết diện $V = \\int_a^b S(x)\\,dx$ và thể tích khối tròn xoay $V = \\pi\\int_a^b f^2(x)\\,dx$.',
    mnemonics: ['Diện tích có $|f-g|$ KHÔNG có $\\pi$; Thể tích tròn xoay quay quanh $Ox$ CÓ $\\pi$ và bình phương $f^2(x)$!'],
    commonTraps: ['Nhầm $V = \\pi \\int_a^b [f(x) - g(x)]^2\\,dx$ khi quay phần hình giữa 2 đồ thị (đúng phải là $\\pi \\int_a^b |f^2(x) - g^2(x)|\\,dx$ nếu cùng phía $Ox$).'],
    theory: [
      '1. Diện tích: $S = \\int_a^b |f(x) - g(x)|\\,dx$.',
      '2. Thể tích thiết diện $S(x)$: $V = \\int_a^b S(x)\\,dx$.',
      '3. Khối tròn xoay quay quanh $Ox$: $V = \\pi \\int_a^b [f(x)]^2\\,dx$.'
    ],
    keyFormulas: ['S = \\int_a^b |f(x)-g(x)|\\,dx', 'V_{Ox} = \\pi\\int_a^b f^2(x)\\,dx', 'V = \\int_a^b S(x)\\,dx'],
    flashcards: [{ front: 'Tính thể tích khối tròn xoay tạo bởi $y = \\sqrt{x}$, $y=0$, $x=0$, $x=4$ quay quanh $Ox$?', back: '$V = \\pi\\int_0^4 x\\,dx = \\pi\\left.\\frac{x^2}{2}\\right|_0^4 = 8\\pi$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 13',
        question: 'Diện tích hình phẳng giới hạn bởi $y = x^2$ và $y = x$ là:',
        options: ['A. $\\frac{1}{6}$', 'B. $\\frac{1}{3}$', 'C. $\\frac{1}{2}$', 'D. $\\frac{5}{6}$'],
        correctIndex: 0,
        explanation: 'Giao điểm $x=0, x=1$. $S = \\int_0^1 (x - x^2)\\,dx = \\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Thể tích lều / vật thể',
        question: 'Tính diện tích hình phẳng giới hạn bởi parabol $y = 4 - x^2$ và trục hoành $Ox$.',
        hints: ['Hoành độ giao điểm $4 - x^2 = 0 \\implies x = \\pm 2$.'],
        solutionSteps: ['Bước 1: $S = \\int_{-2}^2 (4 - x^2)\\,dx = 2\\left.(4x - \\frac{x^3}{3})\\right|_0^2 = 2(8 - \\frac{8}{3}) = \\frac{32}{3}$.'],
        finalAnswer: '$S = \\frac{32}{3}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'integral_disks_3d'
  },
  // CHƯƠNG V: PHƯƠNG PHÁP TỌA ĐỘ TRONG KHÔNG GIAN
  {
    id: 'math-6',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 14,
    stageLabel: 'Chương V · Phương Pháp Tọa Độ Trong Không Gian',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 14',
    title: 'Bài 14: Phương trình mặt phẳng',
    grade: 'Lớp 12 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description: 'Phương trình tổng quát $Ax+By+Cz+D=0$, cách tìm vectơ pháp tuyến $\\vec{n} = [\\vec{u}, \\vec{v}]$, phương trình mặt chắn $\\frac{x}{a}+\\frac{y}{b}+\\frac{z}{c}=1$, hai mặt phẳng song song/vuông góc và khoảng cách từ điểm đến mặt phẳng.',
    mnemonics: ['Cần 1 điểm $M_0$ + 1 VTPT $\\vec{n}=(A;B;C)$; nếu có 2 VTCP $\\vec{u}, \\vec{v}$ thì lấy tích có hướng $\\vec{n} = [\\vec{u}, \\vec{v}]$!'],
    commonTraps: ['Quên giá trị tuyệt đối $|Ax_0+By_0+Cz_0+D|$ ở tử số trong công thức khoảng cách $d(M_0, (P))$.'],
    theory: [
      '1. Qua $M_0(x_0;y_0;z_0)$ có VTPT $\\vec{n}=(A;B;C)$: $A(x-x_0)+B(y-y_0)+C(z-z_0)=0$.',
      '2. Khoảng cách: $d(M_0, (P)) = \\frac{|Ax_0+By_0+Cz_0+D|}{\\sqrt{A^2+B^2+C^2}}$.'
    ],
    keyFormulas: ['Ax + By + Cz + D = 0', '\\frac{x}{a}+\\frac{y}{b}+\\frac{z}{c}=1', 'd(M_0,(P))=\\frac{|Ax_0+By_0+Cz_0+D|}{\\sqrt{A^2+B^2+C^2}}'],
    flashcards: [{ front: 'Viết nhanh mặt phẳng đi qua 3 điểm $A(2;0;0), B(0;-3;0), C(0;0;4)$?', back: 'Phương trình mặt chắn: $\\frac{x}{2} + \\frac{y}{-3} + \\frac{z}{4} = 1 \\iff 6x - 4y + 3z - 12 = 0$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 14',
        question: 'Khoảng cách từ $M(1; -2; 3)$ đến mặt phẳng $(P): 2x - 2y + z - 5 = 0$ bằng:',
        options: ['A. $\\frac{4}{3}$', 'B. $4$', 'C. $\\frac{2}{3}$', 'D. $2$'],
        correctIndex: 0,
        explanation: '$d = \\frac{|2(1) - 2(-2) + 3 - 5|}{\\sqrt{4 + 4 + 1}} = \\frac{|4|}{3} = \\frac{4}{3}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Mặt phẳng qua 3 điểm',
        question: 'Viết phương trình mặt phẳng $(ABC)$ biết $A(1;0;1), B(2;1;0), C(0;2;2)$.',
        hints: ['Tính $\\vec{AB}, \\vec{AC}$ rồi lấy tích có hướng $\\vec{n} = [\\vec{AB}, \\vec{AC}]$.'],
        solutionSteps: ['Bước 1: $\\vec{AB}=(1;1;-1), \\vec{AC}=(-1;2;1) \\implies \\vec{n}=(3; 0; 3) = 3(1;0;1)$.', 'Bước 2: Chọn $\\vec{n}=(1;0;1)$ qua $A(1;0;1)$: $x + z - 2 = 0$.'],
        finalAnswer: '$x + z - 2 = 0$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'line_plane_oxyz'
  },
  {
    id: 'math-12-4',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 15,
    stageLabel: 'Chương V · Phương Pháp Tọa Độ Trong Không Gian',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 15',
    title: 'Bài 15: Phương trình đường thẳng trong không gian',
    grade: 'Lớp 12 · Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 19,
    description: 'Phương trình tham số, phương trình chính tắc của đường thẳng $d$, xét 4 vị trí tương đối (trùng, song song, cắt nhau, chéo nhau) và tìm giao điểm đường thẳng – mặt phẳng.',
    mnemonics: ['Chéo nhau $\\iff [\\vec{u}_1, \\vec{u}_2] \\cdot \\vec{M_1 M_2} \\neq 0$. Giao điểm $d \\cap (P)$: thế tọa độ tham số $(x(t); y(t); z(t))$ vào PT mặt phẳng $(P)$!'],
    commonTraps: ['Quên đổi dấu tọa độ điểm đi qua $M_0$ khi đọc phương trình chính tắc $\\frac{x-x_0}{a} = \\frac{y-y_0}{b} = \\frac{z-z_0}{c}$.'],
    theory: [
      '1. Tham số: $x = x_0 + at, y = y_0 + bt, z = z_0 + ct$.',
      '2. Chính tắc ($abc\\neq 0$): $\\frac{x-x_0}{a} = \\frac{y-y_0}{b} = \\frac{z-z_0}{c}$.',
      '3. Khoảng cách $d(\\Delta_1, \\Delta_2)$ chéo nhau: $\\frac{|[\\vec{u}_1, \\vec{u}_2]\\cdot\\vec{M_1 M_2}|}{|[\\vec{u}_1, \\vec{u}_2]|}$.'
    ],
    keyFormulas: ['\\frac{x-x_0}{a}=\\frac{y-y_0}{b}=\\frac{z-z_0}{c}', 'd(\\Delta_1, \\Delta_2) = \\frac{|[\\vec{u}_1, \\vec{u}_2]\\cdot\\vec{M_1 M_2}|}{|[\\vec{u}_1, \\vec{u}_2]|}'],
    flashcards: [{ front: 'Đường thẳng $d$ đi qua $A(1;-2;3)$ và vuông góc với $(P): 2x - y + 4z - 1 = 0$ có VTCP là?', back: 'VTCP của $d$ chính là VTPT của $(P)$: $\\vec{u} = (2; -1; 4)$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 15',
        question: 'Đường thẳng $d: \\frac{x-1}{2} = \\frac{y+3}{-1} = \\frac{z}{4}$ đi qua điểm nào dưới đây?',
        options: ['A. $(1; -3; 0)$', 'B. $(-1; 3; 0)$', 'C. $(2; -1; 4)$', 'D. $(1; 3; 0)$'],
        correctIndex: 0,
        explanation: 'Thay $x=1, y=-3, z=0$ làm 3 tỉ số đều bằng $0$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Hình chiếu vuông góc lên mặt phẳng',
        question: 'Tìm hình chiếu vuông góc $H$ của $M(2; 1; 0)$ lên mặt phẳng $(P): x + y + z - 6 = 0$.',
        hints: ['Viết đường thẳng $d$ qua $M$ có VTCP $\\vec{n}_P = (1; 1; 1)$, rồi lấy $H = d \\cap (P)$.'],
        solutionSteps: ['Bước 1: $H(2+t; 1+t; t) \\in (P) \\implies (2+t)+(1+t)+t - 6 = 0 \\implies t = 1$.', 'Bước 2: Vậy $H(3; 2; 1)$.'],
        finalAnswer: '$H(3; 2; 1)$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'line_plane_oxyz'
  },
  {
    id: 'math-12-b16',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 16,
    stageLabel: 'Chương V · Phương Pháp Tọa Độ Trong Không Gian',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 16',
    title: 'Bài 16: Công thức tính góc trong không gian',
    grade: 'Lớp 12 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description: 'Trong GDPT 2018, 3 công thức tính góc trong $Oxyz$ được tách thành bài chuyên biệt: góc giữa hai đường thẳng ($\\cos$), góc giữa đường thẳng và mặt phẳng ($\\sin$) và góc giữa hai mặt phẳng ($\\cos$).',
    mnemonics: ['Cùng loại (Đường–Đường hoặc Mặt–Mặt) dùng $\\cos$; KHÁC loại (Đường–Mặt) dùng $\\sin$ — luôn có giá trị tuyệt đối ở tử!'],
    commonTraps: ['Nhầm $\\sin(d, (P))$ với $\\cos(d, (P))$ hoặc quên dấu $|\\cdot|$ ở tích vô hướng khiến ra góc tù.'],
    theory: [
      '1. Hai đường thẳng: $\\cos(d_1, d_2) = \\frac{|\\vec{u}_1\\cdot\\vec{u}_2|}{|\\vec{u}_1||\\vec{u}_2|}$.',
      '2. Đường & Mặt: $\\sin(d, (P)) = \\frac{|\\vec{u}\\cdot\\vec{n}|}{|\\vec{u}||\\vec{n}|}$.',
      '3. Hai mặt phẳng: $\\cos((P), (Q)) = \\frac{|\\vec{n}_1\\cdot\\vec{n}_2|}{|\\vec{n}_1||\\vec{n}_2|}$.'
    ],
    keyFormulas: ['\\cos(d_1, d_2)=|\\cos(\\vec{u}_1,\\vec{u}_2)|', '\\sin(d, (P))=|\\cos(\\vec{u},\\vec{n})|', '\\cos((P),(Q))=|\\cos(\\vec{n}_1,\\vec{n}_2)|'],
    flashcards: [{ front: 'Tại sao góc giữa đường $d$ và mặt $(P)$ lại dùng $\\sin$ thay vì $\\cos$?', back: 'Vì góc giữa $\\vec{u}$ và pháp tuyến $\\vec{n}$ phụ với góc giữa $d$ và $(P)$, nên $\\sin(d, (P)) = |\\cos(\\vec{u}, \\vec{n})|$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 16',
        question: 'Góc giữa đường thẳng $d$ có $\\vec{u}=(1;0;1)$ và mặt phẳng $(Oxy)$ có $\\vec{k}=(0;0;1)$ bằng:',
        options: ['A. $45^\\circ$', 'B. $30^\\circ$', 'C. $60^\\circ$', 'D. $90^\\circ$'],
        correctIndex: 0,
        explanation: '$\\sin\\varphi = \\frac{|1\\cdot 0 + 0\\cdot 0 + 1\\cdot 1|}{\\sqrt{2}\\cdot 1} = \\frac{1}{\\sqrt{2}} \\implies \\varphi = 45^\\circ$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Góc hai mặt phẳng Oxyz',
        question: 'Tính góc giữa $(P): x + y - 2 = 0$ và $(Q): y + z + 1 = 0$.',
        hints: ['$\cos\varphi = \frac{|\vec{n}_P\cdot\vec{n}_Q|}{|\vec{n}_P||\vec{n}_Q|}$.'],
        solutionSteps: ['Bước 1: $\\vec{n}_P = (1;1;0), \\vec{n}_Q = (0;1;1) \\implies \\cos\\varphi = \\frac{1}{\\sqrt{2}\\cdot\\sqrt{2}} = \\frac{1}{2} \\implies \\varphi = 60^\\circ$.'],
        finalAnswer: '$60^\\circ$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'line_plane_oxyz'
  },
  {
    id: 'math-12-b17',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 17,
    stageLabel: 'Chương V · Phương Pháp Tọa Độ Trong Không Gian',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 17',
    title: 'Bài 17: Phương trình mặt cầu',
    grade: 'Lớp 12 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Phương trình chính tắc $(x-a)^2+(y-b)^2+(z-c)^2 = R^2$, phương trình khai triển $x^2+y^2+z^2-2ax-2by-2cz+d=0$ ($a^2+b^2+c^2-d>0$) và tương giao mặt phẳng – mặt cầu $r = \\sqrt{R^2 - d^2}$.',
    mnemonics: ['Từ dạng khai triển: chia hệ số bậc 1 của $x, y, z$ cho $-2$ để ra tâm $I(a; b; c)$; bán kính $R = \\sqrt{a^2+b^2+c^2-d}$!'],
    commonTraps: ['Quên điều kiện $a^2+b^2+c^2 - d > 0$ hoặc quên chia $-2$ khi đọc tọa độ tâm.'],
    theory: [
      '1. Tâm $I(a;b;c)$, bán kính $R$: $(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2$.',
      '2. Mặt phẳng $(P)$ cắt mặt cầu $(S)$ theo đường tròn bán kính $r = \\sqrt{R^2 - [d(I,(P))]^2}$ khi $d < R$; tiếp xúc khi $d = R$.'
    ],
    keyFormulas: ['(x-a)^2+(y-b)^2+(z-c)^2=R^2', 'R=\\sqrt{a^2+b^2+c^2-d}', 'r = \\sqrt{R^2 - d(I,(P))^2}'],
    flashcards: [{ front: 'Tìm tâm và bán kính mặt cầu $x^2+y^2+z^2-4x+2y-6z+5=0$?', back: 'Tâm $I(2; -1; 3)$, $R = \\sqrt{4+1+9-5} = \\sqrt{9} = 3$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 17',
        question: 'Mặt cầu $(S)$ tâm $I(1; -2; 3)$ và đi qua điểm $A(2; 0; 1)$ có bán kính $R$ bằng:',
        options: ['A. $3$', 'B. $9$', 'C. $\\sqrt{5}$', 'D. $\\sqrt{6}$'],
        correctIndex: 0,
        explanation: '$R = IA = \\sqrt{(2-1)^2 + (0+2)^2 + (1-3)^2} = \\sqrt{1 + 4 + 4} = 3$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Mặt cầu tiếp xúc mặt phẳng',
        question: 'Viết phương trình mặt cầu tâm $I(1; 2; -1)$ tiếp xúc với mặt phẳng $(P): 2x - y + 2z + 5 = 0$.',
        hints: ['Vì tiếp xúc nên $R = d(I, (P))$.'],
        solutionSteps: ['Bước 1: $R = \\frac{|2(1)-2+2(-1)+5|}{\\sqrt{4+1+4}} = \\frac{3}{3} = 1$.', 'Bước 2: $(x-1)^2 + (y-2)^2 + (z+1)^2 = 1$.'],
        finalAnswer: '$(x-1)^2 + (y-2)^2 + (z+1)^2 = 1$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'sphere_plane'
  },
  // CHƯƠNG VI: XÁC SUẤT CÓ ĐIỀU KIỆN
  {
    id: 'math-12-5',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 18,
    stageLabel: 'Chương VI · Xác Suất Có Điều Kiện',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 18',
    title: 'Bài 18: Xác suất có điều kiện',
    grade: 'Lớp 12 · Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Vận dụng',
    readTimeMinutes: 17,
    description: 'Chuyên đề mới GDPT 2018: Xác suất biến cố $A$ khi biết $B$ đã xảy ra $P(A|B) = \\frac{P(A\\cap B)}{P(B)}$, công thức nhân xác suất $P(A\\cap B) = P(B)\\cdot P(A|B)$ và sơ đồ hình cây.',
    mnemonics: ['$P(A|B)$ thu hẹp không gian mẫu từ $\\Omega$ xuống còn $B$: chia cho $P(B)$ (biến cố đứng sau dấu gạch đứng $|$)!'],
    commonTraps: ['Nhầm $P(A|B)$ với $P(B|A)$ (chú ý mẫu số là xác suất của biến cố ĐÃ BIẾT).'],
    theory: [
      '1. $P(A|B) = \\frac{P(A\\cap B)}{P(B)} = \\frac{n(A\\cap B)}{n(B)}$ ($P(B) > 0$).',
      '2. Công thức nhân tổng quát: $P(A\\cap B) = P(A)\\cdot P(B|A) = P(B)\\cdot P(A|B)$.'
    ],
    keyFormulas: ['P(A|B) = \\frac{P(A\\cap B)}{P(B)}', 'P(A\\cap B) = P(B)\\cdot P(A|B)'],
    flashcards: [{ front: 'Rút lần lượt không hoàn lại 2 lá từ bộ 52 lá. Tính xác suất lá 2 là Át biết lá 1 là Át?', back: 'Còn 51 lá trong đó có 3 lá Át $\\implies P(A_2|A_1) = \\frac{3}{51} = \\frac{1}{17}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 18',
        question: 'Cho $P(A) = 0{,}5$, $P(B) = 0{,}4$, $P(A\\cap B) = 0{,}2$. Giá trị $P(A|B)$ là:',
        options: ['A. $0{,}5$', 'B. $0{,}4$', 'C. $0{,}2$', 'D. $0{,}8$'],
        correctIndex: 0,
        explanation: '$P(A|B) = \\frac{0{,}2}{0{,}4} = 0{,}5$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Sơ đồ hình cây',
        question: 'Một hộp có 6 bi trắng và 4 bi đen. Rút ngẫu nhiên lần lượt không hoàn lại 2 bi. Tính xác suất cả 2 bi cùng màu trắng.',
        hints: ['$P = P(T_1) \\cdot P(T_2|T_1)$.'],
        solutionSteps: ['Bước 1: $P = \\frac{6}{10} \\cdot \\frac{5}{9} = \\frac{1}{3}$.'],
        finalAnswer: '$\\frac{1}{3}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector'
  },
  {
    id: 'math-12-b19',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    lessonNumber: 19,
    stageLabel: 'Chương VI · Xác Suất Có Điều Kiện',
    sourceTag: 'SGK Toán 12 GDPT 2018 (KNTT) · Bài 19',
    title: 'Bài 19: Công thức xác suất toàn phần và công thức Bayes',
    grade: 'Lớp 12 · Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Vận dụng',
    readTimeMinutes: 19,
    description: 'Chuyên đề đỉnh cao Xác suất Lớp 12 GDPT 2018: Công thức xác suất toàn phần $P(B) = P(A)P(B|A) + P(\\bar{A})P(B|\\bar{A})$ và Công thức Bayes $P(A|B) = \\frac{P(A)P(B|A)}{P(B)}$ ứng dụng chẩn đoán y khoa, kiểm định chất lượng.',
    mnemonics: ['Toàn phần tính xác suất KẾT QUẢ $P(B)$ theo tổng 2 nhánh; Bayes tính ngược xác suất NGUYÊN NHÂN $P(A|B)$ bằng cách lấy nhánh của $A$ chia cho tổng $P(B)$!'],
    commonTraps: ['Nhầm $P(\\text{dương tính} | \\text{bệnh})$ với $P(\\text{bệnh} | \\text{dương tính})$ trong bài toán xét nghiệm y khoa!'],
    theory: [
      '1. Xác suất toàn phần: $P(B) = P(A)P(B|A) + P(\\bar{A})P(B|\\bar{A})$.',
      '2. Công thức Bayes: $P(A|B) = \\frac{P(A)P(B|A)}{P(A)P(B|A) + P(\\bar{A})P(B|\\bar{A})}$.'
    ],
    keyFormulas: ['P(B) = P(A)P(B|A) + P(\\bar{A})P(B|\\bar{A})', 'P(A|B) = \\frac{P(A)P(B|A)}{P(B)}'],
    flashcards: [{ front: 'Có 2 lô sản phẩm: Lô I tỉ lệ phế phẩm $5\\%$, Lô II $10\\%$. Chọn ngẫu nhiên 1 lô rồi lấy 1 sp. Xác suất gặp phế phẩm?', back: '$P = 0{,}5\\cdot 0{,}05 + 0{,}5\\cdot 0{,}10 = 0{,}075$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 12 KNTT · Bài 19',
        question: 'Tỉ lệ mắc bệnh là $1\\%$. Xét nghiệm dương tính đúng $95\\%$ với người bệnh và dương tính giả $2\\%$ với người khỏe. Xác suất 1 người ngẫu nhiên có kết quả dương tính là:',
        options: ['A. $0{,}0293$', 'B. $0{,}0095$', 'C. $0{,}0198$', 'D. $0{,}0300$'],
        correctIndex: 0,
        explanation: '$P(+) = 0{,}01\\cdot 0{,}95 + 0{,}99\\cdot 0{,}02 = 0{,}0293$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 KNTT · Công thức Bayes y khoa',
        question: 'Với dữ kiện bài trên ($P(\\text{bệnh})=0{,}01$, $P(+|\\text{bệnh})=0{,}95$, $P(+|\\text{khỏe})=0{,}02$). Nếu một người nhận kết quả dương tính, xác suất người đó thực sự mắc bệnh là bao nhiêu?',
        hints: ['Áp dụng công thức Bayes $P(\\text{bệnh}|+) = \\frac{P(\\text{bệnh})P(+|\\text{bệnh})}{P(+)}$.'],
        solutionSteps: ['Bước 1: $P(+) = 0{,}0293$.', 'Bước 2: $P(\\text{bệnh}|+) = \\frac{0{,}0095}{0{,}0293} \\approx 0{,}3242$ (tức $32{,}4\\%$).'],
        finalAnswer: '$\\approx 32{,}42\\%$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector'
  }
];

