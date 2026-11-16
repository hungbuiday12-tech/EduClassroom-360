import { LectureStep } from '../types';

export const PHYSICS_CUSTOM_LECTURE_STEPS_9_10: Record<string, LectureStep[]> = {
  'phys-9-optics': [
    {
      stepTitle: '1. Hiện tượng Khúc xạ Ánh sáng & Định luật Khúc xạ',
      stepType: 'concept',
      conceptSection:
        'Khúc xạ ánh sáng là hiện tượng tia sáng truyền xiên góc qua mặt phân cách giữa hai môi trường trong suốt khác nhau bị gãy khúc (đổi phương truyền) do tốc độ ánh sáng trong hai môi trường khác nhau.',
      formulaSection: {
        primaryFormula: 'n_1 \\sin i = n_2 \\sin r',
        secondaryFormulas: [
          'n = \\frac{c}{v} > 1',
          'i_{gh} = \\arcsin\\left(\\frac{n_2}{n_1}\\right) \\quad (n_1 > n_2)'
        ],
        variablesNote:
          '• $i$: góc tới (giữa tia tới và pháp tuyến), $r$: góc khúc xạ.\n• $n_1, n_2$: chiết suất tuyệt đối của môi trường tới và môi trường khúc xạ ($n_{\\text{kk}} \\approx 1$, $n_{\\text{nước}} \\approx 4/3$, $n_{\\text{thủy tinh}} \\approx 1{,}5$).\n• Nếu chiếu vuông góc ($i = 0^\\circ$) thì tia sáng truyền thẳng ($r = 0^\\circ$).'
      },
      deepDiveSection:
        'Khi tia sáng đi từ môi trường chiết quang kém sang chiết quang hơn ($n_1 < n_2$, ví dụ không khí vào nước), $r < i$ (tia khúc xạ lệch gần pháp tuyến hơn). Ngược lại khi $n_1 > n_2$, $r > i$ và nếu $i \\ge i_{gh}$ sẽ xảy ra phản xạ toàn phần.',
      teacherExplanation:
        'Luôn vẽ pháp tuyến vuông góc mặt phân cách tại điểm tới I trước khi xác định góc tới $i$ và góc khúc xạ $r$.',
      keyTakeaway: 'Góc tới và góc khúc xạ luôn đo so với pháp tuyến, không đo so với mặt phân cách.',
      miniQuiz: [
        {
          id: 'p9opt-s1-q1',
          question: 'Tia sáng truyền từ không khí ($n_1 = 1$) vào nước ($n_2 = 4/3$) với góc tới $i = 45^\\circ$. So sánh nào đúng?',
          options: ['A. $r > i$', 'B. $r < i$', 'C. $r = i$', 'D. $r = 90^\\circ$'],
          correctIndex: 1,
          explanation: 'Vì $\\sin r = \\frac{n_1}{n_2}\\sin i = \\frac{3}{4}\\sin 45^\\circ < \\sin 45^\\circ$ nên $r < i$.'
        },
        {
          id: 'p9opt-s1-q2',
          question: 'Khi tia sáng chiếu vuông góc vào mặt nước phẳng lặng ($i = 0^\\circ$), góc khúc xạ $r$ bằng:',
          options: ['A. $90^\\circ$', 'B. $45^\\circ$', 'C. $0^\\circ$', 'D. $30^\\circ$'],
          correctIndex: 2,
          explanation: 'Thay $\\sin 0^\\circ = 0$ vào $n_1\\sin i = n_2\\sin r$ thu được $\\sin r = 0 \\implies r = 0^\\circ$.'
        }
      ],
      miniEssay: {
        id: 'p9opt-s1-e1',
        question: 'Giải thích vì sao khi nhìn xuống bể nước trong, ta thấy đáy bể có vẻ nông hơn so với độ sâu thực.',
        hint: 'Xét tia sáng từ một điểm ở đáy bể đi từ nước ra không khí tới mắt.',
        rubricChecklist: [
          'Nêu tia sáng từ đáy truyền từ nước ($n_1 \\approx 4/3$) ra không khí ($n_2 \\approx 1$) bị khúc xạ ra xa pháp tuyến ($r > i$).',
          'Mắt nhìn theo đường kéo dài của tia khúc xạ ló ra nên thấy ảnh ảo nằm cao hơn đáy thật.'
        ],
        sampleAnswer: 'Tia sáng xuất phát từ đáy bể truyền từ nước sang không khí bị khúc xạ lệch xa pháp tuyến ($r > i$). Mắt người quan sát hứng tia ló và định vị nguồn sáng theo đường kéo dài thẳng của tia ló, giao nhau tại ảnh ảo nằm gần mặt nước hơn đáy thật, nên cảm giác bể nông hơn.'
      }
    },
    {
      stepTitle: '2. Thấu kính Hội tụ & Thấu kính Phân kì',
      stepType: 'derivation',
      conceptSection:
        'Thấu kính là khối chất trong suốt giới hạn bởi hai mặt cong (hoặc một mặt cong, một mặt phẳng). Thấu kính hội tụ có phần rìa mỏng hơn phần giữa; thấu kính phân kì có phần rìa dày hơn phần giữa.',
      formulaSection: {
        primaryFormula: '\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}',
        secondaryFormulas: [
          'k = -\\frac{d\'}{d} = \\frac{\\overline{A\'B\'}}{\\overline{AB}}',
          'D = \\frac{1}{f} \\quad (\\text{đi-ốp, } f \\text{ tính bằng m})'
        ],
        variablesNote:
          '• Thấu kính hội tụ: $f > 0$; thấu kính phân kì: $f < 0$.\n• $d > 0$: khoảng cách vật thật tới quang tâm $O$.\n• $d\' > 0$ là ảnh thật (hứng được trên màn, ngược chiều vật); $d\' < 0$ là ảnh ảo (cùng chiều vật).'
      },
      deepDiveSection:
        'Ba tia sáng đặc biệt để dựng ảnh:\n1. Tia tới qua quang tâm $O$ truyền thẳng.\n2. Tia tới song song trục chính cho tia ló (hoặc đường kéo dài) đi qua tiêu điểm ảnh chính $F\'$.\n3. Tia tới (hoặc đường kéo dài) qua tiêu điểm vật chính $F$ cho tia ló song song trục chính.',
      teacherExplanation:
        'Với thấu kính hội tụ, chỉ khi vật đặt trong khoảng tiêu cự ($d < f$) mới cho ảnh ảo cùng chiều lớn hơn vật (nguyên lý kính lúp). Thấu kính phân kì luôn cho ảnh ảo nhỏ hơn vật.',
      keyTakeaway: 'Ảnh thật luôn ngược chiều vật ($d\' > 0, k < 0$); ảnh ảo luôn cùng chiều vật ($d\' < 0, k > 0$).',
      miniQuiz: [
        {
          id: 'p9opt-s2-q1',
          question: 'Đặt vật sáng trước thấu kính hội tụ có tiêu cự $f = 20\\text{ cm}$ ở vị trí $d = 30\\text{ cm}$. Vị trí ảnh là:',
          options: ['A. Ảnh ảo $d\' = -60\\text{ cm}$', 'B. Ảnh thật $d\' = 60\\text{ cm}$', 'C. Ảnh thật $d\' = 12\\text{ cm}$', 'D. Ảnh ảo $d\' = -12\\text{ cm}$'],
          correctIndex: 1,
          explanation: '$\\frac{1}{d\'} = \\frac{1}{20} - \\frac{1}{30} = \\frac{1}{60} \\implies d\' = 60\\text{ cm} > 0$ (ảnh thật).'
        },
        {
          id: 'p9opt-s2-q2',
          question: 'Vật thật đặt trước thấu kính phân kì luôn cho ảnh có đặc điểm nào sau đây?',
          options: ['A. Ảnh thật, ngược chiều, lớn hơn vật', 'B. Ảnh ảo, cùng chiều, lớn hơn vật', 'C. Ảnh ảo, cùng chiều, nhỏ hơn vật', 'D. Ảnh thật, cùng chiều, nhỏ hơn vật'],
          correctIndex: 2,
          explanation: 'Với $f < 0, d > 0$ thì $d\' = \\frac{df}{d-f} < 0$ và $|d\'| < d$, nên ảnh luôn là ảnh ảo, cùng chiều và nhỏ hơn vật.'
        }
      ],
      miniEssay: {
        id: 'p9opt-s2-e1',
        question: 'Một thấu kính hội tụ tạo ảnh thật cao gấp 2 lần vật trên màn đặt cách vật $90\\text{ cm}$. Tính tiêu cự $f$ của thấu kính.',
        hint: 'Ảnh thật ngược chiều $\\implies k = -2 = -d\'/d$ và khoảng cách vật–ảnh là $d + d\' = 90$.',
        rubricChecklist: [
          'Lập đúng hệ $d\' = 2d$ và $d + d\' = 90 \\implies d = 30\\text{ cm},\\ d\' = 60\\text{ cm}$.',
          'Thay công thức $\\frac{1}{f} = \\frac{1}{30} + \\frac{1}{60}$ tính đúng $f = 20\\text{ cm}$.'
        ],
        sampleAnswer: 'Vì ảnh thật ngược chiều cao gấp 2 lần vật nên $k = -2 \\Rightarrow d\' = 2d$. Khoảng cách vật tới màn là $d + d\' = 90\\text{ cm} \\Rightarrow 3d = 90 \\Rightarrow d = 30\\text{ cm}$, $d\' = 60\\text{ cm}$. Suy ra $\\frac{1}{f} = \\frac{1}{30} + \\frac{1}{60} = \\frac{1}{20} \\Rightarrow f = 20\\text{ cm}$.'
      }
    },
    {
      stepTitle: '3. Kính lúp & Giải bài tập Quang hình tổng hợp',
      stepType: 'example',
      conceptSection:
        'Kính lúp là thấu kính hội tụ có tiêu cự ngắn (vài cm đến vài chục cm), dùng để quan sát vật nhỏ bằng cách đặt vật trong khoảng $d < f$ nhằm tạo ảnh ảo lớn hơn vật.',
      formulaSection: {
        primaryFormula: 'G = \\frac{Đ}{f} = \\frac{25\\text{ cm}}{f\\text{ (cm)}}',
        secondaryFormulas: [
          '\\text{Độ cao ảnh: } A\'B\' = |k| \\cdot AB = \\left|\\frac{d\'}{d}\\right| AB',
          '\\text{Khoảng cách vật – ảnh ảo: } L = |d\'| - d'
        ],
        variablesNote:
          '• $G$: số bội giác ghi trên vành kính lúp (ví dụ $5\\times$, $10\\times$).\n• $Đ = 25\\text{ cm}$: khoảng cực cận chuẩn của mắt tốt.'
      },
      deepDiveSection:
        'Khi thay đổi vị trí vật sao cho ảnh thật dịch chuyển hoặc kích thước ảnh thay đổi theo hệ số $k$, có thể áp dụng tam giác đồng dạng $\\triangle OAB \\sim \\triangle OA\'B\'$ và $\\triangle OF\'I \\sim \\triangle A\'F\'B\'$ để giải bài tập lớp 9 không cần nhớ công thức tổng quát lớp 11.',
      teacherExplanation:
        'Luôn kiểm tra chéo bài toán quang hình bằng cả hai cách: dựng tỉ lệ tam giác đồng dạng (chuẩn KHTN 9) và công thức thấu kính.',
      keyTakeaway: 'Kính lúp có số bội giác $G$ càng lớn thì tiêu cự $f = 25/G$ càng nhỏ.',
      miniQuiz: [
        {
          id: 'p9opt-s3-q1',
          question: 'Trên vành một kính lúp có ghi $5\\times$. Tiêu cự của kính lúp này bằng:',
          options: ['A. $125\\text{ cm}$', 'B. $5\\text{ cm}$', 'C. $20\\text{ cm}$', 'D. $0{,}2\\text{ cm}$'],
          correctIndex: 1,
          explanation: '$f = \\frac{25}{G} = \\frac{25}{5} = 5\\text{ cm}$.'
        },
        {
          id: 'p9opt-s3-q2',
          question: 'Để dùng kính lúp có tiêu cự $f = 10\\text{ cm}$ quan sát vật nhỏ cho ảnh ảo, phải đặt vật cách kính khoảng $d$ thỏa:',
          options: ['A. $d = 20\\text{ cm}$', 'B. $d > 10\\text{ cm}$', 'C. $d < 10\\text{ cm}$', 'D. $d = 10\\text{ cm}$'],
          correctIndex: 2,
          explanation: 'Thấu kính hội tụ chỉ cho ảnh ảo cùng chiều lớn hơn vật khi vật nằm trong tiêu cự ($0 < d < f$).'
        }
      ],
      miniEssay: {
        id: 'p9opt-s3-e1',
        question: 'Dùng kính lúp tiêu cự $f = 10\\text{ cm}$ soi một chữ nhỏ cao $2\\text{ mm}$ đặt cách kính $6\\text{ cm}$. Tính vị trí và chiều cao ảnh.',
        hint: 'Áp dụng công thức thấu kính với $f = 10\\text{ cm}, d = 6\\text{ cm}$.',
        rubricChecklist: [
          'Tính đúng $d\' = \\frac{df}{d-f} = \\frac{60}{-4} = -15\\text{ cm}$ (ảnh ảo cách kính $15\\text{ cm}$).',
          'Tính đúng $h\' = |k|\\cdot h = \\frac{15}{6}\\cdot 2 = 5\\text{ mm}$.'
        ],
        sampleAnswer: 'Áp dụng $\\frac{1}{d\'} = \\frac{1}{f} - \\frac{1}{d} = \\frac{1}{10} - \\frac{1}{6} = -\\frac{1}{15} \\Rightarrow d\' = -15\\text{ cm}$ (ảnh ảo ở cùng phía với vật, cách kính $15\\text{ cm}$). Độ phóng đại $|k| = \\left|\\frac{d\'}{d}\\right| = 2{,}5$, nên chiều cao ảnh là $A\'B\' = 2{,}5 \\times 2 = 5\\text{ mm}$.'
      }
    }
  ],
  'phys-9-math-vec': [
    {
      stepTitle: '1. Lượng giác Tam giác vuông & Chiếu lực lên Trục tọa độ',
      stepType: 'concept',
      conceptSection:
        'Lên Vật lí 10, lực và vận tốc không còn chỉ tác dụng dọc một đường thẳng mà thường hợp góc $\\alpha$ so với phương ngang hoặc mặt phẳng nghiêng. Công cụ sin, cos, tan giúp tách một đại lượng xiên thành hai thành phần vuông góc độc lập.',
      formulaSection: {
        primaryFormula: 'F_x = F\\cos\\alpha, \\quad F_y = F\\sin\\alpha',
        secondaryFormulas: [
          '\\sin^2\\alpha + \\cos^2\\alpha = 1',
          '\\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha} = \\frac{\\text{đối}}{\\text{kề}}'
        ],
        variablesNote:
          '• Góc $\\alpha$ là góc nhọn hợp bởi vectơ $\\vec{F}$ và trục chuẩn $Ox$.\n• Mẹo nhớ: cạnh **kề** góc $\\alpha$ nhân $\\cos\\alpha$, cạnh **đối** góc $\\alpha$ nhân $\\sin\\alpha$.'
      },
      deepDiveSection:
        'Trên mặt phẳng nghiêng góc $\\alpha$, trọng lực $\\vec{P}$ hướng thẳng đứng xuống dưới được phân tích thành:\n• $P_\\parallel = P\\sin\\alpha$ (song song mặt nghiêng, kéo vật trượt xuống).\n• $P_\\perp = P\\cos\\alpha$ (vuông góc mặt nghiêng, nén lên mặt nghiêng).',
      teacherExplanation:
        'Hãy thuộc bộ giá trị đặc biệt $30^\\circ, 45^\\circ, 60^\\circ$ để tính nhẩm nhanh thành phần lực.',
      keyTakeaway: 'Chiếu lên trục kề góc dùng $\\cos$; chiếu lên trục đối góc dùng $\\sin$.',
      miniQuiz: [
        {
          id: 'p9mv-s1-q1',
          question: 'Một lực kéo $F = 20\\text{ N}$ hợp với phương ngang một góc $\\alpha = 60^\\circ$. Thành phần lực kéo theo phương ngang bằng:',
          options: ['A. $10\\sqrt{3}\\text{ N}$', 'B. $10\\text{ N}$', 'C. $20\\text{ N}$', 'D. $40\\text{ N}$'],
          correctIndex: 1,
          explanation: '$F_x = F\\cos 60^\\circ = 20 \\cdot 0{,}5 = 10\\text{ N}$.'
        },
        {
          id: 'p9mv-s1-q2',
          question: 'Vật nặng có trọng lượng $P = 50\\text{ N}$ đặt trên dốc nghiêng góc $30^\\circ$ so với phương ngang. Thành phần trọng lực kéo vật trượt dọc dốc là:',
          options: ['A. $25\\text{ N}$', 'B. $25\\sqrt{3}\\text{ N}$', 'C. $50\\text{ N}$', 'D. $25\\sqrt{2}\\text{ N}$'],
          correctIndex: 0,
          explanation: 'Thành phần song song dốc là $P\\sin 30^\\circ = 50 \\cdot 0{,}5 = 25\\text{ N}$.'
        }
      ],
      miniEssay: {
        id: 'p9mv-s1-e1',
        question: 'Giải thích tại sao khi đẩy hoặc kéo xe nặng trên sàn ngang, kéo xiên lên trên góc $\\alpha$ lại nhẹ hơn đẩy xiên xuống dưới cùng góc $\\alpha$?',
        hint: 'Xét ảnh hưởng của thành phần $F_y$ lên áp lực $N$ và lực ma sát $F_{ms}$.',
        rubricChecklist: [
          'Kéo xiên lên: $F_y$ hướng lên làm giảm áp lực $N = P - F\\sin\\alpha \\implies$ giảm ma sát.',
          'Đẩy xiên xuống: $F_y$ hướng xuống làm tăng áp lực $N = P + F\\sin\\alpha \\implies$ tăng ma sát.'
        ],
        sampleAnswer: 'Khi kéo xiên lên góc $\\alpha$, thành phần thẳng đứng $F\\sin\\alpha$ hướng lên giúp nâng nhẹ vật, làm áp lực $N = P - F\\sin\\alpha$ giảm nên lực ma sát trượt giảm. Ngược lại, đẩy xiên xuống khiến $N = P + F\\sin\\alpha$ tăng lên, lực cản ma sát lớn hơn nên nặng nhọc hơn.'
      }
    },
    {
      stepTitle: '2. Hàm số Bậc nhất & Ý nghĩa Hệ số góc trong Đồ thị Vật lí',
      stepType: 'derivation',
      conceptSection:
        'Nhiều đại lượng Vật lí phụ thuộc tuyến tính theo thời gian như tọa độ chuyển động đều $x = x_0 + vt$ hay vận tốc biến đổi đều $v = v_0 + at$. Việc đọc đồ thị thẳng $y = ax + b$ giúp suy ra trực tiếp vận tốc, gia tốc và trạng thái ban đầu.',
      formulaSection: {
        primaryFormula: 'y = ax + b \\quad\\Longleftrightarrow\\quad x = vt + x_0',
        secondaryFormulas: [
          'a = \\frac{\\Delta y}{\\Delta x} = \\tan\\varphi \\quad (\\text{hệ số góc})',
          'b = y(0) \\quad (\\text{tung độ gốc})'
        ],
        variablesNote:
          '• Trong đồ thị $(x - t)$: hệ số góc là vận tốc $v$, tung độ gốc là tọa độ ban đầu $x_0$.\n• Trong đồ thị $(v - t)$: hệ số góc là gia tốc $a$, tung độ gốc là vận tốc ban đầu $v_0$.'
      },
      deepDiveSection:
        'Nếu đồ thị đi lên từ trái sang phải ($a > 0$), đại lượng đang tăng theo chiều dương; nếu nằm ngang ($a = 0$), đại lượng không đổi; nếu đi xuống ($a < 0$), tốc độ biến thiên mang dấu âm. Giao điểm của hai đường thẳng là thời điểm hai vật gặp nhau (cùng tọa độ hoặc cùng vận tốc).',
      teacherExplanation:
        'Luôn kiểm tra đơn vị của hai trục tọa độ trước khi tính tỉ số $\\Delta y / \\Delta x$.',
      keyTakeaway: 'Độ dốc (hệ số góc) của đồ thị tuyến tính chính là tốc độ biến thiên của đại lượng trục tung.',
      miniQuiz: [
        {
          id: 'p9mv-s2-q1',
          question: 'Phương trình tọa độ của một xe có dạng $x = 15 + 12t$ ($x$ đo bằng m, $t$ đo bằng s). Hệ số góc của đồ thị biểu diễn đại lượng nào?',
          options: ['A. Quãng đường đi sau $15\\text{ s}$', 'B. Tọa độ ban đầu $15\\text{ m}$', 'C. Vận tốc không đổi $12\\text{ m/s}$', 'D. Gia tốc $15\\text{ m/s}^2$'],
          correctIndex: 2,
          explanation: 'So với $y = ax + b$, hệ số góc $a = 12$ ứng với vận tốc $v = 12\\text{ m/s}$.'
        },
        {
          id: 'p9mv-s2-q2',
          question: 'Đồ thị $(v - t)$ của một vật là đoạn thẳng đi qua $(0; 10\\text{ m/s})$ và $(4\\text{ s}; 2\\text{ m/s})$. Hệ số góc bằng:',
          options: ['A. $+2\\text{ m/s}^2$', 'B. $-2\\text{ m/s}^2$', 'C. $+3\\text{ m/s}^2$', 'D. $-4\\text{ m/s}^2$'],
          correctIndex: 1,
          explanation: '$a = \\frac{2 - 10}{4 - 0} = -2\\text{ m/s}^2$.'
        }
      ],
      miniEssay: {
        id: 'p9mv-s2-e1',
        question: 'Cho hai đường thẳng mô tả chuyển động: $x_1 = 20 + 10t$ và $x_2 = 80 - 5t$ (m, s). Nêu ý nghĩa các hệ số và tìm thời điểm hai xe gặp nhau.',
        hint: 'Hai xe gặp nhau khi $x_1 = x_2$.',
        rubricChecklist: [
          'Giải thích đúng xe 1 xuất phát ở $20\\text{ m}$ đi theo chiều dương với $v_1 = 10\\text{ m/s}$; xe 2 xuất phát ở $80\\text{ m}$ đi ngược chiều dương với $v_2 = -5\\text{ m/s}$.',
          'Giải $20 + 10t = 80 - 5t \\implies t = 4\\text{ s}$, vị trí gặp $x = 60\\text{ m}$.'
        ],
        sampleAnswer: 'Xe 1 xuất phát tại $x_{01} = 20\\text{ m}$ chạy theo chiều dương với tốc độ $10\\text{ m/s}$; xe 2 xuất phát tại $x_{02} = 80\\text{ m}$ chạy ngược chiều dương với tốc độ $5\\text{ m/s}$. Gặp nhau khi $20 + 10t = 80 - 5t \\Rightarrow 15t = 60 \\Rightarrow t = 4\\text{ s}$ tại vị trí $x = 60\\text{ m}$.'
      }
    },
    {
      stepTitle: '3. Phép cộng Vectơ & Quy tắc Hình bình hành',
      stepType: 'example',
      conceptSection:
        'Các đại lượng Vật lí có cả độ lớn lẫn hướng (độ dịch chuyển, vận tốc, lực, động lượng) gọi là đại lượng vectơ. Tổng hai vectơ không cộng đại số đơn thuần mà tuân theo quy tắc hình bình hành.',
      formulaSection: {
        primaryFormula: 'F = \\sqrt{F_1^2 + F_2^2 + 2F_1F_2\\cos\\alpha}',
        secondaryFormulas: [
          '|F_1 - F_2| \\le F \\le F_1 + F_2',
          '\\alpha = 90^\\circ \\implies F = \\sqrt{F_1^2 + F_2^2}'
        ],
        variablesNote:
          '• $\\alpha$ là góc hợp bởi hai vectơ $\\vec{F}_1$ và $\\vec{F}_2$.\n• Khi $\\alpha = 0^\\circ$ (cùng hướng): $F = F_1 + F_2$. Khi $\\alpha = 180^\\circ$ (ngược hướng): $F = |F_1 - F_2|$.'
      },
      deepDiveSection:
        'Khi tổng hợp nhiều lực $\\vec{F}_1, \\vec{F}_2, \\vec{F}_3$, ta có thể ghép từng cặp đối xứng hoặc chọn hệ trục $Oxy$ vuông góc, tính $F_x = \\sum F_{ix}$, $F_y = \\sum F_{iy}$ rồi lấy $F = \\sqrt{F_x^2 + F_y^2}$.',
      teacherExplanation:
        'Bất đẳng thức tam giác lực $|F_1 - F_2| \\le F \\le F_1 + F_2$ là công cụ loại đáp án trắc nghiệm nhanh nhất.',
      keyTakeaway: 'Hợp lực của hai lực thành phần luôn nằm trong đoạn $[|F_1 - F_2|;\\, F_1 + F_2]$.',
      miniQuiz: [
        {
          id: 'p9mv-s3-q1',
          question: 'Hai lực đồng quy có độ lớn $6\\text{ N}$ và $8\\text{ N}$ hợp với nhau góc $90^\\circ$. Độ lớn hợp lực bằng:',
          options: ['A. $14\\text{ N}$', 'B. $2\\text{ N}$', 'C. $10\\text{ N}$', 'D. $48\\text{ N}$'],
          correctIndex: 2,
          explanation: 'Vì hai lực vuông góc nên $F = \\sqrt{6^2 + 8^2} = 10\\text{ N}$.'
        },
        {
          id: 'p9mv-s3-q2',
          question: 'Cho hai lực $F_1 = 5\\text{ N}$ và $F_2 = 12\\text{ N}$. Giá trị nào sau đây KHÔNG THỂ là độ lớn hợp lực của chúng?',
          options: ['A. $13\\text{ N}$', 'B. $7\\text{ N}$', 'C. $17\\text{ N}$', 'D. $5\\text{ N}$'],
          correctIndex: 3,
          explanation: 'Hợp lực phải thỏa $|12 - 5| = 7\\text{ N} \\le F \\le 12 + 5 = 17\\text{ N}$, nên $5\\text{ N}$ không thể xảy ra.'
        }
      ],
      miniEssay: {
        id: 'p9mv-s3-e1',
        question: 'Hai lực cùng độ lớn $F_1 = F_2 = 20\\text{ N}$ đồng quy hợp nhau góc $\\alpha = 120^\\circ$. Tính độ lớn hợp lực $F$ và nêu góc của $\\vec{F}$ so với $\\vec{F}_1$.',
        hint: 'Thay $\\cos 120^\\circ = -0{,}5$ vào định lý hàm cosin.',
        rubricChecklist: [
          'Tính đúng $F = \\sqrt{20^2 + 20^2 + 2\\cdot 20\\cdot 20\\cdot(-0{,}5)} = 20\\text{ N}$.',
          'Nhận xét hình thoi đều nên $\\vec{F}$ nằm trên phân giác góc $120^\\circ$, hợp $\\vec{F}_1$ góc $60^\\circ$.'
        ],
        sampleAnswer: 'Áp dụng công thức $F = \\sqrt{20^2 + 20^2 + 2\\cdot 20\\cdot 20\\cos 120^\\circ} = \\sqrt{400 + 400 - 400} = 20\\text{ N}$. Vì $F_1 = F_2$ nên hình bình hành là hình thoi, đường chéo hợp lực là phân giác chia đôi góc $120^\\circ$, tức hợp với $\\vec{F}_1$ một góc $60^\\circ$.'
      }
    }
  ],
  'phys-9-energy-refract': [
    {
      stepTitle: '1. Hiện tượng Tán sắc Ánh sáng qua Lăng kính',
      stepType: 'concept',
      conceptSection:
        'Tán sắc ánh sáng là sự phân tách một chùm ánh sáng phức tạp (như ánh sáng trắng) thành các chùm sáng đơn sắc có màu sắc khác nhau (đỏ, cam, vàng, lục, lam, chàm, tím) khi truyền qua lăng kính.',
      formulaSection: {
        primaryFormula: 'n_{\\text{đỏ}} < n_{\\text{vàng}} < n_{\\text{lục}} < n_{\\text{tím}}',
        secondaryFormulas: [
          'D \\approx (n - 1)A \\quad (\\text{góc lệch nhỏ})',
          '\\lambda_{\\text{đỏ}} \\approx 0{,}76\\,\\mu\\text{m}, \\quad \\lambda_{\\text{tím}} \\approx 0{,}38\\,\\mu\\text{m}'
        ],
        variablesNote:
          '• Ánh sáng đơn sắc là ánh sáng có màu nhất định và KHÔNG bị tán sắc khi qua lăng kính.\n• Ánh sáng đỏ có bước sóng dài nhất, chiết suất nhỏ nhất $\\implies$ lệch ít nhất về đáy lăng kính. Tia tím lệch nhiều nhất.'
      },
      deepDiveSection:
        'Nguyên nhân tán sắc là do chiết suất của chất làm lăng kính (thủy tinh, nước) phụ thuộc vào màu sắc (tần số/bước sóng) ánh sáng. Thí nghiệm Newton chứng minh lăng kính không tự nhuộm màu ánh sáng mà chỉ tách các thành phần vốn có sẵn trong ánh sáng trắng.',
      teacherExplanation:
        'Nhớ thứ tự 7 màu cầu vồng từ lệch ít nhất đến lệch nhiều nhất: Đỏ - Cam - Vàng - Lục - Lam - Chàm - Tím.',
      keyTakeaway: 'Tia đỏ lệch ít nhất, tia tím lệch nhiều nhất; ánh sáng đơn sắc không bị đổi màu qua lăng kính.',
      miniQuiz: [
        {
          id: 'p9er-s1-q1',
          question: 'Khi chiếu chùm ánh sáng trắng hẹp qua lăng kính thủy tinh, tia nào bị lệch nhiều nhất về phía đáy lăng kính?',
          options: ['A. Tia đỏ', 'B. Tia vàng', 'C. Tia lục', 'D. Tia tím'],
          correctIndex: 3,
          explanation: 'Thủy tinh có chiết suất lớn nhất đối với ánh sáng tím nên tia tím bị khúc xạ gãy mạnh nhất.'
        },
        {
          id: 'p9er-s1-q2',
          question: 'Phát biểu nào đúng về ánh sáng đơn sắc?',
          options: [
            'A. Bị tách thành 7 màu khi qua lăng kính',
            'B. Không bị tán sắc khi truyền qua lăng kính',
            'C. Chỉ gồm ánh sáng màu trắng',
            'D. Có tốc độ truyền trong thủy tinh như nhau cho mọi màu'
          ],
          correctIndex: 1,
          explanation: 'Ánh sáng đơn sắc có một bước sóng và một chiết suất xác định trong môi trường, chỉ bị lệch hướng chứ không bị tách màu.'
        }
      ],
      miniEssay: {
        id: 'p9er-s1-e1',
        question: 'Giải thích vì sao sau cơn mưa có nắng, trên bầu trời thường xuất hiện cầu vồng với dải màu từ đỏ đến tím.',
        hint: 'Các giọt nước mưa nhỏ lơ lửng đóng vai trò vừa khúc xạ, tán sắc vừa phản xạ bên trong.',
        rubricChecklist: [
          'Chỉ ra ánh sáng Mặt Trời là ánh sáng trắng đi vào giọt nước bị tán sắc.',
          'Nêu tia sáng phản xạ mặt sau giọt nước rồi ló ra tới mắt theo các góc lệch khác nhau (đỏ trên, tím dưới).'
        ],
        sampleAnswer: 'Hàng triệu giọt nước mưa lơ lửng đóng vai trò như các lăng kính cầu nhỏ. Ánh sáng trắng từ Mặt Trời đi vào giọt nước bị khúc xạ và tán sắc thành các màu đơn sắc, phản xạ ở mặt sau giọt nước rồi khúc xạ ló ra ngoài. Vì tia đỏ và tia tím ló ra theo các góc khác nhau nên mắt thấy dải màu cầu vồng (đỏ ở vòng ngoài, tím ở vòng trong).'
      }
    },
    {
      stepTitle: '2. Màu sắc Vật dưới Ánh sáng & Phản xạ lọc',
      stepType: 'derivation',
      conceptSection:
        'Màu sắc ta nhìn thấy ở một vật không phải bản chất tự phát mà phụ thuộc vào ánh sáng chiếu tới vật và khả năng phản xạ (hoặc truyền qua) các màu đơn sắc của bề mặt vật đó.',
      formulaSection: {
        primaryFormula: '\\text{Màu vật thấy} = \\text{Ánh sáng chiếu tới} \\cap \\text{Ánh sáng vật tán xạ được}',
        secondaryFormulas: [
          '\\text{Vật màu trắng: tán xạ tốt mọi ánh sáng màu}',
          '\\text{Vật màu đen: hấp thụ hầu hết mọi ánh sáng màu}'
        ],
        variablesNote:
          '• Vật màu nào thì tán xạ mạnh ánh sáng màu đó và hấp thụ các màu còn lại.\n• Nếu chiếu ánh sáng đơn sắc đỏ vào tờ giấy xanh lam, tờ giấy hấp thụ tia đỏ $\\implies$ nhìn thấy màu ĐEN.'
      },
      deepDiveSection:
        'Tấm lọc màu hoạt động tương tự theo cơ chế truyền qua: tấm lọc đỏ chỉ cho ánh sáng đỏ đi qua dễ dàng và hấp thụ hầu hết các màu khác. Ứng dụng trong kính lọc chụp ảnh, đèn tín hiệu giao thông và màn hình hiển thị phối màu RGB.',
      teacherExplanation:
        'Không có ánh sáng nào trùng với màu tán xạ của vật thì mắt nhận tín hiệu đen.',
      keyTakeaway: 'Vật đen không phát hay tán xạ màu nào tới mắt; vật trắng tán xạ mọi màu chiếu tới nó.',
      miniQuiz: [
        {
          id: 'p9er-s2-q1',
          question: 'Chiếu ánh sáng đơn sắc màu đỏ vào một quyển vở có bìa màu xanh lục (lục) trong phòng tối. Ta thấy bìa vở có màu gì?',
          options: ['A. Đỏ', 'B. Xanh lục', 'C. Vàng', 'D. Đen'],
          correctIndex: 3,
          explanation: 'Bìa xanh lục hấp thụ ánh sáng đỏ và không có ánh sáng xanh lục để tán xạ ra mắt, nên ta thấy màu đen.'
        },
        {
          id: 'p9er-s2-q2',
          question: 'Chiếu ánh sáng vàng vào một tờ giấy trắng tinh trong phòng tối, tờ giấy có màu:',
          options: ['A. Trắng', 'B. Vàng', 'C. Đen', 'D. Cam'],
          correctIndex: 1,
          explanation: 'Vật màu trắng tán xạ tốt mọi ánh sáng màu chiếu tới nó nên khi chiếu tia vàng, nó tán xạ lại tia vàng.'
        }
      ],
      miniEssay: {
        id: 'p9er-s2-e1',
        question: 'Tại sao mùa hè mặc áo màu trắng lại mát hơn mặc áo màu đen khi đi ngoài nắng?',
        hint: 'Liên hệ giữa khả năng hấp thụ năng lượng ánh sáng Mặt Trời và màu sắc bề mặt.',
        rubricChecklist: [
          'Áo trắng tán xạ/phản xạ hầu hết bức xạ ánh sáng Mặt Trời, hấp thụ nhiệt ít.',
          'Áo đen hấp thụ hầu hết các bức xạ ánh sáng chiếu tới, chuyển hóa thành nhiệt năng làm nóng nhanh.'
        ],
        sampleAnswer: 'Ánh sáng Mặt Trời mang năng lượng nhiệt lớn. Bề mặt áo màu trắng phản xạ (tán xạ) hầu hết các màu ánh sáng nên hấp thụ ít năng lượng bức xạ, giúp cơ thể mát hơn. Trái lại, áo màu đen hấp thụ gần như toàn bộ ánh sáng chiếu tới và chuyển thành nhiệt làm người mặc rất nóng.'
      }
    },
    {
      stepTitle: '3. Định luật Bảo toàn Năng lượng & Tác dụng Nhiệt/Quang',
      stepType: 'example',
      conceptSection:
        'Năng lượng không tự sinh ra và cũng không tự mất đi, nó chỉ truyền từ vật này sang vật khác hoặc chuyển hóa từ dạng này sang dạng khác.',
      formulaSection: {
        primaryFormula: 'E_{\\text{đầu}} = E_{\\text{cuối}} = E_{\\text{có ích}} + E_{\\text{hao phí}}',
        secondaryFormulas: [
          'H = \\frac{E_{\\text{có ích}}}{E_{\\text{toàn phần}}} \\cdot 100\\% < 100\\%'
        ],
        variablesNote:
          '• Năng lượng hao phí thường tỏa ra dưới dạng nhiệt năng (do ma sát, điện trở dây dẫn).\n• Hiệu suất $H$ luôn nhỏ hơn $100\\%$ trong mọi máy móc thực tế.'
      },
      deepDiveSection:
        'Trong các bài toán KHTN 9 kết nối giữa cơ – nhiệt – điện – quang: điện năng tiêu thụ $A = UIt$ có thể chuyển hóa thành nhiệt lượng làm nóng nước $Q = mc\\Delta t$ hoặc công nâng vật $A_{\\text{ích}} = Ph$, từ đó tính được hiệu suất toàn phần.',
      teacherExplanation:
        'Khi làm bài toán bảo toàn năng lượng, liệt kê đủ phần năng lượng có ích và phần tỏa nhiệt hao phí ra môi trường.',
      keyTakeaway: 'Tổng năng lượng toàn phần luôn bảo toàn, hiệu suất thực tế luôn nhỏ hơn 100% do hao phí.',
      miniQuiz: [
        {
          id: 'p9er-s3-q1',
          question: 'Một tấm pin Mặt Trời nhận $1000\\text{ J}$ quang năng mỗi giây và sinh ra $180\\text{ J}$ điện năng. Hiệu suất của pin bằng:',
          options: ['A. $82\\%$', 'B. $18\\%$', 'C. $5{,}5\\%$', 'D. $100\\%$'],
          correctIndex: 1,
          explanation: '$H = \\frac{180}{1000}\\cdot 100\\% = 18\\%$.'
        },
        {
          id: 'p9er-s3-q2',
          question: 'Phát biểu nào sau đây vi phạm Định luật Bảo toàn Năng lượng?',
          options: [
            'A. Quang năng biến đổi thành hóa năng trong lá cây',
            'B. Điện năng biến thành nhiệt năng và quang năng trong bóng đèn',
            'C. Động cơ tự sinh ra công lớn hơn năng lượng nhiên liệu cung cấp mà không nhận thêm nguồn ngoài',
            'D. Thế năng của nước trên đập chuyển thành động năng làm quay tua-bin'
          ],
          correctIndex: 2,
          explanation: 'Không thể có động cơ vĩnh cửu loại 1 tự tạo công lớn hơn năng lượng đầu vào ($H > 100\\%$).'
        }
      ],
      miniEssay: {
        id: 'p9er-s3-e1',
        question: 'Một bếp điện nhận $500\\text{ kJ}$ điện năng để đun nước, nhưng $125\\text{ kJ}$ tỏa ra làm nóng vỏ ấm và không khí xung quanh. Tính nhiệt lượng nước thực nhận và hiệu suất bếp.',
        hint: 'Dùng $E_{\\text{ích}} = E_{\\text{tp}} - E_{\\text{hao phí}}$.',
        rubricChecklist: [
          'Tính đúng nhiệt lượng nước nhận $Q_{\\text{ích}} = 500 - 125 = 375\\text{ kJ}$.',
          'Tính đúng hiệu suất $H = \\frac{375}{500}\\cdot 100\\% = 75\\%$.'
        ],
        sampleAnswer: 'Nhiệt lượng có ích truyền cho nước là $Q_{\\text{ích}} = 500 - 125 = 375\\text{ kJ}$. Hiệu suất của bếp là $H = \\frac{375}{500} \\times 100\\% = 75\\%$.'
      }
    }
  ],
  'phys-9-induction-ac': [
    {
      stepTitle: '1. Hiện tượng Cảm ứng Điện từ & Điều kiện xuất hiện',
      stepType: 'concept',
      conceptSection:
        'Khi số đường sức từ xuyên qua tiết diện $S$ của một cuộn dây dẫn kín biến thiên (tăng hoặc giảm), trong cuộn dây xuất hiện dòng điện gọi là dòng điện cảm ứng.',
      formulaSection: {
        primaryFormula: '\\text{Có dòng cảm ứng} \\iff \\Delta N_{\\text{đường sức}} \\neq 0',
        secondaryFormulas: [
          '\\text{Đưa nam châm lại gần: đường sức tăng} \\implies \\text{có dòng cảm ứng}',
          '\\text{Nam châm đứng yên so với cuộn dây} \\implies I_{\\text{cảm ứng}} = 0'
        ],
        variablesNote:
          '• Có 2 cách làm biến thiên số đường sức từ: dùng nam châm vĩnh cửu chuyển động tương đối với cuộn dây, hoặc dùng nam châm điện đóng/ngắt hoặc biến đổi cường độ dòng điện.'
      },
      deepDiveSection:
        'Lưu ý cực kỳ quan trọng: từ trường mạnh nhưng đứng yên không đổi qua cuộn dây kín KHÔNG tạo ra dòng điện cảm ứng! Chỉ sự **biến thiên** (thay đổi tăng hoặc giảm) số đường sức từ mới sinh ra dòng điện cảm ứng.',
      teacherExplanation:
        'Trong thí nghiệm với nam châm và ống dây, chỉ cần giữ nguyên cả hai đứng yên cạnh nhau là kim điện kế lập tức chỉ số 0.',
      keyTakeaway: 'Điều kiện cần và đủ để có dòng điện cảm ứng trong cuộn dây kín là số đường sức từ xuyên qua tiết diện cuộn dây biến thiên.',
      miniQuiz: [
        {
          id: 'p9ia-s1-q1',
          question: 'Trường hợp nào sau đây KHÔNG xuất hiện dòng điện cảm ứng trong một cuộn dây dẫn kín?',
          options: [
            'A. Đưa cực Bắc nam châm lại gần cuộn dây',
            'B. Rút nam châm ra xa cuộn dây',
            'C. Đặt nam châm nằm yên bên trong lòng cuộn dây',
            'D. Quay cuộn dây cắt ngang các đường sức từ'
          ],
          correctIndex: 2,
          explanation: 'Khi nam châm nằm yên so với cuộn dây, số đường sức từ xuyên qua cuộn dây không thay đổi nên không có dòng cảm ứng.'
        },
        {
          id: 'p9ia-s1-q2',
          question: 'Khi số đường sức từ xuyên qua cuộn dây kín đang tăng rồi chuyển sang giảm, dòng điện cảm ứng sẽ:',
          options: [
            'A. Ngừng chảy ngay lập tức',
            'B. Đổi chiều so với lúc đầu',
            'C. Tăng độ lớn lên vô hạn',
            'D. Giữ nguyên chiều ban đầu'
          ],
          correctIndex: 1,
          explanation: 'Khi chiều biến thiên của số đường sức từ đảo ngược (từ tăng sang giảm), chiều dòng điện cảm ứng cũng đảo ngược.'
        }
      ],
      miniEssay: {
        id: 'p9ia-s1-e1',
        question: 'Giải thích vì sao khi đóng hoặc ngắt công tắc ở cuộn dây sơ cấp có dòng điện một chiều, cuộn dây thứ cấp đặt gần đó lại xuất hiện dòng cảm ứng chớp nhoáng?',
        hint: 'Khi đóng hoặc ngắt mạch, dòng điện và từ trường do cuộn sơ cấp sinh ra thay đổi từ $0 \\to I$ hoặc $I \\to 0$.',
        rubricChecklist: [
          'Lúc đóng/ngắt công tắc, từ trường cuộn sơ cấp thay đổi đột ngột khiến số đường sức qua cuộn thứ cấp biến thiên.',
          'Khi dòng điện ổn định không đổi, từ trường ổn định nên dòng cảm ứng tắt ngay.'
        ],
        sampleAnswer: 'Ở khoảnh khắc đóng hoặc ngắt công tắc, cường độ dòng điện trong cuộn sơ cấp thay đổi nhanh (từ 0 lên giá trị cực đại hoặc ngược lại), làm từ trường và số đường sức từ xuyên qua cuộn thứ cấp biến thiên mạnh $\\rightarrow$ xuất hiện dòng điện cảm ứng trong khoảnh khắc đó rồi tắt khi dòng điện đã ổn định.'
      }
    },
    {
      stepTitle: '2. Dòng điện Xoay chiều & Máy phát điện',
      stepType: 'derivation',
      conceptSection:
        'Dòng điện xoay chiều (AC) là dòng điện có cường độ và chiều luân phiên thay đổi theo thời gian. Tại Việt Nam, mạng điện dân dụng có tần số $f = 50\\text{ Hz}$, nghĩa là dòng điện đổi chiều 100 lần trong 1 giây.',
      formulaSection: {
        primaryFormula: 'T = \\frac{1}{f}, \\quad \\text{Số lần đổi chiều / giây} = 2f',
        secondaryFormulas: [
          'U_{\\text{hiệu dụng}} = 220\\text{ V}, \\quad f = 50\\text{ Hz} \\implies T = 0{,}02\\text{ s}'
        ],
        variablesNote:
          '• Cấu tạo máy phát điện xoay chiều gồm 2 bộ phận chính: cuộn dây dẫn (tạo dòng điện) và nam châm (tạo từ trường).\n• Một bộ phận đứng yên gọi là **stato**, bộ phận quay gọi là **rôto**.'
      },
      deepDiveSection:
        'Khi khung dây quay đều trong từ trường (hoặc nam châm quay trước cuộn dây), nửa vòng đầu số đường sức qua cuộn dây tăng rồi giảm theo một chiều, nửa vòng sau quay ngược mặt lại nên dòng cảm ứng đổi chiều. Điều này giải thích tại sao máy phát điện luôn sinh ra dòng xoay chiều hình sin.',
      teacherExplanation:
        'Nhớ quy tắc $50\\text{ Hz} \\iff 50$ chu kì mỗi giây; mỗi chu kì dòng điện đổi chiều 2 lần nên đổi chiều 100 lần/giây.',
      keyTakeaway: 'Dòng xoay chiều có cả tác dụng nhiệt, phát sáng, từ và đổi chiều liên tục $2f$ lần mỗi giây.',
      miniQuiz: [
        {
          id: 'p9ia-s2-q1',
          question: 'Dòng điện xoay chiều tần số $50\\text{ Hz}$ đổi chiều bao nhiêu lần trong 1 giây?',
          options: ['A. 25 lần', 'B. 50 lần', 'C. 100 lần', 'D. 200 lần'],
          correctIndex: 2,
          explanation: 'Mỗi chu kì dòng xoay chiều đổi chiều 2 lần, nên trong 1 giây (50 chu kì) đổi chiều $2 \\times 50 = 100$ lần.'
        },
        {
          id: 'p9ia-s2-q2',
          question: 'Máy phát điện xoay chiều hoạt động dựa trên nguyên lý vật lí nào?',
          options: [
            'A. Tác dụng hóa học của dòng điện',
            'B. Hiện tượng cảm ứng điện từ',
            'C. Tác dụng nhiệt của điện trở',
            'D. Lực đẩy tĩnh điện Coulomb'
          ],
          correctIndex: 1,
          explanation: 'Rôto quay làm số đường sức từ xuyên qua cuộn dây biến thiên liên tục, sinh ra dòng điện cảm ứng xoay chiều.'
        }
      ],
      miniEssay: {
        id: 'p9ia-s2-e1',
        question: 'So sánh điểm giống và khác nhau cơ bản giữa hai loại máy phát điện xoay chiều (cuộn dây quay và nam châm quay).',
        hint: 'Xét bộ phận tạo dòng, bộ phận tạo từ trường và chi tiết bộ góp điện (vành khuyên – chổi quét).',
        rubricChecklist: [
          'Giống: đều gồm nam châm và cuộn dây, hoạt động dựa trên cảm ứng điện từ.',
          'Khác: máy cuộn dây quay phải có vành khuyên – chổi quét đưa điện ra ngoài; máy nam châm quay lấy điện trực tiếp từ stato cố định (phù hợp công suất lớn).'
        ],
        sampleAnswer: 'Giống nhau: cả hai loại đều có bộ phận chính là nam châm và cuộn dây, hoạt động theo nguyên tắc cảm ứng điện từ. Khác nhau: loại cuộn dây quay cần cặp vành khuyên và chổi quét để lấy điện ra ngoài (dễ mòn, công suất nhỏ); loại nam châm quay (máy phát công nghiệp) lấy điện trực tiếp từ cuộn dây cố định ở vỏ nên truyền tải được dòng điện và điện áp lớn.'
      }
    },
    {
      stepTitle: '3. Máy biến áp & Truyền tải Điện năng đi xa',
      stepType: 'example',
      conceptSection:
        'Trên đường dây truyền tải điện đi xa luôn bị hao phí do tỏa nhiệt theo định luật Jun – Len-xơ. Máy biến áp giúp tăng điện áp lên hàng trăm kV trước khi truyền tải để giảm mạnh công suất hao phí.',
      formulaSection: {
        primaryFormula: '\\frac{U_1}{U_2} = \\frac{n_1}{n_2}, \\qquad P_{\\text{hp}} = \\frac{P^2 R}{U^2}',
        secondaryFormulas: [
          'n_2 > n_1 \\implies \\text{Máy tăng áp} \\quad (U_2 > U_1)',
          'n_2 < n_1 \\implies \\text{Máy hạ áp} \\quad (U_2 < U_1)'
        ],
        variablesNote:
          '• $U_1, n_1$: điện áp và số vòng cuộn sơ cấp; $U_2, n_2$: điện áp và số vòng cuộn thứ cấp.\n• $P_{\\text{hp}}$ tỉ lệ nghịch với **bình phương** điện áp truyền tải $U^2$: tăng $U$ lên $k$ lần thì hao phí giảm $k^2$ lần.'
      },
      deepDiveSection:
        'Tại sao máy biến áp không hoạt động với pin hay ắc quy một chiều không đổi? Vì dòng một chiều không đổi tạo từ trường không đổi qua lõi thép, không làm từ thông qua cuộn thứ cấp biến thiên nên $U_2 = 0$.',
      teacherExplanation:
        'Chú ý tỉ lệ bình phương: tăng $U$ lên 10 lần thì công suất hao phí giảm tới $10^2 = 100$ lần!',
      keyTakeaway: 'Tăng điện áp nơi phát lên $k$ lần sẽ làm hao phí tỏa nhiệt trên dây tải giảm $k^2$ lần.',
      miniQuiz: [
        {
          id: 'p9ia-s3-q1',
          question: 'Một máy biến áp có cuộn sơ cấp 1000 vòng nối vào điện áp $220\\text{ V}$, cuộn thứ cấp 200 vòng. Điện áp ở cuộn thứ cấp bằng:',
          options: ['A. $1100\\text{ V}$', 'B. $44\\text{ V}$', 'C. $22\\text{ V}$', 'D. $440\\text{ V}$'],
          correctIndex: 1,
          explanation: '$U_2 = U_1 \\cdot \\frac{n_2}{n_1} = 220 \\cdot \\frac{200}{1000} = 44\\text{ V}$.'
        },
        {
          id: 'p9ia-s3-q2',
          question: 'Khi truyền tải cùng một công suất điện đi xa, nếu tăng hiệu điện thế ở hai đầu đường dây lên 5 lần thì công suất hao phí trên dây giảm đi:',
          options: ['A. 5 lần', 'B. 10 lần', 'C. 25 lần', 'D. 50 lần'],
          correctIndex: 2,
          explanation: 'Vì $P_{\\text{hp}} = \\frac{P^2R}{U^2}$ nên $U$ tăng 5 lần thì $P_{\\text{hp}}$ giảm $5^2 = 25$ lần.'
        }
      ],
      miniEssay: {
        id: 'p9ia-s3-e1',
        question: 'Tại sao đường dây cao thế truyền tải điện Bắc – Nam dùng điện áp tới $500\\text{ kV}$ mà không truyền thẳng $220\\text{ V}$ dù điện sinh hoạt chỉ cần $220\\text{ V}$?',
        hint: 'So sánh điện trở đường dây dài và công thức $P_{\\text{hp}} = P^2R/U^2$.',
        rubricChecklist: [
          'Chỉ ra nếu truyền ở $220\\text{ V}$, cường độ dòng $I = P/U$ cực lớn, hao phí tỏa nhiệt $I^2R$ tiêu tốn gần hết điện năng.',
          'Dùng máy tăng áp lên $500\\text{ kV}$ giảm $I$ hàng nghìn lần, giảm hao phí hàng triệu lần, tới nơi tiêu thụ dùng máy hạ áp xuống $220\\text{ V}$.'
        ],
        sampleAnswer: 'Đường dây dài hàng nghìn km có điện trở $R$ rất lớn. Nếu truyền ở $220\\text{ V}$, dòng điện $I = P/U$ rất lớn khiến công suất hao phí $P_{\\text{hp}} = P^2R/U^2$ cực cao, dây dẫn nóng chảy và mất hết điện. Tăng áp lên $500\\text{ kV}$ (gấp hơn $2270$ lần) làm hao phí giảm hàng triệu lần, sau đó hạ áp xuống $220\\text{ V}$ ở trạm biến áp khu dân cư.'
      }
    }
  ],
  'phys-9-power-bill': [
    {
      stepTitle: '1. Động năng, Thế năng Trọng trường & Cơ năng',
      stepType: 'concept',
      conceptSection:
        'Động năng là năng lượng vật có được do chuyển động ($v > 0$). Thế năng trọng trường là năng lượng tương tác giữa vật và Trái Đất khi vật ở độ cao $h$ so với mốc chọn trước.',
      formulaSection: {
        primaryFormula: 'W_đ = \\frac{1}{2}mv^2, \\qquad W_t = P\\cdot h = mgh',
        secondaryFormulas: [
          'W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh'
        ],
        variablesNote:
          '• $m$ ($\text{kg}$), $v$ ($\text{m/s}$), $h$ ($\text{m}$), $g \\approx 9{,}8\\text{ m/s}^2$ (hoặc $10\\text{ m/s}^2$).\n• Đơn vị của động năng, thế năng và cơ năng đều là Jun ($\text{J}$).'
      },
      deepDiveSection:
        'Chú ý động năng tỉ lệ với **bình phương** vận tốc: vận tốc tăng gấp đôi thì động năng tăng gấp $4$ lần! Thế năng phụ thuộc vào mốc chọn độ cao (thường chọn mặt đất $h = 0$). Nếu chỉ có trọng lực tác dụng (bỏ qua lực cản), tổng cơ năng bảo toàn không đổi.',
      teacherExplanation:
        'Trước khi tính động năng, luôn đổi tốc độ từ $\\text{km/h}$ sang $\\text{m/s}$ bằng cách chia $3{,}6$.',
      keyTakeaway: 'Động năng phụ thuộc bậc hai vào vận tốc ($v^2$); thế năng phụ thuộc bậc nhất vào độ cao ($h$).',
      miniQuiz: [
        {
          id: 'p9pb-s1-q1',
          question: 'Một ô tô khối lượng $1000\\text{ kg}$ chạy với tốc độ $72\\text{ km/h}$ ($= 20\\text{ m/s}$). Động năng của ô tô là:',
          options: ['A. $20\\,000\\text{ J}$', 'B. $200\\,000\\text{ J}$', 'C. $400\\,000\\text{ J}$', 'D. $10\\,000\\text{ J}$'],
          correctIndex: 1,
          explanation: '$W_đ = \\frac{1}{2}\\cdot 1000 \\cdot 20^2 = 200\\,000\\text{ J} = 200\\text{ kJ}$.'
        },
        {
          id: 'p9pb-s1-q2',
          question: 'Nếu khối lượng vật giữ nguyên nhưng tốc độ tăng lên 3 lần thì động năng của vật tăng lên:',
          options: ['A. 3 lần', 'B. 6 lần', 'C. 9 lần', 'D. Không đổi'],
          correctIndex: 2,
          explanation: 'Vì $W_đ = \\frac{1}{2}mv^2$ nên $v$ tăng 3 lần thì $W_đ$ tăng $3^2 = 9$ lần.'
        }
      ],
      miniEssay: {
        id: 'p9pb-s1-e1',
        question: 'Thả rơi tự do một hòn đá nặng $0{,}5\\text{ kg}$ từ độ cao $20\\text{ m}$ ($g = 10\\text{ m/s}^2$, bỏ qua cản). Tính động năng và vận tốc khi chạm đất.',
        hint: 'Áp dụng bảo toàn cơ năng: toàn bộ thế năng ban đầu chuyển thành động năng cực đại lúc chạm đất.',
        rubricChecklist: [
          'Tính cơ năng ban đầu $W = mgh = 0{,}5 \\cdot 10 \\cdot 20 = 100\\text{ J}$.',
          'Khi chạm đất $W_đ = 100\\text{ J} \\implies v = \\sqrt{2W_đ/m} = 20\\text{ m/s}$.'
        ],
        sampleAnswer: 'Tại độ cao $20\\text{ m}$, vật đứng yên nên cơ năng ban đầu là $W = W_t = mgh = 0{,}5 \\cdot 10 \\cdot 20 = 100\\text{ J}$. Bỏ qua sức cản không khí, khi chạm đất ($h = 0$), toàn bộ thế năng chuyển hóa thành động năng $W_đ = 100\\text{ J}$. Vậy $v = \\sqrt{\\frac{2W_đ}{m}} = \\sqrt{\\frac{200}{0{,}5}} = 20\\text{ m/s}$.'
      }
    },
    {
      stepTitle: '2. Công Cơ học & Công suất',
      stepType: 'derivation',
      conceptSection:
        'Lực chỉ thực hiện công cơ học khi tác dụng lên vật làm vật dịch chuyển theo phương không vuông góc với phương lực. Công suất đo tốc độ sinh công trong một đơn vị thời gian.',
      formulaSection: {
        primaryFormula: 'A = F\\cdot s\\cos\\alpha, \\qquad \\mathscr{P} = \\frac{A}{t} = F\\cdot v',
        secondaryFormulas: [
          '1\\text{ W} = 1\\text{ J/s}, \\quad 1\\text{ kW} = 1000\\text{ W}'
        ],
        variablesNote:
          '• Nếu $\\alpha = 90^\\circ$ (lực vuông góc phương dịch chuyển, ví dụ trọng lực khi xe chạy đường ngang) thì công $A = 0$.\n• Khi kéo vật chuyển động đều tốc độ $v$, công suất tức thời là $\\mathscr{P} = Fv$.'
      },
      deepDiveSection:
        'Người vác bao gạo $50\\text{ kg}$ đi bộ đều trên đường nằm ngang dài $100\\text{ m}$: lực nâng của vai hướng thẳng đứng lên trên, vuông góc với phương chuyển động ngang nên theo định nghĩa vật lí, lực nâng này **không sinh công** ($A = 0$).',
      teacherExplanation:
        'Đừng nhầm công $A$ (J) với công suất $\\mathscr{P}$ (W): hai máy làm cùng một công, máy nào làm xong nhanh hơn thì có công suất lớn hơn.',
      keyTakeaway: 'Lực vuông góc với độ dịch chuyển thì không sinh công; công suất lớn nghĩa là sinh công nhanh.',
      miniQuiz: [
        {
          id: 'p9pb-s2-q1',
          question: 'Cần cẩu nâng đều kiện hàng trọng lượng $4000\\text{ N}$ lên cao $6\\text{ m}$ trong $12\\text{ s}$. Công suất của cần cẩu là:',
          options: ['A. $24\\,000\\text{ W}$', 'B. $2000\\text{ W}$', 'C. $500\\text{ W}$', 'D. $48\\,000\\text{ W}$'],
          correctIndex: 1,
          explanation: 'Công $A = P\\cdot h = 4000\\cdot 6 = 24\\,000\\text{ J}$. Công suất $\\mathscr{P} = \\frac{24\\,000}{12} = 2000\\text{ W}$.'
        },
        {
          id: 'p9pb-s2-q2',
          question: 'Trong chuyển động tròn đều, lực hướng tâm luôn hướng vào tâm quỹ đạo vuông góc với vận tốc tiếp tuyến nên công của lực hướng tâm bằng:',
          options: ['A. $mv^2$', 'B. $2\\pi R F$', 'C. $0$', 'D. $-mv^2/2$'],
          correctIndex: 2,
          explanation: 'Vì $\\vec{F}_{ht} \\perp \\vec{v}$ tại mọi điểm nên $\\cos 90^\\circ = 0 \\implies A = 0$.'
        }
      ],
      miniEssay: {
        id: 'p9pb-s2-e1',
        question: 'Một đầu máy xe lửa kéo đoàn tàu với lực kéo không đổi $40\\,000\\text{ N}$ chạy đều với vận tốc $54\\text{ km/h}$. Tính công suất đầu máy và công thực hiện trong 5 phút.',
        hint: 'Đổi $54\\text{ km/h} = 15\\text{ m/s}$, rồi dùng $\\mathscr{P} = Fv$ và $A = \\mathscr{P}t$.',
        rubricChecklist: [
          'Đổi đúng $v = 15\\text{ m/s}$ và $t = 300\\text{ s}$.',
          'Tính $\\mathscr{P} = 40\\,000 \\cdot 15 = 600\\text{ kW}$, công $A = 600\\,000 \\cdot 300 = 180\\text{ MJ}$.'
        ],
        sampleAnswer: 'Đổi $v = 54/3{,}6 = 15\\text{ m/s}$, $t = 5 \\times 60 = 300\\text{ s}$. Công suất đầu máy là $\\mathscr{P} = Fv = 40\\,000 \\times 15 = 600\\,000\\text{ W} = 600\\text{ kW}$. Công thực hiện trong 5 phút là $A = \\mathscr{P}\\cdot t = 600\\,000 \\times 300 = 180\\,000\\,000\\text{ J} = 180\\text{ MJ}$.'
      }
    },
    {
      stepTitle: '3. Máy cơ đơn giản, Định luật về Công & Hiệu suất',
      stepType: 'example',
      conceptSection:
        'Các máy cơ đơn giản (mặt phẳng nghiêng, ròng rọc động, đòn bẩy) giúp giảm lực kéo cần thiết nhưng KHÔNG máy cơ nào cho ta lợi về công.',
      formulaSection: {
        primaryFormula: 'A_{\\text{ích}} = P\\cdot h, \\qquad A_{\\text{tp}} = F\\cdot s',
        secondaryFormulas: [
          'H = \\frac{A_{\\text{ích}}}{A_{\\text{tp}}} \\cdot 100\\% = \\frac{Ph}{Fs}\\cdot 100\\%',
          'A_{\\text{tp}} = A_{\\text{ích}} + A_{\\text{ms}}'
        ],
        variablesNote:
          '• Nếu được lợi $k$ lần về lực ($F = P/k$ khi bỏ qua ma sát) thì phải thiệt $k$ lần về đường đi ($s = k\\cdot h$).\n• Trong thực tế có ma sát nên $A_{\\text{tp}} > A_{\\text{ích}}$ và $H < 100\\%$.'
      },
      deepDiveSection:
        'Với mặt phẳng nghiêng dài $l$, cao $h$: lực kéo vật lên đều có ma sát là $F = \\frac{Ph}{l} + F_{ms}$. Khi đó phần công vô ích chính là công thắng ma sát $A_{ms} = F_{ms}\\cdot l$.',
      teacherExplanation:
        'Luôn phân biệt rõ: $A_{\\text{ích}} = Ph$ tính theo độ cao nâng thẳng đứng; $A_{\\text{tp}} = Fl$ tính theo lực kéo thực tế nhân quãng đường kéo.',
      keyTakeaway: 'Máy cơ đơn giản có thể lợi lực nhưng luôn thiệt đường đi; công có ích luôn nhỏ hơn công toàn phần.',
      miniQuiz: [
        {
          id: 'p9pb-s3-q1',
          question: 'Dùng mặt phẳng nghiêng dài $4\\text{ m}$ đưa vật nặng $600\\text{ N}$ lên cao $1{,}2\\text{ m}$ bằng lực kéo $225\\text{ N}$. Hiệu suất của mặt phẳng nghiêng bằng:',
          options: ['A. $75\\%$', 'B. $80\\%$', 'C. $85\\%$', 'D. $90\\%$'],
          correctIndex: 1,
          explanation: '$A_{\\text{ích}} = 600\\cdot 1{,}2 = 720\\text{ J}$; $A_{\\text{tp}} = 225\\cdot 4 = 900\\text{ J}$. Vậy $H = \\frac{720}{900} = 80\\%$.'
        },
        {
          id: 'p9pb-s3-q2',
          question: 'Dùng một ròng rọc động lý tưởng (bỏ qua ma sát và khối lượng ròng rọc) để kéo vật lên cao $2\\text{ m}$, đầu dây tự do phải kéo đi đoạn dài:',
          options: ['A. $1\\text{ m}$', 'B. $2\\text{ m}$', 'C. $4\\text{ m}$', 'D. $6\\text{ m}$'],
          correctIndex: 2,
          explanation: 'Ròng rọc động cho lợi 2 lần về lực nên thiệt 2 lần về đường đi: $s = 2h = 4\\text{ m}$.'
        }
      ],
      miniEssay: {
        id: 'p9pb-s3-e1',
        question: 'Kéo thùng hàng $50\\text{ kg}$ lên sàn ô tô cao $1{,}5\\text{ m}$ bằng tấm ván dài $5\\text{ m}$, lực kéo là $200\\text{ N}$ ($g = 10\\text{ m/s}^2$). Tính hiệu suất và lực ma sát trên ván.',
        hint: 'Tính $A_{\\text{ích}} = mgh$, $A_{\\text{tp}} = Fl$, rồi $A_{ms} = A_{\\text{tp}} - A_{\\text{ích}} = F_{ms}l$.',
        rubricChecklist: [
          'Tính $A_{\\text{ích}} = 750\\text{ J}$, $A_{\\text{tp}} = 1000\\text{ J} \\implies H = 75\\%$.',
          'Tính $A_{ms} = 250\\text{ J} \\implies F_{ms} = 250/5 = 50\\text{ N}$.'
        ],
        sampleAnswer: 'Công có ích $A_{\\text{ích}} = P\\cdot h = 500\\cdot 1{,}5 = 750\\text{ J}$. Công toàn phần $A_{\\text{tp}} = F\\cdot l = 200\\cdot 5 = 1000\\text{ J}$. Hiệu suất $H = \\frac{750}{1000} = 75\\%$. Công thắng ma sát $A_{ms} = 1000 - 750 = 250\\text{ J} \\Rightarrow F_{ms} = \\frac{250}{5} = 50\\text{ N}$.'
      }
    }
  ],
  'phys-10-intro-err': [
    {
      stepTitle: '1. Đối tượng Vật lí & Quy tắc An toàn Phòng thí nghiệm',
      stepType: 'concept',
      conceptSection:
        'Vật lí nghiên cứu các dạng vận động cơ bản của vật chất và năng lượng. Hai phương pháp nghiên cứu nền tảng là **phương pháp thực nghiệm** (quan sát – giả thuyết – thí nghiệm kiểm chứng) và **phương pháp mô hình** (mô hình chất điểm, vectơ, đồ thị).',
      formulaSection: {
        primaryFormula: '\\text{Quan sát} \\to \\text{Giả thuyết} \\to \\text{Thí nghiệm} \\to \\text{Kết luận}',
        secondaryFormulas: [
          '7 \\text{ đơn vị SI cơ bản: } \\text{m, kg, s, A, K, mol, cd}'
        ],
        variablesNote:
          '• Luôn kiểm tra điện áp nguồn, ngắt điện trước khi lắp/chỉnh mạch, không chạm tay ướt vào thiết bị điện.\n• Với tia laser không chiếu vào mắt; với nhiệt kế thủy ngân hoặc nguồn nhiệt không đun quá giới hạn.'
      },
      deepDiveSection:
        'Đơn vị dẫn xuất (như $\\text{N} = \\text{kg}\\cdot\\text{m/s}^2$, $\\text{J} = \\text{kg}\\cdot\\text{m}^2/\\text{s}^2$) đều phân tích được về 7 đơn vị cơ bản SI. Kiểm tra thứ nguyên hai vế là cách phát hiện lỗi biến đổi công thức cực nhanh.',
      teacherExplanation:
        'Trong phòng thực hành, tuyệt đối không tự ý cắm nguồn điện trước khi giáo viên hoặc bạn kiểm tra sơ đồ mạch.',
      keyTakeaway: 'Thứ nguyên hai vế của mọi phương trình Vật lí đúng bắt buộc phải trùng nhau.',
      miniQuiz: [
        {
          id: 'p10ie-s1-q1',
          question: 'Đơn vị nào sau đây là một trong 7 đơn vị cơ bản của hệ đo lường quốc tế SI?',
          options: ['A. Niutơn (N)', 'B. Jun (J)', 'C. Kilôgam (kg)', 'D. Oát (W)'],
          correctIndex: 2,
          explanation: 'Kilôgam (kg) là đơn vị cơ bản; N, J, W là các đơn vị dẫn xuất.'
        },
        {
          id: 'p10ie-s1-q2',
          question: 'Thao tác nào an toàn nhất khi thay đổi dây nối trong mạch điện thực hành?',
          options: [
            'A. Giữ nguyên nguồn điện đang bật để thử nhanh',
            'B. Ngắt công tắc/rút nguồn điện trước khi tháo lắp dây',
            'C. Chỉ cần đeo găng vải ẩm',
            'D. Tăng điện áp lên cao hơn để đo rõ hơn'
          ],
          correctIndex: 1,
          explanation: 'Luôn ngắt hoàn toàn nguồn điện trước khi thao tác nối hay điều chỉnh mạch.'
        }
      ],
      miniEssay: {
        id: 'p10ie-s1-e1',
        question: 'Dùng phân tích thứ nguyên kiểm tra xem công thức chu kì con lắc $T = 2\\pi\\sqrt{g/l}$ đúng hay sai.',
        hint: 'Đơn vị của $g$ là $\\text{m/s}^2$, $l$ là $\\text{m}$. Tính đơn vị vế phải.',
        rubricChecklist: [
          'Thay $[g/l] = \\frac{\\text{m/s}^2}{\\text{m}} = \\text{s}^{-2}$.',
          'Lấy căn được $\\text{s}^{-1}$ (tần số), khác với đơn vị giây ($\\text{s}$) của $T \\implies$ công thức sai (phải là $\\sqrt{l/g}$).'
        ],
        sampleAnswer: 'Xét thứ nguyên vế phải: $[g/l] = \\frac{\\text{m/s}^2}{\\text{m}} = \\text{s}^{-2}$, nên $\\left[\\sqrt{g/l}\\right] = \\text{s}^{-1}$, còn chu kì $T$ có đơn vị là $\\text{s}$. Vì hai vế khác thứ nguyên nên công thức sai (dạng đúng phải là $T = 2\\pi\\sqrt{l/g}$).'
      }
    },
    {
      stepTitle: '2. Sai số Hệ thống, Sai số Ngẫu nhiên & Phép đo Trực tiếp',
      stepType: 'derivation',
      conceptSection:
        'Mọi phép đo thực nghiệm đều có sai số. **Sai số hệ thống** xuất phát từ dụng cụ đo (vạch 0 bị lệch, độ chia nhỏ nhất ĐCNN) làm kết quả lệch về một phía; **sai số ngẫu nhiên** do thao tác bấm giờ, gió, mắt đọc không ổn định.',
      formulaSection: {
        primaryFormula: '\\bar{A} = \\frac{A_1 + A_2 + \\dots + A_n}{n}, \\qquad \\Delta A = \\overline{\\Delta A} + \\Delta A_{\\text{dc}}',
        secondaryFormulas: [
          '\\overline{\\Delta A} = \\frac{|\\bar{A}-A_1| + \\dots + |\\bar{A}-A_n|}{n}',
          '\\delta A = \\frac{\\Delta A}{\\bar{A}}\\cdot 100\\%'
        ],
        variablesNote:
          '• $\\Delta A_{\\text{dc}}$: sai số dụng cụ, thường lấy bằng nửa hoặc một độ chia nhỏ nhất (ĐCNN).\n• $\\Delta A$ chỉ viết tối đa **1 hoặc 2 chữ số có nghĩa**, và số thập phân của $\\bar{A}$ phải làm tròn cùng hàng với $\\Delta A$.'
      },
      deepDiveSection:
        'Đo lặp lại nhiều lần rồi lấy trung bình cộng giúp giảm **sai số ngẫu nhiên**, nhưng KHÔNG thể triệt tiêu **sai số hệ thống** (chỉ khắc phục bằng cách hiệu chỉnh vạch 0 hoặc dùng dụng cụ chính xác hơn).',
      teacherExplanation:
        'Khi ghi kết quả $A = \\bar{A} \\pm \\Delta A$, nhớ kiểm tra chữ số sau dấu phẩy của $\\bar{A}$ và $\\Delta A$ phải đồng bộ.',
      keyTakeaway: 'Sai số tuyệt đối $\\Delta A$ cho biết độ bất định; sai số tỉ đối $\\delta A$ cho biết mức độ chính xác của phép đo.',
      miniQuiz: [
        {
          id: 'p10ie-s2-q1',
          question: 'Việc đo thời gian rơi nhiều lần rồi lấy giá trị trung bình nhằm mục đích chính là giảm:',
          options: ['A. Sai số dụng cụ', 'B. Sai số hệ thống', 'C. Sai số ngẫu nhiên', 'D. Sai số làm tròn'],
          correctIndex: 2,
          explanation: 'Đo lặp và lấy trung bình triệt tiêu dần sai lệch ngẫu nhiên qua các lần bấm giờ.'
        },
        {
          id: 'p10ie-s2-q2',
          question: 'Đo đường kính viên bi thu được $d = (20{,}4 \\pm 0{,}2)\\text{ mm}$. Sai số tỉ đối của phép đo xấp xỉ:',
          options: ['A. $0{,}2\\%$', 'B. $1\\%$', 'C. $2\\%$', 'D. $10\\%$'],
          correctIndex: 1,
          explanation: '$\\delta d = \\frac{0{,}2}{20{,}4}\\cdot 100\\% \\approx 0{,}98\\% \\approx 1\\%$.'
        }
      ],
      miniEssay: {
        id: 'p10ie-s2-e1',
        question: 'Đo thời gian rơi của vật 3 lần bằng đồng hồ có sai số dụng cụ $0{,}01\\text{ s}$ được: $0{,}44\\text{ s};\\ 0{,}46\\text{ s};\\ 0{,}45\\text{ s}$. Tính $\\bar{t}$, $\\Delta t$ và viết kết quả đo.',
        hint: 'Tính trung bình $\\bar{t}$, tính sai số tuyệt đối trung bình $\\overline{\\Delta t}$ rồi cộng $\\Delta t_{\\text{dc}}$.',
        rubricChecklist: [
          'Tính $\\bar{t} = 0{,}45\\text{ s}$ và $\\overline{\\Delta t} = \\frac{0{,}01 + 0{,}01 + 0}{3} \\approx 0{,}007\\text{ s}$.',
          'Tổng $\\Delta t = 0{,}007 + 0{,}01 = 0{,}017 \\approx 0{,}02\\text{ s} \\implies t = (0{,}45 \\pm 0{,}02)\\text{ s}$.'
        ],
        sampleAnswer: 'Giá trị trung bình $\\bar{t} = \\frac{0{,}44 + 0{,}46 + 0{,}45}{3} = 0{,}45\\text{ s}$. Sai số ngẫu nhiên trung bình $\\overline{\\Delta t} = \\frac{|0{,}45-0{,}44|+|0{,}45-0{,}46|+|0{,}45-0{,}45|}{3} \\approx 0{,}007\\text{ s}$. Tổng sai số $\\Delta t = 0{,}007 + 0{,}01 = 0{,}017\\text{ s} \\approx 0{,}02\\text{ s}$. Kết quả: $t = (0{,}45 \\pm 0{,}02)\\text{ s}$.'
      }
    },
    {
      stepTitle: '3. Quy tắc Tính Sai số Phép đo Gián tiếp',
      stepType: 'example',
      conceptSection:
        'Khi một đại lượng $F$ không đo trực tiếp mà tính qua công thức từ các đại lượng đo trực tiếp $x, y$ (ví dụ $v = s/t$ hoặc $g = 2h/t^2$), sai số của $F$ được truyền từ sai số của từng biến.',
      formulaSection: {
        primaryFormula: 'F = x \\pm y \\implies \\Delta F = \\Delta x + \\Delta y',
        secondaryFormulas: [
          'F = \\frac{x^a}{y^b} \\implies \\delta F = a\\cdot \\delta x + b\\cdot \\delta y',
          '\\Delta F = \\bar{F}\\cdot \\delta F'
        ],
        variablesNote:
          '• Tổng hoặc hiệu: **cộng sai số tuyệt đối**.\n• Tích, thương, lũy thừa: **cộng sai số tỉ đối** (nhân với số mũ dương).\n• Hằng số chính xác tuyệt đối (như $2, \\pi$) có sai số bằng $0$.'
      },
      deepDiveSection:
        'Ví dụ trong thí nghiệm đo $g = \\frac{2h}{t^2}$: vì $t$ mang bình phương ($t^2$) nên sai số tỉ đối là $\\delta g = \\delta h + 2\\delta t$. Điều này giải thích tại sao sai số bấm giờ $t$ ảnh hưởng gấp đôi đến kết quả $g$!',
      teacherExplanation:
        'Tuyệt đối KHÔNG trừ sai số cho nhau dù công thức là phép trừ hay phép chia: sai số luôn cộng dồn xấu nhất.',
      keyTakeaway: 'Tổng/hiệu cộng sai số tuyệt đối $\\Delta$; tích/thương cộng sai số tỉ đối $\\delta$ (nhân số mũ).',
      miniQuiz: [
        {
          id: 'p10ie-s3-q1',
          question: 'Đo tốc độ trung bình $v = s/t$ với $\\delta s = 1\\%$ và $\\delta t = 2\\%$. Sai số tỉ đối của $v$ là:',
          options: ['A. $1\\%$', 'B. $2\\%$', 'C. $3\\%$', 'D. $0{,}5\\%$'],
          correctIndex: 2,
          explanation: 'Vì $v = s/t$ nên $\\delta v = \\delta s + \\delta t = 1\\% + 2\\% = 3\\%$.'
        },
        {
          id: 'p10ie-s3-q2',
          question: 'Trong công thức $g = \\frac{2h}{t^2}$, nếu $\\delta h = 1\\%$ và $\\delta t = 1{,}5\\%$ thì $\\delta g$ bằng:',
          options: ['A. $2{,}5\\%$', 'B. $4\\%$', 'C. $3{,}5\\%$', 'D. $3\\%$'],
          correctIndex: 1,
          explanation: '$\\delta g = \\delta h + 2\\delta t = 1\\% + 2\\cdot 1{,}5\\% = 4\\%$.'
        }
      ],
      miniEssay: {
        id: 'p10ie-s3-e1',
        question: 'Đo chiều dài $a = (10{,}0 \\pm 0{,}1)\\text{ cm}$ và chiều rộng $b = (5{,}0 \\pm 0{,}1)\\text{ cm}$. Tính sai số tỉ đối và sai số tuyệt đối của diện tích $S = a\\cdot b$.',
        hint: 'Tính $\\bar{S}$, tính $\\delta a, \\delta b$ rồi dùng $\\delta S = \\delta a + \\delta b$.',
        rubricChecklist: [
          'Tính $\\bar{S} = 50{,}0\\text{ cm}^2$, $\\delta a = 1\\%$, $\\delta b = 2\\% \\implies \\delta S = 3\\%$.',
          'Tính $\\Delta S = 50{,}0 \\cdot 3\\% = 1{,}5\\text{ cm}^2 \\implies S = (50{,}0 \\pm 1{,}5)\\text{ cm}^2$.'
        ],
        sampleAnswer: 'Giá trị trung bình $\\bar{S} = 10{,}0 \\times 5{,}0 = 50{,}0\\text{ cm}^2$. Sai số tỉ đối $\\delta a = \\frac{0{,}1}{10{,}0} = 1\\%$, $\\delta b = \\frac{0{,}1}{5{,}0} = 2\\%$. Do $S = ab$ nên $\\delta S = 1\\% + 2\\% = 3\\%$, suy ra $\\Delta S = 50{,}0 \\times 3\\% = 1{,}5\\text{ cm}^2$. Kết quả $S = (50{,}0 \\pm 1{,}5)\\text{ cm}^2$.'
      }
    }
  ],
  'phys-10-uniform': [
    {
      stepTitle: '1. Phân biệt Quãng đường ($s$) và Độ dịch chuyển ($d$)',
      stepType: 'concept',
      conceptSection:
        'Quãng đường ($s$) là độ dài toàn bộ quỹ đạo mà vật đã đi qua (luôn $\\ge 0$, đại lượng vô hướng). Độ dịch chuyển ($\vec{d}$) là vectơ nối từ vị trí đầu tới vị trí cuối, cho biết cả độ dài lẫn hướng dịch chuyển.',
      formulaSection: {
        primaryFormula: 'd = \\Delta x = x_{\\text{cuối}} - x_{\\text{đầu}}',
        secondaryFormulas: [
          '|d| \\le s \\quad (\\text{Dấu } = \\text{ khi đi thẳng không đổi chiều})'
        ],
        variablesNote:
          '• Nếu vật đi khép kín quay lại điểm xuất phát thì độ dịch chuyển $d = 0$, nhưng quãng đường $s > 0$.\n• Khi chuyển động thẳng và luôn cùng một chiều, $d = s$.'
      },
      deepDiveSection:
        'Tương ứng có hai đại lượng:\n• **Tốc độ trung bình**: $v_{tb} = \\frac{s}{t}$ (luôn không âm).\n• **Vận tốc trung bình**: $\\vec{v}_{tb} = \\frac{\\vec{d}}{t}$ (có dấu âm/dương theo chiều chọn trục tọa độ).',
      teacherExplanation:
        'Hãy phân biệt rõ chữ "tốc độ" (theo $s$) và "vận tốc" (theo $\\vec{d}$) — đây là điểm mới quan trọng nhất của GDPT 2018.',
      keyTakeaway: 'Vận tốc gắn với độ dịch chuyển ($\vec{d}/t$); tốc độ gắn với quãng đường ($s/t$).',
      miniQuiz: [
        {
          id: 'p10un-s1-q1',
          question: 'Một vận động viên chạy đúng 1 vòng sân vận động dài $400\\text{ m}$ hết $50\\text{ s}$. Quãng đường và độ lớn độ dịch chuyển lần lượt là:',
          options: ['A. $400\\text{ m}$ và $400\\text{ m}$', 'B. $400\\text{ m}$ và $0\\text{ m}$', 'C. $0\\text{ m}$ và $400\\text{ m}$', 'D. $200\\text{ m}$ và $0\\text{ m}$'],
          correctIndex: 1,
          explanation: 'Chạy 1 vòng tròn thì quãng đường $s = 400\\text{ m}$, nhưng vị trí đầu trùng vị trí cuối nên độ dịch chuyển $d = 0$.'
        },
        {
          id: 'p10un-s1-q2',
          question: 'Một người đi thẳng $30\\text{ m}$ về hướng Đông rồi rẽ vuông góc đi tiếp $40\\text{ m}$ về hướng Bắc. Độ lớn độ dịch chuyển là:',
          options: ['A. $70\\text{ m}$', 'B. $10\\text{ m}$', 'C. $50\\text{ m}$', 'D. $35\\text{ m}$'],
          correctIndex: 2,
          explanation: 'Theo Pythagore: $d = \\sqrt{30^2 + 40^2} = 50\\text{ m}$ (trong khi $s = 70\\text{ m}$).'
        }
      ],
      miniEssay: {
        id: 'p10un-s1-e1',
        question: 'Một xe đi từ A ($x_A = 10\\text{ m}$) đến B ($x_B = 50\\text{ m}$) trong $4\\text{ s}$, rồi quay ngược lại C ($x_C = 20\\text{ m}$) trong $6\\text{ s}$. Tính tốc độ trung bình và vận tốc trung bình cả hành trình.',
        hint: 'Tính tổng quãng đường $s = AB + BC$ và độ dịch chuyển $d = x_C - x_A$.',
        rubricChecklist: [
          'Quãng đường $s = 40 + 30 = 70\\text{ m}$, độ dịch chuyển $d = 20 - 10 = +10\\text{ m}$, tổng $t = 10\\text{ s}$.',
          'Tốc độ trung bình $v_{\\text{tốc}} = 7\\text{ m/s}$, vận tốc trung bình $v = 1\\text{ m/s}$.'
        ],
        sampleAnswer: 'Tổng quãng đường $s = |50-10| + |20-50| = 40 + 30 = 70\\text{ m}$. Độ dịch chuyển $d = x_C - x_A = 20 - 10 = 10\\text{ m}$. Thời gian $t = 4 + 6 = 10\\text{ s}$. Vậy tốc độ trung bình là $70/10 = 7\\text{ m/s}$, còn vận tốc trung bình là $10/10 = 1\\text{ m/s}$.'
      }
    },
    {
      stepTitle: '2. Tổng hợp Độ dịch chuyển & Cộng Vận tốc Cổ điển',
      stepType: 'derivation',
      conceptSection:
        'Khi vật chuyển động trên một hệ quy chiếu đang di chuyển (như thuyền chạy trên dòng nước chảy, người đi bộ trên thang cuốn), vận tốc tuyệt đối so với mặt đất là tổng vectơ vận tốc tương đối và vận tốc kéo theo.',
      formulaSection: {
        primaryFormula: '\\vec{v}_{13} = \\vec{v}_{12} + \\vec{v}_{23}',
        secondaryFormulas: [
          '\\text{Xuôi dòng: } v = v_{\\text{thuyền/nước}} + v_{\\text{nước/bờ}}',
          '\\text{Ngược dòng: } v = |v_{\\text{thuyền/nước}} - v_{\\text{nước/bờ}}|'
        ],
        variablesNote:
          '• Vật 1: vật chuyển động (thuyền); Vật 2: hệ quy chiếu chuyển động (dòng nước); Vật 3: hệ quy chiếu đứng yên (bờ).\n• Nếu $\\vec{v}_{12} \\perp \\vec{v}_{23}$ (lái mũi thuyền vuông góc bờ sông): $v_{13} = \\sqrt{v_{12}^2 + v_{23}^2}$.'
      },
      deepDiveSection:
        'Tương tự, độ dịch chuyển tổng hợp bằng tổng vectơ các độ dịch chuyển thành phần $\\vec{d} = \\vec{d}_1 + \\vec{d}_2$. Để thuyền sang sông theo con đường **ngắn nhất** (vuông góc hai bờ), người lái phải hướng mũi chếch về phía thượng lưu một góc $\\sin\\alpha = v_{\\text{nước}}/v_{\\text{thuyền}}$.',
      teacherExplanation:
        'Mẹo gắn chỉ số 1-2-3 chuẩn xác: đầu nối đuôi $\\vec{v}_{13} = \\vec{v}_{12} + \\vec{v}_{23}$.',
      keyTakeaway: 'Luôn xác định đúng vật 1, hệ chuyển động 2, bờ đứng yên 3 trước khi cộng vectơ vận tốc.',
      miniQuiz: [
        {
          id: 'p10un-s2-q1',
          question: 'Ca nô có tốc độ khi nước đứng yên là $15\\text{ km/h}$ chạy xuôi dòng sông chảy $3\\text{ km/h}$. Tốc độ ca nô so với bờ là:',
          options: ['A. $12\\text{ km/h}$', 'B. $18\\text{ km/h}$', 'C. $15\\text{ km/h}$', 'D. $5\\text{ km/h}$'],
          correctIndex: 1,
          explanation: 'Chạy xuôi dòng nên $v_{13} = v_{12} + v_{23} = 15 + 3 = 18\\text{ km/h}$.'
        },
        {
          id: 'p10un-s2-q2',
          question: 'Một thuyền chạy với vận tốc $4\\text{ m/s}$ so với nước, hướng mũi vuông góc bờ sông có nước chảy $3\\text{ m/s}$. Độ lớn vận tốc thuyền so với bờ là:',
          options: ['A. $7\\text{ m/s}$', 'B. $1\\text{ m/s}$', 'C. $5\\text{ m/s}$', 'D. $3{,}5\\text{ m/s}$'],
          correctIndex: 2,
          explanation: 'Vì hai vectơ vận tốc vuông góc nên $v = \\sqrt{4^2 + 3^2} = 5\\text{ m/s}$.'
        }
      ],
      miniEssay: {
        id: 'p10un-s2-e1',
        question: 'Một sông rộng $120\\text{ m}$, nước chảy $3\\text{ m/s}$. Ca nô có tốc độ riêng $4\\text{ m/s}$ luôn hướng mũi vuông góc bờ. Tính thời gian sang sông và khoảng trôi dạt xuôi dòng.',
        hint: 'Chuyển động ngang sông do $v_{\\text{ca nô}} = 4\\text{ m/s}$ quyết định độc lập; dòng nước đẩy trôi theo phương dọc bờ.',
        rubricChecklist: [
          'Tính thời gian sang sông $t = d / v_{12} = 120 / 4 = 30\\text{ s}$.',
          'Tính độ trôi dạt xuôi dòng $L = v_{23} \\cdot t = 3 \\cdot 30 = 90\\text{ m}$.'
        ],
        sampleAnswer: 'Thành phần vận tốc vuông góc bờ là $v_{12} = 4\\text{ m/s}$, nên thời gian ca nô sang hết bề rộng sông là $t = \\frac{120}{4} = 30\\text{ s}$. Trong $30\\text{ s}$ đó, dòng nước đẩy ca nô trôi dạt dọc bờ đoạn $L = v_{23} \\cdot t = 3 \\times 30 = 90\\text{ m}$.'
      }
    },
    {
      stepTitle: '3. Phân tích Đồ thị Độ dịch chuyển – Thời gian ($d - t$)',
      stepType: 'example',
      conceptSection:
        'Đồ thị $(d - t)$ cho phép đọc trực tiếp trạng thái đứng yên, chuyển động thẳng đều theo chiều dương hoặc ngược chiều dương chỉ qua độ dốc của đường biểu diễn.',
      formulaSection: {
        primaryFormula: 'v = \\frac{d_2 - d_1}{t_2 - t_1} = \\tan\\alpha',
        secondaryFormulas: [
          '\\text{Đoạn nằm ngang } (v = 0): \\text{vật đứng yên}',
          '\\text{Đoạn dốc xuống } (v < 0): \\text{đi ngược chiều dương}'
        ],
        variablesNote:
          '• Nếu đồ thị $(d - t)$ là đường thẳng xiên góc, vận tốc không đổi.\n• Vận tốc tức thời tại một thời điểm trên đồ thị cong bằng hệ số góc tiếp tuyến tại điểm đó.'
      },
      deepDiveSection:
        'Cẩn thận phân biệt đồ thị $(d - t)$ và đồ thị $(v - t)$! Trên đồ thị $(d - t)$, đoạn thẳng nằm ngang nghĩa là **đứng yên** ($v = 0$), còn trên đồ thị $(v - t)$ đoạn nằm ngang lại là **chuyển động thẳng đều** ($v = \\text{const} \\ne 0$).',
      teacherExplanation:
        'Trước khi đọc bất kỳ đồ thị Vật lí nào, hãy đọc ngay tên trục tung và trục hoành.',
      keyTakeaway: 'Độ dốc của đồ thị $(d - t)$ bằng vận tốc; dấu của độ dốc cho biết chiều chuyển động.',
      miniQuiz: [
        {
          id: 'p10un-s3-q1',
          question: 'Trên đồ thị $(d - t)$, một đoạn thẳng nằm ngang song song với trục thời gian biểu thị vật đang:',
          options: ['A. Chuyển động thẳng đều', 'B. Chuyển động nhanh dần', 'C. Đứng yên', 'D. Đi ngược chiều dương'],
          correctIndex: 2,
          explanation: 'Độ dịch chuyển $d$ không đổi theo thời gian chứng tỏ vật đứng yên ($v = 0$).'
        },
        {
          id: 'p10un-s3-q2',
          question: 'Từ $t = 2\\text{ s}$ ($d = 10\\text{ m}$) đến $t = 7\\text{ s}$ ($d = -15\\text{ m}$), vận tốc của vật bằng:',
          options: ['A. $5\\text{ m/s}$', 'B. $-5\\text{ m/s}$', 'C. $1\\text{ m/s}$', 'D. $-3\\text{ m/s}$'],
          correctIndex: 1,
          explanation: '$v = \\frac{-15 - 10}{7 - 2} = \\frac{-25}{5} = -5\\text{ m/s}$.'
        }
      ],
      miniEssay: {
        id: 'p10un-s3-e1',
        question: 'Đồ thị $(d - t)$ của một vật gồm 3 giai đoạn: $0\\to 4\\text{ s}$ đi thẳng lên $d = 20\\text{ m}$; $4\\to 6\\text{ s}$ nằm ngang tại $d = 20\\text{ m}$; $6\\to 10\\text{ s}$ đi thẳng về $d = 0$. Tính vận tốc từng giai đoạn và quãng đường cả $10\\text{ s}$.',
        hint: 'Tính độ dốc $v = \\Delta d / \\Delta t$ trên từng đoạn và cộng độ dài tuyệt đối các lần dịch chuyển.',
        rubricChecklist: [
          'Tính $v_1 = 5\\text{ m/s}$, $v_2 = 0$, $v_3 = (0 - 20)/4 = -5\\text{ m/s}$.',
          'Tổng quãng đường $s = 20 + 0 + 20 = 40\\text{ m}$ (dù độ dịch chuyển cuối bằng 0).'
        ],
        sampleAnswer: 'Giai đoạn 1 ($0\\to 4\\text{ s}$): $v_1 = \\frac{20 - 0}{4 - 0} = 5\\text{ m/s}$. Giai đoạn 2 ($4\\to 6\\text{ s}$): vật đứng yên ($v_2 = 0$). Giai đoạn 3 ($6\\to 10\\text{ s}$): $v_3 = \\frac{0 - 20}{10 - 6} = -5\\text{ m/s}$ (đi ngược chiều về gốc). Tổng quãng đường đi được là $s = 20 + 20 = 40\\text{ m}$.'
      }
    }
  ],
  'phys-10-accel': [
    {
      stepTitle: '1. Gia tốc & Dấu của Gia tốc trong Biến đổi đều',
      stepType: 'concept',
      conceptSection:
        'Gia tốc ($\vec{a}$) đặc trưng cho sự biến thiên nhanh hay chậm của vectơ vận tốc theo thời gian. Trong chuyển động thẳng biến đổi đều, gia tốc có độ lớn và hướng không đổi.',
      formulaSection: {
        primaryFormula: '\\vec{a} = \\frac{\\Delta\\vec{v}}{\\Delta t} = \\frac{\\vec{v} - \\vec{v}_0}{t - t_0}',
        secondaryFormulas: [
          'a\\cdot v > 0 \\iff \\text{Nhanh dần đều}',
          'a\\cdot v < 0 \\iff \\text{Chậm dần đều}'
        ],
        variablesNote:
          '• Đơn vị SI của gia tốc là $\\text{m/s}^2$.\n• **Bẫy kinh điển**: $a < 0$ KHÔNG đồng nghĩa với chậm dần! Nếu vật đang đi theo chiều âm ($v < 0$) và $a < 0$ thì $a\\cdot v > 0 \\implies$ vật chuyển động **nhanh dần** theo chiều âm!'
      },
      deepDiveSection:
        'Từ đồ thị $(v - t)$, gia tốc chính là hệ số góc của đoạn thẳng biểu diễn vận tốc. Đoạn dốc lên có $a > 0$, đoạn dốc xuống có $a < 0$, đoạn nằm ngang có $a = 0$.',
      teacherExplanation:
        'Luôn xét tích $a\\cdot v$ trước khi kết luận nhanh dần hay chậm dần.',
      keyTakeaway: 'Nhanh dần khi $a$ và $v$ cùng dấu ($a\\cdot v > 0$); chậm dần khi $a$ và $v$ trái dấu ($a\\cdot v < 0$).',
      miniQuiz: [
        {
          id: 'p10ac-s1-q1',
          question: 'Một ô tô tăng tốc đều từ $36\\text{ km/h}$ ($10\\text{ m/s}$) lên $72\\text{ km/h}$ ($20\\text{ m/s}$) trong $5\\text{ s}$. Gia tốc của ô tô bằng:',
          options: ['A. $2\\text{ m/s}^2$', 'B. $4\\text{ m/s}^2$', 'C. $10\\text{ m/s}^2$', 'D. $7{,}2\\text{ m/s}^2$'],
          correctIndex: 0,
          explanation: '$a = \\frac{20 - 10}{5} = 2\\text{ m/s}^2$.'
        },
        {
          id: 'p10ac-s1-q2',
          question: 'Vật chuyển động thẳng có $v_0 = -4\\text{ m/s}$ và $a = -2\\text{ m/s}^2$. Đây là chuyển động:',
          options: [
            'A. Chậm dần đều theo chiều âm',
            'B. Nhanh dần đều theo chiều âm',
            'C. Chậm dần đều theo chiều dương',
            'D. Thẳng đều'
          ],
          correctIndex: 1,
          explanation: 'Vì $a$ và $v$ cùng âm nên $a\\cdot v > 0$, tốc độ $|v|$ tăng dần theo chiều âm $\\implies$ nhanh dần đều theo chiều âm.'
        }
      ],
      miniEssay: {
        id: 'p10ac-s1-e1',
        question: 'Tại sao khẳng định "chuyển động chậm dần đều luôn có gia tốc âm ($a < 0$)" là chưa chính xác?',
        hint: 'Xét trường hợp vật đi ngược chiều dương ($v < 0$) và đang hãm phanh.',
        rubricChecklist: [
          'Chỉ ra điều kiện chậm dần là $\\vec{a}$ ngược chiều $\\vec{v}$ ($a\\cdot v < 0$), không phải $a < 0$.',
          'Nêu ví dụ phản chứng: nếu vật đi theo chiều âm ($v < 0$) và hãm phanh chậm dần thì gia tốc mang dấu dương ($a > 0$).'
        ],
        sampleAnswer: 'Chuyển động chậm dần đều xảy ra khi vectơ gia tốc ngược chiều với vectơ vận tốc ($a\\cdot v < 0$). Nếu vật đang chạy ngược chiều dương đã chọn ($v < 0$) mà hãm phanh để chậm lại, thì gia tốc phải hướng theo chiều dương ($a > 0$). Do đó nói chậm dần luôn có $a < 0$ là sai.'
      }
    },
    {
      stepTitle: '2. Bộ 3 Phương trình Vận tốc, Độ dịch chuyển & Độc lập thời gian',
      stepType: 'derivation',
      conceptSection:
        'Chỉ với 3 phương trình động học cơ bản, ta xác định được toàn bộ vị trí, vận tốc, quãng đường tại bất kỳ thời điểm nào của chuyển động thẳng biến đổi đều.',
      formulaSection: {
        primaryFormula: 'd = v_0 t + \\frac{1}{2}at^2, \\qquad v^2 - v_0^2 = 2ad',
        secondaryFormulas: [
          'v = v_0 + at',
          'x = x_0 + v_0 t + \\frac{1}{2}at^2'
        ],
        variablesNote:
          '• Công thức $v^2 - v_0^2 = 2ad$ cực kỳ hữu ích khi đề bài **không cho và không hỏi thời gian** $t$.\n• Khi hãm phanh tới lúc dừng hẳn: $v = 0 \\implies t_{\\text{dừng}} = -v_0/a$, quãng đường phanh $s = -v_0^2/(2a)$.'
      },
      deepDiveSection:
        'Từ đồ thị $(v - t)$, độ dịch chuyển $d$ giữa hai thời điểm $t_1, t_2$ bằng **diện tích hình thang** (hoặc tam giác) giới hạn bởi đường đồ thị và trục hoành $Ot$. Nếu đường đồ thị nằm dưới trục $Ot$, phần diện tích đó mang giá trị âm (vật đi ngược chiều dương).',
      teacherExplanation:
        'Nếu bài có dữ kiện hãm phanh dừng lại, nhớ ngay $v = 0$ để chặn thời gian trước khi vật đổi chiều.',
      keyTakeaway: 'Không có thời gian $t$ hãy gọi ngay công thức độc lập $v^2 - v_0^2 = 2ad$; có đồ thị $(v - t)$ hãy tính diện tích.',
      miniQuiz: [
        {
          id: 'p10ac-s2-q1',
          question: 'Một tàu hỏa đang chạy $20\\text{ m/s}$ thì hãm phanh chậm dần đều với $a = -2\\text{ m/s}^2$. Quãng đường tàu đi thêm được cho đến khi dừng hẳn là:',
          options: ['A. $50\\text{ m}$', 'B. $100\\text{ m}$', 'C. $200\\text{ m}$', 'D. $400\\text{ m}$'],
          correctIndex: 1,
          explanation: 'Dùng $0^2 - 20^2 = 2(-2)d \\implies d = \\frac{400}{4} = 100\\text{ m}$.'
        },
        {
          id: 'p10ac-s2-q2',
          question: 'Đồ thị $(v - t)$ của một vật tăng tốc đều từ $v_0 = 0$ đến $v = 12\\text{ m/s}$ trong $6\\text{ s}$. Diện tích tam giác dưới đường đồ thị bằng:',
          options: ['A. $72\\text{ m}$', 'B. $36\\text{ m}$', 'C. $24\\text{ m}$', 'D. $18\\text{ m}$'],
          correctIndex: 1,
          explanation: 'Diện tích tam giác $d = \\frac{1}{2}\\cdot 6\\cdot 12 = 36\\text{ m}$.'
        }
      ],
      miniEssay: {
        id: 'p10ac-s2-e1',
        question: 'Xe bắt đầu khởi hành nhanh dần đều, trong $4\\text{ s}$ đầu đi được $32\\text{ m}$. Tính gia tốc của xe và quãng đường xe đi được trong giây thứ 4.',
        hint: 'Dùng $s(4) = \\frac{1}{2}a\\cdot 4^2$ tìm $a$, rồi tính $\\Delta s_4 = s(4) - s(3)$.',
        rubricChecklist: [
          'Từ $32 = \\frac{1}{2}a\\cdot 16$ tính đúng $a = 4\\text{ m/s}^2$.',
          'Tính $s(3) = \\frac{1}{2}\\cdot 4\\cdot 9 = 18\\text{ m}$, suy ra quãng đường trong giây thứ 4 là $32 - 18 = 14\\text{ m}$.'
        ],
        sampleAnswer: 'Vì xe khởi hành nên $v_0 = 0$. Từ $s(4) = \\frac{1}{2}a(4)^2 = 32 \\Rightarrow 8a = 32 \\Rightarrow a = 4\\text{ m/s}^2$. Quãng đường trong $3\\text{ s}$ đầu là $s(3) = \\frac{1}{2}\\cdot 4\\cdot 3^2 = 18\\text{ m}$. Do đó quãng đường đi trong giây thứ 4 là $\\Delta s_4 = s(4) - s(3) = 32 - 18 = 14\\text{ m}$.'
      }
    },
    {
      stepTitle: '3. Phân biệt Đồ thị $(v - t)$ và Bài toán Chuyển động Nhiều giai đoạn',
      stepType: 'example',
      conceptSection:
        'Trong thực tế, xe thường trải qua 3 giai đoạn: tăng tốc nhanh dần đều $\\rightarrow$ chạy thẳng đều $\\rightarrow$ hãm phanh chậm dần đều. Phân tích theo đồ thị $(v - t)$ giúp giải nhanh gấp 3 lần cách lập hệ phương trình rời rạc.',
      formulaSection: {
        primaryFormula: 's_{\\text{tổng}} = \\text{Diện tích hình thang } (v - t)',
        secondaryFormulas: [
          '\\Delta s_k = s(k) - s(k-1) = v_0 + a\\left(k - \\frac{1}{2}\\right)'
        ],
        variablesNote:
          '• Lưu ý đọc nhầm "trong 4 giây" ($s(4)$) với "trong giây thứ 4" ($s(4) - s(3)$).\n• Nếu vật chuyển động từ nghỉ nhanh dần đều rồi phanh dừng hẳn, tỉ lệ quãng đường tỉ lệ nghịch với độ lớn gia tốc: $s_1/s_2 = |a_2|/|a_1|$.'
      },
      deepDiveSection:
        'Từ trạng thái nghỉ ($v_0 = 0$) đi nhanh dần đều với gia tốc $a$, quãng đường đi được trong các khoảng thời gian bằng nhau liên tiếp tuân theo tỉ lệ số lẻ $1 : 3 : 5 : 7 : \\dots$ (đây là quy luật Galileo kinh điển dùng kiểm tra nhanh kết quả trắc nghiệm).',
      teacherExplanation:
        'Hãy phác thảo nhanh trục $(v - t)$ hình thang cho mọi bài toán chạy nhiều giai đoạn — mọi dữ kiện sẽ tự hiện ra rõ mồn một.',
      keyTakeaway: 'Với bài nhiều giai đoạn nối tiếp, phác đồ thị $(v - t)$ và tính diện tích là phương án ngắn nhất.',
      miniQuiz: [
        {
          id: 'p10ac-s3-q1',
          question: 'Một vật bắt đầu đi nhanh dần đều từ trạng thái nghỉ, trong giây thứ nhất đi được $2\\text{ m}$. Trong giây thứ ba vật đi được:',
          options: ['A. $6\\text{ m}$', 'B. $10\\text{ m}$', 'C. $18\\text{ m}$', 'D. $4\\text{ m}$'],
          correctIndex: 1,
          explanation: 'Theo quy luật số lẻ $1 : 3 : 5$, giây thứ 3 đi gấp 5 lần giây thứ nhất: $5 \\times 2 = 10\\text{ m}$.'
        },
        {
          id: 'p10ac-s3-q2',
          question: 'Thang máy lên tầng từ nghỉ với gia tốc $2\\text{ m/s}^2$ trong $3\\text{ s}$, chạy đều $4\\text{ s}$, rồi phanh đều trong $2\\text{ s}$ thì dừng. Vận tốc cực đại đạt được là:',
          options: ['A. $4\\text{ m/s}$', 'B. $6\\text{ m/s}$', 'C. $8\\text{ m/s}$', 'D. $12\\text{ m/s}$'],
          correctIndex: 1,
          explanation: '$v_{\\max} = a_1 t_1 = 2 \\cdot 3 = 6\\text{ m/s}$.'
        }
      ],
      miniEssay: {
        id: 'p10ac-s3-e1',
        question: 'Tính tổng quãng đường đi lên của thang máy ở câu hỏi trên bằng phương pháp diện tích đồ thị $(v - t)$.',
        hint: 'Đồ thị $(v - t)$ là hình thang có đáy lớn $t_{\\text{tổng}} = 3 + 4 + 2 = 9\\text{ s}$, đáy nhỏ $4\\text{ s}$, chiều cao $v_{\\max} = 6\\text{ m/s}$.',
        rubricChecklist: [
          'Xác định đúng đáy lớn $9\\text{ s}$, đáy nhỏ $4\\text{ s}$ và chiều cao $6\\text{ m/s}$.',
          'Tính diện tích hình thang $s = \\frac{(9 + 4)\\cdot 6}{2} = 39\\text{ m}$.'
        ],
        sampleAnswer: 'Đồ thị $(v - t)$ là một hình thang có đáy lớn bằng tổng thời gian $3 + 4 + 2 = 9\\text{ s}$, đáy nhỏ là giai đoạn chạy đều $4\\text{ s}$, và chiều cao bằng $v_{\\max} = 6\\text{ m/s}$. Tổng quãng đường đi được bằng diện tích hình thang: $s = \\frac{(9 + 4)\\times 6}{2} = 39\\text{ m}$.'
      }
    }
  ],
  'phys-10-newton-energy': [
    {
      stepTitle: '1. Ba Định luật Newton & Hợp lực trên Mặt phẳng nghiêng',
      stepType: 'concept',
      conceptSection:
        'Ba định luật Newton liên kết nguyên nhân (lực tác dụng) với kết quả (gia tốc chuyển động): Vật chỉ giữ nguyên trạng thái chuyển động thẳng đều hoặc đứng yên khi hợp lực tác dụng bằng 0.',
      formulaSection: {
        primaryFormula: '\\sum \\vec{F} = m\\vec{a}, \\qquad \\vec{F}_{AB} = -\\vec{F}_{BA}',
        secondaryFormulas: [
          'F_{ms} = \\mu N',
          '\\text{Trên mặt phẳng nghiêng góc } \\alpha: N = P\\cos\\alpha \\implies a = g(\\sin\\alpha - \\mu\\cos\\alpha)'
        ],
        variablesNote:
          '• **Cặp lực trực đối** (Định luật III) đặt vào **hai vật khác nhau** nên KHÔNG triệt tiêu nhau (khác với hai lực cân bằng đặt lên cùng một vật).\n• Quán tính tỉ lệ thuận với khối lượng $m$ của vật.'
      },
      deepDiveSection:
        'Quy trình chuẩn giải mọi bài toán Định luật II Newton:\n1. Chọn hệ trục $Oxy$ (Ox theo hướng chuyển động, Oy vuông góc mặt tiếp xúc).\n2. Vẽ đủ các lực: Trọng lực $\\vec{P}$, Phản lực $\\vec{N}$, Ma sát $\\vec{F}_{ms}$, Lực kéo $\\vec{F}_k$.\n3. Chiếu lên $Oy$ tìm $N \\implies F_{ms} = \\mu N$; chiếu lên $Ox$ tìm gia tốc $a$.',
      teacherExplanation:
        'Đừng bao giờ mặc định $N = P$! Nếu lực kéo xiên góc hoặc vật nằm trên mặt nghiêng thì $N \\ne P$.',
      keyTakeaway: 'Chiếu trục $Oy$ tìm áp lực $N$ trước, rồi mới tính ma sát và chiếu trục $Ox$ tìm $a$.',
      miniQuiz: [
        {
          id: 'p10ne-s1-q1',
          question: 'Một khối gỗ $m = 2\\text{ kg}$ trượt trên sàn ngang với hệ số ma sát $\\mu = 0{,}2$ ($g = 10\\text{ m/s}^2$) dưới tác dụng lực kéo ngang $F = 10\\text{ N}$. Gia tốc của vật bằng:',
          options: ['A. $5\\text{ m/s}^2$', 'B. $3\\text{ m/s}^2$', 'C. $2\\text{ m/s}^2$', 'D. $7\\text{ m/s}^2$'],
          correctIndex: 1,
          explanation: '$F_{ms} = \\mu mg = 0{,}2 \\cdot 2 \\cdot 10 = 4\\text{ N}$. Theo ĐL II: $a = \\frac{10 - 4}{2} = 3\\text{ m/s}^2$.'
        },
        {
          id: 'p10ne-s1-q2',
          question: 'Khi ô tô đâm vào bức tường, lực do ô tô tác dụng lên tường và lực do tường tác dụng lên ô tô có đặc điểm nào?',
          options: [
            'A. Lực của tường lớn hơn lực ô tô nên ô tô bị bẹp',
            'B. Hai lực cùng độ lớn, ngược chiều và đặt lên hai vật khác nhau',
            'C. Hai lực cân bằng đặt lên cùng ô tô',
            'D. Lực ô tô lớn hơn lực tường'
          ],
          correctIndex: 1,
          explanation: 'Theo Định luật III Newton, hai lực tương tác luôn bằng nhau về độ lớn và ngược chiều.'
        }
      ],
      miniEssay: {
        id: 'p10ne-s1-e1',
        question: 'Thả một vật trượt từ đỉnh dốc nghiêng $30^\\circ$ với hệ số ma sát $\\mu = 0{,}2\\sqrt{3}$ ($g = 10\\text{ m/s}^2$). Tính gia tốc trượt xuống dốc của vật.',
        hint: 'Dùng $a = g(\\sin\\alpha - \\mu\\cos\\alpha)$ với $\\sin 30^\\circ = 0{,}5$, $\\cos 30^\\circ = \\sqrt{3}/2$.',
        rubricChecklist: [
          'Tính đúng $N = mg\\cos 30^\\circ \\implies F_{ms} = \\mu mg\\cos 30^\\circ$.',
          'Thay số tính đúng $a = 10(0{,}5 - 0{,}2\\sqrt{3} \\cdot \\frac{\\sqrt{3}}{2}) = 10(0{,}5 - 0{,}3) = 2\\text{ m/s}^2$.'
        ],
        sampleAnswer: 'Chiếu vuông góc mặt nghiêng: $N = P\\cos 30^\\circ = mg\\frac{\\sqrt{3}}{2}$. Lực ma sát $F_{ms} = \\mu N = 0{,}2\\sqrt{3} \\cdot mg\\frac{\\sqrt{3}}{2} = 0{,}3mg$. Chiếu dọc dốc: $ma = P\\sin 30^\\circ - F_{ms} = 0{,}5mg - 0{,}3mg = 0{,}2mg \\Rightarrow a = 0{,}2\\cdot 10 = 2\\text{ m/s}^2$.'
      }
    },
    {
      stepTitle: '2. Động lượng, Xung lượng của Lực & Định luật Bảo toàn Động lượng',
      stepType: 'derivation',
      conceptSection:
        'Động lượng $\\vec{p} = m\\vec{v}$ đặc trưng cho khả năng truyền chuyển động khi va chạm. Trong một hệ cô lập (tổng ngoại lực bằng 0), tổng vectơ động lượng trước và sau va chạm luôn bảo toàn.',
      formulaSection: {
        primaryFormula: '\\vec{p} = m\\vec{v}, \\qquad \\vec{F}\\Delta t = \\Delta\\vec{p}',
        secondaryFormulas: [
          'm_1\\vec{v}_1 + m_2\\vec{v}_2 = m_1\\vec{v}_1\' + m_2\\vec{v}_2\'',
          '\\text{Va chạm mềm: } V = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}'
        ],
        variablesNote:
          '• Đơn vị động lượng là $\\text{kg}\\cdot\\text{m/s}$ (tương đương $\\text{N}\\cdot\\text{s}$).\n• Cẩn thận **dấu âm** của vận tốc khi hai vật chuyển động ngược chiều nhau trước hoặc sau va chạm!'
      },
      deepDiveSection:
        'Tại sao túi khí ô tô, đệm nhảy cao hay mũ bảo hiểm có lớp xốp dày lại giúp giảm chấn thương? Theo $\\vec{F} = \\Delta\\vec{p}/\\Delta t$, lượng biến thiên động lượng $\\Delta p$ không đổi nhưng lớp đệm làm tăng thời gian va chạm $\\Delta t$, qua đó giảm mạnh lực va đập $F$ lên cơ thể.',
      teacherExplanation:
        'Nếu bài chỉ yêu cầu tìm vận tốc sau va chạm mềm hoặc chuyển động bằng phản lực (bắn súng, tên lửa), dùng ngay bảo toàn động lượng.',
      keyTakeaway: 'Động lượng là đại lượng VECTƠ; khi chiếu lên một trục phải giữ đúng dấu vận tốc.',
      miniQuiz: [
        {
          id: 'p10ne-s2-q1',
          question: 'Viên bi $m_1 = 2\\text{ kg}$ chạy tốc độ $3\\text{ m/s}$ đến va chạm mềm (dính chặt) vào bi $m_2 = 1\\text{ kg}$ đang đứng yên. Tốc độ hai bi sau va chạm là:',
          options: ['A. $1{,}5\\text{ m/s}$', 'B. $2\\text{ m/s}$', 'C. $3\\text{ m/s}$', 'D. $6\\text{ m/s}$'],
          correctIndex: 1,
          explanation: '$V = \\frac{2\\cdot 3 + 1\\cdot 0}{2 + 1} = 2\\text{ m/s}$.'
        },
        {
          id: 'p10ne-s2-q2',
          question: 'Một khẩu pháo khối lượng $M = 500\\text{ kg}$ bắn ngang viên đạn $m = 2\\text{ kg}$ ra khỏi nòng với vận tốc $250\\text{ m/s}$. Tốc độ giật lùi của pháo là:',
          options: ['A. $1\\text{ m/s}$', 'B. $2\\text{ m/s}$', 'C. $0{,}5\\text{ m/s}$', 'D. $5\\text{ m/s}$'],
          correctIndex: 0,
          explanation: 'Bảo toàn động lượng: $MV = mv \\implies V = \\frac{2\\cdot 250}{500} = 1\\text{ m/s}$.'
        }
      ],
      miniEssay: {
        id: 'p10ne-s2-e1',
        question: 'Một quả bóng $0{,}4\\text{ kg}$ bay vuông góc vào tường với tốc độ $10\\text{ m/s}$ rồi bật ngược trở lại đúng tốc độ $10\\text{ m/s}$ trong thời gian va chạm $0{,}04\\text{ s}$. Tính lực tường tác dụng lên bóng.',
        hint: 'Vì bật ngược lại nên $\\Delta p = |p\' - p| = | -mv - mv | = 2mv$.',
        rubricChecklist: [
          'Xác định đúng độ biến thiên động lượng $|\\Delta p| = 2mv = 2 \\cdot 0{,}4 \\cdot 10 = 8\\text{ kg}\\cdot\\text{m/s}$ (tránh lỗi cho $\\Delta p = 0$).',
          'Tính lực trung bình $F = \\frac{|\\Delta p|}{\\Delta t} = \\frac{8}{0{,}04} = 200\\text{ N}$.'
        ],
        sampleAnswer: 'Chọn chiều dương là chiều bật ra của bóng: trước va chạm $v = -10\\text{ m/s}$, sau va chạm $v\' = +10\\text{ m/s}$. Độ biến thiên động lượng là $\\Delta p = m(v\' - v) = 0{,}4(10 - (-10)) = 8\\text{ kg}\\cdot\\text{m/s}$. Lực trung bình tường tác dụng lên bóng là $F = \\frac{\\Delta p}{\\Delta t} = \\frac{8}{0{,}04} = 200\\text{ N}$.'
      }
    },
    {
      stepTitle: '3. Định lý Động năng & Bảo toàn Cơ năng',
      stepType: 'example',
      conceptSection:
        'Định lý Động năng giúp giải các bài toán có lực ma sát hoặc lực thay đổi cực nhanh mà không cần tính gia tốc và thời gian trung gian: độ biến thiên động năng bằng tổng công của các ngoại lực.',
      formulaSection: {
        primaryFormula: '\\Delta W_đ = W_{đ2} - W_{đ1} = \\sum A_{\\text{ngoại lực}}',
        secondaryFormulas: [
          '\\text{Không ma sát: } \\frac{1}{2}mv_1^2 + mgh_1 = \\frac{1}{2}mv_2^2 + mgh_2',
          '\\text{Có ma sát: } W_2 - W_1 = A_{F_{\\text{ms}}} < 0'
        ],
        variablesNote:
          '• Trọng lực và lực đàn hồi là **lực thế** (bảo toàn cơ năng).\n• Lực ma sát và lực cản không phải lực thế: công của chúng làm **giảm cơ năng** (biến thành nhiệt).'
      },
      deepDiveSection:
        'Trong bài toán va chạm mềm (hai vật dính vào nhau), **động lượng luôn bảo toàn** nhưng **cơ năng KHÔNG bảo toàn** (một phần động năng bị biến thành nhiệt năng tỏa ra tại chỗ va chạm). Đây là bẫy hay gặp khi giải bài con lắc đạn đạo!',
      teacherExplanation:
        'Gặp bài con lắc đạn đạo gồm 2 pha: pha va chạm dùng Bảo toàn Động lượng, pha văng lên cao dùng Bảo toàn Cơ năng.',
      keyTakeaway: 'Cần tìm quãng đường phanh hay tốc độ sau khi vượt dốc có ma sát: dùng ngay Định lý Động năng!',
      miniQuiz: [
        {
          id: 'p10ne-s3-q1',
          question: 'Vật $m = 1\\text{ kg}$ trượt không ma sát từ đỉnh dốc cao $5\\text{ m}$ ($g = 10\\text{ m/s}^2$, $v_0 = 0$). Tốc độ ở chân dốc bằng:',
          options: ['A. $5\\text{ m/s}$', 'B. $10\\text{ m/s}$', 'C. $50\\text{ m/s}$', 'D. $10\\sqrt{2}\\text{ m/s}$'],
          correctIndex: 1,
          explanation: '$v = \\sqrt{2gh} = \\sqrt{2\\cdot 10\\cdot 5} = 10\\text{ m/s}$.'
        },
        {
          id: 'p10ne-s3-q2',
          question: 'Trong va chạm mềm giữa hai vật cô lập, cặp đại lượng nào mô tả đúng tính chất bảo toàn?',
          options: [
            'A. Động lượng bảo toàn, cơ năng bảo toàn',
            'B. Động lượng không bảo toàn, cơ năng bảo toàn',
            'C. Động lượng bảo toàn, cơ năng giảm (chuyển thành nhiệt)',
            'D. Cả hai đều không bảo toàn'
          ],
          correctIndex: 2,
          explanation: 'Hệ cô lập nên động lượng luôn bảo toàn, nhưng va chạm mềm luôn tỏa nhiệt nên động năng/cơ năng giảm.'
        }
      ],
      miniEssay: {
        id: 'p10ne-s3-e1',
        question: 'Viên đạn $10\\text{ g}$ bay ngang tốc độ $400\\text{ m/s}$ găm xuyên vào khối gỗ nặng $10\\text{ kg}$ đang đứng yên trên bàn nhẵn. Tính tốc độ khối gỗ sau khi đạn găm vào và phần cơ năng đã hóa nhiệt.',
        hint: 'Tính $V = \\frac{m v}{M+m}$, sau đó lấy $W_{\\text{trước}} - W_{\\text{sau}}$.',
        rubricChecklist: [
          'Đổi $m = 0{,}01\\text{ kg}$, bảo toàn động lượng tìm $V = \\frac{0{,}01\\cdot 400}{10{,}01} \\approx 0{,}4\\text{ m/s}$.',
          'Tính $W_{\\text{trước}} = 800\\text{ J}$, $W_{\\text{sau}} \\approx 0{,}8\\text{ J} \\implies Q = 799{,}2\\text{ J}$.'
        ],
        sampleAnswer: 'Đổi $m = 0{,}01\\text{ kg}$. Bảo toàn động lượng lúc va chạm: $V = \\frac{0{,}01\\times 400}{10 + 0{,}01} \\approx 0{,}4\\text{ m/s}$. Động năng ban đầu của đạn là $\\frac{1}{2}\\cdot 0{,}01\\cdot 400^2 = 800\\text{ J}$; động năng hệ sau va chạm là $\\frac{1}{2}\\cdot 10{,}01\\cdot 0{,}4^2 \\approx 0{,}8\\text{ J}$. Vậy $799{,}2\\text{ J}$ (hơn $99{,}9\\%$) đã chuyển thành nhiệt.'
      }
    }
  ],
  'phys-10-circular': [
    {
      stepTitle: '1. Độ đo Radian, Tốc độ góc & Chu kì quay',
      stepType: 'concept',
      conceptSection:
        'Để mô tả vật quay tròn (bánh xe, kim đồng hồ, vệ tinh), người ta đo góc quay bằng đơn vị **radian (rad)**: góc $1\\text{ rad}$ chắn cung có độ dài đúng bằng bán kính $R$.',
      formulaSection: {
        primaryFormula: '\\omega = \\frac{\\Delta\\theta}{\\Delta t} = \\frac{2\\pi}{T} = 2\\pi f',
        secondaryFormulas: [
          '1\\text{ vòng} = 360^\\circ = 2\\pi\\text{ rad}',
          's = R\\cdot\\theta, \\qquad v = \\omega\\cdot R'
        ],
        variablesNote:
          '• $\\omega$: tốc độ góc ($\\text{rad/s}$); $T$: chu kì quay hết 1 vòng ($\\text{s}$); $f$: số vòng quay trong 1 giây ($\\text{Hz}$ hoặc vòng/s).\n• Mọi điểm trên cùng một đĩa quay cứng có **cùng $\\omega$**, nhưng điểm càng xa tâm thì $v = \\omega R$ càng lớn.'
      },
      deepDiveSection:
        'Chú ý đổi đơn vị tốc độ quay hay gặp trong đề: $n\\text{ (vòng/phút)} \\implies f = n/60\\text{ (vòng/s)} \\implies \\omega = 2\\pi n/60$. Ví dụ kim giây đồng hồ có $T = 60\\text{ s}$, kim phút $T = 3600\\text{ s}$, kim giờ $T = 43200\\text{ s}$.',
      teacherExplanation:
        'Luôn phân biệt hai ý: cùng một vật rắn quay đều thì cùng $\\omega$; hai bánh xe nối nhau bằng dây curoa hoặc ăn khớp răng thì cùng tốc độ dài $v$.',
      keyTakeaway: '$v = \\omega R$; đổi vòng/phút sang rad/s bằng cách nhân $2\\pi/60$.',
      miniQuiz: [
        {
          id: 'p10ci-s1-q1',
          question: 'Một bánh xe quay đều $300\\text{ vòng/phút}$. Tốc độ góc của bánh xe là:',
          options: ['A. $5\\pi\\text{ rad/s}$', 'B. $10\\pi\\text{ rad/s}$', 'C. $30\\pi\\text{ rad/s}$', 'D. $600\\pi\\text{ rad/s}$'],
          correctIndex: 1,
          explanation: '$f = 300/60 = 5\\text{ Hz} \\implies \\omega = 2\\pi f = 10\\pi\\text{ rad/s}$.'
        },
        {
          id: 'p10ci-s1-q2',
          question: 'Một vệ tinh quay tròn quanh Trái Đất ở bán kính quỹ đạo $R = 7000\\text{ km}$ với tốc độ dài $v = 7\\text{ km/s}$. Tốc độ góc của vệ tinh là:',
          options: ['A. $10^{-3}\\text{ rad/s}$', 'B. $10^{-2}\\text{ rad/s}$', 'C. $49\\cdot 10^3\\text{ rad/s}$', 'D. $1\\text{ rad/s}$'],
          correctIndex: 0,
          explanation: '$\\omega = \\frac{v}{R} = \\frac{7}{7000} = 10^{-3}\\text{ rad/s}$.'
        }
      ],
      miniEssay: {
        id: 'p10ci-s1-e1',
        question: 'So sánh tốc độ dài của đầu kim phút dài $12\\text{ cm}$ và đầu kim giây dài $15\\text{ cm}$ của một chiếc đồng hồ.',
        hint: 'Chu kì kim phút $T_p = 3600\\text{ s}$, kim giây $T_g = 60\\text{ s}$, dùng $v = \\frac{2\\pi R}{T}$.',
        rubricChecklist: [
          'Lập tỉ số $\\frac{v_g}{v_p} = \\frac{R_g / T_g}{R_p / T_p} = \\frac{15}{12} \\cdot \\frac{3600}{60} = 75$.',
          'Tính cụ thể $v_g \\approx 1{,}57\\text{ cm/s}$ và $v_p \\approx 0{,}021\\text{ cm/s}$.'
        ],
        sampleAnswer: 'Đầu kim giây quay với $v_g = \\frac{2\\pi R_g}{T_g} = \\frac{2\\pi \\cdot 15}{60} \\approx 1{,}57\\text{ cm/s}$. Đầu kim phút quay với $v_p = \\frac{2\\pi R_p}{T_p} = \\frac{2\\pi \\cdot 12}{3600} \\approx 0{,}021\\text{ cm/s}$. Tỉ số tốc độ đầu kim giây gấp $75$ lần đầu kim phút.'
      }
    },
    {
      stepTitle: '2. Gia tốc Hướng tâm & Bản chất Chuyển động Tròn đều',
      stepType: 'derivation',
      conceptSection:
        'Dù tốc độ dài $v$ không đổi, hướng của vectơ $\\vec{v}$ luôn thay đổi liên tục dọc theo đường tròn. Chính sự đổi hướng này sinh ra **gia tốc hướng tâm** $\\vec{a}_{ht}$ luôn hướng vào tâm quỹ đạo.',
      formulaSection: {
        primaryFormula: 'a_{ht} = \\frac{v^2}{R} = \\omega^2 R',
        secondaryFormulas: [
          '\\vec{a}_{ht} \\perp \\vec{v} \\text{ tại mọi điểm trên quỹ đạo}'
        ],
        variablesNote:
          '• Vì $\\vec{a}_{ht} \\perp \\vec{v}$ nên gia tốc hướng tâm KHÔNG làm thay đổi độ lớn của $v$, chỉ có nhiệm vụ bẻ cong quỹ đạo thành đường tròn.\n• Tăng $v$ lên 2 lần ở cùng bán kính cua $R$, gia tốc hướng tâm tăng $4$ lần!'
      },
      deepDiveSection:
        'Điều này lý giải tại sao ở những khúc cua bán kính $R$ nhỏ, tài xế phải giảm tốc độ $v$ xuống đáng kể để $a_{ht} = v^2/R$ không vượt quá ngưỡng bám đường của lốp xe.',
      teacherExplanation:
        'Đừng hiểu nhầm "chuyển động tròn đều có gia tốc bằng 0" — gia tốc chỉ bằng 0 khi vừa đều về độ lớn vừa thẳng về hướng.',
      keyTakeaway: 'Chuyển động tròn đều có tốc độ không đổi nhưng luôn có gia tốc hướng vào tâm $a_{ht} = v^2/R$.',
      miniQuiz: [
        {
          id: 'p10ci-s2-q1',
          question: 'Ô tô đi vào khúc cua bán kính $R = 50\\text{ m}$ với tốc độ $10\\text{ m/s}$. Gia tốc hướng tâm của xe là:',
          options: ['A. $0{,}2\\text{ m/s}^2$', 'B. $2\\text{ m/s}^2$', 'C. $5\\text{ m/s}^2$', 'D. $50\\text{ m/s}^2$'],
          correctIndex: 1,
          explanation: '$a_{ht} = \\frac{10^2}{50} = 2\\text{ m/s}^2$.'
        },
        {
          id: 'p10ci-s2-q2',
          question: 'Trong chuyển động tròn đều, vectơ gia tốc hướng tâm luôn có phương và chiều:',
          options: [
            'A. Cùng hướng với vectơ vận tốc',
            'B. Ngược hướng với vectơ vận tốc',
            'C. Luôn hướng vào tâm đường tròn và vuông góc vận tốc',
            'D. Luôn hướng ra xa tâm đường tròn'
          ],
          correctIndex: 2,
          explanation: 'Gia tốc hướng tâm luôn dọc theo bán kính, hướng về tâm và vuông góc với tiếp tuyến vận tốc.'
        }
      ],
      miniEssay: {
        id: 'p10ci-s2-e1',
        question: 'Tại sao một vệ tinh nhân tạo quay tròn đều quanh Trái Đất lại luôn "rơi" về tâm Trái Đất mà không bao giờ đâm xuống mặt đất?',
        hint: 'Liên hệ vai trò bẻ cong hướng vận tốc của gia tốc hướng tâm do lực hấp dẫn gây ra.',
        rubricChecklist: [
          'Lực hấp dẫn đóng vai trò lực hướng tâm tạo $a_{ht}$ kéo lệch phương vận tốc tiếp tuyến vào tâm.',
          'Với tốc độ vũ trụ cấp 1 ($\\approx 7{,}9\\text{ km/s}$), độ cong rơi đúng bằng độ cong bề mặt Trái Đất nên vệ tinh giữ nguyên độ cao.'
        ],
        sampleAnswer: 'Lực hấp dẫn giữa Trái Đất và vệ tinh hướng thẳng vào tâm Trái Đất, đóng vai trò lực hướng tâm làm đổi hướng vectơ vận tốc tiếp tuyến chứ không làm thay đổi độ lớn tốc độ. Vì vệ tinh có vận tốc ngang đủ lớn ($\\approx 7{,}9\\text{ km/s}$), quãng đường nó rơi về tâm Trái Đất khớp đúng với độ cong bề mặt địa cầu nên quỹ đạo khép kín thành vòng tròn.'
      }
    },
    {
      stepTitle: '3. Lực Hướng tâm & An toàn khi Xe vào Khúc cua',
      stepType: 'example',
      conceptSection:
        'Lực hướng tâm KHÔNG phải một loại lực mới (như trọng lực hay lực đàn hồi), mà là **hợp lực** (hoặc thành phần lực) hướng vào tâm quỹ đạo đóng vai trò giữ vật chạy theo đường tròn.',
      formulaSection: {
        primaryFormula: 'F_{ht} = ma_{ht} = \\frac{mv^2}{R} = m\\omega^2 R',
        secondaryFormulas: [
          '\\text{Cua đường bằng: } F_{ms\\text{ nghỉ}} \\ge \\frac{mv^2}{R} \\implies v_{\\max} = \\sqrt{\\mu g R}',
          '\\text{Qua đỉnh cầu vồng: } P - N = \\frac{mv^2}{R} \\implies N = mg - \\frac{mv^2}{R}'
        ],
        variablesNote:
          '• Khi xe đi qua điểm cao nhất cầu vồng lên, áp lực lên mặt cầu $N < P$ (nhẹ hơn bình thường); khi đi qua đáy cầu võng xuống, $N = mg + mv^2/R > P$.\n• Để ô tô vào cua tốc độ cao an toàn, người ta thiết kế mặt đường cua nghiêng vào tâm giúp một phần phản lực $\\vec{N}$ hướng tâm.'
      },
      deepDiveSection:
        'Khi xe chạy quá nhanh vào khúc cua đường phẳng, lực ma sát nghỉ cực đại $\\mu mg$ không đủ cung cấp lực hướng tâm $mv^2/R$ cần thiết để bẻ cong hướng đi, xe sẽ trượt văng ra theo tiếp tuyến (quán tính li tâm), không phải do một lực bí ẩn nào đẩy từ tâm ra.',
      teacherExplanation:
        'Nhớ quy tắc dấu khi tính áp lực $N$ trên cầu: hợp lực hướng tâm $F_{ht} = F_{\\text{hướng vào tâm}} - F_{\\text{hướng ra ngoài tâm}}$.',
      keyTakeaway: 'Lực hướng tâm là hợp lực hướng vào tâm; vào cua đường phẳng tốc độ tối đa là $\\sqrt{\\mu gR}$.',
      miniQuiz: [
        {
          id: 'p10ci-s3-q1',
          question: 'Một khúc cua phẳng bán kính $R = 40\\text{ m}$ có hệ số ma sát nghỉ cực đại giữa lốp và đường là $\\mu = 0{,}4$ ($g = 10\\text{ m/s}^2$). Tốc độ tối đa xe không bị trượt là:',
          options: ['A. $4\\text{ m/s}$', 'B. $4\\sqrt{10}\\text{ m/s}$', 'C. $16\\text{ m/s}$', 'D. $40\\text{ m/s}$'],
          correctIndex: 1,
          explanation: '$v_{\\max} = \\sqrt{\\mu gR} = \\sqrt{0{,}4\\cdot 10\\cdot 40} = \\sqrt{160} = 4\\sqrt{10}\\text{ m/s}$.'
        },
        {
          id: 'p10ci-s3-q2',
          question: 'Một ô tô khối lượng $1000\\text{ kg}$ chạy qua điểm cao nhất của cầu vồng bán kính cong $100\\text{ m}$ với tốc độ $20\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). Áp lực xe nén lên cầu là:',
          options: ['A. $14\\,000\\text{ N}$', 'B. $10\\,000\\text{ N}$', 'C. $6000\\text{ N}$', 'D. $4000\\text{ N}$'],
          correctIndex: 2,
          explanation: '$N = mg - \\frac{mv^2}{R} = 10\\,000 - \\frac{1000\\cdot 400}{100} = 6000\\text{ N}$.'
        }
      ],
      miniEssay: {
        id: 'p10ci-s3-e1',
        question: 'Tại sao đường đua xe đạp lòng chảo hoặc khúc cua đường cao tốc lại được làm nghiêng vào phía tâm cua?',
        hint: 'Vẽ phân tích phản lực $\\vec{N}$ nghiêng vào trong khi mặt đường có góc nghiêng $\\theta$.',
        rubricChecklist: [
          'Trên đường nghiêng vào tâm, phản lực $\\vec{N}$ hướng chếch vào tâm nên có thành phần ngang $N\\sin\\theta$ hướng tâm.',
          'Thành phần này hỗ trợ hoặc thay thế lực ma sát nghỉ, giúp xe vào cua với tốc độ cao mà không bị trượt văng khi trời mưa trơn.'
        ],
        sampleAnswer: 'Khi mặt đường nghiêng vào tâm một góc $\\theta$, phản lực $\\vec{N}$ vuông góc mặt đường sẽ có thành phần nằm ngang $N\\sin\\theta$ hướng thẳng vào tâm cua. Thành phần này tự đóng vai trò lực hướng tâm, giúp giảm gánh nặng cho ma sát nghỉ ở lốp xe, nhờ đó xe có thể chạy tốc độ cao và bám cua an toàn hơn.'
      }
    }
  ],
  'phys-10-torque-fluid': [
    {
      stepTitle: '1. Moment Lực & Quy tắc Cân bằng Vật rắn quay',
      stepType: 'concept',
      conceptSection:
        'Moment lực ($M$) đặc trưng cho tác dụng làm quay của lực quanh một trục cố định. Khi lực đi qua trục quay hoặc song song với trục quay thì cánh tay đòn bằng 0 và lực không gây quay.',
      formulaSection: {
        primaryFormula: 'M = F\\cdot d, \\qquad \\sum M_{\\text{thuận chiều}} = \\sum M_{\\text{ngược chiều}}',
        secondaryFormulas: [
          'd = r\\sin\\alpha \\quad (\\text{cánh tay đòn từ trục đến giá của lực})'
        ],
        variablesNote:
          '• $d$: **cánh tay đòn** — là khoảng cách **vuông góc** từ trục quay $O$ tới đường thẳng chứa lực (giá của lực), tính bằng mét ($\text{m}$).\n• Đơn vị của Moment lực là $\\text{N}\\cdot\\text{m}$.'
      },
      deepDiveSection:
        'Hai điều kiện cân bằng tổng quát của vật rắn:\n1. Tổng lực bằng 0 ($\\sum \\vec{F} = \\vec{0}$) — vật không chuyển động tịnh tiến.\n2. Tổng moment lực theo hai chiều quay đối nhau bằng nhau ($\\sum M_{\\text{cùng}} = \\sum M_{\\text{ngược}}$) — vật không quay.',
      teacherExplanation:
        'Khi lắp tay nắm cửa hay dùng cờ-lê vặn ốc, cầm càng xa bản lề/trục ốc thì cánh tay đòn $d$ càng lớn nên chỉ cần lực nhỏ vẫn tạo đủ moment quay.',
      keyTakeaway: 'Cánh tay đòn $d$ là đoạn hạ vuông góc từ trục quay xuống giá của lực.',
      miniQuiz: [
        {
          id: 'p10tf-s1-q1',
          question: 'Dùng cờ-lê dài $25\\text{ cm}$ đặt lực $40\\text{ N}$ vuông góc với thân cờ-lê để vặn bu-lông. Moment lực tác dụng là:',
          options: ['A. $1000\\text{ N}\\cdot\\text{m}$', 'B. $10\\text{ N}\\cdot\\text{m}$', 'C. $1{,}6\\text{ N}\\cdot\\text{m}$', 'D. $4\\text{ N}\\cdot\\text{m}$'],
          correctIndex: 1,
          explanation: 'Đổi $d = 0{,}25\\text{ m} \\implies M = 40 \\cdot 0{,}25 = 10\\text{ N}\\cdot\\text{m}$.'
        },
        {
          id: 'p10tf-s1-q2',
          question: 'Thanh nhẹ dài $1{,}2\\text{ m}$ tựa trên giá tại điểm O cách đầu A là $0{,}4\\text{ m}$. Treo vật $60\\text{ N}$ ở đầu A, cần treo vật nặng bao nhiêu ở đầu B để thanh thăng bằng?',
          options: ['A. $30\\text{ N}$', 'B. $20\\text{ N}$', 'C. $120\\text{ N}$', 'D. $40\\text{ N}$'],
          correctIndex: 0,
          explanation: '$OB = 1{,}2 - 0{,}4 = 0{,}8\\text{ m}$. Từ $P_A\\cdot OA = P_B\\cdot OB \\implies 60\\cdot 0{,}4 = P_B\\cdot 0{,}8 \\implies P_B = 30\\text{ N}$.'
        }
      ],
      miniEssay: {
        id: 'p10tf-s1-e1',
        question: 'Thanh đồng chất AB dài $2\\text{ m}$, nặng $40\\text{ N}$ nằm ngang trên một điểm tựa O cách đầu A là $0{,}6\\text{ m}$. Hỏi phải treo ở đầu A vật nặng bao nhiêu để thanh cân bằng nằm ngang?',
        hint: 'Trọng lượng thanh đồng chất đặt tại trung điểm G cách A là $1\\text{ m}$ (nên cách O đoạn $0{,}4\\text{ m}$).',
        rubricChecklist: [
          'Xác định trọng tâm G ở giữa thanh cách O khoảng $OG = 1 - 0{,}6 = 0{,}4\\text{ m}$.',
          'Viết phương trình moment: $P_A\\cdot OA = P_{\\text{thanh}}\\cdot OG \\implies 0{,}6 P_A = 40\\cdot 0{,}4 \\implies P_A \\approx 26{,}7\\text{ N}$.'
        ],
        sampleAnswer: 'Vì thanh đồng chất nên trọng lực $P = 40\\text{ N}$ đặt tại trung điểm G cách A là $1{,}0\\text{ m}$, tức nằm bên phải điểm tựa O một đoạn $OG = 1{,}0 - 0{,}6 = 0{,}4\\text{ m}$. Quy tắc moment quanh O: $P_A\\cdot OA = P\\cdot OG \\Rightarrow P_A\\cdot 0{,}6 = 40\\cdot 0{,}4 \\Rightarrow P_A = \\frac{16}{0{,}6} \\approx 26{,}7\\text{ N}$.'
      }
    },
    {
      stepTitle: '2. Ngẫu lực & Trọng tâm – Các dạng Cân bằng',
      stepType: 'derivation',
      conceptSection:
        'Ngẫu lực là hệ hai lực song song, ngược chiều, có độ lớn bằng nhau và tác dụng vào cùng một vật. Vì tổng hai lực bằng 0 nên ngẫu lực **chỉ làm vật quay chứ không làm vật tịnh tiến**.',
      formulaSection: {
        primaryFormula: 'M_{\\text{ngẫu lực}} = F\\cdot d',
        secondaryFormulas: [
          '\\text{Cân bằng bền: trọng tâm thấp nhất}',
          '\\text{Cân bằng không bền: trọng tâm cao nhất}'
        ],
        variablesNote:
          '• Trong công thức ngẫu lực, $d$ là khoảng cách vuông góc giữa hai giá của hai lực.\n• Điều kiện cân bằng mặt chân đế: giá của trọng lực phải đi qua mặt chân đế.'
      },
      deepDiveSection:
        'Ví dụ điển hình về ngẫu lực là hai tay cùng xoay vô lăng ô tô, vặn vòi nước chữ T, hay vặn khóa. Để xe đua F1 hoặc con lật đật khó bị lật, người ta thiết kế trọng tâm cực thấp và mặt chân đế rộng.',
      teacherExplanation:
        'Ngẫu lực có giá trị $M = F\\cdot d$ hoàn toàn KHÔNG phụ thuộc vào việc ta chọn trục quay nằm ở đâu.',
      keyTakeaway: 'Ngẫu lực có hợp lực bằng 0, chỉ tạo tác dụng quay với $M = Fd$; hạ thấp trọng tâm tăng mức vững vàng.',
      miniQuiz: [
        {
          id: 'p10tf-s2-q1',
          question: 'Hai tay xoay vô-lăng ô tô đường kính $40\\text{ cm}$, mỗi tay tác dụng lực tiếp tuyến $15\\text{ N}$ ngược chiều nhau. Moment ngẫu lực bằng:',
          options: ['A. $600\\text{ N}\\cdot\\text{m}$', 'B. $6\\text{ N}\\cdot\\text{m}$', 'C. $3\\text{ N}\\cdot\\text{m}$', 'D. $12\\text{ N}\\cdot\\text{m}$'],
          correctIndex: 1,
          explanation: 'Khoảng cách hai lực bằng đường kính $d = 0{,}4\\text{ m} \\implies M = 15\\cdot 0{,}4 = 6\\text{ N}\\cdot\\text{m}$.'
        },
        {
          id: 'p10tf-s2-q2',
          question: 'Vật đặt trên mặt bàn nằm ngang bị lật đổ khi:',
          options: [
            'A. Mặt chân đế có diện tích nhỏ hơn $10\\text{ cm}^2$',
            'B. Giá của trọng lực đi ra ngoài diện tích mặt chân đế',
            'C. Trọng tâm nằm trên trục đối xứng',
            'D. Khối lượng vật lớn'
          ],
          correctIndex: 1,
          explanation: 'Khi đường thẳng đứng qua trọng tâm rơi ra ngoài mặt chân đế, trọng lực tạo ra moment làm lật vật.'
        }
      ],
      miniEssay: {
        id: 'p10tf-s2-e1',
        question: 'Tại sao khi xếp hàng hóa lên xe tải, các kiện hàng nặng luôn được xếp ở dưới sàn thùng còn hàng nhẹ đặt lên trên?',
        hint: 'Liên hệ vị trí trọng tâm của xe với độ vững của cân bằng mặt chân đế khi xe nghiêng hoặc vào cua.',
        rubricChecklist: [
          'Hàng nặng ở dưới giúp hạ thấp trọng tâm chung của toàn xe.',
          'Trọng tâm thấp làm tăng góc nghiêng giới hạn trước khi đường đứng qua trọng tâm lệch khỏi khoảng cách hai bánh xe, chống lật.'
        ],
        sampleAnswer: 'Đặt hàng nặng ở dưới sàn giúp hạ thấp trọng tâm chung của xe tải. Khi xe đi trên đường nghiêng hoặc vào khúc cua, trọng tâm càng thấp thì góc nghiêng tới hạn để giá của trọng lực còn rơi trong mặt chân đế giữa hai hàng bánh xe càng lớn, giúp xe giữ cân bằng bền và chống lật đổ.'
      }
    },
    {
      stepTitle: '3. Áp suất Chất lỏng & Lực đẩy Archimedes',
      stepType: 'example',
      conceptSection:
        'Chất lỏng gây ra áp suất theo mọi phương lên thành bình và các vật ngập bên trong do trọng lượng của cột chất lỏng phía trên đè xuống. Chính sự chênh lệch áp suất giữa mặt dưới và mặt trên vật tạo ra lực đẩy Archimedes hướng thẳng đứng lên trên.',
      formulaSection: {
        primaryFormula: 'p = p_0 + \\rho g h, \\qquad F_A = \\rho g V_{\\text{chìm}}',
        secondaryFormulas: [
          '\\Delta p = \\rho g \\Delta h',
          '\\text{Nổi: } \\rho_{\\text{vật}} < \\rho_{\\text{lỏng}} \\implies \\frac{V_{\\text{chìm}}}{V} = \\frac{\\rho_{\\text{vật}}}{\\rho_{\\text{lỏng}}}'
        ],
        variablesNote:
          '• $\\rho$: khối lượng riêng chất lỏng ($\\text{kg/m}^3$; nước nguyên chất $1000\\text{ kg/m}^3$).\n• $h$: độ sâu tính từ mặt thoáng chất lỏng xuống điểm xét ($\text{m}$).\n• $V_{\\text{chìm}}$: phần thể tích chất lỏng bị vật chiếm chỗ ($\text{m}^3$), KHÔNG phải toàn bộ thể tích vật nếu vật nổi!'
      },
      deepDiveSection:
        'Áp suất tại cùng một độ sâu trong cùng một chất lỏng đứng yên luôn bằng nhau tại mọi điểm (bình thông nhau). Đây là nguyên lý xây dựng hệ thống cấp nước tháp cao, đập thủy điện (đáy đập xây dày hơn đỉnh đập) và máy nén thủy lực.',
      teacherExplanation:
        'Luôn phân biệt rõ độ sâu $h$ tính từ mặt thoáng xuống và dùng $V_{\\text{chìm}}$ trong công thức $F_A$.',
      keyTakeaway: 'Áp suất chất lỏng tăng tuyến tính theo độ sâu $h$; vật nổi lơ lửng khi $F_A = P$.',
      miniQuiz: [
        {
          id: 'p10tf-s3-q1',
          question: 'Thợ lặn xuống độ sâu $h = 20\\text{ m}$ dưới mặt nước hồ ($\\rho = 1000\\text{ kg/m}^3, g = 10\\text{ m/s}^2$, $p_0 = 10^5\\text{ Pa}$). Áp suất tuyệt đối tác dụng lên thợ lặn là:',
          options: ['A. $2\\cdot 10^5\\text{ Pa}$', 'B. $3\\cdot 10^5\\text{ Pa}$', 'C. $10^5\\text{ Pa}$', 'D. $2{,}5\\cdot 10^5\\text{ Pa}$'],
          correctIndex: 1,
          explanation: '$p = p_0 + \\rho g h = 10^5 + 1000\\cdot 10\\cdot 20 = 3\\cdot 10^5\\text{ Pa}$.'
        },
        {
          id: 'p10tf-s3-q2',
          question: 'Một tảng băng có khối lượng riêng $900\\text{ kg/m}^3$ nổi trên nước biển $1000\\text{ kg/m}^3$. Phần thể tích băng chìm dưới nước chiếm bao nhiêu phần trăm?',
          options: ['A. $10\\%$', 'B. $50\\%$', 'C. $90\\%$', 'D. $80\\%$'],
          correctIndex: 2,
          explanation: '$\\frac{V_{\\text{chìm}}}{V} = \\frac{900}{1000} = 90\\%$.'
        }
      ],
      miniEssay: {
        id: 'p10tf-s3-e1',
        question: 'Tại sao tàu ngầm muốn lặn xuống sâu hay nổi lên mặt nước chỉ bằng cách bơm nước vào hoặc đẩy khí nén thổi nước ra khỏi các khoang dằn, dù thể tích vỏ tàu không đổi?',
        hint: 'Khi thể tích vỏ ngoài không đổi thì lực đẩy Archimedes $F_A$ có đổi không? Điều gì thay đổi?',
        rubricChecklist: [
          'Khi lặn hoàn toàn, thể tích chiếm chỗ $V$ không đổi nên $F_A = \\rho g V$ không đổi.',
          'Bơm nước vào khoang làm tăng trọng lượng $P > F_A$ để tàu chìm; thổi nước ra làm giảm $P < F_A$ để tàu nổi.'
        ],
        sampleAnswer: 'Do vỏ thép tàu ngầm cứng nên khi ngập dưới nước, lực đẩy Archimedes $F_A = \\rho g V$ gần như không đổi. Để điều chỉnh độ sâu, tàu thay đổi trọng lượng $P$: bơm thêm nước biển vào khoang dằn làm $P > F_A$ để lặn xuống; dùng khí nén đẩy nước ra ngoài làm $P < F_A$ để nổi lên, và cân bằng $P = F_A$ khi muốn giữ nguyên độ sâu.'
      }
    }
  ],
  'phys-10-momentum': [
    {
      stepTitle: '1. Xung lượng của Lực & Bài toán Giảm chấn Động',
      stepType: 'concept',
      conceptSection:
        'Xung lượng của lực ($\vec{F}\\Delta t$) đo tác dụng tích lũy của lực trong khoảng thời gian tác dụng $\\Delta t$ và có giá trị bằng đúng độ biến thiên động lượng của vật.',
      formulaSection: {
        primaryFormula: '\\vec{F}\\Delta t = \\Delta\\vec{p} = m\\vec{v}_2 - m\\vec{v}_1',
        secondaryFormulas: [
          'F_{\\text{tb}} = \\frac{|\\Delta\\vec{p}|}{\\Delta t}'
        ],
        variablesNote:
          '• Nếu $\\vec{F}$ không cùng phương $\\vec{v}_1$, phải cộng trừ bằng quy tắc vectơ hoặc Pythagore (khi vuông góc).'
      },
      deepDiveSection:
        'Trong trường hợp vật va chạm xiên góc vào tường phẳng nhẵn với góc tới $\\alpha$ (so với pháp tuyến) rồi bật ra đối xứng cùng tốc độ $v$, độ biến thiên động lượng vuông góc tường là $\\Delta p = 2mv\\cos\\alpha$.',
      teacherExplanation:
        'Đừng quên dấu vectơ của vận tốc khi vật bị dội ngược trở lại: $\\Delta v = v_{\\text{ra}} - (-v_{\\text{vào}}) = v_{\\text{ra}} + v_{\\text{vào}}$.',
      keyTakeaway: 'Muốn giảm lực va đập $F$, hãy kéo dài thời gian va chạm $\\Delta t$.',
      miniQuiz: [
        {
          id: 'p10mo-s1-q1',
          question: 'Tác dụng một lực không đổi $20\\text{ N}$ trong $0{,}5\\text{ s}$ lên vật khối lượng $2\\text{ kg}$ đang đứng yên. Tốc độ vật đạt được bằng:',
          options: ['A. $20\\text{ m/s}$', 'B. $5\\text{ m/s}$', 'C. $10\\text{ m/s}$', 'D. $40\\text{ m/s}$'],
          correctIndex: 1,
          explanation: '$m(v - 0) = F\\Delta t \\implies 2v = 20\\cdot 0{,}5 = 10 \\implies v = 5\\text{ m/s}$.'
        },
        {
          id: 'p10mo-s1-q2',
          question: 'Một quả cầu $0{,}2\\text{ kg}$ rơi thẳng đứng chạm sàn với tốc độ $5\\text{ m/s}$ rồi bật thẳng lên với tốc độ $3\\text{ m/s}$. Độ lớn độ biến thiên động lượng là:',
          options: ['A. $0{,}4\\text{ kg}\\cdot\\text{m/s}$', 'B. $1{,}6\\text{ kg}\\cdot\\text{m/s}$', 'C. $1{,}0\\text{ kg}\\cdot\\text{m/s}$', 'D. $0{,}6\\text{ kg}\\cdot\\text{m/s}$'],
          correctIndex: 1,
          explanation: 'Chọn chiều dương hướng lên: $\\Delta p = 0{,}2(3 - (-5)) = 1{,}6\\text{ kg}\\cdot\\text{m/s}$.'
        }
      ],
      miniEssay: {
        id: 'p10mo-s1-e1',
        question: 'Tại sao khi nhảy từ trên cao xuống đất, người nhảy phải chủ động khuỵu gối khi chân vừa chạm đất thay vì duỗi thẳng cứng chân?',
        hint: 'So sánh thời gian $\\Delta t$ hãm vận tốc về 0 trong hai cách tiếp đất theo công thức $F = \\Delta p/\\Delta t$.',
        rubricChecklist: [
          'Độ biến thiên động lượng $\\Delta p = m v$ là như nhau từ lúc chạm đất tới khi dừng.',
          'Khuỵu gối kéo dài thời gian dừng $\\Delta t$, nhờ đó lực phản tác dụng $F$ lên khớp gối giảm mạnh.'
        ],
        sampleAnswer: 'Độ biến thiên động lượng từ lúc chân chạm đất đến khi dừng hẳn đều bằng $\\Delta p = mv$. Khi khuỵu gối, trọng tâm cơ thể tiếp tục hạ xuống một đoạn trong khoảng thời gian $\\Delta t$ dài hơn nhiều so với duỗi thẳng chân. Theo $F = \\Delta p/\\Delta t$, $\\Delta t$ tăng làm lực xung kích từ mặt đất lên khớp xương giảm đáng kể, tránh chấn thương.'
      }
    },
    {
      stepTitle: '2. Va chạm Đàn hồi & Chuyển động bằng Phản lực',
      stepType: 'derivation',
      conceptSection:
        'Trong va chạm đàn hồi trực diện, cả **động lượng** lẫn **động năng** đều được bảo toàn. Trong chuyển động phản lực (tên lửa, mực ống), khí phụt về sau mang động lượng âm làm thân tên lửa nhận động lượng dương tiến về trước.',
      formulaSection: {
        primaryFormula: 'm_1\\vec{v}_1 + m_2\\vec{v}_2 = m_1\\vec{v}_1\' + m_2\\vec{v}_2\'',
        secondaryFormulas: [
          '\\text{Tên lửa: } M\\vec{V} + m\\vec{u} = \\vec{0} \\implies V = \\frac{m}{M}u',
          '\\text{Đàn hồi xuyên tâm: } v_1 - v_2 = v_2\' - v_1\''
        ],
        variablesNote:
          '• Đặc biệt với hai vật có khối lượng bằng nhau ($m_1 = m_2$) va chạm đàn hồi trực diện: chúng **trao đổi vận tốc** cho nhau ($v_1\' = v_2,\\ v_2\' = v_1$).\n• Tên lửa hoạt động tốt ngay cả trong môi trường chân không ngoài vũ trụ vì không cần không khí đẩy.'
      },
      deepDiveSection:
        'Một sai lầm phổ biến là nghĩ tên lửa bay lên được nhờ luồng khí phụt đẩy vào mặt đất hoặc không khí. Thực chất lực đẩy tên lửa sinh ra do phản lực nội tại giữa thân tên lửa và khối khí bị đốt phụt ra (Định luật III Newton và bảo toàn động lượng).',
      teacherExplanation:
        'Nếu một hạt đứng yên nổ vỡ thành 2 mảnh, hai mảnh chắc chắn bay theo hai hướng ngược nhau trên cùng một đường thẳng với $m_1 v_1 = m_2 v_2$.',
      keyTakeaway: 'Va chạm đàn hồi bảo toàn cả động lượng và động năng; tên lửa bay nhờ phản lực, không cần không khí.',
      miniQuiz: [
        {
          id: 'p10mo-s2-q1',
          question: 'Viên bi A chuyển động với tốc độ $4\\text{ m/s}$ va chạm đàn hồi xuyên tâm vào bi B cùng khối lượng đang đứng yên. Tốc độ của A và B sau va chạm là:',
          options: ['A. A: $2\\text{ m/s}$, B: $2\\text{ m/s}$', 'B. A: $0\\text{ m/s}$, B: $4\\text{ m/s}$', 'C. A: $-4\\text{ m/s}$, B: $0\\text{ m/s}$', 'D. A: $1\\text{ m/s}$, B: $3\\text{ m/s}$'],
          correctIndex: 1,
          explanation: 'Hai vật cùng khối lượng va chạm đàn hồi trực diện sẽ trao đổi vận tốc cho nhau: A dừng lại, B chạy tiếp $4\\text{ m/s}$.'
        },
        {
          id: 'p10mo-s2-q2',
          question: 'Một quả đạn đang nằm yên nổ vỡ làm 2 mảnh: mảnh 1 nặng $2\\text{ kg}$ bay hướng Đông với $15\\text{ m/s}$, mảnh 2 nặng $3\\text{ kg}$ sẽ bay:',
          options: ['A. Hướng Đông, $10\\text{ m/s}$', 'B. Hướng Tây, $10\\text{ m/s}$', 'C. Hướng Tây, $22{,}5\\text{ m/s}$', 'D. Hướng Bắc, $10\\text{ m/s}$'],
          correctIndex: 1,
          explanation: '$m_2 v_2 = m_1 v_1 \\implies 3 v_2 = 2\\cdot 15 \\implies v_2 = 10\\text{ m/s}$ và bay ngược chiều (hướng Tây).'
        }
      ],
      miniEssay: {
        id: 'p10mo-s2-e1',
        question: 'Viên đạn nổ thành 2 mảnh vuông góc nhau: mảnh 1 có động lượng $6\\text{ kg}\\cdot\\text{m/s}$, mảnh 2 có động lượng $8\\text{ kg}\\cdot\\text{m/s}$. Tính động lượng ban đầu của viên đạn trước khi nổ.',
        hint: 'Tổng vectơ $\\vec{p} = \\vec{p}_1 + \\vec{p}_2$, áp dụng Pythagore.',
        rubricChecklist: [
          'Viết phương trình bảo toàn vectơ $\\vec{p} = \\vec{p}_1 + \\vec{p}_2$.',
          'Vì $\\vec{p}_1 \\perp \\vec{p}_2$ nên $p = \\sqrt{6^2 + 8^2} = 10\\text{ kg}\\cdot\\text{m/s}$.'
        ],
        sampleAnswer: 'Trong khoảnh khắc nổ, ngoại lực không đáng kể nên động lượng bảo toàn: $\\vec{p} = \\vec{p}_1 + \\vec{p}_2$. Do hai mảnh bay vuông góc nhau nên theo định lý Pythagore, độ lớn động lượng viên đạn trước khi nổ là $p = \\sqrt{p_1^2 + p_2^2} = \\sqrt{6^2 + 8^2} = 10\\text{ kg}\\cdot\\text{m/s}$.'
      }
    },
    {
      stepTitle: '3. Phân tích Va chạm Hai chiều & Bảo toàn theo Phương ngang',
      stepType: 'example',
      conceptSection:
        'Ngay cả khi hệ không cô lập hoàn toàn (chẳng hạn có trọng lực hướng thẳng đứng), động lượng vẫn được **bảo toàn riêng trên phương nằm ngang** nếu tổng ngoại lực chiếu lên phương ngang bằng 0.',
      formulaSection: {
        primaryFormula: '\\sum F_{x} = 0 \\implies \\sum p_{x,\\text{trước}} = \\sum p_{x,\\text{sau}}',
        secondaryFormulas: [
          'p_x = p\\cos\\alpha, \\qquad m v \\cos\\alpha = (M + m)V'
        ],
        variablesNote:
          '• Ứng dụng: viên đạn bay xiên góc $\\alpha$ cắm vào xe cát chạy trên đường ray ngang nhẵn; phản lực mặt đất và trọng lực cân bằng theo phương đứng nên $p_x$ bảo toàn!'
      },
      deepDiveSection:
        'Khi một vật trượt trên chiếc nêm đặt trên sàn ngang nhẵn không ma sát: khi vật trượt xuống, trọng lực tác dụng lên hệ theo phương thẳng đứng khác 0 nên động lượng phương $Oy$ không bảo toàn, nhưng theo phương $Ox$ không có ma sát sàn nên $m v_x + M V_{\\text{nêm}} = 0$ luôn đúng.',
      teacherExplanation:
        'Kiểm tra từng trục tọa độ riêng biệt: trục nào có tổng hình chiếu ngoại lực bằng 0 thì động lượng bảo toàn trên trục đó.',
      keyTakeaway: 'Bảo toàn động lượng có thể áp dụng độc lập theo phương $Ox$ ngay cả khi có trọng lực phương $Oy$.',
      miniQuiz: [
        {
          id: 'p10mo-s3-q1',
          question: 'Một viên đạn $m = 1\\text{ kg}$ bay tốc độ $50\\text{ m/s}$ hợp phương ngang góc $60^\\circ$ rơi cắm vào toa xe cát $M = 9\\text{ kg}$ đứng yên trên ray ngang nhẵn. Tốc độ toa xe ngay sau đó là:',
          options: ['A. $5\\text{ m/s}$', 'B. $2{,}5\\text{ m/s}$', 'C. $4{,}33\\text{ m/s}$', 'D. $10\\text{ m/s}$'],
          correctIndex: 1,
          explanation: 'Bảo toàn động lượng phương ngang: $V = \\frac{mv\\cos 60^\\circ}{M+m} = \\frac{1\\cdot 50\\cdot 0{,}5}{10} = 2{,}5\\text{ m/s}$.'
        },
        {
          id: 'p10mo-s3-q2',
          question: 'Khi đạn rơi xiên góc cắm vào xe cát trên mặt ngang nhẵn, thành phần động lượng thẳng đứng của viên đạn bị triệt tiêu bởi:',
          options: ['A. Lực ma sát của không khí', 'B. Phản lực xung kích thẳng đứng từ mặt ray lên bánh xe', 'C. Lực từ của Trái Đất', 'D. Không bị triệt tiêu'],
          correctIndex: 1,
          explanation: 'Mặt ray ngăn xe đi xuống bằng xung lượng phản lực thẳng đứng.'
        }
      ],
      miniEssay: {
        id: 'p10mo-s3-e1',
        question: 'Một người nặng $60\\text{ kg}$ đang đứng yên trên chiếc thuyền $180\\text{ kg}$ ở mặt hồ yên lặng. Người đó đi về đầu thuyền với vận tốc $2\\text{ m/s}$ so với bờ. Thuyền dịch chuyển thế nào so với bờ?',
        hint: 'Tổng ngoại lực phương ngang bằng 0 (bỏ qua lực cản nước). Dùng $m v_{\\text{người}} + M v_{\\text{thuyền}} = 0$.',
        rubricChecklist: [
          'Nêu tổng ngoại lực phương ngang bằng 0 nên $p_x$ bảo toàn.',
          'Tính $V_{\\text{thuyền}} = -\\frac{60 \\cdot 2}{180} = -\\frac{2}{3} \\approx -0{,}67\\text{ m/s}$ (ngược hướng người đi).'
        ],
        sampleAnswer: 'Bỏ qua lực cản nước, hệ (người + thuyền) có tổng ngoại lực theo phương ngang bằng 0 nên động lượng phương ngang bảo toàn: $m v_{\\text{người}} + M v_{\\text{thuyền}} = 0 \\Rightarrow 60 \\times 2 + 180\\,v_{\\text{thuyền}} = 0 \\Rightarrow v_{\\text{thuyền}} = -\\frac{2}{3} \\approx -0{,}67\\text{ m/s}$. Vậy thuyền lùi ngược chiều người đi với tốc độ $0{,}67\\text{ m/s}$.'
      }
    }
  ]
};
