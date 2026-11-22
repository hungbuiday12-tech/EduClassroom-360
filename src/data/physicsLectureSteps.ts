import { LectureStep } from '../types';

export const PHYSICS_CUSTOM_LECTURE_STEPS: Record<string, LectureStep[]> = {
  'phys-9-mech-heat': [
    {
      stepTitle: '1. Động năng của vật chuyển động W_đ = ½mv²',
      stepType: 'intuition',
      conceptSection:
        'Theo chương trình GDPT 2018 KHTN 9 (Bài 2), mọi vật đang chuyển động đều mang năng lượng gọi là **động năng** ($W_đ$). Động năng phụ thuộc vào khối lượng $m$ và đặc biệt tỉ lệ với **bình phương** tốc độ $v^2$.',
      formulaSection: {
        primaryFormula: 'W_đ = \\frac{1}{2} m v^2 \\quad (\\text{J})',
        secondaryFormulas: [
          '1\\text{ m/s} = 3{,}6\\text{ km/h}, \\qquad 1\\text{ kJ} = 1000\\text{ J}',
          'v' + ' \\text{ tăng } 2 \\text{ lần} \\implies W_đ \\text{ tăng } 4 \\text{ lần}'
        ],
        variablesNote:
          '• $m$: khối lượng của vật (đổi về $\\text{kg}$, $1\\text{ tấn} = 1000\\text{ kg}$).\n• $v$: tốc độ tức thời (đổi về $\\text{m/s}$ bằng cách chia $3{,}6$ từ $\\text{km/h}$).\n• $W_đ$: động năng (đơn vị Jun, $\\text{J}$).'
      },
      deepDiveSection:
        'Tại sao khi xe ô tô chạy gấp đôi tốc độ (từ $40\\text{ km/h}$ lên $80\\text{ km/h}$) thì quãng đường phanh tối thiểu lại tăng gấp 4 lần?\n\nVì theo $W_đ = \\frac{1}{2}mv^2$, động năng tăng $2^2 = 4$ lần, nên lực hãm phanh $F_{\\text{hãm}}$ không đổi phải thực hiện công $A = F_{\\text{hãm}} \\cdot s = W_đ$ trên quãng đường $s$ dài gấp 4 lần mới triệt tiêu hết động năng!',
      teacherExplanation:
        'Trước khi thay số vào $W_đ = \\frac{1}{2}mv^2$, luôn kiểm tra 2 bẫy đơn vị kinh điển: khối lượng phải tính bằng kg (không phải g hay tấn) và vận tốc tính bằng m/s (không phải km/h).',
      formulaHighlight: 'W_đ = \\frac{1}{2}mv^2',
      keyTakeaway:
        'Động năng tỉ lệ bậc nhất với khối lượng $m$ và tỉ lệ bậc hai với tốc độ $v^2$.',
      miniQuiz: [
        {
          id: 'p9mh-s1-q1',
          question:
            'Một ô tô khối lượng $1{,}5\\text{ tấn}$ chạy đều với tốc độ $72\\text{ km/h}$. Động năng của ô tô bằng:',
          options: ['A. $300\\text{ kJ}$', 'B. $600\\text{ kJ}$', 'C. $30\\text{ kJ}$', 'D. $150\\text{ kJ}$'],
          correctIndex: 0,
          explanation:
            'Đổi $m = 1500\\text{ kg}$, $v = 72/3{,}6 = 20\\text{ m/s}$. Suy ra $W_đ = \\frac{1}{2} \\cdot 1500 \\cdot 20^2 = 300\\,000\\text{ J} = 300\\text{ kJ}$.'
        },
        {
          id: 'p9mh-s1-q2',
          question:
            'Nếu một vật giữ nguyên khối lượng nhưng tăng tốc độ gấp $3$ lần thì động năng của vật tăng lên bao nhiêu lần?',
          options: ['A. $3$ lần', 'B. $6$ lần', 'C. $9$ lần', 'D. Không đổi'],
          correctIndex: 2,
          explanation:
            'Do $W_đ = \\frac{1}{2}mv^2$ tỉ lệ với $v^2$ nên khi $v$ tăng $3$ lần thì $W_đ$ tăng $3^2 = 9$ lần.'
        }
      ],
      miniEssay: {
        id: 'p9mh-s1-e1',
        question:
          'So sánh động năng của một xe máy $150\\text{ kg}$ chạy ở $36\\text{ km/h}$ và $72\\text{ km/h}$, từ đó giải thích nguyên tắc an toàn giao thông.',
        hint: 'Đổi $36\\text{ km/h} = 10\\text{ m/s}$, $72\\text{ km/h} = 20\\text{ m/s}$ rồi tính $W_đ = \\frac{1}{2}mv^2$.',
        rubricChecklist: [
          'Tính đúng $W_{đ1} = 7{,}5\\text{ kJ}$ và $W_{đ2} = 30\\text{ kJ}$.',
          'Kết luận tốc độ tăng 2 lần làm động năng (và công hãm phanh) tăng 4 lần.'
        ],
        sampleAnswer:
          'Ở $36\\text{ km/h} = 10\\text{ m/s}$: $W_{đ1} = 0{,}5 \\cdot 150 \\cdot 10^2 = 7500\\text{ J} = 7{,}5\\text{ kJ}$.\nỞ $72\\text{ km/h} = 20\\text{ m/s}$: $W_{đ2} = 0{,}5 \\cdot 150 \\cdot 20^2 = 30\\,000\\text{ J} = 30\\text{ kJ}$.\nKhi tốc độ tăng 2 lần, động năng tăng 4 lần làm quãng đường phanh tăng 4 lần, nên chạy quá tốc độ cực kỳ nguy hiểm.'
      }
    },
    {
      stepTitle: '2. Thế năng trọng trường W_t = Ph = mgh',
      stepType: 'concept',
      conceptSection:
        'Vật ở độ cao $h$ so với một mốc chọn (thường lấy mặt đất) có khả năng sinh công khi rơi xuống — năng lượng này gọi là **thế năng trọng trường** ($W_t$).',
      formulaSection: {
        primaryFormula: 'W_t = P \\cdot h = m g h',
        secondaryFormulas: [
          'P = 10m \\text{ (KHTN 9)} \\quad \\text{hoặc} \\quad P = mg \\; (g \\approx 9{,}8\\text{ m/s}^2)',
          '\\Delta W_t = P(h_2 - h_1)'
        ],
        variablesNote:
          '• $P$: trọng lượng vật ($\\text{N}$); $m$: khối lượng ($\\text{kg}$).\n• $h$: độ cao so với **mốc thế năng** ($\\text{m}$).\n• Thế năng phụ thuộc vào mốc chọn độ cao: cùng một quyển sách trên bàn sẽ có $W_t > 0$ so với sàn nhà, nhưng $W_t = 0$ so với mặt bàn.'
      },
      deepDiveSection:
        'Trên công trường hay đập thủy điện, người ta dùng thế năng của búa máy hay cột nước ở độ cao $h$ lớn: khi thả búa máy khối lượng $M$ từ độ cao $h$, thế năng $W_t = Ph$ chuyển hóa thành động năng đóng sâu cọc bê tông; nước hồ chứa trên cao chảy qua tuabin phát điện với công suất tỉ lệ với cột áp $h$.',
      teacherExplanation:
        'Luôn chỉ rõ "chọn mốc thế năng tại đâu" (mặt đất, đáy giếng hay mặt bàn) trước khi viết $h$ và tính $W_t$.',
      formulaHighlight: 'W_t = P \\cdot h = mgh',
      keyTakeaway:
        'Thế năng trọng trường phụ thuộc vào trọng lượng $P$ và độ cao $h$ tính từ mốc thế năng đã chọn.',
      miniQuiz: [
        {
          id: 'p9mh-s2-q1',
          question:
            'Một thùng hàng khối lượng $40\\text{ kg}$ được cẩu lên đặt tại tầng cao $5\\text{ m}$ so với mặt sân (lấy $P = 10m$). Thế năng trọng trường của thùng hàng so với mặt sân là:',
          options: ['A. $200\\text{ J}$', 'B. $2000\\text{ J}$', 'C. $400\\text{ J}$', 'D. $20\\,000\\text{ J}$'],
          correctIndex: 1,
          explanation:
            'Trọng lượng $P = 10 \\cdot 40 = 400\\text{ N}$. Thế năng $W_t = P \\cdot h = 400 \\cdot 5 = 2000\\text{ J}$.'
        },
        {
          id: 'p9mh-s2-q2',
          question:
            'Một chiếc đèn chùm nặng $5\\text{ kg}$ treo cách mặt sàn $3\\text{ m}$ và cách mặt bàn $2{,}2\\text{ m}$. Thế năng trọng trường của đèn chọn mốc tại mặt bàn bằng bao nhiêu ($g = 10\\text{ m/s}^2$)?',
          options: ['A. $150\\text{ J}$', 'B. $110\\text{ J}$', 'C. $40\\text{ J}$', 'D. $0\\text{ J}$'],
          correctIndex: 1,
          explanation:
            'Khi chọn mốc tại mặt bàn, độ cao $h = 2{,}2\\text{ m} \\implies W_t = 5 \\cdot 10 \\cdot 2{,}2 = 110\\text{ J}$.'
        }
      ],
      miniEssay: {
        id: 'p9mh-s2-e1',
        question:
          'Thả một quả cầu khối lượng $2\\text{ kg}$ từ độ cao $15\\text{ m}$ so với mặt đất ($g = 10\\text{ m/s}^2$). Tính thế năng ban đầu và độ giảm thế năng khi quả cầu rơi xuống đến độ cao $5\\text{ m}$.',
        hint: 'Tính $W_{t1}$ tại $h_1 = 15\\text{ m}$ và $W_{t2}$ tại $h_2 = 5\\text{ m}$, lấy hiệu $W_{t1} - W_{t2}$.',
        rubricChecklist: [
          'Tính đúng $W_{t1} = 300\\text{ J}$ và $W_{t2} = 100\\text{ J}$.',
          'Suy ra độ giảm thế năng $\\Delta W_t = 200\\text{ J}$ (bằng động năng vật thu được nếu bỏ qua cản).'
        ],
        sampleAnswer:
          'Chọn mốc thế năng tại mặt đất. Ban đầu tại $h_1 = 15\\text{ m}$: $W_{t1} = mgh_1 = 2 \\cdot 10 \\cdot 15 = 300\\text{ J}$.\nTại $h_2 = 5\\text{ m}$: $W_{t2} = 2 \\cdot 10 \\cdot 5 = 100\\text{ J}$.\nĐộ giảm thế năng là $300 - 100 = 200\\text{ J}$.'
      }
    },
    {
      stepTitle: '3. Chuyển hóa Động năng – Thế năng & Cơ năng',
      stepType: 'derivation',
      conceptSection:
        'Trong quá trình vật rơi, ném lên hay con lắc dao động, động năng và thế năng không đứng yên tách rời mà **chuyển hóa qua lại lẫn nhau**. Tổng hai dạng năng lượng này gọi là **cơ năng** $W = W_đ + W_t$.',
      formulaSection: {
        primaryFormula: 'W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh = \\text{hằng số}',
        secondaryFormulas: [
          'v_{\\text{chạm đất}} = \\sqrt{2 g h_0}',
          'W_đ(\\text{tại } h) = m g (h_0 - h)'
        ],
        variablesNote:
          '• Khi vật đi xuống: $h$ giảm ($W_t$ giảm) và $v$ tăng ($W_đ$ tăng).\n• Khi ném vật lên cao: $v$ giảm ($W_đ$ giảm) chuyển dần thành $W_t$ tăng.\n• Nếu không có lực cản không khí, độ giảm thế năng bằng đúng độ tăng động năng.'
      },
      deepDiveSection:
        'Một tính chất đẹp của bảo toàn cơ năng là tốc độ chạm đất $v = \\sqrt{2gh_0}$ hoàn toàn **không phụ thuộc khối lượng** $m$ của vật (nếu bỏ qua sức cản không khí). Tại nửa độ cao ban đầu ($h = h_0/2$), thế năng và động năng bằng đúng một nửa cơ năng: $W_đ = W_t = W/2$.',
      teacherExplanation:
        'Hãy quan sát đồng thời hai cột năng lượng $W_đ$ và $W_t$ trong mô phỏng: một cột tụt xuống bao nhiêu thì cột kia lập tức dâng lên đúng bấy nhiêu.',
      formulaHighlight: 'W = \\frac{1}{2}mv^2 + mgh = \\text{hằng số}',
      workedExample: {
        problem:
          'Thả một quả bóng $m = 0{,}5\\text{ kg}$ không vận tốc đầu từ độ cao $h_0 = 20\\text{ m}$ ($g = 10\\text{ m/s}^2$, bỏ qua cản). Tìm độ cao $h$ nơi động năng bằng $3$ lần thế năng.',
        steps: [
          'Bước 1: Cơ năng ban đầu tại $h_0 = 20\\text{ m}$: $W = mgh_0 = 0{,}5 \\cdot 10 \\cdot 20 = 100\\text{ J}$.',
          'Bước 2: Tại vị trí cần tìm, $W_đ = 3W_t \\implies W = W_đ + W_t = 4W_t = 4mgh$.',
          'Bước 3: Bảo toàn cơ năng $4mgh = mgh_0 \\implies h = \\frac{h_0}{4} = \\frac{20}{4} = 5\\text{ m}$.'
        ],
        answer: '$h = 5\\text{ m}$ (khi đó $W_t = 25\\text{ J}$, $W_đ = 75\\text{ J}$).'
      },
      keyTakeaway:
        'Bỏ qua lực cản không khí: độ giảm thế năng luôn chuyển hóa toàn bộ thành độ tăng động năng.',
      miniQuiz: [
        {
          id: 'p9mh-s3-q1',
          question:
            'Một vật $m = 2\\text{ kg}$ rơi tự do từ độ cao $h_0 = 5\\text{ m}$ ($g = 10\\text{ m/s}^2$). Khi ở độ cao $2\\text{ m}$, động năng của vật là:',
          options: ['A. $40\\text{ J}$', 'B. $60\\text{ J}$', 'C. $100\\text{ J}$', 'D. $20\\text{ J}$'],
          correctIndex: 1,
          explanation:
            '$W = 2 \\cdot 10 \\cdot 5 = 100\\text{ J}$, $W_t = 2 \\cdot 10 \\cdot 2 = 40\\text{ J} \\implies W_đ = 100 - 40 = 60\\text{ J}$.'
        },
        {
          id: 'p9mh-s3-q2',
          question:
            'Ném thẳng đứng một hòn bi lên cao (bỏ qua lực cản). Trong lúc hòn bi đang bay lên, sự chuyển hóa năng lượng là:',
          options: [
            'A. Thế năng chuyển hóa thành động năng',
            'B. Động năng chuyển hóa thành thế năng',
            'C. Cơ năng tăng dần đến vô cực',
            'D. Động năng không thay đổi'
          ],
          correctIndex: 1,
          explanation:
            'Khi bay lên, tốc độ giảm dần nên động năng giảm dần, còn độ cao tăng nên thế năng tăng lên.'
        }
      ],
      miniEssay: {
        id: 'p9mh-s3-e1',
        question:
          'Từ độ cao $45\\text{ m}$, thả rơi một vật $1\\text{ kg}$ ($g = 10\\text{ m/s}^2$, bỏ qua cản). Tính vận tốc vật khi chạm đất và khi ở độ cao $25\\text{ m}$.',
        hint: 'Dùng $v = \\sqrt{2g(h_0 - h)}$.',
        rubricChecklist: [
          'Tại mặt đất ($h = 0$): $v = \\sqrt{2 \\cdot 10 \\cdot 45} = 30\\text{ m/s}$.',
          'Tại $h = 25\\text{ m}$: $v = \\sqrt{2 \\cdot 10 \\cdot (45 - 25)} = 20\\text{ m/s}$.'
        ],
        sampleAnswer:
          'Theo bảo toàn cơ năng $\\frac{1}{2}mv^2 = mg(h_0 - h) \\implies v = \\sqrt{2g(h_0 - h)}$.\n• Khi chạm đất ($h = 0$): $v = \\sqrt{2\\cdot 10\\cdot 45} = 30\\text{ m/s}$.\n• Tại độ cao $25\\text{ m}$: $v = \\sqrt{2\\cdot 10\\cdot(45 - 25)} = 20\\text{ m/s}$.'
      }
    },
    {
      stepTitle: '4. Thực hành Kiểm chứng Rơi tự do & Bảo toàn Năng lượng 2D',
      stepType: 'experiment',
      conceptSection:
        'Trong vật lí học thực nghiệm, mỗi công thức lý thuyết cần được đối chiếu bằng cách đo đạc trực tiếp khi thay đổi **từng biến kiểm soát một** (như độ cao $h$, khối lượng $m$, gia tốc trọng trường $g$ hoặc lực cản không khí).',
      formulaSection: {
        primaryFormula: 't_{\\text{rơi}} = \\sqrt{\\frac{2h}{g}}, \\qquad v_{\\text{chạm đất}} = \\sqrt{2gh}',
        secondaryFormulas: ['W_{\\text{mất mát}} = |W_{\\text{sau}} - W_{\\text{đầu}}| \\ge 0 \\text{ (khi có lực cản)}'],
        variablesNote:
          '• $t_{\\text{rơi}}$: thời gian từ lúc thả không vận tốc đầu đến lúc chạm đất ($\\text{s}$).\n• Quan sát biểu đồ cột $W_đ$ và $W_t$ trong Lab 2D để thấy tổng $W$ không đổi khi tắt ma sát.'
      },
      deepDiveSection:
        'Trên Trái Đất ($g \\approx 9{,}8\\text{ m/s}^2$), nếu bật lực cản không khí, một phần cơ năng chuyển hóa thành nhiệt làm nóng không khí và vật nên chiều cao nảy lại hoặc động năng cuối luôn nhỏ hơn cơ năng ban đầu. Khi chuyển sang Mặt Trăng ($g \\approx 1{,}62\\text{ m/s}^2$), gia tốc giảm 6 lần khiến thời gian rơi tăng $\\sqrt{6} \\approx 2{,}45$ lần.',
      teacherExplanation:
        'Hãy mở sang tab 2. Thí Nghiệm 2D để tự tay nhập số liệu, dùng đồng hồ bấm giây và ghi lại ít nhất 3 mẫu đo vào bảng so sánh.',
      keyTakeaway:
        'Phương pháp biến kiểm soát: muốn khảo sát ảnh hưởng của $h$ lên $v$, chỉ thay đổi $h$ và giữ nguyên $m, g$.',
      miniQuiz: [
        {
          id: 'p9mh-s4-q1',
          question:
            'Nếu thả rơi tự do một vật từ độ cao tăng gấp 4 lần (giữ nguyên $g$, không lực cản), thời gian rơi sẽ thay đổi thế nào?',
          options: ['A. Tăng 4 lần', 'B. Tăng 2 lần', 'C. Giảm 2 lần', 'D. Không đổi'],
          correctIndex: 1,
          explanation:
            'Từ $t = \\sqrt{\\frac{2h}{g}}$, khi $h$ tăng 4 lần thì $\\sqrt{h}$ tăng $\\sqrt{4} = 2$ lần.'
        },
        {
          id: 'p9mh-s4-q2',
          question:
            'Khi thí nghiệm với cùng độ cao $h = 20\\text{ m}$ không ma sát, nếu tăng khối lượng quả cầu từ $1\\text{ kg}$ lên $5\\text{ kg}$ thì đại lượng nào KHÔNG thay đổi?',
          options: [
            'A. Thế năng ban đầu $W_t$',
            'B. Động năng ngay trước khi chạm đất $W_đ$',
            'C. Vận tốc chạm đất $v$ và thời gian rơi $t$',
            'D. Trọng lực $P$ tác dụng lên quả cầu'
          ],
          correctIndex: 2,
          explanation:
            '$W_t, W_đ, P$ đều tỉ lệ thuận với khối lượng $m$, riêng $v = \\sqrt{2gh}$ và $t = \\sqrt{2h/g}$ hoàn toàn độc lập với $m$.'
        }
      ],
      miniEssay: {
        id: 'p9mh-s4-e1',
        question:
          'Nếu em thực hiện thí nghiệm thả rơi hai vật nặng nhẹ khác nhau trong buồng chân không và ngoài không khí thường, hiện tượng quan sát được ở cột năng lượng và thời gian rơi khác nhau như thế nào?',
        hint: 'So sánh vai trò của lực cản không khí với tổng cơ năng $W_đ + W_t$.',
        rubricChecklist: [
          'Trong chân không: hai vật rơi như nhau, tổng $W_đ + W_t$ bảo toàn không đổi.',
          'Ngoài không khí: có lực cản làm một phần cơ năng chuyển thành nhiệt ($W$ giảm dần), vật nhẹ/diện tích cản lớn rơi chậm hơn.'
        ],
        sampleAnswer:
          'Trong chân không (không lực cản), cả hai vật đều rơi với cùng gia tốc $g$, chạm đất cùng lúc ($t = \\sqrt{2h/g}$) và tổng cột $W_đ + W_t$ giữ nguyên không đổi. Khi có không khí, lực cản sinh công âm khiến tổng cơ năng $W_đ + W_t$ giảm dần (chuyển thành nhiệt) và làm vật rơi chậm hơn.'
      }
    }
  ],

  'phys-9-elec': [
    {
      stepTitle: '1. Bản chất dòng điện & Định luật Ôm I = U / R',
      stepType: 'intuition',
      conceptSection:
        'Hiệu điện thế $U$ đóng vai trò như "áp lực đẩy" của nguồn điện tạo ra dòng chuyển dời có hướng của các hạt mang điện, cường độ dòng điện $I$ đo "lưu lượng điện tích" đi qua tiết diện dây trong $1\\text{ giây}$, còn điện trở $R$ biểu thị mức độ cản trở dòng điện của vật dẫn.',
      formulaSection: {
        primaryFormula: 'I = \\frac{U}{R} \\qquad \\Longleftrightarrow \\qquad U = I \\cdot R',
        secondaryFormulas: ['R = \\rho \\frac{l}{S}'],
        variablesNote:
          '• $I$: cường độ dòng điện (Ampe, $\\text{A}$).\n• $U$: hiệu điện thế (Vôn, $\\text{V}$).\n• $R$: điện trở (Ôm, $\\Omega$); $R$ chỉ phụ thuộc vật liệu ($\\rho$), chiều dài ($l$), tiết diện ($S$), KHÔNG phụ thuộc vào $U$ hay $I$.'
      },
      deepDiveSection:
        'Một lỗi hiểu nhầm rất phổ biến là nhìn công thức $R = U/I$ rồi kết luận "khi tăng $U$ gấp đôi thì $R$ tăng gấp đôi". Điều đó SAI! Đối với một dây dẫn kim loại ở nhiệt độ không đổi, $R$ là hằng số đặc trưng của dây; khi tăng $U$ gấp đôi thì $I$ cũng tăng gấp đôi sao cho tỉ số $U/I = R$ không đổi.',
      teacherExplanation:
        'Định luật Ôm khẳng định cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở của dây.',
      formulaHighlight: 'I = \\frac{U}{R}',
      keyTakeaway:
        'Điện trở $R$ là thuộc tính nội tại của dây dẫn ($R = \\rho l/S$); thay đổi $U$ làm thay đổi $I$ chứ không làm thay đổi $R$ của điện trở tuyến tính.',
      miniQuiz: [
        {
          id: 'p9el-s1-q1',
          question:
            'Đặt hiệu điện thế $U = 12\\text{ V}$ vào hai đầu một điện trở $R = 4\\,\\Omega$. Nếu tăng hiệu điện thế lên $24\\text{ V}$ thì cường độ dòng điện và điện trở $R$ lúc này lần lượt là:',
          options: [
            'A. $I = 6\\text{ A};\\; R = 4\\,\\Omega$',
            'B. $I = 3\\text{ A};\\; R = 8\\,\\Omega$',
            'C. $I = 6\\text{ A};\\; R = 8\\,\\Omega$',
            'D. $I = 1{,}5\\text{ A};\\; R = 4\\,\\Omega$'
          ],
          correctIndex: 0,
          explanation:
            'Điện trở không đổi vẫn là $R = 4\\,\\Omega$. Khi $U = 24\\text{ V}$, cường độ dòng điện là $I = U/R = 24/4 = 6\\text{ A}$.'
        },
        {
          id: 'p9el-s1-q2',
          question:
            'Nếu cắt đôi một dây dẫn đồng chất tiết diện đều thành hai đoạn bằng nhau rồi chỉ dùng một nửa đoạn dây đó, điện trở của đoạn nửa dây sẽ:',
          options: ['A. Tăng gấp đôi', 'B. Giảm đi một nửa', 'C. Không thay đổi', 'D. Giảm đi 4 lần'],
          correctIndex: 1,
          explanation:
            'Theo $R = \\rho\\frac{l}{S}$, khi chiều dài $l$ giảm một nửa (giữ nguyên $\\rho$ và $S$) thì điện trở $R$ giảm đi một nửa.'
        }
      ],
      miniEssay: {
        id: 'p9el-s1-e1',
        question:
          'Giải thích ngắn gọn vì sao từ công thức $R = U/I$, người ta không nói "điện trở tỉ lệ thuận với hiệu điện thế $U$" và cho biết điện trở dây dẫn phụ thuộc vào những yếu tố nào.',
        hint: 'Nêu rõ khi $U$ tăng thì $I$ tăng tỉ lệ thuận theo, còn $R$ chỉ phụ thuộc cấu tạo dây dẫn.',
        rubricChecklist: [
          'Giải thích được khi $U$ thay đổi, $I$ thay đổi tỉ lệ thuận nên tỉ số $U/I$ không đổi.',
          'Nêu đúng công thức/yếu tố quyết định $R = \\rho l/S$: vật liệu ($\\rho$), chiều dài ($l$), tiết diện ($S$).'
        ],
        sampleAnswer:
          'Với một vật dẫn xác định ở nhiệt độ không đổi, khi tăng $U$ lên $k$ lần thì $I$ cũng tăng $k$ lần nên tỉ số $R = U/I$ không đổi. Điện trở $R$ chỉ phụ thuộc vào bản chất vật liệu (điện trở suất $\\rho$), chiều dài dây ($l$) và tiết diện dây ($S$) theo hệ thức $R = \\rho\\frac{l}{S}$.'
      }
    },
    {
      stepTitle: '2. Mạch Nối Tiếp vs Mạch Song Song',
      stepType: 'derivation',
      conceptSection:
        '• **Mạch nối tiếp**: Các điện trở mắc liên tiếp nhau tạo thành **một đường đi duy nhất** cho dòng điện, nên dòng qua mọi phần tử bằng nhau.\n• **Mạch song song**: Hai đầu các điện trở chập chung vào hai nút mạch, tạo nhiều **nhánh rẽ song song** có cùng hiệu điện thế.',
      formulaSection: {
        primaryFormula: 'R_{nt} = R_1 + R_2, \\qquad R_{ss} = \\frac{R_1 R_2}{R_1 + R_2}',
        secondaryFormulas: [
          '\\text{Nối tiếp: } I = I_1 = I_2, \\quad U = U_1 + U_2',
          '\\text{Song song: } U = U_1 = U_2, \\quad I = I_1 + I_2'
        ],
        variablesNote:
          '• Nối tiếp: $R_{nt} > \\max(R_1, R_2)$ (tăng cản trở).\n• Song song: $R_{ss} < \\min(R_1, R_2)$ (mở thêm đường đi cho dòng điện nên tổng trở giảm xuống nhỏ hơn từng nhánh).'
      },
      deepDiveSection:
        'Trong mạng điện dân dụng $220\\text{ V}$, tất cả đèn, quạt, tủ lạnh đều mắc **song song** để: (1) mỗi thiết bị nhận đúng hiệu điện thế định mức $220\\text{ V}$, và (2) tắt hoặc hỏng một thiết bị không làm ngắt dòng qua các thiết bị còn lại. Ngược lại, cầu chì hoặc aptomat phải mắc **nối tiếp** ở đầu mạch chính để khi quá dòng sẽ ngắt toàn bộ mạch.',
      teacherExplanation:
        'Phân biệt nối tiếp và song song dựa trên 2 quy tắc vàng: nối tiếp giữ nguyên dòng $I$ (chia áp $U$), song song giữ nguyên áp $U$ (chia dòng $I$).',
      formulaHighlight: 'R_{nt} = R_1 + R_2, \\qquad R_{ss} = \\frac{R_1 R_2}{R_1 + R_2}',
      keyTakeaway:
        'Mắc thêm nhánh song song làm điện trở tương đương GIẢM và dòng mạch chính TĂNG.',
      miniQuiz: [
        {
          id: 'p9el-s2-q1',
          question:
            'Hai điện trở $R_1 = 6\\,\\Omega$ và $R_2 = 12\\,\\Omega$ mắc song song vào nguồn $U = 12\\text{ V}$. Cường độ dòng điện mạch chính bằng:',
          options: ['A. $0{,}67\\text{ A}$', 'B. $3\\text{ A}$', 'C. $2\\text{ A}$', 'D. $1\\text{ A}$'],
          correctIndex: 1,
          explanation:
            '$R_{ss} = \\frac{6 \\cdot 12}{6 + 12} = 4\\,\\Omega \\implies I = \\frac{12}{4} = 3\\text{ A}$ (hoặc $I_1 = 2\\text{ A}, I_2 = 1\\text{ A} \\implies I = 3\\text{ A}$).'
        },
        {
          id: 'p9el-s2-q2',
          question:
            'Hai điện trở $R_1 = 4\\,\\Omega$ và $R_2 = 8\\,\\Omega$ mắc nối tiếp. Hiệu điện thế $U_2$ trên $R_2$ so với $U_1$ trên $R_1$ như thế nào?',
          options: ['A. $U_2 = U_1$', 'B. $U_2 = 2 U_1$', 'C. $U_2 = 0{,}5 U_1$', 'D. $U_2 = 4 U_1$'],
          correctIndex: 1,
          explanation:
            'Mạch nối tiếp có cùng $I$ nên $U = I \\cdot R$ tỉ lệ thuận với $R$. Vì $R_2 = 2R_1$ nên $U_2 = 2U_1$.'
        }
      ],
      miniEssay: {
        id: 'p9el-s2-e1',
        question:
          'Cho $R_1 = 6\\,\\Omega$ và $R_2 = 12\\,\\Omega$ cùng nguồn $U = 24\\text{ V}$. Hãy tính $R_{tđ}$ và cường độ dòng điện mạch chính trong cả hai cách mắc nối tiếp và song song, rồi rút ra nhận xét.',
        hint: 'Tính $R_{nt} = R_1 + R_2$ và $R_{ss} = \\frac{R_1 R_2}{R_1 + R_2}$, sau đó dùng $I = U / R_{tđ}$.',
        rubricChecklist: [
          'Nối tiếp: $R_{nt} = 18\\,\\Omega$, $I_{nt} = \\frac{24}{18} \\approx 1{,}33\\text{ A}$.',
          'Song song: $R_{ss} = 4\\,\\Omega$, $I_{ss} = \\frac{24}{4} = 6\\text{ A}$.',
          'Nhận xét: Cùng nguồn $U$, mạch song song có $R_{tđ}$ nhỏ hơn nên dòng mạch chính lớn hơn.'
        ],
        sampleAnswer:
          '• Mắc nối tiếp: $R_{nt} = 6 + 12 = 18\\,\\Omega \\implies I_{nt} = \\frac{24}{18} \\approx 1{,}33\\text{ A}$.\n• Mắc song song: $R_{ss} = \\frac{6 \\cdot 12}{6 + 12} = 4\\,\\Omega \\implies I_{ss} = \\frac{24}{4} = 6\\text{ A}$.\nNhận xét: Mạch song song có điện trở tương đương nhỏ hơn hẳn nên dòng điện mạch chính lớn hơn nhiều ($6\\text{ A} > 1{,}33\\text{ A}$).'
      }
    },
    {
      stepTitle: '3. Công suất điện & Định luật Jun – Len-xơ',
      stepType: 'experiment',
      conceptSection:
        'Khi dòng điện chạy qua đoạn mạch, điện năng tiêu thụ chuyển hóa thành các dạng năng lượng khác (nhiệt năng, cơ năng, quang năng). Với đoạn mạch chỉ có điện trở thuần, toàn bộ điện năng biến thành nhiệt tỏa ra (Định luật Jun – Len-xơ).',
      formulaSection: {
        primaryFormula: 'P = U I = I^2 R = \\frac{U^2}{R}, \\qquad Q = I^2 R t = U I t',
        secondaryFormulas: ['A_{\\text{điện}} = P \\cdot t = U I t \\quad (1\\text{ kWh} = 3{,}6 \\cdot 10^6\\text{ J})'],
        variablesNote:
          '• $P$: công suất điện ($\\text{W}$); $Q$: nhiệt lượng tỏa ra ($\\text{J}$); $t$: thời gian dòng điện chạy qua ($\\text{s}$).\n• Dùng $P = I^2 R$ khi so sánh mạch **nối tiếp** (cùng $I$); dùng $P = U^2/R$ khi so sánh mạch **song song** (cùng $U$).'
      },
      deepDiveSection:
        'Lưu ý mẹo chọn công thức công suất siêu nhanh:\n• Khi hai bóng đèn mắc **nối tiếp** (cùng $I$), bóng nào có $R$ lớn hơn thì tỏa công suất $P = I^2 R$ lớn hơn.\n• Khi mắc **song song** vào cùng nguồn $U$, mạch song song có $R_{ss} < R_{nt}$ nên theo $P = U^2/R$, công suất tiêu thụ của mạch song song luôn lớn hơn mạch nối tiếp.',
      teacherExplanation:
        'Mở tab 2. Thí Nghiệm 2D để bật/tắt công tắc K, đảo cực nguồn và ghi mẫu đo đối chiếu công suất giữa mạch nối tiếp và song song.',
      formulaHighlight: 'P = U I = I^2 R = \\frac{U^2}{R}, \\qquad Q = I^2 R t',
      keyTakeaway:
        'Cùng nguồn $U$ không đổi: $P_{ss} > P_{nt}$ vì $R_{ss} < R_{nt}$ và $P = U^2/R$.',
      miniQuiz: [
        {
          id: 'p9el-s3-q1',
          question:
            'Một bếp điện có điện trở $R = 40\\,\\Omega$ hoạt động với dòng điện $I = 2{,}5\\text{ A}$ trong $10\\text{ phút}$. Nhiệt lượng bếp tỏa ra là:',
          options: ['A. $150\\text{ kJ}$', 'B. $250\\text{ kJ}$', 'C. $15\\text{ kJ}$', 'D. $60\\text{ kJ}$'],
          correctIndex: 0,
          explanation:
            '$t = 10 \\cdot 60 = 600\\text{ s}$. $Q = I^2 R t = (2{,}5)^2 \\cdot 40 \\cdot 600 = 6{,}25 \\cdot 40 \\cdot 600 = 150\\,000\\text{ J} = 150\\text{ kJ}$.'
        },
        {
          id: 'p9el-s3-q2',
          question:
            'Hai điện trở $R_1 = 10\\,\\Omega$ và $R_2 = 20\\,\\Omega$ mắc nối tiếp với nhau. Tỉ số nhiệt lượng tỏa ra $Q_1 / Q_2$ trong cùng một khoảng thời gian bằng:',
          options: ['A. $2$', 'B. $0{,}5$', 'C. $4$', 'D. $1$'],
          correctIndex: 1,
          explanation:
            'Mắc nối tiếp nên cùng $I$ và cùng $t$. Theo $Q = I^2 R t$, nhiệt lượng tỉ lệ thuận với $R$: $\\frac{Q_1}{Q_2} = \\frac{R_1}{R_2} = \\frac{10}{20} = 0{,}5$.'
        }
      ],
      miniEssay: {
        id: 'p9el-s3-e1',
        question:
          'Một bóng đèn ghi $220\\text{ V} - 100\\text{ W}$ được thắp sáng liên tục trong $5\\text{ giờ}$ ở hiệu điện thế đúng $220\\text{ V}$. Tính điện trở của bóng đèn khi sáng bình thường và số tiền điện phải trả (biết $1\\text{ kWh}$ giá $2\\,500\\text{ đồng}$).',
        hint: 'Dùng $R = U^2_{\\text{đm}} / P_{\\text{đm}}$ và đổi $100\\text{ W} = 0{,}1\\text{ kW}$.',
        rubricChecklist: [
          'Tính đúng $R = \\frac{220^2}{100} = 484\\,\\Omega$.',
          'Tính đúng điện năng $A = P \\cdot t = 0{,}1 \\cdot 5 = 0{,}5\\text{ kWh}$.',
          'Tính đúng chi phí $0{,}5 \\cdot 2500 = 1\\,250\\text{ đồng}$.'
        ],
        sampleAnswer:
          '• Điện trở bóng đèn: $R = \\frac{U^2}{P} = \\frac{220^2}{100} = 484\\,\\Omega$.\n• Điện năng tiêu thụ trong $5\\text{ giờ}$: $A = P \\cdot t = 0{,}1\\text{ kW} \\cdot 5\\text{ h} = 0{,}5\\text{ kWh}$.\n• Tiền điện: $0{,}5 \\times 2\\,500 = 1\\,250\\text{ đồng}$.'
      }
    }
  ],

  'phys-10-proj': [
    {
      stepTitle: '1. Nguyên lý độc lập chuyển động & Phương trình quỹ đạo Parabol',
      stepType: 'intuition',
      conceptSection:
        'Theo nguyên lý độc lập của chuyển động (Galileo), chuyển động cong 2D của vật bị ném trong trọng trường là sự **tổng hợp đồng thời của 2 chuyển động thẳng độc lập**: thẳng đều theo phương ngang $Ox$ (vì không có lực theo phương ngang) và thẳng biến đổi đều theo phương thẳng đứng $Oy$ (chịu gia tốc trọng trường $g$ hướng xuống).',
      formulaSection: {
        primaryFormula: 'x(t) = (v_0 \\cos\\alpha)\\,t, \\qquad y(t) = h_0 + (v_0 \\sin\\alpha)\\,t - \\frac{1}{2}gt^2',
        secondaryFormulas: [
          'v_x = v_0 \\cos\\alpha = \\text{const}, \\qquad v_y(t) = v_0 \\sin\\alpha - gt',
          'v(t) = \\sqrt{v_x^2 + v_y^2}'
        ],
        variablesNote:
          '• $v_0$ (m/s): tốc độ ném ban đầu; $\\alpha$: góc ném hợp với phương ngang ($\\alpha = 0^\\circ$ là ném ngang).\n• $h_0$ (m): độ cao ban đầu; $g$ (m/s²): gia tốc trọng trường.'
      },
      deepDiveSection:
        'Bẫy tư duy số 1: Tại đỉnh cao nhất của quỹ đạo Parabol, vật có vận tốc bằng $0$? **SAI!** Tại đỉnh cao nhất, chỉ có thành phần thẳng đứng $v_y = 0$ (vật ngừng đi lên để bắt đầu đi xuống), còn thành phần nằm ngang $v_x = v_0\\cos\\alpha$ vẫn giữ nguyên không đổi. Vì vậy tốc độ tại đỉnh bằng $v_0\\cos\\alpha > 0$ (nếu $\\alpha < 90^\\circ$).',
      teacherExplanation:
        'Khử thời gian $t = \\frac{x}{v_0\\cos\\alpha}$ thay vào $y(t)$ cho ta phương trình quỹ đạo dạng bậc hai $y(x)$ — chứng minh quỹ đạo ném là đường Parabol.',
      formulaHighlight: 'x(t) = (v_0 \\cos\\alpha)\\,t, \\qquad y(t) = h_0 + (v_0 \\sin\\alpha)\\,t - \\frac{1}{2}gt^2',
      keyTakeaway:
        'Tại đỉnh cao nhất $H_{max}$, $v_y = 0$ nhưng tốc độ toàn phần bằng $v_x = v_0\\cos\\alpha \\ne 0$.',
      miniQuiz: [
        {
          id: 'p10p-s1-q1',
          question:
            'Một vật được ném xiên từ mặt đất với tốc độ $v_0 = 20\\text{ m/s}$ dưới góc $\\alpha = 60^\\circ$ (bỏ qua sức cản). Tốc độ của vật tại điểm cao nhất của quỹ đạo là:',
          options: ['A. $0\\text{ m/s}$', 'B. $10\\text{ m/s}$', 'C. $10\\sqrt{3}\\text{ m/s}$', 'D. $20\\text{ m/s}$'],
          correctIndex: 1,
          explanation:
            'Tại điểm cao nhất $v_y = 0$, tốc độ vật bằng đúng $v_x = v_0\\cos 60^\\circ = 20 \\cdot 0{,}5 = 10\\text{ m/s}$.'
        },
        {
          id: 'p10p-s1-q2',
          question:
            'Ném ngang một vật từ độ cao $h_0 = 45\\text{ m}$ ($g = 10\\text{ m/s}^2$) với tốc độ $v_0 = 20\\text{ m/s}$. Thời gian vật rơi đến khi chạm đất là:',
          options: ['A. $2{,}25\\text{ s}$', 'B. $3\\text{ s}$', 'C. $4{,}5\\text{ s}$', 'D. $9\\text{ s}$'],
          correctIndex: 1,
          explanation:
            'Khi ném ngang ($\\alpha = 0^\\circ$), chuyển động đứng là rơi tự do: $t = \\sqrt{\\frac{2h_0}{g}} = \\sqrt{\\frac{90}{10}} = 3\\text{ s}$ (không phụ thuộc $v_0$).'
        }
      ],
      miniEssay: {
        id: 'p10p-s1-e1',
        question:
          'Từ phương trình $x(t) = (v_0\\cos\\alpha)t$ và $y(t) = (v_0\\sin\\alpha)t - \\frac{1}{2}gt^2$ (với $h_0 = 0$), hãy khử $t$ để thiết lập phương trình quỹ đạo $y(x)$ và giải thích tại sao quỹ đạo là đường Parabol.',
        hint: 'Rút $t = \\frac{x}{v_0\\cos\\alpha}$ rồi thay vào $y(t)$.',
        rubricChecklist: [
          'Rút đúng $t = \\frac{x}{v_0\\cos\\alpha}$.',
          'Thế vào được $y = (\\tan\\alpha)x - \\frac{g}{2v_0^2\\cos^2\\alpha}x^2$.',
          'Nhận xét đây là hàm bậc hai theo $x$ với hệ số $x^2$ âm nên quỹ đạo là Parabol bề lõm quay xuống.'
        ],
        sampleAnswer:
          'Từ $x = (v_0\\cos\\alpha)t \\implies t = \\frac{x}{v_0\\cos\\alpha}$.\nThay vào $y(t)$: $y = (v_0\\sin\\alpha)\\frac{x}{v_0\\cos\\alpha} - \\frac{1}{2}g\\left(\\frac{x}{v_0\\cos\\alpha}\\right)^2 = (\\tan\\alpha)x - \\frac{g}{2v_0^2\\cos^2\\alpha}x^2$.\nVì đây là hàm bậc hai dạng $y = ax^2 + bx$ với $a < 0$, quỹ đạo là đường Parabol hướng bề lõm xuống dưới.'
      }
    },
    {
      stepTitle: '2. Độ cao cực đại H_max & Tầm xa L (h₀ = 0)',
      stepType: 'derivation',
      conceptSection:
        'Khi ném xiên từ mặt đất ($h_0 = 0$), quỹ đạo Parabol đối xứng hoàn toàn qua trục đi qua đỉnh: thời gian đi lên bằng thời gian đi xuống, và điểm chạm đất có độ cao bằng $0$ cho phép tìm nhanh tầm bay xa $L$.',
      formulaSection: {
        primaryFormula: 'H_{\\max} = \\frac{v_0^2 \\sin^2\\alpha}{2g}, \\qquad L = \\frac{v_0^2 \\sin(2\\alpha)}{g}',
        secondaryFormulas: [
          't_{\\text{lên}} = \\frac{v_0\\sin\\alpha}{g}, \\qquad t_{\\text{bay}} = \\frac{2v_0\\sin\\alpha}{g}'
        ],
        variablesNote:
          '• Công thức $L = \\frac{v_0^2\\sin(2\\alpha)}{g}$ CHỈ ĐÚNG khi điểm ném và điểm chạm đất cùng độ cao ($h_0 = 0$) và bỏ qua lực cản không khí.\n• Nếu $h_0 > 0$ (ném từ vách cao), góc tầm xa cực đại sẽ nhỏ hơn $45^\\circ$.'
      },
      deepDiveSection:
        'Tính đối xứng lượng giác tuyệt đẹp của tầm xa: vì $\\sin(2(90^\\circ - \\alpha)) = \\sin(180^\\circ - 2\\alpha) = \\sin(2\\alpha)$, nên hai góc phụ nhau (như $30^\\circ$ và $60^\\circ$) cho **cùng một tầm xa $L$**, trong đó góc $60^\\circ$ bay cao hơn và ở trên không lâu hơn, còn góc $45^\\circ$ cho $\\sin(90^\\circ) = 1 \\implies L_{\\max} = \\frac{v_0^2}{g}$.',
      teacherExplanation:
        'Từ điều kiện đỉnh $v_y = 0$ suy ra $t_{\\text{lên}}$, nhân đôi được tổng thời gian bay, rồi nhân $v_x$ để ra công thức tầm xa $L$.',
      formulaHighlight: 'H_{\\max} = \\frac{v_0^2 \\sin^2\\alpha}{2g}, \\qquad L = \\frac{v_0^2 \\sin(2\\alpha)}{g}',
      keyTakeaway:
        'Hai góc phụ nhau $\\alpha_1 + \\alpha_2 = 90^\\circ$ cho cùng tầm xa $L$; tầm xa lớn nhất tại $\\alpha = 45^\\circ$ (khi $h_0 = 0$).',
      miniQuiz: [
        {
          id: 'p10p-s2-q1',
          question:
            'Ném một vật từ mặt đất với $v_0 = 20\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). Tầm bay xa cực đại có thể đạt được là:',
          options: ['A. $20\\text{ m}$', 'B. $40\\text{ m}$', 'C. $80\\text{ m}$', 'D. $40\\sqrt{2}\\text{ m}$'],
          correctIndex: 1,
          explanation:
            '$L_{\\max} = \\frac{v_0^2}{g} = \\frac{20^2}{10} = 40\\text{ m}$ (đạt được tại góc $\\alpha = 45^\\circ$).'
        },
        {
          id: 'p10p-s2-q2',
          question:
            'Với cùng tốc độ ném $v_0$ từ mặt đất (không sức cản), góc ném $\\alpha_1 = 25^\\circ$ sẽ cho cùng tầm xa với góc ném nào sau đây?',
          options: ['A. $50^\\circ$', 'B. $65^\\circ$', 'C. $45^\\circ$', 'D. $75^\\circ$'],
          correctIndex: 1,
          explanation:
            'Hai góc phụ nhau $\\alpha_1 + \\alpha_2 = 90^\\circ$ cho cùng $\\sin(2\\alpha)$, nên $\\alpha_2 = 90^\\circ - 25^\\circ = 65^\\circ$.'
        }
      ],
      miniEssay: {
        id: 'p10p-s2-e1',
        question:
          'Một vận động viên đẩy tạ từ độ cao ban đầu $h_0 = 0$ (giả sử sát mặt đất) với tốc độ $v_0 = 14\\text{ m/s}$, góc $\\alpha = 30^\\circ$, $g = 9{,}8\\text{ m/s}^2$. Tính độ cao cực đại $H_{\\max}$ và tầm xa $L$.',
        hint: 'Dùng $\\sin 30^\\circ = 0{,}5$ và $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$.',
        rubricChecklist: [
          'Tính đúng $H_{\\max} = \\frac{14^2 \\cdot 0{,}5^2}{2 \\cdot 9{,}8} = 2{,}5\\text{ m}$.',
          'Tính đúng $L = \\frac{14^2 \\cdot \\sin 60^\\circ}{9{,}8} = 10\\sqrt{3} \\approx 17{,}32\\text{ m}$.'
        ],
        sampleAnswer:
          '• Độ cao cực đại: $H_{\\max} = \\frac{v_0^2 \\sin^2\\alpha}{2g} = \\frac{196 \\cdot 0{,}25}{19{,}6} = 2{,}5\\text{ m}$.\n• Tầm xa: $L = \\frac{v_0^2 \\sin(2\\alpha)}{g} = \\frac{196 \\cdot \\sin 60^\\circ}{9{,}8} = 20 \\cdot \\frac{\\sqrt{3}}{2} = 10\\sqrt{3} \\approx 17{,}32\\text{ m}$.'
      }
    },
    {
      stepTitle: '3. Thực hành Bệ phóng 2D & Mô hình 3D (Ảnh hưởng lực cản)',
      stepType: 'experiment',
      conceptSection:
        'Trong thực tế có lực cản không khí phụ thuộc vận tốc, quỹ đạo không còn là Parabol đối xứng hoàn hảo mà nhánh đi xuống dốc hơn nhánh đi lên, đồng thời cả $H_{\\max}$ và tầm xa $L$ đều giảm đi.',
      formulaSection: {
        primaryFormula: 'L_{\\text{thực tế}} < L_{\\text{lý tưởng}}, \\qquad \\alpha_{\\text{tối ưu (có cản)}} < 45^\\circ',
        variablesNote:
          '• Trong Lab 2D: thử bắn ở $\\alpha = 30^\\circ, 45^\\circ, 60^\\circ$ rồi bấm **Ghi mẫu đo** để lập bảng đối chiếu.\n• Bật **Lực cản không khí** để thấy góc tầm xa lớn nhất dịch chuyển về khoảng $38^\\circ - 42^\\circ$.'
      },
      deepDiveSection:
        'Tại sao khi có lực cản không khí, góc ném cho tầm xa cực đại lại nhỏ hơn $45^\\circ$? Vì bay ở góc thấp hơn giúp giảm thời gian vật chịu tác dụng của lực cản và rút ngắn quãng đường bay trong không khí, giữ được thành phần vận tốc ngang lâu hơn.',
      teacherExplanation:
        'Mở tab 2. Thí Nghiệm 2D, bật Dấu vết quỹ đạo (Trace) và so sánh 2 đường bay khi tắt và bật Lực cản không khí.',
      keyTakeaway:
        'Góc $45^\\circ$ chỉ tối ưu trong chân không trên mặt đất phẳng; ngoài đời thực (có cản và $h_0 > 0$) góc tối ưu nhỏ hơn $45^\\circ$.',
      miniQuiz: [
        {
          id: 'p10p-s3-q1',
          question:
            'Khi bật lực cản không khí trong thí nghiệm ném xiên từ mặt đất, hình dạng quỹ đạo thay đổi thế nào so với Parabol lý tưởng?',
          options: [
            'A. Đối xứng hoàn toàn nhưng cao hơn',
            'B. Bất đối xứng: tầm xa giảm, nhánh rơi xuống dốc hơn nhánh đi lên',
            'C. Biến thành đường tròn',
            'D. Tầm xa không đổi nhưng thời gian bay tăng'
          ],
          correctIndex: 1,
          explanation:
            'Lực cản luôn ngược hướng vận tốc làm tiêu hao cơ năng liên tục, khiến vật đạt đỉnh thấp hơn, tầm xa ngắn hơn và nhánh xuống rơi dốc hơn.'
        },
        {
          id: 'p10p-s3-q2',
          question:
            'Trong phòng thí nghiệm ném ngang từ độ cao $h_0 > 0$, nếu tăng gấp đôi vận tốc ném ngang $v_0$ (không cản), đại lượng nào tăng gấp đôi?',
          options: [
            'A. Thời gian rơi chạm đất $t$',
            'B. Gia tốc trọng trường $g$',
            'C. Tầm bay xa $L = v_0\\sqrt{2h_0/g}$',
            'D. Thành phần vận tốc đứng khi chạm đất $v_y$'
          ],
          correctIndex: 2,
          explanation:
            'Thời gian rơi $t = \\sqrt{2h_0/g}$ không đổi khi tăng $v_0$, nên tầm xa $L = v_0 t$ tỉ lệ thuận với $v_0$ và tăng gấp đôi.'
        }
      ],
      miniEssay: {
        id: 'p10p-s3-e1',
        question:
          'Một khẩu pháo bắn đạn từ trên đồi cao ($h_0 = 25\\text{ m}$) xuống thung lũng. Giải thích vì sao nếu bắn ở góc $\\alpha = 40^\\circ$ có thể đạt tầm xa hơn góc $\\alpha = 45^\\circ$ dù bỏ qua sức cản không khí.',
        hint: 'Xét lợi thế của vận tốc ngang $v_0\\cos\\alpha$ lớn hơn khi thời gian rơi đã được cộng thêm nhờ độ cao $h_0$.',
        rubricChecklist: [
          'Khi $h_0 > 0$, vật có sẵn thời gian rơi thêm từ độ cao $h_0$ nên không cần dành quá nhiều vận tốc cho phương đứng.',
          'Góc thấp hơn $45^\\circ$ (như $40^\\circ$) cho thành phần ngang $v_0\\cos\\alpha$ lớn hơn, giúp tầm xa $L = v_x t_{\\text{bay}}$ lớn hơn.'
        ],
        sampleAnswer:
          'Khi bắn từ độ cao $h_0 > 0$, vật đã có sẵn thời gian rơi bổ sung nhờ độ cao ban đầu. Do đó giảm góc nâng xuống dưới $45^\\circ$ làm tăng vận tốc ngang $v_x = v_0\\cos\\alpha$ nhiều hơn mức giảm tương đối của tổng thời gian bay $t_{\\text{bay}}$, khiến tích $L = v_x \\cdot t_{\\text{bay}}$ đạt cực đại ở góc $\\alpha < 45^\\circ$.'
      }
    }
  ],

  'phys-11-shm': [
    {
      stepTitle: '1. Phương trình Dao động điều hòa, Vận tốc & Gia tốc',
      stepType: 'concept',
      conceptSection:
        'Dao động điều hòa là dao động mà li độ của vật là một hàm côsin (hoặc sin) theo thời gian. Nó tương ứng với hình chiếu của một chất điểm chuyển động tròn đều lên một trục đường kính nằm trong mặt phẳng quỹ đạo.',
      formulaSection: {
        primaryFormula: 'x = A\\cos(\\omega t + \\varphi), \\quad v = -\\omega A\\sin(\\omega t + \\varphi), \\quad a = -\\omega^2 x',
        secondaryFormulas: [
          'T = \\frac{2\\pi}{\\omega} = \\frac{1}{f}, \\qquad v_{\\max} = \\omega A, \\qquad a_{\\max} = \\omega^2 A'
        ],
        variablesNote:
          '• $A > 0$: biên độ (quỹ đạo dài $L = 2A$).\n• $\\omega > 0$ (rad/s): tần số góc; $\\varphi$ (rad): pha ban đầu xác định trạng thái tại $t = 0$.\n• $v$ sớm pha $\\pi/2$ so với $x$; $a$ ngược pha ($\\pi$) với $x$ và luôn hướng về Vị trí cân bằng $O$.'
      },
      deepDiveSection:
        'Quy luật "Biên – Cân bằng" cực kỳ quan trọng:\n• Tại **Vị trí cân bằng ($x = 0$)**: vận tốc đạt độ lớn cực đại $|v| = \\omega A$, còn gia tốc và lực kéo về triệt tiêu ($a = 0$).\n• Tại **Hai biên ($x = \\pm A$)**: vật đổi chiều chuyển động nên vận tốc tức thời $v = 0$, nhưng độ lớn gia tốc đạt cực đại $|a| = \\omega^2 A$ kéo vật quay ngược trở lại.',
      teacherExplanation:
        'Hiểu rõ mối quan hệ pha giữa $x$, $v$, $a$ và giá trị cực đại tại VTCB và hai biên là chìa khóa giải nhanh 80% bài tập Dao động điều hòa.',
      formulaHighlight: 'x = A\\cos(\\omega t + \\varphi), \\quad v = -\\omega A\\sin(\\omega t + \\varphi), \\quad a = -\\omega^2 x',
      keyTakeaway:
        'Gia tốc $a = -\\omega^2 x$ luôn trái dấu với li độ $x$ và luôn hướng về VTCB; $v$ đạt cực đại tại VTCB và bằng $0$ ở biên.',
      miniQuiz: [
        {
          id: 'p11s-s1-q1',
          question:
            'Một vật dao động điều hòa với phương trình $x = 6\\cos(4\\pi t - \\frac{\\pi}{3})\\text{ (cm)}$. Chu kỳ và tốc độ cực đại của vật là:',
          options: [
            'A. $T = 0{,}5\\text{ s};\\; v_{\\max} = 24\\pi\\text{ cm/s}$',
            'B. $T = 2\\text{ s};\\; v_{\\max} = 24\\text{ cm/s}$',
            'C. $T = 0{,}5\\text{ s};\\; v_{\\max} = 6\\pi\\text{ cm/s}$',
            'D. $T = 4\\text{ s};\\; v_{\\max} = 24\\pi\\text{ cm/s}$'
          ],
          correctIndex: 0,
          explanation:
            '$\\omega = 4\\pi \\implies T = \\frac{2\\pi}{4\\pi} = 0{,}5\\text{ s}$ và $v_{\\max} = \\omega A = 4\\pi \\cdot 6 = 24\\pi\\text{ cm/s}$.'
        },
        {
          id: 'p11s-s1-q2',
          question:
            'Khi vật dao động điều hòa đi từ biên dương ($x = +A$) về vị trí cân bằng ($x = 0$), nhận xét nào đúng?',
          options: [
            'A. Tốc độ tăng dần, độ lớn gia tốc tăng dần',
            'B. Tốc độ tăng dần, độ lớn gia tốc giảm dần về $0$',
            'C. Tốc độ giảm dần, gia tốc hướng ra biên dương',
            'D. Cả vận tốc và gia tốc đều có giá trị dương'
          ],
          correctIndex: 1,
          explanation:
            'Từ biên về VTCB vật chuyển động nhanh dần (tốc độ tăng từ $0$ lên $\\omega A$), đồng thời $|x|$ giảm về $0$ nên $|a| = \\omega^2|x|$ giảm về $0$.'
        }
      ],
      miniEssay: {
        id: 'p11s-s1-e1',
        question:
          'Cho vật dao động điều hòa với phương trình $x = 4\\cos(2\\pi t + \\frac{\\pi}{2})\\text{ (cm)}$. Xác định vị trí và chiều chuyển động của vật tại thời điểm ban đầu $t = 0$, và tính gia tốc khi vật ở biên âm.',
        hint: 'Thay $t = 0$ vào $x(t)$ và $v(t) = -\\omega A \\sin(\\omega t + \\varphi)$.',
        rubricChecklist: [
          'Tại $t = 0$: $x(0) = 4\\cos(\\pi/2) = 0\\text{ cm}$ (vị trí cân bằng).',
          'Tính $v(0) = -8\\pi\\sin(\\pi/2) = -8\\pi\\text{ cm/s} < 0$ (đi theo chiều âm).',
          'Tại biên âm $x = -4\\text{ cm}$: $a = -\\omega^2 x = -(2\\pi)^2(-4) = 16\\pi^2 \\approx 157{,}9\\text{ cm/s}^2$.'
        ],
        sampleAnswer:
          '• Tại $t = 0$: $x(0) = 4\\cos(\\frac{\\pi}{2}) = 0\\text{ cm}$, và $v(0) = -2\\pi \\cdot 4 \\sin(\\frac{\\pi}{2}) = -8\\pi\\text{ cm/s} < 0$. Vậy lúc $t = 0$ vật qua VTCB theo chiều âm.\n• Tại biên âm $x = -4\\text{ cm}$: $a = -\\omega^2 x = -(2\\pi)^2(-4) = 16\\pi^2\\text{ cm/s}^2 \\approx 1{,}58\\text{ m/s}^2$.'
      }
    },
    {
      stepTitle: '2. Công thức Độc lập Thời gian, Con lắc Lò xo & Con lắc Đơn',
      stepType: 'derivation',
      conceptSection:
        'Bằng cách khử thời gian $t$ từ hệ phương trình điều hòa, ta thu được các hệ thức liên hệ trực tiếp giữa $x, v, a$ tại cùng một thời điểm bất kỳ (đồ thị pha là đường Elip). Với con lắc lò xo và con lắc đơn, tần số góc $\\omega$ hoàn toàn do cấu tạo cơ hệ quyết định.',
      formulaSection: {
        primaryFormula: 'A^2 = x^2 + \\frac{v^2}{\\omega^2}, \\qquad T_{\\text{lò xo}} = 2\\pi\\sqrt{\\frac{m}{k}}',
        secondaryFormulas: [
          'T_{\\text{đơn}} = 2\\pi\\sqrt{\\frac{l}{g}}, \\qquad W = \\frac{1}{2}kA^2 = \\frac{1}{2}m\\omega^2 A^2'
        ],
        variablesNote:
          '• $k$ (N/m): độ cứng lò xo; $m$ (kg): khối lượng quả nặng.\n• $l$ (m): chiều dài dây treo con lắc đơn.\n• Lưu ý đơn vị cực kỳ hay sai: nếu dùng $\\omega = \\sqrt{k/m}$ ($\\text{rad/s}$) thì $x$ và $v$ phải đồng bộ mét và $\\text{m/s}$, hoặc cm và $\\text{cm/s}$!'
      },
      deepDiveSection:
        'Điểm khác biệt thú vị cần nhớ:\n• **Con lắc lò xo**: chu kỳ $T = 2\\pi\\sqrt{m/k}$ phụ thuộc khối lượng $m$ và độ cứng $k$, **KHÔNG** phụ thuộc gia tốc trọng trường $g$ (đem lên Mặt Trăng vẫn dao động cùng chu kỳ!).\n• **Con lắc đơn (góc nhỏ)**: chu kỳ $T = 2\\pi\\sqrt{l/g}$ phụ thuộc chiều dài $l$ và $g$, **KHÔNG** phụ thuộc khối lượng $m$ (quả nặng $100\\text{ g}$ hay $1\\text{ kg}$ có cùng chu kỳ!).',
      teacherExplanation:
        'Từ $\\cos^2(\\omega t + \\varphi) + \\sin^2(\\omega t + \\varphi) = 1$ ta rút ra công thức độc lập $A^2 = x^2 + v^2/\\omega^2$, một trong những hệ thức dùng nhiều nhất chương Dao động.',
      formulaHighlight: 'A^2 = x^2 + \\frac{v^2}{\\omega^2}, \\qquad T_{\\text{lò xo}} = 2\\pi\\sqrt{\\frac{m}{k}}',
      keyTakeaway:
        'Cơ năng $W = \\frac{1}{2}kA^2$ tỉ lệ với bình phương biên độ $A^2$; động năng và thế năng biến thiên tuần hoàn với chu kỳ $T/2$ ($f\' = 2f$).',
      miniQuiz: [
        {
          id: 'p11s-s2-q1',
          question:
            'Một vật dao động điều hòa với $\\omega = 10\\text{ rad/s}$. Khi ở li độ $x = 3\\text{ cm}$, vật có vận tốc $v = 40\\text{ cm/s}$. Biên độ dao động $A$ bằng:',
          options: ['A. $5\\text{ cm}$', 'B. $7\\text{ cm}$', 'C. $4{,}3\\text{ cm}$', 'D. $25\\text{ cm}$'],
          correctIndex: 0,
          explanation:
            'Áp dụng công thức độc lập: $A = \\sqrt{x^2 + \\frac{v^2}{\\omega^2}} = \\sqrt{3^2 + (40/10)^2} = \\sqrt{9 + 16} = 5\\text{ cm}$.'
        },
        {
          id: 'p11s-s2-q2',
          question:
            'Để chu kỳ của một con lắc lò xo tăng lên gấp đôi, ta phải thay đổi khối lượng vật nặng như thế nào (giữ nguyên độ cứng $k$)?',
          options: ['A. Tăng khối lượng gấp 2 lần', 'B. Tăng khối lượng gấp 4 lần', 'C. Giảm khối lượng 2 lần', 'D. Giảm khối lượng 4 lần'],
          correctIndex: 1,
          explanation:
            'Vì $T = 2\\pi\\sqrt{m/k}$ tỉ lệ với $\\sqrt{m}$, muốn $T$ tăng 2 lần thì $m$ phải tăng $2^2 = 4$ lần.'
        }
      ],
      miniEssay: {
        id: 'p11s-s2-e1',
        question:
          'Một con lắc lò xo có độ cứng $k = 100\\text{ N/m}$ gắn vật $m = 0{,}25\\text{ kg}$ dao động điều hòa với biên độ $A = 4\\text{ cm}$. Tính tần số góc $\\omega$, chu kỳ $T$ và cơ năng toàn phần $W$.',
        hint: 'Đổi $A = 0{,}04\\text{ m}$ trước khi tính cơ năng $W = \\frac{1}{2}kA^2$ ra Jun!',
        rubricChecklist: [
          'Tính đúng $\\omega = \\sqrt{100 / 0{,}25} = 20\\text{ rad/s}$ và $T = \\frac{2\\pi}{20} = \\frac{\\pi}{10} \\approx 0{,}314\\text{ s}$.',
          'Đổi đúng $A = 0{,}04\\text{ m}$.',
          'Tính đúng cơ năng $W = \\frac{1}{2} \\cdot 100 \\cdot (0{,}04)^2 = 0{,}08\\text{ J}$.'
        ],
        sampleAnswer:
          '• Tần số góc: $\\omega = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{100}{0{,}25}} = 20\\text{ rad/s}$.\n• Chu kỳ: $T = \\frac{2\\pi}{\\omega} = \\frac{2\\pi}{20} = 0{,}1\\pi \\approx 0{,}314\\text{ s}$.\n• Đổi $A = 4\\text{ cm} = 0{,}04\\text{ m}$. Cơ năng: $W = \\frac{1}{2}kA^2 = 0{,}5 \\cdot 100 \\cdot 0{,}04^2 = 0{,}08\\text{ J}$.'
      }
    },
    {
      stepTitle: '3. Thực hành Đo Chu kỳ với Đồng hồ Bấm giây & Tắt dần 2D',
      stepType: 'experiment',
      conceptSection:
        'Trong thí nghiệm đo chu kỳ dao động nhanh, bấm giờ 1 chu kỳ đơn lẻ thường gây sai số phản xạ lớn. Phương pháp chuẩn là đo tổng thời gian $\\Delta t$ của $N$ dao động liên tiếp (ví dụ $N = 5$ hoặc $10$) rồi lấy $T = \\Delta t / N$.',
      formulaSection: {
        primaryFormula: 'T_{\\text{đo}} = \\frac{\\Delta t_{N\\text{ chu kỳ}}}{N}, \\qquad A(t) = A_0 e^{-\\beta t} \\text{ (tắt dần)}',
        variablesNote:
          '• Chọn mốc đếm khi vật đi qua biên hoặc VTCB theo cùng một chiều.\n• Trong tab 2D: bật **Đồ thị thời gian thực** và **Tắt dần** để thấy biên độ suy giảm theo hàm mũ.'
      },
      deepDiveSection:
        'Khi có lực ma sát hay lực cản môi trường, dao động trở thành **dao động tắt dần**: biên độ và cơ năng giảm dần theo thời gian (cơ năng chuyển thành nhiệt). Để duy trì biên độ ổn định như ở đồng hồ quả lắc, ta phải cung cấp đúng phần năng lượng hao hụt sau mỗi chu kỳ (dao động duy trì).',
      teacherExplanation:
        'Chuyển sang tab 2. Thí Nghiệm 2D để dùng đồng hồ bấm giây đo 5 chu kỳ và kiểm chứng công thức $T = 2\\pi\\sqrt{m/k}$.',
      keyTakeaway:
        'Đo nhiều chu kỳ liên tiếp giúp giảm sai số tuyệt đối của phản xạ tay xuống $N$ lần.',
      miniQuiz: [
        {
          id: 'p11s-s3-q1',
          question:
            'Một học sinh dùng đồng hồ bấm giây đo thời gian con lắc thực hiện $10$ dao động toàn phần hết $12{,}5\\text{ s}$. Chu kỳ dao động đo được là:',
          options: ['A. $125\\text{ s}$', 'B. $1{,}25\\text{ s}$', 'C. $0{,}8\\text{ s}$', 'D. $2{,}5\\text{ s}$'],
          correctIndex: 1,
          explanation:
            '$T = \\frac{\\Delta t}{N} = \\frac{12{,}5}{10} = 1{,}25\\text{ s}$.'
        },
        {
          id: 'p11s-s3-q2',
          question:
            'Trong dao động tắt dần của con lắc lò xo có ma sát, đại lượng nào sau đây giảm dần theo thời gian?',
          options: [
            'A. Khối lượng và độ cứng lò xo',
            'B. Biên độ dao động và cơ năng toàn phần',
            'C. Gia tốc trọng trường',
            'D. Tần số góc tự nhiên'
          ],
          correctIndex: 1,
          explanation:
            'Lực ma sát sinh công âm làm tiêu hao cơ năng, do đó cả cơ năng và biên độ dao động đều giảm dần theo thời gian.'
        }
      ],
      miniEssay: {
        id: 'p11s-s3-e1',
        question:
          'Nếu sai số phản xạ tay mỗi lần bấm đồng hồ là $\\pm 0{,}2\\text{ s}$, hãy tính sai số của chu kỳ $T$ khi em đo $1$ chu kỳ so với khi đo $10$ chu kỳ liên tiếp rồi chia cho $10$.',
        hint: 'Tổng sai số bấm bắt đầu và kết thúc là $0{,}2\\text{ s}$, chia đều cho $N$ chu kỳ.',
        rubricChecklist: [
          'Đo 1 chu kỳ: sai số $\\Delta T_1 = 0{,}2\\text{ s}$.',
          'Đo 10 chu kỳ: sai số $\\Delta T_{10} = \\frac{0{,}2}{10} = 0{,}02\\text{ s}$ (giảm 10 lần).'
        ],
        sampleAnswer:
          'Nếu chỉ đo 1 chu kỳ, sai số phép đo chu kỳ chính bằng sai số phản xạ $\\Delta T = 0{,}2\\text{ s}$ (rất lớn nếu $T \\approx 0{,}6\\text{ s}$).\nKhi đo $10$ chu kỳ liên tiếp rồi chia cho $10$, sai số bị chia nhỏ $10$ lần còn $\\Delta T = \\frac{0{,}2}{10} = 0{,}02\\text{ s}$, tăng độ chính xác vượt trội.'
      }
    }
  ]
};
