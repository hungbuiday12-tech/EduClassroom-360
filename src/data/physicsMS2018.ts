import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const SRC_2018_6 = 'GDPT 2018 · KHTN 6 (Phần Vật lí)';
const SRC_2018_7 = 'GDPT 2018 · KHTN 7 (Phần Vật lí)';
const SRC_2018_8 = 'GDPT 2018 · KHTN 8 (Phần Vật lí)';

export const PHYSICS_MS_2018_LESSONS: PhysicsLesson[] = [
  // ==========================================================================
  // LỚP 6 — GDPT 2018 (KHTN 6 · 6 BÀI TOÀN CHƯƠNG)
  // ==========================================================================
  {
    id: 'phys-6-b1',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Các phép đo cơ bản',
    sourceTag: SRC_2018_6,
    lessonNumber: 1,
    title: 'Bài 1: Đo chiều dài & Đo thể tích chất lỏng – vật rắn',
    subtitle: 'Cách xác định Giới hạn đo (GHĐ), Độ chia nhỏ nhất (ĐCNN) và mẹo đo đúng không sai số',
    description:
      'Làm quen hai phép đo đầu tiên trong khoa học: đo chiều dài bằng thước (m, cm, mm) và đo thể tích bằng bình chia độ – bình tràn (lít, ml, cm³).',
    theorySections: [
      {
        heading: '1. Giới hạn đo (GHĐ) & Độ chia nhỏ nhất (ĐCNN)',
        content:
          '• **Giới hạn đo (GHĐ)** là số lớn nhất ghi trên dụng cụ đo.\n• **Độ chia nhỏ nhất (ĐCNN)** là khoảng cách giữa hai vạch chia liên tiếp trên dụng cụ.\n• **5 bước đo chuẩn**: (1) Ước lượng vật $\\to$ (2) Chọn thước có GHĐ lớn hơn vật một chút $\\to$ (3) Đặt thước dọc vật, vạch $0$ ngang đầu vật $\\to$ (4) Đặt mắt **nhìn vuông góc** với vạch chia $\\to$ (5) Đọc kết quả theo ĐCNN.'
      },
      {
        heading: '2. Đo thể tích chất lỏng & vật rắn không thấm nước',
        content:
          '• Khi đọc bình chia độ đựng nước, đặt mắt ngang tầm **đáy mặt khum lõm** của mực nước.\n• Với hòn đá không bỏ vừa bình chia độ, thả hòn đá chìm vào **bình tràn** đã đổ đầy nước tới miệng vòi: thể tích nước tràn ra chính bằng thể tích hòn đá ($V = V_2 - V_1$).'
      }
    ],
    keyFormulas: [
      '1\\text{ m} = 100\\text{ cm} = 1000\\text{ mm}',
      '1\\text{ lít} = 1\\text{ dm}^3 = 1000\\text{ ml} = 1000\\text{ cm}^3',
      'V_{\\text{vật rắn}} = V_2 - V_1'
    ],
    ...SIM_PRESETS.measurement_tools,
    practiceExercises: [
      {
        source: SRC_2018_6,
        question: 'Để đo chiều dài chiếc bàn học dài khoảng $1{,}2\\text{ m}$, em nên chọn thước nào hợp lí nhất?',
        options: [
          'A. Thước kẻ $20\\text{ cm}$, ĐCNN $1\\text{ mm}$',
          'B. Thước dây/thước cuộn GHĐ $2\\text{ m}$, ĐCNN $1\\text{ mm}$',
          'C. Thước dây GHĐ $100\\text{ m}$, ĐCNN $1\\text{ dm}$',
          'D. Compa học sinh'
        ],
        correctIndex: 1,
        explanation: 'Thước GHĐ $2\\text{ m}$ đo vừa gọn một lần bàn $1{,}2\\text{ m}$ và ĐCNN $1\\text{ mm}$ cho độ chính xác cao.'
      },
      {
        source: SRC_2018_6,
        question: 'Bình chia độ đang chứa $50\\text{ ml}$ nước. Thả chìm hoàn toàn một viên bi sắt vào bình thì mực nước dâng lên vạch $68\\text{ ml}$. Thể tích viên bi là:',
        options: ['A. $18\\text{ cm}^3$', 'B. $50\\text{ cm}^3$', 'C. $68\\text{ cm}^3$', 'D. $118\\text{ cm}^3$'],
        correctIndex: 0,
        explanation: '$V_{\\text{bi}} = V_2 - V_1 = 68 - 50 = 18\\text{ ml} = 18\\text{ cm}^3$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_6,
        question: 'Trên một bình chia độ có vạch lớn nhất là $250\\text{ ml}$. Khoảng giữa vạch $50\\text{ ml}$ và $100\\text{ ml}$ chia làm $10$ khoảng nhỏ bằng nhau. Tìm GHĐ và ĐCNN của bình.',
        hints: ['ĐCNN $= (100 - 50) : 10$.'],
        solutionSteps: [
          'GHĐ là giá trị lớn nhất ghi trên bình: $250\\text{ ml}$.',
          'ĐCNN $= \\frac{100 - 50}{10} = 5\\text{ ml}$.'
        ],
        finalAnswer: 'GHĐ $= 250\\text{ ml}$; ĐCNN $= 5\\text{ ml}$.'
      }
    ]
  },
  {
    id: 'phys-6-b2',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Các phép đo cơ bản',
    sourceTag: SRC_2018_6,
    lessonNumber: 2,
    title: 'Bài 2: Đo khối lượng, Đo thời gian & Đo nhiệt độ',
    subtitle: 'Phân biệt khối lượng vs trọng lượng, bấm giờ đồng hồ và cách dùng nhiệt kế an toàn',
    description:
      'Làm chủ 3 phép đo còn lại: cân khối lượng (kg, g), đo thời gian bằng đồng hồ bấm giây và đo nhiệt độ bằng nhiệt kế thủy ngân/rượu/hồng ngoại.',
    theorySections: [
      {
        heading: '1. Đo khối lượng & Đo thời gian',
        content:
          '• **Khối lượng** chỉ lượng chất chứa trong vật (đơn vị chuẩn **kilôgam — kg**). Trước khi cân, phải chỉnh kim cân về đúng vạch số $0$.\n• **Thời gian** đo bằng **giây (s)**. Để đo thời gian chạy $100\\text{ m}$, ta dùng **đồng hồ bấm giây**, nhấn *Reset* về $0$ trước khi xuất phát.'
      },
      {
        heading: '2. Đo nhiệt độ & Các thang nhiệt độ',
        content:
          '• Nhiệt độ cho biết mức độ **nóng hay lạnh** của vật (Việt Nam dùng độ **Celsius — $^\\circ\\text{C}$**).\n• Nước đá đang tan ở $0^\\circ\\text{C}$; nước sôi ở $100^\\circ\\text{C}$.\n• **Lưu ý nhiệt kế y tế** ($35^\\circ\\text{C} \\to 42^\\circ\\text{C}$): có chỗ thắt giữ mực thủy ngân, nên trước khi đo phải **vẩy nhẹ** cho cột thủy ngân tụt xuống dưới $35^\\circ\\text{C}$.'
      }
    ],
    keyFormulas: [
      '1\\text{ tấn} = 10\\text{ tạ} = 1000\\text{ kg}; \\quad 1\\text{ kg} = 1000\\text{ g}',
      '1\\text{ giờ} = 60\\text{ phút} = 3600\\text{ giây}',
      't(^\\circ\\text{F}) = 1{,}8\\,t(^\\circ\\text{C}) + 32; \\quad T(\\text{K}) = t(^\\circ\\text{C}) + 273'
    ],
    ...SIM_PRESETS.measurement_tools,
    practiceExercises: [
      {
        source: SRC_2018_6,
        question: 'Tại sao KHÔNG dùng nhiệt kế y tế để đo nhiệt độ của nước đang sôi?',
        options: [
          'A. Vì nhiệt kế y tế đo rất chậm',
          'B. Vì GHĐ của nhiệt kế y tế chỉ đến $42^\\circ\\text{C}$, nhúng vào nước sôi $100^\\circ\\text{C}$ sẽ làm vỡ ống thủy tinh',
          'C. Vì nước làm trôi vạch chia',
          'D. Vì nhiệt kế y tế chỉ đo được vật rắn'
        ],
        correctIndex: 1,
        explanation: 'Thủy ngân dãn nở vượt quá $42^\\circ\\text{C}$ sẽ làm vỡ ống thủy tinh gây nguy hiểm.'
      },
      {
        source: SRC_2018_6,
        question: 'Trên vỏ hộp bánh có ghi "Khối lượng tịnh: 450 g". Đổi sang kilôgam là:',
        options: ['A. $4{,}5\\text{ kg}$', 'B. $0{,}45\\text{ kg}$', 'C. $0{,}045\\text{ kg}$', 'D. $45\\text{ kg}$'],
        correctIndex: 1,
        explanation: '$450\\text{ g} = 450 : 1000 = 0{,}45\\text{ kg}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_6,
        question: 'Thân nhiệt bình thường của người là $37^\\circ\\text{C}$. Đổi nhiệt độ này sang độ Fahrenheit ($^\\circ\\text{F}$) và độ Kelvin ($\\text{K}$).',
        hints: ['Áp dụng $t(^\\circ\\text{F}) = 1{,}8\\,t(^\\circ\\text{C}) + 32$ và $T(\\text{K}) = t(^\\circ\\text{C}) + 273$.'],
        solutionSteps: [
          'Theo thang Fahrenheit: $t(^\\circ\\text{F}) = 1{,}8 \\cdot 37 + 32 = 98{,}6^\\circ\\text{F}$.',
          'Theo thang Kelvin: $T = 37 + 273 = 310\\text{ K}$.'
        ],
        finalAnswer: '$98{,}6^\\circ\\text{F}$ và $310\\text{ K}$.'
      }
    ]
  },
  {
    id: 'phys-6-b3',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Lực & Chuyển động',
    sourceTag: SRC_2018_6,
    lessonNumber: 3,
    title: 'Bài 3: Lực là gì? Biểu diễn lực & Biến dạng của lò xo',
    subtitle: 'Tác dụng đẩy – kéo của lực, vẽ mũi tên biểu diễn lực và quy luật dãn lò xo theo lực kế',
    description:
      'Hiểu thật rõ lực có thể làm vật đổi tốc độ, đổi hướng hoặc bị biến dạng; học cách dùng lực kế lò xo đo độ lớn lực theo đơn vị Newton (N).',
    theorySections: [
      {
        heading: '1. Lực & Cách biểu diễn lực bằng mũi tên',
        content:
          '• Mọi tác dụng **đẩy, kéo, nâng, nén** của vật này lên vật khác gọi là **Lực** (đơn vị Newton, kí hiệu **N**).\n• Một lực được mô tả bằng 3 yếu tố: **Điểm đặt**, **Phương – Chiều** (hướng mũi tên) và **Độ lớn** (chiều dài mũi tên theo tỉ xích).'
      },
      {
        heading: '2. Biến dạng đàn hồi của lò xo & Lực kế',
        content:
          '• Khi kéo hoặc nén lò xo nhẹ vừa phải, lò xo dãn ra; bỏ tay ra lò xo trở lại dài như cũ — đó là **biến dạng đàn hồi**.\n• **Quy luật vàng**: Trong giới hạn đàn hồi, **độ dãn $\\Delta l$ tỉ lệ thuận với lực kéo** (treo $2$ quả nặng thì lò xo dãn gấp $2$ lần treo $1$ quả). Dựa vào đó người ta chế tạo **Lực kế**.'
      }
    ],
    keyFormulas: [
      '\\Delta l = l - l_0 \\quad (\\text{Độ dãn lò xo})',
      '\\frac{F_1}{F_2} = \\frac{\\Delta l_1}{\\Delta l_2}'
    ],
    ...SIM_PRESETS.hooke_forces,
    practiceExercises: [
      {
        source: SRC_2018_6,
        question: 'Khi cầu thủ sút quả bóng đang nằm yên làm quả bóng bay vút lên, lực của chân cầu thủ đã gây ra kết quả nào?',
        options: [
          'A. Chỉ làm quả bóng biến dạng',
          'B. Làm quả bóng vừa biến dạng vừa biến đổi chuyển động',
          'C. Không có tác dụng gì',
          'D. Chỉ làm quả bóng nặng thêm'
        ],
        correctIndex: 1,
        explanation: 'Lúc chân chạm bóng, bóng bị móp nhẹ (biến dạng) và bắt đầu bay đi nhanh (biến đổi chuyển động).'
      },
      {
        source: SRC_2018_6,
        question: 'Treo vật nặng $2\\text{ N}$ làm lò xo dài từ $15\\text{ cm}$ thành $17\\text{ cm}$. Nếu treo vật $6\\text{ N}$ thì lò xo dài bao nhiêu?',
        options: ['A. $19\\text{ cm}$', 'B. $21\\text{ cm}$', 'C. $23\\text{ cm}$', 'D. $27\\text{ cm}$'],
        correctIndex: 1,
        explanation: '$2\\text{ N}$ dãn $2\\text{ cm}$ $\\implies 6\\text{ N}$ dãn $6\\text{ cm} \\implies l = 15 + 6 = 21\\text{ cm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_6,
        question: 'Một lò xo dài tự nhiên $l_0 = 20\\text{ cm}$. Khi treo quả cân $100\\text{ g}$ ($1\\text{ N}$), lò xo dài $22{,}5\\text{ cm}$. Hỏi muốn lò xo dài $30\\text{ cm}$ thì phải treo quả cân nặng bao nhiêu gam?',
        hints: ['Tính độ dãn ứng với $1\\text{ N}$, sau đó tìm độ dãn cần có $30 - 20 = 10\\text{ cm}$.'],
        solutionSteps: [
          'Treo $1\\text{ N}$ ($100\\text{ g}$), lò xo dãn $\\Delta l_1 = 22{,}5 - 20 = 2{,}5\\text{ cm}$.',
          'Để lò xo dài $30\\text{ cm}$, độ dãn cần là $\\Delta l_2 = 30 - 20 = 10\\text{ cm}$.',
          'Tỉ lệ thuận: $m_2 = 100 \\cdot \\frac{10}{2{,}5} = 400\\text{ g}$ ($0{,}4\\text{ kg}$).'
        ],
        finalAnswer: '$400\\text{ g}$ (trọng lượng $4\\text{ N}$).'
      }
    ]
  },
  {
    id: 'phys-6-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Lực & Chuyển động',
    sourceTag: SRC_2018_6,
    lessonNumber: 4,
    title: 'Bài 4: Trọng lực – Trọng lượng, Lực tiếp xúc & Lực ma sát',
    subtitle: 'Vì sao mọi vật rơi xuống đất (P = 10·m) và phân biệt ma sát trượt – ma sát lăn – ma sát nghỉ',
    description:
      'Giải thích sự khác nhau giữa Khối lượng (kg) và Trọng lượng (N), lực tiếp xúc vs lực không tiếp xúc và cách tận dụng ma sát có lợi – giảm ma sát có hại.',
    theorySections: [
      {
        heading: '1. Trọng lực & Lực không tiếp xúc',
        content:
          '• **Trọng lực** là lực hút của Trái Đất tác dụng lên vật, phương **thẳng đứng**, chiều **từ trên xuống dưới**.\n• Độ lớn của trọng lực gọi là **Trọng lượng ($P$)**: $P = 10 \\cdot m$ ($m$ tính bằng kg). Dù lên Mặt Trăng khối lượng $m$ không đổi, nhưng trọng lượng nhỏ đi $6$ lần!\n• Trọng lực và lực hút nam châm là **lực không tiếp xúc**.'
      },
      {
        heading: '2. Ba loại Lực ma sát quanh ta',
        content:
          '• **Ma sát nghỉ**: giữ cho vật không bị trượt (giúp chân bám đường bước đi, đinh bám trong tường).\n• **Ma sát trượt**: sinh ra khi vật trượt trên bề mặt (phanh xe, trượt máng).\n• **Ma sát lăn**: sinh ra khi vật lăn — **nhỏ hơn rất nhiều** so với ma sát trượt! Vì vậy người ta lắp **ổ bi** và bánh xe để đẩy tủ nặng thật nhẹ nhàng.'
      }
    ],
    keyFormulas: [
      'P = 10 \\cdot m \\quad (P\\text{ tính bằng N},\\ m\\text{ tính bằng kg})',
      'F_{\\text{ma sát lăn}} \\ll F_{\\text{ma sát trượt}}'
    ],
    ...SIM_PRESETS.inclined,
    practiceExercises: [
      {
        source: SRC_2018_6,
        question: 'Một thùng hàng có khối lượng $35\\text{ kg}$. Trọng lượng của thùng hàng trên Trái Đất là:',
        options: ['A. $3{,}5\\text{ N}$', 'B. $35\\text{ N}$', 'C. $350\\text{ N}$', 'D. $3500\\text{ N}$'],
        correctIndex: 2,
        explanation: '$P = 10 \\cdot m = 10 \\cdot 35 = 350\\text{ N}$.'
      },
      {
        source: SRC_2018_6,
        question: 'Vì sao đế giày thể thao và lốp xe ô tô luôn xẻ nhiều rãnh sâu?',
        options: [
          'A. Để tăng ma sát nghỉ giúp bám đường, chống trơn trượt',
          'B. Để giảm ma sát giúp xe bay lên',
          'C. Chỉ để làm đẹp',
          'D. Để giảm trọng lượng của giày và lốp'
        ],
        correctIndex: 0,
        explanation: 'Rãnh sâu tạo độ nhám tăng ma sát bám mặt đường nhất là khi trời mưa trơn.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_6,
        question: 'Nêu một tình huống lực ma sát CÓ LỢI và một tình huống lực ma sát CÓ HẠI, cùng cách khắc phục phần có hại đó.',
        hints: ['Có lợi: phanh xe đạp / viết phấn lên bảng; Có hại: xích xe đạp mòn rít.'],
        solutionSteps: [
          'Ma sát có lợi: Bóp phanh xe đạp tạo ma sát trượt giữa má phanh và vành bánh giúp xe dừng lại an toàn.',
          'Ma sát có hại: Trục và xích xe đạp bị khô dầu gây ma sát lớn làm đạp nặng và nhanh mòn.',
          'Cách giảm: Thường xuyên tra dầu mỡ bôi trơn và dùng ổ bi.'
        ],
        finalAnswer: 'Tăng ma sát khi phanh/bám đường; giảm ma sát ở trục quay bằng dầu mỡ và ổ bi.'
      }
    ]
  },
  {
    id: 'phys-6-b5',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Nhiệt & Trạng thái vật chất',
    sourceTag: SRC_2018_6,
    lessonNumber: 5,
    title: 'Bài 5: Sự nở vì nhiệt cơ bản & Vai trò nhiệt độ trong đời sống',
    subtitle: 'Vì sao dây điện mùa hè võng xuống, cầu sắt có khe hở và băng kép tự ngắt điện',
    description:
      'Khám phá hiện tượng vật chất nở ra khi nóng lên, co lại khi lạnh đi ở chất rắn – lỏng – khí, và ứng dụng băng kép tự ngắt điện trong bàn là.',
    theorySections: [
      {
        heading: '1. Thứ tự nở vì nhiệt: Rắn < Lỏng < Khí',
        content:
          '• Khi được đun nóng, các hạt phân tử dao động mạnh và tách xa nhau hơn nên hầu hết chất rắn, lỏng, khí **nở ra khi nóng lên, co lại khi lạnh đi**.\n• Cùng một mức tăng nhiệt độ: **Chất khí nở nhiều nhất > Chất lỏng > Chất rắn**.'
      },
      {
        heading: '2. Ứng dụng thực tế cực hay',
        content:
          '• Đường ray tàu hỏa và hai đầu cầu thép đều chừa **khe co dãn** để trời nắng to thanh sắt dài ra không bị đẩy cong gãy.\n• **Băng kép** (hai thanh kim loại đồng – thép tán chặt vào nhau): khi nóng lên cong về phía thanh nở ít (thép), dùng làm rơ-le tự ngắt điện ở bàn là, nồi cơm điện.'
      }
    ],
    keyFormulas: [
      '\\Delta V_{\\text{khí}} > \\Delta V_{\\text{lỏng}} > \\Delta V_{\\text{rắn}} \\quad (\\text{cùng } \\Delta t)',
      'T_{\\text{nóng}} \\uparrow \\implies \\text{Thể tích } V \\uparrow,\\ \\text{Khối lượng riêng } D \\downarrow'
    ],
    ...SIM_PRESETS.thermal_expansion,
    practiceExercises: [
      {
        source: SRC_2018_6,
        question: 'Khi đun nước đầy ấm trên bếp, nước chưa sôi đã tràn ra ngoài vì sao?',
        options: [
          'A. Do nước nở vì nhiệt nhiều hơn ấm kim loại',
          'B. Do ấm co lại',
          'C. Do nước nặng hơn khi nóng',
          'D. Do không khí đẩy nước lên'
        ],
        correctIndex: 0,
        explanation: 'Chất lỏng (nước) nở vì nhiệt nhiều hơn chất rắn (vỏ ấm) nên mức nước dâng tràn ra.'
      },
      {
        source: SRC_2018_6,
        question: 'Quả bóng bàn bị móp (không thủng) thả vào bát nước nóng thì phồng tròn trở lại nhờ:',
        options: [
          'A. Vỏ nhựa tan chảy',
          'B. Không khí bên trong quả bóng nóng lên nở ra đẩy phồng vỏ bóng',
          'C. Nước thấm qua vỏ nhựa vào trong',
          'D. Trọng lực đẩy bóng lên'
        ],
        correctIndex: 1,
        explanation: 'Chất khí bên trong quả bóng nở mạnh khi gặp nóng tạo áp suất đẩy vết móp phồng lại.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_6,
        question: 'Vì sao không nên đóng nước ngọt có ga quá đầy tới sát miệng chai thủy tinh, và tại sao lốp xe bơm quá căng dễ bị nổ khi đi ngoài trời nắng gắt?',
        hints: ['Chất lỏng và chất khí nở ra khi nhiệt độ tăng; nếu bị ngăn cản sẽ gây ra lực rất lớn.'],
        solutionSteps: [
          'Chai nước ngọt để chừa khoảng trống để khi trời nóng, nước và khí ga nở ra không làm bật nắp hay vỡ chai.',
          'Lốp xe phơi nắng nóng làm không khí bên trong nở mạnh, bị vỏ lốp cản lại nên tăng áp suất gây nổ lốp.'
        ],
        finalAnswer: 'Sự nở vì nhiệt khi bị ngăn cản sẽ sinh ra lực rất lớn.'
      }
    ]
  },
  {
    id: 'phys-6-b6',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Năng lượng & Bảo toàn',
    sourceTag: SRC_2018_6,
    lessonNumber: 6,
    title: 'Bài 6: Các dạng Năng lượng, Năng lượng tái tạo & Định luật Bảo toàn Năng lượng',
    subtitle: 'Nhận biết các dạng năng lượng quanh ta, năng lượng có ích vs hao phí và cách tiết kiệm điện',
    description:
      'Hiểu bản chất năng lượng không tự sinh ra hay mất đi, mà chuyển hóa từ dạng này sang dạng khác (cơ năng, điện năng, hóa năng, quang năng, nhiệt năng).',
    theorySections: [
      {
        heading: '1. Các dạng năng lượng & Năng lượng tái tạo',
        content:
          '• **Động năng** (vật đang chuyển động), **Thế năng** (vật ở trên cao hoặc lò xo nén), **Hóa năng** (xăng, pin, thức ăn), **Điện năng**, **Nhiệt năng**, **Quang năng**, **Năng lượng âm**.\n• **Năng lượng tái tạo** sạch vô tận: Mặt Trời, Gió, Thủy triều, Nước chảy, Sinh khối.'
      },
      {
        heading: '2. Bảo toàn & Tiết kiệm năng lượng',
        content:
          '• **Định luật Bảo toàn năng lượng**: Năng lượng không tự nhiên sinh ra cũng không tự nhiên mất đi, nó chỉ chuyển từ dạng này sang dạng khác hoặc truyền từ vật này sang vật khác.\n• Bóng đèn sợi đốt nóng bỏng tay là phần **nhiệt năng hao phí** lớn; thay bằng **đèn LED** giúp chuyển gần hết điện năng thành ánh sáng có ích.'
      }
    ],
    keyFormulas: [
      'E_{\\text{toàn phần}} = E_{\\text{có ích}} + E_{\\text{hao phí}}',
      'H = \\frac{E_{\\text{có ích}}}{E_{\\text{toàn phần}}} \\cdot 100\\%'
    ],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_2018_6,
        question: 'Quả bóng rơi từ tầng 3 xuống đất có sự chuyển hóa năng lượng chính nào trong lúc đang rơi?',
        options: [
          'A. Thế năng hấp dẫn chuyển hóa dần thành Động năng',
          'B. Hóa năng thành Quang năng',
          'C. Điện năng thành Nhiệt năng',
          'D. Động năng thành Hóa năng'
        ],
        correctIndex: 0,
        explanation: 'Khi rơi, độ cao giảm (thế năng giảm) và tốc độ tăng nhanh (động năng tăng).'
      },
      {
        source: SRC_2018_6,
        question: 'Nguồn năng lượng nào sau đây KHÔNG phải năng lượng tái tạo?',
        options: ['A. Năng lượng gió', 'B. Năng lượng Mặt Trời', 'C. Than đá và dầu mỏ', 'D. Thủy điện'],
        correctIndex: 2,
        explanation: 'Than đá, dầu mỏ, khí đốt là nhiên liệu hóa thạch mất hàng triệu năm hình thành nên sẽ cạn kiệt.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_6,
        question: 'Khi đun nước bằng ấm siêu tốc, hãy chỉ ra dạng năng lượng đầu vào, năng lượng có ích và năng lượng hao phí.',
        hints: ['Đầu vào là điện năng; có ích là làm nóng nước.'],
        solutionSteps: [
          'Năng lượng đầu vào: Điện năng.',
          'Năng lượng có ích: Nhiệt năng làm nước nóng lên và sôi.',
          'Năng lượng hao phí: Nhiệt năng tỏa ra vỏ ấm, không khí xung quanh và năng lượng âm thanh tiếng nước reo.'
        ],
        finalAnswer: 'Điện năng $\\to$ Nhiệt năng làm sôi nước (có ích) + Nhiệt tỏa môi trường & Âm thanh (hao phí).'
      }
    ]
  },

  // ==========================================================================
  // LỚP 7 — GDPT 2018 (KHTN 7 · 6 BÀI TOÀN CHƯƠNG)
  // ==========================================================================
  {
    id: 'phys-7-b1',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Tốc độ chuyển động',
    sourceTag: SRC_2018_7,
    lessonNumber: 1,
    title: 'Bài 1: Tốc độ chuyển động & Đồ thị quãng đường – thời gian ($s - t$)',
    subtitle: 'Công thức v = s/t, mẹo nhân chia 3,6 đổi km/h ↔ m/s và đọc độ dốc đồ thị s–t',
    description:
      'Tính tốc độ chạy bộ, đạp xe, đo tốc độ bằng cổng quang điện và biết cách nhìn đồ thị $s-t$ để đọc ngay đoạn nào xe chạy nhanh, đoạn nào xe dừng nghỉ.',
    theorySections: [
      {
        heading: '1. Công thức Tốc độ & Đổi đơn vị nhanh',
        content:
          '• **Tốc độ ($v$)** cho biết vật đi nhanh hay chậm, đo bằng quãng đường đi được trong 1 đơn vị thời gian: $v = \\frac{s}{t}$.\n• **Mẹo 3,6**: $\\text{km/h} \\xrightarrow{: 3{,}6} \\text{m/s}$; ngược lại $\\text{m/s} \\xrightarrow{\\times 3{,}6} \\text{km/h}$ (nhớ mốc chuẩn: $10\\text{ m/s} = 36\\text{ km/h}$, $20\\text{ m/s} = 72\\text{ km/h}$).'
      },
      {
        heading: '2. Đọc đồ thị Quãng đường – Thời gian ($s - t$)',
        content:
          '• Trục đứng ghi Quãng đường ($s$), trục ngang ghi Thời gian ($t$).\n• Đường biểu diễn **dốc lên càng đứng** $\\to$ tốc độ càng lớn.\n• Đường biểu diễn **nằm ngang song song trục $t$** $\\to$ quãng đường không tăng thêm, nghĩa là **vật đang đứng yên**.'
      }
    ],
    keyFormulas: [
      'v = \\frac{s}{t}, \\quad s = v \\cdot t, \\quad t = \\frac{s}{v}',
      '1\\text{ m/s} = 3{,}6\\text{ km/h}'
    ],
    ...SIM_PRESETS.kinematics,
    practiceExercises: [
      {
        source: SRC_2018_7,
        question: 'Vận động viên chạy $100\\text{ m}$ hết $10\\text{ giây}$. Tốc độ của vận động viên tính theo $\\text{km/h}$ là:',
        options: ['A. $10\\text{ km/h}$', 'B. $36\\text{ km/h}$', 'C. $20\\text{ km/h}$', 'D. $18\\text{ km/h}$'],
        correctIndex: 1,
        explanation: '$v = 100/10 = 10\\text{ m/s} = 10 \\cdot 3{,}6 = 36\\text{ km/h}$.'
      },
      {
        source: SRC_2018_7,
        question: 'Trên đồ thị $s - t$, đoạn đường nằm ngang song song với trục thời gian $t$ biểu thị điều gì?',
        options: [
          'A. Xe đang chạy rất nhanh',
          'B. Xe đang chạy lùi lại',
          'C. Xe đang đứng yên (dừng nghỉ)',
          'D. Xe đang lên dốc'
        ],
        correctIndex: 2,
        explanation: 'Thời gian trôi qua mà quãng đường $s$ không đổi nghĩa là xe đứng yên.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_7,
        question: 'Một đoàn tàu đi đoạn đầu dài $60\\text{ km}$ hết $1\\text{ giờ}$, sau đó dừng ở ga $15\\text{ phút}$, rồi chạy tiếp $45\\text{ km}$ nữa trong $45\\text{ phút}$. Tính tốc độ trung bình trên cả hành trình.',
        hints: ['Tổng thời gian phải cộng cả $15\\text{ phút}$ dừng nghỉ ở ga!'],
        solutionSteps: [
          'Tổng quãng đường: $s = 60 + 45 = 105\\text{ km}$.',
          'Tổng thời gian: $t = 1\\text{ h} + 0{,}25\\text{ h} + 0{,}75\\text{ h} = 2\\text{ giờ}$.',
          'Tốc độ trung bình: $v_{\\text{tb}} = \\frac{105}{2} = 52{,}5\\text{ km/h}$.'
        ],
        finalAnswer: '$52{,}5\\text{ km/h}$.'
      }
    ]
  },
  {
    id: 'phys-7-b2',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Sóng âm',
    sourceTag: SRC_2018_7,
    lessonNumber: 2,
    title: 'Bài 2: Sóng âm, Độ cao (Tần số) – Độ to (Biên độ) & Phản xạ âm',
    subtitle: 'Dao động tạo ra âm thanh, phân biệt bổng–trầm qua tần số Hz và ứng dụng tiếng vang đo độ sâu biển',
    description:
      'Hiểu âm thanh là sự lan truyền dao động qua môi trường rắn–lỏng–khí, mối liên hệ giữa tần số – độ cao và biên độ – độ to của âm.',
    theorySections: [
      {
        heading: '1. Độ cao (Tần số Hz) & Độ to (Biên độ)',
        content:
          '• Vật phát ra âm thanh luôn **dao động** (rung qua lại quanh vị trí cân bằng).\n• **Tần số ($f$, đơn vị Hz)** = Số dao động trong $1$ giây: tần số càng lớn (rung nhanh) $\\to$ âm càng **CAO (bổng)**.\n• **Biên độ dao động** càng lớn (kéo dây đàn lệch mạnh) $\\to$ âm càng **TO** (độ ồn đo bằng đê-xi-ben, $\\text{dB}$).'
      },
      {
        heading: '2. Tốc độ truyền âm & Phản xạ âm (Tiếng vang)',
        content:
          '• Âm truyền nhanh nhất trong **Rắn ($\\approx 5000\\text{ m/s}$ thép) > Lỏng ($1500\\text{ m/s}$ nước) > Khí ($340\\text{ m/s}$ không khí)**, và **không truyền qua chân không**.\n• Vật cứng nhẵn phản xạ âm tốt; vật mềm xốp hấp thụ âm tốt. Tiếng vang nghe rõ khi âm dội lại trễ hơn âm trực tiếp ít nhất $1/15\\text{ s}$.'
      }
    ],
    keyFormulas: [
      'f = \\frac{N}{t} \\quad (\\text{Hz})',
      's = \\frac{v \\cdot t_{\\text{phản xạ}}}{2}'
    ],
    ...SIM_PRESETS.sound_intensity,
    practiceExercises: [
      {
        source: SRC_2018_7,
        question: 'Con muỗi vỗ cánh 600 lần mỗi giây ($600\\text{ Hz}$), con ong vỗ cánh 300 lần mỗi giây ($300\\text{ Hz}$). Âm phát ra từ con nào CAO (bổng) hơn?',
        options: ['A. Con ong cao hơn', 'B. Con muỗi phát âm cao (bổng) hơn', 'C. Cao bằng nhau', 'D. Cả hai không phát ra âm'],
        correctIndex: 1,
        explanation: 'Tần số càng lớn thì âm phát ra càng cao (bổng) nên tiếng vo ve của muỗi cao hơn ong.'
      },
      {
        source: SRC_2018_7,
        question: 'Các nhà du hành vũ trụ ngoài khoảng không chân không muốn nói chuyện với nhau phải dùng bộ đàm sóng vô tuyến vì:',
        options: [
          'A. Sóng âm không truyền được trong chân không',
          'B. Ngoài vũ trụ quá lạnh',
          'C. Mũ bảo hộ làm âm bị cao quá',
          'D. Không có ánh sáng'
        ],
        correctIndex: 0,
        explanation: 'Chân không không có hạt vật chất để truyền dao động âm thanh.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_7,
        question: 'Một bạn đứng trước vách núi đá hét lớn và nghe tiếng vang dội lại sau $1{,}4\\text{ s}$. Tính khoảng cách từ bạn đó tới vách núi (biết tốc độ âm trong không khí là $340\\text{ m/s}$).',
        hints: ['Âm đi tới vách núi rồi quay lại tai bạn hết $1{,}4\\text{ s}$ nên chia 2.'],
        solutionSteps: [
          'Quãng đường âm đi cả đi và về: $2d = 340 \\cdot 1{,}4 = 476\\text{ m}$.',
          'Khoảng cách tới vách núi: $d = \\frac{476}{2} = 238\\text{ m}$.'
        ],
        finalAnswer: '$238\\text{ m}$.'
      }
    ]
  },
  {
    id: 'phys-7-b3',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Ánh sáng',
    sourceTag: SRC_2018_7,
    lessonNumber: 3,
    title: 'Bài 3: Ánh sáng, Bóng tối & Định luật Phản xạ Ánh sáng – Gương phẳng',
    subtitle: 'Tia sáng truyền thẳng tạo vùng tối, quy tắc phản xạ i\' = i và đặc điểm ảnh ảo qua gương phẳng',
    description:
      'Thực hành chiếu chùm tia sáng tới gương phẳng trên bàn mô phỏng 2D và trong phòng 3D để đo góc tới, góc phản xạ và xác định vị trí ảnh đối xứng qua gương.',
    theorySections: [
      {
        heading: '1. Truyền thẳng ánh sáng, Vùng tối & Vùng nửa tối',
        content:
          '• Trong môi trường trong suốt và đồng tính, ánh sáng truyền đi theo **đường thẳng**.\n• Đặt vật cản sáng trước nguồn sáng nhỏ tạo thành **vùng tối** phía sau; nếu nguồn sáng lớn (như bóng đèn tuýp) thì xung quanh vùng tối hoàn toàn còn có **vùng nửa tối**.'
      },
      {
        heading: '2. Định luật Phản xạ & Ảnh của vật qua Gương phẳng',
        content:
          '• **Định luật phản xạ**: Tia phản xạ nằm trong mặt phẳng chứa tia tới và pháp tuyến $IN$, đồng thời **góc phản xạ bằng góc tới ($i\' = i$)**.\n• **3 tính chất ảnh qua gương phẳng**: (1) Là **ảnh ảo** (không hứng được trên màn), (2) **Lớn bằng vật**, (3) **Khoảng cách từ ảnh tới gương bằng khoảng cách từ vật tới gương** (đối xứng qua mặt gương).'
      }
    ],
    keyFormulas: [
      '\\text{Góc phản xạ } i\' = \\text{Góc tới } i',
      'd_{\\text{ảnh}} = d_{\\text{vật}}, \\quad A\'B\' = AB'
    ],
    ...SIM_PRESETS.plane_mirror,
    practiceExercises: [
      {
        source: SRC_2018_7,
        question: 'Chiếu một tia sáng hợp với mặt gương phẳng một góc $35^\\circ$. Góc phản xạ $i\'$ có giá trị bằng bao nhiêu?',
        options: ['A. $35^\\circ$', 'B. $55^\\circ$', 'C. $70^\\circ$', 'D. $145^\\circ$'],
        correctIndex: 1,
        explanation: 'Góc tới tính với pháp tuyến (vuông góc mặt gương): $i = 90^\\circ - 35^\\circ = 55^\\circ \\implies i\' = 55^\\circ$.'
      },
      {
        source: SRC_2018_7,
        question: 'Khi bạn bước lùi ra xa gương phẳng thêm $0{,}5\\text{ m}$, ảnh của bạn trong gương thay đổi thế nào?',
        options: [
          'A. Nhỏ đi và xa gương thêm $0{,}5\\text{ m}$',
          'B. Kích thước vẫn bằng bạn và xa gương thêm $0{,}5\\text{ m}$',
          'C. To hơn và lại gần gương',
          'D. Biến thành ảnh thật'
        ],
        correctIndex: 1,
        explanation: 'Ảnh qua gương phẳng luôn lớn bằng vật và đối xứng qua mặt gương.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_7,
        question: 'Chiếu một tia sáng nằm ngang từ trái sang phải tới một gương phẳng. Muốn tia phản xạ hướng thẳng đứng từ dưới lên trên thì phải đặt mặt phản xạ của gương nghiêng một góc bao nhiêu độ so với phương ngang?',
        hints: ['Góc giữa tia tới (ngang) và tia phản xạ (thẳng đứng lên) là $90^\\circ$, suy ra $i + i\' = 90^\\circ$.'],
        solutionSteps: [
          'Góc giữa tia tới nằm ngang và tia phản xạ thẳng đứng bằng $i + i\' = 90^\\circ$.',
          'Vì $i\' = i$ nên $i = i\' = 45^\\circ$ (pháp tuyến nghiêng $45^\\circ$).',
          'Gương vuông góc với pháp tuyến nên mặt gương hợp với phương ngang một góc $45^\\circ$.'
        ],
        finalAnswer: 'Đặt gương nghiêng $45^\\circ$ so với phương ngang.'
      }
    ]
  },
  {
    id: 'phys-7-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Từ trường',
    sourceTag: SRC_2018_7,
    lessonNumber: 4,
    title: 'Bài 4: Nam châm, Từ trường & La bàn – Từ trường Trái Đất',
    subtitle: 'Quy luật cực Bắc (N) – Nam (S), vẽ phổ đường sức từ bằng mạt sắt và giải thích kim la bàn',
    description:
      'Tìm hiểu vật liệu từ (sắt, thép, niken, coban), lực đẩy–hút giữa các cực nam châm, hình ảnh đường sức từ và cách Trái Đất như một nam châm khổng lồ.',
    theorySections: [
      {
        heading: '1. Nam châm & Tương tác hai cực',
        content:
          '• Nam châm hút mạnh các vật bằng **sắt, thép, niken, coban** (không hút đồng, nhôm, nhựa).\n• Mọi nam châm luôn có $2$ cực không thể tách rời: cực Bắc (**N — North**, sơn màu đỏ) và cực Nam (**S — South**, sơn màu xanh).\n• **Cùng tên ĐẨY nhau** ($N-N$ hoặc $S-S$), **khác tên HÚT nhau** ($N-S$).'
      },
      {
        heading: '2. Đường sức từ & La bàn Trái Đất',
        content:
          '• Vùng không gian xung quanh nam châm hoặc dòng điện có lực từ gọi là **Từ trường**.\n• Quy ước chiều đường sức từ bên ngoài thanh nam châm: **Đi ra từ cực Bắc (N) và đi vào cực Nam (S)**.\n• Kim la bàn xoay theo hướng Bắc – Nam địa lí vì Trái Đất có từ trường riêng (cực Nam từ trường ở gần cực Bắc địa lí).'
      }
    ],
    keyFormulas: [
      '\\text{Ngoài nam châm: Đường sức đi ra cực } \\mathbf{N} \\to \\text{ đi vào cực } \\mathbf{S}',
      '\\text{Cùng cực đẩy nhau; khác cực hút nhau}'
    ],
    ...SIM_PRESETS.magnet_compass,
    practiceExercises: [
      {
        source: SRC_2018_7,
        question: 'Một thanh nam châm thẳng bị bẻ gãy làm đôi thành hai nửa. Điều gì xảy ra?',
        options: [
          'A. Một nửa chỉ có cực N, nửa kia chỉ có cực S',
          'B. Cả hai nửa đều mất hết từ tính',
          'C. Mỗi nửa trở thành một nam châm mới có đủ cả hai cực N và S',
          'D. Chỉ nửa màu đỏ còn hút sắt'
        ],
        correctIndex: 2,
        explanation: 'Không tồn tại cực từ đơn lẻ; bẻ đôi nam châm sẽ tạo ra hai nam châm con hoàn chỉnh có cả N và S.'
      },
      {
        source: SRC_2018_7,
        question: 'Vật nào sau đây KHÔNG bị nam châm hút?',
        options: ['A. Đinh sắt', 'B. Thìa nhôm', 'C. Mảnh thép lá', 'D. Ghim kẹp sắt'],
        correctIndex: 1,
        explanation: 'Nhôm và đồng không phải vật liệu từ nên không bị nam châm hút.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_7,
        question: 'Cho hai thanh kim loại giống hệt nhau: một thanh là nam châm vĩnh cửu, thanh kia là sắt thường không có sơn màu. Chỉ được chạm hai thanh vào nhau, làm sao nhận biết thanh nào là nam châm?',
        hints: ['Giữa thanh nam châm từ tính yếu nhất, hai đầu cực mạnh nhất.'],
        solutionSteps: [
          'Đưa đầu thanh A chạm vào **chính giữa** thân thanh B.',
          'Nếu thấy hút mạnh $\\to$ thanh A là nam châm (vì đầu cực nam châm hút mạnh mọi chỗ của thanh sắt B).',
          'Nếu hầu như không hút $\\to$ chính giữa thân B là vùng trung hòa của nam châm, suy ra thanh B là nam châm.'
        ],
        finalAnswer: 'Đưa đầu thanh A chạm giữa thanh B: hút mạnh thì A là nam châm; không hút thì B là nam châm.'
      }
    ]
  },
  {
    id: 'phys-7-b5',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Nam châm điện & Khúc xạ sơ cấp',
    sourceTag: SRC_2018_7,
    lessonNumber: 5,
    title: 'Bài 5: Nam châm điện, Chuông điện & Hiện tượng gãy khúc tia sáng',
    subtitle: 'Cách tăng lực hút nam châm điện bằng số vòng dây – dòng điện và quan sát tia sáng truyền lệch khi qua mặt nước',
    description:
      'Chế tạo nam châm điện bằng đinh sắt quấn dây đồng nối pin, biết ưu điểm bật/tắt tùy ý và làm quen hiện tượng chiếc đũa trông như bị gãy khi cắm vào cốc nước.',
    theorySections: [
      {
        heading: '1. Nam châm điện thông minh hơn nam châm thường ở đâu?',
        content:
          '• Quấn nhiều vòng dây đồng bọc cách điện quanh **lõi sắt non** rồi cho dòng điện chạy qua sẽ tạo thành **Nam châm điện**.\n• Muốn nam châm điện hút **MẠNH HƠN**: tăng cường độ dòng điện (lắp thêm pin) hoặc quấn **nhiều vòng dây hơn**.\n• **Ưu điểm tuyệt vời**: Chỉ cần ngắt công tắc là hết từ tính (ứng dụng trong cần cẩu sắt phế liệu, chuông điện).'
      },
      {
        heading: '2. Hiện tượng tia sáng bị gãy khúc qua mặt nước',
        content:
          '• Khi ánh sáng đi xiên góc từ **không khí sang nước**, tia sáng bị bẻ gãy hướng lệch lại gần pháp tuyến hơn — đó là lí do ta nhìn đáy hồ bơi thấy **nông hơn thực tế** và chiếc thìa cắm trong ly nước trông như bị gãy gập.'
      }
    ],
    keyFormulas: [
      '\\text{Lực từ nam châm điện} \\propto \\text{Số vòng dây } N \\times \\text{Dòng điện } I',
      '\\text{Không khí } \\to \\text{ Nước (xiên góc)}: \\text{góc khúc xạ nhỏ hơn góc tới}'
    ],
    ...SIM_PRESETS.electromagnet_bell,
    practiceExercises: [
      {
        source: SRC_2018_7,
        question: 'Để nam châm điện nâng được khối sắt nặng hơn, người thợ cần làm cách nào?',
        options: [
          'A. Giảm số vòng dây cuộn dây',
          'B. Tăng số vòng dây quấn hoặc tăng cường độ dòng điện chạy qua cuộn dây',
          'C. Thay lõi sắt non bằng lõi gỗ',
          'D. Ngắt bớt pin nguồn'
        ],
        correctIndex: 1,
        explanation: 'Tăng cường độ dòng điện hoặc tăng số vòng dây làm từ trường của nam châm điện mạnh lên rõ rệt.'
      },
      {
        source: SRC_2018_7,
        question: 'Vì sao lõi của nam châm điện thường làm bằng SẮT NON mà không dùng THÉP cứng?',
        options: [
          'A. Vì sắt non mất hết từ tính ngay khi ngắt điện, còn thép giữ từ tính lâu dài',
          'B. Vì thép không dẫn điện',
          'C. Vì sắt non nhẹ hơn không khí',
          'D. Vì thép không bị nam châm hút'
        ],
        correctIndex: 0,
        explanation: 'Nam châm điện cần thả ngay vật sắt khi ngắt công tắc nên dùng lõi sắt non dễ khử từ tức thì.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_7,
        question: 'Giải thích vì sao cần cẩu ở bãi sắt phế liệu dùng nam châm điện khổng lồ thay vì nam châm vĩnh cửu.',
        hints: ['Nam châm vĩnh cửu hút chặt sắt xong rất khó gỡ ra để thả xuống xe tải.'],
        solutionSteps: [
          'Nam châm điện tạo lực hút cực lớn khi đóng dòng điện mạnh để nhấc cả tấn sắt vụn.',
          'Khi đưa tới vị trí cần thả, người lái chỉ cần ngắt công tắc điện là nam châm điện mất từ tính ngay lập tức, sắt rơi xuống gọn gàng.'
        ],
        finalAnswer: 'Đóng điện để hút mạnh, ngắt điện để thả phế liệu dễ dàng.'
      }
    ]
  },
  {
    id: 'phys-7-b6',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Vận dụng thực tiễn',
    sourceTag: SRC_2018_7,
    lessonNumber: 6,
    title: 'Bài 6: An toàn tốc độ giao thông & Chống ô nhiễm tiếng ồn',
    subtitle: 'Quy tắc 3 giây giữ khoảng cách an toàn trên đường, bắn tốc độ và vật liệu cách âm',
    description:
      'Vận dụng kiến thức tốc độ và sóng âm bảo vệ tính mạng khi tham gia giao thông và giữ môi trường sống yên tĩnh dưới ngưỡng 70 dB.',
    theorySections: [
      {
        heading: '1. Khoảng cách an toàn giao thông & Quy tắc 3 giây',
        content:
          '• Xe chạy càng nhanh thì **quãng đường phanh** càng dài.\n• Khi đường khô ráo: xe chạy $60\\text{ km/h}$ giữ tối thiểu $35\\text{ m}$; chạy $80\\text{ km/h}$ cần $55\\text{ m}$; chạy $100\\text{ km/h}$ cần $70\\text{ m}$.\n• **Mẹo 3 giây**: Khi xe trước đi qua một cột mốc, đếm đủ $3$ giây xe mình mới tới mốc là an toàn.'
      },
      {
        heading: '2. Ngưỡng tiếng ồn & 3 cách chống ô nhiễm tiếng ồn',
        content:
          '• Tiếng ồn to kéo dài trên **$70\\text{ dB}$** gây mất ngủ, giảm thính lực.\n• **3 giải pháp**: (1) Giảm độ to tại nguồn (cấm bóp còi gần trường học), (2) Ngăn đường truyền âm (kính 2 lớp, tường cách âm, trồng cây xanh), (3) Phân tán âm theo hướng khác.'
      }
    ],
    keyFormulas: [
      's_{\\text{an toàn (m)}} \\approx v\\text{ (m/s)} \\times 3\\text{ s}',
      'L_{\\text{ồn hại}} > 70\\text{ dB}'
    ],
    ...SIM_PRESETS.sound_intensity,
    practiceExercises: [
      {
        source: SRC_2018_7,
        question: 'Theo quy tắc 3 giây, một ô tô đang chạy với tốc độ $72\\text{ km/h}$ ($20\\text{ m/s}$) nên giữ khoảng cách với xe trước tối thiểu khoảng:',
        options: ['A. $20\\text{ m}$', 'B. $40\\text{ m}$', 'C. $60\\text{ m}$', 'D. $10\\text{ m}$'],
        correctIndex: 2,
        explanation: '$s = v \\cdot 3\\text{ s} = 20 \\cdot 3 = 60\\text{ m}$.'
      },
      {
        source: SRC_2018_7,
        question: 'Biện pháp nào tác động trực tiếp vào ĐƯỜNG TRUYỀN ÂM để giảm tiếng ồn giao thông lọt vào phòng học?',
        options: [
          'A. Yêu cầu tài xế tắt máy xe',
          'B. Treo biển cấm bóp còi',
          'C. Đóng cửa kính hai lớp và trồng hàng cây xanh trước sân trường',
          'D. Đeo nút bịt tai trong lớp học'
        ],
        correctIndex: 2,
        explanation: 'Cửa kính và tán cây xanh chắn và phân tán sóng âm trên đường truyền từ đường phố vào lớp.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_7,
        question: 'Camera bắn tốc độ ghi nhận một ô tô đi qua hai vạch kẻ đường cách nhau $20\\text{ m}$ hết $0{,}8\\text{ giây}$. Biết đoạn đường này giới hạn tốc độ tối đa $70\\text{ km/h}$. Xe đó có vi phạm tốc độ không?',
        hints: ['Tính $v = 20 / 0{,}8$ rồi nhân $3{,}6$ đổi ra $\\text{km/h}$.'],
        solutionSteps: [
          'Tốc độ xe theo m/s: $v = \\frac{20}{0{,}8} = 25\\text{ m/s}$.',
          'Đổi sang km/h: $25 \\cdot 3{,}6 = 90\\text{ km/h} > 70\\text{ km/h}$.'
        ],
        finalAnswer: 'Xe chạy $90\\text{ km/h}$, vi phạm quá tốc độ cho phép.'
      }
    ]
  },

  // ==========================================================================
  // LỚP 8 — GDPT 2018 (KHTN 8 · 6 BÀI TOÀN CHƯƠNG)
  // ==========================================================================
  {
    id: 'phys-8-b1',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Khối lượng riêng & Áp suất',
    sourceTag: SRC_2018_8,
    lessonNumber: 1,
    title: 'Bài 1: Khối lượng riêng & Áp suất chất rắn – chất lỏng – khí quyển',
    subtitle: 'Tính áp lực trên một mét vuông p = F/S, bình thông nhau và giải thích ống hút – giác mút',
    description:
      'Hiểu vì sao dao càng bén cắt càng dễ, móng nhà phải xây bản rộng, nước phun xa hơn ở lỗ đáy bình và áp suất khí quyển quanh ta.',
    theorySections: [
      {
        heading: '1. Khối lượng riêng ($D = m/V$) & Áp suất chất rắn ($p = F/S$)',
        content:
          '• **Khối lượng riêng ($D$)** cho biết $1\\text{ m}^3$ chất đó nặng bao nhiêu kg: $D = \\frac{m}{V}$ (nước $1000\\text{ kg/m}^3$, sắt $7800\\text{ kg/m}^3$).\n• **Áp suất ($p$, đơn vị Pascal — Pa)**: $p = \\frac{F}{S}$. Muốn **tăng áp suất** $\\to$ giảm diện tích bị ép (mài sắc lưỡi dao); muốn **giảm áp suất** $\\to$ tăng diện tích (lót ván qua bùn, dây cặp bản to).'
      },
      {
        heading: '2. Áp suất chất lỏng & Áp suất khí quyển',
        content:
          '• Chất lỏng gây áp suất theo **mọi phương** lên đáy, thành bình và vật nhúng vào nó: $p = d \\cdot h$ (càng sâu áp suất càng lớn).\n• Trong **bình thông nhau** chứa cùng một chất lỏng đứng yên, các mực thoáng luôn có **cùng độ cao**.\n• Bầu khí quyển ép lên mọi vật một áp suất lớn ($\\approx 101\\,300\\text{ Pa}$), giúp ta hút nước bằng ống hút.'
      }
    ],
    keyFormulas: [
      'D = \\frac{m}{V}\\ (\\text{kg/m}^3); \\quad p = \\frac{F}{S}\\ (\\text{Pa})',
      'p_{\\text{lỏng}} = d \\cdot h = 10D \\cdot h'
    ],
    ...SIM_PRESETS.fluid_pressure,
    practiceExercises: [
      {
        source: SRC_2018_8,
        question: 'Thợ xây làm móng nhà rộng hơn bức tường phía trên nhằm mục đích gì?',
        options: [
          'A. Tăng áp suất lên nền đất',
          'B. Tăng diện tích tiếp xúc $S$ để GIẢM áp suất lên nền đất tránh lún',
          'C. Giảm khối lượng ngôi nhà',
          'D. Trang trí cho đẹp'
        ],
        correctIndex: 1,
        explanation: 'Với cùng trọng lượng ngôi nhà $F$, tăng diện tích mặt móng $S$ giúp giảm áp suất $p = F/S$ tránh sụt lún.'
      },
      {
        source: SRC_2018_8,
        question: 'Áp suất của nước ($d = 10\\,000\\text{ N/m}^3$) tác dụng lên một thợ lặn đang ở độ sâu $12\\text{ m}$ là:',
        options: ['A. $1200\\text{ Pa}$', 'B. $12\\,000\\text{ Pa}$', 'C. $120\\,000\\text{ Pa}$', 'D. $1{,}2\\text{ Pa}$'],
        correctIndex: 2,
        explanation: '$p = d \\cdot h = 10\\,000 \\cdot 12 = 120\\,000\\text{ Pa}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_8,
        question: 'Một xe tăng nặng $32\\text{ tấn}$ có diện tích tiếp xúc của cả hai bản xích lên mặt đất là $1{,}6\\text{ m}^2$. Tính áp suất xe tăng tác dụng lên mặt đất và so sánh với áp suất một người nặng $50\\text{ kg}$ đứng bằng hai chân có tổng diện tích tiếp xúc $0{,}025\\text{ m}^2$.',
        hints: ['Đổi $32\\text{ tấn} = 32\\,000\\text{ kg} \\implies P = 320\\,000\\text{ N}$.'],
        solutionSteps: [
          'Áp suất xe tăng: $p_{\\text{xe}} = \\frac{320\\,000}{1{,}6} = 200\\,000\\text{ Pa}$.',
          'Áp suất người: $p_{\\text{người}} = \\frac{500}{0{,}025} = 20\\,000\\text{ Pa}$.',
          'Áp suất xe tăng gấp $10$ lần áp suất người đứng.'
        ],
        finalAnswer: '$p_{\\text{xe}} = 200\\,000\\text{ Pa}$, gấp $10$ lần người ($20\\,000\\text{ Pa}$).'
      }
    ]
  },
  {
    id: 'phys-8-b2',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Lực đẩy Ác-si-mét',
    sourceTag: SRC_2018_8,
    lessonNumber: 2,
    title: 'Bài 2: Lực đẩy Ác-si-mét & Điều kiện vật nổi – chìm',
    subtitle: 'Công thức F_A = d · V_chìm, mẹo cân lực kế trong không khí vs nước và vì sao tàu thép nổi',
    description:
      'Thực hành nhúng các khối gỗ, nhôm, sắt vào nước và dầu để hiểu lực đẩy ngược từ dưới lên của chất lỏng – chất khí và điều kiện tàu ngầm lặn nổi.',
    theorySections: [
      {
        heading: '1. Độ lớn Lực đẩy Ác-si-mét ($F_A$)',
        content:
          '• Mọi vật nhúng vào chất lỏng (hoặc chất khí) đều bị đẩy thẳng đứng từ dưới lên với lực: $F_A = d \\cdot V_{\\text{chìm}}$.\n• **Mẹo nhớ cực dễ**: $F_A$ chỉ phụ thuộc vào **trọng lượng riêng chất lỏng ($d$)** và **thể tích phần chất lỏng bị chiếm chỗ ($V_{\\text{chìm}}$)**, KHÔNG phụ thuộc độ sâu hay chất liệu nặng nhẹ của vật!'
      },
      {
        heading: '2. Khi nào vật NỔI, LƠ LỬNG hay CHÌM?',
        content:
          '• Thả một vật ngập trong lòng chất lỏng:\n  - Nếu $F_A < P$ (hay $D_{\\text{vật}} > D_{\\text{lỏng}}$): vật **chìm xuống đáy**.\n  - Nếu $F_A = P$ ($D_{\\text{vật}} = D_{\\text{lỏng}}$): vật **lơ lửng**.\n  - Nếu $F_A > P$ ($D_{\\text{vật}} < D_{\\text{lỏng}}$): vật **trồi lên nổi trên mặt thoáng**.'
      }
    ],
    keyFormulas: [
      'F_A = d_{\\text{lỏng}} \\cdot V_{\\text{chìm}}',
      'F_A = P_{\\text{ngoài không khí}} - F_{\\text{khi nhúng nước}}'
    ],
    ...SIM_PRESETS.archimedes,
    practiceExercises: [
      {
        source: SRC_2018_8,
        question: 'Hai thỏi đồng và nhôm có CÙNG THỂ TÍCH được nhúng chìm hoàn toàn vào cùng một bể nước. So sánh lực đẩy Ác-si-mét tác dụng lên hai thỏi:',
        options: [
          'A. Thỏi đồng chịu $F_A$ lớn hơn',
          'B. Thỏi nhôm chịu $F_A$ lớn hơn',
          'C. Lực đẩy Ác-si-mét tác dụng lên hai thỏi BẰNG NHAU',
          'D. Không xác định được'
        ],
        correctIndex: 2,
        explanation: '$F_A = d \\cdot V$ chỉ phụ thuộc $d$ chất lỏng và thể tích chiếm chỗ $V$, mà cả hai thỏi có $V$ bằng nhau.'
      },
      {
        source: SRC_2018_8,
        question: 'Treo một cục đá ngoài không khí, lực kế chỉ $18\\text{ N}$. Nhúng chìm hoàn toàn cục đá vào nước, lực kế chỉ $11\\text{ N}$. Lực đẩy Ác-si-mét lên cục đá bằng:',
        options: ['A. $18\\text{ N}$', 'B. $11\\text{ N}$', 'C. $7\\text{ N}$', 'D. $29\\text{ N}$'],
        correctIndex: 2,
        explanation: '$F_A = P - F = 18 - 11 = 7\\text{ N}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_8,
        question: 'Một khối gỗ đặc hình lập phương cạnh $10\\text{ cm}$ được thả nổi trong nước ($d = 10\\,000\\text{ N/m}^3$). Khi đứng yên, người ta đo thấy khối gỗ bị ngập sâu $6\\text{ cm}$ dưới mặt nước. Tính lực đẩy Ác-si-mét và khối lượng của khối gỗ.',
        hints: ['Thể tích phần chìm là $10 \\cdot 10 \\cdot 6 = 600\\text{ cm}^3 = 0{,}0006\\text{ m}^3$.'],
        solutionSteps: [
          'Thể tích phần chìm: $V_{\\text{chìm}} = 0{,}1 \\cdot 0{,}1 \\cdot 0{,}06 = 0{,}0006\\text{ m}^3$.',
          'Lực đẩy Ác-si-mét: $F_A = 10\\,000 \\cdot 0{,}0006 = 6\\text{ N}$.',
          'Vì gỗ nổi cân bằng: $P = F_A = 6\\text{ N} \\implies m = \\frac{6}{10} = 0{,}6\\text{ kg}$.'
        ],
        finalAnswer: '$F_A = 6\\text{ N}$; $m = 0{,}6\\text{ kg}$.'
      }
    ]
  },
  {
    id: 'phys-8-b3',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Moment lực & Đòn bẩy',
    sourceTag: SRC_2018_8,
    lessonNumber: 3,
    title: 'Bài 3: Tác dụng làm quay của lực – Moment lực & Đòn bẩy',
    subtitle: 'Vì sao cầm đầu cán xà beng bẩy đá nhẹ tênh và quy tắc cân bằng F₁·d₁ = F₂·d₂',
    description:
      'Khám phá Moment lực $M = F \\cdot d$ làm vật quay quanh trục và phân loại 3 dạng đòn bẩy quen thuộc (cái kéo, xe rùa, đôi đũa).',
    theorySections: [
      {
        heading: '1. Moment lực ($M = F \\cdot d$)',
        content:
          '• Muốn mở cánh cửa dễ dàng, ta luôn đẩy ở **tay nắm xa bản lề** thay vì sát bản lề.\n• Đại lượng đặc trưng cho tác dụng làm quay là **Moment lực ($M$, đơn vị $\\text{N}\\cdot\\text{m}$)**: $M = F \\cdot d$, trong đó $d$ là **cánh tay đòn** (khoảng cách vuông góc từ trục quay đến giá của lực).'
      },
      {
        heading: '2. Quy tắc cân bằng Đòn bẩy',
        content:
          '• Thanh đòn bẩy có điểm tựa $O$ cân bằng khi tổng moment quay theo chiều kim đồng hồ bằng tổng moment ngược chiều kim đồng hồ: **$F_1 \\cdot d_1 = F_2 \\cdot d_2$**.\n• Cánh tay đòn phía tay mình dài hơn gấp mấy lần thì lực mình bỏ ra nhẹ đi bấy nhiêu lần!'
      }
    ],
    keyFormulas: [
      'M = F \\cdot d \\quad (\\text{N}\\cdot\\text{m})',
      'F_1 \\cdot d_1 = F_2 \\cdot d_2'
    ],
    ...SIM_PRESETS.simple_machines,
    practiceExercises: [
      {
        source: SRC_2018_8,
        question: 'Dùng tay nhấn vuông góc lực $25\\text{ N}$ vào tay nắm cửa cách trục bản lề $0{,}8\\text{ m}$. Moment lực tác dụng lên cánh cửa là:',
        options: ['A. $20\\text{ N}\\cdot\\text{m}$', 'B. $31{,}25\\text{ N}\\cdot\\text{m}$', 'C. $2{,}0\\text{ N}\\cdot\\text{m}$', 'D. $200\\text{ N}\\cdot\\text{m}$'],
        correctIndex: 0,
        explanation: '$M = F \\cdot d = 25 \\cdot 0{,}8 = 20\\text{ N}\\cdot\\text{m}$.'
      },
      {
        source: SRC_2018_8,
        question: 'Khi dùng kìm cắt một sợi dây thép cứng, ta nên đặt sợi dây vào vị trí nào trên lưỡi kìm để cắt nhẹ nhất?',
        options: [
          'A. Sát đầu mũi kìm nhất',
          'B. Giữa lưỡi kìm',
          'C. Sát khớp trục quay của kìm nhất để giảm cánh tay đòn phía dây thép',
          'D. Đặt chỗ nào cũng như nhau'
        ],
        correctIndex: 2,
        explanation: 'Sát trục quay làm $d_{\\text{vật}}$ rất nhỏ trong khi tay cầm dài ($d_{\\text{tay}}$ lớn) nên lực cắt tăng gấp bội.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_8,
        question: 'Một đòn bẩy dài tổng cộng $1{,}2\\text{ m}$, điểm tựa $O$ đặt cách đầu treo tảng đá nặng $600\\text{ N}$ một đoạn $0{,}3\\text{ m}$. Tính lực tối thiểu cần ấn xuống ở đầu kia để nâng được tảng đá.',
        hints: ['Cánh tay đòn phía tay người là $1{,}2 - 0{,}3 = 0{,}9\\text{ m}$.'],
        solutionSteps: [
          'Cánh tay đòn phía đá: $d_2 = 0{,}3\\text{ m}$; phía tay ấn: $d_1 = 1{,}2 - 0{,}3 = 0{,}9\\text{ m}$.',
          'Cân bằng đòn bẩy: $F_1 \\cdot 0{,}9 = 600 \\cdot 0{,}3 = 180 \\implies F_1 = \\frac{180}{0{,}9} = 200\\text{ N}$.'
        ],
        finalAnswer: '$200\\text{ N}$ (nhẹ đi $3$ lần).'
      }
    ]
  },
  {
    id: 'phys-8-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Nhiệt năng & Truyền nhiệt',
    sourceTag: SRC_2018_8,
    lessonNumber: 4,
    title: 'Bài 4: Năng lượng nhiệt, 3 cách Truyền nhiệt & Hiệu ứng nhà kính',
    subtitle: 'Phân biệt Dẫn nhiệt (rắn) – Đối lưu (lỏng/khí) – Bức xạ nhiệt (tia hồng ngoại) và ứng dụng phích nước',
    description:
      'Hiểu bản chất nhiệt độ gắn với chuyển động hỗn loạn của phân tử, giải thích vì sao áo bông giữ ấm và cơ chế giữ nhiệt trong bình thủy.',
    theorySections: [
      {
        heading: '1. Năng lượng nhiệt & Nội năng phân tử',
        content:
          '• Các nguyên tử, phân tử luôn chuyển động hỗn loạn không ngừng; nhiệt độ càng cao thì chúng chạy càng nhanh.\n• Khi truyền nhiệt, phần năng lượng truyền từ vật nóng sang vật lạnh gọi là **Nhiệt lượng ($Q$)**, đơn vị **Joule (J)**.'
      },
      {
        heading: '2. Ba hình thức truyền nhiệt',
        content:
          '• **Dẫn nhiệt**: truyền từ đầu nóng sang đầu lạnh trong **chất rắn** (kim loại dẫn nhiệt rất tốt; gỗ, nhựa, không khí tĩnh dẫn nhiệt kém).\n• **Đối lưu**: dòng nước/khí nóng nhẹ nổi lên, lạnh nặng chìm xuống tạo vòng tuần hoàn (đun nước sôi cả ấm, lắp máy lạnh trên cao).\n• **Bức xạ nhiệt**: truyền bằng tia nhiệt **đi qua được cả chân không** (ánh nắng Mặt Trời sưởi ấm Trái Đất).'
      }
    ],
    keyFormulas: [
      '\\text{Dẫn nhiệt (Rắn)} \\cdot \\text{Đối lưu (Lỏng, Khí)} \\cdot \\text{Bức xạ (Chân không)}'
    ],
    ...SIM_PRESETS.heat_transfer,
    practiceExercises: [
      {
        source: SRC_2018_8,
        question: 'Tại sao máy điều hòa nhiệt độ trong phòng luôn được lắp ở trên cao gần trần nhà, còn máy sưởi lại đặt sát sàn?',
        options: [
          'A. Lợi dụng dòng ĐỐI LƯU: khí lạnh nặng chìm xuống làm mát cả phòng; khí nóng nhẹ nổi lên sưởi ấm cả phòng',
          'B. Để tránh trẻ em với tới',
          'C. Vì khí lạnh dẫn nhiệt tốt hơn',
          'D. Để tiết kiệm dây điện'
        ],
        correctIndex: 0,
        explanation: 'Không khí lạnh nặng hơn chìm xuống dưới đẩy khí nóng nhẹ hơn bay lên gặp dàn lạnh.'
      },
      {
        source: SRC_2018_8,
        question: 'Mùa đông mặc nhiều lớp áo mỏng lại ấm hơn một chiếc áo dày cùng chất liệu vì:',
        options: [
          'A. Nhiều lớp vải nặng hơn',
          'B. Các lớp không khí mỏng nằm kẹt giữa các lớp áo dẫn nhiệt rất KÉM giúp giữ nhiệt cơ thể',
          'C. Vải mỏng phản xạ nhiệt tốt hơn',
          'D. Áo mỏng tạo ma sát sinh nhiệt'
        ],
        correctIndex: 1,
        explanation: 'Không khí tĩnh bị giữ giữa các lớp vải là chất cách nhiệt tuyệt vời.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_8,
        question: 'Hãy giải thích cấu tạo 3 lớp bảo vệ của ruột phích nước nóng (bình thủy) giúp ngăn cả 3 hình thức truyền nhiệt.',
        hints: ['Lớp chân không ngăn dẫn nhiệt/đối lưu; lớp tráng bạc phản xạ bức xạ nhiệt; nút bần/nhựa kín.'],
        solutionSteps: [
          '1. Khoảng chân không giữa hai lớp thủy tinh: ngăn **Dẫn nhiệt** và **Đối lưu** vì không có chất dẫn.',
          '2. Mặt trong tráng bạc sáng bóng: phản xạ ngược tia nhiệt vào trong để ngăn **Bức xạ nhiệt**.',
          '3. Nút đậy kín bằng nhựa/xốp: ngăn đối lưu thoát hơi nóng ra miệng bình.'
        ],
        finalAnswer: 'Chân không chặn dẫn nhiệt–đối lưu; tráng bạc chặn bức xạ nhiệt; nút kín giữ hơi.'
      }
    ]
  },
  {
    id: 'phys-8-b5',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Điện học cơ bản',
    sourceTag: SRC_2018_8,
    lessonNumber: 5,
    title: 'Bài 5: Nhiễm điện do cọ xát, Hai loại điện tích & Dòng điện – Nguồn điện',
    subtitle: 'Vì sao chải tóc mùa hanh có tiếng nổ lách tách, hạt electron dịch chuyển và chất dẫn điện vs cách điện',
    description:
      'Khám phá nguồn gốc điện tích dương/âm khi electron di chuyển lúc cọ xát, phân biệt vật dẫn điện (kim loại) với vật cách điện (nhựa, sứ, cao su).',
    theorySections: [
      {
        heading: '1. Nhiễm điện cọ xát & Hai loại điện tích',
        content:
          '• Khi cọ xát (như chà thước nhựa vào vải khô), **electron ($-$)** dịch chuyển từ vật này sang vật kia.\n• Vật **nhận thêm electron** nhiễm **điện âm ($-$)**; vật **mất bớt electron** nhiễm **điện dương ($+$)**.\n• **Quy tắc**: Hai điện tích **cùng dấu ĐẨY nhau**, **khác dấu HÚT nhau**.'
      },
      {
        heading: '2. Dòng điện, Nguồn điện & Chất dẫn điện / cách điện',
        content:
          '• **Dòng điện** là dòng chuyển dời có hướng của các hạt mang điện (trong dây đồng là các **electron tự do**).\n• **Chất dẫn điện** cho dòng điện đi qua (đồng, nhôm, bạc, dung dịch muối); **Chất cách điện** ngăn dòng điện (nhựa, cao su, thủy tinh, gỗ khô).'
      }
    ],
    keyFormulas: [
      '\\text{Cùng dấu: Đẩy nhau } (++;\\ --) \\quad \\text{Khác dấu: Hút nhau } (+-)',
      '\\text{Chiều quy ước dòng điện: Cực } (+) \\xrightarrow{\\text{Mạch ngoài}} \\text{Cực } (-)'
    ],
    ...SIM_PRESETS.coulomb,
    practiceExercises: [
      {
        source: SRC_2018_8,
        question: 'Thanh thủy tinh cọ xát vào lụa trở nên nhiễm điện DƯƠNG ($+$) là do:',
        options: [
          'A. Thanh thủy tinh nhận thêm proton từ lụa',
          'B. Một số electron từ thanh thủy tinh dịch chuyển sang mảnh lụa',
          'C. Thủy tinh tự sinh ra điện tích dương',
          'D. Lụa mất hết hạt nhân'
        ],
        correctIndex: 1,
        explanation: 'Chỉ các electron nhẹ ở lớp vỏ ngoài mới dịch chuyển khi cọ xát; mất bớt electron nên thủy tinh mang điện dương.'
      },
      {
        source: SRC_2018_8,
        question: 'Tại sao vỏ ngoài phích cắm điện và tay cầm kìm điện luôn bọc nhựa hoặc cao su?',
        options: [
          'A. Nhựa và cao su là chất cách điện bảo vệ người dùng khỏi bị điện giật',
          'B. Nhựa dẫn điện tốt hơn đồng',
          'C. Cho phích cắm nặng hơn',
          'D. Để tăng dòng điện'
        ],
        correctIndex: 0,
        explanation: 'Nhựa và cao su không có hạt mang điện tự do nên cách điện an toàn cho tay người.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_8,
        question: 'Vì sao cánh quạt điện quay lâu ngày thường bám rất nhiều bụi bẩn, đặc biệt ở mép cánh quạt?',
        hints: ['Cánh quạt quay nhanh cọ xát mạnh với không khí nên bị nhiễm điện.'],
        solutionSteps: [
          'Khi cánh quạt quay nhanh, bề mặt cánh ma sát liên tục với các luồng không khí nên bị nhiễm điện.',
          'Vật nhiễm điện có tính chất hút các vật nhẹ xung quanh, nên nó hút các hạt bụi lơ lửng trong phòng bám chặt vào mép cánh.'
        ],
        finalAnswer: 'Cánh quạt cọ xát không khí bị nhiễm điện nên hút mạnh các hạt bụi nhẹ.'
      }
    ]
  },
  {
    id: 'phys-8-b6',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Mạch điện & An toàn điện',
    sourceTag: SRC_2018_8,
    lessonNumber: 6,
    title: 'Bài 6: Sơ đồ mạch điện, Ampe kế – Vôn kế, 5 tác dụng dòng điện & An toàn điện',
    subtitle: 'Cách vẽ sơ đồ mạch kín, đọc số chỉ Ampe kế (A) – Vôn kế (V) và nguyên lí cầu chì / aptomat chống chập cháy',
    description:
      'Làm chủ 6 kí hiệu vẽ sơ đồ mạch điện, mắc đúng Ampe kế (nối tiếp) – Vôn kế (song song), hiểu tác dụng nhiệt/từ/hóa/sinh lí của dòng điện và quy tắc an toàn điện.',
    theorySections: [
      {
        heading: '1. Ampe kế, Vôn kế & 5 tác dụng dòng điện',
        content:
          '• **Ampe kế (A)** đo cường độ dòng điện $I$ — phải mắc **NỐI TIẾP** với thiết bị. **Vôn kế (V)** đo hiệu điện thế $U$ — phải mắc **SONG SONG**.\n• Dòng điện có 5 tác dụng: **Nhiệt** (bếp điện, bàn là), **Phát sáng** (đèn LED), **Từ** (chuông điện, quạt), **Hóa học** (mạ vàng/bạc), **Sinh lí** (giật cơ tim).'
      },
      {
        heading: '2. Cầu chì, Aptomat & Quy tắc an toàn điện',
        content:
          '• Khi xảy ra **đoản mạch (chập điện)**, dòng điện tăng vọt làm dây dẫn nóng đỏ dễ cháy nhà.\n• **Cầu chì / Aptomat** được mắc nối tiếp ngay đầu mạch để **tự đứt hoặc tự ngắt** khi dòng vượt quá mức an toàn.\n• Tuyệt đối không chạm tay ướt vào ổ điện, không vừa sạc điện thoại vừa dùng.'
      }
    ],
    keyFormulas: [
      '\\text{Mạch nối tiếp: } I = I_1 = I_2; \\quad U = U_1 + U_2',
      '\\text{Mạch song song: } I = I_1 + I_2; \\quad U = U_1 = U_2'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_2018_8,
        question: 'Để đo cường độ dòng điện chạy qua bóng đèn trong mạch, ta phải mắc Ampe kế như thế nào?',
        options: [
          'A. Mắc song song hai đầu bóng đèn',
          'B. Mắc nối tiếp với bóng đèn sao cho chốt (+) nối về phía cực dương nguồn',
          'C. Nối trực tiếp hai cực nguồn không qua đèn',
          'D. Mắc thế nào cũng được'
        ],
        correctIndex: 1,
        explanation: 'Ampe kế có điện trở rất nhỏ nên luôn mắc nối tiếp với vật cần đo và đúng cực (+), (-).'
      },
      {
        source: SRC_2018_8,
        question: 'Bếp điện, ấm siêu tốc và bàn là hoạt động chủ yếu dựa trên tác dụng nào của dòng điện?',
        options: ['A. Tác dụng từ', 'B. Tác dụng hóa học', 'C. Tác dụng nhiệt', 'D. Tác dụng sinh lí'],
        correctIndex: 2,
        explanation: 'Dòng điện chạy qua dây đốt nóng tỏa nhiệt lượng lớn phục vụ đun nấu, là ủi.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_8,
        question: 'Trong gia đình, các bóng đèn và ổ cắm thường được mắc song song hay nối tiếp với mạng điện $220\\text{ V}$? Giải thích hai lợi ích của cách mắc đó.',
        hints: ['Khi tắt 1 bóng đèn phòng ngủ, đèn phòng khách có bị tắt theo không?'],
        solutionSteps: [
          'Mọi thiết bị điện gia đình đều mắc **song song** vào mạng điện $220\\text{ V}$.',
          'Lợi ích 1: Mỗi thiết bị đều nhận đúng hiệu điện thế định mức $220\\text{ V}$ để chạy đúng công suất.',
          'Lợi ích 2: Khi tắt hoặc hỏng một đèn, các thiết bị khác vẫn hoạt động bình thường độc lập.'
        ],
        finalAnswer: 'Mắc song song: đủ $220\\text{ V}$ cho từng thiết bị và bật/tắt độc lập.'
      }
    ]
  }
];
