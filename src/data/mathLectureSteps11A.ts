import { LectureStep } from '../types';

export const MATH_CUSTOM_LECTURE_STEPS_11A: Record<string, LectureStep[]> = {
  'math-10-7': [
    {
      stepTitle: '1. Quy tắc Cộng & Quy tắc Nhân trong Bài toán Đếm',
      stepType: 'concept',
      conceptSection:
        'Mọi bài toán đếm tổ hợp đều xuất phát từ hai quy tắc nền tảng: **Quy tắc Cộng** (chia công việc thành các phương án ĐỘC LẬP, hoàn thành trọn vẹn từng phương án) và **Quy tắc Nhân** (chia công việc thành các giai đoạn LIÊN TIẾP, phải xong đủ mọi bước).',
      formulaSection: {
        primaryFormula: '\\text{Cộng: } n = n_1 + n_2 + \\dots + n_k; \\qquad \\text{Nhân: } n = n_1 \\cdot n_2 \\cdot \\dots \\cdot n_k',
        secondaryFormulas: [
          '\\text{Số tự nhiên có } k \\text{ chữ số khác } 0 \\text{ đầu: } a_1 \\in \\{1..9\\}, \\ a_2..a_k \\in \\{0..9\\}',
          '\\text{Số chẵn / chia hết } 5: \\text{ ưu tiên chọn chữ số tận cùng trước!}'
        ],
        variablesNote:
          '• **Nguyên tắc vàng khi chọn chữ số**: Luôn chọn chữ số có **nhiều điều kiện ràng buộc nhất trước** (thường là chữ số hàng đơn vị để kiểm tra chẵn/lẻ/chia hết 5, và chữ số đầu tiên phải khác $0$!).\n• Nếu điều kiện "khác 0" ở đầu và "chẵn" ở cuối **đụng nhau** tại số $0$, hãy **chia thành 2 trường hợp** ($a_{\\text{cuối}} = 0$ và $a_{\\text{cuối}} \\neq 0$) rồi dùng Quy tắc Cộng!'
      },
      deepDiveSection:
        'Một lỗi cực kỳ phổ biến là đếm trùng lặp khi nhân hai bước chọn cùng lúc (ví dụ chọn 1 nam, 1 nữ rồi lại chọn thêm 1 bạn bất kỳ trong số còn lại — sẽ đếm lặp 2 lần!). Hãy phân biệt rõ vai trò của từng bước hoặc dùng tổ hợp $C_n^k$ ở phần sau.',
      teacherExplanation: 'Khi đếm số tự nhiên chẵn đôi một khác nhau có chứa chữ số $0$, luôn tách riêng trường hợp tận cùng bằng $0$ và tận cùng $\\in \\{2,4,6,8\\}$!',
      keyTakeaway: 'Quy tắc Cộng dùng cho các trường hợp rời nhau; Quy tắc Nhân dùng cho các bước liên tiếp; chọn vị trí ràng buộc trước.',
      miniQuiz: [
        {
          id: 'm107-s1-q1',
          question: 'Từ các chữ số $\\{0, 1, 2, 3, 4, 5\\}$, lập được bao nhiêu số tự nhiên gồm $3$ chữ số đôi một khác nhau và chia hết cho $5$?',
          options: ['A. $36$', 'B. $40$', 'C. $32$', 'D. $48$'],
          correctIndex: 0,
          explanation: 'Chia 2 TH: Tận cùng bằng $0$: $a_1$ có $5$ cách, $a_2$ có $4$ cách $\\implies 20$ số. Tận cùng bằng $5$: $a_1 \\neq 0, 5$ có $4$ cách, $a_2$ có $4$ cách $\\implies 16$ số. Tổng $20 + 16 = 36$ số.'
        },
        {
          id: 'm107-s1-q2',
          question: 'Từ thành phố A đến B có $4$ con đường, từ B đến C có $3$ con đường. Số cách đi từ A đến C qua B rồi quay về A (được đi lại đường cũ) là:',
          options: ['A. $144$', 'B. $12$', 'C. $24$', 'D. $132$'],
          correctIndex: 0,
          explanation: 'Lượt đi: $4 \\times 3 = 12$ cách; lượt về: $3 \\times 4 = 12$ cách. Theo quy tắc nhân: $12 \\times 12 = 144$ cách.'
        }
      ],
      miniEssay: {
        id: 'm107-s1-e1',
        question: 'Từ tập $X = \\{0, 1, 2, 3, 4, 5, 6\\}$, có thể lập được bao nhiêu số tự nhiên chẵn có $3$ chữ số đôi một khác nhau?',
        hint: 'Chia 2 trường hợp chữ số tận cùng $c$: TH1 $c = 0$; TH2 $c \\in \\{2, 4, 6\\}$ (khi đó $a \\neq 0$ và $a \\neq c$).',
        rubricChecklist: [
          'TH1 ($c = 0$): $a$ có $6$ cách, $b$ có $5$ cách $\\implies 30$ số.',
          'TH2 ($c \\in \\{2, 4, 6\\}$ — 3 cách): $a$ có $5$ cách ($\\neq 0, c$), $b$ có $5$ cách ($\\neq a, c$) $\\implies 3 \\cdot 5 \\cdot 5 = 75$ số.',
          'Tổng cộng $30 + 75 = 105$ số.'
        ],
        sampleAnswer:
          'Gọi số cần tìm là $\\overline{abc}$ ($a \\neq 0$). Chia 2 trường hợp: TH1 ($c = 0$): $a$ có $6$ cách chọn (từ $\\{1..6\\}$), $b$ có $5$ cách chọn $\\implies 6 \\cdot 5 = 30$ số. TH2 ($c \\in \\{2, 4, 6\\}$, có $3$ cách chọn): $a \\neq 0, c$ nên $a$ có $5$ cách chọn; $b \\neq a, c$ nên $b$ có $5$ cách chọn $\\implies 3 \\cdot 5 \\cdot 5 = 75$ số. Theo quy tắc cộng có $30 + 75 = 105$ số.'
      }
    },
    {
      stepTitle: '2. Phân biệt Hoán vị $P_n$, Chỉnh hợp $A_n^k$ & Tổ hợp $C_n^k$',
      stepType: 'derivation',
      conceptSection:
        'Ba khái niệm cốt lõi của tổ hợp khác nhau ở hai câu hỏi: *Có chọn tất cả $n$ phần tử không?* và *Thứ tự sắp xếp các phần tử chọn ra có làm thay đổi kết quả không?*',
      formulaSection: {
        primaryFormula: 'P_n = n!, \\qquad A_n^k = \\frac{n!}{(n-k)!}, \\qquad C_n^k = \\frac{n!}{k!(n-k)!}',
        secondaryFormulas: [
          'C_n^k = C_n^{n-k}, \\qquad C_n^k + C_n^{k+1} = C_{n+1}^{k+1} \\ (\\text{Pascal})',
          'A_n^k = k! \\cdot C_n^k'
        ],
        variablesNote:
          '• **Hoán vị $P_n$**: Xếp hết $n$ vật vào $n$ chỗ (xếp hàng, lập số từ đủ $n$ chữ số).\n• **Chỉnh hợp $A_n^k$**: Lấy $k$ vật từ $n$ vật **CÓ THỨ TỰ** (bầu lớp trưởng + lớp phó, lập số có $k$ chữ số khác nhau).\n• **Tổ hợp $C_n^k$**: Lấy $k$ vật từ $n$ vật **KHÔNG THỨ TỰ** (chọn ban đại diện 3 người giống nhau, chọn 3 quả cầu cùng lúc, lập tam giác từ 3 đỉnh).'
      },
      deepDiveSection:
        'Với bài toán xếp $n$ người ngồi hàng ngang sao cho 2 bạn $A, B$ **đứng cạnh nhau**: ta "buộc" $A$ và $B$ thành 1 khối kép ($2!$ cách đảo vị trí nội bộ), rồi hoán vị $(n-1)$ khối cùng các bạn khác $\\implies 2! \\cdot (n-1)!$. Ngược lại, nếu $A, B$ **không đứng cạnh nhau**, dùng phép bù trừ hoặc **vách ngăn** (xếp $n-2$ bạn kia trước tạo $n-1$ khe trống rồi đặt $A, B$ vào $A_{n-1}^2$ cách).',
      teacherExplanation: 'Tự hỏi trước khi bấm máy: đổi chỗ 2 phần tử được chọn có tạo kết quả mới không? Có $\\to A_n^k$, Không $\\to C_n^k$!',
      keyTakeaway: '$A_n^k$ quan tâm thứ tự (phân công chức vụ, lập số); $C_n^k$ chỉ lấy ra tập con (chọn nhóm, vẽ đa giác).',
      miniQuiz: [
        {
          id: 'm107-s2-q1',
          question: 'Một lớp có $15$ nam và $20$ nữ. Có bao nhiêu cách chọn một đội văn nghệ gồm $3$ nam và $2$ nữ?',
          options: ['A. $C_{15}^3 \\cdot C_{20}^2$', 'B. $C_{15}^3 + C_{20}^2$', 'C. $A_{15}^3 \\cdot A_{20}^2$', 'D. $C_{35}^5$'],
          correctIndex: 0,
          explanation: 'Chọn nhóm không phân biệt thứ tự dùng tổ hợp; thực hiện liên tiếp 2 bước chọn nam và chọn nữ dùng quy tắc nhân: $C_{15}^3 \\cdot C_{20}^2$.'
        },
        {
          id: 'm107-s2-q2',
          question: 'Từ một nhóm gồm $10$ học sinh, có bao nhiêu cách chọn ra $1$ lớp trưởng, $1$ lớp phó và $1$ bí thư (mỗi người giữ tối đa $1$ chức vụ)?',
          options: ['A. $720$', 'B. $120$', 'C. $1000$', 'D. $30$'],
          correctIndex: 0,
          explanation: 'Có phân biệt chức vụ (có thứ tự) nên dùng chỉnh hợp: $A_{10}^3 = 10 \\cdot 9 \\cdot 8 = 720$.'
        }
      ],
      miniEssay: {
        id: 'm107-s2-e1',
        question: 'Một hộp chứa $5$ bi đỏ và $4$ bi xanh. Có bao nhiêu cách lấy ngẫu nhiên $4$ viên bi sao cho có **ít nhất $2$ bi đỏ**?',
        hint: 'Chia 3 trường hợp (2 đỏ + 2 xanh, 3 đỏ + 1 xanh, 4 đỏ) hoặc dùng phần bù (tất cả $C_9^4$ trừ trường hợp 0 đỏ và 1 đỏ).',
        rubricChecklist: [
          'Lập phương án đúng (trực tiếp hoặc phần bù): $C_5^2 C_4^2 + C_5^3 C_4^1 + C_5^4 C_4^0$.',
          'Tính đúng từng hạng tử: $10\\cdot 6 + 10\\cdot 4 + 5\\cdot 1 = 60 + 40 + 5$.',
          'Kết luận chính xác $105$ cách (kiểm tra phần bù: $126 - (1 + 5\\cdot 4) = 105$).'
        ],
        sampleAnswer:
          'Cách đếm trực tiếp gồm 3 trường hợp: 2 đỏ + 2 xanh có $C_5^2 \\cdot C_4^2 = 10 \\cdot 6 = 60$ cách; 3 đỏ + 1 xanh có $C_5^3 \\cdot C_4^1 = 10 \\cdot 4 = 40$ cách; 4 đỏ có $C_5^4 = 5$ cách. Tổng cộng có $60 + 40 + 5 = 105$ cách.'
      }
    },
    {
      stepTitle: '3. Nhị thức Newton $(a + b)^n$ & Tìm Hệ số của Số hạng chứa $x^k$',
      stepType: 'example',
      conceptSection:
        'Theo chương trình GDPT 2018 lớp 10, học sinh nắm chắc công thức khai triển Nhị thức Newton cho $n = 4, 5$ và số hạng tổng quát $T_{k+1} = C_n^k a^{n-k} b^k$ để tìm nhanh hệ số của $x^m$ trong khai triển.',
      formulaSection: {
        primaryFormula: '(a + b)^n = \\sum_{k=0}^{n} C_n^k a^{n-k} b^k, \\qquad T_{k+1} = C_n^k a^{n-k} b^k',
        secondaryFormulas: [
          '(a + b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4',
          '(a + b)^5 = a^5 + 5a^4b + 10a^3b^2 + 10a^2b^3 + 5ab^4 + b^5'
        ],
        variablesNote:
          '• **Mẹo tìm hệ số chứa $x^m$**: Viết $T_{k+1} = C_n^k a^{n-k} b^k$, tách riêng **phần hệ số** và **phần biến $x^{f(k)}$**, sau đó giải $f(k) = m$ để tìm $k$ nguyên ($0 \\le k \\le n$).\n• **Lỗi kinh điển**: Nếu đề hỏi *"Tìm hệ số của số hạng..."* thì chỉ ghi con số hệ số, KHÔNG viết kèm $x^m$! Và nhớ mang theo dấu âm trong $b$ (ví dụ $(2x - 3)^5$ thì $b = -3$).'
      },
      deepDiveSection:
        'Ngoài ra, muốn tính tổng tất cả các hệ số trong khai triển của đa thức $P(x) = (ax + b)^n$, chỉ cần thay $x = 1$ vào $P(1) = (a + b)^n$ mà không cần khai triển từng số hạng! Ví dụ tổng các tổ hợp $C_n^0 + C_n^1 + \\dots + C_n^n = 2^n$ (thay $a=1, b=1$).',
      teacherExplanation: 'Luôn tách dấu trừ đi kèm với $b$ thành $(-c)^k$ khi viết số hạng tổng quát $T_{k+1}$!',
      keyTakeaway: 'Số hạng thứ $k+1$ là $C_n^k a^{n-k} b^k$; tổng các hệ số của $(ax+b)^n$ tính ngay bằng thay $x = 1$.',
      miniQuiz: [
        {
          id: 'm107-s3-q1',
          question: 'Hệ số của $x^3$ trong khai triển của $(2x - 1)^5$ là:',
          options: ['A. $80$', 'B. $-80$', 'C. $40$', 'D. $-40$'],
          correctIndex: 0,
          explanation: '$T_{k+1} = C_5^k (2x)^{5-k}(-1)^k = C_5^k 2^{5-k}(-1)^k x^{5-k}$. Cho $5 - k = 3 \\implies k = 2$. Hệ số: $C_5^2 \\cdot 2^3 \\cdot (-1)^2 = 10 \\cdot 8 \\cdot 1 = 80$.'
        },
        {
          id: 'm107-s3-q2',
          question: 'Số hạng không chứa $x$ trong khai triển $\\left(x + \\frac{2}{x}\\right)^4$ ($x \\neq 0$) là:',
          options: ['A. $24$', 'B. $16$', 'C. $12$', 'D. $6$'],
          correctIndex: 0,
          explanation: '$T_{k+1} = C_4^k x^{4-k} \\cdot 2^k x^{-k} = C_4^k 2^k x^{4 - 2k}$. Không chứa $x \\iff 4 - 2k = 0 \\iff k = 2$. Số hạng là $C_4^2 \\cdot 2^2 = 6 \\cdot 4 = 24$.'
        }
      ],
      miniEssay: {
        id: 'm107-s3-e1',
        question: 'Tìm hệ số của số hạng chứa $x^2$ trong khai triển $\\left(3x^2 - \\frac{1}{x}\\right)^4$ ($x \\neq 0$).',
        hint: 'Viết số hạng tổng quát $T_{k+1} = C_4^k (3x^2)^{4-k} (-x^{-1})^k = C_4^k 3^{4-k}(-1)^k x^{8 - 3k}$, giải $8 - 3k = 2$.',
        rubricChecklist: [
          'Viết đúng $T_{k+1} = C_4^k 3^{4-k}(-1)^k x^{8 - 3k}$.',
          'Giải $8 - 3k = 2 \\implies k = 2$ (thỏa $0 \\le k \\le 4$).',
          'Tính hệ số $C_4^2 \\cdot 3^2 \\cdot (-1)^2 = 6 \\cdot 9 = 54$.'
        ],
        sampleAnswer:
          'Số hạng tổng quát: $T_{k+1} = C_4^k (3x^2)^{4-k} \\left(-\\frac{1}{x}\\right)^k = C_4^k 3^{4-k}(-1)^k x^{8 - 3k}$ ($0 \\le k \\le 4$). Số hạng chứa $x^2$ ứng với $8 - 3k = 2 \\iff k = 2$. Vậy hệ số cần tìm là $C_4^2 \\cdot 3^2 \\cdot (-1)^2 = 6 \\cdot 9 \\cdot 1 = 54$.'
      }
    }
  ],
  'math-10-8': [
    {
      stepTitle: '1. Đường Elip: Định nghĩa, Tiêu điểm, Tâm sai & Hình chữ nhật Cơ sở',
      stepType: 'concept',
      conceptSection:
        'Elip $(E)$ là tập hợp các điểm $M$ trong mặt phẳng sao cho tổng khoảng cách tới hai tiêu điểm cố định luôn không đổi bằng $2a$ ($MF_1 + MF_2 = 2a > 2c$). Đường cong Elip nhận hai trục tọa độ làm hai trục đối xứng và gốc $O$ làm tâm đối xứng.',
      formulaSection: {
        primaryFormula: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 \\quad (a > b > 0,\\ b^2 = a^2 - c^2)',
        secondaryFormulas: [
          '\\text{Tiêu điểm: } F_1(-c; 0),\\ F_2(c; 0); \\quad \\text{Tâm sai: } e = \\frac{c}{a} < 1',
          '\\text{Bán kính qua tiêu: } MF_1 = a + \\frac{c}{a}x_0, \\quad MF_2 = a - \\frac{c}{a}x_0'
        ],
        variablesNote:
          '• 4 đỉnh của $(E)$ là $A_1(-a; 0), A_2(a; 0), B_1(0; -b), B_2(0; b)$; độ dài trục lớn $2a$, trục nhỏ $2b$, tiêu cự $2c$.\n• Mọi điểm thuộc $(E)$ đều nằm gọn trong hình chữ nhật cơ sở $-a \\le x \\le a$, $-b \\le y \\le b$.'
      },
      deepDiveSection:
        'Khi làm bài toán thực tế về cổng chào hình nửa Elip cao $h$ mét và rộng $2a$ mét, đặt hệ trục tọa độ ngay tại tâm đáy cổng thì chiều cao cổng chính là bán trục nhỏ $b = h$, nửa chiều rộng là $a$, nên phương trình cổng là $\\frac{x^2}{a^2} + \\frac{y^2}{h^2} = 1$ — thay $x$ hoặc $y$ tìm chiều cao xe tải qua cổng cực nhanh!',
      teacherExplanation: 'Trong Elip, $a$ là bán trục lớn và luôn lớn hơn $b$ và $c$: $a^2 = b^2 + c^2$.',
      keyTakeaway: 'Dùng $MF_1 = a + \\frac{c}{a}x_0$ và $MF_2 = a - \\frac{c}{a}x_0$ để tính nhanh khoảng cách từ điểm trên Elip tới hai tiêu điểm.',
      miniQuiz: [
        {
          id: 'm108-s1-q1',
          question: 'Elip $(E): \\frac{x^2}{169} + \\frac{y^2}{144} = 1$ có tâm sai $e$ bằng:',
          options: ['A. $\\frac{5}{13}$', 'B. $\\frac{12}{13}$', 'C. $\\frac{5}{12}$', 'D. $\\frac{13}{5}$'],
          correctIndex: 0,
          explanation: '$a = 13, b = 12 \\implies c = \\sqrt{169 - 144} = 5$. Tâm sai $e = \\frac{c}{a} = \\frac{5}{13}$.'
        },
        {
          id: 'm108-s1-q2',
          question: 'Một cổng chào hình nửa Elip có chiều rộng chân cổng là $16\\text{ m}$ và chiều cao ở chính giữa là $6\\text{ m}$. Tại vị trí cách tâm cổng $4\\text{ m}$ theo phương ngang, chiều cao cổng bằng:',
          options: ['A. $3\\sqrt{3}\\text{ m}$', 'B. $4{,}5\\text{ m}$', 'C. $3\\text{ m}$', 'D. $4\\text{ m}$'],
          correctIndex: 0,
          explanation: '$a = 8, b = 6 \\implies \\frac{x^2}{64} + \\frac{y^2}{36} = 1$. Tại $x = 4$: $\\frac{16}{64} + \\frac{y^2}{36} = 1 \\implies \\frac{y^2}{36} = \\frac{3}{4} \\implies y = 3\\sqrt{3}\\text{ m}$.'
        }
      ],
      miniEssay: {
        id: 'm108-s1-e1',
        question: 'Lập phương trình chính tắc của Elip $(E)$ đi qua điểm $M(0; 3)$ và có một tiêu điểm $F_1(-4; 0)$.',
        hint: 'Từ $M(0; 3) \\in (E)$ suy ra $b = 3$, từ $F_1(-4; 0)$ suy ra $c = 4$, rồi tính $a^2 = b^2 + c^2$.',
        rubricChecklist: [
          'Thay $M(0; 3)$ tìm được $b = 3 \\implies b^2 = 9$.',
          'Từ $F_1(-4; 0)$ xác định $c = 4$.',
          'Tính $a^2 = b^2 + c^2 = 25$ và viết phương trình $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$.'
        ],
        sampleAnswer:
          'Phương trình $(E)$ có dạng $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ ($a > b > 0$). Do $(E)$ đi qua $M(0; 3)$ nên $\\frac{9}{b^2} = 1 \\implies b^2 = 9$. Do có tiêu điểm $F_1(-4; 0)$ nên $c = 4$. Suy ra $a^2 = b^2 + c^2 = 9 + 16 = 25$. Vậy $(E): \\frac{x^2}{25} + \\frac{y^2}{9} = 1$.'
      }
    },
    {
      stepTitle: '2. Đường Hypebol: Tiệm cận & Hiệu Khoảng cách Tiêu điểm',
      stepType: 'derivation',
      conceptSection:
        'Hypebol $(H)$ gồm hai nhánh rời nhau đối xứng qua hai trục tọa độ, là tập hợp các điểm $M$ có giá trị tuyệt đối hiệu khoảng cách tới hai tiêu điểm bằng hằng số $2a$ ($|MF_1 - MF_2| = 2a < 2c$).',
      formulaSection: {
        primaryFormula: '\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1 \\quad (c^2 = a^2 + b^2)',
        secondaryFormulas: [
          '\\text{Hai đường tiệm cận: } y = \\pm \\frac{b}{a}x',
          '\\text{Độ dài trục thực: } 2a; \\quad \\text{trục ảo: } 2b; \\quad \\text{tâm sai: } e = \\frac{c}{a} > 1'
        ],
        variablesNote:
          '• Khác với Elip, trong Hypebol **$a$ không cần lớn hơn $b$**, nhưng $c$ luôn lớn nhất ($c^2 = a^2 + b^2$).\n• Ứng dụng định vị hàng hải (LORAN): nếu 2 trạm phát sóng đặt tại $F_1, F_2$ đo được hiệu thời gian nhận tín hiệu không đổi, tàu nằm trên 1 nhánh của Hypebol!'
      },
      deepDiveSection:
        'Lưu ý hai đường tiệm cận $y = \\pm \\frac{b}{a}x$ là hai đường chéo của hình chữ nhật cơ sở kích thước $2a \\times 2b$. Hai nhánh Hypebol tiến sát dần về hai đường chéo này nhưng không bao giờ cắt chúng.',
      teacherExplanation: 'Hypebol dùng dấu trừ và $c^2 = a^2 + b^2$; nhớ hai đường tiệm cận $y = \\pm \\frac{b}{a}x$.',
      keyTakeaway: 'Hypebol $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ có $c = \\sqrt{a^2 + b^2}$, tâm sai $e > 1$ và tiệm cận $y = \\pm \\frac{b}{a}x$.',
      miniQuiz: [
        {
          id: 'm108-s2-q1',
          question: 'Hypebol $(H): \\frac{x^2}{9} - \\frac{y^2}{16} = 1$ có tiêu cự bằng bao nhiêu?',
          options: ['A. $10$', 'B. $5$', 'C. $2\\sqrt{7}$', 'D. $14$'],
          correctIndex: 0,
          explanation: '$a^2 = 9, b^2 = 16 \\implies c = \\sqrt{9 + 16} = 5 \\implies$ tiêu cự $2c = 10$.'
        },
        {
          id: 'm108-s2-q2',
          question: 'Hai đường tiệm cận của Hypebol $\\frac{x^2}{4} - \\frac{y^2}{9} = 1$ có phương trình là:',
          options: ['A. $y = \\pm \\frac{3}{2}x$', 'B. $y = \\pm \\frac{2}{3}x$', 'C. $y = \\pm \\frac{9}{4}x$', 'D. $y = \\pm 3x$'],
          correctIndex: 0,
          explanation: '$a = 2, b = 3 \\implies$ hai đường tiệm cận $y = \\pm \\frac{b}{a}x = \\pm \\frac{3}{2}x$.'
        }
      ],
      miniEssay: {
        id: 'm108-s2-e1',
        question: 'Viết phương trình chính tắc của Hypebol $(H)$ biết một tiêu điểm là $F_2(5; 0)$ và đi qua điểm $A(3; 0)$.',
        hint: 'Từ đỉnh thực $A(3; 0)$ suy ra $a = 3$, từ $F_2(5; 0)$ suy ra $c = 5$, tính $b^2 = c^2 - a^2$.',
        rubricChecklist: [
          'Từ $A(3; 0) \\in (H)$ suy ra $a = 3 \\implies a^2 = 9$.',
          'Từ tiêu điểm $F_2(5; 0)$ suy ra $c = 5$.',
          'Tính $b^2 = c^2 - a^2 = 25 - 9 = 16$ và viết phương trình $\\frac{x^2}{9} - \\frac{y^2}{16} = 1$.'
        ],
        sampleAnswer:
          'Vì $(H)$ đi qua $A(3; 0)$ nên thay vào $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ được $a^2 = 9 \\implies a = 3$. Vì tiêu điểm $F_2(5; 0)$ nên $c = 5$. Suy ra $b^2 = c^2 - a^2 = 25 - 9 = 16$. Vậy $(H): \\frac{x^2}{9} - \\frac{y^2}{16} = 1$.'
      }
    },
    {
      stepTitle: '3. Đường Parabol Chính tắc $y^2 = 2px$ & Ứng dụng Chảo Parabol / Đèn pha',
      stepType: 'example',
      conceptSection:
        'Parabol chính tắc nằm ngang $y^2 = 2px$ ($p > 0$) có đỉnh tại $O(0; 0)$, nhận trục hoành $Ox$ làm trục đối xứng, mở bề lõm về phía phải ($x \\ge 0$). Mọi điểm $M(x; y)$ trên Parabol cách đều tiêu điểm $F(\\frac{p}{2}; 0)$ và đường chuẩn $\\Delta: x = -\\frac{p}{2}$.',
      formulaSection: {
        primaryFormula: 'y^2 = 2px \\ (p > 0): \\quad MF = d(M, \\Delta) = x_M + \\frac{p}{2}',
        secondaryFormulas: [
          '\\text{Tiêu điểm: } F\\left(\\frac{p}{2};\\ 0\\right), \\quad \\text{Đường chuẩn: } x = -\\frac{p}{2}',
          '\\text{Tham số tiêu } p = d(F, \\Delta)'
        ],
        variablesNote:
          '• **Cẩn thận nhầm giữa $p$ và $\\frac{p}{2}$**: Trong phương trình $y^2 = 2px$, hệ số trước $x$ là $2p$, còn tọa độ tiêu điểm chỉ là $\\frac{p}{2}$ (bằng hệ số trước $x$ **chia cho 4**!).\n• Tính chất phản xạ quang học: mọi tia sáng song song trục đối xứng chiếu vào gương Parabol đều hội tụ đúng tại tiêu điểm $F$ (nguyên lý ăng-ten chảo, gương cầu lõm nấu ăn năng lượng mặt trời).'
      },
      deepDiveSection:
        'Khi giải bài toán tìm vị trí đặt bóng đèn (tiêu điểm) trong chóa đèn pha có đường kính vành $D$ và độ sâu $h$: đặt đỉnh chóa tại $O(0; 0)$, trục $Ox$ hướng ra miệng đèn, khi đó mép vành đèn có tọa độ $(h; \\frac{D}{2})$. Thay vào $y^2 = 2px$ tìm ra $p$, từ đó xác định khoảng cách từ đáy chóa tới tiêu điểm đúng bằng $\\frac{p}{2}$.',
      teacherExplanation: 'Để tìm tiêu điểm từ $y^2 = kx$, chia nhanh $k$ cho $4$ là ra hoành độ tiêu điểm $\\frac{p}{2}$!',
      keyTakeaway: 'Bán kính qua tiêu trên Parabol $y^2 = 2px$ bằng $x_M + \\frac{p}{2}$; ứng dụng tính tiêu cự chóa đèn/chảo thu.',
      miniQuiz: [
        {
          id: 'm108-s3-q1',
          question: 'Điểm $M(2; y_0)$ thuộc Parabol $y^2 = 8x$. Khoảng cách từ $M$ đến tiêu điểm $F$ của Parabol là:',
          options: ['A. $4$', 'B. $2$', 'C. $6$', 'D. $8$'],
          correctIndex: 0,
          explanation: '$2p = 8 \\implies p = 4 \\implies \\frac{p}{2} = 2$. Vậy $MF = x_M + \\frac{p}{2} = 2 + 2 = 4$.'
        },
        {
          id: 'm108-s3-q2',
          question: 'Một chóa đèn pha có mặt cắt Parabol sâu $9\\text{ cm}$ và đường kính miệng đèn $24\\text{ cm}$. Bóng đèn cần đặt tại tiêu điểm cách đỉnh chóa đèn một khoảng là:',
          options: ['A. $4\\text{ cm}$', 'B. $8\\text{ cm}$', 'C. $2\\text{ cm}$', 'D. $6\\text{ cm}$'],
          correctIndex: 0,
          explanation: 'Mép đèn có tọa độ $(9; 12)$. Thay vào $y^2 = 2px$: $12^2 = 2p\\cdot 9 \\implies 2p = 16 \\implies \\frac{p}{2} = \\frac{16}{4} = 4\\text{ cm}$.'
        }
      ],
      miniEssay: {
        id: 'm108-s3-e1',
        question: 'Cho Parabol $(P): y^2 = 2px$ ($p > 0$) đi qua điểm $M(4; -8)$. Tìm tham số tiêu $p$, tọa độ tiêu điểm $F$ và phương trình đường chuẩn $\\Delta$ của $(P)$.',
        hint: 'Thay $x = 4, y = -8$ vào $y^2 = 2px$ để tìm $p$, sau đó viết $F(\\frac{p}{2}; 0)$ và $\\Delta: x = -\\frac{p}{2}$.',
        rubricChecklist: [
          'Thay $M(4; -8)$: $(-8)^2 = 2p \\cdot 4 \\iff 64 = 8p \\implies p = 8$.',
          'Xác định đúng tiêu điểm $F(4; 0)$.',
          'Viết đúng phương trình đường chuẩn $\\Delta: x = -4$.'
        ],
        sampleAnswer:
          'Vì $M(4; -8) \\in (P)$ nên $(-8)^2 = 2p \\cdot 4 \\iff 64 = 8p \\iff p = 8$. Suy ra $\\frac{p}{2} = 4$. Vậy tham số tiêu là $p = 8$, tiêu điểm là $F(4; 0)$ và đường chuẩn là $\\Delta: x = -4$.'
      }
    }
  ],
  'math-11-1': [
    {
      stepTitle: '1. Đường tròn Lượng giác, Công thức Quy đổi & Hàm số Lượng giác Cơ bản',
      stepType: 'concept',
      conceptSection:
        'Trên đường tròn lượng giác tâm $O$ bán kính $1$, điểm cuối cung $\\alpha$ có tọa độ $(\\cos\\alpha; \\sin\\alpha)$. Bốn hàm số $y = \\sin x, y = \\cos x, y = \\tan x, y = \\cot x$ đều là các hàm tuần hoàn và có tập giá trị đặc trưng.',
      formulaSection: {
        primaryFormula: '-1 \\le \\sin x \\le 1, \\qquad -1 \\le \\cos x \\le 1 \\quad \\forall x \\in \\mathbb{R}',
        secondaryFormulas: [
          '\\tan x \\text{ xác định} \\iff x \\neq \\frac{\\pi}{2} + k\\pi; \\qquad \\cot x \\text{ xác định} \\iff x \\neq k\\pi',
          '\\sin(-x) = -\\sin x\\ (\\text{lẻ}), \\qquad \\cos(-x) = \\cos x\\ (\\text{chẵn})'
        ],
        variablesNote:
          '• **Chu kỳ tuần hoàn cơ bản**: $\\sin x, \\cos x$ tuần hoàn chu kỳ $T = 2\\pi$; $\\tan x, \\cot x$ tuần hoàn chu kỳ $T = \\pi$.\n• Hàm hợp $y = \\sin(\\omega x + \\varphi)$ có chu kỳ $T = \\frac{2\\pi}{|\\omega|}$.'
      },
      deepDiveSection:
        'Khi tìm giá trị lớn nhất / nhỏ nhất của biểu thức dạng $y = a\\sin x + b\\cos x + c$ mà chưa học đạo hàm, nhớ ngay bất đẳng thức Bunyakovsky: $-\\sqrt{a^2 + b^2} \\le a\\sin x + b\\cos x \\le \\sqrt{a^2 + b^2}$. Cách này giải cực nhanh mọi câu trắc nghiệm GTLN/GTNN lớp 11!',
      teacherExplanation: 'Nhớ nhanh điều kiện xác định của $\\tan x$ (mẫu $\\cos x \\neq 0$) và $\\cot x$ (mẫu $\\sin x \\neq 0$) trước mọi phép biến đổi.',
      keyTakeaway: '$-1 \\le \\sin x, \\cos x \\le 1$; $\\cos x$ là hàm chẵn duy nhất trong 4 hàm lượng giác cơ bản.',
      miniQuiz: [
        {
          id: 'm111-s1-q1',
          question: 'Tập xác định của hàm số $y = \\tan\\left(2x - \\frac{\\pi}{3}\\right)$ là:',
          options: [
            'A. $\\mathbb{R} \\setminus \\left\\{\\frac{5\\pi}{12} + k\\frac{\\pi}{2} \\mid k \\in \\mathbb{Z}\\right\\}$',
            'B. $\\mathbb{R} \\setminus \\left\\{\\frac{\\pi}{6} + k\\pi \\mid k \\in \\mathbb{Z}\\right\\}$',
            'C. $\\mathbb{R} \\setminus \\left\\{\\frac{5\\pi}{12} + k\\pi \\mid k \\in \\mathbb{Z}\\right\\}$',
            'D. $\\mathbb{R}$'
          ],
          correctIndex: 0,
          explanation: '$\\cos(2x - \\frac{\\pi}{3}) \\neq 0 \\iff 2x - \\frac{\\pi}{3} \\neq \\frac{\\pi}{2} + k\\pi \\iff 2x \\neq \\frac{5\\pi}{6} + k\\pi \\iff x \\neq \\frac{5\\pi}{12} + k\\frac{\\pi}{2}$.'
        },
        {
          id: 'm111-s1-q2',
          question: 'Giá trị lớn nhất $M$ và nhỏ nhất $m$ của hàm số $y = 3\\sin x - 2$ lần lượt là:',
          options: ['A. $M = 1,\\ m = -5$', 'B. $M = 3,\\ m = -3$', 'C. $M = 5,\\ m = -1$', 'D. $M = 1,\\ m = -3$'],
          correctIndex: 0,
          explanation: 'Vì $-1 \\le \\sin x \\le 1 \\implies -3 - 2 \\le y \\le 3 - 2 \\iff -5 \\le y \\le 1$.'
        }
      ],
      miniEssay: {
        id: 'm111-s1-e1',
        question: 'Tìm giá trị lớn nhất và nhỏ nhất của hàm số $y = 2\\cos^2 x + 4\\sin x - 1$ với $x \\in \\mathbb{R}$.',
        hint: 'Đổi $\\cos^2 x = 1 - \\sin^2 x$, đặt $t = \\sin x \\in [-1; 1]$ để khảo sát hàm bậc hai $f(t) = -2t^2 + 4t + 1$ trên đoạn $[-1; 1]$.',
        rubricChecklist: [
          'Biến đổi $y = 2(1 - \\sin^2 x) + 4\\sin x - 1 = -2\\sin^2 x + 4\\sin x + 1$.',
          'Đặt $t = \\sin x \\in [-1; 1]$, tìm đỉnh Parabol $t_I = 1 \\in [-1; 1]$.',
          'Tính tại $t = 1 \\implies \\max y = 3$; tại $t = -1 \\implies \\min y = -5$.'
        ],
        sampleAnswer:
          'Ta có $y = 2(1 - \\sin^2 x) + 4\\sin x - 1 = -2\\sin^2 x + 4\\sin x + 1$. Đặt $t = \\sin x$ ($t \\in [-1; 1]$), xét hàm bậc hai $f(t) = -2t^2 + 4t + 1$. Hoành độ đỉnh $t_I = \\frac{-4}{2(-2)} = 1 \\in [-1; 1]$. Vì $a = -2 < 0$ nên $f(t)$ đồng biến trên $[-1; 1]$. Do đó $\\max y = f(1) = 3$ (khi $\\sin x = 1$) và $\\min y = f(-1) = -5$ (khi $\\sin x = -1$).'
      }
    },
    {
      stepTitle: '2. Bốn Phương trình Lượng giác Cơ bản & Trường hợp Đặc biệt',
      stepType: 'derivation',
      conceptSection:
        'Mọi phương trình lượng giác đều quy về một trong bốn phương trình cơ bản: $\\sin x = m$, $\\cos x = m$, $\\tan x = m$, $\\cot x = m$. Chỉ hai phương trình $\\sin$ và $\\cos$ cần điều kiện có nghiệm $|m| \\le 1$; còn $\\tan$ và $\\cot$ luôn có nghiệm với mọi $m \\in \\mathbb{R}$.',
      formulaSection: {
        primaryFormula: '\\sin x = \\sin\\alpha \\iff \\left[\\begin{array}{l} x = \\alpha + k2\\pi \\\\ x = \\pi - \\alpha + k2\\pi \\end{array}\\right., \\qquad \\cos x = \\cos\\alpha \\iff x = \\pm\\alpha + k2\\pi',
        secondaryFormulas: [
          '\\tan x = \\tan\\alpha \\iff x = \\alpha + k\\pi, \\qquad \\cot x = \\cot\\alpha \\iff x = \\alpha + k\\pi',
          '\\text{Đặc biệt } (= 0): \\ \\sin x = 0 \\iff x = k\\pi; \\quad \\cos x = 0 \\iff x = \\frac{\\pi}{2} + k\\pi'
        ],
        variablesNote:
          '• **Cảnh báo đơn vị góc**: Không bao giờ viết chung độ và radian trong cùng một công thức nghiệm (sai nặng: $\\frac{\\pi}{6} + k360^\\circ$ hay $30^\\circ + k2\\pi$)! Phải viết đồng bộ $k2\\pi$ (radian) hoặc $k360^\\circ$ (độ).\n• Ba giá trị đặc biệt của $\\sin, \\cos$ ($0, 1, -1$) viết gộp 1 họ nghiệm để tránh lặp.'
      },
      deepDiveSection:
        'Khi đề bài yêu cầu **đếm số nghiệm trên một khoảng/đoạn** $[a; b]$, sau khi giải ra họ nghiệm tổng quát (ví dụ $x = \\frac{\\pi}{6} + k\\pi$), đặt $a \\le \\frac{\\pi}{6} + k\\pi \\le b$, giải ra khoảng của $k$, rồi đếm đúng số giá trị **nguyên $k \\in \\mathbb{Z}$** nằm trong khoảng đó.',
      teacherExplanation: 'Nhớ tách rành mạch: $\\sin x$ có $\\alpha$ và $\\pi - \\alpha$ (chu kỳ $2\\pi$); $\\cos x$ có $\\pm \\alpha$ ($2\\pi$); $\\tan, \\cot$ chỉ có 1 họ chu kỳ $\\pi$.',
      keyTakeaway: 'Tuyệt đối không trộn lẫn đơn vị độ ($^\\circ$) và radian ($\\pi$) trong cùng một công thức nghiệm!',
      miniQuiz: [
        {
          id: 'm111-s2-q1',
          question: 'Nghiệm của phương trình $\\cos x = \\frac{1}{2}$ là:',
          options: [
            'A. $x = \\pm\\frac{\\pi}{3} + k2\\pi\\ (k \\in \\mathbb{Z})$',
            'B. $x = \\pm\\frac{\\pi}{6} + k2\\pi\\ (k \\in \\mathbb{Z})$',
            'C. $x = \\frac{\\pi}{3} + k\\pi\\ (k \\in \\mathbb{Z})$',
            'D. $x = \\frac{\\pi}{3} + k2\\pi,\\ x = \\frac{2\\pi}{3} + k2\\pi\\ (k \\in \\mathbb{Z})$'
          ],
          correctIndex: 0,
          explanation: '$\\cos\\frac{\\pi}{3} = \\frac{1}{2} \\implies x = \\pm\\frac{\\pi}{3} + k2\\pi$.'
        },
        {
          id: 'm111-s2-q2',
          question: 'Số nghiệm của phương trình $\\sin 2x = 1$ thuộc đoạn $[0; 2\\pi]$ là:',
          options: ['A. $2$', 'B. $1$', 'C. $3$', 'D. $4$'],
          correctIndex: 0,
          explanation: '$2x = \\frac{\\pi}{2} + k2\\pi \\iff x = \\frac{\\pi}{4} + k\\pi$. Giải $0 \\le \\frac{\\pi}{4} + k\\pi \\le 2\\pi \\iff -\\frac{1}{4} \\le k \\le \\frac{7}{4} \\implies k \\in \\{0; 1\\}$ (2 nghiệm).'
        }
      ],
      miniEssay: {
        id: 'm111-s2-e1',
        question: 'Giải phương trình $\\sqrt{3}\\tan\\left(x - \\frac{\\pi}{4}\\right) - 1 = 0$ và tìm nghiệm thuộc khoảng $(0; 2\\pi)$.',
        hint: 'Đưa về $\\tan(x - \\frac{\\pi}{4}) = \\frac{1}{\\sqrt{3}} = \\tan\\frac{\\pi}{6}$, giải $x = \\frac{5\\pi}{12} + k\\pi$, rồi kẹp $0 < x < 2\\pi$.',
        rubricChecklist: [
          'Giải đúng $x - \\frac{\\pi}{4} = \\frac{\\pi}{6} + k\\pi \\iff x = \\frac{5\\pi}{12} + k\\pi\\ (k \\in \\mathbb{Z})$.',
          'Giải bất phương trình $-\\frac{5}{12} < k < \\frac{19}{12} \\implies k \\in \\{0; 1\\}$.',
          'Kết luận hai nghiệm $\\frac{5\\pi}{12}$ và $\\frac{17\\pi}{12}$.'
        ],
        sampleAnswer:
          'Phương trình $\\iff \\tan\\left(x - \\frac{\\pi}{4}\\right) = \\frac{1}{\\sqrt{3}} = \\tan\\frac{\\pi}{6} \\iff x - \\frac{\\pi}{4} = \\frac{\\pi}{6} + k\\pi \\iff x = \\frac{5\\pi}{12} + k\\pi$ ($k \\in \\mathbb{Z}$). Để $x \\in (0; 2\\pi)$: $0 < \\frac{5\\pi}{12} + k\\pi < 2\\pi \\iff -\\frac{5}{12} < k < \\frac{19}{12}$. Vì $k \\in \\mathbb{Z}$ nên $k \\in \\{0; 1\\}$, cho hai nghiệm $x = \\frac{5\\pi}{12}$ và $x = \\frac{17\\pi}{12}$.'
      }
    },
    {
      stepTitle: '3. Phương trình Quy về Bậc hai & Bậc nhất theo $\\sin x, \\cos x$',
      stepType: 'example',
      conceptSection:
        'Khi phương trình chứa cả bậc hai lẫn bậc nhất của $\\sin x, \\cos x$, dùng $\\sin^2 x + \\cos^2 x = 1$ để đồng bộ về một hàm số rồi đặt ẩn phụ $t \\in [-1; 1]$. Nếu phương trình có dạng $a\\sin x + b\\cos x = c$, điều kiện có nghiệm là $a^2 + b^2 \\ge c^2$.',
      formulaSection: {
        primaryFormula: 'a\\sin x + b\\cos x = c \\quad \\text{có nghiệm} \\iff a^2 + b^2 \\ge c^2',
        secondaryFormulas: [
          '\\text{Chia 2 vế cho } \\sqrt{a^2 + b^2} \\implies \\sin(x + \\alpha) = \\frac{c}{\\sqrt{a^2 + b^2}}',
          '\\cos 2x = 1 - 2\\sin^2 x = 2\\cos^2 x - 1'
        ],
        variablesNote:
          '• **Mẹo giải nhanh $a\\sin x + b\\cos x = c$**: Chia ngay hai vế cho $\\sqrt{a^2 + b^2}$ để biến cặp hệ số thành $(\\cos\\alpha; \\sin\\alpha)$ quen thuộc (thường gặp $1, \\sqrt{3}$ chia $2$; hoặc $1, 1$ chia $\\sqrt{2}$).\n• Nhớ kiểm tra điều kiện ẩn phụ $-1 \\le t \\le 1$ trước khi giải ngược ra $x$!'
      },
      deepDiveSection:
        'Nếu phương trình vừa có $\\cos 2x$ vừa có $\\sin x$ (hoặc $\\cos x$), công thức nhân đôi $\\cos 2x = 1 - 2\\sin^2 x$ (hoặc $2\\cos^2 x - 1$) là chìa khóa chuyển về cùng một biến $\\sin x$ hoặc $\\cos x$ ngay lập tức.',
      teacherExplanation: 'Gặp $a\\sin x + b\\cos x = c$, kiểm tra $a^2 + b^2 \\ge c^2$ trước rồi chia hai vế cho $\\sqrt{a^2 + b^2}$.',
      keyTakeaway: 'Dùng $\\cos 2x = 1 - 2\\sin^2 x$ để biến phương trình hỗn hợp về bậc hai một ẩn $\\sin x \\in [-1; 1]$.',
      miniQuiz: [
        {
          id: 'm111-s3-q1',
          question: 'Phương trình $m\\sin x + 3\\cos x = 5$ có nghiệm khi và chỉ khi:',
          options: ['A. $|m| \\ge 4$', 'B. $|m| \\le 4$', 'C. $m \\ge 4$', 'D. $|m| \\ge 2$'],
          correctIndex: 0,
          explanation: 'Điều kiện có nghiệm: $m^2 + 3^2 \\ge 5^2 \\iff m^2 \\ge 16 \\iff |m| \\ge 4$.'
        },
        {
          id: 'm111-s3-q2',
          question: 'Phương trình $\\cos 2x + 3\\sin x - 2 = 0$ tương đương với phương trình nào theo $t = \\sin x$?',
          options: [
            'A. $-2t^2 + 3t - 1 = 0$',
            'B. $2t^2 + 3t - 1 = 0$',
            'C. $-2t^2 + 3t - 3 = 0$',
            'D. $2t^2 - 3t + 1 = 0$'
          ],
          correctIndex: 0,
          explanation: 'Thay $\\cos 2x = 1 - 2\\sin^2 x$: $(1 - 2t^2) + 3t - 2 = 0 \\iff -2t^2 + 3t - 1 = 0$.'
        }
      ],
      miniEssay: {
        id: 'm111-s3-e1',
        question: 'Giải phương trình $\\sin x + \\sqrt{3}\\cos x = 1$.',
        hint: 'Chia cả hai vế cho $\\sqrt{1^2 + (\\sqrt{3})^2} = 2$ để đưa về dạng $\\sin(x + \\frac{\\pi}{3}) = \\frac{1}{2}$.',
        rubricChecklist: [
          'Chia 2 vế cho $2$: $\\frac{1}{2}\\sin x + \\frac{\\sqrt{3}}{2}\\cos x = \\frac{1}{2}$.',
          'Thu gọn $\\sin\\left(x + \\frac{\\pi}{3}\\right) = \\sin\\frac{\\pi}{6}$.',
          'Giải đủ 2 họ nghiệm $x = -\\frac{\\pi}{6} + k2\\pi$ và $x = \\frac{\\pi}{2} + k2\\pi\\ (k \\in \\mathbb{Z})$.'
        ],
        sampleAnswer:
          'Chia hai vế cho $\\sqrt{1^2 + (\\sqrt{3})^2} = 2$: $\\frac{1}{2}\\sin x + \\frac{\\sqrt{3}}{2}\\cos x = \\frac{1}{2} \\iff \\sin x\\cos\\frac{\\pi}{3} + \\cos x\\sin\\frac{\\pi}{3} = \\frac{1}{2} \\iff \\sin\\left(x + \\frac{\\pi}{3}\\right) = \\sin\\frac{\\pi}{6}$. Suy ra $x + \\frac{\\pi}{3} = \\frac{\\pi}{6} + k2\\pi \\implies x = -\\frac{\\pi}{6} + k2\\pi$ hoặc $x + \\frac{\\pi}{3} = \\frac{5\\pi}{6} + k2\\pi \\implies x = \\frac{\\pi}{2} + k2\\pi$ ($k \\in \\mathbb{Z}$).'
      }
    }
  ],
  'math-11-2': [
    {
      stepTitle: '1. Định nghĩa Đạo hàm tại Một điểm & Các Quy tắc Tính Đạo hàm',
      stepType: 'concept',
      conceptSection:
        'Đạo hàm của hàm số $y = f(x)$ tại điểm $x_0$ là giới hạn tỉ số số gia $\\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}$, đo **tốc độ biến thiên tức thời** của hàm số (trong Vật lí, đạo hàm quãng đường $s\'(t)$ là vận tốc tức thời $v(t)$).',
      formulaSection: {
        primaryFormula: '(u \\cdot v)\' = u\'v + uv\', \\qquad \\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}',
        secondaryFormulas: [
          '(x^n)\' = n x^{n-1}, \\qquad (\\sqrt{x})\' = \\frac{1}{2\\sqrt{x}}, \\qquad \\left(\\frac{1}{x}\\right)\' = -\\frac{1}{x^2}',
          '(\\sin x)\' = \\cos x, \\quad (\\cos x)\' = -\\sin x, \\quad (\\tan x)\' = \\frac{1}{\\cos^2 x}'
        ],
        variablesNote:
          '• **Công thức tính nhanh phân thức bậc 1/bậc 1**: $\\left(\\frac{ax + b}{cx + d}\\right)\' = \\frac{ad - bc}{(cx + d)^2}$ (tính trong 2 giây!).\n• Đừng quên dấu **TRỪ** ở đạo hàm của $\\cos x$ và $\\cot x$ (các hàm chữ "co" đều có dấu trừ khi lấy đạo hàm!).'
      },
      deepDiveSection:
        'Lỗi sai thường gặp khi áp dụng quy tắc thương $\\left(\\frac{u}{v}\\right)\'$ là đảo ngược dấu trừ trên tử thành $uv\' - u\'v$. Hãy nhớ: đạo hàm của **tử số $u\'$** luôn đứng trước!',
      teacherExplanation: 'Gặp hàm phân thức bậc nhất trên bậc nhất, dùng ngay quy tắc nhân chéo $\\frac{ad - bc}{(cx + d)^2}$!',
      keyTakeaway: '$(u/v)\' = \\frac{u\'v - uv\'}{v^2}$; mọi hàm lượng giác bắt đầu bằng "co-" ($\\cos, \\cot$) đều có dấu trừ khi đạo hàm.',
      miniQuiz: [
        {
          id: 'm112-s1-q1',
          question: 'Đạo hàm của hàm số $y = \\frac{2x - 1}{x + 3}$ là:',
          options: [
            'A. $y\' = \\frac{7}{(x + 3)^2}$',
            'B. $y\' = \\frac{5}{(x + 3)^2}$',
            'C. $y\' = \\frac{-7}{(x + 3)^2}$',
            'D. $y\' = 2$'
          ],
          correctIndex: 0,
          explanation: '$y\' = \\frac{2\\cdot 3 - (-1)\\cdot 1}{(x + 3)^2} = \\frac{6 + 1}{(x + 3)^2} = \\frac{7}{(x + 3)^2}$.'
        },
        {
          id: 'm112-s1-q2',
          question: 'Một chất điểm chuyển động có phương trình $s(t) = t^3 - 3t^2 + 5t$ ($s$ tính bằng mét, $t$ bằng giây). Vận tốc tức thời tại thời điểm $t = 2\\text{ s}$ là:',
          options: ['A. $5\\text{ m/s}$', 'B. $4\\text{ m/s}$', 'C. $12\\text{ m/s}$', 'D. $6\\text{ m/s}$'],
          correctIndex: 0,
          explanation: '$v(t) = s\'(t) = 3t^2 - 6t + 5 \\implies v(2) = 3(4) - 6(2) + 5 = 5\\text{ m/s}$.'
        }
      ],
      miniEssay: {
        id: 'm112-s1-e1',
        question: 'Tính đạo hàm của hàm số $y = x^3 \\cdot \\cos x - 2\\sqrt{x}$ với $x > 0$.',
        hint: 'Áp dụng quy tắc tích $(u\\cdot v)\' = u\'v + uv\'$ cho $x^3\\cos x$ và $(\\sqrt{x})\' = \\frac{1}{2\\sqrt{x}}$.',
        rubricChecklist: [
          'Tính đúng $(x^3\\cos x)\' = 3x^2\\cos x - x^3\\sin x$.',
          'Tính đúng $(-2\\sqrt{x})\' = -\\frac{1}{\\sqrt{x}}$.',
          'Ghép lại kết quả hoàn chỉnh $y\' = 3x^2\\cos x - x^3\\sin x - \\frac{1}{\\sqrt{x}}$.'
        ],
        sampleAnswer:
          'Áp dụng quy tắc đạo hàm của tích và hiệu: $y\' = (x^3)\'\\cos x + x^3(\\cos x)\' - 2(\\sqrt{x})\' = 3x^2\\cos x - x^3\\sin x - 2\\cdot\\frac{1}{2\\sqrt{x}} = 3x^2\\cos x - x^3\\sin x - \\frac{1}{\\sqrt{x}}$.'
      }
    },
    {
      stepTitle: '2. Đạo hàm Hàm hợp $[f(u(x))]\' = f\'(u) \\cdot u\'(x)$ & Đạo hàm Cấp hai',
      stepType: 'derivation',
      conceptSection:
        'Khi biểu thức bên trong không phải là $x$ đứng một mình mà là một hàm trung gian $u = u(x)$ (ví dụ $\\sin(2x+1)$, $\\sqrt{x^2+3}$, $(3x-1)^5$), ta phải nhân thêm thừa số $u\'(x)$ — gọi là quy tắc đạo hàm hàm hợp.',
      formulaSection: {
        primaryFormula: '[f(u(x))]\' = f\'(u) \\cdot u\'(x)',
        secondaryFormulas: [
          '(u^n)\' = n \\cdot u^{n-1} \\cdot u\', \\qquad (\\sqrt{u})\' = \\frac{u\'}{2\\sqrt{u}}',
          '(\\sin u)\' = u\'\\cos u, \\qquad (\\cos u)\' = -u\'\\sin u'
        ],
        variablesNote:
          '• **Sai lầm kinh điển số 1**: Quên nhân $u\'$! Ví dụ viết $(\\sin 3x)\' = \\cos 3x$ (SAI — thiếu nhân $3$), hoặc $((2x+1)^4)\' = 4(2x+1)^3$ (SAI — thiếu nhân $2$!).\n• Đạo hàm cấp hai $y\'\' = (y\')\'$ ứng dụng trực tiếp để tìm gia tốc $a(t) = s\'\'(t)$.'
      },
      deepDiveSection:
        'Với hàm hợp lồng nhiều lớp như $y = \\sin^3(2x) = [\\sin(2x)]^3$, hãy bóc từ **lớp ngoài cùng vào trong**: lớp 1 là lũy thừa mũ $3$ $\\to 3\\sin^2(2x)$; lớp 2 là $\\sin(2x) \\to \\cos(2x)$; lớp 3 là $2x \\to 2$. Nhân lại ra $6\\sin^2(2x)\\cos(2x)$.',
      teacherExplanation: 'Quy tắc bóc vỏ hành: đạo hàm từ lớp phép toán ngoài cùng vào trong, nhân nối tiếp $u\'$ cho tới biến $x$.',
      keyTakeaway: 'Đừng bao giờ quên đuôi $u\'$ khi lấy đạo hàm của $u^n$, $\\sqrt{u}$ hay $\\sin u$.',
      miniQuiz: [
        {
          id: 'm112-s2-q1',
          question: 'Đạo hàm của hàm số $y = \\sqrt{x^2 + 4x}$ là:',
          options: [
            'A. $\\frac{x + 2}{\\sqrt{x^2 + 4x}}$',
            'B. $\\frac{1}{2\\sqrt{x^2 + 4x}}$',
            'C. $\\frac{2x + 4}{\\sqrt{x^2 + 4x}}$',
            'D. $\\frac{x + 4}{2\\sqrt{x^2 + 4x}}$'
          ],
          correctIndex: 0,
          explanation: '$y\' = \\frac{(x^2 + 4x)\'}{2\\sqrt{x^2 + 4x}} = \\frac{2x + 4}{2\\sqrt{x^2 + 4x}} = \\frac{x + 2}{\\sqrt{x^2 + 4x}}$.'
        },
        {
          id: 'm112-s2-q2',
          question: 'Đạo hàm cấp hai của hàm số $y = \\cos(2x)$ là:',
          options: ['A. $-4\\cos(2x)$', 'B. $-2\\sin(2x)$', 'C. $4\\cos(2x)$', 'D. $-4\\sin(2x)$'],
          correctIndex: 0,
          explanation: '$y\' = -2\\sin(2x) \\implies y\'\' = -2 \\cdot 2\\cos(2x) = -4\\cos(2x)$.'
        }
      ],
      miniEssay: {
        id: 'm112-s2-e1',
        question: 'Tính đạo hàm của hàm số $y = (3x^2 - 2)^4 + \\sin(5x - 1)$.',
        hint: 'Dùng $(u^4)\' = 4u^3 \\cdot u\'$ và $(\\sin u)\' = u\'\\cos u$.',
        rubricChecklist: [
          'Đạo hàm $[(3x^2 - 2)^4]\' = 4(3x^2 - 2)^3 \\cdot 6x = 24x(3x^2 - 2)^3$.',
          'Đạo hàm $[\\sin(5x - 1)]\' = 5\\cos(5x - 1)$.',
          'Cộng chính xác thành kết quả cuối.'
        ],
        sampleAnswer:
          'Áp dụng quy tắc đạo hàm hàm hợp: $y\' = 4(3x^2 - 2)^3 \\cdot (3x^2 - 2)\' + (5x - 1)\'\\cos(5x - 1) = 4(3x^2 - 2)^3 \\cdot 6x + 5\\cos(5x - 1) = 24x(3x^2 - 2)^3 + 5\\cos(5x - 1)$.'
      }
    },
    {
      stepTitle: '3. Ý nghĩa Hình học & Viết Phương trình Tiếp tuyến của Đồ thị',
      stepType: 'example',
      conceptSection:
        'Hệ số góc của tiếp tuyến với đồ thị $(C): y = f(x)$ tại tiếp điểm $M_0(x_0; y_0)$ chính bằng giá trị đạo hàm tại hoành độ tiếp điểm: $k = f\'(x_0)$. Mọi bài toán tiếp tuyến đều xoay quanh việc tìm đủ bộ 3 số $(x_0, y_0, k)$.',
      formulaSection: {
        primaryFormula: 'y = f\'(x_0)(x - x_0) + y_0 \\quad (\\text{với } y_0 = f(x_0))',
        secondaryFormulas: [
          '\\text{Song song đường } d: y = ax + b \\implies f\'(x_0) = a \\ (\\text{kiểm tra loại trùng } d)',
          '\\text{Vuông góc đường } d: y = ax + b \\implies f\'(x_0) \\cdot a = -1'
        ],
        variablesNote:
          '• **3 dạng bài tiếp tuyến kinh điển**:\n  - Dạng 1 (cho $x_0$ hoặc $y_0$): thay thẳng tìm $(x_0, y_0, f\'(x_0))$.\n  - Dạng 2 (cho hệ số góc $k$, hoặc song song/vuông góc đường thẳng): giải phương trình $f\'(x_0) = k$ tìm $x_0$.\n  - Dạng 3 (tiếp tuyến **đi qua** $A(x_A; y_A)$): viết $y_A = f\'(x_0)(x_A - x_0) + f(x_0)$ rồi giải tìm $x_0$!'
      },
      deepDiveSection:
        'Phân biệt cực kỹ hai chữ **"tại điểm $A$"** (tức $A$ là tiếp điểm $x_0 = x_A$) và **"đi qua điểm $A$"** ($A$ chưa chắc là tiếp điểm!). Nếu đề nói *"tiếp tuyến đi qua $A(0; 1)$"*, bắt buộc phải gọi tiếp điểm $M(x_0; f(x_0))$ và thay $A$ vào phương trình tiếp tuyến tổng quát để giải ra số nghiệm $x_0$ (mỗi nghiệm $x_0$ cho 1 tiếp tuyến).',
      teacherExplanation: 'Đọc kỹ từ khóa "tại điểm" ($x_0 = x_A$) hay "đi qua điểm" (lập PT giải $x_0$) trước khi viết phương trình tiếp tuyến!',
      keyTakeaway: 'Tiếp tuyến tại $M_0(x_0; y_0)$ có phương trình $y = f\'(x_0)(x - x_0) + y_0$.',
      miniQuiz: [
        {
          id: 'm112-s3-q1',
          question: 'Tiếp tuyến của đồ thị $y = x^3 - 3x + 2$ tại điểm có hoành độ $x_0 = 2$ có phương trình là:',
          options: ['A. $y = 9x - 14$', 'B. $y = 9x + 14$', 'C. $y = 9x - 4$', 'D. $y = 12x - 20$'],
          correctIndex: 0,
          explanation: '$y_0 = 8 - 6 + 2 = 4$; $y\' = 3x^2 - 3 \\implies k = y\'(2) = 9$. Tiếp tuyến: $y = 9(x - 2) + 4 = 9x - 14$.'
        },
        {
          id: 'm112-s3-q2',
          question: 'Có bao nhiêu tiếp tuyến của đồ thị $y = x^3 - 3x^2 + 1$ song song với đường thẳng $d: y = 9x - 5$?',
          options: ['A. $2$', 'B. $1$', 'C. $0$', 'D. $3$'],
          correctIndex: 0,
          explanation: '$y\' = 3x^2 - 6x = 9 \\iff x^2 - 2x - 3 = 0 \\iff x_0 = -1$ hoặc $x_0 = 3$. Cả 2 tiếp tuyến đều có tung độ gốc khác $-5$ (tại $x=-1$: $y = 9(x+1)-3 = 9x+6$; tại $x=3$: $y = 9(x-3)+1 = 9x-26$). Vậy có $2$ tiếp tuyến.'
        }
      ],
      miniEssay: {
        id: 'm112-s3-e1',
        question: 'Viết phương trình tiếp tuyến của đồ thị $(C): y = \\frac{x + 2}{x - 1}$ biết tiếp tuyến vuông góc với đường thẳng $d: y = \\frac{1}{3}x + 2$.',
        hint: 'Từ vuông góc với $y = \\frac{1}{3}x + 2$ suy ra hệ số góc tiếp tuyến $k = -3$. Giải $y\'(x_0) = -3$ để tìm hai tiếp điểm.',
        rubricChecklist: [
          'Tính đúng đạo hàm $y\' = \\frac{-3}{(x - 1)^2}$.',
          'Từ vuông góc với $d$ suy ra $k = -3$, giải $\\frac{-3}{(x_0 - 1)^2} = -3 \\iff x_0 = 2$ hoặc $x_0 = 0$.',
          'Viết đủ hai tiếp tuyến: $y = -3x + 10$ và $y = -3x - 2$.'
        ],
        sampleAnswer:
          'Đạo hàm $y\' = \\frac{1(-1) - 2\\cdot 1}{(x - 1)^2} = \\frac{-3}{(x - 1)^2}$. Vì tiếp tuyến vuông góc với $d: y = \\frac{1}{3}x + 2$ nên hệ số góc tiếp tuyến là $k = -3$. Ta có $y\'(x_0) = -3 \\iff \\frac{-3}{(x_0 - 1)^2} = -3 \\iff (x_0 - 1)^2 = 1 \\iff x_0 = 2$ hoặc $x_0 = 0$. Với $x_0 = 2 \\implies y_0 = 4$, tiếp tuyến là $y = -3(x - 2) + 4 = -3x + 10$. Với $x_0 = 0 \\implies y_0 = -2$, tiếp tuyến là $y = -3(x - 0) - 2 = -3x - 2$.'
      }
    }
  ],
  'math-11-3': [
    {
      stepTitle: '1. Cấp số Cộng (CSC): Công sai $d$, Số hạng Tổng quát $u_n$ & Tổng $S_n$',
      stepType: 'concept',
      conceptSection:
        'Cấp số cộng là dãy số mà kể từ số hạng thứ hai, mỗi số hạng đều bằng số hạng đứng ngay trước nó cộng với một hằng số $d$ không đổi (gọi là **công sai**). Ba số $a, b, c$ lập thành CSC khi và chỉ khi số ở giữa là trung bình cộng hai số hai bên ($2b = a + c$).',
      formulaSection: {
        primaryFormula: 'u_n = u_1 + (n - 1)d, \\qquad S_n = \\frac{n(u_1 + u_n)}{2} = \\frac{n[2u_1 + (n-1)d]}{2}',
        secondaryFormulas: [
          'u_k = \\frac{u_{k-1} + u_{k+1}}{2} \\quad (k \\ge 2)',
          'u_m - u_k = (m - k)d'
        ],
        variablesNote:
          '• **Cặp ẩn cốt lõi**: Hầu như mọi bài toán CSC đều đưa hết về hệ hai phương trình chứa **$(u_1, d)$**!\n• Mẹo rút gọn nhanh: nếu ba số lập thành CSC có tổng cho trước, hãy đặt 3 số là $(x - d; x; x + d)$ để khử $d$ ngay lập tức!'
      },
      deepDiveSection:
        'Hiệu hai số hạng bất kỳ $u_m - u_k = (m - k)d$ giúp tìm ngay công sai $d = \\frac{u_m - u_k}{m - k}$ trong 1 phép chia mà không cần giải hệ phương trình dài dòng.',
      teacherExplanation: 'Mọi bài toán Cấp số cộng hãy quy đồng loạt các giả thiết về hai ẩn $u_1$ và công sai $d$.',
      keyTakeaway: '$u_n = u_1 + (n-1)d$ và $S_n = \\frac{n(u_1 + u_n)}{2}$; ba số CSC thì $2b = a + c$.',
      miniQuiz: [
        {
          id: 'm113-s1-q1',
          question: 'Cho cấp số cộng $(u_n)$ có $u_1 = -2$ và $u_5 = 14$. Công sai $d$ và tổng $10$ số hạng đầu $S_{10}$ là:',
          options: ['A. $d = 4,\\ S_{10} = 160$', 'B. $d = 3,\\ S_{10} = 115$', 'C. $d = 4,\\ S_{10} = 180$', 'D. $d = 4,\\ S_{10} = 140$'],
          correctIndex: 0,
          explanation: '$4d = u_5 - u_1 = 16 \\implies d = 4$. $S_{10} = \\frac{10[2(-2) + 9\\cdot 4]}{2} = 5 \\cdot 32 = 160$.'
        },
        {
          id: 'm113-s1-q2',
          question: 'Tìm $x$ để ba số $2x - 1$, $x + 3$, $2x + 5$ theo thứ tự lập thành một cấp số cộng:',
          options: ['A. $x = 1$', 'B. $x = 2$', 'C. $x = 3$', 'D. $x = -1$'],
          correctIndex: 0,
          explanation: 'Theo tính chất cấp số cộng: $2(x + 3) = (2x - 1) + (2x + 5) \\iff 2x + 6 = 4x + 4 \\iff 2x = 2 \\iff x = 1$.'
        }
      ],
      miniEssay: {
        id: 'm113-s1-e1',
        question: 'Cho cấp số cộng $(u_n)$ thỏa mãn $\\begin{cases} u_2 + u_5 = 17 \\\\ u_3 - u_1 = 6 \\end{cases}$. Tìm số hạng đầu $u_1$, công sai $d$ và tính tổng $20$ số hạng đầu tiên $S_{20}$.',
        hint: 'Từ $u_3 - u_1 = 2d = 6$ tìm ngay $d = 3$, thay vào $(u_1 + d) + (u_1 + 4d) = 17$ tìm $u_1$.',
        rubricChecklist: [
          'Từ $u_3 - u_1 = 2d = 6 \\implies d = 3$.',
          'Thay vào $2u_1 + 5d = 17 \\implies 2u_1 + 15 = 17 \\implies u_1 = 1$.',
          'Tính $S_{20} = \\frac{20(2\\cdot 1 + 19\\cdot 3)}{2} = 10 \\cdot 59 = 590$.'
        ],
        sampleAnswer:
          'Ta có $u_3 - u_1 = (u_1 + 2d) - u_1 = 2d = 6 \\implies d = 3$. Lại có $u_2 + u_5 = (u_1 + d) + (u_1 + 4d) = 2u_1 + 5d = 17 \\implies 2u_1 + 15 = 17 \\implies u_1 = 1$. Tổng $20$ số hạng đầu là $S_{20} = \\frac{20[2u_1 + 19d]}{2} = 10(2 + 57) = 590$.'
      }
    },
    {
      stepTitle: '2. Cấp số Nhân (CSN): Công bội $q$, Số hạng $u_n$ & Tổng $S_n$',
      stepType: 'derivation',
      conceptSection:
        'Cấp số nhân là dãy số mà kể từ số hạng thứ hai, mỗi số hạng đều bằng số hạng đứng ngay trước nó nhân với một hằng số $q$ không đổi (gọi là **công bội**). Ba số $a, b, c$ lập thành CSN khi và chỉ khi $b^2 = ac$.',
      formulaSection: {
        primaryFormula: 'u_n = u_1 \\cdot q^{n-1}, \\qquad S_n = u_1 \\frac{1 - q^n}{1 - q} \\quad (q \\neq 1)',
        secondaryFormulas: [
          'u_k^2 = u_{k-1} \\cdot u_{k+1} \\quad (k \\ge 2)',
          'q = 1 \\implies S_n = n \\cdot u_1; \\qquad |q| < 1 \\implies S = \\frac{u_1}{1 - q} \\ (\\text{CSN lùi vô hạn})'
        ],
        variablesNote:
          '• **Cẩn thận trường hợp $q$ âm hoặc hai giá trị**: Khi tính $q^2 = \\frac{u_5}{u_3} = 4$, nhớ lấy CẢ HAI GIÁ TRỊ $q = 2$ và $q = -2$ trừ khi đề cho dãy số tăng/các số hạng dương!\n• Đừng quên kiểm tra trường hợp $q = 1$ nếu $q$ chứa ẩn khi dùng công thức $\\frac{1 - q^n}{1 - q}$.'
      },
      deepDiveSection:
        'Công thức tổng cấp số nhân lùi vô hạn $S = \\frac{u_1}{1 - q}$ ($|q| < 1$) rất hay xuất hiện trong các bài toán viết số thập phân vô hạn tuần hoàn thành phân số hoặc tính tổng diện tích các hình vuông/tam giác lồng nhau vô hạn.',
      teacherExplanation: 'Khi khai căn tìm công bội $q$ từ bậc chẵn ($q^2, q^4$), luôn xét cả hai dấu $\\pm$ nếu đề không ràng buộc dãy dương.',
      keyTakeaway: '$u_n = u_1 q^{n-1}$, $S_n = u_1\\frac{1-q^n}{1-q}$ ($q \\neq 1$), và CSN lùi vô hạn $S = \\frac{u_1}{1-q}$ ($|q| < 1$).',
      miniQuiz: [
        {
          id: 'm113-s2-q1',
          question: 'Cho cấp số nhân $(u_n)$ có $u_1 = 3$ và công bội $q = -2$. Số hạng $u_5$ bằng:',
          options: ['A. $48$', 'B. $-48$', 'C. $24$', 'D. $-24$'],
          correctIndex: 0,
          explanation: '$u_5 = u_1 q^4 = 3 \\cdot (-2)^4 = 3 \\cdot 16 = 48$.'
        },
        {
          id: 'm113-s2-q2',
          question: 'Tổng của cấp số nhân lùi vô hạn $1 + \\frac{1}{3} + \\frac{1}{9} + \\frac{1}{27} + \\dots$ là:',
          options: ['A. $\\frac{3}{2}$', 'B. $2$', 'C. $\\frac{4}{3}$', 'D. $\\frac{5}{3}$'],
          correctIndex: 0,
          explanation: 'Đây là CSN lùi vô hạn có $u_1 = 1, q = \\frac{1}{3}$. Vậy $S = \\frac{1}{1 - 1/3} = \\frac{3}{2}$.'
        }
      ],
      miniEssay: {
        id: 'm113-s2-e1',
        question: 'Cho cấp số nhân $(u_n)$ có các số hạng đều dương, biết $u_2 = 6$ và $u_4 = 54$. Tính $u_1$, công bội $q$ và tổng $6$ số hạng đầu $S_6$.',
        hint: 'Chia $\\frac{u_4}{u_2} = q^2 = 9$. Vì dãy dương nên chọn $q = 3$, suy ra $u_1 = 2$ rồi tính $S_6 = 2\\frac{3^6 - 1}{3 - 1}$.',
        rubricChecklist: [
          'Lập tỷ số $q^2 = \\frac{u_4}{u_2} = 9$; do các số hạng dương nên $q = 3$.',
          'Tính $u_1 = \\frac{u_2}{q} = 2$.',
          'Tính $S_6 = 2 \\cdot \\frac{3^6 - 1}{3 - 1} = 729 - 1 = 728$.'
        ],
        sampleAnswer:
          'Ta có $\\frac{u_4}{u_2} = q^2 = \\frac{54}{6} = 9$. Vì các số hạng đều dương nên $q > 0 \\implies q = 3$. Suy ra $u_1 = \\frac{u_2}{q} = \\frac{6}{3} = 2$. Tổng $6$ số hạng đầu là $S_6 = u_1 \\frac{q^6 - 1}{q - 1} = 2 \\cdot \\frac{729 - 1}{2} = 728$.'
      }
    },
    {
      stepTitle: '3. Phối hợp CSC – CSN & Bài toán Thực tế Tăng trưởng / Lãi kép',
      stepType: 'example',
      conceptSection:
        'Nhiều bài toán thực tế (tăng trưởng dân số, gửi tiết kiệm hàng tháng, xếp gạch hình tháp, quả bóng nảy lên sau mỗi lần chạm đất) thực chất là mô hình Cấp số cộng hoặc Cấp số nhân ẩn dưới lời văn thực tế.',
      formulaSection: {
        primaryFormula: 'P_n = P_0(1 + r)^n \\quad (\\text{CSN với } q = 1 + r)',
        secondaryFormulas: [
          '\\text{Gửi đều } A \\text{ đồng đầu mỗi tháng lãi } r: \\ T_n = A(1+r)\\frac{(1+r)^n - 1}{r}',
          '\\text{Quả bóng nảy cao } qh \\text{ mỗi lần chạm đất: } S = h_0 + 2\\frac{q h_0}{1 - q}'
        ],
        variablesNote:
          '• **Cẩn thận bài toán quả bóng nảy**: Lần rơi đầu tiên chỉ đi xuống 1 lượt ($h_0$), từ lần nảy thứ 2 trở đi bóng đi **LÊN rồi XUỐNG** cùng độ cao nên tổng quãng đường phải nhân $2$ cho chuỗi lùi vô hạn!\n• Khi đọc đề bài "ba số vừa tạo thành CSC, thêm/bớt tạo CSN", đặt hệ $2b = a+c$ và $(b\')^2 = a\'c\'$.'
      },
      deepDiveSection:
        'Với bài toán gửi tiết kiệm đều đặn $A$ đồng vào đầu mỗi tháng với lãi suất $r\\%$/tháng: số tiền gửi tháng đầu tiên sinh lãi $n$ tháng thành $A(1+r)^n$, tháng thứ 2 sinh lãi $(n-1)$ tháng,..., tháng cuối sinh lãi $1$ tháng thành $A(1+r)$. Đây chính là tổng của $n$ số hạng của một CSN với $u_1 = A(1+r)$ và $q = 1+r$!',
      teacherExplanation: 'Nhận diện bài toán thực tế theo quy luật tăng: cộng thêm một lượng đều đặn mỗi bước $\\to$ CSC; nhân thêm tỉ lệ phần trăm $(1+r)$ $\\to$ CSN.',
      keyTakeaway: 'Gửi góp đều hàng tháng tạo thành tổng CSN $S_n = u_1 \\frac{q^n - 1}{q - 1}$ với $q = 1 + r$.',
      miniQuiz: [
        {
          id: 'm113-s3-q1',
          question: 'Ba số $a, b, c$ theo thứ tự lập thành CSC có tổng bằng $15$. Giá trị của số ở giữa $b$ bằng:',
          options: ['A. $5$', 'B. $3$', 'C. $7{,}5$', 'D. $10$'],
          correctIndex: 0,
          explanation: 'Vì $a + c = 2b$ nên $a + b + c = 3b = 15 \\implies b = 5$.'
        },
        {
          id: 'm113-s3-q2',
          question: 'Một người thợ xây xếp gạch thành hàng: hàng dưới cùng có $30$ viên, mỗi hàng trên ít hơn hàng dưới $2$ viên, hàng trên cùng có $4$ viên. Tổng số hàng gạch và tổng số viên gạch lần lượt là:',
          options: ['A. $14$ hàng, $238$ viên', 'B. $13$ hàng, $221$ viên', 'C. $14$ hàng, $210$ viên', 'D. $15$ hàng, $255$ viên'],
          correctIndex: 0,
          explanation: 'CSC có $u_1 = 30, d = -2, u_n = 4 \\implies 4 = 30 - 2(n-1) \\implies n = 14$ hàng. Tổng $S_{14} = \\frac{14(30 + 4)}{2} = 238$ viên.'
        }
      ],
      miniEssay: {
        id: 'm113-s3-e1',
        question: 'Thả một quả bóng cao su từ độ cao $12\\text{ m}$ xuống đất. Sau mỗi lần chạm đất, quả bóng nảy lên độ cao bằng $\\frac{1}{3}$ độ cao vừa rơi xuống. Tính tổng quãng đường quả bóng đi được cho đến khi dừng hẳn.',
        hint: 'Quãng đường = $12 + 2\\left(4 + \\frac{4}{3} + \\frac{4}{9} + \\dots\\right)$, trong ngoặc là CSN lùi vô hạn với $u_1 = 4, q = \\frac{1}{3}$.',
        rubricChecklist: [
          'Tách đúng lượt rơi đầu $12\\text{ m}$ và tổng các lượt nảy lên - rơi xuống: $12 + 2S$.',
          'Tính tổng CSN lùi vô hạn: $S = \\frac{4}{1 - 1/3} = 6\\text{ m}$.',
          'Tính tổng quãng đường $12 + 2\\cdot 6 = 24\\text{ m}$.'
        ],
        sampleAnswer:
          'Lượt rơi đầu tiên quả bóng đi được $12\\text{ m}$. Lần nảy thứ nhất bóng lên cao $12 \\cdot \\frac{1}{3} = 4\\text{ m}$ rồi lại rơi xuống $4\\text{ m}$, các lần sau tạo thành hai dãy lên-xuống giống hệt nhau với $u_1 = 4$, công bội $q = \\frac{1}{3}$. Tổng của một dãy CSN lùi vô hạn là $S = \\frac{4}{1 - 1/3} = 6\\text{ m}$. Vậy tổng quãng đường quả bóng đi được là $12 + 2 \\cdot 6 = 24\\text{ m}$.'
      }
    }
  ],
  'math-11-4': [
    {
      stepTitle: '1. Đường thẳng Vuông góc Mặt phẳng & Hai Mặt phẳng Vuông góc',
      stepType: 'concept',
      conceptSection:
        'Trong hình học không gian lớp 11, muốn chứng minh đường thẳng $d$ vuông góc với mặt phẳng $(P)$, ta chỉ cần chứng minh $d$ vuông góc với **hai đường thẳng cắt nhau** nằm trong $(P)$. Từ đó suy ra $d$ vuông góc với MỌI đường thẳng nằm trong $(P)$.',
      formulaSection: {
        primaryFormula: '\\begin{cases} d \\perp a,\\ d \\perp b \\\\ a, b \\subset (P),\\ a \\cap b = I \\end{cases} \\implies d \\perp (P)',
        secondaryFormulas: [
          '\\text{Định lý Ba đường vuông góc: } a \\perp b\' \\iff a \\perp b \\ (b\' \\text{ là hình chiếu của } b \\text{ lên } (P))',
          '\\begin{cases} (P) \\perp (Q) \\\\ (P) \\cap (Q) = \\Delta \\\\ d \\subset (P),\\ d \\perp \\Delta \\end{cases} \\implies d \\perp (Q)'
        ],
        variablesNote:
          '• **Mẫu chóp vuông góc đáy kinh điển ($SA \\perp (ABCD)$)**:\n  - Hình vuông/chữ nhật: $BC \\perp AB$ và $BC \\perp SA \\implies BC \\perp (SAB) \\implies BC \\perp SB$ (và $CD \\perp (SAD)$).\n  - Đáy hình vuông/thoi: $BD \\perp AC$ và $BD \\perp SA \\implies BD \\perp (SAC)$!'
      },
      deepDiveSection:
        'Kỹ thuật xác định **chân đường cao** khi hai mặt phẳng $(SAB)$ và $(ABC)$ vuông góc với nhau: chỉ cần kẻ $SH \\perp AB$ trong $(SAB)$ thì ngay lập tức $SH \\perp (ABC)$! Nếu $\\triangle SAB$ đều hoặc cân tại $S$, chân đường cao $H$ chính là trung điểm $AB$.',
      teacherExplanation: 'Hễ thấy $SA \\perp$ đáy và đáy có đường vuông góc sẵn (như hình vuông/thoi/tam giác vuông), gom ngay $2$ đường vuông góc để tạo mặt phẳng vuông góc!',
      keyTakeaway: 'Muốn chứng minh $d \\perp m$, hãy nhét $m$ vào một mặt phẳng $(P)$ và chứng minh $d \\perp (P)$ qua $2$ đường cắt nhau.',
      miniQuiz: [
        {
          id: 'm114-s1-q1',
          question: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông và $SA \\perp (ABCD)$. Đường thẳng $BD$ vuông góc với mặt phẳng nào sau đây?',
          options: ['A. $(SAC)$', 'B. $(SAB)$', 'C. $(SAD)$', 'D. $(SBC)$'],
          correctIndex: 0,
          explanation: 'Vì $BD \\perp AC$ (hai đường chéo hình vuông) và $BD \\perp SA$ (do $SA \\perp$ đáy) nên $BD \\perp (SAC)$.'
        },
        {
          id: 'm114-s1-q2',
          question: 'Hình chóp $S.ABC$ có $(SAB) \\perp (ABC)$ và $\\triangle SAB$ đều. Gọi $H$ là trung điểm $AB$. Khẳng định nào ĐÚNG?',
          options: ['A. $SH \\perp (ABC)$', 'B. $SA \\perp (ABC)$', 'C. $SH \\perp (SBC)$', 'D. $SC \\perp AB$'],
          correctIndex: 0,
          explanation: 'Vì $\\triangle SAB$ đều nên $SH \\perp AB$ (giao tuyến 2 mặt phẳng vuông góc), suy ra $SH \\perp (ABC)$.'
        }
      ],
      miniEssay: {
        id: 'm114-s1-e1',
        question: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình chữ nhật, $SA \\perp (ABCD)$. Kẻ $AH \\perp SB$ ($H \\in SB$). Chứng minh $AH \\perp (SBC)$ và $AH \\perp SC$.',
        hint: 'Chứng minh $BC \\perp (SAB)$ trước để suy ra $BC \\perp AH$, kết hợp với $AH \\perp SB$.',
        rubricChecklist: [
          'Chứng minh $BC \\perp AB$ và $BC \\perp SA \\implies BC \\perp (SAB) \\implies BC \\perp AH$.',
          'Kết hợp $AH \\perp SB$ và $AH \\perp BC$ ($SB, BC \\subset (SBC)$ cắt nhau) suy ra $AH \\perp (SBC)$.',
          'Từ $AH \\perp (SBC)$ và $SC \\subset (SBC)$ kết luận $AH \\perp SC$.'
        ],
        sampleAnswer:
          'Ta có $BC \\perp AB$ (do $ABCD$ là hình chữ nhật) và $BC \\perp SA$ (do $SA \\perp (ABCD)$). Vì $AB$ và $SA$ cắt nhau trong $(SAB)$ nên $BC \\perp (SAB)$, suy ra $BC \\perp AH$. Kết hợp với $AH \\perp SB$ (gt) và $SB \\cap BC = B$ trong $(SBC)$, suy ra $AH \\perp (SBC)$. Mà $SC \\subset (SBC)$ nên $AH \\perp SC$.'
      }
    },
    {
      stepTitle: '2. Xác định Góc (Đường – Mặt, Hai Mặt phẳng, Góc Nhị diện)',
      stepType: 'derivation',
      conceptSection:
        'Trong không gian, mọi bài toán góc đều quy về việc dựng đúng **góc phẳng đại diện** rồi dùng $\\sin, \\cos, \\tan$ trong tam giác vuông để tính.',
      formulaSection: {
        primaryFormula: '\\widehat{(d, (P))} = \\widehat{(d, d\')}, \\qquad \\text{với } d\' \\text{ là hình chiếu của } d \\text{ trên } (P)',
        secondaryFormulas: [
          '\\text{Góc nhị diện } [P, \\Delta, Q]: \\ a \\subset (P),\\ b \\subset (Q) \\text{ cùng } \\perp \\Delta \\text{ tại } I \\implies \\widehat{(a, b)}',
          '\\text{Công thức 3 nét dựng góc mặt bên } (SBC) \\text{ với đáy: } A \\xrightarrow{\\perp} BC \\text{ tại } M \\implies \\widehat{SMA}'
        ],
        variablesNote:
          '• **Quy tắc 3 bước tìm góc giữa $SC$ và đáy $(ABCD)$** (khi biết $SA \\perp$ đáy): Giao điểm là $C$, từ $S$ hạ vuông góc xuống đáy được chân $A$, nối $C$ với $A$ $\\implies$ góc cần tìm là $\\widehat{SCA}$!\n• **Quy tắc 3 nét tìm góc giữa mặt bên $(SBC)$ và đáy** (với $SA \\perp$ đáy): Từ chân $A$ kẻ $AM \\perp BC$, nối $SM$ $\\implies$ góc nhị diện là $\\widehat{SMA}$ (nằm ở $\\triangle SAM$ vuông tại $A$).'
      },
      deepDiveSection:
        'Lưu ý sự khác biệt giữa **góc giữa hai mặt phẳng** (luôn $\\le 90^\\circ$, là góc nhọn hoặc vuông) với **góc phẳng nhị diện $[P, \\Delta, Q]$** trong CT mới GDPT 2018 (có thể là góc nhọn, vuông HOẶC góc tù $0^\\circ < \\alpha < 180^\\circ$ tùy thuộc hai nửa mặt phẳng hợp với nhau thế nào!).',
      teacherExplanation: 'Nhớ mẹo "từ chân đường cao $A$ kẻ vuông góc ra giao tuyến $BC$" để dựng ngay góc giữa mặt bên và đáy!',
      keyTakeaway: 'Dựng góc đường–mặt: tìm giao điểm + hạ hình chiếu từ đỉnh. Dựng góc mặt–mặt: từ chân đường cao kẻ vuông góc tới giao tuyến.',
      miniQuiz: [
        {
          id: 'm114-s2-q1',
          question: 'Cho hình chóp $S.ABC$ có $SA \\perp (ABC)$, $SA = a\\sqrt{3}$, đáy $ABC$ vuông tại $B$ với $AB = a, BC = a\\sqrt{2}$. Góc giữa cạnh bên $SC$ và mặt đáy $(ABC)$ bằng:',
          options: ['A. $45^\\circ$', 'B. $60^\\circ$', 'C. $30^\\circ$', 'D. $90^\\circ$'],
          correctIndex: 0,
          explanation: '$AC = \\sqrt{a^2 + 2a^2} = a\\sqrt{3}$. Hình chiếu $SC$ trên đáy là $AC$, nên góc là $\\widehat{SCA}$ với $\\tan\\widehat{SCA} = \\frac{SA}{AC} = \\frac{a\\sqrt{3}}{a\\sqrt{3}} = 1 \\implies 45^\\circ$.'
        },
        {
          id: 'm114-s2-q2',
          question: 'Cho hình chóp tứ giác đều $S.ABCD$ có tất cả các cạnh bằng $a$. Gọi $\\varphi$ là góc giữa mặt bên $(SBC)$ và mặt đáy $(ABCD)$. Giá trị $\\cos\\varphi$ bằng:',
          options: ['A. $\\frac{1}{\\sqrt{3}}$', 'B. $\\frac{1}{2}$', 'C. $\\frac{\\sqrt{2}}{2}$', 'D. $\\frac{2}{3}$'],
          correctIndex: 0,
          explanation: 'Gọi $O$ là tâm đáy, $M$ là trung điểm $BC$. $OM = a/2$, $SM = \\frac{a\\sqrt{3}}{2}$. Vậy $\\cos\\varphi = \\frac{OM}{SM} = \\frac{1}{\\sqrt{3}}$.'
        }
      ],
      miniEssay: {
        id: 'm114-s2-e1',
        question: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, $SA \\perp (ABCD)$ và $SA = a$. Tính góc giữa mặt phẳng $(SBD)$ và mặt phẳng đáy $(ABCD)$.',
        hint: 'Giao tuyến là $BD$. Trong đáy có $AO \\perp BD$ tại tâm $O$, nối $SO$ để chỉ ra góc $\\widehat{SOA}$.',
        rubricChecklist: [
          'Chỉ ra giao tuyến $(SBD) \\cap (ABCD) = BD$.',
          'Chứng minh $AO \\perp BD$ và $SO \\perp BD$ $\\implies$ góc cần tìm là $\\widehat{SOA}$.',
          'Tính $AO = \\frac{a\\sqrt{2}}{2}$, $\\tan\\widehat{SOA} = \\frac{SA}{AO} = \\sqrt{2}$ (nên $\\widehat{SOA} = \\arctan\\sqrt{2}$).'
        ],
        sampleAnswer:
          'Gọi $O = AC \\cap BD$. Giao tuyến của $(SBD)$ và $(ABCD)$ là $BD$. Ta có $AO \\perp BD$ (tính chất hình vuông) và $SA \\perp BD \\implies BD \\perp (SAC) \\implies SO \\perp BD$. Do đó góc giữa $(SBD)$ và $(ABCD)$ là $\\widehat{SOA}$. Trong $\\triangle SAO$ vuông tại $A$: $AO = \\frac{AC}{2} = \\frac{a\\sqrt{2}}{2}$, nên $\\tan\\widehat{SOA} = \\frac{SA}{AO} = \\frac{a}{a\\sqrt{2}/2} = \\sqrt{2} \\implies \\widehat{SOA} = \\arctan\\sqrt{2}$.'
      }
    },
    {
      stepTitle: '3. Khoảng cách từ Điểm đến Mặt phẳng & Khoảng cách Hai Đường chéo nhau',
      stepType: 'example',
      conceptSection:
        'Khi tính khoảng cách từ một điểm $M$ bất kỳ tới mặt phẳng $(P)$, ta KHÔNG dựng trực tiếp từ $M$ nếu khó mà **quy đổi về khoảng cách từ chân đường cao $A$** theo tỉ lệ đoạn thẳng. Khoảng cách hai đường chéo nhau quy về khoảng cách từ đường này tới mặt phẳng song song chứa đường kia.',
      formulaSection: {
        primaryFormula: '\\text{Công thức 3 nét tính } d(A, (SBC)): \\ A \\xrightarrow{\\perp} BC \\text{ tại } M \\to A \\xrightarrow{\\perp} SM \\text{ tại } H \\implies d = AH',
        secondaryFormulas: [
          '\\frac{1}{AH^2} = \\frac{1}{SA^2} + \\frac{1}{AM^2}',
          '\\text{Quy đổi điểm: } AM \\cap (P) = I \\implies \\frac{d(M, (P))}{d(A, (P))} = \\frac{IM}{IA}'
        ],
        variablesNote:
          '• **Bộ 3 bước chuẩn cho $d(A, (SBC))$** khi $SA \\perp$ đáy:\n  (1) Từ $A$ kẻ $AM \\perp BC$ (nếu $ABC$ vuông ở $B$ thì $M \\equiv B$ luôn!).\n  (2) Nối $SM$, từ $A$ kẻ $AH \\perp SM$.\n  (3) Tính $\\frac{1}{AH^2} = \\frac{1}{SA^2} + \\frac{1}{AM^2}$.\n• Nếu hai đường $AB \\parallel (P)$ thì $d(B, (P)) = d(A, (P))$ (dời điểm song song cực nhanh!).'
      },
      deepDiveSection:
        'Nếu bài toán hỏi khoảng cách $d(a, b)$ giữa hai đường thẳng chéo nhau (ví dụ $d(SA, BC)$ hay $d(SB, AC)$): kiểm tra xem có mặt phẳng chứa $b$ và song song $a$ không, rồi lấy $d(a, b) = d(A, (P))$ với $A \\in a$. Trường hợp hai đường vuông góc nhau, dựng luôn đoạn vuông góc chung trong mặt phẳng vuông góc.',
      teacherExplanation: 'Mọi bài khoảng cách phức tạp đều giải qua 2 chiêu: "Dời điểm về chân đường cao $A$" và "3 nét $A \\to M \\to H$"!',
      keyTakeaway: 'Quy đổi khoảng cách về chân đường cao $A$ rồi dùng $\\frac{1}{d^2} = \\frac{1}{h^2} + \\frac{1}{AM^2}$.',
      miniQuiz: [
        {
          id: 'm114-s3-q1',
          question: 'Cho hình chóp $S.ABC$ có $SA \\perp (ABC)$, $SA = 3$, đáy $ABC$ vuông tại $B$ với $AB = 4, BC = 5$. Khoảng cách từ $A$ đến mặt phẳng $(SBC)$ bằng:',
          options: ['A. $2{,}4$', 'B. $3$', 'C. $2$', 'D. $\\frac{12}{\\sqrt{34}}$'],
          correctIndex: 0,
          explanation: 'Vì $BC \\perp AB$ sẵn nên $M \\equiv B$, $AM = AB = 4$. Khi đó $d(A, (SBC)) = \\frac{SA \\cdot AB}{\\sqrt{SA^2 + AB^2}} = \\frac{3 \\cdot 4}{5} = 2{,}4$.'
        },
        {
          id: 'm114-s3-q2',
          question: 'Cho hình chóp $S.ABCD$ có đáy là hình vuông cạnh $a$, $SA \\perp (ABCD)$ và $SA = a$. Khoảng cách từ $B$ đến mặt phẳng $(SCD)$ bằng:',
          options: ['A. $\\frac{a\\sqrt{2}}{2}$', 'B. $a$', 'C. $\\frac{a\\sqrt{3}}{3}$', 'D. $\\frac{a}{2}$'],
          correctIndex: 0,
          explanation: 'Vì $AB \\parallel CD \\implies AB \\parallel (SCD) \\implies d(B, (SCD)) = d(A, (SCD))$. Vì $CD \\perp AD$ nên $d(A, (SCD)) = \\frac{SA \\cdot AD}{\\sqrt{SA^2 + AD^2}} = \\frac{a^2}{a\\sqrt{2}} = \\frac{a\\sqrt{2}}{2}$.'
        }
      ],
      miniEssay: {
        id: 'm114-s3-e1',
        question: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, $SA \\perp (ABCD)$ và $SA = a$. Tính khoảng cách từ tâm $O$ của đáy đến mặt phẳng $(SBC)$.',
        hint: 'Dùng tỉ lệ đoạn $AC$ cắt $(SBC)$ tại $C$: $d(O, (SBC)) = \\frac{1}{2}d(A, (SBC))$.',
        rubricChecklist: [
          'Lập tỉ lệ $\\frac{d(O, (SBC))}{d(A, (SBC))} = \\frac{OC}{AC} = \\frac{1}{2}$.',
          'Tính đúng $d(A, (SBC)) = \\frac{SA \\cdot AB}{\\sqrt{SA^2 + AB^2}} = \\frac{a\\sqrt{2}}{2}$.',
          'Suy ra $d(O, (SBC)) = \\frac{a\\sqrt{2}}{4}$.'
        ],
        sampleAnswer:
          'Vì $O$ là trung điểm $AC$ và $AC \\cap (SBC) = C$ nên $d(O, (SBC)) = \\frac{OC}{AC}d(A, (SBC)) = \\frac{1}{2}d(A, (SBC))$. Do $BC \\perp AB$ và $BC \\perp SA$ nên $BC \\perp (SAB)$. Kẻ $AH \\perp SB \\implies AH \\perp (SBC) \\implies d(A, (SBC)) = AH = \\frac{SA \\cdot AB}{\\sqrt{SA^2 + AB^2}} = \\frac{a\\cdot a}{a\\sqrt{2}} = \\frac{a\\sqrt{2}}{2}$. Vậy $d(O, (SBC)) = \\frac{a\\sqrt{2}}{4}$.'
      }
    }
  ]
};
