import {
  MathLecture,
  PhysicsExperiment,
  CodingProblem,
} from '../types';
export { PHYSICS_LESSONS } from './physicsLessonsData';
export { CS_LESSONS } from './csLessonsData';


export const MATH_LECTURES: MathLecture[] = [
  {
    id: 'math-1',
    title: 'Khảo sát sự biến thiên & Đồ thị hàm số bậc ba',
    grade: 'Lớp 12 - Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 8,
    description: 'Nắm vững quy trình khảo sát đạo hàm $y\' = 3ax^2 + 2bx + c$, các dạng đồ thị chữ N/chữ N ngược, cực đại, cực tiểu và tâm đối xứng uốn.',
    mnemonics: [
      'a > 0: Nhánh phải đi lên (chữ N). a < 0: Nhánh phải đi xuống (chữ N ngược).',
      'Đạo hàm y\' bậc 2: Có 2 cực trị khi Δ\' > 0; Không có cực trị khi Δ\' ≤ 0.',
      'Tâm đối xứng uốn I luôn là trung điểm của đoạn nối 2 điểm cực trị.'
    ],
    commonTraps: [
      'Quên điều kiện a ≠ 0 khi đề bài cho tham số m ở hệ số bậc cao nhất.',
      'Nhầm lẫn giữa "Điểm cực trị của hàm số" (x) và "Cực trị của hàm số" (y).'
    ],
    theory: [
      '1. Tập xác định: D = R với hàm số đa thức bậc ba $y = ax^3 + bx^2 + cx + d$ ($a \\neq 0$).',
      '2. Đạo hàm: $y\' = 3ax^2 + 2bx + c$. Biệt thức $\\Delta\' = b^2 - 3ac$.',
      '3. Nếu $\\Delta\' > 0$: Đồ thị có 2 điểm cực trị phân biệt ($x_1 < x_2$). Tích 2 cực trị cùng dấu nếu $ac > 0$.',
      '4. Nếu $\\Delta\' \\le 0$: Hàm số luôn đồng biến trên R nếu $a > 0$, hoặc nghịch biến trên R nếu $a < 0$.',
      '5. Điểm uốn $I(x_0, y_0)$ với $x_0 = -\\frac{b}{3a}$ (nghiệm của $y\'\' = 0$) là tâm đối xứng của đồ thị.',
      '6. Phương trình đường thẳng đi qua 2 điểm cực trị: Lấy y chia cho y\' lấy phần dư.'
    ],
    keyFormulas: [
      'y = ax^3 + bx^2 + cx + d',
      'y\' = 3ax^2 + 2bx + c',
      'x_{uon} = -b / (3a)',
      '\\Delta\' = b^2 - 3ac',
      'd_{cuc\\_tri}: y = \\left(\\frac{2c}{3} - \\frac{2b^2}{9a}\\right)x + \\left(d - \\frac{bc}{9a}\\right)'
    ],
    flashcards: [
      {
        front: 'Khi nào đồ thị hàm bậc 3 có 2 điểm cực trị?',
        back: 'Khi và chỉ khi phương trình y\' = 0 có 2 nghiệm phân biệt, tức là Δ\' = b² - 3ac > 0.',
        tip: 'Nếu Δ\' ≤ 0 hàm số đơn điệu trên toàn R.'
      },
      {
        front: 'Tọa độ hoành độ tâm đối xứng uốn x₀ của hàm bậc ba?',
        back: 'x₀ = -b / (3a). Đây là nghiệm của đạo hàm cấp hai y\'\' = 6ax + 2b = 0.',
        tip: 'Điểm uốn I luôn nằm chính giữa 2 điểm cực trị.'
      }
    ],
    sampleProblems: [
      {
        question: 'Cho hàm số $y = x^3 - 3x^2 + 2$. Tọa độ điểm cực đại của đồ thị hàm số là:',
        options: ['A. (0; 2)', 'B. (2; -2)', 'C. (1; 0)', 'D. (-1; -2)'],
        correctIndex: 0,
        explanation: 'Ta có $y\' = 3x^2 - 6x = 3x(x - 2)$. Nghiệm $x=0$ hoặc $x=2$. Bảng xét dấu: qua $x=0$ đạo hàm đổi dấu từ (+) sang (-) nên $x=0$ là điểm cực đại, thay vào được $y(0) = 2$. Vậy tọa độ điểm cực đại là (0; 2).'
      },
      {
        question: 'Đồ thị hàm số $y = -x^3 + 3x - 1$ nhận điểm nào sau đây làm tâm đối xứng?',
        options: ['A. (0; -1)', 'B. (1; 1)', 'C. (-1; -3)', 'D. (0; 0)'],
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
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 7,
    description: 'Quy tắc xác định tiệm cận đứng $x = -d/c$, tiệm cận ngang $y = a/c$, tâm đối xứng và hình dáng hypebol vuông góc.',
    mnemonics: [
      'Đạo hàm chéo: ad - bc (huyền trừ sắc). Dấu y\' phụ thuộc hoàn toàn vào hiệu này.',
      'Đứng: Mẫu bằng 0 (x = -d/c). Ngang: Tỉ số bậc cao nhất (y = a/c).',
      'Hàm số không bao giờ có cực trị!'
    ],
    commonTraps: [
      'Ghi hàm số đồng biến trên R \\ {-d/c} là SAI. Phải ghi "trên từng khoảng xác định".',
      'Quên điều kiện ad - bc ≠ 0 (nếu bằng 0 thì hàm số suy biến thành đường thẳng).'
    ],
    theory: [
      '1. Tập xác định: $D = R \\setminus \\{-d/c\\}$ ($c \\neq 0, ad - bc \\neq 0$).',
      '2. Đạo hàm: $y\' = \\frac{ad - bc}{(cx + d)^2}$. Luôn cùng dấu với $ad - bc$ trên từng khoảng.',
      '3. Nếu $ad - bc > 0$: Hàm số đồng biến trên $(-\\infty; -d/c)$ và $(-d/c; +\\infty)$. Đồ thị nằm ở góc phần tư II và IV so với 2 tiệm cận.',
      '4. Nếu $ad - bc < 0$: Hàm số nghịch biến trên từng khoảng xác định. Đồ thị nằm ở góc I và III.',
      '5. Tiệm cận đứng: $x = -d/c$. Tiệm cận ngang: $y = a/c$. Tâm đối xứng $I(-d/c; a/c)$.',
      '6. Mọi tiếp tuyến của hypebol đều cắt 2 tiệm cận tạo thành tam giác có diện tích không đổi $S = \\frac{2|ad - bc|}{c^2}$.'
    ],
    keyFormulas: [
      'y = \\frac{ax + b}{cx + d}',
      'y\' = \\frac{ad - bc}{(cx + d)^2}',
      'TCĐ: x = -d / c',
      'TCN: y = a / c',
      'Tam\\_doi\\_xung: I(-d/c; a/c)'
    ],
    flashcards: [
      {
        front: 'Hàm số y = (ax+b)/(cx+d) có cực trị không?',
        back: 'Không bao giờ có cực trị! Vì đạo hàm y\' = (ad-bc)/(cx+d)² luôn mang một dấu không đổi trên tập xác định.',
        tip: 'Rất nhiều học sinh chọn nhầm có cực trị khi làm nhanh.'
      },
      {
        front: 'Công thức diện tích tam giác tạo bởi tiếp tuyến bất kỳ và 2 tiệm cận?',
        back: 'S = 2|ad - bc| / c². Diện tích này luôn là hằng số bất biến đối với mọi tiếp điểm!',
        tip: 'Áp dụng cho bài toán Min/Max diện tích tiếp tuyến.'
      }
    ],
    sampleProblems: [
      {
        question: 'Hàm số $y = \\frac{2x + 1}{x - 1}$ có giao điểm của hai đường tiệm cận là:',
        options: ['A. (1; 2)', 'B. (-1; 2)', 'C. (2; 1)', 'D. (1; -1)'],
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
    title: 'Hàm số trùng phương bậc bốn y = ax⁴ + bx² + c & 3 Cực Trị',
    grade: 'Lớp 12 - Giải tích',
    category: 'Giải tích',
    difficulty: 'Vận dụng',
    readTimeMinutes: 9,
    description: 'Quy tắc dấu ab < 0 có 3 cực trị, tam giác cực trị cân tại đỉnh trên trục Oy, và các công thức giải nhanh tam giác vuông cân / tam giác đều.',
    mnemonics: [
      'ab < 0 (trái dấu): 3 cực trị hình chữ W (a > 0) hoặc M (a < 0).',
      'ab ≥ 0 (cùng dấu): 1 cực trị duy nhất tại x = 0 (parabol uốn).',
      '3 điểm cực trị luôn tạo thành tam giác cân tại A(0; c) đối xứng qua trục tung Oy.'
    ],
    commonTraps: [
      'Quên rằng điểm cực trị A(0; c) luôn luôn cố định trên trục Oy.',
      'Tính sai góc ∠BAC của tam giác cực trị: tan²(A/2) = -b³ / (8a).'
    ],
    theory: [
      '1. Tập xác định: $D = R$. Hàm số chẵn: đồ thị luôn nhận trục tung Oy làm trục đối xứng.',
      '2. Đạo hàm: $y\' = 4ax^3 + 2bx = 2x(2ax^2 + b)$.',
      '3. Nếu $ab < 0$: Có 3 cực trị: $A(0; c)$, $B(-\\sqrt{-b/2a}; -\\Delta/4a)$, $C(\\sqrt{-b/2a}; -\\Delta/4a)$.',
      '4. Tam giác ABC luôn cân tại A. Độ dài cạnh đáy $BC = 2\\sqrt{-b/2a}$, chiều cao $AH = \\frac{b^2}{4a}$.',
      '5. Tam giác ABC vuông cân tại A $\\Leftrightarrow b^3 + 8a = 0$.',
      '6. Tam giác ABC đều $\\Leftrightarrow b^3 + 24a = 0$.'
    ],
    keyFormulas: [
      'y = ax^4 + bx^2 + c',
      '3\\_cuc\\_tri \\Leftrightarrow ab < 0',
      '\\Delta\\_ABC\\_vuong \\Leftrightarrow b^3 + 8a = 0',
      '\\Delta\\_ABC\\_deu \\Leftrightarrow b^3 + 24a = 0',
      'S_{\\Delta ABC} = \\sqrt{-\\frac{b^5}{32a^3}}'
    ],
    flashcards: [
      {
        front: 'Điều kiện để hàm trùng phương y = ax⁴ + bx² + c có 3 điểm cực trị tạo thành tam giác vuông cân?',
        back: 'b³ + 8a = 0 (kết hợp với ab < 0).',
        tip: 'Chứng minh từ tan(45°) = BC / (2*AH) suy ra b³ = -8a.'
      },
      {
        front: 'Điều kiện để 3 điểm cực trị tạo thành tam giác đều?',
        back: 'b³ + 24a = 0 (với ab < 0).',
        tip: 'Công thức giải nhanh trắc nghiệm 30 giây.'
      }
    ],
    sampleProblems: [
      {
        question: 'Tìm tất cả các giá trị của m để hàm số $y = x^4 - 2mx^2 + 1$ có 3 điểm cực trị tạo thành tam giác vuông cân:',
        options: ['A. m = 1', 'B. m = 2', 'C. m = -1', 'D. m = √2'],
        correctIndex: 0,
        explanation: 'Ta có a = 1, b = -2m. Áp dụng công thức giải nhanh tam giác cực trị vuông cân: b³ + 8a = 0 ⇔ (-2m)³ + 8(1) = 0 ⇔ -8m³ + 8 = 0 ⇔ m = 1. Kiểm tra ab = 1*(-2) < 0 (thỏa mãn).'
      }
    ],
    defaultGraphConfig: {
      type: 'quadratic',
      params: { a: 1, b: 0, c: -2, d: 0 },
      color: '#8b5cf6',
      name: 'y = x⁴ - 2x²'
    }
  },
  {
    id: 'math-4',
    title: 'Giá trị lớn nhất & Nhỏ nhất (Min - Max) & Bài toán tối ưu thực tế',
    grade: 'Lớp 12 - Giải tích',
    category: 'Giải tích',
    difficulty: 'Vận dụng',
    readTimeMinutes: 10,
    description: 'Quy trình tìm Min/Max trên đoạn [a; b], trên khoảng (a; b) và ứng dụng tối ưu hóa chi phí sản xuất, thể tích lớn nhất trong thực tiễn.',
    mnemonics: [
      'Trên đoạn đóng [a; b]: Chỉ cần tính f(a), f(b) và f(xᵢ) tại các điểm đạo hàm bằng 0 rồi so sánh. KHÔNG CẦN lập bảng biến thiên!',
      'Trên khoảng mở (a; b): Bắt buộc phải lập bảng biến thiên hoặc xét giới hạn tại 2 đầu mút.',
      'Bất đẳng thức Cauchy: Dấu bằng xảy ra khi tất cả các số hạng bằng nhau.'
    ],
    commonTraps: [
      'Quên loại nghiệm xᵢ không thuộc đoạn [a; b].',
      'Đề bài hỏi trên khoảng (a; b) nhưng kết luận điểm cực trị nằm ngoài khoảng.'
    ],
    theory: [
      '1. Định nghĩa: $M = \\max f(x)$ trên K nếu $f(x) \\le M, \\forall x \\in K$ và $\\exists x_0 \\in K: f(x_0) = M$.',
      '2. Quy trình tìm GTLN, GTNN trên đoạn $[a; b]$: Tính $y\'$; tìm nghiệm $x_1, x_2, ... \\in [a; b]$; tính các giá trị $f(a), f(b), f(x_1)...$; so sánh số lớn nhất là Max, số nhỏ nhất là Min.',
      '3. Bất đẳng thức Cauchy cho 2 số dương: $x + y \\ge 2\\sqrt{xy}$ (dấu = khi $x = y$).',
      '4. Bất đẳng thức Cauchy cho 3 số dương: $x + y + z \\ge 3\\sqrt[3]{xyz}$ (dấu = khi $x = y = z$).',
      '5. Kỹ thuật đưa về 1 biến trong bài toán thực tế: Tìm mối liên hệ hình học giữa bán kính R và chiều cao h để thế vào hàm thể tích.'
    ],
    keyFormulas: [
      '\\max_{[a; b]} f(x) = \\max\\{f(a), f(b), f(x_i)\\}',
      'a + b \\ge 2\\sqrt{ab} \\quad (a, b > 0)',
      'a + b + c \\ge 3\\sqrt[3]{abc} \\quad (a, b, c > 0)',
      '(ax + by)^2 \\le (a^2 + b^2)(x^2 + y^2)'
    ],
    flashcards: [
      {
        front: 'Quy trình tìm Min - Max của hàm liên tục trên đoạn [a; b] có cần vẽ bảng biến thiên không?',
        back: 'Không cần! Chỉ cần tính giá trị tại 2 đầu mút f(a), f(b) và tại các nghiệm y\' = 0 thuộc (a; b), sau đó so sánh trực tiếp.',
        tip: 'Tiết kiệm 50% thời gian làm bài trắc nghiệm.'
      }
    ],
    sampleProblems: [
      {
        question: 'Giá trị nhỏ nhất của hàm số $f(x) = x + \\frac{4}{x}$ trên đoạn $[1; 4]$ là:',
        options: ['A. 4', 'B. 5', 'C. 2', 'D. 4.25'],
        correctIndex: 0,
        explanation: 'Ta có f\'(x) = 1 - 4/x² = (x² - 4)/x². f\'(x) = 0 ⇔ x = 2 (do x ∈ [1; 4]). Tính f(1) = 1 + 4 = 5; f(4) = 4 + 1 = 5; f(2) = 2 + 2 = 4. Vậy Min = 4 tại x = 2 (hoặc dùng Cauchy trực tiếp).'
      }
    ]
  },
  {
    id: 'math-5',
    title: 'Nguyên hàm & Kỹ thuật Tích phân từng phần',
    grade: 'Lớp 12 - Giải tích',
    category: 'Giải tích',
    difficulty: 'Vận dụng',
    readTimeMinutes: 11,
    description: 'Bí kíp "Nhất Lô, Nhì Đa, Tam Lượng, Tứ Mũ" khi đặt u và dv, phương pháp múa cột vi phân - nguyên hàm đường chéo siêu tốc.',
    mnemonics: [
      'Thứ tự ưu tiên đặt u: "Nhất Lô (ln, log) - Nhì Đa (đa thức x) - Tam Lượng (sin, cos) - Tứ Mũ (eˣ, aˣ)". Đại lượng còn lại là dv.',
      'Công thức từng phần: ∫ u dv = u·v - ∫ v du.',
      'Múa cột: Cột Đạo hàm D và cột Nguyên hàm I, nhân chéo đổi dấu (+, -, +, -).'
    ],
    commonTraps: [
      'Quên đổi cận tích phân khi thực hiện phương pháp đổi biến số $t = u(x)$.',
      'Nhầm dấu trừ trong công thức tích phân từng phần: $uv - \\int v du$.'
    ],
    theory: [
      '1. Định lý cơ bản: Nếu $F(x)$ là nguyên hàm của $f(x)$ thì $\\int_a^b f(x) dx = F(b) - F(a)$.',
      '2. Phương pháp đổi biến: $\\int f(u(x)) u\'(x) dx = \\int f(u) du$. Với tích phân xác định bắt buộc phải đổi cận.',
      '3. Công thức tích phân từng phần: $\\int u dv = uv - \\int v du$. Cận từ a đến b: $\\int_a^b u dv = uv|_a^b - \\int_a^b v du$.',
      '4. Kỹ thuật múa cột (Tabular Integration):',
      '   - Cột trái: Lấy đạo hàm của u liên tục cho đến khi bằng 0 hoặc xuất hiện lại biểu thức tuần hoàn ban đầu.',
      '   - Cột phải: Lấy nguyên hàm của dv tương ứng.',
      '   - Nối chéo: đường 1 mang dấu (+), đường 2 mang dấu (-), đường 3 mang dấu (+)...',
      '5. Ứng dụng tính diện tích: $S = \\int_a^b |f(x) - g(x)| dx$. Thể tích tròn xoay quanh Ox: $V = \\pi \\int_a^b [f(x)]^2 dx$.'
    ],
    keyFormulas: [
      '\\int u dv = uv - \\int v du',
      '\\int_a^b u dv = [uv]_a^b - \\int_a^b v du',
      'S = \\int_a^b |f(x) - g(x)| dx',
      'V_{Ox} = \\pi \\int_a^b [f(x)]^2 dx'
    ],
    flashcards: [
      {
        front: 'Khẩu quyết chọn biến u khi tích phân từng phần là gì?',
        back: '"Nhất Lô, Nhì Đa, Tam Lượng, Tứ Mũ": 1. Logarit (ln x) -> 2. Đa thức (P(x)) -> 3. Lượng giác (sin, cos) -> 4. Mũ (eˣ).',
        tip: 'Phần còn lại tự động là dv.'
      },
      {
        front: 'Thể tích khối tròn xoay tạo thành khi quay đồ thị y = f(x) quanh trục Ox từ a đến b?',
        back: 'V = π ∫ [f(x)]² dx (cận từ a đến b). Đừng quên hằng số π và bình phương hàm số!',
        tip: 'Học sinh hay quên nhân với số π dẫn đến chọn sai đáp án.'
      }
    ],
    sampleProblems: [
      {
        question: 'Tích phân $I = \\int_0^1 x e^x dx$ có giá trị bằng:',
        options: ['A. 1', 'B. e - 1', 'C. e', 'D. 2'],
        correctIndex: 0,
        explanation: 'Đặt u = x => du = dx; dv = eˣ dx => v = eˣ. Ta có I = [x eˣ]|₀¹ - ∫₀¹ eˣ dx = (1*e¹ - 0) - [eˣ]|₀¹ = e - (e - 1) = 1.'
      }
    ]
  },
  {
    id: 'math-6',
    title: 'Hình học Tọa độ Oxyz: Mặt phẳng, Mặt cầu & Khoảng cách',
    grade: 'Lớp 12 - Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 9,
    description: 'Làm chủ phương trình mặt phẳng qua 1 điểm có VTPT, phương trình mặt cầu tâm I bán kính R và công thức khoảng cách từ điểm đến mặt phẳng.',
    mnemonics: [
      'Véc tơ pháp tuyến n = (A; B; C) là các hệ số đứng trước x, y, z trong Ax + By + Cz + D = 0.',
      'Khoảng cách: "Thay tọa độ điểm vào vế trái chia căn tổng bình phương VTPT".',
      'Mặt cầu cắt mặt phẳng: d(I, P) < R thì giao tuyến là đường tròn bán kính r = √(R² - d²).'
    ],
    commonTraps: [
      'Quên lấy dấu trị tuyệt đối ở tử số trong công thức khoảng cách.',
      'Nhầm lẫn giữa phương trình chính tắc và phương trình tổng quát của mặt cầu: $R^2 = a^2 + b^2 + c^2 - d$.'
    ],
    theory: [
      '1. Phương trình mặt phẳng: Qua $M_0(x_0, y_0, z_0)$ có VTPT $\\vec{n}=(A; B; C)$: $A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$.',
      '2. Khoảng cách từ điểm $M_0(x_0, y_0, z_0)$ đến $(\\alpha): Ax + By + Cz + D = 0$: $d(M_0, \\alpha) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}$.',
      '3. Phương trình mặt cầu tâm $I(a; b; c)$ bán kính $R$: $(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2$.',
      '4. Dạng khai triển mặt cầu: $x^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0$ với điều kiện $R = \\sqrt{a^2 + b^2 + c^2 - d} > 0$.',
      '5. Vị trí tương đối mặt cầu (S) và mặt phẳng (P):',
      '   - $d(I, P) > R$: Không giao nhau.',
      '   - $d(I, P) = R$: (P) tiếp xúc với (S) tại tiếp điểm H.',
      '   - $d(I, P) < R$: (P) cắt (S) theo thiết diện là đường tròn tâm H bán kính $r = \\sqrt{R^2 - d^2}$.'
    ],
    keyFormulas: [
      'd(M, P) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}',
      '(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2',
      'R = \\sqrt{a^2 + b^2 + c^2 - d}',
      'r_{duong\\_tron} = \\sqrt{R^2 - d^2}'
    ],
    flashcards: [
      {
        front: 'Công thức khoảng cách từ điểm M(x₀, y₀, z₀) đến mặt phẳng (P): Ax + By + Cz + D = 0?',
        back: 'd = |Ax₀ + By₀ + Cz₀ + D| / √(A² + B² + C²).',
        tip: 'Tử có trị tuyệt đối, mẫu có căn tổng bình phương các tọa độ VTPT.'
      },
      {
        front: 'Bán kính r của đường tròn giao tuyến giữa mặt cầu bán kính R và mặt phẳng cách tâm khoảng cách d?',
        back: 'r = √(R² - d²). Đây là định lý Pythagoras trong tam giác vuông tạo bởi tâm I, tiếp điểm và đường tròn.',
        tip: 'Điều kiện cắt là d < R.'
      }
    ],
    sampleProblems: [
      {
        question: 'Khoảng cách từ điểm $M(1; -2; 3)$ đến mặt phẳng $(P): 2x - y + 2z + 1 = 0$ là:',
        options: ['A. 11/3', 'B. 7/3', 'C. 3', 'D. 11/9'],
        correctIndex: 0,
        explanation: 'd(M, P) = |2(1) - (-2) + 2(3) + 1| / √(2² + (-1)² + 2²) = |2 + 2 + 6 + 1| / √(9) = 11 / 3.'
      }
    ]
  },
  {
    id: 'math-7',
    title: 'Thể tích Khối Đa Diện: Khối Chóp, Lăng Trụ & Tỉ số Thể tích Simson',
    grade: 'Lớp 12 - Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 10,
    description: 'Quy tắc xác định chân đường cao khối chóp, công thức tỉ số Simson cho chóp tam giác và kỹ thuật đổi đỉnh / đổi đáy trong thể tích không gian.',
    mnemonics: [
      'Chóp: V = 1/3 S_đáy · h (Có chóp nhọn thì chia 3). Lăng trụ: V = S_đáy · h (Thẳng đứng không chia 3).',
      'Chóp có các cạnh bên bằng nhau: Chân đường cao rơi đúng vào TÂM ĐƯỜNG TRÒN NGOẠI TIẾP ĐÁY.',
      'Chóp có mặt bên vuông góc đáy: Đường cao nằm trong mặt bên đó hạ vuông góc xuống giao tuyến.'
    ],
    commonTraps: [
      'Áp dụng tỉ số Simson cho chóp tứ giác là SAI (Simson chỉ đúng cho chóp tam giác S.ABC). Với chóp tứ giác phải chia thành 2 chóp tam giác!',
      'Quên chia 3 trong công thức thể tích khối chóp.'
    ],
    theory: [
      '1. Thể tích khối chóp: $V = \\frac{1}{3} B \\cdot h$ ($B$ là diện tích đáy, $h$ là chiều cao từ đỉnh đến mặt đáy).',
      '2. Thể tích khối lăng trụ: $V = B \\cdot h$. Khối hộp chữ nhật: $V = abc$. Khối lập phương: $V = a^3$.',
      '3. Tỉ số thể tích Simson (Chóp tam giác): Cho chóp $S.ABC$. Lấy $A\' \\in SA, B\' \\in SB, C\' \\in SC$: $\\frac{V_{S.A\'B\'C\'}}{V_{S.ABC}} = \\frac{SA\'}{SA} \\cdot \\frac{SB\'}{SB} \\cdot \\frac{SC\'}{SC}$.',
      '4. Kỹ thuật tỉ số khoảng cách (Đổi đỉnh): Nếu đường thẳng $AB$ cắt mặt phẳng $(\\alpha)$ tại $I$ thì $\\frac{d(A, \\alpha)}{d(B, \\alpha)} = \\frac{IA}{IB}$.',
      '5. Thể tích khối tứ diện đều cạnh $a$: $V = \\frac{a^3\\sqrt{2}}{12}$.'
    ],
    keyFormulas: [
      'V_{chop} = \\frac{1}{3} S_{day} \\cdot h',
      'V_{lang\\_tru} = S_{day} \\cdot h',
      '\\frac{V_{S.A\'B\'C\'}}{V_{S.ABC}} = \\frac{SA\'}{SA} \\cdot \\frac{SB\'}{SB} \\cdot \\frac{SC\'}{SC}',
      'V_{tu\\_dien\\_deu} = \\frac{a^3\\sqrt{2}}{12}'
    ],
    flashcards: [
      {
        front: 'Công thức tỉ số thể tích Simson áp dụng được cho loại hình chóp nào?',
        back: 'CHỈ ÁP DỤNG ĐƯỢC CHO HÌNH CHÓP TAM GIÁC (S.ABC)! Tuyệt đối không áp dụng thẳng cho chóp tứ giác.',
        tip: 'Nếu là chóp tứ giác phải kẻ đường chéo chia thành 2 chóp tam giác.'
      },
      {
        front: 'Thể tích của khối tứ diện đều cạnh a là bao nhiêu?',
        back: 'V = a³√2 / 12.',
        tip: 'Thuộc lòng công thức này để giải câu trắc nghiệm nhận biết trong 5 giây.'
      }
    ],
    sampleProblems: [
      {
        question: 'Cho hình chóp $S.ABC$ có thể tích $V = 24$. Gọi $M, N$ lần lượt là trung điểm của $SA, SB$. Thể tích khối chóp $S.MNC$ là:',
        options: ['A. 6', 'B. 12', 'C. 8', 'D. 4'],
        correctIndex: 0,
        explanation: 'Áp dụng công thức tỉ số thể tích Simson: V(S.MNC) / V(S.ABC) = (SM/SA) * (SN/SB) * (SC/SC) = (1/2) * (1/2) * 1 = 1/4. Vậy V(S.MNC) = 24 / 4 = 6.'
      }
    ]
  },
  {
    id: 'math-8',
    title: 'Hàm số Mũ & Logarit: Phương trình, Bất phương trình & Bài toán Lãi kép',
    grade: 'Lớp 12 - Giải tích',
    category: 'Lượng giác & Mũ',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 8,
    description: 'Nắm chắc điều kiện cơ số $a > 0, a \\neq 1$, các công thức đổi cơ số logarit, nghiệm phương trình mũ và bài toán lãi kép ngân hàng.',
    mnemonics: [
      'Cơ số a > 1: Hàm đồng biến, giữ nguyên chiều bất phương trình.',
      'Cơ số 0 < a < 1: Hàm nghịch biến, PHẢI ĐỔI CHIỀU bất phương trình!',
      'Logarit của tích thành tổng: log(xy) = log(x) + log(y). Logarit của thương thành hiệu.'
    ],
    commonTraps: [
      'Quên điều kiện biểu thức trong logarit phải DƯƠNG: $\\log_a f(x)$ xác định khi $f(x) > 0$.',
      'Quên đổi chiều bất phương trình khi cơ số bé hơn 1 (ví dụ $\\log_{0.5} x < 2 \\Rightarrow x > 0.5^2$).'
    ],
    theory: [
      '1. Điều kiện xác định: $\\log_a b$ có nghĩa khi $a > 0, a \\neq 1$ và $b > 0$.',
      '2. Công thức biến đổi cơ bản: $\\log_a(xy) = \\log_a x + \\log_a y$; $\\log_a(x/y) = \\log_a x - \\log_a y$; $\\log_a(x^\\alpha) = \\alpha \\log_a x$.',
      '3. Công thức đổi cơ số: $\\log_a b = \\frac{\\log_c b}{\\log_c a}$; $\\log_a b = \\frac{1}{\\log_b a}$.',
      '4. Đạo hàm hàm số mũ và logarit: $(a^x)\' = a^x \\ln a$; $(e^x)\' = e^x$; $(\\log_a x)\' = \\frac{1}{x \\ln a}$; $(\\ln x)\' = \\frac{1}{x}$.',
      '5. Công thức lãi kép gửi ngân hàng: $S_n = A(1 + r)^n$ ($A$ là vốn ban đầu, $r$ là lãi suất mỗi kỳ hạn, $n$ là số kỳ hạn).'
    ],
    keyFormulas: [
      '\\log_a(xy) = \\log_a x + \\log_a y',
      '\\log_a b = \\frac{\\ln b}{\\ln a}',
      '(a^x)\' = a^x \\ln a',
      '(\\ln x)\' = \\frac{1}{x}',
      'S_n = A(1 + r)^n'
    ],
    flashcards: [
      {
        front: 'Khi giải bất phương trình logarit log_a f(x) > log_a g(x), khi nào phải đảo chiều?',
        back: 'Khi cơ số a nằm trong khoảng 0 < a < 1 thì bất đẳng thức đổi chiều: f(x) < g(x) (kèm điều kiện f(x) > 0).',
        tip: 'Lỗi sai phổ biến nhất trong đề thi tốt nghiệp THPT.'
      }
    ],
    sampleProblems: [
      {
        question: 'Tập nghiệm của bất phương trình $\\log_{0.5}(x - 1) > -1$ là:',
        options: ['A. (1; 3)', 'B. (3; +∞)', 'C. (1; 2)', 'D. (-∞; 3)'],
        correctIndex: 0,
        explanation: 'Điều kiện: x - 1 > 0 <=> x > 1. Vì cơ số 0.5 < 1 nên đổi chiều: x - 1 < (0.5)⁻¹ = 2 <=> x < 3. Kết hợp điều kiện ta được tập nghiệm là (1; 3).'
      }
    ]
  },
  {
    id: 'math-9',
    title: 'Số Phức: Dạng Đại số z = a + bi, Môđun & Quỹ tích Hình học',
    grade: 'Lớp 12 - Giải tích',
    category: 'Số phức',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 7,
    description: 'Khái niệm đơn vị ảo $i^2 = -1$, phần thực, phần ảo, số phức liên hợp $\\bar{z}$, môđun $|z| = \\sqrt{a^2+b^2}$ và phương trình đường tròn elip biểu diễn.',
    mnemonics: [
      'Số phức z = a + bi: a là phần thực, b là phần ảo (chú ý phần ảo không chứa chữ i!).',
      'Môđun số phức tương đương độ dài véc tơ: |z| = √(a² + b²).',
      'Tập hợp điểm |z - (x₀ + y₀i)| = R là đường tròn tâm I(x₀; y₀) bán kính R.'
    ],
    commonTraps: [
      'Nói "phần ảo là bi" là SAI, phần ảo chỉ là số thực b.',
      'Nhầm tính chất môđun: $|z_1 + z_2| \\le |z_1| + |z_2|$ (bất đẳng thức tam giác, không phải dấu bằng!).'
    ],
    theory: [
      '1. Khái niệm: $z = a + bi$ ($a, b \\in R$, $i^2 = -1$). $a$ là phần thực, $b$ là phần ảo.',
      '2. Số phức liên hợp: $\\bar{z} = a - bi$. Tính chất: $z \\cdot \\bar{z} = a^2 + b^2 = |z|^2$.',
      '3. Môđun của số phức: $|z| = \\sqrt{a^2 + b^2}$. Tính chất: $|z_1 \\cdot z_2| = |z_1| \\cdot |z_2|$, $|\\frac{z_1}{z_2}| = \\frac{|z_1|}{|z_2|}$.',
      '4. Biểu diễn hình học: Điểm $M(a; b)$ trên mặt phẳng tọa độ biểu diễn số phức $z = a + bi$.',
      '5. Quỹ tích thường gặp: $|z - z_0| = R$ là đường tròn tâm biểu diễn $z_0$ bán kính $R$; $|z - z_1| = |z - z_2|$ là đường trung trực của đoạn thẳng nối 2 điểm.'
    ],
    keyFormulas: [
      'z = a + bi \\quad (i^2 = -1)',
      '\\bar{z} = a - bi',
      '|z| = \\sqrt{a^2 + b^2}',
      'z \\cdot \\bar{z} = |z|^2',
      '|z - z_0| = R \\implies (x - x_0)^2 + (y - y_0)^2 = R^2'
    ],
    flashcards: [
      {
        front: 'Phần ảo của số phức z = 3 - 4i là bao nhiêu?',
        back: 'Phần ảo là -4 (không phải -4i!).',
        tip: 'Phần thực và phần ảo luôn luôn là các số thực.'
      },
      {
        front: 'Tập hợp điểm biểu diễn số phức z thỏa mãn |z - 1 + 2i| = 3 là hình gì?',
        back: 'Đường tròn tâm I(1; -2) có bán kính R = 3. Vì |z - (1 - 2i)| = 3.',
        tip: 'Đổi dấu phần thực và phần ảo bên trong ngoặc để tìm tọa độ tâm.'
      }
    ],
    sampleProblems: [
      {
        question: 'Môđun của số phức $z = (1 + 2i)(2 - i)$ là:',
        options: ['A. 5', 'B. √5', 'C. 25', 'D. √10'],
        correctIndex: 0,
        explanation: 'Áp dụng tính chất môđun của tích: |z| = |1 + 2i| * |2 - i| = √(1² + 2²) * √(2² + (-1)²) = √5 * √5 = 5.'
      }
    ]
  },
  {
    id: 'math-10',
    title: 'Định lý Pythagoras & Hệ thức lượng Lượng giác trong Tam giác',
    grade: 'Lớp 9-10 - Hình học',
    category: 'Hình học',
    difficulty: 'Cơ bản',
    readTimeMinutes: 7,
    description: 'Hệ thức cạnh và đường cao trong tam giác vuông, định lý Cosin, định lý Sin, và công thức tính diện tích tam giác Heron.',
    mnemonics: [
      'Pythagoras: Cạnh huyền bình phương bằng tổng bình phương hai cạnh góc vuông.',
      'Định lý Cosin: a² = b² + c² - 2bc cos(A) (giống hằng đẳng thức mở rộng).',
      'Định lý Sin: a/sinA = b/sinB = c/sinC = 2R (bán kính đường tròn ngoại tiếp).'
    ],
    commonTraps: [
      'Nhầm lẫn giữa bán kính đường tròn ngoại tiếp R (chữ hoa) và nội tiếp r (chữ thường): S = pr nhưng S = abc/(4R).',
      'Áp dụng nhầm góc khi dùng định lý Cosin.'
    ],
    theory: [
      '1. Định lý Pythagoras: Trong tam giác vuông, $a^2 = b^2 + c^2$.',
      '2. Hệ thức lượng tam giác vuông: $b^2 = a \\cdot b\'$, $c^2 = a \\cdot c\'$, $h^2 = b\' \\cdot c\'$, $a \\cdot h = b \\cdot c$, $\\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}$.',
      '3. Định lý Cosin trong tam giác bất kỳ: $a^2 = b^2 + c^2 - 2bc \\cos A$.',
      '4. Định lý Sin: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$.',
      '5. Các công thức diện tích tam giác: $S = \\frac{1}{2}ah = \\frac{1}{2}ab\\sin C = \\frac{abc}{4R} = pr = \\sqrt{p(p-a)(p-b)(p-c)}$ với $p = \\frac{a+b+c}{2}$.'
    ],
    keyFormulas: [
      'a^2 = b^2 + c^2',
      'a^2 = b^2 + c^2 - 2bc\\cos A',
      '\\frac{a}{\\sin A} = 2R',
      'S = \\sqrt{p(p-a)(p-b)(p-c)}',
      'S = pr = \\frac{abc}{4R}'
    ],
    flashcards: [
      {
        front: 'Công thức tính diện tích tam giác Heron khi biết độ dài 3 cạnh a, b, c?',
        back: 'S = √[p(p - a)(p - b)(p - c)] với nửa chu vi p = (a + b + c) / 2.',
        tip: 'Rất hữu ích khi tam giác không có góc đặc biệt.'
      }
    ],
    sampleProblems: [
      {
        question: 'Cho tam giác $ABC$ có $b = 6, c = 8$, góc $A = 60^\\circ$. Độ dài cạnh $a$ là:',
        options: ['A. 2√13', 'B. 10', 'C. 2√37', 'D. √52'],
        correctIndex: 0,
        explanation: 'Áp dụng định lý Cosin: a² = b² + c² - 2bc cos(A) = 36 + 64 - 2(6)(8)(1/2) = 100 - 48 = 52. Vậy a = √52 = 2√13.'
      }
    ]
  },
  {
    id: 'math-11',
    title: 'Cực trị Hàm số chứa dấu Giá trị tuyệt đối y = |f(x)| & y = f(|x|)',
    grade: 'Lớp 12 - Giải tích',
    category: 'Giải tích',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 11,
    description: 'Công thức giải nhanh số điểm cực trị của hàm $y = |f(x)|$ là $N = a + b$ (với a là số cực trị, b là số nghiệm đơn cắt Ox) và kỹ thuật lật đồ thị.',
    mnemonics: [
      'Đồ thị y = |f(x)|: Giữ nguyên phần trên trục Ox, lật ngược phần dưới Ox lên trên.',
      'Số cực trị y = |f(x)|: Bằng (số cực trị của f(x)) + (số giao điểm cắt xuyên trục Ox).',
      'Đồ thị y = f(|x|): Bỏ phần bên trái Oy, lấy đối xứng phần bên phải qua Oy (hàm chẵn).'
    ],
    commonTraps: [
      'Điểm tiếp xúc với trục Ox (nghiệm bội chẵn) KHÔNG được tính vào số cực trị thêm!',
      'Nhầm lẫn giữa quy tắc lật đồ thị của $y = |f(x)|$ (lật qua Ox) và $y = f(|x|)$ (đối xứng qua Oy).'
    ],
    theory: [
      '1. Hàm số $y = |f(x)|$: Là hàm số luôn không âm. Đồ thị nhận được bằng cách giữ nguyên phần đồ thị $y = f(x)$ nằm phía trên trục hoành, lấy đối xứng phần nằm phía dưới qua trục hoành rồi xóa bỏ phần dưới.',
      '2. Công thức giải nhanh số điểm cực trị của $y = |f(x)|$: $N = a + b$, trong đó:',
      '   - $a$ là số điểm cực trị của hàm số $f(x)$.',
      '   - $b$ là số nghiệm đơn (hoặc bội lẻ) của phương trình $f(x) = 0$.',
      '3. Hàm số $y = f(|x|)$: Là hàm số chẵn. Đồ thị nhận trục Oy làm trục đối xứng. Được vẽ bằng cách bỏ phần bên trái Oy, giữ nguyên phần bên phải Oy và lấy đối xứng phần bên phải qua Oy.',
      '4. Số điểm cực trị của $y = f(|x|)$: $N = 2k + 1$, trong đó $k$ là số điểm cực trị dương của hàm số $f(x)$ ($x_i > 0$).'
    ],
    keyFormulas: [
      'N_{|f(x)|} = a + b',
      'N_{f(|x|)} = 2k + 1 \\quad (k: so\\_cuc\\_tri\\_duong)',
      'f(x) = 0 \\quad (chi\\_tinh\\_nghiem\\_don)'
    ],
    flashcards: [
      {
        front: 'Công thức tính số điểm cực trị của hàm số y = |f(x)|?',
        back: 'Số cực trị = a + b (với a là số cực trị của f(x), b là số nghiệm đơn của f(x) = 0).',
        tip: 'Nghiệm kép tiếp xúc Ox không làm phát sinh điểm uốn nhọn cực trị mới.'
      },
      {
        front: 'Số điểm cực trị của đồ thị hàm chẵn y = f(|x|)?',
        back: 'Số cực trị = 2k + 1 (với k là số điểm cực trị dương x > 0 của f(x)).',
        tip: 'Số 1 ở đây chính là điểm cực trị tại gốc tọa độ x = 0.'
      }
    ],
    sampleProblems: [
      {
        question: 'Cho hàm số $f(x) = x^3 - 3x + 1$. Số điểm cực trị của hàm số $y = |f(x)|$ là:',
        options: ['A. 5', 'B. 3', 'C. 4', 'D. 7'],
        correctIndex: 0,
        explanation: 'Ta có f\'(x) = 3x² - 3 = 0 có 2 nghiệm phân biệt x = ±1 => a = 2 cực trị. Giá trị cực trị: f(-1) = 3; f(1) = -1. Vì f(-1) * f(1) = -3 < 0 nên phương trình f(x) = 0 có 3 nghiệm đơn phân biệt cắt Ox => b = 3. Số điểm cực trị của |f(x)| là N = a + b = 2 + 3 = 5.'
      }
    ]
  },
  {
    id: 'math-12',
    title: 'Đại số Tổ hợp, Nhị thức Newton & Xác suất Cổ điển',
    grade: 'Lớp 11 - Đại số & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 9,
    description: 'Quy tắc đếm, phân biệt hoán vị $P_n$, chỉnh hợp $A_n^k$, tổ hợp $C_n^k$, khai triển nhị thức Newton và công thức tính xác suất $P(A) = n(A)/n(\\Omega)$.',
    mnemonics: [
      'Chỉnh hợp A(n, k): Có thứ tự vị trí (chọn ban cán sự: lớp trưởng, lớp phó).',
      'Tổ hợp C(n, k): Không phân biệt thứ tự (chọn nhóm 3 bạn đi trực nhật).',
      'Xác suất biến cố đối: P(A) = 1 - P(A đối) - cứu cánh cho các bài toán "có ít nhất một...".'
    ],
    commonTraps: [
      'Nhầm giữa chỉnh hợp và tổ hợp khi bài toán có hoặc không có sự phân công vị trí thứ tự.',
      'Không liệt kê đủ các trường hợp hoặc để các trường hợp bị trùng lặp.'
    ],
    theory: [
      '1. Quy tắc cộng và quy tắc nhân: Quy tắc cộng cho các phương án độc lập rời nhau; Quy tắc nhân cho các công đoạn liên tiếp hoàn thành công việc.',
      '2. Hoán vị: $P_n = n!$. Số cách sắp xếp n phần tử khác nhau vào n vị trí.',
      '3. Chỉnh hợp: $A_n^k = \\frac{n!}{(n - k)!}$. Chọn k phần tử từ n phần tử và CÓ SẮP THỨ TỰ.',
      '4. Tổ hợp: $C_n^k = \\frac{n!}{k!(n - k)!}$. Chọn k phần tử từ n phần tử và KHÔNG PHÂN BIỆT THỨ TỰ. Tính chất: $C_n^k = C_n^{n-k}$.',
      '5. Khai triển Nhị thức Newton: $(a + b)^n = \\sum_{k=0}^n C_n^k a^{n-k} b^k$. Số hạng tổng quát thứ $k+1$ là $T_{k+1} = C_n^k a^{n-k} b^k$.',
      '6. Xác suất cổ điển: $P(A) = \\frac{n(A)}{n(\\Omega)}$. Với biến cố đối: $P(\\bar{A}) = 1 - P(A)$.'
    ],
    keyFormulas: [
      'P_n = n!',
      'A_n^k = \\frac{n!}{(n - k)!}',
      'C_n^k = \\frac{n!}{k!(n - k)!}',
      'T_{k+1} = C_n^k a^{n-k} b^k',
      'P(A) = \\frac{n(A)}{n(\\Omega)}'
    ],
    flashcards: [
      {
        front: 'Làm thế nào để phân biệt khi nào dùng Chỉnh hợp A(n, k) và Tổ hợp C(n, k)?',
        back: 'Hỏi câu hỏi: "Nếu đổi chỗ 2 phần tử được chọn, có tạo ra kết quả mới không?" Có đổi thứ tự -> Chỉnh hợp A. Không đổi -> Tổ hợp C.',
        tip: 'Ví dụ: Chọn 3 người đi quét sân là C. Chọn 1 lớp trưởng, 1 lớp phó là A.'
      },
      {
        front: 'Khi gặp cụm từ "có ít nhất một..." trong bài toán xác suất, nên làm gì?',
        back: 'Dùng biến cố đối! P(A) = 1 - P(A đối), trong đó A đối là trường hợp "không có cái nào...".',
        tip: 'Nhanh hơn gấp 3 lần so với chia 4-5 trường hợp thuận.'
      }
    ],
    sampleProblems: [
      {
        question: 'Một hộp đựng 5 viên bi xanh và 4 viên bi đỏ. Chọn ngẫu nhiên 3 viên bi. Xác suất để chọn được ít nhất 1 viên bi xanh là:',
        options: ['A. 20/21', 'B. 1/21', 'C. 10/21', 'D. 19/21'],
        correctIndex: 0,
        explanation: 'Không gian mẫu n(Ω) = C(9, 3) = 84. Xét biến cố đối A\': "Không chọn được viên bi xanh nào" (cả 3 viên đều đỏ) => n(A\') = C(4, 3) = 4. Vậy P(A) = 1 - n(A\')/n(Ω) = 1 - 4/84 = 80/84 = 20/21.'
      }
    ]
  },
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
    }
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
    }
  },
  // ==========================================
  // LỚP 10: TAM THỨC BẬC HAI & HÌNH HỌC VECTƠ
  // ==========================================
  {
    id: 'math-10-1',
    title: 'Tam thức bậc hai y = ax² + bx + c & Dấu tam thức',
    grade: 'Lớp 10 - Đại số',
    category: 'Đại số',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 8,
    description: 'Quy tắc xét dấu trong trái ngoài cùng, tọa độ đỉnh I(-b/2a, -Δ/4a), trục đối xứng x = -b/2a và giải bất phương trình bậc hai.',
    mnemonics: [
      'Đỉnh Parabol: I(-b / (2a); -Δ / (4a)).',
      'Dấu tam thức khi Δ > 0: Trong khoảng 2 nghiệm TRÁI dấu a, ngoài khoảng CÙNG dấu a (Trong trái ngoài cùng).',
      'Khi Δ ≤ 0: Tam thức luôn cùng dấu với hệ số a với mọi x.'
    ],
    commonTraps: [
      'Quên đảo chiều bất phương trình khi chia cho số âm a < 0.',
      'Quên xét trường hợp a = 0 khi đề bài chứa tham số m.'
    ],
    theory: [
      '1. Đồ thị hàm số $y = ax^2 + bx + c$ ($a \\neq 0$) là parabol có đỉnh $I(-\\frac{b}{2a}; -\\frac{\\Delta}{4a})$ và trục đối xứng $x = -\\frac{b}{2a}$.',
      '2. Định lý về dấu của tam thức bậc hai $f(x) = ax^2 + bx + c$:',
      '   - Nếu $\\Delta < 0$: $a \\cdot f(x) > 0, \\forall x \\in R$ (cùng dấu a).',
      '   - Nếu $\\Delta = 0$: $a \\cdot f(x) > 0, \\forall x \\neq -\\frac{b}{2a}$.',
      '   - Nếu $\\Delta > 0$: $f(x)$ cùng dấu với a ngoài đoạn $[x_1; x_2]$ và trái dấu với a trong khoảng $(x_1; x_2)$.'
    ],
    keyFormulas: [
      'y = ax^2 + bx + c',
      'x_I = -\\frac{b}{2a}, \\quad y_I = -\\frac{\\Delta}{4a}',
      'f(x) > 0, \\forall x \\in R \\iff a > 0 \\land \\Delta < 0'
    ],
    flashcards: [
      {
        front: 'Điều kiện để tam thức f(x) = ax² + bx + c luôn dương với mọi x thuộc R?',
        back: 'a > 0 và biệt thức Δ < 0.',
        tip: 'Nếu f(x) ≥ 0 thì thêm dấu bằng ở delta: Δ ≤ 0.'
      }
    ],
    sampleProblems: [
      {
        question: 'Tập nghiệm của bất phương trình $x^2 - 4x + 3 < 0$ là:',
        options: ['A. (1; 3)', 'B. (-∞; 1) ∪ (3; +∞)', 'C. [1; 3]', 'D. (-3; -1)'],
        correctIndex: 0,
        explanation: 'Tam thức $x^2 - 4x + 3 = 0$ có 2 nghiệm $x=1, x=3$. Hệ số a = 1 > 0. Cần tìm $f(x) < 0$ (trái dấu a) nên lấy trong khoảng 2 nghiệm: x ∈ (1; 3).'
      }
    ],
    defaultGraphConfig: {
      type: 'quadratic',
      params: { a: 1, b: -4, c: 3, d: 0 },
      color: '#10b981',
      name: 'y = x² - 4x + 3'
    }
  },
  {
    id: 'math-10-2',
    title: 'Tích vô hướng hai vectơ & Định lý Cosin trong tam giác',
    grade: 'Lớp 10 - Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 8,
    description: 'Định nghĩa tích vô hướng u · v = |u||v|cosθ, định lý hàm số cosin a² = b² + c² - 2bc cosA và ứng dụng giải tam giác tổng quát.',
    mnemonics: [
      'Tích vô hướng là một CON SỐ, không phải vectơ.',
      'Hai vectơ vuông góc khi và chỉ khi tích vô hướng bằng 0: u · v = 0.',
      'Định lý Cosin là mở rộng của định lý Pytago cho góc bất kỳ.'
    ],
    commonTraps: [
      'Quên dấu trừ trước 2bc cosA trong công thức định lý Cosin.',
      'Nhầm lẫn giữa tích vô hướng (số) và tích có hướng trong không gian (vectơ).'
    ],
    theory: [
      '1. Tích vô hướng: $\\vec{u} \\cdot \\vec{v} = |\\vec{u}| \\cdot |\\vec{v}| \\cdot \\cos(\\vec{u}, \\vec{v})$.',
      '2. Trong hệ tọa độ Oxy: $\\vec{u}(x_1; y_1), \\vec{v}(x_2; y_2) \\implies \\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2$.',
      '3. Định lý hàm số Cosin trong tam giác ABC: $a^2 = b^2 + c^2 - 2bc \\cos A$.',
      '4. Hệ quả tính góc: $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$.',
      '5. Định lý hàm số Sin: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$.'
    ],
    keyFormulas: [
      '\\vec{u} \\cdot \\vec{v} = |\\vec{u}| |\\vec{v}| \\cos \\theta = x_1 x_2 + y_1 y_2',
      'a^2 = b^2 + c^2 - 2bc \\cos A',
      '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R',
      'S = \\frac{1}{2} b c \\sin A = \\frac{a b c}{4R} = p r'
    ],
    flashcards: [
      {
        front: 'Hai vectơ u(x₁, y₁) và v(x₂, y₂) vuông góc khi nào?',
        back: 'x₁x₂ + y₁y₂ = 0 (tích vô hướng bằng 0).',
        tip: 'Áp dụng để lập phương trình đường cao hoặc tiếp tuyến.'
      }
    ],
    sampleProblems: [
      {
        question: 'Tam giác ABC có b = 6, c = 8, góc A = 60°. Độ dài cạnh a là:',
        options: ['A. 2√13', 'B. 10', 'C. 2√37', 'D. 8'],
        correctIndex: 0,
        explanation: 'a² = b² + c² - 2bc·cos(60°) = 36 + 64 - 2·6·8·0.5 = 100 - 48 = 52. Suy ra a = √52 = 2√13.'
      }
    ]
  },
  // ==========================================
  // LỚP 11: LƯỢNG GIÁC, ĐẠO HÀM & CẤP SỐ
  // ==========================================
  {
    id: 'math-11-1',
    title: 'Hàm số Lượng giác y = sin(x), cos(x) & Phương trình cơ bản',
    grade: 'Lớp 11 - Lượng giác & Mũ',
    category: 'Lượng giác & Mũ',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 9,
    description: 'Tính tuần hoàn, tập giá trị [-1; 1], đồ thị hình sóng sin/cos, và công thức nghiệm phương trình lượng giác cơ bản.',
    mnemonics: [
      'Hàm số sin(x) tuần hoàn chu kỳ 2π, là hàm lẻ (đối xứng qua gốc O).',
      'Hàm số cos(x) tuần hoàn chu kỳ 2π, là hàm chẵn (đối xứng qua trục Oy).',
      'Sin bù: sin(x) = sin(α) <=> x = α + k2π hoặc x = π - α + k2π.',
      'Cos đối: cos(x) = cos(α) <=> x = ±α + k2π.'
    ],
    commonTraps: [
      'Quên họ nghiệm bù π - α khi giải sin(x) = sin(α).',
      'Quên đuôi chu kỳ k2π đối với sin/cos, và kπ đối với tan/cot.'
    ],
    theory: [
      '1. Hàm số $y = \\sin x$: Tập xác định R, tập giá trị $[-1; 1]$, tuần hoàn chu kỳ $2\\pi$.',
      '2. Hàm số $y = \\cos x$: Tập xác định R, tập giá trị $[-1; 1]$, tuần hoàn chu kỳ $2\\pi$.',
      '3. Phương trình $\\sin x = m$: Có nghiệm $\\iff |m| \\le 1$. Khi đó $x = \\arcsin(m) + k2\\pi$ hoặc $x = \\pi - \\arcsin(m) + k2\\pi$.',
      '4. Phương trình $\\cos x = m$: Có nghiệm $\\iff |m| \\le 1$. Khi đó $x = \\pm \\arccos(m) + k2\\pi$.'
    ],
    keyFormulas: [
      '\\sin x = \\sin \\alpha \\iff x = \\alpha + k2\\pi \\lor x = \\pi - \\alpha + k2\\pi',
      '\\cos x = \\cos \\alpha \\iff x = \\pm \\alpha + k2\\pi',
      '\\tan x = \\tan \\alpha \\iff x = \\alpha + k\\pi \\quad (k \\in Z)'
    ],
    flashcards: [
      {
        front: 'Phương trình sin(x) = 1 có nghiệm đặc biệt là gì?',
        back: 'x = π/2 + k2π (chỉ có 1 điểm cực đại trên đường tròn lượng giác).',
        tip: 'sin(x) = -1 <=> x = -π/2 + k2π; sin(x) = 0 <=> x = kπ.'
      }
    ],
    sampleProblems: [
      {
        question: 'Số nghiệm của phương trình $\\sin x = 0.5$ trên đoạn $[0; 2\\pi]$ là:',
        options: ['A. 2', 'B. 1', 'C. 4', 'D. 0'],
        correctIndex: 0,
        explanation: 'sin(x) = 1/2 <=> x = π/6 + k2π hoặc x = 5π/6 + k2π. Trong đoạn [0; 2π] có đúng 2 nghiệm: π/6 và 5π/6.'
      }
    ],
    defaultGraphConfig: {
      type: 'trig_sin',
      params: { a: 1, b: 1, c: 0, d: 0 },
      color: '#f59e0b',
      name: 'y = sin(x)'
    }
  },
  {
    id: 'math-11-2',
    title: 'Đạo hàm & Ý nghĩa hình học / Phương trình tiếp tuyến',
    grade: 'Lớp 11 - Giải tích',
    category: 'Giải tích',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 9,
    description: 'Quy tắc tính đạo hàm hàm hợp, hệ số góc tiếp tuyến k = f\'(x₀) và phương trình tiếp tuyến của đồ thị tại điểm M(x₀, y₀).',
    mnemonics: [
      'Đạo hàm tại x₀ chính là HỆ SỐ GÓC của tiếp tuyến tại điểm đó: k = f\'(x₀).',
      'Tiếp tuyến song song với d: y = ax + b <=> f\'(x₀) = a.',
      'Tiếp tuyến vuông góc với d: y = ax + b <=> f\'(x₀) = -1/a.'
    ],
    commonTraps: [
      'Nhầm lẫn giữa tiếp tuyến TẠI điểm M(x₀, y₀) và tiếp tuyến ĐI QUA điểm A(x_A, y_A).',
      'Tính sai đạo hàm hàm hợp: (u^n)\' = n · u^(n-1) · u\'.'
    ],
    theory: [
      '1. Định nghĩa: $f\'(x_0) = \\lim_{x \\to x_0} \\frac{f(x) - f(x_0)}{x - x_0}$.',
      '2. Ý nghĩa hình học: $f\'(x_0)$ là hệ số góc của tiếp tuyến của đồ thị $(C)$ tại $M(x_0; f(x_0))$.',
      '3. Phương trình tiếp tuyến tại $M(x_0; y_0)$: $y = f\'(x_0)(x - x_0) + y_0$.',
      '4. Các đạo hàm cơ bản: $(x^n)\' = n x^{n-1}$; $(\\sqrt{x})\' = \\frac{1}{2\\sqrt{x}}$; $(\\frac{1}{x})\' = -\\frac{1}{x^2}$; $(\\sin x)\' = \\cos x$; $(\\cos x)\' = -\\sin x$.'
    ],
    keyFormulas: [
      'y = f\'(x_0)(x - x_0) + y_0 \\quad (\\text{Phương trình tiếp tuyến})',
      'k = f\'(x_0) = \\tan \\alpha \\quad (\\text{Hệ số góc})',
      '(u \\cdot v)\' = u\'v + uv\', \\quad \\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}'
    ],
    flashcards: [
      {
        front: 'Phương trình tiếp tuyến của đồ thị hàm số y = f(x) tại điểm M(x₀; y₀)?',
        back: 'y = f\'(x₀)(x - x₀) + y₀.',
        tip: 'Cần xác định đủ 3 yếu tố: x₀, y₀ = f(x₀), và f\'(x₀).'
      }
    ],
    sampleProblems: [
      {
        question: 'Phương trình tiếp tuyến của đồ thị hàm số $y = x^2 - 3x + 1$ tại điểm có hoành độ $x_0 = 2$ là:',
        options: ['A. y = x - 3', 'B. y = x - 1', 'C. y = 2x - 5', 'D. y = -x + 1'],
        correctIndex: 0,
        explanation: 'Ta có $y_0 = 2^2 - 3(2) + 1 = -1$. Đạo hàm $y\' = 2x - 3 \\implies y\'(2) = 2(2) - 3 = 1$. Phương trình tiếp tuyến: $y = 1(x - 2) + (-1) = x - 3$.'
      }
    ],
    defaultGraphConfig: {
      type: 'quadratic',
      params: { a: 1, b: -3, c: 1, d: 0 },
      showTangent: true,
      tangentX0: 2,
      color: '#8b5cf6',
      name: 'y = x² - 3x + 1'
    }
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
      '1. Trong $\\triangle ABC$ vuông tại $A$, đường cao $AH = h$, cạnh huyền $BC = a$, hình chiếu $BH = c\', CH = b\'$: $b^2 = a \\cdot b\'$, $c^2 = a \\cdot c\'$, $h^2 = b\' \\cdot c\'$, $a \\cdot h = b \\cdot c$, $\\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}$.',
      '2. Tỉ số lượng giác góc nhọn $\\alpha$: $\\sin^2 \\alpha + \\cos^2 \\alpha = 1$, $\\tan \\alpha \\cdot \\cot \\alpha = 1$.',
      '3. Góc ở tâm có số đo bằng số đo cung bị chắn; góc nội tiếp và góc tạo bởi tia tiếp tuyến và dây cung cùng chắn một cung thì bằng nhau và bằng nửa số đo cung đó.',
      '4. Tứ giác nội tiếp đường tròn khi và chỉ khi tổng hai góc đối bằng $180^\\circ$ hoặc hai đỉnh kề nhau cùng nhìn một cạnh dưới hai góc bằng nhau.'
    ],
    keyFormulas: [
      'h^2 = b\' \\cdot c\', \\quad \\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}',
      '\\sin^2 \\alpha + \\cos^2 \\alpha = 1',
      '\\widehat{ACB} = \\frac{1}{2} \\text{sđ}\\wideparen{AB} \\quad (\\text{Góc nội tiếp})'
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
    ]
  },
  {
    id: 'math-11-3',
    title: 'Cấp số cộng (CSC) & Cấp số nhân (CSN)',
    grade: 'Lớp 11 - Đại số & Xác suất',
    category: 'Đại số & Xác suất',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 8,
    description: 'Công thức số hạng tổng quát $u_n$, tính chất ba số hạng liên tiếp và tổng $n$ số hạng đầu $S_n$ của cấp số cộng và cấp số nhân.',
    mnemonics: [
      'Cấp số cộng: Cộng thêm công sai $d \\implies u_n = u_1 + (n-1)d$.',
      'Cấp số nhân: Nhân thêm công bội $q \\implies u_n = u_1 \\cdot q^{n-1}$.',
      'Tổng cấp số cộng giống tính diện tích hình thang: $S_n = \\frac{(u_1 + u_n)n}{2}$.'
    ],
    commonTraps: [
      'Nhầm số mũ trong cấp số nhân là $q^n$ thay vì $q^{n-1}$.',
      'Áp dụng công thức $S_n = u_1 \\frac{1 - q^n}{1 - q}$ khi $q = 1$ (khi $q=1$ thì $S_n = n \\cdot u_1$).'
    ],
    theory: [
      '1. Cấp số cộng $(u_n)$ công sai $d$: $u_{n+1} = u_n + d$. Số hạng tổng quát: $u_n = u_1 + (n - 1)d$. Tính chất: $u_k = \\frac{u_{k-1} + u_{k+1}}{2}$.',
      '2. Tổng $n$ số hạng đầu CSC: $S_n = \\frac{n(u_1 + u_n)}{2} = \\frac{n[2u_1 + (n - 1)d]}{2}$.',
      '3. Cấp số nhân $(u_n)$ công bội $q$: $u_{n+1} = u_n \\cdot q$. Số hạng tổng quát: $u_n = u_1 \\cdot q^{n-1}$. Tính chất: $u_k^2 = u_{k-1} \\cdot u_{k+1}$.',
      '4. Tổng $n$ số hạng đầu CSN ($q \\neq 1$): $S_n = u_1 \\cdot \\frac{1 - q^n}{1 - q}$.'
    ],
    keyFormulas: [
      'u_n = u_1 + (n-1)d, \\quad S_n = \\frac{n(u_1 + u_n)}{2}',
      'u_n = u_1 \\cdot q^{n-1}, \\quad S_n = u_1 \\frac{1 - q^n}{1 - q} \\; (q \\neq 1)',
      'S = \\frac{u_1}{1 - q} \\quad (\\text{CSN lùi vô hạn } |q| < 1)'
    ],
    flashcards: [
      {
        front: 'Ba số a, b, c lập thành cấp số nhân khi nào?',
        back: 'b² = a · c.',
        tip: 'Còn lập thành cấp số cộng khi 2b = a + c.'
      }
    ],
    sampleProblems: [
      {
        question: 'Cho cấp số cộng $(u_n)$ có $u_1 = 3$ và công sai $d = 4$. Số hạng $u_5$ và tổng 5 số hạng đầu $S_5$ lần lượt là:',
        options: ['A. u₅ = 19, S₅ = 55', 'B. u₅ = 23, S₅ = 65', 'C. u₅ = 19, S₅ = 45', 'D. u₅ = 15, S₅ = 55'],
        correctIndex: 0,
        explanation: '$u_5 = u_1 + 4d = 3 + 4 \\cdot 4 = 19$. Tổng $S_5 = \\frac{5(u_1 + u_5)}{2} = \\frac{5(3 + 19)}{2} = 55$.'
      }
    ]
  },
  {
    id: 'math-11-4',
    title: 'Quan hệ Vuông góc, Góc & Khoảng cách trong Không gian',
    grade: 'Lớp 11 - Hình học',
    category: 'Hình học',
    difficulty: 'Vận dụng',
    readTimeMinutes: 12,
    description: 'Phương pháp tìm góc giữa đường thẳng và mặt phẳng, góc giữa hai mặt phẳng (nhị diện) và 3 bước dựng khoảng cách từ điểm đến mặt phẳng.',
    mnemonics: [
      'Muốn chứng minh đường $d \\perp (P)$, hãy chỉ ra $d$ vuông góc với HAI đường thẳng cắt nhau nằm trong $(P)$.',
      'Tìm góc $(SA, (ABC))$: Tìm chân đường vuông góc $H$ của $S$ xuống $(ABC)$, góc là $\\widehat{SAH}$.',
      'Tính khoảng cách từ chân đường cao $H$ đến mặt bên $(SBC)$: Kẻ $HK \\perp BC$ (chân cạnh đáy), nối $SK$, kẻ $HI \\perp SK \\implies d(H, (SBC)) = HI$.'
    ],
    commonTraps: [
      'Xác định sai giao tuyến hoặc kẻ không vuông góc giao tuyến khi tính góc giữa hai mặt phẳng.',
      'Quên đổi điểm về chân đường vuông góc bằng tỉ lệ đồng dạng khi tính khoảng cách từ điểm bất kỳ.'
    ],
    theory: [
      '1. Đường thẳng vuông góc mặt phẳng: $d \\perp a, d \\perp b$ ($a, b \\subset (P), a \\cap b = I$) $\\implies d \\perp (P)$.',
      '2. Định lý ba đường vuông góc: Hình chiếu vuông góc $a\'$ của $a$ trên $(P)$ vuông góc với $b \\subset (P)$ khi và chỉ khi $a \\perp b$.',
      '3. Khoảng cách từ chân đường cao $H$ đến mặt bên $(SAB)$: Kẻ $HK \\perp AB$, kẻ $HI \\perp SK \\implies HI \\perp (SAB) \\implies d(H, (SAB)) = HI$ với $\\frac{1}{HI^2} = \\frac{1}{SH^2} + \\frac{1}{HK^2}$.',
      '4. Thể tích khối chóp & lăng trụ: $V_{chop} = \\frac{1}{3} S_{day} \\cdot h$; $V_{lang\\ tru} = S_{day} \\cdot h$.'
    ],
    keyFormulas: [
      '\\frac{1}{d(H,(SBC))^2} = \\frac{1}{SH^2} + \\frac{1}{HK^2}',
      'V_{chop} = \\frac{1}{3} S_{day} \\cdot h',
      '\\frac{V_{S.A\'B\'C\'}}{V_{S.ABC}} = \\frac{SA\'}{SA} \\cdot \\frac{SB\'}{SB} \\cdot \\frac{SC\'}{SC}'
    ],
    flashcards: [
      {
        front: 'Công thức nhanh diện tích tam giác đều cạnh a và đường cao tam giác đều?',
        back: 'Diện tích S = (a²√3)/4; đường cao h = (a√3)/2.',
        tip: 'Bán kính ngoại tiếp R = (a√3)/3, bán kính nội tiếp r = (a√3)/6.'
      }
    ],
    sampleProblems: [
      {
        question: 'Cho hình chóp $S.ABC$ có $SA \\perp (ABC)$, $SA = a\\sqrt{3}$, đáy $ABC$ là tam giác đều cạnh $a$. Góc giữa $SB$ và mặt phẳng $(ABC)$ bằng:',
        options: ['A. 60°', 'B. 30°', 'C. 45°', 'D. 90°'],
        correctIndex: 0,
        explanation: 'Vì $SA \\perp (ABC)$ nên $AB$ là hình chiếu của $SB$ lên $(ABC)$. Suy ra $\\widehat{(SB, (ABC))} = \\widehat{SBA}$. Trong $\\triangle SAB$ vuông tại $A$: $\\tan \\widehat{SBA} = \\frac{SA}{AB} = \\frac{a\\sqrt{3}}{a} = \\sqrt{3} \\implies \\widehat{SBA} = 60^\\circ$.'
      }
    ]
  },
  {
    id: 'math-12-3',
    title: 'Khối tròn xoay: Mặt Nón, Mặt Trụ & Mặt Cầu 3D',
    grade: 'Lớp 12 - Hình học',
    category: 'Hình học',
    difficulty: 'Thông hiểu',
    readTimeMinutes: 10,
    description: 'Hệ thống công thức diện tích xung quanh, diện tích toàn phần, thể tích mặt nón - mặt trụ - mặt cầu và bài toán thiết diện cắt qua trục hoặc song song trục.',
    mnemonics: [
      'Hình Nón: $l^2 = h^2 + r^2$; $S_{xq} = \\pi r l$; $V = \\frac{1}{3} \\pi r^2 h$ (có hệ số $1/3$ giống khối chóp).',
      'Hình Trụ: $l = h$; $S_{xq} = 2 \\pi r h$; $V = \\pi r^2 h$ (giống khối lăng trụ).',
      'Mặt Cầu: $S = 4 \\pi R^2$; $V = \\frac{4}{3} \\pi R^3$.'
    ],
    commonTraps: [
      'Nhầm đường sinh $l$ với chiều cao $h$ trong hình nón.',
      'Tính $S_{tp}$ hình trụ quên nhân 2 diện tích đáy: $S_{tp} = 2\\pi r h + 2\\pi r^2$.'
    ],
    theory: [
      '1. Khối nón (bán kính $r$, chiều cao $h$, đường sinh $l = \\sqrt{r^2 + h^2}$): $S_{xq} = \\pi r l$, $S_{tp} = \\pi r l + \\pi r^2$, $V = \\frac{1}{3} \\pi r^2 h$.',
      '2. Khối trụ (bán kính $r$, chiều cao $h = l$): $S_{xq} = 2\\pi r h$, $S_{tp} = 2\\pi r h + 2\\pi r^2$, $V = \\pi r^2 h$.',
      '3. Khối cầu (bán kính $R$): $S_{cau} = 4\\pi R^2$, $V_{cau} = \\frac{4}{3} \\pi R^3$. Giao tuyến của mặt phẳng $(P)$ cách tâm $O$ khoảng $d < R$ với mặt cầu là đường tròn bán kính $r = \\sqrt{R^2 - d^2}$.',
      '4. Công thức nhanh bán kính mặt cầu ngoại tiếp hình chóp có cạnh bên $SA \\perp$ đáy: $R_{mc} = \\sqrt{R_{day}^2 + \\left(\\frac{SA}{2}\\right)^2}$.'
    ],
    keyFormulas: [
      'V_{non} = \\frac{1}{3} \\pi r^2 h, \\quad S_{xq\\,non} = \\pi r l',
      'V_{tru} = \\pi r^2 h, \\quad S_{xq\\,tru} = 2\\pi r h',
      'S_{cau} = 4\\pi R^2, \\quad V_{cau} = \\frac{4}{3} \\pi R^3',
      'R_{mc} = \\sqrt{R_{day}^2 + \\left(\\frac{h}{2}\\right)^2}'
    ],
    flashcards: [
      {
        front: 'Bán kính đường tròn giao tuyến khi mặt phẳng (P) cắt mặt cầu S(O; R) với d(O, (P)) = d < R?',
        back: 'r = √(R² - d²).',
        tip: 'Thử tương tác trực tiếp bài toán Mặt Cầu & Thiết Diện tại tab Không gian Oxyz 3D!'
      }
    ],
    sampleProblems: [
      {
        question: 'Cho hình nón có bán kính đáy $r = 3\\text{ cm}$ và chiều cao $h = 4\\text{ cm}$. Diện tích xung quanh của hình nón bằng:',
        options: ['A. 15π cm²', 'B. 12π cm²', 'C. 24π cm²', 'D. 30π cm²'],
        correctIndex: 0,
        explanation: 'Đường sinh hình nón: $l = \\sqrt{r^2 + h^2} = \\sqrt{3^2 + 4^2} = 5\\text{ cm}$. Diện tích xung quanh: $S_{xq} = \\pi r l = \\pi \\cdot 3 \\cdot 5 = 15\\pi\\text{ cm}^2$.'
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
      { id: 1, input: '5 7\n1 3 5 7 9', expectedOutput: '4', isSample: true, explanation: 'Số 7 nằm ở vị trí thứ 4' },
      { id: 2, input: '4 4\n1 2 3 5', expectedOutput: '-1', isSample: true, explanation: 'Không có số 4 trong mảng' }
    ],
    hiddenCases: [
      { id: 3, input: '6 5\n2 4 5 5 5 8', expectedOutput: '3' },
      { id: 4, input: '1 10\n10', expectedOutput: '1' },
      { id: 5, input: '5 1\n2 4 6 8 10', expectedOutput: '-1' },
      { id: 6, input: '7 99\n1 5 12 25 60 99 105', expectedOutput: '6' }
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
    inputFormat: 'Dòng 1: Hai số nguyên N và W.\nDòng 2..N+1: Mỗi dòng chứa 2 số nguyên w_i và v_i là khối lượng và giá trị món đồ i.',
    outputFormat: 'In ra một số nguyên là tổng giá trị lớn nhất đạt được.',
    constraints: ['1 <= N <= 100', '1 <= W <= 1000', '1 <= w_i, v_i <= 1000'],
    sampleCases: [
      { id: 1, input: '3 50\n10 60\n20 100\n30 120', expectedOutput: '220', isSample: true, explanation: 'Chọn món 2 (20kg, 100) và món 3 (30kg, 120): tổng khối lượng 50, giá trị 220.' }
    ],
    hiddenCases: [
      { id: 2, input: '4 7\n1 1\n3 4\n4 5\n5 7', expectedOutput: '9' },
      { id: 3, input: '2 3\n4 10\n5 20', expectedOutput: '0' },
      { id: 4, input: '5 10\n2 3\n3 4\n4 5\n5 8\n9 10', expectedOutput: '15' }
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

