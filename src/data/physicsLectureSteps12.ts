import { LectureStep } from '../types';

export const PHYSICS_CUSTOM_LECTURE_STEPS_12: Record<string, LectureStep[]> = {
  'phys-12-thermal': [
    {
      stepTitle: '1. Nội năng, Nguyên lí I Nhiệt động lực học & Nhiệt dung riêng',
      stepType: 'concept',
      conceptSection:
        'Nội năng ($U$) của vật là tổng động năng và thế năng của các phân tử cấu tạo nên vật, phụ thuộc nhiệt độ $T$ và thể tích $V$. Có hai cách làm biến đổi nội năng: **thực hiện công** ($A$) và **truyền nhiệt** ($Q$).',
      formulaSection: {
        primaryFormula: '\\Delta U = A + Q, \\qquad Q = m c \\Delta T',
        secondaryFormulas: [
          'Q_{\\text{nóng chảy}} = \\lambda m, \\qquad Q_{\\text{hóa hơi}} = L m'
        ],
        variablesNote:
          '• **Quy ước dấu chuẩn SGK**:\n  – $Q > 0$: hệ **nhận nhiệt**; $Q < 0$: hệ **tỏa nhiệt**.\n  – $A > 0$: hệ **nhận công** (bị nén); $A < 0$: hệ **sinh công** (khí dãn nở đẩy pít-tông).\n• Trong giai đoạn đang nóng chảy hoặc đang sôi, nhiệt độ không đổi dù vẫn cấp nhiệt!'
      },
      deepDiveSection:
        'Rất nhiều học sinh sai dấu công $A$ khi đọc đề: "Khối khí dãn nở thực hiện công $50\\text{ J}$" $\\implies$ khí **sinh công** nên phải thay **$A = -50\\text{ J}$** vào $\\Delta U = A + Q$!',
      teacherExplanation:
        'Luôn tự hỏi: Hệ đang ĐƯỢC NHẬN hay ĐANG CHO ĐI? Nhận vào là dương ($+$), mất đi/sinh ra cho bên ngoài là âm ($-$).',
      keyTakeaway: 'Khí nhận nhiệt ($Q>0$), bị nén ($A>0$); khí dãn nở sinh công ($A<0$).',
      miniQuiz: [
        {
          id: 'p12th-s1-q1',
          question: 'Truyền cho khối khí trong xi-lanh nhiệt lượng $120\\text{ J}$, khí nở ra đẩy pít-tông thực hiện công $75\\text{ J}$. Độ biến thiên nội năng của khí bằng:',
          options: ['A. $+195\\text{ J}$', 'B. $+45\\text{ J}$', 'C. $-45\\text{ J}$', 'D. $-195\\text{ J}$'],
          correctIndex: 1,
          explanation: 'Khí nhận nhiệt $Q = +120\\text{ J}$, sinh công $A = -75\\text{ J} \\implies \\Delta U = 120 - 75 = +45\\text{ J}$.'
        },
        {
          id: 'p12th-s1-q2',
          question: 'Trong suốt quá trình nước đá đang tan ở $0^\\circ\\text{C}$ ($1\\text{ atm}$), khi tiếp tục cấp nhiệt lượng cho nó thì:',
          options: [
            'A. Nhiệt độ tăng dần còn nội năng không đổi',
            'B. Nhiệt độ không đổi còn nội năng tăng lên',
            'C. Cả nhiệt độ và nội năng đều tăng',
            'D. Cả nhiệt độ và nội năng đều giảm'
          ],
          correctIndex: 1,
          explanation: 'Nhiệt lượng dùng để phá vỡ liên kết tinh thể làm tăng thế năng phân tử (tăng nội năng), còn động năng trung bình (nhiệt độ) giữ nguyên $0^\\circ\\text{C}$.'
        }
      ],
      miniEssay: {
        id: 'p12th-s1-e1',
        question: 'Tính nhiệt lượng tối thiểu cần thiết để đun nóng $2\\text{ kg}$ nước đá từ $-10^\\circ\\text{C}$ cho đến khi tan chảy hoàn toàn thành nước ở $0^\\circ\\text{C}$. Biết $c_{\\text{đá}} = 2100\\text{ J/(kg.K)}$, $\\lambda = 3{,}34\\cdot 10^5\\text{ J/kg}$.',
        hint: 'Chia làm 2 giai đoạn: nâng đá từ $-10^\\circ\\text{C}$ lên $0^\\circ\\text{C}$, rồi làm đá nóng chảy hoàn toàn ở $0^\\circ\\text{C}$.',
        rubricChecklist: [
          'Tính $Q_1 = mc_{\\text{đá}}\\Delta t = 2\\cdot 2100\\cdot 10 = 42\\,000\\text{ J}$.',
          'Tính $Q_2 = \\lambda m = 3{,}34\\cdot 10^5\\cdot 2 = 668\\,000\\text{ J} \\implies Q = 710\\,000\\text{ J} = 710\\text{ kJ}$.'
        ],
        sampleAnswer: 'Nhiệt lượng đưa $2\\text{ kg}$ nước đá từ $-10^\\circ\\text{C}$ lên $0^\\circ\\text{C}$ là $Q_1 = m c_{\\text{đá}} \\Delta t = 2 \\times 2100 \\times 10 = 42\\,000\\text{ J}$. Nhiệt lượng làm tan chảy hoàn toàn $2\\text{ kg}$ đá ở $0^\\circ\\text{C}$ là $Q_2 = \\lambda m = 3{,}34\\cdot 10^5 \\times 2 = 668\\,000\\text{ J}$. Tổng nhiệt lượng cần cấp là $Q = 42\\,000 + 668\\,000 = 710\\,000\\text{ J} = 710\\text{ kJ}$.'
      }
    },
    {
      stepTitle: '2. Phương trình Trạng thái Khí lí tưởng & Các Đẳng quá trình',
      stepType: 'derivation',
      conceptSection:
        'Trạng thái một lượng khí lí tưởng xác định bởi 3 thông số $(p, V, T)$, liên hệ với nhau qua phương trình trạng thái Clapeyron – Mendeleev.',
      formulaSection: {
        primaryFormula: '\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}, \\qquad pV = n R T',
        secondaryFormulas: [
          '\\text{Đẳng nhiệt (Boyle): } p_1 V_1 = p_2 V_2',
          '\\text{Đẳng áp (Charles): } \\frac{V_1}{T_1} = \\frac{V_2}{T_2}, \\qquad \\text{Đẳng tích: } \\frac{p_1}{T_1} = \\frac{p_2}{T_2}'
        ],
        variablesNote:
          '• **BẮT BUỘC đổi nhiệt độ sang Kelvin**: $T(\\text{K}) = t(^\\circ\\text{C}) + 273$.\n• $n = m/M$: số mol khí; $R = 8{,}31\\text{ J/(mol.K)}$ (khi dùng $p$ theo $\\text{Pa}$ và $V$ theo $\\text{m}^3$).'
      },
      deepDiveSection:
        'Khi đọc đồ thị các đẳng quá trình: trong hệ tọa độ $(p, V)$ đường đẳng nhiệt là nhánh **hypebol** (đường nằm xa gốc tọa độ có nhiệt độ $T$ cao hơn!). Trong hệ $(p, T)$ đường đẳng tích là đường thẳng kéo dài đi qua gốc tọa độ.',
      teacherExplanation:
        'Sai lầm hay mất điểm nhất ở chương Khí lí tưởng là quên cộng $273$ để đổi độ C sang Kelvin ($T$).',
      keyTakeaway: 'Luôn đổi $T(\\text{K}) = t(^\\circ\\text{C}) + 273$ trước khi áp dụng mọi công thức chất khí.',
      miniQuiz: [
        {
          id: 'p12th-s2-q1',
          question: 'Nén đẳng nhiệt một khối khí từ thể tích $12\\text{ lít}$ ở áp suất $1\\text{ atm}$ xuống còn $3\\text{ lít}$. Áp suất mới của khí là:',
          options: ['A. $0{,}25\\text{ atm}$', 'B. $4\\text{ atm}$', 'C. $3\\text{ atm}$', 'D. $9\\text{ atm}$'],
          correctIndex: 1,
          explanation: '$p_2 = \\frac{p_1 V_1}{V_2} = \\frac{1\\cdot 12}{3} = 4\\text{ atm}$.'
        },
        {
          id: 'p12th-s2-q2',
          question: 'Một bình kín (thể tích không đổi) chứa khí ở $27^\\circ\\text{C}$ và áp suất $2\\text{ atm}$. Khi nung nóng lên tới $327^\\circ\\text{C}$, áp suất khí trong bình bằng:',
          options: ['A. $24{,}2\\text{ atm}$', 'B. $4\\text{ atm}$', 'C. $1\\text{ atm}$', 'D. $6\\text{ atm}$'],
          correctIndex: 1,
          explanation: 'Đổi $T_1 = 300\\text{ K}, T_2 = 600\\text{ K}$. Đẳng tích: $p_2 = p_1\\frac{T_2}{T_1} = 2\\cdot\\frac{600}{300} = 4\\text{ atm}$.'
        }
      ],
      miniEssay: {
        id: 'p12th-s2-e1',
        question: 'Tại sao lốp xe đạp bơm quá căng nếu để ngoài trời nắng gắt buổi trưa dễ bị nổ lốp?',
        hint: 'Thể tích lốp gần như không đổi (đẳng tích), xét sự tăng áp suất khi nhiệt độ không khí trong lốp tăng.',
        rubricChecklist: [
          'Thể tích săm/lốp xe giữ gần như không đổi ($V \\approx \\text{const}$).',
          'Nhiệt độ $T$ tăng cao dưới nắng làm các phân tử khí chuyển động nhanh, va chạm mạnh hơn khiến áp suất $p$ tăng tỉ lệ thuận vượt quá giới hạn bền cao su.'
        ],
        sampleAnswer: 'Do vỏ lốp tương đối cứng nên khi để dưới trời nắng gắt, thể tích khí bên trong thay đổi rất ít (gần như đẳng tích). Nhiệt độ tăng làm động năng phân tử khí tăng, áp suất bên trong lốp tăng tỉ lệ thuận với nhiệt độ tuyệt đối $T$ (cộng thêm sự giãn nở nhẹ làm yếu cao su), vượt quá áp suất chịu đựng giới hạn của thành lốp dẫn đến nổ.'
      }
    },
    {
      stepTitle: '3. Động học Phân tử Khí & Động năng Tịnh tiến Trung bình',
      stepType: 'example',
      conceptSection:
        'Áp suất chất khí tác dụng lên thành bình được giải thích từ sự va chạm đàn hồi liên tục của hàng tỉ tỉ phân tử khí chuyển động hỗn loạn không ngừng.',
      formulaSection: {
        primaryFormula: 'p = \\frac{1}{3}\\mu m v_{\\text{rms}}^2 = \\frac{2}{3}\\mu \\overline{W}_đ',
        secondaryFormulas: [
          '\\overline{W}_đ = \\frac{3}{2} k T \\quad (k = 1{,}38\\cdot 10^{-23}\\text{ J/K})',
          'v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}}'
        ],
        variablesNote:
          '• $\\mu = N/V$: mật độ phân tử khí ($\\text{m}^{-3}$); $k = R/N_A$: hằng số Boltzmann.\n• **Nhiệt độ tuyệt đối $T$ là thước đo trực tiếp động năng trung bình của phân tử**: các khí khác nhau (Hydro, Oxy, Nitơ) ở **cùng nhiệt độ $T$** luôn có **cùng động năng trung bình $\\overline{W}_đ$**!'
      },
      deepDiveSection:
        'Dù ở cùng nhiệt độ thì $\\overline{W}_đ = \\frac{1}{2}m v_{\\text{rms}}^2$ của mọi loại khí bằng nhau, nhưng phân tử nào nhẹ hơn ($M$ nhỏ hơn, như $\\text{H}_2, \\text{He}$) sẽ có căn bậc hai tốc độ bình phương $v_{\\text{rms}}$ lớn hơn rất nhiều — đó là lý do Trái Đất giữ được khí nặng ($\\text{O}_2, \\text{N}_2$) còn khí nhẹ $\\text{H}_2$ dễ thoát khỏi khí quyển!',
      teacherExplanation:
        'Nhớ rõ: cùng nhiệt độ $T \\implies$ cùng $\\overline{W}_đ$, còn tốc độ thì tỉ lệ nghịch với $\\sqrt{M}$.',
      keyTakeaway: 'Động năng tịnh tiến trung bình phân tử khí lí tưởng chỉ phụ thuộc vào nhiệt độ $T$: $\\overline{W}_đ = \\frac{3}{2}kT$.',
      miniQuiz: [
        {
          id: 'p12th-s3-q1',
          question: 'Khi nhiệt độ tuyệt đối của một khối khí lí tưởng tăng từ $300\\text{ K}$ lên $600\\text{ K}$, động năng tịnh tiến trung bình của mỗi phân tử khí sẽ:',
          options: ['A. Tăng $\\sqrt{2}$ lần', 'B. Tăng 2 lần', 'C. Tăng 4 lần', 'D. Không đổi'],
          correctIndex: 1,
          explanation: '$\\overline{W}_đ = \\frac{3}{2}kT$ tỉ lệ thuận bậc nhất với $T$ nên tăng 2 lần.'
        },
        {
          id: 'p12th-s3-q2',
          question: 'Ở cùng nhiệt độ phòng $27^\\circ\\text{C}$, so sánh tốc độ căn quân phương $v_{\\text{rms}}$ của phân tử khí Hiđrô ($M = 2\\text{ g/mol}$) và khí Ôxi ($M = 32\\text{ g/mol}$):',
          options: ['A. Bằng nhau', 'B. Hiđrô nhanh gấp 4 lần Ôxi', 'C. Hiđrô nhanh gấp 16 lần Ôxi', 'D. Ôxi nhanh gấp 4 lần Hiđrô'],
          correctIndex: 1,
          explanation: '$\\frac{v_{\\text{H}_2}}{v_{\\text{O}_2}} = \\sqrt{\\frac{32}{2}} = \\sqrt{16} = 4$.'
        }
      ],
      miniEssay: {
        id: 'p12th-s3-e1',
        question: 'Tính động năng tịnh tiến trung bình (theo Jun) của mỗi phân tử khí ở nhiệt độ $27^\\circ\\text{C}$ và căn bậc hai tốc độ bình phương của khí Nitơ ($M = 28\\text{ g/mol}$).',
        hint: 'Đổi $T = 300\\text{ K}$, $M = 0{,}028\\text{ kg/mol}$; dùng $\\overline{W}_đ = \\frac{3}{2}kT$ và $v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}}$.',
        rubricChecklist: [
          'Tính $\\overline{W}_đ = 1{,}5 \\cdot 1{,}38\\cdot 10^{-23}\\cdot 300 = 6{,}21\\cdot 10^{-21}\\text{ J}$.',
          'Tính $v_{\\text{rms}} = \\sqrt{\\frac{3\\cdot 8{,}31\\cdot 300}{0{,}028}} \\approx 517\\text{ m/s}$.'
        ],
        sampleAnswer: 'Đổi $T = 27 + 273 = 300\\text{ K}$ và $M = 0{,}028\\text{ kg/mol}$. Động năng trung bình mỗi phân tử là $\\overline{W}_đ = \\frac{3}{2} k T = 1{,}5 \\times 1{,}38\\cdot 10^{-23} \\times 300 = 6{,}21\\cdot 10^{-21}\\text{ J}$. Tốc độ căn quân phương phân tử Nitơ là $v_{\\text{rms}} = \\sqrt{\\frac{3\\cdot 8{,}31\\cdot 300}{0{,}028}} \\approx 517\\text{ m/s}$.'
      }
    }
  ],
  'phys-12-mag': [
    {
      stepTitle: '1. Lực Từ tác dụng lên Dây dẫn & Quy tắc Bàn tay trái',
      stepType: 'concept',
      conceptSection:
        'Từ trường tác dụng lực từ lên dòng điện đặt trong nó. Phương của lực từ vuông góc với cả đoạn dây mang dòng điện $\\vec{I}$ và vectơ cảm ứng từ $\\vec{B}$; chiều xác định bằng **quy tắc bàn tay trái**.',
      formulaSection: {
        primaryFormula: 'F = B I l \\sin\\theta',
        secondaryFormulas: [
          'B = 2\\cdot 10^{-7}\\frac{I}{r} \\text{ (dây thẳng)}, \\qquad B = 4\\pi\\cdot 10^{-7}\\frac{N I}{l} \\text{ (ống dây)}'
        ],
        variablesNote:
          '• $\\theta$: góc giữa vectơ $\\vec{B}$ và chiều dòng điện $I$. Nếu dây đặt **song song** đường sức từ ($\\theta = 0^\\circ$ hoặc $180^\\circ$) thì $F = 0$.\n• Đặt bàn tay trái hứng đường sức từ $\\vec{B}$ đâm vào lòng bàn tay, chiều từ cổ tay đến 4 ngón tay là chiều dòng điện $I$, ngón cái choãi $90^\\circ$ chỉ chiều lực từ $\\vec{F}$.'
      },
      deepDiveSection:
        'Hai dây dẫn thẳng song song mang hai dòng điện đặt cạnh nhau: nếu **cùng chiều thì hút nhau**, nếu **ngược chiều thì đẩy nhau** (trái ngược với điện tích cùng dấu đẩy nhau!). Đây là câu hỏi lý thuyết rất dễ bị nhầm lẫn.',
      teacherExplanation:
        'Khi làm bài cân bằng thanh kim loại mang dòng điện nằm ngang trong từ trường hoặc treo trên hai dây mảnh, luôn vẽ đủ $\\vec{P}, \\vec{F}_{\\text{từ}}$ và $\\vec{T}$ rồi chiếu trục.',
      keyTakeaway: 'Quy tắc bàn tay trái tìm lực $\\vec{F}$ ($F = BIl\\sin\\theta$); hai dòng điện song song cùng chiều thì hút nhau.',
      miniQuiz: [
        {
          id: 'p12mg-s1-q1',
          question: 'Đoạn dây dẫn dài $0{,}5\\text{ m}$ mang dòng điện $4\\text{ A}$ đặt hợp góc $30^\\circ$ với đường sức từ đều có $B = 0{,}2\\text{ T}$. Độ lớn lực từ tác dụng lên dây là:',
          options: ['A. $0{,}4\\text{ N}$', 'B. $0{,}2\\text{ N}$', 'C. $0{,}2\\sqrt{3}\\text{ N}$', 'D. $0{,}1\\text{ N}$'],
          correctIndex: 1,
          explanation: '$F = 0{,}2 \\cdot 4 \\cdot 0{,}5 \\cdot \\sin 30^\\circ = 0{,}2\\text{ N}$.'
        },
        {
          id: 'p12mg-s1-q2',
          question: 'Đặt một dây dẫn thẳng mang dòng điện nằm dọc song song với các đường sức từ đều của một nam châm chữ U. Lực từ tác dụng lên dây có độ lớn:',
          options: ['A. $BIl$', 'B. $0$', 'C. $0{,}5 BIl$', 'D. Tỉ lệ với $I^2$'],
          correctIndex: 1,
          explanation: 'Vì góc $\\theta = 0^\\circ$ (hoặc $180^\\circ$) nên $\\sin\\theta = 0 \\implies F = 0$.'
        }
      ],
      miniEssay: {
        id: 'p12mg-s1-e1',
        question: 'Thanh đồng MN dài $20\\text{ cm}$, khối lượng $10\\text{ g}$ được treo nằm ngang bằng hai sợi dây mảnh thẳng đứng trong từ trường đều $\\vec{B}$ thẳng đứng hướng lên ($B = 0{,}1\\text{ T}$, $g = 10\\text{ m/s}^2$). Cho dòng điện $I = 5\\text{ A}$ chạy từ M đến N. Tính lực căng mỗi dây treo.',
        hint: 'Vì $\\vec{B}$ thẳng đứng và dây nằm ngang nên lực từ $\\vec{F}$ có phương nằm ngang ($\vec{F} \\perp \\vec{P}$). Hợp lực treo $2T = \\sqrt{P^2 + F^2}$.',
        rubricChecklist: [
          'Tính $P = mg = 0{,}01\\cdot 10 = 0{,}1\\text{ N}$ và lực từ nằm ngang $F = 0{,}1\\cdot 5\\cdot 0{,}2 = 0{,}1\\text{ N}$.',
          'Tính lực căng tổng $T_{\\text{tổng}} = \\sqrt{0{,}1^2 + 0{,}1^2} = 0{,}1\\sqrt{2}\\text{ N} \\implies$ mỗi dây chịu $0{,}05\\sqrt{2} \\approx 0{,}0707\\text{ N}$.'
        ],
        sampleAnswer: 'Trọng lực hướng thẳng đứng xuống: $P = 0{,}01\\cdot 10 = 0{,}1\\text{ N}$. Áp dụng quy tắc bàn tay trái, lực từ hướng nằm ngang vuông góc thanh với độ lớn $F = BIl = 0{,}1\\cdot 5\\cdot 0{,}2 = 0{,}1\\text{ N}$. Khi thanh cân bằng, tổng lực căng hai dây cân bằng hợp lực $\\vec{P} + \\vec{F}$: $2T = \\sqrt{P^2 + F^2} = 0{,}1\\sqrt{2}\\text{ N}$, suy ra mỗi dây chịu lực căng $T = 0{,}05\\sqrt{2} \\approx 0{,}071\\text{ N}$.'
      }
    },
    {
      stepTitle: '2. Lực Lorentz & Chuyển động Hạt mang điện trong Từ trường',
      stepType: 'derivation',
      conceptSection:
        'Mọi hạt mang điện tích $q$ chuyển động với vận tốc $\\vec{v}$ trong từ trường đều $\\vec{B}$ đều chịu tác dụng lực Lorentz $\\vec{f}$ vuông góc với cả $\\vec{v}$ và $\\vec{B}$.',
      formulaSection: {
        primaryFormula: 'f = |q| v B \\sin\\alpha, \\qquad R = \\frac{m v}{|q| B} \\quad (\\text{khi } \\vec{v} \\perp \\vec{B})',
        secondaryFormulas: [
          'T = \\frac{2\\pi m}{|q| B} \\quad (\\text{chu kì quay độc lập với vận tốc } v)'
        ],
        variablesNote:
          '• Khi áp dụng quy tắc bàn tay trái cho **hạt mang điện âm** ($q < 0$, như electron): chiều ngón tay phải hướng **ngược lại** chiều chuyển động $\\vec{v}$ (hoặc lật ngược chiều ngón cái).\n• Vì $\\vec{f} \\perp \\vec{v}$ nên lực Lorentz **không sinh công** và không làm thay đổi độ lớn vận tốc $v$, chỉ đóng vai trò lực hướng tâm bẻ cong quỹ đạo thành đường tròn!'
      },
      deepDiveSection:
        'Tính chất kỳ diệu $T = \\frac{2\\pi m}{|q| B}$ (không phụ thuộc $v$ và $R$) là cơ sở chế tạo máy gia tốc hạt **Cyclotron** và máy khối phổ tách đồng vị nguyên tử theo tỉ số $m/q$.',
      teacherExplanation:
        'Dù tốc độ $v$ lớn hay nhỏ, hạt bay vuông góc vào từ trường đều luôn hoàn thành 1 vòng quay trong cùng chu kì $T$!',
      keyTakeaway: 'Lực Lorentz luôn vuông góc vận tốc nên đóng vai trò lực hướng tâm, giữ nguyên tốc độ hạt.',
      miniQuiz: [
        {
          id: 'p12mg-s2-q1',
          question: 'Một proton bay vuông góc vào từ trường đều $B$ với tốc độ $v$ thì chuyển động tròn bán kính $R$. Nếu tăng tốc độ bay lên $2v$ và giữ nguyên $B$, bán kính quỹ đạo mới là:',
          options: ['A. $R/2$', 'B. $R$', 'C. $2R$', 'D. $4R$'],
          correctIndex: 2,
          explanation: '$R = \\frac{mv}{|q|B}$ tỉ lệ thuận bậc nhất với $v$, nên $v$ tăng 2 lần thì $R$ tăng 2 lần.'
        },
        {
          id: 'p12mg-s2-q2',
          question: 'Khi hạt mang điện bay vào từ trường đều theo hướng hợp với $\\vec{B}$ góc $0^\\circ$, lực Lorentz tác dụng lên hạt bằng:',
          options: ['A. $|q|vB$', 'B. $0$', 'C. $mv^2/R$', 'D. $0{,}5|q|vB$'],
          correctIndex: 1,
          explanation: '$\\sin 0^\\circ = 0 \\implies f = 0$, hạt tiếp tục chuyển động thẳng đều.'
        }
      ],
      miniEssay: {
        id: 'p12mg-s2-e1',
        question: 'Chứng minh rằng lực từ Lorentz tác dụng lên một hạt mang điện chuyển động trong từ trường đều không thể làm tăng động năng của hạt.',
        hint: 'Xét góc giữa vectơ lực Lorentz $\\vec{f}$ và vectơ dịch chuyển tức thời $\\vec{v}dt$.',
        rubricChecklist: [
          'Nêu $\\vec{f}$ luôn vuông góc với $\\vec{v}$ tại mọi điểm trên quỹ đạo.',
          'Công tức thời $dA = \\vec{f}\\cdot \\vec{v}\\,dt = 0 \\implies \\Delta W_đ = 0$ nên động năng và tốc độ $|v|$ luôn không đổi.'
        ],
        sampleAnswer: 'Lực Lorentz $\\vec{f}$ luôn vuông góc với vectơ vận tốc $\\vec{v}$ của hạt mang điện. Do đó trên mọi đoạn dịch chuyển nhỏ $d\\vec{s} = \\vec{v}\\,dt$, công của lực Lorentz luôn bằng $dA = \\vec{f}\\cdot d\\vec{s} = 0$. Theo định lý động năng, $\\Delta W_đ = A = 0$, suy ra từ trường tĩnh không thể thay đổi động năng hay tốc độ của hạt, chỉ làm đổi hướng chuyển động.'
      }
    },
    {
      stepTitle: '3. Từ thông, Định luật Faraday & Quy tắc Lenz',
      stepType: 'example',
      conceptSection:
        'Từ thông $\\Phi$ đo lượng đường sức từ xuyên qua diện tích $S$. Khi từ thông qua mạch kín biến thiên, trong mạch xuất hiện suất điện động cảm ứng chống lại sự biến thiên đó (Định luật Lenz).',
      formulaSection: {
        primaryFormula: '\\Phi = N B S \\cos\\alpha, \\qquad e_c = -\\frac{\\Delta\\Phi}{\\Delta t}',
        secondaryFormulas: [
          '|e_c| = N\\frac{|\\Delta(B S \\cos\\alpha)|}{\\Delta t}',
          '\\text{Thanh dài } l \\text{ cắt đường sức: } |e_c| = B l v \\sin\\theta'
        ],
        variablesNote:
          '• **Cảnh giác góc $\\alpha$**: $\\alpha$ là góc giữa $\\vec{B}$ và **pháp tuyến $\\vec{n}$** của mặt phẳng khung dây! Nếu đề cho góc giữa $\\vec{B}$ và **mặt phẳng khung dây** là $\\beta$, thì $\\alpha = 90^\\circ - \\beta$ (tức $\\cos\\alpha = \\sin\\beta$).\n• Dấu trừ trong công thức Faraday thể hiện Định luật Lenz.'
      },
      deepDiveSection:
        'Cách áp dụng Định luật Lenz 2 bước:\n• Nếu từ thông đang **tăng**: cảm ứng từ do dòng cảm ứng sinh ra $\\vec{B}_c$ **ngược chiều** $\\vec{B}$ ban đầu (để cản sự tăng).\n• Nếu từ thông đang **giảm**: $\\vec{B}_c$ **cùng chiều** $\\vec{B}$ ban đầu (để níu giữ). Sau đó dùng quy tắc nắm tay phải suy ra chiều dòng $I_c$.',
      teacherExplanation:
        'Đọc kỹ đề bài từ thông cho góc hợp với "pháp tuyến" hay hợp với "mặt phẳng khung dây" — đây là lỗi mất điểm số 1.',
      keyTakeaway: '$\\Phi = NBS\\cos\\alpha$ với $\\alpha = (\\vec{B}, \\vec{n})$; $|e_c| = |\\Delta\\Phi/\\Delta t|$.',
      miniQuiz: [
        {
          id: 'p12mg-s3-q1',
          question: 'Khung dây phẳng gồm 100 vòng, diện tích mỗi vòng $20\\text{ cm}^2$ đặt trong từ trường đều vuông góc mặt khung. Cảm ứng từ giảm đều từ $0{,}5\\text{ T}$ về $0$ trong $0{,}1\\text{ s}$. Độ lớn suất điện động cảm ứng là:',
          options: ['A. $0{,}1\\text{ V}$', 'B. $1\\text{ V}$', 'C. $10\\text{ V}$', 'D. $0{,}01\\text{ V}$'],
          correctIndex: 1,
          explanation: '$\\Delta\\Phi = 100\\cdot 0{,}5\\cdot 20\\cdot 10^{-4}\\cdot\\cos 0^\\circ = 0{,}1\\text{ Wb} \\implies |e_c| = \\frac{0{,}1}{0{,}1} = 1\\text{ V}$.'
        },
        {
          id: 'p12mg-s3-q2',
          question: 'Một khung dây đặt trong từ trường đều sao cho mặt phẳng khung dây hợp với vectơ $\\vec{B}$ một góc $30^\\circ$. Góc $\\alpha$ dùng trong công thức $\\Phi = BS\\cos\\alpha$ bằng:',
          options: ['A. $30^\\circ$', 'B. $60^\\circ$', 'C. $0^\\circ$', 'D. $90^\\circ$'],
          correctIndex: 1,
          explanation: 'Pháp tuyến vuông góc mặt khung nên góc hợp với $\\vec{B}$ là $\\alpha = 90^\\circ - 30^\\circ = 60^\\circ$.'
        }
      ],
      miniEssay: {
        id: 'p12mg-s3-e1',
        question: 'Đưa cực Bắc (N) của một thanh nam châm thẳng tiến lại gần mặt một vòng dây kín theo phương vuông góc. Xác định mặt đối diện nam châm của vòng dây là cực Bắc hay cực Nam của dòng cảm ứng và giải thích.',
        hint: 'Theo Định luật Lenz, vòng dây phải sinh từ trường chống lại chuyển động tiến lại gần của nam châm.',
        rubricChecklist: [
          'Khi cực N tiến lại gần, từ thông tăng $\\implies$ vòng dây sinh từ trường chống lại bằng cách đẩy nam châm ra.',
          'Để đẩy cực N, mặt vòng dây đối diện nam châm phải là cực Bắc (N) — tức dòng cảm ứng nhìn từ phía nam châm chạy ngược chiều kim đồng hồ.'
        ],
        sampleAnswer: 'Khi cực Bắc (N) nam châm tiến lại gần vòng dây, từ thông xuyên qua vòng dây tăng lên. Theo định luật Lenz, dòng điện cảm ứng sinh ra phải tạo từ trường $\\vec{B}_c$ ngược chiều từ trường ngoài để chống lại sự tăng đó (tạo lực đẩy cản nam châm tiến vào). Muốn đẩy cực N, mặt vòng dây đối diện với nam châm cũng phải mang cực Bắc (N).'
      }
    }
  ],
  'phys-12-optics-q': [
    {
      stepTitle: '1. Thuyết Lượng tử Ánh sáng & Công thoát Electron',
      stepType: 'concept',
      conceptSection:
        'Ánh sáng được tạo thành bởi các hạt mang năng lượng xác định gọi là **phôtôn**. Với mỗi ánh sáng đơn sắc tần số $f$, mọi phôtôn đều giống nhau và mang năng lượng lượng tử $\\varepsilon = hf$.',
      formulaSection: {
        primaryFormula: '\\varepsilon = h f = \\frac{h c}{\\lambda}, \\qquad \\lambda_0 = \\frac{h c}{A}',
        secondaryFormulas: [
          'h c \\approx 1{,}9875\\cdot 10^{-25}\\text{ J}\\cdot\\text{m} \\approx 1{,}242\\text{ eV}\\cdot\\mu\\text{m}'
        ],
        variablesNote:
          '• $h = 6{,}625\\cdot 10^{-34}\\text{ J}\\cdot\\text{s}$ (hằng số Planck); $1\\text{ eV} = 1{,}6\\cdot 10^{-19}\\text{ J}$.\n• Điều kiện xảy ra hiện tượng quang điện ngoài: $\\lambda \\le \\lambda_0$ (hay $f \\ge f_0$, $\\varepsilon \\ge A$).\n• Trong chân không phôtôn bay tốc độ $c$; **không có phôtôn đứng yên**!'
      },
      deepDiveSection:
        'Bí quyết tính nhanh không cần bấm số mũ $-34$: dùng hằng số quy đổi $hc \\approx 1{,}242\\text{ eV}\\cdot\\mu\\text{m}$! Ví dụ ánh sáng $\\lambda = 0{,}5\\,\\mu\\text{m}$ có năng lượng $\\varepsilon = \\frac{1{,}242}{0{,}5} = 2{,}484\\text{ eV}$; nếu công thoát $A = 2{,}1\\text{ eV}$ thì quang điện chắc chắn xảy ra.',
      teacherExplanation:
        'Xảy ra quang điện hay không chỉ phụ thuộc **bước sóng $\\lambda$** (tức màu ánh sáng), KHÔNG phụ thuộc chùm sáng mạnh hay yếu (cường độ sáng)!',
      keyTakeaway: 'Điều kiện quang điện ngoài: $\\lambda \\le \\lambda_0 = hc/A$; ánh sáng càng mạnh chỉ tăng số phôtôn chứ không tăng năng lượng từng phôtôn.',
      miniQuiz: [
        {
          id: 'p12oq-s1-q1',
          question: 'Kim loại làm catôt có công thoát electron là $A = 3{,}31\\text{ eV}$ ($\approx 5{,}3\\cdot 10^{-19}\\text{ J}$). Giới hạn quang điện $\\lambda_0$ xấp xỉ:',
          options: ['A. $0{,}25\\,\\mu\\text{m}$', 'B. $0{,}375\\,\\mu\\text{m}$', 'C. $0{,}55\\,\\mu\\text{m}$', 'D. $0{,}66\\,\\mu\\text{m}$'],
          correctIndex: 1,
          explanation: '$\\lambda_0 = \\frac{1{,}9875\\cdot 10^{-25}}{5{,}3\\cdot 10^{-19}} \\approx 0{,}375\\,\\mu\\text{m}$.'
        },
        {
          id: 'p12oq-s1-q2',
          question: 'Chiếu chùm sáng đỏ ($\lambda > \\lambda_0$) vào tấm kẽm mang điện âm. Nếu tăng công suất nguồn sáng đỏ lên gấp 100 lần thì:',
          options: [
            'A. Electron bắn ra rất nhanh',
            'B. Xảy ra quang điện nếu chiếu đủ lâu',
            'C. Vẫn không có electron nào bứt ra khỏi tấm kẽm',
            'D. Tấm kẽm chuyển sang mang điện dương'
          ],
          correctIndex: 2,
          explanation: 'Mỗi phôtôn ánh sáng đỏ có $\\varepsilon < A$ nên không đủ năng lượng giải phóng electron dù tăng cường độ sáng.'
        }
      ],
      miniEssay: {
        id: 'p12oq-s1-e1',
        question: 'Tại sao tính chất sóng cổ điển của ánh sáng không thể giải thích được sự tồn tại của giới hạn quang điện $\\lambda_0$?',
        hint: 'Theo thuyết sóng cổ điển, năng lượng truyền cho electron tỉ lệ với cường độ chùm sáng và thời gian chiếu.',
        rubricChecklist: [
          'Theo thuyết sóng cổ điển, ánh sáng có bước sóng nào miễn cường độ đủ mạnh hoặc chiếu đủ lâu cũng sẽ tích lũy đủ năng lượng làm bật electron.',
          'Thực nghiệm cho thấy nếu $\\lambda > \\lambda_0$ thì dù chùm sáng mạnh đến đâu vẫn không bật electron — chỉ thuyết lượng tử phôtôn hấp thụ từng hạt $hf \\ge A$ mới giải thích được.'
        ],
        sampleAnswer: 'Theo lý thuyết sóng điện từ cổ điển, biên độ sóng (cường độ sáng) càng lớn thì năng lượng truyền cho electron càng lớn nên mọi màu ánh sáng nếu chiếu đủ mạnh hoặc đủ lâu đều phải bứt được electron. Thực tế với $\\lambda > \\lambda_0$, tăng cường độ sáng thế nào cũng không có quang điện. Thuyết lượng tử giải thích đúng nhờ cơ chế mỗi electron chỉ hấp thụ trọn vẹn $1$ phôtôn: nếu $hc/\\lambda < A$ thì electron không thể thoát ra.'
      }
    },
    {
      stepTitle: '2. Quang điện Trong, Pin Quang điện & Huỳnh quang',
      stepType: 'derivation',
      conceptSection:
        'Ngoài quang điện ngoài (electron bật ra khỏi kim loại), ánh sáng còn gây ra **quang điện trong** ở chất bán dẫn: giải phóng electron liên kết thành electron dẫn và lỗ trống ngay bên trong khối bán dẫn.',
      formulaSection: {
        primaryFormula: '\\varepsilon = A_{\\text{quang điện}} + W_{đ0\\max} \\quad (\\text{ngoài})',
        secondaryFormulas: [
          '\\lambda_0(\\text{bán dẫn}) \\text{ thường lớn hơn (vùng hồng ngoại) vì } A_{\\text{trong}} \\ll A_{\\text{ngoài}}'
        ],
        variablesNote:
          '• **Quang điện trở** và **Pin quang điện (Pin Mặt Trời)** hoạt động dựa trên **hiện tượng quang điện trong**.\n• Hiện tượng **quang – phát quang**: vật hấp thụ ánh sáng bước sóng ngắn hơn và phát ra ánh sáng bước sóng dài hơn ($\\lambda_{\\text{phát}} > \\lambda_{\\text{kích thích}}$ theo định luật Stokes).'
      },
      deepDiveSection:
        'Tại sao trong phòng tối, bột huỳnh quang màu lục lại phát sáng mạnh khi chiếu tia cực tím ($\lambda_{\\text{tím}}$ ngắn), nhưng hoàn toàn không phát sáng khi chiếu ánh sáng đỏ ($\lambda_{\\text{đỏ}}$ dài)? Vì năng lượng phôtôn kích thích phải lớn hơn hoặc bằng năng lượng phôtôn phát ra ($hf_{\\text{kt}} > hf_{\\text{phát}} \\iff \\lambda_{\\text{kt}} < \\lambda_{\\text{phát}}$).',
      teacherExplanation:
        'Ghi nhớ: Quang điện trở & Pin Mặt Trời $\\to$ quang điện **trong**; tế bào quang điện chân không $\\to$ quang điện **ngoài**.',
      keyTakeaway: 'Pin Mặt Trời dùng quang điện trong; ánh sáng phát quang luôn có bước sóng DÀI hơn ánh sáng kích thích.',
      miniQuiz: [
        {
          id: 'p12oq-s2-q1',
          question: 'Pin quang điện (pin Mặt Trời) chuyển hóa trực tiếp quang năng thành điện năng dựa trên hiện tượng:',
          options: ['A. Quang điện ngoài', 'B. Quang điện trong', 'C. Nhiệt điện', 'D. Cộng hưởng ánh sáng'],
          correctIndex: 1,
          explanation: 'Pin quang điện dựa trên hiện tượng quang điện trong bên cạnh lớp tiếp xúc p–n của chất bán dẫn.'
        },
        {
          id: 'p12oq-s2-q2',
          question: 'Một chất huỳnh quang phát ra ánh sáng màu lục ($\\lambda = 0{,}55\\,\\mu\\text{m}$). Ánh sáng nào sau đây KHÔNG THỂ kích thích chất này phát quang?',
          options: ['A. Tia tử ngoại ($0{,}30\\,\\mu\\text{m}$)', 'B. Ánh sáng tím ($0{,}40\\,\\mu\\text{m}$)', 'C. Ánh sáng lam ($0{,}46\\,\\mu\\text{m}$)', 'D. Ánh sáng đỏ ($0{,}68\\,\\mu\\text{m}$)'],
          correctIndex: 3,
          explanation: 'Phải có $\\lambda_{\\text{kích thích}} < \\lambda_{\\text{phát}} = 0{,}55\\,\\mu\\text{m}$, nên ánh sáng đỏ $0{,}68\\,\\mu\\text{m}$ không đủ năng lượng phôtôn.'
        }
      ],
      miniEssay: {
        id: 'p12oq-s2-e1',
        question: 'So sánh 2 điểm khác nhau giữa hiện tượng Quang điện ngoài và hiện tượng Quang điện trong.',
        hint: 'So sánh loại vật liệu xảy ra và vị trí giải phóng electron sau khi hấp thụ phôtôn.',
        rubricChecklist: [
          'Vật liệu: quang điện ngoài thường ở kim loại; quang điện trong xảy ra ở chất bán dẫn.',
          'Trạng thái electron: quang điện ngoài electron thoát hẳn ra khỏi bề mặt vật; quang điện trong electron vẫn ở trong khối bán dẫn để trở thành hạt dẫn tự do (cùng lỗ trống).'
        ],
        sampleAnswer: '1) Vật liệu: quang điện ngoài xảy ra ở kim loại (hoặc hợp kim), còn quang điện trong xảy ra ở chất bán dẫn (Si, Ge, CdS). 2) Cơ chế: ở quang điện ngoài, electron thoát hẳn ra ngoài bề mặt vật vào chân không/không khí; ở quang điện trong, electron liên kết bứt khỏi mối liên kết trở thành electron dẫn tự do di chuyển bên trong khối bán dẫn (tạo thêm cặp electron – lỗ trống), làm độ dẫn điện tăng vọt.'
      }
    },
    {
      stepTitle: '3. Mẫu nguyên tử Bohr & Quang phổ Vạch của Hyđrô',
      stepType: 'example',
      conceptSection:
        'Bohr kết hợp mô hình hành tinh nguyên tử Rutherford với hai tiên đề lượng tử: nguyên tử chỉ tồn tại trong các **trạng thái dừng** có năng lượng xác định $E_n$ (không bức xạ), và chỉ hấp thụ hoặc phát ra phôtôn khi nhảy mức.',
      formulaSection: {
        primaryFormula: '\\varepsilon = hf_{mn} = E_{\\text{cao}} - E_{\\text{thấp}}, \\qquad E_n = -\\frac{13{,}6}{n^2}\\text{ (eV)}',
        secondaryFormulas: [
          'r_n = n^2 r_0 \\quad (r_0 = 5{,}3\\cdot 10^{-11}\\text{ m})'
        ],
        variablesNote:
          '• Các quỹ đạo dừng từ trong ra ngoài ($n = 1, 2, 3, 4, 5, 6$): tên gọi **K, L, M, N, O, P**.\n• Khi đang ở mức kích thích thứ $n$, số vạch quang phổ tối đa có thể phát ra khi chuyển về các mức thấp hơn là $\\frac{n(n-1)}{2}$.'
      },
      deepDiveSection:
        'Ba dãy quang phổ vạch quan trọng của Hyđrô:\n• **Dãy Lyman** (nhảy về $n = 1$ / quỹ đạo K): nằm trong vùng **Tử ngoại**.\n• **Dãy Balmer** (nhảy về $n = 2$ / quỹ đạo L): một phần vùng **Ánh sáng nhìn thấy** ($H_\\alpha$ đỏ, $H_\\beta$ lam, $H_\\gamma$ chàm, $H_\\delta$ tím) và phần còn lại tử ngoại.\n• **Dãy Paschen** (nhảy về $n = 3$ / quỹ đạo M): vùng **Hồng ngoại**.',
      teacherExplanation:
        'Nhớ quy tắc bậc thang năng lượng: $1 \\to 2 \\to 3$ là K – L – M; nhảy về K (nhảy sâu nhất, năng lượng lớn nhất) $\\implies$ Tử ngoại (Lyman).',
      keyTakeaway: 'Trạng thái dừng không bức xạ; khi chuyển mức phát ra phôtôn $\\frac{hc}{\\lambda} = E_{\\text{cao}} - E_{\\text{thấp}}$.',
      miniQuiz: [
        {
          id: 'p12oq-s3-q1',
          question: 'Theo mẫu nguyên tử Bohr của nguyên tử Hyđrô, bán kính quỹ đạo dừng N ($n = 4$) bằng bao nhiêu lần bán kính Bohr $r_0$?',
          options: ['A. $4 r_0$', 'B. $8 r_0$', 'C. $16 r_0$', 'D. $9 r_0$'],
          correctIndex: 2,
          explanation: 'Các mức K, L, M, N ứng với $n = 1, 2, 3, 4$, nên $r_N = 4^2 r_0 = 16 r_0$.'
        },
        {
          id: 'p12oq-s3-q2',
          question: 'Khi đám nguyên tử Hyđrô đang ở trạng thái kích thích $n = 4$ (mức N) chuyển về các trạng thái dừng thấp hơn, số vạch bức xạ tối đa có thể thu được là:',
          options: ['A. 3 vạch', 'B. 4 vạch', 'C. 6 vạch', 'D. 10 vạch'],
          correctIndex: 2,
          explanation: 'Số vạch tối đa là tổ hợp $\\frac{4(4-1)}{2} = 6$ vạch ($4\\to 3, 4\\to 2, 4\\to 1, 3\\to 2, 3\\to 1, 2\\to 1$).'
        }
      ],
      miniEssay: {
        id: 'p12oq-s3-e1',
        question: 'Tính bước sóng của vạch đỏ $H_\\alpha$ trong quang phổ Hyđrô khi electron chuyển từ mức M ($n = 3$) về mức L ($n = 2$), biết $E_n = -\\frac{13{,}6}{n^2}\\text{ eV}$ và $hc = 1{,}242\\text{ eV}\\cdot\\mu\\text{m}$.',
        hint: 'Tính $E_3 = -1{,}51\\text{ eV}$, $E_2 = -3{,}4\\text{ eV}$, lấy hiệu $\\Delta E = E_3 - E_2$ rồi tính $\\lambda = hc/\\Delta E$.',
        rubricChecklist: [
          'Tính $E_3 = -13{,}6/9 \\approx -1{,}511\\text{ eV}$, $E_2 = -13{,}6/4 = -3{,}40\\text{ eV} \\implies \\Delta E = 1{,}889\\text{ eV}$.',
          'Tính $\\lambda = 1{,}242 / 1{,}889 \\approx 0{,}657\\,\\mu\\text{m}$ (ánh sáng đỏ).'
        ],
        sampleAnswer: 'Năng lượng ở mức M ($n = 3$) là $E_3 = -\\frac{13{,}6}{9} \\approx -1{,}511\\text{ eV}$; ở mức L ($n = 2$) là $E_2 = -\\frac{13{,}6}{4} = -3{,}40\\text{ eV}$. Năng lượng phôtôn phát ra là $\\varepsilon = E_3 - E_2 = 1{,}889\\text{ eV}$. Bước sóng vạch $H_\\alpha$ là $\\lambda = \\frac{hc}{\\varepsilon} = \\frac{1{,}242}{1{,}889} \\approx 0{,}657\\,\\mu\\text{m}$ (màu đỏ).'
      }
    }
  ],
  'phys-12-nuclear': [
    {
      stepTitle: '1. Cấu trúc Hạt nhân, Độ hụt khối & Năng lượng Liên kết riêng',
      stepType: 'concept',
      conceptSection:
        'Hạt nhân nguyên tử ${}^A_Z X$ gồm $Z$ prôtôn mang điện dương và $N = A - Z$ nơtron không mang điện. Tổng khối lượng của các nuclôn rời rạc luôn lớn hơn khối lượng hạt nhân tạo thành — phần chênh lệch đó chính là **độ hụt khối** $\\Delta m$.',
      formulaSection: {
        primaryFormula: '\\Delta m = Z m_p + (A - Z)m_n - m_X, \\qquad W_{\\text{lk}} = \\Delta m\\cdot c^2',
        secondaryFormulas: [
          'W_{\\text{lkr}} = \\frac{W_{\\text{lk}}}{A}, \\qquad 1\\text{ u}\\cdot c^2 \\approx 931{,}5\\text{ MeV}'
        ],
        variablesNote:
          '• **Cực kỳ quan trọng**: hạt nhân nào bền vững nhất KHÔNG dựa vào $W_{\\text{lk}}$ lớn nhất, mà dựa vào **Năng lượng liên kết riêng $W_{\\text{lkr}}$ LỚN NHẤT** (đạt cực đại ở nhóm hạt nhân trung bình $50 \\le A \\le 70$ như ${}^{56}\\text{Fe}$).'
      },
      deepDiveSection:
        'Theo hệ thức Einstein $E = mc^2$, độ hụt khối $\\Delta m$ biến thành năng lượng liên kết giữ các prôtôn đẩy nhau đứng sát trong bán kính $10^{-15}\\text{ m}$ nhờ **lực tương tác mạnh** (lực hạt nhân — chỉ tác dụng trong bán kính kích thước hạt nhân, không phụ thuộc điện tích).',
      teacherExplanation:
        'Khi so sánh độ bền vững giữa hai hạt nhân, luôn lấy $W_{\\text{lk}}$ chia cho số khối $A$ để so sánh $W_{\\text{lkr}}$.',
      keyTakeaway: 'Hạt nhân có năng lượng liên kết riêng ($W_{\\text{lk}}/A$) càng lớn thì càng bền vững.',
      miniQuiz: [
        {
          id: 'p12nc-s1-q1',
          question: 'Hạt nhân ${}^{14}_6\\text{C}$ chứa bao nhiêu prôtôn và bao nhiêu nơtron?',
          options: ['A. 14 prôtôn, 6 nơtron', 'B. 6 prôtôn, 14 nơtron', 'C. 6 prôtôn, 8 nơtron', 'D. 8 prôtôn, 6 nơtron'],
          correctIndex: 2,
          explanation: 'Số prôtôn $Z = 6$; số nơtron $N = A - Z = 14 - 6 = 8$.'
        },
        {
          id: 'p12nc-s1-q2',
          question: 'Đại lượng nào đặc trưng cho mức độ bền vững của một hạt nhân?',
          options: [
            'A. Khối lượng hạt nhân',
            'B. Số nuclôn $A$',
            'C. Năng lượng liên kết riêng $W_{\\text{lk}}/A$',
            'D. Điện tích hạt nhân $Z$'
          ],
          correctIndex: 2,
          explanation: 'Năng lượng liên kết tính cho một nuclôn ($W_{\\text{lk}}/A$) quyết định độ bền vững của hạt nhân.'
        }
      ],
      miniEssay: {
        id: 'p12nc-s1-e1',
        question: 'Tính năng lượng liên kết và năng lượng liên kết riêng của hạt nhân Heli ${}^4_2\\text{He}$, biết $m_p = 1{,}0073\\text{ u}$, $m_n = 1{,}0087\\text{ u}$, $m_{\\text{He}} = 4{,}0015\\text{ u}$, $1\\text{ u}c^2 = 931{,}5\\text{ MeV}$.',
        hint: 'Tính $\\Delta m = 2m_p + 2m_n - m_{\\text{He}}$, nhân $931{,}5$, rồi chia $4$.',
        rubricChecklist: [
          'Tính đúng $\\Delta m = 2(1{,}0073) + 2(1{,}0087) - 4{,}0015 = 0{,}0305\\text{ u}$.',
          'Tính $W_{\\text{lk}} = 0{,}0305\\cdot 931{,}5 \\approx 28{,}41\\text{ MeV}$, suy ra $W_{\\text{lkr}} = 28{,}41/4 \\approx 7{,}10\\text{ MeV/nuclôn}$.'
        ],
        sampleAnswer: 'Độ hụt khối của ${}^4_2\\text{He}$ là $\\Delta m = 2\\cdot 1{,}0073 + 2\\cdot 1{,}0087 - 4{,}0015 = 0{,}0305\\text{ u}$. Năng lượng liên kết là $W_{\\text{lk}} = 0{,}0305 \\times 931{,}5 \\approx 28{,}41\\text{ MeV}$. Năng lượng liên kết riêng bằng $W_{\\text{lkr}} = \\frac{28{,}41}{4} \\approx 7{,}10\\text{ MeV/nuclôn}$.'
      }
    },
    {
      stepTitle: '2. Phản ứng Hạt nhân, Phân hạch & Nhiệt hạch',
      stepType: 'derivation',
      conceptSection:
        'Trong mọi phản ứng hạt nhân đều tuân thủ 4 định luật bảo toàn: **Điện tích $Z$**, **Số nuclôn $A$**, **Năng lượng toàn phần** và **Động lượng** (KHÔNG có bảo toàn khối lượng hay số prôtôn riêng!).',
      formulaSection: {
        primaryFormula: '\\Delta E = (m_{\\text{trước}} - m_{\\text{sau}})c^2 = (\\Delta m_{\\text{sau}} - \\Delta m_{\\text{trước}})c^2',
        secondaryFormulas: [
          '\\Delta E = \\sum W_{\\text{lk sau}} - \\sum W_{\\text{lk trước}} = \\sum K_{\\text{sau}} - \\sum K_{\\text{trước}}'
        ],
        variablesNote:
          '• Nếu $\\Delta E > 0$: phản ứng **tỏa năng lượng** (khối lượng giảm, các hạt sản phẩm bền vững hơn).\n• **Phân hạch**: hạt nhân rất nặng ($U, Pu$) vỡ thành 2 mảnh trung bình; **Nhiệt hạch**: 2 hạt nhân nhẹ ($H, D, T$) tổng hợp ở hàng chục triệu độ thành hạt nặng hơn.'
      },
      deepDiveSection:
        'Cẩn thận chiều trừ trong công thức năng lượng phản ứng $\\Delta E$: theo khối lượng nghỉ thì lấy **TRƯỚC trừ SAU** ($m_{\\text{trước}} - m_{\\text{sau}}$), nhưng theo độ hụt khối hoặc năng lượng liên kết hay động năng thì lấy **SAU trừ TRƯỚC** ($W_{\\text{lk sau}} - W_{\\text{lk trước}}$)!',
      teacherExplanation:
        'Hạt nhân tự phân rã phóng xạ luôn là phản ứng tỏa năng lượng ($\Delta E > 0$); tính theo 1 mol phản ứng nhớ nhân thêm $N_A = 6{,}02\\cdot 10^{23}$.',
      keyTakeaway: 'Tỏa năng lượng khi khối lượng sau nhỏ hơn khối lượng trước ($\\Delta E = (m_{\\text{trước}} - m_{\\text{sau}})c^2 > 0$).',
      miniQuiz: [
        {
          id: 'p12nc-s2-q1',
          question: 'Hoàn thành phương trình phản ứng hạt nhân: ${}^9_4\\text{Be} + {}^4_2\\text{He} \\to {}^{12}_6\\text{C} + X$. Hạt X là:',
          options: ['A. Prôtôn (${}^1_1\\text{p}$)', 'B. Nơtron (${}^1_0\\text{n}$)', 'C. Electron (${}^0_{-1}\\text{e}$)', 'D. Đơteri (${}^2_1\\text{H}$)'],
          correctIndex: 1,
          explanation: 'Bảo toàn $A$: $9 + 4 = 12 + A_X \\implies A_X = 1$. Bảo toàn $Z$: $4 + 2 = 6 + Z_X \\implies Z_X = 0$. Vậy $X$ là nơtron.'
        },
        {
          id: 'p12nc-s2-q2',
          question: 'Đại lượng nào sau đây KHÔNG được bảo toàn trong một phản ứng hạt nhân?',
          options: ['A. Số nuclôn (số khối)', 'B. Điện tích', 'C. Khối lượng nghỉ', 'D. Động lượng'],
          correctIndex: 2,
          explanation: 'Khối lượng nghỉ bị biến đổi thành năng lượng tỏa/thu nên không bảo toàn (chỉ năng lượng toàn phần mới bảo toàn).'
        }
      ],
      miniEssay: {
        id: 'p12nc-s2-e1',
        question: 'So sánh phản ứng Phân hạch và phản ứng Nhiệt hạch về nguyên liệu, điều kiện xảy ra và năng lượng tỏa ra tính trên 1 gam nhiên liệu.',
        hint: 'Phân hạch dùng hạt nặng ($U$) kích bởi nơtron chậm; nhiệt hạch dùng hạt nhẹ ($D, T$) ở nhiệt độ cực cao.',
        rubricChecklist: [
          'Phân hạch: hạt nặng ($^{235}\\text{U}$) hấp thụ nơtron chậm, dễ điều khiển trong lò phản ứng, nhưng tạo rác phóng xạ dài hạn.',
          'Nhiệt hạch: tổng hợp hạt nhẹ ($^2\\text{H}, {}^3\\text{H}$) cần nhiệt độ hàng chục triệu Kelvin, sinh năng lượng trên 1 gam nhiên liệu lớn hơn nhiều lần phân hạch và sạch hơn.'
        ],
        sampleAnswer: 'Phân hạch là sự vỡ hạt nhân rất nặng ($^{235}\\text{U}, {}^{239}\\text{Pu}$) khi hấp thụ nơtron chậm, xảy ra ở nhiệt độ thường và đã được kiểm soát trong nhà máy điện hạt nhân nhưng để lại chất thải phóng xạ. Nhiệt hạch là sự tổng hợp các hạt nhân rất nhẹ ($^2\\text{H}, {}^3\\text{H}$) thành Heli, đòi hỏi điều kiện khắc nghiệt (hàng chục triệu K), nhưng tính theo cùng 1 gam nhiên liệu thì nhiệt hạch tỏa năng lượng lớn gấp nhiều lần phân hạch và gần như không tạo rác thải phóng xạ.'
      }
    },
    {
      stepTitle: '3. Định luật Phóng xạ & Bài toán Tìm Tuổi Mẫu vật',
      stepType: 'example',
      conceptSection:
        'Phóng xạ là quá trình tự phát và ngẫu nhiên phân rã của hạt nhân không bền thành hạt nhân khác, kèm theo tia $\\alpha$ (${}^4_2\\text{He}$), $\\beta^-$ (${}^0_{-1}e$), $\\beta^+$ (${}^0_{+1}e$) hoặc $\\gamma$. Tốc độ phân rã hoàn toàn **không phụ thuộc** nhiệt độ hay áp suất bên ngoài.',
      formulaSection: {
        primaryFormula: 'N(t) = N_0 2^{-\\frac{t}{T}} = N_0 e^{-\\lambda t}, \\qquad \\lambda = \\frac{\\ln 2}{T}',
        secondaryFormulas: [
          '\\Delta N = N_0\\left(1 - 2^{-t/T}\\right), \\qquad H(t) = \\lambda N(t) = H_0 2^{-t/T}',
          '\\frac{m_{\\text{con}}}{m_{\\text{mẹ còn}}} = \\frac{A_{\\text{con}}}{A_{\\text{mẹ}}}\\left(2^{t/T} - 1\\right)'
        ],
        variablesNote:
          '• $T$: chu kì bán rã — thời gian để một nửa số hạt nhân ban đầu bị phân rã.\n• Sau $k$ chu kì ($t = kT$), lượng còn lại là $N_0/2^k$, lượng đã phân rã là $N_0(1 - 1/2^k)$.\n• $1\\text{ Bq} = 1\\text{ phân rã/giây}$ (độ phóng xạ $H = \\lambda N$, với $\\lambda$ đổi ra $\\text{s}^{-1}$).'
      },
      deepDiveSection:
        'Bẫy tính tỉ số khối lượng hạt nhân con sinh ra và hạt nhân mẹ còn lại: số hạt con sinh ra bằng đúng số hạt mẹ phân rã ($N_{\\text{con}} = \\Delta N_{\\text{mẹ}}$), nhưng khi đổi sang **khối lượng** phải nhân đúng tỉ số số khối $A_{\\text{con}}/A_{\\text{mẹ}}$ (ví dụ phóng xạ $\\alpha$ từ ${}^{210}\\text{Po}$ thành ${}^{206}\\text{Pb}$ có $A_{\\text{Pb}}/A_{\\text{Po}} = 206/210$)!',
      teacherExplanation:
        'Gặp câu hỏi định tuổi cổ vật bằng Cacbon-14 ($T = 5730\\text{ năm}$), cứ tính tỉ số độ phóng xạ $H_0/H = 2^{t/T}$ rồi lấy logarit cơ số 2.',
      keyTakeaway: 'Cứ qua mỗi chu kì $T$, số hạt, khối lượng và độ phóng xạ chất mẹ còn lại giảm đi một nửa.',
      miniQuiz: [
        {
          id: 'p12nc-s3-q1',
          question: 'Chất phóng xạ Iốt ${}^{131}\\text{I}$ có chu kì bán rã $T = 8\\text{ ngày}$. Ban đầu có $80\\text{ g}$ chất này, sau $24\\text{ ngày}$ khối lượng Iốt CÒN LẠI là:',
          options: ['A. $40\\text{ g}$', 'B. $20\\text{ g}$', 'C. $10\\text{ g}$', 'D. $70\\text{ g}$'],
          correctIndex: 2,
          explanation: '$t = 24 = 3T \\implies m = \\frac{80}{2^3} = 10\\text{ g}$.'
        },
        {
          id: 'p12nc-s3-q2',
          question: 'Trong y học hạt nhân, một mẫu gỗ cổ đại có độ phóng xạ ${}^{14}\\text{C}$ chỉ bằng $1/8$ lần mẫu gỗ tươi cùng khối lượng ($T_{^{14}\\text{C}} = 5730\\text{ năm}$). Tuổi của mẫu gỗ cổ là:',
          options: ['A. $5730\\text{ năm}$', 'B. $11\\,460\\text{ năm}$', 'C. $17\\,190\\text{ năm}$', 'D. $22\\,920\\text{ năm}$'],
          correctIndex: 2,
          explanation: '$\\frac{H}{H_0} = \\frac{1}{8} = 2^{-3} \\implies t = 3T = 3\\cdot 5730 = 17\\,190\\text{ năm}$.'
        }
      ],
      miniEssay: {
        id: 'p12nc-s3-e1',
        question: 'Ban đầu có mẫu ${}^{210}_{84}\\text{Po}$ nguyên chất ($T = 138\\text{ ngày}$) phóng xạ $\\alpha$ tạo thành chì ${}^{206}_{82}\\text{Pb}$ bền. Sau $276\\text{ ngày}$, tính tỉ số giữa khối lượng chì tạo thành và khối lượng Pôlôni còn lại.',
        hint: 'Số hạt chì sinh ra bằng số hạt mẹ phân rã: $N_{\\text{Pb}} = N_0(1 - 2^{-t/T})$, với $t = 2T$.',
        rubricChecklist: [
          'Với $t = 276 = 2T$, tính $\\frac{N_{\\text{Pb}}}{N_{\\text{Po}}} = 2^2 - 1 = 3$.',
          'Nhân tỉ số số khối: $\\frac{m_{\\text{Pb}}}{m_{\\text{Po}}} = \\frac{206}{210}\\cdot 3 = \\frac{103}{35} \\approx 2{,}94$.'
        ],
        sampleAnswer: 'Vì $t = 276 = 2T$ nên số hạt mẹ còn lại là $N_{\\text{Po}} = N_0/4$, và số hạt chì sinh ra bằng số hạt mẹ đã phân rã $N_{\\text{Pb}} = N_0 - N_0/4 = \\frac{3}{4}N_0 \\Rightarrow \\frac{N_{\\text{Pb}}}{N_{\\text{Po}}} = 3$. Do đó tỉ số khối lượng là $\\frac{m_{\\text{Pb}}}{m_{\\text{Po}}} = \\frac{A_{\\text{Pb}}}{A_{\\text{Po}}} \\cdot \\frac{N_{\\text{Pb}}}{N_{\\text{Po}}} = \\frac{206}{210} \\times 3 = \\frac{103}{35} \\approx 2{,}94$.'
      }
    }
  ],
  'phys-12-ac-rlc': [
    {
      stepTitle: '1. Giá trị Hiệu dụng & Quan hệ Pha trong Các phần tử R, L, C',
      stepType: 'concept',
      conceptSection:
        'Dòng điện xoay chiều biến thiên điều hòa hình sin $i = I_0\\cos(\\omega t + \\varphi_i)$. Do tác dụng tỏa nhiệt trung bình bằng dòng một chiều tương ứng, ta sử dụng **giá trị hiệu dụng** ($I, U$) thay cho biên độ cực đại ($I_0, U_0$).',
      formulaSection: {
        primaryFormula: 'I = \\frac{I_0}{\\sqrt{2}}, \\quad U = \\frac{U_0}{\\sqrt{2}}, \\qquad Z_L = \\omega L,\\quad Z_C = \\frac{1}{\\omega C}',
        secondaryFormulas: [
          'u_R \\text{ cùng pha } i',
          'u_L \\text{ sớm pha } \\frac{\\pi}{2} \\text{ so với } i, \\qquad u_C \\text{ trễ pha } \\frac{\\pi}{2} \\text{ so với } i'
        ],
        variablesNote:
          '• $Z_L$ ($\Omega$): cảm kháng (tỉ lệ thuận tần số $\\omega$); $Z_C$ ($\Omega$): dung kháng (tỉ lệ nghịch $\\omega$).\n• **Chú ý lệch pha giữa các điện áp**: $u_L$ và $u_C$ luôn **ngược pha** nhau ($\\Delta\\varphi = \\pi$), tức $u_L/U_{0L} + u_C/U_{0C} = 0$ tại mọi thời điểm!'
      },
      deepDiveSection:
        'Vì $u_R$ vuông pha với $u_L$ và $u_C$, **giá trị tức thời** cộng đại số $u = u_R + u_L + u_C$ tại từng thời điểm, nhưng **giá trị hiệu dụng** KHÔNG được cộng thẳng $U_R + U_L + U_C$ mà phải tổng hợp bằng giản đồ vectơ Fresnel!',
      teacherExplanation:
        'Nhớ câu "L nhanh, C chậm": điện áp cuộn cảm $u_L$ luôn đi trước dòng $i$ góc $\\pi/2$, điện áp tụ $u_C$ luôn đi sau dòng $i$ góc $\\pi/2$.',
      keyTakeaway: 'Giá trị hiệu dụng nhỏ hơn biên độ $\\sqrt{2}$ lần; $u_L$ và $u_C$ luôn ngược pha nhau.',
      miniQuiz: [
        {
          id: 'p12ac-s1-q1',
          question: 'Mạng điện dân dụng có điện áp hiệu dụng $220\\text{ V}$, tần số $50\\text{ Hz}$. Giá trị cực đại $U_0$ và tần số góc $\\omega$ là:',
          options: [
            'A. $220\\text{ V}$; $50\\pi\\text{ rad/s}$',
            'B. $220\\sqrt{2}\\text{ V}$; $100\\pi\\text{ rad/s}$',
            'C. $110\\sqrt{2}\\text{ V}$; $100\\pi\\text{ rad/s}$',
            'D. $311\\text{ V}$; $50\\text{ rad/s}$'
          ],
          correctIndex: 1,
          explanation: '$U_0 = U\\sqrt{2} = 220\\sqrt{2}\\text{ V} \\approx 311\\text{ V}$; $\\omega = 2\\pi f = 100\\pi\\text{ rad/s}$.'
        },
        {
          id: 'p12ac-s1-q2',
          question: 'Đoạn mạch chỉ có tụ điện $C = \\frac{10^{-4}}{\\pi}\\text{ F}$ nối vào nguồn xoay chiều tần số $50\\text{ Hz}$ ($\omega = 100\\pi$). Dung kháng $Z_C$ bằng:',
          options: ['A. $10\\,\\Omega$', 'B. $50\\,\\Omega$', 'C. $100\\,\\Omega$', 'D. $200\\,\\Omega$'],
          correctIndex: 2,
          explanation: '$Z_C = \\frac{1}{100\\pi \\cdot \\frac{10^{-4}}{\\pi}} = 100\\,\\Omega$.'
        }
      ],
      miniEssay: {
        id: 'p12ac-s1-e1',
        question: 'Tại sao tại một thời điểm $t$, tổng các điện áp hiệu dụng $U_R + U_L + U_C$ có thể lớn hơn điện áp hiệu dụng toàn mạch $U$, trong khi ở cùng thời điểm đó $u_R + u_L + u_C = u$ luôn đúng?',
        hint: 'Phân biệt tổng tức thời (đại số tại cùng thời điểm $t$) và tổng hiệu dụng (độ dài cạnh của đa giác vectơ quay).',
        rubricChecklist: [
          'Ở mỗi thời điểm $t$, $u = u_R + u_L + u_C$ theo định luật Kirchhoff (tức thời có dấu âm dương triệt tiêu nhau, đặc biệt $u_L$ và $u_C$ luôn trái dấu).',
          'Điện áp hiệu dụng là độ lớn biên độ chia $\\sqrt{2}$, tổng hợp theo vectơ quay $U = \\sqrt{U_R^2 + (U_L - U_C)^2} < U_R + U_L + U_C$.'
        ],
        sampleAnswer: 'Tại mỗi thời điểm $t$, các điện áp tức thời thỏa mãn $u(t) = u_R(t) + u_L(t) + u_C(t)$ trong đó $u_L$ và $u_C$ luôn trái dấu nhau (ngược pha) nên triệt tiêu bớt. Còn các giá trị hiệu dụng $U_R, U_L, U_C$ là độ dài dương của các vectơ quay hợp góc với nhau, nên theo bất đẳng thức tam giác và định lý Pythagore $U = \\sqrt{U_R^2 + (U_L - U_C)^2} \\le U_R + |U_L - U_C| < U_R + U_L + U_C$.'
      }
    },
    {
      stepTitle: '2. Tổng trở Mạch RLC Nối tiếp & Cộng hưởng Điện',
      stepType: 'derivation',
      conceptSection:
        'Tổng trở $Z$ của đoạn mạch RLC nối tiếp đóng vai trò như điện trở tương đương với dòng điện xoay chiều hình sin. Hiện tượng **cộng hưởng điện** xảy ra khi cảm kháng triệt tiêu hoàn toàn dung kháng ($Z_L = Z_C$).',
      formulaSection: {
        primaryFormula: 'Z = \\sqrt{R^2 + (Z_L - Z_C)^2}, \\qquad \\tan\\varphi = \\frac{Z_L - Z_C}{R}',
        secondaryFormulas: [
          'U = \\sqrt{U_R^2 + (U_L - U_C)^2}',
          '\\text{Cộng hưởng: } Z_L = Z_C \\iff \\omega^2 L C = 1 \\implies Z_{\\min} = R,\\ I_{\\max} = \\frac{U}{R},\\ \\varphi = 0'
        ],
        variablesNote:
          '• $\\varphi = \\varphi_u - \\varphi_i$: độ lệch pha của $u$ so với $i$.\n• Khi $Z_L > Z_C$ (mạch có tính cảm kháng): $\\varphi > 0$ ($u$ sớm pha hơn $i$). Khi $Z_L < Z_C$: $\\varphi < 0$ ($u$ trễ pha hơn $i$).'
      },
      deepDiveSection:
        'Khi xảy ra cộng hưởng điện ($\\omega = 1/\\sqrt{LC}$), mạch trở nên thuần trở đối với nguồn: $I$ đạt cực đại, $U_R = U$ đạt cực đại, hệ số công suất $\\cos\\varphi = 1$ và công suất tiêu thụ mạch đạt giá trị lớn nhất $P_{\\max} = U^2/R$.',
      teacherExplanation:
        'Dấu hiệu nhận biết cộng hưởng trong đề: thấy "I cực đại", "P cực đại", "$u$ cùng pha $i$", "$U_R = U$", hoặc "$U_L = U_C$" — tất cả đều quy về $Z_L = Z_C$!',
      keyTakeaway: 'Khi $Z_L = Z_C$ (cộng hưởng điện), tổng trở nhỏ nhất $Z = R$, $u$ và $i$ cùng pha.',
      miniQuiz: [
        {
          id: 'p12ac-s2-q1',
          question: 'Mạch RLC nối tiếp có $R = 30\\,\\Omega$, $Z_L = 70\\,\\Omega$, $Z_C = 30\\,\\Omega$. Tổng trở $Z$ của mạch là:',
          options: ['A. $130\\,\\Omega$', 'B. $50\\,\\Omega$', 'C. $70\\,\\Omega$', 'D. $40\\,\\Omega$'],
          correctIndex: 1,
          explanation: '$Z = \\sqrt{30^2 + (70 - 30)^2} = \\sqrt{30^2 + 40^2} = 50\\,\\Omega$.'
        },
        {
          id: 'p12ac-s2-q2',
          question: 'Điều kiện để trong đoạn mạch RLC nối tiếp xảy ra cộng hưởng điện là:',
          options: ['A. $\\omega L C = 1$', 'B. $\\omega^2 L C = 1$', 'C. $R = Z_L + Z_C$', 'D. $U_R = U_L$'],
          correctIndex: 1,
          explanation: '$Z_L = Z_C \\iff \\omega L = \\frac{1}{\\omega C} \\iff \\omega^2 L C = 1$.'
        }
      ],
      miniEssay: {
        id: 'p12ac-s2-e1',
        question: 'Cho mạch RLC nối tiếp đặt dưới điện áp hiệu dụng $U = 100\\text{ V}$, có $R = 40\\,\\Omega$, $Z_L = 80\\,\\Omega$, $Z_C = 50\\,\\Omega$. Tính tổng trở $Z$, cường độ dòng hiệu dụng $I$ và độ lệch pha giữa $u$ và $i$.',
        hint: 'Tính $Z = \\sqrt{R^2 + (Z_L - Z_C)^2}$, $I = U/Z$, và $\\tan\\varphi = (Z_L - Z_C)/R$.',
        rubricChecklist: [
          'Tính đúng $Z = \\sqrt{40^2 + 30^2} = 50\\,\\Omega$ và $I = 100/50 = 2\\text{ A}$.',
          'Tính $\\tan\\varphi = 30/40 = 0{,}75 \\implies \\varphi \\approx 0{,}644\\text{ rad} \\approx 36{,}9^\\circ$ ($u$ sớm pha hơn $i$).'
        ],
        sampleAnswer: 'Tổng trở của mạch là $Z = \\sqrt{40^2 + (80 - 50)^2} = \\sqrt{1600 + 900} = 50\\,\\Omega$. Cường độ dòng hiệu dụng là $I = \\frac{U}{Z} = \\frac{100}{50} = 2\\text{ A}$. Độ lệch pha thỏa $\\tan\\varphi = \\frac{Z_L - Z_C}{R} = \\frac{30}{40} = 0{,}75 \\Rightarrow \\varphi \\approx 36{,}9^\\circ > 0$ (điện áp sớm pha hơn dòng điện $36{,}9^\\circ$).'
      }
    },
    {
      stepTitle: '3. Công suất Tiêu thụ & Ý nghĩa Hệ số Công suất $\\cos\\varphi$',
      stepType: 'example',
      conceptSection:
        'Trong mạch xoay chiều, chỉ điện trở thuần $R$ (và điện trở dây cuộn cảm nếu có $r$) mới tiêu thụ điện năng tỏa nhiệt; cuộn cảm thuần và tụ điện lý tưởng chỉ trao đổi năng lượng tuần hoàn với nguồn mà **không tiêu thụ công suất trung bình**.',
      formulaSection: {
        primaryFormula: 'P = U I \\cos\\varphi = I^2 R = \\frac{U^2 R}{R^2 + (Z_L - Z_C)^2}',
        secondaryFormulas: [
          '\\cos\\varphi = \\frac{R}{Z} = \\frac{U_R}{U} \\in [0; 1]'
        ],
        variablesNote:
          '• Công suất tỏa nhiệt cực đại theo $R$ (khi $R$ biến thiên): $R = |Z_L - Z_C| \\implies P_{\\max} = \\frac{U^2}{2|Z_L - Z_C|}$ (lúc đó $\\cos\\varphi = \\frac{\\sqrt{2}}{2}$).\n• Nhà máy điện luôn yêu cầu khu công nghiệp giữ hệ số công suất $\\cos\\varphi \\ge 0{,}85$ để giảm dòng chạy trên dây tải.'
      },
      deepDiveSection:
        'Tại sao hệ số công suất $\\cos\\varphi$ thấp lại gây thiệt hại cho lưới điện? Với cùng một công suất tiêu thụ $P$ và điện áp $U$, cường độ dòng điện chạy trên dây là $I = \\frac{P}{U\\cos\\varphi}$. Nếu $\\cos\\varphi$ nhỏ, dòng $I$ tăng cao làm hao phí trên đường dây $I^2 R_{\\text{dây}} = \\frac{P^2 R_{\\text{dây}}}{U^2\\cos^2\\varphi}$ tăng rất mạnh!',
      teacherExplanation:
        'Nếu cuộn dây có điện trở trong $r$, nhớ công thức tổng trở phải cộng $(R + r)$ vào cả tử và mẫu của $\\cos\\varphi = (R+r)/Z$.',
      keyTakeaway: 'Công suất mạch xoay chiều $P = UI\\cos\\varphi = I^2(R+r)$; nâng cao $\\cos\\varphi$ giúp giảm hao phí dây tải.',
      miniQuiz: [
        {
          id: 'p12ac-s3-q1',
          question: 'Đặt điện áp hiệu dụng $U = 100\\text{ V}$ vào mạch RLC nối tiếp có dòng điện $I = 2\\text{ A}$ trễ pha $\\pi/3$ so với điện áp. Công suất tiêu thụ của mạch bằng:',
          options: ['A. $200\\text{ W}$', 'B. $100\\text{ W}$', 'C. $100\\sqrt{3}\\text{ W}$', 'D. $50\\text{ W}$'],
          correctIndex: 1,
          explanation: '$P = UI\\cos\\frac{\\pi}{3} = 100\\cdot 2\\cdot 0{,}5 = 100\\text{ W}$.'
        },
        {
          id: 'p12ac-s3-q2',
          question: 'Trong công nghiệp, để nâng cao hệ số công suất $\\cos\\varphi$ của các động cơ điện (có tính cảm kháng lớn $Z_L$), người ta thường mắc song song thêm thiết bị nào?',
          options: ['A. Cuộn cảm thuần', 'B. Tụ điện (tụ bù)', 'C. Điện trở xả lớn', 'D. Máy biến áp hạ áp'],
          correctIndex: 1,
          explanation: 'Tụ bù tạo thành phần dung kháng giúp bù trừ bớt cảm kháng của động cơ, kéo $\\varphi$ về gần $0$ ($\\cos\\varphi \\to 1$).'
        }
      ],
      miniEssay: {
        id: 'p12ac-s3-e1',
        question: 'Đoạn mạch gồm điện trở $R = 50\\,\\Omega$ mắc nối tiếp với cuộn cảm thuần có $Z_L = 80\\,\\Omega$ và tụ điện biến đổi $Z_C$ dưới điện áp $U = 200\\text{ V}$. Khi thay đổi $Z_C$, công suất tiêu thụ cực đại của mạch là bao nhiêu?',
        hint: 'Khi $Z_C$ biến thiên, $P_{\\max}$ đạt được khi xảy ra cộng hưởng $Z_C = Z_L$.',
        rubricChecklist: [
          'Chỉ ra khi $Z_C$ thay đổi, $P$ đạt cực đại lúc cộng hưởng $Z_C = Z_L = 80\\,\\Omega$ ($Z = R$).',
          'Tính $P_{\\max} = \\frac{U^2}{R} = \\frac{200^2}{50} = 800\\text{ W}$.'
        ],
        sampleAnswer: 'Vì $P = \\frac{U^2 R}{R^2 + (Z_L - Z_C)^2}$, khi điều chỉnh $Z_C$, công suất đạt giá trị cực đại khi mẫu số nhỏ nhất, tức xảy ra cộng hưởng $Z_C = Z_L = 80\\,\\Omega$. Khi đó $P_{\\max} = \\frac{U^2}{R} = \\frac{200^2}{50} = 800\\text{ W}$.'
      }
    }
  ],
  'phys-12-ac-gen': [
    {
      stepTitle: '1. Nguyên tắc tạo Suất điện động Xoay chiều & Máy phát 1 pha/3 pha',
      stepType: 'concept',
      conceptSection:
        'Máy phát điện xoay chiều tạo ra suất điện động cảm ứng hình sin bằng cách cho khung dây quay đều trong từ trường đều (hoặc rôto nam châm có $p$ cặp cực quay trước stato cuộn dây).',
      formulaSection: {
        primaryFormula: 'E_0 = \\omega N B S, \\qquad f = n\\cdot p',
        secondaryFormulas: [
          '\\Phi(t) = N B S \\cos(\\omega t + \\varphi_0) \\implies e(t) = -\\Phi\'(t) = \\omega N B S\\sin(\\omega t + \\varphi_0)'
        ],
        variablesNote:
          '• $p$: số cặp cực từ của rôto; $n$: tốc độ quay rôto tính bằng **vòng/giây**! Nếu đề cho tốc độ $N$ vòng/phút thì $f = \\frac{N\\cdot p}{60}$.\n• Trong máy phát **3 pha**, 3 cuộn dây giống nhau đặt lệch nhau $120^\\circ$ trên vòng tròn stato tạo 3 suất điện động cùng tần số, cùng biên độ, lệch pha từng đôi một $\\frac{2\\pi}{3}$.'
      },
      deepDiveSection:
        'Nhớ rõ quan hệ pha: suất điện động $e(t)$ luôn **trễ pha $\\pi/2$** so với từ thông $\\Phi(t)$! Khi mặt phẳng khung dây vuông góc đường sức từ ($\\Phi$ đạt cực đại) thì suất điện động $e = 0$; khi khung dây nằm song song đường sức ($\\Phi = 0$) thì $|e|$ đạt cực đại $E_0$.',
      teacherExplanation:
        'Kiểm tra đơn vị tốc độ quay $n$ ngay khi đọc đề: vòng/giây thì $f = np$; vòng/phút phải chia $60$ thành $f = np/60$.',
      keyTakeaway: '$f = np$ (với $n$ là vòng/giây); suất điện động $e$ trễ pha $\\pi/2$ so với từ thông $\\Phi$.',
      miniQuiz: [
        {
          id: 'p12ag-s1-q1',
          question: 'Một máy phát điện xoay chiều 1 pha có rôto gồm 4 cặp cực từ quay với tốc độ $750\\text{ vòng/phút}$. Tần số dòng điện phát ra là:',
          options: ['A. $50\\text{ Hz}$', 'B. $25\\text{ Hz}$', 'C. $100\\text{ Hz}$', 'D. $60\\text{ Hz}$'],
          correctIndex: 0,
          explanation: '$f = \\frac{N\\cdot p}{60} = \\frac{750\\cdot 4}{60} = 50\\text{ Hz}$.'
        },
        {
          id: 'p12ag-s1-q2',
          question: 'Trong máy phát điện xoay chiều 3 pha mắc hình sao cân bằng, tại mọi thời điểm tổng các dòng điện tức thời $i_1 + i_2 + i_3$ ở dây trung hòa bằng:',
          options: ['A. $3 I_0$', 'B. $I_0\\sqrt{3}$', 'C. $0$', 'D. $I_0$'],
          correctIndex: 2,
          explanation: 'Ba dao động điều hòa cùng biên độ, lệch pha nhau đôi một $120^\\circ$ ($2\\pi/3$) luôn có tổng bằng $0$ ở mọi thời điểm.'
        }
      ],
      miniEssay: {
        id: 'p12ag-s1-e1',
        question: 'Khi tăng tốc độ quay rôto của một máy phát điện xoay chiều (nối với bóng đèn sợi đốt $R$ không đổi) lên gấp đôi, cường độ dòng hiệu dụng và tần số dòng điện thay đổi như thế nào?',
        hint: 'Xét $E_0 = \\omega N B S \\propto \\omega$ và $f \\propto \\omega$.',
        rubricChecklist: [
          'Tốc độ quay $\\omega$ tăng 2 lần $\\implies$ tần số $f$ tăng 2 lần.',
          'Suất điện động hiệu dụng $E = \\omega N B S / \\sqrt{2}$ tăng 2 lần, mạch chỉ có $R$ nên $I = E/R$ cũng tăng 2 lần.'
        ],
        sampleAnswer: 'Khi tốc độ quay rôto tăng gấp đôi thì $\\omega\' = 2\\omega$, nên tần số dòng điện $f\' = 2f$ tăng gấp đôi. Đồng thời suất điện động hiệu dụng $E = \\frac{\\omega N B S}{\\sqrt{2}}$ cũng tăng gấp đôi. Vì tải là bóng đèn thuần trở $R$ không đổi nên cường độ dòng hiệu dụng $I = E/R$ tăng gấp đôi (công suất đèn tăng 4 lần).'
      }
    },
    {
      stepTitle: '2. Máy biến áp Lý tưởng & Định luật Bảo toàn Công suất Cuộn dây',
      stepType: 'derivation',
      conceptSection:
        'Máy biến áp là thiết bị biến đổi điện áp xoay chiều nhưng **giữ nguyên tần số $f$**, hoạt động nhờ hiện tượng cảm ứng điện từ qua lõi thép kỹ thuật ghép từ nhiều lá thép mỏng cách điện để giảm dòng điện Foucault.',
      formulaSection: {
        primaryFormula: '\\frac{U_1}{U_2} = \\frac{N_1}{N_2} = \\frac{I_2}{I_1} \\quad (\\text{máy lí tưởng})',
        secondaryFormulas: [
          'P_1 = P_2 \\iff U_1 I_1 = U_2 I_2 \\quad (\\text{tải thuần trở})'
        ],
        variablesNote:
          '• **Nhớ tỉ lệ nghịch của dòng điện**: máy **tăng áp** ($U_2 > U_1$) thì cường độ dòng bên thứ cấp **giảm** ($I_2 < I_1$) theo đúng tỉ lệ nghịch để bảo toàn công suất $U_1 I_1 = U_2 I_2$.\n• Máy biến áp tuyệt đối **không đổi được tần số** $f$ và **không hoạt động với dòng 1 chiều không đổi**.'
      },
      deepDiveSection:
        'Tại sao lõi máy biến áp không đúc thành một khối sắt đặc mà phải ghép bằng các lá thép silic mỏng phủ sơn cách điện? Vì từ thông biến thiên xuyên qua khối sắt đặc sẽ sinh ra **dòng điện xoáy Foucault** cực lớn gây nóng chảy và hao phí nặng; chia nhỏ thành lá mỏng tăng điện trở và chặn dòng Foucault.',
      teacherExplanation:
        'Trong bài toán quấn nhầm ngược một số vòng dây ở cuộn thứ cấp (ví dụ $n$ vòng quấn ngược), các vòng ngược chiều triệt tiêu bớt từ thông của $n$ vòng thuận chiều nên số vòng hiệu dụng còn $N_2 - 2n$!',
      keyTakeaway: 'Máy biến áp lý tưởng giữ nguyên tần số và công suất ($U_1 I_1 = U_2 I_2$); tăng áp làm giảm dòng.',
      miniQuiz: [
        {
          id: 'p12ag-s2-q1',
          question: 'Máy biến áp lí tưởng có $N_1 = 2000$ vòng, $N_2 = 100$ vòng. Đặt vào sơ cấp $U_1 = 220\\text{ V}$, nối thứ cấp với tải tiêu thụ dòng $I_2 = 4\\text{ A}$. Điện áp $U_2$ và dòng sơ cấp $I_1$ là:',
          options: ['A. $11\\text{ V};\\ 0{,}2\\text{ A}$', 'B. $4400\\text{ V};\\ 0{,}2\\text{ A}$', 'C. $11\\text{ V};\\ 80\\text{ A}$', 'D. $22\\text{ V};\\ 0{,}4\\text{ A}$'],
          correctIndex: 0,
          explanation: '$U_2 = 220\\cdot\\frac{100}{2000} = 11\\text{ V}$; $I_1 = I_2\\cdot\\frac{N_2}{N_1} = 4\\cdot\\frac{100}{2000} = 0{,}2\\text{ A}$.'
        },
        {
          id: 'p12ag-s2-q2',
          question: 'Khi đặt điện áp xoay chiều $f = 50\\text{ Hz}$ vào máy tăng áp tỉ lệ vòng dây $1:10$, tần số điện áp đầu ra ở cuộn thứ cấp bằng:',
          options: ['A. $5\\text{ Hz}$', 'B. $50\\text{ Hz}$', 'C. $500\\text{ Hz}$', 'D. $100\\text{ Hz}$'],
          correctIndex: 1,
          explanation: 'Máy biến áp chỉ thay đổi điện áp và cường độ dòng điện, KHÔNG làm thay đổi tần số.'
        }
      ],
      miniEssay: {
        id: 'p12ag-s2-e1',
        question: 'Một máy biến áp lý tưởng hạ áp từ $U_1 = 220\\text{ V}$ xuống $U_2 = 110\\text{ V}$ ($N_1 = 1000$ vòng). Nếu người thợ quấn nhầm 50 vòng của cuộn thứ cấp bị ngược chiều với các vòng còn lại, điện áp đo được ở cuộn thứ cấp là bao nhiêu?',
        hint: '50 vòng quấn ngược triệt tiêu tác dụng của 50 vòng thuận, số vòng hiệu dụng còn $N_2 - 2\\cdot 50$.',
        rubricChecklist: [
          'Tính $N_2$ thiết kế $= 1000 \\cdot (110/220) = 500$ vòng.',
          'Số vòng hiệu dụng còn $500 - 2\\cdot 50 = 400$ vòng $\\implies U_2\' = 220 \\cdot \\frac{400}{1000} = 88\\text{ V}$.'
        ],
        sampleAnswer: 'Theo thiết kế ban đầu, $N_2 = N_1\\frac{U_2}{U_1} = 1000\\cdot\\frac{110}{220} = 500$ vòng. Khi có 50 vòng bị quấn ngược chiều, suất điện động của 50 vòng này sẽ triệt tiêu suất điện động của 50 vòng quấn đúng, nên số vòng hiệu dụng chỉ còn $N_2\' = 500 - 2\\times 50 = 400$ vòng. Vậy điện áp thứ cấp đo được là $U_2\' = 220\\cdot\\frac{400}{1000} = 88\\text{ V}$.'
      }
    },
    {
      stepTitle: '3. Bài toán Truyền tải Điện năng & Hiệu suất Truyền tải',
      stepType: 'example',
      conceptSection:
        'Bài toán truyền tải điện năng đi xa cực kỳ trọng tâm trong đề thi THPT: điện năng từ nhà máy truyền qua dây dẫn có điện trở tổng $R$ tới nơi tiêu thụ với công suất phát $P$ và hiệu điện thế phát $U$.',
      formulaSection: {
        primaryFormula: '\\Delta P = \\frac{P^2 R}{(U\\cos\\varphi)^2}, \\qquad H = 1 - \\frac{\\Delta P}{P}',
        secondaryFormulas: [
          '\\frac{1 - H_2}{1 - H_1} = \\left(\\frac{U_1}{U_2}\\right)^2 \\quad (\\text{khi } P \\text{ nơi phát không đổi})',
          '\\frac{\\Delta P_2}{\\Delta P_1} = \\frac{P_2^2}{P_1^2}\\left(\\frac{U_1}{U_2}\\right)^2'
        ],
        variablesNote:
          '• **Cẩn thận phân biệt "Công suất phát không đổi" vs "Công suất nơi tiêu thụ không đổi"**!\n• Khi nơi tiêu thụ cần công suất $P_{\\text{tt}}$ không đổi ($P_{\\text{tt}} = P_{\\text{phát}} - \\Delta P$), cần giải dựa trên tỉ lệ phần trăm hao phí $(1 - H)/H^2$ hoặc quy về dòng $I$.'
      },
      deepDiveSection:
        'Cơ chế tính nhanh khi đề cho: "Nếu giữ nguyên công suất phát $P$, tăng điện áp trước khi truyền lên $k$ lần thì hiệu suất tăng từ $H_1$ lên bao nhiêu?" — chỉ dùng 1 dòng: phần hao phí mới $1 - H_2 = \\frac{1 - H_1}{k^2}$!',
      teacherExplanation:
        'Nhớ đơn vị công suất hao phí $\\Delta P$ và công suất phát $P$ phải đồng bộ (cùng W hoặc cùng kW/MW).',
      keyTakeaway: 'Khi công suất phát $P$ không đổi, phần trăm hao phí $(1-H)$ tỉ lệ nghịch với $U^2$.',
      miniQuiz: [
        {
          id: 'p12ag-s3-q1',
          question: 'Truyền tải công suất điện $P$ không đổi với hiệu suất ban đầu $H_1 = 80\\%$. Để hiệu suất truyền tải tăng lên $H_2 = 95\\%$, cần tăng điện áp nơi phát lên bao nhiêu lần (coi $\\cos\\varphi = 1$)?',
          options: ['A. 2 lần', 'B. 4 lần', 'C. $\\sqrt{2}$ lần', 'D. 1,5 lần'],
          correctIndex: 0,
          explanation: 'Hao phí giảm từ $20\\%$ xuống $5\\%$ (giảm 4 lần), nên cần tăng $U$ lên $\\sqrt{4} = 2$ lần.'
        },
        {
          id: 'p12ag-s3-q2',
          question: 'Điện áp hiệu dụng tại trạm phát là $10\\text{ kV}$, truyền đi công suất $1\\text{ MW}$ ($\cos\\varphi = 1$) trên dây có điện trở tổng $R = 5\\,\\Omega$. Công suất hao phí trên đường dây là:',
          options: ['A. $50\\text{ kW}$', 'B. $5\\text{ kW}$', 'C. $100\\text{ kW}$', 'D. $25\\text{ kW}$'],
          correctIndex: 0,
          explanation: '$I = \\frac{10^6}{10^4} = 100\\text{ A} \\implies \\Delta P = I^2 R = 100^2\\cdot 5 = 50\\,000\\text{ W} = 50\\text{ kW}$.'
        }
      ],
      miniEssay: {
        id: 'p12ag-s3-e1',
        question: 'Một trạm biến áp truyền điện tới khu dân cư tiêu thụ công suất KHÔNG ĐỔI. Ban đầu điện áp truyền là $U_1$, hiệu suất đạt $90\\%$. Nếu tăng điện áp truyền lên $2U_1$ thì hiệu suất mới bằng bao nhiêu?',
        hint: 'Chú ý đây là bài **công suất tiêu thụ không đổi**! Gọi $P_{\\text{tt}} = 9$ thì $\\Delta P_1 = 1$, $P_1 = 10$. Vì $P_{\\text{tt}}$ không đổi mà $\\Delta P \\propto I^2$, hãy lập phương trình theo $I$ hoặc kiểm tra gần đúng.',
        rubricChecklist: [
          'Lập đúng tỉ số: với $P_{\\text{tt}} = 9$ phần, $\\Delta P_1 = 1 \\implies U_1 = 10\\cdot I_1 \\cdot R_{\\text{tải}}$ hay $I_1 R_{\\text{dây}} = 0{,}1 U_1$ (độ sụt áp $10\\%$, hiệu điện thế nơi tiêu thụ $U_{\\text{tt1}} = 0{,}9 U_1$).',
          'Khi tăng lên $U_2 = 2U_1$, giải $P_{\\text{tt}} = U_2 I_2 - I_2^2 R$ cho $\\Delta P_2/P_{\\text{tt}} \\approx 0{,}026 \\implies H_2 \\approx 97{,}4\\%$.'
        ],
        sampleAnswer: 'Đặt công suất nơi tiêu thụ không đổi $P_{\\text{tt}} = 9$ đơn vị, suy ra hao phí ban đầu $\\Delta P_1 = 1$, công suất phát $P_1 = 10$ ($H_1 = 90\\%$). Khi tăng điện áp nơi phát lên $U_2 = 2U_1$, từ $P_{\\text{phát}} = U I$ và $\\Delta P = I^2 R$: vì $\\frac{\\Delta P_1}{P_1^2} = \\frac{R}{U_1^2}$ và $\\frac{\\Delta P_2}{P_2^2} = \\frac{R}{(2U_1)^2} \\Rightarrow \\frac{\\Delta P_2}{(9 + \\Delta P_2)^2} = \\frac{1}{4}\\cdot\\frac{1}{10^2} = \\frac{1}{400}$. Giải ra $\\Delta P_2 \\approx 0{,}238$, suy ra hiệu suất mới $H_2 = \\frac{9}{9 + 0{,}238} \\approx 97{,}4\\%$.'
      }
    }
  ],
  'phys-12-young': [
    {
      stepTitle: '1. Giao thoa Ánh sáng Khe Y-âng & Khoảng vân $i$',
      stepType: 'concept',
      conceptSection:
        'Thí nghiệm khe Y-âng (Young) chứng minh bản chất sóng của ánh sáng: hai khe hẹp $S_1, S_2$ đóng vai trò hai nguồn sáng kết hợp đồng pha, tạo trên màn các vạch sáng – tối song song cách đều nhau.',
      formulaSection: {
        primaryFormula: 'i = \\frac{\\lambda D}{a}, \\qquad x_s = k\\cdot i, \\qquad x_t = \\left(k + \\frac{1}{2}\\right)i',
        secondaryFormulas: [
          '\\Delta x \\text{ (bề rộng } n \\text{ khoảng vân liên tiếp: giữa } n+1 \\text{ vân sáng)} = n\\cdot i'
        ],
        variablesNote:
          '• **Đổi đơn vị thực dụng siêu nhanh**: để $a$ (mm), $D$ (m), $\\lambda$ ($\\mu\\text{m}$) $\\implies i = \\frac{\\lambda D}{a}$ tự ra luôn đơn vị **mm**!\n• Nếu nhúng toàn bộ thí nghiệm vào môi trường chiết suất $n$ (nước), bước sóng giảm $n$ lần ($\\lambda\' = \\lambda/n$) nên khoảng vân giảm $n$ lần ($i\' = i/n$).'
      },
      deepDiveSection:
        'Cách xác định nhanh một tọa độ $x$ trên màn là vân sáng hay vân tối: lập tỉ số $k = x/i$.\n• Nếu $k$ là số nguyên ($0, \\pm 1, \\pm 2\\dots$): vân sáng bậc $|k|$.\n• Nếu $k$ là số bán nguyên ($\\pm 0{,}5; \\pm 1{,}5\\dots$): vân tối thứ $|k| + 0{,}5$ (ví dụ $k = 2{,}5 \\to$ vân tối thứ 3).',
      teacherExplanation:
        'Đừng đổi các đại lượng $\\lambda, a, D$ về mét mất thời gian: giữ nguyên $\\lambda$ ($\mu\\text{m}$), $a$ (mm), $D$ (m) thì công thức cho ngay $i$ tính bằng **mm**!',
      keyTakeaway: '$i = \\frac{\\lambda D}{a}$ (đơn vị chuẩn mẹo: $\\mu\\text{m} \\cdot \\text{m} / \\text{mm} = \\text{mm}$).',
      miniQuiz: [
        {
          id: 'p12yg-s1-q1',
          question: 'Thí nghiệm Y-âng có $a = 1\\text{ mm}$, $D = 2\\text{ m}$, ánh sáng đơn sắc $\\lambda = 0{,}6\\,\\mu\\text{m}$. Khoảng vân $i$ trên màn bằng:',
          options: ['A. $0{,}6\\text{ mm}$', 'B. $1{,}2\\text{ mm}$', 'C. $2{,}4\\text{ mm}$', 'D. $0{,}3\\text{ mm}$'],
          correctIndex: 1,
          explanation: '$i = \\frac{0{,}6 \\cdot 2}{1} = 1{,}2\\text{ mm}$.'
        },
        {
          id: 'p12yg-s1-q2',
          question: 'Với khoảng vân $i = 1{,}2\\text{ mm}$, tại điểm M trên màn cách vân trung tâm $x_M = 4{,}2\\text{ mm}$ có:',
          options: ['A. Vân sáng bậc 3', 'B. Vân sáng bậc 4', 'C. Vân tối thứ 4', 'D. Vân tối thứ 3'],
          correctIndex: 2,
          explanation: '$\\frac{x_M}{i} = \\frac{4{,}2}{1{,}2} = 3{,}5 = 3 + 0{,}5 \\implies$ vân tối thứ 4.'
        }
      ],
      miniEssay: {
        id: 'p12yg-s1-e1',
        question: 'Trong thí nghiệm Y-âng, khoảng cách giữa 6 vân sáng liên tiếp đo được là $7{,}5\\text{ mm}$, biết $a = 0{,}8\\text{ mm}$, $D = 2\\text{ m}$. Tính khoảng vân $i$ và bước sóng $\\lambda$.',
        hint: 'Giữa 6 vân sáng liên tiếp chỉ có $6 - 1 = 5$ khoảng vân ($5i = 7{,}5\\text{ mm}$).',
        rubricChecklist: [
          'Xác định đúng $5i = 7{,}5\\text{ mm} \\implies i = 1{,}5\\text{ mm}$ (tránh lỗi chia cho 6).',
          'Tính $\\lambda = \\frac{i a}{D} = \\frac{1{,}5\\cdot 0{,}8}{2} = 0{,}6\\,\\mu\\text{m}$.'
        ],
        sampleAnswer: 'Giữa 6 vân sáng liên tiếp có $6 - 1 = 5$ khoảng vân, nên $5i = 7{,}5\\text{ mm} \\Rightarrow i = 1{,}5\\text{ mm}$. Bước sóng ánh sáng là $\\lambda = \\frac{i\\cdot a}{D} = \\frac{1{,}5 \\times 0{,}8}{2} = 0{,}6\\,\\mu\\text{m}$.'
      }
    },
    {
      stepTitle: '2. Giao thoa Ánh sáng Trắng & Chồng lấn Đa sắc',
      stepType: 'derivation',
      conceptSection:
        'Khi chiếu ánh sáng trắng ($0{,}38\\,\\mu\\text{m} \\le \\lambda \\le 0{,}76\\,\\mu\\text{m}$) vào khe Y-âng: ngay tại trung tâm ($x = 0$), mọi màu đơn sắc đều cho vân sáng bậc 0 trùng khít nhau tạo thành **vân sáng trắng trung tâm**. Các bậc $k \\ge 1$ bị tách thành dải quang phổ cầu vồng.',
      formulaSection: {
        primaryFormula: '\\text{Trùng vân 2 màu: } k_1\\lambda_1 = k_2\\lambda_2',
        secondaryFormulas: [
          '\\text{Số bức xạ cho vân sáng tại } x: \\lambda = \\frac{a x}{k D} \\in [0{,}38;\\, 0{,}76]\\,\\mu\\text{m}',
          '\\Delta x_{\\text{quang phổ bậc } k} = k\\frac{(\\lambda_{\\text{đỏ}} - \\lambda_{\\text{tím}})D}{a}'
        ],
        variablesNote:
          '• Ở mỗi dải quang phổ bậc $k$: mép **trong** (gần vân trung tâm nhất) là **màu tím**, mép **ngoài** là **màu đỏ**.\n• Khi $k$ tăng, các dải quang phổ bậc cao chồng lấn lên nhau.'
      },
      deepDiveSection:
        'Tìm vị trí trùng nhau gần vân trung tâm nhất của 2 bức xạ đơn sắc $\\lambda_1, \\lambda_2$: rút gọn phân số $\\frac{\\lambda_1}{\\lambda_2} = \\frac{p}{q}$ tối giản; lưu ý đừng nhầm $k_1 = p$ — từ $k_1\\lambda_1 = k_2\\lambda_2 \\implies \\frac{k_1}{k_2} = \\frac{\\lambda_2}{\\lambda_1} = \\frac{q}{p}$, nên vị trí trùng đầu tiên là $x_{\\text{trùng}} = q i_1 = p i_2$!',
      teacherExplanation:
        'Rút gọn tối giản $\\lambda_1 / \\lambda_2$ trước khi suy ra $k_1, k_2$ — giải trong 10 giây không cần thử nhiều!',
      keyTakeaway: 'Giao thoa ánh sáng trắng cho vân trung tâm màu trắng; hai bên là các dải cầu vồng tím trong – đỏ ngoài.',
      miniQuiz: [
        {
          id: 'p12yg-s2-q1',
          question: 'Trong giao thoa khe Y-âng bằng ánh sáng trắng, tại tọa độ $x = 0$ (chính giữa màn) ta quan sát thấy:',
          options: [
            'A. Vân tối hoàn toàn',
            'B. Dải màu cầu vồng',
            'C. Vân sáng màu trắng',
            'D. Vân sáng màu tím'
          ],
          correctIndex: 2,
          explanation: 'Tại $x = 0$ mọi bước sóng đều có vân sáng bậc $k = 0$ chồng khít lên nhau tổng hợp thành ánh sáng trắng.'
        },
        {
          id: 'p12yg-s2-q2',
          question: 'Chiếu đồng thời 2 bức xạ $\\lambda_1 = 0{,}45\\,\\mu\\text{m}$ và $\\lambda_2 = 0{,}60\\,\\mu\\text{m}$. Vị trí gần vân trung tâm nhất có vân sáng cùng màu vân trung tâm ứng với bậc $k_1, k_2$ bằng:',
          options: ['A. $k_1 = 3, k_2 = 4$', 'B. $k_1 = 4, k_2 = 3$', 'C. $k_1 = 2, k_2 = 3$', 'D. $k_1 = 4, k_2 = 5$'],
          correctIndex: 1,
          explanation: '$\\frac{k_1}{k_2} = \\frac{\\lambda_2}{\\lambda_1} = \\frac{0{,}60}{0{,}45} = \\frac{4}{3}$, nên trùng lần đầu tại $k_1 = 4, k_2 = 3$.'
        }
      ],
      miniEssay: {
        id: 'p12yg-s2-e1',
        question: 'Trong thí nghiệm Y-âng bằng ánh sáng trắng ($0{,}38\\,\\mu\\text{m} \\le \\lambda \\le 0{,}76\\,\\mu\\text{m}$), $a = 1\\text{ mm}$, $D = 2\\text{ m}$. Tính bề rộng quang phổ bậc 1 trên màn.',
        hint: 'Quang phổ bậc 1 trải từ vân sáng bậc 1 màu tím ($x_{\\text{tím1}} = i_{\\text{tím}}$) tới vân sáng bậc 1 màu đỏ ($x_{\\text{đỏ1}} = i_{\\text{đỏ}}$).',
        rubricChecklist: [
          'Tính $x_{\\text{tím1}} = \\frac{0{,}38\\cdot 2}{1} = 0{,}76\\text{ mm}$ và $x_{\\text{đỏ1}} = \\frac{0{,}76\\cdot 2}{1} = 1{,}52\\text{ mm}$.',
          'Bề rộng quang phổ bậc 1 là $\\Delta x_1 = 1{,}52 - 0{,}76 = 0{,}76\\text{ mm}$.'
        ],
        sampleAnswer: 'Ở quang phổ bậc 1 ($k = 1$), mép trong là vân sáng tím cách trung tâm $x_{\\text{tím1}} = \\frac{0{,}38\\cdot 2}{1} = 0{,}76\\text{ mm}$, mép ngoài là vân sáng đỏ cách trung tâm $x_{\\text{đỏ1}} = \\frac{0{,}76\\cdot 2}{1} = 1{,}52\\text{ mm}$. Vậy bề rộng quang phổ bậc 1 là $\\Delta x_1 = 1{,}52 - 0{,}76 = 0{,}76\\text{ mm}$.'
      }
    },
    {
      stepTitle: '3. Máy Quang phổ Lăng kính & Ba loại Quang phổ',
      stepType: 'example',
      conceptSection:
        'Máy quang phổ lăng kính phân tích chùm ánh sáng phức tạp thành các thành phần đơn sắc nhờ hệ tán sắc (lăng kính), qua đó nhận biết thành phần nguyên tố hóa học và nhiệt độ của nguồn sáng ở xa hàng tỷ năm ánh sáng.',
      formulaSection: {
        primaryFormula: '\\text{Ống chuẩn trực (tạo tia //)} \\to \\text{Hệ tán sắc} \\to \\text{Buồng tối (hội tụ ảnh)}',
        secondaryFormulas: [
          '\\text{Liên tục} \\implies \\text{Đo nhiệt độ}',
          '\\text{Vạch phát xạ / hấp thụ} \\implies \\text{Xác định thành phần hóa học}'
        ],
        variablesNote:
          '• **Quang phổ liên tục**: do vật rắn, lỏng, khí áp suất lớn bị nung nóng phát ra — **chỉ phụ thuộc nhiệt độ**, không phụ thuộc bản chất vật.\n• **Quang phổ vạch phát xạ**: do chất khí/hơi ở áp suất thấp bị kích thích phát ra.\n• **Quang phổ vạch hấp thụ**: xuất hiện vạch tối trên nền liên tục khi đám khí lạnh hấp thụ đúng các bước sóng nó có thể phát ra.'
      },
      deepDiveSection:
        'Các nhà thiên văn học biết được Mặt Trời chứa Hydro, Heli và hàng loạt kim loại nặng chỉ nhờ quan sát hàng nghìn vạch tối Fraunhofer (quang phổ vạch hấp thụ) trong ánh sáng Mặt Trời chiếu qua lớp khí quyển quanh nó!',
      teacherExplanation:
        'Nhớ quy tắc vàng: Liên tục $\\to$ **nhiệt độ**; Vạch $\\to$ **cấu tạo nguyên tố**.',
      keyTakeaway: 'Quang phổ liên tục chỉ phụ thuộc nhiệt độ; quang phổ vạch là "dấu vân tay" của từng nguyên tố hóa học.',
      miniQuiz: [
        {
          id: 'p12yg-s3-q1',
          question: 'Quang phổ liên tục của một nguồn sáng phụ thuộc vào yếu tố nào?',
          options: [
            'A. Chỉ phụ thuộc thành phần hóa học nguồn sáng',
            'B. Chỉ phụ thuộc nhiệt độ nguồn sáng',
            'C. Phụ thuộc cả thành phần hóa học và áp suất',
            'D. Chỉ phát ra bởi chất khí loãng'
          ],
          correctIndex: 1,
          explanation: 'Các vật rắn, lỏng, khí áp suất cao ở cùng một nhiệt độ cho quang phổ liên tục giống hệt nhau.'
        },
        {
          id: 'p12yg-s3-q2',
          question: 'Bộ phận của máy quang phổ lăng kính có tác dụng tạo chùm tia sáng song song trước khi đi vào lăng kính là:',
          options: ['A. Buồng tối', 'B. Ống chuẩn trực', 'C. Tấm kính ảnh', 'D. Khe lăng kính'],
          correctIndex: 1,
          explanation: 'Ống chuẩn trực gồm khe hẹp đặt tại tiêu diện thấu kính hội tụ $L_1$ để biến chùm sáng vào thành chùm tia song song.'
        }
      ],
      miniEssay: {
        id: 'p12yg-s3-e1',
        question: 'Giải thích điều kiện để thu được Quang phổ vạch hấp thụ và tại sao vạch tối lại nằm đúng vị trí vạch sáng phát xạ của chất khí đó?',
        hint: 'Xét nhiệt độ của đám khí hấp thụ so với nguồn sáng liên tục phía sau và hiện tượng đảo sắc vạch quang phổ.',
        rubricChecklist: [
          'Chiếu ánh sáng từ nguồn phát quang phổ liên tục (nhiệt độ $T_1$) qua đám khí/hơi ở áp suất thấp có nhiệt độ $T_2 < T_1$.',
          'Đám khí hấp thụ chọn lọc đúng những bước sóng đặc trưng mà ở nhiệt độ cao nó có khả năng phát xạ, tạo nên các vạch tối trên nền quang phổ liên tục.'
        ],
        sampleAnswer: 'Để thu được quang phổ vạch hấp thụ, ta chiếu chùm ánh sáng phát quang phổ liên tục có nhiệt độ rất cao $T_1$ xuyên qua đám khí hoặc hơi nguyên tử áp suất thấp có nhiệt độ $T_2$ thấp hơn ($T_2 < T_1$). Theo nguyên lý lượng tử Bohr, nguyên tử của đám khí đó chỉ hấp thụ đúng các phôtôn có năng lượng bằng hiệu hai mức dừng — trùng khớp chính xác với các bước sóng mà chính nó phát xạ khi được kích thích, để lại các vạch tối đặc trưng trên nền sáng liên tục.'
      }
    }
  ],
  'phys-photoelectric': [
    {
      stepTitle: '1. Thí nghiệm Hertz & Định luật Giới hạn Quang điện',
      stepType: 'concept',
      conceptSection:
        'Hiện tượng quang điện ngoài là hiện tượng ánh sáng làm bật các electron khỏi bề mặt kim loại. Hertz phát hiện hiện tượng này khi thấy tia tử ngoại chiếu vào bản kẽm tích điện âm làm điện nghiệm nhanh chóng mất điện tích.',
      formulaSection: {
        primaryFormula: '\\lambda \\le \\lambda_0 = \\frac{h c}{A}',
        secondaryFormulas: [
          '\\lambda_0(\\text{kẽm}) \\approx 0{,}35\\,\\mu\\text{m}, \\quad \\lambda_0(\\text{Cs}) \\approx 0{,}66\\,\\mu\\text{m}'
        ],
        variablesNote:
          '• Kim loại kiềm (Cs, K, Na) có công thoát nhỏ nên $\\lambda_0$ nằm trong vùng ánh sáng nhìn thấy.\n• Nếu chiếu ánh sáng có $\\lambda > \\lambda_0$ vào bản kẽm mang **điện âm** (hoặc mang điện dương) thì tấm kẽm giữ nguyên điện tích ban đầu.'
      },
      deepDiveSection:
        'Khi chiếu tia tử ngoại ($\lambda < \\lambda_0$) vào một tấm kẽm **trung hòa điện** cô lập: electron liên tục bật ra làm tấm kẽm mất bớt electron và tích điện **dương** dần lên; đến khi điện thế dương đủ lớn hút giữ các electron bật ra có $W_{đ0\\max}$ quay trở lại thì điện thế tấm kẽm đạt giá trị ổn định $V_{\\max}$.',
      teacherExplanation:
        'Nhớ kiểm tra 2 bước: (1) Tia chiếu có qua tấm thủy tinh chặn tử ngoại không? (2) $\\lambda \\le \\lambda_0$ không?',
      keyTakeaway: 'Kim loại cô lập bị chiếu ánh sáng gây quang điện sẽ dần tích điện dương tới điện thế ổn định $V_{\\max}$.',
      miniQuiz: [
        {
          id: 'p12ph-s1-q1',
          question: 'Chiếu một chùm sáng gồm hai bức xạ $\\lambda_1 = 0{,}30\\,\\mu\\text{m}$ và $\\lambda_2 = 0{,}55\\,\\mu\\text{m}$ vào catôt có giới hạn quang điện $\\lambda_0 = 0{,}42\\,\\mu\\text{m}$. Bức xạ nào gây ra quang điện?',
          options: ['A. Chỉ $\\lambda_1$', 'B. Chỉ $\\lambda_2$', 'C. Cả hai bức xạ', 'D. Không bức xạ nào'],
          correctIndex: 0,
          explanation: 'Chỉ có $\\lambda_1 = 0{,}30 \\le 0{,}42$ thỏa điều kiện quang điện.'
        },
        {
          id: 'p12ph-s1-q2',
          question: 'Một tấm kẽm đang trung hòa điện được đặt cô lập và chiếu bằng chùm tia tử ngoại ($\lambda < \\lambda_0$). Sau một thời gian, tấm kẽm sẽ:',
          options: ['A. Vẫn trung hòa điện', 'B. Tích điện âm', 'C. Tích điện dương tới một điện thế cực đại ổn định', 'D. Nóng chảy ngay lập tức'],
          correctIndex: 2,
          explanation: 'Electron thoát ra khiến tấm kẽm mang điện dương tăng dần cho tới khi lực hút tĩnh điện giữ lại được cả electron nhanh nhất.'
        }
      ],
      miniEssay: {
        id: 'p12ph-s1-e1',
        question: 'Trong thí nghiệm Hertz, khi đặt thêm một tấm thủy tinh thường chắn giữa đèn hồ quang và tấm kẽm tích điện âm thì kim điện nghiệm không cụp xuống nữa. Giải thích hiện tượng này.',
        hint: 'Thủy tinh thường hấp thụ rất mạnh tia tử ngoại ($\lambda < 0{,}38\\,\\mu\\text{m}$) và kẽm có $\\lambda_0 = 0{,}35\\,\\mu\\text{m}$.',
        rubricChecklist: [
          'Đèn hồ quang phát cả ánh sáng thấy và tia tử ngoại; chỉ tia tử ngoại mới thỏa $\\lambda \\le \\lambda_0(\\text{kẽm}) = 0{,}35\\,\\mu\\text{m}$.',
          'Thủy tinh thường hấp thụ hầu hết tia tử ngoại, chỉ cho ánh sáng nhìn thấy ($\lambda > 0{,}38\\,\\mu\\text{m} > \\lambda_0$) đi qua nên không gây được quang điện.'
        ],
        sampleAnswer: 'Giới hạn quang điện của kẽm là $\\lambda_0 \\approx 0{,}35\\,\\mu\\text{m}$ nằm trong vùng tử ngoại. Ánh sáng hồ quang có cả tia tử ngoại lẫn ánh sáng nhìn thấy. Khi chắn bằng tấm thủy tinh thường, thủy tinh hấp thụ gần như toàn bộ tia tử ngoại và chỉ cho ánh sáng nhìn thấy ($\lambda \\ge 0{,}38\\,\\mu\\text{m} > \\lambda_0$) truyền tới tấm kẽm, nên hiện tượng quang điện không xảy ra và kim điện nghiệm giữ nguyên độ lệch.'
      }
    },
    {
      stepTitle: '2. Công thức Einstein & Hiệu điện thế Hãm ($U_h$)',
      stepType: 'derivation',
      conceptSection:
        'Theo Einstein, năng lượng của một phôtôn truyền cho electron gần bề mặt kim loại được dùng làm 2 việc: cung cấp công thoát $A$ để thắng liên kết kim loại và phần dư biến thành **động năng ban đầu cực đại** $W_{đ0\\max}$ của quang electron.',
      formulaSection: {
        primaryFormula: '\\frac{h c}{\\lambda} = A + \\frac{1}{2}m_e v_{0\\max}^2 = A + |e|\\cdot U_h',
        secondaryFormulas: [
          'v_{0\\max} = \\sqrt{\\frac{2}{m_e}\\left(\\frac{hc}{\\lambda} - A\\right)}',
          'V_{\\max} = U_h = \\frac{1}{|e|}\\left(\\frac{hc}{\\lambda} - A\\right)'
        ],
        variablesNote:
          '• **Hiệu điện thế hãm** $U_h$: giá trị độ lớn điện áp âm đặt vào anôt (tức $U_{AK} = -U_h$) vừa đủ triệt tiêu hoàn toàn dòng quang điện ($I = 0$).\n• Nếu chiếu đồng thời nhiều bức xạ gây quang điện, giá trị $v_{0\\max}$ và $U_h$ được tính theo **bước sóng NGẮN NHẤT** ($\\lambda_{\\min}$).'
      },
      deepDiveSection:
        'Nhiều bài hay cho 2 bước sóng $\\lambda_1, \\lambda_2$ rồi hỏi tỉ số vận tốc cực đại hoặc bắt khử ẩn $A$: chỉ cần trừ hai phương trình Einstein cho nhau: $|e|(U_{h1} - U_{h2}) = hc\\left(\\frac{1}{\\lambda_1} - \\frac{1}{\\lambda_2}\\right)$ — rất gọn và loại hoàn toàn sai số của $A$!',
      teacherExplanation:
        'Ghi nhớ quy tắc chùm đa sắc: công thức Einstein lấy theo $\\lambda_{\\min}$ (năng lượng phôtôn lớn nhất) để tìm $v_{0\\max}$ và $U_h$.',
      keyTakeaway: '$\\frac{hc}{\\lambda} = A + |e|U_h$; với chùm nhiều bức xạ, tính $U_h$ và $v_{0\\max}$ theo bước sóng nhỏ nhất $\\lambda_{\\min}$.',
      miniQuiz: [
        {
          id: 'p12ph-s2-q1',
          question: 'Chiếu ánh sáng có năng lượng phôtôn $3{,}6\\text{ eV}$ vào catôt kim loại có công thoát $2{,}1\\text{ eV}$. Hiệu điện thế hãm triệt tiêu dòng quang điện bằng:',
          options: ['A. $5{,}7\\text{ V}$', 'B. $1{,}5\\text{ V}$', 'C. $2{,}1\\text{ V}$', 'D. $3{,}6\\text{ V}$'],
          correctIndex: 1,
          explanation: '$|e|U_h = \\varepsilon - A = 3{,}6 - 2{,}1 = 1{,}5\\text{ eV} \\implies U_h = 1{,}5\\text{ V}$.'
        },
        {
          id: 'p12ph-s2-q2',
          question: 'Khi tăng cường độ chùm sáng kích thích ($\lambda < \\lambda_0$) lên 3 lần nhưng giữ nguyên bước sóng $\\lambda$, hiệu điện thế hãm $U_h$ sẽ:',
          options: ['A. Tăng 3 lần', 'B. Tăng $\\sqrt{3}$ lần', 'C. Giảm 3 lần', 'D. Không đổi'],
          correctIndex: 3,
          explanation: '$U_h$ chỉ phụ thuộc vào bước sóng $\\lambda$ và công thoát $A$, không phụ thuộc cường độ chùm sáng.'
        }
      ],
      miniEssay: {
        id: 'p12ph-s2-e1',
        question: 'Chiếu bức xạ $\\lambda = 0{,}2484\\,\\mu\\text{m}$ vào catôt có giới hạn quang điện $\\lambda_0 = 0{,}414\\,\\mu\\text{m}$. Tính động năng ban đầu cực đại của quang electron theo đơn vị $\\text{eV}$ và hiệu điện thế hãm $U_h$ (lấy $hc = 1{,}242\\text{ eV}\\cdot\\mu\\text{m}$).',
        hint: 'Tính $\\varepsilon = hc/\\lambda$ và $A = hc/\\lambda_0$ theo $\\text{eV}$, rồi lấy hiệu $\\varepsilon - A$.',
        rubricChecklist: [
          'Tính $\\varepsilon = 1{,}242 / 0{,}2484 = 5\\text{ eV}$ và $A = 1{,}242 / 0{,}414 = 3\\text{ eV}$.',
          'Tính $W_{đ0\\max} = 5 - 3 = 2\\text{ eV} \\implies U_h = 2\\text{ V}$.'
        ],
        sampleAnswer: 'Năng lượng mỗi phôtôn tới là $\\varepsilon = \\frac{1{,}242}{0{,}2484} = 5{,}0\\text{ eV}$. Công thoát electron là $A = \\frac{1{,}242}{0{,}414} = 3{,}0\\text{ eV}$. Áp dụng hệ thức Einstein: $W_{đ0\\max} = \\varepsilon - A = 5{,}0 - 3{,}0 = 2{,}0\\text{ eV}$, suy ra hiệu điện thế hãm là $U_h = 2{,}0\\text{ V}$.'
      }
    },
    {
      stepTitle: '3. Cường độ Dòng Quang điện Bão hòa & Hiệu suất Lượng tử',
      stepType: 'example',
      conceptSection:
        'Khi hiệu điện thế anôt – catôt $U_{AK}$ đủ lớn dương để hút toàn bộ các quang electron bứt ra khỏi catôt về anôt trong mỗi giây, dòng quang điện đạt giá trị không đổi gọi là **dòng quang điện bão hòa** $I_{bh}$.',
      formulaSection: {
        primaryFormula: 'P = n_p\\cdot\\frac{hc}{\\lambda}, \\qquad I_{bh} = n_e\\cdot |e|, \\qquad H = \\frac{n_e}{n_p}\\cdot 100\\%',
        secondaryFormulas: [
          'I_{bh} = H\\cdot \\frac{P\\lambda}{hc}\\cdot |e|'
        ],
        variablesNote:
          '• $P$: công suất bức xạ chiếu tới catôt ($\\text{W}$); $n_p$: số phôtôn đập vào catôt trong 1 giây.\n• $n_e$: số electron thoát ra khỏi catôt trong 1 giây; $H$: **hiệu suất lượng tử** (tỉ lệ phôtôn bật được electron, thường nhỏ hơn $100\\%$).'
      },
      deepDiveSection:
        'Đồ thị đặc trưng Vôn – Ampe của tế bào quang điện: khi $U_{AK} \\le -U_h$ thì $I = 0$; khi $U_{AK}$ tăng từ $-U_h$ tới giá trị dương đủ lớn thì $I$ tăng dần và đi ngang thành đường bão hòa $I_{bh}$. Tăng cường độ chùm sáng chỉ đẩy đường bão hòa $I_{bh}$ **lên cao**, còn điểm cắt $-U_h$ trên trục hoành vẫn **giữ nguyên**!',
      teacherExplanation:
        'Phân biệt hai đồ thị: đổi cường độ sáng $\\to$ đổi $I_{bh}$ (giữ nguyên $U_h$); đổi màu ánh sáng ($\lambda$) $\\to$ đổi điểm cắt $-U_h$.',
      keyTakeaway: 'Dòng quang điện bão hòa $I_{bh}$ tỉ lệ thuận với số phôtôn chiếu tới mỗi giây (cường độ sáng).',
      miniQuiz: [
        {
          id: 'p12ph-s3-q1',
          question: 'Chiếu chùm sáng công suất $P$ gây quang điện vào catôt tế bào quang điện với hiệu suất lượng tử $H = 1\\%$. Nếu trong $1\\text{ s}$ có $10^{18}$ phôtôn đập vào catôt thì cường độ dòng quang điện bão hòa là:',
          options: ['A. $1{,}6\\text{ A}$', 'B. $1{,}6\\text{ mA}$', 'C. $16\\text{ mA}$', 'D. $0{,}16\\text{ mA}$'],
          correctIndex: 1,
          explanation: '$n_e = 0{,}01\\cdot 10^{18} = 10^{16}$ electron/s $\\implies I_{bh} = 10^{16}\\cdot 1{,}6\\cdot 10^{-19} = 1{,}6\\cdot 10^{-3}\\text{ A} = 1{,}6\\text{ mA}$.'
        },
        {
          id: 'p12ph-s3-q2',
          question: 'Khi tăng hiệu điện thế $U_{AK}$ vượt quá giá trị cần thiết tạo dòng bão hòa thì cường độ dòng quang điện $I_{bh}$:',
          options: ['A. Tiếp tục tăng tuyến tính', 'B. Tăng theo hàm mũ', 'C. Hầu như không đổi vì mọi quang electron đã về hết anôt', 'D. Giảm dần về 0'],
          correctIndex: 2,
          explanation: 'Toàn bộ electron bứt ra mỗi giây đều đã được hút tới anôt nên tăng thêm $U_{AK}$ không tạo thêm hạt tải mới.'
        }
      ],
      miniEssay: {
        id: 'p12ph-s3-e1',
        question: 'Nguồn sáng đơn sắc $\\lambda = 0{,}4\\,\\mu\\text{m}$ có công suất $P = 3{,}975\\text{ mW}$ chiếu vào catôt có hiệu suất lượng tử $H = 2\\%$. Tính số phôtôn chiếu tới mỗi giây và dòng quang điện bão hòa ($hc = 1{,}9875\\cdot 10^{-25}\\text{ J}\\cdot\\text{m}$).',
        hint: 'Tính năng lượng 1 phôtôn $\\varepsilon = hc/\\lambda$, lấy $n_p = P/\\varepsilon$, rồi $I_{bh} = H\\cdot n_p\\cdot |e|$.',
        rubricChecklist: [
          'Tính $\\varepsilon = \\frac{1{,}9875\\cdot 10^{-25}}{0{,}4\\cdot 10^{-6}} = 4{,}96875\\cdot 10^{-19}\\text{ J}$, suy ra $n_p = 8\\cdot 10^{15}\\text{ phôtôn/s}$.',
          'Tính $n_e = 0{,}02\\cdot 8\\cdot 10^{15} = 1{,}6\\cdot 10^{14}\\text{ e/s} \\implies I_{bh} = 2{,}56\\cdot 10^{-5}\\text{ A} = 25{,}6\\,\\mu\\text{A}$.'
        ],
        sampleAnswer: 'Năng lượng một phôtôn là $\\varepsilon = \\frac{1{,}9875\\cdot 10^{-25}}{0{,}4\\cdot 10^{-6}} = 4{,}96875\\cdot 10^{-19}\\text{ J}$. Số phôtôn chiếu tới catôt mỗi giây là $n_p = \\frac{P}{\\varepsilon} = \\frac{3{,}975\\cdot 10^{-3}}{4{,}96875\\cdot 10^{-19}} = 8\\cdot 10^{15}\\text{ phôtôn/s}$. Với hiệu suất $H = 2\\%$, số electron thoát ra mỗi giây là $n_e = 0{,}02 \\times 8\\cdot 10^{15} = 1{,}6\\cdot 10^{14}\\text{ electron/s}$. Dòng quang điện bão hòa là $I_{bh} = n_e |e| = 1{,}6\\cdot 10^{14} \\times 1{,}6\\cdot 10^{-19} = 2{,}56\\cdot 10^{-5}\\text{ A} = 25{,}6\\,\\mu\\text{A}$.'
      }
    }
  ]
};
