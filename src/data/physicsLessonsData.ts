import { PhysicsLesson } from '../types';

export const PHYSICS_LESSONS: PhysicsLesson[] = [
  // ==========================================
  // LỚP 9: ĐIỆN HỌC & QUANG HỌC
  // ==========================================
  {
    id: 'phys-9-1',
    grade: 'Lớp 9',
    lessonNumber: 1,
    title: 'Định luật Ôm cho đoạn mạch & Điện trở tương đương',
    subtitle: 'Nghiên cứu cường độ dòng điện I tỉ lệ thuận với U, tỉ lệ nghịch với R và mạch nối tiếp, song song',
    description: 'Thí nghiệm đo đạc dòng điện qua bóng đèn và biến trở. Khảo sát mạch điện nối tiếp và song song, quan sát kim vôn kế và ampe kế thời gian thực.',
    theorySections: [
      {
        heading: '1. Nội dung định luật Ôm',
        content: 'Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở của dây: I = U / R. Trong đó I tính bằng Ampe (A), U tính bằng Vôn (V), R tính bằng Ôm (Ω).'
      },
      {
        heading: '2. Đoạn mạch mắc nối tiếp',
        content: 'Cường độ dòng điện như nhau tại mọi điểm: I = I₁ = I₂. Hiệu điện thế bằng tổng các hiệu điện thế thành phần: U = U₁ + U₂. Điện trở tương đương: R_td = R₁ + R₂. Hiệu điện thế giữa hai đầu mỗi điện trở tỉ lệ thuận với điện trở đó: U₁ / U₂ = R₁ / R₂.'
      },
      {
        heading: '3. Đoạn mạch mắc song song',
        content: 'Hiệu điện thế giữa hai đầu các đoạn mạch nhánh bằng nhau: U = U₁ = U₂. Cường độ dòng điện mạch chính bằng tổng dòng điện các mạch nhánh: I = I₁ + I₂. Điện trở tương đương: 1 / R_td = 1 / R₁ + 1 / R₂, suy ra R_td = (R₁ · R₂) / (R₁ + R₂).'
      },
      {
        heading: '4. Định luật Jun - Len-xơ & Công suất điện',
        content: 'Nhiệt lượng tỏa ra trên dây dẫn: Q = I² · R · t (Jun). Công suất tiêu thụ điện: P = U · I = I² · R = U² / R (Oát).'
      }
    ],
    keyFormulas: [
      'I = \\frac{U}{R}',
      'R_{nt} = R_1 + R_2',
      '\\frac{1}{R_{ss}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\implies R_{ss} = \\frac{R_1 R_2}{R_1 + R_2}',
      'P = U \\cdot I = I^2 R = \\frac{U^2}{R}',
      'Q = I^2 R t \\quad (\\text{Jun - Lenxơ})'
    ],
    simulationType: 'ohm_circuit',
    defaultParams: {
      voltage: 12, // V
      resistor1: 6, // Ohm
      resistor2: 4, // Ohm
      circuitMode: 0 // 0: Nối tiếp, 1: Song song
    },
    paramBounds: {
      voltage: { min: 1, max: 24, step: 0.5, unit: 'V', label: 'Hiệu điện thế nguồn (U)' },
      resistor1: { min: 1, max: 20, step: 0.5, unit: 'Ω', label: 'Điện trở R₁' },
      resistor2: { min: 1, max: 20, step: 0.5, unit: 'Ω', label: 'Điện trở R₂' },
      circuitMode: { min: 0, max: 1, step: 1, unit: '', label: 'Chế độ (0: Nối tiếp, 1: Song song)' }
    },
    practiceExercises: [
      {
        question: 'Cho hai điện trở R₁ = 10Ω và R₂ = 15Ω mắc song song vào nguồn điện U = 12V. Cường độ dòng điện chạy trong mạch chính là:',
        options: ['A. 2.0 A', 'B. 1.2 A', 'C. 0.8 A', 'D. 2.5 A'],
        correctIndex: 0,
        explanation: 'Điện trở tương đương của mạch song song: R_td = (R₁ · R₂) / (R₁ + R₂) = (10 · 15) / (10 + 15) = 150 / 25 = 6 Ω. Cường độ dòng điện mạch chính: I = U / R_td = 12 / 6 = 2.0 A.',
        stepByStep: [
          'Bước 1: Tính điện trở tương đương mạch song song: R_td = (10 * 15) / 25 = 6 Ω.',
          'Bước 2: Áp dụng định luật Ôm cho toàn mạch: I = U / R_td = 12 / 6 = 2.0 A.'
        ]
      },
      {
        question: 'Một bóng đèn có ghi 12V - 6W. Điện trở của bóng đèn khi hoạt động bình thường là:',
        options: ['A. 24 Ω', 'B. 2 Ω', 'C. 72 Ω', 'D. 0.5 Ω'],
        correctIndex: 0,
        explanation: 'Công thức công suất P = U² / R suy ra R = U² / P = 12² / 6 = 144 / 6 = 24 Ω.',
        stepByStep: [
          'Áp dụng công thức liên hệ công suất và điện trở: P = U² / R.',
          'Suy ra R = U² / P = 144 / 6 = 24 Ω.'
        ]
      }
    ]
  },
  {
    id: 'phys-9-2',
    grade: 'Lớp 9',
    lessonNumber: 2,
    title: 'Hiện tượng Khúc xạ Ánh sáng & Thấu kính Hội tụ, Phân kỳ',
    subtitle: 'Đường truyền tia sáng qua lăng kính, tiêu điểm F, F\' và dựng ảnh của vật qua thấu kính',
    description: 'Mô phỏng 2D tia sáng truyền từ nguồn sáng qua quang tâm O, tiêu điểm F và F\'. Dịch chuyển vật thật d để quan sát tính chất ảnh thật/ảnh ảo phóng đại hay thu nhỏ.',
    theorySections: [
      {
        heading: '1. Hiện tượng khúc xạ ánh sáng',
        content: 'Là hiện tượng tia sáng bị gãy khúc tại mặt phân cách giữa hai môi trường trong suốt khác nhau. Tia khúc xạ nằm trong mặt phẳng tới. Góc khúc xạ r nhỏ hơn góc tới i khi ánh sáng truyền từ không khí vào nước/thủy tinh.'
      },
      {
        heading: '2. Thấu kính hội tụ (TKHT)',
        content: 'Có phần rìa mỏng hơn phần giữa. Chùm tia tới song song với trục chính cho chùm tia ló hội tụ tại tiêu điểm F\'. Ba tia sáng đặc biệt: (1) Tia qua quang tâm O truyền thẳng; (2) Tia song song trục chính cho tia ló đi qua tiêu điểm F\'; (3) Tia đi qua tiêu điểm F cho tia ló song song trục chính.'
      },
      {
        heading: '3. Tính chất ảnh tạo bởi TKHT',
        content: 'Vật đặt ngoài khoảng tiêu cự (d > f): Cho ảnh thật, ngược chiều với vật. Vật đặt trong khoảng tiêu cự (d < f): Cho ảnh ảo, cùng chiều và lớn hơn vật (nguyên lý kính lúp). Điểm d = 2f: Cho ảnh thật bằng đúng kích thước vật.'
      },
      {
        heading: '4. Công thức thấu kính',
        content: '1 / f = 1 / d + 1 / d\'. Số phóng đại ảnh: k = -d\' / d = f / (f - d).'
      }
    ],
    keyFormulas: [
      '\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}',
      'd\' = \\frac{d \\cdot f}{d - f}',
      'k = -\\frac{d\'}{d} = \\frac{f}{f - d}',
      'D = \\frac{1}{f} \\quad (\\text{Độ tụ, dp})'
    ],
    simulationType: 'lens_optics',
    defaultParams: {
      focalLength: 80, // mm / px
      objectDistance: 160, // mm / px
      objectHeight: 40 // mm / px
    },
    paramBounds: {
      focalLength: { min: 40, max: 140, step: 5, unit: 'px', label: 'Tiêu cự thấu kính (f)' },
      objectDistance: { min: 30, max: 300, step: 5, unit: 'px', label: 'Khoảng cách vật (d)' },
      objectHeight: { min: 15, max: 70, step: 5, unit: 'px', label: 'Chiều cao vật (h)' }
    },
    practiceExercises: [
      {
        question: 'Đặt một vật AB vuông góc với trục chính của thấu kính hội tụ có tiêu cự f = 20cm, cách thấu kính d = 30cm. Khoảng cách d\' từ ảnh đến thấu kính là:',
        options: ['A. 60 cm (ảnh thật)', 'B. 12 cm (ảnh ảo)', 'C. 30 cm (ảnh thật)', 'D. 50 cm (ảnh thật)'],
        correctIndex: 0,
        explanation: 'Áp dụng công thức thấu kính: 1/f = 1/d + 1/d\' => d\' = (d · f) / (d - f) = (30 · 20) / (30 - 20) = 600 / 10 = 60 cm. Vì d\' > 0 nên đây là ảnh thật ngược chiều cách thấu kính 60cm.',
        stepByStep: [
          'Áp dụng công thức vị trí ảnh: d\' = (d * f) / (d - f).',
          'Thay số: d\' = (30 * 20) / (30 - 20) = 600 / 10 = 60 cm > 0 (ảnh thật).'
        ]
      }
    ]
  },

  // ==========================================
  // LỚP 10: ĐỘNG HỌC & ĐỘNG LỰC HỌC
  // ==========================================
  {
    id: 'phys-10-1',
    grade: 'Lớp 10',
    lessonNumber: 3,
    title: 'Chuyển động Ném ngang & Ném xiên trong Trọng trường',
    subtitle: 'Khảo sát sự kết hợp chuyển động thẳng đều theo phương ngang và rơi tự do theo phương thẳng đứng',
    description: 'Bắn vật thể với góc nghiêng α và vận tốc ban đầu v₀. Mô phỏng quỹ đạo parabol, phân tích thời gian bay, tầm ném xa L và tầm ném cao H_max.',
    theorySections: [
      {
        heading: '1. Phân tích chuyển động ném xiên',
        content: 'Bỏ qua sức cản không khí, gia tốc của vật chỉ là gia tốc trọng trường hướng xuống: a_x = 0; a_y = -g. Vận tốc ban đầu: v_{0x} = v_0 \\cos\\alpha; v_{0y} = v_0 \\sin\\alpha.'
      },
      {
        heading: '2. Phương trình chuyển động & Quỹ đạo',
        content: 'Tọa độ theo thời gian: x(t) = (v_0 \\cos\\alpha) t; y(t) = (v_0 \\sin\\alpha) t - \\frac{1}{2}gt^2. Khử thời gian t ta được phương trình quỹ đạo dạng Parabol: y = -\\frac{g}{2v_0^2 \\cos^2\\alpha} x^2 + x\\tan\\alpha.'
      },
      {
        heading: '3. Tầm bay cao & Tầm bay xa',
        content: 'Thời gian lên đến điểm cao nhất: t_h = (v_0 \\sin\\alpha) / g. Tầm cao cực đại: H_max = (v_0^2 \\sin^2\\alpha) / (2g). Tầm bay xa: L = (v_0^2 \\sin 2\\alpha) / g. Tầm bay xa đạt cực đại khi góc bắn α = 45°.'
      }
    ],
    keyFormulas: [
      'x = (v_0 \\cos\\alpha) t',
      'y = (v_0 \\sin\\alpha) t - \\frac{1}{2}gt^2',
      'H_{max} = \\frac{v_0^2 \\sin^2\\alpha}{2g}',
      'L = \\frac{v_0^2 \\sin(2\\alpha)}{g}',
      '\\alpha = 45^\\circ \\implies L_{max} = \\frac{v_0^2}{g}'
    ],
    simulationType: 'projectile_motion',
    defaultParams: {
      initialVelocity: 25, // m/s
      launchAngle: 45, // degrees
      gravity: 9.8, // m/s^2
      height: 0
    },
    paramBounds: {
      initialVelocity: { min: 10, max: 45, step: 1, unit: 'm/s', label: 'Vận tốc đầu (v₀)' },
      launchAngle: { min: 15, max: 80, step: 1, unit: '°', label: 'Góc phóng (α)' },
      gravity: { min: 5, max: 15, step: 0.2, unit: 'm/s²', label: 'Gia tốc trọng trường (g)' },
      height: { min: 0, max: 50, step: 2, unit: 'm', label: 'Độ cao ban đầu (h)' }
    },
    practiceExercises: [
      {
        question: 'Một quả bóng được ném với vận tốc v₀ = 20 m/s ở góc ném α = 45° (lấy g = 10 m/s²). Tầm ném xa L của quả bóng là:',
        options: ['A. 40 m', 'B. 20 m', 'C. 80 m', 'D. 28.3 m'],
        correctIndex: 0,
        explanation: 'Áp dụng công thức tầm bay xa: L = (v₀² · sin(2α)) / g = (20² · sin(90°)) / 10 = (400 · 1) / 10 = 40 m.',
        stepByStep: [
          'Góc 2α = 2 * 45° = 90° nên sin(2α) = 1 (tầm xa cực đại).',
          'L = v₀² / g = 20² / 10 = 400 / 10 = 40 m.'
        ]
      }
    ]
  },
  {
    id: 'phys-10-2',
    grade: 'Lớp 10',
    lessonNumber: 4,
    title: 'Định luật Bảo toàn Cơ năng & Va chạm',
    subtitle: 'Nghiên cứu sự chuyển hóa lẫn nhau giữa động năng và thế năng trong trường trọng lực',
    description: 'Thí nghiệm thả rơi vật hoặc chuyển động trượt không ma sát. Quan sát biểu đồ cột năng lượng W_đ, W_t thời gian thực bảo toàn tổng cơ năng W.',
    theorySections: [
      {
        heading: '1. Động năng & Thế năng trọng trường',
        content: 'Động năng: W_đ = 1/2 · m · v² (J). Thế năng trọng trường: W_t = m · g · z (J) với mốc thế năng tại mặt đất z = 0.'
      },
      {
        heading: '2. Định luật bảo toàn cơ năng',
        content: 'Khi một vật chuyển động trong trọng trường chỉ chịu tác dụng của trọng lực, cơ năng của vật là một đại lượng bảo toàn: W = W_đ + W_t = 1/2 · m · v² + m · g · z = const.'
      },
      {
        heading: '3. Sự chuyển hóa năng lượng',
        content: 'Khi vật rơi: thế năng giảm dần, động năng tăng tương ứng. Tại điểm chạm đất: thế năng bằng 0, động năng đạt cực đại. Vận tốc chạm đất: v = √(2gz).'
      }
    ],
    keyFormulas: [
      'W_d = \\frac{1}{2} m v^2',
      'W_t = m g z',
      'W = W_d + W_t = \\text{const}',
      'v_{cham\\_dat} = \\sqrt{2gh}'
    ],
    simulationType: 'free_fall_energy',
    defaultParams: {
      dropHeight: 30, // m
      mass: 2, // kg
      gravity: 9.8
    },
    paramBounds: {
      dropHeight: { min: 10, max: 60, step: 2, unit: 'm', label: 'Độ cao thả rơi (h)' },
      mass: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng vật (m)' },
      gravity: { min: 5, max: 15, step: 0.2, unit: 'm/s²', label: 'Gia tốc trọng trường (g)' }
    },
    practiceExercises: [
      {
        question: 'Thả rơi tự do một vật có khối lượng m = 1kg từ độ cao h = 20m xuống đất (lấy g = 10 m/s²). Vận tốc của vật khi chạm đất là:',
        options: ['A. 20 m/s', 'B. 10 m/s', 'C. 14.1 m/s', 'D. 40 m/s'],
        correctIndex: 0,
        explanation: 'Bảo toàn cơ năng từ vị trí thả (W = mgh) đến mặt đất (W = 1/2 mv²): mgh = 1/2 mv² => v = √(2gh) = √(2 · 10 · 20) = √400 = 20 m/s.',
        stepByStep: [
          'Cơ năng ban đầu: W = mgh = 1 * 10 * 20 = 200 J.',
          'Tại mặt đất: W = 1/2 m v² = 200 J => v² = 400 => v = 20 m/s.'
        ]
      }
    ]
  },

  // ==========================================
  // LỚP 11: QUANG HỌC & ĐIỆN TỪ HỌC
  // ==========================================
  {
    id: 'phys-11-1',
    grade: 'Lớp 11',
    lessonNumber: 5,
    title: 'Định luật Khúc xạ Ánh sáng & Phản xạ Toàn phần',
    subtitle: 'Định luật Snell-Descartes, chiết suất tuyệt đối và ứng dụng sợi quang cáp viễn thông',
    description: 'Bắn tia laser qua khối chất trong suốt chiết suất n. Tinh chỉnh góc tới i từ 0° đến 90°, quan sát góc khúc xạ r và hiện tượng phản xạ toàn phần khi i ≥ i_gh.',
    theorySections: [
      {
        heading: '1. Định luật Snell-Descartes',
        content: 'Tia khúc xạ nằm trong mặt phẳng tới và ở phía bên kia pháp tuyến so với tia tới. Đối với hai môi trường trong suốt nhất định, tỉ số giữa sin góc tới và sin góc khúc xạ luôn không đổi: n₁ · sin(i) = n₂ · sin(r).'
      },
      {
        heading: '2. Hiện tượng phản xạ toàn phần',
        content: 'Là hiện tượng toàn bộ tia sáng bị phản xạ trở lại môi trường ban đầu tại mặt phân cách. Điều kiện: (1) Ánh sáng truyền từ môi trường chiết quang hơn sang môi trường kém chiết quang hơn (n₁ > n₂); (2) Góc tới i lớn hơn hoặc bằng góc giới hạn: i ≥ i_gh với sin(i_gh) = n₂ / n₁.'
      },
      {
        heading: '3. Ứng dụng thực tế',
        content: 'Sợi quang học truyền dẫn Internet tốc độ cao qua phản xạ toàn phần liên tục trong lõi thủy tinh; ống nội soi y tế; lăng kính phản xạ toàn phần trong ống nhòm.'
      }
    ],
    keyFormulas: [
      'n_1 \\sin(i) = n_2 \\sin(r)',
      '\\sin(i_{gh}) = \\frac{n_2}{n_1} \\quad (n_1 > n_2)',
      'n = \\frac{c}{v}'
    ],
    simulationType: 'light_refraction',
    defaultParams: {
      n1: 1.0, // Không khí
      n2: 1.5, // Thủy tinh
      incidentAngle: 45 // Độ
    },
    paramBounds: {
      n1: { min: 1.0, max: 2.0, step: 0.05, unit: '', label: 'Chiết suất môi trường 1 (n₁)' },
      n2: { min: 1.0, max: 2.4, step: 0.05, unit: '', label: 'Chiết suất môi trường 2 (n₂)' },
      incidentAngle: { min: 5, max: 85, step: 1, unit: '°', label: 'Góc tới (i)' }
    },
    practiceExercises: [
      {
        question: 'Tia sáng truyền từ nước (chiết suất n₁ = 4/3) ra không khí (n₂ = 1). Góc giới hạn phản xạ toàn phần i_gh xấp xỉ bằng:',
        options: ['A. 48.6°', 'B. 41.8°', 'C. 60.0°', 'D. 30.0°'],
        correctIndex: 0,
        explanation: 'sin(i_gh) = n₂ / n₁ = 1 / (4/3) = 3/4 = 0.75 => i_gh = arcsin(0.75) ≈ 48.6°. Khi góc tới i > 48.6° sẽ xảy ra phản xạ toàn phần.',
        stepByStep: [
          'Điều kiện n₁ > n₂ thỏa mãn (4/3 > 1).',
          'sin(i_gh) = 1 / (4/3) = 0.75 => i_gh ≈ 48.6°.'
        ]
      }
    ]
  },
  {
    id: 'phys-11-2',
    grade: 'Lớp 11',
    lessonNumber: 6,
    title: 'Từ trường & Hiện tượng Cảm ứng Điện từ',
    subtitle: 'Định luật Faraday về suất điện động cảm ứng, quy tắc nắm tay phải và định luật Len-xơ',
    description: 'Khung dây quay trong từ trường nam châm đều B. Quan sát từ thông biến thiên theo hàm sin sinh ra dòng điện xoay chiều i(t) và đèn phát sáng.',
    theorySections: [
      {
        heading: '1. Từ thông qua mạch kín',
        content: 'Từ thông: Φ = B · S · cos(α) (Wb). Trong đó B là cảm ứng từ (T), S là diện tích khung dây (m²), α là góc giữa pháp tuyến n và véc-tơ cảm ứng từ B.'
      },
      {
        heading: '2. Suất điện động cảm ứng Faraday',
        content: 'Khi từ thông qua một mạch kín biến thiên theo thời gian thì trong mạch xuất hiện suất điện động cảm ứng: e_c = - dΦ / dt. Độ lớn: |e_c| = |ΔΦ / Δt|.'
      },
      {
        heading: '3. Định luật Len-xơ',
        content: 'Dòng điện cảm ứng xuất hiện trong mạch kín có chiều sao cho từ trường do nó sinh ra có tác dụng chống lại sự biến thiên của từ thông ban đầu sinh ra nó.'
      }
    ],
    keyFormulas: [
      '\\Phi = B S \\cos(\\alpha)',
      'e_c = -\\frac{\\Delta\\Phi}{\\Delta t}',
      'e = E_0 \\cos(\\omega t + \\varphi)',
      'I_c = \\frac{e_c}{R}'
    ],
    simulationType: 'magnetic_induction',
    defaultParams: {
      magneticField: 0.8, // Tesla
      coilArea: 0.05, // m^2
      rotationSpeed: 30 // vòng/phút
    },
    paramBounds: {
      magneticField: { min: 0.1, max: 2.0, step: 0.1, unit: 'T', label: 'Cảm ứng từ (B)' },
      coilArea: { min: 0.01, max: 0.2, step: 0.01, unit: 'm²', label: 'Diện tích khung dây (S)' },
      rotationSpeed: { min: 5, max: 90, step: 5, unit: 'vòng/p', label: 'Tốc độ quay khung dây (ω)' }
    },
    practiceExercises: [
      {
        question: 'Một khung dây có diện tích S = 0.02 m² đặt trong từ trường đều B = 0.5 T vuông góc với các đường sức từ. Từ thông qua khung dây bằng:',
        options: ['A. 0.01 Wb', 'B. 0.02 Wb', 'C. 0.1 Wb', 'D. 0 Wb'],
        correctIndex: 0,
        explanation: 'Khung dây vuông góc với đường sức từ nghĩa là pháp tuyến n song song với B => góc α = 0° => cos(α) = 1. Từ thông Φ = B · S · cos(0°) = 0.5 · 0.02 · 1 = 0.01 Wb.',
        stepByStep: [
          'Góc α giữa pháp tuyến và B là 0°.',
          'Φ = B * S * cos(0°) = 0.5 * 0.02 = 0.01 Wb.'
        ]
      }
    ]
  },

  // ==========================================
  // LỚP 12: DAO ĐỘNG & SÓNG CƠ HỌC
  // ==========================================
  {
    id: 'phys-12-1',
    grade: 'Lớp 12',
    lessonNumber: 7,
    title: 'Con lắc Lò xo & Dao động Điều hòa',
    subtitle: 'Nghiên cứu li độ x(t), vận tốc v(t), gia tốc a(t) và định luật bảo toàn cơ năng',
    description: 'Mô phỏng 2D con lắc lò xo dao động thời gian thực 60 FPS. Tinh chỉnh độ cứng k, khối lượng m, hệ số cản ma sát, vẽ đồ thị sóng x(t) và véc-tơ lực hồi phục.',
    theorySections: [
      {
        heading: '1. Phương trình dao động điều hòa',
        content: 'Li độ: x = A · cos(ωt + φ). Vận tốc sớm pha π/2 so với li độ: v = x\' = -ωA · sin(ωt + φ). Gia tốc ngược pha với li độ: a = v\' = -ω²x.'
      },
      {
        heading: '2. Tần số góc, chu kỳ & tần số',
        content: 'Tần số góc con lắc lò xo: ω = √(k/m). Chu kỳ dao động: T = 2π√(m/k). Tần số: f = 1/T = (1/2π) · √(k/m).'
      },
      {
        heading: '3. Cơ năng của con lắc lò xo',
        content: 'Động năng: W_đ = 1/2 · m · v². Thế năng đàn hồi: W_t = 1/2 · k · x². Cơ năng bảo toàn: W = W_đ + W_t = 1/2 · k · A² = 1/2 · m · ω² · A² = const.'
      }
    ],
    keyFormulas: [
      'x = A\\cos(\\omega t + \\varphi)',
      'v = -\\omega A\\sin(\\omega t + \\varphi)',
      'a = -\\omega^2 x',
      '\\omega = \\sqrt{\\frac{k}{m}} \\implies T = 2\\pi\\sqrt{\\frac{m}{k}}',
      'W = \\frac{1}{2} k A^2 = \\frac{1}{2} m v_{max}^2'
    ],
    simulationType: 'spring_pendulum',
    defaultParams: {
      mass: 0.5, // kg
      stiffness: 50, // N/m
      amplitude: 0.15, // m
      damping: 0.01 // cản
    },
    paramBounds: {
      mass: { min: 0.1, max: 2.0, step: 0.05, unit: 'kg', label: 'Khối lượng vật (m)' },
      stiffness: { min: 10, max: 200, step: 5, unit: 'N/m', label: 'Độ cứng lò xo (k)' },
      amplitude: { min: 0.05, max: 0.25, step: 0.01, unit: 'm', label: 'Biên độ dao động (A)' },
      damping: { min: 0, max: 0.1, step: 0.005, unit: '', label: 'Hệ số ma sát (μ)' }
    },
    practiceExercises: [
      {
        question: 'Một con lắc lò xo có k = 100 N/m mang vật nặng m = 0.25 kg. Chu kỳ dao động riêng của con lắc là (lấy π² = 10):',
        options: ['A. 0.314 s (hoặc 0.1π s)', 'B. 0.628 s', 'C. 1.0 s', 'D. 2.0 s'],
        correctIndex: 0,
        explanation: 'Áp dụng công thức chu kỳ: T = 2π√(m/k) = 2π√(0.25 / 100) = 2π√(0.0025) = 2π · 0.05 = 0.1π ≈ 0.314 s.',
        stepByStep: [
          'Tần số góc ω = √(k/m) = √(100 / 0.25) = √400 = 20 rad/s.',
          'Chu kỳ T = 2π / ω = 2π / 20 = 0.1π ≈ 0.314 s.'
        ]
      }
    ]
  },
  {
    id: 'phys-12-2',
    grade: 'Lớp 12',
    lessonNumber: 8,
    title: 'Con lắc Đơn & Gia tốc Trọng trường',
    subtitle: 'Nghiên cứu dao động nhỏ góc α ≤ 10°, lực căng dây T và công thức chu kỳ',
    description: 'Kéo thả quả cầu bằng chuột trên màn hình để đặt góc lệch ban đầu α₀. Quan sát đồ thị chu kỳ, lực căng dây tại vị trí biên và vị trí cân bằng.',
    theorySections: [
      {
        heading: '1. Điều kiện dao động điều hòa',
        content: 'Khi góc lệch ban đầu nhỏ (α₀ ≤ 10° ≈ 0.175 rad) thì sin(α) ≈ α (rad). Con lắc đơn dao động điều hòa với phương trình li độ góc: α = α₀ · cos(ωt + φ).'
      },
      {
        heading: '2. Tần số góc và chu kỳ',
        content: 'Tần số góc: ω = √(g/l). Chu kỳ dao động: T = 2π√(l/g). Chu kỳ của con lắc đơn KHÔNG phụ thuộc vào khối lượng quả cầu m!'
      },
      {
        heading: '3. Lực căng dây và vận tốc',
        content: 'Vận tốc tại góc α: v² = 2gl(cosα - cosα₀). Lực căng dây: T_d = mg(3cosα - 2cosα₀). Lực căng cực đại tại VTCB: T_max = mg(3 - 2cosα₀). Lực căng cực tiểu tại biên: T_min = mg · cosα₀.'
      }
    ],
    keyFormulas: [
      '\\omega = \\sqrt{\\frac{g}{l}} \\implies T = 2\\pi\\sqrt{\\frac{l}{g}}',
      'v = \\sqrt{2gl(\\cos\\alpha - \\cos\\alpha_0)}',
      'T_d = mg(3\\cos\\alpha - 2\\cos\\alpha_0)',
      'T_{max} = mg(3 - 2\\cos\\alpha_0) \\quad (\\text{tại VTCB})'
    ],
    simulationType: 'simple_pendulum',
    defaultParams: {
      length: 1.0, // m
      initialAngleDeg: 12, // độ
      mass: 0.2, // kg
      gravity: 9.8
    },
    paramBounds: {
      length: { min: 0.3, max: 2.5, step: 0.05, unit: 'm', label: 'Chiều dài dây (l)' },
      initialAngleDeg: { min: 4, max: 40, step: 1, unit: '°', label: 'Góc lệch ban đầu (α₀)' },
      mass: { min: 0.05, max: 1.0, step: 0.05, unit: 'kg', label: 'Khối lượng quả nặng (m)' },
      gravity: { min: 5, max: 15, step: 0.2, unit: 'm/s²', label: 'Gia tốc trọng trường (g)' }
    },
    practiceExercises: [
      {
        question: 'Muốn chu kỳ dao động của con lắc đơn tăng lên gấp 2 lần thì chiều dài dây treo l phải:',
        options: ['A. Tăng 4 lần', 'B. Tăng 2 lần', 'C. Giảm 2 lần', 'D. Giảm 4 lần'],
        correctIndex: 0,
        explanation: 'Chu kỳ T = 2π√(l/g) tỉ lệ thuận với căn bậc hai của chiều dài l. Để T tăng 2 lần thì l phải tăng 2² = 4 lần.',
        stepByStep: [
          'T = 2π * √(l / g) => T tỉ lệ với √l.',
          'Để T\' = 2T thì √l\' = 2√l => l\' = 4l.'
        ]
      }
    ]
  },
  {
    id: 'phys-12-3',
    grade: 'Lớp 12',
    lessonNumber: 9,
    title: 'Giao thoa Sóng Cơ & Sóng Ánh sáng',
    subtitle: 'Nghiên cứu vân giao thoa cực đại, cực tiểu và đo bước sóng ánh sáng khe Young',
    description: 'Mô phỏng 2D hai nguồn sóng dao động kết hợp cùng pha. Quan sát họ hypebol cực đại (đường liền nét) và cực tiểu (đường đứt nét), tinh chỉnh khoảng cách 2 nguồn d và bước sóng λ.',
    theorySections: [
      {
        heading: '1. Điều kiện xảy ra giao thoa sóng',
        content: 'Hai sóng kết hợp là hai sóng phát ra từ hai nguồn có cùng tần số, cùng phương dao động và có hiệu số pha không đổi theo thời gian.'
      },
      {
        heading: '2. Vị trí cực đại & cực tiểu giao thoa sóng cơ',
        content: 'Hiệu đường đi d₂ - d₁: Cực đại giao thoa: d₂ - d₁ = k · λ (k ∈ Z). Cực tiểu giao thoa: d₂ - d₁ = (k + 0.5) · λ (k ∈ Z).'
      },
      {
        heading: '3. Giao thoa ánh sáng khe Young',
        content: 'Khoảng vân i: là khoảng cách giữa 2 vân sáng hoặc 2 vân tối liên tiếp: i = (λ · D) / a. Tọa độ vân sáng bậc k: x_s = k · i. Tọa độ vân tối thứ k: x_t = (k - 0.5) · i.'
      }
    ],
    keyFormulas: [
      'd_2 - d_1 = k \\lambda \\quad (\\text{Cực đại})',
      'd_2 - d_1 = (k + 0.5) \\lambda \\quad (\\text{Cực tiểu})',
      'i = \\frac{\\lambda D}{a} \\quad (\\text{Khoảng vân Young})',
      '\\lambda = \\frac{a \\cdot i}{D}'
    ],
    simulationType: 'wave_interference',
    defaultParams: {
      sourceDistance: 180, // px
      wavelength: 28, // px
      frequency: 1.5 // Hz
    },
    paramBounds: {
      sourceDistance: { min: 80, max: 260, step: 10, unit: 'px', label: 'Khoảng cách 2 nguồn (d)' },
      wavelength: { min: 14, max: 55, step: 2, unit: 'px', label: 'Bước sóng (λ)' },
      frequency: { min: 0.5, max: 3.0, step: 0.2, unit: 'Hz', label: 'Tần số nguồn (f)' }
    },
    practiceExercises: [
      {
        question: 'Trong thí nghiệm khe Young: a = 1 mm, D = 2 m, ánh sáng có bước sóng λ = 0.5 µm. Khoảng vân i trên màn quan sát là:',
        options: ['A. 1.0 mm', 'B. 0.5 mm', 'C. 2.0 mm', 'D. 1.5 mm'],
        correctIndex: 0,
        explanation: 'i = (λ · D) / a = (0.5 · 10⁻³ mm · 2000 mm) / 1 mm = 1.0 mm.',
        stepByStep: [
          'Đổi đơn vị: a = 1 mm, D = 2000 mm, λ = 0.5 * 10⁻³ mm.',
          'i = (0.5 * 10⁻³ * 2000) / 1 = 1.0 mm.'
        ]
      }
    ]
  }
];
