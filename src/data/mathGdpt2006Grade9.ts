import { MathLecture } from '../types';

// Chương trình Toán 9 GDPT 2006 (SGK Toán 9 Tập 1 & Tập 2 · NXB Giáo dục Việt Nam 2006)
// Đầy đủ 18 bài trọng tâm phủ hết 4 chương Đại số + 4 chương Hình học, mỗi bài gắn Mô phỏng 2D & 3D

export const MATH_GDPT_2006_GRADE_9: MathLecture[] = [
  // ==================== CHƯƠNG I ĐẠI SỐ: CĂN BẬC HAI. CĂN BẬC BA ====================
  {
    id: 'math-2006-9-1',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 1,
    stageLabel: 'Toán 9 (2006) · ĐS Chương I: Căn bậc hai. Căn bậc ba',
    sourceTag: 'SGK Toán 9 Tập 1 (2006) · Bài 1–2',
    title: 'Bài 1 (2006): Căn bậc hai số học & Hằng đẳng thức $\\sqrt{A^2} = |A|$',
    grade: 'Lớp 9 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Định nghĩa căn bậc hai số học của số không âm $a$, điều kiện xác định của căn thức $\\sqrt{A}$ và hằng đẳng thức căn bản $\\sqrt{A^2} = |A|$.',
    mnemonics: [
      'Số dương $a$ có HAI căn bậc hai là $\\pm\\sqrt{a}$, nhưng chỉ có MỘT căn bậc hai số học là $\\sqrt{a} \\ge 0$.',
      'Gặp $\\sqrt{A^2}$ luôn mở thành $|A|$ trước, sau đó mới xét dấu của $A$ để bỏ dấu giá trị tuyệt đối.'
    ],
    commonTraps: [
      'Viết $\\sqrt{9} = \\pm 3$ (SAI! Kí hiệu $\\sqrt{9}$ chỉ căn bậc hai số học, bằng $3$).',
      'Bỏ sót dấu giá trị tuyệt đối: $\\sqrt{(x - 2)^2} = x - 2$ khi chưa biết $x \\ge 2$.'
    ],
    theory: [
      '1. Căn bậc hai số học: Với số dương $a$, số $\\sqrt{a}$ được gọi là căn bậc hai số học của $a$. Với $a, b \\ge 0$: $a < b \\iff \\sqrt{a} < \\sqrt{b}$.',
      '2. Căn thức bậc hai & Hằng đẳng thức: Biểu thức $\\sqrt{A}$ xác định (có nghĩa) khi và chỉ khi $A \\ge 0$. Với mọi biểu thức $A$, ta có $\\sqrt{A^2} = |A| = A$ nếu $A \\ge 0$, và $-A$ nếu $A < 0$.'
    ],
    keyFormulas: [
      '\\sqrt{A} \\text{ có nghĩa} \\iff A \\ge 0',
      '\\sqrt{A^2} = |A| = \\begin{cases} A & \\text{nếu } A \\ge 0 \\\\ -A & \\text{nếu } A < 0 \\end{cases}'
    ],
    flashcards: [
      { front: 'Điều kiện để $\\sqrt{5 - 2x}$ có nghĩa?', back: '$5 - 2x \\ge 0 \\iff x \\le \\frac{5}{2}$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Toán 9 (2006) · ĐS Chương I',
        question: 'Giá trị của biểu thức $P = \\sqrt{(3 - \\sqrt{10})^2} + 3$ bằng:',
        options: ['A. $\\sqrt{10}$', 'B. $6 - \\sqrt{10}$', 'C. $\\sqrt{10} - 6$', 'D. $-\\sqrt{10}$'],
        correctIndex: 0,
        explanation: 'Vì $3 = \\sqrt{9} < \\sqrt{10}$ nên $|3 - \\sqrt{10}| = \\sqrt{10} - 3$. Vậy $P = \\sqrt{10} - 3 + 3 = \\sqrt{10}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 9 (2006) · Giải phương trình chứa căn',
        question: 'Giải phương trình $\\sqrt{x^2 - 6x + 9} = 5$.',
        hints: ['Đưa $x^2 - 6x + 9 = (x - 3)^2$ rồi áp dụng $\\sqrt{A^2} = |A|$.'],
        solutionSteps: [
          'Bước 1: Phương trình tương đương $\\sqrt{(x - 3)^2} = 5 \\iff |x - 3| = 5$.',
          'Bước 2: Suy ra $x - 3 = 5 \\Rightarrow x = 8$ hoặc $x - 3 = -5 \\Rightarrow x = -2$.'
        ],
        finalAnswer: '$x \\in \\{-2; 8\\}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'sqrt', params: { a: 1, b: 0, c: 0, d: 0 }, color: '#059669', name: 'y = √x' }
  },
  {
    id: 'math-2006-9-2',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 2,
    stageLabel: 'Toán 9 (2006) · ĐS Chương I: Căn bậc hai. Căn bậc ba',
    sourceTag: 'SGK Toán 9 Tập 1 (2006) · Bài 3–7',
    title: 'Bài 2 (2006): Liên hệ phép Nhân – Chia & Biến đổi đơn giản căn bậc hai',
    grade: 'Lớp 9 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Khai phương một tích – một thương, đưa thừa số ra ngoài/vào trong dấu căn, khử mẫu của biểu thức lấy căn và trục căn thức ở mẫu.',
    mnemonics: [
      'Đưa thừa số $A$ vào trong căn: nếu $A \\ge 0$ thì $A\\sqrt{B} = \\sqrt{A^2 B}$; nếu $A < 0$ thì $A\\sqrt{B} = -\\sqrt{A^2 B}$.',
      'Trục căn thức ở mẫu dạng tổng/hiệu: nhân cả tử và mẫu với biểu thức liên hợp $(\\sqrt{A} \\mp \\sqrt{B})$.'
    ],
    commonTraps: [
      'Tách $\\sqrt{A + B} = \\sqrt{A} + \\sqrt{B}$ (SAI hoàn toàn! Phép khai phương chỉ phân phối qua phép nhân và chia).',
      'Đưa số âm vào trong dấu căn mà làm mất dấu trừ phía trước.'
    ],
    theory: [
      '1. Khai phương tích và thương: Với $A \\ge 0, B \\ge 0$: $\\sqrt{AB} = \\sqrt{A}\\cdot\\sqrt{B}$. Với $A \\ge 0, B > 0$: $\\sqrt{\\frac{A}{B}} = \\frac{\\sqrt{A}}{\\sqrt{B}}$.',
      '2. Các phép biến đổi đơn giản: $\\sqrt{A^2 B} = |A|\\sqrt{B}\\ (B \\ge 0)$; trục căn ở mẫu $\\frac{C}{\\sqrt{A} \\pm \\sqrt{B}} = \\frac{C(\\sqrt{A} \\mp \\sqrt{B})}{A - B}$ với $A, B \\ge 0, A \\neq B$.'
    ],
    keyFormulas: [
      '\\sqrt{AB} = \\sqrt{A}\\sqrt{B} \\quad (A, B \\ge 0)',
      '\\sqrt{\\frac{A}{B}} = \\frac{\\sqrt{A}}{\\sqrt{B}} \\quad (A \\ge 0,\\, B > 0)',
      '\\frac{m}{\\sqrt{A} \\pm \\sqrt{B}} = \\frac{m(\\sqrt{A} \\mp \\sqrt{B})}{A - B}'
    ],
    flashcards: [
      { front: 'Trục căn thức ở mẫu biểu thức $\\frac{2}{\\sqrt{5} - \\sqrt{3}}$?', back: '$\\frac{2(\\sqrt{5}+\\sqrt{3})}{5 - 3} = \\sqrt{5} + \\sqrt{3}$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Toán 9 (2006) · Trục căn thức',
        question: 'Giá trị rút gọn của biểu thức $M = \\frac{1}{\\sqrt{2} - 1} - \\frac{1}{\\sqrt{2} + 1}$ là:',
        options: ['A. $2$', 'B. $2\\sqrt{2}$', 'C. $-2$', 'D. $0$'],
        correctIndex: 0,
        explanation: '$\\frac{\\sqrt{2}+1}{2-1} - \\frac{\\sqrt{2}-1}{2-1} = (\\sqrt{2}+1) - (\\sqrt{2}-1) = 2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 9 (2006) · Biến đổi căn thức',
        question: 'Rút gọn biểu thức $A = \\sqrt{18} - 2\\sqrt{50} + \\frac{6}{\\sqrt{2}}$.',
        hints: ['Đưa thừa số ra ngoài dấu căn theo $\\sqrt{2}$ và trục căn $\\frac{6}{\\sqrt{2}}$.'],
        solutionSteps: [
          'Bước 1: $\\sqrt{18} = 3\\sqrt{2}$, $2\\sqrt{50} = 2\\cdot 5\\sqrt{2} = 10\\sqrt{2}$, $\\frac{6}{\\sqrt{2}} = 3\\sqrt{2}$.',
          'Bước 2: $A = 3\\sqrt{2} - 10\\sqrt{2} + 3\\sqrt{2} = -4\\sqrt{2}$.'
        ],
        finalAnswer: '$A = -4\\sqrt{2}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz',
    defaultGraphConfig: { type: 'sqrt', params: { a: 2, b: 1, c: 0, d: 0 }, color: '#10b981', name: 'y = 2√(x+1)' }
  },
  {
    id: 'math-2006-9-3',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 3,
    stageLabel: 'Toán 9 (2006) · ĐS Chương I: Căn bậc hai. Căn bậc ba',
    sourceTag: 'SGK Toán 9 Tập 1 (2006) · Bài 8–9',
    title: 'Bài 3 (2006): Rút gọn biểu thức chứa căn & Căn bậc ba',
    grade: 'Lớp 9 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Kỹ thuật đặt điều kiện xác định, quy đồng phân thức chứa căn bậc hai để rút gọn biểu thức thi vào 10 và định nghĩa – tính chất căn bậc ba $\\sqrt[3]{a}$.',
    mnemonics: [
      'Căn bậc ba $\\sqrt[3]{a}$ xác định với MỌI $a \\in \\mathbb{R}$ và bảo toàn dấu: $\\sqrt[3]{-8} = -2$.',
      'Khi rút gọn phân thức chứa $\\sqrt{x}$, nhớ đặt $x \\ge 0$ và tất cả các mẫu thức khác $0$.'
    ],
    commonTraps: [
      'Quên đối chiếu điều kiện xác định khi tìm $x$ để biểu thức nhận giá trị nguyên hoặc thỏa bất đẳng thức.',
      'Nhầm $\\sqrt[3]{a}$ cũng cần điều kiện $a \\ge 0$ như căn bậc hai.'
    ],
    theory: [
      '1. Rút gọn biểu thức chứa căn: Phân tích mẫu thành nhân tử dạng $(\\sqrt{x} - a)(\\sqrt{x} + a)$ hoặc $(\\sqrt{x} \\pm 1)(x \\mp \\sqrt{x} + 1)$, quy đồng đúng mẫu chung rồi thu gọn tử thức.',
      '2. Căn bậc ba: Căn bậc ba của số thực $a$ là số $x$ sao cho $x^3 = a$, kí hiệu $\\sqrt[3]{a}$. Tính chất: $(\\sqrt[3]{a})^3 = \\sqrt[3]{a^3} = a$, $\\sqrt[3]{ab} = \\sqrt[3]{a}\\sqrt[3]{b}$, $a < b \\iff \\sqrt[3]{a} < \\sqrt[3]{b}$.'
    ],
    keyFormulas: [
      '(\\sqrt[3]{a})^3 = \\sqrt[3]{a^3} = a \\quad (\\forall a \\in \\mathbb{R})',
      'x - a^2 = (\\sqrt{x} - a)(\\sqrt{x} + a) \\quad (x \\ge 0)'
    ],
    flashcards: [
      { front: 'Tính $\\sqrt[3]{27} - \\sqrt[3]{-64}$?', back: '$3 - (-4) = 7$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Toán 9 (2006) · Bài 9',
        question: 'Nghiệm của phương trình $\\sqrt[3]{2x + 1} = -3$ là:',
        options: ['A. $x = -14$', 'B. $x = 13$', 'C. $x = -5$', 'D. Vô nghiệm'],
        correctIndex: 0,
        explanation: 'Lập phương hai vế: $2x + 1 = (-3)^3 = -27 \\iff 2x = -28 \\iff x = -14$.'
      }
    ],
    essayProblems: [
      {
        source: 'Tuyển sinh 10 (GDPT 2006) · Rút gọn căn thức',
        question: 'Cho $P = \\left(\\frac{1}{\\sqrt{x}-1} - \\frac{1}{\\sqrt{x}+1}\\right) : \\frac{2}{x-1}$ với $x \\ge 0, x \\neq 1$. Rút gọn $P$.',
        hints: ['Quy đồng ngoặc thứ nhất với mẫu chung $(\\sqrt{x}-1)(\\sqrt{x}+1) = x - 1$.'],
        solutionSteps: [
          'Bước 1: $\\frac{1}{\\sqrt{x}-1} - \\frac{1}{\\sqrt{x}+1} = \\frac{(\\sqrt{x}+1) - (\\sqrt{x}-1)}{x - 1} = \\frac{2}{x - 1}$.',
          'Bước 2: $P = \\frac{2}{x-1} \\cdot \\frac{x-1}{2} = 1$ với mọi $x \\ge 0, x \\neq 1$.'
        ],
        finalAnswer: '$P = 1$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'conic_sections_3d',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: 0, c: 0, d: 0 }, color: '#0d9488', name: 'y = x³ (Hàm ngược ∛x)' }
  },
  {
    id: 'math-2006-9-4',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 4,
    stageLabel: 'Toán 9 (2006) · ĐS Chương II: Hàm số bậc nhất',
    sourceTag: 'SGK Toán 9 Tập 1 (2006) · Bài 1–3',
    title: 'Bài 4 (2006): Hàm số bậc nhất y = ax + b & Đồ thị đường thẳng',
    grade: 'Lớp 9 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Khái niệm hàm số đồng biến – nghịch biến, định nghĩa hàm số bậc nhất $y = ax + b\\ (a \\neq 0)$ và cách vẽ đồ thị đường thẳng qua hai giao điểm với trục tọa độ.',
    mnemonics: [
      'Đồ thị $y = ax + b$ luôn là đường thẳng cắt $Oy$ tại $(0; b)$ và cắt $Ox$ tại $(-b/a; 0)$.',
      '$a > 0$ đường thẳng đi lên (đồng biến); $a < 0$ đường thẳng đi xuống (nghịch biến).'
    ],
    commonTraps: [
      'Quên điều kiện $a \\neq 0$ khi tìm tham số $m$ để $y = (m - 2)x + 3$ là hàm số bậc nhất.',
      'Nhầm tung độ gốc $(0; b)$ với hoành độ gốc.'
    ],
    theory: [
      '1. Định nghĩa: Hàm số bậc nhất có dạng $y = ax + b$ với $a, b \\in \\mathbb{R}$ và $a \\neq 0$. Hàm số xác định trên $\\mathbb{R}$.',
      '2. Tính chất biến thiên: Đồng biến trên $\\mathbb{R}$ khi $a > 0$; nghịch biến trên $\\mathbb{R}$ khi $a < 0$.'
    ],
    keyFormulas: [
      'y = ax + b \\quad (a \\neq 0)',
      '\\text{Cắt } Oy \\text{ tại } A(0; b), \\quad \\text{Cắt } Ox \\text{ tại } B\\left(-\\frac{b}{a}; 0\\right)'
    ],
    flashcards: [
      { front: 'Với giá trị nào của $m$ thì hàm số $y = (2m - 4)x + 5$ nghịch biến trên $\\mathbb{R}$?', back: '$2m - 4 < 0 \\iff m < 2$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Toán 9 (2006) · ĐS Chương II',
        question: 'Hàm số nào sau đây là hàm số bậc nhất ĐỒNG BIẾN trên $\\mathbb{R}$?',
        options: ['A. $y = 3x - 5$', 'B. $y = -2x + 1$', 'C. $y = 4$', 'D. $y = x^2 + 1$'],
        correctIndex: 0,
        explanation: '$y = 3x - 5$ có dạng $ax + b$ với $a = 3 > 0$ nên đồng biến trên $\\mathbb{R}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 9 (2006) · Diện tích tam giác tạo bởi đồ thị',
        question: 'Tính diện tích tam giác tạo bởi đường thẳng $d: y = 2x - 4$ với hai trục tọa độ $Ox, Oy$.',
        hints: ['Tìm giao điểm $A$ với $Ox$ ($y=0$) và $B$ với $Oy$ ($x=0$), rồi tính $S = \\frac{1}{2} OA \\cdot OB$.'],
        solutionSteps: [
          'Bước 1: $d \\cap Ox = A(2; 0) \\Rightarrow OA = 2$; $d \\cap Oy = B(0; -4) \\Rightarrow OB = |-4| = 4$.',
          'Bước 2: Tam giác $OAB$ vuông tại $O$ có diện tích $S = \\frac{1}{2} \\cdot 2 \\cdot 4 = 4$ (đvdt).'
        ],
        finalAnswer: '$S = 4$ (đơn vị diện tích).'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz',
    defaultGraphConfig: { type: 'linear', params: { a: 2, b: -4, c: 0, d: 0 }, color: '#0284c7', name: 'y = 2x - 4' }
  },
  {
    id: 'math-2006-9-5',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 5,
    stageLabel: 'Toán 9 (2006) · ĐS Chương II: Hàm số bậc nhất',
    sourceTag: 'SGK Toán 9 Tập 1 (2006) · Bài 4–5',
    title: 'Bài 5 (2006): Đường thẳng Song song, Cắt nhau & Hệ số góc y = ax + b',
    grade: 'Lớp 9 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description:
      'Điều kiện để hai đường thẳng $y = ax + b$ và $y = a\'x + b\'$ song song, trùng nhau, cắt nhau, vuông góc và ý nghĩa góc tạo bởi đường thẳng với trục $Ox$.',
    mnemonics: [
      'Song song: $a = a\'$ và $b \\neq b\'$. Trùng nhau: $a = a\'$ và $b = b\'$. Vuông góc: $a \\cdot a\' = -1$.',
      'Khi $a > 0$, góc tạo với tia $Ox$ là góc nhọn và $\\tan\\alpha = a$.'
    ],
    commonTraps: [
      'Quên kiểm tra $b \\neq b\'$ khi kết luận hai đường thẳng song song (nếu $b = b\'$ chúng trùng nhau!).',
      'Quên điều kiện $a \\neq 0, a\' \\neq 0$ khi giải tham số.'
    ],
    theory: [
      '1. Vị trí tương đối của $(d): y = ax + b$ và $(d\'): y = a\'x + b\'$ ($a, a\' \\neq 0$):\n• $(d) \\parallel (d\') \\iff a = a\'$ và $b \\neq b\'$.\n• $(d) \\equiv (d\') \\iff a = a\'$ và $b = b\'$.\n• $(d)$ cắt $(d\') \\iff a \\neq a\'$ (cắt nhau trên $Oy$ khi $a \\neq a\'$ và $b = b\'$).',
      '2. Hệ số góc $a$: Gọi $\\alpha$ là góc tạo bởi $(d)$ và tia $Ox$. Khi $a > 0$: $\\tan\\alpha = a$ ($\\alpha < 90^\\circ$). Khi $a < 0$: $\\tan(180^\\circ - \\alpha) = |a|$ ($\\alpha > 90^\\circ$). Hai đường thẳng vuông góc khi $a \\cdot a\' = -1$.'
    ],
    keyFormulas: [
      'd \\parallel d\' \\iff a = a\',\\ b \\neq b\'; \\quad d \\perp d\' \\iff a \\cdot a\' = -1',
      '\\tan\\alpha = a \\quad (a > 0)'
    ],
    flashcards: [
      { front: 'Đường thẳng $y = (m+1)x + 2$ song song với $y = 3x - 1$ khi nào?', back: '$m + 1 = 3$ và $2 \\neq -1 \\iff m = 2$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Toán 9 (2006) · ĐS Chương II',
        question: 'Đường thẳng nào sau đây VUÔNG GÓC với đường thẳng $y = \\frac{1}{3}x - 2$?',
        options: ['A. $y = -3x + 5$', 'B. $y = 3x + 1$', 'C. $y = \\frac{1}{3}x + 4$', 'D. $y = -\\frac{1}{3}x + 2$'],
        correctIndex: 0,
        explanation: 'Tích hai hệ số góc $\\frac{1}{3} \\cdot (-3) = -1$ nên $y = -3x + 5$ vuông góc với đường thẳng đã cho.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 9 (2006) · Viết phương trình đường thẳng',
        question: 'Tìm $a, b$ để đường thẳng $y = ax + b$ song song với $y = -2x + 3$ và đi qua $M(1; 4)$.',
        hints: ['Dùng song song tìm $a = -2$, sau đó thay tọa độ $M$ tìm $b$ và kiểm tra $b \\neq 3$.'],
        solutionSteps: [
          'Bước 1: Song song $y = -2x + 3 \\Rightarrow a = -2$ và $b \\neq 3$.',
          'Bước 2: Đi qua $M(1; 4) \\Rightarrow 4 = (-2)\\cdot 1 + b \\iff b = 6$ (thỏa $6 \\neq 3$).'
        ],
        finalAnswer: '$y = -2x + 6$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz',
    defaultGraphConfig: { type: 'linear', params: { a: -2, b: 6, c: 0, d: 0 }, color: '#0d9488', name: 'y = -2x + 6' }
  },
  {
    id: 'math-2006-9-6',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 6,
    stageLabel: 'Toán 9 (2006) · ĐS Chương III: Hệ hai phương trình bậc nhất hai ẩn',
    sourceTag: 'SGK Toán 9 Tập 2 (2006) · Bài 1–4',
    title: 'Bài 6 (2006): Hệ hai phương trình bậc nhất hai ẩn (Thế & Cộng đại số)',
    grade: 'Lớp 9 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      'Nghiệm hình học của phương trình $ax + by = c$, minh họa số nghiệm hệ phương trình qua hai đường thẳng và thành thạo phương pháp thế – cộng đại số.',
    mnemonics: [
      'Hệ $\\begin{cases} ax+by=c \\\\ a\'x+b\'y=c\' \\end{cases}$ có nghiệm duy nhất $\\iff \\frac{a}{a\'} \\neq \\frac{b}{b\'}$ (hai đường thẳng cắt nhau).',
      'Vô số nghiệm khi $\\frac{a}{a\'} = \\frac{b}{b\'} = \\frac{c}{c\'}$; vô nghiệm khi $\\frac{a}{a\'} = \\frac{b}{b\'} \\neq \\frac{c}{c\'}$.'
    ],
    commonTraps: [
      'Chia mẫu số $a\', b\', c\'$ khi các hệ số đó có thể bằng $0$ (nên nhân chéo $ab\' \\neq a\'b$ để an toàn).',
      'Sai dấu khi trừ vế với vế trong phương pháp cộng đại số.'
    ],
    theory: [
      '1. Phương pháp thế: Biểu diễn một ẩn theo ẩn kia từ một phương trình rồi thế vào phương trình còn lại để đưa về phương trình bậc nhất một ẩn.',
      '2. Phương pháp cộng đại số: Nhân hai vế các phương trình với số thích hợp để hệ số của cùng một ẩn bằng nhau hoặc đối nhau, rồi cộng/trừ từng vế để khử ẩn đó.'
    ],
    keyFormulas: [
      '\\text{Hệ có nghiệm duy nhất} \\iff a b\' - a\' b \\neq 0',
      '\\text{Đặt ẩn phụ với hệ chứa } \\frac{1}{x},\\ \\sqrt{x}...'
    ],
    flashcards: [
      { front: 'Nghiệm của hệ $\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}$?', back: 'Cộng 2 vế: $2x = 6 \\Rightarrow x = 3, y = 2$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Toán 9 (2006) · ĐS Chương III',
        question: 'Hệ phương trình $\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}$ có nghiệm $(x; y)$ là:',
        options: ['A. $(3; 1)$', 'B. $(1; 3)$', 'C. $(4; -1)$', 'D. $(2; 3)$'],
        correctIndex: 0,
        explanation: 'Cộng từng vế: $3x = 9 \\Rightarrow x = 3$, suy ra $y = 3 - 2 = 1$.'
      }
    ],
    essayProblems: [
      {
        source: 'Tuyển sinh 10 (2006) · Hệ ẩn phụ',
        question: 'Giải hệ phương trình $\\begin{cases} \\frac{2}{x} + \\frac{1}{y} = 3 \\\\ \\frac{1}{x} - \\frac{2}{y} = -1 \\end{cases}$ ($x, y \\neq 0$).',
        hints: ['Đặt $u = \\frac{1}{x}, v = \\frac{1}{y}$ rồi giải hệ bậc nhất theo $u, v$.'],
        solutionSteps: [
          'Bước 1: Đặt $u = \\frac{1}{x}, v = \\frac{1}{y}$, ta có $\\begin{cases} 2u + v = 3 \\\\ u - 2v = -1 \\end{cases}$.',
          'Bước 2: Nhân PT1 với $2$ rồi cộng PT2: $5u = 5 \\Rightarrow u = 1 \\Rightarrow v = 1$.',
          'Bước 3: Trả lại ẩn: $x = 1, y = 1$ (thỏa ĐK).'
        ],
        finalAnswer: '$(x; y) = (1; 1)$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz',
    defaultGraphConfig: { type: 'linear', params: { a: -2, b: 7, c: 0, d: 0 }, color: '#2563eb', name: 'y = -2x + 7' }
  },
  {
    id: 'math-2006-9-7',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 7,
    stageLabel: 'Toán 9 (2006) · ĐS Chương III: Hệ hai phương trình bậc nhất hai ẩn',
    sourceTag: 'SGK Toán 9 Tập 2 (2006) · Bài 5–6',
    title: 'Bài 7 (2006): Giải bài toán bằng cách lập Hệ phương trình',
    grade: 'Lớp 9 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Quy trình 3 bước giải bài toán thực tế bằng lập hệ phương trình: toán chuyển động (cùng chiều, ngược chiều, xuôi/ngược dòng), toán làm chung công việc và toán phần trăm.',
    mnemonics: [
      'Chuyển động trên sông: $v_{\\text{xuôi}} = v_{\\text{thực}} + v_{\\text{nước}}$; $v_{\\text{ngược}} = v_{\\text{thực}} - v_{\\text{nước}}$.',
      'Làm chung công việc: Năng suất = $1 / \\text{thời gian hoàn thành một mình}$.'
    ],
    commonTraps: [
      'Quên đổi đơn vị thời gian sang giờ (ví dụ 1 giờ 20 phút $= \\frac{4}{3}$ giờ, không phải $1{,}2$ giờ).',
      'Đặt điều kiện cho ẩn thiếu thực tế (vận tốc ca nô phải lớn hơn vận tốc dòng nước).'
    ],
    theory: [
      '1. Các bước giải: (1) Chọn hai ẩn và đặt điều kiện chặt chẽ kèm đơn vị; (2) Biểu diễn các đại lượng chưa biết theo ẩn và lập hai phương trình từ giả thiết; (3) Giải hệ, đối chiếu điều kiện và kết luận.',
      '2. Dạng toán kinh điển: Toán năng suất chung riêng ($\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{T}$), toán chuyển động ($s = vt$) và toán hình học (chu vi, diện tích).'
    ],
    keyFormulas: [
      's = v \\cdot t, \\quad v_{\\text{xuôi}} = v_{\\text{ca nô}} + v_{\\text{nước}}, \\quad v_{\\text{ngược}} = v_{\\text{ca nô}} - v_{\\text{nước}}',
      '\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{T_{\\text{chung}}}'
    ],
    flashcards: [
      { front: 'Hai vòi cùng chảy đầy bể trong $6$ giờ. Mỗi giờ cả hai vòi chảy được mấy phần bể?', back: '$\\frac{1}{6}$ bể.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Toán 9 (2006) · Bài 6',
        question: 'Một mảnh vườn hình chữ nhật có chu vi $40\\text{ m}$ và chiều dài hơn chiều rộng $4\\text{ m}$. Diện tích mảnh vườn là:',
        options: ['A. $96\\text{ m}^2$', 'B. $100\\text{ m}^2$', 'C. $84\\text{ m}^2$', 'D. $112\\text{ m}^2$'],
        correctIndex: 0,
        explanation: 'Nửa chu vi $x + y = 20$ và $x - y = 4 \\Rightarrow x = 12, y = 8 \\Rightarrow S = 12 \\cdot 8 = 96\\text{ m}^2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Tuyển sinh 10 (2006) · Làm chung công việc',
        question: 'Hai đội công nhân cùng làm một công việc trong $4$ giờ thì xong. Nếu đội I làm một mình trong $2$ giờ rồi đội II làm tiếp một mình trong $6$ giờ thì cũng xong công việc. Hỏi mỗi đội làm một mình mất bao lâu?',
        hints: ['Gọi thời gian mỗi đội làm một mình là $x, y > 4$ (giờ). Đặt $u = 1/x, v = 1/y$.'],
        solutionSteps: [
          'Bước 1: Hệ phương trình $\\begin{cases} \\frac{4}{x} + \\frac{4}{y} = 1 \\\\ \\frac{2}{x} + \\frac{6}{y} = 1 \\end{cases}$.',
          'Bước 2: Nhân PT2 cho 2 rồi trừ PT1: $\\frac{8}{y} = 1 \\Rightarrow y = 8$ giờ.',
          'Bước 3: Thay vào PT1: $\\frac{4}{x} = \\frac{1}{2} \\Rightarrow x = 8$ giờ (thỏa mãn).'
        ],
        finalAnswer: 'Mỗi đội làm một mình mất $8$ giờ.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    defaultGraphConfig: { type: 'linear', params: { a: -1, b: 20, c: 0, d: 0 }, color: '#059669', name: 'x + y = 20' }
  },
  {
    id: 'math-2006-9-8',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 8,
    stageLabel: 'Toán 9 (2006) · ĐS Chương IV: Hàm số y = ax². Phương trình bậc hai',
    sourceTag: 'SGK Toán 9 Tập 2 (2006) · Bài 1–2',
    title: 'Bài 8 (2006): Hàm số $y = ax^2$ ($a \\neq 0$) & Đồ thị Parabol',
    grade: 'Lớp 9 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Tính chất biến thiên của hàm số $y = ax^2\\ (a \\neq 0)$, cách lập bảng giá trị đối xứng qua trục tung $Oy$ và nhận dạng đường cong Parabol.',
    mnemonics: [
      'Khi $a > 0$: Parabol quay bề lõm lên trên, đạt giá trị nhỏ nhất $y = 0$ tại $x = 0$.',
      'Khi $a < 0$: Parabol quay bề lõm xuống dưới, đạt giá trị lớn nhất $y = 0$ tại $x = 0$.'
    ],
    commonTraps: [
      'Kết luận hàm $y = ax^2$ luôn đồng biến với $a > 0$ (chỉ đồng biến khi $x > 0$ và nghịch biến khi $x < 0$).'
    ],
    theory: [
      '1. Tính chất biến thiên: Nếu $a > 0$, hàm số nghịch biến khi $x < 0$ và đồng biến khi $x > 0$. Nếu $a < 0$, hàm số đồng biến khi $x < 0$ và nghịch biến khi $x > 0$.',
      '2. Đồ thị $(P): y = ax^2$: Là đường cong Parabol đi qua gốc tọa độ $O(0;0)$ và nhận trục $Oy$ làm trục đối xứng. Hai điểm có hoành độ đối nhau $(x; y)$ và $(-x; y)$ đối xứng qua $Oy$.'
    ],
    keyFormulas: [
      'y = ax^2 \\quad (a \\neq 0), \\quad \\text{Trục đối xứng } x = 0\\ (Oy)',
      'a > 0: y \\ge 0; \\quad a < 0: y \\le 0'
    ],
    flashcards: [
      { front: 'Điểm $M(-2; 8)$ thuộc Parabol $y = ax^2$. Hệ số $a$ bằng?', back: '$8 = a(-2)^2 \\iff a = 2$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Toán 9 (2006) · ĐS Chương IV',
        question: 'Cho hàm số $y = -\\frac{1}{2}x^2$. Khẳng định nào sau đây ĐÚNG?',
        options: [
          'A. Hàm số đồng biến khi $x < 0$ và nghịch biến khi $x > 0$',
          'B. Đồ thị nằm phía trên trục hoành',
          'C. Giá trị nhỏ nhất của hàm số bằng $0$',
          'D. Hàm số luôn đồng biến trên $\\mathbb{R}$'
        ],
        correctIndex: 0,
        explanation: 'Vì $a = -\\frac{1}{2} < 0$, đồ thị nằm dưới trục hoành, đạt GTLN bằng $0$, đồng biến khi $x < 0$ và nghịch biến khi $x > 0$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 9 (2006) · Tương giao Parabol và Đường thẳng',
        question: 'Tìm tọa độ giao điểm của Parabol $(P): y = x^2$ và đường thẳng $(d): y = x + 2$.',
        hints: ['Lập phương trình hoành độ giao điểm $x^2 = x + 2$.'],
        solutionSteps: [
          'Bước 1: $x^2 - x - 2 = 0 \\iff (x - 2)(x + 1) = 0 \\iff x = 2$ hoặc $x = -1$.',
          'Bước 2: Với $x = 2 \\Rightarrow y = 4$; với $x = -1 \\Rightarrow y = 1$.'
        ],
        finalAnswer: 'Hai giao điểm là $A(2; 4)$ và $B(-1; 1)$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'conic_sections_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: 1, b: 0, c: 0, d: 0 }, color: '#059669', name: 'y = x²' }
  },
  {
    id: 'math-2006-9-9',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 9,
    stageLabel: 'Toán 9 (2006) · ĐS Chương IV: Hàm số y = ax². Phương trình bậc hai',
    sourceTag: 'SGK Toán 9 Tập 2 (2006) · Bài 3–5',
    title: 'Bài 9 (2006): Phương trình bậc hai một ẩn & Công thức nghiệm thu gọn',
    grade: 'Lớp 9 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      'Giải phương trình $ax^2 + bx + c = 0\\ (a \\neq 0)$ theo biệt thức $\\Delta = b^2 - 4ac$ và công thức nghiệm thu gọn $\\Delta\' = b\'^2 - ac$ khi $b = 2b\'$.',
    mnemonics: [
      '$\\Delta > 0$: 2 nghiệm phân biệt; $\\Delta = 0$: nghiệm kép $x_1 = x_2 = -\\frac{b}{2a}$; $\\Delta < 0$: vô nghiệm.',
      'Nếu $ac < 0$ thì chắc chắn phương trình có 2 nghiệm phân biệt trái dấu!'
    ],
    commonTraps: [
      'Quên chia cho $a$ (nhầm sang $2a$) trong công thức nghiệm thu gọn $x = \\frac{-b\' \\pm \\sqrt{\\Delta\'}}{a}$.',
      'Quên xét $a = 0$ khi phương trình có tham số đứng trước $x^2$.'
    ],
    theory: [
      '1. Công thức nghiệm tổng quát: Với $ax^2 + bx + c = 0\\ (a \\neq 0)$, xét $\\Delta = b^2 - 4ac$. Nếu $\\Delta > 0$: $x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$.',
      '2. Công thức nghiệm thu gọn: Đặt $b = 2b\'$, $\\Delta\' = b\'^2 - ac$. Nếu $\\Delta\' > 0$: $x_{1,2} = \\frac{-b\' \\pm \\sqrt{\\Delta\'}}{a}$; nếu $\\Delta\' = 0$: $x_1 = x_2 = -\\frac{b\'}{a}$.'
    ],
    keyFormulas: [
      '\\Delta = b^2 - 4ac, \\quad x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}',
      '\\Delta\' = b\'^2 - ac, \\quad x_{1,2} = \\frac{-b\' \\pm \\sqrt{\\Delta\'}}{a}'
    ],
    flashcards: [
      { front: 'Phương trình $2x^2 - 5x - 7 = 0$ có hai nghiệm là gì?', back: 'Vì $a - b + c = 2 - (-5) - 7 = 0 \\Rightarrow x_1 = -1, x_2 = \\frac{7}{2}$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Toán 9 (2006) · Bài 4',
        question: 'Giá trị của $m$ để phương trình $x^2 - 2mx + m + 2 = 0$ có nghiệm kép là:',
        options: ['A. $m = -1$ hoặc $m = 2$', 'B. $m = 1$ hoặc $m = -2$', 'C. $m = 2$', 'D. $m = 0$'],
        correctIndex: 0,
        explanation: '$\\Delta\' = m^2 - (m + 2) = m^2 - m - 2 = 0 \\iff m = -1$ hoặc $m = 2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 9 (2006) · Tham số biệt thức',
        question: 'Chứng minh phương trình $x^2 - (m + 2)x + m - 1 = 0$ luôn có hai nghiệm phân biệt với mọi $m$.',
        hints: ['Tính $\\Delta$ và biến đổi thành bình phương cộng một số dương.'],
        solutionSteps: [
          'Bước 1: $\\Delta = (m + 2)^2 - 4(m - 1) = m^2 + 4m + 4 - 4m + 4 = m^2 + 8$.',
          'Bước 2: Vì $m^2 \\ge 0\\ \\forall m \\Rightarrow \\Delta = m^2 + 8 \\ge 8 > 0\\ \\forall m \\in \\mathbb{R}$.'
        ],
        finalAnswer: 'Phương trình luôn có hai nghiệm phân biệt với mọi $m$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'conic_sections_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: 1, b: -4, c: 3, d: 0 }, color: '#10b981', name: 'y = x² - 4x + 3' }
  },
  {
    id: 'math-2006-9-10',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 10,
    stageLabel: 'Toán 9 (2006) · ĐS Chương IV: Hàm số y = ax². Phương trình bậc hai',
    sourceTag: 'SGK Toán 9 Tập 2 (2006) · Bài 6–8',
    title: 'Bài 10 (2006): Hệ thức Vi-ét, Phương trình quy về bậc hai & Tương giao',
    grade: 'Lớp 9 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description:
      'Định lí Vi-ét thuận – đảo, tính nhẩm nghiệm, giải phương trình trùng phương $ax^4 + bx^2 + c = 0$, phương trình chứa ẩn ở mẫu và bài toán tương giao $(d)$ – $(P)$ thi vào 10.',
    mnemonics: [
      'Luôn kiểm tra $\\Delta \\ge 0$ (hoặc $\\Delta > 0$) TRƯỚC KHI thay tổng $S = -b/a$ và tích $P = c/a$.',
      'Phương trình trùng phương $ax^4 + bx^2 + c = 0$: đặt $t = x^2 \\ge 0$ rồi đối chiếu điều kiện không âm của $t$.'
    ],
    commonTraps: [
      'Nhầm $x^4 - 5x^2 + 4 = 0$ có 2 nghiệm (thực chất $t = 1, t = 4$ cho 4 nghiệm $x = \\pm 1, \\pm 2$).',
      'Tìm $m$ thỏa hệ thức Vi-ét xong nhưng quên đối chiếu lại điều kiện $\\Delta \\ge 0$.'
    ],
    theory: [
      '1. Hệ thức Vi-ét: Nếu phương trình $ax^2 + bx + c = 0$ có hai nghiệm $x_1, x_2$ thì $x_1 + x_2 = -\\frac{b}{a}$ và $x_1 x_2 = \\frac{c}{a}$. Ngược lại, hai số có tổng $S$ và tích $P$ thỏa $S^2 - 4P \\ge 0$ là nghiệm của $X^2 - SX + P = 0$.',
      '2. Phương trình quy về bậc hai: Phương trình trùng phương (đặt $t = x^2 \\ge 0$), phương trình chứa ẩn ở mẫu (đặt ĐKXĐ), phương trình tích $A(x)B(x) = 0$.'
    ],
    keyFormulas: [
      'x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 x_2 = \\frac{c}{a}',
      'x_1^2 + x_2^2 = S^2 - 2P, \\quad (x_1 - x_2)^2 = S^2 - 4P'
    ],
    flashcards: [
      { front: 'Phương trình trùng phương $x^4 - 3x^2 - 4 = 0$ có bao nhiêu nghiệm thực?', back: '$t = x^2 \\ge 0$: $t = 4$ (nhận) $\\Rightarrow x = \\pm 2$; $t = -1$ (loại). Có $2$ nghiệm.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Toán 9 (2006) · Hệ thức Vi-ét',
        question: 'Nếu $x_1, x_2$ là nghiệm của $x^2 - 6x + 4 = 0$ thì giá trị $A = \\frac{1}{x_1} + \\frac{1}{x_2}$ bằng:',
        options: ['A. $\\frac{3}{2}$', 'B. $\\frac{2}{3}$', 'C. $-\\frac{3}{2}$', 'D. $24$'],
        correctIndex: 0,
        explanation: '$\\frac{1}{x_1} + \\frac{1}{x_2} = \\frac{x_1+x_2}{x_1 x_2} = \\frac{6}{4} = \\frac{3}{2}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề vào 10 chuẩn GDPT 2006',
        question: 'Cho phương trình $x^2 - 2mx + m^2 - m + 1 = 0$. Tìm $m$ để phương trình có hai nghiệm phân biệt $x_1, x_2$ thỏa $x_1^2 + x_2^2 = 10$.',
        hints: ['Tính $\\Delta\' > 0 \\iff m > 1$, sau đó thế Vi-ét vào $S^2 - 2P = 10$.'],
        solutionSteps: [
          'Bước 1: $\\Delta\' = m^2 - (m^2 - m + 1) = m - 1 > 0 \\iff m > 1$.',
          'Bước 2: $(2m)^2 - 2(m^2 - m + 1) = 10 \\iff 2m^2 + 2m - 12 = 0 \\iff m^2 + m - 6 = 0$.',
          'Bước 3: Giải được $m = 2$ (nhận) hoặc $m = -3$ (loại vì không thỏa $m > 1$).'
        ],
        finalAnswer: '$m = 2$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: 1, b: -6, c: 4, d: 0 }, color: '#0d9488', name: 'y = x² - 6x + 4' }
  },
  // ==================== CHƯƠNG I HÌNH HỌC: HỆ THỨC LƯỢNG TRONG TAM GIÁC VUÔNG ====================
  {
    id: 'math-2006-9-11',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 11,
    stageLabel: 'Toán 9 (2006) · HH Chương I: Hệ thức lượng trong tam giác vuông',
    sourceTag: 'SGK Hình học 9 (2006) · Bài 1',
    title: 'Bài 11 (2006): Các hệ thức về cạnh và đường cao trong tam giác vuông',
    grade: 'Lớp 9 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      '5 hệ thức lượng cơ bản trong tam giác vuông $ABC$ vuông tại $A$ với đường cao $AH = h$, cạnh huyền $a$, cạnh góc vuông $b, c$ và hình chiếu $b\', c\'$.',
    mnemonics: [
      'Cạnh góc vuông bình phương = cạnh huyền $\\times$ hình chiếu của nó: $b^2 = a b\',\\ c^2 = a c\'$.',
      'Đường cao bình phương = tích hai hình chiếu: $h^2 = b\' c\'$. Nghịch đảo bình phương: $\\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}$.'
    ],
    commonTraps: [
      'Nhầm lẫn giữa hình chiếu $b\' = CH$ của $b = AC$ với $c\' = BH$ của $c = AB$.',
      'Quên lấy căn bậc hai khi tính xong $h^2$ hoặc $b^2$.'
    ],
    theory: [
      '1. Định lí 1 & 2: Trong tam giác vuông, bình phương mỗi cạnh góc vuông bằng tích cạnh huyền và hình chiếu của cạnh góc vuông đó trên cạnh huyền ($b^2 = a b\'$, $c^2 = a c\'$). Bình phương đường cao ứng với cạnh huyền bằng tích hai hình chiếu ($h^2 = b\' c\'$).',
      '2. Định lí 3 & 4: Tích hai cạnh góc vuông bằng tích cạnh huyền và đường cao tương ứng ($b c = a h$). Nghịch đảo bình phương đường cao ứng với cạnh huyền bằng tổng các nghịch đảo bình phương hai cạnh góc vuông ($\\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}$).'
    ],
    keyFormulas: [
      'b^2 = ab\', \\quad c^2 = ac\', \\quad h^2 = b\'c\'',
      'ah = bc, \\quad \\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}'
    ],
    flashcards: [
      { front: 'Tam giác vuông có hai hình chiếu là $2$ và $8$. Đường cao $h$ bằng?', back: '$h = \\sqrt{2 \\cdot 8} = 4$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 9 (2006) · Bài 1',
        question: 'Tam giác $ABC$ vuông tại $A$, đường cao $AH$. Biết $AB = 6\\text{ cm}, BC = 10\\text{ cm}$. Độ dài hình chiếu $BH$ là:',
        options: ['A. $3{,}6\\text{ cm}$', 'B. $6{,}4\\text{ cm}$', 'C. $4{,}8\\text{ cm}$', 'D. $4\\text{ cm}$'],
        correctIndex: 0,
        explanation: '$AB^2 = BC \\cdot BH \\Rightarrow BH = \\frac{6^2}{10} = 3{,}6\\text{ cm}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 9 (2006) · Bài tập chuẩn',
        question: 'Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Biết $AB = 9\\text{ cm}, AC = 12\\text{ cm}$. Tính $BC, AH, BH, CH$.',
        hints: ['Dùng Pitago tính $BC$, dùng $ah = bc$ tính $AH$, rồi dùng $c^2 = ac\'$.'],
        solutionSteps: [
          'Bước 1: $BC = \\sqrt{9^2 + 12^2} = 15\\text{ cm}$.',
          'Bước 2: $AH = \\frac{AB \\cdot AC}{BC} = \\frac{9 \\cdot 12}{15} = 7{,}2\\text{ cm}$.',
          'Bước 3: $BH = \\frac{AB^2}{BC} = \\frac{81}{15} = 5{,}4\\text{ cm}$; $CH = 15 - 5{,}4 = 9{,}6\\text{ cm}$.'
        ],
        finalAnswer: '$BC = 15\\text{ cm}, AH = 7{,}2\\text{ cm}, BH = 5{,}4\\text{ cm}, CH = 9{,}6\\text{ cm}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'pythagoras',
    sim3dMode: 'circle_theorems_3d'
  },
  {
    id: 'math-2006-9-12',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 12,
    stageLabel: 'Toán 9 (2006) · HH Chương I: Hệ thức lượng trong tam giác vuông',
    sourceTag: 'SGK Hình học 9 (2006) · Bài 2–4',
    title: 'Bài 12 (2006): Tỉ số lượng giác góc nhọn & Hệ thức cạnh – góc',
    grade: 'Lớp 9 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      'Định nghĩa $\\sin, \\cos, \\tan, \\cot$ của góc nhọn, tính chất hai góc phụ nhau và ứng dụng giải tam giác vuông, đo chiều cao thực tế.',
    mnemonics: [
      'Câu thần chú kinh điển: **Sin đi học (Đối/Huyền) – Cos không hư (Kề/Huyền) – Tan đoàn kết (Đối/Kề) – Cot kết đoàn (Kề/Đối)**.',
      'Hai góc phụ nhau ($\\alpha + \\beta = 90^\\circ$): $\\sin\\alpha = \\cos\\beta$, $\\tan\\alpha = \\cot\\beta$.'
    ],
    commonTraps: [
      'Quên đổi máy tính cầm tay sang chế độ độ (`DEG`) khi bấm $\\sin 30^\\circ, \\tan 40^\\circ$.',
      'Xác định nhầm cạnh đối và cạnh kề khi đổi góc nhọn trong cùng tam giác vuông.'
    ],
    theory: [
      '1. Tỉ số lượng giác góc nhọn $\\alpha$: $\\sin\\alpha = \\frac{\\text{đối}}{\\text{huyền}}$, $\\cos\\alpha = \\frac{\\text{kề}}{\\text{huyền}}$, $\\tan\\alpha = \\frac{\\text{đối}}{\\text{kề}}$, $\\cot\\alpha = \\frac{\\text{kề}}{\\text{đối}}$. Liên hệ: $\\sin^2\\alpha + \\cos^2\\alpha = 1$, $\\tan\\alpha\\cdot\\cot\\alpha = 1$.',
      '2. Hệ thức cạnh – góc trong $\\triangle ABC$ vuông tại $A$: Mỗi cạnh góc vuông bằng cạnh huyền nhân sin góc đối hoặc nhân côsin góc kề ($b = a\\sin B = a\\cos C$), hoặc bằng cạnh góc vuông kia nhân tang góc đối ($b = c\\tan B = c\\cot C$).'
    ],
    keyFormulas: [
      '\\sin^2\\alpha + \\cos^2\\alpha = 1, \\quad \\tan\\alpha \\cdot \\cot\\alpha = 1',
      'b = a\\sin B = a\\cos C = c\\tan B = c\\cot C'
    ],
    flashcards: [
      { front: 'Rút gọn biểu thức $\\sin^2 25^\\circ + \\sin^2 65^\\circ$?', back: 'Vì $25^\\circ + 65^\\circ = 90^\\circ \\Rightarrow \\sin 65^\\circ = \\cos 25^\\circ$, nên tổng bằng $1$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 9 (2006) · Bài 4',
        question: 'Tam giác $ABC$ vuông tại $A$ có cạnh huyền $BC = 10\\text{ cm}$, $\\widehat{B} = 30^\\circ$. Độ dài cạnh $AC$ bằng:',
        options: ['A. $5\\text{ cm}$', 'B. $5\\sqrt{3}\\text{ cm}$', 'C. $10\\sqrt{3}\\text{ cm}$', 'D. $20\\text{ cm}$'],
        correctIndex: 0,
        explanation: '$AC = BC\\cdot\\sin B = 10\\cdot\\sin 30^\\circ = 10\\cdot\\frac{1}{2} = 5\\text{ cm}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 9 (2006) · Bài toán thực tế đo chiều cao',
        question: 'Tia nắng mặt trời tạo với mặt đất góc $40^\\circ$ và bóng của một cột cờ trên mặt đất dài $12\\text{ m}$. Tính chiều cao cột cờ (làm tròn đến 2 chữ số thập phân).',
        hints: ['Cột cờ vuông góc mặt đất tạo thành tam giác vuông có cạnh kề là bóng $12\\text{ m}$, góc nhọn $40^\\circ$.'],
        solutionSteps: [
          'Bước 1: Chiều cao cột cờ là $h = 12 \\cdot \\tan 40^\\circ$.',
          'Bước 2: Bấm máy $\\tan 40^\\circ \\approx 0{,}8391 \\Rightarrow h \\approx 10{,}07\\text{ m}$.'
        ],
        finalAnswer: '$h \\approx 10{,}07\\text{ m}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'triangle_explorer',
    sim3dMode: 'circle_theorems_3d'
  },
  // ==================== CHƯƠNG II HÌNH HỌC: ĐƯỜNG TRÒN ====================
  {
    id: 'math-2006-9-13',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 13,
    stageLabel: 'Toán 9 (2006) · HH Chương II: Đường tròn',
    sourceTag: 'SGK Hình học 9 (2006) · Bài 1–5',
    title: 'Bài 13 (2006): Đường kính – Dây cung & Vị trí tương đối đường thẳng – đường tròn',
    grade: 'Lớp 9 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      'Sự xác định đường tròn qua 3 điểm không thẳng hàng, quan hệ vuông góc đường kính – dây cung, liên hệ dây và khoảng cách tới tâm, dấu hiệu nhận biết tiếp tuyến.',
    mnemonics: [
      'Đường kính vuông góc với dây thì đi qua trung điểm của dây; ngược lại đi qua trung điểm dây không qua tâm thì vuông góc với dây.',
      'Dây lớn nhất là đường kính; dây càng gần tâm thì càng lớn ($OH_1 < OH_2 \\iff AB > CD$).'
    ],
    commonTraps: [
      'Áp dụng định lí đảo "đường kính qua trung điểm dây thì vuông góc" cho trường hợp dây đi qua tâm (hai đường kính luôn cắt nhau tại trung điểm nhưng không nhất thiết vuông góc).'
    ],
    theory: [
      '1. Đường kính và dây: Trong một đường tròn, đường kính vuông góc với một dây thì đi qua trung điểm của dây ấy. Hai dây bằng nhau thì cách đều tâm và ngược lại.',
      '2. Đường thẳng $d$ và $(O; R)$ ($OH = d(O, \\Delta)$): Nếu $OH > R$: không giao nhau; $OH = R$: tiếp xúc ($d$ là tiếp tuyến, $d \\perp OH$ tại tiếp điểm); $OH < R$: cắt nhau tại 2 điểm phân biệt.'
    ],
    keyFormulas: [
      'AB = 2\\sqrt{R^2 - OH^2} \\quad (OH \\perp AB)',
      'd \\text{ tiếp xúc } (O; R) \\iff d(O, \\Delta) = R'
    ],
    flashcards: [
      { front: 'Đường tròn $(O; 5\\text{ cm})$ có dây $AB = 8\\text{ cm}$. Khoảng cách từ tâm $O$ đến $AB$?', back: '$OH = \\sqrt{R^2 - (AB/2)^2} = \\sqrt{5^2 - 4^2} = 3\\text{ cm}$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 9 (2006) · HH Chương II',
        question: 'Cho đường tròn $(O; 10\\text{ cm})$ và dây $MN$ cách tâm $O$ một khoảng $6\\text{ cm}$. Độ dài dây $MN$ là:',
        options: ['A. $16\\text{ cm}$', 'B. $8\\text{ cm}$', 'C. $12\\text{ cm}$', 'D. $4\\text{ cm}$'],
        correctIndex: 0,
        explanation: 'Nửa dây $MH = \\sqrt{10^2 - 6^2} = 8\\text{ cm} \\Rightarrow MN = 2\\cdot 8 = 16\\text{ cm}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 9 (2006) · Dấu hiệu tiếp tuyến',
        question: 'Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Chứng minh đường thẳng $BC$ là tiếp tuyến của đường tròn tâm $A$ bán kính $AH$.',
        hints: ['Chỉ ra $AH \\perp BC$ và $H$ nằm trên đường tròn $(A; AH)$.'],
        solutionSteps: [
          'Bước 1: Đường tròn $(A; R)$ với $R = AH$ đi qua điểm $H \\in BC$.',
          'Bước 2: Theo giả thiết $AH \\perp BC$ tại $H$, suy ra $BC$ vuông góc bán kính $AH$ tại điểm $H$ thuộc đường tròn nên $BC$ là tiếp tuyến của $(A; AH)$.'
        ],
        finalAnswer: '$BC$ là tiếp tuyến của $(A; AH)$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'circle_tangent',
    sim3dMode: 'circle_theorems_3d'
  },
  {
    id: 'math-2006-9-14',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 14,
    stageLabel: 'Toán 9 (2006) · HH Chương II: Đường tròn',
    sourceTag: 'SGK Hình học 9 (2006) · Bài 6–8',
    title: 'Bài 14 (2006): Tính chất hai tiếp tuyến cắt nhau & Vị trí hai đường tròn',
    grade: 'Lớp 9 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Tính chất hai tiếp tuyến cắt nhau ($MA = MB$, phân giác $MO$, đường tròn nội tiếp tam giác) và 3 vị trí tương đối giữa hai đường tròn $(O; R)$ và $(O\'; r)$.',
    mnemonics: [
      'Hai đường tròn cắt nhau tại 2 điểm $\\iff |R - r| < OO\' < R + r$.',
      'Tiếp xúc ngoài: $OO\' = R + r$; Tiếp xúc trong: $OO\' = |R - r|$ ($R \\neq r$).'
    ],
    commonTraps: [
      'Quên kiểm tra cả cận dưới $|R - r| < OO\'$ khi xét điều kiện hai đường tròn cắt nhau (chỉ kiểm tra $OO\' < R + r$ là thiếu).'
    ],
    theory: [
      '1. Hai tiếp tuyến cắt nhau: Nếu hai tiếp tuyến $MA, MB$ của $(O)$ cắt nhau tại $M$ thì $MA = MB$, $MO$ là tia phân giác $\\widehat{AMB}$ và $OM$ là tia phân giác $\\widehat{AOB}$ (suy ra $OM \\perp AB$ tại trung điểm $AB$).',
      '2. Hai đường tròn $(O; R)$ và $(O\'; r)$ với $R \\ge r$:\n• Cắt nhau: $R - r < OO\' < R + r$.\n• Tiếp xúc ngoài: $OO\' = R + r$; Tiếp xúc trong: $OO\' = R - r > 0$.\n• Đường nối tâm $OO\'$ là trục đối xứng chung và vuông góc dây chung tại trung điểm.'
    ],
    keyFormulas: [
      'MA = MB, \\quad OM \\perp AB \\text{ tại trung điểm } H',
      '\\text{Cắt nhau: } |R - r| < OO\' < R + r'
    ],
    flashcards: [
      { front: 'Hai đường tròn $(O; 7\\text{ cm})$ và $(O\'; 3\\text{ cm})$ có $OO\' = 4\\text{ cm}$. Vị trí tương đối?', back: 'Vì $OO\' = 7 - 3 = R - r$ nên hai đường tròn tiếp xúc trong.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 9 (2006) · Bài 7',
        question: 'Cho hai đường tròn $(O; 5\\text{ cm})$ và $(O\'; 3\\text{ cm})$. Để hai đường tròn cắt nhau thì độ dài đoạn nối tâm $d = OO\'$ phải thỏa mãn:',
        options: ['A. $2 < d < 8$', 'B. $d = 8$', 'C. $d > 8$', 'D. $d < 2$'],
        correctIndex: 0,
        explanation: '$|R - r| < d < R + r \\iff 5 - 3 < d < 5 + 3 \\iff 2 < d < 8$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 9 (2006) · Tiếp tuyến cắt nhau',
        question: 'Cho đường tròn $(O; R)$ và điểm $M$ sao cho $OM = 2R$. Kẻ hai tiếp tuyến $MA, MB$ ($A, B$ là tiếp điểm). Tính số đo góc $\\widehat{AMB}$ và độ dài $AB$ theo $R$.',
        hints: ['Trong $\\triangle OAM$ vuông tại $A$, tính $\\sin\\widehat{AMO} = OA/OM = 1/2$.'],
        solutionSteps: [
          'Bước 1: $\\triangle OAM$ vuông tại $A$ có $\\sin\\widehat{AMO} = \\frac{OA}{OM} = \\frac{R}{2R} = \\frac{1}{2} \\Rightarrow \\widehat{AMO} = 30^\\circ$.',
          'Bước 2: Vì $MO$ là phân giác $\\widehat{AMB} \\Rightarrow \\widehat{AMB} = 60^\\circ$.',
          'Bước 3: $\\triangle AMB$ cân có góc $60^\\circ$ nên đều: $AB = MA = \\sqrt{OM^2 - OA^2} = R\\sqrt{3}$.'
        ],
        finalAnswer: '$\\widehat{AMB} = 60^\\circ$; $AB = R\\sqrt{3}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'two_circles_relative',
    sim3dMode: 'circle_theorems_3d'
  },
  // ==================== CHƯƠNG III HÌNH HỌC: GÓC VỚI ĐƯỜNG TRÒN ====================
  {
    id: 'math-2006-9-15',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 15,
    stageLabel: 'Toán 9 (2006) · HH Chương III: Góc với đường tròn',
    sourceTag: 'SGK Hình học 9 (2006) · Bài 1–4',
    title: 'Bài 15 (2006): Góc ở tâm, Góc nội tiếp & Góc tạo bởi tia tiếp tuyến và dây cung',
    grade: 'Lớp 9 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Số đo cung, liên hệ giữa cung và dây, định lí góc nội tiếp ($= \\frac{1}{2}$ số đo cung bị chắn) và góc tạo bởi tia tiếp tuyến – dây cung.',
    mnemonics: [
      'Góc nội tiếp và góc tạo bởi tia tiếp tuyến – dây cung cùng chắn một cung thì BẰNG NHAU (đều bằng nửa số đo cung bị chắn).',
      'Góc nội tiếp chắn nửa đường tròn luôn là góc vuông $90^\\circ$.'
    ],
    commonTraps: [
      'Nhầm góc ở tâm (bằng cả số đo cung bị chắn) với góc nội tiếp (bằng nửa số đo cung bị chắn).'
    ],
    theory: [
      '1. Góc ở tâm: Có đỉnh trùng với tâm đường tròn, số đo bằng số đo cung nhỏ bị chắn. Góc nội tiếp có đỉnh nằm trên đường tròn và hai cạnh chứa hai dây, số đo bằng nửa số đo cung bị chắn.',
      '2. Góc tạo bởi tia tiếp tuyến và dây cung: Đỉnh là tiếp điểm, một cạnh là tia tiếp tuyến, cạnh kia chứa dây cung; số đo bằng nửa số đo cung bị chắn giữa hai cạnh.'
    ],
    keyFormulas: [
      '\\widehat{ACB} = \\frac{1}{2}\\text{sđ}\\overset{\\frown}{AB} = \\frac{1}{2}\\widehat{AOB}',
      '\\widehat{BAx} = \\widehat{ACB} = \\frac{1}{2}\\text{sđ}\\overset{\\frown}{AB}'
    ],
    flashcards: [
      { front: 'Tam giác $ABC$ nội tiếp $(O)$ có $\\widehat{BOC} = 110^\\circ$ ($A$ thuộc cung lớn). Số đo $\\widehat{BAC}$?', back: '$\\widehat{BAC} = \\frac{1}{2}\\widehat{BOC} = 55^\\circ$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 9 (2006) · HH Chương III',
        question: 'Cho đường tròn $(O)$ đường kính $AB$ và điểm $C$ nằm trên đường tròn ($C \\neq A, B$). Nếu $\\widehat{CAB} = 35^\\circ$ thì $\\widehat{CBA}$ bằng:',
        options: ['A. $55^\\circ$', 'B. $35^\\circ$', 'C. $70^\\circ$', 'D. $45^\\circ$'],
        correctIndex: 0,
        explanation: 'Góc nội tiếp $\\widehat{ACB}$ chắn nửa đường tròn nên $\\widehat{ACB} = 90^\\circ \\Rightarrow \\widehat{CBA} = 90^\\circ - 35^\\circ = 55^\\circ$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 9 (2006) · Đồng dạng tiếp tuyến – cát tuyến',
        question: 'Từ điểm $M$ ngoài $(O)$, kẻ tiếp tuyến $MA$ ($A$ là tiếp điểm) và cát tuyến $MBC$ ($B$ nằm giữa $M$ và $C$). Chứng minh $MA^2 = MB \\cdot MC$.',
        hints: ['Chứng minh $\\triangle MAB \\sim \\triangle MCA$ nhờ $\\widehat{MAB} = \\widehat{MCA}$ (cùng chắn cung $AB$).'],
        solutionSteps: [
          'Bước 1: Xét $\\triangle MAB$ và $\\triangle MCA$: có $\\widehat{M}$ chung và $\\widehat{MAB} = \\widehat{MCA}$ (góc tiếp tuyến–dây và góc nội tiếp cùng chắn $\\overset{\\frown}{AB}$).',
          'Bước 2: $\\triangle MAB \\sim \\triangle MCA\\ (g.g) \\Rightarrow \\frac{MA}{MC} = \\frac{MB}{MA} \\iff MA^2 = MB \\cdot MC$.'
        ],
        finalAnswer: '$MA^2 = MB \\cdot MC$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'circle_chords_angles',
    sim3dMode: 'circle_theorems_3d'
  },
  {
    id: 'math-2006-9-16',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 16,
    stageLabel: 'Toán 9 (2006) · HH Chương III: Góc với đường tròn',
    sourceTag: 'SGK Hình học 9 (2006) · Bài 5–10',
    title: 'Bài 16 (2006): Tứ giác nội tiếp, Góc trong/ngoài đường tròn & Độ dài – Diện tích tròn',
    grade: 'Lớp 9 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description:
      'Góc có đỉnh bên trong/bên ngoài đường tròn, dấu hiệu nhận biết tứ giác nội tiếp (trọng tâm đề thi vào 10), độ dài đường tròn – cung tròn và diện tích hình tròn – quạt tròn.',
    mnemonics: [
      '4 dấu hiệu tứ giác nội tiếp thường dùng nhất: (1) Tổng 2 góc đối $= 180^\\circ$; (2) Hai đỉnh kề cùng nhìn cạnh đối dưới góc bằng nhau; (3) Góc ngoài tại một đỉnh bằng góc trong tại đỉnh đối diện; (4) Bốn đỉnh cách đều một điểm.',
      'Độ dài đường tròn $C = 2\\pi R$, độ dài cung $n^\\circ$: $l = \\frac{\\pi R n}{180}$; Diện tích quạt tròn: $S_q = \\frac{\\pi R^2 n}{360} = \\frac{l R}{2}$.'
    ],
    commonTraps: [
      'Nhầm mẫu $180$ (độ dài cung) với $360$ (diện tích hình quạt tròn).',
      'Kết luận sai hai góc đối nhau nhìn đoạn thẳng (phải là hai đỉnh KỀ NHAU cùng nhìn đoạn chứa hai đỉnh còn lại dưới cùng một góc).'
    ],
    theory: [
      '1. Tứ giác nội tiếp: Một tứ giác có bốn đỉnh cùng thuộc một đường tròn. Định lí thuận và đảo: Tứ giác nội tiếp khi và chỉ khi tổng số đo hai góc đối bằng $180^\\circ$.',
      '2. Độ dài và diện tích: Đường tròn bán kính $R$ có chu vi $C = 2\\pi R$, diện tích $S = \\pi R^2$. Cung tròn số đo $n^\\circ$ có độ dài $l = \\frac{\\pi R n}{180}$ và diện tích hình quạt $S_{\\text{quạt}} = \\frac{\\pi R^2 n}{360} = \\frac{l R}{2}$.'
    ],
    keyFormulas: [
      '\\widehat{A} + \\widehat{C} = 180^\\circ \\iff ABCD \\text{ nội tiếp}',
      'C = 2\\pi R, \\quad l = \\frac{\\pi R n}{180}, \\quad S_{\\text{tròn}} = \\pi R^2, \\quad S_{\\text{quạt}} = \\frac{\\pi R^2 n}{360}'
    ],
    flashcards: [
      { front: 'Hình quạt tròn bán kính $R = 6\\text{ cm}$, góc ở tâm $60^\\circ$ có diện tích bằng?', back: '$S_q = \\frac{\\pi \\cdot 6^2 \\cdot 60}{360} = 6\\pi\\text{ cm}^2$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 9 (2006) · HH Chương III',
        question: 'Độ dài cung tròn $60^\\circ$ của đường tròn bán kính $R = 9\\text{ cm}$ bằng:',
        options: ['A. $3\\pi\\text{ cm}$', 'B. $6\\pi\\text{ cm}$', 'C. $9\\pi\\text{ cm}$', 'D. $1{,}5\\pi\\text{ cm}$'],
        correctIndex: 0,
        explanation: '$l = \\frac{\\pi \\cdot 9 \\cdot 60}{180} = 3\\pi\\text{ cm}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề tuyển sinh 10 · Tứ giác nội tiếp',
        question: 'Cho tam giác $ABC$ có 3 góc nhọn nội tiếp $(O)$ với hai đường cao $BE, CF$ cắt nhau tại $H$. Chứng minh hai tứ giác $BCEF$ và $AEHF$ nội tiếp.',
        hints: ['Dùng hai đỉnh kề $E, F$ nhìn $BC$ dưới góc $90^\\circ$ và tổng góc đối tại $E, F$ bằng $180^\\circ$.'],
        solutionSteps: [
          'Bước 1: $\\widehat{BEC} = \\widehat{BFC} = 90^\\circ$ nên $E, F$ cùng nằm trên đường tròn đường kính $BC \\Rightarrow BCEF$ nội tiếp.',
          'Bước 2: $\\widehat{AEH} + \\widehat{AFH} = 90^\\circ + 90^\\circ = 180^\\circ \\Rightarrow AEHF$ nội tiếp đường tròn đường kính $AH$.'
        ],
        finalAnswer: 'Hai tứ giác $BCEF$ và $AEHF$ đều nội tiếp đường tròn.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'inscribed_quad',
    sim3dMode: 'circle_theorems_3d'
  },
  // ==================== CHƯƠNG IV HÌNH HỌC: HÌNH TRỤ - HÌNH NÓN - HÌNH CẦU ====================
  {
    id: 'math-2006-9-17',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 17,
    stageLabel: 'Toán 9 (2006) · HH Chương IV: Hình trụ – Hình nón – Hình cầu',
    sourceTag: 'SGK Hình học 9 (2006) · Bài 1–2',
    title: 'Bài 17 (2006): Hình trụ – Hình nón – Hình nón cụt (Diện tích & Thể tích)',
    grade: 'Lớp 9 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Quay hình chữ nhật tạo hình trụ, quay tam giác vuông tạo hình nón; công thức diện tích xung quanh, diện tích toàn phần và thể tích hình trụ, hình nón, hình nón cụt.',
    mnemonics: [
      'Hình trụ: $S_{xq} = 2\\pi r h$, $V = \\pi r^2 h$. Hình nón: $S_{xq} = \\pi r l$, $V = \\frac{1}{3}\\pi r^2 h$ (đường sinh $l = \\sqrt{r^2 + h^2}$).',
      'Khi khai triển mặt xung quanh hình trụ thành hình chữ nhật có chiều dài bằng chu vi đáy $2\\pi r$.'
    ],
    commonTraps: [
      'Dùng chiều cao $h$ thay cho đường sinh $l$ khi tính diện tích xung quanh hình nón.',
      'Quên cộng diện tích đáy khi đề hỏi diện tích toàn phần $S_{tp} = S_{xq} + 2S_{\\text{đáy}}$ (trụ) hoặc $S_{xq} + S_{\\text{đáy}}$ (nón).'
    ],
    theory: [
      '1. Hình trụ: Bán kính đáy $r$, chiều cao $h$. Diện tích xung quanh $S_{xq} = 2\\pi r h$; diện tích toàn phần $S_{tp} = 2\\pi r h + 2\\pi r^2$; thể tích $V = \\pi r^2 h$.',
      '2. Hình nón & Hình nón cụt: Hình nón bán kính đáy $r$, chiều cao $h$, đường sinh $l = \\sqrt{r^2 + h^2}$ có $S_{xq} = \\pi r l$, $S_{tp} = \\pi r l + \\pi r^2$, $V = \\frac{1}{3}\\pi r^2 h$. Hình nón cụt hai bán kính $r_1, r_2$: $S_{xq} = \\pi(r_1 + r_2)l$, $V = \\frac{1}{3}\\pi h(r_1^2 + r_2^2 + r_1 r_2)$.'
    ],
    keyFormulas: [
      'S_{xq\\text{ trụ}} = 2\\pi r h, \\quad V_{\\text{trụ}} = \\pi r^2 h',
      'S_{xq\\text{ nón}} = \\pi r l, \\quad V_{\\text{nón}} = \\frac{1}{3}\\pi r^2 h \\quad (l^2 = r^2 + h^2)'
    ],
    flashcards: [
      { front: 'Hình trụ bán kính $r = 4\\text{ cm}$, chiều cao $h = 5\\text{ cm}$ có thể tích bằng?', back: '$V = \\pi \\cdot 4^2 \\cdot 5 = 80\\pi\\text{ cm}^3$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 9 (2006) · HH Chương IV',
        question: 'Hình nón có bán kính đáy $r = 5\\text{ cm}$ và chiều cao $h = 12\\text{ cm}$. Diện tích xung quanh của hình nón bằng:',
        options: ['A. $65\\pi\\text{ cm}^2$', 'B. $60\\pi\\text{ cm}^2$', 'C. $130\\pi\\text{ cm}^2$', 'D. $100\\pi\\text{ cm}^2$'],
        correctIndex: 0,
        explanation: 'Đường sinh $l = \\sqrt{5^2 + 12^2} = 13\\text{ cm} \\Rightarrow S_{xq} = \\pi r l = \\pi \\cdot 5 \\cdot 13 = 65\\pi\\text{ cm}^2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 9 (2006) · Thực tế hộp trụ',
        question: 'Một lon sữa hình trụ có đường kính đáy $8\\text{ cm}$ và chiều cao $10\\text{ cm}$. Tính diện tích giấy dán kín mặt xung quanh (bỏ qua mép nối, lấy $\\pi \\approx 3{,}14$).',
        hints: ['Bán kính $r = 8 / 2 = 4\\text{ cm}$, dùng $S_{xq} = 2\\pi r h$.'],
        solutionSteps: [
          'Bước 1: Bán kính đáy $r = 4\\text{ cm}$.',
          'Bước 2: $S_{xq} = 2\\pi r h = 2\\pi \\cdot 4 \\cdot 10 = 80\\pi \\approx 251{,}2\\text{ cm}^2$.'
        ],
        finalAnswer: '$S_{xq} \\approx 251{,}2\\text{ cm}^2$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'revolution_solid'
  },
  {
    id: 'math-2006-9-18',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 9',
    lessonNumber: 18,
    stageLabel: 'Toán 9 (2006) · HH Chương IV: Hình trụ – Hình nón – Hình cầu',
    sourceTag: 'SGK Hình học 9 (2006) · Bài 3',
    title: 'Bài 18 (2006): Hình cầu – Diện tích mặt cầu và Thể tích khối cầu',
    grade: 'Lớp 9 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Quay nửa hình tròn quanh đường kính tạo mặt cầu – khối cầu, thiết diện khi cắt mặt cầu bằng mặt phẳng và công thức $S = 4\\pi R^2$, $V = \\frac{4}{3}\\pi R^3$.',
    mnemonics: [
      'Diện tích mặt cầu bằng **4 lần** diện tích hình tròn lớn: $S = 4\\pi R^2 = \\pi d^2$.',
      'Thể tích hình cầu nhớ mũ 3 và $\\frac{4}{3}$: $V = \\frac{4}{3}\\pi R^3$.'
    ],
    commonTraps: [
      'Thay đường kính $d$ vào công thức $R$ mà quên chia đôi ($R = d/2$).',
      'Nhầm hệ số $\\frac{4}{3}$ trong thể tích với $4$ trong diện tích.'
    ],
    theory: [
      '1. Hình cầu và mặt cắt: Khi cắt hình cầu bởi một mặt phẳng bất kì đi qua nó, phần mặt cắt luôn là một hình tròn. Nếu mặt phẳng đi qua tâm $O$, giao tuyến là đường tròn lớn có bán kính bằng $R$.',
      '2. Công thức: Mặt cầu bán kính $R$ (đường kính $d = 2R$) có diện tích $S = 4\\pi R^2 = \\pi d^2$ và thể tích khối cầu $V = \\frac{4}{3}\\pi R^3 = \\frac{1}{6}\\pi d^3$.'
    ],
    keyFormulas: [
      'S_{\\text{cầu}} = 4\\pi R^2 = \\pi d^2',
      'V_{\\text{cầu}} = \\frac{4}{3}\\pi R^3'
    ],
    flashcards: [
      { front: 'Nếu tăng bán kính mặt cầu lên $2$ lần thì diện tích và thể tích thay đổi thế nào?', back: 'Diện tích tăng $2^2 = 4$ lần; thể tích tăng $2^3 = 8$ lần.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 9 (2006) · Bài 3',
        question: 'Một quả bóng hình cầu có đường kính $d = 6\\text{ cm}$. Thể tích của quả bóng đó là:',
        options: ['A. $36\\pi\\text{ cm}^3$', 'B. $288\\pi\\text{ cm}^3$', 'C. $108\\pi\\text{ cm}^3$', 'D. $12\\pi\\text{ cm}^3$'],
        correctIndex: 0,
        explanation: 'Bán kính $R = 3\\text{ cm} \\Rightarrow V = \\frac{4}{3}\\pi\\cdot 3^3 = 36\\pi\\text{ cm}^3$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 9 (2006) · Liên hệ Trụ – Cầu',
        question: 'Một mặt cầu có diện tích $S = 100\\pi\\text{ cm}^2$. Tính bán kính $R$ và thể tích khối cầu tương ứng.',
        hints: ['Giải $4\\pi R^2 = 100\\pi$ tìm $R$, rồi thay vào $V = \\frac{4}{3}\\pi R^3$.'],
        solutionSteps: [
          'Bước 1: $4\\pi R^2 = 100\\pi \\iff R^2 = 25 \\Rightarrow R = 5\\text{ cm}$.',
          'Bước 2: $V = \\frac{4}{3}\\pi\\cdot 5^3 = \\frac{500\\pi}{3}\\text{ cm}^3$.'
        ],
        finalAnswer: '$R = 5\\text{ cm}$; $V = \\frac{500\\pi}{3}\\text{ cm}^3$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'sphere_plane'
  }
];
