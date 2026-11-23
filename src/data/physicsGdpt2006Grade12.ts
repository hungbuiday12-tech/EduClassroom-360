import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const SRC_12 = 'GDPT 2006 · Vật lí 12 Cơ bản (NXB Giáo dục Việt Nam)';

export const PHYSICS_GDPT_2006_GRADE_12: PhysicsLesson[] = [
  // ==================== CHƯƠNG I: DAO ĐỘNG CƠ (Bài 1–5) ====================
  {
    id: 'phys-2006-12-1',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương I: Dao động cơ',
    sourceTag: SRC_12,
    lessonNumber: 1,
    title: 'Bài 1 (2006): Dao động điều hòa',
    subtitle: 'Phương trình li độ x = Acos(ωt + φ), vận tốc, gia tốc, mối liên hệ đường tròn đều và hệ thức độc lập thời gian',
    description:
      'Thiết lập các đại lượng đặc trưng của dao động điều hòa ($A, \\omega, \\varphi, T, f$), mối liên hệ $v = x\' = -\\omega A\\sin(\\omega t+\\varphi)$, $a = -\\omega^2 x$ và đường tròn pha.',
    theorySections: [
      {
        heading: '1. Phương trình li độ, vận tốc và gia tốc',
        content:
          '• **Li độ**: $x = A\\cos(\\omega t + \\varphi)$ ($A > 0$ là biên độ, $\\omega$ là tần số góc, $\\varphi$ là pha ban đầu).\n• **Vận tốc** sớm pha $\\frac{\\pi}{2}$ so với $x$: $v = -\\omega A\\sin(\\omega t + \\varphi)$, $|v_{\\max}| = \\omega A$ tại VTCB.\n• **Gia tốc** ngược pha với $x$: $a = -\\omega^2 A\\cos(\\omega t + \\varphi) = -\\omega^2 x$, $|a_{\\max}| = \\omega^2 A$ tại hai biên.'
      },
      {
        heading: '2. Hệ thức độc lập thời gian',
        content:
          '• Chu kì $T = \\frac{2\\pi}{\\omega}$, tần số $f = \\frac{1}{T} = \\frac{\\omega}{2\\pi}$.\n• Hệ thức độc lập: $A^2 = x^2 + \\frac{v^2}{\\omega^2} \\iff \\left(\\frac{x}{A}\\right)^2 + \\left(\\frac{v}{v_{\\max}}\\right)^2 = 1$.'
      }
    ],
    keyFormulas: [
      'x = A\\cos(\\omega t + \\varphi), \\quad v = x\', \\quad a = -\\omega^2 x',
      'A^2 = x^2 + \\frac{v^2}{\\omega^2}, \\quad v_{\\max} = \\omega A, \\quad a_{\\max} = \\omega^2 A'
    ],
    ...SIM_PRESETS.spring,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Một vật dao động điều hòa với phương trình $x = 6\\cos(4\\pi t + \\frac{\\pi}{3})\\text{ (cm)}$. Tốc độ cực đại của vật bằng:',
        options: ['A. $24\\pi\\text{ cm/s}$', 'B. $12\\pi\\text{ cm/s}$', 'C. $96\\pi^2\\text{ cm/s}$', 'D. $6\\pi\\text{ cm/s}$'],
        correctIndex: 0,
        explanation: '$v_{\\max} = \\omega A = 4\\pi \\cdot 6 = 24\\pi\\text{ cm/s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một chất điểm dao động điều hòa với tần số góc $\\omega = 10\\text{ rad/s}$. Khi qua li độ $x = 3\\text{ cm}$, vật có tốc độ $v = 40\\text{ cm/s}$. Tính biên độ $A$ và gia tốc cực đại của vật.',
        hints: ['Thay trực tiếp vào hệ thức độc lập $A^2 = x^2 + (v/\\omega)^2$.'],
        solutionSteps: [
          'Bước 1: $A = \\sqrt{x^2 + \\frac{v^2}{\\omega^2}} = \\sqrt{3^2 + \\left(\\frac{40}{10}\\right)^2} = \\sqrt{9 + 16} = 5\\text{ cm} = 0{,}05\\text{ m}$.',
          'Bước 2: Gia tốc cực đại $a_{\\max} = \\omega^2 A = 10^2 \\cdot 0{,}05 = 5\\text{ m/s}^2$.'
        ],
        finalAnswer: '$A = 5\\text{ cm}$; $a_{\\max} = 5\\text{ m/s}^2$.'
      }
    ]
  },
  {
    id: 'phys-2006-12-2',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương I: Dao động cơ',
    sourceTag: SRC_12,
    lessonNumber: 2,
    title: 'Bài 2 (2006): Con lắc lò xo – Lực kéo về & Năng lượng dao động',
    subtitle: 'Tần số góc ω = √(k/m), chu kì T = 2π√(m/k), lực kéo về F = -kx, động năng – thế năng và bảo toàn cơ năng W = ½kA²',
    description:
      'Khảo sát con lắc lò xo nằm ngang và treo thẳng đứng ($\\Delta l_0 = mg/k$), phân tích sự biến thiên động năng, thế năng tuần hoàn với tần số $2f$ và lực đàn hồi cực đại/cực tiểu.',
    theorySections: [
      {
        heading: '1. Chu kì, tần số & Lực kéo về',
        content:
          '• Tần số góc $\\omega = \\sqrt{\\frac{k}{m}}$; chu kì $T = 2\\pi\\sqrt{\\frac{m}{k}}$ (với con lắc treo thẳng đứng còn có $T = 2\\pi\\sqrt{\\frac{\\Delta l_0}{g}}$).\n• **Lực kéo về (lực hồi phục)** luôn hướng về VTCB: $F_{kv} = -k x = -m\\omega^2 x$.'
      },
      {
        heading: '2. Năng lượng của con lắc lò xo',
        content:
          '• Thế năng: $W_t = \\frac{1}{2}k x^2$; Động năng: $W_{\\text{đ}} = \\frac{1}{2}m v^2$.\n• **Cơ năng** được bảo toàn và tỉ lệ với bình phương biên độ: $W = W_{\\text{đ}} + W_t = \\frac{1}{2}k A^2 = \\frac{1}{2}m\\omega^2 A^2$. Động năng và thế năng biến thiên tuần hoàn với tần số $f\' = 2f$ (chu kì $T\' = T/2$).'
      }
    ],
    keyFormulas: [
      '\\omega = \\sqrt{\\frac{k}{m}}, \\quad T = 2\\pi\\sqrt{\\frac{m}{k}} = 2\\pi\\sqrt{\\frac{\\Delta l_0}{g}}',
      'W = \\frac{1}{2} k A^2 = \\frac{1}{2} m \\omega^2 A^2'
    ],
    ...SIM_PRESETS.spring,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Con lắc lò xo gồm vật $m = 100\\text{ g}$ và lò xo độ cứng $k = 100\\text{ N/m}$ dao động điều hòa với biên độ $A = 4\\text{ cm}$. Cơ năng của con lắc bằng:',
        options: ['A. $0{,}08\\text{ J}$', 'B. $0{,}8\\text{ J}$', 'C. $0{,}16\\text{ J}$', 'D. $800\\text{ J}$'],
        correctIndex: 0,
        explanation: '$W = \\frac{1}{2} k A^2 = \\frac{1}{2} \\cdot 100 \\cdot (0{,}04)^2 = 0{,}08\\text{ J}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một con lắc lò xo treo thẳng đứng có độ cứng $k = 50\\text{ N/m}$, vật nặng $m = 200\\text{ g}$ ($g = 10\\text{ m/s}^2$). Kéo vật xuống dưới VTCB $6\\text{ cm}$ rồi thả nhẹ. Tính độ dãn lò xo ở VTCB, chu kì dao động và lực đàn hồi cực đại của lò xo.',
        hints: ['Tính $\\Delta l_0 = mg/k$; biên độ $A = 6\\text{ cm}$; $F_{\\text{đh}\\max} = k(\\Delta l_0 + A)$.'],
        solutionSteps: [
          'Bước 1: $\\Delta l_0 = \\frac{0{,}2 \\cdot 10}{50} = 0{,}04\\text{ m} = 4\\text{ cm}$.',
          'Bước 2: $T = 2\\pi\\sqrt{\\frac{m}{k}} = 2\\pi\\sqrt{\\frac{0{,}2}{50}} = \\frac{2\\pi}{\\sqrt{250}} \\approx 0{,}397\\text{ s}$.',
          'Bước 3: $F_{\\text{đh}\\max} = k(\\Delta l_0 + A) = 50\\cdot(0{,}04 + 0{,}06) = 5\\text{ N}$.'
        ],
        finalAnswer: '$\\Delta l_0 = 4\\text{ cm}$; $T \\approx 0{,}4\\text{ s}$; $F_{\\text{đh}\\max} = 5\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-2006-12-3',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương I: Dao động cơ',
    sourceTag: SRC_12,
    lessonNumber: 3,
    title: 'Bài 3 (2006): Con lắc đơn – Chu kì & Ứng dụng đo gia tốc trọng trường g',
    subtitle: 'Điều kiện dao động điều hòa (α₀ nhỏ), chu kì T = 2π√(l/g), phương trình li độ góc/dài và công thức lực căng dây',
    description:
      'Thiết lập phương trình dao động điều hòa của con lắc đơn với biên độ góc nhỏ, tính chu kì $T = 2\\pi\\sqrt{l/g}$ không phụ thuộc khối lượng và bài toán con lắc trùng phùng / đo $g$.',
    theorySections: [
      {
        heading: '1. Chu kì & Phương trình dao động của con lắc đơn',
        content:
          '• Khi bỏ qua ma sát và biên độ góc nhỏ ($\\alpha_0 \\le 10^\\circ$): $s = s_0\\cos(\\omega t + \\varphi)$ hay $\\alpha = \\alpha_0\\cos(\\omega t + \\varphi)$ với $s = l\\alpha$.\n• Tần số góc $\\omega = \\sqrt{\\frac{g}{l}}$; **chu kì**: $T = 2\\pi\\sqrt{\\frac{l}{g}}$ (chỉ phụ thuộc chiều dài $l$ và gia tốc $g$ nơi đặt con lắc).'
      },
      {
        heading: '2. Năng lượng & Vận tốc, Lực căng dây',
        content:
          '• Cơ năng (góc nhỏ): $W = \\frac{1}{2} m g l \\alpha_0^2 = \\frac{1}{2} m \\frac{g}{l} s_0^2$.\n• Với góc bất kì: $v = \\sqrt{2 g l (\\cos\\alpha - \\cos\\alpha_0)}$ và lực căng dây $T_{\\text{dây}} = mg(3\\cos\\alpha - 2\\cos\\alpha_0)$.'
      }
    ],
    keyFormulas: [
      '\\omega = \\sqrt{\\frac{g}{l}}, \\quad T = 2\\pi\\sqrt{\\frac{l}{g}}',
      'v = \\sqrt{2gl(\\cos\\alpha - \\cos\\alpha_0)}, \\quad T_{\\text{dây}} = mg(3\\cos\\alpha - 2\\cos\\alpha_0)'
    ],
    ...SIM_PRESETS.pendulum,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Tại nơi có $g = \\pi^2\\text{ m/s}^2$, một con lắc đơn có chiều dài $l = 1\\text{ m}$ dao động điều hòa với chu kì bằng:',
        options: ['A. $1\\text{ s}$', 'B. $2\\text{ s}$', 'C. $0{,}5\\text{ s}$', 'D. $4\\text{ s}$'],
        correctIndex: 1,
        explanation: '$T = 2\\pi\\sqrt{\\frac{1}{\\pi^2}} = 2\\text{ s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Tại cùng một vị trí, con lắc đơn chiều dài $l_1$ có chu kì $T_1 = 1{,}5\\text{ s}$, con lắc đơn chiều dài $l_2$ có chu kì $T_2 = 2{,}0\\text{ s}$. Tính chu kì của con lắc đơn có chiều dài $l = l_1 + l_2$ tại nơi đó.',
        hints: ['Vì $T^2 \\propto l$ nên $T^2 = T_1^2 + T_2^2$.'],
        solutionSteps: [
          'Bước 1: Từ $T = 2\\pi\\sqrt{\\frac{l}{g}} \\Rightarrow l = \\frac{g}{4\\pi^2} T^2$.',
          'Bước 2: Vì $l = l_1 + l_2 \\Rightarrow T^2 = T_1^2 + T_2^2 = 1{,}5^2 + 2{,}0^2 = 6{,}25 \\Rightarrow T = 2{,}5\\text{ s}$.'
        ],
        finalAnswer: '$T = 2{,}5\\text{ s}$.'
      }
    ]
  },
  {
    id: 'phys-2006-12-4',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương I: Dao động cơ',
    sourceTag: SRC_12,
    lessonNumber: 4,
    title: 'Bài 4 (2006): Dao động tắt dần, Dao động duy trì, Cưỡng bức & Cộng hưởng',
    subtitle: 'Phân biệt tắt dần – duy trì – cưỡng bức (tần số bằng tần số ngoại lực f_ng) và điều kiện cộng hưởng f = f₀',
    description:
      'Phân tích nguyên nhân tắt dần (ma sát/lực cản), nguyên tắc đồng hồ quả lắc (dao động duy trì), tính chất dao động cưỡng bức và lợi – hại của hiện tượng cộng hưởng cơ.',
    theorySections: [
      {
        heading: '1. Dao động tắt dần & Dao động duy trì',
        content:
          '• **Dao động tắt dần**: Biên độ giảm dần theo thời gian do ma sát và lực cản môi trường; lực cản càng lớn tắt dần càng nhanh (ứng dụng: giảm xóc ô tô, đóng cửa thủy lực).\n• **Dao động duy trì**: Bù đúng phần năng lượng tiêu hao sau mỗi chu kì mà **không làm thay đổi tần số riêng $f_0$** (ví dụ: đồng hồ quả lắc).'
      },
      {
        heading: '2. Dao động cưỡng bức & Cộng hưởng cơ',
        content:
          '• **Dao động cưỡng bức**: Dưới tác dụng ngoại lực tuần hoàn $F = F_0\\cos(2\\pi f t)$, hệ dao động ổn định với tần số bằng **tần số ngoại lực $f$**; biên độ phụ thuộc $F_0$, lực cản và độ chênh $|f - f_0|$.\n• **Cộng hưởng**: Khi $f = f_0$ (hay $T = T_0$), biên độ đạt cực đại đột ngột (ứng dụng: hộp đàn ghi-ta; tác hại: rung gãy cầu, bể kính).'
      }
    ],
    keyFormulas: [
      'f_{\\text{cưỡng bức}} = f_{\\text{ngoại lực}}',
      '\\text{Cộng hưởng} \\iff f_{\\text{ngoại lực}} = f_0'
    ],
    ...SIM_PRESETS.damped_resonance,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Một con lắc có tần số dao động riêng $f_0 = 4\\text{ Hz}$ chịu tác dụng của ngoại lực tuần hoàn $F = 5\\cos(10\\pi t)\\text{ N}$. Khi ổn định, con lắc dao động cưỡng bức với tần số:',
        options: ['A. $4\\text{ Hz}$', 'B. $5\\text{ Hz}$', 'C. $10\\text{ Hz}$', 'D. $4{,}5\\text{ Hz}$'],
        correctIndex: 1,
        explanation: 'Tần số ngoại lực $f = \\frac{\\omega}{2\\pi} = \\frac{10\\pi}{2\\pi} = 5\\text{ Hz}$. Dao động cưỡng bức luôn có tần số bằng tần số ngoại lực ($5\\text{ Hz}$).'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một người xách xô nước bước đều trên đường, mỗi bước dài $0{,}5\\text{ m}$. Chu kì dao động riêng của nước trong xô là $0{,}8\\text{ s}$. Nước trong xô sẽ bị sóng sánh mạnh nhất khi người đó đi với vận tốc bằng bao nhiêu?',
        hints: ['Cộng hưởng xảy ra khi chu kì bước chân $T = s / v$ bằng chu kì riêng $T_0 = 0{,}8\\text{ s}$.'],
        solutionSteps: [
          'Bước 1: Cộng hưởng xảy ra khi thời gian bước mỗi bước bằng chu kì riêng: $t = T_0 = 0{,}8\\text{ s}$.',
          'Bước 2: Vận tốc đi bộ $v = \\frac{s}{t} = \\frac{0{,}5}{0{,}8} = 0{,}625\\text{ m/s} = 2{,}25\\text{ km/h}$.'
        ],
        finalAnswer: '$v = 0{,}625\\text{ m/s}$ ($2{,}25\\text{ km/h}$).'
      }
    ]
  },
  {
    id: 'phys-2006-12-5',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương I: Dao động cơ',
    sourceTag: SRC_12,
    lessonNumber: 5,
    title: 'Bài 5 (2006): Tổng hợp hai dao động điều hòa cùng phương, cùng tần số (Fre-nen)',
    subtitle: 'Giản đồ vectơ quay Fre-nen, biên độ tổng hợp A² = A₁² + A₂² + 2A₁A₂cos(Δφ) và góc pha ban đầu tan φ',
    description:
      'Sử dụng phương pháp giản đồ vectơ quay Fre-nen tổng hợp hai dao động điều hòa cùng phương cùng tần số, xét các trường hợp cùng pha, ngược pha, vuông pha.',
    theorySections: [
      {
        heading: '1. Giản đồ vectơ Fre-nen & Công thức tổng hợp',
        content:
          '• Hai dao động cùng phương, cùng tần số $x_1 = A_1\\cos(\\omega t + \\varphi_1)$ và $x_2 = A_2\\cos(\\omega t + \\varphi_2)$ tổng hợp thành $x = A\\cos(\\omega t + \\varphi)$ với:\n$$A^2 = A_1^2 + A_2^2 + 2 A_1 A_2 \\cos(\\varphi_2 - \\varphi_1)$$\n$$\\tan\\varphi = \\frac{A_1\\sin\\varphi_1 + A_2\\sin\\varphi_2}{A_1\\cos\\varphi_1 + A_2\\cos\\varphi_2}$$'
      },
      {
        heading: '2. Các trường hợp đặc biệt của độ lệch pha Δφ',
        content:
          '• **Cùng pha** ($\\Delta\\varphi = 2k\\pi$): $A = A_1 + A_2$.\n• **Ngược pha** ($\\Delta\\varphi = (2k+1)\\pi$): $A = |A_1 - A_2|$.\n• **Vuông pha** ($\\Delta\\varphi = (2k+1)\\frac{\\pi}{2}$): $A = \\sqrt{A_1^2 + A_2^2}$. Luôn có $|A_1 - A_2| \\le A \\le A_1 + A_2$.'
      }
    ],
    keyFormulas: [
      'A^2 = A_1^2 + A_2^2 + 2 A_1 A_2 \\cos\\Delta\\varphi',
      '\\tan\\varphi = \\frac{A_1\\sin\\varphi_1 + A_2\\sin\\varphi_2}{A_1\\cos\\varphi_1 + A_2\\cos\\varphi_2}'
    ],
    ...SIM_PRESETS.lissajous,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Tổng hợp hai dao động điều hòa cùng phương: $x_1 = 3\\cos(10t)\\text{ cm}$ và $x_2 = 4\\cos(10t + \\frac{\\pi}{2})\\text{ cm}$. Biên độ dao động tổng hợp bằng:',
        options: ['A. $7\\text{ cm}$', 'B. $1\\text{ cm}$', 'C. $5\\text{ cm}$', 'D. $3{,}5\\text{ cm}$'],
        correctIndex: 2,
        explanation: 'Hai dao động vuông pha ($\\Delta\\varphi = \\pi/2$) nên $A = \\sqrt{3^2 + 4^2} = 5\\text{ cm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Viết phương trình dao động tổng hợp của hai dao động điều hòa cùng phương: $x_1 = 4\\cos(10\\pi t + \\frac{\\pi}{6})\\text{ cm}$ và $x_2 = 4\\cos(10\\pi t + \\frac{5\\pi}{6})\\text{ cm}$.',
        hints: ['Độ lệch pha $\\Delta\\varphi = \\frac{2\\pi}{3}$; dùng công thức $A$ và $\\tan\\varphi$ hoặc hình thoi vectơ đều.'],
        solutionSteps: [
          'Bước 1: $A^2 = 4^2 + 4^2 + 2\\cdot 4\\cdot 4\\cos\\frac{2\\pi}{3} = 32 - 16 = 16 \\Rightarrow A = 4\\text{ cm}$.',
          'Bước 2: Vì $A_1 = A_2 = 4$, vectơ tổng là phân giác giữa $\\frac{\\pi}{6}$ và $\\frac{5\\pi}{6}$: $\\varphi = \\frac{\\pi/6 + 5\\pi/6}{2} = \\frac{\\pi}{2}$.',
          'Bước 3: Phương trình $x = 4\\cos\\left(10\\pi t + \\frac{\\pi}{2}\\right)\\text{ cm}$.'
        ],
        finalAnswer: '$x = 4\\cos\\left(10\\pi t + \\frac{\\pi}{2}\\right)\\text{ cm}$.'
      }
    ]
  },

  // ==================== CHƯƠNG II: SÓNG CƠ VÀ SÓNG ÂM (Bài 6–9) ====================
  {
    id: 'phys-2006-12-6',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương II: Sóng cơ và Sóng âm',
    sourceTag: SRC_12,
    lessonNumber: 6,
    title: 'Bài 6 (2006): Sóng cơ, Bước sóng λ & Phương trình truyền sóng',
    subtitle: 'Sóng ngang – sóng dọc, bước sóng λ = vT = v/f, phương trình sóng u = Acos(ωt - 2πx/λ) và độ lệch pha theo khoảng cách',
    description:
      'Phân biệt sóng ngang và sóng dọc theo môi trường truyền (rắn, lỏng, khí), tính bước sóng $\\lambda$, lập phương trình sóng tại điểm M cách nguồn khoảng $x$ và độ lệch pha $\\Delta\\varphi = \\frac{2\\pi d}{\\lambda}$.',
    theorySections: [
      {
        heading: '1. Sóng cơ, Sóng ngang & Sóng dọc',
        content:
          '• **Sóng cơ** là dao động cơ lan truyền trong một môi trường vật chất (không truyền được trong chân không).\n• **Sóng ngang**: phần tử dao động vuông góc phương truyền (truyền trong chất rắn và bề mặt chất lỏng). **Sóng dọc**: phần tử dao động trùng phương truyền (truyền trong cả rắn, lỏng, khí).'
      },
      {
        heading: '2. Bước sóng & Phương trình sóng',
        content:
          '• **Bước sóng $\\lambda$** là quãng đường sóng truyền đi trong $1$ chu kì (hoặc khoảng cách giữa hai điểm gần nhau nhất trên phương truyền dao động cùng pha): $\\lambda = v T = \\frac{v}{f}$.\n• Phương trình sóng truyền theo chiều dương $Ox$: $u_M = A\\cos\\left(\\omega t - \\frac{2\\pi x}{\\lambda}\\right)$.'
      }
    ],
    keyFormulas: [
      '\\lambda = v T = \\frac{v}{f}, \\quad \\Delta\\varphi = \\frac{2\\pi d}{\\lambda}',
      'u_M(x,t) = A\\cos\\left(\\omega t - \\frac{2\\pi x}{\\lambda}\\right)'
    ],
    ...SIM_PRESETS.wave_longitudinal,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Một sóng cơ có tần số $f = 20\\text{ Hz}$ truyền trên mặt nước với tốc độ $v = 1{,}6\\text{ m/s}$. Bước sóng của sóng này là:',
        options: ['A. $8\\text{ cm}$', 'B. $32\\text{ m}$', 'C. $12{,}5\\text{ cm}$', 'D. $0{,}8\\text{ m}$'],
        correctIndex: 0,
        explanation: '$\\lambda = \\frac{v}{f} = \\frac{1{,}6}{20} = 0{,}08\\text{ m} = 8\\text{ cm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Người ta quan sát thấy $6$ ngọn sóng liên tiếp đi qua trước mặt trong thời gian $10\\text{ s}$, khoảng cách giữa $6$ ngọn sóng liên tiếp đó là $15\\text{ m}$. Tính chu kì, bước sóng và tốc độ truyền sóng.',
        hints: ['$6$ ngọn sóng liên tiếp ứng với $5$ chu kì và $5$ bước sóng.'],
        solutionSteps: [
          'Bước 1: $5T = 10\\text{ s} \\Rightarrow T = 2\\text{ s}$.',
          'Bước 2: $5\\lambda = 15\\text{ m} \\Rightarrow \\lambda = 3\\text{ m}$.',
          'Bước 3: Tốc độ truyền sóng $v = \\frac{\\lambda}{T} = \\frac{3}{2} = 1{,}5\\text{ m/s}$.'
        ],
        finalAnswer: '$T = 2\\text{ s}$; $\\lambda = 3\\text{ m}$; $v = 1{,}5\\text{ m/s}$.'
      }
    ]
  },
  {
    id: 'phys-2006-12-7',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương II: Sóng cơ và Sóng âm',
    sourceTag: SRC_12,
    lessonNumber: 7,
    title: 'Bài 7 (2006): Giao thoa sóng cơ – Điều kiện Cực đại & Cực tiểu',
    subtitle: 'Hai nguồn kết hợp, vị trí cực đại d₂ - d₁ = kλ, cực tiểu d₂ - d₁ = (k + ½)λ và đếm số vân giao thoa trên đoạn nối hai nguồn',
    description:
      'Giải thích sự tạo thành các họ đường hypebol cực đại – cực tiểu trong vùng giao thoa của hai sóng kết hợp và tính nhanh số điểm dao động cực đại/cực tiểu trên đoạn $S_1 S_2$.',
    theorySections: [
      {
        heading: '1. Hiện tượng giao thoa & Hai nguồn kết hợp',
        content:
          '• **Hai nguồn kết hợp** là hai nguồn dao động cùng phương, cùng tần số và có hiệu số pha không đổi theo thời gian.\n• Khi hai sóng kết hợp gặp nhau, chúng tăng cường nhau tại các **cực đại giao thoa** và triệt tiêu nhau tại các **cực tiểu giao thoa**.'
      },
      {
        heading: '2. Điều kiện cực đại và cực tiểu (hai nguồn cùng pha)',
        content:
          '• **Cực đại**: $d_2 - d_1 = k\\lambda$ ($k \\in \\mathbb{Z}$).\n• **Cực tiểu**: $d_2 - d_1 = \\left(k + \\frac{1}{2}\\right)\\lambda$ ($k \\in \\mathbb{Z}$).\n• Trên đoạn thẳng nối hai nguồn $S_1 S_2$, khoảng cách giữa hai cực đại (hoặc hai cực tiểu) liên tiếp bằng $\\frac{\\lambda}{2}$.'
      }
    ],
    keyFormulas: [
      '\\text{Cực đại: } d_2 - d_1 = k\\lambda; \\quad \\text{Cực tiểu: } d_2 - d_1 = (k + 0{,}5)\\lambda',
      '-S_1 S_2 < k\\lambda < S_1 S_2 \\quad (\\text{đếm số cực đại giữa } S_1, S_2)'
    ],
    ...SIM_PRESETS.wave_interference,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Trên mặt nước có hai nguồn kết hợp cùng pha $S_1, S_2$ cách nhau $S_1 S_2 = 10\\text{ cm}$, bước sóng $\\lambda = 2{,}4\\text{ cm}$. Số điểm dao động với biên độ cực đại trên đoạn $S_1 S_2$ là:',
        options: ['A. $9$', 'B. $8$', 'C. $7$', 'D. $10$'],
        correctIndex: 0,
        explanation: '$-\\frac{10}{2{,}4} < k < \\frac{10}{2{,}4} \\iff -4{,}17 < k < 4{,}17 \\Rightarrow k \\in \\{-4,\\dots,4\\}$ có $9$ điểm cực đại.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Trên mặt chất lỏng, hai nguồn kết hợp cùng pha $A, B$ cách nhau $12\\text{ cm}$ dao động với tần số $25\\text{ Hz}$, tốc độ truyền sóng $v = 75\\text{ cm/s}$. Tìm số đường cực đại và số đường cực tiểu giao thoa trên đoạn $AB$.',
        hints: ['Tính $\\lambda = v/f = 3\\text{ cm}$, rồi đếm giá trị $k \\in \\mathbb{Z}$ thỏa $-AB/\\lambda < k < AB/\\lambda$ và $-AB/\\lambda < k + 0{,}5 < AB/\\lambda$.'],
        solutionSteps: [
          'Bước 1: Bước sóng $\\lambda = \\frac{75}{25} = 3\\text{ cm}$.',
          'Bước 2: Cực đại: $-\\frac{12}{3} < k < \\frac{12}{3} \\iff -4 < k < 4 \\Rightarrow k \\in \\{-3, -2, -1, 0, 1, 2, 3\\}$ ($7$ cực đại).',
          'Bước 3: Cực tiểu: $-4 < k + 0{,}5 < 4 \\iff -4{,}5 < k < 3{,}5 \\Rightarrow k \\in \\{-4,-3,-2,-1,0,1,2,3\\}$ ($8$ cực tiểu).'
        ],
        finalAnswer: '$7$ cực đại và $8$ cực tiểu.'
      }
    ]
  },
  {
    id: 'phys-2006-12-8',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương II: Sóng cơ và Sóng âm',
    sourceTag: SRC_12,
    lessonNumber: 8,
    title: 'Bài 8 (2006): Sóng dừng trên dây & Cộng hưởng cột khí',
    subtitle: 'Phản xạ sóng ở đầu cố định/tự do, bụng sóng – nút sóng cách nhau λ/4 và điều kiện sóng dừng l = k·λ/2 hoặc (2k+1)·λ/4',
    description:
      'Giải thích cơ chế hình thành sóng dừng từ giao thoa sóng tới và sóng phản xạ, phân biệt hai trường hợp hai đầu cố định và một đầu cố định – một đầu tự do.',
    theorySections: [
      {
        heading: '1. Sự phản xạ sóng & Sóng dừng',
        content:
          '• Khi phản xạ trên vật cản **cố định**, sóng phản xạ luôn **ngược pha** với sóng tới ở điểm phản xạ (tạo nút). Trên vật cản **tự do**, sóng phản xạ **cùng pha** với sóng tới (tạo bụng).\n• Khoảng cách giữa hai nút hoặc hai bụng liên tiếp là $\\frac{\\lambda}{2}$; giữa một nút và một bụng liên tiếp là $\\frac{\\lambda}{4}$.'
      },
      {
        heading: '2. Điều kiện có sóng dừng trên dây dài l',
        content:
          '• **Hai đầu cố định**: $l = k\\frac{\\lambda}{2}$ ($k \\in \\mathbb{N}^*$; có $k$ bụng và $k+1$ nút).\n• **Một đầu cố định, một đầu tự do**: $l = (2k + 1)\\frac{\\lambda}{4}$ ($k \\in \\mathbb{N}$; có $k+1$ bụng và $k+1$ nút).'
      }
    ],
    keyFormulas: [
      '\\text{Hai đầu cố định: } l = k\\frac{\\lambda}{2} = k\\frac{v}{2f}',
      '\\text{Một đầu cố định, một đầu tự do: } l = (2k + 1)\\frac{\\lambda}{4}'
    ],
    ...SIM_PRESETS.standing_wave,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Trên một sợi dây dài $l = 1{,}2\\text{ m}$ hai đầu cố định đang có sóng dừng với $3$ bụng sóng. Bước sóng của sóng trên dây là:',
        options: ['A. $0{,}8\\text{ m}$', 'B. $0{,}4\\text{ m}$', 'C. $1{,}2\\text{ m}$', 'D. $0{,}6\\text{ m}$'],
        correctIndex: 0,
        explanation: 'Có $k = 3$ bụng $\\Rightarrow l = 3\\frac{\\lambda}{2} = 1{,}2 \\Rightarrow \\lambda = 0{,}8\\text{ m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một sợi dây đàn dài $l = 60\\text{ cm}$ căng giữa hai điểm cố định. Tốc độ truyền sóng trên dây là $v = 240\\text{ m/s}$. Tính tần số âm cơ bản ($k=1$) và họa âm bậc $3$ ($k=3$) do dây đàn phát ra.',
        hints: ['Dùng $f_k = k\\frac{v}{2l}$ với $l = 0{,}6\\text{ m}$.'],
        solutionSteps: [
          'Bước 1: Tần số cơ bản ($k = 1$): $f_1 = \\frac{v}{2l} = \\frac{240}{2 \\cdot 0{,}6} = 200\\text{ Hz}$.',
          'Bước 2: Họa âm bậc $3$ ($k = 3$): $f_3 = 3 f_1 = 600\\text{ Hz}$.'
        ],
        finalAnswer: '$f_1 = 200\\text{ Hz}$; $f_3 = 600\\text{ Hz}$.'
      }
    ]
  },
  {
    id: 'phys-2006-12-9',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương II: Sóng cơ và Sóng âm',
    sourceTag: SRC_12,
    lessonNumber: 9,
    title: 'Bài 9 (2006): Đặc trưng vật lí và Đặc trưng sinh lí của Âm',
    subtitle: 'Sóng âm – hạ âm – siêu âm, cường độ âm I = P/(4πr²), mức cường độ âm L(dB) = 10 lg(I/I₀) và độ cao, độ to, âm sắc',
    description:
      'Liên kết đúng ba đặc trưng vật lí (tần số, cường độ/mức cường độ âm, đồ thị dao động âm) với ba đặc trưng sinh lí (độ cao, độ to, âm sắc) và tính mức cường độ âm theo Đêxiben.',
    theorySections: [
      {
        heading: '1. Sóng âm & Đặc trưng vật lí',
        content:
          '• **Âm nghe được**: $16\\text{ Hz} \\le f \\le 20\\,000\\text{ Hz}$; **hạ âm** $< 16\\text{ Hz}$; **siêu âm** $> 20\\,000\\text{ Hz}$.\n• **Cường độ âm**: $I = \\frac{\\mathcal{P}}{4\\pi r^2}$ ($\\text{W/m}^2$). **Mức cường độ âm**: $L(\\text{dB}) = 10\\lg\\frac{I}{I_0}$ (với $I_0 = 10^{-12}\\text{ W/m}^2$ ở $f = 1000\\text{ Hz}$).'
      },
      {
        heading: '2. Ba đặc trưng sinh lí của âm',
        content:
          '• **Độ cao**: gắn liền với **tần số âm**.\n• **Độ to**: gắn liền với **mức cường độ âm $L$**.\n• **Âm sắc**: gắn liền với **đồ thị dao động âm** (giúp phân biệt giọng nói, nhạc cụ cùng độ cao và độ to).'
      }
    ],
    keyFormulas: [
      'I = \\frac{\\mathcal{P}}{4\\pi r^2}, \\quad L(\\text{dB}) = 10\\lg\\frac{I}{I_0}',
      'L_2 - L_1 = 10\\lg\\frac{I_2}{I_1} = 20\\lg\\frac{r_1}{r_2}'
    ],
    ...SIM_PRESETS.sound_intensity,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Đặc trưng sinh lí nào của âm gắn liền với đồ thị dao động âm?',
        options: ['A. Độ cao', 'B. Độ to', 'C. Âm sắc', 'D. Cường độ âm'],
        correctIndex: 2,
        explanation: 'Âm sắc gắn liền với đồ thị dao động âm (biên độ và tần số các họa âm).'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Tại điểm A cách nguồn âm điểm $r_1 = 10\\text{ m}$, mức cường độ âm đo được là $L_A = 60\\text{ dB}$. Tính cường độ âm tại A (biết $I_0 = 10^{-12}\\text{ W/m}^2$) và mức cường độ âm tại điểm B cách nguồn $r_2 = 100\\text{ m}$ (bỏ qua hấp thụ âm).',
        hints: ['Dùng $I_A = I_0 \\cdot 10^{L_A/10}$ và $L_A - L_B = 20\\lg(r_2/r_1)$.'],
        solutionSteps: [
          'Bước 1: $I_A = 10^{-12}\\cdot 10^{60/10} = 10^{-6}\\text{ W/m}^2$.',
          'Bước 2: Khi khoảng cách tăng $10$ lần, cường độ âm giảm $100$ lần $\\Rightarrow L_B = L_A - 20\\lg(10) = 60 - 20 = 40\\text{ dB}$.'
        ],
        finalAnswer: '$I_A = 10^{-6}\\text{ W/m}^2$; $L_B = 40\\text{ dB}$.'
      }
    ]
  },

  // ==================== CHƯƠNG III: DÒNG ĐIỆN XOAY CHIỀU (Bài 10–14) ====================
  {
    id: 'phys-2006-12-10',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương III: Dòng điện xoay chiều',
    sourceTag: SRC_12,
    lessonNumber: 10,
    title: 'Bài 10 (2006): Đại cương về Dòng điện xoay chiều',
    subtitle: 'Nguyên tắc tạo suất điện động xoay chiều e = E₀cos(ωt), giá trị tức thời – cực đại – hiệu dụng I = I₀/√2 và ý nghĩa ampe kế nhiệt',
    description:
      'Hiểu bản chất dòng điện xoay chiều hình sin $i = I_0\\cos(\\omega t + \\varphi)$, định nghĩa giá trị hiệu dụng dựa trên tác dụng nhiệt và tính pha tức thời.',
    theorySections: [
      {
        heading: '1. Nguyên tắc tạo suất điện động xoay chiều',
        content:
          '• Khung dây gồm $N$ vòng, diện tích $S$ quay đều với tốc độ góc $\\omega$ quanh trục vuông góc với từ trường đều $\\vec{B}$ tạo từ thông $\\Phi = NBS\\cos(\\omega t + \\varphi_0)$ và suất điện động cảm ứng:\n$$e = -\\Phi\'(t) = \\omega N B S \\sin(\\omega t + \\varphi_0) = E_0\\cos\\left(\\omega t + \\varphi_0 - \\frac{\\pi}{2}\\right)$$'
      },
      {
        heading: '2. Giá trị hiệu dụng',
        content:
          '• Cường độ hiệu dụng của dòng xoay chiều bằng cường độ dòng không đổi tỏa ra cùng một nhiệt lượng trong cùng thời gian qua cùng điện trở $R$:\n$$I = \\frac{I_0}{\\sqrt{2}}, \\quad U = \\frac{U_0}{\\sqrt{2}}, \\quad E = \\frac{E_0}{\\sqrt{2}}$$'
      }
    ],
    keyFormulas: [
      'i = I_0\\cos(\\omega t + \\varphi_i), \\quad u = U_0\\cos(\\omega t + \\varphi_u)',
      'I = \\frac{I_0}{\\sqrt{2}}, \\quad U = \\frac{U_0}{\\sqrt{2}}, \\quad E_0 = \\omega N B S'
    ],
    ...SIM_PRESETS.ac_rlc,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Dòng điện xoay chiều chạy qua đoạn mạch có phương trình $i = 4\\sqrt{2}\\cos(100\\pi t - \\frac{\\pi}{6})\\text{ (A)}$. Giá trị hiệu dụng và tần số dòng điện là:',
        options: ['A. $4\\text{ A};\\ 50\\text{ Hz}$', 'B. $4\\sqrt{2}\\text{ A};\\ 50\\text{ Hz}$', 'C. $4\\text{ A};\\ 100\\text{ Hz}$', 'D. $2\\sqrt{2}\\text{ A};\\ 50\\text{ Hz}$'],
        correctIndex: 0,
        explanation: '$I = \\frac{I_0}{\\sqrt{2}} = 4\\text{ A}$; $f = \\frac{\\omega}{2\\pi} = \\frac{100\\pi}{2\\pi} = 50\\text{ Hz}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một khung dây phẳng gồm $100$ vòng, diện tích mỗi vòng $S = 200\\text{ cm}^2$, quay đều trong từ trường đều $B = 0{,}2\\text{ T}$ với tốc độ $50\\text{ vòng/s}$. Tính suất điện động cực đại và suất điện động hiệu dụng trong khung.',
        hints: ['Tính $\\omega = 2\\pi f = 100\\pi\\text{ rad/s}$ và $E_0 = \\omega N B S$.'],
        solutionSteps: [
          'Bước 1: $S = 0{,}02\\text{ m}^2$, $\\omega = 2\\pi \\cdot 50 = 100\\pi\\text{ rad/s}$.',
          'Bước 2: $E_0 = 100\\pi \\cdot 100 \\cdot 0{,}2 \\cdot 0{,}02 = 40\\pi \\approx 125{,}66\\text{ V}$.',
          'Bước 3: Suất điện động hiệu dụng $E = \\frac{E_0}{\\sqrt{2}} = 20\\sqrt{2}\\pi \\approx 88{,}86\\text{ V}$.'
        ],
        finalAnswer: '$E_0 = 40\\pi \\approx 125{,}7\\text{ V}$; $E \\approx 88{,}9\\text{ V}$.'
      }
    ]
  },
  {
    id: 'phys-2006-12-11',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương III: Dòng điện xoay chiều',
    sourceTag: SRC_12,
    lessonNumber: 11,
    title: 'Bài 11 (2006): Các mạch điện xoay chiều chỉ chứa R, chỉ chứa L hoặc chỉ chứa C',
    subtitle: 'Định luật Ôm, cảm kháng Z_L = ωL, dung kháng Z_C = 1/(ωC) và độ lệch pha giữa u với i trong từng phần tử thuần',
    description:
      'Nắm chắc quan hệ pha ($u_R$ cùng pha $i$; $u_L$ nhanh pha $\\pi/2$ so với $i$; $u_C$ chậm pha $\\pi/2$ so với $i$) và viết phương trình tức thời cho từng mạch đơn.',
    theorySections: [
      {
        heading: '1. Đoạn mạch chỉ có điện trở thuần R',
        content:
          '• Điện áp $u_R$ **cùng pha** với dòng điện $i$. Định luật Ôm: $I = \\frac{U}{R}$.'
      },
      {
        heading: '2. Cuộn cảm thuần L & Tụ điện C',
        content:
          '• **Cuộn cảm thuần $L$**: Cảm kháng $Z_L = \\omega L$ ($\\Omega$). Điện áp $u_L$ **sớm pha $\\frac{\\pi}{2}$** so với $i$. Định luật Ôm: $I = \\frac{U_L}{Z_L}$.\n• **Tụ điện $C$**: Dung kháng $Z_C = \\frac{1}{\\omega C}$ ($\\Omega$). Điện áp $u_C$ **trễ pha $\\frac{\\pi}{2}$** so với $i$. Định luật Ôm: $I = \\frac{U_C}{Z_C}$. Tụ điện cản trở dòng một chiều ($f=0 \\Rightarrow Z_C = \\infty$) nhưng cho dòng xoay chiều đi qua.'
      }
    ],
    keyFormulas: [
      'Z_L = \\omega L = 2\\pi f L, \\quad Z_C = \\frac{1}{\\omega C} = \\frac{1}{2\\pi f C}',
      '\\varphi_{u_R} - \\varphi_i = 0; \\quad \\varphi_{u_L} - \\varphi_i = +\\frac{\\pi}{2}; \\quad \\varphi_{u_C} - \\varphi_i = -\\frac{\\pi}{2}'
    ],
    ...SIM_PRESETS.ac_rlc,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Đặt điện áp $u = 100\\sqrt{2}\\cos(100\\pi t)\\text{ (V)}$ vào hai đầu tụ điện có điện dung $C = \\frac{10^{-4}}{\\pi}\\text{ F}$. Dung kháng và cường độ hiệu dụng qua tụ là:',
        options: ['A. $100\\,\\Omega;\\ 1\\text{ A}$', 'B. $100\\,\\Omega;\\ \\sqrt{2}\\text{ A}$', 'C. $50\\,\\Omega;\\ 2\\text{ A}$', 'D. $200\\,\\Omega;\\ 0{,}5\\text{ A}$'],
        correctIndex: 0,
        explanation: '$Z_C = \\frac{1}{100\\pi \\cdot \\frac{10^{-4}}{\\pi}} = 100\\,\\Omega$; $I = \\frac{U}{Z_C} = \\frac{100}{100} = 1\\text{ A}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Đặt điện áp $u = 120\\sqrt{2}\\cos(100\\pi t + \\frac{\\pi}{6})\\text{ (V)}$ vào hai đầu cuộn cảm thuần có độ tự cảm $L = \\frac{0{,}6}{\\pi}\\text{ H}$. Tính cảm kháng $Z_L$ và viết biểu thức cường độ dòng điện tức thời $i(t)$.',
        hints: ['$i$ trễ pha $\\pi/2$ so với $u_L$, tức $\\varphi_i = \\varphi_u - \\pi/2$.'],
        solutionSteps: [
          'Bước 1: $Z_L = \\omega L = 100\\pi\\cdot\\frac{0{,}6}{\\pi} = 60\\,\\Omega$.',
          'Bước 2: $I_0 = \\frac{U_0}{Z_L} = \\frac{120\\sqrt{2}}{60} = 2\\sqrt{2}\\text{ A}$.',
          'Bước 3: $\\varphi_i = \\frac{\\pi}{6} - \\frac{\\pi}{2} = -\\frac{\\pi}{3} \\Rightarrow i = 2\\sqrt{2}\\cos\\left(100\\pi t - \\frac{\\pi}{3}\\right)\\text{ (A)}$.'
        ],
        finalAnswer: '$Z_L = 60\\,\\Omega$; $i = 2\\sqrt{2}\\cos\\left(100\\pi t - \\frac{\\pi}{3}\\right)\\text{ A}$.'
      }
    ]
  },
  {
    id: 'phys-2006-12-12',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương III: Dòng điện xoay chiều',
    sourceTag: SRC_12,
    lessonNumber: 12,
    title: 'Bài 12 (2006): Mạch có R, L, C mắc nối tiếp – Giản đồ vectơ & Tổng trở Z',
    subtitle: 'Tổng trở Z = √[R² + (Z_L - Z_C)²], liên hệ hiệu điện thế U = √[U_R² + (U_L - U_C)²] và độ lệch pha tan φ = (Z_L - Z_C)/R',
    description:
      'Vận dụng giản đồ vectơ Fre-nen giải mạch R-L-C nối tiếp, tính tổng trở $Z$, góc lệch pha $\\varphi = \\varphi_u - \\varphi_i$ và phân biệt mạch có tính cảm kháng hoặc dung kháng.',
    theorySections: [
      {
        heading: '1. Tổng trở & Định luật Ôm mạch R-L-C nối tiếp',
        content:
          '• Điện áp tức thời tổng bằng tổng đại số: $u = u_R + u_L + u_C$, nhưng giá trị hiệu dụng cộng theo vectơ:\n$$U = \\sqrt{U_R^2 + (U_L - U_C)^2}, \\quad Z = \\sqrt{R^2 + (Z_L - Z_C)^2}, \\quad I = \\frac{U}{Z}$$'
      },
      {
        heading: '2. Độ lệch pha giữa u và i',
        content:
          '• Góc lệch pha $\\varphi = \\varphi_u - \\varphi_i$ xác định bởi: $\\tan\\varphi = \\frac{Z_L - Z_C}{R} = \\frac{U_L - U_C}{U_R}$.\n• Nếu $Z_L > Z_C$: $u$ sớm pha hơn $i$ ($\\varphi > 0$, mạch có tính cảm kháng); nếu $Z_L < Z_C$: $u$ trễ pha hơn $i$ ($\\varphi < 0$, mạch có tính dung kháng).'
      }
    ],
    keyFormulas: [
      'Z = \\sqrt{R^2 + (Z_L - Z_C)^2}, \\quad U = \\sqrt{U_R^2 + (U_L - U_C)^2}',
      '\\tan\\varphi = \\frac{Z_L - Z_C}{R} = \\frac{U_L - U_C}{U_R} \\quad (\\varphi = \\varphi_u - \\varphi_i)'
    ],
    ...SIM_PRESETS.ac_rlc,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Đoạn mạch RLC nối tiếp có $R = 30\\,\\Omega$, $Z_L = 70\\,\\Omega$, $Z_C = 30\\,\\Omega$. Tổng trở $Z$ của đoạn mạch bằng:',
        options: ['A. $50\\,\\Omega$', 'B. $130\\,\\Omega$', 'C. $70\\,\\Omega$', 'D. $40\\,\\Omega$'],
        correctIndex: 0,
        explanation: '$Z = \\sqrt{30^2 + (70 - 30)^2} = \\sqrt{900 + 1600} = 50\\,\\Omega$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Đặt điện áp $u = 100\\sqrt{2}\\cos(100\\pi t)\\text{ (V)}$ vào hai đầu đoạn mạch RLC nối tiếp có $R = 50\\,\\Omega$, $L = \\frac{1}{\\pi}\\text{ H}$, $C = \\frac{2\\cdot 10^{-4}}{\\pi}\\text{ F}$. Tính tổng trở $Z$, cường độ hiệu dụng $I$ và viết biểu thức $i(t)$.',
        hints: ['Tính $Z_L = 100\\,\\Omega$, $Z_C = 50\\,\\Omega$, rồi $Z$ và $\\tan\\varphi = \\frac{Z_L - Z_C}{R}$.'],
        solutionSteps: [
          'Bước 1: $Z_L = 100\\pi\\cdot\\frac{1}{\\pi} = 100\\,\\Omega$; $Z_C = \\frac{1}{100\\pi\\cdot\\frac{2\\cdot 10^{-4}}{\\pi}} = 50\\,\\Omega$.',
          'Bước 2: $Z = \\sqrt{50^2 + (100 - 50)^2} = 50\\sqrt{2}\\,\\Omega$; $I = \\frac{100}{50\\sqrt{2}} = \\sqrt{2}\\text{ A} \\Rightarrow I_0 = 2\\text{ A}$.',
          'Bước 3: $\\tan\\varphi = \\frac{100 - 50}{50} = 1 \\Rightarrow \\varphi = \\frac{\\pi}{4} \\Rightarrow \\varphi_i = -\\frac{\\pi}{4}$, nên $i = 2\\cos\\left(100\\pi t - \\frac{\\pi}{4}\\right)\\text{ A}$.'
        ],
        finalAnswer: '$Z = 50\\sqrt{2}\\,\\Omega$; $I = \\sqrt{2}\\text{ A}$; $i = 2\\cos\\left(100\\pi t - \\frac{\\pi}{4}\\right)\\text{ A}$.'
      }
    ]
  },
  {
    id: 'phys-2006-12-13',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương III: Dòng điện xoay chiều',
    sourceTag: SRC_12,
    lessonNumber: 13,
    title: 'Bài 13 (2006): Công suất tiêu thụ, Hệ số công suất & Cộng hưởng điện',
    subtitle: 'Công thức P = UI cosφ = I²R, hệ số công suất cos φ = R/Z và hiện tượng cộng hưởng điện ω²LC = 1',
    description:
      'Tính công suất tỏa nhiệt mạch xoay chiều có hệ số công suất $\\cos\\varphi$, hiểu ý nghĩa nâng cao hệ số công suất trong công nghiệp và điều kiện cộng hưởng điện $Z_L = Z_C$.',
    theorySections: [
      {
        heading: '1. Công suất tiêu thụ & Hệ số công suất',
        content:
          '• **Công suất mạch xoay chiều**: $\\mathcal{P} = U I \\cos\\varphi = I^2 R = \\frac{U^2 R}{Z^2}$ (nếu cuộn dây không thuần cảm có điện trở trong $r$ thì thay $R$ bằng $R + r$).\n• **Hệ số công suất**: $\\cos\\varphi = \\frac{R}{Z} = \\frac{U_R}{U}$. Nâng cao $\\cos\\varphi \\ge 0{,}85$ giúp giảm cường độ dòng trên đường dây và giảm hao phí điện năng.'
      },
      {
        heading: '2. Hiện tượng cộng hưởng điện',
        content:
          '• Khi $Z_L = Z_C \\iff \\omega L = \\frac{1}{\\omega C} \\iff \\omega = \\frac{1}{\\sqrt{LC}}$ xảy ra **cộng hưởng điện**: $Z_{\\min} = R$, $I_{\\max} = \\frac{U}{R}$, $\\cos\\varphi = 1$ ($u$ cùng pha $i$), $\\mathcal{P}_{\\max} = \\frac{U^2}{R}$, $U_R = U$.'
      }
    ],
    keyFormulas: [
      '\\mathcal{P} = U I \\cos\\varphi = I^2 R, \\quad \\cos\\varphi = \\frac{R}{Z}',
      '\\text{Cộng hưởng: } Z_L = Z_C \\iff \\omega^2 L C = 1 \\Rightarrow I_{\\max} = \\frac{U}{R},\\ \\mathcal{P}_{\\max} = \\frac{U^2}{R}'
    ],
    ...SIM_PRESETS.ac_rlc,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Đặt điện áp xoay chiều $U = 120\\text{ V}$ không đổi vào đoạn mạch RLC nối tiếp có $R = 60\\,\\Omega$. Khi trong mạch xảy ra cộng hưởng điện, công suất tiêu thụ của đoạn mạch bằng:',
        options: ['A. $240\\text{ W}$', 'B. $120\\text{ W}$', 'C. $480\\text{ W}$', 'D. $60\\text{ W}$'],
        correctIndex: 0,
        explanation: 'Khi cộng hưởng: $\\mathcal{P}_{\\max} = \\frac{U^2}{R} = \\frac{120^2}{60} = 240\\text{ W}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Đặt điện áp xoay chiều $U = 100\\text{ V}$, $f = 50\\text{ Hz}$ vào đoạn mạch RLC nối tiếp gồm $R = 40\\,\\Omega$, $L = \\frac{0{,}5}{\\pi}\\text{ H}$, $C = \\frac{10^{-3}}{8\\pi}\\text{ F}$. Tính hệ số công suất $\\cos\\varphi$ và công suất tiêu thụ $\\mathcal{P}$ của mạch.',
        hints: ['Tính $Z_L = 50\\,\\Omega$, $Z_C = 80\\,\\Omega$, $Z = 50\\,\\Omega$, $\\cos\\varphi = R/Z$.'],
        solutionSteps: [
          'Bước 1: $Z_L = 100\\pi\\cdot\\frac{0{,}5}{\\pi} = 50\\,\\Omega$; $Z_C = \\frac{1}{100\\pi\\cdot\\frac{10^{-3}}{8\\pi}} = 80\\,\\Omega$.',
          'Bước 2: $Z = \\sqrt{40^2 + (50 - 80)^2} = 50\\,\\Omega \\Rightarrow \\cos\\varphi = \\frac{40}{50} = 0{,}8$.',
          'Bước 3: $I = \\frac{100}{50} = 2\\text{ A} \\Rightarrow \\mathcal{P} = U I \\cos\\varphi = 100 \\cdot 2 \\cdot 0{,}8 = 160\\text{ W}$.'
        ],
        finalAnswer: '$\\cos\\varphi = 0{,}8$; $\\mathcal{P} = 160\\text{ W}$.'
      }
    ]
  },
  {
    id: 'phys-2006-12-14',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương III: Dòng điện xoay chiều',
    sourceTag: SRC_12,
    lessonNumber: 14,
    title: 'Bài 14 (2006): Truyền tải điện, Máy biến áp, Máy phát & Động cơ 3 pha',
    subtitle: 'Công thức máy biến áp U₁/U₂ = N₁/N₂, tần số máy phát f = np/60, dòng 3 pha đấu sao/tam giác và động cơ không đồng bộ',
    description:
      'Tính toán hệ thống truyền tải điện năng đi xa và máy biến áp lí tưởng, liên hệ số cặp cực và tốc độ quay rôto máy phát xoay chiều, nguyên tắc từ trường quay của động cơ 3 pha.',
    theorySections: [
      {
        heading: '1. Truyền tải điện & Máy biến áp',
        content:
          '• Hao phí tỏa nhiệt trên dây tải: $\\Delta\\mathcal{P} = \\frac{\\mathcal{P}^2 R}{(U\\cos\\varphi)^2}$.\n• **Máy biến áp** lí tưởng (mạch từ kín): $\\frac{U_1}{U_2} = \\frac{N_1}{N_2} = \\frac{I_2}{I_1}$ (làm biến đổi điện áp và cường độ dòng xoay chiều, **không đổi tần số**).'
      },
      {
        heading: '2. Máy phát điện & Động cơ không đồng bộ ba pha',
        content:
          '• Tần số dòng điện do máy phát có $p$ cặp cực quay $n$ vòng/s phát ra: $f = n p$ (nếu $n$ tính bằng vòng/phút thì $f = \\frac{np}{60}$).\n• **Dòng xoay chiều 3 pha**: gồm 3 suất điện động lệch pha nhau $\\frac{2\\pi}{3}$, tạo **từ trường quay** đều trong động cơ không đồng bộ 3 pha (tốc độ rôto nhỏ hơn tốc độ từ trường quay).'
      }
    ],
    keyFormulas: [
      '\\frac{U_1}{U_2} = \\frac{N_1}{N_2} = \\frac{I_2}{I_1} \\text{ (lí tưởng)}, \\quad \\Delta\\mathcal{P} = \\frac{\\mathcal{P}^2 R}{(U\\cos\\varphi)^2}',
      'f = n p \\text{ (vòng/s)} = \\frac{n p}{60} \\text{ (vòng/phút)}'
    ],
    ...SIM_PRESETS.transformer,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Một máy phát điện xoay chiều một pha có $p = 4$ cặp cực, rôto quay đều với tốc độ $750\\text{ vòng/phút}$. Tần số dòng điện máy phát ra là:',
        options: ['A. $50\\text{ Hz}$', 'B. $60\\text{ Hz}$', 'C. $100\\text{ Hz}$', 'D. $25\\text{ Hz}$'],
        correctIndex: 0,
        explanation: '$f = \\frac{n p}{60} = \\frac{750 \\cdot 4}{60} = 50\\text{ Hz}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một máy biến áp lí tưởng có số vòng cuộn sơ cấp $N_1 = 2200$ vòng, thứ cấp $N_2 = 110$ vòng. Cuộn sơ cấp nối vào điện áp $U_1 = 220\\text{ V}$, cuộn thứ cấp nối với tải thuần trở $R = 5{,}5\\,\\Omega$. Tính điện áp hiệu dụng thứ cấp $U_2$ và cường độ dòng điện ở cuộn sơ cấp $I_1$.',
        hints: ['Tính $U_2 = U_1 \\frac{N_2}{N_1}$, rồi $I_2 = U_2/R$ và suy ra $I_1 = I_2 \\frac{N_2}{N_1}$.'],
        solutionSteps: [
          'Bước 1: $U_2 = 220\\cdot\\frac{110}{2200} = 11\\text{ V}$.',
          'Bước 2: Dòng thứ cấp $I_2 = \\frac{U_2}{R} = \\frac{11}{5{,}5} = 2\\text{ A}$.',
          'Bước 3: Dòng sơ cấp $I_1 = I_2\\cdot\\frac{N_2}{N_1} = 2\\cdot\\frac{110}{2200} = 0{,}1\\text{ A}$.'
        ],
        finalAnswer: '$U_2 = 11\\text{ V}$; $I_1 = 0{,}1\\text{ A}$.'
      }
    ]
  },

  // ==================== CHƯƠNG IV: DAO ĐỘNG VÀ SÓNG ĐIỆN TỪ (Bài 15–16) ====================
  {
    id: 'phys-2006-12-15',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương IV: Dao động và Sóng điện từ',
    sourceTag: SRC_12,
    lessonNumber: 15,
    title: 'Bài 15 (2006): Mạch dao động LC & Năng lượng điện từ',
    subtitle: 'Tần số góc ω = 1/√(LC), chu kì T = 2π√(LC), mối liên hệ I₀ = ωQ₀ và bảo toàn năng lượng điện từ W = ½LI₀² = ½CU₀²',
    description:
      'Phân tích dao động điện từ tự do trong mạch LC lí tưởng, lập phương trình điện tích $q$, dòng điện $i = q\'$ sớm pha $\\pi/2$ so với $q$ và bảo toàn năng lượng điện từ.',
    theorySections: [
      {
        heading: '1. Dao động điện từ tự do trong mạch LC',
        content:
          '• Mạch kín gồm tụ điện $C$ nối với cuộn cảm thuần $L$ dao động điều hòa tự do với:\n$$\\omega = \\frac{1}{\\sqrt{LC}}, \\quad T = 2\\pi\\sqrt{LC}, \\quad f = \\frac{1}{2\\pi\\sqrt{LC}}$$\n• Điện tích $q = Q_0\\cos(\\omega t + \\varphi)$; dòng điện $i = q\' = I_0\\cos\\left(\\omega t + \\varphi + \\frac{\\pi}{2}\\right)$ (sớm pha $\\pi/2$ so với $q, u$) với $I_0 = \\omega Q_0 = U_0\\sqrt{\\frac{C}{L}}$.'
      },
      {
        heading: '2. Năng lượng điện từ',
        content:
          '• Năng lượng điện từ bằng tổng năng lượng điện trường (trong tụ) và năng lượng từ trường (trong cuộn cảm):\n$$W = W_{\\text{đ}} + W_t = \\frac{q^2}{2C} + \\frac{1}{2}L i^2 = \\frac{Q_0^2}{2C} = \\frac{1}{2}C U_0^2 = \\frac{1}{2}L I_0^2$$'
      }
    ],
    keyFormulas: [
      'T = 2\\pi\\sqrt{LC}, \\quad I_0 = \\omega Q_0 = U_0\\sqrt{\\frac{C}{L}}',
      'W = \\frac{1}{2}C U_0^2 = \\frac{1}{2} L I_0^2 = \\frac{Q_0^2}{2C}'
    ],
    ...SIM_PRESETS.em_wave,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Một mạch dao động LC lí tưởng gồm $L = 4\\text{ mH}$ và $C = 9\\text{ nF}$. Tần số góc dao động riêng của mạch là:',
        options: ['A. $\\frac{10^6}{6}\\text{ rad/s}$', 'B. $\\frac{10^5}{6}\\text{ rad/s}$', 'C. $6\\cdot 10^5\\text{ rad/s}$', 'D. $1{,}67\\cdot 10^4\\text{ rad/s}$'],
        correctIndex: 0,
        explanation: '$\\omega = \\frac{1}{\\sqrt{4\\cdot 10^{-3} \\cdot 9\\cdot 10^{-9}}} = \\frac{1}{6\\cdot 10^{-6}} = \\frac{10^6}{6}\\text{ rad/s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Mạch dao động lí tưởng gồm cuộn cảm $L = 2\\text{ mH}$ và tụ $C = 8\\text{ pF}$. Điện áp cực đại giữa hai bản tụ là $U_0 = 10\\text{ V}$. Tính chu kì dao động riêng $T$, cường độ dòng điện cực đại $I_0$ và năng lượng điện từ của mạch.',
        hints: ['Đổi $L = 2\\cdot 10^{-3}\\text{ H}$, $C = 8\\cdot 10^{-12}\\text{ F}$; dùng $I_0 = U_0\\sqrt{C/L}$.'],
        solutionSteps: [
          'Bước 1: $T = 2\\pi\\sqrt{2\\cdot 10^{-3}\\cdot 8\\cdot 10^{-12}} = 2\\pi\\cdot 4\\cdot 10^{-7} = 8\\pi\\cdot 10^{-7}\\text{ s} \\approx 2{,}51\\,\\mu\\text{s}$.',
          'Bước 2: $I_0 = U_0\\sqrt{\\frac{C}{L}} = 10\\sqrt{\\frac{8\\cdot 10^{-12}}{2\\cdot 10^{-3}}} = 10\\sqrt{40\\cdot 10^{-10}} = 10\\cdot 2\\sqrt{10}\\cdot 10^{-5} \\approx 6{,}32\\cdot 10^{-4}\\text{ A} = 0{,}632\\text{ mA}$.',
          'Bước 3: $W = \\frac{1}{2} C U_0^2 = \\frac{1}{2}\\cdot 8\\cdot 10^{-12}\\cdot 100 = 4\\cdot 10^{-10}\\text{ J}$.'
        ],
        finalAnswer: '$T \\approx 2{,}51\\,\\mu\\text{s}$; $I_0 \\approx 0{,}632\\text{ mA}$; $W = 4\\cdot 10^{-10}\\text{ J}$.'
      }
    ]
  },
  {
    id: 'phys-2006-12-16',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương IV: Dao động và Sóng điện từ',
    sourceTag: SRC_12,
    lessonNumber: 16,
    title: 'Bài 16 (2006): Điện từ trường, Sóng điện từ & Thông tin liên lạc Vô tuyến',
    subtitle: 'Thuyết điện từ Mắc-xoen, sóng ngang E ⊥ B ⊥ v (cùng pha), bước sóng λ = c·2π√(LC) và nguyên tắc phát – thu sóng vô tuyến',
    description:
      'Nắm vững tính chất sóng điện từ (truyền trong chân không tốc độ $c = 3\\cdot 10^8\\text{ m/s}$, $\\vec{E}$ và $\\vec{B}$ dao động cùng pha), phân biệt các dải sóng dài–trung–ngắn–cực ngắn và 4 khối máy thu/phát thanh.',
    theorySections: [
      {
        heading: '1. Điện từ trường & Đặc điểm sóng điện từ',
        content:
          '• Từ trường biến thiên sinh ra điện trường xoáy; điện trường biến thiên sinh ra từ trường. Hai trường liên kết thành **điện từ trường**.\n• **Sóng điện từ** truyền được trong cả **chân không** ($c = 3\\cdot 10^8\\text{ m/s}$); là **sóng ngang** với $\\vec{E} \\perp \\vec{B} \\perp \\vec{v}$ (tam diện thuận) và tại mỗi điểm $\\vec{E}, \\vec{B}$ biến thiên **cùng pha**.'
      },
      {
        heading: '2. Thông tin liên lạc bằng sóng vô tuyến',
        content:
          '• Bước sóng mạch LC thu/phát được: $\\lambda = c T = 2\\pi c\\sqrt{LC}$.\n• **Sóng ngắn** ($10\\text{ m} - 100\\text{ m}$) phản xạ tốt trên tầng điện li và mặt đất nên truyền đi rất xa; **sóng cực ngắn** ($<10\\text{ m}$) xuyên qua tầng điện li dùng truyền thông vệ tinh.\n• Nguyên tắc thu phát: dùng biến điệu sóng mang cao tần và tách sóng ở máy thu dựa trên cộng hưởng mạch chọn sóng.'
      }
    ],
    keyFormulas: [
      '\\lambda = c T = 2\\pi c\\sqrt{LC} \\quad (c = 3\\cdot 10^8\\text{ m/s})',
      '\\vec{E} \\perp \\vec{B} \\perp \\vec{v} \\text{ và } \\vec{E}, \\vec{B} \\text{ cùng pha}'
    ],
    ...SIM_PRESETS.em_wave,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Trong sóng điện từ lan truyền trong chân không, nhận xét nào sau đây ĐÚNG về vectơ $\\vec{E}$ và $\\vec{B}$ tại cùng một điểm?',
        options: [
          'A. Cùng phương và vuông pha nhau',
          'B. Vuông góc với nhau và cùng pha với nhau',
          'C. Cùng phương và ngược pha nhau',
          'D. Vuông góc với nhau và lệch pha $\\pi/2$'
        ],
        correctIndex: 1,
        explanation: 'Trong sóng điện từ, $\\vec{E}$ và $\\vec{B}$ luôn vuông góc với nhau, vuông góc với phương truyền sóng và dao động cùng pha.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Mạch chọn sóng của một máy thu thanh gồm cuộn cảm $L = \\frac{1}{\\pi^2}\\,\\mu\\text{H}$ và tụ xoay có điện dung biến thiên từ $C_1 = 25\\text{ pF}$ đến $C_2 = 400\\text{ pF}$ ($c = 3\\cdot 10^8\\text{ m/s}$). Tính dải bước sóng máy có thể thu được.',
        hints: ['Dùng $\\lambda = 2\\pi c \\sqrt{LC}$ tại hai giá trị biên $C_1$ và $C_2$.'],
        solutionSteps: [
          'Bước 1: Đổi $L = \\frac{10^{-6}}{\\pi^2}\\text{ H}$; $C_1 = 25\\cdot 10^{-12}\\text{ F}$; $C_2 = 400\\cdot 10^{-12}\\text{ F}$.',
          'Bước 2: $\\lambda_1 = 2\\pi\\cdot 3\\cdot 10^8\\sqrt{\\frac{10^{-6}}{\\pi^2}\\cdot 25\\cdot 10^{-12}} = 2\\pi\\cdot 3\\cdot 10^8\\cdot \\frac{5\\cdot 10^{-9}}{\\pi} = 3\\text{ m}$.',
          'Bước 3: $\\lambda_2 = \\lambda_1\\sqrt{\\frac{C_2}{C_1}} = 3\\sqrt{\\frac{400}{25}} = 3 \\cdot 4 = 12\\text{ m}$.'
        ],
        finalAnswer: 'Dải bước sóng từ $3\\text{ m}$ đến $12\\text{ m}$.'
      }
    ]
  },

  // ==================== CHƯƠNG V: SÓNG ÁNH SÁNG (Bài 17–18) ====================
  {
    id: 'phys-2006-12-17',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương V: Sóng ánh sáng',
    sourceTag: SRC_12,
    lessonNumber: 17,
    title: 'Bài 17 (2006): Tán sắc ánh sáng, Máy quang phổ & Các loại quang phổ',
    subtitle: 'Thí nghiệm Niu-tơn về tán sắc, ánh sáng đơn sắc không bị tán sắc, máy quang phổ lăng kính và quang phổ liên tục – vạch phát xạ – vạch hấp thụ',
    description:
      'Giải thích nguyên nhân sự tán sắc (chiết suất môi trường thay đổi theo bước sóng $n_{\\text{đỏ}} < n_{\\text{tím}}$), cấu tạo máy quang phổ và cách nhận diện nguyên tố hóa học từ quang phổ vạch.',
    theorySections: [
      {
        heading: '1. Tán sắc ánh sáng & Ánh sáng đơn sắc',
        content:
          '• **Tán sắc ánh sáng** là sự phân tách một chùm ánh sáng phức tạp thành các chùm ánh sáng đơn sắc khác nhau khi qua lăng kính.\n• **Ánh sáng đơn sắc** có một màu và bước sóng (tần số) nhất định, **không bị tán sắc** khi qua lăng kính.\n• Nguyên nhân tán sắc: Chiết suất của một chất trong suốt phụ thuộc màu sắc ánh sáng, tăng dần từ đỏ đến tím ($n_{\\text{đỏ}} < \\dots < n_{\\text{tím}}$).'
      },
      {
        heading: '2. Máy quang phổ & Ba loại quang phổ',
        content:
          '• Máy quang phổ gồm 3 bộ phận: ống chuẩn trực (tạo chùm song song), hệ tán sắc (lăng kính), buồng tối (hội tụ ảnh các vạch màu).\n• **Quang phổ liên tục**: phát ra từ chất rắn, lỏng, khí áp suất lớn bị nung nóng (chỉ phụ thuộc nhiệt độ nguồn).\n• **Quang phổ vạch phát xạ** và **vạch hấp thụ**: đặc trưng riêng cho từng nguyên tố hóa học (khí/hơi áp suất thấp).'
      }
    ],
    keyFormulas: [
      'n_{\\text{đỏ}} < n_{\\text{cam}} < n_{\\text{vàng}} < n_{\\text{lục}} < n_{\\text{lam}} < n_{\\text{chàm}} < n_{\\text{tím}}',
      '\\lambda_{\\text{đỏ}} \\approx 0{,}76\\,\\mu\\text{m} > \\lambda_{\\text{tím}} \\approx 0{,}38\\,\\mu\\text{m}'
    ],
    ...SIM_PRESETS.prism,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Quang phổ liên tục do một vật rắn nóng sáng phát ra phụ thuộc vào yếu tố nào?',
        options: [
          'A. Bản chất hóa học của vật rắn',
          'B. Nhiệt độ của vật rắn',
          'C. Hình dạng của vật rắn',
          'D. Khối lượng của vật rắn'
        ],
        correctIndex: 1,
        explanation: 'Quang phổ liên tục không phụ thuộc thành phần cấu tạo mà chỉ phụ thuộc nhiệt độ của nguồn phát.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Chiếu một chùm sáng hẹp gồm hai bức xạ đỏ ($n_{\\text{đ}} = 1{,}50$) và tím ($n_t = 1{,}54$) từ không khí vào bản thủy tinh dưới góc tới $i = 60^\\circ$. Tính góc giữa tia khúc xạ đỏ và tia khúc xạ tím trong thủy tinh.',
        hints: ['Dùng $\\sin 60^\\circ = n_{\\text{đ}}\\sin r_{\\text{đ}} = n_t\\sin r_t$, rồi tính $\\Delta r = r_{\\text{đ}} - r_t$.'],
        solutionSteps: [
          'Bước 1: $\\sin r_{\\text{đ}} = \\frac{\\sin 60^\\circ}{1{,}50} \\approx 0{,}57735 \\Rightarrow r_{\\text{đ}} \\approx 35{,}26^\\circ$.',
          'Bước 2: $\\sin r_t = \\frac{\\sin 60^\\circ}{1{,}54} \\approx 0{,}56235 \\Rightarrow r_t \\approx 34{,}22^\\circ$.',
          'Bước 3: Góc tách giữa hai tia $\\Delta r = 35{,}26^\\circ - 34{,}22^\\circ = 1{,}04^\\circ$.'
        ],
        finalAnswer: '$\\Delta r \\approx 1{,}04^\\circ$.'
      }
    ]
  },
  {
    id: 'phys-2006-12-18',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương V: Sóng ánh sáng',
    sourceTag: SRC_12,
    lessonNumber: 18,
    title: 'Bài 18 (2006): Giao thoa ánh sáng Y-âng & Các bức xạ không nhìn thấy (Thang sóng điện từ)',
    subtitle: 'Khoảng vân i = λD/a, vị trí vân sáng – vân tối, giao thoa ánh sáng trắng và tia Hồng ngoại – Tử ngoại – Tia X',
    description:
      'Chứng minh tính chất sóng của ánh sáng qua thí nghiệm khe Y-âng ($i = \\frac{\\lambda D}{a}$), tính số vân trong trường giao thoa và hệ thống toàn bộ thang sóng điện từ từ sóng vô tuyến đến tia gamma.',
    theorySections: [
      {
        heading: '1. Thí nghiệm khe Y-âng về giao thoa ánh sáng',
        content:
          '• Hai khe hẹp cách nhau $a$, đặt cách màn ảnh $D$, chiếu sáng bởi bước sóng $\\lambda$.\n• **Khoảng vân** (khoảng cách hai vân sáng hoặc hai vân tối liên tiếp): $i = \\frac{\\lambda D}{a}$.\n• **Vân sáng**: $x_s = k i = k\\frac{\\lambda D}{a}$ ($k \\in \\mathbb{Z}$); **vân tối**: $x_t = \\left(k + \\frac{1}{2}\\right)i$. Trong ánh sáng trắng, vân trung tâm màu trắng, hai bên là quang phổ bậc $1, 2, \\dots$'
      },
      {
        heading: '2. Tia Hồng ngoại, Tia Tử ngoại, Tia X & Thang sóng điện từ',
        content:
          '• **Tia hồng ngoại** ($\\lambda > 0{,}76\\,\\mu\\text{m}$): tác dụng nhiệt mạnh, điều khiển từ xa.\n• **Tia tử ngoại** ($\\lambda < 0{,}38\\,\\mu\\text{m}$): kích thích phát quang, diệt khuẩn, bị thủy tinh và nước hấp thụ mạnh.\n• **Tia X (Rơn-ghen)** ($10^{-11}\\text{ m} \\sim 10^{-8}\\text{ m}$): đâm xuyên mạnh (chụp X-quang), làm đen kính ảnh.'
      }
    ],
    keyFormulas: [
      'i = \\frac{\\lambda D}{a}, \\quad x_{\\text{sáng}} = k i, \\quad x_{\\text{tối}} = \\left(k + \\frac{1}{2}\\right) i',
      '\\text{Sóng vô tuyến} > \\text{Hồng ngoại} > \\text{Khả kiến} > \\text{Tử ngoại} > \\text{Tia X} > \\text{Tia } \\gamma \\quad (\\lambda \\text{ giảm dần})'
    ],
    ...SIM_PRESETS.young_light,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Trong thí nghiệm Y-âng, hai khe cách nhau $a = 1\\text{ mm}$, màn cách hai khe $D = 2\\text{ m}$, ánh sáng có bước sóng $\\lambda = 0{,}6\\,\\mu\\text{m}$. Khoảng vân trên màn là:',
        options: ['A. $1{,}2\\text{ mm}$', 'B. $0{,}6\\text{ mm}$', 'C. $2{,}4\\text{ mm}$', 'D. $0{,}3\\text{ mm}$'],
        correctIndex: 0,
        explanation: '$i = \\frac{\\lambda D}{a} = \\frac{0{,}6\\cdot 2}{1} = 1{,}2\\text{ mm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Trong thí nghiệm Y-âng với $a = 1{,}2\\text{ mm}$, $D = 2{,}4\\text{ m}$, chiếu ánh sáng đơn sắc có bước sóng $\\lambda = 0{,}5\\,\\mu\\text{m}$. Tính khoảng vân $i$, vị trí vân sáng bậc $4$ và cho biết tại điểm $M$ cách vân trung tâm $3{,}5\\text{ mm}$ có vân sáng hay vân tối bậc mấy?',
        hints: ['Tính $i = \\lambda D / a$, rồi xét tỉ số $x_M / i$.'],
        solutionSteps: [
          'Bước 1: $i = \\frac{0{,}5 \\cdot 2{,}4}{1{,}2} = 1\\text{ mm}$.',
          'Bước 2: Vân sáng bậc $4$: $x_{s4} = 4 i = 4\\text{ mm}$.',
          'Bước 3: Xét $\\frac{x_M}{i} = \\frac{3{,}5}{1} = 3{,}5 = 3 + 0{,}5 \\Rightarrow$ tại $M$ là **vân tối thứ $4$**.'
        ],
        finalAnswer: '$i = 1\\text{ mm}$; $x_{s4} = 4\\text{ mm}$; tại $M$ là vân tối thứ $4$.'
      }
    ]
  },

  // ==================== CHƯƠNG VI: LƯỢNG TỬ ÁNH SÁNG (Bài 19–20) ====================
  {
    id: 'phys-2006-12-19',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương VI: Lượng tử ánh sáng',
    sourceTag: SRC_12,
    lessonNumber: 19,
    title: 'Bài 19 (2006): Hiện tượng Quang điện ngoài, Thuyết lượng tử & Công thức Anh-xtanh',
    subtitle: 'Năng lượng phôtôn ε = hf = hc/λ, định luật về giới hạn quang điện λ ≤ λ₀, công thức Anh-xtanh hc/λ = A + ½mv₀max² và quang điện trong',
    description:
      'Giải thích ba định luật quang điện bằng thuyết lượng tử ánh sáng của Plăng – Anh-xtanh, tính công thoát $A = hc/\\lambda_0$, động năng ban đầu cực đại của quang êlectron và phân biệt quang điện trong (quang dẫn, pin quang điện).',
    theorySections: [
      {
        heading: '1. Thuyết lượng tử ánh sáng & Định luật giới hạn quang điện',
        content:
          '• Ánh sáng được tạo thành bởi các hạt gọi là **phôtôn**. Mỗi phôtôn của ánh sáng đơn sắc tần số $f$ mang năng lượng $\\varepsilon = h f = \\frac{h c}{\\lambda}$ ($h = 6{,}625\\cdot 10^{-34}\\text{ J}\\cdot\\text{s}$).\n• **Điều kiện xảy ra hiện tượng quang điện**: bước sóng ánh sáng kích thích phải nhỏ hơn hoặc bằng giới hạn quang điện của kim loại: $\\lambda \\le \\lambda_0 = \\frac{hc}{A}$.'
      },
      {
        heading: '2. Công thức Anh-xtanh & Quang điện trong',
        content:
          '• **Phương trình Anh-xtanh**: $\\frac{hc}{\\lambda} = A + \\frac{1}{2}m v_{0\\max}^2 = A + |e| U_h$ ($U_h$ là hiệu điện thế hãm).\n• **Quang điện trong**: xảy ra trong chất bán dẫn (tạo cặp êlectron – lỗ trống bên trong khối bán dẫn), ứng dụng chế tạo **quang điện trở** và **pin quang điện**.'
      }
    ],
    keyFormulas: [
      '\\varepsilon = h f = \\frac{hc}{\\lambda}, \\quad \\lambda_0 = \\frac{hc}{A}',
      '\\frac{hc}{\\lambda} = A + \\frac{1}{2}m v_{0\\max}^2 \\quad (hc \\approx 1{,}9875\\cdot 10^{-25}\\text{ J}\\cdot\\text{m})'
    ],
    ...SIM_PRESETS.photoelectric,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Một kim loại có công thoát êlectron $A = 4{,}14\\text{ eV}$ ($1\\text{ eV} = 1{,}6\\cdot 10^{-19}\\text{ J}$, $hc = 1{,}9875\\cdot 10^{-25}\\text{ J}\\cdot\\text{m}$). Giới hạn quang điện $\\lambda_0$ của kim loại này là:',
        options: ['A. $0{,}30\\,\\mu\\text{m}$', 'B. $0{,}45\\,\\mu\\text{m}$', 'C. $0{,}60\\,\\mu\\text{m}$', 'D. $0{,}25\\,\\mu\\text{m}$'],
        correctIndex: 0,
        explanation: '$A = 4{,}14\\cdot 1{,}6\\cdot 10^{-19} = 6{,}624\\cdot 10^{-19}\\text{ J} \\Rightarrow \\lambda_0 = \\frac{1{,}9875\\cdot 10^{-25}}{6{,}624\\cdot 10^{-19}} \\approx 0{,}30\\cdot 10^{-6}\\text{ m} = 0{,}30\\,\\mu\\text{m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Chiếu bức xạ có bước sóng $\\lambda = 0{,}25\\,\\mu\\text{m}$ vào catôt làm bằng kim loại có giới hạn quang điện $\\lambda_0 = 0{,}30\\,\\mu\\text{m}$. Tính động năng ban đầu cực đại của quang êlectron (theo Jun và eV) và vận tốc ban đầu cực đại ($m_e = 9{,}1\\cdot 10^{-31}\\text{ kg}$).',
        hints: ['Dùng $W_{\\text{đ}\\max} = hc\\left(\\frac{1}{\\lambda} - \\frac{1}{\\lambda_0}\\right) = \\frac{1}{2}m_e v_{0\\max}^2$.'],
        solutionSteps: [
          'Bước 1: $W_{\\text{đ}\\max} = 1{,}9875\\cdot 10^{-25}\\left(\\frac{1}{0{,}25\\cdot 10^{-6}} - \\frac{1}{0{,}30\\cdot 10^{-6}}\\right) = 1{,}9875\\cdot 10^{-19}\\cdot\\frac{2}{3} = 1{,}325\\cdot 10^{-19}\\text{ J} \\approx 0{,}828\\text{ eV}$.',
          'Bước 2: $v_{0\\max} = \\sqrt{\\frac{2 W_{\\text{đ}\\max}}{m_e}} = \\sqrt{\\frac{2\\cdot 1{,}325\\cdot 10^{-19}}{9{,}1\\cdot 10^{-31}}} \\approx 5{,}4\\cdot 10^5\\text{ m/s}$.'
        ],
        finalAnswer: '$W_{\\text{đ}\\max} = 1{,}325\\cdot 10^{-19}\\text{ J}$ ($0{,}83\\text{ eV}$); $v_{0\\max} \\approx 5{,}4\\cdot 10^5\\text{ m/s}$.'
      }
    ]
  },
  {
    id: 'phys-2006-12-20',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương VI: Lượng tử ánh sáng',
    sourceTag: SRC_12,
    lessonNumber: 20,
    title: 'Bài 20 (2006): Hiện tượng Quang – Phát quang, Mẫu Bo & Laze',
    subtitle: 'Huỳnh quang – lân quang, hai tiên đề Bo về trạng thái dừng – bức xạ/hấp thụ phôtôn ε = E_n - E_m, dãy Lai-man/Ban-me/Pa-sen và Laze',
    description:
      'Hiểu quy luật bước sóng phát quang $\\lambda_{pq} > \\lambda_{kt}$, bán kính quỹ đạo Bo $r_n = n^2 r_0$, mức năng lượng nguyên tử Hiđrô $E_n = -13{,}6/n^2\\text{ (eV)}$ và đặc tính chùm tia Laze.',
    theorySections: [
      {
        heading: '1. Tiên đề Bo & Quang phổ vạch nguyên tử Hiđrô',
        content:
          '• **Tiên đề trạng thái dừng**: Nguyên tử chỉ tồn tại ở những trạng thái có năng lượng xác định $E_n$ và không bức xạ. Ở nguyên tử Hiđrô: $r_n = n^2 r_0$ ($r_0 = 5{,}3\\cdot 10^{-11}\\text{ m}$), $E_n = -\\frac{13{,}6}{n^2}\\text{ (eV)}$.\n• **Tiên đề bức xạ/hấp thụ**: Khi chuyển từ mức cao $E_n$ xuống mức thấp $E_m$, nguyên tử phát ra phôtôn có năng lượng $\\varepsilon = hf = \\frac{hc}{\\lambda} = E_n - E_m$.'
      },
      {
        heading: '2. Quang – Phát quang & Sơ lược về Laze',
        content:
          '• Định luật Xtốc về phát quang: ánh sáng phát quang có bước sóng dài hơn ánh sáng kích thích ($\\lambda_{pq} > \\lambda_{kt}$).\n• **Laze** dựa trên hiện tượng phát xạ cảm ứng, có 4 đặc tính nổi bật: **đơn sắc cao, kết hợp cao, định hướng cao và cường độ lớn**.'
      }
    ],
    keyFormulas: [
      'r_n = n^2 r_0, \\quad E_n = -\\frac{13{,}6}{n^2}\\text{ (eV)}',
      'h f_{nm} = \\frac{hc}{\\lambda_{nm}} = E_n - E_m'
    ],
    ...SIM_PRESETS.compton,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Khi êlectron ở nguyên tử Hiđrô chuyển từ quỹ đạo dừng thứ $n = 4$ ($N$) về quỹ đạo dừng thứ $n = 1$ ($K$), bán kính quỹ đạo của êlectron giảm đi:',
        options: ['A. $16$ lần', 'B. $4$ lần', 'C. $8$ lần', 'D. $15r_0$ (giảm $16$ lần)'],
        correctIndex: 0,
        explanation: 'Vì $r_n = n^2 r_0$ nên $r_4 = 16 r_0$ và $r_1 = r_0 \\Rightarrow$ bán kính giảm $16$ lần.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Biết các mức năng lượng của nguyên tử Hiđrô tuân theo $E_n = -\\frac{13{,}6}{n^2}\\text{ eV}$. Tính bước sóng của vạch đỏ $H_\\alpha$ trong dãy Ban-me (khi êlectron chuyển từ mức $n = 3$ về mức $n = 2$).',
        hints: ['Tính $\\Delta E = E_3 - E_2$ bằng eV, đổi sang Jun (nhân $1{,}6\\cdot 10^{-19}$) rồi dùng $\\lambda = hc / \\Delta E$.'],
        solutionSteps: [
          'Bước 1: $E_3 = -\\frac{13{,}6}{9} \\approx -1{,}511\\text{ eV}$; $E_2 = -\\frac{13{,}6}{4} = -3{,}400\\text{ eV}$.',
          'Bước 2: $\\Delta E = -1{,}511 - (-3{,}400) = 1{,}889\\text{ eV} = 3{,}022\\cdot 10^{-19}\\text{ J}$.',
          'Bước 3: $\\lambda = \\frac{1{,}9875\\cdot 10^{-25}}{3{,}022\\cdot 10^{-19}} \\approx 0{,}658\\cdot 10^{-6}\\text{ m} = 0{,}658\\,\\mu\\text{m}$ (ánh sáng đỏ).'
        ],
        finalAnswer: '$\\lambda_{H_\\alpha} \\approx 0{,}658\\,\\mu\\text{m}$.'
      }
    ]
  },

  // ==================== CHƯƠNG VII: HẠT NHÂN NGUYÊN TỬ (Bài 21–22) ====================
  {
    id: 'phys-2006-12-21',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương VII: Hạt nhân nguyên tử',
    sourceTag: SRC_12,
    lessonNumber: 21,
    title: 'Bài 21 (2006): Cấu tạo Hạt nhân, Độ hụt khối & Năng lượng liên kết',
    subtitle: 'Kí hiệu ᴬ_Z X, hệ thức Anh-xtanh E = mc² (1u = 931,5 MeV/c²), độ hụt khối Δm và năng lượng liên kết riêng ΔE / A',
    description:
      'Xác định số prôtôn $Z$, số nơtron $N = A - Z$, tính độ hụt khối $\\Delta m$, năng lượng liên kết $\\Delta E = \\Delta m c^2$ và đánh giá mức độ bền vững của hạt nhân qua năng lượng liên kết riêng.',
    theorySections: [
      {
        heading: '1. Cấu tạo hạt nhân & Hệ thức Anh-xtanh',
        content:
          '• Hạt nhân $^A_Z X$ gồm $Z$ prôtôn mang điện $+e$ và $N = A - Z$ nơtron không mang điện (gọi chung là $A$ nuclôn).\n• Đơn vị khối lượng nguyên tử $1\\text{ u} \\approx 1{,}66055\\cdot 10^{-27}\\text{ kg}$; hệ thức năng lượng–khối lượng Anh-xtanh: $E = m c^2$, với $1\\text{ u} c^2 = 931{,}5\\text{ MeV}$.'
      },
      {
        heading: '2. Độ hụt khối & Năng lượng liên kết',
        content:
          '• **Độ hụt khối**: $\\Delta m = Z m_p + (A - Z) m_n - m_X > 0$.\n• **Năng lượng liên kết**: $W_{lk} = \\Delta m c^2$. **Năng lượng liên kết riêng** $\\varepsilon = \\frac{W_{lk}}{A}$ càng lớn thì hạt nhân càng bền vững (bền nhất ở vùng số khối trung bình $50 \\le A \\le 80$, như $^{56}_{26}\\text{Fe}$).'
      }
    ],
    keyFormulas: [
      '\\Delta m = Z m_p + (A - Z) m_n - m_X',
      'W_{lk} = \\Delta m c^2, \\quad \\varepsilon = \\frac{W_{lk}}{A}, \\quad 1\\text{ u}c^2 = 931{,}5\\text{ MeV}'
    ],
    ...SIM_PRESETS.binding_energy,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Hạt nhân $^{238}_{92}\\text{U}$ có cấu tạo gồm bao nhiêu prôtôn và bao nhiêu nơtron?',
        options: [
          'A. $92$ prôtôn và $146$ nơtron',
          'B. $146$ prôtôn và $92$ nơtron',
          'C. $92$ prôtôn và $238$ nơtron',
          'D. $238$ prôtôn và $92$ nơtron'
        ],
        correctIndex: 0,
        explanation: 'Số prôtôn $Z = 92$; số nơtron $N = A - Z = 238 - 92 = 146$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Cho hạt nhân $^4_2\\text{He}$ có khối lượng $m_{\\text{He}} = 4{,}0015\\text{ u}$. Biết $m_p = 1{,}0073\\text{ u}$, $m_n = 1{,}0087\\text{ u}$ và $1\\text{ u}c^2 = 931{,}5\\text{ MeV}$. Tính độ hụt khối, năng lượng liên kết và năng lượng liên kết riêng của hạt nhân $^4_2\\text{He}$.',
        hints: ['$^4_2\\text{He}$ có $Z = 2$ prôtôn và $N = 2$ nơtron.'],
        solutionSteps: [
          'Bước 1: $\\Delta m = 2\\cdot 1{,}0073 + 2\\cdot 1{,}0087 - 4{,}0015 = 4{,}0320 - 4{,}0015 = 0{,}0305\\text{ u}$.',
          'Bước 2: $W_{lk} = 0{,}0305 \\cdot 931{,}5 \\approx 28{,}41\\text{ MeV}$.',
          'Bước 3: Năng lượng liên kết riêng $\\varepsilon = \\frac{28{,}41}{4} \\approx 7{,}10\\text{ MeV/nuclôn}$.'
        ],
        finalAnswer: '$\\Delta m = 0{,}0305\\text{ u}$; $W_{lk} \\approx 28{,}41\\text{ MeV}$; $\\varepsilon \\approx 7{,}10\\text{ MeV/nuclôn}$.'
      }
    ]
  },
  {
    id: 'phys-2006-12-22',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'Vật lí 12 (2006) · Chương VII: Hạt nhân nguyên tử',
    sourceTag: SRC_12,
    lessonNumber: 22,
    title: 'Bài 22 (2006): Phóng xạ, Định luật Phóng xạ & Phản ứng Phân hạch – Nhiệt hạch',
    subtitle: 'Bốn định luật bảo toàn phản ứng hạt nhân, phóng xạ α/β⁻/β⁺/γ, công thức N = N₀·2^(-t/T) và năng lượng tỏa/thu phản ứng',
    description:
      'Cân bằng phương trình phản ứng hạt nhân theo bảo toàn số khối và điện tích, tính khối lượng chất phóng xạ còn lại – bị phân rã theo chu kì bán rã $T$ và phân biệt phản ứng phân hạch với nhiệt hạch.',
    theorySections: [
      {
        heading: '1. Phóng xạ & Định luật phóng xạ',
        content:
          '• **Phóng xạ** là quá trình phân rã tự phát của một hạt nhân không bền vững ($\\alpha\\text{ }(^4_2\\text{He})$, $\\beta^-\\text{ }(^0_{-1}e)$, $\\beta^+\\text{ }(^0_{+1}e)$, $\\gamma$).\n• **Định luật phóng xạ**: $N(t) = N_0 e^{-\\lambda t} = N_0 \\cdot 2^{-t/T}$; tương tự cho khối lượng $m(t) = m_0 \\cdot 2^{-t/T}$, với hằng số phóng xạ $\\lambda = \\frac{\\ln 2}{T}$.'
      },
      {
        heading: '2. Phản ứng hạt nhân: Phân hạch & Nhiệt hạch',
        content:
          '• Mọi phản ứng hạt nhân bảo toàn: **điện tích ($Z$), số nuclôn ($A$), năng lượng toàn phần và động lượng**.\n• Năng lượng phản ứng: $\\Delta E = (m_{\\text{trước}} - m_{\\text{sau}}) c^2$ ($\\Delta E > 0$: tỏa năng lượng).\n• **Phân hạch**: hạt nhân rất nặng ($^{235}\\text{U},\\ ^{239}\\text{Pu}$) vỡ thành hai hạt nhân trung bình. **Nhiệt hạch**: hai hạt nhân rất nhẹ ($^2\\text{H},\\ ^3\\text{H}$) tổng hợp thành hạt nhân nặng hơn ở nhiệt độ cực cao.'
      }
    ],
    keyFormulas: [
      'N(t) = N_0\\cdot 2^{-t/T} = N_0 e^{-\\lambda t}, \\quad \\lambda = \\frac{\\ln 2}{T}',
      '\\Delta E = (m_{\\text{trước}} - m_{\\text{sau}}) c^2'
    ],
    ...SIM_PRESETS.nuclear,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Chất phóng xạ $^{131}\\text{I}$ có chu kì bán rã $T = 8\\text{ ngày}$. Ban đầu có $100\\text{ g}$ chất này; sau $24\\text{ ngày}$, khối lượng $^{131}\\text{I}$ còn lại chưa phân rã là:',
        options: ['A. $12{,}5\\text{ g}$', 'B. $25\\text{ g}$', 'C. $87{,}5\\text{ g}$', 'D. $50\\text{ g}$'],
        correctIndex: 0,
        explanation: '$t / T = 24 / 8 = 3 \\Rightarrow m = 100 \\cdot 2^{-3} = 12{,}5\\text{ g}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Ban đầu có một mẫu $^{210}_{84}\\text{Po}$ nguyên chất khối lượng $m_0 = 42\\text{ g}$, chu kì bán rã $T = 138\\text{ ngày}$. Pôlôni phóng xạ $\\alpha$ tạo thành hạt nhân chì Pb. Viết phương trình phóng xạ và tính khối lượng chì tạo thành sau $276\\text{ ngày}$.',
        hints: ['Tính số mol Po đã phân rã $\\Delta n = \\frac{m_0(1 - 2^{-t/T})}{210}$; cứ 1 mol Po phân rã tạo 1 mol $^{206}\\text{Pb}$.'],
        solutionSteps: [
          'Bước 1: Phương trình phóng xạ: $^{210}_{84}\\text{Po} \\to ^4_2\\text{He} + ^{206}_{82}\\text{Pb}$.',
          'Bước 2: Sau $t = 276 = 2T$ ngày, khối lượng Po bị phân rã: $\\Delta m_{\\text{Po}} = 42\\left(1 - 2^{-2}\\right) = 31{,}5\\text{ g}$.',
          'Bước 3: Khối lượng chì tạo thành: $m_{\\text{Pb}} = \\frac{\\Delta m_{\\text{Po}}}{210}\\cdot 206 = \\frac{31{,}5}{210}\\cdot 206 = 30{,}9\\text{ g}$.'
        ],
        finalAnswer: '$^{210}_{84}\\text{Po} \\to ^4_2\\text{He} + ^{206}_{82}\\text{Pb}$; $m_{\\text{Pb}} = 30{,}9\\text{ g}$.'
      }
    ]
  }
];
