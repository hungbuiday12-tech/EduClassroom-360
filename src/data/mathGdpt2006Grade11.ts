import { MathLecture } from '../types';

// Chương trình Toán 11 GDPT 2006 (SGK Đại số & Giải tích 11 + Hình học 11 · NXB Giáo dục Việt Nam 2006)
// Đầy đủ 22 bài phủ hết 5 chương ĐS&GT + 3 chương Hình học (gồm Phép dời hình & Phép đồng dạng), mỗi bài gắn Mô phỏng 2D & 3D

export const MATH_GDPT_2006_GRADE_11: MathLecture[] = [
  // ==================== ĐS&GT 11 · CHƯƠNG I: HÀM SỐ LƯỢNG GIÁC & PHƯƠNG TRÌNH LƯỢNG GIÁC ====================
  {
    id: 'math-2006-11-1',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 1,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương I: Hàm số & Phương trình Lượng giác',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 1',
    title: 'Bài 1 (2006): Hàm số Lượng giác (y = sin x, cos x, tan x, cot x)',
    grade: 'Lớp 11 · Lượng giác',
    category: 'Lượng giác & Mũ',
    difficulty: 'Cơ bản',
    readTimeMinutes: 17,
    description:
      'Tập xác định, tập giá trị, tính chẵn lẻ, tính tuần hoàn và đồ thị hình sin của 4 hàm số lượng giác cơ bản $y = \\sin x$, $y = \\cos x$, $y = \\tan x$, $y = \\cot x$.',
    mnemonics: [
      'Chỉ duy nhất $y = \\cos x$ là hàm CHẴN; cả ba hàm $\\sin x, \\tan x, \\cot x$ đều là hàm LẺ.',
      'Chu kì tuần hoàn: $\\sin(ax+b)$ và $\\cos(ax+b)$ có $T = \\frac{2\\pi}{|a|}$; $\\tan(ax+b)$ và $\\cot(ax+b)$ có $T = \\frac{\\pi}{|a|}$.'
    ],
    commonTraps: [
      'Nhầm $\\tan x$ xác định trên $\\mathbb{R}$ (phải loại $x = \\frac{\\pi}{2} + k\\pi$).',
      'Quên trị tuyệt đối $|a|$ khi tính chu kì của $\\sin(ax+b)$.'
    ],
    theory: [
      '1. Tập xác định & Tập giá trị: $\\sin x, \\cos x$ xác định trên $\\mathbb{R}$ và có tập giá trị $[-1; 1]$. $\\tan x$ xác định khi $x \\neq \\frac{\\pi}{2} + k\\pi$; $\\cot x$ xác định khi $x \\neq k\\pi\\ (k \\in \\mathbb{Z})$, đều có tập giá trị $\\mathbb{R}$.',
      '2. Tính tuần hoàn: $\\sin x, \\cos x$ tuần hoàn với chu kì $T = 2\\pi$; $\\tan x, \\cot x$ tuần hoàn với chu kì $T = \\pi$.'
    ],
    keyFormulas: [
      '-1 \\le \\sin x \\le 1, \\quad -1 \\le \\cos x \\le 1',
      '\\tan x \\text{ xác định} \\iff x \\neq \\frac{\\pi}{2} + k\\pi; \\quad \\cot x \\text{ xác định} \\iff x \\neq k\\pi'
    ],
    flashcards: [
      { front: 'Tìm giá trị lớn nhất và nhỏ nhất của $y = 3\\sin x - 2$?', back: 'Vì $-1 \\le \\sin x \\le 1 \\Rightarrow -5 \\le y \\le 1 \\Rightarrow \\max y = 1,\\ \\min y = -5$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 1',
        question: 'Chu kì tuần hoàn của hàm số $y = \\sin 2x$ là:',
        options: ['A. $\\pi$', 'B. $2\\pi$', 'C. $4\\pi$', 'D. $\\frac{\\pi}{2}$'],
        correctIndex: 0,
        explanation: '$T = \\frac{2\\pi}{2} = \\pi$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Tìm GTLN - GTNN',
        question: 'Tìm tập xác định của hàm số $y = \\frac{1}{\\sin x - 1}$ và tìm tập giá trị của $y = 2\\cos^2 x + 1$.',
        hints: ['$\\sin x \\neq 1 \\iff x \\neq \\frac{\\pi}{2} + k2\\pi$; đánh giá $0 \\le \\cos^2 x \\le 1$.'],
        solutionSteps: [
          'Bước 1: ĐK $\\sin x - 1 \\neq 0 \\iff x \\neq \\frac{\\pi}{2} + k2\\pi\\ (k \\in \\mathbb{Z})$.',
          'Bước 2: Vì $0 \\le \\cos^2 x \\le 1 \\Rightarrow 1 \\le 2\\cos^2 x + 1 \\le 3$. Tập giá trị là $[1; 3]$.'
        ],
        finalAnswer: 'TXĐ: $\\mathbb{R} \\setminus \\{\\frac{\\pi}{2} + k2\\pi\\}$; TGT: $[1; 3]$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'trig_sin', params: { a: 1, b: 2, c: 0, d: 0 }, color: '#0284c7', name: 'y = sin(2x)' }
  },
  {
    id: 'math-2006-11-2',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 2,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương I: Hàm số & Phương trình Lượng giác',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 2',
    title: 'Bài 2 (2006): Phương trình Lượng giác cơ bản',
    grade: 'Lớp 11 · Lượng giác',
    category: 'Lượng giác & Mũ',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Công thức nghiệm của 4 phương trình lượng giác cơ bản $\\sin x = m$, $\\cos x = m$, $\\tan x = m$, $\\cot x = m$ và các trường hợp đặc biệt $m = 0, \\pm 1$.',
    mnemonics: [
      '$\\sin x = \\sin\\alpha \\iff x = \\alpha + k2\\pi$ hoặc $x = \\pi - \\alpha + k2\\pi$.',
      '$\\cos x = \\cos\\alpha \\iff x = \\pm\\alpha + k2\\pi$. $\\tan x = \\tan\\alpha \\iff x = \\alpha + k\\pi$.'
    ],
    commonTraps: [
      'Viết lẫn lộn độ và radian trong cùng công thức nghiệm (ví dụ $\\frac{\\pi}{6} + k360^\\circ$ là SAI!).',
      'Quên điều kiện $|m| \\le 1$ của $\\sin x = m, \\cos x = m$.'
    ],
    theory: [
      '1. $\\sin x = m$ & $\\cos x = m$: Có nghiệm khi $|m| \\le 1$. Đặc biệt: $\\sin x = 0 \\iff x = k\\pi$; $\\sin x = 1 \\iff x = \\frac{\\pi}{2} + k2\\pi$; $\\cos x = 0 \\iff x = \\frac{\\pi}{2} + k\\pi$; $\\cos x = -1 \\iff x = \\pi + k2\\pi$.',
      '2. $\\tan x = m$ & $\\cot x = m$: Luôn có nghiệm với mọi $m \\in \\mathbb{R}$, tuần hoàn với họ nghiệm $+ k\\pi$.'
    ],
    keyFormulas: [
      '\\sin x = \\sin\\alpha \\iff \\left[\\begin{array}{l} x = \\alpha + k2\\pi \\\\ x = \\pi - \\alpha + k2\\pi \\end{array}\\right.',
      '\\cos x = \\cos\\alpha \\iff x = \\pm\\alpha + k2\\pi; \\quad \\tan x = \\tan\\alpha \\iff x = \\alpha + k\\pi'
    ],
    flashcards: [
      { front: 'Nghiệm của phương trình $\\cos x = 0$?', back: '$x = \\frac{\\pi}{2} + k\\pi\\ (k \\in \\mathbb{Z})$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 2',
        question: 'Nghiệm của phương trình $\\tan\\left(x - \\frac{\\pi}{4}\\right) = 1$ là:',
        options: [
          'A. $x = \\frac{\\pi}{2} + k\\pi$',
          'B. $x = \\frac{\\pi}{4} + k\\pi$',
          'C. $x = \\frac{\\pi}{2} + k2\\pi$',
          'D. $x = k\\pi$'
        ],
        correctIndex: 0,
        explanation: '$x - \\frac{\\pi}{4} = \\frac{\\pi}{4} + k\\pi \\iff x = \\frac{\\pi}{2} + k\\pi$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Lọc nghiệm trên khoảng',
        question: 'Tìm tất cả nghiệm của phương trình $\\sin\\left(2x - \\frac{\\pi}{3}\\right) = \\frac{1}{2}$ thuộc đoạn $[0; \\pi]$.',
        hints: ['Giải tổng quát theo $k \\in \\mathbb{Z}$, sau đó giải bất phương trình $0 \\le x \\le \\pi$ tìm $k$ nguyên.'],
        solutionSteps: [
          'Bước 1: $2x - \\frac{\\pi}{3} = \\frac{\\pi}{6} + k2\\pi \\Rightarrow x = \\frac{\\pi}{4} + k\\pi$, hoặc $2x - \\frac{\\pi}{3} = \\frac{5\\pi}{6} + k2\\pi \\Rightarrow x = \\frac{7\\pi}{12} + k\\pi$.',
          'Bước 2: Với $x \\in [0; \\pi]$, chỉ có $k = 0$ thỏa mãn cả hai họ nghiệm.'
        ],
        finalAnswer: '$x = \\frac{\\pi}{4}$ và $x = \\frac{7\\pi}{12}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'circle_theorems_3d',
    defaultGraphConfig: { type: 'trig_cos', params: { a: 1, b: 1, c: 0, d: 0 }, color: '#059669', name: 'y = cos(x)' }
  },
  {
    id: 'math-2006-11-3',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 3,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương I: Hàm số & Phương trình Lượng giác',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 3',
    title: 'Bài 3 (2006): Một số Phương trình Lượng giác thường gặp',
    grade: 'Lớp 11 · Lượng giác',
    category: 'Lượng giác & Mũ',
    difficulty: 'Vận dụng',
    readTimeMinutes: 19,
    description:
      'Giải phương trình bậc hai đối với một hàm số lượng giác, phương trình bậc nhất đối với $\\sin x$ và $\\cos x$ ($a\\sin x + b\\cos x = c$) và phương trình đẳng cấp bậc hai.',
    mnemonics: [
      'Phương trình $a\\sin x + b\\cos x = c$ có nghiệm $\\iff a^2 + b^2 \\ge c^2$. Cách giải: chia cả hai vế cho $\\sqrt{a^2 + b^2}$.',
      'Phương trình đẳng cấp $a\\sin^2 x + b\\sin x\\cos x + c\\cos^2 x = d$: xét riêng $\\cos x = 0$ trước khi chia cho $\\cos^2 x$!'
    ],
    commonTraps: [
      'Chia phương trình cho $\\cos x$ (hoặc $\\cos^2 x$) mà quên xét trường hợp $\\cos x = 0$ gây sót nghiệm.',
      'Đặt $t = \\sin x$ quên điều kiện $-1 \\le t \\le 1$.'
    ],
    theory: [
      '1. Phương trình bậc hai theo một hàm lượng giác: Dùng công thức lượng giác đưa về cùng một hàm ($\\cos 2x = 1 - 2\\sin^2 x = 2\\cos^2 x - 1$), đặt $t$ (nhớ $|t| \\le 1$ nếu là $\\sin, \\cos$).',
      '2. Phương trình cổ điển $a\\sin x + b\\cos x = c$: Chia hai vế cho $\\sqrt{a^2 + b^2}$ để đưa về $\\sin(x + \\alpha) = \\frac{c}{\\sqrt{a^2+b^2}}$.'
    ],
    keyFormulas: [
      'a\\sin x + b\\cos x = c \\text{ có nghiệm} \\iff a^2 + b^2 \\ge c^2',
      '\\cos 2x = 1 - 2\\sin^2 x = 2\\cos^2 x - 1'
    ],
    flashcards: [
      { front: 'Có bao nhiêu giá trị nguyên của $m$ để $3\\sin 2x - 4\\cos 2x = m$ có nghiệm?', back: '$m^2 \\le 3^2 + (-4)^2 = 25 \\iff -5 \\le m \\le 5 \\Rightarrow$ Có $11$ giá trị nguyên.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 3',
        question: 'Điều kiện để phương trình $m\\sin x + 3\\cos x = 5$ có nghiệm là:',
        options: ['A. $|m| \\ge 4$', 'B. $|m| \\le 4$', 'C. $m \\ge 4$', 'D. $|m| \\ge 2$'],
        correctIndex: 0,
        explanation: '$m^2 + 3^2 \\ge 5^2 \\iff m^2 \\ge 16 \\iff |m| \\ge 4$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Phương trình bậc nhất sin, cos',
        question: 'Giải phương trình $\\sqrt{3}\\sin 2x - \\cos 2x = 2$.',
        hints: ['Chia hai vế cho $\\sqrt{(\\sqrt{3})^2 + (-1)^2} = 2$.'],
        solutionSteps: [
          'Bước 1: Chia hai vế cho $2$: $\\frac{\\sqrt{3}}{2}\\sin 2x - \\frac{1}{2}\\cos 2x = 1 \\iff \\sin\\left(2x - \\frac{\\pi}{6}\\right) = 1$.',
          'Bước 2: $2x - \\frac{\\pi}{6} = \\frac{\\pi}{2} + k2\\pi \\iff 2x = \\frac{2\\pi}{3} + k2\\pi \\iff x = \\frac{\\pi}{3} + k\\pi\\ (k \\in \\mathbb{Z})$.'
        ],
        finalAnswer: '$x = \\frac{\\pi}{3} + k\\pi\\ (k \\in \\mathbb{Z})$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'trig_sin', params: { a: 2, b: 1, c: 0, d: 0 }, color: '#0d9488', name: 'y = √3sin(x) - cos(x)' }
  },
  // ==================== ĐS&GT 11 · CHƯƠNG II: TỔ HỢP - XÁC SUẤT ====================
  {
    id: 'math-2006-11-4',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 4,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương II: Tổ hợp – Xác suất',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 1',
    title: 'Bài 4 (2006): Quy tắc đếm (Quy tắc Cộng & Quy tắc Nhân)',
    grade: 'Lớp 11 · Tổ hợp & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Phân biệt chính xác khi nào dùng Quy tắc Cộng (các phương án rời nhau hoàn thành công việc) và Quy tắc Nhân (các công đoạn liên tiếp nhau).',
    mnemonics: [
      '**Phương án (Xong việc ngay)** $\\to$ Quy tắc CỘNG. **Công đoạn (Phải làm nối tiếp mới xong)** $\\to$ Quy tắc NHÂN.',
      'Bài toán lập số tự nhiên có chữ số $0$: luôn chọn chữ số hàng cao nhất (khác $0$) trước, hoặc chữ số tận cùng (nếu chia hết 2, 5).'
    ],
    commonTraps: [
      'Chọn chữ số đầu tiên bằng $0$ hoặc quên điều kiện "các chữ số đôi một khác nhau".'
    ],
    theory: [
      '1. Quy tắc cộng: Công việc được thực hiện theo một trong $k$ phương án rời nhau, phương án $i$ có $n_i$ cách thì tổng số cách là $n_1 + n_2 + \\dots + n_k$.',
      '2. Quy tắc nhân: Công việc gồm $k$ công đoạn liên tiếp, công đoạn $i$ có $m_i$ cách thì tổng số cách là $m_1 \\cdot m_2 \\cdots m_k$.'
    ],
    keyFormulas: [
      'N_{\\text{cộng}} = n_1 + n_2 + \\dots + n_k',
      'N_{\\text{nhân}} = m_1 \\cdot m_2 \\cdots m_k'
    ],
    flashcards: [
      { front: 'Từ các chữ số $1, 2, 3, 4, 5$ lập được bao nhiêu số có 3 chữ số khác nhau?', back: '$5 \\cdot 4 \\cdot 3 = 60$ số.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 1',
        question: 'Từ các chữ số $0, 1, 2, 3, 4$ có thể lập được bao nhiêu số tự nhiên có 3 chữ số ĐÔI MỘT KHÁC NHAU?',
        options: ['A. $48$', 'B. $60$', 'C. $100$', 'D. $24$'],
        correctIndex: 0,
        explanation: 'Chữ số hàng trăm khác $0$ có $4$ cách, hàng chục còn $4$ cách, hàng đơn vị còn $3$ cách: $4\\cdot 4\\cdot 3 = 48$ số.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Đếm số chẵn',
        question: 'Từ các chữ số $0, 1, 2, 3, 4, 5$ lập được bao nhiêu số chẵn gồm 3 chữ số đôi một khác nhau?',
        hints: ['Chia 2 trường hợp chữ số tận cùng $c = 0$ và $c \\in \\{2; 4\\}$ để không nhầm với điều kiện $a \\neq 0$.'],
        solutionSteps: [
          'Bước 1: Trường hợp $c = 0$ (1 cách): $a$ có 5 cách, $b$ có 4 cách $\\Rightarrow 1\\cdot 5\\cdot 4 = 20$ số.',
          'Bước 2: Trường hợp $c \\in \\{2; 4\\}$ (2 cách): $a \\neq 0, a \\neq c$ có 4 cách, $b$ có 4 cách $\\Rightarrow 2\\cdot 4\\cdot 4 = 32$ số.',
          'Bước 3: Theo quy tắc cộng có $20 + 32 = 52$ số.'
        ],
        finalAnswer: '$52$ số.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'exponential', params: { a: 2, b: 1, c: 0, d: 0 }, color: '#059669', name: 'Tăng trưởng tổ hợp 2^n' }
  },
  {
    id: 'math-2006-11-5',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 5,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương II: Tổ hợp – Xác suất',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 2',
    title: 'Bài 5 (2006): Hoán vị – Chỉnh hợp – Tổ hợp',
    grade: 'Lớp 11 · Tổ hợp & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Phân biệt và tính toán $P_n = n!$, chỉnh hợp $A_n^k = \\frac{n!}{(n-k)!}$ (có thứ tự) và tổ hợp $C_n^k = \\frac{n!}{k!(n-k)!}$ (không phân biệt thứ tự).',
    mnemonics: [
      'Có xếp thứ tự (chọn xong phân công chức vụ, lập số, xếp hàng) $\\to$ **Chỉnh hợp $A_n^k$**. Chỉ chọn ra một nhóm bất kì $\\to$ **Tổ hợp $C_n^k$**.',
      'Tính chất đối xứng tổ hợp: $C_n^k = C_n^{n-k}$ và công thức Pascal $C_n^k + C_n^{k+1} = C_{n+1}^{k+1}$.'
    ],
    commonTraps: [
      'Dùng chỉnh hợp cho bài toán chọn tập con / lập tam giác / bắt tay (nhầm giữa có thứ tự và không thứ tự).'
    ],
    theory: [
      '1. Hoán vị & Chỉnh hợp: Số hoán vị của $n$ phần tử là $P_n = n!$. Số chỉnh hợp chập $k$ của $n$ phần tử ($1 \\le k \\le n$): $A_n^k = \\frac{n!}{(n-k)!} = n(n-1)\\dots(n-k+1)$.',
      '2. Tổ hợp: Số tổ hợp chập $k$ của $n$ phần tử ($0 \\le k \\le n$): $C_n^k = \\frac{n!}{k!(n-k)!} = \\frac{A_n^k}{k!}$.'
    ],
    keyFormulas: [
      'P_n = n!, \\quad A_n^k = \\frac{n!}{(n-k)!}, \\quad C_n^k = \\frac{n!}{k!(n-k)!}',
      'C_n^k = C_n^{n-k}, \\quad C_n^k + C_n^{k+1} = C_{n+1}^{k+1}'
    ],
    flashcards: [
      { front: 'Đa giác lồi $10$ đỉnh có bao nhiêu đường chéo?', back: 'Số đoạn nối 2 đỉnh trừ đi $10$ cạnh: $C_{10}^2 - 10 = 45 - 10 = 35$ đường chéo.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 2',
        question: 'Có bao nhiêu cách chọn 3 học sinh từ 10 học sinh để làm Lớp trưởng, Lớp phó và Bí thư?',
        options: ['A. $A_{10}^3 = 720$', 'B. $C_{10}^3 = 120$', 'C. $3! = 6$', 'D. $10^3 = 1000$'],
        correctIndex: 0,
        explanation: 'Vì 3 chức vụ khác nhau nên có phân biệt thứ tự $\\Rightarrow$ dùng chỉnh hợp $A_{10}^3 = 10\\cdot 9\\cdot 8 = 720$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Giải phương trình tổ hợp',
        question: 'Tìm số tự nhiên $n \\ge 2$ thỏa mãn $C_n^2 + 2n = 44$.',
        hints: ['Khai triển $C_n^2 = \\frac{n(n-1)}{2}$ rồi giải phương trình bậc hai theo $n \\ge 2$.'],
        solutionSteps: [
          'Bước 1: ĐK $n \\in \\mathbb{N}, n \\ge 2$. Phương trình thành $\\frac{n(n-1)}{2} + 2n = 44$.',
          'Bước 2: Quy đồng: $n^2 + 3n - 88 = 0 \\iff (n - 8)(n + 11) = 0 \\iff n = 8$ (thỏa mãn).'
        ],
        finalAnswer: '$n = 8$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: 0.5, b: -0.5, c: 0, d: 0 }, color: '#0d9488', name: 'y = n(n-1)/2 (C_n^2)' }
  },
  {
    id: 'math-2006-11-6',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 6,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương II: Tổ hợp – Xác suất',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 3',
    title: 'Bài 6 (2006): Nhị thức Newton (a + b)ⁿ & Tam giác Pascal',
    grade: 'Lớp 11 · Tổ hợp & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Khai triển tổng quát $(a + b)^n = \\sum_{k=0}^n C_n^k a^{n-k} b^k$, số hạng tổng quát $T_{k+1}$, tìm hệ số/số hạng không chứa $x$ và tính tổng tổ hợp.',
    mnemonics: [
      'Khai triển $(a+b)^n$ có ĐÚNG $n + 1$ số hạng.',
      'Số hạng thứ $k+1$ là $T_{k+1} = C_n^k a^{n-k} b^k$ (chú ý mang theo dấu âm nếu là $(a - b)^n$!).'
    ],
    commonTraps: [
      'Nhầm hệ số của $x^m$ với cả số hạng chứa $x^m$, hoặc quên lũy thừa $(-1)^k$ trong $(a - b)^n$.'
    ],
    theory: [
      '1. Công thức Nhị thức Newton: $(a + b)^n = C_n^0 a^n + C_n^1 a^{n-1}b + \\dots + C_n^k a^{n-k}b^k + \\dots + C_n^n b^n$.',
      '2. Hệ quả đặc biệt: Thay $a = b = 1$: $C_n^0 + C_n^1 + \\dots + C_n^n = 2^n$. Thay $a = 1, b = -1$: $C_n^0 - C_n^1 + C_n^2 - \\dots + (-1)^n C_n^n = 0$.'
    ],
    keyFormulas: [
      '(a+b)^n = \\sum_{k=0}^n C_n^k a^{n-k} b^k, \\quad T_{k+1} = C_n^k a^{n-k} b^k',
      'C_n^0 + C_n^1 + \\dots + C_n^n = 2^n'
    ],
    flashcards: [
      { front: 'Tổng tất cả các hệ số trong khai triển $(3x - 2)^{20}$?', back: 'Thay $x = 1$: $(3\\cdot 1 - 2)^{20} = 1^{20} = 1$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 3',
        question: 'Số hạng không chứa $x$ trong khai triển $\\left(x + \\frac{2}{x}\\right)^4\\ (x \\neq 0)$ là:',
        options: ['A. $24$', 'B. $16$', 'C. $6$', 'D. $12$'],
        correctIndex: 0,
        explanation: 'Số hạng tổng quát $C_4^k x^{4-k} \\left(\\frac{2}{x}\\right)^k = C_4^k 2^k x^{4 - 2k}$. Cho $4 - 2k = 0 \\iff k = 2 \\Rightarrow C_4^2 \\cdot 2^2 = 6\\cdot 4 = 24$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Tìm hệ số khai triển',
        question: 'Tìm hệ số của $x^4$ trong khai triển $(2x - 1)^7$.',
        hints: ['Viết $T_{k+1} = C_7^k (2x)^{7-k} (-1)^k$ rồi cho số mũ $7 - k = 4$.'],
        solutionSteps: [
          'Bước 1: $T_{k+1} = C_7^k 2^{7-k} (-1)^k x^{7-k}$.',
          'Bước 2: Để chứa $x^4$ thì $7 - k = 4 \\iff k = 3$.',
          'Bước 3: Hệ số cần tìm là $C_7^3 \\cdot 2^4 \\cdot (-1)^3 = 35 \\cdot 16 \\cdot (-1) = -560$.'
        ],
        finalAnswer: '$-560$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: 3, c: 3, d: 1 }, color: '#059669', name: 'y = (x+1)³' }
  },
  {
    id: 'math-2006-11-7',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 7,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương II: Tổ hợp – Xác suất',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 4–5',
    title: 'Bài 7 (2006): Phép thử, Biến cố & Xác suất cổ điển',
    grade: 'Lớp 11 · Tổ hợp & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Không gian mẫu $\\Omega$, biến cố đối $\\overline{A}$, biến cố xung khắc – độc lập, định nghĩa cổ điển của xác suất $P(A) = \\frac{n(A)}{n(\\Omega)}$, quy tắc cộng và quy tắc nhân xác suất.',
    mnemonics: [
      'Khi gặp bài toán **"ít nhất 1..."**, hãy tính biến cố đối $\\overline{A}$ ("không có cái nào...") rồi lấy $P(A) = 1 - P(\\overline{A})$.',
      'Hai biến cố ĐỘC LẬP $\\iff P(A\\cap B) = P(A)\\cdot P(B)$.'
    ],
    commonTraps: [
      'Nhầm lẫn "xung khắc" ($A \\cap B = \\varnothing$, tổng $P(A \\cup B) = P(A) + P(B)$) với "độc lập" ($P(AB) = P(A)P(B)$).'
    ],
    theory: [
      '1. Định nghĩa xác suất cổ điển: Với phép thử có các kết quả đồng khả năng, $P(A) = \\frac{n(A)}{n(\\Omega)}$, luôn có $0 \\le P(A) \\le 1$ và $P(\\overline{A}) = 1 - P(A)$.',
      '2. Quy tắc cộng & nhân: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ (nếu xung khắc thì trừ $0$). Nếu $A, B$ độc lập: $P(AB) = P(A)P(B)$.'
    ],
    keyFormulas: [
      'P(A) = \\frac{n(A)}{n(\\Omega)}, \\quad P(\\overline{A}) = 1 - P(A)',
      'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)'
    ],
    flashcards: [
      { front: 'Tung một đồng xu cân đối 3 lần. Xác suất để có ít nhất 1 lần xuất hiện mặt ngửa?', back: '$n(\\Omega) = 2^3 = 8$; biến cố đối "cả 3 lần sấp" có $1$ kết quả $\\Rightarrow P = 1 - \\frac{1}{8} = \\frac{7}{8}$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 5',
        question: 'Gieo một con súc sắc cân đối đồng chất 2 lần. Xác suất để tổng số chấm trong hai lần gieo bằng $7$ là:',
        options: ['A. $\\frac{1}{6}$', 'B. $\\frac{1}{12}$', 'C. $\\frac{5}{36}$', 'D. $\\frac{7}{36}$'],
        correctIndex: 0,
        explanation: '$n(\\Omega) = 36$. Các cặp tổng $7$: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$ có $6$ cặp $\\Rightarrow P = \\frac{6}{36} = \\frac{1}{6}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Bài toán biến cố đối',
        question: 'Một hộp có 6 bi trắng và 4 bi đen. Lấy ngẫu nhiên đồng thời 3 viên bi. Tính xác suất để lấy được ít nhất 1 bi trắng.',
        hints: ['Tính $P(\\overline{A})$ với $\\overline{A}$: "cả 3 viên bi lấy ra đều màu đen".'],
        solutionSteps: [
          'Bước 1: $n(\\Omega) = C_{10}^3 = 120$.',
          'Bước 2: Số cách lấy 3 bi toàn đen: $n(\\overline{A}) = C_4^3 = 4 \\Rightarrow P(\\overline{A}) = \\frac{4}{120} = \\frac{1}{30}$.',
          'Bước 3: Xác suất cần tìm: $P(A) = 1 - \\frac{1}{30} = \\frac{29}{30}$.'
        ],
        finalAnswer: '$P(A) = \\frac{29}{30}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'linear', params: { a: -1, b: 1, c: 0, d: 0 }, color: '#0284c7', name: 'P(A) + P(Ā) = 1' }
  },
  // ==================== ĐS&GT 11 · CHƯƠNG III: DÃY SỐ - CẤP SỐ CỘNG - CẤP SỐ NHÂN ====================
  {
    id: 'math-2006-11-8',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 8,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương III: Dãy số – Cấp số cộng – Cấp số nhân',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 1–2',
    title: 'Bài 8 (2006): Phương pháp Quy nạp Toán học & Dãy số',
    grade: 'Lớp 11 · Đại số & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description:
      'Quy trình 2 bước chứng minh bằng quy nạp toán học ($n = 1$ và bước quy nạp $n = k \\Rightarrow n = k + 1$), cách cho dãy số và xét tính tăng, giảm, bị chặn của dãy số.',
    mnemonics: [
      'Xét dãy tăng/giảm: xét hiệu $u_{n+1} - u_n > 0$ (tăng) hay $< 0$ (giảm); hoặc nếu $u_n > 0$ thì so sánh thương $\\frac{u_{n+1}}{u_n}$ với $1$.'
    ],
    commonTraps: [
      'Thiếu bước kiểm tra mệnh đề đúng với $n = 1$ (hoặc giá trị khởi đầu $n_0$) trong chứng minh quy nạp.'
    ],
    theory: [
      '1. Phương pháp quy nạp toán học: Để chứng minh $P(n)$ đúng với mọi $n \\in \\mathbb{N}^*$: (B1) Kiểm tra $P(1)$ đúng; (B2) Giả sử $P(k)$ đúng với $k \\ge 1$, chứng minh $P(k+1)$ cũng đúng.',
      '2. Tính chất dãy số: $(u_n)$ tăng nếu $u_{n+1} > u_n\\ \\forall n$; giảm nếu $u_{n+1} < u_n\\ \\forall n$. Dãy bị chặn nếu tồn tại $m, M$ sao cho $m \\le u_n \\le M\\ \\forall n \\in \\mathbb{N}^*$.'
    ],
    keyFormulas: [
      '1 + 2 + \\dots + n = \\frac{n(n+1)}{2}, \\quad 1^2 + 2^2 + \\dots + n^2 = \\frac{n(n+1)(2n+1)}{6}'
    ],
    flashcards: [
      { front: 'Xét tính tăng giảm của dãy $u_n = \\frac{n}{n+1}$?', back: '$u_{n+1} - u_n = \\frac{n+1}{n+2} - \\frac{n}{n+1} = \\frac{1}{(n+1)(n+2)} > 0 \\Rightarrow$ Dãy tăng.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 2',
        question: 'Cho dãy số $(u_n)$ với $u_n = 2n - 1$. Giá trị của $u_5$ bằng:',
        options: ['A. $9$', 'B. $10$', 'C. $11$', 'D. $7$'],
        correctIndex: 0,
        explanation: '$u_5 = 2\\cdot 5 - 1 = 9$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Quy nạp',
        question: 'Chứng minh bằng quy nạp rằng với mọi $n \\in \\mathbb{N}^*$: $1 + 3 + 5 + \\dots + (2n - 1) = n^2$.',
        hints: ['Kiểm tra $n=1$ ($1=1^2$), giả sử đúng với $n=k$ rồi cộng thêm $(2k+1)$ vào hai vế.'],
        solutionSteps: [
          'Bước 1: Với $n = 1$: VT $= 1$, VP $= 1^2 = 1$ (đúng).',
          'Bước 2: Giả sử đúng với $n = k \\ge 1$: $1 + 3 + \\dots + (2k-1) = k^2$. Với $n = k+1$: VT $= k^2 + (2k + 1) = (k + 1)^2 =$ VP (đpcm).'
        ],
        finalAnswer: 'Đẳng thức đúng với mọi $n \\in \\mathbb{N}^*$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'rational', params: { a: 1, b: 0, c: 1, d: 1 }, color: '#059669', name: 'u_n = x/(x+1)' }
  },
  {
    id: 'math-2006-11-9',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 9,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương III: Dãy số – Cấp số cộng – Cấp số nhân',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 3–4',
    title: 'Bài 9 (2006): Cấp số cộng (CSC) & Cấp số nhân (CSN)',
    grade: 'Lớp 11 · Đại số & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 18,
    description:
      'Định nghĩa, số hạng tổng quát $u_n$, tính chất 3 số hạng liên tiếp và công thức tính tổng $n$ số hạng đầu $S_n$ của Cấp số cộng (công sai $d$) và Cấp số nhân (công bội $q$).',
    mnemonics: [
      '3 số $a, b, c$ lập thành **CSC** $\\iff a + c = 2b$. Lập thành **CSN** $\\iff a \\cdot c = b^2$.',
      'CSC cộng thêm công sai: $u_n = u_1 + (n-1)d$. CSN nhân với công bội: $u_n = u_1 q^{n-1}$.'
    ],
    commonTraps: [
      'Áp dụng $S_n = u_1\\frac{1 - q^n}{1 - q}$ cho trường hợp công bội $q = 1$ (khi $q = 1$ thì $S_n = n u_1$).'
    ],
    theory: [
      '1. Cấp số cộng $(u_n)$ công sai $d$: $u_{n+1} = u_n + d$; $u_n = u_1 + (n-1)d$; tổng $n$ số hạng đầu $S_n = \\frac{n(u_1 + u_n)}{2} = \\frac{n[2u_1 + (n-1)d]}{2}$.',
      '2. Cấp số nhân $(u_n)$ công bội $q$: $u_{n+1} = u_n \\cdot q$; $u_n = u_1 q^{n-1}$; tổng $n$ số hạng đầu $S_n = u_1\\frac{1 - q^n}{1 - q}\\ (q \\neq 1)$.'
    ],
    keyFormulas: [
      '\\text{CSC: } u_n = u_1 + (n-1)d, \\quad S_n = \\frac{n(u_1+u_n)}{2}',
      '\\text{CSN: } u_n = u_1 q^{n-1}, \\quad S_n = u_1\\frac{1-q^n}{1-q}\\ (q \\neq 1)'
    ],
    flashcards: [
      { front: 'CSC có $u_1 = 3$ và $u_5 = 15$. Công sai $d$ bằng?', back: '$u_5 = u_1 + 4d \\iff 15 = 3 + 4d \\iff d = 3$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 4',
        question: 'Cho cấp số nhân $(u_n)$ có $u_1 = 2$ và công bội $q = 3$. Số hạng $u_4$ bằng:',
        options: ['A. $54$', 'B. $18$', 'C. $162$', 'D. $11$'],
        correctIndex: 0,
        explanation: '$u_4 = u_1 q^3 = 2 \\cdot 3^3 = 54$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Hệ phương trình CSC',
        question: 'Cho cấp số cộng $(u_n)$ thỏa $\\begin{cases} u_2 + u_4 = 14 \\\\ u_5 = 13 \\end{cases}$. Tìm $u_1$, công sai $d$ và tổng 10 số hạng đầu $S_{10}$.',
        hints: ['Đưa $u_2, u_4, u_5$ về theo $u_1$ và $d$.'],
        solutionSteps: [
          'Bước 1: $(u_1 + d) + (u_1 + 3d) = 14 \\iff 2u_1 + 4d = 14 \\iff u_1 + 2d = 7$ (tức $u_3 = 7$).',
          'Bước 2: Kết hợp $u_1 + 4d = 13 \\Rightarrow 2d = 6 \\iff d = 3$, suy ra $u_1 = 1$.',
          'Bước 3: $S_{10} = \\frac{10(2\\cdot 1 + 9\\cdot 3)}{2} = 5 \\cdot 29 = 145$.'
        ],
        finalAnswer: '$u_1 = 1, d = 3, S_{10} = 145$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'exponential', params: { a: 3, b: 1, c: 0, d: 0 }, color: '#0d9488', name: 'u_n = 3^x (CSN)' }
  },
  // ==================== ĐS&GT 11 · CHƯƠNG IV: GIỚI HẠN ====================
  {
    id: 'math-2006-11-10',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 10,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương IV: Giới hạn & Liên tục',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 1',
    title: 'Bài 10 (2006): Giới hạn của Dãy số & Tổng Cấp số nhân lùi vô hạn',
    grade: 'Lớp 11 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Giới hạn hữu hạn – vô cực của dãy số, kỹ thuật chia tử và mẫu cho lũy thừa $n$ bậc cao nhất, nhân liên hợp và công thức tổng cấp số nhân lùi vô hạn $S = \\frac{u_1}{1 - q}$.',
    mnemonics: [
      'Cấp số nhân lùi vô hạn có $|q| < 1$ thì tổng $S = \\frac{u_1}{1 - q}$.',
      '$\\lim \\frac{a_k n^k + \\dots}{b_k n^k + \\dots} = \\frac{a_k}{b_k}$ (nếu bậc tử $<$ bậc mẫu $\\to 0$; bậc tử $>$ bậc mẫu $\\to \\pm\\infty$).'
    ],
    commonTraps: [
      'Quên dấu khi đưa $n^2$ ra khỏi căn với giới hạn $x \\to -\\infty$ (ở Chương 4 dãy số $n \\to +\\infty$ thì $\\sqrt{n^2} = n$, nhưng hàm số $x \\to -\\infty$ phải ra $|x| = -x$!).'
    ],
    theory: [
      '1. Giới hạn đặc biệt: $\\lim \\frac{1}{n^k} = 0\\ (k \\in \\mathbb{N}^*)$; $\\lim q^n = 0$ nếu $|q| < 1$; $\\lim q^n = +\\infty$ nếu $q > 1$.',
      '2. Cấp số nhân lùi vô hạn: Là CSN vô hạn có công bội $|q| < 1$, tổng $S = u_1 + u_2 + \\dots = \\frac{u_1}{1 - q}$.'
    ],
    keyFormulas: [
      '\\lim \\frac{1}{n^k} = 0, \\quad \\lim q^n = 0 \\ (|q| < 1)',
      'S = \\frac{u_1}{1 - q} \\quad (|q| < 1)'
    ],
    flashcards: [
      { front: 'Tính tổng $S = 1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\dots$?', back: 'CSN lùi vô hạn $u_1 = 1, q = \\frac{1}{2} \\Rightarrow S = \\frac{1}{1 - 1/2} = 2$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 1',
        question: 'Giá trị của giới hạn $\\lim \\frac{6n^2 + 3n - 1}{2n^2 + 5}$ là:',
        options: ['A. $3$', 'B. $\\frac{3}{5}$', 'C. $0$', 'D. $+\\infty$'],
        correctIndex: 0,
        explanation: 'Chia tử và mẫu cho $n^2$: $\\lim \\frac{6 + 3/n - 1/n^2}{2 + 5/n^2} = \\frac{6}{2} = 3$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Giới hạn liên hợp dãy số',
        question: 'Tính giới hạn $L = \\lim \\left(\\sqrt{n^2 + 4n} - n\\right)$.',
        hints: ['Nhân và chia cho biểu thức liên hợp $\\sqrt{n^2 + 4n} + n$.'],
        solutionSteps: [
          'Bước 1: $\\sqrt{n^2 + 4n} - n = \\frac{(n^2 + 4n) - n^2}{\\sqrt{n^2 + 4n} + n} = \\frac{4n}{n(\\sqrt{1 + 4/n} + 1)} = \\frac{4}{\\sqrt{1 + 4/n} + 1}$.',
          'Bước 2: Khi $n \\to +\\infty$, $\\frac{4}{n} \\to 0 \\Rightarrow L = \\frac{4}{1 + 1} = 2$.'
        ],
        finalAnswer: '$L = 2$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'rational', params: { a: 6, b: 0, c: 2, d: 5 }, color: '#059669', name: 'y = (6x²)/(2x²+5) → 3' }
  },
  {
    id: 'math-2006-11-11',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 11,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương IV: Giới hạn & Liên tục',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 2',
    title: 'Bài 11 (2006): Giới hạn của Hàm số (Vô định 0/0, ∞/∞ & Một bên)',
    grade: 'Lớp 11 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description:
      'Giới hạn tại điểm, giới hạn một bên ($x \\to x_0^+$, $x \\to x_0^-$), giới hạn tại vô cực và phương pháp khử dạng vô định $\\frac{0}{0}, \\frac{\\infty}{\\infty}, \\infty - \\infty$.',
    mnemonics: [
      'Dạng $\\frac{0}{0}$ đa thức: phân tích triệt tiêu nhân tử $(x - x_0)$. Dạng $\\frac{0}{0}$ chứa căn: nhân lượng liên hợp.',
      'Khi $x \\to -\\infty$, đưa $x^2$ ra khỏi căn phải viết $\\sqrt{x^2} = |x| = -x$!'
    ],
    commonTraps: [
      'Quên đổi dấu thành $-x$ khi đưa $\\sqrt{x^2}$ ra ngoài lúc $x \\to -\\infty$.'
    ],
    theory: [
      '1. Giới hạn một bên: $\\lim_{x \\to x_0} f(x) = L \\iff \\lim_{x \\to x_0^+} f(x) = \\lim_{x \\to x_0^-} f(x) = L$.',
      '2. Khử dạng vô định: Phân tích nhân tử $(x - x_0)$, nhân liên hợp với $\\sqrt{A} - \\sqrt{B}$, hoặc chia lũy thừa cao nhất của $x$ khi $x \\to \\pm\\infty$.'
    ],
    keyFormulas: [
      '\\sqrt{x^2} = |x| = \\begin{cases} x & \\text{khi } x \\to +\\infty \\\\ -x & \\text{khi } x \\to -\\infty \\end{cases}',
      '\\lim_{x \\to x_0} f(x) = L \\iff \\lim_{x \\to x_0^+} f(x) = \\lim_{x \\to x_0^-} f(x) = L'
    ],
    flashcards: [
      { front: 'Tính $\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$?', back: '$\\lim_{x \\to 3}(x + 3) = 6$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 2',
        question: 'Giá trị của giới hạn $\\lim_{x \\to 1} \\frac{\\sqrt{x + 3} - 2}{x - 1}$ là:',
        options: ['A. $\\frac{1}{4}$', 'B. $\\frac{1}{2}$', 'C. $0$', 'D. $4$'],
        correctIndex: 0,
        explanation: 'Nhân liên hợp $\\sqrt{x+3}+2$: $\\lim_{x \\to 1} \\frac{x-1}{(x-1)(\\sqrt{x+3}+2)} = \\frac{1}{2 + 2} = \\frac{1}{4}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Giới hạn tại âm vô cực',
        question: 'Tính giới hạn $I = \\lim_{x \\to -\\infty} \\frac{\\sqrt{4x^2 + 1} + x}{2x - 3}$.',
        hints: ['Khi $x < 0$, $\\sqrt{4x^2+1} = -x\\sqrt{4 + 1/x^2}$, sau đó chia tử và mẫu cho $x$.'],
        solutionSteps: [
          'Bước 1: Với $x < 0$: $\\sqrt{4x^2 + 1} = |x|\\sqrt{4 + \\frac{1}{x^2}} = -x\\sqrt{4 + \\frac{1}{x^2}}$.',
          'Bước 2: Chia cả tử và mẫu cho $x$: $I = \\lim_{x \\to -\\infty} \\frac{-\\sqrt{4 + 1/x^2} + 1}{2 - 3/x} = \\frac{-2 + 1}{2} = -\\frac{1}{2}$.'
        ],
        finalAnswer: '$I = -\\frac{1}{2}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'rational', params: { a: 1, b: 1, c: 1, d: -1 }, color: '#0284c7', name: 'Đồ thị giới hạn hàm phân thức' }
  },
  {
    id: 'math-2006-11-12',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 12,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương IV: Giới hạn & Liên tục',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 3',
    title: 'Bài 12 (2006): Hàm số Liên tục & Chứng minh phương trình có nghiệm',
    grade: 'Lớp 11 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description:
      'Điều kiện liên tục tại điểm $x_0$, trên khoảng/đoạn $[a; b]$ và định lí giá trị trung gian: nếu $f(x)$ liên tục trên $[a; b]$ và $f(a)\\cdot f(b) < 0$ thì $f(x) = 0$ có ít nhất 1 nghiệm thuộc $(a; b)$.',
    mnemonics: [
      '3 bước xét liên tục tại $x_0$: (1) Tính $f(x_0)$; (2) Tính $\\lim_{x \\to x_0} f(x)$ (hoặc giới hạn trái/phải); (3) So sánh bằng nhau.',
      'Chứng minh có ít nhất $k$ nghiệm: chia thành $k$ đoạn liên tiếp sao cho hai đầu mút mỗi đoạn trái dấu ($f(a_i)f(b_i) < 0$).'
    ],
    commonTraps: [
      'Quên khẳng định hàm số $f(x)$ liên tục trên $[a; b]$ trước khi suy ra nghiệm từ $f(a)\\cdot f(b) < 0$.'
    ],
    theory: [
      '1. Định nghĩa: Hàm số $y = f(x)$ liên tục tại $x_0 \\iff \\lim_{x \\to x_0} f(x) = f(x_0)$ (tức $\\lim_{x \\to x_0^+} f(x) = \\lim_{x \\to x_0^-} f(x) = f(x_0)$).',
      '2. Hệ quả: Hàm đa thức liên tục trên $\\mathbb{R}$; hàm phân thức và lượng giác liên tục trên từng khoảng xác định. Nếu $f(x)$ liên tục trên $[a; b]$ và $f(a)f(b) < 0$ thì $\\exists c \\in (a; b): f(c) = 0$.'
    ],
    keyFormulas: [
      '\\lim_{x \\to x_0} f(x) = f(x_0)',
      'f(x) \\text{ liên tục trên } [a; b] \\text{ và } f(a)\\cdot f(b) < 0 \\implies \\exists c \\in (a; b): f(c) = 0'
    ],
    flashcards: [
      { front: 'Phương trình $x^3 - 3x + 1 = 0$ có nghiệm trong $(0; 1)$ không?', back: '$f(0) = 1 > 0$, $f(1) = -1 < 0$ và $f$ liên tục trên $[0; 1] \\Rightarrow$ Có ít nhất 1 nghiệm.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 3',
        question: 'Cho hàm số $f(x) = \\begin{cases} \\frac{x^2 - 4}{x - 2} & \\text{khi } x \\neq 2 \\\\ m & \\text{khi } x = 2 \\end{cases}$. Để hàm số liên tục tại $x = 2$ thì $m$ bằng:',
        options: ['A. $4$', 'B. $2$', 'C. $0$', 'D. $-4$'],
        correctIndex: 0,
        explanation: '$\\lim_{x \\to 2} \\frac{x^2-4}{x-2} = \\lim_{x \\to 2}(x+2) = 4$. Liên tục tại $2 \\iff m = 4$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Chứng minh phương trình có 3 nghiệm',
        question: 'Chứng minh phương trình $x^3 - 3x + 1 = 0$ có đúng 3 nghiệm phân biệt.',
        hints: ['Tính giá trị $f(x)$ tại $-2, 0, 1, 2$ để tìm 3 khoảng đổi dấu phân biệt.'],
        solutionSteps: [
          'Bước 1: $f(x) = x^3 - 3x + 1$ là hàm đa thức nên liên tục trên $\\mathbb{R}$.',
          'Bước 2: $f(-2) = -1 < 0$, $f(0) = 1 > 0$, $f(1) = -1 < 0$, $f(2) = 3 > 0$.',
          'Bước 3: Vì $f(-2)f(0) < 0, f(0)f(1) < 0, f(1)f(2) < 0$, phương trình có ít nhất 3 nghiệm trên $(-2;0), (0;1), (1;2)$. Phương trình bậc 3 có tối đa 3 nghiệm nên có đúng 3 nghiệm.'
        ],
        finalAnswer: 'Phương trình có đúng $3$ nghiệm phân biệt.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: 0, c: -3, d: 1 }, color: '#059669', name: 'y = x³ - 3x + 1' }
  },
  // ==================== ĐS&GT 11 · CHƯƠNG V: ĐẠO HÀM ====================
  {
    id: 'math-2006-11-13',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 13,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương V: Đạo hàm',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 1',
    title: 'Bài 13 (2006): Định nghĩa Đạo hàm, Ý nghĩa Hình học & Tiếp tuyến tại điểm',
    grade: 'Lớp 11 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Cơ bản',
    readTimeMinutes: 17,
    description:
      'Định nghĩa đạo hàm tại điểm $x_0$ bằng giới hạn $\\lim_{\\Delta x \\to 0}\\frac{\\Delta y}{\\Delta x}$, ý nghĩa hình học $k = f\'(x_0)$ và phương trình tiếp tuyến của đồ thị $(C)$ tại $M(x_0; y_0)$.',
    mnemonics: [
      'Hệ số góc tiếp tuyến tại điểm $M(x_0; y_0)$ chính là đạo hàm $k = f\'(x_0)$.',
      'Tiếp tuyến song song đường thẳng $y = ax + b \\Rightarrow k = a$; vuông góc $\\Rightarrow k = -\\frac{1}{a}$.'
    ],
    commonTraps: [
      'Nhầm hoành độ tiếp điểm $x_0$ với hoành độ điểm mà tiếp tuyến đi qua (khi đề nói "kẻ từ điểm $A$", phải giải phương trình tìm $x_0$!).'
    ],
    theory: [
      '1. Định nghĩa: $f\'(x_0) = \\lim_{x \\to x_0} \\frac{f(x) - f(x_0)}{x - x_0}$. Nếu hàm có đạo hàm tại $x_0$ thì liên tục tại $x_0$ (chiều ngược lại không đúng).',
      '2. Ý nghĩa hình học & Tiếp tuyến: Đạo hàm $f\'(x_0)$ là hệ số góc tiếp tuyến của đồ thị $(C)$ tại tiếp điểm $M(x_0; f(x_0))$. Phương trình tiếp tuyến: $y = f\'(x_0)(x - x_0) + f(x_0)$.'
    ],
    keyFormulas: [
      'f\'(x_0) = \\lim_{x \\to x_0} \\frac{f(x) - f(x_0)}{x - x_0}',
      'y = f\'(x_0)(x - x_0) + y_0'
    ],
    flashcards: [
      { front: 'Hệ số góc tiếp tuyến của $y = x^2 - 3x$ tại điểm có hoành độ $x_0 = 2$?', back: '$y\' = 2x - 3 \\Rightarrow k = y\'(2) = 1$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 1',
        question: 'Phương trình tiếp tuyến của đồ thị hàm số $y = x^3 - 2x$ tại điểm $M(1; -1)$ là:',
        options: ['A. $y = x - 2$', 'B. $y = x$', 'C. $y = 3x - 4$', 'D. $y = -x$'],
        correctIndex: 0,
        explanation: '$y\' = 3x^2 - 2 \\Rightarrow k = y\'(1) = 1$. Tiếp tuyến: $y = 1(x - 1) - 1 = x - 2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Tiếp tuyến biết hệ số góc',
        question: 'Viết phương trình tiếp tuyến của đồ thị $(C): y = x^3 - 3x^2 + 2$ biết tiếp tuyến song song với đường thẳng $d: y = 9x + 1$.',
        hints: ['Cho $y\'(x_0) = 9$ giải tìm $x_0$, nhớ loại tiếp tuyến trùng với $d$.'],
        solutionSteps: [
          'Bước 1: $y\' = 3x^2 - 6x$. Do tiếp tuyến $\\parallel d \\Rightarrow 3x_0^2 - 6x_0 = 9 \\iff x_0^2 - 2x_0 - 3 = 0 \\iff x_0 = 3$ hoặc $x_0 = -1$.',
          'Bước 2: Với $x_0 = 3 \\Rightarrow y_0 = 2$: $y = 9(x - 3) + 2 = 9x - 25$.',
          'Bước 3: Với $x_0 = -1 \\Rightarrow y_0 = -2$: $y = 9(x + 1) - 2 = 9x + 7$ (cả hai đều không trùng $d$).'
        ],
        finalAnswer: '$y = 9x - 25$ và $y = 9x + 7$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: 0, c: -2, d: 0 }, color: '#059669', name: 'y = x³ - 2x', showTangent: true, tangentX0: 1 }
  },
  {
    id: 'math-2006-11-14',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 14,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương V: Đạo hàm',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 2–3',
    title: 'Bài 14 (2006): Quy tắc tính Đạo hàm, Hàm hợp & Đạo hàm Lượng giác',
    grade: 'Lớp 11 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description:
      'Đạo hàm tổng, hiệu, tích, thương, công thức đạo hàm hàm hợp $y\'_x = y\'_u \\cdot u\'_x$ và bảng đạo hàm lượng giác $(\\sin u)\', (\\cos u)\', (\\tan u)\', (\\cot u)\'$.',
    mnemonics: [
      'Đạo hàm của $\\cos u$ và $\\cot u$ LUÔN CÓ DẤU TRỪ.',
      'Phân thức bậc nhất: $\\left(\\frac{ax+b}{cx+d}\\right)\' = \\frac{ad - bc}{(cx+d)^2}$.'
    ],
    commonTraps: [
      'Quên nhân thêm $u\'$ khi tính đạo hàm hàm hợp (ví dụ ghi $(\\sin 2x)\' = \\cos 2x$ thiếu nhân $2$).'
    ],
    theory: [
      '1. Quy tắc cơ bản: $(uv)\' = u\'v + uv\'$; $\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}$; $(\\sqrt{u})\' = \\frac{u\'}{2\\sqrt{u}}$; $(u^n)\' = n u^{n-1} u\'$.',
      '2. Đạo hàm lượng giác: $(\\sin u)\' = u\'\\cos u$; $(\\cos u)\' = -u\'\\sin u$; $(\\tan u)\' = \\frac{u\'}{\\cos^2 u}$; $(\\cot u)\' = -\\frac{u\'}{\\sin^2 u}$.'
    ],
    keyFormulas: [
      '\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}, \\quad (\\sqrt{u})\' = \\frac{u\'}{2\\sqrt{u}}',
      '(\\sin u)\' = u\'\\cos u, \\quad (\\cos u)\' = -u\'\\sin u'
    ],
    flashcards: [
      { front: 'Tính đạo hàm của $y = \\cos(3x - 1)$?', back: '$y\' = -3\\sin(3x - 1)$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 3',
        question: 'Đạo hàm của hàm số $y = \\sin 2x + \\frac{1}{x}$ ($x \\neq 0$) là:',
        options: [
          'A. $2\\cos 2x - \\frac{1}{x^2}$',
          'B. $\\cos 2x - \\frac{1}{x^2}$',
          'C. $2\\cos 2x + \\frac{1}{x^2}$',
          'D. $-2\\cos 2x - \\frac{1}{x^2}$'
        ],
        correctIndex: 0,
        explanation: '$(\\sin 2x)\' = 2\\cos 2x$ và $(1/x)\' = -1/x^2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Đạo hàm hàm hợp',
        question: 'Tính đạo hàm của $y = \\sqrt{x^2 + 2x + 3}$ và giải bất phương trình $y\' > 0$.',
        hints: ['Dùng $(\\sqrt{u})\' = \\frac{u\'}{2\\sqrt{u}}$, mẫu số luôn dương với mọi $x$.'],
        solutionSteps: [
          'Bước 1: $x^2 + 2x + 3 = (x+1)^2 + 2 > 0\\ \\forall x \\in \\mathbb{R}$.',
          'Bước 2: $y\' = \\frac{2x + 2}{2\\sqrt{x^2 + 2x + 3}} = \\frac{x + 1}{\\sqrt{x^2 + 2x + 3}}$.',
          'Bước 3: $y\' > 0 \\iff x + 1 > 0 \\iff x > -1$.'
        ],
        finalAnswer: '$y\' = \\frac{x+1}{\\sqrt{x^2+2x+3}}$; $y\' > 0 \\iff x > -1$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'trig_sin', params: { a: 1, b: 2, c: 0, d: 0 }, color: '#0284c7', name: 'y = sin(2x) & Đạo hàm' }
  },
  {
    id: 'math-2006-11-15',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 15,
    stageLabel: 'Toán 11 (2006) · ĐS&GT Chương V: Đạo hàm',
    sourceTag: 'SGK Đại số & Giải tích 11 (2006) · Bài 4–5',
    title: 'Bài 15 (2006): Vi phân & Đạo hàm cấp hai (Ứng dụng Cơ học)',
    grade: 'Lớp 11 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description:
      'Định nghĩa vi phân $df(x) = f\'(x)\\,dx$, tính gần đúng giá trị hàm số và đạo hàm cấp hai $y\'\' = (y\')\'$ ứng dụng tìm vận tốc tức thời $v(t) = s\'(t)$, gia tốc tức thời $a(t) = s\'\'(t)$.',
    mnemonics: [
      'Quãng đường $s(t)$ $\\xrightarrow{\\text{đạo hàm cấp 1}}$ Vận tốc $v(t) = s\'(t)$ $\\xrightarrow{\\text{đạo hàm cấp 2}}$ Gia tốc $a(t) = v\'(t) = s\'\'(t)$.',
      'Vi phân đừng quên nhân thêm $dx$: $dy = y\'\\,dx$.'
    ],
    commonTraps: [
      'Quên viết $dx$ trong biểu thức vi phân $df(x) = f\'(x)\\,dx$.'
    ],
    theory: [
      '1. Vi phân: Vi phân của hàm số $y = f(x)$ là $dy = df(x) = f\'(x)\\,dx$. Công thức tính gần đúng: $f(x_0 + \\Delta x) \\approx f(x_0) + f\'(x_0)\\Delta x$.',
      '2. Đạo hàm cấp hai & Ý nghĩa cơ học: $f\'\'(x) = (f\'(x))\'$. Trong chuyển động có phương trình tọa độ/quãng đường $s(t)$: vận tốc tức thời $v(t) = s\'(t)$ và gia tốc tức thời $a(t) = v\'(t) = s\'\'(t)$.'
    ],
    keyFormulas: [
      'dy = f\'(x)\\,dx, \\quad f\'\'(x) = [f\'(x)]\'',
      'v(t) = s\'(t), \\quad a(t) = v\'(t) = s\'\'(t)'
    ],
    flashcards: [
      { front: 'Một vật chuyển động theo $s(t) = t^3 - 3t^2 + 5t$ (m). Gia tốc lúc $t = 2\\text{ s}$?', back: '$v(t) = 3t^2 - 6t + 5$; $a(t) = 6t - 6 \\Rightarrow a(2) = 6\\text{ m/s}^2$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Giải tích 11 (2006) · Bài 5',
        question: 'Đạo hàm cấp hai của hàm số $y = \\sin 2x$ là:',
        options: ['A. $-4\\sin 2x$', 'B. $4\\sin 2x$', 'C. $-2\\cos 2x$', 'D. $4\\cos 2x$'],
        correctIndex: 0,
        explanation: '$y\' = 2\\cos 2x \\Rightarrow y\'\' = -4\\sin 2x$.'
      }
    ],
    essayProblems: [
      {
        source: 'Giải tích 11 (2006) · Ứng dụng cơ học',
        question: 'Một chất điểm chuyển động có phương trình $s(t) = t^3 - 6t^2 + 9t$ ($t$ tính bằng giây, $s$ bằng mét). Tìm vận tốc nhỏ nhất của chất điểm trong khoảng $t \\in [0; 4]$.',
        hints: ['Tính $v(t) = s\'(t) = 3t^2 - 12t + 9$, tìm đỉnh Parabol bậc hai.'],
        solutionSteps: [
          'Bước 1: $v(t) = s\'(t) = 3t^2 - 12t + 9 = 3(t - 2)^2 - 3$.',
          'Bước 2: Vì $t = 2 \\in [0; 4]$, vận tốc đạt giá trị nhỏ nhất $v_{\\min} = -3\\text{ m/s}$ tại $t = 2\\text{ s}$.'
        ],
        finalAnswer: '$v_{\\min} = -3\\text{ m/s}$ tại $t = 2\\text{ s}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: -6, c: 9, d: 0 }, color: '#0d9488', name: 's(t) = t³ - 6t² + 9t' }
  },
  // ==================== HÌNH HỌC 11 · CHƯƠNG I: PHÉP DỜI HÌNH VÀ PHÉP ĐỒNG DẠNG (ĐẶC TRƯNG 2006) ====================
  {
    id: 'math-2006-11-16',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 16,
    stageLabel: 'Toán 11 (2006) · HH Chương I: Phép dời hình & Phép đồng dạng (2006)',
    sourceTag: 'SGK Hình học 11 (2006) · Bài 1–5',
    title: 'Bài 16 (2006): Phép tịnh tiến, Phép đối xứng trục – tâm & Phép quay',
    grade: 'Lớp 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Chuyên đề đặc trưng của GDPT 2006: biểu thức tọa độ của phép tịnh tiến $T_{\\vec{v}}$, đối xứng trục ($Ox, Oy$), đối xứng tâm $I$, phép quay tâm $O$ góc $90^\\circ, -90^\\circ$ và tính chất bảo toàn khoảng cách.',
    mnemonics: [
      'Phép tịnh tiến $T_{\\vec{v}}$: $M\' = M + \\vec{v}$ ($x\' = x + a,\\ y\' = y + b$).',
      'Quay $Q_{(O, 90^\\circ)}$ biến $(x; y) \\to (-y; x)$; quay $Q_{(O, -90^\\circ)}$ biến $(x; y) \\to (y; -x)$.'
    ],
    commonTraps: [
      'Nhầm dấu tọa độ khi quay $90^\\circ$ và $-90^\\circ$ (nên kiểm tra nhanh bằng điểm $(1; 0)$ quay $90^\\circ$ thành $(0; 1)$!).'
    ],
    theory: [
      '1. Phép dời hình: Là phép biến hình bảo toàn khoảng cách giữa hai điểm bất kì. Gồm: phép tịnh tiến $T_{\\vec{v}}$, phép đối xứng trục $Đ_d$, phép đối xứng tâm $Đ_I$, phép quay $Q_{(O, \\varphi)}$.',
      '2. Biểu thức tọa độ: $T_{\\vec{v}=(a;b)}(M(x;y)) = (x+a; y+b)$. $Đ_I(M) = M\'$ với $x\' = 2x_I - x,\\ y\' = 2y_I - y$. Phép dời hình biến đường thẳng thành đường thẳng song song hoặc trùng (với $T_{\\vec{v}}, Đ_I$), biến đường tròn bán kính $R$ thành đường tròn cùng bán kính $R$.'
    ],
    keyFormulas: [
      'T_{\\vec{v}(a;b)}: \\begin{cases} x\' = x + a \\\\ y\' = y + b \\end{cases}, \\quad Đ_I: \\begin{cases} x\' = 2x_I - x \\\\ y\' = 2y_I - y \\end{cases}',
      'Q_{(O, 90^\\circ)}(x; y) = (-y; x)'
    ],
    flashcards: [
      { front: 'Phép tịnh tiến theo $\\vec{v} = (2; -3)$ biến $A(1; 4)$ thành điểm nào?', back: '$A\'(1 + 2; 4 - 3) = (3; 1)$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 11 (2006) · HH Chương I',
        question: 'Trong mặt phẳng $Oxy$, ảnh của điểm $M(3; -2)$ qua phép quay tâm $O$ góc $90^\\circ$ là:',
        options: ['A. $(2; 3)$', 'B. $(-2; -3)$', 'C. $(-3; 2)$', 'D. $(3; 2)$'],
        correctIndex: 0,
        explanation: '$Q_{(O, 90^\\circ)}(x; y) = (-y; x) = (-(-2); 3) = (2; 3)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 11 (2006) · Ảnh của đường thẳng qua Tịnh tiến',
        question: 'Tìm phương trình ảnh $d\'$ của đường thẳng $d: 2x - y + 3 = 0$ qua phép tịnh tiến theo $\\vec{v} = (1; -2)$.',
        hints: ['Thay $x = x\' - 1$ và $y = y\' + 2$ vào phương trình $d$.'],
        solutionSteps: [
          'Bước 1: Từ $\\begin{cases} x\' = x + 1 \\\\ y\' = y - 2 \\end{cases} \\Rightarrow \\begin{cases} x = x\' - 1 \\\\ y = y\' + 2 \\end{cases}$.',
          'Bước 2: Thế vào $d$: $2(x\' - 1) - (y\' + 2) + 3 = 0 \\iff 2x\' - y\' - 1 = 0$.'
        ],
        finalAnswer: '$d\': 2x - y - 1 = 0$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  },
  {
    id: 'math-2006-11-17',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 17,
    stageLabel: 'Toán 11 (2006) · HH Chương I: Phép dời hình & Phép đồng dạng (2006)',
    sourceTag: 'SGK Hình học 11 (2006) · Bài 6–8',
    title: 'Bài 17 (2006): Phép vị tự V(I, k) & Phép đồng dạng',
    grade: 'Lớp 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description:
      'Định nghĩa phép vị tự tâm $I$ tỉ số $k$ ($\\vec{IM\'} = k\\vec{IM}$), ảnh của đường tròn bán kính $R$ có bán kính $R\' = |k|R$ và định nghĩa phép đồng dạng tỉ số $k$.',
    mnemonics: [
      'Phép vị tự tỉ số $k$ biến đoạn $AB$ thành $A\'B\' = |k|\\cdot AB$ (đừng quên dấu trị tuyệt đối $|k|$ khi $k < 0$!).',
      'Khi $I = O(0;0)$: $V_{(O, k)}(x; y) = (kx; ky)$.'
    ],
    commonTraps: [
      'Quên lấy $|k|$ khi tính bán kính đường tròn ảnh $R\' = |k|R$ với $k < 0$.'
    ],
    theory: [
      '1. Phép vị tự $V_{(I, k)}$ ($k \\neq 0$): Biến mỗi điểm $M$ thành $M\'$ sao cho $\\vec{IM\'} = k\\vec{IM}$. Phép vị tự biến đường tròn $(O; R)$ thành đường tròn $(O\'; |k|R)$ với $O\' = V_{(I, k)}(O)$.',
      '2. Phép đồng dạng tỉ số $k > 0$: Biến hai điểm $M, N$ thành $M\', N\'$ sao cho $M\'N\' = k\\cdot MN$. Mọi phép đồng dạng tỉ số $k$ đều là hợp thành của một phép vị tự và một phép dời hình.'
    ],
    keyFormulas: [
      '\\vec{IM\'} = k\\vec{IM} \\implies M\'N\' = |k|MN',
      'R\' = |k|R'
    ],
    flashcards: [
      { front: 'Phép vị tự tâm $O$ tỉ số $k = -2$ biến đường tròn tâm $A(1; -2)$ bán kính $R = 3$ thành đường tròn nào?', back: 'Tâm $A\'(-2; 4)$, bán kính $R\' = |-2|\\cdot 3 = 6$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 11 (2006) · Bài 7',
        question: 'Trong mặt phẳng $Oxy$, cho đường tròn $(C): (x - 1)^2 + (y + 2)^2 = 9$. Ảnh của $(C)$ qua phép vị tự tâm $O$ tỉ số $k = 2$ có bán kính bằng:',
        options: ['A. $6$', 'B. $3$', 'C. $18$', 'D. $9$'],
        correctIndex: 0,
        explanation: 'Bán kính ban đầu $R = 3 \\Rightarrow R\' = |2|\\cdot 3 = 6$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 11 (2006) · Viết phương trình đường tròn ảnh',
        question: 'Tìm phương trình ảnh $(C\')$ của $(C): (x - 2)^2 + (y + 1)^2 = 4$ qua phép vị tự tâm $I(1; 1)$ tỉ số $k = -2$.',
        hints: ['Tìm ảnh tâm $A(2; -1)$ qua $V_{(I, -2)}$ theo $\\vec{IA\'} = -2\\vec{IA}$ và tính $R\' = |-2|R$.'],
        solutionSteps: [
          'Bước 1: Tâm $A(2; -1)$, bán kính $R = 2$. Ta có $\\vec{IA} = (1; -2) \\Rightarrow \\vec{IA\'} = (-2; 4) \\Rightarrow A\'(-1; 5)$.',
          'Bước 2: Bán kính ảnh $R\' = |-2|\\cdot 2 = 4$. Vậy $(C\'): (x + 1)^2 + (y - 5)^2 = 16$.'
        ],
        finalAnswer: '$(C\'): (x + 1)^2 + (y - 5)^2 = 16$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  },
  // ==================== HÌNH HỌC 11 · CHƯƠNG II: QUAN HỆ SONG SONG TRONG KHÔNG GIAN ====================
  {
    id: 'math-2006-11-18',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 18,
    stageLabel: 'Toán 11 (2006) · HH Chương II: Đường thẳng & Mặt phẳng Song song',
    sourceTag: 'SGK Hình học 11 (2006) · Bài 1',
    title: 'Bài 18 (2006): Đại cương Đường thẳng – Mặt phẳng, Giao tuyến & Thiết diện',
    grade: 'Lớp 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description:
      'Các tiên đề hình học không gian, tìm giao tuyến của hai mặt phẳng (2 điểm chung), tìm giao điểm của đường thẳng và mặt phẳng, và dựng thiết diện của hình chóp.',
    mnemonics: [
      'Tìm giao tuyến $(P) \\cap (Q)$: tìm **2 điểm chung phân biệt** của $(P)$ và $(Q)$.',
      'Tìm giao điểm $d \\cap (P)$: chọn mặt phẳng phụ $(Q) \\supset d$, tìm giao tuyến $\\Delta = (Q) \\cap (P)$, giao điểm cần tìm là $d \\cap \\Delta$.'
    ],
    commonTraps: [
      'Cho hai đường thẳng không cùng nằm trong một mặt phẳng cắt nhau trên hình vẽ không gian!'
    ],
    theory: [
      '1. Giao tuyến & Giao điểm: Hai mặt phẳng phân biệt có một điểm chung thì chúng cắt nhau theo một đường thẳng đi qua điểm chung ấy (giao tuyến). Muốn tìm giao điểm của đường $d$ và mặt $(P)$, đưa về tìm giao điểm của $d$ với một đường nằm trong $(P)$ đồng phẳng với $d$.',
      '2. Thiết diện: Là đa giác phẳng tạo bởi các đoạn giao tuyến của mặt phẳng cắt với các mặt của khối chóp / lăng trụ.'
    ],
    keyFormulas: [
      'M, N \\in (P) \\cap (Q) \\implies (P) \\cap (Q) = MN',
      '\\text{Đồng phẳng: } a, b \\subset (\\alpha) \\text{ không song song} \\implies a \\cap b \\neq \\varnothing'
    ],
    flashcards: [
      { front: 'Cho tứ diện $ABCD$. Có bao nhiêu mặt phẳng đi qua 3 đỉnh bất kì?', back: '$4$ mặt phẳng (chính là 4 mặt của tứ diện).' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 11 (2006) · Bài 1',
        question: 'Trong các mệnh đề sau, mệnh đề nào SAI?',
        options: [
          'A. Hai đường thẳng không có điểm chung thì song song với nhau',
          'B. Ba điểm không thẳng hàng xác định duy nhất một mặt phẳng',
          'C. Hai mặt phẳng phân biệt có hai điểm chung thì giao tuyến là đường nối 2 điểm đó',
          'D. Một đường thẳng và một điểm ngoài nó xác định một mặt phẳng'
        ],
        correctIndex: 0,
        explanation: 'Trong không gian, hai đường thẳng không có điểm chung có thể SONG SONG hoặc CHÉO NHAU!'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 11 (2006) · Giao tuyến hình chóp',
        question: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là tứ giác lồi có hai cạnh đối $AB, CD$ cắt nhau tại $E$. Tìm giao tuyến của $(SAB)$ và $(SCD)$.',
        hints: ['Tìm hai điểm chung $S$ và $E$.'],
        solutionSteps: [
          'Bước 1: $S$ là điểm chung thứ nhất của $(SAB)$ và $(SCD)$.',
          'Bước 2: Trong mặt phẳng $(ABCD)$, $E = AB \\cap CD \\Rightarrow E \\in AB \\subset (SAB)$ và $E \\in CD \\subset (SCD)$. Vậy giao tuyến là đường thẳng $SE$.'
        ],
        finalAnswer: '$(SAB) \\cap (SCD) = SE$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  {
    id: 'math-2006-11-19',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 19,
    stageLabel: 'Toán 11 (2006) · HH Chương II: Đường thẳng & Mặt phẳng Song song',
    sourceTag: 'SGK Hình học 11 (2006) · Bài 2–4',
    title: 'Bài 19 (2006): Quan hệ Song song (Đường – Đường, Đường – Mặt, Mặt – Mặt)',
    grade: 'Lớp 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description:
      'Hai đường thẳng chéo nhau và song song, định lí giao tuyến 3 mặt phẳng, dấu hiệu $d \\parallel (P)$, $(P) \\parallel (Q)$ và định lí Ta-lét trong không gian.',
    mnemonics: [
      '$d \\parallel (P)$ khi $d \\not\\subset (P)$ và $d$ song song với một đường thẳng $a \\subset (P)$.',
      '$(P) \\parallel (Q)$ khi $(P)$ chứa HAI ĐƯỜNG CẮT NHAU cùng song song với $(Q)$.'
    ],
    commonTraps: [
      'Kết luận $(P) \\parallel (Q)$ khi $(P)$ chỉ chứa hai đường thẳng song song với nhau (chúng phải CẮT NHAU!).'
    ],
    theory: [
      '1. Đường thẳng song song mặt phẳng: Nếu $d \\not\\subset (P)$ và $d \\parallel a \\subset (P)$ thì $d \\parallel (P)$. Nếu $d \\parallel (P)$ và mặt phẳng $(Q)$ chứa $d$ cắt $(P)$ theo giao tuyến $\\Delta$ thì $d \\parallel \\Delta$.',
      '2. Hai mặt phẳng song song: Nếu $(P)$ chứa hai đường cắt nhau $a, b$ cùng song song với $(Q)$ thì $(P) \\parallel (Q)$. Mặt phẳng thứ ba cắt $(P), (Q)$ theo hai giao tuyến song song với nhau.'
    ],
    keyFormulas: [
      'd \\not\\subset (P),\\ d \\parallel a \\subset (P) \\implies d \\parallel (P)',
      'a, b \\subset (P),\\ a \\cap b = I,\\ a \\parallel (Q),\\ b \\parallel (Q) \\implies (P) \\parallel (Q)'
    ],
    flashcards: [
      { front: 'Cho hình chóp $S.ABCD$ đáy hình bình hành $ABCD$. Đường thẳng $AB$ song song với mặt phẳng nào?', back: 'Vì $AB \\parallel CD \\subset (SCD)$ nên $AB \\parallel (SCD)$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 11 (2006) · Bài 3',
        question: 'Cho tứ diện $ABCD$. Gọi $M, N$ lần lượt là trung điểm $AB, AC$. Khẳng định nào sau đây ĐÚNG?',
        options: [
          'A. $MN \\parallel (BCD)$',
          'B. $MN$ cắt $(BCD)$',
          'C. $MN \\subset (BCD)$',
          'D. $MN \\perp (BCD)$'
        ],
        correctIndex: 0,
        explanation: '$MN$ là đường trung bình $\\triangle ABC \\Rightarrow MN \\parallel BC \\subset (BCD) \\Rightarrow MN \\parallel (BCD)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 11 (2006) · Chứng minh hai mặt phẳng song song',
        question: 'Cho hình chóp $S.ABCD$ đáy là hình bình hành tâm $O$. Gọi $M, N$ lần lượt là trung điểm $SA, SD$. Chứng minh $(OMN) \\parallel (SBC)$.',
        hints: ['Chứng minh $MN \\parallel BC$ và $OM \\parallel SC$ (hoặc $ON \\parallel SB$).'],
        solutionSteps: [
          'Bước 1: $MN$ là đường trung bình $\\triangle SAD \\Rightarrow MN \\parallel AD \\parallel BC \\Rightarrow MN \\parallel (SBC)$.',
          'Bước 2: $OM$ là đường trung bình $\\triangle SAC \\Rightarrow OM \\parallel SC \\Rightarrow OM \\parallel (SBC)$.',
          'Bước 3: Trong $(OMN)$, $MN$ và $OM$ cắt nhau tại $M$ và cùng song song $(SBC) \\Rightarrow (OMN) \\parallel (SBC)$.'
        ],
        finalAnswer: '$(OMN) \\parallel (SBC)$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'line_plane_oxyz'
  },
  {
    id: 'math-2006-11-20',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 20,
    stageLabel: 'Toán 11 (2006) · HH Chương II: Đường thẳng & Mặt phẳng Song song',
    sourceTag: 'SGK Hình học 11 (2006) · Bài 5',
    title: 'Bài 20 (2006): Phép chiếu song song & Hình biểu diễn trong không gian',
    grade: 'Lớp 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Tính chất của phép chiếu song song (bảo toàn tính thẳng hàng, thứ tự điểm, tỉ số độ dài các đoạn thẳng cùng phương) và quy tắc vẽ hình biểu diễn khối chóp, lăng trụ, hình cầu.',
    mnemonics: [
      'Phép chiếu song song biến hai đường thẳng song song thành song song hoặc trùng; bảo toàn tỉ số $\\frac{A\'B\'}{C\'D\'} = \\frac{AB}{CD}$ trên hai đường thẳng song song/trùng nhau.'
    ],
    commonTraps: [
      'Cho rằng phép chiếu song song bảo toàn độ dài và số đo góc (SAI! Hình vuông có thể chiếu thành hình bình hành, đường tròn thành Elip).'
    ],
    theory: [
      '1. Định nghĩa: Cho mặt phẳng $(\\alpha)$ và đường thẳng $\\Delta$ cắt $(\\alpha)$. Đường thẳng qua $M$ song song (hoặc trùng) $\\Delta$ cắt $(\\alpha)$ tại $M\'$ gọi là hình chiếu song song của $M$ trên $(\\alpha)$ theo phương $\\Delta$.',
      '2. Hình biểu diễn: Hình bình hành, hình chữ nhật, hình vuông, hình thoi đều có hình biểu diễn là một hình bình hành. Đường tròn có hình biểu diễn là đường Elip.'
    ],
    keyFormulas: [
      '\\frac{A\'B\'}{C\'D\'} = \\frac{AB}{CD} \\quad (AB \\parallel CD \\text{ hoặc thẳng hàng})'
    ],
    flashcards: [
      { front: 'Hình biểu diễn của một đường tròn qua phép chiếu song song là hình gì?', back: 'Đường Elip (hoặc đường tròn nếu mặt phẳng song song mặt chiếu, đoạn thẳng nếu cùng phương chiếu).' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 11 (2006) · Bài 5',
        question: 'Qua phép chiếu song song (các đường không song song với phương chiếu), tính chất nào sau đây KHÔNG được bảo toàn?',
        options: [
          'A. Độ lớn góc giữa hai đường thẳng',
          'B. Tính thẳng hàng của 3 điểm',
          'C. Quan hệ song song giữa hai đường thẳng',
          'D. Tỉ số độ dài hai đoạn thẳng nằm trên hai đường song song'
        ],
        correctIndex: 0,
        explanation: 'Phép chiếu song song không bảo toàn độ dài đoạn thẳng và góc.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 11 (2006) · Thiết diện song song',
        question: 'Cho hình chóp $S.ABCD$ đáy hình bình hành tâm $O$. Gọi $M$ là trung điểm $SC$. Dựng thiết diện qua $M$ và song song với $(SAD)$.',
        hints: ['Từ $M$ kẻ các đường thẳng song song với $AD$ (tức $BC$) và $SD$ (hoặc $SA$).'],
        solutionSteps: [
          'Bước 1: Mặt phẳng $(\\alpha) \\parallel (SAD)$ cắt $(SBC)$ theo giao tuyến qua $M$ song song $BC$, cắt $SB$ tại trung điểm $N$.',
          'Bước 2: $(\\alpha)$ cắt $(ABCD)$ và $(SCD)$ tương ứng theo giao tuyến qua $N, M$ cắt $AB$ tại $P$, $CD$ tại $Q$ với $NP \\parallel SA$ và $MQ \\parallel SD$. Thiết diện là hình thang $MNPQ$.'
        ],
        finalAnswer: 'Thiết diện là hình thang $MNPQ$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  // ==================== HÌNH HỌC 11 · CHƯƠNG III: VECTƠ KHÔNG GIAN & QUAN HỆ VUÔNG GÓC ====================
  {
    id: 'math-2006-11-21',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 21,
    stageLabel: 'Toán 11 (2006) · HH Chương III: Vectơ & Quan hệ Vuông góc',
    sourceTag: 'SGK Hình học 11 (2006) · Bài 1–3',
    title: 'Bài 21 (2006): Vectơ trong không gian, Đường vuông góc đường & Đường vuông góc mặt',
    grade: 'Lớp 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 20,
    description:
      'Quy tắc hình hộp $\\vec{AB} + \\vec{AD} + \\vec{AA\'} = \\vec{AC\'}$, điều kiện ba vectơ đồng phẳng, chứng minh $d \\perp (P)$ (vuông góc 2 đường cắt nhau) và định lí ba đường vuông góc.',
    mnemonics: [
      'Muốn chứng minh $a \\perp b$, thông thường hãy chứng minh $a$ vuông góc với một mặt phẳng $(P)$ chứa $b$!',
      'Định lí ba đường vuông góc: $a \\subset (P)$, $b\'$ là hình chiếu của $b$ lên $(P)$ $\\Rightarrow a \\perp b \\iff a \\perp b\'$.'
    ],
    commonTraps: [
      'Quên kiểm tra hai đường thẳng nằm trong $(P)$ phải CẮT NHAU trước khi kết luận $d \\perp (P)$.'
    ],
    theory: [
      '1. Vectơ không gian: Ba vectơ $\\vec{a}, \\vec{b}, \\vec{c}$ đồng phẳng $\\iff \\vec{c} = m\\vec{a} + n\\vec{b}$. Quy tắc hình hộp: $\\vec{AB} + \\vec{AD} + \\vec{AA\'} = \\vec{AC\'}$.',
      '2. Đường thẳng vuông góc mặt phẳng: $d \\perp (P) \\iff d \\perp a$ và $d \\perp b$ với $a, b \\subset (P), a \\cap b = I$. Khi $d \\perp (P)$ thì $d$ vuông góc với MỌI đường thẳng nằm trong $(P)$.'
    ],
    keyFormulas: [
      'd \\perp a,\\ d \\perp b,\\ a \\cap b \\subset (P) \\implies d \\perp (P)',
      'a \\subset (P):\\ a \\perp b \\iff a \\perp \\text{hình chiếu}(b)'
    ],
    flashcards: [
      { front: 'Cho hình chóp $S.ABC$ có $SA \\perp (ABC)$ và $\\triangle ABC$ vuông tại $B$. Chứng minh $BC \\perp SB$?', back: '$BC \\perp AB$ và $BC \\perp SA \\Rightarrow BC \\perp (SAB) \\Rightarrow BC \\perp SB$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 11 (2006) · Bài 3',
        question: 'Cho hình chóp $S.ABCD$ đáy hình vuông $ABCD$, $SA \\perp (ABCD)$. Đường thẳng $BD$ vuông góc với mặt phẳng nào?',
        options: ['A. $(SAC)$', 'B. $(SAB)$', 'C. $(SAD)$', 'D. $(SBC)$'],
        correctIndex: 0,
        explanation: 'Vì $BD \\perp AC$ (hai đường chéo hình vuông) và $BD \\perp SA \\Rightarrow BD \\perp (SAC)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 11 (2006) · Chứng minh vuông góc',
        question: 'Cho hình chóp $S.ABCD$ đáy hình vuông $ABCD$, $SA \\perp (ABCD)$. Gọi $H$ là hình chiếu của $A$ lên $SB$. Chứng minh $AH \\perp (SBC)$ và $AH \\perp SC$.',
        hints: ['Chứng minh $BC \\perp (SAB) \\Rightarrow BC \\perp AH$.'],
        solutionSteps: [
          'Bước 1: $BC \\perp AB$ và $BC \\perp SA \\Rightarrow BC \\perp (SAB) \\Rightarrow BC \\perp AH$.',
          'Bước 2: Lại có $AH \\perp SB$ tại $H$, $SB \\cap BC = B$ trong $(SBC) \\Rightarrow AH \\perp (SBC)$.',
          'Bước 3: Vì $SC \\subset (SBC) \\Rightarrow AH \\perp SC$.'
        ],
        finalAnswer: '$AH \\perp (SBC)$ và $AH \\perp SC$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  {
    id: 'math-2006-11-22',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 11',
    lessonNumber: 22,
    stageLabel: 'Toán 11 (2006) · HH Chương III: Vectơ & Quan hệ Vuông góc',
    sourceTag: 'SGK Hình học 11 (2006) · Bài 4–5',
    title: 'Bài 22 (2006): Hai mặt phẳng vuông góc, Góc & Khoảng cách trong không gian',
    grade: 'Lớp 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 22,
    description:
      'Điều kiện $(P) \\perp (Q)$, xác định góc giữa đường và mặt, góc giữa hai mặt phẳng và phương pháp tính khoảng cách từ điểm đến mặt phẳng, khoảng cách hai đường thẳng chéo nhau.',
    mnemonics: [
      'Góc giữa đường $d$ và mặt $(P)$: Tìm giao điểm $I = d \\cap (P)$ và hình chiếu $H$ của $A \\in d$ lên $(P)$ $\\to$ góc $\\widehat{AIH}$.',
      'Khoảng cách điểm-mặt chuẩn (chân đường cao $A$): Kẻ 2 nét từ $A$: (1) $AH \\perp$ cạnh đáy $BC$, (2) $AK \\perp SH \\Rightarrow d(A, (SBC)) = AK$.'
    ],
    commonTraps: [
      'Lấy sai góc giữa hai mặt phẳng bằng cách nối hai điểm bất kì trên hai mặt không vuông góc giao tuyến.'
    ],
    theory: [
      '1. Hai mặt phẳng vuông góc: $(P) \\perp (Q) \\iff (P)$ chứa một đường thẳng vuông góc với $(Q)$. Nếu $(P) \\perp (Q)$ và đường thẳng $a \\subset (P)$ vuông góc với giao tuyến thì $a \\perp (Q)$.',
      '2. Góc & Khoảng cách: Góc giữa hai mặt phẳng cắt nhau bằng góc giữa hai đường thẳng lần lượt nằm trong hai mặt và cùng vuông góc giao tuyến tại một điểm. Khoảng cách giữa hai đường chéo nhau $a, b$ bằng $d(a, (P))$ với $(P) \\supset b$ và $(P) \\parallel a$.'
    ],
    keyFormulas: [
      '\\frac{1}{AK^2} = \\frac{1}{SA^2} + \\frac{1}{AH^2} \\quad (SA \\perp \\text{đáy},\\ AH \\perp BC)',
      'd(M, (P)) = \\frac{MH}{NH} \\cdot d(N, (P)) \\quad (\\text{khi } MN \\cap (P) = H)'
    ],
    flashcards: [
      { front: 'Hình chóp đều $S.ABCD$ cạnh đáy $a$, cạnh bên $a$. Góc giữa cạnh bên $SA$ và mặt đáy $(ABCD)$?', back: 'Tâm đáy $O$, $AO = \\frac{a\\sqrt{2}}{2} \\Rightarrow \\cos\\widehat{SAO} = \\frac{AO}{SA} = \\frac{\\sqrt{2}}{2} \\Rightarrow 45^\\circ$.' }
    ],
    sampleProblems: [
      {
        source: 'SGK Hình học 11 (2006) · Bài 5',
        question: 'Cho hình chóp $S.ABCD$ đáy hình vuông cạnh $a$, $SA \\perp (ABCD)$ và $SA = a$. Khoảng cách từ $A$ đến mặt phẳng $(SBC)$ bằng:',
        options: ['A. $\\frac{a\\sqrt{2}}{2}$', 'B. $a$', 'C. $\\frac{a\\sqrt{3}}{3}$', 'D. $\\frac{a}{2}$'],
        correctIndex: 0,
        explanation: 'Vì $BC \\perp (SAB)$ nên $AK \\perp SB$ thỏa $AK \\perp (SBC)$. Tam giác $SAB$ vuông cân cạnh $a \\Rightarrow AK = \\frac{a\\sqrt{2}}{2}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Hình học 11 (2006) · Góc hai mặt phẳng & Khoảng cách',
        question: 'Cho hình chóp $S.ABC$ có $SA \\perp (ABC)$, $SA = a\\sqrt{3}$, đáy $ABC$ đều cạnh $a$. Tính góc giữa $(SBC)$ và $(ABC)$, và khoảng cách $d(A, (SBC))$.',
        hints: ['Gọi $M$ là trung điểm $BC$, chứng minh $BC \\perp (SAM)$ để xác định góc $\\widehat{SMA}$ và dựng đường cao $AK \\perp SM$.'],
        solutionSteps: [
          'Bước 1: $M$ là trung điểm $BC \\Rightarrow AM \\perp BC$ và $AM = \\frac{a\\sqrt{3}}{2}$. Lại có $SA \\perp BC \\Rightarrow BC \\perp (SAM) \\Rightarrow SM \\perp BC$. Vậy góc giữa $(SBC)$ và $(ABC)$ là $\\widehat{SMA}$.',
          'Bước 2: $\\tan\\widehat{SMA} = \\frac{SA}{AM} = \\frac{a\\sqrt{3}}{a\\sqrt{3}/2} = 2 \\Rightarrow \\widehat{SMA} = \\arctan 2$.',
          'Bước 3: Kẻ $AK \\perp SM \\Rightarrow AK \\perp (SBC) \\Rightarrow d(A, (SBC)) = AK = \\frac{SA \\cdot AM}{\\sqrt{SA^2 + AM^2}} = \\frac{a\\sqrt{3}\\cdot\\frac{a\\sqrt{3}}{2}}{\\sqrt{3a^2 + \\frac{3}{4}a^2}} = \\frac{a\\sqrt{15}}{5}$.'
        ],
        finalAnswer: 'Góc $= \\arctan 2$; $d(A, (SBC)) = \\frac{a\\sqrt{15}}{5}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  }
];
