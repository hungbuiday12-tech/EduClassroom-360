import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const SRC_12 = 'GDPT 2018 (Thông tư 32/2018) · Vật lí 12 (KNTT · Sở GD&ĐT)';

export const PHYSICS_GDPT_12_LESSONS: PhysicsLesson[] = [
  // ================= CHƯƠNG I. VẬT LÍ NHIỆT (BÀI 1 - 7) =================
  {
    id: 'phys-12-b1',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương I · Vật lí nhiệt',
    sourceTag: SRC_12,
    lessonNumber: 1,
    title: 'Bài 1: Cấu trúc của chất. Sự chuyển thể',
    subtitle: 'Mô hình động học phân tử chất rắn – lỏng – khí và bản chất quá trình nóng chảy, hóa hơi',
    description:
      'Giải thích sự khác nhau về thể tích, hình dạng và chuyển động nhiệt của chất rắn, chất lỏng, chất khí dựa trên lực tương tác và khoảng cách giữa các phân tử; nắm rõ quy luật biến đổi nhiệt độ trong các quá trình chuyển thể.',
    theorySections: [
      {
        heading: '1. Mô hình động học phân tử về cấu tạo chất',
        content:
          '• Các chất được cấu tạo từ các hạt riêng biệt (phân tử, nguyên tử) chuyển động hỗn loạn không ngừng; nhiệt độ càng cao, các phân tử chuyển động càng nhanh.\n• Giữa các phân tử có đồng thời **lực hút và lực đẩy**: ở khoảng cách rất nhỏ lực đẩy trội hơn; ở khoảng cách lớn hơn lực hút trội hơn.\n• **Chất rắn**: khoảng cách phân tử nhỏ, lực tương tác rất mạnh, phân tử dao động quanh vị trí cân bằng cố định.\n• **Chất lỏng**: lực tương tác trung bình, phân tử dao động quanh vị trí cân bằng có thể di chuyển.\n• **Chất khí**: khoảng cách rất lớn, lực tương tác rất yếu, phân tử chuyển động tự do về mọi phía.'
      },
      {
        heading: '2. Sự chuyển thể & Đường biểu diễn nhiệt độ',
        content:
          '• **Nóng chảy** (rắn → lỏng) và **Hóa hơi** (lỏng → khí: gồm bay hơi ở mọi nhiệt độ trên mặt thoáng và sôi ở nhiệt độ xác định trong toàn khối lỏng) là các quá trình **thu nhiệt**.\n• Trong suốt thời gian chất rắn kết tinh đang nóng chảy hoặc chất lỏng đang sôi ở áp suất không đổi, **nhiệt độ giữ không đổi** (nhiệt lượng nhận vào dùng để phá vỡ liên kết phân tử).'
      }
    ],
    keyFormulas: [
      'Q > 0: \\text{Nóng chảy, Hóa hơi (Thu nhiệt)}',
      'Q < 0: \\text{Đông đặc, Ngưng tụ (Tỏa nhiệt)}',
      'T_{\\text{chuyển thể}} = \\text{const (với chất kết tinh)}'
    ],
    ...SIM_PRESETS.thermal_gas,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Trong suốt quá trình nước đang sôi ở áp suất chuẩn $1\\text{ atm}$, khi tiếp tục đun thì:',
        options: [
          'A. Nhiệt độ nước tăng dần vượt quá $100^\\circ\\text{C}$',
          'B. Nhiệt độ nước giữ nguyên $100^\\circ\\text{C}$',
          'C. Lực liên kết giữa các phân tử hơi tăng lên',
          'D. Thể tích hơi nước giảm xuống'
        ],
        correctIndex: 1,
        explanation: 'Khi chất lỏng đang sôi ở áp suất không đổi, nhiệt độ luôn giữ không đổi ($100^\\circ\\text{C}$ với nước tinh khiết ở $1\\text{ atm}$).'
      },
      {
        source: SRC_12,
        question: 'Tính chất nào sau đây KHÔNG phải là đặc điểm của chất rắn kết tinh?',
        options: [
          'A. Có cấu trúc tinh thể trật tự',
          'B. Có nhiệt độ nóng chảy xác định',
          'C. Nóng chảy dần trong một khoảng nhiệt độ rộng như thủy tinh',
          'D. Các phân tử dao động quanh vị trí cân bằng xác định'
        ],
        correctIndex: 2,
        explanation: 'Chất rắn vô định hình (như thủy tinh, nhựa đường) mới không có nhiệt độ nóng chảy xác định.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Phân biệt sự bay hơi và sự sôi của chất lỏng theo mô hình động học phân tử.',
        hints: ['Xét vị trí xảy ra (mặt thoáng vs toàn khối lỏng) và điều kiện nhiệt độ.'],
        solutionSteps: [
          'Bước 1: Sự bay hơi xảy ra ở mọi nhiệt độ và chỉ diễn ra trên bề mặt thoáng khi các phân tử có động năng đủ lớn thắng được lực hút phân tử lớp mặt.',
          'Bước 2: Sự sôi chỉ xảy ra ở một nhiệt độ xác định (phụ thuộc áp suất ngoài) và diễn ra đồng thời cả ở bề mặt thoáng lẫn trong lòng chất lỏng nhờ sự hình thành các bọt hơi.'
        ],
        finalAnswer: 'Bay hơi xảy ra ở mọi nhiệt độ tại mặt thoáng; sôi xảy ra ở nhiệt độ xác định trên cả bề mặt và trong lòng chất lỏng.'
      }
    ]
  },
  {
    id: 'phys-12-thermal',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương I · Vật lí nhiệt',
    sourceTag: SRC_12,
    lessonNumber: 2,
    title: 'Bài 2: Nội năng. Định luật I của nhiệt động lực học',
    subtitle: 'Khái niệm nội năng U, hai cách làm biến đổi nội năng và quy ước dấu ΔU = A + Q',
    description:
      'Làm chủ khái niệm nội năng (tổng động năng chuyển động nhiệt và thế năng tương tác phân tử), phân biệt công và nhiệt lượng cùng quy ước dấu chuẩn GDPT 2018 trong Định luật I Nhiệt động lực học.',
    theorySections: [
      {
        heading: '1. Nội năng và hai cách làm thay đổi nội năng',
        content:
          '• **Nội năng $U$** là tổng động năng và thế năng của các phân tử cấu tạo nên vật ($U$ phụ thuộc nhiệt độ $T$ và thể tích $V$; riêng khí lí tưởng thì $U$ chỉ phụ thuộc $T$).\n• Hai cách làm biến đổi nội năng: **Thực hiện công ($A$)** (có sự chuyển hóa cơ năng ↔ nội năng) và **Truyền nhiệt ($Q$)** (truyền trực tiếp nội năng nhờ chênh lệch nhiệt độ).'
      },
      {
        heading: '2. Định luật I của Nhiệt động lực học',
        content:
          '• Độ biến thiên nội năng của hệ bằng tổng công và nhiệt lượng mà hệ nhận được:\n  $$\\Delta U = A + Q$$\n• **Quy ước dấu chuẩn SGK KNTT**:\n  – $Q > 0$: hệ nhận nhiệt lượng; $Q < 0$: hệ truyền nhiệt lượng.\n  – $A > 0$: hệ nhận công (bị nén); $A < 0$: hệ thực hiện công (khí dãn nở đẩy pít-tông).'
      }
    ],
    keyFormulas: [
      '\\Delta U = A + Q',
      'Q > 0 \\text{ (nhận nhiệt)}, \\quad Q < 0 \\text{ (tỏa nhiệt)}',
      'A > 0 \\text{ (nhận công)}, \\quad A < 0 \\text{ (sinh công)}'
    ],
    ...SIM_PRESETS.pv_thermo,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Người ta truyền cho khối khí trong xi-lanh nhiệt lượng $150\\text{ J}$. Khí nở ra đẩy pít-tông thực hiện một công $90\\text{ J}$. Độ biến thiên nội năng của khí là:',
        options: ['A. $+240\\text{ J}$', 'B. $+60\\text{ J}$', 'C. $-60\\text{ J}$', 'D. $-240\\text{ J}$'],
        correctIndex: 1,
        explanation: 'Hệ nhận nhiệt $Q = +150\\text{ J}$ và thực hiện công ra ngoài $A = -90\\text{ J} \\implies \\Delta U = 150 - 90 = +60\\text{ J}$.'
      },
      {
        source: SRC_12,
        question: 'Quá trình nào sau đây làm biến đổi nội năng bằng cách thực hiện công?',
        options: [
          'A. Phơi ấm nước ngoài nắng',
          'B. Bơm xe đạp làm thân ống bơm nóng lên',
          'C. Thả viên đá vào cốc nước ấm',
          'D. Sưởi ấm bên lò than'
        ],
        correctIndex: 1,
        explanation: 'Khi bơm xe đạp, pít-tông nén khí thực hiện công cơ học làm nội năng và nhiệt độ khí tăng lên.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một khối khí bị nén trong xi-lanh, nhận công $250\\text{ J}$ đồng thời tỏa ra môi trường xung quanh nhiệt lượng $70\\text{ J}$. Tính độ biến thiên nội năng và cho biết nội năng tăng hay giảm.',
        hints: ['Khí bị nén → $A > 0$; khí tỏa nhiệt → $Q < 0$.'],
        solutionSteps: [
          'Bước 1: Theo quy ước dấu, nhận công $A = +250\\text{ J}$, tỏa nhiệt $Q = -70\\text{ J}$.',
          'Bước 2: Áp dụng Định luật I: $\\Delta U = A + Q = 250 + (-70) = +180\\text{ J} > 0$.'
        ],
        finalAnswer: 'Nội năng của khối khí tăng thêm $180\\text{ J}$.'
      }
    ]
  },
  {
    id: 'phys-12-b3',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương I · Vật lí nhiệt',
    sourceTag: SRC_12,
    lessonNumber: 3,
    title: 'Bài 3: Nhiệt độ. Thang nhiệt độ – nhiệt kế',
    subtitle: 'Chiều truyền nhiệt tự phát, cân bằng nhiệt, thang Celsius (t°C) và thang nhiệt độ tuyệt đối Kelvin (K)',
    description:
      'Hiểu bản chất thống kê của nhiệt độ, nguyên lí cân bằng nhiệt khi tiếp xúc, cách chuyển đổi chính xác giữa thang Celsius và thang Kelvin cùng nguyên tắc hoạt động của các loại nhiệt kế.',
    theorySections: [
      {
        heading: '1. Nhiệt độ và cân bằng nhiệt',
        content:
          '• Khi hai vật có nhiệt độ khác nhau tiếp xúc nhau, năng lượng nhiệt luôn tự truyền từ vật có **nhiệt độ cao hơn** sang vật có **nhiệt độ thấp hơn** cho đến khi đạt trạng thái **cân bằng nhiệt** (cùng nhiệt độ).\n• Nhiệt độ là đại lượng đặc trưng cho mức độ chuyển động nhiệt hỗn loạn trung bình của các phân tử.'
      },
      {
        heading: '2. Thang nhiệt độ Celsius và thang nhiệt độ Kelvin',
        content:
          '• **Thang Celsius**: mốc $0^\\circ\\text{C}$ là nhiệt độ nước đá đang tan, $100^\\circ\\text{C}$ là nhiệt độ nước đang sôi ở áp suất $1\\text{ atm}$.\n• **Thang Kelvin (nhiệt độ tuyệt đối, đơn vị SI)**: điểm $0\\text{ K}$ (độ không tuyệt đối, ứng với $-273{,}15^\\circ\\text{C}$) là nhiệt độ thấp nhất về lí thuyết mà động năng chuyển động nhiệt phân tử triệt tiêu; điểm ba của nước ở $273{,}16\\text{ K}$.\n• Công thức quy đổi: $T(\\text{K}) = t(^\\circ\\text{C}) + 273$ (chính xác hơn là $+273{,}15$) và **độ biến thiên $\\Delta T(\\text{K}) = \\Delta t(^\\circ\\text{C})$**.'
      }
    ],
    keyFormulas: [
      'T(\\text{K}) = t(^\\circ\\text{C}) + 273',
      '\\Delta T(\\text{K}) = \\Delta t(^\\circ\\text{C})',
      'T(\\text{K}) = \\frac{5}{9}\\big(t(^\\circ\\text{F}) - 32\\big) + 273'
    ],
    ...SIM_PRESETS.calorimetry,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Nhiệt độ phòng đo được là $27^\\circ\\text{C}$. Trong thang nhiệt độ Kelvin (lấy tròn $273$), giá trị tương ứng là:',
        options: ['A. $246\\text{ K}$', 'B. $300\\text{ K}$', 'C. $273\\text{ K}$', 'D. $327\\text{ K}$'],
        correctIndex: 1,
        explanation: '$T(\\text{K}) = 27 + 273 = 300\\text{ K}$.'
      },
      {
        source: SRC_12,
        question: 'Khi đun một ấm nước từ $25^\\circ\\text{C}$ lên $85^\\circ\\text{C}$, độ tăng nhiệt độ của nước theo thang Kelvin là:',
        options: ['A. $333\\text{ K}$', 'B. $60\\text{ K}$', 'C. $213\\text{ K}$', 'D. $110\\text{ K}$'],
        correctIndex: 1,
        explanation: 'Mỗi độ chia trên thang Kelvin bằng đúng $1^\\circ\\text{C}$ nên $\\Delta T = \\Delta t = 85 - 25 = 60\\text{ K}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Trong thang nhiệt độ Fahrenheit, nước đá tan ở $32^\\circ\\text{F}$ và sôi ở $212^\\circ\\text{F}$. Hãy tìm nhiệt độ cơ thể người $37^\\circ\\text{C}$ ứng với bao nhiêu độ F và bao nhiêu Kelvin?',
        hints: ['Dùng tỉ lệ tuyến tính $t(^\\circ\\text{F}) = 32 + 1{,}8\\,t(^\\circ\\text{C})$.'],
        solutionSteps: [
          'Bước 1: Đổi sang Fahrenheit: $t(^\\circ\\text{F}) = 32 + 1{,}8 \\cdot 37 = 98{,}6^\\circ\\text{F}$.',
          'Bước 2: Đổi sang Kelvin: $T(\\text{K}) = 37 + 273 = 310\\text{ K}$.'
        ],
        finalAnswer: '$98{,}6^\\circ\\text{F}$ và $310\\text{ K}$.'
      }
    ]
  },
  {
    id: 'phys-12-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương I · Vật lí nhiệt',
    sourceTag: SRC_12,
    lessonNumber: 4,
    title: 'Bài 4: Nhiệt dung riêng',
    subtitle: 'Định nghĩa nhiệt dung riêng c, công thức Q = m·c·ΔT và thí nghiệm thực hành đo c bằng nhiệt lượng kế',
    description:
      'Xác định ý nghĩa vật lí của nhiệt dung riêng, phương pháp cân bằng nhiệt $Q_{\\text{tỏa}} = Q_{\\text{thu}}$ và quy trình thí nghiệm sử dụng oát kế, nhiệt lượng kế đo nhiệt dung riêng của nước.',
    theorySections: [
      {
        heading: '1. Nhiệt dung riêng',
        content:
          '• **Nhiệt dung riêng ($c$)** của một chất là nhiệt lượng cần truyền cho $1\\text{ kg}$ chất đó để làm cho nhiệt độ của nó tăng thêm $1\\text{ K}$ (hoặc $1^\\circ\\text{C}$). Đơn vị: $\\text{J/(kg}\\cdot\\text{K)}$.\n• Công thức tính nhiệt lượng trao đổi khi không có chuyển thể:\n  $$Q = m \\cdot c \\cdot \\Delta T$$'
      },
      {
        heading: '2. Thí nghiệm đo nhiệt dung riêng bằng oát kế & nhiệt lượng kế',
        content:
          '• Dùng dây điện trở công suất $P$ (đọc trên oát kế hoặc $P = UI$) nung lượng nước khối lượng $m$ trong bình nhiệt lượng kế cách nhiệt trong thời gian $\\Delta t$, đo độ tăng nhiệt độ $\\Delta T = T_2 - T_1$.\n• Bỏ qua hao phí: $c = \\frac{\\mathcal{P} \\cdot \\Delta t}{m \\cdot \\Delta T}$ (lấy hệ số góc đồ thị $T(t)$).'
      }
    ],
    keyFormulas: [
      'Q = m\\cdot c\\cdot \\Delta T',
      'c = \\frac{\\mathcal{P}\\cdot \\Delta t}{m\\cdot \\Delta T}',
      '\\sum Q_{\\text{tỏa}} = \\sum Q_{\\text{thu}}'
    ],
    ...SIM_PRESETS.calorimetry,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Trong thí nghiệm đo nhiệt dung riêng của nước, dây nung có công suất $50\\text{ W}$ đun $200\\text{ g}$ nước trong $4\\text{ phút}$ làm nhiệt độ nước tăng từ $22^\\circ\\text{C}$ lên $36^\\circ\\text{C}$. Giá trị thực nghiệm $c$ thu được xấp xỉ:',
        options: ['A. $4286\\text{ J/(kg}\\cdot\\text{K)}$', 'B. $4200\\text{ J/(kg}\\cdot\\text{K)}$', 'C. $3850\\text{ J/(kg}\\cdot\\text{K)}$', 'D. $4500\\text{ J/(kg}\\cdot\\text{K)}$'],
        correctIndex: 0,
        explanation: '$c = \\frac{\\mathcal{P}\\Delta t}{m\\Delta T} = \\frac{50 \\cdot 240}{0{,}2 \\cdot (36 - 22)} = \\frac{12000}{2{,}8} \\approx 4286\\text{ J/(kg}\\cdot\\text{K)}$.'
      },
      {
        source: SRC_12,
        question: 'Vì sao ở vùng ven biển khí hậu ôn hòa hơn trong đất liền sâu?',
        options: [
          'A. Nước có nhiệt dung riêng rất lớn ($4200\\text{ J/kg.K}$) nên hấp thụ/tỏa nhiệt chậm',
          'B. Nước dẫn nhiệt tốt hơn kim loại',
          'C. Nước không bay hơi vào ban ngày',
          'D. Nhiệt độ sôi của nước thấp hơn đất đá'
        ],
        correctIndex: 0,
        explanation: 'Nhiệt dung riêng lớn giúp biển nóng lên chậm vào ban ngày và nguội đi chậm vào ban đêm.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một ấm nhôm khối lượng $400\\text{ g}$ chứa $1{,}5\\text{ kg}$ nước ở $25^\\circ\\text{C}$. Tính nhiệt lượng tối thiểu để đun sôi ấm nước này ở $100^\\circ\\text{C}$. Biết $c_{\\text{Al}} = 880\\text{ J/(kg.K)}$ và $c_{\\text{nước}} = 4200\\text{ J/(kg.K)}$.',
        hints: ['Tổng nhiệt lượng $Q = (m_{\\text{Al}} c_{\\text{Al}} + m_n c_n)\\Delta T$.'],
        solutionSteps: [
          'Bước 1: Độ tăng nhiệt độ $\\Delta T = 100 - 25 = 75\\text{ K}$.',
          'Bước 2: Nhiệt lượng ấm nhôm thu vào: $Q_1 = 0{,}4 \\cdot 880 \\cdot 75 = 26\\,400\\text{ J}$.',
          'Bước 3: Nhiệt lượng nước thu vào: $Q_2 = 1{,}5 \\cdot 4200 \\cdot 75 = 472\\,500\\text{ J}$.',
          'Bước 4: Tổng nhiệt lượng: $Q = 26\\,400 + 472\\,500 = 498\\,900\\text{ J} = 498{,}9\\text{ kJ}$.'
        ],
        finalAnswer: '$Q = 498{,}9\\text{ kJ}$.'
      }
    ]
  },
  {
    id: 'phys-12-b5',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương I · Vật lí nhiệt',
    sourceTag: SRC_12,
    lessonNumber: 5,
    title: 'Bài 5: Nhiệt nóng chảy riêng',
    subtitle: 'Định nghĩa nhiệt nóng chảy riêng λ (J/kg), công thức Q = λm và thực hành đo λ của nước đá',
    description:
      'Tính toán chính xác nhiệt lượng cần để làm nóng chảy hoàn toàn một khối chất rắn tại nhiệt độ nóng chảy và tiến hành thí nghiệm đo nhiệt nóng chảy riêng của nước đá.',
    theorySections: [
      {
        heading: '1. Nhiệt nóng chảy riêng (λ)',
        content:
          '• **Nhiệt nóng chảy riêng ($\\lambda$)** của một chất là nhiệt lượng cần để làm cho $1\\text{ kg}$ chất đó chuyển hoàn toàn từ thể rắn sang thể lỏng tại **nhiệt độ nóng chảy** (đơn vị $\\text{J/kg}$).\n• Công thức tính nhiệt lượng nóng chảy: $Q = \\lambda \\cdot m$.'
      },
      {
        heading: '2. Thí nghiệm đo nhiệt nóng chảy riêng của nước đá',
        content:
          '• Cho nước đá vụn đang tan ($0^\\circ\\text{C}$) vào nhiệt lượng kế chứa dây nung công suất $\\mathcal{P}$. Khi nước đá tan hoàn toàn, nhiệt độ bắt đầu tăng đều.\n• Từ đồ thị $(T - t)$ hoặc lượng nước thu thêm, áp dụng cân bằng năng lượng $\\lambda = \\frac{\\mathcal{P} \\cdot \\tau_M}{m}$ (với $\\tau_M$ là khoảng thời gian đoạn nằm ngang ở $0^\\circ\\text{C}$).'
      }
    ],
    keyFormulas: [
      'Q = \\lambda \\cdot m',
      '\\lambda = \\frac{\\mathcal{P}\\cdot \\tau_M}{m}',
      '\\lambda_{\\text{nước đá}} \\approx 3{,}34 \\cdot 10^5\\text{ J/kg}'
    ],
    ...SIM_PRESETS.calorimetry,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Biết nhiệt nóng chảy riêng của nước đá là $\\lambda = 3{,}34\\cdot 10^5\\text{ J/kg}$. Nhiệt lượng cần cung cấp để làm tan chảy hoàn toàn $500\\text{ g}$ nước đá ở $0^\\circ\\text{C}$ là:',
        options: ['A. $167\\text{ kJ}$', 'B. $334\\text{ kJ}$', 'C. $668\\text{ kJ}$', 'D. $16{,}7\\text{ kJ}$'],
        correctIndex: 0,
        explanation: '$Q = \\lambda m = 3{,}34\\cdot 10^5 \\cdot 0{,}5 = 1{,}67\\cdot 10^5\\text{ J} = 167\\text{ kJ}$.'
      },
      {
        source: SRC_12,
        question: 'Trong thí nghiệm đo nhiệt nóng chảy riêng của nước đá bằng nhiệt lượng kế điện có $\\mathcal{P} = 24\\text{ W}$, người ta thấy đoạn đồ thị giữ nguyên $0^\\circ\\text{C}$ kéo dài $\\tau_M = 420\\text{ s}$ ứng với $m = 30\\text{ g}$ đá tan hết. Giá trị $\\lambda$ đo được là:',
        options: ['A. $3{,}36\\cdot 10^5\\text{ J/kg}$', 'B. $3{,}34\\cdot 10^4\\text{ J/kg}$', 'C. $2{,}80\\cdot 10^5\\text{ J/kg}$', 'D. $4{,}20\\cdot 10^5\\text{ J/kg}$'],
        correctIndex: 0,
        explanation: '$\\lambda = \\frac{24 \\cdot 420}{0{,}03} = 336\\,000\\text{ J/kg} = 3{,}36\\cdot 10^5\\text{ J/kg}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Thả $100\\text{ g}$ nước đá ở $0^\\circ\\text{C}$ vào một cốc cách nhiệt chứa $400\\text{ g}$ nước ở $30^\\circ\\text{C}$. Biết $\\lambda = 3{,}34\\cdot 10^5\\text{ J/kg}$ và $c = 4200\\text{ J/(kg.K)}$. Nước đá có tan hết không? Tìm nhiệt độ cân bằng của hỗn hợp.',
        hints: ['So sánh nhiệt lượng tối đa nước $30^\\circ\\text{C}$ có thể tỏa khi hạ về $0^\\circ\\text{C}$ với nhiệt lượng cần để $100\\text{ g}$ đá tan hết.'],
        solutionSteps: [
          'Bước 1: Nhiệt lượng cần để $0{,}1\\text{ kg}$ đá ở $0^\\circ\\text{C}$ tan hết: $Q_{\\text{tan}} = 0{,}1 \\cdot 3{,}34\\cdot 10^5 = 33\\,400\\text{ J}$.',
          'Bước 2: Nhiệt lượng tối đa $0{,}4\\text{ kg}$ nước $30^\\circ\\text{C}$ tỏa ra khi hạ xuống $0^\\circ\\text{C}$: $Q_{\\text{tỏa max}} = 0{,}4 \\cdot 4200 \\cdot 30 = 50\\,400\\text{ J} > Q_{\\text{tan}}$. Vậy đá tan hết hoàn toàn!',
          'Bước 3: Phương trình cân bằng nhiệt: $33\\,400 + 0{,}1 \\cdot 4200 \\cdot (t - 0) = 0{,}4 \\cdot 4200 \\cdot (30 - t) \\Rightarrow 2100 t = 50\\,400 - 33\\,400 = 17\\,000 \\Rightarrow t \\approx 8{,}1^\\circ\\text{C}$.'
        ],
        finalAnswer: 'Đá tan hết hoàn toàn; nhiệt độ cân bằng cuối cùng xấp xỉ $8{,}1^\\circ\\text{C}$.'
      }
    ]
  },
  {
    id: 'phys-12-b6',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương I · Vật lí nhiệt',
    sourceTag: SRC_12,
    lessonNumber: 6,
    title: 'Bài 6: Nhiệt hóa hơi riêng',
    subtitle: 'Định nghĩa nhiệt hóa hơi riêng L (J/kg), công thức Q = L·m và phương pháp đo bằng cân điện tử',
    description:
      'Khảo sát năng lượng cần thiết để $1\\text{ kg}$ chất lỏng hóa hơi hoàn toàn ở nhiệt độ sôi, cách bố trí thí nghiệm đo nhiệt hóa hơi riêng của nước bằng ấm đun/cân điện tử và ứng dụng làm mát bay hơi.',
    theorySections: [
      {
        heading: '1. Nhiệt hóa hơi riêng (L)',
        content:
          '• **Nhiệt hóa hơi riêng ($L$)** của một chất lỏng là nhiệt lượng cần để làm cho $1\\text{ kg}$ chất lỏng đó hóa hơi hoàn toàn ở **nhiệt độ sôi** (ở áp suất chuẩn $1\\text{ atm}$, nước có $L \\approx 2{,}26\\cdot 10^6\\text{ J/kg}$ — lớn gấp gần 7 lần nhiệt nóng chảy riêng $\\lambda$!).\n• Công thức: $Q = L \\cdot m$.'
      },
      {
        heading: '2. Thí nghiệm đo nhiệt hóa hơi riêng của nước',
        content:
          '• Đặt bình nước lên cân điện tử, đun sôi liên tục bằng nguồn công suất $\\mathcal{P}$ không đổi. Ghi độ giảm khối lượng nước $\\Delta m$ bay hơi mất trong khoảng thời gian $\\Delta t$ kể từ lúc sôi ổn định.\n• Khi đó: $L = \\frac{\\mathcal{P} \\cdot \\Delta t}{\\Delta m}$.'
      }
    ],
    keyFormulas: [
      'Q = L \\cdot m',
      'L = \\frac{\\mathcal{P}\\cdot \\Delta t}{\\Delta m}',
      'L_{\\text{nước}} \\approx 2{,}26\\cdot 10^6\\text{ J/kg}'
    ],
    ...SIM_PRESETS.calorimetry,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Trong thí nghiệm đo nhiệt hóa hơi riêng của nước bằng ấm siêu tốc công suất $1500\\text{ W}$, sau khi nước sôi đều trong $2\\text{ phút}$, số chỉ cân điện tử giảm đi $80\\text{ g}$. Giá trị $L$ thu được là:',
        options: ['A. $2{,}25\\cdot 10^6\\text{ J/kg}$', 'B. $2{,}50\\cdot 10^6\\text{ J/kg}$', 'C. $1{,}80\\cdot 10^6\\text{ J/kg}$', 'D. $3{,}34\\cdot 10^5\\text{ J/kg}$'],
        correctIndex: 0,
        explanation: '$L = \\frac{\\mathcal{P}\\Delta t}{\\Delta m} = \\frac{1500 \\cdot 120}{0{,}08} = 2{,}25\\cdot 10^6\\text{ J/kg}$.'
      },
      {
        source: SRC_12,
        question: 'Tại sao khi bị bỏng do hơi nước sôi ở $100^\\circ\\text{C}$ lại nguy hiểm hơn bỏng do nước lỏng sôi ở cùng $100^\\circ\\text{C}$?',
        options: [
          'A. Hơi nước khi ngưng tụ trên da tỏa thêm một lượng nhiệt hóa hơi riêng $L$ cực lớn ($2{,}26\\text{ MJ/kg}$)',
          'B. Hơi nước có khối lượng riêng lớn hơn nước lỏng',
          'C. Hơi nước có nhiệt dung riêng nhỏ hơn nước đá',
          'D. Nhiệt độ của hơi nước luôn là $500^\\circ\\text{C}$'
        ],
        correctIndex: 0,
        explanation: 'Khi tiếp xúc da, $1\\text{ g}$ hơi $100^\\circ\\text{C}$ ngưng tụ thành nước $100^\\circ\\text{C}$ đã tỏa ngay $2260\\text{ J}$ trước khi nguội tiếp!'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Tính tổng nhiệt lượng cần thiết để biến hoàn toàn $0{,}5\\text{ kg}$ nước ở $20^\\circ\\text{C}$ thành hơi nước ở $100^\\circ\\text{C}$ (biết $c = 4200\\text{ J/kg.K}$, $L = 2{,}26\\cdot 10^6\\text{ J/kg}$).',
        hints: ['Cộng nhiệt lượng đun nóng từ $20^\\circ\\text{C} \\to 100^\\circ\\text{C}$ ($mc\\Delta T$) và nhiệt hóa hơi ở $100^\\circ\\text{C}$ ($Lm$).'],
        solutionSteps: [
          'Bước 1: Đun nước lên $100^\\circ\\text{C}$: $Q_1 = 0{,}5 \\cdot 4200 \\cdot (100 - 20) = 168\\,000\\text{ J} = 168\\text{ kJ}$.',
          'Bước 2: Hóa hơi hoàn toàn ở $100^\\circ\\text{C}$: $Q_2 = 0{,}5 \\cdot 2{,}26\\cdot 10^6 = 1\\,130\\,000\\text{ J} = 1130\\text{ kJ}$.',
          'Bước 3: Tổng nhiệt lượng: $Q = 168 + 1130 = 1298\\text{ kJ} \\approx 1{,}30\\text{ MJ}$.'
        ],
        finalAnswer: '$Q = 1298\\text{ kJ} \\approx 1{,}30\\text{ MJ}$.'
      }
    ]
  },
  {
    id: 'phys-12-b7',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương I · Vật lí nhiệt',
    sourceTag: SRC_12,
    lessonNumber: 7,
    title: 'Bài 7: Bài tập về vật lí nhiệt',
    subtitle: 'Tổng hợp phương trình cân bằng nhiệt có chuyển thể, hiệu suất đun nấu và đồ thị nhiệt độ theo thời gian',
    description:
      'Luyện giải thành thạo các dạng bài tập tổng hợp Chương Vật lí nhiệt: đồ thị $T(t)$ nhiều đoạn gãy khúc, bài toán sục hơi nước vào nước đá và kiểm tra điều kiện tan chảy một phần hay toàn phần.',
    theorySections: [
      {
        heading: '1. Đọc đồ thị Nhiệt độ – Thời gian $T(t)$ khi cấp công suất $\\mathcal{P}$ đều',
        content:
          '• Trên các đoạn nghiêng (tăng nhiệt độ): độ dốc $\\frac{\\Delta T}{\\Delta t} = \\frac{\\mathcal{P}}{m\\cdot c}$ (đoạn có độ dốc lớn hơn tương ứng nhiệt dung riêng $c$ nhỏ hơn, ví dụ nước đá có $c = 2100$ dốc gần gấp đôi nước lỏng $c = 4200$).\n• Trên các đoạn nằm ngang: nhiệt độ giữ nguyên để nóng chảy ($Q = \\lambda m$) hoặc hóa hơi ($Q = Lm$).'
      },
      {
        heading: '2. Phương pháp kiểm tra ngưỡng chuyển thể',
        content:
          '• Khi trộn chất ở nhiều trạng thái (ví dụ nước đá $-10^\\circ\\text{C}$ và nước nóng $+60^\\circ\\text{C}$), luôn tính **các mức nhiệt lượng ranh giới** ở $0^\\circ\\text{C}$ trước để kết luận chính xác hỗn hợp cuối cùng chỉ còn nước, còn đá chưa tan hết hay đá tan hết hoàn toàn.'
      }
    ],
    keyFormulas: [
      'Q_{\\text{toàn phần}} = H^{-1} \\sum (m c \\Delta T + \\lambda m + L m)',
      '\\tan\\alpha_{\\text{đoạn nghiêng}} = \\frac{\\mathcal{P}}{mc}'
    ],
    ...SIM_PRESETS.calorimetry,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Một bếp điện hiệu suất $80\\%$ có công suất $1000\\text{ W}$ dùng để đun $2\\text{ kg}$ nước từ $20^\\circ\\text{C}$ đến sôi $100^\\circ\\text{C}$ ($c = 4200\\text{ J/kg.K}$). Thời gian đun bằng:',
        options: ['A. $14\\text{ phút}$', 'B. $11{,}2\\text{ phút}$', 'C. $10\\text{ phút}$', 'D. $16{,}8\\text{ phút}$'],
        correctIndex: 0,
        explanation: 'Nhiệt lượng có ích $Q_i = 2\\cdot 4200\\cdot 80 = 672\\,000\\text{ J}$. Vì $Q_i = H\\cdot \\mathcal{P}t \\implies t = \\frac{672000}{0{,}8 \\cdot 1000} = 840\\text{ s} = 14\\text{ phút}$.'
      },
      {
        source: SRC_12,
        question: 'Khi cấp nhiệt với công suất không đổi cho một chất rắn kết tinh, đoạn đồ thị nâng nhiệt độ chất rắn dốc hơn đoạn nâng nhiệt độ chất lỏng gấp 2 lần. Tỉ số nhiệt dung riêng $c_{\\text{rắn}} / c_{\\text{lỏng}}$ bằng:',
        options: ['A. $0{,}5$', 'B. $2$', 'C. $1$', 'D. $4$'],
        correctIndex: 0,
        explanation: 'Độ dốc $\\frac{\\Delta T}{\\Delta t} = \\frac{\\mathcal{P}}{mc}$ tỉ lệ nghịch với $c$, nên đoạn dốc gấp đôi có $c$ nhỏ bằng một nửa ($0{,}5$).'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Dẫn $100\\text{ g}$ hơi nước ở $100^\\circ\\text{C}$ vào bình cách nhiệt chứa $1\\text{ kg}$ nước ở $20^\\circ\\text{C}$. Bỏ qua nhiệt dung bình, tìm nhiệt độ cân bằng cuối cùng ($c = 4200\\text{ J/kg.K}$, $L = 2{,}26\\cdot 10^6\\text{ J/kg}$).',
        hints: ['Kiểm tra xem $0{,}1\\text{ kg}$ hơi ngưng tụ tỏa nhiệt lượng có đủ làm $1\\text{ kg}$ nước sôi lên $100^\\circ\\text{C}$ không.'],
        solutionSteps: [
          'Bước 1: Nhiệt lượng $0{,}1\\text{ kg}$ hơi ngưng tụ thành nước $100^\\circ\\text{C}$ là $Q_{\\text{ngưng}} = 0{,}1 \\cdot 2{,}26\\cdot 10^6 = 226\\,000\\text{ J}$.',
          'Bước 2: Nhiệt lượng để $1\\text{ kg}$ nước từ $20^\\circ\\text{C}$ lên $100^\\circ\\text{C}$ là $Q_{\\text{sôi}} = 1 \\cdot 4200 \\cdot 80 = 336\\,000\\text{ J} > 226\\,000\\text{ J}$! Vậy toàn bộ hơi ngưng tụ hết và nhiệt độ cuối $t < 100^\\circ\\text{C}$.',
          'Bước 3: Phương trình cân bằng: $226\\,000 + 0{,}1 \\cdot 4200 \\cdot (100 - t) = 1 \\cdot 4200 \\cdot (t - 20) \\Rightarrow 268\\,000 + 84\\,000 = 4620 t \\Rightarrow t = \\frac{352\\,000}{4620} \\approx 76{,}2^\\circ\\text{C}$.'
        ],
        finalAnswer: 'Hơi ngưng tụ hết hoàn toàn; nhiệt độ cân bằng xấp xỉ $76{,}2^\\circ\\text{C}$.'
      }
    ]
  },

  // ================= CHƯƠNG II. KHÍ LÍ TƯỞNG (BÀI 8 - 13) =================
  {
    id: 'phys-12-b8',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương II · Khí lí tưởng',
    sourceTag: SRC_12,
    lessonNumber: 8,
    title: 'Bài 8: Mô hình động học phân tử chất khí',
    subtitle: 'Tính chất chất khí, chuyển động Brown, 3 giả thuyết khí lí tưởng và số phân tử trong n mol khí',
    description:
      'Xây dựng mô hình khí lí tưởng (coi phân tử là chất điểm, chỉ tương tác khi va chạm đàn hồi hoàn toàn với nhau và với thành bình) từ bằng chứng chuyển động Brown và số Avogadro $N_A$.',
    theorySections: [
      {
        heading: '1. Chuyển động nhiệt của phân tử khí & Thuyết động học',
        content:
          '• **Chuyển động Brown** của các hạt khói/phấn hoa lơ lửng chứng minh các phân tử chất khí chuyển động hỗn loạn không ngừng.\n• Số phân tử trong $1\\text{ mol}$ chất là hằng số Avogadro $N_A = 6{,}02 \\cdot 10^{23}\\text{ mol}^{-1}$. Với khối lượng $m$ gam và khối lượng mol $M$, số mol là $n = \\frac{m}{M}$ và số phân tử $N = n N_A$.'
      },
      {
        heading: '2. Ba giả thuyết của Mô hình Khí lí tưởng',
        content:
          '• Các phân tử khí được coi là các chất điểm (bỏ qua thể tích riêng của hạt so với thể tích bình).\n• Các phân tử chuyển động thẳng đều giữa hai lần va chạm liên tiếp.\n• Chỉ tương tác khi va chạm và mọi va chạm đều là **va chạm hoàn toàn đàn hồi**.'
      }
    ],
    keyFormulas: [
      'n = \\frac{m}{M} = \\frac{N}{N_A} \\quad (N_A \\approx 6{,}02\\cdot 10^{23}\\text{ mol}^{-1})',
      'm_0 = \\frac{M}{N_A} \\text{ (khối lượng 1 phân tử)}'
    ],
    ...SIM_PRESETS.thermal_gas,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Trong $32\\text{ g}$ khí Ôxi ($M = 32\\text{ g/mol}$) có chứa bao nhiêu phân tử khí?',
        options: ['A. $6{,}02\\cdot 10^{23}$', 'B. $1{,}204\\cdot 10^{24}$', 'C. $3{,}01\\cdot 10^{23}$', 'D. $6{,}02\\cdot 10^{26}$'],
        correctIndex: 0,
        explanation: 'Số mol $n = 32/32 = 1\\text{ mol}$, nên chứa đúng $N = N_A = 6{,}02\\cdot 10^{23}$ phân tử.'
      },
      {
        source: SRC_12,
        question: 'Điều nào sau đây KHÔNG thuộc mô hình khí lí tưởng?',
        options: [
          'A. Bỏ qua kích thước riêng của phân tử',
          'B. Va chạm giữa các phân tử với thành bình là hoàn toàn đàn hồi',
          'C. Giữa các phân tử luôn có lực hút rất mạnh giữ cố định vị trí',
          'D. Bỏ qua tương tác giữa các phân tử khi chưa va chạm'
        ],
        correctIndex: 2,
        explanation: 'Các phân tử khí lí tưởng chỉ tương tác khi va chạm trực tiếp, không bị lực hút giữ cố định.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Tính số phân tử khí Nitơ ($M = 28\\text{ g/mol}$) có trong một bình chứa $56\\text{ g}$ khí Nitơ và khối lượng của một phân tử Nitơ theo kilôgam.',
        hints: ['Tính $n = m/M$, sau đó $N = n N_A$ và $m_0 = m/N$.'],
        solutionSteps: [
          'Bước 1: Số mol Nitơ: $n = \\frac{56}{28} = 2\\text{ mol}$.',
          'Bước 2: Số phân tử Nitơ: $N = 2 \\cdot 6{,}02\\cdot 10^{23} = 1{,}204\\cdot 10^{24}$ phân tử.',
          'Bước 3: Khối lượng 1 phân tử Nitơ: $m_0 = \\frac{0{,}028}{6{,}02\\cdot 10^{23}} \\approx 4{,}65\\cdot 10^{-26}\\text{ kg}$.'
        ],
        finalAnswer: '$1{,}204\\cdot 10^{24}$ phân tử; khối lượng 1 phân tử $\\approx 4{,}65\\cdot 10^{-26}\\text{ kg}$.'
      }
    ]
  },
  {
    id: 'phys-12-b9',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương II · Khí lí tưởng',
    sourceTag: SRC_12,
    lessonNumber: 9,
    title: 'Bài 9: Định luật Boyle',
    subtitle: 'Quá trình đẳng nhiệt (T = const), định luật Boyle p₁V₁ = p₂V₂ và đường đẳng nhiệt hypebol trong hệ (p–V)',
    description:
      'Khảo sát mối quan hệ tỉ lệ nghịch giữa áp suất và thể tích khi giữ nguyên nhiệt độ không đổi của một khối khí xác định; đọc và so sánh các đường đẳng nhiệt ở nhiệt độ khác nhau.',
    theorySections: [
      {
        heading: '1. Quá trình đẳng nhiệt & Định luật Boyle',
        content:
          '• **Quá trình đẳng nhiệt** là quá trình biến đổi trạng thái của một lượng khí xác định khi nhiệt độ $T$ giữ không đổi.\n• **Định luật Boyle**: Trong quá trình đẳng nhiệt, áp suất tỉ lệ nghịch với thể tích:\n  $$p \\cdot V = \\text{hằng số} \\iff p_1 V_1 = p_2 V_2$$'
      },
      {
        heading: '2. Đường đẳng nhiệt trong hệ tọa độ $(p - V)$',
        content:
          '• Đường đẳng nhiệt là một nhánh đường cong **hypebol**.\n• Trên cùng một đồ thị $(p - V)$ ứng với cùng một lượng khí, **đường đẳng nhiệt nằm ở phía trên (xa gốc tọa độ hơn) có nhiệt độ $T$ cao hơn**.'
      }
    ],
    keyFormulas: [
      'p_1 V_1 = p_2 V_2 \\quad (T = \\text{const})',
      'p \\sim \\frac{1}{V}'
    ],
    ...SIM_PRESETS.thermal_gas,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Nén đẳng nhiệt một khối khí từ thể tích $15\\text{ lít}$ ở áp suất $1{,}2\\text{ atm}$ xuống thể tích $5\\text{ lít}$. Áp suất khí lúc sau bằng:',
        options: ['A. $0{,}4\\text{ atm}$', 'B. $3{,}6\\text{ atm}$', 'C. $4{,}0\\text{ atm}$', 'D. $2{,}4\\text{ atm}$'],
        correctIndex: 1,
        explanation: '$p_2 = \\frac{p_1 V_1}{V_2} = \\frac{1{,}2 \\cdot 15}{5} = 3{,}6\\text{ atm}$.'
      },
      {
        source: SRC_12,
        question: 'Đồ thị biểu diễn định luật Boyle trong hệ tọa độ $(p, V)$ có dạng là:',
        options: ['A. Đường thẳng đi qua gốc tọa độ', 'B. Đường hypebol', 'C. Đường thẳng song song trục $p$', 'D. Đường tròn'],
        correctIndex: 1,
        explanation: 'Vì $p = \\text{const}/V$ nên đồ thị là một nhánh đường hypebol.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một quả bóng dung tích $2{,}5\\text{ lít}$ ban đầu chứa không khí ở áp suất $1\\text{ atm}$. Người ta dùng bơm tay mỗi lần bơm đẩy được $125\\text{ cm}^3$ không khí ở áp suất $1\\text{ atm}$ vào bóng (nhiệt độ không đổi). Sau $40$ lần bơm, áp suất khí trong bóng là bao nhiêu?',
        hints: ['Tính tổng thể tích khí ở $1\\text{ atm}$ đã đưa vào + có sẵn trong bóng, rồi áp dụng $p_1 V_1 = p_2 V_2$ với $V_2 = 2{,}5\\text{ lít}$.'],
        solutionSteps: [
          'Bước 1: Đổi $125\\text{ cm}^3 = 0{,}125\\text{ lít}$. Tổng thể tích khí ban đầu ở $p_1 = 1\\text{ atm}$ là $V_1 = 2{,}5 + 40 \\cdot 0{,}125 = 2{,}5 + 5 = 7{,}5\\text{ lít}$.',
          'Bước 2: Khi nén vào quả bóng có thể tích cố định $V_2 = 2{,}5\\text{ lít}$ ở nhiệt độ không đổi: $p_2 = \\frac{p_1 V_1}{V_2} = \\frac{1 \\cdot 7{,}5}{2{,}5} = 3\\text{ atm}$.'
        ],
        finalAnswer: '$p_2 = 3\\text{ atm}$.'
      }
    ]
  },
  {
    id: 'phys-12-b10',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương II · Khí lí tưởng',
    sourceTag: SRC_12,
    lessonNumber: 10,
    title: 'Bài 10: Định luật Charles',
    subtitle: 'Quá trình đẳng áp (p = const), định luật Charles V₁/T₁ = V₂/T₂ và đường đẳng áp trong (V–T)',
    description:
      'Thiết lập định luật Charles về sự giãn nở đẳng áp của chất khí tỉ lệ thuận với nhiệt độ tuyệt đối Kelvin $T$, giải thích cách dựng đường đẳng áp và ứng dụng nhiệt kế khí.',
    theorySections: [
      {
        heading: '1. Quá trình đẳng áp & Định luật Charles',
        content:
          '• **Quá trình đẳng áp** là quá trình biến đổi trạng thái của một lượng khí xác định khi áp suất $p$ giữ không đổi.\n• **Định luật Charles**: Khi áp suất không đổi, thể tích $V$ của một khối lượng khí xác định **tỉ lệ thuận với nhiệt độ tuyệt đối $T$ (đo bằng Kelvin)**:\n  $$\\frac{V}{T} = \\text{hằng số} \\iff \\frac{V_1}{T_1} = \\frac{V_2}{T_2}$$'
      },
      {
        heading: '2. Đường đẳng áp trong hệ $(V - T)$',
        content:
          '• Đường biểu diễn trong hệ $(V - T)$ (với $T$ tính bằng Kelvin) là đường thẳng có đường kéo dài đi qua gốc tọa độ $O(0; 0)$.\n• Nếu đường đẳng áp có độ dốc lớn hơn thì áp suất của khối khí đó nhỏ hơn (do $V/T = nR/p$).'
      }
    ],
    keyFormulas: [
      '\\frac{V_1}{T_1} = \\frac{V_2}{T_2} \\quad (p = \\text{const})',
      'T(\\text{K}) = t(^\\circ\\text{C}) + 273'
    ],
    ...SIM_PRESETS.thermal_gas,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Một lượng khí ở $27^\\circ\\text{C}$ có thể tích $6\\text{ lít}$. Giữ áp suất không đổi, đun nóng khí lên tới $127^\\circ\\text{C}$ thì thể tích khí trở thành:',
        options: ['A. $8\\text{ lít}$', 'B. $28{,}2\\text{ lít}$', 'C. $4{,}5\\text{ lít}$', 'D. $12\\text{ lít}$'],
        correctIndex: 0,
        explanation: 'Đổi sang Kelvin: $T_1 = 300\\text{ K}$, $T_2 = 400\\text{ K}$. Theo ĐL Charles: $V_2 = 6 \\cdot \\frac{400}{300} = 8\\text{ lít}$.'
      },
      {
        source: SRC_12,
        question: 'Trong hệ tọa độ $(V, T)$ với $T$ tính theo Kelvin, đường đẳng áp là:',
        options: [
          'A. Đường thẳng kéo dài đi qua gốc tọa độ',
          'B. Nhánh hypebol',
          'C. Đường thẳng song song trục $OT$',
          'D. Parabol đi qua gốc tọa độ'
        ],
        correctIndex: 0,
        explanation: 'Vì $V = \\text{const} \\cdot T$ nên đồ thị là đường thẳng kéo dài qua $O$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Trong một xi-lanh có pít-tông chuyển động tự do (áp suất luôn bằng áp suất khí quyển), chứa $4\\text{ lít}$ khí ở nhiệt độ $27^\\circ\\text{C}$. Cần tăng nhiệt độ lên bao nhiêu độ C để thể tích khí tăng thêm $1\\text{ lít}$?',
        hints: ['Dùng đẳng áp $\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$ với $V_2 = 5\\text{ lít}$, $T_1 = 300\\text{ K}$.'],
        solutionSteps: [
          'Bước 1: $T_1 = 27 + 273 = 300\\text{ K}$, $V_2 = 4 + 1 = 5\\text{ lít}$.',
          'Bước 2: Áp dụng ĐL Charles: $T_2 = T_1 \\cdot \\frac{V_2}{V_1} = 300 \\cdot \\frac{5}{4} = 375\\text{ K}$.',
          'Bước 3: Nhiệt độ Celsius lúc sau: $t_2 = 375 - 273 = 102^\\circ\\text{C}$ (tức tăng thêm $75^\\circ\\text{C}$).'
        ],
        finalAnswer: 'Đun tới $102^\\circ\\text{C}$ (tăng thêm $75^\\circ\\text{C}$).'
      }
    ]
  },
  {
    id: 'phys-12-b11',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương II · Khí lí tưởng',
    sourceTag: SRC_12,
    lessonNumber: 11,
    title: 'Bài 11: Phương trình trạng thái của khí lí tưởng',
    subtitle: 'Phương trình trạng thái pV/T = const, phương trình Clapeyron pV = nRT và quá trình đẳng tích p/T = const',
    description:
      'Kết hợp định luật Boyle và định luật Charles để thiết lập phương trình trạng thái tổng quát của khí lí tưởng $\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}$ và phương trình Clapeyron $pV = nRT$.',
    theorySections: [
      {
        heading: '1. Phương trình trạng thái khí lí tưởng',
        content:
          '• Với một lượng khí xác định chuyển từ trạng thái $(p_1, V_1, T_1)$ sang trạng thái $(p_2, V_2, T_2)$ bất kì:\n  $$\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}$$\n• Hệ quả cho **quá trình đẳng tích ($V = \\text{const}$)**: $\\frac{p_1}{T_1} = \\frac{p_2}{T_2}$.'
      },
      {
        heading: '2. Phương trình Clapeyron ($pV = nRT$)',
        content:
          '• Nếu biết số mol $n = \\frac{m}{M}$ và hằng số khí lí tưởng $R = 8{,}31\\text{ J/(mol}\\cdot\\text{K)}$:\n  $$p V = n R T = \\frac{m}{M} R T$$\n• **Lưu ý đơn vị SI**: khi thay $R = 8{,}31$, bắt buộc đổi $p$ ra Pascal ($\\text{Pa}$, $1\\text{ atm} \\approx 1{,}013\\cdot 10^5\\text{ Pa}$), $V$ ra $\\text{m}^3$ ($1\\text{ lít} = 10^{-3}\\text{ m}^3$), $T$ ra Kelvin.'
      }
    ],
    keyFormulas: [
      '\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}',
      'p V = n R T \\quad (R = 8{,}31\\text{ J/mol}\\cdot\\text{K})',
      '\\frac{p_1}{T_1} = \\frac{p_2}{T_2} \\quad (V = \\text{const})'
    ],
    ...SIM_PRESETS.thermal_gas,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Một bình kín thể tích không đổi chứa khí ở $27^\\circ\\text{C}$, áp suất $2\\cdot 10^5\\text{ Pa}$. Khi nung bình lên đến $177^\\circ\\text{C}$, áp suất khí trong bình bằng:',
        options: ['A. $3\\cdot 10^5\\text{ Pa}$', 'B. $4\\cdot 10^5\\text{ Pa}$', 'C. $1{,}33\\cdot 10^5\\text{ Pa}$', 'D. $6\\cdot 10^5\\text{ Pa}$'],
        correctIndex: 0,
        explanation: 'Đẳng tích: $T_1 = 300\\text{ K}, T_2 = 450\\text{ K} \\implies p_2 = 2\\cdot 10^5 \\cdot \\frac{450}{300} = 3\\cdot 10^5\\text{ Pa}$.'
      },
      {
        source: SRC_12,
        question: 'Một khối khí ban đầu ở $(2\\text{ atm}, 6\\text{ lít}, 300\\text{ K})$ chuyển sang trạng thái mới có thể tích $4\\text{ lít}$ và nhiệt độ $400\\text{ K}$. Áp suất mới của khí là:',
        options: ['A. $4\\text{ atm}$', 'B. $3\\text{ atm}$', 'C. $2{,}25\\text{ atm}$', 'D. $6\\text{ atm}$'],
        correctIndex: 0,
        explanation: '$p_2 = p_1\\frac{V_1}{V_2}\\frac{T_2}{T_1} = 2 \\cdot \\frac{6}{4} \\cdot \\frac{400}{300} = 4\\text{ atm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Tính khối lượng khí Heli ($M = 4\\text{ g/mol}$) chứa trong một bình dung tích $8{,}31\\text{ lít}$ ở nhiệt độ $27^\\circ\\text{C}$ và áp suất $3\\cdot 10^5\\text{ Pa}$.',
        hints: ['Dùng $pV = \\frac{m}{M}RT$ với $V = 8{,}31\\cdot 10^{-3}\\text{ m}^3$, $T = 300\\text{ K}$, $R = 8{,}31\\text{ J/(mol.K)}$.'],
        solutionSteps: [
          'Bước 1: Đổi đơn vị SI: $V = 8{,}31\\cdot 10^{-3}\\text{ m}^3$, $T = 27 + 273 = 300\\text{ K}$.',
          'Bước 2: Tính số mol $n = \\frac{pV}{RT} = \\frac{3\\cdot 10^5 \\cdot 8{,}31\\cdot 10^{-3}}{8{,}31 \\cdot 300} = 1\\text{ mol}$.',
          'Bước 3: Khối lượng khí Heli: $m = n M = 1 \\cdot 4 = 4\\text{ g}$.'
        ],
        finalAnswer: '$m = 4\\text{ g}$.'
      }
    ]
  },
  {
    id: 'phys-12-b12',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương II · Khí lí tưởng',
    sourceTag: SRC_12,
    lessonNumber: 12,
    title: 'Bài 12: Áp suất khí theo mô hình động học phân tử. Quan hệ giữa động năng phân tử và nhiệt độ',
    subtitle: 'Biểu thức p = ⅓·μ·m·v²_rms, hằng số Boltzmann k = R/N_A và động năng tịnh tiến trung bình E_đ = (3/2)kT',
    description:
      'Liên kết đại lượng vĩ mô (áp suất $p$, nhiệt độ $T$) với đại lượng vi mô (mật độ phân tử $\\mu$, tốc độ căn quân phương $v_{\\text{rms}}$ và động năng tịnh tiến trung bình phân tử).',
    theorySections: [
      {
        heading: '1. Áp suất chất khí theo mô hình động học phân tử',
        content:
          '• Áp suất chất khí tác dụng lên thành bình xuất phát từ xung lực va chạm của các phân tử khí:\n  $$p = \\frac{1}{3} \\mu m \\overline{v^2} = \\frac{2}{3} \\mu \\overline{E}_đ$$\n  trong đó $\\mu = \\frac{N}{V}$ là mật độ phân tử ($\\text{m}^{-3}$), $m$ là khối lượng $1$ phân tử, $\\overline{v^2}$ là trung bình bình phương tốc độ.'
      },
      {
        heading: '2. Động năng tịnh tiến trung bình & Nhiệt độ tuyệt đối',
        content:
          '• Kết hợp với $pV = nRT = N k T$, ta có động năng tịnh tiến trung bình của mỗi phân tử khí lí tưởng:\n  $$\\overline{E}_đ = \\frac{3}{2} k T \\quad \\big(k = \\frac{R}{N_A} = 1{,}38\\cdot 10^{-23}\\text{ J/K}\\big)$$\n• **Kết luận vàng**: Nhiệt độ tuyệt đối $T$ tỉ lệ thuận trực tiếp với động năng tịnh tiến trung bình $\\overline{E}_đ$, không phụ thuộc bản chất khí! Tốc độ căn quân phương $v_{\\text{rms}} = \\sqrt{\\overline{v^2}} = \\sqrt{\\frac{3RT}{M}}$.'
      }
    ],
    keyFormulas: [
      'p = \\frac{1}{3}\\mu m \\overline{v^2} = \\frac{2}{3}\\mu \\overline{E}_đ',
      '\\overline{E}_đ = \\frac{3}{2} k T \\quad (k = 1{,}38\\cdot 10^{-23}\\text{ J/K})',
      'v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}} = \\sqrt{\\frac{3kT}{m_0}}'
    ],
    ...SIM_PRESETS.thermal_gas,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Khi tăng nhiệt độ tuyệt đối của một khối khí lí tưởng lên $4$ lần, căn bậc hai của trung bình bình phương tốc độ ($v_{\\text{rms}}$) các phân tử sẽ:',
        options: ['A. Tăng $4$ lần', 'B. Tăng $2$ lần', 'C. Tăng $16$ lần', 'D. Không đổi'],
        correctIndex: 1,
        explanation: 'Vì $v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}} \\propto \\sqrt{T}$, nên $T$ tăng $4$ lần thì $v_{\\text{rms}}$ tăng $\\sqrt{4} = 2$ lần.'
      },
      {
        source: SRC_12,
        question: 'Ở cùng nhiệt độ $300\\text{ K}$, hai bình đựng khí Hiđrô ($\\text{H}_2, M = 2$) và khí Heli ($\\text{He}, M = 4$) sẽ có:',
        options: [
          'A. Cùng động năng tịnh tiến trung bình của mỗi phân tử',
          'B. Tốc độ trung bình phân tử bằng nhau',
          'C. Động năng phân tử Heli lớn gấp đôi Hiđrô',
          'D. Khối lượng riêng bằng nhau'
        ],
        correctIndex: 0,
        explanation: 'Động năng trung bình $\\overline{E}_đ = \\frac{3}{2}kT$ chỉ phụ thuộc $T$, không phụ thuộc khối lượng phân tử.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Tính động năng tịnh tiến trung bình của phân tử khí ở $27^\\circ\\text{C}$ và mật độ phân tử khí trong bình ở áp suất $2{,}07\\cdot 10^5\\text{ Pa}$.',
        hints: ['Đổi $T = 300\\text{ K}$, tính $\\overline{E}_đ = 1{,}5 k T$, rồi dùng $p = \\mu k T$ hoặc $p = \\frac{2}{3}\\mu \\overline{E}_đ$.'],
        solutionSteps: [
          'Bước 1: $T = 27 + 273 = 300\\text{ K} \\implies \\overline{E}_đ = 1{,}5 \\cdot 1{,}38\\cdot 10^{-23} \\cdot 300 = 6{,}21\\cdot 10^{-21}\\text{ J}$.',
          'Bước 2: Từ $p = \\mu k T \\implies \\mu = \\frac{2{,}07\\cdot 10^5}{1{,}38\\cdot 10^{-23} \\cdot 300} = 5{,}0\\cdot 10^{25}\\text{ phân tử/m}^3$.'
        ],
        finalAnswer: '$\\overline{E}_đ = 6{,}21\\cdot 10^{-21}\\text{ J}$; mật độ $\\mu = 5\\cdot 10^{25}\\text{ m}^{-3}$.'
      }
    ]
  },
  {
    id: 'phys-12-b13',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương II · Khí lí tưởng',
    sourceTag: SRC_12,
    lessonNumber: 13,
    title: 'Bài 13: Bài tập về khí lí tưởng',
    subtitle: 'Giải đồ thị chu trình đẳng quá trình, bài toán ống thủy ngân/pít-tông cân bằng và nội năng khí đơn nguyên tử',
    description:
      'Tổng hợp các bài tập phân hóa Chương Khí lí tưởng: chuyển đổi qua lại giữa 3 hệ đồ thị $(p-V), (V-T), (p-T)$, bài toán pít-tông có lò xo/thủy ngân và khí thông bình.',
    theorySections: [
      {
        heading: '1. Chuyển đổi đồ thị giữa $(p-V), (V-T), (p-T)$',
        content:
          '• **Đẳng tích**: thẳng đứng trong $(p-V)$, nằm ngang trong $(V-T)$? Không! Trong $(V-T)$ đẳng tích là đường nằm ngang song song $OT$; trong $(p-T)$ là đường thẳng xiên đi qua gốc $O$.\n• **Đẳng áp**: ngang trong $(p-V)$, xiên qua $O$ trong $(V-T)$, nằm ngang trong $(p-T)$.'
      },
      {
        heading: '2. Cân bằng cột thủy ngân / pít-tông & Khí thông nhau',
        content:
          '• Khi cột thủy ngân dài $h\\text{ (mm)}$ nằm trong ống đặt thẳng đứng miệng hướng lên: $p_{\\text{khí}} = p_0 + h$ ($\\text{mmHg}$); miệng hướng xuống: $p_{\\text{khí}} = p_0 - h$ ($760\\text{ mmHg} \\approx 1\\text{ atm}$).\n• Khi mở van nối hai bình thông nhau đẳng nhiệt: bảo toàn lượng chất $p_1 V_1 + p_2 V_2 = p (V_1 + V_2)$.'
      }
    ],
    keyFormulas: [
      'p_{\\text{khí}} = p_0 \\pm h_{\\text{Hg}}',
      'p_1 V_1 + p_2 V_2 = p(V_1 + V_2) \\quad (T = \\text{const})',
      'U = \\frac{3}{2} n R T \\quad (\\text{Khí lí tưởng đơn nguyên tử})'
    ],
    ...SIM_PRESETS.thermal_gas,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Nối hai bình cách nhiệt đẳng nhiệt gồm bình 1 ($V_1 = 4\\text{ lít}, p_1 = 2\\text{ atm}$) và bình 2 ($V_2 = 6\\text{ lít}, p_2 = 3\\text{ atm}$) qua một khóa K nhỏ. Khi mở khóa K, áp suất chung của hai bình là:',
        options: ['A. $2{,}5\\text{ atm}$', 'B. $2{,}6\\text{ atm}$', 'C. $2{,}4\\text{ atm}$', 'D. $5{,}0\\text{ atm}$'],
        correctIndex: 1,
        explanation: '$p = \\frac{p_1 V_1 + p_2 V_2}{V_1 + V_2} = \\frac{2\\cdot 4 + 3\\cdot 6}{4 + 6} = \\frac{26}{10} = 2{,}6\\text{ atm}$.'
      },
      {
        source: SRC_12,
        question: 'Một ống nghiệm tiết diện đều đặt nằm ngang, giam một lượng khí chiều dài $L_0 = 24\\text{ cm}$ bằng cột thủy ngân dài $h = 12\\text{ cm}$ (áp suất khí quyển $p_0 = 76\\text{ cmHg}$). Nếu dựng ống thẳng đứng miệng hướng lên (nhiệt độ không đổi), chiều dài cột khí bằng:',
        options: ['A. $20{,}7\\text{ cm}$', 'B. $28{,}5\\text{ cm}$', 'C. $24{,}0\\text{ cm}$', 'D. $18{,}0\\text{ cm}$'],
        correctIndex: 0,
        explanation: 'Áp suất lúc sau $p_2 = 76 + 12 = 88\\text{ cmHg}$. Đẳng nhiệt: $L_2 = L_0\\frac{p_0}{p_2} = 24 \\cdot \\frac{76}{88} \\approx 20{,}7\\text{ cm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một bọt khí nổi lên từ đáy hồ sâu $h = 10\\text{ m}$ lên mặt thoáng ($T_{\\text{đáy}} = 7^\\circ\\text{C}$, $T_{\\text{mặt}} = 27^\\circ\\text{C}$). Biết áp suất khí quyển là $p_0 = 10^5\\text{ Pa}$ và mỗi $10\\text{ m}$ sâu của nước tạo áp suất thêm $10^5\\text{ Pa}$. Hỏi thể tích bọt khí khi tới mặt thoáng tăng gấp mấy lần?',
        hints: ['Áp suất tại đáy là $p_1 = p_0 + 10^5 = 2\\cdot 10^5\\text{ Pa}$. Dùng $\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}$.'],
        solutionSteps: [
          'Bước 1: $p_1 = 2\\cdot 10^5\\text{ Pa}, T_1 = 280\\text{ K}$; tại mặt thoáng $p_2 = 10^5\\text{ Pa}, T_2 = 300\\text{ K}$.',
          'Bước 2: Tỉ số thể tích: $\\frac{V_2}{V_1} = \\frac{p_1}{p_2}\\cdot\\frac{T_2}{T_1} = \\frac{2\\cdot 10^5}{10^5}\\cdot\\frac{300}{280} \\approx 2{,}14$ lần.'
        ],
        finalAnswer: 'Thể tích bọt khí tăng lên khoảng $2{,}14$ lần.'
      }
    ]
  },

  // ================= CHƯƠNG III. TỪ TRƯỜNG (BÀI 14 - 20) =================
  {
    id: 'phys-12-b14',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương III · Từ trường',
    sourceTag: SRC_12,
    lessonNumber: 14,
    title: 'Bài 14: Từ trường',
    subtitle: 'Tương tác từ, vectơ cảm ứng từ của dòng điện và quy tắc nắm tay phải xác định đường sức từ',
    description:
      'Khám phá nguồn gốc của từ trường (dòng điện và nam châm), đặc điểm đường sức từ (luôn là đường cong kín) và quy tắc nắm tay phải cho dây thẳng, vòng tròn và ống dây điện.',
    theorySections: [
      {
        heading: '1. Khái niệm Từ trường & Đường sức từ',
        content:
          '• **Từ trường** là môi trường vật chất bao quanh dòng điện hoặc nam châm, tác dụng **lực từ** lên dòng điện hoặc nam châm khác đặt trong nó.\n• **Đường sức từ** có chiều đi ra từ cực Bắc (N) và đi vào cực Nam (S) bên ngoài nam châm; chúng luôn là **đường cong khép kín** (khác đường sức điện tĩnh!).'
      },
      {
        heading: '2. Từ phổ & Quy tắc nắm tay phải',
        content:
          '• Dây dẫn thẳng dài: nắm bàn tay phải sao cho ngón cái choãi ra chỉ chiều dòng điện $I$, thì bốn ngón tay khum lại chỉ chiều các đường sức từ tròn đồng tâm.\n• Ống dây hình trụ: khum bốn ngón tay theo chiều dòng điện chạy qua các vòng dây, ngón cái choãi ra chỉ chiều đường sức từ bên trong lòng ống dây (chỉ cực Bắc của ống dây).'
      }
    ],
    keyFormulas: [
      '\\text{Đường sức từ: Ra Bắc (N), Vào Nam (S) (đường cong kín)}',
      'B_{\\text{trong ống dây}} = \\text{đều}'
    ],
    ...SIM_PRESETS.mag_induction,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Tính chất nào sau đây là đúng khi nói về đường sức từ?',
        options: [
          'A. Bắt đầu từ điện tích dương và kết thúc ở điện tích âm',
          'B. Là các đường cong hở không khép kín',
          'C. Là các đường cong khép kín, không cắt nhau',
          'D. Luôn hướng từ cực Nam ra cực Bắc bên ngoài nam châm'
        ],
        correctIndex: 2,
        explanation: 'Từ trường là trường xoáy nên các đường sức từ luôn khép kín (ra Bắc vào Nam bên ngoài, đi từ Nam sang Bắc bên trong nam châm).'
      },
      {
        source: SRC_12,
        question: 'Hai dây dẫn thẳng dài song song mang hai dòng điện cùng chiều sẽ:',
        options: ['A. Đẩy nhau', 'B. Hút nhau', 'C. Không tương tác', 'D. Xoắn vuông góc nhau'],
        correctIndex: 1,
        explanation: 'Hai dòng điện song song cùng chiều hút nhau; ngược chiều đẩy nhau.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'So sánh đường sức điện trường tĩnh và đường sức từ về hình dạng và chiều.',
        hints: ['Đường sức tĩnh điện xuất phát từ $+q$ và kết thúc ở $-q$ (đường hở); đường sức từ luôn khép kín.'],
        solutionSteps: [
          'Bước 1: Về hình dạng: đường sức tĩnh điện là đường cong hở (bắt đầu từ điện tích dương hoặc vô cực, kết thúc ở điện tích âm hoặc vô cực); đường sức từ luôn là đường cong khép kín.',
          'Bước 2: Giống nhau: qua mỗi điểm trong trường chỉ vẽ được duy nhất 1 đường sức (không cắt nhau), nơi trường mạnh đường sức dày, nơi yếu thưa hơn.'
        ],
        finalAnswer: 'Đường sức tĩnh điện là đường hở; đường sức từ là đường cong kín.'
      }
    ]
  },
  {
    id: 'phys-12-mag',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương III · Từ trường',
    sourceTag: SRC_12,
    lessonNumber: 15,
    title: 'Bài 15: Lực từ tác dụng lên dây dẫn mang dòng điện. Cảm ứng từ',
    subtitle: 'Công thức lực từ F = B·I·L·sinθ, định nghĩa cảm ứng từ B (Tesla) và quy tắc bàn tay trái',
    description:
      'Xác định phương, chiều (theo quy tắc bàn tay trái) và độ lớn của lực từ $F = B I L \\sin\\theta$ tác dụng lên đoạn dây mang dòng điện đặt trong từ trường đều; nắm vững phép đo độ lớn cảm ứng từ $B$.',
    theorySections: [
      {
        heading: '1. Vectơ Lực từ & Quy tắc bàn tay trái',
        content:
          '• Lực từ $\\vec{F}$ tác dụng lên đoạn dây dài $L$ mang dòng điện $I$ đặt trong từ trường đều $\\vec{B}$ có:\n  – **Phương**: vuông góc với mặt phẳng chứa đoạn dây và $\\vec{B}$.\n  – **Chiều**: theo **quy tắc bàn tay trái** (đặt bàn tay trái hứng $\\vec{B}$ xuyên vào lòng bàn tay, chiều từ cổ tay đến 4 ngón chỉ chiều dòng $I$, ngón cái choãi $90^\\circ$ chỉ chiều lực từ $\\vec{F}$).'
      },
      {
        heading: '2. Độ lớn Cảm ứng từ B & Lực từ',
        content:
          '• Cảm ứng từ $B = \\frac{F}{I L \\sin\\theta}$ đặc trưng cho độ mạnh yếu của từ trường về mặt tác dụng lực, đơn vị là **Tesla (T)**.\n• Công thức tổng quát: $F = B I L \\sin\\theta$ (với $\\theta$ là góc hợp bởi dòng điện $I$ và $\\vec{B}$). Khi dây song song đường sức ($\\theta = 0^\\circ$ hoặc $180^\\circ$) thì $F = 0$.'
      }
    ],
    keyFormulas: [
      'F = B \\cdot I \\cdot L \\sin\\theta',
      'B = \\frac{F}{I L \\sin\\theta} \\quad (\\text{đơn vị: Tesla, T})',
      'f_{\\text{Lorentz}} = |q| v B \\sin\\alpha'
    ],
    ...SIM_PRESETS.hall_lorentz,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Đoạn dây dẫn thẳng dài $0{,}4\\text{ m}$ mang dòng điện $I = 5\\text{ A}$ đặt vuông góc với các đường sức từ đều có $B = 0{,}25\\text{ T}$. Độ lớn lực từ tác dụng lên đoạn dây bằng:',
        options: ['A. $0{,}5\\text{ N}$', 'B. $0{,}25\\text{ N}$', 'C. $1{,}0\\text{ N}$', 'D. $0{,}1\\text{ N}$'],
        correctIndex: 0,
        explanation: '$F = B I L \\sin 90^\\circ = 0{,}25 \\cdot 5 \\cdot 0{,}4 = 0{,}5\\text{ N}$.'
      },
      {
        source: SRC_12,
        question: 'Khi đoạn dây mang dòng điện đặt hợp góc $\\theta = 30^\\circ$ với đường sức từ đều $B = 0{,}4\\text{ T}$ ($I = 10\\text{ A}, L = 0{,}5\\text{ m}$), lực từ tác dụng lên dây là:',
        options: ['A. $1{,}0\\text{ N}$', 'B. $2{,}0\\text{ N}$', 'C. $1{,}73\\text{ N}$', 'D. $0\\text{ N}$'],
        correctIndex: 0,
        explanation: '$F = 0{,}4 \\cdot 10 \\cdot 0{,}5 \\cdot \\sin 30^\\circ = 2{,}0 \\cdot 0{,}5 = 1{,}0\\text{ N}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một thanh đồng dài $L = 20\\text{ cm}$, khối lượng $m = 20\\text{ g}$ đặt nằm ngang trên hai thanh ray song song nhẵn trong từ trường đều $\\vec{B}$ thẳng đứng hướng lên ($B = 0{,}2\\text{ T}$). Cho dòng điện $I = 5\\text{ A}$ chạy qua thanh. Tính gia tốc ban đầu của thanh đồng.',
        hints: ['Vì $\\vec{B}$ thẳng đứng và thanh nằm ngang nên $\\theta = 90^\\circ$, lực từ nằm ngang đẩy thanh trên ray.'],
        solutionSteps: [
          'Bước 1: Lực từ nằm ngang tác dụng lên thanh: $F = B I L = 0{,}2 \\cdot 5 \\cdot 0{,}2 = 0{,}2\\text{ N}$.',
          'Bước 2: Áp dụng Định luật II Newton: $a = \\frac{F}{m} = \\frac{0{,}2}{0{,}02} = 10\\text{ m/s}^2$.'
        ],
        finalAnswer: '$F = 0{,}2\\text{ N}$; gia tốc thanh $a = 10\\text{ m/s}^2$.'
      }
    ]
  },
  {
    id: 'phys-12-b16',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương III · Từ trường',
    sourceTag: SRC_12,
    lessonNumber: 16,
    title: 'Bài 16: Từ thông. Hiện tượng cảm ứng điện từ',
    subtitle: 'Từ thông Φ = NBS·cosα (Weber), Định luật Faraday e_c = −ΔΦ/Δt và Định luật Lenz xác định chiều dòng cảm ứng',
    description:
      'Làm chủ công thức tính từ thông xuyên qua khung dây (lưu ý góc $\\alpha$ với pháp tuyến!), hiện tượng cảm ứng điện từ Faraday và quy tắc Định luật Lenz.',
    theorySections: [
      {
        heading: '1. Từ thông ($\Phi$)',
        content:
          '• Từ thông qua khung dây phẳng gồm $N$ vòng, diện tích $S$ đặt trong từ trường đều $\\vec{B}$:\n  $$\\Phi = N B S \\cos\\alpha$$\n  (đơn vị **Weber, Wb**; $\\alpha$ là góc giữa $\\vec{B}$ và **pháp tuyến $\\vec{n}$** của mặt khung; nếu đề cho góc $\\beta$ giữa $\\vec{B}$ và **mặt phẳng khung** thì $\\alpha = 90^\\circ - \\beta$).'
      },
      {
        heading: '2. Định luật Faraday & Định luật Lenz',
        content:
          '• Khi từ thông biến thiên, trong khung dây xuất hiện suất điện động cảm ứng tỉ lệ thuận với tốc độ biến thiên từ thông: $e_c = -\\frac{\\Delta\\Phi}{\\Delta t}$.\n• **Định luật Lenz**: Dòng điện cảm ứng luôn có chiều sao cho từ trường do nó sinh ra có tác dụng **chống lại sự biến thiên từ thông** ban đầu ($\\Phi$ tăng $\\Rightarrow \\vec{B}_c$ ngược chiều $\\vec{B}$; $\\Phi$ giảm $\\Rightarrow \\vec{B}_c$ cùng chiều $\\vec{B}$).'
      }
    ],
    keyFormulas: [
      '\\Phi = N B S \\cos\\alpha \\quad (\\text{Wb})',
      'e_c = -\\frac{\\Delta\\Phi}{\\Delta t} = -N\\frac{\\Delta(BS\\cos\\alpha)}{\\Delta t}',
      'I_c = \\frac{|e_c|}{R}'
    ],
    ...SIM_PRESETS.mag_faraday,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Một khung dây tròn gồm $50$ vòng, diện tích mỗi vòng $40\\text{ cm}^2$ đặt vuông góc với đường sức từ đều ($\alpha = 0^\\circ$). Cảm ứng từ giảm đều từ $0{,}6\\text{ T}$ về $0{,}1\\text{ T}$ trong $0{,}05\\text{ s}$. Độ lớn suất điện động cảm ứng bằng:',
        options: ['A. $2{,}0\\text{ V}$', 'B. $0{,}2\\text{ V}$', 'C. $20\\text{ V}$', 'D. $4{,}0\\text{ V}$'],
        correctIndex: 0,
        explanation: '$|e_c| = N S \\frac{|\\Delta B|}{\\Delta t} = 50 \\cdot 40\\cdot 10^{-4} \\cdot \\frac{0{,}5}{0{,}05} = 0{,}2 \\cdot 10 = 2{,}0\\text{ V}$.'
      },
      {
        source: SRC_12,
        question: 'Khi đưa cực Nam (S) của nam châm lại gần mặt một vòng dây dẫn kín, vòng dây sẽ xuất hiện dòng điện cảm ứng sao cho mặt đối diện nam châm là:',
        options: ['A. Cực Nam (S) để đẩy nam châm', 'B. Cực Bắc (N) để hút nam châm', 'C. Không có cực từ', 'D. Chỉ phụ thuộc kích thước dây'],
        correctIndex: 0,
        explanation: 'Theo Định luật Lenz, từ thông tăng nên vòng dây tạo lực đẩy cản nam châm tiến lại → mặt đối diện cũng là cực Nam (S).'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một khung dây vuông cạnh $a = 10\\text{ cm}$ gồm $100$ vòng dây có tổng điện trở $R = 4\\,\\Omega$ đặt sao cho mặt phẳng khung hợp với đường sức từ đều ($B = 0{,}2\\text{ T}$) góc $30^\\circ$. Quay khung đến vị trí song song đường sức trong thời gian $0{,}05\\text{ s}$. Tính cường độ dòng điện cảm ứng trung bình.',
        hints: ['Mặt phẳng hợp $\\vec{B}$ góc $30^\\circ \\implies$ góc với pháp tuyến $\\alpha_1 = 60^\\circ$. Song song đường sức $\\implies \\alpha_2 = 90^\\circ$.'],
        solutionSteps: [
          'Bước 1: $S = 0{,}1^2 = 0{,}01\\text{ m}^2$. Từ thông ban đầu: $\\Phi_1 = 100 \\cdot 0{,}2 \\cdot 0{,}01 \\cdot \\cos 60^\\circ = 0{,}1\\text{ Wb}$.',
          'Bước 2: Lúc sau $\\Phi_2 = 0 \\implies |e_c| = \\frac{0{,}1}{0{,}05} = 2\\text{ V}$.',
          'Bước 3: Cường độ dòng cảm ứng trung bình: $I_c = \\frac{|e_c|}{R} = \\frac{2}{4} = 0{,}5\\text{ A}$.'
        ],
        finalAnswer: '$I_c = 0{,}5\\text{ A}$.'
      }
    ]
  },
  {
    id: 'phys-12-ac-gen',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương III · Từ trường',
    sourceTag: SRC_12,
    lessonNumber: 17,
    title: 'Bài 17: Máy phát điện xoay chiều',
    subtitle: 'Nguyên tắc quay khung dây tạo dòng điện xoay chiều hình sin, giá trị hiệu dụng I = I₀/√2, U = U₀/√2 và ứng dụng',
    description:
      'Phân tích cấu tạo (phần cảm rôto, phần ứng stato) và hoạt động của máy phát điện xoay chiều một pha, biểu thức suất điện động tức thời $e = E_0\\sin(\\omega t)$ và ý nghĩa các giá trị hiệu dụng.',
    theorySections: [
      {
        heading: '1. Nguyên tắc tạo suất điện động xoay chiều hình sin',
        content:
          '• Khi khung dây $N$ vòng diện tích $S$ quay đều với tốc độ góc $\\omega$ trong từ trường đều $\\vec{B}$ quanh trục vuông góc với $\\vec{B}$, từ thông biến thiên điều hòa: $\\Phi = NBS\\cos(\\omega t + \\varphi_0)$.\n• Suất điện động cảm ứng xoay chiều sinh ra:\n  $$e = -\\Phi\'(t) = \\omega N B S \\sin(\\omega t + \\varphi_0) = E_0 \\sin(\\omega t + \\varphi_0)$$\n• Tần số dòng điện do máy phát $p$ cặp cực quay với tốc độ $n$ (vòng/giây): $f = n \\cdot p$.'
      },
      {
        heading: '2. Giá trị cực đại và giá trị hiệu dụng',
        content:
          '• Giá trị hiệu dụng của dòng xoay chiều được định nghĩa dựa trên tác dụng tỏa nhiệt tương đương dòng không đổi:\n  $$I = \\frac{I_0}{\\sqrt{2}}, \\qquad U = \\frac{U_0}{\\sqrt{2}}, \\qquad E = \\frac{E_0}{\\sqrt{2}}$$'
      }
    ],
    keyFormulas: [
      'e = E_0 \\sin(\\omega t + \\varphi_0), \\quad E_0 = \\omega N B S',
      'I = \\frac{I_0}{\\sqrt{2}}, \\quad U = \\frac{U_0}{\\sqrt{2}}, \\quad E = \\frac{E_0}{\\sqrt{2}}',
      'f = n \\cdot p \\quad (\\text{vòng/giây} \\times \\text{cặp cực})'
    ],
    ...SIM_PRESETS.ac_rlc,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Mạng điện xoay chiều dân dụng Việt Nam có điện áp hiệu dụng $U = 220\\text{ V}$, tần số $50\\text{ Hz}$. Điện áp cực đại $U_0$ trên hai lỗ ổ cắm là:',
        options: ['A. $220\\text{ V}$', 'B. $220\\sqrt{2}\\text{ V}$ ($\approx 311\\text{ V}$)', 'C. $110\\sqrt{2}\\text{ V}$', 'D. $440\\text{ V}$'],
        correctIndex: 1,
        explanation: '$U_0 = U\\sqrt{2} = 220\\sqrt{2} \\approx 311\\text{ V}$.'
      },
      {
        source: SRC_12,
        question: 'Một máy phát điện xoay chiều một pha có phần cảm gồm $4$ cặp cực từ ($p = 4$) quay với tốc độ $750\\text{ vòng/phút}$. Tần số dòng điện phát ra là:',
        options: ['A. $50\\text{ Hz}$', 'B. $60\\text{ Hz}$', 'C. $25\\text{ Hz}$', 'D. $100\\text{ Hz}$'],
        correctIndex: 0,
        explanation: 'Đổi $n = 750/60 = 12{,}5\\text{ vòng/s} \\implies f = n\\cdot p = 12{,}5 \\cdot 4 = 50\\text{ Hz}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Khung dây gồm $500$ vòng diện tích $200\\text{ cm}^2$ quay đều $3000\\text{ vòng/phút}$ trong từ trường đều $B = 0{,}04\\text{ T}$. Tính tần số góc, suất điện động cực đại $E_0$ và suất điện động hiệu dụng $E$.',
        hints: ['Đổi $3000\\text{ vòng/phút} = 50\\text{ vòng/s} \\implies \\omega = 2\\pi f = 100\\pi\\text{ rad/s}$.'],
        solutionSteps: [
          'Bước 1: $f = \\frac{3000}{60} = 50\\text{ Hz} \\implies \\omega = 100\\pi\\text{ rad/s}$.',
          'Bước 2: $E_0 = \\omega N B S = 100\\pi \\cdot 500 \\cdot 0{,}04 \\cdot 0{,}02 = 40\\pi \\approx 125{,}7\\text{ V}$.',
          'Bước 3: Suất điện động hiệu dụng: $E = \\frac{40\\pi}{\\sqrt{2}} \\approx 88{,}9\\text{ V}$.'
        ],
        finalAnswer: '$\\omega = 100\\pi\\text{ rad/s}$; $E_0 \\approx 125{,}7\\text{ V}$; $E \\approx 88{,}9\\text{ V}$.'
      }
    ]
  },
  {
    id: 'phys-12-b18',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương III · Từ trường',
    sourceTag: SRC_12,
    lessonNumber: 18,
    title: 'Bài 18: Ứng dụng hiện tượng cảm ứng điện từ',
    subtitle: 'Máy biến áp lí tưởng U₁/U₂ = N₁/N₂, truyền tải điện năng đi xa, đàn guitar điện và phanh dòng điện xoáy Foucault',
    description:
      'Tìm hiểu các ứng dụng kỹ thuật cốt lõi của hiện tượng cảm ứng điện từ trong công nghiệp và đời sống: máy biến áp tăng/hạ áp, truyền tải điện cao thế, bếp từ – phanh từ dòng điện xoáy và đàn guitar điện.',
    theorySections: [
      {
        heading: '1. Máy biến áp & Truyền tải điện năng',
        content:
          '• **Máy biến áp** hoạt động dựa trên cảm ứng điện từ, biến đổi điện áp xoay chiều (không biến đổi tần số $f$!). Với máy biến áp lí tưởng:\n  $$\\frac{U_1}{U_2} = \\frac{N_1}{N_2} = \\frac{I_2}{I_1}$$\n• Công suất hao phí trên dây tải điện trở $R$: $\\Delta P = \\frac{P^2 R}{U^2}$. Tăng $U$ lên $k$ lần giúp giảm hao phí $k^2$ lần.'
      },
      {
        heading: '2. Dòng điện xoáy (Foucault) & Các thiết bị cảm ứng',
        content:
          '• Khi khối kim loại chuyển động trong từ trường hoặc đặt trong từ trường biến thiên sẽ sinh ra **dòng điện Foucault**: ứng dụng để đun nóng (bếp từ, lò cảm ứng) và hãm phanh không tiếp xúc; tác hại làm nóng lõi thép máy biến áp (khắc phục bằng cách ghép nhiều lá thép kĩ thuật điện mỏng sơn cách điện).'
      }
    ],
    keyFormulas: [
      '\\frac{U_1}{U_2} = \\frac{N_1}{N_2}',
      '\\Delta P_{\\text{dây}} = \\frac{P^2 R}{U^2}'
    ],
    ...SIM_PRESETS.transformer,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Một máy biến áp lí tưởng có cuộn sơ cấp $N_1 = 1000$ vòng đặt vào điện áp xoay chiều $220\\text{ V}$. Cuộn thứ cấp có $N_2 = 50$ vòng cho điện áp ra bằng:',
        options: ['A. $11\\text{ V}$', 'B. $4400\\text{ V}$', 'C. $22\\text{ V}$', 'D. $5{,}5\\text{ V}$'],
        correctIndex: 0,
        explanation: '$U_2 = U_1\\frac{N_2}{N_1} = 220\\cdot\\frac{50}{1000} = 11\\text{ V}$.'
      },
      {
        source: SRC_12,
        question: 'Lõi thép của máy biến áp được ghép từ nhiều lá thép kĩ thuật điện mỏng sơn cách điện với nhau nhằm mục đích chính là:',
        options: [
          'A. Giảm hao phí nhiệt do dòng điện xoáy (Foucault)',
          'B. Làm tăng tần số dòng điện ra',
          'C. Giảm khối lượng đồng cuộn dây',
          'D. Biến dòng xoay chiều thành dòng một chiều'
        ],
        correctIndex: 0,
        explanation: 'Chia nhỏ lõi thành các lá mỏng cách điện giúp cản trở vòng dòng điện Foucault, giảm tỏa nhiệt.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Truyền đi công suất $200\\text{ kW}$ trên đường dây tổng điện trở $R = 10\\,\\Omega$. Tính hiệu suất truyền tải khi dùng điện áp $U = 10\\text{ kV}$ và khi tăng áp lên $U\' = 50\\text{ kV}$.',
        hints: ['Tính $\\Delta P = P^2 R / U^2$ rồi suy ra hiệu suất $H = 1 - \\Delta P / P$.'],
        solutionSteps: [
          'Bước 1: Ở $U = 10\\text{ kV}$: $\\Delta P_1 = \\frac{(2\\cdot 10^5)^2 \\cdot 10}{(10^4)^2} = 4000\\text{ W} = 4\\text{ kW} \\implies H_1 = 1 - \\frac{4}{200} = 98\\%$.',
          'Bước 2: Tăng áp $5$ lần lên $50\\text{ kV}$: $\\Delta P_2 = \\frac{4}{5^2} = 0{,}16\\text{ kW} \\implies H_2 = 1 - \\frac{0{,}16}{200} = 99{,}92\\%$.'
        ],
        finalAnswer: 'Hiệu suất tăng từ $98\\%$ lên $99{,}92\\%$.'
      }
    ]
  },
  {
    id: 'phys-12-b19',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương III · Từ trường',
    sourceTag: SRC_12,
    lessonNumber: 19,
    title: 'Bài 19: Điện từ trường. Mô hình sóng điện từ',
    subtitle: 'Liên hệ điện trường biến thiên – từ trường biến thiên (Maxwell) và đặc điểm sóng ngang điện từ E ⊥ B ⊥ v',
    description:
      'Hiểu hai luận điểm của Maxwell về sự chuyển hóa lẫn nhau tạo nên trường thống nhất **Điện từ trường**, cấu trúc sóng điện từ lan truyền với vận tốc $c$ trong chân không và quy tắc bàn tay phải vặn đinh ốc.',
    theorySections: [
      {
        heading: '1. Trường Điện từ thống nhất (Thuyết Maxwell)',
        content:
          '• Nơi nào có **từ trường biến thiên** theo thời gian thì xuất hiện **điện trường xoáy** (đường sức là đường cong kín).\n• Nơi nào có **điện trường biến thiên** theo thời gian thì xuất hiện **từ trường**.\n• Điện trường biến thiên và từ trường biến thiên là hai mặt thể hiện của cùng một trường thống nhất gọi là **Điện từ trường**.'
      },
      {
        heading: '2. Mô hình Sóng điện từ',
        content:
          '• Sóng điện từ là sự lan truyền trong không gian của điện từ trường biến thiên.\n• Đặc điểm:\n  – Truyền được trong cả **chân không** (với tốc độ $c = 3\\cdot 10^8\\text{ m/s}$).\n  – Là **sóng ngang**: tại mọi điểm, hai vectơ $\\vec{E}$ và $\\vec{B}$ luôn vuông góc với nhau và vuông góc với phương truyền $\\vec{v}$ (lập thành tam diện thuận theo thứ tự $\\vec{E}, \\vec{B}, \\vec{v}$).\n  – $\\vec{E}$ và $\\vec{B}$ luôn **cùng pha** nhau tại mọi điểm!'
      }
    ],
    keyFormulas: [
      '\\vec{E} \\perp \\vec{B} \\perp \\vec{v}, \\quad \\vec{E} \\text{ và } \\vec{B} \\text{ cùng pha}',
      '\\lambda = \\frac{c}{f} = c \\cdot T \\quad (c = 3\\cdot 10^8\\text{ m/s})'
    ],
    ...SIM_PRESETS.em_wave,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Trong quá trình lan truyền sóng điện từ, tại một điểm bất kì trên phương truyền, vectơ cường độ điện trường $\\vec{E}$ và vectơ cảm ứng từ $\\vec{B}$ luôn:',
        options: [
          'A. Vuông góc về phương và cùng pha biến thiên',
          'B. Cùng phương và ngược pha',
          'C. Vuông góc về phương và lệch pha $\\pi/2$',
          'D. Song song với phương truyền sóng'
        ],
        correctIndex: 0,
        explanation: 'Trong sóng điện từ, $\\vec{E}$ và $\\vec{B}$ luôn vuông góc với nhau, vuông góc phương truyền và dao động cùng pha.'
      },
      {
        source: SRC_12,
        question: 'Một đài phát thanh FM phát sóng điện từ có tần số $100\\text{ MHz}$ trong không khí ($c = 3\\cdot 10^8\\text{ m/s}$). Bước sóng phát ra bằng:',
        options: ['A. $3\\text{ m}$', 'B. $30\\text{ m}$', 'C. $0{,}3\\text{ m}$', 'D. $300\\text{ m}$'],
        correctIndex: 0,
        explanation: '$\\lambda = \\frac{c}{f} = \\frac{3\\cdot 10^8}{100\\cdot 10^6} = 3\\text{ m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một sóng điện từ truyền thẳng theo hướng Bắc, tại một thời điểm vectơ $\\vec{E}$ hướng thẳng đứng lên trên. Xác định hướng của vectơ cảm ứng từ $\\vec{B}$ tại điểm đó.',
        hints: ['Dùng quy tắc vặn đinh ốc / bàn tay phải: quay từ $\\vec{E}$ sang $\\vec{B}$ một góc $90^\\circ$ thì tiến theo chiều truyền $\\vec{v}$.'],
        solutionSteps: [
          'Bước 1: Đặt ngón cái bàn tay phải chỉ chiều truyền $\\vec{v}$ (hướng Bắc).',
          'Bước 2: Để xoay từ $\\vec{E}$ (lên trên) sang $\\vec{B}$ thuận theo chiều khum ngón tay phải, $\\vec{B}$ phải hướng sang **Đông**.'
        ],
        finalAnswer: 'Vectơ $\\vec{B}$ hướng về phía Đông.'
      }
    ]
  },
  {
    id: 'phys-12-b20',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương III · Từ trường',
    sourceTag: SRC_12,
    lessonNumber: 20,
    title: 'Bài 20: Bài tập về từ trường',
    subtitle: 'Bài toán tổng hợp lực từ cân bằng thanh, thanh dẫn trượt trong từ trường cắt đường sức và đồ thị từ thông Φ(t)',
    description:
      'Luyện giải trọn bộ bài toán nâng cao Chương Từ trường: cân bằng thanh dẫn trên mặt nghiêng có dòng điện, suất điện động cảm ứng thanh chuyển động $|e_c| = B l v$ và bài toán đồ thị $\\Phi(t) - e_c(t)$.',
    theorySections: [
      {
        heading: '1. Thanh kim loại chuyển động cắt đường sức từ',
        content:
          '• Khi thanh kim loại dài $l$ chuyển động đều với vận tốc $v$ vuông góc với thanh và vuông góc với $\\vec{B}$ trên hai thanh ray khép kín qua điện trở $R$:\n  – Suất điện động cảm ứng: $|e_c| = B l v$.\n  – Dòng điện cảm ứng $I_c = \\frac{Blv}{R}$ sinh ra lực từ cản chuyển động $F_{\\text{từ}} = B I_c l = \\frac{B^2 l^2 v}{R}$.'
      },
      {
        heading: '2. Đọc đồ thị Từ thông $\\Phi(t)$ & Dòng cảm ứng',
        content:
          '• Độ lớn suất điện động cảm ứng trên mỗi đoạn thẳng của đồ thị $\\Phi(t)$ bằng **giá trị tuyệt đối hệ số góc** $\\left|\\frac{\\Delta\\Phi}{\\Delta t}\\right|$. Nếu $\\Phi$ không đổi ($\\Delta\\Phi = 0$) thì $e_c = 0$.'
      }
    ],
    keyFormulas: [
      '|e_c| = B l v \\sin\\theta',
      'F_{\\text{hỗ trợ giữ } v=\\text{const}} = \\frac{B^2 l^2 v}{R}'
    ],
    ...SIM_PRESETS.mag_induction,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Thanh dẫn dài $0{,}5\\text{ m}$ trượt đều tốc độ $4\\text{ m/s}$ vuông góc với từ trường đều $B = 0{,}3\\text{ T}$ trên hai ray nối với điện trở $R = 3\\,\\Omega$. Dòng điện cảm ứng chạy qua $R$ bằng:',
        options: ['A. $0{,}2\\text{ A}$', 'B. $0{,}6\\text{ A}$', 'C. $1{,}8\\text{ A}$', 'D. $0{,}1\\text{ A}$'],
        correctIndex: 0,
        explanation: '$|e_c| = B l v = 0{,}3 \\cdot 0{,}5 \\cdot 4 = 0{,}6\\text{ V} \\implies I = \\frac{0{,}6}{3} = 0{,}2\\text{ A}$.'
      },
      {
        source: SRC_12,
        question: 'Một máy bay có sải cánh dài $40\\text{ m}$ bay ngang tốc độ $250\\text{ m/s}$ qua vùng từ trường Trái Đất có thành phần thẳng đứng $B_y = 5\\cdot 10^{-5}\\text{ T}$. Hiệu điện thế giữa hai đầu mút cánh bằng:',
        options: ['A. $0{,}5\\text{ V}$', 'B. $5{,}0\\text{ V}$', 'C. $0{,}05\\text{ V}$', 'D. $2{,}5\\text{ V}$'],
        correctIndex: 0,
        explanation: '$|e_c| = B_y l v = 5\\cdot 10^{-5} \\cdot 40 \\cdot 250 = 0{,}5\\text{ V}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Một khung dây tròn bán kính $r = 10\\text{ cm}$, điện trở $R = 0{,}5\\,\\Omega$ đặt vuông góc từ trường đều $B$ tăng đều từ $0$ lên $0{,}5\\text{ T}$ trong $0{,}2\\text{ s}$. Tính cường độ dòng điện cảm ứng và nhiệt lượng tỏa ra trên khung trong thời gian đó.',
        hints: ['Diện tích $S = \\pi r^2$, tính $|e_c| = S \\Delta B / \\Delta t$, $I_c = |e_c|/R$, $Q = I_c^2 R \\Delta t$.'],
        solutionSteps: [
          'Bước 1: $S = \\pi (0{,}1)^2 \\approx 0{,}0314\\text{ m}^2$. $|e_c| = 0{,}0314 \\cdot \\frac{0{,}5}{0{,}2} \\approx 0{,}0785\\text{ V}$.',
          'Bước 2: $I_c = \\frac{0{,}0785}{0{,}5} \\approx 0{,}157\\text{ A}$.',
          'Bước 3: Nhiệt lượng tỏa ra: $Q = I_c^2 R \\Delta t = 0{,}157^2 \\cdot 0{,}5 \\cdot 0{,}2 \\approx 2{,}47\\cdot 10^{-3}\\text{ J}$.'
        ],
        finalAnswer: '$I_c \\approx 0{,}157\\text{ A}$; $Q \\approx 2{,}47\\text{ mJ}$.'
      }
    ]
  },

  // ================= CHƯƠNG IV. VẬT LÍ HẠT NHÂN (BÀI 21 - 25) =================
  {
    id: 'phys-12-b21',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương IV · Vật lí hạt nhân',
    sourceTag: SRC_12,
    lessonNumber: 21,
    title: 'Bài 21: Cấu trúc hạt nhân',
    subtitle: 'Thí nghiệm tán xạ hạt α Rutherford, kí hiệu hạt nhân ᴬ_Z X, đồng vị và bán kính hạt nhân R = 1,2·10⁻¹⁵·A^(1/3) m',
    description:
      'Khám phá thí nghiệm lá vàng mỏng của Rutherford mở ra cấu trúc hạt nhân nhỏ đặc mang điện dương, kí hiệu nuclôn ($Z$ prôtôn, $N = A-Z$ nơtron), đồng vị và kích thước siêu nhỏ của hạt nhân.',
    theorySections: [
      {
        heading: '1. Thí nghiệm Rutherford & Thành phần hạt nhân',
        content:
          '• Thí nghiệm bắn hạt $\\alpha$ vào lá vàng mỏng chứng minh phần lớn nguyên tử là khoảng trống; điện tích dương và hầu hết khối lượng tập trung tại **hạt nhân** ở tâm với đường kính cỡ $10^{-15}\\text{ m}$ (gấp $10^{-5}$ lần kích thước nguyên tử).\n• Kí hiệu hạt nhân: ${}^A_Z\\text{X}$, gồm $Z$ prôtôn (điện tích $+e$) và $N = A - Z$ nơtron (trung hòa), gọi chung là $A$ **nuclôn**.'
      },
      {
        heading: '2. Đồng vị, Đơn vị khối lượng nguyên tử & Kích thước hạt nhân',
        content:
          '• **Đồng vị** là các hạt nhân có cùng số prôtôn $Z$ nhưng khác số nơtron $N$ (khác số khối $A$).\n• Đơn vị khối lượng nguyên tử $\\text{amu}$ (kí hiệu $\\text{u}$): $1\\text{ amu} \\approx 1{,}6605\\cdot 10^{-27}\\text{ kg}$, $1\\text{ amu}\\cdot c^2 \\approx 931{,}5\\text{ MeV}$.\n• Bán kính hạt nhân tỉ lệ với $A^{1/3}$: $R \\approx 1{,}2\\cdot 10^{-15}\\cdot A^{1/3}\\text{ (m)}$ (nên mọi hạt nhân đều có khối lượng riêng xấp xỉ nhau!).'
      }
    ],
    keyFormulas: [
      'N = A - Z \\quad (\\text{Số nơtron})',
      'R \\approx 1{,}2\\cdot 10^{-15}\\cdot A^{1/3}\\text{ (m)}',
      '1\\text{ u} \\cdot c^2 \\approx 931{,}5\\text{ MeV}'
    ],
    ...SIM_PRESETS.rutherford,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Hạt nhân Urani ${}^{235}_{92}\\text{U}$ có số prôtôn và số nơtron lần lượt là:',
        options: ['A. $92$ và $143$', 'B. $92$ và $235$', 'C. $143$ và $92$', 'D. $235$ và $92$'],
        correctIndex: 0,
        explanation: '$Z = 92$ prôtôn; số nơtron $N = 235 - 92 = 143$.'
      },
      {
        source: SRC_12,
        question: 'Bán kính hạt nhân ${}^{64}\\text{Cu}$ lớn gấp bao nhiêu lần bán kính hạt nhân ${}^8\\text{Be}$?',
        options: ['A. $2$ lần', 'B. $8$ lần', 'C. $4$ lần', 'D. $64$ lần'],
        correctIndex: 0,
        explanation: '$\\frac{R_{\\text{Cu}}}{R_{\\text{Be}}} = \\left(\\frac{64}{8}\\right)^{1/3} = 8^{1/3} = 2$ lần.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Tính tỉ số giữa khối lượng riêng của hạt nhân ${}^{56}_{26}\\text{Fe}$ và hạt nhân ${}^{12}_6\\text{C}$. Giải thích kết quả thu được.',
        hints: ['Thể tích hạt nhân $V = \\frac{4}{3}\\pi R^3 \\propto A$, khối lượng $m \\approx A\\text{ (u)}$.'],
        solutionSteps: [
          'Bước 1: Do $R = R_0 A^{1/3}$ nên thể tích $V = \\frac{4}{3}\\pi R_0^3 A$ tỉ lệ thuận với $A$.',
          'Bước 2: Khối lượng riêng $\\rho = \\frac{m}{V} \\approx \\frac{A\\cdot 1\\text{ u}}{\\frac{4}{3}\\pi R_0^3 A} = \\text{const}$ không phụ thuộc số khối $A$.'
        ],
        finalAnswer: 'Tỉ số khối lượng riêng xấp xỉ $1$ (mọi hạt nhân có mật độ vật chất siêu đặc gần như nhau).'
      }
    ]
  },
  {
    id: 'phys-12-nuclear',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương IV · Vật lí hạt nhân',
    sourceTag: SRC_12,
    lessonNumber: 22,
    title: 'Bài 22: Phản ứng hạt nhân và năng lượng liên kết',
    subtitle: 'Lực hạt nhân, độ hụt khối Δm, năng lượng liên kết riêng, các định luật bảo toàn & phản ứng phân hạch – nhiệt hạch',
    description:
      'Tính độ hụt khối $\\Delta m$ và năng lượng liên kết riêng $W_{\\text{lk}}/A$ đánh giá độ bền hạt nhân, áp dụng bảo toàn $(Z, A)$ giải phương trình phản ứng hạt nhân và tính năng lượng tỏa/thu.',
    theorySections: [
      {
        heading: '1. Lực hạt nhân, Độ hụt khối & Năng lượng liên kết riêng',
        content:
          '• **Lực hạt nhân** (tương tác mạnh) giữ các nuclôn liên kết chặt, chỉ có bán kính tác dụng cỡ $10^{-15}\\text{ m}$ và không phụ thuộc điện tích.\n• **Độ hụt khối**: $\\Delta m = Z m_p + (A - Z)m_n - m_X$.\n• **Năng lượng liên kết**: $E_{\\text{lk}} = \\Delta m\\cdot c^2$. **Năng lượng liên kết riêng** $\\varepsilon = \\frac{E_{\\text{lk}}}{A}$ càng lớn thì hạt nhân càng bền vững (cực đại quanh ${}^{56}\\text{Fe}$).'
      },
      {
        heading: '2. Phản ứng hạt nhân, Phân hạch & Nhiệt hạch',
        content:
          '• Tuân theo bảo toàn: **Số nuclôn $A$**, **Điện tích $Z$**, **Năng lượng toàn phần** và **Động lượng**.\n• Năng lượng phản ứng: $\\Delta E = (m_{\\text{trước}} - m_{\\text{sau}})c^2 = E_{\\text{lk sau}} - E_{\\text{lk trước}}$ ($\\Delta E > 0$ là phản ứng tỏa năng lượng).\n• **Phân hạch**: hạt nhân nặng (${}^{235}\\text{U}, {}^{239}\\text{Pu}$) vỡ thành hạt trung bình khi hấp thụ nơtron chậm.\n• **Nhiệt hạch**: các hạt nhân rất nhẹ (${}^2\\text{H}, {}^3\\text{H}$) tổng hợp thành Heli ở nhiệt độ hàng chục triệu Kelvin (nguồn năng lượng của Mặt Trời & các sao).'
      }
    ],
    keyFormulas: [
      '\\Delta m = Z m_p + (A - Z)m_n - m_X',
      'E_{\\text{lk}} = \\Delta m\\cdot c^2, \\quad E_{\\text{lkr}} = \\frac{E_{\\text{lk}}}{A}',
      '\\Delta E = (m_{\\text{trước}} - m_{\\text{sau}})c^2 = \\sum E_{\\text{lk sau}} - \\sum E_{\\text{lk trước}}'
    ],
    ...SIM_PRESETS.binding_energy,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Trong phản ứng hạt nhân ${}^2_1\\text{H} + {}^3_1\\text{H} \\to {}^4_2\\text{He} + X$, hạt X là:',
        options: ['A. Nơtron (${}^1_0\\text{n}$)', 'B. Prôtôn (${}^1_1\\text{p}$)', 'C. Electron (${}^0_{-1}\\text{e}$)', 'D. Positron (${}^0_{+1}\\text{e}$)'],
        correctIndex: 0,
        explanation: 'Bảo toàn $A$: $2 + 3 = 4 + A_X \\implies A_X = 1$. Bảo toàn $Z$: $1 + 1 = 2 + Z_X \\implies Z_X = 0$. Vậy $X$ là nơtron.'
      },
      {
        source: SRC_12,
        question: 'Cho năng lượng liên kết của các hạt nhân ${}^4_2\\text{He}$, ${}^{12}_6\\text{C}$ và ${}^{56}_{26}\\text{Fe}$ lần lượt là $28{,}4\\text{ MeV}$; $92{,}2\\text{ MeV}$ và $492{,}3\\text{ MeV}$. Sắp xếp theo thứ tự bền vững tăng dần:',
        options: [
          'A. He → C → Fe',
          'B. Fe → C → He',
          'C. C → He → Fe',
          'D. He → Fe → C'
        ],
        correctIndex: 0,
        explanation: 'Tính $E_{\\text{lkr}} = E_{\\text{lk}}/A$: $\\text{He} \\approx 7{,}10$; $\\text{C} \\approx 7{,}68$; $\\text{Fe} \\approx 8{,}79\\text{ MeV/nuclôn}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Xét phản ứng nhiệt hạch ${}^2_1\\text{H} + {}^3_1\\text{H} \\to {}^4_2\\text{He} + {}^1_0\\text{n}$. Biết năng lượng liên kết riêng của ${}^2\\text{H}$ là $1{,}11\\text{ MeV/nuclôn}$, của ${}^3\\text{H}$ là $2{,}83\\text{ MeV/nuclôn}$ và của ${}^4\\text{He}$ là $7{,}07\\text{ MeV/nuclôn}$. Tính năng lượng tỏa ra của mỗi phản ứng.',
        hints: ['Tính $E_{\\text{lk}} = A\\cdot E_{\\text{lkr}}$ cho từng hạt (nơtron đứng tự do có $E_{\\text{lk}} = 0$).'],
        solutionSteps: [
          'Bước 1: $E_{\\text{lk}}({}^2\\text{H}) = 2 \\cdot 1{,}11 = 2{,}22\\text{ MeV}$; $E_{\\text{lk}}({}^3\\text{H}) = 3 \\cdot 2{,}83 = 8{,}49\\text{ MeV}$.',
          'Bước 2: $E_{\\text{lk}}({}^4\\text{He}) = 4 \\cdot 7{,}07 = 28{,}28\\text{ MeV}$.',
          'Bước 3: Năng lượng tỏa ra: $\\Delta E = 28{,}28 - (2{,}22 + 8{,}49) = 17{,}57\\text{ MeV}$.'
        ],
        finalAnswer: '$\\Delta E \\approx 17{,}57\\text{ MeV}$.'
      }
    ]
  },
  {
    id: 'phys-12-b23',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương IV · Vật lí hạt nhân',
    sourceTag: SRC_12,
    lessonNumber: 23,
    title: 'Bài 23: Hiện tượng phóng xạ',
    subtitle: 'Bản chất các tia α, β⁺, β⁻, γ, định luật phân rã mũ N(t) = N₀·2^(-t/T), độ phóng xạ H = λN và an toàn bức xạ',
    description:
      'Phân tích bản chất vật lí của 4 loại tia phóng xạ ($\\alpha, \\beta^-, \\beta^+, \\gamma$), tính số hạt còn lại/bị phân rã qua chu kì bán rã $T$, định tuổi cổ vật bằng ${}^{14}\\text{C}$ và 3 nguyên tắc an toàn phóng xạ.',
    theorySections: [
      {
        heading: '1. Các tia phóng xạ tự nhiên',
        content:
          '• **Tia $\\alpha$** (${}^4_2\\text{He}$): mang điện $+2e$, khả năng ion hóa không khí cực mạnh, đâm xuyên kém (bị chặn bởi tờ giấy).\n• **Tia $\\beta^-$** (${}^0_{-1}e$) và **$\\beta^+$** (${}^0_{+1}e$): bay tốc độ gần $c$, đâm xuyên trung bình (chắn bởi tấm nhôm dày vài mm).\n• **Tia $\\gamma$**: sóng điện từ bước sóng siêu ngắn, không mang điện (không bị lệch trong điện/từ trường), đâm xuyên cực mạnh (cần chì hoặc bê tông dày).'
      },
      {
        heading: '2. Định luật phóng xạ & Độ phóng xạ',
        content:
          '• Số hạt nhân còn lại sau thời gian $t$: $N(t) = N_0 \\cdot 2^{-t/T} = N_0 e^{-\\lambda t}$ (với hằng số phóng xạ $\\lambda = \\frac{\\ln 2}{T}$).\n• Số hạt nhân đã bị phân rã: $\\Delta N = N_0 (1 - 2^{-t/T})$.\n• **Độ phóng xạ ($H$)**: đặc trưng cho tính phóng xạ mạnh hay yếu (đo bằng Becquerel, $1\\text{ Bq} = 1\\text{ phân rã/s}$): $H(t) = \\lambda N(t) = H_0 \\cdot 2^{-t/T}$.'
      }
    ],
    keyFormulas: [
      'N(t) = N_0 \\cdot 2^{-t/T} = N_0 e^{-\\lambda t}',
      '\\lambda = \\frac{\\ln 2}{T}, \\qquad H = \\lambda N \\text{ (Bq)}',
      '\\Delta N = N_0\\left(1 - 2^{-t/T}\\right)'
    ],
    ...SIM_PRESETS.nuclear,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Một mẫu đồng vị phóng xạ Iốt ${}^{131}\\text{I}$ có chu kì bán rã $T = 8\\text{ ngày}$ và khối lượng ban đầu $m_0 = 80\\text{ g}$. Sau $24\\text{ ngày}$, khối lượng ${}^{131}\\text{I}$ còn lại chưa phân rã là:',
        options: ['A. $10\\text{ g}$', 'B. $20\\text{ g}$', 'C. $70\\text{ g}$', 'D. $5\\text{ g}$'],
        correctIndex: 0,
        explanation: 'Số chu kì $t/T = 24/8 = 3 \\implies m = 80 \\cdot 2^{-3} = 10\\text{ g}$.'
      },
      {
        source: SRC_12,
        question: 'Tia phóng xạ nào sau đây KHÔNG bị lệch khi đi qua vùng không gian có cả điện trường và từ trường mạnh?',
        options: ['A. Tia $\\alpha$', 'B. Tia $\\beta^-$', 'C. Tia $\\beta^+$', 'D. Tia $\\gamma$'],
        correctIndex: 3,
        explanation: 'Tia $\\gamma$ là sóng điện từ không mang điện tích nên không chịu lực điện hay lực từ.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Độ phóng xạ của một mẫu chất ban đầu là $H_0 = 8\\cdot 10^5\\text{ Bq}$. Sau $12\\text{ giờ}$, độ phóng xạ giảm xuống còn $10^5\\text{ Bq}$. Tính chu kì bán rã $T$ (giờ) và hằng số phóng xạ $\\lambda$ ($\text{s}^{-1}$).',
        hints: ['Giải $H / H_0 = 1/8 = 2^{-t/T} \\implies t/T = 3$.'],
        solutionSteps: [
          'Bước 1: $\\frac{H}{H_0} = \\frac{10^5}{8\\cdot 10^5} = \\frac{1}{8} = 2^{-3} \\implies \\frac{t}{T} = 3 \\implies T = \\frac{12}{3} = 4\\text{ giờ} = 14\\,400\\text{ s}$.',
          'Bước 2: Hằng số phóng xạ $\\lambda = \\frac{\\ln 2}{14\\,400} \\approx 4{,}81\\cdot 10^{-5}\\text{ s}^{-1}$.'
        ],
        finalAnswer: '$T = 4\\text{ giờ}$; $\\lambda \\approx 4{,}81\\cdot 10^{-5}\\text{ s}^{-1}$.'
      }
    ]
  },
  {
    id: 'phys-12-b24',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương IV · Vật lí hạt nhân',
    sourceTag: SRC_12,
    lessonNumber: 24,
    title: 'Bài 24: Công nghiệp hạt nhân',
    subtitle: 'Nhà máy điện hạt nhân, lò phản ứng điều khiển hệ số nhân nơtron k = 1 và ứng dụng đồng vị phóng xạ trong Y học – Nông nghiệp',
    description:
      'Tìm hiểu cơ chế vận hành an toàn của nhà máy điện hạt nhân (thanh điều khiển Cd/B giữ $k = 1$, chất làm chậm nơtron, tua-bin hơi) và các ứng dụng hòa bình của công nghiệp hạt nhân.',
    theorySections: [
      {
        heading: '1. Nhà máy điện hạt nhân & Lò phản ứng phân hạch',
        content:
          '• Trong lò phản ứng hạt nhân dùng nhiên liệu ${}^{235}\\text{U}$, quá trình phân hạch dây chuyền được điều chỉnh bằng **thanh điều khiển** (Cadimi hoặc Bo hấp thụ nơtron dư) để hệ số nhân nơtron luôn giữ đúng **$k = 1$** (phản ứng ổn định tự duy trì, công suất không đổi).\n• Nhiệt lượng từ lõi lò truyền qua chất tải nhiệt (nước nặng/nước thường dưới áp suất cao) để sinh hơi quay tua-bin phát điện.'
      },
      {
        heading: '2. Ứng dụng công nghiệp hạt nhân trong Y học, Nông nghiệp & Khảo cổ',
        content:
          '• **Y học hạt nhân**: Dùng đồng vị phóng xạ ${}^{131}\\text{I}$ điều trị ung thư tuyến giáp, ${}^{99\\text{m}}\\text{Tc}$ chụp xạ hình SPECT/PET chẩn đoán sớm khối u.\n• **Nông nghiệp & Công nghiệp**: Chiếu xạ bảo quản nông sản diệt nấm mốc, tạo đột biến giống cây trồng năng suất cao, đo độ dày lá kim loại tự động.'
      }
    ],
    keyFormulas: [
      'k = 1: \\text{Phản ứng phân hạch có điều khiển ổn định}',
      'Q_{\\text{nhiệt}} = N_{\\text{phân hạch}} \\cdot \\Delta E_{\\text{1 phân hạch}}'
    ],
    ...SIM_PRESETS.nuclear_fission,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Trong lò phản ứng hạt nhân, các thanh điều khiển chứa Bo (B) hoặc Cadimi (Cd) có vai trò:',
        options: [
          'A. Hấp thụ nơtron dư để giữ hệ số nhân nơtron $k = 1$',
          'B. Làm tăng tốc độ chuyển động của hạt $\\alpha$',
          'C. Cung cấp thêm nhiên liệu Urani',
          'D. Tạo ra từ trường quay tua-bin'
        ],
        correctIndex: 0,
        explanation: 'Thanh điều khiển rút lên hoặc hạ xuống để điều chỉnh lượng nơtron tự do, giữ công suất lò ổn định tại $k = 1$.'
      },
      {
        source: SRC_12,
        question: 'Một lò phản ứng điện hạt nhân có công suất điện $1000\\text{ MW}$ với hiệu suất chuyển hóa $30\\%$. Công suất nhiệt do các phản ứng phân hạch tỏa ra trong lò xấp xỉ:',
        options: ['A. $3333\\text{ MW}$', 'B. $300\\text{ MW}$', 'C. $1000\\text{ MW}$', 'D. $700\\text{ MW}$'],
        correctIndex: 0,
        explanation: '$\\mathcal{P}_{\\text{nhiệt}} = \\frac{\\mathcal{P}_{\\text{điện}}}{H} = \\frac{1000}{0{,}3} \\approx 3333\\text{ MW}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Mỗi phân hạch của hạt nhân ${}^{235}\\text{U}$ tỏa ra năng lượng $200\\text{ MeV}$. Nếu một lò phản ứng công suất phát nhiệt $160\\text{ MW}$ hoạt động liên tục trong $1\\text{ ngày}$ ($86\\,400\\text{ s}$), có bao nhiêu gam ${}^{235}\\text{U}$ đã bị phân hạch?',
        hints: ['Đổi $200\\text{ MeV} = 200 \\cdot 1{,}6\\cdot 10^{-13}\\text{ J} = 3{,}2\\cdot 10^{-11}\\text{ J}$. Tính tổng năng lượng $E = \\mathcal{P}t$, chia $\\Delta E_1$ ra số hạt $N$, rồi tính $m = \\frac{N}{N_A} \\cdot 235$.'],
        solutionSteps: [
          'Bước 1: Tổng năng lượng tỏa ra trong 1 ngày: $E = 160\\cdot 10^6 \\cdot 86\\,400 = 1{,}3824\\cdot 10^{13}\\text{ J}$.',
          'Bước 2: Số hạt ${}^{235}\\text{U}$ bị phân hạch: $N = \\frac{1{,}3824\\cdot 10^{13}}{3{,}2\\cdot 10^{-11}} = 4{,}32\\cdot 10^{23}$ hạt.',
          'Bước 3: Khối lượng nhiên liệu tiêu thụ: $m = \\frac{4{,}32\\cdot 10^{23}}{6{,}02\\cdot 10^{23}} \\cdot 235 \\approx 168{,}6\\text{ g}$.'
        ],
        finalAnswer: 'Khoảng $168{,}6\\text{ g}$ ${}^{235}\\text{U}$ tiêu thụ mỗi ngày.'
      }
    ]
  },
  {
    id: 'phys-12-b25',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'Chương IV · Vật lí hạt nhân',
    sourceTag: SRC_12,
    lessonNumber: 25,
    title: 'Bài 25: Bài tập về vật lí hạt nhân',
    subtitle: 'Định tuổi cổ vật Cacbon-14, bài toán động lượng bảo toàn trong phóng xạ α và hỗn hợp hai chất phóng xạ',
    description:
      'Tổng hợp các bài toán phân hóa Chương Vật lí hạt nhân GDPT 2018: đo tuổi mẫu gỗ cổ nhờ đồng vị ${}^{14}\\text{C}$, tính động năng hạt con sau phân rã hạt nhân đứng yên và bài toán tỉ số hạt con/hạt mẹ.',
    theorySections: [
      {
        heading: '1. Định tuổi cổ vật bằng ${}^{14}\\text{C}$ & Tỉ số hạt con / hạt mẹ',
        content:
          '• Khi $1$ hạt nhân mẹ phân rã sinh ra đúng $1$ hạt nhân con, sau thời gian $t$, số hạt nhân con tạo thành bằng số hạt mẹ đã phân rã: $N_{\\text{con}} = N_0 (1 - 2^{-t/T})$.\n• Do đó tỉ số giữa số hạt con và số hạt mẹ còn lại tại thời điểm $t$ là:\n  $$\\frac{N_{\\text{con}}}{N_{\\text{mẹ}}} = 2^{t/T} - 1$$'
      },
      {
        heading: '2. Bảo toàn động lượng khi hạt nhân mẹ đứng yên phân rã',
        content:
          '• Khi hạt nhân mẹ đứng yên phóng xạ $M \\to m_1 + m_2$, hai hạt sản phẩm bay ra **ngược hướng** với động lượng bằng nhau về độ lớn ($p_1 = p_2 \\implies m_1 K_1 = m_2 K_2$).\n• Do đó động năng chia tỉ lệ **nghịch** với khối lượng (hoặc số khối): $\\frac{K_1}{K_2} = \\frac{A_2}{A_1}$ và $K_1 + K_2 = \\Delta E$.'
      }
    ],
    keyFormulas: [
      '\\frac{N_{\\text{con}}}{N_{\\text{mẹ}}} = 2^{t/T} - 1',
      '\\frac{K_1}{K_2} = \\frac{m_2}{m_1} \\approx \\frac{A_2}{A_1}, \\quad K_1 + K_2 = \\Delta E'
    ],
    ...SIM_PRESETS.nuclear,
    practiceExercises: [
      {
        source: SRC_12,
        question: 'Ban đầu mẫu chất nguyên chất chỉ gồm đồng vị phóng xạ mẹ với chu kì bán rã $T$. Sau thời gian $t = 2T$, tỉ số giữa số hạt nhân con tạo thành và số hạt nhân mẹ còn lại là:',
        options: ['A. $3$', 'B. $4$', 'C. $1/3$', 'D. $2$'],
        correctIndex: 0,
        explanation: '$\\frac{N_{\\text{con}}}{N_{\\text{mẹ}}} = 2^{2T/T} - 1 = 4 - 1 = 3$.'
      },
      {
        source: SRC_12,
        question: 'Một mảnh gỗ cổ có độ phóng xạ của ${}^{14}\\text{C}$ bằng $1/4$ độ phóng xạ của một mẫu gỗ tươi cùng khối lượng mới chặt. Biết chu kì bán rã của ${}^{14}\\text{C}$ là $5730\\text{ năm}$. Tuổi của mảnh gỗ cổ là:',
        options: ['A. $11\\,460\\text{ năm}$', 'B. $5730\\text{ năm}$', 'C. $22\\,920\\text{ năm}$', 'D. $2865\\text{ năm}$'],
        correctIndex: 0,
        explanation: 'Vì $H/H_0 = 1/4 = 2^{-2}$ nên $t = 2T = 2 \\cdot 5730 = 11\\,460\\text{ năm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_12,
        question: 'Hạt nhân Poloni ${}^{210}_{84}\\text{Po}$ đứng yên phóng xạ $\\alpha$ biến thành hạt nhân Chì ${}^{206}_{82}\\text{Pb}$, phản ứng tỏa ra năng lượng $\\Delta E = 5{,}4\\text{ MeV}$. Lấy gần đúng tỉ số khối lượng bằng tỉ số số khối, tính động năng của hạt $\\alpha$ bay ra.',
        hints: ['Dùng $K_\\alpha + K_{\\text{Pb}} = 5{,}4\\text{ MeV}$ và $\\frac{K_\\alpha}{K_{\\text{Pb}}} = \\frac{206}{4}$.'],
        solutionSteps: [
          'Bước 1: Bảo toàn động lượng từ trạng thái nghỉ: $p_\\alpha = p_{\\text{Pb}} \\implies 4 K_\\alpha = 206 K_{\\text{Pb}} \\implies K_{\\text{Pb}} = \\frac{4}{206} K_\\alpha$.',
          'Bước 2: Bảo toàn năng lượng: $K_\\alpha\\left(1 + \\frac{4}{206}\\right) = 5{,}4 \\implies K_\\alpha = 5{,}4 \\cdot \\frac{206}{210} \\approx 5{,}30\\text{ MeV}$.'
        ],
        finalAnswer: 'Động năng hạt $\\alpha$ nhận gần hết năng lượng: $K_\\alpha \\approx 5{,}30\\text{ MeV}$.'
      }
    ]
  }
];
