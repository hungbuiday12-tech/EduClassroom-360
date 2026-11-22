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
  'phys-9-b1': [
    {
      stepTitle: '1. Dụng cụ Đo Điện & Biến áp Nguồn Thực hành',
      stepType: 'concept',
      conceptSection:
        'Trong chương trình KHTN 9, các thí nghiệm điện học đều sử dụng nguồn điện áp thấp an toàn (3 V – 12 V) qua biến áp nguồn kết hợp Ampe kế, Vôn kế, biến trở và dây dẫn có phích cắm.',
      formulaSection: {
        primaryFormula: '\\text{ĐCNN} = \\frac{\\text{Khoảng chia hai vạch liên tiếp}}{\\text{Số khoảng chia}}',
        secondaryFormulas: [
          '\\text{Ampe kế (A): mắc nối tiếp} \\quad | \\quad \\text{Vôn kế (V): mắc song song}'
        ],
        variablesNote:
          '• **Giới hạn đo (GHĐ)**: giá trị lớn nhất ghi trên vạch chia của đồng hồ đo.\n• **Ampe kế**: có điện trở trong rất nhỏ, luôn mắc nối tiếp với vật cần đo dòng điện.\n• **Vôn kế**: có điện trở trong rất lớn, luôn mắc song song hai đầu đoạn mạch cần đo hiệu điện thế.'
      },
      deepDiveSection:
        'Khi sử dụng đồng hồ đo kim hoặc đồng hồ đa năng hiện số, luôn chọn thang đo lớn hơn giá trị ước lượng trước khi giảm xuống thang đo phù hợp để tránh quá tải làm cháy cầu chì. Không bao giờ nối trực tiếp hai cực nguồn điện vào Ampe kế vì sẽ gây đoản mạch.',
      teacherExplanation:
        'Mẹo nhớ nhanh: Ampe kế mắc nối tiếp (chữ A có hai chân nối thẳng vào dòng điện); Vôn kế mắc song song hai đầu linh kiện.',
      keyTakeaway: 'Ampe kế mắc nối tiếp đo cường độ I; Vôn kế mắc song song đo hiệu điện thế U.',
      miniQuiz: [
        {
          id: 'p9b1-s1-q1',
          question: 'Để đo hiệu điện thế giữa hai đầu một bóng đèn đang sáng bằng vôn kế, ta phải mắc vôn kế như thế nào?',
          options: [
            'A. Mắc nối tiếp với bóng đèn',
            'B. Mắc song song hai đầu bóng đèn, đúng cực (+)/(−)',
            'C. Mắc nối tiếp với công tắc khi công tắc mở',
            'D. Mắc thay thế vào vị trí bóng đèn'
          ],
          correctIndex: 1,
          explanation: 'Vôn kế luôn được mắc song song hai đầu đoạn mạch cần đo và cực (+) nối về phía cực dương nguồn.'
        },
        {
          id: 'p9b1-s1-q2',
          question: 'Vì sao trong bộ thí nghiệm KHTN 9 phải dùng biến áp nguồn điện áp thấp (3 V – 12 V) thay cho ổ cắm điện 220 V?',
          options: [
            'A. Vì dòng 220 V không làm sáng bóng đèn',
            'B. Để đảm bảo an toàn điện giật và bảo vệ linh kiện thực hành',
            'C. Vì biến áp nguồn tự tạo ra năng lượng không cần cắm điện',
            'D. Để tăng tốc độ chuyển động của electron lên gấp bội'
          ],
          correctIndex: 1,
          explanation: 'Nguồn điện áp thấp (≤ 24 V) nằm dưới ngưỡng gây giật nguy hiểm cho học sinh và phù hợp thông số linh kiện thực hành.'
        }
      ],
      miniEssay: {
        id: 'p9b1-s1-e1',
        question: 'Giải thích điều gì xảy ra nếu một bạn học sinh vô ý mắc trực tiếp hai chốt của Ampe kế vào hai cực của nguồn pin 6 V không qua điện trở tải.',
        hint: 'Xét điện trở rất nhỏ của Ampe kế và định luật Ohm I = U / R.',
        rubricChecklist: [
          'Nêu đúng Ampe kế có điện trở trong rất nhỏ (gần bằng 0).',
          'Khi mắc trực tiếp vào nguồn gây đoản mạch, dòng điện tăng vọt làm hỏng kim hoặc cháy cầu chì đồng hồ.'
        ],
        sampleAnswer: 'Do Ampe kế có điện trở trong rất nhỏ, khi mắc song song trực tiếp hai cực nguồn điện áp sẽ xảy ra hiện tượng đoản mạch (ngắn mạch). Cường độ dòng điện qua Ampe kế tăng vọt vượt xa giới hạn đo, làm cong kim hoặc cháy cầu chì/cuộn dây bên trong đồng hồ.'
      }
    },
    {
      stepTitle: '2. Bộ Dụng cụ Quang học & Sắp xếp Giá Thí nghiệm',
      stepType: 'derivation',
      conceptSection:
        'Bộ thí nghiệm quang hình KHTN 9 gồm băng quang học chia vạch mm, đèn chiếu khe chữ F, bản bán trụ thủy tinh/nhựa trong, lăng kính tam giác, thấu kính hội tụ – phân kì và màn hứng ảnh.',
      formulaSection: {
        primaryFormula: '\\text{Trục quang học chuẩn: Đèn chiếu} \\leftrightarrow \\text{Vật AB} \\leftrightarrow \\text{Thấu kính} \\leftrightarrow \\text{Màn hứng}',
        secondaryFormulas: [
          'L = d + d\' \\quad (\\text{Khoảng cách vật và màn trên băng quang học})'
        ],
        variablesNote:
          '• **Bản bán trụ thủy tinh**: dùng đo góc tới $i$ và góc khúc xạ $r$ trên bảng chia độ tròn để kiểm chứng định luật khúc xạ và phản xạ toàn phần.\n• **Thấu kính rìa mỏng (hội tụ)** và **thấu kính rìa dày (phân kì)**: đặt thẳng đứng, vuông góc với thanh băng quang học.'
      },
      deepDiveSection:
        'Trước khi đo khoảng cách $d$ và $d\'$ trên băng quang học, phải căn chỉnh tâm của nguồn sáng, vật sáng và quang tâm $O$ của thấu kính cùng nằm trên một đường thẳng song song thanh thước (đồng trục) để ảnh tạo trên màn không bị lệch méo.',
      teacherExplanation:
        'Đừng quên kiểm tra dấu tiêu điểm khắc trên chân đế thấu kính để phân biệt nhanh thấu kính hội tụ (rìa mỏng) với phân kì (rìa dày).',
      keyTakeaway: 'Nguồn sáng, vật và quang tâm thấu kính phải đặt đồng trục và vuông góc với băng quang học.',
      miniQuiz: [
        {
          id: 'p9b1-s2-q1',
          question: 'Khi dùng bản bán trụ thủy tinh đặt trên bảng chia độ tròn để khảo sát hiện tượng khúc xạ ánh sáng, tia laser cần chiếu đi qua điểm nào của mặt phẳng?',
          options: [
            'A. Đúng tâm O của mặt phẳng chia độ',
            'B. Mép rìa ngoài cùng của bảng chia độ',
            'C. Góc nhọn bất kì dưới đáy bảng',
            'D. Phía sau lưng bảng chia độ'
          ],
          correctIndex: 0,
          explanation: 'Chiếu tia tới đi qua đúng tâm O (tâm mặt cong bán trụ) giúp tia khúc xạ truyền theo bán kính ra mặt cong mà không bị bẻ gãy lần hai, đồng thời đọc trực tiếp góc trên vòng chia độ.'
        },
        {
          id: 'p9b1-s2-q2',
          question: 'Cách nhận biết trực tiếp thấu kính hội tụ bằng tay (hoặc thước kẹp) trong bộ dụng cụ thí nghiệm là:',
          options: [
            'A. Phần rìa dày hơn phần giữa',
            'B. Phần rìa mỏng hơn phần giữa',
            'C. Bề mặt đục không cho ánh sáng đi qua',
            'D. Hai mặt hoàn toàn phẳng song song'
          ],
          correctIndex: 1,
          explanation: 'Thấu kính hội tụ bằng thủy tinh hoặc nhựa trong suốt trong không khí luôn có phần rìa mỏng hơn phần giữa.'
        }
      ],
      miniEssay: {
        id: 'p9b1-s2-e1',
        question: 'Tại sao trong thí nghiệm đo khúc xạ ánh sáng người ta lại chế tạo bản thủy tinh có dạng hình bán trụ (nửa hình trụ) mà không dùng tấm phẳng?',
        hint: 'Xét góc tới của tia khúc xạ khi đi từ mặt cong của bán trụ ra không khí.',
        rubricChecklist: [
          'Tia tới đi qua tâm O của mặt phẳng, nên tia khúc xạ đi dọc theo phương bán kính.',
          'Khi gặp mặt cong hình trụ, tia sáng vuông góc với mặt phân cách ($i\' = 0^\\circ$) nên truyền thẳng ra ngoài, giúp đo đúng góc $r$.'
        ],
        sampleAnswer: 'Khi tia sáng chiếu qua đúng tâm O của mặt phẳng bản bán trụ, tia khúc xạ bên trong thủy tinh truyền theo phương bán kính tới mặt cong hình trụ. Do bán kính luôn vuông góc với tiếp tuyến mặt trụ nên tia sáng ló ra mặt cong theo phương vuông góc ($i\' = 0^\\circ$) và truyền thẳng, nhờ đó đọc chính xác góc khúc xạ $r$ mà không bị khúc xạ lần hai.'
      }
    },
    {
      stepTitle: '3. An toàn Thực hành & Ghi chép Sai số Phép đo KHTN 9',
      stepType: 'example',
      conceptSection:
        'Mọi phép đo thực nghiệm đều có sai số do dụng cụ hoặc thao tác đọc. Cần lặp lại phép đo ít nhất 3 lần, tính giá trị trung bình và tuân thủ nghiêm quy tắc an toàn điện – quang – nhiệt.',
      formulaSection: {
        primaryFormula: '\\bar{x} = \\frac{x_1 + x_2 + \\dots + x_n}{n}',
        secondaryFormulas: [
          '\\Delta x_i = |\\bar{x} - x_i|, \\qquad \\overline{\\Delta x} = \\frac{\\Delta x_1 + \\dots + \\Delta x_n}{n}'
        ],
        variablesNote:
          '• **Sai số thị sai**: xảy ra khi mắt nhìn lệch khỏi phương vuông góc mặt thước hoặc mặt đồng hồ kim.\n• **An toàn tia laser**: không chiếu vào mắt; không đặt dụng cụ thủy tinh sát mép bàn dễ rơi vỡ.'
      },
      deepDiveSection:
        'Quy trình thực hành chuẩn 4 bước: (1) Kiểm tra dụng cụ & ngắt nguồn trước khi lắp; (2) Lắp sơ đồ & kiểm tra lại đúng cực/đồng trục; (3) Đo lặp lại nhiều lần với góc nhìn thẳng góc mặt vạch chia; (4) Thu dọn, tắt nguồn và xử lý số liệu trung bình.',
      teacherExplanation:
        'Trong bài báo cáo thực hành, luôn ghi kèm đơn vị SI vào tiêu đề cột bảng số liệu.',
      keyTakeaway: 'Đặt mắt vuông góc vạch chia, đo lặp ≥ 3 lần lấy trung bình và ngắt nguồn trước khi chỉnh mạch.',
      miniQuiz: [
        {
          id: 'p9b1-s3-q1',
          question: 'Ba lần đo chiều dài một đoạn mạch bằng thước có ĐCNN 0,1 cm cho kết quả: 15,2 cm; 15,3 cm; 15,1 cm. Giá trị trung bình là:',
          options: ['A. 15,1 cm', 'B. 15,2 cm', 'C. 15,3 cm', 'D. 15,25 cm'],
          correctIndex: 1,
          explanation: '$\\bar{l} = (15{,}2 + 15{,}3 + 15{,}1)/3 = 15{,}2\\text{ cm}$.'
        },
        {
          id: 'p9b1-s3-q2',
          question: 'Thao tác nào sau đây vi phạm quy tắc an toàn phòng thí nghiệm KHTN 9?',
          options: [
            'A. Rút phích cắm biến áp nguồn sau khi kết thúc thí nghiệm',
            'B. Ngắt công tắc trước khi thay đổi vị trí mắc vôn kế',
            'C. Chiếu thử đèn laser vào gương phẳng hướng về phía bạn cùng bàn',
            'D. Đặt mắt nhìn vuông góc mặt chia độ ampe kế khi đọc số chỉ'
          ],
          correctIndex: 2,
          explanation: 'Tia laser phản xạ từ gương vẫn mang năng lượng cao gây tổn thương võng mạc, tuyệt đối không chiếu hướng về mắt người.'
        }
      ],
      miniEssay: {
        id: 'p9b1-s3-e1',
        question: 'Trình bày 4 bước quy trình chuẩn bị và thu số liệu an toàn cho một bài thực hành Điện học KHTN 9.',
        hint: 'Từ lúc chưa cấp điện đến lúc tính giá trị trung bình và tắt nguồn.',
        rubricChecklist: [
          'Kiểm tra dụng cụ và mắc mạch khi công tắc mở (chưa bật nguồn).',
          'Kiểm tra cực (+)/(−), chọn thang đo phù hợp rồi mới đóng mạch đọc số liệu vuông góc vạch chia; đo lặp nhiều lần và ngắt điện khi xong.'
        ],
        sampleAnswer: 'Bước 1: Kiểm tra đồng hồ đo, nguồn an toàn ≤ 12 V và mở công tắc trước khi lắp mạch. Bước 2: Lắp mạch theo sơ đồ, chú ý ampe kế nối tiếp, vôn kế song song và đúng cực (+)/(−). Bước 3: Đóng mạch, đặt mắt vuông góc vạch chia để đọc số chỉ qua ≥ 3 lần đo tính trung bình. Bước 4: Ngắt nguồn điện trước khi tháo dây và thu dọn thiết bị.'
      }
    }
  ],
  'phys-9-power-bill': [
    {
      stepTitle: '1. Định nghĩa Cơ năng & Mối liên hệ Động năng – Thế năng',
      stepType: 'concept',
      conceptSection:
        'Cơ năng của một vật trong trọng trường là tổng động năng và thế năng trọng trường của vật tại thời điểm đang xét. Khi vật vừa có độ cao so với mốc thế năng vừa đang chuyển động, nó đồng thời mang cả hai dạng năng lượng này.',
      formulaSection: {
        primaryFormula: 'W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh',
        secondaryFormulas: [
          'W_t = P \\cdot h = 10mh \\quad (\\text{khi lấy } g \\approx 10\\text{ m/s}^2)',
          '1\\text{ kJ} = 1000\\text{ J}'
        ],
        variablesNote:
          '• $W_đ$: động năng ($\\text{J}$), $W_t$: thế năng trọng trường ($\\text{J}$), $W$: cơ năng ($\\text{J}$).\n• $h$ là độ cao tính theo phương thẳng đứng so với mốc thế năng đã chọn (thường chọn mặt đất $h = 0$).'
      },
      deepDiveSection:
        'Lưu ý giá trị thế năng phụ thuộc vào **mốc chọn độ cao**: nếu chọn mặt đất làm mốc thì vật trên bàn cao $1\\text{ m}$ có $W_t > 0$, nhưng nếu chọn chính mặt bàn làm mốc thì $W_t = 0$. Tuy nhiên hiệu thế năng giữa hai vị trí không phụ thuộc cách chọn mốc.',
      teacherExplanation:
        'Luôn xác định rõ mốc thế năng ($h = 0$) và quy đổi $m$ về $\\text{kg}$, $v$ về $\\text{m/s}$, $h$ về $\\text{m}$ trước khi cộng $W_đ + W_t$.',
      keyTakeaway: 'Cơ năng là tổng động năng và thế năng ($W = W_đ + W_t$), đo bằng Jun (J).',
      miniQuiz: [
        {
          id: 'p9pb-s1-q1',
          question: 'Một viên đá khối lượng $0{,}5\\text{ kg}$ đang bay ngang ở độ cao $4\\text{ m}$ so với mặt đất với tốc độ $6\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). Cơ năng của viên đá so với mặt đất bằng:',
          options: ['A. $9\\text{ J}$', 'B. $20\\text{ J}$', 'C. $29\\text{ J}$', 'D. $38\\text{ J}$'],
          correctIndex: 2,
          explanation: '$W_đ = \\frac{1}{2}\\cdot 0{,}5 \\cdot 6^2 = 9\\text{ J}$; $W_t = 0{,}5\\cdot 10\\cdot 4 = 20\\text{ J} \\implies W = 9 + 20 = 29\\text{ J}$.'
        },
        {
          id: 'p9pb-s1-q2',
          question: 'Ở vị trí cao nhất khi quả bóng được ném thẳng đứng lên trên và dừng lại tức thời trước khi rơi xuống, dạng năng lượng nào bằng 0?',
          options: ['A. Thế năng trọng trường', 'B. Động năng', 'C. Cơ năng', 'D. Trọng lượng'],
          correctIndex: 1,
          explanation: 'Tại điểm cao nhất, vận tốc tức thời $v = 0$ nên động năng $W_đ = 0$; toàn bộ cơ năng là thế năng.'
        }
      ],
      miniEssay: {
        id: 'p9pb-s1-e1',
        question: 'Một máy bay mô hình nặng $2\\text{ kg}$ bay ở độ cao $15\\text{ m}$ với tốc độ $36\\text{ km/h}$ ($g = 10\\text{ m/s}^2$). Tính động năng, thế năng và cơ năng của mô hình so với mặt đất.',
        hint: 'Đổi $36\\text{ km/h} = 10\\text{ m/s}$ trước khi áp dụng $W = \\frac{1}{2}mv^2 + mgh$.',
        rubricChecklist: [
          'Tính đúng động năng $W_đ = \\frac{1}{2}\\cdot 2\\cdot 10^2 = 100\\text{ J}$.',
          'Tính đúng thế năng $W_t = 2\\cdot 10\\cdot 15 = 300\\text{ J}$ và tổng cơ năng $W = 400\\text{ J}$.'
        ],
        sampleAnswer: 'Đổi tốc độ $v = 36/3{,}6 = 10\\text{ m/s}$. Động năng của mô hình là $W_đ = \\frac{1}{2}mv^2 = 0{,}5 \\times 2 \\times 10^2 = 100\\text{ J}$. Thế năng trọng trường là $W_t = mgh = 2 \\times 10 \\times 15 = 300\\text{ J}$. Vậy cơ năng tổng cộng bằng $W = W_đ + W_t = 100 + 300 = 400\\text{ J}$.'
      }
    },
    {
      stepTitle: '2. Sự Chuyển hóa & Định luật Bảo toàn Cơ năng',
      stepType: 'derivation',
      conceptSection:
        'Trong quá trình vật chuyển động chỉ dưới tác dụng của trọng lực (bỏ qua ma sát và lực cản không khí), động năng và thế năng liên tục chuyển hóa qua lại cho nhau nhưng tổng cơ năng của vật luôn được bảo toàn.',
      formulaSection: {
        primaryFormula: 'W = W_đ + W_t = \\text{hằng số} \\iff \\frac{1}{2}mv_1^2 + mgh_1 = \\frac{1}{2}mv_2^2 + mgh_2',
        secondaryFormulas: [
          'v_{\\text{chạm đất}} = \\sqrt{2gh_0} \\quad (\\text{thả rơi không vận tốc đầu})',
          'h_{\\max} = \\frac{v_0^2}{2g} \\quad (\\text{ném thẳng đứng lên từ mặt đất})'
        ],
        variablesNote:
          '• Khi vật đi **xuống**: $h$ giảm ($W_t$ giảm) $\\implies v$ tăng ($W_đ$ tăng): **thế năng chuyển hóa thành động năng**.\n• Khi vật đi **lên**: $h$ tăng ($W_t$ tăng) $\\implies v$ giảm ($W_đ$ giảm): **động năng chuyển hóa thành thế năng**.'
      },
      deepDiveSection:
        'Quan sát thí nghiệm con lắc đơn hoặc thả bóng rơi tự do trên bảng mô phỏng: độ cao cột $W_đ$ giảm bao nhiêu thì cột $W_t$ tăng bấy nhiêu sao cho mực tổng $W = W_đ + W_t$ giữ nguyên không đổi qua mọi vị trí.',
      teacherExplanation:
        'Mẹo giải nhanh: Nếu bài hỏi tốc độ ở một độ cao hoặc độ cao cực đại và bỏ qua lực cản, dùng bảo toàn cơ năng hai đầu cực kỳ nhanh gọn mà không cần tính thời gian.',
      keyTakeaway: 'Khi không có lực cản/ma sát, thế năng giảm bao nhiêu thì động năng tăng đúng bấy nhiêu.',
      miniQuiz: [
        {
          id: 'p9pb-s2-q1',
          question: 'Thả rơi tự do một quả bóng nặng $1\\text{ kg}$ từ độ cao $h_0 = 20\\text{ m}$ ($g = 10\\text{ m/s}^2$, bỏ qua cản). Khi vật rơi xuống độ cao $h = 5\\text{ m}$, động năng của vật bằng:',
          options: ['A. $50\\text{ J}$', 'B. $150\\text{ J}$', 'C. $200\\text{ J}$', 'D. $100\\text{ J}$'],
          correctIndex: 1,
          explanation: 'Cơ năng $W = 1\\cdot 10\\cdot 20 = 200\\text{ J}$. Tại $h = 5\\text{ m}$, $W_t = 1\\cdot 10\\cdot 5 = 50\\text{ J} \\implies W_đ = 200 - 50 = 150\\text{ J}$.'
        },
        {
          id: 'p9pb-s2-q2',
          question: 'Khi thả một vật rơi không vận tốc đầu từ độ cao $45\\text{ m}$ (bỏ qua lực cản không khí, $g = 10\\text{ m/s}^2$), tốc độ ngay trước khi chạm đất bằng:',
          options: ['A. $30\\text{ m/s}$', 'B. $20\\text{ m/s}$', 'C. $15\\text{ m/s}$', 'D. $45\\text{ m/s}$'],
          correctIndex: 0,
          explanation: '$v = \\sqrt{2gh_0} = \\sqrt{2\\cdot 10\\cdot 45} = \\sqrt{900} = 30\\text{ m/s}$.'
        }
      ],
      miniEssay: {
        id: 'p9pb-s2-e1',
        question: 'Ném thẳng đứng một quả bóng nặng $0{,}4\\text{ kg}$ từ độ cao $2\\text{ m}$ lên trên với tốc độ $10\\text{ m/s}$ ($g = 10\\text{ m/s}^2$, bỏ qua cản không khí). Tính độ cao cực đại quả bóng đạt được so với mặt đất.',
        hint: 'Lập phương trình bảo toàn cơ năng giữa vị trí ném và điểm cao nhất ($v = 0$).',
        rubricChecklist: [
          'Tính cơ năng ban đầu $W = \\frac{1}{2}\\cdot 0{,}4\\cdot 10^2 + 0{,}4\\cdot 10\\cdot 2 = 28\\text{ J}$.',
          'Cho $mgh_{\\max} = 28\\text{ J} \\implies h_{\\max} = 7\\text{ m}$.'
        ],
        sampleAnswer: 'Cơ năng ban đầu lúc ném: $W = \\frac{1}{2}mv_0^2 + mgh_0 = 0{,}5 \\times 0{,}4 \\times 10^2 + 0{,}4 \\times 10 \\times 2 = 20 + 8 = 28\\text{ J}$. Tại độ cao cực đại $h_{\\max}$, $v = 0$ nên $W = mgh_{\\max} = 28\\text{ J} \\Rightarrow h_{\\max} = \\frac{28}{0{,}4 \\times 10} = 7\\text{ m}$.'
      }
    },
    {
      stepTitle: '3. Cơ năng khi có Ma sát – Hao phí & Thực hành Con lắc',
      stepType: 'example',
      conceptSection:
        'Trong thực tế luôn có lực cản không khí và ma sát tại trục treo hoặc mặt tiếp xúc. Do đó cơ năng của vật giảm dần theo thời gian, phần cơ năng bị hao hụt đã chuyển hóa thành nhiệt năng và năng lượng âm thanh.',
      formulaSection: {
        primaryFormula: '\\Delta W_{\\text{hao phí}} = W_{\\text{trước}} - W_{\\text{sau}} = A_{\\text{cản/ms}} > 0',
        secondaryFormulas: [
          'Q_{\\text{tỏa nhiệt}} = W_{\\text{đầu}} - W_{\\text{cuối}} = F_{ms} \\cdot s',
          'H = \\frac{W_{\\text{sau}}}{W_{\\text{trước}}} \\cdot 100\\% < 100\\%'
        ],
        variablesNote:
          '• Năng lượng toàn phần vẫn được bảo toàn, chỉ có **cơ năng** bị giảm do chuyển thành nội năng (nhiệt năng).\n• Con lắc đơn trong không khí dao động với biên độ nhỏ dần và cuối cùng dừng hẳn ở vị trí cân bằng.'
      },
      deepDiveSection:
        'Mở mô phỏng 2D bên trên và tăng dần hệ số ma sát $\\mu$: bạn sẽ thấy cột năng lượng hao phí màu xám tăng lên đúng bằng phần cơ năng có ích giảm đi, giải thích vì sao tàu lượn siêu tốc luôn có đỉnh dốc sau thấp hơn đỉnh xuất phát.',
      teacherExplanation:
        'Phân biệt câu hỏi trắc nghiệm: "Năng lượng có bị mất đi không?" → KHÔNG (chỉ chuyển sang nhiệt năng); "Cơ năng có bảo toàn khi có ma sát không?" → KHÔNG (cơ năng giảm dần).',
      keyTakeaway: 'Có ma sát thì cơ năng giảm dần (chuyển thành nhiệt năng), nhưng tổng năng lượng vẫn bảo toàn.',
      miniQuiz: [
        {
          id: 'p9pb-s3-q1',
          question: 'Thả một hòn bi lăn từ đỉnh dốc $A$ qua đáy $B$ rồi leo lên dốc bên kia tới độ cao cực đại $C$ thấp hơn $A$. Nguyên nhân là do:',
          options: [
            'A. Năng lượng bị tự hủy mất trên đường đi',
            'B. Một phần cơ năng đã chuyển hóa thành nhiệt năng do ma sát',
            'C. Trọng lực kéo vật ở hai bên dốc khác nhau',
            'D. Khối lượng hòn bi tăng lên khi xuống dốc'
          ],
          correctIndex: 1,
          explanation: 'Do có lực ma sát lăn và lực cản không khí nên cơ năng giảm dần, phần hụt chuyển thành nhiệt năng làm đỉnh $C$ thấp hơn $A$.'
        },
        {
          id: 'p9pb-s3-q2',
          question: 'Một quả bóng nặng $0{,}2\\text{ kg}$ rơi từ độ cao $10\\text{ m}$ ($g = 10\\text{ m/s}^2$), do lực cản không khí nên khi chạm đất tốc độ chỉ đạt $12\\text{ m/s}$. Phần cơ năng chuyển hóa thành nhiệt là:',
          options: ['A. $5{,}6\\text{ J}$', 'B. $14{,}4\\text{ J}$', 'C. $20\\text{ J}$', 'D. $4{,}0\\text{ J}$'],
          correctIndex: 0,
          explanation: '$W_1 = 0{,}2\\cdot 10\\cdot 10 = 20\\text{ J}$; $W_2 = \\frac{1}{2}\\cdot 0{,}2\\cdot 12^2 = 14{,}4\\text{ J} \\implies \\Delta W = 20 - 14{,}4 = 5{,}6\\text{ J}$.'
        }
      ],
      miniEssay: {
        id: 'p9pb-s3-e1',
        question: 'Trong công viên giải trí, tàu lượn siêu tốc nặng $800\\text{ kg}$ xuất phát gần như đứng yên từ đỉnh dốc cao $30\\text{ m}$. Khi xuống tới điểm thấp cao $5\\text{ m}$, tốc độ tàu đạt $20\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). Tính phần cơ năng đã hao phí thành nhiệt do ma sát.',
        hint: 'Tính $W_{\\text{đỉnh}} = mgh_1$ và $W_{\\text{đáy}} = \\frac{1}{2}mv^2 + mgh_2$ rồi lấy hiệu.',
        rubricChecklist: [
          'Tính $W_1 = 800\\cdot 10\\cdot 30 = 240\\text{ kJ}$.',
          'Tính $W_2 = 0{,}5\\cdot 800\\cdot 20^2 + 800\\cdot 10\\cdot 5 = 200\\text{ kJ} \\implies Q_{\\text{hp}} = 40\\text{ kJ}$.'
        ],
        sampleAnswer: 'Cơ năng ở đỉnh dốc: $W_1 = mgh_1 = 800 \\times 10 \\times 30 = 240\\,000\\text{ J} = 240\\text{ kJ}$. Cơ năng tại vị trí sau: $W_2 = \\frac{1}{2}\\times 800 \\times 20^2 + 800 \\times 10 \\times 5 = 160\\,000 + 40\\,000 = 200\\text{ kJ}$. Vậy phần cơ năng đã chuyển hóa thành nhiệt năng do ma sát là $\\Delta W = 240 - 200 = 40\\text{ kJ}$.'
      }
    }
  ],
  'phys-9-b4': [
    {
      stepTitle: '1. Công Cơ học & Điều kiện Sinh công',
      stepType: 'concept',
      conceptSection:
        'Trong Vật lí, chỉ có công cơ học khi có lực tác dụng lên vật và làm cho vật dịch chuyển một quãng đường theo phương không vuông góc với phương của lực.',
      formulaSection: {
        primaryFormula: 'A = F \\cdot s \\quad (\\text{khi lực cùng hướng dịch chuyển})',
        secondaryFormulas: [
          'A = F \\cdot s \\cdot \\cos\\alpha \\quad (\\text{tổng quát khi lực hợp góc } \\alpha)',
          '1\\text{ J} = 1\\text{ N}\\cdot\\text{m}, \\quad 1\\text{ kJ} = 1000\\text{ J}'
        ],
        variablesNote:
          '• $F$: độ lớn lực tác dụng ($\\text{N}$), $s$: quãng đường dịch chuyển ($\\text{m}$).\n• Nếu lực vuông góc với phương dịch chuyển ($\\alpha = 90^\\circ$) hoặc vật đứng yên ($s = 0$) thì công cơ học bằng $0$.'
      },
      deepDiveSection:
        'Người kéo gàu nước từ giếng lên thực hiện công vì lực kéo cùng hướng chuyển động lên trên. Trái lại, một bạn đeo ba-lô đi bộ đều trên sân trường phẳng ngang: lực nâng của vai hướng thẳng đứng còn chuyển động theo phương ngang ($\\alpha = 90^\\circ$) nên lực nâng vai không sinh công cơ học.',
      teacherExplanation:
        'Kéo thanh trượt Góc kéo $\\alpha$ trên mô phỏng 2D để kiểm chứng giá trị $\\cos\\alpha$: khi $\\alpha$ tăng dần từ $0^\\circ$ tới $75^\\circ$, phần lực kéo hiệu dụng $F_x = F\\cos\\alpha$ và công $A$ giảm rõ rệt.',
      keyTakeaway: 'Công cơ học $A = Fs\\cos\\alpha$; lực vuông góc hướng dịch chuyển thì không sinh công.',
      miniQuiz: [
        {
          id: 'p9b4-s1-q1',
          question: 'Trường hợp nào sau đây có công cơ học của trọng lực khác 0?',
          options: [
            'A. Hòn đá nằm yên trên mặt bàn',
            'B. Ô tô chuyển động thẳng đều trên đường nằm ngang',
            'C. Quả dừa rơi từ trên cây xuống đất',
            'D. Vệ tinh chuyển động tròn đều quanh Trái Đất'
          ],
          correctIndex: 2,
          explanation: 'Khi quả dừa rơi thẳng đứng xuống đất, trọng lực có phương và chiều trùng với chiều dịch chuyển nên thực hiện công dương.'
        },
        {
          id: 'p9b4-s1-q2',
          question: 'Một công nhân đẩy xe hàng với lực $150\\text{ N}$ dọc theo hướng chuyển động được quãng đường $20\\text{ m}$. Công người đó thực hiện là:',
          options: ['A. $7{,}5\\text{ J}$', 'B. $300\\text{ J}$', 'C. $3000\\text{ J}$', 'D. $170\\text{ J}$'],
          correctIndex: 2,
          explanation: '$A = F\\cdot s = 150 \\cdot 20 = 3000\\text{ J} = 3\\text{ kJ}$.'
        }
      ],
      miniEssay: {
        id: 'p9b4-s1-e1',
        question: 'Một người kéo thùng gỗ bằng lực $F = 100\\text{ N}$ theo phương nghiêng góc $\\alpha = 60^\\circ$ so với mặt sàn nằm ngang đi được đoạn $s = 12\\text{ m}$. Tính công của lực kéo và giải thích tại sao nhỏ hơn $1200\\text{ J}$.',
        hint: 'Dùng thành phần lực theo phương dịch chuyển $F_x = F\\cos 60^\\circ$.',
        rubricChecklist: [
          'Tính đúng $A = 100 \\cdot 12 \\cdot \\cos 60^\\circ = 600\\text{ J}$.',
          'Giải thích chỉ thành phần $F\\cos\\alpha$ cùng phương dịch chuyển mới sinh công, thành phần $F\\sin\\alpha$ vuông góc không sinh công.'
        ],
        sampleAnswer: 'Thành phần lực kéo theo phương ngang là $F_x = F\\cos 60^\\circ = 100 \\times 0{,}5 = 50\\text{ N}$. Công của lực kéo là $A = F_x \\cdot s = 50 \\times 12 = 600\\text{ J}$. Giá trị này nhỏ hơn $1200\\text{ J}$ vì thành phần $F\\sin 60^\\circ$ vuông góc với sàn không trực tiếp làm vật tiến lên phía trước.'
      }
    },
    {
      stepTitle: '2. Công suất — Tốc độ Thực hiện Công',
      stepType: 'derivation',
      conceptSection:
        'Để biết thiết bị hoặc người nào làm việc khỏe hơn (thực hiện công nhanh hơn), người ta dùng đại lượng công suất — được xác định bằng công thực hiện được trong một giây.',
      formulaSection: {
        primaryFormula: '\\mathscr{P} = \\frac{A}{t} = F \\cdot v',
        secondaryFormulas: [
          '1\\text{ W} = 1\\text{ J/s}, \\quad 1\\text{ kW} = 1000\\text{ W}, \\quad 1\\text{ MW} = 10^6\\text{ W}',
          '1\\text{ HP (mã lực)} \\approx 746\\text{ W}'
        ],
        variablesNote:
          '• $\\mathscr{P}$: công suất (Oát, $\\text{W}$), $A$: công thực hiện ($\\text{J}$), $t$: thời gian thực hiện công ($\\text{s}$).\n• Khi lực kéo $F$ dọc hướng chuyển động có tốc độ $v$: $\\mathscr{P} = F \\cdot v$.'
      },
      deepDiveSection:
        'Trên các động cơ xe máy, ô tô hay máy bơm nước đều ghi công suất (kW hoặc W). Một máy bơm $750\\text{ W}$ trong $1$ giây có thể sinh công cơ học tối đa $750\\text{ J}$. Nếu hai máy nâng cùng một bao xi măng lên tầng 3 (cùng công $A$), máy nào nâng mất ít thời gian $t$ hơn thì có công suất lớn hơn.',
      teacherExplanation:
        'Luôn phân biệt rõ: Công $A$ (Jun) hỏi "làm được bao nhiêu việc"; Công suất $\\mathscr{P}$ (Oát) hỏi "làm nhanh tới mức nào".',
      keyTakeaway: 'Công suất $\\mathscr{P} = A/t = Fv$ đặc trưng cho tốc độ sinh công nhanh hay chậm.',
      miniQuiz: [
        {
          id: 'p9b4-s2-q1',
          question: 'Một con ngựa kéo xe đi đều với lực kéo $400\\text{ N}$ ở tốc độ $5\\text{ m/s}$. Công suất của con ngựa là:',
          options: ['A. $80\\text{ W}$', 'B. $2000\\text{ W}$', 'C. $405\\text{ W}$', 'D. $4000\\text{ W}$'],
          correctIndex: 1,
          explanation: '$\\mathscr{P} = F\\cdot v = 400 \\cdot 5 = 2000\\text{ W} = 2\\text{ kW}$.'
        },
        {
          id: 'p9b4-s2-q2',
          question: 'Cần cẩu A nâng vật nặng $600\\text{ kg}$ lên cao $5\\text{ m}$ trong $15\\text{ s}$; cần cẩu B nâng vật $400\\text{ kg}$ lên cao $6\\text{ m}$ trong $8\\text{ s}$ ($g = 10\\text{ m/s}^2$). So sánh công suất hai cần cẩu:',
          options: ['A. $\\mathscr{P}_A > \\mathscr{P}_B$', 'B. $\\mathscr{P}_A < \\mathscr{P}_B$', 'C. $\\mathscr{P}_A = \\mathscr{P}_B$', 'D. Không so sánh được'],
          correctIndex: 1,
          explanation: '$\\mathscr{P}_A = (6000\\cdot 5)/15 = 2000\\text{ W}$; $\\mathscr{P}_B = (4000\\cdot 6)/8 = 3000\\text{ W} \\implies \\mathscr{P}_A < \\mathscr{P}_B$.'
        }
      ],
      miniEssay: {
        id: 'p9b4-s2-e1',
        question: 'Một máy bơm nước có công suất có ích $800\\text{ W}$ hoạt động liên tục trong $10\\text{ phút}$. Tính tổng lượng công cơ học máy thực hiện và khối lượng nước tối đa máy bơm được lên bồn cao $16\\text{ m}$ ($g = 10\\text{ m/s}^2$).',
        hint: 'Đổi $t = 600\\text{ s}$, tính $A = \\mathscr{P}\\cdot t$ rồi cho $A = 10mh$.',
        rubricChecklist: [
          'Tính $A = 800 \\cdot 600 = 480\\,000\\text{ J} = 480\\text{ kJ}$.',
          'Tính $m = 480\\,000 / (10 \\cdot 16) = 3000\\text{ kg}$ (3 mét khối nước).'
        ],
        sampleAnswer: 'Đổi $t = 10\\text{ phút} = 600\\text{ s}$. Công máy bơm thực hiện được là $A = \\mathscr{P}\\cdot t = 800 \\times 600 = 480\\,000\\text{ J}$. Ta có $A = P\\cdot h = 10mh \\Rightarrow m = \\frac{480\\,000}{10 \\times 16} = 3000\\text{ kg}$ ($3\\text{ m}^3$ nước).'
      }
    },
    {
      stepTitle: '3. Hiệu suất Máy cơ Đơn giản & Công Thắng Ma sát',
      stepType: 'example',
      conceptSection:
        'Các máy cơ đơn giản (mặt phẳng nghiêng, ròng rọc, đòn bẩy) giúp giảm lực kéo cần thiết nhưng luôn có ma sát làm phát sinh công vô ích, khiến công toàn phần bỏ ra luôn lớn hơn công có ích.',
      formulaSection: {
        primaryFormula: 'H = \\frac{A_{\\text{ích}}}{A_{\\text{tp}}} \\cdot 100\\% = \\frac{\\mathscr{P}_{\\text{ích}}}{\\mathscr{P}_{\\text{tp}}} \\cdot 100\\%',
        secondaryFormulas: [
          'A_{\\text{tp}} = A_{\\text{ích}} + A_{\\text{vô ích}}',
          '\\text{Mặt phẳng nghiêng: } A_{\\text{ích}} = P\\cdot h,\\; A_{\\text{tp}} = F\\cdot l,\\; A_{ms} = F_{ms}\\cdot l'
        ],
        variablesNote:
          '• $A_{\\text{ích}}$: công thực sự dùng để nâng/dịch chuyển vật theo mục tiêu (vd: $P\\cdot h$).\n• $A_{\\text{vô ích}}$: công thắng ma sát và nâng các bộ phận phụ (dây, ròng rọc).'
      },
      deepDiveSection:
        'Định luật bảo toàn công khẳng định: không một máy cơ đơn giản nào cho ta lợi về công — được lợi bao nhiêu lần về lực thì lại thiệt bấy nhiêu lần về đường đi. Hiệu suất $H$ càng cao chứng tỏ ma sát càng nhỏ (bôi trơn dầu mỡ, dùng ổ bi).',
      teacherExplanation:
        'Trên mô phỏng 2D, thử giảm hệ số ma sát $\\mu$ về $0$ để thấy hiệu suất $H$ tiến tới $100\\%$, còn khi $\\mu$ lớn thì công ma sát chiếm tỉ lệ lớn.',
      keyTakeaway: 'Công có ích luôn nhỏ hơn công toàn phần ($H < 100\\%$) do hao phí thắng ma sát.',
      miniQuiz: [
        {
          id: 'p9b4-s3-q1',
          question: 'Dùng ròng rọc động đưa vật nặng $450\\text{ N}$ lên cao $3\\text{ m}$, người ta phải kéo đầu dây đi $6\\text{ m}$ với lực $250\\text{ N}$. Hiệu suất của ròng rọc là:',
          options: ['A. $85\\%$', 'B. $90\\%$', 'C. $75\\%$', 'D. $95\\%$'],
          correctIndex: 1,
          explanation: '$A_{\\text{ích}} = 450\\cdot 3 = 1350\\text{ J}$; $A_{\\text{tp}} = 250\\cdot 6 = 1500\\text{ J} \\implies H = \\frac{1350}{1500} = 90\\%$.'
        },
        {
          id: 'p9b4-s3-q2',
          question: 'Để tăng hiệu suất của mặt phẳng nghiêng khi kéo vật nặng lên xe tải, biện pháp nào đúng?',
          options: [
            'A. Rải cát lên bề mặt ván trượt',
            'B. Làm nhẵn bề mặt ván hoặc kê con lăn dưới đáy thùng hàng',
            'C. Kéo vật thật giật cục theo hình zích-zắc',
            'D. Tăng khối lượng của tấm ván lên gấp đôi'
          ],
          correctIndex: 1,
          explanation: 'Làm nhẵn mặt ván hoặc dùng con lăn giúp giảm lực ma sát trượt, giảm công hao phí $A_{ms}$ và tăng hiệu suất $H$.'
        }
      ],
      miniEssay: {
        id: 'p9b4-s3-e1',
        question: 'Kéo đều một khối hàng nặng $80\\text{ kg}$ lên sàn cao $1{,}5\\text{ m}$ bằng mặt phẳng nghiêng dài $5\\text{ m}$ có hiệu suất $80\\%$ ($g = 10\\text{ m/s}^2$). Tính lực kéo cần tác dụng dọc mặt phẳng nghiêng và lực ma sát giữa hàng với ván.',
        hint: 'Tính $A_{\\text{ích}} = Ph$, sau đó suy ra $A_{\\text{tp}} = A_{\\text{ích}}/0{,}8$, cuối cùng tìm $F$ và $F_{ms}$.',
        rubricChecklist: [
          'Tính đúng $A_{\\text{ích}} = 800\\cdot 1{,}5 = 1200\\text{ J}$ và $A_{\\text{tp}} = 1200/0{,}8 = 1500\\text{ J}$.',
          'Tính được $F = 1500/5 = 300\\text{ N}$ và $F_{ms} = (1500 - 1200)/5 = 60\\text{ N}$.'
        ],
        sampleAnswer: 'Trọng lượng hàng $P = 10m = 800\\text{ N}$. Công có ích là $A_{\\text{ích}} = P\\cdot h = 800 \\times 1{,}5 = 1200\\text{ J}$. Do hiệu suất $80\\%$, công toàn phần là $A_{\\text{tp}} = \\frac{1200}{0{,}8} = 1500\\text{ J}$. Lực kéo cần tác dụng là $F = \\frac{A_{\\text{tp}}}{l} = \\frac{1500}{5} = 300\\text{ N}$. Công thắng ma sát là $A_{ms} = 1500 - 1200 = 300\\text{ J} \\Rightarrow F_{ms} = \\frac{300}{5} = 60\\text{ N}$.'
      }
    }
  ],
  'phys-9-b5': [
    {
      stepTitle: '1. Hiện tượng & Định luật Khúc xạ Ánh sáng',
      stepType: 'concept',
      conceptSection:
        'Khúc xạ ánh sáng là hiện tượng tia sáng truyền xiên góc qua mặt phân cách giữa hai môi trường trong suốt khác nhau bị gãy khúc ngay tại mặt phân cách.',
      formulaSection: {
        primaryFormula: 'n_1 \\sin i = n_2 \\sin r \\quad\\Longleftrightarrow\\quad \\frac{\\sin i}{\\sin r} = \\frac{n_2}{n_1}',
        secondaryFormulas: [
          'i = 0^\\circ \\implies r = 0^\\circ \\; (\\text{chiếu vuông góc thì truyền thẳng})'
        ],
        variablesNote:
          '• $i$: góc tới (góc giữa tia tới và pháp tuyến tại điểm tới $I$).\n• $r$: góc khúc xạ (góc giữa tia khúc xạ và pháp tuyến).\n• Tia khúc xạ nằm trong mặt phẳng tới và ở bên kia pháp tuyến so với tia tới.'
      },
      deepDiveSection:
        'Nếu ánh sáng đi từ môi trường chiết suất nhỏ sang lớn hơn ($n_1 < n_2$, ví dụ không khí sang nước/thủy tinh) thì tia khúc xạ bị bẻ **gần pháp tuyến** hơn ($r < i$). Ngược lại khi đi từ nước ra không khí ($n_1 > n_2$), tia khúc xạ lệch **xa pháp tuyến** hơn ($r > i$).',
      teacherExplanation:
        'Luôn dựng đường pháp tuyến vuông góc mặt phân cách trước khi đọc số đo góc $i$ và góc $r$; tuyệt đối không lấy nhầm góc hợp với mặt nước.',
      keyTakeaway: 'Khi đi vào môi trường chiết quang hơn ($n_2 > n_1$), tia khúc xạ gãy lại gần pháp tuyến ($r < i$).',
      miniQuiz: [
        {
          id: 'p9b5-s1-q1',
          question: 'Chiếu tia sáng từ không khí ($n_1 = 1$) vào thủy tinh ($n_2 = 1{,}5$) sao cho góc hợp bởi tia tới và mặt thủy tinh bằng $30^\\circ$. Góc tới $i$ bằng bao nhiêu?',
          options: ['A. $30^\\circ$', 'B. $60^\\circ$', 'C. $45^\\circ$', 'D. $15^\\circ$'],
          correctIndex: 1,
          explanation: 'Góc tới là góc giữa tia tới và pháp tuyến: $i = 90^\\circ - 30^\\circ = 60^\\circ$.'
        },
        {
          id: 'p9b5-s1-q2',
          question: 'Theo định luật khúc xạ ánh sáng, đại lượng nào không đổi khi thay đổi góc tới $i$ đối với cùng một cặp hai môi trường trong suốt?',
          options: ['A. Hiệu $(i - r)$', 'B. Tỉ số $i / r$', 'C. Tỉ số $\\sin i / \\sin r$', 'D. Tổng $(i + r)$'],
          correctIndex: 2,
          explanation: 'Theo định luật Snell – Descartes, $\\frac{\\sin i}{\\sin r} = \\frac{n_2}{n_1} = \\text{hằng số}$.'
        }
      ],
      miniEssay: {
        id: 'p9b5-s1-e1',
        question: 'Chiếu một tia sáng từ không khí ($n_1 = 1$) vào bề mặt khối nhựa trong suốt với góc tới $i = 60^\\circ$, góc khúc xạ đo được là $r = 30^\\circ$. Tính chiết suất của nhựa và góc lệch $D = |i - r|$ của tia sáng.',
        hint: 'Thay $i = 60^\\circ, r = 30^\\circ$ vào công thức $n_2 = \\sin i / \\sin r$.',
        rubricChecklist: [
          'Tính đúng $n_2 = \\sin 60^\\circ / \\sin 30^\\circ = \\sqrt{3} \\approx 1{,}732$.',
          'Tính góc lệch $D = 60^\\circ - 30^\\circ = 30^\\circ$.'
        ],
        sampleAnswer: 'Áp dụng định luật khúc xạ: $1 \\cdot \\sin 60^\\circ = n_2 \\cdot \\sin 30^\\circ \\Rightarrow n_2 = \\frac{\\sqrt{3}/2}{1/2} = \\sqrt{3} \\approx 1{,}73$. Góc lệch hướng truyền của tia sáng là $D = i - r = 60^\\circ - 30^\\circ = 30^\\circ$.'
      }
    },
    {
      stepTitle: '2. Chiết suất Tuyệt đối & So sánh Tốc độ Ánh sáng',
      stepType: 'derivation',
      conceptSection:
        'Nguyên nhân sâu xa của hiện tượng khúc xạ là ánh sáng truyền với tốc độ chậm đi khi đi vào các môi trường vật chất như nước, thủy tinh hay kim cương so với chân không.',
      formulaSection: {
        primaryFormula: 'n = \\frac{c}{v} \\ge 1',
        secondaryFormulas: [
          'n_{21} = \\frac{n_2}{n_1} = \\frac{v_1}{v_2} \\quad (\\text{chiết suất tỉ đối})',
          'c \\approx 3 \\cdot 10^8\\text{ m/s}'
        ],
        variablesNote:
          '• Không khí: $n \\approx 1{,}0003 \\approx 1$; Nước: $n \\approx 1{,}33$; Thủy tinh: $n \\approx 1{,}5$; Kim cương: $n \\approx 2{,}42$.\n• Chiết suất $n$ càng lớn thì tốc độ truyền ánh sáng $v = c/n$ trong môi trường đó càng nhỏ.'
      },
      deepDiveSection:
        'Kim cương có chiết suất rất lớn ($n = 2{,}42$) làm tia sáng đi qua bị bẻ gãy góc mạnh và phản xạ nhiều lần bên trong viên đá cắt gọt, tạo nên vẻ lấp lánh đặc trưng mà thủy tinh thường ($n = 1{,}5$) khó sánh bằng.',
      teacherExplanation:
        'Thay đổi thanh trượt $n_2$ trên mô phỏng từ $1{,}33$ (nước) lên $1{,}5$ (thủy tinh) rồi $2{,}4$ (kim cương) để thấy tia khúc xạ ép sát dần vào đường pháp tuyến.',
      keyTakeaway: 'Chiết suất tuyệt đối $n = c/v$ đo mức độ làm chậm ánh sáng của môi trường.',
      miniQuiz: [
        {
          id: 'p9b5-s2-q1',
          question: 'Tốc độ truyền ánh sáng trong thủy tinh có chiết suất $n = 1{,}5$ bằng bao nhiêu ($c = 3\\cdot 10^8\\text{ m/s}$)?',
          options: ['A. $4{,}5\\cdot 10^8\\text{ m/s}$', 'B. $2{,}0\\cdot 10^8\\text{ m/s}$', 'C. $1{,}5\\cdot 10^8\\text{ m/s}$', 'D. $2{,}25\\cdot 10^8\\text{ m/s}$'],
          correctIndex: 1,
          explanation: '$v = c/n = 3\\cdot 10^8 / 1{,}5 = 2{,}0\\cdot 10^8\\text{ m/s}$.'
        },
        {
          id: 'p9b5-s2-q2',
          question: 'Trong các chất trong suốt: không khí ($n=1$), nước ($n=1{,}33$), thủy tinh ($n=1{,}5$) và kim cương ($n=2{,}4$), ánh sáng truyền chậm nhất trong chất nào?',
          options: ['A. Không khí', 'B. Nước', 'C. Thủy tinh', 'D. Kim cương'],
          correctIndex: 3,
          explanation: 'Vì $v = c/n$, môi trường nào có chiết suất $n$ lớn nhất thì tốc độ ánh sáng trong đó nhỏ nhất.'
        }
      ],
      miniEssay: {
        id: 'p9b5-s2-e1',
        question: 'Ánh sáng truyền trong một loại dầu thực vật trong suốt có tốc độ đo được là $v = 2{,}04\\cdot 10^8\\text{ m/s}$. Tính chiết suất của dầu và góc khúc xạ khi chiếu tia sáng từ không khí vào dầu với góc tới $i = 45^\\circ$.',
        hint: 'Tính $n_2 = c/v$, sau đó tính $\\sin r = \\sin 45^\\circ / n_2$.',
        rubricChecklist: [
          'Tính đúng chiết suất $n_2 = 3 / 2{,}04 \\approx 1{,}47$.',
          'Tính $\\sin r = 0{,}7071 / 1{,}47 \\approx 0{,}481 \\implies r \\approx 28{,}8^\\circ$.'
        ],
        sampleAnswer: 'Chiết suất của dầu thực vật là $n_2 = \\frac{c}{v} = \\frac{3\\cdot 10^8}{2{,}04\\cdot 10^8} \\approx 1{,}47$. Khi chiếu từ không khí ($n_1 = 1$) dưới góc tới $45^\\circ$: $\\sin r = \\frac{\\sin 45^\\circ}{1{,}47} \\approx 0{,}481 \\Rightarrow r \\approx 28{,}8^\\circ$.'
      }
    },
    {
      stepTitle: '3. Tính Thuận nghịch & Hiện tượng Đáy bể Trông Nông hơn',
      stepType: 'example',
      conceptSection:
        'Ánh sáng truyền đi theo đường nào thì cũng truyền ngược lại đúng theo đường đó (tính thuận nghịch). Nhờ khúc xạ khi ánh sáng đi từ nước ra không khí, ta thấy chiếc đũa cắm xiên vào cốc nước như bị gãy và đáy bể trông nông hơn.',
      formulaSection: {
        primaryFormula: 'h_{\\text{ảnh}} \\approx \\frac{h_{\\text{thực}}}{n} \\quad (\\text{khi nhìn gần thẳng đứng xuống mặt nước})',
        secondaryFormulas: [
          'n_{\\text{nước}} \\sin i = 1 \\cdot \\sin r \\implies r > i'
        ],
        variablesNote:
          '• Khi nhìn từ trên xuống nước ($n \\approx 4/3$): độ sâu biểu kiến chỉ bằng khoảng $3/4$ độ sâu thật.\n• Khi thợ lặn ở dưới nước nhìn chim bay trên trời: thấy chim có vẻ ở cao hơn độ cao thật.'
      },
      deepDiveSection:
        'Tia sáng từ hòn sỏi dưới đáy bể truyền ra không khí bị khúc xạ lệch xa pháp tuyến ($r > i$). Mắt người định vị vật theo đường kéo dài thẳng của tia ló nên nhìn thấy ảnh ảo của hòn sỏi nằm gần mặt nước hơn vị trí thật.',
      teacherExplanation:
        'Khi xiên cá trong nước bằng giáo từ trên bờ, người có kinh nghiệm luôn ngắm thấp hơn vị trí ảnh nhìn thấy.',
      keyTakeaway: 'Tia sáng đi từ nước ra không khí lệch xa pháp tuyến ($r > i$), làm đáy bể trông nông bằng $3/4$ thực tế.',
      miniQuiz: [
        {
          id: 'p9b5-s3-q1',
          question: 'Khi nhúng nghiêng một chiếc đũa thẳng vào cốc nước trong, ta thấy phần đũa trong nước có vẻ như bị bẻ gãy lên trên ở mặt nước là do hiện tượng:',
          options: ['A. Phản xạ toàn phần', 'B. Khúc xạ ánh sáng', 'C. Tán sắc ánh sáng', 'D. Nhiễu xạ ánh sáng'],
          correctIndex: 1,
          explanation: 'Các tia sáng từ phần đũa dưới nước truyền ra không khí bị khúc xạ lệch xa pháp tuyến, tạo ảnh ảo nằm cao hơn vật thật.'
        },
        {
          id: 'p9b5-s3-q2',
          question: 'Một hồ bơi có độ sâu thực $2{,}0\\text{ m}$ ($n = 4/3$). Khi đứng trên thành hồ nhìn thẳng đứng xuống đáy hồ, mắt cảm thấy đáy hồ sâu khoảng:',
          options: ['A. $2{,}67\\text{ m}$', 'B. $1{,}50\\text{ m}$', 'C. $2{,}00\\text{ m}$', 'D. $1{,}00\\text{ m}$'],
          correctIndex: 1,
          explanation: '$h_{\\text{ảnh}} \\approx \\frac{h}{n} = \\frac{2{,}0}{4/3} = 1{,}5\\text{ m}$.'
        }
      ],
      miniEssay: {
        id: 'p9b5-s3-e1',
        question: 'Giải thích vì sao một con cá dưới nước nhìn thấy con bói cá đậu trên cành cây cao có vẻ cao hơn so với vị trí thực của chim.',
        hint: 'Vẽ đường truyền tia sáng từ con chim đi từ không khí ($n=1$) vào nước ($n=4/3$) tới mắt cá.',
        rubricChecklist: [
          'Tia sáng từ chim đi từ không khí vào nước bị gãy lại gần pháp tuyến ($r < i$).',
          'Mắt cá nhìn ngược theo đường kéo dài của tia khúc xạ thấy ảnh ảo nằm cao hơn con chim thật.'
        ],
        sampleAnswer: 'Tia sáng từ con chim truyền từ không khí ($n_1 = 1$) vào nước ($n_2 = 4/3$) bị khúc xạ gãy gần pháp tuyến hơn ($r < i$). Mắt cá nằm trong nước nhận tia khúc xạ và suy ra vị trí chim theo đường kéo dài thẳng ngược lên trên tia khúc xạ, nên ảnh ảo của chim nằm ở độ cao lớn hơn độ cao thật.'
      }
    }
  ],
  'phys-9-b6': [
    {
      stepTitle: '1. Điều kiện Xảy ra Hiện tượng Phản xạ Toàn phần',
      stepType: 'concept',
      conceptSection:
        'Phản xạ toàn phần là hiện tượng toàn bộ chùm tia sáng tới bị phản xạ trở lại môi trường ban đầu ở mặt phân cách giữa hai môi trường trong suốt, không còn tia khúc xạ truyền sang môi trường thứ hai.',
      formulaSection: {
        primaryFormula: '\\text{(1) } n_1 > n_2 \\qquad\\text{và}\\qquad \\text{(2) } i \\ge i_{th}',
        secondaryFormulas: [
          '\\sin i_{th} = \\frac{n_2}{n_1}'
        ],
        variablesNote:
          '• $n_1$: chiết suất môi trường chứa tia tới; $n_2$: chiết suất môi trường bên kia mặt phân cách.\n• $i_{th}$: góc tới hạn phản xạ toàn phần. Nếu $n_1 < n_2$ (ví dụ không khí vào thủy tinh) thì KHÔNG BAO GIỜ có phản xạ toàn phần.'
      },
      deepDiveSection:
        'Khi tia sáng đi từ nước ($n_1 = 1{,}33$) ra không khí ($n_2 = 1$), $\\sin i_{th} = 1/1{,}33 \\implies i_{th} \\approx 48{,}6^\\circ$. Với thủy tinh ($n_1 = 1{,}5$) ra không khí, $i_{th} \\approx 41{,}8^\\circ$. Khi góc tới vượt giá trị này, bề mặt thủy tinh – không khí phản chiếu sáng rực như một tấm gương hoàn hảo.',
      teacherExplanation:
        'Luôn kiểm tra ĐỦ CẢ HAI điều kiện: ánh sáng phải đi từ chất chiết quang hơn sang kém hơn ($n_1 > n_2$) VÀ góc tới đạt $i \\ge i_{th}$.',
      keyTakeaway: 'Phản xạ toàn phần chỉ xảy ra khi $n_1 > n_2$ và góc tới $i \\ge \\arcsin(n_2/n_1)$.',
      miniQuiz: [
        {
          id: 'p9b6-s1-q1',
          question: 'Trường hợp nào sau đây có thể xảy ra hiện tượng phản xạ toàn phần?',
          options: [
            'A. Ánh sáng truyền từ không khí vào nước',
            'B. Ánh sáng truyền từ không khí vào thủy tinh',
            'C. Ánh sáng truyền từ thủy tinh ($n=1{,}5$) ra không khí ($n=1$)',
            'D. Ánh sáng truyền từ nước ($n=1{,}33$) vào kim cương ($n=2{,}4$)'
          ],
          correctIndex: 2,
          explanation: 'Điều kiện cần là ánh sáng đi từ môi trường chiết suất lớn sang môi trường chiết suất nhỏ hơn ($n_1 > n_2$).'
        },
        {
          id: 'p9b6-s1-q2',
          question: 'Góc tới hạn phản xạ toàn phần khi ánh sáng truyền từ kim cương ($n_1 = 2{,}4$) ra không khí ($n_2 = 1$) xấp xỉ:',
          options: ['A. $24{,}6^\\circ$', 'B. $41{,}8^\\circ$', 'C. $48{,}6^\\circ$', 'D. $60{,}0^\\circ$'],
          correctIndex: 0,
          explanation: '$\\sin i_{th} = 1 / 2{,}4 \\approx 0{,}4167 \\implies i_{th} \\approx 24{,}6^\\circ$.'
        }
      ],
      miniEssay: {
        id: 'p9b6-s1-e1',
        question: 'Chứng minh bằng công thức vì sao khi ánh sáng truyền từ không khí ($n_1 = 1$) vào nước ($n_2 = 1{,}33$) thì dù tăng góc tới $i$ lớn tới gần $90^\\circ$ cũng không xảy ra phản xạ toàn phần.',
        hint: 'Xét giá trị cực đại của $\\sin r = (n_1/n_2)\\sin i$ khi $\\sin i \\to 1$.',
        rubricChecklist: [
          'Viết đúng $\\sin r = \\frac{1}{1{,}33}\\sin i < 0{,}752 < 1$ với mọi góc tới $i < 90^\\circ$.',
          'Kết luận góc khúc xạ $r$ luôn tồn tại ($r < 48{,}8^\\circ$), tia sáng luôn truyền vào nước nên không phản xạ toàn phần.'
        ],
        sampleAnswer: 'Theo định luật khúc xạ: $\\sin r = \\frac{n_1}{n_2}\\sin i = \\frac{1}{1{,}33}\\sin i \\le 0{,}752$. Vì $\\sin r$ luôn nhỏ hơn $1$ với mọi góc tới $i < 90^\\circ$, góc khúc xạ $r$ luôn tồn tại (luôn nhỏ hơn $48{,}8^\\circ$) nên luôn có tia khúc xạ đi vào nước, không thể xảy ra phản xạ toàn phần.'
      }
    },
    {
      stepTitle: '2. Truyền Tín hiệu Ánh sáng trong Sợi Cáp quang',
      stepType: 'derivation',
      conceptSection:
        'Cáp quang là dây dẫn ánh sáng làm bằng thủy tinh hoặc nhựa siêu tinh khiết gồm hai lớp đồng tâm: lõi trong có chiết suất lớn $n_1$ và lớp vỏ bọc ngoài có chiết suất nhỏ hơn $n_2 < n_1$.',
      formulaSection: {
        primaryFormula: 'n_{\\text{lõi}} > n_{\\text{vỏ}}, \\qquad \\sin i_{\\text{mặt bên}} \\ge \\frac{n_{\\text{vỏ}}}{n_{\\text{lõi}}}',
        secondaryFormulas: [
          '\\text{Số lần phản xạ hoàn toàn không làm hao hụt năng lượng tia qua vỏ}'
        ],
        variablesNote:
          '• Tia sáng được phóng vào đầu sợi cáp dưới góc mở thích hợp sẽ đập vào thành lõi dưới góc tới rất lớn ($> i_{th}$), phản xạ toàn phần hàng triệu lần liên tiếp kể cả khi sợi cáp uốn cong.\n• Ứng dụng: Internet băng thông rộng, nội soi y tế dạ dày – phổi.'
      },
      deepDiveSection:
        'Vì phản xạ toàn phần bảo toàn gần như $100\\%$ cường độ tia sáng (không giống gương tráng bạc bị hấp thụ khoảng $5\\% - 10\\%$ mỗi lần phản xạ), tín hiệu laser trong cáp quang có thể truyền đi hàng chục kilômét xuyên đại dương trước khi cần trạm khuếch đại.',
      teacherExplanation:
        'Trên mô phỏng 2D, thử chỉnh góc phóng $\\theta$ lớn hơn giới hạn hoặc giảm chênh lệch $n_1 - n_2$: tia sáng sẽ xuyên thủng lớp vỏ thoát ra ngoài (suy hao tín hiệu).',
      keyTakeaway: 'Cáp quang truyền tín hiệu nhờ phản xạ toàn phần liên tiếp trong lõi chiết suất $n_1 > n_2$.',
      miniQuiz: [
        {
          id: 'p9b6-s2-q1',
          question: 'Cấu tạo lõi và vỏ của một sợi cáp quang chuẩn phải thỏa mãn điều kiện nào về chiết suất?',
          options: [
            'A. Chiết suất lõi bằng chiết suất vỏ ($n_1 = n_2$)',
            'B. Chiết suất lõi lớn hơn chiết suất vỏ ($n_1 > n_2$)',
            'C. Chiết suất lõi nhỏ hơn chiết suất vỏ ($n_1 < n_2$)',
            'D. Lõi là kim loại dẫn điện, vỏ bằng nhựa đen'
          ],
          correctIndex: 1,
          explanation: 'Để ánh sáng phản xạ toàn phần liên tục bên trong lõi mà không lọt ra vỏ thì bắt buộc $n_{\\text{lõi}} > n_{\\text{vỏ}}$.'
        },
        {
          id: 'p9b6-s2-q2',
          question: 'Ưu điểm nổi bật của mạng truyền dẫn cáp quang so với dây cáp đồng truyền thống là:',
          options: [
            'A. Tốc độ truyền bằng tốc độ ánh sáng trong lõi và không bị nhiễu điện từ',
            'B. Truyền được dòng điện xoay chiều 220 V tới gia đình',
            'C. Giá thành lõi thủy tinh đắt nhưng dẫn điện tốt hơn đồng',
            'D. Không cần nguồn phát laser mà tự phát sáng'
          ],
          correctIndex: 0,
          explanation: 'Cáp quang truyền xung ánh sáng tốc độ cao ($v = c/n \\approx 2\\cdot 10^8\\text{ m/s}$), dung lượng cực lớn và miễn nhiễm nhiễu điện từ.'
        }
      ],
      miniEssay: {
        id: 'p9b6-s2-e1',
        question: 'Tại sao khi lắp đặt dây mạng cáp quang trong nhà, kỹ thuật viên khuyến cáo không được bẻ gập dây cáp quá gắt thành góc nhọn?',
        hint: 'Xét góc tới $i$ của tia sáng lên thành lõi ở đoạn uốn cong.',
        rubricChecklist: [
          'Nếu bẻ gập quá mức, bán kính cong nhỏ làm tia sáng đập vào mặt phân cách lõi–vỏ dưới góc tới $i$ giảm xuống dưới $i_{th}$.',
          'Khi $i < i_{th}$, ánh sáng bị khúc xạ thoát ra vỏ gây mất tín hiệu (hoặc nứt gãy lõi thủy tinh).'
        ],
        sampleAnswer: 'Nếu bẻ gập sợi cáp quang thành góc quá nhọn, góc tới $i$ của tia sáng đập vào thành giữa lõi và vỏ ở chỗ uốn bị giảm xuống nhỏ hơn góc tới hạn $i_{th}$. Lúc đó phản xạ toàn phần bị phá vỡ, tia sáng bị khúc xạ lọt ra ngoài vỏ làm suy hao hoặc mất hoàn toàn tín hiệu mạng.'
      }
    },
    {
      stepTitle: '3. So sánh Khúc xạ Yếu (i < i_th) vs Phản xạ Toàn phần',
      stepType: 'example',
      conceptSection:
        'Trước khi góc tới chạm ngưỡng $i_{th}$, luôn tồn tại đồng thời cả tia khúc xạ lẫn một tia phản xạ mờ (phản xạ một phần). Khi $i$ tăng tiến tới $i_{th}$, tia khúc xạ là là sát mặt phân cách ($r \\to 90^\\circ$) rồi tắt hẳn.',
      formulaSection: {
        primaryFormula: 'i < i_{th} \\implies \\text{Có tia khúc xạ + phản xạ yếu}',
        secondaryFormulas: [
          'i \\ge i_{th} \\implies \\text{Không còn tia khúc xạ; } I_{\\text{phản xạ}} = 100\\% I_{\\text{tới}}'
        ],
        variablesNote:
          '• **Lăng kính phản xạ toàn phần**: lăng kính thủy tinh vuông cân ($i_{th} \\approx 41{,}8^\\circ < 45^\\circ$) làm tia sáng đập mặt huyền dưới góc $45^\\circ$ phản xạ quay góc $90^\\circ$ hoặc $180^\\circ$ trong ống nhòm và kính tiềm vọng.'
      },
      deepDiveSection:
        'Ảo ảnh vũng nước trên mặt đường nhựa vào trưa hè nắng gắt cũng là kết quả của khúc xạ liên tiếp và phản xạ toàn phần: lớp không khí sát mặt đường rất nóng có chiết suất nhỏ hơn lớp không khí mát phía trên, uốn cong tia sáng từ bầu trời đi lên mắt khiến ta ngỡ có vũng nước phản chiếu.',
      teacherExplanation:
        'Nhớ mốc $45^\\circ$: thủy tinh thường ($n = 1{,}5$) có $i_{th} = 41{,}8^\\circ < 45^\\circ$ nên tia chiếu vuông góc cạnh góc vuông của lăng kính vuông cân luôn bị phản xạ toàn phần ở mặt huyền.',
      keyTakeaway: 'Khi $i$ tăng tiến tới $i_{th}$, tia khúc xạ tiến sát mặt phân cách rồi biến mất, nhường toàn bộ năng lượng cho tia phản xạ.',
      miniQuiz: [
        {
          id: 'p9b6-s3-q1',
          question: 'Khi ánh sáng đi từ nước ($n_1 = 4/3$, $i_{th} \\approx 48{,}6^\\circ$) ra không khí ($n_2 = 1$) dưới góc tới $i = 30^\\circ$, hiện tượng nào xảy ra?',
          options: [
            'A. Chỉ có tia phản xạ toàn phần',
            'B. Có cả tia khúc xạ lệch xa pháp tuyến và tia phản xạ một phần',
            'C. Tia sáng truyền thẳng không đổi hướng',
            'D. Tia sáng bị hấp thụ hoàn toàn tại mặt nước'
          ],
          correctIndex: 1,
          explanation: 'Vì $i = 30^\\circ < i_{th} = 48{,}6^\\circ$, chưa đủ điều kiện phản xạ toàn phần nên vẫn có tia khúc xạ ló ra không khí kèm tia phản xạ yếu.'
        },
        {
          id: 'p9b6-s3-q2',
          question: 'Trong ống nhòm lăng kính dùng thủy tinh $n = 1{,}5$, lăng kính tam giác vuông cân phản xạ tia sáng lệch $90^\\circ$ hoặc $180^\\circ$ mà không cần tráng bạc là nhờ:',
          options: [
            'A. Tán sắc ánh sáng',
            'B. Phản xạ toàn phần vì góc tới $45^\\circ > i_{th} \\approx 41{,}8^\\circ$',
            'C. Giao thoa sóng ánh sáng',
            'D. Hấp thụ tia tử ngoại'
          ],
          correctIndex: 1,
          explanation: 'Do góc tới lên mặt huyền là $45^\\circ > 41{,}8^\\circ$ nên $100\\%$ ánh sáng phản xạ toàn phần.'
        }
      ],
      miniEssay: {
        id: 'p9b6-s3-e1',
        question: 'Một thợ lặn ở dưới đáy hồ nước trong ($n = 4/3$) nhìn thẳng đứng lên mặt nước thấy bầu trời tròn sáng bán kính $R$, còn phía ngoài vòng tròn đó lại phản chiếu hình ảnh đáy hồ. Giải thích ngắn gọn hiện tượng "cửa sổ Snell" này.',
        hint: 'Xét những tia sáng từ đáy hồ truyền tới mắt thợ lặn qua mặt nước với góc tới $i < i_{th}$ vs $i \\ge i_{th}$.',
        rubricChecklist: [
          'Tia sáng từ bầu trời khúc xạ vào nước chỉ nằm trong hình nón có góc nửa đỉnh $i_{th} \\approx 48{,}6^\\circ$.',
          'Các tia từ đáy hồ đập vào mặt nước ngoài góc $48{,}6^\\circ$ bị phản xạ toàn phần ngược lại mắt thợ lặn trông như mặt gương.'
        ],
        sampleAnswer: 'Do tính thuận nghịch và giới hạn góc khúc xạ từ không khí vào nước ($r_{\\max} = i_{th} \\approx 48{,}6^\\circ$), ánh sáng bầu trời lọt tới mắt thợ lặn chỉ gom trong hình tròn góc $48{,}6^\\circ$ ngay trên đầu. Mọi tia sáng xiên hơn góc đó từ đáy hồ đi lên mặt nước đều bị phản xạ toàn phần quay xuống mắt, khiến vùng ngoài vòng tròn sáng hắt lại hình ảnh đáy hồ như tấm gương.'
      }
    }
  ],
  'phys-9-b9': [
    {
      stepTitle: '1. Phương pháp 1: Đo Tiêu cự bằng Chùm tia Song song (Vật ở rất xa)',
      stepType: 'concept',
      conceptSection:
        'Chùm tia sáng từ một vật ở rất xa thấu kính (như Mặt Trời hoặc cửa sổ xa cuối phòng thí nghiệm) có thể coi là chùm tia song song với trục chính, sau khi qua thấu kính hội tụ sẽ tụ lại tại tiêu điểm ảnh chính $F\'$.',
      formulaSection: {
        primaryFormula: 'd \\gg f \\implies d\' \\approx f',
        secondaryFormulas: [
          '\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'} \\xrightarrow{d \\to \\infty} d\' = f'
        ],
        variablesNote:
          '• Khoảng cách từ quang tâm $O$ của thấu kính hội tụ tới vị trí màn cho chấm sáng rõ nét/ảnh nhỏ rõ nét chính là tiêu cự $f$.\n• Phương pháp này thao tác rất nhanh để ước lượng tiêu cự trước khi đo chính xác.'
      },
      deepDiveSection:
        'Trong mô phỏng 2D, đặt khoảng cách vật $d = 45\\text{ cm}$ (với $f = 15\\text{ cm}$): ta thấy ảnh thật hiện rất gần tiêu điểm $F\'$. Khi vật lùi càng xa, ảnh càng tiến sát đúng vị trí tiêu cự $f$. Lưu ý an toàn không nhìn trực tiếp Mặt Trời qua thấu kính!',
      teacherExplanation:
        'Phương pháp vật ở rất xa dễ làm nhưng nếu vật trong phòng chưa đủ xa ($d \\sim 3\\text{ m}$ với $f = 15\\text{ cm}$), giá trị $d\'$ sẽ hơi lớn hơn $f$ một chút (~$15{,}8\\text{ cm}$).',
      keyTakeaway: 'Chùm tia song song trục chính qua thấu kính hội tụ hội tụ tại tiêu điểm ảnh $F\'$ cách thấu kính đúng $f$.',
      miniQuiz: [
        {
          id: 'p9b9-s1-q1',
          question: 'Khi hứng ánh sáng Mặt Trời qua một thấu kính hội tụ lên tờ giấy trắng, ta dịch chuyển thấu kính tới khi vệt sáng trên giấy nhỏ và chói nhất, đo được khoảng cách từ thấu kính tới giấy là $12\\text{ cm}$. Tiêu cự thấu kính là:',
          options: ['A. $6\\text{ cm}$', 'B. $12\\text{ cm}$', 'C. $24\\text{ cm}$', 'D. $48\\text{ cm}$'],
          correctIndex: 1,
          explanation: 'Ánh sáng Mặt Trời coi như chùm tia song song nên hội tụ ngay tại tiêu điểm $F\'$, suy ra $f = 12\\text{ cm}$.'
        },
        {
          id: 'p9b9-s1-q2',
          question: 'Vì sao khi đo tiêu cự bằng nguồn sáng ở cuối phòng học dài $4\\text{ m}$, giá trị $d\'$ đo trên băng quang học hơi lớn hơn tiêu cự thật $f$ một chút?',
          options: [
            'A. Vì thấu kính bị mòn',
            'B. Vì $d$ chưa thực sự vô cùng ($1/d > 0$) nên $1/d\' = 1/f - 1/d < 1/f \\implies d\' > f$',
            'C. Vì ảnh thu được là ảnh ảo',
            'D. Vì ánh sáng truyền chậm hơn trong thủy tinh'
          ],
          correctIndex: 1,
          explanation: 'Vì $d$ hữu hạn nên $d\' = \\frac{df}{d-f} > f$.'
        }
      ],
      miniEssay: {
        id: 'p9b9-s1-e1',
        question: 'Một học sinh đặt đèn chiếu sáng ở cuối phòng cách thấu kính hội tụ $d = 300\\text{ cm}$ và thu được ảnh rõ nét trên màn ở cách thấu kính $d\' = 15{,}8\\text{ cm}$. Kiểm tra xem nếu coi $f \\approx d\'$ thì sai số tương đối là bao nhiêu phần trăm so với tiêu cự đúng $f = 15\\text{ cm}$?',
        hint: 'Tính $|d\' - f|/f \\times 100\\%$.',
        rubricChecklist: [
          'Tính sai lệch $15{,}8 - 15 = 0{,}8\\text{ cm}$.',
          'Tính sai số tương đối $(0{,}8 / 15)\\cdot 100\\% \\approx 5{,}3\\%$.'
        ],
        sampleAnswer: 'Do vật đặt ở khoảng hữu hạn $d = 300\\text{ cm}$, ảnh nằm tại $d\' = \\frac{300\\times 15}{300 - 15} \\approx 15{,}79\\text{ cm} \\approx 15{,}8\\text{ cm}$. Nếu lấy gần đúng $f \\approx 15{,}8\\text{ cm}$ thì sai số tương đối so với $f = 15\\text{ cm}$ là $\\frac{15{,}8 - 15}{15}\\times 100\\% \\approx 5{,}3\\%$.'
      }
    },
    {
      stepTitle: '2. Phương pháp 2 (Chuẩn KHTN 9): Ảnh thật Cao bằng Vật (L = 4f)',
      stepType: 'derivation',
      conceptSection:
        'Trong bài thực hành KHTN 9 (CT GDPT 2018), phương pháp chính xác nhất trên băng quang học là bố trí thấu kính nằm chính giữa vật sáng chữ F và màn hứng ảnh sao cho ảnh thật hiện rõ nét và có chiều cao đúng bằng vật.',
      formulaSection: {
        primaryFormula: 'd = d\' = 2f \\implies L = d + d\' = 4f \\implies f = \\frac{L}{4}',
        secondaryFormulas: [
          'k = -\\frac{d\'}{d} = -1 \\iff A\'B\' = AB \\; (\\text{ngược chiều})'
        ],
        variablesNote:
          '• $d$: khoảng cách từ khe chữ F tới thấu kính ($d = 2f$).\n• $d\'$: khoảng cách từ thấu kính tới màn ảnh ($d\' = 2f$).\n• $L = d + d\' = 4f$: khoảng cách trực tiếp từ vật sáng tới màn ảnh khi ảnh cao bằng vật.'
      },
      deepDiveSection:
        'Ưu điểm lớn của phương pháp $L = 4f$: không bị sai số hệ thống do $d$ không ở vô cùng! Khi $d = d\' = 2f$, ảnh $A\'B\'$ có chiều cao bằng đúng chiều cao khe chữ F ban đầu ($h\' = h$) và ngược chiều. Thậm chí chỉ cần đo tổng khoảng cách $L$ giữa vật và màn bằng thước băng quang học là tính ngay được $f = L/4$.',
      teacherExplanation:
        'Trên mô phỏng 2D (đang đặt sẵn $f = 15\\text{ cm}, d = 30\\text{ cm}$), kiểm tra thấy mũi tên ảnh thật nằm đúng $d\' = 30\\text{ cm}$ và có chiều dài bằng đúng vật $AB$!',
      keyTakeaway: 'Khi ảnh thật ngược chiều cao đúng bằng vật thì $d = d\' = 2f$, suy ra $f = (d + d\')/4 = L/4$.',
      miniQuiz: [
        {
          id: 'p9b9-s2-q1',
          question: 'Khi đặt vật sáng hình chữ F cao $3\\text{ cm}$ trước thấu kính hội tụ, người ta dịch chuyển thấu kính cách vật $d = 28\\text{ cm}$ và màn cách thấu kính $d\' = 28\\text{ cm}$ thì thu được ảnh rõ nét cao đúng $3\\text{ cm}$. Tiêu cự thấu kính là:',
          options: ['A. $7\\text{ cm}$', 'B. $14\\text{ cm}$', 'C. $28\\text{ cm}$', 'D. $56\\text{ cm}$'],
          correctIndex: 1,
          explanation: 'Vì $d = d\' = 28\\text{ cm}$ và $A\'B\' = AB$ nên $2f = 28\\text{ cm} \\implies f = 14\\text{ cm}$.'
        },
        {
          id: 'p9b9-s2-q2',
          question: 'Một thấu kính hội tụ có tiêu cự $f = 20\\text{ cm}$. Để thu được ảnh thật cao bằng vật, phải đặt vật và màn cách nhau một khoảng $L$ bằng:',
          options: ['A. $40\\text{ cm}$', 'B. $60\\text{ cm}$', 'C. $80\\text{ cm}$', 'D. $20\\text{ cm}$'],
          correctIndex: 2,
          explanation: '$L = 4f = 4 \\cdot 20 = 80\\text{ cm}$.'
        }
      ],
      miniEssay: {
        id: 'p9b9-s2-e1',
        question: 'Trình bày 4 bước thực hành đo tiêu cự thấu kính hội tụ trên băng quang học bằng phương pháp ảnh thật cao bằng vật ($d = d\'$).',
        hint: 'Nêu rõ cách đặt vật chữ F, thấu kính ở giữa và tiêu chí nhận biết vị trí đo.',
        rubricChecklist: [
          'Đo chiều cao khe sáng chữ F trước khi bật đèn; lắp vật – thấu kính – màn đồng trục.',
          'Dịch chuyển đồng thời vật và màn cách đều thấu kính ($d = d\'$) tới khi ảnh ngược chiều trên màn rõ nét và cao đúng bằng chữ F gốc, rồi đọc $d, d\'$ tính $f = (d+d\')/4$.'
        ],
        sampleAnswer: 'Bước 1: Đo chiều cao chữ F của đèn chiếu, sắp xếp đèn – thấu kính hội tụ – màn chắn đồng trục trên băng quang học. Bước 2: Dịch chuyển đèn và màn ra hai phía cách đều thấu kính ($d = d\'$). Bước 3: Điều chỉnh đều hai bên tới khi ảnh trên màn hiện rõ nét nhất và có chiều cao đúng bằng khe chữ F ban đầu. Bước 4: Đọc khoảng cách $L = d + d\'$, tính $f = L/4$ và lặp lại 3 lần lấy trung bình.'
      }
    },
    {
      stepTitle: '3. Xử lý Số liệu Thực hành & Tính Sai số f = L/4',
      stepType: 'example',
      conceptSection:
        'Trong phòng thí nghiệm, mắt người đánh giá độ nét của ảnh trên màn có thể sai lệch vài milimét mỗi lần đo. Vì vậy ta phải thực hiện ít nhất 3 lần chỉnh lại rồi lấy giá trị trung bình và sai số tuyệt đối.',
      formulaSection: {
        primaryFormula: '\\bar{f} = \\frac{\\bar{L}}{4} = \\frac{f_1 + f_2 + f_3}{3}',
        secondaryFormulas: [
          '\\Delta f = \\frac{|\\bar{f} - f_1| + |\\bar{f} - f_2| + |\\bar{f} - f_3|}{3}'
        ],
        variablesNote:
          '• Kết quả đo chuẩn ghi dưới dạng: $f = (\\bar{f} \\pm \\Delta f)\\text{ cm}$.\n• Nếu tăng khoảng cách $L$ lớn hơn một chút mà muốn giữ ảnh bằng vật thì không thể tìm được vị trí đối xứng nào khác vì $L_{\\min} = 4f$!'
      },
      deepDiveSection:
        'Một điều thú vị của phương trình thấu kính: để hứng được ảnh thật của vật trên màn cố định cách vật một khoảng $L$, điều kiện bắt buộc là $L \\ge 4f$. Nếu đặt màn quá gần vật ($L < 4f$) thì dù dịch chuyển thấu kính đi đâu cũng KHÔNG BAO GIỜ thu được ảnh rõ nét trên màn.',
      teacherExplanation:
        'Khi làm bài thực hành trên lớp mà mãi không thấy ảnh rõ nét trên màn, hãy thử lùi màn ra xa hơn nữa ($L \\ge 4f$).',
      keyTakeaway: 'Lặp lại 3 lần đo $L$, tính $\\bar{f} = \\bar{L}/4$ và ghi kết quả kèm sai số; muốn có ảnh thật trên màn phải đảm bảo $L \\ge 4f$.',
      miniQuiz: [
        {
          id: 'p9b9-s3-q1',
          question: 'Kết quả 3 lần đo khoảng cách $L$ khi ảnh thật cao bằng vật là $60{,}0\\text{ cm}$; $59{,}6\\text{ cm}$; $60{,}4\\text{ cm}$. Giá trị trung bình tiêu cự $\\bar{f}$ là:',
          options: ['A. $15{,}0\\text{ cm}$', 'B. $30{,}0\\text{ cm}$', 'C. $14{,}9\\text{ cm}$', 'D. $15{,}2\\text{ cm}$'],
          correctIndex: 0,
          explanation: '$\\bar{L} = (60{,}0 + 59{,}6 + 60{,}4)/3 = 60{,}0\\text{ cm} \\implies \\bar{f} = 60{,}0 / 4 = 15{,}0\\text{ cm}$.'
        },
        {
          id: 'p9b9-s3-q2',
          question: 'Đặt vật sáng và màn cố định cách nhau $L = 50\\text{ cm}$. Với thấu kính hội tụ tiêu cự $f = 15\\text{ cm}$ đặt giữa vật và màn, có thể thu được ảnh thật trên màn không?',
          options: [
            'A. Có 2 vị trí cho ảnh rõ nét',
            'B. Có 1 vị trí duy nhất',
            'C. Không có vị trí nào vì $L = 50\\text{ cm} < 4f = 60\\text{ cm}$',
            'D. Thu được ảnh ảo trên màn'
          ],
          correctIndex: 2,
          explanation: 'Điều kiện để có ảnh thật trên màn là $L \\ge 4f = 60\\text{ cm}$. Vì $50 < 60$ nên không thể hứng được ảnh rõ nét.'
        }
      ],
      miniEssay: {
        id: 'p9b9-s3-e1',
        question: 'Bảng số liệu thực hành đo tiêu cự bằng phương pháp $L = 4f$ cho 3 lần đo $L$: $40{,}4\\text{ cm}$; $39{,}6\\text{ cm}$; $40{,}0\\text{ cm}$. Hãy tính từng giá trị $f_1, f_2, f_3$, giá trị trung bình $\\bar{f}$ và sai số ngẫu nhiên trung bình $\\overline{\\Delta f}$.',
        hint: 'Tính $f_i = L_i / 4$ cho từng lần rồi lấy trung bình cộng độ lệch $|\\bar{f} - f_i|$.',
        rubricChecklist: [
          'Tính $f_1 = 10{,}1\\text{ cm}$, $f_2 = 9{,}9\\text{ cm}$, $f_3 = 10{,}0\\text{ cm} \\implies \\bar{f} = 10{,}0\\text{ cm}$.',
          'Tính sai số $\\overline{\\Delta f} = (0{,}1 + 0{,}1 + 0)/3 \\approx 0{,}07\\text{ cm}$.'
        ],
        sampleAnswer: 'Tính cho từng lần đo: $f_1 = 40{,}4/4 = 10{,}1\\text{ cm}$; $f_2 = 39{,}6/4 = 9{,}9\\text{ cm}$; $f_3 = 40{,}0/4 = 10{,}0\\text{ cm}$. Giá trị trung bình $\\bar{f} = (10{,}1 + 9{,}9 + 10{,}0)/3 = 10{,}0\\text{ cm}$. Sai số trung bình $\\overline{\\Delta f} = (|10{,}0 - 10{,}1| + |10{,}0 - 9{,}9| + 0)/3 = 0{,}2/3 \\approx 0{,}07\\text{ cm}$. Kết quả: $f = (10{,}00 \\pm 0{,}07)\\text{ cm}$.'
      }
    }
  ],
  'phys-9-b10': [
    {
      stepTitle: '1. Kính lúp & Nguyên lý Đặt vật trong Tiêu cự (d < f)',
      stepType: 'concept',
      conceptSection:
        'Kính lúp là một thấu kính hội tụ có tiêu cự ngắn (vài cm đến dưới 25 cm), dùng để quan sát các chi tiết nhỏ bằng mắt thường thông qua việc tạo ra một ảnh ảo lớn hơn vật.',
      formulaSection: {
        primaryFormula: '0 < d < f \\implies \\text{Ảnh ảo, cùng chiều, lớn hơn vật}',
        secondaryFormulas: [
          '\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'} \\quad (d\' < 0)'
        ],
        variablesNote:
          '• Vật phải nằm trong khoảng tiêu cự $OF$ của kính lúp ($d < f$).\n• Mắt đặt sát phía sau kính để ngắm nhìn ảnh ảo thuận chiều $A\'B\'$.'
      },
      deepDiveSection:
        'Nếu ta kéo kính lúp ra quá xa mẫu vật khiến $d > f$, ảnh lập tức biến thành ảnh thật ngược chiều và mờ nhòe khi ghé sát mắt! Vì vậy thao tác chuẩn khi dùng kính lúp là đặt sát mẫu vật rồi từ từ nhấc kính lên trong phạm vi nhỏ hơn tiêu cự $f$ tới khi thấy chữ to và rõ nét nhất.',
      teacherExplanation:
        'Kéo thanh $d$ trên mô phỏng vào nhỏ hơn $f$ ($d = 10\\text{ cm}, f = 18\\text{ cm}$) để quan sát hai đường kéo dài tia ló giao nhau tạo mũi tên ảnh ảo nét đứt phóng đại.',
      keyTakeaway: 'Khi dùng kính lúp phải đặt vật trong khoảng tiêu cự ($d < f$) để nhìn thấy ảnh ảo cùng chiều lớn hơn vật.',
      miniQuiz: [
        {
          id: 'p9b10-s1-q1',
          question: 'Một thợ sửa đồng hồ dùng kính lúp có tiêu cự $f = 8\\text{ cm}$ soi bánh răng đồng hồ. Phải đặt bánh răng cách kính một khoảng bao nhiêu?',
          options: ['A. $d = 16\\text{ cm}$', 'B. $8\\text{ cm} < d < 16\\text{ cm}$', 'C. $0 < d < 8\\text{ cm}$', 'D. $d > 16\\text{ cm}$'],
          correctIndex: 2,
          explanation: 'Muốn kính lúp cho ảnh ảo cùng chiều lớn hơn vật thì vật phải nằm trong khoảng tiêu cự $0 < d < f = 8\\text{ cm}$.'
        },
        {
          id: 'p9b10-s1-q2',
          question: 'Khi dùng kính lúp soi một trang sách ở vị trí đúng ($d < f$), ảnh mà mắt quan sát thấy có tính chất gì?',
          options: [
            'A. Ảnh thật, ngược chiều, lớn hơn vật',
            'B. Ảnh ảo, cùng chiều, lớn hơn vật',
            'C. Ảnh ảo, cùng chiều, nhỏ hơn vật',
            'D. Ảnh thật, cùng chiều, lớn hơn vật'
          ],
          correctIndex: 1,
          explanation: 'Vật đặt trong tiêu cự thấu kính hội tụ luôn cho ảnh ảo, cùng chiều, lớn hơn vật.'
        }
      ],
      miniEssay: {
        id: 'p9b10-s1-e1',
        question: 'Bạn An cầm kính lúp tiêu cự $f = 10\\text{ cm}$ đặt cách tờ báo $15\\text{ cm}$ và đưa mắt sát kính để đọc chữ nhưng thấy chữ bị mờ và lộn ngược. Giải thích lỗi sai của bạn An.',
        hint: 'So sánh $d = 15\\text{ cm}$ với tiêu cự $f = 10\\text{ cm}$.',
        rubricChecklist: [
          'Chỉ ra $d = 15\\text{ cm} > f = 10\\text{ cm}$ nên thấu kính tạo ảnh thật, ngược chiều.',
          'Khuyên bạn đưa kính lại gần trang báo sao cho $d < 10\\text{ cm}$ để tạo ảnh ảo cùng chiều rõ nét.'
        ],
        sampleAnswer: 'Do bạn An đặt kính cách chữ $d = 15\\text{ cm}$ lớn hơn tiêu cự $f = 10\\text{ cm}$ nên thấu kính hội tụ cho ảnh thật ngược chiều nằm trước mắt (khoảng cách ảnh nhỏ hơn điểm cực cận của mắt nên bị mờ). Bạn cần hạ kính lại gần trang báo sao cho $d < 10\\text{ cm}$ để mắt ngắm được ảnh ảo thuận chiều phóng đại rõ nét.'
      }
    },
    {
      stepTitle: '2. Số Bội giác G = 25/f & Ứng dụng Hệ Quang học',
      stepType: 'derivation',
      conceptSection:
        'Trên vành mỗi kính lúp thường ghi một con số như $2\\times$, $5\\times$, $10\\times$ — gọi là số bội giác $G$, cho biết độ phóng đại góc trông ảnh khi mắt ngắm chừng ở cực cận hoặc vô cực.',
      formulaSection: {
        primaryFormula: 'G = \\frac{25}{f\\text{ (cm)}}',
        secondaryFormulas: [
          'f\\text{ (cm)} = \\frac{25}{G}',
          '\\text{Hệ 2 thấu kính (Kính hiển vi/Thiên văn): } G_{\\infty} = \\frac{\\delta \\cdot Đ}{f_1 f_2},\\; G_{tv} = \\frac{f_1}{f_2}'
        ],
        variablesNote:
          '• $25\\text{ cm}$ là khoảng cực cận quy ước chuẩn của mắt bình thường.\n• Kính lúp có số bội giác $G$ càng lớn thì tiêu cự $f$ càng ngắn (mặt kính càng cong vồng hơn).'
      },
      deepDiveSection:
        'Khi cần quan sát tế bào hay thiên thể xa hàng triệu năm ánh sáng mà một kính lúp đơn không đủ độ phóng đại, khoa học ghép 2 thấu kính đồng trục (Vật kính + Thị kính) thành Kính hiển vi hoặc Kính thiên văn như trong mô phỏng 2 thấu kính bên trên.',
      teacherExplanation:
        'Lưu ý đơn vị trong công thức $G = 25 / f$: tiêu cự $f$ bắt buộc tính bằng **centimét (cm)**.',
      keyTakeaway: 'Kính lúp có số bội giác $G$ càng lớn thì tiêu cự $f = 25/G$ (cm) càng ngắn.',
      miniQuiz: [
        {
          id: 'p9b10-s2-q1',
          question: 'Trên vành một kính lúp có ghi $2{,}5\\times$. Tiêu cự của kính lúp này bằng:',
          options: ['A. $10\\text{ cm}$', 'B. $62{,}5\\text{ cm}$', 'C. $5\\text{ cm}$', 'D. $2{,}5\\text{ cm}$'],
          correctIndex: 0,
          explanation: '$f = \\frac{25}{G} = \\frac{25}{2{,}5} = 10\\text{ cm}$.'
        },
        {
          id: 'p9b10-s2-q2',
          question: 'So sánh hai kính lúp ghi $3\\times$ và $5\\times$, phát biểu nào đúng?',
          options: [
            'A. Kính $5\\times$ có tiêu cự dài hơn kính $3\\times$',
            'B. Kính $5\\times$ có tiêu cự $5\\text{ cm}$, ngắn hơn tiêu cự của kính $3\\times$ ($8{,}33\\text{ cm}$)',
            'C. Hai kính có cùng tiêu cự $25\\text{ cm}$',
            'D. Kính $3\\times$ phóng đại lớn hơn kính $5\\times$'
          ],
          correctIndex: 1,
          explanation: '$f_{5\\times} = 25/5 = 5\\text{ cm} < f_{3\\times} = 25/3 \\approx 8{,}33\\text{ cm}$.'
        }
      ],
      miniEssay: {
        id: 'p9b10-s2-e1',
        question: 'Một học sinh có hai kính lúp với tiêu cự lần lượt $f_1 = 5\\text{ cm}$ và $f_2 = 12{,}5\\text{ cm}$. Hãy xác định số bội giác $G$ ghi trên mỗi kính và cho biết dùng kính nào giúp nhìn chi tiết mạch điện tử to hơn.',
        hint: 'Tính $G = 25/f$ cho từng kính.',
        rubricChecklist: [
          'Tính đúng $G_1 = 25/5 = 5\\times$ và $G_2 = 25/12{,}5 = 2\\times$.',
          'Kết luận kính 1 ($5\\times$) phóng đại lớn hơn.'
        ],
        sampleAnswer: 'Kính 1 có số bội giác $G_1 = \\frac{25}{5} = 5\\times$. Kính 2 có số bội giác $G_2 = \\frac{25}{12{,}5} = 2\\times$. Do đó kính 1 ($f_1 = 5\\text{ cm}$) cho số bội giác lớn hơn, giúp phóng đại chi tiết mạch điện tử rõ hơn.'
      }
    },
    {
      stepTitle: '3. Phương pháp Tam giác Đồng dạng Giải Bài tập Thấu kính',
      stepType: 'example',
      conceptSection:
        'Ở bậc THCS KHTN 9, học sinh dựng hình bằng 2 trong 3 tia đặc biệt rồi xét hai cặp tam giác vuông đồng dạng để tính chính xác vị trí và độ cao ảnh mà không cần học thuộc máy móc.',
      formulaSection: {
        primaryFormula: '\\triangle OAB \\sim \\triangle OA\'B\' \\implies \\frac{A\'B\'}{AB} = \\frac{OA\'}{OA} = \\frac{d\'_{\\text{lớn}}}{d}',
        secondaryFormulas: [
          '\\text{Ảnh thật (TKHT): } \\triangle F\'OI \\sim \\triangle F\'A\'B\' \\implies \\frac{A\'B\'}{AB} = \\frac{d\' - f}{f}',
          '\\text{Ảnh ảo (TKHT): } \\frac{A\'B\'}{AB} = \\frac{d\'_{\\text{ảo}} + f}{f}'
        ],
        variablesNote:
          '• Trong mọi hình vẽ chuẩn: $OI = AB$ (do đoạn $BI$ song song với trục chính).\n• Giải hệ 2 tỉ lệ đồng dạng dễ dàng tìm ra cả khoảng cách ảnh $OA\'$ lẫn chiều cao $A\'B\'$.'
      },
      deepDiveSection:
        'Ví dụ mẫu tổng hợp: Đặt vật cao $h = 2\\text{ cm}$ cách thấu kính hội tụ $f = 12\\text{ cm}$ một đoạn $d = 18\\text{ cm}$.\n• Cặp 1: $\\frac{h\'}{h} = \\frac{d\'}{18}$.\n• Cặp 2: $\\frac{h\'}{h} = \\frac{d\' - 12}{12}$.\nCho hai vế bằng nhau: $\\frac{d\'}{18} = \\frac{d\' - 12}{12} \\implies 12d\' = 18d\' - 216 \\implies d\' = 36\\text{ cm}$ và $h\' = 2\\cdot \\frac{36}{18} = 4\\text{ cm}$!',
      teacherExplanation:
        'Mẹo kiểm tra lại kết quả tam giác đồng dạng: thay $d, d\', f$ vào $\\frac{1}{f} = \\frac{1}{d} \\pm \\frac{1}{d\'}$ (dấu $+$ nếu ảnh thật, dấu $-$ nếu ảnh ảo) xem hai vế có khớp nhau không.',
      keyTakeaway: 'Kết hợp 2 cặp tam giác đồng dạng ở đỉnh $O$ và tiêu điểm $F\'$ giải quyết trọn vẹn mọi bài toán thấu kính THCS.',
      miniQuiz: [
        {
          id: 'p9b10-s3-q1',
          question: 'Đặt vật sáng $AB$ cao $3\\text{ cm}$ cách thấu kính hội tụ $f = 10\\text{ cm}$ một khoảng $d = 15\\text{ cm}$. Chiều cao ảnh thật $A\'B\'$ bằng:',
          options: ['A. $1{,}5\\text{ cm}$', 'B. $3\\text{ cm}$', 'C. $6\\text{ cm}$', 'D. $9\\text{ cm}$'],
          correctIndex: 2,
          explanation: 'Từ $\\frac{d\'}{15} = \\frac{d\' - 10}{10} \\implies d\' = 30\\text{ cm} \\implies A\'B\' = 3\\cdot \\frac{30}{15} = 6\\text{ cm}$.'
        },
        {
          id: 'p9b10-s3-q2',
          question: 'Với thấu kính phân kì tiêu cự $15\\text{ cm}$, vật cao $4\\text{ cm}$ đặt cách kính $30\\text{ cm}$ cho ảnh ảo cách kính và cao bằng bao nhiêu?',
          options: [
            'A. $d\' = 10\\text{ cm}$, $h\' = 1{,}33\\text{ cm}$',
            'B. $d\' = 30\\text{ cm}$, $h\' = 4\\text{ cm}$',
            'C. $d\' = 15\\text{ cm}$, $h\' = 2\\text{ cm}$',
            'D. $d\' = 20\\text{ cm}$, $h\' = 2{,}67\\text{ cm}$'
          ],
          correctIndex: 0,
          explanation: '$\\frac{d\'}{30} = \\frac{15 - d\'}{15} \\implies d\' = 10\\text{ cm} \\implies h\' = 4\\cdot \\frac{10}{30} \\approx 1{,}33\\text{ cm}$.'
        }
      ],
      miniEssay: {
        id: 'p9b10-s3-e1',
        question: 'Đặt vật sáng $AB$ cao $4\\text{ cm}$ vuông góc trục chính của kính lúp có tiêu cự $f = 15\\text{ cm}$, cách kính $d = 10\\text{ cm}$. Dùng hai cặp tam giác đồng dạng tính khoảng cách ảnh ảo $OA\'$ và chiều cao ảnh $A\'B\'$.',
        hint: 'Lập $\\frac{A\'B\'}{AB} = \\frac{d\'}{10}$ và $\\frac{A\'B\'}{AB} = \\frac{d\' + 15}{15}$.',
        rubricChecklist: [
          'Lập đúng tỉ lệ đồng dạng ảnh ảo $\\frac{d\'}{10} = \\frac{d\' + 15}{15}$ giải ra $d\' = 30\\text{ cm}$.',
          'Tính đúng $A\'B\' = 4 \\cdot (30/10) = 12\\text{ cm}$.'
        ],
        sampleAnswer: 'Từ $\\triangle OAB \\sim \\triangle OA\'B\'$ có $\\frac{A\'B\'}{AB} = \\frac{OA\'}{OA} = \\frac{d\'}{10}$. Từ $\\triangle F\'OI \\sim \\triangle F\'A\'B\'$ (ảnh ảo cùng phía với vật) có $\\frac{A\'B\'}{AB} = \\frac{d\' + 15}{15}$. Suy ra $\\frac{d\'}{10} = \\frac{d\' + 15}{15} \\Rightarrow 15d\' = 10d\' + 150 \\Rightarrow d\' = 30\\text{ cm}$. Chiều cao ảnh $A\'B\' = 4 \\times \\frac{30}{10} = 12\\text{ cm}$.'
      }
    }
  ],
  'phys-9-b11': [
    {
      stepTitle: '1. Đường đặc trưng I – U & Định luật Ohm',
      stepType: 'concept',
      conceptSection:
        'Thực nghiệm đo cường độ dòng điện $I$ chạy qua một đoạn dây dẫn kim loại ở nhiệt độ không đổi khi tăng dần hiệu điện thế $U$ cho thấy: đồ thị $(I - U)$ là một đường thẳng đi qua gốc tọa độ.',
      formulaSection: {
        primaryFormula: 'I = \\frac{U}{R}',
        secondaryFormulas: [
          'R = \\frac{U}{I} \\quad (\\text{Đơn vị Ôm: } 1\\,\\Omega = 1\\text{ V/A})',
          'U = I \\cdot R, \\qquad 1\\text{ k}\\Omega = 1000\\,\\Omega'
        ],
        variablesNote:
          '• **Định luật Ohm**: Cường độ dòng điện $I$ chạy qua một đoạn dây dẫn tỉ lệ thuận với hiệu điện thế $U$ đặt vào hai đầu đoạn dây và tỉ lệ nghịch với điện trở $R$ của nó.\n• Giá trị $R = U/I$ đặc trưng cho mức độ cản trở dòng điện của vật dẫn (KHÔNG phụ thuộc vào $U$ và $I$).'
      },
      deepDiveSection:
        'Cẩn thận câu bẫy kinh điển: "Nếu tăng hiệu điện thế $U$ lên 2 lần thì điện trở $R$ thay đổi thế nào?". Trả lời đúng: Điện trở $R$ KHÔNG ĐỔI (vì $U$ tăng 2 lần thì $I$ cũng tăng 2 lần nên tỉ số $U/I$ giữ nguyên)!',
      teacherExplanation:
        'Trên mạch mô phỏng 2D, chỉnh $U$ tăng gấp đôi từ $6\\text{ V}$ lên $12\\text{ V}$ để kiểm tra ngay cường độ dòng điện $I$ tăng gấp đôi.',
      keyTakeaway: 'Định luật Ohm $I = U/R$; điện trở $R$ là đặc trưng riêng của dây dẫn, không phụ thuộc $U$ và $I$.',
      miniQuiz: [
        {
          id: 'p9b11-s1-q1',
          question: 'Đặt hiệu điện thế $U = 9\\text{ V}$ vào hai đầu một điện trở $R = 15\\,\\Omega$. Cường độ dòng điện qua điện trở bằng:',
          options: ['A. $0{,}6\\text{ A}$', 'B. $1{,}67\\text{ A}$', 'C. $135\\text{ A}$', 'D. $0{,}3\\text{ A}$'],
          correctIndex: 0,
          explanation: '$I = U/R = 9/15 = 0{,}6\\text{ A}$.'
        },
        {
          id: 'p9b11-s1-q2',
          question: 'Khi hiệu điện thế đặt vào hai đầu một đoạn dây dẫn bằng đồng tăng lên 3 lần (nhiệt độ coi như không đổi) thì điện trở của đoạn dây này sẽ:',
          options: ['A. Tăng 3 lần', 'B. Giảm 3 lần', 'C. Không thay đổi', 'D. Tăng 9 lần'],
          correctIndex: 2,
          explanation: 'Điện trở của một dây dẫn ở nhiệt độ xác định là hằng số, chỉ phụ thuộc chiều dài, tiết diện và vật liệu, không phụ thuộc $U$.'
        }
      ],
      miniEssay: {
        id: 'p9b11-s1-e1',
        question: 'Đặt hiệu điện thế $U_1 = 6\\text{ V}$ vào hai đầu một bóng đèn dây tóc (coi điện trở không đổi) thì dòng điện qua đèn là $0{,}4\\text{ A}$. Muốn dòng điện qua đèn là $0{,}6\\text{ A}$ thì phải đặt hiệu điện thế bằng bao nhiêu?',
        hint: 'Tính $R = U_1 / I_1$ rồi tính $U_2 = I_2 \\cdot R$, hoặc dùng tỉ lệ $U_2/U_1 = I_2/I_1$.',
        rubricChecklist: [
          'Tính đúng điện trở $R = 6 / 0{,}4 = 15\\,\\Omega$.',
          'Tính được $U_2 = 0{,}6 \\cdot 15 = 9\\text{ V}$.'
        ],
        sampleAnswer: 'Điện trở của bóng đèn là $R = \\frac{U_1}{I_1} = \\frac{6}{0{,}4} = 15\\,\\Omega$. Để cường độ dòng điện đạt $I_2 = 0{,}6\\text{ A}$, hiệu điện thế cần đặt vào hai đầu đèn là $U_2 = I_2 \\cdot R = 0{,}6 \\times 15 = 9\\text{ V}$.'
      }
    },
    {
      stepTitle: '2. Công thức Điện trở Dây dẫn R = ρl/S & Biến trở',
      stepType: 'derivation',
      conceptSection:
        'Mức độ cản trở dòng điện của một dây dẫn hình trụ đồng chất tỉ lệ thuận với chiều dài dây $l$, tỉ lệ nghịch với tiết diện ngang $S$ và phụ thuộc vào bản chất vật liệu (điện trở suất $\\rho$).',
      formulaSection: {
        primaryFormula: 'R = \\rho \\frac{l}{S}',
        secondaryFormulas: [
          'S = \\pi r^2 = \\frac{\\pi d^2}{4}, \\qquad 1\\text{ mm}^2 = 10^{-6}\\text{ m}^2',
          '\\rho_{\\text{bạc}} = 1{,}6\\cdot 10^{-8},\\; \\rho_{\\text{đồng}} = 1{,}7\\cdot 10^{-8},\\; \\rho_{\\text{nhôm}} = 2{,}8\\cdot 10^{-8}\\,(\\Omega\\cdot\\text{m})'
        ],
        variablesNote:
          '• $\\rho$: điện trở suất ($\\Omega\\cdot\\text{m}$) — trị số càng nhỏ vật liệu dẫn điện càng tốt (Bạc > Đồng > Vàng > Nhôm).\n• **Biến trở**: thiết bị thay đổi chiều dài phần dây có dòng điện đi qua để điều chỉnh điện trở và cường độ dòng điện trong mạch.'
      },
      deepDiveSection:
        'Nhờ công thức $R = \\rho l/S$: dây tải điện cao thế cần có điện trở nhỏ nên dùng đồng hoặc nhôm tiết diện lớn; ngược lại dây đốt ấm siêu tốc hoặc bếp điện cần tỏa nhiều nhiệt nên dùng hợp kim Nicrôm ($\\rho \\approx 1{,}1\\cdot 10^{-6}\\,\\Omega\\cdot\\text{m}$ — gấp hơn 60 lần đồng) quấn dài và mảnh.',
      teacherExplanation:
        'Lỗi đổi đơn vị hay gặp nhất: $1\\text{ mm}^2 = 10^{-6}\\text{ m}^2$ (không phải $10^{-3}$!).',
      keyTakeaway: 'Điện trở dây dẫn $R = \\rho l/S$; dây càng dài, mảnh và $\\rho$ lớn thì điện trở càng lớn.',
      miniQuiz: [
        {
          id: 'p9b11-s2-q1',
          question: 'Hai dây đồng có cùng tiết diện. Dây thứ nhất dài $20\\text{ m}$ có điện trở $4\\,\\Omega$. Dây thứ hai dài $50\\text{ m}$ có điện trở bằng:',
          options: ['A. $1{,}6\\,\\Omega$', 'B. $10\\,\\Omega$', 'C. $8\\,\\Omega$', 'D. $20\\,\\Omega$'],
          correctIndex: 1,
          explanation: 'Cùng vật liệu và tiết diện nên $R_2 / R_1 = l_2 / l_1 = 50/20 = 2{,}5 \\implies R_2 = 4\\cdot 2{,}5 = 10\\,\\Omega$.'
        },
        {
          id: 'p9b11-s2-q2',
          question: 'Trên một biến trở con chạy có ghi $20\\,\\Omega - 2\\text{ A}$. Ý nghĩa của thông số này là:',
          options: [
            'A. Điện trở lớn nhất của biến trở là $20\\,\\Omega$ và dòng chịu đựng tối đa là $2\\text{ A}$',
            'B. Biến trở chỉ dùng đúng ở mức $20\\,\\Omega$ và $2\\text{ A}$',
            'C. Hiệu điện thế tối đa là $10\\text{ V}$',
            'D. Biến trở có chiều dài dây $20\\text{ m}$'
          ],
          correctIndex: 0,
          explanation: 'Số ghi trên biến trở cho biết giá trị điện trở cực đại ($20\\,\\Omega$) và cường độ dòng điện cho phép lớn nhất ($2\\text{ A}$) để dây không bị nóng đứt.'
        }
      ],
      miniEssay: {
        id: 'p9b11-s2-e1',
        question: 'Tính chiều dài dây Nicrôm có tiết diện $S = 0{,}2\\text{ mm}^2$ và điện trở suất $\\rho = 1{,}1\\cdot 10^{-6}\\,\\Omega\\cdot\\text{m}$ cần dùng để quấn một biến trở có điện trở tối đa $R = 44\\,\\Omega$.',
        hint: 'Đổi $S = 0{,}2\\cdot 10^{-6}\\text{ m}^2$ và rút $l = R\\cdot S / \\rho$.',
        rubricChecklist: [
          'Đổi đúng $S = 0{,}2 \\cdot 10^{-6}\\text{ m}^2$.',
          'Tính được $l = \\frac{44 \\cdot 0{,}2\\cdot 10^{-6}}{1{,}1\\cdot 10^{-6}} = 8\\text{ m}$.'
        ],
        sampleAnswer: 'Đổi tiết diện $S = 0{,}2\\text{ mm}^2 = 0{,}2\\cdot 10^{-6}\\text{ m}^2$. Từ $R = \\rho\\frac{l}{S} \\Rightarrow l = \\frac{R\\cdot S}{\\rho} = \\frac{44 \\times 0{,}2\\cdot 10^{-6}}{1{,}1\\cdot 10^{-6}} = 8\\text{ m}$.'
      }
    },
    {
      stepTitle: '3. Ảnh hưởng Điện trở lên Dòng điện & Thực hành Đo Điện trở',
      stepType: 'example',
      conceptSection:
        'Trong thí nghiệm xác định trị số một điện trở chưa biết bằng phương pháp Vôn kế – Ampe kế, ta điều chỉnh biến trở qua 3 mức điện áp khác nhau, đo $(U_i, I_i)$ rồi tính $R_i = U_i/I_i$ và lấy trung bình.',
      formulaSection: {
        primaryFormula: 'R_i = \\frac{U_i}{I_i}, \\qquad \\bar{R} = \\frac{R_1 + R_2 + R_3}{3}',
        secondaryFormulas: [
          'P = I^2 R = \\frac{U^2}{R} \\quad (\\text{Cùng } U,\\, R \\text{ nhỏ thì dòng và nhiệt tỏa lớn})'
        ],
        variablesNote:
          '• Khi đặt cùng một hiệu điện thế $U$ lên dây đốt: dây có $R$ nhỏ hơn sẽ cho dòng điện $I = U/R$ lớn hơn và tỏa nhiệt nhanh hơn ($P = U^2/R$).\n• Dây đồng cấp nguồn phải có $R_{\\text{dây}} \\ll R_{\\text{thiết bị}}$ để tránh sụt áp và cháy nổ.'
      },
      deepDiveSection:
        'Trên mô phỏng 2D bên trên: khi giảm điện trở dây đốt $R$ xuống $4\\,\\Omega$ với cùng nguồn $12\\text{ V}$, cường độ dòng điện tăng vọt lên $3\\text{ A}$ và công suất tỏa nhiệt đạt $36\\text{ W}$, làm nước tăng nhiệt nhanh chóng.',
      teacherExplanation:
        'Lưu ý: Khi vẽ đồ thị $I$ theo $U$ từ bảng số liệu thực hành, vẽ một đường thẳng đi qua gốc tọa độ gần đều các điểm đo thực nghiệm nhất thay vì nối gấp khúc từng điểm.',
      keyTakeaway: 'Đo lặp $(U, I)$ nhiều lần tính $\\bar{R} = \\overline{U/I}$; với cùng $U$, $R$ nhỏ tạo dòng lớn và tỏa nhiệt mạnh.',
      miniQuiz: [
        {
          id: 'p9b11-s3-q1',
          question: 'Hai dây dẫn có cùng hiệu điện thế $U$ đặt vào hai đầu. Dây 1 có $R_1 = 6\\,\\Omega$, dây 2 có $R_2 = 18\\,\\Omega$. Tỉ số cường độ dòng điện $I_1 / I_2$ bằng:',
          options: ['A. $1/3$', 'B. $3$', 'C. $9$', 'D. $1$'],
          correctIndex: 1,
          explanation: 'Vì cùng $U$ nên $I$ tỉ lệ nghịch với $R$: $I_1/I_2 = R_2/R_1 = 18/6 = 3$.'
        },
        {
          id: 'p9b11-s3-q2',
          question: 'Khi đo điện trở bằng Vôn kế và Ampe kế thu được 3 cặp $(U, I)$ lần lượt là $(3\\text{ V}; 0{,}25\\text{ A})$, $(6\\text{ V}; 0{,}50\\text{ A})$, $(9\\text{ V}; 0{,}75\\text{ A})$. Giá trị điện trở bằng:',
          options: ['A. $12\\,\\Omega$', 'B. $6\\,\\Omega$', 'C. $15\\,\\Omega$', 'D. $24\\,\\Omega$'],
          correctIndex: 0,
          explanation: '$R = 3/0{,}25 = 6/0{,}5 = 9/0{,}75 = 12\\,\\Omega$.'
        }
      ],
      miniEssay: {
        id: 'p9b11-s3-e1',
        question: 'Tại sao dây dẫn điện trong nhà dùng dây đồng tiết diện lớn, còn dây may-so bên trong máy sấy tóc lại làm bằng hợp kim Nicrôm mảnh quấn xoắn?',
        hint: 'So sánh mục đích của dây nối nguồn (truyền tải ít tỏa nhiệt) với dây đốt nóng (tỏa nhiệt cao).',
        rubricChecklist: [
          'Dây nguồn đồng tiết diện lớn có $\\rho$ nhỏ, $S$ lớn nên $R$ rất nhỏ $\\implies$ ít tỏa nhiệt $I^2R$, an toàn không chảy vỏ nhựa.',
          'Dây máy sấy Nicrôm có $\\rho$ lớn và mảnh nên $R$ lớn, khi dòng đi qua sinh nhiệt mạnh theo $Q = I^2Rt$.'
        ],
        sampleAnswer: 'Dây dẫn trong nhà cần truyền tải điện ít hao phí và không bị nóng chảy vỏ cách điện nên dùng đồng có điện trở suất nhỏ và tiết diện đủ lớn để điện trở $R$ rất nhỏ. Trái lại, dây may-so máy sấy tóc dùng để phát nhiệt nên làm bằng hợp kim Nicrôm có $\\rho$ lớn, tiết diện mảnh và dài để tạo điện trở $R$ lớn, giúp chuyển hóa tối đa điện năng thành nhiệt năng làm nóng luồng gió.'
      }
    }
  ],
  'phys-9-b13': [
    {
      stepTitle: '1. Năng lượng Điện A = UIt & Định luật Jun – Len-xơ',
      stepType: 'concept',
      conceptSection:
        'Dòng điện chạy qua mạch có mang năng lượng điện (điện năng) và chuyển hóa thành cơ năng (quạt, máy bơm), quang năng (đèn LED) hoặc nhiệt năng (bàn là, ấm đun nước).',
      formulaSection: {
        primaryFormula: 'W = A = U \\cdot I \\cdot t',
        secondaryFormulas: [
          'Q_{\\text{tỏa nhiệt}} = I^2 \\cdot R \\cdot t = \\frac{U^2}{R}t \\quad (\\text{Định luật Jun – Len-xơ})',
          '1\\text{ cal} \\approx 4{,}18\\text{ J}'
        ],
        variablesNote:
          '• $U$ (V), $I$ (A), $t$ (giây s), $R$ ($\\Omega$).\n• Năng lượng điện $W$ và nhiệt lượng $Q$ đều đo theo đơn vị Jun ($\\text{J}$).'
      },
      deepDiveSection:
        'Đối với vật dẫn thuần nhiệt (bếp điện, dây đốt ấm siêu tốc, bàn là), toàn bộ điện năng tiêu thụ biến thành nhiệt lượng $Q = I^2Rt$. Nhờ dùng nhiệt lượng kế đo độ tăng nhiệt độ của nước $\\Delta T$ trong mô phỏng 2D, ta nghiệm chứng được $Q$ tỉ lệ với $I^2$, $R$ và $t$.',
      teacherExplanation:
        'Cẩn thận đơn vị thời gian $t$: tính ra Jun ($\\text{J}$) thì phải đổi thời gian ra **giây (s)**.',
      keyTakeaway: 'Năng lượng điện tiêu thụ $W = UIt$; trên điện trở thuần toàn bộ biến thành nhiệt $Q = I^2Rt$.',
      miniQuiz: [
        {
          id: 'p9b13-s1-q1',
          question: 'Cho dòng điện $2\\text{ A}$ chạy qua điện trở $R = 10\\,\\Omega$ trong thời gian $1\\text{ phút}$. Nhiệt lượng tỏa ra trên điện trở là:',
          options: ['A. $40\\text{ J}$', 'B. $2400\\text{ J}$', 'C. $1200\\text{ J}$', 'D. $400\\text{ J}$'],
          correctIndex: 1,
          explanation: 'Đổi $t = 60\\text{ s}$. $Q = I^2 R t = 2^2 \\cdot 10 \\cdot 60 = 2400\\text{ J}$.'
        },
        {
          id: 'p9b13-s1-q2',
          question: 'Nếu tăng cường độ dòng điện qua một dây đốt nóng lên 2 lần và giữ nguyên thời gian đun, nhiệt lượng tỏa ra trên dây sẽ:',
          options: ['A. Tăng 2 lần', 'B. Tăng 4 lần', 'C. Giảm 2 lần', 'D. Không đổi'],
          correctIndex: 1,
          explanation: 'Vì $Q = I^2 R t$ tỉ lệ với bình phương cường độ dòng điện $I^2$ nên $I$ tăng 2 lần làm $Q$ tăng $2^2 = 4$ lần.'
        }
      ],
      miniEssay: {
        id: 'p9b13-s1-e1',
        question: 'Một dây đốt nóng có điện trở $R = 20\\,\\Omega$ nhúng trong bình chứa $0{,}5\\text{ kg}$ nước ($c = 4200\\text{ J/kg.K}$). Cho dòng điện $2{,}5\\text{ A}$ chạy qua trong $2\\text{ phút}$, hiệu suất truyền nhiệt cho nước đạt $84\\%$. Tính độ tăng nhiệt độ $\\Delta t$ của nước.',
        hint: 'Tính $Q_{\\text{tỏa}} = I^2Rt$, rồi $Q_{\\text{nước}} = 0{,}84 Q_{\\text{tỏa}} = mc\\Delta t$.',
        rubricChecklist: [
          'Tính đúng $Q_{\\text{tỏa}} = 2{,}5^2 \\cdot 20 \\cdot 120 = 15\\,000\\text{ J}$.',
          'Tính $Q_{\\text{nước}} = 12\\,600\\text{ J} \\implies \\Delta t = 12\\,600 / (0{,}5 \\cdot 4200) = 6^\\circ\\text{C}$.'
        ],
        sampleAnswer: 'Đổi $t = 2\\text{ phút} = 120\\text{ s}$. Nhiệt lượng dây đốt tỏa ra là $Q_{\\text{tỏa}} = I^2 R t = 2{,}5^2 \\times 20 \\times 120 = 15\\,000\\text{ J}$. Nhiệt lượng nước thu vào là $Q_{\\text{ích}} = 0{,}84 \\times 15\\,000 = 12\\,600\\text{ J}$. Độ tăng nhiệt độ của nước là $\\Delta t = \\frac{Q_{\\text{ích}}}{mc} = \\frac{12\\,600}{0{,}5 \\times 4200} = 6^\\circ\\text{C}$.'
      }
    },
    {
      stepTitle: '2. Công suất Điện P = UI & Số ghi Định mức trên Thiết bị',
      stepType: 'derivation',
      conceptSection:
        'Công suất điện của một đoạn mạch đo năng lượng điện đoạn mạch tiêu thụ trong một giây, bằng tích hiệu điện thế giữa hai đầu đoạn mạch và cường độ dòng điện chạy qua nó.',
      formulaSection: {
        primaryFormula: '\\mathscr{P} = U \\cdot I = \\frac{W}{t}',
        secondaryFormulas: [
          '\\mathscr{P} = I^2 R = \\frac{U^2}{R} \\quad (\\text{với đoạn mạch điện trở thuần})',
          'R_{\\text{đm}} = \\frac{U_{\\text{đm}}^2}{\\mathscr{P}_{\\text{đm}}}, \\qquad I_{\\text{đm}} = \\frac{\\mathscr{P}_{\\text{đm}}}{U_{\\text{đm}}}'
        ],
        variablesNote:
          '• Số ghi định mức trên bóng đèn hoặc bàn là (ví dụ $220\\text{ V} - 1000\\text{ W}$): chỉ khi mắc đúng vào hiệu điện thế $220\\text{ V}$, thiết bị mới hoạt động bình thường đúng công suất $1000\\text{ W}$.'
      },
      deepDiveSection:
        'Nếu mắc bóng đèn $220\\text{ V} - 100\\text{ W}$ vào nơi điện yếu chỉ còn $110\\text{ V}$ (giảm một nửa), vì $\\mathscr{P} = U^2/R$ nên công suất sáng của đèn chỉ còn $1/4$ mức bình thường ($25\\text{ W}$). Ngược lại nếu cắm thiết bị $110\\text{ V}$ vào ổ lưới $220\\text{ V}$ thì công suất vọt lên 4 lần gây cháy nổ ngay lập tức!',
      teacherExplanation:
        'Trên mô phỏng 2D, click preset "Tăng áp gấp đôi (24V)" để thấy ngay từ $12\\text{ V}$ lên $24\\text{ V}$ thì công suất $P$ nhảy từ $24\\text{ W}$ lên $96\\text{ W}$ (gấp 4 lần).',
      keyTakeaway: 'Công suất điện $\\mathscr{P} = UI$; thiết bị hoạt động đúng công suất định mức khi mắc đúng $U_{\\text{đm}}$.',
      miniQuiz: [
        {
          id: 'p9b13-s2-q1',
          question: 'Trên nhãn một ấm siêu tốc có ghi $220\\text{ V} - 1760\\text{ W}$. Cường độ dòng điện định mức và điện trở của ấm khi hoạt động bình thường là:',
          options: ['A. $8\\text{ A}$ và $27{,}5\\,\\Omega$', 'B. $0{,}125\\text{ A}$ và $27{,}5\\,\\Omega$', 'C. $8\\text{ A}$ và $55\\,\\Omega$', 'D. $4\\text{ A}$ và $55\\,\\Omega$'],
          correctIndex: 0,
          explanation: '$I_{\\text{đm}} = 1760 / 220 = 8\\text{ A}$; $R = 220 / 8 = 27{,}5\\,\\Omega$.'
        },
        {
          id: 'p9b13-s2-q2',
          question: 'Mắc một bóng đèn ghi $12\\text{ V} - 12\\text{ W}$ vào nguồn điện có hiệu điện thế chỉ $6\\text{ V}$ (coi điện trở đèn không đổi). Công suất thực tế của đèn lúc này là:',
          options: ['A. $12\\text{ W}$', 'B. $6\\text{ W}$', 'C. $3\\text{ W}$', 'D. $24\\text{ W}$'],
          correctIndex: 2,
          explanation: '$R = U_{\\text{đm}}^2/\\mathscr{P}_{\\text{đm}} = 144/12 = 12\\,\\Omega$. Khi $U = 6\\text{ V}$: $\\mathscr{P} = 6^2/12 = 3\\text{ W}$.'
        }
      ],
      miniEssay: {
        id: 'p9b13-s2-e1',
        question: 'Có hai bóng đèn dây tóc Đ1 ($220\\text{ V} - 60\\text{ W}$) và Đ2 ($220\\text{ V} - 100\\text{ W}$) mắc song song vào lưới điện $220\\text{ V}$. Đèn nào sáng hơn và đèn nào có điện trở dây tóc nhỏ hơn?',
        hint: 'Trong mạch song song $U_1 = U_2 = 220\\text{ V}$ nên hai đèn dùng đúng $U_{\\text{đm}}$; kiểm tra $R = U_{\\text{đm}}^2 / \\mathscr{P}_{\\text{đm}}$.',
        rubricChecklist: [
          'Khi mắc song song vào $220\\text{ V}$, cả hai sáng bình thường: Đ2 ($100\\text{ W}$) tiêu thụ công suất lớn hơn nên sáng hơn.',
          'Vì $R = U^2/\\mathscr{P}$, đèn Đ2 công suất lớn hơn nên có điện trở dây tóc nhỏ hơn Đ1.'
        ],
        sampleAnswer: 'Do mắc song song vào lưới điện $220\\text{ V}$, cả hai đèn đều nhận đúng hiệu điện thế định mức nên Đ2 ($100\\text{ W}$) sáng hơn Đ1 ($60\\text{ W}$). Tính điện trở: $R_1 = 220^2/60 \\approx 806{,}7\\,\\Omega$, $R_2 = 220^2/100 = 484\\,\\Omega$. Vậy đèn có công suất định mức lớn hơn (Đ2) có điện trở nhỏ hơn để cho dòng điện lớn hơn đi qua.'
      }
    },
    {
      stepTitle: '3. Chỉ số Công tơ Điện (kWh) & Hóa đơn Tiền điện Thực tế',
      stepType: 'example',
      conceptSection:
        'Trong sinh hoạt hàng ngày, năng lượng điện tiêu thụ của hộ gia đình được đo bằng công tơ điện (đồng hồ đo điện) theo đơn vị kilôoát giờ (kWh), thường gọi dân dã là "số điện".',
      formulaSection: {
        primaryFormula: '1\\text{ kWh} = 1000\\text{ W} \\cdot 3600\\text{ s} = 3{,}6 \\cdot 10^6\\text{ J}',
        secondaryFormulas: [
          'W\\text{ (kWh)} = \\mathscr{P}\\text{ (kW)} \\cdot t\\text{ (giờ)}',
          '\\text{Tiền điện} = W\\text{ (kWh)} \\times \\text{Đơn giá}'
        ],
        variablesNote:
          '• Để tính ra **kWh**: đổi công suất về **kW** (chia 1000) và thời gian về **giờ (h)**.\n• Khi dùng đồng thời nhiều thiết bị điện công suất lớn (bình nóng lạnh, bếp từ, điều hòa) trên cùng một ổ cắm, tổng dòng $I_{\\text{tổng}} = \\sum P_i / 220$ rất lớn dễ gây quá tải cháy dây, cần aptomat (cầu dao tự động) bảo vệ.'
      },
      deepDiveSection:
        'So sánh tiết kiệm năng lượng: thay một bóng đèn sợi đốt $60\\text{ W}$ bằng bóng đèn LED $9\\text{ W}$ có cùng độ sáng, nếu thắp $5\\text{ giờ/ngày}$ trong 1 tháng ($30\\text{ ngày}$) thì giảm lượng điện tiêu thụ từ $9\\text{ kWh}$ xuống còn $1{,}35\\text{ kWh}$ (tiết kiệm tới $85\\%$!).',
      teacherExplanation:
        'Đừng nhầm $1\\text{ kW}$ (đơn vị công suất) với $1\\text{ kWh}$ (đơn vị năng lượng/số điện)!',
      keyTakeaway: '1 số điện = 1 kWh = $3{,}6\\cdot 10^6\\text{ J}$; tính kWh bằng cách lấy $\\mathscr{P}(\\text{kW}) \\times t(\\text{h})$.',
      miniQuiz: [
        {
          id: 'p9b13-s3-q1',
          question: 'Công tơ điện trong gia đình dùng để đo trực tiếp đại lượng nào?',
          options: [
            'A. Cường độ dòng điện cực đại',
            'B. Công suất tức thời của thiết bị',
            'C. Tổng năng lượng điện (điện năng) tiêu thụ',
            'D. Hiệu điện thế lưới điện'
          ],
          correctIndex: 2,
          explanation: 'Mỗi số tăng thêm trên công tơ tương ứng $1\\text{ kWh}$ điện năng gia đình đã tiêu thụ.'
        },
        {
          id: 'p9b13-s3-q2',
          question: 'Một máy điều hòa công suất $1200\\text{ W}$ chạy trung bình $5\\text{ giờ}$ mỗi ngày. Điện năng máy tiêu thụ trong 30 ngày là:',
          options: ['A. $18\\text{ kWh}$', 'B. $180\\text{ kWh}$', 'C. $180\\,000\\text{ kWh}$', 'D. $6\\text{ kWh}$'],
          correctIndex: 1,
          explanation: '$W = 1{,}2\\text{ kW} \\times 5\\text{ h} \\times 30 = 180\\text{ kWh}$.'
        }
      ],
      miniEssay: {
        id: 'p9b13-s3-e1',
        question: 'Một phòng học lắp 8 bóng đèn LED $18\\text{ W}$ và 4 quạt trần $75\\text{ W}$ hoạt động trung bình $6\\text{ giờ/ngày}$, tháng học $26\\text{ ngày}$. Tính tổng điện năng tiêu thụ trong tháng (ra kWh) và dòng điện tổng chạy qua aptomat nhánh ($220\\text{ V}$) khi bật tất cả.',
        hint: 'Tính tổng công suất $P_{\\text{tổng}}$ ra W và kW trước.',
        rubricChecklist: [
          'Tính $P_{\\text{tổng}} = 8\\cdot 18 + 4\\cdot 75 = 444\\text{ W} = 0{,}444\\text{ kW}$.',
          'Tính $W = 0{,}444\\cdot 6\\cdot 26 = 69{,}264\\text{ kWh}$ và dòng $I = 444 / 220 \\approx 2{,}02\\text{ A}$.'
        ],
        sampleAnswer: 'Tổng công suất thiết bị trong phòng: $P_{\\text{tổng}} = 8 \\times 18 + 4 \\times 75 = 144 + 300 = 444\\text{ W} = 0{,}444\\text{ kW}$. Tổng điện năng tiêu thụ trong tháng: $W = 0{,}444 \\times 6 \\times 26 = 69{,}264\\text{ kWh}$. Cường độ dòng điện qua aptomat nhánh khi bật toàn bộ ở $220\\text{ V}$ là $I = \\frac{P_{\\text{tổng}}}{U} = \\frac{444}{220} \\approx 2{,}02\\text{ A}$.'
      }
    }
  ],
  'phys-9-b15': [
    {
      stepTitle: '1. Bốn Tác dụng của Dòng điện Xoay chiều & An toàn Điện',
      stepType: 'concept',
      conceptSection:
        'Tương tự dòng một chiều, dòng điện xoay chiều (AC) cũng gây ra tác dụng nhiệt, tác dụng phát sáng, tác dụng từ và tác dụng sinh lí — nhưng lực từ do dòng xoay chiều sinh ra đổi chiều liên tục theo tần số lưới điện.',
      formulaSection: {
        primaryFormula: 'Q = I_{\\text{hd}}^2 \\cdot R \\cdot t \\quad (\\text{Tác dụng nhiệt ổn định})',
        secondaryFormulas: [
          'f = 50\\text{ Hz} \\implies \\text{Lực từ đổi chiều } 100\\text{ lần/giây}'
        ],
        variablesNote:
          '• **Tác dụng nhiệt**: làm nóng dây đốt bếp điện, bàn là, ấm siêu tốc.\n• **Tác dụng phát sáng**: bóng đèn LED, huỳnh quang, bút thử điện.\n• **Tác dụng từ**: chuông điện xoay chiều, động cơ quạt – máy giặt; nếu đưa kim nam châm nhỏ lại gần ống dây AC $50\\text{ Hz}$ thì kim rung tại chỗ chứ không hút hẳn một cực cố định.\n• **Tác dụng sinh lí**: gây co giật mạnh, nguy hiểm tính mạng ở lưới $220\\text{ V}$.'
      },
      deepDiveSection:
        'Ampe kế hoặc Vôn kế đo dòng xoay chiều thường ghi kí hiệu **AC** (hoặc dấu `~`) đo **giá trị hiệu dụng**: một dòng xoay chiều có cường độ hiệu dụng $I = 2\\text{ A}$ sẽ tỏa ra đúng lượng nhiệt bằng dòng một chiều $2\\text{ A}$ khi đi qua cùng một điện trở trong cùng thời gian.',
      teacherExplanation:
        'Chú ý thí nghiệm kinh điển: Bóng đèn huỳnh quang hoặc đèn bút thử điện xoay chiều sáng ở cả hai cực điện, chứng tỏ dòng điện đổi chiều liên tục.',
      keyTakeaway: 'Dòng xoay chiều có tác dụng nhiệt, phát sáng, từ (đổi chiều 2f lần/s) và tác dụng sinh lí mạnh.',
      miniQuiz: [
        {
          id: 'p9b15-s1-q1',
          question: 'Một ampe kế xoay chiều mắc vào mạch bếp điện chỉ giá trị $5\\text{ A}$. Số chỉ này cho biết:',
          options: [
            'A. Cường độ dòng điện hiệu dụng bằng $5\\text{ A}$',
            'B. Dòng điện chỉ chạy theo một chiều cố định $5\\text{ A}$',
            'C. Tần số dòng điện là $5\\text{ Hz}$',
            'D. Điện trở bếp bằng $5\\,\\Omega$'
          ],
          correctIndex: 0,
          explanation: 'Các đồng hồ đo điện xoay chiều được hiệu chuẩn để đọc trực tiếp giá trị hiệu dụng dựa trên tác dụng nhiệt.'
        },
        {
          id: 'p9b15-s1-q2',
          question: 'Khi đặt một đinh sắt non nằm gần ống dây có dòng điện xoay chiều $50\\text{ Hz}$ chạy qua, hiện tượng nào xảy ra?',
          options: [
            'A. Không có lực từ tác dụng lên đinh sắt',
            'B. Đinh sắt bị hút và rung nhẹ theo tần số dòng điện',
            'C. Đinh sắt biến thành nam châm vĩnh cửu vĩnh viễn',
            'D. Ống dây biến dòng xoay chiều thành một chiều'
          ],
          correctIndex: 1,
          explanation: 'Dòng xoay chiều gây tác dụng từ đổi cực liên tục nên vẫn hút sắt non (sắt bị từ hóa đảo chiều theo) và làm đinh rung nhẹ.'
        }
      ],
      miniEssay: {
        id: 'p9b15-s1-e1',
        question: 'Tại sao cùng giá trị $220\\text{ V}$, việc chạm tay vào lưới điện xoay chiều trong nhà lại cực kỳ nguy hiểm và người ta phải lắp thiết bị chống giật (ELCB/RCBO)?',
        hint: 'Liên hệ tác dụng sinh lí của dòng xoay chiều trên hệ thần kinh và tim mạch.',
        rubricChecklist: [
          'Dòng xoay chiều $50\\text{ Hz}$ gây tác dụng sinh lí mạnh, làm co cứng cơ khiến nạn nhân không tự giật tay ra được và gây rung thất ngừng tim.',
          'RCBO/ELCB phát hiện dòng rò nhỏ qua người (~30 mA) và ngắt mạch tức thì trong vài chục mili-giây.'
        ],
        sampleAnswer: 'Dòng điện xoay chiều $220\\text{ V} - 50\\text{ Hz}$ gây tác dụng sinh lí rất mạnh lên hệ thần kinh và cơ bắp: dòng điện từ $20-50\\text{ mA}$ đi qua cơ thể làm cơ bắp co cứng (không thả tay khỏi dây điện được) và có thể gây rối loạn nhịp tim dẫn đến tử vong. Thiết bị chống giật ELCB/RCBO phát hiện dòng rò siêu nhỏ (~$30\\text{ mA}$) để ngắt điện ngay lập tức bảo vệ tính mạng.'
      }
    },
    {
      stepTitle: '2. Máy Biến áp — Tăng/Hạ Điện áp Xoay chiều',
      stepType: 'derivation',
      conceptSection:
        'Máy biến áp là thiết bị biến đổi điện áp xoay chiều (tăng áp hoặc hạ áp) nhờ hiện tượng cảm ứng điện từ mà không làm thay đổi tần số dòng điện.',
      formulaSection: {
        primaryFormula: '\\frac{U_1}{U_2} = \\frac{N_1}{N_2}',
        secondaryFormulas: [
          'N_2 > N_1 \\implies U_2 > U_1 \\; (\\text{Máy tăng áp})',
          'N_2 < N_1 \\implies U_2 < U_1 \\; (\\text{Máy hạ áp})'
        ],
        variablesNote:
          '• Cấu tạo gồm 2 cuộn dây dẫn cách điện có số vòng $N_1$ (sơ cấp), $N_2$ (thứ cấp) quấn quanh một lõi thép kĩ thuật điện ghép lá mỏng.\n• Máy biến áp KHÔNG hoạt động với dòng điện một chiều không đổi (pin/ắc quy).'
      },
      deepDiveSection:
        'Vì lõi thép được ghép từ nhiều lá thép silic mỏng phủ sơn cách điện thay vì đúc đặc một khối, dòng điện cảm ứng xoáy (dòng Foucault) sinh ra bên trong lõi bị triệt tiêu đáng kể giúp máy biến áp ít nóng và đạt hiệu suất truyền năng lượng trên $95\\% - 99\\%$.',
      teacherExplanation:
        'Nhớ công thức tỉ lệ thuận cực gọn: Điện áp hai đầu cuộn dây tỉ lệ thuận với số vòng dây ($U \\propto N$).',
      keyTakeaway: 'Tỉ số điện áp sơ/thứ cấp bằng tỉ số số vòng dây: $U_1/U_2 = N_1/N_2$; chỉ hoạt động với dòng xoay chiều.',
      miniQuiz: [
        {
          id: 'p9b15-s2-q1',
          question: 'Cuộn sơ cấp của một máy biến áp có $4400$ vòng nối vào mạng điện $220\\text{ V}$. Muốn lấy ra điện áp $12\\text{ V}$ ở cuộn thứ cấp thì phải quấn bao nhiêu vòng?',
          options: ['A. $120$ vòng', 'B. $240$ vòng', 'C. $480$ vòng', 'D. $220$ vòng'],
          correctIndex: 1,
          explanation: '$N_2 = N_1 \\cdot \\frac{U_2}{U_1} = 4400 \\cdot \\frac{12}{220} = 240$ vòng.'
        },
        {
          id: 'p9b15-s2-q2',
          question: 'Khi nối cuộn sơ cấp của máy biến áp với hai cực của một bình ắc quy $12\\text{ V}$ không đổi, điện áp thu được ở hai đầu cuộn thứ cấp sẽ bằng:',
          options: ['A. $24\\text{ V}$', 'B. $12\\text{ V}$', 'C. $0\\text{ V}$', 'D. $6\\text{ V}$'],
          correctIndex: 2,
          explanation: 'Dòng một chiều không đổi tạo từ trường không đổi nên từ thông qua cuộn thứ cấp không biến thiên, không xuất hiện điện áp cảm ứng ($U_2 = 0$).'
        }
      ],
      miniEssay: {
        id: 'p9b15-s2-e1',
        question: 'Một bộ sạc điện dùng máy biến áp hạ áp từ $220\\text{ V}$ xuống $11\\text{ V}$, biết cuộn thứ cấp có $100$ vòng. Tính số vòng cuộn sơ cấp và nếu hiệu điện thế lưới sụt xuống còn $198\\text{ V}$ thì điện áp đầu ra thay đổi thành bao nhiêu?',
        hint: 'Tỉ số vòng dây $N_1 / N_2 = 220 / 11 = 20$ giữ cố định.',
        rubricChecklist: [
          'Tính $N_1 = 100 \\cdot (220/11) = 2000$ vòng.',
          'Khi $U_1\' = 198\\text{ V}$, $U_2\' = 198 / 20 = 9{,}9\\text{ V}$.'
        ],
        sampleAnswer: 'Số vòng cuộn sơ cấp là $N_1 = N_2 \\frac{U_1}{U_2} = 100 \\times \\frac{220}{11} = 2000$ vòng (tỉ số biến áp $20 : 1$). Khi điện áp lưới sụt xuống $198\\text{ V}$, điện áp thứ cấp lúc này là $U_2\' = \\frac{198}{20} = 9{,}9\\text{ V}$.'
      }
    },
    {
      stepTitle: '3. Truyền tải Điện năng đi xa & Giảm Hao phí ΔP = P²R/U²',
      stepType: 'example',
      conceptSection:
        'Nhà máy thủy điện/nhiệt điện thường đặt cách khu dân cư hàng trăm đến hàng nghìn km. Trên đường dây dài luôn phát sinh công suất hao phí tỏa nhiệt $\\Delta P = I^2 R$; muốn giảm mạnh hao phí phải tăng điện áp truyền tải $U$.',
      formulaSection: {
        primaryFormula: '\\Delta P = I^2 R = \\frac{P^2 R}{U^2}',
        secondaryFormulas: [
          'U \\text{ tăng } k \\text{ lần} \\implies \\Delta P \\text{ giảm } k^2 \\text{ lần}',
          'R = \\rho\\frac{l}{S} \\quad (\\text{Giảm } R \\text{ bằng tăng tiết diện tốn kém đồng/nhôm rất nhiều})'
        ],
        variablesNote:
          '• $P$: công suất điện cần truyền tải ($\\text{W}$); $U$: hiệu điện thế nơi phát ($\\text{V}$); $R$: tổng điện trở đường dây ($\\Omega$).\n• Mạng truyền tải quốc gia Việt Nam nâng áp lên $220\\text{ kV}$ và $500\\text{ kV}$ ở trạm đầu nguồn rồi hạ dần ở khu vực tiêu thụ.'
      },
      deepDiveSection:
        'Bấm preset "Tăng áp 5 lần (Siêu tiết kiệm)" trong mô phỏng Máy Biến Áp 2D để thấy trực quan: khi $N_2/N_1 = 5$, điện áp truyền tăng $5$ lần còn kim đồng hồ công suất hao phí trên đường dây lập tức tụt xuống chỉ còn $1/25$ ($4\\%$) so với ban đầu!',
      teacherExplanation:
        'Đây là câu hỏi Vật lí thực tế hay gặp nhất trong đề thi vào 10: tại sao không giảm $R$ bằng cách làm dây thật to mà lại tăng $U$? Vì tăng đường kính dây làm đường dây quá nặng, dễ đứt và cực tốn kim loại, trong khi tăng $U$ bằng máy biến áp giảm hao phí theo bình phương $U^2$.',
      keyTakeaway: 'Tăng điện áp truyền tải $U$ lên $k$ lần là giải pháp kinh tế nhất vì làm hao phí $\\Delta P$ giảm $k^2$ lần.',
      miniQuiz: [
        {
          id: 'p9b15-s3-q1',
          question: 'Khi truyền tải cùng một công suất điện $P$ đi xa trên cùng đường dây điện trở $R$, muốn giảm công suất hao phí đi $16$ lần thì phải:',
          options: [
            'A. Tăng hiệu điện thế truyền tải lên $16$ lần',
            'B. Tăng hiệu điện thế truyền tải lên $4$ lần',
            'C. Giảm hiệu điện thế truyền tải xuống $4$ lần',
            'D. Tăng điện trở dây dẫn lên $4$ lần'
          ],
          correctIndex: 1,
          explanation: 'Vì $\\Delta P \\propto 1/U^2$, muốn $\\Delta P$ giảm $16$ lần thì cần tăng $U$ lên $\\sqrt{16} = 4$ lần.'
        },
        {
          id: 'p9b15-s3-q2',
          question: 'Ở đầu đường dây tải điện tại nhà máy thủy điện Sơn La đặt loại máy biến áp nào, và ở trạm biến áp khu phố đặt loại nào?',
          options: [
            'A. Đầu nguồn: Hạ áp; Khu phố: Tăng áp',
            'B. Đầu nguồn: Tăng áp; Khu phố: Hạ áp',
            'C. Cả hai đều dùng máy tăng áp',
            'D. Cả hai đều dùng máy hạ áp'
          ],
          correctIndex: 1,
          explanation: 'Đầu nguồn tăng áp lên cao thế (220 kV / 500 kV) để giảm hao phí; gần nơi tiêu thụ hạ áp xuống còn 220 V phục vụ dân dụng.'
        }
      ],
      miniEssay: {
        id: 'p9b15-s3-e1',
        question: 'Truyền đi công suất $P = 200\\text{ kW}$ trên đường dây có điện trở $R = 10\\,\\Omega$. Tính công suất hao phí và phần trăm năng lượng mất mát nếu truyền ở $U_1 = 5\\text{ kV}$ và khi dùng máy tăng áp nâng lên $U_2 = 25\\text{ kV}$.',
        hint: 'Đổi $P = 2\\cdot 10^5\\text{ W}$, $U_1 = 5000\\text{ V}$ rồi tính $\\Delta P_1 = P^2 R/U_1^2$; khi tăng $U$ gấp 5 lần thì $\\Delta P_2 = \\Delta P_1 / 25$.',
        rubricChecklist: [
          'Ở $5\\text{ kV}$: $\\Delta P_1 = \\frac{(2\\cdot 10^5)^2 \\cdot 10}{5000^2} = 16\\,000\\text{ W} = 16\\text{ kW}$ (mất $8\\%$).',
          'Ở $25\\text{ kV}$: $\\Delta P_2 = 16 / 25 = 0{,}64\\text{ kW} = 640\\text{ W}$ (chỉ còn mất $0{,}32\\%$).'
        ],
        sampleAnswer: 'Đổi $P = 200\\,000\\text{ W}$, $U_1 = 5000\\text{ V}$. Khi truyền ở $5\\text{ kV}$, hao phí tỏa nhiệt là $\\Delta P_1 = \\frac{200\\,000^2 \\times 10}{5000^2} = 16\\,000\\text{ W} = 16\\text{ kW}$ (chiếm $16/200 = 8\\%$ công suất phát). Khi tăng áp gấp 5 lần lên $U_2 = 25\\text{ kV}$, hao phí giảm $5^2 = 25$ lần còn $\\Delta P_2 = \\frac{16}{25} = 0{,}64\\text{ kW} = 640\\text{ W}$ (chỉ còn $0{,}32\\%$).'
      }
    }
  ],
  'phys-9-b16': [
    {
      stepTitle: '1. Vòng Năng lượng trên Trái Đất từ Bức xạ Mặt Trời',
      stepType: 'concept',
      conceptSection:
        'Hầu hết các dạng năng lượng tự nhiên trên Trái Đất — từ gió, mưa, dòng chảy sông ngòi đến sinh khối và than đá, dầu mỏ — đều bắt nguồn trực tiếp hoặc gián tiếp từ năng lượng bức xạ của Mặt Trời.',
      formulaSection: {
        primaryFormula: '\\text{Bức xạ Mặt Trời} \\to \\text{Nhiệt khí quyển + Bay hơi nước + Quang hợp}',
        secondaryFormulas: [
          '\\text{Năng lượng gió (đối lưu không khí)} \\xleftarrow{\\Delta T} \\text{Năng lượng Mặt Trời}',
          '\\text{Thủy năng (mưa, hồ chứa)} \\xleftarrow{\\text{Bay hơi - Ngưng tụ}} \\text{Năng lượng Mặt Trời}'
        ],
        variablesNote:
          '• Không khí vùng xích đạo nóng nở ra, nhẹ đi và bốc lên cao, không khí lạnh ở cực và biển tràn vào tạo thành **gió** (động năng không khí).\n• Nước biển bay hơi ngưng tụ thành mây rồi rơi xuống núi cao tích trữ **thế năng trọng trường** tạo nên **thủy năng**.'
      },
      deepDiveSection:
        'Quan sát mô phỏng chuyển động nhiệt phân tử khí ở trên: khi tăng nhiệt độ $T$, tốc độ chuyển động hỗn loạn và áp suất khí tăng mạnh — mô hình hóa trực quan động lực làm giãn nở cột khí nóng xích đạo vận hành chu trình gió mậu dịch và gió mùa.',
      teacherExplanation:
        'Trong chu trình carbon – năng lượng, thực vật hấp thụ ánh sáng Mặt Trời tổng hợp chất hữu cơ (sinh khối). Sau hàng triệu năm bị vùi lấp dưới áp suất và nhiệt độ cao trong lòng đất, chúng hóa thành nhiên liệu hóa thạch (than đá, dầu mỏ, khí đốt).',
      keyTakeaway: 'Mặt Trời là nguồn gốc vận hành vòng tuần hoàn nước (thủy năng), đối lưu gió và tích lũy sinh khối/nhiên liệu hóa thạch.',
      miniQuiz: [
        {
          id: 'p9b16-s1-q1',
          question: 'Nguồn năng lượng khởi phát cho vòng tuần hoàn nước trên Trái Đất (làm nước biển bay hơi lên cao tạo mưa nuôi thủy điện) là:',
          options: [
            'A. Năng lượng gió',
            'B. Năng lượng bức xạ Mặt Trời',
            'C. Năng lượng địa nhiệt lòng đất',
            'D. Năng lượng thủy triều'
          ],
          correctIndex: 1,
          explanation: 'Nhiệt bức xạ từ Mặt Trời làm nước đại dương bay hơi lên cao (tích thế năng), ngưng tụ thành mây mưa đổ xuống sông hồ.'
        },
        {
          id: 'p9b16-s1-q2',
          question: 'Cơ chế vật lí trực tiếp tạo ra gió trong khí quyển là:',
          options: [
            'A. Mặt Trăng hút bầu khí quyển',
            'B. Sự đốt nóng không đều bề mặt Trái Đất của Mặt Trời gây chênh lệch nhiệt độ và áp suất (đối lưu)',
            'C. Tiếng sấm sét đẩy không khí di chuyển',
            'D. Cây cối quang hợp thổi khí oxi ra không trung'
          ],
          correctIndex: 1,
          explanation: 'Bề mặt đất và biển nóng lên không đều tạo vùng áp suất thấp (khí nóng bốc lên) và áp suất cao (khí lạnh tràn vào) tạo thành gió.'
        }
      ],
      miniEssay: {
        id: 'p9b16-s1-e1',
        question: 'Sắp xếp chuỗi chuyển hóa năng lượng chính từ Mặt Trời tới lúc bóng đèn trong nhà sáng lên nhờ nhà máy thủy điện.',
        hint: 'Bức xạ Mặt Trời → Bay hơi/Thế năng → Động năng nước → Điện năng → Quang năng.',
        rubricChecklist: [
          'Nêu đủ các mắt xích: Quang năng/Nhiệt năng Mặt Trời → Thế năng hơi nước/nước hồ đập.',
          'Thế năng cột nước → Động năng tua-bin → Điện năng máy phát → Quang năng + nhiệt năng bóng đèn.'
        ],
        sampleAnswer: 'Chuỗi chuyển hóa gồm: (1) Năng lượng bức xạ Mặt Trời làm bay hơi nước đại dương đưa lên cao thành thế năng mây mưa; (2) Nước mưa tích trong hồ đập trên núi cao có thế năng trọng trường; (3) Nước xả xuống làm quay tua-bin (chuyển thế năng thành động năng); (4) Máy phát biến động năng quay thành điện năng; (5) Bóng đèn chuyển điện năng thành quang năng (và một phần nhiệt năng).'
      }
    },
    {
      stepTitle: '2. Năng lượng Hóa thạch vs Năng lượng Tái tạo',
      stepType: 'derivation',
      conceptSection:
        'Nguồn năng lượng trên Trái Đất chia thành hai nhóm lớn: năng lượng không tái tạo (nhiên liệu hóa thạch như than đá, dầu mỏ, khí tự nhiên) và năng lượng tái tạo (Mặt Trời, gió, thủy điện, sinh khối, địa nhiệt).',
      formulaSection: {
        primaryFormula: 'P_{\\text{gió}} = \\frac{1}{2}\\rho A v^3 \\quad (\\text{Tỉ lệ lập phương với tốc độ gió})',
        secondaryFormulas: [
          'P_{\\text{thủy điện}} = H \\cdot \\rho g Q_{\\text{lưu lượng}} \\cdot h_{\\text{cột nước}}'
        ],
        variablesNote:
          '• **Nhiên liệu hóa thạch**: cung cấp năng lượng ổn định không phụ thuộc thời tiết, công suất tập trung cao nhưng trữ lượng hữu hạn và phát thải $\\text{CO}_2$ gây biến đổi khí hậu.\n• **Năng lượng tái tạo**: tự bổ sung liên tục, phát thải ròng cực thấp nhưng cần công nghệ lưu trữ pin/tích năng khi không có nắng gió.'
      },
      deepDiveSection:
        'Từ công thức công suất tua-bin gió $P_{\\text{gió}} = \\frac{1}{2}\\rho A v^3$: nếu tốc độ gió $v$ tăng gấp đôi thì công suất điện thu được tăng tới $2^3 = 8$ lần! Đó là lý do các trụ điện gió hiện đại được xây rất cao và đặt ngoài khơi xa nơi tốc độ gió lớn và ổn định.',
      teacherExplanation:
        'Không có nguồn năng lượng nào hoàn hảo 100%: ngay cả thủy điện lớn cũng cần tính toán diện tích ngập lòng hồ và bảo vệ hệ sinh thái dòng sông.',
      keyTakeaway: 'Năng lượng tái tạo vô tận và sạch hơn nhiên liệu hóa thạch nhưng phụ thuộc thời tiết và đòi hỏi lưu trữ.',
      miniQuiz: [
        {
          id: 'p9b16-s2-q1',
          question: 'Nguồn năng lượng nào sau đây thuộc nhóm Năng lượng Không tái tạo?',
          options: ['A. Năng lượng gió', 'B. Dầu mỏ và than đá', 'C. Thủy năng', 'D. Năng lượng Mặt Trời'],
          correctIndex: 1,
          explanation: 'Than đá, dầu mỏ, khí tự nhiên hình thành qua hàng trăm triệu năm và cạn kiệt dần khi khai thác nên là năng lượng không tái tạo.'
        },
        {
          id: 'p9b16-s2-q2',
          question: 'Công suất thu được của một tua-bin gió phụ thuộc theo lũy thừa bậc mấy của tốc độ gió $v$?',
          options: ['A. Bậc nhất ($v$)', 'B. Bậc hai ($v^2$)', 'C. Bậc ba ($v^3$)', 'D. Không phụ thuộc $v$'],
          correctIndex: 2,
          explanation: 'Vì lưu lượng khối khí qua cánh quạt tỉ lệ với $v$ và động năng mỗi kg khí tỉ lệ với $v^2$ nên công suất $P \\propto v^3$.'
        }
      ],
      miniEssay: {
        id: 'p9b16-s2-e1',
        question: 'Tại sao hệ thống điện quốc gia vẫn cần kết hợp trạm pin tích năng hoặc thủy điện tích năng khi tăng mạnh tỉ trọng điện Mặt Trời và điện gió?',
        hint: 'Xét sự lệch pha giữa giờ nắng/gió cực đại và giờ cao điểm dùng điện buổi tối.',
        rubricChecklist: [
          'Điện Mặt Trời chỉ phát vào ban ngày và giảm mạnh khi trời nhiều mây; điện gió dao động theo thời tiết.',
          'Nhu cầu điện sinh hoạt đạt đỉnh vào buổi tối khi hết nắng, nên cần hệ thống lưu trữ tích điện dư ban ngày để phát lại vào giờ cao điểm.'
        ],
        sampleAnswer: 'Điện Mặt Trời đạt đỉnh vào buổi trưa nắng nhưng bằng 0 vào ban đêm, còn điện gió biến động thất thường theo thời tiết. Trong khi đó nhu cầu tiêu thụ điện dân dụng cao nhất vào buổi tối. Do vậy lưới điện cần hệ thống pin lưu trữ hoặc thủy điện tích năng để hấp thụ lượng điện dư lúc nắng to/gió mạnh và bù công suất cho lưới vào ban đêm.'
      }
    },
    {
      stepTitle: '3. Hiệu suất Chuyển hóa & Thực hành Đánh giá Tiết kiệm Năng lượng',
      stepType: 'example',
      conceptSection:
        'Trong mọi nhà máy điện hay thiết bị dân dụng, phần năng lượng hữu ích thu được luôn nhỏ hơn năng lượng toàn phần đầu vào do thất thoát nhiệt và ma sát cơ khí.',
      formulaSection: {
        primaryFormula: 'H = \\frac{W_{\\text{có ích}}}{W_{\\text{toàn phần}}} \\cdot 100\\% = \\frac{\\mathscr{P}_{\\text{điện}}}{\\mathscr{P}_{\\text{nguồn}}} \\cdot 100\\%',
        secondaryFormulas: [
          '\\text{Hiệu suất pin Mặt Trời thương mại: } 18\\% \\dots 24\\%',
          '\\text{Hiệu suất nhà máy thủy điện hiện đại: } 85\\% \\dots 92\\%'
        ],
        variablesNote:
          '• Năng lượng tiết kiệm tốt nhất là nâng cao hiệu suất sử dụng (đèn LED, động cơ Inverter, cách nhiệt tốt) kết hợp giảm lãng phí không cần thiết.'
      },
      deepDiveSection:
        'Một nhà máy nhiệt điện than thường chỉ đạt hiệu suất $35\\% - 40\\%$ (hơn $60\\%$ nhiệt đốt than thoát ra tháp làm mát và khí thải), trong khi thủy điện chuyển trực tiếp thế năng cơ học sang điện năng có thể đạt hiệu suất tới $90\\%$.',
      teacherExplanation:
        'Khi tính bài toán thủy điện hoặc pin Mặt Trời, luôn kiểm tra đơn vị thời gian giây (để tính công suất W) hay giờ (để tính kWh).',
      keyTakeaway: 'Nâng cao hiệu suất $H$ và sử dụng năng lượng sạch là giải pháp kép bảo vệ môi trường bền vững.',
      miniQuiz: [
        {
          id: 'p9b16-s3-q1',
          question: 'Một hồ thủy điện xả $50\\text{ m}^3$ nước mỗi giây từ độ cao $40\\text{ m}$ xuống tua-bin ($\\rho = 1000\\text{ kg/m}^3, g = 10\\text{ m/s}^2$) với hiệu suất $80\\%$. Công suất điện phát ra bằng:',
          options: ['A. $16\\text{ MW}$', 'B. $20\\text{ MW}$', 'C. $160\\text{ kW}$', 'D. $25\\text{ MW}$'],
          correctIndex: 0,
          explanation: 'Mỗi giây khối lượng nước là $50\\,000\\text{ kg}$ sinh công cơ toàn phần $50\\,000 \\cdot 10 \\cdot 40 = 20\\text{ MW} \\implies P_{\\text{điện}} = 0{,}8\\cdot 20 = 16\\text{ MW}$.'
        },
        {
          id: 'p9b16-s3-q2',
          question: 'Giàn pin Mặt Trời diện tích $20\\text{ m}^2$ nhận cường độ bức xạ nắng $800\\text{ W/m}^2$ với hiệu suất chuyển hóa $20\\%$. Công suất điện cung cấp là:',
          options: ['A. $3{,}2\\text{ kW}$', 'B. $16\\text{ kW}$', 'C. $1{,}6\\text{ kW}$', 'D. $4{,}0\\text{ kW}$'],
          correctIndex: 0,
          explanation: 'Công suất nắng toàn phần $P_{\\text{tp}} = 20\\cdot 800 = 16\\,000\\text{ W} = 16\\text{ kW} \\implies P_{\\text{điện}} = 0{,}2 \\cdot 16 = 3{,}2\\text{ kW}$.'
        }
      ],
      miniEssay: {
        id: 'p9b16-s3-e1',
        question: 'Một mái nhà lắp hệ thống pin Mặt Trời công suất trung bình hiệu dụng $3\\text{ kW}$, phát nắng tốt $5\\text{ giờ/ngày}$ trong $30\\text{ ngày}$. Tính sản lượng điện sạch tạo ra trong tháng (kWh) và lượng khí $\\text{CO}_2$ giảm phát thải được (biết mỗi $1\\text{ kWh}$ điện than thải khoảng $0{,}8\\text{ kg}\\,\\text{CO}_2$).',
        hint: 'Tính $W = \\mathscr{P}\\cdot t$ ra kWh rồi nhân hệ số $0{,}8\\text{ kg/kWh}$.',
        rubricChecklist: [
          'Tính sản lượng điện sạch $W = 3 \\cdot 5 \\cdot 30 = 450\\text{ kWh}$.',
          'Tính lượng $\\text{CO}_2$ cắt giảm $m = 450 \\cdot 0{,}8 = 360\\text{ kg}\\,\\text{CO}_2$.'
        ],
        sampleAnswer: 'Sản lượng điện Mặt Trời mái nhà tạo ra trong 30 ngày là $W = 3 \\times 5 \\times 30 = 450\\text{ kWh}$. Lượng khí $\\text{CO}_2$ giảm phát thải tương ứng là $m_{\\text{CO}_2} = 450 \\times 0{,}8 = 360\\text{ kg}$ mỗi tháng.'
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
