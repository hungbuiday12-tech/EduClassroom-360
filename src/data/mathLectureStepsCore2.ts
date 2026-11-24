import { LectureStep } from '../types';

export const MATH_CUSTOM_LECTURE_STEPS_CORE2: Record<string, LectureStep[]> = {
  'math-3': [
    {
      stepTitle: '1. Cực trị Hàm Trùng phương $y = ax^4 + bx^2 + c$',
      stepType: 'concept',
      conceptSection:
        'Hàm số trùng phương bậc bốn $y = ax^4 + bx^2 + c$ ($a \\neq 0$) luôn là **hàm số chẵn**, nhận trục tung $Oy$ làm trục đối xứng. Số lượng điểm cực trị của đồ thị chỉ có thể là **1** hoặc **3**.',
      formulaSection: {
        primaryFormula: 'y\' = 4ax^3 + 2bx = 2x(2ax^2 + b) = 0 \\iff x = 0 \\text{ hoặc } x^2 = -\\frac{b}{2a}',
        secondaryFormulas: [
          '\\text{3 điểm cực trị} \\iff a\\cdot b < 0',
          '\\text{Đúng 1 điểm cực trị} \\iff a\\cdot b \\ge 0'
        ],
        variablesNote:
          '• Khi $a\\cdot b < 0$: đồ thị có dạng chữ **W** ($a > 0$: 1 cực đại ở $x = 0$ và 2 cực tiểu) hoặc chữ **M** ($a < 0$: 1 cực tiểu ở $x = 0$ và 2 cực đại).\n• Khi hệ số $a$ chứa tham số $m$, nhớ xét riêng $a = 0$ (hàm suy biến thành parabol bậc hai hoặc hằng số)!'
      },
      deepDiveSection:
        'Do tính đối xứng qua trục $Oy$, hai điểm cực trị bên trái và bên phải $B, C$ luôn có **cùng tung độ** ($y_B = y_C = c - \\frac{b^2}{4a}$) và hoành độ đối nhau ($x_{B,C} = \\pm\\sqrt{-\\frac{b}{2a}}$), tạo với điểm cực trị $A(0; c)$ một **tam giác cân tại A**!',
      teacherExplanation:
        'Nhẩm trong 1 giây: $a\\cdot b$ âm $\\implies$ 3 cực trị; $a\\cdot b$ không âm $\\implies$ 1 cực trị!',
      keyTakeaway: 'Hàm trùng phương có 3 cực trị $\\iff a\\cdot b < 0$; chỉ 1 cực trị $\\iff a\\cdot b \\ge 0$.',
      miniQuiz: [
        {
          id: 'm3-s1-q1',
          question: 'Tìm $m$ để hàm số $y = x^4 - 2(m - 1)x^2 + m$ có đúng 3 điểm cực trị.',
          options: ['A. $m < 1$', 'B. $m > 1$', 'C. $m \\ge 1$', 'D. $m \\ne 1$'],
          correctIndex: 1,
          explanation: '$a = 1 > 0$, nên có 3 cực trị $\\iff b < 0 \\iff -2(m - 1) < 0 \\iff m > 1$.'
        },
        {
          id: 'm3-s1-q2',
          question: 'Hàm số $y = -x^4 + 2x^2 + 3$ có số điểm cực đại và số điểm cực tiểu lần lượt là:',
          options: [
            'A. 2 cực đại, 1 cực tiểu',
            'B. 1 cực đại, 2 cực tiểu',
            'C. 1 cực đại, 0 cực tiểu',
            'D. 0 cực đại, 1 cực tiểu'
          ],
          correctIndex: 0,
          explanation: 'Vì $a = -1 < 0$ và $b = 2 > 0$ ($a\\cdot b < 0$), đồ thị hình chữ M nên có 2 cực đại và 1 cực tiểu.'
        }
      ],
      miniEssay: {
        id: 'm3-s1-e1',
        question: 'Tìm tất cả các giá trị tham số $m$ để hàm số $y = mx^4 + (m - 1)x^2 + 2$ có đúng một điểm cực trị.',
        hint: 'Xét trường hợp $m = 0$ (thành parabol $y = -x^2 + 2$ có 1 cực trị) và $m \\ne 0$ với $a\\cdot b \\ge 0$.',
        rubricChecklist: [
          'Xét $m = 0 \\implies y = -x^2 + 2$ là parabol có 1 cực đại ($m = 0$ nhận).',
          'Xét $m \\neq 0$: điều kiện 1 cực trị là $m(m - 1) \\ge 0 \\iff m < 0$ hoặc $m \\ge 1$. Tổng hợp: $m \\le 0$ hoặc $m \\ge 1$.'
        ],
        sampleAnswer: '• Với $m = 0$: $y = -x^2 + 2$ là hàm bậc hai có đồ thị parabol đỉnh $(0; 2)$, có đúng 1 điểm cực trị ($m = 0$ thỏa mãn).\n• Với $m \\neq 0$: hàm trùng phương có đúng 1 cực trị $\\iff a\\cdot b \\ge 0 \\iff m(m - 1) \\ge 0 \\iff m < 0$ hoặc $m \\ge 1$.\nKết hợp cả hai trường hợp: $m \\in (-\\infty; 0] \\cup [1; +\\infty)$.'
      }
    },
    {
      stepTitle: '2. Công thức Giải nhanh Hình học Tam giác Cực trị $\\triangle ABC$',
      stepType: 'derivation',
      conceptSection:
        'Khi $a\\cdot b < 0$, ba điểm cực trị $A(0; c)$, $B\\left(-\\sqrt{-\\frac{b}{2a}};\\, c - \\frac{b^2}{4a}\\right)$, $C\\left(\\sqrt{-\\frac{b}{2a}};\\, c - \\frac{b^2}{4a}\\right)$ tạo thành tam giác cân tại $A$ với bộ công thức tính nhanh mọi tính chất góc, diện tích và bán kính ngoại tiếp.',
      formulaSection: {
        primaryFormula: '\\cos \\widehat{BAC} = \\frac{b^3 + 8a}{b^3 - 8a}, \\qquad S_{\\triangle ABC} = \\sqrt{-\\frac{b^5}{32a^3}}',
        secondaryFormulas: [
          '\\triangle ABC \\text{ vuông cân tại } A \\iff b^3 + 8a = 0',
          '\\triangle ABC \\text{ đều} \\iff b^3 + 24a = 0',
          '\\triangle ABC \\text{ có diện tích } S_0 \\iff b^5 + 32a^3 S_0^2 = 0'
        ],
        variablesNote:
          '• Thực chất rất dễ tự suy ra từ hình học tọa độ: gọi $H$ là trung điểm $BC$, ta có $AH = \\frac{b^2}{4|a|}$ và nửa đáy $HB = \\sqrt{-\\frac{b}{2a}}$.\n• Tam giác vuông cân khi $AH = HB$; tam giác đều khi $AH = \\sqrt{3}\\,HB$!'
      },
      deepDiveSection:
        'Việc nắm chắc bản chất $AH = \\frac{b^2}{4|a|}$ và $HB = \\sqrt{-\\frac{b}{2a}}$ giúp giải mọi biến thể đề thi (như trọng tâm $G$, trực tâm $H$ trùng gốc tọa độ $O$, bán kính đường tròn ngoại tiếp $R = \\frac{AB^2}{2\\cdot AH}$) mà không cần học vẹt công thức.',
      teacherExplanation:
        'Nhớ cặp số vàng $8a$ và $24a$: $b^3 + 8a = 0 \\implies$ vuông cân; $b^3 + 24a = 0 \\implies$ tam giác đều!',
      keyTakeaway: 'Tam giác cực trị trùng phương luôn cân tại A; vuông cân khi $b^3 = -8a$, đều khi $b^3 = -24a$.',
      miniQuiz: [
        {
          id: 'm3-s2-q1',
          question: 'Tìm giá trị thực của $m$ để đồ thị hàm số $y = x^4 - 2mx^2 + 1$ có ba điểm cực trị tạo thành một tam giác vuông cân.',
          options: ['A. $m = 1$', 'B. $m = -1$', 'C. $m = 2$', 'D. $m = \\sqrt[3]{3}$'],
          correctIndex: 0,
          explanation: 'Điều kiện 3 cực trị: $m > 0$. Vuông cân $\\iff b^3 + 8a = (-2m)^3 + 8\\cdot 1 = 0 \\iff m^3 = 1 \\iff m = 1$.'
        },
        {
          id: 'm3-s2-q2',
          question: 'Đồ thị hàm số $y = x^4 - 2x^2 + 3$ có ba điểm cực trị tạo thành tam giác có diện tích bằng:',
          options: ['A. $1$', 'B. $2$', 'C. $4$', 'D. $1/2$'],
          correctIndex: 0,
          explanation: '3 cực trị là $A(0; 3), B(-1; 2), C(1; 2) \\implies AH = 1,\\ BC = 2 \\implies S = \\frac{1}{2}\\cdot 1\\cdot 2 = 1$.'
        }
      ],
      miniEssay: {
        id: 'm3-s2-e1',
        question: 'Tìm $m$ để ba điểm cực trị của đồ thị hàm số $y = x^4 - 2mx^2 + m - 1$ tạo thành một tam giác đều.',
        hint: 'Điều kiện $m > 0$, sau đó áp dụng $AH = \\sqrt{3}\\,HB$ hoặc $b^3 + 24a = 0$.',
        rubricChecklist: [
          'Đặt điều kiện có 3 cực trị $a\\cdot b < 0 \\iff -2m < 0 \\iff m > 0$.',
          'Từ $b^3 + 24a = 0 \\implies (-2m)^3 + 24(1) = 0 \\implies 8m^3 = 24 \\implies m = \\sqrt[3]{3}$ (thỏa $m > 0$).'
        ],
        sampleAnswer: 'Điều kiện có 3 điểm cực trị là $a\\cdot b < 0 \\Leftrightarrow -2m < 0 \\Leftrightarrow m > 0$. Khi đó 3 cực trị là $A(0; m - 1)$ và $B(-\\sqrt{m}; -m^2 + m - 1),\\ C(\\sqrt{m}; -m^2 + m - 1)$. Trung điểm $BC$ là $H(0; -m^2 + m - 1)$, ta có $AH = m^2$ và $HB = \\sqrt{m}$. Để $\\triangle ABC$ đều thì $AH = \\sqrt{3}\\,HB \\Leftrightarrow m^2 = \\sqrt{3m} \\Leftrightarrow m^3 = 3 \\Leftrightarrow m = \\sqrt[3]{3}$ (nhận).'
      }
    },
    {
      stepTitle: '3. Tương giao Hàm Trùng phương & Phương trình 4 nghiệm Cách đều',
      stepType: 'example',
      conceptSection:
        'Giao điểm đồ thị hàm trùng phương với đường thẳng nằm ngang $y = k$ có thể cho từ $0$ đến tối đa $4$ nghiệm phân biệt (luôn có tính chất đối xứng cặp $\\pm x_1, \\pm x_2$).',
      formulaSection: {
        primaryFormula: 'ax^4 + bx^2 + c = k \\quad \\xrightarrow{t = x^2 \\ge 0} \\quad at^2 + bt + (c - k) = 0',
        secondaryFormulas: [
          '\\text{4 nghiệm lập thành cấp số cộng} \\iff x_2 = 3x_1 \\iff t_2 = 9 t_1'
        ],
        variablesNote:
          '• 4 nghiệm đối xứng có thứ tự tăng dần là $-x_2 < -x_1 < x_1 < x_2$.\n• Để 4 nghiệm lập thành **cấp số cộng**, khoảng cách đều bắt buộc $x_1 - (-x_1) = x_2 - x_1 \\iff 2x_1 = x_2 - x_1 \\iff x_2 = 3x_1 \\iff t_2 = 9t_1$!'
      },
      deepDiveSection:
        'Nhờ quy về Vi-ét cho bậc hai theo $t = x^2$ với điều kiện $t_2 = 9t_1$: ta có $t_1 + 9t_1 = 10t_1 = -b/a$ và $t_1\\cdot 9t_1 = 9t_1^2 = (c - k)/a$, khử $t_1$ ra ngay hệ thức $9b^2 = 100a(c - k)$ cực kỳ nhanh gọn!',
      teacherExplanation:
        'Ghi nhớ tỉ lệ vàng $t_2 = 9t_1$ (tức $x_2 = 3x_1$) cho bài toán 4 nghiệm lập thành cấp số cộng!',
      keyTakeaway: 'Đặt $t = x^2 \\ge 0$; 4 nghiệm phân biệt tạo cấp số cộng khi và chỉ khi $0 < t_1 < t_2$ và $t_2 = 9t_1$.',
      miniQuiz: [
        {
          id: 'm3-s3-q1',
          question: 'Số nghiệm của phương trình $x^4 - 4x^2 + 1 = m$ là 4 nghiệm phân biệt khi và chỉ khi:',
          options: ['A. $-3 < m < 1$', 'B. $-3 \\le m \\le 1$', 'C. $m > -3$', 'D. $m < 1$'],
          correctIndex: 0,
          explanation: 'Hàm $y = x^4 - 4x^2 + 1$ có $y_{\\text{CĐ}} = 1$ (tại $x=0$) và $y_{\\text{CT}} = -3$ (tại $x=\\pm\\sqrt{2}$), nên có 4 nghiệm $\\iff -3 < m < 1$.'
        },
        {
          id: 'm3-s3-q2',
          question: 'Tìm $m$ để phương trình $x^4 - 10x^2 + m = 0$ có 4 nghiệm phân biệt lập thành một cấp số cộng.',
          options: ['A. $m = 9$', 'B. $m = 25$', 'C. $m = 16$', 'D. $m = 10$'],
          correctIndex: 0,
          explanation: 'Đặt $t = x^2 > 0$: $t^2 - 10t + m = 0$. Để $t_2 = 9t_1$ và $t_1 + t_2 = 10 \\implies t_1 = 1, t_2 = 9 \\implies m = t_1 t_2 = 9$.'
        }
      ],
      miniEssay: {
        id: 'm3-s3-e1',
        question: 'Tìm $m$ để đường thẳng $y = m$ cắt đồ thị hàm số $y = x^4 - 5x^2 + 4$ tại 4 điểm phân biệt có hoành độ lập thành một cấp số cộng.',
        hint: 'Giải $x^4 - 5x^2 + (4 - m) = 0$ theo ẩn $t = x^2 > 0$ với điều kiện $t_2 = 9t_1$.',
        rubricChecklist: [
          'Đưa về $t^2 - 5t + 4 - m = 0$ cần có 2 nghiệm dương $0 < t_1 < t_2$.',
          'Giải hệ $t_1 + t_2 = 5$ và $t_2 = 9t_1 \\implies t_1 = 0{,}5,\\ t_2 = 4{,}5 \\implies 4 - m = t_1 t_2 = 2{,}25 \\implies m = 1{,}75 = \\frac{7}{4}$.'
        ],
        sampleAnswer: 'Phương trình hoành độ giao điểm: $x^4 - 5x^2 + 4 - m = 0$. Đặt $t = x^2 > 0$, phương trình thành $t^2 - 5t + 4 - m = 0$ (*). Để có 4 nghiệm lập thành cấp số cộng $-3x_1 < -x_1 < x_1 < 3x_1$, (*) phải có 2 nghiệm dương thỏa $t_2 = 9t_1$. Theo Vi-ét: $t_1 + 9t_1 = 5 \\Rightarrow t_1 = 0{,}5$, $t_2 = 4{,}5$. Suy ra $4 - m = t_1 t_2 = 0{,}5 \\times 4{,}5 = \\frac{9}{4} \\Rightarrow m = \\frac{7}{4}$.'
      }
    }
  ],
  'math-4': [
    {
      stepTitle: '1. Quy trình Tìm Giá trị Lớn nhất – Nhỏ nhất trên Đoạn $[a; b]$',
      stepType: 'concept',
      conceptSection:
        'Mọi hàm số $f(x)$ liên tục trên một đoạn đóng $[a; b]$ luôn tồn tại duy nhất giá trị lớn nhất $M = \\max_{[a;b]} f(x)$ và giá trị nhỏ nhất $m = \\min_{[a;b]} f(x)$.',
      formulaSection: {
        primaryFormula: '\\max_{[a;b]} f = \\max\\{f(a),\\, f(b),\\, f(x_i)\\}, \\qquad \\min_{[a;b]} f = \\min\\{f(a),\\, f(b),\\, f(x_i)\\}',
        secondaryFormulas: [
          'x_i \\in (a; b) \\text{ là các điểm tại đó } f\'(x_i) = 0 \\text{ hoặc } f\'(x_i) \\text{ không xác định}'
        ],
        variablesNote:
          '• **Tuyệt đối không quên kiểm tra $x_i \\in (a; b)$**: bất kỳ nghiệm nào của $f\'(x) = 0$ nằm NGOÀI đoạn $[a; b]$ đều phải loại bỏ trước khi tính giá trị!\n• Nếu hàm **đơn điệu hoàn toàn** trên $[a; b]$ ($y\'$ không đổi dấu), Min và Max chắc chắn rơi tại hai đầu mút $a, b$.'
      },
      deepDiveSection:
        'Trên khoảng mở $(a; b)$ (không phải đoạn đóng $[a; b]$), hàm liên tục chưa chắc có Max/Min! Khi đó bắt buộc phải lập **bảng biến thiên** đầy đủ và tính giới hạn tại hai đầu mút $a^+, b^-$ hoặc $\\pm\\infty$ mới được kết luận.',
      teacherExplanation:
        'Tìm Min–Max trên đoạn $[a; b]$ KHÔNG cần lập bảng biến thiên, chỉ cần tìm các $x_i \\in (a; b)$ và so sánh các giá trị $f(a), f(b), f(x_i)$.',
      keyTakeaway: 'Trên đoạn $[a; b]$ nhớ lọc nghiệm $f\'(x)=0$ thuộc $(a; b)$; trên khoảng $(a; b)$ bắt buộc lập bảng biến thiên.',
      miniQuiz: [
        {
          id: 'm4-s1-q1',
          question: 'Giá trị lớn nhất của hàm số $y = x^3 - 3x^2 - 9x + 1$ trên đoạn $[0; 4]$ bằng:',
          options: ['A. $1$', 'B. $-26$', 'C. $-19$', 'D. $6$'],
          correctIndex: 0,
          explanation: '$y\' = 3x^2 - 6x - 9 = 0 \\iff x = -1$ (loại vì $\\notin [0; 4]$) hoặc $x = 3$ (nhận). Tính $y(0) = 1$, $y(3) = -26$, $y(4) = -19$. Vậy Max $= 1$.'
        },
        {
          id: 'm4-s1-q2',
          question: 'Giá trị nhỏ nhất của hàm số $y = x + \\frac{4}{x}$ trên khoảng $(0; +\\infty)$ là:',
          options: ['A. $2$', 'B. $4$', 'C. $5$', 'D. Không có giá trị nhỏ nhất'],
          correctIndex: 1,
          explanation: 'Theo BĐT Cô-si (hoặc đạo hàm tại $x = 2 \\in (0; +\\infty)$), $y \\ge 2\\sqrt{x\\cdot\\frac{4}{x}} = 4$.'
        }
      ],
      miniEssay: {
        id: 'm4-s1-e1',
        question: 'Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $f(x) = x\\sqrt{4 - x^2}$ trên đoạn $[-1; 2]$.',
        hint: 'Đạo hàm $f\'(x) = \\frac{4 - 2x^2}{\\sqrt{4 - x^2}} = 0 \\implies x = \\pm\\sqrt{2}$, chọn nghiệm nằm trong $(-1; 2)$.',
        rubricChecklist: [
          'Tính đúng $f\'(x) = \\frac{4 - 2x^2}{\\sqrt{4 - x^2}} = 0 \\implies x = \\sqrt{2} \\in (-1; 2)$ (loại $-\\sqrt{2}$).',
          'So sánh $f(-1) = -\\sqrt{3}$, $f(\\sqrt{2}) = 2$, $f(2) = 0$ để kết luận Max $= 2$ và Min $= -\\sqrt{3}$.'
        ],
        sampleAnswer: 'Hàm số liên tục trên đoạn $[-1; 2]$. Trên khoảng $(-1; 2)$, ta có $f\'(x) = \\sqrt{4 - x^2} - \\frac{x^2}{\\sqrt{4 - x^2}} = \\frac{4 - 2x^2}{\\sqrt{4 - x^2}}$. Cho $f\'(x) = 0 \\Leftrightarrow x = \\sqrt{2}$ (nhận) hoặc $x = -\\sqrt{2}$ (loại vì $-\\sqrt{2} < -1$). Tính giá trị: $f(-1) = -\\sqrt{3}$, $f(\\sqrt{2}) = 2$, $f(2) = 0$. Vậy $\\max_{[-1;2]} f = 2$ tại $x = \\sqrt{2}$ và $\\min_{[-1;2]} f = -\\sqrt{3}$ tại $x = -1$.'
      }
    },
    {
      stepTitle: '2. Cực trị Giá trị Lớn nhất – Nhỏ nhất chứa Tham số & Giá trị Tuyệt đối',
      stepType: 'derivation',
      conceptSection:
        'Đối với bài toán tìm tham số $m$ để $\\max_{[a;b]} |f(x) + m| = M_0$ đạt giá trị nhỏ nhất, ta không khảo sát từng trường hợp dấu tuyệt đối mà áp dụng trực tiếp **định lý đường trung bình khoảng biến thiên**.',
      formulaSection: {
        primaryFormula: '\\max_{x \\in [a; b]} |g(x) + m| \\ge \\frac{M - \\mu}{2}',
        secondaryFormulas: [
          'M = \\max_{[a;b]} g(x), \\quad \\mu = \\min_{[a;b]} g(x)',
          '\\text{Đạt giá trị nhỏ nhất} \\iff m = -\\frac{M + \\mu}{2}'
        ],
        variablesNote:
          '• Bất đẳng thức cực kỳ mạnh: với mọi $m$, ta luôn có $\\max(|M + m|, |\\mu + m|) \\ge \\frac{|M - \\mu|}{2}$!\n• Đối với hàm **đơn điệu** $y = \\frac{ax + b}{cx + d}$ trên $[\\alpha; \\beta]$ (không chứa tiệm cận đứng), chỉ cần lấy giá trị hai đầu mút $y(\\alpha)$ và $y(\\beta)$ mà không cần xét dấu $y\'$ trước!'
      },
      deepDiveSection:
        'Đây là mẹo giải đề THPT Quốc gia cực kỳ tiết kiệm thời gian: gặp bài tìm $m$ để hàm phân thức có $\\max_{[1; 3]} y = 5$, chỉ cần đặt $M = \\max\\{y(1), y(3)\\}$ và $m_{\\text{min}} = \\min\\{y(1), y(3)\\}$ (với điều kiện tiệm cận đứng nằm ngoài $[1; 3]$)!',
      teacherExplanation:
        'Nhớ quy tắc trung tâm đoạn giá trị: để $\\max_{[a;b]} |g(x) + m|$ bé nhất, hãy tịnh tiến sao cho Max và Min của $g(x)+m$ đối xứng nhau qua $0$, tức $m = -\\frac{\\max g + \\min g}{2}$!',
      keyTakeaway: '$\\min_m \\left(\\max_{[a;b]} |g(x) + m|\\right) = \\frac{\\max g - \\min g}{2}$ tại $m = -\\frac{\\max g + \\min g}{2}$.',
      miniQuiz: [
        {
          id: 'm4-s2-q1',
          question: 'Cho hàm số $y = |x^3 - 3x + m|$ trên đoạn $[0; 2]$. Giá trị của $m$ để giá trị lớn nhất của hàm số trên $[0; 2]$ đạt giá trị nhỏ nhất là:',
          options: ['A. $m = 0$', 'B. $m = 1$', 'C. $m = -1$', 'D. $m = 2$'],
          correctIndex: 0,
          explanation: 'Xét $g(x) = x^3 - 3x$ trên $[0; 2]$: $g(0)=0, g(1)=-2, g(2)=2 \\implies M = 2, \\mu = -2$. Vậy $m = -\\frac{2 + (-2)}{2} = 0$.'
        },
        {
          id: 'm4-s2-q2',
          question: 'Cho hàm số $y = \\frac{x + m}{x + 1}$ thỏa $\\min_{[1; 2]} y + \\max_{[1; 2]} y = 2$. Giá trị của $m$ bằng:',
          options: ['A. $m = 2$', 'B. $m = 3$', 'C. $m = 1$', 'D. $m = 4$'],
          correctIndex: 2,
          explanation: 'Tiệm cận $x = -1 \\notin [1; 2]$ nên hàm đơn điệu trên $[1; 2]$. Tổng $\\min + \\max = y(1) + y(2) = \\frac{1+m}{2} + \\frac{2+m}{3} = 2 \\iff \\frac{7 + 5m}{6} = 2 \\iff 5m = 5 \\iff m = 1$.'
        }
      ],
      miniEssay: {
        id: 'm4-s2-e1',
        question: 'Tìm giá trị nhỏ nhất của $P = \\max_{x \\in [-1; 2]} |x^2 - 2x + m|$ và giá trị $m$ tương ứng.',
        hint: 'Tìm $M = \\max g(x)$ và $\\mu = \\min g(x)$ với $g(x) = x^2 - 2x$ trên $[-1; 2]$, rồi dùng $P_{\\min} = \\frac{M - \\mu}{2}$.',
        rubricChecklist: [
          'Tìm trên $[-1; 2]$ của $g(x) = x^2 - 2x$: $g\' = 2x - 2 = 0 \\implies x = 1$. So sánh $g(-1) = 3, g(1) = -1, g(2) = 0 \\implies M = 3, \\mu = -1$.',
          'Tính $P_{\\min} = \\frac{3 - (-1)}{2} = 2$ đạt được khi $m = -\\frac{3 + (-1)}{2} = -1$.'
        ],
        sampleAnswer: 'Xét $g(x) = x^2 - 2x$ trên $[-1; 2]$, có $g\'(x) = 2x - 2 = 0 \\Leftrightarrow x = 1 \\in (-1; 2)$. Ta có $g(-1) = 3$, $g(1) = -1$, $g(2) = 0$, nên $\\max g = 3$ và $\\min g = -1$. Khi đó $\\max_{[-1;2]} |g(x) + m| = \\max\\{|3 + m|, |-1 + m|\\} \\ge \\frac{|(3 + m) - (-1 + m)|}{2} = 2$. Dấu bằng đạt được khi $3 + m = -(-1 + m) \\Leftrightarrow m = -1$, cho giá trị nhỏ nhất $P_{\\min} = 2$.'
      }
    },
    {
      stepTitle: '3. Mô hình hóa & Giải Bài toán Tối ưu Thực tế (Kinh tế, Hình học)',
      stepType: 'example',
      conceptSection:
        'Bài toán tối ưu thực tế (làm hộp thể tích lớn nhất, tối thiểu chi phí vật liệu, tìm điểm đi qua sông nhanh nhất) tuân theo quy trình 3 bước chuẩn: **Đặt biến $x$ kèm điều kiện miền** $\\to$ **Biểu diễn hàm mục tiêu $f(x)$** $\\to$ **Tìm cực trị đạo hàm trên miền đó**.',
      formulaSection: {
        primaryFormula: '\\text{Hình trụ } V = \\pi R^2 h \\text{ không đổi} \\implies S_{\\text{tp min}} \\text{ khi } h = 2R',
        secondaryFormulas: [
          '\\text{Hộp đáy vuông nắp mở } V \\text{ cố định} \\implies S_{\\text{min}} \\text{ khi } h = \\frac{x}{2}',
          '\\text{Định luật Fermat thời gian đi ngắn nhất: } \\frac{\\sin\\alpha_1}{v_1} = \\frac{\\sin\\alpha_2}{v_2}'
        ],
        variablesNote:
          '• Luôn kiểm tra kỹ hình trụ/hộp **có nắp hay không có nắp** ($2\\pi R^2$ hay $\\pi R^2$)!.\n• Trong bài toán kinh tế (tìm giá bán tăng doanh thu/lợi nhuận), chú ý mối quan hệ tuyến tính giữa mức giảm giá và lượng khách tăng thêm.'
      },
      deepDiveSection:
        'Điều thú vị của tự nhiên: Lon nước ngọt hình trụ kín 2 nắp có thể tích chuẩn $330\\text{ ml}$ luôn tiết kiệm nhôm nhất khi chiều cao bằng đúng đường kính đáy ($h = 2R$), còn hộp chữ nhật kín 6 mặt có thể tích cho trước tiết kiệm bìa nhất khi nó là **hình lập phương**!',
      teacherExplanation:
        'Bước đặt ẩn phụ quan trọng nhất ở bài tối ưu thực tế: luôn ghi rõ ràng điều kiện $x > 0$ (hoặc $0 < x < a/2$) trước khi lấy đạo hàm.',
      keyTakeaway: 'Quy trình tối ưu thực tế: Chọn ẩn $x$ & miền $(a; b)$ $\\to$ Lập hàm $f(x)$ $\\to$ Giải $f\'(x)=0$ và kiểm tra dấu.',
      miniQuiz: [
        {
          id: 'm4-s3-q1',
          question: 'Từ một tấm tôn hình vuông cạnh $12\\text{ cm}$, cắt ở bốn góc bốn hình vuông bằng nhau cạnh $x$ rồi gập lên thành một cái hộp không nắp. Hộp có thể tích lớn nhất khi $x$ bằng:',
          options: ['A. $1\\text{ cm}$', 'B. $2\\text{ cm}$', 'C. $3\\text{ cm}$', 'D. $4\\text{ cm}$'],
          correctIndex: 1,
          explanation: '$V(x) = x(12 - 2x)^2$ với $0 < x < 6$. $V\'(x) = (12 - 2x)(12 - 6x) = 0 \\implies x = 2\\text{ cm}$.'
        },
        {
          id: 'm4-s3-q2',
          question: 'Một xưởng sản xuất $x$ sản phẩm/ngày ($1 \\le x \\le 50$) có chi phí $C(x) = x^2 + 20x + 400$ (nghìn đồng). Chi phí trung bình trên 1 sản phẩm $\\bar{C}(x) = C(x)/x$ nhỏ nhất tại:',
          options: ['A. $x = 10$', 'B. $x = 20$', 'C. $x = 25$', 'D. $x = 40$'],
          correctIndex: 1,
          explanation: '$\\bar{C}(x) = x + 20 + \\frac{400}{x} \\ge 20 + 2\\sqrt{400} = 60$, dấu bằng tại $x = \\frac{400}{x} \\iff x = 20$.'
        }
      ],
      miniEssay: {
        id: 'm4-s3-e1',
        question: 'Cần thiết kế một thùng hình trụ có nắp (kín 2 đáy) bằng tôn với thể tích $V = 16\\pi\\text{ dm}^3$. Tìm bán kính đáy $R$ và chiều cao $h$ để tốn ít tôn làm vỏ nhất.',
        hint: 'Từ $V = \\pi R^2 h = 16\\pi \\implies h = 16/R^2$. Lập hàm $S_{tp}(R) = 2\\pi R^2 + 2\\pi R h = 2\\pi\\left(R^2 + \\frac{16}{R}\\right)$, rồi tối ưu.',
        rubricChecklist: [
          'Biểu diễn $h = 16/R^2$ và diện tích toàn phần $S(R) = 2\\pi\\left(R^2 + \\frac{16}{R}\\right)$ ($R > 0$).',
          'Đạo hàm $S\'(R) = 2\\pi(2R - 16/R^2) = 0 \\implies R^3 = 8 \\implies R = 2\\text{ dm}$ và $h = 4\\text{ dm}$ (đúng tỉ lệ $h = 2R$).'
        ],
        sampleAnswer: 'Từ thể tích $V = \\pi R^2 h = 16\\pi \\Rightarrow h = \\frac{16}{R^2}$ ($R > 0$). Diện tích toàn phần vỏ thùng (có 2 nắp) là $S(R) = 2\\pi R^2 + 2\\pi R h = 2\\pi\\left(R^2 + \\frac{16}{R}\\right)$. Ta có $S\'(R) = 2\\pi\\left(2R - \\frac{16}{R^2}\\right) = 0 \\Leftrightarrow R^3 = 8 \\Leftrightarrow R = 2\\text{ dm}$. Lập bảng biến thiên thấy $S$ đạt cực tiểu tại $R = 2\\text{ dm}$, khi đó $h = \\frac{16}{2^2} = 4\\text{ dm}$ ($h = 2R$).'
      }
    }
  ],
  'math-5': [
    {
      stepTitle: '1. Bảng Nguyên hàm Cơ bản & Nguyên hàm Hàm hợp Bậc nhất',
      stepType: 'concept',
      conceptSection:
        'Hàm $F(x)$ là nguyên hàm của $f(x)$ trên khoảng $K$ nếu $F\'(x) = f(x)$ với mọi $x \\in K$. Khi thay $x$ bởi biểu thức bậc nhất $(ax + b)$, nhớ quy tắc vàng: **nhân thêm hệ số $\\frac{1}{a}$** ở phía trước.',
      formulaSection: {
        primaryFormula: '\\int f(ax + b)\\,dx = \\frac{1}{a}F(ax + b) + C \\quad (a \\ne 0)',
        secondaryFormulas: [
          '\\int x^\\alpha\\,dx = \\frac{x^{\\alpha+1}}{\\alpha+1} + C\\ (\\alpha\\neq -1), \\qquad \\int \\frac{dx}{x} = \\ln|x| + C',
          '\\int e^{kx}\\,dx = \\frac{1}{k}e^{kx} + C, \\qquad \\int \\cos(ax+b)\\,dx = \\frac{1}{a}\\sin(ax+b) + C'
        ],
        variablesNote:
          '• **Cảnh giác mất trị tuyệt đối**: $\\int \\frac{1}{ax+b}\\,dx = \\frac{1}{a}\\ln|ax + b| + C$ — nếu thiếu $|\\cdot|$ trên miền âm sẽ sai hoàn toàn!\n• Hằng số tích phân $+ C$ bắt buộc có với nguyên hàm không xác định.'
      },
      deepDiveSection:
        'Để kiểm tra 100% kết quả nguyên hàm trong phòng thi: chỉ việc lấy đáp án tìm được **đạo hàm ngược lại** xem có khớp với hàm dưới dấu tích phân $f(x)$ hay không!',
      teacherExplanation:
        'Nhớ quy tắc $(ax+b) \\to$ chia thêm $a$: nguyên hàm của $\\sin(2x)$ phải là $-\\frac{1}{2}\\cos(2x)$, KHÔNG bao giờ quên dấu trừ và hệ số $1/2$!',
      keyTakeaway: 'Thay $x$ bằng $ax + b$ trong nguyên hàm cơ bản thì nhân kết quả thêm $\\frac{1}{a}$.',
      miniQuiz: [
        {
          id: 'm5-s1-q1',
          question: 'Họ nguyên hàm của hàm số $f(x) = e^{3x - 1} + \\frac{2}{2x + 1}$ là:',
          options: [
            'A. $3e^{3x-1} + 2\\ln|2x+1| + C$',
            'B. $\\frac{1}{3}e^{3x-1} + \\ln|2x+1| + C$',
            'C. $\\frac{1}{3}e^{3x-1} + 2\\ln|2x+1| + C$',
            'D. $e^{3x-1} + \\ln(2x+1) + C$'
          ],
          correctIndex: 1,
          explanation: '$\\int e^{3x-1}\\,dx = \\frac{1}{3}e^{3x-1}$ và $\\int \\frac{2}{2x+1}\\,dx = 2\\cdot\\frac{1}{2}\\ln|2x+1| = \\ln|2x+1|$.'
        },
        {
          id: 'm5-s1-q2',
          question: 'Tìm nguyên hàm $F(x)$ của hàm số $f(x) = \\sin(2x) + 1$ thỏa mãn $F(0) = 1$.',
          options: [
            'A. $F(x) = -\\frac{1}{2}\\cos(2x) + x + \\frac{3}{2}$',
            'B. $F(x) = \\frac{1}{2}\\cos(2x) + x + \\frac{1}{2}$',
            'C. $F(x) = -2\\cos(2x) + x + 3$',
            'D. $F(x) = -\\frac{1}{2}\\cos(2x) + x + 1$'
          ],
          correctIndex: 0,
          explanation: '$F(x) = -\\frac{1}{2}\\cos(2x) + x + C$. Từ $F(0) = -\\frac{1}{2} + C = 1 \\implies C = \\frac{3}{2}$.'
        }
      ],
      miniEssay: {
        id: 'm5-s1-e1',
        question: 'Tính nguyên hàm $I = \\int \\frac{2x + 3}{x + 1}\\,dx$ và tìm một nguyên hàm $F(x)$ biết $F(0) = 2$.',
        hint: 'Chia tử cho mẫu: $\\frac{2x + 3}{x + 1} = 2 + \\frac{1}{x + 1}$.',
        rubricChecklist: [
          'Tách đúng $\\frac{2x+3}{x+1} = 2 + \\frac{1}{x+1}$.',
          'Tính $F(x) = 2x + \\ln|x + 1| + C$, thay $F(0) = 2 \\implies C = 2$.'
        ],
        sampleAnswer: 'Biến đổi $\\frac{2x + 3}{x + 1} = \\frac{2(x + 1) + 1}{x + 1} = 2 + \\frac{1}{x + 1}$. Suy ra họ nguyên hàm là $F(x) = 2x + \\ln|x + 1| + C$. Vì $F(0) = 0 + \\ln 1 + C = 2 \\Rightarrow C = 2$. Vậy $F(x) = 2x + \\ln|x + 1| + 2$.'
      }
    },
    {
      stepTitle: '2. Phương pháp Đổi biến số (Vi phân $du$) & Đổi cận Tích phân',
      stepType: 'derivation',
      conceptSection:
        'Khi gặp tích phân có cấu trúc chứa một biểu thức $u(x)$ và đạo hàm $u\'(x)$ của nó (hoặc căn thức $\\sqrt{ax+b}$, $\\sqrt{a^2 - x^2}$), phép đặt ẩn phụ $u = u(x)$ biến đổi tích phân phức tạp về dạng cơ bản.',
      formulaSection: {
        primaryFormula: '\\int_a^b f(u(x))\\,u\'(x)\\,dx = \\int_{u(a)}^{u(b)} f(u)\\,du',
        secondaryFormulas: [
          '\\text{Gặp } \\sqrt{ax+b} \\implies \\text{Đặt } t = \\sqrt{ax+b}',
          '\\text{Gặp } \\sqrt{a^2 - x^2} \\implies \\text{Đặt } x = a\\sin t'
        ],
        variablesNote:
          '• **Cảnh báo mất điểm kinh điển**: Đã đổi biến sang $u$ trong **tích phân xác định** thì **BẮT BUỘC ĐỔI CẬN** $x = a \\to u(a)$ và $x = b \\to u(b)$ — tuyệt đối không giữ nguyên cận $a, b$ cũ!\n• Ghi nhanh bảng vi phân: $x\\,dx = \\frac{1}{2}d(x^2)$, $\\cos x\\,dx = d(\\sin x)$, $\\frac{dx}{x} = d(\\ln x)$.'
      },
      deepDiveSection:
        'Đối với dạng tích phân hàm chẵn – hàm lẻ trên đoạn đối xứng $[-a; a]$:\n• Nếu $f(x)$ là hàm **lẻ** ($f(-x) = -f(x)$) $\\implies \\int_{-a}^a f(x)\\,dx = 0$ ngay lập tức!\n• Nếu $f(x)$ là hàm **chẵn** $\\implies \\int_{-a}^a f(x)\\,dx = 2\\int_0^a f(x)\\,dx$.',
      teacherExplanation:
        'Khi đặt $t = \\sqrt{x^2 + 1}$, đừng đạo hàm căn thức dài dòng! Bình phương hai vế trước ($t^2 = x^2 + 1$), rồi lấy vi phân $2t\\,dt = 2x\\,dx \\implies t\\,dt = x\\,dx$ cực gọn!',
      keyTakeaway: 'Đổi biến nhớ đổi cận; bình phương căn thức trước khi lấy vi phân để triệt tiêu mẫu căn.',
      miniQuiz: [
        {
          id: 'm5-s2-q1',
          question: 'Tính tích phân $I = \\int_0^1 x\\,e^{x^2}\\,dx$ bằng cách đặt $t = x^2$. Biểu thức đúng là:',
          options: [
            'A. $\\int_0^1 e^t\\,dt$',
            'B. $\\frac{1}{2}\\int_0^1 e^t\\,dt = \\frac{e - 1}{2}$',
            'C. $2\\int_0^1 e^t\\,dt = 2(e - 1)$',
            'D. $\\frac{e}{2}$'
          ],
          correctIndex: 1,
          explanation: '$dt = 2x\\,dx \\implies x\\,dx = \\frac{1}{2}dt$. Cận $x: 0 \\to 1 \\implies t: 0 \\to 1$. Vậy $I = \\frac{1}{2}(e - 1)$.'
        },
        {
          id: 'm5-s2-q2',
          question: 'Tính tích phân $J = \\int_1^e \\frac{\\ln x}{x}\\,dx$:',
          options: ['A. $1$', 'B. $\\frac{1}{2}$', 'C. $e - 1$', 'D. $\\frac{e^2}{2}$'],
          correctIndex: 1,
          explanation: 'Đặt $t = \\ln x \\implies dt = \\frac{dx}{x}$, cận $t: 0 \\to 1$. Vậy $J = \\int_0^1 t\\,dt = \\frac{1}{2}$.'
        }
      ],
      miniEssay: {
        id: 'm5-s2-e1',
        question: 'Tính tích phân $I = \\int_0^{\\sqrt{3}} x\\sqrt{x^2 + 1}\\,dx$ bằng phương pháp đặt ẩn phụ khử căn.',
        hint: 'Đặt $t = \\sqrt{x^2 + 1} \\implies t^2 = x^2 + 1 \\implies t\\,dt = x\\,dx$, đổi cận $x=0 \\to t=1$, $x=\\sqrt{3} \\to t=2$.',
        rubricChecklist: [
          'Bình phương vi phân đúng $t\\,dt = x\\,dx$ và đổi cận $1 \\to 2$.',
          'Tính $I = \\int_1^2 t^2\\,dt = \\left.\\frac{t^3}{3}\\right|_1^2 = \\frac{8 - 1}{3} = \\frac{7}{3}$.'
        ],
        sampleAnswer: 'Đặt $t = \\sqrt{x^2 + 1} \\Rightarrow t^2 = x^2 + 1$. Lấy vi phân hai vế: $2t\\,dt = 2x\\,dx \\Rightarrow x\\,dx = t\\,dt$. Đổi cận: $x = 0 \\Rightarrow t = 1$; $x = \\sqrt{3} \\Rightarrow t = 2$. Khi đó $I = \\int_1^2 t\\cdot t\\,dt = \\int_1^2 t^2\\,dt = \\left.\\frac{t^3}{3}\\right|_1^2 = \\frac{8}{3} - \\frac{1}{3} = \\frac{7}{3}$.'
      }
    },
    {
      stepTitle: '3. Kỹ thuật Tích phân Từng phần & Quy tắc "Nhất Lô – Nhì Đa"',
      stepType: 'example',
      conceptSection:
        'Khi biểu thức dưới dấu tích phân là tích của hai hàm khác loại (Đa thức $\\times$ Lượng giác, Đa thức $\\times$ Mũ, Đa thức $\\times$ Logarit) không có liên hệ đạo hàm để đổi biến, ta dùng công thức tích phân từng phần.',
      formulaSection: {
        primaryFormula: '\\int_a^b u\\,dv = \\Big[u\\cdot v\\Big]_a^b - \\int_a^b v\\,du',
        secondaryFormulas: [
          '\\text{Thứ tự ưu tiên đặt } u: \\mathbf{Nhất\\ Lô \\to Nhì\\ Đa \\to Tam\\ Lượng \\to Tứ\\ Mũ}'
        ],
        variablesNote:
          '• **Logarit ($\\ln, \\log$) luôn ưu tiên số 1 đặt làm $u$** (để đạo hàm mất $\\ln$).\n• Nếu không có $\\ln$, ưu tiên đặt **Đa thức** ($x, x^2\\dots$) làm $u$ (để đạo hàm giảm dần bậc về $0$); phần còn lại ($e^x dx, \\sin x\\,dx\\dots$) đặt làm $dv$.'
      },
      deepDiveSection:
        'Với bậc đa thức cao (như $\\int x^2 e^x\\,dx$), dùng **sơ đồ cột múa cột (Tabular Integration)**: cột trái đạo hàm liên tiếp $x^2 \\to 2x \\to 2 \\to 0$, cột phải nguyên hàm liên tiếp $e^x \\to e^x \\to e^x \\to e^x$, nhân chéo đan dấu $+, -, +$ cho kết quả ngay lập tức $(x^2 - 2x + 2)e^x + C$!',
      teacherExplanation:
        'Dạng vòng lặp kinh điển $\\int e^x\\sin x\\,dx$: từng phần 2 lần sẽ quay lại đúng tích phân $I$ ban đầu rồi chuyển vế chia $2$!',
      keyTakeaway: 'Thứ tự đặt $u$: Nhất Lô – Nhì Đa – Tam Lượng – Tứ Mũ; phần còn lại lấy nguyên hàm để tìm $v$.',
      miniQuiz: [
        {
          id: 'm5-s3-q1',
          question: 'Khi tính tích phân $I = \\int_1^e x^2\\ln x\\,dx$ bằng phương pháp từng phần, cách đặt nào đúng chuẩn ưu tiên?',
          options: [
            'A. Đặt $u = x^2,\\ dv = \\ln x\\,dx$',
            'B. Đặt $u = \\ln x,\\ dv = x^2\\,dx$',
            'C. Đặt $u = x,\\ dv = x\\ln x\\,dx$',
            'D. Đặt $u = x^2\\ln x,\\ dv = dx$'
          ],
          correctIndex: 1,
          explanation: 'Theo quy tắc "Nhất Lô – Nhì Đa", gặp $\\ln x$ phải đặt $u = \\ln x$ để $du = \\frac{1}{x}dx$, còn $dv = x^2\\,dx$.'
        },
        {
          id: 'm5-s3-q2',
          question: 'Giá trị của tích phân $I = \\int_0^1 x\\,e^x\\,dx$ bằng:',
          options: ['A. $e$', 'B. $e - 1$', 'C. $1$', 'D. $e + 1$'],
          correctIndex: 2,
          explanation: 'Đặt $u = x, dv = e^x dx \\implies du = dx, v = e^x$. Khi đó $I = [x e^x]_0^1 - \\int_0^1 e^x dx = e - (e - 1) = 1$.'
        }
      ],
      miniEssay: {
        id: 'm5-s3-e1',
        question: 'Tính tích phân $I = \\int_1^e (2x + 1)\\ln x\\,dx$ bằng phương pháp từng phần.',
        hint: 'Đặt $u = \\ln x \\implies du = \\frac{1}{x}dx$; đặt $dv = (2x + 1)dx \\implies v = x^2 + x$.',
        rubricChecklist: [
          'Đặt $u = \\ln x$, $dv = (2x + 1)dx \\implies du = \\frac{dx}{x},\\ v = x^2 + x$.',
          'Thay công thức: $[(x^2 + x)\\ln x]_1^e - \\int_1^e (x + 1)dx = (e^2 + e) - \\left(\\frac{e^2 - 1}{2} + e - 1\\right) = \\frac{e^2 + 3}{2}$.'
        ],
        sampleAnswer: 'Đặt $\\begin{cases} u = \\ln x \\\\ dv = (2x + 1)dx \\end{cases} \\Rightarrow \\begin{cases} du = \\frac{dx}{x} \\\\ v = x^2 + x \\end{cases}$. Áp dụng tích phân từng phần:\n$I = \\big[(x^2 + x)\\ln x\\big]_1^e - \\int_1^e \\frac{x^2 + x}{x}\\,dx = (e^2 + e) - \\int_1^e (x + 1)\\,dx = e^2 + e - \\left[\\frac{x^2}{2} + x\\right]_1^e = e^2 + e - \\left(\\frac{e^2}{2} + e - \\frac{3}{2}\\right) = \\frac{e^2 + 3}{2}$.'
      }
    }
  ],
  'math-6': [
    {
      stepTitle: '1. Vectơ trong Không gian Oxyz, Tích có hướng & Mặt phẳng',
      stepType: 'concept',
      conceptSection:
        'Trong không gian $Oxyz$, mỗi mặt phẳng $(P): Ax + By + Cz + D = 0$ ($A^2+B^2+C^2 > 0$) được xác định duy nhất bởi 1 điểm đi qua $M_0$ và 1 **vectơ pháp tuyến $\\vec{n} = (A; B; C)$** vuông góc với mọi đường thẳng nằm trong $(P)$.',
      formulaSection: {
        primaryFormula: 'A(x - x_0) + B(y - y_0) + C(z - z_0) = 0',
        secondaryFormulas: [
          '\\text{Tích có hướng: } [\\vec{u}, \\vec{v}] = \\left(\\begin{vmatrix}u_y & u_z\\\\v_y & v_z\\end{vmatrix};\\ \\begin{vmatrix}u_z & u_x\\\\v_z & v_x\\end{vmatrix};\\ \\begin{vmatrix}u_x & u_y\\\\v_x & v_y\\end{vmatrix}\\right)',
          '\\text{Phương trình đoạn chắn: } \\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1'
        ],
        variablesNote:
          '• Nếu $(P)$ đi qua 3 điểm $A, B, C$ hoặc chứa cặp vectơ chỉ phương $\\vec{u}, \\vec{v}$ không cùng phương, pháp tuyến tìm bằng tích có hướng $\\vec{n} = [\\vec{u}, \\vec{v}]$.\n• Ngoài ra tích có hướng dùng tính ngay diện tích tam giác $S_{\\triangle ABC} = \\frac{1}{2}|[\\overrightarrow{AB}, \\overrightarrow{AC}]|$ và thể tích tứ diện $V_{ABCD} = \\frac{1}{6}|[\\overrightarrow{AB}, \\overrightarrow{AC}]\\cdot\\overrightarrow{AD}|$.'
      },
      deepDiveSection:
        'Cẩn thận dấu ở thành phần tung độ (giữa) khi tính tích có hướng $[\\vec{u}, \\vec{v}]$! Thành phần giữa luôn đi theo thứ tự vòng tròn **$z \\to x$**: $u_z v_x - u_x v_z$ (chính là trừ của định thức $u_x v_z - u_z v_x$).',
      teacherExplanation:
        'Nếu mặt phẳng cắt 3 trục $Ox, Oy, Oz$ tại $A(a;0;0), B(0;b;0), C(0;0;c)$, viết ngay phương trình đoạn chắn $\\frac{x}{a}+\\frac{y}{b}+\\frac{z}{c}=1$ trong 3 giây!',
      keyTakeaway: 'Pháp tuyến của mặt phẳng qua cặp chỉ phương $\\vec{u}, \\vec{v}$ là $\\vec{n} = [\\vec{u}, \\vec{v}]$.',
      miniQuiz: [
        {
          id: 'm6-s1-q1',
          question: 'Mặt phẳng $(P): 2x - 3z + 5 = 0$ có một vectơ pháp tuyến là:',
          options: ['A. $(2; -3; 5)$', 'B. $(2; 0; -3)$', 'C. $(2; -3; 0)$', 'D. $(0; 2; -3)$'],
          correctIndex: 1,
          explanation: 'Khuyết ẩn $y$ nên hệ số của $y$ bằng $0 \\implies \\vec{n} = (2; 0; -3)$.'
        },
        {
          id: 'm6-s1-q2',
          question: 'Viết phương trình mặt phẳng đi qua 3 điểm $A(2; 0; 0)$, $B(0; -3; 0)$, $C(0; 0; 4)$.',
          options: [
            'A. $\\frac{x}{2} - \\frac{y}{3} + \\frac{z}{4} = 1$',
            'B. $\\frac{x}{2} + \\frac{y}{3} + \\frac{z}{4} = 1$',
            'C. $2x - 3y + 4z = 1$',
            'D. $6x - 4y + 3z + 12 = 0$'
          ],
          correctIndex: 0,
          explanation: 'Áp dụng phương trình đoạn chắn: $\\frac{x}{2} + \\frac{y}{-3} + \\frac{z}{4} = 1$.'
        }
      ],
      miniEssay: {
        id: 'm6-s1-e1',
        question: 'Trong không gian $Oxyz$, cho 3 điểm $A(1; 0; 2)$, $B(2; 1; 0)$, $C(0; 2; 1)$. Viết phương trình mặt phẳng $(ABC)$ và tính diện tích $\\triangle ABC$.',
        hint: 'Tính $\\overrightarrow{AB}, \\overrightarrow{AC}$, lấy tích có hướng $\\vec{n} = [\\overrightarrow{AB}, \\overrightarrow{AC}]$, rồi dùng $S = \\frac{1}{2}|\\vec{n}|$.',
        rubricChecklist: [
          'Tính $\\overrightarrow{AB} = (1; 1; -2),\\ \\overrightarrow{AC} = (-1; 2; -1)$, suy ra $\\vec{n} = [\\overrightarrow{AB}, \\overrightarrow{AC}] = (3; 3; 3)$, rút gọn $\\vec{n}_0 = (1; 1; 1)$.',
          'Mặt phẳng $(ABC): x + y + z - 3 = 0$, và diện tích $S = \\frac{1}{2}\\sqrt{3^2+3^2+3^2} = \\frac{3\\sqrt{3}}{2}$.'
        ],
        sampleAnswer: 'Ta có $\\overrightarrow{AB} = (1; 1; -2)$ và $\\overrightarrow{AC} = (-1; 2; -1)$. Tích có hướng $[\\overrightarrow{AB}, \\overrightarrow{AC}] = (1(-1) - (-2)2;\\ (-2)(-1) - 1(-1);\\ 1\\cdot 2 - 1(-1)) = (3; 3; 3)$. Chọn vectơ pháp tuyến $\\vec{n} = (1; 1; 1)$ đi qua $A(1; 0; 2)$: $(x - 1) + y + (z - 2) = 0 \\Leftrightarrow x + y + z - 3 = 0$. Diện tích $\\triangle ABC$ là $S = \\frac{1}{2}|[\\overrightarrow{AB}, \\overrightarrow{AC}]| = \\frac{1}{2}\\sqrt{3^2 + 3^2 + 3^2} = \\frac{3\\sqrt{3}}{2}$.'
      }
    },
    {
      stepTitle: '2. Phương trình Mặt cầu & Vị trí Tương đối với Mặt phẳng',
      stepType: 'derivation',
      conceptSection:
        'Mặt cầu $(S)$ tâm $I(a; b; c)$ bán kính $R$ có hai dạng phương trình thường dùng. Dạng khai triển $x^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0$ giúp đọc nhanh tâm $I$ bằng cách chia đôi và đổi dấu các hệ số bậc nhất.',
      formulaSection: {
        primaryFormula: '(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2, \\qquad R = \\sqrt{a^2 + b^2 + c^2 - d}',
        secondaryFormulas: [
          '\\text{Mặt phẳng } (P) \\text{ cắt mặt cầu } (S) \\text{ theo đường tròn bán kính } r: r^2 + d(I, (P))^2 = R^2',
          '\\text{Tiếp xúc: } d(I, (P)) = R'
        ],
        variablesNote:
          '• Điều kiện để phương trình khai triển thực sự là mặt cầu: $a^2 + b^2 + c^2 - d > 0$.\n• Khi mặt phẳng cắt mặt cầu tạo đường tròn giao tuyến bán kính $r$, tam giác vuông $(I, H, M)$ luôn cho $R^2 = r^2 + d^2$ với $d = d(I, (P))$.'
      },
      deepDiveSection:
        'Các bài toán hình học $Oxyz$ hay hỏi phương trình mặt cầu đi qua 4 điểm không đồng phẳng (thay tọa độ 4 điểm vào dạng khai triển giải hệ tuyến tính 4 ẩn $a, b, c, d$) hoặc mặt cầu tâm $I$ cắt đường thẳng $d$ theo một dây cung có độ dài $AB$: lúc đó tính $d(I, d)$ rồi dùng $R^2 = d(I, d)^2 + (AB/2)^2$.',
      teacherExplanation:
        'Nhớ quy tắc đọc tâm mặt cầu dạng khai triển: lấy hệ số $x, y, z$ **chia cho $-2$** (tức chia đôi rồi đổi dấu).',
      keyTakeaway: '$R^2 = d^2 + r^2$ là công thức liên kết mặt cầu bán kính $R$ với thiết diện tròn bán kính $r$.',
      miniQuiz: [
        {
          id: 'm6-s2-q1',
          question: 'Mặt cầu $(S): x^2 + y^2 + z^2 - 4x + 6y - 2z + 5 = 0$ có tâm $I$ và bán kính $R$ là:',
          options: [
            'A. $I(2; -3; 1),\\ R = 3$',
            'B. $I(-2; 3; -1),\\ R = 3$',
            'C. $I(2; -3; 1),\\ R = \\sqrt{19}$',
            'D. $I(4; -6; 2),\\ R = 9$'
          ],
          correctIndex: 0,
          explanation: 'Tâm $I(2; -3; 1)$, bán kính $R = \\sqrt{2^2 + (-3)^2 + 1^2 - 5} = \\sqrt{9} = 3$.'
        },
        {
          id: 'm6-s2-q2',
          question: 'Cho mặt cầu tâm $I(1; 2; -1)$, bán kính $R = 5$ cắt mặt phẳng $(P): 2x + 2y - z + 5 = 0$ theo giao tuyến là đường tròn bán kính $r$. Giá trị $r$ bằng:',
          options: ['A. $3$', 'B. $4$', 'C. $5$', 'D. $\\sqrt{15}$'],
          correctIndex: 0,
          explanation: '$d(I, (P)) = \\frac{|2\\cdot 1 + 2\\cdot 2 - (-1) + 5|}{\\sqrt{2^2 + 2^2 + (-1)^2}} = \\frac{12}{3} = 4 \\implies r = \\sqrt{5^2 - 4^2} = 3$.'
        }
      ],
      miniEssay: {
        id: 'm6-s2-e1',
        question: 'Viết phương trình mặt cầu $(S)$ có tâm $I(2; -1; 3)$ và tiếp xúc với mặt phẳng $(P): x - 2y + 2z - 1 = 0$. Tìm tọa độ tiếp điểm $H$.',
        hint: 'Bán kính $R = d(I, (P))$; tiếp điểm $H$ là hình chiếu vuông góc của $I$ lên $(P)$ (viết đường thẳng qua $I$ có chỉ phương $\\vec{n}_P$).',
        rubricChecklist: [
          'Tính $R = d(I, (P)) = \\frac{|2 + 2 + 6 - 1|}{\\sqrt{1 + 4 + 4}} = \\frac{9}{3} = 3$, suy ra $(S): (x-2)^2 + (y+1)^2 + (z-3)^2 = 9$.',
          'Viết đường $IH$: $x = 2+t, y = -1-2t, z = 3+2t$, thế vào $(P)$ được $t = -1 \\implies H(1; 1; 1)$.'
        ],
        sampleAnswer: 'Do $(S)$ tiếp xúc $(P)$ nên $R = d(I, (P)) = \\frac{|2 - 2(-1) + 2(3) - 1|}{\\sqrt{1^2 + (-2)^2 + 2^2}} = \\frac{9}{3} = 3$. Phương trình mặt cầu là $(x - 2)^2 + (y + 1)^2 + (z - 3)^2 = 9$. Đường thẳng $IH$ qua $I$ nhận $\\vec{n}_P = (1; -2; 2)$ làm VTCP có dạng $x = 2 + t,\\ y = -1 - 2t,\\ z = 3 + 2t$. Thay vào $(P)$: $(2+t) - 2(-1-2t) + 2(3+2t) - 1 = 0 \\Leftrightarrow 9t + 9 = 0 \\Leftrightarrow t = -1$. Vậy tiếp điểm là $H(1; 1; 1)$.'
      }
    },
    {
      stepTitle: '3. Khoảng cách Điểm – Mặt phẳng, Điểm – Đường thẳng & Chéo nhau',
      stepType: 'example',
      conceptSection:
        'Hệ thống 3 công thức khoảng cách trong không gian $Oxyz$ là công cụ vạn năng giúp giải cả bài toán hình học thuần túy thông qua phương pháp tọa độ hóa.',
      formulaSection: {
        primaryFormula: 'd(M_0, (P)) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}',
        secondaryFormulas: [
          'd(M, \\Delta) = \\frac{|[\\overrightarrow{AM}, \\vec{u}_\\Delta]|}{|\\vec{u}_\\Delta|} \\quad (A \\in \\Delta)',
          'd(\\Delta_1, \\Delta_2) = \\frac{|[\\vec{u}_1, \\vec{u}_2]\\cdot \\overrightarrow{M_1 M_2}|}{|[\\vec{u}_1, \\vec{u}_2]|}'
        ],
        variablesNote:
          '• Hai mặt phẳng song song $Ax + By + Cz + D_1 = 0$ và $Ax + By + Cz + D_2 = 0$ có khoảng cách đúng bằng $\\frac{|D_1 - D_2|}{\\sqrt{A^2+B^2+C^2}}$ (chú ý phải quy đồng cho $A, B, C$ **giống hệt nhau** trước khi trừ $D_1 - D_2$!).'
      },
      deepDiveSection:
        'Kiểm tra nhanh hai đường thẳng $\\Delta_1, \\Delta_2$ chéo nhau hay cắt nhau: chỉ cần kiểm tra tích hỗn tạp $[\\vec{u}_1, \\vec{u}_2]\\cdot \\overrightarrow{M_1 M_2}$! Nếu khác $0$ thì hai đường thẳng **chéo nhau**; nếu bằng $0$ và $[\\vec{u}_1, \\vec{u}_2] \\ne \\vec{0}$ thì chúng **cắt nhau**.',
      teacherExplanation:
        'Thấy hình chóp có 3 cạnh đôi một vuông góc tại $S$ hoặc đáy hình chữ nhật có $SA \\perp$ đáy: hãy gắn trục tọa độ $Oxyz$ vào ngay để tính mọi góc và khoảng cách không lo dựng hình!',
      keyTakeaway: 'Tất cả khoảng cách điểm–đường và chéo nhau đều tính gọn bằng tích có hướng và tích hỗn tạp.',
      miniQuiz: [
        {
          id: 'm6-s3-q1',
          question: 'Khoảng cách giữa hai mặt phẳng song song $(P): 2x - y + 2z - 3 = 0$ và $(Q): 4x - 2y + 4z + 12 = 0$ bằng:',
          options: ['A. $5$', 'B. $3$', 'C. $15/3$', 'D. $1$'],
          correctIndex: 1,
          explanation: 'Chia $(Q)$ cho 2 thành $2x - y + 2z + 6 = 0$. Khi đó $d = \\frac{|-3 - 6|}{\\sqrt{4 + 1 + 4}} = \\frac{9}{3} = 3$.'
        },
        {
          id: 'm6-s3-q2',
          question: 'Nếu $[\\vec{u}_1, \\vec{u}_2] \\ne \\vec{0}$ và tích hỗn tạp $[\\vec{u}_1, \\vec{u}_2]\\cdot \\overrightarrow{M_1 M_2} \\ne 0$, vị trí tương đối của hai đường thẳng $\\Delta_1, \\Delta_2$ là:',
          options: ['A. Song song', 'B. Cắt nhau', 'C. Chéo nhau', 'D. Trùng nhau'],
          correctIndex: 2,
          explanation: 'Hai VTCP không cùng phương và tích hỗn tạp khác $0$ nghĩa là 3 vectơ không đồng phẳng $\\implies$ chéo nhau.'
        }
      ],
      miniEssay: {
        id: 'm6-s3-e1',
        question: 'Tính khoảng cách từ điểm $M(1; 2; 3)$ đến đường thẳng $\\Delta$ đi qua $A(0; 1; 1)$ và có vectơ chỉ phương $\\vec{u} = (1; 2; -2)$.',
        hint: 'Tính $\\overrightarrow{AM} = (1; 1; 2)$, rồi dùng công thức $d(M, \\Delta) = \\frac{|[\\overrightarrow{AM}, \\vec{u}]|}{|\\vec{u}|}$.',
        rubricChecklist: [
          'Tính $\\overrightarrow{AM} = (1; 1; 2)$ và $[\\overrightarrow{AM}, \\vec{u}] = (-6; 4; 1)$.',
          'Tính $|[\\overrightarrow{AM}, \\vec{u}]| = \\sqrt{36 + 16 + 1} = \\sqrt{53}$ và $|\\vec{u}| = 3 \\implies d = \\frac{\\sqrt{53}}{3}$.'
        ],
        sampleAnswer: 'Ta có $\\overrightarrow{AM} = (1 - 0;\\ 2 - 1;\\ 3 - 1) = (1; 1; 2)$ và $\\vec{u} = (1; 2; -2)$. Tích có hướng $[\\overrightarrow{AM}, \\vec{u}] = (1(-2) - 2\\cdot 2;\\ 2\\cdot 1 - 1(-2);\\ 1\\cdot 2 - 1\\cdot 1) = (-6; 4; 1)$. Khi đó $|[\\overrightarrow{AM}, \\vec{u}]| = \\sqrt{(-6)^2 + 4^2 + 1^2} = \\sqrt{53}$, và $|\\vec{u}| = \\sqrt{1 + 4 + 4} = 3$. Vậy $d(M, \\Delta) = \\frac{\\sqrt{53}}{3}$.'
      }
    }
  ],
  'math-7': [
    {
      stepTitle: '1. Thể tích Khối Chóp & Khối Lăng trụ Cơ bản',
      stepType: 'concept',
      conceptSection:
        'Thể tích mọi khối chóp bằng một phần ba tích diện tích đáy và chiều cao; thể tích khối lăng trụ bằng tích diện tích đáy và chiều cao (KHÔNG có hệ số $1/3$).',
      formulaSection: {
        primaryFormula: 'V_{\\text{chóp}} = \\frac{1}{3} S_{\\text{đáy}} \\cdot h, \\qquad V_{\\text{lăng trụ}} = S_{\\text{đáy}} \\cdot h',
        secondaryFormulas: [
          '\\text{Tam giác đều cạnh } a: S = \\frac{a^2\\sqrt{3}}{4}, \\quad h_{\\Delta} = \\frac{a\\sqrt{3}}{2}',
          '\\text{Tứ diện đều cạnh } a: V = \\frac{a^3\\sqrt{2}}{12}'
        ],
        variablesNote:
          '• **Ba mô hình chân đường cao $H$ kinh điển**:\n  1) $SA \\perp (ABC) \\implies h = SA$.\n  2) Mặt bên $(SAB) \\perp$ đáy $\\implies$ hạ $SH \\perp AB \\implies SH \\perp$ đáy.\n  3) Chóp đều hoặc các cạnh bên bằng nhau ($SA = SB = SC$) $\\implies H$ là **tâm đường tròn ngoại tiếp đáy**!'
      },
      deepDiveSection:
        'Nếu các mặt bên của hình chóp tạo với đáy các góc bằng nhau (hoặc đường cao các mặt bên bằng nhau), chân đường cao $H$ của chóp lại rơi đúng vào **tâm đường tròn nội tiếp** của đa giác đáy — nhớ phân biệt rõ 2 trường hợp "cạnh bên bằng nhau $\\to$ ngoại tiếp" và "góc mặt bên bằng nhau $\\to$ nội tiếp"!',
      teacherExplanation:
        'Quên nhân hệ số $1/3$ cho khối chóp (hoặc nhầm nhân thêm $1/3$ cho khối lăng trụ!) là sai sót phổ biến nhất khi tính thể tích.',
      keyTakeaway: 'Cạnh bên bằng nhau $\\implies$ chân đường cao là tâm ngoại tiếp đáy; $V_{\\text{chóp}} = \\frac{1}{3}S h$.',
      miniQuiz: [
        {
          id: 'm7-s1-q1',
          question: 'Khối chóp tam giác đều có cạnh đáy bằng $a$ và chiều cao bằng $2a$. Thể tích của khối chóp này bằng:',
          options: ['A. $\\frac{a^3\\sqrt{3}}{6}$', 'B. $\\frac{a^3\\sqrt{3}}{2}$', 'C. $\\frac{a^3\\sqrt{3}}{12}$', 'D. $\\frac{a^3\\sqrt{3}}{4}$'],
          correctIndex: 0,
          explanation: '$V = \\frac{1}{3} \\cdot \\frac{a^2\\sqrt{3}}{4} \\cdot 2a = \\frac{a^3\\sqrt{3}}{6}$.'
        },
        {
          id: 'm7-s1-q2',
          question: 'Cho hình chóp $S.ABC$ có $SA = SB = SC$ và đáy $ABC$ vuông tại $B$. Chân đường cao hạ từ $S$ xuống mặt phẳng $(ABC)$ trùng với:',
          options: [
            'A. Đỉnh $B$',
            'B. Trọng tâm $\\triangle ABC$',
            'C. Trung điểm cạnh huyền $AC$',
            'D. Trực tâm $\\triangle ABC$'
          ],
          correctIndex: 2,
          explanation: 'Vì $SA = SB = SC$ nên $H$ cách đều $A, B, C$ (tâm đường tròn ngoại tiếp tam giác vuông tại $B$, chính là trung điểm cạnh huyền $AC$).'
        }
      ],
      miniEssay: {
        id: 'm7-s1-e1',
        question: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, cạnh bên $SA$ vuông góc với đáy và góc giữa $SC$ với mặt đáy bằng $45^\\circ$. Tính thể tích khối chóp $S.ABCD$.',
        hint: 'Hình chiếu của $SC$ lên $(ABCD)$ là đường chéo $AC = a\\sqrt{2}$, suy ra góc $\\widehat{SCA} = 45^\\circ \\implies SA = AC$.',
        rubricChecklist: [
          'Xác định đúng góc giữa $SC$ và $(ABCD)$ là $\\widehat{SCA} = 45^\\circ$.',
          'Tính $SA = AC\\tan 45^\\circ = a\\sqrt{2} \\implies V = \\frac{1}{3}a^2 \\cdot a\\sqrt{2} = \\frac{a^3\\sqrt{2}}{3}$.'
        ],
        sampleAnswer: 'Vì $SA \\perp (ABCD)$ nên $AC$ là hình chiếu vuông góc của $SC$ lên mặt đáy $(ABCD)$. Do đó góc giữa $SC$ và đáy là $\\widehat{SCA} = 45^\\circ$. Đáy $ABCD$ là hình vuông cạnh $a$ nên $AC = a\\sqrt{2}$ và $S_{ABCD} = a^2$. Trong $\\triangle SAC$ vuông tại $A$: $SA = AC\\cdot\\tan 45^\\circ = a\\sqrt{2}$. Thể tích khối chóp là $V = \\frac{1}{3} S_{ABCD}\\cdot SA = \\frac{1}{3}\\cdot a^2\\cdot a\\sqrt{2} = \\frac{a^3\\sqrt{2}}{3}$.'
      }
    },
    {
      stepTitle: '2. Tỉ số Thể tích Simson (Khối Chóp Tam giác & Tứ giác)',
      stepType: 'derivation',
      conceptSection:
        'Công thức Simson cho phép tính cực nhanh thể tích một khối chóp cắt xéo mà **không cần dựng đường cao** mới: tỉ số thể tích hai khối chóp tam giác chung đỉnh bằng tích tỉ số độ dài 3 cạnh bên tương ứng.',
      formulaSection: {
        primaryFormula: '\\frac{V_{S.A\'B\'C\'}}{V_{S.ABC}} = \\frac{SA\'}{SA} \\cdot \\frac{SB\'}{SB} \\cdot \\frac{SC\'}{SC}',
        secondaryFormulas: [
          '\\text{Đáy hình bình hành cắt bởi } (A\'B\'C\'D\'): \\frac{V_{S.A\'B\'C\'D\'}}{V_{S.ABCD}} = \\frac{a + b + c + d}{4abcd} \\quad \\left(a=\\frac{SA}{SA\'},\\dots\\right)'
        ],
        variablesNote:
          '• **Cảnh báo đỏ**: Công thức tích 3 tỉ số $\\frac{SA\'}{SA}\\cdot\\frac{SB\'}{SB}\\cdot\\frac{SC\'}{SC}$ **CHỈ ÁP DỤNG CHO CHÓP TAM GIÁC ($S.ABC$)**! Tuyệt đối KHÔNG nhân 4 tỉ số $\\frac{SA\'}{SA}\\frac{SB\'}{SB}\\frac{SC\'}{SC}\\frac{SD\'}{SD}$ cho chóp tứ giác $S.ABCD$!\n• Với chóp đáy bình hành bị cắt bởi mặt phẳng đồng phẳng $A\'B\'C\'D\'$: các hệ số nghịch đảo thỏa $a + c = b + d$.'
      },
      deepDiveSection:
        'Để xử lý khối lăng trụ tam giác $ABC.A\'B\'C\'$ có thể tích $V$: nhớ bộ chia kinh điển cực hay dùng — một khối chóp đỉnh thuộc đáy này và đáy là mặt bên kia ($A\'.ABC$) luôn có thể tích đúng bằng **$V/3$**; phần còn lại ($A\'.BCC\'B\'$) có thể tích bằng **$2V/3$**!',
      teacherExplanation:
        'Nếu gặp chóp tứ giác $S.ABCD$ bị cắt làm 2 phần, hãy chẻ đôi đáy bằng đường chéo $AC$ thành 2 chóp tam giác $S.ABC$ và $S.ACD$ rồi mới dùng Simson!',
      keyTakeaway: 'Simson tích 3 cạnh chỉ dùng cho chóp TAM GIÁC; với chóp đáy bình hành dùng $(a+b+c+d)/(4abcd)$.',
      miniQuiz: [
        {
          id: 'm7-s2-q1',
          question: 'Cho khối chóp $S.ABC$ có thể tích $V = 24$. Gọi $M, N$ lần lượt là trung điểm của $SA, SB$ và $P$ thuộc $SC$ sao cho $SP = 2PC$. Thể tích khối chóp $S.MNP$ bằng:',
          options: ['A. $4$', 'B. $6$', 'C. $8$', 'D. $3$'],
          correctIndex: 0,
          explanation: '$\\frac{V_{S.MNP}}{V_{S.ABC}} = \\frac{1}{2}\\cdot\\frac{1}{2}\\cdot\\frac{2}{3} = \\frac{1}{6} \\implies V_{S.MNP} = \\frac{24}{6} = 4$.'
        },
        {
          id: 'm7-s2-q2',
          question: 'Cho khối lăng trụ $ABC.A\'B\'C\'$ có thể tích bằng $V$. Thể tích của khối chóp tứ giác $A\'.BCC\'B\'$ bằng:',
          options: ['A. $V/3$', 'B. $V/2$', 'C. $2V/3$', 'D. $V/4$'],
          correctIndex: 2,
          explanation: '$V_{A\'.ABC} = \\frac{1}{3}V \\implies V_{A\'.BCC\'B\'} = V - \\frac{1}{3}V = \\frac{2}{3}V$.'
        }
      ],
      miniEssay: {
        id: 'm7-s2-e1',
        question: 'Cho khối chóp $S.ABCD$ đáy hình vuông có thể tích $V = 36$. Mặt phẳng $(\\alpha)$ đi qua $A$, trung điểm $M$ của $SB$, trung điểm $N$ của $SD$ và cắt $SC$ tại $P$. Tính tỉ số $SP/SC$ và thể tích khối $S.AMPN$.',
        hint: 'Từ tính chất đồng phẳng của 4 điểm $A, M, P, N$ trên 4 cạnh bên đáy bình hành: $\\frac{SA}{SA} + \\frac{SC}{SP} = \\frac{SB}{SM} + \\frac{SD}{SN} \\implies 1 + \\frac{SC}{SP} = 2 + 2 = 4 \\implies \\frac{SP}{SC} = \\frac{1}{3}$.',
        rubricChecklist: [
          'Tìm đúng $a=1, b=2, d=2 \\implies c = \\frac{SC}{SP} = 2 + 2 - 1 = 3 \\implies \\frac{SP}{SC} = \\frac{1}{3}$.',
          'Tính tỉ số thể tích $\\frac{V_{S.AMPN}}{V_{S.ABCD}} = \\frac{1 + 2 + 3 + 2}{4\\cdot 1\\cdot 2\\cdot 3\\cdot 2} = \\frac{8}{48} = \\frac{1}{6} \\implies V_{S.AMPN} = 6$.'
        ],
        sampleAnswer: 'Đặt $a = \\frac{SA}{SA} = 1$, $b = \\frac{SB}{SM} = 2$, $d = \\frac{SD}{SN} = 2$, $c = \\frac{SC}{SP}$. Vì đáy là hình vuông (hình bình hành) và $A, M, P, N$ đồng phẳng nên $a + c = b + d \\Rightarrow 1 + c = 2 + 2 \\Rightarrow c = 3 \\Rightarrow \\frac{SP}{SC} = \\frac{1}{3}$. Áp dụng công thức chóp đáy bình hành: $\\frac{V_{S.AMPN}}{V_{S.ABCD}} = \\frac{a + b + c + d}{4abcd} = \\frac{1 + 2 + 3 + 2}{4\\cdot 1\\cdot 2\\cdot 3\\cdot 2} = \\frac{8}{48} = \\frac{1}{6}$. Vậy $V_{S.AMPN} = \\frac{36}{6} = 6$.'
      }
    },
    {
      stepTitle: '3. Góc & Khoảng cách trong Hình học Không gian Cổ điển',
      stepType: 'example',
      conceptSection:
        'Để tính được chiều cao $h$ của hình chóp hoặc lăng trụ xiên, 90% bài toán cung cấp dữ kiện **góc giữa đường thẳng và mặt phẳng**, **góc giữa hai mặt phẳng**, hoặc **khoảng cách từ điểm đến mặt phẳng**.',
      formulaSection: {
        primaryFormula: 'd(A, (SBC)) = \\frac{3 V_{S.ABC}}{S_{\\triangle SBC}}, \\qquad \\frac{d(M, (P))}{d(A, (P))} = \\frac{MI}{AI} \\text{ (với } I = MA \\cap (P))',
        secondaryFormulas: [
          '\\text{Hệ thức chân đường cao vuông góc 3 đoạn: } \\frac{1}{h^2} = \\frac{1}{SA^2} + \\frac{1}{AK^2}'
        ],
        variablesNote:
          '• **Kỹ thuật dời điểm tính khoảng cách**: nếu cần tính $d(M, (P))$ rất khó dựng, hãy quy về khoảng cách từ **chân đường cao $A$** nhờ giao điểm $MA \\cap (P)$ hoặc tính chất song song $MA \\parallel (P)$!\n• Dựng góc hai mặt phẳng $(SBC)$ và đáy $(ABC)$ tại chân đường cao $A$: từ $A$ kẻ $AK \\perp BC$, nối $SK \\implies$ góc cần tìm là $\\widehat{SKA}$.'
      },
      deepDiveSection:
        'Mô hình "3 nét kẻ" từ chân đường cao $A$ (với $SA \\perp$ đáy) xuống mặt bên $(SBC)$: (1) Từ $A$ kẻ $AK \\perp BC$; (2) Nối $SK$; (3) Kẻ $AH \\perp SK$. Khi đó $d(A, (SBC)) = AH$ và tính ngay bằng $\\frac{1}{AH^2} = \\frac{1}{SA^2} + \\frac{1}{AK^2}$!',
      teacherExplanation:
        'Gặp hình chóp có $SA \\perp$ đáy, luôn xuất phát từ chân đường cao $A$ để dựng góc và khoảng cách — mọi thứ đều trở nên 3 dòng!',
      keyTakeaway: 'Kỹ thuật dời điểm về chân đường cao $A$ + quy tắc 3 nét kẻ giải quyết hầu hết góc và khoảng cách.',
      miniQuiz: [
        {
          id: 'm7-s3-q1',
          question: 'Cho hình chóp $S.ABC$ có $SA \\perp (ABC)$, $SA = a$, đáy $\\triangle ABC$ vuông cân tại $B$ với $AB = BC = a$. Khoảng cách từ $A$ đến mặt phẳng $(SBC)$ bằng:',
          options: ['A. $\\frac{a\\sqrt{2}}{2}$', 'B. $\\frac{a\\sqrt{3}}{3}$', 'C. $a$', 'D. $\\frac{a}{2}$'],
          correctIndex: 0,
          explanation: 'Vì $BC \\perp AB$ và $BC \\perp SA \\implies BC \\perp (SAB)$. Kẻ $AH \\perp SB$ thì $AH \\perp (SBC) \\implies d = \\frac{SA\\cdot AB}{\\sqrt{SA^2+AB^2}} = \\frac{a\\sqrt{2}}{2}$.'
        },
        {
          id: 'm7-s3-q2',
          question: 'Nếu $M$ là trung điểm của đoạn $SA$ và đường thẳng $SA$ cắt mặt phẳng $(P)$ tại $S$, tỉ số $\\frac{d(M, (P))}{d(A, (P))}$ bằng:',
          options: ['A. $1$', 'B. $2$', 'C. $1/2$', 'D. $1/3$'],
          correctIndex: 2,
          explanation: '$\\frac{d(M, (P))}{d(A, (P))} = \\frac{MS}{AS} = \\frac{1}{2}$.'
        }
      ],
      miniEssay: {
        id: 'm7-s3-e1',
        question: 'Cho hình chóp $S.ABC$ có $SA \\perp (ABC)$, $SA = a\\sqrt{3}$, đáy $ABC$ là tam giác đều cạnh $2a$. Tính khoảng cách từ $A$ đến $(SBC)$ và từ trọng tâm $G$ của $\\triangle ABC$ đến $(SBC)$.',
        hint: 'Gọi $M$ là trung điểm $BC$, $AM = a\\sqrt{3}$, kẻ $AH \\perp SM$ tính $d(A, (SBC))$; dời điểm từ $A$ sang $G$ với $GM/AM = 1/3$.',
        rubricChecklist: [
          'Kẻ $AM \\perp BC$ ($AM = \\frac{2a\\sqrt{3}}{2} = a\\sqrt{3}$) và $AH \\perp SM \\implies d(A, (SBC)) = \\frac{SA\\cdot AM}{\\sqrt{SA^2 + AM^2}} = \\frac{a\\sqrt{3}\\cdot a\\sqrt{3}}{a\\sqrt{6}} = \\frac{a\\sqrt{6}}{2}$.',
          'Dời điểm qua giao điểm $M$ trên $BC \\subset (SBC)$: $\\frac{d(G, (SBC))}{d(A, (SBC))} = \\frac{GM}{AM} = \\frac{1}{3} \\implies d(G, (SBC)) = \\frac{a\\sqrt{6}}{6}$.'
        ],
        sampleAnswer: 'Gọi $M$ là trung điểm $BC$. Vì $\\triangle ABC$ đều cạnh $2a$ nên $AM \\perp BC$ và $AM = a\\sqrt{3}$. Lại có $SA \\perp BC \\Rightarrow BC \\perp (SAM)$. Trong $\\triangle SAM$ vuông tại $A$, kẻ $AH \\perp SM \\Rightarrow AH \\perp (SBC)$. Khi đó $d(A, (SBC)) = AH = \\frac{SA\\cdot AM}{\\sqrt{SA^2 + AM^2}} = \\frac{a\\sqrt{3}\\cdot a\\sqrt{3}}{\\sqrt{3a^2 + 3a^2}} = \\frac{3a}{\\sqrt{6}} = \\frac{a\\sqrt{6}}{2}$. Do $AG \\cap (SBC) = M$ với $GM = \\frac{1}{3}AM$, ta có $d(G, (SBC)) = \\frac{1}{3} d(A, (SBC)) = \\frac{a\\sqrt{6}}{6}$.'
      }
    }
  ]
};
