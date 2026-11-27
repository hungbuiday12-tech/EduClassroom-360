import { BiologyLesson } from '../types';
import { makeBioLesson } from './biologyGdpt2018Lessons';

const SRC_2018_6 = 'GDPT 2018 · KHTN 6 (KNTT · CTST · Cánh Diều)';
const SRC_2018_7 = 'GDPT 2018 · KHTN 7 (KNTT · CTST · Cánh Diều)';
const SRC_2018_8 = 'GDPT 2018 · KHTN 8 (KNTT · CTST · Cánh Diều)';

export const BIOLOGY_MS_2018_LESSONS: BiologyLesson[] = [
  // ==========================================================================
  // LỚP 6 — GDPT 2018 (KHTN 6 · 6 BÀI TOÀN CHƯƠNG VẬT SỐNG)
  // ==========================================================================
  makeBioLesson({
    id: 'bio-6-b1',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Tế bào – Đơn vị Sự sống',
    sourceTag: SRC_2018_6,
    lessonNumber: 1,
    title: 'Bài 1: Kính hiển vi quang học & Cấu tạo Tế bào Nhân sơ – Nhân thực',
    subtitle: 'Cách soi mẫu vật, tính độ phóng đại kính hiển vi và phân biệt Tế bào Thực vật vs Tế bào Động vật',
    description:
      'Soi trực tiếp qua kính hiển vi ảo 2D và mô hình tế bào 3D để hiểu vì sao mọi cơ thể sống đều xây dựng từ "viên gạch" tế bào.',
    theory1Heading: '1. Kính hiển vi & 3 thành phần cơ bản của mọi Tế bào',
    theory1:
      '• Mọi tế bào đều có 3 phần chính: **Màng tế bào** (cổng kiểm soát chất ra vào), **Tế bào chất** (nơi diễn ra hoạt động sống) và **Nhân / Vùng nhân** (trung tâm điều khiển).\n• **Tế bào nhân sơ** (vi khuẩn): chưa có màng nhân; **Tế bào nhân thực** (thực vật, động vật, nấm): đã có nhân hoàn chỉnh có màng bọc.',
    theory2Heading: '2. Điểm khác biệt vàng: Tế bào Thực vật vs Động vật',
    theory2:
      '• **Tế bào Thực vật** có thêm **Thành tế bào** xenlulozơ cứng (tạo hình đa giác giúp cây đứng vững), **Lục lạp** màu xanh để quang hợp và **Không bào trung tâm lớn**.\n• **Tế bào Động vật** không có thành tế bào và lục lạp nên hình dạng linh hoạt.',
    keyFormulas: [
      '\\text{Độ phóng đại} = \\text{Độ phóng đại Thị kính} \\times \\text{Vật kính}'
    ],
    sim2d: 'microscope_cell_compare_2d',
    sim3d: 'eukaryotic_cell_3d',
    mcq1: {
      source: 'KHTN 6 · Tế bào',
      question: 'Bào quan nào chỉ có ở tế bào Thực vật giúp cây xanh hấp thụ ánh nắng tự tổng hợp chất hữu cơ?',
      options: ['A. Màng tế bào', 'B. Lục lạp', 'C. Nhân tế bào', 'D. Ti thể'],
      correctIndex: 1,
      explanation: 'Lục lạp chứa chất diệp lục màu xanh thực hiện quang hợp — điểm đặc trưng của tế bào thực vật.'
    },
    mcq2: {
      source: 'KHTN 6 · Kính hiển vi',
      question: 'Kính hiển vi quang học đang dùng thị kính $10\\times$ và vật kính $40\\times$. Ảnh tế bào được phóng đại bao nhiêu lần?',
      options: ['A. $50$ lần', 'B. $400$ lần', 'C. $4$ lần', 'D. $4000$ lần'],
      correctIndex: 1,
      explanation: '$10 \\times 40 = 400$ lần.'
    },
    essay: {
      source: 'KHTN 6 · So sánh tế bào',
      question: 'Nêu $2$ điểm giống nhau và $2$ điểm khác nhau cơ bản giữa Tế bào Thực vật và Tế bào Động vật.',
      hints: ['Giống: màng, tế bào chất, nhân hoàn chỉnh; Khác: thành tế bào và lục lạp.'],
      solutionSteps: [
        'Giống nhau: Đều là tế bào nhân thực gồm màng tế bào, tế bào chất (có ti thể) và nhân có màng nhân.',
        'Khác nhau: Tế bào thực vật có thêm thành tế bào cứng và lục lạp (cùng không bào lớn); tế bào động vật không có.'
      ],
      finalAnswer: 'Giống: Màng, tế bào chất, nhân; Khác: Thành tế bào và Lục lạp ở thực vật.'
    }
  }),
  makeBioLesson({
    id: 'bio-6-b2',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Lớn lên tế bào & Tổ chức cơ thể',
    sourceTag: SRC_2018_6,
    lessonNumber: 2,
    title: 'Bài 2: Sự lớn lên – Sinh sản của Tế bào & 5 Cấp độ Tổ chức Cơ thể',
    subtitle: 'Từ 1 tế bào phân chia thành $2^n$ tế bào giúp cơ thể lớn lên và thứ tự Tế bào → Mô → Cơ quan → Hệ cơ quan → Cơ thể',
    description:
      'Hiểu vì sao cây non lớn nhanh thành cây cổ thụ, vết trầy da tự lành lại nhờ phân chia tế bào và cách các tế bào phối hợp tạo nên cơ thể hoàn chỉnh.',
    theory1Heading: '1. Sự lớn lên và Sinh sản (Phân chia) của Tế bào',
    theory1:
      '• Tế bào lấy chất dinh dưỡng để lớn lên tới kích thước nhất định rồi **phân chia** từ $1$ tế bào mẹ thành $2$ tế bào con giống nhau.\n• Sau $n$ lần phân chia liên tiếp, từ $1$ tế bào ban đầu tạo ra **$2^n$** tế bào con, giúp cơ thể lớn lên và thay thế tế bào già/tổn thương.',
    theory2Heading: '2. Năm cấp độ tổ chức cơ thể đa bào',
    theory2:
      '• **Cơ thể đơn bào** (trùng roi, vi khuẩn): $1$ tế bào làm mọi việc.\n• **Cơ thể đa bào**: **Tế bào** $\\to$ **Mô** (nhiều tế bào cùng chức năng) $\\to$ **Cơ quan** (tim, dạ dày, lá cây) $\\to$ **Hệ cơ quan** (hệ tuần hoàn, hệ tiêu hóa) $\\to$ **Cơ thể**.',
    keyFormulas: [
      'N_{\\text{tế bào}} = 2^n \\quad (\\text{sau } n \\text{ lần phân chia})',
      '\\text{Tế bào} \\to \\text{Mô} \\to \\text{Cơ quan} \\to \\text{Hệ cơ quan} \\to \\text{Cơ thể}'
    ],
    sim2d: 'mitosis_meiosis_2d',
    sim3d: 'chromosome_mitosis_3d',
    mcq1: {
      source: 'KHTN 6 · Phân chia tế bào',
      question: 'Từ $1$ tế bào ban đầu tiến hành phân chia liên tiếp $4$ lần thì tạo thành tất cả bao nhiêu tế bào con?',
      options: ['A. $8$ tế bào', 'B. $16$ tế bào', 'C. $32$ tế bào', 'D. $4$ tế bào'],
      correctIndex: 1,
      explanation: '$2^4 = 16$ tế bào.'
    },
    mcq2: {
      source: 'KHTN 6 · Tổ chức cơ thể',
      question: 'Tim, Phổi, Gan và Lá cây xanh thuộc cấp độ tổ chức sống nào?',
      options: ['A. Tế bào', 'B. Mô', 'C. Cơ quan', 'D. Hệ cơ quan'],
      correctIndex: 2,
      explanation: 'Tim, phổi, gan, lá cây gồm nhiều mô phối hợp thực hiện một chức năng nhất định gọi là Cơ quan.'
    },
    essay: {
      source: 'KHTN 6 · Cơ thể đơn bào vs đa bào',
      question: 'Khi em bị xước nhẹ ở đầu gối, vài ngày sau lớp da mới lành lại như cũ. Quá trình sinh học nào của tế bào đã giúp làm lành vết thương đó?',
      hints: ['Các tế bào da quanh vết thương lớn lên và phân chia liên tiếp bù đắp chỗ mất.'],
      solutionSteps: [
        'Các tế bào biểu bì da khỏe mạnh xung quanh mép vết thương tiến hành lấy dinh dưỡng lớn lên và **sinh sản (phân chia)** tạo nhiều tế bào da mới.',
        'Các tế bào mới lấp đầy vùng da bị trầy giúp vết thương mau lành.'
      ],
      finalAnswer: 'Nhờ sự lớn lên và sinh sản (phân chia) của tế bào da.'
    }
  }),
  makeBioLesson({
    id: 'bio-6-b3',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Phân loại Thế giới sống',
    sourceTag: SRC_2018_6,
    lessonNumber: 3,
    title: 'Bài 3: Phân loại 5 Giới Sinh vật & Khóa Lưỡng phân',
    subtitle: 'Cách đặt tên khoa học (Chi + Loài), 7 bậc phân loại và thực hành dựng Khóa lưỡng phân nhận diện sinh vật',
    description:
      'Khám phá 5 Giới sinh vật (Khởi sinh, Nguyên sinh, Nấm, Thực vật, Động vật) và tự tay phân loại cây/con qua cây quyết định Khóa lưỡng phân 2D.',
    theory1Heading: '1. Năm Giới Sinh vật & Bảy bậc phân loại',
    theory1:
      '• **5 Giới**: (1) **Khởi sinh** (Vi khuẩn, nhân sơ), (2) **Nguyên sinh** (Trùng roi, tảo đơn bào), (3) **Nấm** (Nấm men, nấm rơm), (4) **Thực vật**, (5) **Động vật**.\n• **7 bậc phân loại** từ nhỏ đến lớn: **Loài $\\to$ Chi $\\to$ Họ $\\to$ Bộ $\\to$ Lớp $\\to$ Ngành $\\to$ Giới**.',
    theory2Heading: '2. Khóa lưỡng phân (Chia đôi liên tiếp)',
    theory2:
      '• Là bảng hướng dẫn gồm các bước phân chia nhóm sinh vật làm **2 nhánh đối lập nhau** dựa trên đặc điểm nổi bật (Ví dụ: *Có cánh / Không có cánh* $\\to$ *Có chân / Không chân*) cho tới khi tìm ra đúng từng loài.',
    keyFormulas: [
      '\\text{Loài} \\to \\text{Chi} \\to \\text{Họ} \\to \\text{Bộ} \\to \\text{Lớp} \\to \\text{Ngành} \\to \\text{Giới}'
    ],
    sim2d: 'kingdoms_invertebrates_2d',
    sim3d: 'invertebrate_biodiversity_3d',
    mcq1: {
      source: 'KHTN 6 · 5 Giới',
      question: 'Nấm rơm và nấm linh chi được xếp vào giới riêng (Giới Nấm) chứ không phải Giới Thực vật vì sao?',
      options: [
        'A. Nấm không có diệp lục, sống dị dưỡng (không tự quang hợp được)',
        'B. Nấm di chuyển chạy nhảy được',
        'C. Nấm là sinh vật nhân sơ',
        'D. Nấm không có tế bào'
      ],
      correctIndex: 0,
      explanation: 'Nấm là sinh vật nhân thực dị dưỡng (hấp thụ chất hữu cơ từ môi trường), không có lục lạp.'
    },
    mcq2: {
      source: 'KHTN 6 · Bậc phân loại',
      question: 'Bậc phân loại nhỏ nhất và cơ bản nhất gồm các cá thể giống nhau có thể giao phối sinh con hữu thụ là:',
      options: ['A. Giới', 'B. Ngành', 'C. Chi', 'D. Loài'],
      correctIndex: 3,
      explanation: 'Loài là bậc phân loại cơ sở nhỏ nhất trong 7 bậc.'
    },
    essay: {
      source: 'KHTN 6 · Khóa lưỡng phân',
      question: 'Hãy phân chia nhanh $4$ loài: *Cá chép, Chim bồ câu, Con thỏ, Con giun đất* theo $2$ bước khóa lưỡng phân.',
      hints: ['Bước 1: Có xương sống vs Không xương sống. Bước 2: Có lông vũ / Lông mao / Vảy.'],
      solutionSteps: [
        '1a. Không có xương sống $\\to$ **Giun đất**.',
        '1b. Có xương sống $\\to$ xét tiếp: (2a) Có vảy bơi dưới nước $\\to$ **Cá chép**; (2b) Có lông vũ biết bay $\\to$ **Chim bồ câu**; (2c) Có lông mao nuôi con bằng sữa $\\to$ **Con thỏ**.'
      ],
      finalAnswer: 'Tách theo xương sống $\\to$ đặc điểm da/vảy/lông.'
    }
  }),
  makeBioLesson({
    id: 'bio-6-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Virus & Vi khuẩn',
    sourceTag: SRC_2018_6,
    lessonNumber: 4,
    title: 'Bài 4: Virus – Vi khuẩn & Cách phòng chống Bệnh truyền nhiễm',
    subtitle: 'Vì sao Virus chưa phải là tế bào, vai trò Vi khuẩn làm sữa chua – phân giải rác và phòng bệnh 5K',
    description:
      'Phân biệt rõ Virus (kí sinh nội bào bắt buộc, thuốc kháng sinh không diệt được) với Vi khuẩn (tế bào nhân sơ có lợi lẫn có hại).',
    theory1Heading: '1. Virus (Chưa có tế bào) vs Vi khuẩn (Tế bào nhân sơ)',
    theory1:
      '• **Virus** (Cúm, Sốt xuất huyết, HIV): cấu tạo siêu đơn giản chỉ gồm **lõi DNA/RNA + vỏ protein**, phải xâm nhập vào tế bào chủ mới nhân lên được.\n• **Vi khuẩn** (*Lactobacillus*, trực khuẩn): đã là tế bào nhân sơ hoàn chỉnh, có màng và thành tế bào, tự sinh sản phân đôi cực nhanh.',
    theory2Heading: '2. Lợi ích & Phòng tránh bệnh do Virus – Vi khuẩn',
    theory2:
      '• **Có lợi**: Vi khuẩn lên men sữa chua, dưa muối, phân giải xác động thực vật thành phân bón cho đất.\n• **Phòng bệnh**: Tiêm vắc-xin đúng lịch, rửa tay xà phòng, ăn chín uống sôi, không tự ý uống kháng sinh khi nhiễm virus cúm.',
    keyFormulas: [
      '\\text{Virus} = \\text{Lõi di truyền (DNA/RNA)} + \\text{Vỏ protein (Capsid)}'
    ],
    sim2d: 'viral_lytic_cycle_2d',
    sim3d: 'virus_bacteriophage_3d',
    mcq1: {
      source: 'KHTN 6 · Virus vs Vi khuẩn',
      question: 'Loại thuốc kháng sinh (như Penicillin) chỉ tiêu diệt được tác nhân nào dưới đây?',
      options: ['A. Virus cúm mùa', 'B. Vi khuẩn gây viêm họng', 'C. Virus sốt xuất huyết', 'D. Virus SARS-CoV-2'],
      correctIndex: 1,
      explanation: 'Kháng sinh tác động lên thành tế bào vi khuẩn nên chỉ diệt vi khuẩn, hoàn toàn vô hiệu với virus.'
    },
    mcq2: {
      source: 'KHTN 6 · Vi khuẩn có ích',
      question: 'Quá trình làm sữa chua thành công tại nhà nhờ hoạt động lên men tạo axit lactic của sinh vật nào?',
      options: ['A. Nấm mốc', 'B. Vi khuẩn lactic có lợi', 'C. Virus thực khuẩn', 'D. Trùng giày'],
      correctIndex: 1,
      explanation: 'Vi khuẩn lactic biến đổi đường lactose trong sữa thành axit lactic giúp sữa đông tụ thơm ngon.'
    },
    essay: {
      source: 'KHTN 6 · Bảo quản thực phẩm',
      question: 'Vì sao giữ thức ăn trong tủ lạnh ($2-5^\\circ\\text{C}$) hoặc phơi khô cá mực lại giúp bảo quản lâu bị ôi thiu?',
      hints: ['Vi khuẩn gây thiu hỏng phát triển mạnh ở nhiệt độ ấm và môi trường ẩm ướt.'],
      solutionSteps: [
        'Tủ lạnh tạo nhiệt độ thấp làm **ức chế tốc độ sinh sản** của vi khuẩn và nấm mốc.',
        'Phơi khô làm **mất nước** khiến vi khuẩn không đủ độ ẩm để hoạt động và phân hủy thức ăn.'
      ],
      finalAnswer: 'Nhiệt độ thấp và môi trường khô ráo kìm hãm vi khuẩn phát triển.'
    }
  }),
  makeBioLesson({
    id: 'bio-6-b5',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Nguyên sinh vật & Nấm',
    sourceTag: SRC_2018_6,
    lessonNumber: 5,
    title: 'Bài 5: Nguyên sinh vật & Nấm — Từ Trùng sốt rét tới Nấm rơm, Nấm men',
    subtitle: 'Nhận diện trùng roi, trùng giày dưới kính hiển vi; phân biệt nấm ăn được với nấm độc sặc sỡ',
    description:
      'Quan sát thế giới tí hon trong giọt nước ao (Nguyên sinh vật) và cấu tạo sợi nấm – mũ nấm – bào tử của Giới Nấm.',
    theory1Heading: '1. Nguyên sinh vật (Nhân thực đơn bào)',
    theory1:
      '• Gồm **Trùng roi, Trùng giày, Trùng biến hình, Tảo lục đơn bào** — cơ thể chỉ $1$ tế bào nhưng đã có **nhân thực hoàn chỉnh**.\n• Một số loài gây bệnh nguy hiểm như **Trùng sốt rét** (do muỗi Anophen truyền), **Trùng kiết lị** (qua thức ăn mất vệ sinh).',
    theory2Heading: '2. Giới Nấm — Bạn hay Thù?',
    theory2:
      '• **Nấm có lợi**: Nấm rơm, nấm hương (thực phẩm giàu đạm), nấm men (làm bánh mì nở xốp), nấm mốc *Penicillium* (chiết xuất kháng sinh).\n• **Nấm có hại**: Nấm độc (thường màu sắc sặc sỡ, có vòng cuống và bao gốc), nấm mốc cơm/lạc sinh độc tố gây ung thư gan.',
    keyFormulas: [
      '\\text{Nguyên sinh vật: Đơn bào nhân thực} \\quad \\cdot \\quad \\text{Nấm: Dị dưỡng, sinh sản bào tử}'
    ],
    sim2d: 'microscope_cell_compare_2d',
    sim3d: 'eukaryotic_cell_3d',
    mcq1: {
      source: 'KHTN 6 · Nguyên sinh vật',
      question: 'Bệnh sốt rét ở người do loài nguyên sinh vật nào gây ra và qua vật trung gian nào?',
      options: [
        'A. Trùng kiết lị qua ruồi nhặng',
        'B. Trùng sốt rét truyền qua vết đốt của muỗi cái Anophen',
        'C. Trùng roi xanh qua nước uống',
        'D. Vi khuẩn lao qua không khí'
      ],
      correctIndex: 1,
      explanation: 'Kí sinh trùng sốt rét sống trong tuyến nước bọt muỗi cái Anophen và truyền vào máu khi đốt người.'
    },
    mcq2: {
      source: 'KHTN 6 · Nấm',
      question: 'Loại nấm đơn bào được dùng phổ biến để làm nở bột bánh mì là:',
      options: ['A. Nấm đùi gà', 'B. Nấm men', 'C. Mộc nhĩ', 'D. Nấm độc đỏ'],
      correctIndex: 1,
      explanation: 'Nấm men hô hấp yếm khí tạo khí $\\text{CO}_2$ làm bột bánh mì phồng xốp.'
    },
    essay: {
      source: 'KHTN 6 · An toàn thực phẩm',
      question: 'Khi đi rừng gặp những cây nấm lạ mọc dại có mũ màu đỏ sặc sỡ, ta có nên hái về nấu ăn không? Nêu $2$ nguyên tắc phòng tránh ngộ độc nấm.',
      hints: ['Tuyệt đối không ăn nấm lạ mọc hoang dại không rõ nguồn gốc.'],
      solutionSteps: [
        'Không được hái ăn vì nấm độc rừng thường có màu sắc sặc sỡ, có bao gốc hoặc vòng cổ cuống rất nguy hiểm tính mạng.',
        'Nguyên tắc: (1) Chỉ ăn các loại nấm nuôi trồng có nguồn gốc rõ ràng (nấm rơm, nấm bào ngư, nấm kim châm...); (2) Bỏ ngay thực phẩm/lạc/gạo đã lên mốc.'
      ],
      finalAnswer: 'Tuyệt đối không ăn nấm hoang lạ và thực phẩm bị mốc.'
    }
  }),
  makeBioLesson({
    id: 'bio-6-b6',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Đa dạng Thực vật & Động vật',
    sourceTag: SRC_2018_6,
    lessonNumber: 6,
    title: 'Bài 6: Đa dạng Thực vật (Rêu → Hạt kín) & Động vật – Bảo vệ Đa dạng Sinh học',
    subtitle: '4 ngành Thực vật tiến hóa và phân biệt nhanh Không xương sống vs 5 lớp Có xương sống',
    description:
      'Khép lại KHTN 6 bằng bức tranh toàn cảnh giới Thực vật (Rêu – Dương xỉ – Thông Hạt trần – Cây có Hoa Hạt kín) và giới Động vật quanh ta.',
    theory1Heading: '1. Bốn nhóm Thực vật từ thấp đến cao',
    theory1:
      '• **Rêu**: chưa có rễ thật và mạch dẫn, sống nơi ẩm ướt, sinh sản bằng **bào tử**.\n• **Dương xỉ (Quyết)**: đã có rễ, thân, lá thật và **mạch dẫn**, sinh sản bằng **bào tử**.\n• **Hạt trần** (Thông, Vạn tuế): sinh sản bằng **nón** chứa hạt nằm lộ trên lá noãn (chưa có hoa và quả).\n• **Hạt kín** (Cam, Lúa, Hoa hồng): tiến hóa nhất, có **Hoa, Quả** bao bọc bảo vệ **Hạt**.',
    theory2Heading: '2. Động vật Không xương sống & Có xương sống',
    theory2:
      '• **Không xương sống**: Ruột khoang (sứa), Giun (giun đất), Thân mềm (ốc, mực), Chân khớp (tôm, cua, côn trùng).\n• **Có xương sống**: Cá $\\to$ Lưỡng cư (ếch) $\\to$ Bò sát (rắn, rùa) $\\to$ Chim $\\to$ Thú (đẻ con, nuôi con bằng sữa mẹ).',
    keyFormulas: [
      '\\text{Rêu} \\to \\text{Dương xỉ} \\to \\text{Hạt trần (Nón)} \\to \\text{Hạt kín (Hoa & Quả)}'
    ],
    sim2d: 'plant_organs_flowering_2d',
    sim3d: 'plant_flower_seed_3d',
    mcq1: {
      source: 'KHTN 6 · Thực vật',
      question: 'Cây thông được xếp vào nhóm Thực vật Hạt trần vì đặc điểm nào?',
      options: [
        'A. Có hoa đẹp và quả mọng nước',
        'B. Chưa có hoa và quả; hạt nằm lộ trên các lá noãn hở của nón thông',
        'C. Sinh sản bằng bào tử ở mặt dưới lá',
        'D. Không có rễ và mạch dẫn'
      ],
      correctIndex: 1,
      explanation: 'Hạt trần sinh sản bằng nón, hạt nằm hở chưa được quả bao bọc.'
    },
    mcq2: {
      source: 'KHTN 6 · Động vật',
      question: 'Dơi biết bay và Cá voi sống dưới biển được xếp vào lớp Động vật nào?',
      options: ['A. Lớp Chim và Lớp Cá', 'B. Cả hai đều thuộc Lớp Thú (Động vật có vú)', 'C. Lớp Bò sát', 'D. Lớp Lưỡng cư'],
      correctIndex: 1,
      explanation: 'Dơi và Cá voi đều có lông mao, đẻ con và nuôi con bằng sữa mẹ nên đều thuộc Lớp Thú.'
    },
    essay: {
      source: 'KHTN 6 · Bảo vệ Đa dạng Sinh học',
      question: 'Nêu $3$ nguyên nhân chính làm suy giảm đa dạng sinh học và đề xuất $2$ việc học sinh có thể làm để bảo vệ thiên nhiên.',
      hints: ['Phá rừng, săn bắt trái phép, ô nhiễm nhựa/hóa chất.'],
      solutionSteps: [
        'Nguyên nhân: (1) Chặt phá đốt rừng làm mất nơi ở động vật; (2) Săn bắt, buôn bán động vật hoang dã; (3) Ô nhiễm môi trường nước, đất và biến đổi khí hậu.',
        'Hành động học sinh: Không dùng sản phẩm từ động vật quý hiếm, trồng chăm sóc cây xanh, bỏ rác đúng nơi quy định và tiết kiệm giấy/điện.'
      ],
      finalAnswer: 'Chống phá rừng, không săn bắt động vật hoang dã, giảm ô nhiễm.'
    }
  }),

  // ==========================================================================
  // LỚP 7 — GDPT 2018 (KHTN 7 · 6 BÀI TOÀN CHƯƠNG TRAO ĐỔI CHẤT – CẢM ỨNG – SINH SẢN)
  // ==========================================================================
  makeBioLesson({
    id: 'bio-7-b1',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Quang hợp ở Thực vật',
    sourceTag: SRC_2018_7,
    lessonNumber: 1,
    title: 'Bài 1: Trao đổi khí qua Khí khổng & Quang hợp ở Thực vật',
    subtitle: 'Phương trình Quang hợp tạo đường + O₂ ở lục lạp và các yếu tố ánh sáng, CO₂, nước ảnh hưởng năng suất cây',
    description:
      'Khám phá nhà máy năng lượng mặt trời tí hon bên trong lá xanh: dùng nắng + khí $\\text{CO}_2$ + nước chế tạo tinh bột nuôi sống toàn bộ hành tinh.',
    theory1Heading: '1. Bản chất & Phương trình Quang hợp',
    theory1:
      '• **Quang hợp** xảy ra ở **Lục lạp** (chủ yếu tại tế bào thịt lá) khi có **ánh sáng**.\n• Nguyên liệu vào: **Nước ($\\text{H}_2\\text{O}$)** rễ hút lên + **Carbon dioxide ($\\text{CO}_2$)** đi qua **khí khổng**.\n• Sản phẩm ra: **Đường Glucose ($\\text{C}_6\\text{H}_{12}\\text{O}_6$)** + **Khí Oxygen ($\\text{O}_2$)** thả ra không khí.',
    theory2Heading: '2. Ý nghĩa Quang hợp & Các yếu tố ảnh hưởng',
    theory2:
      '• Cây ưa sáng (lúa, ngô) cần trồng nơi quang đãng; cây ưa bóng (lá lốt, dương xỉ) trồng xen dưới tán cây cao.\n• Quang hợp hấp thụ $\\text{CO}_2$ và nhả $\\text{O}_2$ giúp điều hòa khí hậu, giảm hiệu ứng nhà kính.',
    keyFormulas: [
      '6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Ánh sáng, Diệp lục}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2\\uparrow'
    ],
    sim2d: 'photosynthesis_calvin_2d',
    sim3d: 'chloroplast_thylakoid_3d',
    mcq1: {
      source: 'KHTN 7 · Quang hợp',
      question: 'Khí nào do cây xanh hấp thụ từ không khí qua khí khổng để làm nguyên liệu cho quá trình Quang hợp?',
      options: ['A. Oxygen ($\\text{O}_2$)', 'B. Nitrogen ($\\text{N}_2$)', 'C. Carbon dioxide ($\\text{CO}_2$)', 'D. Hydrogen ($\\text{H}_2$)'],
      correctIndex: 2,
      explanation: 'Lá cây lấy khí $\\text{CO}_2$ và nước để tổng hợp chất hữu cơ dưới ánh sáng.'
    },
    mcq2: {
      source: 'KHTN 7 · Cấu tạo lá',
      question: 'Tại sao phiến lá hầu hết các loài cây đều có dạng bản dẹt rộng và xếp xen kẽ không che khuất nhau?',
      options: [
        'A. Để đón được nhiều ánh sáng mặt trời và thu nhận nhiều $\\text{CO}_2$ nhất',
        'B. Để cây nặng hơn',
        'C. Để tránh sâu bọ đậu lên',
        'D. Để giữ nước ở lại mãi không thoát'
      ],
      correctIndex: 0,
      explanation: 'Bản rộng và xếp so le giúp tối đa hóa diện tích tiếp xúc ánh sáng cho lục lạp quang hợp.'
    },
    essay: {
      source: 'KHTN 7 · Nông nghiệp thông minh',
      question: 'Vì sao trong nhà kính trồng rau hiện đại, người ta thường thắp thêm đèn LED vào mùa đông ít nắng và bơm nhẹ thêm khí $\\text{CO}_2$?',
      hints: ['Ánh sáng và $\\text{CO}_2$ là hai yếu tố trực tiếp quyết định tốc độ Quang hợp.'],
      solutionSteps: [
        'Đèn LED cung cấp thêm năng lượng ánh sáng cho lục lạp.',
        'Bổ sung $\\text{CO}_2$ làm tăng nguồn nguyên liệu đầu vào cho quang hợp, giúp cây tạo nhiều đường và tăng năng suất rau quả.'
      ],
      finalAnswer: 'Tăng cường ánh sáng và $\\text{CO}_2$ giúp tăng hiệu suất Quang hợp.'
    }
  }),
  makeBioLesson({
    id: 'bio-7-b2',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Hô hấp tế bào',
    sourceTag: SRC_2018_7,
    lessonNumber: 2,
    title: 'Bài 2: Hô hấp Tế bào ở Sinh vật & Bảo quản Nông sản',
    subtitle: 'Ti thể phân giải đường + O₂ giải phóng năng lượng ATP, đối chiếu Quang hợp vs Hô hấp và cách giữ hạt thóc nảy mầm tốt',
    description:
      'Hiểu vì sao mọi tế bào sống suốt ngày đêm đều phải hô hấp trong Ti thể và cách làm nông dân xới đất tơi xốp cho rễ cây thở.',
    theory1Heading: '1. Hô hấp tế bào diễn ra ở Ti thể suốt ngày đêm',
    theory1:
      '• Tế bào lấy **Chất hữu cơ (Glucose) + Khí $\\text{O}_2$** $\\longrightarrow$ tạo **Khí $\\text{CO}_2$ + Nước + Năng lượng (ATP & Nhiệt)**.\n• Diễn ra ở **Ti thể** suốt **cả ngày lẫn đêm** ở mọi sinh vật (thực vật, động vật, người).',
    theory2Heading: '2. Vận dụng Hô hấp vào Trồng trọt & Bảo quản nông sản',
    theory2:
      '• **Xới đất tơi xốp** giúp đất thoáng khí cho rễ cây hô hấp mạnh để hút khoáng tốt.\n• **Bảo quản hạt giống / rau quả**: giữ **khô ráo (hạt), mát lạnh ($4^\\circ\\text{C}$), nồng độ $\\text{CO}_2$ cao nhẹ** để **giảm cường độ hô hấp** tránh làm hao hụt chất dinh dưỡng và mốc hỏng.',
    keyFormulas: [
      '\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\xrightarrow{\\text{Ti thể}} 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Năng lượng (ATP + Nhiệt)}'
    ],
    sim2d: 'cellular_respiration_2d',
    sim3d: 'mitochondria_atp_3d',
    mcq1: {
      source: 'KHTN 7 · Hô hấp',
      question: 'Bào quan nào đóng vai trò là "nhà máy điện" thực hiện hô hấp tế bào tạo năng lượng ATP?',
      options: ['A. Lục lạp', 'B. Ti thể', 'C. Thành tế bào', 'D. Không bào'],
      correctIndex: 1,
      explanation: 'Ti thể là nơi phân giải glucose với Oxi để sinh năng lượng ATP cho tế bào.'
    },
    mcq2: {
      source: 'KHTN 7 · Ứng dụng thực tế',
      question: 'Vì sao khi ruộng lúa bị ngập úng sâu lâu ngày, cây lúa dễ bị thối rễ và héo chết?',
      options: [
        'A. Rễ cây bị thừa ánh sáng',
        'B. Đất ngập nước thiếu khí Oxygen khiến tế bào rễ không hô hấp được',
        'C. Nước cuốn trôi hết lục lạp',
        'D. Cây quang hợp quá mạnh'
      ],
      correctIndex: 1,
      explanation: 'Nước chiếm hết khe không khí trong đất làm rễ thiếu $\\text{O}_2$ để hô hấp, sinh chất độc gây thối rễ.'
    },
    essay: {
      source: 'KHTN 7 · So sánh Quang hợp & Hô hấp',
      question: 'Vì sao ban đêm phòng ngủ đóng kín không nên để nhiều chậu cây xanh bên trong?',
      hints: ['Ban đêm cây không quang hợp nhả $\\text{O}_2$, mà chỉ hô hấp lấy $\\text{O}_2$ và thải $\\text{CO}_2$.'],
      solutionSteps: [
        'Quang hợp cần ánh sáng nên ban đêm cây ngừng quang hợp (không tạo thêm $\\text{O}_2$).',
        'Trong khi đó, cây vẫn hô hấp suốt đêm: hút khí $\\text{O}_2$ và thải khí $\\text{CO}_2$ cùng người ngủ trong phòng kín, dễ gây thiếu Oxi ngột ngạt.'
      ],
      finalAnswer: 'Ban đêm cây ngừng quang hợp và hô hấp cạnh tranh $\\text{O}_2$ với người.'
    }
  }),
  makeBioLesson({
    id: 'bio-7-b3',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Vận chuyển chất ở Thực vật',
    sourceTag: SRC_2018_7,
    lessonNumber: 3,
    title: 'Bài 3: Vận chuyển Nước – Muối khoáng & Thoát hơi nước ở Cây',
    subtitle: 'Lông hút ở rễ, dòng mạch gỗ đi lên vs mạch rây đi xuống và lực hút kỳ diệu của sự thoát hơi nước ở lá',
    description:
      'Theo dõi dòng nước đi từ đất qua lông hút vào mạch gỗ leo lên ngọn cây cao hàng chục mét nhờ động lực thoát hơi nước ở khí khổng.',
    theory1Heading: '1. Con đường hút nước ở Rễ & Hai dòng mạch dẫn',
    theory1:
      '• **Lông hút** (tế bào biểu bì rễ kéo dài) hút nước và muối khoáng hòa tan từ đất.\n• **Mạch gỗ (đi lên)**: vận chuyển **Nước & Muối khoáng** từ rễ lên thân lá.\n• **Mạch rây (đi xuống & ngang)**: vận chuyển **Chất hữu cơ** do lá quang hợp tạo ra tới củ, quả, rễ.',
    theory2Heading: '2. Vai trò của Thoát hơi nước qua lá',
    theory2:
      '• $98\\%$ lượng nước cây hút vào được thoát hơi qua **khí khổng** ở lá! Việc này không hề lãng phí mà tạo ra **lực hút kéo nước từ rễ lên ngọn**, **hạ nhiệt chống cháy lá** dưới nắng gắt và mở khí khổng đón $\\text{CO}_2$.',
    keyFormulas: [
      '\\text{Mạch gỗ: Rễ} \\xrightarrow{\\text{Nước + Khoáng}} \\text{Thân} \\to \\text{Lá}',
      '\\text{Mạch rây: Lá} \\xrightarrow{\\text{Đường hữu cơ}} \\text{Thân, Củ, Quả, Rễ}'
    ],
    sim2d: 'plant_transpiration_2d',
    sim3d: 'plant_vascular_3d',
    mcq1: {
      source: 'KHTN 7 · Mạch dẫn ở cây',
      question: 'Nước và muối khoáng hòa tan được vận chuyển một chiều từ rễ lên thân và lá nhờ hệ thống mạch nào?',
      options: ['A. Mạch rây', 'B. Mạch gỗ', 'C. Lớp biểu bì', 'D. Lục lạp'],
      correctIndex: 1,
      explanation: 'Mạch gỗ gồm các tế bào chết hóa gỗ rỗng ruột nối thành ống dẫn nước và khoáng từ dưới lên.'
    },
    mcq2: {
      source: 'KHTN 7 · Thoát hơi nước',
      question: 'Lợi ích quan trọng nhất của quá trình thoát hơi nước qua khí khổng ở lá là gì?',
      options: [
        'A. Làm cây mất hết nước để khô héo',
        'B. Tạo lực hút kéo nước từ rễ lên ngọn và làm mát hạ nhiệt bề mặt lá',
        'C. Ngăn không cho $\\text{CO}_2$ vào lá',
        'D. Giảm tốc độ quang hợp'
      ],
      correctIndex: 1,
      explanation: 'Thoát hơi nước đóng vai trò động cơ kéo cột nước mạch gỗ lên cao và giải nhiệt cho lá.'
    },
    essay: {
      source: 'KHTN 7 · Thí nghiệm thực tế',
      question: 'Tại sao vào buổi trưa nắng hè gay gắt không nên tưới nước đẫm khi đất đang khô nóng, và vì sao khi đánh cây lớn đi trồng phải cắt tỉa bớt cành lá?',
      hints: ['Cắt bớt lá để giảm thoát hơi nước khi rễ bị đứt chưa hút bù kịp.'],
      solutionSteps: [
        'Khi đánh bứng cây, nhiều lông hút ở rễ bị đứt nên lượng nước hút vào giảm mạnh. Tỉa bớt lá giúp giảm thoát hơi nước tránh cây héo chết.',
        'Trưa nắng tưới nước dễ làm cây sốc nhiệt rễ và giọt nước đọng trên lá hội tụ nắng gây cháy lá.'
      ],
      finalAnswer: 'Tỉa lá giảm thoát hơi nước giúp cây giữ cân bằng nước chờ rễ hồi phục.'
    }
  }),
  makeBioLesson({
    id: 'bio-7-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Dinh dưỡng ở Động vật',
    sourceTag: SRC_2018_7,
    lessonNumber: 4,
    title: 'Bài 4: Trao đổi nước & Chất dinh dưỡng ở Động vật (Ống tiêu hóa)',
    subtitle: 'Hành trình thức ăn từ Miệng (Amilaza) → Dạ dày (Pepsin) → Ruột non (Hấp thụ) và nhu cầu nước hằng ngày',
    description:
      'Theo dõi hành trình thức ăn biến đổi cơ học và hóa học bởi các enzyme tiêu hóa trong ống tiêu hóa 2D & 3D.',
    theory1Heading: '1. Con đường tiêu hóa thức ăn ở Động vật & Người',
    theory1:
      '• **Khoang miệng**: Nghiền nhỏ thức ăn và enzyme **Amylase** biến tinh bột chín thành đường đôi.\n• **Dạ dày**: Co bóp nhào trộn, dịch vị **HCl + Pepsin** cắt nhỏ Protein.\n• **Ruột non**: Nơi tiêu hóa hoàn toàn và **hấp thụ gần như toàn bộ dinh dưỡng** qua các **lông ruột** vào máu.',
    theory2Heading: '2. Vai trò của Nước & Dinh dưỡng cân đối',
    theory2:
      '• Nước chiếm **$70\\%$ khối lượng cơ thể**, làm dung môi vận chuyển máu/dinh dưỡng và điều hòa thân nhiệt qua mồ hôi.\n• Cần ăn đủ 4 nhóm chất (Đường bột, Đạm, Béo, Vitamin–Khoáng), uống đủ $1{,}5-2$ lít nước/ngày.',
    keyFormulas: [
      '\\text{Miệng (Amylase)} \\to \\text{Dạ dày (Pepsin + HCl)} \\to \\text{Ruột non (Hấp thụ)}'
    ],
    sim2d: 'digestion_enzymes_2d',
    sim3d: 'digestive_tract_3d',
    mcq1: {
      source: 'KHTN 7 · Tiêu hóa',
      question: 'Bộ phận nào trong ống tiêu hóa diễn ra quá trình hấp thụ chất dinh dưỡng vào máu mạnh nhất?',
      options: ['A. Thực quản', 'B. Dạ dày', 'C. Ruột non (nhờ nếp gấp và lông ruột)', 'D. Ruột già'],
      correctIndex: 2,
      explanation: 'Ruột non rất dài và có hàng triệu lông ruột tăng diện tích hấp thụ chất dinh dưỡng.'
    },
    mcq2: {
      source: 'KHTN 7 · Chế độ nước',
      question: 'Khi bị tiêu chảy kéo dài hoặc sốt cao ra nhiều mồ hôi, điều cấp thiết nhất cần làm là gì?',
      options: [
        'A. Nhịn uống nước hoàn toàn',
        'B. Bù nước và chất điện giải (uống dung dịch Oresol pha đúng tỉ lệ)',
        'C. Ăn thật nhiều đồ cay nóng',
        'D. Tập thể dục nặng'
      ],
      correctIndex: 1,
      explanation: 'Mất nước và muối khoáng gây tụt huyết áp nguy hiểm nên cần bù Oresol kịp thời.'
    },
    essay: {
      source: 'KHTN 7 · Thói quen ăn uống',
      question: 'Giải thích vì sao "nhai kĩ no lâu" lại có lợi cho dạ dày và giúp tiêu hóa tinh bột tốt hơn?',
      hints: ['Tăng diện tích tiếp xúc cơ học và kéo dài thời gian enzyme Amylase nước bọt làm việc.'],
      solutionSteps: [
        'Nhai kĩ nghiền nhỏ thức ăn giúp giảm áp lực co bóp cho dạ dày.',
        'Đồng thời thức ăn thấm đẫm nước bọt chứa enzyme **Amylase** biến đổi trước một phần tinh bột thành đường và báo tín hiệu no kịp thời lên não.'
      ],
      finalAnswer: 'Nghiền nhỏ giảm tải dạ dày và giúp enzyme Amylase phân giải tinh bột sớm.'
    }
  }),
  makeBioLesson({
    id: 'bio-7-b5',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Cảm ứng & Tập tính',
    sourceTag: SRC_2018_7,
    lessonNumber: 5,
    title: 'Bài 5: Cảm ứng ở Sinh vật (Hướng động) & Tập tính Động vật',
    subtitle: 'Vì sao thân cây hướng nắng, rễ tìm nước và phân biệt Tập tính bẩm sinh vs Tập tính học được',
    description:
      'Khám phá khả năng phản ứng kì diệu của thực vật (hormone Auxin bẻ cong ngọn cây) và thế giới tập tính phong phú ở động vật.',
    theory1Heading: '1. Cảm ứng ở Thực vật (Hướng sáng, Hướng nước, Hướng trọng lực)',
    theory1:
      '• **Hướng sáng dương**: Ngọn cây uốn cong về phía ánh nắng do hormone Auxin tích tụ phía tối kích thích tế bào bên đó dài nhanh hơn.\n• **Hướng trọng lực dương** & **Hướng nước**: Rễ đâm xuống lòng đất và mọc hướng về nguồn ẩm.\n• **Ứng động** (cây trinh nữ cụp lá khi chạm, hoa mười giờ nở buổi sáng).',
    theory2Heading: '2. Tập tính Bẩm sinh vs Tập tính Học được',
    theory2:
      '• **Tập tính bẩm sinh** (di truyền từ bố mẹ, sinh ra đã biết): nhện chăng tơ, chim di cư tránh rét, tằm nhả tơ.\n• **Tập tính học được** (hình thành qua rèn luyện): chó sủa theo hiệu lệnh, khỉ đạp xe, em dừng xe khi thấy đèn đỏ.',
    keyFormulas: [
      '\\text{Ngọn cây: Hướng sáng } (+) \\quad \\cdot \\quad \\text{Rễ cây: Hướng đất } (+),\\ \\text{Hướng nước } (+)'
    ],
    sim2d: 'phytohormone_tropism_2d',
    sim3d: 'plant_tropism_germination_3d',
    mcq1: {
      source: 'KHTN 7 · Cảm ứng thực vật',
      question: 'Đặt một chậu cây nhỏ cạnh cửa sổ một phía có ánh nắng, sau vài ngày ngọn cây uốn cong về phía cửa sổ. Đây là hiện tượng gì?',
      options: ['A. Hướng nước âm', 'B. Hướng sáng dương của thân cây', 'C. Hướng trọng lực', 'D. Hô hấp tế bào'],
      correctIndex: 1,
      explanation: 'Thân và ngọn cây luôn có tính hướng sáng dương để đón nắng quang hợp.'
    },
    mcq2: {
      source: 'KHTN 7 · Tập tính',
      question: 'Ví dụ nào dưới đây là TẬP TÍNH HỌC ĐƯỢC ở động vật?',
      options: [
        'A. Vịt con vừa nở đã biết bơi lội',
        'B. Ong thợ xây tổ lục giác',
        'C. Cá heo nhảy qua vòng tròn lửa theo hiệu lệnh huấn luyện viên',
        'D. Ve sầu kêu vào mùa hè'
      ],
      correctIndex: 2,
      explanation: 'Cá heo nhảy qua vòng lửa là phản xạ hình thành qua quá trình huấn luyện (học được).'
    },
    essay: {
      source: 'KHTN 7 · Nông nghiệp',
      question: 'Người trồng cây cảnh hoặc trồng giàn mướp/bầu ứng dụng tính hướng tiếp xúc (hướng động) của thực vật như thế nào?',
      hints: ['Cắm cọc, làm giàn cho tua cuốn bám leo lên đón ánh nắng.'],
      solutionSteps: [
        'Cây dây leo (mướp, bầu, dưa leo, chanh dây) có tua cuốn mang tính **hướng tiếp xúc** khi chạm vào vật cứng sẽ quấn chặt quanh vật đó.',
        'Người nông dân cắm giàn tre/lưới giúp cây leo lên cao đón ánh sáng quang hợp tốt và dễ thu hoạch quả.'
      ],
      finalAnswer: 'Làm giàn leo tận dụng tính hướng tiếp xúc và hướng sáng của cây.'
    }
  }),
  makeBioLesson({
    id: 'bio-7-b6',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Sinh trưởng – Sinh sản',
    sourceTag: SRC_2018_7,
    lessonNumber: 6,
    title: 'Bài 6: Sinh trưởng – Phát triển & Sinh sản Vô tính / Hữu tính ở Sinh vật',
    subtitle: 'Biến thái ở bướm/ếch, nhân giống cây bằng chiết – ghép cành và cấu tạo Hoa – Thụ tinh – Tạo Quả & Hạt',
    description:
      'Hiểu mối liên hệ giữa Sinh trưởng (tăng kích thước) và Phát triển (biến đổi hình thái chức năng), đồng thời quan sát cấu tạo Hoa và sự hình thành hạt trên mô hình 3D.',
    theory1Heading: '1. Sinh trưởng, Phát triển & Các nhân tố điều khiển',
    theory1:
      '• **Sinh trưởng**: tăng kích thước và khối lượng cơ thể (bé cao lên, thân cây to ra).\n• **Phát triển**: gồm sinh trưởng + phân hóa tế bào + biến đổi hình thái (nòng nọc đứt đuôi thành ếch, cây ra hoa kết quả).',
    theory2Heading: '2. Sinh sản Vô tính vs Sinh sản Hữu tính',
    theory2:
      '• **Sinh sản vô tính**: từ một cơ quan sinh dưỡng của cây mẹ (**giâm, chiết, ghép, nuôi cấy mô**) $\\to$ con giống hệt mẹ, giữ nguyên giống ngon.\n• **Sinh sản hữu tính ở Thực vật có hoa**: hạt phấn rơi lên đầu nhụy (**thụ phấn**) $\\to$ tinh tử kết hợp tế bào trứng (**thụ tinh**) $\\to$ **bầu nhụy thành Quả**, **noãn thành Hạt**.',
    keyFormulas: [
      '\\text{Bầu nhụy} \\to \\text{Quả}; \\quad \\text{Noãn đã thụ tinh} \\to \\text{Hạt}'
    ],
    sim2d: 'plant_organs_flowering_2d',
    sim3d: 'plant_flower_seed_3d',
    mcq1: {
      source: 'KHTN 7 · Sinh sản thực vật',
      question: 'Ưu điểm lớn nhất của phương pháp CHIẾT CÀNH và GHÉP CÀNH so với gieo hạt ở cây ăn quả (cam, xoài, bưởi) là gì?',
      options: [
        'A. Tạo ra nhiều giống lai mới lạ',
        'B. Giữ nguyên đặc tính quả ngon của cây mẹ và rút ngắn thời gian thu hoạch',
        'C. Không cần chăm sóc tưới nước',
        'D. Cây sống bất tử mãi mãi'
      ],
      correctIndex: 1,
      explanation: 'Chiết/ghép là sinh sản vô tính giữ nguyên bộ gen quý của cây mẹ và cây mau ra quả hơn gieo hạt.'
    },
    mcq2: {
      source: 'KHTN 7 · Thụ tinh ở hoa',
      question: 'Ở thực vật có hoa, sau khi thụ tinh thành công thì Quả và Hạt phát triển từ bộ phận nào của hoa?',
      options: [
        'A. Bầu nhụy thành Quả, Noãn thành Hạt',
        'B. Bao phấn thành Quả, Cánh hoa thành Hạt',
        'C. Đài hoa thành Quả, Nhị hoa thành Hạt',
        'D. Cuống hoa thành Quả, Đầu nhụy thành Hạt'
      ],
      correctIndex: 0,
      explanation: 'Bầu nhụy phát triển dày lên thành quả, noãn bên trong phát triển thành hạt.'
    },
    essay: {
      source: 'KHTN 7 · Thực hành nông nghiệp',
      question: 'Tại sao vào mùa hoa nhãn, hoa vải nở rộ, người nuôi ong thường mang đàn ong đặt gần vườn cây giúp cả người trồng cây lẫn người nuôi ong đều được lợi?',
      hints: ['Ong lấy mật hoa làm thức ăn, đồng thời chân và thân ong dính hạt phấn giúp thụ phấn chéo cho hoa.'],
      solutionSteps: [
        'Ong bay đi hút mật và thu phấn hoa để tạo mật ong.',
        'Trong quá trình đậu từ hoa này sang hoa khác, ong vô tình chuyển hạt phấn từ nhị sang đầu nhụy nhiều cây khác nhau (**thụ phấn nhờ côn trùng**), làm tăng mạnh tỉ lệ đậu quả cho vườn nhãn, vải.'
      ],
      finalAnswer: 'Ong thu mật và giúp thụ phấn chéo làm tăng tỉ lệ đậu quả cho cây.'
    }
  }),

  // ==========================================================================
  // LỚP 8 — GDPT 2018 (KHTN 8 · 6 BÀI TOÀN CHƯƠNG CƠ THỂ NGƯỜI & SINH THÁI HỌC)
  // ==========================================================================
  makeBioLesson({
    id: 'bio-8-b1',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Vận động & Tiêu hóa Người',
    sourceTag: SRC_2018_8,
    lessonNumber: 1,
    title: 'Bài 1: Hệ Vận động (Xương – Cơ) & Hệ Tiêu hóa – Dinh dưỡng Người',
    subtitle: 'Thành phần chất hữu cơ (dẻo) + khoáng (cứng) của xương, cơ chế co cơ gập tay và sơ đồ tiêu hóa ở Người',
    description:
      'Tìm hiểu bộ khung xương + hệ cơ vận động đúng tư thế tránh cong vẹo cột sống, kết hợp bản đồ hoạt động của 3 enzyme tiêu hóa chủ chốt.',
    theory1Heading: '1. Hệ Vận động: Xương, Khớp & Cơ vân',
    theory1:
      '• **Xương** gồm **chất hữu cơ (cốt giao)** giúp xương đàn hồi dẻo dai và **muối khoáng (Canxi, Photpho)** giúp xương cứng chắc.\n• Cơ bám vào xương qua gân; khi cơ nhị đầu co thì cơ tam đầu duỗi giúp gập cẳng tay. Ngồi học thẳng lưng, đeo cặp hai vai để tránh **cong vẹo cột sống**.',
    theory2Heading: '2. Hệ Tiêu hóa & An toàn Vệ sinh Thực phẩm',
    theory2:
      '• Tiêu hóa gồm **Biến đổi cơ học** (nhai, co bóp dạ dày) và **Biến đổi hóa học** (enzyme **Amylase** ở miệng cắt tinh bột, **Pepsin** ở dạ dày cắt Protein, dịch tụy/mật/ruột hoàn tất ở ruột non).\n• Phòng ngộ độc thực phẩm: ăn chín uống sôi, bảo quản đúng nhiệt độ.',
    keyFormulas: [
      '\\text{Xương} = \\text{Chất hữu cơ (dẻo)} + \\text{Muối khoáng Ca, P (cứng)}',
      '\\text{Tinh bột} \\xrightarrow{\\text{Amylase}} \\text{Đường} \\quad | \\quad \\text{Protein} \\xrightarrow{\\text{Pepsin}} \\text{Peptide}'
    ],
    sim2d: 'digestion_enzymes_2d',
    sim3d: 'digestive_tract_3d',
    mcq1: {
      source: 'KHTN 8 · Hệ vận động',
      question: 'Vì sao xương trẻ em dẻo dai dễ uốn hơn còn xương người cao tuổi lại giòn dễ gãy khi ngã?',
      options: [
        'A. Xương trẻ em có nhiều chất hữu cơ dẻo dai hơn, còn xương người già tỉ lệ chất khoáng cao hơn chất hữu cơ',
        'B. Xương người già làm hoàn toàn bằng sụn',
        'C. Trẻ em không có canxi trong xương',
        'D. Người già có ít khớp hơn'
      ],
      correctIndex: 0,
      explanation: 'Khi tuổi cao, tỉ lệ chất hữu cơ cốt giao giảm xuống còn khoáng vô cơ tăng làm xương giòn dễ gãy.'
    },
    mcq2: {
      source: 'KHTN 8 · Tiêu hóa',
      question: 'Dịch mật do Gan tiết ra và đổ vào tá tràng (đầu ruột non) giúp tiêu hóa nhóm chất nào dễ dàng hơn?',
      options: ['A. Tinh bột', 'B. Lipid (Chất béo / dầu mỡ)', 'C. Xenlulozơ', 'D. Muối khoáng'],
      correctIndex: 1,
      explanation: 'Muối mật nhũ tương hóa các giọt mỡ lớn thành giọt nhỏ li ti để enzyme Lipase cắt dễ dàng.'
    },
    essay: {
      source: 'KHTN 8 · Sơ cứu chấn thương',
      question: 'Khi một bạn không may bị gãy xương cẳng tay trong giờ thể dục, ta cần sơ cứu ban đầu đúng cách như thế nào trước khi đưa tới bệnh viện?',
      hints: ['Cố định tạm thời hai đầu khớp bằng nẹp gỗ/tre, không tự ý nắn bẻ xương.'],
      solutionSteps: [
        '1. Giữ nguyên tư thế nhẹ nhàng, **không tự ý nắn bẻ** làm đầu xương gãy đâm rách mạch máu.',
        '2. Đặt hai thanh nẹp nhẹ dọc theo cẳng tay (có lót bông/vải mềm bên trong) dài qua cả khớp cổ tay và khớp khuỷu.',
        '3. Băng cố định vừa chặt tay, treo tay lên cổ bằng khăn tam giác rồi đưa ngay tới cơ sở y tế.'
      ],
      finalAnswer: 'Đặt nẹp lót mềm cố định qua hai khớp trên dưới vùng gãy rồi chuyển tới bệnh viện.'
    }
  }),
  makeBioLesson({
    id: 'bio-8-b2',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Máu – Tuần hoàn – Miễn dịch',
    sourceTag: SRC_2018_8,
    lessonNumber: 2,
    title: 'Bài 2: Máu, Nhóm máu ABO, Hệ Tuần hoàn & Miễn dịch – Vắc-xin',
    subtitle: 'Chức năng 3 tế bào máu, nguyên tắc truyền máu không ngưng kết, tim 4 ngăn và cơ chế vắc-xin bảo vệ cơ thể',
    description:
      'Thực hành thử phản ứng nhóm máu A, B, AB, O trong phòng thí nghiệm 2D và quan sát 2 vòng tuần hoàn máu bơm qua quả tim 3D.',
    theory1Heading: '1. Thành phần Máu & Nguyên tắc Truyền máu ABO',
    theory1:
      '• **Hồng cầu** (chứa Hemoglobin chở $\\text{O}_2$), **Bạch cầu** (thực bào & tạo kháng thể diệt khuẩn), **Tiểu cầu** (giải phóng enzyme làm đông máu bịt vết thương).\n• **Truyền máu**: Không để kháng thể huyết tương người nhận làm **ngưng kết** hồng cầu người cho $\\implies$ Nhóm **O** truyền cho cả 4 nhóm; nhóm **AB** nhận từ cả 4 nhóm.',
    theory2Heading: '2. Hệ Tuần hoàn & Miễn dịch – Vắc-xin',
    theory2:
      '• **Tim 4 ngăn** co bóp đẩy máu đi nuôi cơ thể qua động mạch, trao đổi chất tại **mao mạch** và trở về tim qua tĩnh mạch.\n• **Vắc-xin** chứa kháng nguyên suy yếu giúp cơ thể tạo sẵn **kháng thể + tế bào nhớ**, phản ứng tiêu diệt nhanh nếu mầm bệnh thật xâm nhập.',
    keyFormulas: [
      '\\text{O} \\to \\text{A, B} \\to \\text{AB} \\quad (\\text{Sơ đồ truyền máu ABO})'
    ],
    sim2d: 'blood_typing_2d',
    sim3d: 'human_heart_3d',
    mcq1: {
      source: 'KHTN 8 · Nhóm máu',
      question: 'Trong cấp cứu truyền hồng cầu, người mang nhóm máu AB có thể NHẬN được máu từ các nhóm máu nào?',
      options: ['A. Chỉ nhận máu AB', 'B. Chỉ nhận máu O', 'C. Nhận được cả A, B, AB và O', 'D. Chỉ nhận A và B'],
      correctIndex: 2,
      explanation: 'Huyết tương người nhóm AB không có kháng thể $\\alpha$ và $\\beta$ nên không gây ngưng kết hồng cầu nhóm nào.'
    },
    mcq2: {
      source: 'KHTN 8 · Miễn dịch',
      question: 'Tế bào máu nào đảm nhiệm chức năng thực bào nuốt vi khuẩn và tiết kháng thể bảo vệ cơ thể?',
      options: ['A. Hồng cầu', 'B. Bạch cầu', 'C. Tiểu cầu', 'D. Huyết tương'],
      correctIndex: 1,
      explanation: 'Bạch cầu là lực lượng phòng vệ miễn dịch chủ lực của cơ thể.'
    },
    essay: {
      source: 'KHTN 8 · Sức khỏe tim mạch',
      question: 'Giải thích vì sao tập thể dục đều đặn vừa sức hằng ngày lại giúp trái tim khỏe mạnh và nhịp tim lúc nghỉ ngơi chậm rãi, ổn định hơn?',
      hints: ['Cơ tim phát triển dày khỏe hơn giúp mỗi nhát bóp đẩy được nhiều máu hơn.'],
      solutionSteps: [
        'Vận động thể thao giúp cơ tim phát triển săn chắc, tăng thể tích tâm thu (lượng máu bơm mỗi nhát đập tăng lên).',
        'Nhờ mỗi nhát bóp đẩy được nhiều máu hơn nên lúc nghỉ ngơi tim không cần đập dồn dập mà vẫn cấp đủ $\\text{O}_2$ cho cơ thể.'
      ],
      finalAnswer: 'Tăng sức co bóp cơ tim và thể tích máu mỗi nhát đập.'
    }
  }),
  makeBioLesson({
    id: 'bio-8-b3',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Hô hấp & Bài tiết',
    sourceTag: SRC_2018_8,
    lessonNumber: 3,
    title: 'Bài 3: Hệ Hô hấp (Phế nang) & Hệ Bài tiết Thận lọc máu',
    subtitle: 'Cơ chế hít vào – thở ra của cơ hoành, trao đổi khí O₂/CO₂ tại phế nang và lọc máu tại đơn vị thận Nephron',
    description:
      'Quan sát cách lá phổi giãn nở lấy Oxi vào hồng cầu ở phế nang 3D và cách hai quả thận lọc bỏ urê độc hại giữ lại máu sạch.',
    theory1Heading: '1. Thông khí phổi & Trao đổi khí tại Phế nang',
    theory1:
      '• **Hít vào**: Cơ liên sườn ngoài và **cơ hoành co** (hạ xuống) $\\to$ lồng ngực mở rộng $\\to$ áp suất phổi giảm kéo khí giàu $\\text{O}_2$ vào.\n• **Thở ra**: Cơ giãn $\\to$ lồng ngực thu nhỏ đẩy khí giàu $\\text{CO}_2$ ra ngoài.\n• Tại **phế nang**, $\\text{O}_2$ khuếch tán vào mao mạch máu, $\\text{CO}_2$ đi ngược ra phế nang.',
    theory2Heading: '2. Hệ Bài tiết Nước tiểu (Thận & Nephron)',
    theory2:
      '• Mỗi quả thận chứa khoảng $1$ triệu đơn vị lọc **Nephron** gồm cầu thận lọc máu tạo nước tiểu đầu, ống thận **hấp thụ lại** nước và chất bổ (glucose) rồi thải chất độc **urê** thành nước tiểu chính thức xuống bóng đái.',
    keyFormulas: [
      '\\text{Hít vào: Cơ co} \\to V_{\\text{lồng ngực}} \\uparrow; \\quad \\text{Thở ra: Cơ giãn} \\to V_{\\text{lồng ngực}} \\downarrow'
    ],
    sim2d: 'bohr_hemoglobin_2d',
    sim3d: 'alveoli_capillary_3d',
    mcq1: {
      source: 'KHTN 8 · Hô hấp',
      question: 'Trong động tác HÍT VÀO bình thường, trạng thái của cơ hoành và thể tích lồng ngực thay đổi như thế nào?',
      options: [
        'A. Cơ hoành dãn vồng lên, thể tích lồng ngực giảm',
        'B. Cơ hoành co hạ xuống dưới, thể tích lồng ngực tăng lên',
        'C. Cơ hoành đứng yên',
        'D. Lồng ngực xẹp xuống'
      ],
      correctIndex: 1,
      explanation: 'Cơ hoành co hạ xuống làm tăng chiều dọc lồng ngực để hút không khí vào phổi.'
    },
    mcq2: {
      source: 'KHTN 8 · Bài tiết',
      question: 'Cơ quan đóng vai trò lọc sạch máu thải ra khoảng $90\\%$ chất thải chứa nitơ (urê, axit uric) ra ngoài theo đường nước tiểu là:',
      options: ['A. Phổi', 'B. Da', 'C. Hai quả Thận', 'D. Dạ dày'],
      correctIndex: 2,
      explanation: 'Thận lọc máu liên tục qua các nephron để loại bỏ chất độc và giữ cân bằng nước muối.'
    },
    essay: {
      source: 'KHTN 8 · Bảo vệ Thận & Phổi',
      question: 'Nêu $2$ thói quen xấu dễ gây bệnh sỏi thận/suy thận và $2$ biện pháp đơn giản bảo vệ hệ bài tiết khỏe mạnh.',
      hints: ['Uống ít nước, nhịn tiểu, ăn quá mặn.'],
      solutionSteps: [
        'Thói quen xấu: (1) Uống quá ít nước khiến nước tiểu đặc dễ kết tinh sỏi thận; (2) Thường xuyên nhịn tiểu hoặc ăn quá mặn.',
        'Biện pháp bảo vệ: Uống đủ $1{,}5 - 2$ lít nước mỗi ngày, ăn nhạt vừa phải, không nhịn đi vệ sinh và giữ vệ sinh sạch sẽ.'
      ],
      finalAnswer: 'Uống đủ nước, ăn bớt mặn và không nhịn tiểu.'
    }
  }),
  makeBioLesson({
    id: 'bio-8-b4',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Thần kinh, Giác quan & Nội tiết',
    sourceTag: SRC_2018_8,
    lessonNumber: 4,
    title: 'Bài 4: Hệ Thần kinh, Giác quan (Mắt – Tai) & Tuyến Nội tiết – Điều hòa Thân nhiệt',
    subtitle: '5 khâu cung phản xạ, sửa tật cận thị mắt bằng thấu kính phân kì và hormone Insulin – Thyroxine',
    description:
      'Khám phá đường truyền xung điện qua sợi trục nơ-ron 2D/3D, cách mắt nhìn rõ vật – chống cận thị học đường và vai trò tuyến tụy/tuyến giáp.',
    theory1Heading: '1. Nơ-ron thần kinh & Cung phản xạ 5 khâu',
    theory1:
      '• **Nơ-ron** gồm thân tế bào, sợi nhánh và sợi trục truyền xung thần kinh một chiều qua khớp **xináp**.\n• **5 khâu cung phản xạ**: Cơ quan thụ cảm $\\to$ Nơ-ron hướng tâm $\\to$ Trung ương thần kinh (tủy/não) $\\to$ Nơ-ron li tâm $\\to$ Cơ quan phản ứng.',
    theory2Heading: '2. Mắt (Cận thị/Viễn thị), Tai & Nội tiết – Thân nhiệt',
    theory2:
      '• **Cận thị** (ảnh hiện **trước màng lưới** do cầu mắt dài/thể thủy tinh phồng): khắc phục bằng đeo **kính cận (thấu kính phân kì)**.\n• **Tuyến tụy** tiết **Insulin** hạ đường huyết (thiếu gây tiểu đường); **tuyến giáp** tiết **Thyroxine** (thiếu iốt gây bướu cổ). Cơ thể giữ thân nhiệt $37^\\circ\\text{C}$ nhờ dãn mạch, đổ mồ hôi hoặc run cơ.',
    keyFormulas: [
      '\\text{Cận thị: Ảnh trước màng lưới} \\to \\text{Đeo thấu kính phân kì}',
      '\\text{Tuyến tụy: Insulin } (\\downarrow\\text{ Đường huyết}) \\quad \\cdot \\quad \\text{Glucagon } (\\uparrow\\text{ Đường huyết})'
    ],
    sim2d: 'action_potential_2d',
    sim3d: 'neuron_synapse_3d',
    mcq1: {
      source: 'KHTN 8 · Giác quan Mắt',
      question: 'Học sinh bị tật CẬN THỊ muốn nhìn rõ bảng chữ ở xa phải đeo loại kính nào?',
      options: ['A. Thấu kính hội tụ', 'B. Thấu kính phân kì (mặt lõm)', 'C. Gương cầu lồi', 'D. Kính lúp'],
      correctIndex: 1,
      explanation: 'Người cận thị có ảnh hội tụ trước võng mạc nên cần đeo thấu kính phân kì để đẩy ảnh lùi ra đúng màng lưới.'
    },
    mcq2: {
      source: 'KHTN 8 · Nội tiết',
      question: 'Thiếu nguyên tố khoáng vi lượng nào trong khẩu phần ăn dễ khiến tuyến giáp phình to gây bệnh bướu cổ?',
      options: ['A. Sắt (Fe)', 'B. Iodine (Iốt)', 'C. Canxi (Ca)', 'D. Kẽm (Zn)'],
      correctIndex: 1,
      explanation: 'Tuyến giáp cần Iốt để tổng hợp hormone Thyroxine; thiếu Iốt tuyến phải phì đại gây bướu cổ.'
    },
    essay: {
      source: 'KHTN 8 · Phòng chống Cận thị học đường',
      question: 'Nêu $3$ nguyên tắc vàng giúp học sinh phòng tránh tật cận thị khi học bài và dùng thiết bị điện tử.',
      hints: ['Khoảng cách mắt – vở, ánh sáng, quy tắc nghỉ mắt 20–20–20.'],
      solutionSteps: [
        '1. Giữ khoảng cách từ mắt đến trang sách đúng chuẩn $30-35\\text{ cm}$, không nằm đọc hoặc đọc nơi thiếu sáng.',
        '2. Áp dụng quy tắc **20–20–20**: cứ sau $20$ phút nhìn màn hình, nhìn xa $20\\text{ feet}$ ($\\approx 6\\text{ m}$) trong $20$ giây để mắt thư giãn.',
        '3. Tăng thời gian hoạt động ngoài trời dưới ánh sáng tự nhiên và bổ sung vitamin A.'
      ],
      finalAnswer: 'Đọc đúng khoảng cách đủ sáng, nghỉ mắt định kì và tăng vận động ngoài trời.'
    }
  }),
  makeBioLesson({
    id: 'bio-8-b5',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Quần thể & Quần xã',
    sourceTag: SRC_2018_8,
    lessonNumber: 5,
    title: 'Bài 5: Môi trường sống, Quần thể & Quần xã Sinh vật',
    subtitle: 'Phân biệt Nhân tố vô sinh vs hữu sinh, mật độ quần thể – đường cong tăng trưởng chữ S và độ đa dạng quần xã',
    description:
      'Tìm hiểu 4 môi trường sống trên Trái Đất, cách phân biệt nhanh một Quần thể (1 loài) với Quần xã (nhiều loài) và quan sát mô hình tăng trưởng quần thể.',
    theory1Heading: '1. Môi trường sống & Quần thể Sinh vật',
    theory1:
      '• **4 môi trường sống**: Nước, Trên cạn (đất–không khí), Trong đất, Sinh vật (kí sinh).\n• **Quần thể** là tập hợp các cá thể **CÙNG MỘT LOÀI** sống chung một khoảng không gian, thời gian xác định và có thể giao phối sinh sản (bầy voi rừng Nam Cát Tiên, rặng tre làng).',
    theory2Heading: '2. Quần xã Sinh vật & Cân bằng tự nhiên',
    theory2:
      '• **Quần xã** là tập hợp nhiều quần thể **KHÁC LOÀI** cùng sống chung và gắn bó chặt chẽ (rừng ngập mặn gồm đước + cua + cá + chim).\n• Loài có số lượng đông và hoạt động mạnh nhất gọi là **loài ưu thế**; loài chỉ có riêng ở một nơi gọi là **loài đặc trưng** (sao la ở Trường Sơn, voọc Cát Bà).',
    keyFormulas: [
      '\\text{Mật độ quần thể} = \\frac{\\text{Số lượng cá thể}}{\\text{Diện tích hoặc Thể tích nơi ở}}'
    ],
    sim2d: 'logistic_population_2d',
    sim3d: 'ecosystem_biome_3d',
    mcq1: {
      source: 'KHTN 8 · Quần thể vs Quần xã',
      question: 'Tập hợp nào sau đây được gọi là một QUẦN THỂ sinh vật?',
      options: [
        'A. Các loài cá chép, cá trắm, tôm sống chung trong một ao',
        'B. Tập hợp cây cọ mọc trên một quả đồi ở Phú Thọ',
        'C. Toàn bộ cây xanh và chim thú trong rừng Cúc Phương',
        'D. Gà, vịt, lợn nuôi trong chuồng trại'
      ],
      correctIndex: 1,
      explanation: 'Đồi cọ Phú Thọ gồm các cá thể cùng một loài cây cọ gắn bó tự nhiên.'
    },
    mcq2: {
      source: 'KHTN 8 · Nhân tố sinh thái',
      question: 'Nhóm nào sau đây chỉ gồm các nhân tố sinh thái VÔ SINH?',
      options: [
        'A. Ánh sáng, Nhiệt độ, Độ ẩm, Độ pH đất',
        'B. Cây xanh, Sâu ăn lá, Chim sâu',
        'C. Vi khuẩn, Nấm, Gió, Ánh sáng',
        'D. Sư tử, Linh dương, Nước'
      ],
      correctIndex: 0,
      explanation: 'Ánh sáng, nhiệt độ, độ ẩm, pH đất là các yếu tố vật lí – hóa học không sống (vô sinh).'
    },
    essay: {
      source: 'KHTN 8 · Mật độ quần thể',
      question: 'Một hồ nuôi cá có diện tích mặt nước $2000\\text{ m}^2$, người ta ước tính có khoảng $4000$ con cá chép. Tính mật độ cá chép trong hồ và nêu hậu quả nếu thả nuôi mật độ quá dày.',
      hints: ['Mật độ $= 4000 / 2000$.'],
      solutionSteps: [
        'Mật độ quần thể cá chép: $\\frac{4000}{2000} = 2\\text{ con/m}^2$.',
        'Nếu nuôi quá dày, cá sẽ thiếu Oxi hòa tan, cạnh tranh thức ăn gay gắt và dễ bùng phát dịch bệnh chết hàng loạt.'
      ],
      finalAnswer: '$2\\text{ con/m}^2$; nuôi quá dày gây thiếu Oxi, thiếu thức ăn và dịch bệnh.'
    }
  }),
  makeBioLesson({
    id: 'bio-8-b6',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Hệ sinh thái & Sinh quyển',
    sourceTag: SRC_2018_8,
    lessonNumber: 6,
    title: 'Bài 6: Hệ sinh thái, Chuỗi – Lưới thức ăn, Tháp sinh thái & Sinh quyển',
    subtitle: '3 thành phần hệ sinh thái (Sản xuất – Tiêu thụ – Phân giải), quy tắc dòng năng lượng 10% và bảo vệ khí hậu toàn cầu',
    description:
      'Khép lại KHTN 8 bằng mô hình Hệ sinh thái khép kín: mặt trời nuôi cây xanh, năng lượng truyền qua chuỗi thức ăn và được vi sinh vật tuần hoàn lại đất.',
    theory1Heading: '1. Hệ sinh thái & 3 nhóm Sinh vật chính',
    theory1:
      '• **Hệ sinh thái** = Quần xã sinh vật $+$ Sinh cảnh (môi trường vô sinh).\n• Gồm 3 mắt xích không thể thiếu: (1) **Sinh vật sản xuất** (Cây xanh tự dưỡng), (2) **Sinh vật tiêu thụ** (Động vật ăn cỏ/ăn thịt), (3) **Sinh vật phân giải** (Vi khuẩn, nấm biến xác chết thành chất khoáng trả lại cho đất).',
    theory2Heading: '2. Chuỗi – Lưới thức ăn & Tháp sinh thái',
    theory2:
      '• Chuỗi thức ăn: $\\text{Cây lúa} \\to \\text{Chuột đồng} \\to \\text{Rắn} \\to \\text{Diều hâu}$.\n• Khi lên mỗi bậc dinh dưỡng cao hơn, **năng lượng giảm mạnh (chỉ giữ lại khoảng $10\\%$)** nên số lượng thú săn mồi đầu bảng bao giờ cũng ít hơn nhiều so với thực vật ở đáy tháp.',
    keyFormulas: [
      '\\text{Hiệu suất truyền năng lượng qua mỗi bậc tháp} \\approx 10\\%',
      '\\text{Hệ sinh thái} = \\text{Quần xã} + \\text{Sinh cảnh}'
    ],
    sim2d: 'trophic_pyramid_2d',
    sim3d: 'ecosystem_biome_3d',
    mcq1: {
      source: 'KHTN 8 · Chuỗi thức ăn',
      question: 'Trong hệ sinh thái rừng, nếu nhóm Sinh vật phân giải (vi khuẩn, nấm đất) bị tiêu diệt hoàn toàn thì điều gì sẽ xảy ra?',
      options: [
        'A. Rừng sẽ ngày càng xanh tốt hơn',
        'B. Lá rụng và xác động vật chất đống không phân hủy, cây thiếu chất khoáng rồi hệ sinh thái sụp đổ',
        'C. Động vật ăn cỏ tăng vọt mãi mãi',
        'D. Không có ảnh hưởng gì'
      ],
      correctIndex: 1,
      explanation: 'Sinh vật phân giải khép kín vòng tuần hoàn vật chất trả lại muối khoáng cho đất nuôi cây.'
    },
    mcq2: {
      source: 'KHTN 8 · Tháp sinh thái',
      question: 'Giả sử năng lượng tích lũy ở cỏ (bậc 1) là $100\\,000\\text{ kcal}$, hiệu suất sinh thái qua mỗi bậc là $10\\%$. Năng lượng tới được bậc 3 (ếch ăn châu chấu) khoảng bao nhiêu?',
      options: ['A. $10\\,000\\text{ kcal}$', 'B. $1000\\text{ kcal}$', 'C. $100\\text{ kcal}$', 'D. $50\\,000\\text{ kcal}$'],
      correctIndex: 1,
      explanation: 'Cỏ ($100\\,000$) $\\to$ Châu chấu ($10\\,000$) $\\to$ Ếch ($1000\\text{ kcal}$).'
    },
    essay: {
      source: 'KHTN 8 · Lưới thức ăn',
      question: 'Từ các sinh vật: *Cây ngô, Sâu đục thân, Chuột đồng, Cú mèo, Rắn hổ mang, Châu chấu*. Hãy viết $2$ chuỗi thức ăn có ít nhất $4$ mắt xích.',
      hints: ['Bắt đầu cả 2 chuỗi từ Sinh vật sản xuất là Cây ngô.'],
      solutionSteps: [
        'Chuỗi 1: $\\text{Cây ngô} \\to \\text{Chuột đồng} \\to \\text{Rắn hổ mang} \\to \\text{Cú mèo}$.',
        'Chuỗi 2: $\\text{Cây ngô} \\to \\text{Châu chấu} \\to \\text{Rắn hổ mang} \\to \\text{Cú mèo}$ (hoặc $\\text{Cây ngô} \\to \\text{Chuột đồng} \\to \\text{Cú mèo}$).'
      ],
      finalAnswer: 'Hai chuỗi bắt đầu từ Cây ngô, kết thúc ở loài tiêu thụ bậc cao Cú mèo.'
    }
  })
];
