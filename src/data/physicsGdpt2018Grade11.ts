import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const SRC_11 = 'GDPT 2018 (Thông tư 32/2018) · Vật lí 11 (KNTT · Sở GD&ĐT)';

export const PHYSICS_GDPT_11_LESSONS: PhysicsLesson[] = [
  // ================= CHƯƠNG I. DAO ĐỘNG (BÀI 1 - 7) =================
  {
    id: 'phys-11-shm',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương I · Dao động',
    sourceTag: SRC_11,
    lessonNumber: 1,
    title: 'Bài 1: Dao động điều hòa',
    subtitle: 'Dao động cơ, dao động tuần hoàn, định nghĩa dao động điều hòa và đồ thị li độ – thời gian hình sin',
    description:
      'Làm quen với dao động cơ quanh vị trí cân bằng, dao động tự do và biểu diễn đồ thị li độ – thời gian dạng hình sin/cosin trong chương trình Vật lí 11 GDPT 2018.',
    theorySections: [
      {
        heading: '1. Dao động cơ và Dao động tuần hoàn',
        content:
          '• **Dao động cơ**: Chuyển động qua lại giới hạn quanh một vị trí xác định gọi là **vị trí cân bằng (VTCB)**.\n• **Dao động tuần hoàn**: Trạng thái chuyển động (vị trí và hướng vận tốc) được lặp lại như cũ sau những khoảng thời gian bằng nhau gọi là chu kì $T$.'
      },
      {
        heading: '2. Dao động điều hòa & Đồ thị (x – t)',
        content:
          '• **Dao động điều hòa** là dao động trong đó li độ $x$ của vật là một hàm côsin (hoặc sin) theo thời gian:\n$$x = A\\cos(\\omega t + \\varphi)$$\n• Đồ thị biểu diễn sự phụ thuộc của li độ $x$ vào thời gian $t$ là một **đường hình sin**.'
      }
    ],
    keyFormulas: ['x = A\\cos(\\omega t + \\varphi)', 'x \\in [-A; +A]'],
    ...SIM_PRESETS.spring,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Đồ thị biểu diễn li độ theo thời gian của một vật dao động điều hòa có dạng là đường gì?',
        options: ['A. Đường thẳng', 'B. Đường parabol', 'C. Đường hình sin', 'D. Đường tròn'],
        correctIndex: 2,
        explanation: 'Vì $x = A\\cos(\\omega t + \\varphi)$ là hàm điều hòa nên đồ thị $(x - t)$ có dạng đường hình sin.'
      },
      {
        source: SRC_11,
        question: 'Một vật dao động điều hòa với phương trình $x = 5\\cos(4\\pi t + \\frac{\\pi}{3})\\text{ (cm)}$. Quỹ đạo chuyển động của vật dài bao nhiêu?',
        options: ['A. 5 cm', 'B. 10 cm', 'C. 2,5 cm', 'D. 20 cm'],
        correctIndex: 1,
        explanation: 'Biên độ $A = 5\\text{ cm}$, chiều dài quỹ đạo $L = 2A = 10\\text{ cm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Cho phương trình dao động $x = 6\\cos(2\\pi t - \\frac{\\pi}{4})\\text{ (cm)}$. Xác định vị trí biên, VTCB và li độ tại thời điểm ban đầu $t = 0$.',
        hints: ['Thay $t = 0$ vào $x(t)$ để tính $x_0 = 6\\cos(-\\pi/4)$.'],
        solutionSteps: [
          'VTCB tại $x = 0$, hai vị trí biên tại $x = +6\\text{ cm}$ và $x = -6\\text{ cm}$.',
          'Tại $t = 0$: $x_0 = 6\\cos\\left(-\\frac{\\pi}{4}\\right) = 6 \\cdot \\frac{\\sqrt{2}}{2} = 3\\sqrt{2} \\approx 4{,}24\\text{ cm}$.'
        ],
        finalAnswer: 'Biên $\\pm 6\\text{ cm}$, VTCB $x=0$, $x_0 = 3\\sqrt{2}\\text{ cm}$.'
      }
    ]
  },
  {
    id: 'phys-11-b2',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương I · Dao động',
    sourceTag: SRC_11,
    lessonNumber: 2,
    title: 'Bài 2: Mô tả dao động điều hòa',
    subtitle: 'Biên độ A, chu kì T, tần số f, tần số góc ω, pha dao động (ωt + φ), pha ban đầu φ và độ lệch pha giữa hai dao động',
    description:
      'Giải mã đầy đủ các đại lượng đặc trưng trong phương trình $x = A\\cos(\\omega t + \\varphi)$ và cách xác định độ lệch pha $\\Delta\\varphi$ (cùng pha, ngược pha, vuông pha).',
    theorySections: [
      {
        heading: '1. Các đại lượng đặc trưng của dao động điều hòa',
        content:
          '• **Li độ ($x$)**: Tọa độ tính từ VTCB ($-A \\le x \\le A$).\n• **Biên độ ($A > 0$)**: Độ lớn li độ cực đại.\n• **Chu kì ($T$)**: Thời gian thực hiện 1 dao động toàn phần ($\\text{s}$); **Tần số ($f = 1/T$)**: Số dao động trong $1\\text{ s}$ ($\\text{Hz}$).\n• **Tần số góc ($\\omega$)**: $\\omega = \\frac{2\\pi}{T} = 2\\pi f$ ($\\text{rad/s}$).'
      },
      {
        heading: '2. Pha dao động & Độ lệch pha',
        content:
          '• **Pha dao động** tại thời điểm $t$: $(\\omega t + \\varphi)$ xác định trạng thái dao động; **Pha ban đầu** $\\varphi \\in [-\\pi; \\pi]$ xác định trạng thái lúc $t = 0$.\n• **Độ lệch pha** hai dao động cùng tần số: $\\Delta\\varphi = \\varphi_2 - \\varphi_1$ (cùng pha: $2k\\pi$; ngược pha: $(2k+1)\\pi$; vuông pha: $(k + \\frac{1}{2})\\pi$).'
      }
    ],
    keyFormulas: [
      '\\omega = \\frac{2\\pi}{T} = 2\\pi f',
      '\\Delta\\varphi = \\varphi_2 - \\varphi_1'
    ],
    ...SIM_PRESETS.spring,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Một vật thực hiện $120$ dao động toàn phần trong thời gian $1\\text{ phút}$. Chu kì và tần số góc của dao động là:',
        options: [
          'A. $T = 0{,}5\\text{ s};\\; \\omega = 4\\pi\\text{ rad/s}$',
          'B. $T = 2\\text{ s};\\; \\omega = \\pi\\text{ rad/s}$',
          'C. $T = 0{,}5\\text{ s};\\; \\omega = 2\\pi\\text{ rad/s}$',
          'D. $T = 1\\text{ s};\\; \\omega = 2\\pi\\text{ rad/s}$'
        ],
        correctIndex: 0,
        explanation: '$T = \\frac{60}{120} = 0{,}5\\text{ s} \\implies \\omega = \\frac{2\\pi}{0{,}5} = 4\\pi\\text{ rad/s}$.'
      },
      {
        source: SRC_11,
        question: 'Hai dao động $x_1 = 4\\cos(10t + \\frac{\\pi}{6})$ và $x_2 = 5\\cos(10t - \\frac{\\pi}{3})$ lệch pha nhau góc bao nhiêu?',
        options: ['A. Cùng pha', 'B. Ngược pha ($\\pi$)', 'C. Vuông pha ($\\pi/2$)', 'D. Lệch $\\pi/6$'],
        correctIndex: 2,
        explanation: '$\\Delta\\varphi = \\frac{\\pi}{6} - \\left(-\\frac{\\pi}{3}\\right) = \\frac{\\pi}{2}$ (vuông pha, $x_1$ sớm pha hơn $x_2$ góc $\\pi/2$).'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Đọc từ đồ thị thấy vật dao động điều hòa có biên độ $4\\text{ cm}$, thời gian ngắn nhất từ biên dương sang biên âm là $0{,}2\\text{ s}$ và tại $t = 0$ vật ở VTCB đi theo chiều âm. Viết phương trình dao động $x(t)$.',
        hints: ['Từ biên dương sang biên âm mất nửa chu kì $T/2$; qua VTCB theo chiều âm ứng với $\\varphi = +\\pi/2$.'],
        solutionSteps: [
          'Nửa chu kì $T/2 = 0{,}2\\text{ s} \\implies T = 0{,}4\\text{ s} \\implies \\omega = \\frac{2\\pi}{0{,}4} = 5\\pi\\text{ rad/s}$.',
          'Tại $t = 0$: $x = 0$ và $v < 0 \\implies \\varphi = +\\frac{\\pi}{2}$.',
          'Phương trình dao động: $x = 4\\cos\\left(5\\pi t + \\frac{\\pi}{2}\\right)\\text{ (cm)}$.'
        ],
        finalAnswer: '$x = 4\\cos(5\\pi t + \\frac{\\pi}{2})\\text{ (cm)}$.'
      }
    ]
  },
  {
    id: 'phys-11-b3',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương I · Dao động',
    sourceTag: SRC_11,
    lessonNumber: 3,
    title: 'Bài 3: Vận tốc, gia tốc trong dao động điều hòa',
    subtitle: 'Phương trình vận tốc v(t), gia tốc a = -ω²x, quan hệ pha π/2 và hệ thức độc lập thời gian',
    description:
      'Xây dựng công thức vận tốc tức thời $v = -\\omega A\\sin(\\omega t + \\varphi)$ và gia tốc $a = -\\omega^2 x$, vị trí cực đại – bằng 0 và các hệ thức độc lập thời gian.',
    theorySections: [
      {
        heading: '1. Vận tốc & Gia tốc trong dao động điều hòa',
        content:
          '• **Vận tốc**: $v = -\\omega A\\sin(\\omega t + \\varphi) = \\omega A\\cos\\left(\\omega t + \\varphi + \\frac{\\pi}{2}\\right)$ → nhanh pha $\\frac{\\pi}{2}$ so với $x$; $|v|_{\\max} = \\omega A$ tại VTCB, $v = 0$ tại biên.\n• **Gia tốc**: $a = -\\omega^2 A\\cos(\\omega t + \\varphi) = -\\omega^2 x$ → ngược pha với $x$, luôn hướng về VTCB; $|a|_{\\max} = \\omega^2 A$ tại biên, $a = 0$ tại VTCB.'
      },
      {
        heading: '2. Công thức độc lập thời gian',
        content:
          '• Liên hệ $x$ và $v$: $A^2 = x^2 + \\frac{v^2}{\\omega^2}$.\n• Liên hệ $v$ và $a$: $\\left(\\frac{v}{\\omega A}\\right)^2 + \\left(\\frac{a}{\\omega^2 A}\\right)^2 = 1$.'
      }
    ],
    keyFormulas: [
      'v_{\\max} = \\omega A, \\qquad a_{\\max} = \\omega^2 A, \\qquad a = -\\omega^2 x',
      'A^2 = x^2 + \\frac{v^2}{\\omega^2}'
    ],
    ...SIM_PRESETS.lissajous,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Trong dao động điều hòa, vectơ gia tốc $\\vec{a}$ luôn có đặc điểm gì?',
        options: [
          'A. Cùng chiều chuyển động',
          'B. Hướng ra xa vị trí cân bằng',
          'C. Luôn hướng về vị trí cân bằng và tỉ lệ độ lớn với li độ $|x|$',
          'D. Không đổi về độ lớn'
        ],
        correctIndex: 2,
        explanation: 'Vì $a = -\\omega^2 x$ luôn trái dấu $x$, vectơ gia tốc luôn hướng về gốc tọa độ (VTCB).'
      },
      {
        source: SRC_11,
        question: 'Một vật dao động điều hòa với $\\omega = 10\\text{ rad/s}$. Khi ở li độ $x = 3\\text{ cm}$ vật có tốc độ $v = 40\\text{ cm/s}$. Biên độ dao động là:',
        options: ['A. 5 cm', 'B. 7 cm', 'C. 4,5 cm', 'D. 10 cm'],
        correctIndex: 0,
        explanation: '$A = \\sqrt{x^2 + \\frac{v^2}{\\omega^2}} = \\sqrt{3^2 + (40/10)^2} = \\sqrt{9 + 16} = 5\\text{ cm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một vật dao động điều hòa theo phương trình $x = 8\\cos(5\\pi t)\\text{ (cm)}$. Tính tốc độ cực đại, gia tốc cực đại và tốc độ khi vật đi qua li độ $x = 4\\text{ cm}$.',
        hints: ['Tính $v_{\\max} = \\omega A$, $a_{\\max} = \\omega^2 A$, và $|v| = \\omega\\sqrt{A^2 - x^2}$.'],
        solutionSteps: [
          'Từ phương trình: $A = 8\\text{ cm} = 0{,}08\\text{ m}$, $\\omega = 5\\pi\\text{ rad/s}$.',
          '$v_{\\max} = \\omega A = 40\\pi \\approx 125{,}7\\text{ cm/s} \\approx 1{,}26\\text{ m/s}$.',
          '$a_{\\max} = \\omega^2 A = (5\\pi)^2 \\cdot 0{,}08 \\approx 19{,}74\\text{ m/s}^2$.',
          'Tại $x = 4\\text{ cm}$: $|v| = 5\\pi\\sqrt{8^2 - 4^2} = 20\\pi\\sqrt{3} \\approx 108{,}8\\text{ cm/s}$.'
        ],
        finalAnswer: '$v_{\\max} = 40\\pi\\text{ cm/s}$, $a_{\\max} = 2\\pi^2\\text{ m/s}^2$, $|v| = 20\\pi\\sqrt{3}\\text{ cm/s}$.'
      }
    ]
  },
  {
    id: 'phys-11-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương I · Dao động',
    sourceTag: SRC_11,
    lessonNumber: 4,
    title: 'Bài 4: Bài tập về dao động điều hòa',
    subtitle: 'Kỹ thuật đọc đồ thị dao động (x-t, v-t, a-t), tính quãng đường, thời gian giữa hai vị trí bất kỳ và viết phương trình dao động',
    description:
      'Hệ thống phương pháp giải nhanh bài tập dao động điều hòa: phân tích đồ thị tuần hoàn, đường tròn pha xác định thời gian ngắn nhất và công thức quãng đường.',
    theorySections: [
      {
        heading: '1. Kỹ thuật đọc đồ thị dao động',
        content:
          '• Từ đồ thị $(x - t)$: Đọc trực tiếp biên độ $A$ (đỉnh đồ thị), khoảng thời gian giữa 2 đỉnh liên tiếp là chu kì $T$, giá trị $x_0$ và chiều đi tại $t = 0$ để suy ra $\\varphi$.\n• Từ đồ thị $(v - t)$: Đỉnh cho $v_{\\max} = \\omega A$, khoảng lặp lại cho $T$.'
      },
      {
        heading: '2. Thời gian đặc biệt & Quãng đường dao động',
        content:
          '• Trong 1 chu kì $T$, vật đi được quãng đường $S = 4A$; trong $T/2$ đi được $2A$.\n• Thời gian đi từ VTCB ra $A/2$: $T/12$; từ $A/2$ ra $A$: $T/6$; từ VTCB ra $A$: $T/4$.'
      }
    ],
    keyFormulas: ['S_{1\\text{ chu kì}} = 4A, \\qquad S_{T/2} = 2A', '\\Delta t = \\frac{\\Delta\\alpha}{\\omega} = \\frac{\\Delta\\alpha}{2\\pi}T'],
    ...SIM_PRESETS.spring,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Một vật dao động điều hòa với biên độ $A = 6\\text{ cm}$, chu kì $T = 1{,}2\\text{ s}$. Thời gian ngắn nhất vật đi từ VTCB đến vị trí $x = 3\\text{ cm}$ là:',
        options: ['A. 0,1 s', 'B. 0,2 s', 'C. 0,3 s', 'D. 0,6 s'],
        correctIndex: 0,
        explanation: 'Đi từ $0$ đến $A/2 = 3\\text{ cm}$ hết $\\Delta t = T/12 = 1{,}2/12 = 0{,}1\\text{ s}$.'
      },
      {
        source: SRC_11,
        question: 'Trong thời gian $2{,}5$ chu kì, vật dao động điều hòa với biên độ $A = 4\\text{ cm}$ đi được quãng đường bằng:',
        options: ['A. 20 cm', 'B. 40 cm', 'C. 32 cm', 'D. 10 cm'],
        correctIndex: 1,
        explanation: '$S = 2{,}5 \\cdot 4A = 10 \\cdot 4 = 40\\text{ cm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Vật dao động điều hòa với $x = 10\\cos(4\\pi t - \\frac{\\pi}{2})\\text{ (cm)}$. Tính quãng đường vật đi được trong $0{,}75\\text{ s}$ đầu tiên kể từ $t = 0$.',
        hints: ['Tính chu kì $T = 2\\pi/(4\\pi) = 0{,}5\\text{ s}$, tách $0{,}75\\text{ s} = 1T + T/2$.'],
        solutionSteps: [
          'Chu kì: $T = \\frac{2\\pi}{4\\pi} = 0{,}5\\text{ s}$.',
          'Ta có $t = 0{,}75\\text{ s} = 1{,}5\\,T = T + \\frac{T}{2}$.',
          'Vì trong mỗi $T$ đi $4A$ và trong mỗi $T/2$ luôn đi đúng $2A$, tổng quãng đường là $S = 4A + 2A = 6A = 60\\text{ cm}$.'
        ],
        finalAnswer: '$S = 60\\text{ cm}$.'
      }
    ]
  },
  {
    id: 'phys-11-b5',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương I · Dao động',
    sourceTag: SRC_11,
    lessonNumber: 5,
    title: 'Bài 5: Động năng. Thế năng. Sự chuyển hóa năng lượng trong dao động điều hòa',
    subtitle: 'Động năng Wđ = ½mv², thế năng Wt = ½mω²x², cơ năng W = ½mω²A², chu kì biến thiên năng lượng T/2 và con lắc lò xo – con lắc đơn',
    description:
      'Khám phá sự biến thiên tuần hoàn với tần số $2f$ của động năng và thế năng, bảo toàn cơ năng con lắc lò xo ($k = m\\omega^2$) và con lắc đơn ($\\omega = \\sqrt{g/l}$).',
    theorySections: [
      {
        heading: '1. Động năng, Thế năng & Cơ năng',
        content:
          '• **Động năng**: $W_đ = \\frac{1}{2}m v^2 = \\frac{1}{2}m\\omega^2(A^2 - x^2)$.\n• **Thế năng**: $W_t = \\frac{1}{2}m\\omega^2 x^2$ (với con lắc lò xo: $W_t = \\frac{1}{2}k x^2$).\n• **Cơ năng** (bảo toàn khi không ma sát): $W = W_đ + W_t = \\frac{1}{2}m\\omega^2 A^2$ (tỉ lệ bình phương biên độ $A^2$).'
      },
      {
        heading: '2. Con lắc lò xo & Con lắc đơn (trong GDPT 2018)',
        content:
          '• Động năng và thế năng biến thiên tuần hoàn với tần số góc $2\\omega$ (tần số $2f$, chu kì $T/2$).\n• **Con lắc lò xo**: $\\omega = \\sqrt{\\frac{k}{m}}$, $T = 2\\pi\\sqrt{\\frac{m}{k}}$.\n• **Con lắc đơn** (góc nhỏ): $\\omega = \\sqrt{\\frac{g}{l}}$, $T = 2\\pi\\sqrt{\\frac{l}{g}}$.'
      }
    ],
    keyFormulas: [
      'W = \\frac{1}{2}m\\omega^2 A^2 = \\frac{1}{2}k A^2',
      'T_{\\text{lò xo}} = 2\\pi\\sqrt{\\frac{m}{k}}, \\qquad T_{\\text{đơn}} = 2\\pi\\sqrt{\\frac{l}{g}}'
    ],
    ...SIM_PRESETS.pendulum,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Khi biên độ dao động điều hòa tăng gấp đôi (giữ nguyên khối lượng và tần số), cơ năng của vật sẽ:',
        options: ['A. Tăng 2 lần', 'B. Tăng 4 lần', 'C. Giảm 2 lần', 'D. Không đổi'],
        correctIndex: 1,
        explanation: 'Vì $W = \\frac{1}{2}m\\omega^2 A^2$ tỉ lệ với $A^2$, khi $A$ tăng 2 lần thì $W$ tăng $2^2 = 4$ lần.'
      },
      {
        source: SRC_11,
        question: 'Tại vị trí nào trong dao động điều hòa thì động năng bằng thế năng ($W_đ = W_t$)?',
        options: ['A. $x = \\pm \\frac{A}{2}$', 'B. $x = \\pm \\frac{A}{\\sqrt{2}}$', 'C. $x = 0$', 'D. $x = \\pm A$'],
        correctIndex: 1,
        explanation: '$W = 2W_t \\iff \\frac{1}{2}kA^2 = 2 \\cdot \\frac{1}{2}kx^2 \\implies x = \\pm\\frac{A}{\\sqrt{2}}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một con lắc lò xo có độ cứng $k = 80\\text{ N/m}$, vật nặng $m = 0{,}2\\text{ kg}$ dao động điều hòa với biên độ $A = 5\\text{ cm}$. Tính cơ năng và tốc độ cực đại của vật.',
        hints: ['Đổi $A = 0{,}05\\text{ m}$, tính $W = \\frac{1}{2}kA^2$ và $v_{\\max} = \\sqrt{k/m}\\cdot A$.'],
        solutionSteps: [
          'Cơ năng: $W = \\frac{1}{2} k A^2 = \\frac{1}{2} \\cdot 80 \\cdot (0{,}05)^2 = 0{,}10\\text{ J}$.',
          'Tần số góc: $\\omega = \\sqrt{\\frac{80}{0{,}2}} = 20\\text{ rad/s}$.',
          'Tốc độ cực đại: $v_{\\max} = \\omega A = 20 \\cdot 0{,}05 = 1{,}0\\text{ m/s}$.'
        ],
        finalAnswer: '$W = 0{,}10\\text{ J}$, $v_{\\max} = 1{,}0\\text{ m/s}$.'
      }
    ]
  },
  {
    id: 'phys-11-resonance',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương I · Dao động',
    sourceTag: SRC_11,
    lessonNumber: 6,
    title: 'Bài 6: Dao động tắt dần. Dao động cưỡng bức. Hiện tượng cộng hưởng',
    subtitle: 'Nguyên nhân tắt dần (ma sát/lực cản), dao động duy trì, dao động cưỡng bức và điều kiện cộng hưởng cơ f = f₀',
    description:
      'Phân biệt dao động tắt dần, dao động duy trì (đồng hồ quả lắc) và dao động cưỡng bức; phân tích lợi ích và tác hại của hiện tượng cộng hưởng cơ học.',
    theorySections: [
      {
        heading: '1. Dao động tắt dần & Dao động duy trì',
        content:
          '• **Dao động tắt dần**: Biên độ và cơ năng giảm dần theo thời gian do ma sát và lực cản môi trường (ma sát càng lớn, tắt dần càng nhanh). Ứng dụng: giảm xóc ô tô, cửa đóng tự động.\n• **Dao động duy trì**: Bù đúng phần năng lượng tiêu hao sau mỗi chu kì mà không làm thay đổi tần số riêng $f_0$.'
      },
      {
        heading: '2. Dao động cưỡng bức & Cộng hưởng',
        content:
          '• **Dao động cưỡng bức**: Chịu tác dụng ngoại lực tuần hoàn $F = F_0\\cos(2\\pi f t)$. Tần số dao động ổn định bằng đúng tần số ngoại lực $f$; biên độ phụ thuộc $F_0$, lực cản và độ chênh $|f - f_0|$.\n• **Hiện tượng cộng hưởng**: Khi $f = f_0$ (tần số lực cưỡng bức bằng tần số riêng hệ), biên độ dao động đạt **cực đại** đột ngột.'
      }
    ],
    keyFormulas: ['f_{\\text{cưỡng bức}} = f_{\\text{ngoại lực}}', '\\text{Cộng hưởng} \\iff f = f_0 \\; (T = T_0)'],
    ...SIM_PRESETS.damped_resonance,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Hiện tượng cộng hưởng cơ xảy ra khi:',
        options: [
          'A. Biên độ ngoại lực đạt giá trị rất nhỏ',
          'B. Tần số của ngoại lực cưỡng bức bằng tần số dao động riêng của hệ ($f = f_0$)',
          'C. Ma sát môi trường rất lớn',
          'D. Chu kì ngoại lực gấp 3 lần chu kì riêng'
        ],
        correctIndex: 1,
        explanation: 'Khi $f = f_0$, năng lượng truyền từ ngoại lực vào hệ đạt hiệu quả cực đại làm biên độ vọt lên cực đại.'
      },
      {
        source: SRC_11,
        question: 'Một hành khách xách xô nước đi đều với bước dài $0{,}6\\text{ m}$. Chu kì dao động riêng của nước trong xô là $0{,}5\\text{ s}$. Nước bị sóng sánh mạnh nhất (cộng hưởng) khi người đi với tốc độ:',
        options: ['A. 0,3 m/s', 'B. 1,2 m/s', 'C. 0,83 m/s', 'D. 2,4 m/s'],
        correctIndex: 1,
        explanation: 'Cộng hưởng khi $t_{\\text{bước}} = T_0 = 0{,}5\\text{ s} \\implies v = \\frac{s}{t} = \\frac{0{,}6}{0{,}5} = 1{,}2\\text{ m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Nêu một ví dụ cộng hưởng có hại và một ví dụ cộng hưởng có lợi trong đời sống – kỹ thuật, đồng thời đề xuất cách phòng tránh cộng hưởng gây hại ở cầu đường.',
        hints: ['Ví dụ sập cầu Tacoma / đội quân bước đều qua cầu vs hộp cộng hưởng đàn ghi-ta.'],
        solutionSteps: [
          'Có hại: Nhịp bước đều của đoàn người hoặc gió xoáy có tần số trùng với tần số riêng $f_0$ của cầu treo gây rung lắc sập cầu.',
          'Có lợi: Hộp cộng hưởng của đàn ghi-ta, vi-ô-lông khuếch đại âm thanh; lò vi sóng dùng sóng cộng hưởng làm nóng phân tử nước.',
          'Phòng tránh: Quy định bộ đội đi bước không đều khi qua cầu, thiết kế hệ thống giảm chấn thay đổi $f_0$.'
        ],
        finalAnswer: 'Tránh tần số tác động bên ngoài trùng $f_0$ bằng giảm chấn hoặc phá nhịp đều.'
      }
    ]
  },
  {
    id: 'phys-11-b7',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương I · Dao động',
    sourceTag: SRC_11,
    lessonNumber: 7,
    title: 'Bài 7: Bài tập về sự chuyển hóa năng lượng trong dao động điều hòa',
    subtitle: 'Tổng hợp bài toán đồ thị năng lượng Wđ(x) – Wt(x), tỉ số Wđ/Wt và phần năng lượng mất mát trong dao động tắt dần',
    description:
      'Luyện giải thành thạo các dạng đồ thị parabol năng lượng theo li độ $x$, tìm vị trí có tỉ số $W_đ = n W_t$ và tính phần trăm cơ năng giảm sau mỗi chu kì tắt dần.',
    theorySections: [
      {
        heading: '1. Kỹ thuật giải nhanh tỉ số Động năng / Thế năng',
        content:
          '• Khi biết $W_đ = n W_t$: Từ $W = W_đ + W_t = (n + 1)W_t \\implies x = \\pm\\frac{A}{\\sqrt{n+1}}$ và $|v| = v_{\\max}\\sqrt{\\frac{n}{n+1}}$.\n• Đồ thị $W_t(x)$ là parabol bề lõm lên trên; đồ thị $W_đ(x)$ là parabol úp ngược.'
      },
      {
        heading: '2. Độ giảm cơ năng trong dao động tắt dần',
        content:
          '• Nếu biên độ giảm từ $A_1$ xuống $A_2$, phần năng lượng tiêu hao thành nhiệt là $\\Delta W = \\frac{1}{2}k(A_1^2 - A_2^2)$.\n• Tỉ lệ phần trăm cơ năng bị mất: $\\frac{\\Delta W}{W_1} = 1 - \\left(\\frac{A_2}{A_1}\\right)^2$.'
      }
    ],
    keyFormulas: [
      'W_đ = n W_t \\implies x = \\pm\\frac{A}{\\sqrt{n + 1}}',
      '\\frac{\\Delta W}{W_1} = 1 - \\left(\\frac{A_2}{A_1}\\right)^2'
    ],
    ...SIM_PRESETS.spring,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Con lắc dao động tắt dần, sau mỗi chu kì biên độ giảm $10\\%$ (còn $0{,}9 A$). Phần trăm cơ năng bị mất đi sau một chu kì là:',
        options: ['A. 10%', 'B. 19%', 'C. 20%', 'D. 81%'],
        correctIndex: 1,
        explanation: '$\\frac{\\Delta W}{W} = 1 - 0{,}9^2 = 1 - 0{,}81 = 0{,}19 = 19\\%$.'
      },
      {
        source: SRC_11,
        question: 'Tại vị trí $x = \\frac{A}{2}$, tỉ số giữa động năng và thế năng $\\frac{W_đ}{W_t}$ bằng:',
        options: ['A. 1', 'B. 2', 'C. 3', 'D. 4'],
        correctIndex: 2,
        explanation: '$W_t = \\frac{1}{4}W \\implies W_đ = \\frac{3}{4}W \\implies W_đ / W_t = 3$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một con lắc lò xo có $k = 100\\text{ N/m}$, biên độ ban đầu $A = 8\\text{ cm}$. Sau 5 chu kì biên độ còn $6\\text{ cm}$. Tính phần cơ năng đã chuyển hóa thành nhiệt trong 5 chu kì đó.',
        hints: ['Tính $\\Delta W = \\frac{1}{2}k(A_1^2 - A_2^2)$ với $A$ đổi sang mét.'],
        solutionSteps: [
          'Đổi $A_1 = 0{,}08\\text{ m}$, $A_2 = 0{,}06\\text{ m}$.',
          'Nhiệt lượng tỏa ra: $\\Delta W = \\frac{1}{2} \\cdot 100 \\cdot (0{,}08^2 - 0{,}06^2) = 50 \\cdot (0{,}0064 - 0{,}0036) = 0{,}14\\text{ J}$.'
        ],
        finalAnswer: '$\\Delta W = 0{,}14\\text{ J}$.'
      }
    ]
  },

  // ================= CHƯƠNG II. SÓNG (BÀI 8 - 15) =================
  {
    id: 'phys-11-wave',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương II · Sóng',
    sourceTag: SRC_11,
    lessonNumber: 8,
    title: 'Bài 8: Mô tả sóng',
    subtitle: 'Sự truyền dao động trong môi trường, biên độ sóng, chu kì T, tần số f, tốc độ truyền sóng v và bước sóng λ = vT = v/f',
    description:
      'Hiểu bản chất sóng là sự lan truyền dao động và năng lượng trong không gian (các phần tử vật chất chỉ dao động tại chỗ), cùng các đại lượng đặc trưng của sóng.',
    theorySections: [
      {
        heading: '1. Sóng & Các đại lượng đặc trưng',
        content:
          '• **Bước sóng ($\\lambda$)**: Quãng đường sóng truyền đi trong 1 chu kì $T$, cũng là khoảng cách giữa hai đỉnh sóng (hoặc 2 điểm gần nhất dao động cùng pha) trên một phương truyền:\n$$\\lambda = v \\cdot T = \\frac{v}{f}$$'
      },
      {
        heading: '2. Tính chất truyền sóng',
        content:
          '• Khi truyền từ môi trường này sang môi trường khác, **tần số $f$ không đổi**, còn tốc độ $v$ và bước sóng $\\lambda$ thay đổi.\n• Hai điểm cách nhau $d$ trên phương truyền lệch pha $\\Delta\\varphi = \\frac{2\\pi d}{\\lambda}$.'
      }
    ],
    keyFormulas: ['\\lambda = v \\cdot T = \\frac{v}{f}', '\\Delta\\varphi = \\frac{2\\pi d}{\\lambda}'],
    ...SIM_PRESETS.wave_interference,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Một người quan sát thấy một chiếc phao trên mặt hồ nhô lên cao 6 lần trong thời gian $10\\text{ s}$, khoảng cách giữa hai ngọn sóng kề nhau là $2\\text{ m}$. Tốc độ truyền sóng là:',
        options: ['A. 1,0 m/s', 'B. 1,2 m/s', 'C. 2,0 m/s', 'D. 0,8 m/s'],
        correctIndex: 0,
        explanation: '6 lần nhô lên là 5 chu kì: $5T = 10 \\implies T = 2\\text{ s}$. $\\lambda = 2\\text{ m} \\implies v = \\lambda/T = 1{,}0\\text{ m/s}$.'
      },
      {
        source: SRC_11,
        question: 'Khi sóng cơ truyền từ không khí vào nước, đại lượng nào sau đây KHÔNG thay đổi?',
        options: ['A. Tốc độ truyền sóng $v$', 'B. Bước sóng $\\lambda$', 'C. Tần số sóng $f$', 'D. Biên độ sóng'],
        correctIndex: 2,
        explanation: 'Tần số sóng luôn do nguồn phát quyết định và không đổi khi truyền qua các môi trường.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Sóng mặt nước có tần số $20\\text{ Hz}$ truyền đi với tốc độ $1{,}6\\text{ m/s}$. Tính bước sóng và độ lệch pha giữa hai điểm trên cùng phương truyền cách nhau $10\\text{ cm}$.',
        hints: ['Tính $\\lambda = v/f$, rồi dùng $\\Delta\\varphi = 2\\pi d / \\lambda$.'],
        solutionSteps: [
          'Bước sóng: $\\lambda = \\frac{1{,}6}{20} = 0{,}08\\text{ m} = 8\\text{ cm}$.',
          'Độ lệch pha: $\\Delta\\varphi = \\frac{2\\pi \\cdot 10}{8} = 2{,}5\\pi\\text{ rad}$ (tức hai điểm dao động vuông pha).'
        ],
        finalAnswer: '$\\lambda = 8\\text{ cm}$, $\\Delta\\varphi = 2{,}5\\pi\\text{ rad}$ (vuông pha).'
      }
    ]
  },
  {
    id: 'phys-11-b9',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương II · Sóng',
    sourceTag: SRC_11,
    lessonNumber: 9,
    title: 'Bài 9: Sóng ngang. Sóng dọc. Sự truyền năng lượng của sóng cơ',
    subtitle: 'Phân biệt sóng ngang và sóng dọc theo phương dao động, môi trường truyền sóng cơ (rắn, lỏng, khí) và cường độ sóng I = E/(S·t)',
    description:
      'Phân loại sóng ngang (vuông góc phương truyền) vs sóng dọc (trùng phương truyền), lý do sóng cơ không truyền được trong chân không và khái niệm cường độ sóng âm.',
    theorySections: [
      {
        heading: '1. Sóng ngang và Sóng dọc',
        content:
          '• **Sóng ngang**: Phương dao động **vuông góc** với phương truyền sóng. Truyền được trong chất **rắn** và trên **bề mặt chất lỏng**.\n• **Sóng dọc**: Phương dao động **trùng** với phương truyền sóng (tạo lớp nén – giãn, ví dụ sóng âm trong không khí). Truyền được trong cả **rắn, lỏng, khí**.\n• Sóng cơ KHÔNG truyền được trong chân không.'
      },
      {
        heading: '2. Năng lượng sóng & Cường độ sóng',
        content:
          '• Quá trình truyền sóng là quá trình truyền **năng lượng** (không truyền vật chất).\n• **Cường độ sóng ($I$)**: Năng lượng sóng truyền qua một đơn vị diện tích vuông góc phương truyền trong $1\\text{ giây}$: $I = \\frac{\\mathcal{P}}{S}$ ($\\text{W/m}^2$).'
      }
    ],
    keyFormulas: ['I = \\frac{E}{S\\cdot t} = \\frac{\\mathcal{P}}{S} = \\frac{\\mathcal{P}}{4\\pi r^2} \\;(\\text{nguồn cầu})'],
    ...SIM_PRESETS.wave_longitudinal,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Sóng âm truyền trong không khí là loại sóng nào?',
        options: ['A. Sóng ngang', 'B. Sóng dọc', 'C. Sóng điện từ', 'D. Sóng dừng'],
        correctIndex: 1,
        explanation: 'Không khí chỉ có biến dạng nén giãn đàn hồi theo phương truyền nên sóng âm trong không khí là sóng dọc.'
      },
      {
        source: SRC_11,
        question: 'Loại sóng cơ nào truyền được trong cả 3 môi trường rắn, lỏng và khí?',
        options: ['A. Chỉ sóng ngang', 'B. Chỉ sóng dọc', 'C. Sóng ánh sáng', 'D. Sóng điện từ'],
        correctIndex: 1,
        explanation: 'Sóng dọc truyền được trong cả rắn, lỏng, khí; còn sóng ngang chỉ truyền trong rắn và mặt thoáng chất lỏng.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một nguồn âm điểm đẳng hướng có công suất phát $P = 0{,}04\\pi\\text{ W}$. Tính cường độ âm tại điểm cách nguồn $2\\text{ m}$ (bỏ qua hấp thụ âm của không khí).',
        hints: ['Dùng $I = \\frac{P}{4\\pi r^2}$.'],
        solutionSteps: [
          'Diện tích mặt cầu bán kính $r = 2\\text{ m}$: $S = 4\\pi r^2 = 16\\pi\\text{ m}^2$.',
          'Cường độ âm: $I = \\frac{0{,}04\\pi}{16\\pi} = 0{,}0025 = 2{,}5 \\cdot 10^{-3}\\text{ W/m}^2$.'
        ],
        finalAnswer: '$I = 2{,}5 \\cdot 10^{-3}\\text{ W/m}^2$.'
      }
    ]
  },
  {
    id: 'phys-11-b10',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương II · Sóng',
    sourceTag: SRC_11,
    lessonNumber: 10,
    title: 'Bài 10: Thực hành: Đo tần số của sóng âm',
    subtitle: 'Sử dụng dao động kí điện tử (Oscilloscope) và micro để thu tín hiệu sóng âm, đọc chu kì T và suy ra tần số f',
    description:
      'Thực hành đọc đồ thị dao động âm trên màn hình dao động kí với độ chia thời gian `TIME/DIV` để xác định chu kì $T$ và tần số âm $f = 1/T$.',
    theorySections: [
      {
        heading: '1. Nguyên tắc đo tần số bằng Dao động kí',
        content:
          '• Micro biến đổi dao động áp suất không khí của âm thoa (hoặc nguồn âm) thành tín hiệu điện áp đưa vào dao động kí.\n• Trên màn hình chia lưới ô vuông: trục ngang biểu diễn thời gian theo núm xoay `TIME/DIV` ($\\text{ms/ô}$), trục đứng biểu diễn điện áp tỷ lệ biên độ âm.'
      },
      {
        heading: '2. Cách tính T và f từ số ô trên màn hình',
        content:
          '• Đếm số ô ngang $N$ ứng với $k$ chu kì hoàn chỉnh: $T = \\frac{N \\cdot (\\text{TIME/DIV})}{k}$.\n• Suy ra tần số sóng âm: $f = \\frac{1}{T}$ (giải thích dải tần số nghe được của tai người $16\\text{ Hz} - 20\\,000\\text{ Hz}$).'
      }
    ],
    keyFormulas: ['T = \\frac{\\text{Số ô} \\times \\text{TIME/DIV}}{\\text{Số chu kì}}', 'f = \\frac{1}{T}'],
    ...SIM_PRESETS.sound_intensity,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Trên màn hình dao động kí đang đặt thang `TIME/DIV = 0,5 ms/ô`, một chu kì sóng âm chiếm đúng $4\\text{ ô}$ ngang. Tần số của âm đo được là:',
        options: ['A. 200 Hz', 'B. 500 Hz', 'C. 1000 Hz', 'D. 2000 Hz'],
        correctIndex: 1,
        explanation: '$T = 4 \\cdot 0{,}5\\text{ ms} = 2\\text{ ms} = 0{,}002\\text{ s} \\implies f = \\frac{1}{0{,}002} = 500\\text{ Hz}$.'
      },
      {
        source: SRC_11,
        question: 'Giới hạn tần số sóng âm mà tai người bình thường nghe được nằm trong khoảng:',
        options: ['A. Dưới 16 Hz', 'B. Từ 16 Hz đến 20 000 Hz', 'C. Trên 20 000 Hz', 'D. Từ 100 Hz đến 1000 Hz'],
        correctIndex: 1,
        explanation: 'Âm nghe được (âm thanh) từ $16\\text{ Hz}$ đến $20\\text{ kHz}$; dưới $16\\text{ Hz}$ là hạ âm, trên $20\\text{ kHz}$ là siêu âm.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Khi gõ âm thoa chuẩn $440\\text{ Hz}$ (nốt La) và đặt `TIME/DIV = 1 ms/ô`, 2 chu kì sóng trên màn hình dao động kí sẽ chiếm khoảng bao nhiêu ô ngang?',
        hints: ['Tính $T = 1/440\\text{ s}$, nhân 2 chu kì, đổi sang ms rồi chia cho 1 ms/ô.'],
        solutionSteps: [
          'Chu kì âm thoa: $T = \\frac{1}{440} \\approx 2{,}273\\text{ ms}$.',
          'Độ dài 2 chu kì: $2T \\approx 4{,}55\\text{ ms}$, tương ứng $\\frac{4{,}55}{1} \\approx 4{,}55\\text{ ô}$.'
        ],
        finalAnswer: 'Khoảng $4{,}55$ ô ngang.'
      }
    ]
  },
  {
    id: 'phys-11-b11',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương II · Sóng',
    sourceTag: SRC_11,
    lessonNumber: 11,
    title: 'Bài 11: Sóng điện từ',
    subtitle: 'Bản chất sóng ngang truyền trong chân không với tốc độ c = 3·10⁸ m/s và thang sóng điện từ (Vô tuyến → Hồng ngoại → Khả kiến → Tử ngoại → Tia X → Gamma)',
    description:
      'Làm chủ thang sóng điện từ GDPT 2018 (được đưa xuống Lớp 11), tính chất chung của sóng điện từ và ứng dụng của từng dải bức xạ.',
    theorySections: [
      {
        heading: '1. Đặc điểm Sóng điện từ & Công thức λ = c/f',
        content:
          '• **Sóng điện từ** là sự lan truyền của điện từ trường biến thiên; là **sóng ngang**, truyền được trong **chân không** với tốc độ $c = 3 \\cdot 10^8\\text{ m/s}$.\n• Liên hệ bước sóng – tần số trong chân không: $\\lambda = c \\cdot T = \\frac{c}{f}$.'
      },
      {
        heading: '2. Thang sóng điện từ (bước sóng giảm dần, tần số tăng dần)',
        content:
          '1. **Sóng vô tuyến** ($\\lambda$ từ vài mm đến vài km): truyền thanh, truyền hình, Wi-Fi, radar.\n2. **Tia hồng ngoại** ($0{,}76\\,\\mu\\text{m} - 1\\text{ mm}$): tác dụng nhiệt, điều khiển từ xa, camera nhiệt.\n3. **Ánh sáng nhìn thấy** ($0{,}38\\,\\mu\\text{m}$ tím đến $0{,}76\\,\\mu\\text{m}$ đỏ).\n4. **Tia tử ngoại** ($10\\text{ nm} - 0{,}38\\,\\mu\\text{m}$): tiệt trùng, kích thích huỳnh quang.\n5. **Tia X (Rơnghen)** ($10^{-11}\\text{ m} - 10^{-8}\\text{ m}$) & **Tia gamma ($\\gamma$)** ($< 10^{-11}\\text{ m}$): đâm xuyên mạnh, chụp X-quang, xạ trị.'
      }
    ],
    keyFormulas: ['\\lambda = \\frac{c}{f} \\quad (c = 3 \\cdot 10^8\\text{ m/s})', '0{,}38\\,\\mu\\text{m} \\le \\lambda_{\\text{khả kiến}} \\le 0{,}76\\,\\mu\\text{m}'],
    ...SIM_PRESETS.em_wave,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Sắp xếp nào sau đây ĐÚNG theo thứ tự **bước sóng giảm dần** trong thang sóng điện từ?',
        options: [
          'A. Tia gamma, Tia X, Ánh sáng nhìn thấy, Tia hồng ngoại',
          'B. Sóng vô tuyến, Tia hồng ngoại, Ánh sáng nhìn thấy, Tia tử ngoại, Tia X',
          'C. Tia tử ngoại, Ánh sáng đỏ, Sóng vô tuyến, Tia X',
          'D. Tia X, Tia tử ngoại, Tia hồng ngoại, Sóng vô tuyến'
        ],
        correctIndex: 1,
        explanation: 'Thứ tự bước sóng giảm dần (tần số tăng dần): Vô tuyến → Hồng ngoại → Khả kiến → Tử ngoại → Tia X → Tia gamma.'
      },
      {
        source: SRC_11,
        question: 'Một đài phát thanh FM phát sóng ở tần số $100\\text{ MHz}$ ($10^8\\text{ Hz}$). Bước sóng phát ra trong chân không là:',
        options: ['A. 0,3 m', 'B. 3,0 m', 'C. 30 m', 'D. 300 m'],
        correctIndex: 1,
        explanation: '$\\lambda = \\frac{c}{f} = \\frac{3\\cdot 10^8}{10^8} = 3{,}0\\text{ m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một bức xạ điện từ trong chân không có bước sóng $\\lambda = 500\\text{ nm}$. Tính tần số của bức xạ này và cho biết nó thuộc vùng nào trong thang sóng điện từ.',
        hints: ['Đổi $500\\text{ nm} = 0{,}50\\,\\mu\\text{m} = 5 \\cdot 10^{-7}\\text{ m}$, tính $f = c/\\lambda$.'],
        solutionSteps: [
          'Đổi đơn vị: $\\lambda = 500\\text{ nm} = 5 \\cdot 10^{-7}\\text{ m} = 0{,}50\\,\\mu\\text{m}$.',
          'Tần số: $f = \\frac{3\\cdot 10^8}{5 \\cdot 10^{-7}} = 6 \\cdot 10^{14}\\text{ Hz}$.',
          'Vì $0{,}38\\,\\mu\\text{m} < 0{,}50\\,\\mu\\text{m} < 0{,}76\\,\\mu\\text{m}$, bức xạ thuộc **vùng ánh sáng nhìn thấy** (màu lục).'
        ],
        finalAnswer: '$f = 6 \\cdot 10^{14}\\text{ Hz}$, thuộc vùng ánh sáng nhìn thấy.'
      }
    ]
  },
  {
    id: 'phys-11-b12',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương II · Sóng',
    sourceTag: SRC_11,
    lessonNumber: 12,
    title: 'Bài 12: Giao thoa sóng',
    subtitle: 'Điều kiện hai nguồn kết hợp, giao thoa sóng cơ mặt nước (cực đại d₂−d₁ = kλ) và thí nghiệm giao thoa ánh sáng khe Young (i = λD/a)',
    description:
      'Thống nhất hai hiện tượng giao thoa trong GDPT 2018 Lớp 11: cực đại – cực tiểu giao thoa sóng nước và công thức khoảng vân $i = \\frac{\\lambda D}{a}$ trong thí nghiệm khe Young.',
    theorySections: [
      {
        heading: '1. Giao thoa hai sóng cơ kết hợp',
        content:
          '• **Hai nguồn kết hợp**: Cùng phương dao động, cùng tần số và có hiệu số pha không đổi theo thời gian.\n• Với hai nguồn **cùng pha** tại $S_1, S_2$:\n  - Điểm dao động **cực đại**: $d_2 - d_1 = k\\lambda$ ($k \\in \\mathbb{Z}$).\n  - Điểm **cực tiểu** (đứng yên): $d_2 - d_1 = (k + \\frac{1}{2})\\lambda$.'
      },
      {
        heading: '2. Giao thoa ánh sáng qua hai khe Young (Y-âng)',
        content:
          '• **Khoảng vân ($i$)**: Khoảng cách giữa hai vân sáng (hoặc hai vân tối) liên tiếp: $i = \\frac{\\lambda D}{a}$.\n• Vị trí vân sáng bậc $k$: $x_s = k\\cdot i$; Vị trí vân tối: $x_t = (k + \\frac{1}{2})i$.'
      }
    ],
    keyFormulas: [
      'd_2 - d_1 = k\\lambda \\;(\\text{Cực đại}), \\qquad d_2 - d_1 = \\left(k + \\frac{1}{2}\\right)\\lambda \\;(\\text{Cực tiểu})',
      'i = \\frac{\\lambda D}{a}, \\qquad x_s = k i, \\qquad x_t = \\left(k + \\frac{1}{2}\\right)i'
    ],
    ...SIM_PRESETS.wave_interference,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Trong thí nghiệm khe Young dùng ánh sáng $\\lambda = 0{,}6\\,\\mu\\text{m}$, khoảng cách hai khe $a = 1\\text{ mm}$, khoảng cách màn $D = 2\\text{ m}$. Khoảng vân $i$ trên màn bằng:',
        options: ['A. 0,3 mm', 'B. 1,2 mm', 'C. 0,6 mm', 'D. 2,4 mm'],
        correctIndex: 1,
        explanation: '$i = \\frac{\\lambda D}{a} = \\frac{0{,}6 \\cdot 2}{1} = 1{,}2\\text{ mm}$.'
      },
      {
        source: SRC_11,
        question: 'Trong giao thoa sóng mặt nước với hai nguồn kết hợp cùng pha, điều kiện để điểm $M$ cách hai nguồn $d_1, d_2$ dao động với biên độ CỰC ĐẠI là:',
        options: ['A. $d_2 - d_1 = k\\lambda$', 'B. $d_2 - d_1 = (k + 0{,}5)\\lambda$', 'C. $d_1 + d_2 = k\\lambda$', 'D. $d_2 - d_1 = k\\lambda/4$'],
        correctIndex: 0,
        explanation: 'Với hai nguồn cùng pha, cực đại giao thoa nằm tại hiệu đường đi bằng số nguyên lần bước sóng $d_2 - d_1 = k\\lambda$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Thí nghiệm Young có $a = 1{,}2\\text{ mm}$, $D = 1{,}5\\text{ m}$. Đo được khoảng cách giữa 5 vân sáng liên tiếp là $3{,}0\\text{ mm}$. Tính bước sóng ánh sáng dùng trong thí nghiệm.',
        hints: ['5 vân sáng liên tiếp có 4 khoảng vân: $4i = 3{,}0\\text{ mm}$.'],
        solutionSteps: [
          'Khoảng vân: $i = \\frac{3{,}0}{5 - 1} = 0{,}75\\text{ mm}$.',
          'Bước sóng: $\\lambda = \\frac{i \\cdot a}{D} = \\frac{0{,}75 \\cdot 1{,}2}{1{,}5} = 0{,}60\\,\\mu\\text{m}$.'
        ],
        finalAnswer: '$\\lambda = 0{,}60\\,\\mu\\text{m}$.'
      }
    ]
  },
  {
    id: 'phys-standing-wave',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương II · Sóng',
    sourceTag: SRC_11,
    lessonNumber: 13,
    title: 'Bài 13: Sóng dừng',
    subtitle: 'Sự giao thoa sóng tới và sóng phản xạ tạo nút sóng – bụng sóng cố định, điều kiện sóng dừng 2 đầu cố định và 1 đầu tự do',
    description:
      'Khảo sát hình ảnh sóng dừng ổn định trên dây, khoảng cách đặc trưng $\\lambda/2$ giữa hai nút/bụng kề nhau và điều kiện chiều dài dây có sóng dừng.',
    theorySections: [
      {
        heading: '1. Nguyên nhân hình thành Sóng dừng',
        content:
          '• **Sóng dừng** hình thành do giao thoa liên tục giữa **sóng tới** và **sóng phản xạ** truyền ngược chiều trên cùng một phương, tạo ra các điểm đứng yên (**nút sóng**) và dao động biên độ cực đại (**bụng sóng**).\n• Khoảng cách 2 nút (hoặc 2 bụng) liên tiếp là $\\frac{\\lambda}{2}$; khoảng cách nút – bụng gần nhất là $\\frac{\\lambda}{4}$.'
      },
      {
        heading: '2. Điều kiện có Sóng dừng trên dây dài l',
        content:
          '• **Hai đầu cố định**: $l = k\\frac{\\lambda}{2}$ ($k \\in \\mathbb{N}^*$ = số bó sóng = số bụng sóng; số nút $= k + 1$).\n• **Một đầu cố định, một đầu tự do**: $l = (2k + 1)\\frac{\\lambda}{4}$ (số bó nguyên là $k$, cộng 1 nửa bó ở đầu tự do).'
      }
    ],
    keyFormulas: [
      'l = k\\frac{\\lambda}{2} \\quad (\\text{2 đầu cố định})',
      'l = (2k + 1)\\frac{\\lambda}{4} \\quad (\\text{1 đầu cố định, 1 đầu tự do})'
    ],
    ...SIM_PRESETS.standing_wave,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Khoảng cách giữa hai nút sóng liên tiếp trên một sợi dây đang có sóng dừng là:',
        options: ['A. $\\lambda$', 'B. $\\lambda/2$', 'C. $\\lambda/4$', 'D. $2\\lambda$'],
        correctIndex: 1,
        explanation: 'Hai nút liên tiếp (hoặc hai bụng liên tiếp) cách nhau đúng nửa bước sóng $\\lambda/2$.'
      },
      {
        source: SRC_11,
        question: 'Một sợi dây dài $1{,}2\\text{ m}$ có hai đầu cố định đang có sóng dừng với $3$ bó sóng (3 bụng sóng). Bước sóng trên dây là:',
        options: ['A. 0,4 m', 'B. 0,8 m', 'C. 1,2 m', 'D. 0,6 m'],
        correctIndex: 1,
        explanation: '$l = k\\frac{\\lambda}{2} \\implies 1{,}2 = 3\\frac{\\lambda}{2} \\implies \\lambda = 0{,}8\\text{ m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một sợi dây đàn hồi dài $1{,}5\\text{ m}$ hai đầu cố định, tốc độ truyền sóng trên dây là $30\\text{ m/s}$. Người ta kích thích rung để trên dây xuất hiện $5$ bụng sóng. Tính bước sóng và tần số rung của dây.',
        hints: ['Với 2 đầu cố định và 5 bụng sóng thì $k = 5$.'],
        solutionSteps: [
          'Bước sóng: $l = 5\\frac{\\lambda}{2} \\implies \\lambda = \\frac{2 \\cdot 1{,}5}{5} = 0{,}6\\text{ m}$.',
          'Tần số rung: $f = \\frac{v}{\\lambda} = \\frac{30}{0{,}6} = 50\\text{ Hz}$.'
        ],
        finalAnswer: '$\\lambda = 0{,}6\\text{ m}$, $f = 50\\text{ Hz}$.'
      }
    ]
  },
  {
    id: 'phys-11-sound-standing',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương II · Sóng',
    sourceTag: SRC_11,
    lessonNumber: 14,
    title: 'Bài 14: Bài tập về sóng dừng',
    subtitle: 'Giải bài toán sóng dừng trong cột khí sáo/ống nghiệm, tần số họa âm liên tiếp và bài toán khoảng cách nút – bụng',
    description:
      'Luyện giải hệ thống bài tập sóng dừng trên dây đàn hồi và sóng dừng âm thanh trong ống trụ có một đầu kín (nút) – một đầu hở (bụng).',
    theorySections: [
      {
        heading: '1. Chuỗi tần số riêng gây Sóng dừng',
        content:
          '• **Dây hai đầu cố định** (hoặc ống sáo hai đầu hở): $f_k = k \\cdot \\frac{v}{2l} = k f_1$ (hiệu hai tần số liên tiếp $\\Delta f = f_1$).\n• **Ống 1 đầu kín, 1 đầu hở**: $f_n = (2n + 1)\\frac{v}{4l}$ (hiệu hai tần số liên tiếp $\\Delta f = 2 f_1$).'
      },
      {
        heading: '2. Biên độ tại điểm bất kỳ trên dây sóng dừng',
        content:
          '• Gọi biên độ tại bụng sóng là $A_{\\text{bụng}}$. Điểm cách nút gần nhất đoạn $d$ có biên độ $A_M = A_{\\text{bụng}}|\\sin(\\frac{2\\pi d}{\\lambda})|$.'
      }
    ],
    keyFormulas: ['\\Delta f_{\\text{2 đầu giống nhau}} = f_{\\min} = \\frac{v}{2l}', '\\Delta f_{\\text{1 cố định 1 tự do}} = 2 f_{\\min} = \\frac{v}{2l}'],
    ...SIM_PRESETS.standing_wave,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Trên một sợi dây dài $1\\text{ m}$ có 1 đầu cố định và 1 đầu tự do, tạo sóng dừng với tần số nhỏ nhất là $15\\text{ Hz}$. Tần số tiếp theo gây được sóng dừng trên dây là:',
        options: ['A. 30 Hz', 'B. 45 Hz', 'C. 22,5 Hz', 'D. 60 Hz'],
        correctIndex: 1,
        explanation: 'Dây 1 đầu cố định – 1 đầu tự do chỉ xuất hiện các họa âm bậc lẻ: $f_1, 3f_1, 5f_1 \\dots \\implies 3 \\cdot 15 = 45\\text{ Hz}$.'
      },
      {
        source: SRC_11,
        question: 'Hai tần số liên tiếp tạo ra sóng dừng trên dây hai đầu cố định là $60\\text{ Hz}$ và $80\\text{ Hz}$. Tần số cơ bản nhỏ nhất tạo sóng dừng trên dây là:',
        options: ['A. 10 Hz', 'B. 20 Hz', 'C. 40 Hz', 'D. 140 Hz'],
        correctIndex: 1,
        explanation: 'Hiệu hai tần số liên tiếp trên dây 2 đầu cố định bằng đúng tần số cơ bản: $f_1 = 80 - 60 = 20\\text{ Hz}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một ống khí dài $85\\text{ cm}$ một đầu kín, một đầu hở, tốc độ âm trong không khí là $340\\text{ m/s}$. Tính tần số âm cơ bản $f_1$ cộng hưởng trong ống.',
        hints: ['Với 1 đầu kín (nút) và 1 đầu hở (bụng), tần số nhỏ nhất ứng với $l = \\lambda/4$.'],
        solutionSteps: [
          'Bước sóng lớn nhất: $l = \\frac{\\lambda}{4} \\implies \\lambda = 4 \\cdot 0{,}85 = 3{,}4\\text{ m}$.',
          'Tần số cơ bản: $f_1 = \\frac{v}{\\lambda} = \\frac{340}{3{,}4} = 100\\text{ Hz}$.'
        ],
        finalAnswer: '$f_1 = 100\\text{ Hz}$.'
      }
    ]
  },
  {
    id: 'phys-11-b15',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương II · Sóng',
    sourceTag: SRC_11,
    lessonNumber: 15,
    title: 'Bài 15: Thực hành: Đo tốc độ truyền âm',
    subtitle: 'Thí nghiệm cột khí có pít-tông điều chỉnh chiều dài l cộng hưởng với âm thoa/loa tần số f để đo tốc độ âm v = λf',
    description:
      'Đo khoảng cách giữa hai vị trí pít-tông liên tiếp nghe thấy âm to nhất (cộng hưởng sóng dừng $\\Delta l = \\lambda/2$) để suy ra tốc độ truyền âm trong không khí.',
    theorySections: [
      {
        heading: '1. Nguyên tắc đo tốc độ truyền âm bằng ống cộng hưởng',
        content:
          '• Đặt nguồn âm có tần số $f$ biết trước ngay miệng ống trụ thẳng đứng chứa pít-tông di động.\n• Kéo từ từ pít-tông xuống các vị trí $l_1, l_2$ liên tiếp mà tại đó nghe âm to rõ nhất (cộng hưởng sóng dừng: miệng ống là bụng, mặt pít-tông là nút).\n• Khoảng cách giữa hai vị trí cộng hưởng liên tiếp đúng bằng nửa bước sóng: $l_2 - l_1 = \\frac{\\lambda}{2} \\implies \\lambda = 2(l_2 - l_1)$.'
      },
      {
        heading: '2. Công thức tính v và Sai số',
        content:
          '• Tốc độ truyền âm: $v = \\lambda \\cdot f = 2(l_2 - l_1)f$.\n• Nhờ đo hiệu $l_2 - l_1$ ta loại bỏ được sai số hiệu ứng đầu miệng ống!'
      }
    ],
    keyFormulas: ['\\lambda = 2(l_2 - l_1)', 'v = \\lambda f = 2(l_2 - l_1)f'],
    ...SIM_PRESETS.standing_sound,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Dùng nguồn âm tần số $f = 500\\text{ Hz}$ đặt ở miệng ống cộng hưởng. Hai vị trí pít-tông liên tiếp cho âm to nhất là $l_1 = 16{,}5\\text{ cm}$ và $l_2 = 50{,}5\\text{ cm}$. Tốc độ truyền âm đo được là:',
        options: ['A. 330 m/s', 'B. 340 m/s', 'C. 350 m/s', 'D. 170 m/s'],
        correctIndex: 1,
        explanation: '$\\lambda = 2(0{,}505 - 0{,}165) = 0{,}68\\text{ m} \\implies v = 0{,}68 \\cdot 500 = 340\\text{ m/s}$.'
      },
      {
        source: SRC_11,
        question: 'Tại sao khi đo bước sóng bằng ống cộng hưởng người ta lấy hiệu hai lần liên tiếp $l_2 - l_1$ thay vì chỉ đo $l_1$ rồi nhân 4?',
        options: [
          'A. Vì bụng sóng nằm hơi chếch ra ngoài miệng ống một chút, lấy hiệu $l_2 - l_1$ sẽ triệt tiêu sai số đầu miệng ống',
          'B. Vì lần đầu không tạo được sóng dừng',
          'C. Vì tần số thay đổi sau lần 1',
          'D. Vì pít-tông tự động dừng lại'
        ],
        correctIndex: 0,
        explanation: 'Bụng sóng thực tế nằm ngoài miệng ống một khoảng nhỏ $\\Delta l_0$; phép trừ $l_2 - l_1$ khử hoàn toàn đại lượng này.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Trong thí nghiệm đo tốc độ âm với $f = 680\\text{ Hz}$, ba vị trí pít-tông liên tiếp nghe thấy âm cực đại lần lượt ở $12{,}0\\text{ cm}$; $37{,}0\\text{ cm}$ và $62{,}0\\text{ cm}$. Tính tốc độ truyền âm trung bình.',
        hints: ['Mỗi khoảng liên tiếp là $\\lambda/2 = 25{,}0\\text{ cm}$.'],
        solutionSteps: [
          'Khoảng cách trung bình giữa hai vị trí cộng hưởng liên tiếp: $\\Delta l = \\frac{62{,}0 - 12{,}0}{2} = 25{,}0\\text{ cm} = 0{,}25\\text{ m}$.',
          'Bước sóng: $\\lambda = 2 \\cdot 0{,}25 = 0{,}50\\text{ m}$.',
          'Tốc độ truyền âm: $v = \\lambda f = 0{,}50 \\cdot 680 = 340\\text{ m/s}$.'
        ],
        finalAnswer: '$v = 340\\text{ m/s}$.'
      }
    ]
  },

  // ================= CHƯƠNG III. ĐIỆN TRƯỜNG (BÀI 16 - 21) =================
  {
    id: 'phys-11-efield',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương III · Điện trường',
    sourceTag: SRC_11,
    lessonNumber: 16,
    title: 'Bài 16: Lực tương tác giữa hai điện tích',
    subtitle: 'Hai loại điện tích, thuyết electron, Định luật Coulomb F = k|q₁q₂|/(εr²) trong chân không và điện môi',
    description:
      'Làm chủ định luật tĩnh điện cơ bản nhất (Định luật Coulomb): lực đẩy/hút tỉ lệ thuận tích độ lớn điện tích và tỉ lệ nghịch bình phương khoảng cách.',
    theorySections: [
      {
        heading: '1. Tương tác điện & Định luật bảo toàn điện tích',
        content:
          '• Hai điện tích cùng dấu đẩy nhau, trái dấu hút nhau; điện tích nguyên tố $e = 1{,}6 \\cdot 10^{-19}\\text{ C}$.\n• Trong hệ cô lập về điện, tổng đại số các điện tích luôn không đổi.'
      },
      {
        heading: '2. Định luật Coulomb (Cu-lông)',
        content:
          '• Lực tương tác giữa hai điện tích điểm $q_1, q_2$ đặt cách nhau khoảng $r$ trong môi trường có hằng số điện môi $\\varepsilon$:\n$$F = k\\frac{|q_1 q_2|}{\\varepsilon r^2}, \\qquad k = 9 \\cdot 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2$$\n(Trong chân không hoặc không khí: $\\varepsilon \\approx 1$).'
      }
    ],
    keyFormulas: ['F = k\\frac{|q_1 q_2|}{\\varepsilon r^2}', 'k = 9 \\cdot 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2'],
    ...SIM_PRESETS.coulomb,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Hai điện tích điểm đặt trong chân không. Nếu khoảng cách giữa chúng tăng lên 3 lần (giữ nguyên điện tích) thì lực tương tác tĩnh điện sẽ:',
        options: ['A. Tăng 3 lần', 'B. Giảm 3 lần', 'C. Giảm 9 lần', 'D. Tăng 9 lần'],
        correctIndex: 2,
        explanation: 'Vì $F$ tỉ lệ nghịch với $r^2$, khi $r$ tăng 3 lần thì $F$ giảm $3^2 = 9$ lần.'
      },
      {
        source: SRC_11,
        question: 'Hai điện tích $q_1 = q_2 = 2 \\cdot 10^{-6}\\text{ C}$ đặt cách nhau $3\\text{ cm}$ trong không khí ($\\varepsilon = 1$). Lực đẩy giữa chúng là:',
        options: ['A. 4 N', 'B. 40 N', 'C. 0,4 N', 'D. 400 N'],
        correctIndex: 1,
        explanation: '$F = 9\\cdot 10^9 \\cdot \\frac{(2\\cdot 10^{-6})^2}{(0{,}03)^2} = 9\\cdot 10^9 \\cdot \\frac{4\\cdot 10^{-12}}{9\\cdot 10^{-4}} = 40\\text{ N}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Hai quả cầu kim loại nhỏ giống hệt nhau mang điện tích $q_1 = +8\\,\\mu\\text{C}$ và $q_2 = -2\\,\\mu\\text{C}$ đặt cách nhau $10\\text{ cm}$ trong không khí. Cho hai quả cầu chạm vào nhau rồi đưa về chỗ cũ. Tính lực tương tác giữa chúng trước và sau khi chạm.',
        hints: ['Sau khi chạm, mỗi quả cầu có điện tích $q\' = (q_1 + q_2)/2$.'],
        solutionSteps: [
          'Trước khi chạm: $F_1 = 9\\cdot 10^9 \\cdot \\frac{8\\cdot 10^{-6} \\cdot 2\\cdot 10^{-6}}{0{,}1^2} = 14{,}4\\text{ N}$ (lực hút).',
          'Sau khi chạm nhau: $q\' = \\frac{+8 - 2}{2} = +3\\,\\mu\\text{C}$.',
          'Lực sau khi tách ra: $F_2 = 9\\cdot 10^9 \\cdot \\frac{(3\\cdot 10^{-6})^2}{0{,}1^2} = 8{,}1\\text{ N}$ (lực đẩy).'
        ],
        finalAnswer: 'Trước chạm hút $14{,}4\\text{ N}$; sau chạm đẩy $8{,}1\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-11-b17',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương III · Điện trường',
    sourceTag: SRC_11,
    lessonNumber: 17,
    title: 'Bài 17: Khái niệm điện trường',
    subtitle: 'Môi trường truyền tương tác điện, cường độ điện trường E = F/|q|, điện trường điện tích điểm E = k|Q|/(εr²), nguyên lý chồng chất và đường sức điện',
    description:
      'Xác định phương, chiều và độ lớn vectơ cường độ điện trường $\\vec{E}$, vẽ phổ đường sức điện và tổng hợp điện trường nhiều điện tích.',
    theorySections: [
      {
        heading: '1. Vectơ Cường độ điện trường',
        content:
          '• **Cường độ điện trường**: $\\vec{E} = \\frac{\\vec{F}}{q}$ (đơn vị $\\text{V/m}$); lực điện tác dụng lên điện tích thử $q$: $\\vec{F} = q\\vec{E}$ ($q > 0 \\implies \\vec{F} \\uparrow\\uparrow \\vec{E}$; $q < 0 \\implies \\vec{F} \\uparrow\\downarrow \\vec{E}$).\n• **Điện trường do điện tích điểm $Q$ gây ra tại cách $r$**: $E = k\\frac{|Q|}{\\varepsilon r^2}$ (hướng ra xa nếu $Q > 0$, hướng vào gần nếu $Q < 0$).'
      },
      {
        heading: '2. Nguyên lý chồng chất & Đường sức điện',
        content:
          '• Tại một điểm có nhiều điện trường: $\\vec{E} = \\vec{E}_1 + \\vec{E}_2 + \\dots$\n• Đường sức điện tĩnh là những đường cong không khép kín, đi ra từ điện tích dương và kết thúc ở điện tích âm (hoặc vô cực), không bao giờ cắt nhau.'
      }
    ],
    keyFormulas: ['\\vec{F} = q\\vec{E}, \\qquad E = k\\frac{|Q|}{\\varepsilon r^2} \\;(\\text{V/m})', '\\vec{E} = \\vec{E}_1 + \\vec{E}_2'],
    ...SIM_PRESETS.electric_field,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Đặt một điện tích thử $q = -2\\,\\mu\\text{C}$ vào một điểm có cường độ điện trường $E = 5000\\text{ V/m}$ hướng sang phải. Lực điện tác dụng lên $q$ có:',
        options: [
          'A. Độ lớn 0,01 N, hướng sang phải',
          'B. Độ lớn 0,01 N, hướng sang trái',
          'C. Độ lớn 2500 N, hướng sang trái',
          'D. Độ lớn 0,001 N, hướng sang phải'
        ],
        correctIndex: 1,
        explanation: '$F = |q| E = 2\\cdot 10^{-6} \\cdot 5000 = 0{,}01\\text{ N}$; vì $q < 0$ nên $\\vec{F}$ ngược chiều $\\vec{E}$ (hướng sang trái).'
      },
      {
        source: SRC_11,
        question: 'Tính chất nào sau đây KHÔNG đúng với đường sức của điện trường tĩnh?',
        options: [
          'A. Các đường sức không bao giờ cắt nhau',
          'B. Nơi điện trường mạnh thì đường sức vẽ dày hơn',
          'C. Đường sức điện tĩnh luôn là đường cong khép kín',
          'D. Xuất phát từ điện tích dương và tận cùng ở điện tích âm'
        ],
        correctIndex: 2,
        explanation: 'Đường sức điện trường tĩnh KHÔNG khép kín (khác với đường sức từ luôn khép kín!).'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Hai điện tích $q_1 = +4\\,\\mu\\text{C}$ và $q_2 = +1\\,\\mu\\text{C}$ đặt tại A, B cách nhau $9\\text{ cm}$ trong không khí. Tìm điểm M tại đó cường độ điện trường tổng hợp bằng $0$.',
        hints: ['Vì $q_1, q_2$ cùng dấu nên M nằm trong đoạn AB thỏa $\\frac{r_1}{r_2} = \\sqrt{\\frac{|q_1|}{|q_2|}}$.'],
        solutionSteps: [
          'Vì $q_1 q_2 > 0$, điểm M có $\\vec{E}_1 + \\vec{E}_2 = \\vec{0}$ phải nằm trên đoạn AB.',
          '$E_1 = E_2 \\implies \\frac{4}{r_1^2} = \\frac{1}{r_2^2} \\implies r_1 = 2 r_2$.',
          'Kết hợp $r_1 + r_2 = 9\\text{ cm} \\implies r_2 = 3\\text{ cm},\\; r_1 = 6\\text{ cm}$.'
        ],
        finalAnswer: 'M nằm trên đoạn AB, cách A $6\\text{ cm}$ và cách B $3\\text{ cm}$.'
      }
    ]
  },
  {
    id: 'phys-11-b18',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương III · Điện trường',
    sourceTag: SRC_11,
    lessonNumber: 18,
    title: 'Bài 18: Điện trường đều',
    subtitle: 'Đặc điểm điện trường đều giữa hai bản phẳng nhiễm điện trái dấu, chuyển động của hạt mang điện trong điện trường đều',
    description:
      'Phân tích điện trường đều có vectơ $\\vec{E}$ như nhau tại mọi điểm và quỹ đạo chuyển động kiểu ném ngang (Parabol) của electron trong điện trường đều (ống tia catôt).',
    theorySections: [
      {
        heading: '1. Khái niệm & Cường độ điện trường đều giữa 2 bản phẳng',
        content:
          '• **Điện trường đều**: Có các đường sức là những đường thẳng song song cách đều; cường độ điện trường $\\vec{E}$ có hướng và độ lớn không đổi tại mọi điểm.\n• Giữa hai bản kim loại phẳng song song cách nhau $d$, nối hiệu điện thế $U$: $E = \\frac{U}{d}$.'
      },
      {
        heading: '2. Chuyển động của điện tích trong điện trường đều',
        content:
          '• Khi electron (điện tích $q = -e$) bay vuông góc với các đường sức điện trường đều với tốc độ đầu $v_0$: chịu lực điện không đổi $F = |q|E$ theo phương thẳng đứng nên chuyển động theo **quỹ đạo Parabol** giống hệt vật ném ngang với gia tốc $a = \\frac{|q|E}{m}$.'
      }
    ],
    keyFormulas: ['E = \\frac{U}{d}', 'a = \\frac{|q|E}{m} = \\frac{|q|U}{md}, \\qquad y = \\frac{|q|E}{2mv_0^2}x^2'],
    ...SIM_PRESETS.electric_field,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Giữa hai bản tụ phẳng song song cách nhau $2\\text{ cm}$ có hiệu điện thế $100\\text{ V}$. Cường độ điện trường đều giữa hai bản là:',
        options: ['A. 50 V/m', 'B. 200 V/m', 'C. 5000 V/m', 'D. 2000 V/m'],
        correctIndex: 2,
        explanation: '$E = \\frac{U}{d} = \\frac{100}{0{,}02} = 5000\\text{ V/m}$.'
      },
      {
        source: SRC_11,
        question: 'Khi một electron bay vào vùng điện trường đều theo phương vuông góc với đường sức điện (bỏ qua trọng lực), quỹ đạo của electron có dạng:',
        options: ['A. Đường thẳng', 'B. Đường tròn', 'C. Đường parabol', 'D. Đường xoắn ốc'],
        correctIndex: 2,
        explanation: 'Lực điện không đổi vuông góc vận tốc ban đầu tạo chuyển động tương tự ném ngang với quỹ đạo parabol.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một hạt bụi khối lượng $m = 10^{-11}\\text{ kg}$ nằm lơ lửng cân bằng giữa hai bản tụ phẳng đặt nằm ngang cách nhau $d = 2\\text{ cm}$, bản trên tích điện dương, hiệu điện thế $U = 1000\\text{ V}$ ($g = 10\\text{ m/s}^2$). Xác định dấu và độ lớn điện tích hạt bụi.',
        hints: ['Lực điện hướng lên trên cân bằng trọng lực: bản trên dương $\\implies \\vec{E}$ hướng xuống, muốn $\\vec{F}$ hướng lên thì $q < 0$.'],
        solutionSteps: [
          'Cường độ điện trường hướng xuống: $E = \\frac{U}{d} = \\frac{1000}{0{,}02} = 5 \\cdot 10^4\\text{ V/m}$.',
          'Để lực điện hướng lên cân bằng trọng lực, hạt bụi phải mang điện tích **âm** ($q < 0$).',
          '$|q| E = m g \\implies |q| = \\frac{10^{-11} \\cdot 10}{5 \\cdot 10^4} = 2 \\cdot 10^{-15}\\text{ C}$.'
        ],
        finalAnswer: '$q = -2 \\cdot 10^{-15}\\text{ C}$.'
      }
    ]
  },
  {
    id: 'phys-11-b19',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương III · Điện trường',
    sourceTag: SRC_11,
    lessonNumber: 19,
    title: 'Bài 19: Thế năng điện',
    subtitle: 'Công của lực điện A = qEd (độc lập hình dạng đường đi), trường tĩnh điện là trường thế và thế năng điện tích W_M',
    description:
      'Chứng minh công lực điện trong điện trường đều chỉ phụ thuộc vị trí điểm đầu – cuối và định nghĩa thế năng điện trường của điện tích $q$.',
    theorySections: [
      {
        heading: '1. Công của lực điện trong điện trường đều',
        content:
          '• Khi điện tích $q$ di chuyển từ $M$ đến $N$ trong điện trường đều $\\vec{E}$, công của lực điện:\n$$A_{MN} = q E d$$\n(trong đó $d = \\overline{M\'N\'}$ là độ dài đại số hình chiếu đường đi lên phương đường sức; **không phụ thuộc hình dạng đường đi** → trường tĩnh điện là **trường thế**).'
      },
      {
        heading: '2. Thế năng của điện tích trong điện trường',
        content:
          '• **Thế năng điện** $W_M$ của điện tích $q$ tại điểm $M$ bằng công lực điện đưa $q$ từ $M$ ra vô cực (nơi chọn mốc $W_\\infty = 0$): $W_M = A_{M\\infty}$.\n• Liên hệ công và độ giảm thế năng: $A_{MN} = W_M - W_N$.'
      }
    ],
    keyFormulas: ['A_{MN} = q E d', 'A_{MN} = W_M - W_N'],
    ...SIM_PRESETS.electric_field,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Khi điện tích $q = 2 \\cdot 10^{-6}\\text{ C}$ di chuyển theo một đường cong kín $M \\to N \\to P \\to M$ trong điện trường tĩnh, công của lực điện bằng:',
        options: ['A. Phụ thuộc chu vi đường cong', 'B. Bằng 0', 'C. Dương nếu đi cùng chiều kim đồng hồ', 'D. Âm'],
        correctIndex: 1,
        explanation: 'Vì trường tĩnh điện là trường thế ($A_{MM} = W_M - W_M = 0$), công trên mọi đường cong kín luôn bằng 0.'
      },
      {
        source: SRC_11,
        question: 'Điện tích $q = 5\\cdot 10^{-6}\\text{ C}$ dịch chuyển dọc theo chiều đường sức một đoạn $d = 20\\text{ cm}$ trong điện trường đều $E = 4000\\text{ V/m}$. Công của lực điện là:',
        options: ['A. 4 J', 'B. 4 mJ', 'C. 0,4 J', 'D. 40 mJ'],
        correctIndex: 1,
        explanation: '$A = q E d = 5\\cdot 10^{-6} \\cdot 4000 \\cdot 0{,}2 = 0{,}004\\text{ J} = 4\\text{ mJ}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một electron ($q = -1{,}6\\cdot 10^{-19}\\text{ C}$) di chuyển ngược chiều đường sức điện trường đều $E = 2000\\text{ V/m}$ đi được quãng đường $5\\text{ cm}$. Tính công của lực điện và độ biến thiên thế năng điện của electron.',
        hints: ['Vì đi ngược chiều đường sức nên $d = -0{,}05\\text{ m}$ và $q < 0 \\implies A > 0$.'],
        solutionSteps: [
          'Độ dài đại số $d = -0{,}05\\text{ m}$. Công lực điện: $A = (-1{,}6\\cdot 10^{-19}) \\cdot 2000 \\cdot (-0{,}05) = +1{,}6 \\cdot 10^{-17}\\text{ J}$.',
          'Độ biến thiên thế năng: $\\Delta W_t = -A = -1{,}6 \\cdot 10^{-17}\\text{ J}$ (thế năng giảm).'
        ],
        finalAnswer: '$A = 1{,}6 \\cdot 10^{-17}\\text{ J}$, thế năng giảm $1{,}6 \\cdot 10^{-17}\\text{ J}$.'
      }
    ]
  },
  {
    id: 'phys-11-b20',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương III · Điện trường',
    sourceTag: SRC_11,
    lessonNumber: 20,
    title: 'Bài 20: Điện thế',
    subtitle: 'Điện thế V_M = W_M/q, hiệu điện thế U_MN = V_M - V_N = A_MN/q, liên hệ U = E·d và mặt đẳng thế',
    description:
      'Phân biệt điện thế tại một điểm (đơn vị Vôn) với hiệu điện thế giữa hai điểm và vận dụng định lý động năng $A_{MN} = q U_{MN} = \\frac{1}{2}m(v_N^2 - v_M^2)$.',
    theorySections: [
      {
        heading: '1. Điện thế & Hiệu điện thế',
        content:
          '• **Điện thế ($V_M$)**: Đặc trưng cho điện trường về phương diện tạo ra thế năng: $V_M = \\frac{W_M}{q} = \\frac{A_{M\\infty}}{q}$ (đơn vị Vôn, $\\text{V}$).\n• **Hiệu điện thế**: $U_{MN} = V_M - V_N = \\frac{A_{MN}}{q} \\implies A_{MN} = q U_{MN}$.\n• Trong điện trường đều: $U_{MN} = E \\cdot d$.'
      },
      {
        heading: '2. Động năng hạt mang điện tăng tốc bởi Hiệu điện thế',
        content:
          '• Điện tích $q$ chuyển động qua hiệu điện thế $U_{MN}$ thu thêm (hoặc mất đi) động năng bằng đúng công lực điện: $\\frac{1}{2}m v_N^2 - \\frac{1}{2}m v_M^2 = q U_{MN}$.'
      }
    ],
    keyFormulas: ['V_M = \\frac{W_M}{q}, \\qquad U_{MN} = V_M - V_N = \\frac{A_{MN}}{q}', 'U = E \\cdot d'],
    ...SIM_PRESETS.electric_field,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Hiệu điện thế giữa hai điểm M và N là $U_{MN} = 10\\text{ V}$. Công lực điện làm di chuyển điện tích $q = 2\\text{ mC}$ từ M đến N là:',
        options: ['A. 5 mJ', 'B. 20 mJ', 'C. 0,2 J', 'D. 20 J'],
        correctIndex: 1,
        explanation: '$A_{MN} = q U_{MN} = 2\\cdot 10^{-3} \\cdot 10 = 20 \\cdot 10^{-3}\\text{ J} = 20\\text{ mJ}$.'
      },
      {
        source: SRC_11,
        question: 'Điện thế tại điểm M có giá trị $V_M = 20\\text{ V}$, tại điểm N là $V_N = -5\\text{ V}$. Hiệu điện thế $U_{MN}$ bằng:',
        options: ['A. 15 V', 'B. -25 V', 'C. 25 V', 'D. -15 V'],
        correctIndex: 2,
        explanation: '$U_{MN} = V_M - V_N = 20 - (-5) = 25\\text{ V}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một electron được tăng tốc từ trạng thái đứng yên qua hiệu điện thế $U = 1000\\text{ V}$ (biết $m_e = 9{,}1\\cdot 10^{-31}\\text{ kg}$, $|e| = 1{,}6\\cdot 10^{-19}\\text{ C}$). Tính tốc độ của electron đạt được.',
        hints: ['Dùng định lý động năng: $\\frac{1}{2}m_e v^2 = |e| U$.'],
        solutionSteps: [
          '$v = \\sqrt{\\frac{2 |e| U}{m_e}} = \\sqrt{\\frac{2 \\cdot 1{,}6\\cdot 10^{-19} \\cdot 1000}{9{,}1\\cdot 10^{-31}}} \\approx \\sqrt{3{,}516 \\cdot 10^{14}} \\approx 1{,}875 \\cdot 10^7\\text{ m/s}$.'
        ],
        finalAnswer: '$v \\approx 1{,}88 \\cdot 10^7\\text{ m/s}$.'
      }
    ]
  },
  {
    id: 'phys-11-capacitor',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương III · Điện trường',
    sourceTag: SRC_11,
    lessonNumber: 21,
    title: 'Bài 21: Tụ điện',
    subtitle: 'Cấu tạo tụ điện, điện dung C = Q/U (Fara), ghép tụ nối tiếp – song song và năng lượng điện trường trong tụ W = ½CU²',
    description:
      'Hiểu nguyên lý tích – phóng điện của tụ điện, cách tính điện dung bộ tụ ghép nối tiếp/song song và công thức năng lượng tích trữ $W = \\frac{1}{2}CU^2$.',
    theorySections: [
      {
        heading: '1. Tụ điện & Điện dung C = Q / U',
        content:
          '• **Tụ điện**: Gồm hai vật dẫn đặt gần nhau ngăn cách bởi lớp điện môi. Dùng để tích trữ năng lượng điện trường và lọc tín hiệu.\n• **Điện dung ($C$)**: $C = \\frac{Q}{U}$ (đơn vị Fara, $\\text{F}$; $1\\,\\mu\\text{F} = 10^{-6}\\text{ F}$; $1\\text{ nF} = 10^{-9}\\text{ F}$; $1\\text{ pF} = 10^{-12}\\text{ F}$).'
      },
      {
        heading: '2. Ghép tụ điện & Năng lượng điện trường tụ điện',
        content:
          '• **Ghép song song**: $U = U_1 = U_2$; $Q = Q_1 + Q_2$; $C = C_1 + C_2$.\n• **Ghép nối tiếp**: $Q = Q_1 = Q_2$; $U = U_1 + U_2$; $\\frac{1}{C} = \\frac{1}{C_1} + \\frac{1}{C_2}$.\n• **Năng lượng của tụ điện**: $W = \\frac{1}{2} Q U = \\frac{1}{2} C U^2 = \\frac{Q^2}{2C}$.'
      }
    ],
    keyFormulas: [
      'Q = C \\cdot U, \\qquad W = \\frac{1}{2} C U^2 = \\frac{1}{2} Q U = \\frac{Q^2}{2C}',
      'C_{\\text{ss}} = C_1 + C_2, \\qquad \\frac{1}{C_{\\text{nt}}} = \\frac{1}{C_1} + \\frac{1}{C_2}'
    ],
    ...SIM_PRESETS.capacitor,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Một tụ điện có điện dung $C = 20\\,\\mu\\text{F}$ được tích điện ở hiệu điện thế $U = 100\\text{ V}$. Năng lượng điện trường tích trữ trong tụ là:',
        options: ['A. 0,1 J', 'B. 0,2 J', 'C. 1,0 mJ', 'D. 200 J'],
        correctIndex: 0,
        explanation: '$W = \\frac{1}{2} C U^2 = \\frac{1}{2} \\cdot 20\\cdot 10^{-6} \\cdot 100^2 = 0{,}1\\text{ J}$.'
      },
      {
        source: SRC_11,
        question: 'Ghép nối tiếp hai tụ $C_1 = 6\\,\\mu\\text{F}$ và $C_2 = 3\\,\\mu\\text{F}$. Điện dung tương đương của bộ tụ bằng:',
        options: ['A. 9 μF', 'B. 2 μF', 'C. 4,5 μF', 'D. 18 μF'],
        correctIndex: 1,
        explanation: '$C_{\\text{nt}} = \\frac{C_1 C_2}{C_1 + C_2} = \\frac{6 \\cdot 3}{6 + 3} = 2\\,\\mu\\text{F}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Hai tụ $C_1 = 4\\,\\mu\\text{F}$ và $C_2 = 6\\,\\mu\\text{F}$ mắc song song vào nguồn $U = 50\\text{ V}$. Tính điện dung bộ tụ, điện tích mỗi tụ và tổng năng lượng tích trữ.',
        hints: ['Mắc song song có cùng $U = 50\\text{ V}$ và $C = C_1 + C_2$.'],
        solutionSteps: [
          'Điện dung tương đương: $C = 4 + 6 = 10\\,\\mu\\text{F}$.',
          'Điện tích từng tụ: $Q_1 = C_1 U = 4 \\cdot 50 = 200\\,\\mu\\text{C}$; $Q_2 = 6 \\cdot 50 = 300\\,\\mu\\text{C}$.',
          'Tổng năng lượng: $W = \\frac{1}{2} C U^2 = \\frac{1}{2} \\cdot 10\\cdot 10^{-6} \\cdot 50^2 = 0{,}0125\\text{ J} = 12{,}5\\text{ mJ}$.'
        ],
        finalAnswer: '$C = 10\\,\\mu\\text{F}$, $Q_1 = 200\\,\\mu\\text{C}$, $Q_2 = 300\\,\\mu\\text{C}$, $W = 12{,}5\\text{ mJ}$.'
      }
    ]
  },

  // ================= CHƯƠNG IV. DÒNG ĐIỆN, MẠCH ĐIỆN (BÀI 22 - 26) =================
  {
    id: 'phys-11-b22',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương IV · Dòng điện, Mạch điện',
    sourceTag: SRC_11,
    lessonNumber: 22,
    title: 'Bài 22: Cường độ dòng điện',
    subtitle: 'Dòng điện không đổi I = Δq/Δt, mật độ hạt tải điện và biểu thức tốc độ trôi v = I/(S·n·e)',
    description:
      'Tìm hiểu bản chất dòng chuyển dời có hướng của electron tự do trong kim loại, công thức định nghĩa cường độ dòng điện và tốc độ dịch chuyển có hướng (tốc độ trôi) $v$.',
    theorySections: [
      {
        heading: '1. Cường độ dòng điện không đổi',
        content:
          '• **Cường độ dòng điện**: $I = \\frac{\\Delta q}{\\Delta t}$ (đơn vị Ampe, $\\text{A}$).\n• Với dòng điện không đổi: $q = I \\cdot t$ (số electron đi qua tiết diện dây trong thời gian $t$: $N = \\frac{q}{e} = \\frac{I t}{1{,}6 \\cdot 10^{-19}}$).'
      },
      {
        heading: '2. Biểu thức liên hệ I với tốc độ trôi của hạt mang điện',
        content:
          '• Xét dây dẫn tiết diện $S$, mật độ hạt mang điện tự do $n$ ($\\text{m}^{-3}$), mỗi hạt mang điện tích $e$ chuyển động trôi với tốc độ $v$:\n$$I = S \\cdot n \\cdot v \\cdot e$$'
      }
    ],
    keyFormulas: ['I = \\frac{\\Delta q}{\\Delta t}, \\qquad N_e = \\frac{I t}{|e|}', 'I = S \\cdot n \\cdot v \\cdot |e|'],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Dòng điện không đổi cường độ $I = 0{,}8\\text{ A}$ chạy qua dây dẫn trong $10\\text{ s}$. Số electron chạy qua tiết diện thẳng dây dẫn là:',
        options: ['A. $5 \\cdot 10^{19}$', 'B. $5 \\cdot 10^{18}$', 'C. $8 \\cdot 10^{19}$', 'D. $1{,}25 \\cdot 10^{19}$'],
        correctIndex: 0,
        explanation: '$N = \\frac{I t}{|e|} = \\frac{0{,}8 \\cdot 10}{1{,}6\\cdot 10^{-19}} = 5 \\cdot 10^{19}$ electron.'
      },
      {
        source: SRC_11,
        question: 'Trong công thức $I = S n v e$, đại lượng $v$ biểu diễn điều gì?',
        options: [
          'A. Tốc độ ánh sáng trong kim loại',
          'B. Tốc độ dịch chuyển có hướng (tốc độ trôi) của hạt tải điện',
          'C. Tốc độ chuyển động nhiệt hỗn loạn',
          'D. Hiệu điện thế'
        ],
        correctIndex: 1,
        explanation: '$v$ là tốc độ dịch chuyển có hướng (tốc độ trôi) rất nhỏ (cỡ mm/s) của các hạt tải điện.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Dây đồng tiết diện $S = 1\\text{ mm}^2$ có dòng điện $I = 1{,}6\\text{ A}$, mật độ electron tự do $n = 8 \\cdot 10^{28}\\text{ m}^{-3}$. Tính tốc độ trôi của electron trong dây đồng.',
        hints: ['Đổi $S = 10^{-6}\\text{ m}^2$ và dùng $v = \\frac{I}{S n e}$.'],
        solutionSteps: [
          'Đổi $S = 1\\text{ mm}^2 = 10^{-6}\\text{ m}^2$.',
          'Tốc độ trôi: $v = \\frac{1{,}6}{10^{-6} \\cdot 8 \\cdot 10^{28} \\cdot 1{,}6 \\cdot 10^{-19}} = \\frac{1}{8 \\cdot 10^3} = 1{,}25 \\cdot 10^{-4}\\text{ m/s} = 0{,}125\\text{ mm/s}$.'
        ],
        finalAnswer: '$v = 1{,}25 \\cdot 10^{-4}\\text{ m/s}$ ($0{,}125\\text{ mm/s}$).'
      }
    ]
  },
  {
    id: 'phys-11-b23',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương IV · Dòng điện, Mạch điện',
    sourceTag: SRC_11,
    lessonNumber: 23,
    title: 'Bài 23: Điện trở. Định luật Ohm',
    subtitle: 'Định luật Ohm cho vật dẫn kim loại, đường đặc trưng Vôn-Ampe của điện trở – đèn sợi đốt – điốt bán dẫn và ảnh hưởng nhiệt độ lên R',
    description:
      'Khảo sát đường đặc trưng Vôn – Ampe ($I - U$), nguyên nhân tỏa nhiệt gây điện trở trong kim loại và hành vi của điện trở nhiệt (NTC) – quang điện trở (LDR).',
    theorySections: [
      {
        heading: '1. Điện trở & Định luật Ohm',
        content:
          '• **Định luật Ohm**: $I = \\frac{U}{R} \\iff R = \\frac{U}{I}$ (đối với vật dẫn kim loại ở nhiệt độ không đổi, đường đặc trưng $I - U$ là đường thẳng qua gốc tọa độ có độ dốc $1/R$).'
      },
      {
        heading: '2. Biến thiên điện trở theo nhiệt độ & Linh kiện phi tuyến',
        content:
          '• Với **bóng đèn sợi đốt**, khi $U$ tăng làm dây tóc nóng sáng mạnh khiến $R$ tăng nên đường $I - U$ cong xuống.\n• Với **nhiệt điện trở NTC** (bán dẫn), nhiệt độ tăng làm mật độ hạt tải tăng mạnh khiến điện trở $R$ **giảm**.'
      }
    ],
    keyFormulas: ['I = \\frac{U}{R}', 'R_t = R_0[1 + \\alpha(t - t_0)] \\quad (\\text{kim loại})'],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Đồ thị đường đặc trưng Vôn – Ampe ($I$ theo $U$) của một điện trở tuyến tính có dạng là:',
        options: ['A. Đường tròn', 'B. Đường parabol', 'C. Đường thẳng đi qua gốc tọa độ', 'D. Đường hypebol'],
        correctIndex: 2,
        explanation: 'Vì $R$ là hằng số nên $I = \\frac{1}{R}U$ là hàm bậc nhất đi qua gốc tọa độ.'
      },
      {
        source: SRC_11,
        question: 'Khi tăng nhiệt độ của nhiệt điện trở NTC và dây dẫn kim loại lên cùng lúc, điện trở của chúng thay đổi ra sao?',
        options: [
          'A. Cả hai đều tăng',
          'B. Kim loại tăng, nhiệt điện trở NTC giảm',
          'C. Kim loại giảm, NTC tăng',
          'D. Cả hai không đổi'
        ],
        correctIndex: 1,
        explanation: 'Kim loại tăng nhiệt độ làm mạng tinh thể dao động mạnh tăng cản trở ($R$ tăng); bán dẫn NTC tăng nhiệt độ giải phóng thêm hạt tải nên $R$ giảm.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Đường đặc trưng $I - U$ của điện trở $R_1$ đi qua điểm $(U = 6\\text{ V}, I = 0{,}5\\text{ A})$, của $R_2$ đi qua điểm $(U = 6\\text{ V}, I = 1{,}5\\text{ A})$. Tính $R_1, R_2$ và điện trở tương đương khi mắc nối tiếp, song song.',
        hints: ['Tính $R = U/I$ cho từng điện trở trước.'],
        solutionSteps: [
          '$R_1 = \\frac{6}{0{,}5} = 12\\,\\Omega$; $R_2 = \\frac{6}{1{,}5} = 4\\,\\Omega$.',
          'Mắc nối tiếp: $R_{nt} = 12 + 4 = 16\\,\\Omega$.',
          'Mắc song song: $R_{ss} = \\frac{12 \\cdot 4}{12 + 4} = 3\\,\\Omega$.'
        ],
        finalAnswer: '$R_1 = 12\\,\\Omega$, $R_2 = 4\\,\\Omega$; $R_{nt} = 16\\,\\Omega$, $R_{ss} = 3\\,\\Omega$.'
      }
    ]
  },
  {
    id: 'phys-11-dc',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương IV · Dòng điện, Mạch điện',
    sourceTag: SRC_11,
    lessonNumber: 24,
    title: 'Bài 24: Nguồn điện',
    subtitle: 'Suất điện động E = A_lạ/q, điện trở trong r, Định luật Ohm cho toàn mạch kín I = E/(R_N + r) và hiệu điện thế cực U = E - Ir',
    description:
      'Hiểu bản chất lực lạ tách điện tích trong nguồn điện, tính cường độ dòng điện toàn mạch $I = \\frac{\\mathcal{E}}{R_N + r}$ và độ sụt áp trong nguồn $Ir$.',
    theorySections: [
      {
        heading: '1. Suất điện động & Điện trở trong',
        content:
          '• **Suất điện động ($\\mathcal{E}$)**: Đặc trưng cho khả năng thực hiện công của lực lạ bên trong nguồn điện: $\\mathcal{E} = \\frac{A_{\\text{lạ}}}{q}$ (đơn vị Vôn, $\\text{V}$). Khi mạch hở ($I = 0$), hiệu điện thế hai cực bằng đúng $\\mathcal{E}$.\n• Mỗi nguồn thực tế luôn có **điện trở trong ($r$)**.'
      },
      {
        heading: '2. Định luật Ohm cho toàn mạch kín',
        content:
          '• Mạch gồm nguồn ($\\mathcal{E}, r$) nối điện trở ngoài $R_N$:\n$$I = \\frac{\\mathcal{E}}{R_N + r}, \\qquad U_N = I R_N = \\mathcal{E} - I r$$'
      }
    ],
    keyFormulas: ['\\mathcal{E} = \\frac{A}{q}, \\qquad I = \\frac{\\mathcal{E}}{R_N + r}', 'U_N = \\mathcal{E} - I r'],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Mắc điện trở $R = 4\\,\\Omega$ vào nguồn điện có $\\mathcal{E} = 12\\text{ V}$, điện trở trong $r = 2\\,\\Omega$. Cường độ dòng điện và hiệu điện thế hai cực nguồn là:',
        options: ['A. 2 A và 8 V', 'B. 3 A và 12 V', 'C. 2 A và 4 V', 'D. 6 A và 8 V'],
        correctIndex: 0,
        explanation: '$I = \\frac{12}{4 + 2} = 2\\text{ A}$; $U_N = \\mathcal{E} - Ir = 12 - 2\\cdot 2 = 8\\text{ V}$.'
      },
      {
        source: SRC_11,
        question: 'Hiện tượng đoản mạch xảy ra khi nối hai cực nguồn điện bằng dây dẫn điện trở xấp xỉ $0$ ($R_N \\to 0$). Lúc này dòng điện đạt giá trị:',
        options: ['A. Bằng 0', 'B. $I_{\\max} = \\mathcal{E}/r$ rất lớn gây nóng cháy nguy hiểm', 'C. Bằng $r/\\mathcal{E}$', 'D. Không đổi'],
        correctIndex: 1,
        explanation: 'Khi $R_N \\to 0$, $I = \\mathcal{E}/r$ đạt cực đại rất lớn dễ gây cháy nổ.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một nguồn điện khi mắc mạch ngoài $R_1 = 3\\,\\Omega$ thì dòng qua mạch $I_1 = 2\\text{ A}$; khi thay bằng $R_2 = 8\\,\\Omega$ thì dòng $I_2 = 1\\text{ A}$. Tìm suất điện động $\\mathcal{E}$ và điện trở trong $r$ của nguồn.',
        hints: ['Viết hệ 2 phương trình $\\mathcal{E} = I_1(R_1 + r) = I_2(R_2 + r)$.'],
        solutionSteps: [
          'Ta có $2(3 + r) = 1(8 + r) \\iff 6 + 2r = 8 + r \\implies r = 2\\,\\Omega$.',
          'Suất điện động: $\\mathcal{E} = 2(3 + 2) = 10\\text{ V}$.'
        ],
        finalAnswer: '$\\mathcal{E} = 10\\text{ V}$, $r = 2\\,\\Omega$.'
      }
    ]
  },
  {
    id: 'phys-11-b25',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương IV · Dòng điện, Mạch điện',
    sourceTag: SRC_11,
    lessonNumber: 25,
    title: 'Bài 25: Năng lượng và công suất điện',
    subtitle: 'Năng lượng tiêu thụ A = UIt, công suất điện P = UI, công suất nguồn P_nguồn = EI, công suất cực đại mạch ngoài và hiệu suất nguồn H',
    description:
      'Tính điện năng tiêu thụ, công và công suất toàn phần của nguồn điện ($\\mathcal{P}_{\\text{ng}} = \\mathcal{E}I$), hiệu suất nguồn điện $H = \\frac{U_N}{\\mathcal{E}}$ và bài toán tìm $R_N = r$ để $P_N$ cực đại.',
    theorySections: [
      {
        heading: '1. Năng lượng & Công suất tiêu thụ của đoạn mạch',
        content:
          '• Năng lượng điện tiêu thụ: $A = U I t$ ($\\text{J}$); Công suất điện: $\\mathcal{P} = U I$ ($\\text{W}$).\n• Nhiệt lượng tỏa ra trên điện trở thuần (Jun – Len-xơ): $Q = I^2 R t$, công suất tỏa nhiệt $\\mathcal{P} = I^2 R = \\frac{U^2}{R}$.'
      },
      {
        heading: '2. Công suất nguồn điện & Hiệu suất nguồn',
        content:
          '• Công của nguồn điện: $A_{\\text{ng}} = \\mathcal{E} I t$; Công suất nguồn: $\\mathcal{P}_{\\text{ng}} = \\mathcal{E} I$.\n• Hiệu suất của nguồn: $H = \\frac{U_N}{\\mathcal{E}} = \\frac{R_N}{R_N + r}$.\n• Công suất mạch ngoài $P_N = I^2 R_N$ đạt **cực đại** $P_{N,\\max} = \\frac{\\mathcal{E}^2}{4r}$ khi $R_N = r$.'
      }
    ],
    keyFormulas: [
      '\\mathcal{P}_{\\text{ng}} = \\mathcal{E} I, \\qquad H = \\frac{U_N}{\\mathcal{E}} = \\frac{R_N}{R_N + r}',
      'P_{N,\\max} = \\frac{\\mathcal{E}^2}{4r} \\iff R_N = r'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Nguồn điện có $\\mathcal{E} = 12\\text{ V}, r = 1\\,\\Omega$ nối mạch ngoài $R = 5\\,\\Omega$. Hiệu suất của nguồn điện này bằng:',
        options: ['A. 83,3%', 'B. 16,7%', 'C. 50%', 'D. 90%'],
        correctIndex: 0,
        explanation: '$H = \\frac{R}{R + r} = \\frac{5}{5 + 1} \\approx 83{,}3\\%$.'
      },
      {
        source: SRC_11,
        question: 'Nguồn điện $(\\mathcal{E} = 6\\text{ V}, r = 1{,}5\\,\\Omega)$ phát ra công suất mạch ngoài lớn nhất bằng bao nhiêu khi điều chỉnh biến trở $R$?',
        options: ['A. 6 W', 'B. 12 W', 'C. 24 W', 'D. 3 W'],
        correctIndex: 0,
        explanation: '$P_{N,\\max} = \\frac{\\mathcal{E}^2}{4r} = \\frac{36}{4 \\cdot 1{,}5} = 6\\text{ W}$ (khi $R = r = 1{,}5\\,\\Omega$).'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một nguồn điện $\\mathcal{E} = 9\\text{ V}, r = 1\\,\\Omega$ cấp điện cho biến trở $R = 8\\,\\Omega$. Tính công suất tiêu thụ trên biến trở $R$, công suất toàn phần của nguồn và hiệu suất của nguồn.',
        hints: ['Tính $I = \\mathcal{E}/(R+r)$ trước.'],
        solutionSteps: [
          'Cường độ dòng điện: $I = \\frac{9}{8 + 1} = 1\\text{ A}$.',
          'Công suất mạch ngoài: $P_N = I^2 R = 1^2 \\cdot 8 = 8\\text{ W}$.',
          'Công suất nguồn: $P_{\\text{ng}} = \\mathcal{E} I = 9 \\cdot 1 = 9\\text{ W}$.',
          'Hiệu suất nguồn: $H = \\frac{8}{9} \\approx 88{,}9\\%$.'
        ],
        finalAnswer: '$P_N = 8\\text{ W}$, $P_{\\text{ng}} = 9\\text{ W}$, $H \\approx 88{,}9\\%$.'
      }
    ]
  },
  {
    id: 'phys-11-b26',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương IV · Dòng điện, Mạch điện',
    sourceTag: SRC_11,
    lessonNumber: 26,
    title: 'Bài 26: Thực hành: Đo suất điện động và điện trở trong của pin điện hóa',
    subtitle: 'Lắp mạch biến trở đo nhiều cặp (U, I), vẽ đồ thị đường thẳng U = E − rI để xác định tung độ gốc E và hệ số góc -r',
    description:
      'Thực hành thí nghiệm chuẩn Vật lí 11: thay đổi biến trở để thu thập cặp giá trị $(I, U)$, tuyến tính hóa đồ thị $U(I)$ xác định $\\mathcal{E}$ (giao trục tung) và $r$ (độ dốc).',
    theorySections: [
      {
        heading: '1. Sơ đồ mạch điện và Phương pháp đo',
        content:
          '• Mắc nối tiếp pin điện hóa $(\\mathcal{E}, r)$ với biến trở $R$, điện trở bảo vệ $R_0$, khóa K và ampe kế; vôn kế mắc song song hai cực của pin.\n• Thay đổi giá trị biến trở qua 5–6 nấc, ghi cặp số chỉ $(I, U)$ tương ứng và ngắt khóa K ngay sau mỗi lần đọc để tránh pin sụt áp.'
      },
      {
        heading: '2. Xử lý đồ thị U theo I',
        content:
          '• Từ $U = \\mathcal{E} - r I$: Đồ thị $U(I)$ là đoạn thẳng dốc xuống.\n• Giao điểm với trục tung ($I = 0$) chính là suất điện động $\\mathcal{E}$.\n• Độ lớn hệ số góc đường thẳng chính là điện trở trong: $r = \\frac{\\Delta U}{\\Delta I} = \\frac{U_1 - U_2}{I_2 - I_1}$.'
      }
    ],
    keyFormulas: ['U = \\mathcal{E} - r I', 'r = \\left|\\frac{U_2 - U_1}{I_2 - I_1}\\right|'],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Từ đồ thị thực nghiệm $U(I)$ của một pin, đo được hai điểm $(I_1 = 0{,}2\\text{ A}, U_1 = 1{,}40\\text{ V})$ và $(I_2 = 0{,}6\\text{ A}, U_2 = 1{,}20\\text{ V})$. Suất điện động và điện trở trong của pin là:',
        options: [
          'A. $\\mathcal{E} = 1{,}50\\text{ V};\\; r = 0{,}5\\,\\Omega$',
          'B. $\\mathcal{E} = 1{,}40\\text{ V};\\; r = 0{,}5\\,\\Omega$',
          'C. $\\mathcal{E} = 1{,}50\\text{ V};\\; r = 2{,}0\\,\\Omega$',
          'D. $\\mathcal{E} = 1{,}60\\text{ V};\\; r = 1{,}0\\,\\Omega$'
        ],
        correctIndex: 0,
        explanation: '$r = \\frac{1{,}40 - 1{,}20}{0{,}6 - 0{,}2} = 0{,}5\\,\\Omega \\implies \\mathcal{E} = 1{,}40 + 0{,}2 \\cdot 0{,}5 = 1{,}50\\text{ V}$.'
      },
      {
        source: SRC_11,
        question: 'Khi tiến hành thí nghiệm đo $(\\mathcal{E}, r)$ của pin, vì sao chỉ nên đóng khóa K trong khoảng thời gian ngắn khi đọc số liệu?',
        options: [
          'A. Để tránh pin bị phân cực nhanh, nóng lên làm thay đổi $\\mathcal{E}$ và $r$ trong lúc đo',
          'B. Để tăng điện trở trong lên thật lớn',
          'C. Để vôn kế không đo được hiệu điện thế',
          'D. Để làm đổi chiều dòng điện'
        ],
        correctIndex: 0,
        explanation: 'Dòng chạy lâu làm pin nóng và phân cực điện hóa khiến $\\mathcal{E}$ sụt giảm, làm sai lệch kết quả.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Đồ thị đường thẳng biểu diễn sự phụ thuộc hiệu điện thế cực $U$ theo cường độ dòng $I$ cắt trục tung tại $U = 4{,}5\\text{ V}$ và cắt trục hoành (khi $U = 0$) tại $I = 3{,}0\\text{ A}$. Xác định $\\mathcal{E}$ và $r$ của bộ pin.',
        hints: ['Giao trục tung là $\\mathcal{E}$, giao trục hoành là $I_{\\text{ngắn mạch}} = \\mathcal{E}/r$.'],
        solutionSteps: [
          'Tại $I = 0$: $\\mathcal{E} = U = 4{,}5\\text{ V}$.',
          'Tại $U = 0$: $0 = \\mathcal{E} - r I \\implies r = \\frac{4{,}5}{3{,}0} = 1{,}5\\,\\Omega$.'
        ],
        finalAnswer: '$\\mathcal{E} = 4{,}5\\text{ V}$, $r = 1{,}5\\,\\Omega$.'
      }
    ]
  }
];
