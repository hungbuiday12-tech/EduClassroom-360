import { PhysicsLesson } from '../types';
import { PHYSICS_GDPT_10_LESSONS } from './physicsGdpt2018Grade10';
import { PHYSICS_GDPT_11_LESSONS } from './physicsGdpt2018Grade11';
import { PHYSICS_GDPT_12_LESSONS } from './physicsGdpt2018Grade12';
import { PHYSICS_GDPT_ELECTIVES } from './physicsGdpt2018Electives';
import { PHYSICS_EXTRA_10_LESSONS } from './physicsExtra10Lessons';

export const PHYSICS_LESSONS: PhysicsLesson[] = [
  // ============================================================================
  // KHU KHÔNG CHUYÊN — CHUẨN CHƯƠNG TRÌNH GDPT 2018 (KHTN 9 & VẬT LÍ 10–12)
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
      'Tổng hợp trọn vẹn kiến thức Cơ học và Nhiệt học trọng tâm lớp 9: hiểu đúng cách tính vận tốc trung bình trên từng chặng đường, công – công suất, sự chuyển hóa giữa động năng – thế năng và nhiệt lượng $Q = m c \\Delta t$.',
    theorySections: [
      {
        heading: '1. Vận tốc trung bình, Công và Công suất',
        content:
          '• Vận tốc trung bình trên cả hành trình: $v_{tb} = \\frac{s_1 + s_2 + \\dots}{t_1 + t_2 + \\dots}$ (Lưu ý: chỉ tính tổng quãng đường chia tổng thời gian; không lấy trung bình cộng $v_1, v_2$ khi thời gian đi mỗi chặng khác nhau!).\n• Công cơ học khi lực $F$ kéo vật dịch chuyển đoạn $s$ theo hướng lực: $A = F \\cdot s$ (đơn vị Jun, $1\\text{ J} = 1\\text{ N}\\cdot\\text{m}$).\n• Công suất cho biết lực thực hiện công nhanh hay chậm trong $1\\text{ giây}$: $P = \\frac{A}{t} = F \\cdot v$ (đơn vị Oát, $1\\text{ W} = 1\\text{ J/s}$).'
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
          '• Mỗi đại lượng vectơ ($\\vec{v}, \\vec{a}, \\vec{F}$) gồm 4 yếu tố: **Điểm đặt, Phương, Chiều, Độ lớn**.\n• Quy tắc hình bình hành: Tổng hai vectơ đồng quy $\\vec{F} = \\vec{F}_1 + \\vec{F}_2$ là đường chéo hình bình hành, độ lớn:\n  $$F = \\sqrt{F_1^2 + F_2^2 + 2F_1 F_2\\cos\\alpha}$$\n• Chiếu vectơ $\\vec{a}$ lên trục $Ox$: Nếu $\\vec{a}$ cùng chiều $Ox$ lấy $+a$; ngược chiều lấy $-a$; hợp góc $\\alpha$ lấy $a\\cos\\alpha$; vuông góc $Ox$ bằng $0$.'
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
      f2: { min: 10, max: 50, step: 2, unit: 'N', label: 'Độ lớn F₂' },
      v0: { min: 0, max: 15, step: 0.5, unit: 'm/s', label: 'Vận tốc v₀' },
      accel: { min: -5, max: 6, step: 0.5, unit: 'm/s²', label: 'Gia tốc a' }
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

  // ---------- CHƯƠNG TRÌNH GDPT 2018: VẬT LÍ 10 · 11 · 12 (ĐẦY ĐỦ TỪNG BÀI) ----------
  ...PHYSICS_GDPT_10_LESSONS,
  ...PHYSICS_GDPT_11_LESSONS,
  ...PHYSICS_GDPT_12_LESSONS,

  // ---------- BỔ SUNG ĐẦY ĐỦ CHƯƠNG TRÌNH VIETJACK LÍ 9–12 ----------
  {
    id: 'phys-9-energy-refract',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'Hệ thống kiến thức Lớp 9 · Quang học & Năng lượng Ánh sáng',
    sourceTag: 'SGK KHTN 9 (KNTT / CTST / Cánh Diều) · VietJack',
    lessonNumber: 18,
    title: 'Tán sắc Ánh sáng qua Lăng kính, Màu sắc & Bảo toàn Năng lượng (Lớp 9)',
    subtitle: 'Sự khúc xạ qua lăng kính, phân tích ánh sáng trắng thành quang phổ, hiệu ứng màu sắc và bảo toàn năng lượng',
    description:
      'Hoàn thiện chương trình KHTN 9 VietJack: giải thích hiện tượng tán sắc ánh sáng trắng qua lăng kính (từ đỏ đến tím), sự hấp thụ – phản xạ màu sắc của các vật và định luật bảo toàn năng lượng trong thực tiễn.',
    theorySections: [
      {
        heading: '1. Hiện tượng Tán sắc ánh sáng qua Lăng kính',
        content:
          '• Khi chiếu chùm sáng trắng hẹp qua lăng kính thủy tinh, tia sáng bị lệch về phía đáy lăng kính và tách thành dải màu liên tục từ **Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím**.\n• Nguyên nhân: Chiết suất của thủy tinh đối với ánh sáng đơn sắc khác nhau là khác nhau ($n_{\\text{đỏ}} < n_{\\text{tím}}$), nên tia đỏ lệch ít nhất và tia tím lệch nhiều nhất.'
      },
      {
        heading: '2. Ánh sáng đơn sắc & Màu sắc các vật',
        content:
          '• Ánh sáng đơn sắc là ánh sáng có một màu nhất định và không bị tán sắc khi truyền qua lăng kính.\n• Một vật có màu nào dưới ánh sáng trắng vì vật đó phản xạ mạnh ánh sáng màu đó và hấp thụ các màu còn lại (vật màu đen hấp thụ hầu hết ánh sáng).'
      },
      {
        heading: '3. Năng lượng Tái tạo & Hiệu suất sử dụng Năng lượng',
        content:
          '• Năng lượng không tự sinh ra và không tự mất đi, chỉ chuyển hóa từ dạng này sang dạng khác hoặc truyền từ vật này sang vật khác.\n• Hiệu suất năng lượng: $H = \\frac{W_{\\text{có ích}}}{W_{\\text{toàn phần}}} \\cdot 100\\% < 100\\%$.'
      }
    ],
    keyFormulas: [
      'n_1 \\sin i = n_2 \\sin r \\quad (n_{\\text{đỏ}} < n_{\\text{tím}})',
      'H = \\frac{W_{\\text{ích}}}{W_{\\text{tp}}} \\cdot 100\\%'
    ],
    simulationType: 'prism_dispersion',
    sim3dType: 'prism_dispersion_3d',
    defaultParams: { apexAngle: 60, incidenceDeg: 42, glassDisp: 1.52 },
    paramBounds: {
      apexAngle: { min: 30, max: 75, step: 5, unit: '°', label: 'Góc chiết quang A' },
      incidenceDeg: { min: 15, max: 80, step: 1, unit: '°', label: 'Góc tới i' },
      glassDisp: { min: 1.33, max: 1.85, step: 0.02, unit: '', label: 'Chiết suất nền n' }
    },
    practiceExercises: [
      {
        source: 'VietJack · KHTN 9 KNTT',
        question: 'Khi chiếu chùm ánh sáng trắng hẹp đi qua một lăng kính thủy tinh, tia sáng bị lệch về phía đáy ít nhất là tia màu:',
        options: ['A. Đỏ', 'B. Vàng', 'C. Lục', 'D. Tím'],
        correctIndex: 0,
        explanation: 'Trong thủy tinh, ánh sáng đỏ có chiết suất nhỏ nhất ($n_{\\text{đỏ}} < \\dots < n_{\\text{tím}}$) nên bị khúc xạ lệch ít nhất, còn tia tím lệch nhiều nhất.'
      },
      {
        source: 'Loigiaihay · KHTN 9 CTST',
        question: 'Dưới ánh sáng mặt trời (ánh sáng trắng), một bông hoa hồng nhung có màu đỏ là do:',
        options: [
          'A. Cánh hoa phản xạ tốt ánh sáng đỏ và hấp thụ các ánh sáng màu khác',
          'B. Cánh hoa tự phát ra ánh sáng đỏ',
          'C. Cánh hoa hấp thụ toàn bộ ánh sáng đỏ',
          'D. Cánh hoa truyền thẳng ánh sáng xanh'
        ],
        correctIndex: 0,
        explanation: 'Vật màu đỏ phản xạ mạnh thành phần ánh sáng đỏ trong ánh sáng trắng chiếu tới mắt người quan sát.'
      }
    ],
    essayExercises: [
      {
        source: 'VietJack · Tự luận KHTN 9',
        question: 'Chiếu một tia sáng đơn sắc từ không khí ($n_1 = 1$) vào thủy tinh chiết suất $n_2 = 1{,}5$ dưới góc tới $i = 45^\\circ$. Tính góc khúc xạ $r$ và góc lệch $D = |i - r|$ tại mặt phân cách.',
        hints: ['Áp dụng định luật khúc xạ $\\sin r = \\frac{n_1}{n_2}\\sin i$.'],
        solutionSteps: [
          'Bước 1: $1 \\cdot \\sin 45^\\circ = 1{,}5 \\cdot \\sin r \\implies \\sin r = \\frac{\\sqrt{2}/2}{1{,}5} \\approx 0{,}4714$.',
          'Bước 2: Suy ra $r \\approx 28{,}1^\\circ$ và góc lệch tia sáng $D = 45^\\circ - 28{,}1^\\circ = 16{,}9^\\circ$.'
        ],
        finalAnswer: '$r \\approx 28{,}1^\\circ$; góc lệch $D \\approx 16{,}9^\\circ$.'
      }
    ]
  },

  // ---------- CHUYÊN ĐỀ HỌC TẬP VẬT LÍ 10 · 11 · 12 (GDPT 2018) ----------
  ...PHYSICS_GDPT_ELECTIVES,

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
    simulationType: 'inclined_plane',
    sim3dType: 'inclined_plane_3d',
    defaultParams: { angle: 30, mu: 0.2, mass: 3 },
    paramBounds: {
      angle: { min: 5, max: 65, step: 1, unit: '°', label: 'Góc nêm α' },
      mu: { min: 0, max: 0.8, step: 0.05, unit: '', label: 'Hệ số ma sát μ' },
      mass: { min: 1, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng vật m' }
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
    simulationType: 'atwood_pulley',
    sim3dType: 'atwood_pulley_3d',
    defaultParams: { m1: 2, m2: 3.5, g: 9.8 },
    paramBounds: {
      m1: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng m₁' },
      m2: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng m₂' },
      g: { min: 1.6, max: 15, step: 0.2, unit: 'm/s²', label: 'Gia tốc rơi tự do g' }
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
    simulationType: 'wheatstone_bridge',
    sim3dType: 'helmholtz_coils_3d',
    defaultParams: { voltage: 24, r1: 12, r2: 12, r3: 8, r4: 8 },
    paramBounds: {
      voltage: { min: 6, max: 36, step: 2, unit: 'V', label: 'Hiệu điện thế U_AB' },
      r1: { min: 2, max: 40, step: 2, unit: 'Ω', label: 'Nhánh R₁' },
      r2: { min: 2, max: 40, step: 2, unit: 'Ω', label: 'Nhánh R₂' },
      r3: { min: 2, max: 40, step: 2, unit: 'Ω', label: 'Nhánh R₃' },
      r4: { min: 2, max: 40, step: 2, unit: 'Ω', label: 'Nhánh R₄' }
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
          'Cho mạch cầu AB có 4 cạnh mắc hai đầu nguồn $U_{AB} = 30\\text{ V}$ với $R_{AC} = 10\\,\\Omega$, $R_{CB} = 20\\,\\Omega$, $R_{AD} = 20\\,\\Omega$, $R_{DB} = 10\\,\\Omega$. Giữa hai điểm C và D mắc một Ampe kế lý tưởng ($R_A = 0$). Hãy tính số chỉ và chiều dòng điện qua Ampe kế.',
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
    simulationType: 'telescope_microscope',
    sim3dType: 'double_lens_microscope_3d',
    defaultParams: { f1Cm: 14, f2Cm: 10, objDistCm: 22 },
    paramBounds: {
      f1Cm: { min: 5, max: 30, step: 1, unit: 'cm', label: 'Tiêu cự Vật kính f₁' },
      f2Cm: { min: 4, max: 25, step: 1, unit: 'cm', label: 'Tiêu cự Thị kính f₂' },
      objDistCm: { min: 8, max: 60, step: 1, unit: 'cm', label: 'Khoảng cách vật d₁' }
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
    sim3dType: 'simple_pendulum_3d',
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
  },
  {
    id: 'phys-doppler-effect',
    lessonNumber: 16,
    title: 'Hiệu ứng Doppler & Sóng xung kích Mach: Nguồn sóng chuyển động',
    subtitle: 'Chuyên Lí Sóng âm · Độ nén bước sóng & Nón Mach',
    grade: 'Lớp 11',
    track: 'chuyen',
    tier: 'Nâng cao',
    stageLabel: 'Khu Chuyên Lí · Bậc 2: Nâng cao Chuyên · Sóng âm & Doppler',
    sourceTag: 'Bồi dưỡng Chuyên Lí · Lab 2D & 3D Doppler',
    description:
      'Giải thích trực quan sự thay đổi bước sóng và cao độ âm thanh khi nguồn phát chuyển động (như tiếng còi xe cứu thương lao tới rồi đi xa), cùng cơ chế hình thành nón sóng xung kích khi bay vượt tốc độ âm thanh.',
    theorySections: [
      {
        heading: '1. Độ nén mặt sóng & Công thức Doppler',
        content: 'Khi nguồn âm vừa phát ra sóng vừa chạy đuổi theo sóng đó về phía người nghe đứng yên với tốc độ $v_s < v$, các gợn sóng phía trước bị ép sát vào nhau nên bước sóng ngắn lại: $\\lambda\' = \\lambda\\left(1 - \\frac{v_s}{v}\\right)$, làm tần số âm nghe được cao (bổng) hơn bình thường.'
      },
      {
        heading: '2. Nón sóng Mach khi $v_s \\ge v$',
        content: 'Khi nguồn phát chuyển động nhanh hơn tốc độ âm thanh ($M = v_s/v > 1$), các mặt cầu sóng xếp chồng lên nhau tạo thành mặt nón sóng xung kích (gây tiếng nổ siêu thanh) với nửa góc mở $\\sin\\theta = \\frac{v}{v_s} = \\frac{1}{M}$.'
      }
    ],
    keyFormulas: [
      "f'_{\\text{lại gần}} = f_0 \\frac{v}{v - v_s}",
      "f''_{\\text{ra xa}} = f_0 \\frac{v}{v + v_s}",
      '\\sin\\theta_{\\text{Mach}} = \\frac{v}{v_s}'
    ],
    simulationType: 'doppler_effect',
    sim3dType: 'doppler_effect_3d',
    defaultParams: { waveSpeed: 340, sourceSpeed: 140, sourceFreq: 440 },
    paramBounds: {
      waveSpeed: { min: 150, max: 500, step: 10, unit: 'm/s', label: 'Tốc độ truyền sóng v' },
      sourceSpeed: { min: 0, max: 520, step: 10, unit: 'm/s', label: 'Tốc độ nguồn phát v_s' },
      sourceFreq: { min: 150, max: 800, step: 10, unit: 'Hz', label: 'Tần số gốc nguồn f₀' }
    },
    practiceExercises: [
      {
        source: 'Chuyên Lí · Hiệu ứng Doppler âm thanh',
        question:
          'Một xe cứu thương phát còi tần số $f_0 = 600\\text{ Hz}$ chạy thẳng lại gần người đứng yên với tốc độ $v_s = 34\\text{ m/s}$ (tốc độ âm $v = 340\\text{ m/s}$). Tần số người đó nghe được gần nhất với:',
        options: ['A. 666,7 Hz', 'B. 545,5 Hz', 'C. 634,0 Hz', 'D. 720,0 Hz'],
        correctIndex: 0,
        explanation: "$f' = f_0 \\frac{v}{v - v_s} = 600 \\cdot \\frac{340}{340 - 34} = 600 \\cdot \\frac{340}{306} \\approx 666{,}7\\text{ Hz}$."
      }
    ],
    essayExercises: [
      {
        source: 'Chuyên đề Sóng siêu thanh · Góc nón Mach',
        question:
          'Một máy bay siêu thanh bay ngang ở độ cao không đổi với tốc độ $v_s = 680\\text{ m/s}$ trong không khí có tốc độ âm $v = 340\\text{ m/s}$. Tính số Mach và nửa góc mở của nón sóng xung kích.',
        hints: ['Tính số Mach $M = v_s / v$, sau đó áp dụng $\\sin\\theta = 1/M$.'],
        solutionSteps: [
          'Bước 1: Số Mach $M = \\frac{v_s}{v} = \\frac{680}{340} = 2$.',
          'Bước 2: $\\sin\\theta = \\frac{1}{M} = \\frac{1}{2} \\Rightarrow \\theta = 30^\\circ$.'
        ],
        finalAnswer: 'Số Mach $M = 2$; nửa góc mở nón sóng xung kích $\\theta = 30^\\circ$.'
      }
    ]
  },
  {
    id: 'phys-9-induction-ac',
    lessonNumber: 26,
    title: 'Cảm ứng Điện từ, Dòng điện Xoay chiều & Máy biến áp Lớp 9',
    subtitle: 'KHTN 9 · Điều kiện xuất hiện dòng điện cảm ứng & Truyền tải điện năng đi xa',
    grade: 'Lớp 9',
    track: 'khong_chuyen',
    stageLabel: 'Điện Từ Học · KHTN Lớp 9 (CT Mới)',
    sourceTag: 'Chuẩn SGK KHTN 9 (KNTT / CTST / Cánh Diều) · Lab 2D & 3D',
    description:
      'Khảo sát sự biến thiên số đường sức từ qua cuộn dây kín tạo dòng điện cảm ứng, nguyên tắc tạo dòng điện xoay chiều và công thức máy biến áp giảm hao phí truyền tải điện.',
    theorySections: [
      {
        heading: '1. Hiện tượng Cảm ứng điện từ & Dòng điện cảm ứng',
        content:
          '• Khi số đường sức từ xuyên qua tiết diện $S$ của một cuộn dây dẫn kín **biến thiên** (tăng hoặc giảm), trong cuộn dây xuất hiện dòng điện cảm ứng.\n• Nếu đảo cực nam châm hoặc đổi từ đưa vào sang rút ra, chiều dòng điện cảm ứng bị đảo ngược → sinh ra **dòng điện xoay chiều**.'
      },
      {
        heading: '2. Máy biến áp & Truyền tải điện năng đi xa',
        content:
          '• Công thức máy biến áp lý tưởng: $\\frac{U_1}{U_2} = \\frac{N_1}{N_2}$ ($N_1, N_2$ là số vòng cuộn sơ cấp và thứ cấp).\n• Công suất hao phí do tỏa nhiệt trên đường dây tải điện: $\\Delta P = R_{\\text{dây}} \\cdot \\frac{P^2}{U^2}$. Muốn giảm hao phí $n^2$ lần, ta dùng máy tăng áp để tăng hiệu điện thế $U$ lên $n$ lần trước khi truyền tải!'
      }
    ],
    keyFormulas: [
      '\\frac{U_1}{U_2} = \\frac{N_1}{N_2}',
      '\\Delta P_{\\text{hao phí}} = I^2 R = \\frac{P^2 R}{U^2}'
    ],
    simulationType: 'magnetic_induction',
    sim3dType: 'ac_generator_3d',
    defaultParams: { turns: 20, B: 1.4, velocity: 4.5 },
    paramBounds: {
      turns: { min: 5, max: 40, step: 1, unit: 'vòng', label: 'Số vòng dây N' },
      B: { min: 0.4, max: 3.0, step: 0.1, unit: 'T', label: 'Cảm ứng từ B' },
      velocity: { min: 1.0, max: 10.0, step: 0.5, unit: 'm/s', label: 'Tốc độ di chuyển nam châm' }
    },
    practiceExercises: [
      {
        source: 'KHTN 9 · Máy biến áp',
        question:
          'Một máy biến áp có cuộn sơ cấp $500$ vòng đặt vào hiệu điện thế $220\\text{ V}$. Muốn lấy ra hiệu điện thế $11\\text{ V}$ ở cuộn thứ cấp thì số vòng cuộn thứ cấp là:',
        options: ['A. 25 vòng', 'B. 10 000 vòng', 'C. 50 vòng', 'D. 100 vòng'],
        correctIndex: 0,
        explanation:
          'Áp dụng $\\frac{N_2}{N_1} = \\frac{U_2}{U_1} \\Rightarrow N_2 = 500 \\cdot \\frac{11}{220} = 25$ vòng.'
      },
      {
        source: 'KHTN 9 · Truyền tải điện',
        question:
          'Khi tăng hiệu điện thế ở nơi phát điện lên $10$ lần (giữ nguyên công suất phát và điện trở dây), công suất hao phí trên đường dây tải điện sẽ:',
        options: ['A. Giảm 100 lần', 'B. Giảm 10 lần', 'C. Tăng 100 lần', 'D. Không đổi'],
        correctIndex: 0,
        explanation: 'Vì $\\Delta P = \\frac{P^2 R}{U^2}$ tỉ lệ nghịch với $U^2$, tăng $U$ lên $10$ lần thì hao phí giảm $10^2 = 100$ lần.'
      }
    ],
    essayExercises: [
      {
        source: 'Tự luận KHTN 9 · Truyền tải điện năng',
        question:
          'Một trạm phát điện truyền đi công suất $P = 100\\text{ kW}$ trên đường dây có tổng điện trở $R = 8\\,\\Omega$. Tính công suất hao phí khi truyền ở $U_1 = 2\\text{ kV}$ và khi dùng máy tăng áp lên $U_2 = 20\\text{ kV}$.',
        hints: ['Áp dụng $\\Delta P = \\frac{P^2 R}{U^2}$ (nhớ đổi $100\\text{ kW} = 10^5\\text{ W}$ và kV sang V).'],
        solutionSteps: [
          'Bước 1: Ở $U_1 = 2000\\text{ V}$: $\\Delta P_1 = \\frac{(10^5)^2 \\cdot 8}{2000^2} = \\frac{8\\cdot 10^{10}}{4\\cdot 10^6} = 20\\,000\\text{ W} = 20\\text{ kW}$.',
          'Bước 2: Ở $U_2 = 20\\,000\\text{ V}$ (tăng 10 lần): $\\Delta P_2 = \\frac{20\\text{ kW}}{10^2} = 0{,}2\\text{ kW} = 200\\text{ W}$.'
        ],
        finalAnswer: 'Hao phí giảm từ $20\\text{ kW}$ xuống còn $0{,}2\\text{ kW}$ (200 W).'
      }
    ]
  },
  {
    id: 'phys-9-power-bill',
    lessonNumber: 27,
    title: 'Động năng, Thế năng & Hiệu suất Máy cơ đơn giản (KHTN 9)',
    subtitle: 'KHTN 9 · Chuyển hóa cơ năng, Mặt phẳng nghiêng, Ròng rọc & Hiệu suất H',
    grade: 'Lớp 9',
    track: 'khong_chuyen',
    stageLabel: 'Cơ Học Tổng Hợp · KHTN Lớp 9 (CT Mới)',
    sourceTag: 'Chuẩn SGK KHTN 9 · Mô phỏng Cơ năng 2D & 3D',
    description:
      'Phân tích sâu công có ích $A_{\\text{ích}} = P\\cdot h$, công toàn phần $A_{\\text{tp}} = F\\cdot s$, hiệu suất máy cơ $H = \\frac{A_{\\text{ích}}}{A_{\\text{tp}}}\\cdot 100\\%$ và bài toán chuyển hóa động – thế năng.',
    theorySections: [
      {
        heading: '1. Công có ích, Công toàn phần & Hiệu suất',
        content:
          '• Khi kéo vật khối lượng $m$ lên độ cao $h$ bằng mặt phẳng nghiêng dài $l$ với lực kéo $F$: công có ích $A_i = P \\cdot h = 10mh$, công toàn phần $A_{tp} = F \\cdot l$.\n• Công hao phí do ma sát: $A_{hp} = F_{ms} \\cdot l = A_{tp} - A_i$. Hiệu suất: $H = \\frac{A_i}{A_{tp}} \\cdot 100\\%$.'
      },
      {
        heading: '2. Sự chuyển hóa giữa Động năng và Thế năng',
        content:
          '• Công thức Động năng $W_{\\text{đ}} = \\frac{1}{2}mv^2$ và Thế năng trọng trường $W_t = P \\cdot h$.\n• Khi vật rơi từ độ cao $h_0$: thế năng giảm dần, động năng tăng dần; nếu không có lực cản thì tổng $W = W_{\\text{đ}} + W_t$ không đổi.'
      }
    ],
    keyFormulas: [
      'A_i = P \\cdot h, \\quad A_{tp} = F \\cdot s',
      'H = \\frac{A_i}{A_{tp}} \\cdot 100\\%',
      'W = \\frac{1}{2}mv^2 + mgh'
    ],
    simulationType: 'atwood_pulley',
    sim3dType: 'atwood_pulley_3d',
    defaultParams: { m1: 2.5, m2: 4.0, g: 9.8 },
    paramBounds: {
      m1: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng m₁' },
      m2: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng m₂' },
      g: { min: 1.6, max: 15, step: 0.2, unit: 'm/s²', label: 'Gia tốc trọng trường g' }
    },
    practiceExercises: [
      {
        source: 'KHTN 9 · Hiệu suất mặt phẳng nghiêng',
        question:
          'Dùng mặt phẳng nghiêng dài $4\\text{ m}$ kéo đều một thùng hàng nặng $600\\text{ N}$ lên cao $1{,}2\\text{ m}$ với lực kéo $F = 240\\text{ N}$. Hiệu suất của mặt phẳng nghiêng là:',
        options: ['A. 75%', 'B. 80%', 'C. 60%', 'D. 62,5%'],
        correctIndex: 0,
        explanation:
          'Công có ích $A_i = 600 \\cdot 1{,}2 = 720\\text{ J}$; công toàn phần $A_{tp} = 240 \\cdot 4 = 960\\text{ J}$. Hiệu suất $H = \\frac{720}{960} \\cdot 100\\% = 75\\%$.'
      },
      {
        source: 'KHTN 9 · Động năng & Thế năng',
        question: 'Một ô tô khối lượng $1{,}2\\text{ tấn}$ chạy với tốc độ $10\\text{ m/s}$ trên đường ngang có động năng bằng:',
        options: ['A. 60 kJ', 'B. 120 kJ', 'C. 6 kJ', 'D. 600 J'],
        correctIndex: 0,
        explanation: '$W_{\\text{đ}} = \\frac{1}{2}mv^2 = 0{,}5 \\cdot 1200 \\cdot 10^2 = 60\\,000\\text{ J} = 60\\text{ kJ}$.'
      }
    ],
    essayExercises: [
      {
        source: 'Tự luận KHTN 9 · Cơ năng & Ma sát',
        question:
          'Kéo đều một vật khối lượng $50\\text{ kg}$ lên sàn xe cao $1{,}5\\text{ m}$ bằng tấm ván dài $5\\text{ m}$ ($g = 10\\text{ m/s}^2$). Biết lực ma sát giữa vật và ván là $F_{ms} = 50\\text{ N}$. Tính lực kéo $F$ và hiệu suất tấm ván.',
        hints: ['Tính $A_i = 10mh$, $A_{hp} = F_{ms} \\cdot l$, suy ra $A_{tp} = A_i + A_{hp} = F \\cdot l$.'],
        solutionSteps: [
          'Bước 1: Công có ích $A_i = 50 \\cdot 10 \\cdot 1{,}5 = 750\\text{ J}$.',
          'Bước 2: Công thắng ma sát $A_{hp} = 50 \\cdot 5 = 250\\text{ J}$.',
          'Bước 3: Công toàn phần $A_{tp} = 750 + 250 = 1000\\text{ J} \\Rightarrow F = \\frac{1000}{5} = 200\\text{ N}$.',
          'Bước 4: Hiệu suất $H = \\frac{750}{1000} \\cdot 100\\% = 75\\%$.'
        ],
        finalAnswer: 'Lực kéo $F = 200\\text{ N}$, hiệu suất $H = 75\\%$.'
      }
    ]
  },
  ...PHYSICS_EXTRA_10_LESSONS,
];
