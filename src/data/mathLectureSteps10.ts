import { LectureStep } from '../types';

export const MATH_CUSTOM_LECTURE_STEPS_10: Record<string, LectureStep[]> = {
  'math-10-1': [
    {
      stepTitle: '1. Hàm số Bậc hai $y = ax^2 + bx + c$ ($a \\neq 0$): Đỉnh, Trục đối xứng & Parabol',
      stepType: 'concept',
      conceptSection:
        'Hàm số bậc hai có dạng $y = ax^2 + bx + c$ ($a \\neq 0$), tập xác định $D = \\mathbb{R}$. Đồ thị là một Parabol nhận đường thẳng thẳng đứng $x = -\\frac{b}{2a}$ làm trục đối xứng và có đỉnh $I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right)$.',
      formulaSection: {
        primaryFormula: 'I\\left(-\\frac{b}{2a};\\ -\\frac{\\Delta}{4a}\\right), \\qquad \\text{Trục đối xứng: } x = -\\frac{b}{2a}',
        secondaryFormulas: [
          'a > 0: \\text{ bề lõm hướng lên, nghịch biến trên } \\left(-\\infty; -\\frac{b}{2a}\\right), \\text{ đồng biến trên } \\left(-\\frac{b}{2a}; +\\infty\\right)',
          'a < 0: \\text{ bề lõm hướng xuống, đồng biến trên } \\left(-\\infty; -\\frac{b}{2a}\\right), \\text{ nghịch biến trên } \\left(-\\frac{b}{2a}; +\\infty\\right)'
        ],
        variablesNote:
          '• Để tính nhanh tung độ đỉnh $y_I$, không cần nhớ thuộc công thức $-\\frac{\\Delta}{4a}$: chỉ cần tính $x_I = -\\frac{b}{2a}$ rồi thay thẳng $x_I$ vào hàm số $y(x_I)$!\n• Khi tìm giá trị lớn nhất / nhỏ nhất của hàm bậc hai trên đoạn $[\\alpha; \\beta]$, bắt buộc kiểm tra xem $x_I$ có nằm trong $[\\alpha; \\beta]$ hay không.'
      },
      deepDiveSection:
        'Khi đề bài yêu cầu xác định Parabol $(P): y = ax^2 + bx + c$ đi qua đỉnh $I(x_I; y_I)$ và một điểm $A(x_A; y_A)$, ta lập 3 phương trình cực gọn: $-\\frac{b}{2a} = x_I$, $ax_I^2 + bx_I + c = y_I$, và $ax_A^2 + bx_A + c = y_A$. Hoặc viết thẳng dạng chuẩn tắc $y = a(x - x_I)^2 + y_I$ rồi thay $A$ vào tìm ngay $a$ trong 1 dòng!',
      teacherExplanation: 'Viết Parabol theo tọa độ đỉnh $y = a(x - x_I)^2 + y_I$ là bí kíp rút ngắn 70% thời gian lập phương trình Parabol.',
      keyTakeaway: 'Trục đối xứng $x_I = -\\frac{b}{2a}$; xét GTNN/GTLN trên $[\\alpha; \\beta]$ luôn so sánh giá trị tại $x_I$ (nếu thuộc đoạn) và hai đầu mút.',
      miniQuiz: [
        {
          id: 'm101-s1-q1',
          question: 'Tọa độ đỉnh $I$ của Parabol $(P): y = 2x^2 - 4x + 5$ là:',
          options: ['A. $I(1; 3)$', 'B. $I(-1; 11)$', 'C. $I(2; 5)$', 'D. $I(1; 5)$'],
          correctIndex: 0,
          explanation: '$x_I = -\\frac{-4}{2\\cdot 2} = 1$, thay vào được $y_I = 2(1)^2 - 4(1) + 5 = 3 \\implies I(1; 3)$.'
        },
        {
          id: 'm101-s1-q2',
          question: 'Giá trị nhỏ nhất của hàm số $y = x^2 - 6x + 10$ trên đoạn $[0; 2]$ là:',
          options: ['A. $2$', 'B. $1$', 'C. $10$', 'D. $5$'],
          correctIndex: 0,
          explanation: 'Đỉnh $x_I = 3 \\notin [0; 2]$. Vì $a = 1 > 0$ nên hàm nghịch biến trên $[0; 2]$, suy ra $\\min_{[0;2]} y = y(2) = 4 - 12 + 10 = 2$.'
        }
      ],
      miniEssay: {
        id: 'm101-s1-e1',
        question: 'Xác định Parabol $(P): y = ax^2 + bx + c$ biết $(P)$ có đỉnh $I(2; -1)$ và đi qua điểm $M(0; 3)$.',
        hint: 'Dùng dạng đỉnh $y = a(x - 2)^2 - 1$, thay tọa độ $M(0; 3)$ tìm $a$, sau đó khai triển ra dạng chuẩn.',
        rubricChecklist: [
          'Viết phương trình theo đỉnh $y = a(x - 2)^2 - 1$.',
          'Thay $M(0; 3)$: $3 = 4a - 1 \\implies a = 1$.',
          'Khai triển kết luận $y = x^2 - 4x + 3$.'
        ],
        sampleAnswer:
          'Vì Parabol $(P)$ có đỉnh $I(2; -1)$ nên có dạng $y = a(x - 2)^2 - 1$ ($a \\neq 0$). Vì $(P)$ đi qua $M(0; 3)$ nên $3 = a(0 - 2)^2 - 1 \\iff 4a = 4 \\iff a = 1$. Khai triển: $y = (x - 2)^2 - 1 = x^2 - 4x + 3$.'
      }
    },
    {
      stepTitle: '2. Định lý Dấu Tam thức Bậc hai $f(x) = ax^2 + bx + c$',
      stepType: 'derivation',
      conceptSection:
        'Định lý dấu tam thức bậc hai giúp giải mọi bất phương trình bậc hai, tìm miền xác định của hàm chứa căn và bài toán tham số. Dấu của $f(x) = ax^2 + bx + c$ ($a \\neq 0$) phụ thuộc vào dấu của biệt thức $\\Delta = b^2 - 4ac$ và hệ số $a$.',
      formulaSection: {
        primaryFormula: '\\Delta < 0 \\implies a \\cdot f(x) > 0 \\quad \\forall x \\in \\mathbb{R}',
        secondaryFormulas: [
          '\\Delta = 0 \\implies f(x) \\text{ cùng dấu } a \\ \\forall x \\neq -\\frac{b}{2a}',
          '\\Delta > 0 \\ (x_1 < x_2): \\text{ "Trong trái, Ngoài cùng" với dấu } a'
        ],
        variablesNote:
          '• **"Trong trái, Ngoài cùng"**: Khoảng bên trong hai nghiệm $(x_1; x_2)$ mang dấu **trái** với hệ số $a$; hai khoảng bên ngoài mang dấu **cùng** với hệ số $a$.\n• Để $f(x) > 0\\ \\forall x \\in \\mathbb{R} \\iff a > 0$ và $\\Delta < 0$. Để $f(x) \\ge 0\\ \\forall x \\in \\mathbb{R} \\iff a > 0$ và $\\Delta \\le 0$.'
      },
      deepDiveSection:
        'Lỗi kinh điển trong bài tìm $m$ để tam thức $f(x) = mx^2 - 2(m-1)x + m + 3 > 0\\ \\forall x \\in \\mathbb{R}$ là quên kiểm tra hệ số $a = m = 0$! Khi $m = 0$, $f(x) = 2x + 3$ không thể dương trên toàn $\\mathbb{R}$, nên trường hợp này loại (nhưng ở bài khác như $f(x) = mx^2 + 2mx + 5 > 0$, khi $m = 0$ ra $f(x) = 5 > 0$ lại THỎA MÃN!).',
      teacherExplanation: 'Luôn kiểm tra $a = 0$ riêng trước khi viết bất phương trình $\\Delta < 0$ hoặc $\\Delta \\le 0$!',
      keyTakeaway: '$\\Delta < 0$: luôn cùng dấu $a$; $\\Delta > 0$: trong khoảng hai nghiệm trái dấu $a$, ngoài cùng dấu $a$.',
      miniQuiz: [
        {
          id: 'm101-s2-q1',
          question: 'Tập nghiệm của bất phương trình $-x^2 + 5x - 6 > 0$ là:',
          options: ['A. $(2; 3)$', 'B. $(-\\infty; 2) \\cup (3; +\\infty)$', 'C. $[2; 3]$', 'D. $(0; 5)$'],
          correctIndex: 0,
          explanation: 'Tam thức có $a = -1 < 0$ và hai nghiệm $x = 2, x = 3$. Cần $f(x) > 0$ (trái dấu $a$) nên lấy khoảng giữa $(2; 3)$.'
        },
        {
          id: 'm101-s2-q2',
          question: 'Tìm tất cả giá trị của tham số $m$ để bất phương trình $mx^2 - 2mx + m + 2 > 0$ nghiệm đúng với mọi $x \\in \\mathbb{R}$.',
          options: ['A. $m \\ge 0$', 'B. $m > 0$', 'C. $m < 0$', 'D. $m \\ge -2$'],
          correctIndex: 0,
          explanation: 'Xét $m = 0 \\implies 2 > 0$ (đúng $\\forall x \\in \\mathbb{R}$, nhận $m=0$). Xét $m \\neq 0$: cần $m > 0$ và $\\Delta\' = m^2 - m(m + 2) = -2m < 0 \\iff m > 0$. Hợp lại được $m \\ge 0$.'
        }
      ],
      miniEssay: {
        id: 'm101-s2-e1',
        question: 'Tìm tất cả các giá trị thực của $m$ để hàm số $y = \\sqrt{(m - 1)x^2 - 2(m - 1)x + 3}$ có tập xác định là $\\mathbb{R}$.',
        hint: 'Hàm xác định trên $\\mathbb{R} \\iff f(x) \\ge 0\\ \\forall x \\in \\mathbb{R}$. Xét $m - 1 = 0$ trước, rồi xét $m - 1 > 0$ và $\\Delta\' \\le 0$.',
        rubricChecklist: [
          'Chuyển về điều kiện $(m - 1)x^2 - 2(m - 1)x + 3 \\ge 0\\ \\forall x \\in \\mathbb{R}$.',
          'Xét $m = 1 \\implies 3 \\ge 0$ (đúng mọi $x$, nhận $m = 1$).',
          'Xét $m \\neq 1$: $m > 1$ và $\\Delta\' = (m-1)^2 - 3(m-1) \\le 0 \\iff 1 < m \\le 4$. Hợp lại $1 \\le m \\le 4$.'
        ],
        sampleAnswer:
          'Hàm số xác định trên $\\mathbb{R} \\iff (m - 1)x^2 - 2(m - 1)x + 3 \\ge 0\\ \\forall x \\in \\mathbb{R}$. TH1: $m - 1 = 0 \\iff m = 1$, bất phương trình thành $3 \\ge 0$ (luôn đúng), nhận $m = 1$. TH2: $m - 1 \\neq 0$, điều kiện là $m - 1 > 0$ và $\\Delta\' = (m - 1)^2 - 3(m - 1) \\le 0 \\iff m > 1$ và $(m - 1)(m - 4) \\le 0 \\iff 1 < m \\le 4$. Kết hợp hai trường hợp ta được $1 \\le m \\le 4$.'
      }
    },
    {
      stepTitle: '3. Phương trình Quy về Bậc hai (Chứa Căn & Trị tuyệt đối)',
      stepType: 'example',
      conceptSection:
        'Phương trình chứa căn thức $\\sqrt{A} = B$ hoặc $\\sqrt{A} = \\sqrt{B}$ là ứng dụng trực tiếp của tam thức bậc hai trong chương trình Toán 10. Nguyên tắc vàng: chỉ được bình phương hai vế khi **cả hai vế đều không âm**.',
      formulaSection: {
        primaryFormula: '\\sqrt{A} = B \\iff \\begin{cases} B \\ge 0 \\\\ A = B^2 \\end{cases}',
        secondaryFormulas: [
          '\\sqrt{A} = \\sqrt{B} \\iff \\begin{cases} A \\ge 0 \\ (\\text{hoặc } B \\ge 0) \\\\ A = B \\end{cases}',
          '|A| = B \\iff \\begin{cases} B \\ge 0 \\\\ A = B \\text{ hoặc } A = -B \\end{cases}'
        ],
        variablesNote:
          '• **Cực kỳ tiện lợi**: Khi giải $\\sqrt{A} = B$, ta chỉ cần đặt điều kiện $B \\ge 0$ mà KHÔNG cần đặt thêm $A \\ge 0$ (vì $A = B^2 \\ge 0$ đã tự động đảm bảo rồi!).\n• Nếu không biến đổi tương đương, có thể bình phương thành phương trình hệ quả rồi **thử lại** tất cả nghiệm vào phương trình ban đầu.'
      },
      deepDiveSection:
        'Với phương trình bậc hai chứa căn có cấu trúc đối xứng như $x^2 + 3x + \\sqrt{x^2 + 3x + 4} = 8$, đừng vội chuyển vế bình phương ra bậc 4! Hãy đặt ẩn phụ $t = \\sqrt{x^2 + 3x + 4}$ ($t \\ge 0$) để đưa về $t^2 + t - 12 = 0$, giải nhanh trong 3 dòng.',
      teacherExplanation: 'Đừng bao giờ bình phương $\\sqrt{A} = B$ mà quên điều kiện $B \\ge 0$ hoặc quên thử lại nghiệm!',
      keyTakeaway: '$\\sqrt{A} = B \\iff B \\ge 0$ và $A = B^2$; nhớ ưu tiên đặt ẩn phụ khi thấy biểu thức lặp lại.',
      miniQuiz: [
        {
          id: 'm101-s3-q1',
          question: 'Tập nghiệm của phương trình $\\sqrt{x^2 - 3x + 2} = x - 1$ là:',
          options: ['A. $\\{1\\}$', 'B. $\\{1; -1\\}$', 'C. $\\emptyset$', 'D. $\\{2\\}$'],
          correctIndex: 0,
          explanation: 'Điều kiện $x - 1 \\ge 0 \\iff x \\ge 1$. Bình phương: $x^2 - 3x + 2 = x^2 - 2x + 1 \\iff x = 1$ (thỏa mãn $x \\ge 1$).'
        },
        {
          id: 'm101-s3-q2',
          question: 'Số nghiệm của phương trình $\\sqrt{2x^2 - 3x - 5} = \\sqrt{x^2 - 2x + 7}$ là:',
          options: ['A. $2$', 'B. $1$', 'C. $0$', 'D. $4$'],
          correctIndex: 0,
          explanation: 'Bình phương: $2x^2 - 3x - 5 = x^2 - 2x + 7 \\iff x^2 - x - 12 = 0 \\iff x = 4$ hoặc $x = -3$. Do $x^2 - 2x + 7 = (x-1)^2 + 6 > 0\\ \\forall x$ nên cả $2$ nghiệm đều thỏa mãn!'
        }
      ],
      miniEssay: {
        id: 'm101-s3-e1',
        question: 'Giải phương trình $\\sqrt{2x + 7} = x + 2$.',
        hint: 'Áp dụng công thức tương đương $\\begin{cases} x + 2 \\ge 0 \\\\ 2x + 7 = (x + 2)^2 \\end{cases}$.',
        rubricChecklist: [
          'Viết đúng hệ tương đương với điều kiện $x \\ge -2$.',
          'Khai triển ra phương trình bậc hai $x^2 + 2x - 3 = 0$, giải được $x = 1$ và $x = -3$.',
          'Đối chiếu $x \\ge -2$ để loại $x = -3$ và nhận duy nhất nghiệm $x = 1$.'
        ],
        sampleAnswer:
          'Phương trình tương đương với $\\begin{cases} x + 2 \\ge 0 \\\\ 2x + 7 = (x + 2)^2 \\end{cases} \\iff \\begin{cases} x \\ge -2 \\\\ x^2 + 2x - 3 = 0 \\end{cases}$. Giải phương trình bậc hai được $x = 1$ (thỏa $x \\ge -2$) và $x = -3$ (loại vì $-3 < -2$). Vậy phương trình có nghiệm duy nhất $x = 1$.'
      }
    }
  ],
  'math-10-2': [
    {
      stepTitle: '1. Tích Vô hướng Hai Vectơ & Điều kiện Vuông góc',
      stepType: 'concept',
      conceptSection:
        'Tích vô hướng của hai vectơ $\\vec{a}$ và $\\vec{b}$ (khác $\\vec{0}$) là một **SỐ THỰC** xác định bởi tích độ dài của chúng với cosin góc xen giữa. Trong mặt phẳng tọa độ $Oxy$, tích vô hướng tính trực tiếp bằng tổng tích các tọa độ tương ứng.',
      formulaSection: {
        primaryFormula: '\\vec{a} \\cdot \\vec{b} = |\\vec{a}| \\cdot |\\vec{b}| \\cdot \\cos(\\vec{a}, \\vec{b}) = x_1 x_2 + y_1 y_2',
        secondaryFormulas: [
          '\\vec{a} \\perp \\vec{b} \\iff \\vec{a} \\cdot \\vec{b} = 0 \\iff x_1 x_2 + y_1 y_2 = 0',
          '\\vec{a}^2 = |\\vec{a}|^2, \\qquad \\cos(\\vec{a}, \\vec{b}) = \\frac{x_1 x_2 + y_1 y_2}{\\sqrt{x_1^2 + y_1^2}\\sqrt{x_2^2 + y_2^2}}'
        ],
        variablesNote:
          '• Chú ý phân biệt: Góc $(\\overrightarrow{AB}, \\overrightarrow{BC})$ KHÔNG PHẢI góc $\\widehat{B}$ của $\\triangle ABC$, mà bằng **$180^\\circ - \\widehat{B}$** vì hai vectơ không chung gốc! Hãy dời về chung gốc $\\overrightarrow{BA}$ và $\\overrightarrow{BC}$ trước khi tính góc.\n• Tích vô hướng khác $0$ khi $2$ vectơ không vuông góc; kết quả âm khi góc tù, dương khi góc nhọn.'
      },
      deepDiveSection:
        'Bình phương vô hướng $\\vec{a}^2 = |\\vec{a}|^2$ giúp tính nhanh độ dài tổng/hiệu hai vectơ mà không cần hệ tọa độ: $|\\vec{a} + \\vec{b}|^2 = a^2 + b^2 + 2\\vec{a}\\cdot\\vec{b}$. Ngoài ra, muốn chứng minh hai đường thẳng $AB \\perp CD$, chỉ cần chứng minh $\\overrightarrow{AB} \\cdot \\overrightarrow{CD} = 0$.',
      teacherExplanation: 'Luôn đưa hai vectơ về CÙNG ĐIỂM GỐC trước khi đọc góc $(\\vec{u}, \\vec{v})$!',
      keyTakeaway: '$\\vec{a} \\perp \\vec{b} \\iff \\vec{a}\\cdot\\vec{b} = 0$; bình phương vô hướng bằng bình phương độ dài.',
      miniQuiz: [
        {
          id: 'm102-s1-q1',
          question: 'Cho tam giác đều $ABC$ cạnh $a$. Giá trị của tích vô hướng $\\overrightarrow{AB} \\cdot \\overrightarrow{BC}$ bằng:',
          options: ['A. $-\\frac{a^2}{2}$', 'B. $\\frac{a^2}{2}$', 'C. $\\frac{a^2\\sqrt{3}}{2}$', 'D. $-\\frac{a^2\\sqrt{3}}{2}$'],
          correctIndex: 0,
          explanation: 'Góc $(\\overrightarrow{AB}, \\overrightarrow{BC}) = 180^\\circ - 60^\\circ = 120^\\circ$, nên $\\overrightarrow{AB}\\cdot\\overrightarrow{BC} = a\\cdot a\\cdot \\cos 120^\\circ = -\\frac{a^2}{2}$.'
        },
        {
          id: 'm102-s1-q2',
          question: 'Trong mặt phẳng $Oxy$, cho $\\vec{u} = (2; -4)$ và $\\vec{v} = (m; 3)$. Tìm $m$ để $\\vec{u} \\perp \\vec{v}$.',
          options: ['A. $m = 6$', 'B. $m = -6$', 'C. $m = \\frac{3}{2}$', 'D. $m = 4$'],
          correctIndex: 0,
          explanation: '$\\vec{u} \\perp \\vec{v} \\iff 2m + (-4)\\cdot 3 = 0 \\iff 2m = 12 \\iff m = 6$.'
        }
      ],
      miniEssay: {
        id: 'm102-s1-e1',
        question: 'Trong mặt phẳng $Oxy$, cho tam giác $ABC$ có $A(1; 2)$, $B(4; 6)$, $C(5; -1)$. Chứng minh tam giác $ABC$ vuông tại $A$ và tính diện tích tam giác đó.',
        hint: 'Tính tọa độ $\\overrightarrow{AB}, \\overrightarrow{AC}$, kiểm tra $\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = 0$, sau đó dùng $S = \\frac{1}{2}AB \\cdot AC$.',
        rubricChecklist: [
          'Tính đúng $\\overrightarrow{AB} = (3; 4)$ và $\\overrightarrow{AC} = (4; -3)$.',
          'Tính $\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = 3\\cdot 4 + 4\\cdot(-3) = 0 \\implies AB \\perp AC$.',
          'Tính $AB = 5$, $AC = 5$ và diện tích $S = 12{,}5$.'
        ],
        sampleAnswer:
          'Ta có $\\overrightarrow{AB} = (3; 4)$ và $\\overrightarrow{AC} = (4; -3)$. Tích vô hướng $\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = 3\\cdot 4 + 4\\cdot(-3) = 0$, suy ra $AB \\perp AC$ hay $\\triangle ABC$ vuông tại $A$. Độ dài $AB = \\sqrt{3^2 + 4^2} = 5$, $AC = \\sqrt{4^2 + (-3)^2} = 5$. Diện tích $S_{\\triangle ABC} = \\frac{1}{2}AB \\cdot AC = \\frac{25}{2} = 12{,}5$.'
      }
    },
    {
      stepTitle: '2. Định lý Cosin & Định lý Sin trong Tam giác bất kỳ',
      stepType: 'derivation',
      conceptSection:
        'Trong tam giác $ABC$ bất kỳ với các cạnh $BC = a, AC = b, AB = c$ và bán kính đường tròn ngoại tiếp $R$, Định lý Cosin mở rộng định lý Pytago cho mọi tam giác (biết 2 cạnh + góc xen giữa hoặc biết 3 cạnh), còn Định lý Sin liên kết cạnh với sin góc đối diện và $2R$.',
      formulaSection: {
        primaryFormula: 'a^2 = b^2 + c^2 - 2bc\\cos A, \\qquad \\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R',
        secondaryFormulas: [
          '\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}',
          'm_a^2 = \\frac{2(b^2 + c^2) - a^2}{4} \\quad (\\text{độ dài đường trung tuyến})'
        ],
        variablesNote:
          '• Khi biết **3 cạnh** $(a, b, c)$, dùng hệ quả Định lý Cosin $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$ để xác định tam giác nhọn ($\\cos A > 0$), vuông ($= 0$) hay tù ($< 0$).\n• Chú ý: Trong tam giác có thể tồn tại góc tù ($\\cos < 0$), nhưng $\\sin A > 0$ luôn dương vì $0^\\circ < A < 180^\\circ$.'
      },
      deepDiveSection:
        'Ứng dụng thực tế cực hay gặp là bài toán đo khoảng cách giữa 2 điểm $A, B$ không tới được trực tiếp (qua sông, qua núi) hoặc tính chiều cao tháp từ hai góc nâng đo được tại hai vị trí $C, D$ cách nhau $d$ mét: giải tam giác phụ chứa đoạn $CD$ bằng Định lý Sin trước, rồi suy ra cạnh cần tìm.',
      teacherExplanation: 'Biết 2 cạnh và góc xen giữa dùng ngay Cosin; biết cạnh và góc đối diện dùng ngay Định lý Sin!',
      keyTakeaway: '$a^2 = b^2 + c^2 - 2bc\\cos A$ và $\\frac{a}{\\sin A} = 2R$.',
      miniQuiz: [
        {
          id: 'm102-s2-q1',
          question: 'Tam giác $ABC$ có $b = 5, c = 8, \\widehat{A} = 60^\\circ$. Độ dài cạnh $a = BC$ bằng:',
          options: ['A. $7$', 'B. $\\sqrt{129}$', 'C. $\\sqrt{69}$', 'D. $49$'],
          correctIndex: 0,
          explanation: '$a^2 = 5^2 + 8^2 - 2\\cdot 5\\cdot 8\\cdot\\cos 60^\\circ = 25 + 64 - 40 = 49 \\implies a = 7$.'
        },
        {
          id: 'm102-s2-q2',
          question: 'Tam giác $ABC$ có $BC = 6\\sqrt{3}$ và $\\widehat{A} = 60^\\circ$. Bán kính đường tròn ngoại tiếp $R$ bằng:',
          options: ['A. $6$', 'B. $12$', 'C. $3\\sqrt{3}$', 'D. $3$'],
          correctIndex: 0,
          explanation: '$2R = \\frac{a}{\\sin A} = \\frac{6\\sqrt{3}}{\\sin 60^\\circ} = \\frac{6\\sqrt{3}}{\\sqrt{3}/2} = 12 \\implies R = 6$.'
        }
      ],
      miniEssay: {
        id: 'm102-s2-e1',
        question: 'Cho tam giác $ABC$ có $a = 5, b = 6, c = 7$. Tính $\\cos A$ và độ dài đường trung tuyến $m_a$ kẻ từ đỉnh $A$.',
        hint: 'Áp dụng $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$ và $m_a^2 = \\frac{2(b^2 + c^2) - a^2}{4}$.',
        rubricChecklist: [
          'Tính đúng $\\cos A = \\frac{36 + 49 - 25}{2\\cdot 6\\cdot 7} = \\frac{60}{84} = \\frac{5}{7}$.',
          'Tính đúng $m_a^2 = \\frac{2(36 + 49) - 25}{4} = \\frac{145}{4}$.',
          'Kết luận $m_a = \\frac{\\sqrt{145}}{2}$.'
        ],
        sampleAnswer:
          'Áp dụng hệ quả định lý Cosin: $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc} = \\frac{6^2 + 7^2 - 5^2}{2\\cdot 6\\cdot 7} = \\frac{60}{84} = \\frac{5}{7}$. Áp dụng công thức độ dài đường trung tuyến: $m_a^2 = \\frac{2(b^2 + c^2) - a^2}{4} = \\frac{2(36 + 49) - 25}{4} = \\frac{145}{4} \\implies m_a = \\frac{\\sqrt{145}}{2}$.'
      }
    },
    {
      stepTitle: '3. Năm Công thức Diện tích Tam giác & Bán kính Nội – Ngoại tiếp',
      stepType: 'example',
      conceptSection:
        'Tùy theo dữ kiện bài toán cho các cạnh, góc hay bán kính, ta chọn linh hoạt 1 trong 5 công thức tính diện tích tam giác $ABC$ — từ đó suy ngược ra đường cao $h_a$, bán kính ngoại tiếp $R$ hoặc bán kính nội tiếp $r$.',
      formulaSection: {
        primaryFormula: 'S = \\frac{1}{2}bc\\sin A = \\sqrt{p(p-a)(p-b)(p-c)} \\quad \\left(p = \\frac{a+b+c}{2}\\right)',
        secondaryFormulas: [
          'S = \\frac{abc}{4R} = p \\cdot r',
          'h_a = \\frac{2S}{a}, \\qquad r = \\frac{S}{p}, \\qquad R = \\frac{abc}{4S}'
        ],
        variablesNote:
          '• **Bộ 3 bước vàng** khi biết 3 cạnh $(a, b, c)$: (1) Tính nửa chu vi $p = \\frac{a+b+c}{2}$; (2) Tính diện tích $S$ theo công thức **Heron**; (3) Suy ra đồng loạt $h_a = \\frac{2S}{a}$, $r = \\frac{S}{p}$, $R = \\frac{abc}{4S}$!'
      },
      deepDiveSection:
        'Trong không gian hoặc tọa độ, công thức $S = \\frac{1}{2}bc\\sin A$ và Heron đặc biệt lợi hại khi cần tính bán kính mặt cầu ngoại tiếp hoặc đường tròn nội tiếp một tam giác thường mà không cần dựng hình tâm đường tròn.',
      teacherExplanation: 'Biết 3 cạnh $\\implies$ dùng Heron tính $S$, rồi rút ngay ra $r, R$ và đường cao $h_a$ chỉ bằng 1 phép chia.',
      keyTakeaway: 'Heron $S = \\sqrt{p(p-a)(p-b)(p-c)}$ kèm $S = pr = \\frac{abc}{4R}$ giải quyết mọi bài toán tam giác.',
      miniQuiz: [
        {
          id: 'm102-s3-q1',
          question: 'Tam giác $ABC$ có $a = 13, b = 14, c = 15$. Diện tích $S$ và bán kính đường tròn nội tiếp $r$ lần lượt là:',
          options: ['A. $S = 84, r = 4$', 'B. $S = 84, r = 2$', 'C. $S = 42, r = 2$', 'D. $S = 91, r = 4$'],
          correctIndex: 0,
          explanation: '$p = \\frac{13+14+15}{2} = 21$. Heron: $S = \\sqrt{21\\cdot 8\\cdot 7\\cdot 6} = 84$. Vậy $r = \\frac{S}{p} = \\frac{84}{21} = 4$.'
        },
        {
          id: 'm102-s3-q2',
          question: 'Cho tam giác $ABC$ có $AB = 4, AC = 6, \\widehat{A} = 30^\\circ$. Diện tích tam giác $ABC$ là:',
          options: ['A. $6$', 'B. $12$', 'C. $6\\sqrt{3}$', 'D. $12\\sqrt{3}$'],
          correctIndex: 0,
          explanation: '$S = \\frac{1}{2} \\cdot 4 \\cdot 6 \\cdot \\sin 30^\\circ = 12 \\cdot \\frac{1}{2} = 6$.'
        }
      ],
      miniEssay: {
        id: 'm102-s3-e1',
        question: 'Tam giác $ABC$ có $a = 5, b = 7, c = 8$. Tính diện tích $S$, bán kính ngoại tiếp $R$ và bán kính nội tiếp $r$.',
        hint: 'Tính $p = 10$, dùng Heron tính $S = \\sqrt{10 \\cdot 5 \\cdot 3 \\cdot 2} = 10\\sqrt{3}$, sau đó chia tính $R = \\frac{abc}{4S}$ và $r = \\frac{S}{p}$.',
        rubricChecklist: [
          'Tính đúng $p = 10$ và $S = 10\\sqrt{3}$.',
          'Tính $r = \\frac{10\\sqrt{3}}{10} = \\sqrt{3}$.',
          'Tính $R = \\frac{5\\cdot 7\\cdot 8}{40\\sqrt{3}} = \\frac{7}{\\sqrt{3}} = \\frac{7\\sqrt{3}}{3}$.'
        ],
        sampleAnswer:
          'Nửa chu vi $p = \\frac{5 + 7 + 8}{2} = 10$. Theo công thức Heron: $S = \\sqrt{10(10-5)(10-7)(10-8)} = \\sqrt{10\\cdot 5\\cdot 3\\cdot 2} = 10\\sqrt{3}$. Bán kính nội tiếp $r = \\frac{S}{p} = \\frac{10\\sqrt{3}}{10} = \\sqrt{3}$. Bán kính ngoại tiếp $R = \\frac{abc}{4S} = \\frac{5\\cdot 7\\cdot 8}{4\\cdot 10\\sqrt{3}} = \\frac{7}{\\sqrt{3}} = \\frac{7\\sqrt{3}}{3}$.'
      }
    }
  ],
  'math-10-3': [
    {
      stepTitle: '1. Mệnh đề, Mệnh đề Phủ định & Ký hiệu $\\forall, \\exists$',
      stepType: 'concept',
      conceptSection:
        'Mệnh đề toán học là một câu khẳng định có tính đúng hoặc sai xác định (không vừa đúng vừa sai). Phủ định của mệnh đề chứa lượng từ $\\forall$ ("với mọi") đổi thành $\\exists$ ("tồn tại"), và ngược lại, đồng thời phủ định tính chất $P(x)$ thành $\\overline{P(x)}$.',
      formulaSection: {
        primaryFormula: '\\overline{\\forall x \\in X, P(x)} \\iff \\exists x \\in X, \\overline{P(x)}',
        secondaryFormulas: [
          '\\overline{\\exists x \\in X, P(x)} \\iff \\forall x \\in X, \\overline{P(x)}',
          'P \\implies Q \\text{ chỉ sai khi } P \\text{ đúng và } Q \\text{ sai}'
        ],
        variablesNote:
          '• **Cảnh giác phủ định bất đẳng thức**: Phủ định của "$>$" là "$\\le$" (có dấu bằng!); phủ định của "$=$" là "$\\neq$"; phủ định của *"tất cả học sinh đều..."* là *"có ít nhất một học sinh không..."*.\n• Mệnh đề đảo của $P \\implies Q$ là $Q \\implies P$; nếu cả hai chiều đều đúng ta có mệnh đề tương đương $P \\iff Q$.'
      },
      deepDiveSection:
        'Trong các câu hỏi trắc nghiệm về mệnh đề chứa biến trên tập $\\mathbb{R}$ hoặc $\\mathbb{N}$, để bác bỏ một mệnh đề $\\forall x, P(x)$, ta chỉ cần chỉ ra **đúng 1 phản ví dụ**; còn để chứng minh $\\exists x, P(x)$ đúng, chỉ cần tìm được ít nhất 1 giá trị thỏa mãn.',
      teacherExplanation: 'Khi lấy phủ định mệnh đề chứa $\\forall$ hay $\\exists$, nhớ đổi cả lượng từ lẫn dấu đẳng thức/bất đẳng thức ($>$ thành $\\le$).',
      keyTakeaway: 'Phủ định $\\forall$ thành $\\exists$ (và ngược lại), đồng thời đảo dấu tính chất.',
      miniQuiz: [
        {
          id: 'm103-s1-q1',
          question: 'Mệnh đề phủ định của $P$: "$\\forall x \\in \\mathbb{R}, x^2 + 1 > 0$" là:',
          options: [
            'A. $\\exists x \\in \\mathbb{R}, x^2 + 1 \\le 0$',
            'B. $\\exists x \\in \\mathbb{R}, x^2 + 1 < 0$',
            'C. $\\forall x \\in \\mathbb{R}, x^2 + 1 \\le 0$',
            'D. $\\exists x \\in \\mathbb{R}, x^2 + 1 \\neq 0$'
          ],
          correctIndex: 0,
          explanation: 'Đổi $\\forall$ thành $\\exists$ và đổi $>$ thành $\\le$.'
        },
        {
          id: 'm103-s1-q2',
          question: 'Trong các mệnh đề sau, mệnh đề nào SAI?',
          options: [
            'A. $\\forall x \\in \\mathbb{R}, x^2 > x$',
            'B. $\\exists n \\in \\mathbb{N}, n^2 = n$',
            'C. $\\forall x \\in \\mathbb{R}, x^2 + 2x + 2 > 0$',
            'D. $\\exists x \\in \\mathbb{Q}, x^2 = 4$'
          ],
          correctIndex: 0,
          explanation: 'Phản ví dụ cho A: với $x = 0{,}5 \\in \\mathbb{R}$ thì $x^2 = 0{,}25 < 0{,}5 = x$ (hoặc $x = 0, x = 1$).'
        }
      ],
      miniEssay: {
        id: 'm103-s1-e1',
        question: 'Lập mệnh đề phủ định và xét tính đúng sai của mệnh đề $Q$: "$\\exists x \\in \\mathbb{Q}, 2x^2 - 5x + 2 = 0$".',
        hint: 'Phủ định $Q$ thành $\\forall x \\in \\mathbb{Q}, 2x^2 - 5x + 2 \\neq 0$. Giải phương trình để kiểm tra xem có nghiệm hữu tỉ không.',
        rubricChecklist: [
          'Viết đúng mệnh đề phủ định: $\\overline{Q}: "\\forall x \\in \\mathbb{Q}, 2x^2 - 5x + 2 \\neq 0"$.',
          'Giải $2x^2 - 5x + 2 = 0$ được $x = 2 \\in \\mathbb{Q}$ và $x = \\frac{1}{2} \\in \\mathbb{Q}$.',
          'Kết luận $Q$ ĐÚNG và $\\overline{Q}$ SAI.'
        ],
        sampleAnswer:
          'Mệnh đề phủ định là $\\overline{Q}$: "$\\forall x \\in \\mathbb{Q}, 2x^2 - 5x + 2 \\neq 0$". Giải phương trình $2x^2 - 5x + 2 = 0 \\iff x = 2$ hoặc $x = \\frac{1}{2}$, cả hai đều thuộc $\\mathbb{Q}$. Vậy $Q$ ĐÚNG và $\\overline{Q}$ SAI.'
      }
    },
    {
      stepTitle: '2. Các Phép toán Tập hợp: Giao, Hợp, Hiệu & Khoảng – Đoạn trên $\\mathbb{R}$',
      stepType: 'derivation',
      conceptSection:
        'Cho hai tập hợp $A$ và $B$. Phép giao $A \\cap B$ lấy phần tử chung, phép hợp $A \\cup B$ lấy tất cả phần tử thuộc ít nhất một tập, phép hiệu $A \\setminus B$ lấy phần tử thuộc $A$ nhưng KHÔNG thuộc $B$, và phần bù $C_{\\mathbb{R}}A = \\mathbb{R} \\setminus A$.',
      formulaSection: {
        primaryFormula: 'A \\cap B = \\{x \\mid x \\in A \\text{ và } x \\in B\\}, \\qquad A \\setminus B = \\{x \\mid x \\in A \\text{ và } x \\notin B\\}',
        secondaryFormulas: [
          'n(A \\cup B) = n(A) + n(B) - n(A \\cap B)',
          'A \\subset B \\iff A \\cap B = A \\iff A \\cup B = B'
        ],
        variablesNote:
          '• **Mẹo lấy hiệu hai khoảng trên trục số không bao giờ nhầm ngoặc**: Nếu đầu mút $a$ thuộc phần gạch bỏ của $B$ (ngoặc vuông $[a$) thì khi bỏ đi, $A \\setminus B$ tại $a$ bị mất $a \\implies$ dùng **ngoặc tròn** $a)$. Ngược lại nếu $a \\notin B$ (ngoặc tròn $(a$) thì $a$ vẫn còn nguyên $\\implies$ dùng **ngoặc vuông** $a]$!'
      },
      deepDiveSection:
        'Bài toán tìm tham số $m$ để $A \\cap B = \\emptyset$ hoặc $A \\subset B$ rất hay gài dấu bằng ở đầu mút ngoặc tròn/ngoặc vuông. Cách chắc chắn nhất: vẽ 2 trường hợp tách hẳn ra, rồi **thử trực tiếp trường hợp dấu "="** xem phần tử chung có tồn tại hay không.',
      teacherExplanation: 'Khi bỏ đi một tập có đầu mút ngoặc vuông $[a$, phần còn lại phải dùng ngoặc tròn $a)$ và ngược lại!',
      keyTakeaway: 'Dùng trục số trực quan khi tìm $A \\cap B, A \\cup B, A \\setminus B$, và luôn kiểm tra riêng dấu bằng tại các đầu mút.',
      miniQuiz: [
        {
          id: 'm103-s2-q1',
          question: 'Cho $A = (-\\infty; 3]$ và $B = (1; 5]$. Tập hợp $A \\setminus B$ là:',
          options: ['A. $(-\\infty; 1]$', 'B. $(-\\infty; 1)$', 'C. $(3; 5]$', 'D. $(1; 3]$'],
          correctIndex: 0,
          explanation: 'Vì $1 \\in A$ nhưng $1 \\notin B$ (ngoặc tròn tại $1$) nên số $1$ không bị loại khỏi $A$. Do đó $A \\setminus B = (-\\infty; 1]$.'
        },
        {
          id: 'm103-s2-q2',
          question: 'Lớp 10A có $40$ học sinh, trong đó $25$ bạn thích Toán, $20$ bạn thích Văn và $10$ bạn thích cả hai môn. Có bao nhiêu bạn KHÔNG thích môn nào trong hai môn trên?',
          options: ['A. $5$', 'B. $10$', 'C. $15$', 'D. $0$'],
          correctIndex: 0,
          explanation: 'Số bạn thích ít nhất 1 môn: $25 + 20 - 10 = 35$. Số bạn không thích môn nào: $40 - 35 = 5$.'
        }
      ],
      miniEssay: {
        id: 'm103-s2-e1',
        question: 'Cho $A = [m - 1; m + 3]$ và $B = (-2; 4)$. Tìm tất cả các giá trị thực của $m$ để $A \\subset B$.',
        hint: 'Để đoạn $[a; b] \\subset (-2; 4)$, hai đầu mút phải nằm lọt hẳn bên trong: $-2 < m - 1$ và $m + 3 < 4$ (không được lấy dấu "=" vì $B$ là ngoặc tròn!).',
        rubricChecklist: [
          'Nhận xét tập $A$ luôn khác rỗng vì $m - 1 < m + 3$.',
          'Lập đúng hệ điều kiện nghiêm ngặt: $m - 1 > -2$ và $m + 3 < 4$.',
          'Giải đúng $-1 < m < 1$.'
        ],
        sampleAnswer:
          'Vì $m - 1 < m + 3$ nên $A \\neq \\emptyset$. Để $[m - 1; m + 3] \\subset (-2; 4)$, toàn bộ đoạn $A$ phải nằm bên trong khoảng mở $B$ (không chạm $-2$ và $4$): $\\begin{cases} m - 1 > -2 \\\\ m + 3 < 4 \\end{cases} \\iff \\begin{cases} m > -1 \\\\ m < 1 \\end{cases} \\iff -1 < m < 1$.'
      }
    },
    {
      stepTitle: '3. Hệ Bất phương trình Bậc nhất Hai ẩn & Bài toán Tối ưu Tuyến tính',
      stepType: 'example',
      conceptSection:
        'Mỗi bất phương trình bậc nhất hai ẩn $ax + by \\le c$ biểu diễn một nửa mặt phẳng bờ là đường thẳng $ax + by = c$. Giao của các nửa mặt phẳng tạo thành **miền nghiệm** (thường là một đa giác lồi). Hàm mục tiêu $F(x, y) = mx + ny$ luôn đạt GTLN/GTNN tại **một trong các đỉnh** của đa giác miền nghiệm!',
      formulaSection: {
        primaryFormula: 'F(x, y) = mx + ny \\text{ đạt } \\max / \\min \\text{ tại các đỉnh } A_i(x_i; y_i) \\text{ của miền nghiệm}',
        secondaryFormulas: [
          '\\text{Kiểm tra nửa mặt phẳng nhanh: thử điểm } O(0; 0) \\text{ (nếu bờ không qua } O)',
          '\\text{Số đỉnh đa giác miền nghiệm } = \\text{ số giao điểm biên thỏa mãn toàn hệ}'
        ],
        variablesNote:
          '• **Quy trình 4 bước giải bài toán tối ưu (lãi cao nhất / chi phí thấp nhất)**:\n  (1) Đặt $x, y \\ge 0$ và lập hệ BPT ràng buộc + hàm mục tiêu $F(x, y)$.\n  (2) Vẽ các đường bờ và gạch bỏ phần KHÔNG thuộc miền nghiệm.\n  (3) Giải tọa độ tất cả các đỉnh của đa giác miền nghiệm.\n  (4) Tính $F(x, y)$ tại từng đỉnh rồi chọn giá trị lớn nhất/nhỏ nhất.'
      },
      deepDiveSection:
        'Lưu ý thực tế trong chương trình CT Mới lớp 10: đề bài hay hỏi bài toán sản xuất 2 loại sản phẩm A và B giới hạn bởi số giờ máy, nguyên liệu và nhân công. Đừng quên hai điều kiện không âm $x \\ge 0, y \\ge 0$ (góc phần tư thứ I), nếu thiếu hai đường trục tọa độ thì miền nghiệm sẽ không khép kín thành đa giác!',
      teacherExplanation: 'Khi tìm GTLN/GTNN trên miền đa giác lồi, bạn chỉ cần tính $F(x, y)$ tại tất cả các đỉnh của đa giác rồi so sánh!',
      keyTakeaway: 'Thử điểm $O(0; 0)$ để xác định nhanh nửa mặt phẳng miền nghiệm; cực trị hàm tuyến tính đạt tại đỉnh đa giác.',
      miniQuiz: [
        {
          id: 'm103-s3-q1',
          question: 'Miền nghiệm của bất phương trình $2x - y > 4$ chứa điểm nào sau đây?',
          options: ['A. $(3; 1)$', 'B. $(0; 0)$', 'C. $(2; 0)$', 'D. $(1; -1)$'],
          correctIndex: 0,
          explanation: 'Thay $(3; 1)$: $2(3) - 1 = 5 > 4$ (Đúng). Điểm $(2; 0)$ cho $4 > 4$ (Sai vì dấu $>$).'
        },
        {
          id: 'm103-s3-q2',
          question: 'Cho miền nghiệm của một hệ BPT là tam giác $OAB$ với $O(0; 0), A(4; 0), B(0; 3)$. Giá trị lớn nhất của biểu thức $F = 2x + 5y$ trên miền nghiệm là:',
          options: ['A. $15$', 'B. $8$', 'C. $0$', 'D. $23$'],
          correctIndex: 0,
          explanation: 'Tính tại 3 đỉnh: $F(0,0) = 0$; $F(4,0) = 8$; $F(0,3) = 15$. Vậy $\\max F = 15$ tại $(0; 3)$.'
        }
      ],
      miniEssay: {
        id: 'm103-s3-e1',
        question: 'Tìm giá trị lớn nhất của $F(x; y) = 3x + 2y$ với $(x; y)$ thỏa mãn hệ: $\\begin{cases} x \\ge 0,\\ y \\ge 0 \\\\ x + y \\le 4 \\\\ x + 2y \\le 6 \\end{cases}$.',
        hint: 'Xác định 4 đỉnh của tứ giác miền nghiệm ở góc phần tư I (giao của các cặp đường $x=0, y=0, x+y=4, x+2y=6$), rồi tính $F$ tại 4 đỉnh.',
        rubricChecklist: [
          'Tìm đúng 4 đỉnh của miền nghiệm: $O(0; 0)$, $A(4; 0)$, $B(2; 2)$, $C(0; 3)$.',
          'Tính đúng $F(0; 0) = 0, F(4; 0) = 12, F(2; 2) = 10, F(0; 3) = 6$.',
          'Kết luận $\\max F = 12$ tại $(x; y) = (4; 0)$.'
        ],
        sampleAnswer:
          'Miền nghiệm của hệ là miền tứ giác $OABC$ (kể cả biên) với các đỉnh: $O(0; 0)$; giao của $y = 0$ và $x + y = 4$ là $A(4; 0)$ (thỏa $4 + 0 \\le 6$); giao của $x + y = 4$ và $x + 2y = 6$ là $B(2; 2)$; giao của $x = 0$ và $x + 2y = 6$ là $C(0; 3)$ (thỏa $0 + 3 \\le 4$). Tính giá trị $F$: $F(0;0) = 0$, $F(4;0) = 12$, $F(2;2) = 10$, $F(0;3) = 6$. Vậy $\\max F = 12$ đạt tại $(4; 0)$.'
      }
    }
  ],
  'math-10-4': [
    {
      stepTitle: '1. Tổng – Hiệu Vectơ, Quy tắc Ba điểm & Hình bình hành',
      stepType: 'concept',
      conceptSection:
        'Vectơ là đoạn thẳng có hướng. Phép cộng vectơ nối đuôi theo quy tắc 3 điểm, phép trừ vectơ đưa về chung gốc (lấy điểm cuối trừ điểm đầu), và quy tắc hình bình hành dùng cho hai vectơ chung gốc.',
      formulaSection: {
        primaryFormula: '\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}, \\qquad \\overrightarrow{OB} - \\overrightarrow{OA} = \\overrightarrow{AB}',
        secondaryFormulas: [
          '\\overrightarrow{AB} + \\overrightarrow{AD} = \\overrightarrow{AC} \\quad (ABCD \\text{ là hình bình hành})',
          'I \\text{ là trung điểm } AB \\iff \\overrightarrow{IA} + \\overrightarrow{IB} = \\vec{0} \\iff \\overrightarrow{MA} + \\overrightarrow{MB} = 2\\overrightarrow{MI}'
        ],
        variablesNote:
          '• **Mẹo nhớ quy tắc trừ chung gốc không bao giờ ngược dấu**: $\\overrightarrow{OA} - \\overrightarrow{OB} = \\overrightarrow{BA}$ (đi từ **điểm ngọn của vectơ sau** đến **điểm ngọn của vectơ trước**!).\n• Nếu $G$ là trọng tâm $\\triangle ABC$ thì $\\overrightarrow{GA} + \\overrightarrow{GB} + \\overrightarrow{GC} = \\vec{0}$ và $\\overrightarrow{MA} + \\overrightarrow{MB} + \\overrightarrow{MC} = 3\\overrightarrow{MG}$ với mọi điểm $M$.'
      },
      deepDiveSection:
        'Khi chứng minh một đẳng thức vectơ, chiến thuật mạnh nhất là **chèn 1 điểm trung gian** (chọn điểm đích ở vế phải) hoặc biến đổi vế trái về biểu thức đối xứng với trọng tâm / trung điểm bằng công thức $2\\overrightarrow{MI}$ và $3\\overrightarrow{MG}$.',
      teacherExplanation: 'Hễ thấy $\\overrightarrow{MA} + \\overrightarrow{MB}$, nghĩ ngay đến trung điểm $I$: $2\\overrightarrow{MI}$; thấy tổng 3 vectơ xuất phát từ $M$, nghĩ ngay đến trọng tâm $3\\overrightarrow{MG}$.',
      keyTakeaway: 'Quy tắc trừ $\\overrightarrow{OA} - \\overrightarrow{OB} = \\overrightarrow{BA}$; tính chất trung điểm và trọng tâm là công cụ thu gọn vectơ mạnh nhất.',
      miniQuiz: [
        {
          id: 'm104-s1-q1',
          question: 'Với bốn điểm $A, B, C, D$ bất kỳ, biểu thức $\\overrightarrow{AB} - \\overrightarrow{AD} + \\overrightarrow{CD}$ bằng vectơ nào?',
          options: ['A. $\\overrightarrow{CB}$', 'B. $\\overrightarrow{BC}$', 'C. $\\vec{0}$', 'D. $\\overrightarrow{DB}$'],
          correctIndex: 0,
          explanation: '$\\overrightarrow{AB} - \\overrightarrow{AD} = \\overrightarrow{DB}$. Khi đó $\\overrightarrow{DB} + \\overrightarrow{CD} = \\overrightarrow{CD} + \\overrightarrow{DB} = \\overrightarrow{CB}$.'
        },
        {
          id: 'm104-s1-q2',
          question: 'Cho hình vuông $ABCD$ cạnh $a$. Độ dài của tổng vectơ $|\\overrightarrow{AB} + \\overrightarrow{AD}|$ bằng:',
          options: ['A. $a\\sqrt{2}$', 'B. $2a$', 'C. $a$', 'D. $0$'],
          correctIndex: 0,
          explanation: 'Theo quy tắc hình bình hành, $\\overrightarrow{AB} + \\overrightarrow{AD} = \\overrightarrow{AC}$, có độ dài bằng đường chéo $AC = a\\sqrt{2}$.'
        }
      ],
      miniEssay: {
        id: 'm104-s1-e1',
        question: 'Cho tam giác $ABC$ có trọng tâm $G$, gọi $M$ là trung điểm $BC$. Chứng minh rằng với điểm $O$ bất kỳ, ta luôn có $\\overrightarrow{OA} + \\overrightarrow{OB} + \\overrightarrow{OC} = 3\\overrightarrow{OG}$.',
        hint: 'Chèn điểm $G$ vào từng vectơ $\\overrightarrow{OA} = \\overrightarrow{OG} + \\overrightarrow{GA}$, tương tự cho $\\overrightarrow{OB}, \\overrightarrow{OC}$, rồi dùng tính chất trọng tâm.',
        rubricChecklist: [
          'Chèn điểm $G$: $\\overrightarrow{OA} + \\overrightarrow{OB} + \\overrightarrow{OC} = 3\\overrightarrow{OG} + (\\overrightarrow{GA} + \\overrightarrow{GB} + \\overrightarrow{GC})$.',
          'Sử dụng tính chất trọng tâm $\\overrightarrow{GA} + \\overrightarrow{GB} + \\overrightarrow{GC} = \\vec{0}$.',
          'Kết luận đẳng thức đúng.'
        ],
        sampleAnswer:
          'Chèn điểm $G$ vào vế trái: $\\overrightarrow{OA} + \\overrightarrow{OB} + \\overrightarrow{OC} = (\\overrightarrow{OG} + \\overrightarrow{GA}) + (\\overrightarrow{OG} + \\overrightarrow{GB}) + (\\overrightarrow{OG} + \\overrightarrow{GC}) = 3\\overrightarrow{OG} + (\\overrightarrow{GA} + \\overrightarrow{GB} + \\overrightarrow{GC})$. Vì $G$ là trọng tâm $\\triangle ABC$ nên $\\overrightarrow{GA} + \\overrightarrow{GB} + \\overrightarrow{GC} = \\vec{0}$. Suy ra $\\overrightarrow{OA} + \\overrightarrow{OB} + \\overrightarrow{OC} = 3\\overrightarrow{OG}$.'
      }
    },
    {
      stepTitle: '2. Tích Vectơ với một Số & Chứng minh 3 điểm Thẳng hàng',
      stepType: 'derivation',
      conceptSection:
        'Tích của số thực $k \\neq 0$ với vectơ $\\vec{a} \\neq \\vec{0}$ là vectơ $k\\vec{a}$ cùng hướng với $\\vec{a}$ nếu $k > 0$, ngược hướng nếu $k < 0$, và có độ dài $|k|\\cdot|\\vec{a}|$. Đây là chìa khóa duy nhất để biểu diễn vectơ và chứng minh ba điểm thẳng hàng.',
      formulaSection: {
        primaryFormula: 'A, B, C \\text{ thẳng hàng} \\iff \\overrightarrow{AB} = k \\overrightarrow{AC} \\quad (k \\neq 0)',
        secondaryFormulas: [
          '\\overrightarrow{AI} = \\frac{1}{2}(\\overrightarrow{AB} + \\overrightarrow{AC}) \\quad (I \\text{ là trung điểm } BC)',
          '\\text{Hệ thức phân chia đoạn: } \\overrightarrow{MB} = m\\overrightarrow{BC} \\implies \\overrightarrow{AM} = (1+m)\\overrightarrow{AB} - m\\overrightarrow{AC}'
        ],
        variablesNote:
          '• **Phương pháp chuẩn để chứng minh 3 điểm $M, N, P$ thẳng hàng**:\n  Chọn 2 vectơ gốc không cùng phương (thường là $\\overrightarrow{AB}$ và $\\overrightarrow{AC}$), biểu diễn $\\overrightarrow{MN} = x\\overrightarrow{AB} + y\\overrightarrow{AC}$ và $\\overrightarrow{MP} = x\'\\overrightarrow{AB} + y\'\\overrightarrow{AC}$, rồi kiểm tra tỉ số $\\frac{x}{x\'} = \\frac{y}{y\'}$.'
      },
      deepDiveSection:
        'Ngoài ra, hai đường thẳng $MN$ và $PQ$ song song (hoặc trùng nhau) khi và chỉ khi $\\overrightarrow{MN} = k\\overrightarrow{PQ}$. Trong bài toán tìm quỹ tích điểm $M$ thỏa $|\\overrightarrow{MA} + \\overrightarrow{MB}| = |\\overrightarrow{MA} - \\overrightarrow{MB}|$, vế trái thu gọn thành $2MI$ và vế phải thành $AB$, suy ra $MI = AB/2$ (đường tròn tâm $I$ đường kính $AB$).',
      teacherExplanation: 'Chọn 2 vectơ gốc cố định (như $\\overrightarrow{AB}, \\overrightarrow{AC}$), mọi bài chứng minh thẳng hàng đều quy về so sánh tỷ lệ hệ số!',
      keyTakeaway: 'Muốn chứng minh $M, N, P$ thẳng hàng: biểu diễn $\\overrightarrow{MN}$ và $\\overrightarrow{MP}$ theo hai vectơ gốc rồi chỉ ra $\\overrightarrow{MN} = k\\overrightarrow{MP}$.',
      miniQuiz: [
        {
          id: 'm104-s2-q1',
          question: 'Cho tam giác $ABC$ có trung tuyến $AM$ và trọng tâm $G$. Đẳng thức nào sau đây ĐÚNG?',
          options: [
            'A. $\\overrightarrow{AG} = \\frac{2}{3}\\overrightarrow{AM}$',
            'B. $\\overrightarrow{GM} = \\frac{1}{2}\\overrightarrow{AM}$',
            'C. $\\overrightarrow{GA} = 2\\overrightarrow{GM}$',
            'D. $\\overrightarrow{AM} = \\frac{3}{2}\\overrightarrow{MG}$'
          ],
          correctIndex: 0,
          explanation: '$\\overrightarrow{AG}$ và $\\overrightarrow{AM}$ cùng hướng và $AG = \\frac{2}{3}AM$, nên $\\overrightarrow{AG} = \\frac{2}{3}\\overrightarrow{AM}$.'
        },
        {
          id: 'm104-s2-q2',
          question: 'Điểm $M$ thỏa mãn $\\overrightarrow{MB} = -2\\overrightarrow{MC}$. Biểu diễn $\\overrightarrow{AM}$ theo $\\overrightarrow{AB}$ và $\\overrightarrow{AC}$ là:',
          options: [
            'A. $\\overrightarrow{AM} = \\frac{1}{3}\\overrightarrow{AB} + \\frac{2}{3}\\overrightarrow{AC}$',
            'B. $\\overrightarrow{AM} = \\frac{2}{3}\\overrightarrow{AB} + \\frac{1}{3}\\overrightarrow{AC}$',
            'C. $\\overrightarrow{AM} = 2\\overrightarrow{AC} - \\overrightarrow{AB}$',
            'D. $\\overrightarrow{AM} = \\frac{1}{2}\\overrightarrow{AB} + \\frac{1}{2}\\overrightarrow{AC}$'
          ],
          correctIndex: 0,
          explanation: 'Chèn $A$: $\\overrightarrow{AB} - \\overrightarrow{AM} = -2(\\overrightarrow{AC} - \\overrightarrow{AM}) \\iff 3\\overrightarrow{AM} = \\overrightarrow{AB} + 2\\overrightarrow{AC} \\implies \\overrightarrow{AM} = \\frac{1}{3}\\overrightarrow{AB} + \\frac{2}{3}\\overrightarrow{AC}$.'
        }
      ],
      miniEssay: {
        id: 'm104-s2-e1',
        question: 'Cho tam giác $ABC$. Gọi $M$ là trung điểm $AB$, điểm $N$ trên $AC$ thỏa mãn $\\overrightarrow{AN} = \\frac{1}{3}\\overrightarrow{AC}$ và điểm $P$ thỏa $\\overrightarrow{BP} = \\frac{1}{2}\\overrightarrow{CP}$ (tức $P$ nằm ngoài đoạn $BC$ sao cho $\\overrightarrow{CP} = 2\\overrightarrow{BP}$). Chứng minh ba điểm $M, N, P$ thẳng hàng.',
        hint: 'Biểu diễn $\\overrightarrow{MN}$ và $\\overrightarrow{MP}$ theo hai vectơ gốc $\\overrightarrow{AB}, \\overrightarrow{AC}$. Từ $\\overrightarrow{BP} = \\frac{1}{2}\\overrightarrow{CP}$ chèn $A$ suy ra $\\overrightarrow{AP} = 2\\overrightarrow{AB} - \\overrightarrow{AC}$.',
        rubricChecklist: [
          'Tính $\\overrightarrow{MN} = \\overrightarrow{AN} - \\overrightarrow{AM} = -\\frac{1}{2}\\overrightarrow{AB} + \\frac{1}{3}\\overrightarrow{AC}$.',
          'Từ $\\overrightarrow{CP} = 2\\overrightarrow{BP} \\implies \\overrightarrow{AP} - \\overrightarrow{AC} = 2(\\overrightarrow{AP} - \\overrightarrow{AB}) \\implies \\overrightarrow{AP} = 2\\overrightarrow{AB} - \\overrightarrow{AC}$.',
          'Tính $\\overrightarrow{MP} = \\overrightarrow{AP} - \\overrightarrow{AM} = \\frac{3}{2}\\overrightarrow{AB} - \\overrightarrow{AC} = -3\\overrightarrow{MN}$, suy ra $M, N, P$ thẳng hàng.'
        ],
        sampleAnswer:
          'Ta có $\\overrightarrow{AM} = \\frac{1}{2}\\overrightarrow{AB}$ và $\\overrightarrow{AN} = \\frac{1}{3}\\overrightarrow{AC}$, suy ra $\\overrightarrow{MN} = \\overrightarrow{AN} - \\overrightarrow{AM} = -\\frac{1}{2}\\overrightarrow{AB} + \\frac{1}{3}\\overrightarrow{AC}$. Từ $\\overrightarrow{BP} = \\frac{1}{2}\\overrightarrow{CP} \\iff 2(\\overrightarrow{AP} - \\overrightarrow{AB}) = \\overrightarrow{AP} - \\overrightarrow{AC} \\iff \\overrightarrow{AP} = 2\\overrightarrow{AB} - \\overrightarrow{AC}$. Do đó $\\overrightarrow{MP} = \\overrightarrow{AP} - \\overrightarrow{AM} = \\frac{3}{2}\\overrightarrow{AB} - \\overrightarrow{AC} = -3\\left(-\\frac{1}{2}\\overrightarrow{AB} + \\frac{1}{3}\\overrightarrow{AC}\\right) = -3\\overrightarrow{MN}$. Vậy $M, N, P$ thẳng hàng.'
      }
    },
    {
      stepTitle: '3. Hệ Tọa độ $Oxy$: Tọa độ Trung điểm, Trọng tâm & Độ dài Vectơ',
      stepType: 'example',
      conceptSection:
        'Trong mặt phẳng tọa độ $Oxy$, mỗi điểm $A(x_A; y_A)$ gắn với vectơ vị trí $\\overrightarrow{OA} = (x_A; y_A)$. Mọi bài toán tìm đỉnh thứ tư của hình bình hành, trọng tâm tam giác hay điểm chia đoạn đều chuyển thành phép cộng trừ số học cực nhanh.',
      formulaSection: {
        primaryFormula: '\\overrightarrow{AB} = (x_B - x_A;\\ y_B - y_A), \\qquad AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}',
        secondaryFormulas: [
          '\\text{Trung điểm } I \\text{ của } AB: \\ I\\left(\\frac{x_A+x_B}{2};\\ \\frac{y_A+y_B}{2}\\right)',
          '\\text{Trọng tâm } G \\text{ của } \\triangle ABC: \\ G\\left(\\frac{x_A+x_B+x_C}{3};\\ \\frac{y_A+y_B+y_C}{3}\\right)'
        ],
        variablesNote:
          '• **Mẹo tìm nhanh đỉnh $D$ để $ABCD$ là hình bình hành**: Cho $\\overrightarrow{AB} = \\overrightarrow{DC} \\iff D = A + C - B$ (lấy tọa độ hai đỉnh đối diện $A, C$ cộng lại rồi trừ đỉnh đối diện $D$ là $B$!).\n• Chú ý thứ tự đỉnh $ABCD$ hay $ABDC$ kẻo lấy nhầm cặp đỉnh đối diện!'
      },
      deepDiveSection:
        'Một dạng toán hay thi: tìm điểm $M$ thuộc trục $Ox$ (tọa độ $M(x; 0)$) sao cho $\\triangle MAB$ vuông tại $M$ hoặc $MA + MB$ nhỏ nhất. Nếu vuông tại $M$, đặt $\\overrightarrow{MA}\\cdot\\overrightarrow{MB} = 0$; nếu tìm $\\min(MA + MB)$, lấy $A\'$ đối xứng $A$ qua $Ox$ (khi $A, B$ cùng phía) rồi tìm giao điểm $A\'B$ với $Ox$.',
      teacherExplanation: 'Hình bình hành $ABCD$: $D = A + C - B$; dùng tích tọa độ $\\overrightarrow{AB} = (x_B - x_A; y_B - y_A)$ luôn lấy ngọn trừ gốc.',
      keyTakeaway: 'Tọa độ trọng tâm là trung bình cộng 3 đỉnh; $ABCD$ là hình bình hành $\\iff \\overrightarrow{AB} = \\overrightarrow{DC}$.',
      miniQuiz: [
        {
          id: 'm104-s3-q1',
          question: 'Cho $A(1; -2), B(3; 4), C(5; 1)$. Tọa độ đỉnh $D$ sao cho tứ giác $ABCD$ là hình bình hành là:',
          options: ['A. $D(3; -5)$', 'B. $D(7; 7)$', 'C. $D(-1; 1)$', 'D. $D(3; 5)$'],
          correctIndex: 0,
          explanation: '$D = A + C - B = (1 + 5 - 3; -2 + 1 - 4) = (3; -5)$.'
        },
        {
          id: 'm104-s3-q2',
          question: 'Cho tam giác $ABC$ có $A(2; 1)$, $B(-1; 4)$ và trọng tâm $G(1; 2)$. Tọa độ đỉnh $C$ là:',
          options: ['A. $C(2; 1)$', 'B. $C(1; 2)$', 'C. $C(4; -1)$', 'D. $C(2; 0)$'],
          correctIndex: 0,
          explanation: '$x_C = 3x_G - x_A - x_B = 3 - 2 - (-1) = 2$; $y_C = 3y_G - y_A - y_B = 6 - 1 - 4 = 1 \\implies C(2; 1)$.'
        }
      ],
      miniEssay: {
        id: 'm104-s3-e1',
        question: 'Cho $A(1; 3)$, $B(4; 1)$. Tìm điểm $M$ trên trục hoành $Ox$ sao cho tam giác $MAB$ vuông tại $M$.',
        hint: 'Gọi $M(x; 0) \\in Ox$. Tính $\\overrightarrow{MA}, \\overrightarrow{MB}$ và giải phương trình $\\overrightarrow{MA}\\cdot\\overrightarrow{MB} = 0$.',
        rubricChecklist: [
          'Đặt đúng tọa độ $M(x; 0)$ và tính $\\overrightarrow{MA} = (1 - x; 3)$, $\\overrightarrow{MB} = (4 - x; 1)$.',
          'Lập phương trình $(1 - x)(4 - x) + 3\\cdot 1 = 0 \\iff x^2 - 5x + 7 = 0$.',
          'Tính $\\Delta = 25 - 28 = -3 < 0$ và kết luận KHÔNG có điểm $M$ nào trên $Ox$ thỏa mãn.'
        ],
        sampleAnswer:
          'Vì $M \\in Ox$ nên $M(x; 0)$. Ta có $\\overrightarrow{MA} = (1 - x; 3)$ và $\\overrightarrow{MB} = (4 - x; 1)$. Tam giác $MAB$ vuông tại $M \\iff \\overrightarrow{MA} \\cdot \\overrightarrow{MB} = 0 \\iff (1 - x)(4 - x) + 3\\cdot 1 = 0 \\iff x^2 - 5x + 7 = 0$. Vì $\\Delta = (-5)^2 - 4\\cdot 7 = -3 < 0$ nên phương trình vô nghiệm. Vậy không tồn tại điểm $M \\in Ox$ để $\\triangle MAB$ vuông tại $M$.'
      }
    }
  ],
  'math-10-5': [
    {
      stepTitle: '1. Phương trình Đường thẳng (Tham số & Tổng quát) trong $Oxy$',
      stepType: 'concept',
      conceptSection:
        'Mỗi đường thẳng $\\Delta$ trong mặt phẳng $Oxy$ được xác định duy nhất bởi 1 điểm đi qua $M_0(x_0; y_0)$ và hoặc 1 **vectơ chỉ phương** $\\vec{u} = (u_1; u_2)$ (song song/nằm trên $\\Delta$) hoặc 1 **vectơ pháp tuyến** $\\vec{n} = (a; b)$ (vuông góc với $\\Delta$).',
      formulaSection: {
        primaryFormula: 'a(x - x_0) + b(y - y_0) = 0 \\quad (\\text{Tổng quát}); \\qquad \\begin{cases} x = x_0 + u_1 t \\\\ y = y_0 + u_2 t \\end{cases} \\quad (\\text{Tham số})',
        secondaryFormulas: [
          '\\vec{u} = (u_1; u_2) \\iff \\vec{n} = (-u_2; u_1) \\text{ hoặc } (u_2; -u_1)',
          '\\text{Đoạn chắn qua } A(a;0), B(0;b): \\ \\frac{x}{a} + \\frac{y}{b} = 1 \\ (ab \\neq 0)'
        ],
        variablesNote:
          '• **Đổi nhanh từ $\\vec{u}$ sang $\\vec{n}$**: Đổi chỗ hai tọa độ và thêm dấu trừ vào MỘT tọa độ ($\\vec{u}\\cdot\\vec{n} = 0$).\n• Hai đường thẳng song song có **cùng** vectơ pháp tuyến; hai đường vuông góc đổi pháp tuyến đường này thành chỉ phương đường kia.'
      },
      deepDiveSection:
        'Khi viết phương trình đường cao $AH$ trong $\\triangle ABC$: đi qua $A$ và vuông góc với $BC$, nên nhận ngay $\\overrightarrow{BC}$ làm vectơ pháp tuyến! Khi viết đường trung trực đoạn $AB$: đi qua trung điểm $I$ của $AB$ và nhận $\\overrightarrow{AB}$ làm vectơ pháp tuyến.',
      teacherExplanation: 'Muốn viết phương trình tổng quát nhanh nhất: tìm điểm đi qua + vectơ pháp tuyến, rồi lắp vào $a(x - x_0) + b(y - y_0) = 0$.',
      keyTakeaway: '$\\vec{u} = (u_1; u_2) \\implies \\vec{n} = (-u_2; u_1)$; đường trung trực nhận $\\overrightarrow{AB}$ làm vectơ pháp tuyến.',
      miniQuiz: [
        {
          id: 'm105-s1-q1',
          question: 'Đường thẳng $d$ đi qua $M(1; -2)$ và có vectơ chỉ phương $\\vec{u} = (3; 5)$ có phương trình tổng quát là:',
          options: ['A. $5x - 3y - 11 = 0$', 'B. $3x + 5y + 7 = 0$', 'C. $5x + 3y + 1 = 0$', 'D. $3x - 5y - 13 = 0$'],
          correctIndex: 0,
          explanation: 'VTPT $\\vec{n} = (5; -3)$. Phương trình: $5(x - 1) - 3(y + 2) = 0 \\iff 5x - 3y - 11 = 0$.'
        },
        {
          id: 'm105-s1-q2',
          question: 'Cho $A(2; 0)$ và $B(0; -4)$. Phương trình đường trung trực của đoạn $AB$ là:',
          options: ['A. $x + 2y + 3 = 0$', 'B. $2x - y - 4 = 0$', 'C. $x - 2y - 5 = 0$', 'D. $x + 2y - 3 = 0$'],
          correctIndex: 0,
          explanation: 'Trung điểm $I(1; -2)$. VTPT $\\overrightarrow{AB} = (-2; -4) = -2(1; 2)$. Vậy $1(x - 1) + 2(y + 2) = 0 \\iff x + 2y + 3 = 0$.'
        }
      ],
      miniEssay: {
        id: 'm105-s1-e1',
        question: 'Cho tam giác $ABC$ có $A(1; 2), B(-2; 3), C(4; 5)$. Viết phương trình tổng quát của đường cao $AH$ kẻ từ $A$.',
        hint: 'Đường cao $AH$ đi qua $A(1; 2)$ và vuông góc với $BC$, nên nhận $\\overrightarrow{BC}$ làm vectơ pháp tuyến.',
        rubricChecklist: [
          'Tính đúng $\\overrightarrow{BC} = (6; 2) = 2(3; 1)$, chọn VTPT $\\vec{n} = (3; 1)$.',
          'Viết $3(x - 1) + 1(y - 2) = 0$.',
          'Thu gọn kết luận $3x + y - 5 = 0$.'
        ],
        sampleAnswer:
          'Ta có $\\overrightarrow{BC} = (4 - (-2); 5 - 3) = (6; 2)$. Vì $AH \\perp BC$ nên $AH$ nhận $\\vec{n} = \\frac{1}{2}\\overrightarrow{BC} = (3; 1)$ làm vectơ pháp tuyến và đi qua $A(1; 2)$. Phương trình đường cao $AH$ là $3(x - 1) + 1(y - 2) = 0 \\iff 3x + y - 5 = 0$.'
      }
    },
    {
      stepTitle: '2. Góc giữa Hai Đường thẳng & Khoảng cách từ Điểm đến Đường thẳng',
      stepType: 'derivation',
      conceptSection:
        'Góc giữa hai đường thẳng $\\Delta_1, \\Delta_2$ luôn nằm trong $[0^\\circ; 90^\\circ]$ (nên $\\cos(\\Delta_1, \\Delta_2) \\ge 0$ phải lấy **trị tuyệt đối**!). Tương tự, công thức khoảng cách từ $M(x_0; y_0)$ đến $\\Delta: ax + by + c = 0$ cũng luôn có dấu giá trị tuyệt đối ở tử số.',
      formulaSection: {
        primaryFormula: 'd(M, \\Delta) = \\frac{|ax_0 + by_0 + c|}{\\sqrt{a^2 + b^2}}, \\qquad \\cos(\\Delta_1, \\Delta_2) = \\frac{|\\vec{n}_1 \\cdot \\vec{n}_2|}{|\\vec{n}_1| \\cdot |\\vec{n}_2|}',
        secondaryFormulas: [
          '\\text{Hai điểm } A, B \\text{ nằm cùng phía với } \\Delta \\iff (ax_A+by_A+c)(ax_B+by_B+c) > 0',
          '\\text{Khoảng cách giữa hai đường song song } ax+by+c_1=0 \\text{ và } ax+by+c_2=0: \\ \\frac{|c_1 - c_2|}{\\sqrt{a^2 + b^2}}'
        ],
        variablesNote:
          '• **Cảnh giác**: Trước khi áp dụng $d(M, \\Delta)$, nhớ chuyển phương trình đường thẳng về đúng dạng tổng quát $ax + by + c = 0$ (vế phải bằng $0$!).\n• Đừng bao giờ quên dấu trị tuyệt đối $|\\cdot|$ ở tử số của cả $\\cos(\\Delta_1, \\Delta_2)$ và $d(M, \\Delta)$.'
      },
      deepDiveSection:
        'Công thức khoảng cách là chìa khóa vàng cho bài toán viết phương trình tiếp tuyến của đường tròn $(C)$ tâm $I$, bán kính $R$: đường thẳng $\\Delta$ tiếp xúc với $(C)$ khi và chỉ khi $d(I, \\Delta) = R$. Phương trình giá trị tuyệt đối $|a x_I + b y_I + c| = R\\sqrt{a^2 + b^2}$ luôn giải được bằng bình phương hai vế.',
      teacherExplanation: 'Góc giữa hai đường thẳng khác góc giữa hai vectơ: phải có trị tuyệt đối trên tử số để đảm bảo $\\cos \\ge 0$.',
      keyTakeaway: 'Dùng $d(I, \\Delta) = R$ cho bài toán tiếp tuyến và $\\cos\\varphi = \\frac{|\\vec{n}_1\\cdot\\vec{n}_2|}{|\\vec{n}_1||\\vec{n}_2|}$ cho góc hai đường.',
      miniQuiz: [
        {
          id: 'm105-s2-q1',
          question: 'Khoảng cách từ điểm $M(1; -2)$ đến đường thẳng $\\Delta: 3x - 4y + 4 = 0$ bằng:',
          options: ['A. $3$', 'B. $5$', 'C. $\\frac{7}{5}$', 'D. $\\frac{11}{5}$'],
          correctIndex: 0,
          explanation: '$d(M, \\Delta) = \\frac{|3(1) - 4(-2) + 4|}{\\sqrt{3^2 + (-4)^2}} = \\frac{|3 + 8 + 4|}{5} = \\frac{15}{5} = 3$.'
        },
        {
          id: 'm105-s2-q2',
          question: 'Góc giữa hai đường thẳng $d_1: x + 2y - 3 = 0$ và $d_2: 3x + y + 5 = 0$ bằng:',
          options: ['A. $45^\\circ$', 'B. $60^\\circ$', 'C. $30^\\circ$', 'D. $90^\\circ$'],
          correctIndex: 0,
          explanation: '$\\cos\\varphi = \\frac{|1\\cdot 3 + 2\\cdot 1|}{\\sqrt{1^2+2^2}\\sqrt{3^2+1^2}} = \\frac{5}{\\sqrt{5}\\cdot\\sqrt{10}} = \\frac{1}{\\sqrt{2}} \\implies \\varphi = 45^\\circ$.'
        }
      ],
      miniEssay: {
        id: 'm105-s2-e1',
        question: 'Tìm $c$ để đường thẳng $\\Delta: 4x + 3y + c = 0$ tiếp xúc với đường tròn tâm $I(1; 2)$, bán kính $R = 3$.',
        hint: 'Điều kiện tiếp xúc là $d(I, \\Delta) = R \\iff \\frac{|4\\cdot 1 + 3\\cdot 2 + c|}{5} = 3$.',
        rubricChecklist: [
          'Viết đúng điều kiện tiếp xúc $d(I, \\Delta) = R$.',
          'Thay số được $|10 + c| = 15$.',
          'Giải đủ hai trường hợp $c = 5$ và $c = -25$.'
        ],
        sampleAnswer:
          'Đường thẳng $\\Delta$ tiếp xúc với đường tròn $(I; R) \\iff d(I, \\Delta) = R \\iff \\frac{|4\\cdot 1 + 3\\cdot 2 + c|}{\\sqrt{4^2 + 3^2}} = 3 \\iff |10 + c| = 15$. Suy ra $10 + c = 15 \\implies c = 5$ hoặc $10 + c = -15 \\implies c = -25$.'
      }
    },
    {
      stepTitle: '3. Phương trình Đường tròn & Phương trình Tiếp tuyến Đường tròn',
      stepType: 'example',
      conceptSection:
        'Đường tròn tâm $I(a; b)$ bán kính $R > 0$ có hai dạng phương trình: dạng chuẩn tắc $(x - a)^2 + (y - b)^2 = R^2$ và dạng khai triển $x^2 + y^2 - 2ax - 2by + c = 0$. Không phải phương trình khai triển nào cũng là đường tròn!',
      formulaSection: {
        primaryFormula: '(x - a)^2 + (y - b)^2 = R^2 \\iff x^2 + y^2 - 2ax - 2by + c = 0',
        secondaryFormulas: [
          '\\text{Điều kiện là đường tròn: } a^2 + b^2 - c > 0, \\quad R = \\sqrt{a^2 + b^2 - c}',
          '\\text{Tiếp tuyến tại } M_0(x_0; y_0) \\in (C): \\ (x_0 - a)(x - x_0) + (y_0 - b)(y - y_0) = 0'
        ],
        variablesNote:
          '• **Cách đọc nhanh tâm $I(a; b)$ từ dạng khai triển**: lấy hệ số của $x$ và $y$ **CHIA CHO $-2$**!\n• Nếu đề cho $2x^2 + 2y^2 - 4x + 8y - 1 = 0$, nhớ chia hai vế cho $2$ trước khi chia cho $-2$ để tìm tâm và bán kính!'
      },
      deepDiveSection:
        'Khi viết phương trình đường tròn ngoại tiếp tam giác $ABC$ ($3$ điểm không thẳng hàng), ta gọi dạng khai triển $x^2 + y^2 - 2ax - 2by + c = 0$, thay lần lượt tọa độ $A, B, C$ vào để lập hệ 3 phương trình bậc nhất 3 ẩn $(a, b, c)$ — nhanh hơn rất nhiều so với giải giao điểm 2 đường trung trực.',
      teacherExplanation: 'Nhớ quy tắc "chia cho $-2$" từ hệ số của $x, y$ và kiểm tra điều kiện $a^2 + b^2 - c > 0$!',
      keyTakeaway: 'Tâm $I$ lấy hệ số $x, y$ chia $-2$; tiếp tuyến tại $M_0$ nhận $\\overrightarrow{IM_0}$ làm vectơ pháp tuyến.',
      miniQuiz: [
        {
          id: 'm105-s3-q1',
          question: 'Đường tròn $(C): x^2 + y^2 - 4x + 6y - 3 = 0$ có tâm $I$ và bán kính $R$ là:',
          options: ['A. $I(2; -3), R = 4$', 'B. $I(-2; 3), R = 4$', 'C. $I(2; -3), R = 16$', 'D. $I(4; -6), R = 4$'],
          correctIndex: 0,
          explanation: 'Chia cho $-2$: $a = 2, b = -3$. Bán kính $R = \\sqrt{2^2 + (-3)^2 - (-3)} = \\sqrt{16} = 4$.'
        },
        {
          id: 'm105-s3-q2',
          question: 'Phương trình tiếp tuyến của đường tròn $(x - 1)^2 + (y + 2)^2 = 10$ tại điểm $M(2; 1)$ là:',
          options: ['A. $x + 3y - 5 = 0$', 'B. $x - 3y + 1 = 0$', 'C. $3x + y - 7 = 0$', 'D. $x + 3y + 5 = 0$'],
          correctIndex: 0,
          explanation: 'Tâm $I(1; -2) \\implies \\overrightarrow{IM} = (1; 3)$ là VTPT. Phương trình: $1(x - 2) + 3(y - 1) = 0 \\iff x + 3y - 5 = 0$.'
        }
      ],
      miniEssay: {
        id: 'm105-s3-e1',
        question: 'Tìm tất cả giá trị của tham số $m$ để phương trình $x^2 + y^2 - 2mx + 4(m - 1)y + 5m^2 - 2 = 0$ là phương trình của một đường tròn.',
        hint: 'Xác định $a = m$, $b = -2(m - 1)$, $c = 5m^2 - 2$ và giải bất phương trình $a^2 + b^2 - c > 0$.',
        rubricChecklist: [
          'Tìm đúng $a = m$, $b = -2m + 2$, $c = 5m^2 - 2$.',
          'Lập đúng điều kiện $m^2 + (-2m + 2)^2 - (5m^2 - 2) > 0$.',
          'Rút gọn thành $-8m + 6 > 0 \\iff m < \\frac{3}{4}$.'
        ],
        sampleAnswer:
          'Ta có $a = m$, $b = -2(m - 1) = -2m + 2$, $c = 5m^2 - 2$. Phương trình là phương trình đường tròn $\\iff a^2 + b^2 - c > 0 \\iff m^2 + (-2m + 2)^2 - (5m^2 - 2) > 0 \\iff m^2 + 4m^2 - 8m + 4 - 5m^2 + 2 > 0 \\iff -8m + 6 > 0 \\iff m < \\frac{3}{4}$.'
      }
    }
  ],
  'math-10-6': [
    {
      stepTitle: '1. Ba Đường Conic Cơ bản (Elip, Hypebol, Parabol) trong Hình học Phẳng',
      stepType: 'concept',
      conceptSection:
        'Ba đường Conic xuất hiện khi cắt mặt nón tròn xoay bằng các mặt phẳng nghiêng khác nhau: Elip (tổng khoảng cách tới hai tiêu điểm không đổi), Hypebol (giá trị tuyệt đối hiệu khoảng cách không đổi) và Parabol (cách đều tiêu điểm và đường chuẩn).',
      formulaSection: {
        primaryFormula: '\\text{Elip: } \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 \\ (a > b > 0); \\qquad \\text{Hypebol: } \\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1',
        secondaryFormulas: [
          '\\text{Elip: } c^2 = a^2 - b^2, \\quad MF_1 + MF_2 = 2a',
          '\\text{Hypebol: } c^2 = a^2 + b^2, \\quad |MF_1 - MF_2| = 2a; \\qquad \\text{Parabol: } y^2 = 2px'
        ],
        variablesNote:
          '• **Cực kỳ hay nhầm giữa Elip và Hypebol**: Trong Elip, bán trục lớn $a$ là lớn nhất nên **$a^2 = b^2 + c^2$**; trong Hypebol, tiêu cự $c$ lớn nhất nên **$c^2 = a^2 + b^2$**!\n• Với Parabol chính tắc $y^2 = 2px$ ($p > 0$), tiêu điểm $F(\\frac{p}{2}; 0)$ và đường chuẩn $x = -\\frac{p}{2}$.'
      },
      deepDiveSection:
        'Bán kính qua tiêu của điểm $M(x_0; y_0)$ trên Elip là $MF_1 = a + \\frac{c}{a}x_0$ và $MF_2 = a - \\frac{c}{a}x_0$; trên Parabol $y^2 = 2px$ là $MF = x_0 + \\frac{p}{2}$. Các công thức này giúp giải nhanh các bài toán thực tế về quỹ đạo hành tinh, vòm cầu Elip hay chảo thu Parabol.',
      teacherExplanation: 'Nhớ câu thần chú: Elip thì $a$ lớn nhất ($a^2 = b^2 + c^2$); Hypebol thì $c$ lớn nhất ($c^2 = a^2 + b^2$).',
      keyTakeaway: 'Elip có dấu cộng và $a^2 = b^2 + c^2$; Hypebol có dấu trừ và $c^2 = a^2 + b^2$; Parabol $y^2 = 2px$.',
      miniQuiz: [
        {
          id: 'm106-s1-q1',
          question: 'Cho Elip $(E): \\frac{x^2}{25} + \\frac{y^2}{9} = 1$. Tiêu cự $2c$ của Elip bằng:',
          options: ['A. $8$', 'B. $4$', 'C. $10$', 'D. $2\\sqrt{34}$'],
          correctIndex: 0,
          explanation: '$a^2 = 25, b^2 = 9 \\implies c = \\sqrt{25 - 9} = 4 \\implies$ tiêu cự $2c = 8$.'
        },
        {
          id: 'm106-s1-q2',
          question: 'Parabol $(P): y^2 = 12x$ có tiêu điểm $F$ và đường chuẩn $\\Delta$ là:',
          options: [
            'A. $F(3; 0),\\ \\Delta: x = -3$',
            'B. $F(6; 0),\\ \\Delta: x = -6$',
            'C. $F(3; 0),\\ \\Delta: x = 3$',
            'D. $F(12; 0),\\ \\Delta: x = -12$'
          ],
          correctIndex: 0,
          explanation: '$2p = 12 \\implies p = 6 \\implies \\frac{p}{2} = 3$. Vậy $F(3; 0)$ và $\\Delta: x = -3$.'
        }
      ],
      miniEssay: {
        id: 'm106-s1-e1',
        question: 'Lập phương trình chính tắc của Elip $(E)$ biết độ dài trục lớn bằng $10$ và tiêu cự bằng $6$.',
        hint: 'Từ $2a = 10$ và $2c = 6$ tính $a = 5, c = 3$, suy ra $b^2 = a^2 - c^2 = 16$.',
        rubricChecklist: [
          'Tính đúng $a = 5$ và $c = 3$.',
          'Tính đúng $b^2 = a^2 - c^2 = 25 - 9 = 16$.',
          'Viết phương trình chính tắc $\\frac{x^2}{25} + \\frac{y^2}{16} = 1$.'
        ],
        sampleAnswer:
          'Ta có độ dài trục lớn $2a = 10 \\implies a = 5$; tiêu cự $2c = 6 \\implies c = 3$. Khi đó $b^2 = a^2 - c^2 = 25 - 9 = 16$. Vậy phương trình chính tắc của Elip là $\\frac{x^2}{25} + \\frac{y^2}{16} = 1$.'
      }
    },
    {
      stepTitle: '2. Số Đặc trưng Đo Xu thế Trung tâm: Trung bình, Trung vị & Tứ phân vị',
      stepType: 'derivation',
      conceptSection:
        'Để mô tả vị trí trung tâm của một mẫu số liệu, ta dùng số trung bình $\\overline{x}$, trung vị $M_e$ và tứ phân vị $(Q_1, Q_2, Q_3)$. Khi mẫu có các giá trị ngoại lệ (quá lớn hoặc quá nhỏ), **trung vị $M_e$** phản ánh chính xác hơn số trung bình.',
      formulaSection: {
        primaryFormula: 'Q_2 = M_e, \\qquad \\Delta_Q = Q_3 - Q_1 \\quad (\\text{Khoảng tứ phân vị})',
        secondaryFormulas: [
          'n \\text{ lẻ}: M_e = x_{(n+1)/2}; \\qquad n \\text{ chẵn}: M_e = \\frac{x_{n/2} + x_{n/2 + 1}}{2}',
          '\\text{Giá trị ngoại lệ}: x < Q_1 - 1{,}5\\Delta_Q \\text{ hoặc } x > Q_3 + 1{,}5\\Delta_Q'
        ],
        variablesNote:
          '• **Bước bắt buộc số 1**: LUÔN SẮP XẾP mẫu số liệu theo thứ tự **KHÔNG GIẢM** (từ bé đến lớn) trước khi tìm $M_e, Q_1, Q_2, Q_3$!\n• $Q_1$ là trung vị của nửa số liệu bên trái $Q_2$, $Q_3$ là trung vị của nửa số liệu bên phải $Q_2$ (nếu $n$ lẻ thì bỏ $Q_2$ ở giữa ra trước khi chia đôi).'
      },
      deepDiveSection:
        'Mốt $M_o$ là giá trị có tần số xuất hiện lớn nhất trong mẫu (dùng cho cả dữ liệu định tính như cỡ giày, màu áo). Khoảng tứ phân vị $\\Delta_Q = Q_3 - Q_1$ đo độ phân tán của $50\\%$ số liệu nằm ở chính giữa và không bị nhiễu bởi giá trị bất thường.',
      teacherExplanation: 'Quên sắp xếp dãy số từ nhỏ đến lớn là lỗi sai phổ biến nhất khi tìm trung vị và tứ phân vị!',
      keyTakeaway: 'Sắp xếp tăng dần $\\to$ tìm $Q_2$ ($M_e$) $\\to$ lấy trung vị nửa trái ra $Q_1$, nửa phải ra $Q_3$.',
      miniQuiz: [
        {
          id: 'm106-s2-q1',
          question: 'Cho mẫu số liệu: $7, 2, 9, 4, 5, 8, 3$. Trung vị $M_e$ và tứ phân vị thứ nhất $Q_1$ của mẫu lần lượt là:',
          options: ['A. $M_e = 5,\\ Q_1 = 3$', 'B. $M_e = 4,\\ Q_1 = 2$', 'C. $M_e = 5,\\ Q_1 = 4$', 'D. $M_e = 7,\\ Q_1 = 3$'],
          correctIndex: 0,
          explanation: 'Sắp xếp tăng dần: $2, 3, 4, 5, 7, 8, 9$. Số ở giữa là $Q_2 = M_e = 5$. Nửa trái là $2, 3, 4 \\implies Q_1 = 3$.'
        },
        {
          id: 'm106-s2-q2',
          question: 'Mẫu số liệu có $Q_1 = 20, Q_3 = 32$. Giá trị nào sau đây được coi là **giá trị bất thường (ngoại lệ)**?',
          options: ['A. $52$', 'B. $45$', 'C. $10$', 'D. $38$'],
          correctIndex: 0,
          explanation: '$\\Delta_Q = 32 - 20 = 12$. Ngưỡng trên $Q_3 + 1{,}5\\Delta_Q = 32 + 18 = 50$; ngưỡng dưới $20 - 18 = 2$. Vì $52 > 50$ nên $52$ là ngoại lệ.'
        }
      ],
      miniEssay: {
        id: 'm106-s2-e1',
        question: 'Tìm khoảng biến thiên $R$ và khoảng tứ phân vị $\\Delta_Q$ của mẫu số liệu điểm thi: $6, 8, 5, 9, 7, 10, 4, 8$.',
        hint: 'Sắp xếp 8 số theo thứ tự tăng dần. Với $n = 8$, chia đôi thành 4 số đầu để tìm $Q_1$ và 4 số cuối để tìm $Q_3$.',
        rubricChecklist: [
          'Sắp xếp đúng: $4, 5, 6, 7, 8, 8, 9, 10$.',
          'Tính $R = 10 - 4 = 6$; $Q_1 = \\frac{5+6}{2} = 5{,}5$; $Q_3 = \\frac{8+9}{2} = 8{,}5$.',
          'Tính khoảng tứ phân vị $\\Delta_Q = 8{,}5 - 5{,}5 = 3$.'
        ],
        sampleAnswer:
          'Sắp xếp tăng dần: $4, 5, 6, 7, 8, 8, 9, 10$ ($n = 8$). Khoảng biến thiên $R = x_{\\max} - x_{\\min} = 10 - 4 = 6$. Nửa trái gồm $4, 5, 6, 7 \\implies Q_1 = \\frac{5 + 6}{2} = 5{,}5$. Nửa phải gồm $8, 8, 9, 10 \\implies Q_3 = \\frac{8 + 9}{2} = 8{,}5$. Vậy khoảng tứ phân vị $\\Delta_Q = Q_3 - Q_1 = 8{,}5 - 5{,}5 = 3$.'
      }
    },
    {
      stepTitle: '3. Phương sai $s^2$ & Độ lệch chuẩn $s$ (Đo mức độ phân tán)',
      stepType: 'example',
      conceptSection:
        'Hai nhóm học sinh có thể có cùng điểm trung bình $\\overline{x} = 7{,}0$, nhưng một nhóm đều tăm tắp ($6{,}5 - 7{,}5$) còn nhóm kia phân hóa mạnh ($2 - 10$). **Phương sai $s^2$** và **độ lệch chuẩn $s$** đo độ phân tán quanh số trung bình: $s$ càng nhỏ thì số liệu càng đồng đều và ổn định.',
      formulaSection: {
        primaryFormula: 's^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\overline{x})^2 = \\left(\\frac{1}{n}\\sum_{i=1}^{n} x_i^2\\right) - \\overline{x}^2',
        secondaryFormulas: [
          's = \\sqrt{s^2} \\ge 0',
          '\\text{Số liệu càng đồng đều } \\iff s^2 \\text{ và } s \\text{ càng nhỏ}'
        ],
        variablesNote:
          '• **Công thức tính nhanh**: Lấy **trung bình của các bình phương** trừ đi **bình phương của số trung bình** — đỡ sai số khi $\\overline{x}$ là số lẻ thập phân!\n• Độ lệch chuẩn $s$ có cùng đơn vị đo với $x_i$ và $\\overline{x}$ (còn phương sai $s^2$ có đơn vị bình phương).'
      },
      deepDiveSection:
        'Một câu hỏi trắc nghiệm rất hay hỏi về tính chất biến đổi tuyến tính: nếu cộng tất cả số liệu thêm một hằng số $k$ thì số trung bình tăng $k$, nhưng **phương sai và độ lệch chuẩn KHÔNG ĐỔI** (vì khoảng cách giữa các số không đổi!). Nếu nhân tất cả số liệu với $k$, độ lệch chuẩn nhân $|k|$ và phương sai nhân $k^2$.',
      teacherExplanation: 'Phương sai nhỏ nghĩa là dữ liệu tập trung sát nhau (ổn định); phương sai lớn nghĩa là phân tán rộng.',
      keyTakeaway: '$s^2 = \\overline{x^2} - (\\overline{x})^2$ và $s = \\sqrt{s^2}$; giá trị nhỏ hơn chứng tỏ ổn định hơn.',
      miniQuiz: [
        {
          id: 'm106-s3-q1',
          question: 'Tính phương sai của mẫu số liệu: $2, 4, 6, 8$.',
          options: ['A. $5$', 'B. $\\sqrt{5}$', 'C. $20$', 'D. $4$'],
          correctIndex: 0,
          explanation: '$\\overline{x} = 5$. $s^2 = \\frac{(2-5)^2 + (4-5)^2 + (6-5)^2 + (8-5)^2}{4} = \\frac{9 + 1 + 1 + 9}{4} = 5$.'
        },
        {
          id: 'm106-s3-q2',
          question: 'Hai xạ thủ $A, B$ có điểm trung bình bằng nhau đều là $8{,}5$. Độ lệch chuẩn tương ứng là $s_A = 0{,}45$ và $s_B = 1{,}12$. Kết luận nào đúng?',
          options: [
            'A. Xạ thủ $A$ bắn ổn định hơn xạ thủ $B$',
            'B. Xạ thủ $B$ bắn ổn định hơn xạ thủ $A$',
            'C. Hai xạ thủ ổn định ngang nhau',
            'D. Xạ thủ $B$ luôn đạt điểm cao hơn'
          ],
          correctIndex: 0,
          explanation: 'Vì $s_A < s_B$ nên kết quả bắn của xạ thủ $A$ phân tán ít hơn $\\implies$ ổn định hơn.'
        }
      ],
      miniEssay: {
        id: 'm106-s3-e1',
        question: 'Tính số trung bình $\\overline{x}$, phương sai $s^2$ và độ lệch chuẩn $s$ của mẫu số liệu $3, 5, 7, 5, 5$ (làm tròn độ lệch chuẩn đến 2 chữ số thập phân nếu cần).',
        hint: 'Tính $\\overline{x} = 5$, rồi tính $\\frac{1}{5}\\sum(x_i - 5)^2$.',
        rubricChecklist: [
          'Tính đúng $\\overline{x} = \\frac{3+5+7+5+5}{5} = 5$.',
          'Tính đúng $s^2 = \\frac{(-2)^2 + 0 + 2^2 + 0 + 0}{5} = \\frac{8}{5} = 1{,}6$.',
          'Tính đúng $s = \\sqrt{1{,}6} \\approx 1{,}26$.'
        ],
        sampleAnswer:
          'Số trung bình cộng là $\\overline{x} = \\frac{3 + 5 + 7 + 5 + 5}{5} = 5$. Phương sai là $s^2 = \\frac{(3-5)^2 + (5-5)^2 + (7-5)^2 + (5-5)^2 + (5-5)^2}{5} = \\frac{4 + 0 + 4 + 0 + 0}{5} = 1{,}6$. Độ lệch chuẩn là $s = \\sqrt{1{,}6} \\approx 1{,}26$.'
      }
    }
  ]
};
