import { MathLecture } from '../types';

const SRC_2018_6 = 'GDPT 2018 (KNTT · CTST · Cánh Diều) · Toán 6';
const SRC_2018_7 = 'GDPT 2018 (KNTT · CTST · Cánh Diều) · Toán 7';
const SRC_2018_8 = 'GDPT 2018 (KNTT · CTST · Cánh Diều) · Toán 8';
const SRC_2006_6 = 'GDPT 2006 · SGK Toán 6 (NXB Giáo dục)';
const SRC_2006_7 = 'GDPT 2006 · SGK Toán 7 (NXB Giáo dục)';
const SRC_2006_8 = 'GDPT 2006 · SGK Toán 8 (NXB Giáo dục)';

export const MATH_MS_EXTRA_LESSONS: MathLecture[] = [
  // ==========================================================================
  // LỚP 6 — GDPT 2018 (BỔ SUNG ĐẦY ĐỦ CHƯƠNG MỤC)
  // ==========================================================================
  {
    id: 'math-6-b9',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 6',
    lessonNumber: 9,
    stageLabel: 'Toán 6 · Chương V: Tính đối xứng trong Tự nhiên & Hình học',
    sourceTag: SRC_2018_6,
    title: 'Bài 9: Hình có Trục đối xứng, Tâm đối xứng & Vai trò Đối xứng trong Tự nhiên',
    grade: 'Lớp 6 · Hình học trực quan',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 11,
    description:
      'Nhận diện trục đối xứng (cánh bướm, lá cây, chữ A, M, H) và tâm đối xứng (bánh xe, chữ S, N, Z, hình bình hành) qua công cụ gấp hình 2D.',
    mnemonics: [
      'Trục đối xứng: Gấp đôi tờ giấy theo đường thẳng $d$ thì hai nửa trùng khít lên nhau.',
      'Tâm đối xứng: Quay hình nửa vòng $180^\\circ$ quanh tâm $O$ thì thu được hình trùng khít ban đầu.'
    ],
    commonTraps: [
      'Nhầm hình bình hành bất kì có trục đối xứng (SAI! Hình bình hành tổng quát chỉ có TÂM đối xứng, không có trục đối xứng).'
    ],
    theory: [
      '1. Hình có trục đối xứng $d$: Tam giác cân (1 trục), Tam giác đều (3 trục), Hình chữ nhật (2 trục), Hình thoi (2 trục), Hình vuông (4 trục), Đường tròn (vô số trục).',
      '2. Hình có tâm đối xứng $O$: Đoạn thẳng (trung điểm), Hình bình hành, Hình thoi, Hình chữ nhật, Hình vuông, Lục giác đều (giao hai đường chéo chính).',
      '3. Ý nghĩa thực tiễn: Tính đối xứng giúp các công trình (cầu, tháp, mái vòm) cân bằng lực và tạo vẻ đẹp hài hòa.'
    ],
    keyFormulas: [
      '\\text{Hình vuông}: 4\\text{ trục đối xứng} + 1\\text{ tâm đối xứng}',
      '\\text{Hình bình hành}: 0\\text{ trục đối xứng} + 1\\text{ tâm đối xứng}'
    ],
    flashcards: [
      { front: 'Hình thang cân có tâm đối xứng không?', back: 'Không! Hình thang cân có 1 trục đối xứng nhưng không có tâm đối xứng.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_6,
        question: 'Trong các chữ cái in hoa $A, H, M, T$, chữ cái nào vừa có trục đối xứng vừa có tâm đối xứng?',
        options: ['A. Chữ A', 'B. Chữ H', 'C. Chữ M', 'D. Chữ T'],
        correctIndex: 1,
        explanation: 'Chữ H có 2 trục đối xứng (ngang và dọc) và có 1 tâm đối xứng tại chính giữa gạch ngang.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_6,
        question: 'Kể tên số trục đối xứng của hình chữ nhật, hình thoi, hình vuông và đường tròn.',
        hints: ['Kiểm tra bằng cách gấp đôi hình theo trục dọc, ngang và đường chéo.'],
        solutionSteps: [
          'Hình chữ nhật: 2 trục (hai đường trung trực cặp cạnh đối).',
          'Hình thoi: 2 trục (hai đường chéo).',
          'Hình vuông: 4 trục (2 đường chéo + 2 đường nối trung điểm).',
          'Đường tròn: vô số trục (mọi đường kính).'
        ],
        finalAnswer: '2, 2, 4 và vô số.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'quadrilaterals_sym',
    sim3dMode: 'geometric_transform_3d'
  },
  {
    id: 'math-6-b10',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 6',
    lessonNumber: 10,
    stageLabel: 'Toán 6 · Chương VIII: Góc & Số đo góc',
    sourceTag: SRC_2018_6,
    title: 'Bài 10: Góc nhọn – Vuông – Tù – Bẹt, Thước đo góc & Xác suất Thực nghiệm',
    grade: 'Lớp 6 · Hình học & Xác suất',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 12,
    description:
      'Phân loại 4 loại góc qua thước đo độ, thực hành phép thử ngẫu nhiên tung đồng xu/xúc xắc và tính xác suất thực nghiệm.',
    mnemonics: [
      'Nhọn ($<90^\\circ$) < Vuông ($=90^\\circ$) < Tù ($90^\\circ < \\alpha < 180^\\circ$) < Bẹt ($=180^\\circ$).',
      'Xác suất thực nghiệm $= \\frac{\\text{Số lần xuất hiện sự kiện}}{\\text{Tổng số lần thử}}$.'
    ],
    commonTraps: [
      'Đọc nhầm vòng số trong và ngoài trên thước đo góc nửa hình tròn.'
    ],
    theory: [
      '1. Góc $\\widehat{xOy}$ tạo bởi hai tia chung gốc $O$. Dùng thước đo góc đặt tâm trùng đỉnh $O$, cạnh $Ox$ trùng vạch $0^\\circ$.',
      '2. Phép thử tung đồng xu $n$ lần, mặt ngửa xuất hiện $k$ lần thì xác suất thực nghiệm của sự kiện "ra mặt ngửa" là $\\frac{k}{n}$.'
    ],
    keyFormulas: [
      '0^\\circ < \\text{Nhọn} < 90^\\circ = \\text{Vuông} < \\text{Tù} < 180^\\circ = \\text{Bẹt}',
      'P_{\\text{TN}} = \\frac{k}{n}'
    ],
    flashcards: [
      { front: 'Lúc 3 giờ đúng và 6 giờ đúng, kim giờ và kim phút tạo thành góc gì?', back: '3 giờ tạo góc vuông $90^\\circ$; 6 giờ tạo góc bẹt $180^\\circ$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_6,
        question: 'Tung một đồng xu cân đối 40 lần thấy có 22 lần xuất hiện mặt sấp. Xác suất thực nghiệm xuất hiện mặt ngửa là:',
        options: ['A. $0{,}55$', 'B. $0{,}45$', 'C. $0{,}5$', 'D. $0{,}18$'],
        correctIndex: 1,
        explanation: 'Số lần ra mặt ngửa $= 40 - 22 = 18 \\implies P = \\frac{18}{40} = 0{,}45$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_6,
        question: 'Cho góc $\\widehat{xOy} = 115^\\circ$ và $\\widehat{mAn} = 45^\\circ$. Hãy phân loại từng góc và so sánh chúng.',
        hints: ['So sánh số đo với $90^\\circ$ và $180^\\circ$.'],
        solutionSteps: [
          'Vì $90^\\circ < 115^\\circ < 180^\\circ$ nên $\\widehat{xOy}$ là góc tù.',
          'Vì $0^\\circ < 45^\\circ < 90^\\circ$ nên $\\widehat{mAn}$ là góc nhọn, $\\widehat{xOy} > \\widehat{mAn}$.'
        ],
        finalAnswer: '$\\widehat{xOy}$ tù, $\\widehat{mAn}$ nhọn.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'angles_parallel',
    sim3dMode: 'angle_thales_3d'
  },

  // ==========================================================================
  // LỚP 7 — GDPT 2018 (BỔ SUNG ĐẦY ĐỦ CHƯƠNG MỤC)
  // ==========================================================================
  {
    id: 'math-7-b8',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 7',
    lessonNumber: 8,
    stageLabel: 'Toán 7 · Chương II: Số thực & Căn bậc hai số học',
    sourceTag: SRC_2018_7,
    title: 'Bài 8: Số vô tỉ, Căn bậc hai số học ($\\sqrt{a}$), Tập hợp Số thực $\\mathbb{R}$ & Làm tròn',
    grade: 'Lớp 7 · Số học & Đại số',
    category: 'Số học & Tổ hợp',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 12,
    description:
      'Khám phá số thập phân vô hạn không tuần hoàn ($\\sqrt{2}, \\pi$), căn bậc hai số học và trục số thực $\\mathbb{R}$ đầy kín không kẽ hở.',
    mnemonics: [
      'Với $a \\ge 0$, căn bậc hai số học $\\sqrt{a} \\ge 0$ và $(\\sqrt{a})^2 = a$.',
      'Tập số thực $\\mathbb{R}$ hợp bởi Số hữu tỉ $\\mathbb{Q}$ và Số vô tỉ $\\mathbb{I}$.'
    ],
    commonTraps: [
      'Viết $\\sqrt{9} = \\pm 3$ (SAI! Căn bậc hai SỐ HỌC $\\sqrt{9}$ luôn dương và chỉ bằng $+3$; còn "căn bậc hai của 9" mới là $\\pm 3$).'
    ],
    theory: [
      '1. Số vô tỉ là số viết được dưới dạng số thập phân vô hạn không tuần hoàn, như $\\pi \\approx 3{,}14159...$ hay $\\sqrt{2} \\approx 1{,}4142...$.',
      '2. Giá trị tuyệt đối của số thực $x$: $|x| = x$ nếu $x \\ge 0$ và $|x| = -x$ nếu $x < 0$. Hai điểm đối nhau cách đều gốc $0$ trên trục số thực.'
    ],
    keyFormulas: [
      '\\sqrt{a^2} = |a|, \\quad \\sqrt{a} \\ge 0 \\ (a \\ge 0)',
      '\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}'
    ],
    flashcards: [
      { front: 'Tính $\\sqrt{64} - | -2{,}5 |$?', back: '$8 - 2{,}5 = 5{,}5$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_7,
        question: 'Giá trị của $\\sqrt{144} + \\sqrt{0{,}25}$ là:',
        options: ['A. $12{,}5$', 'B. $12{,}05$', 'C. $14{,}5$', 'D. $-12{,}5$'],
        correctIndex: 0,
        explanation: '$\\sqrt{144} = 12$, $\\sqrt{0{,}25} = 0{,}5 \\implies 12 + 0{,}5 = 12{,}5$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_7,
        question: 'Một mảnh vườn hình vuông có diện tích $196\\text{ m}^2$. Tính độ dài cạnh và chu vi mảnh vườn đó.',
        hints: ['Cạnh hình vuông $a = \\sqrt{S}$.'],
        solutionSteps: [
          'Cạnh hình vuông là $a = \\sqrt{196} = 14\\text{ m}$.',
          'Chu vi mảnh vườn là $C = 4 \\cdot 14 = 56\\text{ m}$.'
        ],
        finalAnswer: 'Cạnh $14\\text{ m}$, chu vi $56\\text{ m}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'number_fractions_2d',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-7-b9',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 7',
    lessonNumber: 9,
    stageLabel: 'Toán 7 · Chương IV: Tam giác bằng nhau & Tam giác cân',
    sourceTag: SRC_2018_7,
    title: 'Bài 9: Ba trường hợp Bằng nhau của Tam giác (c.c.c – c.g.c – g.c.g) & Tam giác cân',
    grade: 'Lớp 7 · Hình học phẳng',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 14,
    description:
      'Chứng minh hai tam giác bằng nhau qua 3 trường hợp chuẩn và vận dụng tính chất tam giác cân – tam giác đều.',
    mnemonics: [
      'Góc xen giữa (c.g.c) hoặc Cạnh xen giữa (g.c.g) — Không dùng c.c.g cho tam giác thường!',
      'Tam giác cân có 2 cạnh bên bằng nhau, 2 góc đáy bằng nhau và $\\widehat{\\text{đáy}} = \\frac{180^\\circ - \\widehat{\\text{đỉnh}}}{2}$.'
    ],
    commonTraps: [
      'Ghép hai cạnh và một góc KHÔNG xen giữa để kết luận bằng nhau theo c.g.c.'
    ],
    theory: [
      '1. Ba trường hợp bằng nhau: Cạnh–Cạnh–Cạnh (c.c.c), Cạnh–Góc–Cạnh (c.g.c), Góc–Cạnh–Góc (g.c.g).',
      '2. Tam giác vuông còn có trường hợp đặc biệt: Cạnh huyền – Góc nhọn và Cạnh huyền – Cạnh góc vuông.'
    ],
    keyFormulas: [
      '\\triangle ABC = \\triangle A\'B\'C\' \\implies \\text{các cạnh và góc tương ứng bằng nhau}',
      '\\triangle ABC \\text{ cân tại } A \\iff AB = AC \\iff \\widehat{B} = \\widehat{C}'
    ],
    flashcards: [
      { front: 'Tam giác cân có góc ở đỉnh bằng $50^\\circ$ thì góc ở đáy bằng bao nhiêu?', back: '$(180^\\circ - 50^\\circ)/2 = 65^\\circ$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_7,
        question: 'Tam giác $ABC$ cân tại $A$ có $\\widehat{B} = 70^\\circ$. Số đo $\\widehat{A}$ bằng:',
        options: ['A. $70^\\circ$', 'B. $40^\\circ$', 'C. $55^\\circ$', 'D. $110^\\circ$'],
        correctIndex: 1,
        explanation: '$\\widehat{C} = \\widehat{B} = 70^\\circ \\implies \\widehat{A} = 180^\\circ - 2\\cdot 70^\\circ = 40^\\circ$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_7,
        question: 'Cho $\\triangle ABC$ cân tại $A$, gọi $M$ là trung điểm $BC$. Chứng minh $AM \\perp BC$.',
        hints: ['Xét $\\triangle ABM$ và $\\triangle ACM$ theo trường hợp c.c.c.'],
        solutionSteps: [
          'Xét $\\triangle ABM$ và $\\triangle ACM$: $AB = AC$ (giả thiết), $MB = MC$, $AM$ chung.',
          'Suy ra $\\triangle ABM = \\triangle ACM$ (c.c.c) $\\implies \\widehat{AMB} = \\widehat{AMC}$.',
          'Mà $\\widehat{AMB} + \\widehat{AMC} = 180^\\circ \\implies \\widehat{AMB} = 90^\\circ \\implies AM \\perp BC$.'
        ],
        finalAnswer: '$AM \\perp BC$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'triangle_explorer',
    sim3dMode: 'geometric_transform_3d'
  },
  {
    id: 'math-7-b10',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 7',
    lessonNumber: 10,
    stageLabel: 'Toán 7 · Chương VIII: Làm quen Xác suất của Biến cố',
    sourceTag: SRC_2018_7,
    title: 'Bài 10: Biến cố Ngẫu nhiên – Chắc chắn – Không thể & Xác suất Đồng khả năng',
    grade: 'Lớp 7 · Thống kê & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 11,
    description:
      'Phân biệt 3 loại biến cố và tính chính xác xác suất lý thuyết $P(A) = \\frac{1}{n}$ hoặc $\\frac{k}{n}$ khi gieo xúc xắc, rút thẻ số.',
    mnemonics: [
      'Biến cố Không thể: $P = 0$; Biến cố Chắc chắn: $P = 1$; Biến cố Ngẫu nhiên: $0 < P < 1$.'
    ],
    commonTraps: [
      'Đếm thiếu các kết quả thuận lợi khi tính xác suất số nguyên tố trên mặt xúc xắc ($2, 3, 5$ có 3 số chứ không tính số $1$).'
    ],
    theory: [
      '1. Xác suất của biến cố luôn nằm trong đoạn $[0; 1]$.',
      '2. Với các kết quả đồng khả năng: $P(A) = \\frac{\\text{Số kết quả thuận lợi cho } A}{\\text{Tổng số kết quả có thể xảy ra}}$.'
    ],
    keyFormulas: [
      '0 \\le P(A) \\le 1, \\quad P(\\Omega) = 1, \\quad P(\\varnothing) = 0'
    ],
    flashcards: [
      { front: 'Xác suất gieo được mặt có số chấm là số nguyên tố khi gieo xúc xắc 6 mặt?', back: 'Các số nguyên tố là $2, 3, 5 \\implies P = \\frac{3}{6} = \\frac{1}{2}$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_7,
        question: 'Hộp có 10 thẻ ghi số từ 1 đến 10. Rút ngẫu nhiên 1 thẻ. Xác suất rút được thẻ ghi số chia hết cho 3 là:',
        options: ['A. $0{,}2$', 'B. $0{,}3$', 'C. $0{,}4$', 'D. $0{,}5$'],
        correctIndex: 1,
        explanation: 'Có 3 số chia hết cho 3 là $3, 6, 9 \\implies P = \\frac{3}{10} = 0{,}3$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_7,
        question: 'Gieo một con xúc xắc cân đối 6 mặt. Tính xác suất biến cố $B$: "Số chấm xuất hiện là ước của 6".',
        hints: ['Các ước của 6 từ 1 đến 6 gồm: 1, 2, 3, 6.'],
        solutionSteps: [
          'Không gian mẫu có 6 kết quả đồng khả năng: $\\{1, 2, 3, 4, 5, 6\\}$.',
          'Có 4 kết quả thuận lợi: $1, 2, 3, 6 \\implies P(B) = \\frac{4}{6} = \\frac{2}{3}$.'
        ],
        finalAnswer: '$P(B) = \\frac{2}{3}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'stat_charts_2d',
    sim3dMode: 'probability_bell_3d'
  },

  // ==========================================================================
  // LỚP 8 — GDPT 2018 (BỔ SUNG ĐẦY ĐỦ CHƯƠNG MỤC)
  // ==========================================================================
  {
    id: 'math-8-b8',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 8',
    lessonNumber: 8,
    stageLabel: 'Toán 8 · Chương II: Phân tích Đa thức thành Nhân tử',
    sourceTag: SRC_2018_8,
    title: 'Bài 8: Phân tích Đa thức thành Nhân tử (Đặt nhân tử chung – Hằng đẳng thức – Nhóm hạng tử)',
    grade: 'Lớp 8 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 13,
    description:
      'Nắm vững 4 kĩ thuật phân tích đa thức thành nhân tử chuẩn: đặt nhân tử chung, dùng 7 hằng đẳng thức, nhóm hạng tử và tách hạng tử tam thức bậc hai.',
    mnemonics: [
      'Thứ tự ưu tiên: (1) Đặt nhân tử chung $\\to$ (2) Hằng đẳng thức $\\to$ (3) Nhóm hạng tử $\\to$ (4) Tách/thêm bớt.',
      'Giải phương trình bậc cao lớp 8 bằng cách đưa về phương trình tích $A(x)\\cdot B(x) = 0$.'
    ],
    commonTraps: [
      'Quên đổi dấu khi đưa dấu trừ ra ngoài ngoặc: $a - b = -(b - a)$.'
    ],
    theory: [
      '1. Phân tích đa thức thành nhân tử là biến đổi đa thức thành tích các đa thức bậc thấp hơn.',
      '2. Phối hợp nhiều phương pháp: Ví dụ $2x^2 - 8 = 2(x^2 - 4) = 2(x - 2)(x + 2)$.'
    ],
    keyFormulas: [
      'A^2 - B^2 = (A - B)(A + B)',
      'A^3 \\pm B^3 = (A \\pm B)(A^2 \\mp AB + B^2)'
    ],
    flashcards: [
      { front: 'Phân tích $x^2 - 5x + 6$ thành nhân tử?', back: '$x^2 - 2x - 3x + 6 = (x - 2)(x - 3)$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_8,
        question: 'Kết quả phân tích đa thức $3x^2 - 12$ thành nhân tử là:',
        options: ['A. $3(x^2 - 4)$', 'B. $3(x - 2)(x + 2)$', 'C. $(3x - 6)(x + 2)$', 'D. $3(x - 4)^2$'],
        correctIndex: 1,
        explanation: '$3x^2 - 12 = 3(x^2 - 4) = 3(x - 2)(x + 2)$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_8,
        question: 'Tìm $x$ biết: $x^3 - 4x = 0$.',
        hints: ['Đặt $x$ làm nhân tử chung rồi dùng hiệu hai bình phương.'],
        solutionSteps: [
          '$x(x^2 - 4) = 0 \\iff x(x - 2)(x + 2) = 0$.',
          'Suy ra $x = 0$, $x = 2$ hoặc $x = -2$.'
        ],
        finalAnswer: '$x \\in \\{-2; 0; 2\\}$.'
      }
    ],
    sim2dMode: 'grapher',
    defaultGraphConfig: { type: 'quadratic', params: { a: 1, b: -5, c: 6, d: 0 }, color: '#6366f1', name: 'y = (x-2)(x-3)' },
    sim3dMode: 'tangent_surface_3d'
  },
  {
    id: 'math-8-b9',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 8',
    lessonNumber: 9,
    stageLabel: 'Toán 8 · Chương IX: Tam giác Đồng dạng',
    sourceTag: SRC_2018_8,
    title: 'Bài 9: Ba trường hợp Đồng dạng (c.c.c – c.g.c – g.g) & Ứng dụng Đo chiều cao gián tiếp',
    grade: 'Lớp 8 · Hình học phẳng',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 14,
    description:
      'Phân biệt đồng dạng và bằng nhau, chứng minh $g.g$ cực nhanh để tìm độ dài đoạn thẳng và ứng dụng đo chiều cao tháp, cây xanh.',
    mnemonics: [
      'Tam giác đồng dạng tỉ số $k$: Tỉ số chu vi $= k$; Tỉ số đường cao $= k$; Tỉ số diện tích $= k^2$.'
    ],
    commonTraps: [
      'Nhầm tỉ số diện tích bằng $k$ (ĐÚNG là $k^2$).',
      'Viết sai thứ tự đỉnh tương ứng khi kết luận $\\triangle ABC \\sim \\triangle MNP$.'
    ],
    theory: [
      '1. Hai tam giác đồng dạng có các góc tương ứng bằng nhau và các cạnh tương ứng tỉ lệ theo tỉ số đồng dạng $k$.',
      '2. Hai tam giác vuông chỉ cần có $1$ cặp góc nhọn bằng nhau là đồng dạng ngay (theo trường hợp $g.g$).'
    ],
    keyFormulas: [
      '\\frac{S_{A\'B\'C\'}}{S_{ABC}} = k^2, \\quad \\frac{C_{A\'B\'C\'}}{C_{ABC}} = k'
    ],
    flashcards: [
      { front: 'Nếu $\\triangle DEF \\sim \\triangle ABC$ theo tỉ số $k = 3$ và $S_{ABC} = 12\\text{ cm}^2$ thì $S_{DEF}$ bằng bao nhiêu?', back: '$S_{DEF} = 3^2 \\cdot 12 = 108\\text{ cm}^2$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_8,
        question: 'Một cái cọc cao $1{,}5\\text{ m}$ có bóng trên mặt đất dài $2\\text{ m}$. Cùng lúc đó bóng của cột cờ dài $10\\text{ m}$. Chiều cao cột cờ là:',
        options: ['A. $6\\text{ m}$', 'B. $7{,}5\\text{ m}$', 'C. $8\\text{ m}$', 'D. $13{,}3\\text{ m}$'],
        correctIndex: 1,
        explanation: 'Hai tam giác vuông đồng dạng $\\implies \\frac{h}{1{,}5} = \\frac{10}{2} \\implies h = 7{,}5\\text{ m}$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_8,
        question: 'Cho $\\triangle ABC$ có hai đường cao $BD$ và $CE$ cắt nhau tại $H$. Chứng minh $\\triangle ABD \\sim \\triangle ACE$ và $AB\\cdot AE = AC\\cdot AD$.',
        hints: ['Dùng trường hợp góc – góc với góc chung $\\widehat{A}$.'],
        solutionSteps: [
          'Xét $\\triangle ABD$ và $\\triangle ACE$ có $\\widehat{ADB} = \\widehat{AEC} = 90^\\circ$ và góc $\\widehat{A}$ chung.',
          'Suy ra $\\triangle ABD \\sim \\triangle ACE$ (g.g) $\\implies \\frac{AB}{AC} = \\frac{AD}{AE} \\implies AB\\cdot AE = AC\\cdot AD$.'
        ],
        finalAnswer: '$AB\\cdot AE = AC\\cdot AD$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'thales_similarity',
    sim3dMode: 'angle_thales_3d'
  },
  {
    id: 'math-8-b10',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 8',
    lessonNumber: 10,
    stageLabel: 'Toán 8 · Chương VII: Hàm số bậc nhất $y = ax + b$',
    sourceTag: SRC_2018_8,
    title: 'Bài 10: Đồ thị Hàm số Bậc nhất $y = ax + b$, Hệ số góc $a$ & Song song – Cắt nhau',
    grade: 'Lớp 8 · Hàm số & Đồ thị',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 13,
    description:
      'Vẽ nhanh đường thẳng $y = ax + b$, hiểu ý nghĩa độ dốc (hệ số góc $a$) và xác định đường thẳng song song hoặc vuông góc.',
    mnemonics: [
      'Song song: $a = a\',\\ b \\neq b\'$; Cắt nhau: $a \\neq a\'$; Cắt trên trục tung $Oy$: $a \\neq a\',\\ b = b\'$.'
    ],
    commonTraps: [
      'Quên kiểm tra điều kiện $b \\neq b\'$ khi chứng minh hai đường thẳng song song.'
    ],
    theory: [
      '1. Đồ thị hàm số $y = ax + b$ ($a \\neq 0$) là đường thẳng cắt $Oy$ tại $(0; b)$ và cắt $Ox$ tại $(-b/a; 0)$.',
      '2. Khi $a > 0$, góc tạo với tia $Ox$ là góc nhọn và hàm số đồng biến; khi $a < 0$, góc tạo với tia $Ox$ là góc tù.'
    ],
    keyFormulas: [
      'd // d\' \\iff a = a\' \\land b \\neq b\'',
      'd \\perp d\' \\iff a \\cdot a\' = -1'
    ],
    flashcards: [
      { front: 'Đường thẳng $y = 2x - 4$ cắt trục hoành $Ox$ tại điểm nào?', back: 'Cho $y = 0 \\implies x = 2 \\implies (2; 0)$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_8,
        question: 'Đường thẳng nào sau đây song song với đường thẳng $y = -3x + 2$?',
        options: ['A. $y = 3x + 2$', 'B. $y = -3x - 5$', 'C. $y = -3x + 2$', 'D. $y = 2x - 3$'],
        correctIndex: 1,
        explanation: 'Cùng hệ số góc $a = -3$ và tung độ gốc $-5 \\neq 2$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_8,
        question: 'Tìm $m$ để đường thẳng $y = (m - 1)x + 3$ song song với đường thẳng $y = 2x - 1$.',
        hints: ['Cho $a = a\'$ và kiểm tra $b \\neq b\'$.'],
        solutionSteps: [
          'Điều kiện song song: $m - 1 = 2$ và $3 \\neq -1$ (luôn đúng).',
          'Giải ra $m = 3$.'
        ],
        finalAnswer: '$m = 3$.'
      }
    ],
    sim2dMode: 'grapher',
    defaultGraphConfig: { type: 'linear', params: { a: 2, b: -4, c: 0, d: 0 }, color: '#0ea5e9', name: 'y = 2x - 4' },
    sim3dMode: 'line_plane_oxyz'
  },

  // ==========================================================================
  // LỚP 6 — GDPT 2006 (BỔ SUNG ĐẦY ĐỦ SGK TOÁN 6 NXB GIÁO DỤC)
  // ==========================================================================
  {
    id: 'math-2006-6-7',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 6',
    lessonNumber: 7,
    stageLabel: 'Toán 6 (SGK 2006) · Số học Chương II',
    sourceTag: SRC_2006_6,
    title: 'Bài 7 (SGK 2006): Quy tắc Dấu ngoặc, Quy tắc Chuyển vế & Nhân hai Số nguyên',
    grade: 'Lớp 6 · Số học',
    category: 'Số học & Tổ hợp',
    difficulty: 'Cơ bản',
    readTimeMinutes: 12,
    description:
      'Làm chủ quy tắc đổi dấu khi phá ngoặc có dấu trừ đứng trước, chuyển vế đổi dấu và quy tắc nhân hai số nguyên cùng dấu / trái dấu.',
    mnemonics: [
      'Trước ngoặc dấu TRỪ: đổi dấu TẤT CẢ số hạng trong ngoặc; Trước ngoặc dấu CỘNG: giữ nguyên.',
      'Chuyển vế phải ĐỔI DẤU; Nhân cùng dấu ra DƯƠNG, trái dấu ra ÂM.'
    ],
    commonTraps: [
      'Chỉ đổi dấu số hạng đầu tiên trong ngoặc mà quên đổi dấu các số hạng phía sau.'
    ],
    theory: [
      '1. Quy tắc dấu ngoặc: $-(a - b + c) = -a + b - c$.',
      '2. Quy tắc chuyển vế: $x + a = b \\implies x = b - a$.',
      '3. Bội và ước của số nguyên: Nếu $a = b\\cdot q$ ($b \\neq 0$) thì $a$ là bội của $b$ và $b$ là ước của $a$ (gồm cả ước âm và dương).'
    ],
    keyFormulas: [
      '-(a - b + c) = -a + b - c',
      '(-a) \\cdot (-b) = a \\cdot b'
    ],
    flashcards: [
      { front: 'Tính nhanh $(27 + 65) + (346 - 27 - 65)$?', back: 'Phá ngoặc nhóm $27 - 27$ và $65 - 65$, còn lại $346$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_6,
        question: 'Tìm số nguyên $x$ biết $x - (-7) = -12$:',
        options: ['A. $x = -5$', 'B. $x = -19$', 'C. $x = 5$', 'D. $x = 19$'],
        correctIndex: 1,
        explanation: '$x + 7 = -12 \\implies x = -12 - 7 = -19$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_6,
        question: 'Tính hợp lí: $P = (-15)\\cdot 37 + (-15)\\cdot 63$.',
        hints: ['Áp dụng tính chất phân phối đặt $-15$ làm thừa số chung.'],
        solutionSteps: [
          '$P = (-15)\\cdot(37 + 63) = (-15)\\cdot 100 = -1500$.'
        ],
        finalAnswer: '$P = -1500$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'number_fractions_2d',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-2006-6-8',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 6',
    lessonNumber: 8,
    stageLabel: 'Toán 6 (SGK 2006) · Số học Chương III',
    sourceTag: SRC_2006_6,
    title: 'Bài 8 (SGK 2006): Ba Bài toán cơ bản về Phân số, Hỗn số & Tỉ số phần trăm',
    grade: 'Lớp 6 · Số học',
    category: 'Số học & Tổ hợp',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 13,
    description:
      'Phân biệt rạch ròi 3 bài toán kinh điển của Toán 6 (2006): Tìm giá trị phân số của một số, Tìm một số biết giá trị phân số, Tìm tỉ số phần trăm.',
    mnemonics: [
      'Tìm $\\frac{m}{n}$ của $b$ cho trước $\\to$ NHÂN: $b \\cdot \\frac{m}{n}$.',
      'Tìm một số biết $\\frac{m}{n}$ của nó bằng $a$ $\\to$ CHIA: $a : \\frac{m}{n}$.'
    ],
    commonTraps: [
      'Lẫn lộn phép nhân và phép chia giữa Bài toán 1 và Bài toán 2.'
    ],
    theory: [
      '1. Đổi hỗn số $2\\frac{3}{4} = \\frac{2\\cdot 4 + 3}{4} = \\frac{11}{4}$.',
      '2. Tỉ số phần trăm của $a$ và $b$: $\\frac{a\\cdot 100}{b}\\%$. Ứng dụng tính lãi suất, giảm giá, tỉ lệ bản đồ.'
    ],
    keyFormulas: [
      '\\text{Bài 1}: x = b \\cdot \\frac{m}{n}; \\quad \\text{Bài 2}: x = a : \\frac{m}{n}'
    ],
    flashcards: [
      { front: '$\\frac{3}{4}$ của một tấm vải dài $12\\text{ m}$. Cả tấm vải dài bao nhiêu?', back: '$12 : \\frac{3}{4} = 16\\text{ m}$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_6,
        question: 'Lớp 6A có 40 học sinh, trong đó số học sinh giỏi chiếm $\\frac{3}{8}$ cả lớp. Số học sinh giỏi là:',
        options: ['A. 12', 'B. 15', 'C. 18', 'D. 24'],
        correctIndex: 1,
        explanation: '$40 \\cdot \\frac{3}{8} = 15$ học sinh.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_6,
        question: 'Một chiếc áo giá niêm yết $250\\,000$ đồng đang được giảm giá $20\\%$. Tính giá bán sau khi giảm.',
        hints: ['Giá mới bằng $80\\%$ giá gốc.'],
        solutionSteps: [
          'Số tiền được giảm: $250\\,000 \\cdot 20\\% = 50\\,000$ đồng.',
          'Giá bán mới: $250\\,000 - 50\\,000 = 200\\,000$ đồng.'
        ],
        finalAnswer: '$200\\,000$ đồng.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'number_fractions_2d',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-2006-6-9',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 6',
    lessonNumber: 9,
    stageLabel: 'Toán 6 (SGK 2006) · Hình học Chương II',
    sourceTag: SRC_2006_6,
    title: 'Bài 9 (SGK 2006): Tia nằm giữa hai tia, Tia phân giác của Góc & Đường tròn – Tam giác',
    grade: 'Lớp 6 · Hình học phẳng',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 13,
    description:
      'Chứng minh tia nằm giữa bằng so sánh góc trên cùng nửa mặt phẳng, xác định tia phân giác $\\widehat{xOz} = \\widehat{zOy} = \\frac{1}{2}\\widehat{xOy}$ và vẽ đường tròn/tam giác bằng compa.',
    mnemonics: [
      'Trên cùng nửa mặt phẳng bờ $Ox$: Nếu $\\widehat{xOy} < \\widehat{xOz}$ thì tia $Oy$ nằm giữa $Ox$ và $Oz$.',
      'Tia phân giác = Nằm giữa + Chia đôi số đo góc.'
    ],
    commonTraps: [
      'Kết luận tia là tia phân giác khi chỉ mới có $\\widehat{xOz} = \\widehat{zOy}$ mà quên kiểm tra tia $Oz$ nằm giữa.'
    ],
    theory: [
      '1. Khi tia $Oy$ nằm giữa $Ox$ và $Oz$: $\\widehat{xOy} + \\widehat{yOz} = \\widehat{xOz}$.',
      '2. Hai góc kề bù có tổng số đo bằng $180^\\circ$. Hai góc phụ nhau có tổng bằng $90^\\circ$.',
      '3. Đường tròn $(O; R)$ gồm tất cả các điểm cách $O$ một khoảng bằng $R$; dây đi qua tâm là đường kính dài $2R$.'
    ],
    keyFormulas: [
      '\\widehat{xOz} = \\widehat{zOy} = \\frac{\\widehat{xOy}}{2}',
      '\\text{Góc kề bù}: \\alpha + \\beta = 180^\\circ'
    ],
    flashcards: [
      { front: 'Cho $\\widehat{xOy} = 80^\\circ$, tia $Ot$ là phân giác của $\\widehat{xOy}$. Tính $\\widehat{xOt}$?', back: '$\\widehat{xOt} = 80^\\circ : 2 = 40^\\circ$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_6,
        question: 'Góc bù với góc $55^\\circ$ có số đo là:',
        options: ['A. $35^\\circ$', 'B. $125^\\circ$', 'C. $45^\\circ$', 'D. $135^\\circ$'],
        correctIndex: 1,
        explanation: 'Hai góc bù nhau có tổng $180^\\circ \\implies 180^\\circ - 55^\\circ = 125^\\circ$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_6,
        question: 'Trên cùng nửa mặt phẳng bờ chứa tia $Ox$, vẽ $\\widehat{xOy} = 40^\\circ$ và $\\widehat{xOz} = 110^\\circ$. Tính $\\widehat{yOz}$.',
        hints: ['Vì $40^\\circ < 110^\\circ$ nên tia $Oy$ nằm giữa $Ox$ và $Oz$.'],
        solutionSteps: [
          'Tia $Oy$ nằm giữa $Ox, Oz \\implies \\widehat{xOy} + \\widehat{yOz} = \\widehat{xOz}$.',
          '$\\widehat{yOz} = 110^\\circ - 40^\\circ = 70^\\circ$.'
        ],
        finalAnswer: '$\\widehat{yOz} = 70^\\circ$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'angles_parallel',
    sim3dMode: 'angle_thales_3d'
  },

  // ==========================================================================
  // LỚP 7 — GDPT 2006 (BỔ SUNG ĐẦY ĐỦ SGK TOÁN 7 NXB GIÁO DỤC)
  // ==========================================================================
  {
    id: 'math-2006-7-7',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 7',
    lessonNumber: 7,
    stageLabel: 'Toán 7 (SGK 2006) · Đại số Chương I & II',
    sourceTag: SRC_2006_7,
    title: 'Bài 7 (SGK 2006): Số thập phân hữu hạn – vô hạn tuần hoàn, Căn bậc hai & Đồ thị $y = ax$',
    grade: 'Lớp 7 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 12,
    description:
      'Nhận biết nhanh phân số viết được thành số thập phân hữu hạn (mẫu chỉ chứa ước nguyên tố $2$ và $5$) và vẽ đồ thị hàm số $y = ax$ đi qua gốc $O(0;0)$.',
    mnemonics: [
      'Phân số tối giản có mẫu chỉ gồm ước nguyên tố $2$ hoặc $5$ $\\to$ Hữu hạn; Có ước nguyên tố khác $2, 5$ $\\to$ Vô hạn tuần hoàn.',
      'Đồ thị hàm số $y = ax$ ($a \\neq 0$) luôn là một đường thẳng đi qua gốc tọa độ $O(0; 0)$ và $A(1; a)$.'
    ],
    commonTraps: [
      'Quên rút gọn phân số về TỐI GIẢN trước khi xét ước nguyên tố của mẫu số!'
    ],
    theory: [
      '1. Ví dụ $\\frac{6}{15} = \\frac{2}{5} = 0{,}4$ là số thập phân hữu hạn dù mẫu $15$ ban đầu chia hết cho $3$ (vì chưa tối giản!).',
      '2. Đồ thị $y = ax$: khi $a > 0$ đồ thị nằm ở góc phần tư I và III; khi $a < 0$ đồ thị nằm ở góc phần tư II và IV.'
    ],
    keyFormulas: [
      'y = ax \\ (a \\neq 0) \\text{ đi qua } O(0;0) \\text{ và } A(1; a)'
    ],
    flashcards: [
      { front: 'Phân số $\\frac{7}{20}$ viết thành số thập phân hữu hạn hay vô hạn tuần hoàn?', back: 'Mẫu $20 = 2^2 \\cdot 5$ chỉ có ước nguyên tố 2 và 5 $\\implies$ Hữu hạn ($0{,}35$).' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_7,
        question: 'Điểm nào sau đây thuộc đồ thị hàm số $y = -3x$?',
        options: ['A. $(1; 3)$', 'B. $(-1; 3)$', 'C. $(3; -1)$', 'D. $(0; -3)$'],
        correctIndex: 1,
        explanation: 'Thay $x = -1$ vào $y = -3x$ được $y = -3(-1) = 3$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_7,
        question: 'Tìm giá trị của $m$ biết điểm $A(-2; 8)$ thuộc đồ thị hàm số $y = mx$.',
        hints: ['Thay $x = -2, y = 8$ vào $y = mx$.'],
        solutionSteps: [
          '$8 = m \\cdot (-2) \\implies m = -4$.'
        ],
        finalAnswer: '$m = -4$.'
      }
    ],
    sim2dMode: 'grapher',
    defaultGraphConfig: { type: 'linear', params: { a: -3, b: 0, c: 0, d: 0 }, color: '#10b981', name: 'y = -3x' },
    sim3dMode: 'line_plane_oxyz'
  },
  {
    id: 'math-2006-7-8',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 7',
    lessonNumber: 8,
    stageLabel: 'Toán 7 (SGK 2006) · Đại số Chương IV',
    sourceTag: SRC_2006_7,
    title: 'Bài 8 (SGK 2006): Đa thức một biến sắp xếp & Nghiệm của Đa thức một biến',
    grade: 'Lớp 7 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 12,
    description:
      'Sắp xếp đa thức theo lũy thừa giảm dần của biến, tìm bậc – hệ số cao nhất – hệ số tự do và kiểm tra nghiệm $P(a) = 0$.',
    mnemonics: [
      'Số $a$ là nghiệm của đa thức $P(x) \\iff P(a) = 0$.',
      'Cộng trừ hai đa thức một biến theo cột dọc nhớ đặt các hạng tử cùng bậc thẳng cột nhau.'
    ],
    commonTraps: [
      'Chưa thu gọn đa thức đã vội kết luận bậc của đa thức.'
    ],
    theory: [
      '1. Bậc của đa thức một biến (khác 0, đã thu gọn) là số mũ lớn nhất của biến trong đa thức đó.',
      '2. Một đa thức khác đa thức 0 có số nghiệm không vượt quá bậc của nó.'
    ],
    keyFormulas: [
      'x = a \\text{ là nghiệm của } P(x) \\iff P(a) = 0'
    ],
    flashcards: [
      { front: 'Tìm nghiệm của đa thức $P(x) = 3x - 9$?', back: 'Cho $3x - 9 = 0 \\implies x = 3$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_7,
        question: 'Giá trị nào sau đây là nghiệm của đa thức $Q(x) = x^2 - 4$?',
        options: ['A. $x = 4$', 'B. $x = -2$', 'C. $x = 1$', 'D. $x = 0$'],
        correctIndex: 1,
        explanation: '$Q(-2) = (-2)^2 - 4 = 0$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_7,
        question: 'Cho $A(x) = 3x^2 - 2x + 5$ và $B(x) = x^2 + 2x - 1$. Tính $A(x) + B(x)$ và tìm giá trị tại $x = -1$.',
        hints: ['Cộng các hạng tử đồng dạng cùng bậc.'],
        solutionSteps: [
          '$A(x) + B(x) = (3x^2 + x^2) + (-2x + 2x) + (5 - 1) = 4x^2 + 4$.',
          'Tại $x = -1$: $4(-1)^2 + 4 = 8$.'
        ],
        finalAnswer: '$4x^2 + 4$, giá trị tại $x=-1$ là $8$.'
      }
    ],
    sim2dMode: 'grapher',
    defaultGraphConfig: { type: 'quadratic', params: { a: 1, b: 0, c: -4, d: 0 }, color: '#f59e0b', name: 'Q(x) = x² - 4' },
    sim3dMode: 'tangent_surface_3d'
  },
  {
    id: 'math-2006-7-9',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 7',
    lessonNumber: 9,
    stageLabel: 'Toán 7 (SGK 2006) · Hình học Chương II & III',
    sourceTag: SRC_2006_7,
    title: 'Bài 9 (SGK 2006): Định lí Py-ta-go & Bốn đường Đồng quy trong Tam giác',
    grade: 'Lớp 7 · Hình học phẳng',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 14,
    description:
      'Trong chương trình 2006, Định lí Py-ta-go và 4 đường đồng quy (Trung tuyến, Phân giác, Trung trực, Đường cao) nằm ở SGK Hình học 7!',
    mnemonics: [
      'Py-ta-go: $c^2 = a^2 + b^2$ (Bình phương cạnh huyền = tổng bình phương hai cạnh góc vuông).',
      'Trọng tâm $G$ chia trung tuyến tỉ lệ $\\frac{2}{3}$ từ đỉnh; Giao 3 trung trực là tâm ngoại tiếp; Giao 3 phân giác là tâm nội tiếp.'
    ],
    commonTraps: [
      'Áp dụng nhầm định lí Py-ta-go cho tam giác KHÔNG vuông!'
    ],
    theory: [
      '1. Định lí Py-ta-go thuận & đảo: Nếu tam giác có $BC^2 = AB^2 + AC^2$ thì vuông tại $A$. Bộ ba Py-ta-go hay gặp: $(3;4;5), (5;12;13), (6;8;10), (8;15;17)$.',
      '2. Bốn điểm đặc biệt: Trọng tâm $G$ (3 trung tuyến), Tâm nội tiếp $I$ (3 phân giác), Tâm ngoại tiếp $O$ (3 trung trực), Trực tâm $H$ (3 đường cao).'
    ],
    keyFormulas: [
      'BC^2 = AB^2 + AC^2 \\iff \\widehat{A} = 90^\\circ',
      'AG = \\frac{2}{3} AM'
    ],
    flashcards: [
      { front: 'Tam giác có 3 cạnh $5\\text{ cm}, 12\\text{ cm}, 13\\text{ cm}$ có phải tam giác vuông không?', back: 'Có! Vì $5^2 + 12^2 = 25 + 144 = 169 = 13^2$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_7,
        question: 'Tam giác $ABC$ có trung tuyến $AM = 12\\text{ cm}$ và $G$ là trọng tâm. Độ dài đoạn $AG$ bằng:',
        options: ['A. $4\\text{ cm}$', 'B. $6\\text{ cm}$', 'C. $8\\text{ cm}$', 'D. $9\\text{ cm}$'],
        correctIndex: 2,
        explanation: '$AG = \\frac{2}{3} AM = \\frac{2}{3} \\cdot 12 = 8\\text{ cm}$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_7,
        question: 'Một chiếc thang dài $5\\text{ m}$ đặt tựa vào tường thẳng đứng, chân thang cách chân tường $3\\text{ m}$. Tính độ cao đầu thang chạm tường.',
        hints: ['Áp dụng định lí Py-ta-go cho tam giác vuông.'],
        solutionSteps: [
          '$h = \\sqrt{5^2 - 3^2} = \\sqrt{25 - 9} = \\sqrt{16} = 4\\text{ m}$.'
        ],
        finalAnswer: '$4\\text{ m}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'triangle_explorer',
    sim3dMode: 'geometric_transform_3d'
  },

  // ==========================================================================
  // LỚP 8 — GDPT 2006 (BỔ SUNG ĐẦY ĐỦ SGK TOÁN 8 NXB GIÁO DỤC)
  // ==========================================================================
  {
    id: 'math-2006-8-7',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 8',
    lessonNumber: 7,
    stageLabel: 'Toán 8 (SGK 2006) · Đại số Chương I',
    sourceTag: SRC_2006_8,
    title: 'Bài 7 (SGK 2006): Phân tích Đa thức thành Nhân tử & Chia Đa thức cho Đa thức một biến',
    grade: 'Lớp 8 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 13,
    description:
      'Thực hiện phép chia đa thức đã sắp xếp theo cột dọc, tìm phần dư và tìm điều kiện chia hết $A(x) \\vdots B(x)$.',
    mnemonics: [
      'Chia đa thức theo cột dọc: Lấy hạng tử bậc cao nhất của số bị chia chia cho hạng tử bậc cao nhất của số chia, nhân ngược và TRỪ xuống.',
      'Đa thức $A(x)$ chia hết cho $(x - a) \\iff A(a) = 0$ (Định lí Bơ-zu).'
    ],
    commonTraps: [
      'Quên chừa khoảng trống cho bậc bị khuyết khi đặt phép chia cột dọc, hoặc trừ nhầm dấu!'
    ],
    theory: [
      '1. Với hai đa thức một biến $A, B$ ($B \\neq 0$), luôn tồn tại duy nhất $Q, R$ sao cho $A = B \\cdot Q + R$ với bậc $R <$ bậc $B$.',
      '2. Phép chia hết khi $R = 0$.'
    ],
    keyFormulas: [
      'A(x) = B(x)\\cdot Q(x) + R(x)',
      'A(x) \\vdots (x - a) \\iff A(a) = 0'
    ],
    flashcards: [
      { front: 'Số dư khi chia $P(x) = x^2 + 3x + 5$ cho $(x - 1)$ là bao nhiêu?', back: 'Theo định lí Bơ-zu, dư bằng $P(1) = 1 + 3 + 5 = 9$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_8,
        question: 'Để đa thức $x^2 - 5x + m$ chia hết cho $x - 2$ thì giá trị của $m$ là:',
        options: ['A. $m = 6$', 'B. $m = -6$', 'C. $m = 14$', 'D. $m = 4$'],
        correctIndex: 0,
        explanation: 'Thay $x = 2$ vào đa thức phải bằng $0$: $4 - 10 + m = 0 \\implies m = 6$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_8,
        question: 'Thực hiện phép chia $(2x^2 - 5x + 2) : (x - 2)$.',
        hints: ['Phân tích tử thức thành nhân tử hoặc chia cột dọc.'],
        solutionSteps: [
          '$2x^2 - 5x + 2 = (2x - 1)(x - 2)$.',
          'Do đó $(2x^2 - 5x + 2) : (x - 2) = 2x - 1$.'
        ],
        finalAnswer: '$2x - 1$.'
      }
    ],
    sim2dMode: 'grapher',
    defaultGraphConfig: { type: 'quadratic', params: { a: 2, b: -5, c: 2, d: 0 }, color: '#8b5cf6', name: 'y = 2x² - 5x + 2' },
    sim3dMode: 'tangent_surface_3d'
  },
  {
    id: 'math-2006-8-8',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 8',
    lessonNumber: 8,
    stageLabel: 'Toán 8 (SGK 2006) · Hình học Chương II',
    sourceTag: SRC_2006_8,
    title: 'Bài 8 (SGK 2006): Đa giác, Đa giác đều & Diện tích Đa giác (Chữ nhật – Tam giác – Thang – Thoi)',
    grade: 'Lớp 8 · Hình học phẳng',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 12,
    description:
      'Tính tổng số đo các góc của đa giác $n$ cạnh $(n - 2)\\cdot 180^\\circ$ và toàn bộ công thức diện tích tứ giác – tam giác.',
    mnemonics: [
      'Tổng các góc đa giác lồi $n$ cạnh: $(n - 2) \\cdot 180^\\circ$.',
      'Diện tích hình thang = (Đáy lớn + Đáy nhỏ) $\\times$ Chiều cao : 2; Diện tích hình thoi = Nửa tích hai đường chéo.'
    ],
    commonTraps: [
      'Quên chia đôi khi tính diện tích tam giác hoặc hình thoi.'
    ],
    theory: [
      '1. Đa giác đều $n$ cạnh có tất cả các cạnh bằng nhau và các góc bằng nhau, mỗi góc bằng $\\frac{(n-2)\\cdot 180^\\circ}{n}$.',
      '2. Để tính diện tích đa giác bất kì, chia nhỏ thành các tam giác và hình thang vuông rồi cộng lại.'
    ],
    keyFormulas: [
      'S_{\\text{lục giác đều}} : \\text{Mỗi góc } = 120^\\circ',
      'S_{\\text{thoi}} = \\frac{1}{2} d_1 d_2'
    ],
    flashcards: [
      { front: 'Tổng các góc của hình ngũ giác (5 cạnh) và lục giác (6 cạnh) là bao nhiêu?', back: 'Ngũ giác: $540^\\circ$; Lục giác: $720^\\circ$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_8,
        question: 'Mỗi góc trong của một hình lục giác đều ($6$ cạnh) có số đo là:',
        options: ['A. $108^\\circ$', 'B. $120^\\circ$', 'C. $135^\\circ$', 'D. $90^\\circ$'],
        correctIndex: 1,
        explanation: '$\\frac{(6 - 2)\\cdot 180^\\circ}{6} = 120^\\circ$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_8,
        question: 'Một hình thoi có hai đường chéo dài $12\\text{ cm}$ và $16\\text{ cm}$. Tính diện tích và cạnh hình thoi.',
        hints: ['Hai đường chéo hình thoi vuông góc và cắt nhau tại trung điểm mỗi đường.'],
        solutionSteps: [
          'Diện tích: $S = \\frac{1}{2} \\cdot 12 \\cdot 16 = 96\\text{ cm}^2$.',
          'Nửa đường chéo là $6\\text{ cm}$ và $8\\text{ cm} \\implies$ Cạnh $= \\sqrt{6^2 + 8^2} = 10\\text{ cm}$.'
        ],
        finalAnswer: '$S = 96\\text{ cm}^2$, cạnh $10\\text{ cm}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'quadrilaterals_sym',
    sim3dMode: 'geometric_transform_3d'
  },
  {
    id: 'math-2006-8-9',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 8',
    lessonNumber: 9,
    stageLabel: 'Toán 8 (SGK 2006) · Hình học Chương III',
    sourceTag: SRC_2006_8,
    title: 'Bài 9 (SGK 2006): Tính chất Đường phân giác Tam giác & Ba trường hợp Đồng dạng',
    grade: 'Lớp 8 · Hình học phẳng',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 14,
    description:
      'Vận dụng tỉ số đường phân giác $\\frac{DB}{DC} = \\frac{AB}{AC}$ và chứng minh tam giác đồng dạng (c.c.c, c.g.c, g.g) giải toán hình học 8.',
    mnemonics: [
      'Đường phân giác trong tam giác chia cạnh đối diện thành hai đoạn TỈ LỆ với hai cạnh kề hai đoạn ấy!'
    ],
    commonTraps: [
      'Viết ngược tỉ số $\\frac{DB}{DC} = \\frac{AC}{AB}$ (SAI! Đỉnh nào đi với cạnh kề đỉnh đó).'
    ],
    theory: [
      '1. Cho $\\triangle ABC$, phân giác $AD$ ($D \\in BC$) $\\implies \\frac{DB}{DC} = \\frac{AB}{AC}$.',
      '2. Ba trường hợp đồng dạng của hai tam giác thường và trường hợp cạnh huyền – cạnh góc vuông của tam giác vuông.'
    ],
    keyFormulas: [
      '\\frac{DB}{DC} = \\frac{AB}{AC}'
    ],
    flashcards: [
      { front: 'Cho $\\triangle ABC$ có $AB = 6, AC = 9$, phân giác $AD$. Tìm tỉ số $\\frac{DB}{DC}$?', back: '$\\frac{DB}{DC} = \\frac{6}{9} = \\frac{2}{3}$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_8,
        question: 'Cho $\\triangle ABC$ có $AB = 4\\text{ cm}, AC = 6\\text{ cm}, BC = 5\\text{ cm}$, $AD$ là phân giác góc $A$. Độ dài $BD$ bằng:',
        options: ['A. $2\\text{ cm}$', 'B. $3\\text{ cm}$', 'C. $2{,}5\\text{ cm}$', 'D. $1{,}5\\text{ cm}$'],
        correctIndex: 0,
        explanation: '$\\frac{BD}{DC} = \\frac{4}{6} = \\frac{2}{3}$ và $BD + DC = 5 \\implies BD = 2\\text{ cm}$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_8,
        question: 'Cho $\\triangle ABC$ có $AB = 6\\text{ cm}, AC = 8\\text{ cm}, BC = 10\\text{ cm}$. Kẻ đường phân giác $AD$ ($D \\in BC$). Tính $BD$ và $DC$.',
        hints: ['Dùng tính chất dãy tỉ số bằng nhau từ $\\frac{BD}{6} = \\frac{DC}{8}$.'],
        solutionSteps: [
          'Theo tính chất đường phân giác: $\\frac{BD}{DC} = \\frac{AB}{AC} = \\frac{6}{8} = \\frac{3}{4}$.',
          '$\\frac{BD}{3} = \\frac{DC}{4} = \\frac{BD + DC}{3 + 4} = \\frac{10}{7}$.',
          'Vậy $BD = \\frac{30}{7}\\text{ cm}$, $DC = \\frac{40}{7}\\text{ cm}$.'
        ],
        finalAnswer: '$BD = \\frac{30}{7}\\text{ cm}, DC = \\frac{40}{7}\\text{ cm}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'thales_similarity',
    sim3dMode: 'angle_thales_3d'
  },
  {
    id: 'math-2006-8-10',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 8',
    lessonNumber: 10,
    stageLabel: 'Toán 8 (SGK 2006) · Hình học Chương IV',
    sourceTag: SRC_2006_8,
    title: 'Bài 10 (SGK 2006): Hình hộp chữ nhật, Lăng trụ đứng & Hình chóp đều',
    grade: 'Lớp 8 · Hình học không gian',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 13,
    description:
      'Tính diện tích xung quanh, diện tích toàn phần và thể tích Hình hộp chữ nhật, Lăng trụ đứng tam giác/tứ giác và Hình chóp đều trên mô hình khai triển 3D.',
    mnemonics: [
      'Lăng trụ đứng: $S_{xq} = C_{\\text{đáy}} \\cdot h$, $V = S_{\\text{đáy}} \\cdot h$.',
      'Hình chóp đều: $S_{xq} = p_{\\text{đáy}} \\cdot d$ (nửa chu vi nhân trung đoạn), $V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h$.'
    ],
    commonTraps: [
      'Quên nhân hệ số $\\frac{1}{3}$ khi tính thể tích hình chóp đều hoặc nhầm trung đoạn $d$ với chiều cao $h$.'
    ],
    theory: [
      '1. Hình hộp chữ nhật có 6 mặt chữ nhật, 12 cạnh, 8 đỉnh; thể tích $V = a \\cdot b \\cdot c$.',
      '2. Hình chóp tứ giác đều có đáy là hình vuông và 4 mặt bên là các tam giác cân bằng nhau.'
    ],
    keyFormulas: [
      'V_{\\text{lăng trụ}} = S_{\\text{đáy}} \\cdot h; \\quad V_{\\text{chóp}} = \\frac{1}{3} S_{\\text{đáy}} \\cdot h'
    ],
    flashcards: [
      { front: 'Hình lăng trụ đứng đáy tam giác vuông cạnh góc vuông $3, 4\\text{ cm}$ và chiều cao $10\\text{ cm}$ có thể tích bao nhiêu?', back: '$S_{\\text{đáy}} = \\frac{1}{2}\\cdot 3\\cdot 4 = 6\\text{ cm}^2 \\implies V = 6\\cdot 10 = 60\\text{ cm}^3$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_8,
        question: 'Hình chóp đều và hình lăng trụ đứng có cùng diện tích đáy $S$ và cùng chiều cao $h$. Tỉ số thể tích $\\frac{V_{\\text{chóp}}}{V_{\\text{lăng trụ}}}$ là:',
        options: ['A. $\\frac{1}{2}$', 'B. $\\frac{1}{3}$', 'C. $\\frac{2}{3}$', 'D. $3$'],
        correctIndex: 1,
        explanation: 'Thể tích hình chóp bằng đúng $\\frac{1}{3}$ thể tích hình lăng trụ cùng đáy cùng cao.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_8,
        question: 'Một bể cá hình hộp chữ nhật dài $80\\text{ cm}$, rộng $40\\text{ cm}$, mực nước cao $30\\text{ cm}$. Hỏi trong bể có bao nhiêu lít nước?',
        hints: ['$1\\text{ lít} = 1000\\text{ cm}^3$.'],
        solutionSteps: [
          '$V = 80 \\cdot 40 \\cdot 30 = 96\\,000\\text{ cm}^3$.',
          'Đổi sang lít: $96\\,000 : 1000 = 96$ lít.'
        ],
        finalAnswer: '$96$ lít.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'spatial_pyramid',
    sim3dMode: 'solid_prism_nets_3d'
  }
];
