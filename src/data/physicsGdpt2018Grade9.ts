import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const SRC_9 = 'GDPT 2018 (Thông tư 32/2018) · KHTN 9 (KNTT / CTST / Cánh Diều)';

export const PHYSICS_GDPT_9_LESSONS: PhysicsLesson[] = [
  // ================= MỞ ĐẦU KHTN 9 (BÀI 1) =================
  {
    id: 'phys-9-b1',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Mở đầu · KHTN 9 (Dụng cụ & An toàn)',
    sourceTag: SRC_9,
    lessonNumber: 1,
    title: 'Bài 1: Nhận biết Dụng cụ Quang – Điện & An toàn Thực hành',
    subtitle: 'Thiết bị đo điện (Ampe kế, Vôn kế, Biến áp nguồn), băng quang học và quy tắc an toàn phòng thí nghiệm',
    description:
      'Mở đầu môn Khoa học Tự nhiên 9 (phần Vật lí, GDPT 2018): làm quen công dụng và giới hạn đo của ampe kế, vôn kế, cuộn dây, băng quang học, thấu kính và quy tắc an toàn khi thực hành điện – quang học.',
    theorySections: [
      {
        heading: '1. Dụng cụ Đo Điện & Nguồn Biến áp Thực hành',
        content:
          '• **Ampe kế** (kí hiệu chữ A) mắc **nối tiếp** để đo cường độ dòng điện; **Vôn kế** (kí hiệu chữ V) mắc **song song** để đo hiệu điện thế.\n• **Biến áp nguồn** cung cấp điện áp một chiều (DC) hoặc xoay chiều (AC) an toàn thấp ($3\\text{ V} \\dots 12\\text{ V}$) thay thế điện lưới $220\\text{ V}$.\n• **Cuộn dây dẫn có hai đèn LED** mắc song song ngược chiều dùng để kiểm tra chiều dòng điện cảm ứng và nhận biết dòng xoay chiều.'
      },
      {
        heading: '2. Bộ Dụng cụ Quang học & Quy tắc An toàn',
        content:
          '• **Băng quang học**, nguồn sáng khe chữ F, bản bán trụ thủy tinh, lăng kính, thấu kính hội tụ/phân kì và màn hứng ảnh dùng cho toàn bộ Chương II (Ánh sáng).\n• **An toàn thực hành**: Ngắt công tắc trước khi lắp/sửa mạch điện, kiểm tra đúng cực $(+), (-)$, không chiếu tia laser trực tiếp vào mắt và đọc vạch chia vuông góc mặt đồng hồ để tránh sai số thị sai.'
      }
    ],
    keyFormulas: [
      '\\text{Ampe kế: mắc nối tiếp} \\quad | \\quad \\text{Vôn kế: mắc song song}',
      '\\text{Độ chia nhỏ nhất (ĐCNN)} = \\frac{\\text{Khoảng chia hai vạch liên tiếp}}{\\text{Số khoảng}}',
      'U_{\\text{an toàn thực hành}} \\le 24\\text{ V}'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Khi lắp mạch điện thực hành đo điện trở bằng phương pháp Vôn kế – Ampe kế, cách mắc nào đúng quy tắc an toàn và kĩ thuật?',
        options: [
          'A. Ampe kế mắc nối tiếp với điện trở, Vôn kế mắc song song hai đầu điện trở',
          'B. Ampe kế mắc song song hai đầu nguồn điện, Vôn kế mắc nối tiếp',
          'C. Cả Ampe kế và Vôn kế đều mắc song song hai đầu nguồn',
          'D. Đóng công tắc trước rồi mới nối dây để kiểm tra tia lửa điện'
        ],
        correctIndex: 0,
        explanation: 'Ampe kế có điện trở rất nhỏ nên bắt buộc mắc nối tiếp với đoạn mạch cần đo; Vôn kế có điện trở rất lớn nên mắc song song hai đầu đoạn mạch và luôn ngắt nguồn khi lắp mạch.'
      },
      {
        source: SRC_9,
        question: 'Thiết bị nào sau đây dùng để xác định sự xuất hiện và chiều của dòng điện cảm ứng trong thí nghiệm KHTN 9?',
        options: [
          'A. Cuộn dây gắn hai đèn LED mắc song song ngược cực',
          'B. Thước kẹp Vernier',
          'C. Bản bán trụ bằng nhựa trong',
          'D. Lăng kính tam giác đều'
        ],
        correctIndex: 0,
        explanation: 'Hai đèn LED mắc song song ngược chiều giúp nhận biết ngay dòng điện cảm ứng xuất hiện và phân biệt chiều dòng điện (chỉ LED thuận chiều mới sáng, hoặc cả hai nhấp nháy luân phiên với dòng xoay chiều).'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Nêu 3 quy tắc an toàn bắt buộc khi sử dụng bộ thí nghiệm Quang học (có đèn laser) và bộ thí nghiệm Điện học trong phòng thực hành KHTN 9.',
        hints: ['Nhắc tới nguồn điện an toàn, ngắt mạch khi lắp và an toàn tia laser với mắt.'],
        solutionSteps: [
          '1. An toàn điện: Chỉ dùng biến áp nguồn điện áp thấp (≤ 12 V – 24 V), luôn ngắt công tắc trước khi tháo lắp dây dẫn và không dùng tay ướt chạm vào mạch.',
          '2. Bảo vệ đồng hồ đo: Chọn thang đo có giới hạn đo lớn hơn giá trị dự kiến, mắc đúng cực (+)/(-) của ampe kế nối tiếp và vôn kế song song.',
          '3. An toàn quang học: Tuyệt đối không chiếu tia laser trực tiếp hoặc phản xạ từ gương/thủy tinh vào mắt người; nhẹ tay với các chi tiết thủy tinh.'
        ],
        finalAnswer: 'Ngắt điện trước khi lắp mạch, chọn đúng thang đo & cực đồng hồ, và không chiếu tia laser vào mắt.'
      }
    ]
  },

  // ================= CHƯƠNG I. NĂNG LƯỢNG CƠ HỌC (BÀI 2 - BÀI 4) =================
  {
    id: 'phys-9-mech-heat',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương I · Năng lượng cơ học',
    sourceTag: SRC_9,
    lessonNumber: 2,
    title: 'Bài 2: Động năng. Thế năng',
    subtitle: 'Năng lượng do chuyển động (Động năng W_đ) và năng lượng do độ cao trọng trường (Thế năng W_t)',
    description:
      'Chuẩn GDPT 2018 KHTN 9 (Mở đầu phần Vật lí): thiết lập biểu thức động năng $W_đ = \\frac{1}{2}mv^2$, thế năng trọng trường $W_t = Ph = 10mh$ và phân tích các yếu tố ảnh hưởng qua thí nghiệm rơi tự do.',
    theorySections: [
      {
        heading: '1. Động năng của vật chuyển động',
        content:
          '• **Khái niệm**: Mọi vật đang chuyển động đều có năng lượng gọi là **động năng** ($W_đ$).\n• **Biểu thức**: $W_đ = \\frac{1}{2}mv^2$, trong đó $m$ là khối lượng ($\\text{kg}$), $v$ là tốc độ ($\\text{m/s}$), $W_đ$ là động năng ($\\text{J}$).\n• Vật có khối lượng càng lớn và chuyển động càng nhanh thì động năng càng lớn (động năng tỉ lệ với **bình phương** tốc độ: tốc độ tăng gấp đôi thì động năng tăng 4 lần).'
      },
      {
        heading: '2. Thế năng trọng trường',
        content:
          '• **Khái niệm**: Vật ở độ cao $h$ so với một mốc chọn (thường là mặt đất) có năng lượng gọi là **thế năng trọng trường** ($W_t$).\n• **Biểu thức**: $W_t = P \\cdot h = 10mh$ (hoặc $mgh$ với $g \\approx 9{,}8\\text{ m/s}^2$).\n• Thế năng phụ thuộc vào khối lượng vật và độ cao so với mốc thế năng đã chọn.'
      },
      {
        heading: '3. Ghi nhớ đơn vị SI & Tình huống thực tế',
        content:
          '• Luôn quy đổi chuẩn SI: $1\\text{ tấn} = 1000\\text{ kg}$, $1\\text{ km/h} = \\frac{1}{3{,}6}\\text{ m/s}$, $1\\text{ kJ} = 1000\\text{ J}$.\n• Xe chạy tốc độ lớn gây nguy hiểm giao thông gấp bội vì động năng tăng theo $v^2$ (khoảng cách phanh tăng 4 lần khi tốc độ tăng 2 lần).'
      }
    ],
    keyFormulas: [
      'W_đ = \\frac{1}{2}mv^2 \\quad (\\text{J})',
      'W_t = P \\cdot h = mgh \\quad (\\text{với } P \\approx 10m\\text{ hoặc } mg)',
      '1\\text{ m/s} = 3{,}6\\text{ km/h}, \\quad 1\\text{ kJ} = 1000\\text{ J}'
    ],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Một ô tô khối lượng $1{,}5\\text{ tấn}$ chạy với tốc độ $72\\text{ km/h}$ trên đường phẳng ngang có động năng bằng:',
        options: ['A. 300 kJ', 'B. 600 kJ', 'C. 300 J', 'D. 3888 kJ'],
        correctIndex: 0,
        explanation: 'Đổi $m = 1500\\text{ kg}$, $v = 72 / 3{,}6 = 20\\text{ m/s}$. Động năng $W_đ = \\frac{1}{2} \\cdot 1500 \\cdot 20^2 = 300\\,000\\text{ J} = 300\\text{ kJ}$.'
      },
      {
        source: SRC_9,
        question: 'Một thùng hàng khối lượng $40\\text{ kg}$ được đặt ở độ cao $5\\text{ m}$ so với mặt sân (lấy $P = 10m$). Thế năng trọng trường của thùng hàng so với mặt sân là:',
        options: ['A. 200 J', 'B. 2 000 J', 'C. 400 J', 'D. 20 000 J'],
        correctIndex: 1,
        explanation: 'Trọng lượng $P = 10 \\cdot 40 = 400\\text{ N}$. Thế năng $W_t = P \\cdot h = 400 \\cdot 5 = 2000\\text{ J}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'So sánh động năng của một xe máy khối lượng $150\\text{ kg}$ chạy ở tốc độ $36\\text{ km/h}$ và khi tăng tốc lên $72\\text{ km/h}$. Giải thích vì sao chạy quá tốc độ làm nguy cơ tai nạn tăng mạnh.',
        hints: ['Đổi tốc độ sang m/s rồi tính $W_{đ1}, W_{đ2}$ bằng $\\frac{1}{2}mv^2$.'],
        solutionSteps: [
          'Bước 1: $v_1 = 36\\text{ km/h} = 10\\text{ m/s} \\implies W_{đ1} = 0{,}5 \\cdot 150 \\cdot 10^2 = 7500\\text{ J}$.',
          'Bước 2: $v_2 = 72\\text{ km/h} = 20\\text{ m/s} \\implies W_{đ2} = 0{,}5 \\cdot 150 \\cdot 20^2 = 30\\,000\\text{ J}$.',
          'Bước 3: Khi tốc độ tăng 2 lần, động năng tăng $2^2 = 4$ lần khiến lực hãm phải sinh công lớn gấp 4 lần mới dừng được xe.'
        ],
        finalAnswer: '$W_{đ1} = 7{,}5\\text{ kJ}$; $W_{đ2} = 30\\text{ kJ}$ (tăng 4 lần).'
      }
    ]
  },

  {
    id: 'phys-9-power-bill',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương I · Năng lượng cơ học',
    sourceTag: SRC_9,
    lessonNumber: 3,
    title: 'Bài 3: Cơ năng & Bảo toàn Cơ năng',
    subtitle: 'Tổng động năng và thế năng, sự chuyển hóa qua lại và định luật bảo toàn cơ năng trong trọng trường',
    description:
      'Hiểu bản chất cơ năng $W = W_đ + W_t$, phân tích sự chuyển hóa liên tục giữa động năng và thế năng khi vật rơi, ném lên hay con lắc dao động, và nhận biết hao phí cơ năng khi có ma sát.',
    theorySections: [
      {
        heading: '1. Định nghĩa Cơ năng',
        content:
          '• **Cơ năng** của một vật là tổng động năng và thế năng của vật đó: $W = W_đ + W_t = \\frac{1}{2}mv^2 + P\\cdot h$ (đơn vị Jun, $\\text{J}$).'
      },
      {
        heading: '2. Sự chuyển hóa & Bảo toàn Cơ năng',
        content:
          '• Khi con lắc dao động hoặc vật rơi: ở vị trí cao nhất vật có thế năng cực đại và động năng bằng $0$; khi đi xuống độ cao giảm dần thì thế năng chuyển hóa thành động năng; qua vị trí thấp nhất động năng cực đại.\n• Nếu bỏ qua mọi lực cản và ma sát, tổng cơ năng được **bảo toàn**: $W_đ + W_t = \\text{hằng số}$.\n• Khi có ma sát/lực cản: cơ năng giảm dần do một phần cơ năng chuyển hóa thành nhiệt năng và âm thanh.'
      }
    ],
    keyFormulas: [
      'W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh',
      'W_{\\text{trước}} = W_{\\text{sau}} \\quad (\\text{khi không có lực cản/ma sát})',
      'v_{\\text{chạm đất}} = \\sqrt{2gh_0}'
    ],
    ...SIM_PRESETS.pendulum,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Một quả cầu khối lượng $m = 2\\text{ kg}$ được thả rơi không vận tốc đầu từ độ cao $h_0 = 5\\text{ m}$ ($g = 10\\text{ m/s}^2$, bỏ qua cản không khí). Khi ở độ cao $2\\text{ m}$, động năng của quả cầu bằng:',
        options: ['A. 40 J', 'B. 60 J', 'C. 100 J', 'D. 20 J'],
        correctIndex: 1,
        explanation: 'Cơ năng ban đầu $W = 2 \\cdot 10 \\cdot 5 = 100\\text{ J}$. Tại $h = 2\\text{ m}$, thế năng $W_t = 2 \\cdot 10 \\cdot 2 = 40\\text{ J} \\implies W_đ = 100 - 40 = 60\\text{ J}$.'
      },
      {
        source: SRC_9,
        question: 'Trong quá trình con lắc đơn chuyển động từ vị trí biên cao nhất xuống vị trí cân bằng thấp nhất, sự chuyển hóa năng lượng diễn ra như thế nào?',
        options: [
          'A. Động năng chuyển hóa thành thế năng',
          'B. Thế năng chuyển hóa thành động năng',
          'C. Cơ năng tăng lên liên tục',
          'D. Nhiệt năng chuyển hóa thành thế năng'
        ],
        correctIndex: 1,
        explanation: 'Khi con lắc đi xuống, độ cao giảm nên thế năng giảm, đồng thời tốc độ tăng nên động năng tăng: thế năng chuyển hóa thành động năng.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Ném thẳng đứng lên cao một hòn bi khối lượng $200\\text{ g}$ từ mặt đất với tốc độ ban đầu $v_0 = 10\\text{ m/s}$ (lấy $g = 10\\text{ m/s}^2$, bỏ qua lực cản không khí). Tính cơ năng ban đầu và độ cao cực đại bi đạt được.',
        hints: ['Đổi $200\\text{ g} = 0{,}2\\text{ kg}$. Tại điểm cao nhất $v = 0$ nên toàn bộ cơ năng thành thế năng.'],
        solutionSteps: [
          'Bước 1: Cơ năng ban đầu tại mặt đất ($h = 0$): $W = W_{đ0} = \\frac{1}{2} \\cdot 0{,}2 \\cdot 10^2 = 10\\text{ J}$.',
          'Bước 2: Tại độ cao cực đại $h_{\\max}$, $v = 0 \\implies W = mgh_{\\max} = 10\\text{ J}$.',
          'Bước 3: $h_{\\max} = \\frac{10}{0{,}2 \\cdot 10} = 5\\text{ m}$.'
        ],
        finalAnswer: '$W = 10\\text{ J}$, độ cao cực đại $h_{\\max} = 5\\text{ m}$.'
      }
    ]
  },

  {
    id: 'phys-9-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương I · Năng lượng cơ học',
    sourceTag: SRC_9,
    lessonNumber: 4,
    title: 'Bài 4: Công và Công suất',
    subtitle: 'Công cơ học A = F·s, tốc độ sinh công P = A/t và hiệu suất máy cơ đơn giản',
    description:
      'Phân biệt điều kiện có công cơ học, tính công $A = F\\cdot s$ khi lực làm vật dịch chuyển theo hướng lực, tính công suất $P = A/t = F\\cdot v$ và đánh giá hiệu suất thiết bị cơ học.',
    theorySections: [
      {
        heading: '1. Công cơ học',
        content:
          '• Có **công cơ học** khi lực tác dụng vào vật làm vật dịch chuyển.\n• Khi lực không đổi $F$ kéo vật dịch chuyển quãng đường $s$ theo đúng hướng lực: $A = F \\cdot s$ (đơn vị Jun, $1\\text{ J} = 1\\text{ N}\\cdot\\text{m}$).'
      },
      {
        heading: '2. Công suất — Tốc độ thực hiện công',
        content:
          '• **Công suất** đo bằng công thực hiện được trong một đơn vị thời gian: $P = \\frac{A}{t}$ (đơn vị Oát, $1\\text{ W} = 1\\text{ J/s}$, $1\\text{ kW} = 1000\\text{ W}$).\n• Khi chuyển động thẳng đều với tốc độ $v$: $P = F \\cdot v$.'
      }
    ],
    keyFormulas: [
      'A = F \\cdot s',
      'P = \\frac{A}{t} = F \\cdot v',
      'H = \\frac{A_{\\text{ích}}}{A_{\\text{tp}}} \\cdot 100\\%'
    ],
    simulationType: 'work_power_joule',
    sim3dType: 'atwood_pulley_3d',
    defaultParams: { force: 80, angle: 0, mu: 0.15 },
    paramBounds: {
      force: { min: 20, max: 200, step: 10, unit: 'N', label: 'Lực kéo F' },
      angle: { min: 0, max: 75, step: 5, unit: '°', label: 'Góc kéo α' },
      mu: { min: 0, max: 0.5, step: 0.05, unit: '', label: 'Ma sát μ' }
    },
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Một cần cẩu nâng thùng hàng khối lượng $500\\text{ kg}$ lên cao $12\\text{ m}$ trong $20\\text{ s}$ ($g = 10\\text{ m/s}^2$). Công suất tối thiểu của cần cẩu là:',
        options: ['A. 3 000 W', 'B. 60 000 W', 'C. 300 W', 'D. 1 500 W'],
        correctIndex: 0,
        explanation: 'Công nâng $A = P\\cdot h = 5000 \\cdot 12 = 60\\,000\\text{ J}$. Công suất $P = \\frac{60\\,000}{20} = 3000\\text{ W}$.'
      },
      {
        source: SRC_9,
        question: 'Một đầu máy kéo toa tàu chuyển động đều với tốc độ $54\\text{ km/h}$ bằng lực kéo $20\\,000\\text{ N}$. Công suất của đầu máy là:',
        options: ['A. 300 kW', 'B. 1 080 kW', 'C. 30 kW', 'D. 150 kW'],
        correctIndex: 0,
        explanation: 'Đổi $v = 54/3{,}6 = 15\\text{ m/s}$. Công suất $P = F \\cdot v = 20\\,000 \\cdot 15 = 300\\,000\\text{ W} = 300\\text{ kW}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Dùng mặt phẳng nghiêng dài $4\\text{ m}$ kéo đều một thùng hàng nặng $600\\text{ N}$ lên cao $1{,}2\\text{ m}$ bằng lực kéo $F = 240\\text{ N}$. Tính công có ích, công toàn phần và hiệu suất của mặt phẳng nghiêng.',
        hints: ['$A_i = P \\cdot h$, $A_{tp} = F \\cdot l$, hiệu suất $H = (A_i / A_{tp}) \\cdot 100\\%$.'],
        solutionSteps: [
          'Bước 1: Công có ích: $A_i = P \\cdot h = 600 \\cdot 1{,}2 = 720\\text{ J}$.',
          'Bước 2: Công toàn phần: $A_{tp} = F \\cdot l = 240 \\cdot 4 = 960\\text{ J}$.',
          'Bước 3: Hiệu suất mặt phẳng nghiêng: $H = \\frac{720}{960} \\cdot 100\\% = 75\\%$.'
        ],
        finalAnswer: '$A_i = 720\\text{ J}$, $A_{tp} = 960\\text{ J}$, hiệu suất $H = 75\\%$.'
      }
    ]
  },

  // ================= CHƯƠNG II. ÁNH SÁNG (BÀI 5 - BÀI 10) =================
  {
    id: 'phys-9-b5',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương II · Ánh sáng',
    sourceTag: SRC_9,
    lessonNumber: 5,
    title: 'Bài 5: Khúc xạ ánh sáng',
    subtitle: 'Hiện tượng gãy khúc tia sáng tại mặt phân cách, định luật khúc xạ và chiết suất môi trường',
    description:
      'Khảo sát đường đi của tia sáng truyền xiên góc qua hai môi trường trong suốt, phát biểu định luật khúc xạ $\\frac{\\sin i}{\\sin r} = \\frac{n_2}{n_1}$ và giải thích hiện tượng bể nước trông nông hơn thực tế.',
    theorySections: [
      {
        heading: '1. Hiện tượng khúc xạ ánh sáng',
        content:
          '• **Khúc xạ ánh sáng** là hiện tượng tia sáng bị gãy khúc (lệch khỏi phương truyền thẳng) tại mặt phân cách khi truyền xiên góc từ môi trường trong suốt này sang môi trường trong suốt khác.\n• Nếu chiếu vuông góc với mặt phân cách ($i = 0^\\circ$) thì tia sáng truyền thẳng ($r = 0^\\circ$).'
      },
      {
        heading: '2. Định luật khúc xạ ánh sáng & Chiết suất',
        content:
          '• Tia khúc xạ nằm trong mặt phẳng tới và ở bên kia pháp tuyến so với tia tới.\n• Tỉ số $\\frac{\\sin i}{\\sin r}$ luôn không đổi đối với hai môi trường xác định: $n_1 \\sin i = n_2 \\sin r \\iff \\frac{\\sin i}{\\sin r} = \\frac{n_2}{n_1}$.\n• **Chiết suất tuyệt đối**: $n = \\frac{c}{v}$ ($c = 3\\cdot 10^8\\text{ m/s}$ là tốc độ ánh sáng trong chân không). Không khí $n \\approx 1$, nước $n \\approx 1{,}333$, thủy tinh $n \\approx 1{,}5$.'
      }
    ],
    keyFormulas: [
      'n_1 \\sin i = n_2 \\sin r \\iff \\frac{\\sin i}{\\sin r} = \\frac{n_2}{n_1}',
      'n = \\frac{c}{v} \\ge 1'
    ],
    simulationType: 'light_refraction',
    sim3dType: 'optics_3d',
    defaultParams: { angleI: 45, n1: 1.0, n2: 1.5 },
    paramBounds: {
      angleI: { min: 0, max: 85, step: 1, unit: '°', label: 'Góc tới i' },
      n1: { min: 1.0, max: 2.0, step: 0.05, unit: '', label: 'Chiết suất n₁' },
      n2: { min: 1.0, max: 2.4, step: 0.05, unit: '', label: 'Chiết suất n₂' }
    },
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Khi ánh sáng truyền từ không khí ($n_1 = 1$) vào nước ($n_2 = 4/3$) dưới góc tới $i = 45^\\circ$, so sánh góc khúc xạ $r$ và góc tới $i$:',
        options: ['A. r < i', 'B. r > i', 'C. r = i', 'D. r = 90°'],
        correctIndex: 0,
        explanation: '$\\sin r = \\frac{3}{4}\\sin 45^\\circ < \\sin 45^\\circ \\implies r < i$ (tia khúc xạ lệch gần pháp tuyến hơn).'
      },
      {
        source: SRC_9,
        question: 'Chiếu tia sáng từ không khí vào thủy tinh có chiết suất $n = 1{,}5$ với góc tới $i = 60^\\circ$. Giá trị $\\sin r$ bằng:',
        options: ['A. √3 / 3', 'B. √3 / 2', 'C. 0,5', 'D. 0,75'],
        correctIndex: 0,
        explanation: 'Áp dụng $1\\cdot\\sin 60^\\circ = 1{,}5 \\sin r \\implies \\sin r = \\frac{\\sqrt{3}/2}{3/2} = \\frac{\\sqrt{3}}{3} \\approx 0{,}577$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Tia sáng truyền từ không khí ($n_1 = 1$) vào chất lỏng trong suốt với góc tới $i = 45^\\circ$, góc khúc xạ đo được là $r = 30^\\circ$. Tính chiết suất $n_2$ của chất lỏng và tốc độ ánh sáng trong chất lỏng này.',
        hints: ['Dùng $n_2 = \\frac{\\sin i}{\\sin r}$ và $v = \\frac{c}{n_2}$ với $c = 3\\cdot 10^8\\text{ m/s}$.'],
        solutionSteps: [
          'Bước 1: $n_2 = \\frac{\\sin 45^\\circ}{\\sin 30^\\circ} = \\frac{\\sqrt{2}/2}{1/2} = \\sqrt{2} \\approx 1{,}414$.',
          'Bước 2: Tốc độ ánh sáng trong chất lỏng: $v = \\frac{3\\cdot 10^8}{\\sqrt{2}} \\approx 2{,}12\\cdot 10^8\\text{ m/s}$.'
        ],
        finalAnswer: '$n_2 = \\sqrt{2} \\approx 1{,}414$; $v \\approx 2{,}12\\cdot 10^8\\text{ m/s}$.'
      }
    ]
  },

  {
    id: 'phys-9-b6',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương II · Ánh sáng',
    sourceTag: SRC_9,
    lessonNumber: 6,
    title: 'Bài 6: Phản xạ toàn phần',
    subtitle: 'Góc tới hạn i_th, hai điều kiện phản xạ toàn phần và ứng dụng cáp quang – y học nội soi',
    description:
      'Khám phá hiện tượng toàn bộ tia tới bị phản xạ trở lại môi trường ban đầu khi truyền từ môi trường chiết quang sang chiết quang kém, công thức góc tới hạn $\\sin i_{th} = n_2 / n_1$ và nguyên lý sợi cáp quang.',
    theorySections: [
      {
        heading: '1. Định nghĩa & Điều kiện Phản xạ toàn phần',
        content:
          '• **Phản xạ toàn phần** là hiện tượng phản xạ toàn bộ tia sáng tới xảy ra ở mặt phân cách giữa hai môi trường trong suốt (không còn tia khúc xạ).\n• **Hai điều kiện bắt buộc**:\n  1. Ánh sáng truyền từ môi trường chiết suất lớn sang môi trường chiết suất nhỏ hơn ($n_1 > n_2$).\n  2. Góc tới lớn hơn hoặc bằng góc tới hạn ($i \\ge i_{th}$), với $\\sin i_{th} = \\frac{n_2}{n_1}$.'
      },
      {
        heading: '2. Ứng dụng Cáp quang & Hiện tượng tự nhiên',
        content:
          '• **Sợi cáp quang**: Gồm lõi thủy tinh chiết suất cao ($n_1$) bọc bởi vỏ chiết suất thấp hơn ($n_2 < n_1$). Tia sáng liên tiếp phản xạ toàn phần trong lõi nên truyền đi hàng chục km trong mạng Internet tốc độ cao và ống nội soi y học.\n• **Ảo ảnh sa mạc / mặt đường nhựa nóng**: Lớp không khí sát mặt đường nóng hơn có chiết suất nhỏ hơn lớp không khí bên trên gây phản xạ toàn phần ánh sáng bầu trời.'
      }
    ],
    keyFormulas: [
      'n_1 > n_2 \\quad \\text{và} \\quad i \\ge i_{th}',
      '\\sin i_{th} = \\frac{n_2}{n_1}'
    ],
    simulationType: 'fiber_optic_tir',
    sim3dType: 'fiber_optic_3d',
    defaultParams: { nCore: 1.52, nClad: 1.36, launchAngleDeg: 22 },
    paramBounds: {
      nCore: { min: 1.4, max: 1.8, step: 0.02, unit: '', label: 'Chiết suất lõi n₁' },
      nClad: { min: 1.0, max: 1.48, step: 0.02, unit: '', label: 'Chiết suất vỏ n₂' },
      launchAngleDeg: { min: 5, max: 58, step: 1, unit: '°', label: 'Góc phóng tia θ' }
    },
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Tính góc tới hạn phản xạ toàn phần khi ánh sáng truyền từ thủy tinh ($n_1 = 1{,}5$) ra không khí ($n_2 = 1$):',
        options: ['A. ≈ 41,8°', 'B. 30°', 'C. 48,6°', 'D. 60°'],
        correctIndex: 0,
        explanation: '$\\sin i_{th} = \\frac{1}{1{,}5} = \\frac{2}{3} \\implies i_{th} = \\arcsin(2/3) \\approx 41{,}8^\\circ$.'
      },
      {
        source: SRC_9,
        question: 'Cáp quang truyền tín hiệu ánh sáng đi xa mà hầu như không bị lọt ra ngoài vỏ dựa trên hiện tượng nào?',
        options: ['A. Tán sắc ánh sáng', 'B. Phản xạ toàn phần liên tiếp', 'C. Giao thoa ánh sáng', 'D. Nhiễu xạ ánh sáng'],
        correctIndex: 1,
        explanation: 'Lõi cáp quang có $n_1 > n_2$ của lớp vỏ và tia sáng tới mặt phân cách dưới góc lớn hơn $i_{th}$ nên phản xạ toàn phần liên tiếp.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một sợi quang học có lõi bằng thủy tinh chiết suất $n_1 = 1{,}5$ và vỏ bọc chiết suất $n_2 = 1{,}3$. Tìm góc tới hạn $i_{th}$ tại mặt phân cách giữa lõi và vỏ.',
        hints: ['Áp dụng $\\sin i_{th} = n_2 / n_1$.'],
        solutionSteps: [
          'Bước 1: Do $n_1 = 1{,}5 > n_2 = 1{,}3$ nên điều kiện 1 thỏa mãn.',
          'Bước 2: $\\sin i_{th} = \\frac{1{,}3}{1{,}5} \\approx 0{,}8667 \\implies i_{th} \\approx 60{,}1^\\circ$.'
        ],
        finalAnswer: '$i_{th} \\approx 60{,}1^\\circ$.'
      }
    ]
  },

  {
    id: 'phys-9-energy-refract',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương II · Ánh sáng',
    sourceTag: SRC_9,
    lessonNumber: 7,
    title: 'Bài 7: Lăng kính & Tán sắc Ánh sáng',
    subtitle: 'Đường truyền tia sáng qua lăng kính, sự tán sắc ánh sáng trắng và màu sắc vật',
    description:
      'Giải thích vì sao tia sáng luôn bị lệch về phía đáy lăng kính, hiện tượng ánh sáng trắng tách thành dải cầu vồng Đỏ → Tím ($n_{\\text{đỏ}} < n_{\\text{tím}}$) và cơ chế tạo màu sắc của các vật.',
    theorySections: [
      {
        heading: '1. Đường truyền tia sáng qua Lăng kính & Tán sắc',
        content:
          '• Lăng kính là khối chất trong suốt hình lăng trụ tam giác. Mọi tia sáng đơn sắc đi qua lăng kính đều bị khúc xạ 2 lần và **lệch về phía đáy** lăng kính.\n• Khi chiếu chùm ánh sáng trắng hẹp qua lăng kính, ta thu được dải màu liên tục **Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím** — gọi là **sự tán sắc ánh sáng**.\n• Nguyên nhân: Chiết suất thủy tinh phụ thuộc màu sắc ($n_{\\text{đỏ}} < \\dots < n_{\\text{tím}}$), nên tia đỏ lệch ít nhất và tia tím lệch nhiều nhất.'
      },
      {
        heading: '2. Ánh sáng đơn sắc & Màu sắc các vật',
        content:
          '• **Ánh sáng đơn sắc** là ánh sáng có một màu nhất định và không bị tách màu thêm khi qua lăng kính.\n• Một vật dưới ánh sáng trắng có màu nào là do bề mặt vật phản xạ mạnh ánh sáng màu đó và hấp thụ các màu còn lại (vật màu đen hấp thụ hầu hết mọi màu).'
      }
    ],
    keyFormulas: [
      'n_1 \\sin i = n_2 \\sin r \\quad (n_{\\text{đỏ}} < n_{\\text{tím}})',
      'D_{\\text{đỏ}} < D_{\\text{vàng}} < D_{\\text{lục}} < D_{\\text{tím}}'
    ],
    ...SIM_PRESETS.prism,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Khi chiếu chùm ánh sáng trắng hẹp đi qua lăng kính thủy tinh, tia sáng bị lệch về phía đáy ít nhất là tia màu:',
        options: ['A. Đỏ', 'B. Vàng', 'C. Lục', 'D. Tím'],
        correctIndex: 0,
        explanation: 'Trong thủy tinh $n_{\\text{đỏ}}$ nhỏ nhất nên tia đỏ bị khúc xạ lệch ít nhất, tia tím lệch nhiều nhất.'
      },
      {
        source: SRC_9,
        question: 'Chiếu ánh sáng đơn sắc màu lục vào một tấm bìa màu đỏ trong phòng tối, mắt nhìn tấm bìa sẽ thấy màu gì?',
        options: ['A. Màu đỏ', 'B. Màu lục', 'C. Màu đen', 'D. Màu vàng'],
        correctIndex: 2,
        explanation: 'Vật màu đỏ chỉ phản xạ tốt ánh sáng đỏ và hấp thụ các màu khác, nên khi chỉ có ánh sáng lục chiếu vào nó hấp thụ hết và trông gần như màu đen.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Giải thích vì sao sau cơn mưa trời hửng nắng, khi quay lưng về phía Mặt Trời ta thường quan sát thấy cầu vồng 7 sắc trên bầu trời.',
        hints: ['Các giọt nước mưa li ti đóng vai trò như những lăng kính/giọt cầu tán sắc.'],
        solutionSteps: [
          'Bước 1: Ánh sáng trắng từ Mặt Trời chiếu vào vô số giọt nước mưa lơ lửng trong không khí.',
          'Bước 2: Tia sáng bị khúc xạ khi đi vào giọt nước, phản xạ bên trong giọt nước rồi khúc xạ ló ra ngoài.',
          'Bước 3: Vì chiết suất của nước với từng màu khác nhau ($n_{\\text{đỏ}} < n_{\\text{tím}}$), ánh sáng trắng bị tán sắc thành các dải màu từ đỏ đến tím đi tới mắt người quan sát.'
        ],
        finalAnswer: 'Do hiện tượng khúc xạ, phản xạ bên trong và tán sắc ánh sáng trắng qua hàng triệu giọt nước mưa.'
      }
    ]
  },

  {
    id: 'phys-9-optics',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương II · Ánh sáng',
    sourceTag: SRC_9,
    lessonNumber: 8,
    title: 'Bài 8: Thấu kính',
    subtitle: 'Phân biệt thấu kính rìa mỏng (hội tụ) – rìa dày (phân kì), 3 tia đặc biệt & cách dựng ảnh',
    description:
      'Làm chủ cấu tạo và tác dụng quang học của thấu kính hội tụ và phân kì, xác định quang tâm $O$, trục chính, tiêu điểm $F$, tiêu cự $f$ và dựng ảnh vật sáng $AB$ chuẩn xác bằng các tia sáng đặc biệt.',
    theorySections: [
      {
        heading: '1. Thấu kính rìa mỏng (Hội tụ) & rìa dày (Phân kì)',
        content:
          '• **Thấu kính rìa mỏng (hội tụ)**: Chiếu chùm tia tới song song trục chính cho chùm tia ló hội tụ tại tiêu điểm ảnh chính $F\'$.\n• **Thấu kính rìa dày (phân kì)**: Chiếu chùm tia tới song song trục chính cho chùm tia ló loe rộng ra, có đường kéo dài cắt nhau tại tiêu điểm $F\'$.'
      },
      {
        heading: '2. Các tia sáng đặc biệt dựng ảnh qua thấu kính',
        content:
          '• **Tia qua quang tâm $O$**: truyền thẳng không đổi hướng.\n• **Tia song song trục chính**: tia ló (hoặc đường kéo dài) đi qua tiêu điểm ảnh $F\'$.\n• **Tia đi qua (hoặc hướng tới) tiêu điểm vật $F$**: cho tia ló song song trục chính.\n• **Đặc điểm ảnh**: Thấu kính hội tụ cho ảnh thật ngược chiều khi $d > f$, ảnh ảo cùng chiều lớn hơn vật khi $d < f$. Thấu kính phân kì luôn cho ảnh ảo, cùng chiều, nhỏ hơn vật.'
      }
    ],
    keyFormulas: [
      '\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}',
      'k = -\\frac{d\'}{d} = \\frac{\\overline{A\'B\'}}{\\overline{AB}}'
    ],
    simulationType: 'lens_optics',
    sim3dType: 'optics_3d',
    defaultParams: { f: 15, d: 35, objH: 10 },
    paramBounds: {
      f: { min: -25, max: 30, step: 1, unit: 'cm', label: 'Tiêu cự f (>0 HT, <0 PK)' },
      d: { min: 5, max: 60, step: 1, unit: 'cm', label: 'Khoảng cách vật (d)' },
      objH: { min: 4, max: 16, step: 1, unit: 'cm', label: 'Chiều cao vật AB' }
    },
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Đặt vật sáng $AB$ trước thấu kính hội tụ tiêu cự $f = 12\\text{ cm}$ ở vị trí $d = 24\\text{ cm}$. Ảnh $A\'B\'$ có đặc điểm nào?',
        options: [
          'A. Ảnh thật, ngược chiều, bằng vật',
          'B. Ảnh thật, ngược chiều, lớn hơn vật',
          'C. Ảnh ảo, cùng chiều, lớn hơn vật',
          'D. Ảnh ảo, cùng chiều, nhỏ hơn vật'
        ],
        correctIndex: 0,
        explanation: 'Vì $d = 2f = 24\\text{ cm}$, ảnh thật thu được cũng ở $d\' = 2f = 24\\text{ cm}$, ngược chiều và cao đúng bằng vật.'
      },
      {
        source: SRC_9,
        question: 'Tính chất ảnh của vật thật qua thấu kính phân kì luôn là:',
        options: [
          'A. Ảnh ảo, cùng chiều, nhỏ hơn vật',
          'B. Ảnh thật, ngược chiều, nhỏ hơn vật',
          'C. Ảnh ảo, cùng chiều, lớn hơn vật',
          'D. Ảnh thật, cùng chiều, bằng vật'
        ],
        correctIndex: 0,
        explanation: 'Mọi vật thật đặt trước thấu kính phân kì đều luôn cho ảnh ảo cùng chiều và nhỏ hơn vật nằm trong khoảng $OF$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Đặt vật sáng $AB$ cao $2\\text{ cm}$ vuông góc với trục chính của thấu kính hội tụ có tiêu cự $f = 15\\text{ cm}$, cách thấu kính $d = 10\\text{ cm}$. Xác định tính chất, vị trí và chiều cao ảnh $A\'B\'$.',
        hints: ['Vì $d < f$, ảnh là ảnh ảo ($d\' < 0$). Dùng $\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}$ hoặc tam giác đồng dạng.'],
        solutionSteps: [
          'Bước 1: $\\frac{1}{d\'} = \\frac{1}{15} - \\frac{1}{10} = -\\frac{1}{30} \\implies d\' = -30\\text{ cm}$.',
          'Bước 2: Ảnh ảo, cùng chiều, cách thấu kính $30\\text{ cm}$.',
          'Bước 3: Chiều cao ảnh: $A\'B\' = AB \\cdot \\frac{|d\'|}{d} = 2 \\cdot \\frac{30}{10} = 6\\text{ cm}$.'
        ],
        finalAnswer: 'Ảnh ảo, cùng chiều, cách thấu kính $30\\text{ cm}$, cao $6\\text{ cm}$.'
      }
    ]
  },

  {
    id: 'phys-9-b9',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương II · Ánh sáng',
    sourceTag: SRC_9,
    lessonNumber: 9,
    title: 'Bài 9: Thực hành đo tiêu cự của Thấu kính Hội tụ',
    subtitle: 'Hai phương án thí nghiệm KHTN 9: dùng chùm sáng song song và phương pháp d = d\' = 2f (L = 4f)',
    description:
      'Tìm hiểu quy trình lắp đặt giá quang học thực hành đo tiêu cự $f$ thấu kính hội tụ bằng phương pháp vật rất xa và phương pháp đối xứng tạo ảnh thật ngược chiều cao bằng vật.',
    theorySections: [
      {
        heading: '1. Phương pháp 1: Hứng ảnh của vật rất xa (Mặt Trời)',
        content:
          '• Chùm tia từ vật ở rất xa ($d \\gg f$) coi như song song với trục chính thấu kính hội tụ.\n• Di chuyển màn hứng ảnh tới khi thu được chấm sáng rõ nét nhất trên màn → khoảng cách từ thấu kính tới màn chính bằng tiêu cự $f$.'
      },
      {
        heading: '2. Phương pháp 2: Dùng ảnh thật cao bằng vật (L = 4f)',
        content:
          '• Đặt vật sáng chữ F và màn hứng ảnh đối xứng qua thấu kính sao cho $d = d\'$.\n• Điều chỉnh tới khi ảnh hiện rõ nét và cao đúng bằng vật ($A\'B\' = AB$): lúc này $d = d\' = 2f$, suy ra khoảng cách vật – màn là $L = d + d\' = 4f \\implies f = \\frac{L}{4}$.'
      }
    ],
    keyFormulas: [
      'd = d\' = 2f \\implies L = d + d\' = 4f \\implies f = \\frac{L}{4}'
    ],
    simulationType: 'lens_optics',
    sim3dType: 'optics_3d',
    defaultParams: { f: 15, d: 30, objH: 10 },
    paramBounds: {
      f: { min: 8, max: 25, step: 1, unit: 'cm', label: 'Tiêu cự f' },
      d: { min: 10, max: 60, step: 1, unit: 'cm', label: 'Khoảng cách vật d' },
      objH: { min: 4, max: 14, step: 1, unit: 'cm', label: 'Chiều cao khe chữ F' }
    },
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Trong bài thực hành đo tiêu cự thấu kính hội tụ, khi điều chỉnh sao cho vật $AB$ và ảnh thật $A\'B\'$ trên màn có kích thước bằng nhau thì khoảng cách từ vật tới màn đo được là $L = 60\\text{ cm}$. Tiêu cự $f$ của thấu kính là:',
        options: ['A. 15 cm', 'B. 30 cm', 'C. 20 cm', 'D. 12 cm'],
        correctIndex: 0,
        explanation: 'Khi ảnh thật cao bằng vật thì $d = d\' = 2f \\implies L = 4f = 60\\text{ cm} \\implies f = 15\\text{ cm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một học sinh thực hiện 3 lần đo khoảng cách $L$ khi ảnh thật cao bằng vật trên màn cho kết quả: $48{,}0\\text{ cm}$; $48{,}4\\text{ cm}$; $47{,}6\\text{ cm}$. Tính giá trị trung bình của tiêu cự $f$.',
        hints: ['Tính $\\bar{L}$ rồi chia cho 4 theo công thức $f = L/4$.'],
        solutionSteps: [
          'Bước 1: $\\bar{L} = \\frac{48{,}0 + 48{,}4 + 47{,}6}{3} = 48{,}0\\text{ cm}$.',
          'Bước 2: Tiêu cự trung bình: $\\bar{f} = \\frac{\\bar{L}}{4} = \\frac{48{,}0}{4} = 12{,}0\\text{ cm}$.'
        ],
        finalAnswer: '$\\bar{f} = 12{,}0\\text{ cm}$.'
      }
    ]
  },

  {
    id: 'phys-9-b10',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương II · Ánh sáng',
    sourceTag: SRC_9,
    lessonNumber: 10,
    title: 'Bài 10: Kính lúp. Bài tập Thấu kính',
    subtitle: 'Cấu tạo kính lúp, số bội giác G = 25/f và phương pháp tam giác đồng dạng giải bài tập thấu kính',
    description:
      'Sử dụng kính lúp đúng cách bằng cách đặt vật trong khoảng tiêu cự ($d < f$), đọc ý nghĩa số bội giác $G = 25/f$ và rèn kỹ năng tính vị trí – độ lớn ảnh qua tam giác đồng dạng.',
    theorySections: [
      {
        heading: '1. Kính lúp và Số bội giác G',
        content:
          '• **Kính lúp** là một thấu kính hội tụ có tiêu cự ngắn (thường từ vài cm đến dưới $25\\text{ cm}$), dùng để quan sát các vật nhỏ.\n• Khi sử dụng, phải đặt vật nằm trong khoảng tiêu cự ($d < f$) để mắt nhìn thấy **ảnh ảo, cùng chiều và lớn hơn vật**.\n• Công thức liên hệ giữa số bội giác ghi trên vành kính ($2\\times, 5\\times, 10\\times$) và tiêu cự: $G = \\frac{25}{f\\text{ (cm)}}$.'
      },
      {
        heading: '2. Hai cặp tam giác đồng dạng giải mọi bài toán thấu kính',
        content:
          '• Cặp 1: $\\triangle OAB \\sim \\triangle OA\'B\' \\implies \\frac{A\'B\'}{AB} = \\frac{OA\'}{OA} = \\frac{d\'}{d}$.\n• Cặp 2: $\\triangle F\'OI \\sim \\triangle F\'A\'B\'$ (ảnh thật: $\\frac{A\'B\'}{OI} = \\frac{d\' - f}{f}$; ảnh ảo TKHT: $\\frac{A\'B\'}{OI} = \\frac{|d\'| + f}{f}$).'
      }
    ],
    keyFormulas: [
      'G = \\frac{25\\text{ cm}}{f\\text{ (cm)}}',
      '\\frac{A\'B\'}{AB} = \\frac{|d\'|}{d}'
    ],
    ...SIM_PRESETS.telescope,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Trên vành một kính lúp có ghi $5\\times$. Tiêu cự của kính lúp này bằng:',
        options: ['A. 5 cm', 'B. 25 cm', 'C. 125 cm', 'D. 10 cm'],
        correctIndex: 0,
        explanation: 'Từ $G = \\frac{25}{f} \\implies f = \\frac{25}{5} = 5\\text{ cm}$.'
      },
      {
        source: SRC_9,
        question: 'Để quan sát rõ một chi tiết mạch điện tử nhỏ bằng kính lúp tiêu cự $f = 10\\text{ cm}$, phải đặt chi tiết đó cách kính một khoảng $d$:',
        options: ['A. d < 10 cm', 'B. d = 20 cm', 'C. d > 20 cm', 'D. 10 cm < d < 20 cm'],
        correctIndex: 0,
        explanation: 'Kính lúp dùng để tạo ảnh ảo cùng chiều lớn hơn vật nên vật phải đặt trong khoảng tiêu cự ($0 < d < f = 10\\text{ cm}$).'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một kính lúp có ghi $2{,}5\\times$. Dùng kính lúp này soi một mẫu chữ cao $2\\text{ mm}$ đặt cách kính $6\\text{ cm}$. Tính tiêu cự kính, khoảng cách ảnh tới kính và chiều cao ảnh nhìn thấy.',
        hints: ['Tìm $f = 25 / G$ trước, sau đó dùng công thức thấu kính cho ảnh ảo.'],
        solutionSteps: [
          'Bước 1: Tiêu cự của kính lúp: $f = \\frac{25}{2{,}5} = 10\\text{ cm}$.',
          'Bước 2: Áp dụng $\\frac{1}{10} = \\frac{1}{6} + \\frac{1}{d\'} \\implies \\frac{1}{d\'} = -\\frac{1}{15} \\implies d\' = -15\\text{ cm}$ (ảnh ảo cách kính $15\\text{ cm}$).',
          'Bước 3: Chiều cao ảnh: $A\'B\' = AB \\cdot \\frac{|d\'|}{d} = 2 \\cdot \\frac{15}{6} = 5\\text{ mm}$.'
        ],
        finalAnswer: '$f = 10\\text{ cm}$, ảnh ảo cách kính $15\\text{ cm}$, cao $5\\text{ mm}$.'
      }
    ]
  },

  // ================= CHƯƠNG III. ĐIỆN (BÀI 11 - BÀI 13) =================
  {
    id: 'phys-9-b11',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương III · Điện',
    sourceTag: SRC_9,
    lessonNumber: 11,
    title: 'Bài 11: Điện trở. Định luật Ohm',
    subtitle: 'Đường đặc trưng I – U, Định luật Ohm I = U / R và công thức điện trở dây dẫn R = ρl/S',
    description:
      'Khảo sát đồ thị sự phụ thuộc của cường độ dòng điện vào hiệu điện thế, phát biểu Định luật Ohm $I = U/R$ và công thức tính điện trở dây dẫn kim loại theo chiều dài, tiết diện và vật liệu.',
    theorySections: [
      {
        heading: '1. Điện trở & Định luật Ohm',
        content:
          '• Thương số $R = \\frac{U}{I}$ không đổi với một dây dẫn kim loại ở nhiệt độ xác định, gọi là **điện trở** (đơn vị Ôm, $\\Omega$).\n• **Định luật Ohm**: Cường độ dòng điện chạy qua một đoạn dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu đoạn dây và tỉ lệ nghịch với điện trở của nó: $I = \\frac{U}{R}$.'
      },
      {
        heading: '2. Công thức tính điện trở dây dẫn',
        content:
          '• Điện trở của một đoạn dây dẫn tỉ lệ thuận với chiều dài $l$, tỉ lệ nghịch với tiết diện $S$ và phụ thuộc vào bản chất vật liệu (điện trở suất $\\rho$, đơn vị $\\Omega\\cdot\\text{m}$):\n  $$R = \\rho \\frac{l}{S}$$'
      }
    ],
    keyFormulas: [
      'I = \\frac{U}{R}',
      'R = \\rho \\frac{l}{S} \\quad (1\\text{ mm}^2 = 10^{-6}\\text{ m}^2)'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Đặt hiệu điện thế $U = 12\\text{ V}$ vào hai đầu một điện trở $R = 24\\,\\Omega$. Cường độ dòng điện chạy qua điện trở là:',
        options: ['A. 0,5 A', 'B. 2 A', 'C. 288 A', 'D. 1,5 A'],
        correctIndex: 0,
        explanation: 'Áp dụng Định luật Ohm: $I = \\frac{U}{R} = \\frac{12}{24} = 0{,}5\\text{ A}$.'
      },
      {
        source: SRC_9,
        question: 'Nếu cắt đôi chiều dài một dây dẫn đồng chất tiết diện đều (giữ nguyên nhiệt độ), điện trở của mỗi nửa dây dẫn mới sẽ:',
        options: ['A. Giảm một nửa', 'B. Tăng gấp đôi', 'C. Không đổi', 'D. Giảm 4 lần'],
        correctIndex: 0,
        explanation: 'Từ $R = \\rho \\frac{l}{S}$, điện trở tỉ lệ thuận với chiều dài $l$ nên giảm chiều dài một nửa thì $R$ giảm một nửa.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một cuộn dây đồng dài $l = 100\\text{ m}$ có tiết diện $S = 0{,}5\\text{ mm}^2$, biết điện trở suất của đồng là $\\rho = 1{,}7\\cdot 10^{-8}\\,\\Omega\\cdot\\text{m}$. Tính điện trở của cuộn dây và cường độ dòng điện qua nó khi mắc vào nguồn $U = 6{,}8\\text{ V}$.',
        hints: ['Đổi $S = 0{,}5\\text{ mm}^2 = 0{,}5\\cdot 10^{-6}\\text{ m}^2$.'],
        solutionSteps: [
          'Bước 1: $R = 1{,}7\\cdot 10^{-8} \\cdot \\frac{100}{0{,}5\\cdot 10^{-6}} = 3{,}4\\,\\Omega$.',
          'Bước 2: $I = \\frac{U}{R} = \\frac{6{,}8}{3{,}4} = 2\\text{ A}$.'
        ],
        finalAnswer: '$R = 3{,}4\\,\\Omega$; $I = 2\\text{ A}$.'
      }
    ]
  },

  {
    id: 'phys-9-elec',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương III · Điện',
    sourceTag: SRC_9,
    lessonNumber: 12,
    title: 'Bài 12: Đoạn mạch Nối tiếp, Song song',
    subtitle: 'Quy tắc cường độ dòng điện, hiệu điện thế và điện trở tương đương mạch nối tiếp – song song',
    description:
      'Vận dụng chuẩn GDPT 2018 về đặc điểm mạch điện mắc nối tiếp ($R_{tđ} = R_1 + R_2$) và mắc song song ($1/R_{tđ} = 1/R_1 + 1/R_2$) để phân tích mạch điện thực tế trong gia đình.',
    theorySections: [
      {
        heading: '1. Đoạn mạch mắc nối tiếp',
        content:
          '• Cường độ dòng điện có giá trị như nhau tại mọi điểm: $I = I_1 = I_2$.\n• Hiệu điện thế hai đầu đoạn mạch bằng tổng các hiệu điện thế thành phần: $U = U_1 + U_2$.\n• Điện trở tương đương: $R_{tđ} = R_1 + R_2$.'
      },
      {
        heading: '2. Đoạn mạch mắc song song',
        content:
          '• Hiệu điện thế hai đầu các nhánh bằng nhau: $U = U_1 = U_2$.\n• Cường độ dòng điện mạch chính bằng tổng dòng điện các nhánh rẽ: $I = I_1 + I_2$.\n• Điện trở tương đương: $\\frac{1}{R_{tđ}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\implies R_{tđ} = \\frac{R_1 R_2}{R_1 + R_2}$ (nhỏ hơn từng điện trở thành phần).'
      }
    ],
    keyFormulas: [
      '\\text{Nối tiếp: } I = I_1 = I_2,\\; U = U_1 + U_2,\\; R_{tđ} = R_1 + R_2',
      '\\text{Song song: } U = U_1 = U_2,\\; I = I_1 + I_2,\\; \\frac{1}{R_{tđ}} = \\frac{1}{R_1} + \\frac{1}{R_2}'
    ],
    simulationType: 'ohm_circuit',
    sim3dType: 'cathode_ray_tube_3d',
    defaultParams: { voltage: 12, r1: 10, r2: 15, circuitType: 0 },
    paramBounds: {
      voltage: { min: 3, max: 24, step: 1, unit: 'V', label: 'Hiệu điện thế U' },
      r1: { min: 5, max: 50, step: 1, unit: 'Ω', label: 'Điện trở R₁' },
      r2: { min: 5, max: 50, step: 1, unit: 'Ω', label: 'Điện trở R₂' },
      circuitType: { min: 0, max: 1, step: 1, unit: '(0:NT / 1:SS)', label: 'Kiểu mạch' }
    },
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Hai điện trở $R_1 = 6\\,\\Omega$ và $R_2 = 12\\,\\Omega$ mắc song song vào hiệu điện thế $U = 12\\text{ V}$. Cường độ dòng điện mạch chính là:',
        options: ['A. 3 A', 'B. 2 A', 'C. 1 A', 'D. 0,67 A'],
        correctIndex: 0,
        explanation: '$R_{tđ} = \\frac{6\\cdot 12}{6 + 12} = 4\\,\\Omega$. Dòng điện mạch chính $I = \\frac{12}{4} = 3\\text{ A}$.'
      },
      {
        source: SRC_9,
        question: 'Mắc nối tiếp $R_1 = 10\\,\\Omega$ và $R_2 = 20\\,\\Omega$ vào nguồn $15\\text{ V}$. Hiệu điện thế hai đầu điện trở $R_2$ bằng:',
        options: ['A. 10 V', 'B. 5 V', 'C. 15 V', 'D. 7,5 V'],
        correctIndex: 0,
        explanation: '$R_{tđ} = 30\\,\\Omega \\implies I = 15/30 = 0{,}5\\text{ A} \\implies U_2 = I R_2 = 0{,}5 \\cdot 20 = 10\\text{ V}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Cho mạch gồm $R_1 = 15\\,\\Omega$ và $R_2 = 30\\,\\Omega$ mắc song song vào nguồn $U = 18\\text{ V}$. Tính điện trở tương đương của đoạn mạch, dòng điện qua mỗi nhánh và dòng điện mạch chính.',
        hints: ['Trong mạch song song, hiệu điện thế đặt lên $R_1$ và $R_2$ đều bằng $18\\text{ V}$.'],
        solutionSteps: [
          'Bước 1: $R_{tđ} = \\frac{15 \\cdot 30}{15 + 30} = 10\\,\\Omega$.',
          'Bước 2: $I_1 = \\frac{18}{15} = 1{,}2\\text{ A}$; $I_2 = \\frac{18}{30} = 0{,}6\\text{ A}$.',
          'Bước 3: Dòng điện mạch chính: $I = I_1 + I_2 = 1{,}8\\text{ A}$ (kiểm tra lại $U/R_{tđ} = 18/10 = 1{,}8\\text{ A}$).'
        ],
        finalAnswer: '$R_{tđ} = 10\\,\\Omega$; $I_1 = 1{,}2\\text{ A}$; $I_2 = 0{,}6\\text{ A}$; $I = 1{,}8\\text{ A}$.'
      }
    ]
  },

  {
    id: 'phys-9-b13',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương III · Điện',
    sourceTag: SRC_9,
    lessonNumber: 13,
    title: 'Bài 13: Năng lượng của Dòng điện & Công suất điện',
    subtitle: 'Công thức W = UIt, công suất điện P = UI, chỉ số công tơ kWh và bài toán tiết kiệm điện',
    description:
      'Tính năng lượng điện mà đoạn mạch tiêu thụ $W = UIt$, công suất định mức của các thiết bị gia dụng ($P = UI$), đọc chỉ số công tơ điện ($1\\text{ kWh} = 3{,}6\\cdot 10^6\\text{ J}$) và tính hóa đơn tiền điện.',
    theorySections: [
      {
        heading: '1. Năng lượng của dòng điện & Công tơ điện',
        content:
          '• Năng lượng điện mà một đoạn mạch tiêu thụ tỉ lệ với hiệu điện thế $U$, cường độ dòng điện $I$ và thời gian $t$: $W = U \\cdot I \\cdot t = P \\cdot t$.\n• Đơn vị đo điện năng trong sinh hoạt là **kilooat giờ** ($1\\text{ kWh} = 1\\text{ số điện} = 1000\\text{ W} \\cdot 3600\\text{ s} = 3{,}6\\cdot 10^6\\text{ J}$).'
      },
      {
        heading: '2. Công suất điện',
        content:
          '• Công suất điện của đoạn mạch bằng tích hiệu điện thế và cường độ dòng điện: $P = U \\cdot I$ (suy ra thêm $P = I^2 R = \\frac{U^2}{R}$ với điện trở thuần).\n• Số ghi trên thiết bị (vd: $220\\text{ V} - 1000\\text{ W}$) cho biết hiệu điện thế định mức và công suất định mức để thiết bị hoạt động bình thường.'
      }
    ],
    keyFormulas: [
      'W = U \\cdot I \\cdot t = P \\cdot t',
      'P = U \\cdot I = I^2 R = \\frac{U^2}{R}',
      '1\\text{ kWh} = 3{,}6 \\cdot 10^6\\text{ J}'
    ],
    simulationType: 'joule_lenz_heat',
    sim3dType: 'transformer_3d',
    defaultParams: { voltage: 12, resistance: 6, waterMass: 0.5 },
    paramBounds: {
      voltage: { min: 3, max: 36, step: 3, unit: 'V', label: 'Hiệu điện thế U' },
      resistance: { min: 2, max: 30, step: 2, unit: 'Ω', label: 'Điện trở dây đốt R' },
      waterMass: { min: 0.2, max: 2.0, step: 0.2, unit: 'kg', label: 'Khối lượng nước m' }
    },
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Một bóng đèn ghi $220\\text{ V} - 100\\text{ W}$ được dùng ở hiệu điện thế đúng $220\\text{ V}$. Cường độ dòng điện chạy qua đèn là:',
        options: ['A. ≈ 0,45 A', 'B. 2,2 A', 'C. 0,1 A', 'D. 4,5 A'],
        correctIndex: 0,
        explanation: 'Từ $P = U\\cdot I \\implies I = \\frac{100}{220} \\approx 0{,}45\\text{ A}$.'
      },
      {
        source: SRC_9,
        question: 'Một ấm siêu tốc công suất $1{,}5\\text{ kW}$ đun nước trong $20\\text{ phút}$. Điện năng ấm tiêu thụ là:',
        options: ['A. 0,5 kWh', 'B. 30 kWh', 'C. 1,5 kWh', 'D. 3 kWh'],
        correctIndex: 0,
        explanation: 'Đổi $t = 20/60 = 1/3\\text{ h}$. Điện năng $W = P \\cdot t = 1{,}5 \\cdot \\frac{1}{3} = 0{,}5\\text{ kWh}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một gia đình sử dụng 1 tủ lạnh công suất $150\\text{ W}$ chạy trung bình $10\\text{ giờ/ngày}$ và 1 điều hòa $1000\\text{ W}$ chạy $4\\text{ giờ/ngày}$. Tính tổng điện năng tiêu thụ trong 30 ngày và tiền điện phải trả (biết đơn giá $2500\\text{ đồng/kWh}$).',
        hints: ['Tính $W = P \\cdot t$ theo đơn vị kWh cho từng thiết bị rồi cộng lại.'],
        solutionSteps: [
          'Bước 1: Điện năng tủ lạnh 1 ngày: $0{,}15 \\cdot 10 = 1{,}5\\text{ kWh}$. Điều hòa 1 ngày: $1{,}0 \\cdot 4 = 4{,}0\\text{ kWh}$.',
          'Bước 2: Tổng điện năng 30 ngày: $W = (1{,}5 + 4{,}0) \\cdot 30 = 165\\text{ kWh}$.',
          'Bước 3: Tiền điện phải trả: $165 \\cdot 2500 = 412\\,500\\text{ đồng}$.'
        ],
        finalAnswer: '$165\\text{ kWh}$, tiền điện $412\\,500\\text{ đồng}$.'
      }
    ]
  },

  // ================= CHƯƠNG IV. ĐIỆN TỪ (BÀI 14 - BÀI 15) =================
  {
    id: 'phys-9-induction-ac',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương IV · Điện từ',
    sourceTag: SRC_9,
    lessonNumber: 14,
    title: 'Bài 14: Cảm ứng điện từ. Nguyên tắc tạo ra Dòng điện Xoay chiều',
    subtitle: 'Điều kiện xuất hiện dòng điện cảm ứng và nguyên lý hoạt động của máy phát điện xoay chiều',
    description:
      'Khảo sát thí nghiệm đưa nam châm qua cuộn dây dẫn kín: xác định điều kiện biến thiên số đường sức từ để xuất hiện dòng điện cảm ứng và nguyên tắc đảo chiều tạo dòng điện xoay chiều.',
    theorySections: [
      {
        heading: '1. Hiện tượng Cảm ứng điện từ',
        content:
          '• Khi số đường sức từ xuyên qua tiết diện của một cuộn dây dẫn kín **biến thiên** (tăng hoặc giảm), trong cuộn dây xuất hiện **dòng điện cảm ứng**.\n• Dòng điện cảm ứng chỉ tồn tại trong thời gian từ trường qua cuộn dây còn đang thay đổi; nếu nam châm đứng yên so với cuộn dây thì dòng cảm ứng bằng $0$.'
      },
      {
        heading: '2. Dòng điện xoay chiều & Máy phát điện',
        content:
          '• Khi số đường sức từ xuyên qua cuộn dây kín **luân phiên tăng rồi giảm** (như quay nam châm trước cuộn dây hoặc quay cuộn dây trong từ trường), chiều dòng điện cảm ứng đổi dấu tuần hoàn — gọi là **dòng điện xoay chiều (AC)**.\n• Mọi máy phát điện xoay chiều đều gồm hai bộ phận chính: phần tạo từ trường (nam châm) và cuộn dây dẫn; phần quay gọi là **rôto**, phần đứng yên là **stato**.'
      }
    ],
    keyFormulas: [
      '\\Phi \\text{ biến thiên} \\implies \\text{Có dòng điện cảm ứng } i_{\\text{cu}}',
      'f_{\\text{VN}} = 50\\text{ Hz} \\; (\\text{đổi chiều } 100\\text{ lần/giây})'
    ],
    simulationType: 'magnetic_induction',
    sim3dType: 'ac_generator_3d',
    defaultParams: { magnetSpeed: 4.5, turns: 20, bField: 1.4 },
    paramBounds: {
      magnetSpeed: { min: 1, max: 10, step: 0.5, unit: 'm/s', label: 'Tốc độ nam châm' },
      turns: { min: 4, max: 24, step: 2, unit: 'vòng', label: 'Số vòng dây N' },
      bField: { min: 0.5, max: 3, step: 0.1, unit: 'T', label: 'Cảm ứng từ B' }
    },
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Điều kiện để xuất hiện dòng điện cảm ứng trong một cuộn dây dẫn kín là:',
        options: [
          'A. Cuộn dây nằm yên bên cạnh nam châm đứng yên',
          'B. Số đường sức từ xuyên qua tiết diện cuộn dây biến thiên theo thời gian',
          'C. Cuộn dây nối với hai cực của pin một chiều',
          'D. Đặt cuộn dây trong chân không không có từ trường'
        ],
        correctIndex: 1,
        explanation: 'Dòng điện cảm ứng chỉ xuất hiện khi số đường sức từ xuyên qua tiết diện cuộn dây kín tăng hoặc giảm (biến thiên).'
      },
      {
        source: SRC_9,
        question: 'Dòng điện xoay chiều trong lưới điện dân dụng Việt Nam có tần số $50\\text{ Hz}$. Trong $1\\text{ giây}$, dòng điện đổi chiều bao nhiêu lần?',
        options: ['A. 100 lần', 'B. 50 lần', 'C. 25 lần', 'D. 200 lần'],
        correctIndex: 0,
        explanation: 'Mỗi chu kì dòng điện xoay chiều đổi chiều 2 lần, nên với $50$ chu kì/giây sẽ đổi chiều $100$ lần/giây.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Giải thích vì sao đinamô xe đạp chỉ thắp sáng đèn khi bánh xe quay, và khi đạp xe càng nhanh thì đèn càng sáng hơn.',
        hints: ['Liên hệ tốc độ biến thiên số đường sức từ xuyên qua cuộn dây trong đinamô.'],
        solutionSteps: [
          'Bước 1: Khi bánh xe quay, núm đinamô làm nam châm quay liên tục trước cuộn dây cố định, khiến số đường sức từ xuyên qua cuộn dây luân phiên tăng giảm → sinh ra dòng điện xoay chiều thắp sáng đèn.',
          'Bước 2: Khi đạp xe càng nhanh, tốc độ biến thiên từ thông càng lớn nên cường độ dòng điện cảm ứng càng mạnh, làm đèn sáng hơn.'
        ],
        finalAnswer: 'Do cảm ứng điện từ: tốc độ quay tăng làm số đường sức từ biến thiên nhanh hơn nên dòng cảm ứng mạnh hơn.'
      }
    ]
  },

  {
    id: 'phys-9-b15',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương IV · Điện từ',
    sourceTag: SRC_9,
    lessonNumber: 15,
    title: 'Bài 15: Tác dụng của Dòng điện Xoay chiều & Truyền tải điện',
    subtitle: 'Tác dụng nhiệt, phát sáng, từ, sinh lí; máy biến áp và giảm hao phí khi truyền tải điện năng đi xa',
    description:
      'Phân biệt các tác dụng của dòng điện xoay chiều trong đời sống, hiểu vai trò của máy biến áp $\\frac{U_1}{U_2} = \\frac{N_1}{N_2}$ và cách nâng cao hiệu điện thế để giảm công suất hao phí trên đường dây tải điện.',
    theorySections: [
      {
        heading: '1. Bốn tác dụng đặc trưng của dòng điện xoay chiều',
        content:
          '• **Tác dụng nhiệt**: làm nóng dây tóc, bàn là, bếp hồng ngoại, ấm đun.\n• **Tác dụng phát sáng**: thắp sáng đèn LED, đèn huỳnh quang, bóng đèn thử điện.\n• **Tác dụng từ**: làm quay động cơ quạt điện, máy bơm, nam châm điện nâng hạ; đảo cực liên tục theo tần số nguồn.\n• **Tác dụng sinh lí**: dòng điện xoay chiều đi qua cơ thể gây co giật cơ, nguy hiểm tính mạng nên cần tuân thủ nghiêm ngặt an toàn điện $220\\text{ V}$.'
      },
      {
        heading: '2. Máy biến áp & Truyền tải điện năng đi xa',
        content:
          '• Máy biến áp dùng dòng xoay chiều để tăng hoặc giảm hiệu điện thế theo tỉ số vòng dây: $\\frac{U_1}{U_2} = \\frac{N_1}{N_2}$.\n• Hao phí tỏa nhiệt trên đường dây: $\\Delta P = \\frac{P^2 R}{U^2}$. Tăng hiệu điện thế $U$ lên $n$ lần sẽ giảm hao phí đường dây xuống **$n^2$ lần**.'
      }
    ],
    keyFormulas: [
      '\\frac{U_1}{U_2} = \\frac{N_1}{N_2}',
      '\\Delta P_{\\text{hao phí}} = \\frac{P^2 R}{U^2}'
    ],
    ...SIM_PRESETS.transformer,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Khi tăng hiệu điện thế truyền tải ở nhà máy điện lên $10$ lần (giữ nguyên công suất phát và điện trở dây), công suất hao phí trên đường dây tải điện sẽ:',
        options: ['A. Giảm 100 lần', 'B. Giảm 10 lần', 'C. Tăng 100 lần', 'D. Không đổi'],
        correctIndex: 0,
        explanation: 'Vì $\\Delta P = \\frac{P^2 R}{U^2}$ tỉ lệ nghịch với $U^2$, tăng $U$ lên $10$ lần thì hao phí giảm $10^2 = 100$ lần.'
      },
      {
        source: SRC_9,
        question: 'Một máy biến áp có cuộn sơ cấp $500$ vòng nối với lưới điện $220\\text{ V}$. Muốn thu được $11\\text{ V}$ ở cuộn thứ cấp thì số vòng cuộn thứ cấp là:',
        options: ['A. 25 vòng', 'B. 50 vòng', 'C. 10 000 vòng', 'D. 100 vòng'],
        correctIndex: 0,
        explanation: '$N_2 = N_1 \\cdot \\frac{U_2}{U_1} = 500 \\cdot \\frac{11}{220} = 25$ vòng.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một trạm phát điện truyền đi công suất $P = 100\\text{ kW}$ trên đường dây có điện trở tổng cộng $R = 8\\,\\Omega$. Tính công suất hao phí khi truyền ở $U_1 = 2\\text{ kV}$ và khi tăng áp lên $U_2 = 20\\text{ kV}$.',
        hints: ['Đổi $P = 10^5\\text{ W}$, $U_1 = 2000\\text{ V}$, $U_2 = 20\\,000\\text{ V}$ rồi thay vào $\\Delta P = P^2 R / U^2$.'],
        solutionSteps: [
          'Bước 1: Ở $U_1 = 2000\\text{ V}$: $\\Delta P_1 = \\frac{(10^5)^2 \\cdot 8}{2000^2} = 20\\,000\\text{ W} = 20\\text{ kW}$.',
          'Bước 2: Tăng áp gấp 10 lần lên $U_2 = 20\\text{ kV}$: $\\Delta P_2 = \\frac{20\\text{ kW}}{10^2} = 0{,}2\\text{ kW} = 200\\text{ W}$.'
        ],
        finalAnswer: 'Hao phí giảm từ $20\\text{ kW}$ xuống còn $200\\text{ W}$.'
      }
    ]
  },

  // ================= CHƯƠNG XIV & CẦU NỐI LÊN LỚP 10 =================
  {
    id: 'phys-9-b16',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Chương XIV · Năng lượng trên Trái Đất',
    sourceTag: SRC_9,
    lessonNumber: 16,
    title: 'Bài 16: Vòng Năng lượng trên Trái Đất & Năng lượng Tái tạo',
    subtitle: 'Chu trình chuyển hóa năng lượng Mặt Trời, nhiên liệu hóa thạch và năng lượng xanh (gió, mặt trời, thủy điện)',
    description:
      'Hoàn thiện chương trình KHTN 9 GDPT 2018 (Mục Khai thác tài nguyên & Năng lượng): theo dõi vòng tuần hoàn năng lượng từ Mặt Trời tạo ra gió, mưa, sinh khối và đánh giá hiệu quả sử dụng năng lượng tái tạo.',
    theorySections: [
      {
        heading: '1. Vòng năng lượng trên Trái Đất',
        content:
          '• **Mặt Trời** là nguồn cung cấp năng lượng chủ yếu cho mọi vòng tuần hoàn tự nhiên trên Trái Đất:\n  – Bức xạ Mặt Trời làm bốc hơi nước tạo mưa, sông ngòi (**Thủy năng**) và chênh lệch áp suất khí quyển tạo gió (**Năng lượng gió**).\n  – Thực vật quang hợp tích lũy năng lượng thành **Sinh khối** và qua hàng triệu năm thành **Nhiên liệu hóa thạch** (than đá, dầu mỏ, khí tự nhiên).'
      },
      {
        heading: '2. Năng lượng Hóa thạch vs Năng lượng Tái tạo',
        content:
          '• **Nhiên liệu hóa thạch**: Mật độ năng lượng cao, dễ khai thác hiện tại nhưng **không tái tạo** (sẽ cạn kiệt) và phát thải khí nhà kính $\\text{CO}_2$.\n• **Năng lượng tái tạo** (Mặt Trời, gió, thủy điện, địa nhiệt): Nguồn vô tận, ít phát thải carbon nhưng phụ thuộc thời tiết và đòi hỏi chi phí lưu trữ năng lượng (pin, tích năng).'
      }
    ],
    keyFormulas: [
      'H_{\\text{chuyển hóa}} = \\frac{W_{\\text{có ích}}}{W_{\\text{toàn phần}}} \\cdot 100\\% < 100\\%',
      'P_{\\text{gió}} = \\frac{1}{2}\\rho A v^3 \\propto v^3'
    ],
    ...SIM_PRESETS.thermal_gas,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Nguồn năng lượng gốc tạo nên chuyển động tuần hoàn của nước (thủy điện) và chuyển động đối lưu của không khí (năng lượng gió) trên Trái Đất là:',
        options: ['A. Năng lượng Mặt Trời', 'B. Năng lượng hạt nhân lòng đất', 'C. Thủy triều Mặt Trăng', 'D. Lực ma sát khí quyển'],
        correctIndex: 0,
        explanation: 'Bức xạ Mặt Trời làm nóng không đều bề mặt Trái Đất và làm bay hơi nước đại dương, trực tiếp vận hành cả vòng tuần hoàn nước lẫn gió.'
      },
      {
        source: SRC_9,
        question: 'Một tấm pin Mặt Trời nhận công suất bức xạ $1000\\text{ W}$ và tạo ra công suất điện $200\\text{ W}$. Hiệu suất chuyển hóa năng lượng của tấm pin là:',
        options: ['A. 20%', 'B. 25%', 'C. 80%', 'D. 5%'],
        correctIndex: 0,
        explanation: 'Hiệu suất $H = \\frac{200}{1000}\\cdot 100\\% = 20\\%$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Nêu 2 ưu điểm và 2 thách thức kỹ thuật khi thay thế nhà máy nhiệt điện than bằng điện gió và điện Mặt Trời.',
        hints: ['Xét yếu tố phát thải khí nhà kính, tính vô tận, tính ổn định theo thời tiết và lưu trữ pin.'],
        solutionSteps: [
          'Ưu điểm: Nguồn năng lượng tái tạo tự nhiên không cạn kiệt; không phát thải khí nhà kính CO₂ và bụi mịn trong quá trình phát điện.',
          'Thách thức: Công suất phát phụ thuộc mạnh vào nắng/gió theo giờ và mùa; cần đầu tư hệ thống lưu trữ điện năng quy mô lớn và lưới điện thông minh.'
        ],
        finalAnswer: 'Ưu: sạch & tái tạo; Thách thức: phụ thuộc thời tiết & bài toán lưu trữ điện năng.'
      }
    ]
  },

  {
    id: 'phys-9-math-vec',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Cầu nối 9 lên 10 · Công cụ Toán & Vectơ',
    sourceTag: 'Chuẩn bị nền tảng GDPT 2018 · Lượng giác, Đồ thị & Vectơ',
    lessonNumber: 17,
    title: 'Bài 17 (Cầu nối lên Lý 10): Lượng giác, Hàm số y = ax + b & Vectơ',
    subtitle: 'Tỉ số sin, cos, tan; ý nghĩa hệ số góc đồ thị chuyển động và quy tắc tổng hợp – chiếu vectơ lực',
    description:
      'Cầu nối quan trọng từ KHTN 9 lên Vật lí 10: dùng thuần thục $\\sin, \\cos, \\tan$ để phân tích lực, hiểu hệ số góc đường thẳng $y = ax + b$ trên đồ thị $x-t$ và thực hiện phép cộng – chiếu vectơ lên hai trục $Ox, Oy$.',
    theorySections: [
      {
        heading: '1. Tỉ số lượng giác sin, cos, tan trong tam giác vuông',
        content:
          '• Trong tam giác vuông góc nhọn $\\alpha$: $\\sin\\alpha = \\frac{\\text{Đối}}{\\text{Huyền}}$, $\\cos\\alpha = \\frac{\\text{Kề}}{\\text{Huyền}}$, $\\tan\\alpha = \\frac{\\text{Đối}}{\\text{Kề}}$.\n• Phân tích lực $\\vec{F}$ hợp với phương ngang $Ox$ góc $\\alpha$: $F_x = F\\cos\\alpha$ và $F_y = F\\sin\\alpha$.'
      },
      {
        heading: '2. Hàm bậc nhất y = ax + b & Đồ thị chuyển động',
        content:
          '• Phương trình tọa độ chuyển động thẳng đều $x = x_0 + v \\cdot t$ là hàm bậc nhất với hệ số góc $a = v$ (vận tốc) và tung độ gốc $b = x_0$.'
      },
      {
        heading: '3. Quy tắc Hình bình hành Cộng Vectơ',
        content:
          '• Tổng hai vectơ đồng quy $\\vec{F} = \\vec{F}_1 + \\vec{F}_2$ có độ lớn:\n  $$F = \\sqrt{F_1^2 + F_2^2 + 2F_1 F_2\\cos\\alpha}$$'
      }
    ],
    keyFormulas: [
      'F_x = F\\cos\\alpha, \\quad F_y = F\\sin\\alpha',
      'F = \\sqrt{F_1^2 + F_2^2 + 2F_1 F_2\\cos\\alpha}',
      'y = ax + b \\iff x(t) = v\\cdot t + x_0'
    ],
    simulationType: 'kinematics_graphs',
    sim3dType: 'kinematics_3d',
    defaultParams: { vizMode: 0, angleDeg: 35, f1: 30, f2: 20, v0: 4, accel: 1.5 },
    paramBounds: {
      vizMode: { min: 0, max: 2, step: 1, unit: '(0:Vectơ | 1:d-t | 2:v-t)', label: 'Chế độ 2D' },
      angleDeg: { min: 0, max: 150, step: 5, unit: '°', label: 'Góc nghiêng α' },
      f1: { min: 10, max: 50, step: 2, unit: 'N', label: 'Độ lớn F₁' },
      f2: { min: 10, max: 50, step: 2, unit: 'N', label: 'Độ lớn F₂' },
      v0: { min: 0, max: 15, step: 0.5, unit: 'm/s', label: 'Vận tốc v₀' },
      accel: { min: -5, max: 6, step: 0.5, unit: 'm/s²', label: 'Gia tốc a' }
    },
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Một lực $F = 100\\text{ N}$ hợp với phương ngang $Ox$ góc $\\alpha = 60^\\circ$. Hình chiếu $F_x$ lên phương ngang là:',
        options: ['A. 50 N', 'B. 86,6 N', 'C. 100 N', 'D. 57,7 N'],
        correctIndex: 0,
        explanation: '$F_x = F\\cos 60^\\circ = 100 \\cdot 0{,}5 = 50\\text{ N}$.'
      },
      {
        source: SRC_9,
        question: 'Hai lực đồng quy vuông góc $F_1 = 6\\text{ N}$ và $F_2 = 8\\text{ N}$ có hợp lực bằng:',
        options: ['A. 10 N', 'B. 14 N', 'C. 2 N', 'D. 48 N'],
        correctIndex: 0,
        explanation: 'Vì $\\alpha = 90^\\circ$, $F = \\sqrt{6^2 + 8^2} = 10\\text{ N}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Cho hai lực đồng quy $F_1 = 30\\text{ N}$ và $F_2 = 30\\text{ N}$ hợp với nhau góc $\\alpha = 60^\\circ$. Tính độ lớn hợp lực $F$ và góc giữa $\\vec{F}$ với $\\vec{F}_1$.',
        hints: ['Áp dụng $F = \\sqrt{F_1^2 + F_2^2 + 2F_1F_2\\cos 60^\\circ}$.'],
        solutionSteps: [
          'Bước 1: $F = \\sqrt{30^2 + 30^2 + 2\\cdot 30 \\cdot 30 \\cdot 0{,}5} = 30\\sqrt{3} \\approx 51{,}96\\text{ N}$.',
          'Bước 2: Do $F_1 = F_2$, vectơ hợp lực nằm trên đường phân giác nên hợp với $\\vec{F}_1$ góc $30^\\circ$.'
        ],
        finalAnswer: '$F = 30\\sqrt{3}\\text{ N} \\approx 51{,}96\\text{ N}$, góc $30^\\circ$.'
      }
    ]
  }
];
