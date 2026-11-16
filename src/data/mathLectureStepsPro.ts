import { LectureStep } from '../types';

export const MATH_CUSTOM_LECTURE_STEPS_PRO: Record<string, LectureStep[]> = {
  'math-pro-1': [
    {
      stepTitle: '1. Kỹ thuật Biến đổi Căn thức Bậc cao & Trục căn Tổng quát',
      stepType: 'concept',
      conceptSection:
        'Trong đề thi Chuyên Toán & HSG, các biểu thức căn thức thường lồng nhiều lớp hoặc có dạng $x = \\sqrt[3]{A + \\sqrt{B}} + \\sqrt[3]{A - \\sqrt{B}}$. Thay vì cố tính giá trị gần đúng, ta **lập phương hai vế** bằng $(u + v)^3 = u^3 + v^3 + 3uv(u + v)$ để đưa về phương trình bậc ba ẩn $x$.',
      formulaSection: {
        primaryFormula: 'x = u + v \\implies x^3 = u^3 + v^3 + 3uv\\cdot x',
        secondaryFormulas: [
          '\\sqrt{a \\pm 2\\sqrt{b}} = |\\sqrt{x} \\pm \\sqrt{y}| \\quad (x + y = a,\\ xy = b)',
          '\\frac{1}{\\sqrt{n+1} + \\sqrt{n}} = \\sqrt{n+1} - \\sqrt{n} \\quad (\\text{tính tổng sai phân})'
        ],
        variablesNote:
          '• **Cảnh báo**: Nếu phương trình bậc ba nhận được là $x^3 - 3px - 2q = 0$, kiểm tra xem nó có nghiệm nguyên/hữu tỉ hay không rồi phân tích nhân tử $(x - x_0)(x^2 + ax + b) = 0$.\n• Nhớ chứng minh nhân tử bậc hai còn lại vô nghiệm ($\\Delta < 0$) trước khi kết luận nghiệm duy nhất!'
      },
      deepDiveSection:
        'Với chuỗi tổng phân thức chứa căn như $\\sum_{k=1}^{n} \\frac{1}{(k+1)\\sqrt{k} + k\\sqrt{k+1}}$, rút nhân tử chung $\\sqrt{k(k+1)}$ ở mẫu ta có $\\frac{1}{\\sqrt{k(k+1)}(\\sqrt{k+1} + \\sqrt{k})} = \\frac{\\sqrt{k+1} - \\sqrt{k}}{\\sqrt{k(k+1)}} = \\frac{1}{\\sqrt{k}} - \\frac{1}{\\sqrt{k+1}}$, tự triệt tiêu sạch dạng sai phân!',
      teacherExplanation: 'Gặp tổng hai căn bậc ba liên hợp $u + v$, lập phương ngay với $x^3 = u^3 + v^3 + 3uvx$!',
      keyTakeaway: 'Tách sai phân hoặc lập phương khử căn bậc ba là hai vũ khí chủ lực cho câu đại số Chuyên.',
      miniQuiz: [
        {
          id: 'mpro1-s1-q1',
          question: 'Cho $x = \\sqrt[3]{7 + 5\\sqrt{2}} + \\sqrt[3]{7 - 5\\sqrt{2}}$. Giá trị của $x$ bằng:',
          options: ['A. $2$', 'B. $4$', 'C. $2\\sqrt{2}$', 'D. $1 + \\sqrt{2}$'],
          correctIndex: 0,
          explanation: 'Đặt $u + v = x$, có $u^3 + v^3 = 14$, $uv = \\sqrt[3]{49 - 50} = -1$. Vậy $x^3 = 14 - 3x \\iff (x - 2)(x^2 + 2x + 7) = 0 \\implies x = 2$.'
        },
        {
          id: 'mpro1-s1-q2',
          question: 'Tính tổng $S = \\frac{1}{\\sqrt{1} + \\sqrt{2}} + \\frac{1}{\\sqrt{2} + \\sqrt{3}} + \\dots + \\frac{1}{\\sqrt{99} + \\sqrt{100}}$.',
          options: ['A. $9$', 'B. $10$', 'C. $11$', 'D. $\\sqrt{100} - 1 = 10$'],
          correctIndex: 0,
          explanation: 'Trục căn từng số hạng: $(\\sqrt{2} - 1) + (\\sqrt{3} - \\sqrt{2}) + \\dots + (\\sqrt{100} - \\sqrt{99}) = \\sqrt{100} - 1 = 10 - 1 = 9$.'
        }
      ],
      miniEssay: {
        id: 'mpro1-s1-e1',
        question: 'Tính giá trị biểu thức $P = x^3 - 3x + 2026$ biết $x = \\sqrt[3]{3 + 2\\sqrt{2}} + \\sqrt[3]{3 - 2\\sqrt{2}}$.',
        hint: 'Lập phương $x$ để tìm mối liên hệ $x^3 - 3x = 6$, thay thẳng vào $P$ mà không cần giải tìm $x$ cụ thể!',
        rubricChecklist: [
          'Đặt $a = \\sqrt[3]{3 + 2\\sqrt{2}},\\ b = \\sqrt[3]{3 - 2\\sqrt{2}}$, tính $a^3 + b^3 = 6$ và $ab = \\sqrt[3]{9 - 8} = 1$.',
          'Lập phương $x^3 = a^3 + b^3 + 3ab(a + b) = 6 + 3x \\implies x^3 - 3x = 6$.',
          'Thay vào tính $P = 6 + 2026 = 2032$.'
        ],
        sampleAnswer:
          'Đặt $a = \\sqrt[3]{3 + 2\\sqrt{2}}$ và $b = \\sqrt[3]{3 - 2\\sqrt{2}}$. Ta có $a^3 + b^3 = 6$ và $ab = \\sqrt[3]{(3 + 2\\sqrt{2})(3 - 2\\sqrt{2})} = \\sqrt[3]{9 - 8} = 1$. Khi đó $x^3 = (a + b)^3 = a^3 + b^3 + 3ab(a + b) = 6 + 3x \\implies x^3 - 3x = 6$. Thay vào biểu thức: $P = 6 + 2026 = 2032$.'
      }
    },
    {
      stepTitle: '2. Phương trình Vô tỉ Chuyên sâu (Đặt ẩn phụ Không hoàn toàn & Liên hợp)',
      stepType: 'derivation',
      conceptSection:
        'Khác với phương trình chứa căn cơ bản chỉ cần bình phương, phương trình vô tỉ thi Chuyên thường có bậc 3–4 sau khi bình phương hoặc chứa 2 căn lệch bậc. Ba phương pháp giải chủ đạo là **Nhân lượng liên hợp tạo nhân tử chung**, **Đặt ẩn phụ quy về hệ đối xứng**, và **Đặt ẩn phụ không hoàn toàn**.',
      formulaSection: {
        primaryFormula: '\\sqrt{A} - \\sqrt{B} = \\frac{A - B}{\\sqrt{A} + \\sqrt{B}} \\quad (\\text{Nhân liên hợp khi nhẩm được nghiệm } x_0)',
        secondaryFormulas: [
          '\\text{Hệ đối xứng: } \\sqrt{a + x} + \\sqrt{b - x} = m \\implies \\text{đặt } u = \\sqrt{a+x}, v = \\sqrt{b-x} \\implies u^2 + v^2 = a + b',
          '\\text{Ẩn phụ không hoàn toàn: giữ lại } x \\text{ trong PT bậc 2 theo } t = \\sqrt{\\dots}, \\text{ ép } \\Delta \\text{ chính phương}'
        ],
        variablesNote:
          '• **Bí quyết ép $\\Delta$ chính phương (ẩn phụ không hoàn toàn)**: Nếu đặt $t = \\sqrt{ax^2 + bx + c}$ mà vẫn còn vướng $x$, ta viết thành $t^2 - k(x)t + h(x) = 0$, tìm hằng số hệ số sao cho $\\Delta_t = (mx + n)^2$ chính phương, rồi phân tích được thành $(t - p(x))(t - q(x)) = 0$!\n• Khi nhân liên hợp $(x - x_0) \\cdot M(x) = 0$, nhớ đánh giá $M(x) > 0$ (hoặc $< 0$) trên tập xác định để khẳng định $x = x_0$ là nghiệm duy nhất.'
      },
      deepDiveSection:
        'Nếu nhẩm thấy phương trình có 2 nghiệm $x_1, x_2$, liên hợp thẳng với một nhị thức bậc nhất $ax + b$ đi qua $(x_1, \\sqrt{A(x_1)})$ và $(x_2, \\sqrt{A(x_2)})$ — kỹ thuật **"trừ đi hàm tuyến tính"** này đảm bảo làm xuất hiện ngay nhân tử $(x - x_1)(x - x_2)$!',
      teacherExplanation: 'Nhẩm trước 1 nghiệm $x_0$ bằng máy tính, rồi trừ hằng số tương ứng ở từng căn để nhân liên hợp kéo nhân tử $(x - x_0)$ ra ngoài!',
      keyTakeaway: 'Nhân liên hợp kéo nghiệm nhẩm $x_0$, hoặc đặt ẩn phụ không hoàn toàn đưa về tích hai nhân tử.',
      miniQuiz: [
        {
          id: 'mpro1-s2-q1',
          question: 'Khi giải phương trình $\\sqrt{3x + 1} - \\sqrt{x + 3} = x - 1$, ta nhẩm được nghiệm $x = 1$. Nhân liên hợp hai căn sẽ làm xuất hiện nhân tử chung nào?',
          options: ['A. $x - 1$', 'B. $x + 1$', 'C. $2x - 3$', 'D. $x - 4$'],
          correctIndex: 0,
          explanation: 'Tại $x = 1$, hai căn đều bằng $2$. Nhân lượng liên hợp vế trái cho $\\frac{(3x + 1) - (x + 3)}{\\sqrt{3x + 1} + \\sqrt{x + 3}} = \\frac{2(x - 1)}{\\sqrt{3x + 1} + \\sqrt{x + 3}}$, làm xuất hiện ngay nhân tử chung $(x - 1)$ với vế phải.'
        },
        {
          id: 'mpro1-s2-q2',
          question: 'Với phương trình $\\sqrt{x + 2} + \\sqrt{7 - x} = 5$, nếu đặt $u = \\sqrt{x + 2} \\ge 0$ và $v = \\sqrt{7 - x} \\ge 0$, hệ phương trình thu được là:',
          options: [
            'A. $u + v = 5$ và $u^2 + v^2 = 9$',
            'B. $u + v = 5$ và $u^2 - v^2 = 9$',
            'C. $u + v = 5$ và $uv = 9$',
            'D. $u + v = 5$ và $u^2 + v^2 = 5$'
          ],
          correctIndex: 0,
          explanation: '$u^2 + v^2 = (x + 2) + (7 - x) = 9$ (triệt tiêu biến $x$ hoàn toàn!).'
        }
      ],
      miniEssay: {
        id: 'mpro1-s2-e1',
        question: 'Giải phương trình $\\sqrt{x - 1} + \\sqrt{5 - x} = 2\\sqrt{2}$ bằng phương pháp đặt ẩn phụ đối xứng.',
        hint: 'ĐKXĐ $1 \\le x \\le 5$. Đặt $u = \\sqrt{x-1} \\ge 0, v = \\sqrt{5-x} \\ge 0$, ta có $u + v = 2\\sqrt{2}$ và $u^2 + v^2 = 4$.',
        rubricChecklist: [
          'Đặt đúng ĐKXĐ $1 \\le x \\le 5$ và hệ $\\begin{cases} u + v = 2\\sqrt{2} \\\\ u^2 + v^2 = 4 \\end{cases}$.',
          'Tính $2uv = (u + v)^2 - (u^2 + v^2) = 8 - 4 = 4 \\implies uv = 2$.',
          'Suy ra $u = v = \\sqrt{2} \\implies x - 1 = 2 \\implies x = 3$ (thỏa ĐKXĐ).'
        ],
        sampleAnswer:
          'ĐKXĐ: $1 \\le x \\le 5$. Đặt $u = \\sqrt{x - 1} \\ge 0, v = \\sqrt{5 - x} \\ge 0$. Ta có hệ $\\begin{cases} u + v = 2\\sqrt{2} \\\\ u^2 + v^2 = 4 \\end{cases}$. Suy ra $uv = \\frac{(u + v)^2 - (u^2 + v^2)}{2} = \\frac{8 - 4}{2} = 2$. Khi đó $u, v$ là nghiệm của $t^2 - 2\\sqrt{2}t + 2 = 0 \\iff (t - \\sqrt{2})^2 = 0 \\iff u = v = \\sqrt{2}$. Suy ra $x - 1 = 2 \\iff x = 3$ (thỏa mãn).'
      }
    },
    {
      stepTitle: '3. Bất đẳng thức Cô-si Chuyên & Kỹ thuật Ghép đối xứng / Đổi biến',
      stepType: 'example',
      conceptSection:
        'Ở mức Chuyên Toán, bài toán Cô-si thường cho điều kiện đối xứng 3 biến ($a+b+c=3$, $abc=1$, hoặc $ab+bc+ca=3$) và biểu thức hoán vị vòng quanh có mẫu chứa biến. Ta phối hợp Cô-si 3 số, kỹ thuật Cô-si ngược dấu và đổi biến $p, q, r$ hoặc $x/y$.',
      formulaSection: {
        primaryFormula: 'a^2 + b^2 + c^2 \\ge ab + bc + ca, \\qquad (a + b + c)^2 \\ge 3(ab + bc + ca)',
        secondaryFormulas: [
          '\\frac{1}{a} + \\frac{1}{b} + \\frac{1}{c} \\ge \\frac{9}{a + b + c} \\quad (a, b, c > 0)',
          '\\text{Ghép đối xứng: } (a + b)(b + c)(c + a) \\ge 8abc'
        ],
        variablesNote:
          '• **Kỹ thuật đặt ẩn phụ triệt tiêu điều kiện $abc = 1$**: Luôn đặt được $a = \\frac{x}{y},\\ b = \\frac{y}{z},\\ c = \\frac{z}{x}$ (hoặc $a = \\frac{yz}{x^2}$ tùy đẳng thức)!\n• **Kiểm tra đồng bậc**: Trước khi đánh giá một bất đẳng thức không có điều kiện ràng buộc hằng số, kiểm tra hai vế phải **cùng bậc** (ví dụ cùng bậc 2 hoặc cùng bậc 0).'
      },
      deepDiveSection:
        'Một đánh giá cực đẹp hay dùng trong đề Chuyên: $a^3 + b^3 = (a+b)(a^2 - ab + b^2) \\ge ab(a+b)$, suy ra $\\frac{1}{a^3 + b^3 + abc} \\le \\frac{1}{ab(a+b+c)} = \\frac{c}{abc(a+b+c)}$ — cộng 3 phân thức hoán vị vòng quanh ra ngay $\\frac{1}{abc}$!',
      teacherExplanation: 'Luôn kiểm tra điểm rơi (thường là $a = b = c$) và tính đồng bậc trước khi dùng Cô-si trên 3 biến!',
      keyTakeaway: 'Ghi nhớ bộ 3 đánh giá kinh điển: $a^2+b^2+c^2 \\ge ab+bc+ca$; $(a+b+c)^2 \\ge 3(ab+bc+ca)$; $\\sum \\frac{1}{a} \\ge \\frac{9}{\\sum a}$.',
      miniQuiz: [
        {
          id: 'mpro1-s3-q1',
          question: 'Cho $a, b, c > 0$ thỏa mãn $ab + bc + ca = 3$. Giá trị nhỏ nhất của $a + b + c$ là:',
          options: ['A. $3$', 'B. $1$', 'C. $9$', 'D. $\\sqrt{3}$'],
          correctIndex: 0,
          explanation: '$(a + b + c)^2 \\ge 3(ab + bc + ca) = 9 \\implies a + b + c \\ge 3$ (đạt khi $a = b = c = 1$).'
        },
        {
          id: 'mpro1-s3-q2',
          question: 'Với mọi $a, b, c > 0$, bất đẳng thức nào sau đây SAI?',
          options: [
            'A. $(a + b)(b + c)(c + a) \\le 8abc$',
            'B. $a^2 + b^2 + c^2 \\ge ab + bc + ca$',
            'C. $\\frac{a}{b} + \\frac{b}{c} + \\frac{c}{a} \\ge 3$',
            'D. $(a + b + c)\\left(\\frac{1}{a} + \\frac{1}{b} + \\frac{1}{c}\\right) \\ge 9$'
          ],
          correctIndex: 0,
          explanation: 'Chiều đúng phải là $(a + b)(b + c)(c + a) \\ge 2\\sqrt{ab}\\cdot 2\\sqrt{bc}\\cdot 2\\sqrt{ca} = 8abc$.'
        }
      ],
      miniEssay: {
        id: 'mpro1-s3-e1',
        question: 'Cho $a, b, c > 0$ thỏa mãn $a + b + c = 3$. Chứng minh rằng $\\frac{a}{1 + b^2} + \\frac{b}{1 + c^2} + \\frac{c}{1 + a^2} \\ge \\frac{3}{2}$.',
        hint: 'Dùng Cô-si ngược dấu $\\frac{a}{1 + b^2} = a - \\frac{ab^2}{1 + b^2} \\ge a - \\frac{ab^2}{2b} = a - \\frac{ab}{2}$, rồi cộng 3 bất đẳng thức.',
        rubricChecklist: [
          'Biến đổi $\\frac{a}{1 + b^2} = a - \\frac{ab^2}{1 + b^2} \\ge a - \\frac{ab^2}{2b} = a - \\frac{ab}{2}$.',
          'Cộng 3 biểu thức tương tự: $VT \\ge (a+b+c) - \\frac{1}{2}(ab + bc + ca)$.',
          'Dùng $ab + bc + ca \\le \\frac{(a+b+c)^2}{3} = 3$ để suy ra $VT \\ge 3 - \\frac{3}{2} = \\frac{3}{2}$ (dấu "=" tại $a=b=c=1$).'
        ],
        sampleAnswer:
          'Áp dụng kỹ thuật Cô-si ngược dấu: $\\frac{a}{1 + b^2} = a - \\frac{ab^2}{1 + b^2} \\ge a - \\frac{ab^2}{2b} = a - \\frac{ab}{2}$ (vì $1 + b^2 \\ge 2b$). Tương tự $\\frac{b}{1 + c^2} \\ge b - \\frac{bc}{2}$ và $\\frac{c}{1 + a^2} \\ge c - \\frac{ca}{2}$. Cộng ba bất đẳng thức theo vế: $VT \\ge (a + b + c) - \\frac{ab + bc + ca}{2}$. Mặt khác $ab + bc + ca \\le \\frac{(a + b + c)^2}{3} = \\frac{9}{3} = 3$, nên $VT \\ge 3 - \\frac{3}{2} = \\frac{3}{2}$. Dấu "=" xảy ra khi $a = b = c = 1$.'
      }
    }
  ],
  'math-pro-2': [
    {
      stepTitle: '1. Bất đẳng thức Bunyakovsky (Cauchy–Schwarz) 2 số & $n$ số',
      stepType: 'concept',
      conceptSection:
        'Bất đẳng thức Bunyakovsky (Cauchy–Schwarz) đúng cho **MỌI SỐ THỰC** (kể cả số âm, không đòi hỏi điều kiện không âm như Cô-si!). Nó là cầu nối trực tiếp giữa tổng bình phương $(a^2 + b^2)$ và tích vô hướng tuyến tính $(ax + by)^2$.',
      formulaSection: {
        primaryFormula: '(a_1^2 + a_2^2 + \\dots + a_n^2)(b_1^2 + b_2^2 + \\dots + b_n^2) \\ge (a_1b_1 + a_2b_2 + \\dots + a_nb_n)^2',
        secondaryFormulas: [
          '\\text{Dấu } "=" \\text{ xảy ra } \\iff \\frac{a_1}{b_1} = \\frac{a_2}{b_2} = \\dots = \\frac{a_n}{b_n} \\ (\\text{tỉ lệ đồng bộ})',
          '\\text{Hệ quả cực hay: } |ax + by| \\le \\sqrt{a^2 + b^2}\\sqrt{x^2 + y^2}'
        ],
        variablesNote:
          '• **Khi nào nghĩ đến Bunyakovsky?**: Thấy tổng các **căn bậc hai** ($\\sqrt{x} + \\sqrt{y}$), hoặc biết $x^2 + y^2 = k$ hỏi GTLN của $ax + by$ (hoặc ngược lại)!\n• Khi ghép bộ $(a_i, b_i)$ cho bài toán chứa căn (ví dụ $2\\sqrt{x-1} + 3\\sqrt{5-x}$), tách ngay cặp $(2; 3)$ và $(\\sqrt{x-1}; \\sqrt{5-x})$ để khi bình phương mất sạch căn và biến $x$!'
      },
      deepDiveSection:
        'Khác với Cô-si chỉ cho đánh giá tổng lớn hơn tích, Bunyakovsky tìm được **CẢ MAX LẪN MIN** của hàm $P = ax + by$ trên đường tròn $x^2 + y^2 = R^2$ hay Elip $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$: $-\\sqrt{a^2+b^2}R \\le ax + by \\le \\sqrt{a^2+b^2}R$.',
      teacherExplanation: 'Bunyakovsky không cần điều kiện dương và khử được căn bậc hai cực kỳ mượt mà!',
      keyTakeaway: '$(a^2+b^2)(x^2+y^2) \\ge (ax+by)^2$; dấu "=" khi $\\frac{a}{x} = \\frac{b}{y}$.',
      miniQuiz: [
        {
          id: 'mpro2-s1-q1',
          question: 'Cho $x, y \\in \\mathbb{R}$ thỏa mãn $x^2 + y^2 = 5$. Giá trị lớn nhất của biểu thức $P = 3x + 4y$ là:',
          options: ['A. $5\\sqrt{5}$', 'B. $25$', 'C. $5$', 'D. $7$'],
          correctIndex: 0,
          explanation: '$P^2 = (3x + 4y)^2 \\le (3^2 + 4^2)(x^2 + y^2) = 25 \\cdot 5 = 125 \\implies P \\le 5\\sqrt{5}$.'
        },
        {
          id: 'mpro2-s1-q2',
          question: 'Tìm giá trị lớn nhất của $M = \\sqrt{x - 1} + \\sqrt{3 - x}$ ($1 \\le x \\le 3$).',
          options: ['A. $2$', 'B. $\\sqrt{2}$', 'C. $4$', 'D. $2\\sqrt{2}$'],
          correctIndex: 0,
          explanation: '$M^2 = (1\\cdot\\sqrt{x-1} + 1\\cdot\\sqrt{3-x})^2 \\le (1^2 + 1^2)(x - 1 + 3 - x) = 2 \\cdot 2 = 4 \\implies M \\le 2$ (đạt khi $x = 2$).'
        }
      ],
      miniEssay: {
        id: 'mpro2-s1-e1',
        question: 'Cho $x, y > 0$ thỏa mãn $2x + 3y = 13$. Tìm giá trị nhỏ nhất của $S = x^2 + y^2$.',
        hint: 'Áp dụng Bunyakovsky: $(2^2 + 3^2)(x^2 + y^2) \\ge (2x + 3y)^2 = 169$.',
        rubricChecklist: [
          'Viết đúng BĐT Bunyakovsky $(2^2 + 3^2)(x^2 + y^2) \\ge (2x + 3y)^2$.',
          'Thay số được $13(x^2 + y^2) \\ge 169 \\implies x^2 + y^2 \\ge 13$.',
          'Chỉ ra dấu "=" khi $\\frac{x}{2} = \\frac{y}{3}$ và $2x + 3y = 13 \\iff x = 2, y = 3$.'
        ],
        sampleAnswer:
          'Áp dụng bất đẳng thức Bunyakovsky: $(2^2 + 3^2)(x^2 + y^2) \\ge (2x + 3y)^2 \\implies 13(x^2 + y^2) \\ge 13^2 = 169 \\implies x^2 + y^2 \\ge 13$. Dấu "=" xảy ra khi $\\frac{x}{2} = \\frac{y}{3}$ kết hợp $2x + 3y = 13 \\iff x = 2, y = 3$. Vậy $\\min S = 13$.'
      }
    },
    {
      stepTitle: '2. Kỹ thuật Cộng mẫu Engel (Cauchy–Schwarz dạng Phân thức)',
      stepType: 'derivation',
      conceptSection:
        'Dạng phân thức của Bunyakovsky — thường gọi là **BĐT Cộng mẫu (Engel / Titu\'s Lemma)** — là công cụ không thể thiếu khi tử số là bình phương và mẫu số là tổng các biểu thức dương.',
      formulaSection: {
        primaryFormula: '\\frac{a_1^2}{b_1} + \\frac{a_2^2}{b_2} + \\dots + \\frac{a_n^2}{b_n} \\ge \\frac{(a_1 + a_2 + \\dots + a_n)^2}{b_1 + b_2 + \\dots + b_n} \\quad (b_i > 0)',
        secondaryFormulas: [
          '\\text{Dấu } "=" \\text{ xảy ra } \\iff \\frac{a_1}{b_1} = \\frac{a_2}{b_2} = \\dots = \\frac{a_n}{b_n}',
          '\\text{Kỹ thuật nhân thêm tử \& mẫu: } \\frac{x}{y + z} = \\frac{x^2}{xy + xz} \\quad (x > 0)'
        ],
        variablesNote:
          '• **Điều kiện bắt buộc**: Các MẪU SỐ $b_1, b_2, \\dots, b_n$ phải **DƯƠNG NGHIÊM NGẶT** ($b_i > 0$), còn tử số $a_i$ có thể bất kỳ!\n• **Mẹo hay nhất**: Khi gặp $\\frac{a}{b+c} + \\frac{b}{c+a} + \\frac{c}{a+b}$ (tử bậc 1 chưa có bình phương!), nhân cả tử và mẫu với $a$ (được $\\frac{a^2}{ab+ac}$) rồi cộng mẫu ra ngay $\\frac{(a+b+c)^2}{2(ab+bc+ca)}$!'
      },
      deepDiveSection:
        'Khi điểm rơi không đối xứng hoặc tử số chưa khớp mẫu số sau khi cộng mẫu, hãy nhân tử số với một hệ số $\\lambda > 0$ thích hợp (dưới dạng $\\frac{(k a_i)^2}{k^2 b_i}$) hoặc dùng phân tích nhân tử trước khi áp dụng BĐT Engel.',
      teacherExplanation: 'Thấy tổng các phân thức có mẫu dương? Nhân tử và mẫu để tử thành bình phương rồi dùng ngay Cộng mẫu Engel!',
      keyTakeaway: '$\\sum \\frac{a_i^2}{b_i} \\ge \\frac{(\\sum a_i)^2}{\\sum b_i}$ ($b_i > 0$); tử chưa bình phương thì nhân thêm chính tử số.',
      miniQuiz: [
        {
          id: 'mpro2-s2-q1',
          question: 'Với $a, b, c > 0$, biểu thức $S = \\frac{a^2}{b+c} + \\frac{b^2}{c+a} + \\frac{c^2}{a+b}$ luôn lớn hơn hoặc bằng:',
          options: ['A. $\\frac{a + b + c}{2}$', 'B. $a + b + c$', 'C. $\\frac{3}{2}$', 'D. $\\frac{a + b + c}{3}$'],
          correctIndex: 0,
          explanation: 'Cộng mẫu Engel: $S \\ge \\frac{(a+b+c)^2}{(b+c)+(c+a)+(a+b)} = \\frac{(a+b+c)^2}{2(a+b+c)} = \\frac{a+b+c}{2}$.'
        },
        {
          id: 'mpro2-s2-q2',
          question: 'Cho $x, y > 0$ và $x + 2y = 5$. Giá trị nhỏ nhất của $P = \\frac{1}{x} + \\frac{8}{y}$ là:',
          options: ['A. $5$', 'B. $9$', 'C. $\\frac{9}{5}$', 'D. $4$'],
          correctIndex: 0,
          explanation: 'Viết $P = \\frac{1^2}{x} + \\frac{4^2}{2y} \\ge \\frac{(1 + 4)^2}{x + 2y} = \\frac{25}{5} = 5$, đạt tại $\\frac{1}{x} = \\frac{4}{2y} \\iff y = 2x \\implies x = 1, y = 2$.'
        }
      ],
      miniEssay: {
        id: 'mpro2-s2-e1',
        question: 'Chứng minh Bất đẳng thức Nesbitt: với mọi $a, b, c > 0$, ta có $\\frac{a}{b+c} + \\frac{b}{c+a} + \\frac{c}{a+b} \\ge \\frac{3}{2}$.',
        hint: 'Nhân tử và mẫu của từng phân thức với $a, b, c$ để biến tử thành $a^2, b^2, c^2$, rồi dùng Cộng mẫu Engel và $(a+b+c)^2 \\ge 3(ab+bc+ca)$.',
        rubricChecklist: [
          'Viết $VT = \\frac{a^2}{ab+ac} + \\frac{b^2}{bc+ba} + \\frac{c^2}{ca+cb}$.',
          'Áp dụng BĐT Engel được $VT \\ge \\frac{(a+b+c)^2}{2(ab+bc+ca)}$.',
          'Dùng $(a+b+c)^2 \\ge 3(ab+bc+ca)$ suy ra $VT \\ge \\frac{3}{2}$, chỉ ra dấu "=" tại $a = b = c$.'
        ],
        sampleAnswer:
          'Vì $a, b, c > 0$, ta viết $VT = \\frac{a^2}{ab + ac} + \\frac{b^2}{bc + ba} + \\frac{c^2}{ca + cb}$. Áp dụng BĐT Cộng mẫu Engel: $VT \\ge \\frac{(a + b + c)^2}{2(ab + bc + ca)}$. Mặt khác $(a + b + c)^2 \\ge 3(ab + bc + ca)$, suy ra $VT \\ge \\frac{3(ab + bc + ca)}{2(ab + bc + ca)} = \\frac{3}{2}$. Dấu "=" xảy ra khi $a = b = c$.'
      }
    },
    {
      stepTitle: '3. Chọn Hệ số Cân bằng & Đánh giá Kết hợp Cô-si + Bunyakovsky',
      stepType: 'example',
      conceptSection:
        'Những bài bất đẳng thức Chuyên khó đòi hỏi chọn hệ số phụ $(k, m)$ để cân bằng điểm rơi trước khi dùng Engel/Bunyakovsky, hoặc dùng Bunyakovsky để biến đổi điều kiện từ bậc nhất sang bậc hai rồi mới hạ xuống phân thức.',
      formulaSection: {
        primaryFormula: '\\frac{a^2}{x} + \\frac{b^2}{y} \\ge \\frac{(a+b)^2}{x+y}; \\qquad \\left(\\sum a_i^2\\right)\\left(\\sum b_i^2\\right) \\ge \\left(\\sum a_i b_i\\right)^2',
        secondaryFormulas: [
          '\\text{Hệ số cân bằng: nếu điểm rơi } x = 2y \\text{ thì ghép } \\frac{1}{x} + \\frac{4}{2y} \\text{ hoặc thêm } kx',
          '\\text{Kỹ thuật tách } \\sqrt{\\text{tích}} \\le \\text{tổng bậc 1 trước khi dùng Engel}'
        ],
        variablesNote:
          '• **Quy tắc ghép hệ số trong Engel**: Muốn $\\frac{A^2}{B}$ và $\\frac{C^2}{D}$ đạt dấu bằng cùng lúc tại điểm rơi $(x_0, y_0)$, kiểm tra tỷ số $\\frac{A}{B} = \\frac{C}{D}$ tại điểm rơi; nếu lệch hãy nhân tử và mẫu của phân thức thứ hai với hệ số bù $k$!'
      },
      deepDiveSection:
        'Trong nhiều bài toán có điều kiện $a^2 + b^2 + c^2 = 3$, đề hỏi tìm Min của $\\frac{1}{a+b} + \\frac{1}{b+c} + \\frac{1}{c+a}$: áp dụng Engel trực tiếp ra $\\frac{9}{2(a+b+c)}$, sau đó áp dụng Bunyakovsky cho $(a+b+c) \\le \\sqrt{3(a^2+b^2+c^2)} = 3$, nối hai bất đẳng thức cùng chiều cho ngay kết quả $\\frac{9}{6} = \\frac{3}{2}$!',
      teacherExplanation: 'Khi chuỗi đánh giá $P \\ge \\frac{9}{2(a+b+c)}$ vẫn còn vướng $(a+b+c)$ ở mẫu, nhớ chặn trên $(a+b+c) \\le \\sqrt{3(a^2+b^2+c^2)}$ bằng Bunyakovsky!',
      keyTakeaway: 'Phối hợp Engel (đánh giá phân thức về tổng) + Bunyakovsky (chặn tổng theo tổng bình phương) tạo chuỗi đánh giá khép kín.',
      miniQuiz: [
        {
          id: 'mpro2-s3-q1',
          question: 'Cho $a, b, c > 0$ và $a^2 + b^2 + c^2 = 3$. Giá trị nhỏ nhất của $P = \\frac{1}{a+b} + \\frac{1}{b+c} + \\frac{1}{c+a}$ bằng:',
          options: ['A. $\\frac{3}{2}$', 'B. $3$', 'C. $1$', 'D. $\\frac{9}{2}$'],
          correctIndex: 0,
          explanation: '$P \\ge \\frac{9}{2(a+b+c)}$. Theo Bunyakovsky: $a + b + c \\le \\sqrt{3(a^2+b^2+c^2)} = 3 \\implies P \\ge \\frac{9}{6} = \\frac{3}{2}$ (đạt khi $a=b=c=1$).'
        },
        {
          id: 'mpro2-s3-q2',
          question: 'Cho $a, b > 0$ thỏa $a + b = 1$. Giá trị nhỏ nhất của biểu thức $K = \\left(a + \\frac{1}{a}\\right)^2 + \\left(b + \\frac{1}{b}\\right)^2$ là:',
          options: ['A. $\\frac{25}{2}$', 'B. $\\frac{25}{4}$', 'C. $10$', 'D. $\\frac{17}{2}$'],
          correctIndex: 0,
          explanation: 'Dùng $x^2 + y^2 \\ge \\frac{(x+y)^2}{2}$: $K \\ge \\frac{1}{2}\\left(a + b + \\frac{1}{a} + \\frac{1}{b}\\right)^2 \\ge \\frac{1}{2}\\left(1 + \\frac{4}{a+b}\\right)^2 = \\frac{25}{2}$.'
        }
      ],
      miniEssay: {
        id: 'mpro2-s3-e1',
        question: 'Cho $a, b, c > 0$ thỏa mãn $a + b + c = 3$. Tìm giá trị nhỏ nhất của $M = \\frac{a^2}{a + 2b} + \\frac{b^2}{b + 2c} + \\frac{c^2}{c + 2a}$.',
        hint: 'Áp dụng thẳng Cộng mẫu Engel cho 3 phân thức, tử là $(a+b+c)^2$ và mẫu là $3(a+b+c)$.',
        rubricChecklist: [
          'Kiểm tra 3 mẫu số dương và áp dụng BĐT Cộng mẫu Engel.',
          'Tính mẫu chung $=(a+2b)+(b+2c)+(c+2a) = 3(a+b+c)$.',
          'Rút gọn $M \\ge \\frac{(a+b+c)^2}{3(a+b+c)} = \\frac{a+b+c}{3} = 1$, dấu "=" tại $a = b = c = 1$.'
        ],
        sampleAnswer:
          'Vì $a, b, c > 0$ nên các mẫu số đều dương. Áp dụng bất đẳng thức Cộng mẫu Engel: $M \\ge \\frac{(a + b + c)^2}{(a + 2b) + (b + 2c) + (c + 2a)} = \\frac{(a + b + c)^2}{3(a + b + c)} = \\frac{a + b + c}{3} = \\frac{3}{3} = 1$. Dấu "=" xảy ra khi $\\frac{a}{a+2b} = \\frac{b}{b+2c} = \\frac{c}{c+2a}$ và $a+b+c=3 \\iff a = b = c = 1$. Vậy $\\min M = 1$.'
      }
    }
  ],
  'math-pro-3': [
    {
      stepTitle: '1. Số học Đồng dư $a \\equiv b \\pmod m$ & Dư của Lũy thừa Lớn',
      stepType: 'concept',
      conceptSection:
        'Ký hiệu $a \\equiv b \\pmod m$ nghĩa là $a$ và $b$ có cùng số dư khi chia cho $m$ (tức $m \\mid (a - b)$). Phép đồng dư bảo toàn cộng, trừ, nhân và nâng lên lũy thừa nguyên dương, cực mạnh để xử lý bài toán chia hết và tìm chữ số tận cùng.',
      formulaSection: {
        primaryFormula: 'a \\equiv b \\pmod m \\implies a^n \\equiv b^n \\pmod m \\quad (\\forall n \\in \\mathbb{N}^*)',
        secondaryFormulas: [
          'a^2 \\equiv 0, 1 \\pmod 4; \\qquad a^2 \\equiv 0, 1 \\pmod 3',
          '\\text{Số chính phương } n^2 \\equiv 0, 1, 4 \\pmod 8'
        ],
        variablesNote:
          '• **Thay số âm vào đồng dư để hạ nhỏ cực nhanh**: Ví dụ $7 \\equiv -1 \\pmod 8 \\implies 7^{2025} \\equiv (-1)^{2025} = -1 \\equiv 7 \\pmod 8$!\n• **Cẩn thận phép CHIA**: Từ $ac \\equiv bc \\pmod m$ chỉ suy ra được $a \\equiv b \\pmod m$ khi $\\gcd(c, m) = 1$!'
      },
      deepDiveSection:
        'Các **số dư của bình phương ($n^2$)** theo modulo $3, 4, 5, 8$ là vũ khí số 1 để bác bỏ phương trình nghiệm nguyên hoặc chứng minh một số không phải số chính phương: ví dụ tổng hai số chính phương $x^2 + y^2$ chia $4$ chỉ có thể dư $0, 1, 2$ — KHÔNG BAO GIỜ dư $3$!',
      teacherExplanation: 'Luôn kiểm tra số dư của $x^2$ theo $\\pmod 3$, $\\pmod 4$ hoặc $\\pmod 8$ đầu tiên khi gặp bài toán số chính phương!',
      keyTakeaway: '$n^2 \\pmod 4 \\in \\{0, 1\\}$, $n^2 \\pmod 3 \\in \\{0, 1\\}$; chuyển về $\\pm 1 \\pmod m$ để tính lũy thừa lớn.',
      miniQuiz: [
        {
          id: 'mpro3-s1-q1',
          question: 'Số dư của $2^{100}$ khi chia cho $3$ là:',
          options: ['A. $1$', 'B. $2$', 'C. $0$', 'D. Không xác định'],
          correctIndex: 0,
          explanation: '$2 \\equiv -1 \\pmod 3 \\implies 2^{100} \\equiv (-1)^{100} = 1 \\pmod 3$.'
        },
        {
          id: 'mpro3-s1-q2',
          question: 'Một số nguyên dạng $4k + 3$ (chia $4$ dư $3$) có thể viết thành tổng của hai số chính phương $x^2 + y^2$ hay không?',
          options: [
            'A. Không bao giờ, vì $x^2 + y^2 \\pmod 4$ chỉ nhận giá trị $0, 1, 2$',
            'B. Có, ví dụ với $x, y$ đều lẻ',
            'C. Có vô số cách biểu diễn',
            'D. Chỉ đúng khi $k$ chẵn'
          ],
          correctIndex: 0,
          explanation: 'Vì $x^2 \\equiv 0, 1 \\pmod 4$ và $y^2 \\equiv 0, 1 \\pmod 4$, nên $x^2 + y^2 \\equiv 0, 1, 2 \\pmod 4$, không thể đồng dư $3$.'
        }
      ],
      miniEssay: {
        id: 'mpro3-s1-e1',
        question: 'Tìm $2$ chữ số tận cùng của số $7^{2024}$ (tức tìm số dư của $7^{2024}$ khi chia cho $100$).',
        hint: 'Tính $7^2 = 49$, $7^4 = 2401 \\equiv 1 \\pmod{100}$! Viết $2024 = 4 \\cdot 506$.',
        rubricChecklist: [
          'Tính $7^4 = 2401 \\equiv 1 \\pmod{100}$.',
          'Biến đổi $7^{2024} = (7^4)^{506} \\equiv 1^{506} = 1 \\pmod{100}$.',
          'Kết luận hai chữ số tận cùng là $01$.'
        ],
        sampleAnswer:
          'Ta có $7^2 = 49$ và $7^4 = 49^2 = 2401 \\equiv 1 \\pmod{100}$. Vì $2024 = 4 \\cdot 506$ nên $7^{2024} = (7^4)^{506} \\equiv 1^{506} = 1 \\pmod{100}$. Vậy hai chữ số tận cùng của $7^{2024}$ là $01$.'
      }
    },
    {
      stepTitle: '2. Định lý Fermat nhỏ & Định lý Euler / Wilson trong Số học HSG',
      stepType: 'derivation',
      conceptSection:
        'Khi số mũ cực lớn và cơ số nguyên tố cùng nhau với số chia nguyên tố $p$, **Định lý Fermat nhỏ** giúp thu gọn số mũ theo chu kỳ $(p - 1)$ chỉ trong một bước.',
      formulaSection: {
        primaryFormula: 'p \\text{ nguyên tố, } p \\nmid a \\implies a^{p-1} \\equiv 1 \\pmod p',
        secondaryFormulas: [
          'a^p \\equiv a \\pmod p \\quad (\\forall a \\in \\mathbb{Z})',
          '\\text{Hệ quả cực mạnh: } p = 4k+3,\\ p \\mid (a^2 + b^2) \\implies p \\mid a \\text{ và } p \\mid b'
        ],
        variablesNote:
          '• **Cẩn thận điều kiện $p \\nmid a$**: Nếu $a$ chia hết cho $p$ thì $a^{p-1} \\equiv 0 \\pmod p$ (chứ không phải $1$!), còn dạng $a^p \\equiv a \\pmod p$ đúng với MỌI số nguyên $a$.\n• **Hệ quả $p = 4k + 3$**: Là công cụ vàng để giải phương trình nghiệm nguyên hoặc chứng minh không có nghiệm nguyên bằng phép lùi vô hạn!'
      },
      deepDiveSection:
        'Định lý Wilson bổ trợ thêm dấu hiệu số nguyên tố: $p$ nguyên tố $\\iff (p - 1)! \\equiv -1 \\pmod p$. Còn khi số chia $m$ là hợp số (ví dụ $m = 15 = 3 \\cdot 5$), tách riêng $\\pmod 3$ và $\\pmod 5$ bằng Fermat nhỏ rồi ghép lại bằng định lý Thặng dư Trung Hoa.',
      teacherExplanation: 'Nhớ chu kỳ $p - 1$ của Fermat nhỏ khi số chia $p$ là số nguyên tố; và kiểm tra $p \\nmid a$ trước khi thay $a^{p-1} \\equiv 1$!',
      keyTakeaway: 'Với $p$ nguyên tố không chia hết $a$: $a^{p-1} \\equiv 1 \\pmod p$; chia số mũ cho $p-1$ để hạ bậc.',
      miniQuiz: [
        {
          id: 'mpro3-s2-q1',
          question: 'Số dư của $3^{2025}$ khi chia cho $7$ là:',
          options: ['A. $6$', 'B. $1$', 'C. $3$', 'D. $2$'],
          correctIndex: 0,
          explanation: 'Theo Fermat nhỏ ($p=7$), $3^6 \\equiv 1 \\pmod 7$. Lại có $2025 = 6 \\cdot 337 + 3 \\implies 3^{2025} \\equiv 3^3 = 27 \\equiv 6 \\pmod 7$.'
        },
        {
          id: 'mpro3-s2-q2',
          question: 'Cho $p$ là số nguyên tố dạng $4k + 3$ và $p \\mid (a^2 + b^2)$. Kết luận nào chắc chắn đúng?',
          options: ['A. $p \\mid a$ và $p \\mid b$', 'B. $p \\mid (a + b)$ nhưng chưa chắc chia hết $a$', 'C. $a \\equiv b \\pmod p$', 'D. $a = b = 0$'],
          correctIndex: 0,
          explanation: 'Giả sử $p \\nmid a, p \\nmid b$: từ $a^2 \\equiv -b^2 \\pmod p$, lũy thừa mũ $2k+1 = (p-1)/2$ hai vế cho $a^{p-1} \\equiv -b^{p-1} \\implies 1 \\equiv -1 \\pmod p$ (vô lý với $p \\ge 3$). Vậy $p \\mid a$ và $p \\mid b$.'
        }
      ],
      miniEssay: {
        id: 'mpro3-s2-e1',
        question: 'Chứng minh rằng với mọi số nguyên dương $n$, biểu thức $A = n^7 - n$ luôn chia hết cho $42$.',
        hint: 'Phân tích $42 = 2 \\cdot 3 \\cdot 7$ (đôi một nguyên tố cùng nhau) rồi chứng minh $A$ chia hết cho $2, 3, 7$ bằng Fermat nhỏ hoặc xét tích các số liên tiếp.',
        rubricChecklist: [
          'Phân tích $42 = 2 \\cdot 3 \\cdot 7$ đôi một nguyên tố cùng nhau.',
          'Chứng minh $7 \\mid (n^7 - n)$ theo định lý Fermat nhỏ; $2 \\mid n(n^6 - 1)$ (cùng tính chẵn lẻ).',
          'Chứng minh $3 \\mid n(n^6 - 1) = n(n^2-1)(n^4+n^2+1)$ vì $n(n-1)(n+1) \\mid A$. Kết luận $42 \\mid A$.'
        ],
        sampleAnswer:
          'Ta có $42 = 2 \\cdot 3 \\cdot 7$ với $2, 3, 7$ đôi một nguyên tố cùng nhau. Theo định lý Fermat nhỏ với $p = 7$: $n^7 \\equiv n \\pmod 7 \\implies 7 \\mid (n^7 - n)$. Mặt khác $n^7 - n = n(n^6 - 1) = n(n^2 - 1)(n^4 + n^2 + 1) = (n - 1)n(n + 1)(n^4 + n^2 + 1)$. Vì $(n-1)n(n+1)$ là tích $3$ số nguyên liên tiếp nên chia hết cho $2$ và $3$, suy ra $6 \\mid (n^7 - n)$. Vậy $42 \\mid (n^7 - n)$.'
      }
    },
    {
      stepTitle: '3. Phương trình Nghiệm nguyên (Ước số, Chặn kẹp $\\Delta$ & Lùi vô hạn)',
      stepType: 'example',
      conceptSection:
        'Giải phương trình nghiệm nguyên ($x, y \\in \\mathbb{Z}$) là chuyên đề trọng tâm của các kỳ thi vào lớp 10 Chuyên và HSG Quốc gia. Ba kỹ thuật xử lý hiệu quả nhất là **Đưa về phương trình ước số**, **Đưa về bậc hai kẹp $\\Delta \\ge 0$ / $\\Delta$ chính phương**, và **Lùi vô hạn**.',
      formulaSection: {
        primaryFormula: '(ax + b)(cy + d) = k \\implies \\text{Liệt kê các ước nguyên của } k',
        secondaryFormulas: [
          'ax^2 + bx + c = 0 \\ (x \\in \\mathbb{Z}) \\implies \\Delta = k^2 \\ (\\text{số chính phương})',
          '\\text{Phương pháp kẹp giữa hai chính phương liên tiếp: } n^2 < A < (n+1)^2 \\implies \\text{vô nghiệm}'
        ],
        variablesNote:
          '• **Mẹo tạo phương trình ước số**: Với $xy + ax + by = c$, cộng $ab$ vào hai vế để phân tích ngay thành $(x + b)(y + a) = c + ab$!\n• **Phương pháp kẹp**: Nếu biểu thức nằm kẹp chặt giữa $n^2$ và $(n+2)^2$ thì chỉ có thể bằng $(n+1)^2$, từ đó giải ra thẳng nghiệm không cần thử nhiều.'
      },
      deepDiveSection:
        'Khi phương trình có dạng $x^2 + y^2 = 3z^2$: dùng modulo $3$ để suy ra $3 \\mid x$ và $3 \\mid y$, đặt $x = 3x_1, y = 3y_1$ rồi thay lại được $3(x_1^2 + y_1^2) = z^2 \\implies 3 \\mid z$. Quá trình chia $3$ lặp vô hạn chỉ dừng được khi $x = y = z = 0$ (Phương pháp Lùi vô hạn Fermat)!',
      teacherExplanation: 'Khi gặp $xy + ax + by = c$, nhớ thêm $ab$ vào cả hai vế để đóng ngoặc thành tích $(x+b)(y+a)$!',
      keyTakeaway: 'Ước số $(x+b)(y+a) = m$, kẹp $\\Delta = k^2$ giữa hai chính phương liên tiếp, và Lùi vô hạn là 3 chìa khóa nghiệm nguyên.',
      miniQuiz: [
        {
          id: 'mpro3-s3-q1',
          question: 'Số cặp nghiệm nguyên dương $(x; y)$ của phương trình $xy - 2x - 3y = 1$ là:',
          options: ['A. $4$ cặp', 'B. $2$ cặp', 'C. $8$ cặp', 'D. $1$ cặp'],
          correctIndex: 1,
          explanation: 'Cộng $6$ hai vế: $(x - 3)(y - 2) = 7$. Vì $x, y \\ge 1$ nên $x - 3 \\ge -2$ và $y - 2 \\ge -1$. Các cặp ước nguyên của $7$ thỏa mãn là $(1; 7)$ và $(7; 1)$, cho $2$ cặp nghiệm $(4; 9)$ và $(10; 3)$ (cặp âm $(-1; -7)$ bị loại).'
        },
        {
          id: 'mpro3-s3-q2',
          question: 'Phương trình $x^2 + x + 1 = y^2$ có bao nhiêu nghiệm nguyên $(x; y)$?',
          options: ['A. $4$ cặp: $(0; \\pm 1)$ và $(-1; \\pm 1)$', 'B. Vô nghiệm', 'C. $2$ cặp: $(0; 1)$ và $(-1; 1)$', 'D. Vô số nghiệm'],
          correctIndex: 0,
          explanation: 'Nhân $4$: $(2x + 1)^2 + 3 = (2y)^2 \\iff (2y - 2x - 1)(2y + 2x + 1) = 3$. Giải $4$ trường hợp ước của $3$ cho $x \\in \\{0; -1\\}$ và $y = \\pm 1$ (4 cặp).'
        }
      ],
      miniEssay: {
        id: 'mpro3-s3-e1',
        question: 'Tìm tất cả các cặp số nguyên $(x; y)$ thỏa mãn $x^2 + 2xy - 3y^2 = 5$.',
        hint: 'Phân tích vế trái thành nhân tử $(x - y)(x + 3y) = 5$, chú ý $x + 3y$ và $x - y$ cùng tính chẵn lẻ và $(x + 3y) - (x - y) = 4y$ chia hết cho $4$.',
        rubricChecklist: [
          'Phân tích thành $(x - y)(x + 3y) = 5$.',
          'Liệt kê 4 cặp ước của $5$: $(1, 5), (5, 1), (-1, -5), (-5, -1)$.',
          'Giải và nhận đủ 4 cặp nghiệm: $(2; 1), (4; -1), (-2; -1), (-4; 1)$.'
        ],
        sampleAnswer:
          'Phương trình $\\iff (x - y)(x + 3y) = 5$. Vì $x, y \\in \\mathbb{Z}$ nên $(x - y, x + 3y)$ thuộc tập ước $\\{(1; 5), (5; 1), (-1; -5), (-5; -1)\\}$. Giải từng hệ (lấy hiệu chia $4$ ra $y$ nguyên): cặp $(1; 5) \\implies y = 1, x = 2$; cặp $(5; 1) \\implies y = -1, x = 4$; cặp $(-1; -5) \\implies y = -1, x = -2$; cặp $(-5; -1) \\implies y = 1, x = -4$. Vậy có $4$ cặp nghiệm nguyên.'
      }
    }
  ],
  'math-pro-4': [
    {
      stepTitle: '1. Phương tích của Một điểm & Trục Đẳng phương Hai Đường tròn',
      stepType: 'concept',
      conceptSection:
        'Phương tích của điểm $M$ đối với đường tròn $(O; R)$ là đại lượng đại số $\\mathcal{P}_{M/(O)} = MO^2 - R^2$. Khi kẻ cát tuyến bất kỳ qua $M$ cắt $(O)$ tại $A, B$, tích có hướng $\\overline{MA}\\cdot\\overline{MB}$ luôn không đổi và đúng bằng $MO^2 - R^2$!',
      formulaSection: {
        primaryFormula: '\\mathcal{P}_{M/(O)} = MO^2 - R^2 = \\overline{MA}\\cdot\\overline{MB} = MT^2 \\ (\\text{với tiếp tuyến } MT)',
        secondaryFormulas: [
          '\\text{Trục đẳng phương } \\Delta \\text{ của } (O_1), (O_2): \\ \\mathcal{P}_{M/(O_1)} = \\mathcal{P}_{M/(O_2)} \\iff MO_1^2 - R_1^2 = MO_2^2 - R_2^2',
          '\\text{Ba đường tròn không đồng trục: } 3 \\text{ trục đẳng phương đồng quy tại Tâm đẳng phương (hoặc } \\parallel \\text{)}'
        ],
        variablesNote:
          '• **Cách tìm nhanh trục đẳng phương**:\n  - Nếu hai đường tròn cắt nhau tại $A, B$: trục đẳng phương chính là **đường thẳng $AB$**!\n  - Nếu hai đường tròn tiếp xúc nhau tại $T$: trục đẳng phương là **tiếp tuyến chung tại $T$**!\n• Tính chất: trục đẳng phương luôn **vuông góc với đường nối tâm $O_1O_2$**.'
      },
      deepDiveSection:
        'Công cụ **Tâm đẳng phương** chứng minh 3 đường thẳng đồng quy chỉ trong 4 dòng: chỉ ra 3 đường thẳng đó chính là 3 trục đẳng phương của 3 đường tròn thích hợp (ví dụ 2 đường tròn cho trước và 1 đường tròn thứ ba đi qua 4 đỉnh của tứ giác nội tiếp)!',
      teacherExplanation: 'Thấy $MA\\cdot MB = MC\\cdot MD$, nghĩ ngay tới 4 điểm $A, B, C, D$ đồng viên và đường nối giao điểm là trục đẳng phương!',
      keyTakeaway: 'Trục đẳng phương vuông góc đường nối tâm $O_1O_2$; 3 trục đẳng phương của 3 đường tròn đồng quy tại Tâm đẳng phương.',
      miniQuiz: [
        {
          id: 'mpro4-s1-q1',
          question: 'Cho đường tròn $(O; 5)$ và điểm $M$ có $OM = 3$. Giá trị phương tích $\\mathcal{P}_{M/(O)}$ bằng:',
          options: ['A. $-16$', 'B. $16$', 'C. $-4$', 'D. $4$'],
          correctIndex: 0,
          explanation: '$\\mathcal{P}_{M/(O)} = OM^2 - R^2 = 3^2 - 5^2 = -16$ (âm vì $M$ nằm bên trong đường tròn).'
        },
        {
          id: 'mpro4-s1-q2',
          question: 'Hai đường tròn $(O_1)$ và $(O_2)$ cắt nhau tại $A, B$. Nếu một điểm $M$ nằm trên đường thẳng $AB$ (bên ngoài đoạn $AB$) kẻ được hai tiếp tuyến $MT_1$ tới $(O_1)$ và $MT_2$ tới $(O_2)$, khẳng định nào ĐÚNG?',
          options: ['A. $MT_1 = MT_2$', 'B. $MT_1 > MT_2$', 'C. $MT_1 < MT_2$', 'D. $MO_1 = MO_2$'],
          correctIndex: 0,
          explanation: '$AB$ là trục đẳng phương của $(O_1)$ và $(O_2)$, nên với mọi $M \\in AB$ ngoài $(O_1), (O_2)$ ta có $MT_1^2 = \\mathcal{P}_{M/(O_1)} = \\mathcal{P}_{M/(O_2)} = MT_2^2 \\implies MT_1 = MT_2$.'
        }
      ],
      miniEssay: {
        id: 'mpro4-s1-e1',
        question: 'Cho $\\triangle ABC$ nhọn với hai đường cao $BE, CF$ cắt nhau tại $H$. Gọi $M$ là trung điểm $BC$. Đường tròn ngoại tiếp $\\triangle AEF$ cắt $(O)$ ngoại tiếp $\\triangle ABC$ tại điểm thứ hai $K$ ($K \\neq A$). Chứng minh $AK, EF, BC$ đồng quy.',
        hint: 'Chỉ ra $AK, EF, BC$ là 3 trục đẳng phương của 3 đường tròn: $(O)$ ngoại tiếp $ABC$, $(AEHF)$, và đường tròn đường kính $BC$ ($BFEC$ nội tiếp)!',
        rubricChecklist: [
          'Chỉ ra 3 đường tròn: $(O)$ ngoại tiếp $ABC$, $(I)$ ngoại tiếp $AEHF$, và $(M)$ đường kính $BC$ (chứa $B, F, E, C$).',
          'Xác định 3 trục đẳng phương từng đôi: $(O) \\cap (I) = AK$; $(I) \\cap (M) = EF$; $(O) \\cap (M) = BC$.',
          'Áp dụng định lý Tâm đẳng phương (vì $EF$ cắt $BC$) kết luận $AK, EF, BC$ đồng quy.'
        ],
        sampleAnswer:
          'Xét ba đường tròn: $(O)$ ngoại tiếp $\\triangle ABC$, $(I)$ ngoại tiếp tứ giác nội tiếp $AEHF$ (cũng là đường tròn ngoại tiếp $\\triangle AEF$), và $(M)$ đường kính $BC$ (ngoại tiếp tứ giác $BFEC$). Trục đẳng phương của $(O)$ và $(I)$ là $AK$; của $(I)$ và $(M)$ là $EF$; của $(O)$ và $(M)$ là $BC$. Do $EF$ không song song $BC$ (tam giác nhọn không cân, nếu $AB = AC$ thì $EF \\parallel BC$ suy biến), hai trục đẳng phương cắt nhau, suy ra cả ba trục đẳng phương $AK, EF, BC$ đồng quy tại tâm đẳng phương của 3 đường tròn.'
      }
    },
    {
      stepTitle: '2. Hàng điểm Điều hòa $(A, B; C, D) = -1$ & Chùm Điều hòa',
      stepType: 'derivation',
      conceptSection:
        'Bốn điểm thẳng hàng $A, B, C, D$ lập thành một **hàng điểm điều hòa** ký hiệu $(A, B; C, D) = -1$ khi tỷ số kép $\\frac{\\overline{CA}}{\\overline{CB}} = -\\frac{\\overline{DA}}{\\overline{DB}}$ (tức $C$ chia trong và $D$ chia ngoài đoạn $AB$ theo cùng một tỷ số).',
      formulaSection: {
        primaryFormula: '\\frac{CA}{CB} = \\frac{DA}{DB} \\iff \\frac{2}{\\overline{AB}} = \\frac{1}{\\overline{AC}} + \\frac{1}{\\overline{AD}} \\quad (\\text{Hệ thức Descartes})',
        secondaryFormulas: [
          'IA^2 = IB^2 = \\overline{IC}\\cdot\\overline{ID} \\quad (\\text{Hệ thức Newton, với } I \\text{ là trung điểm } AB)',
          '\\text{Cấu hình Tiếp tuyến – Cát tuyến}: \\ MA, MB \\text{ tiếp tuyến } (O),\\ MCD \\text{ cát tuyến},\\ AB \\cap CD = K \\implies (C, D; K, M) = -1'
        ],
        variablesNote:
          '• **Cấu hình kinh điển ra hàng điểm điều hòa trong 1 giây**:\n  1) **Phân giác trong & phân giác ngoài** cùng một góc cắt cạnh đối diện $\\implies$ hàng điểm điều hòa!\n  2) **Cực – Đối cực**: từ $M$ kẻ 2 tiếp tuyến $MA, MB$ và cát tuyến $MCD$ cắt dây $AB$ tại $K$ $\\implies (C, D; K, M) = -1$!\n  3) **Tứ giác toàn phần**: giao điểm các đường chéo chia điều hòa cạnh!'
      },
      deepDiveSection:
        'Tính chất cực kỳ lợi hại của **Chùm điều hòa $O(A, B; C, D) = -1$**: chỉ cần một đường thẳng bất kỳ cắt 4 tia tại 4 điểm thì 4 điểm mới cũng điều hòa; đặc biệt nếu có **hai tia vuông góc** ($OC \\perp OD$) thì $OC$ và $OD$ chính là hai tia phân giác trong và ngoài của $\\widehat{AOB}$!',
      teacherExplanation: 'Hễ thấy chùm điều hòa có 1 cặp tia vuông góc nhau, khẳng định ngay đó là phân giác trong và phân giác ngoài!',
      keyTakeaway: 'Cấu hình tiếp tuyến $MA, MB$ + cát tuyến $MCD$ cắt $AB$ tại $K$ luôn cho $(C, D; K, M) = -1$.',
      miniQuiz: [
        {
          id: 'mpro4-s2-q1',
          question: 'Cho $4$ điểm $A, B, C, D$ thẳng hàng thỏa mãn $(A, B; C, D) = -1$, biết $I$ là trung điểm $AB$. Hệ thức Newton đúng là:',
          options: [
            'A. $IA^2 = \\overline{IC} \\cdot \\overline{ID}$',
            'B. $IA^2 = \\overline{CA} \\cdot \\overline{CB}$',
            'C. $\\frac{1}{IA} = \\frac{1}{IC} + \\frac{1}{ID}$',
            'D. $IC \\cdot ID = AB^2$'
          ],
          correctIndex: 0,
          explanation: 'Hệ thức Newton cho trung điểm $I$ của $AB$ là $IA^2 = IB^2 = \\overline{IC} \\cdot \\overline{ID}$.'
        },
        {
          id: 'mpro4-s2-q2',
          question: 'Trong $\\triangle ABC$, $AD$ và $AE$ lần lượt là đường phân giác trong và phân giác ngoài của góc $A$ ($D, E \\in BC$). Bốn điểm nào lập thành hàng điểm điều hòa?',
          options: ['A. $(B, C; D, E) = -1$', 'B. $(B, D; C, E) = -1$', 'C. $(A, B; D, E) = -1$', 'D. $(D, E; B, A) = -1$'],
          correctIndex: 0,
          explanation: 'Theo tính chất phân giác $\\frac{DB}{DC} = \\frac{AB}{AC} = \\frac{EB}{EC}$ (chia trong, chia ngoài), nên $(B, C; D, E) = -1$.'
        }
      ],
      miniEssay: {
        id: 'mpro4-s2-e1',
        question: 'Cho đường tròn $(O)$ và điểm $M$ nằm ngoài $(O)$, kẻ hai tiếp tuyến $MA, MB$ và cát tuyến $MCD$ ($C$ giữa $M, D$). Gọi $K = CD \\cap AB$. Chứng minh $(C, D; K, M) = -1$ bằng hệ thức lượng kết hợp Newton.',
        hint: 'Gọi $I$ là trung điểm $CD \\implies OI \\perp CD$. Dùng $MA^2 = MH\\cdot MO = MC\\cdot MD$ hoặc phép chiếu lên $MO$ để suy ra $MK \\cdot MI = MC \\cdot MD$, từ đó dùng Newton đảo!',
        rubricChecklist: [
          'Gọi $I$ là trung điểm $CD \\implies OI \\perp CD$ và $H = AB \\cap MO \\implies OH \\perp AB$.',
          'Chứng minh tứ giác $OHKI$ nội tiếp $\\implies MK \\cdot MI = MH \\cdot MO = MA^2 = MC \\cdot MD$.',
          'Biến đổi $MC\\cdot MD = (MI - IC)(MI + IC) = MI^2 - IC^2 \\implies IC^2 = MI(MI - MK) = \\overline{IM}\\cdot\\overline{IK}$, theo Newton suy ra $(C, D; K, M) = -1$.'
        ],
        sampleAnswer:
          'Gọi $H = AB \\cap MO$ ($MH \\perp AB$) và $I$ là trung điểm $CD$ ($OI \\perp CD$). Tứ giác $OHKI$ có $\\widehat{OHK} = \\widehat{OIK} = 90^\\circ$ nên nội tiếp, suy ra $\\triangle MHK \\sim \\triangle MIO \\implies MK \\cdot MI = MH \\cdot MO$. Lại có $MH \\cdot MO = MA^2 = MC \\cdot MD$. Mặt khác $MC \\cdot MD = (MI - IC)(MI + IC) = MI^2 - IC^2$. Suy ra $IC^2 = MI^2 - MI\\cdot MK = MI(MI - MK) = \\overline{IM}\\cdot\\overline{IK}$. Theo hệ thức Newton đảo, $(C, D; K, M) = -1$.'
      }
    },
    {
      stepTitle: '3. Đường tròn Mixtilinear / Tứ giác Điều hòa & Kỹ thuật Bổ đề Hình học Phẳng',
      stepType: 'example',
      conceptSection:
        'Trên đường tròn $(O)$, một **tứ giác điều hòa $ACBD$** là tứ giác nội tiếp thỏa mãn tích các cặp cạnh đối bằng nhau ($AC \\cdot BD = AD \\cdot BC$). Tiếp tuyến tại $A$ và $B$ luôn cắt nhau tại một điểm $M$ nằm trên đường thẳng $CD$!',
      formulaSection: {
        primaryFormula: 'ACBD \\text{ điều hòa } \\iff AC \\cdot BD = AD \\cdot BC \\iff CD \\text{ đi qua } M = t_A \\cap t_B',
        secondaryFormulas: [
          '\\text{Định lý Ptoleme cho tứ giác nội tiếp: } AC \\cdot BD = AB \\cdot CD + AD \\cdot BC \\ (\\text{thứ tự } ABCD)',
          '\\text{Định lý Simson / Đường thẳng Steiner với điểm } M \\in (O)'
        ],
        variablesNote:
          '• **Dấu hiệu nhận biết tứ giác điều hòa cực nhanh**: Khi bạn có 1 cát tuyến $MCD$ và 2 tiếp tuyến $MA, MB$ của $(O)$, thì tứ giác $ACBD$ (với $C, D$ xen kẽ $A, B$) **CHẮC CHẮN** là tứ giác điều hòa!\n• Khi đó, đường đối trung (symmedian) $CM$ trong $\\triangle CAB$ đi qua giao điểm hai tiếp tuyến $M$, tức $\\widehat{ACM} = \\widehat{BCD}$!'
      },
      deepDiveSection:
        'Bổ đề đường đối trung: trong tam giác $ABC$ nội tiếp $(O)$, tiếp tuyến tại $B$ và $C$ cắt nhau tại $T$, khi đó $AT$ gọi là **đường đối trung** (đối xứng với trung tuyến $AM$ qua phân giác trong góc $A$). Đây là cây cầu nối trực tiếp giữa trung điểm $M$ của $BC$ và điểm cực $T$!',
      teacherExplanation: 'Thấy giao điểm 2 tiếp tuyến tại $B, C$ của $(O)$ nối lên $A$: nhớ ngay đó là **đường đối trung** đối xứng với trung tuyến qua phân giác góc $A$!',
      keyTakeaway: 'Tứ giác $ACBD$ nội tiếp có $CD$ đi qua giao hai tiếp tuyến tại $A, B$ là tứ giác điều hòa ($AC\\cdot BD = AD\\cdot BC$).',
      miniQuiz: [
        {
          id: 'mpro4-s3-q1',
          question: 'Cho tứ giác $ACBD$ là tứ giác điều hòa nội tiếp $(O)$ (hai cặp đỉnh đối là $(A, B)$ và $(C, D)$). Biết $AC = 3, BC = 4, AD = 6$. Độ dài cạnh $BD$ bằng:',
          options: ['A. $8$', 'B. $4{,}5$', 'C. $2$', 'D. $6$'],
          correctIndex: 0,
          explanation: '$AC \\cdot BD = AD \\cdot BC \\implies 3 \\cdot BD = 6 \\cdot 4 = 24 \\implies BD = 8$.'
        },
        {
          id: 'mpro4-s3-q2',
          question: 'Cho $\\triangle ABC$ nội tiếp $(O)$. Hai tiếp tuyến tại $B$ và $C$ của $(O)$ cắt nhau tại $T$. Đường thẳng $AT$ cắt $(O)$ tại $D$ ($D \\neq A$). Khi đó $ABDC$ là:',
          options: [
            'A. Tứ giác điều hòa ($AB\\cdot CD = AC\\cdot BD$)',
            'B. Hình thang cân',
            'C. Hình chữ nhật',
            'D. Tứ giác có hai đường chéo vuông góc'
          ],
          correctIndex: 0,
          explanation: 'Vì cát tuyến $TAD$ đi qua giao điểm 2 tiếp tuyến $TB, TC$ nên $ABDC$ là tứ giác điều hòa!'
        }
      ],
      miniEssay: {
        id: 'mpro4-s3-e1',
        question: 'Cho $\\triangle ABC$ nội tiếp $(O)$, các tiếp tuyến tại $B$ và $C$ cắt nhau tại $T$, tia $AT$ cắt $(O)$ tại $D$ ($D \\neq A$). Chứng minh $AB \\cdot CD = AC \\cdot BD$.',
        hint: 'Chứng minh $\\triangle TAB \\sim \\triangle TBD$ và $\\triangle TAC \\sim \\triangle TCD$ (tính chất tiếp tuyến-cát tuyến), rồi lập tỷ số kết hợp $TB = TC$.',
        rubricChecklist: [
          'Chứng minh $\\triangle TAB \\sim \\triangle TBD \\implies \\frac{AB}{BD} = \\frac{TB}{TD}$.',
          'Chứng minh $\\triangle TAC \\sim \\triangle TCD \\implies \\frac{AC}{CD} = \\frac{TC}{TD}$.',
          'Dùng $TB = TC$ suy ra $\\frac{AB}{BD} = \\frac{AC}{CD} \\iff AB \\cdot CD = AC \\cdot BD$.'
        ],
        sampleAnswer:
          'Xét $\\triangle TAB$ và $\\triangle TBD$ có $\\widehat{ATB}$ chung và $\\widehat{TAB} = \\widehat{TBD}$ (cùng chắn cung $BD$), suy ra $\\triangle TAB \\sim \\triangle TBD$ (g.g) $\\implies \\frac{AB}{BD} = \\frac{TB}{TD}$. Tương tự $\\triangle TAC \\sim \\triangle TCD$ (g.g) $\\implies \\frac{AC}{CD} = \\frac{TC}{TD}$. Vì $TB = TC$ (tính chất hai tiếp tuyến cắt nhau) nên $\\frac{AB}{BD} = \\frac{AC}{CD} \\iff AB \\cdot CD = AC \\cdot BD$.'
      }
    }
  ],
  'math-pro-5': [
    {
      stepTitle: '1. Nguyên lý Dirichlet (Chuồng Bồ câu) & Áp dụng Số học – Hình học',
      stepType: 'concept',
      conceptSection:
        'Nguyên lý Dirichlet phát biểu cực kỳ giản dị: nếu nhốt $kn + 1$ chú thỏ vào $n$ chiếc chuồng thì chắc chắn có ít nhất **1 chuồng chứa từ $k + 1$ chú thỏ trở lên**. Nghệ thuật của bài toán HSG nằm ở việc tự thiết kế ra **"chuồng"** (số dư, tổng hai số, hình vuông con, cạnh kề) và **"thỏ"** sao cho khớp nhau.',
      formulaSection: {
        primaryFormula: '\\left\\lceil \\frac{N}{n} \\right\\rceil \\text{ thỏ trong cùng 1 chuồng nếu nhốt } N \\text{ thỏ vào } n \\text{ chuồng}',
        secondaryFormulas: [
          '\\text{Số học}: \\text{Số chuồng theo số dư } \\pmod m \\text{ là } m \\text{ (hoặc ghép cặp } \\{r, m-r\\})',
          '\\text{Hình học}: \\text{Chia hình lớn diện tích } S \\text{ thành } n \\text{ hình nhỏ diện tích } S/n'
        ],
        variablesNote:
          '• **Mẫu thiết kế chuồng hay gặp**:\n  1) Chọn $(n + 1)$ số nguyên bất kỳ $\\implies$ luôn có $2$ số có hiệu chia hết cho $n$ (vì chỉ có $n$ số dư $0..n-1$).\n  2) Chọn $5$ điểm trong hình vuông cạnh $a$ $\\implies$ chia thành $4$ hình vuông cạnh $a/2$, có $2$ điểm cùng nằm trong 1 ô nhỏ nên khoảng cách $\\le \\frac{a\\sqrt{2}}{2}$.'
      },
      deepDiveSection:
        'Một biến thể đỉnh cao là **Dirichlet theo phần lẻ và tổng ghép cặp**: ví dụ chọn $52$ số tự nhiên bất kỳ, luôn có $2$ số có tổng hoặc hiệu chia hết cho $100$. Tại sao lại $52$ mà không phải $101$? Vì $51$ nhóm chuồng gồm $\\{0\\}, \\{50\\}$ và $49$ cặp $\\{1, 99\\}, \\dots, \\{49, 51\\}$ ($1 + 1 + 49 = 51$ chuồng)! Chọn $52$ số tất yếu rơi vào cùng 1 chuồng $\\implies$ bằng nhau (hiệu $\\vdots 100$) hoặc bù nhau (tổng $\\vdots 100$)!',
      teacherExplanation: 'Khi bài toán xuất hiện cụm từ "luôn tồn tại ít nhất...", hãy đếm số đối tượng để chia nhóm tạo chuồng Dirichlet!',
      keyTakeaway: 'Tạo $k$ chuồng ít hơn số thỏ $N$; hay dùng chia nhóm số dư $\\pmod m$ hoặc phân hoạch hình phẳng.',
      miniQuiz: [
        {
          id: 'mpro5-s1-q1',
          question: 'Chọn ngẫu nhiên $13$ số nguyên bất kỳ. Chắc chắn tồn tại ít nhất $2$ số có hiệu chia hết cho số nào sau đây?',
          options: ['A. $12$', 'B. $13$', 'C. $24$', 'D. $14$'],
          correctIndex: 0,
          explanation: 'Khi chia cho $12$ chỉ có $12$ số dư từ $0$ đến $11$. Với $13$ số chắc chắn có $2$ số cùng số dư khi chia cho $12$, nên hiệu chúng chia hết cho $12$.'
        },
        {
          id: 'mpro5-s1-q2',
          question: 'Lấy $9$ điểm phân biệt bất kỳ bên trong (kể cả biên) một hình vuông cạnh $2$. Khoảng cách giữa $2$ điểm gần nhau nhất luôn không vượt quá:',
          options: ['A. $\\sqrt{2}$', 'B. $1$', 'C. $\\frac{\\sqrt{2}}{2}$', 'D. $2$'],
          correctIndex: 0,
          explanation: 'Chia hình vuông cạnh $2$ thành $4$ hình vuông nhỏ cạnh $1$ (4 chuồng). $9$ điểm $\\implies$ có $\\lceil 9/4 \\rceil = 3$ điểm cùng thuộc 1 ô vuông cạnh $1$! Đường kính lớn nhất của ô vuông cạnh $1$ là đường chéo $\\sqrt{2}$.'
        }
      ],
      miniEssay: {
        id: 'mpro5-s1-e1',
        question: 'Chứng minh rằng trong $10$ số nguyên dương tùy ý khác nhau, luôn tồn tại $2$ số có tổng hoặc hiệu chia hết cho $16$.',
        hint: 'Xếp các số dư khi chia cho $16$ vào $9$ chuồng đối xứng: $\\{0\\}, \\{8\\}, \\{1, 15\\}, \\{2, 14\\}, \\dots, \\{7, 9\\}$. Với $10$ số rơi vào $9$ chuồng, áp dụng Dirichlet!',
        rubricChecklist: [
          'Phân hoạch $16$ số dư $\\pmod{16}$ thành đúng $9$ nhóm: $\\{0\\}, \\{8\\}$, và $7$ cặp $\\{r, 16-r\\}$ ($r=1..7$).',
          'Áp dụng Dirichlet cho $10$ số vào $9$ chuồng $\\implies$ có $2$ số $a, b$ rơi vào cùng 1 nhóm.',
          'Chỉ ra: nếu cùng số dư thì $16 \\mid (a - b)$; nếu thuộc hai nửa bổ sung $r$ và $16-r$ thì $16 \\mid (a + b)$.'
        ],
        sampleAnswer:
          'Xét số dư của mỗi số khi chia cho $16$, ta phân $16$ số dư thành $9$ nhóm (chuồng) như sau: $N_0 = \\{0\\}$, $N_8 = \\{8\\}$, và $N_r = \\{r; 16 - r\\}$ với $r \\in \\{1, 2, 3, 4, 5, 6, 7\\}$. Nhốt $10$ số đã cho vào $9$ chuồng theo số dư của chúng $\\pmod{16}$. Theo nguyên lý Dirichlet, tồn tại ít nhất $2$ số $a, b$ thuộc cùng một nhóm $N_k$. Nếu $a$ và $b$ có cùng số dư khi chia cho $16$ (kể cả cùng thuộc $N_0$ hoặc $N_8$) thì $(a - b) \\vdots 16$. Nếu $a$ dư $r$ và $b$ dư $16 - r$ thì $(a + b) \\equiv r + (16 - r) \\equiv 0 \\pmod{16}$, tức $(a + b) \\vdots 16$.'
      }
    },
    {
      stepTitle: '2. Bất biến & Đơn biến trong Trò chơi / Biến đổi Trạng thái',
      stepType: 'derivation',
      conceptSection:
        'Bài toán biến đổi bảng số, xóa hai số viết tổng/hiệu hay lật đồng xu thường không thể thử hết mọi nhánh thao tác. Thay vào đó, ta đi tìm một **Bất biến** (đại lượng KHÔNG ĐỔI qua mọi bước biến đổi — như tính chẵn lẻ, số dư $\\pmod 3$, tổng, tích dấu) hoặc **Đơn biến** (đại lượng tăng/giảm nghiêm ngặt để chứng minh quá trình phải DỪNG lại).',
      formulaSection: {
        primaryFormula: '\\text{Bất biến } I(S_0) = I(S_k) \\implies \\text{Nếu } I(S_{\\text{đích}}) \\neq I(S_0) \\text{ thì KHÔNG THỂ biến đổi được!}',
        secondaryFormulas: [
          '\\text{Đơn biến } f(S_{k+1}) < f(S_k) \\text{ trên tập } \\mathbb{N} \\implies \\text{thuật toán dừng sau hữu hạn bước}',
          '\\text{Bất biến tô màu bàn cờ: } \\text{ô đen / ô trắng, hoặc đánh số } (i, j) \\pmod 2'
        ],
        variablesNote:
          '• **Các bất biến kinh điển cần thử ngay**:\n  1) **Tính chẵn lẻ của tổng** (ví dụ xóa $a, b$ viết $|a - b|$: tổng giảm $2\\min(a,b)$ chẵn nên tính chẵn lẻ của tổng KHÔNG ĐỔI!).\n  2) **Tích các số $\\pm 1$**: đổi dấu $k$ số cùng lúc nếu $k$ chẵn thì tích giữ nguyên.\n  3) **Bất biến đồng dư $\\pmod 3$** hoặc **Bất biến $(a+1)(b+1)$**: xóa $a, b$ viết $ab + a + b$ chính là $(a+1)(b+1) - 1$, nên $\\prod(x_i + 1)$ là bất biến!'
      },
      deepDiveSection:
        'Với các bài toán lật đồng xu hoặc lát gạch bàn cờ $8 \\times 8$ bỏ 2 ô đối diện: tô màu bàn cờ đen–trắng xen kẽ! Hai ô góc đối diện có **cùng màu**, nên bỏ đi khiến số ô đen và ô trắng lệch nhau $2$ đơn vị — mà mỗi quân domino $1 \\times 2$ luôn phủ đúng $1$ đen + $1$ trắng $\\implies$ KHÔNG BAO GIỜ lát kín được!',
      teacherExplanation: 'Gặp thao tác xóa $a, b$ viết $ab + a + b$: nhớ ngay công thức cộng 1 thành $(a+1)(b+1) - 1$!',
      keyTakeaway: 'Tìm đại lượng bất biến (chẵn lẻ, $\\pmod 3$, $\\prod(a_i+1)$, tô màu bàn cờ) để kết luận trạng thái cuối.',
      miniQuiz: [
        {
          id: 'mpro5-s2-q1',
          question: 'Trên bảng viết các số $1, 2, 3, \\dots, 2025$. Mỗi bước xóa đi hai số bất kỳ $a, b$ rồi viết lên bảng số $|a - b|$. Sau $2024$ bước chỉ còn lại đúng $1$ số. Số cuối cùng đó là:',
          options: ['A. Một số lẻ', 'B. Một số chẵn', 'C. Chắc chắn bằng $0$', 'D. Chắc chắn bằng $1$'],
          correctIndex: 0,
          explanation: 'Tổng ban đầu $1 + 2 + \\dots + 2025 = \\frac{2025\\cdot 2026}{2} = 2025 \\cdot 1013$ là SỐ LẺ. Mỗi bước thay $(a+b)$ bằng $|a-b|$ làm tổng giảm $2\\min(a,b)$ (số chẵn), nên tính chẵn lẻ không đổi $\\implies$ số cuối cùng chắc chắn LẺ!'
        },
        {
          id: 'mpro5-s2-q2',
          question: 'Mỗi bước xóa hai số $a, b$ trên bảng và viết lại số $ab + a + b$. Đại lượng nào dưới đây là **bất biến** qua mọi phép biến đổi?',
          options: [
            'A. Tích $\\prod (x_i + 1)$ của tất cả các số trên bảng',
            'B. Tổng $\\sum x_i$',
            'C. Tích $\\prod x_i$',
            'D. Tổng bình phương $\\sum x_i^2$'
          ],
          correctIndex: 0,
          explanation: 'Vì $(ab + a + b) + 1 = (a + 1)(b + 1)$, tích $\\prod(x_i + 1)$ không hề thay đổi sau mỗi lần gộp hai số!'
        }
      ],
      miniEssay: {
        id: 'mpro5-s2-e1',
        question: 'Trên bảng có $10$ số gồm toàn các số $1$ và $-1$ (trong đó có đúng $3$ số $-1$ và $7$ số $1$). Mỗi bước ta chọn $2$ số bất kỳ và đổi dấu cả hai số đó. Hỏi có thể sau hữu hạn bước đưa toàn bộ $10$ số trên bảng thành số $1$ được không? Tại sao?',
        hint: 'Xét tích $P$ của cả $10$ số trên bảng. Mỗi bước đổi dấu $2$ số thì $P$ nhân với $(-1)(-1) = 1$ nên $P$ không đổi.',
        rubricChecklist: [
          'Tính tích ban đầu của $10$ số: $P_0 = (-1)^3 \\cdot 1^7 = -1$.',
          'Chứng minh bất biến: đổi dấu $2$ số $a, b$ làm $P$ biến thành $(-a)(-b)\\dots = P$ (không đổi).',
          'Trạng thái đích toàn số $1$ có tích $P_{\\text{đích}} = 1 \\neq -1$, suy ra KHÔNG THỂ thực hiện được.'
        ],
        sampleAnswer:
          'Xét tích $P$ của tất cả $10$ số trên bảng. Ban đầu có $3$ số $-1$ và $7$ số $1$ nên $P_0 = (-1)^3 \\cdot 1^7 = -1$. Ở mỗi bước, khi đổi dấu đồng thời hai số $a, b$ thành $-a, -b$, tích của hai số đó không đổi vì $(-a)(-b) = ab$, do đó $P$ là đại lượng bất biến ($P = -1$ sau mọi bước). Nếu tất cả $10$ số đều trở thành $1$ thì tích phải bằng $1 \\neq -1$ (vô lý). Vậy KHÔNG THỂ đưa cả $10$ số về $1$.'
      }
    },
    {
      stepTitle: '3. Đếm bằng Hai cách & Cực trị Tổ hợp',
      stepType: 'example',
      conceptSection:
        'Kỹ thuật **Đếm bằng hai cách (Double Counting)** dùng để chứng minh các đẳng thức tổ hợp hoặc bất đẳng thức trên đồ thị / bảng ô vuông bằng cách đếm cùng một tập hợp cặp $(A, B)$ theo hàng rồi lại đếm theo cột.',
      formulaSection: {
        primaryFormula: '\\sum_{i=1}^{m} |R_i| = \\sum_{j=1}^{n} |C_j| \\quad (\\text{Tổng theo hàng = Tổng theo cột})',
        secondaryFormulas: [
          '\\text{Tổng bậc đồ thị: } \\sum_{v \\in V} \\deg(v) = 2|E| \\ (\\text{số đỉnh bậc lẻ luôn chẵn})',
          '\\text{Số cặp cạnh chung đỉnh (vế tam giác/góc): } \\sum_{v} C_{\\deg(v)}^2'
        ],
        variablesNote:
          '• **Công thức Bổ đề Bắt tay**: Tổng số cái bắt tay (hay tổng bậc các đỉnh) luôn gấp đôi số cạnh $2|E|$ — đây chính là ví dụ đơn giản nhất của đếm bằng hai cách!\n• Trong bài toán chọn hội đồng / giải đề thi: đếm số cặp "(học sinh, bài giải đúng)" theo từng học sinh và theo từng bài toán, kết hợp BĐT Jensen/Bunyakovsky để suy ra cận dưới/cận trên.'
      },
      deepDiveSection:
        'Một kỹ thuật kinh điển kết hợp Đếm bằng hai cách với BĐT Cauchy–Schwarz: đếm số cặp cùng chọn chung 2 phần tử (số bộ ba $(h_1, h_2, b)$ với $h_1, h_2$ cùng làm được bài $b$), viết theo bài là $\\sum C_{d_b}^2$ và so sánh với giới hạn số cặp học sinh $C_m^2$ để tìm GTLN số học sinh hoặc số bài.',
      teacherExplanation: 'Khi bài toán tổ hợp cho quan hệ đối xứng giữa $2$ nhóm đối tượng (học sinh–bài toán, điểm–đường thẳng), hãy lập bảng $0/1$ rồi đếm tổng theo hàng và tổng theo cột!',
      keyTakeaway: 'Tổng bậc $\\sum \\deg(v) = 2|E|$; đếm số bộ đôi qua bảng $0/1$ theo hàng và cột cho đẳng/bất đẳng thức mạnh.',
      miniQuiz: [
        {
          id: 'mpro5-s3-q1',
          question: 'Trong một buổi họp có $9$ người, liệu mỗi người có thể bắt tay với ĐÚNG $3$ người khác không?',
          options: [
            'A. Không thể, vì tổng số bậc $9 \\cdot 3 = 27$ là số lẻ (mâu thuẫn $2|E|$ chẵn)',
            'B. Có thể, bằng cách chia thành $3$ nhóm',
            'C. Có thể nếu xếp thành vòng tròn',
            'D. Tùy thuộc vào thứ tự bắt tay'
          ],
          correctIndex: 0,
          explanation: 'Tổng số lượt bắt tay là $9 \\times 3 = 27$ là số lẻ, trái với bổ đề bắt tay $\\sum \\deg(v) = 2|E|$ luôn là số chẵn.'
        },
        {
          id: 'mpro5-s3-q2',
          question: 'Đẳng thức tổ hợp $\\sum_{k=0}^{n} k\\cdot C_n^k = n\\cdot 2^{n-1}$ có thể chứng minh bằng đếm theo 2 cách đối tượng nào?',
          options: [
            'A. Chọn từ $n$ người một đội có $k$ thành viên và $1$ đội trưởng trong đội đó',
            'B. Xếp $n$ người thành một hàng dọc',
            'C. Chia $n$ cái kẹo giống nhau cho $2$ người',
            'D. Đếm số tam giác tạo từ $n$ điểm'
          ],
          correctIndex: 0,
          explanation: 'Cách 1 (chọn đội $k$ người trước rồi chọn đội trưởng): $\\sum_{k=1}^n k C_n^k$. Cách 2 (chọn đội trưởng trước trong $n$ cách, $n-1$ người còn lại mỗi người có 2 lựa chọn vào/không vào đội): $n \\cdot 2^{n-1}$.'
        }
      ],
      miniEssay: {
        id: 'mpro5-s3-e1',
        question: 'Chứng minh bằng phương pháp đếm hai cách: với mọi số nguyên dương $n$, ta có $\\sum_{k=1}^{n} k \\cdot C_n^k = n \\cdot 2^{n-1}$.',
        hint: 'Đếm số cách lập một ban đại diện (có ít nhất $1$ người) từ $n$ học sinh, trong đó chỉ định rõ $1$ trưởng ban.',
        rubricChecklist: [
          'Nêu rõ bài toán đếm chung: lập 1 ban đại diện (cỡ $k \\ge 1$) từ $n$ người kèm 1 trưởng ban.',
          'Cách 1 (chọn cỡ nhóm $k$ trước): có $\\sum_{k=1}^{n} C_n^k \\cdot k$ cách.',
          'Cách 2 (chọn trưởng ban trước rồi chọn tập con trong $n-1$ người còn lại): có $n \\cdot 2^{n-1}$ cách. Cho hai biểu thức bằng nhau.'
        ],
        sampleAnswer:
          'Xét bài toán: Từ một lớp gồm $n$ học sinh, có bao nhiêu cách lập một đội công tác (có ít nhất $1$ người) và cử ra đúng $1$ đội trưởng? Cách 1: Chọn số thành viên $k$ ($1 \\le k \\le n$): chọn $k$ người có $C_n^k$ cách, chọn $1$ đội trưởng trong $k$ người có $k$ cách $\\implies$ tổng cộng $\\sum_{k=1}^{n} k \\cdot C_n^k$ cách. Cách 2: Chọn đội trưởng trước từ $n$ học sinh có $n$ cách; với $n - 1$ học sinh còn lại, mỗi bạn có $2$ khả năng (vào đội hoặc không) nên có $2^{n-1}$ cách chọn tập thành viên còn lại $\\implies$ có $n \\cdot 2^{n-1}$ cách. Vì cùng đếm một đối tượng nên $\\sum_{k=1}^{n} k \\cdot C_n^k = n \\cdot 2^{n-1}$.'
      }
    }
  ],
  'math-pro-6': [
    {
      stepTitle: '1. Cực trị Hàm hợp $f(u(x))$ & Kỹ thuật Ghép trục (Đồ thị HSG)',
      stepType: 'concept',
      conceptSection:
        'Tìm số điểm cực trị hoặc số nghiệm của hàm hợp $y = f(u(x))$ (hoặc $y = f(|u(x)|)$) là dạng vận dụng cao cốt lõi của Giải tích lớp 12. Kỹ thuật đạo hàm kết hợp **Ghép trục** giúp vẽ bảng biến thiên hàm hợp chỉ trong 30 giây.',
      formulaSection: {
        primaryFormula: '[f(u(x))]\' = u\'(x) \\cdot f\'(u(x)) = 0 \\iff \\left[\\begin{array}{l} u\'(x) = 0 \\\\ f\'(u(x)) = 0 \\end{array}\\right.',
        secondaryFormulas: [
          '\\text{Số cực trị của } f(|x|): \\ 2a + 1 \\ (a \\text{ là số cực trị dương của } f(x))',
          '\\text{Số cực trị của } |f(x)|: \\ a + b \\ (a: \\text{cực trị } f(x);\\ b: \\text{số nghiệm đơn của } f(x) = 0)'
        ],
        variablesNote:
          '• **Cực kỳ chú ý nghiệm bội chẵn**: Một nghiệm $x_0$ của $y\' = 0$ CHỈ LÀ ĐIỂM CỰC TRỊ nếu $y\'$ **đổi dấu qua $x_0$** (nghiệm đơn hoặc bội lẻ)!\n• Khi phương trình $u(x) = c_i$ tiếp xúc đồ thị (nghiệm kép), qua điểm đó $f\'(u(x))$ KHÔNG đổi dấu nên không sinh thêm cực trị!'
      },
      deepDiveSection:
        'Quy trình **Ghép trục** 3 bước: (1) Hàng 1 là $x$ và các cực trị của $u(x)$; (2) Hàng 2 là chiều biến thiên của $u(x)$, điền thêm các điểm cực trị $c_i$ của $f$ vào các khoảng tăng/giảm của $u$; (3) Hàng 3 đọc thẳng chiều tăng/giảm của $f(u)$ dựa theo bảng biến thiên $f(t)$!',
      teacherExplanation: 'Nhớ hai công thức đếm nhanh cực trị trị tuyệt đối: $f(|x|)$ là $2a+1$ (lấy bên phải $Oy$ đối xứng sang); $|f(x)|$ là $a+b$ (lật phần dưới $Ox$ lên)!',
      keyTakeaway: 'Cực trị $f(u(x))$ gồm các cực trị đơn của $u(x)$ cộng số nghiệm đơn của $u(x) = c_i$ (với $c_i$ là cực trị của $f$).',
      miniQuiz: [
        {
          id: 'mpro6-s1-q1',
          question: 'Cho hàm số $y = f(x)$ có $2$ điểm cực trị dương là $x = 1$ và $x = 3$ (và không có cực trị tại $0$). Hàm số $y = f(|x|)$ có tất cả bao nhiêu điểm cực trị?',
          options: ['A. $5$', 'B. $3$', 'C. $4$', 'D. $2$'],
          correctIndex: 0,
          explanation: 'Áp dụng công thức $2a + 1$ với $a = 2$ cực trị dương: $2(2) + 1 = 5$ điểm cực trị ($-3, -1, 0, 1, 3$).'
        },
        {
          id: 'mpro6-s1-q2',
          question: 'Cho hàm số $y = f(x)$ có $3$ điểm cực trị và đồ thị $y = f(x)$ cắt trục hoành $Ox$ tại $4$ điểm phân biệt (đều là nghiệm đơn). Số điểm cực trị của $y = |f(x)|$ là:',
          options: ['A. $7$', 'B. $4$', 'C. $5$', 'D. $6$'],
          correctIndex: 0,
          explanation: 'Số cực trị của $|f(x)|$ bằng $a + b = 3 + 4 = 7$ điểm cực trị.'
        }
      ],
      miniEssay: {
        id: 'mpro6-s1-e1',
        question: 'Cho hàm số $f(x)$ có đạo hàm $f\'(x) = x(x - 2)^2(x^2 - 4)$ với mọi $x \\in \\mathbb{R}$. Tìm số điểm cực trị của hàm số $g(x) = f(x^2 - 3)$.',
        hint: 'Phân tích $f\'(t) = t(t-2)^3(t+2)$ để tìm các nghiệm bội lẻ của $f\'(t) = 0$ ($t = -2, 0, 2$), sau đó giải $g\'(x) = 2x \\cdot f\'(x^2 - 3) = 0$ và đếm số nghiệm đơn/bội lẻ.',
        rubricChecklist: [
          'Thu gọn $f\'(t) = t(t-2)^3(t+2)$ có 3 nghiệm bội lẻ là $t = -2,\\ t = 0,\\ t = 2$.',
          'Tính $g\'(x) = 2x \\cdot f\'(x^2 - 3) = 0 \\iff x = 0$ hoặc $x^2 - 3 \\in \\{-2; 0; 2\\}$.',
          'Giải các phương trình $x^2 = 1; 3; 5$ được $6$ nghiệm phân biệt khác $0$, cộng thêm $x = 0$ là $7$ điểm cực trị.'
        ],
        sampleAnswer:
          'Ta viết lại $f\'(t) = t(t - 2)^2(t - 2)(t + 2) = t(t - 2)^3(t + 2)$, suy ra $f\'(t)$ đổi dấu tại 3 điểm $t = -2, t = 0, t = 2$. Đạo hàm $g\'(x) = 2x \\cdot f\'(x^2 - 3) = 2x(x^2 - 3)(x^2 - 5)^3(x^2 - 1)$. Phương trình $g\'(x) = 0$ có $7$ nghiệm bội lẻ phân biệt: $x = 0$, $x = \\pm 1$, $x = \\pm\\sqrt{3}$, $x = \\pm\\sqrt{5}$. Vậy $g(x)$ có $7$ điểm cực trị.'
      }
    },
    {
      stepTitle: '2. Phương trình Hàm Cơ bản & Tính Đạo hàm / Thay Giá trị Đặc biệt',
      stepType: 'derivation',
      conceptSection:
        'Phương trình hàm là chủ đề đặc sản của kỳ thi HSG Toán cấp tỉnh và Quốc gia. Ở bậc phổ thông, hai chiến thuật giải nhanh nhất là **Thay giá trị đặc biệt ($x, y = 0, 1, -x$)** kết hợp tính đơn ánh/toàn ánh, và **Phương trình hàm Cauchy** ($f(x+y) = f(x) + f(y)$).',
      formulaSection: {
        primaryFormula: 'f(x + y) = f(x) + f(y) \\text{ (liên tục hoặc đơn điệu trên } \\mathbb{R}) \\implies f(x) = cx',
        secondaryFormulas: [
          'f(x + y) = f(x)f(y) \\implies f(x) = a^x \\text{ hoặc } f(x) \\equiv 0',
          '\\text{Phương trình đại số dạng } af(x) + bf\\left(\\frac{1}{x}\\right) = g(x) \\implies \\text{thay } x \\mapsto \\frac{1}{x} \\text{ giải hệ!}'
        ],
        variablesNote:
          '• **Cảnh giác cực cao**: Sau khi tìm ra công thức $f(x)$ (ví dụ $f(x) = cx$ hoặc $f(x) = x^2$), BẮT BUỘC phải **thử lại vào phương trình hàm ban đầu** để kiểm tra hệ số $c$ thỏa mãn — rất nhiều bạn quên bước thử lại nên nhận thừa nghiệm!'
      },
      deepDiveSection:
        'Dạng bài hay xuất hiện trong đề thi THPT nâng cao là cho hàm khả vi thỏa $f(x) + f(1 - x) = g(x)$ hoặc $f\'(x) + p(x)f(x) = q(x)$: với phương trình vi phân tuyến tính bậc nhất $f\'(x) + f(x) = \\dots$, hãy nhân hai vế với nhân tử tích phân $e^{x}$ để gom thành $[e^x f(x)]\'$ rồi lấy nguyên hàm!',
      teacherExplanation: 'Khi gặp $af(x) + bf(1/x) = g(x)$ hoặc $af(x) + bf(-x) = g(x)$, thay ngay phép đối xứng vào lập hệ 2 phương trình 2 ẩn!',
      keyTakeaway: 'Thay phép đối xứng ($x \\mapsto -x$, $1/x$, $1-x$) giải hệ; với Cauchy trên hàm liên tục luôn ra $f(x) = cx$.',
      miniQuiz: [
        {
          id: 'mpro6-s2-q1',
          question: 'Cho hàm số $f(x)$ xác định trên $\\mathbb{R} \\setminus \\{0\\}$ thỏa mãn $f(x) + 2f\\left(\\frac{1}{x}\\right) = 3x$. Giá trị của $f(2)$ bằng:',
          options: ['A. $-1$', 'B. $1$', 'C. $2$', 'D. $-2$'],
          correctIndex: 0,
          explanation: 'Thay $x = 2$: $f(2) + 2f(1/2) = 6$. Thay $x = 1/2$: $f(1/2) + 2f(2) = 3/2 \\implies 4f(2) + 2f(1/2) = 3$. Trừ 2 PT: $3f(2) = -3 \\implies f(2) = -1$.'
        },
        {
          id: 'mpro6-s2-q2',
          question: 'Nhân cả hai vế của phương trình $f\'(x) + f(x) = e^x$ với nhân tử nào để vế trái trở thành đạo hàm của một tích?',
          options: ['A. $e^x$', 'B. $e^{-x}$', 'C. $x$', 'D. $\\ln x$'],
          correctIndex: 0,
          explanation: '$e^x f\'(x) + e^x f(x) = [e^x f(x)]\' = e^{2x}$.'
        }
      ],
      miniEssay: {
        id: 'mpro6-s2-e1',
        question: 'Tìm tất cả các hàm số $f: \\mathbb{R} \\to \\mathbb{R}$ thỏa mãn $2f(x) + f(1 - x) = x^2$ với mọi $x \\in \\mathbb{R}$.',
        hint: 'Thay $x$ bởi $1 - x$ để có phương trình thứ 2: $2f(1 - x) + f(x) = (1 - x)^2$, sau đó khử $f(1 - x)$.',
        rubricChecklist: [
          'Thay $x \\mapsto 1 - x$ viết đúng $2f(1 - x) + f(x) = (1 - x)^2$.',
          'Nhân PT đầu với $2$ rồi trừ PT sau: $3f(x) = 2x^2 - (1 - x)^2 = x^2 + 2x - 1$.',
          'Tìm ra $f(x) = \\frac{x^2 + 2x - 1}{3}$ và thử lại thấy thỏa mãn.'
        ],
        sampleAnswer:
          'Với mọi $x \\in \\mathbb{R}$, ta có $2f(x) + f(1 - x) = x^2$ (1). Thay $x$ bởi $1 - x$ vào (1): $2f(1 - x) + f(x) = (1 - x)^2$ (2). Lấy $2\\cdot(1) - (2)$: $3f(x) = 2x^2 - (1 - 2x + x^2) = x^2 + 2x - 1 \\implies f(x) = \\frac{x^2 + 2x - 1}{3}$. Thử lại: $2\\frac{x^2+2x-1}{3} + \\frac{(1-x)^2 + 2(1-x) - 1}{3} = \\frac{2x^2+4x-2 + x^2-4x+2}{3} = x^2$ (đúng). Vậy $f(x) = \\frac{x^2 + 2x - 1}{3}$.'
      }
    },
    {
      stepTitle: '3. Cực trị Tọa độ Không gian $Oxyz$ & Tâm Tỉ cự',
      stepType: 'example',
      conceptSection:
        'Bài toán cực trị $Oxyz$ (ví dụ tìm $M \\in (P)$ hoặc $M \\in d$ sao cho $|\\overrightarrow{MA} + 2\\overrightarrow{MB} - \\overrightarrow{MC}|$ hoặc $MA^2 + 2MB^2$ nhỏ nhất) được giải gọn bằng **Điểm tâm tỉ cự $I$** (với $\\sum k_i \\overrightarrow{IA_i} = \\vec{0}$) và **Hình chiếu vuông góc**.',
      formulaSection: {
        primaryFormula: 'I \\text{ thỏa } \\sum k_i \\overrightarrow{IA_i} = \\vec{0} \\implies \\left|\\sum k_i \\overrightarrow{MA_i}\\right| = \\left|\\sum k_i\\right| \\cdot MI',
        secondaryFormulas: [
          '\\sum k_i MA_i^2 = \\left(\\sum k_i\\right) MI^2 + \\sum k_i IA_i^2 \\implies \\min \\iff MI \\min \\ (M \\text{ là hình chiếu của } I)',
          'I = \\frac{k_1 A_1 + k_2 A_2 + \\dots + k_n A_n}{k_1 + k_2 + \\dots + k_n}'
        ],
        variablesNote:
          '• **Cực kỳ mạnh khi nhớ 1 công thức tâm tỉ cự**: Khi gặp tổng vectơ hoặc tổng bình phương độ dài, tìm ngay tọa độ điểm cố định $I = \\frac{\\sum k_i A_i}{\\sum k_i}$. Khi đó cực trị **LUÔN ĐẠT TẠI HÌNH CHIẾU VUÔNG GÓC** của $I$ lên mặt phẳng $(P)$, đường thẳng $d$, hoặc mặt cầu $(S)$!'
      },
      deepDiveSection:
        'Nếu mặt cầu $(S)$ và mặt phẳng $(P)$ cắt nhau hay tiếp xúc, hoặc khi tìm giá trị lớn nhất của $d(M, (Q))$ với $M$ thuộc giao tuyến mặt cầu, ta luôn sử dụng bất đẳng thức tam giác $MI \\le R$ kết hợp dựng đường thẳng qua tâm vuông góc với mặt phẳng mục tiêu.',
      teacherExplanation: 'Gặp tổng có trọng số $\\sum k_i MA_i^2$ hay $|\\sum k_i \\overrightarrow{MA_i}|$: tính ngay tâm tỉ cự $I$, rồi hạ hình chiếu của $I$ là xong bài toán!',
      keyTakeaway: 'Tâm tỉ cự $I = \\frac{\\sum k_i A_i}{\\sum k_i}$ biến mọi cực trị nhiều điểm về tìm khoảng cách ngắn nhất $MI$.',
      miniQuiz: [
        {
          id: 'mpro6-s3-q1',
          question: 'Trong $Oxyz$, cho $A(1; 0; 2)$ và $B(3; 4; -2)$. Điểm $M$ thuộc mặt phẳng $(Oxy)$ ($z = 0$) sao cho $MA^2 + MB^2$ nhỏ nhất có tọa độ là:',
          options: ['A. $(2; 2; 0)$', 'B. $(1; 2; 0)$', 'C. $(2; 0; 0)$', 'D. $(0; 2; 0)$'],
          correctIndex: 0,
          explanation: 'Tâm tỉ cự ($k_1 = k_2 = 1$) là trung điểm $I(2; 2; 0)$. Vì $I$ nằm sẵn trên $(Oxy)$ ($z=0$) nên $M \\equiv I(2; 2; 0)$!'
        },
        {
          id: 'mpro6-s3-q2',
          question: 'Tìm điểm $I$ thỏa mãn $\\overrightarrow{IA} + 2\\overrightarrow{IB} = \\vec{0}$ biết $A(0; 3; 0), B(3; 0; 6)$.',
          options: ['A. $I(2; 1; 4)$', 'B. $I(1; 2; 2)$', 'C. $I(1{,}5; 1{,}5; 3)$', 'D. $I(2; 2; 4)$'],
          correctIndex: 0,
          explanation: '$I = \\frac{1\\cdot A + 2\\cdot B}{3} = \\left(\\frac{0+6}{3};\\ \\frac{3+0}{3};\\ \\frac{0+12}{3}\\right) = (2; 1; 4)$.'
        }
      ],
      miniEssay: {
        id: 'mpro6-s3-e1',
        question: 'Trong $Oxyz$, cho $A(1; 2; 3)$, $B(-1; 4; 1)$, $C(3; 0; 5)$ và mặt phẳng $(P): x + y + z - 6 = 0$. Tìm điểm $M \\in (P)$ sao cho $|\\overrightarrow{MA} + \\overrightarrow{MB} + \\overrightarrow{MC}|$ nhỏ nhất.',
        hint: 'Gọi $G$ là trọng tâm $\\triangle ABC$, tính $G(1; 2; 3)$, biến đổi tổng thành $3MG$, rồi tìm hình chiếu vuông góc của $G$ xuống $(P)$.',
        rubricChecklist: [
          'Tính tọa độ trọng tâm $G = \\frac{A+B+C}{3} = (1; 2; 3)$.',
          'Thu gọn $|\\overrightarrow{MA} + \\overrightarrow{MB} + \\overrightarrow{MC}| = 3MG$, suy ra nhỏ nhất khi $M$ là hình chiếu vuông góc của $G$ trên $(P)$.',
          'Kiểm tra $1 + 2 + 3 - 6 = 0 \\implies G \\in (P)$! Vậy $M \\equiv G(1; 2; 3)$ (GTNN bằng $0$).'
        ],
        sampleAnswer:
          'Gọi $G$ là trọng tâm $\\triangle ABC$, ta có $G\\left(\\frac{1-1+3}{3};\\ \\frac{2+4+0}{3};\\ \\frac{3+1+5}{3}\\right) = (1; 2; 3)$. Khi đó $|\\overrightarrow{MA} + \\overrightarrow{MB} + \\overrightarrow{MC}| = |3\\overrightarrow{MG}| = 3MG$. Biểu thức đạt giá trị nhỏ nhất khi $MG$ nhỏ nhất. Thay tọa độ $G$ vào $(P)$: $1 + 2 + 3 - 6 = 0$, chứng tỏ $G \\in (P)$! Do đó GTNN bằng $0$ đạt tại $M \\equiv G(1; 2; 3)$.'
      }
    }
  ],
  'math-chuyen-circle': [
    {
      stepTitle: '1. Đường tròn Apollonius & Phương tích Liên hợp',
      stepType: 'concept',
      conceptSection:
        'Ngoài định nghĩa tập hợp điểm cách đều tâm, một **đường tròn Apollonius** sinh ra từ quỹ tích điểm $M$ có tỉ số khoảng cách tới hai điểm cố định không đổi $\\frac{MA}{MB} = k \\neq 1$. Tâm và đường kính của đường tròn này chính là chân hai đường phân giác trong và ngoài!',
      formulaSection: {
        primaryFormula: '\\frac{MA}{MB} = k \\neq 1 \\implies M \\text{ thuộc đường tròn đường kính } DE \\text{ với } (A, B; D, E) = -1',
        secondaryFormulas: [
          '\\mathcal{P}_{M/(O)} = MO^2 - R^2 = \\overline{MA}\\cdot\\overline{MB}',
          '\\text{Hiệu phương tích: } \\mathcal{P}_{M/(O_1)} - \\mathcal{P}_{M/(O_2)} = 2\\overrightarrow{O_1O_2}\\cdot\\overrightarrow{HM} \\ (H \\in \\Delta)'
        ],
        variablesNote:
          '• **Bổ đề Hiệu Phương tích**: Hiệu phương tích của $M$ đối với hai đường tròn $(O_1), (O_2)$ tỉ lệ thuận với khoảng cách từ $M$ tới trục đẳng phương $\\Delta$ ($= 2\\cdot O_1O_2 \\cdot d(M, \\Delta)$)!\n• Dùng bổ đề này chứng minh thẳng được nhiều bài toán đường tròn trực giao và điểm Miquel.'
      },
      deepDiveSection:
        'Khi hai đường tròn $(O_1; R_1)$ và $(O_2; R_2)$ **trực giao** (hai tiếp tuyến tại giao điểm vuông góc nhau, tức $O_1O_2^2 = R_1^2 + R_2^2$), thì mọi đường kính $AB$ của $(O_1)$ đi qua giao điểm hoặc mọi cát tuyến qua $O_1$ cắt $(O_2)$ tại $C, D$ đều cho $(A, B; C, D) = -1$!',
      teacherExplanation: 'Khi thấy tỉ lệ $\\frac{MA}{MB} = k \\neq 1$, dựng ngay $D, E$ chia trong và chia ngoài $AB$ theo tỉ lệ $k$ để lấy đường tròn đường kính $DE$!',
      keyTakeaway: 'Quỹ tích $\\frac{MA}{MB} = k \\neq 1$ là đường tròn đường kính $DE$ chia điều hòa $AB$; hiệu hai phương tích tỉ lệ với $d(M, \\Delta)$.',
      miniQuiz: [
        {
          id: 'mchc-s1-q1',
          question: 'Cho hai điểm cố định $A, B$ có $AB = 6$. Tập hợp điểm $M$ trong mặt phẳng thỏa mãn $\\frac{MA}{MB} = 2$ là:',
          options: [
            'A. Đường tròn đường kính $DE = 8$',
            'B. Đường trung trực của $AB$',
            'C. Đường tròn bán kính $6$',
            'D. Đường thẳng qua trung điểm $AB$'
          ],
          correctIndex: 0,
          explanation: 'Điểm $D$ chia trong: $DA = 4, DB = 2$. Điểm $E$ chia ngoài: $EA = 12, EB = 6$. Do $B$ giữa $D, E$ nên đường kính $DE = DB + BE = 2 + 6 = 8$.'
        },
        {
          id: 'mchc-s1-q2',
          question: 'Hai đường tròn $(O_1; 3)$ và $(O_2; 4)$ cắt nhau trực giao (vuông góc tại giao điểm). Khoảng cách hai tâm $O_1O_2$ bằng:',
          options: ['A. $5$', 'B. $7$', 'C. $1$', 'D. $12$'],
          correctIndex: 0,
          explanation: 'Trực giao $\\iff O_1A \\perp O_2A \\implies O_1O_2 = \\sqrt{R_1^2 + R_2^2} = \\sqrt{3^2 + 4^2} = 5$.'
        }
      ],
      miniEssay: {
        id: 'mchc-s1-e1',
        question: 'Cho đoạn $AB$ cố định và tỉ số $k > 0, k \\neq 1$. Gọi $D, E$ lần lượt là điểm chia trong và chia ngoài đoạn $AB$ theo tỉ số $k$. Chứng minh rằng với điểm $M$ bất kỳ không nằm trên $AB$ thỏa $\\frac{MA}{MB} = k$, ta luôn có $\\widehat{DME} = 90^\\circ$.',
        hint: 'Dùng định lý đường phân giác đảo: $MD$ là phân giác trong và $ME$ là phân giác ngoài của $\\widehat{AMB}$.',
        rubricChecklist: [
          'Chỉ ra $\\frac{DA}{DB} = \\frac{MA}{MB} = k$ (với $D$ thuộc đoạn $AB$) $\\implies MD$ là phân giác trong $\\widehat{AMB}$.',
          'Chỉ ra $\\frac{EA}{EB} = \\frac{MA}{MB} = k$ ($E$ ngoài đoạn $AB$) $\\implies ME$ là phân giác ngoài $\\widehat{AMB}$.',
          'Hai tia phân giác trong và ngoài của cùng một góc luôn vuông góc với nhau $\\implies \\widehat{DME} = 90^\\circ$.'
        ],
        sampleAnswer:
          'Trong $\\triangle MAB$, $D$ thuộc cạnh $AB$ thỏa $\\frac{DA}{DB} = \\frac{MA}{MB} = k$, nên theo định lý phân giác đảo $MD$ là tia phân giác trong của $\\widehat{AMB}$. Tương tự, $E$ nằm ngoài đoạn $AB$ trên đường thẳng $AB$ thỏa $\\frac{EA}{EB} = \\frac{MA}{MB} = k$ nên $ME$ là tia phân giác ngoài của góc đỉnh $M$. Vì hai tia phân giác của hai góc kề bù luôn vuông góc với nhau nên $\\widehat{DME} = 90^\\circ$, chứng tỏ $M$ thuộc đường tròn đường kính $DE$.'
      }
    },
    {
      stepTitle: '2. Điểm Miquel, Tứ giác Toàn phần & Đường tròn Chín điểm Euler',
      stepType: 'derivation',
      conceptSection:
        'Khi $4$ đường thẳng cắt nhau đôi một tạo thành một **tứ giác toàn phần**, $4$ đường tròn ngoại tiếp của $4$ tam giác tạo thành luôn đi qua một điểm chung duy nhất gọi là **Điểm Miquel $M$**. Với một tam giác bất kỳ, $9$ điểm đặc biệt (3 chân đường cao, 3 trung điểm cạnh, 3 trung điểm nối trực tâm tới đỉnh) cùng nằm trên **Đường tròn 9 điểm Euler**.',
      formulaSection: {
        primaryFormula: 'R_{\\text{Euler}} = \\frac{1}{2} R_{\\text{ngoại tiếp}}, \\qquad E \\text{ (tâm Euler) là trung điểm } OH',
        secondaryFormulas: [
          '\\text{Định lý Euler cho } O, G, H: \\ \\overrightarrow{OH} = 3\\overrightarrow{OG}, \\quad \\overrightarrow{OM} = \\frac{1}{2}\\overrightarrow{AH}',
          '\\text{Điểm Miquel } M \\text{ của tứ giác toàn phần } ABCDEF \\text{ nhìn 2 đoạn đường chéo góc bù/bằng nhau}'
        ],
        variablesNote:
          '• **Bí kíp nhận diện 9 điểm Euler**: Trong $\\triangle ABC$ có trung điểm $M$ của $BC$, chân đường cao $D$ hạ từ $A$ và trung điểm $I$ của $AH$: bộ ba $M, D, I$ nằm trên đường tròn Euler bán kính $R/2$ (tâm là trung điểm $OH$), đồng thời $MI$ chính là một **đường kính** của đường tròn Euler có độ dài bằng $R_{\\text{ngoại tiếp}}$ (với $OM = \\frac{1}{2}AH$).'
      },
      deepDiveSection:
        'Một tính chất tuyệt đẹp của Điểm Miquel trong tứ giác nội tiếp $ABCD$ có $E = AB \\cap CD$, $F = AD \\cap BC$: điểm Miquel $M$ nằm ngay trên **đoạn thẳng $EF$** (đường nối hai giao điểm cạnh đối), đồng thời $OM \\perp EF$ theo **Định lý Brocard**!',
      teacherExplanation: 'Nhớ đường thẳng Euler đi qua $O, G, H$ với $OH = 3OG$, còn tâm đường tròn 9 điểm nằm đúng trung điểm $OH$!',
      keyTakeaway: 'Đường tròn 9 điểm có tâm là trung điểm $OH$ và bán kính $\\frac{R}{2}$; 4 đường tròn trong tứ giác toàn phần đồng quy tại điểm Miquel.',
      miniQuiz: [
        {
          id: 'mchc-s2-q1',
          question: 'Cho tam giác $ABC$ có tâm ngoại tiếp $O$, trọng tâm $G$, trực tâm $H$. Biết $OG = 4\\text{ cm}$. Độ dài đoạn $OH$ và bán kính đường tròn 9 điểm (nếu $R = 10\\text{ cm}$) lần lượt là:',
          options: ['A. $OH = 12\\text{ cm},\\ R_9 = 5\\text{ cm}$', 'B. $OH = 8\\text{ cm},\\ R_9 = 5\\text{ cm}$', 'C. $OH = 12\\text{ cm},\\ R_9 = 10\\text{ cm}$', 'D. $OH = 6\\text{ cm},\\ R_9 = 5\\text{ cm}$'],
          correctIndex: 0,
          explanation: '$OH = 3OG = 12\\text{ cm}$ và $R_9 = \\frac{R}{2} = 5\\text{ cm}$.'
        },
        {
          id: 'mchc-s2-q2',
          question: 'Đường tròn 9 điểm Euler của tam giác nhọn $ABC$ đi qua nhóm điểm nào sau đây?',
          options: [
            'A. Trung điểm $BC$, chân đường cao hạ từ $A$, và trung điểm $AH$',
            'B. Tâm ngoại tiếp $O$, tâm nội tiếp $I$, và trực tâm $H$',
            'C. Ba đỉnh $A, B, C$ và trọng tâm $G$',
            'D. Ba tâm đường tròn bàng tiếp'
          ],
          correctIndex: 0,
          explanation: 'Đường tròn 9 điểm đi qua 3 trung điểm cạnh, 3 chân đường cao và 3 trung điểm đoạn nối trực tâm $H$ với 3 đỉnh.'
        }
      ],
      miniEssay: {
        id: 'mchc-s2-e1',
        question: 'Cho $\\triangle ABC$ nhọn nội tiếp $(O)$, trực tâm $H$. Gọi $M$ là trung điểm $BC$, đường kính $AK$ của $(O)$. Chứng minh $BHCK$ là hình bình hành và suy ra $OM = \\frac{1}{2}AH$.',
        hint: 'Chỉ ra $BK \\parallel CH$ (cùng $\\perp AB$) và $CK \\parallel BH$ (cùng $\\perp AC$), nên $M$ là trung điểm $HK$, rồi dùng đường trung bình $OM$ trong $\\triangle AHK$.',
        rubricChecklist: [
          'Chứng minh $\\widehat{ABK} = 90^\\circ \\implies BK \\perp AB$ mà $CH \\perp AB \\implies BK \\parallel CH$. Tương tự $CK \\parallel BH$.',
          'Suy ra $BHCK$ là hình bình hành nên trung điểm $M$ của $BC$ cũng là trung điểm $HK$.',
          'Trong $\\triangle AHK$, $O$ là trung điểm $AK$, $M$ là trung điểm $HK \\implies OM$ là đường trung bình $\\implies OM = \\frac{1}{2}AH$.'
        ],
        sampleAnswer:
          'Vì $AK$ là đường kính $(O)$ nên $\\widehat{ABK} = \\widehat{ACK} = 90^\\circ$, suy ra $BK \\perp AB$ và $CK \\perp AC$. Lại có trực tâm $H$ nên $CH \\perp AB$ và $BH \\perp AC$, dẫn đến $BK \\parallel CH$ và $CK \\parallel BH$. Do đó $BHCK$ là hình bình hành. Hai đường chéo $BC$ và $HK$ cắt nhau tại trung điểm $M$ của mỗi đường. Xét $\\triangle AHK$ có $O$ là trung điểm $AK$ và $M$ là trung điểm $HK$ nên $OM$ là đường trung bình, suy ra $OM \\parallel AH$ và $OM = \\frac{1}{2}AH$.'
      }
    },
    {
      stepTitle: '3. Phép Vị tự & Bổ đề Tiếp tuyến / Tiếp xúc Hai Đường tròn',
      stepType: 'example',
      conceptSection:
        'Khi hai đường tròn $(O_1; R_1)$ và $(O_2; R_2)$ tiếp xúc (trong hoặc ngoài) tại điểm $T$, phép vị tự tâm $T$ tỉ số $k = \\pm \\frac{R_2}{R_1}$ biến $(O_1)$ thành $(O_2)$, kéo theo mọi tính chất song song và đồng thẳng cực đẹp tại tiếp điểm.',
      formulaSection: {
        primaryFormula: 'V_{(T,\\ k)}: (O_1) \\to (O_2) \\implies \\text{Tiếp điểm } T,\\ \\text{cặp điểm tương ứng } A, B \\text{ thẳng hàng và } O_1A \\parallel O_2B',
        secondaryFormulas: [
          '\\text{Tâm vị tự ngoài } S: \\ \\frac{SO_1}{SO_2} = \\frac{R_1}{R_2} \\quad (\\text{giao 2 tiếp tuyến chung ngoài})',
          '\\text{Định lý Monge–D\'Alembert: } 3 \\text{ tâm vị tự ngoài của } 3 \\text{ đường tròn luôn thẳng hàng}'
        ],
        variablesNote:
          '• **Cấu hình Archimedes cực hay thi vào Chuyên**: Đường tròn $(I)$ tiếp xúc trong với $(O)$ tại $T$ và tiếp xúc dây $AB$ của $(O)$ tại $D$ $\\implies$ tia $TD$ **LUÔN ĐI QUA ĐIỂM CHÍNH GIỮA $M$ CUNG $AB$** (không chứa $T$), và $MA^2 = MD \\cdot MT$!\n• Cách chứng minh nhanh nhất chính là dùng phép vị tự tâm $T$ biến $(I)$ thành $(O)$!'
      },
      deepDiveSection:
        'Bổ đề đường thẳng đi qua điểm chính giữa cung dựa trên vị tự tâm $T$: tiếp tuyến tại $D$ của $(I)$ song song với tiếp tuyến tại $M$ của $(O)$ (vì cả hai đều song song dây $AB$), do đó ảnh của $D$ qua phép vị tự tâm $T$ bắt buộc phải là $M$ — lập tức suy ra $T, D, M$ thẳng hàng!',
      teacherExplanation: 'Thấy hai đường tròn tiếp xúc nhau tại $T$ kèm đường thẳng song song? Dùng ngay phép vị tự tâm $T$ để suy thẳng ra 3 điểm thẳng hàng!',
      keyTakeaway: 'Phép vị tự tâm tiếp xúc $T$ biến tiếp điểm song song này thành tiếp điểm song song kia, giúp chứng minh thẳng hàng trong 3 dòng.',
      miniQuiz: [
        {
          id: 'mchc-s3-q1',
          question: 'Cho hai đường tròn $(O; 8)$ và $(O\'; 3)$ tiếp xúc ngoài tại $T$. Một đường thẳng qua $T$ cắt $(O)$ tại $A$ và cắt $(O\')$ tại $B$. Biết $TA = 12$. Độ dài đoạn $TB$ bằng:',
          options: ['A. $4{,}5$', 'B. $4$', 'C. $3{,}5$', 'D. $6$'],
          correctIndex: 0,
          explanation: 'Theo phép vị tự tâm $T$ biến $(O)$ thành $(O\')$: $\\frac{TB}{TA} = \\frac{R\'}{R} = \\frac{3}{8} \\implies TB = 12 \\cdot \\frac{3}{8} = 4{,}5$.'
        },
        {
          id: 'mchc-s3-q2',
          question: 'Đường tròn $(I)$ tiếp xúc trong với $(O)$ tại $T$ và tiếp xúc với dây cung $AB$ của $(O)$ tại $D$. Tia $TD$ cắt $(O)$ tại $M$. Điểm $M$ có vị trí đặc biệt gì trên cung $AB$?',
          options: [
            'A. $M$ là điểm chính giữa cung $AB$ không chứa $T$',
            'B. $M$ là hình chiếu của $O$ lên $AB$',
            'C. $TM$ là đường kính của $(O)$',
            'D. $M$ trùng với trung điểm dây $AB$'
          ],
          correctIndex: 0,
          explanation: 'Phép vị tự tâm $T$ biến $(I)$ thành $(O)$ biến tiếp tuyến $AB$ tại $D$ thành tiếp tuyến song song $AB$ của $(O)$ tại $M$, suy ra $OM \\perp AB$ tại trung điểm $AB$, tức $M$ là điểm chính giữa cung $AB$.'
        }
      ],
      miniEssay: {
        id: 'mchc-s3-e1',
        question: 'Cho đường tròn $(I)$ tiếp xúc trong với $(O)$ tại $T$ và tiếp xúc với dây $AB$ của $(O)$ tại $D$. Tia $TD$ cắt $(O)$ tại $M$ ($M$ là điểm chính giữa cung $AB$). Chứng minh rằng $MA^2 = MD \\cdot MT$.',
        hint: 'Xét hai tam giác $\\triangle MAD$ và $\\triangle MTA$, chỉ ra $\\widehat{AMD}$ chung và $\\widehat{MAD} = \\widehat{MTA}$ (cùng chắn cung $MB = MA$!).',
        rubricChecklist: [
          'Từ $M$ là điểm chính giữa cung $AB$ suy ra $\\text{sđ}\\wideparen{MA} = \\text{sđ}\\wideparen{MB}$.',
          'Chỉ ra $\\widehat{MAD} = \\widehat{MAB}$ (chắn cung $MB$) $= \\widehat{MTA}$ (chắn cung $MA$).',
          'Chứng minh $\\triangle MAD \\sim \\triangle MTA$ (g.g) $\\implies \\frac{MA}{MT} = \\frac{MD}{MA} \\implies MA^2 = MD \\cdot MT$.'
        ],
        sampleAnswer:
          'Vì $M$ là điểm chính giữa cung $AB$ không chứa $T$ nên $\\wideparen{MA} = \\wideparen{MB}$. Xét $\\triangle MAD$ và $\\triangle MTA$ có góc $\\widehat{AMD}$ chung; lại có $\\widehat{MAD} = \\widehat{MAB}$ (góc nội tiếp chắn cung $MB$) và $\\widehat{MTA}$ (góc nội tiếp chắn cung $MA$), suy ra $\\widehat{MAD} = \\widehat{MTA}$. Do đó $\\triangle MAD \\sim \\triangle MTA$ (g.g) $\\implies \\frac{MA}{MT} = \\frac{MD}{MA} \\iff MA^2 = MD \\cdot MT$.'
      }
    }
  ]
};
