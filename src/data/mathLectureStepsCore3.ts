import { LectureStep } from '../types';

export const MATH_CUSTOM_LECTURE_STEPS_CORE3: Record<string, LectureStep[]> = {
  'math-8': [
    {
      stepTitle: '1. Hàm số Mũ & Lôgarit: Tập xác định, Đạo hàm & Tiệm cận',
      stepType: 'concept',
      conceptSection:
        'Hàm số mũ $y = a^x$ và hàm số lôgarit $y = \\log_a x$ ($0 < a \\neq 1$) là hai hàm ngược nhau, đối xứng nhau qua đường phân giác $y = x$. Tính đơn điệu của cả hai hàm phụ thuộc hoàn toàn vào việc cơ số $a$ lớn hơn $1$ hay nằm trong $(0; 1)$.',
      formulaSection: {
        primaryFormula: '(a^x)\' = a^x\\ln a, \\qquad (\\log_a x)\' = \\frac{1}{x\\ln a}',
        secondaryFormulas: [
          'a > 1 \\implies \\text{Đồng biến}; \\qquad 0 < a < 1 \\implies \\text{Nghịch biến}',
          'y = a^x \\text{ có TCN } y = 0; \\qquad y = \\log_a x \\text{ có TCĐ } x = 0'
        ],
        variablesNote:
          '• **Điều kiện xác định Lôgarit**: biểu thức bên trong $\\log_a f(x)$ bắt buộc $f(x) > 0$ (ngặt!).\n• Đạo hàm hàm hợp cực hay thi: $(a^u)\' = u\' a^u\\ln a$ và $(\\log_a |u|)\' = \\frac{u\'}{u\\ln a}$.'
      },
      deepDiveSection:
        'Mẹo so sánh cơ số trên cùng đồ thị: Với đồ thị hàm mũ $y = a^x$, kẻ đường thẳng đứng **$x = 1$**, tung độ giao điểm chính là $a$. Với đồ thị lôgarit $y = \\log_a x$, kẻ đường ngang **$y = 1$**, hoành độ giao điểm chính là $a$!',
      teacherExplanation:
        'Đừng quên tập giá trị: hàm $y = a^x$ luôn dương ($a^x > 0$) nên nhận $Ox$ làm tiệm cận ngang; hàm $y = \\log_a x$ chỉ nhận $x > 0$ nên nhận $Oy$ làm tiệm cận đứng.',
      keyTakeaway: 'Cơ số $a > 1$ đồng biến, $0 < a < 1$ nghịch biến; luôn đặt điều kiện $f(x) > 0$ cho lôgarit.',
      miniQuiz: [
        {
          id: 'm8-s1-q1',
          question: 'Tập xác định của hàm số $y = \\log_2(x^2 - 4x + 3)$ là:',
          options: [
            'A. $(1; 3)$',
            'B. $(-\\infty; 1) \\cup (3; +\\infty)$',
            'C. $(-\\infty; 1] \\cup [3; +\\infty)$',
            'D. $\\mathbb{R} \\setminus \\{1; 3\\}$'
          ],
          correctIndex: 1,
          explanation: '$x^2 - 4x + 3 > 0 \\iff x < 1$ hoặc $x > 3$.'
        },
        {
          id: 'm8-s1-q2',
          question: 'Đạo hàm của hàm số $y = 3^{x^2 - x}$ là:',
          options: [
            'A. $3^{x^2-x}\\ln 3$',
            'B. $(2x - 1)3^{x^2-x}$',
            'C. $(2x - 1)3^{x^2-x}\\ln 3$',
            'D. $(x^2 - x)3^{x^2-x-1}$'
          ],
          correctIndex: 2,
          explanation: 'Theo $(a^u)\' = u\' a^u \\ln a$ với $u = x^2 - x$, ta được $(2x - 1)3^{x^2 - x}\\ln 3$.'
        }
      ],
      miniEssay: {
        id: 'm8-s1-e1',
        question: 'Tìm $m$ để hàm số $y = \\ln(x^2 - 2mx + 4)$ có tập xác định là toàn bộ $\\mathbb{R}$.',
        hint: 'Yêu cầu $x^2 - 2mx + 4 > 0$ với mọi $x \\in \\mathbb{R}$, tức $\\Delta\' < 0$ (với $a = 1 > 0$).',
        rubricChecklist: [
          'Viết đúng điều kiện $x^2 - 2mx + 4 > 0\\ \\forall x \\in \\mathbb{R}$.',
          'Giải $\\Delta\' = m^2 - 4 < 0 \\iff -2 < m < 2$ (không lấy dấu bằng).'
        ],
        sampleAnswer: 'Hàm số xác định trên $\\mathbb{R}$ khi và chỉ khi biểu thức trong lôgarit luôn dương: $x^2 - 2mx + 4 > 0\\ \\forall x \\in \\mathbb{R}$. Vì hệ số $a = 1 > 0$, điều kiện tương đương $\\Delta\' = m^2 - 4 < 0 \\Leftrightarrow -2 < m < 2$.'
      }
    },
    {
      stepTitle: '2. Phương trình & Bất phương trình Mũ – Lôgarit',
      stepType: 'derivation',
      conceptSection:
        'Khi giải bất phương trình $a^{f(x)} > a^{g(x)}$ hoặc $\\log_a f(x) > \\log_a g(x)$, dấu bất đẳng thức **giữ nguyên chiều** nếu $a > 1$ và **đổi chiều ngược lại** nếu $0 < a < 1$.',
      formulaSection: {
        primaryFormula: '\\log_a f(x) > \\log_a g(x) \\iff \\begin{cases} 0 < g(x) < f(x) & (a > 1) \\\\ 0 < f(x) < g(x) & (0 < a < 1) \\end{cases}',
        secondaryFormulas: [
          '\\text{Phương pháp hóa đẳng cấp: } m\\cdot a^{2x} + n\\cdot (ab)^x + p\\cdot b^{2x} = 0 \\xrightarrow{:(b^{2x})} m\\left(\\frac{a}{b}\\right)^{2x} + \\dots = 0',
          '\\text{Đặt ẩn phụ hàm mũ luôn có điều kiện } t = a^x > 0'
        ],
        variablesNote:
          '• **Cảnh báo mất nghiệm / thừa nghiệm**: Khi áp dụng $\\log_a(u\\cdot v) = \\log_a u + \\log_a v$ phải đảm bảo cả $u, v > 0$; khi đưa mũ chẵn ra ngoài $\\log_a x^2 = 2\\log_a |x|$ (nhớ dấu $|\\cdot|$ nếu $x$ có thể âm!).'
      },
      deepDiveSection:
        'Nếu phương trình chứa hỗn hợp $a^{f(x)}$ và $b^{g(x)}$ không cùng cơ số, dùng ngay kỹ thuật **lôgarit hóa hai vế** theo cơ số $a$ hoặc $b$, hoặc đánh giá tính đơn điệu (vế trái đồng biến, vế phải hằng số hoặc nghịch biến $\\implies$ có tối đa 1 nghiệm duy nhất nhẩm được!).',
      teacherExplanation:
        'Trong bất phương trình lôgarit cơ số nhỏ hơn 1 (như $\\log_{0{,}5}$ hay $\\log_{1/3}$), vừa phải **đảo chiều bất đẳng thức** vừa phải kẹp điều kiện biểu thức lớn hơn $0$!',
      keyTakeaway: 'Cơ số $0 < a < 1$ khi bỏ mũ/lôgarit PHẢI đảo chiều BPT; đặt $t = a^x$ luôn kèm $t > 0$.',
      miniQuiz: [
        {
          id: 'm8-s2-q1',
          question: 'Tập nghiệm của bất phương trình $\\log_{0{,}5}(x - 1) > -2$ là:',
          options: ['A. $(5; +\\infty)$', 'B. $(1; 5)$', 'C. $(-\\infty; 5)$', 'D. $(1; 3)$'],
          correctIndex: 1,
          explanation: 'Điều kiện $x > 1$. Vì cơ số $0{,}5 < 1$, đảo chiều BPT: $x - 1 < (0{,}5)^{-2} = 4 \\iff x < 5$. Kết hợp: $1 < x < 5$.'
        },
        {
          id: 'm8-s2-q2',
          question: 'Phương trình $9^x - 4\\cdot 3^x + 3 = 0$ có hai nghiệm $x_1, x_2$. Tổng $x_1 + x_2$ bằng:',
          options: ['A. $4$', 'B. $3$', 'C. $1$', 'D. $0$'],
          correctIndex: 2,
          explanation: 'Đặt $t = 3^x > 0$: $t^2 - 4t + 3 = 0 \\iff t = 1$ ($x=0$) hoặc $t = 3$ ($x=1$). Tổng $x_1 + x_2 = 1$ (hoặc $\\log_3(t_1 t_2) = \\log_3 3 = 1$).'
        }
      ],
      miniEssay: {
        id: 'm8-s2-e1',
        question: 'Giải bất phương trình $\\log_2(2x - 1) - \\log_{\\frac{1}{2}}(x + 1) \\le 1$.',
        hint: 'Đổi $-\\log_{1/2}(x+1) = +\\log_2(x+1)$ rồi gộp thành tích với điều kiện $x > 1/2$.',
        rubricChecklist: [
          'Đặt đúng ĐK $x > 1/2$ và biến đổi $\\log_2[(2x-1)(x+1)] \\le 1$.',
          'Giải $(2x-1)(x+1) \\le 2 \\iff 2x^2 + x - 3 \\le 0 \\iff -\\frac{3}{2} \\le x \\le 1$. Giao ĐK được $S = \\left(\\frac{1}{2}; 1\\right]$.'
        ],
        sampleAnswer: 'Điều kiện xác định: $\\begin{cases} 2x - 1 > 0 \\\\ x + 1 > 0 \\end{cases} \\Leftrightarrow x > \\frac{1}{2}$. Vì $\\log_{1/2}(x+1) = -\\log_2(x+1)$, bất phương trình trở thành $\\log_2(2x - 1) + \\log_2(x + 1) \\le 1 \\Leftrightarrow \\log_2[(2x - 1)(x + 1)] \\le \\log_2 2 \\Leftrightarrow 2x^2 + x - 1 \\le 2 \\Leftrightarrow 2x^2 + x - 3 \\le 0 \\Leftrightarrow -\\frac{3}{2} \\le x \\le 1$. Kết hợp điều kiện $x > \\frac{1}{2}$, tập nghiệm là $S = \\left(\\frac{1}{2};\\, 1\\right]$.'
      }
    },
    {
      stepTitle: '3. Bài toán Lãi kép, Gửi góp Hàng tháng & Tăng trưởng Thực tế',
      stepType: 'example',
      conceptSection:
        'Các bài toán tài chính ngân hàng và tăng trưởng dân số/phóng xạ đều mô hình hóa bằng cấp số nhân theo thời gian.',
      formulaSection: {
        primaryFormula: '\\text{Lãi kép gửi 1 lần: } A_n = P(1 + r)^n',
        secondaryFormulas: [
          '\\text{Gửi góp đều đặn đầu mỗi tháng } m: S_n = \\frac{m(1 + r)}{r}\\left[(1 + r)^n - 1\\right]',
          '\\text{Trả góp vay } P \\text{ cuối mỗi tháng: } m = \\frac{P\\cdot r(1 + r)^n}{(1 + r)^n - 1}'
        ],
        variablesNote:
          '• $r$: lãi suất **một kỳ hạn** (nếu đề cho lãi $6\\%$/năm và tính lãi theo tháng thì $r = 0{,}5\\%$/tháng $= 0{,}005$!).\n• $n$: tổng số kỳ hạn tính lãi; khi giải tìm $n$ nhớ dùng $\\log_{1+r}$.'
      },
      deepDiveSection:
        'Phân biệt cực kỹ "gửi tiền vào đầu kỳ" vs "trả nợ vào cuối kỳ": Khi gửi tiết kiệm vào **đầu mỗi tháng**, đồng tiền gửi tháng cuối cùng cũng được sinh lãi 1 tháng nên có thêm thừa số $(1+r)$ ở tử số; còn khi vay trả góp **sau 1 tháng mới trả kỳ đầu**, đồng tiền trả tháng cuối không sinh lãi nên không có $(1+r)$ phụ trội đó.',
      teacherExplanation:
        'Luôn kiểm tra đơn vị của lãi suất $r$ và số kỳ $n$ phải khớp nhau (cùng theo tháng, quý, hoặc năm)!',
      keyTakeaway: 'Lãi kép 1 lần $P(1+r)^n$; tìm số kỳ hạn tối thiểu $n$ bằng lấy lôgarit cơ số $(1+r)$ rồi làm tròn lên.',
      miniQuiz: [
        {
          id: 'm8-s3-q1',
          question: 'Gửi tiết kiệm $100$ triệu đồng với lãi suất $0{,}6\\%$/tháng theo thể thức lãi kép. Sau đúng $12$ tháng, tổng số tiền nhận được gần nhất với:',
          options: ['A. $107{,}20$ triệu', 'B. $107{,}44$ triệu', 'C. $108{,}12$ triệu', 'D. $106{,}00$ triệu'],
          correctIndex: 1,
          explanation: '$A = 100(1 + 0{,}006)^{12} \\approx 107{,}442$ triệu đồng.'
        },
        {
          id: 'm8-s3-q2',
          question: 'Dân số một thành phố hiện có $2$ triệu người, tăng trưởng đều $2\\%$/năm. Tối thiểu sau bao nhiêu năm nguyên thì dân số vượt quá $2{,}5$ triệu người?',
          options: ['A. 11 năm', 'B. 12 năm', 'C. 13 năm', 'D. 10 năm'],
          correctIndex: 1,
          explanation: '$2(1{,}02)^n > 2{,}5 \\iff n > \\log_{1{,}02}(1{,}25) \\approx 11{,}27 \\implies$ tối thiểu $12$ năm.'
        }
      ],
      miniEssay: {
        id: 'm8-s3-e1',
        question: 'Một sinh viên đầu mỗi tháng gửi đều đặn $2$ triệu đồng vào ngân hàng theo lãi kép $0{,}5\\%$/tháng. Hỏi sau đúng 1 năm (12 tháng), ngay sau khi ngân hàng cộng lãi tháng thứ 12 thì tổng tiền nhận về khoảng bao nhiêu?',
        hint: 'Áp dụng công thức gửi đều đầu tháng $S_n = \\frac{m(1+r)}{r}[(1+r)^n - 1]$ với $m = 2$, $r = 0{,}005$, $n = 12$.',
        rubricChecklist: [
          'Viết đúng công thức $S_{12} = \\frac{2(1{,}005)}{0{,}005}[(1{,}005)^{12} - 1]$.',
          'Tính $(1{,}005)^{12} \\approx 1{,}06168 \\implies S_{12} \\approx 402 \\cdot 0{,}06168 \\approx 24{,}79$ triệu đồng.'
        ],
        sampleAnswer: 'Đầu mỗi tháng gửi $m = 2$ triệu, lãi suất $r = 0{,}5\\% = 0{,}005$/tháng trong $n = 12$ tháng. Số tiền cả gốc lẫn lãi cuối tháng 12 là:\n$S_{12} = \\frac{m(1+r)}{r}\\big[(1+r)^{12} - 1\\big] = \\frac{2\\times 1{,}005}{0{,}005}\\big[(1{,}005)^{12} - 1\\big] \\approx 402 \\times 0{,}0616778 \\approx 24{,}79$ triệu đồng.'
      }
    }
  ],
  'math-9': [
    {
      stepTitle: '1. Dạng Đại số $z = a + bi$, Số phức Liên hợp & Môđun',
      stepType: 'concept',
      conceptSection:
        'Số phức $z = a + bi$ ($a, b \\in \\mathbb{R}$, $i^2 = -1$) có **phần thực** là $a$, **phần ảo** là $b$ (lưu ý phần ảo là số thực $b$, KHÔNG chứa $i$!). Hai số phức bằng nhau khi phần thực bằng phần thực và phần ảo bằng phần ảo.',
      formulaSection: {
        primaryFormula: '\\bar{z} = a - bi, \\qquad |z| = \\sqrt{a^2 + b^2}, \\qquad z\\cdot\\bar{z} = |z|^2',
        secondaryFormulas: [
          '|z_1\\cdot z_2| = |z_1|\\cdot|z_2|, \\qquad \\left|\\frac{z_1}{z_2}\\right| = \\frac{|z_1|}{|z_2|}',
          'i^{4k} = 1,\\quad i^{4k+1} = i,\\quad i^{4k+2} = -1,\\quad i^{4k+3} = -i'
        ],
        variablesNote:
          '• **Bẫy kinh điển**: Phần ảo của $z = 3 - 5i$ là **$-5$**, KHÔNG phải $-5i$!\n• Muốn chia $\\frac{z_1}{z_2}$, nhân cả tử và mẫu với **liên hợp $\\bar{z}_2$** để biến mẫu thành số thực $|z_2|^2$.'
      },
      deepDiveSection:
        'Khi gặp phương trình chứa cả $z$ và $\\bar{z}$ mà không có điều kiện nâng cao (như $2z + 3\\bar{z} = 5 - 2i$), đặt $z = a + bi$ rồi đồng nhất thực–ảo giải hệ 2 ẩn. Nhưng nếu gặp dạng bậc nhất chỉ có $z$ và $|z|$ (như $(1+i)z + 2|z| = 3 + i$), lấy môđun hai vế trước hoặc cô lập $z$ theo $|z|$ rồi mới lấy môđun!',
      teacherExplanation:
        'Nhớ quy tắc bất biến: $z\\cdot\\bar{z} = |z|^2 = a^2 + b^2$ và phần ảo KHÔNG bao giờ viết kèm chữ $i$.',
      keyTakeaway: 'Phần ảo của $a + bi$ là $b$; chia số phức nhân liên hợp mẫu; $z\\bar{z} = |z|^2$.',
      miniQuiz: [
        {
          id: 'm9-s1-q1',
          question: 'Cho số phức $z = (2 - i)(1 + 3i)$. Phần thực và phần ảo của số phức liên hợp $\\bar{z}$ lần lượt là:',
          options: ['A. $5$ và $5$', 'B. $5$ và $-5$', 'C. $-1$ và $5$', 'D. $5$ và $-5i$'],
          correctIndex: 1,
          explanation: '$z = 2 + 6i - i - 3i^2 = 5 + 5i \\implies \\bar{z} = 5 - 5i$. Phần thực là $5$, phần ảo là $-5$.'
        },
        {
          id: 'm9-s1-q2',
          question: 'Môđun của số phức $z = \\frac{(1 + i)^{10}}{1 - i}$ bằng:',
          options: ['A. $32$', 'B. $16\\sqrt{2}$', 'C. $16$', 'D. $32\\sqrt{2}$'],
          correctIndex: 1,
          explanation: '$|z| = \\frac{|1 + i|^{10}}{|1 - i|} = \\frac{(\\sqrt{2})^{10}}{\\sqrt{2}} = (\\sqrt{2})^9 = 16\\sqrt{2}$.'
        }
      ],
      miniEssay: {
        id: 'm9-s1-e1',
        question: 'Tìm số phức $z$ thỏa mãn $(1 + 2i)z + 3\\bar{z} = 10 + 4i$.',
        hint: 'Đặt $z = x + yi$ ($x, y \\in \\mathbb{R}$), thay $\\bar{z} = x - yi$, thu gọn phần thực và phần ảo rồi đồng nhất hệ 2 phương trình.',
        rubricChecklist: [
          'Khai triển $(1 + 2i)(x + yi) + 3(x - yi) = (4x - 2y) + (2x - 2y)i$.',
          'Giải hệ $4x - 2y = 10$ và $2x - 2y = 4 \\implies x = 3,\\ y = 1 \\implies z = 3 + i$.'
        ],
        sampleAnswer: 'Đặt $z = x + yi$ ($x, y \\in \\mathbb{R}$), khi đó $\\bar{z} = x - yi$. Phương trình trở thành:\n$(1 + 2i)(x + yi) + 3(x - yi) = 10 + 4i \\Leftrightarrow (x - 2y + 3x) + (2x + y - 3y)i = 10 + 4i \\Leftrightarrow (4x - 2y) + (2x - 2y)i = 10 + 4i$.\nĐồng nhất thực – ảo: $\\begin{cases} 4x - 2y = 10 \\\\ 2x - 2y = 4 \\end{cases} \\Leftrightarrow \\begin{cases} 2x = 6 \\Rightarrow x = 3 \\\\ y = x - 2 = 1 \\end{cases}$. Vậy $z = 3 + i$.'
      }
    },
    {
      stepTitle: '2. Phương trình Bậc hai trên $\\mathbb{C}$ & Nghiệm Phức Liên hợp',
      stepType: 'derivation',
      conceptSection:
        'Trên tập số phức $\\mathbb{C}$, mọi phương trình bậc hai hệ số thực $az^2 + bz + c = 0$ ($a \\neq 0$) luôn có đúng 2 nghiệm (tính cả nghiệm kép). Khi $\\Delta < 0$, phương trình có hai nghiệm phức là **hai số phức liên hợp của nhau**.',
      formulaSection: {
        primaryFormula: '\\Delta = b^2 - 4ac < 0 \\implies z_{1,2} = \\frac{-b \\pm i\\sqrt{|\\Delta|}}{2a}',
        secondaryFormulas: [
          '|z_1| = |z_2| = \\sqrt{\\frac{c}{a}} \\quad (\\text{khi } \\Delta < 0)',
          'z_1 + z_2 = -\\frac{b}{a}, \\qquad z_1 z_2 = \\frac{c}{a}'
        ],
        variablesNote:
          '• Khi hệ số $a, b, c \\in \\mathbb{R}$ và biết $z_1 = \\alpha + \\beta i$ là một nghiệm thì nghiệm kia **chắc chắn là $\\bar{z}_1 = \\alpha - \\beta i$**!\n• Để giải nhanh cực trị hoặc tổng bình phương môđun 2 nghiệm khi $\\Delta < 0$: dùng ngay $|z_1|^2 = |z_2|^2 = c/a$ mà không cần giải cụ thể nghiệm!'
      },
      deepDiveSection:
        'Chú ý phân biệt phương trình bậc hai **hệ số thực** vs **hệ số phức**: Định lý Vi-ét $z_1 + z_2 = -b/a$, $z_1 z_2 = c/a$ đúng cho **mọi phương trình bậc hai** kể cả hệ số phức, nhưng tính chất "$z_2 = \\bar{z}_1$ và $|z_1|^2 = c/a$ khi $\\Delta < 0$" chỉ đúng khi $a, b, c \\in \\mathbb{R}$!',
      teacherExplanation:
        'Mẹo tính nhanh giá trị $|z_1|^2 + |z_2|^2$ khi PT hệ số thực có $\\Delta < 0$: bằng đúng $2 \\cdot \\frac{c}{a}$!',
      keyTakeaway: 'Khi $a,b,c \\in \\mathbb{R}$ và $\\Delta < 0$: hai nghiệm là $z_0$ và $\\bar{z}_0$, với $|z_1| = |z_2| = \\sqrt{c/a}$.',
      miniQuiz: [
        {
          id: 'm9-s2-q1',
          question: 'Gọi $z_1, z_2$ là hai nghiệm phức của phương trình $z^2 - 2z + 5 = 0$. Giá trị của $|z_1|^2 + |z_2|^2$ bằng:',
          options: ['A. $5$', 'B. $10$', 'C. $4$', 'D. $2\\sqrt{5}$'],
          correctIndex: 1,
          explanation: '$\\Delta\' = 1 - 5 = -4 < 0$, nên $|z_1|^2 = |z_2|^2 = c/a = 5 \\implies |z_1|^2 + |z_2|^2 = 10$.'
        },
        {
          id: 'm9-s2-q2',
          question: 'Biết $z_1 = 2 - 3i$ là một nghiệm của phương trình $z^2 + bz + c = 0$ ($b, c \\in \\mathbb{R}$). Giá trị $b + c$ bằng:',
          options: ['A. $9$', 'B. $17$', 'C. $-9$', 'D. $13$'],
          correctIndex: 0,
          explanation: 'Nghiệm thứ hai là $z_2 = 2 + 3i$. Theo Vi-ét: $b = -(z_1 + z_2) = -4$, $c = z_1 z_2 = 4 + 9 = 13 \\implies b + c = 9$.'
        }
      ],
      miniEssay: {
        id: 'm9-s2-e1',
        question: 'Tìm $m \\in \\mathbb{R}$ để phương trình $z^2 - 2mz + 3m + 4 = 0$ có hai nghiệm phức $z_1, z_2$ thỏa mãn $|z_1| = 2$ (xét cả hai trường hợp $\\Delta\' \\ge 0$ và $\\Delta\' < 0$).',
        hint: 'TH1: $\\Delta\' \\ge 0$ (nghiệm thực $z_1 = \\pm 2$ thay trực tiếp vào PT). TH2: $\\Delta\' < 0$ ($|z_1|^2 = c/a = 3m + 4 = 4 \\implies m = 0$).',
        rubricChecklist: [
          'TH1 ($\\Delta\' = m^2 - 3m - 4 \\ge 0 \\iff m \\le -1$ hoặc $m \\ge 4$): thay $z = 2 \\implies m = 8$; thay $z = -2 \\implies m = -8/7$ (cả hai thỏa $\\Delta\' \\ge 0$).',
          'TH2 ($-1 < m < 4$): $|z_1|^2 = 3m + 4 = 4 \\implies m = 0$ (nhận).'
        ],
        sampleAnswer: 'Ta có $\\Delta\' = m^2 - 3m - 4$.\n• Trường hợp 1: $\\Delta\' \\ge 0 \\Leftrightarrow m \\le -1$ hoặc $m \\ge 4$ (nghiệm thực). Khi $|z_1| = 2 \\Leftrightarrow z_1 = 2$ hoặc $z_1 = -2$. Thay $z = 2$: $4 - 4m + 3m + 4 = 0 \\Rightarrow m = 8$ (thỏa). Thay $z = -2$: $4 + 4m + 3m + 4 = 0 \\Rightarrow m = -\\frac{8}{7}$ (thỏa).\n• Trường hợp 2: $\\Delta\' < 0 \\Leftrightarrow -1 < m < 4$. Hai nghiệm phức liên hợp có $|z_1|^2 = c/a = 3m + 4 = 2^2 = 4 \\Rightarrow m = 0$ (thỏa).\nVậy $m \\in \\{0;\\ 8;\\ -\\frac{8}{7}\\}$.'
      }
    },
    {
      stepTitle: '3. Biểu diễn Hình học, Quỹ tích Đường tròn – Đường thẳng & Min/Max Môđun',
      stepType: 'example',
      conceptSection:
        'Mỗi số phức $z = x + yi$ tương ứng $1-1$ với điểm $M(x; y)$ trên mặt phẳng phức $Oxy$. Khoảng cách giữa hai điểm biểu diễn $z_1$ và $z_2$ chính bằng môđun hiệu $|z_1 - z_2|$.',
      formulaSection: {
        primaryFormula: '|z - z_0| = R \\iff \\text{Đường tròn tâm } I(z_0),\\text{ bán kính } R',
        secondaryFormulas: [
          '|z - z_1| = |z - z_2| \\iff \\text{Đường trung trực đoạn } AB\\ (A(z_1),\\ B(z_2))',
          '\\text{Cực trị trên đường tròn: } |z - z_1|_{\\min} = |IA - R|, \\quad |z - z_1|_{\\max} = IA + R'
        ],
        variablesNote:
          '• **Mẹo giải nhanh $|w - z_0| = k$ với $w = az + b$**: rút thừa số chung $a$ ra ngoài dấu môđun ($|a||z - \\dots| = k$) để đọc thẳng tâm và bán kính quỹ tích $z$!\n• Khi điểm $M(z)$ chạy trên đường tròn $(I; R)$ và $A$ cố định ngoài đường tròn: đoạn $MA$ ngắn nhất bằng $IA - R$, dài nhất bằng $IA + R$.'
      },
      deepDiveSection:
        'Bài toán Elip kinh điển trong đề thi: nếu đề cho $|z - c| + |z + c| = 2a$ ($a > c > 0$), điểm $M(z)$ chạy trên đường Elip nhận tiêu cự $2c$, bán trục lớn $a$, bán trục nhỏ $b = \\sqrt{a^2 - c^2}$!',
      teacherExplanation:
        'Gặp $|z - z_0| = R$, lập tức vẽ đường tròn tâm $I(z_0)$ bán kính $R$ trên nháp — mọi bài Min–Max môđun đều quy về khoảng cách hình học lớp 10!',
      keyTakeaway: '$|z - z_0| = R$ là đường tròn; $|z - z_1| = |z - z_2|$ là đường thẳng trung trực.',
      miniQuiz: [
        {
          id: 'm9-s3-q1',
          question: 'Tập hợp các điểm biểu diễn số phức $z$ thỏa mãn $|z - 3 + 4i| = 2$ là:',
          options: [
            'A. Đường tròn tâm $I(-3; 4)$, bán kính $R = 2$',
            'B. Đường tròn tâm $I(3; -4)$, bán kính $R = 2$',
            'C. Đường tròn tâm $I(3; -4)$, bán kính $R = 4$',
            'D. Đường thẳng qua $(3; -4)$'
          ],
          correctIndex: 1,
          explanation: 'Viết lại $|z - (3 - 4i)| = 2$, nên tâm $I(3; -4)$ và bán kính $R = 2$.'
        },
        {
          id: 'm9-s3-q2',
          question: 'Cho số phức $z$ thỏa mãn $|z - 3 - 4i| = 2$. Giá trị lớn nhất của $|z|$ bằng:',
          options: ['A. $3$', 'B. $5$', 'C. $7$', 'D. $9$'],
          correctIndex: 2,
          explanation: '$M(z)$ thuộc đường tròn tâm $I(3; 4)$, $R = 2$. Độ dài $OI = \\sqrt{3^2 + 4^2} = 5$. Vậy $|z|_{\\max} = OM_{\\max} = OI + R = 5 + 2 = 7$.'
        }
      ],
      miniEssay: {
        id: 'm9-s3-e1',
        question: 'Tìm giá trị nhỏ nhất của $P = |z + 1 - 2i|$ biết số phức $z$ thỏa mãn $|z - 2 - i| = |\\bar{z} + i|$.',
        hint: 'Tìm quỹ tích đường thẳng $d$ của $M(x; y)$ từ $|z - 2 - i| = |\\bar{z} + i|$, sau đó $P_{\\min} = d(A(-1; 2), d)$.',
        rubricChecklist: [
          'Đặt $z = x + yi$: $(x - 2)^2 + (y - 1)^2 = x^2 + (1 - y)^2 \\implies -4x + 4 = 0 \\implies x = 1$ (đường thẳng đứng $x - 1 = 0$!).',
          'Tính $P_{\\min} = d(A(-1; 2),\\, x = 1) = |-1 - 1| = 2$.'
        ],
        sampleAnswer: 'Đặt $z = x + yi$ ($x, y \\in \\mathbb{R}$), suy ra $\\bar{z} = x - yi$. Phương trình giả thiết thành $|(x - 2) + (y - 1)i| = |x + (1 - y)i| \\Leftrightarrow (x - 2)^2 + (y - 1)^2 = x^2 + (1 - y)^2 \\Leftrightarrow (x - 2)^2 = x^2 \\Leftrightarrow -4x + 4 = 0 \\Leftrightarrow x = 1$. Vậy điểm $M(z)$ nằm trên đường thẳng $d: x = 1$. Ta có $P = |z - (-1 + 2i)| = MA$ với $A(-1; 2)$. Vậy $P_{\\min} = d(A, d) = |-1 - 1| = 2$ (đạt khi $z = 1 + 2i$).'
      }
    }
  ],
  'math-10': [
    {
      stepTitle: '1. Định lý Pythagore & Hệ thức Lượng Tam giác vuông',
      stepType: 'concept',
      conceptSection:
        'Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông, và bình phương đường cao ứng với cạnh huyền bằng tích hai hình chiếu của hai cạnh góc vuông lên cạnh huyền.',
      formulaSection: {
        primaryFormula: 'a^2 = b^2 + c^2, \\qquad h^2 = b\'\\cdot c\'',
        secondaryFormulas: [
          'b^2 = a\\cdot b\', \\quad c^2 = a\\cdot c\', \\quad a\\cdot h = b\\cdot c',
          '\\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}'
        ],
        variablesNote:
          '• $a$: cạnh huyền; $b, c$: hai cạnh góc vuông; $h$: đường cao ứng với cạnh huyền; $b\', c\'$: hình chiếu tương ứng của $b, c$ trên cạnh huyền.\n• Bộ số Pythagore nguyên thường gặp: $(3, 4, 5)$, $(5, 12, 13)$, $(8, 15, 17)$, $(7, 24, 25)$.'
      },
      deepDiveSection:
        'Nhờ hệ thức nghịch đảo bình phương $\\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}$, trong hình học không gian khi gặp tứ diện vuông $O.ABC$ (ba cạnh $OA, OB, OC$ đôi một vuông góc), ta mở rộng trực tiếp thành công thức 3 chiều đẹp mắt: $\\frac{1}{d(O, (ABC))^2} = \\frac{1}{OA^2} + \\frac{1}{OB^2} + \\frac{1}{OC^2}$!',
      teacherExplanation:
        'Thuộc 4 bộ số Pythagore $(3,4,5), (5,12,13), (8,15,17), (7,24,25)$ giúp tính nhẩm cạnh tam giác vuông trong 1 giây.',
      keyTakeaway: '$a\\cdot h = b\\cdot c$ và $\\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}$ giúp tính nhanh đường cao tam giác vuông.',
      miniQuiz: [
        {
          id: 'm10-s1-q1',
          question: 'Tam giác vuông có hai cạnh góc vuông dài $6\\text{ cm}$ và $8\\text{ cm}$. Độ dài đường cao ứng với cạnh huyền bằng:',
          options: ['A. $4{,}8\\text{ cm}$', 'B. $5\\text{ cm}$', 'C. $2{,}4\\text{ cm}$', 'D. $4{,}5\\text{ cm}$'],
          correctIndex: 0,
          explanation: 'Cạnh huyền $a = \\sqrt{6^2 + 8^2} = 10\\text{ cm} \\implies h = \\frac{b\\cdot c}{a} = \\frac{48}{10} = 4{,}8\\text{ cm}$.'
        },
        {
          id: 'm10-s1-q2',
          question: 'Tam giác $ABC$ vuông tại $A$, đường cao $AH$ chia cạnh huyền $BC$ thành hai đoạn $BH = 4\\text{ cm}, CH = 9\\text{ cm}$. Độ dài $AH$ bằng:',
          options: ['A. $6\\text{ cm}$', 'B. $5\\text{ cm}$', 'C. $6{,}5\\text{ cm}$', 'D. $36\\text{ cm}$'],
          correctIndex: 0,
          explanation: '$AH = \\sqrt{BH\\cdot CH} = \\sqrt{4\\cdot 9} = 6\\text{ cm}$.'
        }
      ],
      miniEssay: {
        id: 'm10-s1-e1',
        question: 'Cho tam giác $ABC$ vuông tại $A$ có đường cao $AH = 12\\text{ cm}$ và $AB = 15\\text{ cm}$. Tính độ dài các đoạn $BH$, $BC$ và $AC$.',
        hint: 'Dùng Pythagore trong $\\triangle AHB$ tìm $BH = 9$, rồi $AB^2 = BC\\cdot BH$ suy ra $BC$.',
        rubricChecklist: [
          'Tính $BH = \\sqrt{15^2 - 12^2} = 9\\text{ cm}$.',
          'Tính $BC = \\frac{AB^2}{BH} = \\frac{225}{9} = 25\\text{ cm}$, suy ra $AC = \\sqrt{25^2 - 15^2} = 20\\text{ cm}$.'
        ],
        sampleAnswer: 'Trong tam giác vuông $AHB$: $BH = \\sqrt{AB^2 - AH^2} = \\sqrt{15^2 - 12^2} = 9\\text{ cm}$. Áp dụng hệ thức $AB^2 = BC\\cdot BH \\Rightarrow BC = \\frac{15^2}{9} = 25\\text{ cm}$. Theo định lý Pythagore cho $\\triangle ABC$: $AC = \\sqrt{BC^2 - AB^2} = \\sqrt{25^2 - 15^2} = 20\\text{ cm}$.'
      }
    },
    {
      stepTitle: '2. Định lý Cosin, Định lý Sin & Công thức Độ dài Trung tuyến',
      stepType: 'derivation',
      conceptSection:
        'Trong tam giác bất kỳ $ABC$ (không nhất thiết vuông), định lý Cosin tổng quát hóa Pythagore để liên hệ 3 cạnh với 1 góc, còn định lý Sin liên hệ cạnh với góc đối diện và bán kính đường tròn ngoại tiếp $R$.',
      formulaSection: {
        primaryFormula: 'a^2 = b^2 + c^2 - 2bc\\cos A, \\qquad \\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R',
        secondaryFormulas: [
          '\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}',
          'm_a^2 = \\frac{2(b^2 + c^2) - a^2}{4}'
        ],
        variablesNote:
          '• Khi biết **3 cạnh**, dùng công thức hệ quả $\\cos A$ để biết góc $A$ nhọn ($\\cos A > 0$), vuông ($= 0$) hay tù ($< 0$).\n• Khi biết **1 cạnh và góc đối diện** $\\implies$ tính ngay bán kính ngoại tiếp $R = \\frac{a}{2\\sin A}$!'
      },
      deepDiveSection:
        'Mối liên hệ mật thiết giữa góc lớn nhất và cạnh lớn nhất: Trong một tam giác, góc đối diện với cạnh dài nhất quyết định tam giác đó nhọn, vuông hay tù — chỉ cần kiểm tra dấu của $b^2 + c^2 - a^2$ (với $a$ là cạnh lớn nhất)!',
      teacherExplanation:
        'Đừng quên công thức đường trung tuyến $m_a^2 = \\frac{2(b^2 + c^2) - a^2}{4}$ — bài toán tìm độ dài trung tuyến thường hay ra trong đề trắc nghiệm lớp 10 và hình không gian!',
      keyTakeaway: 'Biết 2 cạnh + góc xen giữa dùng Định lý Cosin; biết cạnh + góc đối dùng Định lý Sin.',
      miniQuiz: [
        {
          id: 'm10-s2-q1',
          question: 'Tam giác $ABC$ có $AB = 5$, $AC = 8$ và góc $\\widehat{A} = 60^\\circ$. Độ dài cạnh $BC$ bằng:',
          options: ['A. $7$', 'B. $\\sqrt{129}$', 'C. $6$', 'D. $4\\sqrt{3}$'],
          correctIndex: 0,
          explanation: '$BC^2 = 5^2 + 8^2 - 2\\cdot 5\\cdot 8\\cos 60^\\circ = 25 + 64 - 40 = 49 \\implies BC = 7$.'
        },
        {
          id: 'm10-s2-q2',
          question: 'Tam giác $ABC$ có cạnh $BC = 6\\sqrt{3}$ và góc $\\widehat{A} = 60^\\circ$. Bán kính đường tròn ngoại tiếp $R$ của tam giác là:',
          options: ['A. $3$', 'B. $6$', 'C. $12$', 'D. $6\\sqrt{3}$'],
          correctIndex: 1,
          explanation: '$2R = \\frac{BC}{\\sin A} = \\frac{6\\sqrt{3}}{\\sqrt{3}/2} = 12 \\implies R = 6$.'
        }
      ],
      miniEssay: {
        id: 'm10-s2-e1',
        question: 'Cho tam giác $ABC$ có ba cạnh $a = 7, b = 5, c = 8$. Tính góc $\\widehat{A}$ và độ dài đường trung tuyến $m_a$ xuất phát từ đỉnh $A$.',
        hint: 'Tính $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$ rồi tính $m_a^2 = \\frac{2(b^2+c^2)-a^2}{4}$.',
        rubricChecklist: [
          'Tính $\\cos A = \\frac{25 + 64 - 49}{2\\cdot 5\\cdot 8} = \\frac{40}{80} = 0{,}5 \\implies \\widehat{A} = 60^\\circ$.',
          'Tính $m_a = \\sqrt{\\frac{2(25+64) - 49}{4}} = \\sqrt{\\frac{129}{4}} = \\frac{\\sqrt{129}}{2}$.'
        ],
        sampleAnswer: 'Áp dụng hệ quả định lý Cosin: $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc} = \\frac{5^2 + 8^2 - 7^2}{2\\cdot 5\\cdot 8} = \\frac{40}{80} = \\frac{1}{2} \\Rightarrow \\widehat{A} = 60^\\circ$. Độ dài đường trung tuyến ứng với cạnh $a$: $m_a = \\sqrt{\\frac{2(b^2 + c^2) - a^2}{4}} = \\sqrt{\\frac{2(25 + 64) - 49}{4}} = \\frac{\\sqrt{129}}{2}$.'
      }
    },
    {
      stepTitle: '3. Năm Công thức Diện tích Tam giác & Bán kính Ngoại/Nội tiếp',
      stepType: 'example',
      conceptSection:
        'Tùy vào dữ kiện đề bài cho (2 cạnh 1 góc, 3 cạnh, nửa chu vi), ta chọn linh hoạt một trong 5 công thức tính diện tích tam giác $S$ để giải ngược ra $R$, $r$, hoặc đường cao $h$.',
      formulaSection: {
        primaryFormula: 'S = \\frac{1}{2}bc\\sin A = \\frac{abc}{4R} = p\\cdot r = \\sqrt{p(p-a)(p-b)(p-c)}',
        secondaryFormulas: [
          'p = \\frac{a + b + c}{2}, \\qquad r = \\frac{S}{p}, \\qquad R = \\frac{abc}{4S}'
        ],
        variablesNote:
          '• Công thức Heron $S = \\sqrt{p(p-a)(p-b)(p-c)}$ là cách duy nhất tính trực tiếp diện tích khi chỉ biết độ dài 3 cạnh.\n• Sau khi có $S$ và $p$, tính ngay $r = S/p$ và $R = abc/(4S)$ — đặc biệt hữu ích làm **đáy hình chóp** trong Hình học không gian!'
      },
      deepDiveSection:
        'Tam giác có bộ ba cạnh $(13, 14, 15)$ là bộ số "Heron nguyên" nổi tiếng nhất hay xuất hiện trong đề thi chuyên & đại học: nửa chu vi $p = 21$, diện tích $S = \\sqrt{21\\cdot 8\\cdot 7\\cdot 6} = 84$ cực đẹp!',
      teacherExplanation:
        'Khi bài toán yêu cầu tính bán kính đường tròn nội tiếp $r$ của tam giác bất kỳ: tính $S$ bằng Heron (hoặc $\\frac{1}{2}bc\\sin A$) trước, rồi lấy $r = S/p$!',
      keyTakeaway: 'Dùng Heron tính $S$ từ 3 cạnh, rồi suy ngay $r = S/p$ và $R = abc/(4S)$.',
      miniQuiz: [
        {
          id: 'm10-s3-q1',
          question: 'Tam giác có ba cạnh lần lượt bằng $13, 14, 15$. Diện tích và bán kính đường tròn nội tiếp $r$ của tam giác này bằng:',
          options: ['A. $S = 84,\\ r = 4$', 'B. $S = 84,\\ r = 2$', 'C. $S = 42,\\ r = 2$', 'D. $S = 91,\\ r = 3$'],
          correctIndex: 0,
          explanation: '$p = 21 \\implies S = \\sqrt{21\\cdot 8\\cdot 7\\cdot 6} = 84 \\implies r = \\frac{84}{21} = 4$.'
        },
        {
          id: 'm10-s3-q2',
          question: 'Tam giác $ABC$ có $AB = 6,\\ AC = 10$ và $\\widehat{A} = 30^\\circ$. Diện tích tam giác $ABC$ là:',
          options: ['A. $30$', 'B. $15$', 'C. $15\\sqrt{3}$', 'D. $60$'],
          correctIndex: 1,
          explanation: '$S = \\frac{1}{2}\\cdot 6\\cdot 10\\cdot\\sin 30^\\circ = 15$.'
        }
      ],
      miniEssay: {
        id: 'm10-s3-e1',
        question: 'Tính diện tích $S$, bán kính đường tròn ngoại tiếp $R$ và bán kính đường tròn nội tiếp $r$ của tam giác có ba cạnh $a = 5, b = 6, c = 7$.',
        hint: 'Tính $p = 9$, áp dụng Heron tìm $S = 6\\sqrt{6}$, rồi tính $r = S/p$ và $R = abc/(4S)$.',
        rubricChecklist: [
          'Tính $p = 9 \\implies S = \\sqrt{9\\cdot 4\\cdot 3\\cdot 2} = 6\\sqrt{6}$.',
          'Tính $r = \\frac{6\\sqrt{6}}{9} = \\frac{2\\sqrt{6}}{3}$ và $R = \\frac{5\\cdot 6\\cdot 7}{24\\sqrt{6}} = \\frac{35}{4\\sqrt{6}} = \\frac{35\\sqrt{6}}{24}$.'
        ],
        sampleAnswer: 'Nửa chu vi $p = \\frac{5 + 6 + 7}{2} = 9$. Theo công thức Heron: $S = \\sqrt{9(9-5)(9-6)(9-7)} = \\sqrt{9\\cdot 4\\cdot 3\\cdot 2} = 6\\sqrt{6}$. Bán kính đường tròn nội tiếp $r = \\frac{S}{p} = \\frac{6\\sqrt{6}}{9} = \\frac{2\\sqrt{6}}{3}$. Bán kính đường tròn ngoại tiếp $R = \\frac{abc}{4S} = \\frac{5\\cdot 6\\cdot 7}{4\\cdot 6\\sqrt{6}} = \\frac{35}{4\\sqrt{6}} = \\frac{35\\sqrt{6}}{24}$.'
      }
    }
  ],
  'math-11': [
    {
      stepTitle: '1. Phép biến đổi Đồ thị & Số cực trị của $y = |f(x)|$',
      stepType: 'concept',
      conceptSection:
        'Đồ thị hàm số $y = |f(x)|$ được suy ra từ đồ thị $y = f(x)$ bằng phép giữ nguyên phần đồ thị nằm phía trên trục hoành $Ox$ ($f(x) \\ge 0$) và **lấy đối xứng phần nằm dưới $Ox$ lên phía trên qua trục $Ox$**.',
      formulaSection: {
        primaryFormula: '\\text{Số cực trị } |f(x)| = a + b',
        secondaryFormulas: [
          'a = \\text{Số cực trị ban đầu của } f(x)',
          'b = \\text{Số giao điểm CẮT QUA (nghiệm bội lẻ) của } f(x) \\text{ với trục } Ox'
        ],
        variablesNote:
          '• **Cực kỳ quan trọng**: Giao điểm **tiếp xúc** trục $Ox$ (nghiệm bội chẵn) KHÔNG tạo thêm cực trị mới vì nó vốn đã là điểm cực trị của $f(x)$ (tính vào $a$ rồi)! Chỉ tính các điểm mà đồ thị **cắt xuyên qua** $Ox$ vào $b$.'
      },
      deepDiveSection:
        'Công thức $a + b$ giải siêu tốc bài toán tham số: "Tìm $m$ để hàm $y = |f(x) + m|$ có đúng 5 điểm cực trị": vẽ bảng biến thiên của $f(x)$ (đếm $a$), rồi tịnh tiến đường ngang $y = -m$ cắt qua đồ thị để có đúng $b = 5 - a$ giao điểm bội lẻ!',
      teacherExplanation:
        'Khi gặp hàm $y = |f(x) + m|$: đừng phá trị tuyệt đối từng khoảng! Hãy đếm số cực trị $a$ của $f(x)$ rồi cho đường $y = -m$ cắt $f(x)$ tại đúng số nghiệm bội lẻ còn thiếu.',
      keyTakeaway: 'Số cực trị của $|f(x)|$ bằng số cực trị của $f(x)$ cộng với số nghiệm đơn/bội lẻ của $f(x) = 0$.',
      miniQuiz: [
        {
          id: 'm11-s1-q1',
          question: 'Cho hàm số $f(x)$ có 2 điểm cực trị và đồ thị cắt trục hoành $Ox$ tại 3 điểm phân biệt. Hàm số $y = |f(x)|$ có bao nhiêu điểm cực trị?',
          options: ['A. 3', 'B. 4', 'C. 5', 'D. 6'],
          correctIndex: 2,
          explanation: 'Số cực trị $= a + b = 2 + 3 = 5$.'
        },
        {
          id: 'm11-s1-q2',
          question: 'Tìm tất cả các giá trị $m$ để hàm số $y = |x^3 - 3x + m|$ có đúng 5 điểm cực trị.',
          options: ['A. $-2 < m < 2$', 'B. $-2 \\le m \\le 2$', 'C. $m < -2$ hoặc $m > 2$', 'D. $m > 2$'],
          correctIndex: 0,
          explanation: '$f(x) = x^3 - 3x$ có $a = 2$ cực trị ($y_{\\text{CĐ}}=2, y_{\\text{CT}}=-2$). Cần $b = 3$ giao điểm cắt $Ox \\iff$ đường $y = -m$ cắt $f(x)$ tại 3 điểm $\\iff -2 < -m < 2 \\iff -2 < m < 2$.'
        }
      ],
      miniEssay: {
        id: 'm11-s1-e1',
        question: 'Tìm số nguyên dương $m$ để hàm số $y = |x^4 - 2x^2 - m|$ có đúng 5 điểm cực trị.',
        hint: 'Hàm $f(x) = x^4 - 2x^2$ có $a = 3$ cực trị ($y_{\\text{CĐ}} = 0$, $y_{\\text{CT}} = -1$). Muốn tổng $3 + b = 5$ cần $b = 2$ giao điểm bội lẻ với đường $y = m$.',
        rubricChecklist: [
          'Chỉ ra $f(x) = x^4 - 2x^2$ có $a = 3$ cực trị với $f_{\\text{CĐ}} = 0$, $f_{\\text{CT}} = -1$.',
          'Để $y = m$ cắt $f(x)$ tại đúng $2$ điểm (nghiệm bội lẻ): $m > 0$ (vì $m > f_{\\text{CĐ}} = 0$, hoặc $m = -1$ nhưng đề yêu cầu $m$ nguyên dương $\\implies m \\in \\mathbb{N}^*$).'
        ],
        sampleAnswer: 'Xét $f(x) = x^4 - 2x^2$ có $f\'(x) = 4x^3 - 4x = 0 \\Leftrightarrow x \\in \\{0;\\ -1;\\ 1\\}$, suy ra $a = 3$ điểm cực trị với $f(0) = 0$ (CĐ) và $f(\\pm 1) = -1$ (CT). Để $|f(x) - m|$ có $5$ điểm cực trị, đường thẳng $y = m$ phải cắt đồ thị $f(x)$ tại đúng $b = 5 - 3 = 2$ điểm đơn (không kể tiếp xúc). Nhìn bảng biến thiên: hoặc $m > 0$, hoặc $m = -1$ (khi $m = -1$, $y = -1$ tiếp xúc tại $2$ cực tiểu nên không cộng thêm cực trị — loại $m=-1$ vì ở $m=-1$ chỉ có 3 cực trị!). Do đó với $m > 0$, mọi số nguyên dương $m \\in \\{1; 2; 3; \\dots\\}$ đều cho đúng 5 cực trị.'
      }
    },
    {
      stepTitle: '2. Phép biến đổi Đồ thị & Số cực trị của $y = f(|x|)$',
      stepType: 'derivation',
      conceptSection:
        'Hàm số $y = f(|x|)$ là hàm số chẵn trên $\\mathbb{R}$. Đồ thị của nó thu được bằng cách **xóa bỏ hoàn toàn phần bên trái trục tung ($x < 0$)** của $y = f(x)$, rồi lấy **đối xứng phần bên phải ($x \\ge 0$) qua trục tung $Oy$**.',
      formulaSection: {
        primaryFormula: '\\text{Số cực trị } f(|x|) = 2k + 1',
        secondaryFormulas: [
          'k = \\text{Số điểm cực trị DƯƠNG } (x > 0) \\text{ của hàm số } y = f(x)'
        ],
        variablesNote:
          '• Điểm trên trục tung $x = 0$ luôn tạo thành điểm gãy (hoặc cực trị nhẵn) nằm đối xứng giữa hai nhánh, nên **luôn cộng thêm $+1$** cực trị tại $x = 0$!\n• Lưu ý: ngay cả khi $x = 0$ không phải cực trị của $f(x)$ ban đầu (miễn $f\'(0) \\ne 0$), phép phản chiếu qua $Oy$ biến điểm $(0; f(0))$ thành đỉnh chữ V hoặc chữ $\\Lambda$ nên vẫn thành $1$ cực trị!'
      },
      deepDiveSection:
        'So sánh công thức vàng hai dạng để không bao giờ lẫn lộn:\n• $|f(x)|$: đối xứng qua **$Ox$** $\\implies$ Cực trị $= a + b$ (cực trị gốc $+$ giao $Ox$).\n• $f(|x|)$: đối xứng qua **$Oy$** $\\implies$ Cực trị $= 2k + 1$ ($k$ là số cực trị dương $x > 0$).\n• Dạng lồng ghép $y = |f(|x|)|$: áp dụng quy trình 2 bước (tạo $f(|x|)$ qua $Oy$ trước, rồi lấy trị tuyệt đối qua $Ox$ sau)!',
      teacherExplanation:
        'Công thức $2k + 1$ cho thấy hàm $y = f(|x|)$ (với $f$ là đa thức bậc $\\ge 1$) **luôn có số điểm cực trị là một SỐ LẺ**!',
      keyTakeaway: 'Hàm $y = f(|x|)$ có đúng $2k + 1$ điểm cực trị với $k$ là số điểm cực trị dương ($x > 0$) của $f(x)$.',
      miniQuiz: [
        {
          id: 'm11-s2-q1',
          question: 'Cho hàm bậc ba $f(x) = x^3 - 3x^2 - 9x + 1$. Hàm số $y = f(|x|)$ có bao nhiêu điểm cực trị?',
          options: ['A. 1', 'B. 3', 'C. 5', 'D. 2'],
          correctIndex: 1,
          explanation: '$f\'(x) = 3x^2 - 6x - 9 = 0 \\iff x = -1$ hoặc $x = 3$. Có đúng $k = 1$ cực trị dương ($x = 3$), nên số cực trị của $f(|x|)$ là $2\\cdot 1 + 1 = 3$.'
        },
        {
          id: 'm11-s2-q2',
          question: 'Hàm số $y = |x|^3 - 6x^2 + 9|x| - 1$ có số điểm cực trị là:',
          options: ['A. 3', 'B. 5', 'C. 2', 'D. 4'],
          correctIndex: 1,
          explanation: 'Đây là $f(|x|)$ với $f(x) = x^3 - 6x^2 + 9x - 1$. Giải $f\'(x) = 3x^2 - 12x + 9 = 0 \\iff x = 1$ hoặc $x = 3$ (cả $k = 2$ nghiệm đều dương). Số cực trị $= 2\\cdot 2 + 1 = 5$.'
        }
      ],
      miniEssay: {
        id: 'm11-s2-e1',
        question: 'Tìm $m$ để hàm số $y = |x|^3 - 3mx^2 + 3(m^2 - 1)|x| + 2$ có đúng 5 điểm cực trị.',
        hint: 'Xét $f(x) = x^3 - 3mx^2 + 3(m^2 - 1)x + 2$. Muốn $f(|x|)$ có 5 cực trị thì $f\'(x) = 0$ phải có 2 nghiệm dương phân biệt.',
        rubricChecklist: [
          'Viết đúng điều kiện $f\'(x) = 3[x^2 - 2mx + (m^2 - 1)] = 0$ có $k = 2$ nghiệm dương phân biệt.',
          'Giải $x_1 = m - 1, x_2 = m + 1 \\implies$ cả hai dương khi $m - 1 > 0 \\iff m > 1$.'
        ],
        sampleAnswer: 'Hàm đã cho có dạng $y = f(|x|)$ với $f(x) = x^3 - 3mx^2 + 3(m^2 - 1)x + 2$. Để $f(|x|)$ có $5$ điểm cực trị, ta cần $2k + 1 = 5 \\Leftrightarrow k = 2$, tức là $f(x)$ phải có $2$ điểm cực trị cùng mang hoành độ dương. Xét $f\'(x) = 3\\big[x^2 - 2mx + (m^2 - 1)\\big] = 0 \\Leftrightarrow (x - m)^2 = 1 \\Leftrightarrow x_1 = m - 1$ hoặc $x_2 = m + 1$. Để $0 < x_1 < x_2$, điều kiện là $m - 1 > 0 \\Leftrightarrow m > 1$.'
      }
    },
    {
      stepTitle: '3. Đạo hàm Hàm trị tuyệt đối & Bài toán Dạng Tổng hợp $|f(u(x))|$',
      stepType: 'example',
      conceptSection:
        'Đối với hàm trị tuyệt đối dạng tổng quát $g(x) = |h(x)|$ (trong đó $h(x)$ chứa $f(x)$, $x^2$, hoặc đa thức $m$), thay vì vẽ đồ thị ta có thể dùng công thức đạo hàm chuẩn trên từng khoảng không chứa $0$.',
      formulaSection: {
        primaryFormula: '\\Big(|h(x)|\\Big)\' = \\frac{h(x)\\cdot h\'(x)}{|h(x)|} \\quad (h(x) \\neq 0)',
        secondaryFormulas: [
          '\\text{Số cực trị } |h(x)| = \\text{Số nghiệm bội lẻ của } h\'(x) = 0 + \\text{Số nghiệm bội lẻ của } h(x) = 0'
        ],
        variablesNote:
          '• Công thức đếm nghiệm bội lẻ dùng chung cho mọi hàm hợp $|f(u(x))|$ mà không bị sót nghiệm!\n• Chú ý nếu $h(x_0) = 0$ là nghiệm **bội chẵn** (tiếp xúc $Ox$) thì tại đó $h\'(x_0) = 0$ cũng bội lẻ — nhớ chỉ đếm mỗi hoành độ $x_0$ **1 lần duy nhất**, không đếm trùng!'
      },
      deepDiveSection:
        'Kỹ thuật ghép trục / đạo hàm kết hợp: đối với $y = |f(x^2 - 2x) + m|$, đầu tiên tìm các điểm cực trị của hàm bên trong $h(x) = f(x^2 - 2x) + m$ bằng $h\'(x) = (2x - 2)f\'(x^2 - 2x) = 0$, sau đó khảo sát sự tương giao của $h(x)$ với đường $y = 0$!',
      teacherExplanation:
        'Mỗi điểm chuyển dấu của $g\'(x) = h(x)h\'(x)/|h(x)|$ chính là một nghiệm bội lẻ của $h(x) = 0$ hoặc $h\'(x) = 0$ (loại bỏ trùng lặp!).',
      keyTakeaway: 'Cực trị của $|h(x)|$ nằm tại các nghiệm bội lẻ phân biệt của phương trình tích $h(x)\\cdot h\'(x) = 0$.',
      miniQuiz: [
        {
          id: 'm11-s3-q1',
          question: 'Hàm số $y = |(x - 1)^2(x - 3)|$ có tất cả bao nhiêu điểm cực trị?',
          options: ['A. 2', 'B. 3', 'C. 4', 'D. 5'],
          correctIndex: 1,
          explanation: '$h(x) = (x-1)^2(x-3)$ có 2 cực trị ($x=1$ CĐ, $x=7/3$ CT) và cắt xuyên qua $Ox$ tại $x = 3$ (bội lẻ, còn $x=1$ bội chẵn đã tính trong cực trị). Tổng $= 2 + 1 = 3$.'
        },
        {
          id: 'm11-s3-q2',
          question: 'Đạo hàm của hàm số $y = |x^2 - 4x|$ tại điểm $x = 1$ bằng:',
          options: ['A. $-2$', 'B. $2$', 'C. $0$', 'D. Không tồn tại'],
          correctIndex: 1,
          explanation: 'Tại $x = 1$, $h(1) = -3 < 0$ nên $|h(x)| = -x^2 + 4x$ gần $x=1$, có đạo hàm $-2(1) + 4 = 2$ (hoặc $\\frac{-3\\cdot(-2)}{3} = 2$).'
        }
      ],
      miniEssay: {
        id: 'm11-s3-e1',
        question: 'Tìm tất cả các giá trị nguyên của $m \\in [-5; 5]$ để hàm số $y = |x^3 - 3x^2 + m|$ có đúng 3 điểm cực trị.',
        hint: 'Hàm $f(x) = x^3 - 3x^2$ có $a = 2$ cực trị ($y_{\\text{CĐ}}=0, y_{\\text{CT}}=-4$). Muốn $2 + b = 3$ thì $y = -m$ cắt $f(x)$ tại đúng $b = 1$ điểm bội lẻ $\\iff -m \\ge 0$ hoặc $-m \\le -4$.',
        rubricChecklist: [
          'Xác định $f(x) = x^3 - 3x^2$ có $f_{\\text{CĐ}} = 0$ tại $x=0$ và $f_{\\text{CT}} = -4$ tại $x=2$.',
          'Để có đúng 1 giao điểm bội lẻ: $-m \\ge 0 \\iff m \\le 0$ hoặc $-m \\le -4 \\iff m \\ge 4$. Đếm trong $[-5; 5]$ được $m \\in \\{-5,-4,-3,-2,-1,0,4,5\\}$ (8 giá trị).'
        ],
        sampleAnswer: 'Xét $f(x) = x^3 - 3x^2$ có $f\'(x) = 3x^2 - 6x = 0 \\Leftrightarrow x = 0$ ($f_{\\text{CĐ}} = 0$) hoặc $x = 2$ ($f_{\\text{CT}} = -4$). Hàm số ban đầu là $|f(x) + m|$ có số cực trị bằng $a + b = 2 + b$, trong đó $b$ là số giao điểm cắt ngang (nghiệm bội lẻ) giữa $y = f(x)$ và đường thẳng $y = -m$. Để có đúng $3$ cực trị, cần $b = 1 \\Leftrightarrow \\left[\\begin{matrix} -m \\ge 0 \\\\ -m \\le -4 \\end{matrix}\\right. \\Leftrightarrow \\left[\\begin{matrix} m \\le 0 \\\\ m \\ge 4 \\end{matrix}\\right.$. Trong đoạn $[-5; 5]$ có $8$ giá trị nguyên: $\\{-5; -4; -3; -2; -1; 0; 4; 5\\}$.'
      }
    }
  ],
  'math-12': [
    {
      stepTitle: '1. Quy tắc Đếm, Hoán vị – Chỉnh hợp – Tổ hợp',
      stepType: 'concept',
      conceptSection:
        'Để không bao giờ nhầm giữa **Chỉnh hợp $A_n^k$** và **Tổ hợp $C_n^k$**, chỉ cần tự hỏi một câu duy nhất: "Khi đổi chỗ $k$ phần tử đã chọn cho nhau, ta có được một kết quả MỚI không?" — Có sắp xếp thứ tự dùng $A_n^k$; chỉ chọn tập con không quan tâm thứ tự dùng $C_n^k$.',
      formulaSection: {
        primaryFormula: 'P_n = n!, \\qquad A_n^k = \\frac{n!}{(n - k)!}, \\qquad C_n^k = \\frac{n!}{k!(n - k)!}',
        secondaryFormulas: [
          'C_n^k = C_n^{n - k}, \\qquad C_n^k + C_n^{k+1} = C_{n+1}^{k+1}'
        ],
        variablesNote:
          '• **Quy tắc Cộng**: chia các trường hợp **rời nhau / độc lập hoàn toàn** để hoàn thành công việc.\n• **Quy tắc Nhân**: chia làm các **công đoạn liên tiếp** phải làm đủ mới xong việc.\n• Xếp $n$ người vào **bàn tròn** (không phân biệt ghế đầu): có $(n - 1)!$ cách!'
      },
      deepDiveSection:
        'Hai kỹ thuật đếm nâng cao giải 90% bài xếp chỗ thi đại học:\n1. **Phương pháp Vách ngăn / Nhóm cột**: xếp $k$ bạn luôn ngồi cạnh nhau $\\to$ buộc $k$ bạn thành 1 "khối" lớn, đếm hoán vị ngoài rồi nhân $k!$ hoán vị nội bộ.\n2. **Phương pháp Chèn khe**: xếp hai bạn KHÔNG được ngồi cạnh nhau $\\to$ xếp nhóm kia trước tạo ra các khe trống, rồi chọn khe đặt vào.',
      teacherExplanation:
        'Phân biệt ngay: Chọn 3 học sinh làm *lớp trưởng, lớp phó, bí thư* (có chức vụ khác nhau $\\to$ $A_n^3$); chọn 3 học sinh đi *trực nhật* (vai trò như nhau $\\to$ $C_n^3$).',
      keyTakeaway: 'Có thứ tự/vai trò dùng Chỉnh hợp $A_n^k$; chỉ chọn nhóm không thứ tự dùng Tổ hợp $C_n^k$.',
      miniQuiz: [
        {
          id: 'm12-s1-q1',
          question: 'Từ một tổ có 6 học sinh nam và 4 học sinh nữ, có bao nhiêu cách chọn ra một ban đại diện gồm 2 nam và 2 nữ (vai trò như nhau)?',
          options: ['A. $90$', 'B. $360$', 'C. $210$', 'D. $45$'],
          correctIndex: 0,
          explanation: 'Chọn 2 nam ($C_6^2 = 15$) và 2 nữ ($C_4^2 = 6$) $\\implies 15 \\cdot 6 = 90$ cách.'
        },
        {
          id: 'm12-s1-q2',
          question: 'Từ các chữ số $\\{1, 2, 3, 4, 5, 6\\}$, lập được bao nhiêu số tự nhiên có 4 chữ số đôi một khác nhau?',
          options: ['A. $15$', 'B. $360$', 'C. $1296$', 'D. $24$'],
          correctIndex: 1,
          explanation: 'Chọn 4 chữ số có xếp thứ tự hàng nghìn–trăm–chục–đơn vị: $A_6^4 = 6\\cdot 5\\cdot 4\\cdot 3 = 360$.'
        }
      ],
      miniEssay: {
        id: 'm12-s1-e1',
        question: 'Xếp 5 học sinh nam và 3 học sinh nữ thành một hàng ngang. Có bao nhiêu cách xếp sao cho KHÔNG có hai học sinh nữ nào đứng cạnh nhau?',
        hint: 'Xếp 5 bạn nam trước ($5!$ cách) tạo ra $6$ khe trống (hai đầu và 4 giữa), rồi chọn $3$ khe có thứ tự ($A_6^3$) xếp 3 nữ.',
        rubricChecklist: [
          'Xếp 5 nam thành hàng ngang có $5! = 120$ cách, sinh ra $6$ vị trí khe trống xen kẽ và 2 đầu.',
          'Chọn 3 khe xếp 3 nữ có thứ tự: $A_6^3 = 120$ cách $\\implies$ tổng $5!\\cdot A_6^3 = 14\\,400$ cách.'
        ],
        sampleAnswer: 'Áp dụng phương pháp chèn khe:\n• Bước 1: Xếp $5$ học sinh nam thành một hàng ngang có $5! = 120$ cách. Giữa và hai đầu của $5$ bạn nam tạo thành $6$ vị trí trống.\n• Bước 2: Để không có $2$ bạn nữ nào đứng cạnh nhau, xếp $3$ bạn nữ vào $3$ trong $6$ vị trí trống đó: có $A_6^3 = 120$ cách.\nTheo quy tắc nhân, số cách xếp thỏa mãn là $120 \\times 120 = 14\\,400$ cách.'
      }
    },
    {
      stepTitle: '2. Nhị thức Newton & Tìm Hệ số Số hạng chứa $x^m$',
      stepType: 'derivation',
      conceptSection:
        'Khai triển nhị thức $(a + b)^n$ gồm đúng $n + 1$ số hạng với số mũ của $a$ giảm dần từ $n$ về $0$ và số mũ của $b$ tăng dần từ $0$ lên $n$. Mọi bài toán tìm hệ số đều chỉ xoay quanh công thức số hạng tổng quát $T_{k+1}$.',
      formulaSection: {
        primaryFormula: '(a + b)^n = \\sum_{k=0}^{n} C_n^k a^{n-k} b^k, \\qquad T_{k+1} = C_n^k a^{n-k} b^k',
        secondaryFormulas: [
          'C_n^0 + C_n^1 + \\dots + C_n^n = 2^n \\quad (\\text{thay } a=b=1)',
          'C_n^0 - C_n^1 + C_n^2 - \\dots + (-1)^n C_n^n = 0 \\quad (\\text{thay } a=1, b=-1)'
        ],
        variablesNote:
          '• **Cảnh giác dấu âm**: trong $(2x - 3)^n$, phải viết $b = (-3)$, KHÔNG được bỏ mất dấu trừ khi tách hệ số!\n• **Phân biệt "Số hạng chứa $x^m$" vs "Hệ số của $x^m$"**: "hệ số" chỉ lấy phần số nhân phía trước, KHÔNG bao gồm $x^m$!'
      },
      deepDiveSection:
        'Nếu bài toán yêu cầu tìm tổng các hệ số trong khai triển đa thức $(3x - 2)^n$: chỉ cần thay $x = 1$ vào ngay biểu thức ban đầu được $(3\\cdot 1 - 2)^n = 1^n = 1$!',
      teacherExplanation:
        'Nhớ kiểm tra điều kiện $k \\in \\mathbb{N}$ và $0 \\le k \\le n$ sau khi giải phương trình số mũ của $x$!',
      keyTakeaway: 'Gom toàn bộ phần hệ số tách riêng với $x^{f(k)}$ trong số hạng tổng quát $T_{k+1}$, rồi cho $f(k) = m$.',
      miniQuiz: [
        {
          id: 'm12-s2-q1',
          question: 'Hệ số của số hạng chứa $x^3$ trong khai triển $(2x - 1)^5$ bằng:',
          options: ['A. $80$', 'B. $-80$', 'C. $-80x^3$', 'D. $40$'],
          correctIndex: 0,
          explanation: '$T_{k+1} = C_5^k (2x)^{5-k}(-1)^k = C_5^k 2^{5-k}(-1)^k x^{5-k}$. Để mũ $5 - k = 3 \\implies k = 2$, hệ số là $C_5^2\\cdot 2^3\\cdot (-1)^2 = 10\\cdot 8\\cdot 1 = 80$.'
        },
        {
          id: 'm12-s2-q2',
          question: 'Tổng tất cả các hệ số trong khai triển $(3x - 2)^{10}$ bằng:',
          options: ['A. $2^{10}$', 'B. $1$', 'C. $5^{10}$', 'D. $0$'],
          correctIndex: 1,
          explanation: 'Thay $x = 1$ vào đa thức $(3\\cdot 1 - 2)^{10} = 1^{10} = 1$.'
        }
      ],
      miniEssay: {
        id: 'm12-s2-e1',
        question: 'Tìm số hạng KHÔNG chứa $x$ trong khai triển $\\left(x^2 + \\frac{1}{x}\\right)^6$ ($x \\neq 0$).',
        hint: 'Viết $T_{k+1} = C_6^k (x^2)^{6-k} (x^{-1})^k = C_6^k x^{12 - 3k}$, rồi cho $12 - 3k = 0$.',
        rubricChecklist: [
          'Rút gọn đúng số mũ của $x$ trong $T_{k+1}$ là $12 - 3k$.',
          'Giải $12 - 3k = 0 \\implies k = 4 \\implies$ số hạng không chứa $x$ là $C_6^4 = 15$.'
        ],
        sampleAnswer: 'Số hạng tổng quát trong khai triển là: $T_{k+1} = C_6^k (x^2)^{6-k} \\left(\\frac{1}{x}\\right)^k = C_6^k\\, x^{12 - 2k - k} = C_6^k\\, x^{12 - 3k}$ ($0 \\le k \\le 6$). Số hạng không chứa $x$ ứng với $12 - 3k = 0 \\Leftrightarrow k = 4$ (thỏa mãn). Vậy số hạng cần tìm là $C_6^4 = 15$.'
      }
    },
    {
      stepTitle: '3. Xác suất Cổ điển & Phương pháp Biến cố Đối',
      stepType: 'example',
      conceptSection:
        'Trong không gian mẫu $\\Omega$ gồm các kết quả đồng khả năng, xác suất của biến cố $A$ là tỉ số giữa số kết quả thuận lợi $n(A)$ và tổng số kết quả có thể xảy ra $n(\\Omega)$.',
      formulaSection: {
        primaryFormula: 'P(A) = \\frac{n(A)}{n(\\Omega)} \\in [0; 1], \\qquad P(A) = 1 - P(\\bar{A})',
        secondaryFormulas: [
          '\\text{Hai biến cố độc lập: } P(A \\cap B) = P(A)\\cdot P(B)',
          '\\text{Quy tắc cộng: } P(A \\cup B) = P(A) + P(B) - P(A \\cap B)'
        ],
        variablesNote:
          '• **Từ khóa gọi ngay Biến cố đối $\\bar{A}$**: gặp các cụm từ "**ít nhất 1...**", "**không cùng...**", "**có cả hai...**", tính $P(\\bar{A})$ sẽ nhanh và ít sai hơn chia nhiều trường hợp trực tiếp!'
      },
      deepDiveSection:
        'Bí quyết không bao giờ chia nhầm $n(A)$ và $n(\\Omega)$: **Cách đếm ở $n(\\Omega)$ dùng nguyên tắc nào (tổ hợp $C$ hay chỉnh hợp $A$) thì cách đếm ở $n(A)$ PHẢI dùng đúng nguyên tắc đó**! Ví dụ chọn ngẫu nhiên 3 quả cầu cùng lúc từ hộp 10 quả: dùng $C_{10}^3$ cho mẫu và $C$ cho tử; nếu rút lần lượt có thứ tự dùng $A_{10}^3$ cho mẫu và phép nhân có thứ tự cho tử.',
      teacherExplanation:
        'Gặp chữ "ít nhất 1" hãy nghĩ ngay tới biến cố đối "không có cái nào" rồi lấy $1 - P(\\bar{A})$!',
      keyTakeaway: 'Dùng cùng hệ quy chiếu đếm cho cả $n(A)$ và $n(\\Omega)$; gặp "ít nhất một" dùng ngay biến cố đối $1 - P(\\bar{A})$.',
      miniQuiz: [
        {
          id: 'm12-s3-q1',
          question: 'Gieo một con xúc xắc cân đối đồng chất 2 lần liên tiếp. Xác suất để tổng số chấm thu được ở hai lần bằng $7$ là:',
          options: ['A. $1/6$', 'B. $5/36$', 'C. $7/36$', 'D. $1/9$'],
          correctIndex: 0,
          explanation: '$n(\\Omega) = 6\\cdot 6 = 36$. Các cặp tổng $7$: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$ có $6$ cặp $\\implies P = 6/36 = 1/6$.'
        },
        {
          id: 'm12-s3-q2',
          question: 'Một hộp có 5 bi xanh và 4 bi đỏ. Rút ngẫu nhiên cùng lúc 3 viên bi. Xác suất để rút được ÍT NHẤT 1 viên bi đỏ là:',
          options: ['A. $37/42$', 'B. $5/42$', 'C. $19/21$', 'D. $10/21$'],
          correctIndex: 0,
          explanation: '$n(\\Omega) = C_9^3 = 84$. Biến cố đối: cả 3 viên đều xanh có $C_5^3 = 10$ cách $\\implies P = 1 - \\frac{10}{84} = \\frac{74}{84} = \\frac{37}{42}$.'
        }
      ],
      miniEssay: {
        id: 'm12-s3-e1',
        question: 'Xếp ngẫu nhiên 6 học sinh gồm 4 nam và 2 nữ ngồi vào một hàng dọc 6 ghế. Tính xác suất để 2 học sinh nữ KHÔNG ngồi cạnh nhau.',
        hint: 'Tính biến cố đối "2 nữ ngồi cạnh nhau": buộc 2 nữ làm 1 khối $\\implies 5!\\cdot 2!$, chia cho $6!$.',
        rubricChecklist: [
          'Tính $n(\\Omega) = 6! = 720$ và $n(\\bar{A}) = 5!\\cdot 2! = 240$.',
          'Tính $P(A) = 1 - \\frac{240}{720} = 1 - \\frac{1}{3} = \\frac{2}{3}$.'
        ],
        sampleAnswer: 'Không gian mẫu: số cách xếp $6$ học sinh vào $6$ ghế là $n(\\Omega) = 6! = 720$. Gọi $A$ là biến cố 2 nữ không ngồi cạnh nhau, suy ra biến cố đối $\\bar{A}$ là 2 nữ ngồi cạnh nhau. Coi 2 nữ như một khối ghép với 4 nam thành 5 phần tử, có $5!\\cdot 2! = 240$ cách xếp. Vậy $P(\\bar{A}) = \\frac{240}{720} = \\frac{1}{3} \\Rightarrow P(A) = 1 - \\frac{1}{3} = \\frac{2}{3}$.'
      }
    }
  ]
};
