import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const SRC_CD = 'GDPT 2018 (Thông tư 32/2018) · Chuyên đề học tập Vật lí THPT';

export const PHYSICS_GDPT_ELECTIVES: PhysicsLesson[] = [
  // ================= CHUYÊN ĐỀ HỌC TẬP LỚP 10 (GDPT 2018) =================
  {
    id: 'phys-cd-10-1',
    track: 'chuyen',
    tier: 'Cơ bản',
    grade: 'Lớp 10',
    stageLabel: 'Chuyên đề 10.1 · Vật lí trong một số ngành nghề',
    sourceTag: SRC_CD,
    lessonNumber: 1,
    title: 'Chuyên đề 10.1: Vật lí trong các ngành Khoa học, Kỹ thuật & Công nghệ',
    subtitle: 'Ứng dụng Vật lí trong Cơ khí, Tự động hóa, Điện – Điện tử, Tin học lượng tử, Y sinh và Hàng không vũ trụ',
    description:
      'Khám phá vai trò trụ cột của Vật lí trong công nghệ hiện đại theo định hướng nghề nghiệp GDPT 2018: cơ học kết cấu, cảm biến IoT, quang sợi viễn thông, vật liệu bán dẫn và thiết bị Y tế.',
    theorySections: [
      {
        heading: '1. Tổng quan lịch sử Vật lí thực nghiệm & Ứng dụng kỹ thuật',
        content:
          '• Từ cơ học Newton đặt nền móng cho cầu cống, động cơ hàng không đến điện từ học Faraday – Maxwell sinh ra lưới điện, radar và truyền thông không dây.\n• Vật lí chất rắn và lượng tử tạo nên transistor, vi mạch bán dẫn (chip CPU/GPU), bộ nhớ flash và tia Laser chính xác cao.'
      },
      {
        heading: '2. Hướng phát triển Vật lí hiện đại & Các ngành nghề liên quan',
        content:
          '• **Kỹ thuật cơ điện tử & Robot**: ứng dụng động lực học vật rắn, cảm biến quang/từ và điều khiển PID.\n• **Vật lí Y sinh**: xạ trị hạt nhân, cộng hưởng từ MRI, nội soi sợi quang.\n• **Năng lượng & Vật liệu mới**: pin mặt trời hiệu suất cao, vật liệu siêu dẫn và lò phản ứng nhiệt hạch.'
      }
    ],
    keyFormulas: [
      'P_{\\text{cơ}} = \\tau \\cdot \\omega \\quad (\\text{Công suất trục quay động cơ})',
      'f_{\\text{chip}} \\sim \\frac{1}{RC} \\quad (\\text{Tốc độ chuyển mạch bán dẫn})'
    ],
    ...SIM_PRESETS.kinematics,
    practiceExercises: [
      {
        source: SRC_CD,
        question: 'Lĩnh vực Vật lí nào là nền tảng trực tiếp để chế tạo chip vi xử lí silicon và pin Mặt Trời?',
        options: [
          'A. Vật lí chất rắn và Vật lí lượng tử (bán dẫn)',
          'B. Cơ học thiên thể',
          'C. Âm học kiến trúc',
          'D. Nhiệt động lực học cổ điển'
        ],
        correctIndex: 0,
        explanation: 'Chuyển tiếp bán dẫn p–n dựa trên lí thuyết vùng năng lượng trong Vật lí chất rắn & lượng tử.'
      },
      {
        source: SRC_CD,
        question: 'Công nghệ cáp quang truyền Internet tốc độ cao xuyên đại dương hoạt động dựa trên hiện tượng Vật lí nào?',
        options: [
          'A. Phản xạ toàn phần ánh sáng',
          'B. Nhiễu xạ sóng âm',
          'C. Hiệu ứng nhiệt điện Seebeck',
          'D. Phóng xạ hạt nhân tự nhiên'
        ],
        correctIndex: 0,
        explanation: 'Ánh sáng laser bị phản xạ toàn phần liên tiếp trong lõi sợi quang có chiết suất cao hơn lớp vỏ.'
      }
    ],
    essayExercises: [
      {
        source: SRC_CD,
        question: 'Phân tích 2 nguyên lí Vật lí cốt lõi được tích hợp bên trong một chiếc điện thoại thông minh hiện đại.',
        hints: ['Xét màn hình/cảm ứng (điện dung, LED/OLED), truyền sóng (5G/Wi-Fi), hoặc con quay hồi chuyển MEMS.'],
        solutionSteps: [
          'Bước 1: Cảm ứng điện dung đa điểm & gia tốc kế MEMS đo độ nghiêng dựa trên tĩnh điện học và lực quán tính.',
          'Bước 2: Anten thu phát Wi-Fi / 5G hoạt động theo nguyên lí phát và thu sóng điện từ cao tần; màn hình OLED phát sáng dựa trên tái hợp lượng tử điện tử – lỗ trống trong bán dẫn hữu cơ.'
        ],
        finalAnswer: 'Tụ điện cảm ứng – con quay quán tính MEMS, sóng điện từ cao tần và bán dẫn quang điện.'
      }
    ]
  },
  {
    id: 'phys-cd-10-2',
    track: 'chuyen',
    tier: 'Cơ bản',
    grade: 'Lớp 10',
    stageLabel: 'Chuyên đề 10.2 · Trái Đất và bầu trời',
    sourceTag: SRC_CD,
    lessonNumber: 2,
    title: 'Chuyên đề 10.2: Trái Đất và bầu trời',
    subtitle: 'Hệ Mặt Trời, chuyển động biểu kiến của Mặt Trời – Mặt Trăng, tuần trăng, nhật thực – nguyệt thực và thủy triều',
    description:
      'Giải thích sự mọc – lặn hằng ngày của các thiên thể, nguyên nhân có các mùa trên Trái Đất (nghiêng $23{,}5^\\circ$), chu kì 8 pha tuần trăng và cơ chế nhật thực toàn phần – nguyệt thực.',
    theorySections: [
      {
        heading: '1. Chuyển động biểu kiến trên Thiên cầu & Các mùa trên Trái Đất',
        content:
          '• Do Trái Đất tự quay quanh trục từ Tây sang Đông hết $24\\text{ giờ}$, ta quan sát thấy Mặt Trời và sao mọc ở hướng Đông, lặn ở hướng Tây.\n• Trục Trái Đất nghiêng $23{,}5^\\circ$ so với pháp tuyến mặt phẳng quỹ đạo quanh Mặt Trời → gây ra **4 mùa Xuân – Hạ – Thu – Đông** và độ dài ngày đêm thay đổi theo vĩ độ.'
      },
      {
        heading: '2. Các pha của Mặt Trăng, Nhật thực & Nguyệt thực',
        content:
          '• Chu kì tuần trăng (không trăng → trăng lưỡi liềm → bán nguyệt → trăng tròn) là khoảng $29{,}5\\text{ ngày}$.\n• **Nhật thực**: Mặt Trăng nằm giữa Mặt Trời và Trái Đất (xảy ra vào ngày Không trăng).\n• **Nguyệt thực**: Trái Đất nằm giữa Mặt Trời và Mặt Trăng (xảy ra vào đêm Trăng tròn).'
      }
    ],
    keyFormulas: [
      'T_{\\text{tự quay}} \\approx 24\\text{ h}, \\quad T_{\\text{quỹ đạo TĐ}} \\approx 365{,}25\\text{ ngày}',
      '\\theta_{\\text{nghiêng trục}} \\approx 23{,}5^\\circ'
    ],
    ...SIM_PRESETS.circular,
    practiceExercises: [
      {
        source: SRC_CD,
        question: 'Nguyên nhân chính sinh ra 4 mùa rõ rệt ở vùng ôn đới trên Trái Đất là:',
        options: [
          'A. Trục tự quay của Trái Đất nghiêng $23{,}5^\\circ$ và luôn giữ phương gần như không đổi khi quay quanh Mặt Trời',
          'B. Khoảng cách Trái Đất – Mặt Trời vào mùa Hè gần hơn mùa Đông gấp đôi',
          'C. Lực hấp dẫn của Mặt Trăng thay đổi theo tháng',
          'D. Tốc độ tự quay của Trái Đất tăng nhanh vào mùa Hè'
        ],
        correctIndex: 0,
        explanation: 'Góc chiếu sáng mặt trời lên hai bán cầu Bắc – Nam thay đổi tuần hoàn trong năm do trục Trái Đất nghiêng $23{,}5^\\circ$.'
      },
      {
        source: SRC_CD,
        question: 'Hiện tượng Nguyệt thực chỉ có thể xảy ra vào pha nào của Mặt Trăng?',
        options: ['A. Đêm Trăng tròn (Rằm âm lịch)', 'B. Ngày Không trăng (Mồng 1 âm lịch)', 'C. Bán nguyệt đầu tháng', 'D. Trăng khuyết cuối tháng'],
        correctIndex: 0,
        explanation: 'Khi Nguyệt thực, Trái Đất chắn giữa Mặt Trời và Mặt Trăng, tức Mặt Trăng ở phía đối diện Mặt Trời (pha Trăng tròn).'
      }
    ],
    essayExercises: [
      {
        source: SRC_CD,
        question: 'Giải thích vì sao mỗi tháng đều có 1 ngày Không trăng và 1 ngày Trăng tròn nhưng không phải tháng nào cũng có Nhật thực và Nguyệt thực?',
        hints: ['Mặt phẳng quỹ đạo Mặt Trăng quanh Trái Đất nghiêng khoảng $5^\\circ$ so với mặt phẳng quỹ đạo Trái Đất quanh Mặt Trời (hoàng đạo).'],
        solutionSteps: [
          'Bước 1: Mặt phẳng quỹ đạo Mặt Trăng nghiêng khoảng $5^\\circ$ so với mặt phẳng hoàng đạo.',
          'Bước 2: Ở đa số các kì Sóc (Không trăng) và Vọng (Trăng tròn), bóng của Mặt Trăng hoặc Trái Đất bị lệch lên trên hoặc xuống dưới nên không phủ lên nhau.',
          'Bước 3: Nhật thực/Nguyệt thực chỉ xảy ra khi Mặt Trăng vừa đi đúng pha Sóc/Vọng vừa nằm gần giao tuyến hai mặt phẳng quỹ đạo (điểm nút).'
        ],
        finalAnswer: 'Do mặt phẳng quỹ đạo Mặt Trăng nghiêng $5^\\circ$ so với mặt phẳng hoàng đạo.'
      }
    ]
  },
  {
    id: 'phys-cd-10-3',
    track: 'chuyen',
    tier: 'Cơ bản',
    grade: 'Lớp 10',
    stageLabel: 'Chuyên đề 10.3 · Vật lí với giáo dục về bảo vệ môi trường',
    sourceTag: SRC_CD,
    lessonNumber: 3,
    title: 'Chuyên đề 10.3: Vật lí với giáo dục về bảo vệ môi trường',
    subtitle: 'Hiệu ứng nhà kính, biến đổi khí hậu, năng lượng hóa thạch và công nghệ năng lượng sạch (Gió, Mặt Trời, Địa nhiệt)',
    description:
      'Tìm hiểu cơ chế bức xạ nhiệt gây hiệu ứng nhà kính, đánh giá tác động môi trường của các nguồn năng lượng và cách tính công suất – sản lượng điện gió, điện mặt trời.',
    theorySections: [
      {
        heading: '1. Hiệu ứng nhà kính & Biến đổi khí hậu',
        content:
          '• Bức xạ Mặt Trời (bước sóng ngắn khả kiến) xuyên qua khí quyển làm nóng bề mặt Trái Đất; Trái Đất phát lại bức xạ **hồng ngoại** (bước sóng dài) bị các khí nhà kính ($\\text{CO}_2, \\text{CH}_4$, hơi nước) hấp thụ và giữ ấm khí quyển.\n• Sự gia tăng phát thải $\\text{CO}_2$ từ nhiên liệu hóa thạch làm gia tăng hiệu ứng nhà kính nhân tạo, gây ấm lên toàn cầu.'
      },
      {
        heading: '2. Năng lượng tái tạo & Giảm phát thải',
        content:
          '• **Điện Mặt Trời**: Công suất điện $P = H \\cdot I_0 \\cdot S$ (với $I_0 \\approx 1000\\text{ W/m}^2$ lúc nắng đỉnh, $H$ là hiệu suất pin quang điện).\n• **Điện gió**: Công suất lý thuyết luồng gió qua cánh quạt diện tích quét $S = \\pi R^2$: $P_{\\text{gió}} = \\frac{1}{2}\\rho S v^3$.'
      }
    ],
    keyFormulas: [
      'P_{\\text{pin MT}} = H \\cdot I_0 \\cdot S',
      'P_{\\text{gió}} = \\frac{1}{2}\\rho (\\pi R^2) v^3'
    ],
    ...SIM_PRESETS.free_fall,
    practiceExercises: [
      {
        source: SRC_CD,
        question: 'Khí nhà kính giữ lại chủ yếu loại bức xạ nào do mặt đất phát ra?',
        options: [
          'A. Tia hồng ngoại (bước sóng dài)',
          'B. Tia Gamma năng lượng siêu cao',
          'C. Tia X',
          'D. Ánh sáng tím'
        ],
        correctIndex: 0,
        explanation: 'Mặt đất ở nhiệt độ trung bình $\\sim 288\\text{ K}$ bức xạ mạnh nhất ở vùng hồng ngoại ($\\sim 10\\,\\mu\\text{m}$), bị $\\text{CO}_2, \\text{H}_2\\text{O}$ hấp thụ mạnh.'
      },
      {
        source: SRC_CD,
        question: 'Nếu tốc độ gió thổi qua tuabin gió tăng lên gấp đôi ($2v$), công suất động năng của dòng khí qua cánh quạt sẽ tăng:',
        options: ['A. 8 lần', 'B. 2 lần', 'C. 4 lần', 'D. 16 lần'],
        correctIndex: 0,
        explanation: 'Vì $P_{\\text{gió}} \\propto v^3$, tốc độ gió tăng $2$ lần thì công suất tăng $2^3 = 8$ lần.'
      }
    ],
    essayExercises: [
      {
        source: SRC_CD,
        question: 'Một mái nhà lắp đặt $20\\text{ m}^2$ tấm pin Mặt Trời có hiệu suất $18\\%$. Dưới bức xạ Mặt Trời cường độ $900\\text{ W/m}^2$ trung bình $5\\text{ giờ/ngày}$, tính điện năng thu được mỗi ngày (ra kWh).',
        hints: ['Tính $P = 0{,}18 \\cdot 900 \\cdot 20$, rồi nhân $5\\text{ giờ}$ và đổi sang kWh.'],
        solutionSteps: [
          'Bước 1: Công suất điện phát ra: $P = 0{,}18 \\cdot 900 \\cdot 20 = 3240\\text{ W} = 3{,}24\\text{ kW}$.',
          'Bước 2: Sản lượng điện mỗi ngày: $A = P \\cdot t = 3{,}24 \\cdot 5 = 16{,}2\\text{ kWh}$.'
        ],
        finalAnswer: '$16{,}2\\text{ kWh/ngày}$.'
      }
    ]
  },

  // ================= CHUYÊN ĐỀ HỌC TẬP LỚP 11 (GDPT 2018) =================
  {
    id: 'phys-cd-11-1',
    track: 'chuyen',
    tier: 'Nâng cao',
    grade: 'Lớp 11',
    stageLabel: 'Chuyên đề 11.1 · Trường hấp dẫn',
    sourceTag: SRC_CD,
    lessonNumber: 4,
    title: 'Chuyên đề 11.1: Trường hấp dẫn',
    subtitle: 'Định luật vạn vật hấp dẫn Newton, cường độ trường hấp dẫn g, thế năng hấp dẫn & Tốc độ vũ trụ cấp I',
    description:
      'Mở rộng kiến thức tương tác trường từ trường tĩnh điện sang trường hấp dẫn Newton: tính cường độ trường hấp dẫn ở độ cao $h$, thế năng $W_t = -GMm/r$, vệ tinh địa tĩnh và tốc độ thoát li.',
    theorySections: [
      {
        heading: '1. Định luật vạn vật hấp dẫn & Cường độ trường hấp dẫn',
        content:
          '• Mọi cặp chất điểm khối lượng $m_1, m_2$ cách nhau $r$ đều hút nhau với lực:\n  $$F = G \\frac{m_1 m_2}{r^2} \\quad (G = 6{,}67\\cdot 10^{-11}\\text{ N}\\cdot\\text{m}^2/\\text{kg}^2)$$\n• **Cường độ trường hấp dẫn** tại điểm cách tâm hành tinh khối lượng $M$ khoảng $r$: $g = \\frac{GM}{r^2} = \\frac{GM}{(R + h)^2}$.'
      },
      {
        heading: '2. Thế hấp dẫn, Thế năng hấp dẫn & Vệ tinh nhân tạo',
        content:
          '• Chọn mốc thế năng ở vô cực: $W_t = -G\\frac{Mm}{r}$, thế hấp dẫn $\\Phi = -\\frac{GM}{r}$.\n• **Tốc độ vũ trụ cấp I** (tốc độ bay tròn sát mặt Trái Đất): $v_1 = \\sqrt{\\frac{GM}{R}} = \\sqrt{g_0 R} \\approx 7{,}9\\text{ km/s}$.\n• **Tốc độ vũ trụ cấp II** (tốc độ thoát khỏi lực hút Trái Đất): $v_2 = \\sqrt{2}\\,v_1 \\approx 11{,}2\\text{ km/s}$.'
      }
    ],
    keyFormulas: [
      'F = G\\frac{m_1 m_2}{r^2}, \\quad g(h) = \\frac{GM}{(R+h)^2} = g_0\\left(\\frac{R}{R+h}\\right)^2',
      '\\Phi = -\\frac{GM}{r}, \\quad v_1 = \\sqrt{\\frac{GM}{R}} \\approx 7{,}9\\text{ km/s}',
      'v_2 = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2}\\,v_1 \\approx 11{,}2\\text{ km/s}'
    ],
    ...SIM_PRESETS.circular,
    practiceExercises: [
      {
        source: SRC_CD,
        question: 'Tại mặt đất (bán kính Trái Đất $R$), gia tốc rơi tự do là $g_0 = 9{,}8\\text{ m/s}^2$. Ở độ cao $h = R$ cách mặt đất, gia tốc trọng trường $g$ bằng:',
        options: ['A. $2{,}45\\text{ m/s}^2$', 'B. $4{,}9\\text{ m/s}^2$', 'C. $9{,}8\\text{ m/s}^2$', 'D. $1{,}09\\text{ m/s}^2$'],
        correctIndex: 0,
        explanation: '$g = g_0\\left(\\frac{R}{R+R}\\right)^2 = \\frac{9{,}8}{4} = 2{,}45\\text{ m/s}^2$.'
      },
      {
        source: SRC_CD,
        question: 'So sánh tốc độ vũ trụ cấp I ($v_1$) để bay vòng tròn quỹ đạo thấp và tốc độ vũ trụ cấp II ($v_2$) để phóng tàu thoát hẳn khỏi Trái Đất:',
        options: ['A. $v_2 = \\sqrt{2}\\,v_1$', 'B. $v_2 = 2\\,v_1$', 'C. $v_2 = v_1$', 'D. $v_2 = 0{,}5\\,v_1$'],
        correctIndex: 0,
        explanation: 'Cơ năng để tới vô cực bằng $0$: $\\frac{1}{2}mv_2^2 - \\frac{GMm}{R} = 0 \\implies v_2 = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2}v_1$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_CD,
        question: 'Vệ tinh địa tĩnh là vệ tinh quay quanh Trái Đất ngay trên mặt phẳng xích đạo với chu kì đúng bằng $T = 24\\text{ giờ}$ ($86\\,400\\text{ s}$). Biết $R = 6400\\text{ km}$, $g_0 = 9{,}8\\text{ m/s}^2$. Hãy ước lượng bán kính quỹ đạo $r$ của vệ tinh địa tĩnh.',
        hints: ['Lực hấp dẫn làm lực hướng tâm: $\\frac{GMm}{r^2} = m\\omega^2 r \\implies r^3 = \\frac{g_0 R^2 T^2}{4\\pi^2}$.'],
        solutionSteps: [
          'Bước 1: Từ $G\\frac{M}{r^2} = \\frac{4\\pi^2}{T^2} r$ và $GM = g_0 R^2$, suy ra $r = \\sqrt[3]{\\frac{g_0 R^2 T^2}{4\\pi^2}}$.',
          'Bước 2: Thay $g_0 = 9{,}8$, $R = 6{,}4\\cdot 10^6\\text{ m}$, $T = 86\\,400\\text{ s}$: $r \\approx 42\\,250\\text{ km}$ (cách mặt đất $h \\approx 35\\,850\\text{ km}$).'
        ],
        finalAnswer: 'Bán kính quỹ đạo $r \\approx 42\\,250\\text{ km}$ (độ cao $\\approx 35\\,850\\text{ km}$).'
      }
    ]
  },
  {
    id: 'phys-cd-11-2',
    track: 'chuyen',
    tier: 'Nâng cao',
    grade: 'Lớp 11',
    stageLabel: 'Chuyên đề 11.2 · Truyền thông tin bằng sóng vô tuyến',
    sourceTag: SRC_CD,
    lessonNumber: 5,
    title: 'Chuyên đề 11.2: Truyền thông tin bằng sóng vô tuyến',
    subtitle: 'Biến điệu biên độ AM & biến điệu tần số FM, tín hiệu tương tự – tín hiệu số (ADC/DAC) và sự suy giảm tín hiệu dB',
    description:
      'Khám phá nguyên lí truyền âm thanh/dữ liệu đi xa hàng nghìn kilômét bằng cách biến điệu lên sóng mang cao tần: so sánh sóng AM và FM, chuyển đổi tương tự – số và công thức độ suy giảm tính bằng decibel.',
    theorySections: [
      {
        heading: '1. Biến điệu biên độ (AM) và Biến điệu tần số (FM)',
        content:
          '• Tín hiệu âm tần có tần số thấp ($20\\text{ Hz} – 20\\text{ kHz}$) bức xạ kém và truyền không xa, nên phải trộn (biến điệu) vào **sóng mang** cao tần ($f_c \\gg f_{\\text{âm}}$).\n• **Biến điệu biên độ (AM)**: biên độ sóng mang biến thiên theo tín hiệu âm tần, băng thông hẹp hơn, đi xa nhờ phản xạ tầng điện li nhưng dễ nhiễu biên độ.\n• **Biến điệu tần số (FM)**: tần số sóng mang biến thiên theo biên độ tín hiệu âm tần, giữ nguyên biên độ sóng mang nên **chống nhiễu cực tốt**, âm thanh trung thực.'
      },
      {
        heading: '2. Tín hiệu Tương tự (Analog) vs Tín hiệu Số (Digital) & Độ suy giảm dB',
        content:
          '• Mạch **ADC** lấy mẫu theo thời gian và lượng tử hóa để đổi tín hiệu liên tục thành dãy bit $0, 1$ chống nhiễu khi lặp lại.\n• Độ suy giảm công suất truyền qua môi trường/cáp quang theo dB: $L_{\\text{dB}} = 10\\lg\\left(\\frac{P_0}{P}\\right)$.'
      }
    ],
    keyFormulas: [
      'B_{\\text{AM}} = 2 f_{\\text{max}}, \\quad \\text{FM: } f(t) = f_c + \\Delta f\\cdot m(t)',
      'L_{\\text{dB}} = 10\\lg\\left(\\frac{P_{\\text{vào}}}{P_{\\text{ra}}}\\right)'
    ],
    ...SIM_PRESETS.wave_interference,
    practiceExercises: [
      {
        source: SRC_CD,
        question: 'Ưu điểm nổi bật nhất của phát thanh biến điệu tần số (FM) so với biến điệu biên độ (AM) là:',
        options: [
          'A. Ít bị ảnh hưởng bởi nhiễu khí quyển và nhiễu điện công nghiệp nên âm thanh chất lượng cao hơn',
          'B. Băng thông kênh FM nhỏ hơn kênh AM',
          'C. Tín hiệu FM phản xạ tầng điện li đi vòng quanh Trái Đất tốt hơn AM',
          'D. Không cần sử dụng sóng mang cao tần'
        ],
        correctIndex: 0,
        explanation: 'Nhiễu tự nhiên thường làm méo biên độ sóng; máy thu FM cắt phần biên độ thừa và chỉ tách biến thiên tần số nên rất sạch nhiễu.'
      },
      {
        source: SRC_CD,
        question: 'Công suất tín hiệu truyền qua một đoạn cáp bị giảm từ $100\\text{ mW}$ xuống còn $1\\text{ mW}$. Độ suy giảm tín hiệu bằng:',
        options: ['A. $20\\text{ dB}$', 'B. $10\\text{ dB}$', 'C. $100\\text{ dB}$', 'D. $2\\text{ dB}$'],
        correctIndex: 0,
        explanation: '$L = 10\\lg(100/1) = 10 \\cdot 2 = 20\\text{ dB}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_CD,
        question: 'Một sợi cáp quang có hệ số suy giảm $0{,}25\\text{ dB/km}$. Nếu công suất đầu phát là $8\\text{ mW}$ và đầu thu yêu cầu công suất tối thiểu $0{,}08\\text{ mW}$, hỏi khoảng cách truyền tối đa trước khi cần bộ khuếch đại lặp?',
        hints: ['Tính tổng suy giảm cho phép $L = 10\\lg(8 / 0{,}08)$, sau đó chia cho $0{,}25\\text{ dB/km}$.'],
        solutionSteps: [
          'Bước 1: Tổng độ suy giảm tối đa cho phép: $L = 10\\lg\\left(\\frac{8}{0{,}08}\\right) = 10\\lg(100) = 20\\text{ dB}$.',
          'Bước 2: Chiều dài cáp tối đa: $d = \\frac{20}{0{,}25} = 80\\text{ km}$.'
        ],
        finalAnswer: 'Khoảng cách tối đa là $80\\text{ km}$.'
      }
    ]
  },
  {
    id: 'phys-cd-11-3',
    track: 'chuyen',
    tier: 'Nâng cao',
    grade: 'Lớp 11',
    stageLabel: 'Chuyên đề 11.3 · Mở đầu về điện tử học',
    sourceTag: SRC_CD,
    lessonNumber: 6,
    title: 'Chuyên đề 11.3: Mở đầu về điện tử học',
    subtitle: 'Cảm biến điện trở nhiệt/quang (LDR, Thermistor), mạch chia thế, Op-Amp khuếch đại thuật toán và cổng logic số',
    description:
      'Làm chủ linh kiện điện tử cơ bản theo chuyên đề 11.3: cảm biến nhiệt NTC, quang điện trở LDR trong mạch cầu chia áp, bộ khuếch đại thuật toán (Op-Amp) lý tưởng và bảng chân trị các cổng logic AND, OR, NOT, NAND.',
    theorySections: [
      {
        heading: '1. Cảm biến & Mạch phân áp',
        content:
          '• **Quang điện trở (LDR)**: điện trở giảm mạnh khi ánh sáng chiếu vào càng mạnh.\n• **Nhiệt điện trở NTC**: điện trở giảm khi nhiệt độ tăng.\n• Mạch phân áp gồm $R_1$ nối tiếp $R_2$ đặt dưới nguồn $U_{\\text{cc}}$: $U_{\\text{ra}} = U_{\\text{cc}} \\cdot \\frac{R_2}{R_1 + R_2}$.'
      },
      {
        heading: '2. Khuếch đại thuật toán (Op-Amp) & Cổng Logic cơ bản',
        content:
          '• **Op-Amp lý tưởng**: tổng trở vào vô cùng lớn ($I_+ = I_- \\approx 0$), hệ số khuếch đại vòng hở cực lớn.\n  – **Mạch khuếch đại đảo**: $A_u = \\frac{U_{\\text{ra}}}{U_{\\text{vào}}} = -\\frac{R_{\\text{ht}}}{R_1}$.\n  – **Mạch khuếch đại không đảo**: $A_u = 1 + \\frac{R_{\\text{ht}}}{R_1}$.\n• **Cổng logic**: `NOT` (đảo bit), `AND` ($A\\cdot B$), `OR` ($A+B$), `NAND` ($\\overline{A\\cdot B}$).'
      }
    ],
    keyFormulas: [
      'U_{\\text{ra}} = U_{\\text{cc}}\\frac{R_2}{R_1 + R_2}',
      'A_{u\\text{ (đảo)}} = -\\frac{R_{\\text{ht}}}{R_1}, \\qquad A_{u\\text{ (không đảo)}} = 1 + \\frac{R_{\\text{ht}}}{R_1}'
    ],
    ...SIM_PRESETS.ohm_dc,
    practiceExercises: [
      {
        source: SRC_CD,
        question: 'Một mạch khuếch đại đảo dùng Op-Amp có $R_1 = 2\\text{ k}\\Omega$, điện trở hồi tiếp $R_{\\text{ht}} = 20\\text{ k}\\Omega$. Khi đưa tín hiệu vào $U_{\\text{vào}} = +0{,}5\\text{ V}$, điện áp đầu ra (chưa bão hòa) là:',
        options: ['A. $-5{,}0\\text{ V}$', 'B. $+5{,}0\\text{ V}$', 'C. $+5{,}5\\text{ V}$', 'D. $-0{,}05\\text{ V}$'],
        correctIndex: 0,
        explanation: '$U_{\\text{ra}} = -\\frac{R_{\\text{ht}}}{R_1} U_{\\text{vào}} = -\\frac{20}{2}\\cdot 0{,}5 = -5{,}0\\text{ V}$.'
      },
      {
        source: SRC_CD,
        question: 'Mạch đèn đường tự động bật sáng khi trời tối mắc cảm biến quang trở LDR ở nhánh dưới của mạch chia áp. Khi trời tối đi, điện trở của LDR tăng lên làm hiệu điện thế trên LDR sẽ:',
        options: ['A. Tăng lên, kích hoạt bộ so sánh bật đèn', 'B. Giảm xuống về 0', 'C. Đảo cực âm', 'D. Không thay đổi'],
        correctIndex: 0,
        explanation: 'Theo $U_{\\text{LDR}} = U_{\\text{cc}}\\frac{R_{\\text{LDR}}}{R_1 + R_{\\text{LDR}}}$, khi $R_{\\text{LDR}}$ tăng thì $U_{\\text{LDR}}$ tăng.'
      }
    ],
    essayExercises: [
      {
        source: SRC_CD,
        question: 'Thiết kế mạch phân áp gồm điện trở cố định $R_1 = 10\\text{ k}\\Omega$ và quang trở LDR mắc nối tiếp vào nguồn $U_{\\text{cc}} = 9\\text{ V}$. Ban ngày $R_{\\text{LDR}} = 2\\text{ k}\\Omega$, ban đêm $R_{\\text{LDR}} = 80\\text{ k}\\Omega$. Tính điện áp ra trên hai đầu LDR vào ban ngày và ban đêm.',
        hints: ['Dùng $U_{\\text{LDR}} = 9\\cdot\\frac{R_{\\text{LDR}}}{10 + R_{\\text{LDR}}}$.'],
        solutionSteps: [
          'Bước 1: Ban ngày: $U_{\\text{ngày}} = 9 \\cdot \\frac{2}{10 + 2} = 1{,}5\\text{ V}$.',
          'Bước 2: Ban đêm: $U_{\\text{đêm}} = 9 \\cdot \\frac{80}{10 + 80} = 8{,}0\\text{ V}$.'
        ],
        finalAnswer: 'Ban ngày $1{,}5\\text{ V}$; ban đêm $8{,}0\\text{ V}$.'
      }
    ]
  },

  // ================= CHUYÊN ĐỀ HỌC TẬP LỚP 12 (GDPT 2018) =================
  {
    id: 'phys-12-ac-rlc',
    track: 'chuyen',
    tier: 'Nâng cao',
    grade: 'Lớp 12',
    stageLabel: 'Chuyên đề 12.1 · Dòng điện xoay chiều (RLC & Chỉnh lưu)',
    sourceTag: SRC_CD,
    lessonNumber: 7,
    title: 'Chuyên đề 12.1: Mạch RLC nối tiếp, Cộng hưởng điện & Chỉnh lưu xoay chiều',
    subtitle: 'Tổng trở Z, giản đồ vectơ Fresnel, độ lệch pha φ, cộng hưởng Z_L = Z_C, hệ số công suất cosφ và mạch chỉnh lưu điốt',
    description:
      'Chuyên đề 12.1 GDPT 2018: giải mạch RLC không phân nhánh bằng giản đồ Fresnel, phân tích hiện tượng cộng hưởng điện cực đại công suất và cơ chế chỉnh lưu bán chu kì / cả chu kì bằng cầu điốt + tụ lọc.',
    theorySections: [
      {
        heading: '1. Tổng trở, Độ lệch pha & Công suất mạch RLC nối tiếp',
        content:
          '• Cảm kháng $Z_L = \\omega L$, dung kháng $Z_C = \\frac{1}{\\omega C}$.\n• Tổng trở: $Z = \\sqrt{R^2 + (Z_L - Z_C)^2}$, cường độ hiệu dụng $I = \\frac{U}{Z}$.\n• Độ lệch pha giữa $u$ và $i$: $\\tan\\varphi = \\frac{Z_L - Z_C}{R}$ ($u$ nhanh pha hơn $i$ khi $Z_L > Z_C$).\n• Công suất tiêu thụ: $P = U I \\cos\\varphi = I^2 R$ với hệ số công suất $\\cos\\varphi = \\frac{R}{Z}$.'
      },
      {
        heading: '2. Cộng hưởng điện & Chỉnh lưu dòng xoay chiều',
        content:
          '• Khi $\\omega L = \\frac{1}{\\omega C} \\iff f = \\frac{1}{2\\pi\\sqrt{LC}}$, xảy ra **cộng hưởng điện**: $Z_{\\min} = R$, $I_{\\max} = \\frac{U}{R}$, $\\varphi = 0$ ($\\cos\\varphi = 1$) và $P_{\\max} = \\frac{U^2}{R}$.\n• Dùng cầu 4 điốt bán dẫn chuyển điện xoay chiều thành xung một chiều và tụ điện mắc song song tải để làm phẳng điện áp (chỉnh lưu toàn kì).'
      }
    ],
    keyFormulas: [
      'Z = \\sqrt{R^2 + (Z_L - Z_C)^2}, \\quad \\tan\\varphi = \\frac{Z_L - Z_C}{R}',
      'P = U I \\cos\\varphi, \\quad \\cos\\varphi = \\frac{R}{Z}',
      '\\text{Cộng hưởng: } \\omega_0 = \\frac{1}{\\sqrt{LC}} \\implies I_{\\max} = \\frac{U}{R}'
    ],
    ...SIM_PRESETS.ac_rlc,
    practiceExercises: [
      {
        source: SRC_CD,
        question: 'Đặt điện áp xoay chiều $U = 100\\text{ V}$ vào mạch RLC nối tiếp có $R = 30\\,\\Omega$, $Z_L = 80\\,\\Omega$, $Z_C = 40\\,\\Omega$. Tổng trở $Z$ và cường độ dòng hiệu dụng $I$ là:',
        options: ['A. $50\\,\\Omega$; $2\\text{ A}$', 'B. $150\\,\\Omega$; $0{,}67\\text{ A}$', 'C. $70\\,\\Omega$; $1{,}43\\text{ A}$', 'D. $50\\,\\Omega$; $1{,}41\\text{ A}$'],
        correctIndex: 0,
        explanation: '$Z = \\sqrt{30^2 + (80 - 40)^2} = 50\\,\\Omega \\implies I = \\frac{100}{50} = 2\\text{ A}$.'
      },
      {
        source: SRC_CD,
        question: 'Trong mạch RLC mắc nối tiếp đang có $Z_L > Z_C$, muốn đưa mạch về trạng thái cộng hưởng ($\\cos\\varphi = 1$) mà không đổi $R, L, C$, ta phải:',
        options: [
          'A. Giảm tần số dòng điện xuống',
          'B. Tăng tần số dòng điện lên',
          'C. Tăng điện áp nguồn lên',
          'D. Tăng điện trở $R$'
        ],
        correctIndex: 0,
        explanation: 'Do $Z_L > Z_C$, giảm $f$ sẽ làm $Z_L = 2\\pi f L$ giảm và $Z_C = \\frac{1}{2\\pi f C}$ tăng đến khi $Z_L = Z_C$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_CD,
        question: 'Đoạn mạch RLC nối tiếp có $R = 40\\,\\Omega$, $L = \\frac{0{,}7}{\\pi}\\text{ H}$, $C = \\frac{10^{-3}}{3\\pi}\\text{ F}$, đặt vào điện áp $u = 120\\sqrt{2}\\cos(100\\pi t)\\text{ (V)}$. Tính tổng trở, cường độ dòng điện hiệu dụng và công suất tiêu thụ của mạch.',
        hints: ['Tính $Z_L = \\omega L = 70\\,\\Omega$ và $Z_C = \\frac{1}{\\omega C} = 30\\,\\Omega$.'],
        solutionSteps: [
          'Bước 1: Với $\\omega = 100\\pi\\text{ rad/s}$: $Z_L = 100\\pi\\cdot\\frac{0{,}7}{\\pi} = 70\\,\\Omega$; $Z_C = \\frac{1}{100\\pi \\cdot \\frac{10^{-3}}{3\\pi}} = 30\\,\\Omega$.',
          'Bước 2: Tổng trở $Z = \\sqrt{40^2 + (70 - 30)^2} = 40\\sqrt{2}\\,\\Omega$.',
          'Bước 3: Cường độ hiệu dụng $I = \\frac{U}{Z} = \\frac{120}{40\\sqrt{2}} = \\frac{3}{\\sqrt{2}}\\text{ A} \\approx 2{,}12\\text{ A}$.',
          'Bước 4: Công suất tiêu thụ $P = I^2 R = \\left(\\frac{3}{\\sqrt{2}}\\right)^2 \\cdot 40 = 4{,}5 \\cdot 40 = 180\\text{ W}$.'
        ],
        finalAnswer: '$Z = 40\\sqrt{2}\\,\\Omega$; $I \\approx 2{,}12\\text{ A}$; $P = 180\\text{ W}$.'
      }
    ]
  },
  {
    id: 'phys-cd-12-2',
    track: 'chuyen',
    tier: 'Chuyên / HSG',
    grade: 'Lớp 12',
    stageLabel: 'Chuyên đề 12.2 · Ứng dụng Vật lí trong Y học',
    sourceTag: SRC_CD,
    lessonNumber: 8,
    title: 'Chuyên đề 12.2: Ứng dụng Vật lí trong chẩn đoán Y học (Tia X, CT, Siêu âm, MRI)',
    subtitle: 'Cơ chế phát tia X bức xạ hãm, chụp cắt lớp vi tính CT, siêu âm Doppler & Cộng hưởng từ hạt nhân MRI',
    description:
      'Chuyên đề 12.2 GDPT 2018: khám phá bản chất Vật lí đằng sau 4 công nghệ chẩn đoán hình ảnh y khoa trụ cột: ống phát tia X ($\\lambda_{\\min} = hc/eU$), hệ số suy giảm khối chụp CT, sóng siêu âm phản xạ và spin hạt nhân trong máy MRI.',
    theorySections: [
      {
        heading: '1. Tia X (Rơnghen) & Chụp cắt lớp vi tính (CT)',
        content:
          '• Electron gia tốc qua hiệu điện thế cao $U_{\\text{AK}}$ đập vào đối catôt kim loại nặng (Wolfram) bức xạ tia X. Bước sóng ngắn nhất của chùm tia X:\n  $$\\lambda_{\\min} = \\frac{hc}{e U_{\\text{AK}}}$$\n• Cường độ tia X xuyên qua mô dày $x$ giảm theo hàm mũ: $I = I_0 e^{-\\mu x}$ (xương có $\\mu$ lớn hơn mô mềm nên hiện trắng rõ trên phim CT).'
      },
      {
        heading: '2. Siêu âm Y khoa & Cộng hưởng từ hạt nhân (MRI)',
        content:
          '• **Siêu âm**: dùng tinh thể áp điện phát sóng cơ tần số $1 – 15\\text{ MHz}$ và thu âm phản xạ tại ranh giới các lớp mô khác trở kháng âm; kết hợp hiệu ứng Doppler đo tốc độ dòng máu.\n• **MRI**: dùng từ trường siêu mạnh ($1{,}5 – 3\\text{ T}$) và xung sóng vô tuyến RF kích thích cộng hưởng từ của **proton Hyđrô ($^1\\text{H}$)** trong nước/mô cơ thể — hoàn toàn không dùng tia phóng xạ ion hóa!'
      }
    ],
    keyFormulas: [
      '\\lambda_{\\min} = \\frac{h c}{e U_{\\text{AK}}}',
      'I = I_0 e^{-\\mu x} \\quad (\\text{Suy giảm tia X qua mô})'
    ],
    ...SIM_PRESETS.photoelectric,
    practiceExercises: [
      {
        source: SRC_CD,
        question: 'Công nghệ chẩn đoán hình ảnh nào sau đây KHÔNG sử dụng bức xạ ion hóa (tia X hay phóng xạ) và rất an toàn cho mô mềm, não bộ?',
        options: [
          'A. Cộng hưởng từ hạt nhân (MRI) và Siêu âm',
          'B. Chụp cắt lớp vi tính (CT Scanner)',
          'C. Chụp X-quang phổi',
          'D. Xạ hình đồng vị PET/CT'
        ],
        correctIndex: 0,
        explanation: 'MRI sử dụng từ trường mạnh và sóng vô tuyến RF; siêu âm dùng sóng cơ học cao tần nên cả hai không phát bức xạ ion hóa.'
      },
      {
        source: SRC_CD,
        question: 'Một ống phát tia X hoạt động ở hiệu điện thế $U = 40\\text{ kV}$ ($hc \\approx 1242\\text{ eV}\\cdot\\text{nm}$). Bước sóng ngắn nhất $\\lambda_{\\min}$ của tia X phát ra xấp xỉ:',
        options: ['A. $0{,}031\\text{ nm}$', 'B. $0{,}31\\text{ nm}$', 'C. $3{,}1\\text{ nm}$', 'D. $31\\text{ nm}$'],
        correctIndex: 0,
        explanation: '$\\lambda_{\\min} = \\frac{1242}{40\\,000} \\approx 0{,}031\\text{ nm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_CD,
        question: 'So sánh nguyên lí tạo ảnh và ưu thế lâm sàng giữa chụp cắt lớp vi tính (CT) và chụp cộng hưởng từ (MRI).',
        hints: ['CT dựa trên sự hấp thụ tia X của xương/mô; MRI dựa trên cộng hưởng từ proton $^1\\text{H}$ trong nước.'],
        solutionSteps: [
          'Bước 1: CT dùng chùm tia X quay $360^\\circ$ quanh cơ thể đo độ suy giảm tuyến tính, tái tạo ảnh nhanh trong vài giây → tối ưu cấp cứu chấn thương sọ, phổi, xương.',
          'Bước 2: MRI đặt cơ thể trong từ trường đều mạnh và kích xung RF lên hạt nhân $^1\\text{H}$ → cho độ tương phản cực cao đối với mô mềm (não, tủy sống, dây chằng) và không gây nhiễm xạ.'
        ],
        finalAnswer: 'CT nhanh, mạnh về xương – phổi nhưng có tia X; MRI sắc nét vượt trội về mô mềm – thần kinh và không nhiễm xạ.'
      }
    ]
  },
  {
    id: 'phys-12-optics-q',
    track: 'chuyen',
    tier: 'Chuyên / HSG',
    grade: 'Lớp 12',
    stageLabel: 'Chuyên đề 12.3 · Vật lí lượng tử (Quang điện & Bohr)',
    sourceTag: SRC_CD,
    lessonNumber: 9,
    title: 'Chuyên đề 12.3: Vật lí lượng tử — Hiện tượng quang điện, Lưỡng tính sóng-hạt & Mẫu Bohr',
    subtitle: 'Thuyết lượng tử ánh sáng, phương trình Einstein ε = A + ½mv²_max, sóng vật chất De Broglie λ = h/p và quang phổ vạch Hyđrô',
    description:
      'Chuyên đề 12.3 GDPT 2018: làm chủ hiệu ứng quang điện ngoài Einstein, hiệu điện thế hãm $U_h$, bước sóng vật chất De Broglie minh chứng lưỡng tính sóng – hạt của electron và hai tiên đề Bohr.',
    theorySections: [
      {
        heading: '1. Thuyết lượng tử ánh sáng & Hiện tượng quang điện',
        content:
          '• Mỗi chùm sáng đơn sắc gồm các hạt **photon** mang năng lượng $\\varepsilon = hf = \\frac{hc}{\\lambda}$.\n• Điều kiện quang điện ngoài: $\\lambda \\le \\lambda_0 = \\frac{hc}{A}$.\n• **Phương trình Einstein**: $\\frac{hc}{\\lambda} = A + \\frac{1}{2}m v_{0\\max}^2 = A + e|U_h|$.'
      },
      {
        heading: '2. Lưỡng tính sóng – hạt De Broglie & Vùng năng lượng',
        content:
          '• Mọi vi hạt có động lượng $p = mv$ đều gắn với một sóng vật chất có bước sóng De Broglie: $\\lambda = \\frac{h}{p} = \\frac{h}{mv}$ (cơ sở của kính hiển vi điện tử).\n• Theo **mẫu nguyên tử Bohr**, các mức năng lượng dừng của Hyđrô là $E_n = -\\frac{13{,}6}{n^2}\\text{ (eV)}$; khi chuyển từ mức cao $E_m$ về mức thấp $E_n$ phát ra vạch quang phổ $\\frac{hc}{\\lambda} = E_m - E_n$.'
      }
    ],
    keyFormulas: [
      '\\varepsilon = \\frac{hc}{\\lambda} = A + e|U_h|, \\quad \\lambda_0 = \\frac{hc}{A}',
      '\\lambda_{\\text{De Broglie}} = \\frac{h}{mv}',
      'E_n = -\\frac{13{,}6}{n^2}\\text{ (eV)}, \\quad \\frac{hc}{\\lambda_{mn}} = E_m - E_n'
    ],
    ...SIM_PRESETS.photoelectric,
    practiceExercises: [
      {
        source: SRC_CD,
        question: 'Chiếu bức xạ $\\lambda = 248{,}4\\text{ nm}$ ($\varepsilon = 5{,}0\\text{ eV}$) vào tấm kim loại có công thoát $A = 2{,}2\\text{ eV}$. Điện áp hãm vừa đủ triệt tiêu dòng quang điện có độ lớn là:',
        options: ['A. $2{,}8\\text{ V}$', 'B. $7{,}2\\text{ V}$', 'C. $2{,}2\\text{ V}$', 'D. $5{,}0\\text{ V}$'],
        correctIndex: 0,
        explanation: '$e|U_h| = \\varepsilon - A = 5{,}0 - 2{,}2 = 2{,}8\\text{ eV} \\implies |U_h| = 2{,}8\\text{ V}$.'
      },
      {
        source: SRC_CD,
        question: 'Electron chuyển động với tốc độ $v = 10^6\\text{ m/s}$ ($m_e = 9{,}1\\cdot 10^{-31}\\text{ kg}$, $h = 6{,}625\\cdot 10^{-34}\\text{ J.s}$). Bước sóng De Broglie gắn với electron xấp xỉ:',
        options: ['A. $0{,}73\\text{ nm}$', 'B. $7{,}3\\text{ nm}$', 'C. $0{,}073\\text{ nm}$', 'D. $73\\text{ nm}$'],
        correctIndex: 0,
        explanation: '$\\lambda = \\frac{6{,}625\\cdot 10^{-34}}{9{,}1\\cdot 10^{-31} \\cdot 10^6} \\approx 0{,}728\\cdot 10^{-9}\\text{ m} = 0{,}73\\text{ nm}$.'
      }
    ],
    essayExercises: [
      {
        source: SRC_CD,
        question: 'Tính bước sóng ngắn nhất và bước sóng dài nhất trong dãy Balmer của nguyên tử Hyđrô (electron chuyển từ các mức cao về mức $n = 2$), cho $E_n = -\\frac{13{,}6}{n^2}\\text{ eV}$ và $hc = 1242\\text{ eV}\\cdot\\text{nm}$.',
        hints: ['Dài nhất ứng với nhảy gần nhất $3 \\to 2$ ($H_\\alpha$); ngắn nhất ứng với nhảy xa nhất $\\infty \\to 2$ ($E_\\infty = 0$).'],
        solutionSteps: [
          'Bước 1: $E_2 = -\\frac{13{,}6}{4} = -3{,}40\\text{ eV}$; $E_3 = -\\frac{13{,}6}{9} \\approx -1{,}51\\text{ eV}$.',
          'Bước 2: Bước sóng dài nhất ($3 \\to 2$): $\\lambda_{\\max} = \\frac{1242}{3{,}40 - 1{,}51} \\approx 657\\text{ nm}$ (đỏ).',
          'Bước 3: Bước sóng ngắn nhất ($\\infty \\to 2$): $\\lambda_{\\min} = \\frac{1242}{0 - (-3{,}40)} \\approx 365\\text{ nm}$ (tử ngoại).'
        ],
        finalAnswer: '$\\lambda_{\\max} \\approx 657\\text{ nm}$; $\\lambda_{\\min} \\approx 365\\text{ nm}$.'
      }
    ]
  }
];
