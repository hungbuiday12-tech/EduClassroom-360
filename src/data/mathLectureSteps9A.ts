import { LectureStep } from '../types';

export const MATH_CUSTOM_LECTURE_STEPS_9A: Record<string, LectureStep[]> = {
  'math-9-1': [
    {
      stepTitle: '1. Hàm số Bậc nhất $y = ax + b$ ($a \\neq 0$) & Tính đồng biến, nghịch biến',
      stepType: 'concept',
      conceptSection:
        'Hàm số bậc nhất có dạng $y = ax + b$ với $a, b \\in \\mathbb{R}$ và hệ số góc $a \\neq 0$. Tập xác định là $D = \\mathbb{R}$. Chiều biến thiên phụ thuộc hoàn toàn vào dấu của $a$: khi $a > 0$ hàm số đồng biến trên $\\mathbb{R}$, khi $a < 0$ hàm số nghịch biến trên $\\mathbb{R}$.',
      formulaSection: {
        primaryFormula: 'y = ax + b \\quad (a \\neq 0)',
        secondaryFormulas: [
          'a > 0 \\implies \\text{hàm đồng biến trên } \\mathbb{R}',
          'a < 0 \\implies \\text{hàm nghịch biến trên } \\mathbb{R}'
        ],
        variablesNote:
          '• $a$ là hệ số góc (quyết định độ dốc và hướng đi lên/xuống của đường thẳng).\n• $b$ là tung độ gốc — giao điểm với trục tung $Oy$ có tọa độ $(0; b)$.\n• Nếu hệ số $a$ chứa tham số $m$, bắt buộc đặt điều kiện $a(m) \\neq 0$ trước khi kết luận đồng biến/nghịch biến.'
      },
      deepDiveSection:
        'Về mặt hình học, khi vẽ đường thẳng $y = ax + b$, ta chỉ cần 2 điểm phân biệt: giao điểm trục tung $A(0; b)$ và giao điểm trục hoành $B(-\\frac{b}{a}; 0)$ (khi $b \\neq 0$). Lưu ý góc $\\alpha$ tạo bởi đường thẳng và chiều dương trục $Ox$ thỏa mãn $\\tan\\alpha = a$ (khi $a > 0$, góc nhọn; khi $a < 0$, góc tù).',
      teacherExplanation: 'Kiểm tra ngay điều kiện $a \\neq 0$ trước mọi phép xét đồng biến, nghịch biến của hàm bậc nhất.',
      keyTakeaway: '$a > 0$: đường thẳng đi lên từ trái sang phải; $a < 0$: đường thẳng đi xuống.',
      miniQuiz: [
        {
          id: 'm91-s1-q1',
          question: 'Tìm $m$ để hàm số $y = (2m - 4)x + 5$ là hàm số bậc nhất và nghịch biến trên $\\mathbb{R}$.',
          options: ['A. $m > 2$', 'B. $m < 2$', 'C. $m \\le 2$', 'D. $m \\neq 2$'],
          correctIndex: 1,
          explanation: 'Hàm bậc nhất nghịch biến $\\iff a = 2m - 4 < 0 \\iff m < 2$.'
        },
        {
          id: 'm91-s1-q2',
          question: 'Đường thẳng $y = -3x + 6$ cắt trục hoành $Ox$ tại điểm có tọa độ nào?',
          options: ['A. $(0; 6)$', 'B. $(2; 0)$', 'C. $(-2; 0)$', 'D. $(6; 0)$'],
          correctIndex: 1,
          explanation: 'Cho $y = 0 \\implies -3x + 6 = 0 \\implies x = 2$. Vậy giao điểm là $(2; 0)$.'
        }
      ],
      miniEssay: {
        id: 'm91-s1-e1',
        question: 'Tìm tất cả giá trị của $m$ để hàm số $y = (m^2 - 1)x + m + 3$ đồng biến trên $\\mathbb{R}$ và đi qua điểm $A(1; 6)$.',
        hint: 'Thay tọa độ $A(1; 6)$ vào công thức để tìm $m$, sau đó đối chiếu lại điều kiện $a = m^2 - 1 > 0$.',
        rubricChecklist: [
          'Thay $x = 1, y = 6$: $(m^2 - 1)\\cdot 1 + m + 3 = 6 \\iff m^2 + m - 4 = 0$ hoặc kiểm tra nghiệm rõ ràng.',
          'Đặt điều kiện đồng biến $m^2 - 1 > 0 \\iff m > 1$ hoặc $m < -1$.',
          'Đối chiếu nghiệm với điều kiện đồng biến để kết luận chính xác.'
        ],
        sampleAnswer:
          'Điều kiện đồng biến: $m^2 - 1 > 0 \\iff |m| > 1$. Thay $A(1; 6)$ vào hàm số: $m^2 - 1 + m + 3 = 6 \\iff m^2 + m - 4 = 0 \\iff m = \\frac{-1 \\pm \\sqrt{17}}{2}$. Vì $|\\frac{-1 - \\sqrt{17}}{2}| \\approx 2{,}56 > 1$ và $|\\frac{-1 + \\sqrt{17}}{2}| \\approx 1{,}56 > 1$ nên cả hai giá trị $m$ đều thỏa mãn.'
      }
    },
    {
      stepTitle: '2. Vị trí Tương đối Hai Đường thẳng & Hệ số góc',
      stepType: 'derivation',
      conceptSection:
        'Cho hai đường thẳng $(d): y = ax + b$ ($a \\neq 0$) và $(d\'): y = a\'x + b\'$ ($a\' \\neq 0$). Hai đường thẳng có 4 mối quan hệ cơ bản: cắt nhau, song song, trùng nhau và vuông góc — hoàn toàn xác định qua cặp $(a, b)$ và $(a\', b\')$.',
      formulaSection: {
        primaryFormula: '(d) \\parallel (d\') \\iff a = a\' \\text{ và } b \\neq b\'',
        secondaryFormulas: [
          '(d) \\equiv (d\') \\iff a = a\' \\text{ và } b = b\'',
          '(d) \\perp (d\') \\iff a \\cdot a\' = -1'
        ],
        variablesNote:
          '• Nếu $a \\neq a\'$ thì $(d)$ cắt $(d\')$ tại đúng 1 điểm (tìm bằng phương trình hoành độ giao điểm $ax + b = a\'x + b\'$).\n• Hay quên nhất: điều kiện **song song** bắt buộc phải kiểm tra thêm $b \\neq b\'$ để loại trường hợp **trùng nhau**!'
      },
      deepDiveSection:
        'Một dạng toán hay gặp trong đề thi vào 10 là tìm $m$ để ba đường thẳng đồng quy hoặc giao điểm của hai đường thẳng nằm ở góc phần tư thứ mấy / nằm trên trục $Ox, Oy$. Cách làm chuẩn: giải giao điểm của 2 đường cố định trước (không chứa $m$), rồi thay tọa độ giao điểm đó vào đường còn lại.',
      teacherExplanation: 'Song song đòi hỏi $a = a\'$ VÀ $b \\neq b\'$; vuông góc thì tích hai hệ số góc bằng $-1$.',
      keyTakeaway: 'Đừng quên kiểm tra $b \\neq b\'$ khi giải bài toán hai đường thẳng song song!',
      miniQuiz: [
        {
          id: 'm91-s2-q1',
          question: 'Tìm $m$ để hai đường thẳng $(d_1): y = (m + 1)x + 2$ và $(d_2): y = 3x + m$ song song với nhau.',
          options: ['A. $m = 2$', 'B. $m = -2$', 'C. $m = 2$ hoặc $m = -2$', 'D. Không có giá trị $m$'],
          correctIndex: 3,
          explanation: '$a_1 = a_2 \\iff m + 1 = 3 \\iff m = 2$. Tuy nhiên khi $m = 2$ thì $b_1 = 2 = b_2$ nên hai đường thẳng TRÙNG NHAU. Do đó không có giá trị $m$ nào để chúng song song.'
        },
        {
          id: 'm91-s2-q2',
          question: 'Đường thẳng $(d)$ vuông góc với đường thẳng $y = \\frac{1}{2}x - 3$ và đi qua $M(1; 4)$ có phương trình là:',
          options: ['A. $y = -2x + 6$', 'B. $y = 2x + 2$', 'C. $y = -\\frac{1}{2}x + \\frac{9}{2}$', 'D. $y = -2x + 2$'],
          correctIndex: 0,
          explanation: '$a \\cdot \\frac{1}{2} = -1 \\implies a = -2$. Thay $M(1; 4)$: $-2(1) + b = 4 \\implies b = 6$.'
        }
      ],
      miniEssay: {
        id: 'm91-s2-e1',
        question: 'Xác định phương trình đường thẳng $(d): y = ax + b$ biết $(d)$ song song với $(d\'): y = 2x - 5$ và cắt trục hoành tại điểm có hoành độ bằng $-3$.',
        hint: 'Từ song song suy ra $a = 2$ (với $b \\neq -5$). Thay $x = -3, y = 0$ để tìm $b$.',
        rubricChecklist: [
          'Lập luận $(d) \\parallel (d\') \\implies a = 2$ và $b \\neq -5$.',
          'Thay giao điểm $Ox$ là $(-3; 0)$ tìm được $b = 6$.',
          'Kiểm tra $6 \\neq -5$ thỏa mãn và viết kết luận $y = 2x + 6$.'
        ],
        sampleAnswer:
          'Vì $(d) \\parallel (d\')$ nên $a = 2$ và $b \\neq -5$. Vì $(d)$ cắt trục hoành tại điểm có hoành độ $-3$ nên đi qua $(-3; 0)$. Thay vào phương trình: $0 = 2\\cdot(-3) + b \\implies b = 6$ (thỏa mãn $b \\neq -5$). Vậy $(d): y = 2x + 6$.'
      }
    },
    {
      stepTitle: '3. Khoảng cách từ Gốc tọa độ & Diện tích Tam giác tạo bởi Đường thẳng',
      stepType: 'example',
      conceptSection:
        'Đường thẳng $(d): y = ax + b$ ($a \\neq 0, b \\neq 0$) cắt $Oy$ tại $A(0; b)$ và cắt $Ox$ tại $B(-\\frac{b}{a}; 0)$, tạo cùng gốc tọa độ $O$ một tam giác vuông $OAB$ tại $O$. Mọi bài toán diện tích tam giác hay khoảng cách từ $O$ đến $(d)$ đều giải nhanh bằng tam giác vuông $OAB$.',
      formulaSection: {
        primaryFormula: 'S_{\\triangle OAB} = \\frac{1}{2} OA \\cdot OB = \\frac{1}{2} |b| \\cdot \\left|\\frac{b}{a}\\right| = \\frac{b^2}{2|a|}',
        secondaryFormulas: [
          '\\frac{1}{OH^2} = \\frac{1}{OA^2} + \\frac{1}{OB^2}',
          'd(O, (d)) = OH = \\frac{|b|}{\\sqrt{a^2 + 1}}'
        ],
        variablesNote:
          '• $OA = |y_A| = |b|$, $OB = |x_B| = |\\frac{b}{a}|$ (luôn lấy giá trị tuyệt đối vì độ dài đoạn thẳng phải dương!).\n• $OH$ là đường cao ứng với cạnh huyền $AB$ trong $\\triangle OAB$ vuông tại $O$.'
      },
      deepDiveSection:
        'Lỗi sai kinh điển của học sinh lớp 9 là quên dấu trị tuyệt đối khi tính độ dài $OA = b$ và $OB = -\\frac{b}{a}$ dẫn đến diện tích bị âm hoặc sai dấu tham số $m$. Khi bài toán hỏi tìm $m$ để $d(O, (d))$ lớn nhất, kiểm tra xem $(d)$ có đi qua điểm cố định $M_0$ hay không vì $OH \\le OM_0$ luôn đúng.',
      teacherExplanation: 'Luôn lấy trị tuyệt đối tọa độ khi chuyển sang độ dài $OA = |b|$ và $OB = |b/a|$.',
      keyTakeaway: 'Dùng hệ thức lượng tam giác vuông $\\frac{1}{OH^2} = \\frac{1}{OA^2} + \\frac{1}{OB^2}$ để tính nhanh khoảng cách từ $O$ đến đường thẳng.',
      miniQuiz: [
        {
          id: 'm91-s3-q1',
          question: 'Đường thẳng $y = 2x - 4$ tạo với hai trục tọa độ một tam giác vuông có diện tích bằng bao nhiêu?',
          options: ['A. $4$', 'B. $8$', 'C. $2$', 'D. $16$'],
          correctIndex: 0,
          explanation: '$A(0; -4) \\implies OA = 4$; $B(2; 0) \\implies OB = 2$. Diện tích $S = \\frac{1}{2} \\cdot 4 \\cdot 2 = 4$.'
        },
        {
          id: 'm91-s3-q2',
          question: 'Khoảng cách từ gốc tọa độ $O(0; 0)$ đến đường thẳng $y = \\frac{3}{4}x + 3$ bằng:',
          options: ['A. $2{,}4$', 'B. $3{,}0$', 'C. $4{,}0$', 'D. $5{,}0$'],
          correctIndex: 0,
          explanation: '$OA = 3$, $OB = 4 \\implies AB = 5$. Đường cao $OH = \\frac{OA \\cdot OB}{AB} = \\frac{12}{5} = 2{,}4$.'
        }
      ],
      miniEssay: {
        id: 'm91-s3-e1',
        question: 'Cho đường thẳng $(d): y = x + 3$. Tính diện tích tam giác $OAB$ và độ dài đường cao $OH$ hạ từ $O$ xuống $(d)$ (với $A, B$ là giao điểm với $Oy, Ox$).',
        hint: 'Tìm $A(0; 3)$ và $B(-3; 0)$, suy ra $OA = 3, OB = 3$, tính $S$ và dùng $\\frac{1}{OH^2} = \\frac{1}{OA^2} + \\frac{1}{OB^2}$.',
        rubricChecklist: [
          'Tìm đúng giao điểm $A(0; 3)$, $B(-3; 0)$ suy ra $OA = 3, OB = 3$.',
          'Tính diện tích $S_{\\triangle OAB} = \\frac{1}{2} \\cdot 3 \\cdot 3 = 4{,}5$.',
          'Tính được $OH = \\frac{3\\sqrt{2}}{2}$.'
        ],
        sampleAnswer:
          'Giao điểm với $Oy$: $A(0; 3) \\implies OA = 3$. Giao điểm với $Ox$: $B(-3; 0) \\implies OB = 3$. Tam giác $OAB$ vuông cân tại $O$ nên $S = \\frac{1}{2} OA \\cdot OB = \\frac{9}{2}$. Độ dài $AB = 3\\sqrt{2}$, suy ra đường cao $OH = \\frac{OA \\cdot OB}{AB} = \\frac{9}{3\\sqrt{2}} = \\frac{3\\sqrt{2}}{2}$.'
      }
    }
  ],
  'math-9-2': [
    {
      stepTitle: '1. Hàm số $y = ax^2$ ($a \\neq 0$) & Tính chất Đối xứng Parabol',
      stepType: 'concept',
      conceptSection:
        'Đồ thị hàm số $y = ax^2$ ($a \\neq 0$) là một đường cong Parabol có đỉnh tại gốc tọa độ $O(0; 0)$ và nhận trục tung $Oy$ làm trục đối xứng. Toàn bộ đồ thị nằm phía trên $Ox$ nếu $a > 0$ và nằm phía dưới $Ox$ nếu $a < 0$.',
      formulaSection: {
        primaryFormula: 'y = ax^2 \\quad (a \\neq 0)',
        secondaryFormulas: [
          'a > 0: \\text{ đồng biến khi } x > 0, \\text{ nghịch biến khi } x < 0, \\quad \\min y = 0 \\text{ tại } x = 0',
          'a < 0: \\text{ đồng biến khi } x < 0, \\text{ nghịch biến khi } x > 0, \\quad \\max y = 0 \\text{ tại } x = 0'
        ],
        variablesNote:
          '• Bảng giá trị vẽ Parabol nên lấy tối thiểu 5 điểm đối xứng qua $x = 0$: $(-2; 4a), (-1; a), (0; 0), (1; a), (2; 4a)$.\n• Giá trị $|a|$ càng lớn thì bề lõm của Parabol càng hẹp (ôm sát trục $Oy$ hơn).'
      },
      deepDiveSection:
        'Khi giải bài toán tương giao giữa Parabol $(P): y = ax^2$ và đường thẳng $(d): y = mx + n$, ta lập phương trình hoành độ giao điểm $ax^2 - mx - n = 0$. Số giao điểm chính bằng số nghiệm phân biệt của phương trình bậc hai này.',
      teacherExplanation: 'Nhớ tính đối xứng qua $Oy$: hai điểm có hoành độ đối nhau $x$ và $-x$ luôn có cùng tung độ $y$.',
      keyTakeaway: 'Số giao điểm giữa $(P): y = ax^2$ và $(d): y = mx + n$ bằng số nghiệm của $ax^2 - mx - n = 0$.',
      miniQuiz: [
        {
          id: 'm92-s1-q1',
          question: 'Cho hàm số $y = -2x^2$. Khẳng định nào sau đây ĐÚNG?',
          options: [
            'A. Hàm số đồng biến khi $x > 0$',
            'B. Hàm số đồng biến khi $x < 0$',
            'C. Giá trị nhỏ nhất của hàm số bằng $0$',
            'D. Đồ thị đi qua điểm $(2; 8)$'
          ],
          correctIndex: 1,
          explanation: 'Vì $a = -2 < 0$ nên hàm số đồng biến khi $x < 0$ và nghịch biến khi $x > 0$; có giá trị lớn nhất là $0$.'
        },
        {
          id: 'm92-s1-q2',
          question: 'Parabol $(P): y = ax^2$ đi qua điểm $M(-2; 12)$. Tìm hệ số $a$.',
          options: ['A. $a = 3$', 'B. $a = -3$', 'C. $a = 6$', 'D. $a = \\frac{1}{3}$'],
          correctIndex: 0,
          explanation: 'Thay $x = -2, y = 12$: $12 = a(-2)^2 = 4a \\implies a = 3$.'
        }
      ],
      miniEssay: {
        id: 'm92-s1-e1',
        question: 'Cho $(P): y = x^2$ và đường thẳng $(d): y = 2x + 3$. Tìm tọa độ các giao điểm $A, B$ của $(P)$ và $(d)$.',
        hint: 'Giải phương trình hoành độ giao điểm $x^2 = 2x + 3$, sau đó thay mỗi nghiệm $x$ lại vào $y = x^2$ để tìm $y$.',
        rubricChecklist: [
          'Lập đúng phương trình hoành độ giao điểm $x^2 - 2x - 3 = 0$.',
          'Giải đúng $x_1 = -1, x_2 = 3$.',
          'Tính đúng tung độ và kết luận hai điểm $(-1; 1)$ và $(3; 9)$.'
        ],
        sampleAnswer:
          'Phương trình hoành độ giao điểm: $x^2 = 2x + 3 \\iff x^2 - 2x - 3 = 0 \\iff (x + 1)(x - 3) = 0 \\implies x_1 = -1, x_2 = 3$. Với $x = -1 \\implies y = 1$; với $x = 3 \\implies y = 9$. Vậy hai giao điểm là $A(-1; 1)$ và $B(3; 9)$.'
      }
    },
    {
      stepTitle: '2. Công thức Nghiệm Phương trình Bậc hai & Hệ thức Vi-ét',
      stepType: 'derivation',
      conceptSection:
        'Phương trình bậc hai $ax^2 + bx + c = 0$ ($a \\neq 0$) có biệt thức $\\Delta = b^2 - 4ac$ (hoặc $\\Delta\' = (b\')^2 - ac$ với $b = 2b\'$). Khi $\\Delta \\ge 0$, tổng và tích hai nghiệm liên hệ trực tiếp với các hệ số qua định lý Vi-ét.',
      formulaSection: {
        primaryFormula: 'x_1 + x_2 = -\\frac{b}{a}, \\qquad x_1 x_2 = \\frac{c}{a}',
        secondaryFormulas: [
          '\\Delta = b^2 - 4ac \\ge 0 \\quad (\\text{điều kiện tồn tại nghiệm thực})',
          'x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1x_2 = S^2 - 2P'
        ],
        variablesNote:
          '• **Cảnh báo mất điểm số 1**: Mọi bài toán dùng Vi-ét BẮT BUỘC phải viết điều kiện $\\Delta \\ge 0$ (hoặc $\\Delta > 0$ nếu đề yêu cầu *hai nghiệm phân biệt*) trước khi thay $S, P$!\n• Nhẩm nhanh nghiệm: $a + b + c = 0 \\implies x_1 = 1, x_2 = \\frac{c}{a}$; $a - b + c = 0 \\implies x_1 = -1, x_2 = -\\frac{c}{a}$.'
      },
      deepDiveSection:
        'Khi gặp biểu thức bất đối xứng như $x_1^2 + 3x_2 = m$, không cố ép ngay về $(S, P)$ mà kết hợp $x_1$ là nghiệm ($ax_1^2 + bx_1 + c = 0$) để hạ bậc $x_1^2$, hoặc giải hệ phương trình gồm $(x_1 + x_2 = S)$ với biểu thức đề cho rồi thế ngược lại vào $x_1 x_2 = P$.',
      teacherExplanation: 'Luôn kiểm tra $\\Delta \\ge 0$ (hoặc $\\Delta > 0$) đầu tiên trước khi áp dụng tổng $S = -b/a$ và tích $P = c/a$.',
      keyTakeaway: 'Nếu $a \\cdot c < 0$ thì $\\Delta = b^2 - 4ac > 0$ tự động thỏa mãn — phương trình luôn có 2 nghiệm trái dấu.',
      miniQuiz: [
        {
          id: 'm92-s2-q1',
          question: 'Cho phương trình $x^2 - 5x + 3 = 0$ có hai nghiệm $x_1, x_2$. Giá trị của biểu thức $A = x_1^2 + x_2^2$ bằng:',
          options: ['A. $19$', 'B. $25$', 'C. $31$', 'D. $13$'],
          correctIndex: 0,
          explanation: '$\\Delta = 25 - 12 = 13 > 0$. Theo Vi-ét: $x_1 + x_2 = 5$, $x_1 x_2 = 3$. Vậy $A = 5^2 - 2\\cdot 3 = 19$.'
        },
        {
          id: 'm92-s2-q2',
          question: 'Tìm $m$ để phương trình $x^2 - 2(m - 1)x + m^2 - 3 = 0$ có hai nghiệm phân biệt thỏa mãn $x_1^2 + x_2^2 = 10$.',
          options: ['A. $m = 0$', 'B. $m = -2$', 'C. $m = 0$ và $m = -2$', 'D. $m = 2$'],
          correctIndex: 0,
          explanation: 'Điều kiện $\\Delta\' = (m-1)^2 - (m^2 - 3) = -2m + 4 > 0 \\iff m < 2$. Theo Vi-ét: $S^2 - 2P = 10 \\iff 4(m-1)^2 - 2(m^2 - 3) = 10 \\iff 2m^2 - 8m = 0 \\iff m = 0$ (nhận) hoặc $m = 4$ (loại).'
        }
      ],
      miniEssay: {
        id: 'm92-s2-e1',
        question: 'Tìm $m$ để phương trình $x^2 - 2mx + m^2 - m - 1 = 0$ có hai nghiệm phân biệt $x_1, x_2$ thỏa mãn $\\frac{1}{x_1} + \\frac{1}{x_2} = 2$.',
        hint: 'Đặt đủ 3 điều kiện: $\\Delta\' > 0$, $x_1 x_2 \\neq 0$, và quy đồng $\\frac{x_1 + x_2}{x_1 x_2} = 2$.',
        rubricChecklist: [
          'Tính $\\Delta\' = m + 1 > 0 \\iff m > -1$.',
          'Đặt điều kiện $x_1 x_2 = m^2 - m - 1 \\neq 0$.',
          'Giải $2m = 2(m^2 - m - 1) \\iff m^2 - 2m - 1 = 0 \\implies m = 1 \\pm \\sqrt{2}$ (cả 2 đều thỏa $m > -1$).'
        ],
        sampleAnswer:
          '$\\Delta\' = m^2 - (m^2 - m - 1) = m + 1 > 0 \\iff m > -1$. Để phân thức có nghĩa cần $x_1 x_2 = m^2 - m - 1 \\neq 0$. Theo Vi-ét: $\\frac{x_1 + x_2}{x_1 x_2} = \\frac{2m}{m^2 - m - 1} = 2 \\implies m^2 - 2m - 1 = 0 \\iff m = 1 \\pm \\sqrt{2}$. Cả hai đều thỏa mãn $m > -1$ và $m^2 - m - 1 = m \\neq 0$.'
      }
    },
    {
      stepTitle: '3. Các Biểu thức Đối xứng & Bất đối xứng Kinh điển (Bài toán Vi-ét vào 10)',
      stepType: 'example',
      conceptSection:
        'Trong đề thi tuyển sinh vào lớp 10, câu Vi-ét thường cho biểu thức chứa trị tuyệt đối $|x_1 - x_2|$, căn bậc hai $\\sqrt{x_1} + \\sqrt{x_2}$, hoặc biểu thức bậc cao như $x_1^2 + 2mx_2$. Chìa khóa là biến đổi về tổng $S$ và tích $P$, kèm điều kiện dấu của nghiệm.',
      formulaSection: {
        primaryFormula: '|x_1 - x_2| = \\sqrt{(x_1 + x_2)^2 - 4x_1 x_2}',
        secondaryFormulas: [
          '\\text{Hai nghiệm cùng dương } \\iff \\Delta \\ge 0,\\ P > 0,\\ S > 0',
          '\\text{Hai nghiệm thỏa } x_1 < 0 < x_2 \\iff P = x_1 x_2 < 0'
        ],
        variablesNote:
          '• Khi xuất hiện $\\sqrt{x_1}$ và $\\sqrt{x_2}$, điều kiện tiên quyết là $x_1 \\ge 0, x_2 \\ge 0 \\iff \\Delta \\ge 0, S \\ge 0, P \\ge 0$.\n• Sau đó bình phương hai vế biểu thức dương để đưa về $S$ và $P$.'
      },
      deepDiveSection:
        'Nếu gặp phương trình chứa $|x_1| + |x_2| = k$, bình phương hai vế ta được $x_1^2 + x_2^2 + 2|x_1 x_2| = k^2 \\iff S^2 - 2P + 2|P| = k^2$. Cách bình phương giúp phá dấu trị tuyệt đối tự nhiên mà không cần chia quá nhiều trường hợp.',
      teacherExplanation: 'Khi phương trình yêu cầu nghiệm dương (để khai căn), nhớ bộ ba điều kiện: $\\Delta \\ge 0, S \\ge 0, P \\ge 0$.',
      keyTakeaway: 'Bình phương hai vế cho $|x_1 - x_2|$ hoặc $\\sqrt{x_1} + \\sqrt{x_2}$ sau khi đã đặt đủ điều kiện có nghĩa.',
      miniQuiz: [
        {
          id: 'm92-s3-q1',
          question: 'Điều kiện cần và đủ để phương trình $x^2 - Sx + P = 0$ có hai nghiệm dương phân biệt là:',
          options: [
            'A. $\\Delta > 0, S > 0, P > 0$',
            'B. $\\Delta \\ge 0, S > 0, P < 0$',
            'C. $P > 0, S > 0$',
            'D. $\\Delta > 0, P > 0$'
          ],
          correctIndex: 0,
          explanation: 'Cần đủ cả 3 điều kiện: có 2 nghiệm phân biệt ($\\Delta > 0$), tích dương (cùng dấu, $P > 0$) và tổng dương ($S > 0$).'
        },
        {
          id: 'm92-s3-q2',
          question: 'Với hai nghiệm của phương trình $x^2 - 7x + 10 = 0$, giá trị của $|x_1 - x_2|$ là:',
          options: ['A. $3$', 'B. $9$', 'C. $\\sqrt{29}$', 'D. $7$'],
          correctIndex: 0,
          explanation: '$(x_1 - x_2)^2 = S^2 - 4P = 49 - 40 = 9 \\implies |x_1 - x_2| = 3$.'
        }
      ],
      miniEssay: {
        id: 'm92-s3-e1',
        question: 'Cho phương trình $x^2 - 6x + m = 0$. Tìm $m$ để phương trình có hai nghiệm phân biệt $x_1, x_2$ đều dương và thỏa mãn $\\sqrt{x_1} + \\sqrt{x_2} = 4$.',
        hint: 'Đặt điều kiện $\\Delta\' > 0, S > 0, P > 0$, sau đó bình phương 2 vế $\\sqrt{x_1} + \\sqrt{x_2} = 4$.',
        rubricChecklist: [
          'Điều kiện: $9 - m > 0$ và $m > 0 \\implies 0 < m < 9$.',
          'Bình phương: $x_1 + x_2 + 2\\sqrt{x_1 x_2} = 16 \\implies 6 + 2\\sqrt{m} = 16$.',
          'Giải $\\sqrt{m} = 5 \\implies m = 25$ và đối chiếu điều kiện $0 < m < 9$ để kết luận LOẠI (vô nghiệm).'
        ],
        sampleAnswer:
          'Điều kiện có hai nghiệm dương phân biệt: $\\Delta\' = 9 - m > 0$, $S = 6 > 0$, $P = m > 0 \\iff 0 < m < 9$. Bình phương hai vế: $x_1 + x_2 + 2\\sqrt{x_1 x_2} = 16 \\implies 6 + 2\\sqrt{m} = 16 \\implies \\sqrt{m} = 5 \\implies m = 25$. Vì $25 \\notin (0; 9)$ nên không có giá trị $m$ thỏa mãn!'
      }
    }
  ],
  'math-9-3': [
    {
      stepTitle: '1. Hệ thức Cạnh và Đường cao trong Tam giác vuông',
      stepType: 'concept',
      conceptSection:
        'Trong tam giác $ABC$ vuông tại $A$, đường cao $AH = h$, cạnh huyền $BC = a$, các cạnh góc vuông $AC = b, AB = c$, hình chiếu trên cạnh huyền $CH = b\', BH = c\'$. Bốn hệ thức lượng kinh điển kết nối toàn bộ 6 đoạn thẳng này mà chưa cần dùng đến góc.',
      formulaSection: {
        primaryFormula: 'b^2 = a \\cdot b\', \\qquad h^2 = b\' \\cdot c\'',
        secondaryFormulas: [
          'a \\cdot h = b \\cdot c',
          '\\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}'
        ],
        variablesNote:
          '• $b, c$: hai cạnh góc vuông; $a = b\' + c\'$: cạnh huyền.\n• $b\', c\'$: hình chiếu tương ứng của $b, c$ trên cạnh huyền $a$.\n• Nhớ câu: *"Cạnh góc vuông bình = huyền nhân chiếu"*; *"Cao bình = chiếu nhân chiếu"*.'
      },
      deepDiveSection:
        'Mọi hệ thức trên đều chứng minh nhanh bằng cặp tam giác đồng dạng ($\\triangle HBA \\sim \\triangle ABC \\sim \\triangle HAC$). Trong bài toán hình học đường tròn lớp 9, khi gặp tiếp tuyến $AB$ vuông góc bán kính $OB$ và đường cao $BH$, hệ thức $OB^2 = OH \\cdot OA$ được dùng liên tục.',
      teacherExplanation: 'Chỉ cần xác định đúng đâu là cạnh huyền và chân đường cao $H$, các tỷ số đồng dạng lập tức cho mọi cạnh còn lại.',
      keyTakeaway: '$b^2 = ab\'$, $h^2 = b\'c\'$, $ah = bc$ và $\\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}$.',
      miniQuiz: [
        {
          id: 'm93-s1-q1',
          question: 'Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Biết hình chiếu $BH = 4\\text{ cm}$, $CH = 9\\text{ cm}$. Độ dài đường cao $AH$ bằng:',
          options: ['A. $6\\text{ cm}$', 'B. $5\\text{ cm}$', 'C. $36\\text{ cm}$', 'D. $6{,}5\\text{ cm}$'],
          correctIndex: 0,
          explanation: '$AH^2 = BH \\cdot CH = 4 \\cdot 9 = 36 \\implies AH = 6\\text{ cm}$.'
        },
        {
          id: 'm93-s1-q2',
          question: 'Tam giác $ABC$ vuông tại $A$ có $AB = 6\\text{ cm}$, $AC = 8\\text{ cm}$. Đường cao $AH$ có độ dài là:',
          options: ['A. $4{,}8\\text{ cm}$', 'B. $5{,}0\\text{ cm}$', 'C. $4{,}2\\text{ cm}$', 'D. $7{,}0\\text{ cm}$'],
          correctIndex: 0,
          explanation: 'Cạnh huyền $BC = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$. Từ $AH \\cdot BC = AB \\cdot AC \\implies AH = \\frac{48}{10} = 4{,}8\\text{ cm}$.'
        }
      ],
      miniEssay: {
        id: 'm93-s1-e1',
        question: 'Tam giác $ABC$ vuông tại $A$, đường cao $AH = 12\\text{ cm}$, hình chiếu $BH = 9\\text{ cm}$. Tính độ dài $CH$, $BC$, $AB$ và $AC$.',
        hint: 'Dùng $AH^2 = BH \\cdot CH$ để tìm $CH$, rồi tính $BC = BH + CH$, sau đó dùng Pytago hoặc hệ thức $b^2 = a\\cdot b\'$.',
        rubricChecklist: [
          'Tìm được $CH = \\frac{144}{9} = 16\\text{ cm}$.',
          'Tính $BC = 9 + 16 = 25\\text{ cm}$.',
          'Tính đúng $AB = 15\\text{ cm}$ và $AC = 20\\text{ cm}$.'
        ],
        sampleAnswer:
          'Ta có $AH^2 = BH \\cdot CH \\implies CH = \\frac{12^2}{9} = 16\\text{ cm}$. Suy ra $BC = 9 + 16 = 25\\text{ cm}$. Lại có $AB^2 = BH \\cdot BC = 9 \\cdot 25 = 225 \\implies AB = 15\\text{ cm}$; $AC^2 = CH \\cdot BC = 16 \\cdot 25 = 400 \\implies AC = 20\\text{ cm}$.'
      }
    },
    {
      stepTitle: '2. Tỉ số Lượng giác Góc nhọn & Bảng góc đặc biệt',
      stepType: 'derivation',
      conceptSection:
        'Trong tam giác vuông có góc nhọn $\\alpha$, bốn tỉ số lượng giác $\\sin\\alpha, \\cos\\alpha, \\tan\\alpha, \\cot\\alpha$ không phụ thuộc vào kích thước tam giác mà chỉ phụ thuộc vào độ lớn góc $\\alpha$.',
      formulaSection: {
        primaryFormula: '\\sin\\alpha = \\frac{\\text{Đối}}{\\text{Huyền}}, \\qquad \\cos\\alpha = \\frac{\\text{Kề}}{\\text{Huyền}}',
        secondaryFormulas: [
          '\\tan\\alpha = \\frac{\\text{Đối}}{\\text{Kề}} = \\frac{\\sin\\alpha}{\\cos\\alpha}, \\qquad \\sin^2\\alpha + \\cos^2\\alpha = 1',
          '\\alpha + \\beta = 90^\\circ \\implies \\sin\\alpha = \\cos\\beta,\\ \\tan\\alpha = \\cot\\beta'
        ],
        variablesNote:
          '• Mẹo đọc: *"Sin đi học (Đối/Huyền), Cos không hư (Kề/Huyền), Tan đoàn kết (Đối/Kề), Cot kết đoàn (Kề/Đối)"*.\n• Với mọi góc nhọn: $0 < \\sin\\alpha < 1$ và $0 < \\cos\\alpha < 1$.'
      },
      deepDiveSection:
        'Trong các bài toán thực tế đo chiều cao tháp, góc nâng của máy bay hay độ nghiêng mái nhà, bước quan trọng nhất là vẽ đúng tam giác vuông chứa góc quan sát, xác định rõ cạnh kề hay cạnh đối đã biết rồi mới chọn $\\sin$, $\\cos$ hoặc $\\tan$.',
      teacherExplanation: 'Hai góc phụ nhau thì chéo nhau ($\\sin$ góc này bằng $\\cos$ góc kia).',
      keyTakeaway: 'Dùng $\\sin^2\\alpha + \\cos^2\\alpha = 1$ để quy đổi nhanh giữa $\\sin$ và $\\cos$ của cùng một góc nhọn.',
      miniQuiz: [
        {
          id: 'm93-s2-q1',
          question: 'Cho góc nhọn $\\alpha$ thỏa mãn $\\sin\\alpha = \\frac{3}{5}$. Giá trị của $\\cos\\alpha$ bằng:',
          options: ['A. $\\frac{4}{5}$', 'B. $\\frac{2}{5}$', 'C. $\\frac{3}{4}$', 'D. $\\frac{5}{4}$'],
          correctIndex: 0,
          explanation: '$\\cos^2\\alpha = 1 - \\sin^2\\alpha = 1 - \\frac{9}{25} = \\frac{16}{25} \\implies \\cos\\alpha = \\frac{4}{5}$ (vì $\\alpha$ nhọn).'
        },
        {
          id: 'm93-s2-q2',
          question: 'Một cái thang dài $4\\text{ m}$ dựa vào tường tạo với mặt đất góc $60^\\circ$. Chiều cao từ mặt đất tới đầu thang là:',
          options: ['A. $2\\sqrt{3}\\text{ m}$', 'B. $2\\text{ m}$', 'C. $4\\sqrt{3}\\text{ m}$', 'D. $\\frac{4}{\\sqrt{3}}\\text{ m}$'],
          correctIndex: 0,
          explanation: 'Cạnh đối góc $60^\\circ$ là $h = L \\cdot \\sin 60^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} = 2\\sqrt{3}\\text{ m}$.'
        }
      ],
      miniEssay: {
        id: 'm93-s2-e1',
        question: 'Không dùng máy tính, hãy rút gọn và tính giá trị biểu thức $P = \\sin^2 25^\\circ + \\sin^2 65^\\circ + \\tan 38^\\circ \\cdot \\tan 52^\\circ$.',
        hint: 'Chú ý $25^\\circ + 65^\\circ = 90^\\circ$ và $38^\\circ + 52^\\circ = 90^\\circ$, áp dụng tính chất hai góc phụ nhau.',
        rubricChecklist: [
          'Đổi $\\sin 65^\\circ = \\cos 25^\\circ$ và áp dụng $\\sin^2 25^\\circ + \\cos^2 25^\\circ = 1$.',
          'Đổi $\\tan 52^\\circ = \\cot 38^\\circ$ và áp dụng $\\tan 38^\\circ \\cdot \\cot 38^\\circ = 1$.',
          'Cộng kết quả $P = 1 + 1 = 2$.'
        ],
        sampleAnswer:
          'Vì $25^\\circ + 65^\\circ = 90^\\circ$ nên $\\sin 65^\\circ = \\cos 25^\\circ$, suy ra $\\sin^2 25^\\circ + \\sin^2 65^\\circ = \\sin^2 25^\\circ + \\cos^2 25^\\circ = 1$. Vì $38^\\circ + 52^\\circ = 90^\\circ$ nên $\\tan 52^\\circ = \\cot 38^\\circ$, suy ra $\\tan 38^\\circ \\cdot \\tan 52^\\circ = \\tan 38^\\circ \\cdot \\cot 38^\\circ = 1$. Do đó $P = 1 + 1 = 2$.'
      }
    },
    {
      stepTitle: '3. Góc với Đường tròn: Góc ở Tâm, Góc Nội tiếp & Góc Tạo bởi Tiếp tuyến',
      stepType: 'example',
      conceptSection:
        'Trong đường tròn $(O)$, các góc không đứng độc lập mà liên kết với nhau qua số đo cung bị chắn: góc ở tâm bằng đúng số đo cung bị chắn, còn góc nội tiếp và góc tạo bởi tia tiếp tuyến và dây cung bằng nửa số đo cung bị chắn.',
      formulaSection: {
        primaryFormula: '\\widehat{ACB} = \\frac{1}{2}\\widehat{AOB} = \\frac{1}{2}\\text{sđ}\\overset{\\frown}{AB}',
        secondaryFormulas: [
          '\\text{Góc nội tiếp chắn nửa đường tròn } = 90^\\circ',
          '\\widehat{xAB} = \\widehat{ACB} \\quad (\\text{cùng chắn cung } AB)'
        ],
        variablesNote:
          '• $\\widehat{AOB}$: góc ở tâm; $\\widehat{ACB}$: góc nội tiếp; $\\widehat{xAB}$: góc tạo bởi tiếp tuyến $Ax$ và dây $AB$.\n• Các góc nội tiếp cùng chắn một cung (hoặc hai cung bằng nhau) thì bằng nhau.'
      },
      deepDiveSection:
        'Trong bài hình tổng hợp thi vào 10, cặp góc "tạo bởi tia tiếp tuyến và dây cung" và "góc nội tiếp cùng chắn cung đó" là vũ khí số 1 để chứng minh hai tam giác đồng dạng dạng tiếp tuyến: $MA^2 = MB \\cdot MC$ (với $MA$ là tiếp tuyến, $MBC$ là cát tuyến).',
      teacherExplanation: 'Thấy tiếp tuyến $MA$ và cát tuyến $MBC$, nghĩ ngay tới cặp góc cùng chắn cung $AB$ để ra $MA^2 = MB\\cdot MC$.',
      keyTakeaway: 'Góc nội tiếp chắn nửa đường tròn luôn bằng $90^\\circ$ — cầu nối trực tiếp tới tính chất vuông góc.',
      miniQuiz: [
        {
          id: 'm93-s3-q1',
          question: 'Cho đường tròn $(O)$ và hai điểm $A, B$ thuộc đường tròn sao cho $\\widehat{AOB} = 110^\\circ$. Lấy điểm $C$ trên cung lớn $AB$. Số đo góc $\\widehat{ACB}$ bằng:',
          options: ['A. $55^\\circ$', 'B. $110^\\circ$', 'C. $125^\\circ$', 'D. $70^\\circ$'],
          correctIndex: 0,
          explanation: 'Góc nội tiếp $\\widehat{ACB}$ chắn cung nhỏ $AB$ bằng một nửa góc ở tâm $\\widehat{AOB}$: $110^\\circ / 2 = 55^\\circ$.'
        },
        {
          id: 'm93-s3-q2',
          question: 'Cho $MA$ là tiếp tuyến của $(O)$ tại $A$ và cát tuyến $MBC$ ($B$ nằm giữa $M$ và $C$). Đẳng thức nào luôn đúng?',
          options: ['A. $MA^2 = MB \\cdot MC$', 'B. $MA^2 = MB \\cdot BC$', 'C. $MA = \\frac{MB + MC}{2}$', 'D. $MB^2 = MA \\cdot MC$'],
          correctIndex: 0,
          explanation: '$\\triangle MAB \\sim \\triangle MCA$ (g.g vì có $\\widehat{M}$ chung và $\\widehat{MAB} = \\widehat{MCA}$) $\\implies \\frac{MA}{MC} = \\frac{MB}{MA} \\implies MA^2 = MB \\cdot MC$.'
        }
      ],
      miniEssay: {
        id: 'm93-s3-e1',
        question: 'Cho tam giác $ABC$ có 3 góc nhọn nội tiếp $(O)$, $AD$ là đường cao. Kẻ đường kính $AK$ của $(O)$. Chứng minh rằng $\\triangle ABD \\sim \\triangle AKC$.',
        hint: 'Chỉ ra góc nội tiếp chắn nửa đường tròn $\\widehat{ACK} = 90^\\circ$ và cặp góc nội tiếp cùng chắn cung $AC$.',
        rubricChecklist: [
          'Chỉ ra $\\widehat{ADB} = 90^\\circ$ (gt) và $\\widehat{ACK} = 90^\\circ$ (góc nội tiếp chắn nửa đường tròn).',
          'Chỉ ra $\\widehat{ABD} = \\widehat{AKC}$ (hai góc nội tiếp cùng chắn cung $AC$).',
          'Kết luận $\\triangle ABD \\sim \\triangle AKC$ (g.g) và viết đúng thứ tự đỉnh.'
        ],
        sampleAnswer:
          'Xét $\\triangle ABD$ và $\\triangle AKC$ có: $\\widehat{ADB} = 90^\\circ$ ($AD \\perp BC$); $\\widehat{ACK} = 90^\\circ$ (góc nội tiếp chắn nửa đường tròn đường kính $AK$); $\\widehat{ABD} = \\widehat{AKC}$ (hai góc nội tiếp cùng chắn cung $AC$ của $(O)$). Suy ra $\\triangle ABD \\sim \\triangle AKC$ (g.g).'
      }
    }
  ],
  'math-9-4': [
    {
      stepTitle: '1. Điều kiện Xác định của Căn bậc hai & Hằng đẳng thức $\\sqrt{A^2} = |A|$',
      stepType: 'concept',
      conceptSection:
        'Biểu thức $\\sqrt{A}$ chỉ có nghĩa (xác định trên $\\mathbb{R}$) khi biểu thức lấy căn không âm ($A \\ge 0$). Khai phương một bình phương luôn tạo ra giá trị tuyệt đối $|A|$, KHÔNG BAO GIỜ tự ý bỏ dấu giá trị tuyệt đối nếu chưa biết dấu của $A$.',
      formulaSection: {
        primaryFormula: '\\sqrt{A^2} = |A| = \\begin{cases} A & \\text{khi } A \\ge 0 \\\\ -A & \\text{khi } A < 0 \\end{cases}',
        secondaryFormulas: [
          '\\sqrt{A} \\text{ có nghĩa} \\iff A \\ge 0',
          '\\frac{1}{\\sqrt{A}} \\text{ có nghĩa} \\iff A > 0'
        ],
        variablesNote:
          '• Khi rút gọn $\\sqrt{a \\pm 2\\sqrt{b}}$, tách thành bình phương $(\\sqrt{x} \\pm \\sqrt{y})^2$ và nhớ kiểm tra số nào lớn hơn để bỏ trị tuyệt đối đúng dấu!\n• Ví dụ: $\\sqrt{(2 - \\sqrt{5})^2} = |2 - \\sqrt{5}| = \\sqrt{5} - 2$ (vì $2 = \\sqrt{4} < \\sqrt{5}$).'
      },
      deepDiveSection:
        'Sai lầm phổ biến nhất của học sinh lớp 9 khi làm câu 1 rút gọn biểu thức là viết $\\sqrt{x^2} = x$ mà quên xét $x < 0$, hoặc quên kết hợp điều kiện ở mẫu khi tìm $x$ để $P = \\dots$ rồi không loại nghiệm ngoại lai.',
      teacherExplanation: 'Mọi phép khai phương bình phương đều phải qua lớp bảo vệ trị tuyệt đối $|A|$ rồi mới xét dấu để mở ngoặc.',
      keyTakeaway: '$\\sqrt{A^2} = |A|$ — tuyệt đối không bỏ $|\\cdot|$ khi chưa biết rõ dấu của $A$.',
      miniQuiz: [
        {
          id: 'm94-s1-q1',
          question: 'Biểu thức $\\frac{1}{\\sqrt{2x - 6}}$ có nghĩa khi và chỉ khi:',
          options: ['A. $x > 3$', 'B. $x \\ge 3$', 'C. $x \\neq 3$', 'D. $x < 3$'],
          correctIndex: 0,
          explanation: 'Vì $\\sqrt{2x - 6}$ nằm ở mẫu nên cần $2x - 6 > 0 \\iff x > 3$.'
        },
        {
          id: 'm94-s1-q2',
          question: 'Rút gọn biểu thức $M = \\sqrt{(3 - \\sqrt{11})^2} - \\sqrt{11}$ ta được:',
          options: ['A. $-3$', 'B. $3 - 2\\sqrt{11}$', 'C. $3$', 'D. $2\\sqrt{11} - 3$'],
          correctIndex: 0,
          explanation: 'Vì $3 = \\sqrt{9} < \\sqrt{11}$ nên $|3 - \\sqrt{11}| = \\sqrt{11} - 3$. Vậy $M = \\sqrt{11} - 3 - \\sqrt{11} = -3$.'
        }
      ],
      miniEssay: {
        id: 'm94-s1-e1',
        question: 'Rút gọn biểu thức $A = \\sqrt{7 - 4\\sqrt{3}} + \\sqrt{7 + 4\\sqrt{3}}$.',
        hint: 'Nhận thấy $7 \\pm 4\\sqrt{3} = 4 \\pm 2\\cdot 2\\sqrt{3} + 3 = (2 \\pm \\sqrt{3})^2$. Kiểm tra dấu của $2 - \\sqrt{3}$.',
        rubricChecklist: [
          'Viết đúng hằng đẳng thức $(2 - \\sqrt{3})^2$ và $(2 + \\sqrt{3})^2$.',
          'Đưa ra $|2 - \\sqrt{3}| + |2 + \\sqrt{3}|$.',
          'So sánh $2 = \\sqrt{4} > \\sqrt{3}$ để rút gọn đúng kết quả $A = 4$.'
        ],
        sampleAnswer:
          'Ta có $7 - 4\\sqrt{3} = (2 - \\sqrt{3})^2$ và $7 + 4\\sqrt{3} = (2 + \\sqrt{3})^2$. Do đó $A = |2 - \\sqrt{3}| + |2 + \\sqrt{3}|$. Vì $2 > \\sqrt{3}$ nên $2 - \\sqrt{3} > 0$. Suy ra $A = (2 - \\sqrt{3}) + (2 + \\sqrt{3}) = 4$.'
      }
    },
    {
      stepTitle: '2. Trục căn thức ở Mẫu & Các Phép biến đổi Căn thức',
      stepType: 'derivation',
      conceptSection:
        'Để cộng trừ các phân thức chứa căn ở mẫu, ta dùng phép nhân cả tử và mẫu với biểu thức liên hợp nhằm khử căn khỏi mẫu số (hằng đẳng thức hiệu hai bình phương $a^2 - b^2$).',
      formulaSection: {
        primaryFormula: '\\frac{M}{\\sqrt{A} \\pm \\sqrt{B}} = \\frac{M(\\sqrt{A} \\mp \\sqrt{B})}{A - B} \\quad (A, B \\ge 0,\\ A \\neq B)',
        secondaryFormulas: [
          '\\sqrt{A \\cdot B} = \\sqrt{A}\\cdot\\sqrt{B} \\quad (A, B \\ge 0)',
          '\\sqrt[3]{A^3} = A \\quad (\\text{mọi } A \\in \\mathbb{R}, \\text{ không có trị tuyệt đối})'
        ],
        variablesNote:
          '• Trước khi quy đồng cồng kềnh, hãy kiểm tra xem tử và mẫu có thể **phân tích thành nhân tử để rút gọn ngay** (ví dụ $x - 4 = (\\sqrt{x}-2)(\\sqrt{x}+2)$).\n• Căn bậc ba xác định với mọi $A \\in \\mathbb{R}$, không cần điều kiện không âm.'
      },
      deepDiveSection:
        'Với bài rút gọn biểu thức $P(x)$ trong đề thi vào 10, quy trình chuẩn 4 bước: (1) Kiểm tra điều kiện xác định đề cho; (2) Phân tích các mẫu thành nhân tử dạng $(\\sqrt{x} - a)(\\sqrt{x} + b)$; (3) Quy đồng và khai triển cẩn thận dấu trừ trước phân thức; (4) Rút gọn tử-mẫu trước khi trả lời các câu hỏi phụ.',
      teacherExplanation: 'Luôn phân tích mẫu thành nhân tử trước khi quy đồng; đặc biệt cẩn trọng với dấu trừ phía trước phân thức.',
      keyTakeaway: 'Dùng liên hợp $(\\sqrt{A} - \\sqrt{B})(\\sqrt{A} + \\sqrt{B}) = A - B$ để trục căn ở mẫu.',
      miniQuiz: [
        {
          id: 'm94-s2-q1',
          question: 'Trục căn thức ở mẫu của phân thức $\\frac{4}{\\sqrt{5} - 1}$ ta được:',
          options: ['A. $\\sqrt{5} + 1$', 'B. $\\sqrt{5} - 1$', 'C. $4(\\sqrt{5} + 1)$', 'D. $\\frac{\\sqrt{5}+1}{2}$'],
          correctIndex: 0,
          explanation: '$\\frac{4(\\sqrt{5} + 1)}{(\\sqrt{5})^2 - 1^2} = \\frac{4(\\sqrt{5} + 1)}{4} = \\sqrt{5} + 1$.'
        },
        {
          id: 'm94-s2-q2',
          question: 'Với $x \\ge 0, x \\neq 9$, biểu thức $\\frac{x - 9}{\\sqrt{x} + 3}$ rút gọn thành:',
          options: ['A. $\\sqrt{x} - 3$', 'B. $\\sqrt{x} + 3$', 'C. $x - 3$', 'D. $3 - \\sqrt{x}$'],
          correctIndex: 0,
          explanation: '$x - 9 = (\\sqrt{x} - 3)(\\sqrt{x} + 3)$, chia cho $\\sqrt{x} + 3$ còn $\\sqrt{x} - 3$.'
        }
      ],
      miniEssay: {
        id: 'm94-s2-e1',
        question: 'Với $x \\ge 0$ và $x \\neq 1$, rút gọn biểu thức $P = \\frac{2\\sqrt{x}}{\\sqrt{x}+1} + \\frac{1}{\\sqrt{x}-1} - \\frac{3\\sqrt{x}+1}{x - 1}$.',
        hint: 'Phân tích $x - 1 = (\\sqrt{x}-1)(\\sqrt{x}+1)$ làm mẫu thức chung, quy đồng và rút gọn tử thức.',
        rubricChecklist: [
          'Chọn đúng mẫu chung $(\\sqrt{x}-1)(\\sqrt{x}+1)$.',
          'Quy đồng đúng dấu trừ ở phân thức thứ ba: $-(3\\sqrt{x} + 1) = -3\\sqrt{x} - 1$.',
          'Rút gọn tử thức thành $2x - 4\\sqrt{x} = 2\\sqrt{x}(\\sqrt{x}-2)$ hoặc kiểm tra chính xác phép tính.'
        ],
        sampleAnswer:
          'Mẫu thức chung là $(\\sqrt{x}-1)(\\sqrt{x}+1)$. Tử thức bằng $2\\sqrt{x}(\\sqrt{x}-1) + (\\sqrt{x}+1) - (3\\sqrt{x}+1) = 2x - 2\\sqrt{x} + \\sqrt{x} + 1 - 3\\sqrt{x} - 1 = 2x - 4\\sqrt{x}$. Vậy $P = \\frac{2\\sqrt{x}(\\sqrt{x} - 2)}{x - 1}$.'
      }
    },
    {
      stepTitle: '3. Các Câu hỏi Phụ Nâng cao sau Rút gọn Biểu thức thi vào 10',
      stepType: 'example',
      conceptSection:
        'Sau khi rút gọn xong biểu thức $P(x)$, đề thi vào 10 luôn có câu hỏi phụ (0,5–1,0 điểm): tìm $x$ để $P > a$, tìm giá trị lớn nhất/nhỏ nhất của $P$, hoặc tìm $x \\in \\mathbb{Z}$ (hoặc $x \\in \\mathbb{R}$) để $P$ nhận giá trị nguyên.',
      formulaSection: {
        primaryFormula: 'P = k + \\frac{c}{\\sqrt{x} + d} \\in \\mathbb{Z} \\implies \\text{chia 2 dạng: } x \\in \\mathbb{Z} \\text{ hay } x \\in \\mathbb{R}',
        secondaryFormulas: [
          'x \\in \\mathbb{Z}: \\text{ xét } (\\sqrt{x} + d) \\in \\text{Ư}(c)',
          'x \\in \\mathbb{R}: \\text{ kẹp miền giá trị } m < P < M \\text{ rồi liệt kê } P \\in \\mathbb{Z}'
        ],
        variablesNote:
          '• **Bẫy chết người**: Phải đọc cực kỹ đề hỏi *"Tìm các giá trị nguyên của $x$"* hay *"Tìm tất cả các giá trị thực của $x$ để $P$ nguyên"*!\n• Với $P > a$, KHÔNG được nhân chéo mẫu chứa biến nếu chưa xét dấu của mẫu; hãy chuyển vế $P - a > 0$ và quy đồng.'
      },
      deepDiveSection:
        'Khi tìm $x \\in \\mathbb{R}$ để $P = \\frac{4}{\\sqrt{x} + 1}$ nhận giá trị nguyên: vì $\\sqrt{x} \\ge 0 \\implies \\sqrt{x} + 1 \\ge 1 \\implies 0 < P \\le 4$. Vì $P$ nguyên nên $P \\in \\{1; 2; 3; 4\\}$, từ đó giải ra $x$ (kể cả $x$ là phân số như $\\frac{1}{9}$ vẫn nhận nếu đề nói $x \\in \\mathbb{R}$!).',
      teacherExplanation: 'Khi giải bất phương trình chứa biến ở mẫu $P > a$, luôn chuyển $a$ sang vế trái rồi quy đồng xét dấu, không nhân chéo tùy tiện.',
      keyTakeaway: 'Phân biệt rạch ròi bài toán tìm $x \\in \\mathbb{Z}$ (dùng ước số) và $x \\in \\mathbb{R}$ (dùng kẹp khoảng giá trị) để $P$ nguyên.',
      miniQuiz: [
        {
          id: 'm94-s3-q1',
          question: 'Với $x \\ge 0$, tìm tất cả các giá trị thực của $x$ để $P = \\frac{3}{\\sqrt{x} + 1}$ nhận giá trị nguyên.',
          options: [
            'A. $x \\in \\{0; 4; \\frac{1}{4}\\}$',
            'B. $x \\in \\{0; 4\\}$',
            'C. $x \\in \\{1; 2; 3\\}$',
            'D. $x \\in \\{0; 1; 4\\}$'
          ],
          correctIndex: 0,
          explanation: 'Do $\\sqrt{x} + 1 \\ge 1$ nên $0 < P \\le 3$. Vậy $P \\in \\{1; 2; 3\\}$, lần lượt cho $\\sqrt{x} = 2 \\implies x = 4$; $\\sqrt{x} = \\frac{1}{2} \\implies x = \\frac{1}{4}$; $\\sqrt{x} = 0 \\implies x = 0$.'
        },
        {
          id: 'm94-s3-q2',
          question: 'Cho $Q = \\frac{\\sqrt{x} - 2}{\\sqrt{x} + 1}$ ($x \\ge 0$). Có bao nhiêu giá trị nguyên của $x$ để $Q < 0$?',
          options: ['A. $4$', 'B. $3$', 'C. $2$', 'D. Vô số'],
          correctIndex: 0,
          explanation: 'Vì mẫu $\\sqrt{x} + 1 > 0$ nên $Q < 0 \\iff \\sqrt{x} - 2 < 0 \\iff 0 \\le x < 4$. Các số nguyên là $0, 1, 2, 3$ (4 giá trị).'
        }
      ],
      miniEssay: {
        id: 'm94-s3-e1',
        question: 'Cho $P = \\frac{\\sqrt{x} + 5}{\\sqrt{x} + 2}$ với $x \\ge 0$. Tìm tất cả các giá trị nguyên của $x$ để $P$ nhận giá trị nguyên.',
        hint: 'Tách $P = 1 + \\frac{3}{\\sqrt{x} + 2}$. Vì $x \\in \\mathbb{Z}$ và $\\sqrt{x}+2 \\ge 2$, xét ước nguyên của $3$ lớn hơn hoặc bằng $2$.',
        rubricChecklist: [
          'Tách đúng phần nguyên: $P = 1 + \\frac{3}{\\sqrt{x} + 2}$.',
          'Nhận xét $\\sqrt{x} + 2 \\ge 2$ và giải $(\\sqrt{x} + 2) \\in \\text{Ư}(3)$ suy ra $\\sqrt{x} + 2 = 3$.',
          'Tìm ra $x = 1$ (thỏa $x \\ge 0$ và nguyên) và kết luận.'
        ],
        sampleAnswer:
          'Ta có $P = \\frac{(\\sqrt{x} + 2) + 3}{\\sqrt{x} + 2} = 1 + \\frac{3}{\\sqrt{x} + 2}$. Để $P \\in \\mathbb{Z}$ với $x \\in \\mathbb{Z}$ ($x \\ge 0$), thì $\\sqrt{x}$ phải nguyên (hoặc xét $\\sqrt{x} + 2 \\in \\text{Ư}(3)$ vì tử là $3$). Do $\\sqrt{x} + 2 \\ge 2$ nên chỉ có $\\sqrt{x} + 2 = 3 \\iff \\sqrt{x} = 1 \\iff x = 1$ (thỏa mãn).'
      }
    }
  ],
  'math-9-5': [
    {
      stepTitle: '1. Hệ Phương trình Bậc nhất Hai ẩn & Hai Phương pháp Giải chuẩn',
      stepType: 'concept',
      conceptSection:
        'Hệ hai phương trình bậc nhất hai ẩn có dạng $\\begin{cases} ax + by = c \\\\ a\'x + b\'y = c\' \\end{cases}$. Giải hệ là tìm cặp $(x; y)$ thỏa mãn đồng thời cả hai phương trình bằng hai phương pháp chủ đạo: Thế và Cộng đại số.',
      formulaSection: {
        primaryFormula: '\\begin{cases} ax + by = c \\\\ a\'x + b\'y = c\' \\end{cases}',
        secondaryFormulas: [
          '\\frac{a}{a\'} \\neq \\frac{b}{b\'} \\implies \\text{hệ có nghiệm duy nhất}',
          '\\frac{a}{a\'} = \\frac{b}{b\'} \\neq \\frac{c}{c\'} \\implies \\text{vô nghiệm}; \\quad \\frac{a}{a\'} = \\frac{b}{b\'} = \\frac{c}{c\'} \\implies \\text{vô số nghiệm}'
        ],
        variablesNote:
          '• **Phương pháp Cộng đại số** tối ưu khi hệ số của $x$ hoặc $y$ bằng nhau hoặc đối nhau (hoặc dễ nhân bội chung nhỏ nhất).\n• **Phương pháp Thế** rất tiện khi có một hệ số bằng $\\pm 1$ (rút trực tiếp $x = \\dots$ hoặc $y = \\dots$).'
      },
      deepDiveSection:
        'Về ý nghĩa hình học, nghiệm $(x_0; y_0)$ chính là tọa độ giao điểm của hai đường thẳng $ax + by = c$ và $a\'x + b\'y = c\'$. Khi hai đường thẳng song song thì hệ vô nghiệm; khi trùng nhau thì hệ có vô số nghiệm.',
      teacherExplanation: 'Kiểm tra nhanh tỷ số $\\frac{a}{a\'}$ và $\\frac{b}{b\'}$ để biết ngay hệ có nghiệm duy nhất hay không.',
      keyTakeaway: 'Cộng đại số khử ẩn nhanh; nhớ kiểm tra lại nghiệm bằng cách thế vào cả 2 phương trình.',
      miniQuiz: [
        {
          id: 'm95-s1-q1',
          question: 'Nghiệm của hệ phương trình $\\begin{cases} 2x + y = 5 \\\\ x - y = 1 \\end{cases}$ là:',
          options: ['A. $(2; 1)$', 'B. $(1; 3)$', 'C. $(3; -1)$', 'D. $(2; -1)$'],
          correctIndex: 0,
          explanation: 'Cộng từng vế hai phương trình: $3x = 6 \\implies x = 2$, suy ra $y = 2 - 1 = 1$.'
        },
        {
          id: 'm95-s1-q2',
          question: 'Với giá trị nào của $m$ thì hệ $\\begin{cases} mx + 2y = 4 \\\\ 3x + y = 1 \\end{cases}$ vô nghiệm?',
          options: ['A. $m = 6$', 'B. $m = -6$', 'C. $m = 3$', 'D. $m \\neq 6$'],
          correctIndex: 0,
          explanation: 'Hệ vô nghiệm khi $\\frac{m}{3} = \\frac{2}{1} \\neq \\frac{4}{1} \\iff m = 6$.'
        }
      ],
      miniEssay: {
        id: 'm95-s1-e1',
        question: 'Giải hệ phương trình $\\begin{cases} 3x - 2y = 11 \\\\ 4x + 3y = -2 \\end{cases}$ bằng phương pháp cộng đại số.',
        hint: 'Nhân phương trình 1 với $3$, nhân phương trình 2 với $2$ để hệ số của $y$ đối nhau ($-6y$ và $+6y$).',
        rubricChecklist: [
          'Nhân hệ số chính xác để đưa về $9x - 6y = 33$ và $8x + 6y = -4$.',
          'Cộng hai vế tìm đúng $x = \\frac{29}{17}$ hoặc kiểm tra lại hệ số nguyên.',
          'Tính đúng $y = -\\frac{50}{17}$ và kết luận cặp nghiệm $(x; y)$.'
        ],
        sampleAnswer:
          'Nhân phương trình đầu với $3$ và phương trình sau với $2$: $\\begin{cases} 9x - 6y = 33 \\\\ 8x + 6y = -4 \\end{cases}$. Cộng hai phương trình theo vế: $17x = 29 \\implies x = \\frac{29}{17}$. Thay lại phương trình đầu: $y = \\frac{3x - 11}{2} = \\frac{\\frac{87}{17} - 11}{2} = -\\frac{50}{17}$. Nghiệm duy nhất là $(\\frac{29}{17}; -\\frac{50}{17})$.'
      }
    },
    {
      stepTitle: '2. Kỹ thuật Đặt Ẩn phụ cho Hệ Phương trình Phức tạp',
      stepType: 'derivation',
      conceptSection:
        'Nhiều hệ phương trình không có dạng bậc nhất chuẩn mà chứa phân thức $\\frac{1}{x - a}$, căn thức $\\sqrt{x + b}$ hoặc giá trị tuyệt đối $|y - c|$. Ta đặt ẩn phụ $u, v$ để đưa về hệ bậc nhất hai ẩn quen thuộc.',
      formulaSection: {
        primaryFormula: 'u = \\frac{1}{x - a}, \\quad v = \\sqrt{y + b} \\ (v \\ge 0)',
        secondaryFormulas: [
          '\\text{Điều kiện phân thức: } x - a \\neq 0',
          '\\text{Điều kiện căn thức / trị tuyệt đối: } u \\ge 0,\\ v \\ge 0'
        ],
        variablesNote:
          '• **Điều kiện đặt ẩn phụ**: Nếu $v = \\sqrt{\\dots}$ hoặc $v = |\\dots|$ thì nhất thiết phải ghi điều kiện $v \\ge 0$.\n• Giải xong $(u; v)$ nhớ đối chiếu điều kiện rồi mới trả ẩn về $(x; y)$.'
      },
      deepDiveSection:
        'Một biến thể hay gặp là tử thức chưa bằng $1$, chẳng hạn $\\frac{2x + 1}{x - 1} = 2 + \\frac{3}{x - 1}$. Tách phần nguyên trước khi đặt $u = \\frac{1}{x - 1}$ sẽ biến hệ tưởng như rất phức tạp thành hệ 2 ẩn cực gọn.',
      teacherExplanation: 'Đặt ẩn phụ xong nhớ ghi ngay điều kiện ràng buộc cho ẩn mới ($v \\ge 0$ nếu là căn hoặc trị tuyệt đối).',
      keyTakeaway: 'Tách phần nguyên các phân thức đồng bậc rồi đặt ẩn phụ $u, v$ để đưa về hệ bậc nhất.',
      miniQuiz: [
        {
          id: 'm95-s2-q1',
          question: 'Giải hệ $\\begin{cases} \\frac{2}{x} + \\frac{3}{y} = 5 \\\\ \\frac{1}{x} - \\frac{1}{y} = 0 \\end{cases}$ (với $x, y \\neq 0$). Nghiệm $(x; y)$ là:',
          options: ['A. $(1; 1)$', 'B. $(2; 2)$', 'C. $(-1; -1)$', 'D. $(1; -1)$'],
          correctIndex: 0,
          explanation: 'Đặt $u = 1/x, v = 1/y$. Từ $u - v = 0 \\implies u = v$. Thay vào PT1: $5u = 5 \\implies u = v = 1 \\implies x = y = 1$.'
        },
        {
          id: 'm95-s2-q2',
          question: 'Cho hệ $\\begin{cases} \\sqrt{x - 1} + 2|y| = 5 \\\\ 3\\sqrt{x - 1} - |y| = 1 \\end{cases}$. Điều kiện xác định của $x$ và nghiệm $(x; y)$ có thể nhận là:',
          options: ['A. $x = 2, y = \\pm 2$', 'B. $x = 1, y = 2$', 'C. $x = 5, y = \\pm 1$', 'D. $x = 2, y = 2$ (duy nhất)'],
          correctIndex: 0,
          explanation: 'Đặt $u = \\sqrt{x-1} \\ge 0, v = |y| \\ge 0$. Giải hệ cho $u = 1 \\implies x = 2$; $v = 2 \\implies |y| = 2 \\implies y = \\pm 2$. Hệ có 2 nghiệm $(2; 2)$ và $(2; -2)$!'
        }
      ],
      miniEssay: {
        id: 'm95-s2-e1',
        question: 'Giải hệ phương trình $\\begin{cases} \\frac{1}{x - 2} + \\frac{2}{y + 1} = 4 \\\\ \\frac{3}{x - 2} - \\frac{1}{y + 1} = 5 \\end{cases}$.',
        hint: 'Đặt điều kiện $x \\neq 2, y \\neq -1$, rồi đặt $u = \\frac{1}{x-2}, v = \\frac{1}{y+1}$.',
        rubricChecklist: [
          'Nêu đúng điều kiện xác định $x \\neq 2$ và $y \\neq -1$.',
          'Giải hệ ẩn $(u, v)$ ra đúng $u = 2, v = 1$.',
          'Trả ẩn ra đúng $x = \\frac{5}{2}, y = 0$ (thỏa ĐKXĐ).'
        ],
        sampleAnswer:
          'ĐKXĐ: $x \\neq 2, y \\neq -1$. Đặt $u = \\frac{1}{x - 2}$, $v = \\frac{1}{y + 1}$. Hệ trở thành $\\begin{cases} u + 2v = 4 \\\\ 3u - v = 5 \\end{cases}$. Nhân PT2 với $2$ rồi cộng lại: $7u = 14 \\implies u = 2 \\implies v = 1$. Từ đó $x - 2 = \\frac{1}{2} \\implies x = \\frac{5}{2}$ và $y + 1 = 1 \\implies y = 0$ (thỏa mãn ĐKXĐ).'
      }
    },
    {
      stepTitle: '3. Giải Bài toán Thực tế Bằng Hệ Phương trình (Chuyển động – Năng suất – Phần trăm)',
      stepType: 'example',
      conceptSection:
        'Giải bài toán bằng cách lập hệ phương trình thường trực quan hơn lập một phương trình vì ta gọi trực tiếp hai đại lượng đề bài hỏi làm hai ẩn $x, y$, rồi chuyển hai dữ kiện độc lập trong đề thành hai phương trình.',
      formulaSection: {
        primaryFormula: '\\text{Công việc chung: } \\frac{1}{x} + \\frac{1}{y} = \\frac{1}{T_{\\text{chung}}}',
        secondaryFormulas: [
          'v_{\\text{xuôi}} = v_{\\text{thực}} + v_{\\text{nước}}, \\quad v_{\\text{ngược}} = v_{\\text{thực}} - v_{\\text{nước}}',
          '\\text{Tăng } a\\% \\implies (1 + \\frac{a}{100})x'
        ],
        variablesNote:
          '• **Đổi đơn vị**: Thời gian luôn đổi đồng bộ về giờ (ví dụ $20\\text{ phút} = \\frac{1}{3}\\text{ giờ}$).\n• Nếu làm chung $T$ giờ xong $1$ công việc thì tổng năng suất 1 giờ là $\\frac{1}{T}$, chứ không phải $x + y = T$!'
      },
      deepDiveSection:
        'Với bài toán làm chung – làm riêng, ẩn $x, y$ là thời gian mỗi đội làm một mình xong việc (điều kiện $x, y > T_{\\text{chung}}$). Với bài toán phần trăm (kế hoạch & thực tế), phương trình 1 lập theo kế hoạch ($x + y = M$), phương trình 2 lập theo số lượng sản phẩm vượt mức thực tế.',
      teacherExplanation: 'Luôn kiểm tra đơn vị (giờ/phút) và điều kiện tự nhiên/dương của ẩn trước khi nhận nghiệm.',
      keyTakeaway: 'Năng suất 1 giờ = $1 / \\text{thời gian hoàn thành}$; cộng năng suất chứ không cộng thời gian.',
      miniQuiz: [
        {
          id: 'm95-s3-q1',
          question: 'Hai vòi nước cùng chảy vào bể cạn sau $6\\text{ giờ}$ thì đầy. Nếu mỗi giờ vòi 1 chảy được $\\frac{1}{x}$ bể và vòi 2 chảy được $\\frac{1}{y}$ bể, phương trình năng suất đúng là:',
          options: [
            'A. $\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{6}$',
            'B. $x + y = 6$',
            'C. $\\frac{1}{x} + \\frac{1}{y} = 6$',
            'D. $\\frac{x + y}{2} = 6$'
          ],
          correctIndex: 0,
          explanation: 'Trong 1 giờ cả hai vòi cùng chảy được $\\frac{1}{6}$ bể, nên tổng năng suất mỗi giờ là $\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{6}$.'
        },
        {
          id: 'm95-s3-q2',
          question: 'Một ca nô có vận tốc riêng $20\\text{ km/h}$ chạy trên sông có dòng nước chảy $4\\text{ km/h}$. Thời gian ca nô đi xuôi dòng $48\\text{ km}$ và ngược dòng $32\\text{ km}$ tổng cộng là:',
          options: ['A. $4\\text{ giờ}$', 'B. $5\\text{ giờ}$', 'C. $3{,}5\\text{ giờ}$', 'D. $4{,}5\\text{ giờ}$'],
          correctIndex: 0,
          explanation: '$v_{\\text{xuôi}} = 24\\text{ km/h} \\implies t_1 = \\frac{48}{24} = 2\\text{ h}$; $v_{\\text{ngược}} = 16\\text{ km/h} \\implies t_2 = \\frac{32}{16} = 2\\text{ h}$. Tổng là $4\\text{ giờ}$.'
        }
      ],
      miniEssay: {
        id: 'm95-s3-e1',
        question: 'Theo kế hoạch, hai tổ sản xuất phải làm $700$ sản phẩm. Thực tế tổ 1 vượt mức $15\\%$, tổ 2 vượt mức $20\\%$ nên cả hai tổ làm được $820$ sản phẩm. Tính số sản phẩm mỗi tổ phải làm theo kế hoạch.',
        hint: 'Gọi $x, y$ là số sản phẩm theo kế hoạch của hai tổ ($x, y \\in \\mathbb{N}^*$), lập hệ $x + y = 700$ và $1{,}15x + 1{,}2y = 820$.',
        rubricChecklist: [
          'Gọi ẩn và đặt điều kiện $x, y \\in \\mathbb{N}^*, x, y < 700$.',
          'Lập đúng hệ: $x + y = 700$ và $0{,}15x + 0{,}2y = 120$.',
          'Giải đúng $x = 400$, $y = 300$ và kết luận.'
        ],
        sampleAnswer:
          'Gọi số sản phẩm theo kế hoạch của tổ 1 và tổ 2 lần lượt là $x, y$ ($x, y \\in \\mathbb{N}^*, x, y < 700$). Ta có hệ $\\begin{cases} x + y = 700 \\\\ 1{,}15x + 1{,}20y = 820 \\end{cases} \\iff \\begin{cases} x + y = 700 \\\\ 0{,}15x + 0{,}20y = 120 \\end{cases}$. Nhân PT1 với $0{,}20$ rồi trừ PT2: $0{,}05x = 20 \\implies x = 400$, suy ra $y = 300$ (thỏa mãn). Vậy theo kế hoạch tổ 1 làm $400$ sản phẩm, tổ 2 làm $300$ sản phẩm.'
      }
    }
  ],
  'math-9-6': [
    {
      stepTitle: '1. Định nghĩa & 4 Dấu hiệu Nhận biết Tứ giác Nội tiếp Kinh điển',
      stepType: 'concept',
      conceptSection:
        'Một tứ giác có 4 đỉnh cùng nằm trên một đường tròn gọi là tứ giác nội tiếp. Đây là câu hỏi hình học chắc chắn xuất hiện ở phần a) của bài Hình tổng hợp trong kỳ thi vào lớp 10.',
      formulaSection: {
        primaryFormula: '\\widehat{A} + \\widehat{C} = 180^\\circ \\quad \\text{hoặc} \\quad \\widehat{DAC} = \\widehat{DBC}',
        secondaryFormulas: [
          '\\text{Dấu hiệu 1: Tổng hai góc đối bằng } 180^\\circ',
          '\\text{Dấu hiệu 2: Hai đỉnh kề cùng nhìn cạnh đối diện dưới một góc bằng nhau}'
        ],
        variablesNote:
          '• **Dấu hiệu 1 (gặp nhiều nhất ~70%)**: Hai góc đối diện có tổng bằng $180^\\circ$ (thường là $90^\\circ + 90^\\circ = 180^\\circ$).\n• **Dấu hiệu 2**: Hai đỉnh liên tiếp $A, B$ cùng nhìn đoạn $CD$ dưới góc $\\alpha$ (hay gặp góc $90^\\circ$).\n• **Dấu hiệu 3**: Góc ngoài tại một đỉnh bằng góc trong tại đỉnh đối diện.\n• **Dấu hiệu 4**: Bốn đỉnh cách đều một điểm cố định.'
      },
      deepDiveSection:
        'Khi làm bài hình thi vào 10, hãy đánh dấu ngay các góc vuông trên hình. Hễ thấy hai tam giác vuông chung cạnh huyền $AB$ thì 4 đỉnh cùng thuộc đường tròn đường kính $AB$ (Dấu hiệu 2); hễ thấy hai góc vuông đối diện nhau thì dùng Dấu hiệu 1.',
      teacherExplanation: 'Đánh dấu các góc $90^\\circ$ ngay khi đọc đề; đó là chìa khóa 90% bài chứng minh tứ giác nội tiếp.',
      keyTakeaway: 'Tứ giác có tổng hai góc đối $180^\\circ$ hoặc hai đỉnh kề nhìn một cạnh dưới hai góc bằng nhau thì nội tiếp.',
      miniQuiz: [
        {
          id: 'm96-s1-q1',
          question: 'Tứ giác $ABCD$ nội tiếp đường tròn có $\\widehat{A} = 75^\\circ$. Số đo góc đối diện $\\widehat{C}$ bằng:',
          options: ['A. $105^\\circ$', 'B. $75^\\circ$', 'C. $150^\\circ$', 'D. $90^\\circ$'],
          correctIndex: 0,
          explanation: 'Tổng hai góc đối của tứ giác nội tiếp bằng $180^\\circ$, nên $\\widehat{C} = 180^\\circ - 75^\\circ = 105^\\circ$.'
        },
        {
          id: 'm96-s1-q2',
          question: 'Cho tam giác $ABC$ nhọn có hai đường cao $BD$ và $CE$ cắt nhau tại $H$. Tứ giác $BCDE$ nội tiếp vì lý do nào?',
          options: [
            'A. Hai đỉnh kề $E, D$ cùng nhìn cạnh $BC$ dưới góc $90^\\circ$',
            'B. $\\widehat{BEC} + \\widehat{BDC} = 180^\\circ$ (hai góc đối)',
            'C. $BCDE$ là hình thang cân',
            'D. $HB = HC$'
          ],
          correctIndex: 0,
          explanation: 'Trên tứ giác $BCDE$, $E$ và $D$ là hai đỉnh kề nhau cùng nhìn cạnh $BC$ dưới góc $\\widehat{BEC} = \\widehat{BDC} = 90^\\circ$.'
        }
      ],
      miniEssay: {
        id: 'm96-s1-e1',
        question: 'Từ điểm $M$ nằm ngoài đường tròn $(O)$, kẻ hai tiếp tuyến $MA, MB$ ($A, B$ là tiếp điểm). Chứng minh tứ giác $MAOB$ nội tiếp đường tròn.',
        hint: 'Dùng tính chất tiếp tuyến vuông góc với bán kính tại tiếp điểm để tính tổng hai góc đối $\\widehat{MAO} + \\widehat{MBO}$.',
        rubricChecklist: [
          'Chỉ ra $\\widehat{MAO} = 90^\\circ$ và $\\widehat{MBO} = 90^\\circ$ (tính chất tiếp tuyến).',
          'Tính tổng hai góc đối $\\widehat{MAO} + \\widehat{MBO} = 180^\\circ$.',
          'Kết luận tứ giác $MAOB$ nội tiếp đường tròn đường kính $MO$.'
        ],
        sampleAnswer:
          'Vì $MA, MB$ là hai tiếp tuyến của $(O)$ lần lượt tại $A, B$ nên $MA \\perp OA$ và $MB \\perp OB$, suy ra $\\widehat{MAO} = 90^\\circ$ và $\\widehat{MBO} = 90^\\circ$. Xét tứ giác $MAOB$ có $\\widehat{MAO} + \\widehat{MBO} = 90^\\circ + 90^\\circ = 180^\\circ$, mà đây là hai góc đối diện nhau. Do đó tứ giác $MAOB$ nội tiếp đường tròn (đường kính $MO$).'
      }
    },
    {
      stepTitle: '2. Khai thác Tứ giác Nội tiếp để Chứng minh Góc bằng nhau & Thẳng hàng',
      stepType: 'derivation',
      conceptSection:
        'Sau khi đã chứng minh được tứ giác nội tiếp ở câu a), câu b) thường yêu cầu suy ra hai góc bằng nhau, hai đoạn thẳng vuông góc, hoặc ba điểm thẳng hàng bằng cách dùng các góc nội tiếp cùng chắn một cung trong đường tròn ngoại tiếp tứ giác đó.',
      formulaSection: {
        primaryFormula: 'ABCD \\text{ nội tiếp} \\implies \\widehat{ABD} = \\widehat{ACD}, \\quad \\widehat{DAx} = \\widehat{BCD}',
        secondaryFormulas: [
          '\\widehat{EBC} + \\widehat{EDC} = 180^\\circ',
          '\\text{Hệ thức tam giác có } 3 \\text{ đường cao: } H \\text{ là tâm đường tròn nội tiếp } \\triangle DEF'
        ],
        variablesNote:
          '• Khi chuyển góc qua tứ giác nội tiếp $BCDE$, ta thường có chuỗi $\\widehat{ADE} = \\widehat{ABC}$ (góc ngoài tại $D$ bằng góc trong đối diện $B$).\n• Chú ý kỹ thuật **cộng góc $180^\\circ$** để chứng minh 3 điểm thẳng hàng hoặc 2 tia trùng nhau.'
      },
      deepDiveSection:
        'Trong mô hình kinh điển tam giác nhọn $ABC$ nội tiếp $(O)$ với trực tâm $H$ và ba đường cao $AD, BE, CF$: có tới **6 tứ giác nội tiếp** xuất hiện ngay lập tức ($AEHF, BDHF, CDHE$ theo dấu hiệu tổng góc đối $180^\\circ$, và $BFEC, AFDC, ABDE$ theo dấu hiệu góc $90^\\circ$ cùng nhìn một cạnh).',
      teacherExplanation: 'Tận dụng ngay 6 tứ giác nội tiếp trong mô hình trực tâm $H$ để chuyển góc nối tiếp cực nhanh.',
      keyTakeaway: 'Tứ giác nội tiếp giúp "nhảy góc" từ đỉnh này sang đỉnh khác thông qua góc chắn cùng một cung.',
      miniQuiz: [
        {
          id: 'm96-s2-q1',
          question: 'Cho tam giác $ABC$ nhọn có hai đường cao $BE, CF$ cắt nhau tại $H$. Tứ giác nào sau đây nội tiếp theo dấu hiệu **tổng hai góc đối bằng $180^\\circ$**?',
          options: ['A. $AEHF$', 'B. $BFEC$', 'C. $ABEF$', 'D. $BHCF$'],
          correctIndex: 0,
          explanation: '$\\widehat{AEH} + \\widehat{AFH} = 90^\\circ + 90^\\circ = 180^\\circ$ là hai góc đối diện nhau nên $AEHF$ nội tiếp.'
        },
        {
          id: 'm96-s2-q2',
          question: 'Cho tứ giác $ABCD$ nội tiếp $(O)$. Kéo dài $AB$ về phía $B$ lấy tia $Bx$. Góc ngoài $\\widehat{CBx}$ luôn bằng góc nào?',
          options: ['A. $\\widehat{ADC}$', 'B. $\\widehat{BAD}$', 'C. $\\widehat{BCD}$', 'D. $\\widehat{ACD}$'],
          correctIndex: 0,
          explanation: 'Vì $\\widehat{CBx} + \\widehat{CBA} = 180^\\circ$ và $\\widehat{ADC} + \\widehat{CBA} = 180^\\circ$ nên $\\widehat{CBx} = \\widehat{ADC}$.'
        }
      ],
      miniEssay: {
        id: 'm96-s2-e1',
        question: 'Cho tam giác $ABC$ nhọn nội tiếp $(O)$ với ba đường cao $AD, BE, CF$ cắt nhau tại $H$. Chứng minh $DA$ là tia phân giác của $\\widehat{EDF}$.',
        hint: 'Chuyển góc qua hai tứ giác nội tiếp $BDHF$ và $CDHE$ (hoặc $ABDE$ và $AFDC$).',
        rubricChecklist: [
          'Chứng minh tứ giác $BDHF$ nội tiếp $\\implies \\widehat{HBF} = \\widehat{HDF}$ (hay $\\widehat{ABE} = \\widehat{ADF}$).',
          'Chứng minh tứ giác $CDHE$ nội tiếp $\\implies \\widehat{HCE} = \\widehat{HDE}$ (hay $\\widehat{ACF} = \\widehat{ADE}$).',
          'Chỉ ra $\\widehat{ABE} = \\widehat{ACF}$ (cùng phụ với $\\widehat{BAC}$), từ đó suy ra $\\widehat{ADF} = \\widehat{ADE}$.'
        ],
        sampleAnswer:
          'Tứ giác $BDHF$ có $\\widehat{BDH} + \\widehat{BFH} = 180^\\circ$ nên nội tiếp, suy ra $\\widehat{HDF} = \\widehat{HBF}$ (cùng chắn cung $HF$). Tương tự tứ giác $CDHE$ nội tiếp nên $\\widehat{HDE} = \\widehat{HCE}$ (cùng chắn cung $HE$). Mặt khác, $\\widehat{ABE} = \\widehat{ACF} = 90^\\circ - \\widehat{BAC}$. Do đó $\\widehat{HDF} = \\widehat{HDE}$, tức $DA$ là tia phân giác của $\\widehat{EDF}$.'
      }
    },
    {
      stepTitle: '3. Tâm Đường tròn Ngoại tiếp & Các Bài toán Cực trị / Điểm Cố định (Câu c)',
      stepType: 'example',
      conceptSection:
        'Câu c) của bài hình vào 10 thường yêu cầu chứng minh đường thẳng luôn đi qua một điểm cố định, tìm vị trí điểm để diện tích/chu vi đạt cực trị, hoặc chứng minh ba điểm thẳng hàng bằng cách dùng tính chất tiếp tuyến – đường kính – trực tâm.',
      formulaSection: {
        primaryFormula: '\\text{Tâm ngoại tiếp } (AEHF) \\text{ là trung điểm } AH',
        secondaryFormulas: [
          '\\text{Hệ thức Euler / Đường tròn 9 điểm: } OM = \\frac{1}{2} AH \\ (M \\text{ là trung điểm } BC)',
          'S_{\\triangle} = \\frac{1}{2} a \\cdot h_a \\le \\frac{1}{2} a \\cdot h_{\\max}'
        ],
        variablesNote:
          '• Với tứ giác nội tiếp tạo bởi hai góc vuông đối diện ($\\widehat{AEH} = \\widehat{AFH} = 90^\\circ$), tâm đường tròn ngoại tiếp chính là **trung điểm cạnh huyền chung $AH$**.\n• Khi chứng minh đường đi qua điểm cố định: tìm mối liên hệ đồng dạng hoặc góc vuông tạo ra một điểm đặc biệt (như trực tâm, trung điểm dây cố định).'
      },
      deepDiveSection:
        'Một kỹ thuật cực mạnh ở câu c) là phép nghịch đảo sơ cấp qua tam giác đồng dạng: muốn chứng minh $E, H, F$ thẳng hàng hoặc tiếp tuyến $KE$, hãy kiểm tra xem $\\widehat{KEO}$ có bằng $90^\\circ$ hay không bằng cách chứng minh $\\widehat{KEH} + \\widehat{OEA} = 90^\\circ$ thông qua tam giác cân $OAE$ và tam giác cân $IAE$ ($I$ là trung điểm $AH$).',
      teacherExplanation: 'Khi gặp tứ giác hai góc vuông đối diện, gọi ngay trung điểm của đường chéo nối hai đỉnh không vuông làm tâm đường tròn.',
      keyTakeaway: 'Kết hợp trung tuyến ứng với cạnh huyền và tam giác cân tại tâm đường tròn để chứng minh góc vuông tiếp tuyến.',
      miniQuiz: [
        {
          id: 'm96-s3-q1',
          question: 'Tứ giác $AEHF$ có $\\widehat{AEH} = \\widehat{AFH} = 90^\\circ$. Tâm và bán kính đường tròn ngoại tiếp tứ giác này là:',
          options: [
            'A. Trung điểm $AH$, bán kính $\\frac{AH}{2}$',
            'B. Trung điểm $EF$, bán kính $\\frac{EF}{2}$',
            'C. Giao điểm $AH$ và $EF$, bán kính $AE$',
            'D. Đỉnh $A$, bán kính $AH$'
          ],
          correctIndex: 0,
          explanation: 'Hai tam giác vuông $AEH$ và $AFH$ có chung cạnh huyền $AH$, nên tâm ngoại tiếp là trung điểm $AH$ và bán kính bằng $AH/2$.'
        },
        {
          id: 'm96-s3-q2',
          question: 'Cho đường tròn $(O; R)$ cố định và dây $AB$ cố định ($AB < 2R$). Điểm $C$ di động trên cung lớn $AB$. Diện tích $\\triangle ABC$ lớn nhất khi nào?',
          options: [
            'A. $C$ là điểm chính giữa cung lớn $AB$',
            'B. $AC$ là đường kính',
            'C. $BC$ là đường kính',
            'D. $\\widehat{ACB} = 90^\\circ$'
          ],
          correctIndex: 0,
          explanation: 'Cạnh đáy $AB$ không đổi nên $S_{\\triangle ABC} = \\frac{1}{2}AB \\cdot CH$ lớn nhất khi đường cao $CH$ lớn nhất $\\iff C$ là điểm chính giữa cung lớn $AB$.'
        }
      ],
      miniEssay: {
        id: 'm96-s3-e1',
        question: 'Cho tam giác $ABC$ nhọn nội tiếp $(O)$, ba đường cao $AD, BE, CF$ cắt nhau tại $H$. Gọi $I$ là trung điểm của $AH$. Chứng minh $IE$ là tiếp tuyến của đường tròn đường kính $BC$ (có tâm $M$ là trung điểm $BC$).',
        hint: 'Chứng minh $\\widehat{IEM} = 90^\\circ$ bằng cách xét hai tam giác cân $IEA$ (tại $I$) và $MEC$ (tại $M$), cộng hai góc nhọn phụ nhau.',
        rubricChecklist: [
          'Chỉ ra $\\triangle IEA$ cân tại $I \\implies \\widehat{IEA} = \\widehat{IAE}$.',
          'Chỉ ra $\\triangle MEC$ cân tại $M \\implies \\widehat{MEC} = \\widehat{MCE}$.',
          'Tính $\\widehat{IEA} + \\widehat{MEC} = \\widehat{DAC} + \\widehat{ACD} = 90^\\circ \\implies \\widehat{IEM} = 90^\\circ$.'
        ],
        sampleAnswer:
          'Xét tam giác vuông $AEH$ có $EI$ là trung tuyến ứng với cạnh huyền $AH$ nên $IE = IA$, suy ra $\\widehat{IEA} = \\widehat{IAE} = \\widehat{DAC}$. Tương tự, tam giác vuông $BEC$ có $EM$ là trung tuyến ứng với cạnh huyền $BC$ nên $ME = MC$, suy ra $\\widehat{MEC} = \\widehat{MCE} = \\widehat{DCA}$. Do $\\triangle ADC$ vuông tại $D$ nên $\\widehat{DAC} + \\widehat{DCA} = 90^\\circ$, suy ra $\\widehat{IEA} + \\widehat{MEC} = 90^\\circ \\implies \\widehat{IEM} = 180^\\circ - 90^\\circ = 90^\\circ$. Vậy $IE \\perp ME$ tại $E$, chứng tỏ $IE$ là tiếp tuyến của đường tròn đường kính $BC$.'
      }
    }
  ]
};
