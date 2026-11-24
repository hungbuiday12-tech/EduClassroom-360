import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const SRC_11 = 'GDPT 2006 · Vật lí 11 Cơ bản (NXB Giáo dục Việt Nam)';

export const PHYSICS_GDPT_2006_GRADE_11: PhysicsLesson[] = [
  // ==================== CHƯƠNG I: ĐIỆN TÍCH. ĐIỆN TRƯỜNG (Bài 1–4) ====================
  {
    id: 'phys-2006-11-1',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương I: Điện tích & Điện trường',
    sourceTag: SRC_11,
    lessonNumber: 1,
    title: 'Bài 1 (2006): Điện tích – Định luật Cu-lông & Thuyết Êlectron',
    subtitle: 'Tương tác tĩnh điện F = k|q₁q₂|/(εr²), định luật bảo toàn điện tích và giải thích nhiễm điện do cọ xát, tiếp xúc, hưởng ứng',
    description:
      'Tính lực tương tác Cu-lông trong chân không và trong điện môi đồng chất $\\varepsilon$, vận dụng thuyết êlectron và định luật bảo toàn điện tích khi cho hai quả cầu tiếp xúc rồi tách ra.',
    theorySections: [
      {
        heading: '1. Định luật Cu-lông',
        content:
          '• Lực hút hay đẩy giữa hai điện tích điểm đặt trong chân không có phương trùng với đường thẳng nối hai điện tích, có độ lớn tỉ lệ thuận với tích độ lớn hai điện tích và tỉ lệ nghịch với bình phương khoảng cách giữa chúng:\n$$F = k\\frac{|q_1 q_2|}{\\varepsilon r^2}, \\quad k = 9\\cdot 10^9\\,\\frac{\\text{N}\\cdot\\text{m}^2}{\\text{C}^2}$$'
      },
      {
        heading: '2. Thuyết êlectron & Định luật bảo toàn điện tích',
        content:
          '• Vật nhiễm điện âm khi thừa êlectron ($q = -N\\cdot e$); nhiễm điện dương khi thiếu êlectron ($e = 1{,}6\\cdot 10^{-19}\\text{ C}$).\n• Trong một **hệ cô lập về điện**, tổng đại số các điện tích là không đổi. Khi hai quả cầu kim loại giống hệt nhau mang điện tích $q_1, q_2$ tiếp xúc rồi tách ra, điện tích mỗi quả sau tiếp xúc là $q\' = \\frac{q_1 + q_2}{2}$.'
      }
    ],
    keyFormulas: [
      'F = k\\frac{|q_1 q_2|}{\\varepsilon r^2}, \\quad k = 9\\cdot 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2',
      'q\'_1 = q\'_2 = \\frac{q_1 + q_2}{2} \\quad (\\text{hai quả cầu giống nhau})'
    ],
    ...SIM_PRESETS.coulomb,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Hai điện tích điểm $q_1 = 2\\,\\mu\\text{C}$ và $q_2 = -4\\,\\mu\\text{C}$ đặt cách nhau $30\\text{ cm}$ trong chân không. Lực tương tác giữa chúng là:',
        options: ['A. Lực hút $0{,}8\\text{ N}$', 'B. Lực đẩy $0{,}8\\text{ N}$', 'C. Lực hút $0{,}24\\text{ N}$', 'D. Lực đẩy $2{,}4\\text{ N}$'],
        correctIndex: 0,
        explanation: 'Hai điện tích trái dấu nên hút nhau; $F = 9\\cdot 10^9\\cdot\\frac{2\\cdot 10^{-6}\\cdot 4\\cdot 10^{-6}}{0{,}3^2} = 0{,}8\\text{ N}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Hai quả cầu kim loại nhỏ giống hệt nhau mang điện tích $q_1 = +4\\cdot 10^{-8}\\text{ C}$ và $q_2 = -8\\cdot 10^{-8}\\text{ C}$, đặt cách nhau $10\\text{ cm}$ trong không khí. Cho hai quả cầu tiếp xúc nhau rồi đưa về vị trí cũ. Tính lực tương tác giữa chúng trước và sau khi tiếp xúc.',
        hints: ['Sau tiếp xúc $q\' = \\frac{q_1 + q_2}{2} = -2\\cdot 10^{-8}\\text{ C}$.'],
        solutionSteps: [
          'Bước 1: Trước tiếp xúc: $F_1 = 9\\cdot 10^9\\cdot\\frac{4\\cdot 10^{-8}\\cdot 8\\cdot 10^{-8}}{0{,}1^2} = 2{,}88\\cdot 10^{-3}\\text{ N}$ (lực hút).',
          'Bước 2: Sau tiếp xúc: $q\' = \\frac{4\\cdot 10^{-8} - 8\\cdot 10^{-8}}{2} = -2\\cdot 10^{-8}\\text{ C}$.',
          'Bước 3: $F_2 = 9\\cdot 10^9\\cdot\\frac{(2\\cdot 10^{-8})^2}{0{,}1^2} = 3{,}6\\cdot 10^{-4}\\text{ N}$ (lực đẩy).'
        ],
        finalAnswer: 'Trước tiếp xúc hút nhau $2{,}88\\cdot 10^{-3}\\text{ N}$; sau tiếp xúc đẩy nhau $3{,}6\\cdot 10^{-4}\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-2006-11-2',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương I: Điện tích & Điện trường',
    sourceTag: SRC_11,
    lessonNumber: 2,
    title: 'Bài 2 (2006): Điện trường – Cường độ điện trường & Đường sức điện',
    subtitle: 'Vectơ cường độ điện trường E = F/q, điện trường của điện tích điểm E = k|Q|/(εr²) và nguyên lí chồng chất điện trường',
    description:
      'Xác định hướng vectơ cường độ điện trường tại một điểm (hướng ra xa điện tích dương, hướng vào điện tích âm), tính điện trường tổng hợp $\\vec{E} = \\vec{E}_1 + \\vec{E}_2$ và đặc điểm đường sức điện.',
    theorySections: [
      {
        heading: '1. Vectơ cường độ điện trường',
        content:
          '• **Cường độ điện trường**: $\\vec{E} = \\frac{\\vec{F}}{q}$ (đơn vị: $\\text{V/m}$). Độ lớn $E$ tại điểm cách điện tích điểm $Q$ một khoảng $r$ trong điện môi $\\varepsilon$: $E = k\\frac{|Q|}{\\varepsilon r^2}$.\n• Nếu $Q > 0$ thì $\\vec{E}$ hướng ra xa $Q$; nếu $Q < 0$ thì $\\vec{E}$ hướng về phía $Q$.'
      },
      {
        heading: '2. Nguyên lí chồng chất & Đường sức điện',
        content:
          '• **Nguyên lí chồng chất điện trường**: $\\vec{E} = \\vec{E}_1 + \\vec{E}_2 + \\dots + \\vec{E}_n$.\n• Đường sức điện tĩnh đi ra từ điện tích dương (hoặc vô cực), đi vào điện tích âm (hoặc vô cực) và không bao giờ cắt nhau.'
      }
    ],
    keyFormulas: [
      '\\vec{F} = q\\vec{E}, \\quad E = k\\frac{|Q|}{\\varepsilon r^2} \\text{ (V/m)}',
      '\\vec{E} = \\vec{E}_1 + \\vec{E}_2'
    ],
    ...SIM_PRESETS.electric_field,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Tại một điểm $M$ trong không khí cách điện tích điểm $Q = 4\\cdot 10^{-8}\\text{ C}$ một đoạn $r = 20\\text{ cm}$, cường độ điện trường có độ lớn bằng:',
        options: ['A. $9000\\text{ V/m}$', 'B. $1800\\text{ V/m}$', 'C. $900\\text{ V/m}$', 'D. $4500\\text{ V/m}$'],
        correctIndex: 0,
        explanation: '$E = 9\\cdot 10^9 \\cdot \\frac{4\\cdot 10^{-8}}{0{,}2^2} = 9000\\text{ V/m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Cho hai điện tích điểm $q_1 = +4\\cdot 10^{-8}\\text{ C}$ và $q_2 = -4\\cdot 10^{-8}\\text{ C}$ đặt tại A và B cách nhau $40\\text{ cm}$ trong không khí. Xác định cường độ điện trường tổng hợp tại trung điểm O của đoạn AB.',
        hints: ['Tại O, $r_1 = r_2 = 0{,}2\\text{ m}$; kiểm tra chiều $\\vec{E}_1$ (hướng từ A sang B) và $\\vec{E}_2$ (cũng hướng sang B).'],
        solutionSteps: [
          'Bước 1: $E_1 = 9\\cdot 10^9\\cdot\\frac{4\\cdot 10^{-8}}{0{,}2^2} = 9000\\text{ V/m}$ (hướng từ A đến B).',
          'Bước 2: $E_2 = 9\\cdot 10^9\\cdot\\frac{4\\cdot 10^{-8}}{0{,}2^2} = 9000\\text{ V/m}$ (hướng về B, tức cùng hướng $\\vec{E}_1$).',
          'Bước 3: $E = E_1 + E_2 = 18\\,000\\text{ V/m}$, hướng từ A đến B.'
        ],
        finalAnswer: '$E = 18\\,000\\text{ V/m}$, hướng từ A sang B.'
      }
    ]
  },
  {
    id: 'phys-2006-11-3',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương I: Điện tích & Điện trường',
    sourceTag: SRC_11,
    lessonNumber: 3,
    title: 'Bài 3 (2006): Công của lực điện, Điện thế & Hiệu điện thế',
    subtitle: 'Tính chất lực thế A_MN = qEd không phụ thuộc hình dạng đường đi, điện thế V_M và liên hệ U_MN = E·d',
    description:
      'Tính công của lực điện trường đều $A = q E d$, nắm ý nghĩa hình chiếu $d = \\overline{M\'N\'}$ trên một đường sức điện và liên hệ giữa hiệu điện thế với công làm dịch chuyển điện tích.',
    theorySections: [
      {
        heading: '1. Công của lực điện trường',
        content:
          '• Công của lực điện làm điện tích $q$ di chuyển từ M đến N trong điện trường đều $\\vec{E}$ không phụ thuộc hình dạng đường đi mà chỉ phụ thuộc vị trí điểm đầu và điểm cuối: $A_{MN} = q E d$, với $d = \\overline{MN}\\cos\\alpha$ là độ dài đại số hình chiếu đoạn MN lên phương đường sức điện.\n• Do đó trường tĩnh điện là một **trường thế**.'
      },
      {
        heading: '2. Điện thế & Hiệu điện thế',
        content:
          '• **Điện thế** tại M: $V_M = \\frac{A_{M\\infty}}{q}$ ($\\text{V}$).\n• **Hiệu điện thế** giữa M và N: $U_{MN} = V_M - V_N = \\frac{A_{MN}}{q}$. Trong điện trường đều dọc theo đường sức: $U = E \\cdot d \\iff E = \\frac{U}{d}$.'
      }
    ],
    keyFormulas: [
      'A_{MN} = q E d = q U_{MN}',
      'U = E \\cdot d \\quad (\\text{dọc theo đường sức điện trường đều})'
    ],
    ...SIM_PRESETS.electric_field,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Giữa hai bản kim loại phẳng song song cách nhau $d = 2\\text{ cm}$ có hiệu điện thế $U = 100\\text{ V}$. Cường độ điện trường giữa hai bản là:',
        options: ['A. $50\\text{ V/m}$', 'B. $5000\\text{ V/m}$', 'C. $200\\text{ V/m}$', 'D. $2000\\text{ V/m}$'],
        correctIndex: 1,
        explanation: '$E = \\frac{U}{d} = \\frac{100}{0{,}02} = 5000\\text{ V/m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một êlectron ($q = -1{,}6\\cdot 10^{-19}\\text{ C},\\ m = 9{,}1\\cdot 10^{-31}\\text{ kg}$) bắt đầu bay từ bản âm sang bản dương của một tụ điện phẳng có hiệu điện thế $U = 455\\text{ V}$. Tính công của lực điện và tốc độ êlectron ngay khi tới bản dương.',
        hints: ['Dùng $A = |q| U = \\frac{1}{2}m v^2$ (vì $v_0 = 0$).'],
        solutionSteps: [
          'Bước 1: Công lực điện phát động $A = |q|U = 1{,}6\\cdot 10^{-19} \\cdot 455 = 7{,}28\\cdot 10^{-17}\\text{ J}$.',
          'Bước 2: Định lí động năng $\\frac{1}{2}m v^2 = A \\Rightarrow v = \\sqrt{\\frac{2 A}{m}} = \\sqrt{\\frac{2 \\cdot 7{,}28\\cdot 10^{-17}}{9{,}1\\cdot 10^{-31}}} = \\sqrt{1{,}6\\cdot 10^{14}} \\approx 1{,}265\\cdot 10^7\\text{ m/s}$.'
        ],
        finalAnswer: '$A = 7{,}28\\cdot 10^{-17}\\text{ J}$; $v \\approx 1{,}265\\cdot 10^7\\text{ m/s}$.'
      }
    ]
  },
  {
    id: 'phys-2006-11-4',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương I: Điện tích & Điện trường',
    sourceTag: SRC_11,
    lessonNumber: 4,
    title: 'Bài 4 (2006): Tụ điện, Điện dung C & Năng lượng điện trường',
    subtitle: 'Công thức điện dung Q = C·U, tụ phẳng C = εS/(4πkd), ghép tụ nối tiếp – song song và năng lượng tụ W = ½CU²',
    description:
      'Tính điện tích cực đại của tụ, công thức điện dung tụ phẳng, ghép tụ nối tiếp/song song và năng lượng điện trường tích trữ trong tụ điện.',
    theorySections: [
      {
        heading: '1. Tụ điện & Điện dung',
        content:
          '• **Tụ điện** gồm hai vật dẫn đặt gần nhau ngăn cách bởi lớp điện môi, dùng để tích điện.\n• Điện tích $Q$ trên bản dương tỉ lệ thuận với hiệu điện thế $U$: $Q = C U$, với $C$ là **điện dung** (Fara, $1\\,\\mu\\text{F} = 10^{-6}\\text{ F}$, $1\\text{ nF} = 10^{-9}\\text{ F}$, $1\\text{ pF} = 10^{-12}\\text{ F}$).\n• Tụ phẳng có bản diện tích $S$, cách nhau $d$: $C = \\frac{\\varepsilon S}{4\\pi k d}$.'
      },
      {
        heading: '2. Ghép tụ điện & Năng lượng điện trường',
        content:
          '• **Ghép song song**: $C_b = C_1 + C_2$, $U_b = U_1 = U_2$, $Q_b = Q_1 + Q_2$.\n• **Ghép nối tiếp**: $\\frac{1}{C_b} = \\frac{1}{C_1} + \\frac{1}{C_2}$, $Q_b = Q_1 = Q_2$, $U_b = U_1 + U_2$.\n• **Năng lượng điện trường trong tụ**: $W = \\frac{1}{2} Q U = \\frac{1}{2} C U^2 = \\frac{Q^2}{2C}$.'
      }
    ],
    keyFormulas: [
      'Q = C \\cdot U, \\quad C = \\frac{\\varepsilon S}{4\\pi k d}',
      'W = \\frac{1}{2} Q U = \\frac{1}{2} C U^2 = \\frac{Q^2}{2C}'
    ],
    ...SIM_PRESETS.capacitor,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Một tụ điện có điện dung $C = 10\\,\\mu\\text{F}$ được tích điện ở hiệu điện thế $U = 100\\text{ V}$. Điện tích và năng lượng của tụ là:',
        options: [
          'A. $10^{-3}\\text{ C};\\ 0{,}05\\text{ J}$',
          'B. $10^{-3}\\text{ C};\\ 0{,}1\\text{ J}$',
          'C. $10^{-4}\\text{ C};\\ 0{,}05\\text{ J}$',
          'D. $10^3\\text{ C};\\ 5\\text{ J}$'
        ],
        correctIndex: 0,
        explanation: '$Q = 10\\cdot 10^{-6}\\cdot 100 = 10^{-3}\\text{ C}$; $W = \\frac{1}{2} Q U = \\frac{1}{2}\\cdot 10^{-3}\\cdot 100 = 0{,}05\\text{ J}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Hai tụ điện $C_1 = 3\\,\\mu\\text{F}$ và $C_2 = 6\\,\\mu\\text{F}$ mắc nối tiếp vào nguồn có hiệu điện thế $U = 120\\text{ V}$. Tính điện dung tương đương, điện tích mỗi tụ và hiệu điện thế trên mỗi tụ.',
        hints: ['Tính $\\frac{1}{C_b} = \\frac{1}{C_1} + \\frac{1}{C_2}$, rồi $Q_1 = Q_2 = Q_b = C_b U$.'],
        solutionSteps: [
          'Bước 1: $C_b = \\frac{3 \\cdot 6}{3 + 6} = 2\\,\\mu\\text{F}$.',
          'Bước 2: $Q_1 = Q_2 = Q_b = C_b U = 2\\cdot 10^{-6} \\cdot 120 = 2{,}4\\cdot 10^{-4}\\text{ C}$.',
          'Bước 3: $U_1 = \\frac{Q_1}{C_1} = \\frac{240}{3} = 80\\text{ V}$; $U_2 = \\frac{240}{6} = 40\\text{ V}$.'
        ],
        finalAnswer: '$C_b = 2\\,\\mu\\text{F}$; $Q_1 = Q_2 = 2{,}4\\cdot 10^{-4}\\text{ C}$; $U_1 = 80\\text{ V},\\ U_2 = 40\\text{ V}$.'
      }
    ]
  },

  // ==================== CHƯƠNG II: DÒNG ĐIỆN KHÔNG ĐỔI (Bài 5–8) ====================
  {
    id: 'phys-2006-11-5',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương II: Dòng điện không đổi',
    sourceTag: SRC_11,
    lessonNumber: 5,
    title: 'Bài 5 (2006): Dòng điện không đổi & Nguồn điện – Suất điện động E',
    subtitle: 'Cường độ dòng điện I = q/t, lực lạ bên trong nguồn điện và suất điện động E = A_lạ / q',
    description:
      'Hiểu quy ước chiều dòng điện (ra từ cực dương, vào từ cực âm), điều kiện duy trì dòng điện và định nghĩa suất điện động $\\mathcal{E}$ đặc trưng cho khả năng sinh công của nguồn.',
    theorySections: [
      {
        heading: '1. Cường độ dòng điện & Dòng điện không đổi',
        content:
          '• **Chiều dòng điện quy ước**: Chiều dịch chuyển có hướng của các điện tích dương — đi **ra từ cực dương $(+)$** qua mạch ngoài và đi **vào cực âm $(-)$** của nguồn điện.\n• **Cường độ dòng điện không đổi**: $I = \\frac{q}{t} = \\frac{N e}{t}$ (Ampe, $\\text{A}$).'
      },
      {
        heading: '2. Nguồn điện & Suất điện động',
        content:
          '• Bên trong nguồn điện có **lực lạ** tách và chuyển các điện tích dương về cực dương, điện tích âm về cực âm để duy trì hiệu điện thế.\n• **Suất điện động** $\\mathcal{E}$ của nguồn điện bằng thương số công của lực lạ $A_{\\text{lạ}}$ và độ lớn điện tích $q$ dịch chuyển: $\\mathcal{E} = \\frac{A_{\\text{lạ}}}{q}$ (Vôn, $\\text{V}$).'
      }
    ],
    keyFormulas: [
      'I = \\frac{q}{t}, \\quad \\mathcal{E} = \\frac{A_{\\text{lạ}}}{q}'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Trong $10\\text{ s}$, một lượng điện tích $q = 15\\text{ C}$ chuyển qua tiết diện thẳng của dây dẫn theo dòng điện không đổi. Cường độ dòng điện trong dây dẫn là:',
        options: ['A. $1{,}5\\text{ A}$', 'B. $150\\text{ A}$', 'C. $0{,}67\\text{ A}$', 'D. $5\\text{ A}$'],
        correctIndex: 0,
        explanation: '$I = \\frac{q}{t} = \\frac{15}{10} = 1{,}5\\text{ A}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một nguồn điện có suất điện động $\\mathcal{E} = 12\\text{ V}$ cung cấp dòng điện không đổi $I = 2\\text{ A}$ chạy trong mạch kín trong thời gian $5\\text{ phút}$. Tính điện lượng dịch chuyển qua nguồn và công của lực lạ trong nguồn điện.',
        hints: ['Tính $q = I t$ rồi $A_{\\text{lạ}} = \\mathcal{E} q$.'],
        solutionSteps: [
          'Bước 1: $t = 5\\cdot 60 = 300\\text{ s} \\Rightarrow q = I t = 2 \\cdot 300 = 600\\text{ C}$.',
          'Bước 2: Công lực lạ (công nguồn điện) $A_{\\text{ng}} = \\mathcal{E} q = 12 \\cdot 600 = 7200\\text{ J}$.'
        ],
        finalAnswer: '$q = 600\\text{ C}$; $A_{\\text{ng}} = 7200\\text{ J}$.'
      }
    ]
  },
  {
    id: 'phys-2006-11-6',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương II: Dòng điện không đổi',
    sourceTag: SRC_11,
    lessonNumber: 6,
    title: 'Bài 6 (2006): Điện năng, Công suất điện & Công suất của Nguồn điện',
    subtitle: 'Phân biệt công suất nguồn P_ng = E·I, công suất tỏa nhiệt mạch ngoài và hiệu suất nguồn H = U_N / E',
    description:
      'Tính công và công suất tiêu thụ của đoạn mạch, phân biệt vật tỏa nhiệt thuần túy (điện trở $R$) với máy thu (động cơ/bình điện phân) và tính công suất cực đại mạch ngoài.',
    theorySections: [
      {
        heading: '1. Điện năng & Công suất tiêu thụ đoạn mạch',
        content:
          '• Điện năng tiêu thụ của đoạn mạch: $A = U I t$; công suất tiêu thụ: $\\mathcal{P} = U I$.\n• Đoạn mạch chỉ có điện trở thuần $R$: nhiệt lượng tỏa ra theo định luật Jun–Len-xơ là $Q = I^2 R t$, công suất tỏa nhiệt $\\mathcal{P} = I^2 R = \\frac{U^2}{R}$.'
      },
      {
        heading: '2. Công & Công suất của nguồn điện',
        content:
          '• Công của nguồn điện: $A_{\\text{ng}} = \\mathcal{E} I t$; công suất của nguồn điện: $\\mathcal{P}_{\\text{ng}} = \\mathcal{E} I$.\n• Hiệu suất của nguồn điện: $H = \\frac{A_{\\text{có ích}}}{A_{\\text{ng}}} = \\frac{U_N}{\\mathcal{E}} = \\frac{R_N}{R_N + r}$.'
      }
    ],
    keyFormulas: [
      'A = U I t, \\quad \\mathcal{P}_{\\text{ng}} = \\mathcal{E} I, \\quad A_{\\text{ng}} = \\mathcal{E} I t',
      'H = \\frac{U_N}{\\mathcal{E}} = \\frac{R_N}{R_N + r}'
    ],
    ...SIM_PRESETS.electric_power,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Một nguồn điện có suất điện động $\\mathcal{E} = 9\\text{ V}$ tạo ra dòng điện $I = 1{,}5\\text{ A}$ chạy qua mạch kín. Công suất của nguồn điện bằng:',
        options: ['A. $6\\text{ W}$', 'B. $13{,}5\\text{ W}$', 'C. $10{,}5\\text{ W}$', 'D. $20{,}25\\text{ W}$'],
        correctIndex: 1,
        explanation: '$\\mathcal{P}_{\\text{ng}} = \\mathcal{E} I = 9 \\cdot 1{,}5 = 13{,}5\\text{ W}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một nguồn điện $\\mathcal{E} = 12\\text{ V},\\ r = 2\\,\\Omega$ nối với điện trở mạch ngoài $R = 4\\,\\Omega$. Tính cường độ dòng điện, công suất tỏa nhiệt trên $R$, công suất của nguồn và hiệu suất nguồn.',
        hints: ['Dùng $I = \\frac{\\mathcal{E}}{R+r}$, rồi tính $\\mathcal{P}_R = I^2 R$, $\\mathcal{P}_{\\text{ng}} = \\mathcal{E} I$ và $H = R/(R+r)$.'],
        solutionSteps: [
          'Bước 1: $I = \\frac{12}{4 + 2} = 2\\text{ A}$.',
          'Bước 2: Công suất mạch ngoài $\\mathcal{P}_R = 2^2 \\cdot 4 = 16\\text{ W}$; công suất nguồn $\\mathcal{P}_{\\text{ng}} = 12 \\cdot 2 = 24\\text{ W}$.',
          'Bước 3: Hiệu suất nguồn $H = \\frac{16}{24}\\cdot 100\\% = 66{,}7\\%$.'
        ],
        finalAnswer: '$I = 2\\text{ A}$; $\\mathcal{P}_R = 16\\text{ W}$; $\\mathcal{P}_{\\text{ng}} = 24\\text{ W}$; $H \\approx 66{,}7\\%$.'
      }
    ]
  },
  {
    id: 'phys-2006-11-7',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương II: Dòng điện không đổi',
    sourceTag: SRC_11,
    lessonNumber: 7,
    title: 'Bài 7 (2006): Định luật Ôm đối với toàn mạch & Hiện tượng đoản mạch',
    subtitle: 'Công thức I = E / (R_N + r), độ giảm thế Ir, hiệu điện thế mạch ngoài U_N = E - Ir và điều kiện công suất mạch ngoài cực đại',
    description:
      'Thiết lập định luật Ôm toàn mạch từ bảo toàn năng lượng, phân tích hiện tượng đoản mạch ($R_N \\to 0 \\Rightarrow I = \\mathcal{E}/r$) và biện pháp bảo vệ bằng cầu chì.',
    theorySections: [
      {
        heading: '1. Định luật Ôm đối với toàn mạch',
        content:
          '• **Phát biểu**: Cường độ dòng điện chạy trong mạch điện kín tỉ lệ thuận với suất điện động của nguồn điện và tỉ lệ nghịch với điện trở toàn phần của mạch đó:\n$$I = \\frac{\\mathcal{E}}{R_N + r} \\iff \\mathcal{E} = I R_N + I r = U_N + I r$$\n• Hiệu điện thế hai cực nguồn khi phát dòng: $U_N = \\mathcal{E} - I r$.'
      },
      {
        heading: '2. Hiện tượng đoản mạch & Công suất mạch ngoài cực đại',
        content:
          '• Khi nối tắt hai cực nguồn bằng dây dẫn điện trở không đáng kể ($R_N \\approx 0$), xảy ra **đoản mạch**: $I_{\\text{max}} = \\frac{\\mathcal{E}}{r}$ rất lớn dễ gây cháy nổ.\n• Khi $R_N$ thay đổi, công suất mạch ngoài $\\mathcal{P}_N = \\frac{\\mathcal{E}^2 R_N}{(R_N + r)^2}$ đạt cực đại $\\mathcal{P}_{N\\max} = \\frac{\\mathcal{E}^2}{4r}$ khi $R_N = r$.'
      }
    ],
    keyFormulas: [
      'I = \\frac{\\mathcal{E}}{R_N + r}, \\quad U_N = \\mathcal{E} - I r = I R_N',
      '\\mathcal{P}_{N\\max} = \\frac{\\mathcal{E}^2}{4r} \\text{ khi } R_N = r'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Mắc điện trở $R = 5\\,\\Omega$ vào hai cực nguồn điện $\\mathcal{E} = 6\\text{ V},\\ r = 1\\,\\Omega$. Hiệu điện thế hai đầu điện trở $R$ là:',
        options: ['A. $6\\text{ V}$', 'B. $5\\text{ V}$', 'C. $1\\text{ V}$', 'D. $4\\text{ V}$'],
        correctIndex: 1,
        explanation: '$I = \\frac{6}{5+1} = 1\\text{ A} \\Rightarrow U_N = I R = 1 \\cdot 5 = 5\\text{ V}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Cho nguồn $\\mathcal{E} = 12\\text{ V},\\ r = 3\\,\\Omega$ nối với biến trở $R$. Điều chỉnh $R$ để công suất tiêu thụ trên $R$ đạt giá trị cực đại. Tìm giá trị $R$ và công suất cực đại đó.',
        hints: ['Dùng bất đẳng thức Cô-si cho mẫu số $(\\sqrt{R} + r/\\sqrt{R})^2 \\ge 4r$, dấu bằng tại $R = r$.'],
        solutionSteps: [
          'Bước 1: $\\mathcal{P}_R = I^2 R = \\frac{\\mathcal{E}^2 R}{(R + r)^2} = \\frac{\\mathcal{E}^2}{\\left(\\sqrt{R} + \\frac{r}{\\sqrt{R}}\\right)^2}$.',
          'Bước 2: $\\mathcal{P}_R$ cực đại khi $\\sqrt{R} = \\frac{r}{\\sqrt{R}} \\iff R = r = 3\\,\\Omega$.',
          'Bước 3: Giá trị cực đại $\\mathcal{P}_{\\max} = \\frac{\\mathcal{E}^2}{4r} = \\frac{12^2}{4\\cdot 3} = 12\\text{ W}$.'
        ],
        finalAnswer: '$R = 3\\,\\Omega$; $\\mathcal{P}_{\\max} = 12\\text{ W}$.'
      }
    ]
  },
  {
    id: 'phys-2006-11-8',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương II: Dòng điện không đổi',
    sourceTag: SRC_11,
    lessonNumber: 8,
    title: 'Bài 8 (2006): Ghép các nguồn điện thành bộ (Nối tiếp, Song song, Hỗn hợp đối xứng)',
    subtitle: 'Tính suất điện động bộ E_b và điện trở trong bộ r_b khi ghép nối tiếp, song song các nguồn giống nhau và hỗn hợp đối xứng',
    description:
      'Tính nhanh $(\\mathcal{E}_b, r_b)$ cho bộ nguồn nối tiếp, bộ $n$ nguồn giống nhau ghép song song và bộ nguồn ghép hỗn hợp đối xứng $m$ dãy, mỗi dãy $n$ nguồn.',
    theorySections: [
      {
        heading: '1. Bộ nguồn mắc nối tiếp & Song song',
        content:
          '• **Mắc nối tiếp**: $\\mathcal{E}_b = \\mathcal{E}_1 + \\mathcal{E}_2 + \\dots + \\mathcal{E}_n$; $r_b = r_1 + r_2 + \\dots + r_n$. Nếu $n$ nguồn giống nhau: $\\mathcal{E}_b = n\\mathcal{E}$, $r_b = nr$.\n• **Mắc song song** ($m$ nguồn giống nhau): $\\mathcal{E}_b = \\mathcal{E}$; $r_b = \\frac{r}{m}$.'
      },
      {
        heading: '2. Bộ nguồn hỗn hợp đối xứng',
        content:
          '• Có $m$ dãy mắc song song, mỗi dãy gồm $n$ nguồn giống nhau $(\\mathcal{E}, r)$ mắc nối tiếp (tổng số nguồn $N = m\\cdot n$): $\\mathcal{E}_b = n\\mathcal{E}$; $r_b = \\frac{n r}{m}$.'
      }
    ],
    keyFormulas: [
      '\\text{Nối tiếp: } \\mathcal{E}_b = \\sum \\mathcal{E}_i,\\ r_b = \\sum r_i',
      '\\text{Hỗn hợp } m \\text{ dãy } \\times n \\text{ nguồn}: \\mathcal{E}_b = n\\mathcal{E}, \\quad r_b = \\frac{nr}{m}'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Ghép nối tiếp $4$ pin giống nhau, mỗi pin có $\\mathcal{E} = 1{,}5\\text{ V},\\ r = 0{,}5\\,\\Omega$. Suất điện động và điện trở trong của bộ nguồn là:',
        options: ['A. $6\\text{ V};\\ 2\\,\\Omega$', 'B. $1{,}5\\text{ V};\\ 0{,}125\\,\\Omega$', 'C. $6\\text{ V};\\ 0{,}5\\,\\Omega$', 'D. $3\\text{ V};\\ 1\\,\\Omega$'],
        correctIndex: 0,
        explanation: 'Ghép nối tiếp: $\\mathcal{E}_b = 4\\cdot 1{,}5 = 6\\text{ V}$; $r_b = 4\\cdot 0{,}5 = 2\\,\\Omega$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Có $6$ pin giống nhau $(\\mathcal{E} = 1{,}5\\text{ V},\\ r = 1\\,\\Omega)$ ghép thành bộ hỗn hợp đối xứng gồm $2$ dãy song song, mỗi dãy $3$ pin nối tiếp, cấp điện cho mạch ngoài $R = 4{,}5\\,\\Omega$. Tính cường độ dòng điện qua $R$ và qua mỗi pin.',
        hints: ['Tính $\\mathcal{E}_b = 3\\mathcal{E}$, $r_b = \\frac{3r}{2}$, rồi $I = \\frac{\\mathcal{E}_b}{R + r_b}$ và $I_{\\text{pin}} = I/2$.'],
        solutionSteps: [
          'Bước 1: $\\mathcal{E}_b = 3 \\cdot 1{,}5 = 4{,}5\\text{ V}$; $r_b = \\frac{3 \\cdot 1}{2} = 1{,}5\\,\\Omega$.',
          'Bước 2: Dòng mạch chính $I = \\frac{4{,}5}{4{,}5 + 1{,}5} = 0{,}75\\text{ A}$.',
          'Bước 3: Vì có $2$ dãy song song giống nhau nên dòng qua mỗi pin là $I_{\\text{pin}} = \\frac{0{,}75}{2} = 0{,}375\\text{ A}$.'
        ],
        finalAnswer: '$I = 0{,}75\\text{ A}$; mỗi pin $0{,}375\\text{ A}$.'
      }
    ]
  },

  // ==================== CHƯƠNG III: DÒNG ĐIỆN TRONG CÁC MÔI TRƯỜNG (Bài 9–11) ====================
  {
    id: 'phys-2006-11-9',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương III: Dòng điện trong các môi trường',
    sourceTag: SRC_11,
    lessonNumber: 9,
    title: 'Bài 9 (2006): Dòng điện trong Kim loại, Siêu dẫn & Cặp nhiệt điện',
    subtitle: 'Hạt tải điện êlectron tự do, điện trở suất phụ thuộc nhiệt độ ρ = ρ₀[1 + α(t - t₀)], hiện tượng siêu dẫn và suất nhiệt điện E_T = α_T(T₁ - T₂)',
    description:
      'Giải thích nguyên nhân gây ra điện trở kim loại (va chạm giữa êlectron tự do với ion nút mạng dao động nhiệt), tính sự biến thiên điện trở theo nhiệt độ và hiểu cặp nhiệt điện.',
    theorySections: [
      {
        heading: '1. Bản chất dòng điện trong kim loại & Điện trở theo nhiệt độ',
        content:
          '• **Hạt tải điện** trong kim loại là **êlectron tự do**. Chiều chuyển động có hướng của êlectron ngược với chiều dòng điện quy ước.\n• Khi nhiệt độ tăng, ion nút mạng dao động mạnh hơn làm tăng va chạm $\\Rightarrow$ điện trở suất tăng gần đúng bậc nhất: $\\rho = \\rho_0 [1 + \\alpha(t - t_0)]$. Khi hạ xuống dưới nhiệt độ tới hạn $T_c$, một số vật liệu trở nên **siêu dẫn** ($R \\to 0$).'
      },
      {
        heading: '2. Hiện tượng nhiệt điện',
        content:
          '• Hai dây kim loại khác bản chất hàn hai đầu vào nhau, giữ hai mối hàn ở nhiệt độ khác nhau ($T_1 \\neq T_2$), trong mạch kín xuất hiện **suất nhiệt điện**: $\\mathcal{E}_T = \\alpha_T (T_1 - T_2)$.'
      }
    ],
    keyFormulas: [
      '\\rho = \\rho_0 [1 + \\alpha(t - t_0)], \\quad R = R_0 [1 + \\alpha(t - t_0)]',
      '\\mathcal{E}_T = \\alpha_T (T_1 - T_2)'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Hạt tải điện chủ yếu trong kim loại là:',
        options: ['A. Ion dương và ion âm', 'B. Êlectron tự do', 'C. Lỗ trống và êlectron', 'D. Proton'],
        correctIndex: 1,
        explanation: 'Trong kim loại, hạt tải điện tự do là các êlectron dẫn (êlectron tự do).'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một dây bạch kim ở $20^\\circ\\text{C}$ có điện trở $R_0 = 20\\,\\Omega$. Biết hệ số nhiệt điện trở của bạch kim là $\\alpha = 3{,}9\\cdot 10^{-3}\\text{ K}^{-1}$. Tính điện trở của dây khi nhiệt độ lên tới $520^\\circ\\text{C}$.',
        hints: ['Thay vào $R = R_0[1 + \\alpha(t - t_0)]$ với $\\Delta t = 500\\text{ K}$.'],
        solutionSteps: [
          'Bước 1: Độ tăng nhiệt độ $\\Delta t = 520 - 20 = 500\\text{ K}$.',
          'Bước 2: $R = 20 \\cdot (1 + 3{,}9\\cdot 10^{-3} \\cdot 500) = 20 \\cdot (1 + 1{,}95) = 59\\,\\Omega$.'
        ],
        finalAnswer: '$R = 59\\,\\Omega$.'
      }
    ]
  },
  {
    id: 'phys-2006-11-10',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương III: Dòng điện trong các môi trường',
    sourceTag: SRC_11,
    lessonNumber: 10,
    title: 'Bài 10 (2006): Dòng điện trong Chất điện phân & Định luật Fa-ra-đây',
    subtitle: 'Ion dương và ion âm dịch chuyển ngược chiều, hiện tượng dương cực tan và công thức Fa-ra-đây m = (1/F)·(A/n)·It',
    description:
      'Phân biệt bản chất dòng điện trong chất điện phân với kim loại, viết định luật Fa-ra-đây tính khối lượng chất giải phóng ở điện cực trong mạ điện và tinh luyện đồng.',
    theorySections: [
      {
        heading: '1. Dòng điện trong chất điện phân & Dương cực tan',
        content:
          '• **Hạt tải điện** là **ion dương** (đi về catôt $-$) và **ion âm** (đi về anôt $+$).\n• Khi anôt làm bằng kim loại của muối dung dịch (như anôt Cu trong $\\text{CuSO}_4$), xảy ra **hiện tượng dương cực tan** và bình điện phân tuân theo định luật Ôm như điện trở thuần.'
      },
      {
        heading: '2. Định luật Fa-ra-đây về điện phân',
        content:
          '• Khối lượng chất giải phóng ở điện cực: $m = \\frac{1}{F}\\cdot\\frac{A}{n}\\cdot I\\cdot t$, trong đó $F = 96\\,500\\text{ C/mol}$ là hằng số Fa-ra-đây, $A$ là khối lượng mol nguyên tử, $n$ là hóa trị.'
      }
    ],
    keyFormulas: [
      'm = \\frac{1}{F}\\cdot\\frac{A}{n}\\cdot I t \\quad (F = 96\\,500\\text{ C/mol})'
    ],
    ...SIM_PRESETS.electrolysis,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Hạt tải điện trong dung dịch chất điện phân là:',
        options: ['A. Chỉ có êlectron tự do', 'B. Ion dương và ion âm', 'C. Chỉ có ion dương', 'D. Êlectron và lỗ trống'],
        correctIndex: 1,
        explanation: 'Chất điện phân dẫn điện nhờ sự chuyển động có hướng ngược chiều nhau của ion dương và ion âm.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Cho dòng điện không đổi $I = 2\\text{ A}$ chạy qua bình điện phân đựng dung dịch $\\text{AgNO}_3$ với anôt bằng bạc ($A = 108,\\ n = 1$) trong thời gian $16\\text{ phút } 5\\text{ giây}$. Tính khối lượng bạc bám vào catôt.',
        hints: ['Đổi $t = 16\\cdot 60 + 5 = 965\\text{ s}$ — chia rất chẵn cho $F = 96\\,500$.'],
        solutionSteps: [
          'Bước 1: Thời gian $t = 965\\text{ s}$.',
          'Bước 2: $m = \\frac{1}{96500}\\cdot\\frac{108}{1}\\cdot 2\\cdot 965 = 2{,}16\\text{ g}$.'
        ],
        finalAnswer: '$m = 2{,}16\\text{ g}$.'
      }
    ]
  },
  {
    id: 'phys-2006-11-11',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương III: Dòng điện trong các môi trường',
    sourceTag: SRC_11,
    lessonNumber: 11,
    title: 'Bài 11 (2006): Dòng điện trong Chất khí, Chân không & Chất bán dẫn',
    subtitle: 'Iôn hóa chất khí (tia lửa điện, hồ quang), tia catôt trong chân không và bán dẫn n/p – lớp chuyển tiếp p-n của điôt chỉnh lưu',
    description:
      'Tổng hợp cơ chế dẫn điện trong chất khí (không tự lực và tự lực), tia catôt trong ống chân không và tính dẫn điện một chiều của tiếp giáp p–n bán dẫn.',
    theorySections: [
      {
        heading: '1. Dòng điện trong Chất khí & Chân không',
        content:
          '• **Chất khí**: Bình thường là điện môi; khi bị ion hóa tạo **ion dương, ion âm và êlectron tự do**. Phóng điện tự lực gồm tia lửa điện (sét) và hồ quang điện (hàn điện).\n• **Chân không**: Hạt tải điện là **êlectron** phát xạ nhiệt từ catôt nung nóng (tia catôt, dòng điện chỉ đi theo một chiều từ anôt về catôt).'
      },
      {
        heading: '2. Dòng điện trong Chất bán dẫn',
        content:
          '• Hạt tải điện gồm **êlectron dẫn** ($-$) và **lỗ trống** ($+$). Pha tạp chất tạo bán dẫn loại **n** (đa số là êlectron) và bán dẫn loại **p** (đa số là lỗ trống).\n• **Lớp tiếp xúc p–n (điôt bán dẫn)** chỉ cho dòng điện đi qua dễ dàng theo **chiều thuận từ p sang n** (dùng để chỉnh lưu dòng xoay chiều).'
      }
    ],
    keyFormulas: [
      '\\text{Bán dẫn: } \\text{loại } n \\text{ (đa số } e^-\\text{)}, \\quad \\text{loại } p \\text{ (đa số lỗ trống)}',
      '\\text{Điôt } p\\text{-}n: \\text{dẫn điện theo chiều thuận } p \\to n'
    ],
    ...SIM_PRESETS.diode,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Tính chất đặc trưng nhất của lớp chuyển tiếp $p\\text{--}n$ (điôt bán dẫn) là:',
        options: [
          'A. Điện trở rất nhỏ theo mọi chiều',
          'B. Tính dẫn điện chủ yếu theo một chiều (từ $p$ sang $n$)',
          'C. Điện trở suất không phụ thuộc nhiệt độ',
          'D. Chỉ dẫn điện ở chân không'
        ],
        correctIndex: 1,
        explanation: 'Lớp tiếp giáp $p\\text{--}n$ có tính dẫn điện một chiều (dẫn tốt khi phân cực thuận từ $p$ sang $n$), dùng làm điôt chỉnh lưu.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'So sánh hạt tải điện, tính tuân theo định luật Ôm và đặc điểm dòng điện giữa hai môi trường: Kim loại và Điôt bán dẫn $p\\text{--}n$.',
        hints: ['Nêu rõ loại hạt tải điện, đồ thị Vôn–Ampe (tuyến tính vs phi tuyến/một chiều) và chiều dẫn điện.'],
        solutionSteps: [
          'Bước 1: Kim loại có hạt tải điện duy nhất là êlectron tự do; tuân theo định luật Ôm ở nhiệt độ không đổi (đặc tuyến V–A tuyến tính, đối xứng hai chiều).',
          'Bước 2: Bán dẫn có hai loại hạt tải điện là êlectron dẫn và lỗ trống; điôt $p\\text{--}n$ có đặc tuyến phi tuyến và chỉ dẫn điện mạnh theo chiều thuận $p \\to n$.'
        ],
        finalAnswer: 'Kim loại dẫn hai chiều tuyến tính nhờ $e^-$; điôt $p\\text{--}n$ dẫn một chiều phi tuyến nhờ $e^-$ và lỗ trống.'
      }
    ]
  },

  // ==================== CHƯƠNG IV: TỪ TRƯỜNG (Bài 12–14) ====================
  {
    id: 'phys-2006-11-12',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương IV: Từ trường',
    sourceTag: SRC_11,
    lessonNumber: 12,
    title: 'Bài 12 (2006): Từ trường của dòng điện chạy trong dây dẫn có hình dạng đặc biệt',
    subtitle: 'Quy tắc nắm tay phải và công thức cảm ứng từ B của dòng điện thẳng dài, vòng dây tròn và ống dây hình trụ',
    description:
      'Tính độ lớn cảm ứng từ $B$ ($\\text{Tesla}$) do dòng điện thẳng dài, dòng điện tròn và ống dây điện tạo ra; vận dụng nguyên lí chồng chất từ trường $\\vec{B} = \\vec{B}_1 + \\vec{B}_2$.',
    theorySections: [
      {
        heading: '1. Dòng điện thẳng dài & Dòng điện tròn',
        content:
          '• **Dây thẳng dài vô hạn** cách dây đoạn $r$: $B = 2\\cdot 10^{-7}\\frac{I}{r}$ (chiều theo quy tắc nắm tay phải: ngón cái theo chiều $I$, 4 ngón khum chỉ chiều đường sức từ tròn đồng tâm).\n• **Tại tâm vòng dây tròn** bán kính $R$ gồm $N$ vòng: $B = 2\\pi\\cdot 10^{-7}\\frac{N I}{R}$.'
      },
      {
        heading: '2. Từ trường trong lòng ống dây hình trụ',
        content:
          '• Bên trong ống dây dài $l$ gồm $N$ vòng (mật độ vòng $n = N/l$), từ trường đều: $B = 4\\pi\\cdot 10^{-7} n I = 4\\pi\\cdot 10^{-7}\\frac{N}{l} I$.'
      }
    ],
    keyFormulas: [
      'B_{\\text{thẳng}} = 2\\cdot 10^{-7}\\frac{I}{r}, \\quad B_{\\text{tròn}} = 2\\pi\\cdot 10^{-7}\\frac{N I}{R}',
      'B_{\\text{ống dây}} = 4\\pi\\cdot 10^{-7}\\frac{N}{l} I'
    ],
    ...SIM_PRESETS.mag_induction,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Tại điểm cách dây dẫn thẳng dài mang dòng điện $I = 5\\text{ A}$ một khoảng $r = 10\\text{ cm}$ trong không khí, cảm ứng từ có độ lớn là:',
        options: ['A. $10^{-5}\\text{ T}$', 'B. $2\\cdot 10^{-5}\\text{ T}$', 'C. $10^{-7}\\text{ T}$', 'D. $5\\cdot 10^{-6}\\text{ T}$'],
        correctIndex: 0,
        explanation: '$B = 2\\cdot 10^{-7}\\cdot\\frac{5}{0{,}1} = 10^{-5}\\text{ T}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một ống dây hình trụ dài $l = 40\\text{ cm}$ quấn đều $800$ vòng dây, cho dòng điện $I = 2\\text{ A}$ chạy qua. Tính cảm ứng từ bên trong lòng ống dây.',
        hints: ['Đổi $l = 0{,}4\\text{ m}$ và thay vào $B = 4\\pi\\cdot 10^{-7}\\frac{N}{l}I$.'],
        solutionSteps: [
          'Bước 1: Mật độ vòng dây $n = \\frac{800}{0{,}4} = 2000\\text{ vòng/m}$.',
          'Bước 2: $B = 4\\pi\\cdot 10^{-7}\\cdot 2000 \\cdot 2 = 1{,}6\\pi\\cdot 10^{-3} \\approx 5{,}03\\cdot 10^{-3}\\text{ T}$.'
        ],
        finalAnswer: '$B = 1{,}6\\pi\\cdot 10^{-3}\\text{ T} \\approx 5{,}03\\text{ mT}$.'
      }
    ]
  },
  {
    id: 'phys-2006-11-13',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương IV: Từ trường',
    sourceTag: SRC_11,
    lessonNumber: 13,
    title: 'Bài 13 (2006): Lực từ tác dụng lên đoạn dây dẫn mang dòng điện',
    subtitle: 'Quy tắc bàn tay trái, công thức Am-pe F = B·I·l·sinα và mômen ngẫu lực từ tác dụng lên khung dây trong từ trường đều',
    description:
      'Xác định phương, chiều và độ lớn lực từ $F = B I l \\sin\\alpha$ tác dụng lên đoạn dây mang dòng điện đặt trong từ trường đều và tính mômen quay khung dây.',
    theorySections: [
      {
        heading: '1. Lực từ tác dụng lên đoạn dây dẫn mang dòng điện',
        content:
          '• **Điểm đặt**: trung điểm đoạn dây; **phương**: vuông góc với mặt phẳng chứa đoạn dây và vectơ $\\vec{B}$; **chiều**: tuân theo quy tắc bàn tay trái.\n• **Độ lớn**: $F = B I l \\sin\\alpha$, trong đó $\\alpha = (\\vec{B}, \\vec{I})$.'
      },
      {
        heading: '2. Tương tác hai dòng điện song song & Khung dây',
        content:
          '• Hai dòng điện thẳng song song **cùng chiều hút nhau**, **ngược chiều đẩy nhau**.\n• Khung dây diện tích $S$, mang dòng $I$ đặt trong từ trường đều $B$ chịu mômen ngẫu lực từ cực đại $M_{\\max} = I B S$.'
      }
    ],
    keyFormulas: [
      'F = B I l \\sin\\alpha',
      'M = I B S \\sin\\theta \\quad (\\theta = (\\vec{n}, \\vec{B}))'
    ],
    ...SIM_PRESETS.dc_motor,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Một đoạn dây dài $l = 0{,}5\\text{ m}$ mang dòng điện $I = 4\\text{ A}$ đặt hợp với vectơ cảm ứng từ $B = 0{,}2\\text{ T}$ một góc $30^\\circ$. Độ lớn lực từ tác dụng lên đoạn dây là:',
        options: ['A. $0{,}4\\text{ N}$', 'B. $0{,}2\\text{ N}$', 'C. $0{,}2\\sqrt{3}\\text{ N}$', 'D. $0{,}1\\text{ N}$'],
        correctIndex: 1,
        explanation: '$F = B I l \\sin 30^\\circ = 0{,}2 \\cdot 4 \\cdot 0{,}5 \\cdot 0{,}5 = 0{,}2\\text{ N}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một thanh kim loại dài $l = 20\\text{ cm}$, khối lượng $m = 10\\text{ g}$ được treo nằm ngang bằng hai sợi dây mảnh đặt trong từ trường đều thẳng đứng có $B = 0{,}1\\text{ T}$ ($g = 10\\text{ m/s}^2$). Cho dòng điện $I = 5\\text{ A}$ chạy qua thanh. Tính góc lệch $\\theta$ của dây treo so với phương thẳng đứng khi thanh cân bằng.',
        hints: ['Lực từ nằm ngang $\\vec{F}$ và trọng lực $\\vec{P}$ thẳng đứng cân bằng với lực căng dây: $\\tan\\theta = F/P$.'],
        solutionSteps: [
          'Bước 1: Lực từ nằm ngang $F = B I l = 0{,}1 \\cdot 5 \\cdot 0{,}2 = 0{,}1\\text{ N}$.',
          'Bước 2: Trọng lực $P = mg = 0{,}01 \\cdot 10 = 0{,}1\\text{ N}$.',
          'Bước 3: $\\tan\\theta = \\frac{F}{P} = \\frac{0{,}1}{0{,}1} = 1 \\Rightarrow \\theta = 45^\\circ$.'
        ],
        finalAnswer: '$\\theta = 45^\\circ$.'
      }
    ]
  },
  {
    id: 'phys-2006-11-14',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương IV: Từ trường',
    sourceTag: SRC_11,
    lessonNumber: 14,
    title: 'Bài 14 (2006): Lực Lo-ren-xơ & Chuyển động hạt tích điện trong từ trường',
    subtitle: 'Công thức lực Lo-ren-xơ f = |q|vB sinα, quy tắc bàn tay trái (lưu ý điện tích âm q < 0) và bán kính quỹ đạo tròn R = mv/(|q|B)',
    description:
      'Xác định chiều và độ lớn lực Lo-ren-xơ tác dụng lên hạt mang điện chuyển động trong từ trường đều; chứng minh lực Lo-ren-xơ không sinh công và tính bán kính quỹ đạo tròn $R = \\frac{mv}{|q|B}$.',
    theorySections: [
      {
        heading: '1. Lực Lo-ren-xơ',
        content:
          '• Mọi hạt điện tích $q$ chuyển động với vận tốc $\\vec{v}$ trong từ trường $\\vec{B}$ chịu tác dụng của **lực Lo-ren-xơ**: $f = |q| v B \\sin\\alpha$.\n• **Quy tắc bàn tay trái**: $\\vec{B}$ đâm vào lòng bàn tay, chiều từ cổ tay đến ngón giữa theo chiều $\\vec{v}$; ngón cái choãi $90^\\circ$ chỉ chiều lực $\\vec{f}$ nếu $q > 0$, và **ngược lại** nếu $q < 0$.'
      },
      {
        heading: '2. Chuyển động tròn của hạt tích điện',
        content:
          '• Khi $\\vec{v} \\perp \\vec{B}$, lực Lo-ren-xơ luôn vuông góc vận tốc (không sinh công, độ lớn $v$ không đổi) đóng vai trò lực hướng tâm: $|q|vB = \\frac{m v^2}{R} \\Rightarrow R = \\frac{m v}{|q| B}$.'
      }
    ],
    keyFormulas: [
      'f = |q| v B \\sin\\alpha',
      'R = \\frac{m v}{|q| B}, \\quad T = \\frac{2\\pi m}{|q| B}'
    ],
    ...SIM_PRESETS.hall_lorentz,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Một prôtôn ($q = 1{,}6\\cdot 10^{-19}\\text{ C}$) bay vào từ trường đều $B = 0{,}5\\text{ T}$ theo phương vuông góc với đường sức với tốc độ $v = 2\\cdot 10^6\\text{ m/s}$. Độ lớn lực Lo-ren-xơ tác dụng lên prôtôn là:',
        options: ['A. $1{,}6\\cdot 10^{-13}\\text{ N}$', 'B. $3{,}2\\cdot 10^{-13}\\text{ N}$', 'C. $0{,}8\\cdot 10^{-13}\\text{ N}$', 'D. $0\\text{ N}$'],
        correctIndex: 0,
        explanation: '$f = |q| v B \\sin 90^\\circ = 1{,}6\\cdot 10^{-19} \\cdot 2\\cdot 10^6 \\cdot 0{,}5 = 1{,}6\\cdot 10^{-13}\\text{ N}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một êlectron ($m = 9{,}1\\cdot 10^{-31}\\text{ kg},\\ |q| = 1{,}6\\cdot 10^{-19}\\text{ C}$) bay vuông góc vào từ trường đều $B = 9{,}1\\cdot 10^{-4}\\text{ T}$ với tốc độ $v = 1{,}6\\cdot 10^6\\text{ m/s}$. Tính bán kính quỹ đạo tròn và chu kì quay của êlectron.',
        hints: ['Thay vào $R = \\frac{mv}{|q|B}$ và $T = \\frac{2\\pi R}{v}$.'],
        solutionSteps: [
          'Bước 1: $R = \\frac{9{,}1\\cdot 10^{-31}\\cdot 1{,}6\\cdot 10^6}{1{,}6\\cdot 10^{-19}\\cdot 9{,}1\\cdot 10^{-4}} = 10^{-2}\\text{ m} = 1\\text{ cm}$.',
          'Bước 2: Chu kì quay $T = \\frac{2\\pi R}{v} = \\frac{2\\pi\\cdot 10^{-2}}{1{,}6\\cdot 10^6} \\approx 3{,}93\\cdot 10^{-8}\\text{ s}$.'
        ],
        finalAnswer: '$R = 1\\text{ cm}$; $T \\approx 3{,}93\\cdot 10^{-8}\\text{ s}$.'
      }
    ]
  },

  // ==================== CHƯƠNG V: CẢM ỨNG ĐIỆN TỪ (Bài 15–16) ====================
  {
    id: 'phys-2006-11-15',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương V: Cảm ứng điện từ',
    sourceTag: SRC_11,
    lessonNumber: 15,
    title: 'Bài 15 (2006): Từ thông & Hiện tượng Cảm ứng điện từ (Định luật Fa-ra-đây – Len-xơ)',
    subtitle: 'Từ thông Φ = BS cosα, quy tắc xác định chiều dòng cảm ứng theo định luật Len-xơ và suất điện động cảm ứng e_c = -ΔΦ/Δt',
    description:
      'Tính từ thông qua khung dây có $N$ vòng, vận dụng định luật Len-xơ xác định chiều dòng cảm ứng chống lại nguyên nhân sinh ra nó và định luật Fa-ra-đây tính $|e_c|$.',
    theorySections: [
      {
        heading: '1. Từ thông & Định luật Len-xơ',
        content:
          '• **Từ thông** qua diện tích $S$ gồm $N$ vòng dây đặt trong từ trường đều $\\vec{B}$: $\\Phi = N B S \\cos\\alpha$ (Vêbe, $\\text{Wb}$), với $\\alpha = (\\vec{n}, \\vec{B})$.\n• **Định luật Len-xơ**: Dòng điện cảm ứng xuất hiện trong mạch kín có chiều sao cho từ trường do nó sinh ra có tác dụng **chống lại sự biến thiên của từ thông ban đầu** qua mạch kín.'
      },
      {
        heading: '2. Định luật Fa-ra-đây về suất điện động cảm ứng',
        content:
          '• Độ lớn suất điện động cảm ứng xuất hiện trong mạch kín tỉ lệ với tốc độ biến thiên từ thông qua mạch: $e_c = -\\frac{\\Delta\\Phi}{\\Delta t}$; $|e_c| = \\left|\\frac{\\Delta\\Phi}{\\Delta t}\\right| = N\\left|\\frac{\\Delta(B S \\cos\\alpha)}{\\Delta t}\\right|$.'
      }
    ],
    keyFormulas: [
      '\\Phi = N B S \\cos\\alpha \\text{ (Wb)}',
      'e_c = -\\frac{\\Delta\\Phi}{\\Delta t}, \\quad |e_c| = \\left|\\frac{\\Delta\\Phi}{\\Delta t}\\right|'
    ],
    ...SIM_PRESETS.mag_faraday,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Một khung dây phẳng diện tích $S = 20\\text{ cm}^2$ gồm $10$ vòng đặt vuông góc với đường sức của từ trường đều. Trong $0{,}2\\text{ s}$, cảm ứng từ tăng đều từ $0{,}1\\text{ T}$ lên $0{,}5\\text{ T}$. Độ lớn suất điện động cảm ứng trong khung bằng:',
        options: ['A. $0{,}04\\text{ V}$', 'B. $0{,}4\\text{ V}$', 'C. $0{,}004\\text{ V}$', 'D. $4\\text{ V}$'],
        correctIndex: 0,
        explanation: '$\\Delta\\Phi = N S \\Delta B \\cos 0^\\circ = 10 \\cdot 20\\cdot 10^{-4} \\cdot (0{,}5 - 0{,}1) = 8\\cdot 10^{-3}\\text{ Wb} \\Rightarrow |e_c| = \\frac{8\\cdot 10^{-3}}{0{,}2} = 0{,}04\\text{ V}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một khung dây tròn gồm $50$ vòng, bán kính $10\\text{ cm}$, điện trở $R = 2\\,\\Omega$, đặt trong từ trường đều sao cho mặt phẳng khung hợp với $\\vec{B}$ góc $30^\\circ$. Trong $0{,}1\\text{ s}$, cảm ứng từ giảm đều từ $0{,}4\\text{ T}$ về $0$. Tính độ lớn suất điện động cảm ứng và cường độ dòng điện cảm ứng.',
        hints: ['Lưu ý góc $\\alpha = (\\vec{n}, \\vec{B}) = 90^\\circ - 30^\\circ = 60^\\circ$, và $S = \\pi r^2$.'],
        solutionSteps: [
          'Bước 1: $S = \\pi (0{,}1)^2 = 0{,}01\\pi\\text{ m}^2$; $\\alpha = 60^\\circ \\Rightarrow \\cos 60^\\circ = 0{,}5$.',
          'Bước 2: $|\\Delta\\Phi| = N S |\\Delta B|\\cos 60^\\circ = 50 \\cdot 0{,}01\\pi \\cdot 0{,}4 \\cdot 0{,}5 = 0{,}1\\pi\\text{ Wb}$.',
          'Bước 3: $|e_c| = \\frac{0{,}1\\pi}{0{,}1} = \\pi \\approx 3{,}14\\text{ V}$; $I_c = \\frac{|e_c|}{R} = \\frac{\\pi}{2} \\approx 1{,}57\\text{ A}$.'
        ],
        finalAnswer: '$|e_c| \\approx 3{,}14\\text{ V}$; $I_c \\approx 1{,}57\\text{ A}$.'
      }
    ]
  },
  {
    id: 'phys-2006-11-16',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương V: Cảm ứng điện từ',
    sourceTag: SRC_11,
    lessonNumber: 16,
    title: 'Bài 16 (2006): Tự cảm, Độ tự cảm L & Năng lượng từ trường ống dây',
    subtitle: 'Từ thông riêng Φ = Li, độ tự cảm ống dây L = 4π·10⁻⁷(N²/l)S, suất điện động tự cảm e_tc = -L(Δi/Δt) và năng lượng W = ½Li²',
    description:
      'Giải thích hiện tượng tia lửa điện khi ngắt cầu dao do suất điện động tự cảm lớn, tính độ tự cảm của ống dây dài và năng lượng từ trường tích lũy trong cuộn cảm.',
    theorySections: [
      {
        heading: '1. Hiện tượng tự cảm & Suất điện động tự cảm',
        content:
          '• **Từ thông riêng** của một mạch kín mang dòng điện $i$: $\\Phi = L\\cdot i$, trong đó $L$ là **độ tự cảm** (Henry, $\\text{H}$). Với ống dây dài $l$, tiết diện $S$, gồm $N$ vòng: $L = 4\\pi\\cdot 10^{-7}\\frac{N^2}{l} S$.\n• **Hiện tượng tự cảm** xảy ra khi cường độ dòng điện trong chính mạch đó biến thiên, sinh ra **suất điện động tự cảm**: $e_{tc} = -L\\frac{\\Delta i}{\\Delta t}$.'
      },
      {
        heading: '2. Năng lượng từ trường của ống dây',
        content:
          '• Khi có dòng điện $i$ chạy qua cuộn cảm độ tự cảm $L$, trong ống dây tích lũy một **năng lượng từ trường**: $W = \\frac{1}{2} L i^2$.'
      }
    ],
    keyFormulas: [
      'L = 4\\pi\\cdot 10^{-7}\\frac{N^2}{l} S \\text{ (H)}, \\quad e_{tc} = -L\\frac{\\Delta i}{\\Delta t}',
      'W = \\frac{1}{2} L i^2'
    ],
    ...SIM_PRESETS.mag_induction,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Một cuộn dây có độ tự cảm $L = 0{,}2\\text{ H}$. Trong thời gian $\\Delta t = 0{,}05\\text{ s}$, dòng điện qua cuộn dây giảm đều từ $3\\text{ A}$ xuống $1\\text{ A}$. Độ lớn suất điện động tự cảm trong cuộn dây là:',
        options: ['A. $8\\text{ V}$', 'B. $4\\text{ V}$', 'C. $16\\text{ V}$', 'D. $0{,}8\\text{ V}$'],
        correctIndex: 0,
        explanation: '$|e_{tc}| = L\\frac{|\\Delta i|}{\\Delta t} = 0{,}2\\cdot\\frac{2}{0{,}05} = 8\\text{ V}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một ống dây dài $l = 50\\text{ cm}$, tiết diện $S = 20\\text{ cm}^2$, gồm $1000$ vòng dây, cho dòng điện $I = 2\\text{ A}$ chạy qua. Tính độ tự cảm $L$ của ống dây và năng lượng từ trường tích trữ trong ống dây.',
        hints: ['Đổi $l = 0{,}5\\text{ m}$, $S = 2\\cdot 10^{-3}\\text{ m}^2$; tính $L = 4\\pi\\cdot 10^{-7}\\frac{N^2}{l}S$ rồi $W = \\frac{1}{2}LI^2$.'],
        solutionSteps: [
          'Bước 1: $L = 4\\pi\\cdot 10^{-7}\\cdot\\frac{1000^2}{0{,}5}\\cdot 2\\cdot 10^{-3} = 1{,}6\\pi\\cdot 10^{-3} \\approx 5{,}03\\cdot 10^{-3}\\text{ H}$.',
          'Bước 2: $W = \\frac{1}{2} L I^2 = \\frac{1}{2}\\cdot 5{,}03\\cdot 10^{-3}\\cdot 2^2 \\approx 0{,}01\\text{ J}$.'
        ],
        finalAnswer: '$L \\approx 5{,}03\\text{ mH}$; $W \\approx 0{,}01\\text{ J}$.'
      }
    ]
  },

  // ==================== CHƯƠNG VI & VII: KHÚC XẠ ÁNH SÁNG & MẮT - CÁC DỤNG CỤ QUANG (Bài 17–20) ====================
  {
    id: 'phys-2006-11-17',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương VI: Khúc xạ ánh sáng',
    sourceTag: SRC_11,
    lessonNumber: 17,
    title: 'Bài 17 (2006): Định luật Khúc xạ ánh sáng & Hiện tượng Phản xạ toàn phần',
    subtitle: 'Chiết suất tuyệt đối – tỉ đối, công thức n₁ sin i = n₂ sin r và điều kiện phản xạ toàn phần n₁ > n₂, i ≥ i_gh (cáp quang)',
    description:
      'Vận dụng định luật khúc xạ ánh sáng $n_1\\sin i = n_2\\sin r$, xác định góc giới hạn phản xạ toàn phần $\\sin i_{gh} = n_2/n_1$ và hiểu nguyên lí truyền tín hiệu trong sợi cáp quang.',
    theorySections: [
      {
        heading: '1. Định luật khúc xạ ánh sáng & Chiết suất',
        content:
          '• **Định luật khúc xạ**: Tia khúc xạ nằm trong mặt phẳng tới và ở bên kia pháp tuyến so với tia tới; đối với hai môi trường nhất định: $n_1 \\sin i = n_2 \\sin r$.\n• Chiết suất tuyệt đối $n = \\frac{c}{v} \\ge 1$; chiết suất tỉ đối $n_{21} = \\frac{n_2}{n_1}$.'
      },
      {
        heading: '2. Hiện tượng phản xạ toàn phần',
        content:
          '• Khi ánh sáng đi từ môi trường chiết quang hơn sang môi trường chiết quang kém ($n_1 > n_2$) và góc tới $i \\ge i_{gh}$ với $\\sin i_{gh} = \\frac{n_2}{n_1}$, toàn bộ tia sáng bị phản xạ trở lại môi trường tới (ứng dụng trong **cáp quang**, nội soi y khoa).'
      }
    ],
    keyFormulas: [
      'n_1 \\sin i = n_2 \\sin r, \\quad n = \\frac{c}{v}',
      '\\text{Phản xạ toàn phần: } n_1 > n_2 \\text{ và } i \\ge i_{gh} \\text{ với } \\sin i_{gh} = \\frac{n_2}{n_1}'
    ],
    ...SIM_PRESETS.fiber_optic,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Chiếu một tia sáng từ thủy tinh ($n_1 = 1{,}5$) ra không khí ($n_2 = 1$). Góc giới hạn phản xạ toàn phần $i_{gh}$ gần nhất với giá trị nào?',
        options: ['A. $41{,}8^\\circ$', 'B. $48{,}6^\\circ$', 'C. $30^\\circ$', 'D. $60^\\circ$'],
        correctIndex: 0,
        explanation: '$\\sin i_{gh} = \\frac{1}{1{,}5} = \\frac{2}{3} \\Rightarrow i_{gh} \\approx 41{,}8^\\circ$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Chiếu tia sáng từ không khí vào mặt nước ($n = \\frac{4}{3}$) dưới góc tới $i = 60^\\circ$. Tính góc khúc xạ $r$ và góc lệch $D = |i - r|$ giữa tia tới và tia khúc xạ.',
        hints: ['Dùng $1\\cdot\\sin 60^\\circ = \\frac{4}{3}\\sin r$.'],
        solutionSteps: [
          'Bước 1: $\\sin r = \\frac{\\sin 60^\\circ}{4/3} = \\frac{3\\sqrt{3}}{8} \\approx 0{,}6495 \\Rightarrow r \\approx 40{,}5^\\circ$.',
          'Bước 2: Góc lệch $D = 60^\\circ - 40{,}5^\\circ = 19{,}5^\\circ$.'
        ],
        finalAnswer: '$r \\approx 40{,}5^\\circ$; góc lệch $D \\approx 19{,}5^\\circ$.'
      }
    ]
  },
  {
    id: 'phys-2006-11-18',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương VII: Mắt & Các dụng cụ quang',
    sourceTag: SRC_11,
    lessonNumber: 18,
    title: 'Bài 18 (2006): Lăng kính & Thấu kính mỏng – Công thức Thấu kính (Quy ước dấu)',
    subtitle: 'Hệ công thức lăng kính, độ tụ D = 1/f = (n - 1)(1/R₁ + 1/R₂), công thức thấu kính 1/f = 1/d + 1/d\' và độ phóng đại k = -d\'/d',
    description:
      'Tính góc lệch qua lăng kính, độ tụ của thấu kính mỏng trong không khí và sử dụng quy ước dấu đại số giải bài toán ghép/tạo ảnh của thấu kính hội tụ và phân kì.',
    theorySections: [
      {
        heading: '1. Lăng kính',
        content:
          '• Khối chất trong suốt hình lăng trụ tam giác. Hệ thức lăng kính: $\\sin i_1 = n\\sin r_1$, $\\sin i_2 = n\\sin r_2$, $A = r_1 + r_2$, góc lệch $D = i_1 + i_2 - A$.'
      },
      {
        heading: '2. Công thức thấu kính mỏng (Quy ước dấu 2006)',
        content:
          '• **Độ tụ**: $D = \\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} + \\frac{1}{R_2}\\right)$ (điôp, $\\text{dp}$; $f$ tính bằng mét).\n• Thấu kính hội tụ: $f > 0, D > 0$; phân kì: $f < 0, D < 0$.\n• Công thức vị trí ảnh: $\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}$ ($d > 0$ vật thật; $d\' > 0$ ảnh thật; $d\' < 0$ ảnh ảo).\n• **Số phóng đại**: $k = -\\frac{d\'}{d}$ ($k > 0$ ảnh cùng chiều vật; $k < 0$ ảnh ngược chiều vật).'
      }
    ],
    keyFormulas: [
      'D = \\frac{1}{f} \\text{ (dp)}, \\quad \\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}',
      'k = -\\frac{d\'}{d} = \\frac{f}{f - d}'
    ],
    ...SIM_PRESETS.prism,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Đặt vật thật cách thấu kính hội tụ có độ tụ $D = +5\\text{ dp}$ một khoảng $d = 30\\text{ cm}$. Vị trí và tính chất ảnh là:',
        options: [
          'A. Ảnh thật cách thấu kính $60\\text{ cm}$, $k = -2$',
          'B. Ảnh ảo cách thấu kính $60\\text{ cm}$, $k = +2$',
          'C. Ảnh thật cách thấu kính $12\\text{ cm}$, $k = -0{,}4$',
          'D. Ảnh ảo cách thấu kính $12\\text{ cm}$, $k = +0{,}4$'
        ],
        correctIndex: 0,
        explanation: '$f = 1/5 = 0{,}2\\text{ m} = 20\\text{ cm}$. $d\' = \\frac{df}{d-f} = \\frac{30\\cdot 20}{30-20} = +60\\text{ cm}$ (ảnh thật); $k = -60/30 = -2$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Vật sáng $AB$ đặt trước một thấu kính hội tụ tiêu cự $f = 20\\text{ cm}$ cho một ảnh thật cao gấp $2$ lần vật. Tìm khoảng cách từ vật đến thấu kính và khoảng cách giữa vật và ảnh.',
        hints: ['Ảnh thật ngược chiều nên $k = -2 = -d\'/d \\Rightarrow d\' = 2d$.'],
        solutionSteps: [
          'Bước 1: Ảnh thật ngược chiều với vật nên $k = -2 \\Rightarrow -\\frac{d\'}{d} = -2 \\Rightarrow d\' = 2d$.',
          'Bước 2: $\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{2d} = \\frac{3}{2d} \\Rightarrow d = \\frac{3}{2}f = 30\\text{ cm}$.',
          'Bước 3: $d\' = 60\\text{ cm}$; khoảng cách vật–ảnh $L = d + d\' = 90\\text{ cm}$.'
        ],
        finalAnswer: '$d = 30\\text{ cm}$; khoảng cách vật và ảnh $90\\text{ cm}$.'
      }
    ]
  },
  {
    id: 'phys-2006-11-19',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương VII: Mắt & Các dụng cụ quang',
    sourceTag: SRC_11,
    lessonNumber: 19,
    title: 'Bài 19 (2006): Mắt, Sự điều tiết & Sửa tật Cận thị, Viễn thị, Lão thị',
    subtitle: 'Khoảng nhìn rõ C_c đến C_v, năng suất phân li của mắt, công thức tính độ tụ kính cận và kính viễn/lão',
    description:
      'Phân tích cơ chế điều tiết của mắt bình thường ($C_c \\approx 25\\text{ cm},\\ C_v = \\infty$) và tính chính xác tiêu cự, độ tụ kính đeo sát hoặc cách mắt cho người cận thị và viễn thị.',
    theorySections: [
      {
        heading: '1. Cấu tạo quang học của mắt & Sự điều tiết',
        content:
          '• Khoảng cách từ quang tâm mắt đến võng mạc $OV$ không đổi; mắt thay đổi độ cong (tiêu cự) của thể thủy tinh để ảnh luôn hiện rõ trên võng mạc gọi là **sự điều tiết**.\n• Mắt không có tật có $OC_V = \\infty$ và $OC_C \\approx 25\\text{ cm}$; năng suất phân li của mắt $\\varepsilon_{\\min} \\approx 1\' \\approx 3\\cdot 10^{-4}\\text{ rad}$.'
      },
      {
        heading: '2. Các tật của mắt và cách khắc phục',
        content:
          '• **Mắt cận**: $f_{\\max} < OV$, $OC_V$ hữu hạn. Sửa bằng **thấu kính phân kì** sao cho ảnh của vật ở vô cực hiện tại $C_V$: $f_k = -(OC_V - l)$ (nếu đeo sát mắt $l=0$ thì $f_k = -OC_V$).\n• **Mắt viễn / mắt lão**: $f_{\\max} > OV$ (nhìn vô cực phải điều tiết; $OC_C$ xa hơn $25\\text{ cm}$). Sửa bằng **thấu kính hội tụ** để đưa điểm gần nhất về $25\\text{ cm}$ (với kính đeo sát: $d = 25\\text{ cm},\\ d\' = -OC_C$).'
      }
    ],
    keyFormulas: [
      '\\text{Kính cận (sát mắt): } f_k = -OC_V \\Rightarrow D_k = -\\frac{1}{OC_V}',
      '\\text{Kính viễn đọc sách ở } d: \\frac{1}{f_k} = \\frac{1}{d} - \\frac{1}{OC_C}'
    ],
    ...SIM_PRESETS.eye_optics,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Một người cận thị có điểm cực viễn cách mắt $50\\text{ cm}$. Để nhìn rõ vật ở vô cực mà mắt không phải điều tiết khi đeo kính sát mắt, người này cần đeo kính có độ tụ:',
        options: ['A. $+2\\text{ dp}$', 'B. $-2\\text{ dp}$', 'C. $-0{,}5\\text{ dp}$', 'D. $+0{,}5\\text{ dp}$'],
        correctIndex: 1,
        explanation: '$f_k = -OC_V = -0{,}5\\text{ m} \\Rightarrow D_k = \\frac{1}{-0{,}5} = -2\\text{ dp}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một người viễn thị có điểm cực cận cách mắt $50\\text{ cm}$ muốn đọc trang sách đặt cách mắt $25\\text{ cm}$. Tính độ tụ của kính cần đeo (kính đeo sát mắt).',
        hints: ['Vật đặt ở $d = 0{,}25\\text{ m}$ cho ảnh ảo tại cực cận $d\' = -0{,}5\\text{ m}$.'],
        solutionSteps: [
          'Bước 1: $d = 25\\text{ cm} = 0{,}25\\text{ m}$; ảnh ảo ở cực cận nên $d\' = -50\\text{ cm} = -0{,}5\\text{ m}$.',
          'Bước 2: Độ tụ $D = \\frac{1}{f} = \\frac{1}{0{,}25} + \\frac{1}{-0{,}5} = 4 - 2 = +2\\text{ dp}$.'
        ],
        finalAnswer: 'Đeo thấu kính hội tụ độ tụ $D = +2\\text{ dp}$.'
      }
    ]
  },
  {
    id: 'phys-2006-11-20',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'Vật lí 11 (2006) · Chương VII: Mắt & Các dụng cụ quang',
    sourceTag: SRC_11,
    lessonNumber: 20,
    title: 'Bài 20 (2006): Kính lúp, Kính hiển vi & Kính thiên văn (Ngắm chừng vô cực)',
    subtitle: 'Số bội giác G = α / α₀, kính lúp G_∞ = Đ/f, kính hiển vi G_∞ = (δ·Đ)/(f₁f₂) và kính thiên văn G_∞ = f₁/f₂',
    description:
      'Hiểu nguyên lí quang học của các dụng cụ bổ trợ cho mắt, nắm vững công thức số bội giác khi ngắm chừng ở vô cực của kính lúp, kính hiển vi và kính thiên văn.',
    theorySections: [
      {
        heading: '1. Kính lúp & Kính hiển vi',
        content:
          '• **Số bội giác**: $G = \\frac{\\alpha}{\\alpha_0} \\approx \\frac{\\tan\\alpha}{\\tan\\alpha_0}$.\n• **Kính lúp**: ngắm chừng ở vô cực (vật đặt tại tiêu điểm vật $F$): $G_\\infty = \\frac{\\text{Đ}}{f}$ (với $\\text{Đ} = OC_C \\approx 25\\text{ cm}$).\n• **Kính hiển vi**: gồm vật kính tiêu cự rất ngắn $f_1$ và thị kính $f_2$ đặt cách nhau độ dài quang học $\\delta = l - f_1 - f_2$. Ngắm chừng ở vô cực: $G_\\infty = |k_1| G_2 = \\frac{\\delta \\cdot \\text{Đ}}{f_1 f_2}$.'
      },
      {
        heading: '2. Kính thiên văn',
        content:
          '• Gồm vật kính có tiêu cự lớn $f_1$ và thị kính có tiêu cự nhỏ $f_2$. Khi ngắm chừng ở vô cực, khoảng cách giữa vật kính và thị kính là $O_1 O_2 = f_1 + f_2$ và số bội giác là: $G_\\infty = \\frac{f_1}{f_2}$.'
      }
    ],
    keyFormulas: [
      '\\text{Kính lúp: } G_\\infty = \\frac{\\text{Đ}}{f}; \\quad \\text{Kính hiển vi: } G_\\infty = \\frac{\\delta\\cdot\\text{Đ}}{f_1 f_2}',
      '\\text{Kính thiên văn: } G_\\infty = \\frac{f_1}{f_2}, \\quad O_1 O_2 = f_1 + f_2'
    ],
    ...SIM_PRESETS.telescope,
    practiceExercises: [
      {
        source: SRC_11,
        question: 'Một kính thiên văn có vật kính tiêu cự $f_1 = 1{,}2\\text{ m}$ và thị kính tiêu cự $f_2 = 4\\text{ cm}$. Khi người mắt tốt ngắm chừng ở vô cực, khoảng cách giữa hai kính và số bội giác là:',
        options: [
          'A. $124\\text{ cm};\\ G_\\infty = 30$',
          'B. $116\\text{ cm};\\ G_\\infty = 30$',
          'C. $124\\text{ cm};\\ G_\\infty = 0{,}3$',
          'D. $4{,}8\\text{ m};\\ G_\\infty = 48$'
        ],
        correctIndex: 0,
        explanation: '$O_1 O_2 = f_1 + f_2 = 120 + 4 = 124\\text{ cm}$; $G_\\infty = \\frac{120}{4} = 30$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_11,
        question: 'Một kính hiển vi có vật kính tiêu cự $f_1 = 0{,}8\\text{ cm}$, thị kính tiêu cự $f_2 = 2\\text{ cm}$, khoảng cách giữa vật kính và thị kính là $18{,}8\\text{ cm}$. Một người mắt tốt ($\\text{Đ} = 25\\text{ cm}$) ngắm chừng ở vô cực. Tính độ dài quang học $\\delta$ và số bội giác $G_\\infty$.',
        hints: ['Tính $\\delta = O_1 O_2 - f_1 - f_2$, sau đó thay vào $G_\\infty = \\frac{\\delta \\cdot \\text{Đ}}{f_1 f_2}$.'],
        solutionSteps: [
          'Bước 1: Độ dài quang học $\\delta = 18{,}8 - 0{,}8 - 2 = 16\\text{ cm}$.',
          'Bước 2: Số bội giác $G_\\infty = \\frac{16 \\cdot 25}{0{,}8 \\cdot 2} = 250$.'
        ],
        finalAnswer: '$\\delta = 16\\text{ cm}$; $G_\\infty = 250$.'
      }
    ]
  }
];
