import { LectureStep } from '../types';

export const MATH_CUSTOM_LECTURE_STEPS_9B: Record<string, LectureStep[]> = {
  'math-9-7': [
    {
      stepTitle: '1. Bảng Tần số Ghép nhóm & Tần số Tương đối Ghép nhóm (CT Mới)',
      stepType: 'concept',
      conceptSection:
        'Khi mẫu số liệu có kích thước lớn và trải rộng, ta chia thành các nhóm nửa khoảng $[a_i; a_{i+1})$ có cùng độ rộng. Số phần tử thuộc nhóm $i$ là tần số $m_i$, và tỉ số giữa $m_i$ với tổng số mẫu $N$ gọi là tần số tương đối ghép nhóm $f_i$.',
      formulaSection: {
        primaryFormula: 'f_i = \\frac{m_i}{N} \\cdot 100\\%, \\qquad \\sum_{i=1}^{k} m_i = N',
        secondaryFormulas: [
          '\\sum_{i=1}^{k} f_i = 100\\%',
          '\\text{Giá trị đại diện nhóm } [a_i; a_{i+1}): \\ c_i = \\frac{a_i + a_{i+1}}{2}'
        ],
        variablesNote:
          '• Nửa khoảng $[a; b)$ nghĩa là **lấy giá trị bằng $a$ nhưng KHÔNG lấy $b$** ($a \\le x < b$).\n• Nhóm cuối cùng đôi khi đóng cả hai đầu $[a_k; a_{k+1}]$ để chứa giá trị lớn nhất của mẫu.'
      },
      deepDiveSection:
        'Trong chương trình GDPT 2018 lớp 9, học sinh hay nhầm lẫn khi đếm một số liệu đúng bằng đầu mút (ví dụ $x = 10$ nằm giữa $[5; 10)$ và $[10; 15)$). Quy tắc chuẩn: số $10$ luôn thuộc nhóm bên phải $[10; 15)$ vì $10 \\notin [5; 10)$.',
      teacherExplanation: 'Đếm thật cẩn thận các giá trị nằm đúng ở biên giữa hai khoảng: ngoặc tròn không lấy, ngoặc vuông lấy.',
      keyTakeaway: 'Tần số tương đối $f_i = \\frac{m_i}{N}\\cdot 100\\%$, tổng các $f_i$ luôn bằng $100\\%$.',
      miniQuiz: [
        {
          id: 'm97-s1-q1',
          question: 'Khảo sát chiều cao của $40$ học sinh, nhóm $[155; 160)$ (cm) có $12$ bạn. Tần số tương đối của nhóm này là:',
          options: ['A. $30\\%$', 'B. $12\\%$', 'C. $40\\%$', 'D. $25\\%$'],
          correctIndex: 0,
          explanation: '$f = \\frac{12}{40} \\cdot 100\\% = 30\\%$.'
        },
        {
          id: 'm97-s1-q2',
          question: 'Giá trị $x = 160$ sẽ được xếp vào nhóm nào dưới đây?',
          options: ['A. $[160; 165)$', 'B. $[155; 160)$', 'C. Cả hai nhóm', 'D. Không thuộc nhóm nào'],
          correctIndex: 0,
          explanation: 'Vì ngoặc tròn $)$ tại $160$ không chứa $160$, còn ngoặc vuông $[$ tại $160$ chứa $160$, nên $160 \\in [160; 165)$.'
        }
      ],
      miniEssay: {
        id: 'm97-s1-e1',
        question: 'Cho bảng tần số ghép nhóm thời gian chạy 100m của 50 học sinh: $[12; 14)$ có $8$ bạn, $[14; 16)$ có $22$ bạn, $[16; 18)$ có $15$ bạn, $[18; 20]$ có $m_4$ bạn. Tìm $m_4$ và tính tần số tương đối của từng nhóm.',
        hint: 'Dùng $\\sum m_i = 50$ để tìm $m_4$, sau đó lấy từng $m_i$ chia cho $50$ nhân $100\\%$.',
        rubricChecklist: [
          'Tìm đúng $m_4 = 50 - (8 + 22 + 15) = 5$.',
          'Tính đúng 4 tần số tương đối: $16\\%$, $44\\%$, $30\\%$, $10\\%$.',
          'Kiểm tra tổng $16\\% + 44\\% + 30\\% + 10\\% = 100\\%$.'
        ],
        sampleAnswer:
          'Ta có $m_4 = 50 - (8 + 22 + 15) = 5$ (học sinh). Tần số tương đối của các nhóm lần lượt là: $f_1 = \\frac{8}{50}\\cdot 100\\% = 16\\%$; $f_2 = \\frac{22}{50}\\cdot 100\\% = 44\\%$; $f_3 = \\frac{15}{50}\\cdot 100\\% = 30\\%$; $f_4 = \\frac{5}{50}\\cdot 100\\% = 10\\%$.'
      }
    },
    {
      stepTitle: '2. Biểu đồ Tần số Ghép nhóm (Cột liền nhau) & Số Trung bình Ước lượng',
      stepType: 'derivation',
      conceptSection:
        'Biểu đồ tần số ghép nhóm dạng cột có đặc trưng là **các cột chữ nhật đứng liền kề nhau** không có khe hở (thể hiện tính liên tục của trục số liệu). Để ước lượng số trung bình cộng từ bảng ghép nhóm, ta dùng giá trị đại diện $c_i$ của mỗi nhóm.',
      formulaSection: {
        primaryFormula: '\\overline{x} = \\frac{m_1 c_1 + m_2 c_2 + \\dots + m_k c_k}{N} = \\sum_{i=1}^{k} f_i c_i',
        secondaryFormulas: [
          'c_i = \\frac{a_i + a_{i+1}}{2}',
          '\\text{Số đo góc quạt tròn (nếu vẽ biểu đồ quạt): } \\alpha_i = 360^\\circ \\cdot \\frac{f_i}{100\\%}'
        ],
        variablesNote:
          '• Khi $f_i$ viết dưới dạng số thập phân (ví dụ $0{,}30$ thay cho $30\\%$), chỉ cần nhân thẳng $\\sum f_i c_i$.\n• Luôn kiểm tra đơn vị của $\\overline{x}$ khớp với đơn vị trục hoành.'
      },
      deepDiveSection:
        'Chiều cao của mỗi cột trên biểu đồ bằng $m_i$ (nếu biểu diễn tần số) hoặc $f_i$ (nếu biểu diễn tần số tương đối), còn chiều rộng cột ứng với độ rộng khoảng $[a_i; a_{i+1})$. Nhờ biểu đồ ta nhận ra ngay nhóm có mật độ tập trung cao nhất.',
      teacherExplanation: 'Nhớ tính trung điểm $c_i$ của mỗi khoảng trước khi nhân với tần số để ước lượng số trung bình.',
      keyTakeaway: 'Các cột trong biểu đồ ghép nhóm vẽ sát liền nhau; số trung bình tính qua trung điểm nhóm $c_i$.',
      miniQuiz: [
        {
          id: 'm97-s2-q1',
          question: 'Ước lượng điểm trung bình từ bảng: $[5; 7)$ có $4$ bạn; $[7; 9)$ có $6$ bạn. Giá trị $\\overline{x}$ bằng:',
          options: ['A. $7{,}2$', 'B. $7{,}0$', 'C. $7{,}5$', 'D. $6{,}8$'],
          correctIndex: 0,
          explanation: 'Giá trị đại diện là $c_1 = 6$, $c_2 = 8$. $\\overline{x} = \\frac{4\\cdot 6 + 6\\cdot 8}{10} = \\frac{72}{10} = 7{,}2$.'
        },
        {
          id: 'm97-s2-q2',
          question: 'Trên biểu đồ hình quạt tròn, một nhóm có tần số tương đối $25\\%$ sẽ ứng với hình quạt có số đo góc ở tâm là:',
          options: ['A. $90^\\circ$', 'B. $75^\\circ$', 'C. $100^\\circ$', 'D. $45^\\circ$'],
          correctIndex: 0,
          explanation: '$\\alpha = 25\\% \\cdot 360^\\circ = 90^\\circ$.'
        }
      ],
      miniEssay: {
        id: 'm97-s2-e1',
        question: 'Tính số trung bình cộng ước lượng của mẫu số liệu về thời gian tự học mỗi tối: $[30; 60)$ phút: 5 bạn; $[60; 90)$ phút: 10 bạn; $[90; 120]$ phút: 5 bạn.',
        hint: 'Tìm 3 giá trị đại diện $45, 75, 105$, tính tổng $m_i c_i$ rồi chia cho tổng số $20$ bạn.',
        rubricChecklist: [
          'Tính đúng 3 giá trị đại diện: $45, 75, 105$.',
          'Tính đúng tổng $5\\cdot 45 + 10\\cdot 75 + 5\\cdot 105 = 1500$.',
          'Chia cho $N = 20$ ra $\\overline{x} = 75$ (phút).'
        ],
        sampleAnswer:
          'Các giá trị đại diện lần lượt là $c_1 = 45, c_2 = 75, c_3 = 105$. Tổng số học sinh $N = 5 + 10 + 5 = 20$. Thời gian tự học trung bình ước lượng là $\\overline{x} = \\frac{5\\cdot 45 + 10\\cdot 75 + 5\\cdot 105}{20} = \\frac{225 + 750 + 525}{20} = \\frac{1500}{20} = 75$ (phút).'
      }
    },
    {
      stepTitle: '3. Phép thử Ngẫu nhiên, Không gian Mẫu $\\Omega$ & Xác suất của Biến cố',
      stepType: 'example',
      conceptSection:
        'Phép thử ngẫu nhiên là phép thử mà ta không đoán trước được kết quả cụ thể, nhưng liệt kê được toàn bộ tập hợp các kết quả có thể xảy ra — gọi là không gian mẫu $\\Omega$. Khi các kết quả là đồng khả năng, xác suất của biến cố $A$ bằng tỉ số số kết quả thuận lợi trên tổng số kết quả.',
      formulaSection: {
        primaryFormula: 'P(A) = \\frac{n(A)}{n(\\Omega)}, \\qquad 0 \\le P(A) \\le 1',
        secondaryFormulas: [
          '\\text{Gieo } k \\text{ lần đồng xu: } n(\\Omega) = 2^k',
          '\\text{Gieo } 2 \\text{ con xúc xắc: } n(\\Omega) = 6 \\times 6 = 36'
        ],
        variablesNote:
          '• **Phân biệt**: Không gian mẫu gieo 2 con xúc xắc $(1; 2)$ và $(2; 1)$ là **2 kết quả khác nhau** nếu hai con phân biệt hoặc gieo 2 lần liên tiếp!\n• Với bài bốc thăm/rút thẻ có hoàn lại hoặc không hoàn lại, vẽ sơ đồ hình cây hoặc liệt kê cặp có thứ tự/không thứ tự thật nhất quán.'
      },
      deepDiveSection:
        'Nếu bài toán hỏi "tính xác suất để có ít nhất một mặt ngửa / tổng chia hết cho 3", hãy liệt kê cẩn thận theo hàng (kết quả 1) và cột (kết quả 2), hoặc dùng biến cố đối: $P(A) = 1 - P(\\overline{A})$ khi trường hợp đối dễ đếm hơn.',
      teacherExplanation: 'Liệt kê không gian mẫu $\\Omega$ thật hệ thống theo bảng hoặc sơ đồ cây để không sót bất kỳ trường hợp nào.',
      keyTakeaway: 'Xác suất đồng khả năng $P(A) = \\frac{n(A)}{n(\\Omega)}$ luôn nằm trong đoạn $[0; 1]$.',
      miniQuiz: [
        {
          id: 'm97-s3-q1',
          question: 'Gieo một con xúc xắc cân đối đồng chất $2$ lần liên tiếp. Số phần tử của không gian mẫu $n(\\Omega)$ bằng:',
          options: ['A. $36$', 'B. $12$', 'C. $21$', 'D. $6$'],
          correctIndex: 0,
          explanation: 'Mỗi lần gieo có $6$ kết quả, hai lần liên tiếp tạo thành $6 \\times 6 = 36$ cặp kết quả có thứ tự.'
        },
        {
          id: 'm97-s3-q2',
          question: 'Một hộp có $3$ thẻ ghi số $1, 2, 3$. Rút ngẫu nhiên $1$ thẻ rồi bỏ lại, sau đó rút tiếp $1$ thẻ. Xác suất để tổng hai số ghi trên $2$ thẻ là số lẻ bằng:',
          options: ['A. $\\frac{4}{9}$', 'B. $\\frac{1}{2}$', 'C. $\\frac{5}{9}$', 'D. $\\frac{1}{3}$'],
          correctIndex: 0,
          explanation: 'Không gian mẫu $n(\\Omega) = 3 \\times 3 = 9$. Tổng lẻ khi gồm 1 chẵn (số 2) và 1 lẻ (1 hoặc 3): các cặp $(2,1), (2,3), (1,2), (3,2)$ — có $4$ cặp. Vậy $P = \\frac{4}{9}$.'
        }
      ],
      miniEssay: {
        id: 'm97-s3-e1',
        question: 'Gieo đồng thời $2$ đồng xu cân đối đồng chất (mỗi đồng xu có 2 mặt Sấp $S$ và Ngửa $N$). Mô tả không gian mẫu $\\Omega$ và tính xác suất để có ít nhất một đồng xu xuất hiện mặt Ngửa.',
        hint: 'Liệt kê $\\Omega = \\{SS, SN, NS, NN\\}$, đếm số trường hợp có ít nhất một chữ $N$.',
        rubricChecklist: [
          'Liệt kê đủ 4 kết quả đồng khả năng: $n(\\Omega) = 4$.',
          'Chỉ ra biến cố thuận lợi $A = \\{SN, NS, NN\\}$ có $n(A) = 3$.',
          'Tính đúng $P(A) = \\frac{3}{4}$.'
        ],
        sampleAnswer:
          'Không gian mẫu gồm 4 kết quả đồng khả năng: $\\Omega = \\{SS; SN; NS; NN\\}$, nên $n(\\Omega) = 4$. Biến cố $A$ ("có ít nhất 1 mặt Ngửa") gồm 3 kết quả: $A = \\{SN; NS; NN\\} \\implies n(A) = 3$. Vậy xác suất của biến cố $A$ là $P(A) = \\frac{3}{4}$.'
      }
    }
  ],
  'math-9-8': [
    {
      stepTitle: '1. Hình Trụ: Diện tích Xung quanh, Diện tích Toàn phần & Thể tích',
      stepType: 'concept',
      conceptSection:
        'Khi quay hình chữ nhật $ABCD$ một vòng quanh cạnh cố định $AB$, ta thu được hình trụ với bán kính đáy $R = AD$ và chiều cao $h = AB$. Mặt xung quanh khi trải phẳng ra chính là một hình chữ nhật có chiều dài bằng chu vi đáy $2\\pi R$ và chiều rộng là $h$.',
      formulaSection: {
        primaryFormula: 'S_{xq} = 2\\pi R h, \\qquad V = \\pi R^2 h',
        secondaryFormulas: [
          'S_{tp} = S_{xq} + 2 S_{\\text{đáy}} = 2\\pi R h + 2\\pi R^2 = 2\\pi R(h + R)',
          'C_{\\text{đáy}} = 2\\pi R'
        ],
        variablesNote:
          '• Phân biệt bán kính $R$ và đường kính $d = 2R$: đề cho đường kính nhớ chia đôi ngay!\n• Hình trụ không nắp (như cốc nước, thùng sơn mở) khi tính diện tích vật liệu chỉ cộng **1 đáy**: $S = 2\\pi R h + \\pi R^2$.'
      },
      deepDiveSection:
        'Một bài toán thực tế rất hay ra trong đề vào 10: biết diện tích xung quanh $S_{xq}$ hoặc thể tích của lon sữa / bồn nước trụ và bán kính đáy, yêu cầu tính lượng nước dâng lên khi thả chìm một viên bi cầu vào trong bình trụ.',
      teacherExplanation: 'Trải phẳng mặt xung quanh hình trụ thành hình chữ nhật $2\\pi R \\times h$ giúp nhớ ngay công thức $S_{xq} = 2\\pi R h$.',
      keyTakeaway: '$S_{xq} = 2\\pi Rh$, $V = \\pi R^2 h$; luôn kiểm tra xem vật có nắp hay không nắp.',
      miniQuiz: [
        {
          id: 'm98-s1-q1',
          question: 'Một hình trụ có bán kính đáy $R = 3\\text{ cm}$ và chiều cao $h = 5\\text{ cm}$. Thể tích khối trụ bằng:',
          options: ['A. $45\\pi\\text{ cm}^3$', 'B. $15\\pi\\text{ cm}^3$', 'C. $30\\pi\\text{ cm}^3$', 'D. $75\\pi\\text{ cm}^3$'],
          correctIndex: 0,
          explanation: '$V = \\pi R^2 h = \\pi \\cdot 3^2 \\cdot 5 = 45\\pi\\text{ cm}^3$.'
        },
        {
          id: 'm98-s1-q2',
          question: 'Làm một chiếc hộp trụ **có hai nắp** bán kính đáy $2\\text{ cm}$, chiều cao $6\\text{ cm}$ cần diện tích giấy tối thiểu bằng:',
          options: ['A. $32\\pi\\text{ cm}^2$', 'B. $24\\pi\\text{ cm}^2$', 'C. $28\\pi\\text{ cm}^2$', 'D. $16\\pi\\text{ cm}^2$'],
          correctIndex: 0,
          explanation: '$S_{tp} = 2\\pi R(h + R) = 2\\pi \\cdot 2 \\cdot (6 + 2) = 32\\pi\\text{ cm}^2$.'
        }
      ],
      miniEssay: {
        id: 'm98-s1-e1',
        question: 'Một lon sữa hình trụ có đường kính đáy $10\\text{ cm}$ và chiều cao $12\\text{ cm}$. Tính diện tích nhãn giấy dán kín xung quanh thân lon (lấy $\\pi \\approx 3{,}14$).',
        hint: 'Từ đường kính $d = 10\\text{ cm}$ tính bán kính $R = 5\\text{ cm}$, rồi áp dụng $S_{xq} = 2\\pi R h$.',
        rubricChecklist: [
          'Tính đúng bán kính đáy $R = \\frac{10}{2} = 5\\text{ cm}$.',
          'Viết công thức $S_{xq} = 2\\pi R h = 120\\pi\\text{ cm}^2$.',
          'Thay $\\pi \\approx 3{,}14$ ra kết quả $376{,}8\\text{ cm}^2$.'
        ],
        sampleAnswer:
          'Bán kính đáy của lon sữa là $R = \\frac{10}{2} = 5\\text{ cm}$. Diện tích xung quanh (phần nhãn giấy) là $S_{xq} = 2\\pi R h = 2\\pi \\cdot 5 \\cdot 12 = 120\\pi \\approx 120 \\cdot 3{,}14 = 376{,}8\\text{ cm}^2$.'
      }
    },
    {
      stepTitle: '2. Hình Nón: Đường sinh $l$, Chiều cao $h$ & Hình quạt Trải phẳng',
      stepType: 'derivation',
      conceptSection:
        'Khi quay tam giác vuông $SOA$ (vuông tại $O$) quanh cạnh góc vuông $SO$, ta được hình nón có chiều cao $h = SO$, bán kính đáy $R = OA$ và đường sinh $l = SA$. Ba đại lượng này luôn lập thành một tam giác vuông!',
      formulaSection: {
        primaryFormula: 'l^2 = R^2 + h^2, \\qquad S_{xq} = \\pi R l',
        secondaryFormulas: [
          'V = \\frac{1}{3} \\pi R^2 h',
          'S_{tp} = \\pi R l + \\pi R^2 = \\pi R(l + R)'
        ],
        variablesNote:
          '• **Cực kỳ hay nhầm**: $S_{xq}$ hình nón dùng **đường sinh $l$**, còn $V$ hình nón dùng **chiều cao $h$** (nhớ nhân $\\frac{1}{3}$ so với hình trụ cùng đáy và chiều cao!).\n• Mặt xung quanh hình nón khi cắt theo 1 đường sinh sẽ trải thành hình quạt tròn bán kính $l$ và độ dài cung bằng $2\\pi R$.'
      },
      deepDiveSection:
        'Trong bài toán chế tạo nón lá hoặc mũ sinh nhật từ một tấm bìa hình quạt tròn có góc ở tâm $n^\\circ$ và bán kính $l$, bán kính đáy hình nón gập được tính theo: $2\\pi R = \\frac{\\pi l n}{180} \\implies R = \\frac{l \\cdot n}{360}$.',
      teacherExplanation: 'Luôn kiểm tra bằng Pytago $l^2 = R^2 + h^2$: thiếu $l$ hay thiếu $h$ đều tìm được ngay cạnh còn lại.',
      keyTakeaway: '$S_{xq} = \\pi R l$ (dùng đường sinh $l$), $V = \\frac{1}{3}\\pi R^2 h$ (dùng chiều cao $h$).',
      miniQuiz: [
        {
          id: 'm98-s2-q1',
          question: 'Hình nón có bán kính đáy $R = 6\\text{ cm}$, chiều cao $h = 8\\text{ cm}$. Diện tích xung quanh hình nón bằng:',
          options: ['A. $60\\pi\\text{ cm}^2$', 'B. $48\\pi\\text{ cm}^2$', 'C. $96\\pi\\text{ cm}^2$', 'D. $100\\pi\\text{ cm}^2$'],
          correctIndex: 0,
          explanation: 'Đường sinh $l = \\sqrt{R^2 + h^2} = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$. Vậy $S_{xq} = \\pi R l = \\pi \\cdot 6 \\cdot 10 = 60\\pi\\text{ cm}^2$.'
        },
        {
          id: 'm98-s2-q2',
          question: 'Thể tích khối nón có bán kính đáy $R = 3\\text{ cm}$, chiều cao $h = 7\\text{ cm}$ là:',
          options: ['A. $21\\pi\\text{ cm}^3$', 'B. $63\\pi\\text{ cm}^3$', 'C. $7\\pi\\text{ cm}^3$', 'D. $14\\pi\\text{ cm}^3$'],
          correctIndex: 0,
          explanation: '$V = \\frac{1}{3}\\pi R^2 h = \\frac{1}{3}\\pi \\cdot 9 \\cdot 7 = 21\\pi\\text{ cm}^3$.'
        }
      ],
      miniEssay: {
        id: 'm98-s2-e1',
        question: 'Một chiếc nón lá có đường kính vành nón $40\\text{ cm}$ và đường sinh dài $30\\text{ cm}$. Tính diện tích lá cần dùng để lợp xung quanh chiếc nón đó (lấy $\\pi \\approx 3{,}14$).',
        hint: 'Tính bán kính đáy $R = 20\\text{ cm}$, dùng trực tiếp $S_{xq} = \\pi R l$ (vì đề đã cho sẵn đường sinh $l = 30\\text{ cm}$).',
        rubricChecklist: [
          'Tính bán kính đáy $R = \\frac{40}{2} = 20\\text{ cm}$.',
          'Áp dụng đúng công thức $S_{xq} = \\pi R l = 600\\pi\\text{ cm}^2$.',
          'Tính giá trị xấp xỉ $1884\\text{ cm}^2$.'
        ],
        sampleAnswer:
          'Bán kính đáy hình nón là $R = \\frac{40}{2} = 20\\text{ cm}$. Diện tích lá cần dùng chính là diện tích xung quanh hình nón: $S_{xq} = \\pi R l = \\pi \\cdot 20 \\cdot 30 = 600\\pi \\approx 600 \\cdot 3{,}14 = 1884\\text{ cm}^2$.'
      }
    },
    {
      stepTitle: '3. Hình Cầu & Bài toán Ghép khối Thực tế (Bình Trụ + Bi Cầu / Nón + Bán Cầu)',
      stepType: 'example',
      conceptSection:
        'Hình cầu bán kính $R$ sinh ra khi quay nửa hình tròn quanh đường kính cố định của nó. Khi cắt mặt cầu bởi một mặt phẳng không đi qua tâm, giao tuyến là một đường tròn có bán kính $r < R$.',
      formulaSection: {
        primaryFormula: 'S_{\\text{cầu}} = 4\\pi R^2, \\qquad V_{\\text{cầu}} = \\frac{4}{3}\\pi R^3',
        secondaryFormulas: [
          '\\text{Bán cầu: } V = \\frac{2}{3}\\pi R^3, \\quad S_{xq\\text{ bán cầu}} = 2\\pi R^2',
          '\\text{Mực nước dâng trong bình trụ: } \\Delta h = \\frac{V_{\\text{vật chìm}}}{\\pi R_{\\text{trụ}}^2}'
        ],
        variablesNote:
          '• **Cẩn thận hệ số mũ**: Diện tích mặt cầu dùng $R^2$ (hệ số $4$), còn thể tích khối cầu dùng $R^3$ (hệ số $\\frac{4}{3}$).\n• Khi thả viên bi cầu chìm hoàn toàn vào bình trụ đựng nước, phần thể tích nước dâng lên đúng bằng thể tích viên bi cầu!'
      },
      deepDiveSection:
        'Trong bài toán cây kem ốc quế gồm 1 hình nón ở dưới và 1 bán cầu ở trên (hoặc viên thuốc con nhộng gồm 1 hình trụ ở giữa và 2 bán cầu ở 2 đầu), tổng thể tích bằng tổng thể tích các khối thành phần, nhưng **diện tích bề mặt ngoài không cộng phần mặt đáy tiếp xúc bên trong**!',
      teacherExplanation: 'Khi ghép hai khối hình học lại, nhớ bỏ mặt phẳng nối chung ở giữa khi tính diện tích bề mặt ngoài.',
      keyTakeaway: 'Thể tích vật thả chìm = Thể tích trụ phần nước dâng lên ($\\pi R_{\\text{trụ}}^2 \\cdot \\Delta h$).',
      miniQuiz: [
        {
          id: 'm98-s3-q1',
          question: 'Thể tích của một quả bóng hình cầu có bán kính $R = 3\\text{ cm}$ là:',
          options: ['A. $36\\pi\\text{ cm}^3$', 'B. $12\\pi\\text{ cm}^3$', 'C. $27\\pi\\text{ cm}^3$', 'D. $108\\pi\\text{ cm}^3$'],
          correctIndex: 0,
          explanation: '$V = \\frac{4}{3}\\pi R^3 = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi\\text{ cm}^3$.'
        },
        {
          id: 'm98-s3-q2',
          question: 'Thả chìm hoàn toàn một viên bi sắt hình cầu bán kính $2\\text{ cm}$ vào cốc nước hình trụ bán kính đáy $4\\text{ cm}$. Mực nước trong cốc dâng lên thêm bao nhiêu?',
          options: ['A. $\\frac{2}{3}\\text{ cm}$', 'B. $\\frac{4}{3}\\text{ cm}$', 'C. $1\\text{ cm}$', 'D. $\\frac{1}{3}\\text{ cm}$'],
          correctIndex: 0,
          explanation: '$V_{\\text{bi}} = \\frac{4}{3}\\pi \\cdot 2^3 = \\frac{32\\pi}{3}$. Đặt $\\pi \\cdot 4^2 \\cdot \\Delta h = \\frac{32\\pi}{3} \\implies \\Delta h = \\frac{32}{48} = \\frac{2}{3}\\text{ cm}$.'
        }
      ],
      miniEssay: {
        id: 'm98-s3-e1',
        question: 'Một chi tiết máy gồm một khối trụ có bán kính đáy $R = 3\\text{ cm}$, chiều cao $h = 8\\text{ cm}$ và một bán cầu cùng bán kính $R = 3\\text{ cm}$ gắn khít lên mặt trên. Tính tổng thể tích của chi tiết máy (theo $\\pi$).',
        hint: 'Cộng thể tích khối trụ $V_1 = \\pi R^2 h$ với thể tích bán cầu $V_2 = \\frac{1}{2}\\cdot\\frac{4}{3}\\pi R^3 = \\frac{2}{3}\\pi R^3$.',
        rubricChecklist: [
          'Tính đúng thể tích phần hình trụ $V_1 = \\pi \\cdot 3^2 \\cdot 8 = 72\\pi\\text{ cm}^3$.',
          'Tính đúng thể tích bán cầu $V_2 = \\frac{2}{3}\\pi \\cdot 3^3 = 18\\pi\\text{ cm}^3$.',
          'Cộng ra tổng thể tích $V = 90\\pi\\text{ cm}^3$.'
        ],
        sampleAnswer:
          'Thể tích phần hình trụ là $V_1 = \\pi R^2 h = \\pi \\cdot 3^2 \\cdot 8 = 72\\pi\\text{ cm}^3$. Thể tích phần bán cầu là $V_2 = \\frac{1}{2}\\cdot\\frac{4}{3}\\pi R^3 = \\frac{2}{3}\\pi \\cdot 27 = 18\\pi\\text{ cm}^3$. Vậy tổng thể tích chi tiết máy là $V = 72\\pi + 18\\pi = 90\\pi\\text{ cm}^3$.'
      }
    }
  ],
  'math-9-9': [
    {
      stepTitle: '1. Quan hệ Vuông góc giữa Đường kính & Dây cung',
      stepType: 'concept',
      conceptSection:
        'Trong một đường tròn $(O)$, đường kính là dây cung lớn nhất. Đường kính vuông góc với một dây thì đi qua trung điểm của dây ấy; ngược lại, đường kính đi qua trung điểm của một dây **không đi qua tâm** thì vuông góc với dây ấy.',
      formulaSection: {
        primaryFormula: 'OI \\perp AB \\iff IA = IB \\quad (AB \\text{ không qua } O)',
        secondaryFormulas: [
          'OI^2 + IA^2 = R^2 \\quad (\\text{Pytago trong } \\triangle OIA)',
          'AB \\le 2R \\quad (\\text{dấu } = \\text{ khi } AB \\text{ là đường kính})'
        ],
        variablesNote:
          '• **Cực kỳ lưu ý điều kiện đảo**: Nếu dây $AB$ đi qua tâm $O$ (tức là đường kính), đường kính khác đi qua trung điểm $O$ thì không nhất thiết vuông góc!\n• Tam giác $OAB$ luôn cân tại $O$ ($OA = OB = R$), nên đường cao $OI$ đồng thời là trung tuyến và phân giác.'
      },
      deepDiveSection:
        'Khi đề bài cho độ dài dây $AB$ và bán kính $R$, muốn tính khoảng cách $d = OI$ từ tâm tới dây, ta chỉ cần kẻ $OI \\perp AB$, lấy $IA = AB/2$ và áp dụng định lý Pytago $OI = \\sqrt{R^2 - (AB/2)^2}$.',
      teacherExplanation: 'Thấy tâm $O$ và dây cung $AB$, kẻ ngay đoạn vuông góc xuống trung điểm $I$ để tạo tam giác vuông Pytago $OIA$.',
      keyTakeaway: '$OI \\perp AB$ ($I$ thuộc $AB$) $\\implies I$ là trung điểm $AB$ và $R^2 = OI^2 + (AB/2)^2$.',
      miniQuiz: [
        {
          id: 'm99-s1-q1',
          question: 'Cho đường tròn $(O; 5\\text{ cm})$ và dây cung $AB = 8\\text{ cm}$. Khoảng cách từ tâm $O$ đến dây $AB$ bằng:',
          options: ['A. $3\\text{ cm}$', 'B. $4\\text{ cm}$', 'C. $2\\text{ cm}$', 'D. $\\sqrt{41}\\text{ cm}$'],
          correctIndex: 0,
          explanation: 'Kẻ $OI \\perp AB \\implies IA = 4\\text{ cm}$. Khi đó $OI = \\sqrt{5^2 - 4^2} = 3\\text{ cm}$.'
        },
        {
          id: 'm99-s1-q2',
          question: 'Trong đường tròn $(O)$, mệnh đề nào sau đây SAI?',
          options: [
            'A. Đường kính đi qua trung điểm của một dây bất kỳ thì vuông góc với dây đó',
            'B. Đường kính vuông góc với một dây thì đi qua trung điểm dây đó',
            'C. Hai dây bằng nhau thì cách đều tâm',
            'D. Dây nào lớn hơn thì dây đó gần tâm hơn'
          ],
          correctIndex: 0,
          explanation: 'Mệnh đề A thiếu điều kiện "dây đó KHÔNG đi qua tâm $O$"!'
        }
      ],
      miniEssay: {
        id: 'm99-s1-e1',
        question: 'Cho $(O; 10\\text{ cm})$ có hai dây song song $AB = 16\\text{ cm}$ và $CD = 12\\text{ cm}$ nằm cùng một phía đối với tâm $O$. Tính khoảng cách giữa hai dây $AB$ và $CD$.',
        hint: 'Kẻ đường thẳng qua $O$ vuông góc với $AB$ tại $H$ và cắt $CD$ tại $K$ ($OK \\perp CD$). Tính $OH, OK$, sau đó lấy hiệu $|OK - OH|$ vì hai dây nằm cùng phía.',
        rubricChecklist: [
          'Tính đúng $OH = \\sqrt{10^2 - 8^2} = 6\\text{ cm}$.',
          'Tính đúng $OK = \\sqrt{10^2 - 6^2} = 8\\text{ cm}$.',
          'Vì cùng phía nên khoảng cách bằng $HK = OK - OH = 8 - 6 = 2\\text{ cm}$.'
        ],
        sampleAnswer:
          'Kẻ đường kính vuông góc với $AB$ tại $H$ và $CD$ tại $K$. Vì $AB \\parallel CD$ nên $O, H, K$ thẳng hàng, $HA = 8\\text{ cm}$, $KC = 6\\text{ cm}$. Áp dụng Pytago: $OH = \\sqrt{10^2 - 8^2} = 6\\text{ cm}$, $OK = \\sqrt{10^2 - 6^2} = 8\\text{ cm}$. Vì hai dây nằm cùng phía so với tâm $O$ nên khoảng cách giữa chúng là $HK = OK - OH = 8 - 6 = 2\\text{ cm}$.'
      }
    },
    {
      stepTitle: '2. Liên hệ Dây cung & Khoảng cách đến Tâm · Vị trí Tương đối Đường thẳng và Đường tròn',
      stepType: 'derivation',
      conceptSection:
        'Trong một đường tròn, hai dây bằng nhau khi và chỉ khi chúng cách đều tâm; dây lớn hơn thì gần tâm hơn ($AB > CD \\iff d_{AB} < d_{CD}$). Tương tự, vị trí tương đối giữa đường thẳng $a$ và $(O; R)$ phụ thuộc vào khoảng cách $d$ từ $O$ tới $a$.',
      formulaSection: {
        primaryFormula: 'd < R: \\text{ cắt nhau (2 điểm)}; \\quad d = R: \\text{ tiếp xúc}; \\quad d > R: \\text{ không giao nhau}',
        secondaryFormulas: [
          'AB = CD \\iff d(O, AB) = d(O, CD)',
          'AB > CD \\iff d(O, AB) < d(O, CD)'
        ],
        variablesNote:
          '• Để chứng minh đường thẳng $a$ là tiếp tuyến của $(O; R)$: chỉ ra một điểm $H \\in a$ vừa thỏa $OH = R$ vừa thỏa $a \\perp OH$.\n• Dùng $R^2 = d^2 + (AB/2)^2$ để giải nhanh mối liên hệ dây lớn nhất / nhỏ nhất.'
      },
      deepDiveSection:
        'Một bài toán kinh điển về dây đi qua điểm cố định $M$ nằm bên trong $(O; R)$: dây dài nhất qua $M$ là đường kính đi qua $O$ và $M$ ($2R$); dây ngắn nhất qua $M$ là dây vuông góc với $OM$ tại $M$ (vì khi đó khoảng cách từ $O$ tới dây đạt cực đại bằng $OM$).',
      teacherExplanation: 'Nhớ quy luật ngược chiều: dây càng dài thì càng gần tâm, dây càng ngắn thì càng xa tâm.',
      keyTakeaway: 'Qua điểm $M$ trong $(O)$, dây ngắn nhất luôn vuông góc với $OM$ tại $M$.',
      miniQuiz: [
        {
          id: 'm99-s2-q1',
          question: 'Cho đường tròn $(O; 6\\text{ cm})$ và đường thẳng $d$ cách tâm $O$ một khoảng $OH = 6\\text{ cm}$. Số điểm chung của $d$ và $(O)$ là:',
          options: ['A. $1$ (tiếp xúc)', 'B. $2$ (cắt nhau)', 'C. $0$ (không giao nhau)', 'D. Vô số'],
          correctIndex: 0,
          explanation: 'Vì $OH = R = 6\\text{ cm}$ nên đường thẳng $d$ tiếp xúc với đường tròn tại đúng $1$ điểm $H$.'
        },
        {
          id: 'm99-s2-q2',
          question: 'Điểm $M$ nằm trong $(O; 5\\text{ cm})$ với $OM = 3\\text{ cm}$. Độ dài dây cung ngắn nhất đi qua $M$ bằng:',
          options: ['A. $8\\text{ cm}$', 'B. $4\\text{ cm}$', 'C. $10\\text{ cm}$', 'D. $6\\text{ cm}$'],
          correctIndex: 0,
          explanation: 'Dây ngắn nhất vuông góc với $OM$ tại $M$, có nửa dây là $\\sqrt{5^2 - 3^2} = 4\\text{ cm} \\implies$ độ dài dây bằng $8\\text{ cm}$.'
        }
      ],
      miniEssay: {
        id: 'm99-s2-e1',
        question: 'Cho hình thang vuông $ABCD$ ($\\widehat{A} = \\widehat{D} = 90^\\circ$) có $AB = 4\\text{ cm}$, $CD = 9\\text{ cm}$, $BC = 13\\text{ cm}$. Chứng minh rằng $AD$ tiếp xúc với đường tròn đường kính $BC$.',
        hint: 'Gọi $O$ là trung điểm $BC$ ($R = 6{,}5\\text{ cm}$). Kẻ $OH \\perp AD$, chỉ ra $OH$ là đường trung bình hình thang $ABCD$ và so sánh $OH$ với $R$.',
        rubricChecklist: [
          'Xác định tâm $O$ là trung điểm $BC$, bán kính $R = \\frac{13}{2} = 6{,}5\\text{ cm}$.',
          'Kẻ $OH \\perp AD \\implies OH \\parallel AB \\parallel CD$, nên $OH$ là đường trung bình hình thang $ABCD$.',
          'Tính $OH = \\frac{AB + CD}{2} = 6{,}5\\text{ cm} = R$ và kết luận $AD$ là tiếp tuyến.'
        ],
        sampleAnswer:
          'Gọi $O$ là trung điểm $BC$, đường tròn đường kính $BC$ có bán kính $R = \\frac{13}{2} = 6{,}5\\text{ cm}$. Kẻ $OH \\perp AD$ ($H \\in AD$). Vì $AB \\perp AD$ và $CD \\perp AD$ nên $AB \\parallel OH \\parallel CD$. Lại có $O$ là trung điểm $BC$ nên $OH$ là đường trung bình của hình thang $ABCD$: $OH = \\frac{AB + CD}{2} = \\frac{4 + 9}{2} = 6{,}5\\text{ cm} = R$. Vì $OH \\perp AD$ tại $H$ và $OH = R$, nên $AD$ tiếp xúc với đường tròn đường kính $BC$.'
      }
    },
    {
      stepTitle: '3. Vị trí Tương đối của Hai Đường tròn $(O; R)$ và $(O\'; r)$',
      stepType: 'example',
      conceptSection:
        'Giả sử $R \\ge r$ và khoảng cách hai tâm $d = OO\'$. Hai đường tròn có 5 vị trí tương đối phân định rành mạch bởi việc so sánh $d$ với tổng $(R + r)$ và hiệu $(R - r)$.',
      formulaSection: {
        primaryFormula: 'R - r < OO\' < R + r \\iff \\text{hai đường tròn cắt nhau}',
        secondaryFormulas: [
          'OO\' = R + r \\iff \\text{tiếp xúc ngoài}; \\quad OO\' = R - r \\iff \\text{tiếp xúc trong}',
          'OO\' > R + r \\iff \\text{ngoài nhau}; \\quad OO\' < R - r \\iff \\text{đựng nhau}'
        ],
        variablesNote:
          '• **Đường nối tâm $OO\'$** là trục đối xứng chung của hai đường tròn!\n• Khi hai đường tròn cắt nhau tại $A, B$ thì $OO\'$ là **đường trung trực** của dây chung $AB$ ($OO\' \\perp AB$ tại trung điểm $AB$).'
      },
      deepDiveSection:
        'Khi hai đường tròn tiếp xúc nhau tại $A$ (trong hoặc ngoài), ba điểm $O, O\', A$ luôn thẳng hàng. Nếu có thêm tiếp tuyến chung ngoài $BC$, góc tạo bởi hai bán kính tại tiếp điểm và $BC$ luôn cho hình thang vuông có thể tính ngay $BC = \\sqrt{OO\'^2 - (R - r)^2} = 2\\sqrt{Rr}$ khi chúng tiếp xúc ngoài!',
      teacherExplanation: 'Hai đường tròn tiếp xúc ngoài bán kính $R, r$: độ dài đoạn tiếp tuyến chung ngoài luôn đúng bằng $2\\sqrt{Rr}$.',
      keyTakeaway: 'Nếu $(O)$ và $(O\')$ cắt nhau tại $A, B$ thì $OO\'$ vuông góc với $AB$ tại trung điểm của $AB$.',
      miniQuiz: [
        {
          id: 'm99-s3-q1',
          question: 'Cho $(O; 5\\text{ cm})$ và $(O\'; 3\\text{ cm})$ có $OO\' = 7\\text{ cm}$. Vị trí tương đối của hai đường tròn là:',
          options: ['A. Cắt nhau', 'B. Tiếp xúc ngoài', 'C. Ngoài nhau', 'D. Tiếp xúc trong'],
          correctIndex: 0,
          explanation: 'Vì $5 - 3 = 2 < 7 < 5 + 3 = 8$ nên hai đường tròn cắt nhau tại 2 điểm.'
        },
        {
          id: 'm99-s3-q2',
          question: 'Hai đường tròn $(O; 9\\text{ cm})$ và $(O\'; 4\\text{ cm})$ tiếp xúc ngoài với nhau. Độ dài đoạn tiếp tuyến chung ngoài $BC$ bằng:',
          options: ['A. $12\\text{ cm}$', 'B. $13\\text{ cm}$', 'C. $10\\text{ cm}$', 'D. $6\\text{ cm}$'],
          correctIndex: 0,
          explanation: '$BC = 2\\sqrt{Rr} = 2\\sqrt{9 \\cdot 4} = 2 \\cdot 6 = 12\\text{ cm}$.'
        }
      ],
      miniEssay: {
        id: 'm99-s3-e1',
        question: 'Cho $(O; 5\\text{ cm})$ và $(O\'; 3\\text{ cm})$ cắt nhau tại $A, B$ sao cho $OO\'$ cắt $AB$ tại $H$. Tính độ dài $OO\'$ biết $AB = 6\\text{ cm}$ và $O, O\'$ nằm khác phía đối với $AB$.',
        hint: 'Vì $OO\'$ là trung trực $AB$, tính $HA = 3\\text{ cm}$, dùng Pytago tính $OH$ và $O\'H$ rồi cộng lại.',
        rubricChecklist: [
          'Khẳng định $OO\' \\perp AB$ tại $H$ và $HA = HB = 3\\text{ cm}$.',
          'Tính $OH = \\sqrt{5^2 - 3^2} = 4\\text{ cm}$; $O\'H = \\sqrt{3^2 - 3^2} = 0\\text{ cm}$ (nghĩa là $O\'$ trùng $H$!).',
          'Kết luận $OO\' = 4\\text{ cm}$.'
        ],
        sampleAnswer:
          'Đường nối tâm $OO\'$ là trung trực của dây chung $AB$ nên $OO\' \\perp AB$ tại trung điểm $H$ của $AB$, suy ra $HA = 3\\text{ cm}$. Áp dụng Pytago trong $\\triangle OHA$ vuông tại $H$: $OH = \\sqrt{5^2 - 3^2} = 4\\text{ cm}$. Trong $\\triangle O\'HA$: $O\'H = \\sqrt{O\'A^2 - HA^2} = \\sqrt{3^2 - 3^2} = 0$, tức $O\'$ trùng với $H$ ($AB$ là đường kính của $(O\')$). Vậy $OO\' = 4\\text{ cm}$.'
      }
    }
  ],
  'math-9-10': [
    {
      stepTitle: '1. Tính chất Hai Tiếp tuyến Cắt nhau & Chu vi Tam giác',
      stepType: 'concept',
      conceptSection:
        'Từ điểm $M$ nằm ngoài $(O)$, kẻ hai tiếp tuyến $MA, MB$ ($A, B$ là hai tiếp điểm). Ta thu được 3 tính chất vàng: hai đoạn tiếp tuyến bằng nhau, $MO$ là phân giác góc ngoài, và $OM$ là phân giác góc ở tâm.',
      formulaSection: {
        primaryFormula: 'MA = MB, \\qquad \\widehat{AMO} = \\widehat{BMO}, \\qquad \\widehat{AOM} = \\widehat{BOM}',
        secondaryFormulas: [
          'MO \\perp AB \\text{ tại trung điểm } H \\text{ của } AB',
          'OA^2 = OH \\cdot OM, \\qquad MA^2 = MH \\cdot MO'
        ],
        variablesNote:
          '• **Bộ 4 hệ thức trong $\\triangle MAO$ vuông tại $A$, đường cao $AH$**:\n  $OA^2 = OH \\cdot OM$; $MA^2 = MH \\cdot MO$; $AH^2 = OH \\cdot HM$; $AH \\cdot OM = OA \\cdot AM$.\n• Chu vi tam giác tạo bởi tiếp tuyến thứ 3 tiếp xúc cung nhỏ $AB$ tại $C$ (cắt $MA, MB$ ở $D, E$) luôn không đổi bằng $2MA$!'
      },
      deepDiveSection:
        'Chú ý cấu hình chuẩn này: chỉ cần vẽ 1 hình tròn $(O)$, điểm $M$, hai tiếp tuyến $MA, MB$ và đường kính $BD$ thì $AD \\parallel MO$ ngay lập tức (vì cùng vuông góc với $AB$). Đề thi vào 10 rất hay hỏi chứng minh $AD \\parallel MO$!',
      teacherExplanation: 'Khi đề cho 2 tiếp tuyến $MA, MB$ và đường kính $BD$, gần như chắc chắn phải dùng $OM \\perp AB$ và $\\widehat{DAB} = 90^\\circ$ để suy ra $AD \\parallel MO$.',
      keyTakeaway: 'Hai tiếp tuyến cắt nhau $MA, MB$: $MO$ là trung trực của $AB$, và $\\triangle MAO$ vuông tại $A$ có đường cao $AH$.',
      miniQuiz: [
        {
          id: 'm910-s1-q1',
          question: 'Từ điểm $M$ cách tâm $O$ một khoảng $10\\text{ cm}$, kẻ hai tiếp tuyến $MA, MB$ với $(O; 6\\text{ cm})$. Độ dài dây nối hai tiếp điểm $AB$ bằng:',
          options: ['A. $9{,}6\\text{ cm}$', 'B. $4{,}8\\text{ cm}$', 'C. $8\\text{ cm}$', 'D. $12\\text{ cm}$'],
          correctIndex: 0,
          explanation: '$MA = \\sqrt{10^2 - 6^2} = 8\\text{ cm}$. Đường cao $AH = \\frac{OA \\cdot MA}{OM} = \\frac{6 \\cdot 8}{10} = 4{,}8\\text{ cm} \\implies AB = 2AH = 9{,}6\\text{ cm}$.'
        },
        {
          id: 'm910-s1-q2',
          question: 'Cho $MA, MB$ là hai tiếp tuyến của $(O)$ ($MA = 7\\text{ cm}$). Lấy $C$ trên cung nhỏ $AB$, tiếp tuyến tại $C$ cắt $MA, MB$ ở $D, E$. Chu vi $\\triangle MDE$ bằng:',
          options: ['A. $14\\text{ cm}$', 'B. $7\\text{ cm}$', 'C. $21\\text{ cm}$', 'D. $10{,}5\\text{ cm}$'],
          correctIndex: 0,
          explanation: '$DA = DC$ và $EB = EC \\implies P_{\\triangle MDE} = MD + DC + CE + EM = (MD + DA) + (EB + EM) = MA + MB = 14\\text{ cm}$.'
        }
      ],
      miniEssay: {
        id: 'm910-s1-e1',
        question: 'Từ $M$ nằm ngoài $(O)$ kẻ hai tiếp tuyến $MA, MB$ ($A, B$ là tiếp điểm) và đường kính $AC$. Chứng minh $BC \\parallel OM$.',
        hint: 'Chỉ ra $OM \\perp AB$ và $\\widehat{ABC} = 90^\\circ$ (góc nội tiếp chắn nửa đường tròn đường kính $AC$).',
        rubricChecklist: [
          'Chứng minh $OM$ là trung trực của $AB \\implies OM \\perp AB$.',
          'Chỉ ra $\\widehat{ABC} = 90^\\circ \\implies BC \\perp AB$.',
          'Từ hai đường cùng vuông góc $AB$ kết luận $BC \\parallel OM$.'
        ],
        sampleAnswer:
          'Ta có $MA = MB$ (tính chất hai tiếp tuyến cắt nhau) và $OA = OB = R$, suy ra $OM$ là đường trung trực của $AB$, do đó $OM \\perp AB$. Mặt khác, $AC$ là đường kính của $(O)$ nên $\\widehat{ABC} = 90^\\circ$ (góc nội tiếp chắn nửa đường tròn), suy ra $BC \\perp AB$. Vì $OM$ và $BC$ cùng vuông góc với $AB$ nên $BC \\parallel OM$.'
      }
    },
    {
      stepTitle: '2. Góc có Đỉnh Bên trong & Góc có Đỉnh Bên ngoài Đường tròn',
      stepType: 'derivation',
      conceptSection:
        'Ngoài góc ở tâm và góc nội tiếp, hai dây cắt nhau bên trong hoặc hai cát tuyến cắt nhau bên ngoài đường tròn tạo ra hai công thức đo góc theo nửa tổng và nửa hiệu số đo hai cung bị chắn.',
      formulaSection: {
        primaryFormula: '\\text{Bên trong: } \\alpha = \\frac{\\text{sđ}\\wideparen{AB} + \\text{sđ}\\wideparen{CD}}{2}, \\qquad \\text{Bên ngoài: } \\beta = \\frac{\\text{sđ}\\wideparen{AD} - \\text{sđ}\\wideparen{BC}}{2}',
        secondaryFormulas: [
          '\\text{Hai dây cắt nhau tại } I \\text{ bên trong: } IA \\cdot IB = IC \\cdot ID',
          '\\text{Hai cát tuyến từ } M \\text{ bên ngoài: } MA \\cdot MB = MC \\cdot MD'
        ],
        variablesNote:
          '• Nhớ nhanh: Cắt **bên trong** là **CỘNG** (nửa tổng hai cung); cắt **bên ngoài** là **TRỪ** (nửa hiệu cung lớn trừ cung nhỏ).\n• Hai hệ thức tích $IA \\cdot IB = IC \\cdot ID$ và $MA \\cdot MB = MC \\cdot MD$ thực chất chính là **Phương tích** của một điểm đối với đường tròn.'
      },
      deepDiveSection:
        'Kỹ thuật nối hai đầu dây để tạo tam giác đồng dạng dùng cực nhiều trong bài hình tổng hợp: khi thấy $MA \\cdot MB = MC \\cdot MD$, nối $AD$ và $BC$ hoặc $AC$ và $BD$ rồi chỉ ra cặp góc nội tiếp chắn cùng cung.',
      teacherExplanation: 'Bên trong đường tròn lấy nửa tổng hai cung bị chắn; bên ngoài lấy nửa hiệu cung lớn trừ cung nhỏ.',
      keyTakeaway: 'Luôn nhớ hai hệ thức đồng dạng kinh điển: $IA \\cdot IB = IC \\cdot ID$ và $MA \\cdot MB = MC \\cdot MD$.',
      miniQuiz: [
        {
          id: 'm910-s2-q1',
          question: 'Hai dây $AC$ và $BD$ cắt nhau tại $I$ bên trong $(O)$. Biết $\\text{sđ}\\wideparen{AB} = 70^\\circ$ và $\\text{sđ}\\wideparen{CD} = 50^\\circ$. Số đo góc $\\widehat{AIB}$ là:',
          options: ['A. $60^\\circ$', 'B. $10^\\circ$', 'C. $120^\\circ$', 'D. $20^\\circ$'],
          correctIndex: 0,
          explanation: '$\\widehat{AIB} = \\frac{70^\\circ + 50^\\circ}{2} = 60^\\circ$.'
        },
        {
          id: 'm910-s2-q2',
          question: 'Từ điểm $M$ nằm ngoài $(O)$ kẻ hai cát tuyến $MAB$ và $MCD$ ($A$ giữa $M, B$; $C$ giữa $M, D$). Biết $MA = 4, AB = 5, MC = 3$. Độ dài $MD$ bằng:',
          options: ['A. $12$', 'B. $9$', 'C. $6{,}67$', 'D. $15$'],
          correctIndex: 0,
          explanation: '$MB = 4 + 5 = 9$. Áp dụng $MA \\cdot MB = MC \\cdot MD \\implies 4 \\cdot 9 = 3 \\cdot MD \\implies MD = 12$.'
        }
      ],
      miniEssay: {
        id: 'm910-s2-e1',
        question: 'Cho điểm $M$ nằm ngoài đường tròn $(O)$, vẽ tiếp tuyến $MA$ và cát tuyến $MBC$ ($B$ giữa $M$ và $C$). Biết $\\text{sđ}\\wideparen{AC} = 130^\\circ$, $\\text{sđ}\\wideparen{AB} = 50^\\circ$ (hai cung nhỏ). Tính số đo góc $\\widehat{AMC}$.',
        hint: 'Góc $\\widehat{AMC}$ là góc có đỉnh bên ngoài đường tròn chắn cung lớn $AC$ và cung nhỏ $AB$.',
        rubricChecklist: [
          'Nhận diện đúng $\\widehat{AMC}$ là góc có đỉnh bên ngoài đường tròn.',
          'Áp dụng đúng công thức nửa hiệu: $\\frac{\\text{sđ}\\wideparen{AC} - \\text{sđ}\\wideparen{AB}}{2}$.',
          'Tính chính xác $\\widehat{AMC} = 40^\\circ$.'
        ],
        sampleAnswer:
          'Góc $\\widehat{AMC}$ là góc có đỉnh nằm ngoài đường tròn $(O)$ chắn hai cung $AC$ và $AB$. Do đó $\\widehat{AMC} = \\frac{\\text{sđ}\\wideparen{AC} - \\text{sđ}\\wideparen{AB}}{2} = \\frac{130^\\circ - 50^\\circ}{2} = 40^\\circ$.'
      }
    },
    {
      stepTitle: '3. Phối hợp Hai Tiếp tuyến + Cát tuyến trong Đề thi vào 10',
      stepType: 'example',
      conceptSection:
        'Bài hình tổng hợp vào 10 rất chuộng mô hình: từ $M$ ngoài $(O)$ kẻ hai tiếp tuyến $MA, MB$ và một cát tuyến $MCD$ ($C$ giữa $M, D$), $OM$ cắt $AB$ tại $H$. Khi đó $MA^2 = MC \\cdot MD = MH \\cdot MO$, suy ra ngay $CHOD$ là tứ giác nội tiếp!',
      formulaSection: {
        primaryFormula: 'MC \\cdot MD = MH \\cdot MO \\implies CHOD \\text{ nội tiếp}',
        secondaryFormulas: [
          '\\widehat{OHC} = \\widehat{ODC} = \\widehat{OCD} = \\widehat{OHD}',
          'HA \\text{ là tia phân giác của } \\widehat{CHD}'
        ],
        variablesNote:
          '• Đây là bước chuyển tiếp cực quan trọng: từ $MA^2 = MC \\cdot MD$ và $MA^2 = MH \\cdot MO$ ghép bắc cầu ra $MC \\cdot MD = MH \\cdot MO$.\n• Từ đó $\\triangle MHC \\sim \\triangle MDO$ (c.g.c), dẫn thẳng đến tứ giác nội tiếp $CHOD$ dù không có góc vuông $90^\\circ$!'
      },
      deepDiveSection:
        'Sau khi chứng minh được $CHOD$ nội tiếp, nhờ $\\triangle OCD$ cân tại $O$ ($OC = OD = R$), ta suy ngay ra $\\widehat{OHC} = \\widehat{ODC} = \\widehat{OCD} = \\widehat{OHD}$, tức $OM$ là phân giác của $\\widehat{CHD}$ và $AB$ (vuông góc $OM$) là phân giác ngoài của $\\widehat{CHD}$!',
      teacherExplanation: 'Ghi nhớ chuỗi bắc cầu vàng: $MH\\cdot MO = MA^2 = MC\\cdot MD \\implies CHOD$ nội tiếp!',
      keyTakeaway: 'Cặp tiếp tuyến + cát tuyến luôn cho hệ thức kép $MH\\cdot MO = MA^2 = MC\\cdot MD$.',
      miniQuiz: [
        {
          id: 'm910-s3-q1',
          question: 'Với $MA, MB$ là tiếp tuyến $(O)$, $OM$ cắt $AB$ tại $H$, $MCD$ là cát tuyến. Tỉ lệ thức bắc cầu đúng để chứng minh $\\triangle MHC \\sim \\triangle MDO$ là:',
          options: [
            'A. $\\frac{MH}{MD} = \\frac{MC}{MO}$',
            'B. $\\frac{MH}{MC} = \\frac{MD}{MO}$',
            'C. $\\frac{OH}{MD} = \\frac{MC}{OM}$',
            'D. $\\frac{HC}{DO} = \\frac{MA}{MO}$'
          ],
          correctIndex: 0,
          explanation: 'Từ $MH \\cdot MO = MC \\cdot MD$ chia hai vế cho $MO \\cdot MD$ được $\\frac{MH}{MD} = \\frac{MC}{MO}$, kết hợp $\\widehat{HMC}$ chung.'
        },
        {
          id: 'm910-s3-q2',
          question: 'Sau khi chứng minh được $CHOD$ là tứ giác nội tiếp, vì sao $\\widehat{MHC} = \\widehat{MHD}$?',
          options: [
            'A. Vì $\\widehat{OHC} = \\widehat{ODC} = \\widehat{OCD}$ và $\\widehat{OHD} + \\widehat{OCD} = 180^\\circ$',
            'B. Vì $HC = HD$',
            'C. Vì $C, D$ đối xứng nhau qua $MO$',
            'D. Vì $H$ là trung điểm $CD$'
          ],
          correctIndex: 0,
          explanation: 'Sử dụng góc ngoài tại $H$ và hai góc đáy bằng nhau trong $\\triangle OCD$ cân tại $O$.'
        }
      ],
      miniEssay: {
        id: 'm910-s3-e1',
        question: 'Cho $(O)$ và điểm $M$ nằm ngoài $(O)$. Kẻ hai tiếp tuyến $MA, MB$ và cát tuyến $MCD$ ($C$ giữa $M, D$). Gọi $H$ là giao điểm của $OM$ và $AB$. Chứng minh $MC \\cdot MD = MH \\cdot MO$.',
        hint: 'Chứng minh $MA^2 = MH \\cdot MO$ (hệ thức lượng trong $\\triangle MAO$) và $MA^2 = MC \\cdot MD$ (hai tam giác $\\triangle MAC \\sim \\triangle MDA$).',
        rubricChecklist: [
          'Chỉ ra $OM \\perp AB$ tại $H$ và áp dụng hệ thức lượng trong $\\triangle MAO$ vuông tại $A$: $MA^2 = MH \\cdot MO$.',
          'Chứng minh $\\triangle MAC \\sim \\triangle MDA$ (g.g) $\\implies MA^2 = MC \\cdot MD$.',
          'Bắc cầu kết luận $MC \\cdot MD = MH \\cdot MO$.'
        ],
        sampleAnswer:
          'Xét $\\triangle MAO$ vuông tại $A$ có đường cao $AH$ (vì $OM$ là trung trực $AB$), theo hệ thức lượng ta có $MA^2 = MH \\cdot MO$ (1). Xét $\\triangle MAC$ và $\\triangle MDA$ có $\\widehat{AMC}$ chung và $\\widehat{MAC} = \\widehat{MDA}$ (cùng chắn cung $AC$), suy ra $\\triangle MAC \\sim \\triangle MDA$ (g.g) $\\implies MA^2 = MC \\cdot MD$ (2). Từ (1) và (2) suy ra $MC \\cdot MD = MH \\cdot MO$.'
      }
    }
  ],
  'math-9-11': [
    {
      stepTitle: '1. Bất đẳng thức Cô-si (AM-GM) Cơ bản & Kỹ thuật Chọn Điểm rơi',
      stepType: 'concept',
      conceptSection:
        'Bất đẳng thức Cô-si (AM-GM) cho hai hoặc ba số không âm là công cụ số 1 cho câu 0,5 điểm cuối cùng trong đề thi vào lớp 10. Điều kiện bắt buộc: các số áp dụng phải **không âm** và phải tìm được **dấu bằng xảy ra** tại điểm rơi hợp lệ.',
      formulaSection: {
        primaryFormula: 'a + b \\ge 2\\sqrt{ab}, \\qquad \\frac{1}{a} + \\frac{1}{b} \\ge \\frac{4}{a + b} \\quad (a, b > 0)',
        secondaryFormulas: [
          'a + b + c \\ge 3\\sqrt[3]{abc} \\quad (a, b, c \\ge 0)',
          'a^2 + b^2 \\ge 2ab \\ge \\frac{(a+b)^2}{2}'
        ],
        variablesNote:
          '• **Cảnh báo mất toàn bộ điểm câu BĐT**: Chỉ cần dùng Cô-si cho số âm hoặc kết luận Max/Min mà dấu "=" KHÔNG xảy ra tại cùng 1 giá trị biến là bài giải sai hoàn toàn!\n• Phương pháp **Điểm rơi**: dự đoán giá trị biến đạt cực trị (thường là biên hoặc đối xứng $x = y$), rồi tách hệ số sao cho hai số đem Cô-si có **giá trị bằng nhau** tại điểm rơi đó.'
      },
      deepDiveSection:
        'Ví dụ kinh điển: tìm Min của $P = x + \\frac{4}{x}$ với $x \\ge 3$. Nếu Cô-si trực tiếp $x + \\frac{4}{x} \\ge 2\\sqrt{4} = 4$ thì dấu "=" xảy ra tại $x = 2$ — vi phạm $x \\ge 3$! Điểm rơi thực tế là biên $x = 3$, khi đó $\\frac{4}{x} = \\frac{4}{3}$, ta tách $P = (\\frac{4}{9}x + \\frac{4}{x}) + \\frac{5}{9}x$ để Cô-si ra đúng điểm rơi $x = 3$.',
      teacherExplanation: 'Luôn kiểm tra dấu "=" xảy ra có nằm trong miền điều kiện của đề bài hay không!',
      keyTakeaway: 'Chọn đúng điểm rơi rồi tách ghép sao cho các số hạng đem áp dụng Cô-si bằng nhau tại điểm rơi.',
      miniQuiz: [
        {
          id: 'm911-s1-q1',
          question: 'Với $x > 0$, giá trị nhỏ nhất của biểu thức $A = 2x + \\frac{8}{x}$ là:',
          options: ['A. $8$', 'B. $16$', 'C. $4$', 'D. $10$'],
          correctIndex: 0,
          explanation: '$A = 2x + \\frac{8}{x} \\ge 2\\sqrt{2x \\cdot \\frac{8}{x}} = 2\\sqrt{16} = 8$. Dấu "=" tại $2x = \\frac{8}{x} \\iff x = 2 > 0$.'
        },
        {
          id: 'm911-s1-q2',
          question: 'Cho $x \\ge 2$. Khi tìm giá trị nhỏ nhất của $B = x + \\frac{1}{x}$, điểm rơi $x$ đạt tại đâu và giá trị Min bằng bao nhiêu?',
          options: ['A. $x = 2$, $\\min B = \\frac{5}{2}$', 'B. $x = 1$, $\\min B = 2$', 'C. $x = 2$, $\\min B = 2$', 'D. Không có Min'],
          correctIndex: 0,
          explanation: 'Vì $x = 1$ không thuộc $[2; +\\infty)$, điểm rơi là $x = 2$. Tách $B = (\\frac{1}{4}x + \\frac{1}{x}) + \\frac{3}{4}x \\ge 2\\sqrt{\\frac{1}{4}} + \\frac{3}{4}\\cdot 2 = 1 + \\frac{3}{2} = \\frac{5}{2}$.'
        }
      ],
      miniEssay: {
        id: 'm911-s1-e1',
        question: 'Cho $x \\ge 3$. Tìm giá trị nhỏ nhất của biểu thức $P = x + \\frac{1}{x}$.',
        hint: 'Dự đoán điểm rơi ở biên $x = 3$ nên $\\frac{1}{x} = \\frac{1}{3}$, suy ra ghép $\\frac{1}{9}x$ với $\\frac{1}{x}$ và giữ phần dư $\\frac{8}{9}x$.',
        rubricChecklist: [
          'Tách đúng $P = \\left(\\frac{x}{9} + \\frac{1}{x}\\right) + \\frac{8x}{9}$.',
          'Áp dụng Cô-si cho 2 số dương: $\\frac{x}{9} + \\frac{1}{x} \\ge \\frac{2}{3}$.',
          'Đánh giá $\\frac{8x}{9} \\ge \\frac{24}{9} = \\frac{8}{3}$ và kết luận $\\min P = \\frac{10}{3}$ tại $x = 3$.'
        ],
        sampleAnswer:
          'Ta tách $P = \\left(\\frac{x}{9} + \\frac{1}{x}\\right) + \\frac{8x}{9}$. Áp dụng bất đẳng thức Cô-si cho hai số dương: $\\frac{x}{9} + \\frac{1}{x} \\ge 2\\sqrt{\\frac{x}{9} \\cdot \\frac{1}{x}} = \\frac{2}{3}$. Mặt khác vì $x \\ge 3$ nên $\\frac{8x}{9} \\ge \\frac{8 \\cdot 3}{9} = \\frac{8}{3}$. Cộng hai bất đẳng thức: $P \\ge \\frac{2}{3} + \\frac{8}{3} = \\frac{10}{3}$. Dấu "=" xảy ra khi $x = 3$. Vậy $\\min P = \\frac{10}{3}$.'
      }
    },
    {
      stepTitle: '2. Kỹ thuật Đổi biến $S, P$ & Cô-si Ngược dấu',
      stepType: 'derivation',
      conceptSection:
        'Với các biểu thức đối xứng hai biến dương $x, y$ có điều kiện ràng buộc (như $x + y = k$ hoặc $xy = m$), ta đánh giá trực tiếp $xy \\le \\frac{(x+y)^2}{4}$ hoặc hạ bậc mẫu bằng kỹ thuật Cô-si ngược dấu $\\frac{a}{1 + b} = a - \\frac{ab}{1+b}$.',
      formulaSection: {
        primaryFormula: '\\frac{a}{1 + b^2} = a - \\frac{ab^2}{1 + b^2} \\ge a - \\frac{ab^2}{2b} = a - \\frac{ab}{2}',
        secondaryFormulas: [
          'ab \\le \\frac{(a + b)^2}{4} \\le \\frac{a^2 + b^2}{2}',
          '\\frac{1}{a} + \\frac{1}{b} \\ge \\frac{4}{a + b}'
        ],
        variablesNote:
          '• **Kỹ thuật Cô-si ngược dấu**: Nếu biểu thức nằm ở **MẪU SỐ** ($1 + b^2$), Cô-si trực tiếp sẽ làm ngược chiều BĐT. Hãy tách tử số thành $(a + ab^2) - ab^2$ để chia hết $1 + b^2$, đẩy biểu thức cần Cô-si lên **TỬ SỐ**!'
      },
      deepDiveSection:
        'Ngoài ra, với biểu thức chứa căn như $x + \\sqrt{x} + 1$, nhớ rằng có thể chuyển thành bình phương đúng $(\\sqrt{x} + \\frac{1}{2})^2 + \\frac{3}{4}$ để tìm Max/Min của phân thức $\\frac{M}{x + \\sqrt{x} + 1}$ một cách cực kỳ an toàn không cần Cô-si phức tạp.',
      teacherExplanation: 'Khi mẫu thức chứa tổng bình phương $1 + b^2$, dùng mẹo trừ bớt để tách phần nguyên rồi mới Cô-si phần còn lại.',
      keyTakeaway: 'Mẫu số lớn nhất $\\implies$ phân thức nhỏ nhất; Cô-si ở mẫu luôn phải lật chiều hoặc dùng ngược dấu.',
      miniQuiz: [
        {
          id: 'm911-s2-q1',
          question: 'Cho $x, y > 0$ thỏa mãn $x + y = 6$. Giá trị nhỏ nhất của $P = \\frac{1}{x} + \\frac{1}{y}$ là:',
          options: ['A. $\\frac{2}{3}$', 'B. $\\frac{1}{3}$', 'C. $\\frac{3}{2}$', 'D. $1$'],
          correctIndex: 0,
          explanation: '$\\frac{1}{x} + \\frac{1}{y} \\ge \\frac{4}{x + y} = \\frac{4}{6} = \\frac{2}{3}$, đạt được khi $x = y = 3$.'
        },
        {
          id: 'm911-s2-q2',
          question: 'Cho $x \\ge 0$. Giá trị lớn nhất của biểu thức $M = \\frac{4}{x - 2\\sqrt{x} + 5}$ bằng:',
          options: ['A. $1$', 'B. $\\frac{4}{5}$', 'C. $2$', 'D. $4$'],
          correctIndex: 0,
          explanation: 'Mẫu số $x - 2\\sqrt{x} + 5 = (\\sqrt{x} - 1)^2 + 4 \\ge 4$, nên $M \\le \\frac{4}{4} = 1$, đạt được khi $x = 1$.'
        }
      ],
      miniEssay: {
        id: 'm911-s2-e1',
        question: 'Cho $a, b > 0$ thỏa mãn $a + b \\le 1$. Tìm giá trị nhỏ nhất của $S = ab + \\frac{1}{ab}$.',
        hint: 'Dùng $ab \\le \\frac{(a+b)^2}{4} \\le \\frac{1}{4}$ để biết điểm rơi là $ab = \\frac{1}{4}$, từ đó tách $\\frac{1}{ab} = \\frac{1}{16ab} + \\frac{15}{16ab}$.',
        rubricChecklist: [
          'Chứng minh $0 < ab \\le \\frac{1}{4}$.',
          'Tách $S = \\left(ab + \\frac{1}{16ab}\\right) + \\frac{15}{16ab}$.',
          'Cô-si cặp đầu $\\ge \\frac{1}{2}$ và đánh giá $\\frac{15}{16ab} \\ge \\frac{15}{4}$ để ra $\\min S = \\frac{17}{4}$ tại $a = b = \\frac{1}{2}$.'
        ],
        sampleAnswer:
          'Ta có $ab \\le \\frac{(a+b)^2}{4} \\le \\frac{1}{4}$. Tách $S = \\left(ab + \\frac{1}{16ab}\\right) + \\frac{15}{16ab}$. Theo Cô-si: $ab + \\frac{1}{16ab} \\ge 2\\sqrt{\\frac{1}{16}} = \\frac{1}{2}$. Vì $ab \\le \\frac{1}{4}$ nên $\\frac{15}{16ab} \\ge \\frac{15}{4}$. Cộng vế theo vế: $S \\ge \\frac{1}{2} + \\frac{15}{4} = \\frac{17}{4}$. Dấu "=" xảy ra khi $a = b = \\frac{1}{2}$.'
      }
    },
    {
      stepTitle: '3. Phân tích Chặn miền & Cực trị Hình học trong Đề thi vào 10',
      stepType: 'example',
      conceptSection:
        'Ngoài đại số thuần túy, bài toán cực trị trong đề vào 10 còn gắn với hình học phẳng (diện tích lớn nhất, chu vi nhỏ nhất) hoặc biểu thức chứa tích hai biến cần đưa về phương trình bậc hai có $\\Delta \\ge 0$ (phương pháp miền giá trị).',
      formulaSection: {
        primaryFormula: 'a^2 + b^2 \\ge \\frac{(a+b)^2}{2}, \\qquad |a - b| \\text{ nhỏ nhất khi } a = b',
        secondaryFormulas: [
          '\\text{Tam giác nội tiếp cố định } AB: \\ S_{\\triangle ABC} \\max \\iff h_C \\max',
          '\\text{Phương pháp miền giá trị: } y = f(x) \\implies \\Delta_x \\ge 0'
        ],
        variablesNote:
          '• Khi biết $a + b = \\text{const}$, muốn cực đại $ab$ hay $S_{\\triangle}$ dùng $ab \\le \\frac{(a+b)^2}{4}$ ($a = b$).\n• Nếu biểu thức có tử và mẫu bậc hai đều dạng $P = \\frac{ax^2 + bx + c}{x^2 + 1}$, nhân chéo đưa về phương trình ẩn $x$ có tham số $P$ và giải $\\Delta \\ge 0$.'
      },
      deepDiveSection:
        'Phương pháp miền giá trị $\\Delta \\ge 0$ cực kỳ an toàn cho các bạn chưa quen mẹo tách ghép Cô-si đối với phân thức bậc 2: cứ nhân chéo thu gọn thành $Ax^2 + Bx + C = 0$ theo ẩn $x$, rồi giải $\\Delta \\ge 0$ là tự động tìm ra cả Max lẫn Min cùng giá trị $x$ đạt dấu bằng.',
      teacherExplanation: 'Phân thức bậc hai không biết tách điểm rơi? Hãy nhân chéo tạo phương trình bậc hai rồi xét $\\Delta \\ge 0$!',
      keyTakeaway: 'Kết hợp điểm rơi Cô-si với phương pháp miền giá trị $\\Delta \\ge 0$ xử lý gọn mọi câu cực trị lớp 9.',
      miniQuiz: [
        {
          id: 'm911-s3-q1',
          question: 'Một mảnh vườn hình chữ nhật có chu vi $40\\text{ m}$. Diện tích lớn nhất có thể của mảnh vườn là:',
          options: ['A. $100\\text{ m}^2$', 'B. $400\\text{ m}^2$', 'C. $96\\text{ m}^2$', 'D. $80\\text{ m}^2$'],
          correctIndex: 0,
          explanation: 'Nửa chu vi $a + b = 20 \\implies S = ab \\le \\frac{(a+b)^2}{4} = 100\\text{ m}^2$ khi $a = b = 10\\text{ m}$ (hình vuông).'
        },
        {
          id: 'm911-s3-q2',
          question: 'Giá trị lớn nhất của biểu thức $K = \\frac{x}{x^2 + 1}$ trên $\\mathbb{R}$ bằng:',
          options: ['A. $\\frac{1}{2}$', 'B. $1$', 'C. $\\frac{1}{4}$', 'D. $2$'],
          correctIndex: 0,
          explanation: '$x^2 + 1 \\ge 2|x| \\ge 2x \\implies \\frac{x}{x^2 + 1} \\le \\frac{1}{2}$, đạt tại $x = 1$.'
        }
      ],
      miniEssay: {
        id: 'm911-s3-e1',
        question: 'Dùng phương pháp miền giá trị hoặc Cô-si tìm giá trị lớn nhất và nhỏ nhất của $A = \\frac{2x + 1}{x^2 + 2}$ trên $\\mathbb{R}$.',
        hint: 'Nhân chéo thành $Ax^2 - 2x + (2A - 1) = 0$, xét riêng $A = 0$ và $\\Delta\' = 1 - A(2A - 1) \\ge 0$.',
        rubricChecklist: [
          'Nhân chéo lập phương trình $Ax^2 - 2x + 2A - 1 = 0$.',
          'Giải bất phương trình bậc hai $2A^2 - A - 1 \\le 0 \\iff -\\frac{1}{2} \\le A \\le 1$.',
          'Chỉ ra $\\max A = 1$ tại $x = 1$ và $\\min A = -\\frac{1}{2}$ tại $x = -2$.'
        ],
        sampleAnswer:
          'Vì $x^2 + 2 > 0$, nhân chéo ta được $Ax^2 - 2x + (2A - 1) = 0$. Với $A = 0 \\implies x = -\\frac{1}{2}$ (có nghiệm). Với $A \\neq 0$, phương trình có nghiệm thực $\\iff \\Delta\' = 1 - A(2A - 1) \\ge 0 \\iff 2A^2 - A - 1 \\le 0 \\iff -\\frac{1}{2} \\le A \\le 1$. Tại $A = 1 \\implies x^2 - 2x + 1 = 0 \\implies x = 1$. Tại $A = -\\frac{1}{2} \\implies -\\frac{1}{2}x^2 - 2x - 2 = 0 \\implies x = -2$. Vậy $\\max A = 1$ và $\\min A = -\\frac{1}{2}$.'
      }
    }
  ],
  'math-9-12': [
    {
      stepTitle: '1. Bài toán Chuyển động (Cùng chiều, Ngược chiều & Đổi vận tốc)',
      stepType: 'concept',
      conceptSection:
        'Bài toán chuyển động liên kết ba đại lượng $S$ (quãng đường), $v$ (vận tốc) và $t$ (thời gian). Khi lập phương trình, cách tốt nhất là kẻ bảng gồm 2 hàng (dự định/thực tế hoặc xe 1/xe 2) và 3 cột ($S, v, t$), chọn đại lượng đề bài hỏi làm ẩn $x > 0$.',
      formulaSection: {
        primaryFormula: 't_{\\text{trễ}} - t_{\\text{sớm}} = \\Delta t \\iff \\frac{S}{v_1} - \\frac{S}{v_2} = \\Delta t',
        secondaryFormulas: [
          '\\text{Gặp nhau (đi ngược chiều): } S_1 + S_2 = AB',
          '\\text{Đuổi kịp (cùng chiều): } S_{\\text{sau}} - S_{\\text{trước}} = AB'
        ],
        variablesNote:
          '• **Cảnh báo**: Phương trình thời gian $\\frac{S}{v_1} - \\frac{S}{v_2} = \\Delta t$ lấy **thời gian nhiều hơn (đi chậm hơn) TRỪ thời gian ít hơn (đi nhanh hơn)** — rất nhiều bạn viết ngược chiều dẫn đến $\\Delta < 0$ hoặc nghiệm âm!\n• Nhớ đổi phút sang giờ ($15\\text{ phút} = \\frac{1}{4}\\text{ h}$).'
      },
      deepDiveSection:
        'Với bài toán thay đổi vận tốc giữa đường (đi được 1 đoạn đường $S_1$ rồi nghỉ $\\Delta t$ phút, sau đó tăng tốc $v + a$ trên đoạn còn lại để kịp giờ), ta tách thành $t_1 + t_{\\text{nghỉ}} + t_2 = t_{\\text{dự định}}$. Cách viết này giúp giữ nguyên phương trình đơn giản dễ quy đồng.',
      teacherExplanation: 'Luôn lấy thời gian đi chậm (mẫu nhỏ hơn) trừ đi thời gian đi nhanh (mẫu lớn hơn) để ra hiệu thời gian dương.',
      keyTakeaway: 'Kẻ bảng 3 cột ($S, v, t$) và kiểm tra đơn vị giờ/km đồng nhất trước khi lập phương trình.',
      miniQuiz: [
        {
          id: 'm912-s1-q1',
          question: 'Một ô tô đi từ $A$ đến $B$ dài $120\\text{ km}$. Lúc về tăng vận tốc thêm $10\\text{ km/h}$ nên thời gian về ít hơn thời gian đi $24\\text{ phút}$. Gọi vận tốc lúc đi là $x$ ($x > 0$), phương trình đúng là:',
          options: [
            'A. $\\frac{120}{x} - \\frac{120}{x + 10} = \\frac{2}{5}$',
            'B. $\\frac{120}{x + 10} - \\frac{120}{x} = \\frac{2}{5}$',
            'C. $\\frac{120}{x} - \\frac{120}{x + 10} = 24$',
            'D. $\\frac{120}{x} + \\frac{120}{x + 10} = \\frac{2}{5}$'
          ],
          correctIndex: 0,
          explanation: 'Đổi $24\\text{ phút} = \\frac{2}{5}\\text{ h}$. Thời gian lúc đi lớn hơn lúc về nên lấy $\\frac{120}{x} - \\frac{120}{x+10} = \\frac{2}{5}$.'
        },
        {
          id: 'm912-s1-q2',
          question: 'Giải phương trình $\\frac{120}{x} - \\frac{120}{x + 10} = \\frac{2}{5}$ với $x > 0$ ta được vận tốc $x$ bằng:',
          options: ['A. $50\\text{ km/h}$', 'B. $40\\text{ km/h}$', 'C. $60\\text{ km/h}$', 'D. $45\\text{ km/h}$'],
          correctIndex: 0,
          explanation: 'Chia 2 vế cho $2$ rồi quy đồng: $x(x + 10) = 3000 \\iff x^2 + 10x - 3000 = 0 \\implies x = 50$ ($x > 0$).'
        }
      ],
      miniEssay: {
        id: 'm912-s1-e1',
        question: 'Quãng đường $AB$ dài $150\\text{ km}$. Một xe máy đi từ $A$ đến $B$ với vận tốc dự định. Khi đi được $1\\text{ giờ}$, xe tăng vận tốc thêm $5\\text{ km/h}$ trên quãng đường còn lại nên đến $B$ sớm hơn dự định $20\\text{ phút}$. Tính vận tốc dự định ban đầu.',
        hint: 'Gọi vận tốc dự định là $x$ ($x > 0$). Quãng đường còn lại là $150 - x$, đi hết sớm hơn $1/3$ giờ tức là thời gian còn lại theo dự định trừ thời gian thực tế còn lại bằng $1/3$.',
        rubricChecklist: [
          'Gọi $x > 0$ (km/h), đổi $20\\text{ phút} = \\frac{1}{3}\\text{ h}$.',
          'Lập đúng phương trình $\\frac{150 - x}{x} - \\frac{150 - x}{x + 5} = \\frac{1}{3}$.',
          'Giải ra phương trình bậc hai $x^2 + 20x - 2250 = 0$ (hoặc $\\frac{5(150-x)}{x(x+5)} = \\frac{1}{3} \\iff x^2 + 20x - 2250 = 0$, $x = -10 + 10\\sqrt{23{,}5}$) và đối chiếu $x > 0$.'
        ],
        sampleAnswer:
          'Gọi vận tốc dự định là $x$ (km/h, $x > 0$). Sau $1\\text{ h}$, xe đi được $x\\text{ km}$, quãng đường còn lại $150 - x\\text{ km}$. Theo dự định cần thêm $\\frac{150 - x}{x}$ giờ, thực tế đi hết $\\frac{150 - x}{x + 5}$ giờ nên đến sớm hơn $\\frac{1}{3}$ giờ: $\\frac{150 - x}{x} - \\frac{150 - x}{x + 5} = \\frac{1}{3} \\iff 15(150 - x) = x(x + 5) \\iff x^2 + 20x - 2250 = 0$. Giải được $x = -10 + \\sqrt{2350} \\approx 38{,}48\\text{ km/h}$ (thỏa mãn $x > 0$, loại nghiệm âm).'
      }
    },
    {
      stepTitle: '2. Bài toán Năng suất – Kế hoạch & Làm chung, Làm riêng',
      stepType: 'derivation',
      conceptSection:
        'Bài toán năng suất tương tự hoàn toàn bài toán chuyển động, chỉ thay cặp ($S, v, t$) bằng cặp **(Khối lượng công việc $A$, Năng suất $N$, Thời gian $t$)**. Nếu không cho tổng số sản phẩm cụ thể (làm chung công việc hoàn thành một bức tường / bể nước), ta quy ước toàn bộ công việc là $1$ đơn vị.',
      formulaSection: {
        primaryFormula: 'A = N \\cdot t \\implies t_{\\text{dự định}} - t_{\\text{thực tế}} = \\Delta t',
        secondaryFormulas: [
          '\\text{Làm chung công việc } 1: \\ \\frac{t_1}{x} + \\frac{t_2}{y} = 1',
          'N_{\\text{chung}} = N_1 + N_2'
        ],
        variablesNote:
          '• **Cẩn thận bẫy đọc đề**: Đề bài nói *"một tổ làm xong trước thời hạn $2$ ngày VÀ làm thêm được $20$ sản phẩm"* thì khối lượng thực tế không phải $A$ mà là **$A + 20$**!\n• Khi năng suất $x$ là số sản phẩm/ngày hoặc số người, nhớ đặt điều kiện $x \\in \\mathbb{N}^*$.'
      },
      deepDiveSection:
        'Một dạng hay gặp nữa là làm chung trong $k$ giờ rồi một đội chuyển đi, đội còn lại làm một mình thêm $m$ giờ nữa mới xong. Phương trình 1: $\\frac{k}{x} + \\frac{k + m}{y} = 1$, kết hợp phương trình 2 từ tổng thời gian làm chung ban đầu $\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{T}$.',
      teacherExplanation: 'Khi đề có chi tiết "vừa xong sớm, vừa làm vượt định mức $k$ sản phẩm", phải cộng thêm $k$ vào khối lượng thực tế!',
      keyTakeaway: 'Công thức lõi $A = N \\cdot t$; nhớ kiểm tra công việc có vượt mức hay không.',
      miniQuiz: [
        {
          id: 'm912-s2-q1',
          question: 'Một đội thợ dự định may $300$ chiếc áo trong một số ngày. Nhờ mỗi ngày may thêm $5$ áo nên hoàn thành sớm $3$ ngày và may thêm được $15$ áo. Gọi năng suất dự định là $x$ ($x \\in \\mathbb{N}^*$), phương trình đúng là:',
          options: [
            'A. $\\frac{300}{x} - \\frac{315}{x + 5} = 3$',
            'B. $\\frac{300}{x} - \\frac{300}{x + 5} = 3$',
            'C. $\\frac{315}{x} - \\frac{300}{x + 5} = 3$',
            'D. $\\frac{300}{x + 5} - \\frac{315}{x} = 3$'
          ],
          correctIndex: 0,
          explanation: 'Tổng số áo thực tế may là $300 + 15 = 315$ chiếc với năng suất $x + 5$, thời gian ít hơn dự định $3$ ngày nên $\\frac{300}{x} - \\frac{315}{x+5} = 3$.'
        },
        {
          id: 'm912-s2-q2',
          question: 'Hai người làm chung một công việc sau $4\\text{ giờ}$ thì xong. Nếu người 1 làm một mình $2\\text{ giờ}$ rồi nghỉ và người 2 làm tiếp $6\\text{ giờ}$ thì xong việc. Người 1 làm một mình hết bao lâu?',
          options: ['A. $8\\text{ giờ}$', 'B. $6\\text{ giờ}$', 'C. $12\\text{ giờ}$', 'D. $10\\text{ giờ}$'],
          correctIndex: 0,
          explanation: 'Hệ: $\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{4}$ và $\\frac{2}{x} + \\frac{6}{y} = 1 \\implies \\frac{1}{y} = \\frac{1}{8} \\implies y = 8$, suy ra $\\frac{1}{x} = \\frac{1}{4} - \\frac{1}{8} = \\frac{1}{8} \\implies x = 8\\text{ giờ}$.'
        }
      ],
      miniEssay: {
        id: 'm912-s2-e1',
        question: 'Theo kế hoạch, một xưởng phải đóng $120$ bộ bàn ghế. Thực tế mỗi ngày xưởng đóng thêm $2$ bộ nên đã hoàn thành xong sớm hơn kế hoạch $2$ ngày. Tính số bộ bàn ghế xưởng dự định đóng mỗi ngày.',
        hint: 'Gọi số bộ bàn ghế dự định mỗi ngày là $x$ ($x \\in \\mathbb{N}^*$), lập phương trình $\\frac{120}{x} - \\frac{120}{x + 2} = 2$.',
        rubricChecklist: [
          'Gọi $x \\in \\mathbb{N}^*$, lập đúng phương trình $\\frac{120}{x} - \\frac{120}{x + 2} = 2$.',
          'Biến đổi thành phương trình bậc hai $x^2 + 2x - 120 = 0$.',
          'Giải được $x = 10$ (nhận) và $x = -12$ (loại), kết luận $10$ bộ/ngày.'
        ],
        sampleAnswer:
          'Gọi số bộ bàn ghế xưởng dự định đóng mỗi ngày là $x$ ($x \\in \\mathbb{N}^*$). Thời gian dự định là $\\frac{120}{x}$ (ngày), thời gian thực tế là $\\frac{120}{x + 2}$ (ngày). Theo đề bài ta có: $\\frac{120}{x} - \\frac{120}{x + 2} = 2 \\iff \\frac{60}{x} - \\frac{60}{x + 2} = 1 \\iff 60(x + 2) - 60x = x(x + 2) \\iff x^2 + 2x - 120 = 0$. Giải phương trình: $x_1 = 10$ (thỏa mãn), $x_2 = -12$ (loại). Vậy mỗi ngày dự định đóng $10$ bộ.'
      }
    },
    {
      stepTitle: '3. Bài toán Hình học & Tài chính / Lãi suất Kép thực tế',
      stepType: 'example',
      conceptSection:
        'Ngoài chuyển động và năng suất, đề thi hiện đại thường lồng ghép bài toán thực tế về diện tích mảnh đất hình chữ nhật (tăng giảm chiều dài/rộng), lãi suất ngân hàng hoặc mua chung chia tiền.',
      formulaSection: {
        primaryFormula: 'A_n = A_0 \\left(1 + r\\right)^n \\quad (\\text{lãi kép } n \\text{ kỳ hạn})',
        secondaryFormulas: [
          '(x + \\Delta x)(y + \\Delta y) = xy + \\Delta S \\quad (\\text{hình chữ nhật})',
          '\\text{Số tiền giảm } p\\% \\text{ lần 1, } q\\% \\text{ lần 2: } P_0(1 - 0{,}01p)(1 - 0{,}01q)'
        ],
        variablesNote:
          '• Với mảnh đất hình chữ nhật: nếu biết chu vi $2(x+y) = C$ hoặc đường chéo $\\sqrt{x^2 + y^2} = d$, gọi 1 cạnh là $x$ (cạnh kia $C/2 - x$) để thu về phương trình bậc hai rất gọn.\n• Điều kiện độ dài cạnh luôn là $0 < x < \\text{nửa chu vi}$.'
      },
      deepDiveSection:
        'Trong bài toán giảm giá hai lần liên tiếp $x\\%$ (ví dụ giá niêm yết $1.000.000$đ giảm hai lần đều $x\\%$ còn $810.000$đ), phương trình chuẩn là $1.000.000(1 - \\frac{x}{100})^2 = 810.000$, chú ý điều kiện $0 < x < 100$.',
      teacherExplanation: 'Khi giảm giá hoặc tăng trưởng $x\\%$ qua 2 kỳ liên tiếp, ta nhân liên tiếp với $(1 \\pm \\frac{x}{100})^2$ chứ không cộng $2x\\%$.',
      keyTakeaway: 'Phân biệt tăng/giảm phần trăm kép $(1 \\pm r)^2$ với tăng/giảm đơn; kiểm tra kỹ $0 < x < 100$.',
      miniQuiz: [
        {
          id: 'm912-s3-q1',
          question: 'Một món hàng giá $500.000\\text{ đ}$ được giảm giá liên tiếp $2$ lần cùng một tỉ lệ $x\\%$ thì giá còn $405.000\\text{ đ}$. Tìm $x$.',
          options: ['A. $10\\%$', 'B. $9{,}5\\%$', 'C. $15\\%$', 'D. $20\\%$'],
          correctIndex: 0,
          explanation: '$(1 - \\frac{x}{100})^2 = \\frac{405}{500} = 0{,}81 \\implies 1 - \\frac{x}{100} = 0{,}9 \\implies x = 10\\%$.'
        },
        {
          id: 'm912-s3-q2',
          question: 'Một mảnh đất hình chữ nhật có chu vi $34\\text{ m}$ và đường chéo dài $13\\text{ m}$. Diện tích mảnh đất đó là:',
          options: ['A. $60\\text{ m}^2$', 'B. $65\\text{ m}^2$', 'C. $72\\text{ m}^2$', 'D. $56\\text{ m}^2$'],
          correctIndex: 0,
          explanation: '$a + b = 17$, $a^2 + b^2 = 169 \\implies 2ab = 17^2 - 169 = 120 \\implies S = ab = 60\\text{ m}^2$.'
        }
      ],
      miniEssay: {
        id: 'm912-s3-e1',
        question: 'Một hình chữ nhật có diện tích $160\\text{ m}^2$. Nếu tăng chiều rộng thêm $2\\text{ m}$ và giảm chiều dài đi $4\\text{ m}$ thì mảnh đất trở thành hình vuông. Tính chu vi mảnh đất ban đầu.',
        hint: 'Gọi chiều dài $x$, chiều rộng $y$ ($x > y > 0$). Từ giả thiết thành hình vuông suy ra $y + 2 = x - 4 \\implies y = x - 6$, thay vào $xy = 160$.',
        rubricChecklist: [
          'Lập đúng hệ $xy = 160$ và $x - 4 = y + 2 \\implies y = x - 6$.',
          'Giải phương trình $x(x - 6) = 160 \\iff x^2 - 6x - 160 = 0$ ra $x = 16, y = 10$.',
          'Tính đúng chu vi ban đầu $P = 2(16 + 10) = 52\\text{ m}$.'
        ],
        sampleAnswer:
          'Gọi chiều dài và chiều rộng ban đầu của mảnh đất lần lượt là $x, y$ ($\\text{m}$, $x > y > 0$). Diện tích ban đầu: $xy = 160$. Khi giảm chiều dài $4\\text{ m}$ và tăng chiều rộng $2\\text{ m}$ được hình vuông nên $x - 4 = y + 2 \\implies y = x - 6$. Thay vào phương trình diện tích: $x(x - 6) = 160 \\iff x^2 - 6x - 160 = 0 \\iff (x - 16)(x + 10) = 0$. Vì $x > 0$ nên $x = 16\\text{ m}$, suy ra $y = 10\\text{ m}$. Chu vi mảnh đất ban đầu là $2(16 + 10) = 52\\text{ m}$.'
      }
    }
  ]
};
