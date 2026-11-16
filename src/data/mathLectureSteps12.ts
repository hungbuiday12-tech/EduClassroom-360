import { LectureStep } from '../types';

export const MATH_CUSTOM_LECTURE_STEPS_12: Record<string, LectureStep[]> = {
  'math-12-3': [
    {
      stepTitle: '1. Mặt Nón & Hình Nón Tròn xoay: Đường sinh, Thiết diện qua Trục',
      stepType: 'concept',
      conceptSection:
        'Hình nón tròn xoay sinh bởi tam giác vuông $SOA$ quay quanh cạnh góc vuông $SO$ ($h = SO$, $r = OA$, $l = SA$). Thiết diện đi qua trục của hình nón luôn là một **tam giác cân** tại đỉnh $S$ có cạnh bên bằng $l$ và cạnh đáy bằng $2r$.',
      formulaSection: {
        primaryFormula: 'S_{xq} = \\pi r l, \\qquad V_{\\text{nón}} = \\frac{1}{3}\\pi r^2 h, \\qquad l^2 = r^2 + h^2',
        secondaryFormulas: [
          'S_{tp} = \\pi r l + \\pi r^2',
          '\\text{Thiết diện qua đỉnh } SAB: \\ S_{\\triangle SAB} = \\frac{1}{2}l^2\\sin\\widehat{ASB}, \\quad d(O, (SAB)) = \\frac{h\\cdot OM}{\\sqrt{h^2 + OM^2}}'
        ],
        variablesNote:
          '• **Cảnh giác đề thi THPT Quốc gia**: Cần phân biệt **thiết diện qua trục** (tam giác cân cạnh $l, l, 2r$) với **thiết diện qua đỉnh** tạo góc $\\alpha$ với đáy (tam giác cân $SAB$ với $SA = SB = l$ và khoảng cách từ $O$ đến $AB$ là $OM = \\sqrt{r^2 - (AB/2)^2}$).\n• Khối nón có đỉnh $S$ và thiết diện qua trục là tam giác đều cạnh $a$ thì $l = a$, $r = a/2$, $h = \\frac{a\\sqrt{3}}{2}$.'
      },
      deepDiveSection:
        'Khi cắt hình nón bởi mặt phẳng qua đỉnh $S$ tạo với đáy góc $60^\\circ$: gọi $M$ là trung điểm dây đáy $AB$, góc giữa $(SAB)$ và đáy là $\\widehat{SMO} = 60^\\circ$, từ đó tính được ngay $OM = h\\cot 60^\\circ$ và $AB = 2\\sqrt{r^2 - OM^2}$.',
      teacherExplanation: 'Thiết diện qua trục cho ngay $2r$ và $l$; thiết diện qua đỉnh $(SAB)$ luôn gắn với tam giác vuông $SOM$ tại $O$.',
      keyTakeaway: '$V_{\\text{nón}} = \\frac{1}{3}\\pi r^2 h$; phân biệt rõ thiết diện qua trục (đi qua $O$) và thiết diện qua đỉnh bất kỳ.',
      miniQuiz: [
        {
          id: 'm123-s1-q1',
          question: 'Một hình nón có thiết diện qua trục là tam giác đều cạnh $2a$. Thể tích của khối nón là:',
          options: [
            'A. $\\frac{\\pi a^3\\sqrt{3}}{3}$',
            'B. $\\pi a^3\\sqrt{3}$',
            'C. $\\frac{2\\pi a^3\\sqrt{3}}{3}$',
            'D. $\\frac{\\pi a^3}{3}$'
          ],
          correctIndex: 0,
          explanation: 'Đáy $2r = 2a \\implies r = a$. Đường cao tam giác đều $h = \\frac{2a\\sqrt{3}}{2} = a\\sqrt{3}$. Vậy $V = \\frac{1}{3}\\pi a^2 \\cdot a\\sqrt{3} = \\frac{\\pi a^3\\sqrt{3}}{3}$.'
        },
        {
          id: 'm123-s1-q2',
          question: 'Cắt hình nón đỉnh $S$ có $h = a\\sqrt{3}, r = 2a$ bằng một mặt phẳng qua trục. Diện tích thiết diện thu được bằng:',
          options: ['A. $2a^2\\sqrt{3}$', 'B. $4a^2\\sqrt{3}$', 'C. $a^2\\sqrt{3}$', 'D. $4a^2$'],
          correctIndex: 0,
          explanation: 'Thiết diện qua trục là tam giác cân có đáy $2r = 4a$ và đường cao $h = a\\sqrt{3}$, nên $S = \\frac{1}{2}\\cdot 4a \\cdot a\\sqrt{3} = 2a^2\\sqrt{3}$.'
        }
      ],
      miniEssay: {
        id: 'm123-s1-e1',
        question: 'Cho hình nón đỉnh $S$, chiều cao $h = a$, bán kính đáy $r = 2a$. Một mặt phẳng $(P)$ đi qua đỉnh $S$ cắt đường tròn đáy tại $A, B$ sao cho khoảng cách từ tâm $O$ của đáy đến $(P)$ bằng $\\frac{a\\sqrt{2}}{2}$. Tính diện tích thiết diện $\\triangle SAB$.',
        hint: 'Gọi $M$ là trung điểm $AB$, chứng minh $d(O, (SAB)) = OH$ trong $\\triangle SOM$ vuông tại $O$ để tìm $OM$, rồi tính $AB = 2\\sqrt{r^2 - OM^2}$ và $SM = \\sqrt{h^2 + OM^2}$.',
        rubricChecklist: [
          'Dựng $OM \\perp AB$ ($M$ là trung điểm $AB$), $OH \\perp SM \\implies OH = d(O, (P)) = \\frac{a\\sqrt{2}}{2}$.',
          'Dùng $\\frac{1}{OH^2} = \\frac{1}{SO^2} + \\frac{1}{OM^2} \\implies \\frac{2}{a^2} = \\frac{1}{a^2} + \\frac{1}{OM^2} \\implies OM = a$.',
          'Tính $AB = 2\\sqrt{4a^2 - a^2} = 2a\\sqrt{3}$, $SM = \\sqrt{a^2 + a^2} = a\\sqrt{2}$, suy ra $S_{\\triangle SAB} = a^2\\sqrt{6}$.'
        ],
        sampleAnswer:
          'Gọi $M$ là trung điểm $AB \\implies OM \\perp AB$, suy ra $AB \\perp (SOM)$. Kẻ $OH \\perp SM \\implies OH \\perp (SAB) \\implies OH = \\frac{a\\sqrt{2}}{2}$. Trong $\\triangle SOM$ vuông tại $O$: $\\frac{1}{OM^2} = \\frac{1}{OH^2} - \\frac{1}{SO^2} = \\frac{2}{a^2} - \\frac{1}{a^2} = \\frac{1}{a^2} \\implies OM = a$. Từ đó $SM = \\sqrt{SO^2 + OM^2} = a\\sqrt{2}$ và $AB = 2\\sqrt{r^2 - OM^2} = 2\\sqrt{4a^2 - a^2} = 2a\\sqrt{3}$. Vậy $S_{\\triangle SAB} = \\frac{1}{2}SM \\cdot AB = \\frac{1}{2}a\\sqrt{2}\\cdot 2a\\sqrt{3} = a^2\\sqrt{6}$.'
      }
    },
    {
      stepTitle: '2. Mặt Trụ & Hình Trụ Tròn xoay: Lăng trụ Nội tiếp & Thiết diện Song song Trục',
      stepType: 'derivation',
      conceptSection:
        'Hình trụ có độ dài đường sinh bằng đúng chiều cao ($l = h$). Thiết diện đi qua trục là hình chữ nhật kích thước $2r \\times h$; thiết diện song song với trục và cách trục khoảng $d < r$ là hình chữ nhật có chiều rộng bằng độ dài dây cung $2\\sqrt{r^2 - d^2}$ và chiều dài bằng $h$.',
      formulaSection: {
        primaryFormula: 'S_{xq} = 2\\pi r h, \\qquad S_{tp} = 2\\pi r h + 2\\pi r^2, \\qquad V_{\\text{trụ}} = \\pi r^2 h',
        secondaryFormulas: [
          '\\text{Thiết diện song song trục: } S = h \\cdot 2\\sqrt{r^2 - d^2}',
          '\\text{Khối lăng trụ đứng nội tiếp trụ: } h_{\\text{lăng trụ}} = h_{\\text{trụ}}, \\ r_{\\text{trụ}} = R_{\\text{ngoại tiếp đáy}}'
        ],
        variablesNote:
          '• **Cực kỳ chú ý**: Mặt trụ $S_{xq} = 2\\pi r h$ là trải phẳng thành hình chữ nhật $2\\pi r \\times h$, còn đường đi ngắn nhất trên mặt trụ nối hai điểm thường dùng phép **trải phẳng mặt xung quanh** rồi áp dụng định lý Pytago!\n• Hai góc tạo bởi đoạn thẳng $AB$ (với $A, B$ trên 2 đường tròn đáy) và trục hình trụ được tính nhanh qua hình chiếu $AB\'$ trên mặt đáy.'
      },
      deepDiveSection:
        'Một bài toán thực tế tối ưu kinh điển lớp 12: cần chế tạo lon nước ngọt hình trụ có thể tích $V$ cố định sao cho tốn **ít kim loại nhất** (tức $S_{tp}$ nhỏ nhất). Dùng Cô-si cho $S_{tp} = 2\\pi r^2 + \\pi r h + \\pi r h \\ge 3\\sqrt[3]{2\\pi^3 r^4 h^2}$, dấu "=" xảy ra khi $2\\pi r^2 = \\pi r h \\iff h = 2r$ (chiều cao bằng đúng đường kính đáy)!',
      teacherExplanation: 'Hộp trụ kín có thể tích cố định tốn ít vật liệu nhất khi $h = 2r$ (thiết diện qua trục là hình vuông).',
      keyTakeaway: 'Hình trụ có $l = h$; thiết diện song song trục cắt đáy theo dây cung $2\\sqrt{r^2 - d^2}$.',
      miniQuiz: [
        {
          id: 'm123-s2-q1',
          question: 'Cắt hình trụ bởi một mặt phẳng song song với trục và cách trục $3\\text{ cm}$, ta được thiết diện là một hình vuông có diện tích $64\\text{ cm}^2$. Thể tích khối trụ là:',
          options: ['A. $200\\pi\\text{ cm}^3$', 'B. $128\\pi\\text{ cm}^3$', 'C. $160\\pi\\text{ cm}^3$', 'D. $400\\pi\\text{ cm}^3$'],
          correctIndex: 0,
          explanation: 'Hình vuông diện tích $64 \\implies$ cạnh $h = 8\\text{ cm}$ và dây cung $AB = 8\\text{ cm}$. Bán kính đáy $r = \\sqrt{d^2 + (AB/2)^2} = \\sqrt{3^2 + 4^2} = 5\\text{ cm}$. Vậy $V = \\pi \\cdot 5^2 \\cdot 8 = 200\\pi\\text{ cm}^3$.'
        },
        {
          id: 'm123-s2-q2',
          question: 'Hình lập phương cạnh $a$ nội tiếp trong một hình trụ (hai đáy hình vuông nội tiếp hai đường tròn đáy trụ). Diện tích xung quanh hình trụ bằng:',
          options: ['A. $\\pi a^2\\sqrt{2}$', 'B. $2\\pi a^2$', 'C. $\\pi a^2$', 'D. $2\\pi a^2\\sqrt{2}$'],
          correctIndex: 0,
          explanation: 'Bán kính đáy $r = \\frac{a\\sqrt{2}}{2}$, chiều cao $h = a \\implies S_{xq} = 2\\pi \\frac{a\\sqrt{2}}{2}\\cdot a = \\pi a^2\\sqrt{2}$.'
        }
      ],
      miniEssay: {
        id: 'm123-s2-e1',
        question: 'Cho hình trụ có bán kính đáy $r = 5$ và chiều cao $h = 7$. Hai điểm $A, B$ lần lượt nằm trên hai đường tròn đáy sao cho khoảng cách giữa $AB$ và trục $OO\'$ của hình trụ bằng $3$. Tính độ dài đoạn $AB$.',
        hint: 'Hạ $AA\' \\perp$ đáy dưới ($AA\' = h = 7$). Khi đó $d(AB, OO\') = d(O\', A\'B) = 3$. Tính dây cung $A\'B = 2\\sqrt{r^2 - 3^2} = 8$, rồi Pytago trong $\\triangle AA\'B$.',
        rubricChecklist: [
          'Dựng đường sinh $AA\' = 7$ vuông góc đáy chứa $B$.',
          'Chỉ ra $d(AB, OO\') = d(O\', A\'B) = 3 \\implies A\'B = 2\\sqrt{5^2 - 3^2} = 8$.',
          'Tính $AB = \\sqrt{AA\'^2 + A\'B^2} = \\sqrt{49 + 64} = \\sqrt{113}$.'
        ],
        sampleAnswer:
          'Kẻ đường sinh $AA\'$ với $A\'$ thuộc đường tròn đáy $(O\')$ chứa $B$. Vì $OO\' \\parallel AA\'$ nên $OO\' \\parallel (AA\'B)$, suy ra $d(AB, OO\') = d(O\', (AA\'B)) = d(O\', A\'B) = 3$. Do đó dây cung $A\'B = 2\\sqrt{r^2 - 3^2} = 2\\sqrt{25 - 9} = 8$. Trong $\\triangle AA\'B$ vuông tại $A\'$: $AB = \\sqrt{AA\'^2 + A\'B^2} = \\sqrt{7^2 + 8^2} = \\sqrt{113}$.'
      }
    },
    {
      stepTitle: '3. Mặt Cầu Ngoại tiếp Hình Chóp – Lăng trụ (3 Mô hình Tính nhanh $R$)',
      stepType: 'example',
      conceptSection:
        'Tìm tâm và bán kính mặt cầu ngoại tiếp $R$ của một khối đa diện là câu phân loại quen thuộc trong Hình học Không gian. Thay vì đi tìm giao điểm các mặt trung trực phức tạp, ta dùng **3 công thức tính nhanh** cho 3 mô hình phổ biến nhất.',
      formulaSection: {
        primaryFormula: 'R_{\\text{cầu}} = \\sqrt{R_{\\text{đáy}}^2 + \\frac{h^2}{4}} \\quad (\\text{Hình có cạnh bên } \\perp \\text{ đáy})',
        secondaryFormulas: [
          '\\text{Hình chóp đều (cạnh bên } b, \\text{ cao } h): \\ R_{\\text{cầu}} = \\frac{b^2}{2h}',
          '\\text{Mặt bên } (SAB) \\perp \\text{ đáy}: \\ R_{\\text{cầu}} = \\sqrt{R_{\\text{mặt bên}}^2 + R_{\\text{đáy}}^2 - \\frac{AB^2}{4}}'
        ],
        variablesNote:
          '• **Mô hình 1 (cạnh bên $SA \\perp$ đáy hoặc Lăng trụ đứng)**: Tâm nằm trên trục đường tròn ngoại tiếp đáy cách đáy một đoạn $\\frac{h}{2} \\implies R = \\sqrt{R_{\\text{đáy}}^2 + (h/2)^2}$.\n• **Mô hình 2 (chóp đều $S.ABC$, $S.ABCD$)**: Dựa vào tam giác đồng dạng trên trục $SO \\implies R = \\frac{SA^2}{2SO}$.\n• **Mô hình 3 (mặt cầu cắt mặt phẳng $(P)$)**: Luôn thỏa mãn $R_{\\text{cầu}}^2 = d^2(I, (P)) + r_{\\text{đường tròn giao tuyến}}^2$.'
      },
      deepDiveSection:
        'Đặc biệt, nếu hình chóp có một tập hợp các đỉnh cùng nhìn một đoạn $AB$ dưới góc $90^\\circ$ (ví dụ $\\widehat{AMB} = \\widehat{ANB} = 90^\\circ$), thì tâm mặt cầu chính là **trung điểm của đoạn $AB$** và bán kính $R = \\frac{AB}{2}$ (tương tự đường tròn đường kính $AB$ trong hình phẳng!).',
      teacherExplanation: 'Nhớ 3 công thức bỏ túi: Cạnh bên $\\perp$ đáy $\\to \\sqrt{R_{\\text{đáy}}^2 + h^2/4}$; Chóp đều $\\to \\frac{b^2}{2h}$; Nhìn $AB$ góc $90^\\circ \\to R = \\frac{AB}{2}$.',
      keyTakeaway: 'Diện tích mặt cầu $4\\pi R^2$, thể tích $\\frac{4}{3}\\pi R^3$; áp dụng đúng 1 trong 3 công thức $R$ theo dáng hình chóp.',
      miniQuiz: [
        {
          id: 'm123-s3-q1',
          question: 'Cho hình chóp $S.ABC$ có $SA \\perp (ABC)$, $SA = 4$, đáy $ABC$ vuông tại $B$ với $AB = 3, BC = 4$ (nên $AC = 5$). Bán kính mặt cầu ngoại tiếp hình chóp là:',
          options: ['A. $\\frac{\\sqrt{41}}{2}$', 'B. $5$', 'C. $\\frac{\\sqrt{34}}{2}$', 'D. $\\sqrt{41}$'],
          correctIndex: 0,
          explanation: 'Vì $\\triangle ABC$ vuông tại $B$ nên $R_{\\text{đáy}} = \\frac{AC}{2} = \\frac{5}{2}$ (hoặc thấy $B, A, C$ cùng nhìn $SC$ dưới góc $90^\\circ \\implies R = \\frac{SC}{2}$). $SC = \\sqrt{SA^2 + AC^2} = \\sqrt{16 + 25} = \\sqrt{41} \\implies R = \\frac{\\sqrt{41}}{2}$.'
        },
        {
          id: 'm123-s3-q2',
          question: 'Mặt phẳng $(P)$ cách tâm $I$ của mặt cầu $S(I; 5)$ một khoảng $d = 3$ cắt mặt cầu theo đường tròn giao tuyến có bán kính $r$ bằng:',
          options: ['A. $4$', 'B. $2$', 'C. $3$', 'D. $\\sqrt{34}$'],
          correctIndex: 0,
          explanation: '$r = \\sqrt{R^2 - d^2} = \\sqrt{5^2 - 3^2} = 4$.'
        }
      ],
      miniEssay: {
        id: 'm123-s3-e1',
        question: 'Cho hình chóp tứ giác đều $S.ABCD$ có cạnh đáy bằng $a$ và cạnh bên cũng bằng $a$. Tính diện tích mặt cầu ngoại tiếp hình chóp $S.ABCD$.',
        hint: 'Tính đường cao $h = SO = \\sqrt{SA^2 - AO^2}$, sau đó dùng công thức chóp đều $R = \\frac{SA^2}{2h}$ rồi thay vào $S_{\\text{cầu}} = 4\\pi R^2$.',
        rubricChecklist: [
          'Tính $AO = \\frac{a\\sqrt{2}}{2} \\implies h = SO = \\sqrt{a^2 - \\frac{a^2}{2}} = \\frac{a\\sqrt{2}}{2}$.',
          'Tính bán kính mặt cầu $R = \\frac{a^2}{2 \\cdot \\frac{a\\sqrt{2}}{2}} = \\frac{a\\sqrt{2}}{2}$.',
          'Tính diện tích mặt cầu $S = 4\\pi R^2 = 4\\pi \\cdot \\frac{a^2}{2} = 2\\pi a^2$.'
        ],
        sampleAnswer:
          'Gọi $O = AC \\cap BD$. Ta có $AO = \\frac{AC}{2} = \\frac{a\\sqrt{2}}{2}$. Chiều cao chóp đều là $SO = \\sqrt{SA^2 - AO^2} = \\sqrt{a^2 - \\frac{a^2}{2}} = \\frac{a\\sqrt{2}}{2}$. Vì mặt cầu ngoại tiếp hình chóp đều có bán kính $R = \\frac{SA^2}{2SO} = \\frac{a^2}{a\\sqrt{2}} = \\frac{a\\sqrt{2}}{2}$ (cũng thấy ngay $O$ cách đều $S, A, B, C, D$ một khoảng $\\frac{a\\sqrt{2}}{2}$). Vậy $S_{\\text{cầu}} = 4\\pi R^2 = 2\\pi a^2$.'
      }
    }
  ],
  'math-12-4': [
    {
      stepTitle: '1. Phương trình Đường thẳng trong $Oxyz$ (Chính tắc & Tham số) · Tích Có hướng',
      stepType: 'concept',
      conceptSection:
        'Trong không gian $Oxyz$, đường thẳng $d$ đi qua $M_0(x_0; y_0; z_0)$ và nhận $\\vec{u} = (a; b; c)$ làm vectơ chỉ phương có phương trình tham số và (khi $abc \\neq 0$) phương trình chính tắc. **Tích có hướng $[\\vec{u}, \\vec{v}]$** là công cụ sinh vectơ vuông góc chung với cả $\\vec{u}$ và $\\vec{v}$.',
      formulaSection: {
        primaryFormula: '\\frac{x - x_0}{a} = \\frac{y - y_0}{b} = \\frac{z - z_0}{c}, \\qquad \\begin{cases} x = x_0 + at \\\\ y = y_0 + bt \\\\ z = z_0 + ct \\end{cases}',
        secondaryFormulas: [
          '[\\vec{u}, \\vec{v}] = \\left(u_2v_3 - u_3v_2;\\ u_3v_1 - u_1v_3;\\ u_1v_2 - u_2v_1\\right)',
          'd \\perp (P) \\implies \\vec{u}_d = \\vec{n}_{(P)}; \\qquad d = (P) \\cap (Q) \\implies \\vec{u}_d = [\\vec{n}_P, \\vec{n}_Q]'
        ],
        variablesNote:
          '• **Kỹ thuật Tham số hóa điểm $M \\in d$**: Mọi điểm $M$ nằm trên $d$ đều viết gọn được theo **1 ẩn $t$ duy nhất**: $M(x_0 + at;\\ y_0 + bt;\\ z_0 + ct)$!\n• Khi đọc phương trình chính tắc $\\frac{x - 1}{2} = \\frac{y + 3}{-1} = \\frac{z}{4}$, nhớ đổi dấu ở tử số để lấy điểm đi qua $M_0(1; -3; 0)$, và mẫu số là $\\vec{u} = (2; -1; 4)$.'
      },
      deepDiveSection:
        'Bất kỳ bài toán tìm hình chiếu vuông góc $H$ của $A$ lên đường thẳng $d$, hay tìm giao điểm $d \\cap (P)$, hay đường vuông góc chung của hai đường chéo nhau đều giải trong 3 bước nhờ **tham số hóa**: đặt $H(x_0+at; y_0+bt; z_0+ct) \\in d$, giải phương trình 1 ẩn $t$ từ $\\overrightarrow{AH}\\cdot\\vec{u}_d = 0$ (hoặc thay vào phương trình $(P)$).',
      teacherExplanation: 'Tham số hóa điểm trên đường thẳng về 1 biến $t$ giúp giải mọi bài tìm hình chiếu, giao điểm và điểm cách đều cực nhẹ!',
      keyTakeaway: 'Giao tuyến của $(P), (Q)$ có VTCP là tích có hướng $[\\vec{n}_P, \\vec{n}_Q]$; điểm trên $d$ tham số hóa thành 1 ẩn $t$.',
      miniQuiz: [
        {
          id: 'm124-s1-q1',
          question: 'Đường thẳng $d: \\frac{x - 2}{3} = \\frac{y + 1}{-2} = \\frac{z - 4}{1}$ đi qua điểm nào sau đây?',
          options: ['A. $(5; -3; 5)$', 'B. $(-2; 1; -4)$', 'C. $(3; -2; 1)$', 'D. $(2; 1; 4)$'],
          correctIndex: 0,
          explanation: 'Điểm cơ sở là $(2; -1; 4)$, ứng $t = 1$ cho điểm $(2+3; -1-2; 4+1) = (5; -3; 5)$.'
        },
        {
          id: 'm124-s1-q2',
          question: 'Đường thẳng đi qua $A(1; 0; -2)$ và vuông góc với mặt phẳng $(P): 2x - y + 3z - 5 = 0$ có phương trình tham số là:',
          options: [
            'A. $x = 1 + 2t,\\ y = -t,\\ z = -2 + 3t$',
            'B. $x = 2 + t,\\ y = -1,\\ z = 3 - 2t$',
            'C. $x = 1 + 2t,\\ y = t,\\ z = -2 + 3t$',
            'D. $x = 1 + t,\\ y = -y,\\ z = -2 + 3t$'
          ],
          correctIndex: 0,
          explanation: 'Vì $d \\perp (P)$ nên $d$ nhận $\\vec{n}_P = (2; -1; 3)$ làm VTCP.'
        }
      ],
      miniEssay: {
        id: 'm124-s1-e1',
        question: 'Trong $Oxyz$, tìm tọa độ hình chiếu vuông góc $H$ của điểm $A(1; 2; -1)$ lên đường thẳng $d: \\frac{x - 1}{2} = \\frac{y}{1} = \\frac{z + 2}{-1}$.',
        hint: 'Tham số hóa $H(1 + 2t; t; -2 - t) \\in d$, tính $\\overrightarrow{AH}$ và giải phương trình $\\overrightarrow{AH}\\cdot\\vec{u}_d = 0$.',
        rubricChecklist: [
          'Tham số hóa đúng $H(1 + 2t; t; -2 - t)$ và tính $\\overrightarrow{AH} = (2t; t - 2; -t - 1)$.',
          'Giải $\\overrightarrow{AH}\\cdot\\vec{u}_d = 2(2t) + 1(t - 2) - 1(-t - 1) = 0 \\iff 6t - 1 = 0 \\iff t = \\frac{1}{6}$.',
          'Thay $t = \\frac{1}{6}$ tìm đúng $H\\left(\\frac{4}{3};\\ \\frac{1}{6};\\ -\\frac{13}{6}\\right)$.'
        ],
        sampleAnswer:
          'Đường thẳng $d$ có VTCP $\\vec{u} = (2; 1; -1)$. Vì $H \\in d$ nên $H(1 + 2t; t; -2 - t)$, suy ra $\\overrightarrow{AH} = (2t; t - 2; -1 - t)$. Vì $AH \\perp d$ nên $\\overrightarrow{AH}\\cdot\\vec{u} = 0 \\iff 4t + (t - 2) + (1 + t) = 0 \\iff 6t - 1 = 0 \\iff t = \\frac{1}{6}$. Thay vào tọa độ $H$ được $H\\left(\\frac{4}{3};\\ \\frac{1}{6};\\ -\\frac{13}{6}\\right)$.'
      }
    },
    {
      stepTitle: '2. Góc trong $Oxyz$ (Đường–Đường, Đường–Mặt, Mặt–Mặt)',
      stepType: 'derivation',
      conceptSection:
        'Trong tọa độ $Oxyz$, mọi góc hình học đều quy về tích vô hướng giữa hai vectơ đặc trưng ($\vec{u}$ cho đường thẳng, $\\vec{n}$ cho mặt phẳng). Bí quyết không bao giờ nhầm $\\sin$ và $\\cos$ là kiểm tra xem hai đối tượng có **CÙNG LOẠI** hay **KHÁC LOẠI**.',
      formulaSection: {
        primaryFormula: '\\cos(d_1, d_2) = \\frac{|\\vec{u}_1 \\cdot \\vec{u}_2|}{|\\vec{u}_1||\\vec{u}_2|}, \\qquad \\sin(d, (P)) = \\frac{|\\vec{u}_d \\cdot \\vec{n}_P|}{|\\vec{u}_d||\\vec{n}_P|}',
        secondaryFormulas: [
          '\\cos((P), (Q)) = \\frac{|\\vec{n}_P \\cdot \\vec{n}_Q|}{|\\vec{n}_P||\\vec{n}_Q|}',
          '0^\\circ \\le \\alpha \\le 90^\\circ \\implies \\text{LUÔN CÓ TRỊ TUYỆT ĐỐI ở tử số!}'
        ],
        variablesNote:
          '• **Quy tắc Vàng "Cùng $\\cos$ – Khác $\\sin$"**:\n  - Đường với Đường (cùng loại) $\\implies$ dùng **$\\cos$**.\n  - Mặt với Mặt (cùng loại) $\\implies$ dùng **$\\cos$**.\n  - Đường với Mặt (khác loại, vì $\\vec{n}_P \\perp (P)$!) $\\implies$ dùng **$\\sin$**!'
      },
      deepDiveSection:
        'Rất nhiều thí sinh mất điểm oan khi tính góc giữa đường thẳng $d$ và mặt phẳng $(P)$ vì bấm $\\arccos$ thay vì $\\arcsin$! Hãy nhớ: $\\vec{u}_d$ chạy theo đường, còn $\\vec{n}_P$ dựng đứng vuông góc mặt, nên góc giữa 2 vectơ đó là góc phụ $90^\\circ - \\varphi$, dẫn đến $\\sin\\varphi = |\\cos(\\vec{u}_d, \\vec{n}_P)|$.',
      teacherExplanation: 'Nhớ câu thần chú 4 chữ: "Cùng Cos – Khác Sin" và luôn đặt trị tuyệt đối trên tử số!',
      keyTakeaway: 'Góc đường–đường và mặt–mặt dùng $\\cos$; góc đường–mặt dùng $\\sin = \\frac{|\\vec{u}\\cdot\\vec{n}|}{|\\vec{u}||\\vec{n}|}$.',
      miniQuiz: [
        {
          id: 'm124-s2-q1',
          question: 'Tính góc giữa đường thẳng $d$ có vectơ chỉ phương $\\vec{u} = (1; 1; 0)$ và mặt phẳng $(P): x + z - 5 = 0$.',
          options: ['A. $30^\\circ$', 'B. $60^\\circ$', 'C. $45^\\circ$', 'D. $90^\\circ$'],
          correctIndex: 0,
          explanation: '$\\sin\\varphi = \\frac{|1\\cdot 1 + 1\\cdot 0 + 0\\cdot 1|}{\\sqrt{2}\\cdot\\sqrt{2}} = \\frac{1}{2} \\implies \\varphi = 30^\\circ$.'
        },
        {
          id: 'm124-s2-q2',
          question: 'Góc giữa hai mặt phẳng $(P): x + y - 1 = 0$ và $(Q): y + z + 2 = 0$ bằng:',
          options: ['A. $60^\\circ$', 'B. $30^\\circ$', 'C. $45^\\circ$', 'D. $90^\\circ$'],
          correctIndex: 0,
          explanation: '$\\vec{n}_P = (1; 1; 0)$, $\\vec{n}_Q = (0; 1; 1)$. $\\cos\\alpha = \\frac{|0 + 1 + 0|}{\\sqrt{2}\\cdot\\sqrt{2}} = \\frac{1}{2} \\implies \\alpha = 60^\\circ$.'
        }
      ],
      miniEssay: {
        id: 'm124-s2-e1',
        question: 'Trong $Oxyz$, tìm tham số $m > 0$ sao cho góc giữa hai đường thẳng $d_1: \\frac{x}{1} = \\frac{y - 1}{2} = \\frac{z + 2}{-1}$ và $d_2$ có vectơ chỉ phương $\\vec{u}_2 = (1; m; 0)$ bằng $60^\\circ$.',
        hint: 'Áp dụng $\\cos 60^\\circ = \\frac{1}{2} = \\frac{|1 + 2m|}{\\sqrt{6}\\cdot\\sqrt{1 + m^2}}$, bình phương hai vế tìm $m > 0$.',
        rubricChecklist: [
          'Lập phương trình $\\frac{|1 + 2m|}{\\sqrt{6(1 + m^2)}} = \\frac{1}{2}$.',
          'Bình phương khử mẫu: $4(4m^2 + 4m + 1) = 6(1 + m^2) \\iff 10m^2 + 16m - 2 = 0 \\iff 5m^2 + 8m - 1 = 0$.',
          'Giải lấy nghiệm dương $m = \\frac{-4 + \\sqrt{21}}{5}$.'
        ],
        sampleAnswer:
          'Đường thẳng $d_1$ có VTCP $\\vec{u}_1 = (1; 2; -1)$. Ta có $\\cos 60^\\circ = \\frac{|\\vec{u}_1 \\cdot \\vec{u}_2|}{|\\vec{u}_1||\\vec{u}_2|} \\iff \\frac{|1 + 2m|}{\\sqrt{6}\\cdot\\sqrt{1 + m^2}} = \\frac{1}{2}$. Bình phương hai vế: $4(1 + 2m)^2 = 6(1 + m^2) \\iff 16m^2 + 16m + 4 = 6 + 6m^2 \\iff 5m^2 + 8m - 1 = 0$. Do $m > 0$ nên $m = \\frac{-4 + \\sqrt{21}}{5}$.'
      }
    },
    {
      stepTitle: '3. Ba Công thức Khoảng cách trong $Oxyz$ & Vị trí Tương đối Hai Đường thẳng',
      stepType: 'example',
      conceptSection:
        'Ưu điểm lớn nhất của $Oxyz$ là mọi khoảng cách không gian phức tạp đều thu gọn thành vài dòng bấm tích có hướng: khoảng cách từ điểm tới mặt phẳng, từ điểm tới đường thẳng và khoảng cách giữa hai đường thẳng chéo nhau.',
      formulaSection: {
        primaryFormula: 'd(M, d) = \\frac{|[\\overrightarrow{AM}, \\vec{u}_d]|}{|\\vec{u}_d|}, \\qquad d(d_1, d_2) = \\frac{|[\\vec{u}_1, \\vec{u}_2] \\cdot \\overrightarrow{M_1 M_2}|}{|[\\vec{u}_1, \\vec{u}_2]|}',
        secondaryFormulas: [
          'd(M_0, (P)) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}',
          'd_1, d_2 \\text{ chéo nhau} \\iff [\\vec{u}_1, \\vec{u}_2] \\cdot \\overrightarrow{M_1 M_2} \\neq 0'
        ],
        variablesNote:
          '• **Mẹo nhớ khoảng cách từ $M$ tới đường thẳng $d$** (qua $A$, có VTCP $\\vec{u}$): độ dài **TÍCH CÓ HƯỚNG** $|[\\overrightarrow{AM}, \\vec{u}]|$ chia cho độ dài **$|\\vec{u}|$**.\n• **Tích hỗn tạp $[\\vec{u}_1, \\vec{u}_2] \\cdot \\overrightarrow{M_1 M_2}$**: Nếu $= 0$ thì $2$ đường đồng phẳng (cắt hoặc song song); nếu $\\neq 0$ thì $2$ đường chéo nhau!'
      },
      deepDiveSection:
        'Nhiều bài toán hình học không gian cổ điển khó (tính khoảng cách giữa $SB$ và $AC$ trong hình chóp lệch) nếu đặt hệ trục tọa độ $Oxyz$ vào các cạnh vuông góc ở đáy rồi dùng công thức $d(d_1, d_2) = \\frac{|[\\vec{u}_1, \\vec{u}_2]\\cdot\\overrightarrow{M_1 M_2}|}{|[\\vec{u}_1, \\vec{u}_2]|}$ sẽ cho kết quả chính xác 100% chỉ sau 1 phút!',
      teacherExplanation: 'Gặp bài hình không gian có sẵn 3 tia đôi một vuông góc tại $A$, hãy gắn ngay hệ trục $Oxyz$ để dùng công thức tích có hướng!',
      keyTakeaway: '$d(M, d) = \\frac{|[\\overrightarrow{AM}, \\vec{u}]|}{|\\vec{u}|}$; khoảng cách hai đường chéo nhau là $|[\\vec{u}_1, \\vec{u}_2] \\cdot \\overrightarrow{M_1M_2}| / |[\\vec{u}_1, \\vec{u}_2]|$.',
      miniQuiz: [
        {
          id: 'm124-s3-q1',
          question: 'Trong $Oxyz$, khoảng cách từ điểm $M(1; 2; 3)$ đến đường thẳng $d$ đi qua $A(1; 0; 1)$ với VTCP $\\vec{u} = (0; 1; 1)$ là:',
          options: ['A. $0$', 'B. $\\sqrt{2}$', 'C. $2$', 'D. $1$'],
          correctIndex: 0,
          explanation: '$\\overrightarrow{AM} = (0; 2; 2) = 2\\vec{u} \\implies M$ nằm ngay trên đường thẳng $d$, nên khoảng cách bằng $0$!'
        },
        {
          id: 'm124-s3-q2',
          question: 'Khoảng cách giữa hai mặt phẳng song song $(P): 2x - y + 2z - 3 = 0$ và $(Q): 2x - y + 2z + 6 = 0$ là:',
          options: ['A. $3$', 'B. $9$', 'C. $1$', 'D. $\\frac{3}{2}$'],
          correctIndex: 0,
          explanation: '$d = \\frac{|-3 - 6|}{\\sqrt{2^2 + (-1)^2 + 2^2}} = \\frac{9}{3} = 3$.'
        }
      ],
      miniEssay: {
        id: 'm124-s3-e1',
        question: 'Tính khoảng cách giữa hai đường thẳng chéo nhau $d_1: \\frac{x - 1}{1} = \\frac{y}{1} = \\frac{z}{0}$ (qua $M_1(1; 0; 0)$, $\\vec{u}_1 = (1; 1; 0)$) và $d_2$ qua $M_2(0; 0; 2)$ có VTCP $\\vec{u}_2 = (0; 1; 1)$.',
        hint: 'Tính tích có hướng $[\\vec{u}_1, \\vec{u}_2] = (1; -1; 1)$, lấy $\\overrightarrow{M_1 M_2} = (-1; 0; 2)$ rồi áp dụng công thức khoảng cách.',
        rubricChecklist: [
          'Tính đúng $[\\vec{u}_1, \\vec{u}_2] = (1; -1; 1)$ và $|[\\vec{u}_1, \\vec{u}_2]| = \\sqrt{3}$.',
          'Tính tích vô hướng $[\\vec{u}_1, \\vec{u}_2] \\cdot \\overrightarrow{M_1 M_2} = 1(-1) + (-1)\\cdot 0 + 1\\cdot 2 = 1$.',
          'Kết luận $d(d_1, d_2) = \\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$.'
        ],
        sampleAnswer:
          'Ta có $M_1(1; 0; 0), \\vec{u}_1 = (1; 1; 0)$ và $M_2(0; 0; 2), \\vec{u}_2 = (0; 1; 1)$. Tích có hướng $[\\vec{u}_1, \\vec{u}_2] = (1; -1; 1) \\implies |[\\vec{u}_1, \\vec{u}_2]| = \\sqrt{3}$. Lại có $\\overrightarrow{M_1 M_2} = (-1; 0; 2)$, nên $[\\vec{u}_1, \\vec{u}_2] \\cdot \\overrightarrow{M_1 M_2} = -1 + 0 + 2 = 1$. Vậy $d(d_1, d_2) = \\frac{|1|}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$.'
      }
    }
  ],
  'math-12-5': [
    {
      stepTitle: '1. Xác suất Có điều kiện $P(A \\mid B)$ & Công thức Nhân tổng quát (CT Mới 12)',
      stepType: 'concept',
      conceptSection:
        'Xác suất của biến cố $A$ **với điều kiện biến cố $B$ đã xảy ra** ký hiệu là $P(A \\mid B)$. Khi biết $B$ đã xảy ra, không gian mẫu bị thu hẹp chỉ còn lại tập hợp $B$, nên ta lấy phần giao $AB$ chia cho $B$.',
      formulaSection: {
        primaryFormula: 'P(A \\mid B) = \\frac{P(AB)}{P(B)} = \\frac{n(AB)}{n(B)} \\quad (P(B) > 0)',
        secondaryFormulas: [
          'P(AB) = P(B) \\cdot P(A \\mid B) = P(A) \\cdot P(B \\mid A)',
          'P(\\overline{A} \\mid B) = 1 - P(A \\mid B)'
        ],
        variablesNote:
          '• **Phân biệt $P(A \\mid B)$ và $P(B \\mid A)$**: Rất dễ nhầm điều kiện đứng sau gạch đứng $|$! Hãy nhớ: biến cố đứng **SAU** dấu `$|$` là **điều kiện đã biết chắc chắn xảy ra** (nằm ở **MẪU SỐ**!).\n• Nếu $A$ và $B$ độc lập thì $P(A \\mid B) = P(A)$.'
      },
      deepDiveSection:
        'Trong các bài toán bảng số liệu 2 chiều (nam/nữ và đạt/chưa đạt) hoặc bài rút bóng lần 2 không hoàn lại: khi câu hỏi bắt đầu bằng *"Biết rằng bạn được chọn là nữ, tính xác suất để bạn đó..."*, mẫu số không phải tổng cả lớp mà chỉ là **tổng số học sinh nữ**!',
      teacherExplanation: 'Cái gì đứng SAU dấu gạch $|$ ("biết rằng...") thì đặt xuống MẪU SỐ!',
      keyTakeaway: '$P(A \\mid B) = \\frac{P(AB)}{P(B)}$; $B$ là điều kiện đã biết nên nằm dưới mẫu số.',
      miniQuiz: [
        {
          id: 'm125-s1-q1',
          question: 'Cho $P(B) = 0{,}6$ và $P(AB) = 0{,}24$. Xác suất có điều kiện $P(A \\mid B)$ bằng:',
          options: ['A. $0{,}4$', 'B. $0{,}144$', 'C. $0{,}6$', 'D. $0{,}36$'],
          correctIndex: 0,
          explanation: '$P(A \\mid B) = \\frac{P(AB)}{P(B)} = \\frac{0{,}24}{0{,}6} = 0{,}4$.'
        },
        {
          id: 'm125-s1-q2',
          question: 'Một lớp có $20$ nam ($12$ bạn cận thị) và $25$ nữ ($10$ bạn cận thị). Chọn ngẫu nhiên $1$ học sinh. Biết rằng học sinh được chọn **bị cận thị**, xác suất để học sinh đó là **nam** bằng:',
          options: ['A. $\\frac{6}{11}$', 'B. $\\frac{12}{20}$', 'C. $\\frac{12}{45}$', 'D. $\\frac{10}{22}$'],
          correctIndex: 0,
          explanation: 'Tổng số học sinh cận thị là $12 + 10 = 22$ (mẫu số thu hẹp!). Số nam cận thị là $12 \\implies P = \\frac{12}{22} = \\frac{6}{11}$.'
        }
      ],
      miniEssay: {
        id: 'm125-s1-e1',
        question: 'Một hộp có $6$ bi đỏ và $4$ bi xanh. Lần lượt lấy ngẫu nhiên $2$ viên bi **không hoàn lại**. Tính xác suất để viên bi lấy ở lần thứ $2$ màu xanh, biết rằng viên bi lấy ở lần thứ nhất màu đỏ.',
        hint: 'Sau khi lấy 1 bi đỏ không hoàn lại, trong hộp chỉ còn $9$ bi ($5$ đỏ, $4$ xanh).',
        rubricChecklist: [
          'Gọi $A$: lần 2 lấy bi xanh; $B$: lần 1 lấy bi đỏ.',
          'Lập luận khi $B$ đã xảy ra, trong hộp còn $5$ bi đỏ và $4$ bi xanh (tổng $9$ bi).',
          'Tính đúng $P(A \\mid B) = \\frac{4}{9}$.'
        ],
        sampleAnswer:
          'Gọi $B$ là biến cố "lần 1 lấy được bi đỏ" và $A$ là biến cố "lần 2 lấy được bi xanh". Khi biến cố $B$ đã xảy ra (lấy 1 bi đỏ bỏ ra ngoài), trong hộp còn lại $5$ bi đỏ và $4$ bi xanh, tổng cộng $9$ viên bi. Do đó xác suất lần 2 lấy được bi xanh là $P(A \\mid B) = \\frac{4}{9}$.'
      }
    },
    {
      stepTitle: '2. Công thức Xác suất Toàn phần (Tổng xác suất theo Sơ đồ Cây)',
      stepType: 'derivation',
      conceptSection:
        'Khi một biến cố $A$ xảy ra thông qua nhiều "con đường" phân nhánh rời nhau ($B$ xảy ra hoặc $\\overline{B}$ xảy ra), ta tính xác suất toàn phần của $A$ bằng tổng xác suất trên mọi nhánh dẫn đến $A$ trên sơ đồ hình cây.',
      formulaSection: {
        primaryFormula: 'P(A) = P(B)\\cdot P(A \\mid B) + P(\\overline{B})\\cdot P(A \\mid \\overline{B})',
        secondaryFormulas: [
          '\\text{Tổng quát với } n \\text{ nhánh phân hoạch } B_1..B_n: \\ P(A) = \\sum_{i=1}^{n} P(B_i)P(A \\mid B_i)',
          'P(B) + P(\\overline{B}) = 1'
        ],
        variablesNote:
          '• **Sơ đồ cây 2 tầng siêu dễ nhớ**: Tầng 1 chia nhánh chọn nguồn ($B$ hay $\\overline{B}$, ví dụ chọn lô hàng I hay lô II, mắc bệnh hay không bệnh). Tầng 2 từ mỗi nhánh rẽ ra kết quả $A$ hay $\\overline{A}$. Muốn tính $P(A)$, nhân dọc từng nhánh dẫn tới $A$ rồi cộng lại!'
      },
      deepDiveSection:
        'Dấu hiệu nhận biết bài toán Xác suất toàn phần trong đề thi CT Mới 12: đề cho $2$ nhà máy / $2$ hộp bi / $2$ nhóm người với tỉ lệ chọn khác nhau và tỉ lệ phế phẩm / kết quả dương tính ở mỗi nhóm khác nhau, rồi hỏi xác suất chung của một sản phẩm lấy ngẫu nhiên.',
      teacherExplanation: 'Vẽ nhanh sơ đồ cây 2 tầng: nhân dọc theo nhánh, cộng ngang các nhánh cho ra cùng kết quả $A$!',
      keyTakeaway: '$P(A) = P(B)P(A\\mid B) + P(\\overline{B})P(A\\mid \\overline{B})$ — luôn kiểm tra tổng xác suất tầng 1 bằng $1$.',
      miniQuiz: [
        {
          id: 'm125-s2-q1',
          question: 'Xưởng I sản xuất $60\\%$ sản phẩm (tỉ lệ lỗi $2\\%$), xưởng II sản xuất $40\\%$ sản phẩm (tỉ lệ lỗi $5\\%$). Lấy ngẫu nhiên $1$ sản phẩm. Xác suất để sản phẩm đó **bị lỗi** là:',
          options: ['A. $0{,}032$', 'B. $0{,}07$', 'C. $0{,}035$', 'D. $0{,}024$'],
          correctIndex: 0,
          explanation: '$P(A) = 0{,}6 \\cdot 0{,}02 + 0{,}4 \\cdot 0{,}05 = 0{,}012 + 0{,}020 = 0{,}032$.'
        },
        {
          id: 'm125-s2-q2',
          question: 'Có $2$ hộp bi: Hộp I có $3$ đỏ, $2$ xanh; Hộp II có $4$ đỏ, $6$ xanh. Chọn ngẫu nhiên $1$ hộp (đồng khả năng) rồi lấy $1$ bi. Xác suất lấy được bi đỏ là:',
          options: ['A. $0{,}5$', 'B. $0{,}7$', 'C. $0{,}6$', 'D. $0{,}4$'],
          correctIndex: 0,
          explanation: '$P(Đ) = \\frac{1}{2}\\cdot\\frac{3}{5} + \\frac{1}{2}\\cdot\\frac{4}{10} = 0{,}3 + 0{,}2 = 0{,}5$.'
        }
      ],
      miniEssay: {
        id: 'm125-s2-e1',
        question: 'Trong một đợt kiểm tra y tế, $5\\%$ dân số mắc bệnh X. Một xét nghiệm cho kết quả dương tính đúng $90\\%$ đối với người mắc bệnh, và cho dương tính giả $4\\%$ đối với người không mắc bệnh. Chọn ngẫu nhiên $1$ người đi xét nghiệm, tính xác suất người đó có kết quả **dương tính**.',
        hint: 'Gọi $B$: người mắc bệnh ($P(B) = 0{,}05$), $\\overline{B}$: không mắc bệnh ($0{,}95$), $D$: dương tính. Dùng công thức xác suất toàn phần.',
        rubricChecklist: [
          'Xác định đúng $P(B) = 0{,}05$, $P(\\overline{B}) = 0{,}95$, $P(D \\mid B) = 0{,}90$, $P(D \\mid \\overline{B}) = 0{,}04$.',
          'Áp dụng công thức xác suất toàn phần $P(D) = 0{,}05\\cdot 0{,}90 + 0{,}95\\cdot 0{,}04$.',
          'Tính chính xác $P(D) = 0{,}045 + 0{,}038 = 0{,}083$ ($8{,}3\\%$).'
        ],
        sampleAnswer:
          'Gọi $B$ là biến cố "người được chọn mắc bệnh X" ($P(B) = 0{,}05 \\implies P(\\overline{B}) = 0{,}95$), và $D$ là biến cố "kết quả xét nghiệm dương tính". Ta có $P(D \\mid B) = 0{,}90$ và $P(D \\mid \\overline{B}) = 0{,}04$. Theo công thức xác suất toàn phần: $P(D) = 0{,}05 \\cdot 0{,}90 + 0{,}95 \\cdot 0{,}04 = 0{,}045 + 0{,}038 = 0{,}083$.'
      }
    },
    {
      stepTitle: '3. Công thức Bayes (Suy luận Ngược từ Kết quả về Nguyên nhân)',
      stepType: 'example',
      conceptSection:
        'Nếu công thức xác suất toàn phần đi xuôi từ nguyên nhân $B$ ra kết quả $A$, thì **Công thức Bayes** đi ngược lại: đã biết kết quả $A$ xảy ra (ví dụ sản phẩm lấy ra bị lỗi, hoặc xét nghiệm ra dương tính), hỏi xác suất nó xuất phát từ nguyên nhân $B$ là bao nhiêu?',
      formulaSection: {
        primaryFormula: 'P(B \\mid A) = \\frac{P(B) \\cdot P(A \\mid B)}{P(A)} = \\frac{P(B)\\cdot P(A \\mid B)}{P(B)P(A \\mid B) + P(\\overline{B})P(A \\mid \\overline{B})}',
        secondaryFormulas: [
          'P(B_i \\mid A) = \\frac{\\text{Nhánh } B_i \\to A}{\\text{Tổng tất cả các nhánh } \\to A}',
          '\\text{Kiểm tra nhanh: } \\sum P(B_i \\mid A) = 1'
        ],
        variablesNote:
          '• **Cách nhớ Công thức Bayes trong 3 giây theo sơ đồ cây**:\n  Tử số = **giá trị của đúng nhánh $B$ cần hỏi**; Mẫu số = **tổng các nhánh dẫn tới $A$** (chính là $P(A)$ vừa tính ở bước Toàn phần!).'
      },
      deepDiveSection:
        'Một nghịch lý y học nổi tiếng từ công thức Bayes: với bệnh hiếm ($P(B) = 1\\%$), dù bộ test chính xác $99\\%$, nếu một người có kết quả dương tính, xác suất thực sự mắc bệnh chỉ khoảng $50\\%$ vì số người khỏe mạnh quá đông nên $1\\%$ dương tính giả vẫn lớn ngang $99\\%$ của $1\\%$ người bệnh!',
      teacherExplanation: 'Bài Bayes luôn gồm 2 nhịp: tính tổng $P(A)$ ở mẫu bằng Toàn phần, rồi lấy đúng 1 nhánh ở tử chia cho $P(A)$!',
      keyTakeaway: 'Bayes $P(B \\mid A) = \\frac{\\text{Nhánh } B \\cap A}{\\text{Tổng } P(A)}$ — chuyên dùng để suy ngược từ kết quả về nguồn gốc.',
      miniQuiz: [
        {
          id: 'm125-s3-q1',
          question: 'Từ dữ kiện xưởng I ($60\\%$, lỗi $2\\%$) và xưởng II ($40\\%$, lỗi $5\\%$), biết sản phẩm lấy ra **bị lỗi**. Xác suất để sản phẩm đó do **xưởng I** sản xuất là:',
          options: ['A. $\\frac{3}{8}$', 'B. $\\frac{5}{8}$', 'C. $0{,}012$', 'D. $0{,}6$'],
          correctIndex: 0,
          explanation: 'Tổng xác suất lỗi $P(A) = 0{,}032$. Nhánh xưởng I lỗi là $0{,}6 \\cdot 0{,}02 = 0{,}012$. Vậy $P(I \\mid A) = \\frac{0{,}012}{0{,}032} = \\frac{12}{32} = \\frac{3}{8}$.'
        },
        {
          id: 'm125-s3-q2',
          question: 'Khi áp dụng công thức Bayes $P(B \\mid A) = \\frac{P(B)P(A \\mid B)}{P(A)}$, mẫu số $P(A)$ được tính bằng công thức nào?',
          options: [
            'A. Công thức xác suất toàn phần',
            'B. Công thức Bernoulli',
            'C. Tích $P(A)\\cdot P(B)$',
            'D. $1 - P(B)$'
          ],
          correctIndex: 0,
          explanation: 'Mẫu số $P(A)$ luôn được tính theo công thức xác suất toàn phần.'
        }
      ],
      miniEssay: {
        id: 'm125-s3-e1',
        question: 'Có 2 thùng táo: Thùng I có $7$ quả ngon, $3$ quả hỏng; Thùng II có $4$ quả ngon, $6$ quả hỏng. Chọn ngẫu nhiên $1$ thùng (xác suất như nhau) rồi lấy $1$ quả thấy đó là **quả táo ngon**. Tính xác suất quả táo đó được lấy từ Thùng I.',
        hint: 'Tính $P(\\text{Ngon}) = 0{,}5\\cdot 0{,}7 + 0{,}5\\cdot 0{,}4 = 0{,}55$, sau đó lấy nhánh Thùng I chia cho $P(\\text{Ngon})$.',
        rubricChecklist: [
          'Tính đúng $P(\\text{Ngon}) = \\frac{1}{2}\\cdot\\frac{7}{10} + \\frac{1}{2}\\cdot\\frac{4}{10} = \\frac{11}{20}$.',
          'Viết đúng công thức Bayes $P(I \\mid \\text{Ngon}) = \\frac{P(I)\\cdot P(\\text{Ngon} \\mid I)}{P(\\text{Ngon})}$.',
          'Tính ra kết quả $\\frac{7/20}{11/20} = \\frac{7}{11}$.'
        ],
        sampleAnswer:
          'Gọi $I, II$ là biến cố chọn Thùng I, II ($P(I) = P(II) = \\frac{1}{2}$) và $N$ là biến cố "lấy được quả ngon". Theo công thức xác suất toàn phần: $P(N) = \\frac{1}{2}\\cdot\\frac{7}{10} + \\frac{1}{2}\\cdot\\frac{4}{10} = \\frac{11}{20}$. Theo công thức Bayes, xác suất quả ngon đó thuộc Thùng I là $P(I \\mid N) = \\frac{\\frac{1}{2}\\cdot\\frac{7}{10}}{\\frac{11}{20}} = \\frac{7}{11}$.'
      }
    }
  ],
  'math-12-6': [
    {
      stepTitle: '1. Hàm số Mũ & Logarit: Đạo hàm, Tính đơn điệu & Cực trị',
      stepType: 'concept',
      conceptSection:
        'Hàm số mũ $y = a^x$ ($0 < a \\neq 1$) xác định trên toàn $\\mathbb{R}$ và có tập giá trị $(0; +\\infty)$. Hàm số logarit $y = \\log_a x$ ($0 < a \\neq 1$) xác định trên $(0; +\\infty)$ và có tập giá trị $\\mathbb{R}$. Hai đồ thị đối xứng nhau qua đường phân giác $y = x$.',
      formulaSection: {
        primaryFormula: 'y = a^x: \\text{ ĐB khi } a > 1,\\ \\text{NB khi } 0 < a < 1; \\qquad y = \\log_a u \\implies \\text{ĐK: } u > 0',
        secondaryFormulas: [
          '(a^u)\' = u\' \\cdot a^u \\ln a, \\qquad (\\log_a u)\' = \\frac{u\'}{u \\ln a}',
          '\\text{Tiệm cận đồ thị } y = a^x: \\ y = 0 \\ (Ox); \\quad y = \\log_a x: \\ x = 0 \\ (Oy)'
        ],
        variablesNote:
          '• **Mẹo nhìn đồ thị nhận diện cơ số $a$**:\n  - Với $y = a^x$: vẽ đường thẳng đứng $x = 1$, giao điểm có tung độ chính bằng $a$!\n  - Với $y = \\log_a x$: vẽ đường nằm ngang $y = 1$, giao điểm có hoành độ chính bằng $a$!'
      },
      deepDiveSection:
        'Khi khảo sát tập xác định của hàm chứa logarit dạng $y = \\log_{x-1}(5 - x)$, nhớ đặt ĐỦ cả 3 điều kiện cho **cơ số và biểu thức**: $5 - x > 0$, $x - 1 > 0$, và $x - 1 \\neq 1 \\implies 1 < x < 5$ và $x \\neq 2$!',
      teacherExplanation: 'Đừng bao giờ quên kiểm tra cơ số $0 < a \\neq 1$ nếu cơ số có chứa ẩn $x$ hoặc tham số $m$!',
      keyTakeaway: 'Kẻ $x = 1$ để so sánh các cơ số mũ $a^x$; kẻ $y = 1$ để so sánh các cơ số logarit $\\log_a x$.',
      miniQuiz: [
        {
          id: 'm126-s1-q1',
          question: 'Tập xác định của hàm số $y = \\log_3(x^2 - 4x + 3)$ là:',
          options: [
            'A. $(-\\infty; 1) \\cup (3; +\\infty)$',
            'B. $(1; 3)$',
            'C. $(-\\infty; 1] \\cup [3; +\\infty)$',
            'D. $\\mathbb{R} \\setminus \\{1; 3\\}$'
          ],
          correctIndex: 0,
          explanation: 'Điều kiện $x^2 - 4x + 3 > 0 \\iff x < 1$ hoặc $x > 3$.'
        },
        {
          id: 'm126-s1-q2',
          question: 'Hàm số $y = (x^2 - 3)\\ln x$ có đạo hàm tại $x = 1$ bằng:',
          options: ['A. $-2$', 'B. $2$', 'C. $0$', 'D. $-4$'],
          correctIndex: 0,
          explanation: '$y\' = 2x\\ln x + \\frac{x^2 - 3}{x}$. Tại $x = 1$: $y\'(1) = 0 + \\frac{1 - 3}{1} = -2$.'
        }
      ],
      miniEssay: {
        id: 'm126-s1-e1',
        question: 'Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $y = x - \\ln x$ trên đoạn $\\left[\\frac{1}{e}; e\\right]$.',
        hint: 'Tính $y\' = 1 - \\frac{1}{x} = 0 \\implies x = 1 \\in [\\frac{1}{e}; e]$, sau đó so sánh $y(1), y(1/e), y(e)$.',
        rubricChecklist: [
          'Tính $y\' = 1 - \\frac{1}{x}$ và giải $y\' = 0 \\iff x = 1 \\in \\left[\\frac{1}{e}; e\\right]$.',
          'Tính 3 giá trị: $y(1) = 1$, $y(1/e) = \\frac{1}{e} + 1$, $y(e) = e - 1$.',
          'So sánh đúng $1 < \\frac{1}{e} + 1 \\approx 1{,}37 < e - 1 \\approx 1{,}72$ để kết luận $\\min y = 1$, $\\max y = e - 1$.'
        ],
        sampleAnswer:
          'Hàm số liên tục trên $\\left[\\frac{1}{e}; e\\right]$. Đạo hàm $y\' = 1 - \\frac{1}{x} = 0 \\iff x = 1 \\in \\left[\\frac{1}{e}; e\\right]$. Ta có $y(1) = 1$; $y\\left(\\frac{1}{e}\\right) = \\frac{1}{e} + 1 \\approx 1{,}368$; $y(e) = e - 1 \\approx 1{,}718$. Vậy $\\min y = 1$ (tại $x = 1$) và $\\max y = e - 1$ (tại $x = e$).'
      }
    },
    {
      stepTitle: '2. Phương pháp Đặt Ẩn phụ & Logarit hóa cho Phương trình Mũ – Logarit',
      stepType: 'derivation',
      conceptSection:
        'Ngoài đưa về cùng cơ số, các bài toán phương trình và bất phương trình mũ – logarit lớp 12 thường xoay quanh 3 kỹ thuật: **đặt ẩn phụ một loại lũy thừa** ($t = a^x > 0$), **chia đẳng cấp hai cơ số khác nhau** ($4^x, 6^x, 9^x$), và **logarit hóa hai vế**.',
      formulaSection: {
        primaryFormula: 'A\\cdot a^{2x} + B\\cdot a^x + C = 0 \\xrightarrow{t = a^x > 0} At^2 + Bt + C = 0',
        secondaryFormulas: [
          'a^x \\cdot b^x = (ab)^x, \\qquad \\text{đẳng cấp } m\\cdot a^{2x} + n(ab)^x + p\\cdot b^{2x} = 0 \\xrightarrow{: b^{2x}} m\\left(\\frac{a}{b}\\right)^{2x} + \\dots',
          '\\text{Hệ thức Vi-ét cho } x_1 + x_2 \\text{ của PT mũ: } t_1 \\cdot t_2 = a^{x_1}a^{x_2} = a^{x_1 + x_2} = \\frac{C}{A}'
        ],
        variablesNote:
          '• **Cực kỳ hay thi (bẫy Vi-ét ngược giữa $t$ và $x$)**:\n  - Trong PT mũ ($t = a^x > 0$): **TÍCH** hai nghiệm $t_1 t_2 = a^{x_1 + x_2}$ mới cho **TỔNG** hai nghiệm $x_1 + x_2$!\n  - Trong PT logarit ($t = \\log_a x$): **TỔNG** hai nghiệm $t_1 + t_2 = \\log_a(x_1 x_2)$ mới cho **TÍCH** hai nghiệm $x_1 x_2$!'
      },
      deepDiveSection:
        'Ngoài ra, nhớ cặp cơ số nghịch đảo liên hợp kinh điển: $(2 + \\sqrt{3})(2 - \\sqrt{3}) = 1$ hoặc $(\\sqrt{5} + 2)(\\sqrt{5} - 2) = 1$, nên nếu đặt $t = (2 + \\sqrt{3})^x > 0$ thì $(2 - \\sqrt{3})^x = \\frac{1}{t}$ ngay lập tức!',
      teacherExplanation: 'Khi gặp bài tìm $m$ để phương trình mũ có 2 nghiệm thỏa $x_1 + x_2 = k$, chuyển ngay về $t_1 t_2 = a^k$ và nhớ $t_1, t_2 > 0$!',
      keyTakeaway: 'Đặt $t = a^x > 0$; nhớ quy tắc chéo Vi-ét: $t_1 t_2 = a^{x_1 + x_2}$ và $\\Delta > 0, S > 0, P > 0$.',
      miniQuiz: [
        {
          id: 'm126-s2-q1',
          question: 'Phương trình $4^x - 5\\cdot 2^x + 4 = 0$ có tổng hai nghiệm $x_1 + x_2$ bằng:',
          options: ['A. $2$', 'B. $4$', 'C. $5$', 'D. $1$'],
          correctIndex: 0,
          explanation: 'Đặt $t = 2^x > 0 \\implies t^2 - 5t + 4 = 0 \\implies t_1 = 1, t_2 = 4$ (hoặc $t_1 t_2 = 2^{x_1+x_2} = 4 \\implies x_1 + x_2 = 2$).'
        },
        {
          id: 'm126-s2-q2',
          question: 'Khi đặt $t = \\log_2 x$, phương trình $\\log_2^2 x - 3\\log_2(2x) + 1 = 0$ trở thành:',
          options: [
            'A. $t^2 - 3t - 2 = 0$',
            'B. $t^2 - 3t + 1 = 0$',
            'C. $t^2 - 6t + 1 = 0$',
            'D. $t^2 - 3t + 4 = 0$'
          ],
          correctIndex: 0,
          explanation: '$\\log_2(2x) = 1 + \\log_2 x = 1 + t$. Thay vào: $t^2 - 3(1 + t) + 1 = t^2 - 3t - 2 = 0$.'
        }
      ],
      miniEssay: {
        id: 'm126-s2-e1',
        question: 'Giải bất phương trình $9^x - 4\\cdot 3^x + 3 < 0$.',
        hint: 'Đặt $t = 3^x > 0$ để giải $t^2 - 4t + 3 < 0$, sau đó trả biến $1 < 3^x < 3$.',
        rubricChecklist: [
          'Đặt $t = 3^x > 0$, chuyển bất phương trình thành $t^2 - 4t + 3 < 0$.',
          'Giải $1 < t < 3$ (thỏa $t > 0$).',
          'Trả ẩn $1 < 3^x < 3 \\iff 0 < x < 1$, tập nghiệm $(0; 1)$.'
        ],
        sampleAnswer:
          'Đặt $t = 3^x > 0$. Bất phương trình trở thành $t^2 - 4t + 3 < 0 \\iff 1 < t < 3$ (đều thỏa $t > 0$). Trả ẩn: $1 < 3^x < 3 \\iff 3^0 < 3^x < 3^1 \\iff 0 < x < 1$. Vậy tập nghiệm là $S = (0; 1)$.'
      }
    },
    {
      stepTitle: '3. Phương pháp Hàm Đặc trưng & Đánh giá Mũ – Logarit Vận dụng cao',
      stepType: 'example',
      conceptSection:
        'Những câu vận dụng cao (8+ – 9+) về mũ và logarit thường kết hợp cả đa thức lẫn mũ/logarit (không thể đưa về một loại biến). Chìa khóa giải quyết là đưa phương trình về dạng đối xứng $f(u) = f(v)$ với hàm đặc trưng $f(t)$ **đơn điệu** để suy ra ngay $u = v$.',
      formulaSection: {
        primaryFormula: 'f(u) = f(v) \\text{ với } f(t) \\text{ luôn đồng biến (hoặc nghịch biến)} \\iff u = v',
        secondaryFormulas: [
          '\\text{Mẫu 1: } a^u + k u = a^v + k v \\quad (f(t) = a^t + kt \\text{ đồng biến khi } a > 1, k > 0)',
          '\\text{Mẫu 2: } \\log_a u + u = \\log_a v + v \\quad (f(t) = \\log_a t + t \\text{ đồng biến trên } (0; +\\infty))'
        ],
        variablesNote:
          '• **Kỹ thuật tạo hàm đặc trưng từ biểu thức $\\log\\frac{u}{v} = v - u$**:\n  Tách ngay $\\log u - \\log v = v - u \\iff \\log u + u = \\log v + v \\implies f(u) = f(v)$ với $f(t) = \\log t + t$!\n• Sau khi chứng minh $f\'(t) > 0$ trên khoảng xác định, suy ra $u = v$ và giải bình thường như bài toán lớp 10–11.'
      },
      deepDiveSection:
        'Với bất phương trình vận dụng cao dạng $e^x + x \\le e^y + y$ (với $y$ là biểu thức chứa $m$), do $f(t) = e^t + t$ đồng biến nên $f(x) \\le f(y) \\iff x \\le y$ — biến bất phương trình siêu việt cực khó thành bất phương trình đại số đơn giản trong 1 dòng!',
      teacherExplanation: 'Hễ thấy vừa có $e^u$ (hoặc $\\log u$) vừa cộng thêm chính $u$, nghĩ ngay tới phương pháp hàm đặc trưng $f(u) = f(v)$!',
      keyTakeaway: 'Nếu $f(t)$ đơn điệu trên miền $D$ thì $f(u) = f(v) \\iff u = v$ và $f(u) < f(v) \\iff u < v$ (khi $f$ đồng biến).',
      miniQuiz: [
        {
          id: 'm126-s3-q1',
          question: 'Xét hàm số $f(t) = 2^t + t$ trên $\\mathbb{R}$. Khẳng định nào sau đây ĐÚNG?',
          options: [
            'A. $f(t)$ luôn đồng biến trên $\\mathbb{R}$ nên $f(u) = f(v) \\iff u = v$',
            'B. $f(t)$ luôn nghịch biến trên $\\mathbb{R}$',
            'C. $f(t)$ có $1$ điểm cực tiểu tại $t = 0$',
            'D. $f(u) = f(v)$ có thể xảy ra khi $u \\neq v$'
          ],
          correctIndex: 0,
          explanation: '$f\'(t) = 2^t\\ln 2 + 1 > 0\\ \\forall t \\in \\mathbb{R}$, nên $f(t)$ đồng biến trên toàn $\\mathbb{R}$.'
        },
        {
          id: 'm126-s3-q2',
          question: 'Từ phương trình $\\ln\\left(\\frac{x + 1}{y}\\right) = y - x - 1$ (với $x > -1, y > 0$), dùng hàm đặc trưng thu được mối liên hệ nào?',
          options: ['A. $y = x + 1$', 'B. $y = x - 1$', 'C. $xy = 1$', 'D. $y = e^{x+1}$'],
          correctIndex: 0,
          explanation: 'Biến đổi thành $\\ln(x+1) + (x+1) = \\ln y + y$. Hàm $f(t) = \\ln t + t$ đồng biến trên $(0; +\\infty)$ nên $x + 1 = y$.'
        }
      ],
      miniEssay: {
        id: 'm126-s3-e1',
        question: 'Giải phương trình $\\log_2\\left(\\frac{x^2 + 1}{2x}\\right) = 2x - x^2 - 1$ (với $x > 0$).',
        hint: 'Tách $\\log_2(x^2 + 1) - \\log_2(2x) = 2x - (x^2 + 1)$, chuyển vế tạo hàm $f(t) = \\log_2 t + t$.',
        rubricChecklist: [
          'Chuyển vế được $\\log_2(x^2 + 1) + (x^2 + 1) = \\log_2(2x) + 2x$.',
          'Xét $f(t) = \\log_2 t + t$ trên $(0; +\\infty)$ có $f\'(t) = \\frac{1}{t\\ln 2} + 1 > 0 \\implies f$ đồng biến.',
          'Suy ra $x^2 + 1 = 2x \\iff (x - 1)^2 = 0 \\iff x = 1$ (thỏa mãn $x > 0$).'
        ],
        sampleAnswer:
          'Với $x > 0$, phương trình tương đương $\\log_2(x^2 + 1) - \\log_2(2x) = 2x - (x^2 + 1) \\iff \\log_2(x^2 + 1) + (x^2 + 1) = \\log_2(2x) + 2x$. Xét hàm $f(t) = \\log_2 t + t$ trên $(0; +\\infty)$, có $f\'(t) = \\frac{1}{t\\ln 2} + 1 > 0\\ \\forall t > 0$ nên $f$ đồng biến trên $(0; +\\infty)$. Vậy phương trình $\\iff f(x^2 + 1) = f(2x) \\iff x^2 + 1 = 2x \\iff (x - 1)^2 = 0 \\iff x = 1$ (thỏa $x > 0$).'
      }
    }
  ]
};
