import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const SRC_2006_6 = 'GDPT 2006 · SGK Vật lí 6';
const SRC_2006_7 = 'GDPT 2006 · SGK Vật lí 7';
const SRC_2006_8 = 'GDPT 2006 · SGK Vật lí 8';

export const PHYSICS_MS_2006_LESSONS: PhysicsLesson[] = [
  // ==========================================================================
  // LỚP 6 — GDPT 2006 (SGK VẬT LÍ 6 · 6 BÀI ĐẦY ĐỦ)
  // ==========================================================================
  {
    id: 'phys-2006-6-1',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'Vật lí 6 (SGK 2006) · Các phép đo',
    sourceTag: SRC_2006_6,
    lessonNumber: 1,
    title: 'Bài 1 (SGK 2006): Đo độ dài, Đo thể tích chất lỏng – vật rắn & Đo khối lượng',
    subtitle: 'Chương I SGK Vật lí 6: GHĐ, ĐCNN, bình chia độ, bình tràn và cân Rô-béc-van',
    description:
      'Học đầy đủ kĩ năng đo cơ học đầu cấp THCS theo SGK Vật lí 6 (2006): đo chiều dài, đo thể tích vật hình dạng bất kì và cân khối lượng.',
    theorySections: [
      {
        heading: '1. Đo độ dài & Đo thể tích (SGK Lý 6 2006)',
        content:
          '• **GHĐ** là giá trị lớn nhất ghi trên dụng cụ; **ĐCNN** là khoảng giữa $2$ vạch chia liên tiếp.\n• Đo thể tích hòn đá không lọt bình chia độ: dùng **bình tràn** hứng nước tràn ra bình chứa ($V_{\\text{vật}} = V_{\\text{nước tràn}}$).'
      },
      {
        heading: '2. Đo khối lượng bằng cân Rô-béc-van & cân đồng hồ',
        content:
          '• Đơn vị hợp pháp của khối lượng là **kilôgam (kg)**.\n• Khi cân bằng cân đồng hồ, xoay ốc điều chỉnh để kim chỉ đúng vạch $0$ trước khi đặt vật.'
      }
    ],
    keyFormulas: [
      '1\\text{ m} = 10\\text{ dm} = 100\\text{ cm} = 1000\\text{ mm}',
      '1\\text{ lít} = 1\\text{ dm}^3 = 1000\\text{ ml}; \\quad 1\\text{ tấn} = 10\\text{ tạ} = 1000\\text{ kg}'
    ],
    ...SIM_PRESETS.measurement_tools,
    practiceExercises: [
      {
        source: SRC_2006_6,
        question: 'Dụng cụ nào phù hợp nhất để đo thể tích một viên sỏi không thấm nước nhưng không lọt ống nghiệm nhỏ?',
        options: ['A. Thước thẳng', 'B. Bình tràn kết hợp bình chia độ', 'C. Cân đồng hồ', 'D. Nhiệt kế'],
        correctIndex: 1,
        explanation: 'Thả chìm viên sỏi vào bình tràn đựng đầy nước rồi đo lượng nước tràn ra bằng bình chia độ.'
      },
      {
        source: SRC_2006_6,
        question: 'Đổi đơn vị: $2{,}5\\text{ tạ} + 30\\text{ kg}$ bằng bao nhiêu kilôgam?',
        options: ['A. $55\\text{ kg}$', 'B. $280\\text{ kg}$', 'C. $2530\\text{ kg}$', 'D. $28\\text{ kg}$'],
        correctIndex: 1,
        explanation: '$2{,}5\\text{ tạ} = 250\\text{ kg} \\implies 250 + 30 = 280\\text{ kg}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_6,
        question: 'Nêu cách đo thể tích một chiếc chìa khóa kim loại bằng bình chia độ GHĐ $100\\text{ ml}$, ĐCNN $1\\text{ ml}$.',
        hints: ['Đổ nước ban đầu vào bình, thả nhẹ chìa khóa ngập hẳn rồi đọc $V_2$.'],
        solutionSteps: [
          'Đổ nước vào bình chia độ tới vạch dễ đọc (ví dụ $V_1 = 50\\text{ ml}$).',
          'Buộc sợi chỉ mảnh thả nhẹ chìa khóa chìm hoàn toàn vào nước.',
          'Đọc mực nước mới $V_2$. Thể tích chìa khóa $V = V_2 - V_1$ ($\\text{cm}^3$).'
        ],
        finalAnswer: '$V = V_2 - V_1$.'
      }
    ]
  },
  {
    id: 'phys-2006-6-2',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'Vật lí 6 (SGK 2006) · Lực học cơ bản',
    sourceTag: SRC_2006_6,
    lessonNumber: 2,
    title: 'Bài 2 (SGK 2006): Lực, Hai lực cân bằng, Trọng lực & Lực đàn hồi',
    subtitle: 'Hai lực cân bằng (cùng phương, ngược chiều, bằng độ lớn), trọng lượng P = 10·m và lực kế lò xo',
    description:
      'Nắm chắc khái niệm lực, hai lực cân bằng giữ vật đứng yên, trọng lượng $P = 10m$ và lực đàn hồi của lò xo khi bị kéo/nén.',
    theorySections: [
      {
        heading: '1. Lực & Hai lực cân bằng',
        content:
          '• Nếu có **hai lực cân bằng** cùng đặt lên một vật đứng yên (cùng phương, **ngược chiều**, **cùng độ lớn**), vật sẽ **tiếp tục đứng yên**.\n• Đèn chùm treo yên dưới trần nhà nhờ trọng lực cân bằng với lực kéo của dây treo.'
      },
      {
        heading: '2. Trọng lực & Lực đàn hồi',
        content:
          '• **Trọng lực** là lực hút của Trái Đất, phương thẳng đứng hướng xuống dưới, độ lớn $P = 10 \\cdot m$ ($\\text{N}$).\n• Lò xo bị biến dạng đàn hồi sinh ra **lực đàn hồi** chống lại biến dạng; độ biến dạng càng lớn thì lực đàn hồi càng mạnh.'
      }
    ],
    keyFormulas: [
      '\\text{Hai lực cân bằng: } F_1 = F_2,\\ \\text{cùng phương, ngược chiều}',
      'P = 10 \\cdot m \\quad (\\text{N})'
    ],
    ...SIM_PRESETS.spring,
    practiceExercises: [
      {
        source: SRC_2006_6,
        question: 'Một quyển sách nằm yên trên mặt bàn nằm ngang chịu tác dụng của hai lực cân bằng nào?',
        options: [
          'A. Trọng lực hướng xuống và lực nâng lên của mặt bàn',
          'B. Lực ma sát và lực hút nam châm',
          'C. Trọng lực và lực kéo sang ngang',
          'D. Không có lực nào tác dụng lên sách'
        ],
        correctIndex: 0,
        explanation: 'Trọng lực kéo xuống cân bằng với lực nâng thẳng đứng từ dưới lên của mặt bàn.'
      },
      {
        source: SRC_2006_6,
        question: 'Một quả dưa hấu nặng $2{,}4\\text{ kg}$ có trọng lượng bằng bao nhiêu Newton?',
        options: ['A. $2{,}4\\text{ N}$', 'B. $24\\text{ N}$', 'C. $240\\text{ N}$', 'D. $0{,}24\\text{ N}$'],
        correctIndex: 1,
        explanation: '$P = 10 \\cdot 2{,}4 = 24\\text{ N}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_6,
        question: 'Khi treo một quả nặng $500\\text{ g}$ đứng yên vào đầu dưới của một lực kế lò xo, số chỉ lực kế là bao nhiêu? Hai lực nào đang cân bằng lên quả nặng?',
        hints: ['Đổi $500\\text{ g} = 0{,}5\\text{ kg}$.'],
        solutionSteps: [
          'Trọng lượng quả nặng: $P = 10 \\cdot 0{,}5 = 5\\text{ N} \\implies$ lực kế chỉ $5\\text{ N}$.',
          'Quả nặng đứng yên vì chịu hai lực cân bằng: Trọng lực hướng xuống ($5\\text{ N}$) và Lực đàn hồi lò xo kéo lên ($5\\text{ N}$).'
        ],
        finalAnswer: 'Số chỉ $5\\text{ N}$; Trọng lực và Lực đàn hồi cân bằng nhau.'
      }
    ]
  },
  {
    id: 'phys-2006-6-3',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'Vật lí 6 (SGK 2006) · Khối lượng riêng',
    sourceTag: SRC_2006_6,
    lessonNumber: 3,
    title: 'Bài 3 (SGK 2006): Khối lượng riêng & Trọng lượng riêng ($d = 10D$)',
    subtitle: 'Phân biệt D (kg/m³) với d (N/m³), bảng khối lượng riêng kim loại và tính khối lượng không cần cân',
    description:
      'Học công thức $D = m/V$ và $d = P/V = 10D$ để nhận biết vật đặc hay rỗng và tính khối lượng những khối đá/kim loại lớn.',
    theorySections: [
      {
        heading: '1. Khối lượng riêng ($D$)',
        content:
          '• **Khối lượng riêng** là khối lượng của $1\\text{ m}^3$ chất đó: $D = \\frac{m}{V}$ ($\\text{kg/m}^3$).\n• Giá trị hay dùng: Nước $1000\\text{ kg/m}^3$, Nhôm $2700\\text{ kg/m}^3$, Sắt $7800\\text{ kg/m}^3$, Đồng $8900\\text{ kg/m}^3$.'
      },
      {
        heading: '2. Trọng lượng riêng ($d$) & Quan hệ $d = 10D$',
        content:
          '• **Trọng lượng riêng** là trọng lượng của $1\\text{ m}^3$ một chất: $d = \\frac{P}{V}$ (đơn vị $\\text{N/m}^3$).\n• Vì $P = 10m$ nên ta luôn có công thức đổi siêu nhanh: **$d = 10 \\cdot D$**.'
      }
    ],
    keyFormulas: [
      'D = \\frac{m}{V}\\ (\\text{kg/m}^3); \\quad m = D \\cdot V',
      'd = \\frac{P}{V} = 10\\,D\\ (\\text{N/m}^3)'
    ],
    ...SIM_PRESETS.archimedes,
    practiceExercises: [
      {
        source: SRC_2006_6,
        question: 'Một khối đá có khối lượng riêng $D = 2600\\text{ kg/m}^3$. Trọng lượng riêng $d$ của đá là:',
        options: ['A. $260\\text{ N/m}^3$', 'B. $2600\\text{ N/m}^3$', 'C. $26\\,000\\text{ N/m}^3$', 'D. $260\\,000\\text{ N/m}^3$'],
        correctIndex: 2,
        explanation: '$d = 10D = 10 \\cdot 2600 = 26\\,000\\text{ N/m}^3$.'
      },
      {
        source: SRC_2006_6,
        question: 'Biết $1\\text{ lít}$ dầu ăn có khối lượng $0{,}8\\text{ kg}$. Khối lượng riêng của dầu ăn là:',
        options: ['A. $800\\text{ kg/m}^3$', 'B. $80\\text{ kg/m}^3$', 'C. $1000\\text{ kg/m}^3$', 'D. $1250\\text{ kg/m}^3$'],
        correctIndex: 0,
        explanation: '$V = 1\\text{ lít} = 0{,}001\\text{ m}^3 \\implies D = \\frac{0{,}8}{0{,}001} = 800\\text{ kg/m}^3$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_6,
        question: 'Một chiếc tượng đồng đặc có thể tích $2\\text{ dm}^3$ ($0{,}002\\text{ m}^3$), biết khối lượng riêng của đồng là $8900\\text{ kg/m}^3$. Tính khối lượng và trọng lượng của bức tượng.',
        hints: ['Tính $m = D \\cdot V$ rồi suy ra $P = 10m$.'],
        solutionSteps: [
          'Khối lượng bức tượng: $m = D \\cdot V = 8900 \\cdot 0{,}002 = 17{,}8\\text{ kg}$.',
          'Trọng lượng bức tượng: $P = 10 \\cdot 17{,}8 = 178\\text{ N}$.'
        ],
        finalAnswer: '$m = 17{,}8\\text{ kg}$; $P = 178\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-2006-6-4',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'Vật lí 6 (SGK 2006) · Máy cơ đơn giản',
    sourceTag: SRC_2006_6,
    lessonNumber: 4,
    title: 'Bài 4 (SGK 2006): Ba Máy cơ đơn giản — Mặt phẳng nghiêng, Đòn bẩy & Ròng rọc',
    subtitle: 'Lăn thùng hàng lên dốc nhẹ hơn kéo thẳng đứng, đòn bẩy F₁·d₁ = F₂·d₂ và ròng rọc cố định vs động',
    description:
      'Làm chủ trọn vẹn 3 máy cơ đơn giản kinh điển giúp giảm lực kéo vật nặng: Mặt phẳng nghiêng, Đòn bẩy và Ròng rọc.',
    theorySections: [
      {
        heading: '1. Mặt phẳng nghiêng & Đòn bẩy',
        content:
          '• **Mặt phẳng nghiêng**: Dùng tấm ván bắc nghiêng đẩy xe lên cao. **Độ nghiêng càng nhỏ (ván càng dài thoai thoải)** thì lực kéo càng nhỏ ($F = P \\cdot \\frac{h}{l}$).\n• **Đòn bẩy**: Đặt điểm tựa $O$ gần vật nặng hơn tay cầm ($OO_2 > OO_1$) thì dùng lực nhẹ hơn trọng lượng vật.'
      },
      {
        heading: '2. Ròng rọc cố định & Ròng rọc động',
        content:
          '• **Ròng rọc cố định**: KHÔNG giảm lực ($F = P$), chỉ **đổi hướng lực kéo** cho thuận tiện.\n• **Ròng rọc động**: cho lợi **2 lần về lực** ($F = \\frac{P}{2}$ khi bỏ qua ma sát & trọng lượng ròng rọc).'
      }
    ],
    keyFormulas: [
      'F_{\\text{mặt nghiêng}} \\approx P \\cdot \\frac{h}{l} < P',
      'F_{\\text{ròng rọc cố định}} = P; \\quad F_{\\text{ròng rọc động}} = \\frac{P}{2}'
    ],
    ...SIM_PRESETS.simple_machines,
    practiceExercises: [
      {
        source: SRC_2006_6,
        question: 'Dùng một ròng rọc ĐỘNG để kéo đều một bao xi măng nặng $50\\text{ kg}$ ($500\\text{ N}$) lên cao. Bỏ qua ma sát và trọng lượng ròng rọc, lực kéo cần thiết là:',
        options: ['A. $500\\text{ N}$', 'B. $250\\text{ N}$', 'C. $1000\\text{ N}$', 'D. $100\\text{ N}$'],
        correctIndex: 1,
        explanation: 'Ròng rọc động giúp giảm một nửa lực kéo: $F = P / 2 = 500 / 2 = 250\\text{ N}$.'
      },
      {
        source: SRC_2006_6,
        question: 'Đường ô tô lên đỉnh núi cao thường làm ngoằn ngoèo uốn lượn rất dài chứ không đâm thẳng lên dốc đứng nhằm mục đích gì?',
        options: [
          'A. Giảm độ dốc mặt phẳng nghiêng để động cơ cần lực kéo nhỏ hơn',
          'B. Để đi được quãng đường ngắn hơn',
          'C. Cho xe chạy nhanh hơn',
          'D. Để tăng trọng lượng xe'
        ],
        correctIndex: 0,
        explanation: 'Đường càng dài thì độ dốc càng thoải, giúp lực kéo cần thiết của xe giảm đi nhiều.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_6,
        question: 'Người công nhân dùng tấm ván dài $4\\text{ m}$ làm mặt phẳng nghiêng để đẩy thùng hàng $80\\text{ kg}$ lên sàn xe cao $1\\text{ m}$. Tính lực đẩy tối thiểu (bỏ qua ma sát) và lợi mấy lần về lực.',
        hints: ['Trọng lượng $P = 800\\text{ N}$, mặt phẳng nghiêng dài gấp $4$ lần chiều cao.'],
        solutionSteps: [
          'Trọng lượng thùng hàng: $P = 10 \\cdot 80 = 800\\text{ N}$.',
          'Lực đẩy trên mặt nghiêng: $F = P \\cdot \\frac{h}{l} = 800 \\cdot \\frac{1}{4} = 200\\text{ N}$.',
          'Cho lợi $4$ lần về lực.'
        ],
        finalAnswer: '$200\\text{ N}$, lợi $4$ lần về lực.'
      }
    ]
  },
  {
    id: 'phys-2006-6-5',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'Vật lí 6 (SGK 2006) · Nhiệt học',
    sourceTag: SRC_2006_6,
    lessonNumber: 5,
    title: 'Bài 5 (SGK 2006): Sự nở vì nhiệt của Chất rắn – Lỏng – Khí & Băng kép',
    subtitle: 'So sánh mức độ nở vì nhiệt Rắn < Lỏng < Khí, lực lớn khi co dãn bị cản và cấu tạo băng kép',
    description:
      'Học Chương II Nhiệt học SGK Vật lí 6: thí nghiệm quả cầu kim loại lọt vòng đồng, bình cầu nước dâng, băng kép bàn là và khe hở đường ray.',
    theorySections: [
      {
        heading: '1. Đặc điểm nở vì nhiệt của 3 thể',
        content:
          '• **Chất rắn, chất lỏng, chất khí** đều nở ra khi nóng lên và co lại khi lạnh đi.\n• Các chất khí khác nhau nở vì nhiệt **GIỐNG NHAU**; các chất rắn/lỏng khác nhau nở vì nhiệt **KHÁC NHAU**.\n• Chất khí nở **nhiều nhất**, chất rắn nở **ít nhất**.'
      },
      {
        heading: '2. Lực sinh ra khi co dãn bị ngăn cản & Băng kép',
        content:
          '• Khi co dãn vì nhiệt bị ngăn cản, nó gây ra **lực cực lớn** (làm cong đường ray, nứt tường bê tông).\n• **Băng kép** ghép hai thanh đồng và thép: khi đốt nóng, đồng nở dài hơn thép nên băng kép **cong về phía thanh thép**.'
      }
    ],
    keyFormulas: [
      '\\Delta V_{\\text{khí}} > \\Delta V_{\\text{lỏng}} > \\Delta V_{\\text{rắn}}',
      '\\text{Băng kép đồng – thép nóng lên} \\to \\text{cong về phía thép}'
    ],
    ...SIM_PRESETS.thermal_expansion,
    practiceExercises: [
      {
        source: SRC_2006_6,
        question: 'So sánh sự nở vì nhiệt của $1\\text{ lít}$ khí Oxi và $1\\text{ lít}$ khí Hiđro khi cùng tăng thêm $20^\\circ\\text{C}$:',
        options: [
          'A. Khí Hiđro nở nhiều hơn',
          'B. Khí Oxi nở nhiều hơn',
          'C. Hai khí nở vì nhiệt GIỐNG NHAU',
          'D. Không chất khí nào nở'
        ],
        correctIndex: 2,
        explanation: 'Mọi chất khí khác nhau nở vì nhiệt giống hệt nhau.'
      },
      {
        source: SRC_2006_6,
        question: 'Khi đun nóng một thanh băng kép gồm thanh đồng tán chặt với thanh sắt (đồng nở nhiều hơn sắt), băng kép sẽ cong như thế nào?',
        options: [
          'A. Cong về phía thanh sắt',
          'B. Cong về phía thanh đồng',
          'C. Vẫn giữ thẳng',
          'D. Bị gãy đôi ngay lập tức'
        ],
        correctIndex: 0,
        explanation: 'Thanh đồng dài hơn nằm ở vòng cung ngoài lớn hơn, đẩy băng kép cong về phía thanh sắt ở bên trong.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_6,
        question: 'Tại sao khi rót nước sôi nóng vào một cốc thủy tinh dày thì cốc dễ bị nứt vỡ hơn so với cốc thủy tinh mỏng?',
        hints: ['Thành trong cốc tiếp xúc nước sôi nóng nở trước thành ngoài chưa kịp nóng.'],
        solutionSteps: [
          'Thủy tinh dẫn nhiệt kém. Khi rót nước sôi vào cốc dày, lớp thủy tinh bên trong nóng lên và nở ra trước.',
          'Lớp bên ngoài còn nguội chưa kịp nở nên cản trở sự nở của lớp trong, sinh ra lực ép làm nứt vỡ cốc.'
        ],
        finalAnswer: 'Lớp trong nở nhanh bị lớp ngoài nguội cản lại gây lực nứt vỡ.'
      }
    ]
  },
  {
    id: 'phys-2006-6-6',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'Vật lí 6 (SGK 2006) · Nhiệt kế & Chuyển thể',
    sourceTag: SRC_2006_6,
    lessonNumber: 6,
    title: 'Bài 6 (SGK 2006): Nhiệt kế, Nóng chảy – Đông đặc & Bay hơi – Ngưng tụ',
    subtitle: 'Nhiệt độ nóng chảy bằng nhiệt độ đông đặc, sự sôi ở 100°C và 3 yếu tố làm tăng tốc độ bay hơi',
    description:
      'Hoàn tất Chương II SGK Vật lí 6: cấu tạo nhiệt kế, đường biểu diễn nóng chảy không đổi nhiệt độ ở $0^\\circ\\text{C}$ và 3 yếu tố tốc độ bay hơi (nhiệt độ, gió, mặt thoáng).',
    theorySections: [
      {
        heading: '1. Nóng chảy – Đông đặc & Sự sôi',
        content:
          '• **Nóng chảy** (Rắn $\\to$ Lỏng) và **Đông đặc** (Lỏng $\\to$ Rắn) xảy ra ở **cùng một nhiệt độ xác định** (nước đá là $0^\\circ\\text{C}$). Trong suốt thời gian đang nóng chảy hoặc đang sôi, nhiệt độ của chất **KHÔNG TĂNG THÊM**.'
      },
      {
        heading: '2. Bay hơi – Ngưng tụ & 3 yếu tố tăng tốc độ bay hơi',
        content:
          '• Sự bay hơi xảy ra ở **mọi nhiệt độ** trên mặt thoáng chất lỏng.\n• Tốc độ bay hơi càng nhanh khi: **(1) Nhiệt độ cao, (2) Có gió thổi mạnh, (3) Diện tích mặt thoáng rộng**.'
      }
    ],
    keyFormulas: [
      'T_{\\text{nóng chảy (nước đá)}} = T_{\\text{đông đặc}} = 0^\\circ\\text{C}',
      'T_{\\text{sôi (nước tinh khiết, 1 atm)}} = 100^\\circ\\text{C}'
    ],
    ...SIM_PRESETS.phase_change,
    practiceExercises: [
      {
        source: SRC_2006_6,
        question: 'Trong suốt thời gian nước đá tinh khiết đang tan chảy ngoài trời nắng, nhiệt độ của hỗn hợp nước và đá là:',
        options: ['A. Tăng dần từ $0^\\circ\\text{C}$ lên $100^\\circ\\text{C}$', 'B. Luôn giữ nguyên ở $0^\\circ\\text{C}$', 'C. Giảm xuống dưới $0^\\circ\\text{C}$', 'D. Bằng nhiệt độ phòng'],
        correctIndex: 1,
        explanation: 'Trong suốt quá trình chuyển thể nóng chảy của chất tinh khiết, nhiệt độ không đổi ở $0^\\circ\\text{C}$ cho tới khi tan hết.'
      },
      {
        source: SRC_2006_6,
        question: 'Người nông dân phơi thóc trên sân rộng và thỉnh thoảng cào đảo thóc nhằm mục đích gì?',
        options: [
          'A. Tăng diện tích mặt thoáng tiếp xúc nắng gió giúp nước bay hơi nhanh hơn',
          'B. Làm thóc nặng hơn',
          'C. Giảm nhiệt độ sân phơi',
          'D. Làm thóc đông đặc lại'
        ],
        correctIndex: 0,
        explanation: 'Trải mỏng rộng và đảo giúp tăng diện tích mặt thoáng và đón gió/nắng làm bay hơi ẩm nhanh.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_6,
        question: 'Vì sao khi thổi nhẹ vào bát canh nóng ta thấy canh nguội nhanh hơn, và tại sao sương mù thường xuất hiện vào sáng sớm mùa lạnh?',
        hints: ['Thổi tạo gió tăng tốc độ bay hơi mang theo nhiệt; sương mù là hơi nước gặp lạnh ngưng tụ.'],
        solutionSteps: [
          'Thổi tạo gió thổi bay lớp hơi nước trên mặt bát canh, làm canh bay hơi nhanh hơn và mang bớt nhiệt lượng đi nên canh nguội nhanh.',
          'Ban đêm không khí lạnh đi, hơi nước gần mặt đất gặp lạnh ngưng tụ thành giọt nước siêu nhỏ lơ lửng tạo thành sương mù.'
        ],
        finalAnswer: 'Gió tăng bay hơi làm nguội nhanh; hơi nước gặp lạnh ngưng tụ tạo sương mù.'
      }
    ]
  },

  // ==========================================================================
  // LỚP 7 — GDPT 2006 (SGK VẬT LÍ 7 · 6 BÀI ĐẦY ĐỦ)
  // ==========================================================================
  {
    id: 'phys-2006-7-1',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'Vật lí 7 (SGK 2006) · Quang học',
    sourceTag: SRC_2006_7,
    lessonNumber: 1,
    title: 'Bài 1 (SGK 2006): Truyền thẳng ánh sáng, Bóng tối & Nhật thực – Nguyệt thực',
    subtitle: 'Định luật truyền thẳng, chùm tia hội tụ – phân kì – song song và vị trí Trái Đất – Mặt Trăng',
    description:
      'Học phần mở đầu Quang học SGK Vật lí 7 (2006): phân biệt nguồn sáng và vật sáng, 3 loại chùm sáng và giải thích hiện tượng Nhật thực – Nguyệt thực.',
    theorySections: [
      {
        heading: '1. Nguồn sáng, Vật sáng & Định luật truyền thẳng ánh sáng',
        content:
          '• **Nguồn sáng**: tự phát ra ánh sáng (Mặt Trời, bóng đèn bật sáng). **Vật sáng**: gồm nguồn sáng và vật hắt lại ánh sáng chiếu vào nó (Mặt Trăng, quyển vở ban ngày).\n• Trong môi trường trong suốt và đồng tính, ánh sáng truyền đi theo **đường thẳng**.'
      },
      {
        heading: '2. Nhật thực & Nguyệt thực (Trái Đất – Mặt Trăng – Mặt Trời)',
        content:
          '• **Nhật thực**: Mặt Trăng nằm **GIỮA** Mặt Trời và Trái Đất, chắn ánh sáng Mặt Trời rọi xuống tạo bóng tối trên Trái Đất.\n• **Nguyệt thực**: Trái Đất nằm **GIỮA** Mặt Trời và Mặt Trăng, Trái Đất che khuất ánh sáng khiến Mặt Trăng chìm vào vùng tối.'
      }
    ],
    keyFormulas: [
      '\\text{Nhật thực: Mặt Trời} \\to \\mathbf{\\text{Mặt Trăng}} \\to \\text{Trái Đất}',
      '\\text{Nguyệt thực: Mặt Trời} \\to \\mathbf{\\text{Trái Đất}} \\to \\text{Mặt Trăng}'
    ],
    ...SIM_PRESETS.refraction,
    practiceExercises: [
      {
        source: SRC_2006_7,
        question: 'Hiện tượng Nhật thực xảy ra vào ban ngày khi:',
        options: [
          'A. Trái Đất nằm giữa Mặt Trời và Mặt Trăng',
          'B. Mặt Trăng nằm giữa Mặt Trời và Trái Đất thẳng hàng',
          'C. Mặt Trời nằm giữa Trái Đất và Mặt Trăng',
          'D. Sao Hỏa che Mặt Trăng'
        ],
        correctIndex: 1,
        explanation: 'Mặt Trăng che khuất Mặt Trời, đổ bóng tối lên một vùng trên Trái Đất.'
      },
      {
        source: SRC_2006_7,
        question: 'Khi đặt mắt nhìn thấy một bông hoa hồng màu đỏ dưới ánh nắng, vì sao ta nhìn thấy được nó?',
        options: [
          'A. Vì bông hoa tự phát ra ánh sáng',
          'B. Vì ánh sáng từ bông hoa hắt lại truyền vào mắt ta',
          'C. Vì mắt ta phát ra tia sáng chiếu tới bông hoa',
          'D. Vì không khí phát sáng'
        ],
        correctIndex: 1,
        explanation: 'Ta nhìn thấy vật khi có ánh sáng từ vật truyền vào mắt ta.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_7,
        question: 'Vì sao khi dùng đèn pin chiếu qua một ống nhựa thẳng ta thấy chấm sáng trên tường, nhưng uốn cong ống nhựa lại thì không thấy nữa?',
        hints: ['Liên hệ định luật truyền thẳng ánh sáng trong không khí đồng tính.'],
        solutionSteps: [
          'Không khí là môi trường trong suốt và đồng tính nên tia sáng từ đèn pin truyền theo đường thẳng.',
          'Khi ống uốn cong, thành ống nhựa đã chắn mất đường truyền thẳng của ánh sáng nên tia sáng không thoát ra đầu kia được.'
        ],
        finalAnswer: 'Do ánh sáng truyền thẳng trong không khí nên bị thành ống cong chắn lại.'
      }
    ]
  },
  {
    id: 'phys-2006-7-2',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'Vật lí 7 (SGK 2006) · Quang học',
    sourceTag: SRC_2006_7,
    lessonNumber: 2,
    title: 'Bài 2 (SGK 2006): Định luật Phản xạ Ánh sáng & Ảnh qua Gương phẳng',
    subtitle: 'Cách vẽ tia phản xạ bằng thước đo góc, dựng ảnh ảo đối xứng và vùng nhìn thấy của gương',
    description:
      'Nắm chắc mọi dạng bài tập vẽ hình Quang học 7 (2006): tính góc tới – góc phản xạ, vẽ ảnh vật qua gương phẳng và xác định vùng nhìn thấy.',
    theorySections: [
      {
        heading: '1. Định luật Phản xạ ánh sáng',
        content:
          '• Tia phản xạ nằm trong mặt phẳng chứa tia tới và đường pháp tuyến tại điểm tới.\n• **Góc phản xạ bằng góc tới ($i\' = i$)**.\n• Nếu tia tới chiếu **vuông góc** mặt gương ($i = 0^\\circ$) thì tia phản xạ **bật ngược trở lại đúng đường cũ** ($i\' = 0^\\circ$).'
      },
      {
        heading: '2. Dựng ảnh của vật sáng qua Gương phẳng',
        content:
          '• Ảnh của một điểm $S$ qua gương phẳng là điểm $S\'$ **đối xứng với $S$ qua mặt phẳng gương** ($SI = S\'I$ và $SS\' \\perp \\text{gương}$).\n• Ảnh ảo vẽ bằng **nét đứt** và có độ lớn bằng vật thật.'
      }
    ],
    keyFormulas: [
      'i\' = i; \\quad S\\text{ và }S\'\\text{ đối xứng nhau qua gương phẳng}'
    ],
    ...SIM_PRESETS.plane_mirror,
    practiceExercises: [
      {
        source: SRC_2006_7,
        question: 'Chiếu một tia sáng vuông góc với mặt gương phẳng. Giá trị của góc tới $i$ và góc phản xạ $i\'$ là:',
        options: ['A. $90^\\circ$', 'B. $45^\\circ$', 'C. $0^\\circ$', 'D. $180^\\circ$'],
        correctIndex: 2,
        explanation: 'Tia tới trùng với đường pháp tuyến nên góc hợp bởi tia tới và pháp tuyến bằng $0^\\circ$.'
      },
      {
        source: SRC_2006_7,
        question: 'Mũi tên $AB$ cao $4\\text{ cm}$ đặt song song trước gương phẳng và cách gương $15\\text{ cm}$. Ảnh $A\'B\'$ có chiều cao và cách mũi tên $AB$ bao xa?',
        options: [
          'A. Cao $4\\text{ cm}$, cách $AB$ $15\\text{ cm}$',
          'B. Cao $4\\text{ cm}$, cách $AB$ $30\\text{ cm}$',
          'C. Cao $8\\text{ cm}$, cách $AB$ $30\\text{ cm}$',
          'D. Cao $2\\text{ cm}$, cách $AB$ $15\\text{ cm}$'
        ],
        correctIndex: 1,
        explanation: 'Ảnh cao bằng vật ($4\\text{ cm}$) và cách gương $15\\text{ cm}$ nên khoảng cách giữa vật và ảnh là $15 + 15 = 30\\text{ cm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_7,
        question: 'Một tia sáng tới gương phẳng cho tia phản xạ hợp với tia tới một góc bằng $100^\\circ$. Tính góc tới $i$, góc phản xạ $i\'$ và góc hợp bởi tia tới với mặt gương.',
        hints: ['Góc giữa tia tới và tia phản xạ bằng $i + i\' = 100^\\circ$.'],
        solutionSteps: [
          'Theo định luật phản xạ: $i = i\' = \\frac{100^\\circ}{2} = 50^\\circ$.',
          'Góc giữa tia tới và mặt gương: $\\alpha = 90^\\circ - 50^\\circ = 40^\\circ$.'
        ],
        finalAnswer: '$i = i\' = 50^\\circ$; góc với mặt gương bằng $40^\\circ$.'
      }
    ]
  },
  {
    id: 'phys-2006-7-3',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'Vật lí 7 (SGK 2006) · Quang học',
    sourceTag: SRC_2006_7,
    lessonNumber: 3,
    title: 'Bài 3 (SGK 2006): Gương cầu lồi & Gương cầu lõm',
    subtitle: 'So sánh vùng nhìn thấy & kích thước ảnh của Gương phẳng – Gương cầu lồi – Gương cầu lõm',
    description:
      'Phân biệt rõ đặc điểm ảnh ảo qua cả 3 loại gương trong SGK Vật lí 7 (2006) và ứng dụng vào gương chiếu hậu ô tô, đèn pha và gương trang điểm.',
    theorySections: [
      {
        heading: '1. Gương cầu lồi — Vùng nhìn thấy siêu rộng',
        content:
          '• Mặt phản xạ uốn cong **lồi ra ngoài**.\n• Cho ảnh ảo **NHỎ HƠN VẬT**, nhưng bù lại có **vùng nhìn thấy RỘNG HƠN HẲN** so với gương phẳng cùng kích thước.\n• **Ứng dụng**: Lắp làm **gương chiếu hậu** xe máy/ô tô và đặt ở **khúc cua đường đèo hẹp**.'
      },
      {
        heading: '2. Gương cầu lõm — Phóng đại gần & Hội tụ xa',
        content:
          '• Mặt phản xạ uốn **lõm vào trong**.\n• Khi đặt vật sát gương: cho ảnh ảo **LỚN HƠN VẬT** (dùng làm **gương nha khoa**, gương trang điểm).\n• Khi chiếu chùm sáng Mặt Trời song song tới gương: chùm tia phản xạ **hội tụ tại một điểm cực nóng** (bếp Mặt Trời, chóa đèn pha).'
      }
    ],
    keyFormulas: [
      '\\text{Gương lồi: Ảnh ảo } < \\text{ Vật (vùng nhìn RỘNG)}',
      '\\text{Gương lõm (vật gần): Ảnh ảo } > \\text{ Vật (hội tụ tia song song)}'
    ],
    ...SIM_PRESETS.lens_single,
    practiceExercises: [
      {
        source: SRC_2006_7,
        question: 'Đặt một cây nến trước cả 3 gương: gương phẳng, gương cầu lồi và gương cầu lõm (đặt sát). Gương nào cho ảnh ảo LỚN HƠN vật?',
        options: ['A. Gương phẳng', 'B. Gương cầu lồi', 'C. Gương cầu lõm', 'D. Cả 3 gương'],
        correctIndex: 2,
        explanation: 'Gương cầu lõm đặt sát vật cho ảnh ảo lớn hơn vật; gương phẳng bằng vật; gương cầu lồi nhỏ hơn vật.'
      },
      {
        source: SRC_2006_7,
        question: 'Trong chóa đèn pin hay đèn pha ô tô có gương phản xạ hình gì để biến ánh sáng bóng đèn thành chùm sáng song song chiếu thật xa?',
        options: ['A. Gương phẳng', 'B. Gương cầu lồi', 'C. Gương cầu lõm (parabol)', 'D. Tấm kính mờ'],
        correctIndex: 2,
        explanation: 'Đặt bóng đèn tại tiêu điểm gương cầu lõm giúp chùm tia phản xạ đi thành chùm song song chiếu xa.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_7,
        question: 'So sánh hai điểm khác biệt chính giữa Gương cầu lồi và Gương phẳng có cùng đường kính mặt gương.',
        hints: ['So sánh về kích thước ảnh ảo và độ rộng vùng nhìn thấy.'],
        solutionSteps: [
          '1. Kích thước ảnh ảo: Gương phẳng cho ảnh lớn bằng vật; Gương cầu lồi cho ảnh nhỏ hơn vật.',
          '2. Vùng nhìn thấy: Gương cầu lồi cho vùng nhìn thấy rộng hơn nhiều so với gương phẳng cùng kích thước.'
        ],
        finalAnswer: 'Gương cầu lồi cho ảnh nhỏ hơn vật nhưng vùng nhìn rộng hơn gương phẳng.'
      }
    ]
  },
  {
    id: 'phys-2006-7-4',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'Vật lí 7 (SGK 2006) · Âm học',
    sourceTag: SRC_2006_7,
    lessonNumber: 4,
    title: 'Bài 4 (SGK 2006): Nguồn âm, Độ cao (Hz), Độ to (dB) & Tiếng vang',
    subtitle: 'Chương II Âm học SGK 7: Tần số dao động, ngưỡng nghe 20–20.000 Hz, độ to biên độ và chống tiếng ồn',
    description:
      'Học đầy đủ Âm học SGK Vật lí 7 (2006): chứng minh nguồn âm luôn dao động, phân biệt hạ âm – âm nghe được – siêu âm và cách tính khoảng cách nhờ tiếng vang.',
    theorySections: [
      {
        heading: '1. Tần số (Hz) & Ngưỡng nghe của tai người',
        content:
          '• **Tần số ($f$)** = số dao động trong $1\\text{ giây}$. Tần số càng lớn $\\to$ âm càng **bổng (cao)**.\n• Tai người chỉ nghe được âm có tần số từ **$20\\text{ Hz}$ đến $20\\,000\\text{ Hz}$**. Dưới $20\\text{ Hz}$ là **hạ âm**; trên $20\\,000\\text{ Hz}$ là **siêu âm**.'
      },
      {
        heading: '2. Biên độ, Độ to (dB) & Môi trường truyền âm',
        content:
          '• **Biên độ dao động** càng lớn $\\to$ âm càng **to** (đo bằng $\\text{dB}$). Tiếng ồn trên $70\\text{ dB}$ gây hại tai.\n• Âm truyền nhanh nhất trong **Rắn > Lỏng > Khí** và **không truyền qua chân không**.'
      }
    ],
    keyFormulas: [
      'f = \\frac{\\text{Số dao động}}{t\\text{ (s)}} \\quad (\\text{Hz})',
      '20\\text{ Hz} \\le f_{\\text{nghe}} \\le 20\\,000\\text{ Hz}'
    ],
    ...SIM_PRESETS.sound_intensity,
    practiceExercises: [
      {
        source: SRC_2006_7,
        question: 'Tai người bình thường nghe được âm có tần số nào sau đây?',
        options: ['A. $10\\text{ Hz}$ (hạ âm)', 'B. $1000\\text{ Hz}$', 'C. $35\\,000\\text{ Hz}$ (siêu âm)', 'D. $50\\,000\\text{ Hz}$'],
        correctIndex: 1,
        explanation: '$1000\\text{ Hz}$ nằm trong khoảng nghe được $20\\text{ Hz} \\to 20\\,000\\text{ Hz}$.'
      },
      {
        source: SRC_2006_7,
        question: 'Trong phòng kín nhỏ, ta thường KHÔNG nghe được tiếng vang rõ rệt vì:',
        options: [
          'A. Âm phản xạ từ tường về tai nhanh hơn $1/15\\text{ giây}$ nên hòa lẫn vào âm trực tiếp',
          'B. Tường phòng không phản xạ âm',
          'C. Âm không truyền qua không khí trong phòng',
          'D. Tần số âm giảm xuống $0$'
        ],
        correctIndex: 0,
        explanation: 'Để tai phân biệt tiếng vang, khoảng cách tới vật phản xạ cần ít nhất khoảng $11{,}3\\text{ m}$ ($\\Delta t \\ge 1/15\\text{ s}$).'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_7,
        question: 'Một con lắc thực hiện $1800$ dao động trong $1\\text{ phút}$. Tính tần số dao động của con lắc và cho biết tai người có nghe được âm này không?',
        hints: ['Đổi $1\\text{ phút} = 60\\text{ s}$.'],
        solutionSteps: [
          'Tần số: $f = \\frac{1800}{60} = 30\\text{ Hz}$.',
          'Vì $20\\text{ Hz} \\le 30\\text{ Hz} \\le 20\\,000\\text{ Hz}$ nên tai người nghe được (âm rất trầm).'
        ],
        finalAnswer: '$f = 30\\text{ Hz}$; tai người nghe được.'
      }
    ]
  },
  {
    id: 'phys-2006-7-5',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'Vật lí 7 (SGK 2006) · Điện học',
    sourceTag: SRC_2006_7,
    lessonNumber: 5,
    title: 'Bài 5 (SGK 2006): Nhiễm điện cọ xát, Dòng điện & Chất dẫn điện – cách điện',
    subtitle: 'Sơ lược cấu tạo nguyên tử mang điện, chiều dòng điện trong kim loại (electron tự do) và sơ đồ mạch điện',
    description:
      'Học phần đầu Chương III Điện học SGK Vật lí 7 (2006): giải thích nhiễm điện bằng mô hình hạt nhân (+) và electron (-), chiều dịch chuyển ngược chiều quy ước của electron.',
    theorySections: [
      {
        heading: '1. Cấu tạo nguyên tử & Nhiễm điện do cọ xát',
        content:
          '• Ở tâm mỗi nguyên tử có **hạt nhân mang điện dương ($+$)**, xung quanh có các **electron mang điện âm ($-$)** chuyển động.\n• Khi cọ xát, chỉ có các **electron** di chuyển từ vật này sang vật khác (mất $e$ thành dương, nhận $e$ thành âm).'
      },
      {
        heading: '2. Dòng điện trong kim loại & Chất dẫn điện',
        content:
          '• Kim loại dẫn điện tốt nhờ có rất nhiều **electron tự do**.\n• Chiều **dòng điện quy ước** đi từ cực dương $(+)$ qua dây dẫn tới cực âm $(-)$, **NGƯỢC CHIỀU** với chiều chạy thực của các electron tự do!'
      }
    ],
    keyFormulas: [
      '\\text{Chiều dòng điện quy ước: } (+) \\to (-)',
      '\\text{Chiều electron tự do trong kim loại: } (-) \\to (+)'
    ],
    ...SIM_PRESETS.coulomb,
    practiceExercises: [
      {
        source: SRC_2006_7,
        question: 'Dòng điện trong dây dẫn kim loại là dòng chuyển dời có hướng của hạt nào?',
        options: ['A. Các hạt nhân nguyên tử', 'B. Các electron tự do', 'C. Các phân tử khí', 'D. Các proton'],
        correctIndex: 1,
        explanation: 'Hạt nhân nằm yên tại chỗ; chỉ các electron tự do mang điện âm dịch chuyển tạo dòng điện trong kim loại.'
      },
      {
        source: SRC_2006_7,
        question: 'Đưa một thanh nhựa nhiễm điện âm lại gần quả cầu bấc treo nhẹ đang nhiễm điện âm. Hiện tượng gì xảy ra?',
        options: ['A. Hút nhau mạnh', 'B. Đẩy nhau ra xa', 'C. Đứng yên bất động', 'D. Phát sáng'],
        correctIndex: 1,
        explanation: 'Hai vật nhiễm điện cùng dấu (cùng âm) luôn đẩy nhau.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_7,
        question: 'Đưa thanh thủy tinh cọ xát vào lụa (nhiễm điện dương) lại gần một mảnh giấy vụn không nhiễm điện, thấy thanh thủy tinh hút mạnh mảnh giấy. Có mâu thuẫn không? Vì sao?',
        hints: ['Vật bị nhiễm điện có khả năng hút các vật nhỏ nhẹ dù vật nhẹ đó chưa nhiễm điện.'],
        solutionSteps: [
          'Không hề mâu thuẫn. Mọi vật bị nhiễm điện (dương hay âm) đều có khả năng hút các vật nhẹ không nhiễm điện.'
        ],
        finalAnswer: 'Vật nhiễm điện bất kì đều hút được các vật nhỏ nhẹ.'
      }
    ]
  },
  {
    id: 'phys-2006-7-6',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'Vật lí 7 (SGK 2006) · Mạch điện & Dòng điện',
    sourceTag: SRC_2006_7,
    lessonNumber: 6,
    title: 'Bài 6 (SGK 2006): 5 Tác dụng dòng điện, Đo $I$ – $U$ & Mạch nối tiếp – song song',
    subtitle: 'Quy luật cường độ dòng điện và hiệu điện thế trong hai kiểu mắc mạch cơ bản cùng 5 tác dụng dòng điện',
    description:
      'Hoàn thiện toàn bộ chương trình Vật lí 7 (SGK 2006) với 5 tác dụng dòng điện, kĩ năng đọc thang đo Ampe kế – Vôn kế và bài toán mạch 2 đèn.',
    theorySections: [
      {
        heading: '1. Năm tác dụng của dòng điện (SGK 7 2006)',
        content:
          '• **Nhiệt** (bếp điện, bàn là), **Phát sáng** (đèn LED, bút thử điện), **Từ** (chuông điện, nam châm điện), **Hóa học** (mạ điện), **Sinh lí** (giật cơ tim, châm cứu điện).'
      },
      {
        heading: '2. Cường độ $I$ & Hiệu điện thế $U$ trong 2 kiểu mạch',
        content:
          '• **Đoạn mạch mắc NỐI TIẾP**: $I = I_1 = I_2$ và $U = U_1 + U_2$.\n• **Đoạn mạch mắc SONG SONG**: $I = I_1 + I_2$ và $U = U_1 = U_2$.'
      }
    ],
    keyFormulas: [
      '\\text{Nối tiếp: } I = I_1 = I_2; \\quad U = U_1 + U_2',
      '\\text{Song song: } I = I_1 + I_2; \\quad U = U_1 = U_2'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_2006_7,
        question: 'Trong mạch điện gồm hai bóng đèn mắc NỐI TIẾP, biết $I_1 = 0{,}35\\text{ A}$, hiệu điện thế hai đèn lần lượt $U_1 = 2{,}5\\text{ V}$ và $U_2 = 3{,}5\\text{ V}$. Cường độ dòng điện qua đèn 2 và hiệu điện thế cả mạch là:',
        options: ['A. $0{,}35\\text{ A}$ và $6\\text{ V}$', 'B. $0{,}7\\text{ A}$ và $6\\text{ V}$', 'C. $0{,}35\\text{ A}$ và $1{,}0\\text{ V}$', 'D. $0{,}175\\text{ A}$ và $3\\text{ V}$'],
        correctIndex: 0,
        explanation: 'Mạch nối tiếp: $I_2 = I_1 = 0{,}35\\text{ A}$; $U = U_1 + U_2 = 2{,}5 + 3{,}5 = 6\\text{ V}$.'
      },
      {
        source: SRC_2006_7,
        question: 'Bút thử điện phát sáng nhờ tác dụng nào của dòng điện?',
        options: ['A. Tác dụng từ', 'B. Tác dụng hóa học', 'C. Tác dụng phát sáng (của bóng đèn neon)', 'D. Tác dụng sinh lí'],
        correctIndex: 2,
        explanation: 'Bóng đèn neon nhỏ trong bút thử điện phát sáng ngay cả với dòng điện rất nhỏ.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_7,
        question: 'Hai bóng đèn $Đ_1$ và $Đ_2$ mắc song song vào nguồn $12\\text{ V}$. Ampe kế mạch chính chỉ $1{,}1\\text{ A}$, Ampe kế nhánh $Đ_1$ chỉ $0{,}45\\text{ A}$. Tính $U_1, U_2$ và $I_2$.',
        hints: ['Mạch song song có $U_1 = U_2 = U$ và $I = I_1 + I_2$.'],
        solutionSteps: [
          'Hiệu điện thế mỗi nhánh: $U_1 = U_2 = 12\\text{ V}$.',
          'Cường độ dòng điện nhánh đèn 2: $I_2 = I - I_1 = 1{,}1 - 0{,}45 = 0{,}65\\text{ A}$.'
        ],
        finalAnswer: '$U_1 = U_2 = 12\\text{ V}$; $I_2 = 0{,}65\\text{ A}$.'
      }
    ]
  },

  // ==========================================================================
  // LỚP 8 — GDPT 2006 (SGK VẬT LÍ 8 · 6 BÀI ĐẦY ĐỦ)
  // ==========================================================================
  {
    id: 'phys-2006-8-1',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'Vật lí 8 (SGK 2006) · Cơ học',
    sourceTag: SRC_2006_8,
    lessonNumber: 1,
    title: 'Bài 1 (SGK 2006): Chuyển động cơ học, Tính tương đối & Vận tốc trung bình',
    subtitle: 'Hành khách đứng yên so với tàu nhưng chuyển động so với cây bên đường, và công thức v_tb = (s₁+s₂)/(t₁+t₂)',
    description:
      'Học phần mở đầu SGK Vật lí 8 (2006): tính tương đối của chuyển động và bài toán kinh điển tính vận tốc trung bình trên 2 chặng đường.',
    theorySections: [
      {
        heading: '1. Tính tương đối của chuyển động & Vật mốc',
        content:
          '• Sự thay đổi vị trí của vật theo thời gian so với vật khác gọi là **chuyển động cơ học**.\n• Một vật có thể **đứng yên** so với vật mốc này nhưng lại **chuyển động** so với vật mốc khác.'
      },
      {
        heading: '2. Vận tốc đều & Vận tốc trung bình',
        content:
          '• **Cảnh báo bẫy hay sai nhất**: Vận tốc trung bình trên 2 chặng **KHÔNG BAO GIỜ** bằng trung bình cộng $\\frac{v_1 + v_2}{2}$! Phải lấy **TỔNG quãng đường chia TỔNG thời gian**: $v_{\\text{tb}} = \\frac{s_1 + s_2}{t_1 + t_2}$.'
      }
    ],
    keyFormulas: [
      'v = \\frac{s}{t}; \\quad v_{\\text{tb}} = \\frac{s_1 + s_2}{t_1 + t_2}'
    ],
    ...SIM_PRESETS.kinematics,
    practiceExercises: [
      {
        source: SRC_2006_8,
        question: 'Người lái đò đang ngồi yên trên chiếc thuyền thả trôi theo dòng nước. Người lái đò đứng yên so với vật mốc nào?',
        options: ['A. Bờ sông', 'B. Dòng nước và chiếc thuyền', 'C. Cây đa ven sông', 'D. Cầu bắc qua sông'],
        correctIndex: 1,
        explanation: 'Vị trí người lái đò không đổi so với thuyền và dòng nước trôi cùng tốc độ.'
      },
      {
        source: SRC_2006_8,
        question: 'Một xe máy chạy nửa đoạn đường đầu tốc độ $30\\text{ km/h}$, nửa đoạn đường sau tốc độ $60\\text{ km/h}$. Vận tốc trung bình trên cả đoạn đường là:',
        options: ['A. $45\\text{ km/h}$', 'B. $40\\text{ km/h}$', 'C. $50\\text{ km/h}$', 'D. $42\\text{ km/h}$'],
        correctIndex: 1,
        explanation: '$v_{\\text{tb}} = \\frac{2 \\cdot 30 \\cdot 60}{30 + 60} = 40\\text{ km/h}$ (không phải $45$!).'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_8,
        question: 'Một người đi xe đạp xuống một cái dốc dài $120\\text{ m}$ hết $30\\text{ s}$, sau đó đi tiếp đoạn đường bằng phẳng dài $60\\text{ m}$ hết $24\\text{ s}$. Tính vận tốc trung bình mỗi đoạn và trên cả quãng đường.',
        hints: ['Tính $v_1 = 120/30$, $v_2 = 60/24$, rồi $v_{\\text{tb}} = (120 + 60)/(30 + 24)$.'],
        solutionSteps: [
          '$v_1 = \\frac{120}{30} = 4\\text{ m/s}$; $v_2 = \\frac{60}{24} = 2{,}5\\text{ m/s}$.',
          'Trên cả quãng đường: $v_{\\text{tb}} = \\frac{120 + 60}{30 + 24} = \\frac{180}{54} \\approx 3{,}33\\text{ m/s}$.'
        ],
        finalAnswer: '$v_1 = 4\\text{ m/s}$, $v_2 = 2{,}5\\text{ m/s}$, $v_{\\text{tb}} \\approx 3{,}33\\text{ m/s}$.'
      }
    ]
  },
  {
    id: 'phys-2006-8-2',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'Vật lí 8 (SGK 2006) · Lực & Quán tính',
    sourceTag: SRC_2006_8,
    lessonNumber: 2,
    title: 'Bài 2 (SGK 2006): Biểu diễn lực, Lực quán tính & Lực ma sát',
    subtitle: 'Vẽ vectơ lực theo tỉ xích, giải thích xe phanh gấp khách chúi về trước và giảm ma sát có hại',
    description:
      'Làm chủ cách vẽ vectơ lực chuẩn SGK Vật lí 8 (2006), bản chất Quán tính giữ nguyên trạng thái chuyển động và 3 loại lực ma sát.',
    theorySections: [
      {
        heading: '1. Biểu diễn lực & Quán tính',
        content:
          '• Lực là đại lượng **vectơ** ($\\vec{F}$) biểu diễn bằng mũi tên có gốc tại điểm đặt, hướng là chiều lực và độ dài tỉ lệ theo xích.\n• **Quán tính**: Mọi vật có xu hướng bảo toàn vận tốc nên **KHÔNG THỂ thay đổi vận tốc đột ngột tức thì** (xe phanh gấp $\\to$ người lao về trước).'
      },
      {
        heading: '2. Ma sát trượt – lăn – nghỉ',
        content:
          '• Để giảm ma sát trượt cản trở chuyển động ở ổ trục, dùng **ổ bi** (chuyển thành ma sát lăn) và **bôi trơn**.\n• Để tăng ma sát có lợi (bám đường, phanh xe, leo dốc), làm tăng độ nhám mặt tiếp xúc.'
      }
    ],
    keyFormulas: [
      '\\text{Vectơ lực } \\vec{F}: \\text{Điểm đặt, Phương–Chiều, Độ lớn}',
      '\\text{Quán tính} \\implies \\text{Vận tốc không đổi đột ngột}'
    ],
    ...SIM_PRESETS.inclined,
    practiceExercises: [
      {
        source: SRC_2006_8,
        question: 'Khi ô tô đang chạy nhanh bỗng rẽ ngoặt gấp sang TRÁI, hành khách ngồi trên xe bị nghiêng về phía nào do quán tính?',
        options: ['A. Nghiêng sang TRÁI', 'B. Nghiêng sang PHẢI', 'C. Lao thẳng về sau', 'D. Không bị nghiêng'],
        correctIndex: 1,
        explanation: 'Do quán tính, phần thân trên tiếp tục lao thẳng theo hướng cũ nên bị nghiêng văng sang phía PHẢI so với thân xe.'
      },
      {
        source: SRC_2006_8,
        question: 'Một đầu tàu hỏa kéo đoàn tàu lực $50\\,000\\text{ N}$ theo phương ngang sang phải. Chọn tỉ xích $1\\text{ cm} = 10\\,000\\text{ N}$, vectơ lực vẽ dài bao nhiêu cm?',
        options: ['A. $2\\text{ cm}$', 'B. $5\\text{ cm}$', 'C. $10\\text{ cm}$', 'D. $0{,}5\\text{ cm}$'],
        correctIndex: 1,
        explanation: '$\\frac{50\\,000}{10\\,000} = 5\\text{ cm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_8,
        question: 'Giải thích vì sao khi vẩy mạnh chiếc nhiệt kế y tế hoặc giũ mạnh quần áo ướt thì cột thủy ngân tụt xuống và các giọt nước văng ra khỏi áo?',
        hints: ['Khi tay dừng đột ngột, thủy ngân và giọt nước tiếp tục chuyển động theo quán tính.'],
        solutionSteps: [
          'Khi vẩy tay xuống rồi dừng lại đột ngột, vỏ nhiệt kế (hoặc vải áo) dừng lại theo tay.',
          'Theo quán tính, thủy ngân và giọt nước tiếp tục lao đi theo hướng cũ nên tụt xuống bầu hoặc văng khỏi mặt vải.'
        ],
        finalAnswer: 'Do quán tính, thủy ngân và giọt nước tiếp tục chuyển động khi vỏ dừng đột ngột.'
      }
    ]
  },
  {
    id: 'phys-2006-8-3',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'Vật lí 8 (SGK 2006) · Áp suất & Thủy lực',
    sourceTag: SRC_2006_8,
    lessonNumber: 3,
    title: 'Bài 3 (SGK 2006): Áp suất chất rắn, Áp suất chất lỏng, Bình thông nhau & Máy ép thủy lực',
    subtitle: 'Công thức p = F/S, p = d·h, nguyên lí Pascal truyền áp suất nguyên vẹn trong máy kích nâng ô tô',
    description:
      'Nắm trọn chuyên đề Áp suất SGK Vật lí 8 (2006): từ áp suất chân ghế lên sàn nhà, bình thông nhau hai nhánh tới máy nén thủy lực nâng xe hơi.',
    theorySections: [
      {
        heading: '1. Áp suất chất rắn ($p = F/S$) & Áp suất chất lỏng ($p = d \\cdot h$)',
        content:
          '• **Áp lực** là lực ép có phương **vuông góc** với mặt bị ép.\n• Chất lỏng gây áp suất $p = d \\cdot h$ tại mọi điểm có cùng độ sâu $h$ tính từ mặt thoáng xuống.'
      },
      {
        heading: '2. Bình thông nhau & Máy ép thủy lực (Pascal)',
        content:
          '• Áp suất tác dụng lên chất lỏng kín được **truyền đi nguyên vẹn theo mọi hướng**.\n• Trong **máy ép thủy lực** gồm 2 pít-tông diện tích $s$ (nhỏ) và $S$ (lớn): $\\frac{F}{f} = \\frac{S}{s}$. Nếu pít-tông lớn rộng gấp $100$ lần pít-tông nhỏ thì lực nâng tăng gấp **$100$ lần**!'
      }
    ],
    keyFormulas: [
      'p = \\frac{F}{S}; \\quad p = d \\cdot h',
      '\\frac{F}{f} = \\frac{S}{s} \\quad (\\text{Máy nén thủy lực})'
    ],
    ...SIM_PRESETS.fluid_pressure,
    practiceExercises: [
      {
        source: SRC_2006_8,
        question: 'Trong một máy kích thủy lực nâng xe ô tô, diện tích pít-tông lớn gấp $80$ lần diện tích pít-tông nhỏ ($S = 80s$). Ấn pít-tông nhỏ một lực $f = 150\\text{ N}$ thì pít-tông lớn nâng được lực tối đa:',
        options: ['A. $1200\\text{ N}$', 'B. $12\\,000\\text{ N}$', 'C. $150\\text{ N}$', 'D. $8000\\text{ N}$'],
        correctIndex: 1,
        explanation: '$F = f \\cdot \\frac{S}{s} = 150 \\cdot 80 = 12\\,000\\text{ N}$ ($1{,}2\\text{ tấn}$).'
      },
      {
        source: SRC_2006_8,
        question: 'Ở một đập thủy điện, tại sao thân đập xây ở dưới ĐÁY dày hơn rất nhiều so với mặt đập phía trên?',
        options: [
          'A. Vì áp suất nước $p = d \\cdot h$ càng xuống sâu càng cực lớn',
          'B. Vì đá ở dưới đáy rẻ hơn',
          'C. Để giảm áp suất khí quyển',
          'D. Cho đẹp kiến trúc'
        ],
        correctIndex: 0,
        explanation: 'Áp suất nước tỉ lệ thuận với độ sâu $h$, nên chân đập phải cực dày để chịu áp lực nước khủng khiếp.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_8,
        question: 'Một tàu ngầm lặn xuống độ sâu $150\\text{ m}$ dưới mặt biển (trọng lượng riêng nước biển $d = 10\\,300\\text{ N/m}^3$). Tính áp suất nước biển tác dụng lên vỏ tàu và lực ép lên một ô cửa kính tròn diện tích $0{,}04\\text{ m}^2$.',
        hints: ['Tính $p = d \\cdot h$, sau đó suy ra lực $F = p \\cdot S$.'],
        solutionSteps: [
          'Áp suất nước biển ở độ sâu $150\\text{ m}$: $p = 10\\,300 \\cdot 150 = 1\\,545\\,000\\text{ Pa}$.',
          'Lực ép lên cửa kính: $F = p \\cdot S = 1\\,545\\,000 \\cdot 0{,}04 = 61\\,800\\text{ N}$.'
        ],
        finalAnswer: '$p = 1\\,545\\,000\\text{ Pa}$; $F = 61\\,800\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-2006-8-4',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'Vật lí 8 (SGK 2006) · Ác-si-mét',
    sourceTag: SRC_2006_8,
    lessonNumber: 4,
    title: 'Bài 4 (SGK 2006): Lực đẩy Ác-si-mét & Sự nổi của vật ($F_A$ vs $P$)',
    subtitle: 'Giải bài toán lực kế nhúng nước – dầu, xác định tỉ lệ thể tích nổi/chìm và nguyên lí tàu ngầm',
    description:
      'Chuyên sâu bài tập Lực đẩy Ác-si-mét SGK Vật lí 8 (2006): tính thể tích vật từ độ sụt lực kế, vật nổi cân bằng trên mặt chất lỏng và tàu ngầm thay đổi trọng lượng.',
    theorySections: [
      {
        heading: '1. Công thức Ác-si-mét & Cách xác định $V_{\\text{vật}}$',
        content:
          '• $F_A = d \\cdot V$ ($d$: trọng lượng riêng chất lỏng $\\text{N/m}^3$, $V$: thể tích phần chất lỏng bị chiếm chỗ $\\text{m}^3$).\n• Nếu treo vật vào lực kế thấy ngoài không khí nặng $P$, nhúng ngập nước còn $F_{\\text{nước}}$ thì **$V = \\frac{P - F_{\\text{nước}}}{d_{\\text{nước}}}$**.'
      },
      {
        heading: '2. Điều kiện định tính & định lượng khi vật nổi',
        content:
          '• Vật nổi trên mặt thoáng thì trọng lượng riêng trung bình của vật nhỏ hơn chất lỏng ($d_{\\text{vật}} < d_{\\text{lỏng}}$).\n• Khi nằm yên nổi trên mặt nước: **$F_A = P$**, tức $d_{\\text{lỏng}} \\cdot V_{\\text{chìm}} = d_{\\text{vật}} \\cdot V_{\\text{vật}}$.'
      }
    ],
    keyFormulas: [
      'F_A = d \\cdot V_{\\text{chìm}}',
      '\\frac{V_{\\text{chìm}}}{V_{\\text{vật}}} = \\frac{d_{\\text{vật}}}{d_{\\text{lỏng}}} \\quad (\\text{khi nổi cân bằng})'
    ],
    ...SIM_PRESETS.archimedes,
    practiceExercises: [
      {
        source: SRC_2006_8,
        question: 'Một tảng băng ($D_{\\text{băng}} = 900\\text{ kg/m}^3$) trôi nổi trên biển ($D_{\\text{nước biển}} = 1000\\text{ kg/m}^3$). Bao nhiêu phần trăm thể tích tảng băng bị chìm dưới nước?',
        options: ['A. $10\\%$', 'B. $50\\%$', 'C. $90\\%$', 'D. $100\\%$'],
        correctIndex: 2,
        explanation: '$\\frac{V_{\\text{chìm}}}{V} = \\frac{900}{1000} = 90\\%$ (chỉ có $10\\%$ phần nổi nhô lên!).'
      },
      {
        source: SRC_2006_8,
        question: 'Thủy thủ muốn cho tàu ngầm đang lặn dưới biển nổi lên mặt nước cần làm gì?',
        options: [
          'A. Bơm thêm nước biển vào các khoang chứa dằn',
          'B. Dùng khí nén đẩy bớt nước trong các khoang chứa dằn ra ngoài cho trọng lượng tàu nhẹ đi ($P < F_A$)',
          'C. Tắt động cơ hoàn toàn',
          'D. Tăng thể tích tàu bằng cách mở cửa'
        ],
        correctIndex: 1,
        explanation: 'Thể tích vỏ tàu không đổi nên $F_A$ giữ nguyên; đẩy nước ra khỏi khoang làm giảm $P$ để $P < F_A$, tàu nổi lên.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_8,
        question: 'Móc một vật kim loại vào lực kế, ngoài không khí lực kế chỉ $7{,}8\\text{ N}$, nhúng chìm hoàn toàn vào nước ($d = 10\\,000\\text{ N/m}^3$) thì lực kế chỉ $6{,}8\\text{ N}$. Tính thể tích và trọng lượng riêng của vật kim loại đó.',
        hints: ['Tính $F_A = 7{,}8 - 6{,}8 = 1\\text{ N}$, suy ra $V = F_A / 10\\,000$.'],
        solutionSteps: [
          'Lực đẩy Ác-si-mét: $F_A = 7{,}8 - 6{,}8 = 1\\text{ N}$.',
          'Thể tích vật: $V = \\frac{F_A}{d_{\\text{nước}}} = \\frac{1}{10\\,000} = 0{,}0001\\text{ m}^3$ ($100\\text{ cm}^3$).',
          'Trọng lượng riêng vật: $d_{\\text{vật}} = \\frac{P}{V} = \\frac{7{,}8}{0{,}0001} = 78\\,000\\text{ N/m}^3$ (đây là Sắt!).'
        ],
        finalAnswer: '$V = 100\\text{ cm}^3$; $d = 78\\,000\\text{ N/m}^3$.'
      }
    ]
  },
  {
    id: 'phys-2006-8-5',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'Vật lí 8 (SGK 2006) · Công & Cơ năng',
    sourceTag: SRC_2006_8,
    lessonNumber: 5,
    title: 'Bài 5 (SGK 2006): Công cơ học, Định luật về Công, Công suất & Cơ năng',
    subtitle: 'Khi nào có công cơ học (A = F·s), hiệu suất máy cơ, công suất P = A/t (Watt) và Động năng – Thế năng',
    description:
      'Làm chủ toàn bộ phần Công & Năng lượng SGK Vật lí 8 (2006): điều kiện sinh công cơ học, không có máy cơ nào lợi về công, tính công suất máy bơm và chuyển hóa cơ năng.',
    theorySections: [
      {
        heading: '1. Công cơ học ($A = F \\cdot s$) & Định luật về Công',
        content:
          '• Chỉ có **công cơ học** khi có lực tác dụng lên vật **làm vật dịch chuyển theo phương không vuông góc với lực** (nâng tạ giữ đứng yên tuy rất mỏi nhưng **công cơ học bằng $0$**!).\n• **Định luật về Công**: Không máy cơ đơn giản nào cho lợi về công; được lợi bao nhiêu lần về lực thì thiệt bấy nhiêu lần về đường đi.'
      },
      {
        heading: '2. Công suất ($\\mathcal{P} = A/t$) & Cơ năng',
        content:
          '• **Công suất** đo bằng công thực hiện trong $1$ giây: $\\mathcal{P} = \\frac{A}{t}$ (đơn vị **Oát — W**, $1\\text{ kW} = 1000\\text{ W}$).\n• **Cơ năng = Động năng + Thế năng** (bảo toàn khi bỏ qua ma sát).'
      }
    ],
    keyFormulas: [
      'A = F \\cdot s\\ (\\text{J}); \\quad \\mathcal{P} = \\frac{A}{t} = F \\cdot v\\ (\\text{W})',
      'H = \\frac{A_{\\text{có ích}}}{A_{\\text{toàn phần}}} \\cdot 100\\%'
    ],
    ...SIM_PRESETS.work_power,
    practiceExercises: [
      {
        source: SRC_2006_8,
        question: 'Trường hợp nào sau đây KHÔNG có công cơ học của trọng lực?',
        options: [
          'A. Quả táo rơi từ cành cây xuống đất',
          'B. Xe ô tô chạy thẳng đều trên mặt đường NẰM NGANG',
          'C. Học sinh leo cầu thang lên tầng 3',
          'D. Thác nước đổ từ đỉnh núi xuống'
        ],
        correctIndex: 1,
        explanation: 'Trọng lực hướng thẳng đứng xuống dưới vuông góc với phương nằm ngang chuyển động của xe nên công trọng lực bằng $0$.'
      },
      {
        source: SRC_2006_8,
        question: 'Một đầu máy kéo toa tàu chuyển động đều với vận tốc $10\\text{ m/s}$ bằng lực kéo $40\\,000\\text{ N}$. Công suất của đầu máy là:',
        options: ['A. $4000\\text{ W}$', 'B. $40\\text{ kW}$', 'C. $400\\text{ kW}$', 'D. $4\\text{ MW}$'],
        correctIndex: 2,
        explanation: '$\\mathcal{P} = F \\cdot v = 40\\,000 \\cdot 10 = 400\\,000\\text{ W} = 400\\text{ kW}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_8,
        question: 'Một máy bơm mỗi phút bơm được $600\\text{ lít}$ nước ($600\\text{ kg}$) lên bồn cao $10\\text{ m}$ với hiệu suất $80\\%$. Tính công có ích, công toàn phần trong 1 phút và công suất máy bơm.',
        hints: ['Tính $A_i = P \\cdot h = 6000 \\cdot 10 = 60\\,000\\text{ J}$, rồi $A_{\\text{tp}} = A_i / 0{,}8$.'],
        solutionSteps: [
          'Trọng lượng nước: $P = 10 \\cdot 600 = 6000\\text{ N}$. Công có ích: $A_i = 6000 \\cdot 10 = 60\\,000\\text{ J}$.',
          'Công toàn phần: $A_{\\text{tp}} = \\frac{60\\,000}{0{,}8} = 75\\,000\\text{ J}$.',
          'Công suất máy: $\\mathcal{P} = \\frac{75\\,000}{60} = 1250\\text{ W}$.'
        ],
        finalAnswer: '$A_i = 60\\text{ kJ}$; $A_{\\text{tp}} = 75\\text{ kJ}$; $\\mathcal{P} = 1250\\text{ W}$.'
      }
    ]
  },
  {
    id: 'phys-2006-8-6',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'Vật lí 8 (SGK 2006) · Nhiệt học định lượng',
    sourceTag: SRC_2006_8,
    lessonNumber: 6,
    title: 'Bài 6 (SGK 2006): Nhiệt năng, 3 cách Truyền nhiệt & Phương trình Cân bằng nhiệt $Q = m c \\Delta t$',
    subtitle: 'Nhiệt dung riêng c, công thức Q = m·c·Δt và giải bài toán pha nước nóng – lạnh Q_tỏa = Q_thu',
    description:
      'Chinh phục phần quan trọng nhất Nhiệt học Lớp 8 (2006): ý nghĩa nhiệt dung riêng ($c_{\\text{nước}} = 4200\\text{ J/kg.K}$), năng suất tỏa nhiệt nhiên liệu và cân bằng nhiệt.',
    theorySections: [
      {
        heading: '1. Nhiệt lượng thu vào / tỏa ra: $Q = m \\cdot c \\cdot \\Delta t$',
        content:
          '• **Nhiệt dung riêng ($c$)** là nhiệt lượng cần truyền cho $1\\text{ kg}$ chất tăng thêm $1^\\circ\\text{C}$ (nước $c = 4200\\text{ J/kg.K}$, đồng $380\\text{ J/kg.K}$).\n• Công thức: **$Q = m \\cdot c \\cdot |t_{\\text{sau}} - t_{\\text{đầu}}|$**.'
      },
      {
        heading: '2. Phương trình Cân bằng nhiệt: $Q_{\\text{tỏa}} = Q_{\\text{thu}}$',
        content:
          '• Khi trộn hai vật nóng ($t_1$) và lạnh ($t_2$) vào bình cách nhiệt, nhiệt độ cân bằng cuối cùng $t$ nằm giữa $t_2 < t < t_1$.\n• Giải trong 3 dòng: Viết $Q_{\\text{tỏa}} = m_1 c_1 (t_1 - t)$, $Q_{\\text{thu}} = m_2 c_2 (t - t_2)$, rồi cho **$Q_{\\text{tỏa}} = Q_{\\text{thu}}$** tìm ra $t$!'
      }
    ],
    keyFormulas: [
      'Q = m \\cdot c \\cdot \\Delta t \\quad (c_{\\text{nước}} = 4200\\text{ J/kg.K})',
      'Q_{\\text{tỏa}} = Q_{\\text{thu}} \\iff m_1 c_1 (t_1 - t) = m_2 c_2 (t - t_2)',
      'Q_{\\text{đốt nhiên liệu}} = q \\cdot m'
    ],
    ...SIM_PRESETS.calorimetry,
    practiceExercises: [
      {
        source: SRC_2006_8,
        question: 'Đun $3\\text{ kg}$ nước ($c = 4200\\text{ J/kg.K}$) từ $25^\\circ\\text{C}$ lên $75^\\circ\\text{C}$ cần nhiệt lượng tối thiểu là:',
        options: ['A. $630\\text{ kJ}$', 'B. $315\\text{ kJ}$', 'C. $945\\text{ kJ}$', 'D. $1260\\text{ kJ}$'],
        correctIndex: 0,
        explanation: '$Q = 3 \\cdot 4200 \\cdot (75 - 25) = 630\\,000\\text{ J} = 630\\text{ kJ}$.'
      },
      {
        source: SRC_2006_8,
        question: 'Pha $1\\text{ kg}$ nước sôi $100^\\circ\\text{C}$ vào $1\\text{ kg}$ nước lạnh $20^\\circ\\text{C}$ (bỏ qua mất nhiệt ra ngoài). Nhiệt độ nước pha thu được là:',
        options: ['A. $50^\\circ\\text{C}$', 'B. $60^\\circ\\text{C}$', 'C. $80^\\circ\\text{C}$', 'D. $40^\\circ\\text{C}$'],
        correctIndex: 1,
        explanation: 'Cùng khối lượng và cùng chất (nước) nên $t = \\frac{100 + 20}{2} = 60^\\circ\\text{C}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_8,
        question: 'Thả một miếng đồng nặng $0{,}5\\text{ kg}$ ($c_1 = 380\\text{ J/kg.K}$) ở $100^\\circ\\text{C}$ vào $0{,}5\\text{ kg}$ nước ($c_2 = 4200\\text{ J/kg.K}$) ở $20^\\circ\\text{C}$. Bỏ qua nhiệt lượng truyền ra bình và không khí, tìm nhiệt độ cân bằng.',
        hints: ['Lập phương trình $m_1 c_1 (100 - t) = m_2 c_2 (t - 20)$.'],
        solutionSteps: [
          '$Q_{\\text{tỏa (đồng)}} = 0{,}5 \\cdot 380 \\cdot (100 - t) = 190(100 - t)$.',
          '$Q_{\\text{thu (nước)}} = 0{,}5 \\cdot 4200 \\cdot (t - 20) = 2100(t - 20)$.',
          'Cân bằng: $190(100 - t) = 2100(t - 20) \\implies 2290t = 61\\,000 \\implies t \\approx 26{,}64^\\circ\\text{C}$.'
        ],
        finalAnswer: '$t \\approx 26{,}64^\\circ\\text{C}$.'
      }
    ]
  }
];
