import { LectureStep } from '../types';

export const MATH_CUSTOM_LECTURE_STEPS_CORE: Record<string, LectureStep[]> = {
  'math-1': [
    {
      stepTitle: '1. Tính đơn điệu & Điều kiện Hàm bậc ba Đơn điệu trên $\\mathbb{R}$',
      stepType: 'concept',
      conceptSection:
        'Hàm số bậc ba $y = ax^3 + bx^2 + cx + d$ ($a \\neq 0$) có đạo hàm là một tam thức bậc hai $y\' = 3ax^2 + 2bx + c$. Tính đồng biến hay nghịch biến của hàm bậc ba phụ thuộc hoàn toàn vào dấu của $y\'$.',
      formulaSection: {
        primaryFormula: 'y\' = 3ax^2 + 2bx + c, \\qquad \\Delta\'_{y\'} = b^2 - 3ac',
        secondaryFormulas: [
          '\\text{Đồng biến trên } \\mathbb{R} \\iff a > 0 \\text{ và } b^2 - 3ac \\le 0',
          '\\text{Nghịch biến trên } \\mathbb{R} \\iff a < 0 \\text{ và } b^2 - 3ac \\le 0'
        ],
        variablesNote:
          '• Lưu ý dấu $\\le 0$ ở điều kiện $\\Delta\'$: tại $b^2 - 3ac = 0$, $y\'$ chỉ bằng $0$ tại **duy nhất 1 điểm hữu hạn**, hàm số vẫn đơn điệu trên toàn $\\mathbb{R}$.\n• Nếu hệ số $a$ chứa tham số $m$, bắt buộc xét riêng trường hợp $a(m) = 0$ trước khi dùng $\\Delta\'$!'
      },
      deepDiveSection:
        'Rất nhiều học sinh mất điểm ở câu chứa tham số $m$ vì quên mất bước kiểm tra $a = 0$ (khi đó hàm suy biến thành bậc hai hoặc bậc nhất) hoặc quên dấu bằng ở điều kiện $\\Delta\' \\le 0$. Ngoài ra, để tìm tham số cho hàm đơn điệu trên đoạn $[\\alpha; \\beta]$ hữu hạn, dùng phương pháp cô lập $m$ đưa về $\\min / \\max$ của $g(x)$ trên $[\\alpha; \\beta]$.',
      teacherExplanation:
        'Nhớ công thức bỏ túi cho tam thức đạo hàm bậc 3: $\\Delta\' = b^2 - 3ac \\le 0$ và hệ số $a$ cùng chiều đơn điệu.',
      keyTakeaway: 'Hàm bậc ba đơn điệu trên $\\mathbb{R}$ khi và chỉ khi $b^2 - 3ac \\le 0$ (kèm xét riêng $a = 0$ nếu có tham số).',
      miniQuiz: [
        {
          id: 'm1-s1-q1',
          question: 'Tìm tất cả giá trị của tham số $m$ để hàm số $y = \\frac{1}{3}x^3 - mx^2 + (m + 2)x - 1$ đồng biến trên $\\mathbb{R}$.',
          options: ['A. $-1 < m < 2$', 'B. $-1 \\le m \\le 2$', 'C. $m \\le -1$ hoặc $m \\ge 2$', 'D. $-2 \\le m \\le 1$'],
          correctIndex: 1,
          explanation: '$y\' = x^2 - 2mx + m + 2 \\ge 0\\ \\forall x \\in \\mathbb{R} \\iff \\Delta\' = m^2 - m - 2 \\le 0 \\iff -1 \\le m \\le 2$.'
        },
        {
          id: 'm1-s1-q2',
          question: 'Cho hàm số $y = -x^3 + 3x^2 - 2$. Hàm số đồng biến trên khoảng nào sau đây?',
          options: ['A. $(-\\infty; 0)$', 'B. $(0; 2)$', 'C. $(2; +\\infty)$', 'D. $(-\\infty; 2)$'],
          correctIndex: 1,
          explanation: '$y\' = -3x^2 + 6x > 0 \\iff x \\in (0; 2)$.'
        }
      ],
      miniEssay: {
        id: 'm1-s1-e1',
        question: 'Tìm điều kiện của tham số $m$ để hàm số $y = \\frac{m}{3}x^3 - mx^2 + (2m - 1)x + 3$ nghịch biến trên toàn trục số $\\mathbb{R}$.',
        hint: 'Xét riêng $m = 0$ (hàm thành $y = -x + 3$), sau đó xét $m \\ne 0$ với $m < 0$ và $\\Delta\' \\le 0$.',
        rubricChecklist: [
          'Xét $m = 0$: $y = -x + 3$ có $y\' = -1 < 0 \\implies m = 0$ THỎA MÃN.',
          'Xét $m \\neq 0$: cần $m < 0$ và $\\Delta\' = m^2 - m(2m - 1) = -m^2 + m \\le 0 \\implies m < 0$. Hợp lại: $m \\le 0$.'
        ],
        sampleAnswer: '• Trường hợp $m = 0$: hàm số trở thành $y = -x + 3$, có $y\' = -1 < 0$ với mọi $x$, nên nghịch biến trên $\\mathbb{R}$ ($m = 0$ nhận).\n• Trường hợp $m \\neq 0$: $y\' = mx^2 - 2mx + (2m - 1) \\le 0\\ \\forall x \\in \\mathbb{R} \\iff \\begin{cases} m < 0 \\\\ \\Delta\' = m^2 - m(2m - 1) = m - m^2 \\le 0 \\end{cases} \\iff m < 0$.\nKết hợp cả hai trường hợp: $m \\le 0$.'
      }
    },
    {
      stepTitle: '2. Cực trị, Tâm đối xứng & Phương trình Đường thẳng qua 2 Cực trị',
      stepType: 'derivation',
      conceptSection:
        'Hàm bậc ba có 2 cực trị (1 cực đại, 1 cực tiểu) khi $y\' = 0$ có hai nghiệm phân biệt ($b^2 - 3ac > 0$), và đồ thị luôn nhận **điểm uốn $I$** (nghiệm của $y\'\' = 0$) làm tâm đối xứng.',
      formulaSection: {
        primaryFormula: 'x_I = -\\frac{b}{3a} = \\frac{x_{CĐ} + x_{CT}}{2}, \\qquad y = \\left(\\frac{2c}{3} - \\frac{2b^2}{9a}\\right)x + d - \\frac{bc}{9a}',
        secondaryFormulas: [
          '\\text{Chia đa thức } y \\text{ cho } y\': y = Q(x)\\cdot y\' + (px + q) \\implies y_{\\text{CĐ, CT}} = px + q'
        ],
        variablesNote:
          '• Nếu $y\'$ có 2 nghiệm lẻ chứa căn, không thay trực tiếp $x$ vào bậc 3 để tính $y$! Hãy **chia $y$ cho $y\'$ lấy phần dư $px + q$**, đó chính là phương trình đường thẳng đi qua hai điểm cực trị.'
      },
      deepDiveSection:
        'Tính chất hình học cực mạnh của hàm bậc ba: Trung điểm của đoạn nối 2 điểm cực trị chính là điểm uốn $I$! Hơn nữa $x_1 + x_2 = -\\frac{2b}{3a}$ và $x_1 x_2 = \\frac{c}{3a}$ theo định lý Vi-ét cho $y\' = 0$ giúp giải nhanh mọi bài toán khoảng cách hay góc tạo bởi 2 điểm cực trị.',
      teacherExplanation:
        'Mọi hàm bậc ba hoặc có **2 cực trị** ($\\Delta\' > 0$), hoặc **0 cực trị** ($\\Delta\' \\le 0$); không bao giờ có đúng 1 cực trị!',
      keyTakeaway: 'Chia $y$ cho $y\'$ lấy dư ra ngay đường thẳng nối hai cực trị; điểm uốn $x_I = -b/(3a)$ là trung điểm của đoạn cực trị.',
      miniQuiz: [
        {
          id: 'm1-s2-q1',
          question: 'Tâm đối xứng (điểm uốn) của đồ thị hàm số $y = x^3 - 6x^2 + 9x - 2$ có tọa độ là:',
          options: ['A. $(2; 0)$', 'B. $(-2; 0)$', 'C. $(1; 2)$', 'D. $(3; -2)$'],
          correctIndex: 0,
          explanation: '$y\'\' = 6x - 12 = 0 \\implies x_I = 2 \\implies y_I = 8 - 24 + 18 - 2 = 0$.'
        },
        {
          id: 'm1-s2-q2',
          question: 'Hàm số $y = x^3 - 3mx^2 + 3x + 1$ có hai điểm cực trị khi và chỉ khi:',
          options: ['A. $-1 < m < 1$', 'B. $m < -1$ hoặc $m > 1$', 'C. $m \\ne \\pm 1$', 'D. $m \\ge 1$'],
          correctIndex: 1,
          explanation: '$y\' = 3x^2 - 6mx + 3 = 0 \\iff x^2 - 2mx + 1 = 0$ có 2 nghiệm phân biệt $\\iff \\Delta\' = m^2 - 1 > 0 \\iff |m| > 1$.'
        }
      ],
      miniEssay: {
        id: 'm1-s2-e1',
        question: 'Viết phương trình đường thẳng đi qua hai điểm cực trị của đồ thị hàm số $y = x^3 - 3x^2 - 9x + 5$ mà không cần thay hoành độ cực trị vào $y$.',
        hint: 'Thực hiện phép chia đa thức $y$ cho $y\' = 3x^2 - 6x - 9$ lấy phần dư bậc nhất.',
        rubricChecklist: [
          'Tính đúng $y\' = 3x^2 - 6x - 9$ và tách $y = (\\frac{1}{3}x - \\frac{1}{3})(3x^2 - 6x - 9) + (-8x + 2)$.',
          'Kết luận tại hai điểm cực trị $y\' = 0$ nên phương trình đường thẳng qua 2 cực trị là $y = -8x + 2$.'
        ],
        sampleAnswer: 'Ta có $y\' = 3x^2 - 6x - 9$. Thực hiện chia đa thức $y$ cho $y\'$: $x^3 - 3x^2 - 9x + 5 = \\left(\\frac{1}{3}x - \\frac{1}{3}\\right)(3x^2 - 6x - 9) - 8x + 2$. Vì tại hai điểm cực trị thì $y\' = 0$, nên tung độ hai điểm cực trị thỏa mãn $y = -8x + 2$. Vậy đường thẳng đi qua hai điểm cực trị là $y = -8x + 2$.'
      }
    },
    {
      stepTitle: '3. Nhận dạng Đồ thị & Tương giao Đường thẳng với Hàm bậc ba',
      stepType: 'example',
      conceptSection:
        'Đọc bảng biến thiên và đồ thị hàm bậc ba chỉ mất 5 giây theo thứ tự: (1) Nhìn **nhánh cuối bên phải** xác định dấu của $a$; (2) Nhìn **giao trục tung** ($x = 0$) xác định dấu của $d$; (3) Xét dấu tổng & tích hoành độ cực trị xác định dấu của $b, c$.',
      formulaSection: {
        primaryFormula: 'x_1 + x_2 = -\\frac{2b}{3a}, \\qquad x_1 x_2 = \\frac{c}{3a}',
        secondaryFormulas: [
          '\\text{3 nghiệm phân biệt} \\iff y_{CĐ}\\cdot y_{CT} < 0 \\quad (\\text{khi cắt trục } Ox)'
        ],
        variablesNote:
          '• **Nhánh cuối đi lên** $\\implies a > 0$; **nhánh cuối đi xuống** $\\implies a < 0$.\n• Giao với $Ox$ tại **3 điểm phân biệt** $\\iff$ phương trình hoành độ giao điểm có 3 nghiệm phân biệt (đường thẳng cắt $y = f(x)$ nằm chặt giữa $y_{CT}$ và $y_{CĐ}$).'
      },
      deepDiveSection:
        'Mẹo đọc dấu hệ số $a, b, c, d$ trên đề thi trắc nghiệm cực chuẩn: Nếu cực đại ở bên trái $Oy$ và cực tiểu ở bên phải $Oy$ ($x_1 x_2 < 0$), thì $c$ và $a$ **trái dấu** ($c/3a < 0$). Nếu cả 2 cực trị nằm bên phải $Oy$ ($x_1 + x_2 > 0$ và $x_1 x_2 > 0$), thì $b$ **trái dấu** $a$ và $c$ **cùng dấu** $a$.',
      teacherExplanation:
        'Tìm điều kiện để phương trình $ax^3 + bx^2 + cx + d = m$ có 3 nghiệm phân biệt: chỉ cần kẻ đường ngang $y = m$ nằm giữa $y_{CT} < m < y_{CĐ}$!',
      keyTakeaway: 'Nhánh phải xác định dấu $a$; giao $Oy$ xác định $d$; Vi-ét cho $y\' = 0$ xác định dấu $b$ và $c$.',
      miniQuiz: [
        {
          id: 'm1-s3-q1',
          question: 'Đồ thị hàm số $y = x^3 - 3x + 1$ cắt đường thẳng $y = m$ tại 3 điểm phân biệt khi và chỉ khi:',
          options: ['A. $-1 \\le m \\le 3$', 'B. $-1 < m < 3$', 'C. $m < -1$ hoặc $m > 3$', 'D. $-3 < m < 1$'],
          correctIndex: 1,
          explanation: '$y\' = 3x^2 - 3 = 0 \\iff x = \\pm 1$. Giá trị cực trị $y_{CĐ} = y(-1) = 3$, $y_{CT} = y(1) = -1$. Để có 3 giao điểm: $-1 < m < 3$.'
        },
        {
          id: 'm1-s3-q2',
          question: 'Một đồ thị hàm bậc ba $y = ax^3 + bx^2 + cx + d$ có nhánh phải đi xuống, cắt $Oy$ ở phía trên $Ox$, và cả hai điểm cực trị đều có hoành độ dương. Kết luận đúng là:',
          options: [
            'A. $a < 0, d > 0, b > 0, c < 0$',
            'B. $a < 0, d > 0, b < 0, c < 0$',
            'C. $a > 0, d > 0, b < 0, c > 0$',
            'D. $a < 0, d < 0, b > 0, c > 0$'
          ],
          correctIndex: 0,
          explanation: 'Nhánh phải đi xuống $\\implies a < 0$; cắt $Oy$ phía trên $\\implies d > 0$; $x_1+x_2 = -2b/(3a) > 0 \\implies b > 0$; $x_1 x_2 = c/(3a) > 0 \\implies c < 0$.'
        }
      ],
      miniEssay: {
        id: 'm1-s3-e1',
        question: 'Tìm $m$ để phương trình $x^3 - 3x^2 - m = 0$ có đúng 2 nghiệm phân biệt (hoặc 3 nghiệm với 1 nghiệm kép).',
        hint: 'Cô lập $m = x^3 - 3x^2$ rồi dùng giá trị cực đại, cực tiểu của $f(x) = x^3 - 3x^2$.',
        rubricChecklist: [
          'Đưa về giao điểm của $y = x^3 - 3x^2$ và đường thẳng $y = m$.',
          'Tính $y\' = 3x^2 - 6x = 0 \\implies x = 0\\ (y_{CĐ} = 0)$ và $x = 2\\ (y_{CT} = -4)$. Có 2 nghiệm $\\iff m = 0$ hoặc $m = -4$.'
        ],
        sampleAnswer: 'Đưa phương trình về $x^3 - 3x^2 = m$. Xét $f(x) = x^3 - 3x^2$ có $f\'(x) = 3x^2 - 6x = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$. Ta có $f_{CĐ} = f(0) = 0$ và $f_{CT} = f(2) = -4$. Đường thẳng $y = m$ cắt đồ thị $(C)$ tại đúng 2 điểm phân biệt khi tiếp xúc với một điểm cực trị: $m = 0$ hoặc $m = -4$.'
      }
    }
  ],
  'math-2': [
    {
      stepTitle: '1. Tính đơn điệu Đặc thù & Đường Tiệm cận của Hàm Phân thức',
      stepType: 'concept',
      conceptSection:
        'Hàm phân thức hữu tỉ bậc nhất trên bậc nhất $y = \\frac{ax + b}{cx + d}$ ($c \\neq 0, ad - bc \\neq 0$) là hàm đặc biệt **không bao giờ có cực trị**: nó hoặc đồng biến trên từng khoảng xác định, hoặc nghịch biến trên từng khoảng xác định.',
      formulaSection: {
        primaryFormula: 'y\' = \\frac{ad - bc}{(cx + d)^2}, \\qquad \\text{TCĐ: } x = -\\frac{d}{c}, \\qquad \\text{TCN: } y = \\frac{a}{c}',
        secondaryFormulas: [
          '\\text{Tâm đối xứng } I\\left(-\\frac{d}{c};\\, \\frac{a}{c}\\right)',
          '\\text{Đồng biến trên từng khoảng} \\iff ad - bc > 0'
        ],
        variablesNote:
          '• **Cảnh giác cực lớn**: KHÔNG BAO GIỜ viết "hàm phân thức đồng biến trên $\\mathbb{R} \\setminus \\{-d/c\\}$" hay "$D_1 \\cup D_2$" — bắt buộc phải viết "**trên từng khoảng** $(-\\infty; -d/c)$ và $(-d/c; +\\infty)$"!\n• Để hàm đồng biến trên một khoảng con $(p; q)$, phải thỏa **2 điều kiện**: $ad - bc > 0$ VÀ nghiệm mẫu $-d/c \\notin (p; q)$.'
      },
      deepDiveSection:
        'Hai đường tiệm cận vuông góc với nhau và giao nhau tại tâm đối xứng $I(-d/c; a/c)$. Đồ thị luôn gồm hai nhánh hypebol nằm đối xứng qua $I$, không bao giờ cắt hai đường tiệm cận của chính nó.',
      teacherExplanation:
        'Khi tìm $m$ để hàm phân thức đồng biến trên $(1; +\\infty)$, rất nhiều bạn quên điều kiện $-d/c \\notin (1; +\\infty)$ (tức $-d/c \\le 1$) nên bị sai đáp án!',
      keyTakeaway: 'Đơn điệu trên khoảng $(p; q)$ đòi hỏi đồng thời $ad - bc$ đúng dấu VÀ điểm gián đoạn $-d/c \\notin (p; q)$.',
      miniQuiz: [
        {
          id: 'm2-s1-q1',
          question: 'Giao điểm của tiệm cận đứng và tiệm cận ngang của đồ thị hàm số $y = \\frac{2x - 1}{x + 3}$ có tọa độ là:',
          options: ['A. $(-3; 2)$', 'B. $(3; 2)$', 'C. $(-3; -1)$', 'D. $(2; -3)$'],
          correctIndex: 0,
          explanation: 'TCĐ: $x = -3$; TCN: $y = 2/1 = 2 \\implies I(-3; 2)$.'
        },
        {
          id: 'm2-s1-q2',
          question: 'Tìm tất cả giá trị $m$ để hàm số $y = \\frac{mx - 4}{x - m}$ đồng biến trên khoảng $(1; +\\infty)$.',
          options: ['A. $-2 < m < 2$', 'B. $-2 < m \\le 1$', 'C. $m < -2$ hoặc $m > 2$', 'D. $-2 \\le m \\le 1$'],
          correctIndex: 1,
          explanation: '$y\' = \\frac{-m^2 + 4}{(x - m)^2} > 0 \\iff -2 < m < 2$. Kết hợp tiệm cận đứng $x = m \\notin (1; +\\infty) \\iff m \\le 1$, suy ra $-2 < m \\le 1$.'
        }
      ],
      miniEssay: {
        id: 'm2-s1-e1',
        question: 'Tìm $m$ để hàm số $y = \\frac{mx + 4}{x + m}$ nghịch biến trên khoảng $(-\\infty; 1)$.',
        hint: 'Giải hệ $ad - bc = m^2 - 4 < 0$ VÀ tiệm cận đứng $x = -m \\notin (-\\infty; 1)$ (tức $-m \\ge 1$).',
        rubricChecklist: [
          'Tính $y\' = \\frac{m^2 - 4}{(x+m)^2} < 0 \\implies -2 < m < 2$.',
          'Điều kiện xác định trên $(-\\infty; 1)$: $-m \\ge 1 \\iff m \\le -1$. Giao lại: $-2 < m \\le -1$.'
        ],
        sampleAnswer: 'Tập xác định $D = \\mathbb{R} \\setminus \\{-m\\}$. Đạo hàm $y\' = \\frac{m^2 - 4}{(x + m)^2}$. Để hàm nghịch biến trên $(-\\infty; 1)$ cần: $\\begin{cases} m^2 - 4 < 0 \\\\ -m \\notin (-\\infty; 1) \\end{cases} \\iff \\begin{cases} -2 < m < 2 \\\\ -m \\ge 1 \\end{cases} \\iff -2 < m \\le -1$.'
      }
    },
    {
      stepTitle: '2. Tiếp tuyến & Tam giác Tiệm cận Bất biến',
      stepType: 'derivation',
      conceptSection:
        'Đồ thị hàm $y = \\frac{ax+b}{cx+d}$ có một tính chất hình học tuyệt đẹp: mọi tiếp tuyến tại điểm $M$ bất kỳ trên đồ thị khi cắt hai đường tiệm cận tại $A, B$ đều tạo thành tam giác $\\triangle IAB$ có **diện tích không đổi**!',
      formulaSection: {
        primaryFormula: 'S_{\\triangle IAB} = \\frac{2|ad - bc|}{c^2} = \\text{const}',
        secondaryFormulas: [
          'M \\text{ là trung điểm của } AB, \\qquad IA\\cdot IB = \\text{const}',
          '\\text{Chu vi } \\triangle IAB \\text{ nhỏ nhất} \\iff \\triangle IAB \\text{ vuông cân tại } I'
        ],
        variablesNote:
          '• Nếu đặt $c = 1$ (chia cả tử mẫu cho $c$), $S_{\\triangle IAB} = 2|ad - bc|$.\n• Điểm $M$ có tổng khoảng cách tới hai tiệm cận nhỏ nhất chính là điểm mà tại đó $|x_M + d/c| = \\sqrt{|ad - bc|}/|c|$ (ứng với tam giác tiếp tuyến vuông cân).'
      },
      deepDiveSection:
        'Các bài toán tìm điểm $M$ trên $(C)$ có tọa độ nguyên (cả $x, y \\in \\mathbb{Z}$): chia tử cho mẫu để tách phần nguyên $y = \\frac{a}{c} + \\frac{k}{cx + d}$, rồi cho $cx + d$ là ước nguyên của $k$.',
      teacherExplanation:
        'Diện tích tam giác tạo bởi tiếp tuyến và 2 tiệm cận là hằng số không phụ thuộc vào vị trí tiếp điểm $M$!',
      keyTakeaway: 'Tiếp điểm $M$ luôn là trung điểm đoạn $AB$ cắt 2 tiệm cận; diện tích $\\triangle IAB$ luôn cố định.',
      miniQuiz: [
        {
          id: 'm2-s2-q1',
          question: 'Tiếp tuyến tại điểm $M$ bất kỳ của đồ thị $(C): y = \\frac{2x + 1}{x - 1}$ cắt tiệm cận đứng và tiệm cận ngang tại $A$ và $B$. Diện tích $\\triangle IAB$ (với $I$ là giao hai tiệm cận) bằng:',
          options: ['A. $3$', 'B. $6$', 'C. $1{,}5$', 'D. $12$'],
          correctIndex: 1,
          explanation: '$|ad - bc| = |2(-1) - 1\\cdot 1| = 3$, $c = 1 \\implies S_{\\triangle IAB} = \\frac{2\\cdot 3}{1^2} = 6$.'
        },
        {
          id: 'm2-s2-q2',
          question: 'Đồ thị hàm số $y = \\frac{x + 3}{x - 1}$ có bao nhiêu điểm có tọa độ nguyên (cả $x$ và $y$ đều là số nguyên)?',
          options: ['A. 4 điểm', 'B. 6 điểm', 'C. 8 điểm', 'D. 3 điểm'],
          correctIndex: 1,
          explanation: '$y = 1 + \\frac{4}{x - 1} \\in \\mathbb{Z} \\iff x - 1 \\in \\{\\pm 1, \\pm 2, \\pm 4\\}$ (6 giá trị nguyên).'
        }
      ],
      miniEssay: {
        id: 'm2-s2-e1',
        question: 'Tìm tọa độ các điểm $M$ thuộc đồ thị $(C): y = \\frac{2x - 1}{x + 1}$ sao cho tổng khoảng cách từ $M$ đến hai đường tiệm cận của $(C)$ đạt giá trị nhỏ nhất.',
        hint: 'Khoảng cách từ $M(x_0; y_0)$ tới TCĐ ($x = -1$) và TCN ($y = 2$) là $d_1 + d_2 = |x_0 + 1| + |y_0 - 2| = |x_0 + 1| + \\frac{3}{|x_0 + 1|}$. Dùng BĐT Cô-si!',
        rubricChecklist: [
          'Viết $y = 2 - \\frac{3}{x + 1} \\implies d_1 + d_2 = |x_0 + 1| + \\frac{3}{|x_0 + 1|}$.',
          'Áp dụng Cô-si: $d_1 + d_2 \\ge 2\\sqrt{3}$, dấu bằng khi $|x_0 + 1| = \\sqrt{3} \\implies M(-1 + \\sqrt{3}; 2 - \\sqrt{3})$ và $M(-1 - \\sqrt{3}; 2 + \\sqrt{3})$.'
        ],
        sampleAnswer: 'Đồ thị có TCĐ $x + 1 = 0$ và TCN $y - 2 = 0$. Ta tách $y = 2 - \\frac{3}{x + 1}$. Với $M(x_0; y_0) \\in (C)$, tổng khoảng cách tới hai tiệm cận là $S = |x_0 + 1| + |y_0 - 2| = |x_0 + 1| + \\frac{3}{|x_0 + 1|} \\ge 2\\sqrt{3}$ (theo Cô-si). Dấu bằng xảy ra khi $(x_0 + 1)^2 = 3 \\Leftrightarrow x_0 = -1 \\pm \\sqrt{3}$, tìm được 2 điểm $M_1(-1 + \\sqrt{3};\\, 2 - \\sqrt{3})$ và $M_2(-1 - \\sqrt{3};\\, 2 + \\sqrt{3})$.'
      }
    },
    {
      stepTitle: '3. Tương giao Đường thẳng & Biện luận Hai nhánh Đồ thị',
      stepType: 'example',
      conceptSection:
        'Giao điểm của $(C): y = \\frac{ax+b}{cx+d}$ với đường thẳng $d: y = kx + m$ quy về phương trình bậc hai (có điều kiện nghiệm khác $-d/c$). Khi hai giao điểm cùng thuộc một nhánh hoặc nằm ở hai nhánh đối xứng qua $I$, ta dùng dấu của $(x_A + d/c)(x_B + d/c)$.',
      formulaSection: {
        primaryFormula: '\\text{Hai nhánh khác nhau} \\iff \\left(x_A + \\frac{d}{c}\\right)\\left(x_B + \\frac{d}{c}\\right) < 0',
        secondaryFormulas: [
          'AB = \\sqrt{(1 + k^2)\\left[(x_A + x_B)^2 - 4x_A x_B\\right]}'
        ],
        variablesNote:
          '• Hai điểm $A, B$ nằm trên **hai nhánh phân biệt** khi và chỉ khi hoành độ tiệm cận đứng $-d/c$ nằm lọt giữa $x_A$ và $x_B$.\n• Khi ghép với đường thẳng $y = kx + m$, chỉ cần điều kiện $c(-d/c)^2\\dots$ kiểm tra $x = -d/c$ không phải là nghiệm của phương trình bậc hai sau quy đồng.'
      },
      deepDiveSection:
        'Dấu hiệu hình học cực nhanh: Nếu đồ thị có $y\' > 0$ (đồng biến từng khoảng), mọi đường thẳng có hệ số góc $k \\le 0$ chắc chắn cắt $(C)$ tại 2 điểm nằm trên 2 nhánh; còn đường thẳng $k > 0$ có thể không cắt, tiếp xúc, hoặc cắt tại 2 điểm cùng thuộc 1 nhánh.',
      teacherExplanation:
        'Luôn thay thử $x = -d/c$ vào phương trình bậc hai sau khi nhân chéo để chắc chắn nó không làm mất nghĩa mẫu số!',
      keyTakeaway: 'Đặt $t = x + d/c$ hoặc dùng $(x_A + d/c)(x_B + d/c) < 0$ để xử lý điều kiện cắt tại 2 nhánh.',
      miniQuiz: [
        {
          id: 'm2-s3-q1',
          question: 'Đường thẳng $d: y = x + m$ luôn cắt đồ thị $(C): y = \\frac{2x - 1}{x - 1}$ tại 2 điểm phân biệt A, B:',
          options: [
            'A. Chỉ khi $m > 2$',
            'B. Với mọi $m \\in \\mathbb{R}$, và A, B thuộc hai nhánh khác nhau',
            'C. Chỉ khi $m < 0$',
            'D. Với mọi $m \\ne 1$'
          ],
          correctIndex: 1,
          explanation: 'Vì $(C)$ nghịch biến trên từng khoảng còn $d$ đồng biến ($k = 1 > 0$), hai đồ thị luôn cắt nhau tại 2 điểm trên 2 nhánh: $(x-1)(x+m) = 2x-1 \\iff x^2 + (m-3)x - m + 1 = 0$ có $\\Delta = (m-3)^2 + 4m - 4 = (m-1)^2 + 4 > 0\\ \\forall m$.'
        },
        {
          id: 'm2-s3-q2',
          question: 'Khoảng cách giữa hai giao điểm của đường thẳng $y = x + 1$ với đồ thị $y = \\frac{2x + 1}{x - 1}$ bằng:',
          options: ['A. $2\\sqrt{6}$', 'B. $\\sqrt{13}$', 'C. $\\sqrt{26}$', 'D. $4$'],
          correctIndex: 0,
          explanation: 'PT hoành độ: $(x+1)(x-1) = 2x+1 \\iff x^2 - 2x - 2 = 0 \\implies x_1 + x_2 = 2,\\ x_1 x_2 = -2$. Vậy $(x_1 - x_2)^2 = 4 + 8 = 12$, nên $AB = \\sqrt{(1 + 1^2)\\cdot 12} = \\sqrt{24} = 2\\sqrt{6}$.'
        }
      ],
      miniEssay: {
        id: 'm2-s3-e1',
        question: 'Tìm tất cả giá trị $m$ để đường thẳng $d: y = 2x + m$ cắt đồ thị $(C): y = \\frac{x + 3}{x + 1}$ tại hai điểm phân biệt A, B có độ dài đoạn $AB = \\sqrt{5}$? (Hoặc tìm $m$ để $AB$ ngắn nhất).',
        hint: 'Đặt phương trình hoành độ giao điểm $(2x+m)(x+1) = x+3 \\iff 2x^2 + (m+1)x + (m-3) = 0$, kiểm tra $\\Delta > 0$, $x \\ne -1$, rồi dùng công thức $AB^2 = (1 + k^2)[(x_A + x_B)^2 - 4x_A x_B]$.',
        rubricChecklist: [
          'Lập đúng PT bậc 2: $2x^2 + (m+1)x + m - 3 = 0$ (thay $x=-1$ vào được $2 - m - 1 + m - 3 = -2 \\neq 0$, luôn thỏa!).',
          'Tính $\\Delta = (m+1)^2 - 8(m-3) = m^2 - 6m + 25 > 0\\ \\forall m$. Tối thiểu hóa $AB^2 = 5\\cdot \\frac{\\Delta}{4}$ đạt min khi $m = 3$ ($AB_{\\min} = 2\\sqrt{5}$).'
        ],
        sampleAnswer: 'Phương trình hoành độ giao điểm ($x \\neq -1$): $(2x + m)(x + 1) = x + 3 \\Leftrightarrow 2x^2 + (m + 1)x + m - 3 = 0$. Thay $x = -1$ vào vế trái được $-2 \\neq 0$, hơn nữa $\\Delta = (m+1)^2 - 8(m-3) = (m-3)^2 + 16 > 0\\ \\forall m$, nên $d$ luôn cắt $(C)$ tại 2 điểm phân biệt. Áp dụng công thức khoảng cách với $k = 2$: $AB^2 = (1 + 2^2)(x_A - x_B)^2 = 5\\cdot\\frac{\\Delta}{a^2} = \\frac{5[(m-3)^2 + 16]}{4} \\ge 20$. Vậy độ dài $AB$ nhỏ nhất bằng $2\\sqrt{5}$ khi $m = 3$.'
      }
    }
  ]
};
