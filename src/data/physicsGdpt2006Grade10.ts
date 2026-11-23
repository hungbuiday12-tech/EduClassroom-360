import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const SRC_10 = 'GDPT 2006 · Vật lí 10 Cơ bản (NXB Giáo dục Việt Nam)';

export const PHYSICS_GDPT_2006_GRADE_10: PhysicsLesson[] = [
  // ==================== CHƯƠNG I: ĐỘNG HỌC CHẤT ĐIỂM (Bài 1–5) ====================
  {
    id: 'phys-2006-10-1',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương I: Động học chất điểm',
    sourceTag: SRC_10,
    lessonNumber: 1,
    title: 'Bài 1 (2006): Chuyển động cơ & Chuyển động thẳng đều',
    subtitle: 'Chất điểm, hệ quy chiếu, tốc độ trung bình và phương trình tọa độ x = x₀ + vt của chuyển động thẳng đều',
    description:
      'Xác định vị trí vật trong hệ quy chiếu gắn với thước đo và đồng hồ, viết phương trình chuyển động thẳng đều $x = x_0 + vt$ và đọc đồ thị tọa độ – thời gian $(x-t)$.',
    theorySections: [
      {
        heading: '1. Chuyển động cơ & Hệ quy chiếu',
        content:
          '• Vật có kích thước rất nhỏ so với độ dài đường đi được coi là **chất điểm**.\n• **Hệ quy chiếu** gồm: vật làm mốc, hệ tọa độ gắn với vật làm mốc, mốc thời gian và đồng hồ đo thời gian.'
      },
      {
        heading: '2. Chuyển động thẳng đều',
        content:
          '• Là chuyển động có quỹ đạo thẳng và tốc độ trung bình như nhau trên mọi quãng đường.\n• Quãng đường: $s = vt$. Phương trình tọa độ: $x = x_0 + vt$ ($v > 0$ đi theo chiều dương, $v < 0$ đi ngược chiều dương).'
      }
    ],
    keyFormulas: [
      's = v \\cdot t, \\quad x = x_0 + v(t - t_0)',
      'v_{\\text{tb}} = \\frac{s_1 + s_2}{t_1 + t_2}'
    ],
    ...SIM_PRESETS.kinematics,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một ô tô chuyển động thẳng đều theo phương trình $x = 20 + 45t$ ($x$ tính bằng km, $t$ tính bằng giờ). Tọa độ ban đầu và vận tốc của ô tô là:',
        options: [
          'A. $x_0 = 20\\text{ km},\\ v = 45\\text{ km/h}$',
          'B. $x_0 = 45\\text{ km},\\ v = 20\\text{ km/h}$',
          'C. $x_0 = 0,\\ v = 65\\text{ km/h}$',
          'D. $x_0 = -20\\text{ km},\\ v = 45\\text{ km/h}$'
        ],
        correctIndex: 0,
        explanation: 'So sánh với $x = x_0 + vt$ ta được $x_0 = 20\\text{ km}$ và $v = 45\\text{ km/h}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Hai xe A và B xuất phát cùng lúc từ hai điểm cách nhau $60\\text{ km}$, chuyển động thẳng đều cùng chiều từ A đến B với vận tốc $v_A = 50\\text{ km/h}$ và $v_B = 35\\text{ km/h}$. Chọn gốc tọa độ tại A, chiều dương từ A đến B, gốc thời gian lúc xuất phát. Tìm thời điểm và vị trí hai xe gặp nhau.',
        hints: ['Viết $x_A = 50t$ và $x_B = 60 + 35t$, giải $x_A = x_B$.'],
        solutionSteps: [
          'Bước 1: Phương trình tọa độ: $x_A = 50t$; $x_B = 60 + 35t$.',
          'Bước 2: Hai xe gặp nhau khi $x_A = x_B \\iff 50t = 60 + 35t \\iff 15t = 60 \\iff t = 4\\text{ h}$.',
          'Bước 3: Vị trí gặp nhau cách A: $x = 50 \\cdot 4 = 200\\text{ km}$.'
        ],
        finalAnswer: 'Sau $4$ giờ, cách A $200\\text{ km}$.'
      }
    ]
  },
  {
    id: 'phys-2006-10-2',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương I: Động học chất điểm',
    sourceTag: SRC_10,
    lessonNumber: 2,
    title: 'Bài 2 (2006): Chuyển động thẳng biến đổi đều',
    subtitle: 'Vận tốc tức thời, gia tốc a = Δv/Δt, phương trình vận tốc – tọa độ và công thức độc lập thời gian v² - v₀² = 2as',
    description:
      'Phân biệt nhanh dần đều ($a\\cdot v > 0$) và chậm dần đều ($a\\cdot v < 0$), vận dụng thành thạo hệ bốn công thức động học của chuyển động thẳng biến đổi đều.',
    theorySections: [
      {
        heading: '1. Gia tốc & Vận tốc tức thời',
        content:
          '• **Gia tốc** đặc trưng cho độ biến thiên nhanh hay chậm của vận tốc: $a = \\frac{v - v_0}{t - t_0}$ ($\\text{m/s}^2$).\n• Chuyển động thẳng **nhanh dần đều** khi $\\vec{a}$ cùng chiều $\\vec{v}$ ($a\\cdot v > 0$); **chậm dần đều** khi $\\vec{a}$ ngược chiều $\\vec{v}$ ($a\\cdot v < 0$).'
      },
      {
        heading: '2. Hệ phương trình chuyển động thẳng biến đổi đều',
        content:
          '• Vận tốc: $v = v_0 + at$.\n• Quãng đường (khi chưa đổi chiều): $s = v_0 t + \\frac{1}{2} a t^2$.\n• Phương trình tọa độ: $x = x_0 + v_0 t + \\frac{1}{2} a t^2$.\n• Hệ thức độc lập thời gian: $v^2 - v_0^2 = 2as$.'
      }
    ],
    keyFormulas: [
      'v = v_0 + at, \\quad x = x_0 + v_0 t + \\frac{1}{2}at^2',
      'v^2 - v_0^2 = 2as'
    ],
    ...SIM_PRESETS.kinematics,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một ô tô đang chạy với vận tốc $20\\text{ m/s}$ thì hãm phanh chuyển động chậm dần đều với gia tốc có độ lớn $2\\text{ m/s}^2$. Quãng đường ô tô đi thêm được cho đến khi dừng hẳn là:',
        options: ['A. $50\\text{ m}$', 'B. $100\\text{ m}$', 'C. $200\\text{ m}$', 'D. $10\\text{ m}$'],
        correctIndex: 1,
        explanation: 'Dùng $v^2 - v_0^2 = 2as$ với $v = 0, v_0 = 20, a = -2 \\Rightarrow s = \\frac{0 - 400}{2(-2)} = 100\\text{ m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một đoàn tàu bắt đầu rời ga chuyển động thẳng nhanh dần đều, sau $20\\text{ s}$ đạt vận tốc $36\\text{ km/h}$. Tính gia tốc của tàu và quãng đường tàu đi được trong giây thứ $10$.',
        hints: ['Đổi $36\\text{ km/h} = 10\\text{ m/s}$, tính $a$, rồi tính $\\Delta s = s(10) - s(9)$.'],
        solutionSteps: [
          'Bước 1: $v = 10\\text{ m/s}$, $v_0 = 0 \\Rightarrow a = \\frac{10 - 0}{20} = 0{,}5\\text{ m/s}^2$.',
          'Bước 2: Quãng đường đi trong $10\\text{ s}$ đầu: $s_{10} = \\frac{1}{2}\\cdot 0{,}5 \\cdot 10^2 = 25\\text{ m}$.',
          'Bước 3: Quãng đường đi trong $9\\text{ s}$ đầu: $s_9 = \\frac{1}{2}\\cdot 0{,}5 \\cdot 9^2 = 20{,}25\\text{ m} \\Rightarrow \\Delta s = 25 - 20{,}25 = 4{,}75\\text{ m}$.'
        ],
        finalAnswer: '$a = 0{,}5\\text{ m/s}^2$; quãng đường giây thứ $10$ là $4{,}75\\text{ m}$.'
      }
    ]
  },
  {
    id: 'phys-2006-10-3',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương I: Động học chất điểm',
    sourceTag: SRC_10,
    lessonNumber: 3,
    title: 'Bài 3 (2006): Sự rơi tự do',
    subtitle: 'Đặc điểm rơi tự do không vận tốc đầu dưới tác dụng duy nhất của trọng lực và gia tốc rơi tự do g ≈ 9,8 m/s²',
    description:
      'Chứng minh mọi vật nặng nhẹ đều rơi nhanh như nhau khi loại bỏ sức cản không khí, áp dụng công thức rơi tự do $h = \\frac{1}{2}gt^2$ và $v = \\sqrt{2gh}$.',
    theorySections: [
      {
        heading: '1. Đặc điểm của sự rơi tự do',
        content:
          '• Sự rơi tự do là sự rơi chỉ dưới tác dụng của **trọng lực**.\n• Phương thẳng đứng, chiều từ trên xuống dưới; là **chuyển động thẳng nhanh dần đều** không vận tốc đầu ($v_0 = 0$) với gia tốc rơi tự do $g$ ($\\approx 9{,}8\\text{ m/s}^2$ hoặc $10\\text{ m/s}^2$).'
      },
      {
        heading: '2. Công thức sự rơi tự do',
        content:
          '• Vận tốc sau thời gian $t$: $v = g t$.\n• Quãng đường rơi sau thời gian $t$: $s = \\frac{1}{2} g t^2$.\n• Vận tốc khi rơi từ độ cao $h$: $v^2 = 2gh \\Rightarrow v = \\sqrt{2gh}$, thời gian rơi $t = \\sqrt{\\frac{2h}{g}}$.'
      }
    ],
    keyFormulas: [
      'v = gt, \\quad s = \\frac{1}{2}gt^2, \\quad v^2 = 2gh'
    ],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Thả một hòn đá rơi tự do từ độ cao $h = 45\\text{ m}$ xuống đất (lấy $g = 10\\text{ m/s}^2$). Thời gian rơi và vận tốc ngay trước khi chạm đất là:',
        options: [
          'A. $3\\text{ s};\\ 30\\text{ m/s}$',
          'B. $4{,}5\\text{ s};\\ 45\\text{ m/s}$',
          'C. $3\\text{ s};\\ 15\\text{ m/s}$',
          'D. $9\\text{ s};\\ 30\\text{ m/s}$'
        ],
        correctIndex: 0,
        explanation: '$t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{90}{10}} = 3\\text{ s}$; $v = gt = 30\\text{ m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một vật rơi tự do không vận tốc đầu từ độ cao $h$ ($g = 10\\text{ m/s}^2$). Trong $1\\text{ s}$ cuối cùng trước khi chạm đất vật rơi được $25\\text{ m}$. Tính thời gian rơi và độ cao $h$.',
        hints: ['Lập phương trình $\\frac{1}{2}gt^2 - \\frac{1}{2}g(t-1)^2 = 25$.'],
        solutionSteps: [
          'Bước 1: $5t^2 - 5(t - 1)^2 = 25 \\iff 5(2t - 1) = 25 \\iff 2t - 1 = 5 \\iff t = 3\\text{ s}$.',
          'Bước 2: Độ cao ban đầu: $h = \\frac{1}{2}\\cdot 10 \\cdot 3^2 = 45\\text{ m}$.'
        ],
        finalAnswer: '$t = 3\\text{ s}$; $h = 45\\text{ m}$.'
      }
    ]
  },
  {
    id: 'phys-2006-10-4',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương I: Động học chất điểm',
    sourceTag: SRC_10,
    lessonNumber: 4,
    title: 'Bài 4 (2006): Chuyển động tròn đều',
    subtitle: 'Tốc độ dài v, tốc độ góc ω, chu kì T, tần số f và gia tốc hướng tâm a_ht = v²/r = ω²r',
    description:
      'Thiết lập liên hệ $v = \\omega r$, $\\omega = \\frac{2\\pi}{T} = 2\\pi f$ và hiểu vì sao tốc độ không đổi nhưng chuyển động tròn đều vẫn luôn có gia tốc hướng tâm.',
    theorySections: [
      {
        heading: '1. Tốc độ dài, tốc độ góc, chu kì và tần số',
        content:
          '• **Chuyển động tròn đều** có quỹ đạo tròn và tốc độ trung bình trên mọi cung tròn là như nhau ($v = \\text{const}$).\n• Tốc độ góc $\\omega = \\frac{\\Delta\\varphi}{\\Delta t}$ ($\\text{rad/s}$); chu kì $T = \\frac{2\\pi}{\\omega}$ ($\\text{s}$); tần số $f = \\frac{1}{T} = \\frac{\\omega}{2\\pi}$ ($\\text{Hz}$). Liên hệ: $v = \\omega r$.'
      },
      {
        heading: '2. Gia tốc hướng tâm',
        content:
          '• Dù độ lớn $v$ không đổi nhưng phương vectơ $\\vec{v}$ liên tục thay đổi nên vật có gia tốc hướng vào tâm đường tròn gọi là **gia tốc hướng tâm**: $a_{ht} = \\frac{v^2}{r} = \\omega^2 r$.'
      }
    ],
    keyFormulas: [
      'v = \\omega r, \\quad \\omega = \\frac{2\\pi}{T} = 2\\pi f',
      'a_{ht} = \\frac{v^2}{r} = \\omega^2 r'
    ],
    ...SIM_PRESETS.circular,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một bánh xe bán kính $R = 0{,}5\\text{ m}$ quay đều $120\\text{ vòng/phút}$. Tốc độ dài của một điểm trên vành bánh xe bằng:',
        options: ['A. $2\\pi\\text{ m/s}$', 'B. $4\\pi\\text{ m/s}$', 'C. $\\pi\\text{ m/s}$', 'D. $60\\pi\\text{ m/s}$'],
        correctIndex: 0,
        explanation: '$f = 120/60 = 2\\text{ Hz} \\Rightarrow \\omega = 2\\pi f = 4\\pi\\text{ rad/s} \\Rightarrow v = \\omega R = 4\\pi \\cdot 0{,}5 = 2\\pi\\text{ m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Kim phút của một đồng hồ có chiều dài $10\\text{ cm}$. Tính tốc độ góc, tốc độ dài và gia tốc hướng tâm của đầu kim phút.',
        hints: ['Chu kì quay trọn $1$ vòng của kim phút là $T = 60\\text{ phút} = 3600\\text{ s}$; đổi $r = 0{,}1\\text{ m}$.'],
        solutionSteps: [
          'Bước 1: $T = 3600\\text{ s} \\Rightarrow \\omega = \\frac{2\\pi}{3600} \\approx 1{,}745\\cdot 10^{-3}\\text{ rad/s}$.',
          'Bước 2: $v = \\omega r = 1{,}745\\cdot 10^{-3} \\cdot 0{,}1 \\approx 1{,}745\\cdot 10^{-4}\\text{ m/s}$.',
          'Bước 3: $a_{ht} = \\omega^2 r \\approx (1{,}745\\cdot 10^{-3})^2 \\cdot 0{,}1 \\approx 3{,}05\\cdot 10^{-7}\\text{ m/s}^2$.'
        ],
        finalAnswer: '$\\omega \\approx 1{,}75\\cdot 10^{-3}\\text{ rad/s}$; $v \\approx 1{,}75\\cdot 10^{-4}\\text{ m/s}$; $a_{ht} \\approx 3{,}05\\cdot 10^{-7}\\text{ m/s}^2$.'
      }
    ]
  },
  {
    id: 'phys-2006-10-5',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương I: Động học chất điểm',
    sourceTag: SRC_10,
    lessonNumber: 5,
    title: 'Bài 5 (2006): Tính tương đối của chuyển động & Công thức cộng vận tốc',
    subtitle: 'Tính tương đối của quỹ đạo và vận tốc; công thức v₁₃ = v₁₂ + v₂₃ giải bài toán ca nô xuôi/ngược dòng',
    description:
      'Phân biệt vật (1), hệ quy chiếu chuyển động (2), hệ quy chiếu đứng yên (3) và áp dụng quy tắc cộng vectơ vận tốc $\\vec{v}_{13} = \\vec{v}_{12} + \\vec{v}_{23}$.',
    theorySections: [
      {
        heading: '1. Tính tương đối của chuyển động',
        content:
          '• Hình dạng quỹ đạo và vận tốc của cùng một vật có **tính tương đối**, phụ thuộc vào hệ quy chiếu được chọn.'
      },
      {
        heading: '2. Công thức cộng vận tốc',
        content:
          '• Vận tốc tuyệt đối $\\vec{v}_{13}$ bằng tổng vectơ của vận tốc tương đối $\\vec{v}_{12}$ và vận tốc kéo theo $\\vec{v}_{23}$: $\\vec{v}_{13} = \\vec{v}_{12} + \\vec{v}_{23}$.\n• Khi xuôi dòng: $v_{\\text{xuôi}} = v_{12} + v_{23}$; khi ngược dòng: $v_{\\text{ngược}} = |v_{12} - v_{23}|$; khi vuông góc bờ: $v_{13} = \\sqrt{v_{12}^2 + v_{23}^2}$.'
      }
    ],
    keyFormulas: [
      '\\vec{v}_{13} = \\vec{v}_{12} + \\vec{v}_{23}',
      '\\text{Xuôi: } v = v_{\\text{thuyền}} + v_{\\text{nước}}; \\quad \\text{Ngược: } v = v_{\\text{thuyền}} - v_{\\text{nước}}'
    ],
    ...SIM_PRESETS.vectors,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một ca nô có vận tốc đối với nước yên lặng là $18\\text{ km/h}$, nước chảy với vận tốc $4\\text{ km/h}$. Vận tốc của ca nô đối với bờ khi chạy xuôi dòng và ngược dòng lần lượt là:',
        options: ['A. $22\\text{ km/h}$ và $14\\text{ km/h}$', 'B. $14\\text{ km/h}$ và $22\\text{ km/h}$', 'C. $18\\text{ km/h}$ và $4\\text{ km/h}$', 'D. $22\\text{ km/h}$ và $18\\text{ km/h}$'],
        correctIndex: 0,
        explanation: 'Xuôi dòng: $v = 18 + 4 = 22\\text{ km/h}$; ngược dòng: $v = 18 - 4 = 14\\text{ km/h}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một chiếc thuyền chạy xuôi dòng từ bến A đến bến B mất $2$ giờ và chạy ngược dòng từ B về A mất $3$ giờ. Biết vận tốc dòng nước là $3\\text{ km/h}$. Tính vận tốc thuyền khi nước lặng và khoảng cách AB.',
        hints: ['Gọi $v$ là vận tốc thuyền khi nước lặng; lập $AB = 2(v+3) = 3(v-3)$.'],
        solutionSteps: [
          'Bước 1: Quãng đường không đổi: $2(v + 3) = 3(v - 3) \\iff 2v + 6 = 3v - 9 \\iff v = 15\\text{ km/h}$.',
          'Bước 2: Khoảng cách $AB = 2(15 + 3) = 36\\text{ km}$.'
        ],
        finalAnswer: '$v = 15\\text{ km/h}$; $AB = 36\\text{ km}$.'
      }
    ]
  },

  // ==================== CHƯƠNG II: ĐỘNG LỰC HỌC CHẤT ĐIỂM (Bài 6–11) ====================
  {
    id: 'phys-2006-10-6',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương II: Động lực học chất điểm',
    sourceTag: SRC_10,
    lessonNumber: 6,
    title: 'Bài 6 (2006): Tổng hợp và phân tích lực – Điều kiện cân bằng chất điểm',
    subtitle: 'Quy tắc hình bình hành hợp hai lực đồng quy và điều kiện cân bằng ΣF = 0',
    description:
      'Tính độ lớn hợp lực $F^2 = F_1^2 + F_2^2 + 2F_1 F_2\\cos\\alpha$, phân tích lực theo hai trục vuông góc và thiết lập điều kiện cân bằng chất điểm.',
    theorySections: [
      {
        heading: '1. Tổng hợp lực & Quy tắc hình bình hành',
        content:
          '• **Tổng hợp lực** là thay thế các lực tác dụng đồng thời vào cùng một vật bằng một lực có tác dụng giống hệt như các lực ấy.\n• Với hai lực đồng quy hợp nhau góc $\\alpha$: $F = \\sqrt{F_1^2 + F_2^2 + 2 F_1 F_2 \\cos\\alpha}$. luôn thỏa $|F_1 - F_2| \\le F \\le F_1 + F_2$.'
      },
      {
        heading: '2. Điều kiện cân bằng của chất điểm',
        content:
          '• Muốn một chất điểm đứng cân bằng thì hợp lực của các lực tác dụng lên nó phải bằng không: $\\vec{F} = \\vec{F}_1 + \\vec{F}_2 + \\dots + \\vec{F}_n = \\vec{0}$.'
      }
    ],
    keyFormulas: [
      '\\vec{F} = \\vec{F}_1 + \\vec{F}_2, \\quad F = \\sqrt{F_1^2 + F_2^2 + 2 F_1 F_2\\cos\\alpha}',
      '|F_1 - F_2| \\le F \\le F_1 + F_2'
    ],
    ...SIM_PRESETS.vectors,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Cho hai lực đồng quy có độ lớn $F_1 = 6\\text{ N}$ và $F_2 = 8\\text{ N}$ hợp với nhau góc $\\alpha = 90^\\circ$. Độ lớn của hợp lực bằng:',
        options: ['A. $14\\text{ N}$', 'B. $2\\text{ N}$', 'C. $10\\text{ N}$', 'D. $48\\text{ N}$'],
        correctIndex: 2,
        explanation: 'Vì $\\alpha = 90^\\circ$, $F = \\sqrt{6^2 + 8^2} = 10\\text{ N}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một quả cầu trọng lượng $P = 20\\text{ N}$ được treo cân bằng bằng một sợi dây mảnh tựa vào tường thẳng đứng nhẵn, dây hợp với tường góc $30^\\circ$. Tính lực căng dây $T$ và phản lực $N$ của tường.',
        hints: ['Viết $\\vec{T} + \\vec{N} + \\vec{P} = \\vec{0}$ và chiếu lên hai phương thẳng đứng và nằm ngang.'],
        solutionSteps: [
          'Bước 1: Chiếu theo phương thẳng đứng: $T\\cos 30^\\circ = P \\Rightarrow T = \\frac{20}{\\sqrt{3}/2} = \\frac{40}{\\sqrt{3}} \\approx 23{,}1\\text{ N}$.',
          'Bước 2: Chiếu theo phương ngang: $N = T\\sin 30^\\circ = P\\tan 30^\\circ = \\frac{20}{\\sqrt{3}} \\approx 11{,}55\\text{ N}$.'
        ],
        finalAnswer: '$T \\approx 23{,}1\\text{ N}$; $N \\approx 11{,}55\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-2006-10-7',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương II: Động lực học chất điểm',
    sourceTag: SRC_10,
    lessonNumber: 7,
    title: 'Bài 7 (2006): Ba định luật Niu-tơn',
    subtitle: 'Quán tính (Định luật I), phương trình cơ bản động lực học F = ma (Định luật II) và cặp lực trực đối tương tác F_AB = -F_BA (Định luật III)',
    description:
      'Nắm vững bản chất quán tính, vận dụng phương trình $\\vec{F}_{\\text{hl}} = m\\vec{a}$ cho hệ vật kéo/máy A-tút và phân biệt hai lực trực đối trong Định luật III Niu-tơn (đặt vào hai vật khác nhau).',
    theorySections: [
      {
        heading: '1. Định luật I & II Niu-tơn',
        content:
          '• **Định luật I (Quán tính)**: Nếu không chịu tác dụng của lực nào hoặc chịu các lực có hợp lực bằng $0$, vật đang đứng yên sẽ tiếp tục đứng yên, đang chuyển động sẽ tiếp tục chuyển động thẳng đều.\n• **Định luật II**: Gia tốc của vật cùng hướng với lực tác dụng, tỉ lệ thuận với độ lớn hợp lực và tỉ lệ nghịch với khối lượng: $\\vec{a} = \\frac{\\vec{F}}{m} \\iff \\vec{F} = m\\vec{a}$.'
      },
      {
        heading: '2. Định luật III Niu-tơn',
        content:
          '• Khi vật A tác dụng lên vật B một lực thì vật B cũng tác dụng lại vật A một lực; hai lực này cùng giá, cùng độ lớn nhưng ngược chiều và **đặt vào hai vật khác nhau** (không tự triệt tiêu): $\\vec{F}_{AB} = -\\vec{F}_{BA}$.'
      }
    ],
    keyFormulas: [
      '\\vec{F}_{\\text{hl}} = m\\vec{a}, \\quad \\vec{P} = m\\vec{g}',
      '\\vec{F}_{AB} = -\\vec{F}_{BA}'
    ],
    ...SIM_PRESETS.atwood,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Dưới tác dụng của hợp lực $F = 20\\text{ N}$, một vật thu được gia tốc $a = 2{,}5\\text{ m/s}^2$. Khối lượng của vật bằng:',
        options: ['A. $50\\text{ kg}$', 'B. $8\\text{ kg}$', 'C. $0{,}125\\text{ kg}$', 'D. $17{,}5\\text{ kg}$'],
        correctIndex: 1,
        explanation: '$m = \\frac{F}{a} = \\frac{20}{2{,}5} = 8\\text{ kg}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Hai vật khối lượng $m_1 = 3\\text{ kg}$ và $m_2 = 2\\text{ kg}$ nối với nhau bằng sợi dây không giãn vắt qua ròng rọc cố định nhẹ, bỏ qua ma sát ($g = 10\\text{ m/s}^2$). Tính gia tốc chuyển động của hệ và lực căng dây.',
        hints: ['Áp dụng Định luật II cho từng vật hoặc cho cả hệ $a = \\frac{(m_1 - m_2)g}{m_1 + m_2}$.'],
        solutionSteps: [
          'Bước 1: $P_1 = 30\\text{ N},\\ P_2 = 20\\text{ N}$. Chiếu theo chiều chuyển động: $P_1 - T = m_1 a$ và $T - P_2 = m_2 a$.',
          'Bước 2: Cộng vế: $a = \\frac{P_1 - P_2}{m_1 + m_2} = \\frac{30 - 20}{3 + 2} = 2\\text{ m/s}^2$.',
          'Bước 3: Lực căng dây $T = P_2 + m_2 a = 20 + 2\\cdot 2 = 24\\text{ N}$.'
        ],
        finalAnswer: '$a = 2\\text{ m/s}^2$; $T = 24\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-2006-10-8',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương II: Động lực học chất điểm',
    sourceTag: SRC_10,
    lessonNumber: 8,
    title: 'Bài 8 (2006): Lực hấp dẫn – Định luật Vạn vật hấp dẫn',
    subtitle: 'Công thức F_hd = G m₁m₂/r², trọng lực là trường hợp riêng của lực hấp dẫn và sự biến thiên g theo độ cao h',
    description:
      'Tính lực hấp dẫn giữa hai chất điểm hoặc hai quả cầu đồng chất, biểu diễn gia tốc trọng trường theo độ cao $g = \\frac{GM}{(R+h)^2}$ và giải thích chuyển động hành tinh, vệ tinh.',
    theorySections: [
      {
        heading: '1. Định luật Vạn vật hấp dẫn',
        content:
          '• Mọi vật trong vũ trụ đều hút nhau với một lực gọi là **lực hấp dẫn**: $F_{hd} = G\\frac{m_1 m_2}{r^2}$, với $G = 6{,}67\\cdot 10^{-11}\\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$, $r$ là khoảng cách giữa hai tâm (đối với hai quả cầu đồng chất).'
      },
      {
        heading: '2. Trọng lực & Gia tốc rơi tự do theo độ cao',
        content:
          '• Trọng lực tác dụng lên vật ở độ cao $h$ chính là lực hấp dẫn của Trái Đất lên vật đó: $mg = G\\frac{Mm}{(R+h)^2} \\Rightarrow g = \\frac{GM}{(R+h)^2}$.\n• Ở mặt đất ($h=0$): $g_0 = \\frac{GM}{R^2}$; lên độ cao $h$ thì $g = g_0 \\left(\\frac{R}{R+h}\\right)^2$.'
      }
    ],
    keyFormulas: [
      'F_{hd} = G\\frac{m_1 m_2}{r^2}, \\quad G = 6{,}67\\cdot 10^{-11}\\text{ N}\\cdot\\text{m}^2/\\text{kg}^2',
      'g(h) = \\frac{GM}{(R+h)^2} = g_0\\left(\\frac{R}{R+h}\\right)^2'
    ],
    ...SIM_PRESETS.kepler,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Nếu khoảng cách giữa hai chất điểm tăng lên $3$ lần thì lực hấp dẫn giữa chúng thay đổi như thế nào?',
        options: ['A. tăng $3$ lần', 'B. giảm $3$ lần', 'C. giảm $9$ lần', 'D. tăng $9$ lần'],
        correctIndex: 2,
        explanation: 'Do $F_{hd} \\propto \\frac{1}{r^2}$ nên khi $r$ tăng $3$ lần thì $F_{hd}$ giảm $3^2 = 9$ lần.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Biết bán kính Trái Đất $R = 6400\\text{ km}$ và gia tốc rơi tự do ở mặt đất là $g_0 = 9{,}8\\text{ m/s}^2$. Tính gia tốc rơi tự do ở độ cao $h = 6400\\text{ km}$ so với mặt đất.',
        hints: ['Dùng tỉ số $g = g_0 \\left(\\frac{R}{R+h}\\right)^2$.'],
        solutionSteps: [
          'Bước 1: Với $h = R = 6400\\text{ km} \\Rightarrow R + h = 2R$.',
          'Bước 2: $g = 9{,}8 \\cdot \\left(\\frac{R}{2R}\\right)^2 = \\frac{9{,}8}{4} = 2{,}45\\text{ m/s}^2$.'
        ],
        finalAnswer: '$g = 2{,}45\\text{ m/s}^2$.'
      }
    ]
  },
  {
    id: 'phys-2006-10-9',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương II: Động lực học chất điểm',
    sourceTag: SRC_10,
    lessonNumber: 9,
    title: 'Bài 9 (2006): Lực đàn hồi của lò xo & Định luật Húc',
    subtitle: 'Hướng của lực đàn hồi chống lại biến dạng, độ cứng k và định luật Húc F_đh = k|Δl| trong giới hạn đàn hồi',
    description:
      'Khảo sát sự dãn/nén của lò xo theo phương thẳng đứng và nằm ngang, áp dụng định luật Húc xác định độ cứng $k$ và chiều dài lò xo khi treo vật cân bằng.',
    theorySections: [
      {
        heading: '1. Đặc điểm của lực đàn hồi lò xo',
        content:
          '• **Lực đàn hồi** xuất hiện khi vật bị biến dạng đàn hồi và có xu hướng chống lại nguyên nhân gây biến dạng (luôn hướng về trạng thái tự nhiên).\n• Lực căng dây, phản lực mặt tựa cũng mang bản chất lực đàn hồi.'
      },
      {
        heading: '2. Định luật Húc (Hooke)',
        content:
          '• Trong giới hạn đàn hồi, độ lớn của lực đàn hồi của lò xo tỉ lệ thuận với độ biến dạng của lò xo: $F_{\\text{đh}} = k|\\Delta l| = k|l - l_0|$, với $k$ là độ cứng ($\\text{N/m}$), $\\Delta l$ là độ biến dạng ($\\text{m}$).'
      }
    ],
    keyFormulas: [
      'F_{\\text{đh}} = k|\\Delta l| = k|l - l_0|',
      '\\text{Treo thẳng đứng cân bằng: } k\\Delta l_0 = mg'
    ],
    ...SIM_PRESETS.spring,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một lò xo độ cứng $k = 100\\text{ N/m}$, chiều dài tự nhiên $l_0 = 20\\text{ cm}$. Khi chịu lực kéo $5\\text{ N}$, chiều dài của lò xo là:',
        options: ['A. $25\\text{ cm}$', 'B. $15\\text{ cm}$', 'C. $20{,}5\\text{ cm}$', 'D. $30\\text{ cm}$'],
        correctIndex: 0,
        explanation: '$\\Delta l = \\frac{F}{k} = \\frac{5}{100} = 0{,}05\\text{ m} = 5\\text{ cm} \\Rightarrow l = 20 + 5 = 25\\text{ cm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một lò xo treo thẳng đứng có chiều dài tự nhiên $l_0 = 25\\text{ cm}$. Khi treo vật $m_1 = 200\\text{ g}$ lò xo dài $27\\text{ cm}$ ($g = 10\\text{ m/s}^2$). Tính độ cứng $k$ và chiều dài lò xo nếu treo thêm vật $m_2 = 300\\text{ g}$.',
        hints: ['Tính $k = \\frac{m_1 g}{\\Delta l_1}$, sau đó tính độ dãn mới ứng với $m_1 + m_2$.'],
        solutionSteps: [
          'Bước 1: $\\Delta l_1 = 27 - 25 = 2\\text{ cm} = 0{,}02\\text{ m}$; $P_1 = 0{,}2 \\cdot 10 = 2\\text{ N} \\Rightarrow k = \\frac{2}{0{,}02} = 100\\text{ N/m}$.',
          'Bước 2: Khi treo tổng khối lượng $m = 0{,}5\\text{ kg}$, $P = 5\\text{ N} \\Rightarrow \\Delta l = \\frac{5}{100} = 0{,}05\\text{ m} = 5\\text{ cm}$.',
          'Bước 3: Chiều dài mới $l = 25 + 5 = 30\\text{ cm}$.'
        ],
        finalAnswer: '$k = 100\\text{ N/m}$; chiều dài mới $l = 30\\text{ cm}$.'
      }
    ]
  },
  {
    id: 'phys-2006-10-10',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương II: Động lực học chất điểm',
    sourceTag: SRC_10,
    lessonNumber: 10,
    title: 'Bài 10 (2006): Lực ma sát & Lực hướng tâm',
    subtitle: 'Ma sát trượt F_mst = μN, ma sát nghỉ – lăn và hợp lực đóng vai trò lực hướng tâm trên mặt nghiêng, vòng xiếc, đường vòng',
    description:
      'Phân tích lực trên mặt phẳng nghiêng có ma sát $F_{mst} = \\mu_t N$ và giải thích vai trò của lực hướng tâm $F_{ht} = m\\frac{v^2}{r}$ giữ vật chuyển động tròn.',
    theorySections: [
      {
        heading: '1. Lực ma sát trượt, nghỉ và lăn',
        content:
          '• **Lực ma sát trượt** xuất hiện ở mặt tiếp xúc cản trở chuyển động trượt; độ lớn không phụ thuộc diện tích tiếp xúc hay tốc độ mà tỉ lệ với áp lực: $F_{mst} = \\mu_t N$.\n• **Ma sát nghỉ** giữ vật đứng yên khi có ngoại lực tác dụng ($F_{msn} \\le F_{msn\\max}$). **Ma sát lăn** nhỏ hơn rất nhiều so với ma sát trượt.'
      },
      {
        heading: '2. Lực hướng tâm',
        content:
          '• Lực (hay hợp lực) tác dụng vào vật chuyển động tròn đều và gây ra cho vật gia tốc hướng tâm gọi là **lực hướng tâm**: $F_{ht} = m a_{ht} = \\frac{m v^2}{r} = m \\omega^2 r$.'
      }
    ],
    keyFormulas: [
      'F_{mst} = \\mu_t N \\quad (\\text{mặt nghiêng góc } \\alpha: N = mg\\cos\\alpha)',
      'F_{ht} = m\\frac{v^2}{r} = m\\omega^2 r'
    ],
    ...SIM_PRESETS.inclined,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một vật khối lượng $m = 2\\text{ kg}$ trượt trên mặt sàn nằm ngang dưới tác dụng lực kéo ngang $F = 8\\text{ N}$. Biết hệ số ma sát trượt $\\mu = 0{,}2$ ($g = 10\\text{ m/s}^2$). Gia tốc của vật là:',
        options: ['A. $4\\text{ m/s}^2$', 'B. $2\\text{ m/s}^2$', 'C. $6\\text{ m/s}^2$', 'D. $1\\text{ m/s}^2$'],
        correctIndex: 1,
        explanation: '$N = mg = 20\\text{ N} \\Rightarrow F_{ms} = 0{,}2 \\cdot 20 = 4\\text{ N} \\Rightarrow a = \\frac{8 - 4}{2} = 2\\text{ m/s}^2$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một vật trượt không vận tốc đầu từ đỉnh mặt phẳng nghiêng dài $5\\text{ m}$, góc nghiêng $\\alpha = 30^\\circ$ so với phương ngang. Hệ số ma sát trượt $\\mu = 0{,}1\\sqrt{3}$, lấy $g = 10\\text{ m/s}^2$. Tính gia tốc và vận tốc vật ở chân dốc.',
        hints: ['Chiếu $\\vec{P} + \\vec{N} + \\vec{F}_{ms} = m\\vec{a}$ xuống dọc dốc: $a = g(\\sin\\alpha - \\mu\\cos\\alpha)$.'],
        solutionSteps: [
          'Bước 1: $a = g(\\sin 30^\\circ - \\mu\\cos 30^\\circ) = 10\\left(0{,}5 - 0{,}1\\sqrt{3}\\cdot\\frac{\\sqrt{3}}{2}\\right) = 10(0{,}5 - 0{,}15) = 3{,}5\\text{ m/s}^2$.',
          'Bước 2: Vận tốc ở chân dốc: $v = \\sqrt{2as} = \\sqrt{2 \\cdot 3{,}5 \\cdot 5} = \\sqrt{35} \\approx 5{,}92\\text{ m/s}$.'
        ],
        finalAnswer: '$a = 3{,}5\\text{ m/s}^2$; $v \\approx 5{,}92\\text{ m/s}$.'
      }
    ]
  },
  {
    id: 'phys-2006-10-11',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương II: Động lực học chất điểm',
    sourceTag: SRC_10,
    lessonNumber: 11,
    title: 'Bài 11 (2006): Chuyển động của vật bị ném (Ném ngang & Ném xiên)',
    subtitle: 'Phân tích chuyển động ném ngang thành hai thành phần thẳng đều Ox và rơi tự do Oy; quỹ đạo parabol và tầm ném xa',
    description:
      'Giải phương trình quỹ đạo $y = \\frac{g}{2v_0^2}x^2$, thời gian bay $t = \\sqrt{\\frac{2h}{g}}$, tầm ném xa $L = v_0\\sqrt{\\frac{2h}{g}}$ và mở rộng cho ném xiên góc $\\alpha$.',
    theorySections: [
      {
        heading: '1. Chuyển động ném ngang',
        content:
          '• Vật được ném theo phương ngang với vận tốc $v_0$ từ độ cao $h$ (bỏ qua sức cản không khí) có chuyển động tổng hợp từ hai chuyển động thành phần độc lập:\n  - Theo phương ngang $Ox$: thẳng đều $x = v_0 t$, $v_x = v_0$.\n  - Theo phương thẳng đứng $Oy$: rơi tự do $y = \\frac{1}{2}gt^2$, $v_y = gt$.'
      },
      {
        heading: '2. Quỹ đạo, thời gian rơi & Tầm ném xa',
        content:
          '• Phương trình quỹ đạo parabol: $y = \\frac{g}{2v_0^2}x^2$.\n• Thời gian rơi chạm đất chỉ phụ thuộc độ cao $h$: $t = \\sqrt{\\frac{2h}{g}}$.\n• Tầm ném xa: $L = v_0 \\sqrt{\\frac{2h}{g}}$. Vận tốc chạm đất: $v = \\sqrt{v_0^2 + 2gh}$.'
      }
    ],
    keyFormulas: [
      'y = \\frac{g}{2v_0^2}x^2, \\quad t = \\sqrt{\\frac{2h}{g}}, \\quad L = v_0\\sqrt{\\frac{2h}{g}}',
      '\\text{Ném xiên: } L = \\frac{v_0^2 \\sin(2\\alpha)}{g}, \\quad H_{\\max} = \\frac{v_0^2\\sin^2\\alpha}{2g}'
    ],
    ...SIM_PRESETS.projectile,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Ném ngang một hòn bi từ độ cao $h = 20\\text{ m}$ với vận tốc ban đầu $v_0 = 15\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). Tầm ném xa của hòn bi là:',
        options: ['A. $15\\text{ m}$', 'B. $30\\text{ m}$', 'C. $45\\text{ m}$', 'D. $60\\text{ m}$'],
        correctIndex: 1,
        explanation: 'Thời gian rơi $t = \\sqrt{\\frac{2\\cdot 20}{10}} = 2\\text{ s} \\Rightarrow L = v_0 t = 15 \\cdot 2 = 30\\text{ m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Từ một vách đá cao $h = 45\\text{ m}$ so với mặt biển, người ta bắn ngang một quả pháo với vận tốc $v_0 = 40\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). Tính tầm xa quả pháo đạt được và độ lớn vận tốc ngay trước khi chạm mặt biển.',
        hints: ['Tính $t = \\sqrt{2h/g}$, $L = v_0 t$ và $v = \\sqrt{v_0^2 + (gt)^2}$.'],
        solutionSteps: [
          'Bước 1: Thời gian bay $t = \\sqrt{\\frac{2 \\cdot 45}{10}} = 3\\text{ s}$.',
          'Bước 2: Tầm xa $L = 40 \\cdot 3 = 120\\text{ m}$.',
          'Bước 3: $v_y = gt = 30\\text{ m/s} \\Rightarrow v = \\sqrt{40^2 + 30^2} = 50\\text{ m/s}$.'
        ],
        finalAnswer: '$L = 120\\text{ m}$; $v = 50\\text{ m/s}$.'
      }
    ]
  },

  // ==================== CHƯƠNG III: CÂN BẰNG VÀ CHUYỂN ĐỘNG CỦA VẬT RẮN (Bài 12–13) ====================
  {
    id: 'phys-2006-10-12',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương III: Cân bằng và Chuyển động của Vật rắn',
    sourceTag: SRC_10,
    lessonNumber: 12,
    title: 'Bài 12 (2006): Cân bằng vật rắn có trục quay cố định – Quy tắc Mômen lực',
    subtitle: 'Cánh tay đòn d, mômen lực M = F·d và quy tắc cân bằng ΣM_thuận = ΣM_ngược; các dạng cân bằng bền, không bền, phiếm định',
    description:
      'Xác định cánh tay đòn của lực, phát biểu quy tắc mômen lực và phân biệt cân bằng bền, không bền, phiếm định cùng điều kiện chân đế vững vàng.',
    theorySections: [
      {
        heading: '1. Mômen lực & Quy tắc mômen lực',
        content:
          '• **Mômen lực** đối với trục quay đo tác dụng làm quay của lực: $M = F\\cdot d$ ($\\text{N}\\cdot\\text{m}$), trong đó $d$ là **cánh tay đòn** (khoảng cách từ trục quay đến giá của lực).\n• **Quy tắc mômen**: Muốn một vật có trục quay cố định ở trạng thái cân bằng thì tổng các mômen lực có xu hướng làm vật quay theo chiều kim đồng hồ phải bằng tổng các mômen lực có xu hướng làm vật quay ngược chiều kim đồng hồ.'
      },
      {
        heading: '2. Các dạng cân bằng & Mặt chân đế',
        content:
          '• Vật có **cân bằng bền** khi trọng tâm ở vị trí thấp nhất (như quả cầu ở đáy chảo lõm); **không bền** khi trọng tâm cao nhất; **phiếm định** khi trọng tâm không đổi độ cao.\n• Vật có mặt chân đế đứng vững khi đường thẳng đứng qua trọng tâm rơi vào trong **mặt chân đế**.'
      }
    ],
    keyFormulas: [
      'M = F \\cdot d \\quad (\\text{N}\\cdot\\text{m})',
      '\\sum M_{\\text{quay thuận}} = \\sum M_{\\text{quay ngược}}'
    ],
    ...SIM_PRESETS.torque,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một lực độ lớn $F = 20\\text{ N}$ tác dụng vào cánh cửa tại điểm cách bản lề $0{,}8\\text{ m}$ theo phương vuông góc với mặt cửa. Mômen lực đối với trục bản lề bằng:',
        options: ['A. $16\\text{ N}\\cdot\\text{m}$', 'B. $25\\text{ N}\\cdot\\text{m}$', 'C. $1{,}6\\text{ N}\\cdot\\text{m}$', 'D. $20\\text{ N}\\cdot\\text{m}$'],
        correctIndex: 0,
        explanation: 'Vì lực vuông góc cánh cửa nên $d = 0{,}8\\text{ m} \\Rightarrow M = 20 \\cdot 0{,}8 = 16\\text{ N}\\cdot\\text{m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một thanh nhẹ AB dài $1{,}2\\text{ m}$ có thể quay quanh khớp O cách A $0{,}4\\text{ m}$. Tại đầu A treo vật $m_1 = 6\\text{ kg}$ ($g = 10\\text{ m/s}^2$). Phải treo ở đầu B vật có khối lượng $m_2$ bằng bao nhiêu để thanh cân bằng nằm ngang?',
        hints: ['Áp dụng quy tắc mômen quanh O: $P_1 \\cdot OA = P_2 \\cdot OB$.'],
        solutionSteps: [
          'Bước 1: $OA = 0{,}4\\text{ m}$, $OB = 1{,}2 - 0{,}4 = 0{,}8\\text{ m}$.',
          'Bước 2: $m_1 g \\cdot OA = m_2 g \\cdot OB \\Rightarrow 6 \\cdot 0{,}4 = m_2 \\cdot 0{,}8 \\Rightarrow m_2 = 3\\text{ kg}$.'
        ],
        finalAnswer: '$m_2 = 3\\text{ kg}$.'
      }
    ]
  },
  {
    id: 'phys-2006-10-13',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương III: Cân bằng và Chuyển động của Vật rắn',
    sourceTag: SRC_10,
    lessonNumber: 13,
    title: 'Bài 13 (2006): Hợp lực song song cùng chiều & Ngẫu lực – Mức quán tính quay',
    subtitle: 'Quy tắc chia trong hợp hai lực song song, ngẫu lực M = F·d và chuyển động tịnh tiến – quay của vật rắn',
    description:
      'Xác định điểm đặt và độ lớn hợp của hai lực song song cùng chiều, tính mômen ngẫu lực $M = F d$ và hiểu vai trò mức quán tính quay (mômen quán tính).',
    theorySections: [
      {
        heading: '1. Quy tắc hợp hai lực song song cùng chiều',
        content:
          '• Hợp lực của hai lực song song cùng chiều là một lực song song, cùng chiều, có độ lớn bằng tổng $F = F_1 + F_2$ và có giá nằm trong khoảng giữa hai giá thành phần, chia trong theo tỉ lệ nghịch với độ lớn hai lực: $\\frac{F_1}{F_2} = \\frac{d_2}{d_1}$.'
      },
      {
        heading: '2. Ngẫu lực & Chuyển động của vật rắn',
        content:
          '• **Ngẫu lực** là hệ hai lực song song, ngược chiều, có độ lớn bằng nhau và cùng tác dụng vào một vật. Mômen ngẫu lực đối với mọi trục vuông góc mặt phẳng ngẫu lực đều bằng $M = F\\cdot d$ (chỉ gây tác dụng quay).\n• Trong chuyển động quay quanh một trục, đại lượng đặc trưng cho mức quán tính quay phụ thuộc khối lượng và sự phân bố khối lượng quanh trục.'
      }
    ],
    keyFormulas: [
      'F = F_1 + F_2, \\quad \\frac{F_1}{F_2} = \\frac{d_2}{d_1}',
      'M_{\\text{ngẫu lực}} = F \\cdot d'
    ],
    ...SIM_PRESETS.torque,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một thanh nhẹ dài $1\\text{ m}$ gánh hai thúng gạo ở hai đầu có trọng lượng lần lượt $P_1 = 300\\text{ N}$ và $P_2 = 200\\text{ N}$. Vai người gánh phải đặt cách đầu treo thúng $P_1$ một đoạn bao nhiêu để thanh nằm ngang?',
        options: ['A. $0{,}4\\text{ m}$', 'B. $0{,}6\\text{ m}$', 'C. $0{,}5\\text{ m}$', 'D. $0{,}3\\text{ m}$'],
        correctIndex: 0,
        explanation: '$\\frac{d_1}{d_2} = \\frac{P_2}{P_1} = \\frac{200}{300} = \\frac{2}{3}$ và $d_1 + d_2 = 1\\text{ m} \\Rightarrow d_1 = 0{,}4\\text{ m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một vô lăng ô tô đường kính $40\\text{ cm}$ chịu tác dụng của một ngẫu lực gồm hai lực tiếp tuyến ở hai đầu đường kính, mỗi lực có độ lớn $25\\text{ N}$. Tính mômen của ngẫu lực đó.',
        hints: ['Cánh tay đòn $d$ của ngẫu lực chính là đường kính vô lăng $0{,}4\\text{ m}$.'],
        solutionSteps: [
          'Bước 1: Đổi đường kính $d = 40\\text{ cm} = 0{,}4\\text{ m}$.',
          'Bước 2: Mômen ngẫu lực $M = F \\cdot d = 25 \\cdot 0{,}4 = 10\\text{ N}\\cdot\\text{m}$.'
        ],
        finalAnswer: '$M = 10\\text{ N}\\cdot\\text{m}$.'
      }
    ]
  },

  // ==================== CHƯƠNG IV: CÁC ĐỊNH LUẬT BẢO TOÀN (Bài 14–16) ====================
  {
    id: 'phys-2006-10-14',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương IV: Các định luật bảo toàn',
    sourceTag: SRC_10,
    lessonNumber: 14,
    title: 'Bài 14 (2006): Động lượng & Định luật Bảo toàn Động lượng',
    subtitle: 'Xung lượng lực FΔt = Δp, hệ cô lập và áp dụng bảo toàn động lượng cho va chạm mềm, va chạm đàn hồi và chuyển động bằng phản lực',
    description:
      'Vận dụng mối liên hệ $\\vec{F}\\Delta t = \\Delta\\vec{p}$ và định luật bảo toàn động lượng $\\vec{p}_1 + \\vec{p}_2 = \\vec{p}_1\' + \\vec{p}_2\'$ cho hệ cô lập trong va chạm và bắn đạn/tên lửa.',
    theorySections: [
      {
        heading: '1. Động lượng & Xung lượng của lực',
        content:
          '• **Động lượng** của vật khối lượng $m$ chuyển động với vận tốc $\\vec{v}$ là đại lượng vectơ: $\\vec{p} = m\\vec{v}$ ($\\text{kg}\\cdot\\text{m/s}$).\n• **Độ biến thiên động lượng**: $\\Delta\\vec{p} = \\vec{p}_2 - \\vec{p}_1 = \\vec{F}\\Delta t$ (xung lượng của lực).'
      },
      {
        heading: '2. Định luật bảo toàn động lượng',
        content:
          '• Trong một **hệ cô lập** (không có ngoại lực hoặc các ngoại lực cân bằng nhau), tổng động lượng của hệ được bảo toàn: $\\vec{p}_1 + \\vec{p}_2 = \\vec{p}_1\' + \\vec{p}_2\'$.\n• Ứng dụng giải thích sự giật lùi của súng khi bắn, chuyển động tên lửa phản lực và bài toán va chạm.'
      }
    ],
    keyFormulas: [
      '\\vec{p} = m\\vec{v}, \\quad \\vec{F}\\Delta t = \\Delta\\vec{p}',
      '\\text{Va chạm mềm: } m_1\\vec{v}_1 + m_2\\vec{v}_2 = (m_1 + m_2)\\vec{v}'
    ],
    ...SIM_PRESETS.momentum,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một vật khối lượng $2\\text{ kg}$ chuyển động thẳng với vận tốc $3\\text{ m/s}$ đến va chạm mềm (dính vào nhau) với vật thứ hai khối lượng $4\\text{ kg}$ đang đứng yên. Vận tốc của hai vật ngay sau va chạm là:',
        options: ['A. $1\\text{ m/s}$', 'B. $1{,}5\\text{ m/s}$', 'C. $2\\text{ m/s}$', 'D. $3\\text{ m/s}$'],
        correctIndex: 0,
        explanation: 'Bảo toàn động lượng: $m_1 v_1 = (m_1 + m_2) v \\Rightarrow v = \\frac{2\\cdot 3}{2 + 4} = 1\\text{ m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một khẩu pháo khối lượng $M = 1{,}5\\text{ tấn}$ bắn đi một viên đạn khối lượng $m = 10\\text{ kg}$ theo phương ngang với vận tốc $v = 600\\text{ m/s}$. Tính vận tốc giật lùi của khẩu pháo ngay sau khi bắn.',
        hints: ['Tổng động lượng trước khi bắn bằng $0$, suy ra $MV + mv = 0$.'],
        solutionSteps: [
          'Bước 1: Đổi $M = 1500\\text{ kg}$. Trước khi bắn hệ đứng yên nên $\\vec{p}_{\\text{trước}} = \\vec{0}$.',
          'Bước 2: Theo phương ngang: $M V + m v = 0 \\Rightarrow V = -\\frac{m v}{M} = -\\frac{10 \\cdot 600}{1500} = -4\\text{ m/s}$.'
        ],
        finalAnswer: 'Khẩu pháo giật lùi với tốc độ $4\\text{ m/s}$.'
      }
    ]
  },
  {
    id: 'phys-2006-10-15',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương IV: Các định luật bảo toàn',
    sourceTag: SRC_10,
    lessonNumber: 15,
    title: 'Bài 15 (2006): Công và Công suất',
    subtitle: 'Công cơ học A = F·s·cosα (công phát động, công cản, công bằng 0) và công suất P = A/t = F·v',
    description:
      'Tính công của một lực không đổi khi góc hợp với hướng dịch chuyển thay đổi, phân biệt công phát động ($A>0$) với công cản ($A<0$) và tính công suất tức thời.',
    theorySections: [
      {
        heading: '1. Công của một lực không đổi',
        content:
          '• Khi lực không đổi $\\vec{F}$ tác dụng lên vật làm điểm đặt dời đi đoạn $s$ theo hướng hợp với $\\vec{F}$ góc $\\alpha$, công thực hiện là: $A = F\\cdot s\\cdot\\cos\\alpha$ ($\\text{J}$).\n• $\\alpha < 90^\\circ$: **công phát động** ($A > 0$); $\\alpha = 90^\\circ$: lực không sinh công ($A = 0$); $90^\\circ < \\alpha \\le 180^\\circ$: **công cản** ($A < 0$).'
      },
      {
        heading: '2. Công suất',
        content:
          '• **Công suất** đo tốc độ sinh công (công thực hiện trong một đơn vị thời gian): $\\mathcal{P} = \\frac{A}{t}$ (đơn vị: Oát, $1\\text{ W} = 1\\text{ J/s}$).\n• Khi lực $\\vec{F}$ cùng hướng vận tốc $\\vec{v}$: $\\mathcal{P} = F \\cdot v$.'
      }
    ],
    keyFormulas: [
      'A = F \\cdot s \\cdot \\cos\\alpha',
      '\\mathcal{P} = \\frac{A}{t} = F \\cdot v \\cdot \\cos\\alpha'
    ],
    ...SIM_PRESETS.work_power,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Kéo một hòm gỗ trượt đều $10\\text{ m}$ trên sàn ngang bằng lực $F = 40\\text{ N}$ hợp với phương ngang góc $60^\\circ$. Công của lực kéo thực hiện là:',
        options: ['A. $400\\text{ J}$', 'B. $200\\text{ J}$', 'C. $200\\sqrt{3}\\text{ J}$', 'D. $0\\text{ J}$'],
        correctIndex: 1,
        explanation: '$A = F s \\cos 60^\\circ = 40 \\cdot 10 \\cdot 0{,}5 = 200\\text{ J}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một ô tô khối lượng $1{,}2\\text{ tấn}$ chuyển động thẳng đều lên dốc nghiêng góc $\\alpha$ với $\\sin\\alpha = 0{,}05$ ở tốc độ $36\\text{ km/h}$. Lực cản chuyển động bằng $500\\text{ N}$ ($g = 10\\text{ m/s}^2$). Tính công suất của động cơ ô tô.',
        hints: ['Vì chạy đều, lực kéo động cơ cân bằng với $P\\sin\\alpha + F_c$.'],
        solutionSteps: [
          'Bước 1: Đổi $m = 1200\\text{ kg}$, $v = 10\\text{ m/s}$. Thành phần trọng lực dọc dốc: $P\\sin\\alpha = 1200\\cdot 10\\cdot 0{,}05 = 600\\text{ N}$.',
          'Bước 2: Lực kéo động cơ: $F_k = 600 + 500 = 1100\\text{ N}$.',
          'Bước 3: Công suất $\\mathcal{P} = F_k \\cdot v = 1100 \\cdot 10 = 11\\,000\\text{ W} = 11\\text{ kW}$.'
        ],
        finalAnswer: '$\\mathcal{P} = 11\\text{ kW}$.'
      }
    ]
  },
  {
    id: 'phys-2006-10-16',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương IV: Các định luật bảo toàn',
    sourceTag: SRC_10,
    lessonNumber: 16,
    title: 'Bài 16 (2006): Động năng, Thế năng & Cơ năng – Định luật Bảo toàn Cơ năng',
    subtitle: 'Định lí động năng A = ΔW_đ, thế năng trọng trường/đàn hồi và bảo toàn cơ năng W = W_đ + W_t trong trường lực thế',
    description:
      'Vận dụng định lí động năng cho bài toán có ma sát và định luật bảo toàn cơ năng khi vật chỉ chịu tác dụng của trọng lực hoặc lực đàn hồi.',
    theorySections: [
      {
        heading: '1. Động năng & Định lí động năng',
        content:
          '• **Động năng**: $W_{\\text{đ}} = \\frac{1}{2} m v^2$ ($\\text{J}$).\n• **Định lí động năng**: Độ biến thiên động năng bằng công của các ngoại lực tác dụng lên vật: $W_{\\text{đ}2} - W_{\\text{đ}1} = \\frac{1}{2}mv_2^2 - \\frac{1}{2}mv_1^2 = A_{\\text{ngoại lực}}$.'
      },
      {
        heading: '2. Thế năng & Định luật bảo toàn cơ năng',
        content:
          '• **Thế năng trọng trường**: $W_t = mgz$; **thế năng đàn hồi**: $W_t = \\frac{1}{2}k(\\Delta l)^2$.\n• Khi vật chỉ chịu tác dụng của trọng lực hoặc lực đàn hồi (các lực thế), **cơ năng** $W = W_{\\text{đ}} + W_t$ được bảo toàn. Nếu có lực ma sát sinh công cản $A_{ms}$: $W_2 - W_1 = A_{ms}$.'
      }
    ],
    keyFormulas: [
      'W_{\\text{đ}} = \\frac{1}{2}mv^2, \\quad W_t = mgz \\text{ hoặc } \\frac{1}{2}k(\\Delta l)^2',
      'W = \\frac{1}{2}mv^2 + mgz = \\text{const} \\quad (\\text{khi chỉ có lực thế})'
    ],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Ném thẳng đứng một vật từ mặt đất lên trên với vận tốc ban đầu $v_0 = 20\\text{ m/s}$ ($g = 10\\text{ m/s}^2$, bỏ qua sức cản). Độ cao nơi động năng bằng thế năng là:',
        options: ['A. $20\\text{ m}$', 'B. $10\\text{ m}$', 'C. $5\\text{ m}$', 'D. $15\\text{ m}$'],
        correctIndex: 1,
        explanation: 'Cơ năng tại mặt đất $W = \\frac{1}{2}mv_0^2 = 200m$. Tại nơi $W_{\\text{đ}} = W_t$ thì $W = 2W_t = 2mgz \\Rightarrow 200 = 2\\cdot 10 z \\Rightarrow z = 10\\text{ m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Từ độ cao $h = 20\\text{ m}$, một vật khối lượng $m = 0{,}5\\text{ kg}$ được ném thẳng đứng xuống dưới với vận tốc $v_0 = 10\\text{ m/s}$ ($g = 10\\text{ m/s}^2$, chọn mốc thế năng tại mặt đất). Tính cơ năng ban đầu và vận tốc vật ngay khi chạm đất.',
        hints: ['Áp dụng bảo toàn cơ năng $W_1 = W_2$.'],
        solutionSteps: [
          'Bước 1: Cơ năng ban đầu $W = \\frac{1}{2}mv_0^2 + mgh = \\frac{1}{2}(0{,}5)(10^2) + 0{,}5\\cdot 10\\cdot 20 = 25 + 100 = 125\\text{ J}$.',
          'Bước 2: Khi chạm đất ($z=0$): $\\frac{1}{2}mv^2 = 125 \\Rightarrow v^2 = \\frac{250}{0{,}5} = 500 \\Rightarrow v = 10\\sqrt{5} \\approx 22{,}36\\text{ m/s}$.'
        ],
        finalAnswer: '$W = 125\\text{ J}$; $v = 10\\sqrt{5} \\approx 22{,}36\\text{ m/s}$.'
      }
    ]
  },

  // ==================== CHƯƠNG V: CHẤT KHÍ (Bài 17–18) ====================
  {
    id: 'phys-2006-10-17',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương V: Chất khí',
    sourceTag: SRC_10,
    lessonNumber: 17,
    title: 'Bài 17 (2006): Thuyết động học phân tử chất khí & Quá trình đẳng nhiệt (Bôi-lơ – Ma-ri-ốt)',
    subtitle: 'Cấu tạo chất khí lí tưởng, áp suất do va chạm phân tử và định luật Bôi-lơ – Ma-ri-ốt p₁V₁ = p₂V₂ cùng đường đẳng nhiệt hypebol',
    description:
      'Hiểu giả thuyết khí lí tưởng từ thuyết động học phân tử và vận dụng định luật Bôi-lơ – Ma-ri-ốt cho quá trình đẳng nhiệt cùng đồ thị $(p - V)$.',
    theorySections: [
      {
        heading: '1. Thuyết động học phân tử chất khí',
        content:
          '• Chất khí được cấu tạo từ các phân tử có kích thước rất nhỏ so với khoảng cách giữa chúng.\n• Các phân tử khí chuyển động hỗn loạn không ngừng; nhiệt độ càng cao chuyển động nhiệt càng nhanh.\n• Khi chuyển động hỗn loạn, các phân tử khí va chạm vào thành bình tạo nên **áp suất chất khí**.'
      },
      {
        heading: '2. Quá trình đẳng nhiệt & Định luật Bôi-lơ – Ma-ri-ốt',
        content:
          '• **Định luật Bôi-lơ – Ma-ri-ốt**: Trong quá trình đẳng nhiệt của một lượng khí nhất định, áp suất tỉ lệ nghịch với thể tích: $p V = \\text{const} \\iff p_1 V_1 = p_2 V_2$.\n• Trong hệ tọa độ $(p, V)$, đường đẳng nhiệt là một đường **hypebol**.'
      }
    ],
    keyFormulas: [
      'p_1 V_1 = p_2 V_2 \\quad (T = \\text{const})'
    ],
    ...SIM_PRESETS.thermal_gas,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Nén đẳng nhiệt một khối khí từ thể tích $12\\text{ lít}$ xuống còn $3\\text{ lít}$. Nếu áp suất ban đầu là $1\\text{ atm}$ thì áp suất lúc sau là:',
        options: ['A. $0{,}25\\text{ atm}$', 'B. $4\\text{ atm}$', 'C. $3\\text{ atm}$', 'D. $9\\text{ atm}$'],
        correctIndex: 1,
        explanation: '$p_2 = \\frac{p_1 V_1}{V_2} = \\frac{1 \\cdot 12}{3} = 4\\text{ atm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một xi-lanh chứa $150\\text{ cm}^3$ khí ở áp suất $2\\cdot 10^5\\text{ Pa}$. Pít-tông nén khí từ từ để nhiệt độ không đổi đến khi thể tích còn $100\\text{ cm}^3$. Tính áp suất khí trong xi-lanh lúc này.',
        hints: ['Áp dụng $p_1 V_1 = p_2 V_2$.'],
        solutionSteps: [
          'Bước 1: Vì nén từ từ nên quá trình là đẳng nhiệt.',
          'Bước 2: $p_2 = \\frac{p_1 V_1}{V_2} = \\frac{2\\cdot 10^5 \\cdot 150}{100} = 3\\cdot 10^5\\text{ Pa}$.'
        ],
        finalAnswer: '$p_2 = 3\\cdot 10^5\\text{ Pa}$.'
      }
    ]
  },
  {
    id: 'phys-2006-10-18',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương V: Chất khí',
    sourceTag: SRC_10,
    lessonNumber: 18,
    title: 'Bài 18 (2006): Quá trình đẳng tích (Sác-lơ) & Phương trình trạng thái Khí lí tưởng',
    subtitle: 'Nhiệt độ tuyệt đối T(K) = t(°C) + 273, định luật Sác-lơ p/T = const và phương trình trạng thái p₁V₁/T₁ = p₂V₂/T₂',
    description:
      'Thiết lập các định luật đẳng tích, đẳng áp (Gay-Luýt-xác) và phương trình trạng thái khí lí tưởng $pV/T = \\text{const}$ giải các bài toán biến đổi hai hoặc ba thông số trạng thái.',
    theorySections: [
      {
        heading: '1. Định luật Sác-lơ & Nhiệt độ tuyệt đối',
        content:
          '• Thang nhiệt độ Kenvin: $T(\\text{K}) = t(^\\circ\\text{C}) + 273$.\n• **Định luật Sác-lơ** (quá trình đẳng tích $V = \\text{const}$): Áp suất tỉ lệ thuận với nhiệt độ tuyệt đối: $\\frac{p_1}{T_1} = \\frac{p_2}{T_2}$. Đường đẳng tích trong hệ $(p, T)$ là đường thẳng kéo dài đi qua gốc tọa độ.'
      },
      {
        heading: '2. Phương trình trạng thái khí lí tưởng',
        content:
          '• Cho một lượng khí xác định chuyển từ trạng thái $(p_1, V_1, T_1)$ sang $(p_2, V_2, T_2)$: $\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}$.\n• Trường hợp đẳng áp ($p = \\text{const}$): $\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$ (Định luật Gay-Luýt-xác).'
      }
    ],
    keyFormulas: [
      'T(\\text{K}) = t(^\\circ\\text{C}) + 273',
      '\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}; \\quad \\text{Đẳng tích: } \\frac{p_1}{T_1} = \\frac{p_2}{T_2}'
    ],
    ...SIM_PRESETS.pv_thermo,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một bình kín thể tích không đổi chứa khí ở $27^\\circ\\text{C}$ và áp suất $2\\text{ atm}$. Đun nóng khí lên đến $177^\\circ\\text{C}$ thì áp suất khí trong bình bằng:',
        options: ['A. $3\\text{ atm}$', 'B. $13{,}1\\text{ atm}$', 'C. $1{,}33\\text{ atm}$', 'D. $4\\text{ atm}$'],
        correctIndex: 0,
        explanation: 'Đổi $T_1 = 27 + 273 = 300\\text{ K}$, $T_2 = 177 + 273 = 450\\text{ K}$. Đẳng tích: $p_2 = 2\\cdot\\frac{450}{300} = 3\\text{ atm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một lượng khí có thể tích $4\\text{ lít}$ ở nhiệt độ $27^\\circ\\text{C}$ và áp suất $1\\text{ atm}$. Nén khí đến thể tích $2\\text{ lít}$ và tăng nhiệt độ lên $127^\\circ\\text{C}$. Tính áp suất của khối khí ở trạng thái cuối.',
        hints: ['Đổi nhiệt độ ra Kelvin rồi thay vào $\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}$.'],
        solutionSteps: [
          'Bước 1: $T_1 = 300\\text{ K}$; $T_2 = 127 + 273 = 400\\text{ K}$.',
          'Bước 2: $p_2 = p_1 \\cdot \\frac{V_1}{V_2} \\cdot \\frac{T_2}{T_1} = 1 \\cdot \\frac{4}{2} \\cdot \\frac{400}{300} = \\frac{8}{3} \\approx 2{,}67\\text{ atm}$.'
        ],
        finalAnswer: '$p_2 = \\frac{8}{3} \\approx 2{,}67\\text{ atm}$.'
      }
    ]
  },

  // ==================== CHƯƠNG VI: CƠ SỞ CỦA NHIỆT ĐỘNG LỰC HỌC (Bài 19) ====================
  {
    id: 'phys-2006-10-19',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương VI: Cơ sở của Nhiệt động lực học',
    sourceTag: SRC_10,
    lessonNumber: 19,
    title: 'Bài 19 (2006): Nội năng & Các nguyên lí của Nhiệt động lực học',
    subtitle: 'Thay đổi nội năng bằng thực hiện công hoặc truyền nhiệt; Nguyên lí I ΔU = A + Q (quy ước dấu 2006) và Nguyên lí II',
    description:
      'Áp dụng đúng quy ước dấu Nguyên lí I nhiệt động lực học của SGK GDPT 2006 ($\\Delta U = A + Q$ với $Q > 0$ nhận nhiệt, $A > 0$ nhận công) và hiểu giới hạn hiệu suất động cơ nhiệt theo Nguyên lí II.',
    theorySections: [
      {
        heading: '1. Nội năng & Nguyên lí I Nhiệt động lực học',
        content:
          '• **Nội năng ($U$)** là tổng động năng và thế năng của các phân tử cấu tạo nên vật ($U = f(T, V)$). Có hai cách làm biến đổi nội năng: **thực hiện công** và **truyền nhiệt**.\n• **Nguyên lí I NĐLH**: $\\Delta U = A + Q$. Quy ước dấu (SGK 2006): $Q > 0$ vật nhận nhiệt lượng, $Q < 0$ vật truyền nhiệt; $A > 0$ vật nhận công (bị nén), $A < 0$ vật thực hiện công (giãn nở).'
      },
      {
        heading: '2. Nguyên lí II NĐLH & Động cơ nhiệt',
        content:
          '• Nhiệt không thể tự truyền từ một vật sang vật nóng hơn; không thể chế tạo động cơ vĩnh cửu loại hai.\n• Hiệu suất động cơ nhiệt nhận nhiệt lượng $Q_1$ từ nguồn nóng, nhả $Q_2$ cho nguồn lạnh và sinh công $|A| = Q_1 - |Q_2|$ là: $H = \\frac{|A|}{Q_1} = \\frac{Q_1 - |Q_2|}{Q_1} < 1$.'
      }
    ],
    keyFormulas: [
      '\\Delta U = A + Q \\quad (Q>0:\\text{ nhận nhiệt};\\ A>0:\\text{ nhận công})',
      'H = \\frac{|A|}{Q_1} = \\frac{Q_1 - |Q_2|}{Q_1}'
    ],
    ...SIM_PRESETS.calorimetry,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Người ta truyền cho khí trong xi-lanh một nhiệt lượng $100\\text{ J}$. Khí nở ra thực hiện công $70\\text{ J}$ đẩy pít-tông lên. Độ biến thiên nội năng của khí là:',
        options: ['A. $+170\\text{ J}$', 'B. $+30\\text{ J}$', 'C. $-30\\text{ J}$', 'D. $-170\\text{ J}$'],
        correctIndex: 1,
        explanation: 'Khí nhận nhiệt $\\Rightarrow Q = +100\\text{ J}$; khí thực hiện công $\\Rightarrow A = -70\\text{ J}$. Do đó $\\Delta U = A + Q = -70 + 100 = +30\\text{ J}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Người ta thực hiện công $120\\text{ J}$ để nén khí trong một xi-lanh, đồng thời khí truyền ra môi trường xung quanh nhiệt lượng $40\\text{ J}$. Tính độ biến thiên nội năng của khí và cho biết nội năng tăng hay giảm.',
        hints: ['Xác định dấu $A > 0$ (nén/nhận công) và $Q < 0$ (tỏa nhiệt ra ngoài).'],
        solutionSteps: [
          'Bước 1: Khí nhận công nên $A = +120\\text{ J}$; khí tỏa nhiệt nên $Q = -40\\text{ J}$.',
          'Bước 2: $\\Delta U = A + Q = 120 - 40 = +80\\text{ J} > 0$, vậy nội năng của khí tăng thêm $80\\text{ J}$.'
        ],
        finalAnswer: '$\\Delta U = +80\\text{ J}$ (nội năng tăng $80\\text{ J}$).'
      }
    ]
  },

  // ==================== CHƯƠNG VII: CHẤT RẮN VÀ CHẤT LỎNG. SỰ CHUYỂN THỂ (Bài 20) ====================
  {
    id: 'phys-2006-10-20',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'Vật lí 10 (2006) · Chương VII: Chất rắn, Chất lỏng & Sự chuyển thể',
    sourceTag: SRC_10,
    lessonNumber: 20,
    title: 'Bài 20 (2006): Biến dạng cơ vật rắn, Sự nở vì nhiệt & Hiện tượng căng bề mặt – Chuyển thể',
    subtitle: 'Giới hạn bền – ứng suất kéo, nở dài Δl = αl₀Δt, lực căng bề mặt F_c = σl, nhiệt nóng chảy – hóa hơi và độ ẩm không khí',
    description:
      'Tính độ dãn nở vì nhiệt của thanh ray/cầu thép, tính lực căng bề mặt chất lỏng, nhiệt lượng nóng chảy $Q = \\lambda m$, hóa hơi $Q = L m$ và độ ẩm tỉ đối không khí.',
    theorySections: [
      {
        heading: '1. Biến dạng cơ & Sự nở vì nhiệt của chất rắn',
        content:
          '• **Định luật Húc cho thanh rắn**: $\\Delta l = \\frac{l_0}{E S} F$ ($E$ là suất Y-âng).\n• **Sự nở dài**: $\\Delta l = \\alpha l_0 \\Delta t$; **sự nở khối**: $\\Delta V = \\beta V_0 \\Delta t$ với $\\beta \\approx 3\\alpha$.'
      },
      {
        heading: '2. Hiện tượng căng bề mặt, Mao dẫn & Sự chuyển thể',
        content:
          '• **Lực căng bề mặt**: $F_c = \\sigma \\cdot l$, có xu hướng thu nhỏ diện tích mặt thoáng chất lỏng.\n• **Nhiệt nóng chảy**: $Q = \\lambda m$ (ở nhiệt độ nóng chảy xác định với chất rắn kết tinh); **nhiệt hóa hơi**: $Q = L m$.\n• **Độ ẩm tỉ đối**: $f = \\frac{a}{A}\\cdot 100\\%$ (tỉ số độ ẩm tuyệt đối và độ ẩm cực đại).'
      }
    ],
    keyFormulas: [
      '\\Delta l = \\alpha l_0 \\Delta t, \\quad \\Delta V = 3\\alpha V_0 \\Delta t',
      'F_c = \\sigma l, \\quad Q_{\\text{nc}} = \\lambda m, \\quad Q_{\\text{hh}} = L m'
    ],
    ...SIM_PRESETS.phase_change,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một thanh ray đường sắt dài $l_0 = 12{,}5\\text{ m}$ ở $20^\\circ\\text{C}$, biết hệ số nở dài của thép là $\\alpha = 1{,}2\\cdot 10^{-5}\\text{ K}^{-1}$. Khi nhiệt độ lên đến $50^\\circ\\text{C}$, thanh ray dài thêm:',
        options: ['A. $4{,}5\\text{ mm}$', 'B. $4{,}5\\text{ cm}$', 'C. $0{,}45\\text{ mm}$', 'D. $7{,}5\\text{ mm}$'],
        correctIndex: 0,
        explanation: '$\\Delta l = \\alpha l_0 \\Delta t = 1{,}2\\cdot 10^{-5} \\cdot 12{,}5 \\cdot (50 - 20) = 4{,}5\\cdot 10^{-3}\\text{ m} = 4{,}5\\text{ mm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Tính nhiệt lượng cần cung cấp để làm nóng chảy hoàn toàn $2\\text{ kg}$ nước đá ở $0^\\circ\\text{C}$ rồi đun sôi đến $100^\\circ\\text{C}$. Biết $\\lambda = 3{,}4\\cdot 10^5\\text{ J/kg}$ và $c = 4200\\text{ J/(kg.K)}$.',
        hints: ['Tổng nhiệt lượng gồm hai giai đoạn: $Q = \\lambda m + m c \\Delta t$.'],
        solutionSteps: [
          'Bước 1: Nhiệt lượng làm nóng chảy nước đá ở $0^\\circ\\text{C}$: $Q_1 = 3{,}4\\cdot 10^5 \\cdot 2 = 6{,}8\\cdot 10^5\\text{ J}$.',
          'Bước 2: Nhiệt lượng đun nước từ $0^\\circ\\text{C}$ lên $100^\\circ\\text{C}$: $Q_2 = 2 \\cdot 4200 \\cdot 100 = 8{,}4\\cdot 10^5\\text{ J}$.',
          'Bước 3: Tổng nhiệt lượng $Q = 6{,}8\\cdot 10^5 + 8{,}4\\cdot 10^5 = 1{,}52\\cdot 10^6\\text{ J} = 1520\\text{ kJ}$.'
        ],
        finalAnswer: '$Q = 1520\\text{ kJ}$.'
      }
    ]
  }
];
