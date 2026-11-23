import { LectureStep } from '../types';

export const PHYSICS_CUSTOM_LECTURE_STEPS_PRO: Record<string, LectureStep[]> = {
  'phys-pro-1': [
    {
      stepTitle: '1. Lực Quán tính trong Hệ quy chiếu Phi quán tính',
      stepType: 'concept',
      conceptSection:
        'Khi gắn hệ quy chiếu vào một vật đang chuyển động có gia tốc $\\vec{a}_0$ (như thang máy tăng tốc, toa xe phanh, cái nêm trượt tự do), Định luật II Newton không còn giữ nguyên dạng $\\sum\\vec{F} = m\\vec{a}\'$ trừ khi bổ sung thêm **lực quán tính** giả định.',
      formulaSection: {
        primaryFormula: '\\vec{F}_{qt} = -m\\vec{a}_0, \\qquad \\sum\\vec{F}_{\\text{thật}} + \\vec{F}_{qt} = m\\vec{a}\'',
        secondaryFormulas: [
          '\\vec{F}_{qt\\text{ li tâm}} = m\\omega^2\\vec{r} \\quad (\\text{HQC quay đều})'
        ],
        variablesNote:
          '• $\\vec{a}_0$: gia tốc của hệ quy chiếu phi quán tính so với mặt đất; $\\vec{a}\'$: gia tốc tương đối của vật đối với hệ quy chiếu đó.\n• Lực quán tính **luôn hướng ngược chiều** với gia tốc $\\vec{a}_0$ của hệ quy chiếu, và **KHÔNG có phản lực** (vi phạm Định luật III nếu xem nó là lực tương tác thật).'
      },
      deepDiveSection:
        'Trong thang máy chuyển động thẳng đứng với gia tốc $a_0$, trọng lực biểu kiến mà lực kế/cân bàn đo được là $P_{\\text{bk}} = m(g \\pm a_0)$. Khi thang máy rơi tự do ($a_0 = g$ hướng xuống), $\\vec{F}_{qt}$ triệt tiêu hoàn toàn $\\vec{P}$, tạo trạng thái **không trọng lượng** ($N = 0$).',
      teacherExplanation:
        'Chọn HQC gắn với chiếc nêm di động hay toa xe, thêm lực quán tính $-m\\vec{a}_0$ rồi giải cân bằng/động lực học như bài toán bình thường!',
      keyTakeaway: 'Vào hệ quy chiếu có gia tốc $\\vec{a}_0$, chỉ cần cộng thêm lực quán tính $\\vec{F}_{qt} = -m\\vec{a}_0$.',
      miniQuiz: [
        {
          id: 'ppro1-s1-q1',
          question: 'Con lắc đơn treo trần một toa tàu chạy ngang nhanh dần đều với gia tốc $a_0$. Khi dây treo đứng yên tương đối trong toa tàu, dây lệch khỏi phương thẳng đứng góc $\\alpha$ thỏa:',
          options: ['A. $\\sin\\alpha = a_0/g$', 'B. $\\tan\\alpha = a_0/g$', 'C. $\\tan\\alpha = g/a_0$', 'D. $\\cos\\alpha = a_0/g$'],
          correctIndex: 1,
          explanation: 'Con lắc chịu $\\vec{P}$ hướng xuống và $\\vec{F}_{qt} = m\\vec{a}_0$ hướng về đuôi xe $\\implies \\tan\\alpha = \\frac{F_{qt}}{P} = \\frac{a_0}{g}$.'
        },
        {
          id: 'ppro1-s1-q2',
          question: 'Thang máy đang đi lên và **hãm phanh chậm dần đều** với gia tốc có độ lớn $2\\text{ m/s}^2$ ($g = 10\\text{ m/s}^2$). Người $60\\text{ kg}$ đứng trên cân sàn trong thang máy, số chỉ cân tương đương trọng lượng:',
          options: ['A. $720\\text{ N}$', 'B. $480\\text{ N}$', 'C. $600\\text{ N}$', 'D. $120\\text{ N}$'],
          correctIndex: 1,
          explanation: 'Đi lên chậm dần $\\implies \\vec{a}_0$ hướng xuống $\\implies \\vec{F}_{qt}$ hướng lên $\\implies N = m(g - a_0) = 60(10 - 2) = 480\\text{ N}$.'
        }
      ],
      miniEssay: {
        id: 'ppro1-s1-e1',
        question: 'Xét xe ô tô chạy ngang với gia tốc $a_0 = 2{,}5\\text{ m/s}^2$ ($g = 10\\text{ m/s}^2$). Trên trần xe treo con lắc đơn nặng $0{,}4\\text{ kg}$. Tính lực căng dây treo khi con lắc ở vị trí cân bằng tương đối trong xe.',
        hint: 'Trọng lực hiệu dụng $\\vec{P}\' = \\vec{P} + \\vec{F}_{qt}$ có độ lớn $m\\sqrt{g^2 + a_0^2}$.',
        rubricChecklist: [
          'Tính $g_{\\text{bk}} = \\sqrt{g^2 + a_0^2} = \\sqrt{10^2 + 2{,}5^2} = \\sqrt{106{,}25} \\approx 10{,}31\\text{ m/s}^2$.',
          'Tính lực căng dây $T = m g_{\\text{bk}} \\approx 0{,}4 \\cdot 10{,}31 = 4{,}12\\text{ N}$.'
        ],
        sampleAnswer: 'Trong hệ quy chiếu gắn với xe, vật chịu trọng lực $\\vec{P}$ thẳng đứng ($4\\text{ N}$) và lực quán tính $\\vec{F}_{qt}$ nằm ngang ngược chiều gia tốc ($F_{qt} = ma_0 = 0{,}4\\cdot 2{,}5 = 1\\text{ N}$). Khi cân bằng tương đối, lực căng dây cân bằng với hợp lực của hai lực vuông góc này: $T = \\sqrt{P^2 + F_{qt}^2} = \\sqrt{4^2 + 1^2} = \\sqrt{17} \\approx 4{,}12\\text{ N}$.'
      }
    },
    {
      stepTitle: '2. Bài toán Mặt phẳng nghiêng Di động (Vật trên Nêm trượt)',
      stepType: 'derivation',
      conceptSection:
        'Một vật khối lượng $m$ trượt không ma sát trên mặt nêm khối lượng $M$ nghiêng góc $\\alpha$, bản thân nêm lại đặt trên sàn ngang nhẵn nên bị đẩy giật lùi với gia tốc $a_0$.',
      formulaSection: {
        primaryFormula: 'M a_0 = N\\sin\\alpha, \\qquad N = m(g\\cos\\alpha - a_0\\sin\\alpha)',
        secondaryFormulas: [
          'a_0 = \\frac{mg\\sin\\alpha\\cos\\alpha}{M + m\\sin^2\\alpha}',
          '\\text{Giữ vật đứng yên trên nêm: } a_{\\text{nêm}} = g\\tan\\alpha'
        ],
        variablesNote:
          '• Áp lực $N$ vật nén lên nêm di động **NHỎ HƠN** áp lực trên nêm cố định ($m g\\cos\\alpha$) một lượng $m a_0\\sin\\alpha$ do nêm lùi ra!\n• Để nêm đẩy vật đứng yên tương đối trên mặt nghiêng nhẵn, cần gia tốc ngang $a_0 = g\\tan\\alpha$ hướng về phía nêm cao.'
      },
      deepDiveSection:
        'Dấu hiệu kiểm chứng công thức chuyên cực hay: Nếu giữ cố định nêm ($M \\to \\infty$), mẫu số tiến ra vô cùng $\\implies a_0 \\to 0$ và $N \\to mg\\cos\\alpha$. Nếu nêm cực nhẹ ($M \\to 0$), vật rơi gần như thẳng đứng xuống sàn!',
      teacherExplanation:
        'Viết phương trình $m$ trong HQC nêm (thêm $-m\\vec{a}_0$) kết hợp phương trình ngang cho nêm $M$ sẽ tránh được sai lầm nhầm lẫn thành phần gia tốc.',
      keyTakeaway: 'Nêm chuyển động ngang: vật đứng yên trên mặt nghiêng nhẵn khi $a_{\\text{nêm}} = g\\tan\\alpha$.',
      miniQuiz: [
        {
          id: 'ppro1-s2-q1',
          question: 'Cần truyền cho một cái nêm nghiêng góc $\\alpha = 30^\\circ$ (không ma sát, $g = 10\\text{ m/s}^2$) gia tốc ngang hướng về phía đỉnh dốc bằng bao nhiêu để vật nhỏ $m$ đặt trên dốc đứng yên tương đối so với nêm?',
          options: ['A. $5\\text{ m/s}^2$', 'B. $10/\\sqrt{3}\\text{ m/s}^2$', 'C. $10\\sqrt{3}\\text{ m/s}^2$', 'D. $5\\sqrt{3}\\text{ m/s}^2$'],
          correctIndex: 1,
          explanation: 'Để $F_{qt}\\cos\\alpha = P\\sin\\alpha \\implies a_0 = g\\tan 30^\\circ = \\frac{10}{\\sqrt{3}}\\text{ m/s}^2$.'
        },
        {
          id: 'ppro1-s2-q2',
          question: 'Khi thả vật $m$ trượt tự do trên chiếc nêm $M$ đặt trên sàn ngang nhẵn, đại lượng nào của hệ (vật + nêm) được bảo toàn trong suốt quá trình trượt?',
          options: [
            'A. Động lượng toàn phần theo phương thẳng đứng',
            'B. Động lượng toàn phần theo phương nằm ngang',
            'C. Vận tốc của riêng vật $m$',
            'D. Áp lực của nêm lên sàn'
          ],
          correctIndex: 1,
          explanation: 'Do sàn nhẵn không ma sát, tổng ngoại lực theo phương ngang bằng $0$ nên động lượng phương ngang $p_x$ bảo toàn ($mv_x + MV = 0$).'
        }
      ],
      miniEssay: {
        id: 'ppro1-s2-e1',
        question: 'Thả vật $m = 1\\text{ kg}$ từ đỉnh nêm nhẵn $M = 2\\text{ kg}$ cao $h = 0{,}6\\text{ m}$, góc nghiêng $\\alpha = 30^\\circ$, đặt trên sàn ngang nhẵn ($g = 10\\text{ m/s}^2$). Tính tốc độ nêm khi vật trượt tới chân nêm.',
        hint: 'Áp dụng bảo toàn động lượng phương ngang + bảo toàn cơ năng, hoặc tính gia tốc $a_0$ và $a_{\\text{trượt}}$ rồi tìm vận tốc.',
        rubricChecklist: [
          'Dùng bảo toàn cơ năng $\\frac{1}{2}MV^2 + \\frac{1}{2}m(v_x^2 + v_y^2) = mgh$ và $mv_x = MV$, kèm điều kiện trượt dọc nêm $\\tan 30^\\circ = \\frac{v_y}{v_x + V}$.',
          'Hoặc tính $a_0 = \\frac{1\\cdot 10\\cdot 0{,}5\\cdot \\frac{\\sqrt{3}}{2}}{2 + 1\\cdot 0{,}25} = \\frac{10\\sqrt{3}}{9}\\text{ m/s}^2$, gia tốc tương đối trên nêm $a\' = 6{,}67\\text{ m/s}^2$, quãng đường nêm trượt $1{,}2\\text{ m} \\implies V = 1\\text{ m/s}$.'
        ],
        sampleAnswer: 'Trong HQC gắn nêm, chiếu vuông góc mặt nghiêng: $N = m(g\\cos 30^\\circ - a_0\\sin 30^\\circ)$, còn phương ngang nêm có $M a_0 = N\\sin 30^\\circ \\Rightarrow a_0 = \\frac{mg\\sin\\alpha\\cos\\alpha}{M + m\\sin^2\\alpha} = \\frac{1\\cdot 10\\cdot 0{,}5\\cdot \\frac{\\sqrt{3}}{2}}{2 + 0{,}25} = \\frac{10\\sqrt{3}}{9}\\text{ m/s}^2$. Gia tốc trượt dọc dốc là $a\' = g\\sin 30^\\circ + a_0\\cos 30^\\circ = 5 + \\frac{15}{9} = \\frac{20}{3}\\text{ m/s}^2$. Chiều dài dốc $l = h/\\sin 30^\\circ = 1{,}2\\text{ m} \\Rightarrow t = \\sqrt{2l/a\'} = 0{,}6\\text{ s}$. Vận tốc nêm lúc cuối dốc là $V = a_0 t = \\frac{2\\sqrt{3}}{3} \\approx 1{,}15\\text{ m/s}$.'
      }
    },
    {
      stepTitle: '3. Điều kiện Tách rời & Chuyển động trong HQC Quay',
      stepType: 'example',
      conceptSection:
        'Các bài toán chuyên nâng cao thường khảo sát vật trượt trên mặt cong (nửa hình cầu) để tìm góc vật **rời khỏi bề mặt** ($N = 0$), hoặc vật đặt trên đĩa quay đều để tìm giới hạn tốc độ góc $\\omega_{\\max}$ trước khi bị lực quán tính li tâm văng ra.',
      formulaSection: {
        primaryFormula: '\\text{Điều kiện tách khỏi mặt tựa: } N = 0',
        secondaryFormulas: [
          '\\text{Trượt từ đỉnh bán cầu nhẵn: } \\cos\\theta_{\\text{rời}} = \\frac{2}{3} \\quad (\\theta \\approx 48{,}2^\\circ)',
          '\\text{Đĩa quay: } m\\omega^2 r \\le \\mu m g \\implies \\omega_{\\max} = \\sqrt{\\frac{\\mu g}{r}}'
        ],
        variablesNote:
          '• Tại thời điểm vật vừa rời khỏi bề mặt tựa, áp lực $N$ giảm về đúng $0$ (chú ý chưa rời trước đó nếu $N > 0$).\n• Trong hệ quy chiếu quay đều với tốc độ $\\omega$, lực quán tính li tâm hướng dọc bán kính **ra xa tâm** quay.'
      },
      deepDiveSection:
        'Kết quả đẹp nổi tiếng $\\cos\\theta = 2/3$ khi thả không vận tốc đầu một vật nhỏ trượt từ đỉnh bán cầu nhẵn bán kính $R$: kết quả này **độc lập hoàn toàn với bán kính $R$, khối lượng $m$ và gia tốc trọng trường $g$**! Tức là dù thả trên Mặt Trăng hay Trái Đất, vật luôn rời bán cầu ở cùng độ cao $h = 2R/3$ tính từ tâm.',
      teacherExplanation:
        'Khi gặp bài toán rời mặt cong: viết song song 2 phương trình là Bảo toàn cơ năng và Phương trình hướng tâm $mg\\cos\\theta - N = mv^2/R$, rồi đặt $N = 0$.',
      keyTakeaway: 'Rời mặt tựa $\\iff N = 0$; thả trượt từ đỉnh bán cầu nhẵn luôn tách ra tại $\\cos\\theta = 2/3$.',
      miniQuiz: [
        {
          id: 'ppro1-s3-q1',
          question: 'Thả không vận tốc đầu một chất điểm từ đỉnh một bán cầu nhẵn bán kính $R = 3\\text{ m}$. Chất điểm bắt đầu rời khỏi mặt cầu ở độ cao cách mặt phẳng đáy của bán cầu một đoạn là:',
          options: ['A. $1{,}5\\text{ m}$', 'B. $2{,}0\\text{ m}$', 'C. $1{,}0\\text{ m}$', 'D. $2{,}5\\text{ m}$'],
          correctIndex: 1,
          explanation: 'Vì $\\cos\\theta = 2/3$ nên độ cao so với mặt đáy (tâm cầu) là $h = R\\cos\\theta = 3\\cdot \\frac{2}{3} = 2{,}0\\text{ m}$.'
        },
        {
          id: 'ppro1-s3-q2',
          question: 'Một đồng xu đặt trên đĩa quay nằm ngang cách tâm $r = 0{,}2\\text{ m}$, hệ số ma sát nghỉ $\\mu = 0{,}5$ ($g = 10\\text{ m/s}^2$). Tốc độ góc lớn nhất để xu không văng ra là:',
          options: ['A. $2{,}5\\text{ rad/s}$', 'B. $5\\text{ rad/s}$', 'C. $10\\text{ rad/s}$', 'D. $25\\text{ rad/s}$'],
          correctIndex: 1,
          explanation: '$\\omega_{\\max} = \\sqrt{\\frac{\\mu g}{r}} = \\sqrt{\\frac{0{,}5\\cdot 10}{0{,}2}} = \\sqrt{25} = 5\\text{ rad/s}$.'
        }
      ],
      miniEssay: {
        id: 'ppro1-s3-e1',
        question: 'Chứng minh công thức góc tách $\\cos\\theta = 2/3$ khi một vật nhỏ trượt không ma sát từ đỉnh một bán cầu cố định bán kính $R$ với vận tốc ban đầu $v_0 = 0$.',
        hint: 'Áp dụng bảo toàn cơ năng tại góc lệch $\\theta$ và phương trình hướng tâm với $N = 0$.',
        rubricChecklist: [
          'Bảo toàn cơ năng: $\\frac{1}{2}mv^2 = mgR(1 - \\cos\\theta) \\implies v^2 = 2gR(1 - \\cos\\theta)$.',
          'Phương trình hướng tâm lúc rời ($N = 0$): $mg\\cos\\theta = \\frac{mv^2}{R} = 2mg(1 - \\cos\\theta) \\implies 3\\cos\\theta = 2 \\implies \\cos\\theta = 2/3$.'
        ],
        sampleAnswer: 'Khi vật ở góc lệch $\\theta$ so với phương thẳng đứng, độ cao vật hạ xuống là $h = R(1 - \\cos\\theta)$. Bảo toàn cơ năng cho $\\frac{1}{2}mv^2 = mgR(1 - \\cos\\theta) \\Rightarrow \\frac{mv^2}{R} = 2mg(1 - \\cos\\theta)$. Chiếu Định luật II Newton theo phương hướng tâm: $mg\\cos\\theta - N = \\frac{mv^2}{R}$. Tại điểm vừa rời mặt cầu, $N = 0 \\Rightarrow mg\\cos\\theta = 2mg(1 - \\cos\\theta) \\Rightarrow 3\\cos\\theta = 2 \\Rightarrow \\cos\\theta = \\frac{2}{3}$.'
      }
    }
  ],
  'phys-pro-2': [
    {
      stepTitle: '1. Hệ Phương trình Liên kết Dây & Ròng rọc Động',
      stepType: 'concept',
      conceptSection:
        'Trong cơ hệ có nhiều vật nối với nhau qua dây không dãn và ròng rọc động, độ dịch chuyển và gia tốc của các vật không bằng nhau mà ràng buộc nhau qua **phương trình liên kết hình học của chiều dài dây**.',
      formulaSection: {
        primaryFormula: 'L_{\\text{dây}} = \\text{const} \\implies \\sum \\Delta x_i = 0 \\implies a_{\\text{đầu dây}} = 2 a_{\\text{trục ròng rọc động}}',
        secondaryFormulas: [
          'T_{\\text{hai nhánh dây cùng ròng rọc nhẹ}} \\text{ bằng nhau: } T_1 = T_2 = T',
          '\\text{Lực trên trục ròng rọc động nhẹ: } T_{\\text{trục}} = 2T'
        ],
        variablesNote:
          '• **Phương pháp vi phân chiều dài dây cực chuẩn**: viết tổng độ dài sợi dây theo tọa độ các vật ($L = x_A + 2x_B + \\text{const}$), rồi lấy đạo hàm hai lần theo thời gian sẽ tự động ra ngay liên hệ gia tốc $a_A + 2a_B = 0$ (chính xác tuyệt đối mọi hệ phức tạp!).'
      },
      deepDiveSection:
        'Nhiều học sinh chuyên hay nhầm gia tốc khi nối ròng rọc động vừa có thể di chuyển vừa kéo vật: chỉ cần nhớ quy tắc "dây kéo qua 1 ròng rọc động di chuyển $x$, tổng hai đoạn dây hai bên ròng rọc thu ngắn $2x$".',
      teacherExplanation:
        'Với ròng rọc nhẹ không ma sát, lực căng trên cùng một sợi dây liên tục luôn bằng nhau tại mọi điểm; trục ròng rọc động chịu lực căng $2T$.',
      keyTakeaway: 'Viết phương trình tổng chiều dài dây $L = \\text{const}$ rồi đạo hàm bậc 2 sẽ cho ngay quan hệ gia tốc.',
      miniQuiz: [
        {
          id: 'ppro2-s1-q1',
          question: 'Vật A kéo qua ròng rọc cố định và vòng qua 1 ròng rọc động nhẹ treo vật B (đầu dây kia buộc cố định vào trần). Nếu vật A đi xuống một đoạn $4\\text{ cm}$ thì vật B đi lên đoạn:',
          options: ['A. $8\\text{ cm}$', 'B. $4\\text{ cm}$', 'C. $2\\text{ cm}$', 'D. $1\\text{ cm}$'],
          correctIndex: 2,
          explanation: 'Ròng rọc động có 1 đầu buộc cố định $\\implies x_A = 2 x_B \\implies x_B = 4/2 = 2\\text{ cm}$.'
        },
        {
          id: 'ppro2-s1-q2',
          question: 'Trong hệ ở câu trên, nếu lực căng của sợi dây vắt qua ròng rọc là $T$ thì lực căng dây treo vật B vào trục ròng rọc động nhẹ bằng:',
          options: ['A. $T/2$', 'B. $T$', 'C. $2T$', 'D. $4T$'],
          correctIndex: 2,
          explanation: 'Vì ròng rọc nhẹ ($m_{rr} = 0$), cân bằng lực trên ròng rọc cho $T_B = 2T$.'
        }
      ],
      miniEssay: {
        id: 'ppro2-s1-e1',
        question: 'Cho hệ gồm vật $m_1 = 2\\text{ kg}$ đặt trên bàn ngang nhẵn nối dây vắt qua ròng rọc cố định mép bàn, rồi vòng xuống đỡ ròng rọc động nhẹ treo vật $m_2 = 2\\text{ kg}$ (đầu dây còn lại buộc cố định lên trần, $g = 10\\text{ m/s}^2$). Tính gia tốc của $m_1$ và $m_2$.',
        hint: 'Liên kết dây $a_1 = 2 a_2$. Viết $T = m_1 a_1$ và $m_2 g - 2T = m_2 a_2$.',
        rubricChecklist: [
          'Viết đúng liên kết $a_1 = 2a_2$ và lực căng trục $2T$.',
          'Giải hệ $T = 2 a_1 = 4 a_2$ và $20 - 2T = 2 a_2 \\implies 20 - 8a_2 = 2a_2 \\implies a_2 = 2\\text{ m/s}^2,\\ a_1 = 4\\text{ m/s}^2$.'
        ],
        sampleAnswer: 'Từ phương trình chiều dài dây, khi $m_2$ đi xuống đoạn $y$ thì 2 nhánh dây hai bên ròng rọc động đều dài thêm $y$, nên $m_1$ tiến sang phải đoạn $x = 2y \\Rightarrow a_1 = 2a_2$. Phương trình động lực học: với $m_1$ là $T = m_1 a_1 = 2(2a_2) = 4a_2$; với $m_2$ là $m_2 g - 2T = m_2 a_2 \\Rightarrow 20 - 8a_2 = 2a_2 \\Rightarrow a_2 = 2\\text{ m/s}^2$, suy ra $a_1 = 4\\text{ m/s}^2$.'
      }
    },
    {
      stepTitle: '2. Va chạm Đàn hồi Xuyên tâm & Không xuyên tâm',
      stepType: 'derivation',
      conceptSection:
        'Trong va chạm đàn hồi tuyệt đối, động lượng và tổng động năng được bảo toàn. Giải trực tiếp hệ bậc nhất và bậc hai rất dài — phương pháp chuyên sử dụng **tốc độ tương đối** hoặc **hệ quy chiếu khối tâm** rút gọn còn 2 dòng.',
      formulaSection: {
        primaryFormula: 'v_1\' = \\frac{(m_1 - m_2)v_1 + 2m_2 v_2}{m_1 + m_2}, \\qquad v_2\' = \\frac{(m_2 - m_1)v_2 + 2m_1 v_1}{m_1 + m_2}',
        secondaryFormulas: [
          'v_1 - v_2 = -(v_1\' - v_2\') \\quad (\\text{đảo dấu vận tốc tương đối})',
          '\\text{Hệ số hồi phục } e = \\frac{|v_2\' - v_1\'|}{|v_1 - v_2|} \\in [0; 1]'
        ],
        variablesNote:
          '• **Hệ quả đặc biệt khi $m_2$ đứng yên ($v_2 = 0$)**:\n  – Nếu $m_1 \\ll m_2$ (bóng va tường): $v_1\' \\approx -v_1$.\n  – Nếu $m_1 = m_2$: $v_1\' = 0, v_2\' = v_1$ (đổi vận tốc).\n  – Nếu hai bi cùng khối lượng va chạm **không xuyên tâm** (lệch tâm) trong mặt phẳng nhẵn, hai vectơ vận tốc sau va chạm luôn hợp nhau góc **$90^\\circ$**!'
      },
      deepDiveSection:
        'Hệ số hồi phục $e$ là vũ khí giải mọi va chạm thực tế ($0 \\le e \\le 1$): $e = 1$ là va chạm đàn hồi hoàn toàn, $e = 0$ là va chạm mềm hoàn toàn. Độ giảm động năng trong va chạm bất kỳ có dạng cực gọn $\\Delta K = \\frac{1}{2}\\mu (v_1 - v_2)^2 (1 - e^2)$, với khối lượng rút gọn $\\mu = \\frac{m_1 m_2}{m_1 + m_2}$.',
      teacherExplanation:
        'Luôn dùng cặp phương trình bậc nhất: (1) $m_1 v_1 + m_2 v_2 = m_1 v_1\' + m_2 v_2\'$ và (2) $v_1 + v_1\' = v_2 + v_2\'$ để không bao giờ phải khai triển bình phương!',
      keyTakeaway: 'Va chạm đàn hồi xuyên tâm luôn thỏa $v_1 + v_1\' = v_2 + v_2\'$; va chạm lệch tâm cùng khối lượng thì $\\vec{v}_1\' \\perp \\vec{v}_2\'$.',
      miniQuiz: [
        {
          id: 'ppro2-s2-q1',
          question: 'Quả cầu $m_1 = 1\\text{ kg}$ chạy tốc độ $6\\text{ m/s}$ va chạm đàn hồi xuyên tâm với quả cầu $m_2 = 2\\text{ kg}$ đang đứng yên. Vận tốc của $m_1$ và $m_2$ ngay sau va chạm là:',
          options: [
            'A. $v_1\' = -2\\text{ m/s};\\ v_2\' = 4\\text{ m/s}$',
            'B. $v_1\' = 2\\text{ m/s};\\ v_2\' = 2\\text{ m/s}$',
            'C. $v_1\' = 0;\\ v_2\' = 3\\text{ m/s}$',
            'D. $v_1\' = -4\\text{ m/s};\\ v_2\' = 5\\text{ m/s}$'
          ],
          correctIndex: 0,
          explanation: '$v_1\' = \\frac{1 - 2}{1 + 2}\\cdot 6 = -2\\text{ m/s}$ (bật ngược); $v_2\' = \\frac{2\\cdot 1\\cdot 6}{3} = 4\\text{ m/s}$.'
        },
        {
          id: 'ppro2-s2-q2',
          question: 'Quả cầu A chuyển động trên bàn bi-a nhẵn đến va chạm đàn hồi KHÔNG xuyên tâm vào quả cầu B giống hệt nó đang đứng yên. Góc hợp bởi hướng bay của A và B sau va chạm bằng:',
          options: ['A. $60^\\circ$', 'B. $45^\\circ$', 'C. $90^\\circ$', 'D. $120^\\circ$'],
          correctIndex: 2,
          explanation: 'Vì $m_A = m_B$, từ $\\vec{v}_A = \\vec{v}_A\' + \\vec{v}_B\'$ và $v_A^2 = v_A\'^2 + v_B\'^2$ suy ra tích vô hướng $\\vec{v}_A\'\\cdot\\vec{v}_B\' = 0$ (vuông góc $90^\\circ$).'
        }
      ],
      miniEssay: {
        id: 'ppro2-s2-e1',
        question: 'Trong lò phản ứng hạt nhân, người ta dùng nước nặng chứa hạt nhân Đơteri ($m_D \\approx 2\\text{ u}$) hay than chì ($m_C = 12\\text{ u}$) để làm chậm nơtron ($m_n = 1\\text{ u}$). Hỏi qua 1 lần va chạm đàn hồi trực diện với hạt nào đang đứng yên thì nơtron mất nhiều động năng hơn?',
        hint: 'Tính tỉ lệ động năng nơtron truyền cho bia $\\frac{\\Delta K}{K_0} = \\frac{4 m_1 m_2}{(m_1 + m_2)^2}$ cho hai trường hợp $m_2 = 2$ và $m_2 = 12$.',
        rubricChecklist: [
          'Viết biểu thức phần động năng truyền sang hạt bia $\\eta = \\frac{4m_1 m_2}{(m_1+m_2)^2}$.',
          'Với Đơteri ($m_2 = 2$): $\\eta = \\frac{8}{9} \\approx 88{,}9\\%$; với Cacbon ($m_2 = 12$): $\\eta = \\frac{48}{169} \\approx 28{,}4\\% \\implies$ Đơteri hãm nơtron hiệu quả hơn nhiều.'
        ],
        sampleAnswer: 'Khi hạt $m_1$ va chạm đàn hồi trực diện với bia $m_2$ đứng yên, vận tốc bia đạt $v_2\' = \\frac{2m_1}{m_1 + m_2}v_1$, nên phần trăm động năng mà nơtron truyền cho bia (tức phần bị mất đi) là $\\eta = \\frac{\\frac{1}{2}m_2 v_2\'^2}{\\frac{1}{2}m_1 v_1^2} = \\frac{4 m_1 m_2}{(m_1 + m_2)^2}$. Với Đơteri ($m_2 = 2\\text{ u}$): $\\eta = \\frac{4\\cdot 1\\cdot 2}{(1+2)^2} = \\frac{8}{9} \\approx 88{,}9\\%$. Với Cacbon ($m_2 = 12\\text{ u}$): $\\eta = \\frac{48}{169} \\approx 28{,}4\\%$. Vì khối lượng Đơteri gần nơtron hơn nên làm chậm nơtron hiệu quả gấp 3 lần.'
      }
    },
    {
      stepTitle: '3. Khối tâm Hệ vật & Chuyển động Trong hệ quy chiếu Khối tâm',
      stepType: 'example',
      conceptSection:
        'Khối tâm $G$ của một hệ nhiều chất điểm chuyển động giống hệt một chất điểm có tổng khối lượng $M = \\sum m_i$ chịu tác dụng tổng hợp tất cả ngoại lực — hoàn toàn **bỏ qua các nội lực** tương tác giữa các vật trong hệ!',
      formulaSection: {
        primaryFormula: '\\vec{r}_G = \\frac{\\sum m_i\\vec{r}_i}{\\sum m_i}, \\qquad \\vec{v}_G = \\frac{\\sum m_i\\vec{v}_i}{\\sum m_i} = \\frac{\\vec{p}_{\\text{hệ}}}{M}',
        secondaryFormulas: [
          '\\sum \\vec{F}_{\\text{ngoại}} = M\\vec{a}_G',
          '\\text{Định lý König: } K_{\\text{hệ}} = \\frac{1}{2}M v_G^2 + K_{\\text{nội tại quanh } G}'
        ],
        variablesNote:
          '• Nếu $\\sum \\vec{F}_{\\text{ngoại}, x} = 0$ và hệ ban đầu đứng yên ($v_{Gx} = 0$) thì tọa độ $x_G$ **KHÔNG ĐỔI** suốt quá trình chuyển động: $\\sum m_i \\Delta x_i = 0$!'
      },
      deepDiveSection:
        'Phương pháp $x_G = \\text{const}$ giải các bài toán "người đi từ đầu thuyền ra cuối thuyền" hay "vật trượt từ đỉnh nêm xuống chân nêm" chỉ bằng **1 dòng duy nhất**, không cần tính gia tốc hay thời gian! Trong HQC khối tâm $G$, tổng động lượng luôn bằng $\\vec{0}$ ($m_1\\vec{u}_1 + m_2\\vec{u}_2 = \\vec{0}$).',
      teacherExplanation:
        'Bài toán hai vật nối lò xo không ma sát: trong HQC khối tâm, năng lượng biến dạng lò xo cực đại chính bằng động năng nội tại $\\frac{1}{2}\\mu(v_1 - v_2)^2$!',
      keyTakeaway: 'Khi không có ngoại lực phương $Ox$, độ dời các vật thỏa $\\sum m_i\\Delta x_i = 0$.',
      miniQuiz: [
        {
          id: 'ppro2-s3-q1',
          question: 'Người $m = 50\\text{ kg}$ đứng ở đuôi một chiếc thuyền dài $L = 4\\text{ m}$, khối lượng $M = 150\\text{ kg}$ đang đứng yên trên mặt hồ phẳng lặng. Người đó đi bộ đến mũi thuyền. Thuyền dịch chuyển đoạn bao nhiêu so với bờ?',
          options: ['A. $1\\text{ m}$ cùng chiều người đi', 'B. $1\\text{ m}$ ngược chiều người đi', 'C. $2\\text{ m}$ ngược chiều người đi', 'D. $0{,}75\\text{ m}$ ngược chiều người đi'],
          correctIndex: 1,
          explanation: 'Gọi $\\Delta x$ là độ lùi của thuyền: người tiến $(L - \\Delta x)$. Từ $m(L - \\Delta x) = M\\Delta x \\implies \\Delta x = \\frac{mL}{M+m} = \\frac{50\\cdot 4}{200} = 1\\text{ m}$ (ngược chiều người đi).'
        },
        {
          id: 'ppro2-s3-q2',
          question: 'Hai vật $m_1 = 2\\text{ kg}$ ($v_1 = 6\\text{ m/s}$) và $m_2 = 4\\text{ kg}$ ($v_2 = 0$) va chạm mềm. Động năng bị mất đi chuyển hóa thành nhiệt bằng đúng động năng nội tại $\\frac{1}{2}\\frac{m_1 m_2}{m_1+m_2}(v_1 - v_2)^2$, tức bằng:',
          options: ['A. $12\\text{ J}$', 'B. $24\\text{ J}$', 'C. $36\\text{ J}$', 'D. $18\\text{ J}$'],
          correctIndex: 1,
          explanation: '$\\mu = \\frac{2\\cdot 4}{2+4} = \\frac{4}{3}\\text{ kg} \\implies Q = \\frac{1}{2}\\cdot \\frac{4}{3}\\cdot 6^2 = 24\\text{ J}$.'
        }
      ],
      miniEssay: {
        id: 'ppro2-s3-e1',
        question: 'Hai khối $m_1 = 2\\text{ kg}$ và $m_2 = 6\\text{ kg}$ nối với nhau bằng một lò xo nhẹ độ cứng $k = 150\\text{ N/m}$ đặt trên mặt bàn ngang hoàn toàn nhẵn. Ban đầu hệ đứng yên, người ta truyền cho $m_1$ vận tốc $v_0 = 4\\text{ m/s}$ hướng thẳng về phía $m_2$. Tính độ nén cực đại của lò xo.',
        hint: 'Lò xo nén cực đại khi hai vật có cùng vận tốc $V$ (bằng vận tốc khối tâm $v_G$). Phần thế năng đàn hồi $\\frac{1}{2}k\\Delta l_{\\max}^2$ đúng bằng động năng nội tại $\\frac{1}{2}\\mu v_0^2$.',
        rubricChecklist: [
          'Lập luận tại lúc nén cực đại hai vật có cùng vận tốc $V = \\frac{m_1 v_0}{m_1+m_2} = 1\\text{ m/s}$.',
          'Bảo toàn cơ năng: $\\frac{1}{2}k x_{\\max}^2 = \\frac{1}{2}m_1 v_0^2 - \\frac{1}{2}(m_1+m_2)V^2 = 16 - 4 = 12\\text{ J} \\implies x_{\\max} = \\sqrt{24/150} = 0{,}4\\text{ m}$.'
        ],
        sampleAnswer: 'Do bàn nhẵn, động lượng và cơ năng toàn phần bảo toàn. Lò xo nén cực đại khi vận tốc tương đối bằng 0, tức hai vật cùng chuyển động với vận tốc khối tâm $V = \\frac{m_1 v_0}{m_1 + m_2} = \\frac{2\\cdot 4}{2 + 6} = 1\\text{ m/s}$. Theo bảo toàn cơ năng: $\\frac{1}{2}k x_{\\max}^2 = \\frac{1}{2}m_1 v_0^2 - \\frac{1}{2}(m_1 + m_2)V^2 = \\frac{1}{2}\\cdot 2\\cdot 16 - \\frac{1}{2}\\cdot 8\\cdot 1^2 = 12\\text{ J} \\Rightarrow x_{\\max} = \\sqrt{\\frac{24}{150}} = 0{,}4\\text{ m}$.'
      }
    }
  ],
  'phys-pro-3': [
    {
      stepTitle: '1. Định luật Kirchhoff & Mạch điện Đối xứng Chập nút',
      stepType: 'concept',
      conceptSection:
        'Khi gặp mạch điện không thể tách nối tiếp – song song đơn giản (mạch cầu không cân bằng, mạch lập phương, mạch đối xứng), hai định luật Kirchhoff kết hợp **tính đối xứng điện thế** giúp giải quyết triệt để mọi cấu trúc mạch.',
      formulaSection: {
        primaryFormula: '\\sum I_{\\text{vào nút}} = \\sum I_{\\text{ra nút}}, \\qquad \\sum_{\\text{vòng kín}} (I_k R_k - \\mathscr{E}_k) = 0',
        secondaryFormulas: [
          '\\text{Cầu cân bằng: } R_1 R_4 = R_2 R_3 \\implies I_{\\text{cầu}} = 0',
          '\\text{Hai nút cùng điện thế } (V_M = V_N) \\implies \\text{Có thể chập M với N hoặc bỏ } R_{MN}'
        ],
        variablesNote:
          '• **Đối xứng song song** (mạch đối xứng qua đường nối 2 cực nguồn A–B): các cặp nút đối xứng qua trục AB có **cùng điện thế** $\\implies$ chập chúng lại.\n• **Đối xứng vuông góc** (mạch đối xứng qua mặt trung trực của AB): mọi điện trở nằm vắt ngang qua trục đối xứng có dòng đối xứng hoặc điểm giữa cùng điện thế $U_{AB}/2$.'
      },
      deepDiveSection:
        'Ví dụ kinh điển: khối lập phương 12 cạnh mỗi cạnh điện trở $R$, mắc nguồn vào hai đỉnh chéo không gian A và B! Nhờ đối xứng quanh trục AB, 3 đỉnh kề A có cùng điện thế $V_1$, 3 đỉnh kề B có cùng điện thế $V_2$. Chập từng nhóm 3 đỉnh lại thu được 3 nhánh song song $R/3$, nối 6 cạnh giữa $R/6$, nối 3 cạnh tới B $R/3$ $\\implies R_{AB} = \\frac{R}{3} + \\frac{R}{6} + \\frac{R}{3} = \\frac{5}{6}R$!',
      teacherExplanation:
        'Trước khi viết phương trình Kirchhoff nhiều ẩn, luôn kiểm tra xem mạch có đối xứng điện thế hay cầu cân bằng không.',
      keyTakeaway: 'Các điểm đối xứng qua trục nối hai cực nguồn luôn đẳng thế và có thể chập lại làm một nút.',
      miniQuiz: [
        {
          id: 'ppro3-s1-q1',
          question: 'Mạch cầu gồm $R_1 = 2\\,\\Omega, R_2 = 4\\,\\Omega$ (nhánh trên), $R_3 = 3\\,\\Omega, R_4 = 6\\,\\Omega$ (nhánh dưới) và điện trở cầu giữa $R_5 = 10\\,\\Omega$. Điện trở tương đương $R_{AB}$ của cả mạch cầu bằng:',
          options: ['A. $15\\,\\Omega$', 'B. $3{,}6\\,\\Omega$', 'C. $5\\,\\Omega$', 'D. $4{,}2\\,\\Omega$'],
          correctIndex: 1,
          explanation: 'Vì $R_1 R_4 = 2\\cdot 6 = 12 = R_2 R_3$ nên cầu cân bằng ($I_5 = 0$). Bỏ $R_5$: $(2+4) \\parallel (3+6) = 6 \\parallel 9 = \\frac{54}{15} = 3{,}6\\,\\Omega$.'
        },
        {
          id: 'ppro3-s1-q2',
          question: 'Cho mạch 12 điện trở giống hệt nhau bằng $R = 12\\,\\Omega$ ghép thành 12 cạnh của hình lập phương. Điện trở tương đương giữa hai đỉnh đường chéo khối không gian là:',
          options: ['A. $10\\,\\Omega$', 'B. $12\\,\\Omega$', 'C. $14\\,\\Omega$', 'D. $6\\,\\Omega$'],
          correctIndex: 0,
          explanation: '$R_{AB} = \\frac{5}{6}R = \\frac{5}{6}\\cdot 12 = 10\\,\\Omega$.'
        }
      ],
      miniEssay: {
        id: 'ppro3-s1-e1',
        question: 'Trình bày cách tính nhanh điện trở tương đương giữa hai đỉnh liền kề nhau trên một cạnh của khối lập phương gồm 12 điện trở $R$ giống nhau.',
        hint: 'Mạch đối xứng qua mặt phẳng chứa hai đỉnh nối nguồn A, B và 2 đỉnh đối diện của nó $\\implies$ chập từng cặp đỉnh đối xứng.',
        rubricChecklist: [
          'Xác định mặt phẳng đối xứng đi qua cạnh nguồn AB và hai đỉnh đối diện ở mặt chéo.',
          'Chập 2 cặp đỉnh đối xứng, rút gọn mạch phẳng còn $R_{AB} = \\frac{7}{12}R$.'
        ],
        sampleAnswer: 'Đặt nguồn vào hai đỉnh kề nhau A và B của cạnh AB. Mặt phẳng đi qua AB và cạnh đối diện chéo CD chia lập phương thành hai nửa đối xứng gương giống hệt nhau. Gọi các đỉnh trên mỗi nửa là (M, N) và (M\', N\'), ta có $V_M = V_{M\'}$, $V_N = V_{N\'}$. Chập các cặp đối xứng đó lại rồi tách nhánh song song – nối tiếp đơn giản thu được điện trở tương đương giữa hai đỉnh kề nhau là $R_{AB} = \\frac{7}{12}R$.'
      }
    },
    {
      stepTitle: '2. Phép Biến đổi Tam giác $\\Delta \\leftrightarrow$ Hình Sao $Y$',
      stepType: 'derivation',
      conceptSection:
        'Với mạch cầu tổng quát **không cân bằng** và không đối xứng, phép biến đổi tương đương giữa nhóm 3 điện trở nối **Tam giác ($R_{12}, R_{23}, R_{31}$)** sang nhóm 3 điện trở nối **Hình sao ($R_1, R_2, R_3$)** là công cụ tổng quát phá vỡ mọi nút bậc 3.',
      formulaSection: {
        primaryFormula: 'R_1 = \\frac{R_{12} R_{13}}{R_{12} + R_{23} + R_{13}} \\qquad (\\Delta \\to Y)',
        secondaryFormulas: [
          'R_{12} = R_1 + R_2 + \\frac{R_1 R_2}{R_3} \\qquad (Y \\to \\Delta)',
          '\\text{Trường hợp 3 điện trở bằng nhau: } R_\\Delta = 3 R_Y'
        ],
        variablesNote:
          '• Mẹo nhớ công thức **$\\Delta \\to Y$**: điện trở nhánh sao gắn vào đỉnh $1$ bằng **tích 2 cạnh tam giác kề đỉnh $1$ chia cho tổng 3 cạnh tam giác**.\n• Sau khi chuyển một nửa tam giác của mạch cầu sang sao $Y$, phần mạch còn lại lập tức biến thành nối tiếp – song song cơ bản!'
      },
      deepDiveSection:
        'Nếu 3 điện trở tam giác bằng nhau $R$, biến đổi sang hình sao chỉ còn $R/3$ ở mỗi nhánh! Ngược lại khi chuyển từ Sao sang Tam giác, tổng hợp 3 điện trở bằng nhau biến thành $3R$.',
      teacherExplanation:
        'Biến đổi $\\Delta \\to Y$ ở ngay một tam giác bất kỳ của mạch cầu không cân bằng sẽ giải ra $R_{AB}$ mà không cần giải hệ phương trình 3 ẩn.',
      keyTakeaway: 'Nhánh hình sao bằng tích 2 cạnh tam giác kề nút đó chia tổng 3 cạnh tam giác.',
      miniQuiz: [
        {
          id: 'ppro3-s2-q1',
          question: 'Ba điện trở giống nhau có giá trị $R_\\Delta = 9\\,\\Omega$ mắc thành tam giác. Nếu biến đổi tương đương sang hình sao Y thì mỗi nhánh sao có điện trở bằng:',
          options: ['A. $27\\,\\Omega$', 'B. $3\\,\\Omega$', 'C. $9\\,\\Omega$', 'D. $4{,}5\\,\\Omega$'],
          correctIndex: 1,
          explanation: '$R_Y = \\frac{R_\\Delta}{3} = \\frac{9}{3} = 3\\,\\Omega$.'
        },
        {
          id: 'ppro3-s2-q2',
          question: 'Cho tam giác điện trở $R_{12} = 3\\,\\Omega$, $R_{23} = 6\\,\\Omega$, $R_{13} = 9\\,\\Omega$. Khi biến đổi sang sao $Y$, điện trở nhánh $R_1$ gắn vào đỉnh 1 bằng:',
          options: ['A. $1{,}5\\,\\Omega$', 'B. $3\\,\\Omega$', 'C. $1\\,\\Omega$', 'D. $4{,}5\\,\\Omega$'],
          correctIndex: 0,
          explanation: '$R_1 = \\frac{R_{12}R_{13}}{R_{12}+R_{23}+R_{13}} = \\frac{3\\cdot 9}{3+6+9} = \\frac{27}{18} = 1{,}5\\,\\Omega$.'
        }
      ],
      miniEssay: {
        id: 'ppro3-s2-e1',
        question: 'Dùng phép biến đổi $\\Delta \\to Y$ tính điện trở tương đương $R_{AB}$ của mạch cầu không cân bằng có: $R_1 = 2\\,\\Omega$ (A–C), $R_2 = 4\\,\\Omega$ (C–B), $R_3 = 4\\,\\Omega$ (A–D), $R_4 = 2\\,\\Omega$ (D–B) và điện trở cầu $R_5 = 4\\,\\Omega$ (C–D).',
        hint: 'Biến đổi tam giác ACD ($R_1 = 2, R_3 = 4, R_5 = 4$) sang sao gắn với A, C, D ($R_A, R_C, R_D$).',
        rubricChecklist: [
          'Tính $R_A = \\frac{2\\cdot 4}{10} = 0{,}8\\,\\Omega$; $R_C = \\frac{2\\cdot 4}{10} = 0{,}8\\,\\Omega$; $R_D = \\frac{4\\cdot 4}{10} = 1{,}6\\,\\Omega$.',
          'Mạch còn $R_A$ nối tiếp nhánh song song $(R_C + R_2) \\parallel (R_D + R_4) = 4{,}8 \\parallel 3{,}6 \\approx 2{,}057\\,\\Omega \\implies R_{AB} \\approx 2{,}86\\,\\Omega$ (trùng đáp số tính đối xứng!).'
        ],
        sampleAnswer: 'Biến đổi tam giác ACD ($R_{AC} = 2, R_{AD} = 4, R_{CD} = 4$, tổng $= 10\\,\\Omega$) sang hình sao tại tâm O: $R_A = \\frac{2\\cdot 4}{10} = 0{,}8\\,\\Omega$, $R_C = \\frac{2\\cdot 4}{10} = 0{,}8\\,\\Omega$, $R_D = \\frac{4\\cdot 4}{10} = 1{,}6\\,\\Omega$. Khi đó nhánh OCB có $0{,}8 + 4 = 4{,}8\\,\\Omega$, nhánh ODB có $1{,}6 + 2 = 3{,}6\\,\\Omega$. Hai nhánh này song song: $R_{OB} = \\frac{4{,}8\\cdot 3{,}6}{4{,}8+3{,}6} = \\frac{17{,}28}{8{,}4} \\approx 2{,}057\\,\\Omega$. Cộng thêm $R_A$: $R_{AB} = 0{,}8 + 2{,}057 = 2{,}857\\,\\Omega$.'
      }
    },
    {
      stepTitle: '3. Phương pháp Thế Nút & Mạch Vô hạn Tuần hoàn',
      stepType: 'example',
      conceptSection:
        'Với mạch chứa nhiều nguồn điện và nhiều nhánh mắc song song (hoặc mạch bậc thang dài vô hạn lặp lại cùng một mắt xích), phương pháp **Thế nút** và **Phương trình tự tương đồng** cho phép tìm dòng và $R_{\\text{tđ}}$ chỉ trong vài dòng đại số.',
      formulaSection: {
        primaryFormula: 'V_A - V_B = \\frac{\\sum \\frac{\\mathscr{E}_k}{R_k}}{\\sum \\frac{1}{R_k}} \\quad (\\text{định lý Millman})',
        secondaryFormulas: [
          '\\text{Mạch thang vô hạn: } R_{\\text{AB}} = f(R_{\\text{AB}}) \\text{ (giải bậc 2 lấy nghiệm dương)}'
        ],
        variablesNote:
          '• Nếu các nguồn ghép song song vào cùng 2 nút A, B: chọn $V_B = 0$ rồi dùng công thức Millman (nhớ dấu âm nếu cực dương nguồn hướng về B).\n• Với mạch thang lặp vô tận, cắt bỏ 1 mắt xích đầu tiên thì phần đuôi còn lại vẫn có đúng điện trở tương đương $R_{\\text{tđ}}$ ban đầu!'
      },
      deepDiveSection:
        'Định lý **Thévenin – Norton** cũng là trợ thủ đắc lực ở kỳ thi HSG: biến đổi toàn bộ phần mạch phức tạp chứa nguồn nối tới điện trở tải $R_X$ thành một nguồn tương đương duy nhất $(\\mathscr{E}_{\\text{tđ}}, r_{\\text{tđ}})$ với $\\mathscr{E}_{\\text{tđ}} = U_{\\text{hở mạch}}$ và $r_{\\text{tđ}} = R_{AB\\text{ khi ngắn mạch nguồn}}$; khi đó $R_X$ đạt công suất cực đại ngay tại $R_X = r_{\\text{tđ}}$.',
      teacherExplanation:
        'Thấy câu hỏi tìm $R_X$ để công suất trên $R_X$ cực đại trong mạch phức tạp: dùng ngay Thévenin tìm $r_{\\text{tđ}}$ rồi suy ra $R_X = r_{\\text{tđ}}$!',
      keyTakeaway: 'Mạch vô hạn đặt $R_{\\text{đuôi}} = R_{AB}$; công suất trên tải $R_X$ cực đại khi $R_X = r_{\\text{Thévenin}}$.',
      miniQuiz: [
        {
          id: 'ppro3-s3-q1',
          question: 'Cho mạch thang vô hạn gồm các mắt hình chữ $\\Gamma$: mỗi mắt gồm một điện trở $R$ nối tiếp ở nhánh trên và một điện trở $R$ mắc rẽ xuống dây dưới. Điện trở tương đương $R_{AB}$ của cả mạch vô hạn bằng:',
          options: ['A. $\\frac{1 + \\sqrt{3}}{2}R$', 'B. $\\frac{1 + \\sqrt{5}}{2}R$', 'C. $2R$', 'D. $\\sqrt{2}R$'],
          correctIndex: 1,
          explanation: '$R_{AB} = R + \\frac{R \\cdot R_{AB}}{R + R_{AB}} \\iff R_{AB}^2 - R\\cdot R_{AB} - R^2 = 0 \\implies R_{AB} = \\frac{1 + \\sqrt{5}}{2}R \\approx 1{,}618 R$.'
        },
        {
          id: 'ppro3-s3-q2',
          question: 'Mắc song song 2 nguồn điện cùng chiều từ B sang A: nguồn 1 ($\\mathscr{E}_1 = 6\\text{ V}, r_1 = 1\\,\\Omega$) và nguồn 2 ($\\mathscr{E}_2 = 3\\text{ V}, r_2 = 2\\,\\Omega$) (mạch ngoài hở). Hiệu điện thế $U_{AB}$ bằng:',
          options: ['A. $4{,}5\\text{ V}$', 'B. $5\\text{ V}$', 'C. $4\\text{ V}$', 'D. $3\\text{ V}$'],
          correctIndex: 1,
          explanation: 'Theo Millman: $U_{AB} = \\frac{6/1 + 3/2}{1/1 + 1/2} = \\frac{7{,}5}{1{,}5} = 5\\text{ V}$.'
        }
      ],
      miniEssay: {
        id: 'ppro3-s3-e1',
        question: 'Giải bài toán mạch thang vô hạn có điện trở nối tiếp $R_1 = 2\\,\\Omega$ và điện trở rẽ song song $R_2 = 3\\,\\Omega$ lặp lại vô tận.',
        hint: 'Đặt $x = R_{AB} > 0$, lập phương trình $x = R_1 + \\frac{R_2 x}{R_2 + x}$.',
        rubricChecklist: [
          'Thiết lập phương trình tự tương đồng $x = 2 + \\frac{3x}{3 + x}$.',
          'Biến đổi thành $x^2 - 2x - 6 = 0$, chọn nghiệm dương $x = 1 + \\sqrt{7} \\approx 3{,}65\\,\\Omega$.'
        ],
        sampleAnswer: 'Đặt $x = R_{AB} > 0$. Vì mạch lặp lại vô tận, nếu tách bỏ mắt đầu tiên ($R_1 = 2\\,\\Omega$ nối tiếp với $R_2 = 3\\,\\Omega$ song song phần còn lại), điện trở phần còn lại vẫn đúng bằng $x$. Ta có: $x = 2 + \\frac{3x}{3 + x} \\Rightarrow x(3 + x) = 2(3 + x) + 3x \\Rightarrow x^2 - 2x - 6 = 0$. Loại nghiệm âm, thu được $R_{AB} = 1 + \\sqrt{7} \\approx 3{,}65\\,\\Omega$.'
      }
    }
  ],
  'phys-pro-4': [
    {
      stepTitle: '1. Hệ Ghép Hai Thấu kính & Sơ đồ Tạo ảnh',
      stepType: 'concept',
      conceptSection:
        'Trong các quang hệ phức tạp (kính hiển vi, kính thiên văn, hệ thấu kính – gương cầu), ảnh tạo bởi dụng cụ 1 ($A_1B_1$) đóng vai trò làm **vật** cho dụng cụ 2 tạo ra ảnh cuối cùng ($A_2B_2$).',
      formulaSection: {
        primaryFormula: 'd_1\' = \\frac{d_1 f_1}{d_1 - f_1}, \\qquad d_2 = a - d_1\', \\qquad k_{\\text{hệ}} = k_1\\cdot k_2',
        secondaryFormulas: [
          '\\text{Ghép sát 2 thấu kính mỏng } (a = 0): \\frac{1}{f} = \\frac{1}{f_1} + \\frac{1}{f_2} \\quad (D = D_1 + D_2)'
        ],
        variablesNote:
          '• $a = O_1 O_2$: khoảng cách giữa hai quang tâm.\n• **Bẫy quy ước dấu vật ảo**: nếu ảnh $A_1B_1$ nằm ở **phía sau** thấu kính 2 ($d_1\' > a$) thì $d_2 = a - d_1\' < 0$ — khi đó $A_1B_1$ là **vật ảo** đối với thấu kính 2 (vẫn áp dụng nguyên vẹn công thức thấu kính với $d_2 < 0$!).'
      },
      deepDiveSection:
        'Điều kiện đặc biệt **hệ vô tiêu** ($a = f_1 + f_2$): chùm tia song song tới thấu kính 1 sẽ ló ra khỏi thấu kính 2 cũng là chùm tia **song song**, với độ phóng đại góc $G = -f_1/f_2$ (chính là cấu tạo cơ bản của kính thiên văn ngắm chừng ở vô cực!).',
      teacherExplanation:
        'Luôn viết sơ đồ tạo ảnh $AB \\xrightarrow{L_1} A_1B_1 \\xrightarrow{L_2} A_2B_2$ kèm hệ thức $d_1\' + d_2 = a$ ngay đầu bài để không bao giờ nhầm dấu.',
      keyTakeaway: 'Sơ đồ quang hệ luôn tuân thủ $d_1\' + d_2 = a$ và $k_{\\text{hệ}} = k_1\\cdot k_2$; ghép sát thì cộng độ tụ $D = D_1 + D_2$.',
      miniQuiz: [
        {
          id: 'ppro4-s1-q1',
          question: 'Hai thấu kính mỏng ghép sát nhau gồm một thấu kính hội tụ $f_1 = 20\\text{ cm}$ và một thấu kính phân kì $f_2 = -50\\text{ cm}$. Tiêu cự tương đương của hệ ghép sát bằng:',
          options: ['A. $-30\\text{ cm}$', 'B. $+33{,}3\\text{ cm}$', 'C. $-33{,}3\\text{ cm}$', 'D. $+70\\text{ cm}$'],
          correctIndex: 1,
          explanation: '$\\frac{1}{f} = \\frac{1}{20} + \\frac{1}{-50} = \\frac{3}{100} \\implies f = +\\frac{100}{3} \\approx +33{,}3\\text{ cm}$.'
        },
        {
          id: 'ppro4-s1-q2',
          question: 'Vật AB qua thấu kính 1 tạo ảnh thật $A_1B_1$ cách $O_1$ đoạn $d_1\' = 35\\text{ cm}$. Đặt thấu kính 2 sau $O_1$ cách $O_1$ khoảng $a = 25\\text{ cm}$. Khoảng cách $d_2$ từ $A_1B_1$ tới $O_2$ là:',
          options: ['A. $+10\\text{ cm}$ (vật thật)', 'B. $-10\\text{ cm}$ (vật ảo)', 'C. $+60\\text{ cm}$ (vật thật)', 'D. $-60\\text{ cm}$ (vật ảo)'],
          correctIndex: 1,
          explanation: '$d_2 = a - d_1\' = 25 - 35 = -10\\text{ cm} < 0$ (nằm sau $O_2$ nên là vật ảo).'
        }
      ],
      miniEssay: {
        id: 'ppro4-s1-e1',
        question: 'Cho 2 thấu kính hội tụ $f_1 = 20\\text{ cm}, f_2 = 10\\text{ cm}$ đặt đồng trục cách nhau $a = 45\\text{ cm}$. Vật sáng AB đặt trước $L_1$ một đoạn $d_1 = 30\\text{ cm}$. Xác định vị trí và số phóng đại ảnh cuối cùng $A_2B_2$.',
        hint: 'Tính $d_1\', k_1$ qua $L_1$, tính $d_2 = 45 - d_1\'$, rồi tính $d_2\', k_2$ qua $L_2$.',
        rubricChecklist: [
          'Qua $L_1$: $d_1\' = \\frac{30\\cdot 20}{30-20} = 60\\text{ cm}$, $k_1 = -2$.',
          'Qua $L_2$: $d_2 = 45 - 60 = -15\\text{ cm}$ (vật ảo), $d_2\' = \\frac{-15\\cdot 10}{-15-10} = +6\\text{ cm}$ (ảnh thật sau $L_2$), $k_2 = -\\frac{6}{-15} = +0{,}4 \\implies k = k_1 k_2 = -0{,}8$.'
        ],
        sampleAnswer: 'Qua $L_1$: $d_1\' = \\frac{d_1 f_1}{d_1 - f_1} = \\frac{30\\cdot 20}{30 - 20} = 60\\text{ cm}$; $k_1 = -\\frac{60}{30} = -2$. Vì $a = 45\\text{ cm}$, ta có $d_2 = a - d_1\' = 45 - 60 = -15\\text{ cm}$ (vật ảo sau $L_2$). Qua $L_2$: $d_2\' = \\frac{d_2 f_2}{d_2 - f_2} = \\frac{(-15)\\cdot 10}{-15 - 10} = +6\\text{ cm}$ (ảnh thật nằm sau $L_2$ cách $O_2$ $6\\text{ cm}$). Số phóng đại toàn hệ $k = k_1 k_2 = (-2)\\cdot\\left(-\\frac{6}{-15}\\right) = -0{,}8$ (ảnh ngược chiều và cao bằng $0{,}8$ lần vật).'
      }
    },
    {
      stepTitle: '2. Quang hệ Thấu kính – Gương phẳng / Gương cầu & Phản xạ Kép',
      stepType: 'derivation',
      conceptSection:
        'Khi đặt một gương phía sau thấu kính, chùm sáng truyền qua thấu kính lần 1, phản xạ trên gương rồi **quay ngược trở lại qua chính thấu kính đó lần thứ 2**! Quá trình tạo ảnh gồm 3 chặng nối tiếp.',
      formulaSection: {
        primaryFormula: 'AB \\xrightarrow{\\text{TK lần 1}} A_1B_1 \\xrightarrow{\\text{Gương}} A_2B_2 \\xrightarrow{\\text{TK lần 2}} A_3B_3',
        secondaryFormulas: [
          '\\text{Gương cầu: } \\frac{1}{d} + \\frac{1}{d\'} = \\frac{1}{f_{\\text{gương}}} = \\frac{2}{R} \\quad (f_{\\text{lõm}} > 0,\\ f_{\\text{lồi}} < 0)'
        ],
        variablesNote:
          '• **Đảo chiều đường truyền ở lần 2**: Khi ánh sáng phản xạ từ gương quay lại thấu kính, chiều truyền sáng đổi hướng $\\implies$ vật thật của thấu kính lần 2 là ảnh nằm ở phía **gương** (nằm bên phải thấu kính thì $d_3 > 0$!), còn ảnh cuối cùng $A_3B_3$ nếu $d_3\' > 0$ sẽ nằm bên phía **vật AB ban đầu**!'
      },
      deepDiveSection:
        'Ứng dụng cực nhanh trong bài thí nghiệm tự chuẩn trực (autocollimation): Đặt gương phẳng vuông góc trục chính ngay sau thấu kính hội tụ. Nếu đặt vật AB ở đúng tiêu diện $d_1 = f$ thì tia ló sau thấu kính lần 1 song song, phản xạ gương phẳng vẫn song song rồi đi ngược lại thấu kính cho ảnh thật $A_3B_3$ **hiện rõ ngay trên cùng mặt phẳng chứa vật AB** và cao bằng vật ($k = -1$)!',
      teacherExplanation:
        'Mẹo tránh sai dấu khi ánh sáng dội ngược qua thấu kính lần 2: luôn đứng theo chiều tia sáng đi tới dụng cụ để xác định vật thật ($d > 0$) nằm phía trước chiều truyền tia tới.',
      keyTakeaway: 'Gương phẳng + thấu kính cho ảnh thật trùng vị trí vật ($k = -1$) khi vật đặt tại tiêu diện $d = f$.',
      miniQuiz: [
        {
          id: 'ppro4-s2-q1',
          question: 'Đặt gương phẳng vuông góc trục chính sau một thấu kính hội tụ tiêu cự $f = 25\\text{ cm}$. Phải đặt vật sáng AB cách thấu kính bao nhiêu để ảnh cuối cùng sau khi phản xạ trở lại qua thấu kính là ảnh thật nằm ngay tại vị trí vật AB?',
          options: ['A. $12{,}5\\text{ cm}$', 'B. $25\\text{ cm}$', 'C. $50\\text{ cm}$', 'D. Không phụ thuộc vị trí'],
          correctIndex: 1,
          explanation: 'Theo phương pháp tự chuẩn trực, chùm tia sau khi qua thấu kính phải song song để phản xạ vuông góc trên gương phẳng và quay lại hội tụ đúng tại mặt phẳng vật $\\implies d = f = 25\\text{ cm}$.'
        },
        {
          id: 'ppro4-s2-q2',
          question: 'Một gương cầu lõm có bán kính cong $R = 40\\text{ cm}$. Tiêu cự $f$ của gương cầu lõm này bằng:',
          options: ['A. $+40\\text{ cm}$', 'B. $+20\\text{ cm}$', 'C. $-20\\text{ cm}$', 'D. $+80\\text{ cm}$'],
          correctIndex: 1,
          explanation: 'Gương cầu lõm hội tụ có $f = R/2 = +20\\text{ cm}$.'
        }
      ],
      miniEssay: {
        id: 'ppro4-s2-e1',
        question: 'Đặt gương phẳng vuông góc trục chính cách thấu kính hội tụ ($f = 20\\text{ cm}$) một khoảng $l = 30\\text{ cm}$. Điểm sáng S nằm trên trục chính trước thấu kính cách thấu kính $d_1 = 60\\text{ cm}$. Tìm vị trí ảnh cuối cùng sau khi ánh sáng qua thấu kính lần 2.',
        hint: 'Qua TK1: $d_1\' = 30\\text{ cm}$ (ảnh $S_1$ rơi ĐÚNG trên mặt gương!). Phản xạ trên gương $S_2 \\equiv S_1$ ngay mặt gương $\\implies$ quay lại TK lần 2 với $d_3 = 30\\text{ cm}$.',
        rubricChecklist: [
          'Tính $d_1\' = \\frac{60\\cdot 20}{60-20} = 30\\text{ cm} = l \\implies$ ảnh $S_1$ hiện đúng trên mặt gương phẳng.',
          'Gương phẳng cho ảnh $S_2$ trùng $S_1$, quay ngược lại TK lần 2 với $d_3 = 30\\text{ cm} \\implies d_3\' = 60\\text{ cm}$ (trùng ngay điểm S ban đầu!).'
        ],
        sampleAnswer: 'Qua thấu kính lần 1: $d_1\' = \\frac{60\\cdot 20}{60 - 20} = 30\\text{ cm}$. Vì gương đặt cách thấu kính $l = 30\\text{ cm}$, ảnh $S_1$ nằm đúng trên mặt gương phẳng nên ảnh phản xạ $S_2$ qua gương trùng khít với $S_1$. Khi tia phản xạ đi ngược lại thấu kính lần 2, vật $S_2$ cách thấu kính $d_3 = 30\\text{ cm} \\Rightarrow d_3\' = \\frac{30\\cdot 20}{30 - 20} = 60\\text{ cm}$ (ảnh thật hiện đúng tại điểm S ban đầu).'
      }
    },
    {
      stepTitle: '3. Cực trị Khoảng cách Vật – Ảnh & Bài toán Hai vị trí (Bessel)',
      stepType: 'example',
      conceptSection:
        'Với một thấu kính hội tụ tiêu cự $f$, để thu được ảnh thật trên màn đặt cố định cách vật khoảng $L$, khoảng cách $L$ không thể nhỏ tùy ý mà có **ngưỡng tối thiểu** $L_{\\min} = 4f$.',
      formulaSection: {
        primaryFormula: 'L = d + d\' = \\frac{d^2}{d - f} \\ge 4f, \\qquad d^2 - Ld + Lf = 0',
        secondaryFormulas: [
          '\\text{Hai vị trí cùng cho ảnh rõ trên màn: } d_1 + d_2 = L,\\ d_1 d_2 = Lf',
          '\\text{Công thức Bessel: } f = \\frac{L^2 - l^2}{4L} \\quad (l = |d_1 - d_2|), \\qquad A_1B_1 \\cdot A_2B_2 = AB^2'
        ],
        variablesNote:
          '• Khi $L > 4f$: có **2 vị trí** đặt thấu kính cho ảnh thật rõ nét trên màn, đối xứng qua trung điểm ($d_1 = d_2\'$ và $d_2 = d_1\'$).\n• Hệ quả cực hay: tích chiều cao hai ảnh bằng bình phương chiều cao vật ($h_1 h_2 = h^2$).'
      },
      deepDiveSection:
        'Phương pháp **Bessel** là phép đo tiêu cự chính xác nhất trong phòng thí nghiệm chuyên Lý vì không cần đo vị trí quang tâm $O$ bên trong thấu kính dày: chỉ cần đo khoảng cách vật–màn $L$ và độ dịch chuyển thấu kính $l$ giữa hai vị trí ảnh rõ nét rồi tính $f = \\frac{L^2 - l^2}{4L}$.',
      teacherExplanation:
        'Nếu bài yêu cầu tìm khoảng cách ngắn nhất giữa vật thật và ảnh thật của thấu kính hội tụ: nhớ ngay $L_{\\min} = 4f$ khi $d = d\' = 2f$ ($k = -1$)!',
      keyTakeaway: 'Khoảng cách vật thật – ảnh thật tối thiểu qua TKHT là $4f$; đo $f$ theo Bessel: $f = \\frac{L^2 - l^2}{4L}$.',
      miniQuiz: [
        {
          id: 'ppro4-s3-q1',
          question: 'Khoảng cách ngắn nhất giữa một vật sáng thật và ảnh thật của nó tạo bởi thấu kính hội tụ tiêu cự $f = 15\\text{ cm}$ là:',
          options: ['A. $15\\text{ cm}$', 'B. $30\\text{ cm}$', 'C. $60\\text{ cm}$', 'D. $45\\text{ cm}$'],
          correctIndex: 2,
          explanation: '$L_{\\min} = 4f = 4\\cdot 15 = 60\\text{ cm}$ (xảy ra khi $d = d\' = 30\\text{ cm}$).'
        },
        {
          id: 'ppro4-s3-q2',
          question: 'Giữa vật AB và màn cách nhau $L = 90\\text{ cm}$, người ta tìm được 2 vị trí của thấu kính hội tụ đều cho ảnh rõ nét trên màn với độ cao lần lượt là $9\\text{ cm}$ và $4\\text{ cm}$. Chiều cao vật AB là:',
          options: ['A. $6{,}5\\text{ cm}$', 'B. $6\\text{ cm}$', 'C. $5\\text{ cm}$', 'D. $13\\text{ cm}$'],
          correctIndex: 1,
          explanation: '$AB = \\sqrt{h_1 h_2} = \\sqrt{9\\cdot 4} = 6\\text{ cm}$.'
        }
      ],
      miniEssay: {
        id: 'ppro4-s3-e1',
        question: 'Áp dụng số liệu câu trên ($L = 90\\text{ cm}$, ảnh cao $9\\text{ cm}$ và $4\\text{ cm}$, vật cao $6\\text{ cm}$), tính tiêu cự $f$ của thấu kính theo 2 vị trí đó.',
        hint: 'Từ $k_1 = -9/6 = -1{,}5$ và $d_1 + d_1\' = 90$, tìm $d_1, d_1\'$ rồi tính $f$.',
        rubricChecklist: [
          'Từ $|k_1| = d_1\'/d_1 = 1{,}5$ và $d_1 + d_1\' = 90 \\implies d_1 = 36\\text{ cm},\\ d_1\' = 54\\text{ cm}$.',
          'Tính $f = \\frac{36\\cdot 54}{36 + 54} = 21{,}6\\text{ cm}$ (hoặc dùng Bessel $l = 54 - 36 = 18 \\implies f = \\frac{90^2 - 18^2}{360} = 21{,}6\\text{ cm}$).'
        ],
        sampleAnswer: 'Ở vị trí tạo ảnh cao $9\\text{ cm}$, độ phóng đại $|k_1| = \\frac{9}{6} = 1{,}5 \\Rightarrow d_1\' = 1{,}5 d_1$. Mặt khác $d_1 + d_1\' = 90\\text{ cm} \\Rightarrow 2{,}5 d_1 = 90 \\Rightarrow d_1 = 36\\text{ cm}$ và $d_1\' = 54\\text{ cm}$. Vậy tiêu cự thấu kính là $f = \\frac{d_1 d_1\'}{d_1 + d_1\'} = \\frac{36 \\times 54}{90} = 21{,}6\\text{ cm}$.'
      }
    }
  ],
  'phys-pro-5': [
    {
      stepTitle: '1. Con lắc Vướng đinh & Biến cố Chu kì Dao động',
      stepType: 'concept',
      conceptSection:
        'Con lắc đơn dài $l_1$ khi dao động qua vị trí cân bằng gặp một chiếc đinh đóng cách điểm treo đoạn $d$ sẽ vướng đinh và tiếp tục dao động ở phía bên kia như một con lắc ngắn hơn có chiều dài $l_2 = l_1 - d$.',
      formulaSection: {
        primaryFormula: 'T_{\\text{vướng đinh}} = \\frac{T_1 + T_2}{2} = \\pi\\left(\\sqrt{\\frac{l_1}{g}} + \\sqrt{\\frac{l_2}{g}}\\right)',
        secondaryFormulas: [
          '\\text{Bảo toàn cơ năng hai bên (góc nhỏ): } l_1\\alpha_1^2 = l_2\\alpha_2^2 \\implies \\frac{\\alpha_2}{\\alpha_1} = \\sqrt{\\frac{l_1}{l_2}}'
        ],
        variablesNote:
          '• **Bẫy rất hay nhầm**: Ở hai phía khác nhau, **độ cao cực đại $h_{\\max}$ bằng nhau** (cơ năng bảo toàn), chứ **góc lệch cực đại $\\alpha_{\\max}$ KHÔNG bằng nhau**: bên dây ngắn hơn ($l_2 < l_1$) thì góc lệch vung lên **LỚN HƠN** ($\\alpha_2 > \\alpha_1$)!.'
      },
      deepDiveSection:
        'Chú ý lực căng dây ngay trước và ngay sau khi vướng đinh tại vị trí cân bằng: vì tốc độ $v_{\\max} = \\sqrt{2gh}$ giữ nguyên liên tục nhưng bán kính cong giảm đột ngột từ $l_1$ xuống $l_2$, gia tốc hướng tâm $v^2/l$ nhảy vọt làm **lực căng dây tăng đột ngột** ngay khoảnh khắc chạm đinh ($T_{\\text{sau}} = mg + mv^2/l_2 > T_{\\text{trước}}$)!',
      teacherExplanation:
        'Kiểm tra xem $\\alpha_2$ có vượt quá $10^\\circ$ không; nếu còn nhỏ thì con lắc vướng đinh thực hiện hai nửa dao động điều hòa ghép lại với chu kì $\\frac{T_1 + T_2}{2}$.',
      keyTakeaway: 'Con lắc vướng đinh: $T = (T_1 + T_2)/2$; qua đinh cùng độ cao $h$, lực căng dây tăng vọt vì bán kính giảm.',
      miniQuiz: [
        {
          id: 'ppro5-s1-q1',
          question: 'Con lắc đơn dài $l_1 = 1\\text{ m}$ có chu kì $T_1 = 2\\text{ s}$. Đóng một cái đinh ngay dưới điểm treo cách điểm treo $0{,}75\\text{ m}$ ($l_2 = 0{,}25\\text{ m}$). Chu kì dao động toàn phần của con lắc vướng đinh là:',
          options: ['A. $1{,}5\\text{ s}$', 'B. $2{,}5\\text{ s}$', 'C. $3{,}0\\text{ s}$', 'D. $1{,}0\\text{ s}$'],
          correctIndex: 0,
          explanation: '$l_2 = l_1/4 \\implies T_2 = T_1/2 = 1\\text{ s}$. Chu kì ghép là $T = \\frac{2 + 1}{2} = 1{,}5\\text{ s}$.'
        },
        {
          id: 'ppro5-s1-q2',
          question: 'Ở bài toán con lắc vướng đinh ($l_2 = l_1/4$), nếu kéo con lắc bên trái lệch góc nhỏ $\\alpha_1 = 4^\\circ$ rồi thả nhẹ thì góc lệch cực đại bên phải đinh bằng:',
          options: ['A. $2^\\circ$', 'B. $4^\\circ$', 'C. $8^\\circ$', 'D. $16^\\circ$'],
          correctIndex: 2,
          explanation: 'Theo $l_1\\alpha_1^2 = l_2\\alpha_2^2 \\implies \\alpha_2 = \\alpha_1\\sqrt{l_1/l_2} = 4^\\circ \\cdot 2 = 8^\\circ$.'
        }
      ],
      miniEssay: {
        id: 'ppro5-s1-e1',
        question: 'Thả con lắc đơn dài $l_1 = 1\\text{ m}$ từ góc lệch $\\alpha_1 = 60^\\circ$ ($g = 10\\text{ m/s}^2$, $m = 0{,}1\\text{ kg}$). Tại vị trí thấp nhất dây vướng đinh cách điểm treo $0{,}5\\text{ m}$. Tính lực căng dây ngay trước và ngay sau khi vướng đinh.',
        hint: 'Tính $v_{\\max}^2 = 2gl_1(1 - \\cos 60^\\circ) = gl_1$, sau đó thay vào $T_{\\text{căng}} = mg + mv_{\\max}^2/R$ với $R = 1\\text{ m}$ và $R = 0{,}5\\text{ m}$.',
        rubricChecklist: [
          'Tính $v^2 = 2\\cdot 10\\cdot 1\\cdot(1 - 0{,}5) = 10\\text{ m}^2/\\text{s}^2$.',
          'Trước đinh ($R = 1\\text{ m}$): $T_1 = 0{,}1(10 + 10/1) = 2\\text{ N}$; sau đinh ($R = 0{,}5\\text{ m}$): $T_2 = 0{,}1(10 + 10/0{,}5) = 3\\text{ N}$.'
        ],
        sampleAnswer: 'Tại vị trí cân bằng thấp nhất, bảo toàn cơ năng cho $v^2 = 2gl_1(1 - \\cos 60^\\circ) = 2\\cdot 10\\cdot 1\\cdot 0{,}5 = 10\\text{ m}^2/\\text{s}^2$. Ngay trước khi vướng đinh (bán kính quay $l_1 = 1\\text{ m}$): $T_{\\text{trước}} = mg + \\frac{mv^2}{l_1} = 0{,}1\\cdot 10 + 0{,}1\\cdot\\frac{10}{1} = 2\\text{ N}$. Ngay sau khi vướng đinh (bán kính giảm còn $l_2 = 0{,}5\\text{ m}$): $T_{\\text{sau}} = mg + \\frac{mv^2}{l_2} = 1 + 0{,}1\\cdot\\frac{10}{0{,}5} = 3\\text{ N}$.'
      }
    },
    {
      stepTitle: '2. Dao động Tắt dần Dưới lực Cản Nhớt & Va chạm Quả nặng',
      stepType: 'derivation',
      conceptSection:
        'Ngoài lực ma sát khô không đổi (biên độ giảm cấp số cộng $\\Delta A = 4F_{ms}/k$), trong phòng thí nghiệm HSG còn gặp lực cản nhớt tỉ lệ với vận tốc ($F_c = -bv$) làm biên độ giảm theo **hàm mũ (cấp số nhân)**.',
      formulaSection: {
        primaryFormula: 'A(t) = A_0 e^{-\\beta t}, \\qquad W(t) = W_0 e^{-2\\beta t}',
        secondaryFormulas: [
          '\\text{Ma sát khô nửa chu kì: } A_k = A_{k-1} - \\frac{2\\mu m g}{k}'
        ],
        variablesNote:
          '• Khi biên độ giảm $p\\%$ sau 1 chu kì: cơ năng còn lại là $(1 - p)^2$ lần cơ năng cũ.\n• Với ma sát khô $\\mu mg$: sau **mỗi nửa chu kì** biên độ giảm $\\frac{2\\mu mg}{k}$, sau **1 chu kì** giảm $\\frac{4\\mu mg}{k}$.'
      },
      deepDiveSection:
        'Cẩn thận khi giải bài ma sát khô dừng hẳn ở đâu! Nếu giải $N = A_0 / \\Delta A$ ra số lẻ (ví dụ $4{,}3$ chu kì), vật không dừng đúng tại $x = 0$ mà dừng lệch ở một tọa độ $|x_{\\text{dừng}}| \\le \\mu mg/k$ nơi lực đàn hồi nhỏ hơn ma sát nghỉ cực đại!',
      teacherExplanation:
        'Đừng lấy tổng số chu kì tắt dần bằng $A_0/\\Delta A$ mà bỏ qua kiểm tra điểm dừng cuối cùng khi đề hỏi tổng quãng đường đi được!',
      keyTakeaway: 'Ma sát khô làm biên độ giảm tuyến tính ($2\\mu mg/k$ mỗi nửa chu kì); lực cản nhớt làm biên độ giảm theo cấp số nhân.',
      miniQuiz: [
        {
          id: 'ppro5-s2-q1',
          question: 'Một con lắc dao động tắt dần chậm: sau mỗi chu kì biên độ giảm đi $5\\%$ so với chu kì liền trước. Phần trăm cơ năng mất đi trong chu kì đầu tiên xấp xỉ:',
          options: ['A. $5\\%$', 'B. $9{,}75\\%$', 'C. $10{,}25\\%$', 'D. $2{,}5\\%$'],
          correctIndex: 1,
          explanation: '$A\' = 0{,}95 A \\implies W\' = 0{,}95^2 W = 0{,}9025 W$, nên phần mất đi là $1 - 0{,}9025 = 9{,}75\\%$.'
        },
        {
          id: 'ppro5-s2-q2',
          question: 'Con lắc lò xo ngang có $k = 100\\text{ N/m}, m = 0{,}5\\text{ kg}, \\mu = 0{,}2$ ($g = 10\\text{ m/s}^2$). Kéo giãn $A_0 = 5\\text{ cm}$ rồi thả nhẹ. Độ giảm biên độ ngay sau NỬA chu kì đầu tiên là:',
          options: ['A. $1\\text{ cm}$', 'B. $2\\text{ cm}$', 'C. $4\\text{ cm}$', 'D. $0{,}5\\text{ cm}$'],
          correctIndex: 1,
          explanation: '$\\Delta A_{1/2} = \\frac{2\\mu mg}{k} = \\frac{2\\cdot 0{,}2\\cdot 0{,}5\\cdot 10}{100} = 0{,}02\\text{ m} = 2\\text{ cm}$.'
        }
      ],
      miniEssay: {
        id: 'ppro5-s2-e1',
        question: 'Với con lắc ở câu hỏi trên ($k = 100\\text{ N/m}, m = 0{,}5\\text{ kg}, \\mu = 0{,}2, A_0 = 5\\text{ cm}, g = 10\\text{ m/s}^2$), tính tổng quãng đường vật đi được cho đến khi dừng hẳn.',
        hint: 'Mỗi nửa chu kì biên độ giảm $2\\text{ cm}$: $5\\text{ cm} \\to 3\\text{ cm} \\to 1\\text{ cm}$. Tại $x = 1\\text{ cm}$, lực đàn hồi $kx = 1\\text{ N} = \\mu mg$ nên vật dừng ngay tại đó!',
        rubricChecklist: [
          'Tính $x_0 = \\mu mg/k = 1\\text{ cm}$.',
          'Theo dõi từng nửa chu kì: nửa 1 từ $+5$ sang $-3$ (đi $8\\text{ cm}$); nửa 2 từ $-3$ về $+1$ (đi $4\\text{ cm}$). Tại $x = +1\\text{ cm}$, $F_{đh} = 1\\text{ N} \\le F_{ms}$ nên dừng lại $\\implies s = 12\\text{ cm}$.'
        ],
        sampleAnswer: 'Độ lệch vị trí cân bằng tạm là $x_0 = \\frac{\\mu mg}{k} = \\frac{0{,}2\\cdot 0{,}5\\cdot 10}{100} = 0{,}01\\text{ m} = 1\\text{ cm}$. Nửa chu kì 1: vật đi từ $+5\\text{ cm}$ sang $-3\\text{ cm}$ (đi được $8\\text{ cm}$). Nửa chu kì 2: vật đi từ $-3\\text{ cm}$ quay về $+1\\text{ cm}$ (đi được $4\\text{ cm}$). Tại $x = +1\\text{ cm}$, vận tốc bằng $0$ và lực đàn hồi $kx = 1\\text{ N}$ không thắng nổi lực ma sát nghỉ cực đại $1\\text{ N}$ nên vật dừng hẳn. Tổng quãng đường là $S = 8 + 4 = 12\\text{ cm}$.'
      }
    },
    {
      stepTitle: '3. Chu trình Nhiệt động lực học & Hiệu suất Động cơ Carnot',
      stepType: 'example',
      conceptSection:
        'Một chu trình nhiệt động lực học là quá trình khép kín đưa khối khí trở về trạng thái $(p, V, T)$ ban đầu sau nhiều biến đổi ($\\Delta U_{\\text{chu trình}} = 0$). Diện tích hình phẳng bao bởi chu trình trên đồ thị $(p - V)$ chính bằng **công toàn chu trình**.',
      formulaSection: {
        primaryFormula: 'A_{\\text{chu trình}} = \\text{Diện tích vòng } (p-V) = Q_{\\text{nhận}} - |Q_{\\text{tỏa}}|',
        secondaryFormulas: [
          'H = \\frac{A\'}{Q_{\\text{nhận}}} = 1 - \\frac{|Q_{\\text{tỏa}}|}{Q_{\\text{nhận}}} \\le H_{\\text{Carnot}} = 1 - \\frac{T_{\\text{lạnh}}}{T_{\\text{nóng}}}'
        ],
        variablesNote:
          '• **Quy tắc chiều chu trình trên $(p - V)$**:\n  – Đi **thuận chiều kim đồng hồ**: khí thực hiện công dương ($A\' > 0$), đó là **Động cơ nhiệt**.\n  – Đi **ngược chiều kim đồng hồ**: khí nhận công từ ngoài, đó là **Máy lạnh / Bơm nhiệt**.\n• Khí đơn nguyên tử ($He, Ar$): $C_V = \\frac{3}{2}R, C_p = \\frac{5}{2}R$; lưỡng nguyên tử ($N_2, O_2$): $C_V = \\frac{5}{2}R, C_p = \\frac{7}{2}R$.'
      },
      deepDiveSection:
        'Để tính hiệu suất một chu trình đa giác trên $(p - V)$: đừng tính công từng cạnh làm gì cho lâu — tính trực tiếp công toàn phần $A\' = \\text{Diện tích hình học}$ (hình chữ nhật hoặc tam giác), rồi chỉ tính $Q_{\\text{nhận}}$ ở những nhánh mà **nhiệt độ tăng** hoặc **thể tích giãn nở nhận nhiệt**!',
      teacherExplanation:
        'Luôn kiểm tra kỹ quá trình nào nhận nhiệt ($Q > 0$) và quá trình nào tỏa nhiệt ($Q < 0$): **chỉ cộng những $Q > 0$** vào mẫu số $Q_{\\text{nhận}}$ của công thức hiệu suất $H = A\' / Q_{\\text{nhận}}$!',
      keyTakeaway: 'Diện tích khép kín trên $(p - V)$ bằng công chu trình; hiệu suất $H = A\'/Q_{\\text{nhận}}$ (chỉ tính các nhánh $Q > 0$).',
      miniQuiz: [
        {
          id: 'ppro5-s3-q1',
          question: 'Một động cơ nhiệt lý tưởng Carnot hoạt động giữa nguồn nóng $327^\\circ\\text{C}$ ($600\\text{ K}$) và nguồn lạnh $27^\\circ\\text{C}$ ($300\\text{ K}$). Hiệu suất tối đa của động cơ bằng:',
          options: ['A. $91{,}7\\%$', 'B. $50\\%$', 'C. $25\\%$', 'D. $75\\%$'],
          correctIndex: 1,
          explanation: '$H_{\\max} = 1 - \\frac{T_2}{T_1} = 1 - \\frac{300}{600} = 50\\%$.'
        },
        {
          id: 'ppro5-s3-q2',
          question: 'Khối khí thực hiện chu trình hình chữ nhật trên đồ thị $(p - V)$ đi thuận chiều kim đồng hồ giữa $p_1 = 10^5\\text{ Pa}, p_2 = 3\\cdot 10^5\\text{ Pa}$ và $V_1 = 2\\text{ lít}, V_2 = 5\\text{ lít}$. Công khối khí sinh ra trong 1 chu trình là:',
          options: ['A. $600\\text{ J}$', 'B. $1500\\text{ J}$', 'C. $300\\text{ J}$', 'D. $900\\text{ J}$'],
          correctIndex: 0,
          explanation: 'Diện tích chữ nhật: $A\' = (3 - 1)\\cdot 10^5 \\cdot (5 - 2)\\cdot 10^{-3} = 2\\cdot 10^5 \\cdot 3\\cdot 10^{-3} = 600\\text{ J}$.'
        }
      ],
      miniEssay: {
        id: 'ppro5-s3-e1',
        question: 'Tính hiệu suất của chu trình chữ nhật ở câu hỏi trên đối với $1$ khối khí lý tưởng **đơn nguyên tử** ($C_V = \\frac{3}{2}R$, suy ra $Q_V = \\frac{3}{2}V\\Delta p$ và $Q_p = \\frac{5}{2}p\\Delta V$).',
        hint: 'Chu trình thuận chiều gồm 2 nhánh nhận nhiệt là nhánh đẳng tích tăng áp ($1\\to 2$ ở $V_1$) và nhánh đẳng áp dãn nở ($2\\to 3$ ở $p_2$).',
        rubricChecklist: [
          'Tính $Q_{12} = \\frac{3}{2}V_1(p_2 - p_1) = 1{,}5 \\cdot 2\\cdot 10^{-3} \\cdot 2\\cdot 10^5 = 600\\text{ J}$.',
          'Tính $Q_{23} = \\frac{5}{2}p_2(V_2 - V_1) = 2{,}5 \\cdot 3\\cdot 10^5 \\cdot 3\\cdot 10^{-3} = 2250\\text{ J} \\implies H = \\frac{600}{600 + 2250} \\approx 21{,}05\\%$.'
        ],
        sampleAnswer: 'Đồ thị đi thuận chiều kim đồng hồ: $(p_1, V_1) \\xrightarrow{\\text{đẳng tích}} (p_2, V_1) \\xrightarrow{\\text{đẳng áp}} (p_2, V_2) \\xrightarrow{\\text{đẳng tích}} (p_1, V_2) \\xrightarrow{\\text{đẳng áp}} (p_1, V_1)$. Khí chỉ nhận nhiệt ở 2 nhánh đầu: $Q_{12} = \\frac{3}{2}V_1(p_2 - p_1) = 1{,}5\\cdot 2\\cdot 10^{-3}\\cdot 2\\cdot 10^5 = 600\\text{ J}$; $Q_{23} = \\frac{5}{2}p_2(V_2 - V_1) = 2{,}5\\cdot 3\\cdot 10^5\\cdot 3\\cdot 10^{-3} = 2250\\text{ J}$. Tổng nhiệt nhận $Q_{\\text{nhận}} = 2850\\text{ J}$. Vậy hiệu suất chu trình là $H = \\frac{A\'}{Q_{\\text{nhận}}} = \\frac{600}{2850} \\approx 21{,}1\\%$.'
      }
    }
  ],
  'phys-doppler-effect': [
    {
      stepTitle: '1. Bản chất Hiệu ứng Doppler & Công thức Tổng quát',
      stepType: 'concept',
      conceptSection:
        'Hiệu ứng Doppler là sự thay đổi **tần số (và bước sóng) thu được** so với tần số phát của nguồn khi nguồn sóng và máy thu có chuyển động tương đối với nhau (ví dụ tiếng còi xe cứu thương bổng lên khi tiến lại gần và trầm xuống ngay khi vừa đi qua).',
      formulaSection: {
        primaryFormula: 'f\' = f\\cdot \\frac{v \\pm v_{\\text{thu}}}{v \\mp v_{\\text{nguồn}}}',
        secondaryFormulas: [
          '\\text{Cùng tiến lại gần nhau: tăng tần số } f\' = f\\frac{v + v_{\\text{thu}}}{v - v_{\\text{nguồn}}}',
          '\\text{Cùng đi ra xa nhau: giảm tần số } f\' = f\\frac{v - v_{\\text{thu}}}{v + v_{\\text{nguồn}}}'
        ],
        variablesNote:
          '• $v$: tốc độ truyền sóng trong môi trường ($\\approx 340\\text{ m/s}$ đối với âm thanh).\n• **Mẹo nhớ dấu KHÔNG BAO GIỜ NHẦM**:\n  – Khi tiến **lại gần** nhau $\\implies$ tần số nghe **tăng** $\\implies$ Tử số cộng ($+ v_{\\text{thu}}$), Mẫu số trừ ($- v_{\\text{nguồn}}$)!\n  – Khi đi **ra xa** nhau $\\implies$ tần số nghe **giảm** $\\implies$ Tử số trừ ($- v_{\\text{thu}}$), Mẫu số cộng ($+ v_{\\text{nguồn}}$)!'
      },
      deepDiveSection:
        'Lưu ý sự bất đối xứng thú vị của Doppler âm học: nguồn chạy lại gần máy thu đứng yên cho tần số $f\\frac{v}{v - u}$, lớn hơn một chút so với trường hợp máy thu chạy lại gần nguồn đứng yên $f\\frac{v + u}{v}$ ở cùng tốc độ $u$, bởi vì nguồn chạy làm **nén bước sóng** thực sự phía trước nguồn!',
      teacherExplanation:
        'Luôn tự hỏi: Khoảng cách giữa nguồn và máy thu đang thu hẹp (lại gần $\\to f\' > f$) hay giãn ra (ra xa $\\to f\' < f$) để chọn đúng dấu $+ / -$ ở tử và mẫu.',
      keyTakeaway: 'Tiến lại gần tần số tăng (tử $+$, mẫu $-$); ra xa tần số giảm (tử $-$, mẫu $+$).',
      miniQuiz: [
        {
          id: 'pdop-s1-q1',
          question: 'Xe cứu thương hú còi tần số $f = 680\\text{ Hz}$ chạy với tốc độ $20\\text{ m/s}$ tiến lại gần người đứng yên bên đường ($v_{\\text{âm}} = 340\\text{ m/s}$). Tần số người đó nghe được là:',
          options: ['A. $640\\text{ Hz}$', 'B. $722{,}5\\text{ Hz}$', 'C. $720\\text{ Hz}$', 'D. $642{,}2\\text{ Hz}$'],
          correctIndex: 1,
          explanation: '$f\' = 680 \\cdot \\frac{340}{340 - 20} = 680 \\cdot \\frac{340}{320} = 722{,}5\\text{ Hz}$.'
        },
        {
          id: 'pdop-s1-q2',
          question: 'Khi xe cứu thương đi ngang qua và bắt đầu chạy ra xa người đứng yên, cao độ tiếng còi nghe được sẽ:',
          options: ['A. Tăng lên cao hơn $f$', 'B. Giảm đột ngột xuống thấp hơn $f$', 'C. Không đổi bằng đúng $f$', 'D. Triệt tiêu về $0$'],
          correctIndex: 1,
          explanation: 'Đổi từ lại gần ($f\' > f$) sang ra xa ($f\' < f$) nên tai nghe tiếng còi hạ tông trầm xuống đột ngột.'
        }
      ],
      miniEssay: {
        id: 'pdop-s1-e1',
        question: 'Một người đi xe đạp tốc độ $10\\text{ m/s}$ chạy tiến về phía một còi báo động đứng yên phát âm $f = 680\\text{ Hz}$ ($v_{\\text{âm}} = 340\\text{ m/s}$). Tính tần số âm người đó nghe được và so sánh với trường hợp nguồn chuyển động $10\\text{ m/s}$.',
        hint: 'Người thu chuyển động lại gần: $f_1\' = f\\frac{v + u}{v}$; nguồn chuyển động lại gần: $f_2\' = f\\frac{v}{v - u}$.',
        rubricChecklist: [
          'Tính $f_1\' = 680\\cdot\\frac{340 + 10}{340} = 700\\text{ Hz}$.',
          'Tính $f_2\' = 680\\cdot\\frac{340}{340 - 10} \\approx 700{,}6\\text{ Hz} > 700\\text{ Hz}$ (do bước sóng phía trước nguồn bị nén ngắn hơn).'
        ],
        sampleAnswer: 'Khi người đi xe đạp (máy thu) tiến lại gần còi đứng yên: $f_1\' = f\\frac{v + v_{\\text{thu}}}{v} = 680 \\times \\frac{340 + 10}{340} = 700\\text{ Hz}$. Nếu ngược lại còi tiến lại gần người đứng yên với $10\\text{ m/s}$: $f_2\' = f\\frac{v}{v - v_{\\text{nguồn}}} = 680 \\times \\frac{340}{340 - 10} \\approx 700{,}61\\text{ Hz}$. Hai giá trị gần nhau nhưng $f_2\'$ nhỉnh hơn $f_1\'$ vì chuyển động của nguồn làm bước sóng thực sự bị nén lại trong môi trường.'
      }
    },
    {
      stepTitle: '2. Phản xạ Doppler (Radar Cảnh sát & Siêu âm Y tế)',
      stepType: 'derivation',
      conceptSection:
        'Trong máy bắn tốc độ giao thông hoặc siêu âm tim mạch, sóng phát ra từ máy đứng yên đập vào vật đang chuyển động (ô tô, dòng máu) rồi phản xạ trở lại máy. Quá trình này xảy ra **Hiệu ứng Doppler 2 lần liên tiếp**!',
      formulaSection: {
        primaryFormula: 'f_{\\text{thu về}} = f_0 \\frac{v + u}{v - u} \\approx f_0\\left(1 + \\frac{2u}{v}\\right) \\quad (\\text{vật tiến lại gần với } u \\ll v)',
        secondaryFormulas: [
          '\\Delta f = |f_{\\text{thu về}} - f_0| \\approx \\frac{2 u}{v} f_0 \\quad (\\text{tần số phách radar})'
        ],
        variablesNote:
          '• **Lần 1**: Ô tô đóng vai trò **máy thu** chạy lại gần nguồn đứng yên $\\implies f_1 = f_0\\frac{v+u}{v}$.\n• **Lần 2**: Ô tô đóng vai trò **nguồn phát** phản xạ sóng $f_1$ trong khi chạy lại gần máy thu đứng yên $\\implies f_2 = f_1\\frac{v}{v-u} = f_0\\frac{v+u}{v-u}$.'
      },
      deepDiveSection:
        'Với súng bắn tốc độ dùng sóng vô tuyến ($v = c = 3\\cdot 10^8\\text{ m/s}$), do $u \\ll c$ nên máy thu đo **tần số phách $\\Delta f = f_2 - f_0 = \\frac{2u}{c}f_0$** rồi suy trực tiếp tốc độ xe $u = \\frac{c\\Delta f}{2f_0}$ mà không cần xe phải dừng lại!',
      teacherExplanation:
        'Nhớ hệ số nhân $2$ trong Doppler phản xạ kép: sóng đi gặp vật bị dịch 1 lần, sóng dội về bị dịch thêm 1 lần nữa!',
      keyTakeaway: 'Phản xạ trên vật di chuyển chịu Doppler 2 lần: $\\Delta f \\approx \\frac{2u}{v}f_0$.',
      miniQuiz: [
        {
          id: 'pdop-s2-q1',
          question: 'Một chú dơi đứng yên trên cành cây phát siêu âm $f_0 = 50\\text{ kHz}$ hướng về con mồi đang bay thẳng lại gần với tốc độ $10\\text{ m/s}$ ($v_{\\text{âm}} = 340\\text{ m/s}$). Tần số sóng phản xạ dơi thu được bằng:',
          options: ['A. $50\\cdot \\frac{350}{340}\\text{ kHz}$', 'B. $50\\cdot \\frac{350}{330}\\text{ kHz}$', 'C. $50\\cdot \\frac{330}{350}\\text{ kHz}$', 'D. $50\\cdot \\frac{340}{330}\\text{ kHz}$'],
          correctIndex: 1,
          explanation: 'Dơi nhận phản xạ 2 lần lại gần: $f\' = f_0\\frac{v+u}{v-u} = 50\\cdot\\frac{340+10}{340-10} = 50\\cdot\\frac{350}{330}\\text{ kHz}$.'
        },
        {
          id: 'pdop-s2-q2',
          question: 'Radar giao thông phát sóng điện từ $f_0 = 10\\text{ GHz}$ ($10^{10}\\text{ Hz}$) chiếu vào xe đang chạy thẳng tới gần với tốc độ $30\\text{ m/s}$ ($108\\text{ km/h}$). Độ lệch tần số $\\Delta f$ đo được bằng:',
          options: ['A. $1000\\text{ Hz}$', 'B. $2000\\text{ Hz}$', 'C. $500\\text{ Hz}$', 'D. $3000\\text{ Hz}$'],
          correctIndex: 1,
          explanation: '$\\Delta f = \\frac{2u}{c}f_0 = \\frac{2\\cdot 30}{3\\cdot 10^8}\\cdot 10^{10} = 2000\\text{ Hz}$.'
        }
      ],
      miniEssay: {
        id: 'pdop-s2-e1',
        question: 'Trình bày 2 bước suy ra công thức Doppler phản xạ kép $f_2 = f_0\\frac{v+u}{v-u}$ khi sóng từ máy đứng yên đập vào xe đang chạy thẳng lại gần với tốc độ $u$.',
        hint: 'Tách thành 2 giai đoạn: (1) xe thu sóng từ máy; (2) xe phát sóng phản xạ về lại máy.',
        rubricChecklist: [
          'Giai đoạn 1: xe là máy thu chạy lại gần nguồn đứng yên $\\implies f_1 = f_0\\frac{v+u}{v}$.',
          'Giai đoạn 2: xe là nguồn phát lại tần số $f_1$ tiến lại gần máy đứng yên $\\implies f_2 = f_1\\frac{v}{v-u} = f_0\\frac{v+u}{v-u}$.'
        ],
        sampleAnswer: 'Quá trình gồm 2 chặng: Chặng 1 (máy phát $\\to$ xe): xe đóng vai trò máy thu di chuyển với vận tốc $u$ tiến về nguồn đứng yên, nên tần số sóng đập vào mũi xe là $f_1 = f_0\\frac{v + u}{v}$. Chặng 2 (xe $\\to$ máy thu): bề mặt xe phản xạ lại đúng tần số $f_1$ và đóng vai trò nguồn phát di chuyển tốc độ $u$ tiến lại gần máy thu đứng yên, nên tần số máy thu nhận về là $f_2 = f_1\\frac{v}{v - u} = f_0\\frac{v + u}{v - u}$.'
      }
    },
    {
      stepTitle: '3. Sóng Xung kích Mach & Máy bay Siêu thanh',
      stepType: 'example',
      conceptSection:
        'Khi nguồn phát (máy bay phản lực, viên đạn) bay nhanh hơn tốc độ truyền âm trong không khí ($u > v$), các mặt đầu sóng cầu phát ra trước đó bị bỏ lại phía sau và giao thoa tăng cường dọc theo một **mặt nón sóng xung kích** gọi là nón Mach.',
      formulaSection: {
        primaryFormula: '\\sin\\theta = \\frac{v}{u} = \\frac{1}{M}',
        secondaryFormulas: [
          'M = \\frac{u}{v} \\quad (\\text{chỉ số Mach})'
        ],
        variablesNote:
          '• $\\theta$: nửa góc ở đỉnh của hình nón sóng xung kích (góc giữa đường sinh nón Mach và trục đường bay).\n• Khi mặt nón sóng xung kích quét ngang qua đầu người đứng dưới mặt đất, ta nghe một tiếng **nổ siêu thanh (sonic boom)** cực lớn!'
      },
      deepDiveSection:
        'Lưu ý thú vị: Tiếng nổ siêu thanh KHÔNG phải chỉ xảy ra duy nhất ở khoảnh khắc máy bay vừa vượt ngưỡng Mach 1, mà mặt nón sóng xung kích liên tục kéo theo sau đuôi máy bay suốt cả hành trình bay siêu thanh — ai đứng dưới đường quét của nón sóng đều sẽ nghe thấy 1 tiếng nổ khi biên nón đi qua tai họ!',
      teacherExplanation:
        'Vẽ tam giác vuông với cạnh huyền là quãng đường máy bay đi $u\\cdot t$ và cạnh đối là bán kính sóng âm $v\\cdot t$: tự khắc thấy ngay $\\sin\\theta = v/u$!',
      keyTakeaway: 'Sóng xung kích Mach hình thành khi $u > v$, với nửa góc nón $\\sin\\theta = v/u = 1/\\text{Mach}$.',
      miniQuiz: [
        {
          id: 'pdop-s3-q1',
          question: 'Máy bay tiêm kích bay ngang với tốc độ Mach 2 ($u = 2v_{\\text{âm}}$). Nửa góc ở đỉnh nón sóng xung kích Mach bằng:',
          options: ['A. $60^\\circ$', 'B. $45^\\circ$', 'C. $30^\\circ$', 'D. $15^\\circ$'],
          correctIndex: 2,
          explanation: '$\\sin\\theta = \\frac{v}{u} = \\frac{1}{2} \\implies \\theta = 30^\\circ$.'
        },
        {
          id: 'pdop-s3-q2',
          question: 'Điều kiện cần để một nguồn sóng chuyển động tạo thành mặt nón sóng xung kích Mach là:',
          options: [
            'A. Nguồn chuyển động cùng tốc độ âm ($u = v$)',
            'B. Nguồn chuyển động nhanh hơn tốc độ truyền sóng trong môi trường ($u > v$)',
            'C. Tần số phát phải là siêu âm ($f > 20\\text{ kHz}$)',
            'D. Nguồn bay ngược hướng gió'
          ],
          correctIndex: 1,
          explanation: 'Chỉ khi tốc độ nguồn vượt quá tốc độ lan truyền sóng ($u > v$) thì các mặt đầu sóng mới chồng lấn thành bao hình nón.'
        }
      ],
      miniEssay: {
        id: 'pdop-s3-e1',
        question: 'Một máy bay bay ngang ở độ cao $H = 6800\\text{ m}$ với tốc độ $u = 680\\text{ m/s}$ ($v_{\\text{âm}} = 340\\text{ m/s}$). Hỏi sau khi máy bay bay thẳng qua đỉnh đầu người quan sát được bao lâu thì người đó nghe thấy tiếng nổ xung kích?',
        hint: 'Tính nửa góc nón $\\theta = 30^\\circ$. Tiếng nổ tới tai khi nón sóng quét qua điểm quan sát: máy bay đã bay quá đỉnh đầu đoạn $L = H / \\tan\\theta$.',
        rubricChecklist: [
          'Tính $\\sin\\theta = 340/680 = 0{,}5 \\implies \\theta = 30^\\circ$.',
          'Tính khoảng dịch ngang từ đỉnh đầu $L = H\\cot\\theta = 6800\\sqrt{3}\\text{ m} \\implies t = \\frac{L}{u} = \\frac{6800\\sqrt{3}}{680} = 10\\sqrt{3} \\approx 17{,}3\\text{ s}$.'
        ],
        sampleAnswer: 'Chỉ số Mach $M = u/v = 680/340 = 2$, suy ra nửa góc nón Mach thỏa $\\sin\\theta = 1/2 \\Rightarrow \\theta = 30^\\circ$. Mặt nón sóng hợp với phương bay ngang góc $30^\\circ$, nên khi mép nón chạm tới người quan sát ở dưới mặt đất cách đường bay đoạn $H = 6800\\text{ m}$, máy bay đã vượt qua đỉnh đầu một đoạn ngang $L = \\frac{H}{\\tan 30^\\circ} = 6800\\sqrt{3}\\text{ m}$. Thời gian trễ là $t = \\frac{L}{u} = \\frac{6800\\sqrt{3}}{680} = 10\\sqrt{3} \\approx 17{,}3\\text{ s}$.'
      }
    }
  ]
};
