import {
  MathLecture,
  PhysicsExperiment,
  CodingProblem,
  LiteratureWork,
} from '../types';

export const MATH_LECTURES: MathLecture[] = [
  {
    id: 'math-1',
    title: 'Khảo sát sự biến thiên & Đồ thị hàm số bậc ba',
    grade: 'Lớp 12 - Giải tích',
    description: 'Nắm vững quy trình khảo sát đạo hàm $y\' = 3ax^2 + 2bx + c$, các dạng đồ thị chữ N/chữ N ngược, cực đại, cực tiểu và tâm đối xứng.',
    theory: [
      '1. Tập xác định: D = R với hàm số đa thức bậc ba $y = ax^3 + bx^2 + cx + d$ ($a \\neq 0$).',
      '2. Đạo hàm: $y\' = 3ax^2 + 2bx + c$. Biệt thức $\\Delta\' = b^2 - 3ac$.',
      '3. Nếu $\\Delta\' > 0$: Đồ thị có 2 điểm cực trị. Nếu $\\Delta\' \\le 0$: Hàm số luôn đồng biến hoặc luôn nghịch biến trên R (không có cực trị).',
      '4. Tâm đối xứng của đồ thị: Là điểm uốn $I(x_0, y_0)$ với $x_0 = -\\frac{b}{3a}$ (nghiệm của $y\'\' = 0$).',
      '5. Đồ thị luôn cắt trục hoành tại ít nhất một điểm thực.'
    ],
    keyFormulas: [
      'y = ax^3 + bx^2 + cx + d',
      'y\' = 3ax^2 + 2bx + c',
      'x_{uon} = -b / (3a)',
      '\\Delta\' = b^2 - 3ac'
    ],
    sampleProblems: [
      {
        question: 'Cho hàm số $y = x^3 - 3x^2 + 2$. Điểm cực đại của đồ thị hàm số là:',
        options: [
          'A. (0; 2)',
          'B. (2; -2)',
          'C. (1; 0)',
          'D. (-1; -2)'
        ],
        correctIndex: 0,
        explanation: 'Ta có $y\' = 3x^2 - 6x = 3x(x - 2)$. Nghiệm $x=0$ hoặc $x=2$. Bảng xét dấu $y\'$: qua $x=0$ đạo hàm đổi dấu từ (+) sang (-) nên $x=0$ là điểm cực đại, $y(0) = 2$. Vậy tọa độ điểm cực đại là (0; 2).'
      },
      {
        question: 'Đồ thị hàm số $y = -x^3 + 3x - 1$ nhận điểm nào sau đây làm tâm đối xứng?',
        options: [
          'A. (0; -1)',
          'B. (1; 1)',
          'C. (-1; -3)',
          'D. (0; 0)'
        ],
        correctIndex: 0,
        explanation: 'Ta có $y\'\' = -6x$. $y\'\' = 0 \\Leftrightarrow x = 0$. Thay vào hàm số được $y(0) = -1$. Vậy tâm đối xứng (điểm uốn) là $I(0; -1)$.'
      }
    ],
    defaultGraphConfig: {
      type: 'cubic',
      params: { a: 1, b: -3, c: 0, d: 2 },
      color: '#3b82f6',
      name: 'y = x³ - 3x² + 2'
    }
  },
  {
    id: 'math-2',
    title: 'Hàm số phân thức hữu tỉ bậc nhất y = (ax+b)/(cx+d)',
    grade: 'Lớp 12 - Giải tích',
    description: 'Quy tắc xác định tiệm cận đứng $x = -d/c$, tiệm cận ngang $y = a/c$, tâm đối xứng và hình dáng hypebol vuông góc.',
    theory: [
      '1. Tập xác định: $D = R \\setminus \\{-d/c\\}$ ($c \\neq 0, ad - bc \\neq 0$).',
      '2. Đạo hàm: $y\' = \\frac{ad - bc}{(cx + d)^2}$. Dấu của đạo hàm hoàn toàn phụ thuộc vào tử số $ad - bc$.',
      '3. Nếu $ad - bc > 0$: Hàm số đồng biến trên từng khoảng xác định. Đồ thị nằm ở góc phần tư II và IV so với 2 tiệm cận.',
      '4. Nếu $ad - bc < 0$: Hàm số nghịch biến trên từng khoảng xác định. Đồ thị nằm ở góc phần tư I và III.',
      '5. Tiệm cận đứng: Đường thẳng $x = -\\frac{d}{c}$. Tiệm cận ngang: Đường thẳng $y = \\frac{a}{c}$. Tâm đối xứng là giao điểm 2 tiệm cận $I(-d/c; a/c)$.'
    ],
    keyFormulas: [
      'y = \\frac{ax + b}{cx + d}',
      'y\' = \\frac{ad - bc}{(cx + d)^2}',
      'TCĐ: x = -d / c',
      'TCN: y = a / c'
    ],
    sampleProblems: [
      {
        question: 'Hàm số $y = \\frac{2x + 1}{x - 1}$ có giao điểm của hai đường tiệm cận là:',
        options: [
          'A. (1; 2)',
          'B. (-1; 2)',
          'C. (2; 1)',
          'D. (1; -1)'
        ],
        correctIndex: 0,
        explanation: 'Tiệm cận đứng là $x = 1$, tiệm cận ngang là $y = 2/1 = 2$. Do đó giao điểm của hai tiệm cận là $I(1; 2)$.'
      }
    ],
    defaultGraphConfig: {
      type: 'rational',
      params: { a: 2, b: 1, c: 1, d: -1 },
      color: '#06b6d4',
      name: 'y = (2x + 1)/(x - 1)'
    }
  },
  {
    id: 'math-3',
    title: 'Định lý Pythagoras & Hình học lượng giác trong tam giác',
    grade: 'Lớp 9-10 - Hình học',
    description: 'Khám phá trực quan hệ thức lượng tam giác vuông, định lý Cosin, định lý Sin và công thức diện tích tam giác Heron.',
    theory: [
      '1. Định lý Pythagoras: Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông: $a^2 = b^2 + c^2$.',
      '2. Hệ thức lượng trong tam giác vuông: $b^2 = a \\cdot b\'$, $c^2 = a \\cdot c\'$, $h^2 = b\' \\cdot c\'$, $a \\cdot h = b \\cdot c$.',
      '3. Định lý Cosin trong tam giác bất kỳ: $a^2 = b^2 + c^2 - 2bc \\cos A$.',
      '4. Định lý Sin: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$.',
      '5. Diện tích tam giác: $S = \\frac{1}{2}ah = \\frac{1}{2}ab\\sin C = \\frac{abc}{4R} = pr = \\sqrt{p(p-a)(p-b)(p-c)}$.'
    ],
    keyFormulas: [
      'a^2 = b^2 + c^2 (Pythagoras)',
      'a^2 = b^2 + c^2 - 2bc\\cos(A)',
      'S = \\frac{1}{2} a h_a = \\frac{1}{2} ab \\sin(C)',
      'S = \\sqrt{p(p-a)(p-b)(p-c)}'
    ],
    sampleProblems: [
      {
        question: 'Cho tam giác $ABC$ có $b = 6, c = 8$, góc $A = 60^\\circ$. Độ dài cạnh $a$ là:',
        options: [
          'A. $2\\sqrt{13}$',
          'B. $10$',
          'C. $2\\sqrt{37}$',
          'D. $\\sqrt{52}$'
        ],
        correctIndex: 0,
        explanation: 'Áp dụng định lý Cosin: $a^2 = b^2 + c^2 - 2bc \\cos A = 6^2 + 8^2 - 2(6)(8)\\cos 60^\\circ = 36 + 64 - 48 = 52$. Vậy $a = \\sqrt{52} = 2\\sqrt{13}$.'
      }
    ]
  }
];

export const PHYSICS_EXPERIMENTS: PhysicsExperiment[] = [
  {
    id: 'spring_pendulum',
    title: 'Con lắc lò xo dao động điều hòa',
    subtitle: 'Nghiên cứu li độ x(t), vận tốc v(t), lực hồi phục F và sự bảo toàn cơ năng',
    category: 'Cơ học & Dao động',
    description: 'Mô phỏng 2D một vật nặng khối lượng m gắn vào đầu lò xo độ cứng k trượt không ma sát (hoặc có ma sát tắt dần). Quan sát véc-tơ vận tốc, véc-tơ lực và đồ thị năng lượng thời gian thực.',
    keyConcepts: [
      'Tần số góc riêng: $\\omega = \\sqrt{k/m}$',
      'Chu kỳ dao động: $T = 2\\pi \\sqrt{m/k}$',
      'Phương trình li độ: $x = A\\cos(\\omega t + \\varphi)$',
      'Cơ năng bảo toàn: $W = W_d + W_t = \\frac{1}{2}mv^2 + \\frac{1}{2}kx^2 = \\frac{1}{2}kA^2$'
    ],
    defaultParams: {
      mass: 0.5,       // kg
      stiffness: 50,    // N/m
      amplitude: 0.15,  // m (15 cm)
      damping: 0.02     // hệ số cản
    },
    paramBounds: {
      mass: { min: 0.1, max: 2.0, step: 0.05, unit: 'kg', label: 'Khối lượng (m)' },
      stiffness: { min: 10, max: 200, step: 5, unit: 'N/m', label: 'Độ cứng lò xo (k)' },
      amplitude: { min: 0.05, max: 0.25, step: 0.01, unit: 'm', label: 'Biên độ ban đầu (A)' },
      damping: { min: 0, max: 0.1, step: 0.005, unit: '', label: 'Hệ số ma sát (μ)' }
    },
    theoryMarkdown: `### 1. Bản chất dao động con lắc lò xo
Khi kéo quả nặng khỏi vị trí cân bằng một đoạn rồi buông tay, lực đàn hồi của lò xo đóng vai trò lực kéo về (lực hồi phục):
$$F = -kx$$
Theo định luật II Newton:
$$m a = -kx \\implies a = -\\frac{k}{m}x = -\\omega^2 x$$
với $\\omega = \\sqrt{\\frac{k}{m}}$. Nghiệm của phương trình là dao động điều hòa li độ $x(t) = A\\cos(\\omega t + \\varphi)$.

### 2. Sự chuyển hóa năng lượng
- **Động năng:** $W_d = \\frac{1}{2}mv^2$ (cực đại ở VTCB, bằng 0 ở vị trí biên).
- **Thế năng:** $W_t = \\frac{1}{2}kx^2$ (cực đại ở vị trí biên, bằng 0 ở VTCB).
- **Cơ năng:** Luôn bảo toàn khi không có ma sát: $W = W_d + W_t = \\frac{1}{2}kA^2 = \\text{const}$.`,
    quiz: [
      {
        question: 'Nếu tăng độ cứng k của lò xo lên 4 lần và giữ nguyên khối lượng m thì chu kỳ T dao động sẽ:',
        options: [
          'A. Giảm 2 lần',
          'B. Tăng 2 lần',
          'C. Giảm 4 lần',
          'D. Không thay đổi'
        ],
        correctIndex: 0,
        explanation: 'Chu kỳ $T = 2\\pi\\sqrt{m/k}$. Khi $k$ tăng 4 lần thì mẫu số tăng $\\sqrt{4} = 2$ lần, do đó chu kỳ $T$ giảm 2 lần.'
      },
      {
        question: 'Khi con lắc lò xo đi qua vị trí cân bằng thì:',
        options: [
          'A. Vận tốc có độ lớn cực đại, lực đàn hồi bằng không',
          'B. Gia tốc cực đại, vận tốc bằng không',
          'C. Cơ năng bằng không, thế năng cực đại',
          'D. Li độ cực đại, vận tốc bằng không'
        ],
        correctIndex: 0,
        explanation: 'Tại vị trí cân bằng ($x = 0$): Li độ $x = 0$, gia tốc $a = -\\omega^2 x = 0$, lực hồi phục $F = -kx = 0$. Vận tốc đạt độ lớn cực đại $v_{max} = \\omega A$, động năng đạt cực đại.'
      }
    ]
  },
  {
    id: 'simple_pendulum',
    title: 'Con lắc đơn & Gia tốc trọng trường',
    subtitle: 'Khảo sát ảnh hưởng của chiều dài dây l, góc lệch ban đầu và gia tốc g',
    category: 'Cơ học & Dao động',
    description: 'Mô phỏng chuyển động lắc của một quả cầu treo trên sợi dây không dãn. Kéo thả quả lắc bằng chuột hoặc tinh chỉnh góc lệch để quan sát chu kỳ và lực căng dây.',
    keyConcepts: [
      'Chu kỳ dao động nhỏ: $T = 2\\pi \\sqrt{l/g}$',
      'Tần số góc: $\\omega = \\sqrt{g/l}$',
      'Lực căng dây: $T_d = mg(3\\cos\\alpha - 2\\cos\\alpha_0)$',
      'Vận tốc tại góc lệch $\\alpha$: $v = \\sqrt{2gl(\\cos\\alpha - \\cos\\alpha_0)}$'
    ],
    defaultParams: {
      length: 1.0,     // m
      gravity: 9.8,    // m/s^2
      angle0: 20,      // độ
      damping: 0.01
    },
    paramBounds: {
      length: { min: 0.3, max: 2.5, step: 0.05, unit: 'm', label: 'Chiều dài dây (l)' },
      gravity: { min: 1.6, max: 24.8, step: 0.2, unit: 'm/s²', label: 'Gia tốc trọng trường (g)' },
      angle0: { min: 5, max: 70, step: 1, unit: 'độ', label: 'Góc lệch ban đầu (α₀)' },
      damping: { min: 0, max: 0.05, step: 0.005, unit: '', label: 'Sức cản môi trường' }
    },
    theoryMarkdown: `### 1. Dao động của con lắc đơn
Con lắc đơn gồm một vật nặng điểm khối lượng m treo vào sợi dây nhẹ không dãn chiều dài l tại nơi có gia tốc trọng trường g.
Khi góc lệch $\\alpha$ nhỏ ($\\alpha < 10^\\circ$ tương đương $< 0.174 \\text{ rad}$), ta có $\\sin\\alpha \\approx \\alpha$, phương trình vi phân chuyển động:
$$\\alpha\'\' + \\frac{g}{l}\\alpha = 0$$
Dao động coi như điều hòa với chu kỳ:
$$T = 2\\pi \\sqrt{\\frac{l}{g}}$$
Chu kỳ của con lắc đơn không phụ thuộc vào khối lượng của vật nặng!`,
    quiz: [
      {
        question: 'Đem một con lắc đơn từ Trái Đất ($g \\approx 9.8 \\text{ m/s}^2$) lên Mặt Trăng ($g_{MT} \\approx 1.63 \\text{ m/s}^2$), chu kỳ dao động của con lắc sẽ:',
        options: [
          'A. Tăng lên (chạy chậm đi)',
          'B. Giảm đi (chạy nhanh hơn)',
          'C. Không thay đổi',
          'D. Bằng không'
        ],
        correctIndex: 0,
        explanation: 'Vì chu kỳ $T = 2\\pi\\sqrt{l/g}$, khi gia tốc trọng trường $g$ giảm thì chu kỳ $T$ tăng lên, con lắc dao động chậm hơn.'
      }
    ]
  },
  {
    id: 'light_refraction',
    title: 'Quang hình học: Khúc xạ & Phản xạ toàn phần',
    subtitle: 'Định luật Snellius, góc tới hạn $i_{gh}$ và hiện tượng cáp quang truyền dẫn',
    category: 'Quang học',
    description: 'Mô phỏng nguồn phát laser chiếu từ môi trường có chiết suất n1 sang môi trường chiết suất n2. Tùy ý xoay góc tới i, quan sát tia phản xạ, tia khúc xạ và ranh giới phản xạ toàn phần.',
    keyConcepts: [
      'Định luật khúc xạ ánh sáng (Snellius): $n_1 \\sin i = n_2 \\sin r$',
      'Góc khúc xạ: $\\sin r = \\frac{n_1}{n_2}\\sin i$',
      'Điều kiện phản xạ toàn phần: $n_1 > n_2$ và $i \\ge i_{gh}$',
      'Góc tới hạn: $\\sin i_{gh} = \\frac{n_2}{n_1}$'
    ],
    defaultParams: {
      n1: 1.5,       // Thủy tinh
      n2: 1.0,       // Không khí
      incidenceDeg: 35 // Góc tới i (độ)
    },
    paramBounds: {
      n1: { min: 1.0, max: 2.5, step: 0.05, unit: '', label: 'Chiết suất môi trường 1 (n₁)' },
      n2: { min: 1.0, max: 2.5, step: 0.05, unit: '', label: 'Chiết suất môi trường 2 (n₂)' },
      incidenceDeg: { min: 0, max: 88, step: 1, unit: 'độ', label: 'Góc tới tia sáng (i)' }
    },
    theoryMarkdown: `### 1. Hiện tượng khúc xạ ánh sáng
Khi ánh sáng truyền qua mặt phân cách giữa hai môi trường trong suốt khác nhau, tia sáng bị đổi phương đột ngột tại mặt phân cách.
Định luật Snell:
$$n_1 \\sin i = n_2 \\sin r$$
- Nếu truyền từ môi trường chiết quang kém sang môi trường chiết quang hơn ($n_1 < n_2$): $r < i$, tia khúc xạ lệch lại gần pháp tuyến hơn.
- Nếu truyền từ môi trường chiết quang hơn sang môi trường chiết quang kém ($n_1 > n_2$): $r > i$, tia khúc xạ lệch xa pháp tuyến hơn.

### 2. Hiện tượng phản xạ toàn phần
Khi truyền từ môi trường chiết suất lớn sang môi trường chiết suất nhỏ ($n_1 > n_2$), khi góc tới $i$ tăng đến một giá trị tới hạn $i_{gh}$ sao cho $\\sin i_{gh} = \\frac{n_2}{n_1}$, góc khúc xạ đạt $90^\\circ$.
Nếu $i > i_{gh}$, toàn bộ năng lượng ánh sáng bị phản xạ ngược lại môi trường 1, không còn tia khúc xạ nào ra môi trường 2. Đây là nguyên lý hoạt động của sợi cáp quang Internet!`,
    quiz: [
      {
        question: 'Tia sáng truyền từ nước ($n_1 = 4/3$) ra không khí ($n_2 = 1$). Góc tới hạn phản xạ toàn phần $i_{gh}$ xấp xỉ bằng:',
        options: [
          'A. 48.6°',
          'B. 45.0°',
          'C. 60.0°',
          'D. 30.0°'
        ],
        correctIndex: 0,
        explanation: 'Ta có $\\sin i_{gh} = n_2 / n_1 = 1 / (4/3) = 0.75$. Bấm máy tính $\\arcsin(0.75) \\approx 48.6^\\circ$.'
      }
    ]
  },
  {
    id: 'projectile_motion',
    title: 'Chuyển động ném vật / Quỹ đạo đạn đạo',
    subtitle: 'Ném xiên và ném ngang trong trường trọng lực, tầm bay xa L và độ cao cực đại H',
    category: 'Cơ học chất điểm',
    description: 'Bắn vật thể từ mặt đất hoặc từ độ cao h với góc phóng alpha và vận tốc ban đầu v0. Quan sát quỹ đạo parabol, vector vận tốc tức thời vx, vy và bia mục tiêu thực nghiệm.',
    keyConcepts: [
      'Gia tốc: $a_x = 0, a_y = -g$',
      'Vận tốc: $v_x = v_0 \\cos\\alpha, v_y = v_0 \\sin\\alpha - gt$',
      'Phương trình quỹ đạo: $y = (\\tan\\alpha)x - \\frac{g}{2v_0^2\\cos^2\\alpha} x^2$',
      'Độ cao cực đại: $H = \\frac{v_0^2\\sin^2\\alpha}{2g}$',
      'Tầm xa (trên mặt đất bằng phẳng): $L = \\frac{v_0^2\\sin(2\\alpha)}{g}$'
    ],
    defaultParams: {
      initialVelocity: 25, // m/s
      launchAngle: 45,     // độ
      initialHeight: 0,    // m
      gravity: 9.8
    },
    paramBounds: {
      initialVelocity: { min: 5, max: 60, step: 1, unit: 'm/s', label: 'Vận tốc đầu (v₀)' },
      launchAngle: { min: 0, max: 85, step: 1, unit: 'độ', label: 'Góc bắn (α)' },
      initialHeight: { min: 0, max: 40, step: 2, unit: 'm', label: 'Độ cao ban đầu (h)' },
      gravity: { min: 1.6, max: 20, step: 0.2, unit: 'm/s²', label: 'Trọng trường (g)' }
    },
    theoryMarkdown: `### 1. Phân tích chuyển động ném xiên
Ta chọn hệ trục tọa độ Oxy với gốc O tại vị trí bắn:
- **Theo phương ngang Ox:** Vật không chịu lực cản (bỏ qua không khí), chuyển động thẳng đều với vận tốc $v_x = v_0\\cos\\alpha$. Tọa độ $x = (v_0\\cos\\alpha)t$.
- **Theo phương thẳng đứng Oy:** Vật chịu trọng lực hướng xuống với gia tốc $a_y = -g$, chuyển động biến đổi đều với vận tốc $v_y = v_0\\sin\\alpha - gt$. Tọa độ $y = h + (v_0\\sin\\alpha)t - \\frac{1}{2}gt^2$.

### 2. Tầm bay xa cực đại
Trên cùng mặt phẳng ngang ($h = 0$), tầm xa $L = \\frac{v_0^2\\sin(2\\alpha)}{g}$.
Vì hàm $\\sin(2\\alpha) \\le 1$ nên tầm xa đạt giá trị cực đại khi $\\sin(2\\alpha) = 1 \\implies 2\\alpha = 90^\\circ \\implies \\alpha = 45^\\circ$.`,
    quiz: [
      {
        question: 'Để một quả bóng ném đi xa nhất trên mặt đất bằng phẳng (bỏ qua sức cản không khí), góc ném tối ưu là:',
        options: [
          'A. 45°',
          'B. 30°',
          'C. 60°',
          'D. 90°'
        ],
        correctIndex: 0,
        explanation: 'Công thức tầm xa là $L = \\frac{v_0^2\\sin(2\\alpha)}{g}$. Giá trị cực đại khi $\\sin(2\\alpha) = 1 \\implies \\alpha = 45^\\circ$.'
      }
    ]
  },
  {
    id: 'wave_interference',
    title: 'Giao thoa sóng cơ trên mặt nước',
    subtitle: 'Hiện tượng 2 nguồn sóng kết hợp tạo các vân cực đại và vân cực tiểu',
    category: 'Sóng cơ học',
    description: 'Mô phỏng 2 nguồn sóng điểm đồng pha dao động trên mặt nước. Quan sát bức tranh giao thoa với các đường hyperbol cực đại (dao động mạnh nhất) và cực tiểu (triệt tiêu).',
    keyConcepts: [
      'Điều kiện 2 nguồn kết hợp: Cùng tần số, cùng phương dao động và có hiệu số pha không đổi theo thời gian.',
      'Hiệu đường đi: $d_2 - d_1$',
      'Vị trí cực đại: $d_2 - d_1 = k\\lambda$ ($k \\in Z$)',
      'Vị trí cực tiểu: $d_2 - d_1 = (k + 0.5)\\lambda$ ($k \\in Z$)',
      'Khoảng cách giữa hai cực đại liên tiếp trên đoạn nối hai nguồn: $\\frac{\\lambda}{2}$'
    ],
    defaultParams: {
      wavelength: 25,   // mm
      sourceDist: 120,  // mm
      frequency: 2.0    // Hz
    },
    paramBounds: {
      wavelength: { min: 10, max: 50, step: 2, unit: 'mm', label: 'Bước sóng (λ)' },
      sourceDist: { min: 60, max: 200, step: 5, unit: 'mm', label: 'Khoảng cách 2 nguồn (S₁S₂)' },
      frequency: { min: 0.5, max: 5.0, step: 0.2, unit: 'Hz', label: 'Tần số nguồn (f)' }
    },
    theoryMarkdown: `### 1. Điều kiện để có giao thoa sóng
Giao thoa sóng là hiện tượng hai hay nhiều sóng kết hợp gặp nhau, tạo nên những điểm luôn dao động với biên độ cực đại và những điểm luôn dao động với biên độ cực tiểu (triệt tiêu nhau).
Hai nguồn phải là hai nguồn kết hợp:
- Dao động cùng phương
- Cùng chu kỳ (hoặc tần số)
- Hiệu số pha không đổi theo thời gian.

### 2. Định lượng các cực đại và cực tiểu
Với hai nguồn đồng pha $S_1, S_2$:
- **Điểm cực đại giao thoa:** $d_2 - d_1 = k\\lambda$ ($k = 0, \\pm 1, \\pm 2,...$). Vân trung tâm ($k=0$) là đường trung trực của $S_1S_2$.
- **Điểm cực tiểu giao thoa:** $d_2 - d_1 = (k + \\frac{1}{2})\\lambda$.`,
    quiz: [
      {
        question: 'Trong hiện tượng giao thoa sóng nước với 2 nguồn đồng pha, khoảng cách giữa hai cực đại giao thoa liên tiếp trên đoạn thẳng nối 2 nguồn bằng:',
        options: [
          'A. Một nửa bước sóng (λ/2)',
          'B. Một bước sóng (λ)',
          'C. Một phần tư bước sóng (λ/4)',
          'D. Hai lần bước sóng (2λ)'
        ],
        correctIndex: 0,
        explanation: 'Trên đoạn thẳng nối hai nguồn, khoảng cách giữa 2 cực đại giao thoa liên tiếp (hoặc 2 cực tiểu liên tiếp) luôn bằng $\\frac{\\lambda}{2}$.'
      }
    ]
  }
];

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'SUM2',
    title: 'BAI01: Tính tổng hai số nguyên',
    difficulty: 'Easy',
    category: 'Nhập xuất & Toán cơ bản',
    timeLimit: '1.0s',
    memoryLimit: '256MB',
    description: 'Cho hai số nguyên a và b. Hãy tính và in ra tổng a + b.',
    inputFormat: 'Một dòng duy nhất chứa hai số nguyên a và b cách nhau bởi dấu cách.',
    outputFormat: 'In ra một số nguyên duy nhất là tổng a + b.',
    constraints: ['-10^9 <= a, b <= 10^9'],
    sampleCases: [
      { id: 1, input: '3 5', expectedOutput: '8', isSample: true, explanation: '3 + 5 = 8' },
      { id: 2, input: '-10 25', expectedOutput: '15', isSample: true, explanation: '-10 + 25 = 15' }
    ],
    hiddenCases: [
      { id: 3, input: '0 0', expectedOutput: '0' },
      { id: 4, input: '-1000 -2000', expectedOutput: '-3000' },
      { id: 5, input: '999999999 1', expectedOutput: '1000000000' },
      { id: 6, input: '-500000000 500000000', expectedOutput: '0' }
    ],
    cppTemplate: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    if (cin >> a >> b) {
        cout << a + b << endl;
    }
    return 0;
}`,
    pythonTemplate: `# Đọc hai số từ bàn phím và in ra tổng
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    a = int(data[0])
    b = int(data[1])
    print(a + b)

if __name__ == '__main__':
    solve()`
  },
  {
    id: 'PRIME',
    title: 'BAI02: Kiểm tra số nguyên tố',
    difficulty: 'Easy',
    category: 'Số học & Vòng lặp',
    timeLimit: '1.0s',
    memoryLimit: '256MB',
    description: 'Cho một số nguyên dương N. Hãy kiểm tra xem N có phải là số nguyên tố hay không. In ra "YES" nếu N là số nguyên tố, ngược lại in ra "NO".',
    inputFormat: 'Một dòng chứa một số nguyên dương N.',
    outputFormat: 'In ra "YES" hoặc "NO" (chữ in hoa).',
    constraints: ['1 <= N <= 10^9'],
    sampleCases: [
      { id: 1, input: '7', expectedOutput: 'YES', isSample: true, explanation: '7 chỉ chia hết cho 1 và 7' },
      { id: 2, input: '1', expectedOutput: 'NO', isSample: true, explanation: '1 không phải số nguyên tố' },
      { id: 3, input: '12', expectedOutput: 'NO', isSample: true, explanation: '12 chia hết cho 2, 3, 4, 6' }
    ],
    hiddenCases: [
      { id: 4, input: '2', expectedOutput: 'YES' },
      { id: 5, input: '97', expectedOutput: 'YES' },
      { id: 6, input: '1000000', expectedOutput: 'NO' },
      { id: 7, input: '1000000007', expectedOutput: 'YES' }
    ],
    cppTemplate: `#include <iostream>
using namespace std;

bool isPrime(long long n) {
    if (n < 2) return false;
    for (long long i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    long long n;
    if (cin >> n) {
        if (isPrime(n)) cout << "YES" << endl;
        else cout << "NO" << endl;
    }
    return 0;
}`,
    pythonTemplate: `import sys

def is_prime(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    if is_prime(n):
        print("YES")
    else:
        print("NO")

if __name__ == '__main__':
    solve()`
  },
  {
    id: 'FIBO',
    title: 'BAI03: Số Fibonacci thứ N',
    difficulty: 'Medium',
    category: 'Quy hoạch động & Dãy số',
    timeLimit: '1.0s',
    memoryLimit: '256MB',
    description: 'Dãy Fibonacci được định nghĩa: F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) với n >= 2. Cho số nguyên n, hãy in ra F(n) lấy dư cho 1000000007 (10^9 + 7).',
    inputFormat: 'Một số nguyên n duy nhất.',
    outputFormat: 'In ra giá trị F(n) mod 1000000007.',
    constraints: ['0 <= n <= 10^6'],
    sampleCases: [
      { id: 1, input: '0', expectedOutput: '0', isSample: true },
      { id: 2, input: '6', expectedOutput: '8', isSample: true, explanation: 'F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8' },
      { id: 3, input: '10', expectedOutput: '55', isSample: true }
    ],
    hiddenCases: [
      { id: 4, input: '1', expectedOutput: '1' },
      { id: 5, input: '20', expectedOutput: '6765' },
      { id: 6, input: '50', expectedOutput: '586268941' },
      { id: 7, input: '100', expectedOutput: '687995182' }
    ],
    cppTemplate: `#include <iostream>
using namespace std;

const int MOD = 1000000007;

int main() {
    long long n;
    if (cin >> n) {
        if (n == 0) { cout << 0 << endl; return 0; }
        if (n == 1) { cout << 1 << endl; return 0; }
        long long prev = 0, curr = 1;
        for (int i = 2; i <= n; i++) {
            long long nextVal = (prev + curr) % MOD;
            prev = curr;
            curr = nextVal;
        }
        cout << curr << endl;
    }
    return 0;
}`,
    pythonTemplate: `import sys

MOD = 1000000007

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    if n == 0:
        print(0)
        return
    if n == 1:
        print(1)
        return
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, (prev + curr) % MOD
    print(curr)

if __name__ == '__main__':
    solve()`
  },
  {
    id: 'BINSEARCH',
    title: 'BAI04: Tìm kiếm nhị phân',
    difficulty: 'Medium',
    category: 'Thuật toán tìm kiếm',
    timeLimit: '1.0s',
    memoryLimit: '256MB',
    description: 'Cho dãy gồm N số nguyên đã được sắp xếp tăng dần và một số X. Hãy tìm vị trí (chỉ số 1-indexed) của số X trong dãy. Nếu không tìm thấy, in ra -1. Nếu có nhiều vị trí bằng X, in ra vị trí xuất hiện đầu tiên.',
    inputFormat: 'Dòng 1: Hai số nguyên N và X cách nhau bởi khoảng trắng.\\nDòng 2: Gồm N số nguyên A[1], A[2], ..., A[N].',
    outputFormat: 'In ra chỉ số của phần tử X đầu tiên tìm thấy (1-based index) hoặc -1.',
    constraints: ['1 <= N <= 10^5', '-10^9 <= X, A[i] <= 10^9'],
    sampleCases: [
      { id: 1, input: '5 7\\n1 3 5 7 9', expectedOutput: '4', isSample: true, explanation: 'Số 7 nằm ở vị trí thứ 4' },
      { id: 2, input: '4 4\\n1 2 3 5', expectedOutput: '-1', isSample: true, explanation: 'Không có số 4 trong mảng' }
    ],
    hiddenCases: [
      { id: 3, input: '6 5\\n2 4 5 5 5 8', expectedOutput: '3' },
      { id: 4, input: '1 10\\n10', expectedOutput: '1' },
      { id: 5, input: '5 1\\n2 4 6 8 10', expectedOutput: '-1' },
      { id: 6, input: '7 99\\n1 5 12 25 60 99 105', expectedOutput: '6' }
    ],
    cppTemplate: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    long long x;
    if (cin >> n >> x) {
        vector<long long> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        
        int low = 0, high = n - 1;
        int ans = -1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (a[mid] >= x) {
                if (a[mid] == x) ans = mid + 1;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        cout << ans << endl;
    }
    return 0;
}`,
    pythonTemplate: `import sys

def solve():
    raw = sys.stdin.read().split()
    if not raw:
        return
    n = int(raw[0])
    x = int(raw[1])
    arr = [int(v) for v in raw[2:2+n]]
    
    low, high = 0, n - 1
    ans = -1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] >= x:
            if arr[mid] == x:
                ans = mid + 1
            high = mid - 1
        else:
            low = mid + 1
    print(ans)

if __name__ == '__main__':
    solve()`
  },
  {
    id: 'PALINDROME',
    title: 'BAI05: Chuỗi đối xứng (Palindrome)',
    difficulty: 'Easy',
    category: 'Xử lý chuỗi kí tự',
    timeLimit: '1.0s',
    memoryLimit: '256MB',
    description: 'Một chuỗi được gọi là Palindrome nếu đọc xuôi hay ngược đều giống nhau (bỏ qua khoảng trắng và không phân biệt hoa thường). Cho một chuỗi S, hãy kiểm tra xem S có phải Palindrome không. In ra "YES" hoặc "NO".',
    inputFormat: 'Một dòng chứa chuỗi ký tự S.',
    outputFormat: 'In ra "YES" hoặc "NO".',
    constraints: ['Độ dài chuỗi 1 <= |S| <= 10^5'],
    sampleCases: [
      { id: 1, input: 'radar', expectedOutput: 'YES', isSample: true },
      { id: 2, input: 'hello', expectedOutput: 'NO', isSample: true },
      { id: 3, input: 'A man a plan a canal Panama', expectedOutput: 'YES', isSample: true }
    ],
    hiddenCases: [
      { id: 4, input: 'a', expectedOutput: 'YES' },
      { id: 5, input: 'abccba', expectedOutput: 'YES' },
      { id: 6, input: 'coding is fun', expectedOutput: 'NO' },
      { id: 7, input: 'Was it a car or a cat I saw', expectedOutput: 'YES' }
    ],
    cppTemplate: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string line;
    if (getline(cin, line)) {
        string filtered = "";
        for (char c : line) {
            if (isalnum(c)) {
                filtered += tolower(c);
            }
        }
        int left = 0, right = (int)filtered.length() - 1;
        bool isPal = true;
        while (left < right) {
            if (filtered[left] != filtered[right]) {
                isPal = false;
                break;
            }
            left++;
            right--;
        }
        if (isPal) cout << "YES" << endl;
        else cout << "NO" << endl;
    }
    return 0;
}`,
    pythonTemplate: `import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
    filtered = [c.lower() for c in s if c.isalnum()]
    if filtered == filtered[::-1]:
        print("YES")
    else:
        print("NO")

if __name__ == '__main__':
    solve()`
  },
  {
    id: 'KNAPSACK',
    title: 'BAI06: Bài toán cái túi (0/1 Knapsack)',
    difficulty: 'Hard',
    category: 'Quy hoạch động',
    timeLimit: '2.0s',
    memoryLimit: '256MB',
    description: 'Một tên trộm có một cái túi chịu được khối lượng tối đa W. Có N món đồ, món thứ i có khối lượng w_i và giá trị v_i. Hãy chọn các món đồ để tổng giá trị trong túi là lớn nhất mà không vượt quá tải trọng W.',
    inputFormat: 'Dòng 1: Hai số nguyên N và W.\\nDòng 2..N+1: Mỗi dòng chứa 2 số nguyên w_i và v_i là khối lượng và giá trị món đồ i.',
    outputFormat: 'In ra một số nguyên là tổng giá trị lớn nhất đạt được.',
    constraints: ['1 <= N <= 100', '1 <= W <= 1000', '1 <= w_i, v_i <= 1000'],
    sampleCases: [
      { id: 1, input: '3 50\\n10 60\\n20 100\\n30 120', expectedOutput: '220', isSample: true, explanation: 'Chọn món 2 (20kg, 100) và món 3 (30kg, 120): tổng khối lượng 50, giá trị 220.' }
    ],
    hiddenCases: [
      { id: 2, input: '4 7\\n1 1\\n3 4\\n4 5\\n5 7', expectedOutput: '9' },
      { id: 3, input: '2 3\\n4 10\\n5 20', expectedOutput: '0' },
      { id: 4, input: '5 10\\n2 3\\n3 4\\n4 5\\n5 8\\n9 10', expectedOutput: '17' }
    ],
    cppTemplate: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n, w;
    if (cin >> n >> w) {
        vector<int> weight(n), val(n);
        for (int i = 0; i < n; i++) {
            cin >> weight[i] >> val[i];
        }
        vector<int> dp(w + 1, 0);
        for (int i = 0; i < n; i++) {
            for (int j = w; j >= weight[i]; j--) {
                dp[j] = max(dp[j], dp[j - weight[i]] + val[i]);
            }
        }
        cout << dp[w] << endl;
    }
    return 0;
}`,
    pythonTemplate: `import sys

def solve():
    raw = sys.stdin.read().split()
    if not raw:
        return
    n = int(raw[0])
    w = int(raw[1])
    idx = 2
    dp = [0] * (w + 1)
    for _ in range(n):
        wt = int(raw[idx])
        val = int(raw[idx+1])
        idx += 2
        for j in range(w, wt - 1, -1):
            dp[j] = max(dp[j], dp[j - wt] + val)
    print(dp[w])

if __name__ == '__main__':
    solve()`
  }
];

export const LITERATURE_WORKS: LiteratureWork[] = [
  {
    id: 'tay-tien',
    title: 'Tây Tiến',
    author: 'Quang Dũng',
    period: 'Văn học kháng chiến chống Pháp (1948)',
    genre: 'Thơ lãng mạn - sử thi',
    summary: 'Bài thơ được viết tại Phù Lưu Chanh khi Quang Dũng rời đoàn quân Tây Tiến, ngợi ca vẻ đẹp hùng vĩ dữ dội của thiên nhiên miền Tây và vẻ đẹp hào hoa, bi tráng của người lính Tây Tiến.',
    mindmap: {
      id: 'root-tay-tien',
      label: 'Tây Tiến (Quang Dũng)',
      description: 'Nỗi nhớ da diết của tác giả về miền Tây và trung đoàn Tây Tiến anh dũng',
      children: [
        {
          id: 'tt-1',
          label: 'I. Thiên nhiên miền Tây hùng vĩ & hoang sơ',
          description: 'Địa hình đèo dốc hiểm trở xen lẫn sương mù thơ mộng',
          children: [
            { id: 'tt-1-1', label: 'Địa danh hiểm trở', description: 'Sài Khao, Mường Lát, Pha Luông, Mường Hịch' },
            { id: 'tt-1-2', label: 'Dốc đứng thăm thẳm', description: '"Dốc lên khúc khuỷu dốc thăm thẳm / Heo hút cồn mây súng ngửi trời"' },
            { id: 'tt-1-3', label: 'Khoảnh khắc thanh bình', description: '"Nhà ai Pha Luông mưa xa khơi" - âm điệu thanh bằng êm đềm' }
          ]
        },
        {
          id: 'tt-2',
          label: 'II. Kỷ niệm ấm áp tình quân dân',
          description: 'Đêm liên hoan văn nghệ rực rỡ và chiều sương Châu Mộc',
          children: [
            { id: 'tt-2-1', label: 'Đêm hội lửa trại', description: '"Doanh trại bừng lên hội đuốc hoa / Kìa em xiêm áo tự bao giờ"' },
            { id: 'tt-2-2', label: 'Chiều sương mộng mơ', description: '"Có thấy hồn lau nẻo bến bờ / Có nhớ dáng người trên độc mộc"' }
          ]
        },
        {
          id: 'tt-3',
          label: 'III. Hình tượng người lính Tây Tiến',
          description: 'Vẻ đẹp lãng mạn, bi tráng mang cốt cách người Tràng An hào hoa',
          children: [
            { id: 'tt-3-1', label: 'Ngoại hình khác thường', description: '"Tây Tiến đoàn binh không mọc tóc / Quân xanh màu lá dữ oai hùm"' },
            { id: 'tt-3-2', label: 'Tâm hồn lãng mạn', description: '"Mắt trừng gửi mộng qua biên giới / Đêm mơ Hà Nội dáng kiều thơm"' },
            { id: 'tt-3-3', label: 'Sự hy sinh bi tráng', description: '"Rải rác biên cương mồ viễn xứ / Chiến trường đi chẳng tiếc đời xanh"' }
          ]
        }
      ]
    },
    goldenQuotes: [
      {
        quote: 'Heo hút cồn mây súng ngửi trời',
        context: 'Đoạn 1 tả độ cao hiểm trở của đèo dốc miền Tây',
        analysis: 'Nhân hóa "súng ngửi trời" thể hiện độ cao chót vót của đỉnh dốc, đồng thời toát lên chất lính hóm hỉnh, lạc quan tếu táo của người lính trẻ thủ đô.'
      },
      {
        quote: 'Chiến trường đi chẳng tiếc đời xanh / Áo bào thay chiếu anh về đất',
        context: 'Đoạn 3 ngợi ca tinh thần quyết tử cho Tổ quốc quyết sinh',
        analysis: 'Cụm từ "chẳng tiếc đời xanh" khẳng định lý tưởng cống hiến tuổi thanh xuân vô điều kiện; cách nói giảm nói tránh "về đất" và hình ảnh hoán dụ "áo bào" tôn vinh sự hy sinh trở nên thiêng liêng, bất tử.'
      }
    ],
    analysisQuestions: [
      {
        question: 'Cảm hứng chủ đạo xuyên suốt thi phẩm "Tây Tiến" là:',
        options: [
          'A. Cảm hứng lãng mạn hòa quyện chất bi tráng',
          'B. Cảm hứng hiện thực phê phán gay gắt',
          'C. Cảm hứng trào phúng châm biếm',
          'D. Cảm hứng tự sự mộc mạc dân gian'
        ],
        correctIndex: 0,
        guide: 'Tây Tiến kết hợp hài hòa giữa ngòi bút lãng mạn bay bổng hào hoa và chất sử thi bi tráng, nhìn thẳng vào hiện thực gian khổ mất mát mà không hề bi lụy.'
      }
    ]
  },
  {
    id: 'song',
    title: 'Sóng',
    author: 'Xuân Quỳnh',
    period: 'Sáng tác năm 1967 tại vùng biển Diêm Điền (Thái Thụy, Thái Bình)',
    genre: 'Thơ tình yêu hiện đại',
    summary: 'Hình tượng sóng và em soi chiếu tương đồng, diễn tả các cung bậc phong phú, phức tạp và khát vọng muôn đời về tình yêu thủy chung, vĩnh hằng của người phụ nữ.',
    mindmap: {
      id: 'root-song',
      label: 'Sóng (Xuân Quỳnh)',
      description: 'Khám phá bí ẩn tâm hồn người phụ nữ trong tình yêu qua biểu tượng sóng',
      children: [
        {
          id: 'song-1',
          label: 'I. Bản tính của sóng và tâm hồn người phụ nữ',
          description: 'Những đối cực muôn thuở trong tình yêu',
          children: [
            { id: 'song-1-1', label: 'Trạng thái đối lập', description: '"Dữ dội và dịu êm / Ồn ào và lặng lẽ"' },
            { id: 'song-1-2', label: 'Khát vọng vượt giới hạn', description: '"Sông không hiểu nổi mình / Sóng tìm ra tận bể"' }
          ]
        },
        {
          id: 'song-2',
          label: 'II. Nỗi nhớ da diết và lòng thủy chung',
          description: 'Nỗi nhớ vượt không gian, thời gian và chiếm trọn tiềm thức',
          children: [
            { id: 'song-2-1', label: 'Nỗi nhớ sóng - em', description: '"Lòng em nhớ đến anh / Cả trong mơ còn thức"' },
            { id: 'song-2-2', label: 'Lời thề son sắt', description: '"Dẫu xuôi về phương bắc / Dẫu ngược về phương nam / Nơi nào em cũng nghĩ / Hướng về anh - một phương"' }
          ]
        },
        {
          id: 'song-3',
          label: 'III. Khát vọng tình yêu bất tử',
          description: 'Hòa mình vào biển lớn nhân loại để trường tồn cùng năm tháng',
          children: [
            { id: 'song-3-1', label: 'Ý thức về thời gian', description: '"Cuộc đời tuy dài thế / Năm tháng vẫn đi qua"' },
            { id: 'song-3-2', label: 'Hóa thân bất tử', description: '"Làm sao được tan ra / Thành trăm con sóng nhỏ / Giữa biển lớn tình yêu / Để ngàn năm còn vỗ"' }
          ]
        }
      ]
    },
    goldenQuotes: [
      {
        quote: 'Lòng em nhớ đến anh / Cả trong mơ còn thức',
        context: 'Khổ thơ thứ 5 diễn tả nỗi nhớ sâu sắc trong tình yêu',
        analysis: 'Nỗi nhớ không chỉ tràn ngập trong ý thức tỉnh táo ban ngày mà còn len lỏi vào tầng sâu tiềm thức lúc chiêm bao, minh chứng cho một tình yêu nồng nàn, chân thành.'
      }
    ],
    analysisQuestions: [
      {
        question: 'Hình tượng "Sóng" trong thi phẩm của Xuân Quỳnh mang ý nghĩa biểu tượng cho:',
        options: [
          'A. Tâm hồn người phụ nữ đang yêu với mọi sắc thái tình cảm',
          'B. Sức tàn phá ghê gớm của thiên nhiên đại dương',
          'C. Cuộc hành quân chiến đấu của bộ đội giải phóng',
          'D. Nỗi sợ hãi cái chết trước thời gian'
        ],
        correctIndex: 0,
        guide: 'Sóng là sự phân thân, là ẩn dụ trực tiếp cho cái tôi trữ tình của người phụ nữ với những trăn trở, nhớ nhung, khao khát thủy chung và mong ước tình yêu hóa thành vĩnh cửu.'
      }
    ]
  },
  {
    id: 'vo-chong-a-phu',
    title: 'Vợ chồng A Phủ',
    author: 'Tô Hoài',
    period: 'Tập "Truyện Tây Bắc" (1952)',
    genre: 'Truyện ngắn hiện thực cách mạng',
    summary: 'Tác phẩm khắc họa số phận đau thương tủi nhục của đồng bào nghèo Tây Bắc dưới ách cường quyền thống lý Pá Tra và ngợi ca sức sống tiềm tàng, quá trình vùng lên tự giải phóng.',
    mindmap: {
      id: 'root-vcap',
      label: 'Vợ chồng A Phủ (Tô Hoài)',
      description: 'Con đường từ kiếp đời nô lệ đến tự do của Mị và A Phủ',
      children: [
        {
          id: 'vcap-1',
          label: 'I. Nhân vật Mị - Thân phận dâu gạt nợ',
          description: 'Bị đày đọa thể xác và tê liệt tinh thần',
          children: [
            { id: 'vcap-1-1', label: 'Xuất thân', description: 'Cô gái trẻ đẹp, tài hoa thổi sáo, hiếu thảo' },
            { id: 'vcap-1-2', label: 'Kiếp trâu ngựa', description: '"Lùi lũi như con rùa nuôi trong xó cửa"' },
            { id: 'vcap-1-3', label: 'Tê liệt ý thức', description: 'Căn buồng có ô cửa sổ mờ mờ trăng trắng' }
          ]
        },
        {
          id: 'vcap-2',
          label: 'II. Đêm tình mùa xuân Hồng Ngài',
          description: 'Sức sống tiềm tàng trỗi dậy mãnh liệt',
          children: [
            { id: 'vcap-2-1', label: 'Tiếng sáo gọi bạn tình', description: 'Đánh thức ký ức tươi trẻ và lòng khao khát hạnh phúc' },
            { id: 'vcap-2-2', label: 'Hành động thức tỉnh', description: 'Uống rượu ừng ực, thắp đèn, muốn đi chơi xuân' },
            { id: 'vcap-2-3', label: 'Bị trói nhưng hồn vẫn theo sáo', description: 'A Sử trói đứng vào cột nhà, tiếng sáo vẫn chập chờn vẫy gọi' }
          ]
        },
        {
          id: 'vcap-3',
          label: 'III. Đêm đông cởi trói cứu A Phủ',
          description: 'Tình thương đồng loại chiến thắng nỗi sợ hãi, tự giải phóng số phận',
          children: [
            { id: 'vcap-3-1', label: 'Giọt nước mắt của A Phủ', description: 'Thức tỉnh lòng trắc ẩn và sự căm phẫn quân độc ác' },
            { id: 'vcap-3-2', label: 'Hành động cắt dây mây', description: 'Táo bạo, dứt khoát cứu người' },
            { id: 'vcap-3-3', label: 'Chạy theo tiếng gọi tự do', description: '"A Phủ cho tôi đi với! Ở đây thì chết mất"' }
          ]
        }
      ]
    },
    goldenQuotes: [
      {
        quote: 'Mị thấy mình còn trẻ. Mị còn trẻ lắm. Mị muốn đi chơi.',
        context: 'Tâm trạng Mị trong đêm tình mùa xuân khi nghe tiếng sáo',
        analysis: 'Câu văn ngắn gọn, dồn dập khẳng định sự hồi sinh kỳ diệu của ý thức nhân phẩm và sức sống thanh xuân vốn bị chôn vùi bấy lâu.'
      }
    ],
    analysisQuestions: [
      {
        question: 'Chi tiết nghệ thuật nào là bước ngoặt quyết định thôi thúc Mị cắt dây mây giải thoát cho A Phủ?',
        options: [
          'A. Nhìn thấy một dòng nước mắt lấp lánh bò xuống hai hõm má xám đen của A Phủ',
          'B. Nghe thấy tiếng sáo rủ bạn đi chơi ngoài đầu núi',
          'C. Nhìn thấy A Sử bị đánh trọng thương',
          'D. Nhìn thấy ngọn lửa sưởi ấm trong đêm đông'
        ],
        correctIndex: 0,
        guide: 'Giọt nước mắt tuyệt vọng của một người dũng cảm như A Phủ đã chạm tới đáy sâu lòng trắc ẩn của Mị, giúp Mị liên tưởng đến số phận mình và chuyển từ thương người sang hành động cứu người.'
      }
    ]
  }
];
