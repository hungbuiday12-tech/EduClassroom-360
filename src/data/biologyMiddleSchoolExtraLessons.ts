import { BiologyLesson } from '../types';
import { makeBioLesson } from './biologyGdpt2018Lessons';

const SRC_2018_6 = 'GDPT 2018 · KHTN 6 (Phần Vật sống)';
const SRC_2018_7 = 'GDPT 2018 · KHTN 7 (Phần Vật sống)';
const SRC_2018_8 = 'GDPT 2018 · KHTN 8 (Phần Vật sống)';
const SRC_2006_6 = 'GDPT 2006 · SGK Sinh học 6';
const SRC_2006_7 = 'GDPT 2006 · SGK Sinh học 7';
const SRC_2006_8 = 'GDPT 2006 · SGK Sinh học 8';

export const BIOLOGY_MS_EXTRA_LESSONS: BiologyLesson[] = [
  // ============================================================================
  // 1. GDPT 2018 — BỔ SUNG ĐẦY ĐỦ LỚP 6, 7, 8
  // ============================================================================
  makeBioLesson({
    id: 'bio-6-b7',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Thực hành Kính hiển vi & Tế bào',
    sourceTag: SRC_2018_6,
    lessonNumber: 7,
    title: 'Bài 7: Thực hành Làm tiêu bản & Soi Tế bào Biểu bì Hành tây – Niêm mạc Miệng',
    subtitle: 'Các bước tách vảy hành, nhuộm xanh metylen, tính độ phóng đại $M = M_{\\text{thị kính}} \\times M_{\\text{vật kính}}$ và so sánh Thực vật vs Động vật',
    description:
      'Trực tiếp điều chỉnh ốc sơ cấp/vi cấp trên kính hiển vi quang học 2D và xoay mô hình tế bào nhân thực 3D.',
    theory1Heading: '1. Quy trình làm Tiêu bản soi Kính hiển vi',
    theory1:
      '• Bóc lớp biểu bì mỏng mặt trong vảy hành (hoặc phết nhẹ niêm mạc má), đặt phẳng trên **lam kính** có nhỏ giọt nước/xanh metylen, đậy nghiêng **lamen $45^\\circ$** tránh bọt khí.\n• Khi soi luôn bắt đầu ở **vật kính $4\\times$ hoặc $10\\times$**, vặn ốc sơ cấp trước rồi mới tinh chỉnh bằng ốc vi cấp.',
    theory2Heading: '2. Điểm khác biệt cốt lõi giữa Tế bào Hành tây & Tế bào Má',
    theory2:
      '• **Tế bào biểu bì vảy hành (Thực vật)**: hình đa giác xếp khít, có **thành tế bào cellulose** cứng cáp và **không bào trung tâm lớn**.\n• **Tế bào niêm mạc miệng (Động vật)**: không có thành cellulose nên hình dạng tròn/méo mềm dẻo hơn, nhân bắt màu xanh metylen rõ ở giữa.',
    keyFormulas: [
      'M_{\\text{tổng}} = M_{\\text{thị kính}} \\times M_{\\text{vật kính}}'
    ],
    sim2d: 'microscope_cell_compare_2d',
    sim3d: 'eukaryotic_cell_3d',
    mcq1: {
      source: 'KHTN 6 · Thực hành kính hiển vi',
      question: 'Một kính hiển vi lắp thị kính $10\\times$ và đang xoay vào vật kính $40\\times$. Độ phóng đại tổng cộng của vật mẫu là:',
      options: ['A. $50$ lần', 'B. $400$ lần', 'C. $4$ lần', 'D. $4000$ lần'],
      correctIndex: 1,
      explanation: 'Độ phóng đại tổng cộng bằng tích $10 \\times 40 = 400$ lần.'
    },
    mcq2: {
      source: 'KHTN 6 · Làm tiêu bản',
      question: 'Vì sao khi đậy lamen lên giọt mẫu vật cần đặt nghiêng góc $45^\\circ$ rồi hạ từ từ xuống?',
      options: [
        'A. Để đẩy hết không khí ra ngoài, tránh tạo bọt khí che khuất tế bào',
        'B. Để nhuộm màu nhanh hơn',
        'C. Để làm vỡ thành tế bào',
        'D. Để tăng độ phóng đại vật kính'
      ],
      correctIndex: 0,
      explanation: 'Hạ lamen nghiêng $45^\\circ$ giúp nước dàn đều đẩy sạch bọt khí ra mép ngoài.'
    },
    essay: {
      source: 'KHTN 6 · Quan sát tế bào',
      question: 'Vì sao tế bào biểu bì vảy củ hành (mọc ngầm dưới đất) dù là tế bào thực vật nhưng lại KHÔNG có lục lạp màu xanh?',
      hints: ['Củ hành nằm trong lòng đất không tiếp xúc ánh sáng mặt trời nên không quang hợp.'],
      solutionSteps: [
        'Lục lạp chỉ phát triển ở những bộ phận nhận ánh sáng để thực hiện quang hợp như lá xanh hay thân non.',
        'Vảy củ hành mọc ngầm trong đất thực hiện chức năng dự trữ dinh dưỡng nên tế bào không chứa lục lạp (thành phần này nằm ở lá hành phía trên).'
      ],
      finalAnswer: 'Vảy hành nằm dưới đất không nhận sáng để quang hợp nên không có lục lạp.'
    }
  }),
  makeBioLesson({
    id: 'bio-6-b8',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Động vật Không xương sống',
    sourceTag: SRC_2018_6,
    lessonNumber: 8,
    title: 'Bài 8: Thế giới Động vật Không xương sống (Ruột khoang – Giun – Thân mềm – Chân khớp)',
    subtitle: 'Đặc điểm nhận dạng từng nhóm không xương sống dưới biển – trên cạn và vai trò sinh thái, y học, nông nghiệp',
    description:
      'Khám phá sự đa dạng từ sứa, san hô đến giun đất, mực ống và bọ cánh cứng qua bộ mô phỏng 5 Giới & Không xương sống 2D/3D.',
    theory1Heading: '1. Bốn nhóm Động vật Không xương sống tiêu biểu',
    theory1:
      '• **Ruột khoang** (Sứa, Thủy tức, San hô): đối xứng tỏa tròn, có tế bào gai tự vệ.\n• **Các ngành Giun** (Sán, Giun đũa kí sinh; Giun đất làm tơi đất): cơ thể mềm kéo dài.\n• **Thân mềm** (Ốc, Trai, Mực, Bạch tuộc): thân mềm thường có vỏ đá vôi bảo vệ.\n• **Chân khớp** (Tôm, Cua, Nhện, Côn trùng): bộ xương ngoài kitin và chân phân đốt — đông loài nhất Trái Đất!',
    theory2Heading: '2. Giá trị thực tiễn & Phòng tránh kí sinh trùng',
    theory2:
      '• Giun đất cải tạo đất trồng; ong thụ phấn cho cây ăn quả; tôm – mực cung cấp đạm.\n• Giữ vệ sinh ăn chín uống sôi, tẩy giun định kì 6 tháng/lần để phòng giun đũa, sán lá.',
    keyFormulas: [
      '\\text{Không xương sống} \\approx 95\\% \\text{ tổng số loài động vật trên Trái Đất}'
    ],
    sim2d: 'kingdoms_invertebrates_2d',
    sim3d: 'invertebrate_biodiversity_3d',
    mcq1: {
      source: 'KHTN 6 · Không xương sống',
      question: 'Nhóm động vật không xương sống nào có số lượng loài đông đảo nhất hành tinh, cơ thể bọc vỏ kitin và chân phân đốt?',
      options: ['A. Ruột khoang', 'B. Thân mềm', 'C. Chân khớp (đặc biệt là Côn trùng)', 'D. Giun đốt'],
      correctIndex: 2,
      explanation: 'Ngành Chân khớp chiếm hơn $80\\%$ tổng số loài động vật hiện biết.'
    },
    mcq2: {
      source: 'KHTN 6 · Phòng bệnh kí sinh',
      question: 'Thói quen sinh hoạt nào dễ dẫn đến nhiễm sán lá gan hoặc giun sán đường ruột?',
      options: [
        'A. Ăn gỏi cá sống, rau sống chưa rửa sạch và uống nước lã',
        'B. Ăn thức ăn nấu chín kĩ',
        'C. Rửa tay bằng xà phòng trước khi ăn',
        'D. Uống nước đun sôi để nguội'
      ],
      correctIndex: 0,
      explanation: 'Gỏi cá, rau thủy sinh sống và nước lã thường chứa ấu trùng sán và trứng giun.'
    },
    essay: {
      source: 'KHTN 6 · Sinh thái biển',
      question: 'Nêu 2 vai trò quan trọng của rạn san hô (ngành Ruột khoang) đối với hệ sinh thái đại dương và con người.',
      hints: ['Nơi trú ngụ sinh sản của hàng nghìn loài cá biển và tường chắn sóng bảo vệ bờ biển.'],
      solutionSteps: [
        '(1) Tạo **nơi cư trú và sinh sản** cho hơn $25\\%$ các loài sinh vật biển, giữ cân bằng đa dạng sinh học đại dương.',
        '(2) Đóng vai trò **đê chắn sóng tự nhiên** giảm sức tàn phá của bão, đồng thời mang lại giá trị du lịch sinh thái bền vững.'
      ],
      finalAnswer: 'Ngôi nhà cho sinh vật biển và lá chắn giảm sóng bão bảo vệ bờ biển.'
    }
  }),
  makeBioLesson({
    id: 'bio-6-b9',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Động vật Có xương sống',
    sourceTag: SRC_2018_6,
    lessonNumber: 9,
    title: 'Bài 9: Năm lớp Động vật Có xương sống (Cá → Lưỡng cư → Bò sát → Chim → Thú) & Bảo tồn Thiên nhiên',
    subtitle: 'So sánh da – cơ quan hô hấp – sinh sản – thân nhiệt qua 5 lớp và hành động bảo vệ động vật quý hiếm Việt Nam',
    description:
      'Đối chiếu cấu tạo thích nghi môi trường sống và tiến hóa tim 2–3–4 ngăn của 5 lớp Có xương sống trên mô hình 2D/3D.',
    theory1Heading: '1. Đặc điểm nhận diện 5 Lớp Động vật Có xương sống',
    theory1:
      '• **Cá**: thở bằng mang, vảy cá ẩm, bơi bằng vây, **biến nhiệt**.\n• **Lưỡng cư** (Ếch, Nhái): da trần ẩm ướt, nòng nọc thở mang, trưởng thành thở phổi và da.\n• **Bò sát** (Rắn, Rùa, Thằn lằn): da khô vảy sừng, đẻ trứng vỏ dai trên cạn, biến nhiệt.\n• **Chim**: lông vũ, chi trước thành cánh, phổi có túi khí, **hằng nhiệt**.\n• **Thú** (Chó, Cá voi, Dơi, Người): **lông mao**, đẻ con và **nuôi con bằng sữa mẹ**, hằng nhiệt.',
    theory2Heading: '2. Bảo vệ Đa dạng Sinh học & Động vật Sách Đỏ',
    theory2:
      '• Không săn bắt, buôn bán hay tiêu thụ động vật hoang dã (Sao la, Voọc đầu trắng Cát Bà, Rùa biển); bảo vệ rừng ngập mặn và vườn quốc gia.',
    keyFormulas: [
      '\\text{Cá (2 ngăn)} \\to \\text{Lưỡng cư (3 ngăn)} \\to \\text{Bò sát} \\to \\text{Chim \\& Thú (4 ngăn, Hằng nhiệt)}'
    ],
    sim2d: 'vertebrate_taxonomy_2d',
    sim3d: 'comparative_hearts_3d',
    mcq1: {
      source: 'KHTN 6 · Có xương sống',
      question: 'Cá voi xanh sống hoàn toàn dưới biển và Dơi biết bay trên trời được xếp vào lớp nào?',
      options: [
        'A. Cá voi thuộc lớp Cá; Dơi thuộc lớp Chim',
        'B. Cả hai đều thuộc lớp THÚ vì đẻ con và nuôi con bằng sữa mẹ',
        'C. Lớp Bò sát',
        'D. Lớp Lưỡng cư'
      ],
      correctIndex: 1,
      explanation: 'Dấu hiệu đặc trưng tuyệt đối của lớp Thú là đẻ con, có tuyến sữa và hô hấp bằng phổi.'
    },
    mcq2: {
      source: 'KHTN 6 · Thân nhiệt',
      question: 'Hai lớp động vật nào có cơ thể **HẰNG NHIỆT** (nhiệt độ cơ thể ổn định không bị thay đổi theo thời tiết nóng lạnh bên ngoài)?',
      options: ['A. Cá và Lưỡng cư', 'B. Bò sát và Lưỡng cư', 'C. Chim và Thú', 'D. Cá và Bò sát'],
      correctIndex: 2,
      explanation: 'Tim 4 ngăn tách biệt máu đỏ tươi và đỏ thẫm giúp Chim và Thú duy trì thân nhiệt ổn định.'
    },
    essay: {
      source: 'KHTN 6 · Tiến hóa lên cạn',
      question: 'Vì sao Lưỡng cư (như ếch đồng) đã có phổi nhưng vẫn chỉ sống được quanh ao hồ ẩm ướt, còn Bò sát lại đi sâu vào sống được ở hoang mạc khô nóng?',
      hints: ['So sánh bề mặt da (trần ẩm vs vảy sừng chống mất nước) và cách đẻ trứng (dưới nước vs vỏ dai trên cạn).'],
      solutionSteps: [
        'Lưỡng cư có **da trần** phải giữ ẩm liên tục để phụ thở qua da và đẻ trứng không vỏ bắt buộc thụ tinh trong nước.',
        'Bò sát tiến hóa có **da khô vảy sừng** chống thoát hơi nước và **trứng có vỏ dai** chứa màng ối bảo vệ phôi phát triển ngay trên cạn khô ráo.'
      ],
      finalAnswer: 'Bò sát có vảy sừng chống mất nước và trứng có vỏ bảo vệ trên cạn, còn lưỡng cư da trần dễ khô và phụ thuộc nước để sinh sản.'
    }
  }),
  makeBioLesson({
    id: 'bio-7-b7',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Thí nghiệm Quang hợp & Năng suất Cây',
    sourceTag: SRC_2018_7,
    lessonNumber: 7,
    title: 'Bài 7: Thí nghiệm Quang hợp Giải phóng $O_2$ – Tạo Tinh bột & Giải pháp Tăng năng suất Cây trồng',
    subtitle: 'Bịt giấy đen kiểm tra tinh bột bằng thuốc thử Iốt, đếm bọt khí $O_2$ rong đuôi chó và chọn cây ưa sáng – ưa bóng',
    description:
      'Kiểm chứng tốc độ quang hợp theo cường độ ánh sáng – nồng độ CO₂ trên đồ thị 2D và màng thylakoid lục lạp 3D.',
    theory1Heading: '1. Hai thí nghiệm kinh điển chứng minh Quang hợp',
    theory1:
      '• **Chứng minh tạo Tinh bột**: che một phần lá bằng băng đen, đem ra nắng rồi đun cồn tẩy diệp lục $\\to$ nhỏ **dung dịch Iốt**: phần đón nắng hóa **xanh tím**, phần bị che không đổi màu!\n• **Chứng minh nhả khí Oxygen**: úp phễu cành rong đuôi chó ngoài nắng thấy sủi bọt khí làm que đóm tàn đỏ **bùng cháy**.',
    theory2Heading: '2. Ứng dụng điều khiển Quang hợp trong Nông nghiệp',
    theory2:
      '• Trồng đúng mật độ, xen canh cây ưa sáng (ngô, đậu) với cây ưa bóng (gừng, lá lốt), lắp đèn bổ sung ánh sáng cho thanh long hoặc trồng nhà kính tăng $\\text{CO}_2$.',
    keyFormulas: [
      '\\text{Tinh bột} + \\text{I}_2 \\to \\text{Phức màu Xanh tím}'
    ],
    sim2d: 'photosynthesis_calvin_2d',
    sim3d: 'chloroplast_thylakoid_3d',
    mcq1: {
      source: 'KHTN 7 · Thí nghiệm Iốt',
      question: 'Trong thí nghiệm bịt một mẩu giấy đen lên giữa lá cây rồi phơi nắng, sau khi tẩy hết diệp lục bằng cồn sôi và nhỏ dung dịch Iốt, vùng nào trên lá hóa **xanh tím**?',
      options: [
        'A. Vùng bị giấy đen che kín',
        'B. Chỉ phần lá ĐƯỢC CHIẾU SÁNG xung quanh (nơi quang hợp tạo tinh bột)',
        'C. Toàn bộ lá hóa trắng',
        'D. Không vùng nào đổi màu'
      ],
      correctIndex: 1,
      explanation: 'Ánh sáng giúp phần lá lộ sáng quang hợp tạo tinh bột và bắt màu xanh tím đặc trưng với Iốt.'
    },
    mcq2: {
      source: 'KHTN 7 · Trồng trọt',
      question: 'Tại sao khi trồng cây quá dày rậm rạp, cây thường còi cọc, thân vống cao và cho ít quả?',
      options: [
        'A. Vì các lá dưới bị che khuất thiếu ánh sáng quang hợp và tranh giành dinh dưỡng đất',
        'B. Vì cây có quá nhiều Oxygen',
        'C. Vì rễ cây mọc quá sâu',
        'D. Vì thừa khí $\\text{CO}_2$'
      ],
      correctIndex: 0,
      explanation: 'Trồng quá dày làm tầng lá che nắng lẫn nhau, giảm mạnh hiệu quả quang hợp tổng hợp đường.'
    },
    essay: {
      source: 'KHTN 7 · Trồng cây trong nhà',
      question: 'Vì sao không nên đặt thật nhiều chậu cây xanh to trong phòng ngủ đóng kín cửa vào ban đêm?',
      hints: ['Ban đêm không có nắng, cây chỉ hô hấp hút O₂ và thải CO₂.'],
      solutionSteps: [
        'Ban ngày cây quang hợp nhả khí Oxygen, nhưng vào ban đêm không có ánh sáng nên cây **ngừng quang hợp**.',
        'Trong khi đó cây vẫn thực hiện **hô hấp tế bào** suốt đêm: lấy $\\text{O}_2$ và thải $\\text{CO}_2$ tranh khí thở với người trong phòng kín.'
      ],
      finalAnswer: 'Ban đêm cây ngừng quang hợp nhưng vẫn hô hấp hút $O_2$ và thải $CO_2$ gây ngột ngạt.'
    }
  }),
  makeBioLesson({
    id: 'bio-7-b8',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Tuần hoàn & Hô hấp ở Động vật',
    sourceTag: SRC_2018_7,
    lessonNumber: 8,
    title: 'Bài 8: Trao đổi khí qua Da – Mang – Ống khí – Phổi & Hệ Tuần hoàn Hở – Kín ở Động vật',
    subtitle: 'Bốn cơ quan hô hấp thích nghi môi trường và phân biệt Hệ tuần hoàn hở (Chân khớp) vs Hệ tuần hoàn kín (Giun đốt, Có xương sống)',
    description:
      'Quan sát nhịp đập chu kì tim và sự tiến hóa cấu tạo tim động vật qua biểu đồ 2D cùng trái tim 3D.',
    theory1Heading: '1. Bốn bề mặt Trao đổi khí ở Động vật',
    theory1:
      '• **Qua bề mặt da ẩm**: Giun đất, Ếch (phụ thở).\n• **Hệ ống khí**: Sâu bọ (dẫn thẳng $\\text{O}_2$ tới tận tế bào, không qua máu).\n• **Mang**: Cá, Tôm, Trai (lấy $\\text{O}_2$ hòa tan trong nước).\n• **Phổi**: Bò sát, Chim (có túi khí), Thú (hàng trăm triệu phế nang).',
    theory2Heading: '2. Hệ Tuần hoàn Hở vs Hệ Tuần hoàn Kín',
    theory2:
      '• **Tuần hoàn hở** (Ốc sên, Tôm, Côn trùng): có đoạn máu đổ tràn ra khoang cơ thể tiếp xúc trực tiếp tế bào rồi về tim, áp lực thấp.\n• **Tuần hoàn kín** (Giun đất, Mực và toàn bộ Động vật Có xương sống): máu chảy **liên tục trong mạch kín** (Động mạch $\\to$ Mao mạch $\\to$ Tĩnh mạch), áp lực cao vận chuyển cực nhanh.',
    keyFormulas: [
      '\\text{Tuần hoàn kín: Tim} \\to \\text{Động mạch} \\to \\text{Mao mạch} \\to \\text{Tĩnh mạch} \\to \\text{Tim}'
    ],
    sim2d: 'cardiac_cycle_2d',
    sim3d: 'comparative_hearts_3d',
    mcq1: {
      source: 'KHTN 7 · Hô hấp động vật',
      question: 'Vì sao cá mang lên cạn lại chết ngạt dù xung quanh không khí có tới $21\\%$ Oxygen (nhiều hơn hẳn trong nước)?',
      options: [
        'A. Các phiến mang mỏng bị dính bết vào nhau khi ra khỏi nước làm diện tích trao đổi khí giảm mạnh',
        'B. Cá bị dị ứng với không khí',
        'C. Tim cá ngừng đập ngay lập tức',
        'D. Vây cá bị khô cứng'
      ],
      correctIndex: 0,
      explanation: 'Dưới nước các tia mang xòe rộng đón nước giàu O₂; lên cạn lực căng mặt ngoài làm mang dính bết lại.'
    },
    mcq2: {
      source: 'KHTN 7 · Hệ tuần hoàn',
      question: 'Động vật nào sau đây có hệ tuần hoàn KÍN?',
      options: ['A. Châu chấu', 'B. Tôm sông', 'C. Ốc sên', 'D. Cá chép và Chim bồ câu'],
      correctIndex: 3,
      explanation: 'Tất cả Động vật Có xương sống (Cá, Lưỡng cư, Bò sát, Chim, Thú) đều có hệ tuần hoàn kín.'
    },
    essay: {
      source: 'KHTN 7 · Thích nghi trao đổi khí',
      question: 'Đặc điểm chung nào của mọi bề mặt trao đổi khí (da giun, mang cá, phế nang phổi người) giúp khí $O_2$ và $CO_2$ khuếch tán nhanh nhất?',
      hints: ['Diện tích rộng, mỏng ẩm và giàu mao mạch máu (trừ ống khí côn trùng).'],
      solutionSteps: [
        'Bề mặt trao đổi khí luôn **rộng** (nhiều nếp gấp/phế nang) để tăng tiết diện tiếp xúc.',
        'Vách **mỏng và luôn ẩm ướt** giúp khí dễ hòa tan để khuếch tán qua.',
        'Mạng lưới **mao mạch máu dày đặc** và có sự lưu thông khí/nước liên tục tạo chênh lệch áp suất.'
      ],
      finalAnswer: 'Diện tích rộng, vách mỏng, bề mặt ẩm ướt và mạng lưới mao mạch phong phú.'
    }
  }),
  makeBioLesson({
    id: 'bio-7-b9',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Sinh sản Thực vật & Hạt nảy mầm',
    sourceTag: SRC_2018_7,
    lessonNumber: 9,
    title: 'Bài 9: Cấu tạo Hoa lưỡng tính, Thụ phấn – Thụ tinh kép & Điều kiện Nảy mầm của Hạt',
    subtitle: 'Phân biệt Bầu nhụy tạo Quả – Noãn tạo Hạt, hoa thụ phấn nhờ ong bướm vs nhờ gió và kích thích hạt nảy mầm',
    description:
      'Quan sát mô hình giải phẫu Hoa – Quả – Hạt 2D và quá trình hạt nảy mầm vươn chồi rễ trong không gian 3D.',
    theory1Heading: '1. Con đường từ Hoa nở tới Quả và Hạt',
    theory1:
      '• **Nhị hoa** (chỉ nhị + bao phấn chứa hạt phấn đực) và **Nhụy hoa** (đầu nhụy + vòi nhụy + bầu nhụy chứa **noãn** cái).\n• Sau khi **Thụ phấn** (hạt phấn rơi lên đầu nhụy) và **Thụ tinh**: **Noãn $\\to$ Hạt**, còn **Bầu nhụy $\\to$ Quả** bao bọc hạt.',
    theory2Heading: '2. Bốn điều kiện đủ để Hạt nảy mầm tốt',
    theory2:
      '• **Điều kiện ngoài**: Đủ nước ẩm, đủ khí **Oxygen** để hạt hô hấp (đất tơi xốp không úng nước!) và **nhiệt độ ấm thích hợp**.\n• **Điều kiện trong**: Chất lượng hạt tốt (phôi khỏe, không bị sâu mọt hay phơi sấy chết phôi).',
    keyFormulas: [
      '\\text{Noãn (đã thụ tinh)} \\longrightarrow \\text{Hạt}; \\quad \\text{Bầu nhụy} \\longrightarrow \\text{Quả}'
    ],
    sim2d: 'plant_organs_flowering_2d',
    sim3d: 'plant_tropism_germination_3d',
    mcq1: {
      source: 'KHTN 7 · Tạo quả và hạt',
      question: 'Sau khi hoa được thụ tinh thành công, bộ phận nào của hoa phát triển thành **QUẢ** và bộ phận nào phát triển thành **HẠT**?',
      options: [
        'A. Đài hoa thành Quả, Cánh hoa thành Hạt',
        'B. Bầu nhụy thành Quả, Noãn thành Hạt',
        'C. Bao phấn thành Quả, Chỉ nhị thành Hạt',
        'D. Vòi nhụy thành Quả, Lá đài thành Hạt'
      ],
      correctIndex: 1,
      explanation: 'Bầu nhụy dày lên thành thịt/vỏ quả; các noãn bên trong sau thụ tinh thành hạt.'
    },
    mcq2: {
      source: 'KHTN 7 · Hạt nảy mầm',
      question: 'Sau khi gieo hạt đậu xanh, nếu gặp mưa lớn làm ruộng ngập úng kín nước nhiều ngày thì hạt sẽ bị thối không nảy mầm được vì sao?',
      options: [
        'A. Thiếu ánh sáng mặt trời',
        'B. Thiếu khí Oxygen cho hạt hô hấp mạnh lúc nảy mầm',
        'C. Thừa đất thịt',
        'D. Do hạt chưa đủ nước'
      ],
      correctIndex: 1,
      explanation: 'Khi nảy mầm, hạt hô hấp cực mạnh nên nếu ngập úng sẽ thiếu hẳn khí Oxygen và bị thối rữa.'
    },
    essay: {
      source: 'KHTN 7 · Thụ phấn nông nghiệp',
      question: 'Phân biệt đặc điểm hoa thụ phấn nhờ sâu bọ (hoa bưởi, hoa bí) với hoa thụ phấn nhờ gió (hoa ngô, hoa lúa).',
      hints: ['Màu sắc/mùi hương/mật ngọt vs hạt phấn nhẹ bay xa, đầu nhụy có lông giữ phấn.'],
      solutionSteps: [
        '**Hoa thụ phấn nhờ sâu bọ**: cánh hoa màu sắc sặc sỡ, có hương thơm và tuyến mật thu hút ong bướm; hạt phấn to có gai bám vào chân côn trùng.',
        '**Hoa thụ phấn nhờ gió**: thường mọc ở ngọn cao, cánh hoa tiêu giảm, sản sinh rất nhiều hạt phấn nhỏ nhẹ dễ bay theo gió và đầu nhụy có lông tơ quét bắt phấn.'
      ],
      finalAnswer: 'Nhờ sâu bọ có màu sặc sỡ – mật ngọt; nhờ gió có nhiều phấn nhỏ nhẹ và đầu nhụy có lông.'
    }
  }),
  makeBioLesson({
    id: 'bio-8-b7',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Bộ xương & Khớp – Cơ bắp Người',
    sourceTag: SRC_2018_8,
    lessonNumber: 7,
    title: 'Bài 7: Bộ xương 206 chiếc, Ba loại Khớp, Cơ chế Co cơ & Phòng tránh Cong vẹo Cột sống',
    subtitle: 'Thí nghiệm đốt xương và ngâm xương trong axit HCl, cặp cơ đối kháng tay và tư thế ngồi học chuẩn công thái học',
    description:
      'Khám phá chuyên sâu Hệ Vận động Người trên mô hình bộ xương 2D & khung xương – mắt – tai 3D.',
    theory1Heading: '1. Thành phần Hóa học của Xương & Vai trò Tuổi tác',
    theory1:
      '• Xương gồm **Chất hữu cơ (cốt giao)** tạo độ **dẻo dai đàn hồi** và **Chất khoáng (muối Canxi)** tạo độ **cứng rắn**.\n• Trẻ em nhiều chất hữu cơ nên xương dẻo (ngồi sai dễ cong vẹo cột sống!); người già nhiều muối khoáng thiếu cốt giao nên xương **giòn dễ gãy**.',
    theory2Heading: '2. Khớp xương, Cặp cơ đối kháng & Sơ cứu Gãy xương',
    theory2:
      '• Ba loại khớp: **Khớp động** (khuỷu tay, đầu gối), **Khớp bán động** (cột sống), **Khớp bất động** (hộp sọ).\n• Khi gập cẳng tay: **cơ nhị đầu mặt trước co**, cơ tam đầu mặt sau dãn.\n• Gặp người nghi gãy xương: **cố định nẹp chắc** hai đầu khớp xương trước khi di chuyển.',
    keyFormulas: [
      '\\text{Xương} = \\text{Cốt giao (Dẻo dai)} + \\text{Muối Canxi (Cứng rắn)}'
    ],
    sim2d: 'human_skeleton_senses_2d',
    sim3d: 'skeleton_senses_3d',
    mcq1: {
      source: 'KHTN 8 · Thành phần xương',
      question: 'Ngâm một chiếc xương đùi gà sạch vào dung dịch giấm ăn hoặc $\\text{HCl}$ loãng qua đêm, sau đó lấy ra thấy xương mềm uốn cong thắt nút được. Tại sao?',
      options: [
        'A. Axit đã hòa tan hết phần muối Canxi cứng, chỉ còn lại chất hữu cơ cốt giao mềm dẻo',
        'B. Axit đốt cháy hết chất hữu cơ',
        'C. Xương hút nước nở to',
        'D. Do xương bị nấu chín'
      ],
      correctIndex: 0,
      explanation: 'Axit phản ứng hòa tan hết muối khoáng Canxi tạo bọt khí, để lại khung hữu cơ dẻo dai.'
    },
    mcq2: {
      source: 'KHTN 8 · Cong vẹo cột sống',
      question: 'Thói quen học tập nào giúp phòng tránh hiệu quả tật **cong vẹo cột sống** ở học sinh THCS?',
      options: [
        'A. Ngồi học thẳng lưng, bàn ghế đúng tầm vóc và đeo ba lô đều 2 vai',
        'B. Đeo cặp nặng lệch hẳn một bên vai cho tiện',
        'C. Cúi gằm mặt sát mặt bàn đọc truyện',
        'D. Nằm nghiêng một bên xem điện thoại nhiều giờ'
      ],
      correctIndex: 0,
      explanation: 'Tư thế cân đối hai bên vai và lưng thẳng giúp cột sống tuổi đang lớn phát triển bình thường.'
    },
    essay: {
      source: 'KHTN 8 · Sơ cứu chấn thương',
      question: 'Vì sao khi bạn bị ngã nghi ngờ gãy xương cẳng tay, tuyệt đối không được nắn bóp bẻ lại xương mà phải dùng nẹp gỗ buộc cố định?',
      hints: ['Đầu xương gãy sắc nhọn có thể làm rách mạch máu, dây thần kinh và cơ xung quanh.'],
      solutionSteps: [
        'Nếu tự ý kéo nắn hoặc di chuyển tay không cố định, đầu xương gãy sắc nhọn sẽ **cứa rách cơ, đứt mạch máu và dây thần kinh** gây sốc đau nặng hoặc liệt.',
        'Dùng 2 nẹp gỗ lót bông băng buộc cố định vượt qua cả khớp cổ tay và khớp khuỷu giúp giữ xương yên vị trước khi đưa tới bệnh viện.'
      ],
      finalAnswer: 'Tránh đầu xương gãy làm tổn thương mạch máu – thần kinh; phải nẹp cố định qua hai khớp.'
    }
  }),
  makeBioLesson({
    id: 'bio-8-b8',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Hệ Sinh dục & Sức khỏe Vị thành niên',
    sourceTag: SRC_2018_8,
    lessonNumber: 8,
    title: 'Bài 8: Sinh sản ở Người, Thụ tinh – Phát triển Thai nhi & Chăm sóc Sức khỏe Tuổi dậy thì',
    subtitle: 'Cơ quan sinh dục Nam/Nữ, quá trình tạo giao tử n, thụ tinh tạo hợp tử 2n ở ống dẫn trứng và phòng tránh mang thai ngoài ý muốn',
    description:
      'Kết nối cơ chế giảm phân – phân bào 2D với hệ nội tiết sinh dục 3D giúp học sinh hiểu khoa học và tự bảo vệ bản thân.',
    theory1Heading: '1. Cấu tạo Cơ quan Sinh dục & Thụ tinh',
    theory1:
      '• **Nam**: Tinh hoàn sản sinh tinh trùng ($n$) và tiết hormone Testosterone.\n• **Nữ**: Buồng trứng sản sinh trứng ($n$) và tiết Estrogen – Progesterone.\n• **Thụ tinh** diễn ra tại **1/3 ngoài ống dẫn trứng**: tinh trùng ($n$) kết hợp trứng ($n$) thành **hợp tử ($2n$)** rồi làm tổ tại niêm mạc tử cung.',
    theory2Heading: '2. Bảo vệ Sức khỏe Sinh sản Tuổi vị thành niên',
    theory2:
      '• Vệ sinh cơ thể sạch sẽ tuổi dậy thì, tôn trọng ranh giới cá nhân phòng chống xâm hại và tuyệt đối tránh mang thai sớm gây nguy hiểm thể chất lẫn tinh thần.',
    keyFormulas: [
      '\\text{Tinh trùng } (n=23) + \\text{Trứng } (n=23) \\xrightarrow{\\text{Ống dẫn trứng}} \\text{Hợp tử } (2n=46)'
    ],
    sim2d: 'mitosis_meiosis_2d',
    sim3d: 'endocrine_pancreas_3d',
    mcq1: {
      source: 'KHTN 8 · Sinh sản người',
      question: 'Quá trình thụ tinh (tinh trùng kết hợp với trứng tạo hợp tử) bình thường diễn ra tại bộ phận nào?',
      options: ['A. Trong buồng trứng', 'B. Trong ống dẫn trứng (1/3 phía ngoài)', 'C. Trong dạ dày', 'D. Ngoài cơ thể'],
      correctIndex: 1,
      explanation: 'Trứng rụng đi vào ống dẫn trứng và gặp tinh trùng tại $1/3$ phía ngoài ống dẫn trứng.'
    },
    mcq2: {
      source: 'KHTN 8 · Tuổi dậy thì',
      question: 'Hormone sinh dục chính thúc đẩy các biến đổi đặc trưng tuổi dậy thì ở Nam và ở Nữ lần lượt là:',
      options: [
        'A. Insulin và Glucagon',
        'B. Testosterone (Nam) và Estrogen (Nữ)',
        'C. Adrenaline và Thyroxine',
        'D. Amylase và Pepsin'
      ],
      correctIndex: 1,
      explanation: 'Tinh hoàn tiết Testosterone; Buồng trứng tiết Estrogen định hình đặc điểm giới tính.'
    },
    essay: {
      source: 'KHTN 8 · Giáo dục sức khỏe',
      question: 'Giải thích vì sao mang thai ở lứa tuổi vị thành niên (dưới 18 tuổi) gây nhiều hậu quả nghiêm trọng cả về sức khỏe lẫn tương lai học tập?',
      hints: ['Khung chậu và cơ thể chưa phát triển hoàn thiện, dễ tai biến sản khoa và gián đoạn học hành.'],
      solutionSteps: [
        'Về **y tế**: cơ thể và khung xương chậu chưa trưởng thành hoàn toàn nên dễ sinh non, sảy thai, băng huyết hoặc trẻ sơ sinh nhẹ cân.',
        'Về **tâm lí & xã hội**: áp lực tinh thần nặng nề, dễ bỏ dở việc học và ảnh hưởng trực tiếp tới cơ hội nghề nghiệp tương lai.'
      ],
      finalAnswer: 'Cơ thể chưa trưởng thành dễ gặp tai biến sản khoa và làm gián đoạn con đường học tập.'
    }
  }),
  makeBioLesson({
    id: 'bio-8-b9',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Ô nhiễm Môi trường & Biến đổi Khí hậu',
    sourceTag: SRC_2018_8,
    lessonNumber: 9,
    title: 'Bài 9: Cân bằng Tự nhiên, Hiệu ứng Nhà kính & Phát triển Bền vững Sinh quyển',
    subtitle: 'Vì sao khí $CO_2 - CH_4$ làm Trái Đất nóng lên, tích tụ chất độc qua tháp sinh thái và giải pháp Net-Zero 2050',
    description:
      'Khép lại phần Vật sống KHTN 8: phân tích tháp sinh thái 2D và hệ sinh thái Trái Đất 3D trước tác động của con người.',
    theory1Heading: '1. Cân bằng Tự nhiên & Khuếch đại Sinh học',
    theory1:
      '• Quần xã luôn tự điều chỉnh số lượng cá thể qua quan hệ **vật ăn thịt – con mồi** và **cạnh tranh**.\n• Chất độc khó phân hủy (thuốc trừ sâu DDT, thủy ngân) **tích tụ tăng dần nồng độ** ở các bậc dinh dưỡng cuối cùng trong chuỗi thức ăn (gọi là khuếch đại sinh học).',
    theory2Heading: '2. Hiệu ứng Nhà kính & Bảo vệ Sinh quyển',
    theory2:
      '• Đốt nhiên liệu hóa thạch và phá rừng làm khí $\\text{CO}_2$, $\\text{CH}_4$ tăng cao giữ nhiệt gây băng tan, nước biển dâng.\n• Giải pháp: dùng năng lượng mặt trời/gió, trồng rừng phủ xanh và kinh tế tuần hoàn.',
    keyFormulas: [
      '\\text{Bậc dinh dưỡng càng cao} \\implies \\text{Năng lượng giảm } (10\\%) \\text{ nhưng Độc tố tích tụ càng lớn}'
    ],
    sim2d: 'trophic_pyramid_2d',
    sim3d: 'ecosystem_biome_3d',
    mcq1: {
      source: 'KHTN 8 · Sinh thái môi trường',
      question: 'Trong chuỗi thức ăn: Tảo biển $\\to$ Giáp xác nhỏ $\\to$ Cá nhỏ $\\to$ Cá ngừ lớn. Nếu nước biển nhiễm thủy ngân nhẹ, sinh vật nào có nồng độ thủy ngân tích tụ trong thịt CAO NHẤT?',
      options: ['A. Tảo biển', 'B. Giáp xác nhỏ', 'C. Cá nhỏ', 'D. Cá ngừ lớn (bậc dinh dưỡng cao nhất)'],
      correctIndex: 3,
      explanation: 'Thủy ngân không đào thải được nên tích tụ cộng dồn ở sinh vật ăn thịt đầu bảng.'
    },
    mcq2: {
      source: 'KHTN 8 · Biến đổi khí hậu',
      question: 'Biện pháp nào góp phần GIẢM trực tiếp lượng khí $\\text{CO}_2$ dư thừa trong khí quyển?',
      options: [
        'A. Đốt thêm nhiều than đá chạy nhà máy nhiệt điện',
        'B. Trồng và bảo vệ rừng cây xanh kết hợp chuyển sang điện gió, điện mặt trời',
        'C. Tăng sử dụng xe máy chạy xăng cũ',
        'D. Đốt rơm rạ ngoài đồng'
      ],
      correctIndex: 1,
      explanation: 'Cây xanh quang hợp hấp thụ $\\text{CO}_2$ và năng lượng tái tạo cắt giảm phát thải từ nhiên liệu hóa thạch.'
    },
    essay: {
      source: 'KHTN 8 · Cân bằng sinh học',
      question: 'Tại sao nếu người nông dân tiêu diệt sạch rắn và chim cú mèo trên cánh đồng thì mùa màng lại có nguy cơ mất mùa nặng hơn?',
      hints: ['Rắn và cú mèo là thiên địch khống chế số lượng chuột đồng phá hoại lúa.'],
      solutionSteps: [
        'Rắn và cú mèo là vật ăn thịt khống chế tự nhiên quần thể **chuột đồng**.',
        'Khi mất thiên địch, số lượng chuột đồng bùng phát mất kiểm soát và tàn phá mùa màng gây thiệt hại nghiêm trọng.'
      ],
      finalAnswer: 'Mất thiên địch khiến chuột đồng sinh sôi bùng phát phá hoại lúa màu.'
    }
  }),

  // ============================================================================
  // 2. GDPT 2006 — BỔ SUNG ĐẦY ĐỦ SGK SINH HỌC 6, 7, 8
  // ============================================================================
  makeBioLesson({
    id: 'bio-2006-6-7',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · SGK Sinh 6 (Biến dạng Rễ & Thân)',
    sourceTag: SRC_2006_6,
    lessonNumber: 7,
    title: 'Bài 7 (SGK Sinh 6 2006): Rễ biến dạng (Củ – Móc – Giác mút) & Thân biến dạng (Củ – Rễ – Mọng nước)',
    subtitle: 'Phân biệt chính xác củ Cà rốt (rễ củ) với củ Khoai tây (thân củ), củ Gừng (thân rễ) và gai Xương rồng',
    description:
      'Giải mã những câu hỏi "bẫy kinh điển" của SGK Sinh học 6 (2006) trên mô hình cơ quan thực vật 2D & bó mạch 3D.',
    theory1Heading: '1. Bốn loại Rễ biến dạng thích nghi đặc biệt',
    theory1:
      '• **Rễ củ** (cà rốt, củ cải, sắn): phình to chứa chất dự trữ (không có mắt chồi!).\n• **Rễ móc** (trầu không, hồ tiêu): mọc từ thân bám chặt lên giàn/tường.\n• **Rễ thở** (bụt mọc, mắm): mọc ngược lên khỏi bùn ngập nước để lấy khí Oxi.\n• **Giác mút** (tơ hồng, tầm gửi): đâm vào thân cây chủ hút nhựa nuôi sống kí sinh.',
    theory2Heading: '2. Ba loại Thân biến dạng hay nhầm với Rễ',
    theory2:
      '• **Thân củ** (khoai tây, su hào): có mắt chồi nách mọc mầm.\n• **Thân rễ** (gừng, dong ta, riềng): nằm dưới đất nhưng có đốt và vảy lá nhỏ.\n• **Thân mọng nước** (xương rồng): tích trữ nước ở sa mạc, lá biến thành **gai** để giảm thoát hơi nước!',
    keyFormulas: [
      '\\text{Khoai tây, Gừng, Su hào} = \\text{THÂN biến dạng} \\quad | \\quad \\text{Cà rốt, Sắn, Khoai lang} = \\text{RỄ củ}'
    ],
    sim2d: 'plant_organs_flowering_2d',
    sim3d: 'plant_vascular_3d',
    mcq1: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Củ nào dưới đây thực chất là **THÂN CỦ** chứ không phải rễ củ?',
      options: ['A. Củ cà rốt', 'B. Củ khoai lang', 'C. Củ khoai tây', 'D. Củ cải trắng'],
      correctIndex: 2,
      explanation: 'Khoai tây có các mắt chứa chồi ngọn/chồi nách mọc thành thân lá nên là thân củ.'
    },
    mcq2: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Ở cây xương rồng sống nơi sa mạc khô hạn, bộ phận nào đảm nhận chức năng **quang hợp** thay cho lá?',
      options: ['A. Gai xương rồng', 'B. Thân màu xanh mọng nước (chứa diệp lục)', 'C. Chóp rễ', 'D. Hoa xương rồng'],
      correctIndex: 1,
      explanation: 'Lá xương rồng tiêu giảm thành gai chống thoát hơi nước; thân phình mọng nước màu xanh quang hợp thay lá.'
    },
    essay: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Vì sao cây Mắm, cây Đước vùng rừng ngập mặn ven biển lại mọc ra rất nhiều **rễ thở** đâm ngược lên khỏi mặt bùn?',
      hints: ['Bùn ngập mặn đặc quánh và ngập thủy triều rất thiếu khí Oxi cho rễ hô hấp.'],
      solutionSteps: [
        'Rễ cây cần khí Oxi để hô hấp tạo năng lượng hút nước và muối khoáng.',
        'Vùng bùn lầy ngập mặn bị thiếu Oxi nghiêm trọng nên cây tiến hóa thêm **rễ thở** vươn lên không trung mang Oxi từ khí quyển xuống nuôi hệ rễ ngầm.'
      ],
      finalAnswer: 'Đất bùn ngập mặn thiếu khí $O_2$ nên rễ thở mọc ngược lên không khí để hô hấp.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-6-8',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · SGK Sinh 6 (Quả & Phát tán Hạt)',
    sourceTag: SRC_2006_6,
    lessonNumber: 8,
    title: 'Bài 8 (SGK Sinh 6 2006): Các loại Quả (Khô nẻ – Khô không nẻ – Quả thịt) & Phát tán Quả – Hạt',
    subtitle: 'Phân loại quả đậu bắp – quả chò – quả dừa – quả mơ và 4 con đường phát tán hạt giúp thực vật phủ xanh Trái Đất',
    description:
      'Khám phá cấu tạo vỏ quả, cánh bay theo gió của quả chò và cơ chế tự nẻ bắn hạt trên mô hình hoa – quả – hạt 2D/3D.',
    theory1Heading: '1. Phân loại 2 nhóm Quả chính trong SGK Sinh 6 (2006)',
    theory1:
      '• **Quả khô** (khi chín vỏ khô cứng mỏng): chia làm **Quả khô nẻ** (đậu Hà Lan, cải, bông — tự tách vỏ tung hạt) và **Quả khô không nẻ** (thóc, chò, me — vỏ không tự tách).\n• **Quả thịt** (khi chín mềm dày chứa nhiều thịt quả): **Quả mọng** (nho, cà chua, đu đủ) và **Quả hạch** có hạch cứng bọc hạt (mơ, mận, xoài, dừa).',
    theory2Heading: '2. Bốn cách phát tán Quả & Hạt đi xa cây mẹ',
    theory2:
      '• **Nhờ gió** (chò có cánh, bồ công anh có túm lông).\n• **Nhờ động vật** (ké đầu ngựa có gai móc bám lông; quả ổi/cà chua ngon ngọt chim ăn thải hạt).\n• **Tự phát tán** (đậu bắp, chi chi vỏ khô xoắn vặn nẻ bật bắn hạt đi xa).\n• **Nhờ nước & con người** (quả dừa nổi trôi biển).',
    keyFormulas: [
      '\\text{Quả khô} \\begin{cases} \\text{Khô nẻ (Đậu, Cải)} \\\\ \\text{Khô không nẻ (Thóc, Chò)} \\end{cases} \\quad \\text{Quả thịt} \\begin{cases} \\text{Quả mọng (Cà chua)} \\\\ \\text{Quả hạch (Xoài, Mận)} \\end{cases}'
    ],
    sim2d: 'plant_organs_flowering_2d',
    sim3d: 'plant_flower_seed_3d',
    mcq1: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Cặp quả nào sau đây đều thuộc nhóm **QUẢ KHÔ NẺ** (khi chín vỏ tự tách ra bắn hạt)?',
      options: [
        'A. Quả đậu xanh và quả cải',
        'B. Quả thóc và quả chò',
        'C. Quả cà chua và quả nho',
        'D. Quả xoài và quả mận'
      ],
      correctIndex: 0,
      explanation: 'Quả đậu xanh và quả cải khi khô già tự tách làm đôi bắn hạt ra ngoài (tự phát tán).'
    },
    mcq2: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Quả ké đầu ngựa có nhiều gai móc nhỏ bám vào lông chó, quần áo người đi đường là hình thức phát tán nào?',
      options: ['A. Nhờ gió', 'B. Nhờ động vật', 'C. Tự phát tán', 'D. Nhờ nước chảy'],
      correctIndex: 1,
      explanation: 'Gai móc giúp quả bám vào lông động vật di chuyển đi gieo mầm nơi mới.'
    },
    essay: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Vì sao người nông dân phải thu hoạch đậu đỗ, vừng (mè) đúng lúc quả vừa già tới mà KHÔNG đợi quả khô hẳn trên cây dưới trời nắng?',
      hints: ['Quả đậu, vừng thuộc nhóm quả khô nẻ.'],
      solutionSteps: [
        'Đậu đỗ và vừng thuộc nhóm **quả khô nẻ** có cơ chế tự phát tán.',
        'Nếu đợi quá khô nắng giòn ngoài đồng, vỏ quả sẽ tự tách nẻ bắn hết hạt xuống đất gây thất thoát lớn năng suất thu hoạch.'
      ],
      finalAnswer: 'Đậu, vừng là quả khô nẻ; để quá khô vỏ tự tách bắn hạt xuống đất mất mùa.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-6-9',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · SGK Sinh 6 (Vi khuẩn – Nấm & Vai trò Rừng)',
    sourceTag: SRC_2006_6,
    lessonNumber: 9,
    title: 'Bài 9 (SGK Sinh 6 2006): Vi khuẩn – Nấm – Địa y & Vai trò Thực vật Chống xói mòn – Điều hòa Khí hậu',
    subtitle: 'Chu trình phân giải xác hữu cơ thành mùn khoáng của Vi khuẩn – Nấm và tác dụng giữ nước, chắn gió bão của Rừng cây',
    description:
      'Hoàn tất trọn bộ SGK Sinh học 6 (2006): kết nối thế giới vi sinh vật phân giải với cân bằng hệ sinh thái rừng.',
    theory1Heading: '1. Vi khuẩn, Nấm & Địa y (Cộng sinh Tảo + Nấm)',
    theory1:
      '• **Vi khuẩn & Nấm hoại sinh**: phân giải lá rụng, xác động vật thành **chất vô cơ trả lại đất** khép kín vòng tuần hoàn dinh dưỡng.\n• **Địa y** (mảng xanh xám trên vỏ cây): là sự **cộng sinh hai bên cùng có lợi** giữa Tảo (quang hợp cung cấp đường) và Sợi nấm (hút nước + muối khoáng).',
    theory2Heading: '2. Vai trò Sống còn của Thực vật & Rừng tự nhiên',
    theory2:
      '• Rừng cung cấp $\\text{O}_2$, hút $\\text{CO}_2$ **điều hòa khí hậu**; tán lá cản lực mưa rơi, hệ rễ giữ chặt đất **ngăn lũ quét, xói mòn và sạt lở đất**.',
    keyFormulas: [
      '\\text{Địa y} = \\text{Tảo (quang hợp tạo đường)} + \\text{Nấm (hút nước, khoáng)}'
    ],
    sim2d: 'viral_lytic_cycle_2d',
    sim3d: 'ecosystem_biome_3d',
    mcq1: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Trong mảng **Địa y** bám trên thân cây gỗ lâu năm, mối quan hệ giữa Tảo và Nấm là gì?',
      options: [
        'A. Nấm kí sinh giết chết tảo',
        'B. Cộng sinh: Tảo quang hợp nuôi sống cả hai, Nấm hút nước và khoáng cho Tảo',
        'C. Cạnh tranh giành thức ăn',
        'D. Không liên quan nhau'
      ],
      correctIndex: 1,
      explanation: 'Địa y là ví dụ kinh điển của quan hệ cộng sinh giữa Tảo đơn bào và Nấm.'
    },
    mcq2: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Tại sao sau những trận mưa lớn ở vùng đồi trọc đất bị xói mòn sạt lở nặng, còn vùng có rừng rậm thì nước chảy ra suối trong và hiền hòa?',
      options: [
        'A. Tán rừng cản bớt sức va đập của hạt mưa và rễ cây giữ đất – thấm giữ nước vào lòng đất',
        'B. Đồi trọc có quá nhiều cát',
        'C. Rừng đẩy mây mưa đi nơi khác',
        'D. Cây rừng uống cạn sạch mưa'
      ],
      correctIndex: 0,
      explanation: 'Tán cây phân tán giọt mưa và thảm mục – rễ cây giúp nước ngấm từ từ xuống mạch ngầm.'
    },
    essay: {
      source: 'SGK Sinh 6 (2006)',
      question: 'Nếu toàn bộ Vi khuẩn và Nấm hoại sinh trong đất đột nhiên biến mất thì điều gì sẽ xảy ra với rừng cây trên Trái Đất?',
      hints: ['Lá rụng, xác sinh vật không phân hủy được và đất cạn kiệt muối khoáng.'],
      solutionSteps: [
        'Xác thực vật và động vật chất đống ngập tràn mặt đất vì không được phân hủy.',
        'Đất trồng nhanh chóng **cạn kiệt chất khoáng dinh dưỡng**, cây xanh ngừng sinh trưởng kéo theo sự sụp đổ của toàn bộ giới sinh vật.'
      ],
      finalAnswer: 'Rác hữu cơ ngập tràn và đất cạn kiệt muối khoáng khiến cây xanh và hệ sinh thái suy sụp.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-7-7',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · SGK Sinh 7 (Thực hành Sâu bọ)',
    sourceTag: SRC_2006_7,
    lessonNumber: 7,
    title: 'Bài 7 (SGK Sinh 7 2006): Châu chấu – Mổ quan sát & Biến thái Hoàn toàn vs Không hoàn toàn',
    subtitle: 'Giải phẫu ngoài Châu chấu (3 phần, râu, mắt kép, càng nhảy) và so sánh vòng đời Bướm (4 giai đoạn) vs Châu chấu (3 giai đoạn)',
    description:
      'Thực hành phân loại đặc điểm Sâu bọ trên mô hình không xương sống 2D/3D chuẩn SGK Sinh học 7 (2006).',
    theory1Heading: '1. Đặc điểm Cấu tạo điển hình của Châu chấu',
    theory1:
      '• Phần **Đầu**: $1$ đôi râu cảm giác, $2$ mắt kép lớn nhìn đa hướng và **cơ quan miệng kiểu nghiền** sắc bén ăn lá.\n• Phần **Ngực**: mang $3$ đôi chân (đôi chân sau to khỏe để bật nhảy) và $2$ đôi cánh.\n• Phần **Bụng**: phân đốt có các **lỗ thở** dẫn khí trực tiếp vào hệ ống khí.',
    theory2Heading: '2. Biến thái Hoàn toàn vs Không hoàn toàn',
    theory2:
      '• **Biến thái hoàn toàn** (Bướm, Muỗi, Ong): Trứng $\\to$ **Ấu trùng (Sâu)** $\\to$ **Nhộng** $\\to$ Trưởng thành (có giai đoạn Nhộng nằm kén!).\n• **Biến thái không hoàn toàn** (Châu chấu, Gián): Trứng $\\to$ Ấu trùng (non giống hệt bố mẹ nhưng chưa có cánh) $\\to$ Trưởng thành qua nhiều lần lột xác.',
    keyFormulas: [
      '\\text{Bướm (Hoàn toàn): Trứng} \\to \\text{Sâu} \\to \\text{Nhộng} \\to \\text{Bướm trưởng thành}'
    ],
    sim2d: 'kingdoms_invertebrates_2d',
    sim3d: 'invertebrate_biodiversity_3d',
    mcq1: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Vòng đời phát triển của loài côn trùng nào trải qua giai đoạn **NHỘNG** (biến thái hoàn toàn)?',
      options: ['A. Châu chấu', 'B. Gián', 'C. Bướm tằm và Muỗi vằn', 'D. Cào cào'],
      correctIndex: 2,
      explanation: 'Bướm và Muỗi phát triển qua đủ 4 giai đoạn: Trứng → Ấu trùng (Sâu/Bọ gậy) → Nhộng → Trưởng thành.'
    },
    mcq2: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Đôi chân thứ ba (chân sau) của châu chấu có cấu tạo đặc biệt to khỏe giúp thực hiện chức năng gì?',
      options: ['A. Bắt mồi', 'B. Bật nhảy xa trốn kẻ thù', 'C. Thở dưới nước', 'D. Nghe âm thanh'],
      correctIndex: 1,
      explanation: 'Đùi chân sau phát triển cơ bắp rất khỏe tạo lực đẩy bật nhảy xa gấp nhiều lần thân.'
    },
    essay: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Trong nông nghiệp, giai đoạn nào trong vòng đời của loài Bướm sâu tơ gây hại phá hoại rau màu nặng nề nhất? Giải thích.',
      hints: ['Sâu bướm non phàm ăn lá cây để tích lũy năng lượng hóa nhộng.'],
      solutionSteps: [
        'Giai đoạn **Ấu trùng (Sâu non)** phá hại mùa màng nặng nhất.',
        'Vì sâu non có miệng nghiền ăn liên tục lá non để lớn nhanh và tích trữ năng lượng chuẩn bị cho giai đoạn Nhộng không ăn, trong khi bướm trưởng thành chỉ hút mật hoa.'
      ],
      finalAnswer: 'Giai đoạn Sâu non (ấu trùng) vì có miệng nghiền và ăn rất nhiều lá để tích năng lượng.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-7-8',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · SGK Sinh 7 (Tiến hóa Tim Có xương sống)',
    sourceTag: SRC_2006_7,
    lessonNumber: 8,
    title: 'Bài 8 (SGK Sinh 7 2006): So sánh Tiến hóa Tim 2–3–4 ngăn & Vòng tuần hoàn 5 Lớp Có xương sống',
    subtitle: 'Từ tim 2 ngăn (1 vòng) ở Cá → 3 ngăn máu pha (Lưỡng cư) → Vách hụt ở Bò sát → Tim 4 ngăn hoàn chỉnh ở Chim và Thú',
    description:
      'Khám phá bước nhảy vọt tiến hóa của hệ tuần hoàn động vật có xương sống trực tiếp trên mô hình 2D và so sánh 4 trái tim 3D.',
    theory1Heading: '1. Lộ trình Tiến hóa Tim từ 2 lên 4 ngăn',
    theory1:
      '• **Cá**: Tim **2 ngăn** ($1$ tâm nhĩ, $1$ tâm thất), **1 vòng tuần hoàn**, máu đi nuôi cơ thể là máu đỏ tươi giàu Oxi.\n• **Lưỡng cư**: Tim **3 ngăn** ($2$ tâm nhĩ, $1$ tâm thất chung), **2 vòng tuần hoàn** nhưng máu đỏ tươi và đỏ thẫm **pha trộn nhiều** tại tâm thất.\n• **Bò sát**: Tim 3 ngăn có **vách ngăn hụt** (riêng Cá sấu tim 4 ngăn hoàn toàn) nên máu ít pha hơn.',
    theory2Heading: '2. Đỉnh cao Tim 4 ngăn ở Chim & Thú',
    theory2:
      '• Tim chia **4 ngăn hoàn chỉnh** ($2$ tâm nhĩ, $2$ tâm thất tách biệt nửa trái – phải). Máu giàu Oxi **KHÔNG BAO GIỜ PHA** với máu giàu $\\text{CO}_2$, giúp quá trình trao đổi chất cực mạnh và **duy trì thân nhiệt hằng nhiệt**.',
    keyFormulas: [
      '\\text{Cá (2)} \\to \\text{Ếch (3)} \\to \\text{Thằn lằn (3 + vách hụt)} \\to \\text{Chim \\& Thú (4 ngăn)}'
    ],
    sim2d: 'vertebrate_taxonomy_2d',
    sim3d: 'comparative_hearts_3d',
    mcq1: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Hệ tuần hoàn của lớp động vật nào chỉ có **1 vòng tuần hoàn** và trái tim **2 ngăn** chứa toàn máu đỏ thẫm?',
      options: ['A. Lớp Cá', 'B. Lớp Lưỡng cư', 'C. Lớp Bò sát', 'D. Lớp Chim'],
      correctIndex: 0,
      explanation: 'Tim Cá 2 ngăn bơm máu đỏ thẫm qua mang lấy Oxi thành máu đỏ tươi rồi đi thẳng nuôi cơ thể.'
    },
    mcq2: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Tại sao khả năng trao đổi chất và điều hòa thân nhiệt của Chim và Thú vượt trội hẳn so với Lưỡng cư?',
      options: [
        'A. Vì tim Chim và Thú có 4 ngăn tách biệt hoàn toàn máu giàu Oxi đi nuôi cơ thể không bị pha trộn',
        'B. Vì Chim và Thú không có mao mạch',
        'C. Vì tim ếch có tới 5 ngăn',
        'D. Vì máu Chim không có hồng cầu'
      ],
      correctIndex: 0,
      explanation: 'Máu động mạch nguyên chất giàu Oxi tạo năng lượng ATP cao gấp nhiều lần giúp giữ thân nhiệt hằng định.'
    },
    essay: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Giải thích vì sao loài Cá sấu thuộc lớp Bò sát lại là ngoại lệ đặc biệt có tim 4 ngăn hoàn chỉnh, nhưng vẫn là động vật biến nhiệt chứ chưa hằng nhiệt như Thú?',
      hints: ['Dù tim 4 ngăn, cá sấu có van nối trộn máu ở gốc động mạch chủ và phổi/da chưa đủ trao đổi chất giữ nhiệt cao.'],
      solutionSteps: [
        'Cá sấu có vách ngăn tâm thất kín chia tim thành **4 ngăn** thích nghi khi lặn sâu giữ nhịp tim chậm.',
        'Tuy nhiên, ở ngoài tim vẫn còn lỗ thông trộn một phần máu khi lặn và tốc độ trao đổi chất thấp, da phủ vảy sừng nên cá sấu vẫn phụ thuộc nhiệt độ môi trường (biến nhiệt).'
      ],
      finalAnswer: 'Vẫn còn luồng trộn máu ngoài tim khi lặn và mức trao đổi chất cơ bản thấp nên vẫn biến nhiệt.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-7-9',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · SGK Sinh 7 (Đấu tranh Sinh học)',
    sourceTag: SRC_2006_7,
    lessonNumber: 9,
    title: 'Bài 9 (SGK Sinh 7 2006): Biện pháp Đấu tranh Sinh học & Bảo vệ Đa dạng Sinh học Động vật',
    subtitle: 'Dùng Ong mắt đỏ – Bọ rùa – Chim ăn sâu diệt dịch hại thay thuốc trừ sâu và mô hình cân bằng Con mồi – Vật ăn thịt',
    description:
      'Khép lại SGK Sinh học 7 (2006): mô phỏng chu kì dao động quần thể Sói – Thỏ (Lotka-Volterra) 2D và hệ sinh thái 3D.',
    theory1Heading: '1. Ba biện pháp Đấu tranh Sinh học thân thiện môi trường',
    theory1:
      '• (1) **Sử dụng Thiên địch tiêu diệt sinh vật hại**: nuôi **Bọ rùa** ăn rệp hại cam, nuôi **Kiến vàng** diệt sâu bọ, bảo vệ chim sâu.\n• (2) **Sử dụng Thiên địch đẻ trứng kí sinh**: **Ong mắt đỏ** đẻ trứng vào trứng sâu đục thân lúa.\n• (3) **Dùng Vi khuẩn / Nấm gây bệnh cho sâu**: chế phẩm vi khuẩn *Bt* diệt sâu róm mà vô hại với người.',
    theory2Heading: '2. Ưu điểm và Hạn chế của Đấu tranh Sinh học',
    theory2:
      '• **Ưu điểm**: không gây ô nhiễm đất nước, bảo vệ sức khỏe người ăn nông sản, không làm sâu hại nhờn thuốc.\n• **Hạn chế**: tác dụng chậm hơn thuốc hóa học, đòi hỏi nghiên cứu kĩ tránh thiên địch du nhập trở thành loài xâm lấn.',
    keyFormulas: [
      '\\text{Đấu tranh sinh học} = \\text{Thiên địch ăn thịt} \\mid \\text{Kí sinh trứng} \\mid \\text{Vi sinh gây bệnh}'
    ],
    sim2d: 'predator_prey_2d',
    sim3d: 'ecosystem_biome_3d',
    mcq1: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Biện pháp thả **Ong mắt đỏ** ra ruộng lúa để đẻ trứng vào ổ trứng sâu đục thân làm hỏng trứng sâu thuộc phương pháp nào?',
      options: [
        'A. Phun thuốc trừ sâu hóa học',
        'B. Đấu tranh sinh học (dùng thiên địch kí sinh trứng)',
        'C. Gây đột biến phóng xạ',
        'D. Bắt sâu thủ công'
      ],
      correctIndex: 1,
      explanation: 'Dùng thiên địch tiêu diệt/kí sinh sâu hại là hình thức đấu tranh sinh học an toàn.'
    },
    mcq2: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Ưu điểm lớn nhất của đấu tranh sinh học so với phun thuốc trừ sâu hóa học tràn lan là gì?',
      options: [
        'A. Không gây ô nhiễm môi trường, an toàn cho sức khỏe con người và bảo toàn thiên địch có ích',
        'B. Diệt chết toàn bộ côn trùng kể cả ong mật trong 1 phút',
        'C. Làm trái cây chín ép ngay lập tức',
        'D. Diệt luôn cả cây lúa'
      ],
      correctIndex: 0,
      explanation: 'Đấu tranh sinh học nhắm trúng sâu hại, giữ sạch nông sản và nguồn nước.'
    },
    essay: {
      source: 'SGK Sinh 7 (2006)',
      question: 'Quan sát mô hình dao động Vật ăn thịt – Con mồi: Vì sao việc sử dụng thiên địch không tiêu diệt $100\\%$ sâu hại mà luôn giữ chúng ở mức cân bằng thấp?',
      hints: ['Nếu sâu hại biến mất hoàn toàn, thiên địch cũng chết đói theo; mức thấp đủ nuôi thiên địch giữ cân bằng.'],
      solutionSteps: [
        'Theo quy luật cân bằng quần thể: khi sâu hại (con mồi) giảm cực thấp, thiên địch thiếu thức ăn cũng tự giảm theo, giúp một lượng nhỏ sâu còn sót nhưng không thể bùng phát thành dịch.',
        'Nhờ sự khống chế luân phiên này mà hệ sinh thái đồng ruộng ổn định bền vững lâu dài.'
      ],
      finalAnswer: 'Giữ sâu hại ở ngưỡng thấp ổn định để duy trì luôn đàn thiên địch kiểm soát dịch lâu dài.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-8-7',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'GDPT 2006 · SGK Sinh 8 (Nhóm máu & Truyền máu)',
    sourceTag: SRC_2006_8,
    lessonNumber: 7,
    title: 'Bài 7 (SGK Sinh 8 2006): Bốn Nhóm máu ABO, Sơ đồ Truyền máu & Hai vòng Tuần hoàn Máu',
    subtitle: 'Kháng nguyên A–B trên Hồng cầu vs Kháng thể α–β trong Huyết tương, quy tắc truyền máu 250 ml và van tim một chiều',
    description:
      'Thử nghiệm phản ứng ngưng kết 4 nhóm máu A–B–AB–O trực tiếp trên lam kính ảo 2D và theo dõi dòng máu qua trái tim 3D.',
    theory1Heading: '1. Nguyên tắc Vàng Truyền máu Hệ ABO',
    theory1:
      '• Hồng cầu mang kháng nguyên **$A$** hoặc **$B$**; Huyết tương mang kháng thể **$\\alpha$** (gây kết dính $A$) và **$\\beta$** (gây kết dính $B$).\n• **Quy tắc sống còn**: **Hồng cầu người cho KHÔNG được bị kết dính bởi huyết tương người nhận**! Nhóm **O** là *Chuyên cho*; Nhóm **AB** là *Chuyên nhận*.',
    theory2Heading: '2. Hai vòng Tuần hoàn Lớn – Nhỏ & Huyết áp',
    theory2:
      '• **Vòng tuần hoàn nhỏ (Phổi)**: Tâm thất phải $\\to$ Động mạch phổi $\\to$ Mao mạch phổi (trao đổi khí thành đỏ tươi) $\\to$ Tĩnh mạch phổi $\\to$ Tâm nhĩ trái.\n• **Vòng tuần hoàn lớn (Cơ thể)**: Tâm thất trái (thành cơ dày nhất!) $\\to$ Động mạch chủ $\\to$ Toàn thân $\\to$ Tĩnh mạch chủ $\\to$ Tâm nhĩ phải.',
    keyFormulas: [
      'O \\to A, B, AB \\quad | \\quad A \\to A, AB \\quad | \\quad B \\to B, AB \\quad | \\quad AB \\to AB'
    ],
    sim2d: 'blood_typing_2d',
    sim3d: 'human_heart_3d',
    mcq1: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Bệnh nhân có nhóm máu **B** bị tai nạn cần truyền gấp một lượng máu nhỏ. Nhóm máu nào sau đây truyền được an toàn cho người này?',
      options: ['A. Chỉ nhóm A và AB', 'B. Nhóm B hoặc nhóm O', 'C. Chỉ nhóm AB', 'D. Nhóm A hoặc nhóm B'],
      correctIndex: 1,
      explanation: 'Huyết tương nhóm B có kháng thể $\\alpha$ (kết dính A) nên chỉ nhận được máu không có kháng nguyên A là B và O.'
    },
    mcq2: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Ngăn tim nào có thành cơ tim **DÀY NHẤT** vì phải tạo áp lực đẩy máu đi khắp toàn bộ cơ thể trong vòng tuần hoàn lớn?',
      options: ['A. Tâm nhĩ phải', 'B. Tâm nhĩ trái', 'C. Tâm thất phải', 'D. Tâm thất trái'],
      correctIndex: 3,
      explanation: 'Tâm thất trái bơm máu qua động mạch chủ nuôi toàn thân từ đầu tới chân nên cơ dày gấp 3 lần tâm thất phải.'
    },
    essay: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Tại sao mặc dù nhóm máu O có thể truyền lượng ít cho nhóm máu A, B, AB nhưng trong cấp cứu ngày nay bác sĩ vẫn luôn ưu tiên truyền **cùng nhóm máu**?',
      hints: ['Huyết tương người nhóm O vẫn có cả hai kháng thể α và β có thể gây phản ứng nếu truyền lượng lớn.'],
      solutionSteps: [
        'Huyết tương của người nhóm máu O chứa cả kháng thể $\\alpha$ và $\\beta$. Nếu truyền một thể tích máu quá lớn cho người nhóm A/B/AB, lượng kháng thể này có thể gây kết dính hồng cầu người nhận.',
        'Do đó quy tắc tối ưu là truyền đúng nhóm máu (A cho A, B cho B) và kiểm tra thêm hệ nhóm máu Rh trước khi truyền.'
      ],
      finalAnswer: 'Huyết tương nhóm O chứa kháng thể α, β dễ gây phản ứng nếu truyền lượng lớn.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-8-8',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'GDPT 2006 · SGK Sinh 8 (Mắt – Tai – Da)',
    sourceTag: SRC_2006_8,
    lessonNumber: 8,
    title: 'Bài 8 (SGK Sinh 8 2006): Cấu tạo Mắt – Tai, Sửa tật Cận thị & Vai trò Da Điều hòa Thân nhiệt',
    subtitle: 'Tế bào nón – que trên Điểm vàng, chuỗi xương tai giữa truyền rung âm và cơ chế giãn mạch – mồ hôi của Da',
    description:
      'Khám phá mô phỏng mắt – tai – da trong bộ Cơ quan Giác quan Người 2D và 3D.',
    theory1Heading: '1. Cơ quan phân tích Thị giác (Mắt) & Thính giác (Tai)',
    theory1:
      '• **Mắt**: Ánh sáng qua **thủy tinh thể** hội tụ đúng **màng lưới (võng mạc)** chứa tế bào nón (màu sắc) và tế bào que (ánh sáng yếu).\n• **Cận thị** (ảnh hiện TRƯỚC màng lưới): đeo **kính mặt lõm (thấu kính phân kì)**; **Viễn thị** (ảnh SAU màng lưới): đeo kính mặt lồi (hội tụ).\n• **Tai**: Sóng âm rung **màng nhĩ** $\\to$ **xương búa–đe–bàn đạp** $\\to$ dịch **ốc tai** kích thích tế bào thính giác.',
    theory2Heading: '2. Cấu tạo 3 lớp của Da & Điều hòa Thân nhiệt ($37^\\circ\\text{C}$)',
    theory2:
      '• Da gồm **Biểu bì** (tầng sừng bảo vệ), **Bì** (tuyến mồ hôi, thụ quan, mạch máu) và **Mỡ dưới da** (cách nhiệt).\n• **Trời nóng**: mạch máu dưới da **giãn** (mặt đỏ) + **tiết mồ hôi** bay hơi thu nhiệt. **Trời lạnh**: mạch máu **co**, cơ run sinh nhiệt.',
    keyFormulas: [
      '\\text{Cận thị (ảnh trước võng mạc)} \\to \\text{Kính phân kì}; \\quad \\text{Thân nhiệt ổn định } \\approx 37^\\circ\\text{C}'
    ],
    sim2d: 'human_skeleton_senses_2d',
    sim3d: 'skeleton_senses_3d',
    mcq1: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Một bạn học sinh bị cận thị chỉ nhìn rõ chữ khi đưa sát mắt. Ảnh của vật ở xa đang rơi vào đâu trong mắt bạn ấy và cần đeo loại kính gì?',
      options: [
        'A. Ảnh rơi trước màng lưới → Đeo thấu kính phân kì (mặt lõm)',
        'B. Ảnh rơi sau màng lưới → Đeo thấu kính hội tụ',
        'C. Ảnh rơi đúng điểm mù → Đeo kính râm',
        'D. Do màng nhĩ bị rách'
      ],
      correctIndex: 0,
      explanation: 'Cận thị làm ảnh rơi trước màng lưới nên dùng thấu kính phân kì lùi tiêu điểm về đúng võng mạc.'
    },
    mcq2: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Khi chạy bộ dưới trời nắng nóng, vì sao da mặt chúng ta đỏ hồng lên và vã nhiều mồ hôi?',
      options: [
        'A. Mạch máu dưới da co lại',
        'B. Mạch máu dưới da giãn rộng tăng tỏa nhiệt và tuyến mồ hôi tiết nước bay hơi làm mát cơ thể',
        'C. Cơ chân ngừng hoạt động',
        'D. Nhiệt độ cơ thể tụt xuống $32^\\circ\\text{C}$'
      ],
      correctIndex: 1,
      explanation: 'Giãn mạch ngoại vi và bay hơi mồ hôi là hai cơ chế chống nóng tự động của da.'
    },
    essay: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Vì sao khi đi máy bay lên cao hoặc đi tàu cao tốc qua hầm núi có hiện tượng ù tai, và nuốt nước bọt hay ngáp lại giúp hết ù tai ngay?',
      hints: ['Vòi nhĩ nối họng với khoang tai giữa cân bằng áp suất hai bên màng nhĩ.'],
      solutionSteps: [
        'Khi lên cao áp suất khí quyển giảm đột ngột làm không khí trong tai giữa căng đẩy phồng **màng nhĩ** gây ù tai.',
        'Động tác nuốt nước bọt hoặc ngáp mở van **vòi nhĩ** thông từ họng vào tai giữa, cân bằng áp suất hai mặt màng nhĩ tức thì.'
      ],
      finalAnswer: 'Nuốt nước bọt mở vòi nhĩ nối với họng giúp cân bằng áp suất hai bên màng nhĩ.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-8-9',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'GDPT 2006 · SGK Sinh 8 (Sơ cứu & Phòng chống Tệ nạn)',
    sourceTag: SRC_2006_8,
    lessonNumber: 9,
    title: 'Bài 9 (SGK Sinh 8 2006): Hô hấp Nhân tạo, Sơ cứu Chảy máu – Ngạt khí & Phòng tránh Nicotin, Cồn',
    subtitle: 'Quy trình ép tim – thổi ngạt cứu người đuối nước, garo cầm máu động mạch và tác hại thuốc lá – rượu bia lên Phổi & Gan',
    description:
      'Tổng hợp kiến thức Sinh học 8 (2006) bảo vệ tính mạng: cơ chế trao đổi khí phế nang 3D và đường cong gắn O₂ của Hemoglobin 2D.',
    theory1Heading: '1. Kĩ năng Sơ cứu Hô hấp Nhân tạo & Cầm máu khẩn cấp',
    theory1:
      '• **Hà hơi thổi ngạt / Ép tim**: làm thông đường thở, đặt nạn nhân nằm ngửa đầu hơi ngửa, kết hợp $30$ lần ép ngực : $2$ lần thổi ngạt.\n• **Chảy máu động mạch** (máu đỏ tươi phun thành tia): ấn động mạch phía trên vết thương (gần tim hơn) hoặc buộc dây garo rồi ghi giờ chuyển viện.',
    theory2Heading: '2. Tác hại của Khói thuốc lá (CO, Nicotin) & Rượu bia',
    theory2:
      '• Khí **$\\text{CO}$** trong khói thuốc gắn chặt với Hemoglobin làm mất khả năng chở $\\text{O}_2$ gây ngạt tế bào; nhựa thuốc lá phá hủy lông rung và phế nang gây ung thư phổi.',
    keyFormulas: [
      '\\text{Hb} + \\text{CO} \\longrightarrow \\text{HbCO (bền vững, cản trở vận chuyển O}_2\\text{)}'
    ],
    sim2d: 'bohr_hemoglobin_2d',
    sim3d: 'alveoli_capillary_3d',
    mcq1: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Tại sao người hút thuốc lá hoặc bị ngộ độc khí than tổ ong ($\text{CO}$) trong phòng kín dễ bị ngạt thở, chóng mặt nặng?',
      options: [
        'A. Khí $\\text{CO}$ kết hợp rất chặt với Hemoglobin trong hồng cầu khiến máu không còn chỗ vận chuyển khí $\\text{O}_2$',
        'B. Khí $\\text{CO}$ biến thành đường glucose',
        'C. Phổi phình to gấp đôi',
        'D. Do nhịp tim giảm về 0'
      ],
      correctIndex: 0,
      explanation: 'Ái lực của Hemoglobin với $\\text{CO}$ cao hơn $\\text{O}_2$ hơn $200$ lần, khóa chặt hồng cầu.'
    },
    mcq2: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Khi thấy vết thương ở cổ tay phun máu màu đỏ tươi thành từng nhịp đập mạnh, cần ấn giữ mạch máu hoặc đặt dây garo ở vị trí nào?',
      options: [
        'A. Phía dưới vết thương (gần bàn tay hơn)',
        'B. Phía trên vết thương (gần phía tim hơn để chặn dòng máu động mạch đi xuống)',
        'C. Bôi kem đánh răng trực tiếp',
        'D. Ngâm vào nước đá'
      ],
      correctIndex: 1,
      explanation: 'Máu động mạch chảy từ tim ra ngoại vi nên phải chặn ở vị trí giữa tim và vết thương.'
    },
    essay: {
      source: 'SGK Sinh 8 (2006)',
      question: 'Khi cứu người bị đuối nước vừa đưa lên bờ, vì sao cần nhanh chóng móc sạch bùn dị vật trong miệng trước khi thực hiện hô hấp nhân tạo?',
      hints: ['Dị vật, đờm dãi cản khí quản khiến khí thổi vào không xuống được phổi.'],
      solutionSteps: [
        'Nếu miệng và họng còn bùn đất, đờm dãi hoặc thức ăn trào ngược, việc thổi ngạt sẽ đẩy dị vật tụt sâu vào **khí quản gây bít tắc đường thở**.',
        'Làm thông thoáng đường thở trước rồi mới thực hiện ép ngực ngoài lồng ngực – thổi ngạt mới đưa được khí Oxi xuống các phế nang cứu não.'
      ],
      finalAnswer: 'Đảm bảo khí quản thông thoáng, không đẩy dị vật bít sâu vào phổi khi thổi ngạt.'
    }
  })
];
