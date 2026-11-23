import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const SRC_9 = 'GDPT 2006 · Vật lí 9 (NXB Giáo dục Việt Nam)';

export const PHYSICS_GDPT_2006_GRADE_9: PhysicsLesson[] = [
  // ==================== CHƯƠNG I: ĐIỆN HỌC (Bài 1–5) ====================
  {
    id: 'phys-2006-9-1',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương I: Điện học',
    sourceTag: SRC_9,
    lessonNumber: 1,
    title: 'Bài 1 (2006): Sự phụ thuộc của I vào U & Định luật Ôm',
    subtitle: 'Cường độ dòng điện, hiệu điện thế, quy ước chiều dòng điện từ cực dương (+) sang cực âm (-) và định luật Ôm',
    description:
      'Khảo sát đồ thị I–U qua vật dẫn, phát biểu định luật Ôm $I = \\frac{U}{R}$ và ý nghĩa đại lượng điện trở $R$ đặc trưng cho mức độ cản trở dòng điện.',
    theorySections: [
      {
        heading: '1. Quy ước chiều dòng điện & Sự phụ thuộc I vào U',
        content:
          '• **Chiều dòng điện quy ước**: Đi từ **cực dương $(+)$** của nguồn điện qua dây dẫn và các dụng cụ điện tới **cực âm $(-)$** của nguồn điện.\n• Cường độ dòng điện chạy qua một dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây dẫn đó; đồ thị biểu diễn $I$ theo $U$ là một đường thẳng đi qua gốc tọa độ.'
      },
      {
        heading: '2. Định luật Ôm',
        content:
          '• Thương số $R = \\frac{U}{I}$ không đổi đối với mỗi dây dẫn và gọi là **điện trở** của dây dẫn (đơn vị: Ôm, $\\Omega$).\n• **Định luật Ôm**: Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở của dây: $I = \\frac{U}{R}$.'
      }
    ],
    keyFormulas: [
      'I = \\frac{U}{R} \\Rightarrow U = I \\cdot R, \\quad R = \\frac{U}{I}',
      '1\\text{ k}\\Omega = 10^3\\,\\Omega, \\quad 1\\text{ M}\\Omega = 10^6\\,\\Omega'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Đặt hiệu điện thế $U = 12\\text{ V}$ vào hai đầu một điện trở $R = 24\\,\\Omega$. Cường độ dòng điện chạy qua điện trở là:',
        options: ['A. $0{,}5\\text{ A}$', 'B. $2\\text{ A}$', 'C. $288\\text{ A}$', 'D. $12\\text{ A}$'],
        correctIndex: 0,
        explanation: 'Áp dụng định luật Ôm: $I = \\frac{U}{R} = \\frac{12}{24} = 0{,}5\\text{ A}$.'
      },
      {
        source: SRC_9,
        question: 'Khi hiệu điện thế đặt vào hai đầu một dây dẫn tăng lên $3$ lần thì cường độ dòng điện qua dây dẫn sẽ:',
        options: ['A. giảm $3$ lần', 'B. tăng $3$ lần', 'C. tăng $9$ lần', 'D. không đổi'],
        correctIndex: 1,
        explanation: 'Vì $I$ tỉ lệ thuận với $U$ (khi $R$ không đổi) nên $U$ tăng $3$ lần thì $I$ tăng $3$ lần.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Khi đặt hiệu điện thế $U_1 = 6\\text{ V}$ vào hai đầu một dây dẫn, cường độ dòng điện qua dây là $I_1 = 0{,}3\\text{ A}$. Muốn cường độ dòng điện qua dây đạt $I_2 = 0{,}5\\text{ A}$ thì hiệu điện thế cần đặt là bao nhiêu?',
        hints: ['Tính điện trở dây dẫn $R = U_1 / I_1$, sau đó tính $U_2 = I_2 \\cdot R$.'],
        solutionSteps: [
          'Bước 1: Điện trở dây dẫn: $R = \\frac{U_1}{I_1} = \\frac{6}{0{,}3} = 20\\,\\Omega$.',
          'Bước 2: Hiệu điện thế cần đặt: $U_2 = I_2 \\cdot R = 0{,}5 \\cdot 20 = 10\\text{ V}$.'
        ],
        finalAnswer: '$U_2 = 10\\text{ V}$.'
      }
    ]
  },
  {
    id: 'phys-2006-9-2',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương I: Điện học',
    sourceTag: SRC_9,
    lessonNumber: 2,
    title: 'Bài 2 (2006): Điện trở dây dẫn R = ρl/S & Biến trở',
    subtitle: 'Sự phụ thuộc của điện trở vào chiều dài, tiết diện, vật liệu làm dây và cấu tạo biến trở điều chỉnh dòng điện',
    description:
      'Xác định điện trở dây dẫn theo công thức $R = \\rho\\frac{l}{S}$, hiểu ý nghĩa điện trở suất $\\rho$ và nguyên tắc hoạt động của biến trở con chạy.',
    theorySections: [
      {
        heading: '1. Công thức tính điện trở dây dẫn',
        content:
          '• Điện trở của dây dẫn tỉ lệ thuận với chiều dài $l$ của dây, tỉ lệ nghịch với tiết diện $S$ của dây và phụ thuộc vào vật liệu làm dây.\n• Công thức: $R = \\rho\\frac{l}{S}$, với $\\rho$ là điện trở suất ($\\Omega\\cdot\\text{m}$), $l$ ($\\text{m}$), $S$ ($\\text{m}^2$). Vật liệu dẫn điện càng tốt thì $\\rho$ càng nhỏ (ví dụ bạc, đồng).'
      },
      {
        heading: '2. Biến trở & Điện trở dùng trong kĩ thuật',
        content:
          '• **Biến trở** là điện trở có thể thay đổi trị số và dùng để điều chỉnh cường độ dòng điện trong mạch (nhờ thay đổi chiều dài phần dây dẫn có dòng điện chạy qua).\n• Trên điện trở kĩ thuật có ghi trị số hoặc các vòng màu chỉ giá trị $\\Omega$.'
      }
    ],
    keyFormulas: [
      'R = \\rho\\frac{l}{S}',
      'S = \\pi r^2 = \\frac{\\pi d^2}{4}, \\quad 1\\text{ mm}^2 = 10^{-6}\\text{ m}^2'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Một dây đồng dài $l = 100\\text{ m}$, tiết diện $S = 1\\text{ mm}^2 = 10^{-6}\\text{ m}^2$, điện trở suất $\\rho = 1{,}7\\cdot 10^{-8}\\,\\Omega\\cdot\\text{m}$. Điện trở của dây là:',
        options: ['A. $1{,}7\\,\\Omega$', 'B. $17\\,\\Omega$', 'C. $0{,}17\\,\\Omega$', 'D. $170\\,\\Omega$'],
        correctIndex: 0,
        explanation: '$R = \\rho\\frac{l}{S} = 1{,}7\\cdot 10^{-8} \\cdot \\frac{100}{10^{-6}} = 1{,}7\\,\\Omega$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một biến trở con chạy được làm bằng dây hợp kim nikelin có điện trở suất $\\rho = 0{,}4\\cdot 10^{-6}\\,\\Omega\\cdot\\text{m}$, tiết diện đều $S = 0{,}5\\text{ mm}^2$ và điện trở lớn nhất $R_{\\max} = 20\\,\\Omega$. Tính chiều dài dây quấn biến trở.',
        hints: ['Đổi $S = 0{,}5\\cdot 10^{-6}\\text{ m}^2$ và suy ra $l = \\frac{R S}{\\rho}$.'],
        solutionSteps: [
          'Bước 1: Đổi $S = 0{,}5\\text{ mm}^2 = 0{,}5\\cdot 10^{-6}\\text{ m}^2$.',
          'Bước 2: $l = \\frac{R_{\\max} S}{\\rho} = \\frac{20 \\cdot 0{,}5\\cdot 10^{-6}}{0{,}4\\cdot 10^{-6}} = 25\\text{ m}$.'
        ],
        finalAnswer: '$l = 25\\text{ m}$.'
      }
    ]
  },
  {
    id: 'phys-2006-9-3',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương I: Điện học',
    sourceTag: SRC_9,
    lessonNumber: 3,
    title: 'Bài 3 (2006): Đoạn mạch nối tiếp & Đoạn mạch song song',
    subtitle: 'Tính chất cường độ dòng điện, hiệu điện thế và công thức điện trở tương đương của đoạn mạch nối tiếp, song song, hỗn hợp',
    description:
      'Phân tích mạch điện nối tiếp, song song và mạch hỗn hợp quy giản, chứng minh tỉ lệ chia áp $U_1/U_2 = R_1/R_2$ và chia dòng $I_1/I_2 = R_2/R_1$.',
    theorySections: [
      {
        heading: '1. Đoạn mạch mắc nối tiếp',
        content:
          '• Cường độ dòng điện như nhau tại mọi điểm: $I = I_1 = I_2$.\n• Hiệu điện thế tổng: $U = U_1 + U_2$.\n• Điện trở tương đương: $R_{\\text{td}} = R_1 + R_2$. Tỉ số hiệu điện thế: $\\frac{U_1}{U_2} = \\frac{R_1}{R_2}$.'
      },
      {
        heading: '2. Đoạn mạch mắc song song',
        content:
          '• Hiệu điện thế hai đầu mỗi nhánh bằng nhau: $U = U_1 = U_2$.\n• Cường độ dòng điện mạch chính: $I = I_1 + I_2$.\n• Điện trở tương đương: $\\frac{1}{R_{\\text{td}}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\Rightarrow R_{\\text{td}} = \\frac{R_1 R_2}{R_1 + R_2}$. Cường độ dòng điện tỉ lệ nghịch điện trở: $\\frac{I_1}{I_2} = \\frac{R_2}{R_1}$.'
      }
    ],
    keyFormulas: [
      'R_{\\text{nt}} = R_1 + R_2 + \\dots + R_n',
      '\\frac{1}{R_{\\text{ss}}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\Rightarrow R_{\\text{ss}} = \\frac{R_1 R_2}{R_1 + R_2}',
      '\\text{Nối tiếp: } \\frac{U_1}{U_2} = \\frac{R_1}{R_2}; \\quad \\text{Song song: } \\frac{I_1}{I_2} = \\frac{R_2}{R_1}'
    ],
    ...SIM_PRESETS.wheatstone,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Hai điện trở $R_1 = 10\\,\\Omega$ và $R_2 = 15\\,\\Omega$ mắc song song. Điện trở tương đương của đoạn mạch bằng:',
        options: ['A. $25\\,\\Omega$', 'B. $6\\,\\Omega$', 'C. $12{,}5\\,\\Omega$', 'D. $5\\,\\Omega$'],
        correctIndex: 1,
        explanation: '$R_{\\text{td}} = \\frac{10 \\cdot 15}{10 + 15} = \\frac{150}{25} = 6\\,\\Omega$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Cho mạch gồm $R_1 = 4\\,\\Omega$ mắc nối tiếp với cụm $(R_2 \\parallel R_3)$ có $R_2 = 6\\,\\Omega$, $R_3 = 12\\,\\Omega$. Đặt hiệu điện thế $U = 16\\text{ V}$ vào hai đầu mạch. Tính điện trở tương đương và cường độ dòng điện qua mỗi điện trở.',
        hints: ['Tính $R_{23} = \\frac{R_2 R_3}{R_2 + R_3}$, rồi $R_{\\text{td}} = R_1 + R_{23}$, từ đó suy ra $I_1, U_{23}, I_2, I_3$.'],
        solutionSteps: [
          'Bước 1: $R_{23} = \\frac{6 \\cdot 12}{6 + 12} = 4\\,\\Omega \\Rightarrow R_{\\text{td}} = 4 + 4 = 8\\,\\Omega$.',
          'Bước 2: Dòng mạch chính $I_1 = I = \\frac{16}{8} = 2\\text{ A}$.',
          'Bước 3: $U_{23} = I \\cdot R_{23} = 2 \\cdot 4 = 8\\text{ V} \\Rightarrow I_2 = \\frac{8}{6} = \\frac{4}{3}\\text{ A}$, $I_3 = \\frac{8}{12} = \\frac{2}{3}\\text{ A}$.'
        ],
        finalAnswer: '$R_{\\text{td}} = 8\\,\\Omega;\\ I_1 = 2\\text{ A},\\ I_2 = \\frac{4}{3}\\text{ A},\\ I_3 = \\frac{2}{3}\\text{ A}$.'
      }
    ]
  },
  {
    id: 'phys-2006-9-4',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương I: Điện học',
    sourceTag: SRC_9,
    lessonNumber: 4,
    title: 'Bài 4 (2006): Công suất điện & Điện năng – Công của dòng điện',
    subtitle: 'Ý nghĩa số Vôn – Oát trên thiết bị điện, công thức công suất P = UI và công của dòng điện A = Pt, đơn vị kWh',
    description:
      'Tính công suất tiêu thụ điện năng của các dụng cụ điện, đọc chỉ số công tơ điện theo kilôoat giờ ($1\\text{ kWh} = 3{,}6\\cdot 10^6\\text{ J}$) và tính tiền điện sinh hoạt.',
    theorySections: [
      {
        heading: '1. Công suất điện & Số ghi trên dụng cụ',
        content:
          '• Công suất điện của một đoạn mạch bằng tích của hiệu điện thế giữa hai đầu đoạn mạch và cường độ dòng điện qua nó: $\\mathcal{P} = U I = I^2 R = \\frac{U^2}{R}$ (đơn vị: Oát, $\\text{W}$).\n• Số Oát ghi trên mỗi dụng cụ điện cho biết **công suất định mức** khi dụng cụ hoạt động bình thường ở hiệu điện thế định mức.'
      },
      {
        heading: '2. Điện năng & Công của dòng điện',
        content:
          '• Công của dòng điện sản ra trong một đoạn mạch là số đo lượng điện năng mà đoạn mạch đó tiêu thụ để chuyển hóa thành các dạng năng lượng khác: $A = \\mathcal{P} t = U I t$ (đơn vị: Jun, $\\text{J}$).\n• Đơn vị đo điện năng trên công tơ điện là kilôoát giờ: $1\\text{ kWh} = 3\\,600\\,000\\text{ J} = 3{,}6\\cdot 10^6\\text{ J}$.'
      }
    ],
    keyFormulas: [
      '\\mathcal{P} = U I = I^2 R = \\frac{U^2}{R}',
      'A = \\mathcal{P} t = U I t, \\quad 1\\text{ kWh} = 3{,}6\\cdot 10^6\\text{ J}'
    ],
    ...SIM_PRESETS.work_power,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Một bóng đèn ghi $220\\text{ V} - 40\\text{ W}$ được thắp sáng liên tục $5$ giờ mỗi ngày ở hiệu điện thế $220\\text{ V}$. Trong $30$ ngày, lượng điện năng bóng đèn tiêu thụ là:',
        options: ['A. $6\\text{ kWh}$', 'B. $12\\text{ kWh}$', 'C. $0{,}6\\text{ kWh}$', 'D. $200\\text{ kWh}$'],
        correctIndex: 0,
        explanation: '$\\mathcal{P} = 40\\text{ W} = 0{,}04\\text{ kW}$; tổng thời gian $t = 5 \\cdot 30 = 150\\text{ h}$. Điện năng $A = 0{,}04 \\cdot 150 = 6\\text{ kWh}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một bàn là ghi $220\\text{ V} - 1100\\text{ W}$ được sử dụng ở hiệu điện thế $220\\text{ V}$ trong $30$ phút mỗi ngày. Tính điện trở dây đốt nóng, cường độ dòng điện định mức và điện năng tiêu thụ theo kWh trong $30$ ngày.',
        hints: ['Dùng $I = \\mathcal{P}/U$, $R = U/I$, $A = \\mathcal{P} t$ (đổi $\\mathcal{P}$ ra $\\text{kW}$ và $t$ ra giờ).'],
        solutionSteps: [
          'Bước 1: Cường độ dòng điện $I = \\frac{1100}{220} = 5\\text{ A}$; điện trở $R = \\frac{220}{5} = 44\\,\\Omega$.',
          'Bước 2: Thời gian $30$ ngày: $t = 0{,}5 \\cdot 30 = 15\\text{ h}$.',
          'Bước 3: Điện năng $A = 1{,}1\\text{ kW} \\cdot 15\\text{ h} = 16{,}5\\text{ kWh}$.'
        ],
        finalAnswer: '$R = 44\\,\\Omega$; $I = 5\\text{ A}$; $A = 16{,}5\\text{ kWh}$.'
      }
    ]
  },
  {
    id: 'phys-2006-9-5',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương I: Điện học',
    sourceTag: SRC_9,
    lessonNumber: 5,
    title: 'Bài 5 (2006): Định luật Jun–Len-xơ & Sử dụng an toàn, tiết kiệm điện',
    subtitle: 'Nhiệt lượng tỏa ra Q = I²Rt, quy đổi Jun sang Calo (1 cal = 4,18 J), hiệu suất thiết bị đun nóng và an toàn điện',
    description:
      'Phát biểu và vận dụng định luật Jun–Len-xơ tính nhiệt lượng tỏa ra trên dây dẫn, tính hiệu suất ấm điện đun nước và nắm vững quy tắc an toàn khi sử dụng điện.',
    theorySections: [
      {
        heading: '1. Định luật Jun–Len-xơ',
        content:
          '• **Phát biểu**: Nhiệt lượng tỏa ra ở dây dẫn khi có dòng điện chạy qua tỉ lệ thuận với bình phương cường độ dòng điện, với điện trở của dây dẫn và thời gian dòng điện chạy qua.\n• Công thức: $Q = I^2 R t$ ($\\text{J}$). Nếu đo bằng calo ($\\text{cal}$): $Q = 0{,}24 I^2 R t$ ($1\\text{ J} \\approx 0{,}24\\text{ cal}$, $1\\text{ cal} \\approx 4{,}18\\text{ J}$).'
      },
      {
        heading: '2. Hiệu suất thiết bị nhiệt & An toàn điện',
        content:
          '• Khi đun nước bằng ấm điện: nhiệt lượng có ích $Q_{\\text{ci}} = m c \\Delta t$, nhiệt lượng toàn phần $Q_{\\text{tp}} = I^2 R t = \\mathcal{P} t$, hiệu suất $H = \\frac{Q_{\\text{ci}}}{Q_{\\text{tp}}}\\cdot 100\\%$.\n• Luôn nối đất vỏ kim loại của thiết bị, dùng cầu chì/aptomat ngắt mạch tự động, tránh chạm vào mạng điện $220\\text{ V}$ khi chưa ngắt cầu dao.'
      }
    ],
    keyFormulas: [
      'Q = I^2 R t = U I t = \\frac{U^2}{R} t \\text{ (J)}',
      'Q_{\\text{ci}} = m c (t_2 - t_1), \\quad H = \\frac{Q_{\\text{ci}}}{Q_{\\text{tp}}}\\cdot 100\\%'
    ],
    ...SIM_PRESETS.joule_lenz,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Cho dòng điện $I = 2\\text{ A}$ chạy qua điện trở $R = 10\\,\\Omega$ trong thời gian $1$ phút. Nhiệt lượng tỏa ra trên điện trở là:',
        options: ['A. $40\\text{ J}$', 'B. $2400\\text{ J}$', 'C. $1200\\text{ J}$', 'D. $400\\text{ J}$'],
        correctIndex: 1,
        explanation: 'Đổi $t = 60\\text{ s}$. $Q = I^2 R t = 2^2 \\cdot 10 \\cdot 60 = 2400\\text{ J}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một ấm điện ghi $220\\text{ V} - 1000\\text{ W}$ dùng ở hiệu điện thế $220\\text{ V}$ để đun $2\\text{ lít}$ nước từ $20^\\circ\\text{C}$ đến sôi ở $100^\\circ\\text{C}$. Biết $c = 4200\\text{ J/(kg.K)}$ và hiệu suất ấm $H = 80\\%$. Tính thời gian đun sôi nước.',
        hints: ['Tính $Q_{\\text{ci}} = m c \\Delta t$, suy ra $Q_{\\text{tp}} = Q_{\\text{ci}} / H$, rồi $t = Q_{\\text{tp}} / \\mathcal{P}$.'],
        solutionSteps: [
          'Bước 1: $Q_{\\text{ci}} = 2 \\cdot 4200 \\cdot (100 - 20) = 672\\,000\\text{ J}$.',
          'Bước 2: $Q_{\\text{tp}} = \\frac{672\\,000}{0{,}8} = 840\\,000\\text{ J}$.',
          'Bước 3: Thời gian $t = \\frac{840\\,000}{1000} = 840\\text{ s} = 14\\text{ phút}$.'
        ],
        finalAnswer: '$t = 840\\text{ s}$ ($14$ phút).'
      }
    ]
  },

  // ==================== CHƯƠNG II: ĐIỆN TỪ HỌC (Bài 6–10) ====================
  {
    id: 'phys-2006-9-6',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương II: Điện từ học',
    sourceTag: SRC_9,
    lessonNumber: 6,
    title: 'Bài 6 (2006): Nam châm vĩnh cửu, Từ trường & Từ phổ – Đường sức từ',
    subtitle: 'Tương tác giữa hai cực nam châm, từ trường Trái Đất, từ phổ mạt sắt và quy ước chiều đường sức từ',
    description:
      'Khám phá đặc tính hút sắt, định hướng Bắc–Nam của nam châm, cách nhận biết từ trường bằng kim nam châm thử và hình ảnh đường sức từ đi ra từ cực Bắc (N), đi vào cực Nam (S).',
    theorySections: [
      {
        heading: '1. Nam châm vĩnh cửu & Tương tác từ',
        content:
          '• Mọi nam châm đều có hai cực: cực Bắc ($N$) và cực Nam ($S$). Hai cực cùng tên đẩy nhau, hai cực khác tên hút nhau.\n• Trái Đất cũng là một nam châm khổng lồ, cực Bắc địa lí gần cực Nam từ trường Trái Đất.'
      },
      {
        heading: '2. Từ trường & Đường sức từ',
        content:
          '• Không gian xung quanh nam châm hoặc dòng điện tồn tại **từ trường**; nó tác dụng lực từ lên kim nam châm đặt trong nó.\n• **Đường sức từ** bên ngoài nam châm là những đường cong khép kín có chiều quy ước đi **ra từ cực Bắc ($N$)** và đi **vào cực Nam ($S$)**.'
      }
    ],
    keyFormulas: [
      '\\text{Bên ngoài nam châm: đường sức từ đi ra cực } N \\to \\text{vào cực } S',
      '\\text{Chỗ nào từ trường mạnh thì đường sức từ mau (dày)}'
    ],
    ...SIM_PRESETS.mag_induction,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Quy ước chiều của đường sức từ bên ngoài thanh nam châm là:',
        options: [
          'A. đi vào cực Bắc và đi ra cực Nam',
          'B. đi ra từ cực Bắc và đi vào cực Nam',
          'C. đi từ tâm nam châm ra hai đầu',
          'D. vuông góc với trục nam châm'
        ],
        correctIndex: 1,
        explanation: 'Theo quy ước, bên ngoài thanh nam châm đường sức từ đi ra từ cực Bắc ($N$) và đi vào cực Nam ($S$).'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Có một thanh nam châm thẳng bị mất dấu sơn chỉ tên hai cực $N$ và $S$. Trình bày hai cách đơn giản để xác định lại tên hai cực của thanh nam châm này.',
        hints: ['Dùng dây mảnh treo tự do hoặc đưa gần kim nam châm đã biết tên cực.'],
        solutionSteps: [
          'Cách 1: Treo thanh nam châm nằm ngang bằng sợi dây mảnh tại trọng tâm (tránh xa sắt/nam châm khác). Khi cân bằng, đầu quay về hướng Bắc địa lí là cực Bắc ($N$), đầu kia là cực Nam ($S$).',
          'Cách 2: Đưa một đầu thanh nam châm lại gần cực Bắc của kim nam châm la bàn; nếu đẩy thì đầu đó là cực Bắc ($N$), nếu hút là cực Nam ($S$).'
        ],
        finalAnswer: 'Treo tự do theo phương Bắc–Nam hoặc thử tương tác với kim la bàn chuẩn.'
      }
    ]
  },
  {
    id: 'phys-2006-9-7',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương II: Điện từ học',
    sourceTag: SRC_9,
    lessonNumber: 7,
    title: 'Bài 7 (2006): Từ trường ống dây có dòng điện & Nam châm điện',
    subtitle: 'Quy tắc nắm tay phải xác định chiều đường sức từ trong lòng ống dây và cấu tạo, ứng dụng nam châm điện',
    description:
      'Vận dụng quy tắc nắm tay phải xác định cực từ của ống dây mang dòng điện một chiều, cách làm tăng lực từ của nam châm điện và ứng dụng trong rơle, loa điện.',
    theorySections: [
      {
        heading: '1. Từ trường của ống dây & Quy tắc nắm tay phải',
        content:
          '• Phần từ phổ ở bên trong ống dây có dòng điện chạy qua là các đường sức từ song song, cách đều nhau; bên ngoài giống thanh nam châm thẳng.\n• **Quy tắc nắm tay phải**: Nắm bàn tay phải rồi đặt sao cho bốn ngón tay hướng theo chiều dòng điện chạy qua các vòng dây thì ngón tay cái choãi ra chỉ chiều đường sức từ trong lòng ống dây (chỉ về cực Bắc $N$ của ống dây).'
      },
      {
        heading: '2. Sự nhiễm từ & Nam châm điện',
        content:
          '• Lõi sắt non đặt trong lòng ống dây bị nhiễm từ mạnh khi có dòng điện và mất hết từ tính ngay khi ngắt dòng điện; lõi thép giữ được từ tính lâu dài.\n• Tăng lực từ của nam châm điện bằng cách **tăng cường độ dòng điện** qua các vòng dây hoặc **tăng số vòng dây**.'
      }
    ],
    keyFormulas: [
      '\\text{Nắm tay phải: 4 ngón theo chiều dòng } I \\Rightarrow \\text{ngón cái chỉ cực } N',
      '\\text{Lõi sắt non tăng mạnh từ trường và mất từ tính nhanh khi ngắt điện}'
    ],
    ...SIM_PRESETS.mag_induction,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Để làm tăng lực từ của một nam châm điện, biện pháp nào sau đây ĐÚNG?',
        options: [
          'A. Giảm cường độ dòng điện qua ống dây',
          'B. Thay lõi sắt non bằng lõi gỗ',
          'C. Tăng cường độ dòng điện và tăng số vòng dây',
          'D. Đảo chiều dòng điện qua ống dây'
        ],
        correctIndex: 2,
        explanation: 'Lực từ của nam châm điện tăng khi tăng cường độ dòng điện và/hoặc tăng số vòng dây.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một ống dây có lõi sắt non được nối với nguồn điện một chiều qua khóa K và biến trở con chạy. Nếu đảo hai cực nguồn điện và đồng thời dịch chuyển con chạy biến trở giảm điện trở thì từ trường của ống dây thay đổi như thế nào?',
        hints: ['Xét cả chiều đường sức từ (do đổi chiều dòng) và độ lớn lực từ (do tăng $I$).'],
        solutionSteps: [
          'Bước 1: Đảo hai cực nguồn làm dòng điện đổi chiều $\\Rightarrow$ hai cực từ Bắc – Nam của ống dây đổi chỗ cho nhau (đường sức từ đảo chiều).',
          'Bước 2: Giảm điện trở biến trở làm $I$ tăng $\\Rightarrow$ độ lớn lực từ của nam châm điện tăng lên.'
        ],
        finalAnswer: 'Hai cực từ đảo ngược và lực từ của nam châm điện tăng mạnh hơn.'
      }
    ]
  },
  {
    id: 'phys-2006-9-8',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương II: Điện từ học',
    sourceTag: SRC_9,
    lessonNumber: 8,
    title: 'Bài 8 (2006): Lực điện từ & Động cơ điện một chiều',
    subtitle: 'Quy tắc bàn tay trái xác định chiều lực điện từ tác dụng lên dây dẫn có dòng điện và nguyên tắc động cơ điện một chiều',
    description:
      'Xác định phương và chiều lực điện từ bằng quy tắc bàn tay trái, hiểu tác dụng của bộ góp điện (cổ góp) giúp khung dây động cơ điện một chiều quay liên tục một chiều.',
    theorySections: [
      {
        heading: '1. Lực điện từ & Quy tắc bàn tay trái',
        content:
          '• Dây dẫn thẳng có dòng điện đặt không song song với đường sức từ chịu tác dụng của **lực điện từ**.\n• **Quy tắc bàn tay trái**: Đặt bàn tay trái sao cho các đường sức từ hướng vào lòng bàn tay, chiều từ cổ tay đến ngón tay giữa hướng theo chiều dòng điện (từ $+$ sang $-$) thì ngón tay cái choãi ra $90^\\circ$ chỉ chiều của lực điện từ.'
      },
      {
        heading: '2. Động cơ điện một chiều',
        content:
          '• Gồm phần đứng yên (stato – nam châm tạo từ trường) và phần quay (rôto – khung dây dẫn có dòng điện chạy qua).\n• Nhờ **cổ góp điện** (hai bán khuyên) tự động đổi chiều dòng điện trong khung dây mỗi nửa vòng quay, ngẫu lực điện từ luôn làm khung dây quay theo một chiều xác định, chuyển hóa điện năng thành cơ năng.'
      }
    ],
    keyFormulas: [
      '\\text{Bàn tay trái: } \\vec{B} \\text{ vào lòng tay, cổ tay} \\to \\text{ngón giữa theo } I, \\text{ ngón cái chỉ } \\vec{F}',
      '\\text{Động cơ điện: Điện năng} \\to \\text{Cơ năng (nhờ lực điện từ)}'
    ],
    ...SIM_PRESETS.mag_faraday,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Trong quy tắc bàn tay trái, ngón tay cái choãi ra $90^\\circ$ chỉ chiều của đại lượng nào?',
        options: [
          'A. Chiều đường sức từ',
          'B. Chiều dòng điện chạy trong dây dẫn',
          'C. Chiều của lực điện từ tác dụng lên dây dẫn',
          'D. Chiều chuyển động của êlectron'
        ],
        correctIndex: 2,
        explanation: 'Theo quy tắc bàn tay trái, ngón cái choãi $90^\\circ$ chỉ chiều lực điện từ.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Tại sao khung dây đặt trong từ trường của động cơ điện một chiều lại có thể quay liên tục theo một chiều mà không bị dừng lại ở mặt phẳng trung hòa?',
        hints: ['Giải thích vai trò của cổ góp điện (hai bán khuyên) sau mỗi nửa vòng quay.'],
        solutionSteps: [
          'Bước 1: Khi khung dây quay qua mặt phẳng vuông góc với đường sức từ, nếu dòng điện giữ nguyên chiều thì hai lực điện từ tác dụng lên hai cạnh đối sẽ kéo khung quay ngược lại.',
          'Bước 2: Nhờ cổ góp gồm hai bán khuyên tì lên hai chổi than, cứ sau mỗi nửa vòng quay chiều dòng điện trong khung lại tự động đảo ngược, làm mômen lực điện từ tiếp tục đẩy khung quay cùng một chiều.'
        ],
        finalAnswer: 'Nhờ cổ góp điện tự động đảo chiều dòng điện sau mỗi nửa vòng quay.'
      }
    ]
  },
  {
    id: 'phys-2006-9-9',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương II: Điện từ học',
    sourceTag: SRC_9,
    lessonNumber: 9,
    title: 'Bài 9 (2006): Hiện tượng cảm ứng điện từ & Điều kiện xuất hiện dòng cảm ứng',
    subtitle: 'Thí nghiệm Fa-ra-đây với nam châm và cuộn dây kín; điều kiện số đường sức từ xuyên qua tiết diện cuộn dây biến thiên',
    description:
      'Phân tích mọi cách tạo ra dòng điện cảm ứng trong cuộn dây dẫn kín bằng nam châm vĩnh cửu hoặc nam châm điện và điều kiện tổng quát về số đường sức từ biến thiên.',
    theorySections: [
      {
        heading: '1. Thí nghiệm tạo dòng điện cảm ứng',
        content:
          '• Khi đưa cực nam châm lại gần hoặc ra xa cuộn dây kín, hoặc quay nam châm trước cuộn dây, hoặc đóng/ngắt dòng điện qua nam châm điện đặt gần cuộn dây, trong cuộn dây kín xuất hiện dòng điện gọi là **dòng điện cảm ứng**.'
      },
      {
        heading: '2. Điều kiện xuất hiện dòng điện cảm ứng',
        content:
          '• **Kết luận tổng quát**: Điều kiện xuất hiện dòng điện cảm ứng trong cuộn dây dẫn kín là **số đường sức từ xuyên qua tiết diện $S$ của cuộn dây đó biến thiên** (tăng lên hoặc giảm đi).\n• Khi số đường sức từ xuyên qua tiết diện $S$ không thay đổi (dù rất lớn) thì không có dòng điện cảm ứng.'
      }
    ],
    keyFormulas: [
      '\\text{Có dòng cảm ứng} \\iff \\text{Số đường sức từ xuyên qua tiết diện } S \\text{ biến thiên}'
    ],
    ...SIM_PRESETS.mag_faraday,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Trường hợp nào sau đây KHÔNG xuất hiện dòng điện cảm ứng trong cuộn dây dẫn kín?',
        options: [
          'A. Đưa thanh nam châm lại gần cuộn dây',
          'B. Quay thanh nam châm trước cuộn dây',
          'C. Đặt thanh nam châm đứng yên ngay sát cuộn dây',
          'D. Đóng hoặc ngắt công tắc của nam châm điện đặt gần cuộn dây'
        ],
        correctIndex: 2,
        explanation: 'Khi nam châm đứng yên so với cuộn dây thì số đường sức từ xuyên qua tiết diện cuộn dây không đổi nên không có dòng cảm ứng.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một đinamô xe đạp có nam châm quay trước cuộn dây. Khi xe đạp chạy chậm rồi chạy nhanh, và khi xe dừng hẳn thì dòng điện thắp sáng đèn xe đạp thay đổi như thế nào? Vì sao?',
        hints: ['Liên hệ tốc độ biến thiên số đường sức từ qua tiết diện cuộn dây.'],
        solutionSteps: [
          'Bước 1: Khi xe chạy, nam châm quay làm số đường sức từ qua cuộn dây liên tục tăng giảm $\\Rightarrow$ có dòng cảm ứng thắp sáng đèn.',
          'Bước 2: Xe chạy càng nhanh, tốc độ biến thiên số đường sức từ càng lớn nên dòng điện càng mạnh, đèn sáng hơn; khi xe dừng hẳn, nam châm ngừng quay nên dòng cảm ứng bằng $0$, đèn tắt.'
        ],
        finalAnswer: 'Chạy nhanh đèn sáng mạnh hơn; xe dừng đèn tắt vì số đường sức từ không còn biến thiên.'
      }
    ]
  },
  {
    id: 'phys-2006-9-10',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương II: Điện từ học',
    sourceTag: SRC_9,
    lessonNumber: 10,
    title: 'Bài 10 (2006): Dòng điện xoay chiều, Máy phát điện & Máy biến thế',
    subtitle: 'Chiều dòng xoay chiều luân phiên đổi chiều, cấu tạo máy phát điện xoay chiều, truyền tải điện đi xa và máy biến thế',
    description:
      'Hiểu bản chất dòng điện xoay chiều, nguyên tắc hoạt động của máy phát điện xoay chiều, cách giảm hao phí trên đường dây tải điện và công thức máy biến thế.',
    theorySections: [
      {
        heading: '1. Dòng điện xoay chiều & Máy phát điện xoay chiều',
        content:
          '• **Dòng điện xoay chiều** là dòng điện cảm ứng có chiều luân phiên thay đổi theo thời gian (ở lưới điện Việt Nam tần số $50\\text{ Hz}$, tức đổi chiều $100$ lần mỗi giây).\n• Máy phát điện xoay chiều gồm hai bộ phận chính là **nam châm** (phần cảm) và **cuộn dây** (phần ứng); một trong hai bộ phận quay gọi là rôto, bộ phận đứng yên gọi là stato.'
      },
      {
        heading: '2. Truyền tải điện đi xa & Máy biến thế',
        content:
          '• Công suất hao phí do tỏa nhiệt trên đường dây: $\\mathcal{P}_{hp} = \\frac{\\mathcal{P}^2 R}{U^2}$. Tăng hiệu điện thế $U$ lên $n$ lần thì hao phí giảm $n^2$ lần.\n• **Máy biến thế** hoạt động dựa trên hiện tượng cảm ứng điện từ (chỉ dùng cho dòng xoay chiều): $\\frac{U_1}{U_2} = \\frac{n_1}{n_2}$. Nếu $n_2 > n_1$ là máy tăng thế; $n_2 < n_1$ là máy hạ thế.'
      }
    ],
    keyFormulas: [
      '\\mathcal{P}_{hp} = I^2 R = \\frac{\\mathcal{P}^2 R}{U^2}',
      '\\frac{U_1}{U_2} = \\frac{n_1}{n_2}'
    ],
    ...SIM_PRESETS.transformer,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Một máy biến thế có cuộn sơ cấp $n_1 = 1000$ vòng, cuộn thứ cấp $n_2 = 200$ vòng. Đặt vào hai đầu cuộn sơ cấp hiệu điện thế xoay chiều $U_1 = 220\\text{ V}$ thì hiệu điện thế ở hai đầu cuộn thứ cấp là:',
        options: ['A. $1100\\text{ V}$', 'B. $44\\text{ V}$', 'C. $22\\text{ V}$', 'D. $440\\text{ V}$'],
        correctIndex: 1,
        explanation: '$U_2 = U_1 \\cdot \\frac{n_2}{n_1} = 220 \\cdot \\frac{200}{1000} = 44\\text{ V}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Cần truyền tải công suất điện $\\mathcal{P} = 100\\text{ kW}$ trên đường dây có điện trở tổng cộng $R = 10\\,\\Omega$. Tính công suất hao phí khi hiệu điện thế ở nơi phát là $U = 5\\text{ kV}$ và khi tăng $U$ lên $20\\text{ kV}$.',
        hints: ['Đổi $\\mathcal{P} = 10^5\\text{ W}$, $U_1 = 5000\\text{ V}$, $U_2 = 20\\,000\\text{ V}$ và thay vào $\\mathcal{P}_{hp} = \\frac{\\mathcal{P}^2 R}{U^2}$.'],
        solutionSteps: [
          'Bước 1: Với $U_1 = 5000\\text{ V}$: $\\mathcal{P}_{hp1} = \\frac{(10^5)^2 \\cdot 10}{5000^2} = 4000\\text{ W} = 4\\text{ kW}$.',
          'Bước 2: Khi tăng hiệu điện thế gấp $4$ lần lên $U_2 = 20\\text{ kV}$, hao phí giảm $4^2 = 16$ lần: $\\mathcal{P}_{hp2} = \\frac{4000}{16} = 250\\text{ W}$.'
        ],
        finalAnswer: '$\\mathcal{P}_{hp1} = 4\\text{ kW}$; $\\mathcal{P}_{hp2} = 250\\text{ W}$.'
      }
    ]
  },

  // ==================== CHƯƠNG III: QUANG HỌC (Bài 11–15) ====================
  {
    id: 'phys-2006-9-11',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương III: Quang học',
    sourceTag: SRC_9,
    lessonNumber: 11,
    title: 'Bài 11 (2006): Hiện tượng Khúc xạ ánh sáng',
    subtitle: 'Tia tới, pháp tuyến, góc tới i, góc khúc xạ r và quy luật lệch tia sáng giữa không khí với nước/thủy tinh',
    description:
      'Quan sát sự gãy khúc của tia sáng tại mặt phân cách hai môi trường trong suốt khác nhau và phân biệt trường hợp $r < i$ (không khí sang nước) với $r > i$ (nước sang không khí).',
    theorySections: [
      {
        heading: '1. Hiện tượng khúc xạ ánh sáng',
        content:
          '• Hiện tượng tia sáng truyền từ môi trường trong suốt này sang môi trường trong suốt khác bị gãy khúc tại mặt phân cách giữa hai môi trường gọi là **hiện tượng khúc xạ ánh sáng**.'
      },
      {
        heading: '2. Quan hệ giữa góc tới $i$ và góc khúc xạ $r$',
        content:
          '• Khi tia sáng truyền từ không khí sang nước (hoặc thủy tinh): tia khúc xạ nằm trong mặt phẳng tới, ở bên kia pháp tuyến và **góc khúc xạ nhỏ hơn góc tới** ($r < i$).\n• Khi tia sáng truyền từ nước sang không khí: **góc khúc xạ lớn hơn góc tới** ($r > i$). Khi $i = 0^\\circ$ (tia tới vuông góc mặt phân cách), tia sáng truyền thẳng ($r = 0^\\circ$).'
      }
    ],
    keyFormulas: [
      '\\text{Không khí } \\to \\text{ Nước/Thủy tinh: } r < i',
      '\\text{Nước/Thủy tinh } \\to \\text{ Không khí: } r > i; \\quad i = 0^\\circ \\Rightarrow r = 0^\\circ'
    ],
    ...SIM_PRESETS.refraction,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Chiếu tia sáng từ không khí vào nước với góc tới $i = 45^\\circ$. Góc khúc xạ $r$ có thể nhận giá trị nào?',
        options: ['A. $r = 45^\\circ$', 'B. $r = 60^\\circ$', 'C. $r = 32^\\circ$', 'D. $r = 90^\\circ$'],
        correctIndex: 2,
        explanation: 'Truyền từ không khí vào nước thì góc khúc xạ nhỏ hơn góc tới: $0^\\circ < r < 45^\\circ$, chọn $32^\\circ$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một người đứng trên bờ nhìn xuống một bể nước trong thấy viên sỏi ở đáy bể dường như được nâng lên gần mặt nước hơn so với thực tế. Hãy giải thích hiện tượng này.',
        hints: ['Xét đường đi của tia sáng phát ra từ viên sỏi đi từ nước ra không khí vào mắt.'],
        solutionSteps: [
          'Bước 1: Tia sáng từ viên sỏi đi từ nước ra không khí bị khúc xạ ở mặt nước với góc khúc xạ $r > i$ (lệch xa pháp tuyến hơn).',
          'Bước 2: Mắt người nhìn theo phương đường kéo dài của tia ló sẽ thấy ảnh ảo của viên sỏi nằm nông hơn vị trí thật.'
        ],
        finalAnswer: 'Do ánh sáng từ nước ra không khí bị khúc xạ lệch xa pháp tuyến ($r > i$) nên ảnh ảo nằm cao hơn viên sỏi thật.'
      }
    ]
  },
  {
    id: 'phys-2006-9-12',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương III: Quang học',
    sourceTag: SRC_9,
    lessonNumber: 12,
    title: 'Bài 12 (2006): Thấu kính hội tụ & Ảnh của vật qua thấu kính hội tụ',
    subtitle: 'Trục chính, quang tâm O, tiêu điểm F, ba tia sáng đặc biệt và dựng ảnh thật/ảnh ảo bằng hình học',
    description:
      'Nhận diện hình dạng thấu kính hội tụ (rìa mỏng), vẽ đường đi của ba tia sáng đặc biệt và tính vị trí, độ lớn ảnh của vật sáng qua các vùng khoảng cách $d > 2f, d = 2f, f < d < 2f, d < f$.',
    theorySections: [
      {
        heading: '1. Đặc điểm & Ba tia sáng đặc biệt',
        content:
          '• Thấu kính hội tụ bằng thủy tinh/nhựa trong suốt có phần rìa mỏng hơn phần giữa. Chùm tia tới song song với trục chính cho chùm tia ló hội tụ tại tiêu điểm ảnh chính $F\'$.\n• **Ba tia sáng đặc biệt**: (1) Tia qua quang tâm $O$ truyền thẳng; (2) Tia song song trục chính cho tia ló qua $F\'$; (3) Tia qua tiêu điểm $F$ cho tia ló song song trục chính.'
      },
      {
        heading: '2. Đặc điểm ảnh của vật tạo bởi thấu kính hội tụ',
        content:
          '• $d > f$: cho **ảnh thật, ngược chiều** với vật ($d > 2f$ ảnh nhỏ hơn vật; $d = 2f$ ảnh bằng vật; $f < d < 2f$ ảnh lớn hơn vật).\n• $d < f$: cho **ảnh ảo, cùng chiều, lớn hơn vật** (nguyên lí kính lúp).'
      }
    ],
    keyFormulas: [
      '\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'} \\quad (d > f \\Rightarrow d\' > 0;\\ d < f \\Rightarrow d\' < 0)',
      '\\frac{h\'}{h} = \\frac{d\'}{d} \\quad (\\text{ảnh thật})'
    ],
    ...SIM_PRESETS.lens_single,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Đặt vật sáng trước thấu kính hội tụ có tiêu cự $f = 15\\text{ cm}$, cách thấu kính $d = 10\\text{ cm}$. Ảnh thu được có tính chất:',
        options: [
          'A. Ảnh thật, ngược chiều, nhỏ hơn vật',
          'B. Ảnh ảo, cùng chiều, lớn hơn vật',
          'C. Ảnh ảo, cùng chiều, nhỏ hơn vật',
          'D. Ảnh thật, ngược chiều, lớn hơn vật'
        ],
        correctIndex: 1,
        explanation: 'Vì $d = 10\\text{ cm} < f = 15\\text{ cm}$ nên thấu kính hội tụ cho ảnh ảo, cùng chiều và lớn hơn vật.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Vật sáng $AB$ cao $2\\text{ cm}$ đặt vuông góc trục chính của thấu kính hội tụ có tiêu cự $f = 12\\text{ cm}$, cách thấu kính $d = 36\\text{ cm}$. Dựng ảnh $A\'B\'$ và tính khoảng cách từ ảnh đến thấu kính cùng chiều cao ảnh.',
        hints: ['Dùng hai cặp tam giác đồng dạng $\\triangle OAB \\sim \\triangle OA\'B\'$ và $\\triangle F\'OI \\sim \\triangle F\'A\'B\'$.'],
        solutionSteps: [
          'Bước 1: Từ $\\triangle OAB \\sim \\triangle OA\'B\'$: $\\frac{A\'B\'}{AB} = \\frac{OA\'}{OA} = \\frac{d\'}{d}$.',
          'Bước 2: Từ $\\triangle F\'OI \\sim \\triangle F\'A\'B\'$: $\\frac{A\'B\'}{OI} = \\frac{F\'A\'}{F\'O} = \\frac{d\' - f}{f}$ (với $OI = AB$).',
          'Bước 3: $\\frac{d\'}{36} = \\frac{d\' - 12}{12} \\Rightarrow d\' = 3d\' - 36 \\Rightarrow d\' = 18\\text{ cm}$ (ảnh thật); $A\'B\' = 2\\cdot\\frac{18}{36} = 1\\text{ cm}$.'
        ],
        finalAnswer: 'Ảnh thật cách thấu kính $18\\text{ cm}$, ngược chiều và cao $1\\text{ cm}$.'
      }
    ]
  },
  {
    id: 'phys-2006-9-13',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương III: Quang học',
    sourceTag: SRC_9,
    lessonNumber: 13,
    title: 'Bài 13 (2006): Thấu kính phân kì & Cách nhận biết hai loại thấu kính',
    subtitle: 'Đặc điểm hình học rìa dày, tia ló phân kì có đường kéo dài đi qua tiêu điểm F và tính chất luôn cho ảnh ảo nhỏ hơn vật',
    description:
      'Khảo sát đường truyền tia sáng qua thấu kính phân kì, dựng ảnh ảo của vật ở mọi vị trí trước thấu kính và thực hành phân biệt nhanh thấu kính hội tụ với thấu kính phân kì.',
    theorySections: [
      {
        heading: '1. Đặc điểm & Đường truyền tia sáng qua Thấu kính phân kì',
        content:
          '• Thấu kính phân kì có **phần rìa dày hơn phần giữa**.\n• Chùm tia tới song song trục chính cho chùm tia ló phân kì, đường kéo dài cắt nhau tại tiêu điểm $F$ nằm cùng phía với tia tới.\n• Tia qua quang tâm $O$ truyền thẳng; tia song song trục chính cho tia ló có đường kéo dài đi qua tiêu điểm $F$ phía trước thấu kính.'
      },
      {
        heading: '2. Ảnh tạo bởi thấu kính phân kì',
        content:
          '• Vật sáng đặt ở **mọi vị trí** trước thấu kính phân kì luôn cho **ảnh ảo, cùng chiều, nhỏ hơn vật** và luôn nằm trong khoảng tiêu cự ($OA\' < OF$).'
      }
    ],
    keyFormulas: [
      '\\frac{1}{d} - \\frac{1}{d\'} = \\frac{1}{f} \\quad (\\text{với } f = |OF|,\\ d\' = OA\' > 0)',
      '\\frac{h\'}{h} = \\frac{d\'}{d} < 1'
    ],
    ...SIM_PRESETS.lens_single,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Đặt một vật sáng ở bất kì vị trí nào trước thấu kính phân kì ta luôn thu được:',
        options: [
          'A. Ảnh thật, cùng chiều, nhỏ hơn vật',
          'B. Ảnh ảo, cùng chiều, nhỏ hơn vật',
          'C. Ảnh ảo, ngược chiều, lớn hơn vật',
          'D. Ảnh ảo, cùng chiều, lớn hơn vật'
        ],
        correctIndex: 1,
        explanation: 'Thấu kính phân kì luôn tạo ảnh ảo, cùng chiều và nhỏ hơn vật ở mọi vị trí đặt vật.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Đặt vật sáng $AB$ cao $3\\text{ cm}$ trước một thấu kính phân kì có tiêu cự $f = 15\\text{ cm}$, cách thấu kính $d = 30\\text{ cm}$. Tính khoảng cách từ ảnh đến thấu kính và chiều cao ảnh $A\'B\'$.',
        hints: ['Dùng hai tam giác đồng dạng $\\triangle OAB \\sim \\triangle OA\'B\'$ và $\\triangle FOI \\sim \\triangle FA\'B\'$.'],
        solutionSteps: [
          'Bước 1: $\\frac{A\'B\'}{AB} = \\frac{d\'}{d} = \\frac{f - d\'}{f} \\Rightarrow \\frac{d\'}{30} = \\frac{15 - d\'}{15} = 1 - \\frac{d\'}{15}$.',
          'Bước 2: $\\frac{d\'}{30} + \\frac{2d\'}{30} = 1 \\Rightarrow \\frac{3d\'}{30} = 1 \\Rightarrow d\' = 10\\text{ cm}$.',
          'Bước 3: Chiều cao ảnh $h\' = 3 \\cdot \\frac{10}{30} = 1\\text{ cm}$.'
        ],
        finalAnswer: 'Ảnh ảo cách thấu kính $10\\text{ cm}$, cao $1\\text{ cm}$.'
      }
    ]
  },
  {
    id: 'phys-2006-9-14',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương III: Quang học',
    sourceTag: SRC_9,
    lessonNumber: 14,
    title: 'Bài 14 (2006): Mắt, Các tật của mắt & Kính lúp',
    subtitle: 'Cấu tạo quang học của mắt (thể thủy tinh, màng lưới), sự điều tiết, mắt cận – mắt lão và số bội giác kính lúp',
    description:
      'So sánh mắt với máy ảnh, hiểu nguyên nhân và cách khắc phục tật cận thị (kính phân kì) và tật mắt lão (kính hội tụ), đồng thời tính số bội giác của kính lúp $G = \\frac{25}{f}$.',
    theorySections: [
      {
        heading: '1. Mắt, Điểm cực cận & Điểm cực viễn',
        content:
          '• Hai bộ phận quan trọng nhất về mặt quang học của mắt là **thể thủy tinh** (đóng vai trò thấu kính hội tụ có tiêu cự thay đổi được nhờ sự điều tiết) và **màng lưới** (nơi hiện ảnh thật, ngược chiều).\n• **Điểm cực viễn ($C_V$)** là điểm xa nhất mắt nhìn rõ khi không điều tiết; **điểm cực cận ($C_C$)** là điểm gần nhất mắt nhìn rõ khi điều tiết tối đa.'
      },
      {
        heading: '2. Mắt cận, mắt lão & Kính lúp',
        content:
          '• **Mắt cận**: nhìn rõ vật ở gần nhưng không nhìn rõ vật ở xa ($C_V$ gần hơn bình thường); khắc phục bằng cách đeo **thấu kính phân kì** có tiêu cự $f = OC_V$ để nhìn vật ở vô cực không điều tiết.\n• **Mắt lão**: nhìn rõ vật ở xa nhưng không nhìn rõ vật ở gần ($C_C$ xa hơn bình thường); khắc phục bằng **thấu kính hội tụ**.\n• **Kính lúp** là thấu kính hội tụ có tiêu cự ngắn ($f$ vài cm đến vài chục cm), số bội giác $G = \\frac{25}{f\\text{ (cm)}}$.'
      }
    ],
    keyFormulas: [
      'G = \\frac{25}{f\\text{ (cm)}}, \\quad f_{\\text{kính cận}} = -OC_V'
    ],
    ...SIM_PRESETS.telescope,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Trên vành một kính lúp có ghi $5\\times$. Tiêu cự của kính lúp này bằng:',
        options: ['A. $5\\text{ cm}$', 'B. $25\\text{ cm}$', 'C. $125\\text{ cm}$', 'D. $0{,}2\\text{ cm}$'],
        correctIndex: 0,
        explanation: 'Từ $G = \\frac{25}{f} \\Rightarrow f = \\frac{25}{G} = \\frac{25}{5} = 5\\text{ cm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một người cận thị có điểm cực viễn cách mắt $50\\text{ cm}$. Người này phải đeo kính loại gì, tiêu cự bao nhiêu để nhìn rõ vật ở rất xa mà mắt không phải điều tiết?',
        hints: ['Kính cận là thấu kính phân kì tạo ảnh ảo của vật ở vô cực hiện lên đúng tại $C_V$.'],
        solutionSteps: [
          'Bước 1: Người cận thị phải đeo **thấu kính phân kì**.',
          'Bước 2: Để vật ở vô cực cho ảnh ảo tại điểm cực viễn $C_V$ (cách mắt $50\\text{ cm}$, coi kính sát mắt), tiêu cự có độ lớn $f = OC_V = 50\\text{ cm}$.'
        ],
        finalAnswer: 'Đeo thấu kính phân kì có độ lớn tiêu cự $50\\text{ cm}$ ($f = -50\\text{ cm}$).'
      }
    ]
  },
  {
    id: 'phys-2006-9-15',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương III: Quang học',
    sourceTag: SRC_9,
    lessonNumber: 15,
    title: 'Bài 15 (2006): Ánh sáng trắng, Ánh sáng màu, Sự tán sắc & Tác dụng ánh sáng',
    subtitle: 'Phân tích ánh sáng trắng qua lăng kính thành dải cầu vồng, trộn ánh sáng màu và tác dụng nhiệt – sinh học – quang điện',
    description:
      'Giải thích sự phân tích ánh sáng trắng thành nhiều chùm sáng màu từ đỏ đến tím qua lăng kính hoặc đĩa CD, màu sắc các vật dưới ánh sáng trắng/màu và các tác dụng của ánh sáng.',
    theorySections: [
      {
        heading: '1. Ánh sáng trắng, Ánh sáng màu & Sự phân tích ánh sáng trắng',
        content:
          '• Ánh sáng mặt trời và đèn dây tóc là **ánh sáng trắng**, thực chất là hỗn hợp của vô số ánh sáng màu biến thiên liên tục từ **đỏ, da cam, vàng, lục, lam, chàm, tím**.\n• Khi chiếu chùm ánh sáng trắng hẹp qua **lăng kính**, tia đỏ bị lệch ít nhất, tia tím bị lệch nhiều nhất nên thu được dải màu cầu vồng (sự tán sắc).'
      },
      {
        heading: '2. Màu sắc vật & Tác dụng của ánh sáng',
        content:
          '• Vật có màu nào thì tán xạ mạnh ánh sáng màu đó và hấp thụ các màu còn lại; vật màu đen hầu như không tán xạ ánh sáng nào.\n• Ánh sáng có **tác dụng nhiệt** (làm nóng vật, vật đen hấp thụ nhiệt mạnh nhất), **tác dụng sinh học** (quang hợp, tổng hợp vitamin D) và **tác dụng quang điện** (pin Mặt Trời chuyển quang năng trực tiếp thành điện năng).'
      }
    ],
    keyFormulas: [
      '\\text{Lệch qua lăng kính: } D_{\\text{đỏ}} < D_{\\text{vàng}} < D_{\\text{lục}} < D_{\\text{lam}} < D_{\\text{tím}}',
      '\\text{Pin Mặt Trời: Quang năng} \\to \\text{Điện năng}'
    ],
    ...SIM_PRESETS.prism,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Chiếu một chùm ánh sáng trắng hẹp qua lăng kính thủy tinh đặt trong không khí. Tia sáng màu nào bị lệch về phía đáy lăng kính NHIỀU NHẤT?',
        options: ['A. Ánh sáng đỏ', 'B. Ánh sáng vàng', 'C. Ánh sáng lục', 'D. Ánh sáng tím'],
        correctIndex: 3,
        explanation: 'Qua lăng kính, ánh sáng đỏ lệch ít nhất và ánh sáng tím lệch nhiều nhất.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Nếu chiếu ánh sáng đỏ vào một tờ giấy trắng và vào một tấm vải xanh lục trong phòng tối, ta sẽ quan sát thấy chúng có màu gì? Giải thích.',
        hints: ['Tờ giấy trắng tán xạ tốt mọi màu; tấm vải xanh lục chỉ tán xạ mạnh ánh sáng lục và hấp thụ các màu khác.'],
        solutionSteps: [
          'Bước 1: Tờ giấy trắng tán xạ tốt mọi ánh sáng màu chiếu tới nó $\\Rightarrow$ dưới ánh sáng đỏ, tờ giấy trông có **màu đỏ**.',
          'Bước 2: Tấm vải xanh lục chỉ tán xạ ánh sáng lục và hấp thụ hầu hết ánh sáng đỏ $\\Rightarrow$ không có ánh sáng truyền đến mắt, tấm vải trông có **màu đen**.'
        ],
        finalAnswer: 'Tờ giấy trắng có màu đỏ; tấm vải xanh lục trông có màu đen.'
      }
    ]
  },

  // ==================== CHƯƠNG IV: SỰ BẢO TOÀN VÀ CHUYỂN HÓA NĂNG LƯỢNG (Bài 16–18) ====================
  {
    id: 'phys-2006-9-16',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương IV: Bảo toàn & Chuyển hóa năng lượng',
    sourceTag: SRC_9,
    lessonNumber: 16,
    title: 'Bài 16 (2006): Năng lượng & Định luật Bảo toàn Năng lượng',
    subtitle: 'Các dạng năng lượng cơ, nhiệt, điện, quang, hóa; sự chuyển hóa năng lượng và phần năng lượng hao phí',
    description:
      'Tổng hợp các dạng năng lượng học ở THCS, lập sơ đồ chuyển hóa năng lượng trong động cơ, đèn, pin và khẳng định định luật bảo toàn năng lượng trong tự nhiên.',
    theorySections: [
      {
        heading: '1. Các dạng năng lượng & Chuyển hóa năng lượng',
        content:
          '• Mọi hiện tượng trong tự nhiên đều có sự biến đổi hoặc truyền năng lượng giữa các dạng: **cơ năng, nhiệt năng, điện năng, quang năng, hóa năng, năng lượng hạt nhân**.\n• Mọi thiết bị hoạt động đều biến đổi một phần năng lượng ban đầu thành dạng **năng lượng có ích** và một phần thành **năng lượng hao phí** (thường là nhiệt năng tỏa ra môi trường).'
      },
      {
        heading: '2. Định luật bảo toàn năng lượng',
        content:
          '• **Định luật bảo toàn và chuyển hóa năng lượng**: Năng lượng không tự nhiên sinh ra cũng không tự nhiên mất đi; nó chỉ chuyển hóa từ dạng này sang dạng khác hoặc truyền từ vật này sang vật khác.'
      }
    ],
    keyFormulas: [
      'E_{\\text{toàn phần}} = E_{\\text{có ích}} + E_{\\text{hao phí}}',
      'H = \\frac{E_{\\text{có ích}}}{E_{\\text{toàn phần}}}\\cdot 100\\% < 100\\%'
    ],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Trong hoạt động của máy bơm nước chạy điện, phần năng lượng có ích và phần năng lượng hao phí chủ yếu là:',
        options: [
          'A. Có ích: nhiệt năng; hao phí: cơ năng',
          'B. Có ích: cơ năng nâng nước; hao phí: nhiệt năng làm nóng động cơ',
          'C. Có ích: quang năng; hao phí: hóa năng',
          'D. Không có năng lượng hao phí'
        ],
        correctIndex: 1,
        explanation: 'Máy bơm biến điện năng thành cơ năng đưa nước lên cao (có ích) và một phần tỏa nhiệt (hao phí).'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một động cơ điện tiêu thụ điện năng $1000\\text{ J}$ trong $1$ giây để kéo một vật nặng $40\\text{ kg}$ lên cao đều thêm $2\\text{ m}$ ($g \\approx 10\\text{ m/s}^2$). Tính hiệu suất của động cơ và phần nhiệt năng hao phí trong $1$ giây đó.',
        hints: ['Công có ích nâng vật là $A_{\\text{ci}} = P \\cdot h = 10 m h$.'],
        solutionSteps: [
          'Bước 1: Năng lượng có ích nâng vật: $A_{\\text{ci}} = 10 \\cdot 40 \\cdot 2 = 800\\text{ J}$.',
          'Bước 2: Hao phí nhiệt năng: $Q_{hp} = 1000 - 800 = 200\\text{ J}$.',
          'Bước 3: Hiệu suất $H = \\frac{800}{1000}\\cdot 100\\% = 80\\%$.'
        ],
        finalAnswer: '$H = 80\\%$; hao phí $200\\text{ J}$.'
      }
    ]
  },
  {
    id: 'phys-2006-9-17',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương IV: Bảo toàn & Chuyển hóa năng lượng',
    sourceTag: SRC_9,
    lessonNumber: 17,
    title: 'Bài 17 (2006): Sản xuất Điện năng – Nhà máy Thủy điện, Nhiệt điện, Gió',
    subtitle: 'Chuỗi biến đổi năng lượng trong nhà máy nhiệt điện, thủy điện, điện gió, điện Mặt Trời và bảo vệ môi trường',
    description:
      'Phân tích quy trình biến đổi năng lượng tạo ra điện năng ở quy mô công nghiệp và so sánh ưu nhược điểm giữa nguồn năng lượng hóa thạch với năng lượng tái tạo.',
    theorySections: [
      {
        heading: '1. Nhà máy Nhiệt điện & Thủy điện',
        content:
          '• **Nhà máy nhiệt điện**: Đốt than/dầu/khí (hóa năng $\\to$ nhiệt năng hơi nước áp suất cao $\\to$ cơ năng tuabin $\\to$ điện năng ở máy phát).\n• **Nhà máy thủy điện**: Thế năng dòng nước trên hồ chứa cao $\\to$ động năng nước làm quay tuabin $\\to$ điện năng.'
      },
      {
        heading: '2. Năng lượng Gió & Năng lượng Mặt Trời',
        content:
          '• **Điện gió**: Động năng gió làm quay cánh quạt nối với máy phát điện.\n• **Pin Mặt Trời**: Biến đổi trực tiếp quang năng thành điện năng sạch, tái tạo và không phát thải khí nhà kính CO₂.'
      }
    ],
    keyFormulas: [
      '\\text{Thủy điện: } W_t \\text{ (nước)} \\to W_d \\text{ (tuabin)} \\to \\text{Điện năng}',
      '\\text{Nhiệt điện: Hóa năng} \\to \\text{Nhiệt năng} \\to \\text{Cơ năng} \\to \\text{Điện năng}'
    ],
    ...SIM_PRESETS.ac_rlc,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Trong nhà máy thủy điện, dạng năng lượng ban đầu của nước tích trữ trong hồ chứa trên cao là:',
        options: ['A. Hóa năng', 'B. Thế năng hấp dẫn', 'C. Nhiệt năng', 'D. Quang năng'],
        correctIndex: 1,
        explanation: 'Nước trong hồ chứa ở độ cao lớn dự trữ thế năng hấp dẫn trước khi chảy xuống làm quay tuabin.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một nhà máy thủy điện có lưu lượng nước chảy qua tuabin là $100\\text{ m}^3/\\text{s}$ từ độ cao $45\\text{ m}$ ($D_{\\text{nước}} = 1000\\text{ kg/m}^3, g = 10\\text{ m/s}^2$). Hiệu suất phát điện của nhà máy là $80\\%$. Tính công suất phát điện của nhà máy.',
        hints: ['Khối lượng nước mỗi giây $m = D \\cdot V$; thế năng mỗi giây là $10 m h$.'],
        solutionSteps: [
          'Bước 1: Khối lượng nước mỗi giây: $m = 1000 \\cdot 100 = 10^5\\text{ kg}$.',
          'Bước 2: Công suất toàn phần của dòng nước: $\\mathcal{P}_{tp} = \\frac{10 m h}{1\\text{ s}} = 10 \\cdot 10^5 \\cdot 45 = 4{,}5\\cdot 10^7\\text{ W} = 45\\text{ MW}$.',
          'Bước 3: Công suất điện phát ra: $\\mathcal{P}_{\\text{điện}} = 0{,}8 \\cdot 45 = 36\\text{ MW}$.'
        ],
        finalAnswer: '$\\mathcal{P}_{\\text{điện}} = 36\\text{ MW}$.'
      }
    ]
  },
  {
    id: 'phys-2006-9-18',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'Vật lí 9 (2006) · Chương IV: Bảo toàn & Chuyển hóa năng lượng',
    sourceTag: SRC_9,
    lessonNumber: 18,
    title: 'Bài 18 (2006): Năng lượng Hạt nhân & Tổng kết Vật lí 9',
    subtitle: 'Phản ứng phân hạch – nhiệt hạch tỏa năng lượng lớn, nhà máy điện nguyên tử và hệ thống kiến thức Điện – Quang 9',
    description:
      'Làm quen khái niệm năng lượng hạt nhân từ phân hạch Urani và nhiệt hạch Mặt Trời, nguyên tắc an toàn bức xạ và tổng hợp công thức trọng tâm thi vào lớp 10.',
    theorySections: [
      {
        heading: '1. Năng lượng hạt nhân & Nhà máy điện nguyên tử',
        content:
          '• Năng lượng giải phóng trong các phản ứng biến đổi hạt nhân (như **phân hạch** Urani trong lò phản ứng hạt nhân hay **nhiệt hạch** trong lòng Mặt Trời) rất lớn so với đốt nhiên liệu hóa thạch cùng khối lượng.\n• Ở nhà máy điện nguyên tử, nhiệt lượng từ lò phản ứng làm sôi nước sinh hơi quay tuabin phát điện; lò phản ứng phải có lớp vỏ bê tông – chì bảo vệ chống phóng xạ.'
      },
      {
        heading: '2. Tổng kết hệ thống kiến thức Vật lí 9',
        content:
          '• **Điện học**: Định luật Ôm $I=U/R$, $R=\\rho l/S$, mạch nối tiếp/song song, $Q=I^2Rt$.\n• **Điện từ học**: Nắm tay phải, bàn tay trái, điều kiện cảm ứng điện từ, máy biến thế $U_1/U_2 = n_1/n_2$.\n• **Quang học**: Khúc xạ, dựng ảnh thấu kính hội tụ/phân kì, tán sắc ánh sáng.'
      }
    ],
    keyFormulas: [
      'I = \\frac{U}{R}, \\quad \\mathcal{P} = UI, \\quad Q = I^2 R t',
      '\\frac{U_1}{U_2} = \\frac{n_1}{n_2}, \\quad \\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}'
    ],
    ...SIM_PRESETS.nuclear,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Trong nhà máy điện nguyên tử, bộ phận nào đóng vai trò cung cấp nhiệt lượng để đun sôi nước tạo hơi làm quay tuabin?',
        options: ['A. Lò hơi đốt than', 'B. Lò phản ứng hạt nhân', 'C. Máy biến thế', 'D. Pin Mặt Trời'],
        correctIndex: 1,
        explanation: 'Lò phản ứng hạt nhân thực hiện phản ứng phân hạch có kiểm soát để tỏa nhiệt đun sôi nước tạo hơi quay tuabin.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một mạch điện gồm biến trở con chạy $R_b$ mắc nối tiếp với đèn Đ ghi $(6\\text{ V} - 3\\text{ W})$ vào nguồn không đổi $U = 9\\text{ V}$. Điều chỉnh $R_b$ để đèn sáng bình thường. Tính giá trị $R_b$ khi đó và hiệu suất sử dụng điện của mạch (coi điện năng tiêu thụ trên đèn là có ích).',
        hints: ['Tìm $I_{\\text{đm}} = \\mathcal{P}_{\\text{đm}} / U_{\\text{đm}}$, rồi $U_b = U - U_{\\text{đ}}$ và $R_b = U_b / I_{\\text{đm}}$.'],
        solutionSteps: [
          'Bước 1: Đèn sáng bình thường nên $I = I_{\\text{đm}} = \\frac{3}{6} = 0{,}5\\text{ A}$ và $U_{\\text{đ}} = 6\\text{ V}$.',
          'Bước 2: Hiệu điện thế trên biến trở: $U_b = 9 - 6 = 3\\text{ V} \\Rightarrow R_b = \\frac{3}{0{,}5} = 6\\,\\Omega$.',
          'Bước 3: Hiệu suất $H = \\frac{U_{\\text{đ}}}{U}\\cdot 100\\% = \\frac{6}{9}\\cdot 100\\% \\approx 66{,}7\\%$.'
        ],
        finalAnswer: '$R_b = 6\\,\\Omega$; $H \\approx 66{,}7\\%$.'
      }
    ]
  }
];
