import { LectureStep } from '../types';

export const MATH_CUSTOM_LECTURE_STEPS_11B: Record<string, LectureStep[]> = {
  'math-11-5': [
    {
      stepTitle: '1. Công thức Cộng, Công thức Nhân đôi & Hạ bậc Lượng giác',
      stepType: 'concept',
      conceptSection:
        'Ba nhóm công thức biến đổi lượng giác cốt lõi — Cộng, Nhân đôi và Hạ bậc — cho phép tính giá trị lượng giác của góc lẻ (như $15^\\circ, 75^\\circ$) và rút gọn bậc cao về bậc nhất để giải phương trình.',
      formulaSection: {
        primaryFormula: '\\sin(a \\pm b) = \\sin a\\cos b \\pm \\cos a\\sin b, \\qquad \\cos(a \\pm b) = \\cos a\\cos b \\mp \\sin a\\sin b',
        secondaryFormulas: [
          '\\sin 2a = 2\\sin a\\cos a, \\qquad \\cos 2a = \\cos^2 a - \\sin^2 a = 2\\cos^2 a - 1 = 1 - 2\\sin^2 a',
          '\\sin^2 a = \\frac{1 - \\cos 2a}{2}, \\qquad \\cos^2 a = \\frac{1 + \\cos 2a}{2}'
        ],
        variablesNote:
          '• **Mẹo nhớ**: *"Sin thì sin cos cos sin (cùng dấu); Cos thì cos cos sin sin (đổi dấu!)"*.\n• Công thức hạ bậc cực kỳ lợi hại để khử $\\sin^2 x, \\cos^2 x$ hoặc tính tích phân sau này ở lớp 12!'
      },
      deepDiveSection:
        'Khi đề cho góc $\\alpha$ thuộc một góc phần tư cụ thể (ví dụ $\\frac{\\pi}{2} < \\alpha < \\pi$) và giá trị $\\sin\\alpha$, hãy xác định **dấu của $\\cos\\alpha$** trước khi khai căn $\\cos\\alpha = \\pm\\sqrt{1 - \\sin^2\\alpha}$, rồi mới thay vào công thức cộng hoặc nhân đôi.',
      teacherExplanation: 'Luôn kiểm tra góc phần tư của $\\alpha$ để chọn đúng dấu $+$ hay $-$ khi tính $\\cos\\alpha$ từ $\\sin\\alpha$!',
      keyTakeaway: '$\\cos(a+b)$ phải ĐỔI DẤU thành trừ; $\\cos^2 a$ hạ bậc mang dấu CỘNG, $\\sin^2 a$ hạ bậc mang dấu TRỪ.',
      miniQuiz: [
        {
          id: 'm115-s1-q1',
          question: 'Cho $\\sin\\alpha = \\frac{3}{5}$ với $\\frac{\\pi}{2} < \\alpha < \\pi$. Giá trị của $\\sin 2\\alpha$ là:',
          options: ['A. $-\\frac{24}{25}$', 'B. $\\frac{24}{25}$', 'C. $-\\frac{12}{25}$', 'D. $\\frac{7}{25}$'],
          correctIndex: 0,
          explanation: 'Vì $\\alpha$ ở góc phần tư II nên $\\cos\\alpha = -\\sqrt{1 - \\frac{9}{25}} = -\\frac{4}{5}$. Vậy $\\sin 2\\alpha = 2\\cdot\\frac{3}{5}\\cdot(-\\frac{4}{5}) = -\\frac{24}{25}$.'
        },
        {
          id: 'm115-s1-q2',
          question: 'Rút gọn biểu thức $A = \\cos^2 x - \\sin^2 x + 2\\sin x\\cos x$ ta được:',
          options: ['A. $\\cos 2x + \\sin 2x$', 'B. $1 + \\sin 2x$', 'C. $\\cos 2x - \\sin 2x$', 'D. $\\sin 4x$'],
          correctIndex: 0,
          explanation: '$\\cos^2 x - \\sin^2 x = \\cos 2x$ và $2\\sin x\\cos x = \\sin 2x$.'
        }
      ],
      miniEssay: {
        id: 'm115-s1-e1',
        question: 'Không dùng máy tính, tính chính xác giá trị của $\\cos 75^\\circ$.',
        hint: 'Tách $75^\\circ = 45^\\circ + 30^\\circ$ và áp dụng công thức $\\cos(a + b) = \\cos a\\cos b - \\sin a\\sin b$.',
        rubricChecklist: [
          'Viết đúng $\\cos 75^\\circ = \\cos(45^\\circ + 30^\\circ) = \\cos 45^\\circ\\cos 30^\\circ - \\sin 45^\\circ\\sin 30^\\circ$.',
          'Thay đúng giá trị lượng giác góc đặc biệt.',
          'Thu gọn ra kết quả $\\frac{\\sqrt{6} - \\sqrt{2}}{4}$.'
        ],
        sampleAnswer:
          'Ta có $\\cos 75^\\circ = \\cos(45^\\circ + 30^\\circ) = \\cos 45^\\circ\\cos 30^\\circ - \\sin 45^\\circ\\sin 30^\\circ = \\frac{\\sqrt{2}}{2}\\cdot\\frac{\\sqrt{3}}{2} - \\frac{\\sqrt{2}}{2}\\cdot\\frac{1}{2} = \\frac{\\sqrt{6} - \\sqrt{2}}{4}$.'
      }
    },
    {
      stepTitle: '2. Biến đổi Tích thành Tổng & Tổng thành Tích',
      stepType: 'derivation',
      conceptSection:
        'Khi phương trình hoặc biểu thức chứa tổng các hàm $\\sin, \\cos$ khác cung (như $\\sin 3x + \\sin x$) hoặc tích $\\sin a\\cos b$, hai bộ công thức biến đổi Tổng $\\leftrightarrow$ Tích giúp gom nhân tử chung ngay lập tức.',
      formulaSection: {
        primaryFormula: '\\cos a + \\cos b = 2\\cos\\frac{a+b}{2}\\cos\\frac{a-b}{2}, \\qquad \\sin a + \\sin b = 2\\sin\\frac{a+b}{2}\\cos\\frac{a-b}{2}',
        secondaryFormulas: [
          '\\cos a - \\cos b = -2\\sin\\frac{a+b}{2}\\sin\\frac{a-b}{2}',
          '\\sin a \\cos b = \\frac{1}{2}[\\sin(a+b) + \\sin(a-b)], \\quad \\cos a\\cos b = \\frac{1}{2}[\\cos(a+b) + \\cos(a-b)]'
        ],
        variablesNote:
          '• **Bẫy dấu trừ kinh điển**: $\\cos a - \\cos b = \\mathbf{-2}\\sin\\frac{a+b}{2}\\sin\\frac{a-b}{2}$ (có dấu **TRỪ** ở đầu, rất dễ quên!).\n• Khi gặp tổng $3$ số hạng như $\\sin x + \\sin 2x + \\sin 3x = 0$, luôn ghép **cặp đầu và cuối** ($x$ với $3x$) vì trung bình cộng của chúng $\\frac{x+3x}{2} = 2x$ khớp ngay số hạng ở giữa!'
      },
      deepDiveSection:
        'Ngoài ra, công thức tích thành tổng $\\sin a\\sin b = \\frac{1}{2}[\\cos(a-b) - \\cos(a+b)]$ giúp xử lý nhanh các bài toán phương trình tích $\\cos 3x\\cos x = \\cos 4x\\cos 2x$ bằng cách nhân đôi hai vế rồi khử $\\cos$ hai bên.',
      teacherExplanation: 'Gặp tổng $\\sin x + \\sin 2x + \\sin 3x$: ghép cặp có trung bình cộng bằng cung ở giữa ($1x + 3x = 2 \\cdot 2x$) để đặt nhân tử chung!',
      keyTakeaway: 'Nhớ dấu trừ trong $\\cos a - \\cos b = -2\\sin\\frac{a+b}{2}\\sin\\frac{a-b}{2}$ và mẹo ghép cặp trung bình cộng.',
      miniQuiz: [
        {
          id: 'm115-s2-q1',
          question: 'Biến đổi biểu thức $M = \\sin 5x - \\sin x$ thành tích ta được:',
          options: ['A. $2\\cos 3x\\sin 2x$', 'B. $2\\sin 3x\\cos 2x$', 'C. $-2\\cos 3x\\sin 2x$', 'D. $2\\sin 3x\\sin 2x$'],
          correctIndex: 0,
          explanation: '$\\sin a - \\sin b = 2\\cos\\frac{a+b}{2}\\sin\\frac{a-b}{2} = 2\\cos 3x\\sin 2x$.'
        },
        {
          id: 'm115-s2-q2',
          question: 'Giá trị của tích $P = \\cos\\frac{\\pi}{12} \\cdot \\cos\\frac{5\\pi}{12}$ bằng:',
          options: ['A. $\\frac{1}{4}$', 'B. $\\frac{\\sqrt{3}}{4}$', 'C. $\\frac{1}{2}$', 'D. $\\frac{\\sqrt{2}}{4}$'],
          correctIndex: 0,
          explanation: '$P = \\frac{1}{2}\\left[\\cos\\frac{6\\pi}{12} + \\cos\\frac{-4\\pi}{12}\\right] = \\frac{1}{2}\\left(\\cos\\frac{\\pi}{2} + \\cos\\frac{\\pi}{3}\\right) = \\frac{1}{2}\\left(0 + \\frac{1}{2}\\right) = \\frac{1}{4}$.'
        }
      ],
      miniEssay: {
        id: 'm115-s2-e1',
        question: 'Giải phương trình $\\sin x + \\sin 2x + \\sin 3x = 0$.',
        hint: 'Ghép $\\sin x + \\sin 3x = 2\\sin 2x\\cos x$, sau đó đặt $\\sin 2x$ làm nhân tử chung.',
        rubricChecklist: [
          'Biến đổi $\\sin x + \\sin 3x = 2\\sin 2x\\cos x$.',
          'Đặt nhân tử chung $\\sin 2x(2\\cos x + 1) = 0$.',
          'Giải đủ cả 2 nhánh: $x = k\\frac{\\pi}{2}$ và $x = \\pm\\frac{2\\pi}{3} + k2\\pi$ ($k \\in \\mathbb{Z}$).'
        ],
        sampleAnswer:
          'Phương trình $\\iff (\\sin 3x + \\sin x) + \\sin 2x = 0 \\iff 2\\sin 2x\\cos x + \\sin 2x = 0 \\iff \\sin 2x(2\\cos x + 1) = 0$. TH1: $\\sin 2x = 0 \\iff 2x = k\\pi \\iff x = k\\frac{\\pi}{2}$. TH2: $\\cos x = -\\frac{1}{2} \\iff x = \\pm\\frac{2\\pi}{3} + k2\\pi$ ($k \\in \\mathbb{Z}$).'
      }
    },
    {
      stepTitle: '3. Phương trình Lượng giác Nâng cao (Đẳng cấp, Chứa mẫu & Đối chiếu ĐK)',
      stepType: 'example',
      conceptSection:
        'Các phương trình lượng giác nâng cao thường ở dạng phương trình đẳng cấp bậc hai ($a\\sin^2 x + b\\sin x\\cos x + c\\cos^2 x = d$) hoặc phương trình có mẫu số chứa $\\sin x, \\cos x$ bắt buộc phải đặt điều kiện và **loại nghiệm ngoại lai trên đường tròn lượng giác**.',
      formulaSection: {
        primaryFormula: 'a\\sin^2 x + b\\sin x\\cos x + c\\cos^2 x = d \\implies \\text{Xét } \\cos x = 0, \\text{ rồi chia } \\cos^2 x',
        secondaryFormulas: [
          '\\frac{1}{\\cos^2 x} = 1 + \\tan^2 x',
          '\\text{Kiểm tra trùng họ nghiệm: biểu diễn lên đường tròn lượng giác } [0; 2\\pi)'
        ],
        variablesNote:
          '• **Cẩn trọng khi chia cho $\\cos^2 x$**: Phải xét riêng $\\cos x = 0$ ($\\sin^2 x = 1$) xem có là nghiệm không, rồi mới đặt $\\cos x \\neq 0$ để chia về bậc hai theo $\\tan x$!\n• Khi loại nghiệm vi phạm điều kiện mẫu (như $\\sin x \\neq 0$), biểu diễn các điểm ngọn của họ nghiệm lên đường tròn lượng giác để loại chính xác không sót.'
      },
      deepDiveSection:
        'Một kỹ thuật đối chiếu điều kiện rất nhanh không cần vẽ hình phức tạp: cho hai họ nghiệm bằng nhau rồi giải $k$ và $m$ xem có cặp số nguyên nào trùng nhau không; nhưng vẽ nhanh 1 vòng tròn lượng giác nháp chỉ mất 5 giây và trực quan tuyệt đối!',
      teacherExplanation: 'Thấy phương trình phân thức chứa $\\tan x$ hoặc mẫu $\\sin x, \\cos x$: giải xong nghiệm NHỚ kiểm tra loại điểm trùng trên vòng tròn lượng giác!',
      keyTakeaway: 'Phương trình đẳng cấp bậc 2: kiểm tra $\\cos x = 0$ trước, sau đó chia $\\cos^2 x$ đưa về $\\tan x$.',
      miniQuiz: [
        {
          id: 'm115-s3-q1',
          question: 'Khi giải phương trình $\\sin^2 x + \\sin x\\cos x - 2\\cos^2 x = 0$ bằng cách chia hai vế cho $\\cos^2 x$ ($\\cos x \\neq 0$), ta thu được phương trình nào theo $t = \\tan x$?',
          options: ['A. $t^2 + t - 2 = 0$', 'B. $t^2 - t - 2 = 0$', 'C. $2t^2 + t - 1 = 0$', 'D. $t^2 + t + 2 = 0$'],
          correctIndex: 0,
          explanation: 'Chia cho $\\cos^2 x$ được $\\tan^2 x + \\tan x - 2 = 0$, tức $t^2 + t - 2 = 0$ (cũng cần kiểm tra $\\cos x = 0 \\implies \\sin^2 x = 1 \\neq 0$ nên không là nghiệm).'
        },
        {
          id: 'm115-s3-q2',
          question: 'Phương trình $\\frac{\\sin 2x}{\\cos x - 1} = 0$ có các nghiệm là:',
          options: [
            'A. $x = \\frac{\\pi}{2} + k\\pi$ và $x = \\pi + k2\\pi\\ (k \\in \\mathbb{Z})$',
            'B. $x = k\\frac{\\pi}{2}\\ (k \\in \\mathbb{Z})$',
            'C. $x = k\\pi\\ (k \\in \\mathbb{Z})$',
            'D. $x = \\frac{\\pi}{2} + k\\pi\\ (k \\in \\mathbb{Z})$'
          ],
          correctIndex: 0,
          explanation: 'ĐKXĐ: $\\cos x \\neq 1 \\iff x \\neq k2\\pi$. Tử $\\sin 2x = 0 \\iff x = m\\frac{\\pi}{2}$. Loại các điểm $x = k2\\pi$ (ứng $m$ chia hết $4$), còn lại $x = \\frac{\\pi}{2} + k\\pi$ và $x = \\pi + k2\\pi$.'
        }
      ],
      miniEssay: {
        id: 'm115-s3-e1',
        question: 'Giải phương trình $\\sin^2 x - 3\\sin x\\cos x + 2\\cos^2 x = 0$.',
        hint: 'Xét $\\cos x = 0$ (loại vì $1 = 0$ vô lý), rồi chia hai vế cho $\\cos^2 x$ đưa về $\\tan^2 x - 3\\tan x + 2 = 0$.',
        rubricChecklist: [
          'Xét TH1: $\\cos x = 0 \\implies \\sin^2 x = 1 \\implies 1 = 0$ (vô lý, loại).',
          'TH2: $\\cos x \\neq 0$, chia $\\cos^2 x$ được $\\tan^2 x - 3\\tan x + 2 = 0 \\iff \\tan x = 1$ hoặc $\\tan x = 2$.',
          'Kết luận $x = \\frac{\\pi}{4} + k\\pi$ và $x = \\arctan 2 + k\\pi$ ($k \\in \\mathbb{Z}$).'
        ],
        sampleAnswer:
          'TH1: Nếu $\\cos x = 0$ thì $\\sin^2 x = 1$, thay vào phương trình được $1 = 0$ (vô lý). TH2: $\\cos x \\neq 0$, chia hai vế cho $\\cos^2 x$: $\\tan^2 x - 3\\tan x + 2 = 0 \\iff \\tan x = 1$ hoặc $\\tan x = 2$. Suy ra $x = \\frac{\\pi}{4} + k\\pi$ hoặc $x = \\arctan 2 + k\\pi$ ($k \\in \\mathbb{Z}$).'
      }
    }
  ],
  'math-11-6': [
    {
      stepTitle: '1. Giới hạn Dãy số $\\lim u_n$ & Các Dạng Vô định Cơ bản',
      stepType: 'concept',
      conceptSection:
        'Giới hạn dãy số $\\lim_{n \\to +\\infty} u_n$ khảo sát giá trị của $u_n$ khi $n$ tiến ra vô cùng lớn. Bốn giới hạn cơ bản cần thuộc lòng: $\\lim \\frac{1}{n^k} = 0$ ($k > 0$), $\\lim q^n = 0$ ($|q| < 1$), và hằng số giữ nguyên.',
      formulaSection: {
        primaryFormula: '\\lim \\frac{P(n)}{Q(n)}: \\text{ chia cả tử và mẫu cho } n^k \\text{ bậc cao nhất}',
        secondaryFormulas: [
          '\\lim q^n = 0 \\text{ nếu } |q| < 1; \\qquad \\lim \\frac{c}{n^k} = 0 \\ (k > 0)',
          '\\text{Dạng } \\infty - \\infty \\text{ chứa căn: nhân lượng liên hợp } (\\sqrt{A} - B) = \\frac{A - B^2}{\\sqrt{A} + B}'
        ],
        variablesNote:
          '• **Đọc nhanh đáp án $\\lim \\frac{P(n)}{Q(n)}$ trong 1 giây**:\n  - Bậc tử < Bậc mẫu $\\implies \\mathbf{0}$.\n  - Bậc tử = Bậc mẫu $\\implies$ **tỉ số hai hệ số bậc cao nhất**.\n  - Bậc tử > Bậc mẫu $\\implies \\mathbf{\\pm\\infty}$ (xét dấu hệ số cao nhất).\n• Với dãy chứa lũy thừa mũ $n$ (ví dụ $\\frac{3^n + 2^n}{5 \\cdot 3^n - 1}$), chia cả tử và mẫu cho lũy thừa có cơ số $|a|$ lớn nhất ($3^n$).'
      },
      deepDiveSection:
        'Với dạng vô định $\\infty - \\infty$ như $\\lim(\\sqrt{n^2 + 3n} - n)$, chỉ nhân lượng liên hợp khi **hệ số triệt tiêu nhau** ($\\sqrt{1} - 1 = 0$); nếu đề cho $\\lim(\\sqrt{4n^2 + n} - n)$ thì không cần nhân liên hợp vì $2n - n = n \\to +\\infty$ (chỉ cần đặt $n$ ra làm nhân tử chung)!',
      teacherExplanation: 'Nhẩm bậc tử và mẫu của phân thức hữu tỉ giúp chọn ngay đáp án trắc nghiệm giới hạn dãy số chỉ trong 2 giây.',
      keyTakeaway: 'Chia cho $n^k$ bậc lớn nhất hoặc cơ số lớn nhất; gặp $\\sqrt{n^2 + bn} - n$ mới nhân liên hợp.',
      miniQuiz: [
        {
          id: 'm116-s1-q1',
          question: 'Giá trị của giới hạn $\\lim \\frac{6n^2 - 3n + 1}{2n^2 + 5}$ là:',
          options: ['A. $3$', 'B. $0$', 'C. $+\\infty$', 'D. $\\frac{1}{5}$'],
          correctIndex: 0,
          explanation: 'Tử và mẫu cùng bậc $2$, nên giới hạn bằng tỉ số hệ số bậc cao nhất: $\\frac{6}{2} = 3$.'
        },
        {
          id: 'm116-s1-q2',
          question: 'Tính giới hạn $L = \\lim \\left(\\sqrt{n^2 + 4n} - n\\right)$.',
          options: ['A. $2$', 'B. $4$', 'C. $0$', 'D. $+\\infty$'],
          correctIndex: 0,
          explanation: 'Nhân liên hợp: $\\lim \\frac{4n}{\\sqrt{n^2 + 4n} + n} = \\lim \\frac{4}{\\sqrt{1 + 4/n} + 1} = \\frac{4}{2} = 2$.'
        }
      ],
      miniEssay: {
        id: 'm116-s1-e1',
        question: 'Tính giới hạn $I = \\lim \\frac{3 \\cdot 5^n - 2^{n+1}}{5^{n+1} + 4^n}$.',
        hint: 'Chia cả tử và mẫu cho $5^n$ (lũy thừa có cơ số lớn nhất), lưu ý $5^{n+1} = 5 \\cdot 5^n$ và $2^{n+1} = 2 \\cdot 2^n$.',
        rubricChecklist: [
          'Tách $2^{n+1} = 2\\cdot 2^n$ và $5^{n+1} = 5\\cdot 5^n$.',
          'Chia cả tử và mẫu cho $5^n$ được $\\frac{3 - 2(2/5)^n}{5 + (4/5)^n}$.',
          'Dùng $\\lim(2/5)^n = 0$ và $\\lim(4/5)^n = 0$ kết luận $I = \\frac{3}{5}$.'
        ],
        sampleAnswer:
          'Ta viết lại $I = \\lim \\frac{3 \\cdot 5^n - 2 \\cdot 2^n}{5 \\cdot 5^n + 4^n}$. Chia cả tử và mẫu cho $5^n$: $I = \\lim \\frac{3 - 2\\left(\\frac{2}{5}\\right)^n}{5 + \\left(\\frac{4}{5}\\right)^n}$. Vì $\\left|\\frac{2}{5}\\right| < 1$ và $\\left|\\frac{4}{5}\\right| < 1$ nên $\\lim\\left(\\frac{2}{5}\\right)^n = 0$ và $\\lim\\left(\\frac{4}{5}\\right)^n = 0$. Vậy $I = \\frac{3 - 0}{5 + 0} = \\frac{3}{5}$.'
      }
    },
    {
      stepTitle: '2. Giới hạn Hàm số $\\lim_{x \\to x_0} f(x)$ & Khử Dạng vô định $\\frac{0}{0}$',
      stepType: 'derivation',
      conceptSection:
        'Khi thay $x = x_0$ trực tiếp vào phân thức $\\frac{f(x)}{g(x)}$ mà được $\\frac{0}{0}$ (tức $x_0$ là nghiệm chung của cả tử và mẫu), ta tuyệt đối không kết luận là $0$ hay không tồn tại, mà phải phân tích nhân tử $(x - x_0)$ (hoặc nhân liên hợp nếu có căn) để **triệt tiêu nhân tử gây bằng $0$**.',
      formulaSection: {
        primaryFormula: '\\lim_{x \\to x_0} \\frac{(x - x_0)A(x)}{(x - x_0)B(x)} = \\frac{A(x_0)}{B(x_0)} \\quad (B(x_0) \\neq 0)',
        secondaryFormulas: [
          '\\lim_{x \\to \\pm\\infty} \\sqrt{x^2 + bx} = \\lim_{x \\to \\pm\\infty} |x|\\sqrt{1 + \\frac{b}{x}}',
          'x \\to -\\infty \\implies \\sqrt{x^2} = |x| = -x'
        ],
        variablesNote:
          '• **Cạm bẫy chết người khi $x \\to -\\infty$**: Khi rút $x^2$ ra khỏi căn $\\sqrt{x^2}$, ta được $|x| = \\mathbf{-x}$ (vì $x$ âm!), KHÔNG ĐƯỢC rút thành $+x$!\n• Với hàm bậc 3 hoặc căn bậc 3 ở dạng $\\frac{0}{0}$, nhớ dùng lược đồ Horner hoặc hằng đẳng thức $(a-b)(a^2+ab+b^2) = a^3 - b^3$.'
      },
      deepDiveSection:
        'Ngoài ra, đối với giới hạn một bên $\\lim_{x \\to x_0^+} \\frac{A(x)}{B(x)}$ khi tử tiến tới $L \\neq 0$ và mẫu tiến tới $0$: kết quả chắc chắn là $+\\infty$ hoặc $-\\infty$, chỉ cần xét dấu của $L$ và dấu của $B(x)$ ở phía bên phải/trái của $x_0$.',
      teacherExplanation: 'Hễ thấy $x \\to -\\infty$ có chứa $\\sqrt{x^2 + \\dots}$, tự động nhắc ngay $\\sqrt{x^2} = -x$ để không bị sai dấu!',
      keyTakeaway: 'Dạng $\\frac{0}{0}$: phân tích nhân tử $(x - x_0)$ hoặc nhân liên hợp rồi rút gọn; chú ý $|x| = -x$ khi $x \\to -\\infty$.',
      miniQuiz: [
        {
          id: 'm116-s2-q1',
          question: 'Giá trị của giới hạn $\\lim_{x \\to 2} \\frac{x^2 - 5x + 6}{x - 2}$ bằng:',
          options: ['A. $-1$', 'B. $1$', 'C. $0$', 'D. $+\\infty$'],
          correctIndex: 0,
          explanation: '$\\frac{(x - 2)(x - 3)}{x - 2} = x - 3 \\xrightarrow{x \\to 2} 2 - 3 = -1$.'
        },
        {
          id: 'm116-s2-q2',
          question: 'Tính giới hạn $K = \\lim_{x \\to -\\infty} \\frac{\\sqrt{4x^2 + 1} - x}{2x + 3}$.',
          options: ['A. $-\\frac{3}{2}$', 'B. $\\frac{1}{2}$', 'C. $\\frac{3}{2}$', 'D. $-\\frac{1}{2}$'],
          correctIndex: 0,
          explanation: 'Vì $x \\to -\\infty$, $\\sqrt{4x^2 + 1} = |x|\\sqrt{4 + 1/x^2} = -x\\sqrt{4 + 1/x^2}$. Chia cả tử và mẫu cho $x$: $\\frac{-\\sqrt{4 + 1/x^2} - 1}{2 + 3/x} \\to \\frac{-2 - 1}{2} = -\\frac{3}{2}$.'
        }
      ],
      miniEssay: {
        id: 'm116-s2-e1',
        question: 'Tính giới hạn $\\lim_{x \\to 3} \\frac{\\sqrt{x + 1} - 2}{x - 3}$.',
        hint: 'Đây là dạng $\\frac{0}{0}$. Nhân cả tử và mẫu với biểu thức liên hợp $\\sqrt{x + 1} + 2$ để làm xuất hiện nhân tử $(x - 3)$ trên tử.',
        rubricChecklist: [
          'Nhân liên hợp tử thành $(\\sqrt{x + 1})^2 - 4 = x - 3$.',
          'Rút gọn $(x - 3)$ ở tử và mẫu còn $\\frac{1}{\\sqrt{x + 1} + 2}$.',
          'Thay $x = 3$ tính ra kết quả $\\frac{1}{4}$.'
        ],
        sampleAnswer:
          'Nhân cả tử và mẫu với $\\sqrt{x + 1} + 2$: $\\lim_{x \\to 3} \\frac{(x + 1) - 4}{(x - 3)(\\sqrt{x + 1} + 2)} = \\lim_{x \\to 3} \\frac{x - 3}{(x - 3)(\\sqrt{x + 1} + 2)} = \\lim_{x \\to 3} \\frac{1}{\\sqrt{x + 1} + 2} = \\frac{1}{\\sqrt{4} + 2} = \\frac{1}{4}$.'
      }
    },
    {
      stepTitle: '3. Hàm số Liên tục tại Một điểm & Định lý Giá trị Trung gian',
      stepType: 'example',
      conceptSection:
        'Đồ thị của hàm số liên tục trên một khoảng là một đường nét liền không bị đứt gãy. Hàm số $y = f(x)$ liên tục tại $x_0$ khi và chỉ khi giới hạn phải, giới hạn trái và giá trị hàm số tại $x_0$ cùng tồn tại và BẰNG NHAU.',
      formulaSection: {
        primaryFormula: '\\lim_{x \\to x_0^+} f(x) = \\lim_{x \\to x_0^-} f(x) = f(x_0)',
        secondaryFormulas: [
          '\\text{Hàm cho bởi 2 nhánh } x \\neq x_0 \\text{ và } x = x_0: \\ \\lim_{x \\to x_0} f(x) = f(x_0)',
          '\\text{Chứng minh có nghiệm trên } (a; b): \\ f(x) \\text{ liên tục trên } [a; b] \\text{ và } f(a) \\cdot f(b) < 0'
        ],
        variablesNote:
          '• **Ứng dụng chứng minh phương trình $f(x) = 0$ có ít nhất $k$ nghiệm**: Chỉ cần tìm ra $(k+1)$ điểm $a_0 < a_1 < \\dots < a_k$ sao cho các giá trị $f(a_i)$ **đổi dấu liên tiếp** ($f(a_0)f(a_1) < 0, \\dots$).\n• Nếu phương trình chứa tham số $m$, khéo léo chọn các giá trị $x$ làm triệt tiêu tham số $m$!'
      },
      deepDiveSection:
        'Trong bài toán tìm $m$ để hàm số ghép nhánh liên tục tại $x_0$: cần viết rõ cả 3 thành phần ($\\lim_{x \\to x_0^+} f(x)$, $\\lim_{x \\to x_0^-} f(x)$, và $f(x_0)$), rồi cho chúng bằng nhau để giải $m$.',
      teacherExplanation: 'Muốn chứng minh phương trình chứa tham số $m$ luôn có nghiệm, hãy thử chọn $x$ sao cho $m$ bị triệt tiêu ở một vế hoặc đổi dấu liên tiếp!',
      keyTakeaway: 'Liên tục tại $x_0 \\iff$ giới hạn hai bên bằng nhau và bằng $f(x_0)$; $f(a)f(b) < 0$ đảm bảo có nghiệm trong $(a; b)$.',
      miniQuiz: [
        {
          id: 'm116-s3-q1',
          question: 'Cho hàm số $f(x) = \\begin{cases} \\frac{x^2 - 4}{x - 2} & \\text{khi } x \\neq 2 \\\\ 2m + 1 & \\text{khi } x = 2 \\end{cases}$. Tìm $m$ để $f(x)$ liên tục tại $x = 2$.',
          options: ['A. $m = \\frac{3}{2}$', 'B. $m = 2$', 'C. $m = \\frac{5}{2}$', 'D. $m = 1$'],
          correctIndex: 0,
          explanation: '$\\lim_{x \\to 2} f(x) = \\lim_{x \\to 2}(x + 2) = 4$. Để liên tục tại $2$ cần $2m + 1 = 4 \\implies m = \\frac{3}{2}$.'
        },
        {
          id: 'm116-s3-q2',
          question: 'Phương trình $x^3 - 3x + 1 = 0$ có ít nhất bao nhiêu nghiệm trong khoảng $(-2; 2)$?',
          options: ['A. $3$ nghiệm', 'B. $1$ nghiệm', 'C. $2$ nghiệm', 'D. $0$ nghiệm'],
          correctIndex: 0,
          explanation: 'Xét $f(-2) = -1 < 0$; $f(0) = 1 > 0$; $f(1) = -1 < 0$; $f(2) = 3 > 0$. Đổi dấu $3$ lần trên $(-2; 0)$, $(0; 1)$, $(1; 2)$ nên có ít nhất $3$ nghiệm.'
        }
      ],
      miniEssay: {
        id: 'm116-s3-e1',
        question: 'Chứng minh rằng phương trình $x^5 - 3x - 1 = 0$ có ít nhất một nghiệm dương nhỏ hơn $2$.',
        hint: 'Xét hàm số đa thức $f(x) = x^5 - 3x - 1$ liên tục trên $\\mathbb{R}$, tính $f(0)$ và $f(2)$ rồi kiểm tra $f(0)\\cdot f(2) < 0$.',
        rubricChecklist: [
          'Khẳng định $f(x) = x^5 - 3x - 1$ là hàm đa thức nên liên tục trên $\\mathbb{R}$ (nên liên tục trên $[0; 2]$).',
          'Tính đúng $f(0) = -1 < 0$ và $f(2) = 32 - 6 - 1 = 25 > 0$.',
          'Từ $f(0)\\cdot f(2) < 0$ kết luận tồn tại ít nhất 1 nghiệm $c \\in (0; 2)$.'
        ],
        sampleAnswer:
          'Xét hàm số $f(x) = x^5 - 3x - 1$. Vì $f(x)$ là hàm đa thức nên liên tục trên $\\mathbb{R}$, do đó liên tục trên đoạn $[0; 2]$. Ta có $f(0) = -1 < 0$ và $f(2) = 2^5 - 3\\cdot 2 - 1 = 25 > 0$. Vì $f(0) \\cdot f(2) = -25 < 0$ nên phương trình $f(x) = 0$ có ít nhất một nghiệm thuộc khoảng $(0; 2)$.'
      }
    }
  ],
  'math-11-7': [
    {
      stepTitle: '1. Giao tuyến Hai Mặt phẳng & Giao điểm Đường thẳng với Mặt phẳng',
      stepType: 'concept',
      conceptSection:
        'Nền tảng của hình học không gian 11 là tìm giao tuyến của hai mặt phẳng $(P)$ và $(Q)$ (cần tìm $2$ điểm chung phân biệt, hoặc $1$ điểm chung kèm $1$ cặp đường thẳng song song) và tìm giao điểm của đường thẳng $d$ với mặt phẳng $(P)$ bằng phương pháp mặt phẳng phụ.',
      formulaSection: {
        primaryFormula: '\\text{Tìm } d \\cap (P): \\text{ Chọn } (Q) \\supset d, \\text{ tìm } \\Delta = (P) \\cap (Q) \\implies d \\cap (P) = d \\cap \\Delta',
        secondaryFormulas: [
          '\\text{Hệ quả song song: } a \\subset (P),\\ b \\subset (Q),\\ a \\parallel b,\\ M \\in (P) \\cap (Q) \\implies (P) \\cap (Q) = Mx \\parallel a \\parallel b',
          '\\text{Chứng minh 3 điểm thẳng hàng: cùng thuộc } (P) \\cap (Q)'
        ],
        variablesNote:
          '• **Cấm kỵ tuyệt đối trong hình không gian**: Chỉ được cho hai đường thẳng cắt nhau khi chúng **CÙNG NẰM TRONG MỘT MẶT PHẲNG**!\n• Nếu hai đường $MN$ và $BC$ chéo nhau, vẽ cắt nhau trên giấy là sai bản chất hoàn toàn.'
      },
      deepDiveSection:
        'Để chứng minh 3 đường thẳng đồng quy (cắt nhau tại 1 điểm), ta cho 2 đường cắt nhau tại $I$ (trong cùng 1 mặt phẳng), rồi chứng minh $I$ thuộc giao tuyến của hai mặt phẳng mà giao tuyến đó chính là đường thẳng thứ 3.',
      teacherExplanation: 'Muốn kéo dài hai đường cắt nhau, luôn tự kiểm tra chúng có cùng nằm trong 1 mặt phẳng hay không!',
      keyTakeaway: 'Tìm $d \\cap (P)$: nhét $d$ vào mặt phụ $(Q)$, tìm giao tuyến $\\Delta = (P) \\cap (Q)$, rồi cho $d$ cắt $\\Delta$ trong $(Q)$.',
      miniQuiz: [
        {
          id: 'm117-s1-q1',
          question: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình thang ($AB \\parallel CD$, $AB > CD$). Giao tuyến của hai mặt phẳng $(SAB)$ và $(SCD)$ là đường thẳng:',
          options: [
            'A. Đi qua $S$ và song song với $AB, CD$',
            'B. Đường thẳng $SO$ với $O = AC \\cap BD$',
            'C. Đường thẳng $SI$ với $I = AD \\cap BC$',
            'D. Không tồn tại giao tuyến'
          ],
          correctIndex: 0,
          explanation: 'Hai mặt phẳng có điểm chung $S$ và chứa hai đường song song $AB \\parallel CD$, nên giao tuyến là đường thẳng $Sx$ qua $S$ song song $AB$ và $CD$.'
        },
        {
          id: 'm117-s1-q2',
          question: 'Cho tứ diện $ABCD$. Lấy $M \\in AB, N \\in AC$ sao cho $MN$ không song song $BC$. Giao điểm của $MN$ với mặt phẳng $(BCD)$ nằm trên đường thẳng nào?',
          options: ['A. $BC$', 'B. $CD$', 'C. $BD$', 'D. $AD$'],
          correctIndex: 0,
          explanation: 'Chọn mặt phụ $(ABC)$ chứa $MN$. Giao tuyến $(ABC) \\cap (BCD) = BC$, nên giao điểm của $MN$ và $(BCD)$ là $MN \\cap BC$.'
        }
      ],
      miniEssay: {
        id: 'm117-s1-e1',
        question: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình bình hành tâm $O$. Gọi $M$ là trung điểm $SC$. Tìm giao điểm $I$ của đường thẳng $AM$ với mặt phẳng $(SBD)$.',
        hint: 'Chọn mặt phẳng phụ $(SAC)$ chứa $AM$. Tìm giao tuyến của $(SAC)$ và $(SBD)$ là $SO$, rồi cho $AM$ cắt $SO$ trong $(SAC)$.',
        rubricChecklist: [
          'Chọn mặt phẳng phụ $(SAC) \\supset AM$.',
          'Chỉ ra $(SAC) \\cap (SBD) = SO$.',
          'Trong $(SAC)$, $I = AM \\cap SO$ chính là giao điểm cần tìm (đặc biệt $I$ là trọng tâm $\\triangle SAC$).'
        ],
        sampleAnswer:
          'Chọn mặt phẳng phụ $(SAC)$ chứa $AM$. Xét $(SAC)$ và $(SBD)$ có $S$ là điểm chung thứ nhất; $O = AC \\cap BD$ nên $O$ là điểm chung thứ hai, suy ra $(SAC) \\cap (SBD) = SO$. Trong mặt phẳng $(SAC)$, gọi $I = AM \\cap SO$. Vì $I \\in SO \\subset (SBD)$ nên $I = AM \\cap (SBD)$.'
      }
    },
    {
      stepTitle: '2. Đường thẳng Song song Mặt phẳng & Hai Mặt phẳng Song song',
      stepType: 'derivation',
      conceptSection:
        'Để chứng minh đường thẳng $d$ (không nằm trong $(P)$) song song với $(P)$, ta chỉ cần chỉ ra trong $(P)$ có một đường thẳng $a$ song song với $d$. Để chứng minh hai mặt phẳng $(P) \\parallel (Q)$, chỉ cần chứng minh $(P)$ chứa **hai đường thẳng cắt nhau** cùng song song với $(Q)$.',
      formulaSection: {
        primaryFormula: '\\begin{cases} d \\not\\subset (P) \\\\ d \\parallel a \\subset (P) \\end{cases} \\implies d \\parallel (P)',
        secondaryFormulas: [
          '\\text{Hệ quả: } d \\parallel (P),\\ d \\subset (Q),\\ (P) \\cap (Q) = \\Delta \\implies \\Delta \\parallel d',
          '\\text{Định lý Thales không gian: 3 mặt phẳng } \\parallel \\text{ chắn các đoạn tỉ lệ bằng nhau}'
        ],
        variablesNote:
          '• **Mẹo dựng đường song song kinh điển trong tứ diện / hình chóp**:\n  - Đường trung bình tam giác ($MN \\parallel BC$).\n  - Đường trung bình hình thang / tính chất trọng tâm (tỉ lệ $\\frac{2}{3}$ theo Thales đảo!).\n  - Hình bình hành ($OM \\parallel SA$ khi $O, M$ là hai trung điểm).'
      },
      deepDiveSection:
        'Định lý giao tuyến của hai mặt phẳng song song: một mặt phẳng $(R)$ cắt hai mặt phẳng song song $(P) \\parallel (Q)$ theo hai giao tuyến **song song với nhau**. Định lý này là chìa khóa mở rộng các nét cắt khi tìm thiết diện song song.',
      teacherExplanation: 'Khi gặp các trung điểm hoặc trọng tâm trong hình chóp, nghĩ ngay tới đường trung bình hoặc tỉ lệ $\\frac{2}{3}$ để suy ra song song!',
      keyTakeaway: '$d \\parallel (P)$ chỉ cần chỉ ra 1 đường trong $(P)$ song song $d$; $(P) \\parallel (Q)$ cần 2 đường cắt nhau trong $(P)$ song song $(Q)$.',
      miniQuiz: [
        {
          id: 'm117-s2-q1',
          question: 'Cho hình chóp $S.ABCD$ đáy là hình bình hành tâm $O$. Gọi $M, N$ lần lượt là trung điểm $SA, SD$. Đường thẳng $MN$ song song với mặt phẳng nào?',
          options: ['A. $(SBC)$', 'B. $(SAB)$', 'C. $(SCD)$', 'D. $(SAC)$'],
          correctIndex: 0,
          explanation: '$MN$ là đường trung bình $\\triangle SAD \\implies MN \\parallel AD$. Mà $AD \\parallel BC \\subset (SBC)$ nên $MN \\parallel (SBC)$.'
        },
        {
          id: 'm117-s2-q2',
          question: 'Cho tứ diện $ABCD$ có $G_1, G_2$ lần lượt là trọng tâm các tam giác $ABC$ và $ABD$. Khẳng định nào ĐÚNG?',
          options: [
            'A. $G_1 G_2 \\parallel (BCD)$',
            'B. $G_1 G_2 \\parallel AB$',
            'C. $G_1 G_2$ cắt $CD$',
            'D. $G_1 G_2 \\parallel (ABC)$'
          ],
          correctIndex: 0,
          explanation: 'Gọi $M, N$ là trung điểm $BC, BD$. Ta có $\\frac{AG_1}{AM} = \\frac{AG_2}{AN} = \\frac{2}{3} \\implies G_1 G_2 \\parallel MN \\subset (BCD) \\implies G_1 G_2 \\parallel (BCD)$.'
        }
      ],
      miniEssay: {
        id: 'm117-s2-e1',
        question: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình bình hành tâm $O$, $M$ là trung điểm $SC$. Chứng minh rằng $SA \\parallel (MBD)$.',
        hint: 'Xét tam giác $SAC$, chỉ ra $OM$ là đường trung bình nên $OM \\parallel SA$, mà $OM \\subset (MBD)$.',
        rubricChecklist: [
          'Chỉ ra $O$ là trung điểm $AC$, $M$ là trung điểm $SC \\implies OM$ là đường trung bình $\\triangle SAC$.',
          'Suy ra $OM \\parallel SA$.',
          'Do $SA \\not\\subset (MBD)$ và $OM \\subset (MBD)$ kết luận $SA \\parallel (MBD)$.'
        ],
        sampleAnswer:
          'Vì $ABCD$ là hình bình hành tâm $O$ nên $O$ là trung điểm của $AC$. Lại có $M$ là trung điểm của $SC$, suy ra $OM$ là đường trung bình của $\\triangle SAC \\implies OM \\parallel SA$. Mà $OM \\subset (MBD)$ và $SA \\not\\subset (MBD)$, do đó $SA \\parallel (MBD)$.'
      }
    },
    {
      stepTitle: '3. Phương pháp Tìm Thiết diện (Mặt cắt Đa giác) của Hình chóp',
      stepType: 'example',
      conceptSection:
        'Thiết diện của hình chóp cắt bởi mặt phẳng $(\\alpha)$ là **đa giác khép kín** tạo bởi các đoạn giao tuyến của $(\\alpha)$ với tất cả các mặt của hình chóp. Chỉ cần nối các đoạn giao tuyến thành một vòng khép kín là xong thiết diện!',
      formulaSection: {
        primaryFormula: '\\text{Thiết diện } = \\text{Vòng khép kín các đoạn giao tuyến của } (\\alpha) \\text{ với các mặt}',
        secondaryFormulas: [
          '\\text{Phương pháp 1 (Mở rộng mặt cắt): kéo dài giao tuyến cắt các cạnh bên/đáy}',
          '\\text{Phương pháp 2 (Kẻ song song): } (\\alpha) \\parallel d \\text{ và có } M \\in (\\alpha) \\cap (P) \\implies \\text{kẻ } Mx \\parallel d'
        ],
        variablesNote:
          '• **Mẹo không bị sót cạnh thiết diện**: Kiểm tra từng mặt của hình chóp (đáy + $n$ mặt bên) xem mặt nào có 2 điểm thuộc $(\\alpha)$ hoặc nhận giao tuyến song song. Mỗi mặt chỉ cắt tối đa theo **1 đoạn thẳng**.\n• Khi tìm diện tích thiết diện (hình thang, tam giác), dùng tỉ lệ Thales tính các cạnh theo cạnh đáy/cạnh bên.'
      },
      deepDiveSection:
        'Khi đề cho mặt phẳng $(\\alpha)$ đi qua 1 điểm $M$ và song song với hai đường thẳng $a, b$ (ví dụ qua tâm $O$ và song song $SA, BC$): tại $O$ trong đáy kẻ đường song song $BC$ cắt $AB, CD$ ở $E, F$; rồi từ $E, F$ trong mặt bên kẻ song song $SA$ cắt $SB, SC$ ở $G, H$ — ngay lập tức khép kín hình thang $EFHG$!',
      teacherExplanation: 'Thiết diện song song rất dễ tìm: cứ tìm xem đường gốc nào nằm trong mặt nào, rồi kẻ song song qua điểm chung đã có!',
      keyTakeaway: 'Thiết diện là vòng giao tuyến khép kín trên các mặt; ưu tiên kẻ song song trước khi kéo dài cắt cạnh.',
      miniQuiz: [
        {
          id: 'm117-s3-q1',
          question: 'Cho hình chóp $S.ABCD$ đáy là hình thang ($AB \\parallel CD$, $AB > CD$). Mặt phẳng $(\\alpha)$ qua trung điểm $M$ của $SA$ và song song với mặt đáy $(ABCD)$ cắt hình chóp theo thiết diện là hình gì?',
          options: ['A. Hình thang', 'B. Tam giác', 'C. Hình bình hành', 'D. Hình chữ nhật'],
          correctIndex: 0,
          explanation: 'Mặt phẳng song song với mặt đáy cắt các mặt bên theo các đoạn thẳng tương ứng song song và tỉ lệ bằng $\\frac{1}{2}$ các cạnh đáy, nên thiết diện là hình thang đồng dạng với đáy.'
        },
        {
          id: 'm117-s3-q2',
          question: 'Thiết diện của một hình tứ diện cắt bởi một mặt phẳng bất kỳ có thể là đa giác tối đa bao nhiêu cạnh?',
          options: ['A. $4$ cạnh (tứ giác)', 'B. $3$ cạnh (tam giác)', 'C. $5$ cạnh (ngũ giác)', 'D. $6$ cạnh (lục giác)'],
          correctIndex: 0,
          explanation: 'Hình tứ diện chỉ có $4$ mặt, mỗi mặt bị cắt tối đa 1 đoạn thẳng nên thiết diện chỉ có tối đa $4$ cạnh (tam giác hoặc tứ giác).'
        }
      ],
      miniEssay: {
        id: 'm117-s3-e1',
        question: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình bình hành. Mặt phẳng $(\\alpha)$ đi qua trung điểm $M$ của cạnh $AB$ và song song với $AD$ và $SA$. Xác định hình dạng thiết diện của hình chóp cắt bởi $(\\alpha)$.',
        hint: 'Từ $M$ trong đáy $(ABCD)$ kẻ đường song song $AD$ cắt $CD$ tại $N$; từ $M$ trong $(SAB)$ kẻ song song $SA$ cắt $SB$ tại $P$; từ $N$ trong $(SCD)$ kẻ song song $SD$ (do $(\\alpha) \\parallel (SAD)$) cắt $SC$ tại $Q$.',
        rubricChecklist: [
          'Tìm được $MN \\parallel AD$ ($N$ là trung điểm $CD$).',
          'Tìm được $MP \\parallel SA$ ($P$ là trung điểm $SB$) và $NQ \\parallel SD$ ($Q$ là trung điểm $SC$).',
          'Nối $PQ$ ($PQ \\parallel BC \\parallel AD \\parallel MN$) và kết luận thiết diện $MNQP$ là hình thang.'
        ],
        sampleAnswer:
          'Vì $(\\alpha) \\parallel AD$ và $(\\alpha) \\parallel SA$ nên $(\\alpha) \\parallel (SAD)$. Trong đáy $(ABCD)$, giao tuyến $(\\alpha) \\cap (ABCD)$ qua $M$ song song $AD$ cắt $CD$ tại trung điểm $N$. Trong $(SAB)$, giao tuyến qua $M$ song song $SA$ cắt $SB$ tại trung điểm $P$. Trong $(SCD)$, giao tuyến qua $N$ song song $SD$ (vì $(\\alpha) \\parallel (SAD)$) cắt $SC$ tại trung điểm $Q$. Khi đó $PQ$ là đường trung bình $\\triangle SBC \\implies PQ \\parallel BC \\parallel AD \\parallel MN$ và $PQ = \\frac{1}{2}BC = \\frac{1}{2}AD = \\frac{1}{2}MN$. Vậy thiết diện là hình thang $MNQP$.'
      }
    }
  ],
  'math-11-8': [
    {
      stepTitle: '1. Lũy thừa với Số mũ Thực & Logarit Cơ bản (CT Mới Lớp 11)',
      stepType: 'concept',
      conceptSection:
        'Chương trình GDPT 2018 đưa toàn bộ Lũy thừa và Logarit xuống Lớp 11. Logarit cơ số $a$ của $b$ ($\\log_a b$) chính là **số mũ** mà ta phải nâng $a$ lên để được $b$ ($a^x = b \\iff x = \\log_a b$).',
      formulaSection: {
        primaryFormula: 'a^{\\log_a b} = b, \\qquad \\log_a(xy) = \\log_a x + \\log_a y, \\qquad \\log_a\\frac{x}{y} = \\log_a x - \\log_a y',
        secondaryFormulas: [
          '\\log_a(x^\\alpha) = \\alpha\\log_a x, \\qquad \\log_{a^\\beta} x = \\frac{1}{\\beta}\\log_a x',
          '\\text{Đổi cơ số: } \\log_a b = \\frac{\\log_c b}{\\log_c a} = \\frac{1}{\\log_b a}'
        ],
        variablesNote:
          '• **Điều kiện xác định bắt buộc**: Cơ số $0 < a \\neq 1$, biểu thức bên trong logarit $x > 0$!\n• **Bẫy chết người**: $\\log_a(x^2) = 2\\log_a |x|$, KHÔNG tự ý bỏ trị tuyệt đối thành $2\\log_a x$ nếu chưa biết $x > 0$!'
      },
      deepDiveSection:
        'Ký hiệu cần nhớ: $\\log x$ (viết tắt không ghi cơ số) là logarit thập phân $\\log_{10} x$; còn $\\ln x$ là logarit tự nhiên cơ số $e \\approx 2{,}718$. Khi rút gọn biểu thức tích các logarit nối tiếp $\\log_a b \\cdot \\log_b c \\cdot \\log_c d$, các cơ số/biểu thức chéo nhau tự triệt tiêu còn $\\log_a d$!',
      teacherExplanation: 'Đưa số mũ từ **trên đầu** ra ngoài đặt làm **tử**, còn số mũ ở **cơ số dưới chân** đưa ra ngoài đặt làm **mẫu**!',
      keyTakeaway: 'Điều kiện $\\log_a b$: $0 < a \\neq 1$ và $b > 0$; luôn giữ dấu trị tuyệt đối khi hạ mũ chẵn $\\log_a(x^2) = 2\\log_a|x|$.',
      miniQuiz: [
        {
          id: 'm118-s1-q1',
          question: 'Với $a > 0, a \\neq 1$, giá trị của biểu thức $P = \\log_{a^2}(a^5)$ bằng:',
          options: ['A. $\\frac{5}{2}$', 'B. $\\frac{2}{5}$', 'C. $10$', 'D. $3$'],
          correctIndex: 0,
          explanation: '$\\log_{a^2}(a^5) = \\frac{5}{2}\\log_a a = \\frac{5}{2}$.'
        },
        {
          id: 'm118-s1-q2',
          question: 'Cho $\\log_2 3 = a$ và $\\log_2 5 = b$. Biểu diễn $\\log_2 45$ theo $a, b$ là:',
          options: ['A. $2a + b$', 'B. $a^2 + b$', 'C. $a + 2b$', 'D. $2ab$'],
          correctIndex: 0,
          explanation: '$45 = 3^2 \\cdot 5 \\implies \\log_2(3^2 \\cdot 5) = 2\\log_2 3 + \\log_2 5 = 2a + b$.'
        }
      ],
      miniEssay: {
        id: 'm118-s1-e1',
        question: 'Với $a, b > 0$, rút gọn biểu thức $A = \\log_2(8a^3) - 3\\log_2 a + 2^{\\log_2 5}$.',
        hint: 'Tách $\\log_2(8a^3) = \\log_2 8 + 3\\log_2 a = 3 + 3\\log_2 a$ và dùng $2^{\\log_2 5} = 5$.',
        rubricChecklist: [
          'Tách đúng $\\log_2(8a^3) = 3 + 3\\log_2 a$.',
          'Triệt tiêu $3\\log_2 a - 3\\log_2 a = 0$ và tính $2^{\\log_2 5} = 5$.',
          'Kết luận $A = 3 + 5 = 8$.'
        ],
        sampleAnswer:
          'Vì $a > 0$ nên $\\log_2(8a^3) = \\log_2 8 + \\log_2(a^3) = 3 + 3\\log_2 a$. Mặt khác $2^{\\log_2 5} = 5$. Thay vào biểu thức: $A = (3 + 3\\log_2 a) - 3\\log_2 a + 5 = 8$.'
      }
    },
    {
      stepTitle: '2. Phương trình & Bất phương trình Mũ – Logarit Cơ bản',
      stepType: 'derivation',
      conceptSection:
        'Hàm số mũ $y = a^x$ và hàm số logarit $y = \\log_a x$ đồng biến khi cơ số $a > 1$ (giữ nguyên chiều bất phương trình) và nghịch biến khi $0 < a < 1$ (**đổi chiều bất phương trình**!).',
      formulaSection: {
        primaryFormula: 'a^{f(x)} > a^{g(x)} \\iff \\begin{cases} f(x) > g(x) & \\text{nếu } a > 1 \\\\ f(x) < g(x) & \\text{nếu } 0 < a < 1 \\end{cases}',
        secondaryFormulas: [
          '\\log_a f(x) > b \\iff \\begin{cases} f(x) > a^b & \\text{nếu } a > 1 \\\\ 0 < f(x) < a^b & \\text{nếu } 0 < a < 1 \\end{cases}',
          'a^{f(x)} = b \\ (b > 0) \\iff f(x) = \\log_a b'
        ],
        variablesNote:
          '• **Hai cái bẫy làm mất sạch điểm phần BPT Logarit**:\n  (1) Quên điều kiện xác định $f(x) > 0$ (đặc biệt khi cơ số $0 < a < 1$ phải chặn $0 < f(x) < a^b$!).\n  (2) Quên **đảo chiều** bất phương trình khi cơ số nằm giữa $0$ và $1$ (như $\\frac{1}{2}, \\frac{1}{3}, 0{,}5$).'
      },
      deepDiveSection:
        'Khi giải phương trình $\\log_a f(x) = \\log_a g(x)$: đặt điều kiện $f(x) > 0$ (hoặc $g(x) > 0$) rồi giải $f(x) = g(x)$. Nếu dùng phép gộp $\\log A + \\log B = \\log(AB)$, BẮT BUỘC đặt điều kiện $A > 0$ VÀ $B > 0$ trước khi gộp, kẻo phương trình nhận thêm nghiệm làm cả $A$ và $B$ cùng âm!',
      teacherExplanation: 'Cơ số $> 1$: giữ chiều; cơ số $0 < a < 1$: ĐẢO CHIỀU và chặn thêm $> 0$!',
      keyTakeaway: 'Đặt điều kiện bên trong $\\log$ lớn hơn $0$ trước khi giải; kiểm tra cơ số $a > 1$ hay $0 < a < 1$.',
      miniQuiz: [
        {
          id: 'm118-s2-q1',
          question: 'Tập nghiệm của bất phương trình $\\log_{\\frac{1}{2}}(x - 1) > -2$ là:',
          options: ['A. $(1; 5)$', 'B. $(-\\infty; 5)$', 'C. $(5; +\\infty)$', 'D. $(1; 3)$'],
          correctIndex: 0,
          explanation: 'Vì cơ số $0 < \\frac{1}{2} < 1$ nên đổi chiều và kèm điều kiện $> 0$: $0 < x - 1 < (\\frac{1}{2})^{-2} = 4 \\iff 1 < x < 5$.'
        },
        {
          id: 'm118-s2-q2',
          question: 'Nghiệm của phương trình $3^{2x - 1} = 27$ là:',
          options: ['A. $x = 2$', 'B. $x = 1$', 'C. $x = 5$', 'D. $x = \\frac{3}{2}$'],
          correctIndex: 0,
          explanation: '$27 = 3^3 \\implies 2x - 1 = 3 \\iff x = 2$.'
        }
      ],
      miniEssay: {
        id: 'm118-s2-e1',
        question: 'Giải bất phương trình $\\left(\\frac{1}{3}\\right)^{x^2 - 2x} \\ge \\frac{1}{27}$.',
        hint: 'Viết $\\frac{1}{27} = (\\frac{1}{3})^3$. Vì cơ số $\\frac{1}{3} < 1$ nên đảo chiều thành $x^2 - 2x \\le 3$.',
        rubricChecklist: [
          'Đổi $\\frac{1}{27} = \\left(\\frac{1}{3}\\right)^3$.',
          'Đảo chiều bất phương trình vì cơ số $0 < \\frac{1}{3} < 1$: $x^2 - 2x \\le 3$.',
          'Giải $x^2 - 2x - 3 \\le 0 \\implies$ tập nghiệm $S = [-1; 3]$.'
        ],
        sampleAnswer:
          'Bất phương trình tương đương $\\left(\\frac{1}{3}\\right)^{x^2 - 2x} \\ge \\left(\\frac{1}{3}\\right)^3$. Vì cơ số $\\frac{1}{3} \\in (0; 1)$ nên ta đảo chiều: $x^2 - 2x \\le 3 \\iff x^2 - 2x - 3 \\le 0 \\iff -1 \\le x \\le 3$. Vậy tập nghiệm là $S = [-1; 3]$.'
      }
    },
    {
      stepTitle: '3. Quy tắc Cộng & Quy tắc Nhân Xác suất · Biến cố Độc lập (CT Mới 11)',
      stepType: 'example',
      conceptSection:
        'Chương trình mới Lớp 11 định nghĩa rõ hai phép toán biến cố: **Biến cố hợp $A \\cup B$** ("ít nhất một trong hai xảy ra") và **Biến cố giao $AB$** ("cả hai cùng xảy ra"). Hai biến cố gọi là **độc lập** nếu việc xảy ra biến cố này không làm thay đổi xác suất biến cố kia.',
      formulaSection: {
        primaryFormula: 'P(A \\cup B) = P(A) + P(B) - P(AB), \\qquad A, B \\text{ độc lập} \\implies P(AB) = P(A)\\cdot P(B)',
        secondaryFormulas: [
          'A, B \\text{ xung khắc } (AB = \\emptyset) \\implies P(A \\cup B) = P(A) + P(B)',
          'P(\\text{ít nhất 1 lần thành công}) = 1 - P(\\text{tất cả đều thất bại})'
        ],
        variablesNote:
          '• **Phân biệt Xung khắc và Độc lập**:\n  - **Xung khắc**: Không thể xảy ra đồng thời ($A \\cap B = \\emptyset \\implies P(AB) = 0$).\n  - **Độc lập**: Có thể xảy ra đồng thời, nhưng xác suất không ảnh hưởng nhau ($P(AB) = P(A)P(B)$).\n• Nếu $A$ và $B$ độc lập thì các cặp $(A, \\overline{B})$, $(\\overline{A}, B)$, $(\\overline{A}, \\overline{B})$ cũng độc lập!'
      },
      deepDiveSection:
        'Bài toán kinh điển trong đề thi: hai người bắn độc lập vào bia với xác suất trúng $p_1$ và $p_2$. Để tính xác suất "có ít nhất một người bắn trúng", luôn dùng biến cố đối: $1 - (1 - p_1)(1 - p_2)$. Muốn tính "đúng 1 người bắn trúng": $p_1(1 - p_2) + (1 - p_1)p_2$.',
      teacherExplanation: 'Gặp từ khóa "ít nhất 1..." với các phép thử độc lập, dùng ngay $1 - P(\\text{tất cả trượt})$ cho siêu gọn!',
      keyTakeaway: '$P(A \\cup B) = P(A) + P(B) - P(AB)$; hai biến cố độc lập nhân xác suất $P(AB) = P(A)P(B)$.',
      miniQuiz: [
        {
          id: 'm118-s3-q1',
          question: 'Hai xạ thủ A và B bắn độc lập vào mục tiêu với xác suất trúng lần lượt là $0{,}7$ và $0{,}8$. Xác suất để có **ít nhất một người** bắn trúng là:',
          options: ['A. $0{,}94$', 'B. $0{,}56$', 'C. $0{,}06$', 'D. $0{,}38$'],
          correctIndex: 0,
          explanation: 'Xác suất cả hai cùng trượt là $(1 - 0{,}7)(1 - 0{,}8) = 0{,}3 \\cdot 0{,}2 = 0{,}06$. Vậy xác suất ít nhất 1 người trúng là $1 - 0{,}06 = 0{,}94$.'
        },
        {
          id: 'm118-s3-q2',
          question: 'Cho $P(A) = 0{,}4$, $P(B) = 0{,}5$ và $P(AB) = 0{,}2$. Giá trị của $P(A \\cup B)$ bằng:',
          options: ['A. $0{,}7$', 'B. $0{,}9$', 'C. $0{,}2$', 'D. $0{,}3$'],
          correctIndex: 0,
          explanation: '$P(A \\cup B) = P(A) + P(B) - P(AB) = 0{,}4 + 0{,}5 - 0{,}2 = 0{,}7$.'
        }
      ],
      miniEssay: {
        id: 'm118-s3-e1',
        question: 'Một mạch điện có 2 bóng đèn A và B mắc song song hoạt động độc lập. Xác suất bóng A hỏng trong tháng là $0{,}1$ và bóng B hỏng là $0{,}2$. Tính xác suất để có **đúng 1 bóng** bị hỏng trong tháng.',
        hint: 'Chia 2 trường hợp rời nhau: (A hỏng và B tốt) hoặc (A tốt và B hỏng), áp dụng quy tắc nhân cho từng cặp độc lập rồi cộng lại.',
        rubricChecklist: [
          'Tính $P(\\overline{A}) = 0{,}9$ và $P(\\overline{B}) = 0{,}8$.',
          'Tính 2 nhánh: $P(A\\overline{B}) = 0{,}1 \\cdot 0{,}8 = 0{,}08$ và $P(\\overline{A}B) = 0{,}9 \\cdot 0{,}2 = 0{,}18$.',
          'Cộng ra kết quả $0{,}08 + 0{,}18 = 0{,}26$.'
        ],
        sampleAnswer:
          'Xác suất bóng A, B không hỏng lần lượt là $P(\\overline{A}) = 0{,}9$ và $P(\\overline{B}) = 0{,}8$. Biến cố "đúng 1 bóng hỏng" là hợp hai biến cố xung khắc $A\\overline{B}$ và $\\overline{A}B$. Vì A, B độc lập nên $P = P(A)P(\\overline{B}) + P(\\overline{A})P(B) = 0{,}1\\cdot 0{,}8 + 0{,}9\\cdot 0{,}2 = 0{,}08 + 0{,}18 = 0{,}26$.'
      }
    }
  ],
  'math-11-9': [
    {
      stepTitle: '1. Tổng hợp Quy tắc Đạo hàm (Cơ bản + Mũ – Logarit CT Mới 11)',
      stepType: 'concept',
      conceptSection:
        'Ngoài đạo hàm đa thức và lượng giác, chương trình lớp 11 mới còn bổ sung ngay đạo hàm của hàm số mũ và logarit để liên thông trực tiếp lên khảo sát hàm số lớp 12.',
      formulaSection: {
        primaryFormula: '(e^x)\' = e^x, \\quad (a^x)\' = a^x \\ln a, \\quad (\\ln x)\' = \\frac{1}{x}, \\quad (\\log_a x)\' = \\frac{1}{x\\ln a}',
        secondaryFormulas: [
          '(e^u)\' = u\'\\cdot e^u, \\qquad (a^u)\' = u\'\\cdot a^u \\ln a',
          '(\\ln|u|)\' = \\frac{u\'}{u}, \\qquad (\\log_a u)\' = \\frac{u\'}{u\\ln a}'
        ],
        variablesNote:
          '• **Nhớ vị trí $\\ln a$ không bao giờ nhầm**: Với hàm **Mũ $a^x$**, $\\ln a$ nằm ở **TỬ** ($a^x \\ln a$); với hàm **Logarit $\\log_a x$**, $\\ln a$ nằm ở **MẪU** ($\\frac{1}{x\\ln a}$).\n• Hàm $e^x$ là hàm duy nhất khác $0$ có đạo hàm bằng chính nó!'
      },
      deepDiveSection:
        'Trước khi đạo hàm biểu thức logarit phức tạp như $y = \\ln\\frac{(x+1)^2}{x - 3}$, đừng vội dùng quy tắc thương $(u/v)\'$! Hãy tách bằng tính chất logarit thành $y = 2\\ln|x+1| - \\ln|x-3|$, rồi đạo hàm từng số hạng trong 3 giây ra ngay $\\frac{2}{x+1} - \\frac{1}{x-3}$.',
      teacherExplanation: 'Hễ đạo hàm $\\ln(\\text{tích/thương})$, hãy tách thành tổng/hiệu các $\\ln$ trước rồi mới đạo hàm!',
      keyTakeaway: '$(a^x)\' = a^x\\ln a$ (nhân $\\ln a$), $(\\log_a x)\' = \\frac{1}{x\\ln a}$ (chia $\\ln a$).',
      miniQuiz: [
        {
          id: 'm119-s1-q1',
          question: 'Đạo hàm của hàm số $y = 3^x + \\ln(2x + 1)$ là:',
          options: [
            'A. $3^x\\ln 3 + \\frac{2}{2x + 1}$',
            'B. $3^x + \\frac{1}{2x + 1}$',
            'C. $\\frac{3^x}{\\ln 3} + \\frac{2}{2x + 1}$',
            'D. $x\\cdot 3^{x-1} + \\frac{2}{2x + 1}$'
          ],
          correctIndex: 0,
          explanation: '$(3^x)\' = 3^x\\ln 3$ và $[\\ln(2x+1)]\' = \\frac{(2x+1)\'}{2x+1} = \\frac{2}{2x+1}$.'
        },
        {
          id: 'm119-s1-q2',
          question: 'Tính đạo hàm của hàm số $y = x\\cdot e^{2x}$.',
          options: ['A. $(1 + 2x)e^{2x}$', 'B. $2e^{2x}$', 'C. $(1 + x)e^{2x}$', 'D. $2xe^{2x}$'],
          correctIndex: 0,
          explanation: '$y\' = (x)\'e^{2x} + x(e^{2x})\' = e^{2x} + 2xe^{2x} = (1 + 2x)e^{2x}$.'
        }
      ],
      miniEssay: {
        id: 'm119-s1-e1',
        question: 'Tính đạo hàm của hàm số $y = \\ln(x^2 + 1) + 2^{3x - 1}$.',
        hint: 'Áp dụng $(\\ln u)\' = \\frac{u\'}{u}$ và $(a^u)\' = u\' a^u \\ln a$.',
        rubricChecklist: [
          'Tính đúng $[\\ln(x^2 + 1)]\' = \\frac{2x}{x^2 + 1}$.',
          'Tính đúng $(2^{3x - 1})\' = 3 \\cdot 2^{3x - 1} \\ln 2$.',
          'Kết hợp chính xác hai hạng tử.'
        ],
        sampleAnswer:
          'Áp dụng công thức đạo hàm hàm hợp: $y\' = \\frac{(x^2 + 1)\'}{x^2 + 1} + (3x - 1)\' \\cdot 2^{3x - 1}\\ln 2 = \\frac{2x}{x^2 + 1} + 3 \\cdot 2^{3x - 1}\\ln 2$.'
      }
    },
    {
      stepTitle: '2. Đạo hàm Hàm hợp Lồng nhiều lớp & Giải Bất phương trình $f\'(x) \\ge 0$',
      stepType: 'derivation',
      conceptSection:
        'Bài toán đạo hàm lớp 11 không chỉ dừng ở việc tính $f\'(x)$ mà còn yêu cầu giải bất phương trình $f\'(x) > 0$ (bước đệm tìm khoảng đồng biến/nghịch biến ở lớp 12) hoặc chứng minh hệ thức liên hệ giữa $y, y\', y\'\'$.',
      formulaSection: {
        primaryFormula: 'y\' = f\'(u)\\cdot u\'(v)\\cdot v\'(x), \\qquad f\'(x) > 0 \\implies \\text{hàm tăng}',
        secondaryFormulas: [
          '(e^{f(x)})\' = f\'(x)\\cdot e^{f(x)} \\text{ (cùng dấu với } f\'(x) \\text{ vì } e^{f(x)} > 0)',
          'y\'\' + \\omega^2 y = 0 \\ (\\text{đặc trưng của } y = A\\sin(\\omega x + \\varphi))'
        ],
        variablesNote:
          '• Khi giải bất phương trình $y\' > 0$ với $y\' = (x - 1)e^x$: vì $e^x > 0\\ \\forall x$ nên chia bỏ thẳng $e^x$, còn ngay $x - 1 > 0 \\iff x > 1$!\n• Tương tự, với $(cx + d)^2 > 0$ ở mẫu khi xét dấu phân thức: bỏ qua mẫu bình phương (nhưng nhớ giữ điều kiện mẫu khác $0$!).'
      },
      deepDiveSection:
        'Nếu gặp đẳng thức cần chứng minh có dạng $x y\' - 2y = 0$ hoặc $y\'\' + 4y = 0$: cách làm chuẩn là tính riêng $y\'$ và $y\'\'$ gọn gàng trước, rồi thay cả $y, y\', y\'\'$ vào vế trái để rút gọn ra đúng $0$.',
      teacherExplanation: 'Khi giải $y\' > 0$ chứa $e^{u}$ hay bình phương dương, nhớ chỉ giữ điều kiện xác định và xét dấu phần nhân tử đổi dấu!',
      keyTakeaway: '$e^{u} > 0$ với mọi $u$, giúp thu gọn cực nhanh mọi bất phương trình $f\'(x) \\ge 0$.',
      miniQuiz: [
        {
          id: 'm119-s2-q1',
          question: 'Cho hàm số $f(x) = (x^2 - 2x)e^x$. Tập nghiệm của bất phương trình $f\'(x) > 0$ là:',
          options: [
            'A. $(-\\infty; -\\sqrt{2}) \\cup (\\sqrt{2}; +\\infty)$',
            'B. $(-\\sqrt{2}; \\sqrt{2})$',
            'C. $(0; 2)$',
            'D. $(-\\infty; 0) \\cup (2; +\\infty)$'
          ],
          correctIndex: 0,
          explanation: '$f\'(x) = (2x - 2)e^x + (x^2 - 2x)e^x = (x^2 - 2)e^x > 0 \\iff x^2 - 2 > 0 \\iff |x| > \\sqrt{2}$.'
        },
        {
          id: 'm119-s2-q2',
          question: 'Cho $y = \\sin(3x)$. Biểu thức $y\'\' + 9y$ bằng:',
          options: ['A. $0$', 'B. $6\\sin(3x)$', 'C. $18\\sin(3x)$', 'D. $-9\\sin(3x)$'],
          correctIndex: 0,
          explanation: '$y\' = 3\\cos(3x) \\implies y\'\' = -9\\sin(3x)$. Vậy $y\'\' + 9y = 0$.'
        }
      ],
      miniEssay: {
        id: 'm119-s2-e1',
        question: 'Cho hàm số $f(x) = x^3 - 3x^2 - 9x + 5$. Giải bất phương trình $f\'(x) \\le 0$.',
        hint: 'Tính $f\'(x) = 3x^2 - 6x - 9$, tìm hai nghiệm và dùng "trong trái ngoài cùng".',
        rubricChecklist: [
          'Tính đúng $f\'(x) = 3x^2 - 6x - 9$.',
          'Giải $3(x^2 - 2x - 3) \\le 0$ tìm hai nghiệm $x = -1, x = 3$.',
          'Kết luận tập nghiệm $S = [-1; 3]$.'
        ],
        sampleAnswer:
          'Ta có $f\'(x) = 3x^2 - 6x - 9$. Bất phương trình $f\'(x) \\le 0 \\iff 3(x^2 - 2x - 3) \\le 0 \\iff -1 \\le x \\le 3$. Vậy tập nghiệm là $S = [-1; 3]$.'
      }
    },
    {
      stepTitle: '3. Tiếp tuyến Đi qua một Điểm & Tiếp tuyến Chung / Bài toán Vận tốc',
      stepType: 'example',
      conceptSection:
        'Khép lại chương Đạo hàm lớp 11 là dạng bài toán nâng cao: viết phương trình tiếp tuyến của $(C)$ **đi qua** một điểm $A(x_A; y_A)$ cho trước (không nằm trên $(C)$) và bài toán ứng dụng cực trị tốc độ tức thời trong thực tế.',
      formulaSection: {
        primaryFormula: '\\text{Tiếp tuyến tại } M(x_0; f(x_0)) \\text{ đi qua } A(x_A; y_A) \\iff y_A = f\'(x_0)(x_A - x_0) + f(x_0)',
        secondaryFormulas: [
          '\\text{Số tiếp tuyến kẻ từ } A \\text{ tới } (C) = \\text{số nghiệm } x_0 \\text{ của phương trình trên}',
          'v(t) = s\'(t), \\qquad a(t) = v\'(t) = s\'\'(t)'
        ],
        variablesNote:
          '• **Chú ý khi giải phương trình ẩn $x_0$**: Sau khi tìm ra các giá trị $x_0$, thay từng $x_0$ vào công thức $y = f\'(x_0)(x - x_0) + f(x_0)$ — nhớ kiểm tra xem hai $x_0$ khác nhau có vô tình ra trùng 1 đường thẳng hay không!\n• Với bài toán vật lí tìm vận tốc lớn nhất của $s(t) = -t^3 + 6t^2 + 2t$: vận tốc là hàm bậc hai $v(t) = -3t^2 + 12t + 2$, đạt cực đại tại đỉnh $t = 2$!'
      },
      deepDiveSection:
        'Một bài toán tiếp tuyến thực tế nữa là tìm tiếp tuyến của $(C)$ tạo với trục tọa độ một tam giác có diện tích cho trước hoặc có hệ số góc nhỏ nhất: với hàm bậc 3 $y = ax^3 + bx^2 + cx + d$ ($a > 0$), hệ số góc tiếp tuyến $y\' = 3ax^2 + 2bx + c$ đạt nhỏ nhất tại đúng **điểm uốn** $x_0 = -\\frac{b}{3a}$ ($y\'\'(x_0) = 0$)!',
      teacherExplanation: 'Khi tìm tiếp tuyến đi qua $A(x_A; y_A)$, đừng lấy $x_A$ làm $x_0$, mà phải thay tọa độ $A$ vào $(x, y)$ để giải phương trình ẩn $x_0$!',
      keyTakeaway: 'Tiếp tuyến kẻ từ $A(x_A; y_A)$: lập phương trình $y_A = f\'(x_0)(x_A - x_0) + f(x_0)$ rồi giải $x_0$.',
      miniQuiz: [
        {
          id: 'm119-s3-q1',
          question: 'Từ điểm $A(0; -1)$, kẻ được bao nhiêu tiếp tuyến đến đồ thị hàm số $y = x^2$?',
          options: ['A. $2$', 'B. $1$', 'C. $0$', 'D. $3$'],
          correctIndex: 0,
          explanation: 'Thay $A(0; -1)$ vào $y = 2x_0(x - x_0) + x_0^2$: $-1 = -x_0^2 \\iff x_0 = \\pm 1$ ($2$ tiếp tuyến).'
        },
        {
          id: 'm119-s3-q2',
          question: 'Một vật chuyển động theo quy luật $s(t) = -\\frac{1}{3}t^3 + 4t^2 + 9t$ (m). Vận tốc lớn nhất vật đạt được trong khoảng thời gian chuyển động là:',
          options: ['A. $25\\text{ m/s}$', 'B. $16\\text{ m/s}$', 'C. $9\\text{ m/s}$', 'D. $21\\text{ m/s}$'],
          correctIndex: 0,
          explanation: '$v(t) = s\'(t) = -t^2 + 8t + 9 = -(t - 4)^2 + 25 \\le 25\\text{ m/s}$ (đạt tại $t = 4\\text{ s}$).'
        }
      ],
      miniEssay: {
        id: 'm119-s3-e1',
        question: 'Viết phương trình tiếp tuyến của Parabol $(P): y = x^2 - 2x + 3$ biết tiếp tuyến đó đi qua điểm $A(1; -2)$.',
        hint: 'Gọi tiếp điểm $M(x_0; x_0^2 - 2x_0 + 3)$, viết phương trình tiếp tuyến theo $x_0$ rồi thay $x = 1, y = -2$ vào giải $x_0$.',
        rubricChecklist: [
          'Tính $y\'(x_0) = 2x_0 - 2$ và viết phương trình tiếp tuyến tổng quát.',
          'Thay $A(1; -2)$: $-2 = (2x_0 - 2)(1 - x_0) + x_0^2 - 2x_0 + 3 \\iff x_0^2 - 2x_0 - 3 = 0$.',
          'Giải ra $x_0 = 3$ ($y = 4x - 6$) và $x_0 = -1$ ($y = -4x + 2$).'
        ],
        sampleAnswer:
          'Ta có $y\' = 2x - 2$. Gọi $x_0$ là hoành độ tiếp điểm, phương trình tiếp tuyến tại $M(x_0; x_0^2 - 2x_0 + 3)$ là $y = (2x_0 - 2)(x - x_0) + x_0^2 - 2x_0 + 3$. Vì tiếp tuyến đi qua $A(1; -2)$ nên $-2 = (2x_0 - 2)(1 - x_0) + x_0^2 - 2x_0 + 3 \\iff -2 = -2x_0^2 + 4x_0 - 2 + x_0^2 - 2x_0 + 3 \\iff x_0^2 - 2x_0 - 3 = 0 \\iff x_0 = 3$ hoặc $x_0 = -1$. Với $x_0 = 3 \\implies y = 4(x - 3) + 6 = 4x - 6$. Với $x_0 = -1 \\implies y = -4(x + 1) + 6 = -4x + 2$.'
      }
    }
  ]
};
