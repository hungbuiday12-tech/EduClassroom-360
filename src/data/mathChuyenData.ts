import { FunctionPlotConfig, MathEssayProblem, MathLecture } from '../types';
import { Math3DMode } from '../components/math/Math3DView';

export interface MathLectureSupplement {
  track: 'khong_chuyen';
  gradeGroup: 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12';
  sim2dMode: 'grapher' | 'geometry';
  sim3dMode: Math3DMode;
  defaultGraphConfig?: Partial<FunctionPlotConfig>;
  essayProblems: MathEssayProblem[];
}

export const MATH_METADATA_AND_ESSAYS: Record<string, MathLectureSupplement> = {
  'math-1': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    essayProblems: [
      {
        source: 'VietJack · Giải tích 12 KNTT',
        question:
          'Cho hàm số $y = x^3 - 3mx^2 + 3(m^2 - 1)x - m^3 + 1$. Tìm giá trị của tham số $m$ để đồ thị hàm số có hai điểm cực trị $A, B$ sao cho tam giác $OAB$ vuông tại gốc tọa độ $O$.',
        hints: ['Tính $y\' = 3(x^2 - 2mx + m^2 - 1) = 0$ để tìm trực tiếp $x_1 = m - 1, x_2 = m + 1$, rồi tính $\\vec{OA} \\cdot \\vec{OB} = 0$.'],
        solutionSteps: [
          'Bước 1: $y\' = 3x^2 - 6mx + 3(m^2 - 1) = 0 \\iff (x - m)^2 = 1 \\iff x_1 = m - 1, x_2 = m + 1$ (luôn có 2 cực trị $\\forall m$).',
          'Bước 2: Viết gọn $y = (x - m)^3 - 3x + 1$, suy ra tọa độ hai điểm cực trị là $A(m - 1; 3 - 3m)$ và $B(m + 1; -1 - 3m)$.',
          'Bước 3: $\\vec{OA} \\cdot \\vec{OB} = (m - 1)(m + 1) + (3 - 3m)(-1 - 3m) = (m^2 - 1) + (9m^2 - 6m - 3) = 10m^2 - 6m - 4 = 0$.',
          'Bước 4: Giải phương trình bậc hai: $5m^2 - 3m - 2 = 0 \\iff m = 1$ hoặc $m = -\\frac{2}{5}$.'
        ],
        finalAnswer: '$m = 1$ hoặc $m = -\\frac{2}{5}$.'
      },
      {
        source: 'Loigiaihay · Khảo sát hàm bậc ba 12',
        question:
          'Tìm tất cả giá trị của $m$ để hàm số $y = \\frac{1}{3}x^3 - mx^2 + (m + 2)x - 1$ đồng biến trên toàn tập số thực $\\mathbb{R}$.',
        hints: ['Hàm bậc ba có $a = \\frac{1}{3} > 0$ đồng biến trên $\\mathbb{R} \\iff y\' \\ge 0, \\forall x \\in \\mathbb{R} \\iff \\Delta\' \\le 0$.'],
        solutionSteps: [
          'Bước 1: Đạo hàm $y\' = x^2 - 2mx + (m + 2)$.',
          'Bước 2: Vì hệ số bậc hai bằng $1 > 0$, yêu cầu bài toán $\\iff \\Delta\' = m^2 - (m + 2) \\le 0$.',
          'Bước 3: $m^2 - m - 2 \\le 0 \\iff (m + 1)(m - 2) \\le 0 \\iff -1 \\le m \\le 2$.'
        ],
        finalAnswer: '$-1 \\le m \\le 2$.'
      }
    ]
  },
  'math-2': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    essayProblems: [
      {
        source: 'VietJack · Giải tích 12 · Hàm phân thức',
        question:
          'Cho hàm số $y = \\frac{x + 2}{x - 1}$ có đồ thị $(C)$. Viết phương trình tiếp tuyến của $(C)$ tại giao điểm của $(C)$ với trục tung $Oy$.',
        hints: ['Giao điểm với $Oy$ có hoành độ $x_0 = 0$. Tính $y_0 = y(0)$ và hệ số góc $k = y\'(0)$.'],
        solutionSteps: [
          'Bước 1: Giao điểm với $Oy$ ứng với $x_0 = 0 \\implies y_0 = \\frac{0 + 2}{0 - 1} = -2$. Tiếp điểm $M(0; -2)$.',
          'Bước 2: Đạo hàm $y\' = \\frac{1(-1) - 2(1)}{(x - 1)^2} = \\frac{-3}{(x - 1)^2} \\implies k = y\'(0) = -3$.',
          'Bước 3: Phương trình tiếp tuyến: $y = -3(x - 0) - 2 = -3x - 2$.'
        ],
        finalAnswer: '$y = -3x - 2$.'
      },
      {
        source: 'Loigiaihay · Cực trị & Đơn điệu hàm phân thức',
        question:
          'Tìm tất cả các giá trị thực của tham số $m$ để hàm số $y = \\frac{mx - 4}{x - m}$ nghịch biến trên khoảng $(-\\infty; 1)$.',
        hints: ['Điều kiện: tử đạo hàm $ad - bc = -m^2 + 4 < 0$ VÀ điểm gián đoạn $x = m$ không nằm trong $(-\\infty; 1)$, tức $m \\ge 1$.'],
        solutionSteps: [
          'Bước 1: Đạo hàm $y\' = \\frac{-m^2 + 4}{(x - m)^2}$.',
          'Bước 2: Để hàm nghịch biến trên $(-\\infty; 1)$, cần đồng thời: $-m^2 + 4 < 0$ và $m \\notin (-\\infty; 1)$.',
          'Bước 3: Giải hệ $\\begin{cases} m^2 > 4 \\\\ m \\ge 1 \\end{cases} \\iff \\begin{cases} m > 2 \\lor m < -2 \\\\ m \\ge 1 \\end{cases} \\iff m > 2$.'
        ],
        finalAnswer: '$m > 2$.'
      }
    ]
  },
  'math-3': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    essayProblems: [
      {
        source: 'VietJack · Hàm trùng phương 12',
        question:
          'Cho hàm số $y = x^4 - 2(m + 1)x^2 + m^2$. Tìm $m$ để đồ thị hàm số có 3 điểm cực trị tạo thành một tam giác đều.',
        hints: ['Áp dụng điều kiện có 3 cực trị $ab < 0$ và công thức $b^3 + 24a = 0$.'],
        solutionSteps: [
          'Bước 1: Ta có $a = 1$, $b = -2(m + 1)$. Điều kiện có 3 cực trị: $ab < 0 \\iff -2(m + 1) < 0 \\iff m > -1$.',
          'Bước 2: Để 3 điểm cực trị tạo thành tam giác đều: $b^3 + 24a = 0 \\iff [-2(m + 1)]^3 + 24 = 0$.',
          'Bước 3: $-8(m + 1)^3 = -24 \\iff (m + 1)^3 = 3 \\iff m = \\sqrt[3]{3} - 1$ (thỏa mãn $m > -1$).'
        ],
        finalAnswer: '$m = \\sqrt[3]{3} - 1$.'
      },
      {
        source: 'Loigiaihay · Tương giao hàm bậc bốn',
        question:
          'Dựa vào đồ thị hàm số $y = x^4 - 2x^2 - 1$, biện luận số nghiệm của phương trình $x^4 - 2x^2 - m = 0$ để phương trình có đúng 4 nghiệm thực phân biệt.',
        hints: ['Đưa về $x^4 - 2x^2 - 1 = m - 1$. Đường thẳng $y = m - 1$ cắt đồ thị $(C)$ tại 4 điểm phân biệt khi nằm giữa giá trị cực tiểu và cực đại.'],
        solutionSteps: [
          'Bước 1: Khảo sát $f(x) = x^4 - 2x^2 - 1$: $f\'(x) = 4x^3 - 4x = 0 \\iff x = 0; x = \\pm 1$.',
          'Bước 2: Giá trị cực đại $f(0) = -1$; giá trị cực tiểu $f(\\pm 1) = 1 - 2 - 1 = -2$.',
          'Bước 3: Phương trình $f(x) = m - 1$ có 4 nghiệm phân biệt $\\iff -2 < m - 1 < -1 \\iff -1 < m < 0$.'
        ],
        finalAnswer: '$-1 < m < 0$.'
      }
    ]
  },
  'math-4': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    defaultGraphConfig: {
      type: 'cubic',
      params: { a: 1, b: 0, c: -3, d: 2 },
      color: '#10b981',
      name: 'f(x) = x³ - 3x + 2'
    },
    essayProblems: [
      {
        source: 'VietJack · GTLN - GTNN Giải tích 12',
        question:
          'Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $y = x^3 - 3x^2 - 9x + 5$ trên đoạn $[-2; 2]$.',
        hints: ['Tính $y\' = 0$, lọc các nghiệm nằm trong $(-2; 2)$, rồi so sánh giá trị $y$ tại hai đầu mút và nghiệm vừa lọc.'],
        solutionSteps: [
          'Bước 1: $y\' = 3x^2 - 6x - 9 = 0 \\iff x = -1 \\in (-2; 2)$ hoặc $x = 3 \\notin [-2; 2]$ (loại).',
          'Bước 2: Tính giá trị tại các điểm cần xét: $y(-2) = -8 - 12 + 18 + 5 = 3$; $y(-1) = -1 - 3 + 9 + 5 = 10$; $y(2) = 8 - 12 - 18 + 5 = -17$.',
          'Bước 3: So sánh các giá trị thu được: $\\max_{[-2;2]} y = 10$ (tại $x = -1$) và $\\min_{[-2;2]} y = -17$ (tại $x = 2$).'
        ],
        finalAnswer: '$\\max = 10$ tại $x = -1$; $\\min = -17$ tại $x = 2$.'
      },
      {
        source: 'Loigiaihay · Bài toán Tối ưu thực tế 12',
        question:
          'Từ một tấm tôn hình vuông cạnh $12\\text{ cm}$, người ta cắt ở bốn góc bốn hình vuông bằng nhau cạnh $x$ rồi gập lại thành một chiếc hộp không nắp. Tìm $x$ để thể tích chiếc hộp thu được là lớn nhất.',
        hints: ['Đáy hộp là hình vuông cạnh $12 - 2x$, chiều cao $x$ ($0 < x < 6$). Thể tích $V(x) = x(12 - 2x)^2$.'],
        solutionSteps: [
          'Bước 1: Điều kiện $0 < x < 6$. Thể tích khối hộp: $V(x) = x(12 - 2x)^2 = 4x(6 - x)^2 = 4x^3 - 48x^2 + 144x$.',
          'Bước 2: Đạo hàm $V\'(x) = 12x^2 - 96x + 144 = 12(x^2 - 8x + 12) = 0 \\iff x = 2$ (nhận) hoặc $x = 6$ (loại).',
          'Bước 3: Bảng biến thiên trên $(0; 6)$ cho thấy $V(x)$ đạt cực đại duy nhất tại $x = 2\\text{ cm}$, khi đó $V_{\\max} = 2 \\cdot 8^2 = 128\\text{ cm}^3$.'
        ],
        finalAnswer: 'Cạnh hình vuông cần cắt là $x = 2\\text{ cm}$ ($V_{\\max} = 128\\text{ cm}^3$).'
      }
    ]
  },
  'math-5': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'grapher',
    sim3dMode: 'integral_disks_3d',
    defaultGraphConfig: {
      type: 'quadratic',
      params: { a: -1, b: 0, c: 4, d: 0 },
      color: '#6366f1',
      name: 'y = 4 - x² (Diện tích & Khối tròn xoay)',
      showIntegral: true,
      integralA: -2,
      integralB: 2
    },
    essayProblems: [
      {
        source: 'VietJack · Tích phân 12',
        question: 'Tính tích phân $I = \\int_1^e (2x + 1)\\ln x\\,dx$.',
        hints: ['Nhất Lô: đặt $u = \\ln x \\implies du = \\frac{1}{x}dx$, $dv = (2x + 1)dx \\implies v = x^2 + x$.'],
        solutionSteps: [
          'Bước 1: Đặt $u = \\ln x \\implies du = \\frac{dx}{x}$; đặt $dv = (2x + 1)dx \\implies v = x^2 + x$.',
          'Bước 2: Áp dụng công thức từng phần: $I = [(x^2 + x)\\ln x]_1^e - \\int_1^e (x^2 + x)\\frac{1}{x}dx = (e^2 + e) - 0 - \\int_1^e (x + 1)dx$.',
          'Bước 3: Tính tiếp $\\int_1^e (x + 1)dx = \\left[\\frac{x^2}{2} + x\\right]_1^e = \\left(\\frac{e^2}{2} + e\\right) - \\frac{3}{2}$.',
          'Bước 4: $I = e^2 + e - \\frac{e^2}{2} - e + \\frac{3}{2} = \\frac{e^2 + 3}{2}$.'
        ],
        finalAnswer: '$I = \\frac{e^2 + 3}{2}$.'
      },
      {
        source: 'Loigiaihay · Ứng dụng Tích phân tính Thể tích',
        question:
          'Tính diện tích hình phẳng giới hạn bởi đồ thị hàm số $y = x^2 - 4$ và trục hoành $Ox$.',
        hints: ['Giải $x^2 - 4 = 0$ tìm hai cận $a = -2, b = 2$. Khi đó $S = \\int_{-2}^2 |x^2 - 4|\\,dx$.'],
        solutionSteps: [
          'Bước 1: Phương trình hoành độ giao điểm: $x^2 - 4 = 0 \\iff x = -2$ hoặc $x = 2$.',
          'Bước 2: Trên $[-2; 2]$ ta có $x^2 - 4 \\le 0$, nên $S = \\int_{-2}^2 (4 - x^2)\\,dx$.',
          'Bước 3: $S = \\left[4x - \\frac{x^3}{3}\\right]_{-2}^2 = \\left(8 - \\frac{8}{3}\\right) - \\left(-8 + \\frac{8}{3}\\right) = \\frac{32}{3}$.'
        ],
        finalAnswer: '$S = \\frac{32}{3}$ (đơn vị diện tích).'
      }
    ]
  },
  'math-6': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'geometry',
    sim3dMode: 'sphere_plane',
    essayProblems: [
      {
        source: 'VietJack · Hình học Oxyz 12',
        question:
          'Trong không gian $Oxyz$, viết phương trình mặt phẳng $(P)$ đi qua điểm $A(1; -2; 3)$ và song song với mặt phẳng $(Q): 2x - y + 2z - 5 = 0$. Tính khoảng cách giữa $(P)$ và $(Q)$.',
        hints: ['Vì $(P) // (Q)$ nên $(P)$ có cùng vectơ pháp tuyến $\\vec{n} = (2; -1; 2)$.'],
        solutionSteps: [
          'Bước 1: $(P)$ đi qua $A(1; -2; 3)$ và nhận $\\vec{n} = (2; -1; 2)$ làm VTPT: $2(x - 1) - 1(y + 2) + 2(z - 3) = 0 \\iff 2x - y + 2z - 10 = 0$.',
          'Bước 2: Khoảng cách giữa hai mặt phẳng song song $(P)$ và $(Q)$ bằng $d(A, (Q)) = \\frac{|2(1) - (-2) + 2(3) - 5|}{\\sqrt{2^2 + (-1)^2 + 2^2}} = \\frac{5}{3}$.'
        ],
        finalAnswer: '$(P): 2x - y + 2z - 10 = 0$; khoảng cách $d = \\frac{5}{3}$.'
      },
      {
        source: 'Loigiaihay · Mặt cầu cắt Mặt phẳng Oxyz',
        question:
          'Cho mặt cầu $(S): (x - 1)^2 + (y + 2)^2 + (z - 3)^2 = 25$ và mặt phẳng $(\\alpha): 2x + 2y - z + 6 = 0$. Chứng minh $(\\alpha)$ cắt $(S)$ theo một đường tròn và tính bán kính đường tròn giao tuyến.',
        hints: ['Tìm tâm $I(1; -2; 3)$, $R = 5$. Tính $d(I, (\\alpha))$, so sánh với $R$ rồi tính $r = \\sqrt{R^2 - d^2}$.'],
        solutionSteps: [
          'Bước 1: Mặt cầu $(S)$ có tâm $I(1; -2; 3)$, bán kính $R = 5$.',
          'Bước 2: Khoảng cách từ tâm $I$ đến $(\\alpha)$: $d(I, (\\alpha)) = \\frac{|2(1) + 2(-2) - 3 + 6|}{\\sqrt{2^2 + 2^2 + (-1)^2}} = \\frac{1}{3} < 5 = R$.',
          'Bước 3: Vì $d < R$ nên $(\\alpha)$ cắt $(S)$ theo một đường tròn có bán kính $r = \\sqrt{25 - \\frac{1}{9}} = \\frac{\\sqrt{224}}{3} = \\frac{4\\sqrt{14}}{3}$.'
        ],
        finalAnswer: '$d = \\frac{1}{3} < R = 5$; bán kính đường tròn giao tuyến $r = \\frac{4\\sqrt{14}}{3}$.'
      }
    ]
  },
  'math-7': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section',
    essayProblems: [
      {
        source: 'VietJack · Thể tích Khối đa diện 12',
        question:
          'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, cạnh bên $SA \\perp (ABCD)$ và $SC$ tạo với mặt đáy góc $45^\\circ$. Tính thể tích khối chóp $S.ABCD$.',
        hints: ['Hình chiếu của $SC$ lên $(ABCD)$ là $AC = a\\sqrt{2}$, suy ra $\\widehat{SCA} = 45^\\circ \\implies SA = AC$.'],
        solutionSteps: [
          'Bước 1: Đường chéo hình vuông đáy: $AC = a\\sqrt{2}$, diện tích đáy $S_{ABCD} = a^2$.',
          'Bước 2: Vì $SA \\perp (ABCD)$, góc giữa $SC$ và đáy là $\\widehat{SCA} = 45^\\circ$.',
          'Bước 3: Trong $\\triangle SAC$ vuông tại $A$: $SA = AC \\tan 45^\\circ = a\\sqrt{2}$.',
          'Bước 4: Thể tích khối chóp: $V = \\frac{1}{3} S_{ABCD} \\cdot SA = \\frac{1}{3} a^2 \\cdot a\\sqrt{2} = \\frac{a^3\\sqrt{2}}{3}$.'
        ],
        finalAnswer: '$V = \\frac{a^3\\sqrt{2}}{3}$.'
      },
      {
        source: 'Loigiaihay · Tỉ số thể tích Simson',
        question:
          'Cho khối tứ diện $S.ABC$ có thể tích $V$. Gọi $M$ là trung điểm $SA$, $N$ thuộc $SB$ với $SN = 2NB$, $P$ là trung điểm $SC$. Tính thể tích khối chóp $S.MNP$ theo $V$.',
        hints: ['Áp dụng trực tiếp tỉ số Simson: $\\frac{V_{S.MNP}}{V_{S.ABC}} = \\frac{SM}{SA} \\cdot \\frac{SN}{SB} \\cdot \\frac{SP}{SC}$.'],
        solutionSteps: [
          'Bước 1: Theo giả thiết: $\\frac{SM}{SA} = \\frac{1}{2}$, $\\frac{SN}{SB} = \\frac{2}{3}$, $\\frac{SP}{SC} = \\frac{1}{2}$.',
          'Bước 2: Áp dụng công thức tỉ số thể tích Simson cho chóp tam giác: $\\frac{V_{S.MNP}}{V_{S.ABC}} = \\frac{1}{2} \\cdot \\frac{2}{3} \\cdot \\frac{1}{2} = \\frac{1}{6}$.',
          'Bước 3: Suy ra $V_{S.MNP} = \\frac{V}{6}$.'
        ],
        finalAnswer: '$V_{S.MNP} = \\frac{V}{6}$.'
      }
    ]
  },
  'math-8': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    defaultGraphConfig: {
      type: 'logarithmic',
      params: { a: 1.5, b: 1, c: 1, d: 0 },
      color: '#f59e0b',
      name: 'y = 1.5·ln(x + 1)'
    },
    essayProblems: [
      {
        source: 'VietJack · Phương trình Logarit 12',
        question: 'Giải phương trình $\\log_2(x - 1) + \\log_2(x + 1) = 3$.',
        hints: ['Đặt điều kiện $x > 1$, sau đó gộp $\\log_2[(x - 1)(x + 1)] = 3$.'],
        solutionSteps: [
          'Bước 1: Điều kiện xác định: $\\begin{cases} x - 1 > 0 \\\\ x + 1 > 0 \\end{cases} \\iff x > 1$.',
          'Bước 2: Phương trình tương đương $\\log_2(x^2 - 1) = 3 \\iff x^2 - 1 = 2^3 = 8$.',
          'Bước 3: Suy ra $x^2 = 9 \\iff x = 3$ (nhận vì $3 > 1$) hoặc $x = -3$ (loại).'
        ],
        finalAnswer: '$x = 3$.'
      },
      {
        source: 'Loigiaihay · Bài toán Lãi kép ngân hàng 12',
        question:
          'Một người gửi tiết kiệm $100\\text{ triệu đồng}$ vào ngân hàng theo thể thức lãi kép kì hạn 1 năm với lãi suất $6\\%/\\text{năm}$. Sau ít nhất bao nhiêu năm tròn người đó nhận được số tiền cả gốc lẫn lãi vượt mốc $150\\text{ triệu đồng}$?',
        hints: ['Giải bất phương trình $100(1 + 0{,}06)^n > 150 \\implies n > \\log_{1{,}06}(1{,}5)$.'],
        solutionSteps: [
          'Bước 1: Áp dụng công thức lãi kép: $S_n = 100(1 + 0{,}06)^n > 150 \\iff 1{,}06^n > 1{,}5$.',
          'Bước 2: Lấy logarit hai vế: $n > \\log_{1{,}06}(1{,}5) = \\frac{\\ln 1{,}5}{\\ln 1{,}06} \\approx 6{,}96$.',
          'Bước 3: Vì $n$ là số năm nguyên nên cần ít nhất $n = 7$ năm.'
        ],
        finalAnswer: 'Ít nhất $7$ năm.'
      }
    ]
  },
  'math-9': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    defaultGraphConfig: {
      type: 'quadratic',
      params: { a: 1, b: -2, c: 5, d: 0 },
      color: '#ec4899',
      name: 'z² - 2z + 5 = 0'
    },
    essayProblems: [
      {
        source: 'VietJack · Số phức 12',
        question: 'Tìm số phức $z$ thỏa mãn $(1 + 2i)z - 3 + 4i = 5 - 2i$.',
        hints: ['Chuyển vế cô lập $(1 + 2i)z = 8 - 6i$, rồi chia cả hai vế cho $(1 + 2i)$ bằng cách nhân liên hợp $(1 - 2i)$.'],
        solutionSteps: [
          'Bước 1: $(1 + 2i)z = (5 - 2i) + (3 - 4i) = 8 - 6i$.',
          'Bước 2: $z = \\frac{8 - 6i}{1 + 2i} = \\frac{(8 - 6i)(1 - 2i)}{1^2 + 2^2} = \\frac{8 - 16i - 6i + 12i^2}{5} = \\frac{-4 - 22i}{5}$.',
          'Bước 3: Vậy $z = -\\frac{4}{5} - \\frac{22}{5}i$.'
        ],
        finalAnswer: '$z = -\\frac{4}{5} - \\frac{22}{5}i$.'
      },
      {
        source: 'Loigiaihay · Quỹ tích Số phức & Min Môđun',
        question:
          'Cho số phức $z$ thỏa mãn $|z - 2 - 3i| = 1$. Tìm giá trị lớn nhất và giá trị nhỏ nhất của $|z|$.',
        hints: ['Tâm đường tròn quỹ tích là $I(2; 3)$, bán kính $r = 1$. Khi đó $|z|_{\\max} = OI + r$ và $|z|_{\\min} = |OI - r|$.'],
        solutionSteps: [
          'Bước 1: Điểm $M(x; y)$ biểu diễn $z$ thuộc đường tròn tâm $I(2; 3)$, bán kính $r = 1$.',
          'Bước 2: Khoảng cách từ gốc $O$ đến tâm $I$: $OI = \\sqrt{2^2 + 3^2} = \\sqrt{13}$.',
          'Bước 3: Theo bất đẳng thức tam giác trên đường tròn: $|z|_{\\max} = OI + r = \\sqrt{13} + 1$; $|z|_{\\min} = OI - r = \\sqrt{13} - 1$.'
        ],
        finalAnswer: '$\\max|z| = \\sqrt{13} + 1$; $\\min|z| = \\sqrt{13} - 1$.'
      }
    ]
  },
  'math-10': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector',
    essayProblems: [
      {
        source: 'VietJack · Hệ thức lượng trong Tam giác 10',
        question:
          'Cho tam giác $ABC$ có các cạnh $a = 13$, $b = 14$, $c = 15$. Tính diện tích tam giác $ABC$, bán kính đường tròn ngoại tiếp $R$ và bán kính đường tròn nội tiếp $r$.',
        hints: ['Tính nửa chu vi $p = 21$, dùng công thức Heron $S = \\sqrt{p(p-a)(p-b)(p-c)}$, rồi $R = \\frac{abc}{4S}$, $r = \\frac{S}{p}$.'],
        solutionSteps: [
          'Bước 1: Nửa chu vi $p = \\frac{13 + 14 + 15}{2} = 21$.',
          'Bước 2: Diện tích theo Heron: $S = \\sqrt{21(21 - 13)(21 - 14)(21 - 15)} = \\sqrt{21 \\cdot 8 \\cdot 7 \\cdot 6} = \\sqrt{7056} = 84$.',
          'Bước 3: Bán kính ngoại tiếp $R = \\frac{13 \\cdot 14 \\cdot 15}{4 \\cdot 84} = \\frac{2730}{336} = \\frac{65}{8} = 8{,}125$.',
          'Bước 4: Bán kính nội tiếp $r = \\frac{S}{p} = \\frac{84}{21} = 4$.'
        ],
        finalAnswer: '$S = 84$; $R = \\frac{65}{8}$; $r = 4$.'
      },
      {
        source: 'Loigiaihay · Giải tam giác tổng quát',
        question:
          'Cho tam giác $ABC$ có $AB = 5$, $AC = 8$ và góc $\\widehat{A} = 60^\\circ$. Tính độ dài cạnh $BC$ và đường trung tuyến $AM$.',
        hints: ['Dùng định lý Cosin tính $BC$, rồi áp dụng công thức độ dài đường trung tuyến $AM^2 = \\frac{2(b^2 + c^2) - a^2}{4}$.'],
        solutionSteps: [
          'Bước 1: $BC^2 = AB^2 + AC^2 - 2AB\\cdot AC\\cos 60^\\circ = 25 + 64 - 2 \\cdot 5 \\cdot 8 \\cdot 0{,}5 = 49 \\implies BC = 7$.',
          'Bước 2: Độ dài đường trung tuyến $AM$: $AM^2 = \\frac{2(5^2 + 8^2) - 7^2}{4} = \\frac{2(89) - 49}{4} = \\frac{129}{4} \\implies AM = \\frac{\\sqrt{129}}{2}$.'
        ],
        finalAnswer: '$BC = 7$; $AM = \\frac{\\sqrt{129}}{2}$.'
      }
    ]
  },
  'math-11': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    defaultGraphConfig: {
      type: 'abs',
      params: { a: 1, b: 1, c: -1, d: -2 },
      color: '#ef4444',
      name: 'y = |x - 1| - 2'
    },
    essayProblems: [
      {
        source: 'VietJack · Cực trị hàm trị tuyệt đối 12',
        question:
          'Tìm tất cả các giá trị nguyên của tham số $m \\in [-10; 10]$ để hàm số $y = |x^3 - 3x^2 + m|$ có đúng 5 điểm cực trị.',
        hints: ['Hàm $f(x) = x^3 - 3x^2 + m$ luôn có $a = 2$ cực trị ($x=0, x=2$). Để $|f(x)|$ có $5 = 2 + 3$ cực trị, $f(x)=0$ phải có 3 nghiệm đơn phân biệt.'],
        solutionSteps: [
          'Bước 1: Xét $f(x) = x^3 - 3x^2 + m$ có $f\'(x) = 3x^2 - 6x = 0 \\iff x = 0$ hoặc $x = 2$ ($a = 2$ cực trị).',
          'Bước 2: Giá trị cực trị: $f_{CĐ} = f(0) = m$, $f_{CT} = f(2) = -4 + m$.',
          'Bước 3: Để $|f(x)|$ có đúng 5 điểm cực trị thì $f(x) = 0$ phải có 3 nghiệm đơn phân biệt $\\iff f_{CT} < 0 < f_{CĐ} \\iff m - 4 < 0 < m \\iff 0 < m < 4$.',
          'Bước 4: Vì $m$ nguyên nên $m \\in \\{1; 2; 3\\}$ (có 3 giá trị).'
        ],
        finalAnswer: '$m \\in \\{1; 2; 3\\}$.'
      },
      {
        source: 'Loigiaihay · Hàm số f(|x|)',
        question:
          'Cho hàm số $f(x) = x^3 - 6x^2 + 9x - 2$. Tìm số điểm cực trị của hàm số $g(x) = f(|x|)$.',
        hints: ['Đếm số điểm cực trị dương $k$ của $f(x)$, sau đó áp dụng công thức $N = 2k + 1$.'],
        solutionSteps: [
          'Bước 1: $f\'(x) = 3x^2 - 12x + 9 = 0 \\iff x = 1$ hoặc $x = 3$.',
          'Bước 2: Cả hai điểm cực trị $x = 1 > 0$ và $x = 3 > 0$ đều nằm bên phải trục tung, nên số cực trị dương là $k = 2$.',
          'Bước 3: Số điểm cực trị của $g(x) = f(|x|)$ là $N = 2k + 1 = 2(2) + 1 = 5$.'
        ],
        finalAnswer: 'Hàm số $g(x) = f(|x|)$ có $5$ điểm cực trị.'
      }
    ]
  },
  'math-12': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    defaultGraphConfig: {
      type: 'quadratic',
      params: { a: -0.25, b: 2, c: 0, d: 0 },
      color: '#06b6d4',
      name: 'Phân phối tổ hợp'
    },
    essayProblems: [
      {
        source: 'VietJack · Nhị thức Newton 11',
        question: 'Tìm hệ số của số hạng chứa $x^7$ trong khai triển nhị thức $(2x + 1)^{10}$.',
        hints: ['Số hạng tổng quát $T_{k+1} = C_{10}^k (2x)^{10-k} \\cdot 1^k$. Cho số mũ $10 - k = 7 \\implies k = 3$.'],
        solutionSteps: [
          'Bước 1: Số hạng tổng quát thứ $k + 1$: $T_{k+1} = C_{10}^k \\cdot 2^{10 - k} \\cdot x^{10 - k}$.',
          'Bước 2: Số hạng chứa $x^7$ ứng với $10 - k = 7 \\iff k = 3$.',
          'Bước 3: Hệ số cần tìm là $C_{10}^3 \\cdot 2^7 = 120 \\cdot 128 = 15\\,360$.'
        ],
        finalAnswer: '$15\\,360$.'
      },
      {
        source: 'Loigiaihay · Xác suất cổ điển 11',
        question:
          'Từ một hộp gồm 6 quả cầu đỏ và 4 quả cầu xanh, lấy ngẫu nhiên đồng thời 3 quả. Tính xác suất để 3 quả lấy ra có đủ cả hai màu.',
        hints: ['Dùng biến cố đối: cả 3 quả cùng màu (3 đỏ hoặc 3 xanh).'],
        solutionSteps: [
          'Bước 1: Không gian mẫu $n(\\Omega) = C_{10}^3 = 120$.',
          'Bước 2: Biến cố đối $\\bar{A}$: "Cả 3 quả lấy ra cùng màu" $\\implies n(\\bar{A}) = C_6^3 + C_4^3 = 20 + 4 = 24$.',
          'Bước 3: Xác suất $P(A) = 1 - \\frac{24}{120} = 1 - \\frac{1}{5} = \\frac{4}{5} = 0{,}8$.'
        ],
        finalAnswer: '$P(A) = \\frac{4}{5}$.'
      }
    ]
  },
  'math-9-1': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 9',
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    essayProblems: [
      {
        source: 'VietJack · Toán 9 · Hàm số bậc nhất',
        question:
          'Cho hai đường thẳng $(d_1): y = 2x + 3$ và $(d_2): y = (m - 1)x + m + 1$. Tìm giá trị của $m$ để $(d_1)$ cắt $(d_2)$ tại một điểm nằm trên trục tung $Oy$.',
        hints: ['Để cắt nhau: $m - 1 \\neq 2$. Cắt tại điểm trên trục tung $Oy \\iff$ cùng tung độ gốc $b_1 = b_2$.'],
        solutionSteps: [
          'Bước 1: Hai đường thẳng cắt nhau $\\iff m - 1 \\neq 2 \\iff m \\neq 3$.',
          'Bước 2: Để giao điểm nằm trên $Oy$ ($x = 0$), hai đường thẳng có cùng tung độ gốc: $m + 1 = 3 \\iff m = 2$.',
          'Bước 3: Kiểm tra $m = 2 \\neq 3$ (thỏa mãn). Tọa độ giao điểm trên $Oy$ là $(0; 3)$.'
        ],
        finalAnswer: '$m = 2$.'
      },
      {
        source: 'Loigiaihay · Diện tích tam giác tạo bởi đường thẳng và trục tọa độ',
        question:
          'Tìm tọa độ giao điểm của đường thẳng $(d): y = 2x - 4$ với hai trục $Ox, Oy$ và tính diện tích tam giác $OAB$ (với $A, B$ là hai giao điểm đó).',
        hints: ['Cho $y = 0 \\implies x = 2$ ($A(2;0)$); cho $x = 0 \\implies y = -4$ ($B(0;-4)$). Diện tích tam giác vuông $OAB = \\frac{1}{2}OA\\cdot OB$.'],
        solutionSteps: [
          'Bước 1: Giao $Ox$ ($y=0$): $2x - 4 = 0 \\implies x = 2 \\implies A(2; 0)$, $OA = 2$.',
          'Bước 2: Giao $Oy$ ($x=0$): $y = -4 \\implies B(0; -4)$, $OB = |-4| = 4$.',
          'Bước 3: Diện tích $\\triangle OAB$ vuông tại $O$: $S = \\frac{1}{2} OA \\cdot OB = \\frac{1}{2} \\cdot 2 \\cdot 4 = 4$ (đvdt).'
        ],
        finalAnswer: '$A(2; 0)$, $B(0; -4)$, $S_{\\triangle OAB} = 4$.'
      }
    ]
  },
  'math-9-2': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 9',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    essayProblems: [
      {
        source: 'VietJack · Đề thi vào 10 · Hệ thức Vi-ét',
        question:
          'Cho phương trình $x^2 - 2(m + 1)x + m^2 + 2 = 0$. Tìm $m$ để phương trình có hai nghiệm phân biệt $x_1, x_2$ thỏa mãn $x_1^2 + x_2^2 = 10$.',
        hints: ['Tính $\\Delta\' > 0$ trước, sau đó biến đổi $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2 = 10$.'],
        solutionSteps: [
          'Bước 1: $\\Delta\' = (m + 1)^2 - (m^2 + 2) = 2m - 1 > 0 \\iff m > \\frac{1}{2}$.',
          'Bước 2: Theo Vi-ét: $x_1 + x_2 = 2(m + 1)$, $x_1 x_2 = m^2 + 2$.',
          'Bước 3: $x_1^2 + x_2^2 = 4(m + 1)^2 - 2(m^2 + 2) = 2m^2 + 8m = 10 \\iff m^2 + 4m - 5 = 0$.',
          'Bước 4: Giải được $m = 1$ (nhận vì $1 > 1/2$) hoặc $m = -5$ (loại).'
        ],
        finalAnswer: '$m = 1$.'
      },
      {
        source: 'Loigiaihay · Tương giao Parabol và Đường thẳng lớp 9',
        question:
          'Cho parabol $(P): y = x^2$ và đường thẳng $(d): y = 2x + 3$. Tìm tọa độ các giao điểm của $(P)$ và $(d)$.',
        hints: ['Lập phương trình hoành độ giao điểm $x^2 = 2x + 3$.'],
        solutionSteps: [
          'Bước 1: Phương trình hoành độ giao điểm: $x^2 - 2x - 3 = 0$.',
          'Bước 2: Vì $a - b + c = 1 - (-2) - 3 = 0$, phương trình có hai nghiệm $x_1 = -1$ và $x_2 = 3$.',
          'Bước 3: Thay vào $y = x^2$: với $x_1 = -1 \\implies y_1 = 1$; với $x_2 = 3 \\implies y_2 = 9$.'
        ],
        finalAnswer: 'Hai giao điểm là $A(-1; 1)$ và $B(3; 9)$.'
      }
    ]
  },
  'math-9-3': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 9',
    sim2dMode: 'geometry',
    sim3dMode: 'sphere_plane',
    essayProblems: [
      {
        source: 'VietJack · Hình học 9 · Hệ thức lượng',
        question:
          'Cho tam giác $ABC$ vuông tại $A$, biết $AB = 6\\text{ cm}$, $AC = 8\\text{ cm}$, đường cao $AH$. Tính độ dài cạnh huyền $BC$, đường cao $AH$ và hai hình chiếu $BH, CH$.',
        hints: ['Dùng Pythagoras tính $BC = 10\\text{ cm}$, rồi dùng $AB\\cdot AC = BC\\cdot AH$ và $AB^2 = BC\\cdot BH$.'],
        solutionSteps: [
          'Bước 1: Theo định lý Pythagoras: $BC = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$.',
          'Bước 2: $AH \\cdot BC = AB \\cdot AC \\implies AH = \\frac{6 \\cdot 8}{10} = 4{,}8\\text{ cm}$.',
          'Bước 3: $BH = \\frac{AB^2}{BC} = \\frac{36}{10} = 3{,}6\\text{ cm}$; $CH = BC - BH = 10 - 3{,}6 = 6{,}4\\text{ cm}$.'
        ],
        finalAnswer: '$BC = 10\\text{ cm}, AH = 4{,}8\\text{ cm}, BH = 3{,}6\\text{ cm}, CH = 6{,}4\\text{ cm}$.'
      },
      {
        source: 'Loigiaihay · Đường tròn & Tiếp tuyến 9',
        question:
          'Từ điểm $M$ cách tâm $O$ của đường tròn $(O; 6\\text{ cm})$ một khoảng $OM = 10\\text{ cm}$, kẻ hai tiếp tuyến $MA, MB$ tới đường tròn. Tính độ dài đoạn tiếp tuyến $MA$ và dây cung $AB$.',
        hints: ['Tam giác $OAM$ vuông tại $A$ có $OA = 6, OM = 10$. Đường nối tâm $OM \\perp AB$ tại trung điểm $H$.'],
        solutionSteps: [
          'Bước 1: $\\triangle OAM$ vuông tại $A$: $MA = \\sqrt{OM^2 - OA^2} = \\sqrt{10^2 - 6^2} = 8\\text{ cm}$.',
          'Bước 2: Vì $OM$ là trung trực của $AB$, $AH \\perp OM$ là đường cao $\\triangle OAM$.',
          'Bước 3: $AH = \\frac{OA \\cdot AM}{OM} = \\frac{6 \\cdot 8}{10} = 4{,}8\\text{ cm} \\implies AB = 2AH = 9{,}6\\text{ cm}$.'
        ],
        finalAnswer: '$MA = 8\\text{ cm}$; $AB = 9{,}6\\text{ cm}$.'
      }
    ]
  },
  'math-9-4': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 9',
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    defaultGraphConfig: {
      type: 'custom',
      customExpr: 'sqrt(x) + 4/sqrt(x)',
      params: { a: 1, b: 4, c: 0, d: 0 },
      color: '#2563eb',
      name: 'y = √x + 4/√x'
    },
    essayProblems: [
      {
        source: 'VietJack · Đề tuyển sinh 10 · Rút gọn biểu thức',
        question:
          'Cho biểu thức $P = \\left(\\frac{\\sqrt{x}}{\\sqrt{x} - 1} - \\frac{1}{x - \\sqrt{x}}\\right) : \\frac{\\sqrt{x} + 1}{x - 1}$ với $x > 0, x \\neq 1$. Rút gọn $P$ và tìm giá trị của $x$ để $P = 2$.',
        hints: ['Phân tích $x - \\sqrt{x} = \\sqrt{x}(\\sqrt{x} - 1)$ và $x - 1 = (\\sqrt{x} - 1)(\\sqrt{x} + 1)$.'],
        solutionSteps: [
          'Bước 1: Quy đồng ngoặc đầu: $\\frac{\\sqrt{x}}{\\sqrt{x} - 1} - \\frac{1}{\\sqrt{x}(\\sqrt{x} - 1)} = \\frac{x - 1}{\\sqrt{x}(\\sqrt{x} - 1)} = \\frac{\\sqrt{x} + 1}{\\sqrt{x}}$.',
          'Bước 2: Chia phân thức: $P = \\frac{\\sqrt{x} + 1}{\\sqrt{x}} \\cdot \\frac{(\\sqrt{x} - 1)(\\sqrt{x} + 1)}{\\sqrt{x} + 1} = \\frac{(\\sqrt{x} + 1)(\\sqrt{x} - 1)}{\\sqrt{x}} = \\frac{x - 1}{\\sqrt{x}}$.',
          'Bước 3: Cho $P = 2 \\iff \\frac{x - 1}{\\sqrt{x}} = 2 \\iff x - 2\\sqrt{x} - 1 = 0 \\implies \\sqrt{x} = 1 + \\sqrt{2}$ (vì $\\sqrt{x} > 0$) $\\implies x = 3 + 2\\sqrt{2}$ (thỏa mãn ĐKXĐ).'
        ],
        finalAnswer: '$P = \\frac{x - 1}{\\sqrt{x}}$; với $P = 2$ thì $x = 3 + 2\\sqrt{2}$.'
      },
      {
        source: 'Loigiaihay · Giá trị nguyên của biểu thức căn',
        question:
          'Cho biểu thức $A = \\frac{\\sqrt{x} + 5}{\\sqrt{x} + 1}$ ($x \\ge 0$). Tìm tất cả các giá trị nguyên của $x$ để $A$ nhận giá trị nguyên.',
        hints: ['Tách $A = 1 + \\frac{4}{\\sqrt{x} + 1}$. Để $A$ nguyên thì $\\sqrt{x} + 1$ phải là ước dương của $4$.'],
        solutionSteps: [
          'Bước 1: Biến đổi $A = \\frac{(\\sqrt{x} + 1) + 4}{\\sqrt{x} + 1} = 1 + \\frac{4}{\\sqrt{x} + 1}$.',
          'Bước 2: Với $x$ nguyên và $A$ nguyên, $\\sqrt{x}$ phải là số hữu tỉ $\\implies x$ là số chính phương (vì nếu $\\sqrt{x}$ vô tỉ thì $A$ vô tỉ). Khi đó $\\sqrt{x} + 1 \\in \\mathbb{Z}^+$ và là ước của $4$ thỏa $\\sqrt{x} + 1 \\ge 1$.',
          'Bước 3: Lần lượt xét $\\sqrt{x} + 1 \\in \\{1; 2; 4\\} \\implies \\sqrt{x} \\in \\{0; 1; 3\\} \\implies x \\in \\{0; 1; 9\\}$.'
        ],
        finalAnswer: '$x \\in \\{0; 1; 9\\}$.'
      }
    ]
  },
  'math-9-5': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 9',
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    essayProblems: [
      {
        source: 'VietJack · Giải bài toán bằng cách lập hệ PT',
        question:
          'Hai đội công nhân cùng làm chung một công việc thì hoàn thành trong 12 ngày. Nếu đội I làm một mình trong 4 ngày rồi nghỉ và đội II làm tiếp một mình trong 14 ngày thì xong cả công việc. Hỏi mỗi đội làm một mình bao lâu xong công việc?',
        hints: ['Đặt thời gian làm một mình của đội I, II lần lượt là $x, y$ ngày ($x, y > 12$). Đặt ẩn phụ $u = 1/x, v = 1/y$.'],
        solutionSteps: [
          'Bước 1: Hệ phương trình: $\\begin{cases} \\frac{1}{x} + \\frac{1}{y} = \\frac{1}{12} \\\\ \\frac{4}{x} + \\frac{14}{y} = 1 \\end{cases}$.',
          'Bước 2: Nhân PT(1) với 4 rồi trừ PT(2): $\\frac{10}{y} = 1 - \\frac{4}{12} = \\frac{2}{3} \\implies y = 15$ ngày.',
          'Bước 3: Thay $y = 15$ vào PT(1): $\\frac{1}{x} = \\frac{1}{12} - \\frac{1}{15} = \\frac{1}{60} \\implies x = 60$ ngày.'
        ],
        finalAnswer: 'Đội I làm riêng hết $60$ ngày, đội II làm riêng hết $15$ ngày.'
      },
      {
        source: 'Loigiaihay · Hệ phương trình có tham số m 9',
        question:
          'Cho hệ phương trình $\\begin{cases} mx + y = 2m \\\\ x + my = m + 1 \\end{cases}$. Tìm $m$ để hệ có nghiệm duy nhất $(x; y)$ thỏa mãn $x, y$ đều là số nguyên.',
        hints: ['Rút $y = 2m - mx$ thế vào PT(2) để thu được $(1 - m^2)x = (1 - m)(2m + 1)$.'],
        solutionSteps: [
          'Bước 1: Rút $y = 2m - mx$ thế vào PT(2): $(1 - m^2)x = -2m^2 + m + 1 = (1 - m)(2m + 1)$.',
          'Bước 2: Hệ có nghiệm duy nhất $\\iff m \\neq \\pm 1$. Khi đó $x = \\frac{2m + 1}{m + 1} = 2 - \\frac{1}{m + 1}$ và $y = 2m - m\\frac{2m+1}{m+1} = \\frac{m}{m + 1} = 1 - \\frac{1}{m + 1}$.',
          'Bước 3: Nếu xét $m \\in \\mathbb{Z}$ để $x, y \\in \\mathbb{Z}$ thì $m + 1 \\in \\{\\pm 1\\} \\implies m = 0$ hoặc $m = -2$ (đều khác $\\pm 1$).'
        ],
        finalAnswer: 'Với $m \\in \\mathbb{Z}$, nhận $m = 0$ hoặc $m = -2$.'
      }
    ]
  },
  'math-9-6': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 9',
    sim2dMode: 'geometry',
    sim3dMode: 'sphere_plane',
    essayProblems: [
      {
        source: 'VietJack · Đề vào 10 · Hình học Tứ giác nội tiếp',
        question:
          'Cho $\\triangle ABC$ nhọn ($AB < AC$) nội tiếp $(O)$. Các đường cao $AD, BE, CF$ cắt nhau tại trực tâm $H$. Chứng minh: a) Tứ giác $AEHF$ nội tiếp; b) Tứ giác $BFEC$ nội tiếp.',
        hints: ['Dùng tổng hai góc đối bằng $180^\\circ$ cho $AEHF$, và hai đỉnh kề $E, F$ cùng nhìn $BC$ dưới góc $90^\\circ$ cho $BFEC$.'],
        solutionSteps: [
          'Bước 1 (a): Vì $BE \\perp AC$ và $CF \\perp AB$ nên $\\widehat{AEH} = 90^\\circ$ và $\\widehat{AFH} = 90^\\circ$. Tổng hai góc đối $\\widehat{AEH} + \\widehat{AFH} = 180^\\circ \\implies AEHF$ nội tiếp đường tròn đường kính $AH$.',
          'Bước 2 (b): Xét tứ giác $BFEC$ có $\\widehat{BFC} = \\widehat{BEC} = 90^\\circ$. Hai đỉnh $E, F$ kề nhau cùng nhìn cạnh $BC$ dưới một góc vuông nên $BFEC$ nội tiếp đường tròn đường kính $BC$.'
        ],
        finalAnswer: 'Đã chứng minh được hai tứ giác nội tiếp $AEHF$ (đường kính $AH$) và $BFEC$ (đường kính $BC$).'
      },
      {
        source: 'Loigiaihay · Phương tích đường tròn 9',
        question:
          'Cho đường tròn $(O; R)$, từ điểm $A$ ngoài $(O)$ vẽ tiếp tuyến $AB$ ($B$ là tiếp điểm) và cát tuyến $ACD$ ($C$ nằm giữa $A$ và $D$). Chứng minh $AB^2 = AC \\cdot AD$ và tính $CD$ nếu $AB = 6\\text{ cm}, AC = 4\\text{ cm}$.',
        hints: ['Chứng minh $\\triangle ABC \\sim \\triangle ADB$ theo trường hợp góc-góc ($\\widehat{A}$ chung, $\\widehat{ABC} = \\widehat{ADB}$ cùng chắn cung $BC$).'],
        solutionSteps: [
          'Bước 1: Xét $\\triangle ABC$ và $\\triangle ADB$ có $\\widehat{BAC}$ chung và $\\widehat{ABC} = \\widehat{ADB}$ (góc tạo bởi tiếp tuyến và dây cung bằng góc nội tiếp cùng chắn cung $BC$).',
          'Bước 2: Suy ra $\\triangle ABC \\sim \\triangle ADB \\implies \\frac{AB}{AD} = \\frac{AC}{AB} \\implies AB^2 = AC \\cdot AD$.',
          'Bước 3: Thay số: $6^2 = 4 \\cdot AD \\implies AD = 9\\text{ cm} \\implies CD = AD - AC = 9 - 4 = 5\\text{ cm}$.'
        ],
        finalAnswer: '$CD = 5\\text{ cm}$.'
      }
    ]
  },
  'math-9-7': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 9',
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    defaultGraphConfig: {
      type: 'linear',
      params: { a: 0.25, b: 0, c: 0, d: 0 },
      color: '#10b981',
      name: 'y = f·x (Tần số tích lũy)'
    },
    essayProblems: [
      {
        source: 'VietJack · Toán 9 GDPT 2018 · Thống kê',
        question:
          'Khảo sát thời gian tự học mỗi ngày (đơn vị: giờ) của 50 học sinh lớp 9A thu được bảng ghép nhóm: $[1; 2)$ có $8$ bạn, $[2; 3)$ có $22$ bạn, $[3; 4)$ có $15$ bạn, $[4; 5)$ có $5$ bạn. Lập bảng tần số tương đối và tính góc hình quạt tròn ứng với nhóm $[2; 3)$.',
        hints: ['Tần số tương đối $f_i = \\frac{n_i}{50} \\cdot 100\\%$; góc quạt tròn $\\alpha = f_i \\cdot 360^\\circ$.'],
        solutionSteps: [
          'Bước 1: Tổng cỡ mẫu $N = 8 + 22 + 15 + 5 = 50$.',
          'Bước 2: Tần số tương đối các nhóm: $[1;2): 16\\%$; $[2;3): 44\\%$; $[3;4): 30\\%$; $[4;5): 10\\%$.',
          'Bước 3: Góc hình quạt tròn nhóm $[2; 3)$ là $\\alpha = 44\\% \\cdot 360^\\circ = 158{,}4^\\circ$.'
        ],
        finalAnswer: 'Tần số tương đối lần lượt: $16\\%, 44\\%, 30\\%, 10\\%$; góc nhóm $[2;3)$ bằng $158{,}4^\\circ$.'
      },
      {
        source: 'Loigiaihay · Xác suất không gian mẫu 9',
        question:
          'Gieo một đồng xu cân đối 2 lần liên tiếp. Mô tả không gian mẫu $\\Omega$ và tính xác suất để có ít nhất 1 lần xuất hiện mặt Sấp (S).',
        hints: ['$\\Omega = \\{\\text{SS, SN, NS, NN}\\}$ gồm 4 kết quả đồng khả năng.'],
        solutionSteps: [
          'Bước 1: Không gian mẫu $\\Omega = \\{\\text{SS, SN, NS, NN}\\} \\implies n(\\Omega) = 4$.',
          'Bước 2: Biến cố $A$ "có ít nhất 1 lần mặt Sấp" gồm các kết quả $\\{\\text{SS, SN, NS}\\} \\implies n(A) = 3$.',
          'Bước 3: Xác suất $P(A) = \\frac{n(A)}{n(\\Omega)} = \\frac{3}{4} = 75\\%$.'
        ],
        finalAnswer: '$P(A) = \\frac{3}{4}$.'
      }
    ]
  },
  'math-10-1': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    essayProblems: [
      {
        source: 'VietJack · Toán 10 KNTT · Tam thức bậc hai',
        question:
          'Tìm tất cả giá trị của tham số $m$ để bất phương trình $(m - 1)x^2 - 2(m - 1)x + 3 > 0$ nghiệm đúng với mọi $x \\in \\mathbb{R}$.',
        hints: ['NHỚ xét trường hợp $m - 1 = 0$ trước! Khi $m = 1$ ta được $3 > 0$ (luôn đúng). Sau đó xét $m - 1 > 0$ và $\\Delta\' < 0$.'],
        solutionSteps: [
          'Bước 1: Trường hợp $m = 1$: Bất phương trình trở thành $3 > 0$, luôn đúng $\\forall x \\in \\mathbb{R} \\implies m = 1$ nhận.',
          'Bước 2: Trường hợp $m \\neq 1$: Cần $\\begin{cases} m - 1 > 0 \\\\ \\Delta\' = (m - 1)^2 - 3(m - 1) < 0 \\end{cases} \\iff \\begin{cases} m > 1 \\\\ (m - 1)(m - 4) < 0 \\end{cases} \\iff 1 < m < 4$.',
          'Bước 3: Hợp cả hai trường hợp: $1 \\le m < 4$.'
        ],
        finalAnswer: '$1 \\le m < 4$.'
      },
      {
        source: 'Loigiaihay · Parabol & Bài toán Cổng vòm 10',
        question:
          'Một cổng vòm hình Parabol có chiều rộng chân cổng là $8\\text{ m}$ và chiều cao đỉnh cổng là $4\\text{ m}$. Chọn hệ trục $Oxy$ có gốc $O$ tại trung điểm chân cổng (trục $Ox$ nằm ngang). Viết phương trình Parabol của cổng và hỏi một xe tải rộng $4\\text{ m}$ có chiều cao tối đa bao nhiêu để đi qua lọt chính giữa cổng?',
        hints: ['Đỉnh $I(0; 4)$ nên Parabol có dạng $y = ax^2 + 4$, đi qua $(4; 0)$. Xe rộng $4\\text{ m}$ đi chính giữa chạm biên ở $x = \\pm 2$.'],
        solutionSteps: [
          'Bước 1: $y = ax^2 + 4$ đi qua điểm $(4; 0) \\implies 16a + 4 = 0 \\implies a = -\\frac{1}{4}$. Phương trình Parabol: $y = -\\frac{1}{4}x^2 + 4$.',
          'Bước 2: Tại mép xe tải ở $x = 2\\text{ m}$, độ cao cổng là $y(2) = -\\frac{1}{4}(2^2) + 4 = 3\\text{ m}$.'
        ],
        finalAnswer: '$y = -\\frac{1}{4}x^2 + 4$; xe cao dưới $3\\text{ m}$ đi lọt cổng.'
      }
    ]
  },
  'math-10-2': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector',
    essayProblems: [
      {
        source: 'VietJack · Toán 10 · Tích vô hướng hai vectơ',
        question:
          'Trong mặt phẳng $Oxy$, cho ba điểm $A(1; 2), B(4; 6), C(-3; 5)$. Chứng minh tam giác $ABC$ vuông tại $A$ và tính diện tích tam giác $ABC$.',
        hints: ['Tính tọa độ $\\vec{AB} = (3; 4)$ và $\\vec{AC} = (-4; 3)$, sau đó kiểm tra tích vô hướng $\\vec{AB} \\cdot \\vec{AC} = 0$.'],
        solutionSteps: [
          'Bước 1: $\\vec{AB} = (3; 4)$ và $\\vec{AC} = (-4; 3)$.',
          'Bước 2: $\\vec{AB} \\cdot \\vec{AC} = 3(-4) + 4(3) = -12 + 12 = 0 \\implies AB \\perp AC$ (tam giác vuông tại $A$).',
          'Bước 3: $AB = \\sqrt{3^2 + 4^2} = 5$, $AC = \\sqrt{(-4)^2 + 3^2} = 5 \\implies S_{ABC} = \\frac{1}{2}AB\\cdot AC = 12{,}5$.'
        ],
        finalAnswer: '$\\vec{AB} \\cdot \\vec{AC} = 0$; diện tích $S_{ABC} = 12{,}5$.'
      },
      {
        source: 'Loigiaihay · Công thức tính góc giữa hai vectơ 10',
        question:
          'Cho $\\vec{a}, \\vec{b}$ thỏa $|\\vec{a}| = 3, |\\vec{b}| = 4$ và góc $(\\vec{a}, \\vec{b}) = 120^\\circ$. Tính $|\\vec{a} + \\vec{b}|$.',
        hints: ['Bình phương độ dài: $|\\vec{a} + \\vec{b}|^2 = \\vec{a}^2 + 2\\vec{a}\\cdot\\vec{b} + \\vec{b}^2$.'],
        solutionSteps: [
          'Bước 1: $\\vec{a}\\cdot\\vec{b} = 3 \\cdot 4 \\cdot \\cos 120^\\circ = 12 \\cdot (-0{,}5) = -6$.',
          'Bước 2: $|\\vec{a} + \\vec{b}|^2 = 3^2 + 2(-6) + 4^2 = 9 - 12 + 16 = 13$.',
          'Bước 3: Suy ra $|\\vec{a} + \\vec{b}| = \\sqrt{13}$.'
        ],
        finalAnswer: '$|\\vec{a} + \\vec{b}| = \\sqrt{13}$.'
      }
    ]
  },
  'math-10-3': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    essayProblems: [
      {
        source: 'VietJack · Toán 10 GDPT 2018 · Quy hoạch tuyến tính',
        question:
          'Một xưởng sản xuất hai loại sản phẩm A và B. Mỗi sản phẩm A cần $2\\text{ giờ}$ máy và $1\\text{ kg}$ nguyên liệu, lãi $40\\text{ nghìn đồng}$. Mỗi sản phẩm B cần $1\\text{ giờ}$ máy và $2\\text{ kg}$ nguyên liệu, lãi $50\\text{ nghìn đồng}$. Biết xưởng có tối đa $8\\text{ giờ}$ máy và $10\\text{ kg}$ nguyên liệu. Hỏi nên sản xuất bao nhiêu mỗi loại để lãi lớn nhất?',
        hints: ['Hệ ràng buộc: $2x + y \\le 8$, $x + 2y \\le 10$, $x, y \\ge 0$. Tìm các đỉnh miền đa giác nghiệm rồi tính $F(x, y) = 40x + 50y$.'],
        solutionSteps: [
          'Bước 1: Lập hệ BPT: $\\begin{cases} 2x + y \\le 8 \\\\ x + 2y \\le 10 \\\\ x \\ge 0, y \\ge 0 \\end{cases}$, hàm lợi nhuận $F(x, y) = 40x + 50y$.',
          'Bước 2: Các đỉnh miền nghiệm tứ giác $OABC$: $O(0; 0)$, $A(4; 0)$, $C(0; 5)$, và giao điểm $B$: giải hệ $2x + y = 8, x + 2y = 10 \\implies B(2; 4)$.',
          'Bước 3: Tính $F$ tại các đỉnh: $F(0; 0) = 0$; $F(4; 0) = 160$; $F(0; 5) = 250$; $F(2; 4) = 80 + 200 = 280$ (nghìn đồng).'
        ],
        finalAnswer: 'Sản xuất $2$ sản phẩm A và $4$ sản phẩm B để đạt lợi nhuận cực đại $280\\text{ nghìn đồng}$.'
      },
      {
        source: 'Loigiaihay · Phép toán tập hợp 10',
        question:
          'Cho $A = (-\\infty; 3)$ và $B = [1; +\\infty)$. Xác định các tập hợp $A \\cap B$, $A \\cup B$, $A \\setminus B$ và $C_{\\mathbb{R}}B$.',
        hints: ['Biểu diễn hai khoảng trên trục số thực trước khi xác định phần chung và phần hiệu.'],
        solutionSteps: [
          'Bước 1: Giao $A \\cap B = [1; 3)$.',
          'Bước 2: Hợp $A \\cup B = (-\\infty; +\\infty) = \\mathbb{R}$.',
          'Bước 3: Hiệu $A \\setminus B = (-\\infty; 1)$ và phần bù $C_{\\mathbb{R}}B = (-\\infty; 1)$.'
        ],
        finalAnswer: '$A \\cap B = [1; 3)$, $A \\cup B = \\mathbb{R}$, $A \\setminus B = C_{\\mathbb{R}}B = (-\\infty; 1)$.'
      }
    ]
  },
  'math-10-4': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector',
    essayProblems: [
      {
        source: 'VietJack · Toán 10 · Phân tích vectơ',
        question:
          'Cho $\\triangle ABC$ có $M$ là trung điểm $BC$, $I$ là trung điểm $AM$. Chứng minh rằng $2\\vec{IA} + \\vec{IB} + \\vec{IC} = \\vec{0}$ và với mọi điểm $O$, $4\\vec{OI} = 2\\vec{OA} + \\vec{OB} + \\vec{OC}$.',
        hints: ['Dùng quy tắc trung điểm $M$ của $BC$: $\\vec{IB} + \\vec{IC} = 2\\vec{IM}$.'],
        solutionSteps: [
          'Bước 1: Vì $M$ là trung điểm $BC$ nên $\\vec{IB} + \\vec{IC} = 2\\vec{IM}$.',
          'Bước 2: Vì $I$ là trung điểm $AM$ nên $\\vec{IA} + \\vec{IM} = \\vec{0} \\implies 2\\vec{IA} + 2\\vec{IM} = \\vec{0}$. Suy ra $2\\vec{IA} + \\vec{IB} + \\vec{IC} = \\vec{0}$.',
          'Bước 3: Chèn điểm $O$ vào đẳng thức trên: $2(\\vec{OA} - \\vec{OI}) + (\\vec{OB} - \\vec{OI}) + (\\vec{OC} - \\vec{OI}) = \\vec{0} \\implies 4\\vec{OI} = 2\\vec{OA} + \\vec{OB} + \\vec{OC}$.'
        ],
        finalAnswer: 'Đã chứng minh được hệ thức trung tuyến lồng nhau của điểm $I$.'
      },
      {
        source: 'Loigiaihay · Ba điểm thẳng hàng bằng vectơ 10',
        question:
          'Cho hình bình hành $ABCD$, điểm $M$ thuộc $AB$ sao cho $AB = 3AM$, điểm $N$ thuộc $AC$ sao cho $AC = 4AN$. Chứng minh ba điểm $D, N, M$ thẳng hàng.',
        hints: ['Biểu diễn $\\vec{DN}$ và $\\vec{DM}$ theo hai vectơ cơ sở $\\vec{DA}$ và $\\vec{DC}$.'],
        solutionSteps: [
          'Bước 1: Ta có $\\vec{DM} = \\vec{DA} + \\vec{AM} = \\vec{DA} + \\frac{1}{3}\\vec{AB} = \\vec{DA} + \\frac{1}{3}\\vec{DC}$.',
          'Bước 2: $\\vec{DN} = \\vec{DA} + \\vec{AN} = \\vec{DA} + \\frac{1}{4}\\vec{AC} = \\vec{DA} + \\frac{1}{4}(\\vec{AB} - \\vec{DA}) = \\frac{3}{4}\\vec{DA} + \\frac{1}{4}\\vec{DC}$ (lưu ý $\\vec{AC} = \\vec{DC} - \\vec{DA}$ hoặc $\\vec{AB} + \\vec{AD}$ -> kiểm tra: $\\vec{AN} = \\frac{1}{4}(\\vec{AB} + \\vec{AD}) = \\frac{1}{4}\\vec{DC} - \\frac{1}{4}\\vec{DA} \\implies \\vec{DN} = \\frac{3}{4}\\vec{DA} + \\frac{1}{4}\\vec{DC}$).',
          'Bước 3: Nhận thấy $\\vec{DN} = \\frac{3}{4}\\left(\\vec{DA} + \\frac{1}{3}\\vec{DC}\\right) = \\frac{3}{4}\\vec{DM}$. Vậy $D, N, M$ thẳng hàng.'
        ],
        finalAnswer: '$\\vec{DN} = \\frac{3}{4}\\vec{DM}$, suy ra $D, N, M$ thẳng hàng.'
      }
    ]
  },
  'math-10-5': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    sim2dMode: 'grapher',
    sim3dMode: 'sphere_plane',
    essayProblems: [
      {
        source: 'VietJack · Phương pháp Tọa độ Oxy 10',
        question:
          'Trong mặt phẳng $Oxy$, cho đường tròn $(C): (x - 2)^2 + (y + 1)^2 = 25$ và điểm $M(5; 3)$. Chứng minh $M$ nằm trên đường tròn $(C)$ và viết phương trình tiếp tuyến của $(C)$ tại $M$.',
        hints: ['Thay tọa độ $M(5; 3)$ vào vế trái $(C)$. Tiếp tuyến tại $M$ đi qua $M$ và nhận $\\vec{IM}$ làm VTPT.'],
        solutionSteps: [
          'Bước 1: Thay $M(5; 3)$ vào $(C)$: $(5 - 2)^2 + (3 + 1)^2 = 9 + 16 = 25$ (đúng $\\implies M \\in (C)$).',
          'Bước 2: Tâm đường tròn là $I(2; -1)$, vectơ pháp tuyến tiếp tuyến tại $M$ là $\\vec{IM} = (3; 4)$.',
          'Bước 3: Phương trình tiếp tuyến: $3(x - 5) + 4(y - 3) = 0 \\iff 3x + 4y - 27 = 0$.'
        ],
        finalAnswer: '$3x + 4y - 27 = 0$.'
      },
      {
        source: 'Loigiaihay · Đường cao & Tâm đường tròn ngoại tiếp 10',
        question:
          'Viết phương trình tổng quát đường cao $AH$ của $\\triangle ABC$ với $A(1; 3)$, $B(-2; 1)$, $C(4; -1)$.',
        hints: ['Đường cao $AH$ đi qua $A(1; 3)$ và vuông góc với $BC$, nên nhận $\\vec{BC}$ làm vectơ pháp tuyến.'],
        solutionSteps: [
          'Bước 1: Tính $\\vec{BC} = (4 - (-2); -1 - 1) = (6; -2)$. Chọn VTPT rút gọn $\\vec{n} = (3; -1)$.',
          'Bước 2: Phương trình đường cao $AH$ đi qua $A(1; 3)$: $3(x - 1) - 1(y - 3) = 0 \\iff 3x - y = 0$.'
        ],
        finalAnswer: '$3x - y = 0$.'
      }
    ]
  },
  'math-10-6': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 10',
    sim2dMode: 'geometry',
    sim3dMode: 'conic_sections_3d',
    defaultGraphConfig: {
      type: 'quadratic',
      params: { a: 0.25, b: 0, c: 0, d: 0 },
      color: '#ec4899',
      name: 'Parabol Conic x² = 4y'
    },
    essayProblems: [
      {
        source: 'VietJack · Toán 10 GDPT 2018 · Ba đường Conic',
        question:
          'Lập phương trình chính tắc của Elip $(E)$ biết Elip đi qua điểm $A(5; 0)$ và có một tiêu điểm là $F_2(3; 0)$.',
        hints: ['Elip cắt trục hoành tại $(5; 0) \\implies a = 5$; tiêu điểm $(3; 0) \\implies c = 3 \\implies b^2 = a^2 - c^2$.'],
        solutionSteps: [
          'Bước 1: Phương trình chính tắc $(E): \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ ($a > b > 0$).',
          'Bước 2: $(E)$ qua $A(5; 0) \\implies a = 5 \\implies a^2 = 25$. Tiêu điểm $F_2(3; 0) \\implies c = 3$.',
          'Bước 3: $b^2 = a^2 - c^2 = 25 - 9 = 16$.'
        ],
        finalAnswer: '$\\frac{x^2}{25} + \\frac{y^2}{16} = 1$.'
      },
      {
        source: 'Loigiaihay · Thống kê Tứ phân vị 10',
        question:
          'Điểm kiểm tra của 9 học sinh tổ 1 là: $7, 5, 8, 9, 6, 8, 10, 4, 7$. Tìm số trung bình $\\bar{x}$, trung vị $M_e$, các tứ phân vị $Q_1, Q_3$ và khoảng tứ phân vị $\\Delta_Q$.',
        hints: ['Sắp xếp dãy tăng dần: $4, 5, 6, 7, 7, 8, 8, 9, 10$.'],
        solutionSteps: [
          'Bước 1: Sắp xếp tăng dần: $4, 5, 6, 7, 7, 8, 8, 9, 10$. Số trung bình $\\bar{x} = \\frac{64}{9} \\approx 7{,}11$.',
          'Bước 2: Mẫu $n = 9$, trung vị $Q_2 = M_e = 7$ (số thứ 5).',
          'Bước 3: Nửa dưới $(4, 5, 6, 7)$ có $Q_1 = \\frac{5 + 6}{2} = 5{,}5$; nửa trên $(8, 8, 9, 10)$ có $Q_3 = \\frac{8 + 9}{2} = 8{,}5$.',
          'Bước 4: Khoảng tứ phân vị $\\Delta_Q = Q_3 - Q_1 = 8{,}5 - 5{,}5 = 3$.'
        ],
        finalAnswer: '$\\bar{x} \\approx 7{,}11$; $Q_1 = 5{,}5, Q_2 = 7, Q_3 = 8{,}5$; $\\Delta_Q = 3$.'
      }
    ]
  },
  'math-11-1': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    essayProblems: [
      {
        source: 'VietJack · Phương trình lượng giác 11 KNTT',
        question: 'Giải phương trình $\\sin\\left(2x - \\frac{\\pi}{6}\\right) = \\frac{\\sqrt{3}}{2}$ và tìm nghiệm thuộc khoảng $(0; \\pi)$.',
        hints: ['$\\frac{\\sqrt{3}}{2} = \\sin\\frac{\\pi}{3}$. Viết 2 họ nghiệm rồi chặn $0 < x < \\pi$ tìm $k \\in \\mathbb{Z}$.'],
        solutionSteps: [
          'Bước 1: $\\sin(2x - \\frac{\\pi}{6}) = \\sin\\frac{\\pi}{3} \\iff \\left[\\begin{array}{l} 2x - \\frac{\\pi}{6} = \\frac{\\pi}{3} + k2\\pi \\\\ 2x - \\frac{\\pi}{6} = \\frac{2\\pi}{3} + k2\\pi \\end{array}\\right.$.',
          'Bước 2: Rút gọn họ nghiệm: $x = \\frac{\\pi}{4} + k\\pi$ hoặc $x = \\frac{5\\pi}{12} + k\\pi$ ($k \\in \\mathbb{Z}$).',
          'Bước 3: Xét $0 < x < \\pi$ chỉ có $k = 0$ thỏa mãn cho cả 2 họ: $x = \\frac{\\pi}{4}$ và $x = \\frac{5\\pi}{12}$.'
        ],
        finalAnswer: '$x = \\frac{\\pi}{4} + k\\pi$ hoặc $x = \\frac{5\\pi}{12} + k\\pi$; trên $(0; \\pi)$ có nghiệm $\\frac{\\pi}{4}, \\frac{5\\pi}{12}$.'
      },
      {
        source: 'Loigiaihay · Tập giá trị Hàm lượng giác 11',
        question: 'Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $y = 3\\sin x - 4$.',
        hints: ['Sử dụng tính chất $-1 \\le \\sin x \\le 1$ với mọi $x \\in \\mathbb{R}$.'],
        solutionSteps: [
          'Bước 1: Ta có $-1 \\le \\sin x \\le 1, \\forall x \\in \\mathbb{R}$.',
          'Bước 2: Nhân với 3 rồi trừ 4: $-3 - 4 \\le 3\\sin x - 4 \\le 3 - 4 \\iff -7 \\le y \\le -1$.'
        ],
        finalAnswer: '$\\max y = -1$ (khi $\\sin x = 1$); $\\min y = -7$ (khi $\\sin x = -1$).'
      }
    ]
  },
  'math-11-2': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    essayProblems: [
      {
        source: 'VietJack · Đạo hàm & Tiếp tuyến 11',
        question:
          'Cho đồ thị hàm số $(C): y = x^3 - 3x^2 + 2$. Viết phương trình tiếp tuyến của $(C)$ biết tiếp tuyến song song với đường thẳng $d: y = 9x - 4$.',
        hints: ['Hai đường thẳng song song có cùng hệ số góc $k = 9$. Giải $y\'(x_0) = 9$ tìm tiếp điểm, nhớ loại nếu tiếp tuyến trùng $d$.'],
        solutionSteps: [
          'Bước 1: Đạo hàm $y\' = 3x^2 - 6x$. Tiếp tuyến song song $d \\implies y\'(x_0) = 9 \\iff 3x_0^2 - 6x_0 - 9 = 0 \\iff x_0 = -1$ hoặc $x_0 = 3$.',
          'Bước 2: Với $x_0 = -1$: $y_0 = -2 \\implies$ tiếp tuyến $y = 9(x + 1) - 2 = 9x + 7$ (thỏa $7 \\neq -4$).',
          'Bước 3: Với $x_0 = 3$: $y_0 = 2 \\implies$ tiếp tuyến $y = 9(x - 3) + 2 = 9x - 25$ (thỏa $-25 \\neq -4$).'
        ],
        finalAnswer: '$y = 9x + 7$ và $y = 9x - 25$.'
      },
      {
        source: 'Loigiaihay · Vận tốc tức thời bằng Đạo hàm 11',
        question:
          'Một vật chuyển động thẳng xác định bởi phương trình $s(t) = t^3 - 3t^2 + 5t + 2$ ($s$ tính bằng mét, $t$ tính bằng giây). Tính vận tốc của vật ở thời điểm gia tốc bằng $0$.',
        hints: ['Vận tốc $v(t) = s\'(t)$, gia tốc $a(t) = v\'(t) = s\'\'(t)$. Giải $a(t) = 0$ tìm $t$ rồi thế vào $v(t)$.'],
        solutionSteps: [
          'Bước 1: $v(t) = s\'(t) = 3t^2 - 6t + 5$.',
          'Bước 2: $a(t) = v\'(t) = 6t - 6 = 0 \\iff t = 1\\text{ s}$.',
          'Bước 3: Vận tốc tại $t = 1\\text{ s}$: $v(1) = 3(1)^2 - 6(1) + 5 = 2\\text{ m/s}$.'
        ],
        finalAnswer: '$v = 2\\text{ m/s}$.'
      }
    ]
  },
  'math-11-3': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    defaultGraphConfig: {
      type: 'linear',
      params: { a: 3, b: 2, c: 0, d: 0 },
      color: '#3b82f6',
      name: 'uₙ = 2 + 3(n - 1)'
    },
    essayProblems: [
      {
        source: 'VietJack · Cấp số cộng 11 KNTT',
        question:
          'Tìm số hạng đầu $u_1$ và công sai $d$ của cấp số cộng $(u_n)$ biết $\\begin{cases} u_3 + u_5 = 14 \\\\ S_{12} = 129 \\end{cases}$.',
        hints: ['Đưa tất cả về $u_1$ và $d$: $u_3 + u_5 = 2u_1 + 6d = 14$, $S_{12} = 6(2u_1 + 11d) = 129$.'],
        solutionSteps: [
          'Bước 1: Biểu diễn hệ theo $u_1, d$: $\\begin{cases} u_1 + 3d = 7 \\\\ 2u_1 + 11d = 21{,}5 \\end{cases}$ (từ $S_{12} = 129 \\implies 2u_1 + 11d = \\frac{129}{6} = 21{,}5$).',
          'Bước 2: Nhân PT(1) với 2: $2u_1 + 6d = 14$. Trừ vào PT(2): $5d = 7{,}5 \\implies d = 1{,}5$.',
          'Bước 3: Thay vào $u_1 = 7 - 3(1{,}5) = 2{,}5$.'
        ],
        finalAnswer: '$u_1 = 2{,}5$; $d = 1{,}5$.'
      },
      {
        source: 'Loigiaihay · Cấp số nhân 11',
        question:
          'Cho cấp số nhân $(u_n)$ có $u_1 = 2$ và công bội $q = 3$. Hỏi số $486$ là số hạng thứ mấy của cấp số nhân và tính tổng 6 số hạng đầu tiên?',
        hints: ['Giải $u_n = u_1 q^{n-1} = 486 \\implies 3^{n-1} = 243$.'],
        solutionSteps: [
          'Bước 1: $2 \\cdot 3^{n-1} = 486 \\iff 3^{n-1} = 243 = 3^5 \\implies n - 1 = 5 \\implies n = 6$.',
          'Bước 2: Tổng 6 số hạng đầu: $S_6 = 2 \\cdot \\frac{1 - 3^6}{1 - 3} = 3^6 - 1 = 729 - 1 = 728$.'
        ],
        finalAnswer: 'Số $486$ là số hạng thứ $6$; $S_6 = 728$.'
      }
    ]
  },
  'math-11-4': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section',
    essayProblems: [
      {
        source: 'VietJack · Hình học không gian 11 · Khoảng cách',
        question:
          'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, $SA \\perp (ABCD)$ và $SA = a$. Tính khoảng cách từ $A$ đến mặt phẳng $(SBD)$.',
        hints: ['Gọi $O = AC \\cap BD$. Kẻ $AH \\perp SO$ tại $H$, chứng minh $AH \\perp (SBD)$ rồi dùng $\\frac{1}{AH^2} = \\frac{1}{SA^2} + \\frac{1}{AO^2}$.'],
        solutionSteps: [
          'Bước 1: Vì $BD \\perp AC$ và $BD \\perp SA \\implies BD \\perp (SAC)$. Trong $(SAC)$, kẻ $AH \\perp SO \\implies AH \\perp BD \\implies AH \\perp (SBD)$. Vậy $d(A, (SBD)) = AH$.',
          'Bước 2: Hình vuông cạnh $a$ có $AO = \\frac{a\\sqrt{2}}{2}$.',
          'Bước 3: Trong $\\triangle SAO$ vuông tại $A$: $\\frac{1}{AH^2} = \\frac{1}{a^2} + \\frac{1}{(a\\sqrt{2}/2)^2} = \\frac{1}{a^2} + \\frac{2}{a^2} = \\frac{3}{a^2} \\implies AH = \\frac{a\\sqrt{3}}{3}$.'
        ],
        finalAnswer: '$d(A, (SBD)) = \\frac{a\\sqrt{3}}{3}$.'
      },
      {
        source: 'Loigiaihay · Góc giữa đường thẳng và mặt phẳng 11',
        question:
          'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình chữ nhật tâm $O$, $AB = a, AD = a\\sqrt{3}$, $SA \\perp (ABCD)$ và $SA = 2a$. Tính góc giữa đường thẳng $SC$ và mặt phẳng $(ABCD)$.',
        hints: ['Hình chiếu của $SC$ lên $(ABCD)$ là $AC$. Tính $AC$ theo Pythagoras rồi tính $\\tan\\widehat{SCA} = \\frac{SA}{AC}$.'],
        solutionSteps: [
          'Bước 1: Đường chéo $AC = \\sqrt{a^2 + (a\\sqrt{3})^2} = 2a$.',
          'Bước 2: Vì $SA \\perp (ABCD)$ nên góc giữa $SC$ và đáy là $\\widehat{SCA}$.',
          'Bước 3: $\\tan\\widehat{SCA} = \\frac{SA}{AC} = \\frac{2a}{2a} = 1 \\implies \\widehat{SCA} = 45^\\circ$.'
        ],
        finalAnswer: 'Góc giữa $SC$ và $(ABCD)$ bằng $45^\\circ$.'
      }
    ]
  },
  'math-11-5': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    essayProblems: [
      {
        source: 'VietJack · Công thức Lượng giác 11',
        question: 'Biết $\\sin\\alpha = \\frac{3}{5}$ với $\\frac{\\pi}{2} < \\alpha < \\pi$. Tính $\\cos\\alpha$, $\\sin 2\\alpha$ và $\\cos 2\\alpha$.',
        hints: ['Trong góc phần tư II ($\\pi/2 < \\alpha < \\pi$), $\\cos\\alpha < 0$.'],
        solutionSteps: [
          'Bước 1: $\\cos^2\\alpha = 1 - \\sin^2\\alpha = 1 - \\frac{9}{25} = \\frac{16}{25}$. Vì $\\frac{\\pi}{2} < \\alpha < \\pi \\implies \\cos\\alpha = -\\frac{4}{5}$.',
          'Bước 2: $\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha = 2 \\cdot \\frac{3}{5} \\cdot \\left(-\\frac{4}{5}\\right) = -\\frac{24}{25}$.',
          'Bước 3: $\\cos 2\\alpha = 1 - 2\\sin^2\\alpha = 1 - 2 \\cdot \\frac{9}{25} = \\frac{7}{25}$.'
        ],
        finalAnswer: '$\\cos\\alpha = -\\frac{4}{5}$, $\\sin 2\\alpha = -\\frac{24}{25}$, $\\cos 2\\alpha = \\frac{7}{25}$.'
      },
      {
        source: 'Loigiaihay · Phương trình cổ điển a sin x + b cos x = c',
        question: 'Giải phương trình lượng giác $\\sqrt{3}\\sin x + \\cos x = \\sqrt{2}$.',
        hints: ['Chia hai vế cho $\\sqrt{(\\sqrt{3})^2 + 1^2} = 2$ để đưa về $\\sin(x + \\frac{\\pi}{6}) = \\frac{\\sqrt{2}}{2}$.'],
        solutionSteps: [
          'Bước 1: Chia hai vế cho $2$: $\\frac{\\sqrt{3}}{2}\\sin x + \\frac{1}{2}\\cos x = \\frac{\\sqrt{2}}{2} \\iff \\sin\\left(x + \\frac{\\pi}{6}\\right) = \\sin\\frac{\\pi}{4}$.',
          'Bước 2: Giải ra $x + \\frac{\\pi}{6} = \\frac{\\pi}{4} + k2\\pi$ hoặc $x + \\frac{\\pi}{6} = \\frac{3\\pi}{4} + k2\\pi$.',
          'Bước 3: Vậy $x = \\frac{\\pi}{12} + k2\\pi$ hoặc $x = \\frac{7\\pi}{12} + k2\\pi$ ($k \\in \\mathbb{Z}$).'
        ],
        finalAnswer: '$x = \\frac{\\pi}{12} + k2\\pi$ hoặc $x = \\frac{7\\pi}{12} + k2\\pi$.'
      }
    ]
  },
  'math-11-6': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    defaultGraphConfig: {
      type: 'rational',
      params: { a: 2, b: -1, c: 1, d: 1 },
      color: '#06b6d4',
      name: 'y = (2x - 1)/(x + 1)'
    },
    essayProblems: [
      {
        source: 'VietJack · Giới hạn 0/0 nhân liên hợp 11',
        question: 'Tính giới hạn $L = \\lim_{x \\to 2} \\frac{\\sqrt{x + 2} - 2}{x - 2}$.',
        hints: ['Nhân cả tử và mẫu với biểu thức liên hợp $\\sqrt{x + 2} + 2$ để làm xuất hiện nhân tử $(x - 2)$ trên tử.'],
        solutionSteps: [
          'Bước 1: $L = \\lim_{x \\to 2} \\frac{(\\sqrt{x + 2} - 2)(\\sqrt{x + 2} + 2)}{(x - 2)(\\sqrt{x + 2} + 2)} = \\lim_{x \\to 2} \\frac{x - 2}{(x - 2)(\\sqrt{x + 2} + 2)}$.',
          'Bước 2: Rút gọn $(x - 2)$: $L = \\lim_{x \\to 2} \\frac{1}{\\sqrt{x + 2} + 2} = \\frac{1}{2 + 2} = \\frac{1}{4}$.'
        ],
        finalAnswer: '$L = \\frac{1}{4}$.'
      },
      {
        source: 'Loigiaihay · Giới hạn vô cực căn thức',
        question: 'Tính giới hạn dãy số $I = \\lim (\\sqrt{n^2 + 6n + 1} - n)$.',
        hints: ['Nhân và chia cho biểu thức liên hợp $\\sqrt{n^2 + 6n + 1} + n$, rồi chia cả tử và mẫu cho $n$.'],
        solutionSteps: [
          'Bước 1: $I = \\lim \\frac{n^2 + 6n + 1 - n^2}{\\sqrt{n^2 + 6n + 1} + n} = \\lim \\frac{6n + 1}{\\sqrt{n^2 + 6n + 1} + n}$.',
          'Bước 2: Chia cả tử và mẫu cho $n$: $I = \\lim \\frac{6 + 1/n}{\\sqrt{1 + 6/n + 1/n^2} + 1} = \\frac{6}{1 + 1} = 3$.'
        ],
        finalAnswer: '$I = 3$.'
      }
    ]
  },
  'math-11-7': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    sim2dMode: 'geometry',
    sim3dMode: 'pyramid_section',
    essayProblems: [
      {
        source: 'VietJack · Thiết diện khối chóp 11',
        question:
          'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình bình hành. Gọi $M$ là trung điểm $SC$, mặt phẳng $(\\alpha)$ qua $AM$ và song song với $BD$ lần lượt cắt $SB, SD$ tại $E, F$. Xác định thiết diện và chứng minh $EF // BD$.',
        hints: ['Gọi $O = AC \\cap BD$, $I = SO \\cap AM$. Trong $(SBD)$, kẻ đường thẳng qua $I$ song song $BD$ cắt $SB, SD$ tại $E, F$.'],
        solutionSteps: [
          'Bước 1: Gọi $O = AC \\cap BD$. Trong $(SAC)$, $AM$ cắt $SO$ tại $I$ (là trọng tâm $\\triangle SAC$).',
          'Bước 2: Vì $(\\alpha) // BD$ và $I \\in (\\alpha) \\cap (SBD)$, giao tuyến của $(\\alpha)$ với $(SBD)$ là đường thẳng qua $I$ song song với $BD$, cắt $SB, SD$ tại $E, F$.',
          'Bước 3: Thiết diện thu được là tứ giác $AEMF$, trong đó đường chéo $EF // BD$ theo tính chất giao tuyến.'
        ],
        finalAnswer: 'Thiết diện là tứ giác $AEMF$ ($E, F$ có $\\frac{SE}{SB} = \\frac{SF}{SD} = \\frac{2}{3}$) và $EF // BD$.'
      },
      {
        source: 'Loigiaihay · Chứng minh đường thẳng song song mặt phẳng 11',
        question:
          'Cho tứ diện $ABCD$. Gọi $G_1, G_2$ lần lượt là trọng tâm các tam giác $ABC$ và $ABD$. Chứng minh $G_1 G_2 // (BCD)$.',
        hints: ['Gọi $M, N$ là trung điểm $BC, BD$. Áp dụng Ta-lét theo tỉ số $\\frac{AG_1}{AM} = \\frac{AG_2}{AN} = \\frac{2}{3}$.'],
        solutionSteps: [
          'Bước 1: Gọi $M, N$ lần lượt là trung điểm $BC$ và $BD$. Do $G_1, G_2$ là trọng tâm nên $\\frac{AG_1}{AM} = \\frac{AG_2}{AN} = \\frac{2}{3}$.',
          'Bước 2: Theo định lý Ta-lét đảo trong $\\triangle AMN$, suy ra $G_1 G_2 // MN$.',
          'Bước 3: Mặt khác $MN \\subset (BCD)$ và $G_1 G_2 \\not\\subset (BCD) \\implies G_1 G_2 // (BCD)$.'
        ],
        finalAnswer: '$G_1 G_2 // (BCD)$ (và $G_1 G_2 = \\frac{1}{3}CD$).'
      }
    ]
  },
  'math-11-8': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 11',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    essayProblems: [
      {
        source: 'VietJack · Toán 11 GDPT 2018 · Logarit',
        question: 'Rút gọn biểu thức $P = \\log_2(12) - \\log_2(3) + \\log_{4}(16)$ (với phép tính không chứa tham số).',
        hints: ['Gộp hiệu hai logarit cùng cơ số: $\\log_2(12) - \\log_2(3) = \\log_2(12/3) = \\log_2 4$.'],
        solutionSteps: [
          'Bước 1: $\\log_2(12) - \\log_2(3) = \\log_2\\left(\\frac{12}{3}\\right) = \\log_2 4 = 2$.',
          'Bước 2: $\\log_4(16) = \\log_4(4^2) = 2$.',
          'Bước 3: Vậy $P = 2 + 2 = 4$.'
        ],
        finalAnswer: '$P = 4$.'
      },
      {
        source: 'Loigiaihay · Công thức cộng xác suất 11',
        question:
          'Một lớp học có 40 học sinh, trong đó 22 em giỏi Toán, 18 em giỏi Anh và 10 em giỏi cả hai môn. Chọn ngẫu nhiên 1 học sinh. Tính xác suất để học sinh đó giỏi ít nhất một trong hai môn Toán hoặc Anh.',
        hints: ['Áp dụng công thức cộng $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.'],
        solutionSteps: [
          'Bước 1: $P(T) = \\frac{22}{40}$, $P(A) = \\frac{18}{40}$, $P(T \\cap A) = \\frac{10}{40}$.',
          'Bước 2: $P(T \\cup A) = \\frac{22 + 18 - 10}{40} = \\frac{30}{40} = \\frac{3}{4} = 0{,}75$.'
        ],
        finalAnswer: '$P = \\frac{3}{4} = 75\\%$.'
      }
    ]
  },
  'math-12-3': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'geometry',
    sim3dMode: 'revolution_solid',
    essayProblems: [
      {
        source: 'VietJack · Hình học 12 · Khối nón – Khối trụ',
        question:
          'Cho hình nón có thiết diện qua trục là một tam giác vuông cân có cạnh huyền bằng $4\\sqrt{2}\\text{ cm}$. Tính diện tích xung quanh và thể tích của khối nón.',
        hints: ['Cạnh huyền thiết diện qua trục chính là đường kính đáy $2r = 4\\sqrt{2}$, còn đường cao $h = r$.'],
        solutionSteps: [
          'Bước 1: Đường kính đáy $2r = 4\\sqrt{2} \\implies r = 2\\sqrt{2}\\text{ cm}$. Tam giác vuông cân $\\implies$ chiều cao $h = r = 2\\sqrt{2}\\text{ cm}$, đường sinh $l = 4\\text{ cm}$.',
          'Bước 2: $S_{xq} = \\pi r l = \\pi \\cdot 2\\sqrt{2} \\cdot 4 = 8\\sqrt{2}\\pi\\text{ cm}^2$.',
          'Bước 3: $V = \\frac{1}{3} \\pi r^2 h = \\frac{1}{3}\\pi (8)(2\\sqrt{2}) = \\frac{16\\sqrt{2}\\pi}{3}\\text{ cm}^3$.'
        ],
        finalAnswer: '$S_{xq} = 8\\sqrt{2}\\pi\\text{ cm}^2$; $V = \\frac{16\\sqrt{2}\\pi}{3}\\text{ cm}^3$.'
      },
      {
        source: 'Loigiaihay · Khối trụ & Thiết diện song song trục 12',
        question:
          'Một hình trụ có bán kính đáy $R = 5\\text{ cm}$, chiều cao $h = 6\\text{ cm}$. Mặt phẳng $(P)$ song song với trục và cách trục $d = 3\\text{ cm}$ cắt hình trụ theo một thiết diện. Tính diện tích thiết diện đó.',
        hints: ['Thiết diện song song trục là hình chữ nhật có một cạnh là $h = 6$, cạnh kia là dây cung đáy $AB = 2\\sqrt{R^2 - d^2}$.'],
        solutionSteps: [
          'Bước 1: Thiết diện là hình chữ nhật $ABB\'A\'$ có chiều cao $AA\' = h = 6\\text{ cm}$.',
          'Bước 2: Độ dài cạnh đáy dây cung: $AB = 2\\sqrt{R^2 - d^2} = 2\\sqrt{5^2 - 3^2} = 8\\text{ cm}$.',
          'Bước 3: Diện tích thiết diện: $S = AB \\cdot h = 8 \\cdot 6 = 48\\text{ cm}^2$.'
        ],
        finalAnswer: '$S = 48\\text{ cm}^2$.'
      }
    ]
  },
  'math-9-8': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 9',
    sim2dMode: 'geometry',
    sim3dMode: 'revolution_solid',
    essayProblems: [
      {
        source: 'VietJack · Toán 9 GDPT 2018 · Hình trụ - Nón - Cầu',
        question:
          'Một chiếc cốc hình trụ có bán kính đáy $R = 3\\text{ cm}$ và chiều cao $h = 10\\text{ cm}$. Tính diện tích xung quanh và thể tích tối đa của chiếc cốc (lấy $\\pi \\approx 3{,}14$).',
        hints: ['Hình trụ: $S_{xq} = 2\\pi R h$ và $V = \\pi R^2 h$.'],
        solutionSteps: [
          'Bước 1: Diện tích xung quanh: $S_{xq} = 2\\pi R h = 2\\pi \\cdot 3 \\cdot 10 = 60\\pi \\approx 188{,}4\\text{ cm}^2$.',
          'Bước 2: Thể tích cốc: $V = \\pi R^2 h = \\pi \\cdot 3^2 \\cdot 10 = 90\\pi \\approx 282{,}6\\text{ cm}^3$.'
        ],
        finalAnswer: '$S_{xq} = 60\\pi\\text{ cm}^2 \\approx 188{,}4\\text{ cm}^2$; $V = 90\\pi\\text{ cm}^3 \\approx 282{,}6\\text{ cm}^3$.'
      },
      {
        source: 'Loigiaihay · Hình nón & Hình cầu Lớp 9',
        question:
          'Một quả bóng rổ hình cầu có bán kính $R = 12\\text{ cm}$. Tính diện tích bề mặt da và thể tích không khí bên trong quả bóng (theo $\\pi$).',
        hints: ['Mặt cầu: $S = 4\\pi R^2$ và $V = \\frac{4}{3}\\pi R^3$.'],
        solutionSteps: [
          'Bước 1: Diện tích mặt cầu: $S = 4\\pi R^2 = 4\\pi \\cdot 12^2 = 576\\pi\\text{ cm}^2$.',
          'Bước 2: Thể tích khối cầu: $V = \\frac{4}{3}\\pi R^3 = \\frac{4}{3}\\pi \\cdot 1728 = 2304\\pi\\text{ cm}^3$.'
        ],
        finalAnswer: '$S = 576\\pi\\text{ cm}^2$; $V = 2304\\pi\\text{ cm}^3$.'
      }
    ]
  },
  'math-12-4': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'grapher',
    sim3dMode: 'line_plane_oxyz',
    essayProblems: [
      {
        source: 'VietJack · Hình học Oxyz 12 · Đường thẳng',
        question:
          'Trong không gian $Oxyz$, cho đường thẳng $d: \\frac{x - 1}{2} = \\frac{y + 2}{-1} = \\frac{z - 3}{2}$ và mặt phẳng $(P): 2x - y - 2z + 5 = 0$. Tính $\\sin$ góc giữa đường thẳng $d$ và mặt phẳng $(P)$, và tìm giao điểm của $d$ với $(P)$.',
        hints: ['VTCP $\\vec{u} = (2; -1; 2)$, VTPT $\\vec{n} = (2; -1; -2)$. $\\sin(d, (P)) = |\\cos(\\vec{u}, \\vec{n})|$. Tham số hóa $d$ thay vào $(P)$ để tìm $t$.'],
        solutionSteps: [
          'Bước 1: $\\sin(d, (P)) = \\frac{|\\vec{u}\\cdot\\vec{n}|}{|\\vec{u}||\\vec{n}|} = \\frac{|2\\cdot 2 + (-1)(-1) + 2(-2)|}{\\sqrt{4+1+4}\\cdot\\sqrt{4+1+4}} = \\frac{|4 + 1 - 4|}{3 \\cdot 3} = \\frac{1}{9}$.',
          'Bước 2: Phương trình tham số $d$: $x = 1 + 2t, y = -2 - t, z = 3 + 2t$. Thay vào $(P)$: $2(1+2t) - (-2-t) - 2(3+2t) + 5 = 0 \\iff t + 3 = 0 \\iff t = -3$.',
          'Bước 3: Giao điểm $M(-5; 1; -3)$.'
        ],
        finalAnswer: '$\\sin(d, (P)) = \\frac{1}{9}$; giao điểm $M(-5; 1; -3)$.'
      },
      {
        source: 'Loigiaihay · Khoảng cách chéo nhau Oxyz',
        question:
          'Tính khoảng cách từ điểm $M(1; 2; -1)$ đến đường thẳng $\\Delta: \\frac{x - 2}{1} = \\frac{y}{2} = \\frac{z + 1}{-2}$.',
        hints: ['Lấy $A(2; 0; -1) \\in \\Delta$, VTCP $\\vec{u} = (1; 2; -2)$. Áp dụng $d(M, \\Delta) = \\frac{|[\\vec{AM}, \\vec{u}]|}{|\\vec{u}|}$.'],
        solutionSteps: [
          'Bước 1: $\\vec{AM} = (-1; 2; 0)$, $\\vec{u} = (1; 2; -2)$.',
          'Bước 2: Tích có hướng $[\\vec{AM}, \\vec{u}] = (-4; -2; -4) \\implies |[\\vec{AM}, \\vec{u}]| = \\sqrt{16 + 4 + 16} = 6$.',
          'Bước 3: $|\\vec{u}| = \\sqrt{1 + 4 + 4} = 3 \\implies d(M, \\Delta) = \\frac{6}{3} = 2$.'
        ],
        finalAnswer: '$d(M, \\Delta) = 2$.'
      }
    ]
  },
  'math-12-5': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    defaultGraphConfig: {
      type: 'linear',
      params: { a: 0.85, b: 0.1, c: 0, d: 0 },
      color: '#06b6d4',
      name: 'Đường xác suất Bayes'
    },
    essayProblems: [
      {
        source: 'VietJack · Toán 12 GDPT 2018 · Công thức Bayes',
        question:
          'Một nhà máy có 2 phân xưởng I và II. Phân xưởng I sản xuất $60\\%$ tổng sản phẩm với tỉ lệ phế phẩm $2\\%$; phân xưởng II sản xuất $40\\%$ với tỉ lệ phế phẩm $5\\%$. Lấy ngẫu nhiên 1 sản phẩm và thấy đó là phế phẩm. Tính xác suất sản phẩm đó do phân xưởng II sản xuất.',
        hints: ['Dùng công thức xác suất toàn phần tính $P(B)$ (là phế phẩm), rồi áp dụng Bayes: $P(A_2 | B) = \\frac{P(A_2)P(B|A_2)}{P(B)}$.'],
        solutionSteps: [
          'Bước 1: Gọi $A_1, A_2$ là biến cố sản phẩm thuộc phân xưởng I, II ($P(A_1) = 0{,}6$, $P(A_2) = 0{,}4$); $B$ là biến cố phế phẩm.',
          'Bước 2: Xác suất toàn phần: $P(B) = 0{,}6 \\cdot 0{,}02 + 0{,}4 \\cdot 0{,}05 = 0{,}012 + 0{,}020 = 0{,}032$.',
          'Bước 3: Theo công thức Bayes: $P(A_2 | B) = \\frac{0{,}020}{0{,}032} = \\frac{5}{8} = 0{,}625$.'
        ],
        finalAnswer: '$P(A_2 | B) = \\frac{5}{8} = 62{,}5\\%$.'
      },
      {
        source: 'Loigiaihay · Xác suất có điều kiện 12',
        question:
          'Một hộp chứa 7 bi xanh và 3 bi đỏ. Lần lượt lấy ngẫu nhiên không hoàn lại 2 viên bi. Biết viên thứ nhất là bi xanh, tính xác suất để viên thứ hai cũng là bi xanh.',
        hints: ['Sau khi rút 1 bi xanh ở lần 1, trong hộp còn 6 bi xanh và 3 bi đỏ (tổng 9 viên).'],
        solutionSteps: [
          'Bước 1: Gọi $A$: "viên 1 xanh", $B$: "viên 2 xanh".',
          'Bước 2: Khi biến cố $A$ đã xảy ra, hộp còn $9$ viên bi gồm $6$ bi xanh và $3$ bi đỏ.',
          'Bước 3: Xác suất có điều kiện $P(B | A) = \\frac{6}{9} = \\frac{2}{3}$.'
        ],
        finalAnswer: '$P(B | A) = \\frac{2}{3}$.'
      }
    ]
  },
  'math-12-6': {
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    defaultGraphConfig: {
      type: 'logarithmic',
      params: { a: 2, b: 1, c: 0, d: 0 },
      color: '#f59e0b',
      name: 'y = 2·ln(x)'
    },
    essayProblems: [
      {
        source: 'VietJack · Toán 12 · Bất phương trình Mũ - Logarit',
        question: 'Giải bất phương trình $\\log_{0{,}5}(x^2 - 5x + 6) \\ge -1$.',
        hints: ['Cơ số $0 < 0{,}5 < 1$ nên KHI BỎ LOGARIT PHẢI ĐỔI CHIỀU: $0 < x^2 - 5x + 6 \\le (0{,}5)^{-1} = 2$.'],
        solutionSteps: [
          'Bước 1: Điều kiện: $x^2 - 5x + 6 > 0 \\iff x < 2$ hoặc $x > 3$.',
          'Bước 2: Vì cơ số $0{,}5 \\in (0; 1)$, bất phương trình $\\iff x^2 - 5x + 6 \\le 2 \\iff x^2 - 5x + 4 \\le 0 \\iff 1 \\le x \\le 4$.',
          'Bước 3: Kết hợp ĐKXĐ: $x \\in [1; 2) \\cup (3; 4]$.'
        ],
        finalAnswer: 'Tập nghiệm $S = [1; 2) \\cup (3; 4]$.'
      },
      {
        source: 'Loigiaihay · Phương trình mũ đặt ẩn phụ',
        question: 'Giải phương trình $9^x - 4 \\cdot 3^x + 3 = 0$.',
        hints: ['Đặt $t = 3^x > 0$, phương trình trở thành $t^2 - 4t + 3 = 0$.'],
        solutionSteps: [
          'Bước 1: Đặt $t = 3^x$ ($t > 0$). Phương trình trở thành $t^2 - 4t + 3 = 0$.',
          'Bước 2: Giải được $t = 1$ (nhận) hoặc $t = 3$ (nhận).',
          'Bước 3: Với $3^x = 1 \\implies x = 0$; với $3^x = 3 \\implies x = 1$.'
        ],
        finalAnswer: '$x = 0$ hoặc $x = 1$.'
      }
    ]
  }
};

export const CHUYEN_MATH_LECTURES: MathLecture[] = [
  {
    id: 'math-pro-1',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Cơ bản',
    title: 'Chuyên Toán 1: Biến đổi Căn thức, Phương trình Vô tỉ & Bất đẳng thức Cô-si Nền tảng',
    grade: 'Chuyên Toán · Cơ bản (Lớp 9–10)',
    category: 'Đại số',
    difficulty: 'Vận dụng',
    readTimeMinutes: 12,
    description:
      'Bước đệm vào hệ Chuyên Toán: kỹ thuật trục căn liên hợp giải phương trình vô tỉ, đặt ẩn phụ không hoàn toàn và sử dụng bất đẳng thức AM-GM (Cô-si) kèm kỹ thuật tách ghép nghịch đảo.',
    mnemonics: [
      'Gặp $\\sqrt{A} - \\sqrt{B}$ trong phương trình: thử đoán nghiệm đẹp $x_0$, nhân liên hợp xuất hiện $(x - x_0)$ làm nhân tử chung.',
      'Kỹ thuật Cô-si ngược dấu & chọn điểm rơi: kiểm tra dấu bằng xảy ra tại đâu để tách hằng số cân bằng hai vế.'
    ],
    commonTraps: [
      'Bình phương hai vế phương trình $f(x) = \\sqrt{g(x)}$ mà quên điều kiện $f(x) \\ge 0$ dẫn đến nghiệm ngoại lai.',
      'Dùng Cô-si cho biểu thức chưa chứng minh không âm.'
    ],
    theory: [
      '1. Phương pháp nhân liên hợp: $\\sqrt{A} - \\sqrt{B} = \\frac{A - B}{\\sqrt{A} + \\sqrt{B}}$ (luôn nhớ chứng minh phần còn lại dương hoặc xét điều kiện).',
      '2. Phương pháp đặt ẩn phụ đưa về hệ đối xứng hoặc phương trình đẳng cấp.',
      '3. Bất đẳng thức AM-GM (Cô-si) chuẩn hóa: Với $a, b > 0$, $\\frac{a + b}{2} \\ge \\sqrt{ab}$; hệ quả cộng mẫu $\\frac{1}{a} + \\frac{1}{b} \\ge \\frac{4}{a + b}$.',
      '4. Kỹ thuật tách ghép chọn điểm rơi: Muốn tìm min $P = ax + \\frac{b}{x}$ trên $(0; +\\infty)$ hoặc trên $[x_0; +\\infty)$, nếu điểm rơi tại biên $x = x_0$, ta tách $ax = \\left(a - \\frac{b}{x_0^2}\\right)x + \\frac{b}{x_0^2}x$.'
    ],
    keyFormulas: [
      'a + b \\ge 2\\sqrt{ab}, \\quad \\frac{1}{a} + \\frac{1}{b} \\ge \\frac{4}{a + b}',
      '\\sqrt{A} = B \\iff \\begin{cases} B \\ge 0 \\\\ A = B^2 \\end{cases}',
      'a^2 + b^2 + c^2 \\ge ab + bc + ca \\ge \\frac{(a + b + c)^2}{3}'
    ],
    flashcards: [
      {
        front: 'Cho $x \\ge 2$. Tại sao không được Cô-si trực tiếp $x + \\frac{1}{x} \\ge 2$ để kết luận GTNN bằng 2?',
        back: 'Vì dấu bằng của $x + \\frac{1}{x} \\ge 2$ xảy ra tại $x = 1 \\notin [2; +\\infty)$. Cần chọn điểm rơi tại $x = 2$: $P = \\frac{3}{4}x + \\left(\\frac{x}{4} + \\frac{1}{x}\\right) \\ge \\frac{3}{2} + 1 = \\frac{5}{2}$.',
        tip: 'Luôn kiểm tra điểm rơi có thuộc tập xác định của biến không!'
      }
    ],
    sampleProblems: [
      {
        source: 'Đề tuyển sinh Chuyên Toán · BĐT cơ bản',
        question: 'Với $x \\ge 3$, giá trị nhỏ nhất của biểu thức $P = x + \\frac{4}{x}$ bằng:',
        options: ['A. $\\frac{13}{3}$', 'B. $4$', 'C. $5$', 'D. $\\frac{10}{3}$'],
        correctIndex: 0,
        explanation:
          'Điểm rơi ở $x = 3$ vì dấu bằng Cô-si tự nhiên $x = 2 < 3$. Tách $P = \\frac{5}{9}x + \\left(\\frac{4}{9}x + \\frac{4}{x}\\right) \\ge \\frac{5}{3} + 2\\sqrt{\\frac{16}{9}} = \\frac{5}{3} + \\frac{8}{3} = \\frac{13}{3}$.'
      },
      {
        source: 'Chuyên Toán 10 · Phương trình vô tỉ',
        question: 'Số nghiệm thực của phương trình $\\sqrt{2x + 3} = x$ là:',
        options: ['A. $1$', 'B. $2$', 'C. $0$', 'D. $3$'],
        correctIndex: 0,
        explanation:
          'Điều kiện $x \\ge 0$. Bình phương: $x^2 - 2x - 3 = 0 \\iff x = 3$ (nhận) hoặc $x = -1$ (loại vì $x \\ge 0$). Có duy nhất 1 nghiệm $x = 3$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề thi vào 10 Chuyên Toán · Câu BĐT',
        question:
          'Cho các số thực dương $a, b, c$ thỏa mãn $a + b + c = 3$. Tìm giá trị nhỏ nhất của biểu thức $P = \\frac{a^2}{b + c} + \\frac{b^2}{c + a} + \\frac{c^2}{a + b}$.',
        hints: ['Dùng BĐT Cô-si cho $\\frac{a^2}{b+c} + \\frac{b+c}{4} \\ge a$, rồi cộng cả ba đánh giá theo vế.'],
        solutionSteps: [
          'Bước 1: Áp dụng AM-GM cho hai số dương $\\frac{a^2}{b+c}$ và $\\frac{b+c}{4}$: $\\frac{a^2}{b+c} + \\frac{b+c}{4} \\ge 2\\sqrt{\\frac{a^2}{b+c}\\cdot\\frac{b+c}{4}} = a$.',
          'Bước 2: Tương tự: $\\frac{b^2}{c+a} + \\frac{c+a}{4} \\ge b$ và $\\frac{c^2}{a+b} + \\frac{a+b}{4} \\ge c$.',
          'Bước 3: Cộng vế theo vế: $P + \\frac{a+b+c}{2} \\ge a + b + c \\implies P \\ge \\frac{a + b + c}{2} = \\frac{3}{2}$. Dấu "=" khi $a = b = c = 1$.'
        ],
        finalAnswer: '$\\min P = \\frac{3}{2}$ khi $a = b = c = 1$.'
      },
      {
        source: 'Chuyên Toán · Phương trình vô tỉ nhân liên hợp',
        question: 'Giải phương trình $\\sqrt{3x + 1} - \\sqrt{x + 3} = x - 1$.',
        hints: ['Điều kiện $x \\ge -\\frac{1}{3}$. Nhân liên hợp vế trái thu được nhân tử chung $(x - 1)$.'],
        solutionSteps: [
          'Bước 1: Điều kiện $x \\ge -\\frac{1}{3}$. PT $\\iff \\frac{(3x + 1) - (x + 3)}{\\sqrt{3x + 1} + \\sqrt{x + 3}} = x - 1 \\iff \\frac{2(x - 1)}{\\sqrt{3x + 1} + \\sqrt{x + 3}} - (x - 1) = 0$.',
          'Bước 2: Đặt nhân tử $(x - 1)\\left(\\frac{2}{\\sqrt{3x + 1} + \\sqrt{x + 3}} - 1\\right) = 0$.',
          'Bước 3: Trường hợp 1: $x = 1$ (nhận). Trường hợp 2: $\\sqrt{3x + 1} + \\sqrt{x + 3} = 2$. Bình phương hai vế thu được $2\\sqrt{(3x+1)(x+3)} = -4x$, suy ra điều kiện $x \\in [-\\frac{1}{3}; 0]$. Tiếp tục bình phương: $(3x+1)(x+3) = 4x^2 \\iff x^2 - 10x - 3 = 0$, đối chiếu điều kiện nhận $x = 5 - 2\\sqrt{7}$.'
        ],
        finalAnswer: '$x = 1$ và $x = 5 - 2\\sqrt{7}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    defaultGraphConfig: {
      type: 'custom',
      customExpr: 'x + 4/x',
      params: { a: 1, b: 4, c: 0, d: 0 },
      color: '#d97706',
      name: 'y = x + 4/x (Điểm rơi AM-GM)'
    }
  },
  {
    id: 'math-pro-2',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Nâng cao',
    title: 'Chuyên Toán 2: BĐT Bunyakovsky (Cauchy-Schwarz) & Kỹ thuật Cộng mẫu Engel',
    grade: 'Chuyên Toán · Nâng cao (Lớp 10–11)',
    category: 'Đại số',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 14,
    description:
      'Làm chủ bất đẳng thức Cauchy-Schwarz dạng tổng tích và dạng cộng mẫu (Schwarz / Titu’s Lemma), biến đổi đồng bậc, phương pháp UCT (hệ số bất định) và chứng minh bất đẳng thức nhiều biến.',
    mnemonics: [
      'Cauchy-Schwarz dạng phân thức (Engel): $\\frac{x_1^2}{a_1} + \\frac{x_2^2}{a_2} + \\dots + \\frac{x_n^2}{a_n} \\ge \\frac{(x_1 + x_2 + \\dots + x_n)^2}{a_1 + a_2 + \\dots + a_n}$ với $a_i > 0$.',
      'Khi thấy mẫu bậc 1 và tử bậc 2 (hoặc cần biến tử thành hằng số), nhân thêm đại lượng dương vào tử và mẫu để áp dụng Engel.'
    ],
    commonTraps: [
      'Áp dụng Engel khi các mẫu thức $a_i$ chưa chứng minh được dương.',
      'Quên kiểm tra điều kiện đẳng thức $\\frac{x_1}{a_1} = \\frac{x_2}{a_2} = \\dots = \\frac{x_n}{a_n}$.'
    ],
    theory: [
      '1. Bất đẳng thức Bunyakovsky (Cauchy-Schwarz): $(a_1^2 + \\dots + a_n^2)(b_1^2 + \\dots + b_n^2) \\ge (a_1 b_1 + \\dots + a_n b_n)^2$. Dấu "=" xảy ra khi $\\frac{a_1}{b_1} = \\dots = \\frac{a_n}{b_n}$.',
      '2. Hệ quả Engel (Titu’s Lemma): Với $a_i > 0$, $\\sum_{i=1}^n \\frac{x_i^2}{a_i} \\ge \\frac{(\\sum x_i)^2}{\\sum a_i}$.',
      '3. Bất đẳng thức Schur bậc 3: $a^3 + b^3 + c^3 + 3abc \\ge ab(a+b) + bc(b+c) + ca(c+a)$ với $a,b,c \\ge 0$.'
    ],
    keyFormulas: [
      '(a^2 + b^2 + c^2)(x^2 + y^2 + z^2) \\ge (ax + by + cz)^2',
      '\\frac{x^2}{a} + \\frac{y^2}{b} + \\frac{z^2}{c} \\ge \\frac{(x + y + z)^2}{a + b + c} \\quad (a,b,c > 0)',
      'a^3 + b^3 + c^3 + 3abc \\ge \\sum_{sym} a^2 b'
    ],
    flashcards: [
      {
        front: 'Điều kiện xảy ra dấu bằng trong BĐT cộng mẫu $\\frac{x^2}{a} + \\frac{y^2}{b} + \\frac{z^2}{c} \\ge \\frac{(x+y+z)^2}{a+b+c}$?',
        back: 'Khi và chỉ khi $\\frac{x}{a} = \\frac{y}{b} = \\frac{z}{c}$.',
        tip: 'Kiểm tra dấu bằng ngay khi đặt bút chọn cách ghép tử.'
      }
    ],
    sampleProblems: [
      {
        source: 'Chuyên Toán 10 · Cauchy-Schwarz',
        question: 'Cho $3x + 4y = 10$. Giá trị nhỏ nhất của $P = x^2 + y^2$ là:',
        options: ['A. $4$', 'B. $2$', 'C. $5$', 'D. $10$'],
        correctIndex: 0,
        explanation:
          'Áp dụng Bunyakovsky: $(3^2 + 4^2)(x^2 + y^2) \\ge (3x + 4y)^2 \\implies 25(x^2 + y^2) \\ge 100 \\implies P \\ge 4$. Dấu "=" khi $x = \\frac{6}{5}, y = \\frac{8}{5}$.'
      },
      {
        source: 'HSG Toán · Bất đẳng thức Engel',
        question: 'Cho $a, b, c > 0$ thỏa $ab + bc + ca = 1$. Giá trị nhỏ nhất của $M = \\frac{a^2}{b+c} + \\frac{b^2}{c+a} + \\frac{c^2}{a+b}$ liên hệ thế nào với $a+b+c$?',
        options: [
          'A. $M \\ge \\frac{a+b+c}{2} \\ge \\frac{\\sqrt{3}}{2}$',
          'B. $M \\ge \\frac{1}{2}$',
          'C. $M \\ge \\sqrt{3}$',
          'D. $M \\ge \\frac{3}{2}$'
        ],
        correctIndex: 0,
        explanation:
          'Theo Engel: $M \\ge \\frac{(a+b+c)^2}{2(a+b+c)} = \\frac{a+b+c}{2}$. Mà $(a+b+c)^2 \\ge 3(ab+bc+ca) = 3 \\implies a+b+c \\ge \\sqrt{3} \\implies M \\ge \\frac{\\sqrt{3}}{2}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề thi Chuyên Toán & HSG Tỉnh · BĐT Engel biến đổi mẫu',
        question:
          'Cho $a, b, c > 0$ thỏa mãn $a + b + c = 3$. Chứng minh rằng $\\frac{a}{1 + b^2} + \\frac{b}{1 + c^2} + \\frac{c}{1 + a^2} \\ge \\frac{3}{2}$.',
        hints: ['Dùng Cô-si ngược dấu: $\\frac{a}{1 + b^2} = a - \\frac{ab^2}{1 + b^2} \\ge a - \\frac{ab^2}{2b} = a - \\frac{ab}{2}$.'],
        solutionSteps: [
          'Bước 1: Kỹ thuật Cô-si ngược dấu: $\\frac{a}{1 + b^2} = a - \\frac{ab^2}{1 + b^2} \\ge a - \\frac{ab^2}{2b} = a - \\frac{ab}{2}$.',
          'Bước 2: Tương tự cộng cả ba phân thức lại: $VT \\ge (a + b + c) - \\frac{ab + bc + ca}{2}$.',
          'Bước 3: Áp dụng $ab + bc + ca \\le \\frac{(a+b+c)^2}{3} = 3$, suy ra $VT \\ge 3 - \\frac{3}{2} = \\frac{3}{2}$. Dấu "=" khi $a = b = c = 1$.'
        ],
        finalAnswer: 'ĐPCM ($VT \\ge \\frac{3}{2}$ khi $a = b = c = 1$).'
      },
      {
        source: 'Chuyên Toán · Hệ số bất định / Cauchy-Schwarz phân thức',
        question:
          'Cho $x, y, z > 0$ và $x + y + z = 1$. Tìm GTNN của biểu thức $S = \\frac{1}{x^2 + y^2 + z^2} + \\frac{1}{xy} + \\frac{1}{yz} + \\frac{1}{zx}$.',
        hints: ['Nhóm $S \\ge \\frac{1}{x^2+y^2+z^2} + \\frac{9}{xy+yz+zx} = \\left(\\frac{1}{x^2+y^2+z^2} + \\frac{1}{xy+yz+zx} + \\frac{1}{xy+yz+zx}\\right) + \\frac{7}{xy+yz+zx}$.'],
        solutionSteps: [
          'Bước 1: Áp dụng Engel cho bộ 3 nghịch đảo: $\\frac{1}{xy} + \\frac{1}{yz} + \\frac{1}{zx} \\ge \\frac{9}{xy + yz + zx}$.',
          'Bước 2: Tách $S \\ge \\left(\\frac{1}{x^2+y^2+z^2} + \\frac{1}{xy+yz+zx} + \\frac{1}{xy+yz+zx}\\right) + \\frac{7}{xy+yz+zx}$.',
          'Bước 3: Dùng cộng mẫu nhóm đầu: $\\ge \\frac{9}{(x+y+z)^2} = 9$. Nhóm sau có $xy+yz+zx \\le \\frac{(x+y+z)^2}{3} = \\frac{1}{3} \\implies \\frac{7}{xy+yz+zx} \\ge 21$.',
          'Bước 4: Vậy $S \\ge 9 + 21 = 30$. Dấu "=" khi $x = y = z = \\frac{1}{3}$.'
        ],
        finalAnswer: '$\\min S = 30$ khi $x = y = z = \\frac{1}{3}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    defaultGraphConfig: {
      type: 'linear',
      params: { a: -0.75, b: 2.5, c: 0, d: 0 },
      color: '#9333ea',
      name: '3x + 4y = 10 (Khoảng cách O tới Δ)'
    }
  },
  {
    id: 'math-pro-3',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Nâng cao',
    title: 'Chuyên Toán 3: Số học Đồng dư, Định lý Fermat nhỏ & Phương trình Nghiệm nguyên',
    grade: 'Chuyên Toán · Nâng cao (Lớp 9–11)',
    category: 'Số học & Tổ hợp',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 14,
    description:
      'Vũ khí Số học Olympic: xét số chính phương theo mod 3, 4, 8; định lý Fermat nhỏ $a^{p-1} \\equiv 1 \\pmod p$; phương pháp kẹp giữa hai số chính phương liên tiếp và lùi vô hạn giải PT nghiệm nguyên.',
    mnemonics: [
      'Số chính phương $n^2$ chia 3 chỉ dư 0 hoặc 1; chia 4 chỉ dư 0 hoặc 1; chia 8 chỉ dư 0, 1 hoặc 4.',
      'Giữa $k^2$ và $(k+1)^2$ không tồn tại bất kỳ số chính phương nào!',
      'Với $p$ nguyên tố và $\\gcd(a, p) = 1$, luôn có $a^{p-1} \\equiv 1 \\pmod p$.'
    ],
    commonTraps: [
      'Áp dụng $a^{p-1} \\equiv 1 \\pmod p$ khi chưa kiểm tra $\\gcd(a, p) = 1$.',
      'Khi giải $xy + ax + by = c$ phân tích thành $(x+b)(y+a) = c + ab$ mà quên xét các ước ÂM của $c+ab$ khi $x, y \\in \\mathbb{Z}$.'
    ],
    theory: [
      '1. Đồng dư thức: $a \\equiv b \\pmod m \\iff m \\mid (a - b)$. Phép đồng dư bảo toàn cộng, trừ, nhân và nâng lên lũy thừa nguyên dương.',
      '2. Định lý Fermat nhỏ: Nếu $p$ là số nguyên tố thì $a^p \\equiv a \\pmod p$ với mọi $a \\in \\mathbb{Z}$. Nếu $p \\nmid a$ thì $a^{p-1} \\equiv 1 \\pmod p$.',
      '3. Phương pháp đánh giá (kẹp): Chứng minh biểu thức nằm giữa hai bình phương liên tiếp $A^2 < f(x) < (A+1)^2$ hoặc chia trường hợp thử biến nhỏ.',
      '4. Phương pháp lùi vô hạn (Fermat): Giả sử nghiệm tồn tại rồi suy ra một bộ nghiệm có giá trị tuyệt đối nhỏ hơn vô hạn → vô lý.'
    ],
    keyFormulas: [
      'n^2 \\equiv 0, 1 \\pmod{3, 4}; \\quad n^2 \\equiv 0, 1, 4 \\pmod 8',
      'a^{p-1} \\equiv 1 \\pmod p \\quad (p \\text{ nguyên tố}, \\gcd(a,p)=1)',
      'x^2 < y^2 < (x+1)^2 \\implies \\text{Vô nghiệm nguyên}'
    ],
    flashcards: [
      {
        front: 'Tại sao tổng bình phương của hai số nguyên bất kỳ không bao giờ chia 4 dư 3?',
        back: 'Vì mỗi số chính phương chia 4 chỉ dư $0$ hoặc $1$, nên $a^2 + b^2 \\pmod 4$ chỉ có thể nhận các giá trị $0, 1, 2$ (không bao giờ dư $3$).',
        tip: 'Mẹo cực mạnh để bác bỏ phương trình nghiệm nguyên bậc 2!'
      }
    ],
    sampleProblems: [
      {
        source: 'Chuyên Toán · Đồng dư thức',
        question: 'Số dư của $2^{2026}$ khi chia cho $7$ là:',
        options: ['A. $2$', 'B. $4$', 'C. $1$', 'D. $6$'],
        correctIndex: 0,
        explanation: 'Vì $2^3 = 8 \\equiv 1 \\pmod 7$. Mà $2026 = 3 \\cdot 675 + 1$, nên $2^{2026} = (2^3)^{675} \\cdot 2 \\equiv 1^{675} \\cdot 2 = 2 \\pmod 7$.'
      },
      {
        source: 'Chuyên Toán · Phương trình nghiệm nguyên',
        question: 'Có bao nhiêu cặp số nguyên $(x; y)$ thỏa mãn phương trình $x^2 + y^2 = 2027$?',
        options: ['A. $0$ cặp (Vô nghiệm)', 'B. $2$ cặp', 'C. $4$ cặp', 'D. $8$ cặp'],
        correctIndex: 0,
        explanation: '$2027 \\equiv 3 \\pmod 4$, trong khi tổng bình phương $x^2 + y^2$ chia 4 chỉ có thể dư $0, 1, 2$. Suy ra phương trình vô nghiệm.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề Chuyên Toán Tin · PT Nghiệm nguyên kẹp bình phương',
        question: 'Tìm tất cả các cặp số nguyên $(x; y)$ thỏa mãn $x^4 + x^2 + 1 = y^2$.',
        hints: ['So sánh $y^2 = x^4 + x^2 + 1$ với $(x^2)^2$ và $(x^2 + 1)^2$.'],
        solutionSteps: [
          'Bước 1: Với $x = 0$: $y^2 = 1 \\implies y = \\pm 1$. Nhận $(0; 1)$ và $(0; -1)$.',
          'Bước 2: Với $x \\neq 0$, ta có $x^2 > 0$, nên $(x^2)^2 < x^4 + x^2 + 1 < x^4 + 2x^2 + 1 = (x^2 + 1)^2$.',
          'Bước 3: Suy ra $(x^2)^2 < y^2 < (x^2 + 1)^2$. Giữa hai số chính phương liên tiếp không có số chính phương nào, nên vô nghiệm khi $x \\neq 0$.'
        ],
        finalAnswer: 'Nghiệm nguyên $(x; y) \\in \\{(0; 1), (0; -1)\\}$.'
      },
      {
        source: 'HSG Số học · Phương trình phân tích nhân tử',
        question: 'Tìm nghiệm nguyên dương của phương trình $2xy - 4x - 3y = 1$.',
        hints: ['Nhân cả hai vế với 2 để tránh phân số rồi nhóm $(2x - 3)(2y - 4) = 14$.'],
        solutionSteps: [
          'Bước 1: Nhân 2 hai vế: $4xy - 8x - 6y = 2 \\iff 2x(2y - 4) - 3(2y - 4) = 14 \\iff (2x - 3)(2y - 4) = 14$.',
          'Bước 2: Do $x, y \\in \\mathbb{Z}^+$ nên $2x - 3 \\ge -1$ là số lẻ, $2y - 4$ là số chẵn $\\ge -2$.',
          'Bước 3: Các ước lẻ của 14 là $\\{\\pm 1, 7\\}$ (với $-7$ bị loại vì $2x-3 \\ge -1$). Xét từng trường hợp: (1) $2x - 3 = -1, 2y - 4 = -14$ (loại vì $y < 0$); (2) $2x - 3 = 1, 2y - 4 = 14 \\implies x = 2, y = 9$; (3) $2x - 3 = 7, 2y - 4 = 2 \\implies x = 5, y = 3$.'
        ],
        finalAnswer: '$(x; y) \\in \\{(2; 9), (5; 3)\\}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    defaultGraphConfig: {
      type: 'quadratic',
      params: { a: 1, b: 0, c: 1, d: 0 },
      color: '#0891b2',
      name: 'Quỹ tích nghiệm nguyên'
    }
  },
  {
    id: 'math-pro-4',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Nâng cao',
    title: 'Chuyên Toán 4: Hình học Phẳng Olympic – Phương tích, Trục đẳng phương & Hàng điểm Điều hòa',
    grade: 'Chuyên Toán · Nâng cao (Lớp 9–11)',
    category: 'Hình học',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 15,
    description:
      'Chuyên đề Hình học Phẳng trọng tâm đề thi Chuyên & HSG: định lý Phương tích, Trục đẳng phương và Tâm đẳng phương của 3 đường tròn, Đường thẳng Simson, đường tròn Euler 9 điểm và tứ giác điều hòa.',
    mnemonics: [
      'Phương tích điểm $M$ với $(O; R)$: $\\mathcal{P}_{M/(O)} = MO^2 - R^2 = \\overline{MA} \\cdot \\overline{MB}$.',
      'Muốn chứng minh 3 đường thẳng đồng quy ở hình tròn: nghĩ ngay đến **Tâm đẳng phương** của 3 đường tròn!',
      'Đường thẳng Simson: 3 hình chiếu từ một điểm nằm trên đường tròn ngoại tiếp xuống 3 cạnh tam giác luôn thẳng hàng.'
    ],
    commonTraps: [
      'Nhầm dấu đại số trong tích $\\overline{MA}\\cdot\\overline{MB}$ khi $M$ nằm trong so với nằm ngoài đường tròn.',
      'Quên trường hợp hai đường tròn đồng tâm không có trục đẳng phương.'
    ],
    theory: [
      '1. Phương tích & Trục đẳng phương: Tập hợp các điểm có cùng phương tích đối với hai đường tròn $(O_1, R_1)$ và $(O_2, R_2)$ không đồng tâm là một đường thẳng vuông góc với đường nối tâm $O_1 O_2$.',
      '2. Tâm đẳng phương: Trục đẳng phương của từng cặp 3 đường tròn (tâm không thẳng hàng) hoặc đôi một song song, hoặc **đồng quy tại 1 điểm** gọi là tâm đẳng phương.',
      '3. Định lý Mê-nê-la-uýt (Menelaus) & Xê-va (Ceva): Công cụ vàng chứng minh thẳng hàng và đồng quy bằng tích tỉ số độ dài cạnh.',
      '4. Tứ giác điều hòa $ABCD$ nội tiếp: Tiếp tuyến tại $A, C$ cắt nhau tại $P$ nằm trên đường thẳng $BD \\iff AB \\cdot CD = AD \\cdot BC$.'
    ],
    keyFormulas: [
      '\\mathcal{P}_{M/(O)} = OM^2 - R^2 = \\overline{MA} \\cdot \\overline{MB}',
      '\\frac{\\overline{MA}}{\\overline{MB}} \\cdot \\frac{\\overline{NB}}{\\overline{NC}} \\cdot \\frac{\\overline{PC}}{\\overline{PA}} = 1 \\quad (\\text{Menelaus})',
      'AB \\cdot CD = AD \\cdot BC \\quad (\\text{Tứ giác điều hòa})'
    ],
    flashcards: [
      {
        front: 'Phát biểu ngắn gọn điều kiện thẳng hàng theo Định lý Đường thẳng Simson?',
        back: 'Cho điểm $P$ nằm trên đường tròn ngoại tiếp $\\triangle ABC$. Ba hình chiếu vuông góc của $P$ lên ba đường thẳng $BC, CA, AB$ luôn thẳng hàng.',
        tip: 'Đường thẳng chứa 3 hình chiếu gọi là đường thẳng Simson ứng với điểm $P$.'
      }
    ],
    sampleProblems: [
      {
        source: 'Chuyên Toán · Phương tích & Trục đẳng phương',
        question:
          'Cho hai đường tròn $(O_1)$ và $(O_2)$ cắt nhau tại $A, B$. Từ điểm $M$ trên tia đối của tia $BA$ kẻ hai tiếp tuyến $MC, MD$ tới $(O_1), (O_2)$. Hệ thức đúng là:',
        options: ['A. $MC = MD$', 'B. $MC > MD$', 'C. $MC + MD = AB$', 'D. $MC^2 - MD^2 = AB^2$'],
        correctIndex: 0,
        explanation: 'Đường thẳng $AB$ là trục đẳng phương của $(O_1)$ và $(O_2)$. Vì $M \\in AB$ nên $\\mathcal{P}_{M/(O_1)} = \\mathcal{P}_{M/(O_2)} \\implies MC^2 = MA\\cdot MB = MD^2 \\implies MC = MD$.'
      },
      {
        source: 'Chuyên Hình · Đường tròn Euler 9 điểm',
        question:
          'Trong tam giác nhọn $ABC$ có trực tâm $H$, bán kính đường tròn ngoại tiếp là $R$. Đường tròn Euler (đi qua 3 trung điểm cạnh, 3 chân đường cao và 3 trung điểm $HA, HB, HC$) có bán kính bằng:',
        options: ['A. $\\frac{R}{2}$', 'B. $R$', 'C. $\\frac{R\\sqrt{2}}{2}$', 'D. $\\frac{R}{3}$'],
        correctIndex: 0,
        explanation: 'Đường tròn Euler 9 điểm có tâm là trung điểm $OH$ và bán kính luôn bằng đúng $\\frac{R}{2}$!'
      }
    ],
    essayProblems: [
      {
        source: 'Đề HSG Hình học phẳng · Tâm đẳng phương đồng quy',
        question:
          'Cho $\\triangle ABC$ nhọn nội tiếp $(O)$, hai đường cao $BE, CF$ cắt nhau tại trực tâm $H$. Gọi $K$ là giao điểm của $EF$ và $BC$. Chứng minh hệ thức phương tích: $KF \\cdot KE = KB \\cdot KC$.',
        hints: ['Tứ giác $BFEC$ nội tiếp nên dùng tam giác đồng dạng $\\triangle KFB \\sim \\triangle KCE$ (hoặc phương tích điểm $K$ với đường tròn đường kính $BC$).'],
        solutionSteps: [
          'Bước 1: Do $BE, CF$ là đường cao nên $\\widehat{BFC} = \\widehat{BEC} = 90^\\circ \\implies$ bốn điểm $B, F, E, C$ cùng thuộc đường tròn đường kính $BC$.',
          'Bước 2: Xét điểm $K = EF \\cap BC$ đối với đường tròn $(BC)$: hai cát tuyến $KFE$ và $KBC$ cắt đường tròn tại các cặp $(F, E)$ và $(B, C)$.',
          'Bước 3: $\\triangle KFB$ và $\\triangle KCE$ có $\\widehat{K}$ chung và $\\widehat{KFB} = \\widehat{KCE}$ (cùng bù $\\widehat{BFE}$). Suy ra $\\frac{KF}{KC} = \\frac{KB}{KE} \\implies KF \\cdot KE = KB \\cdot KC$.'
        ],
        finalAnswer: '$KF \\cdot KE = KB \\cdot KC$ (cùng bằng phương tích của $K$ tới đường tròn đường kính $BC$).'
      },
      {
        source: 'Đề Chuyên Toán · Định lý Menelaus chứng minh thẳng hàng',
        question:
          'Cho $\\triangle ABC$. Lấy $M$ là trung điểm $BC$, $N$ trên $AC$ sao cho $AN = 2NC$, $P$ là giao điểm của $AM$ và $BN$. Tính tỉ số $\\frac{AP}{PM}$.',
        hints: ['Áp dụng định lý Menelaus cho $\\triangle AMC$ với cát tuyến $B-P-N$.'],
        solutionSteps: [
          'Bước 1: Xét $\\triangle AMC$ bị cắt bởi đường thẳng $BPN$ tại $B \\in MC$, $P \\in AM$, $N \\in AC$.',
          'Bước 2: Áp dụng Menelaus: $\\frac{PA}{PM} \\cdot \\frac{BM}{BC} \\cdot \\frac{NC}{NA} = 1$.',
          'Bước 3: Thay $\\frac{BM}{BC} = \\frac{1}{2}$ và $\\frac{NC}{NA} = \\frac{1}{2}$, suy ra $\\frac{PA}{PM} \\cdot \\frac{1}{2} \\cdot \\frac{1}{2} = 1 \\implies \\frac{AP}{PM} = 4$.'
        ],
        finalAnswer: '$\\frac{AP}{PM} = 4$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'sphere_plane'
  },
  {
    id: 'math-pro-5',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Chuyên / HSG',
    title: 'Chuyên Toán 5: Tổ hợp HSG – Nguyên lý Dirichlet, Bất biến & Đếm bằng hai cách',
    grade: 'Chuyên Toán · Chuyên / HSG (Lớp 9–12)',
    category: 'Số học & Tổ hợp',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 15,
    description:
      'Tư duy Tổ hợp thi Học sinh Giỏi Quốc gia & Chuyên Toán: xây dựng "thỏ và chuồng" trong Nguyên lý Dirichlet, tìm đại lượng Bất biến (tính chẵn lẻ, mod, đơn điệu) trong trò chơi/thuật toán và kỹ thuật Đếm bằng hai cách.',
    mnemonics: [
      'Dirichlet tổng quát: Nhốt $n \\cdot k + 1$ con thỏ vào $n$ cái chuồng $\\implies$ có ít nhất 1 chuồng chứa $\\ge k + 1$ con thỏ.',
      'Chứng minh một trạng thái KHÔNG BAO GIỜ ĐẠT ĐƯỢC: hãy tìm một đại lượng **Bất biến** (hoặc đơn biến) khác nhau giữa trạng thái đầu và đích.'
    ],
    commonTraps: [
      'Xây dựng "chuồng" không bao phủ hết tất cả các "thỏ" dẫn đến lập luận hổng.',
      'Áp dụng bất biến nhưng quên kiểm tra tất cả các phép biến đổi hợp lệ có thật sự bảo toàn bất biến đó không.'
    ],
    theory: [
      '1. Nguyên lý Dirichlet (Pigeonhole Principle): Với $N$ đối tượng phân vào $k$ nhóm, tồn tại nhóm chứa ít nhất $\\lceil N/k \\rceil$ đối tượng.',
      '2. Bất biến (Invariant) & Đơn biến (Monovariant): Khi gặp chuỗi thao tác biến đổi bảng số, đồng xu, xóa số: xét tổng các số modulo $m$, tích dấu $(\\pm 1)$, hoặc số cặp nghịch thế.',
      '3. Đếm bằng hai cách (Double Counting) & Nguyên lý Cực hạn: Xét phần tử lớn nhất/nhỏ nhất hoặc khoảng cách bé nhất để tạo lập mâu thuẫn.'
    ],
    keyFormulas: [
      'N > n \\cdot k \\implies \\exists \\text{ chuồng có } \\ge k + 1 \\text{ thỏ}',
      'I(S_{t+1}) \\equiv I(S_t) \\pmod m \\quad (\\text{Bất biến đồng dư})',
      '\\sum_{v \\in V} \\deg(v) = 2|E| \\quad (\\text{Bắt tay đồ thị})'
    ],
    flashcards: [
      {
        front: 'Cần chọn ít nhất bao nhiêu số nguyên từ tập $\\{1, 2, \\dots, 100\\}$ để chắc chắn tồn tại 2 số có hiệu bằng 10?',
        back: 'Chia thành $10$ lớp đồng dư theo mod $10$, ghép từng cặp liên tiếp $(x, x+10)$ thành $50$ chuồng → chọn tối đa $50$ số không có 2 số hiệu 10; chọn $51$ số chắc chắn có!',
        tip: 'Kiểm tra từng lớp đồng dư: mỗi lớp có 10 số, tối đa lấy được 5 số cách nhau $\\ge 20$. Nhân 10 lớp được $50$. Vậy đáp án là $51$.'
      }
    ],
    sampleProblems: [
      {
        source: 'HSG Toán Tổ hợp · Nguyên lý Dirichlet',
        question:
          'Trong một buổi họp mặt có 6 người bất kỳ (hai người bất kỳ hoặc quen nhau hoặc không quen nhau). Theo Định lý Ramsey $R(3,3)=6$, điều gì luôn chắc chắn xảy ra?',
        options: [
          'A. Luôn có 3 người đôi một quen nhau hoặc 3 người đôi một không quen nhau',
          'B. Luôn có 4 người đôi một quen nhau',
          'C. Mỗi người quen đúng 3 người khác',
          'D. Số người quen của 6 người đôi một khác nhau'
        ],
        correctIndex: 0,
        explanation:
          'Xét người A: 5 người còn lại chia làm 2 chuồng (quen A / không quen A). Theo Dirichlet, có ít nhất $\\lceil 5/2 \\rceil = 3$ người thuộc cùng một nhóm, giả sử nhóm quen A là B, C, D. Nếu hai trong B, C, D quen nhau thì tạo 3 người đôi một quen nhau với A; ngược lại cả B, C, D đôi một không quen nhau!'
      },
      {
        source: 'Chuyên Toán · Bất biến chẵn lẻ',
        question:
          'Trên bảng viết các số $1, 2, 3, \\dots, 2025$. Mỗi lần xóa 2 số $a, b$ bất kỳ rồi viết thay bằng $|a - b|$. Sau 2024 lần thực hiện chỉ còn 1 số trên bảng. Số cuối cùng đó là:',
        options: ['A. Một số lẻ', 'B. Một số chẵn', 'C. Chắc chắn bằng 0', 'D. Chắc chắn bằng 2025'],
        correctIndex: 0,
        explanation:
          'Tính chẵn lẻ của TỔNG $S$ các số trên bảng là bất biến vì $a + b$ và $|a - b|$ luôn cùng tính chẵn lẻ! Ban đầu $S = \\frac{2025 \\cdot 2026}{2} = 2025 \\cdot 1013$ là số LẺ, nên số cuối cùng bắt buộc là số lẻ.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề HSG Tỉnh · Nguyên lý Dirichlet Hình học',
        question:
          'Cho $5$ điểm bất kỳ nằm bên trong (hoặc trên cạnh) một hình vuông có cạnh bằng $2\\text{ cm}$. Chứng minh rằng luôn tồn tại ít nhất $2$ điểm trong $5$ điểm đó có khoảng cách không vượt quá $\\sqrt{2}\\text{ cm}$.',
        hints: ['Chia hình vuông cạnh $2\\text{ cm}$ thành 4 hình vuông con bằng nhau cạnh $1\\text{ cm}$.'],
        solutionSteps: [
          'Bước 1: Chia hình vuông lớn cạnh $2\\text{ cm}$ bởi hai đường trung bình thành 4 hình vuông con bằng nhau, mỗi hình vuông con có cạnh bằng $1\\text{ cm}$.',
          'Bước 2: Nhốt $5$ điểm ("thỏ") vào $4$ hình vuông con ("chuồng"). Theo nguyên lý Dirichlet, phải có ít nhất $1$ hình vuông con chứa tối thiểu $2$ điểm $A, B$.',
          'Bước 3: Hai điểm bất kỳ trong hình vuông cạnh $1\\text{ cm}$ có khoảng cách không vượt quá độ dài đường chéo của hình vuông con đó: $AB \\le \\sqrt{1^2 + 1^2} = \\sqrt{2}\\text{ cm}$.'
        ],
        finalAnswer: 'ĐPCM ($AB \\le \\sqrt{2}\\text{ cm}$).'
      },
      {
        source: 'HSG Tổ hợp · Bất biến đồ thị / Trò chơi',
        question:
          'Viết lên bảng $10$ số $1$ và $10$ số $2$. Mỗi bước, xóa đi 2 số bất kỳ trên bảng: nếu 2 số giống nhau thì viết lên số $2$, nếu 2 số khác nhau thì viết lên số $1$. Hỏi sau $19$ bước, số duy nhất còn lại trên bảng là số mấy?',
        hints: ['Tìm bất biến: thay mỗi số $1$ bởi $-1$ (hoặc xét tổng modulo 2, hoặc đếm số lượng số $1$!). Khi xóa $(1,1)$ viết $2$ → số các số $1$ giảm đi $2$. Khi xóa $(1,2)$ viết $1$ → số các số $1$ không đổi!'],
        solutionSteps: [
          'Bước 1: Gọi $k$ là số lượng chữ số $1$ đang có trên bảng.',
          'Bước 2: Xét cả 3 khả năng xóa 2 số: (a) Xóa $(2, 2)$ ghi $2 \\implies k$ không đổi; (b) Xóa $(1, 2)$ ghi $1 \\implies k$ không đổi; (c) Xóa $(1, 1)$ ghi $2 \\implies k$ giảm $2$.',
          'Bước 3: Do đó tính chẵn lẻ của $k$ là BẤT BIẾN. Ban đầu có $k = 10$ (chẵn), nên cuối cùng khi chỉ còn 1 số, số lượng số $1$ phải chẵn ($k = 0$ hoặc $k = 2$, vì còn 1 số nên $k = 0$). Vậy số còn lại là số $2$.'
        ],
        finalAnswer: 'Số duy nhất còn lại trên bảng chắc chắn là số $2$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'oxyz_vector'
  },
  {
    id: 'math-pro-6',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Chuyên / HSG',
    title: 'Chuyên Toán 6: Giải tích & Oxyz HSG – Cực trị Hàm hợp, Phương trình Hàm & Tối ưu Không gian',
    grade: 'Chuyên Toán · Chuyên / HSG (Lớp 12)',
    category: 'Giải tích',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 15,
    description:
      'Chuyên đề Giải tích & Hình học Tọa độ Không gian mức 9–10 điểm THPT / HSG: kỹ thuật ghép trục giải cực trị hàm hợp $f(u(x))$, phương pháp hàm đặc trưng, tích phân hàm ẩn và tâm tỉ cự tìm cực trị trong $Oxyz$.',
    mnemonics: [
      'Ghép trục $y = f(u(x))$: Lập bảng biến thiên ngược xuôi của $u(x)$, điền nghiệm $u\' = 0$, sau đó điền các điểm cực trị của $f(u)$ lồng vào các khoảng đơn điệu của $u$.',
      'Khi thấy $f(u) + u = f(v) + v$ hay $e^u + u = e^v + v$: xét hàm đặc trưng $g(t) = f(t) + t$ đồng biến $\\implies u = v$!',
      'Tối ưu $MA^2 + 2MB^2 + 3MC^2$: dùng **Tâm tỉ cự** $I$ thỏa $\\vec{IA} + 2\\vec{IB} + 3\\vec{IC} = \\vec{0}$ để thu gọn thành $6MI^2 + \\text{hằng số}$.'
    ],
    commonTraps: [
      'Dùng hàm đặc trưng $g(u) = g(v) \\implies u = v$ mà quên chứng minh $g\'(t) > 0$ (hoặc $< 0$) trên đúng miền xác định của $u, v$.',
      'Ghép trục quên mũi tên đảo chiều làm đếm sai điểm cực đại/cực tiểu của hàm hợp.'
    ],
    theory: [
      '1. Kỹ thuật Đạo hàm & Ghép trục hàm hợp: Với $g(x) = f(u(x))$, ta có $g\'(x) = u\'(x) \\cdot f\'(u(x)) = 0 \\iff u\'(x) = 0$ hoặc $f\'(u(x)) = 0$.',
      '2. Phương pháp Hàm đặc trưng: Biến đổi phương trình hai vế thành $g(A) = g(B)$, chứng minh $g(t)$ đơn điệu nghiêm ngặt để rút ra $A = B$.',
      '3. Tâm tỉ cự trong không gian $Oxyz$: Để tìm $M$ thuộc $(P)$ hoặc $(S)$ sao cho $T = \\sum k_i MA_i^2$ ($\\sum k_i = K \\neq 0$) đạt Min/Max, chọn điểm $I$ thỏa $\\sum k_i \\vec{IA_i} = \\vec{0}$. Khi đó $T = K \\cdot MI^2 + \\sum k_i IA_i^2$.'
    ],
    keyFormulas: [
      '[f(u(x))]\' = u\'(x) \\cdot f\'(u(x))',
      '\\sum k_i MA_i^2 = \\left(\\sum k_i\\right) MI^2 + \\sum k_i IA_i^2 \\quad (\\text{với } \\sum k_i \\vec{IA_i} = \\vec{0})',
      '\\int_a^b f(x)\\,dx = \\int_a^b f(a + b - x)\\,dx \\quad (\\text{Tích phân đối xứng})'
    ],
    flashcards: [
      {
        front: 'Với $M$ thuộc mặt phẳng $(P)$, giá trị nhỏ nhất của $MA^2 + 2MB^2$ đạt được tại đâu?',
        back: 'Tại hình chiếu vuông góc $H$ của điểm tâm tỉ cự $I$ (thỏa $\\vec{IA} + 2\\vec{IB} = \\vec{0}$, tức $I = \\frac{A + 2B}{3}$) lên mặt phẳng $(P)$.',
        tip: 'Biến bài toán cực trị bậc hai 3 biến về bài toán tìm hình chiếu đơn giản!'
      }
    ],
    sampleProblems: [
      {
        source: 'HSG Giải tích 12 · Hàm đặc trưng',
        question:
          'Có bao nhiêu giá trị nguyên dương $y$ sao cho với $x \\in (0; 10]$ thỏa mãn $2^x + x = \\log_2(y) + y$? Tìm $x$ theo $y$:',
        options: ['A. $x = \\log_2 y$', 'B. $x = 2^y$', 'C. $x = y$', 'D. $x = y + 1$'],
        correctIndex: 0,
        explanation:
          'Xét hàm $g(t) = 2^t + t$ có $g\'(t) = 2^t\\ln 2 + 1 > 0, \\forall t \\in \\mathbb{R}$ (đồng biến). Ta có $g(x) = 2^{\\log_2 y} + \\log_2 y = g(\\log_2 y) \\implies x = \\log_2 y$.'
      },
      {
        source: 'Chuyên Toán 12 · Tâm tỉ cự Oxyz',
        question:
          'Trong không gian $Oxyz$, cho $A(1; 0; 2), B(4; 3; -1)$ và điểm $M$ di động trên mặt phẳng $(P): x + y + z - 6 = 0$. Điểm $M$ để $MA^2 + 2MB^2$ nhỏ nhất là hình chiếu của điểm $I$ có tọa độ nào lên $(P)$?',
        options: ['A. $I(3; 2; 0)$', 'B. $I(2; 1; 1)$', 'C. $I(2{,}5; 1{,}5; 0{,}5)$', 'D. $I(3; 3; 0)$'],
        correctIndex: 0,
        explanation:
          'Tâm tỉ cự $I$ thỏa $\\vec{IA} + 2\\vec{IB} = \\vec{0} \\implies I = \\frac{A + 2B}{3} = \\left(\\frac{1+8}{3}; \\frac{0+6}{3}; \\frac{2-2}{3}\\right) = (3; 2; 0)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề HSG & Chuyên 12 · Cực trị Hàm hợp',
        question:
          'Cho hàm số $f(x) = x^3 - 3x$. Tìm số điểm cực trị của hàm số $g(x) = f(x^2 - 2x)$.',
        hints: ['Tính $g\'(x) = (2x - 2) f\'(x^2 - 2x) = 0$. Giải $f\'(u) = 0$ được $u = \\pm 1$, rồi giải $x^2 - 2x = \\pm 1$ và đếm các nghiệm đơn.'],
        solutionSteps: [
          'Bước 1: $f\'(u) = 3u^2 - 3 = 0 \\iff u = 1$ hoặc $u = -1$ (đều là nghiệm đơn).',
          'Bước 2: $g\'(x) = 2(x - 1) f\'(x^2 - 2x) = 0 \\iff \\left[\\begin{array}{l} x = 1 \\\\ x^2 - 2x = 1 \\\\ x^2 - 2x = -1 \\end{array}\\right.$.',
          'Bước 3: Giải $x^2 - 2x - 1 = 0$ được 2 nghiệm đơn $x = 1 \\pm \\sqrt{2}$. Giải $x^2 - 2x + 1 = 0 \\iff (x - 1)^2 = 0$ (nghiệm bội chẵn tại $x = 1$).',
          'Bước 4: Chú ý: $x = 1$ xuất hiện 1 lần ở $(x - 1)$ (bội 1) và 2 lần ở $(x - 1)^2$ (bội 2), tổng cộng $x = 1$ là nghiệm BỘI LẺ (bội 3)! Do đó $g\'(x)$ đổi dấu qua cả 3 nghiệm phân biệt $1 - \\sqrt{2}, 1, 1 + \\sqrt{2}$.'
        ],
        finalAnswer: 'Hàm số $g(x)$ có $3$ điểm cực trị.'
      },
      {
        source: 'Đề Chuyên Toán 12 · Tích phân hàm ẩn & Tối ưu Oxyz',
        question:
          'Trong không gian $Oxyz$, cho hai điểm $A(1; 2; 1)$, $B(4; -1; 4)$ và mặt phẳng $(P): x + 2y + 2z - 1 = 0$. Tìm tọa độ điểm $M \\in (P)$ sao cho $MA^2 + 2MB^2$ đạt giá trị nhỏ nhất.',
        hints: ['Tìm tâm tỉ cự $I = \\frac{A + 2B}{3} = (3; 0; 3)$, sau đó tìm hình chiếu vuông góc $H$ của $I$ lên $(P)$ theo tham số $t$.'],
        solutionSteps: [
          'Bước 1: Tâm tỉ cự $I$ thỏa $\\vec{IA} + 2\\vec{IB} = \\vec{0} \\implies I = \\left(\\frac{1 + 8}{3}; \\frac{2 - 2}{3}; \\frac{1 + 8}{3}\\right) = (3; 0; 3)$.',
          'Bước 2: Khi đó $MA^2 + 2MB^2 = 3MI^2 + IA^2 + 2IB^2$ nhỏ nhất $\\iff MI$ nhỏ nhất $\\iff M$ là hình chiếu vuông góc của $I$ lên $(P)$.',
          'Bước 3: Đường thẳng qua $I(3; 0; 3)$ vuông góc $(P)$ có VTPT $\\vec{n} = (1; 2; 2)$: $M(3 + t; 2t; 3 + 2t)$.',
          'Bước 4: Thay $M$ vào $(P)$: $(3 + t) + 2(2t) + 2(3 + 2t) - 1 = 0 \\iff 9t + 8 = 0 \\implies t = -\\frac{8}{9}$. Suy ra $M\\left(\\frac{19}{9}; -\\frac{16}{9}; \\frac{11}{9}\\right)$.'
        ],
        finalAnswer: '$M\\left(\\frac{19}{9}; -\\frac{16}{9}; \\frac{11}{9}\\right)$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'oxyz_vector',
    defaultGraphConfig: {
      type: 'cubic',
      params: { a: 1, b: 0, c: -3, d: 0 },
      color: '#4f46e5',
      name: 'f(x) = x³ - 3x'
    }
  },
  {
    id: 'math-chuyen-circle',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Chuyên / HSG',
    title: 'Phương Tích, Trục Đẳng Phương & Tiếp Tuyến Đường Tròn Nâng Cao',
    grade: 'Chuyên Toán 9–10 · Hình học Phẳng',
    category: 'Hình học',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 22,
    description:
      'Chuyên đề Hình học Olympiad về Phương tích điểm với đường tròn ($\\mathcal{P}_{M/(O)} = MO^2 - R^2$), Trục đẳng phương, Tâm đẳng phương của 3 đường tròn và chùm tiếp tuyến - cát tuyến điều hòa.',
    mnemonics: [
      'Phương tích dương khi $M$ nằm ngoài ($= MT^2$), bằng $0$ khi $M \\in (O)$, âm khi $M$ nằm trong ($= -MA \\cdot MB$).',
      'Trục đẳng phương của 2 đường tròn $(O_1), (O_2)$ là đường thẳng vuông góc với đường nối tâm $O_1O_2$.'
    ],
    commonTraps: [
      'Nhầm dấu phương tích khi điểm $M$ nằm trong đường tròn ($\\overline{MA}\\cdot\\overline{MB} = MO^2 - R^2 < 0$).',
      'Quên kiểm tra điều kiện 3 tâm không thẳng hàng khi áp dụng định lý Tâm đẳng phương đồng quy.'
    ],
    theory: [
      '1. Phương tích của điểm $M$ đối với đường tròn $(O; R)$: $\\mathcal{P}_{M/(O)} = MO^2 - R^2 = \\overline{MA}\\cdot\\overline{MB}$ với mọi cát tuyến qua $M$ cắt $(O)$ tại $A, B$. Nếu $M$ nằm ngoài $(O)$ và $MT$ là tiếp tuyến thì $\\mathcal{P}_{M/(O)} = MT^2$.',
      '2. Trục đẳng phương: Tập hợp các điểm $M$ có cùng phương tích đối với hai đường tròn không đồng tâm $(O_1; R_1)$ và $(O_2; R_2)$ là một đường thẳng vuông góc với $O_1O_2$. Nếu hai đường tròn cắt nhau tại $A, B$ thì đường thẳng $AB$ chính là trục đẳng phương.',
      '3. Tâm đẳng phương: Với 3 đường tròn có 3 tâm không thẳng hàng, 3 trục đẳng phương của từng cặp đường tròn hoặc đồng quy tại 1 điểm (Tâm đẳng phương) hoặc đôi một song song.',
      '4. Hàng điểm điều hòa và Đường đối cực: Từ $M$ ngoài $(O)$ kẻ tiếp tuyến $MA, MB$ và cát tuyến $MCD$ cắt $AB$ tại $K$ thì $(M, K; C, D) = -1$, tức $\\frac{2}{MK} = \\frac{1}{MC} + \\frac{1}{MD}$.'
    ],
    keyFormulas: [
      '\\mathcal{P}_{M/(O)} = MO^2 - R^2 = \\overline{MA} \\cdot \\overline{MB} = MT^2',
      'M \\in \\Delta_{O_1, O_2} \\iff MO_1^2 - R_1^2 = MO_2^2 - R_2^2 \\implies \\Delta \\perp O_1O_2',
      '(M, K; C, D) = -1 \\iff \\frac{2}{MK} = \\frac{1}{MC} + \\frac{1}{MD}'
    ],
    flashcards: [
      {
        front: 'Cho $(O_1)$ và $(O_2)$ cắt nhau tại $A, B$. Một điểm $M$ nằm trên tia đối tia $BA$ kẻ hai tiếp tuyến $MT_1, MT_2$ tới hai đường tròn. So sánh $MT_1$ và $MT_2$?',
        back: '$M \\in AB$ (trục đẳng phương của $(O_1)$ và $(O_2)$) nên $\\mathcal{P}_{M/(O_1)} = \\mathcal{P}_{M/(O_2)} \\implies MT_1^2 = MT_2^2 \\implies MT_1 = MT_2$.',
        tip: 'Kinh nghiệm thi Chuyên: Thấy hai tiếp tuyến từ 1 điểm đến 2 đường tròn cắt nhau bằng nhau -> nghĩ ngay tới trục đẳng phương AB!'
      }
    ],
    sampleProblems: [
      {
        source: 'Đề Chuyên Toán 10 · Phương tích & Đồng quy',
        question:
          'Cho hai đường tròn $(O_1; 5)$ và $(O_2; 3)$ cắt nhau tại $A, B$. Điểm $M$ nằm trên đường thẳng $AB$ sao cho $M$ ngoài cả hai đường tròn và kẻ được tiếp tuyến $MT_1 = 8$ tới $(O_1)$. Độ dài tiếp tuyến $MT_2$ kẻ tới $(O_2)$ là:',
        options: ['A. $8$', 'B. $4$', 'C. $\\sqrt{40}$', 'D. $6$'],
        correctIndex: 0,
        explanation:
          'Đường thẳng $AB$ là trục đẳng phương của $(O_1)$ và $(O_2)$ nên $MT_1^2 = \\mathcal{P}_{M/(O_1)} = \\mathcal{P}_{M/(O_2)} = MT_2^2 \\implies MT_2 = MT_1 = 8$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề Thi HSG Toán 9 · Tiếp tuyến & Tứ giác nội tiếp',
        question:
          'Cho tam giác nhọn $ABC$ nội tiếp $(O)$, các đường cao $BE, CF$ cắt nhau tại trực tâm $H$. Vẽ tiếp tuyến $Ax$ của đường tròn $(O)$ nằm khác phía với điểm $B$ bờ là đường thẳng $AC$. Chứng minh rằng $Ax \\parallel EF$ và $OA \\perp EF$.',
        hints: [
          'Dùng tứ giác $BFEC$ nội tiếp đường tròn đường kính $BC$ để chứng minh $\\widehat{AEF} = \\widehat{ABC}$, rồi so sánh với góc tạo bởi tia tiếp tuyến và dây cung $\\widehat{xAC}$.'
        ],
        solutionSteps: [
          'Bước 1: Vì $\\widehat{BEC} = \\widehat{BFC} = 90^\\circ$ nên bốn điểm $B, F, E, C$ cùng thuộc đường tròn đường kính $BC$.',
          'Bước 2: Từ tứ giác $BFEC$ nội tiếp suy ra $\\widehat{AEF} = 180^\\circ - \\widehat{FEC} = \\widehat{ABC}$ (góc ngoài bằng góc trong tại đỉnh đối).',
          'Bước 3: Xét đường tròn $(O)$ có $\\widehat{xAC}$ là góc tạo bởi tia tiếp tuyến $Ax$ và dây cung $AC$ cùng chắn cung nhỏ $AC$ với góc nội tiếp $\\widehat{ABC}$, nên $\\widehat{xAC} = \\widehat{ABC}$.',
          'Bước 4: Suy ra $\\widehat{xAC} = \\widehat{AEF}$. Hai góc này ở vị trí so le trong nên $Ax \\parallel EF$. Mà $OA \\perp Ax$ tại tiếp điểm $A$, suy ra $OA \\perp EF$.'
        ],
        finalAnswer: 'Đã chứng minh $Ax \\parallel EF$ và $OA \\perp EF$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  }
];
