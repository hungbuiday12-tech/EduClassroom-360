import { ChemistryLesson } from '../types';
import { makeChemLesson } from './chemistryGdpt2018Lessons';

const SRC_2018_6 = 'GDPT 2018 · KHTN 6 (KNTT · CTST · Cánh Diều)';
const SRC_2018_7 = 'GDPT 2018 · KHTN 7 (KNTT · CTST · Cánh Diều)';
const SRC_2018_8 = 'GDPT 2018 · KHTN 8 (KNTT · CTST · Cánh Diều)';

export const CHEMISTRY_MS_2018_LESSONS: ChemistryLesson[] = [
  // ==========================================================================
  // LỚP 6 — GDPT 2018 (KHTN 6 · 5 BÀI TOÀN CHƯƠNG CHẤT & HỖN HỢP)
  // ==========================================================================
  makeChemLesson({
    id: 'chem-6-b1',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Các thể của chất',
    sourceTag: SRC_2018_6,
    lessonNumber: 1,
    title: 'Bài 1: Sự đa dạng của chất & Ba thể Rắn – Lỏng – Khí – Sự chuyển thể',
    subtitle: 'Quan sát mô hình hạt phân tử ở 3 trạng thái và 4 quá trình nóng chảy – đông đặc – bay hơi – ngưng tụ',
    description:
      'Hiểu thật trực quan vì sao cục nước đá cứng giữ nguyên hình dạng, nước lỏng chảy tràn được còn hơi nước bay lan tỏa khắp căn phòng.',
    theory1Heading: '1. Đặc điểm vi mô của 3 thể Rắn – Lỏng – Khí',
    theory1:
      '• **Thể rắn**: Các hạt xếp khít trật tự, chỉ rung tại chỗ $\\to$ hình dạng và thể tích xác định, rất khó nén.\n• **Thể lỏng**: Các hạt sát nhau nhưng trượt lên nhau tự do $\\to$ chảy được và lấy hình dạng phần bình chứa.\n• **Thể khí**: Các hạt cách xa nhau và bay tự do mọi phía $\\to$ dễ bị nén mạnh và lan tỏa kín bình.',
    theory2Heading: '2. Bốn quá trình chuyển thể quen thuộc',
    theory2:
      '• **Đun nóng (thu nhiệt)**: Rắn $\\xrightarrow{\\text{Nóng chảy}}$ Lỏng $\\xrightarrow{\\text{Bay hơi / Sôi}}$ Khí.\n• **Làm lạnh (tỏa nhiệt)**: Khí $\\xrightarrow{\\text{Ngưng tụ}}$ Lỏng $\\xrightarrow{\\text{Đông đặc}}$ Rắn.\n• Nước tinh khiết nóng chảy ở $0^\\circ\\text{C}$ và sôi ở $100^\\circ\\text{C}$.',
    keyFormulas: [
      '\\text{Rắn} \\xrightleftharpoons[\\text{Đông đặc}]{\\text{Nóng chảy}} \\text{Lỏng} \\xrightleftharpoons[\\text{Ngưng tụ}]{\\text{Bay hơi / Sôi}} \\text{Khí}',
      'T_{\\text{nc (nước đá)}} = 0^\\circ\\text{C}; \\quad T_{\\text{sôi (nước)}} = 100^\\circ\\text{C}'
    ],
    sim2d: 'states_of_matter_2d',
    sim3d: 'matter_states_3d',
    mcq1: {
      source: 'KHTN 6 · Chuyển thể',
      question: 'Hiện tượng giọt nước đọng bên ngoài thành cốc nước đá vào mùa hè là quá trình nào?',
      options: ['A. Nóng chảy', 'B. Đông đặc', 'C. Ngưng tụ (hơi nước gặp lạnh hóa lỏng)', 'D. Bay hơi'],
      correctIndex: 2,
      explanation: 'Hơi nước trong không khí chạm bề mặt thành cốc lạnh mất nhiệt nên ngưng tụ thành giọt nước lỏng.'
    },
    mcq2: {
      source: 'KHTN 6 · Ba thể chất',
      question: 'Ở thể nào các hạt phân tử chuyển động hỗn loạn nhanh nhất, cách xa nhau nhất và dễ bị nén nhất?',
      options: ['A. Thể rắn', 'B. Thể lỏng', 'C. Thể khí', 'D. Thể rắn kết tinh'],
      correctIndex: 2,
      explanation: 'Các hạt ở thể khí cách xa nhau nhiều khoảng trống nên dễ nén và khuếch tán nhanh.'
    },
    essay: {
      source: 'KHTN 6 · Thực tế',
      question: 'Phân biệt vật thể và chất trong câu sau: "Chiếc thìa bằng inox, cái bàn bằng gỗ, cốc nước làm bằng thủy tinh."',
      hints: ['Vật thể là đồ vật cụ thể; chất là vật liệu cấu tạo nên vật thể đó.'],
      solutionSteps: [
        'Vật thể: chiếc thìa, cái bàn, cái cốc.',
        'Chất/vật liệu tạo nên: inox (thép không gỉ), gỗ (xenlulozơ...), thủy tinh.'
      ],
      finalAnswer: 'Vật thể: thìa, bàn, cốc; Chất: inox, gỗ, thủy tinh.'
    }
  }),
  makeChemLesson({
    id: 'chem-6-b2',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Oxygen & Không khí',
    sourceTag: SRC_2018_6,
    lessonNumber: 2,
    title: 'Bài 2: Oxygen ($\\text{O}_2$) & Không khí – Bảo vệ môi trường Không khí',
    subtitle: 'Thành phần 78% Nitrogen – 21% Oxygen, tính chất duy trì sự sống/sự cháy và giảm ô nhiễm khói bụi',
    description:
      'Khám phá thành phần không khí trên biểu đồ trực quan và thí nghiệm nhận biết khí Oxygen làm que đóm tàn đỏ bùng cháy.',
    theory1Heading: '1. Oxygen — Khí duy trì sự sống và sự cháy',
    theory1:
      '• **Oxygen ($\\text{O}_2$)** là chất khí không màu, không mùi, ít tan trong nước và nặng hơn không khí một chút.\n• **Tính chất vàng**: Oxygen duy trì **hô hấp** của sinh vật và duy trì **sự cháy** (đưa que đóm còn tàn đỏ vào bình Oxygen, que đóm bùng cháy rực).',
    theory2Heading: '2. Thành phần Không khí & Bảo vệ bầu khí quyển',
    theory2:
      '• Không khí sạch gồm: **78% Nitrogen ($\\text{N}_2$)**, **21% Oxygen ($\\text{O}_2$)** và **1%** khí khác ($\\text{CO}_2$, hơi nước, Argon...).\n• Để bảo vệ không khí trong lành: trồng nhiều cây xanh, hạn chế đốt rơm rạ/nhiên liệu hóa thạch, đi xe điện hoặc phương tiện công cộng.',
    keyFormulas: [
      '\\text{Không khí} \\approx 78\\%\\,\\text{N}_2 + 21\\%\\,\\text{O}_2 + 1\\%\\,\\text{khí khác}'
    ],
    sim2d: 'oxygen_combustion_2d',
    sim3d: 'combustion_reactor_3d',
    mcq1: {
      source: 'KHTN 6 · Không khí',
      question: 'Trong thành phần không khí khô sạch, khí nào chiếm khoảng 78% thể tích?',
      options: ['A. Oxygen ($\\text{O}_2$)', 'B. Nitrogen ($\\text{N}_2$)', 'C. Carbon dioxide ($\\text{CO}_2$)', 'D. Hydrogen ($\\text{H}_2$)'],
      correctIndex: 1,
      explanation: 'Nitrogen ($\\text{N}_2$) chiếm khoảng 78%, Oxygen chiếm khoảng 21%.'
    },
    mcq2: {
      source: 'KHTN 6 · Thí nghiệm Oxygen',
      question: 'Làm thế nào để nhận biết lọ thủy tinh nào đựng khí Oxygen tinh khiết trong phòng thí nghiệm?',
      options: [
        'A. Ngửi thấy mùi hắc',
        'B. Đưa que đóm còn tàn đỏ vào miệng lọ thấy bùng cháy thành ngọn lửa sáng',
        'C. Thấy khí có màu xanh',
        'D. Làm đục nước vôi trong'
      ],
      correctIndex: 1,
      explanation: 'Oxygen duy trì sự cháy mạnh nên làm que đóm đang tàn đỏ bùng cháy trở lại.'
    },
    essay: {
      source: 'KHTN 6 · An toàn phòng cháy',
      question: 'Vì sao khi ủ bếp than hoặc dập lửa xăng dầu cháy, người ta dùng cát phủ lên hoặc đậy nắp kín chứ không thổi mạnh?',
      hints: ['Thổi mạnh đưa thêm Oxygen vào làm lửa bùng to hơn; phủ cát giúp cách li Oxygen.'],
      solutionSteps: [
        'Phủ cát hoặc đậy nắp kín giúp ngăn khí Oxygen ($\\text{O}_2$) trong không khí tiếp xúc với chất cháy.',
        'Thiếu Oxygen, sự cháy sẽ tắt ngay. (Lưu ý: xăng dầu nhẹ hơn nước nổi lên nên không được dội nước).'
      ],
      finalAnswer: 'Cách li nguồn cung cấp Oxygen để dập tắt sự cháy.'
    }
  }),
  makeChemLesson({
    id: 'chem-6-b3',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Vật liệu & Nhiên liệu',
    sourceTag: SRC_2018_6,
    lessonNumber: 3,
    title: 'Bài 3: Vật liệu, Nhiên liệu, Nguyên liệu & Lương thực – Thực phẩm',
    subtitle: 'Chọn đúng vật liệu (kim loại, gốm, nhựa), dùng nhiên liệu tiết kiệm và quy tắc 3R bảo vệ tài nguyên',
    description:
      'Phân biệt Vật liệu (thứ tạo nên đồ vật), Nhiên liệu (chất đốt tỏa nhiệt), Nguyên liệu (đá vôi làm xi măng, quặng sắt luyện thép) và cách sử dụng bền vững.',
    theory1Heading: '1. Vật liệu, Nhiên liệu & Nguyên liệu — Phân biệt cực dễ',
    theory1:
      '• **Vật liệu**: thứ tạo nên sản phẩm dùng hằng ngày (kim loại dẫn điện–dẫn nhiệt, cao su đàn hồi, thủy tinh trong suốt, nhựa nhẹ cách điện).\n• **Nhiên liệu**: chất đốt cháy tỏa nhiệt và ánh sáng (than đá, xăng dầu, khí gas, cồn, củi).\n• **Nguyên liệu**: vật liệu thô khai thác từ tự nhiên để chế biến công nghiệp (đá vôi nung vôi/xi măng, quặng bauxite luyện nhôm).',
    theory2Heading: '2. Sử dụng tiết kiệm & An toàn (Mô hình 3R)',
    theory2:
      '• Áp dụng **3R**: **Reduce** (Giảm dùng đồ nhựa dùng 1 lần), **Reuse** (Tái sử dụng chai thủy tinh), **Recycle** (Tái chế giấy, lon nhôm).\n• Đảm bảo an ninh năng lượng và an toàn thực phẩm (rửa sạch, bảo quản đúng nhiệt độ, không dùng thực phẩm ôi thiu).',
    keyFormulas: [
      '\\text{3R: Reduce (Tiết giảm)} \\to \\text{Reuse (Tái dùng)} \\to \\text{Recycle (Tái chế)}'
    ],
    sim2d: 'metallurgy_furnace_2d',
    sim3d: 'matter_states_3d',
    mcq1: {
      source: 'KHTN 6 · Vật liệu',
      question: 'Trong các chất sau: đồng, cao su, khí gas, đá vôi. Đâu là NHIÊN LIỆU?',
      options: ['A. Đồng', 'B. Cao su', 'C. Khí gas', 'D. Đá vôi'],
      correctIndex: 2,
      explanation: 'Khí gas (LPG) cháy tỏa nhiều nhiệt dùng đun nấu nên là nhiên liệu.'
    },
    mcq2: {
      source: 'KHTN 6 · Bảo vệ môi trường',
      question: 'Hành động nào thể hiện bước "Reuse — Tái sử dụng" trong nguyên tắc 3R?',
      options: [
        'A. Vứt chai nhựa ra sông',
        'B. Dùng lại lọ thủy tinh cũ để đựng gia vị hoặc cắm hoa',
        'C. Đốt túi nilon sau khi dùng',
        'D. Mua thêm nhiều túi nilon mới'
      ],
      correctIndex: 1,
      explanation: 'Sử dụng lại đồ vật còn tốt cho mục đích cũ hoặc mục đích mới gọi là tái sử dụng (Reuse).'
    },
    essay: {
      source: 'KHTN 6 · Lựa chọn vật liệu',
      question: 'Tại sao nồi nấu canh thường làm bằng kim loại (inox, nhôm) nhưng quai cầm lại bọc nhựa cứng hoặc gỗ?',
      hints: ['So sánh tính dẫn nhiệt của kim loại và nhựa/gỗ.'],
      solutionSteps: [
        'Thân nồi làm bằng kim loại vì kim loại dẫn nhiệt tốt giúp truyền nhanh nhiệt từ bếp vào thức ăn.',
        'Quai cầm bọc nhựa hoặc gỗ vì chúng cách nhiệt rất tốt, giúp tay người cầm không bị bỏng.'
      ],
      finalAnswer: 'Kim loại dẫn nhiệt nấu nhanh; nhựa/gỗ cách nhiệt bảo vệ tay.'
    }
  }),
  makeChemLesson({
    id: 'chem-6-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Hỗn hợp & Dung dịch',
    sourceTag: SRC_2018_6,
    lessonNumber: 4,
    title: 'Bài 4: Chất tinh khiết – Hỗn hợp, Dung dịch – Huyền phù – Nhũ tương',
    subtitle: 'Phân biệt nhanh 3 loại hỗn hợp lỏng bằng mắt thường và các yếu tố giúp đường tan nhanh trong nước',
    description:
      'Giải thích siêu dễ hiểu: pha muối/đường là dung dịch trong suốt, nước bùn phù sa đục là huyền phù, lắc dầu ăn với nước là nhũ tương.',
    theory1Heading: '1. Chất tinh khiết vs Hỗn hợp – Dung dịch',
    theory1:
      '• **Chất tinh khiết** chỉ có duy nhất một chất (nước cất, đường kính sạch) nên tính chất luôn cố định.\n• **Hỗn hợp** gồm 2 hay nhiều chất trộn lẫn. **Dung dịch** là hỗn hợp **đồng nhất trong suốt** của chất tan và dung môi (nước muối, nước đường).',
    theory2Heading: '2. Phân biệt Dung dịch – Huyền phù – Nhũ tương',
    theory2:
      '• **Dung dịch**: chất tan tan hoàn toàn (đồng nhất, không lắng cặn).\n• **Huyền phù**: hạt **rắn không tan** lơ lửng trong chất lỏng (nước phù sa, bột sắn pha nước lạnh).\n• **Nhũ tương**: giọt **lỏng không tan** phân tán trong lỏng khác (dầu ăn lắc với nước, sữa tươi).\n• Để chất rắn tan nhanh hơn: **khuấy đều, đun nóng, nghiền nhỏ**.',
    keyFormulas: [
      '\\text{Dung dịch} = \\text{Chất tan} + \\text{Dung môi (đồng nhất)}',
      '\\text{Huyền phù (rắn + lỏng)} \\cdot \\text{Nhũ tương (lỏng + lỏng)}'
    ],
    sim2d: 'mixture_separation_2d',
    sim3d: 'separation_lab_3d',
    mcq1: {
      source: 'KHTN 6 · Phân loại hỗn hợp',
      question: 'Cốc nước phù sa khuấy đục thuộc loại hỗn hợp nào?',
      options: ['A. Chất tinh khiết', 'B. Dung dịch đồng nhất', 'C. Huyền phù (hạt rắn lơ lửng)', 'D. Nhũ tương'],
      correctIndex: 2,
      explanation: 'Các hạt đất sét rắn không tan lơ lửng trong nước tạo thành huyền phù đục.'
    },
    mcq2: {
      source: 'KHTN 6 · Hòa tan chất rắn',
      question: 'Cách nào giúp một viên đường phèn tan vào nước NHANH NHẤT?',
      options: [
        'A. Thả nguyên viên vào nước đá lạnh và để yên',
        'B. Nghiền nhỏ viên đường, thả vào nước ấm và khuấy đều',
        'C. Cho vào tủ lạnh',
        'D. Không khuấy'
      ],
      correctIndex: 1,
      explanation: 'Nghiền nhỏ tăng diện tích tiếp xúc, nước ấm tăng chuyển động phân tử và khuấy giúp hòa tan cực nhanh.'
    },
    essay: {
      source: 'KHTN 6 · Thực hành',
      question: 'Cho 3 cốc sau: (1) Nước + muối ăn khuấy tan hết; (2) Nước + dầu ăn lắc mạnh; (3) Nước + bột mì khuấy lên. Xác định đâu là dung dịch, huyền phù, nhũ tương.',
      hints: ['Muối tan hết; dầu ăn là chất lỏng; bột mì là hạt rắn không tan.'],
      solutionSteps: [
        'Cốc (1) nước muối trong suốt $\\to$ **Dung dịch**.',
        'Cốc (2) giọt dầu ăn phân tán trong nước $\\to$ **Nhũ tương**.',
        'Cốc (3) hạt bột mì rắn lơ lửng trong nước $\\to$ **Huyền phù**.'
      ],
      finalAnswer: '(1) Dung dịch; (2) Nhũ tương; (3) Huyền phù.'
    }
  }),
  makeChemLesson({
    id: 'chem-6-b5',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Tách chất khỏi hỗn hợp',
    sourceTag: SRC_2018_6,
    lessonNumber: 5,
    title: 'Bài 5: Các phương pháp Tách chất khỏi Hỗn hợp (Lọc – Cô cạn – Chiết – Nam châm)',
    subtitle: 'Chọn đúng dụng cụ tách cát khỏi nước, thu muối tinh khiết từ nước biển và chiết dầu ăn nổi trên nước',
    description:
      'Thực hành ngay 4 thí nghiệm tách chất kinh điển trên bàn thí nghiệm 2D và 3D: Phễu giấy lọc, Bát sứ cô cạn, Phễu chiết hai lớp và Nam châm chữ U.',
    theory1Heading: '1. Nguyên tắc vàng chọn phương pháp tách',
    theory1:
      '• **Lọc (Phễu + giấy lọc)**: Tách chất rắn **KHÔNG TAN** khỏi chất lỏng (cát + nước).\n• **Cô cạn (Bát sứ + đèn cồn)**: Tách chất rắn **TAN, KHÔNG BAY HƠI** khỏi nước (nước muối $\\to$ muối tinh).\n• **Chiết (Phễu chiết)**: Tách hai chất lỏng **KHÔNG HÒA TAN tách lớp** (dầu ăn nổi trên nước).',
    theory2Heading: '2. Kết hợp nhiều bước tách hỗn hợp 3 chất',
    theory2:
      '• Với hỗn hợp **Bột sắt + Muối ăn + Cát**:\n  - Bước 1: Dùng **nam châm** hút hết bột sắt.\n  - Bước 2: Đổ nước hòa tan muối, đem **lọc** giữ lại cát trên giấy lọc.\n  - Bước 3: Đem phần nước muối **cô cạn** cho bay hơi nước thu muối ăn sạch.',
    keyFormulas: [
      '\\text{Lọc (Rắn không tan)} \\cdot \\text{Cô cạn (Rắn tan)} \\cdot \\text{Chiết (Lỏng tách lớp)}'
    ],
    sim2d: 'mixture_separation_2d',
    sim3d: 'separation_lab_3d',
    mcq1: {
      source: 'KHTN 6 · Tách chất',
      question: 'Bà con diêm dân làm muối từ nước biển phơi dưới nắng gió là ứng dụng phương pháp nào?',
      options: ['A. Lọc qua giấy', 'B. Chiết bằng phễu', 'C. Bay hơi / Cô cạn', 'D. Dùng nam châm'],
      correctIndex: 2,
      explanation: 'Ánh nắng làm nước biển bay hơi đi, để lại tinh thể muối ăn kết tinh trên ruộng muối.'
    },
    mcq2: {
      source: 'KHTN 6 · Tách chất',
      question: 'Hỗn hợp dầu hỏa lẫn nước nên tách bằng dụng cụ nào nhanh nhất?',
      options: ['A. Giấy lọc', 'B. Phễu chiết', 'C. Bát cô cạn đun nóng', 'D. Nam châm'],
      correctIndex: 1,
      explanation: 'Dầu hỏa nhẹ hơn nước và không tan trong nước nên nổi lên lớp trên, tách bằng phễu chiết.'
    },
    essay: {
      source: 'KHTN 6 · Thí nghiệm tổng hợp',
      question: 'Trình bày quy trình tách riêng cát và muối ăn từ một hỗn hợp khô gồm muối ăn trộn lẫn cát sạch.',
      hints: ['Muối tan trong nước, cát không tan.'],
      solutionSteps: [
        '1. Đổ hỗn hợp vào cốc nước ấm và khuấy đều cho muối tan hết, cát lắng xuống.',
        '2. Đổ qua phễu có giấy lọc: cát không tan giữ lại trên giấy lọc, thu được dung dịch nước muối trong suốt phía dưới.',
        '3. Đun cô cạn dung dịch nước muối cho nước bay hơi hết, thu lại muối ăn tinh thể.'
      ],
      finalAnswer: 'Hòa tan $\\to$ Lọc (thu cát) $\\to$ Cô cạn nước lọc (thu muối).'
    }
  }),

  // ==========================================================================
  // LỚP 7 — GDPT 2018 (KHTN 7 · 5 BÀI TOÀN CHƯƠNG NGUYÊN TỬ – BẢNG TUẦN HOÀN – LIÊN KẾT)
  // ==========================================================================
  makeChemLesson({
    id: 'chem-7-b1',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Nguyên tử Rutherford–Bohr',
    sourceTag: SRC_2018_7,
    lessonNumber: 1,
    title: 'Bài 1: Nguyên tử Rutherford–Bohr, Hạt nhân & Khối lượng nguyên tử (amu)',
    subtitle: '3 loại hạt cơ bản (p, n, e), quy luật xếp lớp vỏ 2–8–8 và vì sao khối lượng tập trung hết ở hạt nhân',
    description:
      'Hình dung nguyên tử như Hệ Mặt Trời thu nhỏ: hạt nhân mang điện dương cực nhỏ ở tâm và các electron chạy trên từng vòng quỹ đạo Bohr rõ ràng.',
    theory1Heading: '1. Ba hạt tạo nên Nguyên tử',
    theory1:
      '• **Hạt nhân** (ở tâm): gồm **Proton ($p$, điện tích $+1$)** và **Neutron ($n$, không mang điện $0$)**.\n• **Vỏ nguyên tử**: gồm các **Electron ($e$, điện tích $-1$)** chuyển động quanh hạt nhân.\n• Nguyên tử luôn **trung hòa về điện** nên **Số $p$ = Số $e$**.',
    theory2Heading: '2. Khối lượng (amu) & Quy tắc xếp lớp vỏ Bohr',
    theory2:
      '• Khối lượng $1p \\approx 1n \\approx 1\\text{ amu}$, còn electron quá nhẹ (bằng $1/1840$ amu) nên **Khối lượng nguyên tử $\\approx$ Số $p$ + Số $n$**.\n• Xếp electron theo từng lớp từ trong ra ngoài: **Lớp 1 tối đa $2e$**, **Lớp 2 tối đa $8e$**, **Lớp 3 chứa phần còn lại (với $Z \\le 20$)**.',
    keyFormulas: [
      '\\text{Số } p = \\text{Số } e = Z',
      'm_{\\text{nguyên tử (amu)}} \\approx \\text{Số } p + \\text{Số } n'
    ],
    sim2d: 'bohr_shells_2d',
    sim3d: 'atomic_orbitals_3d',
    mcq1: {
      source: 'KHTN 7 · Nguyên tử',
      question: 'Một nguyên tử Aluminum (Nhôm) có $13$ proton và $14$ neutron. Số electron và khối lượng nguyên tử (amu) lần lượt là:',
      options: ['A. $14e$ và $27\\text{ amu}$', 'B. $13e$ và $27\\text{ amu}$', 'C. $13e$ và $14\\text{ amu}$', 'D. $27e$ và $13\\text{ amu}$'],
      correctIndex: 1,
      explanation: 'Số $e = p = 13$; khối lượng $\\approx p + n = 13 + 14 = 27\\text{ amu}$.'
    },
    mcq2: {
      source: 'KHTN 7 · Lớp vỏ Bohr',
      question: 'Nguyên tử Chlorine ($Z = 17$) có mấy lớp electron và lớp ngoài cùng có bao nhiêu electron?',
      options: ['A. $2$ lớp, ngoài cùng $7e$', 'B. $3$ lớp, ngoài cùng $7e$ ($2-8-7$)', 'C. $3$ lớp, ngoài cùng $8e$', 'D. $4$ lớp, ngoài cùng $1e$'],
      correctIndex: 1,
      explanation: '$17 = 2\\text{ (lớp 1)} + 8\\text{ (lớp 2)} + 7\\text{ (lớp 3)}$.'
    },
    essay: {
      source: 'KHTN 7 · Mô hình Bohr',
      question: 'Vẽ hoặc mô tả cấu tạo lớp vỏ Bohr của nguyên tử Calcium ($Z = 20$) và cho biết Calcium có mấy lớp electron, mấy electron lớp ngoài cùng.',
      hints: ['Phân bổ lần lượt: $2$ (lớp K) $\\to 8$ (lớp L) $\\to 8$ (lớp M) $\\to 2$ (lớp N).'],
      solutionSteps: [
        'Số electron $= Z = 20$.',
        'Xếp từ trong ra ngoài: Lớp 1: $2e$; Lớp 2: $8e$; Lớp 3: $8e$; Lớp 4: $2e$.',
        'Vậy Calcium có $4$ lớp electron và $2e$ ở lớp ngoài cùng.'
      ],
      finalAnswer: '4 lớp electron ($2-8-8-2$), lớp ngoài cùng có $2e$.'
    }
  }),
  makeChemLesson({
    id: 'chem-7-b2',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Nguyên tố & Kí hiệu hóa học',
    sourceTag: SRC_2018_7,
    lessonNumber: 2,
    title: 'Bài 2: Nguyên tố Hóa học & Kí hiệu Hóa học chuẩn IUPAC',
    subtitle: 'Vì sao số proton là "thẻ căn cước" của nguyên tố và mẹo thuộc lòng 20 nguyên tố đầu tiên',
    description:
      'Hiểu bản chất Nguyên tố hóa học là tập hợp nguyên tử cùng số proton, quy tắc viết kí hiệu hóa học 1–2 chữ cái và đọc tên IUPAC theo GDPT 2018.',
    theory1Heading: '1. Nguyên tố Hóa học là gì?',
    theory1:
      '• Tập hợp những nguyên tử có **cùng số proton ($p$) trong hạt nhân** thuộc cùng một **Nguyên tố hóa học**.\n• Ví dụ: Mọi nguyên tử có $6$ proton đều là Carbon ($\\text{C}$), dù số neutron là $6$ hay $8$.',
    theory2Heading: '2. Quy tắc viết Kí hiệu & 12 nguyên tố hay gặp nhất',
    theory2:
      '• Kí hiệu gồm **1 chữ IN HOA**, nếu có chữ thứ 2 thì **viết thường**: $\\text{H}$ (Hydrogen), $\\text{C}$ (Carbon), $\\text{N}$ (Nitrogen), $\\text{O}$ (Oxygen), $\\text{Na}$ (Sodium), $\\text{Mg}$ (Magnesium), $\\text{Al}$ (Aluminum), $\\text{S}$ (Sulfur), $\\text{Cl}$ (Chlorine), $\\text{K}$ (Potassium), $\\text{Ca}$ (Calcium), $\\text{Fe}$ (Iron), $\\text{Cu}$ (Copper).',
    keyFormulas: [
      '\\text{Cùng số } p \\iff \\text{Cùng Nguyên tố Hóa học}',
      '\\text{Viết kí hiệu: Chữ đầu HOA, chữ sau thường (Na, Cl, Fe, Ca...)}'
    ],
    sim2d: 'bohr_shells_2d',
    sim3d: 'periodic_tower_3d',
    mcq1: {
      source: 'KHTN 7 · Nguyên tố hóa học',
      question: 'Ba nguyên tử X, Y, Z có số hạt (p, n) lần lượt là X(6p, 6n), Y(7p, 7n), Z(6p, 8n). Hai nguyên tử nào thuộc CÙNG một nguyên tố hóa học?',
      options: ['A. X và Y', 'B. Y và Z', 'C. X và Z (cùng có 6 proton)', 'D. Cả ba cùng nguyên tố'],
      correctIndex: 2,
      explanation: 'X và Z đều có $6$ proton nên đều là nguyên tố Carbon.'
    },
    mcq2: {
      source: 'KHTN 7 · Tên IUPAC',
      question: 'Theo chương trình GDPT 2018, kí hiệu $\\text{Na}$ và $\\text{Fe}$ ứng với tên gọi IUPAC nào?',
      options: [
        'A. Nitrogen và Fluorine',
        'B. Sodium (Natri) và Iron (Sắt)',
        'C. Neon và Fermium',
        'D. Nickel và Iron'
      ],
      correctIndex: 1,
      explanation: '$\\text{Na}$ là Sodium (Natri, $23\\text{ amu}$) và $\\text{Fe}$ là Iron (Sắt, $56\\text{ amu}$).'
    },
    essay: {
      source: 'KHTN 7 · Ghi nhớ nhanh',
      question: 'Viết tên tiếng Anh chuẩn IUPAC, kí hiệu hóa học và khối lượng nguyên tử (amu) của 4 nguyên tố: Photpho, Lưu huỳnh, Đồng, Kẽm.',
      hints: ['Phosphorus (31), Sulfur (32), Copper (64), Zinc (65).'],
      solutionSteps: [
        '1. Phosphorus: $\\text{P}$, $31\\text{ amu}$.',
        '2. Sulfur: $\\text{S}$, $32\\text{ amu}$.',
        '3. Copper: $\\text{Cu}$, $64\\text{ amu}$.',
        '4. Zinc: $\\text{Zn}$, $65\\text{ amu}$.'
      ],
      finalAnswer: 'P (31), S (32), Cu (64), Zn (65).'
    }
  }),
  makeChemLesson({
    id: 'chem-7-b3',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Bảng tuần hoàn',
    sourceTag: SRC_2018_7,
    lessonNumber: 3,
    title: 'Bài 3: Sơ lược Bảng tuần hoàn các nguyên tố hóa học',
    subtitle: 'Cách đọc Ô nguyên tố, tìm Chu kì (= số lớp electron), Nhóm (= electron lớp ngoài cùng) và Kim loại – Phi kim – Khí hiếm',
    description:
      'Làm chủ quy luật sắp xếp thần kì của Bảng tuần hoàn: chỉ cần nhìn mô hình Bohr là đọc ngay nguyên tố nằm ở Chu kì mấy, Nhóm nào!',
    theory1Heading: '1. Nguyên tắc sắp xếp & Ý nghĩa Chu kì – Nhóm',
    theory1:
      '• Các nguyên tố xếp theo chiều tăng dần **điện tích hạt nhân ($Z$)**.\n• **Số thứ tự Ô = $Z$ = số $p$ = số $e$**.\n• **Số thứ tự Chu kì = Số lớp electron** (7 chu kì nằm ngang).\n• **Số thứ tự Nhóm A = Số electron lớp ngoài cùng** (từ IA đến VIIIA).',
    theory2Heading: '2. Phân chia Kim loại – Phi kim – Khí hiếm',
    theory2:
      '• **Kim loại** (hơn $80\\%$ bảng, bên trái & giữa): thường có $1, 2, 3e$ ngoài cùng (trừ H, He, B).\n• **Phi kim** (góc trên bên phải): thường có $5, 6, 7e$ ngoài cùng.\n• **Khí hiếm** (cột cuối cùng VIIIA: He, Ne, Ar): vỏ ngoài cùng đã đủ $8e$ (hoặc $2e$ với He) nên cực kì bền, trơ hóa học.',
    keyFormulas: [
      '\\text{STT Ô} = Z = p = e',
      '\\text{STT Chu kì} = \\text{Số lớp electron}; \\quad \\text{STT Nhóm A} = \\text{Số } e\\text{ lớp ngoài cùng}'
    ],
    sim2d: 'bohr_shells_2d',
    sim3d: 'periodic_tower_3d',
    mcq1: {
      source: 'KHTN 7 · Bảng tuần hoàn',
      question: 'Nguyên tử Magnesium ($Z = 12$) có cấu hình lớp electron $2 - 8 - 2$. Vị trí của Mg trong bảng tuần hoàn là:',
      options: ['A. Chu kì 2, nhóm IIIA', 'B. Chu kì 3, nhóm IIA', 'C. Chu kì 3, nhóm VIIIA', 'D. Chu kì 2, nhóm IIA'],
      correctIndex: 1,
      explanation: 'Có $3$ lớp electron $\\to$ Chu kì 3; lớp ngoài cùng có $2e \\to$ Nhóm IIA.'
    },
    mcq2: {
      source: 'KHTN 7 · Khí hiếm',
      question: 'Nhóm nguyên tố nào tồn tại dạng đơn nguyên tử bền vững ngoài tự nhiên và hầu như không phản ứng hóa học?',
      options: ['A. Kim loại kiềm nhóm IA', 'B. Halogen nhóm VIIA', 'C. Khí hiếm nhóm VIIIA (He, Ne, Ar)', 'D. Kim loại chuyển tiếp'],
      correctIndex: 2,
      explanation: 'Khí hiếm có lớp vỏ ngoài cùng bão hòa ($2e$ với He, $8e$ với Ne, Ar) rất bền vững.'
    },
    essay: {
      source: 'KHTN 7 · Tra cứu Bảng tuần hoàn',
      question: 'Nguyên tố Oxygen nằm ở ô số $8$, chu kì $2$, nhóm VIA. Không cần nhìn bảng, hãy suy ra số proton, số lớp electron, số electron lớp ngoài cùng và tính chất (kim loại/phi kim) của Oxygen.',
      hints: ['Ô $= p = e$; chu kì $=$ số lớp; nhóm VIA $= 6e$ ngoài cùng.'],
      solutionSteps: [
        'Ô số $8 \\implies$ có $8$ proton và $8$ electron.',
        'Chu kì $2 \\implies$ có $2$ lớp electron.',
        'Nhóm VIA $\\implies$ có $6e$ ở lớp ngoài cùng (nên Oxygen là **Phi kim** điển hình).'
      ],
      finalAnswer: '$8p, 8e$, $2$ lớp, $6e$ ngoài cùng, là Phi kim.'
    }
  }),
  makeChemLesson({
    id: 'chem-7-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Phân tử & Liên kết hóa học',
    sourceTag: SRC_2018_7,
    lessonNumber: 4,
    title: 'Bài 4: Phân tử – Đơn chất – Hợp chất & Liên kết Ion – Cộng hóa trị',
    subtitle: 'Phân biệt đơn chất vs hợp chất và mô phỏng 3D cơ chế cho–nhận (NaCl) vs góp chung electron (H₂O)',
    description:
      'Hiểu vì sao các nguyên tử không đứng một mình mà kết hợp thành phân tử hay tinh thể bền vững đạt lớp vỏ 8 electron giống khí hiếm.',
    theory1Heading: '1. Đơn chất, Hợp chất & Phân tử khối',
    theory1:
      '• **Đơn chất**: tạo bởi **1 nguyên tố** (khí $\\text{O}_2$, kim loại $\\text{Fe}$, $\\text{Cu}$).\n• **Hợp chất**: tạo bởi **từ 2 nguyên tố trở lên** ($\\text{H}_2\\text{O}, \\text{CO}_2, \\text{NaCl}$).\n• **Khối lượng phân tử**: tổng khối lượng các nguyên tử trong công thức phân tử (ví dụ $\\text{H}_2\\text{O} = 2 \\cdot 1 + 16 = 18\\text{ amu}$).',
    theory2Heading: '2. Liên kết Ion (Cho–Nhận) & Cộng hóa trị (Góp chung)',
    theory2:
      '• **Liên kết Ion** (giữa **Kim loại + Phi kim**, như muối ăn $\\text{NaCl}$): Kim loại $\\text{Na}$ **nhường hẳn $1e$** thành ion $\\text{Na}^+$, phi kim $\\text{Cl}$ **nhận $1e$** thành $\\text{Cl}^-$; hai ion trái dấu hút chặt nhau tạo mạng tinh thể rắn nóng chảy cao.\n• **Liên kết Cộng hóa trị** (giữa **Phi kim + Phi kim**, như $\\text{H}_2\\text{O}, \\text{CO}_2, \\text{H}_2$): Hai nguyên tử **góp chung** cặp electron để cả hai cùng đủ vỏ bền.',
    keyFormulas: [
      '\\text{Ion (Kim loại + Phi kim): } \\text{Na}^+ + \\text{Cl}^- \\to \\text{NaCl}',
      '\\text{Cộng hóa trị (Phi kim + Phi kim): } \\text{H} : \\ddot{\\text{O}} : \\text{H}'
    ],
    sim2d: 'bohr_shells_2d',
    sim3d: 'ionic_covalent_3d',
    mcq1: {
      source: 'KHTN 7 · Liên kết hóa học',
      question: 'Chất nào sau đây được hình thành bằng LIÊN KẾT ION (cho – nhận electron)?',
      options: ['A. Khí Oxygen ($\\text{O}_2$)', 'B. Nước ($\\text{H}_2\\text{O}$)', 'C. Muối ăn Sodium chloride ($\\text{NaCl}$)', 'D. Khí Carbon dioxide ($\\text{CO}_2$)'],
      correctIndex: 2,
      explanation: '$\\text{NaCl}$ tạo thành từ kim loại Na nhường $1e$ cho phi kim Cl tạo ion $\\text{Na}^+$ và $\\text{Cl}^-$ hút nhau.'
    },
    mcq2: {
      source: 'KHTN 7 · Đơn chất – Hợp chất',
      question: 'Trong các chất: $\\text{O}_3, \\text{Cu}, \\text{CaCO}_3, \\text{N}_2$. Có bao nhiêu ĐƠN CHẤT?',
      options: ['A. $1$', 'B. $2$', 'C. $3$', 'D. $4$'],
      correctIndex: 2,
      explanation: '$\\text{O}_3$ (chỉ gồm O), $\\text{Cu}$ (chỉ gồm Cu), $\\text{N}_2$ (chỉ gồm N) là 3 đơn chất; $\\text{CaCO}_3$ là hợp chất.'
    },
    essay: {
      source: 'KHTN 7 · Khối lượng phân tử',
      question: 'Giải thích vì sao hợp chất $\\text{MgO}$ là chất rắn có nhiệt độ nóng chảy rất cao, còn $\\text{CO}_2$ là chất khí ở nhiệt độ thường?',
      hints: ['Dựa vào loại liên kết: $\\text{MgO}$ là tinh thể ion, $\\text{CO}_2$ là phân tử cộng hóa trị.'],
      solutionSteps: [
        '$\\text{MgO}$ cấu tạo từ kim loại Mg và phi kim O nên mang **liên kết ion** cực bền trong mạng tinh thể rắn, cần nhiệt độ rất cao mới phá vỡ được.',
        '$\\text{CO}_2$ tạo từ hai phi kim C và O bằng **liên kết cộng hóa trị**, tạo các phân tử rời rạc ít hút nhau nên dễ bay hơi thành khí ở nhiệt độ thường.'
      ],
      finalAnswer: '$\\text{MgO}$ có liên kết ion (rắn, $T_{\\text{nc}}$ cao); $\\text{CO}_2$ có liên kết cộng hóa trị (khí).'
    }
  }),
  makeChemLesson({
    id: 'chem-7-b5',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Hóa trị & Công thức hóa học',
    sourceTag: SRC_2018_7,
    lessonNumber: 5,
    title: 'Bài 5: Quy tắc Hóa trị, Lập Công thức Hóa học & Tính % Nguyên tố',
    subtitle: 'Mẹo đặt chéo lập CTHH trong 3 giây và công thức tính phần trăm khối lượng nguyên tố trong hợp chất',
    description:
      'Thành thạo quy tắc hóa trị $x \\cdot a = y \\cdot b$ để tự viết đúng công thức mọi oxide, muối, acid và tính phần trăm khối lượng các nguyên tố (ứng dụng tính đạm trong phân bón).',
    theory1Heading: '1. Quy tắc Hóa trị & Mẹo đặt chéo cực nhanh',
    theory1:
      '• Chọn hóa trị **H bằng I**, **O bằng II** làm chuẩn. Nhóm hay gặp: $\\text{OH (I)}, \\text{NO}_3\\text{ (I)}, \\text{SO}_4\\text{ (II)}, \\text{CO}_3\\text{ (II)}, \\text{PO}_4\\text{ (III)}$.\n• Trong hợp chất $A_x^a B_y^b$, luôn có: **$x \\cdot a = y \\cdot b$**.\n• **Mẹo đặt chéo**: Chuyển hóa trị của A thành chỉ số của B, hóa trị của B thành chỉ số của A, rồi rút gọn tối giản.',
    theory2Heading: '2. Tính phần trăm khối lượng nguyên tố trong hợp chất',
    theory2:
      '• Muốn biết trong phân bón hay quặng chứa bao nhiêu % nguyên tố quý:\n  $$\\%A = \\frac{x \\cdot M_A}{M_{\\text{hợp chất}}} \\cdot 100\\%$$',
    keyFormulas: [
      'x \\cdot a = y \\cdot b \\quad (\\text{Quy tắc hóa trị})',
      '\\%A = \\frac{x \\cdot M_A}{M_{\\text{hợp chất}}} \\cdot 100\\%'
    ],
    sim2d: 'bohr_shells_2d',
    sim3d: 'ionic_covalent_3d',
    mcq1: {
      source: 'KHTN 7 · Lập CTHH',
      question: 'Công thức hóa học đúng của hợp chất tạo bởi Aluminum ($\text{Al}$ hóa trị III) và nhóm Sulfate ($\text{SO}_4$ hóa trị II) là:',
      options: ['A. $\\text{AlSO}_4$', 'B. $\\text{Al}_2(\\text{SO}_4)_3$', 'C. $\\text{Al}_3(\\text{SO}_4)_2$', 'D. $\\text{Al}_2\\text{SO}_4$'],
      correctIndex: 1,
      explanation: 'Đặt chéo hóa trị III của Al và II của $\\text{SO}_4$ được $\\text{Al}_2(\\text{SO}_4)_3$.'
    },
    mcq2: {
      source: 'KHTN 7 · Tìm hóa trị',
      question: 'Trong phân tử $\\text{Fe}_2\\text{O}_3$ (với O hóa trị II), hóa trị của Iron ($\text{Fe}$) là:',
      options: ['A. I', 'B. II', 'C. III', 'D. IV'],
      correctIndex: 2,
      explanation: '$2 \\cdot a = 3 \\cdot \\text{II} = 6 \\implies a = \\text{III}$.'
    },
    essay: {
      source: 'KHTN 7 · % Nguyên tố',
      question: 'Tính phần trăm khối lượng của nguyên tố Nitrogen ($\\text{N}$) trong phân đạm Urea có công thức $(\\text{NH}_2)_2\\text{CO}$ (cho $\\text{N}=14, \\text{H}=1, \\text{C}=12, \\text{O}=16$).',
      hints: ['Trong 1 phân tử $(\\text{NH}_2)_2\\text{CO}$ có $2$ nguyên tử N, $4$ nguyên tử H, $1$ C, $1$ O.'],
      solutionSteps: [
        'Khối lượng phân tử Urea: $M = 2 \\cdot (14 + 2 \\cdot 1) + 12 + 16 = 32 + 12 + 16 = 60\\text{ amu}$.',
        'Khối lượng của Nitrogen: $m_{\\text{N}} = 2 \\cdot 14 = 28\\text{ amu}$.',
        'Phần trăm N: $\\%\\text{N} = \\frac{28}{60} \\cdot 100\\% \\approx 46{,}67\\%$.'
      ],
      finalAnswer: '$\\approx 46{,}67\\%$.'
    }
  }),

  // ==========================================================================
  // LỚP 8 — GDPT 2018 (KHTN 8 · 6 BÀI TOÀN CHƯƠNG PHẢN ỨNG – MOL – ACID BASE MUỐI)
  // ==========================================================================
  makeChemLesson({
    id: 'chem-8-b1',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Phản ứng hóa học',
    sourceTag: SRC_2018_8,
    lessonNumber: 1,
    title: 'Bài 1: Biến đổi Vật lí vs Biến đổi Hóa học & Năng lượng Phản ứng',
    subtitle: 'Dấu hiệu nhận biết chất mới sinh ra, bản chất bẻ gãy – hình thành liên kết và phản ứng Tỏa nhiệt vs Thu nhiệt',
    description:
      'Phân biệt chính xác đâu là biến đổi vật lí (giữ nguyên chất) và biến đổi hóa học (sinh ra chất mới), kèm nhận biết phản ứng tỏa nhiệt (nóng lên) và thu nhiệt (lạnh đi).',
    theory1Heading: '1. Biến đổi Vật lí vs Biến đổi Hóa học',
    theory1:
      '• **Biến đổi vật lí**: Chỉ thay đổi hình dạng, kích thước hoặc thể (cắt giấy, uốn sắt, nước bay hơi) — **KHÔNG sinh ra chất mới**.\n• **Biến đổi hóa học (Phản ứng hóa học)**: Liên kết cũ đứt ra, hình thành liên kết mới tạo **CHẤT MỚI** (có mùi mới, đổi màu, sủi bọt khí, kết tủa hoặc phát sáng/tỏa nhiệt).',
    theory2Heading: '2. Phản ứng Tỏa nhiệt & Phản ứng Thu nhiệt',
    theory2:
      '• **Phản ứng tỏa nhiệt**: Giải phóng nhiệt ra môi trường làm cốc nóng lên (đốt than, tôi vôi sống $\\text{CaO} + \\text{H}_2\\text{O}$).\n• **Phản ứng thu nhiệt**: Hấp thụ nhiệt từ môi trường làm bình lạnh đi (nhiệt phân đá vôi $\\text{CaCO}_3$, viên C sủi tan trong nước).',
    keyFormulas: [
      '\\text{Chất tham gia (Chất đầu)} \\longrightarrow \\text{Chất sản phẩm}'
    ],
    sim2d: 'reaction_kinetics_2d',
    sim3d: 'activation_surface_3d',
    mcq1: {
      source: 'KHTN 8 · Biến đổi hóa học',
      question: 'Quá trình nào sau đây là BIẾN ĐỔI HÓA HỌC?',
      options: [
        'A. Hòa tan muối ăn vào nước',
        'B. Cơm để lâu ngày bị ôi thiu chua',
        'C. Đun nước lỏng bay hơi thành hơi nước',
        'D. Bẻ cong một thanh đồng'
      ],
      correctIndex: 1,
      explanation: 'Cơm bị ôi thiu là quá trình lên men biến tinh bột thành axit và chất mới có mùi chua.'
    },
    mcq2: {
      source: 'KHTN 8 · Năng lượng phản ứng',
      question: 'Trong phản ứng hóa học, đại lượng nào luôn ĐƯỢC BẢO TOÀN (giữ nguyên trước và sau phản ứng)?',
      options: ['A. Số lượng phân tử', 'B. Số lượng nguyên tử của mỗi nguyên tố', 'C. Thể tích chất khí', 'D. Màu sắc chất'],
      correctIndex: 1,
      explanation: 'Phản ứng chỉ thay đổi liên kết giữa các nguyên tử; số nguyên tử mỗi nguyên tố luôn giữ nguyên.'
    },
    essay: {
      source: 'KHTN 8 · Đốt nến',
      question: 'Khi thắp một cây nến bằng sáp paraffin đang cháy, hãy chỉ ra 1 quá trình biến đổi vật lí và 1 quá trình biến đổi hóa học diễn ra đồng thời.',
      hints: ['Sáp chảy lỏng rồi đông lại vs hơi sáp cháy cùng Oxygen tạo $\\text{CO}_2$ và $\\text{H}_2\\text{O}$.'],
      solutionSteps: [
        'Biến đổi vật lí: Sáp nến gặp nóng chảy lỏng chảy xuống thân nến rồi nguội đông đặc lại (vẫn là sáp).',
        'Biến đổi hóa học: Hơi sáp cháy tác dụng với Oxygen trong không khí tạo khí $\\text{CO}_2$ và hơi nước, tỏa nhiệt phát sáng.'
      ],
      finalAnswer: 'Vật lí: sáp nóng chảy; Hóa học: sáp cháy thành $\\text{CO}_2 + \\text{H}_2\\text{O}$.'
    }
  }),
  makeChemLesson({
    id: 'chem-8-b2',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Bảo toàn khối lượng & PTHH',
    sourceTag: SRC_2018_8,
    lessonNumber: 2,
    title: 'Bài 2: Định luật Bảo toàn Khối lượng & Lập Phương trình Hóa học',
    subtitle: 'Viết công thức m_trước = m_sau khi đốt/nung có khí bay đi và mẹo cân bằng PTHH 3 bước không bao giờ sai',
    description:
      'Làm chủ hai công cụ cốt lõi nhất của mọi bài toán Hóa học: Định luật Bảo toàn Khối lượng và kĩ năng cân bằng Phương trình Hóa học nhanh gọn.',
    theory1Heading: '1. Định luật Bảo toàn Khối lượng (BTKL)',
    theory1:
      '• Trong một phản ứng hóa học, **tổng khối lượng các chất sản phẩm bằng tổng khối lượng các chất tham gia**:\n  $$m_A + m_B = m_C + m_D$$\n• Chú ý: Nếu phản ứng trong bình hở có khí $O_2$ chui vào (như nung đồng nặng thêm) hoặc khí $CO_2$ thoát ra (như nung đá vôi nhẹ đi) thì vẫn phải tính cả khối lượng chất khí đó!',
    theory2Heading: '2. Ba bước lập Phương trình Hóa học (PTHH)',
    theory2:
      '• **Bước 1**: Viết sơ đồ phản ứng bằng công thức hóa học đúng.\n• **Bước 2**: Cân bằng số nguyên tử mỗi nguyên tố ở hai vế bằng cách **thêm HỆ SỐ trước công thức** (tuyệt đối KHÔNG sửa chỉ số chân!).\n• **Bước 3**: Thay mũi tên nét liền thành PTHH hoàn chỉnh và đọc tỉ lệ số nguyên tử/phân tử.',
    keyFormulas: [
      '\\sum m_{\\text{tham gia}} = \\sum m_{\\text{sản phẩm}}',
      'aA + bB \\longrightarrow cC + dD'
    ],
    sim2d: 'mass_conservation_2d',
    sim3d: 'mass_balance_3d',
    mcq1: {
      source: 'KHTN 8 · Bảo toàn khối lượng',
      question: 'Nung nóng hoàn toàn $10\\text{ g}$ đá vôi ($\\text{CaCO}_3$) thu được $5{,}6\\text{ g}$ vôi sống ($\\text{CaO}$) và khí $\\text{CO}_2$ bay ra. Khối lượng khí $\\text{CO}_2$ thu được là:',
      options: ['A. $15{,}6\\text{ g}$', 'B. $4{,}4\\text{ g}$', 'C. $5{,}6\\text{ g}$', 'D. $10\\text{ g}$'],
      correctIndex: 1,
      explanation: '$m_{\\text{CO}_2} = m_{\\text{CaCO}_3} - m_{\\text{CaO}} = 10 - 5{,}6 = 4{,}4\\text{ g}$.'
    },
    mcq2: {
      source: 'KHTN 8 · Cân bằng PTHH',
      question: 'Bộ hệ số cân bằng đúng theo thứ tự cho sơ đồ $\\text{Fe} + \\text{O}_2 \\xrightarrow{t^\\circ} \\text{Fe}_3\\text{O}_4$ là:',
      options: ['A. $1, 1, 1$', 'B. $3, 2, 1$', 'C. $2, 3, 1$', 'D. $4, 3, 2$'],
      correctIndex: 1,
      explanation: '$3\\text{Fe} + 2\\text{O}_2 \\xrightarrow{t^\\circ} \\text{Fe}_3\\text{O}_4$ (cả 2 vế đều có $3\\text{ Fe}$ và $4\\text{ O}$).'
    },
    essay: {
      source: 'KHTN 8 · Cân bằng PTHH',
      question: 'Lập phương trình hóa học cho 2 sơ đồ sau và nêu tỉ lệ số phân tử/nguyên tử giữa các chất:\n(a) $\\text{Al} + \\text{O}_2 \\xrightarrow{t^\\circ} \\text{Al}_2\\text{O}_3$\n(b) $\\text{Fe}_2\\text{O}_3 + \\text{CO} \\xrightarrow{t^\\circ} \\text{Fe} + \\text{CO}_2$',
      hints: ['(a) Làm chẵn Oxi bằng 2 trước $\\text{Al}_2\\text{O}_3$; (b) Đặt 3 trước CO và $\\text{CO}_2$.'],
      solutionSteps: [
        '(a) $4\\text{Al} + 3\\text{O}_2 \\xrightarrow{t^\\circ} 2\\text{Al}_2\\text{O}_3$. Tỉ lệ $4 : 3 : 2$.',
        '(b) $\\text{Fe}_2\\text{O}_3 + 3\\text{CO} \\xrightarrow{t^\\circ} 2\\text{Fe} + 3\\text{CO}_2$. Tỉ lệ $1 : 3 : 2 : 3$.'
      ],
      finalAnswer: '(a) $4:3:2$; (b) $1:3:2:3$.'
    }
  }),
  makeChemLesson({
    id: 'chem-8-b3',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Mol & Tỉ khối chất khí',
    sourceTag: SRC_2018_8,
    lessonNumber: 3,
    title: 'Bài 3: Mol, Khối lượng mol ($M$), Thể tích khí ĐKC ($24{,}79\\text{ L}$) & Tính theo PTHH',
    subtitle: 'Trọn bộ 4 công thức chuyển đổi mol – khối lượng – thể tích khí chuẩn 2018 (24,79 L/mol) và hiệu suất phản ứng',
    description:
      'Nắm vững "đồng tiền chung" của Hóa học là **Mol** ($1\\text{ mol} = 6{,}022\\cdot 10^{23}$ hạt) và công thức tính nhanh thể tích khí ở điều kiện chuẩn $25^\\circ\\text{C}, 1\\text{ bar}$ ($24{,}79\\text{ L/mol}$).',
    theory1Heading: '1. Mol, Khối lượng mol ($M$) & Thể tích khí ĐKC ($24{,}79\\text{ L}$)',
    theory1:
      '• **1 mol** chứa $6{,}022 \\cdot 10^{23}$ nguyên tử/phân tử.\n• **Khối lượng mol ($M$, g/mol)** có trị số bằng khối lượng phân tử tính bằng amu ($M_{\\text{H}_2\\text{O}} = 18\\text{ g/mol}$).\n• Ở điều kiện chuẩn GDPT 2018 ($25^\\circ\\text{C}, 1\\text{ bar}$): **$V_{\\text{khí}} = 24{,}79 \\cdot n$**.',
    theory2Heading: '2. Tỉ khối khí & Bài toán 3 bước tính theo PTHH',
    theory2:
      '• **Tỉ khối**: $d_{A/B} = \\frac{M_A}{M_B}$; so với không khí ($M_{\\text{kk}} \\approx 29$): $d_{A/\\text{kk}} = \\frac{M_A}{29}$ (lớn hơn $1$ thì nặng hơn không khí).\n• **Tính theo PTHH**: (1) Đổi dữ kiện ra số mol $n$ $\\to$ (2) Nhân chéo hệ số PTHH tìm mol chất cần $\\to$ (3) Đổi ra gam $m$ hoặc lít $V$.',
    keyFormulas: [
      'n = \\frac{m}{M} \\iff m = n \\cdot M; \\quad n_{\\text{ĐKC}} = \\frac{V}{24{,}79}',
      'd_{A/B} = \\frac{M_A}{M_B}; \\quad d_{A/\\text{kk}} = \\frac{M_A}{29}; \\quad H\\% = \\frac{m_{\\text{thực tế}}}{m_{\\text{lí thuyết}}} \\cdot 100\\%'
    ],
    sim2d: 'stoichiometry_gas_2d',
    sim3d: 'equilibrium_piston_3d',
    mcq1: {
      source: 'KHTN 8 · Thể tích khí ĐKC',
      question: 'Ở điều kiện chuẩn ($25^\\circ\\text{C}, 1\\text{ bar}$), $0{,}4\\text{ mol}$ khí $\\text{H}_2$ chiếm thể tích bao nhiêu lít?',
      options: ['A. $8{,}96\\text{ lít}$', 'B. $9{,}916\\text{ lít}$', 'C. $12{,}395\\text{ lít}$', 'D. $24{,}79\\text{ lít}$'],
      correctIndex: 1,
      explanation: '$V = 0{,}4 \\cdot 24{,}79 = 9{,}916\\text{ lít}$.'
    },
    mcq2: {
      source: 'KHTN 8 · Tỉ khối khí',
      question: 'Khí nào sau đây NHẸ hơn không khí ($M_{\\text{kk}} = 29$)?',
      options: ['A. $\\text{CO}_2$ ($44$)', 'B. $\\text{O}_2$ ($32$)', 'C. $\\text{CH}_4$ ($16$)', 'D. $\\text{SO}_2$ ($64$)'],
      correctIndex: 2,
      explanation: '$M_{\\text{CH}_4} = 16 < 29$ nên khí methane nhẹ hơn không khí và bay lên cao.'
    },
    essay: {
      source: 'KHTN 8 · Tính theo PTHH',
      question: 'Cho $4{,}8\\text{ g}$ Magnesium ($\text{Mg} = 24$) tác dụng hoàn toàn với dung dịch HCl dư theo PTHH: $\\text{Mg} + 2\\text{HCl} \\to \\text{MgCl}_2 + \\text{H}_2\\uparrow$. Tính khối lượng muối $\\text{MgCl}_2$ tạo thành và thể tích khí $\\text{H}_2$ thu được ở ĐKC ($\text{Cl} = 35{,}5$).',
      hints: ['Tính $n_{\\text{Mg}} = 4{,}8 / 24 = 0{,}2\\text{ mol}$.'],
      solutionSteps: [
        'Số mol Mg: $n_{\\text{Mg}} = \\frac{4{,}8}{24} = 0{,}2\\text{ mol}$.',
        'Theo PTHH: $n_{\\text{MgCl}_2} = n_{\\text{H}_2} = 0{,}2\\text{ mol}$.',
        'Khối lượng $\\text{MgCl}_2$: $m = 0{,}2 \\cdot (24 + 2 \\cdot 35{,}5) = 0{,}2 \\cdot 95 = 19\\text{ g}$.',
        'Thể tích $\\text{H}_2$ (ĐKC): $V = 0{,}2 \\cdot 24{,}79 = 4{,}958\\text{ lít}$.'
      ],
      finalAnswer: '$m_{\\text{MgCl}_2} = 19\\text{ g}$; $V_{\\text{H}_2} = 4{,}958\\text{ lít}$.'
    }
  }),
  makeChemLesson({
    id: 'chem-8-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Dung dịch & Tốc độ phản ứng',
    sourceTag: SRC_2018_8,
    lessonNumber: 4,
    title: 'Bài 4: Dung dịch, Độ tan, Nồng độ $C\\% - C_M$ & Tốc độ Phản ứng',
    subtitle: 'Tính nồng độ phần trăm, nồng độ mol pha chế dung dịch và 4 yếu tố tăng tốc độ phản ứng + Chất xúc tác',
    description:
      'Hiểu rõ độ tan $S$ (bão hòa vs chưa bão hòa), công thức $C\\%$ và $C_M$ ứng dụng pha nước muối sinh lí 0,9%, kèm thí nghiệm 4 yếu tố điều khiển tốc độ phản ứng.',
    theory1Heading: '1. Độ tan ($S$), Nồng độ phần trăm ($C\\%$) & Nồng độ mol ($C_M$)',
    theory1:
      '• **Độ tan ($S$)**: Số gam chất tan tan tối đa trong $100\\text{ g}$ nước để thành dung dịch bão hòa.\n• **$C\\% = \\frac{m_{\\text{ct}}}{m_{\\text{dd}}} \\cdot 100\\%$** (với $m_{\\text{dd}} = m_{\\text{chất tan}} + m_{\\text{nước}}$).\n• **$C_M = \\frac{n}{V_{\\text{dd (lít)}}}$** (đơn vị mol/L hay $\\text{M}$).',
    theory2Heading: '2. Năm yếu tố ảnh hưởng Tốc độ Phản ứng',
    theory2:
      '• Phản ứng chạy **NHANH HƠN** khi: (1) **Tăng nồng độ**, (2) **Tăng nhiệt độ**, (3) **Tăng áp suất** (với chất khí), (4) **Tăng diện tích bề mặt** (nghiền mịn chất rắn), (5) Dùng **Chất xúc tác** (tăng tốc nhưng không bị tiêu hao sau phản ứng).',
    keyFormulas: [
      'C\\% = \\frac{m_{\\text{ct}}}{m_{\\text{dd}}} \\cdot 100\\%, \\quad C_M = \\frac{n}{V_{\\text{lít}}}',
      'm_{\\text{dd}} = m_{\\text{ct}} + m_{\\text{dm}}'
    ],
    sim2d: 'solution_solubility_2d',
    sim3d: 'solution_mixing_3d',
    mcq1: {
      source: 'KHTN 8 · Dung dịch',
      question: 'Để pha $1000\\text{ g}$ nước muối sinh lí có nồng độ $0{,}9\\%$, cần cân bao nhiêu gam muối ăn nguyên chất hòa tan vào nước?',
      options: ['A. $0{,}9\\text{ g}$', 'B. $9\\text{ g}$', 'C. $90\\text{ g}$', 'D. $18\\text{ g}$'],
      correctIndex: 1,
      explanation: '$m_{\\text{ct}} = \\frac{1000 \\cdot 0{,}9}{100} = 9\\text{ g}$ muối hòa vào $991\\text{ g}$ nước.'
    },
    mcq2: {
      source: 'KHTN 8 · Tốc độ phản ứng',
      question: 'Tại sao người ta chẻ nhỏ thanh củi trước khi nhóm bếp lò giúp củi bén lửa và cháy nhanh hơn nhiều?',
      options: [
        'A. Làm giảm khối lượng củi',
        'B. Tăng diện tích bề mặt tiếp xúc với khí Oxygen',
        'C. Tăng nồng độ hơi nước',
        'D. Làm củi lạnh đi'
      ],
      correctIndex: 1,
      explanation: 'Chẻ nhỏ làm tăng mạnh diện tích tiếp xúc giữa gỗ và khí Oxygen trong không khí.'
    },
    essay: {
      source: 'KHTN 8 · Pha dung dịch',
      question: 'Hòa tan hết $11{,}7\\text{ g}$ muối $\\text{NaCl}$ ($M = 58{,}5$) vào nước để thu được đúng $400\\text{ ml}$ dung dịch. Tính nồng độ mol ($C_M$) của dung dịch thu được.',
      hints: ['Đổi $400\\text{ ml} = 0{,}4\\text{ lít}$, tính $n = 11{,}7 / 58{,}5 = 0{,}2\\text{ mol}$.'],
      solutionSteps: [
        'Số mol NaCl: $n = \\frac{11{,}7}{58{,}5} = 0{,}2\\text{ mol}$.',
        'Thể tích dung dịch: $V = 0{,}4\\text{ lít}$.',
        'Nồng độ mol: $C_M = \\frac{0{,}2}{0{,}4} = 0{,}5\\text{ M}$.'
      ],
      finalAnswer: '$0{,}5\\text{ M}$.'
    }
  }),
  makeChemLesson({
    id: 'chem-8-b5',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Acid – Base – Thang pH',
    sourceTag: SRC_2018_8,
    lessonNumber: 5,
    title: 'Bài 5: Acid – Base – Thang đo pH 0–14 & Chất chỉ thị màu',
    subtitle: 'Quỳ tím đỏ/xanh, Phenolphthalein hồng, phản ứng Acid tác dụng kim loại sinh H₂ và đo pH đất – nước',
    description:
      'Thực hành nhúng giấy quỳ tím, nhỏ phenolphthalein và nước bắp cải tím vào dung dịch acid – base – trung tính trên bàn thí nghiệm 2D và 3D.',
    theory1Heading: '1. Acid & Base là gì? Tính chất dễ nhận biết',
    theory1:
      '• **Acid** (trong dung dịch sinh ion $\\text{H}^+$): $\\text{HCl}, \\text{H}_2\\text{SO}_4, \\text{CH}_3\\text{COOH}$ (giấm). Làm **quỳ tím hóa ĐỎ**, tác dụng với kim loại đứng trước H ($\\text{Mg, Zn, Fe}$) sinh khí $\\text{H}_2\\uparrow$.\n• **Base tan / Kiềm** (sinh ion $\\text{OH}^-$): $\\text{NaOH}, \\text{KOH}, \\text{Ca(OH)}_2$. Làm **quỳ tím hóa XANH**, **phenolphthalein không màu hóa HỒNG**.',
    theory2Heading: '2. Thang pH 0–14 trong đời sống',
    theory2:
      '• **$\\text{pH} < 7$**: Môi trường **Acid** (càng gần $0$ càng chua/mạnh: dịch vị dạ dày $\\text{pH}\\approx 2$, chanh $\\text{pH}\\approx 2{,}4$).\n• **$\\text{pH} = 7$**: **Trung tính** (nước cất, dung dịch muối ăn).\n• **$\\text{pH} > 7$**: Môi trường **Base/Kiềm** (xà phòng $\\text{pH}\\approx 9$, nước vôi $\\text{pH}\\approx 12$).',
    keyFormulas: [
      '\\text{pH} < 7\\text{ (Acid: quỳ ĐỎ)} \\quad \\text{pH} = 7\\text{ (Trung tính)} \\quad \\text{pH} > 7\\text{ (Base: quỳ XANH)}',
      '\\text{Acid} + \\text{Kim loại (Zn, Fe, Mg)} \\longrightarrow \\text{Muối} + \\text{H}_2\\uparrow'
    ],
    sim2d: 'acid_base_oxide_2d',
    sim3d: 'indicator_bench_3d',
    mcq1: {
      source: 'KHTN 8 · Acid – Base',
      question: 'Nhỏ vài giọt dung dịch phenolphthalein không màu vào cốc đựng dung dịch $\\text{NaOH}$ loãng, dung dịch chuyển sang màu gì?',
      options: ['A. Đỏ tươi', 'B. Xanh lam', 'C. Hồng cánh sen', 'D. Không đổi màu'],
      correctIndex: 2,
      explanation: 'Dung dịch kiềm (Base tan như $\\text{NaOH}$) làm chất chỉ thị phenolphthalein hóa hồng.'
    },
    mcq2: {
      source: 'KHTN 8 · Thang pH',
      question: 'Đất trồng lúa ở một vùng bị nhiễm phèn chua đo được $\\text{pH} = 4{,}5$. Để khử chua cho đất, người nông dân thường bón chất nào?',
      options: ['A. Phân đạm chua', 'B. Vôi bột ($\\text{CaO}$ hoặc $\\text{Ca(OH)}_2$ có tính kiềm)', 'C. Giấm ăn', 'D. Nước muối'],
      correctIndex: 1,
      explanation: 'Vôi sống/vôi tôi có tính base (kiềm) giúp trung hòa lượng acid dư trong đất phèn.'
    },
    essay: {
      source: 'KHTN 8 · Nhận biết hóa chất',
      question: 'Có 3 lọ mất nhãn đựng riêng biệt 3 dung dịch trong suốt: $\\text{HCl}$, $\\text{NaOH}$ và $\\text{NaCl}$. Chỉ dùng giấy quỳ tím, hãy nêu cách nhận biết từng lọ.',
      hints: ['Lấy mẫu thử, nhúng 3 mẩu giấy quỳ tím vào 3 mẫu.'],
      solutionSteps: [
        'Trích mỗi lọ một ít làm mẫu thử đánh số.',
        'Nhúng giấy quỳ tím vào 3 mẫu:',
        '- Mẫu làm quỳ hóa **ĐỎ** là dung dịch acid $\\text{HCl}$.',
        '- Mẫu làm quỳ hóa **XANH** là dung dịch kiềm $\\text{NaOH}$.',
        '- Mẫu **không đổi màu** quỳ tím là muối trung tính $\\text{NaCl}$.'
      ],
      finalAnswer: 'Quỳ đỏ $\\to \\text{HCl}$; Quỳ xanh $\\to \\text{NaOH}$; Không đổi màu $\\to \\text{NaCl}$.'
    }
  }),
  makeChemLesson({
    id: 'chem-8-b6',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Oxide – Muối – Phân bón',
    sourceTag: SRC_2018_8,
    lessonNumber: 6,
    title: 'Bài 6: Oxide (Base – Acid), Muối & Phân bón Hóa học',
    subtitle: 'Phân loại 4 kiểu Oxide, tính chất Muối phản ứng Base/Acid/Muối và 3 loại phân bón N–P–K cho cây trồng',
    description:
      'Hoàn tất toàn bộ phần Hóa học KHTN 8: gọi tên Oxide theo hóa trị mới, phản ứng tạo kết tủa của Muối và vai trò của Phân đạm – Lân – Kali.',
    theory1Heading: '1. Bốn loại Oxide & Cách phân biệt dễ nhớ',
    theory1:
      '• **Oxide = Nguyên tố + Oxygen**.\n• **Oxide base** (của kim loại: $\\text{CaO, CuO, Fe}_2\\text{O}_3$): tác dụng với Acid $\\to$ Muối + Nước.\n• **Oxide acid** (của phi kim: $\\text{CO}_2, \\text{SO}_2, \\text{P}_2\\text{O}_5$): tác dụng với Base $\\to$ Muối + Nước.\n• Ngoài ra có **Oxide lưỡng tính** ($\\text{Al}_2\\text{O}_3, \\text{ZnO}$) và **Oxide trung tính** ($\\text{CO, NO}$).',
    theory2Heading: '2. Muối & Phân bón Hóa học (Đạm – Lân – Kali)',
    theory2:
      '• **Phản ứng trao đổi của Muối**: $\\text{Muối} + \\text{Acid/Base/Muối} \\to \\text{Chất mới}$ (điều kiện phải có **kết tủa** như $\\text{BaSO}_4\\downarrow, \\text{AgCl}\\downarrow$ hoặc **khí bay lên** như $\\text{CO}_2\\uparrow$).\n• **Phân bón N–P–K**: **Đạm (N)** giúp cây xanh tốt phát triển cành lá; **Lân (P)** kích thích ra rễ, nở hoa; **Kali (K)** giúp chắc hạt, ngọt quả, chống đổ ngã.',
    keyFormulas: [
      '\\text{Oxide base} + \\text{Acid} \\to \\text{Muối} + \\text{H}_2\\text{O}',
      '\\text{Oxide acid} + \\text{Base} \\to \\text{Muối} + \\text{H}_2\\text{O}'
    ],
    sim2d: 'acid_base_oxide_2d',
    sim3d: 'indicator_bench_3d',
    mcq1: {
      source: 'KHTN 8 · Oxide',
      question: 'Dãy nào sau đây toàn gồm các OXIDE ACID (tác dụng được với dung dịch kiềm tạo muối và nước)?',
      options: [
        'A. $\\text{CaO}, \\text{MgO}, \\text{CuO}$',
        'B. $\\text{CO}_2, \\text{SO}_2, \\text{P}_2\\text{O}_5$',
        'C. $\\text{CO}, \\text{NO}, \\text{Na}_2\\text{O}$',
        'D. $\\text{Fe}_2\\text{O}_3, \\text{SO}_3, \\text{K}_2\\text{O}$'
      ],
      correctIndex: 1,
      explanation: '$\\text{CO}_2, \\text{SO}_2, \\text{P}_2\\text{O}_5$ đều là oxide của phi kim tương ứng với các acid.'
    },
    mcq2: {
      source: 'KHTN 8 · Phân bón',
      question: 'Bón loại phân nào giúp cây trồng tăng tổng hợp tinh bột/đường làm quả ngọt, chắc hạt và chống rét tốt?',
      options: ['A. Phân đạm (N)', 'B. Phân lân (P)', 'C. Phân kali (K)', 'D. Vôi sống'],
      correctIndex: 2,
      explanation: 'Phân Kali ($\\text{KCl}, \\text{K}_2\\text{SO}_4$) thúc đẩy vận chuyển đường/tinh bột, tăng độ ngọt và chống chịu.'
    },
    essay: {
      source: 'KHTN 8 · Viết PTHH',
      question: 'Hoàn thành các phương trình hóa học sau:\n(a) $\\text{CuO} + \\text{H}_2\\text{SO}_4 \\to ...$\n(b) $\\text{CO}_2 + \\text{Ca(OH)}_2 \\to \\text{CaCO}_3\\downarrow + ...$',
      hints: ['Oxide base + Acid ra Muối + Nước; Oxide acid + Base ra Muối + Nước.'],
      solutionSteps: [
        '(a) $\\text{CuO} + \\text{H}_2\\text{SO}_4 \\to \\text{CuSO}_4 + \\text{H}_2\\text{O}$ (dung dịch xanh lam).',
        '(b) $\\text{CO}_2 + \\text{Ca(OH)}_2 \\to \\text{CaCO}_3\\downarrow + \\text{H}_2\\text{O}$ (làm đục nước vôi trong).'
      ],
      finalAnswer: '(a) $\\text{CuSO}_4 + \\text{H}_2\\text{O}$; (b) $\\text{H}_2\\text{O}$.'
    }
  })
];
