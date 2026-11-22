import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const SRC_10 = 'GDPT 2018 (Thông tư 32/2018) · Vật lí 10 (KNTT · Sở GD&ĐT)';

export const PHYSICS_GDPT_10_LESSONS: PhysicsLesson[] = [
  // ================= CHƯƠNG I. MỞ ĐẦU (BÀI 1 - 3) =================
  {
    id: 'phys-10-b1',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương I · Mở đầu',
    sourceTag: SRC_10,
    lessonNumber: 1,
    title: 'Bài 1: Làm quen với Vật lí',
    subtitle: 'Đối tượng, mục tiêu nghiên cứu của Vật lí, phương pháp thực nghiệm – mô hình và ảnh hưởng đến công nghệ',
    description:
      'Khám phá đối tượng nghiên cứu (vật chất, năng lượng và tương tác), quy trình phương pháp thực nghiệm và mô hình lí thuyết cùng vai trò nền tảng của Vật lí trong khoa học – kỹ thuật hiện đại.',
    theorySections: [
      {
        heading: '1. Đối tượng và mục tiêu nghiên cứu của Vật lí',
        content:
          '• Vật lí học nghiên cứu các dạng vận động tổng quát nhất của vật chất và năng lượng (cơ học, nhiệt học, điện – từ, quang học, vật lí hạt nhân, vật lí lượng tử).\n• Mục tiêu: Khám phá quy luật tự nhiên tổng quát từ vi mô (hạt cơ bản, nguyên tử) đến vĩ mô (hệ hành tinh, vũ trụ).'
      },
      {
        heading: '2. Phương pháp thực nghiệm và phương pháp mô hình',
        content:
          '• **Phương pháp thực nghiệm**: Xác định vấn đề → Quan sát, thu thập thông tin → Đưa ra dự đoán → Thí nghiệm kiểm tra → Kết luận (chấp nhận hoặc bác bỏ giả thuyết).\n• **Phương pháp mô hình**: Dùng mô hình vật chất (chất điểm, khí lí tưởng), mô hình lí thuyết hoặc mô hình toán học ($s = vt$, $\\vec{F} = m\\vec{a}$) để mô tả hiện tượng phức tạp.'
      },
      {
        heading: '3. Ảnh hưởng của Vật lí đối với đời sống và công nghệ',
        content:
          '• Vật lí là nền tảng cho 4 cuộc cách mạng công nghiệp: Động cơ hơi nước (Cơ học – Nhiệt động lực học), Điện khí hóa (Cảm ứng điện từ Faraday), Tin học – Bán dẫn (Vật lí chất rắn – Lượng tử) và AI – IoT – Laser.'
      }
    ],
    keyFormulas: [
      '\\text{Quan sát} \\to \\text{Giả thuyết} \\to \\text{Thí nghiệm} \\to \\text{Định luật}',
      '1\\text{ N} = 1\\text{ kg}\\cdot\\text{m/s}^2, \\quad 1\\text{ J} = 1\\text{ kg}\\cdot\\text{m}^2/\\text{s}^2'
    ],
    ...SIM_PRESETS.kinematics,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Bước nào quyết định tính đúng đắn cuối cùng của một giả thuyết trong phương pháp thực nghiệm?',
        options: [
          'A. Quan sát hiện tượng bằng mắt thường',
          'B. Thực hiện thí nghiệm kiểm chứng có đo đạc định lượng',
          'C. Đặt tên cho giả thuyết',
          'D. Viết báo cáo lịch sử'
        ],
        correctIndex: 1,
        explanation: 'Thí nghiệm kiểm chứng với phép đo định lượng là tiêu chuẩn kiểm tra tính đúng đắn của giả thuyết vật lí.'
      },
      {
        source: SRC_10,
        question: 'Mô hình "chất điểm" khi xét Trái Đất chuyển động quanh Mặt Trời thuộc loại mô hình nào?',
        options: ['A. Mô hình vật chất', 'B. Mô hình sinh học', 'C. Mô hình hóa học', 'D. Mô hình kinh tế'],
        correctIndex: 0,
        explanation: 'Chất điểm là mô hình vật chất bỏ qua kích thước vật khi kích thước rất nhỏ so với khoảng cách khảo sát.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Trình bày 5 bước của phương pháp thực nghiệm khi em muốn kiểm tra xem chu kì con lắc đơn có phụ thuộc khối lượng quả nặng hay không.',
        hints: ['Thay đổi từng biến một (khối lượng $m$), giữ nguyên chiều dài dây $l$ và góc lệch nhỏ.'],
        solutionSteps: [
          'Bước 1: Xác định vấn đề: Chu kì dao động nhỏ $T$ có phụ thuộc khối lượng $m$ không?',
          'Bước 2: Quan sát & dự đoán: Khi cùng chiều dài dây $l$, các vật nặng nhẹ có dao động cùng nhịp không?',
          'Bước 3: Thí nghiệm kiểm tra: Giữ nguyên $l = 1\\text{ m}$, góc $\\alpha_0 = 8^\\circ$, lần lượt đo 10 chu kì với quả nặng $50\\text{ g}, 100\\text{ g}, 200\\text{ g}$.',
          'Bước 4–5: So sánh giá trị $T$ đo được và rút ra kết luận $T$ không phụ thuộc $m$.'
        ],
        finalAnswer: 'Thực hiện đúng 5 bước phương pháp thực nghiệm với biến kiểm soát là khối lượng $m$.'
      }
    ]
  },
  {
    id: 'phys-10-b2',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương I · Mở đầu',
    sourceTag: SRC_10,
    lessonNumber: 2,
    title: 'Bài 2: Các quy tắc an toàn trong phòng thực hành Vật lí',
    subtitle: 'Nhận biết biển báo an toàn, phòng tránh rủi ro điện – nhiệt – phóng xạ và xử lý sự cố phòng thí nghiệm',
    description:
      'Trang bị đầy đủ quy tắc an toàn khi thao tác thiết bị điện, nguồn nhiệt, chất dễ cháy, tia laser và ý nghĩa hệ thống biển cảnh báo chuẩn trong phòng thực hành THPT.',
    theorySections: [
      {
        heading: '1. An toàn với thiết bị điện và nguồn nhiệt',
        content:
          '• Kiểm tra dây dẫn cách điện trước khi cắm nguồn; ngắt công tắc nguồn trước khi lắp ráp hoặc điều chỉnh mạch điện.\n• Với mạng điện thí nghiệm (> 24 V AC hoặc > 40 V DC), tuyệt đối không chạm tay ướt vào đầu dây hở; mắc đúng cực (+)/(-) của nguồn một chiều và thang đo của ampe kế/vôn kế.'
      },
      {
        heading: '2. Biển báo an toàn chuẩn trong phòng thực hành',
        content:
          '• **Hình tam giác viền đen nền vàng**: Biển cảnh báo nguy hiểm (điện áp cao, chất phóng xạ, tia laser, bề mặt nóng, chất độc hại).\n• **Hình tròn viền đỏ gạch chéo**: Biển cấm (cấm lửa, cấm chạm tay, cấm nước).\n• **Hình tròn nền xanh dương**: Biển bắt buộc tuân thủ (đeo kính bảo hộ, đeo găng tay cách điện).'
      },
      {
        heading: '3. Quy trình xử lý nhanh khi xảy ra sự cố',
        content:
          '• Khi có người bị điện giật: Ngắt ngay cầu dao/aptomat tổng, dùng vật khô không dẫn điện (gậy gỗ, nhựa) tách nạn nhân khỏi nguồn và báo giáo viên.\n• Khi cháy thiết bị điện: Ngắt nguồn điện trước, dùng bình chữa cháy CO₂ hoặc cát khô — tuyệt đối KHÔNG dội nước vào thiết bị đang có điện.'
      }
    ],
    keyFormulas: [
      'U_{\\text{an toàn (khô)}} \\le 40\\text{ V (DC)} \\text{ hoặc } \\le 24\\text{ V (AC)}',
      '\\text{Ngắt nguồn điện} \\to \\text{Cách ly} \\to \\text{Sơ cứu / Báo giáo viên}'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Khi phát hiện một thiết bị điện trong phòng thí nghiệm bốc khói và phát lửa, hành động ĐẦU TIÊN cần làm là:',
        options: [
          'A. Dội ngay nước sạch vào thiết bị',
          'B. Ngắt ngay cầu dao/công tắc nguồn điện tổng của bàn thí nghiệm',
          'C. Dùng tay rút trực tiếp lõi dây đồng',
          'D. Mở tất cả cửa sổ rồi đứng quan sát'
        ],
        correctIndex: 1,
        explanation: 'Phải ngắt ngay nguồn điện để loại trừ nguy cơ điện giật và cháy lan, sau đó dùng bình CO₂ hoặc cát khô.'
      },
      {
        source: SRC_10,
        question: 'Biển báo hình tam giác đều, nền vàng, viền đen có biểu tượng tia sét mang ý nghĩa gì?',
        options: [
          'A. Cấm sử dụng điện thoại',
          'B. Bắt buộc đeo găng tay',
          'C. Cảnh báo nguy hiểm điện áp cao / điện giật',
          'D. Lối thoát hiểm'
        ],
        correctIndex: 2,
        explanation: 'Tam giác nền vàng viền đen là nhóm biển cảnh báo nguy hiểm; biểu tượng tia sét cảnh báo điện giật.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Nêu 3 nguyên tắc bắt buộc khi sử dụng đồng hồ đo điện đa năng (ampe kế, vôn kế) để tránh làm cháy cầu chì hoặc hỏng thiết bị.',
        hints: ['Chú ý cách mắc nối tiếp/song song và chọn thang đo lớn nhất trước.'],
        solutionSteps: [
          '1. Chọn đúng chức năng (V, A, Ω) và đặt ở thang đo lớn nhất trước khi đóng mạch rồi giảm dần để đọc chính xác.',
          '2. Ampe kế mắc nối tiếp vào nhánh cần đo; Vôn kế mắc song song hai đầu đoạn mạch cần đo.',
          '3. Đấu đúng cực dương (+) – âm (-) với dòng một chiều và ngắt nguồn trước khi đổi dây.'
        ],
        finalAnswer: 'Đúng thang đo – đúng kiểu mắc (nối tiếp/song song) – đúng cực nguồn và ngắt nguồn khi chỉnh dây.'
      }
    ]
  },
  {
    id: 'phys-10-intro-err',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương I · Mở đầu',
    sourceTag: SRC_10,
    lessonNumber: 3,
    title: 'Bài 3: Thực hành tính sai số trong phép đo. Ghi kết quả đo',
    subtitle: 'Phép đo trực tiếp – gián tiếp, sai số hệ thống, sai số ngẫu nhiên, sai số tuyệt đối – tỉ đối và quy tắc viết kết quả đo',
    description:
      'Làm chủ kỹ năng xử lý số liệu thí nghiệm Vật lí GDPT 2018: tính giá trị trung bình, sai số ngẫu nhiên $\\overline{\\Delta A}$, sai số dụng cụ $\\Delta A_{dc}$ và quy tắc làm tròn khi ghi kết quả $A = \\bar{A} \\pm \\Delta A$.',
    theorySections: [
      {
        heading: '1. Phép đo trực tiếp, phép đo gián tiếp & Phân loại sai số',
        content:
          '• **Phép đo trực tiếp**: Đọc thẳng kết quả từ dụng cụ đo (thước đo chiều dài, đồng hồ bấm giây, cân).\n• **Phép đo gián tiếp**: Tính đại lượng qua công thức liên hệ từ các phép đo trực tiếp (ví dụ đo $s, t$ để tính tốc độ $v = s/t$).\n• **Sai số hệ thống**: Do cấu tạo dụng cụ (lệch điểm 0) hoặc độ chia nhỏ nhất (ĐCNN), thường lấy $\\Delta A_{dc} = \\frac{1}{2}$ hoặc $1$ ĐCNN.\n• **Sai số ngẫu nhiên**: Do thao tác, điều kiện môi trường làm các lần đo lệch nhau — khắc phục bằng cách đo nhiều lần lấy trung bình.'
      },
      {
        heading: '2. Công thức tính sai số phép đo trực tiếp & gián tiếp',
        content:
          '• Giá trị trung bình: $\\bar{A} = \\frac{A_1 + A_2 + \\dots + A_n}{n}$.\n• Sai số tuyệt đối từng lần: $\\Delta A_i = |\\bar{A} - A_i|$; sai số ngẫu nhiên trung bình: $\\overline{\\Delta A} = \\frac{\\Delta A_1 + \\dots + \\Delta A_n}{n}$.\n• Sai số tuyệt đối phép đo: $\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}$.\n• Sai số tỉ đối: $\\delta A = \\frac{\\Delta A}{\\bar{A}} \\cdot 100\\%$.\n• Phép đo gián tiếp $F = A^m B^n / C^p \\implies \\delta F = m\\delta A + n\\delta B + p\\delta C$.'
      },
      {
        heading: '3. Quy tắc ghi kết quả đo',
        content:
          '• Viết kết quả dưới dạng $A = \\bar{A} \\pm \\Delta A$.\n• Sai số tuyệt đối $\\Delta A$ thường chỉ giữ **1 hoặc tối đa 2 chữ số có nghĩa**, còn giá trị trung bình $\\bar{A}$ phải làm tròn đến **cùng hàng thập phân** với $\\Delta A$.'
      }
    ],
    keyFormulas: [
      '\\bar{A} = \\frac{A_1 + A_2 + \\dots + A_n}{n}',
      '\\Delta A = \\overline{\\Delta A} + \\Delta A_{dc}',
      '\\delta A = \\frac{\\Delta A}{\\bar{A}} \\cdot 100\\%',
      'F = A^m B^n \\implies \\delta F = m\\delta A + n\\delta B'
    ],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một học sinh đo 4 lần thời gian rơi được: $1{,}20\\text{ s}; 1{,}22\\text{ s}; 1{,}18\\text{ s}; 1{,}20\\text{ s}$. Giá trị trung bình $\\bar{t}$ và sai số ngẫu nhiên $\\overline{\\Delta t}$ là:',
        options: ['A. 1,20 s và 0,01 s', 'B. 1,20 s và 0,02 s', 'C. 1,21 s và 0,01 s', 'D. 1,19 s và 0,04 s'],
        correctIndex: 0,
        explanation: '$\\bar{t} = 4{,}80 / 4 = 1{,}20\\text{ s}$. Các độ lệch $|1{,}20 - t_i|$ là $0; 0{,}02; 0{,}02; 0$, nên $\\overline{\\Delta t} = 0{,}04/4 = 0{,}01\\text{ s}$.'
      },
      {
        source: SRC_10,
        question: 'Cho tốc độ $v = s/t$ với sai số tỉ đối $\\delta s = 2\\%$ và $\\delta t = 3\\%$. Sai số tỉ đối $\\delta v$ bằng:',
        options: ['A. 1%', 'B. 5%', 'C. 6%', 'D. 1,5%'],
        correctIndex: 1,
        explanation: 'Với phép chia $v = s/t$, sai số tỉ đối bằng tổng sai số tỉ đối: $\\delta v = \\delta s + \\delta t = 2\\% + 3\\% = 5\\%$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Đo đường kính một viên bi thép 5 lần bằng thước kẹp có ĐCNN $0{,}02\\text{ mm}$ thu được: $12{,}42; 12{,}44; 12{,}40; 12{,}42; 12{,}42$ (mm). Lấy sai số dụng cụ bằng một nửa ĐCNN. Hãy viết kết quả đo $d = \\bar{d} \\pm \\Delta d$.',
        hints: ['Tính $\\bar{d}$, tính từng $|\\bar{d} - d_i|$ rồi cộng $\\Delta d_{dc} = 0{,}01\\text{ mm}$.'],
        solutionSteps: [
          'Giá trị trung bình: $\\bar{d} = \\frac{12{,}42 + 12{,}44 + 12{,}40 + 12{,}42 + 12{,}42}{5} = 12{,}42\\text{ mm}$.',
          'Sai số ngẫu nhiên: $\\overline{\\Delta d} = \\frac{0 + 0{,}02 + 0{,}02 + 0 + 0}{5} = 0{,}008\\text{ mm}$.',
          'Sai số tuyệt đối: $\\Delta d = 0{,}008 + 0{,}010 = 0{,}018 \\approx 0{,}02\\text{ mm}$.',
          'Ghi kết quả cùng hàng thập phân: $d = (12{,}42 \\pm 0{,}02)\\text{ mm}$.'
        ],
        finalAnswer: '$d = (12{,}42 \\pm 0{,}02)\\text{ mm}$.'
      }
    ]
  },

  // ================= CHƯƠNG II. ĐỘNG HỌC (BÀI 4 - 12) =================
  {
    id: 'phys-10-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương II · Động học',
    sourceTag: SRC_10,
    lessonNumber: 4,
    title: 'Bài 4: Độ dịch chuyển và quãng đường đi được',
    subtitle: 'Chất điểm, hệ quy chiếu, phân biệt quãng đường (vô hướng) và độ dịch chuyển (vectơ), tổng hợp độ dịch chuyển',
    description:
      'Phân biệt bản chất vô hướng của quãng đường $s \\ge 0$ và bản chất vectơ của độ dịch chuyển $\\vec{d}$ nối từ vị trí đầu đến vị trí cuối trong GDPT 2018.',
    theorySections: [
      {
        heading: '1. Vị trí vật & Hệ quy chiếu',
        content:
          '• Để xác định vị trí của vật tại thời điểm $t$, ta gắn vào **vật làm mốc** một hệ tọa độ (thường là trục $Ox$) cùng đồng hồ đo thời gian → tạo thành **hệ quy chiếu**.'
      },
      {
        heading: '2. Quãng đường đi được và Độ dịch chuyển',
        content:
          '• **Quãng đường ($s$)**: Độ dài toàn bộ quỹ đạo vật đi qua ($s \\ge 0$, đại lượng vô hướng).\n• **Độ dịch chuyển ($\\vec{d}$)**: Đại lượng vectơ cho biết độ dài và hướng sự thay đổi vị trí của vật, nối thẳng từ điểm đầu $M_1$ đến điểm cuối $M_2$: $\\Delta x = x_2 - x_1$ trên trục thẳng.\n• Khi vật chuyển động thẳng **không đổi chiều**, độ lớn độ dịch chuyển bằng quãng đường ($|\\vec{d}| = s$); khi vật đổi chiều, $|\\vec{d}| < s$.'
      },
      {
        heading: '3. Tổng hợp độ dịch chuyển',
        content:
          '• Độ dịch chuyển tổng hợp qua nhiều chặng liên tiếp là tổng vectơ: $\\vec{d} = \\vec{d}_1 + \\vec{d}_2$ (áp dụng quy tắc ba điểm / hình bình hành).'
      }
    ],
    keyFormulas: [
      'd = \\Delta x = x_2 - x_1',
      '\\vec{d} = \\vec{d}_1 + \\vec{d}_2',
      'd_{\\text{vuông góc}} = \\sqrt{d_1^2 + d_2^2}'
    ],
    ...SIM_PRESETS.vectors,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một người đi thẳng $600\\text{ m}$ về hướng Đông rồi rẽ trái đi thẳng $800\\text{ m}$ về hướng Bắc. Quãng đường và độ lớn độ dịch chuyển lần lượt là:',
        options: ['A. 1400 m và 1400 m', 'B. 1400 m và 1000 m', 'C. 1000 m và 1400 m', 'D. 200 m và 1000 m'],
        correctIndex: 1,
        explanation: 'Quãng đường $s = 600 + 800 = 1400\\text{ m}$. Hai hướng Đông – Bắc vuông góc nên $d = \\sqrt{600^2 + 800^2} = 1000\\text{ m}$.'
      },
      {
        source: SRC_10,
        question: 'Trong trường hợp nào sau đây độ lớn độ dịch chuyển ĐÚNG BẰNG quãng đường đi được?',
        options: [
          'A. Vật chuyển động tròn hết 1 vòng',
          'B. Vật chuyển động thẳng và luôn giữ nguyên một chiều',
          'C. Vật ném thẳng đứng lên cao rồi rơi về tay',
          'D. Vật đi từ A đến B rồi quay ngược lại trung điểm AB'
        ],
        correctIndex: 1,
        explanation: 'Chỉ khi chuyển động thẳng và không đổi chiều thì độ lớn độ dịch chuyển mới bằng đúng quãng đường.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một xe máy chạy từ điểm A theo hướng Bắc $3\\text{ km}$, sau đó rẽ sang hướng Đông chạy tiếp $4\\text{ km}$ tới B. Tính quãng đường, độ lớn độ dịch chuyển và hướng của độ dịch chuyển.',
        hints: ['Vẽ tam giác vuông với hai cạnh $3\\text{ km}$ (Bắc) và $4\\text{ km}$ (Đông).'],
        solutionSteps: [
          'Quãng đường đi được: $s = 3 + 4 = 7\\text{ km}$.',
          'Độ lớn độ dịch chuyển: $d = \\sqrt{3^2 + 4^2} = 5\\text{ km}$.',
          'Góc lệch hướng Đông so với hướng Bắc: $\\tan\\alpha = \\frac{4}{3} \\implies \\alpha \\approx 53{,}1^\\circ$ (hướng Đông – Bắc).'
        ],
        finalAnswer: '$s = 7\\text{ km}$, $d = 5\\text{ km}$ theo hướng $53{,}1^\\circ$ Đông – Bắc.'
      }
    ]
  },
  {
    id: 'phys-10-uniform',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương II · Động học',
    sourceTag: SRC_10,
    lessonNumber: 5,
    title: 'Bài 5: Tốc độ và vận tốc',
    subtitle: 'Phân biệt tốc độ trung bình – tức thời (vô hướng) và vận tốc trung bình – tức thời (vectơ), công thức cộng vận tốc',
    description:
      'Làm rõ sự khác biệt cốt lõi giữa tốc độ ($s/t$) và vận tốc ($\\vec{d}/t$) trong chương trình GDPT 2018 cùng công thức tổng hợp vận tốc tương đối.',
    theorySections: [
      {
        heading: '1. Tốc độ trung bình & Tốc độ tức thời',
        content:
          '• **Tốc độ trung bình**: $v_{tb} = \\frac{s}{t}$ (luôn $\\ge 0$, cho biết mức độ nhanh chậm dựa trên quãng đường đi được).\n• **Tốc độ tức thời**: Tốc độ tại một thời điểm rất ngắn $\\Delta t \\to 0$ (số chỉ tốc kế xe máy/ô tô).'
      },
      {
        heading: '2. Vận tốc trung bình & Vận tốc tức thời',
        content:
          '• **Vận tốc trung bình**: $\\vec{v}_{tb} = \\frac{\\vec{d}}{\\Delta t}$ (đại lượng vectơ; trên trục $Ox$: $v_{tb} = \\frac{\\Delta x}{\\Delta t}$ có thể dương hoặc âm tùy chiều chuyển động).\n• **Vận tốc tức thời**: $\\vec{v} = \\frac{\\Delta \\vec{d}}{\\Delta t}$ khi $\\Delta t$ rất nhỏ, phương trùng tiếp tuyến quỹ đạo, chiều là chiều chuyển động.'
      },
      {
        heading: '3. Công thức cộng vận tốc',
        content:
          '• Gọi (1) là vật, (2) là hệ quy chiếu chuyển động (như dòng nước, thang cuốn), (3) là hệ quy chiếu đứng yên (bờ):\n$$\\vec{v}_{13} = \\vec{v}_{12} + \\vec{v}_{23}$$\n• Xuôi dòng: $v_{13} = v_{12} + v_{23}$; Ngược dòng: $v_{13} = |v_{12} - v_{23}|$.'
      }
    ],
    keyFormulas: [
      'v_{\\text{tốc độ}} = \\frac{s}{t}, \\qquad \\vec{v} = \\frac{\\vec{d}}{t}',
      '\\vec{v}_{13} = \\vec{v}_{12} + \\vec{v}_{23}',
      '1\\text{ m/s} = 3{,}6\\text{ km/h}'
    ],
    ...SIM_PRESETS.kinematics,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một vận động viên bơi xuôi dòng $100\\text{ m}$ hết $50\\text{ s}$ rồi bơi ngược về đúng điểm xuất phát hết $100\\text{ s}$. Vận tốc trung bình và tốc độ trung bình trên cả quá trình lần lượt là:',
        options: ['A. 0 m/s và 1,33 m/s', 'B. 1,33 m/s và 0 m/s', 'C. 1,5 m/s và 1,5 m/s', 'D. 1,33 m/s và 1,33 m/s'],
        correctIndex: 0,
        explanation: 'Vì quay lại điểm xuất phát nên độ dịch chuyển $d = 0 \\implies v_{tb} = 0$. Tổng quãng đường $200\\text{ m}$ trong $150\\text{ s}$ nên tốc độ trung bình $200/150 \\approx 1{,}33\\text{ m/s}$.'
      },
      {
        source: SRC_10,
        question: 'Một ca nô có vận tốc đối với nước là $15\\text{ km/h}$ chạy xuôi dòng nước chảy $3\\text{ km/h}$. Vận tốc của ca nô đối với bờ là:',
        options: ['A. 12 km/h', 'B. 18 km/h', 'C. 5 km/h', 'D. 45 km/h'],
        correctIndex: 1,
        explanation: 'Chuyển động xuôi dòng nên $v_{13} = v_{12} + v_{23} = 15 + 3 = 18\\text{ km/h}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một chiếc thuyền mũi hướng vuông góc với bờ sông rộng $120\\text{ m}$, vận tốc thuyền so với nước $v_{12} = 4\\text{ m/s}$, nước chảy dọc bờ $v_{23} = 3\\text{ m/s}$. Tính vận tốc thuyền so với bờ và quãng đường bị trôi dạt xuôi dòng khi sang bờ bên kia.',
        hints: ['Hai vectơ $\\vec{v}_{12}$ và $\\vec{v}_{23}$ vuông góc; thời gian qua sông chỉ phụ thuộc $v_{12}$.'],
        solutionSteps: [
          'Vận tốc thuyền so với bờ: $v_{13} = \\sqrt{4^2 + 3^2} = 5\\text{ m/s}$.',
          'Thời gian sang sông: $t = \\frac{120}{4} = 30\\text{ s}$.',
          'Độ trôi dạt xuôi dòng: $x = v_{23} \\cdot t = 3 \\cdot 30 = 90\\text{ m}$.'
        ],
        finalAnswer: '$v_{13} = 5\\text{ m/s}$, bị trôi dạt $90\\text{ m}$.'
      }
    ]
  },
  {
    id: 'phys-10-b6',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương II · Động học',
    sourceTag: SRC_10,
    lessonNumber: 6,
    title: 'Bài 6: Thực hành: Đo tốc độ của vật chuyển động',
    subtitle: 'Dụng cụ đo tốc độ dùng cổng quang điện, đồng hồ đo thời gian hiện số và cách tính sai số tốc độ',
    description:
      'Tìm hiểu cấu tạo và nguyên lý hoạt động của bộ thí nghiệm đo tốc độ trung bình và tức thời bằng cần rung / cổng quang điện kết nối đồng hồ đo thời gian hiện số.',
    theorySections: [
      {
        heading: '1. Phương án đo tốc độ bằng cổng quang điện',
        content:
          '• **Đo tốc độ trung bình** giữa hai cổng quang $A$ và $B$ cách nhau khoảng $s$: chọn chế độ `A ↔ B` để đồng hồ đếm thời gian $t$ xe đi từ A đến B, suy ra $v_{tb} = \\frac{s}{t}$.\n• **Đo tốc độ tức thời** tại cổng quang $A$: gắn tấm chắn sáng bề rộng $\\Delta s$ (ví dụ $10\\text{ mm}$) lên xe, chọn chế độ đếm thời gian chắn cổng $A$ ($\Delta t$ rất nhỏ), suy ra $v \\approx \\frac{\\Delta s}{\\Delta t}$.'
      },
      {
        heading: '2. Sai số và lưu ý thao tác thí nghiệm',
        content:
          '• Đặt máng nghiêng có góc ổn định hoặc chạy bằng xe không ma sát (đệm khí) để tái lập kết quả đồng nhất.\n• Lặp lại phép đo ít nhất 3–5 lần, tính $\\bar{t}$, $\\Delta t$ và sai số tỉ đối $\\delta v = \\delta s + \\delta t$.'
      }
    ],
    keyFormulas: [
      'v_{tb} = \\frac{s_{AB}}{t_{AB}}, \\qquad v_{\\text{tức thời}} \\approx \\frac{d_{\\text{tấm chắn}}}{\\Delta t_{\\text{chắn}}}',
      '\\delta v = \\frac{\\Delta v}{\\bar{v}} = \\frac{\\Delta s}{\\bar{s}} + \\frac{\\Delta t}{\\bar{t}}'
    ],
    ...SIM_PRESETS.kinematics,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Để đo tốc độ tức thời của xe trên máng tại điểm A bằng cổng quang điện, ta sử dụng đại lượng nào?',
        options: [
          'A. Bề rộng rất nhỏ của tấm chắn sáng chia cho thời gian tấm chắn đi qua cổng A',
          'B. Tổng chiều dài máng chia tổng thời gian',
          'C. Khối lượng xe chia cho thời gian',
          'D. Góc nghiêng máng nhân với thời gian'
        ],
        correctIndex: 0,
        explanation: 'Vì bề rộng tấm chắn $\\Delta s$ nhỏ (1–2 cm), $\\Delta t$ rất ngắn nên $\\Delta s / \\Delta t$ chính là tốc độ tức thời tại cổng A.'
      },
      {
        source: SRC_10,
        question: 'Một tấm chắn sáng rộng $1{,}0\\text{ cm}$ đi qua cổng quang mất thời gian $0{,}020\\text{ s}$. Tốc độ tức thời của xe là:',
        options: ['A. 0,05 m/s', 'B. 0,50 m/s', 'C. 5,0 m/s', 'D. 2,0 m/s'],
        correctIndex: 1,
        explanation: 'Đổi $1{,}0\\text{ cm} = 0{,}01\\text{ m} \\implies v = \\frac{0{,}01}{0{,}020} = 0{,}50\\text{ m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Cho khoảng cách hai cổng quang $s = 50{,}0 \\pm 0{,}1\\text{ cm}$, thời gian đo trung bình $\\bar{t} = 1{,}25 \\pm 0{,}01\\text{ s}$. Tính tốc độ trung bình và sai số tuyệt đối của tốc độ.',
        hints: ['Tính $\\bar{v} = \\bar{s}/\\bar{t}$ rồi dùng $\\Delta v = \\bar{v}(\\frac{\\Delta s}{\\bar{s}} + \\frac{\\Delta t}{\\bar{t}})$.'],
        solutionSteps: [
          '$\\bar{s} = 0{,}500\\text{ m} \\implies \\bar{v} = \\frac{0{,}500}{1{,}25} = 0{,}400\\text{ m/s}$.',
          'Sai số tỉ đối: $\\delta v = \\frac{0{,}1}{50{,}0} + \\frac{0{,}01}{1{,}25} = 0{,}002 + 0{,}008 = 0{,}01 = 1\\%$.',
          'Sai số tuyệt đối: $\\Delta v = 0{,}01 \\cdot 0{,}400 = 0{,}004\\text{ m/s}$.'
        ],
        finalAnswer: '$v = (0{,}400 \\pm 0{,}004)\\text{ m/s}$.'
      }
    ]
  },
  {
    id: 'phys-10-b7',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương II · Động học',
    sourceTag: SRC_10,
    lessonNumber: 7,
    title: 'Bài 7: Đồ thị độ dịch chuyển – thời gian',
    subtitle: 'Vẽ và đọc đồ thị (d – t) chuyển động thẳng đều, xác định vận tốc từ độ dốc đường thẳng',
    description:
      'Phân tích hình dáng đồ thị độ dịch chuyển – thời gian $d(t)$: đường thẳng xiên lên ($v > 0$), nằm ngang ($v = 0$ đứng yên), xiên xuống ($v < 0$) và tính hệ số góc.',
    theorySections: [
      {
        heading: '1. Phương trình độ dịch chuyển chuyển động thẳng đều',
        content:
          '• Khi vật chuyển động thẳng đều với vận tốc không đổi $v$: $d = v \\cdot t$ (hoặc tọa độ $x = x_0 + v \\cdot t$).\n• Đồ thị $d - t$ là một đoạn thẳng có độ dốc không đổi.'
      },
      {
        heading: '2. Ý nghĩa độ dốc (hệ số góc) của đồ thị d – t',
        content:
          '• Độ dốc đường thẳng: $v = \\frac{d_2 - d_1}{t_2 - t_1} = \\tan\\alpha$.\n• Đường đi lên: $v > 0$ (đi theo chiều dương); Đường nằm ngang: $v = 0$ (đứng yên); Đường đi xuống: $v < 0$ (đi ngược chiều dương).'
      }
    ],
    keyFormulas: [
      'd = v \\cdot t \\qquad (x = x_0 + v t)',
      'v = \\frac{\\Delta d}{\\Delta t} = \\frac{d_2 - d_1}{t_2 - t_1}'
    ],
    ...SIM_PRESETS.kinematics,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Trên đồ thị độ dịch chuyển – thời gian $(d - t)$, một đoạn thẳng nằm ngang song song với trục thời gian $Ot$ biểu diễn:',
        options: ['A. Chuyển động thẳng nhanh dần', 'B. Vật đang đứng yên ($v = 0$)', 'C. Vật đi ngược chiều dương', 'D. Chuyển động tròn'],
        correctIndex: 1,
        explanation: 'Độ dịch chuyển $d$ không đổi theo thời gian chứng tỏ độ dốc bằng 0 và vật đang đứng yên.'
      },
      {
        source: SRC_10,
        question: 'Tại $t_1 = 2\\text{ s}$ vật ở $d_1 = 10\\text{ m}$, tại $t_2 = 6\\text{ s}$ vật đi thẳng đều tới $d_2 = 30\\text{ m}$. Vận tốc của vật là:',
        options: ['A. 5 m/s', 'B. 7,5 m/s', 'C. 4 m/s', 'D. 20 m/s'],
        correctIndex: 0,
        explanation: '$v = \\frac{30 - 10}{6 - 2} = \\frac{20}{4} = 5\\text{ m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một người đi bộ từ gốc tọa độ đi đều $30\\text{ m}$ theo chiều dương trong $15\\text{ s}$, dừng nghỉ $10\\text{ s}$, rồi đi ngược lại về gốc tọa độ trong $15\\text{ s}$. Tính vận tốc trên từng giai đoạn và quãng đường tổng cộng.',
        hints: ['Tính $v_i = \\Delta d_i / \\Delta t_i$ cho mỗi giai đoạn 15 s, 10 s, 15 s.'],
        solutionSteps: [
          'Giai đoạn 1 ($0 \\to 15\\text{ s}$): $v_1 = \\frac{30 - 0}{15} = +2\\text{ m/s}$.',
          'Giai đoạn 2 ($15 \\to 25\\text{ s}$): Vật đứng yên, $v_2 = 0\\text{ m/s}$.',
          'Giai đoạn 3 ($25 \\to 40\\text{ s}$): $v_3 = \\frac{0 - 30}{15} = -2\\text{ m/s}$.',
          'Tổng quãng đường $s = 30 + 0 + 30 = 60\\text{ m}$ (độ dịch chuyển cuối $= 0$).'
        ],
        finalAnswer: '$v_1 = 2\\text{ m/s}$, $v_2 = 0$, $v_3 = -2\\text{ m/s}$; $s = 60\\text{ m}$.'
      }
    ]
  },
  {
    id: 'phys-10-b8',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương II · Động học',
    sourceTag: SRC_10,
    lessonNumber: 8,
    title: 'Bài 8: Chuyển động biến đổi. Gia tốc',
    subtitle: 'Khái niệm chuyển động biến đổi, định nghĩa gia tốc vectơ và đại số a = Δv/Δt, điều kiện nhanh dần – chậm dần',
    description:
      'Hiểu bản chất gia tốc là tốc độ biến thiên của vận tốc theo thời gian, đơn vị m/s² và quy tắc dấu $\\vec{a} \\cdot \\vec{v} > 0$ (nhanh dần) hay $< 0$ (chậm dần).',
    theorySections: [
      {
        heading: '1. Chuyển động biến đổi & Gia tốc',
        content:
          '• Chuyển động biến đổi là chuyển động có vận tốc thay đổi theo thời gian (về độ lớn hoặc hướng).\n• **Gia tốc trung bình**: $\\vec{a} = \\frac{\\Delta \\vec{v}}{\\Delta t} = \\frac{\\vec{v} - \\vec{v}_0}{t - t_0}$ (đơn vị $\\text{m/s}^2$).'
      },
      {
        heading: '2. Phân biệt nhanh dần và chậm dần theo dấu a và v',
        content:
          '• **Nhanh dần**: $a \\cdot v > 0$ (vectơ $\\vec{a}$ cùng chiều với $\\vec{v}$, dù cả hai đều âm hay đều dương!).\n• **Chậm dần**: $a \\cdot v < 0$ (vectơ $\\vec{a}$ ngược chiều với $\\vec{v}$).\n• Cẩn thận: Gia tốc âm $a < 0$ KHÔNG đồng nghĩa với chậm dần nếu vận tốc $v < 0$!'
      }
    ],
    keyFormulas: [
      'a = \\frac{\\Delta v}{\\Delta t} = \\frac{v - v_0}{t - t_0}',
      'a \\cdot v > 0 \\implies \\text{Nhanh dần}, \\quad a \\cdot v < 0 \\implies \\text{Chậm dần}'
    ],
    ...SIM_PRESETS.kinematics,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một ô tô đang chạy tốc độ $36\\text{ km/h}$ thì tăng tốc đều đạt $72\\text{ km/h}$ sau $5\\text{ s}$. Gia tốc của ô tô là:',
        options: ['A. 7,2 m/s²', 'B. 2 m/s²', 'C. 4 m/s²', 'D. 1 m/s²'],
        correctIndex: 1,
        explanation: 'Đổi $v_0 = 10\\text{ m/s}$, $v = 20\\text{ m/s}$. Vậy $a = \\frac{20 - 10}{5} = 2\\text{ m/s}^2$.'
      },
      {
        source: SRC_10,
        question: 'Khi nào một vật chuyển động thẳng đang đi **nhanh dần**?',
        options: [
          'A. Khi gia tốc luôn dương $a > 0$',
          'B. Khi gia tốc $a$ và vận tốc $v$ cùng dấu ($a \\cdot v > 0$)',
          'C. Khi vận tốc bằng 0',
          'D. Khi gia tốc giảm dần về 0'
        ],
        correctIndex: 1,
        explanation: 'Nếu vật đi ngược chiều dương ($v < 0$) và $a < 0$ cùng chiều chuyển động thì độ lớn tốc độ vẫn tăng (nhanh dần).'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một đoàn tàu đang chạy với vận tốc $54\\text{ km/h}$ thì hãm phanh, sau $10\\text{ s}$ tốc độ còn $18\\text{ km/h}$. Tính gia tốc của tàu trong thời gian hãm phanh.',
        hints: ['Đổi km/h sang m/s bằng cách chia cho 3,6.'],
        solutionSteps: [
          '$v_0 = 54 / 3{,}6 = 15\\text{ m/s}$; $v = 18 / 3{,}6 = 5\\text{ m/s}$.',
          'Gia tốc: $a = \\frac{5 - 15}{10} = -1\\text{ m/s}^2$.'
        ],
        finalAnswer: '$a = -1\\text{ m/s}^2$ (vectơ gia tốc ngược chiều chuyển động).'
      }
    ]
  },
  {
    id: 'phys-10-accel',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương II · Động học',
    sourceTag: SRC_10,
    lessonNumber: 9,
    title: 'Bài 9: Chuyển động thẳng biến đổi đều',
    subtitle: 'Đồ thị (v – t), 3 phương trình vàng v = v₀ + at, d = v₀t + ½at², v² − v₀² = 2ad và phương pháp diện tích đồ thị',
    description:
      'Làm chủ toàn bộ hệ thống công thức chuyển động thẳng nhanh dần đều và chậm dần đều, kỹ thuật tính quãng đường bằng diện tích hình thang dưới đồ thị $v - t$.',
    theorySections: [
      {
        heading: '1. Hệ thống 3 phương trình chuyển động thẳng biến đổi đều',
        content:
          '• Vận tốc tức thời: $v = v_0 + a t$.\n• Độ dịch chuyển: $d = v_0 t + \\frac{1}{2}a t^2$ (trước khi đổi chiều, quãng đường $s = |d|$).\n• Hệ thức độc lập thời gian: $v^2 - v_0^2 = 2 a d$.'
      },
      {
        heading: '2. Ý nghĩa đồ thị vận tốc – thời gian (v – t)',
        content:
          '• Đường biểu diễn $v(t)$ là đường thẳng có hệ số góc đúng bằng gia tốc $a$.\n• **Diện tích hình phẳng** giới hạn bởi đồ thị $v(t)$ và trục thời gian $Ot$ trong khoảng $[t_1; t_2]$ có giá trị bằng độ dịch chuyển $d$ đi được trong khoảng thời gian đó.'
      }
    ],
    keyFormulas: [
      'v = v_0 + a t',
      'd = v_0 t + \\frac{1}{2}a t^2',
      'v^2 - v_0^2 = 2 a d'
    ],
    ...SIM_PRESETS.kinematics,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một xe máy đang chạy tốc độ $10\\text{ m/s}$ thì hãm phanh chuyển động thẳng chậm dần đều với gia tốc $a = -2\\text{ m/s}^2$. Quãng đường xe đi được cho tới lúc dừng hẳn là:',
        options: ['A. 50 m', 'B. 25 m', 'C. 10 m', 'D. 20 m'],
        correctIndex: 1,
        explanation: 'Áp dụng $v^2 - v_0^2 = 2as \\implies 0 - 10^2 = 2(-2)s \\implies s = 25\\text{ m}$.'
      },
      {
        source: SRC_10,
        question: 'Một vật bắt đầu chuyển động nhanh dần đều từ trạng thái nghỉ ($v_0 = 0$) với $a = 2\\text{ m/s}^2$. Quãng đường vật đi trong $4\\text{ s}$ đầu là:',
        options: ['A. 8 m', 'B. 16 m', 'C. 32 m', 'D. 4 m'],
        correctIndex: 1,
        explanation: '$d = \\frac{1}{2}at^2 = 0{,}5 \\cdot 2 \\cdot 4^2 = 16\\text{ m}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một ô tô xuất phát từ trạng thái đứng yên tăng tốc thẳng đều đạt tốc độ $18\\text{ m/s}$ sau $6\\text{ s}$. Tính gia tốc và quãng đường xe đi được trong giây thứ 6.',
        hints: ['Tính $a = (v - v_0)/t$, rồi tính $\\Delta s = s(6) - s(5)$.'],
        solutionSteps: [
          'Gia tốc: $a = \\frac{18 - 0}{6} = 3\\text{ m/s}^2$.',
          'Quãng đường sau 6 s: $s(6) = \\frac{1}{2} \\cdot 3 \\cdot 6^2 = 54\\text{ m}$.',
          'Quãng đường sau 5 s: $s(5) = \\frac{1}{2} \\cdot 3 \\cdot 5^2 = 37{,}5\\text{ m}$.',
          'Quãng đường trong giây thứ 6: $\\Delta s = 54 - 37{,}5 = 16{,}5\\text{ m}$.'
        ],
        finalAnswer: '$a = 3\\text{ m/s}^2$, quãng đường giây thứ 6 là $16{,}5\\text{ m}$.'
      }
    ]
  },
  {
    id: 'phys-10-b10',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương II · Động học',
    sourceTag: SRC_10,
    lessonNumber: 10,
    title: 'Bài 10: Sự rơi tự do',
    subtitle: 'Đặc điểm sự rơi trong chân không, gia tốc rơi tự do g và 3 công thức rơi tự do từ trạng thái nghỉ',
    description:
      'Khám phá thí nghiệm ống Newton chứng minh mọi vật rơi như nhau trong chân không khi chỉ chịu tác dụng của trọng lực và các công thức rơi tự do $h = \\frac{1}{2}gt^2$.',
    theorySections: [
      {
        heading: '1. Định nghĩa và đặc điểm sự rơi tự do',
        content:
          '• **Sự rơi tự do** là sự rơi chỉ dưới tác dụng của trọng lực (trong chân không hoặc khi lực cản không khí rất nhỏ).\n• Phương thẳng đứng, chiều từ trên xuống dưới, là chuyển động **thẳng nhanh dần đều** với vận tốc đầu $v_0 = 0$ và gia tốc $g \\approx 9{,}8\\text{ m/s}^2$ (thường lấy $9{,}8$ hoặc $10\\text{ m/s}^2$).'
      },
      {
        heading: '2. Công thức rơi tự do (thả không vận tốc đầu)',
        content:
          '• Vận tốc sau thời gian $t$: $v = g t$.\n• Quãng đường rơi (độ cao đã rơi): $s = \\frac{1}{2} g t^2 \\implies t = \\sqrt{\\frac{2h}{g}}$.\n• Vận tốc theo quãng đường: $v^2 = 2 g s \\implies v = \\sqrt{2gh}$.'
      }
    ],
    keyFormulas: [
      'v = g t, \\qquad s = \\frac{1}{2} g t^2, \\qquad v^2 = 2 g s',
      't_{\\text{chạm đất}} = \\sqrt{\\frac{2h}{g}}, \\qquad v_{\\text{chạm đất}} = \\sqrt{2gh}'
    ],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Thả một hòn đá rơi tự do từ độ cao $45\\text{ m}$ xuống mặt đất (lấy $g = 10\\text{ m/s}^2$). Thời gian rơi và tốc độ ngay khi chạm đất là:',
        options: ['A. 3 s và 30 m/s', 'B. 4,5 s và 45 m/s', 'C. 3 s và 15 m/s', 'D. 9 s và 30 m/s'],
        correctIndex: 0,
        explanation: '$t = \\sqrt{\\frac{2\\cdot 45}{10}} = 3\\text{ s}$; vận tốc chạm đất $v = g t = 10 \\cdot 3 = 30\\text{ m/s}$.'
      },
      {
        source: SRC_10,
        question: 'Trong ống Newton đã hút hết không khí, thả đồng thời một viên bi sắt và một chiếc lông chim từ cùng độ cao thì:',
        options: [
          'A. Viên bi sắt chạm đáy trước',
          'B. Chiếc lông chim chạm đáy trước',
          'C. Cả hai chạm đáy cùng một lúc',
          'D. Lông chim đứng lơ lửng'
        ],
        correctIndex: 2,
        explanation: 'Khi không có lực cản không khí, mọi vật rơi tự do với cùng gia tốc $g$ độc lập với khối lượng.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một vật rơi tự do không vận tốc đầu từ độ cao $h$ ($g = 10\\text{ m/s}^2$). Trong giây cuối cùng trước khi chạm đất, vật rơi được $25\\text{ m}$. Tính thời gian rơi và độ cao ban đầu $h$.',
        hints: ['Đặt tổng thời gian rơi là $t$, viết $h(t) - h(t-1) = 25$.'],
        solutionSteps: [
          'Ta có $\\frac{1}{2}gt^2 - \\frac{1}{2}g(t-1)^2 = 25 \\iff 5(2t - 1) = 25 \\implies 2t - 1 = 5 \\implies t = 3\\text{ s}$.',
          'Độ cao thả vật: $h = \\frac{1}{2} g t^2 = 5 \\cdot 3^2 = 45\\text{ m}$.'
        ],
        finalAnswer: 'Thời gian rơi $t = 3\\text{ s}$, độ cao $h = 45\\text{ m}$.'
      }
    ]
  },
  {
    id: 'phys-10-b11',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương II · Động học',
    sourceTag: SRC_10,
    lessonNumber: 11,
    title: 'Bài 11: Thực hành: Đo gia tốc rơi tự do',
    subtitle: 'Thiết kế thí nghiệm thả trụ thép qua cổng quang điện, vẽ đồ thị s theo t² và xác định g bằng hệ số góc',
    description:
      'Thực hành đo quãng đường rơi $s$ ứng với thời gian $t$ qua đồng hồ hiện số, xử lý tuyến tính hóa đồ thị $s - t^2$ để suy ra $g = \\frac{2s}{t^2}$ và tính sai số phép đo.',
    theorySections: [
      {
        heading: '1. Nguyên tắc thí nghiệm đo g',
        content:
          '• Nam châm điện giữ trụ thép ngay phía trên cổng quang điện trên giá đứng có thước chia milimet.\n• Khi ngắt công tắc nam châm điện, đồng hồ đo thời gian bắt đầu chạy và tự dừng khi trụ thép cắt tia hồng ngoại ở cổng quang ở độ cao rơi $s$.'
      },
      {
        heading: '2. Xử lý số liệu và đồ thị s theo t²',
        content:
          '• Từ $s = \\frac{1}{2}gt^2$, suy ra công thức xác định gia tốc rơi tự do: $g = \\frac{2s}{t^2}$.\n• Đồ thị biểu diễn $s$ theo $t^2$ là đường thẳng đi qua gốc tọa độ có hệ số góc $k = \\frac{g}{2} \\implies g = 2k$.'
      }
    ],
    keyFormulas: [
      'g = \\frac{2s}{t^2}',
      '\\delta g = \\frac{\\Delta g}{\\bar{g}} = \\frac{\\Delta s}{\\bar{s}} + 2\\frac{\\Delta t}{\\bar{t}}'
    ],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Trong bài thực hành đo gia tốc rơi tự do, sai số tỉ đối của $g = \\frac{2s}{t^2}$ được tính theo công thức nào?',
        options: [
          'A. $\\delta g = \\delta s + \\delta t$',
          'B. $\\delta g = \\delta s + 2\\delta t$',
          'C. $\\delta g = 2\\delta s + \\delta t$',
          'D. $\\delta g = \\delta s \\cdot \\delta t$'
        ],
        correctIndex: 1,
        explanation: 'Vì $t$ có số mũ 2 trong $g = 2s \\cdot t^{-2}$ nên sai số tỉ đối của $t$ được nhân đôi: $\\delta g = \\delta s + 2\\delta t$.'
      },
      {
        source: SRC_10,
        question: 'Nếu vẽ đồ thị $s$ theo $t^2$ thu được đường thẳng có hệ số góc $k = 4{,}90\\text{ m/s}^2$, giá trị gia tốc rơi tự do $g$ là:',
        options: ['A. 4,90 m/s²', 'B. 2,45 m/s²', 'C. 9,80 m/s²', 'D. 19,6 m/s²'],
        correctIndex: 2,
        explanation: 'Do $s = \\frac{g}{2} t^2 = k t^2$ nên $g = 2k = 2 \\cdot 4{,}90 = 9{,}80\\text{ m/s}^2$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Thả rơi tự do trụ thép ở độ cao $s = 0{,}800\\text{ m}$ đo được thời gian trung bình $\\bar{t} = 0{,}404\\text{ s}$. Tính gia tốc $g$ thực nghiệm và độ sai lệch phần trăm so với giá trị chuẩn $9{,}81\\text{ m/s}^2$.',
        hints: ['Tính $g = 2s/t^2$ rồi lấy $|g - 9{,}81|/9{,}81 \\cdot 100\\%$.'],
        solutionSteps: [
          '$g = \\frac{2 \\cdot 0{,}800}{(0{,}404)^2} = \\frac{1{,}6}{0{,}163216} \\approx 9{,}803\\text{ m/s}^2$.',
          'Sai lệch tương đối: $\\frac{|9{,}803 - 9{,}81|}{9{,}81} \\cdot 100\\% \\approx 0{,}07\\%$.'
        ],
        finalAnswer: '$g \\approx 9{,}80\\text{ m/s}^2$ (lệch $0{,}07\\%$ so với chuẩn).'
      }
    ]
  },
  {
    id: 'phys-10-proj',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương II · Động học',
    sourceTag: SRC_10,
    lessonNumber: 12,
    title: 'Bài 12: Chuyển động ném',
    subtitle: 'Phân tích độc lập chuyển động ném ngang và ném xiên trong trọng trường, quỹ đạo parabol, tầm xa L và độ cao cực đại H',
    description:
      'Tách chuyển động cong 2D thành chuyển động thẳng đều theo phương ngang $Ox$ và chuyển động thẳng biến đổi đều theo phương thẳng đứng $Oy$ để tính thời gian bay, $H_{\\max}$ và tầm xa $L$.',
    theorySections: [
      {
        heading: '1. Chuyển động ném ngang (từ độ cao h₀ với tốc độ v₀)',
        content:
          '• Theo phương ngang $Ox$: chuyển động thẳng đều $x = v_0 t$, $v_x = v_0$.\n• Theo phương thẳng đứng $Oy$ (hướng xuống): rơi tự do $y = \\frac{1}{2}gt^2$, $v_y = gt$.\n• Thời gian chạm đất: $t = \\sqrt{\\frac{2h_0}{g}}$ (KHÔNG phụ thuộc $v_0$!). Tầm xa: $L = v_0\\sqrt{\\frac{2h_0}{g}}$.'
      },
      {
        heading: '2. Chuyển động ném xiên (góc α, tốc độ v₀ từ mặt đất)',
        content:
          '• Phương trình chuyển động: $x = (v_0\\cos\\alpha)t$; $y = (v_0\\sin\\alpha)t - \\frac{1}{2}gt^2$.\n• Độ cao cực đại: $H_{\\max} = \\frac{v_0^2 \\sin^2\\alpha}{2g}$.\n• Tầm bay xa: $L = \\frac{v_0^2 \\sin(2\\alpha)}{g}$ (đạt cực đại $L_{\\max} = \\frac{v_0^2}{g}$ tại $\\alpha = 45^\\circ$ khi bỏ qua sức cản).'
      }
    ],
    keyFormulas: [
      'L_{\\text{ngang}} = v_0 \\sqrt{\\frac{2h_0}{g}}, \\qquad y = \\frac{g}{2v_0^2}x^2',
      'H_{\\max} = \\frac{v_0^2 \\sin^2\\alpha}{2g}, \\qquad L_{\\text{xiên}} = \\frac{v_0^2 \\sin(2\\alpha)}{g}'
    ],
    ...SIM_PRESETS.projectile,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Ném ngang một vật từ độ cao $h = 20\\text{ m}$ ($g = 10\\text{ m/s}^2$) với vận tốc đầu $v_0 = 15\\text{ m/s}$. Tầm xa của vật bằng:',
        options: ['A. 15 m', 'B. 30 m', 'C. 45 m', 'D. 20 m'],
        correctIndex: 1,
        explanation: 'Thời gian rơi $t = \\sqrt{\\frac{2\\cdot 20}{10}} = 2\\text{ s} \\implies L = v_0 t = 15 \\cdot 2 = 30\\text{ m}$.'
      },
      {
        source: SRC_10,
        question: 'Tại điểm cao nhất của quỹ đạo ném xiên với góc $\\alpha = 60^\\circ$ và $v_0 = 20\\text{ m/s}$, tốc độ của vật là:',
        options: ['A. 0 m/s', 'B. 10 m/s', 'C. 17,3 m/s', 'D. 20 m/s'],
        correctIndex: 1,
        explanation: 'Tại đỉnh cao nhất $v_y = 0$, tốc độ bằng đúng $v_x = v_0\\cos 60^\\circ = 20 \\cdot 0{,}5 = 10\\text{ m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một quả bóng được đá từ mặt đất với tốc độ $v_0 = 20\\text{ m/s}$ dưới góc nghiêng $\\alpha = 30^\\circ$ ($g = 10\\text{ m/s}^2$). Tính độ cao cực đại $H_{\\max}$ và tầm xa $L$ của quả bóng.',
        hints: ['Dùng $H_{\\max} = \\frac{v_0^2\\sin^2\\alpha}{2g}$ và $L = \\frac{v_0^2\\sin(2\\alpha)}{g}$.'],
        solutionSteps: [
          'Độ cao cực đại: $H_{\\max} = \\frac{20^2 \\cdot (0{,}5)^2}{2 \\cdot 10} = \\frac{100}{20} = 5\\text{ m}$.',
          'Tầm bay xa: $L = \\frac{20^2 \\cdot \\sin 60^\\circ}{10} = 40 \\cdot \\frac{\\sqrt{3}}{2} = 20\\sqrt{3} \\approx 34{,}64\\text{ m}$.'
        ],
        finalAnswer: '$H_{\\max} = 5\\text{ m}$, $L = 20\\sqrt{3} \\approx 34{,}64\\text{ m}$.'
      }
    ]
  },

  // ================= CHƯƠNG III. ĐỘNG LỰC HỌC (BÀI 13 - 22) =================
  {
    id: 'phys-10-b13',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương III · Động lực học',
    sourceTag: SRC_10,
    lessonNumber: 13,
    title: 'Bài 13: Tổng hợp và phân tích lực. Cân bằng lực',
    subtitle: 'Quy tắc hình bình hành hợp hai lực đồng quy, phân tích lực theo hai phương vuông góc và điều kiện cân bằng chất điểm',
    description:
      'Xác định hợp lực của hai lực đồng quy $\\vec{F} = \\vec{F}_1 + \\vec{F}_2$, trường hợp lực song song cùng chiều và điều kiện cân bằng tổng hợp lực bằng vectơ-không.',
    theorySections: [
      {
        heading: '1. Tổng hợp lực đồng quy (Quy tắc hình bình hành)',
        content:
          '• Hợp lực $\\vec{F} = \\vec{F}_1 + \\vec{F}_2$ có độ lớn: $F = \\sqrt{F_1^2 + F_2^2 + 2 F_1 F_2 \\cos\\alpha}$.\n• Bất đẳng thức độ lớn: $|F_1 - F_2| \\le F \\le F_1 + F_2$.'
      },
      {
        heading: '2. Phân tích lực & Điều kiện cân bằng chất điểm',
        content:
          '• Phân tích lực là phép làm ngược lại: thay một lực bằng hai lực thành phần vuông góc $F_x = F\\cos\\alpha$, $F_y = F\\sin\\alpha$.\n• Điều kiện cân bằng của chất điểm: $\\vec{F}_{\\text{hợp lực}} = \\sum \\vec{F}_i = \\vec{0}$.'
      }
    ],
    keyFormulas: [
      'F = \\sqrt{F_1^2 + F_2^2 + 2 F_1 F_2 \\cos\\alpha}',
      '|F_1 - F_2| \\le F \\le F_1 + F_2',
      '\\sum \\vec{F}_i = \\vec{0}'
    ],
    ...SIM_PRESETS.vectors,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Hai lực đồng quy $F_1 = 6\\text{ N}$ và $F_2 = 8\\text{ N}$ hợp với nhau góc $90^\\circ$. Độ lớn hợp lực là:',
        options: ['A. 14 N', 'B. 2 N', 'C. 10 N', 'D. 48 N'],
        correctIndex: 2,
        explanation: 'Do góc hợp $90^\\circ$ ($\cos 90^\\circ = 0$), $F = \\sqrt{6^2 + 8^2} = 10\\text{ N}$.'
      },
      {
        source: SRC_10,
        question: 'Cho hai lực có độ lớn $9\\text{ N}$ và $12\\text{ N}$. Hợp lực của chúng KHÔNG THỂ nhận giá trị nào sau đây?',
        options: ['A. 2 N', 'B. 3 N', 'C. 15 N', 'D. 21 N'],
        correctIndex: 0,
        explanation: 'Hợp lực phải thỏa $|12 - 9| \\le F \\le 12 + 9 \\iff 3\\text{ N} \\le F \\le 21\\text{ N}$, do đó không thể bằng $2\\text{ N}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một vật nặng trọng lượng $P = 20\\text{ N}$ được treo bằng hai dây nhẹ đối xứng hợp với trần ngang một góc $30^\\circ$ ở mỗi bên. Tính lực căng của mỗi sợi dây.',
        hints: ['Chiếu điều kiện cân bằng theo phương thẳng đứng: $2T\\sin 30^\\circ = P$.'],
        solutionSteps: [
          'Do đối xứng, hai lực căng dây bằng nhau: $T_1 = T_2 = T$.',
          'Chiếu $\\vec{T}_1 + \\vec{T}_2 + \\vec{P} = \\vec{0}$ lên phương thẳng đứng: $2 T \\sin 30^\\circ = P$.',
          'Suy ra $T = \\frac{20}{2 \\cdot 0{,}5} = 20\\text{ N}$.'
        ],
        finalAnswer: '$T_1 = T_2 = 20\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-10-b14',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương III · Động lực học',
    sourceTag: SRC_10,
    lessonNumber: 14,
    title: 'Bài 14: Định luật 1 Newton',
    subtitle: 'Khái niệm lực và trạng thái chuyển động, phát biểu Định luật 1 Newton và khái niệm quán tính – khối lượng',
    description:
      'Giải thích tại sao lực không phải nguyên nhân duy trì chuyển động mà là nguyên nhân làm biến đổi vận tốc; nắm bản chất quán tính của vật thể.',
    theorySections: [
      {
        heading: '1. Phát biểu Định luật 1 Newton (Định luật Quán tính)',
        content:
          '• Nếu một vật không chịu tác dụng của lực nào hoặc chịu tác dụng của các lực có hợp lực bằng không ($\\sum \\vec{F} = \\vec{0}$), thì vật đang đứng yên sẽ tiếp tục đứng yên, đang chuyển động sẽ tiếp tục chuyển động **thẳng đều**.'
      },
      {
        heading: '2. Quán tính và ứng dụng thực tế',
        content:
          '• **Quán tính** là tính chất bảo toàn trạng thái đứng yên hoặc chuyển động thẳng đều của mọi vật.\n• Khối lượng $m$ là đại lượng đặc trưng cho mức quán tính: vật có khối lượng càng lớn thì mức quán tính càng lớn (khó thay đổi vận tốc).'
      }
    ],
    keyFormulas: [
      '\\sum \\vec{F} = \\vec{0} \\iff \\vec{a} = \\vec{0} \\iff \\vec{v} = \\text{const}'
    ],
    ...SIM_PRESETS.kinematics,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Khi xe buýt đang chạy thẳng đều bỗng phanh gấp, hành khách trên xe bị ngả người về phía trước là do:',
        options: [
          'A. Lực đẩy từ ghế sau',
          'B. Quán tính giữ vận tốc cũ của phần thân trên',
          'C. Trọng lực đột ngột tăng lên',
          'D. Lực ma sát của không khí đẩy tới'
        ],
        correctIndex: 1,
        explanation: 'Chân dừng theo sàn xe nhưng thân trên vẫn giữ vận tốc hướng về phía trước theo quán tính.'
      },
      {
        source: SRC_10,
        question: 'Nếu hợp lực tác dụng lên vật đang chuyển động đột ngột triệt tiêu về $0$, vật sẽ:',
        options: [
          'A. Dừng lại ngay lập tức',
          'B. Tiếp tục chuyển động thẳng đều với vận tốc đang có',
          'C. Chuyển động chậm dần rồi dừng',
          'D. Đổi hướng vuông góc'
        ],
        correctIndex: 1,
        explanation: 'Theo Định luật 1 Newton, khi $\\sum \\vec{F} = \\vec{0}$, vật giữ nguyên vận tốc thẳng đều.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Giải thích vì sao khi đóng đầu búa lỏng vào cán, người ta thường gõ mạnh đuôi cán búa xuống nền cứng thay vì gõ trực tiếp đầu búa.',
        hints: ['Phân tích sự thay đổi vận tốc của cán búa và đầu búa thép (khối lượng lớn hơn).'],
        solutionSteps: [
          'Cả cán búa và đầu búa đang cùng lao xuống dưới.',
          'Khi đuôi cán chạm nền cứng, cán dừng lại đột ngột.',
          'Đầu búa có khối lượng lớn nên quán tính lớn, tiếp tục trượt xuống theo hướng cũ và ăn chặt vào cán búa.'
        ],
        finalAnswer: 'Đầu búa tiếp tục chuyển động xuống theo quán tính khi cán dừng đột ngột.'
      }
    ]
  },
  {
    id: 'phys-10-newton-energy',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương III · Động lực học',
    sourceTag: SRC_10,
    lessonNumber: 15,
    title: 'Bài 15: Định luật 2 Newton',
    subtitle: 'Mối quan hệ giữa gia tốc, hợp lực và khối lượng (a = F/m), khái niệm khối lượng quán tính và đơn vị Niutơn',
    description:
      'Làm chủ phương trình cơ bản của Động lực học $\\vec{a} = \\frac{\\vec{F}}{m}$ hay $\\vec{F} = m\\vec{a}$: gia tốc cùng hướng hợp lực, tỉ lệ thuận độ lớn hợp lực và tỉ lệ nghịch khối lượng.',
    theorySections: [
      {
        heading: '1. Phát biểu Định luật 2 Newton',
        content:
          '• Gia tốc của một vật cùng hướng với lực tác dụng lên vật. Độ lớn của gia tốc tỉ lệ thuận với độ lớn của lực và tỉ lệ nghịch với khối lượng của vật:\n$$\\vec{a} = \\frac{\\vec{F}}{m} \\quad \\Longleftrightarrow \\quad \\vec{F} = m\\vec{a}$$'
      },
      {
        heading: '2. Đơn vị lực và ý nghĩa của khối lượng',
        content:
          '• $1\\text{ Niutơn}$ ($1\\text{ N}$) là độ lớn lực gây ra gia tốc $1\\text{ m/s}^2$ cho một vật khối lượng $1\\text{ kg}$ ($1\\text{ N} = 1\\text{ kg}\\cdot\\text{m/s}^2$).\n• Khối lượng càng lớn thì gia tốc thu được từ cùng một lực càng nhỏ.'
      }
    ],
    keyFormulas: [
      '\\vec{F}_{\\text{hợp lực}} = m\\vec{a}',
      'a = \\frac{F}{m}, \\qquad 1\\text{ N} = 1\\text{ kg}\\cdot\\text{m/s}^2'
    ],
    ...SIM_PRESETS.inclined,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Lực có độ lớn $F$ truyền cho vật khối lượng $m_1$ gia tốc $3\\text{ m/s}^2$, truyền cho vật $m_2$ gia tốc $6\\text{ m/s}^2$. Lực $F$ truyền cho vật có khối lượng $m_1 + m_2$ gia tốc là:',
        options: ['A. 9 m/s²', 'B. 4,5 m/s²', 'C. 2 m/s²', 'D. 1,5 m/s²'],
        correctIndex: 2,
        explanation: '$m_1 = F/3$, $m_2 = F/6 \\implies m_1 + m_2 = F(1/3 + 1/6) = F/2 \\implies a = F/(m_1+m_2) = 2\\text{ m/s}^2$.'
      },
      {
        source: SRC_10,
        question: 'Tác dụng hợp lực $12\\text{ N}$ vào một xe đẩy khối lượng $4\\text{ kg}$ đang đứng yên (bỏ qua ma sát). Sau $5\\text{ s}$, tốc độ của xe là:',
        options: ['A. 15 m/s', 'B. 3 m/s', 'C. 12 m/s', 'D. 20 m/s'],
        correctIndex: 0,
        explanation: '$a = F/m = 12/4 = 3\\text{ m/s}^2 \\implies v = a t = 3 \\cdot 5 = 15\\text{ m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một ô tô khối lượng $1{,}2\\text{ tấn}$ đang chạy với tốc độ $72\\text{ km/h}$ thì hãm phanh và dừng lại sau khi đi thêm $50\\text{ m}$. Tính độ lớn hợp lực hãm phanh.',
        hints: ['Đổi $1{,}2\\text{ tấn} = 1200\\text{ kg}$, $72\\text{ km/h} = 20\\text{ m/s}$, tìm $a$ từ $v^2 - v_0^2 = 2as$.'],
        solutionSteps: [
          'Gia tốc: $a = \\frac{0 - 20^2}{2 \\cdot 50} = -4\\text{ m/s}^2$.',
          'Độ lớn lực hãm: $F = m |a| = 1200 \\cdot 4 = 4800\\text{ N}$.'
        ],
        finalAnswer: '$F = 4800\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-10-b16',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương III · Động lực học',
    sourceTag: SRC_10,
    lessonNumber: 16,
    title: 'Bài 16: Định luật 3 Newton',
    subtitle: 'Tương tác hai chiều giữa hai vật, cặp lực – phản lực (trực đối nhưng không cân bằng vì đặt vào hai vật khác nhau)',
    description:
      'Hiểu đúng cặp lực và phản lực $\\vec{F}_{AB} = -\\vec{F}_{BA}$: luôn xuất hiện và mất đi đồng thời, cùng độ lớn, ngược hướng, đặt lên hai vật khác nhau nên KHÔNG tự triệt tiêu.',
    theorySections: [
      {
        heading: '1. Nội dung Định luật 3 Newton',
        content:
          '• Trong mọi trường hợp, khi vật A tác dụng lên vật B một lực $\\vec{F}_{AB}$, thì đồng thời vật B cũng tác dụng lại vật A một lực $\\vec{F}_{BA}$ có cùng giá, cùng độ lớn nhưng ngược chiều:\n$$\\vec{F}_{AB} = -\\vec{F}_{BA}$$'
      },
      {
        heading: '2. Phân biệt Lực – Phản lực với Hai lực cân bằng',
        content:
          '• **Hai lực cân bằng**: cùng đặt vào **1 vật** nên tổng hợp triệt tiêu nhau.\n• **Lực và phản lực**: đặt vào **2 vật khác nhau** (A và B) nên KHÔNG triệt tiêu lẫn nhau; chúng cùng bản chất và luôn đồng thời xuất hiện – biến mất.'
      }
    ],
    keyFormulas: ['\\vec{F}_{AB} = -\\vec{F}_{BA}', 'F_{AB} = F_{BA}'],
    ...SIM_PRESETS.vectors,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Khi một ô tô con va chạm trực diện với xe tải nặng, nhận xét nào sau đây ĐÚNG về lực va chạm giữa hai xe?',
        options: [
          'A. Xe tải tác dụng lên xe con lực lớn hơn',
          'B. Xe con tác dụng lên xe tải lực lớn hơn',
          'C. Độ lớn lực hai xe tác dụng lên nhau bằng nhau ở mọi thời điểm',
          'D. Chỉ có xe tải mới gây lực lên xe con'
        ],
        correctIndex: 2,
        explanation: 'Theo Định luật 3 Newton, $F_{\\text{tải}\\to\\text{con}} = F_{\\text{con}\\to\\text{tải}}$; xe con biến dạng/gia tốc lớn hơn chỉ vì khối lượng nhỏ hơn.'
      },
      {
        source: SRC_10,
        question: 'Vì sao cặp lực và phản lực trong Định luật 3 Newton không cân bằng nhau?',
        options: [
          'A. Vì độ lớn chúng khác nhau',
          'B. Vì chúng đặt vào hai vật khác nhau',
          'C. Vì chúng luôn vuông góc với nhau',
          'D. Vì chúng xuất hiện ở thời điểm khác nhau'
        ],
        correctIndex: 1,
        explanation: 'Hai lực chỉ cân bằng khi tác dụng vào CÙNG một vật; lực và phản lực đặt trên hai vật khác nhau.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một người đi bộ đẩy bàn chân về phía sau lên mặt đất một lực có độ lớn $250\\text{ N}$. Xác định lực giúp người đó tiến về phía trước và giải thích theo Định luật 3 Newton.',
        hints: ['Xét cặp lực tương tác giữa bàn chân và mặt đường (lực ma sát nghỉ).'],
        solutionSteps: [
          'Khi chân đẩy mặt đất về phía sau lực $250\\text{ N}$, mặt đất tác dụng ngược lại lên chân người một phản lực hướng về phía trước có cùng độ lớn $250\\text{ N}$.',
          'Chính phản lực này (lực ma sát nghỉ hướng tới trước) giúp người tăng tốc tiến lên.'
        ],
        finalAnswer: 'Mặt đất tác dụng phản lực $250\\text{ N}$ hướng về phía trước lên chân người.'
      }
    ]
  },
  {
    id: 'phys-10-b17',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương III · Động lực học',
    sourceTag: SRC_10,
    lessonNumber: 17,
    title: 'Bài 17: Trọng lực và lực căng',
    subtitle: 'Trọng lực P = mg, phân biệt khối lượng và trọng lượng, phản lực pháp tuyến và lực căng dây không dãn',
    description:
      'Phân tích trọng lực hướng vào tâm Trái Đất (điểm đặt trọng tâm), phản lực vuông góc mặt tiếp xúc và lực căng $\\vec{T}$ dọc sợi dây giữ cân bằng hoặc truyền chuyển động.',
    theorySections: [
      {
        heading: '1. Trọng lực và Trọng lượng',
        content:
          '• **Trọng lực** $\\vec{P} = m\\vec{g}$ là lực hấp dẫn Trái Đất tác dụng lên vật, phương thẳng đứng, chiều hướng xuống, điểm đặt tại trọng tâm vật.\n• **Trọng lượng** là độ lớn $P = mg$; tại độ cao hoặc vĩ độ khác nhau thì $g$ thay đổi nên $P$ đổi, còn khối lượng $m$ không đổi.'
      },
      {
        heading: '2. Lực căng dây và Phản lực',
        content:
          '• **Lực căng dây ($\\vec{T}$)**: Xuất hiện khi dây bị kéo căng, điểm đặt tại điểm tiếp xúc vật, phương dọc sợi dây, chiều hướng kéo vật lại (không bao giờ đẩy).\n• Với dây nhẹ không ma sát vắt qua ròng rọc nhẹ, lực căng mọi điểm trên dây đều bằng nhau.'
      }
    ],
    keyFormulas: ['\\vec{P} = m\\vec{g}, \\qquad P = mg', '\\vec{P} + \\vec{T} = m\\vec{a}'],
    ...SIM_PRESETS.atwood,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một phi hành gia khối lượng $70\\text{ kg}$ lên Mặt Trăng nơi $g_{MT} = 1{,}6\\text{ m/s}^2$. Khối lượng và trọng lượng của phi hành gia trên Mặt Trăng là:',
        options: ['A. 70 kg và 112 N', 'B. 11,4 kg và 112 N', 'C. 70 kg và 700 N', 'D. 112 kg và 70 N'],
        correctIndex: 0,
        explanation: 'Khối lượng $m = 70\\text{ kg}$ không đổi; trọng lượng $P = m g_{MT} = 70 \\cdot 1{,}6 = 112\\text{ N}$.'
      },
      {
        source: SRC_10,
        question: 'Đặc điểm nào sau đây ĐÚNG với lực căng dây $\\vec{T}$?',
        options: [
          'A. Luôn hướng vuông góc với sợi dây',
          'B. Có thể kéo hoặc đẩy vật ra xa',
          'C. Có phương trùng với sợi dây và luôn kéo vật về phía giữ dây',
          'D. Luôn bằng 0 khi vật đứng yên'
        ],
        correctIndex: 2,
        explanation: 'Dây mềm chỉ chịu kéo chứ không chịu nén, nên lực căng luôn dọc theo dây và hướng kéo vào phía dây.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Treo một vật $m = 4\\text{ kg}$ vào sợi dây nhẹ trong thang máy đang đi lên nhanh dần đều với gia tốc $a = 2\\text{ m/s}^2$ ($g = 10\\text{ m/s}^2$). Tính lực căng của sợi dây.',
        hints: ['Chiếu $\\vec{T} + \\vec{P} = m\\vec{a}$ theo chiều thẳng đứng hướng lên: $T - P = ma$.'],
        solutionSteps: [
          'Chọn chiều dương hướng lên (cùng chiều gia tốc $a$).',
          'Theo Định luật 2 Newton: $T - mg = ma \\implies T = m(g + a) = 4(10 + 2) = 48\\text{ N}$.'
        ],
        finalAnswer: '$T = 48\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-10-b18',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương III · Động lực học',
    sourceTag: SRC_10,
    lessonNumber: 18,
    title: 'Bài 18: Lực ma sát',
    subtitle: 'Ma sát nghỉ, ma sát trượt F_mst = μN, ma sát lăn và vai trò của lực ma sát trong đời sống – kỹ thuật',
    description:
      'Phân tích điều kiện xuất hiện ma sát nghỉ ($F_{\\text{msn}} \\le \\mu_n N$), công thức ma sát trượt ($F_{\\text{mst}} = \\mu_t N$) độc lập diện tích tiếp xúc và cách tăng/giảm ma sát.',
    theorySections: [
      {
        heading: '1. Lực ma sát nghỉ và Ma sát trượt',
        content:
          '• **Lực ma sát nghỉ**: Giữ vật đứng yên khi có ngoại lực kéo; độ lớn bằng lực kéo song song mặt tiếp xúc cho đến giá trị cực đại $F_{\\text{msn, max}} = \\mu_n N$.\n• **Lực ma sát trượt**: Xuất hiện khi vật trượt trên bề mặt, ngược hướng vận tốc tương đối:\n$$F_{\\text{mst}} = \\mu_t N$$\n(Không phụ thuộc diện tích tiếp xúc và tốc độ trượt ở tốc độ thông thường).'
      },
      {
        heading: '2. Ma sát lăn và Ứng dụng',
        content:
          '• Ma sát lăn rất nhỏ so với ma sát trượt (dùng ổ bi để giảm hao mòn).\n• Ma sát nghỉ là lực có ích giúp ta bước đi, lốp xe bám đường, băng tải truyền hàng.'
      }
    ],
    keyFormulas: ['F_{\\text{mst}} = \\mu_t N', 'N_{\\text{mặt phẳng ngang}} = mg', 'N_{\\text{dốc nghiêng }\\alpha} = mg\\cos\\alpha'],
    ...SIM_PRESETS.inclined,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Kéo trượt đều một thùng gỗ khối lượng $20\\text{ kg}$ trên sàn ngang với hệ số ma sát trượt $\\mu = 0{,}25$ ($g = 10\\text{ m/s}^2$). Lực kéo nằm ngang cần thiết là:',
        options: ['A. 25 N', 'B. 50 N', 'C. 200 N', 'D. 5 N'],
        correctIndex: 1,
        explanation: 'Vì trượt đều nằm ngang nên $F_k = F_{\\text{mst}} = \\mu m g = 0{,}25 \\cdot 20 \\cdot 10 = 50\\text{ N}$.'
      },
      {
        source: SRC_10,
        question: 'Lực ma sát trượt KHÔNG phụ thuộc vào yếu tố nào sau đây?',
        options: [
          'A. Bản chất và tình trạng hai bề mặt tiếp xúc ($\\mu$)',
          'B. Áp lực vuông góc $N$ giữa hai bề mặt',
          'C. Diện tích mặt tiếp xúc (khi giữ nguyên $N$ và vật liệu)',
          'D. Việc có bôi trơn dầu nhớt hay không'
        ],
        correctIndex: 2,
        explanation: 'Lực ma sát trượt $F_{\\text{mst}} = \\mu N$ không phụ thuộc diện tích tiếp xúc.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Kéo vật $m = 5\\text{ kg}$ bằng lực $F = 20\\text{ N}$ nằm ngang trên sàn có $\\mu = 0{,}2$ ($g = 10\\text{ m/s}^2$). Tính gia tốc của vật.',
        hints: ['Tính $N = mg$, $F_{\\text{mst}} = \\mu N$, rồi dùng $a = (F - F_{\\text{mst}})/m$.'],
        solutionSteps: [
          'Áp lực $N = mg = 5 \\cdot 10 = 50\\text{ N}$.',
          'Lực ma sát trượt: $F_{\\text{mst}} = 0{,}2 \\cdot 50 = 10\\text{ N}$.',
          'Gia tốc: $a = \\frac{20 - 10}{5} = 2\\text{ m/s}^2$.'
        ],
        finalAnswer: '$a = 2\\text{ m/s}^2$.'
      }
    ]
  },
  {
    id: 'phys-10-b19',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương III · Động lực học',
    sourceTag: SRC_10,
    lessonNumber: 19,
    title: 'Bài 19: Lực cản và lực nâng',
    subtitle: 'Lực cản của chất lưu (không khí, nước), tốc độ giới hạn khi rơi trong chất lưu, lực nâng khí động học và lực đẩy Archimedes',
    description:
      'Khảo sát tác dụng của chất lưu lên vật chuyển động: lực cản phụ thuộc tốc độ – diện tích cản, lực đẩy Archimedes $F_A = \\rho g V$ và lực nâng cánh máy bay.',
    theorySections: [
      {
        heading: '1. Lực cản của chất lưu (không khí, nước)',
        content:
          '• Lực cản luôn ngược hướng chuyển động và tăng khi tốc độ vật tăng hoặc diện tích mặt cản lớn (do đó tàu cao tốc, tên lửa có đầu thuôn nhọn khí động học).\n• Khi giọt mưa hoặc người nhảy dù rơi trong không khí, lúc lực cản tăng bằng trọng lực ($F_c = P$) thì vật rơi thẳng đều với **tốc độ giới hạn**.'
      },
      {
        heading: '2. Lực nâng của chất lưu & Lực đẩy Archimedes',
        content:
          '• **Lực đẩy Archimedes** hướng thẳng đứng lên trên có độ lớn bằng trọng lượng phần chất lưu bị vật chiếm chỗ:\n$$F_A = \\rho g V$$\n• **Lực nâng cánh máy bay**: Do hình dạng cánh tạo dòng khí mặt trên chảy nhanh hơn mặt dưới (áp suất dưới lớn hơn trên).'
      }
    ],
    keyFormulas: [
      'F_A = \\rho \\cdot g \\cdot V_{\\text{chìm}}',
      'F_c = P \\implies \\text{vật đạt tốc độ rơi giới hạn không đổi}'
    ],
    ...SIM_PRESETS.projectile,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một khối sắt thể tích $2\\text{ dm}^3$ nhúng chìm hoàn toàn trong nước ($\\rho = 1000\\text{ kg/m}^3$, $g = 10\\text{ m/s}^2$). Lực đẩy Archimedes tác dụng lên khối sắt là:',
        options: ['A. 2 N', 'B. 20 N', 'C. 200 N', 'D. 2000 N'],
        correctIndex: 1,
        explanation: 'Đổi $V = 2\\text{ dm}^3 = 2 \\cdot 10^{-3}\\text{ m}^3 \\implies F_A = 1000 \\cdot 10 \\cdot 2\\cdot 10^{-3} = 20\\text{ N}$.'
      },
      {
        source: SRC_10,
        question: 'Khi một người nhảy dù đã bung dù và rơi ổn định với vận tốc không đổi, quan hệ giữa trọng lực $P$ và lực cản không khí $F_c$ là:',
        options: ['A. $F_c > P$', 'B. $F_c < P$', 'C. $F_c = P$', 'D. $F_c = 0$'],
        correctIndex: 2,
        explanation: 'Khi đạt tốc độ giới hạn (rơi đều, $a = 0$), hợp lực bằng 0 nên lực cản cân bằng với trọng lực: $F_c = P$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một quả cầu bằng đồng thể tích $0{,}5\\text{ dm}^3$, khối lượng riêng $\\rho_{\\text{đồng}} = 8900\\text{ kg/m}^3$ được nhúng ngập trong nước ($\\rho_n = 1000\\text{ kg/m}^3$, $g = 10\\text{ m/s}^2$) và treo bằng lực kế. Lực kế chỉ bao nhiêu?',
        hints: ['Số chỉ lực kế $T = P - F_A$.'],
        solutionSteps: [
          'Đổi $V = 0{,}5\\cdot 10^{-3}\\text{ m}^3$. Trọng lượng quả cầu: $P = \\rho_{\\text{đồng}} V g = 8900 \\cdot 0{,}5\\cdot 10^{-3} \\cdot 10 = 44{,}5\\text{ N}$.',
          'Lực đẩy Archimedes: $F_A = 1000 \\cdot 0{,}5\\cdot 10^{-3} \\cdot 10 = 5{,}0\\text{ N}$.',
          'Số chỉ lực kế: $T = P - F_A = 44{,}5 - 5{,}0 = 39{,}5\\text{ N}$.'
        ],
        finalAnswer: 'Lực kế chỉ $39{,}5\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-10-b20',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương III · Động lực học',
    sourceTag: SRC_10,
    lessonNumber: 20,
    title: 'Bài 20: Một số ví dụ về cách giải các bài toán thuộc phần động lực học',
    subtitle: 'Quy trình 4 bước chuẩn phương pháp động lực học: vật trên mặt ngang kéo xiên, vật trượt trên mặt phẳng nghiêng và hệ 2 vật',
    description:
      'Tổng hợp phương pháp chuẩn giải mọi bài toán Định luật 2 Newton: Chọn hệ quy chiếu Oxy → Biểu diễn đầy đủ vectơ lực → Chiếu phương trình $\\sum \\vec{F} = m\\vec{a}$ → Giải kết hợp động học.',
    theorySections: [
      {
        heading: '1. Quy trình 4 bước giải bài toán Động lực học',
        content:
          '• **Bước 1**: Chọn vật khảo sát và gắn hệ trục tọa độ $Oxy$ ($Ox$ dọc phương chuyển động, $Oy$ vuông góc mặt đỡ).\n• **Bước 2**: Vẽ tất cả các lực tác dụng lên vật ($\\vec{P}, \\vec{N}, \\vec{F}_k, \\vec{F}_{ms}, \\vec{T}$).\n• **Bước 3**: Viết $\\sum \\vec{F} = m\\vec{a}$ rồi chiếu lên $Ox$ ($\\sum F_x = ma$) và $Oy$ ($\\sum F_y = 0$).\n• **Bước 4**: Kết hợp với công thức động học ($v, s, t$) để tính đại lượng đề hỏi.'
      },
      {
        heading: '2. Hai bài toán mẫu kinh điển',
        content:
          '• **Kéo vật trên sàn ngang góc nghiêng $\\alpha$ hướng lên**: $N = mg - F\\sin\\alpha$; $a = \\frac{F\\cos\\alpha - \\mu(mg - F\\sin\\alpha)}{m}$.\n• **Vật trượt xuống dốc nghiêng góc $\\alpha$**: $N = mg\\cos\\alpha$; $a = g(\\sin\\alpha - \\mu\\cos\\alpha)$.'
      }
    ],
    keyFormulas: [
      'N_{\\text{kéo xiên}} = mg - F\\sin\\alpha',
      'a_{\\text{trượt dốc}} = g(\\sin\\alpha - \\mu\\cos\\alpha)'
    ],
    ...SIM_PRESETS.inclined,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một vật trượt không ma sát từ đỉnh mặt phẳng nghiêng góc $30^\\circ$ so với phương ngang ($g = 10\\text{ m/s}^2$). Gia tốc của vật là:',
        options: ['A. 10 m/s²', 'B. 5 m/s²', 'C. 8,66 m/s²', 'D. 2,5 m/s²'],
        correctIndex: 1,
        explanation: 'Khi không ma sát ($\\mu = 0$), $a = g\\sin 30^\\circ = 10 \\cdot 0{,}5 = 5\\text{ m/s}^2$.'
      },
      {
        source: SRC_10,
        question: 'Vì sao khi kéo một thùng hàng nặng, ta thường kéo dây chếch lên trên một góc nhỏ thay vì đẩy chúi xuống dưới?',
        options: [
          'A. Vì kéo chếch lên làm giảm áp lực $N = mg - F\\sin\\alpha$, giúp giảm lực ma sát trượt',
          'B. Vì kéo chếch lên làm tăng trọng lượng vật',
          'C. Vì khi đẩy xuống hệ số ma sát bằng 0',
          'D. Do trọng lực đổi chiều hướng lên'
        ],
        correctIndex: 0,
        explanation: 'Thành phần thẳng đứng hướng lên $F\\sin\\alpha$ đỡ bớt cho sàn nhà, làm $N$ giảm nên $F_{\\text{mst}} = \\mu N$ giảm theo.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Thả một vật trượt từ đỉnh dốc nghiêng dài $10\\text{ m}$, góc nghiêng $\\alpha = 30^\\circ$, hệ số ma sát $\\mu = \\frac{1}{2\\sqrt{3}}$, $g = 10\\text{ m/s}^2$. Tính gia tốc và tốc độ vật khi tới chân dốc.',
        hints: ['Dùng $a = g(\\sin\\alpha - \\mu\\cos\\alpha)$ rồi $v = \\sqrt{2as}$.'],
        solutionSteps: [
          'Gia tốc: $a = 10\\left(0{,}5 - \\frac{1}{2\\sqrt{3}} \\cdot \\frac{\\sqrt{3}}{2}\\right) = 10(0{,}5 - 0{,}25) = 2{,}5\\text{ m/s}^2$.',
          'Tốc độ chân dốc: $v = \\sqrt{2 \\cdot 2{,}5 \\cdot 10} = \\sqrt{50} = 5\\sqrt{2} \\approx 7{,}07\\text{ m/s}$.'
        ],
        finalAnswer: '$a = 2{,}5\\text{ m/s}^2$, $v = 5\\sqrt{2} \\approx 7{,}07\\text{ m/s}$.'
      }
    ]
  },
  {
    id: 'phys-10-torque-fluid',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương III · Động lực học',
    sourceTag: SRC_10,
    lessonNumber: 21,
    title: 'Bài 21: Moment lực. Cân bằng của vật rắn',
    subtitle: 'Moment lực M = F·d, cánh tay đòn d, quy tắc moment lực cho vật có trục quay cố định và điều kiện cân bằng tổng quát (ngẫu lực)',
    description:
      'Tính cánh tay đòn vuông góc từ trục quay đến giá của lực, vận dụng quy tắc cân bằng moment $\\sum M_{\\text{thuận}} = \\sum M_{\\text{ngược}}$ và đặc điểm ngẫu lực.',
    theorySections: [
      {
        heading: '1. Moment lực & Cánh tay đòn',
        content:
          '• **Moment lực** đặc trưng cho tác dụng làm quay vật quanh một trục: $M = F \\cdot d$ (đơn vị $\\text{N}\\cdot\\text{m}$).\n• $d$ là **cánh tay đòn**: khoảng cách vuông góc từ trục quay $O$ đến đường thẳng chứa vectơ lực $\\vec{F}$.'
      },
      {
        heading: '2. Quy tắc Moment lực & Ngẫu lực',
        content:
          '• Vật có trục quay cố định ở trạng thái cân bằng khi tổng các moment làm quay cùng chiều kim đồng hồ bằng tổng các moment làm quay ngược chiều kim đồng hồ:\n$$\\sum M_{\\text{cùng chiều}} = \\sum M_{\\text{ngược chiều}}$$\n• **Ngẫu lực**: Hệ hai lực song song, ngược chiều, cùng độ lớn $F$, khoảng cách giữa hai giá là $d$: Moment ngẫu lực $M = F \\cdot d$ (chỉ làm quay, hợp lực bằng 0).'
      }
    ],
    keyFormulas: [
      'M = F \\cdot d \\quad (\\text{N}\\cdot\\text{m})',
      '\\sum M_{\\text{thuận}} = \\sum M_{\\text{ngược}}, \\qquad \\sum \\vec{F} = \\vec{0}'
    ],
    ...SIM_PRESETS.torque,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Dùng cờ-lê tác dụng lực vuông góc $40\\text{ N}$ cách tâm bu-lông $25\\text{ cm}$. Moment lực tác dụng lên bu-lông là:',
        options: ['A. 1000 N·m', 'B. 10 N·m', 'C. 1,6 N·m', 'D. 160 N·m'],
        correctIndex: 1,
        explanation: 'Đổi $d = 0{,}25\\text{ m} \\implies M = F \\cdot d = 40 \\cdot 0{,}25 = 10\\text{ N}\\cdot\\text{m}$.'
      },
      {
        source: SRC_10,
        question: 'Vì sao tay nắm cửa luôn được gắn ở mép ngoài cùng của cánh cửa (xa bản lề nhất)?',
        options: [
          'A. Để tăng cánh tay đòn $d$, giúp cần lực mở $F = M/d$ nhỏ nhất',
          'B. Để tăng khối lượng cánh cửa',
          'C. Để giảm ma sát bản lề xuống 0',
          'D. Để triệt tiêu trọng lực'
        ],
        correctIndex: 0,
        explanation: 'Với cùng moment quay $M$ cần thiết, cánh tay đòn $d$ càng lớn thì lực đẩy/kéo $F$ càng nhỏ.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một thanh nhẹ AB dài $1{,}2\\text{ m}$ đặt nằm ngang trên điểm tựa O cách đầu A một đoạn $0{,}4\\text{ m}$. Treo vật $m_1 = 6\\text{ kg}$ tại A. Cần treo vật $m_2$ khối lượng bao nhiêu tại B để thanh cân bằng nằm ngang?',
        hints: ['Áp dụng quy tắc moment quanh O: $P_1 \\cdot OA = P_2 \\cdot OB$.'],
        solutionSteps: [
          'Khoảng cách cánh tay đòn: $OA = 0{,}4\\text{ m}$, $OB = 1{,}2 - 0{,}4 = 0{,}8\\text{ m}$.',
          'Cân bằng moment quanh O: $m_1 g \\cdot OA = m_2 g \\cdot OB \\implies 6 \\cdot 0{,}4 = m_2 \\cdot 0{,}8 \\implies m_2 = 3\\text{ kg}$.'
        ],
        finalAnswer: '$m_2 = 3\\text{ kg}$.'
      }
    ]
  },
  {
    id: 'phys-10-b22',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương III · Động lực học',
    sourceTag: SRC_10,
    lessonNumber: 22,
    title: 'Bài 22: Thực hành: Tổng hợp lực',
    subtitle: 'Thí nghiệm kiểm chứng quy tắc hình bình hành tổng hợp hai lực đồng quy và hai lực song song cùng chiều bằng lực kế',
    description:
      'Thiết lập bảng thí nghiệm với 2 lực kế gắn trên bảng thép từ tính, vẽ lại phương và độ lớn $\\vec{F}_1, \\vec{F}_2$ và đối chiếu lực tổng hợp $\\vec{F}$ theo đường chéo hình bình hành.',
    theorySections: [
      {
        heading: '1. Kiểm chứng tổng hợp 2 lực đồng quy',
        content:
          '• Móc dây cao su vào vòng nhẫn O chịu kéo bởi 2 lực kế $F_1, F_2$ hợp góc $\\alpha$, rồi kéo vòng nhẫn bằng dây cao su căng tới vị trí đánh dấu $O$.\n• Tháo 2 lực kế, thay bằng **1 lực kế duy nhất** kéo vòng nhẫn về đúng vị trí $O$ để đo hợp lực thực nghiệm $F_{\\text{đo}}$.\n• So sánh $F_{\\text{đo}}$ với $F_{\\text{lí thuyết}} = \\sqrt{F_1^2 + F_2^2 + 2F_1 F_2\\cos\\alpha}$.'
      },
      {
        heading: '2. Tổng hợp 2 lực song song cùng chiều',
        content:
          '• Treo hai quả nặng $P_1, P_2$ lên thanh thước nhẹ treo bằng lực kế ở vị trí O. Hợp lực có độ lớn $P = P_1 + P_2$ và điểm đặt chia trong theo tỉ lệ nghịch: $\\frac{P_1}{P_2} = \\frac{d_2}{d_1}$.'
      }
    ],
    keyFormulas: [
      'F_{\\text{hbh}} = \\sqrt{F_1^2 + F_2^2 + 2F_1 F_2\\cos\\alpha}',
      'F_{\\text{song song}} = F_1 + F_2, \\qquad F_1 d_1 = F_2 d_2'
    ],
    ...SIM_PRESETS.vectors,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Trong thí nghiệm tổng hợp hai lực đồng quy $F_1 = 3{,}0\\text{ N}$ và $F_2 = 4{,}0\\text{ N}$ hợp với nhau góc $60^\\circ$, hợp lực lí thuyết gần nhất với:',
        options: ['A. 5,0 N', 'B. 6,1 N', 'C. 7,0 N', 'D. 1,0 N'],
        correctIndex: 1,
        explanation: '$F = \\sqrt{3^2 + 4^2 + 2\\cdot 3 \\cdot 4 \\cdot \\cos 60^\\circ} = \\sqrt{9 + 16 + 12} = \\sqrt{37} \\approx 6{,}08\\text{ N}$.'
      },
      {
        source: SRC_10,
        question: 'Khi đặt vòng nhẫn ở vị trí cân bằng $O$ dưới tác dụng của hai lực kế $F_1, F_2$ và một dây chun kéo ngược xuống, lực đàn hồi của dây chun lúc đó có độ lớn:',
        options: [
          'A. Bằng đúng độ lớn hợp lực của $\\vec{F}_1$ và $\\vec{F}_2$',
          'B. Bằng 0',
          'C. Luôn lớn gấp đôi $F_1 + F_2$',
          'D. Không đo được'
        ],
        correctIndex: 0,
        explanation: 'Vì vòng nhẫn cân bằng nên lực kéo dây chun trực đối (bằng độ lớn) với hợp lực của $\\vec{F}_1$ và $\\vec{F}_2$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Hai người khiêng một thùng hàng nặng $600\\text{ N}$ bằng một đòn gánh nhẹ dài $1{,}5\\text{ m}$. Điểm treo thùng hàng cách vai người thứ nhất $0{,}6\\text{ m}$. Tính lực đè lên vai mỗi người.',
        hints: ['Áp dụng $F_1 + F_2 = 600$ và $F_1 d_1 = F_2 d_2$.'],
        solutionSteps: [
          'Khoảng cách tới vai hai người: $d_1 = 0{,}6\\text{ m}$, $d_2 = 1{,}5 - 0{,}6 = 0{,}9\\text{ m}$.',
          'Ta có $F_1 \\cdot 0{,}6 = F_2 \\cdot 0{,}9 \\implies F_1 = 1{,}5 F_2$.',
          'Kết hợp $F_1 + F_2 = 600 \\implies 2{,}5 F_2 = 600 \\implies F_2 = 240\\text{ N},\\; F_1 = 360\\text{ N}$.'
        ],
        finalAnswer: 'Người thứ nhất chịu $360\\text{ N}$, người thứ hai chịu $240\\text{ N}$.'
      }
    ]
  },

  // ================= CHƯƠNG IV. NĂNG LƯỢNG, CÔNG, CÔNG SUẤT (BÀI 23 - 27) =================
  {
    id: 'phys-10-b23',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương IV · Năng lượng, Công, Công suất',
    sourceTag: SRC_10,
    lessonNumber: 23,
    title: 'Bài 23: Năng lượng. Công cơ học',
    subtitle: 'Sự truyền và chuyển hóa năng lượng, công thức công tổng quát A = F·s·cosα và trường hợp công phát động, công cản, công bằng 0',
    description:
      'Xác định công cơ học $A = F s \\cos\\alpha$ khi lực hợp với hướng dịch chuyển góc $\\alpha$ bất kỳ và phân biệt công dương ($\\alpha < 90^\\circ$), công âm ($\\alpha > 90^\\circ$) và lực không sinh công ($\\alpha = 90^\\circ$).',
    theorySections: [
      {
        heading: '1. Năng lượng và Công cơ học',
        content:
          '• Năng lượng tồn tại ở nhiều dạng (cơ năng, nhiệt năng, hóa năng, điện năng) và luôn có thể chuyển hóa từ dạng này sang dạng khác hoặc truyền từ vật này sang vật khác.\n• Công là số đo phần năng lượng được truyền hoặc chuyển hóa trong quá trình tác dụng lực làm vật dịch chuyển.'
      },
      {
        heading: '2. Công thức tổng quát của Công cơ học',
        content:
          '• Khi lực không đổi $\\vec{F}$ làm vật dịch chuyển đoạn thẳng $s$ theo hướng hợp với $\\vec{F}$ góc $\\alpha$:\n$$A = F \\cdot s \\cdot \\cos\\alpha$$\n• $0 \\le \\alpha < 90^\\circ$: Công phát động ($A > 0$).\n• $\\alpha = 90^\\circ$: Lực vuông góc phương dịch chuyển không sinh công ($A = 0$, ví dụ trọng lực trên đường ngang).\n• $90^\\circ < \\alpha \\le 180^\\circ$: Công cản ($A < 0$, ví dụ lực ma sát).'
      }
    ],
    keyFormulas: ['A = F \\cdot s \\cdot \\cos\\alpha \\quad (\\text{J})', '1\\text{ kJ} = 1000\\text{ J}'],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Kéo một xe goòng đi đoạn $10\\text{ m}$ trên đường ray ngang bằng lực $F = 100\\text{ N}$ hợp với phương ngang góc $60^\\circ$. Công của lực kéo là:',
        options: ['A. 1000 J', 'B. 500 J', 'C. 866 J', 'D. 0 J'],
        correctIndex: 1,
        explanation: '$A = F s \\cos 60^\\circ = 100 \\cdot 10 \\cdot 0{,}5 = 500\\text{ J}$.'
      },
      {
        source: SRC_10,
        question: 'Khi một ô tô chạy trên mặt đường nằm ngang, lực nào sau đây sinh công bằng $0$?',
        options: ['A. Lực kéo động cơ', 'B. Lực ma sát trượt khi phanh', 'C. Trọng lực và phản lực mặt đường', 'D. Lực cản không khí'],
        correctIndex: 2,
        explanation: 'Trọng lực và phản lực vuông góc hoàn toàn với phương dịch chuyển nằm ngang ($\\cos 90^\\circ = 0$).'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một vật khối lượng $4\\text{ kg}$ trượt trên sàn ngang $5\\text{ m}$ dưới tác dụng lực kéo nằm ngang $F = 20\\text{ N}$ và hệ số ma sát $\\mu = 0{,}25$ ($g = 10\\text{ m/s}^2$). Tính công của lực kéo, công của lực ma sát và tổng công ngoại lực.',
        hints: ['Tính $F_{ms} = \\mu m g$, công ma sát mang dấu âm ($\cos 180^\\circ = -1$).'],
        solutionSteps: [
          'Công lực kéo: $A_k = 20 \\cdot 5 = 100\\text{ J}$.',
          'Lực ma sát: $F_{ms} = 0{,}25 \\cdot 4 \\cdot 10 = 10\\text{ N} \\implies A_{ms} = -10 \\cdot 5 = -50\\text{ J}$.',
          'Tổng công ngoại lực: $A = A_k + A_{ms} = 100 - 50 = 50\\text{ J}$.'
        ],
        finalAnswer: '$A_k = 100\\text{ J}$, $A_{ms} = -50\\text{ J}$, tổng công $50\\text{ J}$.'
      }
    ]
  },
  {
    id: 'phys-10-b24',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương IV · Năng lượng, Công, Công suất',
    sourceTag: SRC_10,
    lessonNumber: 24,
    title: 'Bài 24: Công suất',
    subtitle: 'Định nghĩa công suất P = A/t, công suất tức thời P = F·v·cosα, đơn vị Oát (W) – Mã lực (HP) và kWh',
    description:
      'Đo tốc độ sinh công và truyền năng lượng thông qua đại lượng công suất, phân biệt đơn vị công suất W/HP với đơn vị năng lượng kWh.',
    theorySections: [
      {
        heading: '1. Công suất trung bình và công suất tức thời',
        content:
          '• **Công suất** đo tốc độ thực hiện công (công sinh ra trong $1\\text{ giây}$): $\\mathcal{P} = \\frac{A}{t}$.\n• Công thức liên hệ lực kéo và vận tốc: $\\mathcal{P} = F \\cdot v \\cdot \\cos\\alpha$ (khi lực cùng hướng vận tốc: $\\mathcal{P} = F \\cdot v$).'
      },
      {
        heading: '2. Đơn vị đo và Chuyển đổi',
        content:
          '• Đơn vị chuẩn SI là Oát ($\\text{W}$): $1\\text{ W} = 1\\text{ J/s}$, $1\\text{ kW} = 1000\\text{ W}$, $1\\text{ MW} = 10^6\\text{ W}$.\n• Trong kỹ thuật còn dùng Mã lực ($1\\text{ HP} \\approx 746\\text{ W}$). Lưu ý: $1\\text{ kWh} = 3{,}6 \\cdot 10^6\\text{ J}$ là đơn vị **công/năng lượng**, không phải công suất!'
      }
    ],
    keyFormulas: ['\\mathcal{P} = \\frac{A}{t} = F \\cdot v \\cdot \\cos\\alpha', '1\\text{ kWh} = 3{,}6 \\cdot 10^6\\text{ J}'],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một ô tô chạy đều tốc độ $20\\text{ m/s}$ trên đường ngang với lực kéo động cơ $1500\\text{ N}$. Công suất của động cơ là:',
        options: ['A. 75 W', 'B. 30 kW', 'C. 15 kW', 'D. 300 kW'],
        correctIndex: 1,
        explanation: '$\\mathcal{P} = F \\cdot v = 1500 \\cdot 20 = 30\\,000\\text{ W} = 30\\text{ kW}$.'
      },
      {
        source: SRC_10,
        question: 'Đại lượng nào sau đây có đơn vị là ki-lô-oát giờ ($\\text{kWh}$)?',
        options: ['A. Công suất', 'B. Công / Năng lượng', 'C. Hiệu suất', 'D. Động lượng'],
        correctIndex: 1,
        explanation: '$A = \\mathcal{P} \\cdot t$ nên $1\\text{ kWh} = 1000\\text{ W} \\cdot 3600\\text{ s} = 3{,}6 \\cdot 10^6\\text{ J}$ là đơn vị năng lượng.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một máy bơm nước bơm được $6\\text{ m}^3$ nước lên bồn cao $10\\text{ m}$ trong $5\\text{ phút}$ (lấy $\\rho = 1000\\text{ kg/m}^3$, $g = 10\\text{ m/s}^2$, bỏ qua ma sát). Tính công và công suất có ích của máy bơm.',
        hints: ['Tính khối lượng nước $m = \\rho V$, công nâng $A = mgh$.'],
        solutionSteps: [
          'Khối lượng nước: $m = 1000 \\cdot 6 = 6000\\text{ kg}$.',
          'Công nâng nước: $A = mgh = 6000 \\cdot 10 \\cdot 10 = 600\\,000\\text{ J} = 600\\text{ kJ}$.',
          'Thời gian $t = 5 \\cdot 60 = 300\\text{ s} \\implies \\mathcal{P} = \\frac{600\\,000}{300} = 2000\\text{ W} = 2\\text{ kW}$.'
        ],
        finalAnswer: '$A = 600\\text{ kJ}$, $\\mathcal{P} = 2\\text{ kW}$.'
      }
    ]
  },
  {
    id: 'phys-10-b25',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương IV · Năng lượng, Công, Công suất',
    sourceTag: SRC_10,
    lessonNumber: 25,
    title: 'Bài 25: Động năng, thế năng',
    subtitle: 'Động năng Wđ = ½mv², định lý động năng (biến thiên động năng bằng công ngoại lực) và thế năng trọng trường Wt = mgh',
    description:
      'Thiết lập mối liên hệ giữa công và sự biến đổi động năng ($W_{đ2} - W_{đ1} = A$), ý nghĩa chọn mốc thế năng và tính chất vô hướng của năng lượng.',
    theorySections: [
      {
        heading: '1. Động năng & Định lý Động năng',
        content:
          '• **Động năng**: $W_đ = \\frac{1}{2} m v^2 \\ge 0$ (phụ thuộc hệ quy chiếu).\n• **Định lý động năng**: Độ biến thiên động năng bằng tổng công của các ngoại lực tác dụng lên vật:\n$$\\Delta W_đ = \\frac{1}{2}mv_2^2 - \\frac{1}{2}mv_1^2 = \\sum A_{\\text{ngoại lực}}$$'
      },
      {
        heading: '2. Thế năng trọng trường',
        content:
          '• **Thế năng trọng trường** của vật ở độ cao $h$ so với mốc thế năng ($h = 0$): $W_t = m g h$.\n• Công của trọng lực bằng độ giảm thế năng: $A_P = W_{t1} - W_{t2} = mgh_1 - mgh_2$ (chỉ phụ thuộc độ chênh lệch độ cao đầu – cuối, không phụ thuộc hình dạng quỹ đạo).'
      }
    ],
    keyFormulas: [
      'W_đ = \\frac{1}{2}mv^2, \\qquad W_t = mgh',
      'W_{đ2} - W_{đ1} = A_{\\text{hợp lực}}'
    ],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Nếu khối lượng vật tăng gấp đôi và vận tốc giảm một nửa, động năng của vật sẽ:',
        options: ['A. Không đổi', 'B. Giảm đi một nửa', 'C. Tăng gấp đôi', 'D. Giảm 4 lần'],
        correctIndex: 1,
        explanation: '$W_đ\' = \\frac{1}{2}(2m)(v/2)^2 = \\frac{1}{2}W_đ$, tức giảm đi một nửa.'
      },
      {
        source: SRC_10,
        question: 'Một viên đạn khối lượng $20\\text{ g}$ bay với tốc độ $400\\text{ m/s}$ xuyên sâu vào tấm gỗ dày $10\\text{ cm}$ rồi dừng lại. Độ lớn lực cản trung bình của gỗ là:',
        options: ['A. 16 000 N', 'B. 1 600 N', 'C. 8 000 N', 'D. 32 000 N'],
        correctIndex: 0,
        explanation: '$0 - \\frac{1}{2}(0{,}02)(400)^2 = -F_c \\cdot 0{,}10 \\implies 1600 = 0{,}10 F_c \\implies F_c = 16\\,000\\text{ N}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một xe nặng $1\\text{ tấn}$ đang chạy tốc độ $36\\text{ km/h}$ thì tăng tốc đạt $72\\text{ km/h}$ sau khi đi $150\\text{ m}$ đường ngang. Dùng định lý động năng tính độ lớn hợp lực tác dụng lên xe.',
        hints: ['Đổi $v_1 = 10\\text{ m/s}$, $v_2 = 20\\text{ m/s}$, $F \\cdot s = \\frac{1}{2}m(v_2^2 - v_1^2)$.'],
        solutionSteps: [
          '$\\Delta W_đ = \\frac{1}{2} \\cdot 1000 \\cdot (20^2 - 10^2) = 500 \\cdot 300 = 150\\,000\\text{ J}$.',
          'Hợp lực: $F = \\frac{\\Delta W_đ}{s} = \\frac{150\\,000}{150} = 1000\\text{ N}$.'
        ],
        finalAnswer: '$F = 1000\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-10-b26',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương IV · Năng lượng, Công, Công suất',
    sourceTag: SRC_10,
    lessonNumber: 26,
    title: 'Bài 26: Cơ năng và định luật bảo toàn cơ năng',
    subtitle: 'Tổng cơ năng W = Wđ + Wt, điều kiện bảo toàn cơ năng trong trường trọng lực và biến thiên cơ năng khi có ma sát',
    description:
      'Vận dụng định luật bảo toàn cơ năng giải bài toán con lắc, vật trượt máng cong không ma sát và tính nhiệt lượng tỏa ra khi có lực cản.',
    theorySections: [
      {
        heading: '1. Cơ năng và Định luật bảo toàn cơ năng',
        content:
          '• **Cơ năng** của vật chuyển động trong trọng trường: $W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh$.\n• Khi vật chỉ chịu tác dụng của trọng lực (và lực phản lực vuông góc quỹ đạo, **không ma sát**), cơ năng của vật là đại lượng **bảo toàn**:\n$$W_1 = W_2 \\iff \\frac{1}{2}mv_1^2 + mgh_1 = \\frac{1}{2}mv_2^2 + mgh_2$$'
      },
      {
        heading: '2. Khi có lực cản hoặc lực ma sát',
        content:
          '• Nếu có lực không thế (lực ma sát, lực cản) thực hiện công, cơ năng không bảo toàn mà biến thiên đúng bằng công của lực không thế: $W_2 - W_1 = A_{ms} < 0$.'
      }
    ],
    keyFormulas: [
      '\\frac{1}{2}mv_1^2 + mgh_1 = \\frac{1}{2}mv_2^2 + mgh_2',
      'W_2 - W_1 = A_{\\text{cản / ma sát}}'
    ],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Ném thẳng đứng một hòn đá lên cao từ mặt đất với tốc độ $v_0 = 20\\text{ m/s}$ ($g = 10\\text{ m/s}^2$, bỏ qua cản không khí). Độ cao cực đại vật đạt được là:',
        options: ['A. 10 m', 'B. 20 m', 'C. 40 m', 'D. 5 m'],
        correctIndex: 1,
        explanation: 'Bảo toàn cơ năng: $\\frac{1}{2}mv_0^2 = mgH_{\\max} \\implies H_{\\max} = \\frac{20^2}{2\\cdot 10} = 20\\text{ m}$.'
      },
      {
        source: SRC_10,
        question: 'Thả một vật rơi tự do từ độ cao $h_0$. Ở độ cao nào động năng bằng 3 lần thế năng?',
        options: ['A. h₀/2', 'B. h₀/3', 'C. h₀/4', 'D. 3h₀/4'],
        correctIndex: 2,
        explanation: '$W = W_đ + W_t = 3W_t + W_t = 4W_t \\implies 4mgh = mgh_0 \\implies h = h_0/4$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Từ đỉnh mặt phẳng nghiêng cao $h = 5\\text{ m}$, một vật khối lượng $2\\text{ kg}$ trượt xuống không vận tốc đầu và tới chân dốc với tốc độ $8\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). Tính độ lớn công của lực ma sát trên dốc.',
        hints: ['Tính $W_1 = mgh$, $W_2 = \\frac{1}{2}mv^2$, suy ra $A_{ms} = W_2 - W_1$.'],
        solutionSteps: [
          'Cơ năng ở đỉnh dốc: $W_1 = 2 \\cdot 10 \\cdot 5 = 100\\text{ J}$.',
          'Cơ năng ở chân dốc: $W_2 = \\frac{1}{2} \\cdot 2 \\cdot 8^2 = 64\\text{ J}$.',
          'Công của lực ma sát: $A_{ms} = W_2 - W_1 = 64 - 100 = -36\\text{ J}$ (độ lớn hao phí $36\\text{ J}$).'
        ],
        finalAnswer: '$A_{ms} = -36\\text{ J}$ (nhiệt lượng hao phí $36\\text{ J}$).'
      }
    ]
  },
  {
    id: 'phys-10-b27',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương IV · Năng lượng, Công, Công suất',
    sourceTag: SRC_10,
    lessonNumber: 27,
    title: 'Bài 27: Hiệu suất',
    subtitle: 'Năng lượng có ích và năng lượng hao phí, công thức tính hiệu suất theo công hoặc công suất và cách nâng cao hiệu suất máy móc',
    description:
      'Tính hiệu suất động cơ, mặt phẳng nghiêng và thiết bị chuyển hóa năng lượng $H = \\frac{W_{\\text{có ích}}}{W_{\\text{toàn phần}}} \\cdot 100\\%$ và hiểu giới hạn luôn nhỏ hơn $100\\%$.',
    theorySections: [
      {
        heading: '1. Năng lượng có ích, hao phí & Hiệu suất',
        content:
          '• Trong mọi quá trình chuyển hóa năng lượng, luôn có một phần năng lượng chuyển thành nhiệt/âm thanh hao phí: $W_{\\text{toàn phần}} = W_{\\text{có ích}} + W_{\\text{hao phí}}$.\n• **Hiệu suất ($H$)**:\n$$H = \\frac{W_{\\text{có ích}}}{W_{\\text{toàn phần}}} \\cdot 100\\% = \\frac{\\mathcal{P}_{\\text{có ích}}}{\\mathcal{P}_{\\text{toàn phần}}} \\cdot 100\\%$$'
      },
      {
        heading: '2. Ý nghĩa thực tiễn',
        content:
          '• Luôn có $0 < H < 100\\%$ trong động cơ thực tế.\n• Động cơ đốt trong có $H \\approx 25\\%-40\\%$, động cơ điện có thể đạt $85\\%-95\\%$.'
      }
    ],
    keyFormulas: ['H = \\frac{A_{\\text{có ích}}}{A_{\\text{toàn phần}}} \\cdot 100\\% = \\frac{\\mathcal{P}_{\\text{có ích}}}{\\mathcal{P}_{\\text{tp}}} \\cdot 100\\%'],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một động cơ điện tiêu thụ điện năng $1000\\text{ J}$ để thực hiện công cơ học nâng vật $800\\text{ J}$. Hiệu suất của động cơ là:',
        options: ['A. 20%', 'B. 80%', 'C. 125%', 'D. 8%'],
        correctIndex: 1,
        explanation: '$H = \\frac{800}{1000} \\cdot 100\\% = 80\\%$.'
      },
      {
        source: SRC_10,
        question: 'Kéo thùng hàng nặng $300\\text{ N}$ lên cao $2\\text{ m}$ bằng mặt phẳng nghiêng dài $5\\text{ m}$ cần lực kéo $150\\text{ N}$. Hiệu suất mặt phẳng nghiêng là:',
        options: ['A. 60%', 'B. 75%', 'C. 80%', 'D. 90%'],
        correctIndex: 2,
        explanation: '$A_{\\text{ích}} = 300 \\cdot 2 = 600\\text{ J}$; $A_{\\text{tp}} = 150 \\cdot 5 = 750\\text{ J} \\implies H = 600/750 = 80\\%$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một máy bơm có công suất điện tiêu thụ $2\\text{ kW}$ và hiệu suất $75\\%$. Tính lượng nước máy bơm có thể đưa lên độ cao $12\\text{ m}$ trong thời gian $1\\text{ phút}$ ($g = 10\\text{ m/s}^2$).',
        hints: ['Tính công có ích $A_{\\text{ích}} = H \\cdot \\mathcal{P}_{\\text{tp}} \\cdot t$ rồi giải $m = A_{\\text{ích}}/(gh)$.'],
        solutionSteps: [
          'Công toàn phần trong $60\\text{ s}$: $A_{\\text{tp}} = 2000 \\cdot 60 = 120\\,000\\text{ J}$.',
          'Công có ích: $A_{\\text{ích}} = 0{,}75 \\cdot 120\\,000 = 90\\,000\\text{ J}$.',
          'Khối lượng nước nâng được: $m = \\frac{90\\,000}{10 \\cdot 12} = 750\\text{ kg}$.'
        ],
        finalAnswer: '$m = 750\\text{ kg}$ (tương đương $750\\text{ lít}$ nước).'
      }
    ]
  },

  // ================= CHƯƠNG V. ĐỘNG LƯỢNG (BÀI 28 - 30) =================
  {
    id: 'phys-10-momentum',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương V · Động lượng',
    sourceTag: SRC_10,
    lessonNumber: 28,
    title: 'Bài 28: Động lượng',
    subtitle: 'Động lượng p = mv (vectơ), xung lượng của lực F·Δt và ứng dụng túi khí ô tô – kéo dài thời gian va chạm',
    description:
      'Làm chủ khái niệm vectơ động lượng $\\vec{p} = m\\vec{v}$ cùng hệ thức liên hệ giữa xung lượng lực $\\vec{F}\\Delta t$ và độ biến thiên động lượng $\\Delta\\vec{p}$.',
    theorySections: [
      {
        heading: '1. Khái niệm Động lượng',
        content:
          '• **Động lượng** là đại lượng vectơ cùng hướng với vận tốc: $\\vec{p} = m\\vec{v}$, độ lớn $p = m v$ (đơn vị $\\text{kg}\\cdot\\text{m/s}$ hoặc $\\text{N}\\cdot\\text{s}$).\n• Tổng động lượng hệ nhiều vật là tổng vectơ: $\\vec{p} = \\vec{p}_1 + \\vec{p}_2$ (chú ý quy tắc hình bình hành).'
      },
      {
        heading: '2. Xung lượng của lực & Độ biến thiên động lượng',
        content:
          '• Tích $\\vec{F}\\Delta t$ gọi là **xung lượng của lực** trong thời gian $\\Delta t$.\n• Từ Định luật 2 Newton: $\\vec{F}\\Delta t = \\Delta \\vec{p} = \\vec{p}_2 - \\vec{p}_1$.\n• Giải thích kỹ thuật an toàn: Với cùng $\\Delta p$, tăng thời gian va chạm $\\Delta t$ (nhờ túi khí, đệm nhảy) sẽ làm lực va đập $F = \\frac{\\Delta p}{\\Delta t}$ giảm đi rất nhiều.'
      }
    ],
    keyFormulas: [
      '\\vec{p} = m\\vec{v} \\quad (\\text{kg}\\cdot\\text{m/s})',
      '\\vec{F}\\Delta t = \\Delta\\vec{p} = m\\vec{v}_2 - m\\vec{v}_1'
    ],
    ...SIM_PRESETS.momentum,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một quả bóng $0{,}5\\text{ kg}$ bay vuông góc vào tường với tốc độ $10\\text{ m/s}$ và bật ngược trở lại vuông góc tường với tốc độ $10\\text{ m/s}$. Độ lớn độ biến thiên động lượng bằng:',
        options: ['A. 0 kg·m/s', 'B. 5 kg·m/s', 'C. 10 kg·m/s', 'D. 20 kg·m/s'],
        correctIndex: 2,
        explanation: 'Do đổi chiều ngược hẳn, $\\Delta p = |m(-v) - mv| = 2mv = 2 \\cdot 0{,}5 \\cdot 10 = 10\\text{ kg}\\cdot\\text{m/s}$.'
      },
      {
        source: SRC_10,
        question: 'Hai vật có động lượng $p_1 = 3\\text{ kg}\\cdot\\text{m/s}$ và $p_2 = 4\\text{ kg}\\cdot\\text{m/s}$ chuyển động theo hai hướng vuông góc. Tổng động lượng của hệ là:',
        options: ['A. 7 kg·m/s', 'B. 1 kg·m/s', 'C. 5 kg·m/s', 'D. 12 kg·m/s'],
        correctIndex: 2,
        explanation: '$p = \\sqrt{3^2 + 4^2} = 5\\text{ kg}\\cdot\\text{m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một cầu thủ đá vào quả bóng $0{,}45\\text{ kg}$ đang nằm yên làm bóng bay đi với tốc độ $20\\text{ m/s}$. Thời gian chân tiếp xúc bóng là $0{,}015\\text{ s}$. Tính độ lớn lực trung bình chân tác dụng lên bóng.',
        hints: ['Dùng $F \\Delta t = m(v_2 - v_1)$.'],
        solutionSteps: [
          'Độ biến thiên động lượng: $\\Delta p = 0{,}45 \\cdot 20 - 0 = 9\\text{ kg}\\cdot\\text{m/s}$.',
          'Lực tác dụng trung bình: $F = \\frac{9}{0{,}015} = 600\\text{ N}$.'
        ],
        finalAnswer: '$F = 600\\text{ N}$.'
      }
    ]
  },
  {
    id: 'phys-10-b29',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương V · Động lượng',
    sourceTag: SRC_10,
    lessonNumber: 29,
    title: 'Bài 29: Định luật bảo toàn động lượng',
    subtitle: 'Hệ kín (cô lập), bảo toàn động lượng trong va chạm đàn hồi, va chạm mềm (không đàn hồi) và chuyển động bằng phản lực',
    description:
      'Áp dụng định luật bảo toàn tổng vectơ động lượng $\\vec{p}_{\\text{trước}} = \\vec{p}_{\\text{sau}}$ cho bài toán va chạm mềm, va chạm đàn hồi và súng giật lùi – tên lửa phản lực.',
    theorySections: [
      {
        heading: '1. Hệ kín và Định luật bảo toàn động lượng',
        content:
          '• **Hệ kín (cô lập)**: Không có ngoại lực hoặc tổng ngoại lực bằng 0 (hoặc nội lực khi va chạm/nổ lớn hơn rất nhiều ngoại lực trong thời gian cực ngắn).\n• **Định luật bảo toàn động lượng**:\n$$\\sum \\vec{p}_{\\text{trước}} = \\sum \\vec{p}_{\\text{sau}}$$'
      },
      {
        heading: '2. Va chạm đàn hồi, Va chạm mềm & Chuyển động phản lực',
        content:
          '• **Va chạm mềm**: Hai vật dính làm một sau va chạm ($m_1\\vec{v}_1 + m_2\\vec{v}_2 = (m_1 + m_2)\\vec{V}$); động lượng bảo toàn nhưng một phần động năng biến thành nhiệt.\n• **Va chạm đàn hồi**: Cả động lượng và tổng động năng đều được bảo toàn.\n• **Phản lực**: Khẩu pháo giật lùi khi bắn đạn, tên lửa phụt khí về sau để bay lên theo $m_1\\vec{v}_1 + m_2\\vec{v}_2 = \\vec{0}$.'
      }
    ],
    keyFormulas: [
      'm_1\\vec{v}_1 + m_2\\vec{v}_2 = m_1\\vec{v}_1\' + m_2\\vec{v}_2\'',
      'V_{\\text{mềm}} = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}'
    ],
    ...SIM_PRESETS.newton_cradle,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một xe lăn $m_1 = 2\\text{ kg}$ chạy với tốc độ $3\\text{ m/s}$ đến va chạm mềm dính chặt vào xe $m_2 = 4\\text{ kg}$ đang đứng yên. Tốc độ hai xe ngay sau va chạm là:',
        options: ['A. 1 m/s', 'B. 1,5 m/s', 'C. 2 m/s', 'D. 3 m/s'],
        correctIndex: 0,
        explanation: '$V = \\frac{m_1 v_1}{m_1 + m_2} = \\frac{2 \\cdot 3}{2 + 4} = 1\\text{ m/s}$.'
      },
      {
        source: SRC_10,
        question: 'Trong va chạm mềm (hai vật dính vào nhau sau va chạm), nhận xét nào sau đây ĐÚNG?',
        options: [
          'A. Tổng động lượng bảo toàn, một phần cơ năng chuyển hóa thành nhiệt',
          'B. Cả động lượng và động năng đều tăng lên',
          'C. Động lượng bằng 0 và động năng bảo toàn hoàn toàn',
          'D. Chỉ động năng bảo toàn còn động lượng mất đi'
        ],
        correctIndex: 0,
        explanation: 'Hệ va chạm ngắn bảo toàn động lượng; va chạm mềm có biến dạng dẻo nên hao hụt động năng chuyển thành nhiệt.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một khẩu súng đại bác khối lượng $M = 800\\text{ kg}$ đặt trên sàn ngang không ma sát bắn ra viên đạn $m = 4\\text{ kg}$ theo phương ngang với vận tốc $v = 400\\text{ m/s}$. Tính tốc độ giật lùi của súng ngay sau khi bắn.',
        hints: ['Tổng động lượng trước khi bắn bằng 0: $MV + mv = 0$.'],
        solutionSteps: [
          'Chọn chiều dương hướng theo chiều đạn bay.',
          'Bảo toàn động lượng: $0 = m v + M V \\implies V = -\\frac{m v}{M} = -\\frac{4 \\cdot 400}{800} = -2\\text{ m/s}$.'
        ],
        finalAnswer: 'Súng giật lùi ngược chiều đạn với tốc độ $2\\text{ m/s}$.'
      }
    ]
  },
  {
    id: 'phys-10-b30',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương V · Động lượng',
    sourceTag: SRC_10,
    lessonNumber: 30,
    title: 'Bài 30: Thực hành: Xác định động lượng của vật trước và sau va chạm',
    subtitle: 'Thí nghiệm trên đệm khí với 2 xe gắn tấm chắn sáng qua cổng quang điện đo vận tốc kiểm chứng bảo toàn động lượng',
    description:
      'Xây dựng thí nghiệm đệm khí giảm ma sát, đo tốc độ $v_1, v_2$ trước và $v_1\', v_2\'$ sau va chạm đàn hồi/va chạm mềm để kiểm nghiệm $p_{\\text{trước}} \\approx p_{\\text{sau}}$.',
    theorySections: [
      {
        heading: '1. Thiết kế thí nghiệm đệm khí kiểm chứng va chạm',
        content:
          '• Băng đệm khí thổi khí qua các lỗ nhỏ tạo lớp đệm giúp ma sát trượt giảm gần bằng $0$ (tạo hệ gần kín theo phương ngang).\n• Hai xe $m_1, m_2$ gắn tấm chắn sáng bề rộng $d$ đi qua 2 cổng quang điện nối đồng hồ đo thời gian hiện số để xác định các vận tốc trước và sau va chạm.'
      },
      {
        heading: '2. Xử lý bảng số liệu va chạm',
        content:
          '• **Va chạm mềm** (dùng băng dính Velcro ở đầu hai xe): Đo $t_1$ (xe 1 trước va chạm) và $t\'$ (cặp xe sau va chạm), kiểm tra $m_1 v_1 \\approx (m_1 + m_2) V$.\n• **Va chạm đàn hồi** (dùng đệm lò xo): Đo $t_1, t_1\', t_2\'$ để đối chiếu tổng động lượng và tổng động năng.'
      }
    ],
    keyFormulas: [
      'v = \\frac{d_{\\text{tấm chắn}}}{\\Delta t}, \\qquad p_{\\text{trước}} = m_1 v_1 + m_2 v_2 \\approx p_{\\text{sau}}'
    ],
    ...SIM_PRESETS.momentum,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Trong thí nghiệm va chạm trên băng đệm khí, vai trò chính của luồng khí thổi từ mặt băng là:',
        options: [
          'A. Triệt tiêu trọng lực của xe',
          'B. Giảm tối đa lực ma sát để hệ hai xe xem như hệ kín theo phương ngang',
          'C. Tăng gia tốc rơi tự do',
          'D. Nung nóng tấm chắn sáng'
        ],
        correctIndex: 1,
        explanation: 'Lớp đệm khí ngăn tiếp xúc trực tiếp, làm ma sát trượt cực nhỏ để động lượng phương ngang được bảo toàn.'
      },
      {
        source: SRC_10,
        question: 'Xe 1 ($m_1 = 200\\text{ g}$) chắn cổng A mất $0{,}04\\text{ s}$ (tấm chắn rộng $2\\text{ cm}$), va chạm mềm với xe 2 ($m_2 = 200\\text{ g}$) đứng yên rồi cùng qua cổng B mất $0{,}08\\text{ s}$. Nhận xét nào đúng?',
        options: [
          'A. Tổng động lượng bảo toàn ($0{,}10\\text{ kg}\\cdot\\text{m/s}$ trước và sau)',
          'B. Động lượng tăng gấp đôi',
          'C. Động lượng bằng 0',
          'D. Vận tốc tăng gấp đôi'
        ],
        correctIndex: 0,
        explanation: '$v_1 = 0{,}02/0{,}04 = 0{,}5\\text{ m/s} \\implies p_{\\text{trước}} = 0{,}2 \\cdot 0{,}5 = 0{,}1\\text{ kg}\\cdot\\text{m/s}$; $V = 0{,}02/0{,}08 = 0{,}25\\text{ m/s} \\implies p_{\\text{sau}} = 0{,}4 \\cdot 0{,}25 = 0{,}1\\text{ kg}\\cdot\\text{m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Nêu nguyên nhân gây ra sai số làm cho $p_{\\text{sau}}$ thực nghiệm thường nhỏ hơn nhẹ so với $p_{\\text{trước}}$ trong bài thực hành đệm khí.',
        hints: ['Liên quan tới lực cản không khí và độ thăng bằng ngang của máng đệm khí.'],
        solutionSteps: [
          '1. Lực cản không khí và ma sát dư nhỏ vẫn tồn tại làm tiêu hao một phần động lượng khi xe trượt giữa hai cổng quang.',
          '2. Máng đệm khí có thể bị nghiêng rất nhỏ so với phương ngang hoặc sai số thời gian đo qua tấm chắn sáng.'
        ],
        finalAnswer: 'Do lực cản không khí, ma sát dư, độ thăng bằng máng và sai số đo thời gian.'
      }
    ]
  },

  // ================= CHƯƠNG VI. CHUYỂN ĐỘNG TRÒN (BÀI 31 - 32) =================
  {
    id: 'phys-10-circular',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương VI · Chuyển động tròn',
    sourceTag: SRC_10,
    lessonNumber: 31,
    title: 'Bài 31: Động học của chuyển động tròn đều',
    subtitle: 'Đo góc bằng rađian (rad), tốc độ góc ω = Δθ/Δt, tốc độ dài v = ωR, chu kì T và tần số f',
    description:
      'Thiết lập hệ thức liên hệ giữa đại lượng góc ($\\omega, T, f$) và đại lượng dài ($v$) trên quỹ đạo tròn đều cùng mô phỏng trực quan 2D/3D.',
    theorySections: [
      {
        heading: '1. Độ dịch chuyển góc (Rađian) & Tốc độ góc',
        content:
          '• Góc ở tâm chắn cung độ dài $s$ bằng bán kính $R$ có số đo là $1\\text{ rad}$: $\\theta = \\frac{s}{R}$ ($360^\\circ = 2\\pi\\text{ rad}$).\n• **Tốc độ góc**: $\\omega = \\frac{\\Delta \\theta}{\\Delta t}$ (đơn vị $\\text{rad/s}$).'
      },
      {
        heading: '2. Chu kì, Tần số & Tốc độ dài',
        content:
          '• **Chu kì ($T$)**: Thời gian quay hết 1 vòng; **Tần số ($f$)**: Số vòng quay trong 1 giây:\n$$\\omega = \\frac{2\\pi}{T} = 2\\pi f$$\n• **Tốc độ dài**: Vận tốc luôn tiếp tuyến quỹ đạo, có độ lớn không đổi $v = \\omega R$.'
      }
    ],
    keyFormulas: [
      '\\omega = \\frac{2\\pi}{T} = 2\\pi f \\quad (\\text{rad/s})',
      'v = \\omega R = \\frac{2\\pi R}{T}'
    ],
    ...SIM_PRESETS.circular,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một bánh xe bán kính $0{,}4\\text{ m}$ quay đều $300\\text{ vòng/phút}$. Tốc độ góc và tốc độ dài của một điểm trên vành bánh xe là:',
        options: [
          'A. $10\\pi\\text{ rad/s}$ và $4\\pi\\text{ m/s}$',
          'B. $5\\pi\\text{ rad/s}$ và $2\\pi\\text{ m/s}$',
          'C. $300\\text{ rad/s}$ và $120\\text{ m/s}$',
          'D. $20\\pi\\text{ rad/s}$ và $8\\pi\\text{ m/s}$'
        ],
        correctIndex: 0,
        explanation: 'Tần số $f = 300/60 = 5\\text{ Hz} \\implies \\omega = 2\\pi f = 10\\pi\\text{ rad/s}$ và $v = \\omega R = 10\\pi \\cdot 0{,}4 = 4\\pi\\text{ m/s}$.'
      },
      {
        source: SRC_10,
        question: 'Kim phút của một chiếc đồng hồ có chu kì quay bằng bao nhiêu?',
        options: ['A. 60 s', 'B. 3600 s', 'C. 43 200 s', 'D. 86 400 s'],
        correctIndex: 1,
        explanation: 'Kim phút quay hết 1 vòng trong 1 giờ $= 60 \\cdot 60 = 3600\\text{ s}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một cánh quạt trần quay đều với tốc độ $120\\text{ vòng/phút}$, đầu cánh quạt cách trục quay $0{,}6\\text{ m}$. Tính chu kì quay, tốc độ góc và tốc độ dài ở đầu cánh quạt.',
        hints: ['Đổi $f = 120/60 = 2\\text{ vòng/s}$.'],
        solutionSteps: [
          'Tần số $f = \\frac{120}{60} = 2\\text{ Hz} \\implies T = \\frac{1}{f} = 0{,}5\\text{ s}$.',
          'Tốc độ góc: $\\omega = 2\\pi f = 4\\pi \\approx 12{,}57\\text{ rad/s}$.',
          'Tốc độ dài: $v = \\omega R = 4\\pi \\cdot 0{,}6 = 2{,}4\\pi \\approx 7{,}54\\text{ m/s}$.'
        ],
        finalAnswer: '$T = 0{,}5\\text{ s}$, $\\omega = 4\\pi\\text{ rad/s}$, $v \\approx 7{,}54\\text{ m/s}$.'
      }
    ]
  },
  {
    id: 'phys-10-b32',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương VI · Chuyển động tròn',
    sourceTag: SRC_10,
    lessonNumber: 32,
    title: 'Bài 32: Lực hướng tâm và gia tốc hướng tâm',
    subtitle: 'Gia tốc hướng tâm a_ht = v²/R = ω²R, lực hướng tâm F_ht = ma_ht và ứng dụng làm đường nghiêng khi vào cua',
    description:
      'Giải thích vì sao vật chuyển động tròn đều với tốc độ không đổi vẫn có gia tốc hướng vào tâm và phân tích bản chất lực đóng vai trò lực hướng tâm.',
    theorySections: [
      {
        heading: '1. Gia tốc hướng tâm',
        content:
          '• Trong chuyển động tròn đều, dù độ lớn $v$ không đổi nhưng **hướng của vectơ $\\vec{v}$ liên tục thay đổi**, sinh ra gia tốc luôn hướng vào tâm quỹ đạo:\n$$a_{ht} = \\frac{v^2}{R} = \\omega^2 R$$'
      },
      {
        heading: '2. Lực hướng tâm & Thực tiễn thiết kế đường vòng',
        content:
          '• Lực (hay hợp lực) tác dụng vào vật chuyển động tròn đều gây ra gia tốc hướng tâm gọi là **lực hướng tâm**:\n$$F_{ht} = m a_{ht} = \\frac{m v^2}{R} = m \\omega^2 R$$\n• Lưu ý: Lực hướng tâm **không phải** một loại lực mới, mà là vai trò của lực ma sát nghỉ (xe vào cua), lực căng dây, hay lực hấp dẫn (Mặt Trăng quay quanh Trái Đất).'
      }
    ],
    keyFormulas: [
      'a_{ht} = \\frac{v^2}{R} = \\omega^2 R',
      'F_{ht} = \\frac{mv^2}{R} = m\\omega^2 R'
    ],
    ...SIM_PRESETS.centrifuge,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Một ô tô khối lượng $1000\\text{ kg}$ chạy qua khúc cua bán kính $40\\text{ m}$ với tốc độ $10\\text{ m/s}$. Lực hướng tâm tác dụng lên xe bằng:',
        options: ['A. 250 N', 'B. 2500 N', 'C. 4000 N', 'D. 10 000 N'],
        correctIndex: 1,
        explanation: '$F_{ht} = \\frac{m v^2}{R} = \\frac{1000 \\cdot 10^2}{40} = 2500\\text{ N}$.'
      },
      {
        source: SRC_10,
        question: 'Trong mô hình Mặt Trăng chuyển động gần tròn đều quanh Trái Đất, lực nào đóng vai trò là lực hướng tâm?',
        options: ['A. Lực đàn hồi', 'B. Lực ma sát nghỉ', 'C. Lực hấp dẫn giữa Trái Đất và Mặt Trăng', 'D. Lực điện từ'],
        correctIndex: 2,
        explanation: 'Lực hấp dẫn giữa Trái Đất và Mặt Trăng luôn hướng về tâm Trái Đất đóng vai trò lực hướng tâm.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một xe máy đi vào khúc cua ngang bán kính $R = 50\\text{ m}$, hệ số ma sát nghỉ cực đại giữa lốp và mặt đường là $\\mu = 0{,}5$ ($g = 10\\text{ m/s}^2$). Tính tốc độ tối đa cho phép để xe không bị trượt văng ra ngoài.',
        hints: ['Điều kiện an toàn $F_{ht} \\le F_{\\text{msn, max}} = \\mu mg$.'],
        solutionSteps: [
          'Lực ma sát nghỉ đóng vai trò lực hướng tâm: $\\frac{mv^2}{R} \\le \\mu m g$.',
          'Rút gọn $m$: $v \\le \\sqrt{\\mu g R} = \\sqrt{0{,}5 \\cdot 10 \\cdot 50} = \\sqrt{250} \\approx 15{,}8\\text{ m/s} \\approx 56{,}9\\text{ km/h}$.'
        ],
        finalAnswer: '$v_{\\max} \\approx 15{,}8\\text{ m/s}$ ($\\approx 56{,}9\\text{ km/h}$).'
      }
    ]
  },

  // ================= CHƯƠNG VII. BIẾN DẠNG CỦA VẬT RẮN. ÁP SUẤT CHẤT LỎNG (BÀI 33 - 34) =================
  {
    id: 'phys-10-b33',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương VII · Biến dạng vật rắn & Áp suất',
    sourceTag: SRC_10,
    lessonNumber: 33,
    title: 'Bài 33: Biến dạng của vật rắn',
    subtitle: 'Biến dạng kéo – biến dạng nén, giới hạn đàn hồi, lực đàn hồi của lò xo và Định luật Hooke F_đh = k|Δl|',
    description:
      'Khảo sát biến dạng đàn hồi của vật rắn, cách xác định độ cứng $k$ của lò xo từ đồ thị $F - |\\Delta l|$ và điều kiện áp dụng Định luật Hooke trong giới hạn đàn hồi.',
    theorySections: [
      {
        heading: '1. Biến dạng kéo, biến dạng nén & Giới hạn đàn hồi',
        content:
          '• **Biến dạng đàn hồi**: Vật lấy lại hình dạng, kích thước ban đầu sau khi ngừng tác dụng ngoại lực.\n• Nếu ngoại lực vượt quá **giới hạn đàn hồi**, vật bị biến dạng dẻo (không phục hồi) hoặc đứt gãy.'
      },
      {
        heading: '2. Lực đàn hồi của lò xo & Định luật Hooke',
        content:
          '• Trong giới hạn đàn hồi, độ lớn lực đàn hồi của lò xo tỉ lệ thuận với độ biến dạng của nó:\n$$F_{đh} = k \\cdot |\\Delta l| = k \\cdot |l - l_0|$$\n• $k$ ($\text{N/m}$): độ cứng (hệ số đàn hồi) của lò xo; $|\\Delta l|$ ($\\text{m}$): độ giãn hoặc nén so với chiều dài tự nhiên $l_0$.'
      }
    ],
    keyFormulas: ['F_{đh} = k |\\Delta l| = k |l - l_0|', 'k = \\frac{m g}{\\Delta l_0} \\quad (\\text{khi treo cân bằng})'],
    ...SIM_PRESETS.spring,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Treo vật nặng $200\\text{ g}$ vào một lò xo nhẹ có chiều dài tự nhiên $l_0 = 20\\text{ cm}$ thấy lò xo dài $24\\text{ cm}$ ($g = 10\\text{ m/s}^2$). Độ cứng $k$ của lò xo là:',
        options: ['A. 5 N/m', 'B. 50 N/m', 'C. 500 N/m', 'D. 80 N/m'],
        correctIndex: 1,
        explanation: 'Độ giãn $\\Delta l = 0{,}24 - 0{,}20 = 0{,}04\\text{ m}$. Khi cân bằng: $k \\Delta l = mg \\implies k = \\frac{0{,}2 \\cdot 10}{0{,}04} = 50\\text{ N/m}$.'
      },
      {
        source: SRC_10,
        question: 'Khi độ giãn của lò xo (trong giới hạn đàn hồi) tăng gấp đôi thì độ cứng $k$ và lực đàn hồi thay đổi thế nào?',
        options: [
          'A. $k$ tăng gấp đôi, $F_{đh}$ tăng gấp 4',
          'B. $k$ không đổi, $F_{đh}$ tăng gấp đôi',
          'C. $k$ giảm một nửa, $F_{đh}$ không đổi',
          'D. Cả hai đều không đổi'
        ],
        correctIndex: 1,
        explanation: 'Độ cứng $k$ chỉ phụ thuộc vật liệu và kích thước lò xo, còn $F_{đh} = k|\\Delta l|$ tăng gấp đôi.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một lò xo độ cứng $k = 100\\text{ N/m}$, chiều dài tự nhiên $25\\text{ cm}$ treo thẳng đứng. Muốn lò xo dài $29\\text{ cm}$ thì phải treo vật khối lượng bao nhiêu kg ($g = 10\\text{ m/s}^2$)?',
        hints: ['Tính $\\Delta l = 29 - 25 = 4\\text{ cm} = 0{,}04\\text{ m}$ rồi dùng $m = k\\Delta l / g$.'],
        solutionSteps: [
          'Độ giãn lò xo: $\\Delta l = 0{,}29 - 0{,}25 = 0{,}04\\text{ m}$.',
          'Lực đàn hồi cân bằng trọng lực: $m g = k \\Delta l \\implies m = \\frac{100 \\cdot 0{,}04}{10} = 0{,}4\\text{ kg}$.'
        ],
        finalAnswer: '$m = 0{,}4\\text{ kg}$ ($400\\text{ g}$).'
      }
    ]
  },
  {
    id: 'phys-10-b34',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'Chương VII · Biến dạng vật rắn & Áp suất',
    sourceTag: SRC_10,
    lessonNumber: 34,
    title: 'Bài 34: Khối lượng riêng. Áp suất chất lỏng',
    subtitle: 'Khối lượng riêng ρ = m/V, áp suất p = F/S, phương trình cơ bản thủy tĩnh p = p₀ + ρgh và nguyên lý bình thông nhau',
    description:
      'Tính khối lượng riêng, áp suất gây bởi cột chất lỏng đứng yên theo độ sâu $h$, giải thích áp suất khí quyển và ứng dụng máy nén thủy lực Pascal.',
    theorySections: [
      {
        heading: '1. Khối lượng riêng & Áp suất',
        content:
          '• **Khối lượng riêng**: $\\rho = \\frac{m}{V}$ (đơn vị SI: $\\text{kg/m}^3$; nước có $\\rho \\approx 1000\\text{ kg/m}^3$).\n• **Áp suất**: $p = \\frac{F_n}{S}$ (đơn vị Pascal: $1\\text{ Pa} = 1\\text{ N/m}^2$; $1\\text{ atm} \\approx 1{,}013 \\cdot 10^5\\text{ Pa}$).'
      },
      {
        heading: '2. Áp suất chất lỏng theo độ sâu',
        content:
          '• Áp suất tại một điểm ở độ sâu $h$ dưới mặt thoáng chất lỏng đứng yên (có áp suất khí quyển $p_0$ ở mặt thoáng):\n$$p = p_0 + \\rho g h$$\n• Độ chênh lệch áp suất giữa hai độ sâu cách nhau $\\Delta h$: $\\Delta p = \\rho g \\Delta h$.\n• Mọi điểm nằm trên cùng một mặt phẳng nằm ngang trong cùng một chất lỏng đứng yên có áp suất bằng nhau.'
      }
    ],
    keyFormulas: [
      '\\rho = \\frac{m}{V}, \\qquad p = \\frac{F}{S}',
      'p = p_0 + \\rho g h, \\qquad \\Delta p = \\rho g \\Delta h'
    ],
    ...SIM_PRESETS.archimedes,
    practiceExercises: [
      {
        source: SRC_10,
        question: 'Độ tăng áp suất do nước gây ra ở độ sâu $10\\text{ m}$ dưới mặt hồ nước ngọt ($\\rho = 1000\\text{ kg/m}^3$, $g = 10\\text{ m/s}^2$) là:',
        options: ['A. 10 000 Pa', 'B. 100 000 Pa', 'C. 1 000 Pa', 'D. 100 Pa'],
        correctIndex: 1,
        explanation: '$\\Delta p = \\rho g h = 1000 \\cdot 10 \\cdot 10 = 10^5\\text{ Pa} = 100\\text{ kPa}$ (gần bằng $1\\text{ atm}$).'
      },
      {
        source: SRC_10,
        question: 'Tại sao đập thủy điện luôn được xây dựng có phần chân đập dày hơn nhiều so với phần đỉnh đập?',
        options: [
          'A. Vì áp suất nước $p = \\rho g h$ tăng tỉ lệ thuận với độ sâu $h$',
          'B. Vì ở đáy hồ nước nhẹ hơn ở mặt thoáng',
          'C. Vì nhiệt độ nước ở đáy cao hơn',
          'D. Để giảm thể tích hồ chứa'
        ],
        correctIndex: 0,
        explanation: 'Áp suất thủy tĩnh của nước càng xuống sâu càng lớn nên chân đập chịu lực đẩy rất mạnh, cần xây dày để đảm bảo độ bền.'
      }
    ],
    essayExercises: [
      {
        source: SRC_10,
        question: 'Một tàu ngầm đang lặn ở độ sâu $80\\text{ m}$ dưới mặt biển ($\\rho_{\\text{biển}} = 1030\\text{ kg/m}^3$, $g = 10\\text{ m/s}^2$, áp suất khí quyển $p_0 = 10^5\\text{ Pa}$). Tính áp suất toàn phần tác dụng lên vỏ tàu ngầm.',
        hints: ['Thế trực tiếp vào $p = p_0 + \\rho g h$.'],
        solutionSteps: [
          'Áp suất cột nước biển: $\\Delta p = 1030 \\cdot 10 \\cdot 80 = 824\\,000\\text{ Pa}$.',
          'Áp suất toàn phần: $p = 100\\,000 + 824\\,000 = 924\\,000\\text{ Pa} = 924\\text{ kPa}$.'
        ],
        finalAnswer: '$p = 9{,}24 \\cdot 10^5\\text{ Pa}$ ($924\\text{ kPa}$).'
      }
    ]
  }
];
