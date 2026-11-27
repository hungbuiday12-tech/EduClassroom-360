import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const SRC_2018_6 = 'GDPT 2018 · KHTN 6 (Phần Vật lí)';
const SRC_2018_7 = 'GDPT 2018 · KHTN 7 (Phần Vật lí)';
const SRC_2018_8 = 'GDPT 2018 · KHTN 8 (Phần Vật lí)';
const SRC_2006_6 = 'GDPT 2006 · SGK Vật lí 6';
const SRC_2006_7 = 'GDPT 2006 · SGK Vật lí 7';
const SRC_2006_8 = 'GDPT 2006 · SGK Vật lí 8';

export const PHYSICS_MS_EXTRA_LESSONS: PhysicsLesson[] = [
  // ==========================================================================
  // LỚP 6 — GDPT 2018 (BỔ SUNG ĐỦ CHƯƠNG KHTN 6)
  // ==========================================================================
  {
    id: 'phys-6-b7',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Lực và Chuyển động',
    sourceTag: SRC_2018_6,
    lessonNumber: 7,
    title: 'Bài 7: Lực tiếp xúc – Lực không tiếp xúc & Biến dạng Lò xo (Đo bằng Lực kế)',
    subtitle: 'Phân biệt lực tiếp xúc trực tiếp với lực hấp dẫn/từ trường từ xa và quy luật tỉ lệ thuận độ dãn lò xo',
    description:
      'Làm thí nghiệm treo quả nặng vào lực kế lò xo để thấy lực không chỉ làm thay đổi tốc độ mà còn làm biến dạng vật đàn hồi.',
    theorySections: [
      {
        heading: '1. Lực tiếp xúc và Lực không tiếp xúc',
        content:
          '• **Lực tiếp xúc** xuất hiện khi hai vật chạm vào nhau (chân đá bóng, tay đẩy xe, lực ma sát mặt đường).\n• **Lực không tiếp xúc** tác dụng qua khoảng không gian mà không cần chạm (Trọng lực hút quả táo rơi, Nam châm hút đinh sắt).'
      },
      {
        heading: '2. Đo lực bằng lực kế lò xo',
        content:
          '• Độ dãn của lò xo $\\Delta l = l - l_0$ tỉ lệ thuận với trọng lượng $P$ của vật treo.\n• Đơn vị lực là **Niutơn (N)**. Nhớ chỉnh kim lực kế về đúng vạch $0$ theo phương đặt lực.'
      }
    ],
    keyFormulas: [
      'F_{\\text{đh}} = k\\cdot \\Delta l = k(l - l_0)',
      'P = 10\\cdot m \\ (\\text{N})'
    ],
    ...SIM_PRESETS.hooke_forces,
    practiceExercises: [
      {
        source: SRC_2018_6,
        question: 'Lực nào sau đây là LỰC KHÔNG TIẾP XÚC?',
        options: [
          'A. Lực cầu thủ sút quả bóng',
          'B. Lực ma sát giữa lốp xe và mặt đường',
          'C. Lực Trái Đất hút Mặt Trăng quay quanh nó',
          'D. Lực tay kéo cánh cửa'
        ],
        correctIndex: 2,
        explanation: 'Lực hấp dẫn giữa Trái Đất và Mặt Trăng tác dụng từ xa qua khoảng không gian.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_6,
        question: 'Một lò xo dài tự nhiên $10\\text{ cm}$. Treo vật $100\\text{ g}$ lò xo dài $12\\text{ cm}$. Nếu treo vật $250\\text{ g}$ thì lò xo dài bao nhiêu cm?',
        hints: ['Độ dãn $\\Delta l$ tỉ lệ thuận với khối lượng vật treo.'],
        solutionSteps: [
          'Treo $100\\text{ g}$ lò xo dãn $12 - 10 = 2\\text{ cm}$.',
          'Treo $250\\text{ g}$ (gấp $2{,}5$ lần) $\\implies$ dãn $2 \\cdot 2{,}5 = 5\\text{ cm}$.',
          'Chiều dài mới: $10 + 5 = 15\\text{ cm}$.'
        ],
        finalAnswer: '$15\\text{ cm}$.'
      }
    ]
  },
  {
    id: 'phys-6-b8',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Lực và Chuyển động',
    sourceTag: SRC_2018_6,
    lessonNumber: 8,
    title: 'Bài 8: Lực ma sát (Trượt – Nghỉ – Lăn), Lực cản Nước/Không khí & An toàn Giao thông',
    subtitle: 'Khi nào ma sát có hại cần giảm (bôi dầu, ổ bi) và khi nào ma sát có lợi cần tăng (khía rãnh lốp xe, đế giày)',
    description:
      'Phân tích chiều ngược chuyển động của lực ma sát trên mặt phẳng nghiêng, vai trò khí động học giảm lực cản và ý nghĩa rãnh lốp xe.',
    theorySections: [
      {
        heading: '1. Ba loại ma sát & Lực cản môi trường',
        content:
          '• **Ma sát nghỉ** giữ vật đứng yên trên mặt dốc hoặc giúp bàn chân bám đất để bước đi.\n• **Ma sát trượt** sinh ra khi vật trượt trên bề mặt; **Ma sát lăn** nhỏ hơn rất nhiều ma sát trượt (dùng bánh xe/ổ bi).'
      },
      {
        heading: '2. Tăng ma sát có lợi – Giảm ma sát có hại',
        content:
          '• **Tăng ma sát**: xẻ rãnh mặt lốp xe, rắc phấn magiê cho vận động viên xà đơn.\n• **Giảm ma sát**: bôi dầu mỡ vào xích xe đạp, lắp vòng bi, thiết kế mũi tàu/máy bay thuôn nhọn giảm lực cản không khí.'
      }
    ],
    keyFormulas: [
      'F_{\\text{ms lăn}} \\ll F_{\\text{ms trượt}}',
      '\\vec{F}_{\\text{ms}} \\text{ luôn ngược chiều chuyển động tương đối}'
    ],
    ...SIM_PRESETS.inclined,
    practiceExercises: [
      {
        source: SRC_2018_6,
        question: 'Vì sao mặt lốp xe ô tô, xe máy thường được xẻ nhiều rãnh sâu?',
        options: [
          'A. Để làm đẹp và giảm khối lượng lốp',
          'B. Để tăng lực ma sát bám đường và thoát nước chống trơn trượt',
          'C. Để giảm lực ma sát giúp xe chạy nhanh hơn',
          'D. Để giảm trọng lượng xe'
        ],
        correctIndex: 1,
        explanation: 'Rãnh lốp tăng độ nhám bám đường (tăng ma sát có lợi) khi phanh hoặc trời mưa.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_6,
        question: 'Nêu $2$ ví dụ lực ma sát có lợi và $2$ cách làm giảm lực cản khi bơi hoặc đi xe đạp.',
        hints: ['Có lợi: phanh xe, đi bộ; Giảm cản: cúi thấp người, dùng mũ khí động học.'],
        solutionSteps: [
          'Ma sát có lợi: phanh xe dừng lại; phấn rắc tay giúp cầm tạ chắc không tuột.',
          'Giảm lực cản: cúi thấp thân người khi đạp xe ngược gió; mặc đồ bơi ôm sát.'
        ],
        finalAnswer: 'Trình bày đủ 2 lợi và 2 cách giảm lực cản.'
      }
    ]
  },
  {
    id: 'phys-6-b9',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Năng lượng và Cuộc sống',
    sourceTag: SRC_2018_6,
    lessonNumber: 9,
    title: 'Bài 9: Năng lượng hao phí, Định luật Bảo toàn Năng lượng & Năng lượng Tái tạo',
    subtitle: 'Năng lượng không tự sinh ra/mất đi mà chỉ chuyển hóa; tối ưu hiệu suất và tiết kiệm điện năng',
    description:
      'Theo dõi dòng chuyển hóa từ Thế năng $\\leftrightarrow$ Động năng $\\to$ Nhiệt năng hao phí và so sánh điện mặt trời – điện gió với nhiên liệu hóa thạch.',
    theorySections: [
      {
        heading: '1. Năng lượng có ích và Năng lượng hao phí',
        content:
          '• Khi sử dụng thiết bị, một phần năng lượng luôn chuyển thành **nhiệt năng tỏa ra môi trường** (bóng đèn sợi đốt nóng bỏng, động cơ xe nóng lên) gọi là **năng lượng hao phí**.\n• Dùng đèn LED thay đèn sợi đốt giúp tăng năng lượng quang có ích và giảm hao phí nhiệt.'
      },
      {
        heading: '2. Bảo toàn năng lượng & Năng lượng tái tạo',
        content:
          '• **Định luật Bảo toàn Năng lượng**: Năng lượng không tự nhiên sinh ra hay mất đi mà chỉ chuyển hóa từ dạng này sang dạng khác hoặc truyền từ vật này sang vật khác.\n• **Năng lượng tái tạo**: Mặt trời, gió, thủy triều, địa nhiệt, sinh khối — sạch và không cạn kiệt.'
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
        question: 'Khi quạt điện đang quay, phần năng lượng nào là năng lượng HAO PHÍ?',
        options: [
          'A. Cơ năng làm quay cánh quạt tạo gió',
          'B. Nhiệt năng làm nóng vỏ động cơ và âm thanh tiếng ồn',
          'C. Điện năng lấy từ ổ cắm',
          'D. Gió thổi mát'
        ],
        correctIndex: 1,
        explanation: 'Mục đích chính của quạt là tạo cơ năng gió mát; nhiệt tỏa ra làm nóng động cơ là phần hao phí.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_6,
        question: 'Một bóng đèn LED tiêu thụ $100\\text{ J}$ điện năng mỗi $10$ giây, tạo ra $85\\text{ J}$ quang năng. Tính phần năng lượng hao phí và hiệu suất bóng đèn.',
        hints: ['$E_{\\text{hao phí}} = E_{\\text{tp}} - E_{\\text{có ích}}$.'],
        solutionSteps: [
          'Năng lượng hao phí tỏa nhiệt: $100 - 85 = 15\\text{ J}$.',
          'Hiệu suất: $H = \\frac{85}{100} \\cdot 100\\% = 85\\%$.'
        ],
        finalAnswer: 'Hao phí $15\\text{ J}$, hiệu suất $85\\%$.'
      }
    ]
  },

  // ==========================================================================
  // LỚP 7 — GDPT 2018 (BỔ SUNG ĐỦ CHƯƠNG KHTN 7)
  // ==========================================================================
  {
    id: 'phys-7-b7',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Tốc độ',
    sourceTag: SRC_2018_7,
    lessonNumber: 7,
    title: 'Bài 7: Đồ thị Quãng đường – Thời gian ($s-t$) & Khoảng cách an toàn Giao thông',
    subtitle: 'Đọc độ dốc đường biểu diễn trên đồ thị $s-t$, phát hiện đoạn xe dừng nghỉ và nguyên lí súng bắn tốc độ',
    description:
      'Phân tích đồ thị $s-t$ qua mô phỏng chuyển động thẳng, hiểu quy tắc "3 giây" giữ khoảng cách an toàn khi trời mưa đường trơn.',
    theorySections: [
      {
        heading: '1. Đọc đồ thị Quãng đường – Thời gian ($s - t$)',
        content:
          '• Đường thẳng đi lên: vật chuyển động thẳng đều với tốc độ $v = s / t$. Đường càng dốc đứng $\\to$ tốc độ càng lớn.\n• Đường nằm ngang song song trục thời gian $Ot$: quãng đường không đổi $\\to$ vật đang **đứng yên** (nghỉ giữa chặng).'
      },
      {
        heading: '2. Đo tốc độ bằng Súng bắn tốc độ & An toàn',
        content:
          '• Súng bắn tốc độ chiếu chùm tia/sóng đo khoảng thời gian $\\Delta t$ xe đi qua hai mốc khoảng cách $\\Delta s$ để tính $v = \\Delta s / \\Delta t$.\n• Xe chạy càng nhanh thì **quãng đường phanh** tăng theo bình phương tốc độ nên bắt buộc giữ khoảng cách an toàn tối thiểu.'
      }
    ],
    keyFormulas: [
      'v = \\frac{s}{t}; \\quad 1\\text{ m/s} = 3{,}6\\text{ km/h}'
    ],
    ...SIM_PRESETS.kinematics,
    practiceExercises: [
      {
        source: SRC_2018_7,
        question: 'Trên đồ thị quãng đường – thời gian ($s - t$), đoạn biểu diễn là đường NẰM NGANG cho biết điều gì?',
        options: [
          'A. Vật chạy nhanh dần',
          'B. Vật chuyển động đều',
          'C. Vật đang đứng yên',
          'D. Vật đi lùi lại'
        ],
        correctIndex: 2,
        explanation: 'Thời gian tăng nhưng quãng đường không thay đổi tức là vật đang đứng yên.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_7,
        question: 'Một ô tô đi $60\\text{ km}$ đầu mất $1$ giờ, nghỉ $30$ phút, rồi đi tiếp $45\\text{ km}$ trong $45$ phút. Tính tốc độ trung bình trên cả hành trình.',
        hints: ['$v_{tb} = \\frac{s_1 + s_2}{t_1 + t_{\\text{nghỉ}} + t_2}$.'],
        solutionSteps: [
          'Tổng quãng đường: $S = 60 + 45 = 105\\text{ km}$.',
          'Tổng thời gian: $T = 1 + 0{,}5 + 0{,}75 = 2{,}25\\text{ h}$.',
          '$v_{tb} = \\frac{105}{2{,}25} \\approx 46{,}7\\text{ km/h}$.'
        ],
        finalAnswer: '$v_{tb} \\approx 46{,}7\\text{ km/h}$.'
      }
    ]
  },
  {
    id: 'phys-7-b8',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Âm thanh',
    sourceTag: SRC_2018_7,
    lessonNumber: 8,
    title: 'Bài 8: Phản xạ âm, Tiếng vang & Vật liệu Cách âm (Chống ô nhiễm Tiếng ồn)',
    subtitle: 'Điều kiện nghe thấy tiếng vang ($\\Delta t \\ge 1/15\\text{ s}$, vách cách $\\ge 11{,}35\\text{ m}$) và phân biệt vật phản xạ âm tốt vs hấp thụ âm tốt',
    description:
      'Tính khoảng cách tối thiểu tạo tiếng vang trong hang động và ứng dụng tấm xốp/rèm nhung tiêu âm trong phòng thu, rạp chiếu phim.',
    theorySections: [
      {
        heading: '1. Phản xạ âm và Điều kiện có Tiếng vang',
        content:
          '• **Tiếng vang** nghe được khi âm phản xạ dội về tai chậm hơn âm trực tiếp ít nhất $\\frac{1}{15}\\text{ s}$.\n• Với vận tốc âm trong không khí $v \\approx 340\\text{ m/s}$, vật cản phải cách người ít nhất $d = \\frac{340 \\cdot (1/15)}{2} \\approx 11{,}35\\text{ m}$.'
      },
      {
        heading: '2. Vật phản xạ âm tốt vs Hấp thụ âm tốt',
        content:
          '• Vật cứng, bề mặt nhẵn (tường gạch, mặt đá, kính) phản xạ âm tốt.\n• Vật mềm, xốp, gồ ghề (rèm nhung, tấm mút xốp, thảm) hấp thụ âm tốt $\\to$ dùng làm tường tiêu âm giảm vang dội.'
      }
    ],
    keyFormulas: [
      'd = \\frac{v \\cdot t_{\\text{cả đi lẫn về}}}{2} \\ge 11{,}35\\text{ m}'
    ],
    ...SIM_PRESETS.sound_intensity,
    practiceExercises: [
      {
        source: SRC_2018_7,
        question: 'Người ta đứng trước vách núi hét to, sau $2\\text{ s}$ nghe thấy tiếng vang. Biết $v_{\\text{âm}} = 340\\text{ m/s}$. Khoảng cách từ người tới vách núi là:',
        options: ['A. $680\\text{ m}$', 'B. $340\\text{ m}$', 'C. $170\\text{ m}$', 'D. $85\\text{ m}$'],
        correctIndex: 1,
        explanation: 'Âm đi rồi dội về mất $2\\text{ s}$ nên thời gian đi tới núi là $1\\text{ s} \\implies d = 340 \\cdot 1 = 340\\text{ m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_7,
        question: 'Tàu phát sóng siêu âm thẳng đứng xuống đáy biển, sau $1{,}6\\text{ s}$ thu được âm phản xạ. Tính độ sâu đáy biển ($v_{\\text{âm trong nước}} = 1500\\text{ m/s}$).',
        hints: ['$h = \\frac{v\\cdot t}{2}$.'],
        solutionSteps: [
          '$h = \\frac{1500 \\cdot 1{,}6}{2} = 1200\\text{ m}$.'
        ],
        finalAnswer: '$1200\\text{ m}$.'
      }
    ]
  },
  {
    id: 'phys-7-b9',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Ánh sáng',
    sourceTag: SRC_2018_7,
    lessonNumber: 9,
    title: 'Bài 9: Tia sáng, Chùm sáng, Vùng tối – Vùng nửa tối & Nhật thực – Nguyệt thực',
    subtitle: 'Phân biệt nguồn sáng điểm vs nguồn sáng rộng tạo vùng tối/nửa tối và mô hình Mặt Trăng – Trái Đất – Mặt Trời',
    description:
      'Kéo kích thước nguồn sáng và vị trí Mặt Trăng trong mô phỏng 2D/3D để giải thích hiện tượng Nhật thực toàn phần, một phần và Nguyệt thực.',
    theorySections: [
      {
        heading: '1. Vùng tối và Vùng nửa tối',
        content:
          '• **Vùng tối**: nằm sau vật cản không nhận được bất kì tia sáng nào từ nguồn truyền tới.\n• **Vùng nửa tối** (khi dùng nguồn sáng rộng): nằm sau vật cản chỉ nhận được ánh sáng từ **một phần** của nguồn sáng truyền tới.'
      },
      {
        heading: '2. Nhật thực và Nguyệt thực',
        content:
          '• **Nhật thực** (Ban ngày): Mặt Trăng ở giữa Mặt Trời và Trái Đất, che ánh nắng chiếu xuống Trái Đất.\n• **Nguyệt thực** (Đêm trăng tròn): Trái Đất ở giữa Mặt Trời và Mặt Trăng, Trái Đất chắn nắng khiến Mặt Trăng đi vào vùng bóng tối của Trái Đất.'
      }
    ],
    keyFormulas: [
      '\\text{Nhật thực}: \\text{Mặt Trời} \\to \\text{Mặt Trăng} \\to \\text{Trái Đất}',
      '\\text{Nguyệt thực}: \\text{Mặt Trời} \\to \\text{Trái Đất} \\to \\text{Mặt Trăng}'
    ],
    ...SIM_PRESETS.shadow_eclipse,
    practiceExercises: [
      {
        source: SRC_2018_7,
        question: 'Hiện tượng Nguyệt thực xảy ra vào thời điểm nào và khi ba thiên thể sắp xếp theo thứ tự nào?',
        options: [
          'A. Ban ngày; Mặt Trăng nằm giữa Mặt Trời và Trái Đất',
          'B. Đêm trăng tròn; Trái Đất nằm giữa Mặt Trời và Mặt Trăng',
          'C. Đêm không trăng; Mặt Trời nằm giữa',
          'D. Ban trưa; Mặt Trăng che Mặt Trời'
        ],
        correctIndex: 1,
        explanation: 'Nguyệt thực xảy ra khi Trái Đất chắn ánh sáng Mặt Trời không cho chiếu tới Mặt Trăng.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_7,
        question: 'Giải thích vì sao bóng đèn tuýp dài trong phòng lại tạo ra rìa bóng mờ (vùng nửa tối) thay vì bóng sắc nét như đèn pin nhỏ?',
        hints: ['Đèn tuýp dài là nguồn sáng rộng gồm nhiều điểm sáng đặt cạnh nhau.'],
        solutionSteps: [
          'Đèn tuýp là nguồn sáng rộng; ở vùng rìa phía sau vật cản, ánh sáng từ một đầu đèn bị chắn nhưng ánh sáng từ đầu đèn kia vẫn chiếu tới được, tạo nên vùng nửa tối mờ dần.'
        ],
        finalAnswer: 'Do đèn tuýp là nguồn sáng rộng tạo vùng nửa tối ở rìa bóng.'
      }
    ]
  },

  // ==========================================================================
  // LỚP 8 — GDPT 2018 (BỔ SUNG ĐỦ CHƯƠNG KHTN 8)
  // ==========================================================================
  {
    id: 'phys-8-b7',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Khối lượng riêng & Áp suất',
    sourceTag: SRC_2018_8,
    lessonNumber: 7,
    title: 'Bài 7: Áp suất Khí quyển, Thí nghiệm Torricelli & Máy nén Thủy lực Pascal',
    subtitle: 'Vì sao ống hút hút được nước lên, giác hút dính chặt tường kính và cách nâng ô tô nhiều tấn bằng một lực nhấn tay nhỏ',
    description:
      'Khám phá bình thông nhau, áp suất khí quyển $1\\text{ atm} \\approx 760\\text{ mmHg}$ và nguyên lí máy ép thủy lực $F_2/F_1 = S_2/S_1$.',
    theorySections: [
      {
        heading: '1. Áp suất khí quyển',
        content:
          '• Trái Đất được bao bọc bởi lớp không khí dày hàng trăm km tạo ra **áp suất khí quyển** tác dụng theo **mọi phương**.\n• Khi ta hút ống hút, áp suất trong ống giảm nhỏ hơn áp suất khí quyển bên ngoài nên không khí đẩy nước dâng lên miệng.'
      },
      {
        heading: '2. Nguyên lí Pascal & Máy thủy lực',
        content:
          '• Áp suất tác dụng lên chất lỏng trong bình kín được truyền đi nguyên vẹn theo mọi hướng: $\\frac{F_1}{S_1} = \\frac{F_2}{S_2} \\implies F_2 = F_1\\cdot \\frac{S_2}{S_1}$.'
      }
    ],
    keyFormulas: [
      'p_{\\text{khí quyển}} \\approx 760\\text{ mmHg} \\approx 101\\,325\\text{ Pa}',
      '\\frac{F_2}{F_1} = \\frac{S_2}{S_1}'
    ],
    ...SIM_PRESETS.fluid_pressure,
    practiceExercises: [
      {
        source: SRC_2018_8,
        question: 'Một máy nén thủy lực có pít-tông nhỏ diện tích $S_1 = 2\\text{ cm}^2$ và pít-tông lớn $S_2 = 100\\text{ cm}^2$. Nếu ấn lực $F_1 = 40\\text{ N}$ lên pít-tông nhỏ thì lực nâng $F_2$ là:',
        options: ['A. $40\\text{ N}$', 'B. $200\\text{ N}$', 'C. $2000\\text{ N}$', 'D. $4000\\text{ N}$'],
        correctIndex: 2,
        explanation: '$F_2 = 40 \\cdot \\frac{100}{2} = 2000\\text{ N}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_8,
        question: 'Giải thích vì sao nắp ấm pha trà thường có một lỗ nhỏ trên nắp?',
        hints: ['Liên hệ áp suất không khí bên trong và bên ngoài ấm khi rót nước.'],
        solutionSteps: [
          'Nhờ lỗ nhỏ trên nắp, không khí bên ngoài tràn vào giữ áp suất khí trên mặt nước bằng áp suất khí quyển, giúp nước chảy ra vòi đều và dễ dàng.'
        ],
        finalAnswer: 'Giữ áp suất không khí trong ấm bằng khí quyển để rót nước chảy đều.'
      }
    ]
  },
  {
    id: 'phys-8-b8',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Moment lực & Đòn bẩy',
    sourceTag: SRC_2018_8,
    lessonNumber: 8,
    title: 'Bài 8: Ba loại Đòn bẩy Thực tế (Xà beng – Xe cút kít – Nhíp gắp) & Cân bằng Moment',
    subtitle: 'Vận dụng quy tắc cân bằng $F_1\\cdot d_1 = F_2\\cdot d_2$ nhận diện điểm tựa $O$ trong đồ vật đời sống',
    description:
      'Phân loại 3 loại đòn bẩy theo vị trí điểm tựa $O$, điểm đặt lực $F_1$ và vật nặng $F_2$ qua mô phỏng cánh tay đòn 2D/3D.',
    theorySections: [
      {
        heading: '1. Điều kiện cân bằng Đòn bẩy',
        content:
          '• Đòn bẩy cân bằng khi hai moment làm quay ngược chiều bằng nhau: $F_1 \\cdot d_1 = F_2 \\cdot d_2$.\n• Để được **lợi về lực** ($F_1 < F_2$), cánh tay đòn lực tác dụng phải dài hơn cánh tay đòn của vật ($d_1 > d_2$).'
      },
      {
        heading: '2. Ba loại đòn bẩy thường gặp',
        content:
          '• **Loại 1** (Điểm tựa ở giữa): cái kéo, kìm cắt dây, bập bênh.\n• **Loại 2** (Vật ở giữa): xe rùa (xe cút kít), đồ mở nắp chai, kìm tách hạt.\n• **Loại 3** (Lực tác dụng ở giữa): đôi đũa gắp thức ăn, cái nhíp, cần câu cá, cẳng tay người (ưu tiên nhanh & linh hoạt).'
      }
    ],
    keyFormulas: [
      'M = F \\cdot d \\ (\\text{N}\\cdot\\text{m}); \\quad F_1\\cdot d_1 = F_2\\cdot d_2'
    ],
    ...SIM_PRESETS.simple_machines,
    practiceExercises: [
      {
        source: SRC_2018_8,
        question: 'Dụng cụ nào sau đây là đòn bẩy có điểm tựa nằm Ở GIỮA lực tác dụng và vật cần nâng (hoặc cắt)?',
        options: ['A. Đôi đũa', 'B. Cái kéo cắt giấy', 'C. Xe cút kít', 'D. Cái nhíp'],
        correctIndex: 1,
        explanation: 'Cái kéo có trục ốc (điểm tựa O) nằm ở giữa lưỡi kéo (vật) và tay cầm (lực).'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_8,
        question: 'Dùng thanh xà beng dài $1{,}2\\text{ m}$ bẩy hòn đá nặng $600\\text{ N}$. Biết điểm tựa đặt cách đầu chạm hòn đá $20\\text{ cm}$. Tính lực tay tối thiểu ấn ở đầu kia.',
        hints: ['$d_2 = 0{,}2\\text{ m}$, $d_1 = 1{,}2 - 0{,}2 = 1{,}0\\text{ m}$.'],
        solutionSteps: [
          '$F_1 \\cdot d_1 = F_2 \\cdot d_2 \\implies F_1 \\cdot 1{,}0 = 600 \\cdot 0{,}2 = 120$.',
          '$F_1 = 120\\text{ N}$.'
        ],
        finalAnswer: '$120\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-8-b9',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Điện học',
    sourceTag: SRC_2018_8,
    lessonNumber: 9,
    title: 'Bài 9: Đo Cường độ Dòng điện (Ampe kế) – Hiệu điện thế (Vôn kế) & An toàn Điện',
    subtitle: 'Cách mắc Ampe kế nối tiếp vs Vôn kế song song, ý nghĩa số Vôn trên nguồn pin và công tắc cầu chì/CB chống quá tải',
    description:
      'Thực hành đọc số chỉ Ampe kế/Vôn kế và hiểu nguyên tắc mạch nối tiếp/song song trước khi bước vào Định luật Ôm lớp 9.',
    theorySections: [
      {
        heading: '1. Cách mắc Ampe kế và Vôn kế chuẩn',
        content:
          '• **Ampe kế (A)** đo cường độ dòng điện $I$ (Ampe): mắc **NỐI TIẾP** với thiết bị cần đo, chốt $(+)$ nối về cực dương nguồn điện.\n• **Vôn kế (V)** đo hiệu điện thế $U$ (Vôn): mắc **SONG SONG** hai đầu thiết bị hoặc hai cực nguồn điện.'
      },
      {
        heading: '2. Tác dụng dòng điện & An toàn điện',
        content:
          '• Dòng điện có 5 tác dụng: Nhiệt, Phát sáng, Từ, Hóa học, Sinh lí.\n• Cầu chì / Aptomat (CB) tự động ngắt mạch khi đoản mạch hoặc quá tải, tránh cháy nổ.'
      }
    ],
    keyFormulas: [
      '1\\text{ A} = 1000\\text{ mA}; \\quad 1\\text{ kV} = 1000\\text{ V} = 10^6\\text{ mV}'
    ],
    ...SIM_PRESETS.electric_power,
    practiceExercises: [
      {
        source: SRC_2018_8,
        question: 'Để đo hiệu điện thế giữa hai đầu một bóng đèn đang sáng, ta phải mắc Vôn kế như thế nào?',
        options: [
          'A. Mắc nối tiếp với bóng đèn',
          'B. Mắc song song với hai đầu bóng đèn (chốt + về phía cực dương)',
          'C. Nối tắt hai cực pin không qua đèn',
          'D. Chỉ chạm 1 dây vào bóng đèn'
        ],
        correctIndex: 1,
        explanation: 'Vôn kế luôn mắc song song với đoạn mạch cần đo hiệu điện thế.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2018_8,
        question: 'Đổi các đơn vị sau: $0{,}45\\text{ A} = ?\\text{ mA}$; $250\\text{ mV} = ?\\text{ V}$.',
        hints: ['Nhân 1000 khi đổi A -> mA; chia 1000 khi đổi mV -> V.'],
        solutionSteps: [
          '$0{,}45\\text{ A} = 450\\text{ mA}$.',
          '$250\\text{ mV} = 0{,}25\\text{ V}$.'
        ],
        finalAnswer: '$450\\text{ mA}$ và $0{,}25\\text{ V}$.'
      }
    ]
  },

  // ==========================================================================
  // LỚP 6 — GDPT 2006 (BỔ SUNG ĐẦY ĐỦ SGK VẬT LÍ 6)
  // ==========================================================================
  {
    id: 'phys-2006-6-7',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'Vật lí 6 (SGK 2006) · Lực & Lực kế',
    sourceTag: SRC_2006_6,
    lessonNumber: 7,
    title: 'Bài 7 (SGK 2006): Lực kế, Biểu diễn Lực & Trọng lượng riêng ($d = 10D$)',
    subtitle: 'Phân biệt khối lượng riêng $D = m/V$ và trọng lượng riêng $d = P/V = 10D$',
    description:
      'Làm chủ cách dùng lực kế đo lực kéo/trọng lượng vật và mối liên hệ chuẩn SGK 2006 giữa $D$ ($\\text{kg/m}^3$) và $d$ ($\\text{N/m}^3$).',
    theorySections: [
      {
        heading: '1. Lực kế & Biểu diễn vectơ Lực',
        content:
          '• Dùng **lực kế** đo độ lớn của lực (đơn vị Niutơn — N).\n• Độ biến dạng lò xo tỉ lệ thuận với lực kéo trong giới hạn đàn hồi.'
      },
      {
        heading: '2. Trọng lượng riêng ($d$)',
        content:
          '• Trọng lượng của một mét khối một chất gọi là **trọng lượng riêng** $d$: $d = \\frac{P}{V} = 10 \\cdot D$ (đơn vị $\\text{N/m}^3$).'
      }
    ],
    keyFormulas: [
      'D = \\frac{m}{V} \\ (\\text{kg/m}^3); \\quad d = \\frac{P}{V} = 10\\cdot D \\ (\\text{N/m}^3)'
    ],
    ...SIM_PRESETS.hooke_forces,
    practiceExercises: [
      {
        source: SRC_2006_6,
        question: 'Biết khối lượng riêng của nhôm là $D = 2700\\text{ kg/m}^3$. Trọng lượng riêng của nhôm là:',
        options: ['A. $270\\text{ N/m}^3$', 'B. $2700\\text{ N/m}^3$', 'C. $27\\,000\\text{ N/m}^3$', 'D. $270\\,000\\text{ N/m}^3$'],
        correctIndex: 2,
        explanation: '$d = 10\\cdot D = 10 \\cdot 2700 = 27\\,000\\text{ N/m}^3$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_6,
        question: 'Một khối sắt có thể tích $2\\text{ dm}^3$, biết $D_{\\text{sắt}} = 7800\\text{ kg/m}^3$. Tính khối lượng và trọng lượng của khối sắt.',
        hints: ['Đổi $2\\text{ dm}^3 = 0{,}002\\text{ m}^3$.'],
        solutionSteps: [
          'Khối lượng: $m = D\\cdot V = 7800 \\cdot 0{,}002 = 15{,}6\\text{ kg}$.',
          'Trọng lượng: $P = 10\\cdot m = 156\\text{ N}$.'
        ],
        finalAnswer: '$m = 15{,}6\\text{ kg}$, $P = 156\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-2006-6-8',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'Vật lí 6 (SGK 2006) · Máy cơ đơn giản',
    sourceTag: SRC_2006_6,
    lessonNumber: 8,
    title: 'Bài 8 (SGK 2006): Ròng rọc Cố định vs Ròng rọc Động & Mặt phẳng nghiêng',
    subtitle: 'Ròng rọc cố định chỉ đổi hướng lực kéo; Ròng rọc động cho lợi 2 lần về lực; Mặt phẳng nghiêng càng thoai thoải lực càng nhỏ',
    description:
      'So sánh tỉ lệ lực kéo trên 3 máy cơ đơn giản của chương trình Vật lí 6 (2006) trên mô phỏng 2D/3D.',
    theorySections: [
      {
        heading: '1. Mặt phẳng nghiêng',
        content:
          '• Kéo vật lên cao theo mặt phẳng nghiêng cần lực nhỏ hơn trọng lượng $P$ của vật. Độ nghiêng càng ít (tấm ván càng dài) thì lực kéo càng nhỏ.'
      },
      {
        heading: '2. Ròng rọc cố định & Ròng rọc động',
        content:
          '• **Ròng rọc cố định**: chỉ đổi hướng của lực kéo (tiện đứng dưới đất kéo lên), không được lợi về độ lớn lực ($F = P$).\n• **Ròng rọc động**: giúp kéo vật lên với lực **nhỏ hơn trọng lượng một nửa** ($F = P/2$, bỏ qua ma sát).'
      }
    ],
    keyFormulas: [
      '\\text{Ròng rọc cố định}: F = P \\quad|\\quad \\text{1 Ròng rọc động}: F = \\frac{P}{2}'
    ],
    ...SIM_PRESETS.simple_machines,
    practiceExercises: [
      {
        source: SRC_2006_6,
        question: 'Dùng một ròng rọc động để kéo bao xi măng nặng $50\\text{ kg}$ lên cao (bỏ qua ma sát và khối lượng ròng rọc). Lực kéo tối thiểu cần thiết là:',
        options: ['A. $500\\text{ N}$', 'B. $250\\text{ N}$', 'C. $1000\\text{ N}$', 'D. $50\\text{ N}$'],
        correctIndex: 1,
        explanation: '$P = 10\\cdot 50 = 500\\text{ N}$. Qua 1 ròng rọc động được lợi 2 lần về lực $\\implies F = 500/2 = 250\\text{ N}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_6,
        question: 'Vì sao đường ô tô leo đèo núi cao thường uốn lượn ngoằn ngoèo hình chữ chi chứ không làm dốc thẳng đứng?',
        hints: ['Liên hệ nguyên lí mặt phẳng nghiêng.'],
        solutionSteps: [
          'Đường uốn lượn làm tăng chiều dài đoạn đường dốc, giảm độ dốc mặt phẳng nghiêng, từ đó giảm lực kéo cần thiết cho động cơ ô tô khi leo núi an toàn.'
        ],
        finalAnswer: 'Giảm độ dốc giúp giảm lực kéo cần thiết.'
      }
    ]
  },
  {
    id: 'phys-2006-6-9',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'Vật lí 6 (SGK 2006) · Nhiệt học',
    sourceTag: SRC_2006_6,
    lessonNumber: 9,
    title: 'Bài 9 (SGK 2006): Sự bay hơi – Ngưng tụ & Sự sôi ($100^\\circ\\text{C}$) của Chất lỏng',
    subtitle: 'Ba yếu tố làm nước bay hơi nhanh (nhiệt độ, gió, diện tích mặt thoáng) và đường nằm ngang trên đồ thị sự sôi',
    description:
      'Giải thích vì sao quần áo phơi căng rộng nhanh khô, tại sao trong suốt lúc nước sôi nhiệt độ vẫn giữ nguyên $100^\\circ\\text{C}$.',
    theorySections: [
      {
        heading: '1. Bay hơi và Ngưng tụ',
        content:
          '• **Bay hơi** xảy ra ở mọi nhiệt độ trên mặt thoáng chất lỏng; tốc độ bay hơi tăng khi: **nhiệt độ cao**, **có gió**, và **diện tích mặt thoáng lớn**.\n• **Ngưng tụ** là quá trình hơi chuyển ngược thành lỏng khi gặp lạnh (mây, sương mù, giọt nước ngoài cốc đá).'
      },
      {
        heading: '2. Sự sôi',
        content:
          '• **Sự sôi** xảy ra ở nhiệt độ xác định ($100^\\circ\\text{C}$ với nước nguyên chất ở 1 atm) cả **bên trong** lẫn **trên mặt thoáng** chất lỏng. Trong suốt thời gian sôi, nhiệt độ của chất lỏng **không thay đổi**.'
      }
    ],
    keyFormulas: [
      'T_{\\text{sôi (nước)}} = 100^\\circ\\text{C} \\ (\\text{bình thường})'
    ],
    ...SIM_PRESETS.phase_change,
    practiceExercises: [
      {
        source: SRC_2006_6,
        question: 'Trong suốt thời gian nước đang sôi trong ấm ở áp suất chuẩn, nhiệt độ của nước thay đổi như thế nào?',
        options: [
          'A. Tăng liên tục lên trên $120^\\circ\\text{C}$',
          'B. Không đổi, giữ nguyên ở $100^\\circ\\text{C}$',
          'C. Giảm dần xuống $80^\\circ\\text{C}$',
          'D. Lúc tăng lúc giảm'
        ],
        correctIndex: 1,
        explanation: 'Nhiệt lượng cung cấp lúc sôi chỉ dùng để phá vỡ liên kết phân tử cho nước hóa hơi, nhiệt độ không tăng.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_6,
        question: 'Nêu $3$ biện pháp giúp phơi thóc hoặc quần áo khô nhanh nhất và chỉ ra từng biện pháp ứng với yếu tố bay hơi nào?',
        hints: ['Phơi nắng (nhiệt độ), chỗ thoáng gió (gió), trải rộng (diện tích mặt thoáng).'],
        solutionSteps: [
          '1. Phơi ngoài trời nắng: tăng nhiệt độ.',
          '2. Phơi nơi thoáng gió: tăng luồng gió thổi hơi ẩm đi.',
          '3. Căng rộng quần áo / cào mỏng thóc: tăng diện tích mặt thoáng.'
        ],
        finalAnswer: 'Tăng nhiệt độ, tăng gió, tăng diện tích mặt thoáng.'
      }
    ]
  },

  // ==========================================================================
  // LỚP 7 — GDPT 2006 (BỔ SUNG ĐẦY ĐỦ SGK VẬT LÍ 7)
  // ==========================================================================
  {
    id: 'phys-2006-7-7',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'Vật lí 7 (SGK 2006) · Quang học',
    sourceTag: SRC_2006_7,
    lessonNumber: 7,
    title: 'Bài 7 (SGK 2006): Ảnh của một vật tạo bởi Gương phẳng & Cách vẽ tia phản xạ',
    subtitle: 'Ảnh ảo bằng vật, khoảng cách từ ảnh tới gương bằng khoảng cách từ vật tới gương và ứng dụng kính tiềm vọng',
    description:
      'Thao tác di chuyển vật trước gương phẳng để thấy ảnh ảo đối xứng luôn có kích thước bằng vật và xác định vùng nhìn thấy của gương.',
    theorySections: [
      {
        heading: '1. Tính chất ảnh tạo bởi Gương phẳng',
        content:
          '• Là **ảnh ảo**, không hứng được trên màn chắn.\n• Độ lớn của ảnh **bằng độ lớn của vật**.\n• Khoảng cách từ một điểm của vật đến gương phẳng **bằng** khoảng cách từ ảnh của điểm đó đến gương (tính đối xứng qua mặt gương).'
      },
      {
        heading: '2. Hai cách dựng ảnh',
        content:
          '• Dựng ảnh $S\'$ đối xứng với $S$ qua mặt phẳng gương.\n• Hoặc vẽ hai tia tới từ $S$ tới gương rồi áp dụng định luật phản xạ $i\' = i$ để tìm giao điểm đường kéo dài của hai tia phản xạ.'
      }
    ],
    keyFormulas: [
      'A\'B\' = AB; \\quad d_{\\text{ảnh-gương}} = d_{\\text{vật-gương}}'
    ],
    ...SIM_PRESETS.plane_mirror,
    practiceExercises: [
      {
        source: SRC_2006_7,
        question: 'Một bạn học sinh cao $1{,}55\\text{ m}$ đứng cách gương phẳng thẳng đứng $1{,}2\\text{ m}$. Ảnh của bạn trong gương cao bao nhiêu và cách bạn bao nhiêu mét?',
        options: [
          'A. Cao $1{,}55\\text{ m}$, cách bạn $1{,}2\\text{ m}$',
          'B. Cao $1{,}55\\text{ m}$, cách bạn $2{,}4\\text{ m}$',
          'C. Cao $0{,}775\\text{ m}$, cách bạn $2{,}4\\text{ m}$',
          'D. Cao $3{,}1\\text{ m}$, cách bạn $1{,}2\\text{ m}$'
        ],
        correctIndex: 1,
        explanation: 'Ảnh bằng vật ($1{,}55\\text{ m}$) và cách gương $1{,}2\\text{ m} \\implies$ khoảng cách từ bạn đến ảnh là $1{,}2 + 1{,}2 = 2{,}4\\text{ m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_7,
        question: 'Chiếu một tia sáng hợp với mặt gương phẳng một góc $35^\\circ$. Tính góc tới và góc phản xạ.',
        hints: ['Pháp tuyến vuông góc với mặt gương nên góc tới $i = 90^\\circ - 35^\\circ$.'],
        solutionSteps: [
          'Góc tới $i = 90^\\circ - 35^\\circ = 55^\\circ$.',
          'Theo định luật phản xạ ánh sáng: góc phản xạ $i\' = i = 55^\\circ$.'
        ],
        finalAnswer: '$i = i\' = 55^\\circ$.'
      }
    ]
  },
  {
    id: 'phys-2006-7-8',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'Vật lí 7 (SGK 2006) · Điện học',
    sourceTag: SRC_2006_7,
    lessonNumber: 8,
    title: 'Bài 8 (SGK 2006): Cường độ Dòng điện ($I$) & Hiệu điện thế ($U$) trong Mạch Nối tiếp – Song song',
    subtitle: 'Quy luật cộng hiệu điện thế ở mạch nối tiếp và cộng cường độ dòng điện ở mạch song song',
    description:
      'Ghi nhớ 2 quy tắc vàng của điện học lớp 7 (2006) để tính ngay dòng điện và điện áp trên hai bóng đèn mắc nối tiếp hay song song.',
    theorySections: [
      {
        heading: '1. Đoạn mạch mắc Nối tiếp',
        content:
          '• Cường độ dòng điện bằng nhau tại mọi điểm: $I = I_1 = I_2$.\n• Hiệu điện thế tổng bằng tổng các hiệu điện thế thành phần: $U = U_1 + U_2$.'
      },
      {
        heading: '2. Đoạn mạch mắc Song song',
        content:
          '• Hiệu điện thế hai đầu mỗi nhánh bằng nhau: $U = U_1 = U_2$.\n• Cường độ dòng điện mạch chính bằng tổng hai nhánh: $I = I_1 + I_2$.\n• Các bóng đèn gia đình đều mắc **song song** để mỗi đèn nhận đủ $220\\text{ V}$ và tắt một đèn không tắt cả nhà.'
      }
    ],
    keyFormulas: [
      '\\text{Nối tiếp}: I = I_1 = I_2,\\ U = U_1 + U_2',
      '\\text{Song song}: U = U_1 = U_2,\\ I = I_1 + I_2'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_2006_7,
        question: 'Hai bóng đèn giống nhau mắc NỐI TIẾP vào nguồn điện $12\\text{ V}$. Biết cường độ qua đèn 1 là $0{,}4\\text{ A}$ và hiệu điện thế hai đầu đèn 1 là $5\\text{ V}$. Tìm $I_2$ và $U_2$?',
        options: [
          'A. $I_2 = 0{,}4\\text{ A}, U_2 = 7\\text{ V}$',
          'B. $I_2 = 0{,}8\\text{ A}, U_2 = 12\\text{ V}$',
          'C. $I_2 = 0{,}2\\text{ A}, U_2 = 5\\text{ V}$',
          'D. $I_2 = 0{,}4\\text{ A}, U_2 = 12\\text{ V}$'
        ],
        correctIndex: 0,
        explanation: 'Nối tiếp nên $I_2 = I_1 = 0{,}4\\text{ A}$ và $U_2 = U - U_1 = 12 - 5 = 7\\text{ V}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_7,
        question: 'Hai bóng đèn Đ₁ và Đ₂ mắc song song vào nguồn điện $6\\text{ V}$. Cường độ mạch chính là $0{,}9\\text{ A}$, cường độ qua Đ₁ là $0{,}35\\text{ A}$. Tính $U_1, U_2$ và $I_2$.',
        hints: ['Mạch song song: $U_1 = U_2 = U$ và $I = I_1 + I_2$.'],
        solutionSteps: [
          '$U_1 = U_2 = 6\\text{ V}$.',
          '$I_2 = I - I_1 = 0{,}9 - 0{,}35 = 0{,}55\\text{ A}$.'
        ],
        finalAnswer: '$U_1 = U_2 = 6\\text{ V}$, $I_2 = 0{,}55\\text{ A}$.'
      }
    ]
  },
  {
    id: 'phys-2006-7-9',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'Vật lí 7 (SGK 2006) · Điện học',
    sourceTag: SRC_2006_7,
    lessonNumber: 9,
    title: 'Bài 9 (SGK 2006): Nam châm điện, Chuông điện & Quy tắc An toàn khi sử dụng Điện',
    subtitle: 'Tác dụng từ làm quay kim nam châm / rung chuông điện, dòng điện an toàn dưới $40\\text{ V}$ và phòng tránh điện giật',
    description:
      'Khám phá nguyên lí hoạt động chuông điện từ tác dụng từ ngắt quãng và các quy tắc an toàn điện trong đời sống.',
    theorySections: [
      {
        heading: '1. Tác dụng Từ của Dòng điện & Chuông điện',
        content:
          '• Dòng điện chạy qua cuộn dây quấn quanh lõi sắt non biến nó thành **nam châm điện** có lực hút từ mạnh dùng làm cần cẩu sắt, rơ-le, chuông điện.\n• Chuông điện hoạt động liên tục nhờ tiếp điểm đóng–ngắt tự động mỗi khi búa gõ vào chuông.'
      },
      {
        heading: '2. Quy tắc An toàn Điện (SGK 2006)',
        content:
          '• Chỉ làm thí nghiệm với nguồn dưới $40\\text{ V}$ (pin/ắc quy). Không chạm tay trần vào dây trần, không dùng tay ướt bật công tắc $220\\text{ V}$, ngắt cầu dao trước khi sửa chữa.'
      }
    ],
    keyFormulas: [
      'U_{\\text{an toàn}} < 40\\text{ V}; \\quad I_{\\text{nguy hiểm}} > 10\\text{ mA}'
    ],
    ...SIM_PRESETS.electromagnet_bell,
    practiceExercises: [
      {
        source: SRC_2006_7,
        question: 'Chuông điện kêu vang liên hồi hoạt động dựa trên tác dụng nào của dòng điện?',
        options: [
          'A. Tác dụng hóa học',
          'B. Tác dụng từ của nam châm điện kết hợp ngắt mạch tự động',
          'C. Tác dụng nhiệt làm nóng dây tóc',
          'D. Tác dụng phát sáng'
        ],
        correctIndex: 1,
        explanation: 'Cuộn dây có dòng điện trở thành nam châm điện hút miếng sắt gắn búa đập vào chuông.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_7,
        question: 'Vì sao khi một chiếc cầu chì bị đứt chảy, không được thay bằng đoạn dây đồng to mà phải thay đúng dây chì có cường độ định mức tương ứng?',
        hints: ['Dây đồng chịu dòng quá lớn khó nóng chảy khi đoản mạch.'],
        solutionSteps: [
          'Dây đồng có nhiệt độ nóng chảy cao ($1083^\\circ\\text{C}$) và tiết diện to nên khi chập mạch nó không tự đứt, dẫn đến cháy nổ dây dẫn và thiết bị điện trong nhà.'
        ],
        finalAnswer: 'Dây đồng không kịp nóng chảy ngắt mạch bảo vệ khi quá tải.'
      }
    ]
  },

  // ==========================================================================
  // LỚP 8 — GDPT 2006 (BỔ SUNG ĐẦY ĐỦ SGK VẬT LÍ 8)
  // ==========================================================================
  {
    id: 'phys-2006-8-7',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'Vật lí 8 (SGK 2006) · Cơ học',
    sourceTag: SRC_2006_8,
    lessonNumber: 7,
    title: 'Bài 7 (SGK 2006): Bình thông nhau, Máy nén Thủy lực & Áp suất Khí quyển',
    subtitle: 'Mặt thoáng chất lỏng đứng yên trong bình thông nhau cùng độ cao và nguyên lí truyền áp suất Pascal',
    description:
      'Thực hành tính chiều cao cột chất lỏng khác nhau trong bình thông nhau chữ U và tính lực nâng trên máy ép thủy lực.',
    theorySections: [
      {
        heading: '1. Bình thông nhau & Máy thủy lực',
        content:
          '• Trong bình thông nhau chứa cùng một chất lỏng đứng yên, các mặt thoáng của chất lỏng ở các nhánh khác nhau đều có **cùng một độ cao**.\n• Áp suất truyền đi nguyên vẹn trong chất lỏng: $\\frac{F_1}{S_1} = \\frac{F_2}{S_2}$.'
      },
      {
        heading: '2. Áp suất Khí quyển (Thí nghiệm Tô-ri-xe-li)',
        content:
          '• Áp suất khí quyển ở mực nước biển đỡ được cột thủy ngân cao $76\\text{ cm}$ ($760\\text{ mmHg} \\approx 101\\,300\\text{ Pa}$), tương đương cột nước cao khoảng $10{,}3\\text{ m}$.'
      }
    ],
    keyFormulas: [
      'p_A = p_B \\iff d_1 h_1 = d_2 h_2',
      '\\frac{F_2}{F_1} = \\frac{S_2}{S_1}'
    ],
    ...SIM_PRESETS.fluid_pressure,
    practiceExercises: [
      {
        source: SRC_2006_8,
        question: 'Tại cùng độ sâu trong cùng một chất lỏng đứng yên (dầu hoặc nước), áp suất ở mọi điểm cùng mặt phẳng nằm ngang có đặc điểm gì?',
        options: ['A. Bằng nhau', 'B. Nhánh rộng lớn hơn', 'C. Nhánh hẹp lớn hơn', 'D. Bằng 0'],
        correctIndex: 0,
        explanation: 'Theo công thức $p = d \\cdot h$, cùng $d$ và cùng độ sâu $h$ thì áp suất bằng nhau.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_8,
        question: 'Tính áp suất cột nước biển ở độ sâu $30\\text{ m}$, biết trọng lượng riêng nước biển là $d = 10\\,300\\text{ N/m}^3$.',
        hints: ['$p = d \\cdot h$.'],
        solutionSteps: [
          '$p = 10\\,300 \\cdot 30 = 309\\,000\\text{ Pa}$.'
        ],
        finalAnswer: '$309\\,000\\text{ Pa}$.'
      }
    ]
  },
  {
    id: 'phys-2006-8-8',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'Vật lí 8 (SGK 2006) · Cơ học',
    sourceTag: SRC_2006_8,
    lessonNumber: 8,
    title: 'Bài 8 (SGK 2006): Cơ năng (Thế năng – Động năng) & Định luật Bảo toàn Cơ năng',
    subtitle: 'Sự chuyển hóa qua lại giữa Thế năng hấp dẫn ($P\\cdot h$), Thế năng đàn hồi và Động năng ($\\frac{1}{2}mv^2$) khi vật rơi / lăn dốc',
    description:
      'Quan sát viên bi rơi và con lắc trao đổi liên tục Thế năng $\\leftrightarrow$ Động năng trong không gian 2D/3D.',
    theorySections: [
      {
        heading: '1. Thế năng và Động năng',
        content:
          '• **Thế năng hấp dẫn**: phụ thuộc vào khối lượng và độ cao vật so với mốc chọn ($W_t = P\\cdot h$).\n• **Thế năng đàn hồi**: phụ thuộc vào độ biến dạng của vật đàn hồi (lò xo, dây cung).\n• **Động năng**: cơ năng vật có được do đang chuyển động, vật khối lượng càng lớn và chạy càng nhanh thì động năng càng lớn.'
      },
      {
        heading: '2. Sự chuyển hóa & Bảo toàn Cơ năng',
        content:
          '• Khi quả bóng rơi xuống: độ cao giảm ($W_t$ giảm) còn vận tốc tăng ($W_đ$ tăng) $\\to$ Thế năng chuyển hóa thành Động năng.'
      }
    ],
    keyFormulas: [
      'W = W_{\\text{đ}} + W_t = \\frac{1}{2}mv^2 + 10mh = \\text{hằng số}'
    ],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_2006_8,
        question: 'Khi ném một quả bóng thẳng đứng lên cao, trong giai đoạn bóng ĐANG ĐI LÊN thì cơ năng chuyển hóa thế nào?',
        options: [
          'A. Thế năng chuyển thành Động năng',
          'B. Động năng chuyển thành Thế năng (bóng chậm dần và cao dần)',
          'C. Chỉ có nhiệt năng tăng',
          'D. Cơ năng mất hết'
        ],
        correctIndex: 1,
        explanation: 'Bóng lên cao chậm dần nên Động năng giảm dần chuyển thành Thế năng hấp dẫn tăng dần.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_8,
        question: 'Một viên bi khối lượng $0{,}2\\text{ kg}$ được thả rơi từ độ cao $5\\text{ m}$ (bỏ qua lực cản không khí). Tính cơ năng ban đầu và động năng ngay khi chạm đất.',
        hints: ['Lấy mốc thế năng tại mặt đất.'],
        solutionSteps: [
          'Cơ năng ban đầu tại $h=5\\text{ m}$: $W = P\\cdot h = (10\\cdot 0{,}2)\\cdot 5 = 10\\text{ J}$.',
          'Khi chạm đất ($h=0$), toàn bộ thế năng chuyển thành động năng: $W_đ = 10\\text{ J}$.'
        ],
        finalAnswer: '$10\\text{ J}$.'
      }
    ]
  },
  {
    id: 'phys-2006-8-9',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'Vật lí 8 (SGK 2006) · Nhiệt học',
    sourceTag: SRC_2006_8,
    lessonNumber: 9,
    title: 'Bài 9 (SGK 2006): Công thức tính Nhiệt lượng ($Q = mc\\Delta t$), Phương trình Cân bằng Nhiệt & Nhiên liệu',
    subtitle: 'Giải thành thạo bài toán pha trộn nước nóng – lạnh $Q_{\\text{tỏa}} = Q_{\\text{thu}}$ và tính nhiệt lượng tỏa ra khi đốt nhiên liệu $Q = q\\cdot m$',
    description:
      'Làm chủ trọn bộ công thức tính nhiệt lượng trọng tâm Chương II Vật lí 8 (2006) bằng thí nghiệm nhiệt lượng kế ảo.',
    theorySections: [
      {
        heading: '1. Công thức tính Nhiệt lượng & Nhiệt dung riêng ($c$)',
        content:
          '• Nhiệt lượng vật thu vào (hoặc tỏa ra) khi đổi nhiệt độ: $Q = m \\cdot c \\cdot \\Delta t$.\n• Trong đó $c$ là **nhiệt dung riêng** ($\\text{J/kg.K}$): nước có $c = 4200\\text{ J/kg.K}$ rất lớn nên dùng làm mát động cơ và điều hòa khí hậu biển.'
      },
      {
        heading: '2. Phương trình Cân bằng Nhiệt & Hiệu suất Bếp',
        content:
          '• Khi trộn hai vật nhiệt độ khác nhau (bỏ qua mất nhiệt): $Q_{\\text{tỏa}} = Q_{\\text{thu}}$, tức $m_1 c_1 (t_1 - t_{cb}) = m_2 c_2 (t_{cb} - t_2)$.\n• Nhiệt lượng tỏa ra khi đốt cháy hoàn toàn $m$ kg nhiên liệu năng suất tỏa nhiệt $q$: $Q_{\\text{tỏa}} = q \\cdot m$.'
      }
    ],
    keyFormulas: [
      'Q = m\\cdot c\\cdot \\Delta t; \\quad Q_{\\text{tỏa}} = Q_{\\text{thu}}',
      'Q_{\\text{đốt}} = q\\cdot m; \\quad H = \\frac{Q_{\\text{có ích}}}{Q_{\\text{tỏa}}} \\cdot 100\\%'
    ],
    ...SIM_PRESETS.calorimetry,
    practiceExercises: [
      {
        source: SRC_2006_8,
        question: 'Tính nhiệt lượng cần truyền để đun $2\\text{ kg}$ nước ($c = 4200\\text{ J/kg.K}$) từ $25^\\circ\\text{C}$ sôi đến $100^\\circ\\text{C}$:',
        options: ['A. $630\\text{ kJ}$', 'B. $420\\text{ kJ}$', 'C. $840\\text{ kJ}$', 'D. $210\\text{ kJ}$'],
        correctIndex: 0,
        explanation: '$Q = 2 \\cdot 4200 \\cdot (100 - 25) = 630\\,000\\text{ J} = 630\\text{ kJ}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_2006_8,
        question: 'Đổ $2\\text{ kg}$ nước nóng ở $80^\\circ\\text{C}$ vào $3\\text{ kg}$ nước lạnh ở $20^\\circ\\text{C}$. Tìm nhiệt độ khi có cân bằng nhiệt.',
        hints: ['Cùng là nước nên rút gọn được $c = 4200$ ở hai vế $Q_{\\text{tỏa}} = Q_{\\text{thu}}$.'],
        solutionSteps: [
          'Phương trình cân bằng nhiệt: $m_1 c (80 - t) = m_2 c (t - 20)$.',
          'Thay số: $2(80 - t) = 3(t - 20) \\implies 160 - 2t = 3t - 60$.',
          '$5t = 220 \\implies t = 44^\\circ\\text{C}$.'
        ],
        finalAnswer: '$t = 44^\\circ\\text{C}$.'
      }
    ]
  }
];
