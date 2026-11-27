import { MathLecture } from '../types';

// Chương trình Toán THCS Lớp 6, 7, 8 — Đầy đủ 2 hệ:
// 1. GDPT 2018 (khong_chuyen · Kết nối tri thức / Chân trời sáng tạo / Cánh Diều)
// 2. GDPT 2006 (gdpt_2006 · SGK NXB Giáo dục Việt Nam 2006)
// Mọi bài giảng viết theo nguyên tắc: Giải thích đơn giản nhất · Ví dụ đời thực cụ thể · Kèm Mô phỏng 2D + 3D đúng chủ đề.

const SRC_2018_6 = 'GDPT 2018 (KNTT · CTST · Cánh Diều) · Toán 6';
const SRC_2018_7 = 'GDPT 2018 (KNTT · CTST · Cánh Diều) · Toán 7';
const SRC_2018_8 = 'GDPT 2018 (KNTT · CTST · Cánh Diều) · Toán 8';
const SRC_2006_6 = 'GDPT 2006 · SGK Toán 6 (NXB Giáo dục)';
const SRC_2006_7 = 'GDPT 2006 · SGK Toán 7 (NXB Giáo dục)';
const SRC_2006_8 = 'GDPT 2006 · SGK Toán 8 (NXB Giáo dục)';

export const MATH_MIDDLE_SCHOOL_LESSONS: MathLecture[] = [
  // ==========================================================================
  // LỚP 6 — GDPT 2018 (8 CHƯƠNG/CHỦ ĐỀ TRỌNG TÂM)
  // ==========================================================================
  {
    id: 'math-6-b1',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 6',
    lessonNumber: 1,
    stageLabel: 'Toán 6 · Chương I: Số tự nhiên & Lũy thừa',
    sourceTag: SRC_2018_6,
    title: 'Bài 1: Tập hợp số tự nhiên, Phép tính & Lũy thừa với số mũ tự nhiên',
    grade: 'Lớp 6 · Số học',
    category: 'Số học & Tổ hợp',
    difficulty: 'Cơ bản',
    readTimeMinutes: 12,
    description:
      'Hiểu bản chất tập hợp $\\mathbb{N}$, cách viết gọn phép nhân lặp lại thành lũy thừa $a^n$, quy tắc nhân/chia hai lũy thừa cùng cơ số và thứ tự thực hiện phép tính.',
    mnemonics: [
      'Nhân hai lũy thừa cùng cơ số: GIỮ nguyên cơ số, CỘNG số mũ ($a^m \\cdot a^n = a^{m+n}$).',
      'Chia hai lũy thừa cùng cơ số ($a \\neq 0$): GIỮ nguyên cơ số, TRỪ số mũ ($a^m : a^n = a^{m-n}$).',
      'Thứ tự ưu tiên: Ngoặc $() \\to [\\,] \\to \\{\\}$ $\\to$ Lũy thừa $\\to$ Nhân/Chia $\\to$ Cộng/Trừ.'
    ],
    commonTraps: [
      'Nhầm $2^3 = 2 \\times 3 = 6$ (SAI! Đúng là $2 \\times 2 \\times 2 = 8$).',
      'Quên quy ước $a^0 = 1$ với mọi $a \\neq 0$ (ví dụ $5^0 = 1$, không phải $0$).'
    ],
    theory: [
      '1. Lũy thừa bậc $n$ của $a$ chỉ là cách viết tắt của phép nhân $n$ thừa số $a$ giống hệt nhau: $a^n = \\underbrace{a \\cdot a \\cdots a}_{n \\text{ số}}$. Ví dụ: một tờ giấy gấp đôi 4 lần tạo ra $2^4 = 16$ lớp giấy.',
      '2. Hai quy tắc vàng cùng cơ số: Khi nhân thì cộng mũ ($3^2 \\cdot 3^4 = 3^6$), khi chia thì trừ mũ ($5^7 : 5^3 = 5^4$). Quy ước $a^1 = a$ và $a^0 = 1$ ($a \\neq 0$).',
      '3. Thứ tự tính biểu thức: Luôn xử lý trong ngoặc tròn trước, đến ngoặc vuông, ngoặc nhọn; ngoài ngoặc làm Lũy thừa trước, rồi Nhân–Chia từ trái sang phải, cuối cùng mới Cộng–Trừ.'
    ],
    keyFormulas: [
      'a^n = \\underbrace{a \\cdot a \\cdots a}_{n \\text{ thừa số}}',
      'a^m \\cdot a^n = a^{m+n}',
      'a^m : a^n = a^{m-n} \\quad (a \\neq 0, m \\ge n)'
    ],
    flashcards: [
      { front: 'Giá trị của $2^5$ và $2026^0$ lần lượt là bao nhiêu?', back: '$2^5 = 32$ và $2026^0 = 1$.' },
      { front: 'Biểu thức $10 + 2 \\cdot 3^2$ tính như thế nào?', back: 'Tính lũy thừa trước ($3^2 = 9$), rồi nhân ($2 \\cdot 9 = 18$), cuối cùng cộng ($10 + 18 = 28$).' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_6,
        question: 'Kết quả viết dưới dạng một lũy thừa của phép tính $5^4 \\cdot 5^3 : 5^2$ là:',
        options: ['A. $5^5$', 'B. $5^9$', 'C. $5^6$', 'D. $25^5$'],
        correctIndex: 0,
        explanation: 'Cùng cơ số 5: cộng mũ khi nhân rồi trừ mũ khi chia $\\Rightarrow 5^{4+3-2} = 5^5$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_6,
        question: 'Tính giá trị biểu thức: $A = 120 - [50 - (5 - 2)^3] \\cdot 2$.',
        hints: ['Tính trong ngoặc tròn $(5-2)$ trước, rồi nâng lũy thừa bậc 3.'],
        solutionSteps: [
          'Bước 1: Tính ngoặc tròn: $5 - 2 = 3 \\implies (5 - 2)^3 = 3^3 = 27$.',
          'Bước 2: Tính ngoặc vuông: $50 - 27 = 23$.',
          'Bước 3: Nhân trước trừ sau: $A = 120 - 23 \\cdot 2 = 120 - 46 = 74$.'
        ],
        finalAnswer: '$A = 74$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-6-b2',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 6',
    lessonNumber: 2,
    stageLabel: 'Toán 6 · Chương II: Chia hết, Số nguyên tố & ƯCLN – BCNN',
    sourceTag: SRC_2018_6,
    title: 'Bài 2: Tính chất chia hết, Số nguyên tố & ƯCLN – BCNN',
    grade: 'Lớp 6 · Số học',
    category: 'Số học & Tổ hợp',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Nhận biết nhanh dấu hiệu chia hết cho 2, 3, 5, 9; phân biệt số nguyên tố – hợp số và biết cách dùng ƯCLN (chia đều nhiều phần nhất) hay BCNN (cùng lặp lại chu kì).',
    mnemonics: [
      'Chia đều đồ vật thành nhiều phần/tổ nhất $\\to$ Dùng ƯCLN (chọn thừa số CHUNG, mũ NHỎ nhất).',
      'Tìm ngày hai việc cùng lặp lại hoặc số nhỏ nhất cùng chia hết $\\to$ Dùng BCNN (chọn CHUNG & RIÊNG, mũ LỚN nhất).'
    ],
    commonTraps: [
      'Tưởng số $1$ là số nguyên tố (SAI! Số nguyên tố nhỏ nhất là $2$ — số nguyên tố chẵn duy nhất).',
      'Lẫn lộn quy tắc chọn mũ của ƯCLN và BCNN khi phân tích thừa số nguyên tố.'
    ],
    theory: [
      '1. Số nguyên tố là số tự nhiên lớn hơn 1 chỉ chia hết cho 1 và chính nó ($2, 3, 5, 7, 11, 13\\dots$). Hợp số là số lớn hơn 1 có nhiều hơn 2 ước.',
      '2. Phân tích ra thừa số nguyên tố bằng cột dọc giúp tách mọi số thành tích các số nguyên tố duy nhất (ví dụ $60 = 2^2 \\cdot 3 \\cdot 5$).',
      '3. Ứng dụng: Chia $24$ bút và $36$ vở đều vào nhiều túi nhất $\\to \\text{ƯCLN}(24,36) = 12$ túi. Hai xe rời bến cứ 12 phút và 15 phút $\\to$ gặp lại sau $\\text{BCNN}(12,15) = 60$ phút.'
    ],
    keyFormulas: [
      '\\text{ƯCLN}(a, b) \\cdot \\text{BCNN}(a, b) = a \\cdot b',
      'a \\vdots m \\text{ và } b \\vdots m \\implies (a \\pm b) \\vdots m'
    ],
    flashcards: [
      { front: 'Tìm $\\text{ƯCLN}(18, 24)$ và $\\text{BCNN}(18, 24)$?', back: '$18 = 2\\cdot 3^2$, $24 = 2^3\\cdot 3 \\implies \\text{ƯCLN} = 6$, $\\text{BCNN} = 72$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_6,
        question: 'Lớp 6A có 24 nam và 18 nữ muốn chia đều vào các tổ sao cho số nam và nữ mỗi tổ như nhau. Chia được nhiều nhất bao nhiêu tổ?',
        options: ['A. 3 tổ', 'B. 6 tổ', 'C. 9 tổ', 'D. 12 tổ'],
        correctIndex: 1,
        explanation: 'Số tổ nhiều nhất là $\\text{ƯCLN}(24, 18) = 6$ tổ (mỗi tổ 4 nam, 3 nữ).'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_6,
        question: 'Hai bạn An và Bình cùng trực nhật ngày đầu tiên. An cứ 4 ngày trực 1 lần, Bình cứ 6 ngày trực 1 lần. Hỏi sau ít nhất bao nhiêu ngày hai bạn lại cùng trực nhật?',
        hints: ['Số ngày cần tìm là $\\text{BCNN}(4, 6)$.'],
        solutionSteps: [
          'Bước 1: Phân tích $4 = 2^2$, $6 = 2 \\cdot 3$.',
          'Bước 2: $\\text{BCNN}(4, 6) = 2^2 \\cdot 3 = 12$.'
        ],
        finalAnswer: 'Sau ít nhất 12 ngày.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-6-b3',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 6',
    lessonNumber: 3,
    stageLabel: 'Toán 6 · Chương III: Số nguyên âm & Trục số',
    sourceTag: SRC_2018_6,
    title: 'Bài 3: Số nguyên âm, Thứ tự trên trục số & Cộng – Trừ – Nhân số nguyên',
    grade: 'Lớp 6 · Số học',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 12,
    description:
      'Làm quen với số nguyên âm (nhiệt độ dưới $0^\\circ\\text{C}$, độ sâu dưới mực nước biển, số nợ), quy tắc dấu khi cộng trừ và quy tắc "cùng dấu dương, trái dấu âm" khi nhân chia.',
    mnemonics: [
      'Cộng hai số âm: Cộng độ lớn rồi đặt dấu "$-$" trước (nợ thêm nợ $\\to$ nợ nhiều hơn).',
      'Nhân / Chia: Cùng dấu ra DƯƠNG ($+ \\cdot + = +$, $- \\cdot - = +$); Trái dấu ra ÂM.',
      'Bỏ ngoặc: Trước ngoặc có dấu "$-$" thì ĐỔI DẤU mọi số hạng bên trong.'
    ],
    commonTraps: [
      'Tưởng $-10 > -3$ vì $10 > 3$ (SAI! Trên trục số nằm ngang, số bên phải lớn hơn $\\Rightarrow -3 > -10$).',
      'Quên đổi dấu số hạng sau khi phá ngoặc có dấu trừ đứng trước.'
    ],
    theory: [
      '1. Ý nghĩa đời thực: Tầng trên mặt đất là $+3$, tầng hầm 2 là $-2$; ngăn đá tủ lạnh âm $18^\\circ\\text{C}$ là $-18$.',
      '2. Cộng hai số nguyên trái dấu: Lấy phần số lớn trừ phần số nhỏ rồi đặt dấu của số có phần số lớn hơn: $-8 + 5 = -3$.',
      '3. Quy tắc dấu ngoặc & nhân chia: Bỏ ngoặc trước dấu $-$ đổi dấu toàn bộ; nhân hai số âm luôn cho kết quả dương: $(-3)\\cdot(-4) = +12$.'
    ],
    keyFormulas: [
      'a - b = a + (-b)',
      '(-a) \\cdot (-b) = a \\cdot b',
      '-(a - b + c) = -a + b - c'
    ],
    flashcards: [
      { front: 'Tính nhanh $(-15) + 8 - (-7)$?', back: '$-15 + 8 + 7 = -15 + 15 = 0$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_6,
        question: 'Nhiệt độ buổi sáng ở đỉnh núi là $-4^\\circ\\text{C}$, đến trưa tăng thêm $7^\\circ\\text{C}$. Nhiệt độ buổi trưa là:',
        options: ['A. $-11^\\circ\\text{C}$', 'B. $-3^\\circ\\text{C}$', 'C. $3^\\circ\\text{C}$', 'D. $11^\\circ\\text{C}$'],
        correctIndex: 2,
        explanation: '$-4 + 7 = +(7 - 4) = 3^\\circ\\text{C}$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_6,
        question: 'Tìm số nguyên $x$ biết: $2x - (-5) = -7$.',
        hints: ['Đổi $-(-5)$ thành $+5$ rồi chuyển vế sang bên phải đổi dấu thành $-5$.'],
        solutionSteps: [
          'Bước 1: $2x + 5 = -7$.',
          'Bước 2: $2x = -7 - 5 = -12 \\implies x = -6$.'
        ],
        finalAnswer: '$x = -6$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-6-b4',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 6',
    lessonNumber: 4,
    stageLabel: 'Toán 6 · Chương VI: Phân số & Tỉ số phần trăm',
    sourceTag: SRC_2018_6,
    title: 'Bài 4: Phân số, Quy đồng – Cộng trừ nhân chia & Hai bài toán về phân số',
    grade: 'Lớp 6 · Số học',
    category: 'Số học & Tổ hợp',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Làm chủ 4 phép tính phân số (kể cả tử/mẫu âm), hỗn số, bài toán tìm giá trị phân số của một số và bài toán ngược tìm một số khi biết giá trị phân số.',
    mnemonics: [
      'Cộng trừ phân số: Quy đồng mẫu chung dương rồi cộng trừ tử, GIỮ nguyên mẫu.',
      'Chia phân số: Nhân nghịch đảo ($\frac{a}{b} : \frac{c}{d} = \frac{a}{b} \cdot \frac{d}{c}$).',
      'Tìm $\\frac{m}{n}$ của $A \\to A \\cdot \\frac{m}{n}$; biết $\\frac{m}{n}$ của nó là $B \\to B : \\frac{m}{n}$.'
    ],
    commonTraps: [
      'Cộng thẳng tử với tử, mẫu với mẫu $\\frac{1}{2} + \\frac{1}{3} = \\frac{2}{5}$ (SAI! Đúng phải quy đồng mẫu $6$ được $\\frac{5}{6}$).'
    ],
    theory: [
      '1. Hai phân số $\\frac{a}{b} = \\frac{c}{d} \\iff a \\cdot d = b \\cdot c$. Khi quy đồng, chọn mẫu chung là $\\text{BCNN}$ các mẫu dương.',
      '2. Phép nhân & chia: Rút gọn chéo tử với mẫu trước khi nhân để tránh số to; phép chia luôn đổi thành phép nhân với phân số đảo ngược.',
      '3. Hỗn số $2\\frac{3}{4} = 2 + \\frac{3}{4} = \\frac{11}{4}$ giúp đọc độ dài, khối lượng cực nhanh.'
    ],
    keyFormulas: [
      '\\frac{a}{b} + \\frac{c}{b} = \\frac{a+c}{b}',
      '\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{ac}{bd}, \\quad \\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}'
    ],
    flashcards: [
      { front: 'Tính $\\frac{3}{4} - \\frac{1}{6}$?', back: 'Mẫu chung $12$: $\\frac{9}{12} - \\frac{2}{12} = \\frac{7}{12}$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_6,
        question: 'Giá trị của $\\frac{3}{5}$ của $45\\text{ kg}$ gạo là:',
        options: ['A. $15\\text{ kg}$', 'B. $27\\text{ kg}$', 'C. $75\\text{ kg}$', 'D. $30\\text{ kg}$'],
        correctIndex: 1,
        explanation: '$45 \\cdot \\frac{3}{5} = 27\\text{ kg}$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_6,
        question: 'Một lớp có $\\frac{2}{5}$ số học sinh thích bóng đá, tương ứng với 16 bạn. Hỏi lớp đó có tất cả bao nhiêu học sinh?',
        hints: ['Đây là bài toán ngược: lấy $16 : \\frac{2}{5}$.'],
        solutionSteps: [
          'Tổng số học sinh của lớp: $16 : \\frac{2}{5} = 16 \\cdot \\frac{5}{2} = 40$ (học sinh).'
        ],
        finalAnswer: '40 học sinh.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-6-b5',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 6',
    lessonNumber: 5,
    stageLabel: 'Toán 6 · Chương IV & V: Hình phẳng trực quan & Tính đối xứng',
    sourceTag: SRC_2018_6,
    title: 'Bài 5: Hình phẳng trực quan (Thoi, Bình hành, Thang cân, Lục giác) & Trục – Tâm đối xứng',
    grade: 'Lớp 6 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Tính chu vi – diện tích tam giác đều, lục giác đều, hình thoi, hình bình hành, hình thang cân và nhận biết trục đối xứng (cánh bướm, lá cây) – tâm đối xứng (chong chóng, biển báo).',
    mnemonics: [
      'Diện tích hình bình hành: $S = a \\cdot h$; hình thang: $S = \\frac{(a+b)\\cdot h}{2}$; hình thoi: $S = \\frac{d_1\\cdot d_2}{2}$.',
      'Trục đối xứng: gấp đôi hình theo đường thẳng đó thì hai nửa chồng khít lên nhau.'
    ],
    commonTraps: [
      'Quên chia $2$ khi tính diện tích hình thoi hoặc hình thang.'
    ],
    theory: [
      '1. Lục giác đều gồm 6 tam giác đều bằng nhau ghép quanh tâm. Hình thoi có 4 cạnh bằng nhau, 2 đường chéo vuông góc.',
      '2. Hình có trục đối xứng (chữ A, M, hình thang cân, hình thoi) và hình có tâm đối xứng (chữ N, S, hình bình hành, hình tròn) xuất hiện khắp kiến trúc và thiên nhiên.'
    ],
    keyFormulas: [
      'S_{\\text{hình thang}} = \\frac{(a+b)\\cdot h}{2}',
      'S_{\\text{hình thoi}} = \\frac{d_1 \\cdot d_2}{2}'
    ],
    flashcards: [
      { front: 'Hình thoi có hai đường chéo dài $6\\text{ cm}$ và $8\\text{ cm}$ có diện tích bao nhiêu?', back: '$S = \\frac{6 \\cdot 8}{2} = 24\\text{ cm}^2$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_6,
        question: 'Hình nào sau đây VỪA có trục đối xứng VỪA có tâm đối xứng?',
        options: ['A. Hình thang cân', 'B. Hình bình hành bất kì', 'C. Hình chữ nhật', 'D. Tam giác đều'],
        correctIndex: 2,
        explanation: 'Hình chữ nhật có 2 trục đối xứng đi qua trung điểm hai cặp cạnh đối và có tâm đối xứng là giao điểm 2 đường chéo.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_6,
        question: 'Một mảnh vườn hình thang cân có đáy lớn $12\\text{ m}$, đáy nhỏ $8\\text{ m}$ và chiều cao $5\\text{ m}$. Tính diện tích mảnh vườn.',
        hints: ['Áp dụng $S = \\frac{(a+b)\\cdot h}{2}$.'],
        solutionSteps: [
          '$S = \\frac{(12 + 8) \\cdot 5}{2} = \\frac{20 \\cdot 5}{2} = 50\\text{ m}^2$.'
        ],
        finalAnswer: '$50\\text{ m}^2$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'triangle_explorer',
    sim3dMode: 'geometric_transform_3d'
  },
  {
    id: 'math-6-b6',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 6',
    lessonNumber: 6,
    stageLabel: 'Toán 6 · Chương VII: Số thập phân & Tỉ số phần trăm',
    sourceTag: SRC_2018_6,
    title: 'Bài 6: Số thập phân âm–dương, Làm tròn ước lượng & Tỉ số phần trăm thực tế',
    grade: 'Lớp 6 · Số học',
    category: 'Số học & Tổ hợp',
    difficulty: 'Cơ bản',
    readTimeMinutes: 13,
    description:
      'Thực hiện thành thạo 4 phép tính với số thập phân, quy tắc làm tròn đến hàng phần mười/phần trăm và bài toán giảm giá – lãi suất tiết kiệm trong cuộc sống.',
    mnemonics: [
      'Làm tròn số: Chữ số ngay sau hàng làm tròn $\\ge 5$ thì TĂNG thêm $1$; nhỏ hơn $5$ thì GIỮ NGUYÊN.',
      'Giảm giá $p\\% \\implies$ số tiền còn phải trả là $(100 - p)\\%$ giá ban đầu.'
    ],
    commonTraps: [
      'Đặt lệch dấu phẩy khi nhân/chia số thập phân hoặc quên đổi $25\\% = 0{,}25$.'
    ],
    theory: [
      '1. Số thập phân gồm phần nguyên (trước dấu phẩy) và phần thập phân (sau dấu phẩy). Cộng trừ thì đặt thẳng cột dấu phẩy; nhân thì đếm tổng chữ số sau dấu phẩy.',
      '2. Tỉ số phần trăm của $a$ và $b$: $\\frac{a}{b} \\cdot 100\\%$. Ví dụ: Áo $200\\,000$ đ giảm $25\\%$ thì giá mới $= 200\\,000 \\cdot 0{,}75 = 150\\,000$ đ.'
    ],
    keyFormulas: [
      '\\text{Tỉ số \\% của } a \\text{ và } b = \\frac{a}{b} \\cdot 100\\%',
      '\\text{Giá sau giảm } p\\% = \\text{Giá gốc} \\cdot (1 - \\frac{p}{100})'
    ],
    flashcards: [
      { front: 'Làm tròn số $3{,}1468$ đến hàng phần trăm?', back: 'Chữ số hàng phần nghìn là $6 \\ge 5 \\implies 3{,}15$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_6,
        question: 'Một quyển sách giá 80 000 đồng được giảm giá 25%. Số tiền phải trả sau khi giảm là:',
        options: ['A. 20 000 đồng', 'B. 55 000 đồng', 'C. 60 000 đồng', 'D. 65 000 đồng'],
        correctIndex: 2,
        explanation: '$80\\,000 \\cdot (100\\% - 25\\%) = 80\\,000 \\cdot 0{,}75 = 60\\,000$ đồng.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_6,
        question: 'Mẹ gửi $50\\,000\\,000$ đồng vào ngân hàng với lãi suất $6\\%$/năm. Hỏi sau 1 năm mẹ nhận được cả gốc lẫn lãi bao nhiêu tiền?',
        hints: ['Tiền lãi $= 50\\,000\\,000 \\cdot 6\\%$.'],
        solutionSteps: [
          'Tiền lãi sau 1 năm: $50\\,000\\,000 \\cdot 0{,}06 = 3\\,000\\,000$ đồng.',
          'Tổng gốc và lãi: $50\\,000\\,000 + 3\\,000\\,000 = 53\\,000\\,000$ đồng.'
        ],
        finalAnswer: '$53\\,000\\,000$ đồng.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-6-b7',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 6',
    lessonNumber: 7,
    stageLabel: 'Toán 6 · Chương IX: Dữ liệu, Biểu đồ cột & Xác suất thực nghiệm',
    sourceTag: SRC_2018_6,
    title: 'Bài 7: Thu thập dữ liệu, Biểu đồ tranh – Biểu đồ cột kép & Xác suất thực nghiệm',
    grade: 'Lớp 6 · Xác suất & Thống kê',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 12,
    description:
      'Cách đọc bảng kiểm đếm, vẽ và so sánh số liệu trên biểu đồ cột – cột kép, đồng thời tính xác suất thực nghiệm qua thí nghiệm tung đồng xu và gieo xúc xắc.',
    mnemonics: [
      'Xác suất thực nghiệm xuất hiện sự kiện $A$: $P(A) = \\frac{\\text{Số lần xảy ra } A}{\\text{Tổng số lần thử}}$.'
    ],
    commonTraps: [
      'Lộn tử và mẫu khiến xác suất lớn hơn $1$ (xác suất luôn nằm từ $0$ đến $1$!).'
    ],
    theory: [
      '1. Dữ liệu thống kê gồm dữ liệu số (chiều cao, điểm kiểm tra) và dữ liệu không phải là số (tên môn học, quê quán).',
      '2. Biểu đồ cột kép đặt 2 cột cạnh nhau để dễ dàng so sánh 2 nhóm (như số học sinh nam và nữ từng tổ).',
      '3. Khi tung đồng xu nhiều lần, tỉ số $\\frac{\\text{Số lần sấp}}{\\text{Tổng số lần tung}}$ chính là xác suất thực nghiệm.'
    ],
    keyFormulas: [
      'P_{\\text{thực nghiệm}}(A) = \\frac{n(A)}{N}, \\quad 0 \\le P \\le 1'
    ],
    flashcards: [
      { front: 'Tung đồng xu 50 lần thấy 28 lần mặt Ngửa. Xác suất thực nghiệm ra mặt Sấp là bao nhiêu?', back: 'Số lần Sấp $= 50 - 28 = 22 \\implies P = \\frac{22}{50} = 0{,}44$ ($44\\%$).' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_6,
        question: 'Gieo một con xúc xắc cân đối 40 lần, thấy mặt 6 chấm xuất hiện 10 lần. Xác suất thực nghiệm xuất hiện mặt 6 chấm là:',
        options: ['A. $0{,}15$', 'B. $0{,}25$', 'C. $0{,}4$', 'D. $4$'],
        correctIndex: 1,
        explanation: '$P = \\frac{10}{40} = 0{,}25$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_6,
        question: 'Trong hộp có 1 bóng xanh và 1 bóng đỏ. An lấy ngẫu nhiên 1 bóng rồi bỏ lại vào hộp, lặp lại 30 lần thì thấy 18 lần lấy được bóng xanh. Tính xác suất thực nghiệm lấy được bóng đỏ.',
        hints: ['Số lần lấy được bóng đỏ $= 30 - 18$.'],
        solutionSteps: [
          'Số lần lấy được bóng đỏ: $30 - 18 = 12$ lần.',
          'Xác suất thực nghiệm: $P = \\frac{12}{30} = 0{,}4$.'
        ],
        finalAnswer: '$0{,}4$ (hay $40\\%$).'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d'
  },
  {
    id: 'math-6-b8',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 6',
    lessonNumber: 8,
    stageLabel: 'Toán 6 · Chương VIII: Điểm – Đường thẳng – Đoạn thẳng – Góc',
    sourceTag: SRC_2018_6,
    title: 'Bài 8: Điểm, Đường thẳng, Tia, Trung điểm đoạn thẳng & Số đo góc',
    grade: 'Lớp 6 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 13,
    description:
      'Phân biệt đường thẳng (vô tận 2 phía), tia (gốc cố định, kéo dài 1 phía), đoạn thẳng, công thức trung điểm $MA = MB = AB/2$ và phân loại góc nhọn – vuông – tù – bẹt.',
    mnemonics: [
      'Trung điểm $M$ của $AB$: $M$ nằm giữa $A, B$ và $MA = MB = \\frac{AB}{2}$.',
      'Góc nhọn ($< 90^\\circ$) < Góc vuông ($= 90^\\circ$) < Góc tù ($90^\\circ < \\alpha < 180^\\circ$) < Góc bẹt ($= 180^\\circ$).'
    ],
    commonTraps: [
      'Thấy $MA = MB$ vội kết luận $M$ là trung điểm (cần thêm $M$ nằm trên đoạn $AB$).'
    ],
    theory: [
      '1. Qua 2 điểm phân biệt chỉ vẽ được duy nhất 1 đường thẳng. Ba điểm thẳng hàng khi cùng nằm trên một đường thẳng.',
      '2. Nếu $M$ nằm giữa $A$ và $B$ thì $AM + MB = AB$. Nếu thêm $AM = MB$ thì $M$ là trung điểm đoạn $AB$.',
      '3. Góc được tạo bởi 2 tia chung gốc, đo bằng thước đo góc đơn vị độ ($^\\circ$).'
    ],
    keyFormulas: [
      'AM + MB = AB \\text{ và } AM = MB = \\frac{AB}{2}'
    ],
    flashcards: [
      { front: 'Đoạn $AB = 14\\text{ cm}$, $M$ là trung điểm $AB$. Tính $MA$?', back: '$MA = 14 : 2 = 7\\text{ cm}$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_6,
        question: 'Góc có số đo $135^\\circ$ thuộc loại góc nào sau đây?',
        options: ['A. Góc nhọn', 'B. Góc vuông', 'C. Góc tù', 'D. Góc bẹt'],
        correctIndex: 2,
        explanation: 'Vì $90^\\circ < 135^\\circ < 180^\\circ$ nên đây là góc tù.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_6,
        question: 'Trên tia $Ox$ lấy $A$ sao cho $OA = 4\\text{ cm}$ và $B$ sao cho $OB = 10\\text{ cm}$. Gọi $M$ là trung điểm của $AB$. Tính độ dài $OM$.',
        hints: ['Tính $AB = OB - OA$ trước, sau đó tính $AM = AB / 2$.'],
        solutionSteps: [
          'Vì $OA < OB$ ($4 < 10$) nên $A$ nằm giữa $O$ và $B \\implies AB = 10 - 4 = 6\\text{ cm}$.',
          '$M$ là trung điểm $AB \\implies AM = 6 : 2 = 3\\text{ cm} \\implies OM = 4 + 3 = 7\\text{ cm}$.'
        ],
        finalAnswer: '$OM = 7\\text{ cm}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'triangle_explorer',
    sim3dMode: 'line_plane_oxyz'
  },

  // ==========================================================================
  // LỚP 7 — GDPT 2018 (7 CHƯƠNG/CHỦ ĐỀ TRỌNG TÂM)
  // ==========================================================================
  {
    id: 'math-7-b1',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 7',
    lessonNumber: 1,
    stageLabel: 'Toán 7 · Chương I & II: Số hữu tỉ & Số thực',
    sourceTag: SRC_2018_7,
    title: 'Bài 1: Số hữu tỉ $\\mathbb{Q}$, Lũy thừa của lũy thừa, Căn bậc hai & Số thực $\\mathbb{R}$',
    grade: 'Lớp 7 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 13,
    description:
      'Mở rộng từ phân số lên tập số hữu tỉ $\\mathbb{Q}$, hiểu căn bậc hai số học $\\sqrt{a}$, số vô tỉ không tuần hoàn ($\\sqrt{2}, \\pi$) và giá trị tuyệt đối $|x|$.',
    mnemonics: [
      'Lũy thừa của lũy thừa: $(x^m)^n = x^{m \\cdot n}$ (NHÂN hai số mũ!).',
      'Căn bậc hai số học $\\sqrt{a}$ ($a \\ge 0$) luôn KHÔNG ÂM: $\\sqrt{9} = 3$.'
    ],
    commonTraps: [
      'Viết $\\sqrt{16} = \\pm 4$ (SAI! Đúng là $\\sqrt{16} = 4$; chỉ khi giải $x^2 = 16$ mới có $x = \\pm 4$).',
      'Nhầm $(2^3)^2 = 2^5$ (Đúng phải là $2^6 = 64$).'
    ],
    theory: [
      '1. Số hữu tỉ $\\mathbb{Q}$ là mọi số viết được thành phân số $\\frac{a}{b}$ ($b \\neq 0$), gồm số thập phân hữu hạn và vô hạn tuần hoàn.',
      '2. Số vô tỉ $\\mathbb{I}$ là số thập phân vô hạn KHÔNG tuần hoàn ($\sqrt{2}, \\pi$). Hợp $\\mathbb{Q}$ và $\\mathbb{I}$ thành tập Số thực $\\mathbb{R}$.',
      '3. Giá trị tuyệt đối $|x|$ là khoảng cách từ điểm $x$ đến gốc $0$ trên trục số nên $|x| \\ge 0$.'
    ],
    keyFormulas: [
      '(x^m)^n = x^{m \\cdot n}, \\quad (x \\cdot y)^n = x^n \\cdot y^n',
      '\\sqrt{a^2} = |a| \\ge 0',
      '\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}'
    ],
    flashcards: [
      { front: 'Rút gọn $\\frac{4^3 \\cdot 2^5}{8^2}$?', back: 'Đổi về cơ số 2: $\\frac{2^6 \\cdot 2^5}{2^6} = 2^5 = 32$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_7,
        question: 'Giá trị của biểu thức $\\sqrt{25} - |-7| + (-2)^3$ bằng:',
        options: ['A. $-10$', 'B. $4$', 'C. $-6$', 'D. $10$'],
        correctIndex: 0,
        explanation: '$5 - 7 - 8 = -10$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_7,
        question: 'Tìm $x$ biết: $|x - 1{,}5| = 2{,}5$.',
        hints: ['Chia 2 trường hợp $x - 1{,}5 = 2{,}5$ và $x - 1{,}5 = -2{,}5$.'],
        solutionSteps: [
          'TH1: $x - 1{,}5 = 2{,}5 \\implies x = 4$.',
          'TH2: $x - 1{,}5 = -2{,}5 \\implies x = -1$.'
        ],
        finalAnswer: '$x \\in \\{4; -1\\}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-7-b2',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 7',
    lessonNumber: 2,
    stageLabel: 'Toán 7 · Chương VI: Tỉ lệ thức & Đại lượng tỉ lệ',
    sourceTag: SRC_2018_7,
    title: 'Bài 2: Tỉ lệ thức, Dãy tỉ số bằng nhau & Tỉ lệ thuận – Tỉ lệ nghịch',
    grade: 'Lớp 7 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Hiểu đẳng thức giữa hai tỉ số $\\frac{a}{b} = \\frac{c}{d}$, tính chất dãy tỉ số bằng nhau để chia phần thưởng/số học sinh và phân biệt tỉ lệ thuận vs tỉ lệ nghịch.',
    mnemonics: [
      'Tỉ lệ thuận ($y = kx$): TỈ SỐ $\\frac{y}{x} = k$ không đổi.',
      'Tỉ lệ nghịch ($y = \\frac{a}{x}$): TÍCH $x \\cdot y = a$ không đổi.'
    ],
    commonTraps: [
      'Cộng/trừ tử và mẫu không cùng dấu tương ứng trong dãy tỉ số bằng nhau.'
    ],
    theory: [
      '1. Tỉ lệ thức $\\frac{a}{b} = \\frac{c}{d} \\iff a \\cdot d = b \\cdot c$.',
      '2. Tính chất dãy tỉ số bằng nhau: $\\frac{x}{a} = \\frac{y}{b} = \\frac{z}{c} = \\frac{x+y+z}{a+b+c} = \\frac{x-y}{a-b}$.',
      '3. Nhận dạng thực tế: Số công nhân và số ngày làm cùng một công việc luôn TỈ LỆ NGHỊCH ($n_1 t_1 = n_2 t_2$).'
    ],
    keyFormulas: [
      '\\frac{a}{b} = \\frac{c}{d} \\iff ad = bc',
      '\\frac{x}{a} = \\frac{y}{b} = \\frac{x+y}{a+b} = \\frac{x-y}{a-b}'
    ],
    flashcards: [
      { front: 'Cho $\\frac{x}{3} = \\frac{y}{5}$ và $x + y = 24$. Tìm $x, y$?', back: '$\\frac{x+y}{3+5} = \\frac{24}{8} = 3 \\implies x = 9, y = 15$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_7,
        question: 'Biết 4 công nhân xây xong một bức tường trong 6 ngày. Hỏi 8 công nhân xây xong bức tường đó trong mấy ngày?',
        options: ['A. 12 ngày', 'B. 3 ngày', 'C. 4 ngày', 'D. 2 ngày'],
        correctIndex: 1,
        explanation: 'Tỉ lệ nghịch: $4 \\cdot 6 = 8 \\cdot t \\implies t = 3$ ngày.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_7,
        question: 'Số học sinh giỏi của ba lớp 7A, 7B, 7C tỉ lệ với $3; 4; 5$. Biết lớp 7C nhiều hơn 7A là 8 bạn. Tính số học sinh giỏi mỗi lớp.',
        hints: ['Dùng $\\frac{a}{3} = \\frac{b}{4} = \\frac{c}{5} = \\frac{c - a}{5 - 3}$.'],
        solutionSteps: [
          '$\\frac{c - a}{5 - 3} = \\frac{8}{2} = 4$.',
          'Suy ra $a = 12, b = 16, c = 20$.'
        ],
        finalAnswer: '7A: 12; 7B: 16; 7C: 20 bạn.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-7-b3',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 7',
    lessonNumber: 3,
    stageLabel: 'Toán 7 · Chương VII: Biểu thức đại số & Đa thức một biến',
    sourceTag: SRC_2018_7,
    title: 'Bài 3: Biểu thức đại số, Cộng – Trừ – Nhân – Chia Đa thức một biến & Nghiệm',
    grade: 'Lớp 7 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Làm quen biến chữ $x$, bậc – hệ số cao nhất – hệ số tự do của đa thức $P(x)$, cộng trừ nhân chia đa thức một biến và cách thử/tìm nghiệm $P(a) = 0$.',
    mnemonics: [
      'Cộng trừ đa thức: Sắp xếp theo lũy thừa giảm dần của $x$, chỉ cộng/trừ các hạng tử CÙNG BẬC.',
      '$x = a$ là nghiệm của $P(x)$ khi $P(a) = 0$.'
    ],
    commonTraps: [
      'Quên đổi dấu toàn bộ đa thức sau dấu trừ khi tính $P(x) - Q(x)$.'
    ],
    theory: [
      '1. Đa thức một biến là tổng các đơn thức cùng biến $x$, ví dụ $P(x) = 3x^2 - 5x + 2$ có bậc $2$, hệ số cao nhất $3$, hệ số tự do $2$.',
      '2. Phép cộng, trừ, nhân & chia đa thức: Khi nhân $A\\cdot(B+C) = AB+AC$; chia đa thức một biến đặt chia dọc giống chia số tự nhiên.'
    ],
    keyFormulas: [
      'P(x) = a_n x^n + \\dots + a_1 x + a_0 \\quad (a_n \\neq 0)',
      'a \\text{ là nghiệm của } P(x) \\iff P(a) = 0'
    ],
    flashcards: [
      { front: 'Đa thức $P(x) = 5x^3 - 2x + 7 - 5x^3$ có bậc mấy?', back: 'Thu gọn còn $-2x + 7 \\implies$ Bậc 1!' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_7,
        question: 'Giá trị $x$ nào là nghiệm của đa thức $P(x) = 2x^2 - 5x + 2$?',
        options: ['A. $x = 1$', 'B. $x = 2$', 'C. $x = -1$', 'D. $x = 0$'],
        correctIndex: 1,
        explanation: '$P(2) = 2\\cdot 4 - 5\\cdot 2 + 2 = 0$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_7,
        question: 'Cho $A(x) = 3x^2 - 2x + 5$ và $B(x) = x^2 + 4x - 1$. Tính $A(x) + B(x)$ và $A(x) - B(x)$.',
        hints: ['Nhóm cùng bậc với nhau, đổi dấu $B(x)$ khi trừ.'],
        solutionSteps: [
          '$A(x) + B(x) = 4x^2 + 2x + 4$.',
          '$A(x) - B(x) = 2x^2 - 6x + 6$.'
        ],
        finalAnswer: '$4x^2 + 2x + 4$ và $2x^2 - 6x + 6$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: 2, b: -5, c: 2, d: 0 }, color: '#2563eb', name: 'P(x) = 2x² - 5x + 2' }
  },
  {
    id: 'math-7-b4',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 7',
    lessonNumber: 4,
    stageLabel: 'Toán 7 · Chương III & IV: Đường thẳng song song & Tam giác bằng nhau',
    sourceTag: SRC_2018_7,
    title: 'Bài 4: Góc so le trong – đồng vị, Tiên đề Euclid & Hai tam giác bằng nhau – Tam giác cân',
    grade: 'Lớp 7 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Nhận diện cặp góc so le trong (chữ Z), đồng vị (chữ F), tiên đề Euclid và chứng minh hai tam giác bằng nhau theo 3 trường hợp (c.c.c, c.g.c, g.c.g) + tam giác cân.',
    mnemonics: [
      'Song song: Chữ Z = SO LE TRONG; Chữ F = ĐỒNG VỊ; Chữ U = TRONG CÙNG PHÍA (bù $180^\\circ$).',
      'Ba trường hợp: c.c.c, c.g.c (góc XEN GIỮA), g.c.g (cạnh XEN GIỮA).'
    ],
    commonTraps: [
      'Dùng "cạnh–cạnh–góc" khi góc không nằm giữa 2 cạnh.'
    ],
    theory: [
      '1. Tổng ba góc trong tam giác bằng $180^\\circ$. Góc ngoài bằng tổng hai góc trong không kề.',
      '2. Tam giác cân tại $A$ có hai cạnh bên $AB = AC$ và hai góc ở đáy $\\widehat{B} = \\widehat{C}$.'
    ],
    keyFormulas: [
      '\\widehat{A} + \\widehat{B} + \\widehat{C} = 180^\\circ',
      '\\triangle ABC \\text{ cân tại } A \\iff AB = AC \\iff \\widehat{B} = \\widehat{C}'
    ],
    flashcards: [
      { front: 'Tam giác cân tại $A$ có $\\widehat{A} = 50^\\circ$. Góc $\\widehat{B}$ bằng bao nhiêu?', back: '$\\widehat{B} = (180^\\circ - 50^\\circ)/2 = 65^\\circ$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_7,
        question: 'Tam giác $ABC$ có $\\widehat{A} = 70^\\circ$, $\\widehat{B} = 45^\\circ$. Số đo góc $\\widehat{C}$ là:',
        options: ['A. $55^\\circ$', 'B. $65^\\circ$', 'C. $75^\\circ$', 'D. $115^\\circ$'],
        correctIndex: 1,
        explanation: '$\\widehat{C} = 180^\\circ - 115^\\circ = 65^\\circ$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_7,
        question: 'Cho $\\triangle ABC$ cân tại $A$, $M$ là trung điểm $BC$. Chứng minh $\\triangle ABM = \\triangle ACM$ và $AM \\perp BC$.',
        hints: ['Xét 3 cạnh bằng nhau (c.c.c) rồi suy ra hai góc ở $M$ kề bù bằng nhau.'],
        solutionSteps: [
          'Xét $\\triangle ABM$ và $\\triangle ACM$ có $AB = AC$, $BM = CM$, $AM$ chung $\\implies \\triangle ABM = \\triangle ACM$ (c.c.c).',
          'Suy ra $\\widehat{AMB} = \\widehat{AMC} = 180^\\circ/2 = 90^\\circ \\implies AM \\perp BC$.'
        ],
        finalAnswer: 'ĐPCM.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'triangle_explorer',
    sim3dMode: 'geometric_transform_3d'
  },
  {
    id: 'math-7-b5',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 7',
    lessonNumber: 5,
    stageLabel: 'Toán 7 · Chương IX: Quan hệ góc–cạnh & 4 Đường đồng quy trong tam giác',
    sourceTag: SRC_2018_7,
    title: 'Bài 5: Bất đẳng thức tam giác, Quan hệ góc–cạnh & 4 Đường đồng quy (Trung tuyến, Phân giác, Trung trực, Cao)',
    grade: 'Lớp 7 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Kiểm tra bộ ba cạnh tam giác ($a+b > c$), nhận biết góc lớn nhất đối diện cạnh lớn nhất và phân biệt 4 điểm đồng quy: Trọng tâm, Tâm nội tiếp, Tâm ngoại tiếp, Trực tâm.',
    mnemonics: [
      'Trọng tâm $G$ (3 trung tuyến): $AG = \\frac{2}{3}AM$.',
      'Tâm nội tiếp (3 phân giác): cách đều 3 CẠNH. Tâm ngoại tiếp (3 trung trực): cách đều 3 ĐỈNH.'
    ],
    commonTraps: [
      'Nhầm $AG = \\frac{1}{2}AM$ thay vì $\\frac{2}{3}AM$.'
    ],
    theory: [
      '1. Trong một tam giác, góc đối diện cạnh lớn hơn là góc lớn hơn. Tổng hai cạnh bất kì luôn lớn hơn cạnh thứ ba.',
      '2. Ba đường trung tuyến cắt nhau tại Trọng tâm; ba đường phân giác tại tâm đường tròn nội tiếp; ba trung trực tại tâm ngoại tiếp; ba đường cao tại Trực tâm.'
    ],
    keyFormulas: [
      '|a - b| < c < a + b',
      'AG = \\frac{2}{3}AM, \\quad GM = \\frac{1}{3}AM'
    ],
    flashcards: [
      { front: 'Trung tuyến $AM = 9\\text{ cm}$, $G$ là trọng tâm. Tính $AG$?', back: '$AG = \\frac{2}{3}\\cdot 9 = 6\\text{ cm}$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_7,
        question: 'Bộ ba độ dài nào có thể tạo thành ba cạnh của một tam giác?',
        options: ['A. $2, 3, 6$', 'B. $3, 4, 7$', 'C. $4, 5, 7$', 'D. $1, 2, 4$'],
        correctIndex: 2,
        explanation: '$4 + 5 = 9 > 7$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_7,
        question: 'Cho $\\triangle ABC$ có $AB = 5\\text{ cm}, BC = 8\\text{ cm}, AC = 6\\text{ cm}$. So sánh các góc của $\\triangle ABC$.',
        hints: ['Xếp thứ tự độ dài 3 cạnh trước rồi suy ra góc đối diện.'],
        solutionSteps: [
          'Vì $AB < AC < BC$ ($5 < 6 < 8$) nên các góc đối diện tương ứng là $\\widehat{C} < \\widehat{B} < \\widehat{A}$.'
        ],
        finalAnswer: '$\\widehat{C} < \\widehat{B} < \\widehat{A}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'triangle_explorer',
    sim3dMode: 'geometric_transform_3d'
  },
  {
    id: 'math-7-b6',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 7',
    lessonNumber: 6,
    stageLabel: 'Toán 7 · Chương X: Hình hộp chữ nhật, Lập phương & Lăng trụ đứng',
    sourceTag: SRC_2018_7,
    title: 'Bài 6: Hình hộp chữ nhật, Hình lập phương & Lăng trụ đứng tam giác – tứ giác',
    grade: 'Lớp 7 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 13,
    description:
      'Gấp mở lưới khai triển 2D ↔ 3D hình hộp chữ nhật, hình lập phương và hình lăng trụ đứng; tính diện tích xung quanh $S_{xq} = C_{\\text{đáy}}\\cdot h$ và thể tích $V = S_{\\text{đáy}}\\cdot h$.',
    mnemonics: [
      'Mọi khối hộp / lăng trụ đứng: $S_{xq} = C_{\\text{đáy}} \\cdot h$ và $V = S_{\\text{đáy}} \\cdot h$.'
    ],
    commonTraps: [
      'Quên đổi đơn vị $1\\text{ lít} = 1\\text{ dm}^3 = 1000\\text{ cm}^3$ khi tính dung tích bể nước.'
    ],
    theory: [
      '1. Hình hộp chữ nhật có 6 mặt chữ nhật, 8 đỉnh, 12 cạnh. Hình lập phương có 6 mặt là hình vuông bằng nhau cạnh $a$: $S_{tp} = 6a^2, V = a^3$.',
      '2. Lăng trụ đứng tam giác/tứ giác có các mặt bên là hình chữ nhật vuông góc với hai mặt đáy song song bằng nhau.'
    ],
    keyFormulas: [
      'S_{xq} = C_{\\text{đáy}} \\cdot h, \\quad V = S_{\\text{đáy}} \\cdot h',
      'V_{\\text{lập phương}} = a^3, \\quad S_{tp} = 6a^2'
    ],
    flashcards: [
      { front: 'Hình lập phương cạnh $4\\text{ cm}$ có thể tích bao nhiêu?', back: '$V = 4^3 = 64\\text{ cm}^3$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_7,
        question: 'Hình lăng trụ đứng tam giác có đáy là tam giác vuông cạnh góc vuông $3\\text{ cm}, 4\\text{ cm}$ và chiều cao $10\\text{ cm}$. Thể tích khối lăng trụ là:',
        options: ['A. $120\\text{ cm}^3$', 'B. $60\\text{ cm}^3$', 'C. $30\\text{ cm}^3$', 'D. $40\\text{ cm}^3$'],
        correctIndex: 1,
        explanation: '$S_{\\text{đáy}} = \\frac{1}{2}\\cdot 3\\cdot 4 = 6\\text{ cm}^2 \\implies V = 6\\cdot 10 = 60\\text{ cm}^3$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_7,
        question: 'Một bể cá hình hộp chữ nhật có đáy $80\\text{ cm} \\times 40\\text{ cm}$, mực nước cao $35\\text{ cm}$. Tính thể tích nước theo đơn vị lít.',
        hints: ['Tính $V = a \\cdot b \\cdot h$ ra $\\text{cm}^3$, rồi chia cho $1000$.'],
        solutionSteps: [
          '$V = 80 \\cdot 40 \\cdot 35 = 112\\,000\\text{ cm}^3 = 112$ lít.'
        ],
        finalAnswer: '112 lít.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'spatial_pyramid',
    sim3dMode: 'solid_prism_nets_3d'
  },
  {
    id: 'math-7-b7',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 7',
    lessonNumber: 7,
    stageLabel: 'Toán 7 · Chương V & VIII: Biểu đồ quạt tròn – Đoạn thẳng & Xác suất ngẫu nhiên',
    sourceTag: SRC_2018_7,
    title: 'Bài 7: Biểu đồ hình quạt tròn – Biểu đồ đoạn thẳng & Làm quen Biến cố ngẫu nhiên',
    grade: 'Lớp 7 · Xác suất & Thống kê',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 12,
    description:
      'Đọc tỉ lệ phần trăm trên biểu đồ hình quạt tròn ($360^\\circ$), xu hướng tăng giảm trên biểu đồ đoạn thẳng và tính xác suất biến cố đồng khả năng.',
    mnemonics: [
      'Tổng các phần trăm trong biểu đồ hình quạt tròn luôn bằng $100\\%$ (ứng với $360^\\circ \\implies 1\\% = 3{,}6^\\circ$).',
      'Biến cố chắc chắn có $P = 1$; biến cố không thể có $P = 0$.'
    ],
    commonTraps: [
      'Quên đổi tỉ lệ phần trăm sang số đo góc khi kiểm tra trên hình quạt tròn.'
    ],
    theory: [
      '1. Biểu đồ đoạn thẳng theo dõi sự thay đổi của đại lượng theo thời gian (nhiệt độ trong ngày, doanh số từng tháng).',
      '2. Khi các kết quả có khả năng xảy ra như nhau (đồng khả năng), xác suất của biến cố $A$ là $P(A) = \\frac{\\text{Số kết quả thuận lợi cho } A}{\\text{Tổng số kết quả có thể}}$.'
    ],
    keyFormulas: [
      '\\alpha_{\\text{quạt}} = p\\% \\cdot 3{,}6^\\circ',
      'P(A) = \\frac{n(A)}{n(\\Omega)}'
    ],
    flashcards: [
      { front: 'Chọn ngẫu nhiên 1 số từ tập $\\{1; 2; 3; 4; 5\\}$. Xác suất chọn được số chẵn là:', back: 'Có 2 số chẵn $\\{2; 4\\}$ trên 5 số $\\implies P = \\frac{2}{5} = 0{,}4$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_7,
        question: 'Gieo ngẫu nhiên một con xúc xắc 6 mặt cân đối. Xác suất để mặt xuất hiện có số chấm chia hết cho 3 là:',
        options: ['A. $\\frac{1}{6}$', 'B. $\\frac{1}{3}$', 'C. $\\frac{1}{2}$', 'D. $\\frac{2}{3}$'],
        correctIndex: 1,
        explanation: 'Các mặt chia hết cho 3 là $\\{3; 6\\}$ (2 kết quả trên 6) $\\implies P = \\frac{2}{6} = \\frac{1}{3}$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_7,
        question: 'Một biểu đồ hình quạt tròn biểu diễn kết quả học lực của 200 học sinh: Tốt chiếm $35\\%$, Khá chiếm $45\\%$, còn lại là Đạt. Tính số học sinh xếp loại Đạt.',
        hints: ['Tìm phần trăm loại Đạt $= 100\\% - (35\\% + 45\\%)$.'],
        solutionSteps: [
          'Tỉ lệ học sinh Đạt: $100\\% - 80\\% = 20\\%$.',
          'Số học sinh Đạt: $200 \\cdot 20\\% = 40$ học sinh.'
        ],
        finalAnswer: '40 học sinh.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d'
  },

  // ==========================================================================
  // LỚP 8 — GDPT 2018 (7 CHƯƠNG/CHỦ ĐỀ TRỌNG TÂM)
  // ==========================================================================
  {
    id: 'math-8-b1',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 8',
    lessonNumber: 1,
    stageLabel: 'Toán 8 · Chương I & II: Đa thức nhiều biến & 7 Hằng đẳng thức',
    sourceTag: SRC_2018_8,
    title: 'Bài 1: Đa thức nhiều biến, 7 Hằng đẳng thức đáng nhớ & Phân tích đa thức thành nhân tử',
    grade: 'Lớp 8 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Hiểu ý nghĩa hình học của 7 hằng đẳng thức đáng nhớ và chiến thuật 3 bước phân tích đa thức thành nhân tử để giải nhanh phương trình tích.',
    mnemonics: [
      'Phân tích đa thức thành nhân tử: (1) Đặt nhân tử chung $\\to$ (2) Hằng đẳng thức $\\to$ (3) Nhóm hạng tử.',
      'Nhớ lập phương: $(A + B)^3 = A^3 + 3A^2B + 3AB^2 + B^3$ (hệ số 1 - 3 - 3 - 1).'
    ],
    commonTraps: [
      'Quên $2AB$ trong $(A+B)^2$: viết $(x+3)^2 = x^2 + 9$ (SAI! Đúng phải là $x^2 + 6x + 9$).'
    ],
    theory: [
      '1. Bình phương một tổng $(a+b)^2 = a^2 + 2ab + b^2$ chính là diện tích hình vuông cạnh $(a+b)$ gồm hai vuông $a^2, b^2$ và hai chữ nhật $ab$.',
      '2. Hiệu hai bình phương $A^2 - B^2 = (A-B)(A+B)$ giúp tính nhẩm: $101 \\cdot 99 = 100^2 - 1^2 = 9999$.',
      '3. Phân tích đa thức thành nhân tử biến tổng hiệu thành tích để giải $A\\cdot B = 0$.'
    ],
    keyFormulas: [
      '(A \\pm B)^2 = A^2 \\pm 2AB + B^2',
      'A^2 - B^2 = (A - B)(A + B)',
      'A^3 \\pm B^3 = (A \\pm B)(A^2 \\mp AB + B^2)'
    ],
    flashcards: [
      { front: 'Phân tích $x^2 - 9$ và $x^2 - 6x + 9$ thành nhân tử?', back: '$(x-3)(x+3)$ và $(x-3)^2$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_8,
        question: 'Khai triển $(2x - 3)^2$ ta được kết quả đúng là:',
        options: ['A. $4x^2 - 9$', 'B. $4x^2 - 6x + 9$', 'C. $4x^2 - 12x + 9$', 'D. $2x^2 - 12x + 9$'],
        correctIndex: 2,
        explanation: '$(2x)^2 - 2\\cdot(2x)\\cdot 3 + 3^2 = 4x^2 - 12x + 9$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_8,
        question: 'Giải phương trình: $x^2 - 4x - 5 = 0$ bằng cách phân tích thành nhân tử.',
        hints: ['Tách thành $(x^2 - 4x + 4) - 9 = (x - 2)^2 - 3^2$.'],
        solutionSteps: [
          '$(x - 2)^2 - 3^2 = 0 \\iff (x - 5)(x + 1) = 0$.'
        ],
        finalAnswer: '$x = 5$ hoặc $x = -1$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: { type: 'quadratic', params: { a: 1, b: -4, c: -5, d: 0 }, color: '#4f46e5', name: 'y = x² - 4x - 5' }
  },
  {
    id: 'math-8-b2',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 8',
    lessonNumber: 2,
    stageLabel: 'Toán 8 · Chương VI: Phân thức đại số',
    sourceTag: SRC_2018_8,
    title: 'Bài 2: Phân thức đại số, Điều kiện xác định, Rút gọn & Cộng – Trừ – Nhân – Chia phân thức',
    grade: 'Lớp 8 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 15,
    description:
      'Tìm điều kiện xác định của phân thức $\\frac{A}{B}$ ($B \\neq 0$), quy đồng mẫu thức nhiều đa thức và rút gọn biểu thức hữu tỉ không sai dấu.',
    mnemonics: [
      'Điều kiện xác định phân thức $\\frac{A}{B}$: cho toàn bộ mẫu $B \\neq 0$.',
      'Trước khi rút gọn hay quy đồng: PHÂN TÍCH MẪU THÀNH NHÂN TỬ trước!'
    ],
    commonTraps: [
      'Rút gọn $\\frac{x + 2}{x + 5}$ bằng cách gạch bỏ $x$ thành $\\frac{2}{5}$ (SAI! Chỉ rút gọn được thừa số nhân chung!).'
    ],
    theory: [
      '1. Phân thức đại số $\\frac{A}{B}$ giống hệt phân số nhưng tử $A$ và mẫu $B$ là đa thức ($B \\neq 0$).',
      '2. Quy tắc đổi dấu vàng: $\\frac{A}{B} = \\frac{-A}{-B}$ giúp đổi $y - x$ thành $-(x - y)$ để đồng bộ mẫu chung ngay lập tức.'
    ],
    keyFormulas: [
      '\\frac{A}{B} = \\frac{A \\cdot M}{B \\cdot M} \\quad (M \\neq 0)',
      '\\frac{A}{B} + \\frac{C}{D} = \\frac{AD + BC}{BD}, \\quad \\frac{A}{B} : \\frac{C}{D} = \\frac{AD}{BC}'
    ],
    flashcards: [
      { front: 'ĐKXĐ và dạng rút gọn của $\\frac{x^2 - 1}{x + 1}$?', back: 'ĐKXĐ: $x \\neq -1$; Rút gọn $= x - 1$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_8,
        question: 'Với $x \\neq \\pm 2$, kết quả rút gọn phân thức $\\frac{x^2 - 4}{x^2 + 2x}$ là:',
        options: ['A. $\\frac{x - 2}{x}$', 'B. $\\frac{x + 2}{x}$', 'C. $-2$', 'D. $\\frac{-4}{2x}$'],
        correctIndex: 0,
        explanation: '$\\frac{(x-2)(x+2)}{x(x+2)} = \\frac{x-2}{x}$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_8,
        question: 'Thực hiện phép tính: $P = \\frac{1}{x - 2} + \\frac{1}{x + 2} - \\frac{4}{x^2 - 4}$ với $x \\neq \\pm 2$.',
        hints: ['Mẫu chung là $x^2 - 4 = (x - 2)(x + 2)$.'],
        solutionSteps: [
          '$P = \\frac{(x + 2) + (x - 2) - 4}{(x - 2)(x + 2)} = \\frac{2x - 4}{(x - 2)(x + 2)} = \\frac{2(x - 2)}{(x - 2)(x + 2)} = \\frac{2}{x + 2}$.'
        ],
        finalAnswer: '$P = \\frac{2}{x + 2}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d'
  },
  {
    id: 'math-8-b3',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 8',
    lessonNumber: 3,
    stageLabel: 'Toán 8 · Chương III: Định lí Pythagore & Hệ thống Tứ giác',
    sourceTag: SRC_2018_8,
    title: 'Bài 3: Định lí Pythagore & Tứ giác (Hình thang cân, Bình hành, Chữ nhật, Thoi, Vuông)',
    grade: 'Lớp 8 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Vận dụng Định lí Pythagore ($a^2 + b^2 = c^2$) và nắm trọn sơ đồ nhận biết 5 tứ giác đặc biệt từ Hình bình hành $\\to$ Chữ nhật / Thoi $\\to$ Hình vuông.',
    mnemonics: [
      'Pythagore: Bình phương CẠNH HUYỀN (đối diện góc $90^\\circ$) bằng tổng bình phương 2 cạnh góc vuông.',
      'Bình hành + 1 góc vuông (hoặc 2 đường chéo bằng nhau) $\\to$ Chữ nhật; + 2 cạnh kề bằng nhau (hoặc 2 đường chéo vuông góc) $\\to$ Hình thoi.'
    ],
    commonTraps: [
      'Lắp nhầm cạnh góc vuông làm cạnh huyền trong công thức Pythagore.'
    ],
    theory: [
      '1. Định lí Pythagore thuận và đảo giúp tính cạnh còn lại của tam giác vuông hoặc kiểm tra xem tam giác có vuông hay không.',
      '2. Tổng 4 góc của mọi tứ giác bằng $360^\\circ$. Đường trung tuyến ứng với cạnh huyền trong tam giác vuông bằng nửa cạnh huyền.'
    ],
    keyFormulas: [
      'BC^2 = AB^2 + AC^2 \\quad (\\widehat{A} = 90^\\circ)',
      '\\widehat{A} + \\widehat{B} + \\widehat{C} + \\widehat{D} = 360^\\circ'
    ],
    flashcards: [
      { front: 'Tam giác vuông hai cạnh góc vuông $6\\text{ cm}, 8\\text{ cm}$ có cạnh huyền dài mấy cm?', back: '$\\sqrt{6^2 + 8^2} = 10\\text{ cm}$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_8,
        question: 'Hình bình hành cần thêm điều kiện nào để trở thành hình thoi?',
        options: ['A. Có một góc vuông', 'B. Hai đường chéo bằng nhau', 'C. Hai đường chéo vuông góc với nhau', 'D. Hai cạnh đối bằng nhau'],
        correctIndex: 2,
        explanation: 'Hình bình hành có hai đường chéo vuông góc là hình thoi.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_8,
        question: 'Một chiếc thang dài $5\\text{ m}$ dựa vào tường, chân thang cách chân tường $3\\text{ m}$. Tính độ cao đầu thang chạm tường.',
        hints: ['Dùng Pythagore với cạnh huyền $5\\text{ m}$.'],
        solutionSteps: [
          '$h^2 + 3^2 = 5^2 \\implies h^2 = 25 - 9 = 16 \\implies h = 4\\text{ m}$.'
        ],
        finalAnswer: '$4\\text{ m}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'pythagoras',
    sim3dMode: 'geometric_transform_3d'
  },
  {
    id: 'math-8-b4',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 8',
    lessonNumber: 4,
    stageLabel: 'Toán 8 · Chương IV & IX: Định lí Thalès & Tam giác đồng dạng',
    sourceTag: SRC_2018_8,
    title: 'Bài 4: Định lí Thalès, Đường trung bình, Phân giác & Tam giác đồng dạng',
    grade: 'Lớp 8 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 15,
    description:
      'Ứng dụng Định lí Thalès, tính chất đường trung bình ($MN = \\frac{1}{2}BC$), đường phân giác ($\\frac{DB}{DC} = \\frac{AB}{AC}$) và 3 trường hợp tam giác đồng dạng đo gián tiếp chiều cao.',
    mnemonics: [
      'Thalès: Song song $\\implies$ các đoạn thẳng TỈ LỆ tương ứng.',
      'Hai tam giác đồng dạng tỉ số $k \\implies$ tỉ số chu vi $= k$, tỉ số diện tích $= k^2$.'
    ],
    commonTraps: [
      'Viết sai thứ tự đỉnh tương ứng khi hai tam giác đồng dạng dẫn đến lập sai tỉ lệ.'
    ],
    theory: [
      '1. Nếu $MN // BC$ ($M \\in AB, N \\in AC$) thì $\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}$.',
      '2. Ba trường hợp đồng dạng: c.c.c, c.g.c và đặc biệt g.g (chỉ cần 2 cặp góc bằng nhau).'
    ],
    keyFormulas: [
      '\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}',
      '\\frac{S_{\\triangle A\'B\'C\'}}{S_{\\triangle ABC}} = k^2'
    ],
    flashcards: [
      { front: 'Nếu $\\triangle A\'B\'C\' \\sim \\triangle ABC$ tỉ số $k = 3$, tỉ số diện tích bằng bao nhiêu?', back: '$k^2 = 9$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_8,
        question: 'Cho $\\triangle ABC$ có $MN // BC$ ($M \\in AB, N \\in AC$). Biết $AM = 4, MB = 2, BC = 9$. Độ dài $MN$ là:',
        options: ['A. $4{,}5$', 'B. $6$', 'C. $3$', 'D. $5$'],
        correctIndex: 1,
        explanation: '$\\frac{MN}{9} = \\frac{4}{4+2} = \\frac{2}{3} \\implies MN = 6$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_8,
        question: 'Một cọc cao $1{,}5\\text{ m}$ có bóng dài $2\\text{ m}$. Cùng lúc đó, một cây có bóng dài $10\\text{ m}$. Tính chiều cao của cây.',
        hints: ['Hai tam giác vuông tạo bởi nắng và bóng đồng dạng (g.g).'],
        solutionSteps: [
          '$\\frac{h}{10} = \\frac{1{,}5}{2} \\implies h = 7{,}5\\text{ m}$.'
        ],
        finalAnswer: '$7{,}5\\text{ m}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'triangle_explorer',
    sim3dMode: 'geometric_transform_3d'
  },
  {
    id: 'math-8-b5',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 8',
    lessonNumber: 5,
    stageLabel: 'Toán 8 · Chương X: Hình khối thực tiễn (Hình chóp đều)',
    sourceTag: SRC_2018_8,
    title: 'Bài 5: Hình chóp tam giác đều & Hình chóp tứ giác đều + Khai triển 3D',
    grade: 'Lớp 8 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 14,
    description:
      'Gấp mở lưới khai triển 2D ↔ 3D hình chóp tam giác đều, chóp tứ giác đều; tính diện tích xung quanh $S_{xq} = p \\cdot d$ (nửa chu vi đáy $\\times$ trung đoạn) và thể tích $V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h$.',
    mnemonics: [
      'Thể tích mọi Hình chóp luôn có hệ số $\\frac{1}{3}$: $V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h$.',
      'Diện tích xung quanh chóp đều: $S_{xq} = p \\cdot d$ ($p$ là nửa chu vi đáy, $d$ là trung đoạn mặt bên).'
    ],
    commonTraps: [
      'Quên nhân hệ số $\\frac{1}{3}$ khi tính thể tích hình chóp hoặc nhầm chiều cao $h$ với trung đoạn $d$.'
    ],
    theory: [
      '1. Hình chóp tam giác đều có đáy là tam giác đều, 3 mặt bên là 3 tam giác cân bằng nhau. Hình chóp tứ giác đều có đáy là hình vuông, 4 mặt bên là 4 tam giác cân bằng nhau.',
      '2. Trung đoạn $d$ là đường cao kẻ từ đỉnh hình chóp xuống cạnh đáy của một mặt bên (dùng để tính $S_{xq}$), còn đường cao $h$ là đoạn vuông góc hạ từ đỉnh xuống tâm mặt đáy (dùng để tính $V$).'
    ],
    keyFormulas: [
      'V_{\\text{chóp}} = \\frac{1}{3} S_{\\text{đáy}} \\cdot h',
      'S_{xq} = p \\cdot d = \\frac{1}{2} C_{\\text{đáy}} \\cdot d'
    ],
    flashcards: [
      { front: 'Chóp tứ giác đều đáy cạnh $6\\text{ cm}$, chiều cao $10\\text{ cm}$ có thể tích bao nhiêu?', back: '$V = \\frac{1}{3} \\cdot 6^2 \\cdot 10 = 120\\text{ cm}^3$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_8,
        question: 'Hình chóp tứ giác đều có cạnh đáy $8\\text{ cm}$, trung đoạn $d = 5\\text{ cm}$. Diện tích xung quanh của hình chóp là:',
        options: ['A. $40\\text{ cm}^2$', 'B. $80\\text{ cm}^2$', 'C. $160\\text{ cm}^2$', 'D. $64\\text{ cm}^2$'],
        correctIndex: 1,
        explanation: 'Nửa chu vi đáy $p = \\frac{4\\cdot 8}{2} = 16\\text{ cm} \\implies S_{xq} = 16\\cdot 5 = 80\\text{ cm}^2$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_8,
        question: 'Một mái lều hình chóp tứ giác đều có đáy hình vuông cạnh $3\\text{ m}$ và chiều cao $2\\text{ m}$. Tính thể tích không khí bên trong lều.',
        hints: ['Tính $S_{\\text{đáy}} = 3^2 = 9\\text{ m}^2$, rồi áp dụng $V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h$.'],
        solutionSteps: [
          '$V = \\frac{1}{3} \\cdot 9 \\cdot 2 = 6\\text{ m}^3$.'
        ],
        finalAnswer: '$6\\text{ m}^3$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'spatial_pyramid',
    sim3dMode: 'solid_prism_nets_3d'
  },
  {
    id: 'math-8-b6',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 8',
    lessonNumber: 6,
    stageLabel: 'Toán 8 · Chương VII: Phương trình bậc nhất & Hàm số y = ax + b',
    sourceTag: SRC_2018_8,
    title: 'Bài 6: Phương trình bậc nhất một ẩn, Hàm số bậc nhất $y = ax + b$ & Hệ số góc',
    grade: 'Lớp 8 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Vẽ đồ thị đường thẳng $y = ax + b$ ($a \\neq 0$), nhận biết song song ($a = a\', b \\neq b\'$) – cắt nhau ($a \\neq a\'$) và giải bài toán thực tế bằng lập phương trình.',
    mnemonics: [
      'Hai đường thẳng $y = ax + b$ và $y = a\'x + b\'$: Song song khi $a = a\', b \\neq b\'$; Cắt nhau khi $a \\neq a\'$.',
      'Lập PT 3 bước: Chọn ẩn + ĐK $\\to$ Lập PT $\\to$ Giải & đối chiếu.'
    ],
    commonTraps: [
      'Quên đổi phút sang giờ ($30\\text{ phút} = 0{,}5\\text{ h}$) khi lập phương trình chuyển động.'
    ],
    theory: [
      '1. Đồ thị $y = ax + b$ ($a \\neq 0$) là đường thẳng cắt trục tung tại $(0; b)$ và cắt trục hoành tại $(-b/a; 0)$. Hệ số $a$ là hệ số góc: $a > 0$ đường đi lên, $a < 0$ đường đi xuống.',
      '2. Giải bài toán bằng cách lập phương trình: chuyển đổi câu chữ thành công thức $S = v \\cdot t$, tổng sản phẩm, hoặc lãi suất.'
    ],
    keyFormulas: [
      'y = ax + b \\quad (a \\neq 0)',
      'd \\parallel d\' \\iff a = a\' \\text{ và } b \\neq b\'',
      'S = v \\cdot t'
    ],
    flashcards: [
      { front: 'Đường thẳng $y = 3x - 2$ có song song với $y = 3x + 5$ không?', back: 'Có, vì hệ số góc bằng nhau ($3 = 3$) và tung độ gốc khác nhau ($-2 \\neq 5$).' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_8,
        question: 'Đồ thị hàm số $y = 2x - 4$ cắt trục hoành $Ox$ tại điểm có hoành độ là:',
        options: ['A. $x = -4$', 'B. $x = 2$', 'C. $x = -2$', 'D. $x = 4$'],
        correctIndex: 1,
        explanation: 'Cho $y = 0 \\implies 2x - 4 = 0 \\implies x = 2$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_8,
        question: 'Một người đi xe máy từ A đến B với vận tốc $40\\text{ km/h}$, lúc về đi $50\\text{ km/h}$ nên thời gian về ít hơn đi $30\\text{ phút}$. Tính quãng đường AB.',
        hints: ['Đổi $30\\text{ phút} = 0{,}5\\text{ h}$, lập $\\frac{x}{40} - \\frac{x}{50} = 0{,}5$.'],
        solutionSteps: [
          '$\\frac{x}{40} - \\frac{x}{50} = 0{,}5 \\iff \\frac{x}{200} = 0{,}5 \\implies x = 100\\text{ km}$.'
        ],
        finalAnswer: '$AB = 100\\text{ km}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz',
    defaultGraphConfig: { type: 'linear', params: { a: 2, b: -4, c: 0, d: 0 }, color: '#0284c7', name: 'y = 2x - 4' }
  },
  {
    id: 'math-8-b7',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 8',
    lessonNumber: 7,
    stageLabel: 'Toán 8 · Chương V & VIII: Dữ liệu biểu đồ & Xác suất lí thuyết',
    sourceTag: SRC_2018_8,
    title: 'Bài 7: Phân tích dữ liệu biểu đồ & Mối liên hệ Xác suất thực nghiệm – Xác suất lí thuyết',
    grade: 'Lớp 8 · Xác suất & Thống kê',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 12,
    description:
      'Lựa chọn loại biểu đồ phù hợp (cột, quạt, đoạn thẳng), phát hiện biểu đồ gây hiểu lầm và hiểu khi số lần thử $N$ rất lớn thì xác suất thực nghiệm tiến gần xác suất lí thuyết.',
    mnemonics: [
      'Khi $N$ rất lớn: $P_{\\text{thực nghiệm}}(E) \\approx P_{\\text{lí thuyết}}(E) = \\frac{n(E)}{n(\\Omega)}$.'
    ],
    commonTraps: [
      'Dùng biểu đồ quạt tròn cho dữ liệu không thể hiện tỉ lệ phần trăm của cùng một tổng thể.'
    ],
    theory: [
      '1. Chọn đúng biểu đồ: Muốn so sánh số lượng $\\to$ biểu đồ cột; muốn xem tỉ trọng phần trăm $\\to$ biểu đồ quạt tròn; muốn xem xu hướng theo thời gian $\\to$ biểu đồ đoạn thẳng.',
      '2. Xác suất lí thuyết giúp dự đoán tỉ lệ dài hạn (ví dụ rút ngẫu nhiên 1 thẻ trong bộ 10 thẻ đánh số 1..10 để được số nguyên tố $\\{2,3,5,7\\}$ có $P = 4/10 = 0{,}4$).'
    ],
    keyFormulas: [
      'P(E) = \\frac{\\text{Số kết quả thuận lợi}}{\\text{Tổng số kết quả đồng khả năng}}'
    ],
    flashcards: [
      { front: 'Rút ngẫu nhiên 1 quả bóng từ hộp có 3 bi đỏ, 5 bi xanh, 2 bi vàng. Tính xác suất rút được bi xanh?', back: '$P = \\frac{5}{3+5+2} = \\frac{5}{10} = 0{,}5$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2018_8,
        question: 'Viết ngẫu nhiên một số tự nhiên có hai chữ số nhỏ hơn $20$. Xác suất để số viết ra chia hết cho $3$ là:',
        options: ['A. $0{,}2$', 'B. $0{,}3$', 'C. $0{,}4$', 'D. $0{,}5$'],
        correctIndex: 1,
        explanation: 'Tập số 2 chữ số $< 20$ gồm 10 số $\\{10,11,\\dots,19\\}$. Các số chia hết cho 3 là $\\{12, 15, 18\\}$ (3 số) $\\implies P = 3/10 = 0{,}3$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2018_8,
        question: 'Một hộp chứa 15 thẻ cùng loại đánh số $1$ đến $15$. Rút ngẫu nhiên 1 thẻ. Tính xác suất rút được thẻ ghi số chia hết cho 4.',
        hints: ['Liệt kê các số từ $1$ đến $15$ chia hết cho 4: $4, 8, 12$.'],
        solutionSteps: [
          'Tổng số kết quả: $15$. Các kết quả thuận lợi: $\\{4, 8, 12\\}$ (3 số).',
          'Xác suất: $P = \\frac{3}{15} = \\frac{1}{5} = 0{,}2$.'
        ],
        finalAnswer: '$0{,}2$ ($20\\%$).'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d'
  },

  // ==========================================================================
  // GDPT 2006 — LỚP 6 (6 CHỦ ĐỀ THEO SGK TOÁN 6 2006)
  // ==========================================================================
  {
    id: 'math-2006-6-1',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 6',
    lessonNumber: 1,
    stageLabel: 'Toán 6 (SGK 2006) · Số học Chương I (Phần 1)',
    sourceTag: SRC_2006_6,
    title: 'Bài 1: Tập hợp, Phép tính trong $\\mathbb{N}$, Lũy thừa & Thứ tự thực hiện phép tính (SGK 2006)',
    grade: 'Lớp 6 · Số học',
    category: 'Số học & Tổ hợp',
    difficulty: 'Cơ bản',
    readTimeMinutes: 13,
    description:
      'Làm quen hai cách viết tập hợp (liệt kê / chỉ ra tính chất đặc trưng), đếm số phần tử dãy cách đều và tính nhanh lũy thừa với số mũ tự nhiên.',
    mnemonics: [
      'Số phần tử dãy cách đều: $(\\text{Số cuối} - \\text{Số đầu}) : \\text{Khoảng cách} + 1$.',
      'Nhân cộng mũ, chia trừ mũ cùng cơ số; $a^0 = 1$ ($a \\neq 0$).'
    ],
    commonTraps: [
      'Quên cộng $1$ khi đếm số phần tử của dãy số tự nhiên từ $a$ đến $b$.'
    ],
    theory: [
      '1. Kí hiệu $\\in$ (thuộc), $\\notin$ (không thuộc), $\\subset$ (tập con). Tập hợp rỗng kí hiệu $\\varnothing$.',
      '2. Phép tính cộng – nhân có tính giao hoán, kết hợp và phân phối: $a(b + c) = ab + ac$.'
    ],
    keyFormulas: [
      'N_{\\text{phần tử}} = \\frac{\\text{Cuối} - \\text{Đầu}}{d} + 1',
      'a^m \\cdot a^n = a^{m+n}, \\quad a^m : a^n = a^{m-n}'
    ],
    flashcards: [
      { front: 'Tập $A = \\{10; 11; 12; \\dots; 99\\}$ có bao nhiêu phần tử?', back: '$(99 - 10) : 1 + 1 = 90$ phần tử.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_6,
        question: 'Giá trị của $3^5 : 3^2 + 2^3 \\cdot 2^0$ bằng:',
        options: ['A. $35$', 'B. $27$', 'C. $17$', 'D. $43$'],
        correctIndex: 0,
        explanation: '$3^3 + 8\\cdot 1 = 27 + 8 = 35$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_6,
        question: 'Tìm $x \\in \\mathbb{N}$ biết: $2^{x+1} = 32$.',
        hints: ['Đổi $32 = 2^5$ rồi cho hai số mũ bằng nhau.'],
        solutionSteps: [
          '$2^{x+1} = 2^5 \\implies x + 1 = 5 \\implies x = 4$.'
        ],
        finalAnswer: '$x = 4$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-2006-6-2',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 6',
    lessonNumber: 2,
    stageLabel: 'Toán 6 (SGK 2006) · Số học Chương I (Phần 2)',
    sourceTag: SRC_2006_6,
    title: 'Bài 2: Dấu hiệu chia hết 2–3–5–9, Số nguyên tố, ƯCLN & BCNN (SGK 2006)',
    grade: 'Lớp 6 · Số học',
    category: 'Số học & Tổ hợp',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Nắm vững tính chất chia hết của một tổng, dấu hiệu chia hết, phân tích thừa số nguyên tố và cách giải bài toán đố ƯCLN – BCNN trong đề thi SGK 2006.',
    mnemonics: [
      'Chia hết cho $3$ hoặc $9$: cộng tổng các chữ số lại.',
      'Hai số nguyên tố cùng nhau có $\\text{ƯCLN}(a, b) = 1$.'
    ],
    commonTraps: [
      'Cho rằng số chia hết cho $3$ thì chắc chắn chia hết cho $9$ (NGƯỢC LẠI mới đúng!).'
    ],
    theory: [
      '1. Phân tích ra thừa số nguyên tố dùng sơ đồ cây hoặc chia cột dọc theo thứ tự $2, 3, 5, 7, 11\\dots$',
      '2. Muốn tìm $x \\in \\text{ƯC}(a,b)$ thì tìm $\\text{ƯCLN}(a,b)$ trước rồi lấy các ước của nó; tương tự $x \\in \\text{BC}(a,b)$ lấy bội của $\\text{BCNN}(a,b)$.'
    ],
    keyFormulas: [
      '\\text{ƯCLN}(a, b) \\cdot \\text{BCNN}(a, b) = a \\cdot b'
    ],
    flashcards: [
      { front: 'Tìm $\\text{ƯCLN}(36, 48)$?', back: '$36 = 2^2\\cdot 3^2$, $48 = 2^4\\cdot 3 \\implies \\text{ƯCLN} = 2^2\\cdot 3 = 12$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_6,
        question: 'Số nào sau đây chia hết cho cả $2, 3, 5$ và $9$?',
        options: ['A. $135$', 'B. $450$', 'C. $240$', 'D. $510$'],
        correctIndex: 1,
        explanation: 'Tận cùng $0$ (chia hết $2$ và $5$) và tổng chữ số $4+5+0 = 9$ (chia hết $3$ và $9$).'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_6,
        question: 'Học sinh khối 6 khi xếp hàng $10$, hàng $12$, hàng $15$ đều vừa đủ. Biết số học sinh trong khoảng $150$ đến $200$. Tính số học sinh.',
        hints: ['Số học sinh thuộc $\\text{BC}(10, 12, 15)$ trong khoảng $150 \\dots 200$.'],
        solutionSteps: [
          '$\\text{BCNN}(10, 12, 15) = 60 \\implies \\text{BC} = \\{0, 60, 120, 180, 240\\dots\\}$.',
          'Trong khoảng $150$ đến $200$ chỉ có $180$.'
        ],
        finalAnswer: '$180$ học sinh.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-2006-6-3',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 6',
    lessonNumber: 3,
    stageLabel: 'Toán 6 (SGK 2006) · Số học Chương II: Số nguyên',
    sourceTag: SRC_2006_6,
    title: 'Bài 3: Tập $\\mathbb{Z}$, Giá trị tuyệt đối, Quy tắc dấu ngoặc – Chuyển vế & Bội ước số nguyên (SGK 2006)',
    grade: 'Lớp 6 · Số học',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 13,
    description:
      'Làm chủ quy tắc chuyển vế (chuyển sang vế kia phải đổi dấu), bỏ ngoặc và tìm ước – bội nguyên âm/dương của một số nguyên.',
    mnemonics: [
      'Chuyển vế ĐỔI DẤU: $+$ sang $-$, $-$ sang $+$.',
      'Khi hai số nguyên nhân nhau: cùng dấu ra $+$, trái dấu ra $-$.'
    ],
    commonTraps: [
      'Quên các ước âm khi đề yêu cầu tìm ước trong $\\mathbb{Z}$ (ví dụ $\\text{Ư}(6) = \\{\\pm 1, \\pm 2, \\pm 3, \\pm 6\\}$).'
    ],
    theory: [
      '1. Giá trị tuyệt đối $|a|$ luôn $\\ge 0$: $|5| = 5, |-5| = 5$. Hai số đối nhau có giá trị tuyệt đối bằng nhau và tổng bằng $0$.',
      '2. Phép chuyển vế: $x + a = b \\implies x = b - a$. Quy tắc này dùng xuyên suốt từ lớp 6 đến lớp 12!'
    ],
    keyFormulas: [
      '|a| = |-a| \\ge 0',
      'a + b = c \\iff a = c - b'
    ],
    flashcards: [
      { front: 'Tìm $x \\in \\mathbb{Z}$ biết $x + 7 = -3$?', back: '$x = -3 - 7 = -10$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_6,
        question: 'Kết quả của phép tính $(-12) \\cdot 4 + (-12) \\cdot 6$ là:',
        options: ['A. $120$', 'B. $-120$', 'C. $-24$', 'D. $24$'],
        correctIndex: 1,
        explanation: 'Đặt nhân tử chung $(-12)\\cdot(4 + 6) = -12 \\cdot 10 = -120$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_6,
        question: 'Tìm tất cả số nguyên $x$ sao cho $3x + 5 = -13$.',
        hints: ['Chuyển $+5$ sang vế phải thành $-5$.'],
        solutionSteps: [
          '$3x = -13 - 5 = -18 \\implies x = -6$.'
        ],
        finalAnswer: '$x = -6$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-2006-6-4',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 6',
    lessonNumber: 4,
    stageLabel: 'Toán 6 (SGK 2006) · Số học Chương III: Phân số',
    sourceTag: SRC_2006_6,
    title: 'Bài 4: Phân số bằng nhau, Quy đồng – Tính toán & Ba bài toán cơ bản phân số (SGK 2006)',
    grade: 'Lớp 6 · Số học',
    category: 'Số học & Tổ hợp',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Làm chủ đầy đủ 4 phép tính phân số mẫu nguyên âm/dương, hỗn số, số thập phân và 3 dạng toán cơ bản phân số – phần trăm.',
    mnemonics: [
      'Phân số có mẫu âm $\\to$ nhân cả tử và mẫu với $-1$ để có mẫu dương trước khi quy đồng.'
    ],
    commonTraps: [
      'Nhầm lẫn bài toán tìm giá trị phân số của một số ($\\times$) với bài toán tìm một số biết giá trị phân số ($:$).'
    ],
    theory: [
      '1. Rút gọn phân số đến tối giản bằng cách chia cả tử và mẫu cho $\\text{ƯCLN}(|a|, |b|)$.',
      '2. Ba bài toán cơ bản: (i) Tìm $\\frac{m}{n}$ của $b \\to b\\cdot\\frac{m}{n}$; (ii) Tìm số biết $\\frac{m}{n}$ của nó bằng $a \\to a:\\frac{m}{n}$; (iii) Tìm tỉ số phần trăm $\\frac{a}{b}\\cdot 100\\%$.'
    ],
    keyFormulas: [
      '\\frac{a}{-b} = \\frac{-a}{b}',
      '\\frac{a}{b} : \\frac{c}{d} = \\frac{ad}{bc}'
    ],
    flashcards: [
      { front: 'Đổi phân số $\\frac{3}{-8}$ sang mẫu dương và cộng với $\\frac{1}{8}$?', back: '$\\frac{-3}{8} + \\frac{1}{8} = \\frac{-2}{8} = \\frac{-1}{4}$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_6,
        question: 'Kết quả phép tính $\\frac{-3}{4} + \\frac{5}{6}$ là:',
        options: ['A. $\\frac{1}{12}$', 'B. $\\frac{2}{10}$', 'C. $\\frac{-1}{12}$', 'D. $\\frac{19}{12}$'],
        correctIndex: 0,
        explanation: 'Mẫu chung $12$: $\\frac{-9}{12} + \\frac{10}{12} = \\frac{1}{12}$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_6,
        question: 'Một bể nước đã chứa $\\frac{3}{5}$ dung tích, cần đổ thêm $120$ lít nữa mới đầy bể. Hỏi bể chứa được tối đa bao nhiêu lít?',
        hints: ['$120$ lít ứng với $1 - \\frac{3}{5} = \\frac{2}{5}$ bể.'],
        solutionSteps: [
          'Phần bể còn trống: $1 - \\frac{3}{5} = \\frac{2}{5}$ bể.',
          'Dung tích tối đa: $120 : \\frac{2}{5} = 300$ lít.'
        ],
        finalAnswer: '$300$ lít.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-2006-6-5',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 6',
    lessonNumber: 5,
    stageLabel: 'Toán 6 (SGK 2006) · Hình học Chương I: Đoạn thẳng',
    sourceTag: SRC_2006_6,
    title: 'Bài 5: Điểm, Đường thẳng, Tia, Đoạn thẳng & Trung điểm đoạn thẳng (SGK Hình 6 2006)',
    grade: 'Lớp 6 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 12,
    description:
      'Phân biệt hai tia đối nhau – trùng nhau, dấu hiệu nhận biết điểm nằm giữa hai điểm ($AM + MB = AB$) và bài toán trung điểm trên tia.',
    mnemonics: [
      'Hai tia đối nhau: chung gốc và tạo thành một đường thẳng thẳng tắp.'
    ],
    commonTraps: [
      'Quên giải thích vì sao điểm $M$ nằm giữa trước khi viết $OM + MN = ON$.'
    ],
    theory: [
      '1. Điểm nằm trên đường thẳng chia đường thẳng thành hai tia đối nhau.',
      '2. Trên tia $Ox$ nếu $OA < OB$ thì điểm $A$ luôn nằm giữa $O$ và $B$, suy ra $OA + AB = OB$.'
    ],
    keyFormulas: [
      'OA < OB \\implies A \\text{ nằm giữa } O, B \\implies OA + AB = OB'
    ],
    flashcards: [
      { front: 'Cho đoạn $AB = 12\\text{ cm}$, lấy điểm $M$ trên $AB$ sao cho $AM = 5\\text{ cm}$. Tính $MB$?', back: '$MB = 12 - 5 = 7\\text{ cm}$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_6,
        question: 'Nếu điểm $I$ là trung điểm của đoạn thẳng $MN = 16\\text{ cm}$ thì độ dài $MI$ bằng:',
        options: ['A. $4\\text{ cm}$', 'B. $8\\text{ cm}$', 'C. $16\\text{ cm}$', 'D. $32\\text{ cm}$'],
        correctIndex: 1,
        explanation: '$MI = \\frac{MN}{2} = 8\\text{ cm}$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_6,
        question: 'Trên tia $Ox$ lấy $A, B$ với $OA = 3\\text{ cm}, OB = 7\\text{ cm}$. Gọi $I$ là trung điểm của $AB$. Tính $OI$.',
        hints: ['Tính $AB = 7 - 3 = 4\\text{ cm}$, suy ra $AI = 2\\text{ cm}$.'],
        solutionSteps: [
          'Vì $OA < OB$ nên $A$ nằm giữa $O, B \\implies AB = 7 - 3 = 4\\text{ cm}$.',
          '$I$ là trung điểm $AB \\implies AI = 2\\text{ cm} \\implies OI = 3 + 2 = 5\\text{ cm}$.'
        ],
        finalAnswer: '$OI = 5\\text{ cm}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'triangle_explorer',
    sim3dMode: 'line_plane_oxyz'
  },
  {
    id: 'math-2006-6-6',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 6',
    lessonNumber: 6,
    stageLabel: 'Toán 6 (SGK 2006) · Hình học Chương II: Góc',
    sourceTag: SRC_2006_6,
    title: 'Bài 6: Nửa mặt phẳng, Cộng số đo góc, Tia phân giác & Đường tròn – Tam giác (SGK 2006)',
    grade: 'Lớp 6 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Làm chủ quy tắc chứng minh tia nằm giữa hai tia, hai góc kề bù ($180^\\circ$) – phụ nhau ($90^\\circ$), chứng minh tia phân giác của góc và định nghĩa đường tròn.',
    mnemonics: [
      'Hai góc phụ nhau cộng lại $= 90^\\circ$; hai góc bù nhau cộng lại $= 180^\\circ$.',
      'Tia phân giác $Oz$: nằm giữa + chia đôi góc ($\\widehat{xOz} = \\widehat{zOy} = \\frac{1}{2}\\widehat{xOy}$).'
    ],
    commonTraps: [
      'Chỉ viết $\\widehat{xOz} = \\widehat{zOy}$ mà quên chỉ ra tia $Oz$ nằm giữa $Ox, Oy$ khi chứng minh phân giác.'
    ],
    theory: [
      '1. Trên cùng nửa mặt phẳng bờ chứa tia $Ox$, nếu $\\widehat{xOy} < \\widehat{xOz}$ thì tia $Oy$ nằm giữa $Ox$ và $Oz$.',
      '2. Đường tròn tâm $O$ bán kính $R$ là hình gồm tất cả các điểm cách $O$ một khoảng bằng $R$.'
    ],
    keyFormulas: [
      '\\widehat{xOz} = \\widehat{zOy} = \\frac{\\widehat{xOy}}{2}'
    ],
    flashcards: [
      { front: 'Cho góc $\\widehat{xOy} = 110^\\circ$, tia $Oz$ là phân giác. Tính $\\widehat{xOz}$?', back: '$55^\\circ$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_6,
        question: 'Hai góc kề bù có số đo là $\\alpha$ và $50^\\circ$. Giá trị của $\\alpha$ là:',
        options: ['A. $40^\\circ$', 'B. $50^\\circ$', 'C. $130^\\circ$', 'D. $140^\\circ$'],
        correctIndex: 2,
        explanation: 'Kề bù tổng $180^\\circ \\implies \\alpha = 180^\\circ - 50^\\circ = 130^\\circ$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_6,
        question: 'Trên cùng nửa mặt phẳng bờ chứa tia $Ox$, vẽ tia $Oy, Oz$ sao cho $\\widehat{xOy} = 40^\\circ$, $\\widehat{xOz} = 80^\\circ$. Chứng minh $Oy$ là tia phân giác của $\\widehat{xOz}$.',
        hints: ['So sánh $40^\\circ < 80^\\circ$ để chứng minh $Oy$ nằm giữa.'],
        solutionSteps: [
          'Vì $\\widehat{xOy} < \\widehat{xOz}$ ($40^\\circ < 80^\\circ$) nên $Oy$ nằm giữa $Ox$ và $Oz$.',
          '$\\widehat{yOz} = 80^\\circ - 40^\\circ = 40^\\circ = \\widehat{xOy} \\implies Oy$ là tia phân giác.'
        ],
        finalAnswer: '$Oy$ là tia phân giác của $\\widehat{xOz}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'triangle_explorer',
    sim3dMode: 'circle_theorems_3d'
  },

  // ==========================================================================
  // GDPT 2006 — LỚP 7 (6 CHỦ ĐỀ THEO SGK TOÁN 7 2006)
  // ==========================================================================
  {
    id: 'math-2006-7-1',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 7',
    lessonNumber: 1,
    stageLabel: 'Toán 7 (SGK 2006) · Đại số Chương I',
    sourceTag: SRC_2006_7,
    title: 'Bài 1: Số hữu tỉ $\\mathbb{Q}$, Lũy thừa, Tỉ lệ thức & Số vô tỉ – Số thực (SGK 2006)',
    grade: 'Lớp 7 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Làm chủ toàn bộ Chương I Đại số 7 (2006): phép tính số hữu tỉ, giá trị tuyệt đối, lũy thừa, tỉ lệ thức – dãy tỉ số bằng nhau và căn bậc hai.',
    mnemonics: [
      '$\\frac{a}{b} = \\frac{c}{d} \\iff a\\cdot d = b\\cdot c$.',
      'Thập phân hữu hạn hay vô hạn tuần hoàn đều là Số hữu tỉ $\\mathbb{Q}$.'
    ],
    commonTraps: [
      'Lẫn lộn quy tắc $(x^m)^n = x^{mn}$ với $x^m \\cdot x^n = x^{m+n}$.'
    ],
    theory: [
      '1. Lũy thừa số hữu tỉ: $(x/y)^n = x^n / y^n$, $x^{-n}$ chỉ học lên lớp 12, ở lớp 7 luôn dùng số mũ tự nhiên.',
      '2. Tính chất dãy tỉ số bằng nhau cho phép đặt $\\frac{x}{a} = \\frac{y}{b} = k \\implies x = ak, y = bk$ giải nhanh mọi bài toán tìm $x, y$.'
    ],
    keyFormulas: [
      '\\frac{x}{a} = \\frac{y}{b} = \\frac{x \\pm y}{a \\pm b}'
    ],
    flashcards: [
      { front: 'Tìm $x$ trong tỉ lệ thức $\\frac{x}{6} = \\frac{-5}{12}$?', back: '$x = \\frac{6 \\cdot (-5)}{12} = -2{,}5$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_7,
        question: 'Giá trị của biểu thức $(-0{,}5)^2 \\cdot 4 + \\sqrt{9}$ là:',
        options: ['A. $4$', 'B. $2$', 'C. $1$', 'D. $5$'],
        correctIndex: 0,
        explanation: '$0{,}25 \\cdot 4 + 3 = 1 + 3 = 4$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_7,
        question: 'Tìm $x, y$ biết $\\frac{x}{4} = \\frac{y}{7}$ và $y - x = 15$.',
        hints: ['Dùng dãy tỉ số bằng nhau $\\frac{y - x}{7 - 4}$.'],
        solutionSteps: [
          '$\\frac{x}{4} = \\frac{y}{7} = \\frac{y - x}{7 - 4} = \\frac{15}{3} = 5$.',
          'Suy ra $x = 20, y = 35$.'
        ],
        finalAnswer: '$x = 20, y = 35$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'arithmetic_prism_3d'
  },
  {
    id: 'math-2006-7-2',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 7',
    lessonNumber: 2,
    stageLabel: 'Toán 7 (SGK 2006) · Đại số Chương II: Hàm số & Đồ thị',
    sourceTag: SRC_2006_7,
    title: 'Bài 2: Tỉ lệ thuận – Tỉ lệ nghịch, Mặt phẳng tọa độ Oxy & Đồ thị $y = ax$ (SGK 2006)',
    grade: 'Lớp 7 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Phân biệt bài toán tỉ lệ thuận vs tỉ lệ nghịch, xác định tọa độ điểm $M(x_0; y_0)$ trên mặt phẳng $Oxy$ và vẽ đồ thị hàm số $y = ax$ ($a \\neq 0$).',
    mnemonics: [
      'Điểm $M(x_0; y_0)$: Hoành độ $x_0$ viết TRƯỚC (ngang), tung độ $y_0$ viết SAU (dọc).',
      'Đồ thị $y = ax$ luôn là đường thẳng đi qua gốc tọa độ $O(0; 0)$ và điểm $A(1; a)$.'
    ],
    commonTraps: [
      'Viết ngược tọa độ $(y; x)$ thay vì $(x; y)$.'
    ],
    theory: [
      '1. Tỉ lệ thuận $y = kx$ có $y_1/x_1 = y_2/x_2$. Tỉ lệ nghịch $y = a/x$ có $x_1 y_1 = x_2 y_2$.',
      '2. Điểm thuộc trục hoành có tung độ $y = 0$; điểm thuộc trục tung có hoành độ $x = 0$.'
    ],
    keyFormulas: [
      'y = a \\cdot x \\quad (a \\neq 0)',
      'x_1 y_1 = x_2 y_2 \\text{ (Tỉ lệ nghịch)}'
    ],
    flashcards: [
      { front: 'Điểm $A(2; -6)$ có thuộc đồ thị hàm số $y = -3x$ không?', back: 'Thay $x = 2$: $y = -3 \\cdot 2 = -6$ (đúng bằng tung độ) $\\implies$ Có thuộc!' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_7,
        question: 'Đồ thị hàm số $y = -2x$ đi qua điểm nào sau đây?',
        options: ['A. $(1; 2)$', 'B. $(-1; 2)$', 'C. $(2; 4)$', 'D. $(-2; -4)$'],
        correctIndex: 1,
        explanation: 'Thay $x = -1 \\implies y = -2(-1) = 2$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_7,
        question: 'Một đội 12 máy cày làm xong cánh đồng trong 5 ngày. Hỏi muốn làm xong trong 3 ngày cần bao nhiêu máy cày cùng năng suất?',
        hints: ['Số máy và số ngày tỉ lệ nghịch: $12 \\cdot 5 = x \\cdot 3$.'],
        solutionSteps: [
          'Áp dụng tỉ lệ nghịch: $x = \\frac{12 \\cdot 5}{3} = 20$ máy.'
        ],
        finalAnswer: '20 máy cày.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz',
    defaultGraphConfig: { type: 'linear', params: { a: -2, b: 0, c: 0, d: 0 }, color: '#0284c7', name: 'y = -2x' }
  },
  {
    id: 'math-2006-7-3',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 7',
    lessonNumber: 3,
    stageLabel: 'Toán 7 (SGK 2006) · Đại số Chương III: Thống kê',
    sourceTag: SRC_2006_7,
    title: 'Bài 3: Bảng tần số, Biểu đồ đoạn thẳng, Số trung bình cộng & Mốt $M_0$ (SGK 2006)',
    grade: 'Lớp 7 · Xác suất & Thống kê',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 12,
    description:
      'Lập bảng tần số từ bảng số liệu ban đầu, vẽ biểu đồ đoạn thẳng, tính số trung bình cộng $\\bar{X}$ và tìm mốt $M_0$ của dấu hiệu.',
    mnemonics: [
      'Số trung bình cộng $\\bar{X}$ = Tổng các tích $(x_i \\cdot n_i)$ chia cho tổng tần số $N$.',
      'Mốt $M_0$ là GIÁ TRỊ $x_i$ có tần số $n_i$ lớn nhất (không phải là bản thân tần số!).'
    ],
    commonTraps: [
      'Nhầm Mốt $M_0$ là con số tần số lớn nhất thay vì giá trị tương ứng.'
    ],
    theory: [
      '1. Bảng tần số thu gọn giúp nhìn ngay mỗi giá trị xuất hiện bao nhiêu lần ($n_i$), tổng tất cả $n_i$ đúng bằng số các giá trị $N$.',
      '2. Số trung bình cộng đại diện cho xu thế trung tâm của dữ liệu (như điểm trung bình kiểm tra cả lớp).'
    ],
    keyFormulas: [
      '\\bar{X} = \\frac{x_1 n_1 + x_2 n_2 + \\dots + x_k n_k}{N}'
    ],
    flashcards: [
      { front: 'Điểm kiểm tra của 5 bạn là $7, 8, 8, 9, 8$. Tìm số trung bình cộng và mốt $M_0$?', back: '$\\bar{X} = 40/5 = 8$; $M_0 = 8$ (xuất hiện 3 lần).' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_7,
        question: 'Cỡ giày bán được nhiều nhất trong tuần là cỡ 39 với 24 đôi. Mốt của dấu hiệu là:',
        options: ['A. $24$', 'B. $39$', 'C. $7$', 'D. $63$'],
        correctIndex: 1,
        explanation: 'Mốt $M_0 = 39$ (giá trị có tần số lớn nhất là 24).'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_7,
        question: 'Bảng điểm thi: điểm 7 (4 bạn), điểm 8 (6 bạn), điểm 9 (10 bạn). Tính điểm trung bình cộng.',
        hints: ['Tổng số bạn $N = 4 + 6 + 10 = 20$.'],
        solutionSteps: [
          '$\\bar{X} = \\frac{7\\cdot 4 + 8\\cdot 6 + 9\\cdot 10}{20} = \\frac{28 + 48 + 90}{20} = \\frac{166}{20} = 8{,}3$.'
        ],
        finalAnswer: '$\\bar{X} = 8{,}3$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d'
  },
  {
    id: 'math-2006-7-4',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 7',
    lessonNumber: 4,
    stageLabel: 'Toán 7 (SGK 2006) · Đại số Chương IV: Biểu thức đại số',
    sourceTag: SRC_2006_7,
    title: 'Bài 4: Đơn thức, Đơn thức đồng dạng, Cộng trừ Đa thức & Nghiệm đa thức một biến (SGK 2006)',
    grade: 'Lớp 7 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 14,
    description:
      'Xác định bậc của đơn thức/đa thức, cộng trừ đơn thức đồng dạng, thu gọn đa thức và giải phương trình tìm nghiệm đa thức một biến.',
    mnemonics: [
      'Bậc của đơn thức khác $0$: cộng TẤT CẢ số mũ của các biến.',
      'Đơn thức đồng dạng: hệ số khác $0$ và PHẦN BIẾN giống hệt nhau.'
    ],
    commonTraps: [
      'Cộng nhầm phần mũ khi cộng hai đơn thức đồng dạng: $2x^2 + 3x^2 = 5x^4$ (SAI! Phải giữ nguyên phần biến: $5x^2$).'
    ],
    theory: [
      '1. Nhân hai đơn thức: nhân hệ số với hệ số, nhân phần biến cùng cơ số thì cộng số mũ.',
      '2. Muốn tìm nghiệm của đa thức $P(x)$: đặt $P(x) = 0$ rồi giải tìm $x$.'
    ],
    keyFormulas: [
      'ax^2 + bx^2 = (a + b)x^2',
      'P(a) = 0 \\iff a \\text{ là nghiệm của } P(x)'
    ],
    flashcards: [
      { front: 'Tìm bậc của đơn thức $-5x^3y^2z$?', back: 'Tổng số mũ $3 + 2 + 1 = 6$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_7,
        question: 'Tích của hai đơn thức $-2x^2y$ và $3xy^3$ là:',
        options: ['A. $-6x^3y^4$', 'B. $6x^3y^4$', 'C. $-6x^2y^3$', 'D. $x^3y^4$'],
        correctIndex: 0,
        explanation: '$(-2\\cdot 3)\\cdot x^{2+1}y^{1+3} = -6x^3y^4$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_7,
        question: 'Tìm nghiệm của đa thức $Q(x) = 4x - 10$.',
        hints: ['Giải $4x - 10 = 0$.'],
        solutionSteps: [
          '$4x - 10 = 0 \\implies 4x = 10 \\implies x = \\frac{10}{4} = 2{,}5$.'
        ],
        finalAnswer: '$x = 2{,}5$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d'
  },
  {
    id: 'math-2006-7-5',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 7',
    lessonNumber: 5,
    stageLabel: 'Toán 7 (SGK 2006) · Hình học Chương I & II',
    sourceTag: SRC_2006_7,
    title: 'Bài 5: Đường thẳng song song – vuông góc, Tam giác bằng nhau & Định lí Py-ta-go (SGK 2006)',
    grade: 'Lớp 7 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Làm chủ 3 trường hợp bằng nhau tam giác thường, 4 trường hợp bằng nhau tam giác vuông (cạnh huyền–góc nhọn, cạnh huyền–cạnh góc vuông) và định lí Py-ta-go (học ở lớp 7 theo SGK 2006).',
    mnemonics: [
      'Hai tam giác vuông bằng nhau nhanh nhất: (1) Cạnh huyền – góc nhọn; (2) Cạnh huyền – cạnh góc vuông.'
    ],
    commonTraps: [
      'Nhầm cạnh góc vuông với cạnh huyền khi áp dụng Py-ta-go.'
    ],
    theory: [
      '1. Từ vuông góc đến song song: Hai đường thẳng cùng vuông góc với đường thẳng thứ ba thì song song với nhau.',
      '2. Theo SGK 2006, Định lí Py-ta-go nằm ở Chương II Hình học 7: $BC^2 = AB^2 + AC^2$.'
    ],
    keyFormulas: [
      'BC^2 = AB^2 + AC^2 \\quad (\\widehat{A} = 90^\\circ)'
    ],
    flashcards: [
      { front: 'Tam giác vuông cạnh huyền $13\\text{ cm}$, một cạnh góc vuông $5\\text{ cm}$. Cạnh còn lại?', back: '$\\sqrt{13^2 - 5^2} = \\sqrt{144} = 12\\text{ cm}$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_7,
        question: 'Tam giác nào sau đây là tam giác vuông?',
        options: ['A. $4, 5, 6$', 'B. $6, 8, 10$', 'C. $5, 7, 9$', 'D. $2, 3, 4$'],
        correctIndex: 1,
        explanation: '$6^2 + 8^2 = 36 + 64 = 100 = 10^2$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_7,
        question: 'Cho tam giác $ABC$ có $AB = 6\\text{ cm}, AC = 8\\text{ cm}, BC = 10\\text{ cm}$. Chứng minh $\\triangle ABC$ vuông.',
        hints: ['So sánh $BC^2$ với $AB^2 + AC^2$.'],
        solutionSteps: [
          '$BC^2 = 10^2 = 100$; $AB^2 + AC^2 = 36 + 64 = 100$.',
          'Suy ra $\\triangle ABC$ vuông tại $A$ (Py-ta-go đảo).'
        ],
        finalAnswer: '$\\triangle ABC$ vuông tại $A$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'pythagoras',
    sim3dMode: 'geometric_transform_3d'
  },
  {
    id: 'math-2006-7-6',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 7',
    lessonNumber: 6,
    stageLabel: 'Toán 7 (SGK 2006) · Hình học Chương III: Các đường đồng quy',
    sourceTag: SRC_2006_7,
    title: 'Bài 6: Quan hệ góc–cạnh, Đường vuông góc – Đường xiên & 4 Đường đồng quy (SGK 2006)',
    grade: 'Lớp 7 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 14,
    description:
      'Phân biệt đường vuông góc (ngắn nhất) vs đường xiên hình chiếu, bất đẳng thức tam giác và hệ thống 4 đường đồng quy trong tam giác (SGK Hình 7 2006).',
    mnemonics: [
      'Đường xiên nào có hình chiếu lớn hơn thì đường xiên đó lớn hơn.',
      'Trung tuyến $\\to$ Trọng tâm; Phân giác $\\to$ Cách đều 3 cạnh; Trung trực $\\to$ Cách đều 3 đỉnh; Đường cao $\\to$ Trực tâm.'
    ],
    commonTraps: [
      'Nhầm điểm cách đều 3 cạnh (giao 3 phân giác) với điểm cách đều 3 đỉnh (giao 3 trung trực).'
    ],
    theory: [
      '1. Từ một điểm ngoài đường thẳng, đường vuông góc là đoạn ngắn nhất.',
      '2. Trong tam giác cân, 4 đường xuất phát từ đỉnh cân trùng làm một!'
    ],
    keyFormulas: [
      'AG = \\frac{2}{3}AM'
    ],
    flashcards: [
      { front: 'Giao điểm của ba đường trung trực có tính chất gì?', back: 'Cách đều ba đỉnh của tam giác (tâm đường tròn ngoại tiếp).' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_7,
        question: 'Trong $\\triangle ABC$, biết $AB = 5\\text{ cm}, BC = 7\\text{ cm}, AC = 4\\text{ cm}$. Góc nào lớn nhất?',
        options: ['A. $\\widehat{A}$', 'B. $\\widehat{B}$', 'C. $\\widehat{C}$', 'D. Không xác định'],
        correctIndex: 0,
        explanation: 'Cạnh $BC$ lớn nhất nên góc đối diện $\\widehat{A}$ lớn nhất.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_7,
        question: 'Cho tam giác $ABC$ có hai đường trung tuyến $BM, CN$ cắt nhau tại $G$. Biết $BM = 12\\text{ cm}$, tính $BG$ và $GM$.',
        hints: ['Trọng tâm $G$ chia trung tuyến theo tỉ lệ $2 : 1$.'],
        solutionSteps: [
          '$BG = \\frac{2}{3} BM = \\frac{2}{3}\\cdot 12 = 8\\text{ cm}$.',
          '$GM = 12 - 8 = 4\\text{ cm}$.'
        ],
        finalAnswer: '$BG = 8\\text{ cm}, GM = 4\\text{ cm}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'triangle_explorer',
    sim3dMode: 'geometric_transform_3d'
  },

  // ==========================================================================
  // GDPT 2006 — LỚP 8 (6 CHỦ ĐỀ THEO SGK TOÁN 8 2006)
  // ==========================================================================
  {
    id: 'math-2006-8-1',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 8',
    lessonNumber: 1,
    stageLabel: 'Toán 8 (SGK 2006) · Đại số Chương I',
    sourceTag: SRC_2006_8,
    title: 'Bài 1: Nhân chia đa thức, 7 Hằng đẳng thức & Phân tích đa thức thành nhân tử (SGK 2006)',
    grade: 'Lớp 8 · Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Nắm trọn Chương I Đại số 8 (2006): Nhân đơn/đa thức, 7 hằng đẳng thức, 4 phương pháp phân tích nhân tử (chung, HĐT, nhóm, tách hạng tử) và chia đa thức đã sắp xếp.',
    mnemonics: [
      '4 bước tách nhân tử: Chung $\\to$ Hằng đẳng thức $\\to$ Nhóm $\\to$ Tách hạng tử bậc 2.'
    ],
    commonTraps: [
      'Viết nhầm $(a - b)^3 = a^3 - 3a^2b - 3ab^2 - b^3$ (đúng phải là $+3ab^2$).'
    ],
    theory: [
      '1. Phân tích $x^2 + bx + c$ bằng tách hạng tử: tìm hai số có tổng $b$ và tích $c$. Ví dụ $x^2 - 5x + 6 = (x - 2)(x - 3)$.',
      '2. Chia đa thức $A$ cho đa thức $B$ tìm thương $Q$ và dư $R$ ($A = B\\cdot Q + R$).'
    ],
    keyFormulas: [
      '(A \\pm B)^3 = A^3 \\pm 3A^2B + 3AB^2 \\pm B^3',
      'A^3 \\pm B^3 = (A \\pm B)(A^2 \\mp AB + B^2)'
    ],
    flashcards: [
      { front: 'Phân tích $x^2 - 5x + 6$ thành nhân tử?', back: '$(x - 2)(x - 3)$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_8,
        question: 'Giá trị của biểu thức $x^3 + 3x^2 + 3x + 1$ tại $x = 9$ là:',
        options: ['A. $729$', 'B. $1000$', 'C. $800$', 'D. $100$'],
        correctIndex: 1,
        explanation: '$(x + 1)^3 = (9 + 1)^3 = 10^3 = 1000$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_8,
        question: 'Phân tích đa thức sau thành nhân tử: $x^2 - y^2 + 2x + 1$.',
        hints: ['Nhóm $(x^2 + 2x + 1) - y^2$.'],
        solutionSteps: [
          '$(x^2 + 2x + 1) - y^2 = (x + 1)^2 - y^2 = (x + 1 - y)(x + 1 + y)$.'
        ],
        finalAnswer: '$(x - y + 1)(x + y + 1)$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d'
  },
  {
    id: 'math-2006-8-2',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 8',
    lessonNumber: 2,
    stageLabel: 'Toán 8 (SGK 2006) · Đại số Chương II: Phân thức đại số',
    sourceTag: SRC_2006_8,
    title: 'Bài 2: Phân thức đại số, Quy đồng – Cộng trừ nhân chia & Rút gọn biểu thức hữu tỉ (SGK 2006)',
    grade: 'Lớp 8 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 15,
    description:
      'Làm chủ kỹ thuật biến đổi biểu thức hữu tỉ chuẩn đề kiểm tra học kì I Toán 8 (2006): tìm ĐKXĐ, rút gọn, tính giá trị và tìm $x$ nguyên để biểu thức nguyên.',
    mnemonics: [
      'Tìm $x \\in \\mathbb{Z}$ để $\\frac{k}{x - a} \\in \\mathbb{Z}$: cho $(x - a)$ thuộc tập ước của $k$!'
    ],
    commonTraps: [
      'Tính giá trị biểu thức tại giá trị $x$ vi phạm ĐKXĐ.'
    ],
    theory: [
      '1. Biến đổi biểu thức hữu tỉ: thực hiện trong ngoặc trước, chia đổi thành nhân nghịch đảo, rút gọn triệt để tử và mẫu.',
      '2. Sau khi rút gọn, kiểm tra lại điều kiện xác định của toàn bộ biểu thức gốc.'
    ],
    keyFormulas: [
      '\\frac{A}{B} : \\frac{C}{D} = \\frac{A}{B} \\cdot \\frac{D}{C} \\quad (B, C, D \\neq 0)'
    ],
    flashcards: [
      { front: 'Điều kiện xác định của $\\frac{x + 3}{x^2 - 9}$?', back: '$x^2 - 9 \\neq 0 \\iff x \\neq \\pm 3$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_8,
        question: 'Kết quả rút gọn biểu thức $\\frac{x^2 + 2x + 1}{x^2 - 1}$ ($x \\neq \\pm 1$) là:',
        options: ['A. $\\frac{x + 1}{x - 1}$', 'B. $\\frac{x - 1}{x + 1}$', 'C. $-1$', 'D. $\\frac{2x}{ -1}$'],
        correctIndex: 0,
        explanation: '$\\frac{(x+1)^2}{(x-1)(x+1)} = \\frac{x+1}{x-1}$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_8,
        question: 'Tìm tất cả các số nguyên $x$ để biểu thức $M = \\frac{3}{x - 1}$ nhận giá trị nguyên.',
        hints: ['$x - 1 \\in \\text{Ư}(3) = \\{\\pm 1; \\pm 3\\}$.'],
        solutionSteps: [
          '$x - 1 \\in \\{-3, -1, 1, 3\\} \\implies x \\in \\{-2, 0, 2, 4\\}$ (đều thỏa $x \\neq 1$).'
        ],
        finalAnswer: '$x \\in \\{-2; 0; 2; 4\\}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d'
  },
  {
    id: 'math-2006-8-3',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 8',
    lessonNumber: 3,
    stageLabel: 'Toán 8 (SGK 2006) · Đại số Chương III: Phương trình bậc nhất',
    sourceTag: SRC_2006_8,
    title: 'Bài 3: Phương trình bậc nhất một ẩn, PT tích & PT chứa ẩn ở mẫu (SGK 2006)',
    grade: 'Lớp 8 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 15,
    description:
      'Giải thành thạo 3 loại phương trình trọng tâm Toán 8 (2006): phương trình đưa về $ax + b = 0$, phương trình tích $A(x)B(x)=0$, phương trình chứa ẩn ở mẫu và giải bài toán lập PT.',
    mnemonics: [
      'PT chứa ẩn ở mẫu 4 bước: (1) ĐKXĐ $\\to$ (2) Quy đồng khử mẫu ($\Rightarrow$) $\\to$ (3) Giải PT $\\to$ (4) Đối chiếu ĐKXĐ loại nghiệm ngoại lai.'
    ],
    commonTraps: [
      'Quên đối chiếu ĐKXĐ ở bước cuối và nhận nhầm nghiệm làm mẫu bằng $0$.'
    ],
    theory: [
      '1. Phương trình bậc nhất $ax + b = 0$ ($a \\neq 0$) luôn có nghiệm duy nhất $x = -b/a$.',
      '2. Phương trình tích: đưa mọi hạng tử về một vế, phân tích thành nhân tử rồi cho từng nhân tử bằng $0$.'
    ],
    keyFormulas: [
      'A(x) \\cdot B(x) = 0 \\iff A(x) = 0 \\text{ hoặc } B(x) = 0'
    ],
    flashcards: [
      { front: 'Giải phương trình $(x - 3)(2x + 4) = 0$?', back: '$x = 3$ hoặc $x = -2$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_8,
        question: 'Số nghiệm của phương trình $\\frac{x^2 - 4}{x - 2} = 0$ là:',
        options: ['A. $0$', 'B. $1$ (chỉ $x = -2$)', 'C. $2$ ($x = \\pm 2$)', 'D. Vô số'],
        correctIndex: 1,
        explanation: 'ĐKXĐ: $x \\neq 2$. Tử $x^2 - 4 = 0 \\implies x = 2$ (loại) hoặc $x = -2$ (nhận).'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_8,
        question: 'Giải phương trình chứa ẩn ở mẫu: $\\frac{x + 1}{x - 2} = \\frac{3}{x - 2} + 1$.',
        hints: ['Tìm ĐKXĐ $x \\neq 2$, quy đồng khử mẫu.'],
        solutionSteps: [
          'ĐKXĐ: $x \\neq 2$.',
          'Khử mẫu: $x + 1 = 3 + (x - 2) \\iff x + 1 = x + 1$ (đúng với mọi $x \\neq 2$).',
          'Vậy tập nghiệm $S = \\mathbb{R} \\setminus \\{2\\}$.'
        ],
        finalAnswer: '$S = \\mathbb{R} \\setminus \\{2\\}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz'
  },
  {
    id: 'math-2006-8-4',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 8',
    lessonNumber: 4,
    stageLabel: 'Toán 8 (SGK 2006) · Đại số Chương IV: Bất phương trình',
    sourceTag: SRC_2006_8,
    title: 'Bài 4: Bất đẳng thức, Bất PT bậc nhất một ẩn & Phương trình dấu giá trị tuyệt đối (SGK 2006)',
    grade: 'Lớp 8 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 14,
    description:
      'Làm chủ quy tắc nhân/chia số âm đổi chiều bất đẳng thức, biểu diễn tập nghiệm trên trục số và giải phương trình dạng $|ax + b| = cx + d$.',
    mnemonics: [
      'Khi nhân/chia hai vế bất phương trình với SỐ ÂM $\\implies$ PHẢI ĐỔI CHIỀU!',
      'Giải $|A| = B$: xét 2 trường hợp $A \\ge 0$ (bỏ thẳng $|A| = A$) và $A < 0$ ($|A| = -A$), nhớ kiểm tra điều kiện từng trường hợp!'
    ],
    commonTraps: [
      'Chia cho số âm mà giữ nguyên chiều $>$ thành $>$ khiến sai sạch tập nghiệm.'
    ],
    theory: [
      '1. Bất phương trình bậc nhất một ẩn $ax + b > 0$ ($a \\neq 0$): chuyển vế giữ nguyên chiều; chia cho $a > 0$ giữ chiều; chia cho $a < 0$ đảo ngược chiều.',
      '2. Biểu diễn trên trục số: ngoặc tròn $()$ nếu là $<, >$; ngoặc vuông $[]$ nếu là $\\le, \\ge$.'
    ],
    keyFormulas: [
      'a < b \\text{ và } c < 0 \\implies a \\cdot c > b \\cdot c',
      '|A| = A \\text{ nếu } A \\ge 0; \\quad |A| = -A \\text{ nếu } A < 0'
    ],
    flashcards: [
      { front: 'Giải bất phương trình $-5x \\ge 15$?', back: 'Chia cho $-5 < 0$ (đổi chiều): $x \\le -3$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_8,
        question: 'Nghiệm của bất phương trình $-3x + 6 > 0$ là:',
        options: ['A. $x > 2$', 'B. $x < 2$', 'C. $x > -2$', 'D. $x < -2$'],
        correctIndex: 1,
        explanation: '$-3x > -6 \\implies x < 2$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_8,
        question: 'Giải phương trình: $|x - 2| = 3x - 4$.',
        hints: ['Đặt điều kiện $3x - 4 \\ge 0 \\iff x \\ge \\frac{4}{3}$, rồi giải $x - 2 = 3x - 4$ hoặc $x - 2 = -(3x - 4)$.'],
        solutionSteps: [
          'Điều kiện vế phải không âm: $3x - 4 \\ge 0 \\iff x \\ge \\frac{4}{3}$.',
          'TH1: $x - 2 = 3x - 4 \\implies 2x = 2 \\implies x = 1$ (loại vì $1 < 4/3$).',
          'TH2: $x - 2 = -3x + 4 \\implies 4x = 6 \\implies x = 1{,}5$ (nhận vì $1{,}5 \\ge 4/3$).'
        ],
        finalAnswer: '$x = 1{,}5$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz',
    defaultGraphConfig: { type: 'linear', params: { a: -3, b: 6, c: 0, d: 0 }, color: '#059669', name: 'y = -3x + 6' }
  },
  {
    id: 'math-2006-8-5',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 8',
    lessonNumber: 5,
    stageLabel: 'Toán 8 (SGK 2006) · Hình học Chương I & II: Tứ giác & Diện tích',
    sourceTag: SRC_2006_8,
    title: 'Bài 5: Tứ giác, Đối xứng trục/tâm, 5 Tứ giác đặc biệt & Diện tích đa giác (SGK 2006)',
    grade: 'Lớp 8 · Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 15,
    description:
      'Làm chủ trọn bộ Chương I & II Hình học 8 (2006): Đường trung bình tam giác/hình thang, dấu hiệu nhận biết hình bình hành – chữ nhật – thoi – vuông và công thức diện tích đa giác.',
    mnemonics: [
      'Đường trung bình hình thang: song song hai đáy và bằng NỬA TỔNG hai đáy ($MN = \\frac{AB+CD}{2}$).'
    ],
    commonTraps: [
      'Nhầm dấu hiệu hình chữ nhật (góc vuông / đường chéo bằng nhau) với hình thoi (cạnh kề bằng nhau / đường chéo vuông góc).'
    ],
    theory: [
      '1. Đường thẳng đi qua trung điểm 1 cạnh bên của hình thang và song song hai đáy thì đi qua trung điểm cạnh bên thứ hai.',
      '2. Diện tích hình chữ nhật $ab$, tam giác $\\frac{1}{2}ah$, hình thang $\\frac{(a+b)h}{2}$, hình thoi $\\frac{1}{2}d_1 d_2$.'
    ],
    keyFormulas: [
      'MN_{\\text{TB hình thang}} = \\frac{AB + CD}{2}'
    ],
    flashcards: [
      { front: 'Hình thang có hai đáy $10\\text{ cm}$ và $16\\text{ cm}$. Đường trung bình dài bao nhiêu?', back: '$(10 + 16)/2 = 13\\text{ cm}$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_8,
        question: 'Hình chữ nhật có hai cạnh kề bằng nhau là hình gì?',
        options: ['A. Hình thang cân', 'B. Hình thoi', 'C. Hình vuông', 'D. Hình bình hành'],
        correctIndex: 2,
        explanation: 'Hình chữ nhật có hai cạnh kề bằng nhau (hoặc 2 đường chéo vuông góc) là hình vuông.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_8,
        question: 'Cho tam giác $ABC$ vuông tại $A$ có $AB = 6\\text{ cm}, AC = 8\\text{ cm}$. Gọi $M$ là trung điểm cạnh huyền $BC$. Tính độ dài $AM$.',
        hints: ['Tính $BC$ bằng Py-ta-go rồi dùng định lí đường trung tuyến ứng với cạnh huyền $AM = \\frac{1}{2}BC$.'],
        solutionSteps: [
          '$BC = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$.',
          'Trong tam giác vuông, trung tuyến ứng cạnh huyền bằng nửa cạnh huyền: $AM = 10 : 2 = 5\\text{ cm}$.'
        ],
        finalAnswer: '$AM = 5\\text{ cm}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'pythagoras',
    sim3dMode: 'geometric_transform_3d'
  },
  {
    id: 'math-2006-8-6',
    track: 'gdpt_2006',
    gradeGroup: 'Lớp 8',
    lessonNumber: 6,
    stageLabel: 'Toán 8 (SGK 2006) · Hình học Chương III & IV: Đồng dạng & Lăng trụ – Chóp',
    sourceTag: SRC_2006_8,
    title: 'Bài 6: Định lí Ta-lét, Tam giác đồng dạng & Hình lăng trụ đứng – Hình chóp đều (SGK 2006)',
    grade: 'Lớp 8 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description:
      'Làm chủ Định lí Ta-lét thuận–đảo, tính chất đường phân giác, 3 trường hợp đồng dạng + đồng dạng tam giác vuông và hình lăng trụ đứng – hình chóp đều (SGK Hình 8 2006).',
    mnemonics: [
      'Đường phân giác $AD$ trong $\\triangle ABC$: $\\frac{DB}{DC} = \\frac{AB}{AC}$.',
      'Lăng trụ đứng: $V = S_{\\text{đáy}} \\cdot h$; Hình chóp: $V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h$.'
    ],
    commonTraps: [
      'Quên viết tỉ số đồng dạng theo đúng cặp đỉnh tương ứng.'
    ],
    theory: [
      '1. Tam giác vuông có một cặp góc nhọn bằng nhau thì đồng dạng (g.g), hoặc tỉ số cạnh huyền–cạnh góc vuông bằng nhau thì đồng dạng.',
      '2. Hình lăng trụ đứng và hình chóp đều là cầu nối trực quan sang Hình học Không gian THPT.'
    ],
    keyFormulas: [
      '\\frac{DB}{DC} = \\frac{AB}{AC}',
      'V_{\\text{lăng trụ}} = S_{\\text{đáy}}\\cdot h, \\quad V_{\\text{chóp}} = \\frac{1}{3} S_{\\text{đáy}}\\cdot h'
    ],
    flashcards: [
      { front: 'Nếu $\\triangle A\'B\'C\' \\sim \\triangle ABC$ theo tỉ số $k = 2$, tỉ số diện tích bằng bao nhiêu?', back: '$k^2 = 4$.' }
    ],
    sampleProblems: [
      {
        source: SRC_2006_8,
        question: 'Cho $\\triangle ABC$ có $AD$ là phân giác trong ($D \\in BC$). Biết $AB = 6, AC = 9, DB = 4$. Độ dài $DC$ bằng:',
        options: ['A. $5$', 'B. $6$', 'C. $8$', 'D. $4$'],
        correctIndex: 1,
        explanation: '$\\frac{DB}{DC} = \\frac{AB}{AC} \\implies \\frac{4}{DC} = \\frac{6}{9} = \\frac{2}{3} \\implies DC = 6$.'
      }
    ],
    essayProblems: [
      {
        source: SRC_2006_8,
        question: 'Một hình chóp tứ giác đều có đáy cạnh $10\\text{ cm}$ và chiều cao $12\\text{ cm}$. Tính thể tích hình chóp.',
        hints: ['$V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h$.'],
        solutionSteps: [
          '$S_{\\text{đáy}} = 10^2 = 100\\text{ cm}^2$.',
          '$V = \\frac{1}{3} \\cdot 100 \\cdot 12 = 400\\text{ cm}^3$.'
        ],
        finalAnswer: '$400\\text{ cm}^3$.'
      }
    ],
    sim2dMode: 'geometry',
    sim2dPreset: 'spatial_pyramid',
    sim3dMode: 'solid_prism_nets_3d'
  }
];
