import { PhysicsLesson } from '../types';

export const PHYSICS_LESSONS: PhysicsLesson[] = [
  // ============================================================================
  // KHU KHÔNG CHUYÊN — HỆ ĐẠI TRÀ THEO CHƯƠNG TRÌNH GDPT HIỆN HÀNH (LỚP 9 - 12)
  // ============================================================================

  // ---------- LỚP 9 ----------
  {
    id: 'phys-9-mech-heat',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Hệ thống kiến thức Lớp 9 · Cơ & Nhiệt học',
    sourceTag: 'SGK KHTN 9 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 1,
    title: 'Cơ học & Nhiệt học Lớp 9: Vận tốc, Công, Cơ năng & Nhiệt lượng',
    subtitle: 'Vận tốc trung bình, công cơ học, công suất, định luật bảo toàn cơ năng và phương trình cân bằng nhiệt',
    description:
      'Tổng hợp trọn vẹn kiến thức Cơ học và Nhiệt học trọng tâm lớp 9: tính vận tốc trung bình trên từng chặng đường, công – công suất, sự chuyển hóa giữa động năng – thế năng và công thức tính nhiệt lượng $Q = m c \\Delta t$.',
    theorySections: [
      {
        heading: '1. Vận tốc trung bình, Công và Công suất',
        content:
          '• Vận tốc trung bình trên cả quãng đường: $v_{tb} = \\frac{s_1 + s_2 + \\dots}{t_1 + t_2 + \\dots}$ (Lưu ý: không lấy trung bình cộng $v_1, v_2$ khi thời gian khác nhau!).\n• Công cơ học khi lực $F$ làm vật dịch chuyển quãng đường $s$ theo hướng của lực: $A = F \\cdot s$ (đơn vị Jun, $1\\text{ J} = 1\\text{ N}\\cdot\\text{m}$).\n• Công suất đặc trưng cho tốc độ thực hiện công: $P = \\frac{A}{t} = F \\cdot v$ (đơn vị Oát, $1\\text{ W} = 1\\text{ J/s}$).'
      },
      {
        heading: '2. Động năng, Thế năng & Bảo toàn cơ năng',
        content:
          '• Động năng: $W_đ = \\frac{1}{2}mv^2$. Vật có khối lượng càng lớn, chuyển động càng nhanh thì động năng càng lớn.\n• Thế năng trọng trường: $W_t = P \\cdot h = mgh$ (phụ thuộc mốc chọn độ cao $h$).\n• Cơ năng $W = W_đ + W_t$. Khi bỏ qua ma sát và lực cản không khí, cơ năng luôn được bảo toàn: $W_đ + W_t = \\text{hằng số}$.'
      },
      {
        heading: '3. Nhiệt lượng & Phương trình cân bằng nhiệt',
        content:
          '• Nhiệt lượng vật thu vào (hoặc tỏa ra) khi thay đổi nhiệt độ: $Q = m \\cdot c \\cdot \\Delta t$ ($c$ là nhiệt dung riêng, đơn vị $\\text{J/(kg}\\cdot\\text{K)}$; $\\Delta t = |t_2 - t_1|$).\n• Nhiệt lượng tỏa ra khi đốt cháy nhiên liệu: $Q = q \\cdot m$.\n• Phương trình cân bằng nhiệt giữa hai vật trao đổi nhiệt: $Q_{\\text{tỏa}} = Q_{\\text{thu}}$.'
      },
      {
        heading: '4. Thí nghiệm SGK & Ghi chú hệ đơn vị SI',
        content:
          '• Khi làm bài tập SGK KHTN 9, luôn đổi đồng nhất sang hệ SI trước khi bấm máy: khối lượng $m$ (kg), quãng đường $s$ (m), thời gian $t$ (s), công $A$ (J), nhiệt lượng $Q$ (J), công suất $P$ (W).\n• Vẽ sơ đồ tư duy nối 3 nhánh: Chuyển động ($v_{tb}$) → Công & Cơ năng ($A, P, W$) → Nhiệt học ($Q = mc\\Delta t$).'
      }
    ],
    keyFormulas: [
      'v_{tb} = \\frac{\\sum s}{\\sum t}',
      'A = F \\cdot s, \\quad P = \\frac{A}{t} = F \\cdot v',
      'W = \\frac{1}{2}mv^2 + mgh = \\text{const}',
      'Q = m \\cdot c \\cdot \\Delta t, \\quad Q_{\\text{tỏa}} = Q_{\\text{thu}}'
    ],
    simulationType: 'free_fall_energy',
    sim3dType: 'thermal_gas_3d',
    defaultParams: { height: 20, mass: 2, gravity: 9.8 },
    paramBounds: {
      height: { min: 5, max: 45, step: 1, unit: 'm', label: 'Độ cao thả vật (h)' },
      mass: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng (m)' },
      gravity: { min: 1.6, max: 15, step: 0.2, unit: 'm/s²', label: 'Gia tốc g' }
    },
    practiceExercises: [
      {
        source: 'VietJack · KHTN 9 KNTT',
        question:
          'Một cần cẩu nâng một thùng hàng khối lượng $500\\text{ kg}$ lên độ cao $12\\text{ m}$ trong thời gian $20\\text{ s}$ (lấy $g = 10\\text{ m/s}^2$). Công suất tối thiểu của cần cẩu là:',
        options: ['A. 3 000 W', 'B. 60 000 W', 'C. 300 W', 'D. 1 500 W'],
        correctIndex: 0,
        explanation:
          'Trọng lượng thùng hàng $P = 10m = 5000\\text{ N}$. Công nâng vật: $A = P \\cdot h = 5000 \\cdot 12 = 60\\,000\\text{ J}$. Công suất cần cẩu: $\\mathcal{P} = \\frac{A}{t} = \\frac{60\\,000}{20} = 3\\,000\\text{ W}$.'
      },
      {
        source: 'Loigiaihay · KHTN 9 CTST',
        question:
          'Một vật có khối lượng $m = 2\\text{ kg}$ được thả rơi tự do từ độ cao $h = 5\\text{ m}$ ($g = 10\\text{ m/s}^2$). Khi vật ở độ cao $2\\text{ m}$ so với mặt đất, động năng của vật bằng:',
        options: ['A. 40 J', 'B. 60 J', 'C. 100 J', 'D. 20 J'],
        correctIndex: 1,
        explanation:
          'Cơ năng ban đầu: $W = mgh_0 = 2 \\cdot 10 \\cdot 5 = 100\\text{ J}$. Ở độ cao $h = 2\\text{ m}$, thế năng là $W_t = mgh = 2 \\cdot 10 \\cdot 2 = 40\\text{ J}$. Bảo toàn cơ năng suy ra động năng $W_đ = W - W_t = 100 - 40 = 60\\text{ J}$.'
      },
      {
        source: 'VietJack · Ôn tập Nhiệt học 9',
        question:
          'Cần cung cấp nhiệt lượng bao nhiêu để đun nóng $2\\text{ kg}$ nước từ $25^\\circ\\text{C}$ lên $100^\\circ\\text{C}$? Biết nhiệt dung riêng của nước là $c = 4200\\text{ J/(kg}\\cdot\\text{K)}$.',
        options: ['A. 630 kJ', 'B. 840 kJ', 'C. 210 kJ', 'D. 420 kJ'],
        correctIndex: 0,
        explanation:
          'Độ tăng nhiệt độ $\\Delta t = 100 - 25 = 75^\\circ\\text{C}$. Nhiệt lượng cần thiết: $Q = mc\\Delta t = 2 \\cdot 4200 \\cdot 75 = 630\\,000\\text{ J} = 630\\text{ kJ}$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Bài tập Tự luận KHTN 9',
        question:
          'Một ô tô đi nửa quãng đường đầu với tốc độ $v_1 = 40\\text{ km/h}$ và nửa quãng đường sau với tốc độ $v_2 = 60\\text{ km/h}$. Tính tốc độ trung bình của ô tô trên cả quãng đường.',
        hints: ['Đặt độ dài cả quãng đường là $S$, biểu diễn thời gian $t_1 = \\frac{S/2}{v_1}$ và $t_2 = \\frac{S/2}{v_2}$.'],
        solutionSteps: [
          'Bước 1: Gọi độ dài toàn bộ quãng đường là $S$ (km). Thời gian đi nửa đầu là $t_1 = \\frac{S}{2v_1} = \\frac{S}{80}$ (h).',
          'Bước 2: Thời gian đi nửa sau là $t_2 = \\frac{S}{2v_2} = \\frac{S}{120}$ (h).',
          'Bước 3: Tổng thời gian $t = t_1 + t_2 = S\\left(\\frac{1}{80} + \\frac{1}{120}\\right) = \\frac{5S}{240} = \\frac{S}{48}$ (h).',
          'Bước 4: Tốc độ trung bình $v_{tb} = \\frac{S}{t} = 48\\text{ km/h}$.'
        ],
        finalAnswer: '$v_{tb} = 48\\text{ km/h}$ (lưu ý khác trung bình cộng $50\\text{ km/h}$!).'
      },
      {
        source: 'Loigiaihay · Phương trình Cân bằng nhiệt',
        question:
          'Thả một quả cầu nhôm khối lượng $0{,}5\\text{ kg}$ ở nhiệt độ $100^\\circ\\text{C}$ vào $2\\text{ kg}$ nước ở $20^\\circ\\text{C}$. Biết $c_{\\text{nhôm}} = 880\\text{ J/(kg}\\cdot\\text{K)}$, $c_{\\text{nước}} = 4200\\text{ J/(kg}\\cdot\\text{K)}$. Bỏ qua hao phí, tìm nhiệt độ khi cân bằng.',
        hints: ['Viết $Q_{\\text{tỏa}} = m_1 c_1 (100 - t)$ và $Q_{\\text{thu}} = m_2 c_2 (t - 20)$.'],
        solutionSteps: [
          'Bước 1: Gọi $t$ ($^\\circ\\text{C}$) là nhiệt độ khi có cân bằng nhiệt ($20 < t < 100$).',
          'Bước 2: Nhiệt lượng nhôm tỏa ra: $Q_{\\text{tỏa}} = 0{,}5 \\cdot 880 \\cdot (100 - t) = 440(100 - t)$.',
          'Bước 3: Nhiệt lượng nước thu vào: $Q_{\\text{thu}} = 2 \\cdot 4200 \\cdot (t - 20) = 8400(t - 20)$.',
          'Bước 4: Áp dụng $Q_{\\text{tỏa}} = Q_{\\text{thu}} \\Rightarrow 44000 - 440t = 8400t - 168000 \\Rightarrow 8840t = 212000 \\Rightarrow t \\approx 23{,}98^\\circ\\text{C}$.'
        ],
        finalAnswer: '$t \\approx 24^\\circ\\text{C}$.'
      }
    ]
  },

  {
    id: 'phys-9-elec',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Hệ thống kiến thức Lớp 9 · Điện học & Điện từ',
    sourceTag: 'SGK KHTN 9 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 2,
    title: 'Điện học & Điện từ Lớp 9: Định luật Ôm, Công suất điện & Jun – Len-xơ',
    subtitle: 'Đoạn mạch nối tiếp – song song, công suất điện P = UI, định luật Jun – Len-xơ và hiện tượng cảm ứng điện từ',
    description:
      'Làm chủ công thức Định luật Ôm $I = U/R$, cách tính điện trở tương đương mạch nối tiếp và song song, tính tiền điện theo $A = P \\cdot t$, tỏa nhiệt Jun – Len-xơ và điều kiện xuất hiện dòng điện cảm ứng.',
    theorySections: [
      {
        heading: '1. Định luật Ôm & Đoạn mạch nối tiếp / song song',
        content:
          '• Định luật Ôm: Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở của dây: $I = \\frac{U}{R}$.\n• Mắc nối tiếp: $I = I_1 = I_2$; $U = U_1 + U_2$; $R_{tđ} = R_1 + R_2$.\n• Mắc song song: $U = U_1 = U_2$; $I = I_1 + I_2$; $\\frac{1}{R_{tđ}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\Rightarrow R_{tđ} = \\frac{R_1 R_2}{R_1 + R_2}$.'
      },
      {
        heading: '2. Công suất điện & Định luật Jun – Len-xơ',
        content:
          '• Công suất điện của đoạn mạch: $P = U \\cdot I = I^2 R = \\frac{U^2}{R}$ (đơn vị W).\n• Điện năng tiêu thụ: $A = P \\cdot t = U I t$ (đổi $1\\text{ kWh} = 3{,}6 \\cdot 10^6\\text{ J}$).\n• Định luật Jun – Len-xơ: Nhiệt lượng tỏa ra ở dây dẫn khi có dòng điện chạy qua tỉ lệ thuận với bình phương cường độ dòng điện, điện trở và thời gian: $Q = I^2 R t$.'
      },
      {
        heading: '3. Hiện tượng Cảm ứng điện từ',
        content:
          '• Điều kiện xuất hiện dòng điện cảm ứng trong cuộn dây dẫn kín: Số đường sức từ xuyên qua tiết diện $S$ của cuộn dây biến thiên (tăng hoặc giảm).\n• Máy phát điện xoay chiều hoạt động dựa trên hiện tượng cảm ứng điện từ nhờ quay cuộn dây hoặc quay nam châm.'
      }
    ],
    keyFormulas: [
      'I = \\frac{U}{R}, \\quad R_{nt} = R_1 + R_2, \\quad R_{ss} = \\frac{R_1 R_2}{R_1 + R_2}',
      'P = U I = I^2 R = \\frac{U^2}{R}',
      'Q = I^2 R t \\quad (\\text{Jun – Len-xơ})',
      '1\\text{ kWh} = 3{,}6 \\cdot 10^6\\text{ J}'
    ],
    simulationType: 'ohm_circuit',
    sim3dType: 'lorentz_helix',
    defaultParams: { voltage: 12, r1: 10, r2: 15, circuitType: 0 },
    paramBounds: {
      voltage: { min: 3, max: 24, step: 1, unit: 'V', label: 'Hiệu điện thế U' },
      r1: { min: 5, max: 50, step: 1, unit: 'Ω', label: 'Điện trở R₁' },
      r2: { min: 5, max: 50, step: 1, unit: 'Ω', label: 'Điện trở R₂' },
      circuitType: { min: 0, max: 1, step: 1, unit: '(0:NT / 1:SS)', label: 'Kiểu mạch' }
    },
    practiceExercises: [
      {
        source: 'VietJack · KHTN 9 KNTT',
        question:
          'Hai điện trở $R_1 = 6\\,\\Omega$ và $R_2 = 12\\,\\Omega$ mắc song song vào hiệu điện thế $U = 12\\text{ V}$. Cường độ dòng điện mạch chính là:',
        options: ['A. 3 A', 'B. 2 A', 'C. 1 A', 'D. 0,67 A'],
        correctIndex: 0,
        explanation:
          'Điện trở tương đương mạch song song: $R_{tđ} = \\frac{6 \\cdot 12}{6 + 12} = 4\\,\\Omega$. Dòng điện mạch chính: $I = \\frac{U}{R_{tđ}} = \\frac{12}{4} = 3\\text{ A}$.'
      },
      {
        source: 'Loigiaihay · Vật lí 9',
        question:
          'Một bếp điện có điện trở $R = 40\\,\\Omega$ hoạt động với dòng điện $I = 2{,}5\\text{ A}$ trong $10\\text{ phút}$. Nhiệt lượng bếp tỏa ra là:',
        options: ['A. 150 kJ', 'B. 2,5 kJ', 'C. 1500 J', 'D. 250 kJ'],
        correctIndex: 0,
        explanation:
          'Đổi thời gian $t = 10 \\cdot 60 = 600\\text{ s}$. Áp dụng định luật Jun – Len-xơ: $Q = I^2 R t = 2{,}5^2 \\cdot 40 \\cdot 600 = 6{,}25 \\cdot 24000 = 150\\,000\\text{ J} = 150\\text{ kJ}$.'
      },
      {
        source: 'VietJack · Cảm ứng điện từ 9',
        question: 'Dòng điện cảm ứng xuất hiện trong cuộn dây dẫn kín khi:',
        options: [
          'A. Đặt cuộn dây đứng yên trong từ trường đều',
          'B. Số đường sức từ xuyên qua tiết diện cuộn dây biến thiên',
          'C. Đặt cuộn dây gần một thanh nam châm đứng yên',
          'D. Nối hai đầu cuộn dây với một bóng đèn không có từ trường'
        ],
        correctIndex: 1,
        explanation:
          'Điều kiện cần và đủ để xuất hiện dòng điện cảm ứng trong cuộn dây dẫn kín là số đường sức từ xuyên qua tiết diện của cuộn dây biến thiên theo thời gian.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Bài tập Tự luận Điện học 9',
        question:
          'Cho đoạn mạch gồm $R_1 = 10\\,\\Omega$ mắc nối tiếp với $R_2 = 20\\,\\Omega$ vào nguồn điện $U = 15\\text{ V}$. Tính: a) Điện trở tương đương và cường độ dòng điện qua mạch; b) Công suất tỏa nhiệt trên mỗi điện trở.',
        hints: ['Mạch nối tiếp có $R_{tđ} = R_1 + R_2$ và dòng điện qua hai điện trở bằng nhau.'],
        solutionSteps: [
          'a) Điện trở tương đương: $R_{tđ} = R_1 + R_2 = 10 + 20 = 30\\,\\Omega$.',
          'Cường độ dòng điện trong mạch: $I = \\frac{U}{R_{tđ}} = \\frac{15}{30} = 0{,}5\\text{ A}$.',
          'b) Công suất tỏa nhiệt trên $R_1$: $P_1 = I^2 R_1 = 0{,}5^2 \\cdot 10 = 2{,}5\\text{ W}$.',
          'Công suất tỏa nhiệt trên $R_2$: $P_2 = I^2 R_2 = 0{,}5^2 \\cdot 20 = 5{,}0\\text{ W}$.'
        ],
        finalAnswer: 'a) $R_{tđ} = 30\\,\\Omega$, $I = 0{,}5\\text{ A}$; b) $P_1 = 2{,}5\\text{ W}$, $P_2 = 5\\text{ W}$.'
      },
      {
        source: 'Loigiaihay · Bài tập Bóng đèn 9',
        question:
          'Một bóng đèn có ghi $220\\text{ V} - 100\\text{ W}$ được thắp sáng liên tục ở hiệu điện thế $220\\text{ V}$ trong $4\\text{ giờ}$ mỗi ngày. Tính tiền điện phải trả cho bóng đèn này trong 30 ngày, biết giá điện là $2500\\text{ đồng/kWh}$.',
        hints: ['Đổi công suất sang kW: $100\\text{ W} = 0{,}1\\text{ kW}$, tính điện năng $A = P \\cdot t$.'],
        solutionSteps: [
          'Bước 1: Đổi công suất $P = 100\\text{ W} = 0{,}1\\text{ kW}$.',
          'Bước 2: Tổng thời gian sử dụng trong 30 ngày: $t = 4 \\cdot 30 = 120\\text{ giờ}$.',
          'Bước 3: Điện năng tiêu thụ: $A = P \\cdot t = 0{,}1 \\cdot 120 = 12\\text{ kWh}$.',
          'Bước 4: Tiền điện phải trả: $T = 12 \\cdot 2500 = 30\\,000\\text{ đồng}$.'
        ],
        finalAnswer: '$A = 12\\text{ kWh}$, tiền điện $= 30\\,000\\text{ đồng}$.'
      }
    ]
  },

  {
    id: 'phys-9-optics',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Hệ thống kiến thức Lớp 9 · Quang học',
    sourceTag: 'SGK KHTN 9 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 3,
    title: 'Quang học Lớp 9: Khúc xạ ánh sáng, Thấu kính & Vẽ ảnh cơ bản',
    subtitle: 'Hiện tượng khúc xạ, thấu kính hội tụ – phân kỳ, 3 tia sáng đặc biệt và công thức xác định vị trí – độ cao ảnh',
    description:
      'Nắm chắc hiện tượng khúc xạ ánh sáng khi truyền qua hai môi trường trong suốt, cách phân biệt thấu kính hội tụ và phân kỳ, quy tắc dựng ảnh bằng 3 tia sáng đặc biệt và kiểm nghiệm ngay trên mô phỏng 2D/3D.',
    theorySections: [
      {
        heading: '1. Hiện tượng Khúc xạ ánh sáng',
        content:
          '• Khúc xạ ánh sáng là hiện tượng tia sáng bị gãy khúc tại mặt phân cách khi truyền xiên góc từ môi trường trong suốt này sang môi trường trong suốt khác.\n• Định luật khúc xạ: $n_1 \\sin i = n_2 \\sin r$. Khi ánh sáng đi từ không khí ($n_1 \\approx 1$) vào nước hoặc thủy tinh ($n_2 > 1$), góc khúc xạ $r < i$ (tia khúc xạ lệch lại gần pháp tuyến hơn).'
      },
      {
        heading: '2. Thấu kính Hội tụ & Thấu kính Phân kỳ',
        content:
          '• Thấu kính hội tụ (rìa mỏng hơn phần giữa): Chùm tia tới song song cho chùm tia ló hội tụ tại tiêu điểm $F\'$. Cho ảnh thật ngược chiều khi $d > f$, ảnh ảo cùng chiều lớn hơn vật khi $d < f$.\n• Thấu kính phân kỳ (rìa dày hơn phần giữa): Chùm tia tới song song cho chùm tia ló phân kỳ có đường kéo dài cắt nhau tại $F\'$. Luôn cho ảnh ảo, cùng chiều, nhỏ hơn vật với mọi vị trí vật thật.'
      },
      {
        heading: '3. Ba tia sáng đặc biệt để vẽ ảnh qua thấu kính',
        content:
          '• Tia 1: Qua quang tâm $O$ → truyền thẳng không bị đổi hướng.\n• Tia 2: Song song trục chính → tia ló (hoặc đường kéo dài) đi qua tiêu điểm ảnh $F\'$.\n• Tia 3: Đi qua (hoặc hướng tới) tiêu điểm vật $F$ → tia ló song song trục chính.\n• Công thức thấu kính: $\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}$ và độ phóng đại $k = -\\frac{d\'}{d}$ (quy ước $f > 0$ hội tụ, $f < 0$ phân kỳ).'
      }
    ],
    keyFormulas: [
      'n_1 \\sin i = n_2 \\sin r',
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
        source: 'VietJack · KHTN 9 KNTT',
        question:
          'Đặt vật sáng $AB$ vuông góc với trục chính của một thấu kính hội tụ có tiêu cự $f = 12\\text{ cm}$, cách thấu kính $d = 24\\text{ cm}$. Ảnh $A\'B\'$ thu được có đặc điểm nào?',
        options: [
          'A. Ảnh thật, ngược chiều, bằng vật',
          'B. Ảnh thật, ngược chiều, lớn hơn vật',
          'C. Ảnh ảo, cùng chiều, lớn hơn vật',
          'D. Ảnh thật, cùng chiều, bằng vật'
        ],
        correctIndex: 0,
        explanation:
          'Vì $d = 24\\text{ cm} = 2f$, áp dụng $\\frac{1}{d\'} = \\frac{1}{12} - \\frac{1}{24} = \\frac{1}{24} \\Rightarrow d\' = 24\\text{ cm} > 0$ (ảnh thật). Độ phóng đại $k = -d\'/d = -1$, vậy ảnh thật, ngược chiều và cao bằng vật.'
      },
      {
        source: 'Loigiaihay · Quang học 9',
        question: 'Tính chất ảnh của vật thật qua thấu kính phân kỳ luôn là:',
        options: [
          'A. Ảnh thật, ngược chiều, nhỏ hơn vật',
          'B. Ảnh ảo, cùng chiều, nhỏ hơn vật',
          'C. Ảnh ảo, cùng chiều, lớn hơn vật',
          'D. Ảnh thật khi d > f, ảnh ảo khi d < f'
        ],
        correctIndex: 1,
        explanation:
          'Vật thật đặt trước thấu kính phân kỳ ở mọi vị trí đều luôn cho ảnh ảo, cùng chiều và nhỏ hơn vật (nằm trong khoảng $OF$).'
      },
      {
        source: 'VietJack · Khúc xạ ánh sáng 9',
        question:
          'Chiếu tia sáng từ không khí ($n_1 = 1$) vào nước ($n_2 = 4/3$) dưới góc tới $i = 45^\\circ$. So sánh góc khúc xạ $r$ và góc tới $i$:',
        options: ['A. r < i', 'B. r > i', 'C. r = i', 'D. r = 90°'],
        correctIndex: 0,
        explanation:
          'Áp dụng định luật khúc xạ $1 \\cdot \\sin 45^\\circ = \\frac{4}{3}\\sin r \\Rightarrow \\sin r = \\frac{3}{4}\\sin 45^\\circ < \\sin 45^\\circ \\Rightarrow r < i$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Thấu kính 9',
        question:
          'Vật sáng $AB$ cao $h = 2\\text{ cm}$ đặt vuông góc với trục chính của thấu kính hội tụ tiêu cự $f = 15\\text{ cm}$, cách thấu kính $d = 10\\text{ cm}$. Hãy xác định tính chất, vị trí và chiều cao của ảnh $A\'B\'$.',
        hints: ['Do $d = 10\\text{ cm} < f = 15\\text{ cm}$, ảnh tạo thành là ảnh ảo ($d\' < 0$).'],
        solutionSteps: [
          'Bước 1: Áp dụng công thức thấu kính: $\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'} \\Rightarrow \\frac{1}{d\'} = \\frac{1}{15} - \\frac{1}{10} = -\\frac{1}{30}$.',
          'Bước 2: Suy ra $d\' = -30\\text{ cm} < 0$. Vậy ảnh $A\'B\'$ là ảnh ảo, nằm cùng phía với vật và cách thấu kính $30\\text{ cm}$.',
          'Bước 3: Chiều cao ảnh: $\\frac{A\'B\'}{AB} = \\left|\\frac{d\'}{d}\\right| = \\frac{30}{10} = 3 \\Rightarrow A\'B\' = 3 \\cdot 2 = 6\\text{ cm}$.'
        ],
        finalAnswer: 'Ảnh ảo, cùng chiều vật, cách thấu kính $30\\text{ cm}$, cao $6\\text{ cm}$.'
      },
      {
        source: 'Loigiaihay · Thấu kính Phân kỳ 9',
        question:
          'Đặt một vật sáng $AB$ cao $4\\text{ cm}$ cách thấu kính phân kỳ tiêu cự $f = -20\\text{ cm}$ một khoảng $d = 20\\text{ cm}$. Tính khoảng cách từ ảnh đến thấu kính và chiều cao ảnh.',
        hints: ['Với thấu kính phân kỳ, thay $f = -20\\text{ cm}$ vào $\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}$.'],
        solutionSteps: [
          'Bước 1: Thay số vào công thức thấu kính: $\\frac{1}{-20} = \\frac{1}{20} + \\frac{1}{d\'}$.',
          'Bước 2: Suy ra $\\frac{1}{d\'} = -\\frac{1}{20} - \\frac{1}{20} = -\\frac{1}{10} \\Rightarrow d\' = -10\\text{ cm}$.',
          'Bước 3: Chiều cao ảnh: $A\'B\' = AB \\cdot \\left|\\frac{d\'}{d}\\right| = 4 \\cdot \\frac{10}{20} = 2\\text{ cm}$.'
        ],
        finalAnswer: 'Ảnh ảo cách thấu kính $10\\text{ cm}$, cao $2\\text{ cm}$.'
      }
    ]
  },

  {
    id: 'phys-9-math-vec',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Công cụ Toán cho Lý 10 · Lượng giác, Đồ thị & Làm quen Vectơ',
    sourceTag: 'Chuẩn bị nền tảng 9 lên 10 · VietJack · Loigiaihay',
    lessonNumber: 4,
    title: 'Công cụ Toán & Vectơ lên Lý 10: Lượng giác, Hàm số y = ax + b & Vectơ',
    subtitle: 'Tỉ số sin, cos, tan trong tam giác vuông; đọc đồ thị bậc nhất y = ax + b; quy tắc cộng vectơ và chiếu lên trục tọa độ',
    description:
      'Cầu nối quan trọng nhất từ Vật lí 9 lên Vật lí 10: dùng thuần thục $\\sin, \\cos, \\tan$ để phân tích lực, hiểu hệ số góc đường thẳng $y = ax + b$ trên đồ thị chuyển động và thực hiện phép cộng – chiếu vectơ lên hai trục $Ox, Oy$.',
    theorySections: [
      {
        heading: '1. Tỉ số lượng giác sin, cos, tan trong tam giác vuông',
        content:
          '• Trong tam giác vuông có góc nhọn $\\alpha$:\n  – $\\sin\\alpha = \\frac{\\text{Đối}}{\\text{Huyền}}$  |  $\\cos\\alpha = \\frac{\\text{Kề}}{\\text{Huyền}}$  |  $\\tan\\alpha = \\frac{\\text{Đối}}{\\text{Kề}}$.\n• Ứng dụng Lý 10: Một lực $\\vec{F}$ hợp với phương ngang $Ox$ một góc $\\alpha$ được phân tích thành hai thành phần vuông góc: $F_x = F\\cos\\alpha$ và $F_y = F\\sin\\alpha$.'
      },
      {
        heading: '2. Hàm số bậc nhất y = ax + b & Ý nghĩa hệ số góc',
        content:
          '• Đồ thị hàm số $y = ax + b$ ($a \\neq 0$) là một đường thẳng cắt trục tung tại $y = b$.\n• Hệ số góc $a$ quyết định độ dốc của đường thẳng: $a > 0$ đường đi lên (đồng biến); $a < 0$ đường đi xuống (nghịch biến).\n• Trong Vật lí 10: Phương trình tọa độ chuyển động thẳng đều $x = x_0 + v \\cdot t$ chính là hàm bậc nhất với hệ số góc $a = v$ (vận tốc) và tung độ gốc $b = x_0$!'
      },
      {
        heading: '3. Khái niệm Vectơ, Quy tắc cộng & Chiếu lên trục tọa độ',
        content:
          '• Mỗi đại lượng vectơ ($\vec{v}, \\vec{a}, \\vec{F}$) gồm 4 yếu tố: **Điểm đặt, Phương, Chiều, Độ lớn**.\n• Quy tắc hình bình hành: Tổng hai vectơ đồng quy $\\vec{F} = \\vec{F}_1 + \\vec{F}_2$ là đường chéo hình bình hành, độ lớn:\n  $$F = \\sqrt{F_1^2 + F_2^2 + 2F_1 F_2\\cos\\alpha}$$\n• Chiếu vectơ $\\vec{a}$ lên trục $Ox$: Nếu $\\vec{a}$ cùng chiều $Ox$ lấy $+a$; ngược chiều lấy $-a$; hợp góc $\\alpha$ lấy $a\\cos\\alpha$; vuông góc $Ox$ bằng $0$.'
      }
    ],
    keyFormulas: [
      '\\sin\\alpha = \\frac{\\text{Đối}}{\\text{Huyền}}, \\quad \\cos\\alpha = \\frac{\\text{Kề}}{\\text{Huyền}}, \\quad \\tan\\alpha = \\frac{\\text{Đối}}{\\text{Kề}}',
      'F_x = F\\cos\\alpha, \\quad F_y = F\\sin\\alpha',
      'F = \\sqrt{F_1^2 + F_2^2 + 2F_1 F_2\\cos\\alpha}',
      'y = ax + b \\iff x(t) = v\\cdot t + x_0'
    ],
    simulationType: 'kinematics_graphs',
    sim3dType: 'kinematics_3d',
    defaultParams: { vizMode: 0, angleDeg: 35, f1: 30, f2: 20, v0: 4, accel: 1.5 },
    paramBounds: {
      vizMode: { min: 0, max: 2, step: 1, unit: '(0:Vectơ/Tam giác | 1:d-t | 2:v-t)', label: 'Chế độ 2D' },
      angleDeg: { min: 0, max: 150, step: 5, unit: '°', label: 'Góc nghiêng α' },
      f1: { min: 10, max: 50, step: 2, unit: 'N', label: 'Độ lớn F₁' },
      f2: { min: 10, max: 50, step: 2, unit: 'N', label: 'Độ lớn F₂' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Công cụ Toán Lý 10',
        question:
          'Một người kéo xe bằng lực $F = 100\\text{ N}$ hợp với phương ngang $Ox$ một góc $\\alpha = 60^\\circ$. Hình chiếu của lực $\\vec{F}$ lên phương ngang $Ox$ là:',
        options: ['A. 50 N', 'B. 86,6 N', 'C. 100 N', 'D. 57,7 N'],
        correctIndex: 0,
        explanation:
          'Hình chiếu lên phương ngang $Ox$: $F_x = F \\cdot \\cos\\alpha = 100 \\cdot \\cos 60^\\circ = 100 \\cdot 0{,}5 = 50\\text{ N}$.'
      },
      {
        source: 'Loigiaihay · Tổng hợp Vectơ 10',
        question:
          'Hai lực đồng quy có độ lớn $F_1 = 6\\text{ N}$ và $F_2 = 8\\text{ N}$ hợp với nhau một góc $\\alpha = 90^\\circ$. Độ lớn hợp lực $F$ bằng:',
        options: ['A. 10 N', 'B. 14 N', 'C. 2 N', 'D. 48 N'],
        correctIndex: 0,
        explanation:
          'Vì hai vectơ vuông góc ($\\cos 90^\\circ = 0$), áp dụng định lý Pytago: $F = \\sqrt{F_1^2 + F_2^2} = \\sqrt{6^2 + 8^2} = 10\\text{ N}$.'
      },
      {
        source: 'VietJack · Đồ thị hàm số trong Lý 10',
        question:
          'Đồ thị tọa độ – thời gian của một xe là đường thẳng $x = 12t + 5$ ($x$ tính bằng mét, $t$ tính bằng giây). Hệ số góc của đường thẳng cho biết giá trị nào sau đây?',
        options: [
          'A. Vận tốc của xe là 12 m/s',
          'B. Vận tốc của xe là 5 m/s',
          'C. Gia tốc của xe là 12 m/s²',
          'D. Quãng đường đi được là 17 m'
        ],
        correctIndex: 0,
        explanation:
          'So sánh $x = 12t + 5$ với hàm bậc nhất $y = ax + b$: hệ số góc $a = 12$ chính là vận tốc $v = 12\\text{ m/s}$, còn $b = 5\\text{ m}$ là tọa độ ban đầu $x_0$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Phân tích & Tổng hợp Vectơ',
        question:
          'Cho hai lực đồng quy $F_1 = 30\\text{ N}$ và $F_2 = 30\\text{ N}$ hợp với nhau một góc $\\alpha = 60^\\circ$. Tính độ lớn hợp lực $\\vec{F} = \\vec{F}_1 + \\vec{F}_2$ và góc hợp bởi $\\vec{F}$ với $\\vec{F}_1$.',
        hints: ['Dùng công thức hình bình hành $F = \\sqrt{F_1^2 + F_2^2 + 2F_1F_2\\cos 60^\\circ}$. Do $F_1 = F_2$, hình bình hành là hình thoi.'],
        solutionSteps: [
          'Bước 1: Tính độ lớn hợp lực: $F = \\sqrt{30^2 + 30^2 + 2\\cdot 30 \\cdot 30 \\cdot \\cos 60^\\circ} = \\sqrt{900 + 900 + 900} = 30\\sqrt{3} \\approx 51{,}96\\text{ N}$.',
          'Bước 2: Vì $F_1 = F_2$, vectơ hợp lực $\\vec{F}$ là đường chéo hình thoi nên là tia phân giác của góc giữa $\\vec{F}_1$ và $\\vec{F}_2$.',
          'Bước 3: Góc giữa $\\vec{F}$ và $\\vec{F}_1$ là $\\frac{60^\\circ}{2} = 30^\\circ$.'
        ],
        finalAnswer: '$F = 30\\sqrt{3}\\text{ N} \\approx 51{,}96\\text{ N}$, hợp với $\\vec{F}_1$ góc $30^\\circ$.'
      },
      {
        source: 'Loigiaihay · Chiếu Vectơ trên Mặt phẳng nghiêng',
        question:
          'Một vật có trọng lượng $P = 50\\text{ N}$ đặt trên mặt phẳng nghiêng góc $\\alpha = 30^\\circ$ so với phương ngang. Chọn trục $Ox$ song song mặt phẳng nghiêng hướng xuống, trục $Oy$ vuông góc mặt nghiêng hướng lên. Tìm tọa độ hình chiếu $P_x, P_y$ của trọng lực $\\vec{P}$.',
        hints: ['Trọng lực $\\vec{P}$ hướng thẳng đứng xuống dưới, hợp với phương vuông góc mặt nghiêng một góc $\\alpha = 30^\\circ$.'],
        solutionSteps: [
          'Bước 1: Theo phương $Ox$ dọc dốc xuống dưới: thành phần kéo vật trượt xuống có độ lớn $P_x = +P\\sin 30^\\circ = 50 \\cdot 0{,}5 = 25\\text{ N}$.',
          'Bước 2: Theo phương $Oy$ vuông góc mặt nghiêng hướng lên: trọng lực hướng vào mặt nghiêng nên mang dấu âm: $P_y = -P\\cos 30^\\circ = -50 \\cdot \\frac{\\sqrt{3}}{2} = -25\\sqrt{3} \\approx -43{,}3\\text{ N}$.'
        ],
        finalAnswer: '$P_x = +25\\text{ N}$, $P_y = -25\\sqrt{3}\\text{ N} \\approx -43{,}3\\text{ N}$.'
      }
    ]
  },

  // ---------- LỚP 10 ----------
  {
    id: 'phys-10-intro-err',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương trình Vật lí 10 GDPT 2018 · Mở đầu & Sai số',
    sourceTag: 'SGK Vật lí 10 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 5,
    title: 'Mở đầu Vật lí, An toàn phòng thực hành & Sai số phép đo',
    subtitle: 'Quy tắc an toàn thí nghiệm, phân loại sai số hệ thống/ngẫu nhiên, tính sai số tuyệt đối – tỉ đối và ghi kết quả đo chuẩn SI',
    description:
      'Làm chủ quy tắc an toàn khi thao tác thiết bị điện – nhiệt – quang trong phòng thực hành và quy trình xử lý số liệu thực nghiệm: tính giá trị trung bình, sai số ngẫu nhiên, sai số dụng cụ và viết đúng chuẩn $A = \\overline{A} \\pm \\Delta A$.',
    theorySections: [
      {
        heading: '1. An toàn trong phòng thực hành Vật lí',
        content:
          '• Đọc kỹ hướng dẫn trước khi sử dụng thiết bị điện, laze, nguồn nhiệt.\n• Không chạm tay ướt vào mạch điện; kiểm tra giới hạn đo (GHĐ) và độ chia nhỏ nhất (ĐCNN) của Ampe kế, Vôn kế trước khi đóng công tắc.\n• Khi đo bằng đồng hồ bấm giây hoặc cổng quang điện, đặt mắt vuông góc với vạch chia để tránh sai số thị sai.'
      },
      {
        heading: '2. Phân loại Sai số & Giá trị trung bình',
        content:
          '• **Sai số hệ thống**: Xuất phát từ đặc điểm dụng cụ (lệch điểm 0, ĐCNN). Sai số dụng cụ thường lấy $\\Delta A_{dc} = \\frac{1}{2}$ hoặc $1$ ĐCNN.\n• **Sai số ngẫu nhiên**: Do điều kiện ngoài hay thao tác thay đổi. Giảm sai số này bằng cách đo lặp lại $n$ lần:\n  $$\\overline{A} = \\frac{A_1 + A_2 + \\dots + A_n}{n}$$\n  $$\\Delta A_i = |\\overline{A} - A_i|, \\quad \\overline{\\Delta A} = \\frac{\\Delta A_1 + \\dots + \\Delta A_n}{n}$$'
      },
      {
        heading: '3. Sai số tuyệt đối, Sai số tỉ đối & Cách ghi kết quả',
        content:
          '• Sai số tuyệt đối của phép đo: $\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}$ (làm tròn lên giữ 1 hoặc tối đa 2 chữ số có nghĩa).\n• Sai số tỉ đối (đánh giá độ chính xác phép đo): $\\delta A = \\frac{\\Delta A}{\\overline{A}} \\cdot 100\\%$.\n• Cách ghi kết quả chuẩn: $A = \\overline{A} \\pm \\Delta A$ (trong đó số chữ số thập phân của $\\overline{A}$ khớp với $\\Delta A$).'
      }
    ],
    keyFormulas: [
      '\\overline{A} = \\frac{A_1 + A_2 + \\dots + A_n}{n}',
      '\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}',
      '\\delta A = \\frac{\\Delta A}{\\overline{A}} \\cdot 100\\%',
      'A = \\overline{A} \\pm \\Delta A'
    ],
    simulationType: 'kinematics_graphs',
    sim3dType: 'kinematics_3d',
    defaultParams: { vizMode: 1, v0: 4, accel: 0, angleDeg: 0, f1: 20, f2: 20 },
    paramBounds: {
      vizMode: { min: 0, max: 2, step: 1, unit: '(1:Đồ thị đo s-t)', label: 'Chế độ 2D' },
      v0: { min: 1, max: 10, step: 0.5, unit: 'm/s', label: 'Tốc độ đo được' },
      accel: { min: 0, max: 4, step: 0.2, unit: 'm/s²', label: 'Độ lệch gia tốc' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Vật lí 10 KNTT Bài 3',
        question:
          'Dùng thước thẳng có độ chia nhỏ nhất là $1\\text{ mm}$ đo chiều dài chiếc bút qua 3 lần được $14{,}2\\text{ cm}; 14{,}3\\text{ cm}; 14{,}1\\text{ cm}$. Lấy sai số dụng cụ bằng một nửa ĐCNN. Kết quả phép đo viết chuẩn là:',
        options: [
          'A. $14{,}20 \\pm 0{,}12\\text{ cm}$',
          'B. $14{,}2 \\pm 0{,}05\\text{ cm}$',
          'C. $14{,}2 \\pm 0{,}2\\text{ cm}$',
          'D. $14{,}15 \\pm 0{,}1\\text{ cm}$'
        ],
        correctIndex: 0,
        explanation:
          'Giá trị trung bình $\\overline{l} = (14{,}2+14{,}3+14{,}1)/3 = 14{,}20\\text{ cm}$. Sai số ngẫu nhiên $\\overline{\\Delta l} = (0 + 0{,}1 + 0{,}1)/3 \\approx 0{,}067\\text{ cm}$. Sai số dụng cụ $\\Delta l_{dc} = 0{,}05\\text{ cm}$. Tổng $\\Delta l = 0{,}067 + 0{,}05 = 0{,}117 \\approx 0{,}12\\text{ cm}$. Viết: $14{,}20 \\pm 0{,}12\\text{ cm}$.'
      },
      {
        source: 'Loigiaihay · Vật lí 10 CTST',
        question: 'Sai số nào sau đây có thể hạn chế bằng cách đo lặp lại nhiều lần và lấy giá trị trung bình?',
        options: [
          'A. Sai số ngẫu nhiên',
          'B. Sai số dụng cụ do thước bị gãy đầu',
          'C. Sai số do kim đồng hồ lệch vạch 0',
          'D. Sai số hệ thống'
        ],
        correctIndex: 0,
        explanation:
          'Đo lặp lại nhiều lần rồi lấy trung bình cộng giúp triệt tiêu bớt các dao động bất thường, qua đó giảm thiểu sai số ngẫu nhiên.'
      },
      {
        source: 'VietJack · Thực hành đo tốc độ 10',
        question:
          'Phép đo gia tốc trọng trường cho kết quả $g = 9{,}80 \\pm 0{,}15\\text{ (m/s}^2\\text{)}$. Sai số tỉ đối của phép đo xấp xỉ:',
        options: ['A. 1,53%', 'B. 0,15%', 'C. 3,06%', 'D. 6,53%'],
        correctIndex: 0,
        explanation:
          'Sai số tỉ đối $\\delta g = \\frac{\\Delta g}{\\overline{g}} \\cdot 100\\% = \\frac{0{,}15}{9{,}80} \\cdot 100\\% \\approx 1{,}53\\%$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Thực hành sai số 10',
        question:
          'Đo thời gian rơi tự do của một viên bi qua quãng đường $s = 1{,}00\\text{ m}$ trong 4 lần thu được: $0{,}45\\text{ s};\\; 0{,}46\\text{ s};\\; 0{,}44\\text{ s};\\; 0{,}45\\text{ s}$. Đồng hồ bấm giây có ĐCNN là $0{,}01\\text{ s}$ (lấy $\\Delta t_{dc} = 0{,}01\\text{ s}$). Hãy viết kết quả phép đo $t$ và tính sai số tỉ đối $\\delta t$.',
        hints: ['Tính $\\overline{t}$, sau đó tính từng $|\\overline{t} - t_i|$ rồi cộng $\\Delta t_{dc}$.'],
        solutionSteps: [
          'Bước 1: Giá trị trung bình $\\overline{t} = \\frac{0{,}45 + 0{,}46 + 0{,}44 + 0{,}45}{4} = 0{,}450\\text{ s}$.',
          'Bước 2: Sai số tuyệt đối từng lần: $0;\\; 0{,}01;\\; 0{,}01;\\; 0 \\Rightarrow \\overline{\\Delta t} = \\frac{0 + 0{,}01 + 0{,}01 + 0}{4} = 0{,}005\\text{ s}$.',
          'Bước 3: Sai số tuyệt đối toàn phần: $\\Delta t = 0{,}005 + 0{,}01 = 0{,}015 \\approx 0{,}02\\text{ s}$ (làm tròn 1 chữ số có nghĩa thành $0{,}02\\text{ s}$ hoặc giữ $0{,}015$). Với $\\Delta t = 0{,}02\\text{ s}$: $t = 0{,}45 \\pm 0{,}02\\text{ s}$.',
          'Bước 4: Sai số tỉ đối $\\delta t = \\frac{0{,}02}{0{,}45} \\cdot 100\\% \\approx 4{,}44\\%$.'
        ],
        finalAnswer: '$t = 0{,}45 \\pm 0{,}02\\text{ s}$; $\\delta t \\approx 4{,}44\\%$.'
      },
      {
        source: 'Loigiaihay · Sai số phép đo gián tiếp',
        question:
          'Trong thí nghiệm đo tốc độ trung bình $v = \\frac{s}{t}$, người ta đo được $s = 2{,}00 \\pm 0{,}02\\text{ m}$ và $t = 0{,}50 \\pm 0{,}01\\text{ s}$. Tính sai số tỉ đối và viết kết quả đo $v$.',
        hints: ['Với phép đo gián tiếp $v = s/t$, sai số tỉ đối bằng tổng các sai số tỉ đối: $\\delta v = \\delta s + \\delta t$.'],
        solutionSteps: [
          'Bước 1: Giá trị trung bình $\\overline{v} = \\frac{2{,}00}{0{,}50} = 4{,}00\\text{ m/s}$.',
          'Bước 2: Sai số tỉ đối thành phần: $\\delta s = \\frac{0{,}02}{2{,}00} = 1\\%$; $\\delta t = \\frac{0{,}01}{0{,}50} = 2\\%$.',
          'Bước 3: Sai số tỉ đối của $v$: $\\delta v = 1\\% + 2\\% = 3\\%$.',
          'Bước 4: Sai số tuyệt đối $\\Delta v = 4{,}00 \\cdot 3\\% = 0{,}12\\text{ m/s}$.'
        ],
        finalAnswer: '$v = 4{,}00 \\pm 0{,}12\\text{ m/s}$ ($\\delta v = 3\\%$).'
      }
    ]
  },

  {
    id: 'phys-10-uniform',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương trình Vật lí 10 GDPT 2018 · Chuyển động thẳng đều',
    sourceTag: 'SGK Vật lí 10 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 6,
    title: 'Chuyển động thẳng đều: Quãng đường – Độ dịch chuyển & Đồ thị (d – t)',
    subtitle: 'Phân biệt quãng đường và độ dịch chuyển, tốc độ và vận tốc, quy tắc đọc đồ thị độ dịch chuyển – thời gian (d – t)',
    description:
      'Điểm mới quan trọng nhất của CT Vật lí 10 GDPT 2018: phân biệt rạch ròi đại lượng vô hướng (quãng đường $s$, tốc độ $v$) với đại lượng vectơ (độ dịch chuyển $\\vec{d}$, vận tốc $\\vec{v}$), đồng thời đọc thành thạo độ dốc đồ thị $(d - t)$.',
    theorySections: [
      {
        heading: '1. Phân biệt Quãng đường (s) và Độ dịch chuyển (d)',
        content:
          '• **Quãng đường $s$**: Độ dài quỹ đạo vật thực tế đi được, luôn $\\ge 0$, không đổi dấu.\n• **Độ dịch chuyển $\\vec{d}$**: Vectơ nối từ điểm đầu đến điểm cuối của chuyển động. Trên đường thẳng, độ dịch chuyển đại số $d = x - x_0$ có thể dương, âm hoặc bằng $0$ (khi vật đi rồi quay về vị trí xuất phát).'
      },
      {
        heading: '2. Phân biệt Tốc độ trung bình và Vận tốc trung bình',
        content:
          '• **Tốc độ trung bình** (vô hướng): $v_{tb} = \\frac{s}{\\Delta t}$ (luôn không âm).\n• **Vận tốc trung bình** (vectơ): $\\vec{v}_{tb} = \\frac{\\vec{d}}{\\Delta t}$ (có hướng, giá trị đại số $v = \\frac{\\Delta d}{\\Delta t}$ có thể âm nếu vật đi ngược chiều dương).'
      },
      {
        heading: '3. Đọc đồ thị Độ dịch chuyển – Thời gian (d – t)',
        content:
          '• Trong chuyển động thẳng đều, $d = v \\cdot t$ là đường thẳng xiên góc đi qua gốc tọa độ (hoặc $x = x_0 + vt$).\n• **Độ dốc (hệ số góc)** của đường thẳng trên đồ thị $(d - t)$ chính là vận tốc: $v = \\frac{d_2 - d_1}{t_2 - t_1}$.\n• Đoạn thẳng nằm ngang song song trục $Ot$: vật đứng yên ($v = 0$). Đoạn dốc xuống: vật chuyển động ngược chiều dương ($v < 0$).'
      }
    ],
    keyFormulas: [
      'v_{\\text{tốc độ}} = \\frac{s}{t}, \\quad \\vec{v}_{\\text{vận tốc}} = \\frac{\\vec{d}}{t}',
      'd(t) = v \\cdot t, \\quad x(t) = x_0 + v \\cdot t',
      'v = \\tan\\alpha = \\frac{\\Delta d}{\\Delta t} \\quad (\\text{Độ dốc đồ thị } d - t)'
    ],
    simulationType: 'kinematics_graphs',
    sim3dType: 'kinematics_3d',
    defaultParams: { vizMode: 1, v0: 6, accel: 0, angleDeg: 0, f1: 20, f2: 20 },
    paramBounds: {
      vizMode: { min: 1, max: 2, step: 1, unit: '(1: Đồ thị d-t | 2: v-t)', label: 'Loại đồ thị' },
      v0: { min: -8, max: 10, step: 0.5, unit: 'm/s', label: 'Vận tốc v' },
      accel: { min: 0, max: 0, step: 0.1, unit: 'm/s²', label: 'Gia tốc a = 0' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Vật lí 10 KNTT Bài 4',
        question:
          'Một học sinh đi bộ từ nhà đến trường cách $600\\text{ m}$ theo đường thẳng, rồi quay về tiệm sách nằm chính giữa nhà và trường. Tổng thời gian đi hết $10\\text{ phút}$. Tốc độ trung bình và vận tốc trung bình của học sinh lần lượt là:',
        options: [
          'A. 1,5 m/s và 0,5 m/s',
          'B. 0,5 m/s và 1,5 m/s',
          'C. 1,5 m/s và 1,5 m/s',
          'D. 1,0 m/s và 0,5 m/s'
        ],
        correctIndex: 0,
        explanation:
          'Tổng quãng đường $s = 600 + 300 = 900\\text{ m}$. Độ dịch chuyển từ nhà đến tiệm sách $d = 300\\text{ m}$. Thời gian $t = 10 \\cdot 60 = 600\\text{ s}$. Tốc độ TB $= 900/600 = 1{,}5\\text{ m/s}$; Vận tốc TB $= 300/600 = 0{,}5\\text{ m/s}$.'
      },
      {
        source: 'Loigiaihay · Đồ thị (d-t) 10',
        question: 'Trên đồ thị độ dịch chuyển – thời gian $(d - t)$, một đoạn thẳng nằm ngang song song với trục thời gian chứng tỏ:',
        options: [
          'A. Vật đang đứng yên',
          'B. Vật chuyển động thẳng đều',
          'C. Vật chuyển động nhanh dần đều',
          'D. Vật đi ngược chiều dương'
        ],
        correctIndex: 0,
        explanation:
          'Khi đường biểu diễn nằm ngang, độ dịch chuyển $d$ không đổi theo thời gian ($\\Delta d = 0$), tức là vận tốc $v = 0$ — vật đang đứng yên.'
      },
      {
        source: 'VietJack · Vật lí 10 CTST',
        question:
          'Hai xe A và B chuyển động thẳng đều có đồ thị $(d - t)$ là hai đường thẳng xuất phát từ gốc tọa độ. Đường biểu diễn của xe A dốc hơn xe B. Điều này kết luận:',
        options: [
          'A. Xe A có tốc độ lớn hơn xe B',
          'B. Xe B có tốc độ lớn hơn xe A',
          'C. Hai xe đi ngược chiều nhau',
          'D. Xe A xuất phát trước xe B'
        ],
        correctIndex: 0,
        explanation:
          'Hệ số góc của đồ thị $(d - t)$ bằng giá trị vận tốc $v$. Đường càng dốc thì vận tốc có độ lớn càng lớn.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Độ dịch chuyển & Tốc độ 10',
        question:
          'Một người bơi ngang qua sông rộng $60\\text{ m}$ hướng vuông góc với bờ với tốc độ $1{,}2\\text{ m/s}$ so với nước. Nước sông chảy dọc bờ với tốc độ $0{,}9\\text{ m/s}$. Tính độ lớn vận tốc tổng hợp và độ dịch chuyển của người đó khi sang tới bờ bên kia.',
        hints: ['Dùng quy tắc tổng hợp vận tốc $\\vec{v} = \\vec{v}_{12} + \\vec{v}_{23}$ do vuông góc nên $v = \\sqrt{v_1^2 + v_2^2}$.'],
        solutionSteps: [
          'Bước 1: Thời gian bơi qua sông chỉ phụ thuộc thành phần vuông góc bờ: $t = \\frac{60}{1{,}2} = 50\\text{ s}$.',
          'Bước 2: Độ lớn vận tốc tổng hợp: $v = \\sqrt{1{,}2^2 + 0{,}9^2} = \\sqrt{1{,}44 + 0{,}81} = 1{,}5\\text{ m/s}$.',
          'Bước 3: Quãng trôi dọc bờ là $s_{\\text{trôi}} = 0{,}9 \\cdot 50 = 45\\text{ m}$. Độ lớn độ dịch chuyển: $d = \\sqrt{60^2 + 45^2} = 75\\text{ m}$ (hoặc $d = v\\cdot t = 1{,}5 \\cdot 50 = 75\\text{ m}$).'
        ],
        finalAnswer: '$v = 1{,}5\\text{ m/s}$, độ lớn độ dịch chuyển $d = 75\\text{ m}$.'
      },
      {
        source: 'Loigiaihay · Phương trình chuyển động 10',
        question:
          'Lúc $7\\text{ giờ}$, xe A đi qua điểm O với vận tốc $40\\text{ km/h}$ theo chiều dương. Cùng lúc đó, xe B cách O một đoạn $120\\text{ km}$ chạy ngược chiều về phía O với vận tốc $20\\text{ km/h}$. Viết phương trình tọa độ hai xe và tìm vị trí, thời điểm hai xe gặp nhau.',
        hints: ['Chọn gốc tọa độ tại O, gốc thời gian lúc $7\\text{ h}$. Xe B đi ngược chiều dương nên $v_B < 0$.'],
        solutionSteps: [
          'Bước 1: Phương trình tọa độ xe A: $x_A = 40t$ (km).',
          'Bước 2: Phương trình tọa độ xe B: $x_B = 120 - 20t$ (km).',
          'Bước 3: Hai xe gặp nhau khi $x_A = x_B \\Rightarrow 40t = 120 - 20t \\Rightarrow 60t = 120 \\Rightarrow t = 2\\text{ giờ}$.',
          'Bước 4: Thời điểm gặp nhau là $7 + 2 = 9\\text{ giờ}$, tại vị trí cách O là $x = 40 \\cdot 2 = 80\\text{ km}$.'
        ],
        finalAnswer: 'Gặp nhau lúc $9\\text{ giờ}$, cách O $80\\text{ km}$.'
      }
    ]
  },

  {
    id: 'phys-10-accel',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương trình Vật lí 10 GDPT 2018 · Chuyển động biến đổi đều',
    sourceTag: 'SGK Vật lí 10 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 7,
    title: 'Chuyển động thẳng biến đổi đều: Gia tốc, Công thức & Đồ thị (v – t)',
    subtitle: 'Khái niệm gia tốc a = Δv/Δt, 3 công thức vàng vận tốc – độ dịch chuyển – độc lập thời gian và tính diện tích dưới đồ thị (v – t)',
    description:
      'Làm chủ hoàn toàn chuyển động thẳng nhanh dần đều ($a\\cdot v > 0$) và chậm dần đều ($a\\cdot v < 0$), giải nhanh mọi bài toán bằng bộ 3 công thức động học và kỹ năng tính quãng đường bằng diện tích hình thang trên đồ thị $(v - t)$.',
    theorySections: [
      {
        heading: '1. Gia tốc trong chuyển động thẳng biến đổi đều',
        content:
          '• Gia tốc đặc trưng cho độ nhanh chậm của sự thay đổi vận tốc: $\\vec{a} = \\frac{\\Delta\\vec{v}}{\\Delta t}$, giá trị đại số $a = \\frac{v - v_0}{t}$ (đơn vị $\\text{m/s}^2$).\n• **Nhanh dần đều**: $\\vec{a}$ cùng chiều $\\vec{v}$ ($a \\cdot v > 0$, tốc độ tăng đều).\n• **Chậm dần đều**: $\\vec{a}$ ngược chiều $\\vec{v}$ ($a \\cdot v < 0$, tốc độ giảm đều tới lúc dừng).'
      },
      {
        heading: '2. Bộ 3 công thức vàng Động học (a = hằng số)',
        content:
          '• Công thức vận tốc: $v = v_0 + at$.\n• Công thức độ dịch chuyển: $d = v_0 t + \\frac{1}{2}at^2$.\n• Hệ thức độc lập với thời gian: $v^2 - v_0^2 = 2ad$.'
      },
      {
        heading: '3. Đọc đồ thị Vận tốc – Thời gian (v – t)',
        content:
          '• Độ dốc đường thẳng $(v - t)$ chính là gia tốc: $a = \\frac{v_2 - v_1}{t_2 - t_1}$.\n• **Diện tích hình phẳng** giới hạn bởi đường đồ thị $(v - t)$ và trục thời gian $Ot$ trong khoảng $\\Delta t$ có giá trị đúng bằng **độ dịch chuyển $d$** (hoặc quãng đường $s$ nếu không đổi chiều)!'
      }
    ],
    keyFormulas: [
      'a = \\frac{v - v_0}{t}, \\quad v = v_0 + at',
      'd = v_0 t + \\frac{1}{2}at^2',
      'v^2 - v_0^2 = 2ad',
      'd = S_{\\text{dưới đồ thị }(v - t)}'
    ],
    simulationType: 'kinematics_graphs',
    sim3dType: 'kinematics_3d',
    defaultParams: { vizMode: 2, v0: 2, accel: 2.0, angleDeg: 0, f1: 20, f2: 20 },
    paramBounds: {
      vizMode: { min: 1, max: 2, step: 1, unit: '(1:d-t | 2:v-t)', label: 'Đồ thị (v-t)' },
      v0: { min: 0, max: 12, step: 0.5, unit: 'm/s', label: 'Vận tốc đầu v₀' },
      accel: { min: -3.0, max: 4.0, step: 0.2, unit: 'm/s²', label: 'Gia tốc a' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Vật lí 10 KNTT Bài 8',
        question:
          'Một đoàn tàu đang chạy với vận tốc $36\\text{ km/h}$ thì hãm phanh chuyển động thẳng chậm dần đều, sau $20\\text{ s}$ thì dừng hẳn. Gia tốc của tàu là:',
        options: ['A. -0,5 m/s²', 'B. 0,5 m/s²', 'C. -1,8 m/s²', 'D. -2,0 m/s²'],
        correctIndex: 0,
        explanation:
          'Đổi $v_0 = 36\\text{ km/h} = 10\\text{ m/s}$; khi dừng hẳn $v = 0$. Gia tốc $a = \\frac{v - v_0}{t} = \\frac{0 - 10}{20} = -0{,}5\\text{ m/s}^2$.'
      },
      {
        source: 'Loigiaihay · Đồ thị (v-t) 10',
        question:
          'Một ô tô tăng tốc đều từ $0\\text{ m/s}$ lên $12\\text{ m/s}$ trong thời gian $6\\text{ s}$. Dựa vào diện tích dưới đồ thị $(v - t)$, quãng đường xe đi được trong $6\\text{ s}$ đó là:',
        options: ['A. 36 m', 'B. 72 m', 'C. 18 m', 'D. 24 m'],
        correctIndex: 0,
        explanation:
          'Hình phẳng dưới đường thẳng $(v - t)$ từ $t=0$ đến $t=6\\text{ s}$ là tam giác vuông có đáy $6\\text{ s}$, cao $12\\text{ m/s}$. Quãng đường $s = \\frac{1}{2} \\cdot 6 \\cdot 12 = 36\\text{ m}$.'
      },
      {
        source: 'VietJack · Hệ thức độc lập 10',
        question:
          'Một xe máy đang chạy với tốc độ $10\\text{ m/s}$ thì tăng tốc với gia tốc $2\\text{ m/s}^2$ trên quãng đường $24\\text{ m}$. Vận tốc cuối quãng đường là:',
        options: ['A. 14 m/s', 'B. 12 m/s', 'C. 16 m/s', 'D. 196 m/s'],
        correctIndex: 0,
        explanation:
          'Áp dụng $v^2 - v_0^2 = 2as \\Rightarrow v^2 - 10^2 = 2 \\cdot 2 \\cdot 24 = 96 \\Rightarrow v^2 = 196 \\Rightarrow v = 14\\text{ m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Chuyển động biến đổi đều 10',
        question:
          'Một ô tô bắt đầu khởi hành nhanh dần đều từ trạng thái đứng yên, sau $10\\text{ s}$ đạt tốc độ $54\\text{ km/h}$. a) Tính gia tốc và quãng đường xe đi được trong $10\\text{ s}$ đầu; b) Tính quãng đường xe đi được trong giây thứ $10$.',
        hints: ['Đổi $54\\text{ km/h} = 15\\text{ m/s}$. Quãng đường trong giây thứ $10$ bằng $s_{10} - s_9$.'],
        solutionSteps: [
          'Bước 1: Đổi $54\\text{ km/h} = 15\\text{ m/s}$. Gia tốc: $a = \\frac{15 - 0}{10} = 1{,}5\\text{ m/s}^2$.',
          'Bước 2: Quãng đường đi trong $10\\text{ s}$ đầu: $s_{10} = \\frac{1}{2}at^2 = 0{,}5 \\cdot 1{,}5 \\cdot 10^2 = 75\\text{ m}$.',
          'Bước 3: Quãng đường đi trong $9\\text{ s}$ đầu: $s_9 = 0{,}5 \\cdot 1{,}5 \\cdot 9^2 = 60{,}75\\text{ m}$.',
          'Bước 4: Quãng đường đi trong giây thứ $10$: $\\Delta s = s_{10} - s_9 = 75 - 60{,}75 = 14{,}25\\text{ m}$.'
        ],
        finalAnswer: 'a) $a = 1{,}5\\text{ m/s}^2$, $s_{10} = 75\\text{ m}$; b) $\\Delta s = 14{,}25\\text{ m}$.'
      },
      {
        source: 'Loigiaihay · Bài toán Phanh xe an toàn',
        question:
          'Một xe buýt đang chạy ở tốc độ $20\\text{ m/s}$ phát hiện chướng ngại vật phía trước cách $45\\text{ m}$ và lập tức hãm phanh với gia tốc có độ lớn tối đa $4\\text{ m/s}^2$. Xe buýt có kịp dừng trước chướng ngại vật không?',
        hints: ['Tính quãng đường phanh $s_{\\text{dừng}}$ bằng công thức $0^2 - v_0^2 = 2ad$ với $a = -4\\text{ m/s}^2$.'],
        solutionSteps: [
          'Bước 1: Chọn chiều dương là chiều chuyển động, $a = -4\\text{ m/s}^2$, $v_0 = 20\\text{ m/s}$, $v = 0$.',
          'Bước 2: Quãng đường xe trượt cho tới khi dừng hẳn: $s = \\frac{0 - 20^2}{2 \\cdot (-4)} = \\frac{-400}{-8} = 50\\text{ m}$.',
          'Bước 3: So sánh: $50\\text{ m} > 45\\text{ m}$, do đó xe KHÔNG kịp dừng trước chướng ngại vật.'
        ],
        finalAnswer: 'Quãng đường phanh $s = 50\\text{ m} > 45\\text{ m}$ (không kịp dừng).'
      }
    ]
  },

  {
    id: 'phys-10-proj',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương trình Vật lí 10 GDPT 2018 · Rơi tự do & Ném vật',
    sourceTag: 'SGK Vật lí 10 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 8,
    title: 'Rơi tự do, Chuyển động Ném ngang & Ném xiên trong trọng trường',
    subtitle: 'Phân tích độc lập hai thành phần chuyển động Ox thẳng đều và Oy biến đổi đều, quỹ đạo parabol, tầm xa L và độ cao cực đại H',
    description:
      'Khảo sát chuyển động rơi tự do và chuyển động ném vật 2 chiều (ném ngang từ độ cao $h$, ném xiên góc $\\alpha$). Thử nghiệm trực tiếp trên Lab 2D & Bệ Pháo 3D để chứng minh góc $45^\\circ$ cho tầm bay xa lớn nhất.',
    theorySections: [
      {
        heading: '1. Sự rơi tự do ($v_0 = 0$, $a = g$)',
        content:
          '• Sự rơi tự do là sự rơi chỉ dưới tác dụng của trọng lực.\n• Thời gian rơi từ độ cao $h$: $t = \\sqrt{\\frac{2h}{g}}$.\n• Vận tốc lúc chạm đất: $v = g t = \\sqrt{2gh}$.'
      },
      {
        heading: '2. Chuyển động Ném ngang từ độ cao h',
        content:
          '• Theo phương ngang $Ox$: chuyển động thẳng đều $x = v_0 \\cdot t$.\n• Theo phương thẳng đứng $Oy$: rơi tự do $y = \\frac{1}{2}gt^2$.\n• Phương trình quỹ đạo parabol: $y = \\frac{g}{2v_0^2}x^2$. Thời gian rơi chỉ phụ thuộc $h$: $t = \\sqrt{\\frac{2h}{g}}$, tầm bay xa $L = v_0 \\sqrt{\\frac{2h}{g}}$.'
      },
      {
        heading: '3. Chuyển động Ném xiên góc α',
        content:
          '• Tách vận tốc đầu: $v_{0x} = v_0\\cos\\alpha$, $v_{0y} = v_0\\sin\\alpha$.\n• Độ cao cực đại: $H_{\\max} = \\frac{v_0^2\\sin^2\\alpha}{2g}$ (tại đỉnh cao nhất, $v_y = 0$ nhưng vận tốc toàn phần vẫn bằng $v_{0x} \\neq 0$!).\n• Tầm bay xa khi ném từ mặt đất: $L = \\frac{v_0^2\\sin(2\\alpha)}{g}$ (đạt cực đại tại $\\alpha = 45^\\circ$).'
      }
    ],
    keyFormulas: [
      't_{\\text{rơi}} = \\sqrt{\\frac{2h}{g}}, \\quad L_{\\text{ném ngang}} = v_0\\sqrt{\\frac{2h}{g}}',
      'H_{\\max} = \\frac{v_0^2\\sin^2\\alpha}{2g}',
      'L_{\\text{ném xiên}} = \\frac{v_0^2\\sin(2\\alpha)}{g}'
    ],
    simulationType: 'projectile_motion',
    sim3dType: 'projectile_3d',
    defaultParams: { v0: 25, angle: 45, g: 9.8, h0: 0 },
    paramBounds: {
      v0: { min: 10, max: 45, step: 1, unit: 'm/s', label: 'Vận tốc ban đầu v₀' },
      angle: { min: 0, max: 85, step: 1, unit: '°', label: 'Góc ném α (0°=ngang)' },
      g: { min: 1.6, max: 15, step: 0.2, unit: 'm/s²', label: 'Gia tốc g' },
      h0: { min: 0, max: 40, step: 2, unit: 'm', label: 'Độ cao ban đầu h₀' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Vật lí 10 KNTT Bài 12',
        question:
          'Một viên bi được ném ngang từ độ cao $h = 45\\text{ m}$ với vận tốc đầu $v_0 = 20\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). Thời gian rơi và tầm bay xa của bi là:',
        options: [
          'A. t = 3 s và L = 60 m',
          'B. t = 4,5 s và L = 90 m',
          'C. t = 3 s và L = 45 m',
          'D. t = 9 s và L = 180 m'
        ],
        correctIndex: 0,
        explanation:
          'Thời gian rơi: $t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2 \\cdot 45}{10}} = 3\\text{ s}$. Tầm xa: $L = v_0 t = 20 \\cdot 3 = 60\\text{ m}$.'
      },
      {
        source: 'Loigiaihay · Ném xiên 10',
        question:
          'Một vật được ném xiên từ mặt đất với tốc độ ban đầu $v_0$ không đổi. Để vật đạt tầm bay xa lớn nhất, góc ném $\\alpha$ so với phương ngang phải bằng:',
        options: ['A. 45°', 'B. 30°', 'C. 60°', 'D. 90°'],
        correctIndex: 0,
        explanation:
          'Tầm xa $L = \\frac{v_0^2 \\sin(2\\alpha)}{g}$ đạt cực đại khi $\\sin(2\\alpha) = 1 \\Leftrightarrow 2\\alpha = 90^\\circ \\Leftrightarrow \\alpha = 45^\\circ$.'
      },
      {
        source: 'VietJack · Rơi tự do 10',
        question:
          'Một vật rơi tự do từ độ cao $80\\text{ m}$ ($g = 10\\text{ m/s}^2$). Vận tốc của vật ngay trước khi chạm đất là:',
        options: ['A. 40 m/s', 'B. 20 m/s', 'C. 80 m/s', 'D. 16 m/s'],
        correctIndex: 0,
        explanation:
          'Áp dụng công thức $v = \\sqrt{2gh} = \\sqrt{2 \\cdot 10 \\cdot 80} = \\sqrt{1600} = 40\\text{ m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Ném xiên 10',
        question:
          'Từ mặt đất, một cầu thủ đá quả bóng đi với vận tốc $v_0 = 20\\text{ m/s}$ theo góc nghiêng $\\alpha = 30^\\circ$ so với mặt sân (lấy $g = 10\\text{ m/s}^2$). Tính: a) Độ cao cực đại quả bóng đạt được; b) Tầm bay xa của quả bóng.',
        hints: ['Sử dụng $\\sin 30^\\circ = 0{,}5$ và $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$.'],
        solutionSteps: [
          'a) Độ cao cực đại: $H_{\\max} = \\frac{v_0^2 \\sin^2\\alpha}{2g} = \\frac{20^2 \\cdot (0{,}5)^2}{2 \\cdot 10} = \\frac{400 \\cdot 0{,}25}{20} = 5\\text{ m}$.',
          'b) Tầm bay xa: $L = \\frac{v_0^2 \\sin(2\\alpha)}{g} = \\frac{400 \\cdot \\sin 60^\\circ}{10} = 40 \\cdot \\frac{\\sqrt{3}}{2} = 20\\sqrt{3} \\approx 34{,}64\\text{ m}$.'
        ],
        finalAnswer: 'a) $H_{\\max} = 5\\text{ m}$; b) $L = 20\\sqrt{3} \\approx 34{,}64\\text{ m}$.'
      },
      {
        source: 'Loigiaihay · Tự luận Ném ngang 10',
        question:
          'Một máy bay bay ngang ở độ cao $500\\text{ m}$ với tốc độ $100\\text{ m/s}$ thả một gói hàng cứu trợ (bỏ qua sức cản không khí, $g = 10\\text{ m/s}^2$). Tính thời gian gói hàng rơi tới đất và độ lớn vận tốc của gói hàng khi chạm đất.',
        hints: ['Vận tốc chạm đất là hợp của 2 thành phần vuông góc: $v = \\sqrt{v_x^2 + v_y^2}$ với $v_x = v_0, v_y = gt$.'],
        solutionSteps: [
          'Bước 1: Thời gian rơi: $t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2 \\cdot 500}{10}} = 10\\text{ s}$.',
          'Bước 2: Thành phần vận tốc chạm đất: $v_x = v_0 = 100\\text{ m/s}$; $v_y = gt = 10 \\cdot 10 = 100\\text{ m/s}$.',
          'Bước 3: Vận tốc toàn phần lúc chạm đất: $v = \\sqrt{100^2 + 100^2} = 100\\sqrt{2} \\approx 141{,}4\\text{ m/s}$.'
        ],
        finalAnswer: '$t = 10\\text{ s}$; $v = 100\\sqrt{2} \\approx 141{,}4\\text{ m/s}$.'
      }
    ]
  },

  {
    id: 'phys-10-newton-energy',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương trình Vật lí 10 GDPT 2018 · Động lực học & Năng lượng',
    sourceTag: 'SGK Vật lí 10 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 9,
    title: 'Ba định luật Newton, Ma sát, Động lượng & Bảo toàn cơ năng',
    subtitle: 'Định luật II Newton F = ma, lực ma sát trượt, xung lượng – định luật bảo toàn động lượng và bảo toàn cơ năng',
    description:
      'Trụ cột của Cơ học Lớp 10: liên hệ giữa Lực và Gia tốc ($\vec{F}_{hl} = m\\vec{a}$), phân tích lực ma sát trượt $F_{ms} = \\mu N$, động lượng $\\vec{p} = m\\vec{v}$ trong va chạm và bài toán năng lượng cơ học.',
    theorySections: [
      {
        heading: '1. Ba định luật Newton & Lực ma sát trượt',
        content:
          '• **Định luật I (Quán tính)**: Nếu hợp lực tác dụng lên vật bằng $\\vec{0}$, vật đứng yên tiếp tục đứng yên hoặc chuyển động thẳng đều.\n• **Định luật II**: $\\vec{a} = \\frac{\\vec{F}_{hl}}{m} \\Rightarrow \\vec{F}_{hl} = m\\vec{a}$.\n• **Định luật III**: Hai vật tương tác nhau bằng hai lực trực đối $\\vec{F}_{AB} = -\\vec{F}_{BA}$ (cùng giá, cùng độ lớn, ngược chiều, đặt vào 2 vật khác nhau).\n• **Lực ma sát trượt**: $F_{ms} = \\mu \\cdot N$ ($\\mu$ là hệ số ma sát trượt, $N$ là áp lực).'
      },
      {
        heading: '2. Động lượng & Định luật Bảo toàn động lượng',
        content:
          '• Động lượng của vật: $\\vec{p} = m\\vec{v}$ (đơn vị $\\text{kg}\\cdot\\text{m/s}$). Xung lượng của lực: $\\vec{F}\\Delta t = \\Delta\\vec{p}$.\n• Trong một **hệ cô lập**, tổng động lượng của hệ được bảo toàn: $m_1\\vec{v}_1 + m_2\\vec{v}_2 = m_1\\vec{v}_1\' + m_2\\vec{v}_2\'$.'
      },
      {
        heading: '3. Công, Động năng, Thế năng & Bảo toàn Cơ năng',
        content:
          '• Công tổng quát: $A = F\\cdot s \\cdot \\cos\\alpha$.\n• Định lý động năng: $A_{\\text{ngoại lực}} = \\frac{1}{2}mv_2^2 - \\frac{1}{2}mv_1^2$.\n• Bảo toàn cơ năng: Khi vật chỉ chịu tác dụng của trọng lực (hoặc lực đàn hồi): $W = \\frac{1}{2}mv^2 + mgh = \\text{hằng số}$.'
      }
    ],
    keyFormulas: [
      '\\vec{F}_{hl} = m\\vec{a}, \\quad F_{ms} = \\mu N',
      '\\vec{p} = m\\vec{v}, \\quad \\sum \\vec{p}_{\\text{trước}} = \\sum \\vec{p}_{\\text{sau}}',
      'A = F s \\cos\\alpha = \\Delta W_đ',
      '\\frac{1}{2}mv^2 + mgh = \\text{const}'
    ],
    simulationType: 'free_fall_energy',
    sim3dType: 'kinematics_3d',
    defaultParams: { height: 28, mass: 3, gravity: 9.8 },
    paramBounds: {
      height: { min: 5, max: 45, step: 1, unit: 'm', label: 'Độ cao ban đầu (h)' },
      mass: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng (m)' },
      gravity: { min: 1.6, max: 15, step: 0.2, unit: 'm/s²', label: 'Gia tốc g' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Vật lí 10 KNTT Bài 15',
        question:
          'Dưới tác dụng của hợp lực $F = 20\\text{ N}$, một vật có khối lượng $m = 4\\text{ kg}$ thu được gia tốc bằng:',
        options: ['A. 5 m/s²', 'B. 80 m/s²', 'C. 0,2 m/s²', 'D. 16 m/s²'],
        correctIndex: 0,
        explanation: 'Theo định luật II Newton: $a = \\frac{F}{m} = \\frac{20}{4} = 5\\text{ m/s}^2$.'
      },
      {
        source: 'Loigiaihay · Bảo toàn động lượng 10',
        question:
          'Viên đạn khối lượng $m_1 = 2\\text{ kg}$ bay ngang tốc độ $5\\text{ m/s}$ đến găm vào bao cát đứng yên khối lượng $m_2 = 8\\text{ kg}$ (va chạm mềm). Tốc độ của hệ ngay sau va chạm là:',
        options: ['A. 1 m/s', 'B. 1,25 m/s', 'C. 2 m/s', 'D. 0,5 m/s'],
        correctIndex: 0,
        explanation:
          'Bảo toàn động lượng va chạm mềm: $m_1 v_1 = (m_1 + m_2)V \\Rightarrow 2 \\cdot 5 = (2 + 8)V \\Rightarrow V = 1\\text{ m/s}$.'
      },
      {
        source: 'VietJack · Công cơ học 10',
        question:
          'Kéo một thùng hàng đi được $10\\text{ m}$ trên sàn ngang bằng lực $F = 40\\text{ N}$ chếch $60^\\circ$ so với phương ngang. Công của lực kéo là:',
        options: ['A. 200 J', 'B. 400 J', 'C. 346,4 J', 'D. 20 J'],
        correctIndex: 0,
        explanation:
          '$A = F \\cdot s \\cdot \\cos\\alpha = 40 \\cdot 10 \\cdot \\cos 60^\\circ = 400 \\cdot 0{,}5 = 200\\text{ J}$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Định luật II Newton & Ma sát 10',
        question:
          'Một vật khối lượng $m = 5\\text{ kg}$ nằm yên trên sàn ngang có hệ số ma sát trượt $\\mu = 0{,}2$. Tác dụng vào vật lực kéo ngang $F = 25\\text{ N}$ ($g = 10\\text{ m/s}^2$). Tính gia tốc và quãng đường vật đi được sau $4\\text{ s}$.',
        hints: ['Trên mặt ngang không có lực nghiêng, phản lực $N = P = mg$.'],
        solutionSteps: [
          'Bước 1: Lực ma sát trượt: $F_{ms} = \\mu N = \\mu mg = 0{,}2 \\cdot 5 \\cdot 10 = 10\\text{ N}$.',
          'Bước 2: Định luật II Newton theo phương ngang: $F - F_{ms} = ma \\Rightarrow a = \\frac{25 - 10}{5} = 3\\text{ m/s}^2$.',
          'Bước 3: Quãng đường sau $4\\text{ s}$: $s = \\frac{1}{2}at^2 = 0{,}5 \\cdot 3 \\cdot 4^2 = 24\\text{ m}$.'
        ],
        finalAnswer: '$a = 3\\text{ m/s}^2$, $s = 24\\text{ m}$.'
      },
      {
        source: 'Loigiaihay · Tự luận Bảo toàn Cơ năng 10',
        question:
          'Một viên bi khối lượng $200\\text{ g}$ trượt không vận tốc đầu từ đỉnh máng nghiêng cao $h = 3{,}2\\text{ m}$ xuống chân máng (bỏ qua ma sát, $g = 10\\text{ m/s}^2$). Tính vận tốc của viên bi ở chân máng và tại vị trí thế năng bằng 3 lần động năng.',
        hints: ['Khi $W_t = 3W_đ$, cơ năng $W = W_t + W_đ = 4W_đ$.'],
        solutionSteps: [
          'Bước 1: Bảo toàn cơ năng từ đỉnh xuống chân máng: $mgh = \\frac{1}{2}mv_{\\max}^2 \\Rightarrow v_{\\max} = \\sqrt{2gh} = \\sqrt{2 \\cdot 10 \\cdot 3{,}2} = 8\\text{ m/s}$.',
          'Bước 2: Tại điểm có $W_t = 3W_đ \\Rightarrow W = W_t + W_đ = 4W_đ = 4 \\cdot \\frac{1}{2}mv^2 = 2mv^2$.',
          'Bước 3: Mặt khác $W = mgh \\Rightarrow 2mv^2 = mgh \\Rightarrow v = \\sqrt{\\frac{gh}{2}} = \\sqrt{\\frac{10 \\cdot 3{,}2}{2}} = 4\\text{ m/s}$.'
        ],
        finalAnswer: '$v_{\\text{chân}} = 8\\text{ m/s}$; khi $W_t = 3W_đ$ thì $v = 4\\text{ m/s}$.'
      }
    ]
  },

  // ---------- LỚP 11 (GDPT 2018) ----------
  {
    id: 'phys-11-shm',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương trình Vật lí 11 GDPT 2018 · Dao động điều hòa',
    sourceTag: 'SGK Vật lí 11 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 10,
    title: 'Dao động điều hòa, Con lắc lò xo & Con lắc đơn (GDPT 2018)',
    subtitle: 'Phương trình li độ – vận tốc – gia tốc, hệ thức độc lập, chu kì con lắc lò xo/đơn và sự chuyển hóa năng lượng',
    description:
      'Chuyên đề trọng tâm học kì I Vật lí 11 GDPT 2018: thiết lập phương trình $x = A\\cos(\\omega t + \\varphi)$, nắm vững công thức chu kì con lắc lò xo $T = 2\\pi\\sqrt{m/k}$, con lắc đơn $T = 2\\pi\\sqrt{l/g}$ và định luật bảo toàn cơ năng dao động.',
    theorySections: [
      {
        heading: '1. Các phương trình của Dao động điều hòa',
        content:
          '• Li độ: $x = A\\cos(\\omega t + \\varphi)$.\n• Vận tốc: $v = x\' = -\\omega A\\sin(\\omega t + \\varphi)$ (đạt $v_{\\max} = \\omega A$ tại vị trí cân bằng $x = 0$).\n• Gia tốc: $a = v\' = -\\omega^2 x$ (luôn hướng về VTCB, đạt $a_{\\max} = \\omega^2 A$ tại hai biên $x = \\pm A$).\n• Hệ thức độc lập: $A^2 = x^2 + \\frac{v^2}{\\omega^2}$.'
      },
      {
        heading: '2. Con lắc lò xo & Con lắc đơn',
        content:
          '• Con lắc lò xo: $\\omega = \\sqrt{\\frac{k}{m}}$, chu kì $T = 2\\pi\\sqrt{\\frac{m}{k}}$.\n• Con lắc đơn dao động nhỏ: $\\omega = \\sqrt{\\frac{g}{l}}$, chu kì $T = 2\\pi\\sqrt{\\frac{l}{g}}$.'
      },
      {
        heading: '3. Năng lượng trong dao động điều hòa',
        content:
          '• Thế năng: $W_t = \\frac{1}{2}kx^2 = \\frac{1}{2}m\\omega^2 x^2$.\n• Động năng: $W_đ = \\frac{1}{2}mv^2$.\n• Cơ năng: $W = W_đ + W_t = \\frac{1}{2}kA^2 = \\frac{1}{2}m\\omega^2 A^2$ (không đổi theo thời gian, tỉ lệ với bình phương biên độ $A^2$).'
      }
    ],
    keyFormulas: [
      'x = A\\cos(\\omega t + \\varphi), \\quad A^2 = x^2 + \\frac{v^2}{\\omega^2}',
      'T_{\\text{lò xo}} = 2\\pi\\sqrt{\\frac{m}{k}}, \\quad T_{\\text{đơn}} = 2\\pi\\sqrt{\\frac{l}{g}}',
      'W = \\frac{1}{2}kA^2 = \\frac{1}{2}m\\omega^2 A^2'
    ],
    simulationType: 'spring_pendulum',
    sim3dType: 'pendulum_spring',
    defaultParams: { k: 40, m: 1.0, A: 12 },
    paramBounds: {
      k: { min: 10, max: 100, step: 2, unit: 'N/m', label: 'Độ cứng lò xo k' },
      m: { min: 0.2, max: 4.0, step: 0.1, unit: 'kg', label: 'Khối lượng m' },
      A: { min: 4, max: 18, step: 1, unit: 'cm', label: 'Biên độ A' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Vật lí 11 KNTT Bài 3',
        question:
          'Một chất điểm dao động điều hòa có phương trình $x = 6\\cos(10t - \\frac{\\pi}{3})\\text{ (cm)}$. Tốc độ cực đại của vật là:',
        options: ['A. 60 cm/s', 'B. 6 cm/s', 'C. 10 cm/s', 'D. 30 cm/s'],
        correctIndex: 0,
        explanation:
          'Từ phương trình ta có $A = 6\\text{ cm}$, $\\omega = 10\\text{ rad/s}$. Tốc độ cực đại $v_{\\max} = \\omega A = 10 \\cdot 6 = 60\\text{ cm/s}$.'
      },
      {
        source: 'Loigiaihay · Vật lí 11 CTST',
        question:
          'Con lắc lò xo có độ cứng $k = 100\\text{ N/m}$, vật nặng $m = 0{,}25\\text{ kg}$ dao động với biên độ $A = 4\\text{ cm}$. Cơ năng của con lắc là:',
        options: ['A. 0,08 J', 'B. 0,8 J', 'C. 0,16 J', 'D. 800 J'],
        correctIndex: 0,
        explanation:
          'Đổi $A = 0{,}04\\text{ m}$. Cơ năng $W = \\frac{1}{2}kA^2 = \\frac{1}{2} \\cdot 100 \\cdot (0{,}04)^2 = 0{,}08\\text{ J}$.'
      },
      {
        source: 'VietJack · Con lắc đơn 11',
        question:
          'Tại nơi có $g = \\pi^2 \\approx 9{,}87\\text{ m/s}^2$, con lắc đơn chiều dài $l = 1\\text{ m}$ dao động điều hòa với chu kì:',
        options: ['A. 2 s', 'B. 1 s', 'C. 4 s', 'D. 0,5 s'],
        correctIndex: 0,
        explanation: '$T = 2\\pi\\sqrt{\\frac{l}{g}} = 2\\pi\\sqrt{\\frac{1}{\\pi^2}} = 2\\text{ s}$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Dao động điều hòa 11',
        question:
          'Con lắc lò xo gồm vật $m = 400\\text{ g}$ và lò xo có độ cứng $k = 40\\text{ N/m}$. Kéo vật khỏi VTCB $5\\text{ cm}$ rồi truyền cho vật vận tốc $50\\text{ cm/s}$ hướng về VTCB. Tính tần số góc $\\omega$, biên độ dao động $A$ và gia tốc cực đại $a_{\\max}$.',
        hints: ['Dùng $\\omega = \\sqrt{k/m}$ (nhớ đổi $m = 0{,}4\\text{ kg}$) rồi dùng công thức độc lập $A = \\sqrt{x^2 + (v/\\omega)^2}$.'],
        solutionSteps: [
          'Bước 1: Tần số góc $\\omega = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{40}{0{,}4}} = 10\\text{ rad/s}$.',
          'Bước 2: Tại thời điểm truyền vận tốc: $x = 5\\text{ cm}$, $v = 50\\text{ cm/s}$. Biên độ: $A = \\sqrt{5^2 + (50/10)^2} = \\sqrt{25 + 25} = 5\\sqrt{2} \\approx 7{,}07\\text{ cm}$.',
          'Bước 3: Gia tốc cực đại: $a_{\\max} = \\omega^2 A = 10^2 \\cdot (0{,}05\\sqrt{2}) = 5\\sqrt{2} \\approx 7{,}07\\text{ m/s}^2$.'
        ],
        finalAnswer: '$\\omega = 10\\text{ rad/s}$; $A = 5\\sqrt{2}\\text{ cm}$; $a_{\\max} = 5\\sqrt{2}\\text{ m/s}^2$.'
      },
      {
        source: 'Loigiaihay · Năng lượng dao động 11',
        question:
          'Một vật dao động điều hòa với biên độ $A = 8\\text{ cm}$. Xác định li độ $x$ tại vị trí mà động năng bằng 3 lần thế năng ($W_đ = 3W_t$).',
        hints: ['Thay $W_đ = 3W_t$ vào $W = W_đ + W_t \\Rightarrow \\frac{1}{2}kA^2 = 4 \\cdot \\frac{1}{2}kx^2$.'],
        solutionSteps: [
          'Bước 1: Ta có $W = W_đ + W_t = 3W_t + W_t = 4W_t$.',
          'Bước 2: Suy ra $\\frac{1}{2}kA^2 = 4 \\cdot \\frac{1}{2}kx^2 \\Rightarrow x^2 = \\frac{A^2}{4} \\Rightarrow x = \\pm\\frac{A}{2}$.',
          'Bước 3: Thay $A = 8\\text{ cm}$ được $x = \\pm 4\\text{ cm}$.'
        ],
        finalAnswer: '$x = \\pm 4\\text{ cm}$.'
      }
    ]
  },

  {
    id: 'phys-11-wave',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương trình Vật lí 11 GDPT 2018 · Sóng cơ & Giao thoa',
    sourceTag: 'SGK Vật lí 11 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 11,
    title: 'Sóng cơ, Giao thoa hai nguồn kết hợp & Sóng dừng (GDPT 2018)',
    subtitle: 'Bước sóng λ = vT = v/f, điều kiện cực đại – cực tiểu giao thoa sóng nước và điều kiện sóng dừng trên dây',
    description:
      'Khám phá cơ chế truyền sóng và hiện tượng giao thoa của hai nguồn sóng kết hợp: xác định các vân cực đại/cực tiểu bằng hiệu đường đi $d_2 - d_1$, và điều kiện tạo bụng – nút sóng dừng trên sợi dây đàn hồi.',
    theorySections: [
      {
        heading: '1. Các đại lượng đặc trưng của Sóng cơ',
        content:
          '• **Bước sóng $\\lambda$**: Quãng đường sóng truyền đi trong 1 chu kì: $\\lambda = v \\cdot T = \\frac{v}{f}$ (cũng là khoảng cách giữa hai điểm gần nhau nhất trên phương truyền dao động cùng pha).\n• Độ lệch pha giữa hai điểm cách nhau $d$: $\\Delta\\varphi = \\frac{2\\pi d}{\\lambda}$.'
      },
      {
        heading: '2. Giao thoa hai nguồn sóng kết hợp cùng pha',
        content:
          '• Tại điểm $M$ cách hai nguồn $d_1, d_2$:\n  – **Cực đại giao thoa**: $d_2 - d_1 = k\\lambda$ ($k \\in \\mathbb{Z}$).\n  – **Cực tiểu giao thoa**: $d_2 - d_1 = (k + 0{,}5)\\lambda$ ($k \\in \\mathbb{Z}$).'
      },
      {
        heading: '3. Sóng dừng trên dây chiều dài l',
        content:
          '• Hai đầu cố định: $l = k\\frac{\\lambda}{2}$ (có $k$ bụng sóng, $k+1$ nút sóng).\n• Một đầu cố định, một đầu tự do: $l = (2k + 1)\\frac{\\lambda}{4}$. Khoảng cách giữa hai nút liên tiếp hoặc hai bụng liên tiếp luôn bằng $\\frac{\\lambda}{2}$.'
      }
    ],
    keyFormulas: [
      '\\lambda = v \\cdot T = \\frac{v}{f}',
      '\\text{Cực đại}: d_2 - d_1 = k\\lambda; \\quad \\text{Cực tiểu}: d_2 - d_1 = (k + 0{,}5)\\lambda',
      '\\text{Sóng dừng 2 đầu cố định}: l = k\\frac{\\lambda}{2}'
    ],
    simulationType: 'wave_interference',
    sim3dType: 'wave_ripple',
    defaultParams: { freq: 2.5, sep: 120, speed: 60 },
    paramBounds: {
      freq: { min: 1.0, max: 5.0, step: 0.2, unit: 'Hz', label: 'Tần số sóng f' },
      sep: { min: 60, max: 220, step: 10, unit: 'px', label: 'Khoảng cách S₁S₂' },
      speed: { min: 30, max: 120, step: 5, unit: 'cm/s', label: 'Tốc độ truyền sóng v' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Vật lí 11 KNTT Bài 8',
        question:
          'Một sóng cơ có tần số $f = 20\\text{ Hz}$ truyền đi với tốc độ $v = 4\\text{ m/s}$. Bước sóng của sóng là:',
        options: ['A. 20 cm', 'B. 80 m', 'C. 5 cm', 'D. 2 m'],
        correctIndex: 0,
        explanation:
          'Bước sóng $\\lambda = \\frac{v}{f} = \\frac{4}{20} = 0{,}2\\text{ m} = 20\\text{ cm}$.'
      },
      {
        source: 'Loigiaihay · Giao thoa sóng 11',
        question:
          'Trong thí nghiệm giao thoa với hai nguồn kết hợp cùng pha, bước sóng $\\lambda = 2\\text{ cm}$. Điểm $M$ cách hai nguồn $d_1 = 10\\text{ cm}$ và $d_2 = 16\\text{ cm}$ là:',
        options: [
          'A. Cực đại giao thoa bậc 3',
          'B. Cực tiểu giao thoa thứ 3',
          'C. Cực đại giao thoa bậc 6',
          'D. Đứng yên không dao động'
        ],
        correctIndex: 0,
        explanation:
          'Xét tỉ số $k = \\frac{d_2 - d_1}{\\lambda} = \\frac{16 - 10}{2} = 3$ (số nguyên!). Vậy $M$ là điểm dao động với biên độ cực đại bậc 3.'
      },
      {
        source: 'VietJack · Sóng dừng 11',
        question:
          'Trên một sợi dây dài $1{,}2\\text{ m}$ hai đầu cố định có sóng dừng với 3 bụng sóng. Bước sóng trên dây bằng:',
        options: ['A. 0,8 m', 'B. 0,4 m', 'C. 0,6 m', 'D. 1,2 m'],
        correctIndex: 0,
        explanation:
          'Với 3 bụng sóng ($k = 3$): $l = 3\\frac{\\lambda}{2} \\Rightarrow \\lambda = \\frac{2l}{3} = \\frac{2 \\cdot 1{,}2}{3} = 0{,}8\\text{ m}$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Giao thoa sóng 11',
        question:
          'Ở mặt nước có hai nguồn kết hợp $A, B$ cách nhau $AB = 13\\text{ cm}$ dao động cùng pha với tần số $f = 20\\text{ Hz}$, tốc độ truyền sóng $v = 40\\text{ cm/s}$. Tính số vân cực đại giao thoa cắt đoạn thẳng $AB$ (không tính hai nguồn).',
        hints: ['Tính $\\lambda = v/f$, sau đó giải bất đẳng thức $-AB < k\\lambda < AB$.'],
        solutionSteps: [
          'Bước 1: Tính bước sóng $\\lambda = \\frac{v}{f} = \\frac{40}{20} = 2\\text{ cm}$.',
          'Bước 2: Điểm cực đại trên đoạn $AB$ thỏa $-AB < k\\lambda < AB \\Rightarrow -13 < 2k < 13$.',
          'Bước 3: Suy ra $-6{,}5 < k < 6{,}5 \\Rightarrow k \\in \\{-6; -5; \\dots; 0; \\dots; 5; 6\\}$.',
          'Bước 4: Số giá trị nguyên $k$ là $6 - (-6) + 1 = 13$ vân cực đại.'
        ],
        finalAnswer: '$13$ vân cực đại giao thoa trên đoạn $AB$.'
      },
      {
        source: 'Loigiaihay · Sóng dừng 11',
        question:
          'Một sợi dây dài $1{,}5\\text{ m}$ hai đầu cố định đang có sóng dừng ổn định. Biết tốc độ truyền sóng trên dây là $60\\text{ m/s}$ và tần số rung $f = 100\\text{ Hz}$. Hỏi trên dây có bao nhiêu bụng sóng và bao nhiêu nút sóng?',
        hints: ['Tính $\\lambda = v/f$, rồi thay vào $l = k\\frac{\\lambda}{2}$ tìm $k$.'],
        solutionSteps: [
          'Bước 1: Bước sóng $\\lambda = \\frac{v}{f} = \\frac{60}{100} = 0{,}6\\text{ m}$.',
          'Bước 2: Áp dụng điều kiện hai đầu cố định $l = k\\frac{\\lambda}{2} \\Rightarrow 1{,}5 = k \\cdot 0{,}3 \\Rightarrow k = 5$.',
          'Bước 3: Số bụng sóng $= k = 5$ bụng; Số nút sóng $= k + 1 = 6$ nút (kể cả 2 đầu dây).'
        ],
        finalAnswer: '$5$ bụng sóng và $6$ nút sóng.'
      }
    ]
  },

  {
    id: 'phys-11-efield',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương trình Vật lí 11 GDPT 2018 · Điện trường & Tụ điện',
    sourceTag: 'SGK Vật lí 11 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 12,
    title: 'Điện trường, Định luật Coulomb & Tụ điện (GDPT 2018)',
    subtitle: 'Lực tương tác tĩnh điện Coulomb, cường độ điện trường E, công của lực điện A = qEd, hiệu điện thế và năng lượng tụ điện',
    description:
      'Làm chủ quy luật tương tác giữa các điện tích điểm trong chân không/điện môi, cách vẽ đường sức điện trường đều và không đều, công của lực điện và cách tính điện dung – năng lượng của tụ điện.',
    theorySections: [
      {
        heading: '1. Định luật Coulomb & Cường độ điện trường',
        content:
          '• Lực tương tác giữa hai điện tích điểm $q_1, q_2$ cách nhau $r$ trong môi trường hằng số điện môi $\\varepsilon$: $F = \\frac{k|q_1 q_2|}{\\varepsilon r^2}$ với $k = 9 \\cdot 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2$.\n• Cường độ điện trường do $Q$ gây ra tại điểm cách $r$: $E = \\frac{k|Q|}{\\varepsilon r^2}$ (đơn vị $\\text{V/m}$). Lực điện tác dụng lên $q$: $\\vec{F} = q\\vec{E}$.'
      },
      {
        heading: '2. Công của lực điện & Hiệu điện thế',
        content:
          '• Công của lực điện trường đều không phụ thuộc hình dạng đường đi: $A_{MN} = q E d$ (trong đó $d = MN\\cos\\alpha$ là hình chiếu độ dời lên đường sức).\n• Hiệu điện thế: $U_{MN} = \\frac{A_{MN}}{q} = E \\cdot d$.'
      },
      {
        heading: '3. Tụ điện & Năng lượng điện trường trong tụ',
        content:
          '• Điện dung $C$ của tụ điện đặc trưng cho khả năng tích điện: $Q = C \\cdot U$ (đơn vị Fara: $1\\,\\mu\\text{F} = 10^{-6}\\text{ F}$, $1\\text{ nF} = 10^{-9}\\text{ F}$, $1\\text{ pF} = 10^{-12}\\text{ F}$).\n• Năng lượng của tụ điện đã tích điện: $W = \\frac{1}{2}CU^2 = \\frac{1}{2}QU = \\frac{Q^2}{2C}$.'
      }
    ],
    keyFormulas: [
      'F = \\frac{k|q_1 q_2|}{\\varepsilon r^2}, \\quad E = \\frac{k|Q|}{\\varepsilon r^2}',
      'A_{MN} = q E d = q U_{MN}',
      'Q = C U, \\quad W = \\frac{1}{2}CU^2 = \\frac{Q^2}{2C}'
    ],
    simulationType: 'electric_field',
    sim3dType: 'lorentz_helix',
    defaultParams: { q1: 4, q2: -4, dist: 180 },
    paramBounds: {
      q1: { min: -8, max: 8, step: 1, unit: 'μC', label: 'Điện tích q₁' },
      q2: { min: -8, max: 8, step: 1, unit: 'μC', label: 'Điện tích q₂' },
      dist: { min: 90, max: 280, step: 10, unit: 'mm', label: 'Khoảng cách r' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Vật lí 11 KNTT Bài 16',
        question:
          'Hai điện tích điểm $q_1 = +2\\,\\mu\\text{C}$ và $q_2 = -4\\,\\mu\\text{C}$ đặt cách nhau $30\\text{ cm}$ trong chân không. Độ lớn lực hút giữa chúng là:',
        options: ['A. 0,8 N', 'B. 8 N', 'C. 0,08 N', 'D. 2,4 N'],
        correctIndex: 0,
        explanation:
          '$F = \\frac{9\\cdot 10^9 \\cdot |2\\cdot 10^{-6} \\cdot (-4\\cdot 10^{-6})|}{0{,}3^2} = \\frac{72 \\cdot 10^{-3}}{0{,}09} = 0{,}8\\text{ N}$.'
      },
      {
        source: 'Loigiaihay · Tụ điện 11',
        question:
          'Một tụ điện có điện dung $C = 20\\,\\mu\\text{F}$ được tích điện dưới hiệu điện thế $U = 100\\text{ V}$. Năng lượng điện trường trong tụ là:',
        options: ['A. 0,1 J', 'B. 0,2 J', 'C. 1 J', 'D. 2 mJ'],
        correctIndex: 0,
        explanation:
          '$W = \\frac{1}{2}CU^2 = \\frac{1}{2} \\cdot 20\\cdot 10^{-6} \\cdot 100^2 = 0{,}1\\text{ J}$.'
      },
      {
        source: 'VietJack · Điện trường đều 11',
        question:
          'Một electron ($q = -1{,}6\\cdot 10^{-19}\\text{ C}$) di chuyển ngược chiều đường sức một đoạn $5\\text{ cm}$ trong điện trường đều $E = 2000\\text{ V/m}$. Công của lực điện tác dụng lên electron là:',
        options: ['A. +1,6·10⁻¹⁷ J', 'B. -1,6·10⁻¹⁷ J', 'C. +3,2·10⁻¹⁶ J', 'D. 0 J'],
        correctIndex: 0,
        explanation:
          'Đi ngược chiều đường sức nên $d = -0{,}05\\text{ m}$. Công $A = qEd = (-1{,}6\\cdot 10^{-19}) \\cdot 2000 \\cdot (-0{,}05) = +1{,}6\\cdot 10^{-17}\\text{ J}$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Nguyên lý chồng chất điện trường 11',
        question:
          'Đặt $q_1 = +4\\cdot 10^{-8}\\text{ C}$ tại A và $q_2 = -4\\cdot 10^{-8}\\text{ C}$ tại B trong không khí, biết $AB = 20\\text{ cm}$. Tính cường độ điện trường tổng hợp tại trung điểm M của đoạn AB.',
        hints: ['Tại trung điểm M, vectơ $\\vec{E}_1$ hướng ra xa A (về phía B), còn $\\vec{E}_2$ hướng về B (cùng chiều $\\vec{E}_1$).'],
        solutionSteps: [
          'Bước 1: Khoảng cách từ M đến A và B bằng $r = 10\\text{ cm} = 0{,}1\\text{ m}$.',
          'Bước 2: Độ lớn $E_1 = E_2 = \\frac{9\\cdot 10^9 \\cdot 4\\cdot 10^{-8}}{0{,}1^2} = 36\\,000\\text{ V/m}$.',
          'Bước 3: Vì $q_1 > 0$ và $q_2 < 0$ nên $\\vec{E}_1$ và $\\vec{E}_2$ cùng hướng từ A sang B. Vậy $E_M = E_1 + E_2 = 72\\,000\\text{ V/m}$.'
        ],
        finalAnswer: '$E_M = 7{,}2 \\cdot 10^4\\text{ V/m}$, hướng từ A đến B.'
      },
      {
        source: 'Loigiaihay · Tự luận Chuyển động hạt điện tích 11',
        question:
          'Giữa hai bản tụ phẳng nằm ngang cách nhau $d = 4\\text{ cm}$ đặt hiệu điện thế $U = 200\\text{ V}$. Tính cường độ điện trường giữa hai bản và gia tốc thu được của một proton ($m = 1{,}67\\cdot 10^{-27}\\text{ kg}, q = 1{,}6\\cdot 10^{-19}\\text{ C}$).',
        hints: ['Dùng $E = U/d$ và gia tốc $a = \\frac{|q|E}{m}$.'],
        solutionSteps: [
          'Bước 1: Cường độ điện trường giữa hai bản tụ: $E = \\frac{U}{d} = \\frac{200}{0{,}04} = 5000\\text{ V/m}$.',
          'Bước 2: Lực điện $F = |q|E = 1{,}6\\cdot 10^{-19} \\cdot 5000 = 8\\cdot 10^{-16}\\text{ N}$.',
          'Bước 3: Gia tốc proton: $a = \\frac{F}{m} = \\frac{8\\cdot 10^{-16}}{1{,}67\\cdot 10^{-27}} \\approx 4{,}79 \\cdot 10^{11}\\text{ m/s}^2$.'
        ],
        finalAnswer: '$E = 5000\\text{ V/m}$; $a \\approx 4{,}79 \\cdot 10^{11}\\text{ m/s}^2$.'
      }
    ]
  },

  {
    id: 'phys-11-dc',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'Chương trình Vật lí 11 GDPT 2018 · Dòng điện không đổi',
    sourceTag: 'SGK Vật lí 11 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 13,
    title: 'Dòng điện không đổi, Định luật Ôm toàn mạch & Công suất nguồn',
    subtitle: 'Suất điện động của nguồn điện, định luật Ôm cho toàn mạch I = E / (R_N + r), hiệu điện thế mạch ngoài và hiệu suất nguồn',
    description:
      'Mở rộng từ mạch điện lớp 9 lên bài toán mạch kín hoàn chỉnh có nguồn điện suất điện động $\\mathscr{E}$ và điện trở trong $r$: tính dòng điện toàn mạch, độ giảm thế mạch ngoài, công – công suất nguồn và hiệu suất truyền tải điện năng.',
    theorySections: [
      {
        heading: '1. Suất điện động & Định luật Ôm cho toàn mạch',
        content:
          '• Nguồn điện có suất điện động $\\mathscr{E} = \\frac{A_{\\text{lạ}}}{q}$ (đơn vị Vôn) và điện trở trong $r$.\n• Khi nối với mạch ngoài có điện trở tương đương $R_N$, cường độ dòng điện trong mạch kín là:\n  $$I = \\frac{\\mathscr{E}}{R_N + r}$$\n• Hiệu điện thế hai cực nguồn điện: $U_N = I \\cdot R_N = \\mathscr{E} - I \\cdot r$.'
      },
      {
        heading: '2. Công – Công suất của nguồn & Hiệu suất',
        content:
          '• Công và công suất của nguồn điện: $A_{\\text{ng}} = \\mathscr{E} I t$; $P_{\\text{ng}} = \\mathscr{E} I$.\n• Công suất tỏa nhiệt mạch ngoài: $P_N = U_N I = I^2 R_N$.\n• Hiệu suất của nguồn điện: $H = \\frac{U_N}{\\mathscr{E}} = \\frac{R_N}{R_N + r}$.\n• Công suất mạch ngoài đạt cực đại $P_{N\\max} = \\frac{\\mathscr{E}^2}{4r}$ khi $R_N = r$.'
      }
    ],
    keyFormulas: [
      'I = \\frac{\\mathscr{E}}{R_N + r}, \\quad U_N = \\mathscr{E} - Ir',
      'P_{\\text{ng}} = \\mathscr{E}I, \\quad H = \\frac{R_N}{R_N + r}',
      'P_{N\\max} = \\frac{\\mathscr{E}^2}{4r} \\text{ khi } R_N = r'
    ],
    simulationType: 'ohm_circuit',
    sim3dType: 'lorentz_helix',
    defaultParams: { voltage: 18, r1: 8, r2: 12, circuitType: 0 },
    paramBounds: {
      voltage: { min: 3, max: 30, step: 1, unit: 'V', label: 'Suất điện động E' },
      r1: { min: 2, max: 40, step: 1, unit: 'Ω', label: 'Điện trở mạch ngoài R₁' },
      r2: { min: 1, max: 30, step: 1, unit: 'Ω', label: 'Điện trở R₂ / r trong' },
      circuitType: { min: 0, max: 1, step: 1, unit: '(0:NT / 1:SS)', label: 'Sơ đồ mạch' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Vật lí 11 KNTT Bài 24',
        question:
          'Một nguồn điện có suất điện động $\\mathscr{E} = 12\\text{ V}$, điện trở trong $r = 1\\,\\Omega$ nối với điện trở ngoài $R = 5\\,\\Omega$. Cường độ dòng điện trong mạch và hiệu điện thế hai cực nguồn là:',
        options: [
          'A. I = 2 A và U_N = 10 V',
          'B. I = 2,4 A và U_N = 12 V',
          'C. I = 2 A và U_N = 12 V',
          'D. I = 3 A và U_N = 9 V'
        ],
        correctIndex: 0,
        explanation:
          'Cường độ dòng điện toàn mạch: $I = \\frac{\\mathscr{E}}{R + r} = \\frac{12}{5 + 1} = 2\\text{ A}$. Hiệu điện thế mạch ngoài: $U_N = \\mathscr{E} - Ir = 12 - 2\\cdot 1 = 10\\text{ V}$.'
      },
      {
        source: 'Loigiaihay · Công suất nguồn 11',
        question:
          'Cho nguồn $(\\mathscr{E} = 6\\text{ V}, r = 1{,}5\\,\\Omega)$ nối với biến trở $R$. Công suất tiêu thụ trên biến trở đạt giá trị lớn nhất bằng bao nhiêu khi điều chỉnh $R$?',
        options: ['A. 6 W', 'B. 12 W', 'C. 24 W', 'D. 3 W'],
        correctIndex: 0,
        explanation:
          'Công suất mạch ngoài đạt cực đại khi $R = r = 1{,}5\\,\\Omega$. Khi đó $P_{\\max} = \\frac{\\mathscr{E}^2}{4r} = \\frac{6^2}{4 \\cdot 1{,}5} = 6\\text{ W}$.'
      },
      {
        source: 'VietJack · Hiệu suất nguồn 11',
        question:
          'Hiệu suất của một nguồn điện có điện trở trong $r = 2\\,\\Omega$ cung cấp cho mạch ngoài $R_N = 18\\,\\Omega$ bằng:',
        options: ['A. 90%', 'B. 10%', 'C. 80%', 'D. 95%'],
        correctIndex: 0,
        explanation:
          '$H = \\frac{R_N}{R_N + r} \\cdot 100\\% = \\frac{18}{18 + 2} \\cdot 100\\% = 90\\%$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Định luật Ôm toàn mạch 11',
        question:
          'Cho mạch điện gồm nguồn $(\\mathscr{E} = 9\\text{ V}, r = 1\\,\\Omega)$ và mạch ngoài gồm hai điện trở $R_1 = 6\\,\\Omega$ và $R_2 = 12\\,\\Omega$ mắc song song. Tính: a) Cường độ dòng điện mạch chính và qua từng nhánh; b) Công suất tỏa nhiệt của nguồn và hiệu suất của nguồn.',
        hints: ['Tìm $R_N = \\frac{R_1 R_2}{R_1 + R_2}$ trước, rồi tính $I = \\frac{\\mathscr{E}}{R_N + r}$.'],
        solutionSteps: [
          'Bước 1: Điện trở tương đương mạch ngoài: $R_N = \\frac{6 \\cdot 12}{6 + 12} = 4\\,\\Omega$.',
          'Bước 2: Cường độ dòng điện mạch chính: $I = \\frac{\\mathscr{E}}{R_N + r} = \\frac{9}{4 + 1} = 1{,}8\\text{ A}$.',
          'Bước 3: Hiệu điện thế mạch ngoài $U_N = I\\cdot R_N = 1{,}8 \\cdot 4 = 7{,}2\\text{ V}$. Dòng điện từng nhánh: $I_1 = 7{,}2/6 = 1{,}2\\text{ A}$; $I_2 = 7{,}2/12 = 0{,}6\\text{ A}$.',
          'Bước 4: Công suất của nguồn $P_{\\text{ng}} = \\mathscr{E} I = 9 \\cdot 1{,}8 = 16{,}2\\text{ W}$; Hiệu suất $H = \\frac{4}{4+1} = 80\\%$.'
        ],
        finalAnswer: 'a) $I = 1{,}8\\text{ A}$, $I_1 = 1{,}2\\text{ A}$, $I_2 = 0{,}6\\text{ A}$; b) $P_{\\text{ng}} = 16{,}2\\text{ W}$, $H = 80\\%$.'
      },
      {
        source: 'Loigiaihay · Biện luận công suất cực đại 11',
        question:
          'Một nguồn điện $(\\mathscr{E} = 12\\text{ V}, r = 2\\,\\Omega)$ mắc với một đèn $Đ$ ghi $6\\text{ V} - 6\\text{ W}$ và một biến trở $R_b$ nối tiếp. Hỏi biến trở $R_b$ phải có giá trị bao nhiêu để đèn sáng bình thường?',
        hints: ['Đèn sáng bình thường nghĩa là $U_Đ = 6\\text{ V}$ và $I = I_{Đ\\text{đm}} = P_Đ / U_Đ$.'],
        solutionSteps: [
          'Bước 1: Dòng điện định mức của đèn: $I_{Đ} = \\frac{6}{6} = 1\\text{ A}$; điện trở đèn: $R_Đ = \\frac{6^2}{6} = 6\\,\\Omega$.',
          'Bước 2: Để đèn sáng bình thường, dòng mạch chính là $I = 1\\text{ A}$.',
          'Bước 3: Áp dụng $I = \\frac{\\mathscr{E}}{R_Đ + R_b + r} \\Rightarrow 1 = \\frac{12}{6 + R_b + 2} \\Rightarrow R_b = 4\\,\\Omega$.'
        ],
        finalAnswer: '$R_b = 4\\,\\Omega$.'
      }
    ]
  },

  // ---------- LỚP 12 (GDPT 2018 MỚI) ----------
  {
    id: 'phys-12-thermal',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương trình Vật lí 12 GDPT 2018 · Vật lí Nhiệt & Khí lí tưởng',
    sourceTag: 'SGK Vật lí 12 GDPT 2018 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 14,
    title: 'Vật lí Nhiệt & Khí lí tưởng: Nội năng, Nguyên lí I & Phương trình trạng thái',
    subtitle: 'Nội năng ΔU = A + Q, nhiệt nóng chảy/hóa hơi, các đẳng quá trình Boyle – Charles và phương trình Clapeyron pV = nRT',
    description:
      'Chuyên đề trọng tâm mới của SGK Vật lí 12 GDPT 2018: biến thiên nội năng $\\Delta U = A + Q$ (quy ước dấu chuẩn), nhiệt chuyển thể, và khảo sát chuyển động nhiệt phân tử khí lí tưởng qua 3 định luật Boyle, Charles, Clapeyron.',
    theorySections: [
      {
        heading: '1. Nội năng & Nguyên lí I Nhiệt động lực học',
        content:
          '• Nội năng $U$ là tổng động năng và thế năng tương tác của các phân tử cấu tạo nên vật.\n• Nguyên lí I NĐLH: $\\Delta U = A + Q$.\n  – Quy ước dấu: $Q > 0$ hệ nhận nhiệt, $Q < 0$ hệ truyền nhiệt; $A > 0$ hệ nhận công (bị nén), $A < 0$ hệ thực hiện công (giãn nở).'
      },
      {
        heading: '2. Nhiệt dung riêng, Nhiệt nóng chảy & Nhiệt hóa hơi',
        content:
          '• Làm nóng/lạnh: $Q = m c \\Delta T$.\n• Nhiệt nóng chảy riêng $\\lambda$: $Q = \\lambda \\cdot m$ (tại nhiệt độ nóng chảy).\n• Nhiệt hóa hơi riêng $L$: $Q = L \\cdot m$ (tại nhiệt độ sôi).'
      },
      {
        heading: '3. Khí lí tưởng & Phương trình trạng thái',
        content:
          '• Quá trình đẳng nhiệt (Boyle, $T = \\text{const}$): $p_1 V_1 = p_2 V_2$.\n• Quá trình đẳng áp (Charles, $p = \\text{const}$): $\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$ (nhớ đổi $T(\\text{K}) = t(^\\circ\\text{C}) + 273$!).\n• Phương trình trạng thái khí lí tưởng & Clapeyron: $\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}$ và $pV = nRT$ ($R = 8{,}31\\text{ J/(mol}\\cdot\\text{K)}$).\n• Động năng tịnh tiến trung bình của phân tử: $\\overline{E}_đ = \\frac{3}{2} k_B T$.'
      }
    ],
    keyFormulas: [
      '\\Delta U = A + Q',
      'Q_{\\text{nc}} = \\lambda m, \\quad Q_{\\text{hh}} = L m',
      '\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}, \\quad pV = nRT',
      'T(\\text{K}) = t(^\\circ\\text{C}) + 273'
    ],
    simulationType: 'thermal_gas',
    sim3dType: 'thermal_gas_3d',
    defaultParams: { tempK: 320, volume: 10, moles: 1 },
    paramBounds: {
      tempK: { min: 150, max: 650, step: 10, unit: 'K', label: 'Nhiệt độ tuyệt đối T' },
      volume: { min: 4, max: 18, step: 0.5, unit: 'lít', label: 'Thể tích bình V' },
      moles: { min: 0.5, max: 3.0, step: 0.25, unit: 'mol', label: 'Số mol khí n' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Vật lí 12 KNTT Bài 2',
        question:
          'Người ta truyền cho khí trong xilanh nhiệt lượng $Q = 100\\text{ J}$. Chất khí nở ra thực hiện công $70\\text{ J}$ đẩy pít-tông đi lên. Độ biến thiên nội năng $\\Delta U$ của khí là:',
        options: ['A. +30 J', 'B. +170 J', 'C. -30 J', 'D. -170 J'],
        correctIndex: 0,
        explanation:
          'Hệ nhận nhiệt nên $Q = +100\\text{ J}$. Khí nở ra thực hiện công nên $A = -70\\text{ J}$. Theo nguyên lí I: $\\Delta U = A + Q = -70 + 100 = +30\\text{ J}$ (nội năng tăng $30\\text{ J}$).'
      },
      {
        source: 'Loigiaihay · Khí lí tưởng 12',
        question:
          'Nén đẳng nhiệt một lượng khí từ thể tích $9\\text{ lít}$ xuống $6\\text{ lít}$ thì thấy áp suất tăng thêm $50\\text{ kPa}$. Áp suất ban đầu của khí là:',
        options: ['A. 100 kPa', 'B. 150 kPa', 'C. 75 kPa', 'D. 200 kPa'],
        correctIndex: 0,
        explanation:
          'Áp dụng định luật Boyle: $p_1 V_1 = p_2 V_2 \\Rightarrow 9p_1 = 6(p_1 + 50) \\Rightarrow 3p_1 = 300 \\Rightarrow p_1 = 100\\text{ kPa}$.'
      },
      {
        source: 'VietJack · Vật lí 12 CTST',
        question:
          'Nhiệt độ của một lượng khí lí tưởng tăng từ $27^\\circ\\text{C}$ lên $327^\\circ\\text{C}$ trong quá trình đẳng áp. Thể tích của lượng khí sẽ:',
        options: [
          'A. Tăng gấp đôi',
          'B. Tăng gấp 12 lần',
          'C. Giảm một nửa',
          'D. Không đổi'
        ],
        correctIndex: 0,
        explanation:
          'Đổi sang nhiệt độ Kelvin: $T_1 = 27 + 273 = 300\\text{ K}$; $T_2 = 327 + 273 = 600\\text{ K}$. Theo định luật Charles: $V \\propto T$, nên $V_2 = 2V_1$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Vật lí Nhiệt 12',
        question:
          'Tính nhiệt lượng cần cung cấp để làm nóng chảy hoàn toàn $2\\text{ kg}$ nước đá ở $-10^\\circ\\text{C}$ thành nước ở $0^\\circ\\text{C}$. Biết nhiệt dung riêng của nước đá $c_{\\text{đá}} = 2100\\text{ J/(kg}\\cdot\\text{K)}$ và nhiệt nóng chảy riêng của nước đá $\\lambda = 3{,}34 \\cdot 10^5\\text{ J/kg}$.',
        hints: ['Gồm 2 giai đoạn: (1) Đá tăng nhiệt độ từ $-10^\\circ\\text{C}$ lên $0^\\circ\\text{C}$; (2) Đá nóng chảy hoàn toàn ở $0^\\circ\\text{C}$.'],
        solutionSteps: [
          'Bước 1: Nhiệt lượng làm đá tăng từ $-10^\\circ\\text{C}$ lên $0^\\circ\\text{C}$: $Q_1 = m c_{\\text{đá}} \\Delta t = 2 \\cdot 2100 \\cdot 10 = 42\\,000\\text{ J}$.',
          'Bước 2: Nhiệt lượng làm tan hết $2\\text{ kg}$ nước đá ở $0^\\circ\\text{C}$: $Q_2 = \\lambda m = 3{,}34\\cdot 10^5 \\cdot 2 = 668\\,000\\text{ J}$.',
          'Bước 3: Tổng nhiệt lượng cần cung cấp: $Q = Q_1 + Q_2 = 42\\,000 + 668\\,000 = 710\\,000\\text{ J} = 710\\text{ kJ}$.'
        ],
        finalAnswer: '$Q = 710\\text{ kJ}$.'
      },
      {
        source: 'Loigiaihay · Phương trình Clapeyron 12',
        question:
          'Một bình kín dung tích $10\\text{ lít}$ chứa $1\\text{ mol}$ khí lí tưởng ở nhiệt độ $27^\\circ\\text{C}$. Lấy $R = 8{,}31\\text{ J/(mol}\\cdot\\text{K)}$. Tính áp suất khí trong bình theo đơn vị Pa.',
        hints: ['Đổi $V = 10\\text{ lít} = 10\\cdot 10^{-3}\\text{ m}^3 = 0{,}01\\text{ m}^3$ và $T = 300\\text{ K}$.'],
        solutionSteps: [
          'Bước 1: Quy đổi hệ SI: $V = 0{,}01\\text{ m}^3$, $T = 27 + 273 = 300\\text{ K}$, $n = 1\\text{ mol}$.',
          'Bước 2: Áp dụng $pV = nRT \\Rightarrow p = \\frac{nRT}{V} = \\frac{1 \\cdot 8{,}31 \\cdot 300}{0{,}01} = 249\\,300\\text{ Pa} \\approx 2{,}49 \\cdot 10^5\\text{ Pa}$.'
        ],
        finalAnswer: '$p = 2{,}493 \\cdot 10^5\\text{ Pa}$.'
      }
    ]
  },

  {
    id: 'phys-12-mag',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương trình Vật lí 12 GDPT 2018 · Từ trường & Cảm ứng điện từ',
    sourceTag: 'SGK Vật lí 12 GDPT 2018 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 15,
    title: 'Từ trường, Lực Từ – Lực Lorentz & Cảm ứng điện từ (GDPT 2018)',
    subtitle: 'Lực từ F = BIl sinα, lực Lorentz f = |q|vB sinα, từ thông Φ = BS cosα, định luật Faraday và dòng điện xoay chiều',
    description:
      'Nội dung cốt lõi Từ trường & Cảm ứng điện từ lớp 12 GDPT 2018: quy tắc bàn tay trái – nắm tay phải, tính suất điện động cảm ứng $e_c = -\\frac{\\Delta\\Phi}{\\Delta t}$, máy biến áp và sóng điện từ.',
    theorySections: [
      {
        heading: '1. Lực Từ tác dụng lên đoạn dây dẫn & Lực Lorentz',
        content:
          '• Lực từ tác dụng lên đoạn dây dài $l$ mang dòng $I$ đặt trong từ trường $\\vec{B}$: $F = B I l \\sin\\alpha$ (xác định chiều theo quy tắc bàn tay trái).\n• Lực Lorentz tác dụng lên hạt điện tích $q$ bay với vận tốc $v$: $f = |q| v B \\sin\\alpha$. Nếu $\\vec{v} \\perp \\vec{B}$, hạt chuyển động tròn đều với bán kính $R = \\frac{mv}{|q|B}$.'
      },
      {
        heading: '2. Từ thông & Định luật Faraday về Cảm ứng điện từ',
        content:
          '• Từ thông qua khung dây $N$ vòng diện tích $S$: $\\Phi = N B S \\cos\\alpha$ (đơn vị Vêbe, Wb; $\\alpha$ là góc giữa $\\vec{B}$ và vectơ pháp tuyến $\\vec{n}$).\n• Độ lớn suất điện động cảm ứng: $|e_c| = \\left|\\frac{\\Delta\\Phi}{\\Delta t}\\right|$. Dòng điện cảm ứng có chiều chống lại nguyên nhân sinh ra nó (Định luật Lenz).'
      },
      {
        heading: '3. Dòng điện xoay chiều & Máy biến áp',
        content:
          '• Khi khung dây quay đều với tốc độ góc $\\omega$, suất điện động xoay chiều cực đại $E_0 = N B S \\omega$; giá trị hiệu dụng $E = \\frac{E_0}{\\sqrt{2}}$.\n• Công thức máy biến áp lí tưởng: $\\frac{U_1}{U_2} = \\frac{N_1}{N_2} = \\frac{I_2}{I_1}$.'
      }
    ],
    keyFormulas: [
      'F = B I l \\sin\\alpha, \\quad f = |q|vB\\sin\\alpha',
      '\\Phi = N B S \\cos\\alpha, \\quad |e_c| = \\left|\\frac{\\Delta\\Phi}{\\Delta t}\\right|',
      'E_0 = \\omega N B S, \\quad \\frac{U_1}{U_2} = \\frac{N_1}{N_2}'
    ],
    simulationType: 'magnetic_induction',
    sim3dType: 'lorentz_helix',
    defaultParams: { B: 1.2, velocity: 4, turns: 15 },
    paramBounds: {
      B: { min: 0.2, max: 3.0, step: 0.1, unit: 'T', label: 'Cảm ứng từ B' },
      velocity: { min: 1, max: 10, step: 0.5, unit: 'rad/s', label: 'Tốc độ di chuyển nam châm' },
      turns: { min: 5, max: 40, step: 1, unit: 'vòng', label: 'Số vòng dây N' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Vật lí 12 KNTT Bài 10',
        question:
          'Một đoạn dây dài $0{,}5\\text{ m}$ mang dòng điện $4\\text{ A}$ đặt vuông góc với đường sức từ trường đều $B = 0{,}2\\text{ T}$. Độ lớn lực từ tác dụng lên dây là:',
        options: ['A. 0,4 N', 'B. 4 N', 'C. 0,2 N', 'D. 1,6 N'],
        correctIndex: 0,
        explanation:
          'Vì $\\alpha = 90^\\circ$ ($\\sin 90^\\circ = 1$), $F = BIl\\sin 90^\\circ = 0{,}2 \\cdot 4 \\cdot 0{,}5 \\cdot 1 = 0{,}4\\text{ N}$.'
      },
      {
        source: 'Loigiaihay · Cảm ứng điện từ 12',
        question:
          'Một khung dây phẳng diện tích $20\\text{ cm}^2$ gồm $100$ vòng đặt vuông góc với từ trường đều. Trong $0{,}1\\text{ s}$, cảm ứng từ tăng đều từ $0{,}1\\text{ T}$ lên $0{,}5\\text{ T}$. Suất điện động cảm ứng trong khung có độ lớn:',
        options: ['A. 0,8 V', 'B. 8 V', 'C. 0,08 V', 'D. 80 V'],
        correctIndex: 0,
        explanation:
          'Đổi $S = 20\\cdot 10^{-4}\\text{ m}^2$. Độ biến thiên từ thông $\\Delta\\Phi = N \\cdot \\Delta B \\cdot S \\cdot \\cos 0^\\circ = 100 \\cdot (0{,}5 - 0{,}1) \\cdot 20\\cdot 10^{-4} = 0{,}08\\text{ Wb}$. Suất điện động $|e_c| = \\frac{0{,}08}{0{,}1} = 0{,}8\\text{ V}$.'
      },
      {
        source: 'VietJack · Máy biến áp 12',
        question:
          'Một máy biến áp lí tưởng có cuộn sơ cấp $500$ vòng nối vào mạng điện $220\\text{ V}$ và cuộn thứ cấp $100$ vòng. Điện áp hiệu dụng ở hai đầu cuộn thứ cấp để hở là:',
        options: ['A. 44 V', 'B. 1100 V', 'C. 22 V', 'D. 110 V'],
        correctIndex: 0,
        explanation:
          '$U_2 = U_1 \\cdot \\frac{N_2}{N_1} = 220 \\cdot \\frac{100}{500} = 44\\text{ V}$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Suất điện động cảm ứng 12',
        question:
          'Một cuộn dây hình vuông cạnh $a = 10\\text{ cm}$ gồm $50$ vòng có điện trở toàn phần $R = 2\\,\\Omega$ đặt vuông góc với từ trường đều $B$. Cho cảm ứng từ giảm đều từ $0{,}8\\text{ T}$ về $0$ trong thời gian $0{,}2\\text{ s}$. Tính cường độ dòng điện cảm ứng và nhiệt lượng tỏa ra trong cuộn dây.',
        hints: ['Diện tích $S = a^2 = 0{,}01\\text{ m}^2$, tính $|e_c| = |\\Delta\\Phi|/\\Delta t$ rồi $I_c = |e_c|/R$.'],
        solutionSteps: [
          'Bước 1: Diện tích một vòng dây: $S = 0{,}1^2 = 0{,}01\\text{ m}^2$.',
          'Bước 2: Suất điện động cảm ứng: $|e_c| = N \\cdot S \\cdot \\frac{|\\Delta B|}{\\Delta t} = 50 \\cdot 0{,}01 \\cdot \\frac{0{,}8}{0{,}2} = 2\\text{ V}$.',
          'Bước 3: Cường độ dòng điện cảm ứng: $I_c = \\frac{|e_c|}{R} = \\frac{2}{2} = 1\\text{ A}$.',
          'Bước 4: Nhiệt lượng tỏa ra: $Q = I_c^2 R \\Delta t = 1^2 \\cdot 2 \\cdot 0{,}2 = 0{,}4\\text{ J}$.'
        ],
        finalAnswer: '$I_c = 1\\text{ A}$, $Q = 0{,}4\\text{ J}$.'
      },
      {
        source: 'Loigiaihay · Quỹ đạo hạt điện tích 12',
        question:
          'Một hạt proton ($m = 1{,}67\\cdot 10^{-27}\\text{ kg}$, $q = 1{,}6\\cdot 10^{-19}\\text{ C}$) bay vuông góc vào từ trường đều $B = 0{,}4\\text{ T}$ với tốc độ $v = 2\\cdot 10^6\\text{ m/s}$. Tính lực Lorentz tác dụng lên hạt và bán kính quỹ đạo tròn của hạt.',
        hints: ['Lực Lorentz đóng vai trò lực hướng tâm: $|q|vB = \\frac{mv^2}{R}$.'],
        solutionSteps: [
          'Bước 1: Lực Lorentz: $f = |q|vB\\sin 90^\\circ = 1{,}6\\cdot 10^{-19} \\cdot 2\\cdot 10^6 \\cdot 0{,}4 = 1{,}28\\cdot 10^{-13}\\text{ N}$.',
          'Bước 2: Bán kính quỹ đạo tròn: $R = \\frac{mv}{|q|B} = \\frac{1{,}67\\cdot 10^{-27} \\cdot 2\\cdot 10^6}{1{,}6\\cdot 10^{-19} \\cdot 0{,}4} \\approx 0{,}0522\\text{ m} = 5{,}22\\text{ cm}$.'
        ],
        finalAnswer: '$f = 1{,}28 \\cdot 10^{-13}\\text{ N}$; $R \\approx 5{,}22\\text{ cm}$.'
      }
    ]
  },

  {
    id: 'phys-12-optics-q',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương trình Vật lí 12 · Sóng ánh sáng & Lượng tử',
    sourceTag: 'SGK Vật lí 12 · VietJack · Loigiaihay',
    lessonNumber: 16,
    title: 'Sóng ánh sáng, Lượng tử ánh sáng & Mẫu nguyên tử Bohr',
    subtitle: 'Giao thoa khe Young i = λD/a, lượng tử năng lượng ε = hf = hc/λ, hiện tượng quang điện và tiên đề Bohr',
    description:
      'Kết nối bản chất sóng và bản chất hạt (lưỡng tính sóng – hạt) của ánh sáng: giải bài toán vân giao thoa khe Young, tính giới hạn quang điện $\\lambda_0 = hc/A$ và năng lượng photon phát xạ/hấp thụ khi electron chuyển quỹ đạo Bohr.',
    theorySections: [
      {
        heading: '1. Giao thoa ánh sáng khe Young',
        content:
          '• Khoảng vân giao thoa: $i = \\frac{\\lambda D}{a}$.\n• Vị trí vân sáng bậc $k$: $x_s = k \\cdot i$; vị trí vân tối thứ $k$: $x_t = (k + 0{,}5)i$.'
      },
      {
        heading: '2. Thuyết Lượng tử ánh sáng & Hiện tượng Quang điện',
        content:
          '• Năng lượng một photon: $\\varepsilon = hf = \\frac{hc}{\\lambda}$ ($h = 6{,}625\\cdot 10^{-34}\\text{ J}\\cdot\\text{s}$, $c = 3\\cdot 10^8\\text{ m/s}$).\n• Điều kiện xảy ra quang điện ngoài: $\\lambda \\le \\lambda_0 = \\frac{hc}{A}$ ($A$ là công thoát electron khỏi kim loại).\n• Công thức Anh-xtanh: $\\frac{hc}{\\lambda} = A + \\frac{1}{2}m v_{0\\max}^2$.'
      },
      {
        heading: '3. Hai tiên đề của Bohr về cấu tạo nguyên tử',
        content:
          '• Tiên đề về trạng thái dừng: Electron chuyển động trên các quỹ đạo dừng bán kính $r_n = n^2 r_0$ ($r_0 = 5{,}3\\cdot 10^{-11}\\text{ m}$), mức năng lượng nguyên tử Hiđrô $E_n = -\\frac{13{,}6}{n^2}\\text{ eV}$.\n• Tiên đề bức xạ/hấp thụ: Khi chuyển từ trạng thái năng lượng cao $E_m$ về thấp $E_n$, nguyên tử phát ra photon có năng lượng $\\varepsilon = hf = E_m - E_n$.'
      }
    ],
    keyFormulas: [
      'i = \\frac{\\lambda D}{a}, \\quad x_s = k i',
      '\\varepsilon = hf = \\frac{hc}{\\lambda}, \\quad \\lambda_0 = \\frac{hc}{A}',
      'E_n = -\\frac{13{,}6}{n^2}\\text{ eV}, \\quad r_n = n^2 r_0'
    ],
    simulationType: 'light_refraction',
    sim3dType: 'bohr_atom',
    defaultParams: { n1: 1.0, n2: 1.5, angleI: 40 },
    paramBounds: {
      n1: { min: 1.0, max: 2.4, step: 0.05, unit: '', label: 'Chiết suất môi trường 1 (n₁)' },
      n2: { min: 1.0, max: 2.4, step: 0.05, unit: '', label: 'Chiết suất môi trường 2 (n₂)' },
      angleI: { min: 0, max: 85, step: 1, unit: '°', label: 'Góc tới i' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Lượng tử ánh sáng 12',
        question:
          'Một kim loại có công thoát $A = 4{,}14\\text{ eV}$ ($1\\text{ eV} = 1{,}6\\cdot 10^{-19}\\text{ J}$). Giới hạn quang điện $\\lambda_0$ của kim loại này xấp xỉ:',
        options: ['A. 0,30 μm', 'B. 0,45 μm', 'C. 0,60 μm', 'D. 0,25 μm'],
        correctIndex: 0,
        explanation:
          '$\\lambda_0 = \\frac{hc}{A} = \\frac{6{,}625\\cdot 10^{-34} \\cdot 3\\cdot 10^8}{4{,}14 \\cdot 1{,}6\\cdot 10^{-19}} \\approx 0{,}30\\cdot 10^{-6}\\text{ m} = 0{,}30\\,\\mu\\text{m}$.'
      },
      {
        source: 'Loigiaihay · Giao thoa Young 12',
        question:
          'Trong thí nghiệm khe Young với $a = 1\\text{ mm}$, $D = 2\\text{ m}$, ánh sáng đơn sắc có bước sóng $\\lambda = 0{,}6\\,\\mu\\text{m}$. Khoảng vân trên màn là:',
        options: ['A. 1,2 mm', 'B. 0,6 mm', 'C. 2,4 mm', 'D. 0,3 mm'],
        correctIndex: 0,
        explanation:
          '$i = \\frac{\\lambda D}{a} = \\frac{0{,}6\\cdot 10^{-6} \\cdot 2}{10^{-3}} = 1{,}2\\cdot 10^{-3}\\text{ m} = 1{,}2\\text{ mm}$.'
      },
      {
        source: 'VietJack · Mẫu nguyên tử Bohr 12',
        question:
          'Trong nguyên tử Hiđrô, khi electron chuyển từ quỹ đạo dừng N ($n = 4$) về quỹ đạo L ($n = 2$), năng lượng photon phát ra bằng:',
        options: ['A. 2,55 eV', 'B. 10,2 eV', 'C. 1,89 eV', 'D. 12,75 eV'],
        correctIndex: 0,
        explanation:
          '$\\varepsilon = E_4 - E_2 = -\\frac{13{,}6}{16} - \\left(-\\frac{13{,}6}{4}\\right) = -0{,}85 + 3{,}4 = 2{,}55\\text{ eV}$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Khe Young 12',
        question:
          'Thí nghiệm Y-âng với hai khe cách nhau $a = 1{,}2\\text{ mm}$, màn cách hai khe $D = 2{,}4\\text{ m}$, dùng ánh sáng bước sóng $\\lambda = 0{,}5\\,\\mu\\text{m}$. Tính khoảng vân $i$ và xác định tại điểm $M$ cách vân trung tâm $4{,}5\\text{ mm}$ là vân sáng hay vân tối thứ mấy.',
        hints: ['Tính tỉ số $x_M / i$. Nếu nguyên là vân sáng, nếu bán nguyên $k + 0{,}5$ là vân tối.'],
        solutionSteps: [
          'Bước 1: Khoảng vân $i = \\frac{\\lambda D}{a} = \\frac{0{,}5\\cdot 10^{-6} \\cdot 2{,}4}{1{,}2\\cdot 10^{-3}} = 1{,}0\\text{ mm}$.',
          'Bước 2: Xét tỉ số $\\frac{x_M}{i} = \\frac{4{,}5}{1{,}0} = 4{,}5 = 4 + 0{,}5$.',
          'Bước 3: Vì tỉ số là số bán nguyên ($k = 4$), tại $M$ có vân tối thứ $5$ kể từ vân trung tâm.'
        ],
        finalAnswer: '$i = 1{,}0\\text{ mm}$; $M$ là vân tối thứ $5$.'
      },
      {
        source: 'Loigiaihay · Tự luận Quang điện 12',
        question:
          'Chiếu bức xạ đơn sắc có bước sóng $\\lambda = 0{,}25\\,\\mu\\text{m}$ vào catôt làm bằng kim loại có giới hạn quang điện $\\lambda_0 = 0{,}36\\,\\mu\\text{m}$. Tính động năng ban đầu cực đại của quang electron thoát ra (theo đơn vị Jun và eV).',
        hints: ['Dùng hệ thức Anh-xtanh $W_{đ\\max} = \\frac{hc}{\\lambda} - \\frac{hc}{\\lambda_0}$.'],
        solutionSteps: [
          'Bước 1: Ta có $hc = 6{,}625\\cdot 10^{-34} \\cdot 3\\cdot 10^8 = 1{,}9875\\cdot 10^{-25}\\text{ J}\\cdot\\text{m}$.',
          'Bước 2: $W_{đ\\max} = 1{,}9875\\cdot 10^{-25}\\left(\\frac{1}{0{,}25\\cdot 10^{-6}} - \\frac{1}{0{,}36\\cdot 10^{-6}}\\right) = 1{,}9875\\cdot 10^{-19}\\left(4 - \\frac{25}{9}\\right) \\approx 2{,}43\\cdot 10^{-19}\\text{ J}$.',
          'Bước 3: Đổi sang eV: $2{,}43\\cdot 10^{-19} / (1{,}6\\cdot 10^{-19}) \\approx 1{,}52\\text{ eV}$.'
        ],
        finalAnswer: '$W_{đ\\max} \\approx 2{,}43 \\cdot 10^{-19}\\text{ J} \\approx 1{,}52\\text{ eV}$.'
      }
    ]
  },

  {
    id: 'phys-12-nuclear',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương trình Vật lí 12 GDPT 2018 · Vật lí Hạt nhân',
    sourceTag: 'SGK Vật lí 12 GDPT 2018 (KNTT / CTST / Cánh Diều) · VietJack · Loigiaihay',
    lessonNumber: 17,
    title: 'Vật lí Hạt nhân, Năng lượng liên kết & Định luật Phóng xạ',
    subtitle: 'Cấu trúc hạt nhân A = Z + N, độ hụt khối Δm, năng lượng liên kết riêng, phản ứng hạt nhân và định luật phóng xạ mũ',
    description:
      'Chương cuối cùng của Vật lí 12 GDPT 2018: tính độ hụt khối và mức độ bền vững của hạt nhân qua năng lượng liên kết riêng $W_{lkr}$, cân bằng bảo toàn số khối/điện tích trong phản ứng phân hạch – nhiệt hạch và mô phỏng trực tiếp sự phân rã phóng xạ.',
    theorySections: [
      {
        heading: '1. Cấu tạo Hạt nhân & Năng lượng liên kết',
        content:
          '• Kí hiệu hạt nhân ${}^A_Z X$ gồm $Z$ proton và $N = A - Z$ neutron.\n• Độ hụt khối: $\\Delta m = Z m_p + (A - Z) m_n - m_X$.\n• Năng lượng liên kết: $W_{lk} = \\Delta m \\cdot c^2$ (với $1\\text{ amu}\\cdot c^2 = 931{,}5\\text{ MeV}$).\n• Năng lượng liên kết riêng $\\varepsilon = \\frac{W_{lk}}{A}$ càng lớn thì hạt nhân càng bền vững (lớn nhất quanh $A \\in [50; 95]$).'
      },
      {
        heading: '2. Phản ứng hạt nhân & Năng lượng phản ứng',
        content:
          '• 4 định luật bảo toàn: Bảo toàn số nuclon ($A$), Bảo toàn điện tích ($Z$), Bảo toàn năng lượng toàn phần, Bảo toàn động lượng.\n• Năng lượng phản ứng tỏa/thu: $\\Delta E = (m_{\\text{trước}} - m_{\\text{sau}})c^2$ (nếu $> 0$ phản ứng tỏa năng lượng).'
      },
      {
        heading: '3. Định luật Phóng xạ theo chu kì bán rã T',
        content:
          '• Số hạt nhân (hoặc khối lượng) chất phóng xạ còn lại sau thời gian $t$:\n  $$N(t) = N_0 \\cdot 2^{-t/T} = N_0 e^{-\\lambda t}, \\quad \\lambda = \\frac{\\ln 2}{T}$$\n• Số hạt đã bị phân rã (tạo thành hạt con): $\\Delta N = N_0\\left(1 - 2^{-t/T}\\right)$.\n• Độ phóng xạ: $H = \\lambda N$ (đơn vị Becquerel: $1\\text{ Bq} = 1\\text{ phân rã/s}$).'
      }
    ],
    keyFormulas: [
      '\\Delta m = Zm_p + (A-Z)m_n - m_X, \\quad W_{lk} = \\Delta m c^2',
      'N(t) = N_0 \\cdot 2^{-t/T} = N_0 e^{-\\lambda t}',
      '\\Delta N = N_0(1 - 2^{-t/T}), \\quad H = \\lambda N'
    ],
    simulationType: 'nuclear_decay',
    sim3dType: 'bohr_atom',
    defaultParams: { halfLife: 4.0, n0: 100 },
    paramBounds: {
      halfLife: { min: 1.5, max: 10.0, step: 0.5, unit: 's', label: 'Chu kì bán rã T' },
      n0: { min: 40, max: 100, step: 10, unit: 'hạt', label: 'Số hạt ban đầu N₀ (%)' }
    },
    practiceExercises: [
      {
        source: 'VietJack · Vật lí 12 KNTT Bài 23',
        question:
          'Một mẫu chất phóng xạ ban đầu có khối lượng $80\\text{ g}$, chu kì bán rã $T = 10\\text{ ngày}$. Sau $30\\text{ ngày}$, khối lượng chất phóng xạ còn lại là:',
        options: ['A. 10 g', 'B. 20 g', 'C. 70 g', 'D. 5 g'],
        correctIndex: 0,
        explanation:
          'Số chu kì đã trôi qua $t/T = 30/10 = 3$. Khối lượng còn lại $m = m_0 \\cdot 2^{-3} = 80 / 8 = 10\\text{ g}$.'
      },
      {
        source: 'Loigiaihay · Năng lượng liên kết 12',
        question:
          'Hạt nhân ${}^{12}_6\\text{C}$ có khối lượng $12{,}0000\\text{ amu}$. Biết $m_p = 1{,}0073\\text{ amu}$, $m_n = 1{,}0087\\text{ amu}$ và $1\\text{ amu}\\cdot c^2 = 931{,}5\\text{ MeV}$. Độ hụt khối của ${}^{12}_6\\text{C}$ là:',
        options: ['A. 0,0960 amu', 'B. 0,0480 amu', 'C. 0,1920 amu', 'D. 0,0096 amu'],
        correctIndex: 0,
        explanation:
          '$\\Delta m = 6 m_p + 6 m_n - m_C = 6(1{,}0073 + 1{,}0087) - 12 = 12{,}0960 - 12 = 0{,}0960\\text{ amu}$.'
      },
      {
        source: 'VietJack · Phản ứng hạt nhân 12',
        question: 'Trong phương trình phản ứng hạt nhân ${}^9_4\\text{Be} + {}^4_2\\text{He} \\to {}^{12}_6\\text{C} + X$. Hạt $X$ là:',
        options: ['A. Neutron (${}^1_0 n$)', 'B. Proton (${}^1_1 p$)', 'C. Electron (${}^0_{-1} e$)', 'D. Hạt alpha'],
        correctIndex: 0,
        explanation:
          'Bảo toàn số khối $A$: $9 + 4 = 12 + A_X \\Rightarrow A_X = 1$. Bảo toàn điện tích $Z$: $4 + 2 = 6 + Z_X \\Rightarrow Z_X = 0$. Vậy $X$ là neutron ${}^1_0 n$.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận Định luật Phóng xạ 12',
        question:
          'Chất phóng xạ ${}^{131}_{53}\\text{I}$ dùng trong y tế có chu kì bán rã $T = 8\\text{ ngày}$. Ban đầu có $16\\text{ mg}$ I-ốt phóng xạ. Tính: a) Khối lượng I-ốt bị phân rã sau $24\\text{ ngày}$; b) Độ phóng xạ ban đầu của mẫu (lấy $N_A = 6{,}02\\cdot 10^{23}\\text{ mol}^{-1}$).',
        hints: ['Đổi $T = 8 \\cdot 86400\\text{ s}$ khi tính hằng số phóng xạ $\\lambda = \\frac{\\ln 2}{T}$ và độ phóng xạ $H_0 = \\lambda N_0$.'],
        solutionSteps: [
          'a) Sau $t = 24\\text{ ngày} = 3T$: Khối lượng đã bị phân rã $\\Delta m = m_0(1 - 2^{-t/T}) = 16(1 - 2^{-3}) = 16 \\cdot \\frac{7}{8} = 14\\text{ mg}$.',
          'b) Số hạt ban đầu: $N_0 = \\frac{m_0}{M}N_A = \\frac{16\\cdot 10^{-3}}{131} \\cdot 6{,}02\\cdot 10^{23} \\approx 7{,}353\\cdot 10^{19}$ hạt.',
          'Hằng số phóng xạ: $\\lambda = \\frac{\\ln 2}{8 \\cdot 86400} \\approx 1{,}003\\cdot 10^{-6}\\text{ s}^{-1}$.',
          'Độ phóng xạ ban đầu: $H_0 = \\lambda N_0 \\approx 7{,}37 \\cdot 10^{13}\\text{ Bq}$.'
        ],
        finalAnswer: 'a) $\\Delta m = 14\\text{ mg}$; b) $H_0 \\approx 7{,}37 \\cdot 10^{13}\\text{ Bq}$.'
      },
      {
        source: 'Loigiaihay · Năng lượng phản ứng hạt nhân 12',
        question:
          'Xét phản ứng nhiệt hạch: ${}^2_1\\text{H} + {}^3_1\\text{H} \\to {}^4_2\\text{He} + {}^1_0 n$. Cho $m_D = 2{,}0136\\text{ amu}$, $m_T = 3{,}0160\\text{ amu}$, $m_{\\text{He}} = 4{,}0015\\text{ amu}$, $m_n = 1{,}0087\\text{ amu}$. Tính năng lượng tỏa ra từ 1 phản ứng (MeV).',
        hints: ['Dùng $\\Delta E = (m_{\\text{trước}} - m_{\\text{sau}}) \\cdot 931{,}5\\text{ MeV}$.'],
        solutionSteps: [
          'Bước 1: Tổng khối lượng trước phản ứng: $m_{\\text{trước}} = 2{,}0136 + 3{,}0160 = 5{,}0296\\text{ amu}$.',
          'Bước 2: Tổng khối lượng sau phản ứng: $m_{\\text{sau}} = 4{,}0015 + 1{,}0087 = 5{,}0102\\text{ amu}$.',
          'Bước 3: Độ giảm khối lượng: $\\Delta m = 5{,}0296 - 5{,}0102 = 0{,}0194\\text{ amu}$.',
          'Bước 4: Năng lượng tỏa ra: $\\Delta E = 0{,}0194 \\cdot 931{,}5 \\approx 18{,}07\\text{ MeV}$.'
        ],
        finalAnswer: '$\\Delta E \\approx 18{,}07\\text{ MeV}$.'
      }
    ]
  },

  // ============================================================================
  // KHU CHUYÊN VẬT LÍ — LỘ TRÌNH PHÂN TẦNG: CƠ BẢN -> NÂNG CAO -> CHUYÊN / HSG
  // ============================================================================

  {
    id: 'phys-pro-1',
    track: 'chuyen',
    grade: 'Lớp 10',
    tier: 'Cơ bản',
    stageLabel: 'Khu Chuyên Lí · Bậc 1: Cơ bản Chuyên',
    sourceTag: 'Chuyên đề Bồi dưỡng HSG Vật lí · Đề Chuyên Sở GD',
    lessonNumber: 18,
    title: 'Động lực học Hệ quy chiếu Phi quán tính & Mặt phẳng nghiêng di động',
    subtitle: 'Phương pháp lực quán tính F_qt = -ma₀, điều kiện trượt tương đối và bài toán nêm chuyển động có gia tốc',
    description:
      'Bước đệm đầu tiên của Khu Chuyên Lí (Mức Cơ bản Chuyên): giải nhanh các bài toán vật trượt trên xe tăng tốc, vật đặt trên nêm có gia tốc bằng phương pháp gắn hệ quy chiếu phi quán tính và thêm lực quán tính $\\vec{F}_{qt} = -m\\vec{a}_0$.',
    theorySections: [
      {
        heading: '1. Nguyên tắc chọn Hệ quy chiếu Phi quán tính',
        content:
          '• Khi gắn hệ quy chiếu vào vật chuẩn đang chuyển động với gia tốc $\\vec{a}_0$ so với mặt đất, ngoài các lực thực (trọng lực, phản lực, ma sát, lực căng), ta phải đưa thêm **lực quán tính** đặt vào vật:\n  $$\\vec{F}_{qt} = -m\\vec{a}_0$$\n• Sau đó áp dụng phương trình cân bằng hoặc Định luật II Newton như bình thường: $\\sum\\vec{F}_{\\text{thực}} + \\vec{F}_{qt} = m\\vec{a}_{\\text{tương đối}}$.'
      },
      {
        heading: '2. Trọng lực hiệu dụng g\' trong thang máy hoặc xe tăng tốc',
        content:
          '• Kết hợp trọng lực và lực quán tính thành trọng lực biểu kiến $\\vec{P}\' = m\\vec{g} - m\\vec{a}_0 \\Rightarrow \\vec{g}\' = \\vec{g} - \\vec{a}_0$.\n• Thang máy đi lên nhanh dần đều gia tốc $a_0$: $g\' = g + a_0$.\n• Xe tăng tốc ngang gia tốc $a_0$: dây treo con lắc lệch góc $\\tan\\alpha = \\frac{a_0}{g}$, $g\' = \\sqrt{g^2 + a_0^2}$.'
      }
    ],
    keyFormulas: [
      '\\vec{F}_{qt} = -m\\vec{a}_0',
      '\\sum \\vec{F}_{\\text{thực}} + \\vec{F}_{qt} = m\\vec{a}_{\\text{td}}',
      '\\tan\\alpha = \\frac{a_0}{g}, \\quad g\' = \\sqrt{g^2 + a_0^2}'
    ],
    simulationType: 'kinematics_graphs',
    sim3dType: 'kinematics_3d',
    defaultParams: { vizMode: 2, v0: 0, accel: 3.0, angleDeg: 30, f1: 30, f2: 20 },
    paramBounds: {
      vizMode: { min: 0, max: 2, step: 1, unit: '(0:Vectơ lực | 2:v-t)', label: 'Chế độ phân tích' },
      accel: { min: 0.5, max: 6.0, step: 0.5, unit: 'm/s²', label: 'Gia tốc HQC a₀' },
      angleDeg: { min: 15, max: 60, step: 5, unit: '°', label: 'Góc nêm α' }
    },
    practiceExercises: [
      {
        source: 'Chuyên đề HSG Vật lí 10',
        question:
          'Một ô tô tăng tốc đều theo phương ngang với gia tốc $a_0 = 5{,}77\\text{ m/s}^2$ ($g = 10\\text{ m/s}^2$). Dây treo một quả cầu nhỏ gắn trên trần xe lệch khỏi phương thẳng đứng một góc:',
        options: ['A. 30°', 'B. 45°', 'C. 60°', 'D. 15°'],
        correctIndex: 0,
        explanation:
          'Trong hệ quy chiếu gắn với xe, quả cầu chịu trọng lực $P = mg$, lực quán tính ngang $F_{qt} = ma_0$ và lực căng dây. Khi cân bằng: $\\tan\\alpha = \\frac{F_{qt}}{P} = \\frac{a_0}{g} = \\frac{5{,}77}{10} \\approx \\frac{1}{\\sqrt{3}} \\Rightarrow \\alpha = 30^\\circ$.'
      },
      {
        source: 'VietJack · Nâng cao 10',
        question:
          'Một người đứng trên cân đặt trong thang máy đi xuống chậm dần đều với gia tốc $2\\text{ m/s}^2$ ($g = 10\\text{ m/s}^2$). Số chỉ của cân so với trọng lượng thực $P$ của người sẽ:',
        options: [
          'A. Tăng thêm 20%',
          'B. Giảm đi 20%',
          'C. Không thay đổi',
          'D. Giảm còn 0'
        ],
        correctIndex: 0,
        explanation:
          'Thang máy đi xuống chậm dần đều nên vectơ $\\vec{a}_0$ hướng LÊN trên. Lực quán tính $\\vec{F}_{qt} = -m\\vec{a}_0$ hướng XUỐNG dưới cùng chiều trọng lực! Do đó $N = m(g + a_0) = 1{,}2mg$, số chỉ tăng $20\\%$.'
      },
      {
        source: 'Đề tuyển sinh Chuyên Lí 10',
        question:
          'Đặt vật khối lượng $m$ trên mặt nêm nhẵn nghiêng góc $\\alpha = 45^\\circ$ so với phương ngang. Để vật đứng yên trên mặt nêm, phải đẩy nêm chuyển động ngang theo chiều hợp lý với gia tốc tối thiểu là:',
        options: ['A. a₀ = g', 'B. a₀ = g/2', 'C. a₀ = g√2', 'D. a₀ = g/√2'],
        correctIndex: 0,
        explanation:
          'Chiếu phương trình cân bằng dọc mặt nêm: $mg\\sin\\alpha = ma_0\\cos\\alpha \\Rightarrow a_0 = g\\tan\\alpha = g\\tan 45^\\circ = g$.'
      }
    ],
    essayExercises: [
      {
        source: 'Đề thi Chuyên Vật lí 10',
        question:
          'Một chiếc nêm khối lượng $M$ có mặt nghiêng nhẵn góc $\\alpha = 30^\\circ$ đặt trên mặt sàn ngang nhẵn. Đặt vật nhỏ khối lượng $m$ lên mặt nêm rồi thả nhẹ. Tìm gia tốc của nêm và gia tốc tương đối của vật đối với nêm ($g = 10\\text{ m/s}^2$, cho $M = 2m$).',
        hints: ['Gắn HQC phi quán tính vào nêm có gia tốc $a_M$ hướng sang trái; viết phương trình định luật II cho $m$ (có thêm lực quán tính $ma_M$) và cho nêm $M$ dưới tác dụng của áp lực $N$.'],
        solutionSteps: [
          'Bước 1: Xét nêm $M$ trượt ngang dưới tác dụng thành phần ngang của áp lực $N$: $N\\sin\\alpha = M a_M \\quad (1)$.',
          'Bước 2: Trong HQC gắn nêm, vật $m$ không rời mặt nêm nên gia tốc vuông góc mặt nêm bằng 0: $N + m a_M \\sin\\alpha = mg\\cos\\alpha \\quad (2)$.',
          'Bước 3: Thay $a_M = \\frac{N\\sin\\alpha}{M}$ vào (2): $N\\left(1 + \\frac{m\\sin^2\\alpha}{M}\\right) = mg\\cos\\alpha$. Với $M = 2m, \\alpha = 30^\\circ$: $N\\left(1 + \\frac{1}{8}\\right) = mg\\frac{\\sqrt{3}}{2} \\Rightarrow N = \\frac{4\\sqrt{3}}{9}mg$.',
          'Bước 4: Suy ra gia tốc nêm: $a_M = \\frac{N\\sin 30^\\circ}{2m} = \\frac{\\sqrt{3}}{9}g \\approx 1{,}92\\text{ m/s}^2$. Gia tốc trượt tương đối của vật dọc nêm: $a_{td} = g\\sin\\alpha + a_M\\cos\\alpha = 5 + \\frac{3}{18}g \\approx 6{,}67\\text{ m/s}^2$.'
        ],
        finalAnswer: '$a_M \\approx 1{,}92\\text{ m/s}^2$; $a_{td} \\approx 6{,}67\\text{ m/s}^2$.'
      },
      {
        source: 'Bồi dưỡng HSG Vật lí 10',
        question:
          'Một khúc gỗ đặt trên sàn toa tàu đang đứng yên. Hệ số ma sát giữa gỗ và sàn là $\\mu = 0{,}25$ ($g = 10\\text{ m/s}^2$). Hỏi đoàn tàu phải tăng tốc ít nhất bao nhiêu thì khúc gỗ bắt đầu trượt về phía sau toa?',
        hints: ['Gỗ trượt khi lực quán tính $F_{qt} = ma_0$ thắng được lực ma sát nghỉ cực đại $\\mu mg$.'],
        solutionSteps: [
          'Bước 1: Trong HQC gắn toa tàu, lực quán tính kéo gỗ về sau là $F_{qt} = m a_0$.',
          'Bước 2: Lực ma sát nghỉ cực đại giữ gỗ đứng yên trên sàn là $F_{msn,\\max} = \\mu m g$.',
          'Bước 3: Điều kiện trượt: $m a_0 > \\mu m g \\Rightarrow a_0 > \\mu g = 0{,}25 \\cdot 10 = 2{,}5\\text{ m/s}^2$.'
        ],
        finalAnswer: '$a_{0\\min} = 2{,}5\\text{ m/s}^2$.'
      }
    ]
  },

  {
    id: 'phys-pro-2',
    track: 'chuyen',
    grade: 'Lớp 10',
    tier: 'Nâng cao',
    stageLabel: 'Khu Chuyên Lí · Bậc 2: Nâng cao Chuyên',
    sourceTag: 'Tài liệu Chuyên Vật lí · Tuyển tập HSG Tỉnh/Thành phố',
    lessonNumber: 19,
    title: 'Chuyển động liên kết, Ròng rọc động & Bài toán Va chạm Đàn hồi',
    subtitle: 'Phương trình liên kết dây không dãn, quan hệ gia tốc ròng rọc động a₁ = 2a₂ và bảo toàn động lượng – động năng khi va chạm xiên',
    description:
      'Chủ đề Vật lí Chuyên mức Nâng cao: thiết lập phương trình liên kết hình học của hệ nhiều vật qua ròng rọc động/cố định, giải hệ va chạm đàn hồi xuyên tâm và va chạm hai chiều.',
    theorySections: [
      {
        heading: '1. Nguyên tắc tìm phương trình liên kết Ròng rọc',
        content:
          '• Khi sợi dây lý tưởng không dãn và khối lượng không đáng kể: độ dài toàn bộ dây $L = \\text{const}$.\n• Đạo hàm 2 lần phương trình độ dài dây theo thời gian ta thu được liên hệ giữa gia tốc các vật (ví dụ: kéo 1 đầu dây qua ròng rọc động nâng vật nặng thì đầu dây đi đoạn $2h$ khi vật lên đoạn $h \\Rightarrow a_{\\text{dây}} = 2a_{\\text{vật}}$).\n• Lực căng dây đồng nhất trên suốt một sợi dây liên tục khi ròng rọc không khối lượng, không ma sát: $T_{\\text{trục}} = 2T_{\\text{nhánh}}$.'
      },
      {
        heading: '2. Va chạm đàn hồi xuyên tâm & Công thức vận tốc sau va chạm',
        content:
          '• Trong va chạm hoàn toàn đàn hồi, **cả Động lượng và Động năng** đều được bảo toàn:\n  $$v_1\' = \\frac{(m_1 - m_2)v_1 + 2m_2 v_2}{m_1 + m_2}, \\quad v_2\' = \\frac{(m_2 - m_1)v_2 + 2m_1 v_1}{m_1 + m_2}$$\n• Hệ quả cực đẹp: Nếu $m_1 = m_2$, hai vật trao đổi vận tốc cho nhau ($v_1\' = v_2, v_2\' = v_1$). Nếu $m_1$ va chạm vào $m_2$ đứng yên với hai khối lượng bằng nhau va chạm không xuyên tâm, hai vectơ vận tốc sau va chạm hợp với nhau góc $90^\\circ$!'
      }
    ],
    keyFormulas: [
      'L_{\\text{dây}} = \\text{const} \\implies \\sum \\Delta x_i = 0',
      'v_1\' = \\frac{(m_1 - m_2)v_1 + 2m_2 v_2}{m_1 + m_2}',
      '\\Delta W_{\\text{nhiệt}} = \\frac{1}{2}\\frac{m_1 m_2}{m_1 + m_2}(v_1 - v_2)^2 \\quad (\\text{va chạm mềm})'
    ],
    simulationType: 'projectile_motion',
    sim3dType: 'projectile_3d',
    defaultParams: { v0: 20, angle: 45, g: 10, h0: 0 },
    paramBounds: {
      v0: { min: 10, max: 40, step: 1, unit: 'm/s', label: 'Vận tốc va chạm / ném' },
      angle: { min: 10, max: 80, step: 5, unit: '°', label: 'Góc va chạm / ném' },
      g: { min: 5, max: 12, step: 0.5, unit: 'm/s²', label: 'Gia tốc g' }
    },
    practiceExercises: [
      {
        source: 'HSG Vật lí 10',
        question:
          'Vật $m_1 = 2\\text{ kg}$ chuyển động với tốc độ $6\\text{ m/s}$ va chạm hoàn toàn đàn hồi xuyên tâm vào vật $m_2 = 4\\text{ kg}$ đang đứng yên. Vận tốc của vật $m_1$ ngay sau va chạm là:',
        options: ['A. -2 m/s (bật ngược lại)', 'B. +2 m/s', 'C. -4 m/s', 'D. 0 m/s'],
        correctIndex: 0,
        explanation:
          'Áp dụng công thức va chạm đàn hồi ($v_2 = 0$): $v_1\' = \\frac{(m_1 - m_2)v_1}{m_1 + m_2} = \\frac{(2 - 4)\\cdot 6}{2 + 4} = -2\\text{ m/s}$ (bật ngược lại với tốc độ $2\\text{ m/s}$).'
      },
      {
        source: 'Chuyên Lí 10',
        question:
          'Trong một hệ ròng rọc động lý tưởng, người ta kéo đầu dây tự do đi xuống với gia tốc $a_1 = 4\\text{ m/s}^2$. Khi đó vật nặng gắn vào trục ròng rọc động đi lên với gia tốc:',
        options: ['A. 2 m/s²', 'B. 4 m/s²', 'C. 8 m/s²', 'D. 1 m/s²'],
        correctIndex: 0,
        explanation:
          'Do một đầu dây cố định và một đầu di chuyển, khi ròng rọc động lên đoạn $x$ thì hai nhánh dây rút ngắn tổng cộng $2x$, do đó $a_{\\text{vật}} = \\frac{a_1}{2} = 2\\text{ m/s}^2$.'
      },
      {
        source: 'Olympic Vật lí',
        question:
          'Hai quả cầu giống hệt nhau ($m_1 = m_2$), quả 1 chuyển động tốc độ $v$ đến va chạm hoàn toàn đàn hồi lệch tâm vào quả 2 đang đứng yên. Góc hợp bởi hai vectơ vận tốc ngay sau va chạm là:',
        options: ['A. 90°', 'B. 60°', 'C. 45°', 'D. 180°'],
        correctIndex: 0,
        explanation:
          'Từ $\\vec{v} = \\vec{v}_1\' + \\vec{v}_2\'$ và $v^2 = v_1\'^2 + v_2\'^2$, suy ra $\\vec{v}_1\' \\cdot \\vec{v}_2\' = 0$, tức là hai vectơ vuông góc ($90^\\circ$).'
      }
    ],
    essayExercises: [
      {
        source: 'Đề HSG Tỉnh · Ròng rọc động',
        question:
          'Hệ ròng rọc gồm 1 ròng rọc cố định và 1 ròng rọc động (khối lượng không đáng kể, dây không dãn). Vật $m_1 = 3\\text{ kg}$ treo vào trục ròng rọc động, vật $m_2 = 2\\text{ kg}$ treo vào đầu dây tự do vắt qua ròng rọc cố định. Thả hệ tự do ($g = 10\\text{ m/s}^2$). Tìm gia tốc của mỗi vật và lực căng dây $T$.',
        hints: ['Khi $m_2$ đi xuống đoạn $s_2$, thì $m_1$ đi lên đoạn $s_1 = s_2 / 2 \\Rightarrow a_2 = 2a_1$. Trục ròng rọc động chịu lực kéo lên $2T$.'],
        solutionSteps: [
          'Bước 1: Giả sử $m_2$ đi xuống với gia tốc $a_2$, $m_1$ đi lên với gia tốc $a_1 = a_2/2$.',
          'Bước 2: Phương trình cho $m_2$: $m_2 g - T = m_2 a_2 = 2m_2 a_1 \\quad (1)$.',
          'Bước 3: Phương trình cho $m_1$: $2T - m_1 g = m_1 a_1 \\quad (2)$.',
          'Bước 4: Nhân (1) với 2 rồi cộng (2): $(2m_2 - m_1)g = (4m_2 + m_1)a_1 \\Rightarrow (4 - 3)\\cdot 10 = (8 + 3)a_1 \\Rightarrow a_1 = \\frac{10}{11} \\approx 0{,}91\\text{ m/s}^2$; $a_2 = \\frac{20}{11} \\approx 1{,}82\\text{ m/s}^2$; $T = m_2(g - a_2) = 2(10 - 20/11) \\approx 16{,}36\\text{ N}$.'
        ],
        finalAnswer: '$a_1 \\approx 0{,}91\\text{ m/s}^2$ (đi lên), $a_2 \\approx 1{,}82\\text{ m/s}^2$ (đi xuống), $T \\approx 16{,}36\\text{ N}$.'
      },
      {
        source: 'Olympic Vật lí · Đạn bắn nêm',
        question:
          'Viên bi $m_1 = 1\\text{ kg}$ chuyển động với vận tốc $v_0 = 6\\text{ m/s}$ đến va chạm đàn hồi trực diện vào bi $m_2 = 2\\text{ kg}$ đang đứng yên gắn với một lò xo nhẹ độ cứng $k = 150\\text{ N/m}$ đầu kia cố định vào tường (bỏ qua ma sát). Tính độ nén cực đại của lò xo trong quá trình $m_2$ chuyển động.',
        hints: ['Sau va chạm đàn hồi, bi $m_2$ nhận vận tốc $v_2\'$ rồi toàn bộ động năng của $m_2$ chuyển thành thế năng đàn hồi $\\frac{1}{2}kx_{\\max}^2$.'],
        solutionSteps: [
          'Bước 1: Vận tốc bi $m_2$ ngay sau va chạm đàn hồi: $v_2\' = \\frac{2m_1 v_0}{m_1 + m_2} = \\frac{2 \\cdot 1 \\cdot 6}{1 + 2} = 4\\text{ m/s}$.',
          'Bước 2: Bảo toàn cơ năng khi lò xo nén cực đại: $\\frac{1}{2}m_2 v_2\'^2 = \\frac{1}{2}k\\Delta l_{\\max}^2$.',
          'Bước 3: $\\Delta l_{\\max} = v_2\'\\sqrt{\\frac{m_2}{k}} = 4\\sqrt{\\frac{2}{150}} = \\frac{4}{5\\sqrt{3}} \\approx 0{,}462\\text{ m}$.'
        ],
        finalAnswer: '$\\Delta l_{\\max} \\approx 0{,}462\\text{ m}$.'
      }
    ]
  },

  {
    id: 'phys-pro-3',
    track: 'chuyen',
    grade: 'Lớp 11',
    tier: 'Nâng cao',
    stageLabel: 'Khu Chuyên Lí · Bậc 2: Nâng cao Chuyên',
    sourceTag: 'Bồi dưỡng HSG Điện học · Mạch cầu & Biến đổi Sao-Tam giác',
    lessonNumber: 20,
    title: 'Mạch điện không phẳng, Mạch cầu tổng quát & Biến đổi Sao – Tam giác',
    subtitle: 'Quy tắc chập nút đẳng thế (đối xứng), điều kiện cầu cân bằng R₁/R₂ = R₃/R₄ và công thức biến đổi mạch Tam giác ↔ Sao',
    description:
      'Vũ khí giải mọi bài toán mạch điện phức tạp trong đề thi Chuyên & HSG Vật lí: nhận diện cầu cân bằng, khai thác tính đối xứng trục/tâm để tách hoặc chập nút đẳng thế, và phép biến đổi Sao – Tam giác $(Y \\leftrightarrow \\Delta)$ khi mạch cầu lệch.',
    theorySections: [
      {
        heading: '1. Mạch cầu cân bằng & Kỹ thuật Chập nút đối xứng',
        content:
          '• Mạch cầu gồm 4 cạnh $R_1, R_2, R_3, R_4$ và đường chéo cầu $R_5$:\n  – **Cầu cân bằng** khi $R_1 R_4 = R_2 R_3$ (hay $\\frac{R_1}{R_2} = \\frac{R_3}{R_4}$). Khi đó dòng qua nhánh cầu $I_5 = 0$, ta có thể **bỏ $R_5$** hoặc **chập 2 đầu cầu thành 1 nút**.\n• Với mạch đối xứng qua trục nối 2 cực hoặc trục vuông góc, các nút đối xứng có điện thế bằng nhau → chập lại giúp đơn giản hóa tức thì.'
      },
      {
        heading: '2. Phép biến đổi Tam giác (Δ) ↔ Hình Sao (Y)',
        content:
          '• Khi chuyển từ mạch Tam giác $(R_{12}, R_{23}, R_{31})$ sang mạch hình Sao $(R_1, R_2, R_3)$ chung tâm $O$:\n  $$R_1 = \\frac{R_{12} \\cdot R_{31}}{R_{12} + R_{23} + R_{31}}, \\quad R_2 = \\frac{R_{12} \\cdot R_{23}}{\\sum R}, \\quad R_3 = \\frac{R_{23} \\cdot R_{31}}{\\sum R}$$\n• Đặc biệt: Nếu tam giác đều có 3 điện trở bằng nhau $R_\\Delta$ thì hình sao tương ứng có $R_Y = \\frac{R_\\Delta}{3}$!'
      }
    ],
    keyFormulas: [
      '\\text{Cầu cân bằng}: \\frac{R_1}{R_2} = \\frac{R_3}{R_4} \\implies I_5 = 0',
      'R_1 = \\frac{R_{12}R_{31}}{R_{12}+R_{23}+R_{31}}',
      'R_Y = \\frac{R_\\Delta}{3} \\quad (\\text{mạch đều})'
    ],
    simulationType: 'ohm_circuit',
    sim3dType: 'lorentz_helix',
    defaultParams: { voltage: 24, r1: 12, r2: 12, circuitType: 1 },
    paramBounds: {
      voltage: { min: 6, max: 36, step: 2, unit: 'V', label: 'Hiệu điện thế U_AB' },
      r1: { min: 4, max: 40, step: 2, unit: 'Ω', label: 'Nhánh R₁' },
      r2: { min: 4, max: 40, step: 2, unit: 'Ω', label: 'Nhánh R₂' },
      circuitType: { min: 0, max: 1, step: 1, unit: '(0:NT / 1:SS)', label: 'Cấu hình' }
    },
    practiceExercises: [
      {
        source: 'Đề Chuyên Lí · Mạch cầu',
        question:
          'Cho mạch cầu $A-C-B$ và $A-D-B$ với $R_{AC} = 4\\,\\Omega$, $R_{CB} = 6\\,\\Omega$, $R_{AD} = 8\\,\\Omega$, $R_{DB} = 12\\,\\Omega$, giữa $C$ và $D$ có điện trở $R_5 = 10\\,\\Omega$. Điện trở tương đương $R_{AB}$ bằng:',
        options: ['A. 20/3 Ω', 'B. 12 Ω', 'C. 8 Ω', 'D. 5 Ω'],
        correctIndex: 0,
        explanation:
          'Kiểm tra $\\frac{R_{AC}}{R_{CB}} = \\frac{4}{6} = \\frac{8}{12} = \\frac{R_{AD}}{R_{DB}} \\Rightarrow$ Cầu cân bằng, bỏ $R_5$! Khi đó $(R_{AC}\\text{ nt }R_{CB}) = 10\\,\\Omega$ song song với $(R_{AD}\\text{ nt }R_{DB}) = 20\\,\\Omega \\Rightarrow R_{AB} = \\frac{10\\cdot 20}{10+20} = \\frac{20}{3}\\,\\Omega$.'
      },
      {
        source: 'Chuyên Lí · Biến đổi Y-Δ',
        question:
          'Ba điện trở bằng nhau cùng giá trị $R = 9\\,\\Omega$ mắc thành hình tam giác $ABC$. Nếu biến đổi tương đương sang mạch hình sao tâm $O$ nối tới 3 đỉnh $A, B, C$ thì mỗi điện trở nhánh hình sao bằng:',
        options: ['A. 3 Ω', 'B. 27 Ω', 'C. 9 Ω', 'D. 4,5 Ω'],
        correctIndex: 0,
        explanation:
          'Theo công thức chuyển đổi $\\Delta \\to Y$ cho mạch đối xứng 3 nhánh bằng nhau: $R_Y = \\frac{R_\\Delta}{3} = \\frac{9}{3} = 3\\,\\Omega$.'
      },
      {
        source: 'HSG Điện học · Mạng lập phương',
        question:
          'Một khung dây dẫn hình lập phương gồm 12 cạnh, mỗi cạnh có điện trở $R = 12\\,\\Omega$. Điện trở tương đương giữa hai đỉnh đối diện xa nhất (đường chéo không gian của hình lập phương) bằng:',
        options: ['A. 10 Ω', 'B. 12 Ω', 'C. 6 Ω', 'D. 14,4 Ω'],
        correctIndex: 0,
        explanation:
          'Áp dụng tính đối xứng chập nút: 3 đỉnh kề cực A đẳng thế, 3 đỉnh kề cực B đẳng thế. Tổng trở tương đương luôn là $R_{AB} = \\frac{5}{6}R = \\frac{5}{6} \\cdot 12 = 10\\,\\Omega$.'
      }
    ],
    essayExercises: [
      {
        source: 'Đề thi Chuyên Vật lí · Mạch cầu không cân bằng',
        question:
          'Cho mạch cầu AB không cân bằng: $R_1 = 6\\,\\Omega$ (nhánh AC), $R_2 = 6\\,\\Omega$ (nhánh AD), $R_5 = 6\\,\\Omega$ (nhánh CD), $R_3 = 3\\,\\Omega$ (nhánh CB), $R_4 = 6\\,\\Omega$ (nhánh DB). Dùng phép biến đổi Tam giác ACD thành Hình Sao để tính $R_{AB}$.',
        hints: ['Tam giác ACD gồm 3 điện trở đều bằng $6\\,\\Omega$ nên đổi sang Hình Sao tâm O có 3 nhánh $R_A = R_C = R_D = 2\\,\\Omega$.'],
        solutionSteps: [
          'Bước 1: Biến đổi tam giác $ACD$ ($R_{AC} = R_{AD} = R_{CD} = 6\\,\\Omega$) thành hình sao tâm $O$: $R_A = R_C = R_D = \\frac{6}{3} = 2\\,\\Omega$.',
          'Bước 2: Mạch mới gồm $R_A = 2\\,\\Omega$ nối tiếp với cụm song song $[(R_C + R_3) // (R_D + R_4)]$.',
          'Bước 3: Tính nhánh song song: $R_C + R_3 = 2 + 3 = 5\\,\\Omega$; $R_D + R_4 = 2 + 6 = 8\\,\\Omega \\Rightarrow R_{OB} = \\frac{5 \\cdot 8}{5 + 8} = \\frac{40}{13}\\,\\Omega$.',
          'Bước 4: Tổng điện trở: $R_{AB} = 2 + \\frac{40}{13} = \\frac{66}{13} \\approx 5{,}08\\,\\Omega$.'
        ],
        finalAnswer: '$R_{AB} = \\frac{66}{13}\\,\\Omega \\approx 5{,}08\\,\\Omega$.'
      },
      {
        source: 'HSG Vật lí · Mạch đối xứng cầu',
        question:
          'Cho 5 điện trở đều bằng $R = 10\\,\\Omega$ ghép thành mạch cầu có nhánh cầu là một Ampe kế lý tưởng ($R_A = 0$) nối từ C đến D. Nhánh AC là $R$, CB là $2R$, AD là $R$, DB là $2R$ (hoặc biến thể $R_{AC}=10, R_{CB}=20, R_{AD}=10, R_{DB}=20$? Nếu không cân bằng: $R_{AC}=10, R_{CB}=20, R_{AD}=20, R_{DB}=10$). Đặt $U_{AB} = 30\\text{ V}$, tính số chỉ Ampe kế khi $R_{AC}=10\\,\\Omega, R_{CB}=20\\,\\Omega, R_{AD}=20\\,\\Omega, R_{DB}=10\\,\\Omega$.',
        hints: ['Vì $R_A = 0$, hai điểm C và D bị chập làm một nút! Mạch trở thành $(R_{AC} // R_{AD})$ nối tiếp $(R_{CB} // R_{DB})$.'],
        solutionSteps: [
          'Bước 1: Do $R_A = 0$, $V_C = V_D$. Chập nút C và D thành một điểm.',
          'Bước 2: Cụm bên trái: $R_{AC} // R_{AD} = \\frac{10 \\cdot 20}{10 + 20} = \\frac{20}{3}\\,\\Omega$. Cụm bên phải: $R_{CB} // R_{DB} = \\frac{20 \\cdot 10}{20 + 10} = \\frac{20}{3}\\,\\Omega$.',
          'Bước 3: Điện trở toàn mạch $R_{AB} = \\frac{40}{3}\\,\\Omega \\Rightarrow I = \\frac{30}{40/3} = 2{,}25\\text{ A}$.',
          'Bước 4: Do đối xứng: $U_{AC} = U_{CB} = 15\\text{ V} \\Rightarrow I_{AC} = 1{,}5\\text{ A}$, $I_{CB} = 0{,}75\\text{ A}$. Tại nút C: dòng qua Ampe kế từ C sang D là $I_A = I_{AC} - I_{CB} = 1{,}5 - 0{,}75 = 0{,}75\\text{ A}$.'
        ],
        finalAnswer: '$I_A = 0{,}75\\text{ A}$ (chiều từ C đến D).'
      }
    ]
  },

  {
    id: 'phys-pro-4',
    track: 'chuyen',
    grade: 'Lớp 11',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Lí · Bậc 3: Chuyên / HSG Quốc Gia',
    sourceTag: 'Tuyển tập Đề Chuyên Quang hình · HSG Quốc gia',
    lessonNumber: 21,
    title: 'Quang hệ ghép Thấu kính – Gương cầu & Cực trị khoảng cách ảnh',
    subtitle: 'Sơ đồ tạo ảnh qua hệ 2 thấu kính, công thức tiêu cự tương đương và bài toán cực trị L_min = 4f khi giữ cố định vật và màn',
    description:
      'Chuyên đề Quang hình học bậc Chuyên / HSG: phân tích sơ đồ tạo ảnh nối tiếp $AB \\xrightarrow{L_1} A_1B_1 \\xrightarrow{L_2} A_2B_2$, kỹ thuật xử lý vật ảo ($d_2 = l - d_1\' < 0$) và chứng minh khoảng cách cực tiểu vật – màn là $4f$.',
    theorySections: [
      {
        heading: '1. Sơ đồ tạo ảnh qua Quang hệ đồng trục',
        content:
          '• Hai thấu kính $L_1, L_2$ đặt đồng trục cách nhau khoảng $l$:\n  $$AB \\xrightarrow{L_1 (d_1, d_1\')} A_1B_1 \\xrightarrow{L_2 (d_2, d_2\')} A_2B_2$$\n• Công thức liên hệ khoảng cách: $d_2 = l - d_1\'$.\n  – Nếu $d_2 > 0$: $A_1B_1$ là vật thật đối với $L_2$.\n  – Nếu $d_2 < 0$: $A_1B_1$ nằm sau $L_2$ nên đóng vai trò **vật ảo** đối với $L_2$ (công thức thấu kính vẫn đúng hoàn toàn về mặt đại số!).\n• Độ phóng đại toàn hệ: $k = k_1 \\cdot k_2$.'
      },
      {
        heading: '2. Bài toán Cực trị khoảng cách Vật – Màn & Dịch chuyển thấu kính',
        content:
          '• Khoảng cách giữa vật thật và ảnh thật qua thấu kính hội tụ: $L = d + d\' = d + \\frac{df}{d-f}$.\n• Áp dụng BĐT Cô-si: $L \\ge 4f$. Do đó muốn thu được ảnh thật trên màn cố định cách vật khoảng $L$, điều kiện cần là $L \\ge 4f$.\n• Khi $L > 4f$, có 2 vị trí đặt thấu kính cách nhau đoạn $a = \\sqrt{L^2 - 4Lf}$ cùng cho ảnh rõ nét trên màn, với $f = \\frac{L^2 - a^2}{4L}$ (phương pháp Bessel đo tiêu cự!).'
      }
    ],
    keyFormulas: [
      'd_2 = l - d_1\', \\quad k_{\\text{hệ}} = k_1 \\cdot k_2',
      'L_{\\min} = 4f \\quad (\\text{khi } d = d\' = 2f)',
      'f = \\frac{L^2 - a^2}{4L} \\quad (\\text{Công thức Bessel})'
    ],
    simulationType: 'lens_optics',
    sim3dType: 'optics_3d',
    defaultParams: { f: 14, d: 28, objH: 10 },
    paramBounds: {
      f: { min: -25, max: 30, step: 1, unit: 'cm', label: 'Tiêu cự thấu kính f' },
      d: { min: 5, max: 65, step: 1, unit: 'cm', label: 'Khoảng cách vật d' },
      objH: { min: 4, max: 16, step: 1, unit: 'cm', label: 'Chiều cao vật AB' }
    },
    practiceExercises: [
      {
        source: 'Đề Chuyên Lí · Phương pháp Bessel',
        question:
          'Đặt vật sáng $AB$ và màn ảnh cố định cách nhau $L = 90\\text{ cm}$. Dịch chuyển một thấu kính hội tụ giữa vật và màn thấy có 2 vị trí cho ảnh rõ nét trên màn, cách nhau $a = 30\\text{ cm}$. Tiêu cự của thấu kính là:',
        options: ['A. 20 cm', 'B. 22,5 cm', 'C. 15 cm', 'D. 30 cm'],
        correctIndex: 0,
        explanation:
          'Áp dụng công thức Bessel: $f = \\frac{L^2 - a^2}{4L} = \\frac{90^2 - 30^2}{4 \\cdot 90} = \\frac{7200}{360} = 20\\text{ cm}$.'
      },
      {
        source: 'HSG Vật lí · Hệ 2 thấu kính',
        question:
          'Hai thấu kính mỏng ghép sát nhau có tiêu cự lần lượt là $f_1 = 20\\text{ cm}$ và $f_2 = -10\\text{ cm}$. Tiêu cự tương đương của hệ thấu kính ghép sát là:',
        options: ['A. -20 cm (phân kỳ)', 'B. +20 cm (hội tụ)', 'C. +10 cm', 'D. -6,67 cm'],
        correctIndex: 0,
        explanation:
          'Độ tụ hệ ghép sát: $\\frac{1}{f} = \\frac{1}{f_1} + \\frac{1}{f_2} = \\frac{1}{20} - \\frac{1}{10} = -\\frac{1}{20} \\Rightarrow f = -20\\text{ cm}$.'
      },
      {
        source: 'Chuyên Lí · Ảnh sau hệ',
        question:
          'Chùm tia sáng song song trục chính chiếu qua hệ 2 thấu kính đặt cách nhau $l = f_1 + f_2$ (hệ vô tiêu, kính thiên văn). Chùm tia ló ra khỏi $L_2$ có đặc điểm:',
        options: [
          'A. Là chùm tia song song trục chính',
          'B. Hội tụ tại tiêu điểm $F_2\'$',
          'C. Hội tụ tại trung điểm $O_1 O_2$',
          'D. Bị phản xạ toàn phần'
        ],
        correctIndex: 0,
        explanation:
          'Chùm song song qua $L_1$ hội tụ đúng tại $F_1\' \\equiv F_2$ (tiêu điểm vật của $L_2$), nên sau khi qua $L_2$ lại trở thành chùm tia ló song song.'
      }
    ],
    essayExercises: [
      {
        source: 'Đề HSG Tỉnh · Hệ 2 thấu kính đồng trục',
        question:
          'Cho hệ hai thấu kính đồng trục: $L_1$ hội tụ tiêu cự $f_1 = 20\\text{ cm}$, $L_2$ phân kỳ tiêu cự $f_2 = -15\\text{ cm}$ đặt cách nhau $l = 45\\text{ cm}$. Đặt vật sáng $AB$ trước $L_1$ cách $L_1$ một khoảng $d_1 = 30\\text{ cm}$. Xác định vị trí, tính chất và độ phóng đại của ảnh cuối cùng $A_2 B_2$.',
        hints: ['Tính $d_1\'$ và $k_1$, sau đó tính $d_2 = l - d_1\'$ để thay vào công thức $L_2$.'],
        solutionSteps: [
          'Bước 1: Qua $L_1$: $d_1\' = \\frac{d_1 f_1}{d_1 - f_1} = \\frac{30 \\cdot 20}{30 - 20} = 60\\text{ cm}$ (ảnh thật); $k_1 = -\\frac{60}{30} = -2$.',
          'Bước 2: Khoảng cách từ $A_1B_1$ tới $L_2$: $d_2 = l - d_1\' = 45 - 60 = -15\\text{ cm}$ ($A_1B_1$ là vật ảo nằm sau $L_2$ đúng $15\\text{ cm}$).',
          'Bước 3: Qua $L_2$: $\\frac{1}{d_2\'} = \\frac{1}{f_2} - \\frac{1}{d_2} = \\frac{1}{-15} - \\frac{1}{-15} = 0 \\Rightarrow d_2\' = \\infty$! Chùm tia ló là chùm tia song song, ảnh cuối cùng ở vô cực.'
        ],
        finalAnswer: 'Ảnh $A_1B_1$ là vật ảo đặt đúng tại tiêu điểm ảnh của $L_2$ ($d_2 = -15\\text{ cm}$), nên ảnh cuối cùng $A_2B_2$ ở vô cực.'
      },
      {
        source: 'Chuyên Lí · Bài toán Vật – Màn – Thấu kính',
        question:
          'Vật sáng $AB$ cao $1\\text{ cm}$ đặt trước màn ảnh cách nhau $L = 100\\text{ cm}$. Giữa vật và màn đặt thấu kính hội tụ cho 2 vị trí ảnh rõ nét trên màn, biết ảnh lớn cao $4\\text{ cm}$. Tính chiều cao ảnh nhỏ và tiêu cự $f$ của thấu kính.',
        hints: ['Áp dụng tính thuận nghịch ánh sáng: $h_{\\text{vật}}^2 = h_1 \\cdot h_2$ và tỉ lệ $d_2 = d_1\'$.'],
        solutionSteps: [
          'Bước 1: Theo tính thuận nghịch: $|k_1 \\cdot k_2| = 1 \\Rightarrow h_1 \\cdot h_2 = AB^2 \\Rightarrow h_2 = \\frac{1^2}{4} = 0{,}25\\text{ cm}$.',
          'Bước 2: Khi cho ảnh lớn cao $4\\text{ cm}$: $\\frac{d\'}{d} = 4 \\Rightarrow d\' = 4d$. Mà $d + d\' = 100 \\Rightarrow 5d = 100 \\Rightarrow d = 20\\text{ cm}, d\' = 80\\text{ cm}$.',
          'Bước 3: Tiêu cự thấu kính: $f = \\frac{d d\'}{d + d\'} = \\frac{20 \\cdot 80}{100} = 16\\text{ cm}$.'
        ],
        finalAnswer: 'Ảnh nhỏ cao $0{,}25\\text{ cm}$; tiêu cự $f = 16\\text{ cm}$.'
      }
    ]
  },

  {
    id: 'phys-pro-5',
    track: 'chuyen',
    grade: 'Lớp 12',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Lí · Bậc 3: Chuyên / HSG Quốc Gia',
    sourceTag: 'Tuyển tập Đề Chuyên & HSG Quốc gia Vật lí',
    lessonNumber: 22,
    title: 'Con lắc vướng đinh, Dao động tắt dần & Chu trình Nhiệt động lực học',
    subtitle: 'Con lắc đơn vướng đinh đóng trên phương thẳng đứng, số lần qua VTCB khi có ma sát khô và công – hiệu suất chu trình Carnot/P-V',
    description:
      'Đỉnh cao Chuyên Lí tổng hợp: phân tích dao động bất đối xứng của con lắc vướng đinh, tính độ giảm biên độ sau mỗi chu kì và quãng đường đi được đến khi dừng hẳn trong dao động tắt dần, cùng bài toán tính công và hiệu suất chu trình nhiệt động.',
    theorySections: [
      {
        heading: '1. Con lắc vướng đinh',
        content:
          '• Con lắc đơn dài $l_1$ khi qua VTCB bị vướng đinh ở độ cao dưới điểm treo đoạn $d$, nửa chu kì bên kia dao động với chiều dài $l_2 = l_1 - d$.\n• Chu kì toàn phần của con lắc vướng đinh: $T = \\frac{T_1 + T_2}{2} = \\pi\\left(\\sqrt{\\frac{l_1}{g}} + \\sqrt{\\frac{l_2}{g}}\\right)$.\n• Khi bỏ qua ma sát, độ cao cực đại hai bên luôn bằng nhau ($h_1 = h_2$), nhưng góc lệch cực đại bên ngắn lớn hơn: $\\alpha_{2\\max} \\approx \\alpha_{1\\max}\\sqrt{\\frac{l_1}{l_2}}$.'
      },
      {
        heading: '2. Dao động tắt dần của Con lắc lò xo có ma sát khô',
        content:
          '• Vật dao động ngang có hệ số ma sát $\\mu$: Độ giảm biên độ sau mỗi **nửa chu kì** là $\\Delta A_{1/2} = \\frac{2\\mu m g}{k}$, sau **1 chu kì** là $\\Delta A = \\frac{4\\mu m g}{k}$.\n• Tổng quãng đường đi được từ lúc thả biên $A_0$ đến khi dừng hẳn (gần đúng theo định luật bảo toàn năng lượng): $S \\approx \\frac{k A_0^2}{2\\mu m g}$.'
      },
      {
        heading: '3. Chu trình Nhiệt động lực học & Hiệu suất Carnot',
        content:
          '• Công khí thực hiện trong cả chu trình khép kín bằng diện tích hình phẳng bao bởi đồ thị chu trình trên hệ trục $(p - V)$.\n• Hiệu suất động cơ nhiệt: $H = \\frac{A\'}{Q_{\\text{nhận}}} = 1 - \\frac{|Q_{\\text{tỏa}}|}{Q_{\\text{nhận}}} \\le H_{\\text{Carnot}} = 1 - \\frac{T_{\\text{lạnh}}}{T_{\\text{nóng}}}$.'
      }
    ],
    keyFormulas: [
      'T = \\pi\\left(\\sqrt{\\frac{l_1}{g}} + \\sqrt{\\frac{l_2}{g}}\\right)',
      '\\Delta A_{\\text{chu kì}} = \\frac{4\\mu mg}{k}, \\quad S_{\\max} \\approx \\frac{kA_0^2}{2\\mu mg}',
      'H_{\\text{Carnot}} = 1 - \\frac{T_2}{T_1}'
    ],
    simulationType: 'simple_pendulum',
    sim3dType: 'pendulum_spring',
    defaultParams: { length: 2.0, gravity: 9.8, theta0: 15 },
    paramBounds: {
      length: { min: 0.5, max: 4.0, step: 0.1, unit: 'm', label: 'Chiều dài dây l₁' },
      gravity: { min: 1.6, max: 15, step: 0.2, unit: 'm/s²', label: 'Gia tốc g' },
      theta0: { min: 5, max: 45, step: 1, unit: '°', label: 'Góc lệch ban đầu α₀' }
    },
    practiceExercises: [
      {
        source: 'HSG Vật lí · Con lắc vướng đinh',
        question:
          'Con lắc đơn dài $l_1 = 1\\text{ m}$ ($g = \\pi^2\\text{ m/s}^2$). Trên đường thẳng đứng qua điểm treo, tại vị trí cách điểm treo $75\\text{ cm}$ có đóng một chiếc đinh ($l_2 = 25\\text{ cm}$). Chu kì dao động nhỏ của con lắc vướng đinh là:',
        options: ['A. 1,5 s', 'B. 2,0 s', 'C. 1,0 s', 'D. 1,25 s'],
        correctIndex: 0,
        explanation:
          '$T_1 = 2\\pi\\sqrt{\\frac{1}{\\pi^2}} = 2\\text{ s}$; $T_2 = 2\\pi\\sqrt{\\frac{0{,}25}{\\pi^2}} = 1\\text{ s}$. Chu kì toàn phần $T = \\frac{T_1 + T_2}{2} = \\frac{2 + 1}{2} = 1{,}5\\text{ s}$.'
      },
      {
        source: 'Chuyên Lí · Dao động tắt dần',
        question:
          'Con lắc lò xo ngang gồm $k = 100\\text{ N/m}$, $m = 0{,}2\\text{ kg}$, hệ số ma sát $\\mu = 0{,}1$ ($g = 10\\text{ m/s}^2$). Kéo lệch biên độ $A_0 = 10\\text{ cm}$ rồi thả nhẹ. Độ giảm biên độ sau 1 chu kì đầu tiên là:',
        options: ['A. 0,8 cm', 'B. 0,4 cm', 'C. 1,6 cm', 'D. 0,2 cm'],
        correctIndex: 0,
        explanation:
          '$\\Delta A = \\frac{4\\mu m g}{k} = \\frac{4 \\cdot 0{,}1 \\cdot 0{,}2 \\cdot 10}{100} = 0{,}008\\text{ m} = 0{,}8\\text{ cm}$.'
      },
      {
        source: 'Chuyên Nhiệt động lực học',
        question:
          'Một động cơ nhiệt lý tưởng hoạt động theo chu trình Carnot giữa nguồn nóng $227^\\circ\\text{C}$ và nguồn lạnh $27^\\circ\\text{C}$. Hiệu suất cực đại của động cơ là:',
        options: ['A. 40%', 'B. 88%', 'C. 60%', 'D. 20%'],
        correctIndex: 0,
        explanation:
          'Đổi sang Kelvin: $T_1 = 500\\text{ K}$, $T_2 = 300\\text{ K}$. $H_{\\max} = 1 - \\frac{300}{500} = 0{,}4 = 40\\%$.'
      }
    ],
    essayExercises: [
      {
        source: 'Đề HSG · Dao động tắt dần chính xác',
        question:
          'Một con lắc lò xo nằm ngang có $k = 50\\text{ N/m}$, $m = 0{,}5\\text{ kg}$, hệ số ma sát $\\mu = 0{,}1$ ($g = 10\\text{ m/s}^2$). Kéo vật tới vị trí lò xo giãn $A_0 = 10\\text{ cm}$ rồi thả không vận tốc đầu. Tìm vận tốc cực đại của vật trong quá trình dao động và tổng quãng đường vật đi được đến lúc dừng.',
        hints: ['Vận tốc đạt cực đại khi vật đi qua VTCB tạm $x_0 = \\frac{\\mu m g}{k}$ ở nửa chu kì đầu tiên!'],
        solutionSteps: [
          'Bước 1: Tần số góc $\\omega = \\sqrt{\\frac{50}{0{,}5}} = 10\\text{ rad/s}$. Độ biến dạng tại VTCB tạm: $x_0 = \\frac{\\mu mg}{k} = \\frac{0{,}1 \\cdot 0{,}5 \\cdot 10}{50} = 0{,}01\\text{ m} = 1\\text{ cm}$.',
          'Bước 2: Ở nửa chu kì đầu, vật dao động quanh VTCB tạm với biên độ $A_1 = A_0 - x_0 = 10 - 1 = 9\\text{ cm}$. Vậy $v_{\\max} = \\omega A_1 = 10 \\cdot 9 = 90\\text{ cm/s} = 0{,}9\\text{ m/s}$.',
          'Bước 3: Quãng đường xấp xỉ: $N = \\lfloor \\frac{A_0}{2x_0} \\rfloor = \\frac{10}{2} = 5$ nửa chu kì, vật dừng đúng tại $x = 0$! Tổng quãng đường: $S = \\frac{k A_0^2}{2\\mu mg} = \\frac{50 \\cdot 0{,}1^2}{2 \\cdot 0{,}5} = 0{,}5\\text{ m} = 50\\text{ cm}$.'
        ],
        finalAnswer: '$v_{\\max} = 0{,}9\\text{ m/s}$; tổng quãng đường $S = 50\\text{ cm}$.'
      },
      {
        source: 'Đề Chuyên Lí · Chu trình p-V',
        question:
          '$1\\text{ mol}$ khí lí tưởng đơn nguyên tử thực hiện chu trình $1 \\to 2 \\to 3 \\to 1$ trên đồ thị $(p - V)$: $1 \\to 2$ giãn đẳng áp ở $p_1 = 2\\cdot 10^5\\text{ Pa}$ từ $V_1 = 2\\text{ lít}$ lên $V_2 = 6\\text{ lít}$; $2 \\to 3$ làm lạnh đẳng tích xuống $p_3 = 1\\cdot 10^5\\text{ Pa}$; $3 \\to 1$ nén tuyến tính theo đường thẳng về trạng thái 1. Tính công khí thực hiện sau 1 chu trình.',
        hints: ['Trên đồ thị $(p - V)$, chu trình $1\\to 2\\to 3\\to 1$ là một tam giác vuông chiều thuận kim đồng hồ. Công bằng diện tích tam giác!'],
        solutionSteps: [
          'Bước 1: Đổi thể tích sang $\\text{m}^3$: $V_1 = 2\\cdot 10^{-3}\\text{ m}^3$, $V_2 = 6\\cdot 10^{-3}\\text{ m}^3$.',
          'Bước 2: Chu trình chạy theo chiều kim đồng hồ nên công sinh ra dương ($A\' > 0$) và bằng diện tích tam giác vuông $123$.',
          'Bước 3: $A\' = \\frac{1}{2} (p_1 - p_3)(V_2 - V_1) = \\frac{1}{2}(2\\cdot 10^5 - 1\\cdot 10^5)(6 - 2)\\cdot 10^{-3} = 0{,}5 \\cdot 10^5 \\cdot 4\\cdot 10^{-3} = 200\\text{ J}$.'
        ],
        finalAnswer: 'Công khí sinh ra sau 1 chu trình: $A\' = 200\\text{ J}$.'
      }
    ]
  }
];
