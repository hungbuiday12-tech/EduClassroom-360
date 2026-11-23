import { LectureStep } from '../types';

export const PHYSICS_CUSTOM_LECTURE_STEPS_11: Record<string, LectureStep[]> = {
  'phys-11-wave': [
    {
      stepTitle: '1. Sóng cơ, Bước sóng & Phương trình Truyền sóng',
      stepType: 'concept',
      conceptSection:
        'Sóng cơ là dao động cơ học lan truyền trong môi trường vật chất đàn hồi (rắn, lỏng, khí; **không truyền được trong chân không**). Quá trình truyền sóng là truyền **pha dao động** và **năng lượng**, còn các phần tử vật chất chỉ dao động tại chỗ quanh vị trí cân bằng.',
      formulaSection: {
        primaryFormula: '\\lambda = v\\cdot T = \\frac{v}{f}, \\qquad u(x,t) = A\\cos\\left(\\omega t - \\frac{2\\pi x}{\\lambda}\\right)',
        secondaryFormulas: [
          '\\Delta\\varphi = \\frac{2\\pi d}{\\lambda}',
          'v_{\\text{rắn}} > v_{\\text{lỏng}} > v_{\\text{khí}}'
        ],
        variablesNote:
          '• $\\lambda$: bước sóng — quãng đường sóng truyền đi trong 1 chu kì, hoặc khoảng cách ngắn nhất giữa 2 điểm dao động cùng pha trên cùng phương truyền.\n• Sóng ngang: phương dao động $\\perp$ phương truyền (chỉ truyền ở chất rắn và mặt chất lỏng). Sóng dọc: phương dao động $\\parallel$ phương truyền.'
      },
      deepDiveSection:
        'Phân biệt hai vận tốc hay bị đánh lừa:\n• **Tốc độ truyền sóng** $v = \\lambda f$: hằng số chỉ phụ thuộc vào bản chất và nhiệt độ môi trường.\n• **Vận tốc dao động cực đại của phần tử môi trường**: $v_{\\max} = \\omega A = 2\\pi f A$ (phụ thuộc biên độ và tần số).',
      teacherExplanation:
        'Độ lệch pha $\\Delta\\varphi = 2\\pi d/\\lambda$ là chìa khóa xác định hai điểm cùng pha ($d = k\\lambda$), ngược pha ($d = (k + 0{,}5)\\lambda$) hay vuông pha.',
      keyTakeaway: 'Tần số sóng $f$ không đổi khi truyền qua các môi trường; chỉ tốc độ $v$ và bước sóng $\\lambda$ đổi.',
      miniQuiz: [
        {
          id: 'p11wv-s1-q1',
          question: 'Một sóng cơ có tần số $f = 20\\text{ Hz}$ truyền trên mặt nước với tốc độ $v = 1{,}6\\text{ m/s}$. Bước sóng bằng:',
          options: ['A. $32\\text{ m}$', 'B. $8\\text{ cm}$', 'C. $12{,}5\\text{ cm}$', 'D. $0{,}8\\text{ m}$'],
          correctIndex: 1,
          explanation: '$\\lambda = \\frac{v}{f} = \\frac{1{,}6}{20} = 0{,}08\\text{ m} = 8\\text{ cm}$.'
        },
        {
          id: 'p11wv-s1-q2',
          question: 'Phát biểu nào sau đây SAI về sóng cơ?',
          options: [
            'A. Sóng dọc truyền được trong rắn, lỏng, khí',
            'B. Sóng cơ truyền được trong chân không với tốc độ $3\\cdot 10^8\\text{ m/s}$',
            'C. Quá trình truyền sóng là quá trình truyền năng lượng',
            'D. Tần số sóng không thay đổi khi truyền từ không khí vào nước'
          ],
          correctIndex: 1,
          explanation: 'Sóng cơ cần môi trường đàn hồi nên không truyền được trong chân không (đó là tính chất của sóng điện từ).'
        }
      ],
      miniEssay: {
        id: 'p11wv-s1-e1',
        question: 'Sóng truyền theo trục $Ox$ với $f = 50\\text{ Hz}$, tốc độ $2\\text{ m/s}$. Tính độ lệch pha giữa hai điểm cách nhau $d = 11\\text{ cm}$ trên cùng phương truyền sóng.',
        hint: 'Tính bước sóng $\\lambda = v/f$, sau đó thay vào $\\Delta\\varphi = \\frac{2\\pi d}{\\lambda}$.',
        rubricChecklist: [
          'Tính đúng $\\lambda = 2/50 = 0{,}04\\text{ m} = 4\\text{ cm}$.',
          'Tính $\\Delta\\varphi = \\frac{2\\pi \\cdot 11}{4} = 5{,}5\\pi\\text{ rad}$ (tức vuông pha).'
        ],
        sampleAnswer: 'Bước sóng là $\\lambda = \\frac{v}{f} = \\frac{2}{50} = 0{,}04\\text{ m} = 4\\text{ cm}$. Độ lệch pha giữa hai điểm cách nhau $d = 11\\text{ cm}$ là $\\Delta\\varphi = \\frac{2\\pi d}{\\lambda} = \\frac{2\\pi \\cdot 11}{4} = 5{,}5\\pi = 4\\pi + \\frac{3\\pi}{2}\\text{ rad}$ (hai điểm dao động vuông pha).'
      }
    },
    {
      stepTitle: '2. Giao thoa Hai nguồn Kết hợp & Điều kiện Cực đại/Cực tiểu',
      stepType: 'derivation',
      conceptSection:
        'Giao thoa là hiện tượng hai sóng kết hợp (cùng tần số và hiệu số pha không đổi theo thời gian) gặp nhau, tổng hợp tạo nên các vân giao thoa ổn định xen kẽ cực đại (dao động mạnh) và cực tiểu (đứng yên).',
      formulaSection: {
        primaryFormula: '\\text{Cùng pha: } d_2 - d_1 = k\\lambda \\text{ (CĐ)}, \\qquad d_2 - d_1 = \\left(k + \\frac{1}{2}\\right)\\lambda \\text{ (CT)}',
        secondaryFormulas: [
          'A_M = 2A\\left|\\cos\\frac{\\pi(d_2 - d_1)}{\\lambda}\\right|',
          '\\text{Số cực đại giữa } S_1S_2: -\\frac{S_1S_2}{\\lambda} < k < \\frac{S_1S_2}{\\lambda}'
        ],
        variablesNote:
          '• $d_1, d_2$: khoảng cách từ điểm $M$ tới hai nguồn $S_1, S_2$.\n• Khoảng cách giữa hai cực đại (hoặc hai cực tiểu) liên tiếp trên đoạn nối hai nguồn là $\\frac{\\lambda}{2}$.\n• Nếu hai nguồn **ngược pha**, điều kiện cực đại và cực tiểu đảo ngược lại.'
      },
      deepDiveSection:
        'Đường trung trực của đoạn thẳng nối hai nguồn cùng pha luôn là vân cực đại trung tâm ($k = 0$), còn các vân bậc $k \\ne 0$ là các đường hypebol nhận $S_1, S_2$ làm tiêu điểm.',
      teacherExplanation:
        'Khi đếm số cực đại trên đoạn $S_1S_2$, chặn bất đẳng thức $-S_1S_2/\\lambda < k < S_1S_2/\\lambda$ (dấu ngặt, không tính hai nguồn).',
      keyTakeaway: 'Trên đoạn nối hai nguồn cùng pha, khoảng cách giữa hai cực đại liên tiếp luôn đúng bằng $\\lambda/2$.',
      miniQuiz: [
        {
          id: 'p11wv-s2-q1',
          question: 'Tại mặt nước có hai nguồn kết hợp cùng pha $S_1, S_2$ phát sóng bước sóng $\\lambda = 4\\text{ cm}$. Điểm M cách $S_1, S_2$ lần lượt $20\\text{ cm}$ và $14\\text{ cm}$ thuộc vân nào?',
          options: ['A. Cực đại bậc 1', 'B. Cực đại bậc 2', 'C. Cực tiểu thứ 2 ($k=1$)', 'D. Cực tiểu thứ 3'],
          correctIndex: 2,
          explanation: '$d_1 - d_2 = 20 - 14 = 6\\text{ cm} = 1{,}5\\lambda = (1 + 0{,}5)\\lambda \\implies$ cực tiểu thứ 2 kể từ trung trực.'
        },
        {
          id: 'p11wv-s2-q2',
          question: 'Hai nguồn kết hợp cùng pha đặt cách nhau $10\\text{ cm}$, bước sóng $\\lambda = 2{,}4\\text{ cm}$. Số điểm cực đại giao thoa trên đoạn thẳng $S_1S_2$ là:',
          options: ['A. 7', 'B. 9', 'C. 8', 'D. 11'],
          correctIndex: 1,
          explanation: '$-\\frac{10}{2{,}4} < k < \\frac{10}{2{,}4} \\iff -4{,}16 < k < 4{,}16 \\implies k \\in \\{-4,\\dots, 4\\}$, có $9$ giá trị.'
        }
      ],
      miniEssay: {
        id: 'p11wv-s2-e1',
        question: 'Giải thích vì sao hai bóng đèn sợi đốt đặt cạnh nhau không tạo được hệ vân giao thoa ổn định trên tường như hai loa phát cùng một âm thanh từ một máy phát.',
        hint: 'Xét điều kiện hai nguồn kết hợp (tần số bằng nhau và hiệu số pha không đổi).',
        rubricChecklist: [
          'Hai loa dùng chung máy phát nên phát sóng kết hợp (cùng tần số, độ lệch pha không đổi).',
          'Hai bóng đèn phát ánh sáng độc lập từ các nguyên tử riêng rẽ nên pha ban đầu biến đổi hỗn loạn liên tục.'
        ],
        sampleAnswer: 'Để có giao thoa ổn định, hai nguồn phải là hai nguồn kết hợp (cùng tần số và độ lệch pha không đổi theo thời gian). Hai loa nối chung một máy phát đáp ứng điều kiện này. Ngược lại, ánh sáng từ hai bóng đèn độc lập phát ra từng đợt ngẫu nhiên nên hiệu số pha thay đổi liên tục hàng triệu lần mỗi giây, các vân sáng tối xóa nhòa nhau.'
      }
    },
    {
      stepTitle: '3. Sóng điện từ, Thang sóng điện từ & Bước sóng Ánh sáng',
      stepType: 'example',
      conceptSection:
        'Khác với sóng cơ, **sóng điện từ** là điện từ trường lan truyền trong không gian, truyền được cả trong chân không với tốc độ ánh sáng $c = 3\\cdot 10^8\\text{ m/s}$ và là sóng ngang.',
      formulaSection: {
        primaryFormula: '\\lambda = c\\cdot T = \\frac{c}{f} \\quad (c = 3\\cdot 10^8\\text{ m/s})',
        secondaryFormulas: [
          '\\text{Ánh sáng khả kiến: } 380\\text{ nm} \\le \\lambda \\le 760\\text{ nm}'
        ],
        variablesNote:
          '• Thang sóng điện từ xếp theo bước sóng **giảm dần** (tần số & năng lượng **tăng dần**): Sóng vô tuyến $\\to$ Hồng ngoại $\\to$ Ánh sáng nhìn thấy $\\to$ Tử ngoại $\\to$ Tia X $\\to$ Tia Gamma.'
      },
      deepDiveSection:
        'Trong sóng điện từ tại một điểm, vectơ cường độ điện trường $\\vec{E}$ và vectơ cảm ứng từ $\\vec{B}$ luôn vuông góc với nhau, vuông góc với phương truyền sóng, và **dao động cùng pha** với nhau.',
      teacherExplanation:
        'Nhớ câu thần chú thứ tự thang sóng điện từ: Vô tuyến – Hồng – Thấy – Tím (Tử ngoại) – X – Gamma.',
      keyTakeaway: 'Mọi bức xạ điện từ đều truyền trong chân không cùng tốc độ $c = 3\\cdot 10^8\\text{ m/s}$ và là sóng ngang.',
      miniQuiz: [
        {
          id: 'p11wv-s3-q1',
          question: 'Đài FM phát sóng có tần số $100\\text{ MHz}$ ($10^8\\text{ Hz}$). Bước sóng của sóng vô tuyến này trong không khí bằng:',
          options: ['A. $30\\text{ m}$', 'B. $3\\text{ m}$', 'C. $0{,}3\\text{ m}$', 'D. $300\\text{ m}$'],
          correctIndex: 1,
          explanation: '$\\lambda = \\frac{c}{f} = \\frac{3\\cdot 10^8}{10^8} = 3\\text{ m}$.'
        },
        {
          id: 'p11wv-s3-q2',
          question: 'Sắp xếp nào sau đây đúng theo thứ tự BƯỚC SÓNG GIẢM DẦN?',
          options: [
            'A. Tia X, Tử ngoại, Ánh sáng nhìn thấy, Hồng ngoại',
            'B. Sóng vô tuyến, Hồng ngoại, Ánh sáng nhìn thấy, Tia X',
            'C. Tia Gamma, Tia X, Hồng ngoại, Sóng vô tuyến',
            'D. Ánh sáng nhìn thấy, Tử ngoại, Hồng ngoại, Tia X'
          ],
          correctIndex: 1,
          explanation: 'Sóng vô tuyến có $\\lambda$ lớn nhất (mét–km), sau đó giảm dần qua Hồng ngoại, Ánh sáng thấy, rồi tới Tia X ($10^{-10}\\text{ m}$).'
        }
      ],
      miniEssay: {
        id: 'p11wv-s3-e1',
        question: 'So sánh 2 điểm khác biệt cốt lõi giữa sóng âm (sóng cơ) và sóng điện từ khi truyền từ không khí vào nước.',
        hint: 'So sánh về tốc độ truyền sóng và khả năng truyền trong chân không.',
        rubricChecklist: [
          'Sóng âm truyền trong nước nhanh hơn trong không khí ($v_{\\text{nước}} > v_{\\text{kk}}$); sóng điện từ truyền trong nước chậm hơn ($c/n < c$).',
          'Sóng âm không truyền được trong chân không, sóng điện từ truyền tốt trong chân không.'
        ],
        sampleAnswer: '1) Về môi trường: sóng âm không truyền được trong chân không còn sóng điện từ truyền tốt với tốc độ $3\\cdot 10^8\\text{ m/s}$. 2) Khi từ không khí đi vào nước: tốc độ sóng âm tăng lên mạnh (từ $\\approx 340\\text{ m/s}$ lên $\\approx 1500\\text{ m/s}$), còn tốc độ sóng điện từ giảm đi ($v = c/n$ với chiết suất $n > 1$).'
      }
    }
  ],
  'phys-11-efield': [
    {
      stepTitle: '1. Định luật Coulomb & Cường độ Điện trường',
      stepType: 'concept',
      conceptSection:
        'Hai điện tích điểm đứng yên tương tác với nhau lực hút (trái dấu) hoặc đẩy (cùng dấu) dọc theo đường thẳng nối chúng. Xung quanh mỗi điện tích tồn tại **điện trường** truyền lực điện tới các điện tích khác.',
      formulaSection: {
        primaryFormula: 'F = k\\frac{|q_1 q_2|}{\\varepsilon r^2}, \\qquad E = k\\frac{|Q|}{\\varepsilon r^2}',
        secondaryFormulas: [
          '\\vec{F} = q\\vec{E}, \\quad k = 9\\cdot 10^9\\,\\frac{\\text{N}\\cdot\\text{m}^2}{\\text{C}^2}'
        ],
        variablesNote:
          '• $\\varepsilon$: hằng số điện môi ($\\varepsilon \\ge 1$; không khí/chân không $\\varepsilon = 1$).\n• Vectơ $\\vec{E}$ do $Q > 0$ gây ra hướng **ra xa** $Q$; do $Q < 0$ hướng **lại gần** $Q$.\n• Khi đặt điện tích thử $q < 0$ vào điện trường $\\vec{E}$, lực điện $\\vec{F}$ **ngược chiều** $\\vec{E}$.'
      },
      deepDiveSection:
        'Theo nguyên lý chồng chất điện trường, cường độ điện trường tổng hợp tại điểm $M$ do nhiều điện tích gây ra là tổng vectơ $\\vec{E}_M = \\vec{E}_1 + \\vec{E}_2 + \\dots$. Để $\\vec{E}_M = \\vec{0}$, điểm $M$ phải nằm trên đường nối hai điện tích và gần điện tích có độ lớn $|Q|$ nhỏ hơn.',
      teacherExplanation:
        'Nhớ quy ước "Dương đẩy ra, Âm hút vào" khi vẽ chiều vectơ cường độ điện trường $\\vec{E}$.',
      keyTakeaway: 'Lực điện và cường độ điện trường tỉ lệ nghịch với bình phương khoảng cách ($1/r^2$) và hằng số điện môi $\\varepsilon$.',
      miniQuiz: [
        {
          id: 'p11ef-s1-q1',
          question: 'Hai điện tích điểm đặt cách nhau $r$ trong chân không tương tác lực $F$. Nếu đưa vào dầu có $\\varepsilon = 2$ và tăng khoảng cách lên $2r$ thì lực tương tác mới bằng:',
          options: ['A. $F/4$', 'B. $F/8$', 'C. $F/2$', 'D. $2F$'],
          correctIndex: 1,
          explanation: '$F\' = \\frac{F}{\\varepsilon \\cdot 2^2} = \\frac{F}{2\\cdot 4} = \\frac{F}{8}$.'
        },
        {
          id: 'p11ef-s1-q2',
          question: 'Đặt điện tích thử $q = -2\\cdot 10^{-6}\\text{ C}$ tại điểm có cường độ điện trường $E = 5000\\text{ V/m}$ hướng sang phải. Lực điện tác dụng lên $q$ có độ lớn và hướng:',
          options: [
            'A. $0{,}01\\text{ N}$, hướng sang phải',
            'B. $0{,}01\\text{ N}$, hướng sang trái',
            'C. $2500\\text{ N}$, hướng sang trái',
            'D. $0{,}02\\text{ N}$, hướng sang phải'
          ],
          correctIndex: 1,
          explanation: '$F = |q|E = 2\\cdot 10^{-6}\\cdot 5000 = 0{,}01\\text{ N}$. Vì $q < 0$ nên $\\vec{F}$ ngược chiều $\\vec{E}$ (hướng sang trái).'
        }
      ],
      miniEssay: {
        id: 'p11ef-s1-e1',
        question: 'Cho hai điện tích $q_1 = +4\\,\\mu\\text{C}$ tại A và $q_2 = +9\\,\\mu\\text{C}$ tại B cách nhau $10\\text{ cm}$ trong không khí. Tìm vị trí điểm M để cường độ điện trường tổng hợp tại M bằng 0.',
        hint: 'Vì $q_1, q_2$ cùng dấu nên M nằm trong đoạn AB và thỏa $\\frac{|q_1|}{r_1^2} = \\frac{|q_2|}{r_2^2}$.',
        rubricChecklist: [
          'Lập luận M nằm trong đoạn AB sao cho $\\vec{E}_1$ ngược chiều $\\vec{E}_2$ và $r_1 + r_2 = 10\\text{ cm}$.',
          'Giải $\\frac{r_1}{r_2} = \\sqrt{\\frac{4}{9}} = \\frac{2}{3} \\implies r_1 = 4\\text{ cm},\\ r_2 = 6\\text{ cm}$.'
        ],
        sampleAnswer: 'Để $\\vec{E}_1 + \\vec{E}_2 = \\vec{0}$, $\\vec{E}_1$ và $\\vec{E}_2$ phải ngược chiều và cùng độ lớn. Do $q_1, q_2$ cùng dấu nên M nằm trên đoạn thẳng nối AB: $r_1 + r_2 = 10\\text{ cm}$. Từ $E_1 = E_2 \\Rightarrow \\frac{4}{r_1^2} = \\frac{9}{r_2^2} \\Rightarrow \\frac{r_1}{r_2} = \\frac{2}{3}$. Giải hệ thu được $r_1 = 4\\text{ cm}$ (cách A $4\\text{ cm}$, cách B $6\\text{ cm}$).'
      }
    },
    {
      stepTitle: '2. Công của Lực điện, Điện thế & Hiệu điện thế',
      stepType: 'derivation',
      conceptSection:
        'Lực điện trường tĩnh là **lực thế**: công của lực điện khi di chuyển điện tích $q$ từ M đến N KHÔNG phụ thuộc hình dạng đường đi mà chỉ phụ thuộc vị trí điểm đầu M và điểm cuối N.',
      formulaSection: {
        primaryFormula: 'A_{MN} = q E d = q(V_M - V_N) = q U_{MN}',
        secondaryFormulas: [
          'E = \\frac{U}{d} \\quad (\\text{điện trường đều giữa 2 bản phẳng})',
          '\\text{Định lý Động năng: } \\frac{1}{2}mv_N^2 - \\frac{1}{2}mv_M^2 = q U_{MN}'
        ],
        variablesNote:
          '• $d = \\overline{M\'N\'}$: hình chiếu đại số của đoạn $MN$ lên đường sức điện (cùng chiều đường sức $\\implies d > 0$; đi vuông góc đường sức $\\implies d = 0$ và $A = 0$!).\n• Điện thế $V$ đặc trưng về mặt năng lượng tại một điểm ($1\\text{ V} = 1\\text{ J/C}$).'
      },
      deepDiveSection:
        'Khi một electron ($q = -1{,}6\\cdot 10^{-19}\\text{ C}$) được tăng tốc từ trạng thái nghỉ qua hiệu điện thế tăng $U > 0$ (từ bản âm sang bản dương), động năng nó thu được là $W_đ = |q|U$. Đơn vị năng lượng nguyên tử **eV**: $1\\text{ eV} = 1{,}6\\cdot 10^{-19}\\text{ J}$.',
      teacherExplanation:
        'Luôn kiểm tra hướng dịch chuyển so với chiều vectơ $\\vec{E}$: nếu đi vuông góc với đường sức điện thì công $A = 0$.',
      keyTakeaway: 'Công lực điện $A_{MN} = qEd$ không phụ thuộc quỹ đạo cong hay thẳng; đi khép kín thì $A = 0$.',
      miniQuiz: [
        {
          id: 'p11ef-s2-q1',
          question: 'Di chuyển điện tích $q = 2\\cdot 10^{-6}\\text{ C}$ theo một đường cong kín trong điện trường tĩnh. Công của lực điện thực hiện bằng:',
          options: ['A. Phụ thuộc chiều dài đường cong', 'B. Bằng $0$', 'C. Dương', 'D. Âm'],
          correctIndex: 1,
          explanation: 'Vì điểm đầu trùng điểm cuối ($d = 0$ hay $V_M - V_M = 0$) nên công lực điện trên đường kín luôn bằng $0$.'
        },
        {
          id: 'p11ef-s2-q2',
          question: 'Hai bản kim loại phẳng đặt song song cách nhau $d = 2\\text{ cm}$ có hiệu điện thế $U = 100\\text{ V}$. Cường độ điện trường đều giữa hai bản là:',
          options: ['A. $50\\text{ V/m}$', 'B. $200\\text{ V/m}$', 'C. $5000\\text{ V/m}$', 'D. $2\\text{ V/m}$'],
          correctIndex: 2,
          explanation: 'Đổi $d = 0{,}02\\text{ m} \\implies E = \\frac{100}{0{,}02} = 5000\\text{ V/m}$.'
        }
      ],
      miniEssay: {
        id: 'p11ef-s2-e1',
        question: 'Một electron ($m = 9{,}1\\cdot 10^{-31}\\text{ kg}, |e| = 1{,}6\\cdot 10^{-19}\\text{ C}$) bay ra từ bản âm không vận tốc đầu dưới tác dụng hiệu điện thế $U = 100\\text{ V}$ tới bản dương. Tính động năng và tốc độ lúc đập vào bản dương.',
        hint: 'Dùng định lý động năng $\\frac{1}{2}mv^2 = |e|U$.',
        rubricChecklist: [
          'Tính động năng $W_đ = 1{,}6\\cdot 10^{-19}\\cdot 100 = 1{,}6\\cdot 10^{-17}\\text{ J}$.',
          'Tính $v = \\sqrt{\\frac{2W_đ}{m}} \\approx 5{,}93\\cdot 10^6\\text{ m/s}$.'
        ],
        sampleAnswer: 'Động năng của electron khi tới bản dương là $W_đ = |e|U = 1{,}6\\cdot 10^{-19}\\cdot 100 = 1{,}6\\cdot 10^{-17}\\text{ J}$ ($= 100\\text{ eV}$). Vận tốc đạt được là $v = \\sqrt{\\frac{2\\cdot 1{,}6\\cdot 10^{-17}}{9{,}1\\cdot 10^{-31}}} \\approx 5{,}93\\cdot 10^6\\text{ m/s}$.'
      }
    },
    {
      stepTitle: '3. Tụ điện, Ghép tụ & Chuyển động Điện tích trong Điện trường',
      stepType: 'example',
      conceptSection:
        'Tụ điện tích trữ năng lượng dưới dạng năng lượng điện trường. Trong mạch một chiều ổn định, tụ điện **ngăn dòng điện một chiều** nhưng cho dòng xoay chiều đi qua.',
      formulaSection: {
        primaryFormula: 'Q = C\\cdot U, \\qquad W = \\frac{1}{2}CU^2 = \\frac{Q^2}{2C}',
        secondaryFormulas: [
          '\\text{Song song: } C_b = C_1 + C_2, \\qquad \\text{Nối tiếp: } \\frac{1}{C_b} = \\frac{1}{C_1} + \\frac{1}{C_2}'
        ],
        variablesNote:
          '• Điện dung $C$ đo bằng Fara ($\\text{F}$); $1\\,\\mu\\text{F} = 10^{-6}\\text{ F}$, $1\\text{ nF} = 10^{-9}\\text{ F}$, $1\\text{ pF} = 10^{-12}\\text{ F}$.\n• Điện dung $C$ là hằng số hình học của tụ ($C = \\frac{\\varepsilon S}{4\\pi k d}$), KHÔNG phụ thuộc $Q$ hay $U$.'
      },
      deepDiveSection:
        'Khi hạt mang điện $q$ bay vuông góc vào khoảng giữa hai bản tụ phẳng, nó chuyển động như bài toán **ném ngang**: phương song song bản giữ vận tốc đều $v_0$, phương vuông góc bản có gia tốc không đổi $a = \\frac{|q|E}{m}$ uốn cong quỹ đạo thành parabol.',
      teacherExplanation:
        'Chú ý hai tình huống kinh điển: Nếu tụ **vẫn nối nguồn**, $U$ giữ nguyên; nếu tụ **đã ngắt nguồn**, điện tích $Q$ trên hai bản bảo toàn không đổi.',
      keyTakeaway: 'Ghép song song điện dung tăng ($C = C_1 + C_2$); ghép nối tiếp điện dung giảm ($1/C = 1/C_1 + 1/C_2$).',
      miniQuiz: [
        {
          id: 'p11ef-s3-q1',
          question: 'Tụ điện $C = 20\\,\\mu\\text{F}$ được nạp dưới hiệu điện thế $U = 100\\text{ V}$. Năng lượng điện trường tích trữ trong tụ là:',
          options: ['A. $0{,}1\\text{ J}$', 'B. $0{,}2\\text{ J}$', 'C. $2\\cdot 10^{-3}\\text{ J}$', 'D. $1\\text{ J}$'],
          correctIndex: 0,
          explanation: '$W = \\frac{1}{2}CU^2 = \\frac{1}{2}\\cdot 20\\cdot 10^{-6}\\cdot 100^2 = 0{,}1\\text{ J}$.'
        },
        {
          id: 'p11ef-s3-q2',
          question: 'Hai tụ điện $C_1 = 6\\,\\mu\\text{F}$ và $C_2 = 3\\,\\mu\\text{F}$ ghép nối tiếp nhau có điện dung tương đương bằng:',
          options: ['A. $9\\,\\mu\\text{F}$', 'B. $2\\,\\mu\\text{F}$', 'C. $4{,}5\\,\\mu\\text{F}$', 'D. $18\\,\\mu\\text{F}$'],
          correctIndex: 1,
          explanation: '$C_b = \\frac{6\\cdot 3}{6 + 3} = 2\\,\\mu\\text{F}$.'
        }
      ],
      miniEssay: {
        id: 'p11ef-s3-e1',
        question: 'Nạp tụ phẳng không khí đến hiệu điện thế $U_0 = 200\\text{ V}$ rồi ngắt khỏi nguồn. Sau đó kéo hai bản tụ ra xa gấp đôi. Hỏi hiệu điện thế $U$ và năng lượng tụ thay đổi thế nào?',
        hint: 'Ngắt nguồn $\\implies Q$ không đổi. Khoảng cách $d$ tăng 2 lần $\\implies C$ giảm 2 lần.',
        rubricChecklist: [
          'Chỉ ra $Q$ không đổi và $C \\propto 1/d$ giảm 2 lần.',
          'Kết luận $U = Q/C$ tăng gấp đôi lên $400\\text{ V}$, và $W = Q^2/(2C)$ tăng gấp đôi (do lực tay kéo thắng lực hút giữa hai bản).'
        ],
        sampleAnswer: 'Sau khi ngắt nguồn, điện tích $Q$ trên bản tụ cô lập được bảo toàn. Khi tăng khoảng cách $d$ lên 2 lần, điện dung $C = \\frac{\\varepsilon S}{4\\pi kd}$ giảm đi một nửa ($C\' = C/2$). Do đó hiệu điện thế $U\' = Q/C\' = 2U_0 = 400\\text{ V}$ tăng gấp đôi, và năng lượng tụ $W\' = \\frac{Q^2}{2C\'} = 2W$ cũng tăng gấp đôi (chính bằng công tay ta thực hiện để kéo hai bản tụ hút nhau ra xa).'
      }
    }
  ],
  'phys-11-dc': [
    {
      stepTitle: '1. Cường độ Dòng điện, Vận tốc trôi & Điện trở',
      stepType: 'concept',
      conceptSection:
        'Dòng điện là dòng dịch chuyển có hướng của các hạt mang điện tự do (electron tự do trong kim loại, ion dương/âm trong chất điện phân). Quy ước chiều dòng điện ngược chiều dịch chuyển của electron.',
      formulaSection: {
        primaryFormula: 'I = \\frac{\\Delta q}{\\Delta t} = n S v |e|, \\qquad R = \\rho\\frac{l}{S}',
        secondaryFormulas: [
          '1\\text{ A} = 1\\text{ C/s}, \\quad v_{\\text{trôi}} = \\frac{I}{n S |e|}'
        ],
        variablesNote:
          '• $n$: mật độ hạt tải điện ($\\text{m}^{-3}$); $S$: tiết diện dây ($\\text{m}^2$); $v$: tốc độ dịch chuyển có hướng (vận tốc trôi, thường rất nhỏ cỡ $\\text{mm/s}$).\n• Điện trở kim loại tăng theo nhiệt độ: $R = R_0[1 + \\alpha(t - t_0)]$.'
      },
      deepDiveSection:
        'Tại sao khi bật công tắc, đèn sáng gần như tức thì dù vận tốc trôi của electron trong dây đồng chỉ chưa tới $1\\text{ mm/s}$? Vì **điện trường** thiết lập dọc dây dẫn lan truyền với tốc độ gần bằng tốc độ ánh sáng, đẩy đồng loạt các electron có sẵn trong dây cùng dịch chuyển.',
      teacherExplanation:
        'Nhớ công thức $I = nSv|e|$ — đây là công thức trọng tâm mới của Chương trình GDPT 2018 Vật lí 11.',
      keyTakeaway: 'Tín hiệu điện trường truyền gần bằng tốc độ ánh sáng, còn vận tốc trôi electron chỉ cỡ vài mm/s.',
      miniQuiz: [
        {
          id: 'p11dc-s1-q1',
          question: 'Trong $10\\text{ s}$, điện lượng chuyển qua tiết diện thẳng một dây dẫn là $25\\text{ C}$. Cường độ dòng điện không đổi trong dây là:',
          options: ['A. $250\\text{ A}$', 'B. $2{,}5\\text{ A}$', 'C. $0{,}4\\text{ A}$', 'D. $2{,}5\\text{ mA}$'],
          correctIndex: 1,
          explanation: '$I = \\frac{\\Delta q}{\\Delta t} = \\frac{25}{10} = 2{,}5\\text{ A}$.'
        },
        {
          id: 'p11dc-s1-q2',
          question: 'Trong dây đồng tiết diện $S = 1\\text{ mm}^2$ ($10^{-6}\\text{ m}^2$) có mật độ electron $n = 8{,}5\\cdot 10^{28}\\text{ m}^{-3}$ mang dòng $I = 1{,}36\\text{ A}$. Tốc độ trôi của electron gần bằng:',
          options: ['A. $10^6\\text{ m/s}$', 'B. $0{,}1\\text{ mm/s}$', 'C. $1\\text{ m/s}$', 'D. $10\\text{ cm/s}$'],
          correctIndex: 1,
          explanation: '$v = \\frac{1{,}36}{8{,}5\\cdot 10^{28}\\cdot 10^{-6}\\cdot 1{,}6\\cdot 10^{-19}} = 10^{-4}\\text{ m/s} = 0{,}1\\text{ mm/s}$.'
        }
      ],
      miniEssay: {
        id: 'p11dc-s1-e1',
        question: 'So sánh đường đặc trưng Vôn – Ampe của điện trở kim loại ở nhiệt độ không đổi và của đèn sợi đốt khi tăng hiệu điện thế.',
        hint: 'Đèn sợi đốt nóng lên mạnh khi $U$ tăng làm điện trở dây tóc thay đổi.',
        rubricChecklist: [
          'Điện trở chuẩn (nhiệt độ ổn định) có đồ thị $I - U$ là đường thẳng qua gốc tọa độ (tuân theo định luật Ôm $R = \\text{const}$).',
          'Đèn sợi đốt nóng lên làm $R$ tăng theo nhiệt độ nên đường $I - U$ cong thoải dần xuống trục $U$.'
        ],
        sampleAnswer: 'Ở điện trở kim loại có nhiệt độ không đổi, $I$ tỉ lệ thuận với $U$ nên đường đặc trưng Vôn – Ampe là đường thẳng đi qua gốc tọa độ. Đối với bóng đèn sợi đốt, khi $U$ tăng, dòng điện làm dây tóc vonfram nóng lên tới hàng nghìn độ khiến điện trở $R$ tăng mạnh, làm cường độ $I$ tăng chậm hơn tỉ lệ thuận và đồ thị cong dần về phía trục $U$.'
      }
    },
    {
      stepTitle: '2. Suất điện động Nguồn & Định luật Ôm Toàn mạch',
      stepType: 'derivation',
      conceptSection:
        'Nguồn điện duy trì hiệu điện thế giữa hai cực nhờ **lực lạ** thực hiện công tách và dịch chuyển các điện tích bên trong nguồn. Suất điện động $\\mathscr{E}$ đặc trưng cho khả năng sinh công của nguồn điện.',
      formulaSection: {
        primaryFormula: 'I = \\frac{\\mathscr{E}}{R_N + r}, \\qquad U_N = \\mathscr{E} - I r = I R_N',
        secondaryFormulas: [
          '\\text{Ghép nối tiếp } n \\text{ nguồn: } \\mathscr{E}_b = \\sum \\mathscr{E}_i,\\ r_b = \\sum r_i',
          '\\text{Hiệu suất nguồn: } H = \\frac{U_N}{\\mathscr{E}} = \\frac{R_N}{R_N + r}'
        ],
        variablesNote:
          '• $\\mathscr{E}$ ($\\text{V}$): suất điện động; $r$ ($\\Omega$): điện trở trong của nguồn; $R_N$: điện trở tương đương mạch ngoài.\n• Khi đo trực tiếp hai cực pin hở mạch ($I = 0$), vôn kế lý tưởng chỉ đúng $\\mathscr{E}$. Khi xảy ra **đoản mạch** ($R_N = 0$), dòng đạt cực đại $I_{\\max} = \\mathscr{E}/r$ dễ gây cháy nổ.'
      },
      deepDiveSection:
        'Chú ý quan hệ giữa công suất mạch ngoài và biến trở $R$: công suất tỏa nhiệt mạch ngoài $P_N = I^2 R = \\frac{\\mathscr{E}^2 R}{(R+r)^2}$ đạt **cực đại** $P_{N\\max} = \\frac{\\mathscr{E}^2}{4r}$ khi điện trở ngoài khớp với điện trở trong ($R = r$), lúc đó hiệu suất nguồn đạt $50\\%$.',
      teacherExplanation:
        'Không nhầm $\\mathscr{E}$ với $U_N$: hiệu điện thế hai cực nguồn đang phát dòng luôn nhỏ hơn $\\mathscr{E}$ một lượng độ giảm thế trong $I r$.',
      keyTakeaway: '$U_N = \\mathscr{E} - Ir$; công suất mạch ngoài đạt cực đại khi $R_N = r$.',
      miniQuiz: [
        {
          id: 'p11dc-s2-q1',
          question: 'Nguồn điện có $\\mathscr{E} = 12\\text{ V}, r = 1\\,\\Omega$ mắc với điện trở ngoài $R = 5\\,\\Omega$. Hiệu điện thế hai đầu $R$ là:',
          options: ['A. $12\\text{ V}$', 'B. $10\\text{ V}$', 'C. $2\\text{ V}$', 'D. $6\\text{ V}$'],
          correctIndex: 1,
          explanation: '$I = \\frac{12}{5 + 1} = 2\\text{ A} \\implies U_N = I R = 2\\cdot 5 = 10\\text{ V}$.'
        },
        {
          id: 'p11dc-s2-q2',
          question: 'Với nguồn điện có $\\mathscr{E} = 6\\text{ V}, r = 1{,}5\\,\\Omega$, công suất mạch ngoài đạt cực đại bằng bao nhiêu khi điều chỉnh biến trở $R$?',
          options: ['A. $6\\text{ W}$', 'B. $12\\text{ W}$', 'C. $24\\text{ W}$', 'D. $9\\text{ W}$'],
          correctIndex: 0,
          explanation: '$P_{\\max} = \\frac{\\mathscr{E}^2}{4r} = \\frac{36}{4\\cdot 1{,}5} = 6\\text{ W}$ (tại $R = 1{,}5\\,\\Omega$).'
        }
      ],
      miniEssay: {
        id: 'p11dc-s2-e1',
        question: 'Một nguồn điện nối biến trở $R$. Khi $R_1 = 2\\,\\Omega$ hoặc $R_2 = 8\\,\\Omega$ thì công suất mạch ngoài như nhau. Tính điện trở trong $r$ của nguồn.',
        hint: 'Theo tính chất đối xứng đường cong công suất mạch ngoài: nếu $P(R_1) = P(R_2)$ thì $R_1 R_2 = r^2$.',
        rubricChecklist: [
          'Viết phương trình $\\frac{\\mathscr{E}^2 R_1}{(R_1+r)^2} = \\frac{\\mathscr{E}^2 R_2}{(R_2+r)^2}$.',
          'Rút gọn tìm ra $r = \\sqrt{R_1 R_2} = \\sqrt{2\\cdot 8} = 4\\,\\Omega$.'
        ],
        sampleAnswer: 'Từ $P_1 = P_2 \\Rightarrow \\frac{R_1}{(R_1+r)^2} = \\frac{R_2}{(R_2+r)^2} \\Rightarrow R_1(R_2^2 + 2rR_2 + r^2) = R_2(R_1^2 + 2rR_1 + r^2) \\Rightarrow (R_2 - R_1)r^2 = R_1 R_2(R_2 - R_1) \\Rightarrow r = \\sqrt{R_1 R_2} = \\sqrt{2\\times 8} = 4\\,\\Omega$.'
      }
    },
    {
      stepTitle: '3. Công, Công suất Nguồn điện & Quy tắc Tìm nhánh Mạch điện',
      stepType: 'example',
      conceptSection:
        'Năng lượng toàn phần nguồn điện cung cấp được phân chia thành điện năng tiêu thụ ở mạch ngoài và nhiệt lượng hao phí bên trong chính điện trở trong $r$ của nguồn.',
      formulaSection: {
        primaryFormula: 'A_{\\text{ng}} = \\mathscr{E} I t, \\qquad P_{\\text{ng}} = \\mathscr{E} I = I^2(R_N + r)',
        secondaryFormulas: [
          'A_{\\text{ngoài}} = U_N I t = I^2 R_N t'
        ],
        variablesNote:
          '• Nếu trong mạch có **máy thu điện** (ắc quy đang nạp, động cơ điện) có suất phản điện $\\mathscr{E}\'$, cường độ dòng nạp là $I = \\frac{\\mathscr{E} - \\mathscr{E}\'}{R + r + r\'}$.'
      },
      deepDiveSection:
        'Kỹ thuật giải mạch hỗn hợp nhanh: bước 1 luôn vẽ lại mạch theo các nút có cùng điện thế (điểm nối dây dẫn lý tưởng có thể chập lại làm một điểm); bước 2 tính $R_{\\text{tđ}}$ từ nhánh trong cùng ra ngoài; bước 3 tính $I$ mạch chính rồi tỏa ngược lại các nhánh song song.',
      teacherExplanation:
        'Ampe kế lý tưởng ($R_A \\approx 0$) coi như đoạn dây dẫn chập 2 nút; Vôn kế lý tưởng ($R_V \\to \\infty$) coi như mạch hở, có thể tạm bỏ qua khi tìm điện trở tương đương.',
      keyTakeaway: 'Chập nút qua ampe kế lý tưởng, bỏ nhánh qua vôn kế lý tưởng khi tính $R_{\\text{tương đương}}$.',
      miniQuiz: [
        {
          id: 'p11dc-s3-q1',
          question: 'Nguồn điện $\\mathscr{E} = 9\\text{ V}, r = 1\\,\\Omega$ phát dòng $I = 1{,}5\\text{ A}$ trong thời gian $100\\text{ s}$. Công toàn phần của nguồn sinh ra bằng:',
          options: ['A. $900\\text{ J}$', 'B. $1350\\text{ J}$', 'C. $1125\\text{ J}$', 'D. $225\\text{ J}$'],
          correctIndex: 1,
          explanation: '$A_{\\text{ng}} = \\mathscr{E} I t = 9\\cdot 1{,}5\\cdot 100 = 1350\\text{ J}$.'
        },
        {
          id: 'p11dc-s3-q2',
          question: 'Hiệu suất của nguồn điện trong câu hỏi trên là:',
          options: ['A. $16{,}7\\%$', 'B. $75\\%$', 'C. $83{,}3\\%$', 'D. $90\\%$'],
          correctIndex: 2,
          explanation: '$U_N = \\mathscr{E} - Ir = 9 - 1{,}5\\cdot 1 = 7{,}5\\text{ V} \\implies H = \\frac{7{,}5}{9} \\approx 83{,}3\\%$.'
        }
      ],
      miniEssay: {
        id: 'p11dc-s3-e1',
        question: 'Dùng nguồn điện $\\mathscr{E} = 15\\text{ V}, r = 1\\,\\Omega$ mắc nối tiếp điện trở hạn dòng $R = 3\\,\\Omega$ để nạp cho một ắc quy có suất phản điện $\\mathscr{E}\' = 9\\text{ V}, r\' = 1\\,\\Omega$. Tính dòng điện nạp và công suất có ích tích vào ắc quy.',
        hint: 'Áp dụng $I = \\frac{\\mathscr{E} - \\mathscr{E}\'}{R + r + r\'}$ và công suất hóa năng tích lũy $P_{\\text{ích}} = \\mathscr{E}\' I$.',
        rubricChecklist: [
          'Tính dòng nạp $I = \\frac{15 - 9}{3 + 1 + 1} = 1{,}2\\text{ A}$.',
          'Tính công suất có ích $P_{\\text{ích}} = \\mathscr{E}\' I = 9\\cdot 1{,}2 = 10{,}8\\text{ W}$.'
        ],
        sampleAnswer: 'Cường độ dòng điện nạp cho ắc quy là $I = \\frac{\\mathscr{E} - \\mathscr{E}\'}{R + r + r\'} = \\frac{15 - 9}{3 + 1 + 1} = 1{,}2\\text{ A}$. Công suất có ích chuyển thành hóa năng tích trữ trong ắc quy là $P_{\\text{ích}} = \\mathscr{E}\' I = 9 \\times 1{,}2 = 10{,}8\\text{ W}$.'
      }
    }
  ],
  'phys-11-pendulum': [
    {
      stepTitle: '1. Con lắc Đơn & Điều kiện Dao động Điều hòa',
      stepType: 'concept',
      conceptSection:
        'Con lắc đơn gồm vật nhỏ khối lượng $m$ treo vào sợi dây nhẹ, không dãn dài $l$. Khi kéo lệch góc nhỏ ($\\alpha_0 \\le 10^\\circ$) và bỏ qua ma sát, con lắc dao động điều hòa.',
      formulaSection: {
        primaryFormula: 'T = 2\\pi\\sqrt{\\frac{l}{g}}, \\qquad \\omega = \\sqrt{\\frac{g}{l}}',
        secondaryFormulas: [
          's = s_0\\cos(\\omega t + \\varphi), \\qquad s_0 = l\\alpha_0\\text{ (rad)}'
        ],
        variablesNote:
          '• Chu kì $T$ của con lắc đơn **KHÔNG phụ thuộc vào khối lượng** vật nặng hay biên độ nhỏ, chỉ phụ thuộc chiều dài $l$ và gia tốc trọng trường $g$ tại nơi đặt con lắc.\n• Nhớ đổi góc biên độ từ độ sang radian trước khi dùng $s_0 = l\\alpha_0$: $\\alpha(\\text{rad}) = \\alpha^\\circ \\cdot \\frac{\\pi}{180}$.'
      },
      deepDiveSection:
        'Tại sao đồng hồ quả lắc chạy sai khi mang lên núi cao hoặc thay đổi nhiệt độ? Khi lên cao hay trời nóng làm dây dài ra ($l$ tăng) hoặc $g$ giảm, chu kì $T = 2\\pi\\sqrt{l/g}$ **tăng lên** $\\implies$ mỗi nhịp mất nhiều thời gian hơn $\\implies$ đồng hồ chạy **chậm lại**.',
      teacherExplanation:
        'Công thức nhớ nhanh: $\\Delta T/T = \\frac{1}{2}\\Delta l/l - \\frac{1}{2}\\Delta g/g$.',
      keyTakeaway: 'Chu kì con lắc đơn tỉ lệ thuận $\\sqrt{l}$ và độc lập với khối lượng vật nặng.',
      miniQuiz: [
        {
          id: 'p11pd-s1-q1',
          question: 'Tại nơi có $g = \\pi^2 \\approx 9{,}87\\text{ m/s}^2$, con lắc đơn dài $l = 1\\text{ m}$ dao động nhỏ với chu kì bằng:',
          options: ['A. $1\\text{ s}$', 'B. $2\\text{ s}$', 'C. $0{,}5\\text{ s}$', 'D. $4\\text{ s}$'],
          correctIndex: 1,
          explanation: '$T = 2\\pi\\sqrt{\\frac{1}{\\pi^2}} = 2\\text{ s}$ (con lắc gõ giây).'
        },
        {
          id: 'p11pd-s1-q2',
          question: 'Nếu tăng chiều dài dây treo con lắc đơn lên 4 lần và giữ nguyên gia tốc trọng trường $g$, chu kì dao động nhỏ sẽ:',
          options: ['A. Tăng 4 lần', 'B. Giảm 2 lần', 'C. Tăng 2 lần', 'D. Không đổi'],
          correctIndex: 2,
          explanation: '$T \\propto \\sqrt{l} \\implies l$ tăng 4 lần thì $T$ tăng $\\sqrt{4} = 2$ lần.'
        }
      ],
      miniEssay: {
        id: 'p11pd-s1-e1',
        question: 'Tại cùng một nơi, con lắc dài $l_1$ thực hiện 10 dao động trong thời gian $\\Delta t$, còn con lắc dài $l_2 = 64\\text{ cm}$ thực hiện 8 dao động cũng trong $\\Delta t$. Tính $l_1$.',
        hint: 'Từ $10 T_1 = 8 T_2 \\implies \\frac{T_1}{T_2} = \\frac{8}{10} = \\sqrt{\\frac{l_1}{l_2}}$.',
        rubricChecklist: [
          'Thiết lập đúng $10 T_1 = 8 T_2 \\implies T_1/T_2 = 0{,}8$.',
          'Bình phương $\\frac{l_1}{l_2} = 0{,}8^2 = 0{,}64 \\implies l_1 = 0{,}64 \\cdot 64 = 40{,}96\\text{ cm}$.'
        ],
        sampleAnswer: 'Trong cùng thời gian $\\Delta t = 10 T_1 = 8 T_2 \\Rightarrow \\frac{T_1}{T_2} = \\frac{8}{10} = 0{,}8$. Mặt khác $\\frac{T_1}{T_2} = \\sqrt{\\frac{l_1}{l_2}} \\Rightarrow l_1 = 0{,}8^2 \\cdot l_2 = 0{,}64 \\times 64 = 40{,}96\\text{ cm}$.'
      }
    },
    {
      stepTitle: '2. Vận tốc, Lực căng dây & Cơ năng Con lắc Đơn (góc bất kỳ)',
      stepType: 'derivation',
      conceptSection:
        'Khi con lắc đơn dao động với góc lệch bất kỳ $\\alpha_0$, cơ năng vẫn bảo toàn (nếu bỏ qua lực cản) nhưng dao động không còn điều hòa theo $\\cos$. Tại vị trí góc lệch $\\alpha$, ta tính ngay được vận tốc và lực căng dây.',
      formulaSection: {
        primaryFormula: 'v^2 = 2gl(\\cos\\alpha - \\cos\\alpha_0), \\qquad T_{\\text{căng}} = mg(3\\cos\\alpha - 2\\cos\\alpha_0)',
        secondaryFormulas: [
          'W = mgl(1 - \\cos\\alpha_0) \\approx \\frac{1}{2}mgl\\alpha_0^2 \\quad (\\text{khi } \\alpha_0 \\le 10^\\circ)'
        ],
        variablesNote:
          '• Tại vị trí cân bằng ($\\alpha = 0$): vận tốc và lực căng đạt cực đại $T_{\\max} = mg(3 - 2\\cos\\alpha_0) > P$.\n• Tại hai biên ($\\alpha = \\pm\\alpha_0$): $v = 0$ và lực căng cực tiểu $T_{\\min} = mg\\cos\\alpha_0 < P$.'
      },
      deepDiveSection:
        'Chú ý dấu hiệu rất hay hỏi trắc nghiệm: Khi qua vị trí cân bằng, dây phải chịu vừa trọng lực $P$ vừa tạo gia tốc hướng tâm $mv_{\\max}^2/l$ nên lực căng dây $T_{\\max}$ **luôn lớn hơn trọng lượng $mg$**.',
      teacherExplanation:
        'Nhớ công thức cặp đôi "3 cos alpha trừ 2 cos alpha không" cho lực căng dây — dùng được cho mọi góc lệch.',
      keyTakeaway: 'Lực căng dây cực đại ở đáy ($\\alpha = 0$) và cực tiểu ở hai biên ($\\alpha = \\pm\\alpha_0$).',
      miniQuiz: [
        {
          id: 'p11pd-s2-q1',
          question: 'Thả con lắc đơn $m = 0{,}2\\text{ kg}$ từ góc lệch $\\alpha_0 = 60^\\circ$ ($g = 10\\text{ m/s}^2$). Lực căng dây khi vật đi qua vị trí cân bằng thấp nhất là:',
          options: ['A. $2\\text{ N}$', 'B. $4\\text{ N}$', 'C. $3\\text{ N}$', 'D. $1\\text{ N}$'],
          correctIndex: 1,
          explanation: '$T_{\\max} = mg(3 - 2\\cos 60^\\circ) = 0{,}2\\cdot 10\\cdot(3 - 1) = 4\\text{ N}$.'
        },
        {
          id: 'p11pd-s2-q2',
          question: 'Ở vị trí biên của con lắc đơn ($\\alpha = \\alpha_0$), lực căng dây bằng:',
          options: ['A. $0$', 'B. $mg\\cos\\alpha_0$', 'C. $mg\\sin\\alpha_0$', 'D. $mg(3 - 2\\cos\\alpha_0)$'],
          correctIndex: 1,
          explanation: 'Tại biên $v = 0$ nên chiếu phương hướng tâm thu được $T_{\\min} = mg\\cos\\alpha_0$.'
        }
      ],
      miniEssay: {
        id: 'p11pd-s2-e1',
        question: 'Thả con lắc đơn dài $1\\text{ m}$ từ vị trí dây nằm ngang ($\\alpha_0 = 90^\\circ$, $g = 10\\text{ m/s}^2$). Tính tốc độ ở vị trí thấp nhất và lực căng dây ở đó gấp mấy lần trọng lượng vật?',
        hint: 'Thay $\\alpha = 0, \\alpha_0 = 90^\\circ$ ($\\cos 90^\\circ = 0$) vào công thức $v$ và $T_{\\text{căng}}$.',
        rubricChecklist: [
          'Tính $v_{\\max} = \\sqrt{2gl} = \\sqrt{20} = 2\\sqrt{5} \\approx 4{,}47\\text{ m/s}$.',
          'Tính $T_{\\max} = mg(3\\cdot 1 - 0) = 3mg$ (gấp 3 lần trọng lượng vật).'
        ],
        sampleAnswer: 'Tại vị trí cân bằng ($\\alpha = 0$), áp dụng bảo toàn cơ năng với $\\alpha_0 = 90^\\circ$: $v_{\\max} = \\sqrt{2gl(1 - \\cos 90^\\circ)} = \\sqrt{2\\cdot 10\\cdot 1} = 2\\sqrt{5} \\approx 4{,}47\\text{ m/s}$. Lực căng dây lúc đó là $T_{\\max} = mg(3\\cos 0 - 2\\cos 90^\\circ) = 3mg$, gấp đúng $3$ lần trọng lượng của vật.'
      }
    },
    {
      stepTitle: '3. Dao động Tắt dần, Dao động Cưỡng bức & Cộng hưởng',
      stepType: 'example',
      conceptSection:
        'Thực tế mọi dao động tự do đều chịu lực cản ma sát của môi trường nên cơ năng giảm dần và tắt hẳn. Để duy trì biên độ ổn định, cần cấp bù năng lượng bằng ngoại lực cưỡng bức tuần hoàn.',
      formulaSection: {
        primaryFormula: 'f_{\\text{cưỡng bức}} = f_{\\text{ngoại lực}}, \\qquad \\text{Cộng hưởng} \\iff f_{\\text{ngoại lực}} = f_0',
        secondaryFormulas: [
          '\\Delta W = \\frac{1}{2}k(A_{\\text{đầu}}^2 - A_{\\text{cuối}}^2)'
        ],
        variablesNote:
          '• **Cộng hưởng**: khi tần số ngoại lực cưỡng bức tiến bằng tần số dao động riêng $f_0$, biên độ tăng vọt đạt cực đại.\n• Độ lớn biên độ cộng hưởng càng cao khi lực cản môi trường càng nhỏ.'
      },
      deepDiveSection:
        'Ứng dụng có lợi của cộng hưởng: lên dây đàn, hộp cộng hưởng đàn ghi-ta, dò sóng radio. Tác hại cần tránh: cầu treo bị gió thổi hoặc đoàn quân đi đều nhịp gây gãy cầu, khung xe buýt rung lắc mạnh ở một dải vòng tua máy nhất định.',
      teacherExplanation:
        'Ghi nhớ: dao động cưỡng bức ổn định có tần số **bằng tần số ngoại lực**, KHÔNG bằng tần số riêng (trừ lúc cộng hưởng).',
      keyTakeaway: 'Cộng hưởng xảy ra khi tần số ngoại lực trùng với tần số riêng ($f = f_0$); lực cản càng nhỏ đỉnh cộng hưởng càng nhọn.',
      miniQuiz: [
        {
          id: 'p11pd-s3-q1',
          question: 'Một con lắc có tần số dao động riêng $f_0 = 2{,}5\\text{ Hz}$ chịu tác dụng ngoại lực tuần hoàn $F = 4\\cos(6\\pi t)\\text{ (N)}$. Tần số dao động ổn định của con lắc là:',
          options: ['A. $2{,}5\\text{ Hz}$', 'B. $3\\text{ Hz}$', 'C. $6\\text{ Hz}$', 'D. $0{,}5\\text{ Hz}$'],
          correctIndex: 1,
          explanation: 'Dao động cưỡng bức luôn dao động theo tần số ngoại lực: $f = \\frac{\\omega}{2\\pi} = \\frac{6\\pi}{2\\pi} = 3\\text{ Hz}$.'
        },
        {
          id: 'p11pd-s3-q2',
          question: 'Con lắc lò xo có $k = 100\\text{ N/m}, m = 0{,}25\\text{ kg}$. Ngoại lực cưỡng bức gây cộng hưởng mạnh nhất khi tần số góc ngoại lực bằng:',
          options: ['A. $10\\text{ rad/s}$', 'B. $20\\text{ rad/s}$', 'C. $400\\text{ rad/s}$', 'D. $5\\text{ rad/s}$'],
          correctIndex: 1,
          explanation: '$\\omega_0 = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{100}{0{,}25}} = 20\\text{ rad/s}$.'
        }
      ],
      miniEssay: {
        id: 'p11pd-s3-e1',
        question: 'Tại sao khi hành quân qua cầu treo, người chỉ huy thường ra lệnh cho bộ đội đi bước không đều ("đi tự do") thay vì dậm chân đều nhịp?',
        hint: 'Liên hệ giữa nhịp chân đều đặn (ngoại lực tuần hoàn) và hiện tượng cộng hưởng cơ học.',
        rubricChecklist: [
          'Nhịp dậm chân đều đóng vai trò ngoại lực tuần hoàn tác dụng lên mặt cầu.',
          'Nếu tần số bước chân trùng tần số dao động riêng của cầu sẽ gây cộng hưởng, làm biên độ rung tăng vọt có thể sập cầu.'
        ],
        sampleAnswer: 'Bước chân dậm đều nhịp tạo ra ngoại lực cưỡng bức tuần hoàn tác dụng lên cầu. Nếu tần số dậm chân tình cờ trùng với tần số dao động riêng của nhịp cầu, hiện tượng cộng hưởng cơ học xảy ra làm biên độ dao động của cầu tăng lên rất lớn, dễ vượt quá giới hạn bền kết cấu và gây sập cầu. Đi bước không đều sẽ phá vỡ tính tuần hoàn của ngoại lực.'
      }
    }
  ],
  'phys-11-sound-standing': [
    {
      stepTitle: '1. Đặc trưng Vật lí và Đặc trưng Sinh lí của Âm',
      stepType: 'concept',
      conceptSection:
        'Sóng âm là sóng cơ truyền trong môi trường đàn hồi. Âm nghe được có tần số $16\\text{ Hz} \\le f \\le 20\\,000\\text{ Hz}$ (dưới $16\\text{ Hz}$ là hạ âm, trên $20\\text{ kHz}$ là siêu âm).',
      formulaSection: {
        primaryFormula: 'I = \\frac{P}{4\\pi R^2}, \\qquad L(\\text{dB}) = 10\\lg\\left(\\frac{I}{I_0}\\right)',
        secondaryFormulas: [
          'I_0 = 10^{-12}\\text{ W/m}^2 \\quad (\\text{ngưỡng nghe ở } 1000\\text{ Hz})'
        ],
        variablesNote:
          '• 3 đặc trưng **vật lí**: Tần số $f$, Cường độ / Mức cường độ âm ($I, L$), Đồ thị dao động âm.\n• 3 đặc trưng **sinh lí** tương ứng: Độ cao (gắn với $f$), Độ to (gắn với $L$ và $f$), Âm sắc (gắn với đồ thị dao động âm / họa âm).'
      },
      deepDiveSection:
        'Nhớ quy tắc nhẩm cực nhanh hàm logarit mức cường độ âm: cứ tăng cường độ âm $I$ lên **$10$ lần** thì mức cường độ âm $L$ tăng thêm **$+10\\text{ dB}$**; tăng $I$ lên $100$ lần thì $L$ tăng $+20\\text{ dB}$.',
      teacherExplanation:
        'Âm sắc giúp ta phân biệt giọng nói hai người hay tiếng đàn piano với violin dù cùng đánh một nốt La ($440\\text{ Hz}$).',
      keyTakeaway: 'Độ cao gắn với tần số $f$; độ to gắn với mức cường độ âm $L$; âm sắc gắn với đồ thị dao động âm.',
      miniQuiz: [
        {
          id: 'p11ss-s1-q1',
          question: 'Khi cường độ âm tại một điểm tăng gấp 1000 lần so với ban đầu, mức cường độ âm tại đó tăng thêm:',
          options: ['A. $3\\text{ dB}$', 'B. $30\\text{ dB}$', 'C. $100\\text{ dB}$', 'D. $1000\\text{ dB}$'],
          correctIndex: 1,
          explanation: '$\\Delta L = 10\\lg(1000) = 10\\cdot 3 = 30\\text{ dB}$.'
        },
        {
          id: 'p11ss-s1-q2',
          question: 'Để phân biệt tiếng đàn bầu và tiếng đàn ghi-ta cùng phát ra nốt Đô có cùng độ to, tai người dựa vào đặc trưng nào?',
          options: ['A. Độ cao', 'B. Âm sắc', 'C. Tần số cơ bản', 'D. Tốc độ truyền âm'],
          correctIndex: 1,
          explanation: 'Âm sắc phụ thuộc vào đồ thị dao động âm (hệ thống các họa âm bậc cao) đặc trưng cho từng nhạc cụ.'
        }
      ],
      miniEssay: {
        id: 'p11ss-s1-e1',
        question: 'Tại điểm A cách loa $10\\text{ m}$ đo được mức cường độ âm $L_A = 80\\text{ dB}$. Hỏi phải đứng cách loa bao xa để mức cường độ âm giảm xuống $60\\text{ dB}$ (coi nguồn điểm đẳng hướng, bỏ qua hấp thụ)?',
        hint: 'Mức âm giảm $20\\text{ dB} \\implies$ cường độ $I$ giảm $100$ lần; mà $I \\propto 1/R^2$.',
        rubricChecklist: [
          'Tính $L_A - L_B = 20\\text{ dB} \\implies I_A / I_B = 10^2 = 100$.',
          'Từ $I \\propto 1/R^2 \\implies R_B/R_A = \\sqrt{100} = 10 \\implies R_B = 100\\text{ m}$.'
        ],
        sampleAnswer: 'Độ giảm mức cường độ âm là $L_A - L_B = 80 - 60 = 20\\text{ dB} = 10\\lg(I_A/I_B) \\Rightarrow I_A/I_B = 100$. Do sóng cầu phân bố năng lượng theo $I = P/(4\\pi R^2)$, ta có $\\frac{R_B^2}{R_A^2} = 100 \\Rightarrow R_B = 10 R_A = 10 \\times 10 = 100\\text{ m}$.'
      }
    },
    {
      stepTitle: '2. Sóng dừng trên Dây Hai đầu cố định & Một đầu tự do',
      stepType: 'derivation',
      conceptSection:
        'Sóng dừng được tạo thành do sự giao thoa giữa sóng tới và sóng phản xạ truyền ngược chiều nhau trên cùng một phương, hình thành các **nút sóng** (đứng yên hoàn toàn) và **bụng sóng** (dao động biên độ cực đại) cố định trong không gian.',
      formulaSection: {
        primaryFormula: '\\text{2 đầu cố định: } l = k\\frac{\\lambda}{2}, \\qquad \\text{1 đầu cố định – 1 đầu tự do: } l = \\left(k + \\frac{1}{2}\\right)\\frac{\\lambda}{2}',
        secondaryFormulas: [
          '\\text{Khoảng cách 2 nút liên tiếp } = \\text{2 bụng liên tiếp } = \\frac{\\lambda}{2}',
          '\\text{Khoảng cách nút – bụng gần nhất } = \\frac{\\lambda}{4}'
        ],
        variablesNote:
          '• $k \\in \\mathbb{N}^*$: số bó sóng nguyên (ứng với số bụng sóng trên dây 2 đầu cố định; số nút $= k + 1$).\n• Nếu 1 đầu cố định – 1 đầu tự do: số bụng $=$ số nút $= k + 1$ ($k = 0, 1, 2\\dots$ là số bó nguyên).'
      },
      deepDiveSection:
        'Khi phản xạ trên **vật cản cố định**, sóng phản xạ luôn **ngược pha** với sóng tới tại điểm phản xạ (tạo nút sóng). Khi phản xạ trên **vật cản tự do**, sóng phản xạ luôn **cùng pha** với sóng tới (tạo bụng sóng).',
      teacherExplanation:
        'Hãy đếm số bó sóng trên dây: mỗi bó dài đúng $\\lambda/2$; một đầu tự do cộng thêm nửa bó $\\lambda/4$.',
      keyTakeaway: 'Hai nút (hoặc hai bụng) liên tiếp cách nhau $\\lambda/2$; nút và bụng liền kề cách nhau $\\lambda/4$.',
      miniQuiz: [
        {
          id: 'p11ss-s2-q1',
          question: 'Dây đàn dài $60\\text{ cm}$ hai đầu cố định có sóng dừng với 3 bụng sóng (3 bó). Bước sóng trên dây bằng:',
          options: ['A. $20\\text{ cm}$', 'B. $40\\text{ cm}$', 'C. $30\\text{ cm}$', 'D. $60\\text{ cm}$'],
          correctIndex: 1,
          explanation: '$l = 3\\frac{\\lambda}{2} = 60\\text{ cm} \\implies \\lambda = 40\\text{ cm}$.'
        },
        {
          id: 'p11ss-s2-q2',
          question: 'Khoảng cách giữa một nút sóng và một bụng sóng liền kề trên dây có sóng dừng bằng:',
          options: ['A. $\\lambda$', 'B. $\\lambda/2$', 'C. $\\lambda/4$', 'D. $2\\lambda$'],
          correctIndex: 2,
          explanation: 'Một bó sóng dài $\\lambda/2$ nằm giữa 2 nút, bụng nằm chính giữa bó nên cách nút gần nhất $\\lambda/4$.'
        }
      ],
      miniEssay: {
        id: 'p11ss-s2-e1',
        question: 'Ống sáo dài $L = 68\\text{ cm}$ có một đầu bịt kín (nút) và một đầu hở (bụng), tốc độ âm $340\\text{ m/s}$. Tìm tần số âm cơ bản nhỏ nhất phát ra từ ống.',
        hint: 'Âm cơ bản ứng với $k = 0$ trong công thức một đầu cố định – một đầu tự do: $L = \\lambda/4$.',
        rubricChecklist: [
          'Viết đúng điều kiện âm cơ bản đầu kín – đầu hở: $L = \\lambda_{\\max}/4 \\implies \\lambda = 2{,}72\\text{ m}$.',
          'Tính đúng $f_0 = v / \\lambda = 340 / 2{,}72 = 125\\text{ Hz}$.'
        ],
        sampleAnswer: 'Đầu bịt kín là nút, đầu hở là bụng sóng. Với tần số cơ bản nhỏ nhất ($k = 0$), chiều dài ống chứa đúng $1/4$ bước sóng: $L = \\frac{\\lambda}{4} \\Rightarrow \\lambda = 4L = 4 \\times 0{,}68 = 2{,}72\\text{ m}$. Tần số âm cơ bản là $f_0 = \\frac{v}{\\lambda} = \\frac{340}{2{,}72} = 125\\text{ Hz}$.'
      }
    },
    {
      stepTitle: '3. Họa âm trên Dây đàn & Thí nghiệm Đo tốc độ Âm',
      stepType: 'example',
      conceptSection:
        'Trên dây đàn hai đầu cố định, chỉ các tần số là bội nguyên của âm cơ bản $f_0 = \\frac{v}{2l}$ mới tạo được sóng dừng, tạo thành hệ **họa âm** $f_n = n f_0$ quyết định cao độ và màu âm nhạc cụ.',
      formulaSection: {
        primaryFormula: 'f_k = k\\frac{v}{2l} = k f_0 \\quad (\\text{2 đầu cố định})',
        secondaryFormulas: [
          '\\text{1 đầu kín – 1 đầu hở: } f_m = (2k + 1)\\frac{v}{4l} \\quad (\\text{chỉ có họa âm bậc lẻ})'
        ],
        variablesNote:
          '• Hai tần số liên tiếp tạo sóng dừng trên dây 2 đầu cố định hơn kém nhau đúng $\\Delta f = f_0$.\n• Trong ống nghiệm trụ chứa cột khí đo tốc độ âm bằng cộng hưởng sóng dừng, khoảng dịch chuyển piston giữa hai lần nghe âm to liên tiếp đúng bằng $\\Delta l = \\lambda/2$.'
      },
      deepDiveSection:
        'Nhờ công thức $\\Delta l = \\lambda/2$, thí nghiệm đo tốc độ truyền âm trong không khí dùng âm thoa $f$ và ống trụ thay đổi chiều cao cột khí cho phép xác định rất chính xác $v = 2f\\Delta l$ mà không cần lo hiệu chỉnh đầu hở ở miệng ống.',
      teacherExplanation:
        'Thấy hai lần liên tiếp nghe âm to nhất khi dịch chuyển piston cách nhau đoạn $\\Delta l$: lập tức suy ra $\\lambda = 2\\Delta l$!',
      keyTakeaway: 'Hiệu hai tần số cộng hưởng liên tiếp là $f_0$ (2 đầu cố định) hoặc $2f_0$ (1 đầu cố định, 1 tự do).',
      miniQuiz: [
        {
          id: 'p11ss-s3-q1',
          question: 'Thí nghiệm dùng âm thoa tần số $500\\text{ Hz}$ đặt trên miệng ống trụ có piston. Khoảng cách giữa hai vị trí piston liên tiếp cho âm cộng hưởng to nhất là $34\\text{ cm}$. Tốc độ truyền âm đo được là:',
          options: ['A. $170\\text{ m/s}$', 'B. $340\\text{ m/s}$', 'C. $330\\text{ m/s}$', 'D. $680\\text{ m/s}$'],
          correctIndex: 1,
          explanation: '$\\lambda = 2\\Delta l = 2\\cdot 0{,}34 = 0{,}68\\text{ m} \\implies v = \\lambda f = 0{,}68\\cdot 500 = 340\\text{ m/s}$.'
        },
        {
          id: 'p11ss-s3-q2',
          question: 'Trên dây đàn căng hai đầu cố định, hai tần số liên tiếp tạo được sóng dừng là $150\\text{ Hz}$ và $200\\text{ Hz}$. Tần số âm cơ bản $f_0$ của dây là:',
          options: ['A. $100\\text{ Hz}$', 'B. $50\\text{ Hz}$', 'C. $25\\text{ Hz}$', 'D. $175\\text{ Hz}$'],
          correctIndex: 1,
          explanation: 'Trên dây 2 đầu cố định, $f_{k+1} - f_k = f_0 = 200 - 150 = 50\\text{ Hz}$.'
        }
      ],
      miniEssay: {
        id: 'p11ss-s3-e1',
        question: 'Người chơi đàn ghi-ta bấm ngón tay để rút ngắn chiều dài phần dây rung chỉ còn $2/3$ chiều dài ban đầu (giữ nguyên lực căng). Hỏi tần số âm phát ra thay đổi thế nào?',
        hint: 'Lực căng và khối lượng riêng dây giữ nguyên nên tốc độ sóng $v$ trên dây không đổi; mà $f_0 = v/(2l)$.',
        rubricChecklist: [
          'Nêu $v$ không đổi vì lực căng và dây giữ nguyên.',
          'Vì $f_0 = \\frac{v}{2l}$ tỉ lệ nghịch với $l$, khi $l\' = \\frac{2}{3}l$ thì $f_0\' = \\frac{3}{2}f_0 = 1{,}5 f_0$ (tăng 1,5 lần, âm bổng hơn).'
        ],
        sampleAnswer: 'Do giữ nguyên dây đàn và độ căng nên tốc độ truyền sóng $v$ trên dây không đổi. Âm cơ bản $f_0 = \\frac{v}{2l}$ tỉ lệ nghịch với chiều dài phần dây rung. Khi rút ngắn $l\' = \\frac{2}{3}l$, tần số âm tăng lên thành $f_0\' = \\frac{3}{2}f_0 = 1{,}5 f_0$ (âm phát ra cao/bổng hơn một quãng năm đúng).'
      }
    }
  ],
  'phys-11-capacitor': [
    {
      stepTitle: '1. Điện thế, Hiệu điện thế & Mối liên hệ với Điện trường',
      stepType: 'concept',
      conceptSection:
        'Điện thế $V_M$ tại một điểm đo thế năng điện của một đơn vị điện tích dương đặt tại điểm đó ($V_M = W_M/q$, thường chọn mốc $V_\\infty = 0$). Hiệu điện thế $U_{MN} = V_M - V_N$ đặc trưng cho khả năng sinh công khi điện tích di chuyển giữa hai điểm.',
      formulaSection: {
        primaryFormula: 'V_M = \\frac{A_{M\\infty}}{q}, \\qquad U_{MN} = V_M - V_N = E\\cdot d',
        secondaryFormulas: [
          'V(r) = k\\frac{Q}{\\varepsilon r} \\quad (\\text{điện tích điểm})'
        ],
        variablesNote:
          '• Dọc theo chiều đường sức điện, **điện thế luôn GIẢM** ($V_{\\text{trước}} > V_{\\text{sau}}$).\n• Các điểm nằm trên cùng mặt phẳng vuông góc với đường sức điện trường đều có **cùng điện thế** (mặt đẳng thế).'
      },
      deepDiveSection:
        'Điện tích dương tự do khi thả nhẹ sẽ di chuyển từ nơi có điện thế cao sang nơi có điện thế thấp (giống nước chảy chỗ trũng); ngược lại **electron** ($q < 0$) tự chuyển động từ nơi có **điện thế thấp đến nơi có điện thế cao**!',
      teacherExplanation:
        'Đừng quên dấu âm khi tính điện thế $V = kQ/(\\varepsilon r)$: điện tích âm tạo điện thế âm.',
      keyTakeaway: 'Dọc theo chiều vectơ $\\vec{E}$, điện thế luôn giảm dần; $U_{MN} = V_M - V_N$.',
      miniQuiz: [
        {
          id: 'p11cp-s1-q1',
          question: 'Trong điện trường đều hướng từ trái sang phải, hai điểm M, N nằm trên cùng một đường sức với $MN = 4\\text{ cm}$ (N ở bên phải M), biết $E = 2500\\text{ V/m}$. Hiệu điện thế $U_{MN}$ bằng:',
          options: ['A. $-100\\text{ V}$', 'B. $+100\\text{ V}$', 'C. $+10\\,000\\text{ V}$', 'D. $0\\text{ V}$'],
          correctIndex: 1,
          explanation: 'Đi từ M sang N cùng chiều đường sức nên $d = +0{,}04\\text{ m} \\implies U_{MN} = Ed = 2500\\cdot 0{,}04 = +100\\text{ V}$.'
        },
        {
          id: 'p11cp-s1-q2',
          question: 'Khi thả nhẹ một electron không vận tốc đầu trong điện trường, nó sẽ tự dịch chuyển hướng về phía nơi có:',
          options: [
            'A. Điện thế thấp hơn',
            'B. Điện thế cao hơn',
            'C. Cùng điện thế',
            'D. Tùy thuộc vào nhiệt độ'
          ],
          correctIndex: 1,
          explanation: 'Lực điện $\\vec{F} = e\\vec{E}$ tác dụng lên electron ($e < 0$) hướng ngược chiều đường sức $\\vec{E}$, tức hướng về nơi có điện thế cao hơn.'
        }
      ],
      miniEssay: {
        id: 'p11cp-s1-e1',
        question: 'Tại sao dây dẫn kim loại lý tưởng ở trạng thái cân bằng tĩnh điện lại là một khối đẳng thế (mọi điểm trên cùng dây dẫn đều có điện thế bằng nhau)?',
        hint: 'Nếu tồn tại $V_A \\ne V_B$ thì $E \\ne 0$ sẽ đẩy các electron tự do dịch chuyển, không còn tĩnh điện.',
        rubricChecklist: [
          'Ở cân bằng tĩnh điện, các electron tự do không còn dòng dịch chuyển vĩ mô $\\implies E_{\\text{bên trong}} = 0$.',
          'Từ $U_{AB} = V_A - V_B = Ed = 0$ suy ra $V_A = V_B$ tại mọi điểm trong vật dẫn.'
        ],
        sampleAnswer: 'Ở trạng thái cân bằng tĩnh điện, không có dòng điện chạy trong vật dẫn nên cường độ điện trường bên trong chất dẫn phải bằng $0$ (nếu $E \\ne 0$, các electron tự do sẽ lập tức dịch chuyển). Vì $E = 0$ nên $U_{AB} = V_A - V_B = 0$ với mọi cặp điểm A, B trên vật dẫn, chứng tỏ toàn bộ vật dẫn có cùng điện thế.'
      }
    },
    {
      stepTitle: '2. Cấu tạo Tụ điện, Điện dung & Giới hạn Đánh thủng',
      stepType: 'derivation',
      conceptSection:
        'Tụ điện gồm hai vật dẫn (hai bản tụ) đặt gần nhau và ngăn cách bằng lớp điện môi (không khí, giấy tẩm dầu, gốm). Trên vỏ tụ luôn ghi 2 thông số: điện dung $C$ và hiệu điện thế giới hạn $U_{gh}$.',
      formulaSection: {
        primaryFormula: 'C = \\frac{Q}{U}, \\qquad C_{\\text{phẳng}} = \\frac{\\varepsilon S}{4\\pi k d}',
        secondaryFormulas: [
          'U_{\\max\\text{ bộ nối tiếp}} \\text{ xét từ } Q_{\\max} = \\min(C_1 U_{gh1}, C_2 U_{gh2})'
        ],
        variablesNote:
          '• Nếu đặt hiệu điện thế vượt quá $U_{gh}$, lớp điện môi bị ion hóa mất tính cách điện (đánh thủng tụ).\n• Ghép nối tiếp các tụ phải cùng điện tích $Q$; ghép song song các tụ phải cùng hiệu điện thế $U$.'
      },
      deepDiveSection:
        'Bẫy rất hay gặp với bài toán ghép nối tiếp hai tụ khác giới hạn $U_{gh}$: Nhiều học sinh cộng trực tiếp $U_{gh1} + U_{gh2}$ để ra điện áp tối đa bộ tụ — điều này SAI! Vì hai tụ nối tiếp có $Q_1 = Q_2$, điện áp tối đa cho phép bị khống chế bởi tụ nào đạt $Q_{gh} = C_i U_{ghi}$ nhỏ hơn trước.',
      teacherExplanation:
        'Khi làm bài ghép tụ có ghi điện áp định mức: ghép song song lấy $U_{\\max} = \\min(U_1, U_2)$; ghép nối tiếp lấy $Q_{\\max} = \\min(Q_1, Q_2)$.',
      keyTakeaway: 'Ghép song song bị giới hạn bởi $\\min(U_i)$; ghép nối tiếp bị giới hạn bởi $\\min(C_i U_i)$.',
      miniQuiz: [
        {
          id: 'p11cp-s2-q1',
          question: 'Tụ $C_1 = 2\\,\\mu\\text{F}$ (giới hạn $200\\text{ V}$) ghép nối tiếp với $C_2 = 6\\,\\mu\\text{F}$ (giới hạn $100\\text{ V}$). Điện tích tối đa mà bộ tụ nối tiếp chịu được an toàn là:',
          options: ['A. $400\\,\\mu\\text{C}$', 'B. $600\\,\\mu\\text{C}$', 'C. $1000\\,\\mu\\text{C}$', 'D. $200\\,\\mu\\text{C}$'],
          correctIndex: 0,
          explanation: '$Q_{1\\max} = 2\\cdot 200 = 400\\,\\mu\\text{C}$; $Q_{2\\max} = 6\\cdot 100 = 600\\,\\mu\\text{C} \\implies Q_{\\max} = \\min(400, 600) = 400\\,\\mu\\text{C}$.'
        },
        {
          id: 'p11cp-s2-q2',
          question: 'Với bộ tụ nối tiếp ở câu trên ($Q_{\\max} = 400\\,\\mu\\text{C}$), hiệu điện thế tối đa đặt vào hai đầu bộ tụ là:',
          options: ['A. $300\\text{ V}$', 'B. $266{,}7\\text{ V}$', 'C. $200\\text{ V}$', 'D. $100\\text{ V}$'],
          correctIndex: 1,
          explanation: '$C_b = \\frac{2\\cdot 6}{2+6} = 1{,}5\\,\\mu\\text{F} \\implies U_{\\max} = \\frac{400}{1{,}5} \\approx 266{,}7\\text{ V}$.'
        }
      ],
      miniEssay: {
        id: 'p11cp-s2-e1',
        question: 'Tại sao tụ điện có điện môi bằng giấy tẩm sáp hay gốm lại có kích thước rất nhỏ nhưng điện dung lớn hơn tụ không khí có cùng diện tích bản?',
        hint: 'Xét công thức $C = \\frac{\\varepsilon S}{4\\pi kd}$ khi đưa tấm điện môi mỏng ($\\varepsilon > 1$) vào giữa hai bản.',
        rubricChecklist: [
          'Lớp điện môi mỏng làm giảm $d$ xuống mức rất nhỏ đồng thời tăng hằng số điện môi $\\varepsilon$ lên nhiều lần.',
          'Ngoài ra điện môi rắn chịu được điện trường đánh thủng cao hơn không khí.'
        ],
        sampleAnswer: 'Theo công thức tụ phẳng $C = \\frac{\\varepsilon S}{4\\pi kd}$, lớp điện môi gốm hoặc giấy tẩm sáp vừa có hằng số điện môi $\\varepsilon$ lớn hơn không khí nhiều lần, vừa giúp đặt hai bản sát nhau hơn (giảm mạnh $d$) mà không bị phóng điện chập mạch, nên tụ rất gọn mà điện dung rất lớn.'
      }
    },
    {
      stepTitle: '3. Năng lượng Điện trường & Bảo toàn Điện tích khi Nối Tụ',
      stepType: 'example',
      conceptSection:
        'Khi ngắt hai tụ đã tích điện khỏi nguồn rồi nối chúng song song với nhau, điện tích sẽ tự phân bố lại cho đến khi điện thế hai tụ bằng nhau ($U_1\' = U_2\' = U\'$).',
      formulaSection: {
        primaryFormula: 'Q_{\\text{trước}} = Q_{\\text{sau}} \\implies U\' = \\frac{Q_1 \\pm Q_2}{C_1 + C_2}',
        secondaryFormulas: [
          '\\Delta W = W_{\\text{trước}} - W_{\\text{sau}} > 0 \\quad (\\text{tỏa nhiệt khi nối tụ})'
        ],
        variablesNote:
          '• Nối hai bản **cùng dấu** với nhau: tổng điện tích $Q_{\\text{sau}} = Q_1 + Q_2$.\n• Nối hai bản **trái dấu** với nhau: điện tích triệt tiêu bớt, $Q_{\\text{sau}} = |Q_1 - Q_2|$.'
      },
      deepDiveSection:
        'Điều thú vị của định luật bảo toàn năng lượng: khi nối hai tụ có hiệu điện thế khác nhau bằng dây dẫn, tổng điện tích được bảo toàn tuyệt đối nhưng **tổng năng lượng điện trường sau khi nối luôn nhỏ hơn trước khi nối**! Phần hụt đi biến thành nhiệt lượng trên dây nối và tia lửa điện.',
      teacherExplanation:
        'Phải đọc thật kỹ đề bài nối "cùng dấu" hay "trái dấu" (bản dương nối với bản âm) trước khi tính $Q_{\\text{tổng}}$.',
      keyTakeaway: 'Khi nối hai tụ cô lập: $Q$ bảo toàn ($Q_1 \\pm Q_2$), hiệu điện thế cân bằng ở $U\' = Q_{\\text{tổng}}/(C_1+C_2)$.',
      miniQuiz: [
        {
          id: 'p11cp-s3-q1',
          question: 'Tụ $C_1 = 2\\,\\mu\\text{F}$ tích điện đến $U_1 = 100\\text{ V}$, ngắt nguồn rồi nối song song với tụ $C_2 = 3\\,\\mu\\text{F}$ chưa tích điện. Hiệu điện thế bộ tụ sau đó là:',
          options: ['A. $50\\text{ V}$', 'B. $40\\text{ V}$', 'C. $60\\text{ V}$', 'D. $100\\text{ V}$'],
          correctIndex: 1,
          explanation: '$Q = 2\\cdot 100 = 200\\,\\mu\\text{C} \\implies U\' = \\frac{200 + 0}{2 + 3} = 40\\text{ V}$.'
        },
        {
          id: 'p11cp-s3-q2',
          question: 'So với tổng năng lượng điện trường ban đầu của hệ hai tụ trên trước khi nối, tổng năng lượng sau khi nối sẽ:',
          options: ['A. Không đổi', 'B. Tăng lên', 'C. Giảm đi do tỏa nhiệt và phát tia lửa điện', 'D. Bằng 0'],
          correctIndex: 2,
          explanation: '$W_{\\text{đầu}} = 0{,}01\\text{ J}$, $W_{\\text{sau}} = \\frac{1}{2}\\cdot 5\\cdot 10^{-6}\\cdot 40^2 = 0{,}004\\text{ J}$ (giảm $0{,}006\\text{ J}$).'
        }
      ],
      miniEssay: {
        id: 'p11cp-s3-e1',
        question: 'Tụ $C_1 = 4\\,\\mu\\text{F}$ nạp $U_1 = 60\\text{ V}$ và tụ $C_2 = 2\\,\\mu\\text{F}$ nạp $U_2 = 30\\text{ V}$. Ngắt cả hai khỏi nguồn rồi nối bản dương tụ 1 với bản âm tụ 2 (và bản âm tụ 1 với bản dương tụ 2). Tính hiệu điện thế $U\'$ lúc ổn định.',
        hint: 'Nối trái dấu nên tổng điện tích mới là $Q_{\\text{tổng}} = |Q_1 - Q_2|$.',
        rubricChecklist: [
          'Tính $Q_1 = 240\\,\\mu\\text{C}, Q_2 = 60\\,\\mu\\text{C}$, nối trái dấu $\\implies Q_{\\text{tổng}} = 240 - 60 = 180\\,\\mu\\text{C}$.',
          'Tính $U\' = \\frac{180}{4 + 2} = 30\\text{ V}$.'
        ],
        sampleAnswer: 'Điện tích ban đầu của hai tụ là $Q_1 = C_1 U_1 = 240\\,\\mu\\text{C}$ và $Q_2 = C_2 U_2 = 60\\,\\mu\\text{C}$. Khi nối bản dương tụ này với bản âm tụ kia, các điện tích trái dấu trung hòa bớt còn lại $Q_{\\text{sau}} = |Q_1 - Q_2| = 180\\,\\mu\\text{C}$. Hiệu điện thế cân bằng là $U\' = \\frac{Q_{\\text{sau}}}{C_1 + C_2} = \\frac{180}{4 + 2} = 30\\text{ V}$.'
      }
    }
  ],
  'phys-11-resonance': [
    {
      stepTitle: '1. Bản chất Dao động Tắt dần & Lực cản Môi trường',
      stepType: 'concept',
      conceptSection:
        'Dao động tắt dần là dao động có **biên độ và cơ năng giảm dần** theo thời gian do tác dụng của lực ma sát và lực cản môi trường sinh công âm.',
      formulaSection: {
        primaryFormula: '\\Delta A_{\\text{sau 1 chu kì}} = \\frac{4 F_{ms}}{k} \\quad (\\text{ma sát trượt không đổi})',
        secondaryFormulas: [
          'N_{\\text{chu kì}} = \\frac{A_0}{\\Delta A} = \\frac{k A_0}{4 F_{ms}}'
        ],
        variablesNote:
          '• Chu kì gần như không đổi nếu lực cản nhỏ; ma sát càng lớn thì dao động tắt càng nhanh.\n• Tốc độ cực đại con lắc lò xo có ma sát không đạt tại gốc $O$ ($x = 0$) mà đạt tại vị trí cân bằng tạm $x_0 = \\mu mg / k$ (nơi hợp lực bằng 0)!'
      },
      deepDiveSection:
        'Giảm xóc ô tô, xe máy và bộ đóng cửa thủy lực là những ứng dụng chủ động tận dụng **dao động tắt dần nhanh**: thiết kế lực cản dầu vừa đủ mạnh để xe dập tắt rung động chỉ trong 1 nhịp mà không nảy bồng bềnh gây say xe.',
      teacherExplanation:
        'Cẩn thận phân biệt: vị trí động năng cực đại khi có ma sát trượt là ở $x_0 = F_{ms}/k$, KHÔNG phải tại $x = 0$.',
      keyTakeaway: 'Độ giảm biên độ mỗi chu kì dưới lực ma sát khô không đổi là $\\Delta A = 4F_{ms}/k$.',
      miniQuiz: [
        {
          id: 'p11rs-s1-q1',
          question: 'Con lắc lò xo độ cứng $k = 100\\text{ N/m}$, khối lượng $m = 1\\text{ kg}$, kéo lệch $A_0 = 10\\text{ cm}$ trên mặt ngang có hệ số ma sát $\\mu = 0{,}05$ ($g = 10\\text{ m/s}^2$). Độ giảm biên độ sau MỖI chu kì là:',
          options: ['A. $0{,}5\\text{ cm}$', 'B. $1\\text{ cm}$', 'C. $2\\text{ cm}$', 'D. $4\\text{ cm}$'],
          correctIndex: 2,
          explanation: '$F_{ms} = 0{,}05\\cdot 1\\cdot 10 = 0{,}5\\text{ N} \\implies \\Delta A = \\frac{4\\cdot 0{,}5}{100} = 0{,}02\\text{ m} = 2\\text{ cm}$.'
        },
        {
          id: 'p11rs-s1-q2',
          question: 'Với con lắc tắt dần ở câu trên, vật thực hiện được bao nhiêu chu kì dao động trước khi dừng hẳn?',
          options: ['A. 4 chu kì', 'B. 5 chu kì', 'C. 10 chu kì', 'D. 20 chu kì'],
          correctIndex: 1,
          explanation: '$N = \\frac{A_0}{\\Delta A} = \\frac{10}{2} = 5$ chu kì.'
        }
      ],
      miniEssay: {
        id: 'p11rs-s1-e1',
        question: 'Tính tốc độ cực đại mà con lắc lò xo có $k = 100\\text{ N/m}, m = 1\\text{ kg}, A_0 = 10\\text{ cm}, \\mu = 0{,}05, g = 10\\text{ m/s}^2$ đạt được ngay trong nửa chu kì đầu tiên.',
        hint: 'Biên độ hiệu dụng tính từ vị trí cân bằng tạm $x_0 = F_{ms}/k$ là $A\' = A_0 - x_0$, suy ra $v_{\\max} = \\omega(A_0 - x_0)$.',
        rubricChecklist: [
          'Tính $x_0 = \\frac{F_{ms}}{k} = \\frac{0{,}5}{100} = 0{,}005\\text{ m} = 0{,}5\\text{ cm}$.',
          'Tính $\\omega = \\sqrt{100/1} = 10\\text{ rad/s} \\implies v_{\\max} = 10(0{,}1 - 0{,}005) = 0{,}95\\text{ m/s}$.'
        ],
        sampleAnswer: 'Trong nửa chu kì đầu đi theo chiều âm từ $x = A_0 = 0{,}1\\text{ m}$, hợp lực bằng 0 tại vị trí $x_0 = \\frac{\\mu mg}{k} = \\frac{0{,}5}{100} = 0{,}005\\text{ m}$. Theo bảo toàn năng lượng: $\\frac{1}{2}kA_0^2 - \\frac{1}{2}kx_0^2 - F_{ms}(A_0 - x_0) = \\frac{1}{2}mv_{\\max}^2 \\Rightarrow v_{\\max} = \\omega(A_0 - x_0) = 10 \\times 0{,}095 = 0{,}95\\text{ m/s}$.'
      }
    },
    {
      stepTitle: '2. Dao động Duy trì & Dao động Cưỡng bức',
      stepType: 'derivation',
      conceptSection:
        'Để khắc phục sự tắt dần, có 2 cách: **Dao động duy trì** (bù đúng phần năng lượng mất đi mỗi chu kì bằng chính nội lực phản hồi, giữ nguyên tần số riêng $f_0$); và **Dao động cưỡng bức** (chịu ngoại lực biến thiên tuần hoàn độc lập từ bên ngoài).',
      formulaSection: {
        primaryFormula: '\\text{Duy trì: } f = f_0, \\qquad \\text{Cưỡng bức: } f = f_{\\text{ngoại lực}}',
        secondaryFormulas: [
          'A_{\\text{cưỡng bức}} = f(F_0,\\, |f_{\\text{nl}} - f_0|,\\, F_{\\text{cản}})'
        ],
        variablesNote:
          '• Ví dụ dao động duy trì: đồng hồ quả lắc lên dây cót, đồng hồ pin đẩy nhịp đúng thời điểm.\n• Biên độ dao động cưỡng bức phụ thuộc: biên độ ngoại lực $F_0$, độ chênh lệch $|f_{\\text{nl}} - f_0|$, và lực cản môi trường.'
      },
      deepDiveSection:
        'Khác biệt then chốt giữa Duy trì và Cưỡng bức: Ở dao động duy trì, bộ máy chỉ "nhích đẩy nhẹ" đúng nhịp tự nhiên của con lắc nên tần số vẫn là $f_0$ do chiều dài dây quyết định. Ở dao động cưỡng bức, vật bị ngoại lực ép chạy theo nhịp $f_{\\text{nl}}$ của nguồn ngoài.',
      teacherExplanation:
        'Nếu đề bài cho 2 con lắc cùng biên độ ngoại lực, con nào có tần số riêng $f_0$ gần $f_{\\text{nl}}$ hơn sẽ dao động với biên độ lớn hơn.',
      keyTakeaway: 'Dao động duy trì giữ nguyên $f_0$; dao động cưỡng bức ép hệ chạy theo $f_{\\text{ngoại lực}}$.',
      miniQuiz: [
        {
          id: 'p11rs-s2-q1',
          question: 'Đồng hồ quả lắc chạy đều nhờ pin đẩy nhẹ một xung lực bù ma sát ở cuối mỗi chu kì là ví dụ về:',
          options: ['A. Dao động tắt dần', 'B. Dao động duy trì', 'C. Cộng hưởng hủy diệt', 'D. Dao động cưỡng bức tần số lạ'],
          correctIndex: 1,
          explanation: 'Cơ cấu hồi tiếp bù năng lượng theo chính chu kì riêng của quả lắc là dao động duy trì.'
        },
        {
          id: 'p11rs-s2-q2',
          question: 'Tác dụng ngoại lực tuần hoàn có tần số $4\\text{ Hz}$ lần lượt vào 3 con lắc có tần số riêng $2{,}5\\text{ Hz};\\ 3{,}8\\text{ Hz};\\ 6\\text{ Hz}$. Con lắc nào có biên độ cưỡng bức lớn nhất (cùng $F_0$ và cản)?',
          options: ['A. Con lắc $2{,}5\\text{ Hz}$', 'B. Con lắc $3{,}8\\text{ Hz}$', 'C. Con lắc $6\\text{ Hz}$', 'D. Cả ba bằng nhau'],
          correctIndex: 1,
          explanation: 'Độ lệch $|4 - 3{,}8| = 0{,}2\\text{ Hz}$ nhỏ nhất (gần cộng hưởng nhất) nên biên độ lớn nhất.'
        }
      ],
      miniEssay: {
        id: 'p11rs-s2-e1',
        question: 'Phân biệt ngắn gọn 2 điểm khác nhau giữa Dao động duy trì và Dao động cưỡng bức.',
        hint: 'So sánh về tần số dao động và cơ chế cung cấp năng lượng.',
        rubricChecklist: [
          'Tần số: duy trì giữ nguyên tần số riêng $f_0$; cưỡng bức có tần số bằng tần số ngoại lực $f_{\\text{nl}}$.',
          'Năng lượng: duy trì bù đúng lượng hao phí do chính hệ điều khiển nhịp; cưỡng bức chịu tác dụng liên tục của nguồn ngoài độc lập.'
        ],
        sampleAnswer: '1) Về tần số: dao động duy trì luôn giữ nguyên tần số riêng $f_0$ của hệ, còn dao động cưỡng bức có tần số bằng tần số ngoại lực $f_{\\text{nl}}$. 2) Về cơ chế: dao động duy trì tự điều khiển việc bù đúng phần năng lượng tiêu hao sau mỗi chu kì; dao động cưỡng bức bị dẫn động liên tục bởi một ngoại lực tuần hoàn từ bên ngoài.'
      }
    },
    {
      stepTitle: '3. Phân tích Đồ thị Cộng hưởng & Bài toán Tốc độ Xe qua Gờ',
      stepType: 'example',
      conceptSection:
        'Bài toán kinh điển về cộng hưởng thực tế là xe chạy qua các gờ giảm tốc hoặc mấu nối đường ray cách đều nhau khoảng $L$: cứ sau khoảng thời gian $T = L/v$, bánh xe lại nhận một xung kích từ mặt đường.',
      formulaSection: {
        primaryFormula: 'T_{\\text{xe}} = \\frac{L}{v_{\\text{nguy hiểm}}} = T_0 \\implies v_{\\text{nguy hiểm}} = \\frac{L}{T_0}',
        secondaryFormulas: [
          'T_0 = 2\\pi\\sqrt{\\frac{m}{k}} \\quad (\\text{chu kì riêng của khung nhíp xe})'
        ],
        variablesNote:
          '• Khi $v$ xấp xỉ $L/T_0$, xe xóc nảy dữ dội nhất (cộng hưởng). Muốn qua đoạn đường có rãnh đều an toàn hơn, tài xế phải chạy **nhanh hơn hoặc chậm hơn** hẳn tốc độ cộng hưởng đó.'
      },
      deepDiveSection:
        'Trên đồ thị cộng hưởng $A(f)$, đường cong đạt đỉnh nhọn tại $f = f_0$. Nếu giảm ma sát nhớt của bộ giảm chấn, đỉnh đồ thị cao vọt lên và nhọn hơn; ngược lại tăng lực cản dầu giúp làm tù đỉnh cộng hưởng, giúp xe êm ái qua nhiều dải tốc độ.',
      teacherExplanation:
        'Lấy quãng đường giữa 2 ổ gà liên tiếp chia cho chu kì riêng $T_0$ của lò xo giảm xóc là ra ngay vận tốc nguy hiểm.',
      keyTakeaway: 'Xe xóc mạnh nhất khi $v = L/T_0$; tăng lực cản làm giảm đỉnh cộng hưởng.',
      miniQuiz: [
        {
          id: 'p11rs-s3-q1',
          question: 'Khung xe máy nặng có chu kì dao động riêng $T_0 = 0{,}8\\text{ s}$ đi qua con đường có các rãnh ngang cách đều $L = 12\\text{ m}$. Xe bị xóc mạnh nhất ở tốc độ nào?',
          options: ['A. $9{,}6\\text{ m/s}$', 'B. $15\\text{ m/s}$', 'C. $12\\text{ m/s}$', 'D. $20\\text{ m/s}$'],
          correctIndex: 1,
          explanation: '$v = \\frac{L}{T_0} = \\frac{12}{0{,}8} = 15\\text{ m/s}$ ($= 54\\text{ km/h}$).'
        },
        {
          id: 'p11rs-s3-q2',
          question: 'Trên đồ thị cộng hưởng biên độ theo tần số, khi tăng lực cản của môi trường thì đỉnh đồ thị sẽ:',
          options: [
            'A. Cao hơn và dịch hẳn sang phải',
            'B. Thấp xuống và tù hơn',
            'C. Không đổi chiều cao',
            'D. Tiến tới vô cùng'
          ],
          correctIndex: 1,
          explanation: 'Lực cản càng lớn thì biên độ tại điểm cộng hưởng càng nhỏ (đỉnh thấp và tù xuống).'
        }
      ],
      miniEssay: {
        id: 'p11rs-s3-e1',
        question: 'Một người gánh nước đi bộ đều với mỗi bước dài $0{,}6\\text{ m}$. Thùng nước treo trên đòn gánh có tần số dao động riêng $1{,}25\\text{ Hz}$. Hỏi người đó đi với vận tốc nào thì nước trong thùng sóng sánh mạnh nhất?',
        hint: 'Chu kì bước chân bằng chu kì riêng của nước $T_0 = 1/f_0$.',
        rubricChecklist: [
          'Tính $T_0 = 1/1{,}25 = 0{,}8\\text{ s}$.',
          'Tính $v = L / T_0 = 0{,}6 / 0{,}8 = 0{,}75\\text{ m/s}$ ($= 2{,}7\\text{ km/h}$).'
        ],
        sampleAnswer: 'Chu kì dao động riêng của thùng nước là $T_0 = \\frac{1}{f_0} = \\frac{1}{1{,}25} = 0{,}8\\text{ s}$. Nước sóng sánh mạnh nhất khi xảy ra cộng hưởng: mỗi bước đi dài $L = 0{,}6\\text{ m}$ thực hiện đúng trong thời gian $T_0 = 0{,}8\\text{ s}$. Vậy vận tốc gây cộng hưởng là $v = \\frac{0{,}6}{0{,}8} = 0{,}75\\text{ m/s}$ ($2{,}7\\text{ km/h}$).'
      }
    }
  ],
  'phys-standing-wave': [
    {
      stepTitle: '1. Cơ chế Phản xạ Sóng & Sự hình thành Nút – Bụng',
      stepType: 'concept',
      conceptSection:
        'Khi sóng cơ truyền tới đầu dây rồi phản xạ ngược lại, sóng tới và sóng phản xạ là hai sóng kết hợp cùng tần số và cùng biên độ. Giao thoa của hai sóng ngược chiều này tạo ra **sóng dừng** với các điểm nút bất động và các điểm bụng dao động cực đại.',
      formulaSection: {
        primaryFormula: 'u(x,t) = 2A\\sin\\left(\\frac{2\\pi x}{\\lambda}\\right)\\cos(\\omega t + \\varphi)',
        secondaryFormulas: [
          'A_{\\text{điểm } M} = 2A_{\\text{sóng}}\\left|\\sin\\frac{2\\pi d}{\\lambda}\\right| \\quad (d \\text{ tính từ nút})'
        ],
        variablesNote:
          '• Biên độ tại **bụng sóng** bằng $2a$ (gấp đôi biên độ sóng tới $a$).\n• Tất cả các điểm nằm trong **cùng một bó sóng** luôn dao động **cùng pha**; hai điểm thuộc **hai bó liền kề** luôn dao động **ngược pha**.'
      },
      deepDiveSection:
        'Đây là điểm khác biệt lớn so với sóng chạy: Trong sóng chạy, mọi điểm có cùng biên độ $a$ nhưng pha lệch liên tục; trong **sóng dừng**, các điểm khác nhau có biên độ khác nhau từ $0$ đến $2a$, nhưng về pha chỉ có **2 trạng thái**: cùng pha hoặc ngược pha nhau!',
      teacherExplanation:
        'Nếu đề bài cho 2 điểm cùng nằm trong 1 bó hoặc cách nhau chẵn bó $\\implies$ cùng pha; nằm ở 2 bó kề nhau (hoặc lẻ bó) $\\implies$ ngược pha.',
      keyTakeaway: 'Các điểm trên cùng một bó sóng dừng dao động cùng pha; hai bó liên tiếp dao động ngược pha.',
      miniQuiz: [
        {
          id: 'p11st-s1-q1',
          question: 'Trên một sợi dây đang có sóng dừng ổn định, hai điểm M và N nằm đối xứng qua một nút sóng sẽ dao động:',
          options: ['A. Cùng pha', 'B. Vuông pha', 'C. Ngược pha', 'D. Lệch pha $\\pi/3$'],
          correctIndex: 2,
          explanation: 'Hai điểm nằm hai bên một nút sóng thuộc hai bó sóng liền kề nên luôn dao động ngược pha.'
        },
        {
          id: 'p11st-s1-q2',
          question: 'Biên độ dao động của một điểm bụng là $6\\text{ mm}$. Điểm M trên dây cách nút sóng gần nhất một khoảng $\\lambda/12$ có biên độ bằng:',
          options: ['A. $3\\text{ mm}$', 'B. $3\\sqrt{3}\\text{ mm}$', 'C. $3\\sqrt{2}\\text{ mm}$', 'D. $6\\text{ mm}$'],
          correctIndex: 0,
          explanation: '$A_M = A_{\\text{bụng}}\\left|\\sin\\frac{2\\pi(\\lambda/12)}{\\lambda}\\right| = 6\\sin\\frac{\\pi}{6} = 3\\text{ mm}$.'
        }
      ],
      miniEssay: {
        id: 'p11st-s1-e1',
        question: 'So sánh điểm khác biệt về biên độ và pha dao động giữa Sóng truyền thẳng (sóng chạy) và Sóng dừng.',
        hint: 'Xét hai điểm bất kỳ trên dây ở hai trường hợp.',
        rubricChecklist: [
          'Biên độ: sóng chạy mọi điểm (không tắt) có cùng biên độ $a$; sóng dừng biên độ biến thiên theo vị trí từ $0$ (nút) đến $2a$ (bụng).',
          'Pha: sóng chạy pha trễ dần liên tục theo $x$; sóng dừng chỉ có 2 trạng thái cùng pha (cùng bó/chẵn bó) hoặc ngược pha (lẻ bó).'
        ],
        sampleAnswer: 'Trong sóng chạy không suy giảm, mọi phần tử môi trường đều dao động với cùng biên độ nhưng độ lệch pha thay đổi liên tục theo khoảng cách $\\Delta\\varphi = 2\\pi d/\\lambda$. Trái lại, trong sóng dừng, biên độ phụ thuộc vị trí (từ $0$ tại nút đến $2a$ tại bụng), còn tất cả các điểm thuộc cùng một bó hoặc cách nhau số chẵn bó thì cùng pha, cách nhau số lẻ bó thì ngược pha.'
      }
    },
    {
      stepTitle: '2. Các điểm Biên độ Đặc biệt & Khoảng thời gian Duỗi thẳng',
      stepType: 'derivation',
      conceptSection:
        'Trên mỗi bó sóng dừng, ta thường khảo sát các điểm đặc biệt có biên độ $A_{\\text{bụng}}/2$, $A_{\\text{bụng}}\\frac{\\sqrt{2}}{2}$, $A_{\\text{bụng}}\\frac{\\sqrt{3}}{2}$ và thời điểm toàn bộ sợi dây duỗi thẳng thành đường nằm ngang.',
      formulaSection: {
        primaryFormula: '\\Delta t_{\\text{2 lần duỗi thẳng liên tiếp}} = \\frac{T}{2}',
        secondaryFormulas: [
          'A_M = \\frac{A_b}{2} \\iff d_{\\text{nút}} = \\frac{\\lambda}{12}',
          'A_M = \\frac{A_b\\sqrt{2}}{2} \\iff d_{\\text{nút}} = \\frac{\\lambda}{8}, \\qquad A_M = \\frac{A_b\\sqrt{3}}{2} \\iff d_{\\text{nút}} = \\frac{\\lambda}{6}'
        ],
        variablesNote:
          '• Toàn bộ sợi dây duỗi thẳng mỗi khi các điểm đồng loạt đi qua vị trí cân bằng: cứ mỗi $T/2$ dây duỗi thẳng 1 lần.\n• Trong 1 chu kì có **4 điểm** trong mỗi bó có cùng biên độ $A_b/\\sqrt{2}$, cách đều nhau đoạn $\\lambda/4$? Không: hai điểm $A_b/\\sqrt{2}$ liên tiếp qua bụng hoặc qua nút đều cách nhau đúng $\\lambda/4$!'
      },
      deepDiveSection:
        'Để không bao giờ quên vị trí điểm có biên độ bằng $A_b/2$, $A_b\\sqrt{2}/2$: hãy vẽ vòng tròn lượng giác với góc $\\alpha = 2\\pi d/\\lambda$ tính từ nút sóng ($d=0$)! Khi $\\sin\\alpha = 1/2 \\implies \\alpha = \\pi/6 \\implies d = \\lambda/12$.',
      teacherExplanation:
        'Khoảng thời gian giữa 2 lần liên tiếp sợi dây duỗi thẳng luôn là $T/2$, bất kể dây có bao nhiêu bó sóng.',
      keyTakeaway: 'Sợi dây có sóng dừng duỗi thẳng mỗi nửa chu kì ($T/2$); các điểm $A_b/\\sqrt{2}$ cách đều nhau $\\lambda/4$.',
      miniQuiz: [
        {
          id: 'p11st-s2-q1',
          question: 'Trên dây có sóng dừng với chu kì $T = 0{,}2\\text{ s}$. Khoảng thời gian giữa 3 lần liên tiếp sợi dây duỗi thẳng bằng:',
          options: ['A. $0{,}1\\text{ s}$', 'B. $0{,}2\\text{ s}$', 'C. $0{,}3\\text{ s}$', 'D. $0{,}4\\text{ s}$'],
          correctIndex: 1,
          explanation: 'Giữa 3 lần duỗi thẳng liên tiếp có 2 khoảng $T/2$, nên $\\Delta t = 2 \\cdot \\frac{T}{2} = T = 0{,}2\\text{ s}$.'
        },
        {
          id: 'p11st-s2-q2',
          question: 'Điểm M có biên độ $A_{\\text{bụng}}\\frac{\\sqrt{2}}{2}$ gần bụng sóng nhất cách bụng sóng khoảng:',
          options: ['A. $\\lambda/4$', 'B. $\\lambda/8$', 'C. $\\lambda/12$', 'D. $\\lambda/6$'],
          correctIndex: 1,
          explanation: '$A_M = A_b\\left|\\cos\\frac{2\\pi d_{\\text{bụng}}}{\\lambda}\\right| = A_b\\frac{\\sqrt{2}}{2} \\implies \\frac{2\\pi d}{\\lambda} = \\frac{\\pi}{4} \\implies d = \\frac{\\lambda}{8}$.'
        }
      ],
      miniEssay: {
        id: 'p11st-s2-e1',
        question: 'Trên dây có sóng dừng bước sóng $\\lambda = 24\\text{ cm}$, biên độ bụng là $4\\text{ cm}$. Tìm khoảng cách ngắn nhất giữa hai điểm dao động với biên độ $2\\text{ cm}$ và ngược pha nhau.',
        hint: 'Xét hai điểm nằm ở hai bên một nút sóng cùng có $A = A_b/2$, mỗi điểm cách nút $\\lambda/12$.',
        rubricChecklist: [
          'Ngược pha nên hai điểm phải nằm ở hai bên của một nút sóng.',
          'Mỗi điểm cách nút gần nhất $d = \\lambda/12 = 2\\text{ cm} \\implies$ khoảng cách giữa chúng là $2\\cdot 2 = 4\\text{ cm}$.'
        ],
        sampleAnswer: 'Để hai điểm dao động ngược pha với cùng biên độ $2\\text{ cm} = A_b/2$ và gần nhau nhất, chúng phải nằm đối xứng hai bên một nút sóng. Mỗi điểm cách nút đoạn $d = \\frac{\\lambda}{12} = \\frac{24}{12} = 2\\text{ cm}$. Do đó khoảng cách ngắn nhất giữa hai điểm đó là $2d = 4\\text{ cm}$.'
      }
    },
    {
      stepTitle: '3. Phân tích Tốc độ Truyền sóng & Thí nghiệm Dây đàn hồi',
      stepType: 'example',
      conceptSection:
        'Trong thí nghiệm sóng dừng trên dây đàn hồi căng ngang bởi lực căng $F$ (nhờ quả nặng treo qua ròng rọc) và có mật độ khối lượng dài $\\mu = m/l$, tốc độ sóng trên dây phụ thuộc trực tiếp vào lực căng dây.',
      formulaSection: {
        primaryFormula: 'v = \\sqrt{\\frac{F}{\\mu}} \\implies f_k = \\frac{k}{2l}\\sqrt{\\frac{F}{\\mu}}',
        secondaryFormulas: [
          '\\text{Số bụng } k \\text{ tỉ lệ nghịch với } \\sqrt{F} \\text{ khi } f, l \\text{ không đổi}'
        ],
        variablesNote:
          '• $F$ ($\\text{N}$): lực căng sợi dây; $\\mu = m/l$ ($\\text{kg/m}$): khối lượng 1 mét dây.\n• Khi tăng lực căng dây lên 4 lần, tốc độ sóng tăng gấp đôi và số bó sóng trên dây (khi giữ nguyên $f, l$) giảm đi một nửa!'
      },
      deepDiveSection:
        'Ứng dụng khi lên dây đàn ghi-ta: vặn chốt lên dây để **tăng lực căng $F$** khiến tốc độ sóng $v$ tăng, do chiều dài $l$ cố định nên tần số âm cơ bản $f_0 = v/(2l)$ tăng lên (tiếng đàn thanh/cao hơn). Ngược lại dây bass bọc đồng dày ($\\mu$ lớn) cho âm trầm hơn.',
      teacherExplanation:
        'Khi đề giữ nguyên tần số nguồn $f$ và chiều dài $l$ nhưng thay đổi số quả cân treo ở đầu dây: tích $k\\sqrt{F}$ là hằng số ($k_1\\sqrt{F_1} = k_2\\sqrt{F_2}$).',
      keyTakeaway: 'Dây càng căng ($F$ lớn) hoặc càng mảnh nhẹ ($\\mu$ nhỏ) thì tốc độ sóng và tần số âm càng cao.',
      miniQuiz: [
        {
          id: 'p11st-s3-q1',
          question: 'Khi lên dây đàn ghi-ta (vặn chốt làm tăng lực căng dây lên gấp 4 lần, giữ nguyên chiều dài dây), tần số âm cơ bản của dây sẽ:',
          options: ['A. Giảm 2 lần', 'B. Tăng 2 lần', 'C. Tăng 4 lần', 'D. Không đổi'],
          correctIndex: 1,
          explanation: '$f_0 \\propto v \\propto \\sqrt{F}$, lực căng tăng 4 lần nên tần số tăng $\\sqrt{4} = 2$ lần.'
        },
        {
          id: 'p11st-s3-q2',
          question: 'Thí nghiệm sóng dừng với tần số nguồn không đổi: khi treo 1 quả cân giống nhau trên dây có 6 bó sóng. Để trên dây chỉ còn 3 bó sóng, cần treo tổng cộng mấy quả cân?',
          options: ['A. 2 quả cân', 'B. 4 quả cân', 'C. 3 quả cân', 'D. 9 quả cân'],
          correctIndex: 1,
          explanation: 'Số bó giảm 2 lần ($6 \\to 3$) thì $v$ phải tăng 2 lần $\\implies$ lực căng $F$ phải tăng $2^2 = 4$ lần (treo 4 quả cân).'
        }
      ],
      miniEssay: {
        id: 'p11st-s3-e1',
        question: 'Trên đàn ghi-ta có 6 dây có cùng độ dài phần rung, tại sao các dây đánh nốt trầm (dây bass) lại được làm to dày hơn nhiều so với dây đánh nốt cao (dây treble)?',
        hint: 'Liên hệ khối lượng trên một đơn vị chiều dài $\\mu$ trong công thức $f_0 = \\frac{1}{2l}\\sqrt{F/\\mu}$.',
        rubricChecklist: [
          'Dây dày có mật độ khối lượng $\\mu$ lớn hơn dây mảnh.',
          'Theo $f_0 = \\frac{1}{2l}\\sqrt{F/\\mu}$, $\\mu$ lớn làm tốc độ truyền sóng $v$ và tần số $f_0$ giảm xuống (âm trầm) mà không cần phải nới dây quá chùng.'
        ],
        sampleAnswer: 'Tần số âm cơ bản của dây đàn là $f_0 = \\frac{1}{2l}\\sqrt{\\frac{F}{\\mu}}$. Vì các dây có cùng chiều dài $l$ và cần lực căng $F$ vừa phải để bấm nốt dễ, việc quấn thêm sợi đồng làm dây trầm dày hơn (tăng mạnh $\\mu$) giúp giảm tốc độ sóng và hạ tần số $f_0$ xuống thấp để phát âm trầm chuẩn xác.'
      }
    }
  ]
};
