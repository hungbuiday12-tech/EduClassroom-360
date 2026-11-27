import { BiologyLesson } from '../types';
import { makeBioLesson } from './biologyGdpt2018Lessons';

const SRC_2006_6 = 'GDPT 2006 · SGK Sinh học 6';
const SRC_2006_7 = 'GDPT 2006 · SGK Sinh học 7';
const SRC_2006_8 = 'GDPT 2006 · SGK Sinh học 8';

export const BIOLOGY_MS_2006_LESSONS: BiologyLesson[] = [
  // ==========================================================================
  // LỚP 6 — GDPT 2006 (SGK SINH HỌC 6 · 6 BÀI THỰC VẬT HỌC)
  // ==========================================================================
  makeBioLesson({
    id: 'bio-2006-6-1',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · SGK Sinh 6 (Tế bào & Rễ cây)',
    sourceTag: SRC_2006_6,
    lessonNumber: 1,
    title: 'Bài 1 (SGK Sinh 6 2006): Tế bào Thực vật & Các loại Rễ – Miền hút Lông hút',
    subtitle: 'Cấu tạo vách tế bào biểu bì vảy hành, phân biệt rễ cọc vs rễ chùm và cơ chế hút nước của lông hút',
    description:
      'Mở đầu SGK Sinh học 6 (2006): bóc lớp biểu bì vảy hành soi kính hiển vi, phân chia 4 miền của rễ và hiểu chức năng hút nước của lông hút.',
    theory1Heading: '1. Cấu tạo Tế bào Thực vật & Sự phân chia Mô',
    theory1:
      '• Tế bào thực vật gồm: **Vách tế bào** cứng, **Màng sinh chất**, **Chất tế bào**, **Nhân**, **Không bào** và **Lục lạp**.\n• Tế bào lớn lên và phân chia tại **mô phân sinh** giúp cây tăng kích thước.',
    theory2Heading: '2. Hai loại Rễ & Bốn miền của Rễ',
    theory2:
      '• **Rễ cọc** (cây bưởi, mít, cải) có $1$ rễ cái to đâm sâu và nhiều rễ con; **Rễ chùm** (lúa, ngô, hành) gồm nhiều rễ con mọc tỏa đều từ gốc thân.\n• Đầu rễ có $4$ miền: **Miền trưởng thành** (dẫn truyền), **Miền hút** (mang **lông hút** hút nước và muối khoáng), **Miền sinh trưởng** (làm rễ dài ra), **Chóp rễ** (che chở đầu rễ).',
    keyFormulas: [
      '\\text{Lông hút} \\to \\text{Biểu bì} \\to \\text{Vỏ} \\to \\text{Mạch gỗ (Rễ} \\to \\text{Thân} \\to \\text{Lá)}'
    ],
    sim2d: 'microscope_cell_compare_2d',
    sim3d: 'eukaryotic_cell_3d',
    mcq1: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Miền nào của rễ giữ vai trò quan trọng nhất trong việc hấp thụ nước và muối khoáng hòa tan?',
      options: ['A. Chóp rễ', 'B. Miền sinh trưởng', 'C. Miền hút (nhờ các tế bào lông hút)', 'D. Miền trưởng thành'],
      correctIndex: 2,
      explanation: 'Miền hút mang hàng ngàn lông hút có thành mỏng và không bào lớn để hút nước, muối khoáng.'
    },
    mcq2: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Cặp cây nào sau đây đều có RỄ CHÙM?',
      options: ['A. Cây mít và cây nhãn', 'B. Cây lúa và cây hành', 'C. Cây bưởi và cây cải', 'D. Cây đậu xanh và cây phượng'],
      correctIndex: 1,
      explanation: 'Lúa, ngô, hành, tỏi, cỏ là cây một lá mầm có bộ rễ chùm.'
    },
    essay: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Kể tên $2$ loại rễ biến dạng phổ biến và cho biết chức năng thích nghi của chúng với môi trường.',
      hints: ['Rễ củ (cà rốt, sắn), Rễ móc (trầu không), Rễ giác mút (tơ hồng), Rễ thở (bụt mọc, mắm).'],
      solutionSteps: [
        '1. **Rễ củ** (cà rốt, củ cải, khoai lang): phình to chứa chất dự trữ giúp cây sống qua mùa khô/ra hoa.',
        '2. **Rễ thở** (cây mắm, cây bần vùng ngập mặn): mọc ngược lên mặt bùn lấy Oxi giúp rễ hô hấp khi đất ngập nước.'
      ],
      finalAnswer: 'Rễ củ dự trữ chất dinh dưỡng; Rễ thở giúp lấy không khí nơi ngập bùn.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-6-2',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · SGK Sinh 6 (Thân cây)',
    sourceTag: SRC_2006_6,
    lessonNumber: 2,
    title: 'Bài 2 (SGK Sinh 6 2006): Thân cây – Mạch gỗ, Mạch rây & Sinh trưởng của Thân',
    subtitle: 'Vì sao bấm ngọn cho cây ra nhiều cành, đếm vòng gỗ hằng năm tính tuổi cây và thí nghiệm bóc vỏ khoanh thân',
    description:
      'Tìm hiểu cấu tạo trong của thân non, thân gỗ lâu năm và dòng vận chuyển hai chiều qua bó mạch gỗ – mạch rây.',
    theory1Heading: '1. Thân dài ra và To ra như thế nào?',
    theory1:
      '• Thân dài ra do sự phân chia tế bào ở **mô phân sinh ngọn** (khi trồng bí, mướp hay hoa cúc, người ta **bấm ngọn** để cây đâm nhiều chồi nhánh cho nhiều quả/hoa; còn trồng cây lấy gỗ thẳng cao thì **tỉa cành**).\n• Thân cây gỗ to ra nhờ **tầng sinh vỏ** và **tầng sinh trụ**; mỗi năm tạo thêm một vòng gỗ sáng–tối giúp đếm tuổi cây.',
    theory2Heading: '2. Vận chuyển chất trong Thân: Mạch gỗ vs Mạch rây',
    theory2:
      '• **Mạch gỗ** (nằm bên trong): gồm tế bào hóa gỗ dẫn **Nước và Muối khoáng** từ rễ lên lá.\n• **Mạch rây** (nằm ở lớp vỏ bên ngoài): gồm tế bào sống dẫn **Chất hữu cơ** từ lá đi nuôi các cơ quan và tích vào củ/rễ.',
    keyFormulas: [
      '\\text{Bóc vỏ (cắt mạch rây)} \\implies \\text{Ứ chất hữu cơ ở mép trên vết cắt}'
    ],
    sim2d: 'plant_transpiration_2d',
    sim3d: 'plant_vascular_3d',
    mcq1: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Tại sao khi bóc một khoanh vỏ ở thân cây (lấy đi lớp mạch rây), phần mép vỏ PHÍA TRÊN vết cắt thường phình to ra?',
      options: [
        'A. Nước từ rễ lên bị ứ lại',
        'B. Chất hữu cơ do lá chế tạo đi xuống qua mạch rây bị chặn ứ đọng lại tại mép trên',
        'C. Cây mọc thêm rễ mới ở ngọn',
        'D. Ánh nắng làm vỏ cây nở ra'
      ],
      correctIndex: 1,
      explanation: 'Mạch rây nằm ở phần vỏ chuyển chất hữu cơ từ lá xuống; cắt đứt mạch rây làm chất hữu cơ tích tụ ở mép trên vết cắt (ứng dụng làm chiết cành!).'
    },
    mcq2: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Trồng cây lấy gỗ như bạch đàn, lim người lâm nghiệp hay chặt tỉa bớt cành xấu mà giữ lại ngọn chính nhằm:',
      options: [
        'A. Tập trung dinh dưỡng nuôi ngọn mọc thẳng, cao và tạo thân gỗ dài không mắt',
        'B. Làm cây lùn đi',
        'C. Để cây không quang hợp',
        'D. Cho cây biến thành thân cỏ'
      ],
      correctIndex: 0,
      explanation: 'Giữ chồi ngọn và tỉa cành giúp cây dồn chất nuôi thân chính vươn thẳng đứng.'
    },
    essay: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Nêu $2$ loại thân biến dạng quen thuộc dùng làm lương thực/thực phẩm trong bếp gia đình hằng ngày và giải thích cách nhận biết chúng là thân chứ không phải rễ.',
      hints: ['Khoai tây, gừng, hành tây là thân củ / thân rễ vì có mắt (chồi nách) mọc mầm.'],
      solutionSteps: [
        '1. **Thân củ** (củ khoai tây, su hào): nằm dưới/trên mặt đất, phình to chứa tinh bột nhưng trên bề mặt có các mắt chồi nách mọc mầm thành cành lá.',
        '2. **Thân rễ** (củ gừng, củ riềng, nghệ): mọc bò ngang trong đất có đốt và vảy lá nhỏ.'
      ],
      finalAnswer: 'Khoai tây (thân củ) và gừng/nghệ (thân rễ) đều có mắt chồi.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-6-3',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · SGK Sinh 6 (Lá cây)',
    sourceTag: SRC_2006_6,
    lessonNumber: 3,
    title: 'Bài 3 (SGK Sinh 6 2006): Lá cây — Quang hợp, Hô hấp & Thoát hơi nước qua Khí khổng',
    subtitle: 'Thí nghiệm thử tinh bột bằng dung dịch Iốt, phân biệt lá cây ưa nắng vs ưa bóng và điều tiết đóng mở khí khổng',
    description:
      'Làm chủ Chương IV Lá cây SGK Sinh học 6 (2006): chứng minh lá tạo tinh bột ngoài ánh sáng, nhả khí Oxi và thoát hơi nước qua khí khổng.',
    theory1Heading: '1. Quang hợp (Ban ngày) & Thí nghiệm dung dịch Iốt',
    theory1:
      '• Lá xanh sử dụng chất diệp lục hấp thụ ánh sáng biến **Nước + Khí Cacbonic ($\\text{CO}_2$)** thành **Tinh bột + Khí Oxi ($\\text{O}_2$)**.\n• **Thí nghiệm kinh điển**: Bịt băng đen một phần lá cây rồi đặt ngoài nắng; sau đó tẩy diệp lục bằng cồn đun nóng và nhỏ **dung dịch Iốt**: phần được chiếu sáng hóa **màu xanh tím** (có tinh bột), phần bị bịt đen **không đổi màu**.',
    theory2Heading: '2. Hô hấp (Ngày đêm) & Thoát hơi nước qua Khí khổng',
    theory2:
      '• Cây xanh **hô hấp suốt ngày đêm** lấy $O_2$ và thải $CO_2$.\n• Hầu hết hơi nước thoát qua **lỗ khí khổng** (chủ yếu nằm ở mặt dưới lá), tạo lực hút kéo nước từ rễ lên và giữ lá mát không bị đốt cháy dưới nắng.',
    keyFormulas: [
      '\\text{Nước} + \\text{Khí Cacbonic} \\xrightarrow{\\text{Ánh sáng, Diệp lục}} \\text{Tinh bột} + \\text{Khí Oxi}',
      '\\text{Tinh bột} + \\text{Iốt} \\longrightarrow \\text{Màu xanh tím đặc trưng}'
    ],
    sim2d: 'photosynthesis_calvin_2d',
    sim3d: 'chloroplast_thylakoid_3d',
    mcq1: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Trong thí nghiệm chứng minh lá cây chế tạo tinh bột khi có ánh sáng, ta nhỏ hóa chất nào lên lá sau khi đã đun tẩy diệp lục?',
      options: ['A. Nước vôi trong', 'B. Dung dịch Iốt loãng (làm tinh bột hóa xanh tím)', 'C. Dung dịch muối ăn', 'D. Giấm ăn'],
      correctIndex: 1,
      explanation: 'Iốt gặp tinh bột tạo phức màu xanh tím đặc trưng.'
    },
    mcq2: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Tại sao đa số cây trên cạn có rất nhiều lỗ khí khổng tập trung ở mặt DƯỚI lá hơn mặt trên?',
      options: [
        'A. Để tránh ánh nắng trực tiếp chiếu thẳng làm cây thoát hơi nước quá mức gây héo và tránh bụi bịt lỗ khí',
        'B. Vì mặt trên không có tế bào',
        'C. Để hứng nhiều nước mưa hơn',
        'D. Vì rễ nằm ở dưới'
      ],
      correctIndex: 0,
      explanation: 'Mặt dưới lá mát hơn giúp cây điều tiết thoát hơi nước vừa đủ mà không bị héo giữa trưa nắng.'
    },
    essay: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Giải thích câu tục ngữ "Đêm tháng năm chưa nằm đã sáng..." không phải ý này — câu **"Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao"** và vai trò trồng cây xanh ven đường đô thị.',
      hints: ['Cây xanh quang hợp hút $\\text{CO}_2$, nhả $\\text{O}_2$, lọc bụi và làm dịu mát không khí qua thoát hơi nước.'],
      solutionSteps: [
        'Cây xanh hấp thụ khí $\\text{CO}_2$ và nhả ra khí $\\text{O}_2$ cân bằng dưỡng khí cho người dân.',
        'Tán lá cản bớt bụi mịn, giảm tiếng ồn giao thông và quá trình thoát hơi nước làm hạ nhiệt độ đường phố mùa hè.'
      ],
      finalAnswer: 'Điều hòa $\\text{O}_2/\\text{CO}_2$, cản bụi, giảm ồn và làm mát không khí.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-6-4',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · SGK Sinh 6 (Sinh sản sinh dưỡng & Hoa)',
    sourceTag: SRC_2006_6,
    lessonNumber: 4,
    title: 'Bài 4 (SGK Sinh 6 2006): Sinh sản Sinh dưỡng & Cấu tạo Hoa – Thụ phấn',
    subtitle: 'Giâm – chiết – ghép cành, cấu tạo 4 bộ phận hoa lưỡng tính và phân biệt hoa thụ phấn nhờ sâu bọ vs nhờ gió',
    description:
      'Học trọn phần Sinh sản Sinh dưỡng & Hoa (SGK Sinh 6 2006): cấu tạo nhị (chứa hạt phấn) – nhụy (chứa noãn) và cách hoa thu hút ong bướm hoặc nhờ gió bay xa.',
    theory1Heading: '1. Sinh sản Sinh dưỡng tự nhiên & nhân tạo',
    theory1:
      '• **Tự nhiên**: lá bỏng mọc chồi trên mép lá, khoai lang mọc từ thân củ, rau má mọc từ thân bò.\n• **Nhân tạo**: **Giâm cành** (sắn, mía, hoa hồng), **Chiết cành** (cam, chanh, bưởi), **Ghép mắt** (giữ tính trạng tốt trên gốc khỏe) và **Nhân giống vô tính trong ống nghiệm**.',
    theory2Heading: '2. Cấu tạo Hoa & Thụ phấn',
    theory2:
      '• Hoa có $4$ bộ phận chính: **Đài, Tràng (cánh hoa), Nhị** (gồm chỉ nhị + bao phấn chứa hạt phấn) và **Nhụy** (đầu nhụy, vòi nhụy, bầu nhụy chứa **noãn**).\n• **Hoa thụ phấn nhờ sâu bọ**: màu sắc rực rỡ, có hương thơm, mật ngọt, hạt phấn to có gai.\n• **Hoa thụ phấn nhờ gió** (lúa, ngô): hoa nhỏ màu nhạt, bao phấn treo lủng lẳng, hạt phấn cực nhiều và nhẹ.',
    keyFormulas: [
      '\\text{Hoa lưỡng tính: Có đủ Nhị (đực) + Nhụy (cái)} \\quad \\cdot \\quad \\text{Hoa đơn tính: Chỉ có Nhị hoặc Nhụy}'
    ],
    sim2d: 'plant_organs_flowering_2d',
    sim3d: 'plant_flower_seed_3d',
    mcq1: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Trong các hoa sau đây, hoa nào là HOA ĐƠN TÍNH (trên cùng một bông hoa chỉ có nhị hoặc chỉ có nhụy)?',
      options: ['A. Hoa bưởi', 'B. Hoa cải', 'C. Hoa mướp (hoa đực và hoa cái riêng trên cùng cây)', 'D. Hoa dâm bụt'],
      correctIndex: 2,
      explanation: 'Bầu, bí, mướp, dưa chuột, ngô có hoa đực riêng và hoa cái riêng nên gọi là hoa đơn tính.'
    },
    mcq2: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Đặc điểm nào giúp nhận biết ngay một loài hoa thụ phấn nhờ GIÓ (như hoa lúa, hoa ngô)?',
      options: [
        'A. Cánh hoa to sặc sỡ có mùi thơm ngát và tuyến mật lớn',
        'B. Hoa không có màu sắc sặc sỡ, cánh tiêu giảm, hạt phấn rất nhiều và nhẹ',
        'C. Hạt phấn có gai dính bết',
        'D. Nở vào ban đêm'
      ],
      correctIndex: 1,
      explanation: 'Hoa thụ phấn nhờ gió không cần thu hút ong bướm nên ít sặc sỡ, tập trung tạo lượng phấn cực nhẹ bay theo gió.'
    },
    essay: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Vì sao khi trồng cây ngô thành một dãy thưa thớt chỉ vài cây ở góc vườn thì bắp ngô thường bị thưa hạt (ít hạt), còn trồng thành ruộng rộng lại sai trĩu hạt?',
      hints: ['Cây ngô thụ phấn nhờ gió từ cờ ngô (hoa đực trên ngọn) bay rơi xuống râu ngô (hoa cái).'],
      solutionSteps: [
        'Ngô là cây thụ phấn chéo nhờ gió (hạt phấn từ hoa cờ trên ngọn rơi xuống râu bắp phía dưới).',
        'Nếu trồng quá thưa ít cây, gió thổi hạt phấn bay tản ra ngoài không rơi trúng đầu nhụy râu ngô nên tỉ lệ thụ phấn – đậu hạt thấp.'
      ],
      finalAnswer: 'Ngô thụ phấn nhờ gió nên trồng tập trung giúp hạt phấn dễ tiếp xúc râu ngô.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-6-5',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · SGK Sinh 6 (Quả & Hạt)',
    sourceTag: SRC_2006_6,
    lessonNumber: 5,
    title: 'Bài 5 (SGK Sinh 6 2006): Thụ tinh – Kết quả tạo Hạt & Điều kiện Nảy mầm của Hạt',
    subtitle: 'Phân biệt quả thịt vs quả khô, hạt 2 lá mầm vs 1 lá mầm và 4 điều kiện đủ cho hạt nảy mầm tốt',
    description:
      'Học Chương VII Quả và Hạt (SGK Sinh 6 2006): quá trình thụ tinh kép sơ lược, 3 cách phát tán quả/hạt (gió, động vật, tự phát tán) và thực hành ươm hạt.',
    theory1Heading: '1. Thụ tinh, Phân loại Quả & Cấu tạo Hạt',
    theory1:
      '• **Thụ tinh**: Tế bào sinh dục đực kết hợp tế bào sinh dục cái (trứng trong noãn) tạo **hợp tử** $\\to$ **Noãn thành Hạt**, **Bầu nhụy thành Quả**.\n• **Quả khô** (quả đậu tự nẻ, quả thóc không nẻ) và **Quả thịt** (quả mơ hạch cứng, quả cà chua mọng).\n• **Hạt 2 lá mầm** (đậu đen): chất dự trữ nằm ngay trong **2 lá mầm**; **Hạt 1 lá mầm** (ngô, lúa): chất dự trữ nằm trong **phôi nhũ**.',
    theory2Heading: '2. Phát tán & Điều kiện nảy mầm của Hạt',
    theory2:
      '• Hạt chỉ nảy mầm tốt khi hội đủ: **(1) Hạt chắc mẩy nguyên phôi, (2) Đủ nước ẩm, (3) Đủ không khí ($\text{O}_2$ hô hấp), (4) Nhiệt độ thích hợp**.',
    keyFormulas: [
      '\\text{Nảy mầm tốt} = \\text{Hạt tốt} + \\text{Nước} + \\text{Không khí (O}_2\\text{)} + \\text{Nhiệt độ ấm}'
    ],
    sim2d: 'plant_organs_flowering_2d',
    sim3d: 'plant_flower_seed_3d',
    mcq1: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Ở hạt Ngô (cây 1 lá mầm), chất dinh dưỡng dự trữ nuôi phôi khi mới nảy mầm nằm chủ yếu ở bộ phận nào?',
      options: ['A. Vỏ hạt', 'B. Hai lá mầm', 'C. Phôi nhũ', 'D. Thân mầm'],
      correctIndex: 2,
      explanation: 'Hạt 2 lá mầm (đậu, lạc) dự trữ ở lá mầm; hạt 1 lá mầm (ngô, lúa) dự trữ ở phôi nhũ.'
    },
    mcq2: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Quả chò, quả bồ công anh có cánh hoặc túm lông nhẹ thuộc kiểu phát tán nào?',
      options: ['A. Tự phát tán', 'B. Phát tán nhờ gió', 'C. Phát tán nhờ động vật', 'D. Phát tán nhờ nước'],
      correctIndex: 1,
      explanation: 'Cánh mỏng và túm lông giúp gió thổi bay hạt đi rất xa cây mẹ.'
    },
    essay: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Nếu ngâm hạt đậu xanh ngập hoàn toàn trong cốc nước lạnh đầy suốt nhiều ngày không chắt bớt nước, hạt có nảy mầm được thành cây con không? Giải thích.',
      hints: ['Liên hệ nhu cầu không khí ($\text{O}_2$) để phôi hạt hô hấp.'],
      solutionSteps: [
        'Hạt ngâm ngập lâu trong nước sẽ không nảy mầm thành cây được mà bị thối úng.',
        'Nguyên nhân: nước ngập kín ngăn cản hạt tiếp xúc với khí Oxi trong không khí, phôi hạt không hô hấp được nên chết ngạt.'
      ],
      finalAnswer: 'Không nảy mầm được vì thiếu không khí ($\text{O}_2$) cho hạt hô hấp.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-6-6',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · SGK Sinh 6 (Các nhóm Thực vật)',
    sourceTag: SRC_2006_6,
    lessonNumber: 6,
    title: 'Bài 6 (SGK Sinh 6 2006): Các nhóm Thực vật (Tảo – Rêu – Quyết – Hạt trần – Hạt kín) & Cây trồng',
    subtitle: 'Tiến hóa thực vật từ nước lên cạn, phân biệt 5 nhóm Thực vật SGK 6 2006 và nguồn gốc cây trồng',
    description:
      'Tổng kết Chương VIII SGK Sinh học 6 (2006): so sánh đặc điểm Tảo, Rêu, Dương xỉ, Hạt trần, Hạt kín và sự cải tạo giống cây trồng từ cây dại.',
    theory1Heading: '1. Chuỗi tiến hóa Thực vật (SGK Sinh 6 2006)',
    theory1:
      '• **Tảo** (Sống ở nước, chưa có rễ–thân–lá thật).\n• **Rêu** (Lên cạn đầu tiên nhưng rễ giả, chưa có mạch dẫn, sinh sản bằng bào tử).\n• **Quyết — Dương xỉ** (Lá non cuộn tròn, có rễ thật & mạch dẫn, sinh sản bằng bào tử).\n• **Hạt trần** (Cây thông có nón, hạt lộ ngoài).\n• **Hạt kín** (Có Hoa và Quả kín chứa Hạt — nhóm tiến hóa hoàn thiện nhất).',
    theory2Heading: '2. Thực vật với Đời sống & Cây trồng',
    theory2:
      '• Cây trồng ngày nay bắt nguồn từ cây dại được con người chọn lọc, chăm sóc nên bộ phận sử dụng (quả, hạt, củ) to và năng suất vượt trội.\n• Bảo vệ rừng chống xói mòn, lũ lụt và giữ cân bằng sinh thái.',
    keyFormulas: [
      '\\text{Tảo} \\to \\text{Rêu} \\to \\text{Quyết (Dương xỉ)} \\to \\text{Hạt trần} \\to \\text{Hạt kín}'
    ],
    sim2d: 'plant_organs_flowering_2d',
    sim3d: 'plant_flower_seed_3d',
    mcq1: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Đặc điểm nổi bật giúp nhận diện ngay cây Dương xỉ (ngành Quyết) so với cây Rêu là gì?',
      options: [
        'A. Dương xỉ có hoa và quả màu đỏ',
        'B. Lá non của dương xỉ cuộn tròn ở đầu và thân đã có rễ thật, mạch dẫn',
        'C. Dương xỉ sống hoàn toàn dưới đáy biển',
        'D. Dương xỉ sinh sản bằng hạt trần'
      ],
      correctIndex: 1,
      explanation: 'Dương xỉ đã có rễ–thân–lá thật cùng hệ mạch dẫn và đặc trưng lá non cuộn tròn như vòi voi.'
    },
    mcq2: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Vì sao Rêu tuy sống trên cạn nhưng chỉ mọc được thành thảm nhỏ ở chỗ đất ẩm ướt quanh chân tường hoặc gốc cây?',
      options: [
        'A. Vì Rêu chưa có rễ thật và chưa có mạch dẫn nước, đồng thời thụ tinh cần nước',
        'B. Vì Rêu sợ ánh nắng hoàn toàn',
        'C. Vì Rêu không có chất diệp lục',
        'D. Vì Rêu là động vật'
      ],
      correctIndex: 0,
      explanation: 'Rêu chỉ có rễ giả hút nước kém qua toàn bề mặt thân lá nhỏ bé.'
    },
    essay: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Nêu điểm khác nhau cơ bản nhất về cơ quan sinh sản giữa Thực vật Hạt trần (cây Thông) và Thực vật Hạt kín (cây Cam).',
      hints: ['Thông có nón, hạt lộ ngoài; Cam có hoa, hạt nằm kín trong quả.'],
      solutionSteps: [
        'Cây Thông (Hạt trần): chưa có hoa và quả; cơ quan sinh sản là **nón** (nón đực, nón cái), hạt nằm lộ trên lá noãn hở.',
        'Cây Cam (Hạt kín): có **hoa** thật sự, sau thụ tinh bầu nhụy phát triển thành **quả** bọc kín bảo vệ hạt bên trong.'
      ],
      finalAnswer: 'Hạt trần sinh sản bằng nón (hạt lộ); Hạt kín có hoa và quả bảo vệ hạt.'
    }
  }),

  // ==========================================================================
  // LỚP 7 — GDPT 2006 (SGK SINH HỌC 7 · 6 BÀI ĐỘNG VẬT HỌC)
  // ==========================================================================
  makeBioLesson({
    id: 'bio-2006-7-1',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · SGK Sinh 7 (Nguyên sinh & Ruột khoang)',
    sourceTag: SRC_2006_7,
    lessonNumber: 1,
    title: 'Bài 1 (SGK Sinh 7 2006): Động vật Nguyên sinh & Ngành Ruột khoang',
    subtitle: 'Trùng roi, trùng biến hình, trùng sốt rét; cấu tạo đối xứng tỏa tròn + tế bào gai tự vệ ở Thủy tức, Sứa, San hô',
    description:
      'Mở đầu SGK Sinh học 7 (2006): soi kính hiển vi giọt nước ao quan sát Động vật Nguyên sinh và khám phá ngành Ruột khoang ở biển.',
    theory1Heading: '1. Động vật Nguyên sinh (Cơ thể 1 tế bào)',
    theory1:
      '• **Trùng roi xanh**: có roi bơi, vừa tự dưỡng (có diệp lục) vừa dị dưỡng.\n• **Trùng biến hình**: di chuyển và bắt mồi bằng **chân giả**.\n• **Trùng giày**: có $2$ nhân, bơi bằng lông bơi.\n• **Trùng kiết lị & Trùng sốt rét**: sống kí sinh phá hủy hồng cầu hoặc thành ruột.',
    theory2Heading: '2. Ngành Ruột khoang (Thủy tức, Sứa, Hải quỳ, San hô)',
    theory2:
      '• Cơ thể **đối xứng tỏa tròn**, ruột dạng túi thông với một lỗ miệng vừa lấy thức ăn vừa thải bã.\n• Đặc trưng có **tế bào gai** chứa nọc độc để tự vệ và bắt mồi. San hô tạo đảo đá ngầm bảo vệ bờ biển.',
    keyFormulas: [
      '\\text{ĐV Nguyên sinh: Đơn bào} \\quad | \\quad \\text{Ruột khoang: Đối xứng tỏa tròn + Tế bào gai}'
    ],
    sim2d: 'microscope_cell_compare_2d',
    sim3d: 'eukaryotic_cell_3d',
    mcq1: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Loài động vật nguyên sinh nào di chuyển và nuốt mồi bằng CHÂN GIẢ thay đổi hình dạng liên tục?',
      options: ['A. Trùng roi xanh', 'B. Trùng biến hình (Amip)', 'C. Trùng giày', 'D. Trùng sốt rét'],
      correctIndex: 1,
      explanation: 'Dòng chất nguyên sinh dồn về một phía tạo chân giả giúp trùng biến hình bò và vây bắt mồi.'
    },
    mcq2: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Đặc điểm cấu tạo đặc trưng nhất chỉ có ở ngành Ruột khoang (Thủy tức, Sứa, Hải quỳ) giúp tự vệ và tấn công con mồi là:',
      options: ['A. Bộ xương ngoài kitin', 'B. Tế bào gai trên tua miệng', 'C. Tim 2 ngăn', 'D. Mắt kép'],
      correctIndex: 1,
      explanation: 'Tế bào gai phóng sợi gai có độc tố làm tê liệt con mồi nhỏ.'
    },
    essay: {
      source: 'SGK Sinh 7 (2006)',
      question: 'So sánh cách dinh dưỡng độc đáo của Trùng roi xanh khi đặt ở chỗ có ánh sáng và khi để trong bóng tối lâu ngày.',
      hints: ['Trùng roi xanh có hạt diệp lục giống thực vật nhưng vẫn di chuyển và lấy chất hữu cơ hòa tan.'],
      solutionSteps: [
        'Khi có ánh sáng: Trùng roi xanh dùng hạt diệp lục quang hợp tự tạo dinh dưỡng (**tự dưỡng**).',
        'Khi ở chỗ tối lâu ngày: Hạt diệp lục tiêu biến dần, trùng roi hấp thụ chất hữu cơ hòa tan trong nước để sống (**dị dưỡng**).'
      ],
      finalAnswer: 'Ngoài sáng tự dưỡng quang hợp; trong tối chuyển sang dị dưỡng.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-7-2',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · SGK Sinh 7 (Giun & Thân mềm)',
    sourceTag: SRC_2006_7,
    lessonNumber: 2,
    title: 'Bài 2 (SGK Sinh 7 2006): Các ngành Giun (Dẹp – Tròn – Đốt) & Ngành Thân mềm',
    subtitle: 'Phòng tránh giun đũa/sán lá gan, vai trò giun đất làm tơi đất và đặc điểm Trai sông, Ốc sên, Mực',
    description:
      'Phân biệt 3 ngành Giun (Giun dẹp, Giun tròn có vỏ cuticun chống dịch tiêu hóa, Giun đốt phân đốt có tuần hoàn kín) và ngành Thân mềm (vỏ đá vôi + áo).',
    theory1Heading: '1. Ba ngành Giun: Từ kí sinh nguy hiểm tới bạn của nhà nông',
    theory1:
      '• **Giun dẹp** (Sán lá gan, Sán dây): cơ thể dẹp đối xứng 2 bên, ruột phân nhánh chưa có hậu môn.\n• **Giun tròn** (Giun đũa, Giun kim): tiết diện tròn, có **vỏ cuticun** bọc ngoài chống bị dịch dạ dày tiêu hóa, có hậu môn.\n• **Giun đốt** (Giun đất, Rươi): cơ thể phân nhiều đốt, có thể xoang, **hô hấp qua da ẩm**, làm tơi xốp màu mỡ đất trồng.',
    theory2Heading: '2. Ngành Thân mềm (Trai sông, Ốc sên, Mực, Bạch tuộc)',
    theory2:
      '• Thân mềm không phân đốt, có **khoang áo** và đa số có **vỏ đá vôi** bảo vệ (trừ mực có mai đá vôi tiêu giảm bên trong giúp bơi nhanh phản lực).',
    keyFormulas: [
      '\\text{Giun đũa: Vỏ cuticun} \\quad | \\quad \\text{Giun đất: Phân đốt + Hô hấp da}'
    ],
    sim2d: 'kingdoms_invertebrates_2d',
    sim3d: 'invertebrate_biodiversity_3d',
    mcq1: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Tại sao con giun đũa sống kí sinh trong ruột non người chứa đầy enzyme tiêu hóa mà không bị tiêu hủy?',
      options: [
        'A. Vì nó có vỏ đá vôi rất dày',
        'B. Vì cơ thể được bọc lớp vỏ cuticun không thấm nước và kháng dịch tiêu hóa',
        'C. Vì nó bơi trốn rất nhanh',
        'D. Vì ruột non không có enzyme'
      ],
      correctIndex: 1,
      explanation: 'Lớp vỏ cuticun bao bọc bên ngoài bảo vệ giun đũa khỏi tác động của dịch tiêu hóa người.'
    },
    mcq2: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Loài động vật thân mềm nào vỏ đá vôi đã tiêu giảm thành "mai mực" nằm ẩn bên trong thân giúp bơi rất nhanh bằng ống phụt nước?',
      options: ['A. Trai sông', 'B. Ốc sên', 'C. Mực ống', 'D. Sò huyết'],
      correctIndex: 2,
      explanation: 'Mực sống săn mồi tích cực ngoài đại dương nên vỏ ngoài tiêu giảm thành mai mực nhẹ gọn.'
    },
    essay: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Tại sao sau những trận mưa rào lớn ngập mặt đất, người ta hay thấy rất nhiều giun đất bò lên trên mặt đường?',
      hints: ['Giun đất hô hấp qua da ẩm bằng Oxi trong khe không khí của đất.'],
      solutionSteps: [
        'Giun đất không có phổi hay mang mà trao đổi khí Oxi qua bề mặt da ẩm.',
        'Khi mưa to, nước ngập kín hết các kẽ hở không khí trong đất làm giun thiếu Oxi nên phải bò ngoi lên mặt đất để thở.'
      ],
      finalAnswer: 'Nước mưa ngập kín kẽ đất khiến giun đất thiếu Oxi nên bò lên thở qua da.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-7-3',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · SGK Sinh 7 (Chân khớp)',
    sourceTag: SRC_2006_7,
    lessonNumber: 3,
    title: 'Bài 3 (SGK Sinh 7 2006): Ngành Chân khớp — Giáp xác, Hình nhện & Sâu bọ (Đông đảo nhất)',
    subtitle: 'Bộ xương ngoài kitin + hiện tượng lột xác để lớn, cấu tạo Tôm – Nhện – Châu chấu và biến thái hoàn toàn vs không hoàn toàn',
    description:
      'Khám phá ngành động vật thành công nhất hành tinh (> 1 triệu loài): phân biệt 3 lớp Giáp xác (Tôm), Hình nhện (8 chân), Sâu bọ (6 chân + cánh).',
    theory1Heading: '1. Đặc điểm chung Ngành Chân khớp & Sự lột xác',
    theory1:
      '• Cơ thể bọc **bộ xương ngoài bằng kitin** cứng (chống mất nước, làm chỗ bám cơ) và các phần phụ (**chân, râu**) **phân đốt** khớp động linh hoạt.\n• Vì vỏ kitin cứng không dãn theo cơ thể nên Chân khớp phải **lột xác định kì** để lớn lên.',
    theory2Heading: '2. Phân biệt nhanh 3 lớp Giáp xác – Hình nhện – Sâu bọ',
    theory2:
      '• **Lớp Giáp xác** (Tôm, Cua): $2$ phần (đầu–ngực & bụng), $2$ đôi râu, thường $5$ đôi chân bò, thở bằng mang.\n• **Lớp Hình nhện** (Nhện, Bọ cạp, Ve): $2$ phần, **KHÔNG CÓ RÂU**, có **$4$ đôi chân bò ($8$ chân)**.\n• **Lớp Sâu bọ / Côn trùng** (Châu chấu, Ong, Bướm — đông nhất!): $3$ phần (Đầu – Ngực – Bụng), $1$ đôi râu, **$3$ đôi chân ($6$ chân)** và thường có $2$ đôi cánh, hô hấp bằng **hệ ống khí**.',
    keyFormulas: [
      '\\text{Sâu bọ: 3 phần (Đầu–Ngực–Bụng), 6 chân, 1 đôi râu, Hô hấp ống khí}'
    ],
    sim2d: 'kingdoms_invertebrates_2d',
    sim3d: 'invertebrate_biodiversity_3d',
    mcq1: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Nhện và Bọ cạp KHÔNG phải là Sâu bọ (Côn trùng) vì chúng thuộc lớp Hình nhện có đặc điểm nào?',
      options: [
        'A. Có 3 đôi chân và 2 đôi cánh',
        'B. Có 4 đôi chân bò ($8$ chân) và không có râu',
        'C. Thở bằng mang dưới nước',
        'D. Có bộ xương trong bằng đá vôi'
      ],
      correctIndex: 1,
      explanation: 'Hình nhện có $8$ chân và không có râu; sâu bọ có $6$ chân và $1$ đôi râu.'
    },
    mcq2: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Tại sao châu chấu nhúng đầu xuống nước không bị ngạt ngay, nhưng nhúng phần BỤNG xuống nước lại nhanh chóng chết ngạt?',
      options: [
        'A. Châu chấu thở bằng lỗ thở ống khí nằm dọc hai bên thành BỤNG',
        'B. Châu chấu uống nước bằng bụng',
        'C. Đầu châu chấu có mang',
        'D. Chân châu chấu có phổi'
      ],
      correctIndex: 0,
      explanation: 'Hệ ống khí của côn trùng thông ra ngoài qua các lỗ thở xếp dọc hai bên bụng.'
    },
    essay: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Nêu $2$ lợi ích to lớn và $2$ tác hại của lớp Sâu bọ đối với đời sống nông nghiệp của con người.',
      hints: ['Lợi ích: thụ phấn hoa, làm mật/tơ tằm, thiên địch diệt sâu hại; Tác hại: sâu ăn lá phá mùa màng, muỗi truyền bệnh.'],
      solutionSteps: [
        'Lợi ích: (1) Ong bướm thụ phấn cho cây ăn quả và cho mật ong, tằm cho tơ tằm; (2) Bọ rùa, chuồn chuồn, ong mắt đỏ làm thiên địch diệt sâu rầy.',
        'Tác hại: (1) Sâu đục thân, châu chấu, rầy nâu phá hoại cây trồng; (2) Muỗi, ruồi truyền bệnh sốt xuất huyết, tiêu chảy.'
      ],
      finalAnswer: 'Lợi: thụ phấn, mật/tơ, thiên địch; Hại: phá hoại mùa màng, truyền bệnh.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-7-4',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · SGK Sinh 7 (Cá & Lưỡng cư)',
    sourceTag: SRC_2006_7,
    lessonNumber: 4,
    title: 'Bài 4 (SGK Sinh 7 2006): Động vật Có xương sống — Lớp Cá & Lớp Lưỡng cư',
    subtitle: 'Cấu tạo Cá chép thích nghi hoàn toàn đời sống nước (Tim 2 ngăn) và Ếch đồng chuyển bước lên cạn (Tim 3 ngăn)',
    description:
      'Khám phá sự tiến hóa của tim từ 2 ngăn 1 vòng tuần hoàn ở Cá sang tim 3 ngăn 2 vòng tuần hoàn ở Lưỡng cư (Ếch).',
    theory1Heading: '1. Lớp Cá (Cá chép) — Bậc thầy bơi lội dưới nước',
    theory1:
      '• Thân thoi dẹt hai bên phủ vảy có chất nhầy giảm ma sát; có **bóng hơi** giúp chìm nổi dễ dàng; **đường bên** cảm nhận áp lực dòng nước.\n• **Hô hấp bằng mang**; **Tim $2$ ngăn ($1$ nhĩ, $1$ thất)**, $1$ vòng tuần hoàn (máu đi nuôi cơ thể là máu đỏ tươi giàu Oxi sau khi qua mang), **biến nhiệt**.',
    theory2Heading: '2. Lớp Lưỡng cư (Ếch đồng) — Vừa ở nước vừa lên cạn',
    theory2:
      '• Vừa bơi bằng màng da chân sau, vừa nhảy trên cạn bằng $4$ chi năm ngón.\n• **Hô hấp bằng da ẩm trần (chính) và phổi đơn giản**.\n• **Tim $3$ ngăn ($2$ nhĩ, $1$ thất)**, $2$ vòng tuần hoàn nhưng **máu ở tâm thất bị pha trộn**, vẫn là động vật **biến nhiệt** (mùa đông trú đông).',
    keyFormulas: [
      '\\text{Cá: Tim 2 ngăn (1 vòng)} \\longrightarrow \\text{Lưỡng cư: Tim 3 ngăn (2 vòng, máu pha)}'
    ],
    sim2d: 'vertebrate_taxonomy_2d',
    sim3d: 'comparative_hearts_3d',
    mcq1: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Số ngăn tim và số vòng tuần hoàn của Lớp Cá (ví dụ Cá chép) là bao nhiêu?',
      options: ['A. Tim 2 ngăn, 1 vòng tuần hoàn', 'B. Tim 3 ngăn, 2 vòng tuần hoàn', 'C. Tim 4 ngăn, 2 vòng tuần hoàn', 'D. Tim 2 ngăn, 2 vòng tuần hoàn'],
      correctIndex: 0,
      explanation: 'Cá có tim 2 ngăn (1 tâm nhĩ, 1 tâm thất) bơm máu qua mang theo 1 vòng tuần hoàn kín.'
    },
    mcq2: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Tại sao ếch nhái luôn phải sống ở nơi ẩm ướt gần bờ ao hồ chứ không thể sống giữa sa mạc khô nóng?',
      options: [
        'A. Vì ếch cần da luôn ẩm ướt để thực hiện trên 50% lượng trao đổi khí hô hấp và đẻ trứng thụ tinh ngoài trong nước',
        'B. Vì ếch ăn thực vật dưới nước',
        'C. Vì ếch có vảy sừng nặng',
        'D. Vì ếch có tim 4 ngăn'
      ],
      correctIndex: 0,
      explanation: 'Phổi ếch rất đơn giản nên nếu da bị khô, ếch sẽ chết ngạt; đồng thời nòng nọc sống hoàn toàn dưới nước.'
    },
    essay: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Khi bắt cá từ dưới ao lên bờ khô, vì sao cá vẫn có không khí xung quanh rất nhiều nhưng lại nhanh chóng bị chết ngạt?',
      hints: ['Cơ chế hoạt động của các lá mang cá trong nước vs ngoài không khí.'],
      solutionSteps: [
        'Cá hô hấp bằng **mang** gồm hàng trăm phiến mang mỏng xếp xòe rộng trong môi trường nước để lấy Oxi hòa tan.',
        'Khi lên cạn, các phiến mang mỏng không còn lực nâng của nước nên **bết dính chặt lại với nhau**, làm diện tích trao đổi khí giảm đột ngột khiến cá chết ngạt.'
      ],
      finalAnswer: 'Các phiến mang bị bết dính lại trên cạn không trao đổi khí được.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-7-5',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · SGK Sinh 7 (Bò sát – Chim – Thú)',
    sourceTag: SRC_2006_7,
    lessonNumber: 5,
    title: 'Bài 5 (SGK Sinh 7 2006): Lớp Bò sát, Lớp Chim & Lớp Thú (Đỉnh cao Tiến hóa)',
    subtitle: 'Bò sát thích nghi hoàn toàn trên cạn (da khô vảy sừng), Chim bay lượn & Thú có lông mao – đẻ con – tim 4 ngăn hằng nhiệt',
    description:
      'Hoàn tất 5 lớp Động vật Có xương sống SGK Sinh học 7 (2006): so sánh bước nhảy từ tim 3 ngăn có vách hụt (Bò sát) tới tim 4 ngăn hoàn chỉnh hằng nhiệt (Chim & Thú).',
    theory1Heading: '1. Lớp Bò sát (Thằn lằn, Rùa, Cá sấu)',
    theory1:
      '• Da khô có **vảy sừng** chống mất nước; hô hấp hoàn toàn bằng phổi có nhiều vách ngăn.\n• **Tim $3$ ngăn có vách ngăn hụt ở tâm thất** (riêng cá sấu $4$ ngăn), máu ít pha hơn lưỡng cư nhưng vẫn là động vật **biến nhiệt**.',
    theory2Heading: '2. Lớp Chim & Lớp Thú — Hằng nhiệt & Tim 4 ngăn',
    theory2:
      '• **Lớp Chim** (Chim bồ câu): lông vũ nhẹ xốp, xương xốp rỗng, cánh rộng, **phổi có hệ thống túi khí** (hô hấp kép), **Tim $4$ ngăn**, **HẰNG NHIỆT** ($\\approx 41^\\circ\\text{C}$).\n• **Lớp Thú / Có vú** (Thỏ, Cá voi, Dơi, Người): **lông mao** giữ nhiệt, **đẻ con và nuôi con bằng sữa mẹ**, bộ não phát triển vượt bậc, **Tim $4$ ngăn**, **HẰNG NHIỆT**.',
    keyFormulas: [
      '\\text{Tim: Cá (2)} \\to \\text{Lưỡng cư (3)} \\to \\text{Bò sát (3 + vách hụt)} \\to \\text{Chim & Thú (4 ngăn, Hằng nhiệt)}'
    ],
    sim2d: 'vertebrate_taxonomy_2d',
    sim3d: 'comparative_hearts_3d',
    mcq1: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Bước tiến hóa vĩ đại về hệ tuần hoàn ở Lớp Chim và Lớp Thú so với Bò sát và Lưỡng cư là gì?',
      options: [
        'A. Tim có 4 ngăn hoàn chỉnh, máu đỏ tươi giàu Oxi đi nuôi cơ thể KHÔNG bị pha trộn với máu nghèo Oxi',
        'B. Chỉ còn 1 vòng tuần hoàn',
        'C. Không cần mạch máu',
        'D. Máu chảy chậm hơn'
      ],
      correctIndex: 0,
      explanation: 'Tim 4 ngăn tách biệt hẳn nửa trái giàu $\\text{O}_2$ và nửa phải giàu $\\text{CO}_2$, giúp trao đổi chất cực mạnh tạo thân nhiệt ổn định (hằng nhiệt).'
    },
    mcq2: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Đặc điểm nào CHỈ có ở Lớp Thú (Động vật có vú) mà các lớp động vật khác không có?',
      options: [
        'A. Đẻ trứng có vỏ đá vôi',
        'B. Có lông mao bao phủ, hiện tượng thai sinh (đẻ con) và nuôi con bằng sữa mẹ',
        'C. Hô hấp bằng phổi',
        'D. Có xương sống'
      ],
      correctIndex: 1,
      explanation: 'Tuyến sữa nuôi con và bộ lông mao là đặc điểm độc nhất của Lớp Thú.'
    },
    essay: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Nêu $3$ đặc điểm cấu tạo ngoài của Chim bồ câu giúp chúng thích nghi tuyệt vời với đời sống bay lượn.',
      hints: ['Hình thoi, chi trước thành cánh, lông vũ nhẹ, xương xốp rỗng, không có răng/bóng đái nặng.'],
      solutionSteps: [
        '1. Thân hình thoi phủ **lông vũ nhẹ xốp** làm giảm sức cản không khí.',
        '2. **Chi trước biến đổi thành cánh** quạt gió; xương xốp chứa khí giúp cơ thể cực nhẹ.',
        '3. Cổ dài, đầu nhỏ, mỏ sừng nhẹ (không có răng nặng) và không có bóng đái tích nước tiểu.'
      ],
      finalAnswer: 'Thân hình thoi lông vũ nhẹ, chi trước thành cánh và xương xốp rỗng.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-7-6',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · SGK Sinh 7 (Tiến hóa & Đa dạng)',
    sourceTag: SRC_2006_7,
    lessonNumber: 6,
    title: 'Bài 6 (SGK Sinh 7 2006): Tiến hóa Hệ cơ quan & Đa dạng Động vật ở các Môi trường',
    subtitle: 'So sánh tiến hóa Hô hấp – Tuần hoàn – Thần kinh – Sinh sản và thích nghi vùng Cực, Hoang mạc, Nhiệt đới',
    description:
      'Tổng kết toàn bộ SGK Sinh học 7 (2006): xâu chuỗi đường đi tiến hóa của mọi hệ cơ quan động vật và cách bảo vệ đa dạng sinh học Việt Nam.',
    theory1Heading: '1. Tổng kết Tiến hóa 4 Hệ cơ quan ở Động vật',
    theory1:
      '• **Hô hấp**: Chưa phân hóa (qua bề mặt cơ thể) $\\to$ Mang / Ống khí $\\to$ Da + Phổi đơn giản $\\to$ Phổi nhiều phế nang (Thú) hoặc Phổi + Túi khí (Chim).\n• **Tuần hoàn**: Chưa có tim $\\to$ Tim $2 \\to 3 \\to 4$ ngăn.\n• **Thần kinh**: Mạng lưới $\\to$ Chuỗi hạch $\\to$ Hình ống phân hóa **Não bộ phát triển** (bán cầu đại não, tiểu não).\n• **Sinh sản**: Vô tính $\\to$ Hữu tính đẻ trứng thụ tinh ngoài $\\to$ Thụ tinh trong $\\to$ **Thai sinh đẻ con có nhau thai**.',
    theory2Heading: '2. Thích nghi vùng Cực – Hoang mạc & Đấu tranh sinh học',
    theory2:
      '• Động vật vùng Cực (Gấu Bắc Cực, Chim cánh cụt): lớp mỡ dưới da dày, lông dày giữ nhiệt. Động vật sa mạc (Lạc đà): bướu dự trữ mỡ, chân cao đệm thịt rộng không lún cát.\n• Dùng **thiên địch** (bọ rùa ăn rệp, cú mèo bắt chuột) thay thuốc trừ sâu hóa học.',
    keyFormulas: [
      '\\text{Chiều tiến hóa: Đơn giản (chưa chuyên hóa)} \\longrightarrow \\text{Phức tạp, chuyên hóa cao}'
    ],
    sim2d: 'trophic_pyramid_2d',
    sim3d: 'ecosystem_biome_3d',
    mcq1: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Hình thức sinh sản nào tiến hóa nhất vì phôi được bảo vệ an toàn trong bụng mẹ và không phụ thuộc thời tiết bên ngoài?',
      options: [
        'A. Sinh sản vô tính phân đôi',
        'B. Đẻ trứng thụ tinh ngoài dưới nước',
        'C. Đẻ trứng có vỏ đá vôi',
        'D. Hiện tượng thai sinh (đẻ con có nhau thai) và nuôi con bằng sữa mẹ ở Thú'
      ],
      correctIndex: 3,
      explanation: 'Thai sinh nuôi phôi trực tiếp qua nhau thai giúp tỉ lệ sống sót của con non cao nhất.'
    },
    mcq2: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Biện pháp "Đấu tranh sinh học" nào giúp bảo vệ mùa màng mà KHÔNG gây ô nhiễm môi trường?',
      options: [
        'A. Phun thuốc trừ sâu liều cực cao',
        'B. Sử dụng thiên địch tự nhiên (như ong mắt đỏ, bọ rùa, chim ăn sâu) tiêu diệt sâu hại',
        'C. Đốt toàn bộ đồng ruộng',
        'D. Diệt sạch mọi côn trùng'
      ],
      correctIndex: 1,
      explanation: 'Dùng sinh vật có ích (thiên địch) kìm hãm sâu hại giúp giữ cân bằng sinh thái an toàn.'
    },
    essay: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Tại sao Gấu Bắc Cực có kích thước cơ thể khổng lồ, tai nhỏ, lông trắng dày và lớp mỡ dưới da rất dày; còn Cáo sa mạc tai lại rất to và lông mỏng?',
      hints: ['Diện tích thoát nhiệt: vật to tai nhỏ giữ nhiệt tốt; tai to mạch máu dày giúp tỏa nhiệt nhanh ở sa mạc nóng.'],
      solutionSteps: [
        'Gấu Bắc Cực sống ở vùng băng giá: thân to, tai ngắn giảm tỉ lệ diện tích tỏa nhiệt, cùng lông dày và lớp mỡ dưới da giúp giữ ấm tối đa.',
        'Cáo sa mạc sống ở nơi nắng nóng khắc nghiệt: đôi tai rất to chứa nhiều mạch máu sát da giúp tản nhiệt ra môi trường nhanh chóng.'
      ],
      finalAnswer: 'Đặc điểm hình thái thích nghi trực tiếp với khí hậu cực lạnh hoặc sa mạc nóng.'
    }
  }),

  // ==========================================================================
  // LỚP 8 — GDPT 2006 (SGK SINH HỌC 8 · 6 BÀI CƠ THỂ NGƯỜI & VỆ SINH)
  // ==========================================================================
  makeBioLesson({
    id: 'bio-2006-8-1',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'GDPT 2006 · SGK Sinh 8 (Tế bào, Mô & Vận động)',
    sourceTag: SRC_2006_8,
    lessonNumber: 1,
    title: 'Bài 1 (SGK Sinh 8 2006): Tế bào, 4 loại Mô, Phản xạ & Hệ Vận động (Xương – Cơ)',
    subtitle: 'Mô biểu bì – liên kết – cơ – thần kinh, cấu tạo xương dài to ra/dài ra và chống mỏi cơ khi lao động',
    description:
      'Mở đầu SGK Sinh học 8 (2006): hiểu cấu tạo cơ thể người từ tế bào đến 4 loại mô, cung phản xạ nền tảng và bộ xương – hệ cơ.',
    theory1Heading: '1. Bốn loại Mô ở Người & Cung phản xạ',
    theory1:
      '• Cơ thể người có $4$ loại mô: **Mô biểu bì** (da, lót ống tiêu hóa), **Mô liên kết** (xương, sụn, máu, mỡ), **Mô cơ** (cơ vân bám xương, cơ trơn nội tạng, cơ tim), **Mô thần kinh** (nơ-ron + tế bào thần kinh đệm).\n• Mọi hoạt động đều dựa trên **phản xạ** thực hiện qua **cung phản xạ $5$ yếu tố**.',
    theory2Heading: '2. Xương dài ra/to ra & Nguyên nhân Mỏi cơ',
    theory2:
      '• Xương **dài ra** nhờ **sụn tăng trưởng** ở hai đầu; **to ra** về bề ngang nhờ **màng xương**.\n• Khi làm việc quá sức thiếu Oxi, cơ tích tụ **axit lactic** gây đầu độc mỏi cơ. Xoa bóp, nghỉ ngơi và hít thở sâu giúp tuần hoàn máu quét sạch axit lactic.',
    keyFormulas: [
      '\\text{Xương dài ra: Sụn tăng trưởng} \\quad | \\quad \\text{Xương to ra: Màng xương}'
    ],
    sim2d: 'microscope_cell_compare_2d',
    sim3d: 'eukaryotic_cell_3d',
    mcq1: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Xương của thiếu niên đang tuổi dậy thì tăng chiều dài nhanh chóng là nhờ sự phân chia của bộ phận nào?',
      options: ['A. Tủy đỏ xương', 'B. Sụn tăng trưởng ở hai đầu xương', 'C. Màng xương', 'D. Mô xương cứng'],
      correctIndex: 1,
      explanation: 'Các tế bào sụn tăng trưởng phân chia hóa xương giúp xương dài ra (cho tới khoảng $20-25$ tuổi).'
    },
    mcq2: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Chất nào tích tụ trong bắp cơ khi chạy gắng sức thiếu Oxi gây ra cảm giác ĐAU MỎI CƠ?',
      options: ['A. Đường Glucose', 'B. Axit lactic', 'C. Khí Oxi', 'D. Muối Canxi'],
      correctIndex: 1,
      explanation: 'Hô hấp kị khí trong cơ sinh axit lactic làm giảm độ co rút bắp cơ và gây mỏi.'
    },
    essay: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Thế nào là $1$ khớp động (như khớp khuỷu tay, khớp gối) và cấu tạo nào giúp khớp vận động trơn tru không bị mài mòn đầu xương?',
      hints: ['Hai đầu xương có sụn khớp trơn láng, giữa có bao hoạt dịch tiết dịch khớp.'],
      solutionSteps: [
        'Khớp động cho phép xương cử động biên độ rộng và linh hoạt.',
        'Hai đầu xương được bọc lớp **sụn khớp nhẵn bóng** giảm ma sát, nằm trong **bao khớp** chứa **dịch khớp** bôi trơn tự nhiên và dây chằng giữ chặt hai đầu xương.'
      ],
      finalAnswer: 'Có sụn đầu xương trơn bóng và bao dịch khớp bôi trơn chống mài mòn.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-8-2',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'GDPT 2006 · SGK Sinh 8 (Máu & Tuần hoàn)',
    sourceTag: SRC_2006_8,
    lessonNumber: 2,
    title: 'Bài 2 (SGK Sinh 8 2006): Máu, Miễn dịch, Đông máu & Chu kì Tim 0,8 giây',
    subtitle: 'Giải mã 3 hàng rào bảo vệ bạch cầu, cơ chế tơ huyết fibrin làm đông máu và 3 pha co dãn tim 0,1s – 0,3s – 0,4s',
    description:
      'Làm chủ Chương III Tuần hoàn SGK Sinh học 8 (2006): phân tích chi tiết chu kì tim $0{,}8\\text{ s}$, sơ đồ truyền máu ABO và giữ huyết áp ổn định.',
    theory1Heading: '1. Bạch cầu chống khuẩn, Đông máu & Truyền máu ABO',
    theory1:
      '• **3 hàng rào bạch cầu**: Thực bào (bạch cầu trung tính, đại thực bào) $\\to$ Tế bào **Limphô B** tiết kháng thể vô hiệu hóa kháng nguyên $\\to$ Tế bào **Limphô T** phá hủy tế bào cơ thể đã nhiễm bệnh.\n• **Đông máu**: Tiểu cầu vỡ giải phóng enzyme biến chất sinh tơ máu thành mạng **tơ máu (Fibrin)** ôm giữ hồng cầu tạo cục máu đông bịt kín vết đứt tay.',
    theory2Heading: '2. Chu kì Tim $0{,}8\\text{ giây}$ & Hai vòng tuần hoàn',
    theory2:
      '• **Chu kì tim ($0{,}8\\text{ s}$, ~75 nhịp/phút)**: Co tâm nhĩ ($0{,}1\\text{ s}$) $\\to$ Co tâm thất ($0{,}3\\text{ s}$) $\\to$ Dãn chung ($0{,}4\\text{ s}$).\n• Nhờ có **$0{,}4\\text{ s}$ dãn chung** + thời gian nghỉ từng ngăn mà tim đập suốt đời không mệt mỏi!',
    keyFormulas: [
      'T_{\\text{tim}} = 0{,}1\\text{ s (co nhĩ)} + 0{,}3\\text{ s (co thất)} + 0{,}4\\text{ s (dãn chung)} = 0{,}8\\text{ s}'
    ],
    sim2d: 'cardiac_cycle_2d',
    sim3d: 'human_heart_3d',
    mcq1: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Trong $1$ chu kì tim bình thường kéo dài $0{,}8\\text{ giây}$, tâm thất được NGHỈ NGƠI hoàn toàn trong bao nhiêu giây?',
      options: ['A. $0{,}3\\text{ s}$', 'B. $0{,}4\\text{ s}$', 'C. $0{,}5\\text{ s}$ (gồm 0,1 s nhĩ co + 0,4 s dãn chung)', 'D. $0{,}7\\text{ s}$'],
      correctIndex: 2,
      explanation: 'Tâm thất chỉ co $0{,}3\\text{ s}$ rồi nghỉ suốt $0{,}8 - 0{,}3 = 0{,}5\\text{ s}$ còn lại!'
    },
    mcq2: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Tế bào miễn dịch nào có khả năng tiết ra các phân tử KHÁNG THỂ đặc hiệu khớp chìa khóa – ổ khóa với kháng nguyên?',
      options: ['A. Hồng cầu', 'B. Tế bào Limphô B', 'C. Tiểu cầu', 'D. Tế bào cơ tim'],
      correctIndex: 1,
      explanation: 'Limphô B sản xuất kháng thể đặc hiệu để kết dính vô hiệu hóa kháng nguyên vi khuẩn/virus.'
    },
    essay: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Một người nhịp tim $75$ nhịp/phút, mỗi lần tâm thất co đẩy được $70\\text{ ml}$ máu vào động mạch chủ. Tính thể tích máu tim bơm được trong $1$ phút và trong $1$ giờ.',
      hints: ['Lấy $75 \\cdot 70\\text{ ml}$ cho 1 phút, rồi nhân $60$ phút.'],
      solutionSteps: [
        'Lượng máu bơm trong $1$ phút (cung lượng tim): $75 \\cdot 70 = 5250\\text{ ml} = 5{,}25\\text{ lít/phút}$.',
        'Lượng máu bơm trong $1$ giờ: $5{,}25 \\cdot 60 = 315\\text{ lít/giờ}$!'
      ],
      finalAnswer: '$5{,}25\\text{ lít/phút}$ và $315\\text{ lít/giờ}$.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-8-3',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'GDPT 2006 · SGK Sinh 8 (Hô hấp & Tiêu hóa)',
    sourceTag: SRC_2006_8,
    lessonNumber: 3,
    title: 'Bài 3 (SGK Sinh 8 2006): Hô hấp (Dung tích sống) & Tiêu hóa Enzyme (Amilaza – Pepsin – Ruột non)',
    subtitle: 'Các khí dung tích phổi, hô hấp nhân tạo và bản đồ cắt nhỏ Tinh bột – Protein – Lipit dọc ống tiêu hóa',
    description:
      'Bao trọn Chương IV Hô hấp & Chương V Tiêu hóa SGK Sinh học 8 (2006): cơ chế hoạt động từng enzyme tiêu hóa ở pH khác nhau và cấu tạo lông ruột hấp thụ.',
    theory1Heading: '1. Hô hấp & Dung tích sống của Phổi',
    theory1:
      '• **Dung tích sống** = Khí lưu thông (hít thở bình thường $\\approx 500\\text{ ml}$) + Khí bổ sung + Khí dự trữ (tổng khoảng $3{,}5 - 4{,}5$ lít).\n• Rèn luyện thở sâu đều đặn giúp tăng dung tích sống, giảm khí cặn, nâng cao sức khỏe phổi.',
    theory2Heading: '2. Biến đổi Hóa học của Thức ăn qua 3 chặng vàng',
    theory2:
      '• **Khoang miệng** ($\\text{pH} \\approx 7{,}2$): Enzyme **Amilaza** biến một phần tinh bột thành **đường Mantôzơ**.\n• **Dạ dày** ($\\text{pH} \\approx 2$ nhờ $\\text{HCl}$): Enzyme **Pepsin** cắt Protein thành chuỗi ngắn Polipeptit.\n• **Ruột non** ($\\text{pH} \\approx 8$): Dịch tụy, dịch mật (nhũ tương hóa mỡ) và dịch ruột hoàn tất biến đổi thành **Đường đơn, Axit amin, Axit béo & Glixêrin** để hấp thụ qua **lông ruột**.',
    keyFormulas: [
      '\\text{Tinh bột} \\xrightarrow{\\text{Amilaza}} \\text{Mantôzơ} \\xrightarrow{\\text{Mantaza}} \\text{Glucôzơ}',
      '\\text{Protein} \\xrightarrow{\\text{Pepsin, Tripsin}} \\text{Axit amin} \\quad | \\quad \\text{Lipit} \\xrightarrow{\\text{Mật + Lipaza}} \\text{Axit béo + Glixêrin}'
    ],
    sim2d: 'digestion_enzymes_2d',
    sim3d: 'digestive_tract_3d',
    mcq1: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Ở dạ dày, chất nào vừa tạo môi trường axit mạnh hoạt hóa enzyme Pepsin vừa giúp tiêu diệt phần lớn vi khuẩn theo thức ăn vào?',
      options: ['A. Amilaza', 'B. Axit clohiđric ($\\text{HCl}$)', 'C. Dịch mật', 'D. Muối kiềm'],
      correctIndex: 1,
      explanation: 'Tế bào tuyến vị dạ dày tiết HCl tạo pH $2-2{,}5$ diệt khuẩn và biến Pepsinogen thành Pepsin hoạt động.'
    },
    mcq2: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Sản phẩm cuối cùng của quá trình tiêu hóa Protein tại ruột non để ngấm qua thành lông ruột vào máu là gì?',
      options: ['A. Đường Glucôzơ', 'B. Các Axit amin', 'C. Axit béo', 'D. Tinh bột'],
      correctIndex: 1,
      explanation: 'Protein được cắt nhỏ tới đơn phân cuối cùng là các axit amin.'
    },
    essay: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Vì sao thức ăn chứa nhiều Protein bị ức chế tiêu hóa khi ta uống quá nhiều nước kiềm hoặc thuốc muối ngay sát bữa ăn, và vì sao enzyme Amilaza ngừng hoạt động khi xuống tới dạ dày?',
      hints: ['Mỗi enzyme chỉ hoạt động tối ưu trong một khoảng pH nhất định (Amilaza thích trung tính; Pepsin thích axit).'],
      solutionSteps: [
        'Amilaza nước bọt hoạt động tốt ở $\\text{pH} \\approx 7$; khi xuống dạ dày gặp môi trường axit mạnh ($\text{pH} \\approx 2$) của $\\text{HCl}$, Amilaza bị bất hoạt ngừng phân giải tinh bột.',
        'Ngược lại, Pepsin cần môi trường axit mới hoạt động; uống quá nhiều kiềm làm trung hòa HCl khiến Pepsin khó tiêu hóa Protein.'
      ],
      finalAnswer: 'Mỗi enzyme phụ thuộc chặt chẽ vào độ pH đặc trưng của từng đoạn ống tiêu hóa.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-8-4',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'GDPT 2006 · SGK Sinh 8 (Trao đổi chất & Bài tiết)',
    sourceTag: SRC_2006_8,
    lessonNumber: 4,
    title: 'Bài 4 (SGK Sinh 8 2006): Trao đổi chất, Vitamin – Muối khoáng & Bài tiết Thận',
    subtitle: 'Đồng hóa vs Dị hóa, bệnh do thiếu Vitamin A–C–D và quy trình 3 giai đoạn tạo nước tiểu ở Cầu thận – Ống thận',
    description:
      'Học trọn Chương VI Trao đổi chất – Năng lượng & Chương VII Bài tiết SGK Sinh học 8 (2006): cơ chế lọc máu tạo $170$ lít nước tiểu đầu nhưng chỉ thải $1{,}5$ lít mỗi ngày!',
    theory1Heading: '1. Đồng hóa vs Dị hóa & Vitamin – Khoáng chất',
    theory1:
      '• **Đồng hóa**: tổng hợp chất riêng cho cơ thể và tích lũy năng lượng (trẻ em đồng hóa > dị hóa để lớn).\n• **Dị hóa**: phân giải chất hữu cơ giải phóng năng lượng (ATP, nhiệt).\n• **Vitamin A** (sáng mắt), **Vitamin C** (chống chảy máu chân răng), **Vitamin D** (hấp thụ Canxi chống còi xương ở trẻ em).',
    theory2Heading: '2. Cơ chế tạo Nước tiểu ở Đơn vị Thận (Nephron)',
    theory2:
      '• Gồm $3$ bước liên tiếp:\n  1. **Lọc máu ở Cầu thận**: tạo $170$ lít **nước tiểu đầu**/ngày (giữ lại tế bào máu và protein lớn).\n  2. **Hấp thụ lại ở Ống thận**: lấy lại $99\\%$ nước, toàn bộ đường glucôzơ và các muối cần thiết.\n  3. **Bài tiết tiếp**: bơm nốt chất độc, thuốc thừa vào ống thận tạo **$1{,}5$ lít nước tiểu chính thức**.',
    keyFormulas: [
      '170\\text{ L nước tiểu đầu} \\xrightarrow{\\text{Hấp thụ lại 99\\%}} 1{,}5\\text{ L nước tiểu chính thức/ngày}'
    ],
    sim2d: 'nephron_filtration_2d',
    sim3d: 'nephron_kidney_3d',
    mcq1: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Trẻ em tắm nắng nhẹ vào buổi sáng sớm giúp da tự tổng hợp Vitamin nào để hấp thụ Canxi chống bệnh còi xương?',
      options: ['A. Vitamin A', 'B. Vitamin B1', 'C. Vitamin C', 'D. Vitamin D'],
      correctIndex: 3,
      explanation: 'Tia tử ngoại dịu buổi sáng biến tiền chất dưới da thành Vitamin D giúp chuyển hóa Canxi tạo xương.'
    },
    mcq2: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Nước tiểu chính thức khác nước tiểu đầu ở điểm quan trọng nào?',
      options: [
        'A. Nước tiểu chính thức chứa nhiều Protein và tế bào máu hơn',
        'B. Nước tiểu chính thức đậm đặc chất thải urê hơn và hầu như KHÔNG còn các chất dinh dưỡng như Glucôzơ',
        'C. Có thể tích $170$ lít/ngày',
        'D. Không chứa nước'
      ],
      correctIndex: 1,
      explanation: 'Ống thận đã hấp thụ lại toàn bộ chất bổ (glucôzơ, axit amin) và phần lớn nước vào máu.'
    },
    essay: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Tại sao nếu xét nghiệm thấy trong nước tiểu chính thức của một người có xuất hiện Protein (đạm) hoặc đường Glucôzơ nồng độ cao thì đó là dấu hiệu bệnh lí?',
      hints: ['Cầu thận bình thường không lọc lọt Protein; Ống thận bình thường hấp thụ hết 100% đường Glucôzơ.'],
      solutionSteps: [
        'Nếu có **Protein** trong nước tiểu: màng lọc cầu thận đã bị tổn thương thủng rộng cho phân tử protein lọt qua (viêm cầu thận).',
        'Nếu có nhiều **Glucôzơ** trong nước tiểu: đường huyết vượt quá ngưỡng hấp thụ lại của ống thận (dấu hiệu bệnh tiểu đường).'
      ],
      finalAnswer: 'Có Protein báo tổn thương cầu thận; có nhiều Glucôzơ cảnh báo bệnh tiểu đường.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-8-5',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'GDPT 2006 · SGK Sinh 8 (Thần kinh & Giác quan)',
    sourceTag: SRC_2006_8,
    lessonNumber: 5,
    title: 'Bài 5 (SGK Sinh 8 2006): Thần kinh, Giác quan (Mắt – Tai) & Phản xạ Có điều kiện',
    subtitle: 'Não bộ (Đại não – Tiểu não – Trụ não), dẫn truyền xung thần kinh và thí nghiệm chó tiết nước bọt của Pavlov',
    description:
      'Làm chủ Chương IX Thần kinh – Giác quan SGK Sinh học 8 (2006): chức năng các vùng vỏ đại não, cơ quan phân tích thị giác/thính giác và phản xạ có điều kiện.',
    theory1Heading: '1. Cấu tạo Não bộ & Tủy sống',
    theory1:
      '• **Tủy sống**: điều khiển phản xạ không điều kiện đơn giản và dẫn truyền.\n• **Trụ não**: điều hòa **hô hấp, tim mạch** (vùng sinh mệnh!).\n• **Tiểu não**: **giữ thăng bằng** và phối hợp động tác tinh tế.\n• **Đại não**: lớn nhất với nhiều nếp gấp tăng diện tích chứa trung tâm ngôn ngữ, tư duy, vận động, thị giác.',
    theory2Heading: '2. Phản xạ Không điều kiện vs Có điều kiện (Pavlov)',
    theory2:
      '• **Phản xạ không điều kiện**: bẩm sinh, di truyền, tồn tại suốt đời (trẻ sơ sinh bú mẹ, tay chạm lửa rụt lại).\n• **Phản xạ có điều kiện**: hình thành trong đời sống qua **luyện tập kết hợp** (như Pavlov rung chuông kèm cho chó ăn lâu ngày chó nghe chuông là tiết nước bọt), dễ mất nếu không củng cố.',
    keyFormulas: [
      '\\text{Tiểu não: Thăng bằng} \\quad | \\quad \\text{Trụ não: Tim mạch–Hô hấp} \\quad | \\quad \\text{Đại não: Tư duy, Ý thức}'
    ],
    sim2d: 'human_skeleton_senses_2d',
    sim3d: 'skeleton_senses_3d',
    mcq1: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Bộ phận nào của não bộ đóng vai trò chính trong việc ĐIỀU HÒA NHỊP THỞ VÀ NHỊP TIM tự động của con người?',
      options: ['A. Tiểu não', 'B. Trụ não (Hành não)', 'C. Thùy chẩm đại não', 'D. Tủy sống vùng thắt lưng'],
      correctIndex: 1,
      explanation: 'Trụ não chứa các trung khu sinh tồn điều khiển hô hấp, tuần hoàn và tiêu hóa.'
    },
    mcq2: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Tại sao người say rượu bia thường đi lại loạng choạng không vững bước?',
      options: [
        'A. Rượu làm ức chế hoạt động giữ thăng bằng và phối hợp động tác của Tiểu não',
        'B. Rượu làm xương chân mềm ra',
        'C. Rượu làm tăng số lượng khớp gối',
        'D. Do tim ngừng đập'
      ],
      correctIndex: 0,
      explanation: 'Cồn etanol ức chế tiểu não khiến khả năng phối hợp cơ và giữ thăng bằng suy giảm nặng.'
    },
    essay: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Trình bày ý nghĩa của việc hình thành các Phản xạ có điều kiện đối với thói quen học tập và thích nghi của con người (lấy $2$ ví dụ cụ thể).',
      hints: ['Giúp thích nghi môi trường thay đổi, hình thành kĩ năng, thói quen tốt và từ bỏ thói quen xấu.'],
      solutionSteps: [
        'Phản xạ có điều kiện giúp sinh vật và con người thích nghi linh hoạt với điều kiện sống luôn thay đổi.',
        'Ví dụ 1: Tập thói quen dậy đúng giờ đi học, tự giác ngồi vào bàn học lúc $19\\text{ h}$.',
        'Ví dụ 2: Thấy đèn giao thông chuyển đỏ tự động bóp phanh dừng xe an toàn.'
      ],
      finalAnswer: 'Giúp thích nghi linh hoạt và rèn luyện kĩ năng, thói quen sống tốt.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-8-6',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'GDPT 2006 · SGK Sinh 8 (Nội tiết & Sinh sản)',
    sourceTag: SRC_2006_8,
    lessonNumber: 6,
    title: 'Bài 6 (SGK Sinh 8 2006): Hệ Nội tiết (Tuyến Yên – Giáp – Tụy) & Sinh sản Tuổi vị thành niên',
    subtitle: 'Cơ chế điều hòa đường huyết Insulin vs Glucagon của đảo tụy, hormone tăng trưởng GH và chăm sóc sức khỏe tuổi dậy thì',
    description:
      'Hoàn tất toàn bộ SGK Sinh học 8 (2006): phân biệt tuyến nội tiết vs ngoại tiết, cơ chế tự điều hòa cân bằng nội môi bằng hormone và kiến thức tuổi dậy thì lành mạnh.',
    theory1Heading: '1. Tuyến Nội tiết & Điều hòa Đường huyết của Tuyến Tụy',
    theory1:
      '• **Tuyến nội tiết** không có ống dẫn mà tiết **hormone** ngấm thẳng vào máu (liều lượng cực nhỏ nhưng tác dụng mạnh).\n• **Tuyến yên**: "nhạc trưởng" tiết GH (thiếu GH bị lùn, thừa thành khổng lồ).\n• **Tuyến tụy**: vừa ngoại tiết (dịch tụy tiêu hóa) vừa nội tiết — tế bào $\\beta$ tiết **Insulin** (hạ đường huyết thành glicogen dự trữ), tế bào $\\alpha$ tiết **Glucagon** (tăng đường huyết lúc đói).',
    theory2Heading: '2. Tuyến sinh dục & Sức khỏe sinh sản Tuổi vị thành niên',
    theory2:
      '• Tuổi dậy thì chịu tác động của Testosteron (nam) và Estrogen (nữ) tạo biến đổi cơ thể tự nhiên.\n• Cần giữ vệ sinh thân thể sạch sẽ, ăn uống ngủ nghỉ điều độ, trau dồi kĩ năng phòng tránh xâm hại và không mang thai ở tuổi vị thành niên.',
    keyFormulas: [
      '\\text{Đường huyết cao} \\xrightarrow{\\text{Insulin}} \\text{Glicogen (Gan, Cơ)} \\quad | \\quad \\text{Đường huyết thấp} \\xrightarrow{\\text{Glucagon}} \\text{Glucôzơ}'
    ],
    sim2d: 'glucose_insulin_2d',
    sim3d: 'endocrine_pancreas_3d',
    mcq1: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Tuyến nào trong cơ thể người được coi là tuyến PHA (vừa có chức năng ngoại tiết tiết dịch tiêu hóa, vừa có chức năng nội tiết tiết hormone)?',
      options: ['A. Tuyến yên', 'B. Tuyến giáp', 'C. Tuyến tụy', 'D. Tuyến nước bọt'],
      correctIndex: 2,
      explanation: 'Tuyến tụy vừa tiết dịch tụy theo ống dẫn vào tá tràng, vừa tiết Insulin và Glucagon thẳng vào máu.'
    },
    mcq2: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Bệnh Đái tháo đường (tiểu đường tuýp 1) xảy ra khi tuyến tụy không tiết đủ hormone nào?',
      options: ['A. Thyroxine', 'B. Adrenalin', 'C. Insulin', 'D. Glucagon'],
      correctIndex: 2,
      explanation: 'Thiếu Insulin khiến glucose trong máu không đi vào tế bào dự trữ được, đường huyết tăng vọt và tràn ra nước tiểu.'
    },
    essay: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Giải thích cơ chế tự giữ ổn định nồng độ đường huyết quanh mức $0{,}12\\%$ sau khi ăn bữa cơm no và sau khi chạy thể dục đói bụng.',
      hints: ['Sau ăn đường tăng $\\to$ tiết Insulin; Lúc đói đường giảm $\\to$ tiết Glucagon.'],
      solutionSteps: [
        'Sau khi ăn no, đường glucôzơ hấp thụ vào máu tăng cao $\\to$ đảo tụy tiết **Insulin** kích thích gan, cơ thu nhận glucôzơ biến thành glicogen cất giữ làm đường huyết hạ về mức $0{,}12\\%$.',
        'Khi chạy đói, đường huyết giảm $\\to$ đảo tụy tiết **Glucagon** phân giải glicogen ở gan ngược lại thành glucôzơ thả vào máu giữ ổn định năng lượng cho não và cơ thể.'
      ],
      finalAnswer: 'Insulin hạ đường huyết sau ăn; Glucagon nâng đường huyết khi đói.'
    }
  })
];
