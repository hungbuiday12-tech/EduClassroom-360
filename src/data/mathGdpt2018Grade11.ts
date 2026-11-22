import { MathLecture } from '../types';

// Chương trình Toán 11 GDPT 2018 (Thông tư 32/2018/TT-BGDĐT · SGK Kết nối tri thức với cuộc sống)
// Đầy đủ 33 bài thuộc 9 chương (Chương I -> Chương IX, bao gồm Mũ - Lôgarit & Thể tích chuyển xuống 11)

export const MATH_GDPT_11_LESSONS: MathLecture[] = [
  // ==================== CHƯƠNG I. HÀM SỐ LƯỢNG GIÁC & PHƯƠNG TRÌNH LƯỢNG GIÁC ====================
  {
    id: 'math-11-b1',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 1,
    stageLabel: 'Chương I · Hàm Số Lượng Giác & PT Lượng Giác',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 1',
    title: 'Bài 1: Giá trị lượng giác của góc lượng giác',
    grade: 'Lớp 11 · Lượng giác',
    category: 'Lượng giác & Mũ',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description:
      'Góc lượng giác (radian và độ), đường tròn lượng giác tâm $O(0;0)$, dấu các giá trị lượng giác trên 4 góc phần tư và cung liên kết (đối, bù, phụ, hơn kém $\\pi$).',
    mnemonics: [
      'Thần chú cung liên kết: "Cos đối – Sin bù – Phụ chéo – Khác pi Tan, Cot".',
      'Đổi độ sang radian: $\\alpha_{\\text{rad}} = \\alpha^\\circ \\cdot \\frac{\\pi}{180}$.'
    ],
    commonTraps: ['Nhầm dấu $\\sin, \\cos$ ở các góc phần tư II, III, IV.'],
    theory: [
      '1. Đơn vị radian: $180^\\circ = \\pi\\text{ rad}$; độ dài cung $l = R\\alpha$.',
      '2. Hệ thức cơ bản & Cung liên kết: $\\sin^2\\alpha + \\cos^2\\alpha = 1$; cos đối, sin bù, phụ chéo, hơn kém $\\pi$ giữ tan/cot.'
    ],
    keyFormulas: [
      '\\sin^2\\alpha + \\cos^2\\alpha = 1,\\quad 1+\\tan^2\\alpha = \\frac{1}{\\cos^2\\alpha}',
      '\\cos(-\\alpha) = \\cos\\alpha,\\quad \\sin(\\pi-\\alpha) = \\sin\\alpha,\\quad \\sin\\left(\\frac{\\pi}{2}-\\alpha\\right) = \\cos\\alpha'
    ],
    flashcards: [{ front: 'Rút gọn $\\sin(\\pi + \\alpha) + \\cos(\\frac{\\pi}{2} - \\alpha)$?', back: '$-\\sin\\alpha + \\sin\\alpha = 0$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 1',
        question: 'Với $\\frac{\\pi}{2} < \\alpha < \\pi$ và $\\sin\\alpha = \\frac{5}{13}$, giá trị $\\cos\\alpha$ là:',
        options: ['A. $-\\frac{12}{13}$', 'B. $\\frac{12}{13}$', 'C. $-\\frac{5}{12}$', 'D. $\\frac{8}{13}$'],
        correctIndex: 0,
        explanation: 'Góc phần tư II có $\\cos\\alpha < 0$, tính ra $-12/13$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Cung liên kết',
        question: 'Tính $\\tan\\alpha$ và $\\sin 2\\alpha$ biết $\\cos\\alpha = -\\frac{3}{5}$ và $\\pi < \\alpha < \\frac{3\\pi}{2}$.',
        hints: ['Góc phần tư III có $\\sin\\alpha < 0$.'],
        solutionSteps: ['Bước 1: $\\sin\\alpha = -\\frac{4}{5}$, suy ra $\\tan\\alpha = \\frac{4}{3}$ và $\\sin 2\\alpha = 2(-\\frac{4}{5})(-\\frac{3}{5}) = \\frac{24}{25}$.'],
        finalAnswer: '$\\tan\\alpha = \\frac{4}{3}$; $\\sin 2\\alpha = \\frac{24}{25}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'circle_theorems_3d',
    defaultGraphConfig: { type: 'trig_sin', params: { a: 1, b: 1, c: 0, d: 0 }, color: '#ec4899', name: 'y = sin(x)' }
  },
  {
    id: 'math-11-5',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 2,
    stageLabel: 'Chương I · Hàm Số Lượng Giác & PT Lượng Giác',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 2',
    title: 'Bài 2: Công thức lượng giác',
    grade: 'Lớp 11 · Lượng giác',
    category: 'Lượng giác & Mũ',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Công thức cộng, công thức nhân đôi, công thức hạ bậc, biến đổi tích thành tổng và tổng thành tích.',
    mnemonics: ['"Sin thì sin cos cos sin; Cos thì cos cos sin sin dấu trừ".'],
    commonTraps: ['Nhầm dấu công thức $\\cos(a+b) = \\cos a\\cos b - \\sin a\\sin b$.'],
    theory: [
      '1. Công thức cộng & Nhân đôi: $\\sin 2a = 2\\sin a\\cos a$; $\\cos 2a = \\cos^2 a - \\sin^2 a = 2\\cos^2 a - 1 = 1 - 2\\sin^2 a$.',
      '2. Hạ bậc & Tổng-tích: $\\cos^2 a = \\frac{1+\\cos 2a}{2}$, $\\sin^2 a = \\frac{1-\\cos 2a}{2}$.'
    ],
    keyFormulas: [
      '\\sin(a\\pm b) = \\sin a\\cos b \\pm \\cos a\\sin b',
      '\\cos 2a = 2\\cos^2 a - 1 = 1 - 2\\sin^2 a',
      '\\cos a + \\cos b = 2\\cos\\frac{a+b}{2}\\cos\\frac{a-b}{2}'
    ],
    flashcards: [{ front: 'Hạ bậc $\\sin^2 x$ và $\\cos^2 x$?', back: '$\\frac{1-\\cos 2x}{2}$ và $\\frac{1+\\cos 2x}{2}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 2',
        question: 'Khẳng định nào sau đây SAI?',
        options: ['A. $\\cos 2a = 1 - 2\\cos^2 a$', 'B. $\\sin 2a = 2\\sin a\\cos a$', 'C. $\\cos 2a = 2\\cos^2 a - 1$', 'D. $\\cos 2a = 1 - 2\\sin^2 a$'],
        correctIndex: 0,
        explanation: 'Đúng phải là $2\\cos^2 a - 1$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Rút gọn lượng giác',
        question: 'Tính chính xác $\\cos 15^\\circ$ không dùng máy tính.',
        hints: ['Viết $15^\\circ = 45^\\circ - 30^\\circ$.'],
        solutionSteps: ['Bước 1: $\\cos(45^\\circ - 30^\\circ) = \\cos 45^\\circ\\cos 30^\\circ + \\sin 45^\\circ\\sin 30^\\circ = \\frac{\\sqrt{6}+\\sqrt{2}}{4}$.'],
        finalAnswer: '$\\frac{\\sqrt{6}+\\sqrt{2}}{4}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'circle_theorems_3d',
    defaultGraphConfig: { type: 'trig_cos', params: { a: 1, b: 2, c: 0, d: 0 }, color: '#0284c7', name: 'y = cos(2x)' }
  },
  {
    id: 'math-11-b3',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 3,
    stageLabel: 'Chương I · Hàm Số Lượng Giác & PT Lượng Giác',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 3',
    title: 'Bài 3: Hàm số lượng giác',
    grade: 'Lớp 11 · Lượng giác',
    category: 'Lượng giác & Mũ',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description:
      'Tập xác định, tập giá trị $[-1; 1]$, tính chẵn – lẻ, tính tuần hoàn ($T = 2\\pi$ hoặc $\\pi$) và đồ thị của $y=\\sin x, \\cos x, \\tan x, \\cot x$.',
    mnemonics: ['Chỉ có $y = \\cos x$ là HÀM CHẴN; $\\sin x, \\tan x, \\cot x$ đều là HÀM LẺ.'],
    commonTraps: ['Quên điều kiện $\\cos x \\neq 0$ cho $\\tan x$ và $\\sin x \\neq 0$ cho $\\cot x$.'],
    theory: [
      '1. $y=\\sin x, \\cos x$ tuần hoàn chu kì $2\\pi$, tập giá trị $[-1; 1]$.',
      '2. $y=\\tan x, \\cot x$ tuần hoàn chu kì $\\pi$, tập giá trị $\\mathbb{R}$.'
    ],
    keyFormulas: ['T_{\\sin(ax+b)} = \\frac{2\\pi}{|a|};\\quad T_{\\tan(ax+b)} = \\frac{\\pi}{|a|}'],
    flashcards: [{ front: 'Chu kì tuần hoàn của $y = \\sin 3x$?', back: '$T = \\frac{2\\pi}{3}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 3',
        question: 'Hàm số nào sau đây là hàm số chẵn trên $\\mathbb{R}$?',
        options: ['A. $y = \\cos x$', 'B. $y = \\sin x$', 'C. $y = \\tan x$', 'D. $y = \\sin x + \\cos x$'],
        correctIndex: 0,
        explanation: '$\\cos(-x) = \\cos x$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · GTLN-GTNN lượng giác',
        question: 'Tìm giá trị lớn nhất và nhỏ nhất của $y = 3\\sin x - 2$.',
        hints: ['$-1 \\le \\sin x \\le 1$.'],
        solutionSteps: ['Bước 1: $-3 - 2 \\le y \\le 3 - 2 \\iff -5 \\le y \\le 1$.'],
        finalAnswer: '$\\max y = 1$, $\\min y = -5$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'circle_theorems_3d',
    defaultGraphConfig: { type: 'trig_sin', params: { a: 3, b: 1, c: 0, d: -2 }, color: '#ec4899', name: 'y = 3sin(x) - 2' }
  },
  {
    id: 'math-11-1',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 4,
    stageLabel: 'Chương I · Hàm Số Lượng Giác & PT Lượng Giác',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 4',
    title: 'Bài 4: Phương trình lượng giác cơ bản',
    grade: 'Lớp 11 · Lượng giác',
    category: 'Lượng giác & Mũ',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description:
      'Công thức nghiệm chuẩn của 4 phương trình lượng giác cơ bản $\\sin x = m$, $\\cos x = m$, $\\tan x = m$, $\\cot x = m$ và các trường hợp đặc biệt.',
    mnemonics: ['$\\sin$: $\\alpha$ và $\\pi - \\alpha$ ($+k2\\pi$); $\\cos$: $\\pm\\alpha + k2\\pi$; $\\tan, \\cot$: $+ k\\pi$.'],
    commonTraps: ['Nhầm chu kì $+k2\\pi$ cho $\\tan x = m$ (đúng là $+k\\pi$) hoặc quên ĐK $|m| \\le 1$.'],
    theory: [
      '1. $\\sin x = \\sin\\alpha \\iff x = \\alpha + k2\\pi$ hoặc $x = \\pi - \\alpha + k2\\pi$.',
      '2. $\\cos x = \\cos\\alpha \\iff x = \\pm\\alpha + k2\\pi$. $\\tan x = \\tan\\alpha \\iff x = \\alpha + k\\pi$.'
    ],
    keyFormulas: [
      '\\sin x = \\sin\\alpha \\iff x = \\alpha + k2\\pi \\text{ hoặc } x = \\pi - \\alpha + k2\\pi',
      '\\cos x = \\cos\\alpha \\iff x = \\pm\\alpha + k2\\pi',
      '\\tan x = \\tan\\alpha \\iff x = \\alpha + k\\pi'
    ],
    flashcards: [{ front: 'Nghiệm của $\\cos x = 0$?', back: '$x = \\frac{\\pi}{2} + k\\pi$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 4',
        question: 'Nghiệm của phương trình $\\sin x = \\frac{1}{2}$ là:',
        options: [
          'A. $x = \\frac{\\pi}{6} + k2\\pi,\\, x = \\frac{5\\pi}{6} + k2\\pi$',
          'B. $x = \\pm\\frac{\\pi}{6} + k2\\pi$',
          'C. $x = \\frac{\\pi}{3} + k2\\pi,\\, x = \\frac{2\\pi}{3} + k2\\pi$',
          'D. $x = \\frac{\\pi}{6} + k\\pi$'
        ],
        correctIndex: 0,
        explanation: '$\\frac{1}{2} = \\sin\\frac{\\pi}{6}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Giải PT lượng giác',
        question: 'Giải phương trình $\\cos\\left(2x - \\frac{\\pi}{3}\\right) = \\frac{\\sqrt{2}}{2}$.',
        hints: ['$\\frac{\\sqrt{2}}{2} = \\cos\\frac{\\pi}{4}$.'],
        solutionSteps: ['Bước 1: $2x - \\frac{\\pi}{3} = \\pm\\frac{\\pi}{4} + k2\\pi \\implies x = \\frac{7\\pi}{24} + k\\pi$ hoặc $x = \\frac{\\pi}{24} + k\\pi$.'],
        finalAnswer: '$x = \\frac{7\\pi}{24} + k\\pi$ hoặc $x = \\frac{\\pi}{24} + k\\pi$ ($k \\in \\mathbb{Z}$).'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'circle_theorems_3d',
    defaultGraphConfig: { type: 'trig_cos', params: { a: 1, b: 1, c: 0, d: 0 }, color: '#2563eb', name: 'y = cos(x)' }
  },

  // ==================== CHƯƠNG II. DÃY SỐ, CẤP SỐ CỘNG & CẤP SỐ NHÂN ====================
  {
    id: 'math-11-b5',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 5,
    stageLabel: 'Chương II · Dãy Số, Cấp Số Cộng & Cấp Số Nhân',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 5',
    title: 'Bài 5: Dãy số',
    grade: 'Lớp 11 · Đại số',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description: 'Cách cho dãy số (liệt kê, công thức tổng quát, truy hồi), dãy số tăng/giảm và dãy số bị chặn.',
    mnemonics: ['Tăng $\\iff u_{n+1} - u_n > 0$; Dãy dương xét $\\frac{u_{n+1}}{u_n} > 1$.'],
    commonTraps: ['Dùng $\\frac{u_{n+1}}{u_n} > 1$ khi $u_n$ chưa chắc dương.'],
    theory: [
      '1. Định nghĩa dãy số: Hàm số $u: \\mathbb{N}^* \\to \\mathbb{R}$, $n \\mapsto u_n$ gọi là dãy số vô hạn ($u_1, u_2, \\dots, u_n, \\dots$). Có 3 cách cho dãy số: liệt kê số hạng, công thức số hạng tổng quát $u_n = f(n)$ và hệ thức truy hồi.',
      '2. Tính tăng – giảm: $(u_n)$ là dãy tăng nếu $u_{n+1} > u_n$ (tức $u_{n+1} - u_n > 0$) với mọi $n \\ge 1$; là dãy giảm nếu $u_{n+1} < u_n$ với mọi $n \\ge 1$. Nếu mọi $u_n > 0$, có thể xét tỉ số $\\frac{u_{n+1}}{u_n}$ so với $1$.',
      '3. Dãy số bị chặn: $(u_n)$ bị chặn trên nếu $\\exists M: u_n \\le M\\,\\forall n$; bị chặn dưới nếu $\\exists m: u_n \\ge m\\,\\forall n$; bị chặn nếu vừa bị chặn trên vừa bị chặn dưới ($m \\le u_n \\le M$).'
    ],
    keyFormulas: ['u_{n+1} - u_n > 0 \\implies \\text{dãy tăng}'],
    flashcards: [{ front: 'Cho $u_n = \\frac{n}{n+1}$. Dãy tăng hay giảm?', back: '$u_{n+1}-u_n = \\frac{1}{(n+1)(n+2)} > 0 \\implies$ dãy tăng và bị chặn trên bởi $1$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 5',
        question: 'Dãy số $(u_n)$ với $u_1 = 2, u_{n+1} = 2u_n - 1$ có số hạng $u_4$ là:',
        options: ['A. $9$', 'B. $5$', 'C. $17$', 'D. $7$'],
        correctIndex: 0,
        explanation: '$u_2 = 3, u_3 = 5, u_4 = 9$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Xét tính bị chặn',
        question: 'Chứng minh dãy $u_n = \\frac{2n+1}{n+1}$ bị chặn.',
        hints: ['Viết $u_n = 2 - \\frac{1}{n+1}$.'],
        solutionSteps: ['Bước 1: Với $n \\ge 1$, $0 < \\frac{1}{n+1} \\le \\frac{1}{2} \\implies \\frac{3}{2} \\le u_n < 2$.'],
        finalAnswer: 'Dãy bị chặn dưới bởi $\\frac{3}{2}$ và chặn trên bởi $2$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'rational', params: { a: 2, b: 1, c: 1, d: 1 }, color: '#2563eb', name: 'u_n = (2n + 1)/(n + 1)' }
  },
  {
    id: 'math-11-3',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 6,
    stageLabel: 'Chương II · Dãy Số, Cấp Số Cộng & Cấp Số Nhân',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 6',
    title: 'Bài 6: Cấp số cộng',
    grade: 'Lớp 11 · Đại số',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description: 'Định nghĩa cấp số cộng $u_{n+1} = u_n + d$, số hạng tổng quát $u_n = u_1 + (n-1)d$ và tổng $n$ số hạng đầu $S_n$.',
    mnemonics: ['$S_n = \\frac{n(u_1 + u_n)}{2} = \\frac{n[2u_1 + (n-1)d]}{2}$; ba số $a,b,c$ lập CSC $\\iff a+c=2b$.'],
    commonTraps: ['Nhầm $(n-1)d$ thành $nd$ trong công thức $u_n$.'],
    theory: [
      '1. Định nghĩa Cấp số cộng: Là dãy số $(u_n)$ mà kể từ số hạng thứ hai, mỗi số hạng đều bằng số hạng đứng ngay trước nó cộng với một hằng số $d$ (gọi là công sai): $u_{n+1} = u_n + d$ ($n \\ge 1$).',
      '2. Số hạng tổng quát & Tính chất: $u_n = u_1 + (n-1)d$. Mỗi số hạng (trừ đầu và cuối) đều là trung bình cộng của hai số hạng đứng kề nó: $u_k = \\frac{u_{k-1} + u_{k+1}}{2}$.',
      '3. Tổng $n$ số hạng đầu: $S_n = u_1 + u_2 + \\dots + u_n = \\frac{n(u_1 + u_n)}{2} = \\frac{n[2u_1 + (n-1)d]}{2}$.'
    ],
    keyFormulas: ['u_n = u_1 + (n-1)d', 'S_n = \\frac{n(u_1 + u_n)}{2} = \\frac{n[2u_1+(n-1)d]}{2}'],
    flashcards: [{ front: 'CSC có $u_1 = 3, d = 4$. Tìm $u_{10}$?', back: '$3 + 9\\cdot 4 = 39$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 6',
        question: 'Cấp số cộng có $u_1 = -2, d = 3$. Tổng $10$ số hạng đầu $S_{10}$ là:',
        options: ['A. $115$', 'B. $125$', 'C. $105$', 'D. $130$'],
        correctIndex: 0,
        explanation: '$S_{10} = \\frac{10(-4 + 9\\cdot 3)}{2} = 5 \\cdot 23 = 115$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Tìm CSC',
        question: 'Tìm $u_1, d$ của CSC biết $u_3 + u_5 = 24$ và $u_2 + u_7 = 27$.',
        hints: ['Đưa về $u_1, d$.'],
        solutionSteps: ['Bước 1: $2u_1 + 6d = 24$ và $2u_1 + 7d = 27 \\implies d = 3, u_1 = 3$.'],
        finalAnswer: '$u_1 = 3, d = 3$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'linear', params: { a: 3, b: -5, c: 0, d: 0 }, color: '#0ea5e9', name: 'Cấp số cộng u_n = 3n - 5' }
  },
  {
    id: 'math-11-b7',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 7,
    stageLabel: 'Chương II · Dãy Số, Cấp Số Cộng & Cấp Số Nhân',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 7',
    title: 'Bài 7: Cấp số nhân',
    grade: 'Lớp 11 · Đại số',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description: 'Định nghĩa cấp số nhân $u_{n+1} = u_n \\cdot q$, số hạng tổng quát $u_n = u_1 q^{n-1}$ và tổng $S_n = u_1\\frac{1-q^n}{1-q}$.',
    mnemonics: ['Ba số $a, b, c$ lập CSN $\\iff a \\cdot c = b^2$.'],
    commonTraps: ['Dùng $S_n = u_1\\frac{1-q^n}{1-q}$ khi $q = 1$ (khi $q=1$ thì $S_n = n u_1$).'],
    theory: [
      '1. Định nghĩa Cấp số nhân: Là dãy số $(u_n)$ mà kể từ số hạng thứ hai, mỗi số hạng đều bằng số hạng đứng ngay trước nó nhân với một hằng số $q$ (gọi là công bội): $u_{n+1} = u_n \\cdot q$ ($n \\ge 1$).',
      '2. Số hạng tổng quát & Tính chất: $u_n = u_1 q^{n-1}$. Bình phương mỗi số hạng (trừ đầu và cuối) bằng tích hai số hạng đứng kề nó: $u_k^2 = u_{k-1} \\cdot u_{k+1}$.',
      '3. Tổng $n$ số hạng đầu: Nếu $q \\neq 1$ thì $S_n = u_1\\frac{1-q^n}{1-q}$; nếu $q = 1$ thì $S_n = n \\cdot u_1$.'
    ],
    keyFormulas: ['u_n = u_1 q^{n-1}', 'S_n = u_1 \\frac{1 - q^n}{1 - q}\\quad (q \\neq 1)'],
    flashcards: [{ front: 'CSN có $u_1 = 2, q = 3$. Tính $u_5$ và $S_5$?', back: '$u_5 = 2\\cdot 3^4 = 162$; $S_5 = 2\\cdot\\frac{243-1}{2} = 242$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 7',
        question: 'Cấp số nhân $(u_n)$ có $u_1 = 3, u_2 = -6$. Công bội $q$ là:',
        options: ['A. $-2$', 'B. $2$', 'C. $-3$', 'D. $-9$'],
        correctIndex: 0,
        explanation: '$q = u_2 / u_1 = -6 / 3 = -2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Bài toán CSN',
        question: 'Tìm $u_1, q$ của CSN biết $u_4 - u_2 = 72$ và $u_5 - u_3 = 144$.',
        hints: ['Chia hai phương trình để tìm $q$.'],
        solutionSteps: ['Bước 1: $q(u_4-u_2) = u_5-u_3 \\implies q = 2$. Từ $u_1(8-2)=72 \\implies u_1 = 12$.'],
        finalAnswer: '$u_1 = 12, q = 2$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'exponential', params: { a: 2, b: 0.405, c: 0, d: 0 }, color: '#8b5cf6', name: 'Cấp số nhân u_n = u₁·q^(n-1)' }
  },

  // ==================== CHƯƠNG III. THỐNG KÊ MẪU SỐ LIỆU GHÉP NHÓM ====================
  {
    id: 'math-11-b8',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 8,
    stageLabel: 'Chương III · Mẫu Số Liệu Ghép Nhóm',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 8',
    title: 'Bài 8: Mẫu số liệu ghép nhóm',
    grade: 'Lớp 11 · Thống kê',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description: 'Ghép nhóm số liệu dạng $[a_i; a_{i+1})$, giá trị đại diện $c_i = \\frac{a_i+a_{i+1}}{2}$, tần số $m_i$ và hiệu chỉnh nhóm liên tục.',
    mnemonics: ['Giá trị đại diện nhóm $[a; b)$ luôn bằng trung bình cộng $\\frac{a+b}{2}$.'],
    commonTraps: ['Nhầm nhóm rời rạc (ví dụ $[1; 5], [6; 10]$) chưa hiệu chỉnh đầu mút thành $[0{,}5; 5{,}5), [5{,}5; 10{,}5)$.'],
    theory: [
      '1. Cấu trúc bảng tần số ghép nhóm: Chia tập dữ liệu lớn thành $k$ nhóm dạng nửa khoảng $[a_1; a_2), [a_2; a_3), \\dots, [a_k; a_{k+1})$ với độ rộng nhóm $L_i = a_{i+1} - a_i$ và tần số $m_i$ (tổng cỡ mẫu $n = \\sum m_i$).',
      '2. Giá trị đại diện của nhóm thứ $i$: $c_i = \\frac{a_i + a_{i+1}}{2}$, dùng để ước lượng các số đặc trưng (số trung bình, phương sai) khi không còn dữ liệu thô ban đầu.',
      '3. Quy tắc hiệu chỉnh nhóm rời rạc: Nếu số liệu là số nguyên chia thành $[k_1; k_2], [k_2+1; k_3]$, ta mở rộng hai đầu mỗi đoạn thêm $0{,}5$ thành $[k_1 - 0{,}5; k_2 + 0{,}5), [k_2 + 0{,}5; k_3 + 0{,}5)$ để đảm bảo liên tiếp không bỏ sót giá trị.'
    ],
    keyFormulas: ['c_i = \\frac{a_i + a_{i+1}}{2},\\quad n = \\sum_{i=1}^k m_i'],
    flashcards: [{ front: 'Nhóm $[10; 20)$ có giá trị đại diện là bao nhiêu?', back: '$\\frac{10+20}{2} = 15$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 8',
        question: 'Giá trị đại diện của nhóm $[40; 50)$ là:',
        options: ['A. $45$', 'B. $40$', 'C. $50$', 'D. $10$'],
        correctIndex: 0,
        explanation: '$(40+50)/2 = 45$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Hiệu chỉnh nhóm',
        question: 'Hiệu chỉnh các nhóm điểm nguyên $[1; 3], [4; 6], [7; 9]$ thành các nửa khoảng liên tiếp.',
        hints: ['Mở rộng hai đầu mỗi khoảng thêm $0{,}5$.'],
        solutionSteps: ['Bước 1: $[0{,}5; 3{,}5), [3{,}5; 6{,}5), [6{,}5; 9{,}5)$.'],
        finalAnswer: '$[0{,}5; 3{,}5), [3{,}5; 6{,}5), [6{,}5; 9{,}5)$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '4*e^(-0.5*x*x)', params: { a: 4, b: 0, c: 1, d: 0 }, color: '#8b5cf6', name: 'Phân bố mẫu ghép nhóm' }
  },
  {
    id: 'math-11-b9',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 9,
    stageLabel: 'Chương III · Mẫu Số Liệu Ghép Nhóm',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 9',
    title: 'Bài 9: Các số đặc trưng đo xu thế trung tâm (Mẫu ghép nhóm)',
    grade: 'Lớp 11 · Thống kê',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description: 'Tính số trung bình $\\overline{x}$, Trung vị $M_e$, Tứ phân vị $Q_1, Q_2, Q_3$ và Mốt $M_o$ của mẫu số liệu ghép nhóm.',
    mnemonics: ['Nội suy $Q_r$: $a_p + \\frac{\\frac{rn}{4} - cf_{p-1}}{m_p}\\cdot(a_{p+1}-a_p)$ (công thức chuẩn SGK 2018).'],
    commonTraps: ['Nhầm $cf_{p-1}$ (tần số tích lũy của các nhóm TRƯỚC nhóm chứa $Q_r$) với $m_p$.'],
    theory: [
      '1. $\\overline{x} = \\frac{1}{n}\\sum m_i c_i$.',
      '2. Trung vị $M_e = Q_2 = a_p + \\frac{\\frac{n}{2} - (m_1+\\dots+m_{p-1})}{m_p}(a_{p+1}-a_p)$.',
      '3. Mốt $M_o = a_j + \\frac{m_j - m_{j-1}}{(m_j - m_{j-1}) + (m_j - m_{j+1})}(a_{j+1}-a_j)$.'
    ],
    keyFormulas: [
      '\\overline{x} = \\frac{1}{n}\\sum_{i=1}^k m_i c_i',
      'Q_r = a_p + \\frac{\\frac{r n}{4} - (m_1+\\dots+m_{p-1})}{m_p}(a_{p+1}-a_p)\\quad (r=1,2,3)'
    ],
    flashcards: [{ front: 'Nhóm chứa mốt $M_o$ được xác định như thế nào?', back: 'Là nhóm có tần số $m_j$ lớn nhất.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 9',
        question: 'Cho bảng ghép nhóm: $[0;10)$ có $m_1=4$, $[10;20)$ có $m_2=6$. Số trung bình $\\overline{x}$ là:',
        options: ['A. $11$', 'B. $10$', 'C. $12$', 'D. $9$'],
        correctIndex: 0,
        explanation: '$c_1=5, c_2=15 \\implies \\overline{x} = \\frac{4\\cdot 5 + 6\\cdot 15}{10} = 11$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Tìm trung vị ghép nhóm',
        question: 'Mẫu gồm 20 số: $[0;10): 4$, $[10;20): 8$, $[20;30): 8$. Tính $M_e$.',
        hints: ['$\\frac{n}{2} = 10$ rơi vào nhóm $[10; 20)$.'],
        solutionSteps: ['Bước 1: $M_e = 10 + \\frac{10 - 4}{8}\\cdot 10 = 17{,}5$.'],
        finalAnswer: '$M_e = 17{,}5$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '4*e^(-0.5*(x-1)^2)', params: { a: 4, b: 1, c: 1, d: 0 }, color: '#6366f1', name: 'Trung vị & Mốt ghép nhóm' }
  },

  // ==================== CHƯƠNG IV. QUAN HỆ SONG SONG TRONG KHÔNG GIAN ====================
  {
    id: 'math-11-b10',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 10,
    stageLabel: 'Chương IV · Quan Hệ Song Song Trong Không Gian',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 10',
    title: 'Bài 10: Đường thẳng và mặt phẳng trong không gian',
    grade: 'Lớp 11 · Hình học không gian',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 16,
    description: 'Các tính chất thừa nhận hình học không gian, tìm giao tuyến hai mặt phẳng, tìm giao điểm đường thẳng với mặt phẳng và chứng minh 3 điểm thẳng hàng.',
    mnemonics: ['Muốn tìm giao tuyến 2 mặt phẳng: tìm 2 ĐIỂM CHUNG phân biệt.'],
    commonTraps: ['Cho hai đường thẳng không đồng phẳng cắt nhau trong hình vẽ không gian!'],
    theory: [
      '1. Giao tuyến của $(P)$ và $(Q)$ là đường thẳng đi qua 2 điểm chung phân biệt.',
      '2. Giao điểm của $d$ và $(P)$: chọn mặt phẳng phụ $(\\alpha) \\supset d$, tìm giao tuyến $\\Delta = (\\alpha)\\cap(P)$, giao của $d$ và $\\Delta$ là điểm cần tìm.'
    ],
    keyFormulas: ['M \\in (P)\\cap(Q) \\text{ và } N \\in (P)\\cap(Q) \\implies (P)\\cap(Q) = MN'],
    flashcards: [{ front: 'Có bao nhiêu mặt phẳng đi qua 3 điểm không thẳng hàng?', back: 'Duy nhất $1$ mặt phẳng.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 10',
        question: 'Hình chóp tứ giác $S.ABCD$ có giao tuyến của $(SAC)$ và $(SBD)$ là:',
        options: ['A. $SO$ ($O = AC\\cap BD$)', 'B. $SA$', 'C. $SC$', 'D. $AB$'],
        correctIndex: 0,
        explanation: 'Hai điểm chung là $S$ và $O = AC \\cap BD$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Giao điểm',
        question: 'Cho hình chóp $S.ABCD$ đáy $ABCD$ là hình bình hành. Nêu cách tìm giao điểm của $SA$ và $(MBD)$ với $M$ là trung điểm $SC$.',
        hints: ['Chọn mặt phụ $(SAC) \\supset SA$.'],
        solutionSteps: ['Bước 1: Giao tuyến $(SAC)\\cap(MBD) = MO$ ($O = AC\\cap BD$). Trong $(SAC)$, $SA \\cap MO = I$ chính là giao điểm cần tìm.'],
        finalAnswer: '$I = SA \\cap MO$ (và $I$ là trọng tâm $\\triangle SAC$, chia $SA$ theo tỉ số $SI = \\frac{1}{3}SA$? Kiểm tra bằng Menelaus: $I$ là trung điểm hay chia $1:2$ -> Menelaus cho $IA/IS = 2$ nên $SI = \\frac{1}{3}SA$!).'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  {
    id: 'math-11-b11',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 11,
    stageLabel: 'Chương IV · Quan Hệ Song Song Trong Không Gian',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 11',
    title: 'Bài 11: Hai đường thẳng song song',
    grade: 'Lớp 11 · Hình học không gian',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 15,
    description: 'Vị trí tương đối hai đường thẳng (song song, cắt nhau, trùng, chéo nhau) và Định lí giao tuyến ba mặt phẳng.',
    mnemonics: ['Ba mặt phẳng cắt nhau theo 3 giao tuyến thì 3 giao tuyến đó ĐỒNG QUY hoặc ĐÔI MỘT SONG SONG.'],
    commonTraps: ['Kết luận 2 đường thẳng song song chỉ vì chúng không cắt nhau (có thể chéo nhau!).'],
    theory: [
      '1. Hai đường thẳng chéo nhau nếu không đồng phẳng.',
      '2. Hệ quả giao tuyến: Nếu $(P)\\cap(Q) = d$ và $(P) \\supset a, (Q) \\supset b$ với $a \\parallel b$ thì $d \\parallel a \\parallel b$.'
    ],
    keyFormulas: ['a\\subset(P),\\, b\\subset(Q),\\, a\\parallel b,\\, d=(P)\\cap(Q) \\implies d\\parallel a\\parallel b'],
    flashcards: [{ front: 'Cho chóp $S.ABCD$ đáy $ABCD$ hình thang ($AB\\parallel CD$). Giao tuyến $(SAB)$ và $(SCD)$ là?', back: 'Đường thẳng $Sx$ qua $S$ và song song với $AB, CD$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 11',
        question: 'Trong không gian, hai đường thẳng không có điểm chung thì:',
        options: ['A. Song song hoặc chéo nhau', 'B. Chắc chắn song song', 'C. Chắc chắn chéo nhau', 'D. Đồng phẳng'],
        correctIndex: 0,
        explanation: 'Nếu đồng phẳng thì song song, không đồng phẳng thì chéo nhau.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Giao tuyến song song',
        question: 'Cho tứ diện $ABCD$, $M, N$ là trung điểm $AB, AC$. Tìm giao tuyến của $(DMN)$ và $(BCD)$.',
        hints: ['$MN \\parallel BC$.'],
        solutionSteps: ['Bước 1: $MN \\parallel BC$, điểm chung $D \\implies$ giao tuyến là đường thẳng $Dx$ qua $D$ song song với $BC$.'],
        finalAnswer: 'Đường thẳng qua $D$ song song với $BC$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  {
    id: 'math-11-7',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 12,
    stageLabel: 'Chương IV · Quan Hệ Song Song Trong Không Gian',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 12',
    title: 'Bài 12: Đường thẳng và mặt phẳng song song',
    grade: 'Lớp 11 · Hình học không gian',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Điều kiện $d \\parallel (P)$, tính chất giao tuyến và dựng thiết diện song song.',
    mnemonics: ['Muốn $d \\parallel (P)$: tìm một đường thẳng $d\' \\subset (P)$ sao cho $d \\parallel d\'$ (và $d \\not\\subset (P)$).'],
    commonTraps: ['Quên điều kiện $d$ không nằm trong $(P)$.'],
    theory: ['1. $d \\not\\subset (P),\\, d\' \\subset (P),\\, d \\parallel d\' \\implies d \\parallel (P)$.', '2. Nếu $d \\parallel (P)$ và $(\\alpha) \\supset d$ cắt $(P)$ theo giao tuyến $\\Delta$ thì $\\Delta \\parallel d$.'],
    keyFormulas: ['d\\not\\subset(P),\\, d\'\\subset(P),\\, d\\parallel d\' \\implies d\\parallel(P)'],
    flashcards: [{ front: 'Mặt phẳng $(\\alpha)$ chứa $d \\parallel (P)$ cắt $(P)$ theo giao tuyến $m$. Quan hệ $d$ và $m$?', back: '$d \\parallel m$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 12',
        question: 'Cho tứ diện $ABCD$, $G_1, G_2$ lần lượt là trọng tâm $\\triangle ABC, \\triangle ABD$. Đường thẳng $G_1G_2$ song song với mặt phẳng nào?',
        options: ['A. $(BCD)$ và $(ACD)$', 'B. $(ABC)$', 'C. $(ABD)$', 'D. $(ABG_1)$'],
        correctIndex: 0,
        explanation: '$G_1G_2 \\parallel CD$ nên song song $(BCD)$ và $(ACD)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Thiết diện song song',
        question: 'Cho chóp $S.ABCD$ đáy hình bình hành tâm $O$. $M$ là trung điểm $SC$. Chứng minh $SA \\parallel (MBD)$.',
        hints: ['Chứng minh $SA \\parallel OM$.'],
        solutionSteps: ['Bước 1: $OM$ là đường trung bình $\\triangle SAC \\implies OM \\parallel SA$, mà $OM \\subset (MBD)$ nên $SA \\parallel (MBD)$.'],
        finalAnswer: '$SA \\parallel (MBD)$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  {
    id: 'math-11-b13',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 13,
    stageLabel: 'Chương IV · Quan Hệ Song Song Trong Không Gian',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 13',
    title: 'Bài 13: Hai mặt phẳng song song',
    grade: 'Lớp 11 · Hình học không gian',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Điều kiện $(P) \\parallel (Q)$, định lí Thales trong không gian, hình lăng trụ và hình hộp.',
    mnemonics: ['2 đường cắt nhau cùng song song mặt kia $\\implies$ hai mặt phẳng song song.'],
    commonTraps: ['Dùng 2 đường song song (thay vì 2 đường CẮT NHAU) để kết luận 2 mặt phẳng song song.'],
    theory: ['1. $(P)$ chứa 2 đường cắt nhau $a, b$ đều song song $(Q) \\implies (P) \\parallel (Q)$.', '2. Mặt phẳng $(R)$ cắt 2 mặt song song $(P), (Q)$ theo 2 giao tuyến song song.'],
    keyFormulas: ['a\\cap b = I,\\, a,b\\subset(P),\\, a\\parallel(Q),\\, b\\parallel(Q) \\implies (P)\\parallel(Q)'],
    flashcards: [{ front: 'Hình hộp có bao nhiêu cặp mặt đối diện song song?', back: '$3$ cặp mặt hình bình hành song song và bằng nhau.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 13',
        question: 'Nếu một mặt phẳng cắt hai mặt phẳng song song thì hai giao tuyến thu được sẽ:',
        options: ['A. Song song với nhau', 'B. Cắt nhau', 'C. Chéo nhau', 'D. Vuông góc nhau'],
        correctIndex: 0,
        explanation: 'Theo định lí giao tuyến hai mặt phẳng song song, hai giao tuyến song song.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Song song 2 mặt phẳng',
        question: 'Cho lăng trụ $ABC.A\'B\'C\'$. Gọi $M, N, P$ là trung điểm $AA\', BB\', CC\'$. Chứng minh $(MNP) \\parallel (ABC)$.',
        hints: ['$MN \\parallel AB$ và $NP \\parallel BC$.'],
        solutionSteps: ['Bước 1: $MN \\parallel AB \\subset (ABC)$ và $NP \\parallel BC \\subset (ABC)$, mà $MN \\cap NP = N \\implies (MNP) \\parallel (ABC)$.'],
        finalAnswer: '$(MNP) \\parallel (ABC)$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  {
    id: 'math-11-b14',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 14,
    stageLabel: 'Chương IV · Quan Hệ Song Song Trong Không Gian',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 14',
    title: 'Bài 14: Phép chiếu song song',
    grade: 'Lớp 11 · Hình học không gian',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description: 'Định nghĩa phép chiếu song song theo phương $l$ lên mặt phẳng $(P)$, các tính chất bảo toàn thẳng hàng, song song, tỉ số độ dài và hình biểu diễn hình không gian.',
    mnemonics: ['Phép chiếu song song giữ nguyên TỈ SỐ ĐỘ DÀI hai đoạn thẳng nằm trên cùng đường thẳng hoặc hai đường song song.'],
    commonTraps: ['Cho rằng phép chiếu song song giữ nguyên góc vuông hoặc độ dài tuyệt đối.'],
    theory: [
      '1. Khái niệm phép chiếu song song: Cho mặt phẳng $(P)$ và đường thẳng $l$ cắt $(P)$. Với mỗi điểm $M$ trong không gian, đường thẳng qua $M$ song song (hoặc trùng) với $l$ cắt $(P)$ tại $M\'$ gọi là hình chiếu song song của $M$ lên $(P)$ theo phương $l$.',
      '2. Các tính chất bất biến: Phép chiếu song song biến ba điểm thẳng hàng thành ba điểm thẳng hàng (bảo toàn thứ tự), biến đường thẳng thành đường thẳng (hoặc một điểm nếu song song phương chiếu), biến hai đường thẳng song song thành hai đường thẳng song song hoặc trùng nhau.',
      '3. Tỉ số độ dài & Hình biểu diễn: Phép chiếu song song giữ nguyên tỉ số độ dài hai đoạn thẳng cùng nằm trên một đường thẳng hoặc trên hai đường thẳng song song: $\\frac{A\'B\'}{C\'D\'} = \\frac{AB}{CD}$. Hình vuông/chữ nhật được biểu diễn thành hình bình hành; đường tròn biểu diễn thành elip.'
    ],
    keyFormulas: ['AB \\parallel CD \\implies \\frac{A\'B\'}{C\'D\'} = \\frac{AB}{CD}'],
    flashcards: [{ front: 'Hình chiếu song song của hình bình hành (không song song phương chiếu) là hình gì?', back: 'Vẫn là một hình bình hành!' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 14',
        question: 'Phép chiếu song song KHÔNG bảo toàn tính chất nào sau đây?',
        options: ['A. Độ lớn của góc', 'B. Sự thẳng hàng của 3 điểm', 'C. Thứ tự của 3 điểm thẳng hàng', 'D. Tỉ số độ dài hai đoạn thẳng song song'],
        correctIndex: 0,
        explanation: 'Góc vuông có thể biến thành góc nhọn hoặc tù dưới phép chiếu song song.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Hình biểu diễn',
        question: 'Hình chiếu song song của đường tròn có thể là đường gì?',
        hints: ['Tùy vào mặt phẳng chứa đường tròn có song song phương chiếu hay không.'],
        solutionSteps: ['Bước 1: Nếu mặt phẳng đường tròn song song phương chiếu -> đoạn thẳng; ngược lại -> đường tròn hoặc Elip.'],
        finalAnswer: 'Đoạn thẳng, đường tròn hoặc Elip.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },

  // ==================== CHƯƠNG V. GIỚI HẠN. HÀM SỐ LIÊN TỤC ====================
  {
    id: 'math-11-b15',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 15,
    stageLabel: 'Chương V · Giới Hạn & Hàm Số Liên Tục',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 15',
    title: 'Bài 15: Giới hạn của dãy số',
    grade: 'Lớp 11 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Giới hạn hữu hạn của dãy số, chia tử mẫu cho lũy thừa bậc cao nhất của $n$, tổng cấp số nhân lùi vô hạn $S = \\frac{u_1}{1-q}$ ($|q|<1$) và giới hạn vô cực.',
    mnemonics: ['$|q| < 1 \\implies \\lim q^n = 0$; chia cả tử và mẫu cho $n^k$ bậc cao nhất.'],
    commonTraps: ['Dùng $S = \\frac{u_1}{1-q}$ khi $|q| \\ge 1$.'],
    theory: ['1. $\\lim \\frac{1}{n^k} = 0$ ($k>0$), $\\lim q^n = 0$ ($|q|<1$).', '2. Tổng CSN lùi vô hạn: $S = \\frac{u_1}{1-q}$ ($|q|<1$).'],
    keyFormulas: ['\\lim_{n\\to+\\infty} q^n = 0\\ (|q|<1)', 'S = \\frac{u_1}{1-q}\\ (|q|<1)'],
    flashcards: [{ front: 'Tính $\\lim \\frac{3n^2 - 2n}{n^2 + 5}$?', back: 'Chia tử mẫu cho $n^2$ được $\\frac{3}{1} = 3$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 15',
        question: 'Giá trị của $\\lim \\frac{2\\cdot 3^n - 5}{3^n + 2^n}$ bằng:',
        options: ['A. $2$', 'B. $0$', 'C. $-\\frac{5}{2}$', 'D. $+\\infty$'],
        correctIndex: 0,
        explanation: 'Chia tử mẫu cho $3^n$, khi $n\\to+\\infty$ còn $2/1 = 2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Số thập phân vô hạn tuần hoàn',
        question: 'Biểu diễn số $0,(36)$ dưới dạng phân số tối giản bằng tổng CSN lùi vô hạn.',
        hints: ['$0,36 + 0,0036 + \\dots$ với $u_1 = 0,36, q = 0,01$.'],
        solutionSteps: ['Bước 1: $S = \\frac{36/100}{1 - 1/100} = \\frac{36}{99} = \\frac{4}{11}$.'],
        finalAnswer: '$\\frac{4}{11}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'rational', params: { a: 3, b: 0, c: 1, d: 2 }, color: '#0ea5e9', name: 'Hội tụ dãy u_n = 3n/(n + 2)' }
  },
  {
    id: 'math-11-6',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 16,
    stageLabel: 'Chương V · Giới Hạn & Hàm Số Liên Tục',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 16',
    title: 'Bài 16: Giới hạn của hàm số',
    grade: 'Lớp 11 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 18,
    description: 'Khử dạng vô định $\\frac{0}{0}$ bằng phân tích nhân tử / nhân liên hợp, giới hạn một bên $x \\to x_0^\\pm$ và giới hạn tại vô cực $x \\to \\pm\\infty$.',
    mnemonics: ['Khi $x \\to -\\infty$, đưa $x^2$ ra ngoài căn $\\sqrt{x^2} = |x| = -x$ (dấu TRỪ!).'],
    commonTraps: ['Quên đổi dấu khi đưa $x$ ra khỏi căn $\\sqrt{x^2}$ lúc $x \\to -\\infty$.'],
    theory: ['1. Dạng $\\frac{0}{0}$: phân tích nhân tử $(x-x_0)$ hoặc nhân biểu thức liên hợp để rút gọn.', '2. Giới hạn một bên tồn tại và bằng nhau $\\lim_{x\\to x_0^+} f = \\lim_{x\\to x_0^-} f = L \\iff \\lim_{x\\to x_0} f = L$.'],
    keyFormulas: ['\\sqrt{x^2} = |x| = -x \\text{ khi } x \\to -\\infty'],
    flashcards: [{ front: 'Tính $\\lim_{x\\to 2} \\frac{x^2-4}{x-2}$?', back: '$\\lim_{x\\to 2} (x+2) = 4$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 16',
        question: 'Giá trị $\\lim_{x\\to -\\infty} \\frac{\\sqrt{4x^2 + 1}}{x - 1}$ là:',
        options: ['A. $-2$', 'B. $2$', 'C. $4$', 'D. $-4$'],
        correctIndex: 0,
        explanation: 'Vì $x\\to -\\infty$ nên $\\sqrt{4x^2+1} = -x\\sqrt{4+1/x^2}$, chia tử mẫu cho $x$ được $-2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Nhân liên hợp',
        question: 'Tính $\\lim_{x\\to 1} \\frac{\\sqrt{x+3}-2}{x-1}$.',
        hints: ['Nhân cả tử và mẫu với $\\sqrt{x+3}+2$.'],
        solutionSteps: ['Bước 1: Tử thành $x+3-4 = x-1$, rút gọn $x-1$ còn $\\frac{1}{\\sqrt{x+3}+2} \\to \\frac{1}{4}$.'],
        finalAnswer: '$\\frac{1}{4}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'rational', params: { a: 1, b: 2, c: 1, d: -2 }, color: '#0ea5e9', name: 'Khảo sát giới hạn hàm số' }
  },
  {
    id: 'math-11-b17',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 17,
    stageLabel: 'Chương V · Giới Hạn & Hàm Số Liên Tục',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 17',
    title: 'Bài 17: Hàm số liên tục',
    grade: 'Lớp 11 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description: 'Điều kiện hàm số liên tục tại điểm $x_0$, liên tục trên khoảng/đoạn và Định lí giá trị trung gian chứng minh phương trình có nghiệm $f(a)\\cdot f(b) < 0$.',
    mnemonics: ['Liên tục tại $x_0 \\iff \\lim_{x\\to x_0^+} f(x) = \\lim_{x\\to x_0^-} f(x) = f(x_0)$.'],
    commonTraps: ['Quên kiểm tra hàm số có xác định tại $x_0$ không trước khi kết luận liên tục.'],
    theory: [
      '1. Hàm số liên tục tại điểm $x_0$: Hàm số $y = f(x)$ xác định trên khoảng $K$ chứa $x_0$ liên tục tại $x_0$ khi và chỉ khi $\\lim_{x\\to x_0} f(x) = f(x_0)$ (tức giới hạn trái, giới hạn phải cùng tồn tại hữu hạn và bằng đúng $f(x_0)$).',
      '2. Tính liên tục của hàm sơ cấp: Các hàm đa thức liên tục trên $\\mathbb{R}$; hàm phân thức hữu tỉ, lượng giác, mũ, lôgarit, căn thức liên tục trên từng khoảng xác định của chúng.',
      '3. Định lí giá trị trung gian: Nếu $f$ liên tục trên đoạn $[a; b]$ và $f(a)\\cdot f(b) < 0$ (hai đầu mút trái dấu) thì tồn tại ít nhất một điểm $c \\in (a; b)$ sao cho $f(c) = 0$ — công cụ chuẩn để chứng minh phương trình có nghiệm.'
    ],
    keyFormulas: ['\\lim_{x\\to x_0} f(x) = f(x_0)', 'f(a)\\cdot f(b) < 0 \\implies \\exists c\\in(a;b): f(c)=0'],
    flashcards: [{ front: 'Cách chứng minh $f(x)=0$ có ít nhất 1 nghiệm trên $(a;b)$?', back: 'Chứng minh $f$ liên tục trên $[a;b]$ và $f(a)\\cdot f(b) < 0$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 17',
        question: 'Cho $f(x) = \\frac{x^2-1}{x-1}$ khi $x\\neq 1$ và $f(1) = m$. Để $f$ liên tục tại $x=1$ thì $m$ bằng:',
        options: ['A. $2$', 'B. $1$', 'C. $0$', 'D. $-2$'],
        correctIndex: 0,
        explanation: '$\\lim_{x\\to 1} f(x) = \\lim_{x\\to 1}(x+1) = 2 = m$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Chứng minh có nghiệm',
        question: 'Chứng minh $x^3 - 3x + 1 = 0$ có ít nhất một nghiệm trong $(0; 1)$.',
        hints: ['Tính $f(0)$ và $f(1)$.'],
        solutionSteps: ['Bước 1: $f$ đa thức nên liên tục trên $[0;1]$. $f(0) = 1, f(1) = -1 \\implies f(0)\\cdot f(1) = -1 < 0$.'],
        finalAnswer: 'Phương trình có ít nhất 1 nghiệm thuộc $(0; 1)$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: 0, c: -3, d: 1 }, color: '#10b981', name: 'y = x³ - 3x + 1' }
  },
  // CHƯƠNG VI: HÀM SỐ MŨ VÀ HÀM SỐ LÔGARIT
  {
    id: 'math-11-b18',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 18,
    stageLabel: 'Chương VI · Hàm Số Mũ & Hàm Số Lôgarit',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 18',
    title: 'Bài 18: Lũy thừa với số mũ thực',
    grade: 'Lớp 11 · Giải tích',
    category: 'Lượng giác & Mũ',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description: 'Lũy thừa với số mũ nguyên, số mũ hữu tỉ $a^{m/n} = \\sqrt[n]{a^m}$ ($a>0$), số mũ thực và các tính chất biến đổi căn thức sang lũy thừa.',
    mnemonics: ['Số mũ hữu tỉ/vô tỉ thì cơ số $a$ PHẢI dương ($a > 0$); rút gọn $\\sqrt[n]{a^m} = a^{m/n}$.'],
    commonTraps: ['Áp dụng $a^{m/n}$ cho cơ số $a \\le 0$ (ví dụ $(-2)^{1/2}$ không xác định trên $\\mathbb{R}$).'],
    theory: [
      '1. Lũy thừa với số mũ nguyên & hữu tỉ: Với $a \\neq 0$, $a^0 = 1$, $a^{-n} = \\frac{1}{a^n}$. Với $a > 0$, $m \\in \\mathbb{Z}, n \\ge 2$: $a^{m/n} = \\sqrt[n]{a^m}$.',
      '2. Các quy tắc tính toán ($a, b > 0; \\alpha, \\beta \\in \\mathbb{R}$): $a^\\alpha \\cdot a^\\beta = a^{\\alpha+\\beta}$, $\\frac{a^\\alpha}{a^\\beta} = a^{\\alpha-\\beta}$, $(a^\\alpha)^\\beta = a^{\\alpha\\beta}$, $(ab)^\\alpha = a^\\alpha b^\\alpha$.',
      '3. So sánh lũy thừa cùng cơ số: Khi $a > 1$, $a^\\alpha > a^\\beta \\iff \\alpha > \\beta$ (cùng chiều); khi $0 < a < 1$, $a^\\alpha > a^\\beta \\iff \\alpha < \\beta$ (ngược chiều).'
    ],
    keyFormulas: ['\\sqrt[n]{a^m} = a^{m/n}\\ (a>0)', '(a^\\alpha)^\\beta = a^{\\alpha\\beta}'],
    flashcards: [{ front: 'Điều kiện xác định của $(x-1)^{\\pi}$ là gì?', back: 'Số mũ không nguyên ($\\pi \\notin \\mathbb{Z}$) nên cơ số phải dương: $x - 1 > 0 \\iff x > 1$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 18',
        question: 'Với $a > 0$, biểu thức $P = a^{\\frac{1}{3}} \\cdot \\sqrt{a}$ bằng:',
        options: ['A. $a^{\\frac{5}{6}}$', 'B. $a^{\\frac{1}{6}}$', 'C. $a^{\\frac{2}{3}}$', 'D. $a^{\\frac{1}{2}}$'],
        correctIndex: 0,
        explanation: '$P = a^{1/3} \\cdot a^{1/2} = a^{1/3 + 1/2} = a^{5/6}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Rút gọn lũy thừa',
        question: 'Rút gọn biểu thức $A = \\frac{a^{\\frac{4}{3}}(a^{-\\frac{1}{3}} + a^{\\frac{2}{3}})}{a^{\\frac{1}{4}}(a^{\\frac{3}{4}} + a^{-\\frac{1}{4}})}$ với $a > 0$.',
        hints: ['Nhân phân phối vào trong ngoặc để cộng số mũ.'],
        solutionSteps: ['Bước 1: Tử $= a^1 + a^2 = a(1+a)$; Mẫu $= a^1 + a^0 = a + 1$.', 'Bước 2: Rút gọn $A = a$.'],
        finalAnswer: '$A = a$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'exponential', params: { a: 1, b: 1, c: 0, d: 0 }, color: '#f59e0b', name: 'y = e^x' }
  },
  {
    id: 'math-11-8',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 19,
    stageLabel: 'Chương VI · Hàm Số Mũ & Hàm Số Lôgarit',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 19',
    title: 'Bài 19: Lôgarit',
    grade: 'Lớp 11 · Giải tích',
    category: 'Lượng giác & Mũ',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Khái niệm $\\log_a b$, điều kiện tồn tại ($0 < a \\neq 1, b > 0$), lôgarit thập phân $\\log$, lôgarit tự nhiên $\\ln$ và các quy tắc tách – gộp – đổi cơ số.',
    mnemonics: ['Tích thành tổng ($\\log_a(xy) = \\log_a x + \\log_a y$), thương thành hiệu, hạ mũ từ trên xuống tử, từ dưới cơ số xuống mẫu $\\log_{a^\\alpha} b^\\beta = \\frac{\\beta}{\\alpha}\\log_a b$.'],
    commonTraps: ['Tách $\\log_a(x^2) = 2\\log_a x$ mà quên trị tuyệt đối $2\\log_a |x|$ khi chưa biết $x > 0$.'],
    theory: ['1. $\\log_a b = \\alpha \\iff a^\\alpha = b$ ($0 < a \\neq 1, b > 0$).', '2. Quy tắc đổi cơ số: $\\log_a b = \\frac{\\log_c b}{\\log_c a} = \\frac{1}{\\log_b a}$.'],
    keyFormulas: ['\\log_a(bc) = \\log_a b + \\log_a c', '\\log_{a^\\alpha} b^\\beta = \\frac{\\beta}{\\alpha}\\log_a b', '\\log_a b = \\frac{\\ln b}{\\ln a}'],
    flashcards: [{ front: 'Tính $2^{\\log_2 5} + \\log_4 16$?', back: '$2^{\\log_2 5} = 5$ và $\\log_4 16 = 2 \\implies 5 + 2 = 7$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 19',
        question: 'Với $a > 0, a \\neq 1$, giá trị $\\log_{a^2}(a^5)$ bằng:',
        options: ['A. $\\frac{5}{2}$', 'B. $\\frac{2}{5}$', 'C. $10$', 'D. $3$'],
        correctIndex: 0,
        explanation: '$\\log_{a^2}(a^5) = \\frac{5}{2}\\log_a a = \\frac{5}{2}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Độ pH dung dịch',
        question: 'Tính độ $\\text{pH} = -\\log[\\text{H}^+]$ của dung dịch có nồng độ $[\\text{H}^+] = 10^{-4{,}5}\\text{ mol/l}$.',
        hints: ['Thay trực tiếp vào công thức $\\log(10^k) = k$.'],
        solutionSteps: ['Bước 1: $\\text{pH} = -\\log(10^{-4{,}5}) = -(-4{,}5) = 4{,}5$.'],
        finalAnswer: '$\\text{pH} = 4{,}5$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'logarithmic', params: { a: 1, b: 1, c: 0, d: 0 }, color: '#0ea5e9', name: 'y = ln(x)' }
  },
  {
    id: 'math-8',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 20,
    stageLabel: 'Chương VI · Hàm Số Mũ & Hàm Số Lôgarit',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 20',
    title: 'Bài 20: Hàm số mũ và hàm số lôgarit',
    grade: 'Lớp 11 · Giải tích',
    category: 'Lượng giác & Mũ',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Tập xác định, tập giá trị, sự biến thiên (đồng biến khi $a>1$, nghịch biến khi $0<a<1$), tiệm cận và đối xứng qua $y=x$ giữa $y=a^x$ và $y=\\log_a x$.',
    mnemonics: ['$y = a^x$ đi qua $(0;1)$, nhận $Ox$ làm TCN; $y = \\log_a x$ đi qua $(1;0)$, nhận $Oy$ làm TCĐ.'],
    commonTraps: ['Nhầm tiệm cận ngang $Ox$ của hàm mũ với tiệm cận đứng $Oy$ của hàm lôgarit.'],
    theory: ['1. $y = a^x$: TXĐ $\\mathbb{R}$, TGT $(0; +\\infty)$, đồng biến nếu $a>1$, nghịch biến nếu $0<a<1$.', '2. $y = \\log_a x$: TXĐ $(0; +\\infty)$, TGT $\\mathbb{R}$, đối xứng với $y=a^x$ qua đường thẳng $y = x$.'],
    keyFormulas: ['y = a^x > 0\\ (\\forall x\\in\\mathbb{R})', 'y = \\log_a x \\text{ xác định } \\iff x > 0'],
    flashcards: [{ front: 'Hàm $y = (0{,}8)^x$ đồng biến hay nghịch biến?', back: 'Vì $0 < 0{,}8 < 1$ nên hàm số nghịch biến trên $\\mathbb{R}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 20',
        question: 'Đồ thị hàm số $y = 2^x$ luôn đi qua điểm nào sau đây?',
        options: ['A. $(0; 1)$', 'B. $(1; 0)$', 'C. $(0; 2)$', 'D. $(2; 2)$'],
        correctIndex: 0,
        explanation: 'Với $x = 0$, $y = 2^0 = 1$, nên đi qua $(0; 1)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Lãi kép ngân hàng',
        question: 'Gửi $100$ triệu đồng lãi kép $6\\%$/năm. Viết hàm số tiền $A(t)$ sau $t$ năm và tính số tiền sau $5$ năm.',
        hints: ['$A(t) = P(1+r)^t$.'],
        solutionSteps: ['Bước 1: $A(t) = 100(1{,}06)^t$.', 'Bước 2: $A(5) = 100(1{,}06)^5 \\approx 133{,}82$ triệu đồng.'],
        finalAnswer: '$133{,}82$ triệu đồng.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'exponential', params: { a: 1, b: 0.693, c: 0, d: 0 }, color: '#ec4899', name: 'y = 2^x' }
  },
  {
    id: 'math-11-b21',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 21,
    stageLabel: 'Chương VI · Hàm Số Mũ & Hàm Số Lôgarit',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 21',
    title: 'Bài 21: Phương trình, bất phương trình mũ và lôgarit',
    grade: 'Lớp 11 · Giải tích',
    category: 'Lượng giác & Mũ',
    difficulty: 'Vận dụng',
    readTimeMinutes: 19,
    description: 'Giải phương trình & bất phương trình mũ – lôgarit cơ bản (cùng cơ số, lôgarit hóa, đặt ẩn phụ), lưu ý đổi chiều khi $0 < a < 1$ và điều kiện $f(x) > 0$.',
    mnemonics: ['Cơ số $0<a<1$: BỎ MŨ/LÔGARIT PHẢI ĐỔI CHIỀU BPT; với $\\log_a f(x) < b$ khi $a>1$ nhớ chặn $0 < f(x) < a^b$.'],
    commonTraps: ['Quên điều kiện $f(x) > 0$ khi giải $\\log_{1/2} f(x) > 2 \\implies 0 < f(x) < \\frac{1}{4}$.'],
    theory: ['1. $a^x = b \\ (b>0) \\iff x = \\log_a b$.', '2. $\\log_a f(x) = b \\iff f(x) = a^b$ (tự động dương).', '3. Đổi chiều bất đẳng thức khi $0 < a < 1$.'],
    keyFormulas: ['a^{f(x)} > a^{g(x)} \\iff (a-1)(f(x)-g(x)) > 0'],
    flashcards: [{ front: 'Giải bất phương trình $\\log_{0{,}5}(x-1) \\ge -2$?', back: '$0 < x - 1 \\le (0{,}5)^{-2} = 4 \\iff 1 < x \\le 5$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 21',
        question: 'Tập nghiệm của bất phương trình $2^{x-1} > 8$ là:',
        options: ['A. $(4; +\\infty)$', 'B. $(3; +\\infty)$', 'C. $(-\\infty; 4)$', 'D. $[4; +\\infty)$'],
        correctIndex: 0,
        explanation: '$2^{x-1} > 2^3 \\iff x - 1 > 3 \\iff x > 4$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Phương trình lôgarit',
        question: 'Giải phương trình $\\log_2(x-1) + \\log_2(x+1) = 3$.',
        hints: ['Đặt ĐK $x > 1$ trước khi gộp tổng lôgarit thành tích.'],
        solutionSteps: ['Bước 1: ĐK $x > 1$. PT $\\iff \\log_2(x^2-1) = 3 \\iff x^2 - 1 = 8 \\iff x^2 = 9$.', 'Bước 2: Kết hợp ĐK $x > 1 \\implies x = 3$.'],
        finalAnswer: '$x = 3$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'exponential', params: { a: 1, b: 0.693, c: 0, d: 0 }, color: '#ec4899', name: 'y = 2^x' }
  },
  // CHƯƠNG VII: QUAN HỆ VUÔNG GÓC TRONG KHÔNG GIAN
  {
    id: 'math-11-b22',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 22,
    stageLabel: 'Chương VII · Quan Hệ Vuông Góc Trong Không Gian',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 22',
    title: 'Bài 22: Hai đường thẳng vuông góc',
    grade: 'Lớp 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description: 'Góc giữa hai đường thẳng trong không gian ($0^\\circ \\le \\varphi \\le 90^\\circ$) bằng cách tịnh tiến về cùng gốc và tính chất hai đường thẳng vuông góc.',
    mnemonics: ['Đưa hai đường thẳng chéo nhau về cùng đi qua 1 điểm bằng phép song song, dùng Định lí Côsin để tính $\\cos\\varphi \\ge 0$.'],
    commonTraps: ['Kết luận góc giữa hai đường thẳng là góc tù $> 90^\\circ$ (góc giữa 2 đường thẳng luôn $\\le 90^\\circ$).'],
    theory: ['1. $(a, b) = (a\', b\')$ với $a\' \\parallel a, b\' \\parallel b$ cắt nhau tại $O$.', '2. $a \\perp b \\iff (a, b) = 90^\\circ$ (kể cả khi $a, b$ chéo nhau).'],
    keyFormulas: ['0^\\circ \\le (a, b) \\le 90^\\circ', '\\cos(a, b) = |\\cos(\\vec{u}_a, \\vec{u}_b)|'],
    flashcards: [{ front: 'Trong hình lập phương $ABCD.A\'B\'C\'D\'$, góc giữa $AB$ và $B\'D\'$ bằng bao nhiêu?', back: 'Vì $B\'D\' \\parallel BD$ nên $(AB, B\'D\') = (AB, BD) = \\widehat{ABD} = 45^\\circ$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 22',
        question: 'Trong tứ diện đều $ABCD$, góc giữa hai cạnh đối $AB$ và $CD$ bằng:',
        options: ['A. $90^\\circ$', 'B. $60^\\circ$', 'C. $45^\\circ$', 'D. $30^\\circ$'],
        correctIndex: 0,
        explanation: 'Gọi $M$ là trung điểm $CD$: $AM \\perp CD$ và $BM \\perp CD \\implies CD \\perp (ABM) \\implies CD \\perp AB$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Góc trong hình chóp',
        question: 'Cho hình chóp $S.ABCD$ đáy hình vuông cạnh $a$, các cạnh bên bằng $a$. Tính góc giữa $SA$ và $CD$.',
        hints: ['Vì $CD \\parallel AB$, góc $(SA, CD) = (SA, AB)$.'],
        solutionSteps: ['Bước 1: $CD \\parallel AB \\implies (SA, CD) = (SA, AB) = \\widehat{SAB}$.', 'Bước 2: $\\triangle SAB$ có 3 cạnh bằng $a$ (đều) $\\implies \\widehat{SAB} = 60^\\circ$.'],
        finalAnswer: '$60^\\circ$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  {
    id: 'math-11-4',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 23,
    stageLabel: 'Chương VII · Quan Hệ Vuông Góc Trong Không Gian',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 23',
    title: 'Bài 23: Đường thẳng vuông góc với mặt phẳng',
    grade: 'Lớp 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 19,
    description: 'Điều kiện $d \\perp (P)$ (vuông góc với hai đường thẳng cắt nhau trong $(P)$), Định lí ba đường vuông góc và liên hệ song song – vuông góc.',
    mnemonics: ['Muốn $d \\perp (P)$, tìm $a, b \\subset (P)$ cắt nhau mà $d \\perp a, d \\perp b$. Định lí 3 đường vuông góc: $b \\perp a\' \\iff b \\perp a$.'],
    commonTraps: ['Chỉ chứng minh $d$ vuông góc với 1 đường thẳng trong $(P)$ hoặc 2 đường thẳng song song đã kết luận $d \\perp (P)$.'],
    theory: ['1. $d \\perp a, d \\perp b$ ($a, b \\subset (P), a\\cap b = I$) $\\implies d \\perp (P)$.', '2. $d \\perp (P) \\implies d$ vuông góc với MỌI đường thẳng nằm trong $(P)$.'],
    keyFormulas: ['\\left.\\begin{matrix} d \\perp a, d \\perp b \\\\ a, b \\subset (P), a \\cap b = I \\end{matrix}\\right\\} \\implies d \\perp (P)'],
    flashcards: [{ front: 'Phát biểu Định lí ba đường vuông góc?', back: 'Đường thẳng $b \\subset (P)$ vuông góc với đường xiên $a \\iff b$ vuông góc với hình chiếu $a\'$ của $a$ trên $(P)$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 23',
        question: 'Cho hình chóp $S.ABCD$ có $SA \\perp (ABCD)$ và đáy $ABCD$ là hình vuông. Khẳng định nào sau đây đúng?',
        options: ['A. $BD \\perp (SAC)$', 'B. $AC \\perp (SBD)$', 'C. $BC \\perp (SAB)$ đúng nhưng $BD \\perp (SAC)$ sai', 'D. $AB \\perp (SAC)$'],
        correctIndex: 0,
        explanation: '$BD \\perp AC$ (2 đường chéo hình vuông) và $BD \\perp SA$ (do $SA \\perp (ABCD)$) $\\implies BD \\perp (SAC)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Chứng minh vuông góc',
        question: 'Cho hình chóp $S.ABC$ có $SA \\perp (ABC)$ và $\\triangle ABC$ vuông tại $B$. Kẻ $AH \\perp SB$ ($H \\in SB$). Chứng minh $AH \\perp (SBC)$.',
        hints: ['Chứng minh $BC \\perp (SAB)$ trước để suy ra $BC \\perp AH$.'],
        solutionSteps: ['Bước 1: $BC \\perp AB, BC \\perp SA \\implies BC \\perp (SAB) \\implies BC \\perp AH$.', 'Bước 2: Có $AH \\perp SB$ và $AH \\perp BC$ nên $AH \\perp (SBC)$.'],
        finalAnswer: '$AH \\perp (SBC)$ (đpcm).'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  {
    id: 'math-11-b24',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 24,
    stageLabel: 'Chương VII · Quan Hệ Vuông Góc Trong Không Gian',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 24',
    title: 'Bài 24: Phép chiếu vuông góc. Góc giữa đường thẳng và mặt phẳng',
    grade: 'Lớp 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Phép chiếu vuông góc lên mặt phẳng và quy trình 3 bước xác định góc giữa đường thẳng $d$ và mặt phẳng $(P)$ (góc giữa $d$ và hình chiếu $d\'$).',
    mnemonics: ['3 bước tìm $(SA, (ABC))$: (1) Giao điểm $A$; (2) Chân đường cao $H$ từ $S$ xuống $(ABC)$; (3) Nối $AH \\implies \\varphi = \\widehat{SAH}$.'],
    commonTraps: ['Chọn nhầm chân đường cao không vuông góc với $(P)$ khiến tam giác $SAH$ không vuông tại $H$.'],
    theory: [
      '1. Phép chiếu vuông góc lên mặt phẳng $(P)$: Là phép chiếu song song theo phương đường thẳng vuông góc với $(P)$. Hình chiếu vuông góc của điểm $S$ là chân đường cao $H$ ($SH \\perp (P)$).',
      '2. Góc giữa đường thẳng $d$ và mặt phẳng $(P)$: Nếu $d \\perp (P)$ thì $(d, (P)) = 90^\\circ$; nếu $d$ không vuông góc $(P)$ thì $(d, (P)) = (d, d\')$ với $d\'$ là hình chiếu vuông góc của $d$ lên $(P)$, luôn thuộc $[0^\\circ; 90^\\circ]$.',
      '3. Công thức tính nhanh: Với đoạn $SA$ cắt $(P)$ tại $A$ và $SH \\perp (P)$, ta có $\\sin\\varphi = \\frac{SH}{SA} = \\frac{d(S, (P))}{SA}$ và $\\tan\\varphi = \\frac{SH}{AH}$.'
    ],
    keyFormulas: ['\\sin(d, (P)) = \\frac{d(S, (P))}{SA}'],
    flashcards: [{ front: 'Nếu $d \\parallel (P)$ hoặc $d \\subset (P)$ thì góc $(d, (P))$ bằng bao nhiêu?', back: 'Bằng $0^\\circ$. Nếu $d \\perp (P)$ thì bằng $90^\\circ$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 24',
        question: 'Cho hình chóp $S.ABC$ có $SA \\perp (ABC)$, $SA = a\\sqrt{3}$, $AB = a$. Góc giữa $SB$ và $(ABC)$ bằng:',
        options: ['A. $60^\\circ$', 'B. $30^\\circ$', 'C. $45^\\circ$', 'D. $90^\\circ$'],
        correctIndex: 0,
        explanation: '$\\tan\\widehat{SBA} = \\frac{SA}{AB} = \\sqrt{3} \\implies \\widehat{SBA} = 60^\\circ$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Góc đường thẳng - mặt phẳng',
        question: 'Cho hình chóp $S.ABCD$ đáy hình vuông cạnh $a$, $SA \\perp (ABCD)$ và $SA = a\\sqrt{2}$. Tính góc giữa $SC$ và $(ABCD)$.',
        hints: ['Hình chiếu của $SC$ lên $(ABCD)$ là $AC = a\\sqrt{2}$.'],
        solutionSteps: ['Bước 1: $(SC, (ABCD)) = \\widehat{SCA}$.', 'Bước 2: $\\tan\\widehat{SCA} = \\frac{SA}{AC} = \\frac{a\\sqrt{2}}{a\\sqrt{2}} = 1 \\implies \\widehat{SCA} = 45^\\circ$.'],
        finalAnswer: '$45^\\circ$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  {
    id: 'math-11-b25',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 25,
    stageLabel: 'Chương VII · Quan Hệ Vuông Góc Trong Không Gian',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 25',
    title: 'Bài 25: Hai mặt phẳng vuông góc',
    grade: 'Lớp 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 19,
    description: 'Góc nhị diện $[P, d, Q]$ (khái niệm mới GDPT 2018), góc giữa hai mặt phẳng, điều kiện $(P) \\perp (Q)$ và hình lăng trụ đứng, hình hộp chữ nhật, hình lập phương.',
    mnemonics: ['$(P) \\perp (Q)$ khi $(P)$ chứa 1 đường thẳng vuông góc với $(Q)$. Giao tuyến của 2 mặt phẳng cùng vuông góc với $(R)$ thì $\\perp (R)$.'],
    commonTraps: ['Nhầm góc nhị diện (có thể tù $0^\\circ < \\alpha < 180^\\circ$) với góc giữa hai mặt phẳng (luôn $\\le 90^\\circ$).'],
    theory: ['1. Góc phẳng nhị diện $[P, d, Q]$: dựng $Ox \\subset (P)$ và $Oy \\subset (Q)$ cùng vuông góc với cạnh $d$ tại $O$; số đo từ $0^\\circ$ đến $180^\\circ$.', '2. $(P) \\perp (Q)$ theo giao tuyến $\\Delta$, đường thẳng $a \\subset (P)$ mà $a \\perp \\Delta \\implies a \\perp (Q)$.'],
    keyFormulas: ['0^\\circ \\le \\text{góc nhị diện } [P, d, Q] \\le 180^\\circ', '0^\\circ \\le ((P), (Q)) \\le 90^\\circ'],
    flashcards: [{ front: 'Cách xác định góc phẳng nhị diện $[S, BC, A]$ khi $SA \\perp (ABC)$?', back: 'Từ $A$ kẻ $AK \\perp BC$, nối $SK$ (theo định lí 3 đường vuông góc $SK \\perp BC$) $\\implies$ góc phẳng nhị diện là $\\widehat{SKA}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 25',
        question: 'Cho hình chóp $S.ABC$ có $SA \\perp (ABC)$, đáy $ABC$ vuông tại $B$. Mặt phẳng $(SAB)$ vuông góc với mặt phẳng nào?',
        options: ['A. $(SBC)$ và $(ABC)$', 'B. Chỉ $(ABC)$', 'C. $(SAC)$', 'D. Không vuông góc mặt nào'],
        correctIndex: 0,
        explanation: '$SA \\perp (ABC) \\implies (SAB) \\perp (ABC)$; và $BC \\perp (SAB) \\implies (SBC) \\perp (SAB)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Góc nhị diện',
        question: 'Cho hình chóp $S.ABCD$ đáy hình vuông cạnh $a$, $SA \\perp (ABCD)$, $SA = a$. Tính số đo góc nhị diện $[S, CD, A]$.',
        hints: ['Tại $D$, $AD \\perp CD$ và $SD \\perp CD$.'],
        solutionSteps: ['Bước 1: $CD \\perp AD, CD \\perp SA \\implies CD \\perp SD$. Góc phẳng nhị diện là $\\widehat{SDA}$.', 'Bước 2: $\\tan\\widehat{SDA} = \\frac{SA}{AD} = 1 \\implies \\widehat{SDA} = 45^\\circ$.'],
        finalAnswer: '$45^\\circ$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  {
    id: 'math-11-b26',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 26,
    stageLabel: 'Chương VII · Quan Hệ Vuông Góc Trong Không Gian',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 26',
    title: 'Bài 26: Khoảng cách',
    grade: 'Lớp 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 20,
    description: 'Khoảng cách từ điểm đến đường thẳng/mặt phẳng, đổi điểm về chân đường cao và khoảng cách giữa hai đường thẳng chéo nhau qua đoạn vuông góc chung hoặc mặt phẳng song song.',
    mnemonics: ['3 bước dựng $d(H, (SBC))$ từ chân đường cao $H$: Kẻ $HK \\perp BC$, nối $SK$, kẻ $HI \\perp SK \\implies d = HI$, $\\frac{1}{HI^2} = \\frac{1}{SH^2} + \\frac{1}{HK^2}$.'],
    commonTraps: ['Tính trực tiếp từ điểm lơ lửng $M$ thay vì chuyển về chân đường cao $H$ bằng tỉ lệ $\\frac{d(M,(P))}{d(H,(P))} = \\frac{MA}{HA}$.'],
    theory: ['1. $d(a, b)$ với $a, b$ chéo nhau bằng độ dài đoạn vuông góc chung, hoặc bằng $d(a, (P))$ với $b \\subset (P), a \\parallel (P)$.', '2. Đổi điểm: $MH \\cap (P) = A \\implies \\frac{d(M,(P))}{d(H,(P))} = \\frac{MA}{HA}$.'],
    keyFormulas: ['\\frac{1}{d^2} = \\frac{1}{SH^2} + \\frac{1}{HK^2}', 'd(a, b) = d(a, (P))\\ (b\\subset (P), a\\parallel (P))'],
    flashcards: [{ front: 'Tính khoảng cách từ $A$ đến $(SBC)$ khi $SA \\perp (ABC)$ tại $A$, $\\triangle ABC$ vuông cân tại $B$ cạnh $a$, $SA = a$?', back: '$AB \\perp BC \\implies K \\equiv B$, kẻ $AI \\perp SB \\implies d = \\frac{SA\\cdot AB}{\\sqrt{SA^2+AB^2}} = \\frac{a\\sqrt{2}}{2}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 26',
        question: 'Cho hình lập phương $ABCD.A\'B\'C\'D\'$ cạnh $a$. Khoảng cách giữa hai đường thẳng chéo nhau $AB$ và $C\'D\'$ là bao nhiêu?',
        options: ['A. $a\\sqrt{2}$ (nếu $AB\\parallel C\'D\'$ sai!)', 'B. $AB$ và $C\'D\'$ song song; khoảng cách giữa $AA\'$ và $BC$ bằng $a$', 'C. $a$', 'D. $\\frac{a\\sqrt{2}}{2}$'],
        correctIndex: 1,
        explanation: 'Chú ý $AB \\parallel C\'D\'$ nên chúng đồng phẳng; với cặp chéo nhau $AA\'$ và $BC$, đoạn vuông góc chung là $AB = a$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Khoảng cách chéo nhau',
        question: 'Cho hình chóp $S.ABCD$ đáy hình vuông cạnh $a$, $SA \\perp (ABCD)$ và $SA = a$. Tính khoảng cách giữa $SA$ và $BD$.',
        hints: ['Gọi $O = AC \\cap BD$. Chứng minh $AO$ là đoạn vuông góc chung của $SA$ và $BD$.'],
        solutionSteps: ['Bước 1: $AO \\perp SA$ (vì $SA \\perp (ABCD)$) và $AO \\perp BD$ (2 đường chéo hình vuông).', 'Bước 2: Vậy $d(SA, BD) = AO = \\frac{a\\sqrt{2}}{2}$.'],
        finalAnswer: '$\\frac{a\\sqrt{2}}{2}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  {
    id: 'math-7',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 27,
    stageLabel: 'Chương VII · Quan Hệ Vuông Góc Trong Không Gian',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 27',
    title: 'Bài 27: Thể tích (Khối chóp, Khối lăng trụ & Khối chóp cụt đều)',
    grade: 'Lớp 11 · Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 18,
    description: 'Trong GDPT 2018, Thể tích khối đa diện chuyển sang Lớp 11: $V_{\\text{chóp}} = \\frac{1}{3} S_{\\text{đáy}} h$, $V_{\\text{lăng trụ}} = S_{\\text{đáy}} h$, và công thức mới $V_{\\text{chóp cụt đều}} = \\frac{1}{3}h(S + \\sqrt{SS\'} + S\')$.',
    mnemonics: ['Chóp có $\\frac{1}{3}$, Lăng trụ không có $\\frac{1}{3}$, Chóp cụt đều nhớ $\\frac{1}{3}h(S + \\sqrt{SS\'} + S\')$.'],
    commonTraps: ['Quên hệ số $\\frac{1}{3}$ ở thể tích khối chóp hoặc nhầm $\\sqrt{SS\'}$ trong chóp cụt đều.'],
    theory: ['1. $V_{\\text{chóp}} = \\frac{1}{3} S h$; $V_{\\text{lăng trụ}} = S h$.', '2. Chóp cụt đều: $V = \\frac{1}{3} h (S + \\sqrt{SS\'} + S\')$.', '3. Tỉ số thể tích Simson: $\\frac{V_{S.A\'B\'C\'}}{V_{S.ABC}} = \\frac{SA\'}{SA}\\cdot\\frac{SB\'}{SB}\\cdot\\frac{SC\'}{SC}$.'],
    keyFormulas: ['V_{\\text{chóp}} = \\frac{1}{3} S_{\\text{đáy}}\\cdot h', 'V_{\\text{lăng trụ}} = S_{\\text{đáy}}\\cdot h', 'V_{\\text{cụt}} = \\frac{1}{3}h(S + \\sqrt{SS\'} + S\')'],
    flashcards: [{ front: 'Thể tích tứ diện đều cạnh $a$ là bao nhiêu?', back: '$V = \\frac{a^3\\sqrt{2}}{12}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 27',
        question: 'Cho hình chóp cụt tứ giác đều có hai cạnh đáy bằng $2a$ và $4a$, chiều cao $h = 3a$. Thể tích khối chóp cụt đều là:',
        options: ['A. $28a^3$', 'B. $20a^3$', 'C. $84a^3$', 'D. $12a^3$'],
        correctIndex: 0,
        explanation: '$S = 16a^2, S\' = 4a^2, \\sqrt{SS\'} = 8a^2 \\implies V = \\frac{1}{3}(3a)(16a^2 + 8a^2 + 4a^2) = 28a^3$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Thể tích lăng trụ',
        question: 'Cho lăng trụ đứng $ABC.A\'B\'C\'$ có đáy $ABC$ là tam giác đều cạnh $a$, cạnh bên $AA\' = a\\sqrt{3}$. Tính thể tích khối lăng trụ.',
        hints: ['$S_{\\triangle\\text{đều}} = \\frac{a^2\\sqrt{3}}{4}$.'],
        solutionSteps: ['Bước 1: $V = S_{ABC} \\cdot AA\' = \\frac{a^2\\sqrt{3}}{4} \\cdot a\\sqrt{3} = \\frac{3a^3}{4}$.'],
        finalAnswer: '$V = \\frac{3a^3}{4}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section'
  },
  // CHƯƠNG VIII: CÁC QUY TẮC TÍNH XÁC SUẤT
  {
    id: 'math-12',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 28,
    stageLabel: 'Chương VIII · Các Quy Tắc Tính Xác Suất',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 28',
    title: 'Bài 28: Biến cố hợp, biến cố giao, biến cố độc lập',
    grade: 'Lớp 11 · Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 15,
    description: 'Nhận biết biến cố hợp $A \\cup B$ (ít nhất 1 xảy ra), biến cố giao $A \\cap B$ (cả 2 cùng xảy ra), biến cố xung khắc ($A \\cap B = \\emptyset$) và biến cố độc lập.',
    mnemonics: ['"Hoặc" là Hợp ($A\\cup B$); "Và / Đồng thời" là Giao ($A\\cap B$); Xung khắc $\\neq$ Độc lập!'],
    commonTraps: ['Nhầm hai biến cố xung khắc là độc lập (hai biến cố xung khắc xác suất $>0$ KHÔNG BAO GIỜ độc lập).'],
    theory: ['1. $A \\cup B$: $A$ hoặc $B$ xảy ra.', '2. $A \\cap B$: cả $A$ và $B$ cùng xảy ra.', '3. $A, B$ độc lập khi việc xảy ra biến cố này không làm thay đổi xác suất biến cố kia.'],
    keyFormulas: ['A \\cap B = \\emptyset \\implies A, B \\text{ xung khắc}'],
    flashcards: [{ front: 'Nếu $A, B$ độc lập thì cặp $\\bar{A}$ và $B$ có độc lập không?', back: 'Có! Cả 4 cặp $(A,B), (\\bar{A},B), (A,\\bar{B}), (\\bar{A},\\bar{B})$ đều độc lập.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 28',
        question: 'Rút ngẫu nhiên 1 lá bài từ bộ 52 lá. Gọi $A$: "được lá cơ", $B$: "được lá K". Biến cố $A \\cap B$ là:',
        options: ['A. Rút được lá K cơ', 'B. Rút được lá cơ hoặc lá K', 'C. Rút được lá đen', 'D. Biến cố không thể'],
        correctIndex: 0,
        explanation: 'Vừa là cơ vừa là K chính là lá K cơ ($A \\cap B$).'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Phân tích biến cố',
        question: 'Hai xạ thủ cùng bắn độc lập vào bia. Gọi $A, B$ là biến cố xạ thủ 1, 2 bắn trúng. Diễn đạt biến cố "có đúng 1 người trúng" theo $A, B$.',
        hints: ['Hoặc 1 trúng 2 trượt, hoặc 1 trượt 2 trúng.'],
        solutionSteps: ['Bước 1: Biến cố $C = (A \\cap \\bar{B}) \\cup (\\bar{A} \\cap B)$.'],
        finalAnswer: '$(A \\cap \\bar{B}) \\cup (\\bar{A} \\cap B)$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '3.5*e^(-0.5*x*x)', params: { a: 3.5, b: 0, c: 1, d: 0 }, color: '#6366f1', name: 'Phân phối xác suất biến cố' }
  },
  {
    id: 'math-11-b29',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 29,
    stageLabel: 'Chương VIII · Các Quy Tắc Tính Xác Suất',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 29',
    title: 'Bài 29: Công thức cộng xác suất',
    grade: 'Lớp 11 · Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description: 'Công thức cộng tổng quát cho hai biến cố bất kì: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ (điểm mới trọng tâm GDPT 2018) và trường hợp xung khắc.',
    mnemonics: ['Trừ đi phần giao $P(A \\cap B)$ bị đếm trùng hai lần; chỉ bỏ $- P(A\\cap B)$ khi $A, B$ xung khắc!'],
    commonTraps: ['Dùng $P(A \\cup B) = P(A) + P(B)$ khi $A$ và $B$ KHÔNG xung khắc.'],
    theory: ['1. Tổng quát: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.', '2. Xung khắc ($A\\cap B = \\emptyset$): $P(A \\cup B) = P(A) + P(B)$.'],
    keyFormulas: ['P(A \\cup B) = P(A) + P(B) - P(A \\cap B)'],
    flashcards: [{ front: 'Cho $P(A)=0{,}5; P(B)=0{,}4; P(A\\cap B)=0{,}2$. Tính $P(A\\cup B)$?', back: '$0{,}5 + 0{,}4 - 0{,}2 = 0{,}7$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 29',
        question: 'Một lớp có $60\\%$ thích Toán, $50\\%$ thích Lí và $30\\%$ thích cả Toán và Lí. Tỉ lệ học sinh thích ít nhất 1 trong 2 môn là:',
        options: ['A. $80\\%$', 'B. $110\\%$', 'C. $90\\%$', 'D. $70\\%$'],
        correctIndex: 0,
        explanation: '$P(A\\cup B) = 0{,}6 + 0{,}5 - 0{,}3 = 0{,}8 = 80\\%$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Công thức cộng',
        question: 'Chọn ngẫu nhiên một số từ $1$ đến $20$. Tính xác suất số chọn được chia hết cho $2$ hoặc $3$.',
        hints: ['Đếm bội của 2, bội của 3 và trừ bội của 6.'],
        solutionSteps: ['Bước 1: $P(A) = 10/20, P(B) = 6/20, P(A\\cap B) = 3/20$.', 'Bước 2: $P(A\\cup B) = \\frac{10 + 6 - 3}{20} = \\frac{13}{20}$.'],
        finalAnswer: '$\\frac{13}{20}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '3.5*e^(-0.4*x*x)', params: { a: 3.5, b: 0, c: 1, d: 0 }, color: '#4f46e5', name: 'Xác suất hợp P(A ∪ B)' }
  },
  {
    id: 'math-11-b30',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 30,
    stageLabel: 'Chương VIII · Các Quy Tắc Tính Xác Suất',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 30',
    title: 'Bài 30: Công thức nhân xác suất cho hai biến cố độc lập',
    grade: 'Lớp 11 · Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description: 'Công thức $P(A \\cap B) = P(A) \\cdot P(B)$ khi $A, B$ độc lập, kết hợp biến cố đối để giải bài toán hệ thống linh kiện song song / nối tiếp và xác suất trúng đích.',
    mnemonics: ['Độc lập $\\implies P(A \\cap B) = P(A)\\cdot P(B)$; "ít nhất 1 thành công" = $1 - P(\\text{tất cả hỏng})$.'],
    commonTraps: ['Nhân xác suất các biến cố phụ thuộc (như rút không hoàn lại) như biến cố độc lập.'],
    theory: ['1. $A, B$ độc lập $\\iff P(A \\cap B) = P(A)\\cdot P(B)$.', '2. Mạch nối tiếp hoạt động $\\iff$ cả 2 cùng tốt; mạch song song hoạt động $\\iff$ ít nhất 1 nhánh tốt.'],
    keyFormulas: ['P(A \\cap B) = P(A)\\cdot P(B)\\ (A, B \\text{ độc lập})'],
    flashcards: [{ front: 'Xác suất $A, B$ trúng bia độc lập là $0{,}7$ và $0{,}8$. Xác suất có ít nhất 1 người trúng?', back: '$1 - (1-0{,}7)(1-0{,}8) = 1 - 0{,}06 = 0{,}94$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 30',
        question: 'Hai động cơ hoạt động độc lập với xác suất chạy tốt lần lượt là $0{,}9$ và $0{,}8$. Xác suất cả hai động cơ đều chạy tốt là:',
        options: ['A. $0{,}72$', 'B. $0{,}98$', 'C. $0{,}17$', 'D. $0{,}85$'],
        correctIndex: 0,
        explanation: '$P(A\\cap B) = 0{,}9 \\cdot 0{,}8 = 0{,}72$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Đề thi xác suất độc lập',
        question: 'Hai bệnh nhân điều trị độc lập với xác suất khỏi bệnh là $0{,}85$ và $0{,}75$. Tính xác suất có đúng $1$ người khỏi bệnh.',
        hints: ['$P = P(A)P(\\bar{B}) + P(\\bar{A})P(B)$.'],
        solutionSteps: ['Bước 1: $P = 0{,}85\\cdot 0{,}25 + 0{,}15\\cdot 0{,}75 = 0{,}2125 + 0{,}1125 = 0{,}325$.'],
        finalAnswer: '$0{,}325$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: { type: 'custom', customExpr: '4*e^(-0.6*x*x)', params: { a: 4, b: 0, c: 1, d: 0 }, color: '#0ea5e9', name: 'Xác suất độc lập P(A ∩ B)' }
  },
  // CHƯƠNG IX: ĐẠO HÀM
  {
    id: 'math-11-2',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 31,
    stageLabel: 'Chương IX · Đạo Hàm',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 31',
    title: 'Bài 31: Định nghĩa và ý nghĩa của đạo hàm',
    grade: 'Lớp 11 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 17,
    description: 'Định nghĩa $f\'(x_0) = \\lim_{x\\to x_0} \\frac{f(x)-f(x_0)}{x-x_0}$, ý nghĩa vật lí (vận tốc tức thời $v(t) = s\'(t)$) và ý nghĩa hình học (phương trình tiếp tuyến tại $M_0$).',
    mnemonics: ['Tiếp tuyến tại $M_0(x_0; y_0)$: $y = f\'(x_0)(x - x_0) + y_0$ — hệ số góc $k = f\'(x_0)$.'],
    commonTraps: ['Nhầm $x_0$ (hoành độ tiếp điểm) với giao điểm trục tung, hoặc quên kiểm tra tiếp tuyến trùng đường thẳng đã cho.'],
    theory: ['1. $v(t_0) = s\'(t_0)$; cường độ tức thời $I(t_0) = Q\'(t_0)$.', '2. Tiếp tuyến đồ thị $(C)$ tại $M_0(x_0; f(x_0))$: $y - f(x_0) = f\'(x_0)(x - x_0)$.'],
    keyFormulas: ['f\'(x_0) = \\lim_{x\\to x_0}\\frac{f(x)-f(x_0)}{x-x_0}', 'y = f\'(x_0)(x-x_0) + f(x_0)'],
    flashcards: [{ front: 'Hệ số góc tiếp tuyến của $(C): y = x^2$ tại $x_0 = 3$ là bao nhiêu?', back: '$y\' = 2x \\implies k = y\'(3) = 6$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 31',
        question: 'Một vật chuyển động theo phương trình $s(t) = t^3 - 3t^2 + 5t$ ($s$ mét, $t$ giây). Vận tốc tức thời tại $t = 2\\text{ s}$ bằng:',
        options: ['A. $5\\text{ m/s}$', 'B. $6\\text{ m/s}$', 'C. $12\\text{ m/s}$', 'D. $3\\text{ m/s}$'],
        correctIndex: 0,
        explanation: '$v(t) = s\'(t) = 3t^2 - 6t + 5 \\implies v(2) = 12 - 12 + 5 = 5\\text{ m/s}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Viết phương trình tiếp tuyến',
        question: 'Viết phương trình tiếp tuyến của đồ thị $y = x^3 - 3x + 1$ tại điểm có hoành độ $x_0 = 2$.',
        hints: ['Tính $y_0 = y(2)$ và $k = y\'(2)$.'],
        solutionSteps: ['Bước 1: $y_0 = 3$, $y\' = 3x^2 - 3 \\implies k = 9$.', 'Bước 2: Tiếp tuyến $y = 9(x - 2) + 3 = 9x - 15$.'],
        finalAnswer: '$y = 9x - 15$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: 0, c: -3, d: 1 }, showTangent: true, tangentX0: 2, color: '#f59e0b', name: 'Tiếp tuyến y = x³ - 3x + 1' }
  },
  {
    id: 'math-11-9',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 32,
    stageLabel: 'Chương IX · Đạo Hàm',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 32',
    title: 'Bài 32: Các quy tắc tính đạo hàm',
    grade: 'Lớp 11 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 19,
    description: 'Đạo hàm tổng, hiệu, tích, thương, đạo hàm hàm hợp $(f(u))\' = f\'(u)\\cdot u\'$, bảng đạo hàm lượng giác, hàm mũ $(e^x, a^x)$ và hàm lôgarit $(\\ln x, \\log_a x)$ (tích hợp từ CT 2018 vào Lớp 11).',
    mnemonics: ['Đạo hàm hàm hợp luôn nhân thêm $u\'$; trong GDPT 2018, $(e^u)\'=u\'e^u$, $(\\ln u)\'=\\frac{u\'}{u}$ học ngay ở Lớp 11!'],
    commonTraps: ['Quên nhân $u\'$ hoặc nhầm $(a^x)\' = a^x \\ln a$ với $(\\log_a x)\' = \\frac{1}{x \\ln a}$.'],
    theory: ['1. $(uv)\' = u\'v + uv\'$; $\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}$.', '2. Hàm mũ & Lôgarit: $(e^x)\' = e^x$, $(a^x)\' = a^x\\ln a$, $(\\ln x)\' = \\frac{1}{x}$, $(\\log_a x)\' = \\frac{1}{x\\ln a}$.', '3. Lượng giác: $(\\sin x)\'=\\cos x, (\\cos x)\'=-\\sin x, (\\tan x)\'=\\frac{1}{\\cos^2 x}$.'],
    keyFormulas: ['(f(u))\' = f\'(u)\\cdot u\'', '(e^u)\' = u\'e^u', '(\\ln u)\' = \\frac{u\'}{u}'],
    flashcards: [{ front: 'Đạo hàm của $y = \\ln(x^2 + 1)$ là?', back: '$y\' = \\frac{2x}{x^2+1}$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 32',
        question: 'Đạo hàm của hàm số $y = e^{2x} + \\sin 3x$ là:',
        options: ['A. $2e^{2x} + 3\\cos 3x$', 'B. $e^{2x} + \\cos 3x$', 'C. $2e^{2x} - 3\\cos 3x$', 'D. $2xe^{2x} + 3\\cos 3x$'],
        correctIndex: 0,
        explanation: 'Áp dụng hàm hợp: $(e^{2x})\' = 2e^{2x}$ và $(\\sin 3x)\' = 3\\cos 3x$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Giải bất phương trình đạo hàm',
        question: 'Tìm $x > 0$ để đạo hàm của $y = x\\ln x - 2x$ nhỏ hơn $0$.',
        hints: ['Tính $y\' = \\ln x + 1 - 2 = \\ln x - 1$.'],
        solutionSteps: ['Bước 1: $y\' = \\ln x - 1 < 0 \\iff \\ln x < 1 \\iff 0 < x < e$.'],
        finalAnswer: '$0 < x < e$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: -3, c: 0, d: 2 }, showTangent: true, tangentX0: 1, color: '#0284c7', name: 'Đạo hàm y = x³ - 3x² + 2' }
  },
  {
    id: 'math-11-b33',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    lessonNumber: 33,
    stageLabel: 'Chương IX · Đạo Hàm',
    sourceTag: 'SGK Toán 11 GDPT 2018 (KNTT) · Bài 33',
    title: 'Bài 33: Đạo hàm cấp hai',
    grade: 'Lớp 11 · Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 15,
    description: 'Khái niệm đạo hàm cấp hai $f\'\'(x) = (f\'(x))\'$, ý nghĩa cơ học (gia tốc tức thời $a(t) = v\'(t) = s\'\'(t)$) và ứng dụng dao động điều hòa.',
    mnemonics: ['Quãng đường $s(t) \\xrightarrow{\\text{đạo hàm}} v(t) \\xrightarrow{\\text{đạo hàm nữa}} a(t) = s\'\'(t)$.'],
    commonTraps: ['Tính $s\'\'(t)$ sai do đạo hàm hàm hợp lượng giác thiếu $\\omega^2$ trong $x(t) = A\\cos(\\omega t + \\varphi)$.'],
    theory: ['1. $f\'\'(x) = (f\'(x))\'$.', '2. Gia tốc tức thời tại thời điểm $t_0$: $a(t_0) = s\'\'(t_0)$.'],
    keyFormulas: ['a(t) = v\'(t) = s\'\'(t)', '(A\\cos(\\omega t + \\varphi))\'\' = -\\omega^2 A\\cos(\\omega t + \\varphi)'],
    flashcards: [{ front: 'Nếu $y = \\sin 2x$ thì $y\'\'$ bằng gì?', back: '$y\' = 2\\cos 2x \\implies y\'\' = -4\\sin 2x$.' }],
    sampleProblems: [
      {
        source: 'SGK Toán 11 KNTT · Bài 33',
        question: 'Một chất điểm chuyển động có phương trình $s(t) = t^4 - 2t^2 + 3t$. Gia tốc tại $t = 1\\text{ s}$ là:',
        options: ['A. $8\\text{ m/s}^2$', 'B. $4\\text{ m/s}^2$', 'C. $3\\text{ m/s}^2$', 'D. $12\\text{ m/s}^2$'],
        correctIndex: 0,
        explanation: '$v(t) = 4t^3 - 4t + 3 \\implies a(t) = 12t^2 - 4 \\implies a(1) = 8\\text{ m/s}^2$.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 11 KNTT · Chứng minh đẳng thức đạo hàm cấp 2',
        question: 'Cho $y = e^{2x} + e^{-2x}$. Chứng minh $y\'\' - 4y = 0$.',
        hints: ['Tính lần lượt $y\'$ rồi $y\'\'$.'],
        solutionSteps: ['Bước 1: $y\' = 2e^{2x} - 2e^{-2x}$.', 'Bước 2: $y\'\' = 4e^{2x} + 4e^{-2x} = 4y \\implies y\'\' - 4y = 0$.'],
        finalAnswer: '$y\'\' - 4y = 0$ (đpcm).'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'cubic', params: { a: 1, b: 0, c: -2, d: 0 }, showTangent: true, tangentX0: 1, color: '#8b5cf6', name: 'Đạo hàm cấp hai & Gia tốc' }
  }
];

