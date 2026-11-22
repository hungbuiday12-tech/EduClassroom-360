import {
  MathLecture,
  PhysicsExperiment,
  CodingProblem,
} from '../types';
import { CHUYEN_MATH_LECTURES, MATH_METADATA_AND_ESSAYS } from './mathChuyenData';
import { MATH_GDPT_10_LESSONS } from './mathGdpt2018Grade10';
import { MATH_GDPT_11_LESSONS } from './mathGdpt2018Grade11';
import { MATH_GDPT_12_LESSONS } from './mathGdpt2018Grade12';
import { MATH_GDPT_ELECTIVES } from './mathGdpt2018Electives';
import { MATH_EXTRA_10_LESSONS } from './mathExtra10Lessons';
export { PHYSICS_LESSONS } from './physicsLessonsData';
export { CS_LESSONS } from './csLessonsData';


const BASE_MATH_LECTURES: MathLecture[] = [
  // ==========================================
  // LỚP 9: HÀM SỐ & HÌNH HỌC PHẲNG
  // ==========================================
  {
    id: 'math-9-1',
    title: 'Hàm số bậc nhất y = ax + b & Vị trí tương đối hai đường thẳng',
    grade: 'Lớp 9 - Đại số',
    category: 'Đại số',
    difficulty: 'Cơ bản',
    readTimeMinutes: 7,
    description: 'Nắm vững hệ số góc a, tung độ gốc b, hàm số đồng biến khi a > 0, nghịch biến khi a < 0, và điều kiện song song, vuông góc giữa 2 đường thẳng.',
    mnemonics: [
      'a > 0: Hàm số đồng biến (đồ thị dốc lên từ trái sang phải).',
      'a < 0: Hàm số nghịch biến (đồ thị dốc xuống từ trái sang phải).',
      'Song song: a = a\', b ≠ b\'. Trùng nhau: a = a\', b = b\'. Cắt nhau: a ≠ a\'. Vuông góc: a · a\' = -1.'
    ],
    commonTraps: [
      'Quên điều kiện a ≠ 0 để hàm số là bậc nhất.',
      'Nhầm lẫn giữa điều kiện song song (b ≠ b\') và cắt nhau.'
    ],
    theory: [
      '1. Định nghĩa: Hàm số bậc nhất có dạng $y = ax + b$ ($a \\neq 0$).',
      '2. Tính chất biến thiên: Xác định trên toàn R. Nếu $a > 0$: đồng biến; Nếu $a < 0$: nghịch biến.',
      '3. Đồ thị: Là một đường thẳng đi qua 2 điểm $(0; b)$ và $(-b/a; 0)$.',
      '4. Hệ số góc: $a = \\tan \\alpha$, trong đó $\\alpha$ là góc tạo bởi tia Ox và đường thẳng.',
      '5. Vị trí tương đối của $d_1: y = a_1 x + b_1$ và $d_2: y = a_2 x + b_2$:',
      '   - $d_1 // d_2 \\Leftrightarrow a_1 = a_2$ và $b_1 \\neq b_2$.',
      '   - $d_1 \\equiv d_2 \\Leftrightarrow a_1 = a_2$ và $b_1 = b_2$.',
      '   - $d_1 \\perp d_2 \\Leftrightarrow a_1 \\cdot a_2 = -1$.'
    ],
    keyFormulas: [
      'y = ax + b \\quad (a \\neq 0)',
      'a = \\tan \\alpha \\quad (\\text{Hệ số góc})',
      'd_1 \\parallel d_2 \\iff a_1 = a_2 \\land b_1 \\neq b_2',
      'd_1 \\perp d_2 \\iff a_1 \\cdot a_2 = -1'
    ],
    flashcards: [
      {
        front: 'Hai đường thẳng y = ax + b và y = a\'x + b\' vuông góc khi nào?',
        back: 'Khi và chỉ khi tích hai hệ số góc bằng -1: a · a\' = -1.',
        tip: 'Ví dụ: y = 2x + 1 vuông góc với y = -0.5x + 3.'
      }
    ],
    sampleProblems: [
      {
        question: 'Đường thẳng d: y = (m - 2)x + 3 song song với đường thẳng d\': y = 4x - 1 khi:',
        options: ['A. m = 6', 'B. m = 2', 'C. m = -2', 'D. m = 4'],
        correctIndex: 0,
        explanation: 'Để d // d\' thì a = a\' và b ≠ b\'. Ta có m - 2 = 4 <=> m = 6, và 3 ≠ -1 (luôn đúng). Vậy m = 6.'
      }
    ],
    defaultGraphConfig: {
      type: 'linear',
      params: { a: 2, b: -3, c: 0, d: 0 },
      color: '#4f46e5',
      name: 'y = 2x - 3'
    },
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz'
  },
  {
    id: 'math-9-2',
    title: 'Hàm số bậc hai y = ax² & Phương trình bậc hai / Định lý Vi-ét',
    grade: 'Lớp 9 - Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 8,
    description: 'Khảo sát hình dạng Parabol đối xứng qua trục tung Oy, đỉnh O(0; 0), công thức nghiệm delta và định lý Vi-ét giải quyết hệ thức đối xứng.',
    mnemonics: [
      'a > 0: Bề lõm hướng lên trên, O(0; 0) là điểm cực tiểu.',
      'a < 0: Bề lõm hướng xuống dưới, O(0; 0) là điểm cực đại.',
      'Định lý Vi-ét: Tổng S = -b/a, Tích P = c/a.'
    ],
    commonTraps: [
      'Quên kiểm tra điều kiện Δ ≥ 0 trước khi áp dụng định lý Vi-ét.',
      'Nhầm lẫn dấu của tổng S: S = -b/a chứ không phải b/a.'
    ],
    theory: [
      '1. Hàm số $y = ax^2$ ($a \\neq 0$): Xác định trên R. Nhận Oy làm trục đối xứng.',
      '2. Phương trình bậc hai $ax^2 + bx + c = 0$ ($a \\neq 0$): Biệt thức $\\Delta = b^2 - 4ac$.',
      '3. Nếu $\\Delta > 0$: có 2 nghiệm phân biệt $x_{1, 2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$.',
      '4. Định lý Vi-ét: Nếu phương trình có 2 nghiệm $x_1, x_2$ thì $x_1 + x_2 = -\\frac{b}{a}$, $x_1 x_2 = \\frac{c}{a}$.',
      '5. Các hệ thức thường gặp: $x_1^2 + x_2^2 = S^2 - 2P$; $\\frac{1}{x_1} + \\frac{1}{x_2} = \\frac{S}{P}$; $|x_1 - x_2| = \\frac{\\sqrt{\\Delta}}{|a|}$.'
    ],
    keyFormulas: [
      'y = ax^2 \\quad (a \\neq 0)',
      '\\Delta = b^2 - 4ac',
      'S = x_1 + x_2 = -\\frac{b}{a}',
      'P = x_1 x_2 = \\frac{c}{a}',
      'x_1^2 + x_2^2 = S^2 - 2P'
    ],
    flashcards: [
      {
        front: 'Công thức biểu diễn x₁² + x₂² theo S và P trong định lý Vi-ét?',
        back: 'x₁² + x₂² = (x₁ + x₂)² - 2x₁x₂ = S² - 2P.',
        tip: 'Luôn biến đổi về tổng và tích để thay S và P.'
      }
    ],
    sampleProblems: [
      {
        question: 'Cho phương trình $x^2 - 5x + 6 = 0$. Giá trị biểu thức $A = x_1^2 + x_2^2$ là:',
        options: ['A. 13', 'B. 25', 'C. 19', 'D. 37'],
        correctIndex: 0,
        explanation: 'Theo Vi-ét: S = 5, P = 6. Suy ra A = S² - 2P = 5² - 2·6 = 25 - 12 = 13.'
      }
    ],
    defaultGraphConfig: {
      type: 'quadratic',
      params: { a: 1, b: 0, c: 0, d: 0 },
      color: '#0ea5e9',
      name: 'y = x²'
    },
    sim2dMode: 'grapher',
    sim3dMode: 'conic_sections_3d'
  },
  {
    id: 'math-9-3',
    title: 'Hệ thức lượng trong Tam giác vuông & Góc với Đường tròn',
    grade: 'Lớp 9 - Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 10,
    description: 'Tổng hợp 5 hệ thức lượng trong tam giác vuông, tỉ số lượng giác sin-cos-tan, tính chất hai tiếp tuyến cắt nhau và các loại góc với đường tròn.',
    mnemonics: [
      'Cạnh góc vuông bình phương = Cạnh huyền × Hình chiếu.',
      'Đường cao bình phương = Tích hai hình chiếu: $h^2 = b\' \\cdot c\'$.',
      'Sin đi học (Đối/Huyền), Cos không hư (Kề/Huyền), Tan đoàn kết (Đối/Kề), Cot kết đoàn (Kề/Đối).',
      'Góc nội tiếp chắn nửa đường tròn luôn bằng $90^\\circ$.'
    ],
    commonTraps: [
      'Nhầm góc nội tiếp bằng số đo cung bị chắn (đúng phải bằng NỬA số đo cung bị chắn).',
      'Quên chứng minh góc vuông tại tiếp điểm $OT \\perp d$ trước khi áp dụng định lý Pytago.'
    ],
    theory: [
      '1. Trong $\\triangle ABC$ vuông tại $A$ (cạnh huyền $BC = a$, hai cạnh góc vuông $AC = b, AB = c$, đường cao $AH = h$, hình chiếu $BH = c\'$ của $AB$ và $CH = b\'$ của $AC$ lên $BC$): $b^2 = a \\cdot b\'$, $c^2 = a \\cdot c\'$, $h^2 = b\' \\cdot c\'$, $a \\cdot h = b \\cdot c$, $\\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}$.',
      '2. Tỉ số lượng giác góc nhọn $\\alpha$: $\\sin^2 \\alpha + \\cos^2 \\alpha = 1$, $\\tan \\alpha \\cdot \\cot \\alpha = 1$.',
      '3. Góc ở tâm có số đo bằng số đo cung bị chắn; góc nội tiếp và góc tạo bởi tia tiếp tuyến và dây cung cùng chắn một cung thì bằng nhau và bằng nửa số đo cung đó.',
      '4. Tứ giác nội tiếp đường tròn khi và chỉ khi tổng hai góc đối bằng $180^\\circ$ hoặc hai đỉnh kề nhau cùng nhìn một cạnh dưới hai góc bằng nhau.'
    ],
    keyFormulas: [
      'h^2 = b\' \\cdot c\', \\quad \\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}',
      '\\sin^2 \\alpha + \\cos^2 \\alpha = 1',
      '\\widehat{ACB} = \\frac{1}{2} \\text{sđ}\\overset{\\frown}{AB} \\quad (\\text{Góc nội tiếp})'
    ],
    flashcards: [
      {
        front: 'Tính chất hai tiếp tuyến cắt nhau PA và PB của đường tròn (O)?',
        back: 'PA = PB; PO là phân giác góc APB; OP là phân giác góc AOB.',
        tip: 'Bốn điểm P, A, O, B luôn cùng nằm trên một đường tròn đường kính OP.'
      }
    ],
    sampleProblems: [
      {
        question: 'Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Biết $BH = 4\\text{ cm}$, $CH = 9\\text{ cm}$. Độ dài đường cao $AH$ bằng:',
        options: ['A. 6 cm', 'B. 6.5 cm', 'C. 5 cm', 'D. 36 cm'],
        correctIndex: 0,
        explanation: 'Áp dụng hệ thức lượng: $AH^2 = BH \\cdot CH = 4 \\cdot 9 = 36 \\implies AH = 6\\text{ cm}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  },
  // ==========================================
  // BỔ SUNG CHUYÊN SÂU LỚP 9 (GDPT 2018 & THI VÀO 10)
  // ==========================================
  {
    id: 'math-9-4',
    title: 'Căn bậc hai, Căn bậc ba & Kỹ thuật Rút gọn Biểu thức thi vào 10',
    grade: 'Lớp 9 - Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 10,
    description: 'Làm chủ hằng đẳng thức $\\sqrt{A^2} = |A|$, trục căn thức ở mẫu, tìm điều kiện xác định và dạng bài rút gọn kết hợp tìm GTLN/GTNN hoặc giá trị nguyên trong đề tuyển sinh lớp 10.',
    mnemonics: [
      'Luôn đặt ĐKXĐ đầu tiên: biểu thức trong căn $\\ge 0$ và mẫu số $\\neq 0$.',
      '$\\sqrt{A^2} = |A|$: phá dấu giá trị tuyệt đối phải xét âm hay dương, không tự ý bỏ dấu!',
      'Trục căn ở mẫu: nhân cả tử và mẫu với biểu thức liên hợp ($\\sqrt{a} - \\sqrt{b}$ ↔ $\\sqrt{a} + \\sqrt{b}$).'
    ],
    commonTraps: [
      'Quên đối chiếu nghiệm $x$ tìm được với Điều kiện xác định ban đầu.',
      'Nhầm lẫn $\\sqrt{a + b} = \\sqrt{a} + \\sqrt{b}$ (SAI hoàn toàn!).'
    ],
    theory: [
      '1. Điều kiện xác định: $\\sqrt{A}$ xác định khi và chỉ khi $A \\ge 0$. $\\frac{1}{\\sqrt{A}}$ xác định khi $A > 0$.',
      '2. Các phép biến đổi căn thức: $\\sqrt{A^2 B} = |A|\\sqrt{B}$ ($B \\ge 0$); $\\sqrt{\\frac{A}{B}} = \\frac{\\sqrt{AB}}{|B|}$ ($AB \\ge 0, B \\neq 0$).',
      '3. Trục căn thức ở mẫu: $\\frac{m}{\\sqrt{A} \\pm \\sqrt{B}} = \\frac{m(\\sqrt{A} \\mp \\sqrt{B})}{A - B}$ với $A, B \\ge 0$ và $A \\neq B$.',
      '4. Bất đẳng thức Cô-si (AM-GM) áp dụng tìm cực trị: Với $a, b \\ge 0$, luôn có $a + b \\ge 2\\sqrt{ab}$, dấu "=" xảy ra khi $a = b$.',
      '5. Căn bậc ba: $\\sqrt[3]{A^3} = A$ với mọi $A \\in R$ (không cần điều kiện $A \\ge 0$).'
    ],
    keyFormulas: [
      '\\sqrt{A^2} = |A|',
      '\\frac{1}{\\sqrt{A} - \\sqrt{B}} = \\frac{\\sqrt{A} + \\sqrt{B}}{A - B}',
      'a + b \\ge 2\\sqrt{ab} \\quad (a, b \\ge 0)',
      '\\sqrt[3]{A^3} = A \\quad (\\forall A \\in \\mathbb{R})'
    ],
    flashcards: [
      {
        front: 'Biểu thức $\\frac{\\sqrt{x}}{\\sqrt{x} - 2}$ có điều kiện xác định là gì?',
        back: '$x \\ge 0$ và $\\sqrt{x} - 2 \\neq 0 \\iff x \\ge 0, x \\neq 4$.',
        tip: 'Nhớ kiểm tra cả căn thức lẫn mẫu thức!'
      },
      {
        front: 'Rút gọn $\\sqrt{(2 - \\sqrt{5})^2}$ cho kết quả bằng bao nhiêu?',
        back: '$|2 - \\sqrt{5}| = \\sqrt{5} - 2$ (vì $2 = \\sqrt{4} < \\sqrt{5}$ nên $2 - \\sqrt{5} < 0$).',
        tip: 'Bình phương so sánh $2^2 = 4 < 5$ trước khi phá trị tuyệt đối.'
      }
    ],
    sampleProblems: [
      {
        question: 'Giá trị rút gọn của biểu thức $P = \\sqrt{12} + 2\\sqrt{27} - \\frac{6}{\\sqrt{3}}$ là:',
        options: ['A. $6\\sqrt{3}$', 'B. $8\\sqrt{3}$', 'C. $4\\sqrt{3}$', 'D. $10\\sqrt{3}$'],
        correctIndex: 0,
        explanation: 'Ta có $\\sqrt{12} = 2\\sqrt{3}$, $2\\sqrt{27} = 6\\sqrt{3}$, $\\frac{6}{\\sqrt{3}} = 2\\sqrt{3}$. Vậy $P = 2\\sqrt{3} + 6\\sqrt{3} - 2\\sqrt{3} = 6\\sqrt{3}$.'
      },
      {
        question: 'Với $x > 0$, giá trị nhỏ nhất của biểu thức $Q = \\sqrt{x} + \\frac{4}{\\sqrt{x}}$ là:',
        options: ['A. 4', 'B. 2', 'C. 8', 'D. 1'],
        correctIndex: 0,
        explanation: 'Áp dụng BĐT AM-GM cho 2 số dương $\\sqrt{x}$ và $\\frac{4}{\\sqrt{x}}$: $Q \\ge 2\\sqrt{\\sqrt{x} \\cdot \\frac{4}{\\sqrt{x}}} = 2 \\cdot 2 = 4$. Dấu "=" xảy ra khi $\\sqrt{x} = \\frac{4}{\\sqrt{x}} \\iff x = 4$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    defaultGraphConfig: {
      type: 'sqrt',
      params: { a: 1, b: 1, c: 0, d: 0 },
      color: '#4f46e5',
      name: 'y = √x'
    }
  },
  {
    id: 'math-9-5',
    title: 'Hệ Phương Trình Bậc Nhất Hai Ẩn & Giải Bài Toán Thực Tế',
    grade: 'Lớp 9 - Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 9,
    description: 'Phương pháp thế, cộng đại số giải hệ $\\begin{cases} ax + by = c \\\\ a\'x + b\'y = c\' \\end{cases}$, biện luận nghiệm theo tham số $m$ và mô hình hóa bài toán chuyển động, năng suất vào 10.',
    mnemonics: [
      'Cắt nhau (1 nghiệm duy nhất): $\\frac{a}{a\'} \\neq \\frac{b}{b\'}$.',
      'Song song (vô nghiệm): $\\frac{a}{a\'} = \\frac{b}{b\'} \\neq \\frac{c}{c\'}$. Trùng nhau (vô số nghiệm): $\\frac{a}{a\'} = \\frac{b}{b\'} = \\frac{c}{c\'}$.',
      'Bài toán làm chung công việc: Năng suất 1 ngày = $1 / \\text{Tổng số ngày}$.'
    ],
    commonTraps: [
      'Đặt ẩn mà quên ghi đơn vị và điều kiện thực tế ($x > 0$, nguyên dương, hoặc $v_{thuyen} > v_{nuoc}$).',
      'Bài toán phần trăm tăng/giảm quên cộng 100%: tăng $15\\%$ nghĩa là nhân $1{,}15$.'
    ],
    theory: [
      '1. Phương pháp thế: Rút một ẩn từ phương trình (1) rồi thế vào phương trình (2) để đưa về phương trình 1 ẩn.',
      '2. Phương pháp cộng đại số: Nhân hai vế với hệ số thích hợp sao cho hệ số của cùng một ẩn bằng nhau hoặc đối nhau rồi cộng/trừ từng vế.',
      '3. Ý nghĩa hình học: Nghiệm của hệ chính là tọa độ giao điểm của hai đường thẳng $d_1: ax + by = c$ và $d_2: a\'x + b\'y = c\'$.',
      '4. Công thức các bài toán thực tế hay gặp: Chuyển động ($S = v \\cdot t$, xuôi dòng $v = v_t + v_n$, ngược dòng $v = v_t - v_n$); Năng suất ($A = N \\cdot t$).'
    ],
    keyFormulas: [
      '\\frac{a}{a\'} \\neq \\frac{b}{b\'} \\implies \\text{Hệ có nghiệm duy nhất}',
      '\\frac{a}{a\'} = \\frac{b}{b\'} \\neq \\frac{c}{c\'} \\implies \\text{Hệ vô nghiệm}',
      'v_{xuoi} = v_{thuc} + v_{nuoc}, \\quad v_{nguoc} = v_{thuc} - v_{nuoc}',
      '\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{T_{chung}}'
    ],
    flashcards: [
      {
        front: 'Hai vòi nước cùng chảy vào một bể thì đầy sau 6 giờ. Nếu gọi thời gian vòi 1, vòi 2 chảy một mình đầy bể lần lượt là $x, y$ (giờ), ta có phương trình nào?',
        back: '$\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{6}$ (với $x, y > 6$).',
        tip: 'Mỗi giờ vòi 1 chảy được $\\frac{1}{x}$ bể, vòi 2 chảy được $\\frac{1}{y}$ bể.'
      }
    ],
    sampleProblems: [
      {
        question: 'Nghiệm của hệ phương trình $\\begin{cases} 2x + y = 5 \\\\ x - y = 1 \\end{cases}$ là:',
        options: ['A. $(2; 1)$', 'B. $(1; 3)$', 'C. $(3; -1)$', 'D. $(2; 3)$'],
        correctIndex: 0,
        explanation: 'Cộng hai phương trình vế theo vế ta được $3x = 6 \\implies x = 2$. Thay $x = 2$ vào phương trình thứ hai: $2 - y = 1 \\implies y = 1$. Vậy nghiệm là $(2; 1)$.'
      },
      {
        question: 'Một ca nô chạy xuôi dòng 30 km rồi chạy ngược dòng 18 km hết tổng cộng 2 giờ. Biết vận tốc dòng nước là $3\\text{ km/h}$. Nếu gọi vận tốc thực của ca nô là $x$ ($x > 3$), phương trình đúng là:',
        options: [
          'A. $\\frac{30}{x + 3} + \\frac{18}{x - 3} = 2$',
          'B. $\\frac{30}{x - 3} + \\frac{18}{x + 3} = 2$',
          'C. $\\frac{30}{x} + \\frac{18}{x} = 2$',
          'D. $30(x+3) + 18(x-3) = 2$'
        ],
        correctIndex: 0,
        explanation: 'Vận tốc xuôi dòng là $x + 3$ (km/h), vận tốc ngược dòng là $x - 3$ (km/h). Tổng thời gian là $\\frac{30}{x+3} + \\frac{18}{x-3} = 2$.'
      }
    ],
    defaultGraphConfig: {
      type: 'linear',
      params: { a: -2, b: 5, c: 0, d: 0 },
      color: '#10b981',
      name: 'y = -2x + 5'
    },
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz'
  },
  {
    id: 'math-9-6',
    title: 'Tứ giác Nội tiếp Đường tròn & Các Dấu hiệu Nhận biết Kinh điển',
    grade: 'Lớp 9 - Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 12,
    description: 'Tổng hợp 4 dấu hiệu chứng minh tứ giác nội tiếp, góc nội tiếp - góc tạo bởi tia tiếp tuyến và dây cung, đồng quy - thẳng hàng và bài toán hình học câu c đề thi vào lớp 10.',
    mnemonics: [
      'Dấu hiệu 1 (hay dùng nhất): Tổng 2 góc đối diện bằng $180^\\circ$ (đặc biệt là 2 góc vuông đối nhau).',
      'Dấu hiệu 2: Hai đỉnh kề nhau cùng nhìn cạnh chứa 2 đỉnh còn lại dưới một góc $\\alpha$ bằng nhau.',
      'Dấu hiệu 3: Góc ngoài tại một đỉnh bằng góc trong tại đỉnh đối diện.'
    ],
    commonTraps: [
      'Quên chỉ rõ tên đường kính khi kết luận tâm đường tròn ngoại tiếp tứ giác có hai góc vuông đối nhau.',
      'Nhầm lẫn vị trí hai đỉnh "kề nhau" và "đối nhau" trong dấu hiệu cùng nhìn một đoạn thẳng.'
    ],
    theory: [
      '1. Định nghĩa: Tứ giác có bốn đỉnh cùng nằm trên một đường tròn gọi là tứ giác nội tiếp đường tròn đó.',
      '2. Định lý thuận & đảo: Trong một tứ giác nội tiếp, tổng số đo hai góc đối diện bằng $180^\\circ$. Ngược lại, nếu tứ giác có tổng hai góc đối bằng $180^\\circ$ thì tứ giác đó nội tiếp được đường tròn.',
      '3. Dấu hiệu 2 đỉnh kề cùng nhìn 1 cạnh: Tứ giác $ABCD$ có $\\widehat{DAC} = \\widehat{DBC}$ (cùng nằm về một phía đối với $CD$) thì $ABCD$ nội tiếp.',
      '4. Công thức góc liên hệ với đường tròn: Góc nội tiếp = $\\frac{1}{2}$ sđ cung bị chắn; Góc tạo bởi tia tiếp tuyến và dây cung = $\\frac{1}{2}$ sđ cung bị chắn (bằng góc nội tiếp cùng chắn một cung).',
      '5. Phương tích đường tròn: Hai dây $AB, CD$ cắt nhau tại $M$ cho $MA \\cdot MB = MC \\cdot MD$. Cát tuyến $MAB$ và tiếp tuyến $MT$ cho $MT^2 = MA \\cdot MB$.'
    ],
    keyFormulas: [
      '\\widehat{A} + \\widehat{C} = \\widehat{B} + \\widehat{D} = 180^\\circ',
      '\\widehat{DAC} = \\widehat{DBC} \\implies ABCD \\text{ nội tiếp}',
      'MT^2 = MA \\cdot MB \\quad (\\text{Tiếp tuyến - Cát tuyến})',
      'MA \\cdot MB = MC \\cdot MD'
    ],
    flashcards: [
      {
        front: 'Trong $\\triangle ABC$ nhọn có hai đường cao $BE$ và $CF$ cắt nhau tại $H$. Những tứ giác nào nội tiếp?',
        back: 'Tứ giác $AEHF$ nội tiếp (vì $\\widehat{AEH} + \\widehat{AFH} = 90^\\circ + 90^\\circ = 180^\\circ$) và tứ giác $BFEC$ nội tiếp (vì $\\widehat{BFC} = \\widehat{BEC} = 90^\\circ$ cùng nhìn cạnh $BC$).',
        tip: 'Đây là cấu hình kinh điển xuất hiện trong hơn 80% đề thi tuyển sinh lớp 10!'
      }
    ],
    sampleProblems: [
      {
        question: 'Cho tứ giác $ABCD$ nội tiếp đường tròn tâm $O$. Biết $\\widehat{ABC} = 105^\\circ$. Số đo góc $\\widehat{ADC}$ bằng:',
        options: ['A. $75^\\circ$', 'B. $105^\\circ$', 'C. $90^\\circ$', 'D. $85^\\circ$'],
        correctIndex: 0,
        explanation: 'Vì $ABCD$ nội tiếp đường tròn nên hai góc đối diện bù nhau: $\\widehat{ABC} + \\widehat{ADC} = 180^\\circ \\implies \\widehat{ADC} = 180^\\circ - 105^\\circ = 75^\\circ$.'
      },
      {
        question: 'Từ điểm $M$ nằm ngoài $(O)$, vẽ tiếp tuyến $MT$ và cát tuyến $MAB$ sao cho $MA = 4\\text{ cm}$, $AB = 5\\text{ cm}$. Độ dài đoạn tiếp tuyến $MT$ là:',
        options: ['A. $6\\text{ cm}$', 'B. $2\\sqrt{5}\\text{ cm}$', 'C. $3\\text{ cm}$', 'D. $9\\text{ cm}$'],
        correctIndex: 0,
        explanation: 'Ta có $MB = MA + AB = 4 + 5 = 9\\text{ cm}$. Xét $\\triangle MTA \\sim \\triangle MBT \\implies MT^2 = MA \\cdot MB = 4 \\cdot 9 = 36 \\implies MT = 6\\text{ cm}$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  },
  {
    id: 'math-9-7',
    title: 'Thống kê Tần số Ghép nhóm & Xác suất Thực nghiệm (CT Mới Lớp 9)',
    grade: 'Lớp 9 - Đại số & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Cơ bản',
    readTimeMinutes: 8,
    description: 'Bảng tần số, tần số tương đối, biểu đồ tần số ghép nhóm $[a_i; a_{i+1})$ và tính xác suất biến cố ngẫu nhiên bằng mô hình không gian mẫu (GDPT 2018).',
    mnemonics: [
      'Tổng tất cả tần số tương đối luôn bằng $100\\%$ (hoặc $1$).',
      'Số đo góc cung tròn biểu diễn nhóm thứ $i$ trên biểu đồ quạt: $\\alpha_i = f_i \\cdot 360^\\circ$.',
      'Xác suất biến cố $A$: $P(A) = \\frac{n(A)}{n(\\Omega)}$, luôn nằm trong đoạn $[0; 1]$.'
    ],
    commonTraps: [
      'Nhầm giữa Tần số ($n_i$, số lần xuất hiện) và Tần số tương đối ($f_i = \\frac{n_i}{N} \\cdot 100\\%$).',
      'Đếm thiếu phần tử của không gian mẫu $\\Omega$ trong bài toán tung đồng xu, gieo xúc xắc 2 lần.'
    ],
    theory: [
      '1. Tần số và Tần số tương đối: Với mẫu dữ liệu cỡ $N$, giá trị $x_i$ xuất hiện $n_i$ lần có tần số tương đối là $f_i = \\frac{n_i}{N} \\cdot 100\\%$.',
      '2. Bảng tần số ghép nhóm: Dữ liệu liên tục được chia thành các nửa khoảng $[a_1; a_2), [a_2; a_3), \\dots$ với độ rộng nhóm $d = a_{i+1} - a_i$.',
      '3. Phép thử ngẫu nhiên & Không gian mẫu $\\Omega$: Tập hợp tất cả các kết quả có thể xảy ra của phép thử.',
      '4. Công thức xác suất đồng khả năng: Nếu mọi kết quả trong $\\Omega$ đều có cùng khả năng xảy ra thì $P(A) = \\frac{n(A)}{n(\\Omega)}$.'
    ],
    keyFormulas: [
      'f_i = \\frac{n_i}{N} \\cdot 100\\%, \\quad \\sum f_i = 100\\%',
      '\\alpha_i = f_i \\cdot 360^\\circ',
      'P(A) = \\frac{n(A)}{n(\\Omega)}, \\quad 0 \\le P(A) \\le 1'
    ],
    flashcards: [
      {
        front: 'Một lớp học có 40 học sinh, trong đó có 10 học sinh đạt điểm Giỏi. Tần số tương đối và góc hình quạt tương ứng là?',
        back: 'Tần số tương đối $f = \\frac{10}{40} = 25\\%$. Góc quạt tròn $\\alpha = 25\\% \\cdot 360^\\circ = 90^\\circ$.',
        tip: 'Mỗi $1\\%$ ứng với $3{,}6^\\circ$ trên biểu đồ hình quạt tròn.'
      }
    ],
    sampleProblems: [
      {
        question: 'Gieo một con xúc xắc cân đối đồng chất một lần. Xác suất để mặt xuất hiện có số chấm là số nguyên tố bằng:',
        options: ['A. $\\frac{1}{2}$', 'B. $\\frac{1}{3}$', 'C. $\\frac{2}{3}$', 'D. $\\frac{1}{6}$'],
        correctIndex: 0,
        explanation: 'Không gian mẫu $\\Omega = \\{1, 2, 3, 4, 5, 6\\}$ có $n(\\Omega) = 6$. Các số nguyên tố từ 1 đến 6 là $\\{2, 3, 5\\}$ (lưu ý số 1 không phải số nguyên tố). Vậy $P = \\frac{3}{6} = \\frac{1}{2}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: {
      type: 'custom',
      customExpr: '2.5 * e^(-0.5 * x * x)',
      params: { a: 2.5, b: 1, c: 0, d: 0 },
      color: '#8b5cf6',
      name: 'Phân phối tần số & xác suất'
    }
  },
  // ==========================================
  // BỔ SUNG CHUYÊN SÂU LỚP 9 (GDPT 2018)
  // ==========================================
  {
    id: 'math-9-8',
    title: 'Hình học Trực quan Lớp 9: Hình Trụ, Hình Nón & Hình Cầu',
    grade: 'Lớp 9 - Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 9,
    description: 'Kiến thức trọng tâm VietJack Toán 9 GDPT 2018: nhận diện đường sinh, bán kính đáy, trục đối xứng cùng công thức tính diện tích xung quanh, diện tích toàn phần và thể tích Hình trụ – Hình nón – Hình cầu kèm mô phỏng 3D trực quan.',
    mnemonics: [
      'Hình trụ tạo bởi hình chữ nhật quay quanh một cạnh: $S_{xq} = 2\\pi R h$, $V = \\pi R^2 h$.',
      'Hình nón tạo bởi tam giác vuông quay quanh cạnh góc vuông: $l^2 = R^2 + h^2$, $V = \\frac{1}{3}\\pi R^2 h$.',
      'Hình cầu: $S = 4\\pi R^2$, $V = \\frac{4}{3}\\pi R^3$ (mặt cắt qua tâm là đường tròn lớn bán kính $R$).'
    ],
    commonTraps: [
      'Nhầm chiều cao $h$ với đường sinh $l$ khi tính diện tích xung quanh hình nón ($S_{xq} = \\pi R l$, không phải $\\pi R h$).',
      'Quên cộng $2$ đáy khi tính diện tích toàn phần hình trụ ($S_{tp} = 2\\pi R h + 2\\pi R^2$).'
    ],
    theory: [
      '1. Hình trụ: Khi quay hình chữ nhật $ABCD$ quanh cạnh cố định $AB$, ta được hình trụ có bán kính đáy $R = AD$ và chiều cao $h = AB$. Diện tích xung quanh $S_{xq} = 2\\pi R h$, diện tích toàn phần $S_{tp} = 2\\pi R h + 2\\pi R^2$, thể tích $V = \\pi R^2 h$.',
      '2. Hình nón: Khi quay tam giác vuông $SOA$ quanh cạnh góc vuông $SO$, đường cao là $h = SO$, bán kính đáy $R = OA$, đường sinh $l = SA = \\sqrt{R^2 + h^2}$. Diện tích xung quanh $S_{xq} = \\pi R l$, thể tích $V = \\frac{1}{3}\\pi R^2 h$.',
      '3. Hình cầu: Quay nửa hình tròn tâm $O$ bán kính $R$ quanh đường kính tạo ra mặt cầu bán kính $R$. Diện tích mặt cầu $S = 4\\pi R^2$, thể tích khối cầu $V = \\frac{4}{3}\\pi R^3$.'
    ],
    keyFormulas: [
      '\\text{Trụ: } S_{xq} = 2\\pi R h, \\quad V = \\pi R^2 h',
      '\\text{Nón: } l = \\sqrt{R^2 + h^2}, \\quad S_{xq} = \\pi R l, \\quad V = \\frac{1}{3}\\pi R^2 h',
      '\\text{Cầu: } S = 4\\pi R^2, \\quad V = \\frac{4}{3}\\pi R^3'
    ],
    flashcards: [
      {
        front: 'Một hình nón có bán kính đáy $R = 6\\text{ cm}$, chiều cao $h = 8\\text{ cm}$. Đường sinh $l$ và thể tích $V$ bằng bao nhiêu?',
        back: '$l = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$; $V = \\frac{1}{3}\\pi \\cdot 36 \\cdot 8 = 96\\pi\\text{ cm}^3$.',
        tip: 'Ghi nhớ bộ số Pytago $6 - 8 - 10$ để tính nhẩm nhanh đường sinh!'
      }
    ],
    sampleProblems: [
      {
        question: 'Một hình trụ có bán kính đáy $R = 4\\text{ cm}$ và chiều cao $h = 5\\text{ cm}$. Thể tích của hình trụ đó là:',
        options: ['A. $80\\pi\\text{ cm}^3$', 'B. $40\\pi\\text{ cm}^3$', 'C. $20\\pi\\text{ cm}^3$', 'D. $160\\pi\\text{ cm}^3$'],
        correctIndex: 0,
        explanation: 'Áp dụng công thức thể tích hình trụ: $V = \\pi R^2 h = \\pi \\cdot 4^2 \\cdot 5 = 80\\pi\\text{ cm}^3$.'
      },
      {
        question: 'Diện tích mặt cầu có đường kính bằng $6\\text{ cm}$ là:',
        options: ['A. $36\\pi\\text{ cm}^2$', 'B. $144\\pi\\text{ cm}^2$', 'C. $12\\pi\\text{ cm}^2$', 'D. $24\\pi\\text{ cm}^2$'],
        correctIndex: 0,
        explanation: 'Đường kính $d = 6\\text{ cm} \\implies$ bán kính $R = 3\\text{ cm}$. Vậy $S = 4\\pi R^2 = 4\\pi \\cdot 3^2 = 36\\pi\\text{ cm}^2$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'revolution_solid'
  },
  {
    id: 'math-9-9',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 9',
    title: 'Đường tròn: Dây cung, Khoảng cách & Vị trí tương đối',
    grade: 'Lớp 9 · Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 16,
    description:
      'Làm chủ tính đối xứng của đường tròn (O; R), liên hệ vuông góc đường kính - dây cung, quan hệ độ dài dây và khoảng cách đến tâm, cùng 5 vị trí tương đối giữa đường thẳng và hai đường tròn.',
    mnemonics: [
      'Đường kính vuông góc với dây thì đi qua trung điểm dây; dây lớn hơn thì gần tâm hơn ($AB > CD \\iff OH < OK$).',
      'Hai đường tròn cắt nhau: hiệu bán kính $< d <$ tổng bán kính; tiếp xúc ngoài $d = R + r$, tiếp xúc trong $d = |R - r|$.'
    ],
    commonTraps: [
      'Nhầm lẫn chiều đảo: đường kính đi qua trung điểm dây chỉ vuông góc với dây KHI dây không đi qua tâm!',
      'Quên xét trường hợp dây nằm cùng phía hay khác phía đối với tâm O khi tính khoảng cách giữa hai dây song song.'
    ],
    theory: [
      '1. Định nghĩa & Đối xứng: Đường tròn $(O; R)$ là tập hợp các điểm cách $O$ một khoảng $R$. Đường tròn có tâm đối xứng là $O$ và vô số trục đối xứng là các đường thẳng đi qua tâm.',
      '2. Đường kính và Dây cung: Trong các dây của đường tròn, đường kính là dây lớn nhất ($AB \\le 2R$). Đường kính vuông góc với một dây thì đi qua trung điểm của dây ấy ($OH \\perp AB \\implies HA = HB = \\frac{AB}{2}$).',
      '3. Liên hệ Dây và Khoảng cách đến tâm (gọi $OH = d(O, AB), OK = d(O, CD)$): Trong một đường tròn: $AB = CD \\iff OH = OK$; $AB > CD \\iff OH < OK$. Công thức Pythagoras chuẩn: $\\left(\\frac{AB}{2}\\right)^2 + OH^2 = R^2$.',
      '4. Vị trí tương đối Đường thẳng & Đường tròn ($d = d(O, \\Delta)$): cắt nhau ($d < R$, 2 điểm), tiếp xúc ($d = R$, $\\Delta \\perp OT$ tại tiếp điểm $T$), không giao nhau ($d > R$).',
      '5. Vị trí tương đối Hai đường tròn $(O_1; R_1)$ và $(O_2; R_2)$ với $d = O_1O_2$: Ngoài nhau ($d > R_1 + R_2$), Tiếp xúc ngoài ($d = R_1 + R_2$), Cắt nhau ($|R_1 - R_2| < d < R_1 + R_2$, khi đó $O_1O_2$ là đường trung trực của dây chung $MN$), Tiếp xúc trong ($d = |R_1 - R_2|$), Đựng nhau ($d < |R_1 - R_2|$).'
    ],
    keyFormulas: [
      'OH \\perp AB \\implies HA = HB = \\frac{AB}{2}, \\quad OH^2 + \\left(\\frac{AB}{2}\\right)^2 = R^2',
      'AB > CD \\iff OH < OK \\quad (OH = d(O, AB),\\; OK = d(O, CD))',
      '|R_1 - R_2| < O_1O_2 < R_1 + R_2 \\iff (O_1) \\cap (O_2) = \\{M, N\\}, \\; O_1O_2 \\perp MN'
    ],
    flashcards: [
      {
        front: 'Cho $(O; R = 10\\text{ cm})$ và dây $AB = 16\\text{ cm}$. Khoảng cách từ tâm $O$ đến dây $AB$ bằng bao nhiêu?',
        back: '$H$ là trung điểm $AB \\implies HB = 8\\text{ cm}$. Theo Pythagoras: $OH = \\sqrt{R^2 - HB^2} = \\sqrt{10^2 - 8^2} = 6\\text{ cm}$.',
        tip: 'Bộ ba Pythagoras $6 - 8 - 10$ xuất hiện cực kỳ nhiều trong bài toán dây cung!'
      },
      {
        front: 'Hai đường tròn $(O_1; 7\\text{ cm})$ và $(O_2; 3\\text{ cm})$ có $O_1O_2 = 10\\text{ cm}$ ở vị trí nào?',
        back: 'Vì $O_1O_2 = 10 = 7 + 3 = R_1 + R_2$ nên hai đường tròn tiếp xúc ngoài nhau tại 1 điểm.',
        tip: 'Tiếp điểm luôn nằm trên đoạn thẳng nối hai tâm $O_1O_2$.'
      }
    ],
    sampleProblems: [
      {
        source: 'SGK Toán 9 GDPT · Chương Đường tròn',
        question:
          'Cho đường tròn $(O; 13\\text{ cm})$ và dây $AB$ cách tâm $O$ một khoảng $OH = 5\\text{ cm}$. Độ dài dây $AB$ bằng bao nhiêu?',
        options: ['A. $12\\text{ cm}$', 'B. $24\\text{ cm}$', 'C. $18\\text{ cm}$', 'D. $10\\text{ cm}$'],
        correctIndex: 1,
        explanation:
          'Ta có $HA = \\sqrt{R^2 - OH^2} = \\sqrt{13^2 - 5^2} = 12\\text{ cm}$. Vì $OH \\perp AB$ nên $H$ là trung điểm $AB \\implies AB = 2HA = 24\\text{ cm}$.'
      },
      {
        source: 'Đề Tuyển sinh 10 · Hình học Đường tròn',
        question:
          'Hai đường tròn $(O_1; 8\\text{ cm})$ và $(O_2; 5\\text{ cm})$ cắt nhau khi khoảng cách $d = O_1O_2$ thỏa mãn điều kiện nào?',
        options: ['A. $3 < d < 13$', 'B. $d = 13$', 'C. $d < 3$', 'D. $d > 13$'],
        correctIndex: 0,
        explanation:
          'Điều kiện hai đường tròn cắt nhau là $|R_1 - R_2| < d < R_1 + R_2 \\iff 8 - 5 < d < 8 + 5 \\iff 3 < d < 13$.'
      }
    ],
    essayProblems: [
      {
        source: 'VietJack · Toán 9 · Hai dây song song trong đường tròn',
        question:
          'Cho đường tròn $(O; 5\\text{ cm})$ có hai dây song song $AB = 8\\text{ cm}$ và $CD = 6\\text{ cm}$. Tính khoảng cách giữa hai dây $AB$ và $CD$.',
        hints: ['Kẻ $OH \\perp AB$ và $OK \\perp CD$. Xét 2 trường hợp: hai dây nằm cùng phía so với tâm $O$ và hai dây nằm khác phía so với tâm $O$.'],
        solutionSteps: [
          'Bước 1: Kẻ $OH \\perp AB$ ($H \\in AB$) và $OK \\perp CD$ ($K \\in CD$). Vì $AB \\parallel CD$ nên $O, H, K$ thẳng hàng.',
          'Bước 2: Tính khoảng cách đến tâm: $OH = \\sqrt{5^2 - 4^2} = 3\\text{ cm}$; $OK = \\sqrt{5^2 - 3^2} = 4\\text{ cm}$.',
          'Bước 3: TH1 (cùng phía tâm $O$): $HK = |OK - OH| = 4 - 3 = 1\\text{ cm}$. TH2 (khác phía tâm $O$): $HK = OK + OH = 4 + 3 = 7\\text{ cm}$.'
        ],
        finalAnswer: 'Khoảng cách giữa hai dây là $1\\text{ cm}$ (cùng phía) hoặc $7\\text{ cm}$ (khác phía).'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  },
  {
    id: 'math-9-10',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 9',
    title: 'Các góc với Đường tròn, Hai Tiếp tuyến & Đoạn thẳng liên quan',
    grade: 'Lớp 9 · Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 18,
    description:
      'Tổng hợp toàn bộ quan hệ góc và đoạn thẳng gắn với đường tròn: góc ở tâm, góc nội tiếp, góc tạo bởi tiếp tuyến và dây cung, tính chất hai tiếp tuyến cắt nhau ($MA = MB$) và hệ thức cát tuyến - tiếp tuyến ($MA\\cdot MB = MT^2$).',
    mnemonics: [
      'Góc ở tâm $= \\text{sđ}$ cung; Góc nội tiếp = Góc tiếp tuyến & dây cung $= \\frac{1}{2}\\text{sđ}$ cung bị chắn.',
      'Hai tiếp tuyến cắt nhau tại $M$: $MA = MB$, $MO$ phân giác $\\angle AMB$, $OM$ trung trực $AB$.'
    ],
    commonTraps: [
      'Quên trường hợp góc nội tiếp có cạnh là đường kính thì góc bằng $90^\\circ$ để tạo tam giác vuông nhanh.',
      'Nhầm hệ thức cát tuyến $MA \\cdot MB = MC \\cdot MD$: đoạn tính từ giao điểm $M$, KHÔNG phải đoạn dây $AB$.'
    ],
    theory: [
      '1. Các góc với đường tròn: Góc ở tâm $\\angle AOB = \\text{sđ}\\overset{\\frown}{AB}$. Góc nội tiếp $\\angle ACB = \\frac{1}{2}\\text{sđ}\\overset{\\frown}{AB} = \\frac{1}{2}\\angle AOB$. Góc tạo bởi tia tiếp tuyến $Ax$ và dây cung $AB$: $\\angle xAB = \\frac{1}{2}\\text{sđ}\\overset{\\frown}{AB}$ (cùng bằng góc nội tiếp chắn cung $AB$).',
      '2. Tính chất hai tiếp tuyến cắt nhau: Từ điểm $M$ ngoài $(O)$ kẻ hai tiếp tuyến $MA, MB$ ($A, B$ là tiếp điểm) thì $MA = MB = \\sqrt{OM^2 - R^2}$, $MO$ là phân giác $\\angle AMB$, $OM$ là phân giác $\\angle AOB$ và $OM \\perp AB$ tại trung điểm $H$ với $OH \\cdot OM = R^2$.',
      '3. Hệ thức đoạn thẳng (Cát tuyến & Tiếp tuyến): Từ điểm $M$ ngoài $(O)$ kẻ tiếp tuyến $MT$ và các cát tuyến $MAB, MCD$ thì $\\triangle MTA \\sim \\triangle MBT \\implies MT^2 = MA \\cdot MB = MC \\cdot MD = MO^2 - R^2$. Nếu hai dây $AB, CD$ cắt nhau tại $I$ bên trong đường tròn thì $IA \\cdot IB = IC \\cdot ID$.',
      '4. Tứ giác nội tiếp: Tổng hai góc đối bằng $180^\\circ$, hoặc hai đỉnh kề nhau cùng nhìn một cạnh dưới hai góc bằng nhau.'
    ],
    keyFormulas: [
      '\\angle ACB = \\angle xAB = \\frac{1}{2}\\angle AOB = \\frac{1}{2}\\text{sđ}\\overset{\\frown}{AB}',
      'MA = MB = \\sqrt{OM^2 - R^2}, \\quad OH \\cdot OM = R^2, \\quad HA^2 = HO \\cdot HM \\quad (H = OM \\cap AB)',
      'MT^2 = MA \\cdot MB = MC \\cdot MD = MO^2 - R^2'
    ],
    flashcards: [
      {
        front: 'Cho điểm $M$ cách tâm $O$ của $(O; R = 6\\text{ cm})$ một khoảng $OM = 10\\text{ cm}$. Độ dài đoạn tiếp tuyến $MA$ là?',
        back: 'Do $OA \\perp MA$ tại $A$, theo Pythagoras: $MA = \\sqrt{OM^2 - OA^2} = \\sqrt{10^2 - 6^2} = 8\\text{ cm}$.',
        tip: 'Luôn khai thác tam giác vuông $OAM$ vuông tại tiếp điểm $A$!'
      },
      {
        front: 'Gọi $H$ là giao điểm của $OM$ và dây nối hai tiếp điểm $AB$. Hệ thức lượng nào liên hệ $OH, OM, R$?',
        back: 'Trong $\\triangle OAM$ vuông tại $A$ có đường cao $AH$: $OA^2 = OH \\cdot OM \\implies OH \\cdot OM = R^2$.',
        tip: 'Đây là cầu nối kinh điển để chứng minh 4 điểm cùng thuộc đường tròn hoặc tích không đổi.'
      }
    ],
    sampleProblems: [
      {
        source: 'Đề Tuyển sinh 10 · Hai tiếp tuyến cắt nhau',
        question:
          'Từ điểm $M$ nằm ngoài $(O; 5\\text{ cm})$ sao cho $OM = 13\\text{ cm}$, kẻ hai tiếp tuyến $MA, MB$. Tính độ dài đoạn nối hai tiếp điểm $AB$.',
        options: ['A. $\\frac{120}{13}\\text{ cm}$', 'B. $\\frac{60}{13}\\text{ cm}$', 'C. $12\\text{ cm}$', 'D. $10\\text{ cm}$'],
        correctIndex: 0,
        explanation:
          'Ta có $MA = \\sqrt{13^2 - 5^2} = 12\\text{ cm}$. Đường cao $AH$ trong $\\triangle OAM$ vuông tại $A$: $AH = \\frac{OA \\cdot MA}{OM} = \\frac{5 \\cdot 12}{13} = \\frac{60}{13}$. Do $H$ là trung điểm $AB \\implies AB = 2AH = \\frac{120}{13}\\text{ cm}$.'
      },
      {
        source: 'Đề Chuyên 9 · Phương tích & Cát tuyến',
        question:
          'Từ điểm $P$ ngoài $(O)$ kẻ tiếp tuyến $PT = 6\\text{ cm}$ và cát tuyến $PAB$ ($PA < PB$) sao cho $PA = 4\\text{ cm}$. Độ dài dây cung $AB$ bằng bao nhiêu?',
        options: ['A. $9\\text{ cm}$', 'B. $5\\text{ cm}$', 'C. $4{,}5\\text{ cm}$', 'D. $6\\text{ cm}$'],
        correctIndex: 1,
        explanation:
          'Theo hệ thức tiếp tuyến - cát tuyến: $PT^2 = PA \\cdot PB \\implies PB = \\frac{36}{4} = 9\\text{ cm}$. Suy ra dây cung $AB = PB - PA = 9 - 4 = 5\\text{ cm}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề Tuyển sinh 10 Hà Nội · Câu Hình học tổng hợp',
        question:
          'Từ điểm $M$ nằm ngoài $(O; R)$ kẻ hai tiếp tuyến $MA, MB$ ($A, B$ là tiếp điểm) và cát tuyến $MCD$ ($MC < MD$, tia $MD$ nằm giữa $MO$ và $MB$). Gọi $H$ là giao điểm của $OM$ và $AB$. Chứng minh rằng $MA^2 = MC \\cdot MD$ và tứ giác $OHCD$ nội tiếp.',
        hints: [
          'Chứng minh $\\triangle MAC \\sim \\triangle MDA$ (g.g) vì góc $M$ chung và $\\angle MAC = \\angle MDA$ (cùng chắn cung $AC$).',
          'Dùng hệ thức lượng trong $\\triangle OAM$ vuông tại $A$ đường cao $AH$: $MA^2 = MH \\cdot MO$ để suy ra $MH \\cdot MO = MC \\cdot MD \\implies \\triangle MHC \\sim \\triangle MDO$.'
        ],
        solutionSteps: [
          'Bước 1: Xét $\\triangle MAC$ và $\\triangle MDA$ có $\\widehat{AMC}$ chung và $\\widehat{MAC} = \\widehat{MDA}$ (góc tạo bởi tiếp tuyến - dây cung và góc nội tiếp cùng chắn cung $AC$). Suy ra $\\triangle MAC \\sim \\triangle MDA \\implies MA^2 = MC \\cdot MD$.',
          'Bước 2: Vì $MA = MB$ và $OA = OB$ nên $OM \\perp AB$ tại $H$. Trong $\\triangle OAM$ vuông tại $A$ đường cao $AH$, ta có $MA^2 = MH \\cdot MO$.',
          'Bước 3: Từ (1) và (2) suy ra $MH \\cdot MO = MC \\cdot MD \\implies \\frac{MH}{MD} = \\frac{MC}{MO}$. Kết hợp $\\widehat{CMH}$ chung $\\implies \\triangle MHC \\sim \\triangle MDO$ (c.g.c) $\\implies \\widehat{MHC} = \\widehat{MDO}$.',
          'Bước 4: Vì $\\widehat{MHC} + \\widehat{OHC} = 180^\\circ \\implies \\widehat{OHC} + \\widehat{ODC} = 180^\\circ$, do đó tứ giác $OHCD$ nội tiếp đường tròn.'
        ],
        finalAnswer: 'Đã chứng minh $MA^2 = MC \\cdot MD$ và tứ giác $OHCD$ nội tiếp.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  },
  {
    id: 'math-9-11',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 9',
    title: 'Bất đẳng thức Cô-si (AM-GM) & Tìm Giá trị Lớn nhất – Nhỏ nhất thi vào 10',
    grade: 'Lớp 9 · Đại số',
    category: 'Đại số',
    difficulty: 'Vận dụng',
    readTimeMinutes: 16,
    description:
      'Chuyên đề lấy điểm 9–10 trong đề tuyển sinh lớp 10: bất đẳng thức AM-GM cho 2 số và 3 số dương, kỹ thuật chọn điểm rơi và tách hằng số tìm GTNN, GTLN.',
    mnemonics: [
      'AM-GM 2 số dương: $a + b \\ge 2\\sqrt{ab}$, dấu "=" xảy ra khi và chỉ khi $a = b$.',
      'Kỹ thuật điểm rơi: dự đoán dấu "=" tại $x = x_0$, tách hệ số để hai số hạng bằng nhau tại $x_0$.'
    ],
    commonTraps: [
      'Áp dụng Cô-si cho số âm hoặc bằng 0 ở mẫu thức mà quên kiểm tra điều kiện dương.',
      'Đánh giá hai phần riêng lẻ nhưng dấu "=" không xảy ra đồng thời tại cùng một giá trị biến.'
    ],
    theory: [
      '1. Bất đẳng thức Cô-si (AM-GM) cho 2 số không âm $a, b \\ge 0$: Xuất phát từ $(\\sqrt{a} - \\sqrt{b})^2 \\ge 0$, ta có $a + b \\ge 2\\sqrt{ab}$ hay $ab \\le \\frac{(a+b)^2}{4}$. Dấu "=" xảy ra $\\iff a = b$.',
      '2. Hệ quả cộng mẫu thường dùng thi vào 10: Với $x, y > 0$, từ $(x+y)\\left(\\frac{1}{x}+\\frac{1}{y}\\right) \\ge 4$ suy ra $\\frac{1}{x} + \\frac{1}{y} \\ge \\frac{4}{x+y}$ (mở rộng nâng cao có dạng $\\frac{a^2}{x} + \\frac{b^2}{y} \\ge \\frac{(a+b)^2}{x+y}$).',
      '3. Kỹ thuật chọn điểm rơi với $P = mx + \\frac{n}{x}$ ($x \\ge x_0$): Khi dấu "=" tự nhiên nằm ngoài vùng cho phép, dự đoán cực trị tại biên $x = x_0$ rồi tách $mx = kx + (m - k)x$ sao cho $k x_0 = \\frac{n}{x_0} \\implies k = \\frac{n}{x_0^2}$.',
      '4. Bất đẳng thức Bunhiacopxki (tham khảo mở rộng): $(a^2+b^2)(x^2+y^2) \\ge (ax+by)^2$ (chứng minh nhanh bằng cách chuyển vế thu được $(ay - bx)^2 \\ge 0$), dấu "=" khi $\\frac{a}{x} = \\frac{b}{y}$.'
    ],
    keyFormulas: [
      'a + b \\ge 2\\sqrt{ab} \\quad (a, b \\ge 0)',
      '\\frac{1}{a} + \\frac{1}{b} \\ge \\frac{4}{a+b} \\quad (a, b > 0)',
      '(a^2 + b^2)(x^2 + y^2) \\ge (ax + by)^2'
    ],
    flashcards: [
      {
        front: 'Cho $x > 0$. Giá trị nhỏ nhất của $P = x + \\frac{9}{x}$ là bao nhiêu và đạt khi nào?',
        back: 'Theo AM-GM: $x + \\frac{9}{x} \\ge 2\\sqrt{x \\cdot \\frac{9}{x}} = 6$. Dấu "=" khi $x = \\frac{9}{x} \\iff x = 3$.',
        tip: 'Kiểm tra ngay điều kiện $x > 0$ trước khi áp dụng.'
      },
      {
        front: 'Cho $a, b > 0$ thỏa mãn $a + b = 4$. Tìm GTLN của tích $ab$.',
        back: '$ab \\le \\frac{(a+b)^2}{4} = \\frac{16}{4} = 4$, đạt tại $a = b = 2$.',
        tip: 'Tổng không đổi thì tích lớn nhất khi hai số bằng nhau.'
      }
    ],
    sampleProblems: [
      {
        source: 'Đề Tuyển sinh 10 · Điểm rơi cơ bản',
        question: 'Cho $x \\ge 2$. Giá trị nhỏ nhất của biểu thức $A = x + \\frac{1}{x}$ là:',
        options: ['A. $2$', 'B. $\\frac{5}{2}$', 'C. $3$', 'D. $\\frac{3}{2}$'],
        correctIndex: 1,
        explanation:
          'Dấu "=" tại biên $x = 2$, nên tách $A = \\left(\\frac{1}{4}x + \\frac{1}{x}\\right) + \\frac{3}{4}x \\ge 2\\sqrt{\\frac{1}{4}} + \\frac{3}{4}\\cdot 2 = 1 + \\frac{3}{2} = \\frac{5}{2}$. Dấu "=" khi $x = 2$.'
      },
      {
        source: 'Đề Tuyển sinh 10 · Cauchy-Schwarz',
        question: 'Cho hai số thực dương $x, y$ thỏa mãn $x + y = 6$. Giá trị nhỏ nhất của $S = \\frac{1}{x} + \\frac{4}{y}$ là:',
        options: ['A. $\\frac{3}{2}$', 'B. $2$', 'C. $\\frac{9}{6}$', 'D. $\\frac{5}{6}$'],
        correctIndex: 0,
        explanation:
          'Áp dụng Engel: $\\frac{1^2}{x} + \\frac{2^2}{y} \\ge \\frac{(1+2)^2}{x+y} = \\frac{9}{6} = \\frac{3}{2}$. Dấu "=" khi $x = 2, y = 4$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề Tuyển sinh 10 · Cực trị Đại số',
        question: 'Cho $x, y > 0$ thỏa mãn $x + y \\le 1$. Tìm giá trị nhỏ nhất của biểu thức $P = x + y + \\frac{1}{x} + \\frac{1}{y}$.',
        hints: ['Dự đoán điểm rơi tại $x = y = \\frac{1}{2}$ (khi đó $\\frac{1}{x} = 2 = 4x$).'],
        solutionSteps: [
          'Bước 1: Áp dụng $\\frac{1}{x} + \\frac{1}{y} \\ge \\frac{4}{x+y}$, ta được $P \\ge (x+y) + \\frac{4}{x+y}$. Đặt $t = x + y \\in (0; 1]$.',
          'Bước 2: Tách $P \\ge \\left(t + \\frac{1}{t}\\right) + \\frac{3}{t}$. Với mọi $t > 0$, $t + \\frac{1}{t} \\ge 2$ (AM-GM).',
          'Bước 3: Vì $0 < t \\le 1$ nên $\\frac{3}{t} \\ge 3$. Cộng vế: $P \\ge 2 + 3 = 5$.',
          'Bước 4: Dấu "=" xảy ra khi $t = 1$ và $x = y$, tức $x = y = \\frac{1}{2}$.'
        ],
        finalAnswer: '$\\min P = 5$ khi $x = y = \\frac{1}{2}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    defaultGraphConfig: {
      type: 'custom',
      customExpr: 'x + 4/x',
      params: { a: 1, b: 4, c: 0, d: 0 },
      color: '#10b981',
      name: 'y = x + 4/x (Cực trị Cô-si)'
    }
  },
  {
    id: 'math-9-12',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 9',
    title: 'Giải Bài toán Bằng Cách Lập Phương trình & Hệ Phương trình (Chuyển động – Năng suất)',
    grade: 'Lớp 9 · Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 15,
    description:
      'Phương pháp lập bảng 3 bước chuẩn mực giải mọi dạng toán thực tế thi vào 10: chuyển động trên đường bộ/dòng nước, làm chung công việc, phần trăm và hình học.',
    mnemonics: [
      '3 bước vàng: (1) Chọn ẩn + đơn vị + ĐK chặt chẽ; (2) Biểu diễn các đại lượng theo ẩn; (3) Lập PT/HPT, giải và đối chiếu ĐK.',
      'Chuyển động dòng nước: $v_{\\text{xuôi}} = v_{\\text{thực}} + v_{\\text{nước}}$, $v_{\\text{ngược}} = v_{\\text{thực}} - v_{\\text{nước}}$.'
    ],
    commonTraps: [
      'Quên đổi đơn vị thời gian (ví dụ 20 phút $= \\frac{1}{3}$ giờ, không phải $0{,}2$ giờ!).',
      'Bài toán làm chung công việc: cộng nhầm thời gian thay vì cộng năng suất $\\frac{1}{x} + \\frac{1}{y}$.'
    ],
    theory: [
      '1. Toán chuyển động: Quãng đường $S = v \\cdot t$, thời gian $t = \\frac{S}{v}$. Khi có chênh lệch thời gian $\\Delta t$, thường lập phương trình dạng $\\frac{S}{v_1} - \\frac{S}{v_2} = \\Delta t$.',
      '2. Toán chuyển động trên dòng nước: $v_{\\text{xuôi}} = v_{\\text{tàu}} + v_{\\text{nước}}$, $v_{\\text{ngược}} = v_{\\text{tàu}} - v_{\\text{nước}}$ với điều kiện $v_{\\text{tàu}} > v_{\\text{nước}} > 0$.',
      '3. Toán năng suất (làm chung – làm riêng): Coi toàn bộ công việc là $1$ đơn vị. Nếu đội I làm một mình xong trong $x$ ngày và đội II xong trong $y$ ngày ($x, y > 0$) thì mỗi ngày làm chung được $\\frac{1}{x} + \\frac{1}{y}$ công việc.',
      '4. Toán phần trăm & lãi suất: Giá sau khi tăng $a\\%$ là $A(1 + \\frac{a}{100})$; giảm $a\\%$ là $A(1 - \\frac{a}{100})$.'
    ],
    keyFormulas: [
      'S = v \\cdot t \\implies t_1 - t_2 = \\frac{S}{v_1} - \\frac{S}{v_2}',
      '\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{T_{\\text{chung}}}',
      'v_{\\text{xuôi}} - v_{\\text{ngược}} = 2 v_{\\text{dòng nước}}'
    ],
    flashcards: [
      {
        front: 'Hai vòi nước cùng chảy vào bể cạn sau $6\\text{ giờ}$ đầy bể. Gọi thời gian vòi I, II chảy riêng lần lượt là $x, y$ (giờ). Phương trình đúng là gì?',
        back: '$\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{6}$ (với điều kiện $x, y > 6$).',
        tip: 'Đặt ẩn phụ $u = \\frac{1}{x}, v = \\frac{1}{y}$ để đưa về hệ bậc nhất cực gọn.'
      },
      {
        front: 'Một ca nô đi xuôi dòng với vận tốc riêng $24\\text{ km/h}$, nước chảy $4\\text{ km/h}$. Vận tốc ngược dòng của ca nô là?',
        back: '$v_{\\text{ngược}} = 24 - 4 = 20\\text{ km/h}$.',
        tip: 'Vận tốc xuôi là $24+4 = 28\\text{ km/h}$.'
      }
    ],
    sampleProblems: [
      {
        source: 'Đề Tuyển sinh 10 · Toán chuyển động',
        question:
          'Một ô tô đi từ A đến B dài $120\\text{ km}$. Khi về, ô tô tăng vận tốc thêm $10\\text{ km/h}$ nên thời gian về ít hơn thời gian đi là $24\\text{ phút}$. Vận tốc lúc đi của ô tô là:',
        options: ['A. $50\\text{ km/h}$', 'B. $40\\text{ km/h}$', 'C. $60\\text{ km/h}$', 'D. $45\\text{ km/h}$'],
        correctIndex: 0,
        explanation:
          'Đổi $24\\text{ phút} = \\frac{2}{5}\\text{ h}$. Gọi $v > 0$ là vận tốc đi: $\\frac{120}{v} - \\frac{120}{v+10} = \\frac{2}{5} \\iff v(v+10) = 3000 \\implies v = 50\\text{ km/h}$.'
      },
      {
        source: 'Đề Tuyển sinh 10 · Năng suất chung',
        question:
          'Hai đội công nhân cùng làm một đoạn đường trong $12\\text{ ngày}$ thì xong. Nếu đội I làm trong $4\\text{ ngày}$ rồi nghỉ, đội II làm tiếp $14\\text{ ngày}$ nữa thì xong. Đội I làm riêng xong công việc trong:',
        options: ['A. $20\\text{ ngày}$', 'B. $30\\text{ ngày}$', 'C. $18\\text{ ngày}$', 'D. $24\\text{ ngày}$'],
        correctIndex: 1,
        explanation:
          'Hệ: $\\frac{1}{x}+\\frac{1}{y}=\\frac{1}{12}$ và $\\frac{4}{x}+\\frac{14}{y}=1$. Giải ra $\\frac{1}{y} = \\frac{1}{20} \\implies \\frac{1}{x} = \\frac{1}{30} \\implies x = 30\\text{ ngày}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề Tuyển sinh 10 · Bài toán thực tế',
        question:
          'Một mảnh vườn hình chữ nhật có chu vi $62\\text{ m}$. Nếu tăng chiều dài thêm $2\\text{ m}$ và giảm chiều rộng đi $1\\text{ m}$ thì diện tích mảnh vườn tăng thêm $12\\text{ m}^2$. Tính kích thước ban đầu của mảnh vườn.',
        hints: ['Nửa chu vi là $x + y = 31$. Viết diện tích mới $(x+2)(y-1) = xy + 12$.'],
        solutionSteps: [
          'Bước 1: Gọi chiều dài là $x$ (m), chiều rộng là $y$ (m), ĐK: $31 > x > y > 1$.',
          'Bước 2: Chu vi $2(x+y)=62 \\implies x + y = 31$ (1).',
          'Bước 3: Diện tích mới: $(x+2)(y-1) = xy + 12 \\iff -x + 2y = 14$ (2).',
          'Bước 4: Cộng (1) và (2): $3y = 45 \\implies y = 15\\text{ m}$, suy ra $x = 31 - 15 = 16\\text{ m}$ (thỏa mãn).'
        ],
        finalAnswer: 'Chiều dài $16\\text{ m}$, chiều rộng $15\\text{ m}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    defaultGraphConfig: {
      type: 'linear',
      params: { a: 1, b: 10, c: 0, d: 0 },
      color: '#38bdf8',
      name: 'Đồ thị quãng đường theo thời gian S = vt'
    }
  }
];

const GRADE_9_META: Record<string, { lessonNumber: number; stageLabel: string }> = {
  'math-9-1': { lessonNumber: 1, stageLabel: 'Toán 9 GDPT 2018 · Đại Số & Hàm Số' },
  'math-9-2': { lessonNumber: 2, stageLabel: 'Toán 9 GDPT 2018 · Đại Số & Hàm Số' },
  'math-9-3': { lessonNumber: 3, stageLabel: 'Toán 9 GDPT 2018 · Hình Học Phẳng' },
  'math-9-4': { lessonNumber: 4, stageLabel: 'Toán 9 GDPT 2018 · Đại Số & Hàm Số' },
  'math-9-5': { lessonNumber: 5, stageLabel: 'Toán 9 GDPT 2018 · Đại Số & Hàm Số' },
  'math-9-6': { lessonNumber: 6, stageLabel: 'Toán 9 GDPT 2018 · Hình Học Phẳng' },
  'math-9-7': { lessonNumber: 7, stageLabel: 'Toán 9 GDPT 2018 · Thống Kê & Xác Suất' },
  'math-9-8': { lessonNumber: 8, stageLabel: 'Toán 9 GDPT 2018 · Hình Học Trực Quan' },
  'math-9-9': { lessonNumber: 9, stageLabel: 'Toán 9 GDPT 2018 · Hình Học Phẳng' },
  'math-9-10': { lessonNumber: 10, stageLabel: 'Toán 9 GDPT 2018 · Hình Học Phẳng' },
  'math-9-11': { lessonNumber: 11, stageLabel: 'Toán 9 GDPT 2018 · Đại Số & Hàm Số' },
  'math-9-12': { lessonNumber: 12, stageLabel: 'Toán 9 GDPT 2018 · Đại Số & Hàm Số' },
};

const withMathSupplement = (lec: MathLecture): MathLecture => {
  const meta = MATH_METADATA_AND_ESSAYS[lec.id];
  const g9 = GRADE_9_META[lec.id];
  return {
    ...lec,
    track: lec.track ?? meta?.track ?? 'khong_chuyen',
    gradeGroup: lec.gradeGroup ?? meta?.gradeGroup ?? (lec.id.startsWith('math-9-') ? 'Lớp 9' : undefined),
    lessonNumber: lec.lessonNumber ?? g9?.lessonNumber,
    stageLabel: lec.stageLabel ?? g9?.stageLabel,
    sim2dMode: lec.sim2dMode ?? meta?.sim2dMode,
    sim3dMode: lec.sim3dMode ?? meta?.sim3dMode,
    defaultGraphConfig: lec.defaultGraphConfig ?? meta?.defaultGraphConfig,
    essayProblems: lec.essayProblems ?? meta?.essayProblems,
  };
};

export const MATH_LECTURES: MathLecture[] = [
  ...BASE_MATH_LECTURES.map(withMathSupplement).sort(
    (a, b) => (a.lessonNumber ?? 99) - (b.lessonNumber ?? 99)
  ),
  ...MATH_GDPT_10_LESSONS.map(withMathSupplement),
  ...MATH_GDPT_11_LESSONS.map(withMathSupplement),
  ...MATH_GDPT_12_LESSONS.map(withMathSupplement),
  ...MATH_GDPT_ELECTIVES.map(withMathSupplement),
  ...CHUYEN_MATH_LECTURES.map((lec) => ({
    ...lec,
    stageLabel: lec.stageLabel ?? 'Chuyên đề Chuyên sâu & Bồi dưỡng HSG',
  })),
  ...MATH_EXTRA_10_LESSONS,
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
      { id: 1, input: '3 5', expectedOutput: '8', isSample: true, explanation: '3 + 5 = 8', difficulty: 'Cơ bản' },
      { id: 2, input: '-10 25', expectedOutput: '15', isSample: true, explanation: '-10 + 25 = 15', difficulty: 'Cơ bản' }
    ],
    hiddenCases: [
      { id: 3, input: '12 8', expectedOutput: '20', difficulty: 'Cơ bản' },
      { id: 4, input: '0 0', expectedOutput: '0', difficulty: 'Trung bình' },
      { id: 5, input: '-1000 -2000', expectedOutput: '-3000', difficulty: 'Trung bình' },
      { id: 6, input: '-500000000 500000000', expectedOutput: '0', difficulty: 'Nâng cao' },
      { id: 7, input: '999999999 1', expectedOutput: '1000000000', difficulty: 'Thử thách' }
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
    solve()`,
    basicSolutionCpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << a + b;
    return 0;
}`,
    basicSolutionPython: `a, b = map(int, input().split())
print(a + b)`,
    advancedSolutionCpp: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long a, b;
    while (cin >> a >> b) {
        cout << a + b << '\\n';
    }
    return 0;
}`,
    advancedSolutionPython: `import sys

def solve():
    data = sys.stdin.read().split()
    if len(data) >= 2:
        print(int(data[0]) + int(data[1]))

if __name__ == '__main__':
    solve()`,
    solutionAnalysis: 'Cơ bản: Nhập trực tiếp hai biến long long (tránh tràn int khi a, b tới 10^9) và in a + b. Nâng cao: Tắt đồng bộ stdio với Fast I/O và đọc theo luồng chuẩn.'
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
      { id: 1, input: '7', expectedOutput: 'YES', isSample: true, explanation: '7 chỉ chia hết cho 1 và 7', difficulty: 'Cơ bản' },
      { id: 2, input: '1', expectedOutput: 'NO', isSample: true, explanation: '1 không phải số nguyên tố', difficulty: 'Cơ bản' },
      { id: 3, input: '12', expectedOutput: 'NO', isSample: true, explanation: '12 chia hết cho 2, 3, 4, 6', difficulty: 'Cơ bản' }
    ],
    hiddenCases: [
      { id: 4, input: '5', expectedOutput: 'YES', difficulty: 'Cơ bản' },
      { id: 5, input: '97', expectedOutput: 'YES', difficulty: 'Trung bình' },
      { id: 6, input: '2', expectedOutput: 'YES', difficulty: 'Nâng cao' },
      { id: 7, input: '1000000', expectedOutput: 'NO', difficulty: 'Nâng cao' },
      { id: 8, input: '1000000007', expectedOutput: 'YES', difficulty: 'Thử thách' }
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
    solve()`,
    basicSolutionCpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    if (n < 2) {
        cout << "NO";
        return 0;
    }
    int dem = 0;
    for (long long i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            dem++;
            break;
        }
    }
    if (dem == 0) cout << "YES";
    else cout << "NO";
    return 0;
}`,
    basicSolutionPython: `n = int(input())
if n < 2:
    print("NO")
else:
    ok = True
    i = 2
    while i * i <= n:
        if n % i == 0:
            ok = False
            break
        i += 1
    print("YES" if ok else "NO")`,
    advancedSolutionCpp: `#include <iostream>
using namespace std;

bool isPrime6k(long long n) {
    if (n < 2) return false;
    if (n == 2 || n == 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (long long i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long n;
    if (cin >> n) cout << (isPrime6k(n) ? "YES" : "NO") << '\\n';
    return 0;
}`,
    advancedSolutionPython: `import sys

def is_prime_6k(n: int) -> bool:
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

line = sys.stdin.read().strip()
if line:
    print("YES" if is_prime_6k(int(line)) else "NO")`,
    solutionAnalysis: 'Cơ bản: Duyệt trực tiếp trong main() từ 2 tới căn N để tìm ước. Nâng cao: Tối ưu bước nhảy 6k ± 1 giảm 3 lần số phép chia kết hợp Fast I/O.'
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
      { id: 1, input: '0', expectedOutput: '0', isSample: true, difficulty: 'Cơ bản' },
      { id: 2, input: '6', expectedOutput: '8', isSample: true, explanation: 'F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8', difficulty: 'Cơ bản' },
      { id: 3, input: '10', expectedOutput: '55', isSample: true, difficulty: 'Cơ bản' }
    ],
    hiddenCases: [
      { id: 4, input: '4', expectedOutput: '3', difficulty: 'Cơ bản' },
      { id: 5, input: '20', expectedOutput: '6765', difficulty: 'Trung bình' },
      { id: 6, input: '1', expectedOutput: '1', difficulty: 'Nâng cao' },
      { id: 7, input: '50', expectedOutput: '586268941', difficulty: 'Nâng cao' },
      { id: 8, input: '100', expectedOutput: '687995182', difficulty: 'Thử thách' }
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
    solve()`,
    basicSolutionCpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    long long f0 = 0, f1 = 1, fn = 0;
    if (n == 0) fn = 0;
    else if (n == 1) fn = 1;
    else {
        for (int i = 2; i <= n; i++) {
            fn = (f0 + f1) % 1000000007;
            f0 = f1;
            f1 = fn;
        }
    }
    cout << fn;
    return 0;
}`,
    basicSolutionPython: `n = int(input())
MOD = 1000000007
if n == 0:
    print(0)
elif n == 1:
    print(1)
else:
    a, b = 0, 1
    for _ in range(2, n + 1):
        c = (a + b) % MOD
        a = b
        b = c
    print(b)`,
    advancedSolutionCpp: `#include <iostream>
#include <vector>
using namespace std;

const long long MOD = 1000000007LL;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (!(cin >> n)) return 0;
    if (n <= 1) {
        cout << n << '\\n';
        return 0;
    }
    // Quy hoạch động mảng 1D lưu toàn bộ trạng thái F[i]
    vector<long long> dp(n + 1, 0);
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = (dp[i - 1] + dp[i - 2]) % MOD;
    }
    cout << dp[n] << '\\n';
    return 0;
}`,
    advancedSolutionPython: `import sys

MOD = 1000000007

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
    n = int(s)
    if n <= 1:
        print(n)
        return
    # Quy hoạch động F(i) = (F(i-1) + F(i-2)) mod (10^9 + 7)
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = (dp[i - 1] + dp[i - 2]) % MOD
    print(dp[n])

if __name__ == '__main__':
    solve()`,
    solutionAnalysis: 'Cơ bản: Chỉ dùng 3 biến đơn giản f0, f1, fn cập nhật cuốn chiếu trong main(). Nâng cao / Chuyên: Bảng phương án Quy hoạch động DP 1D (có thể nâng lên Nhân ma trận O(log N) nếu N tới 10^18).'
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
      { id: 1, input: '5 7\n1 3 5 7 9', expectedOutput: '4', isSample: true, explanation: 'Số 7 nằm ở vị trí thứ 4', difficulty: 'Cơ bản' },
      { id: 2, input: '4 4\n1 2 3 5', expectedOutput: '-1', isSample: true, explanation: 'Không có số 4 trong mảng', difficulty: 'Cơ bản' }
    ],
    hiddenCases: [
      { id: 3, input: '4 8\n2 5 8 10', expectedOutput: '3', difficulty: 'Cơ bản' },
      { id: 4, input: '5 1\n2 4 6 8 10', expectedOutput: '-1', difficulty: 'Trung bình' },
      { id: 5, input: '6 5\n2 4 5 5 5 8', expectedOutput: '3', difficulty: 'Nâng cao' },
      { id: 6, input: '1 10\n10', expectedOutput: '1', difficulty: 'Nâng cao' },
      { id: 7, input: '7 99\n1 5 12 25 60 99 105', expectedOutput: '6', difficulty: 'Thử thách' }
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
    solve()`,
    basicSolutionCpp: `#include <iostream>
using namespace std;

int a[100005];

int main() {
    int n;
    long long x;
    cin >> n >> x;
    for (int i = 1; i <= n; i++) cin >> a[i];
    int l = 1, r = n, kq = -1;
    while (l <= r) {
        int mid = (l + r) / 2;
        if (a[mid] == x) {
            kq = mid;
            r = mid - 1; // Tìm tiếp bên trái để lấy vị trí đầu tiên
        } else if (a[mid] < x) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }
    cout << kq;
    return 0;
}`,
    basicSolutionPython: `tokens = input().split()
n, x = int(tokens[0]), int(tokens[1])
a = list(map(int, input().split()))
kq = -1
l, r = 0, n - 1
while l <= r:
    mid = (l + r) // 2
    if a[mid] == x:
        kq = mid + 1
        r = mid - 1
    elif a[mid] < x:
        l = mid + 1
    else:
        r = mid - 1
print(kq)`,
    advancedSolutionCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    long long x;
    if (!(cin >> n >> x)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    // Dùng chuẩn STL lower_bound O(log N)
    auto it = lower_bound(a.begin(), a.end(), x);
    if (it != a.end() && *it == x) cout << (it - a.begin()) + 1 << '\\n';
    else cout << -1 << '\\n';
    return 0;
}`,
    advancedSolutionPython: `import sys
import bisect

def solve():
    raw = sys.stdin.read().split()
    if not raw:
        return
    n, x = int(raw[0]), int(raw[1])
    arr = [int(v) for v in raw[2:2 + n]]
    idx = bisect.bisect_left(arr, x)
    print(idx + 1 if idx < n and arr[idx] == x else -1)

if __name__ == '__main__':
    solve()`,
    solutionAnalysis: 'Cơ bản: Tự cài vòng while nhị phân với mảng tĩnh 1-indexed trong main(). Nâng cao / Chuyên: Dùng lower_bound (C++) / bisect_left (Python) tối ưu chuẩn thư viện STL.'
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
      { id: 1, input: 'radar', expectedOutput: 'YES', isSample: true, difficulty: 'Cơ bản' },
      { id: 2, input: 'hello', expectedOutput: 'NO', isSample: true, difficulty: 'Cơ bản' },
      { id: 3, input: 'A man a plan a canal Panama', expectedOutput: 'YES', isSample: true, difficulty: 'Trung bình' }
    ],
    hiddenCases: [
      { id: 4, input: 'aba', expectedOutput: 'YES', difficulty: 'Cơ bản' },
      { id: 5, input: 'abccba', expectedOutput: 'YES', difficulty: 'Trung bình' },
      { id: 6, input: 'a', expectedOutput: 'YES', difficulty: 'Nâng cao' },
      { id: 7, input: 'coding is fun', expectedOutput: 'NO', difficulty: 'Nâng cao' },
      { id: 8, input: 'Was it a car or a cat I saw', expectedOutput: 'YES', difficulty: 'Thử thách' }
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
    solve()`,
    basicSolutionCpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s, clean = "";
    getline(cin, s);
    for (int i = 0; i < (int)s.size(); i++) {
        char c = s[i];
        if (c >= 'A' && c <= 'Z') c = c + 32; // Đổi chữ hoa sang thường
        if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
            clean += c;
        }
    }
    bool ok = true;
    int len = clean.size();
    for (int i = 0; i < len / 2; i++) {
        if (clean[i] != clean[len - 1 - i]) {
            ok = false;
            break;
        }
    }
    cout << (ok ? "YES" : "NO");
    return 0;
}`,
    basicSolutionPython: `s = input()
clean = ""
for c in s:
    if c.isalnum():
        clean += c.lower()
ok = True
for i in range(len(clean) // 2):
    if clean[i] != clean[len(clean) - 1 - i]:
        ok = False
        break
print("YES" if ok else "NO")`,
    advancedSolutionCpp: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string s;
    if (!getline(cin, s)) return 0;
    // Hai con trỏ trực tiếp O(1) bộ nhớ phụ
    int l = 0, r = (int)s.size() - 1;
    while (l < r) {
        while (l < r && !isalnum((unsigned char)s[l])) l++;
        while (l < r && !isalnum((unsigned char)s[r])) r--;
        if (tolower((unsigned char)s[l]) != tolower((unsigned char)s[r])) {
            cout << "NO\\n";
            return 0;
        }
        l++;
        r--;
    }
    cout << "YES\\n";
    return 0;
}`,
    advancedSolutionPython: `import sys

s = sys.stdin.read().strip()
filtered = [c.lower() for c in s if c.isalnum()]
print("YES" if filtered == filtered[::-1] else "NO")`,
    solutionAnalysis: 'Cơ bản: Lọc xâu vào chuỗi mới rồi so sánh đối xứng từ 2 đầu bằng vòng for. Nâng cao / Chuyên: Kỹ thuật Hai con trỏ tại chỗ O(1) bộ nhớ phụ.'
  },
  {
    id: 'KNAPSACK',
    title: 'BAI06: Bài toán cái túi (0/1 Knapsack)',
    difficulty: 'Hard',
    category: 'Quy hoạch động',
    timeLimit: '2.0s',
    memoryLimit: '256MB',
    description: 'Một tên trộm có một cái túi chịu được khối lượng tối đa W. Có N món đồ, món thứ i có khối lượng w_i và giá trị v_i. Hãy chọn các món đồ để tổng giá trị trong túi là lớn nhất mà không vượt quá tải trọng W.',
    inputFormat: 'Dòng 1: Hai số nguyên N và W.\nDòng 2..N+1: Mỗi dòng chứa 2 số nguyên w_i và v_i là khối lượng và giá trị món đồ i.',
    outputFormat: 'In ra một số nguyên là tổng giá trị lớn nhất đạt được.',
    constraints: ['1 <= N <= 100', '1 <= W <= 1000', '1 <= w_i, v_i <= 1000'],
    sampleCases: [
      { id: 1, input: '3 50\n10 60\n20 100\n30 120', expectedOutput: '220', isSample: true, explanation: 'Chọn món 2 (20kg, 100) và món 3 (30kg, 120): tổng khối lượng 50, giá trị 220.', difficulty: 'Cơ bản' }
    ],
    hiddenCases: [
      { id: 2, input: '2 5\n2 3\n3 4', expectedOutput: '7', difficulty: 'Cơ bản' },
      { id: 3, input: '4 7\n1 1\n3 4\n4 5\n5 7', expectedOutput: '9', difficulty: 'Trung bình' },
      { id: 4, input: '2 3\n4 10\n5 20', expectedOutput: '0', difficulty: 'Nâng cao' },
      { id: 5, input: '5 10\n2 3\n3 4\n4 5\n5 8\n9 10', expectedOutput: '15', difficulty: 'Thử thách' }
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
    solve()`,
    basicSolutionCpp: `#include <iostream>
using namespace std;

int w[105], v[105];
int dp[105][1005];

int main() {
    int n, W;
    cin >> n >> W;
    for (int i = 1; i <= n; i++) cin >> w[i] >> v[i];
    // Bảng quy hoạch động 2 chiều cơ bản dễ hình dung
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= W; j++) {
            dp[i][j] = dp[i - 1][j];
            if (j >= w[i] && dp[i - 1][j - w[i]] + v[i] > dp[i][j]) {
                dp[i][j] = dp[i - 1][j - w[i]] + v[i];
            }
        }
    }
    cout << dp[n][W];
    return 0;
}`,
    basicSolutionPython: `n, W = map(int, input().split())
w = [0] * (n + 1)
v = [0] * (n + 1)
for i in range(1, n + 1):
    w[i], v[i] = map(int, input().split())

dp = [[0] * (W + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    for j in range(W + 1):
        dp[i][j] = dp[i - 1][j]
        if j >= w[i]:
            dp[i][j] = max(dp[i][j], dp[i - 1][j - w[i]] + v[i])
print(dp[n][W])`,
    advancedSolutionCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, W;
    if (!(cin >> n >> W)) return 0;
    // Quy hoạch động tối ưu không gian 1D: duyệt ngược từ W về w[i]
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < n; i++) {
        int wt, val;
        cin >> wt >> val;
        for (int j = W; j >= wt; j--) {
            dp[j] = max(dp[j], dp[j - wt] + val);
        }
    }
    cout << dp[W] << '\\n';
    return 0;
}`,
    advancedSolutionPython: `import sys

def solve():
    raw = sys.stdin.read().split()
    if not raw:
        return
    n, W = int(raw[0]), int(raw[1])
    dp = [0] * (W + 1)
    idx = 2
    for _ in range(n):
        wt, val = int(raw[idx]), int(raw[idx + 1])
        idx += 2
        for j in range(W, wt - 1, -1):
            dp[j] = max(dp[j], dp[j - wt] + val)
    print(dp[W])

if __name__ == '__main__':
    solve()`,
    solutionAnalysis: 'Cơ bản: Dùng bảng DP 2D dp[i][j] trực quan dễ truy vết, viết tuần tự trong main(). Nâng cao / Chuyên: Nén mảng 1 chiều dp[j] duyệt ngược giảm bộ nhớ từ O(N·W) xuống O(W).'
  }
];

