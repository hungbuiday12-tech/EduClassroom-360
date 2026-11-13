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
  },
  {
    id: 'phys-9-3',
    grade: 'Lớp 9',
    lessonNumber: 3,
    title: 'Công suất Điện & Định luật Jun - Len-xơ',
    subtitle: 'Nhiệt lượng tỏa ra trên điện trở và các phương pháp tiết kiệm điện năng',
    description: 'Khảo sát điện năng tiêu thụ và sự chuyển hóa điện năng thành nhiệt năng, công thức Q = I²Rt và tính toán tiền điện thực tế.',
    theorySections: [
      {
        heading: '1. Điện năng & Công của dòng điện',
        content: 'Điện năng là năng lượng của dòng điện. Công của dòng điện sản ra trong một đoạn mạch là số đo lượng điện năng mà đoạn mạch đó tiêu thụ: A = P · t = U · I · t (J hoặc kWh, 1 kWh = 3.6·10⁶ J).'
      },
      {
        heading: '2. Định luật Jun - Len-xơ',
        content: 'Nhiệt lượng tỏa ra ở dây dẫn khi có dòng điện chạy qua tỉ lệ thuận với bình phương cường độ dòng điện, với điện trở của dây dẫn và thời gian dòng điện chạy qua: Q = I² · R · t.'
      }
    ],
    keyFormulas: [
      'A = U I t = P t',
      'Q = I^2 R t \\quad (\\text{Jun - Lenxo})',
      '1 \\text{ kWh} = 3.6 \\cdot 10^6 \\text{ J}'
    ],
    simulationType: 'ohm_circuit',
    defaultParams: {
      voltage: 220,
      resistor1: 44,
      resistor2: 44,
      circuitMode: 1
    },
    paramBounds: {
      voltage: { min: 50, max: 240, step: 10, unit: 'V', label: 'Hiệu điện thế (U)' },
      resistor1: { min: 10, max: 100, step: 2, unit: 'Ω', label: 'Điện trở R₁' },
      resistor2: { min: 10, max: 100, step: 2, unit: 'Ω', label: 'Điện trở R₂' },
      circuitMode: { min: 0, max: 1, step: 1, unit: '', label: 'Chế độ (0: Nối tiếp, 1: Song song)' }
    },
    practiceExercises: [
      {
        question: 'Dòng điện có cường độ 2A chạy qua một điện trở 50Ω trong thời gian 10 phút. Nhiệt lượng tỏa ra trên điện trở là:',
        options: ['A. 120 kJ', 'B. 20 kJ', 'C. 1.2 kJ', 'D. 200 kJ'],
        correctIndex: 0,
        explanation: 'Q = I² · R · t = (2)² · 50 · (10 · 60) = 4 · 50 · 600 = 120,000 J = 120 kJ.'
      }
    ]
  },
  {
    id: 'phys-10-3',
    grade: 'Lớp 10',
    lessonNumber: 5,
    title: 'Định luật II Newton & Vật trên mặt phẳng nghiêng',
    subtitle: 'Phân tích trọng lực P, phản lực N, lực ma sát và gia tốc chuyển động',
    description: 'Mô phỏng 2D khối vật chuyển động trượt trên dốc nghiêng có ma sát. Khảo sát góc dốc α, hệ số ma sát μ và đo gia tốc tức thời.',
    theorySections: [
      {
        heading: '1. Nội dung định luật II Newton',
        content: 'Gia tốc của một vật cùng hướng với lực tác dụng lên vật. Độ lớn của gia tốc tỉ lệ thuận với độ lớn của lực và tỉ lệ nghịch với khối lượng của vật: a = F_net / m.'
      },
      {
        heading: '2. Chuyển động trên dốc nghiêng góc α',
        content: 'Phân tích trọng lực: P_x = m·g·sinα (kéo vật xuống dốc), P_y = m·g·cosα (ép vào mặt phẳng). Lực ma sát trượt: F_ms = μ·N = μ·m·g·cosα. Gia tốc khi trượt xuống: a = g(sinα - μ·cosα).'
      }
    ],
    keyFormulas: [
      '\\vec{a} = \\frac{\\sum \\vec{F}}{m}',
      'F_{ms} = \\mu N = \\mu m g \\cos \\alpha',
      'a = g(\\sin \\alpha - \\mu \\cos \\alpha)'
    ],
    simulationType: 'projectile_motion',
    defaultParams: {
      angleDeg: 30,
      v0: 15,
      height: 0,
      gravity: 9.8
    },
    paramBounds: {
      angleDeg: { min: 10, max: 80, step: 5, unit: '°', label: 'Góc nghiêng / góc bắn' },
      v0: { min: 5, max: 40, step: 1, unit: 'm/s', label: 'Vận tốc đầu (v₀)' },
      height: { min: 0, max: 20, step: 1, unit: 'm', label: 'Độ cao ban đầu (h)' },
      gravity: { min: 5, max: 15, step: 0.2, unit: 'm/s²', label: 'Gia tốc trọng trường (g)' }
    },
    practiceExercises: [
      {
        question: 'Một vật trượt không ma sát xuống mặt phẳng nghiêng góc α = 30° so với phương ngang. Lấy g = 10 m/s². Gia tốc của vật là:',
        options: ['A. 5.0 m/s²', 'B. 8.66 m/s²', 'C. 10 m/s²', 'D. 2.5 m/s²'],
        correctIndex: 0,
        explanation: 'Do không có ma sát: a = g · sinα = 10 · sin(30°) = 10 · 0.5 = 5.0 m/s².'
      }
    ]
  },
  {
    id: 'phys-11-3',
    grade: 'Lớp 11',
    lessonNumber: 7,
    title: 'Từ trường của dòng điện & Lực từ Ampe',
    subtitle: 'Quy tắc nắm tay phải, quy tắc bàn tay trái và lực tác dụng lên hạt điện tích',
    description: 'Mô phỏng 2D đường sức từ xung quanh dây dẫn thẳng, cuộn dây tròn và lực Ampe tác dụng làm lệch khung dây mang dòng điện.',
    theorySections: [
      {
        heading: '1. Từ trường dòng điện trong dây dẫn thẳng dài',
        content: 'Cảm ứng từ tại điểm cách dây khoảng cách r: B = 2·10⁻⁷ · (I / r) (Tesla). Chiều đường sức từ xác định theo quy tắc nắm tay phải.'
      },
      {
        heading: '2. Lực từ tác dụng lên đoạn dây dẫn (Lực Ampe)',
        content: 'F = B · I · L · sinα. Chiều của lực Ampe tuân theo quy tắc bàn tay trái: Đặt bàn tay trái hứng đường sức từ, ngón giữa chỉ chiều dòng điện, ngón cái choãi 90° chỉ chiều lực từ.'
      }
    ],
    keyFormulas: [
      'B = 2 \\cdot 10^{-7} \\frac{I}{r}',
      'F = B I L \\sin \\alpha \\quad (\\text{Lực Ampe})',
      'f_L = |q| v B \\sin \\alpha \\quad (\\text{Lực Lorenxo})'
    ],
    simulationType: 'magnetic_induction',
    defaultParams: {
      turns: 200,
      magnetSpeed: 1.5,
      area: 25
    },
    paramBounds: {
      turns: { min: 50, max: 500, step: 25, unit: 'vòng', label: 'Số vòng dây (N)' },
      magnetSpeed: { min: 0.5, max: 4.0, step: 0.2, unit: 'm/s', label: 'Vận tốc nam châm (v)' },
      area: { min: 10, max: 50, step: 5, unit: 'cm²', label: 'Diện tích vòng dây (S)' }
    },
    practiceExercises: [
      {
        question: 'Đoạn dây dẫn dài L = 0.2m mang dòng điện I = 5A đặt vuông góc với cảm ứng từ B = 0.4T. Độ lớn lực từ tác dụng lên đoạn dây là:',
        options: ['A. 0.4 N', 'B. 0.2 N', 'C. 0.8 N', 'D. 1.0 N'],
        correctIndex: 0,
        explanation: 'F = B · I · L · sin(90°) = 0.4 · 5 · 0.2 · 1 = 0.4 N.'
      }
    ]
  },
  {
    id: 'phys-12-4',
    grade: 'Lớp 12',
    lessonNumber: 10,
    title: 'Mạch điện Xoay chiều RLC nối tiếp & Cộng hưởng điện',
    subtitle: 'Nghiên cứu trở kháng Z, độ lệch pha φ và điều kiện cộng hưởng ω²LC = 1',
    description: 'Mô phỏng 2D dao động điện xoay chiều, giản đồ vector Fresnel quay, biểu diễn dòng điện và hiệu điện thế tức thời thời gian thực.',
    theorySections: [
      {
        heading: '1. Điện áp & Dòng điện xoay chiều',
        content: 'i = I₀ · cos(ωt + φ_i), u = U₀ · cos(ωt + φ_u). Cảm kháng: Z_L = ωL, Dung kháng: Z_C = 1 / (ωC). Tổng trở mạch RLC: Z = √[R² + (Z_L - Z_C)²].'
      },
      {
        heading: '2. Hiện tượng Cộng hưởng điện',
        content: 'Khi Z_L = Z_C (tức là ω = 1 / √(LC)), tổng trở Z đạt giá trị nhỏ nhất Z_min = R, cường độ dòng điện hiệu dụng đạt cực đại I_max = U / R, u và i cùng pha (cosφ = 1).'
      }
    ],
    keyFormulas: [
      'Z = \\sqrt{R^2 + (Z_L - Z_C)^2}',
      '\\tan \\varphi = \\frac{Z_L - Z_C}{R}',
      '\\omega_{ch} = \\frac{1}{\\sqrt{LC}} \\implies Z_L = Z_C',
      'P = U I \\cos \\varphi = I^2 R'
    ],
    simulationType: 'spring_pendulum',
    defaultParams: {
      mass: 0.5,
      springK: 50,
      amplitude: 60,
      damping: 0.05
    },
    paramBounds: {
      mass: { min: 0.1, max: 2.0, step: 0.1, unit: 'kg', label: 'Khối lượng / Hệ số tự cảm L' },
      springK: { min: 10, max: 150, step: 5, unit: 'N/m', label: 'Độ cứng K / Nghịch đảo điện dung 1/C' },
      amplitude: { min: 20, max: 100, step: 5, unit: 'px', label: 'Biên độ điện áp cực đại U₀' },
      damping: { min: 0, max: 0.2, step: 0.01, unit: '', label: 'Hệ số cản / Điện trở R' }
    },
    practiceExercises: [
      {
        question: 'Trong mạch RLC nối tiếp có R = 40Ω, Z_L = 80Ω, Z_C = 50Ω. Tổng trở Z của đoạn mạch là:',
        options: ['A. 50 Ω', 'B. 70 Ω', 'C. 40 Ω', 'D. 90 Ω'],
        correctIndex: 0,
        explanation: 'Z = √[R² + (Z_L - Z_C)²] = √[40² + (80 - 50)²] = √[1600 + 900] = √2500 = 50 Ω.'
      }
    ]
  },
  {
    id: 'phys-9-4',
    grade: 'Lớp 9',
    lessonNumber: 4,
    title: 'Hiện tượng Cảm ứng Điện từ & Máy phát điện Xoay chiều',
    subtitle: 'Điều kiện xuất hiện dòng điện cảm ứng, định luật Lenz và truyền tải điện năng đi xa',
    description: 'Khảo sát sự biến thiên từ thông qua cuộn dây khi nam châm quay hoặc tịnh tiến, nguyên lý hoạt động của máy biến áp và giảm hao phí trên đường dây.',
    theorySections: [
      {
        heading: '1. Điều kiện xuất hiện dòng điện cảm ứng',
        content: 'Dòng điện cảm ứng xuất hiện trong cuộn dây dẫn kín khi số đường sức từ (từ thông $\\Phi = B \\cdot S \\cdot \\cos\\alpha$) xuyên qua tiết diện $S$ của cuộn dây biến thiên theo thời gian.'
      },
      {
        heading: '2. Dòng điện xoay chiều & Máy biến áp',
        content: 'Khi khung dây quay đều trong từ trường, trong khung xuất hiện suất điện động xoay chiều đổi chiều liên tục. Máy biến áp thay đổi điện áp theo tỉ số vòng dây: $\\frac{U_1}{U_2} = \\frac{N_1}{N_2}$. Công suất hao phí khi truyền tải: $\\Delta P = \\frac{P^2 R}{U^2}$ (tăng điện áp lên $k$ lần giúp giảm hao phí $k^2$ lần).'
      }
    ],
    keyFormulas: [
      '\\Phi = N B S \\cos \\alpha',
      'e_c = -\\frac{\\Delta \\Phi}{\\Delta t}',
      '\\frac{U_1}{U_2} = \\frac{N_1}{N_2}',
      '\\Delta P = \\frac{P^2 R}{U^2}'
    ],
    simulationType: 'magnetic_induction',
    defaultParams: {
      turns: 250,
      magnetSpeed: 2.0,
      area: 30
    },
    paramBounds: {
      turns: { min: 50, max: 500, step: 25, unit: 'vòng', label: 'Số vòng dây (N)' },
      magnetSpeed: { min: 0.5, max: 4.0, step: 0.2, unit: 'm/s', label: 'Tốc độ biến thiên từ thông' },
      area: { min: 10, max: 50, step: 5, unit: 'cm²', label: 'Tiết diện vòng dây (S)' }
    },
    practiceExercises: [
      {
        question: 'Một máy biến áp lí tưởng có cuộn sơ cấp $N_1 = 500$ vòng đặt vào hiệu điện thế $U_1 = 220\\text{ V}$. Muốn điện áp thứ cấp bằng $110\\text{ V}$ thì số vòng dây cuộn thứ cấp $N_2$ là:',
        options: ['A. 250 vòng', 'B. 1000 vòng', 'C. 500 vòng', 'D. 125 vòng'],
        correctIndex: 0,
        explanation: 'Áp dụng công thức máy biến áp: $\\frac{U_1}{U_2} = \\frac{N_1}{N_2} \\implies N_2 = N_1 \\cdot \\frac{U_2}{U_1} = 500 \\cdot \\frac{110}{220} = 250$ vòng.'
      }
    ]
  },
  {
    id: 'phys-11-4',
    grade: 'Lớp 11',
    lessonNumber: 8,
    title: 'Định luật Cu-lông, Điện trường & Tụ điện',
    subtitle: 'Tương tác tĩnh điện trong điện môi, cường độ điện trường E và năng lượng điện trường tụ điện',
    description: 'Hệ thống hóa các đại lượng đặc trưng của điện trường tĩnh: lực Cu-lông, vectơ cường độ điện trường, hiệu điện thế và ghép tụ điện.',
    theorySections: [
      {
        heading: '1. Định luật Cu-lông & Cường độ điện trường',
        content: 'Lực tương tác giữa hai điện tích điểm trong môi trường hằng số điện môi $\\varepsilon$: $F = k \\frac{|q_1 q_2|}{\\varepsilon r^2}$ với $k = 9 \\cdot 10^9 \\text{ N}\\cdot\\text{m}^2/\\text{C}^2$. Cường độ điện trường tại điểm cách $Q$ khoảng $r$: $E = k \\frac{|Q|}{\\varepsilon r^2}$.'
      },
      {
        heading: '2. Công lực điện, Hiệu điện thế & Tụ điện',
        content: 'Công của lực điện trường đều không phụ thuộc hình dạng đường đi: $A_{MN} = q E d$. Hiệu điện thế $U = E \\cdot d$. Điện dung tụ điện: $C = \\frac{Q}{U}$, năng lượng tụ điện: $W = \\frac{1}{2} C U^2 = \\frac{Q^2}{2C}$.'
      }
    ],
    keyFormulas: [
      'F = k \\frac{|q_1 q_2|}{\\varepsilon r^2}',
      'E = \\frac{F}{|q|} = k \\frac{|Q|}{\\varepsilon r^2}',
      'A_{MN} = q E d = q U_{MN}',
      'W = \\frac{1}{2} C U^2 = \\frac{1}{2} Q U'
    ],
    simulationType: 'ohm_circuit',
    defaultParams: {
      voltage: 18,
      resistor1: 8,
      resistor2: 12,
      circuitMode: 0
    },
    paramBounds: {
      voltage: { min: 2, max: 30, step: 1, unit: 'V', label: 'Hiệu điện thế (U)' },
      resistor1: { min: 1, max: 20, step: 1, unit: 'Ω', label: 'Thông số nhánh 1' },
      resistor2: { min: 1, max: 20, step: 1, unit: 'Ω', label: 'Thông số nhánh 2' },
      circuitMode: { min: 0, max: 1, step: 1, unit: '', label: 'Kiểu mạch (0: Nối tiếp, 1: Song song)' }
    },
    practiceExercises: [
      {
        question: 'Một tụ điện có điện dung $C = 20\\,\\mu\\text{F}$ được tích điện ở hiệu điện thế $U = 100\\text{ V}$. Năng lượng điện trường dự trữ trong tụ là:',
        options: ['A. 0.1 J', 'B. 0.2 J', 'C. 1.0 J', 'D. 0.05 J'],
        correctIndex: 0,
        explanation: 'Đổi $C = 20 \\cdot 10^{-6}\\text{ F}$. Năng lượng tụ điện: $W = \\frac{1}{2} C U^2 = 0.5 \\cdot 20 \\cdot 10^{-6} \\cdot 100^2 = 0.1\\text{ J}$.'
      }
    ]
  },
  {
    id: 'phys-12-5',
    grade: 'Lớp 12',
    lessonNumber: 11,
    title: 'Lượng tử Ánh sáng, Hiện tượng Quang điện & Mẫu Bohr',
    subtitle: 'Thuyết lượng tử Planck, công thức Anh-xtanh và bức xạ vạch quang phổ của nguyên tử Hiđrô',
    description: 'Khám phá bản chất hạt của ánh sáng thông qua photon năng lượng ε = hf, điều kiện xảy ra quang điện ngoài và sự chuyển mức năng lượng lượng tử trong nguyên tử Hiđrô (kết hợp tab Mô phỏng 3D Bohr).',
    theorySections: [
      {
        heading: '1. Thuyết lượng tử ánh sáng & Hiện tượng quang điện',
        content: 'Mỗi photon mang năng lượng $\\varepsilon = h f = \\frac{h c}{\\lambda}$ ($h = 6.625 \\cdot 10^{-34}\\text{ J}\\cdot\\text{s}$). Để xảy ra hiện tượng quang điện ngoài thì bước sóng ánh sáng kích thích phải thỏa điều kiện $\\lambda \\le \\lambda_0 = \\frac{hc}{A}$ (với $A$ là công thoát electron).'
      },
      {
        heading: '2. Tiên đề Bohr & Quang phổ nguyên tử Hiđrô',
        content: 'Bán kính quỹ đạo dừng thứ $n$: $r_n = n^2 r_0$ ($r_0 = 5.3 \\cdot 10^{-11}\\text{ m}$). Mức năng lượng dừng của electron trong nguyên tử Hiđrô: $E_n = -\\frac{13.6}{n^2}\\text{ (eV)}$. Khi chuyển từ mức cao $E_m$ về mức thấp $E_n$, nguyên tử phát ra photon có năng lượng $\\varepsilon = E_m - E_n$.'
      }
    ],
    keyFormulas: [
      '\\varepsilon = h f = \\frac{h c}{\\lambda}',
      '\\lambda_0 = \\frac{h c}{A}',
      'E_n = -\\frac{13.6}{n^2} \\text{ eV}',
      'h f = E_{cao} - E_{thap}'
    ],
    simulationType: 'wave_interference',
    defaultParams: {
      wavelength: 35,
      separation: 120
    },
    paramBounds: {
      wavelength: { min: 15, max: 60, step: 1, unit: 'px', label: 'Bước sóng ánh sáng (λ)' },
      separation: { min: 60, max: 200, step: 10, unit: 'px', label: 'Khoảng cách nguồn sáng' }
    },
    practiceExercises: [
      {
        question: 'Công thoát của electron khỏi kim loại kẽm là $A = 3.55\\text{ eV}$. Lấy $hc = 1.9875 \\cdot 10^{-25}\\text{ J}\\cdot\\text{m}$, $1\\text{ eV} = 1.6 \\cdot 10^{-19}\\text{ J}$. Giới hạn quang điện $\\lambda_0$ của kẽm xấp xỉ:',
        options: ['A. 0.35 µm', 'B. 0.55 µm', 'C. 0.25 µm', 'D. 0.42 µm'],
        correctIndex: 0,
        explanation: 'Đổi $A = 3.55 \\cdot 1.6 \\cdot 10^{-19} = 5.68 \\cdot 10^{-19}\\text{ J}$. Giới hạn quang điện $\\lambda_0 = \\frac{hc}{A} = \\frac{1.9875 \\cdot 10^{-25}}{5.68 \\cdot 10^{-19}} \\approx 0.35 \\cdot 10^{-6}\\text{ m} = 0.35\\,\\mu\\text{m}$.'
      }
    ]
  },
  {
    id: 'phys-12-6',
    grade: 'Lớp 12',
    lessonNumber: 12,
    title: 'Vật lý Hạt nhân, Độ hụt khối & Phản ứng Hạt nhân',
    subtitle: 'Hệ thức Einstein E = mc², năng lượng liên kết riêng và định luật phóng xạ',
    description: 'Tính độ hụt khối Δm, năng lượng liên kết riêng xác định độ bền vững hạt nhân, phương trình phóng xạ và bài toán năng lượng tỏa/thu trong phản ứng hạt nhân.',
    theorySections: [
      {
        heading: '1. Độ hụt khối & Năng lượng liên kết',
        content: 'Độ hụt khối của hạt nhân $^A_Z X$: $\\Delta m = Z m_p + (A - Z) m_n - m_X$. Năng lượng liên kết: $W_{lk} = \\Delta m \\cdot c^2$. Năng lượng liên kết riêng $\\frac{W_{lk}}{A}$ càng lớn thì hạt nhân càng bền vững.'
      },
      {
        heading: '2. Định luật Phóng xạ & Phản ứng hạt nhân',
        content: 'Số hạt nhân còn lại sau thời gian $t$: $N(t) = N_0 \\cdot 2^{-t/T} = N_0 e^{-\\lambda t}$, với $T = \\frac{\\ln 2}{\\lambda}$ là chu kỳ bán rã. Năng lượng phản ứng hạt nhân: $\\Delta E = (m_{truoc} - m_{sau}) c^2 = (\\Delta m_{sau} - \\Delta m_{truoc}) c^2$.'
      }
    ],
    keyFormulas: [
      '\\Delta m = Z m_p + (A - Z) m_n - m_X',
      'W_{lk} = \\Delta m \\cdot c^2',
      'N(t) = N_0 \\cdot 2^{-\\frac{t}{T}}',
      '\\Delta E = (m_{truoc} - m_{sau}) c^2'
    ],
    simulationType: 'free_fall_energy',
    defaultParams: {
      height: 50,
      gravity: 9.8,
      mass: 2.0
    },
    paramBounds: {
      height: { min: 10, max: 100, step: 5, unit: 'm', label: 'Mức thế năng quy chiếu' },
      gravity: { min: 5, max: 15, step: 0.2, unit: 'm/s²', label: 'Cường độ trường (g)' },
      mass: { min: 0.5, max: 5.0, step: 0.5, unit: 'kg', label: 'Khối lượng tương đương (m)' }
    },
    practiceExercises: [
      {
        question: 'Một chất phóng xạ ban đầu có $N_0$ hạt nhân. Sau thời gian bằng 3 lần chu kỳ bán rã ($t = 3T$), tỉ lệ phần trăm số hạt nhân đã bị phân rã là:',
        options: ['A. 87.5%', 'B. 12.5%', 'C. 75%', 'D. 25%'],
        correctIndex: 0,
        explanation: 'Số hạt nhân còn lại sau $t = 3T$ là $N = N_0 \\cdot 2^{-3} = \\frac{1}{8} N_0 = 12.5\\% N_0$. Vậy số hạt nhân đã bị phân rã là $100\\% - 12.5\\% = 87.5\\%$.'
      }
    ]
  }
];
