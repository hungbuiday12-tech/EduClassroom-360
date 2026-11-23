import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const SRC_9 = 'GDPT 2018 (Thông tư 32/2018) · KHTN 9 — Vật lí (KNTT · CTST · Cánh Diều)';

export const PHYSICS_GDPT_9_LESSONS: PhysicsLesson[] = [
  {
    id: 'phys-9-b1',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Mở đầu',
    sourceTag: SRC_9,
    lessonNumber: 1,
    title: 'Bài 1: Nhận biết dụng cụ đo điện, quang & An toàn thực hành KHTN 9',
    subtitle: 'Ampe kế, Vôn kế, biến áp nguồn, bộ thí nghiệm quang học và quy tắc xử lý sai số phép đo',
    description:
      'Làm quen bộ dụng cụ đo điện, giá quang học trong phòng thí nghiệm KHTN 9 và phương pháp ghi số liệu, tính sai số thực nghiệm.',
    theorySections: [
      {
        heading: '1. Dụng cụ đo điện & Biến áp nguồn',
        content:
          '• Ampe kế mắc nối tiếp đo cường độ dòng điện I (A); Vôn kế mắc song song đo hiệu điện thế U (V).\n• Chọn đúng thang đo lớn hơn giá trị ước lượng và ngắt nguồn trước khi đấu dây.'
      },
      {
        heading: '2. Bộ dụng cụ Quang học & Sai số phép đo',
        content:
          '• Băng quang học gồm đèn chiếu, vật sáng, thấu kính và màn hứng đặt đồng trục.\n• Đo lặp lại nhiều lần, tính giá trị trung bình $\\bar{x} = \\frac{x_1 + \\dots + x_n}{n}$ để giảm sai số ngẫu nhiên.'
      }
    ],
    keyFormulas: ['\\bar{x} = \\frac{x_1 + x_2 + \\dots + x_n}{n}', '\\Delta x = |x_i - \\bar{x}|'],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Để đo hiệu điện thế hai đầu bóng đèn, vôn kế phải được mắc như thế nào?',
        options: ['A. Nối tiếp với đèn', 'B. Song song với hai đầu đèn', 'C. Nối tắt hai cực nguồn', 'D. Không cần đúng cực'],
        correctIndex: 1,
        explanation: 'Vôn kế có điện trở rất lớn, luôn mắc song song với đoạn mạch cần đo hiệu điện thế.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Nêu 2 lưu ý quan trọng khi sử dụng biến áp nguồn và băng quang học KHTN 9.',
        hints: ['Kiểm tra thang điện áp DC/AC và trục đồng tâm thấu kính.'],
        solutionSteps: ['1. Chỉnh núm biến áp nguồn về mức 0 V trước khi bật công tắc.', '2. Căn tâm đèn, vật sáng và thấu kính nằm trên cùng trục chính.'],
        finalAnswer: 'Đặt nguồn mức thấp nhất khi lắp mạch và căn đồng trục quang học.'
      }
    ]
  },
  {
    id: 'phys-9-mech-heat',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Năng lượng & Cơ học',
    sourceTag: SRC_9,
    lessonNumber: 2,
    title: 'Bài 2: Động năng và Thế năng trọng trường',
    subtitle: 'Phân tích công thức động năng W_đ = 1/2 mv², thế năng W_t = Ph và sự phụ thuộc vận tốc, độ cao',
    description:
      'Khám phá hai dạng năng lượng cơ học cơ bản của vật chuyển động và vật ở độ cao h trong trường trọng lực Trái Đất.',
    theorySections: [
      {
        heading: '1. Động năng',
        content:
          '• Vật có khối lượng $m$ đang chuyển động với tốc độ $v$ sở hữu động năng $W_{\\text{đ}} = \\frac{1}{2}mv^2$ (J).\n• Động năng tỉ lệ thuận với khối lượng và bình phương tốc độ.'
      },
      {
        heading: '2. Thế năng trọng trường',
        content:
          '• Vật có trọng lượng $P = 10m$ ở độ cao $h$ so với mốc thế năng có thế năng $W_t = Ph = mgh$ (J).'
      }
    ],
    keyFormulas: ['W_{\\text{đ}} = \\frac{1}{2}mv^2', 'W_t = P \\cdot h = mgh'],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Nếu tốc độ của một ô tô tăng gấp đôi thì động năng của ô tô thay đổi thế nào?',
        options: ['A. Tăng 2 lần', 'B. Tăng 4 lần', 'C. Giảm 2 lần', 'D. Không đổi'],
        correctIndex: 1,
        explanation: 'Vì W_đ = 1/2 mv² tỉ lệ với v², khi v tăng 2 lần thì W_đ tăng 2² = 4 lần.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Tính động năng và thế năng của vật khối lượng 2 kg thả ở độ cao 5 m khi tốc độ đạt 6 m/s (lấy g = 10 m/s²).',
        hints: ['Áp dụng trực tiếp W_đ = 1/2 mv² và W_t = mgh.'],
        solutionSteps: ['W_đ = 0,5 · 2 · 6² = 36 J.', 'W_t = 2 · 10 · 5 = 100 J.'],
        finalAnswer: 'W_đ = 36 J; W_t = 100 J.'
      }
    ]
  },
  {
    id: 'phys-9-power-bill',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Năng lượng & Cơ học',
    sourceTag: SRC_9,
    lessonNumber: 3,
    title: 'Bài 3: Cơ năng và Định luật Bảo toàn Cơ năng',
    subtitle: 'Chuyển hóa qua lại giữa động năng và thế năng, bảo toàn cơ năng khi bỏ qua lực cản',
    description:
      'Tìm hiểu khái niệm cơ năng toàn phần W = W_đ + W_t và phân tích dao động con lắc, vật rơi khi có hoặc không có ma sát.',
    theorySections: [
      {
        heading: '1. Cơ năng và chuyển hóa năng lượng',
        content:
          '• Tổng động năng và thế năng gọi là cơ năng: $W = W_{\\text{đ}} + W_t$.\n• Trong quá trình chuyển động, động năng và thế năng có thể chuyển hóa qua lại lẫn nhau.'
      },
      {
        heading: '2. Bảo toàn & hao phí cơ năng',
        content:
          '• Khi không có ma sát hay lực cản không khí, cơ năng được bảo toàn.\n• Khi có ma sát, một phần cơ năng chuyển hóa thành nhiệt năng làm nóng vật và môi trường.'
      }
    ],
    keyFormulas: ['W = W_{\\text{đ}} + W_t = \\frac{1}{2}mv^2 + mgh', 'W_{\\text{trước}} = W_{\\text{sau}} \\text{ (không ma sát)}'],
    ...SIM_PRESETS.pendulum,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Khi quả cầu con lắc đi từ vị trí cao nhất xuống vị trí thấp nhất (bỏ qua lực cản), đại lượng nào tăng lên?',
        options: ['A. Thế năng trọng trường', 'B. Động năng', 'C. Cơ năng toàn phần', 'D. Khối lượng'],
        correctIndex: 1,
        explanation: 'Độ cao giảm nên thế năng chuyển hóa dần thành động năng khiến tốc độ và động năng tăng.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Thả rơi tự do vật 1 kg từ độ cao 20 m (g = 10 m/s²). Tính tốc độ vật ngay khi chạm đất.',
        hints: ['Bảo toàn cơ năng: mgh = 1/2 mv².'],
        solutionSteps: ['v = √(2gh) = √(2 · 10 · 20) = 20 m/s.'],
        finalAnswer: 'v = 20 m/s.'
      }
    ]
  },
  {
    id: 'phys-9-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Năng lượng & Cơ học',
    sourceTag: SRC_9,
    lessonNumber: 4,
    title: 'Bài 4: Công cơ học và Công suất',
    subtitle: 'Điều kiện sinh công A = F·s, tốc độ sinh công P = A/t = F·v và hiệu suất máy cơ',
    description:
      'Phân tích bản chất vật lí của công cơ học, công suất định mức thiết bị và cách tính hiệu suất khi có ma sát.',
    theorySections: [
      {
        heading: '1. Công cơ học',
        content:
          '• Lực $F$ không đổi làm vật dịch chuyển quãng đường $s$ theo hướng lực thực hiện công $A = F\\cdot s$ (1 J = 1 N·m).'
      },
      {
        heading: '2. Công suất',
        content:
          '• Công suất đặc trưng cho tốc độ thực hiện công: $P = \\frac{A}{t}$ (1 W = 1 J/s). Khi chuyển động thẳng đều theo phương lực: $P = F\\cdot v$.'
      }
    ],
    keyFormulas: ['A = F \\cdot s', 'P = \\frac{A}{t} = F \\cdot v', 'H = \\frac{A_{\\text{ích}}}{A_{\\text{tp}}} \\cdot 100\\%'],
    ...SIM_PRESETS.work_power,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Đơn vị chuẩn SI của công suất là gì?',
        options: ['A. Jun (J)', 'B. Oát (W)', 'C. Niutơn (N)', 'D. Ôm (Ω)'],
        correctIndex: 1,
        explanation: 'Công suất đo bằng Oát (W), với 1 W = 1 J/s.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một cần cẩu nâng vật nặng 8000 N lên cao 12 m trong 16 s. Tính công và công suất trung bình của cần cẩu.',
        hints: ['A = P_trọng_lượng · h, sau đó P_suất = A / t.'],
        solutionSteps: ['A = 8000 · 12 = 96 000 J.', 'P = 96 000 / 16 = 6000 W = 6 kW.'],
        finalAnswer: 'A = 96 kJ; P = 6 kW.'
      }
    ]
  },
  {
    id: 'phys-9-b5',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Quang học',
    sourceTag: SRC_9,
    lessonNumber: 5,
    title: 'Bài 5: Khúc xạ ánh sáng và Định luật Khúc xạ',
    subtitle: 'Sự gãy tia sáng qua mặt phân cách hai môi trường trong suốt, chiết suất n và công thức Snell',
    description:
      'Khảo sát hiện tượng tia sáng đổi hướng khi truyền xiên góc qua mặt phân cách và vận dụng định luật khúc xạ.',
    theorySections: [
      {
        heading: '1. Hiện tượng & Định luật khúc xạ ánh sáng',
        content:
          '• Tia khúc xạ nằm trong mặt phẳng tới và ở bên kia pháp tuyến so với tia tới.\n• Với hai môi trường trong suốt nhất định: $\\frac{\\sin i}{\\sin r} = \\text{hằng số} = n_{21}$ hay $n_1 \\sin i = n_2 \\sin r$.'
      },
      {
        heading: '2. Chiết suất tuyệt đối',
        content:
          '• Chiết suất tuyệt đối của môi trường $n = \\frac{c}{v} \\ge 1$, cho biết tốc độ ánh sáng trong môi trường giảm đi $n$ lần so với chân không.'
      }
    ],
    keyFormulas: ['n_1 \\sin i = n_2 \\sin r', 'n = \\frac{c}{v}'],
    ...SIM_PRESETS.refraction,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Khi tia sáng truyền từ không khí vào nước (xuyên xiên góc), góc khúc xạ r so với góc tới i như thế nào?',
        options: ['A. r > i', 'B. r < i', 'C. r = i', 'D. r = 90°'],
        correctIndex: 1,
        explanation: 'Nước chiết quang hơn không khí (n₂ > n₁) nên sin r < sin i ⇒ r < i.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Tia sáng từ không khí (n₁ = 1) chiếu tới mặt nước (n₂ = 4/3) dưới góc tới i = 60°. Tính góc khúc xạ r.',
        hints: ['Dùng 1 · sin 60° = (4/3) · sin r.'],
        solutionSteps: ['sin r = (3 · √3 / 2) / 4 ≈ 0,6495 ⇒ r ≈ 40,5°.'],
        finalAnswer: 'r ≈ 40,5°.'
      }
    ]
  },
  {
    id: 'phys-9-b6',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Quang học',
    sourceTag: SRC_9,
    lessonNumber: 6,
    title: 'Bài 6: Hiện tượng Phản xạ Toàn phần & Cáp quang',
    subtitle: 'Điều kiện xảy ra phản xạ toàn phần n₁ > n₂, i ≥ i_th và ứng dụng truyền tín hiệu cáp quang',
    description:
      'Khám phá góc tới hạn phản xạ toàn phần và cơ chế giữ ánh sáng truyền đi hàng nghìn km bên trong sợi quang học.',
    theorySections: [
      {
        heading: '1. Hai điều kiện xảy ra phản xạ toàn phần',
        content:
          '• Điều kiện 1: Ánh sáng truyền từ môi trường chiết suất lớn sang môi trường chiết suất nhỏ hơn ($n_1 > n_2$).\n• Điều kiện 2: Góc tới lớn hơn hoặc bằng góc tới hạn ($i \\ge i_{\\text{th}}$), với $\\sin i_{\\text{th}} = \\frac{n_2}{n_1}$.'
      },
      {
        heading: '2. Ứng dụng cáp quang & nội soi',
        content:
          '• Lõi sợi quang có chiết suất lớn hơn lớp vỏ bọc nên tia sáng bị phản xạ toàn phần liên tiếp dọc theo sợi.'
      }
    ],
    keyFormulas: ['\\sin i_{\\text{th}} = \\frac{n_2}{n_1} \\quad (n_1 > n_2)'],
    ...SIM_PRESETS.fiber_optic,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Hiện tượng phản xạ toàn phần KHÔNG thể xảy ra khi ánh sáng truyền từ:',
        options: ['A. Nước ra không khí', 'B. Thủy tinh ra nước', 'C. Không khí vào thủy tinh', 'D. Kim cương ra không khí'],
        correctIndex: 2,
        explanation: 'Từ không khí vào thủy tinh có n₁ < n₂ nên không bao giờ thỏa mãn điều kiện cần n₁ > n₂.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Tính góc tới hạn phản xạ toàn phần tại mặt phân cách giữa thủy tinh chiết suất n₁ = 1,5 và không khí (n₂ = 1).',
        hints: ['sin i_th = 1 / 1,5.'],
        solutionSteps: ['sin i_th = 2/3 ⇒ i_th ≈ 41,8°.'],
        finalAnswer: 'i_th ≈ 41,8°.'
      }
    ]
  },
  {
    id: 'phys-9-optics',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Quang học',
    sourceTag: SRC_9,
    lessonNumber: 7,
    title: 'Bài 7: Thấu kính Hội tụ, Thấu kính Phân kì & Kính lúp',
    subtitle: 'Tiêu điểm, trục chính, đường truyền 3 tia sáng đặc biệt và cách dựng ảnh thật/ảnh ảo',
    description:
      'Tổng hợp toàn bộ kiến thức vẽ ảnh qua thấu kính hội tụ, thấu kính phân kì và ứng dụng kính lúp quan sát vật nhỏ.',
    theorySections: [
      {
        heading: '1. Ba tia sáng đặc biệt qua thấu kính',
        content:
          '• Tia qua quang tâm O truyền thẳng.\n• Tia tới song song trục chính cho tia ló (hoặc đường kéo dài) đi qua tiêu điểm F\'.\n• Tia tới qua F cho tia ló song song trục chính.'
      },
      {
        heading: '2. Tính chất ảnh',
        content:
          '• Thấu kính hội tụ: $d > f$ cho ảnh thật ngược chiều; $d < f$ cho ảnh ảo cùng chiều lớn hơn vật (kính lúp).\n• Thấu kính phân kì luôn cho ảnh ảo cùng chiều nhỏ hơn vật.'
      }
    ],
    keyFormulas: ['\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}', 'G = \\frac{25}{f\\text{ (cm)}}'],
    ...SIM_PRESETS.lens_single,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Kính lúp có tiêu cự f = 5 cm thì số bội giác ghi trên vành kính là:',
        options: ['A. 2x', 'B. 5x', 'C. 10x', 'D. 25x'],
        correctIndex: 1,
        explanation: 'G = 25 / f = 25 / 5 = 5x.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Đặt vật sáng AB cao 2 cm vuông góc trục chính cách thấu kính hội tụ (f = 10 cm) một khoảng d = 15 cm. Tìm vị trí và chiều cao ảnh.',
        hints: ['Dùng 1/f = 1/d + 1/d\' và k = -d\'/d.'],
        solutionSteps: ['1/d\' = 1/10 - 1/15 = 1/30 ⇒ d\' = 30 cm (ảnh thật).', 'A\'B\' = AB · (d\'/d) = 2 · (30/15) = 4 cm.'],
        finalAnswer: 'Ảnh thật cách thấu kính 30 cm, cao 4 cm.'
      }
    ]
  },
  {
    id: 'phys-9-math-vec',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Công cụ Toán học Vật lí',
    sourceTag: SRC_9,
    lessonNumber: 8,
    title: 'Bài 8: Tổng hợp Lực, Đồ thị hàm bậc nhất & Lượng giác Tam giác vuông',
    subtitle: 'Cầu nối toán học giúp chiếu vectơ lực và đọc hệ số góc đồ thị trong các bài toán KHTN 9',
    description:
      'Trang bị công cụ sin/cos tam giác vuông, quy tắc hình bình hành tổng hợp lực và đọc ý nghĩa độ dốc đồ thị thực nghiệm.',
    theorySections: [
      {
        heading: '1. Lượng giác & Chiếu lực',
        content:
          '• Lực kéo nghiêng góc $\\alpha$ so với phương ngang có thành phần ngang $F_x = F\\cos\\alpha$ và thành phần đứng $F_y = F\\sin\\alpha$.'
      },
      {
        heading: '2. Ý nghĩa hệ số góc đồ thị',
        content:
          '• Trên đồ thị $U - I$, hệ số góc $\\tan\\varphi = U/I = R$ biểu diễn trực tiếp điện trở dây dẫn.'
      }
    ],
    keyFormulas: ['F_x = F\\cos\\alpha,\\; F_y = F\\sin\\alpha', 'R = \\frac{\\Delta U}{\\Delta I}'],
    ...SIM_PRESETS.vectors,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Một lực F = 20 N hợp với phương ngang góc 60°. Thành phần lực kéo theo phương ngang là:',
        options: ['A. 10 N', 'B. 10√3 N', 'C. 20 N', 'D. 5 N'],
        correctIndex: 0,
        explanation: 'F_x = F · cos 60° = 20 · 0,5 = 10 N.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Hai lực vuông góc nhau F₁ = 6 N và F₂ = 8 N cùng tác dụng lên vật. Tính độ lớn hợp lực F.',
        hints: ['Áp dụng Pytago F = √(F₁² + F₂²).'],
        solutionSteps: ['F = √(6² + 8²) = 10 N.'],
        finalAnswer: 'F = 10 N.'
      }
    ]
  },
  {
    id: 'phys-9-b9',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Quang học',
    sourceTag: SRC_9,
    lessonNumber: 9,
    title: 'Bài 9: Đo tiêu cự Thấu kính Hội tụ (Thực hành)',
    subtitle: 'Hai phương pháp đo tiêu cự chuẩn GDPT 2018: chùm tia song song và công thức L = 4f',
    description:
      'Thực hành xác định tiêu cự f của thấu kính hội tụ bằng phương pháp ảnh thật rõ nét cao bằng vật (d = d\' = 2f).',
    theorySections: [
      {
        heading: '1. Nguyên tắc đo L = 4f',
        content:
          '• Khi đặt vật và màn cách nhau cố định $L > 4f$ sẽ có 2 vị trí cho ảnh rõ nét; tại đúng $L_{\\min} = 4f$ chỉ có 1 vị trí chính giữa cho ảnh thật cao bằng vật ($d = d\' = 2f$).'
      }
    ],
    keyFormulas: ['d = d\' = 2f', 'L = d + d\' = 4f \\Rightarrow f = \\frac{L}{4}'],
    ...SIM_PRESETS.lens_single,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Trong thí nghiệm đo tiêu cự bằng cách tạo ảnh thật cao bằng vật, khoảng cách từ vật đến màn đo được L = 48 cm. Tiêu cự thấu kính là:',
        options: ['A. 12 cm', 'B. 24 cm', 'C. 48 cm', 'D. 96 cm'],
        correctIndex: 0,
        explanation: 'Vì L = 4f nên f = 48 / 4 = 12 cm.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Nếu đo 3 lần được L₁ = 40,2 cm, L₂ = 39,8 cm, L₃ = 40,0 cm thì giá trị tiêu cự trung bình bằng bao nhiêu?',
        hints: ['Tính L trung bình rồi chia 4.'],
        solutionSteps: ['L_tb = (40,2 + 39,8 + 40,0)/3 = 40,0 cm.', 'f_tb = 40,0 / 4 = 10,0 cm.'],
        finalAnswer: 'f_tb = 10,0 cm.'
      }
    ]
  },
  {
    id: 'phys-9-b10',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Quang học',
    sourceTag: SRC_9,
    lessonNumber: 10,
    title: 'Bài 10: Hiện tượng Tán sắc Ánh sáng & Màu sắc Vật',
    subtitle: 'Ánh sáng trắng qua lăng kính tách thành dải màu cầu vồng và cơ chế phản xạ chọn lọc',
    description:
      'Giải thích vì sao lăng kính tách được ánh sáng trắng thành 7 màu từ đỏ đến tím và vì sao vật có màu khác nhau dưới ánh sáng.',
    theorySections: [
      {
        heading: '1. Tán sắc ánh sáng',
        content:
          '• Ánh sáng trắng là hỗn hợp nhiều ánh sáng đơn sắc từ đỏ đến tím.\n• Chiết suất lăng kính tăng dần từ tia đỏ đến tia tím ($n_{\\text{đỏ}} < n_{\\text{tím}}$) nên tia tím lệch về phía đáy nhiều nhất.'
      },
      {
        heading: '2. Màu sắc các vật',
        content:
          '• Vật màu nào phản xạ mạnh ánh sáng màu đó và hấp thụ các màu còn lại; vật màu đen hấp thụ hầu hết mọi ánh sáng.'
      }
    ],
    keyFormulas: ['n_{\\text{đỏ}} < n_{\\text{cam}} < \\dots < n_{\\text{tím}}'],
    ...SIM_PRESETS.prism,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Khi chiếu chùm ánh sáng trắng hẹp qua lăng kính thủy tinh, tia nào bị lệch ít nhất về phía đáy lăng kính?',
        options: ['A. Tia tím', 'B. Tia chàm', 'C. Tia lục', 'D. Tia đỏ'],
        correctIndex: 3,
        explanation: 'Chiết suất của thủy tinh đối với ánh sáng đỏ nhỏ nhất nên tia đỏ lệch ít nhất.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Vì sao khi chiếu ánh sáng đỏ thuần vào một chiếc lá cây màu lục, chiếc lá trông gần như màu đen?',
        hints: ['Vật màu lục chỉ phản xạ tốt ánh sáng lục.'],
        solutionSteps: ['Lá xanh lục hấp thụ mạnh ánh sáng đỏ và hầu như không phản xạ tia đỏ về mắt, nên lá trông tối đen.'],
        finalAnswer: 'Do sắc tố diệp lục hấp thụ ánh sáng đỏ.'
      }
    ]
  },
  {
    id: 'phys-9-b11',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Điện học',
    sourceTag: SRC_9,
    lessonNumber: 11,
    title: 'Bài 11: Định luật Ohm & Điện trở dây dẫn',
    subtitle: 'Mối quan hệ I = U/R, điện trở R = ρl/S, biến trở và cách đo điện trở thực tế',
    description:
      'Khám phá định luật cơ bản nhất của mạch điện một chiều cùng sự phụ thuộc của điện trở vào chiều dài, tiết diện và vật liệu.',
    theorySections: [
      {
        heading: '1. Định luật Ohm',
        content:
          '• Cường độ dòng điện qua dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở dây: $I = \\frac{U}{R}$.'
      },
      {
        heading: '2. Công thức điện trở dây dẫn',
        content:
          '• $R = \\rho\\frac{\\ell}{S}$, trong đó $\\rho$ (Ω·m) là điện trở suất vật liệu, $\\ell$ (m) là chiều dài và $S$ (m²) là tiết diện.'
      }
    ],
    keyFormulas: ['I = \\frac{U}{R}', 'R = \\rho \\frac{\\ell}{S}'],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Nếu tăng chiều dài dây dẫn đồng chất tiết diện đều lên 3 lần thì điện trở của dây sẽ:',
        options: ['A. Giảm 3 lần', 'B. Tăng 3 lần', 'C. Tăng 9 lần', 'D. Không đổi'],
        correctIndex: 1,
        explanation: 'R tỉ lệ thuận với chiều dài ℓ nên ℓ tăng 3 lần thì R tăng 3 lần.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Đặt hiệu điện thế 12 V vào hai đầu điện trở 24 Ω. Tính cường độ dòng điện chạy qua điện trở.',
        hints: ['Áp dụng I = U / R.'],
        solutionSteps: ['I = 12 / 24 = 0,5 A.'],
        finalAnswer: 'I = 0,5 A.'
      }
    ]
  },
  {
    id: 'phys-9-elec',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Điện học',
    sourceTag: SRC_9,
    lessonNumber: 12,
    title: 'Bài 12: Đoạn mạch Nối tiếp và Đoạn mạch Song song',
    subtitle: 'Quy tắc tính điện trở tương đương, phân áp đoạn nối tiếp và chia dòng nhánh song song',
    description:
      'Nắm vững phương pháp phân tích mạch hỗn hợp gồm các điện trở ghép nối tiếp và song song.',
    theorySections: [
      {
        heading: '1. Đoạn mạch nối tiếp',
        content:
          '• $I = I_1 = I_2$; $U = U_1 + U_2$; $R_{\\text{tđ}} = R_1 + R_2$.'
      },
      {
        heading: '2. Đoạn mạch song song',
        content:
          '• $U = U_1 = U_2$; $I = I_1 + I_2$; $\\frac{1}{R_{\\text{tđ}}} = \\frac{1}{R_1} + \\frac{1}{R_2}$.'
      }
    ],
    keyFormulas: ['R_{\\text{nt}} = R_1 + R_2', 'R_{\\text{//}} = \\frac{R_1 R_2}{R_1 + R_2}'],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Hai điện trở R₁ = 6 Ω và R₂ = 3 Ω mắc song song. Điện trở tương đương của đoạn mạch là:',
        options: ['A. 9 Ω', 'B. 4,5 Ω', 'C. 2 Ω', 'D. 1,5 Ω'],
        correctIndex: 2,
        explanation: 'R_tđ = (6 · 3)/(6 + 3) = 18 / 9 = 2 Ω.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Cho R₁ = 10 Ω mắc nối tiếp R₂ = 20 Ω vào nguồn 15 V. Tính cường độ dòng điện mạch chính và hiệu điện thế trên mỗi điện trở.',
        hints: ['Tính R_tđ = R₁ + R₂ rồi dùng I = U / R_tđ.'],
        solutionSteps: ['R_tđ = 30 Ω ⇒ I = 15/30 = 0,5 A.', 'U₁ = 0,5 · 10 = 5 V; U₂ = 0,5 · 20 = 10 V.'],
        finalAnswer: 'I = 0,5 A; U₁ = 5 V; U₂ = 10 V.'
      }
    ]
  },
  {
    id: 'phys-9-b13',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Điện học',
    sourceTag: SRC_9,
    lessonNumber: 13,
    title: 'Bài 13: Năng lượng điện, Công suất điện & Định luật Jun – Len-xơ',
    subtitle: 'Công thức A = UIt, P = UI, đọc số kWh công tơ và tính tiền điện sinh hoạt',
    description:
      'Liên hệ trực tiếp công suất điện trên nhãn thiết bị với điện năng tiêu thụ hằng tháng (kWh) và nhiệt lượng tỏa ra trên dây dẫn.',
    theorySections: [
      {
        heading: '1. Năng lượng điện & Công suất điện',
        content:
          '• Điện năng tiêu thụ: $A = UIt = P\\cdot t$. Trong sinh hoạt: $1\\text{ kWh} = 3\\,600\\,000\\text{ J}$.\n• Công suất điện: $P = UI = I^2 R = \\frac{U^2}{R}$.'
      },
      {
        heading: '2. Định luật Jun – Len-xơ',
        content:
          '• Nhiệt lượng tỏa ra trên dây dẫn thuần trở: $Q = I^2 R t$.'
      }
    ],
    keyFormulas: ['P = U I = I^2 R = \\frac{U^2}{R}', 'A = P \\cdot t', 'Q = I^2 R t'],
    ...SIM_PRESETS.joule_lenz,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Một bóng đèn ghi 220V - 40W sáng bình thường trong 5 giờ tiêu thụ điện năng bao nhiêu?',
        options: ['A. 0,2 kWh', 'B. 2 kWh', 'C. 200 kWh', 'D. 40 kWh'],
        correctIndex: 0,
        explanation: 'A = P · t = 0,04 kW · 5 h = 0,2 kWh.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một ấm điện công suất 1500 W hoạt động đúng định mức trong 20 phút. Tính nhiệt lượng tỏa ra theo đơn vị kJ và kWh.',
        hints: ['20 phút = 1200 s = 1/3 giờ.'],
        solutionSteps: ['Q = 1500 · 1200 = 1 800 000 J = 1800 kJ.', 'A = 1,5 kW · (1/3) h = 0,5 kWh.'],
        finalAnswer: '1800 kJ (hay 0,5 kWh).'
      }
    ]
  },
  {
    id: 'phys-9-energy-refract',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Năng lượng & Bền vững',
    sourceTag: SRC_9,
    lessonNumber: 14,
    title: 'Bài 14: Năng lượng trên Trái Đất & Năng lượng Tái tạo',
    subtitle: 'Chu trình năng lượng từ bức xạ Mặt Trời, nhiên liệu hóa thạch và chuyển dịch năng lượng sạch',
    description:
      'Tìm hiểu nguồn gốc năng lượng gió, thủy điện, mặt trời, tác động môi trường của nhiên liệu hóa thạch và hiệu suất chuyển hóa.',
    theorySections: [
      {
        heading: '1. Chu trình năng lượng từ Mặt Trời',
        content:
          '• Phần lớn các dạng năng lượng trên Trái Đất (gió, thủy điện, sinh khối, nhiên liệu hóa thạch) đều bắt nguồn từ bức xạ Mặt Trời.'
      },
      {
        heading: '2. Năng lượng hóa thạch vs Năng lượng tái tạo',
        content:
          '• Than đá, dầu mỏ, khí đốt có trữ lượng hữu hạn và phát thải CO₂.\n• Điện mặt trời, điện gió, thủy triều, địa nhiệt là nguồn năng lượng tái tạo sạch bền vững.'
      }
    ],
    keyFormulas: ['H_{\\text{chuyển hóa}} = \\frac{E_{\\text{có ích}}}{E_{\\text{toàn phần}}} \\cdot 100\\%'],
    ...SIM_PRESETS.pv_thermo,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Nguồn năng lượng nào sau đây KHÔNG phải năng lượng tái tạo?',
        options: ['A. Năng lượng gió', 'B. Than đá', 'C. Bức xạ Mặt Trời', 'D. Thủy triều'],
        correctIndex: 1,
        explanation: 'Than đá là nhiên liệu hóa thạch hình thành qua hàng triệu năm, có trữ lượng hữu hạn.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một tấm pin mặt trời diện tích 2 m² nhận công suất bức xạ 1000 W/m², hiệu suất chuyển hóa 18%. Tính công suất điện phát ra.',
        hints: ['P_điện = H · P_nhận.'],
        solutionSteps: ['P_nhận = 2 · 1000 = 2000 W.', 'P_điện = 0,18 · 2000 = 360 W.'],
        finalAnswer: 'P_điện = 360 W.'
      }
    ]
  },
  {
    id: 'phys-9-b15',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Điện từ học',
    sourceTag: SRC_9,
    lessonNumber: 15,
    title: 'Bài 15: Cảm ứng điện từ & Điều kiện xuất hiện dòng điện cảm ứng',
    subtitle: 'Thí nghiệm nam châm chuyển động qua cuộn dây kín và sự biến thiên số đường sức từ',
    description:
      'Khảo sát thí nghiệm Faraday về hiện tượng cảm ứng điện từ — nền tảng chế tạo mọi máy phát điện hiện đại.',
    theorySections: [
      {
        heading: '1. Hiện tượng cảm ứng điện từ',
        content:
          '• Khi số đường sức từ xuyên qua tiết diện S của cuộn dây dẫn kín biến thiên (tăng hoặc giảm), trong cuộn dây xuất hiện dòng điện cảm ứng.'
      }
    ],
    keyFormulas: ['\\Delta\\Phi \\neq 0 \\implies \\text{Xuất hiện } i_{\\text{cảm ứng}}'],
    ...SIM_PRESETS.mag_induction,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Dòng điện cảm ứng xuất hiện trong cuộn dây dẫn kín khi nào?',
        options: [
          'A. Nam châm đặt đứng yên trong lòng cuộn dây',
          'B. Số đường sức từ xuyên qua tiết diện cuộn dây biến thiên',
          'C. Cuộn dây hở mạch và nam châm đứng yên',
          'D. Từ trường không đổi theo thời gian'
        ],
        correctIndex: 1,
        explanation: 'Chỉ khi từ thông (số đường sức từ qua tiết diện cuộn dây kín) thay đổi thì dòng cảm ứng mới xuất hiện.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Đưa cực Bắc nam châm lại gần rồi kéo ra xa cuộn dây kín nối điện kế nhạy. Kim điện kế lệch như thế nào?',
        hints: ['Khi đưa vào từ thông tăng, khi kéo ra từ thông giảm.'],
        solutionSteps: ['Kim điện kế lệch về hai phía ngược chiều nhau ứng với hai giai đoạn đưa vào và kéo ra; đứng yên tại số 0 khi nam châm dừng lại.'],
        finalAnswer: 'Kim lệch hai chiều ngược nhau khi di chuyển, về 0 khi đứng yên.'
      }
    ]
  },
  {
    id: 'phys-9-b16',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Điện từ học',
    sourceTag: SRC_9,
    lessonNumber: 16,
    title: 'Bài 16: Dòng điện Xoay chiều & Tác dụng của dòng xoay chiều',
    subtitle: 'Dòng điện đổi chiều tuần hoàn 50 Hz, máy phát điện xoay chiều và 4 tác dụng nhiệt, quang, từ, sinh lí',
    description:
      'Phân biệt dòng điện một chiều và dòng xoay chiều 220V–50Hz, nguyên lý quay khung dây trong từ trường đều.',
    theorySections: [
      {
        heading: '1. Dòng điện xoay chiều',
        content:
          '• Là dòng điện luân phiên đổi chiều theo thời gian; lưới điện dân dụng Việt Nam có tần số $f = 50\\text{ Hz}$ (đổi chiều 100 lần/giây).'
      },
      {
        heading: '2. Bốn tác dụng cơ bản',
        content:
          '• Tác dụng nhiệt, phát sáng, tác dụng từ (đổi chiều liên tục) và tác dụng sinh lí.'
      }
    ],
    keyFormulas: ['f = 50\\text{ Hz} \\implies T = 0,02\\text{ s}', 'i = I_0 \\sin(\\omega t)'],
    ...SIM_PRESETS.ac_rlc,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Mạng điện dân dụng xoay chiều 50 Hz tại Việt Nam đổi chiều bao nhiêu lần trong 1 giây?',
        options: ['A. 50 lần', 'B. 100 lần', 'C. 25 lần', 'D. 220 lần'],
        correctIndex: 1,
        explanation: 'Mỗi chu kì dòng xoay chiều đổi chiều 2 lần, nên f = 50 Hz đổi chiều 2 · 50 = 100 lần/giây.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Nêu cấu tạo 2 bộ phận chính của máy phát điện xoay chiều đơn giản.',
        hints: ['Nam châm và cuộn dây (roto và stato).'],
        solutionSteps: ['Gồm phần cảm (nam châm tạo từ trường) và phần ứng (cuộn dây dẫn tạo suất điện động cảm ứng), một phần quay (roto) và một phần đứng yên (stato).'],
        finalAnswer: 'Nam châm (phần cảm) và cuộn dây (phần ứng).'
      }
    ]
  },
  {
    id: 'phys-9-induction-ac',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'KHTN 9 · Điện từ học',
    sourceTag: SRC_9,
    lessonNumber: 17,
    title: 'Bài 17: Máy Biến áp & Truyền tải Điện năng đi xa',
    subtitle: 'Công thức máy biến áp U₁/U₂ = N₁/N₂ và giảm công suất hao phí ΔP = P²R / U²',
    description:
      'Tìm hiểu cách máy biến áp nâng cao điện áp lên 220 kV–500 kV để giảm hàng trăm lần hao phí tỏa nhiệt trên đường dây.',
    theorySections: [
      {
        heading: '1. Máy biến áp',
        content:
          '• Tỉ số hiệu điện thế hai đầu cuộn sơ cấp và thứ cấp bằng tỉ số số vòng dây: $\\frac{U_1}{U_2} = \\frac{N_1}{N_2}$.'
      },
      {
        heading: '2. Truyền tải điện năng đi xa',
        content:
          '• Công suất hao phí tỏa nhiệt: $\\Delta P = \\frac{P^2 R}{U^2}$. Tăng $U$ lên $n$ lần giúp giảm hao phí đi $n^2$ lần.'
      }
    ],
    keyFormulas: ['\\frac{U_1}{U_2} = \\frac{N_1}{N_2}', '\\Delta P = \\frac{P^2 R}{U^2}'],
    ...SIM_PRESETS.transformer,
    practiceExercises: [
      {
        source: SRC_9,
        question: 'Nếu tăng hiệu điện thế ở nơi phát lên 10 lần trước khi truyền tải cùng công suất đi xa thì công suất hao phí trên dây giảm đi bao nhiêu lần?',
        options: ['A. 10 lần', 'B. 20 lần', 'C. 100 lần', 'D. 1000 lần'],
        correctIndex: 2,
        explanation: 'ΔP tỉ lệ nghịch với U², nên tăng U lên 10 lần sẽ làm hao phí giảm 10² = 100 lần.'
      }
    ],
    essayExercises: [
      {
        source: SRC_9,
        question: 'Một máy biến áp lí tưởng có N₁ = 1000 vòng, N₂ = 250 vòng. Đặt điện áp xoay chiều U₁ = 220 V vào cuộn sơ cấp. Tính U₂.',
        hints: ['Dùng U₁ / U₂ = N₁ / N₂.'],
        solutionSteps: ['U₂ = 220 · (250 / 1000) = 55 V.'],
        finalAnswer: 'U₂ = 55 V.'
      }
    ]
  }
];
