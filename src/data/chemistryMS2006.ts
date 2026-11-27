import { ChemistryLesson } from '../types';
import { makeChemLesson } from './chemistryGdpt2018Lessons';

const SRC_2006_6 = 'GDPT 2006 · Nền tảng Chất & Không khí (Cầu nối Lớp 6)';
const SRC_2006_7 = 'GDPT 2006 · Cầu nối Nguyên tử – Nguyên tố lên Hóa 8';
const SRC_2006_8 = 'GDPT 2006 · SGK Hóa học 8 (NXB Giáo dục)';

export const CHEMISTRY_MS_2006_LESSONS: ChemistryLesson[] = [
  // ==========================================================================
  // LỚP 6 — GDPT 2006 (3 BÀI CẦU NỐI CHUẨN BỊ LÊN HÓA 8)
  // ==========================================================================
  makeChemLesson({
    id: 'chem-2006-6-1',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 6 (Vật thể & Chất)',
    sourceTag: SRC_2006_6,
    lessonNumber: 1,
    title: 'Vật thể – Chất & Tính chất vật lí cố định (Cầu nối Lớp 6 hệ 2006)',
    subtitle: 'Phân biệt vật thể tự nhiên/nhân tạo với chất tạo nên chúng và nhận biết chất tinh khiết qua nhiệt độ nóng chảy/sôi',
    description:
      'Trong chương trình GDPT 2006, môn Hóa học bắt đầu chính thức từ Lớp 8. Bài cầu nối Lớp 6 này giúp bạn nắm sớm khái niệm Vật thể – Chất và 3 thể Rắn – Lỏng – Khí.',
    theory1Heading: '1. Vật thể tự nhiên/nhân tạo và Chất cấu tạo',
    theory1:
      '• **Vật thể** là đồ vật cụ thể xung quanh ta: cây mía (vật thể tự nhiên), chiếc cốc thủy tinh (vật thể nhân tạo).\n• **Chất** là nguyên liệu làm nên vật thể (đường saccarozơ trong mía, thủy tinh làm cốc, nhôm làm ấm đun).',
    theory2Heading: '2. Tính chất vật lí của Chất tinh khiết',
    theory2:
      '• Mỗi **chất tinh khiết** có nhiệt độ nóng chảy, nhiệt độ sôi và khối lượng riêng không đổi: nước cất sôi đúng $100^\\circ\\text{C}$ và đông đặc đúng $0^\\circ\\text{C}$.',
    keyFormulas: [
      'D_{\\text{nước}} = 1\\text{ g/cm}^3 = 1000\\text{ kg/m}^3',
      'T_{\\text{nc (nước đá)}} = 0^\\circ\\text{C}; \\quad T_{\\text{sôi (nước cất)}} = 100^\\circ\\text{C}'
    ],
    sim2d: 'states_of_matter_2d',
    sim3d: 'matter_states_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Trong câu: "Dây dẫn điện có lõi bằng đồng và vỏ bọc bằng nhựa dẻo", đâu là tên các CHẤT?',
      options: ['A. Dây dẫn điện', 'B. Đồng và nhựa', 'C. Vỏ bọc và lõi', 'D. Dòng điện'],
      correctIndex: 1,
      explanation: 'Dây dẫn là vật thể; đồng và nhựa là các chất cấu tạo nên nó.'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Dấu hiệu nào giúp nhận ra một mẫu chất lỏng là NƯỚC CẤT TINH KHIẾT?',
      options: [
        'A. Sôi dần từ $98^\\circ\\text{C}$ đến $103^\\circ\\text{C}$',
        'B. Sôi ở nhiệt độ cố định đúng $100^\\circ\\text{C}$ và bay hơi hết không để lại cặn',
        'C. Có vị hơi mặn',
        'D. Có bọt khí đục'
      ],
      correctIndex: 1,
      explanation: 'Chất tinh khiết có hằng số nhiệt độ sôi xác định và không lẫn tạp chất.'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Kể tên $2$ vật thể tự nhiên và $2$ vật thể nhân tạo, đồng thời nêu ít nhất $1$ chất chính tạo nên mỗi vật thể đó.',
      hints: ['Tự nhiên: thân cây mía (xenlulozơ, đường), hạt gạo (tinh bột); Nhân tạo: cái cuốc (sắt, gỗ), chai nước (nhựa).'],
      solutionSteps: [
        'Vật thể tự nhiên: Cây mía (chất đường saccarozơ, nước, xenlulozơ); Con cá (nước, protein, chất béo).',
        'Vật thể nhân tạo: Chiếc nồi nhôm (kim loại nhôm); Lưỡi kéo thép (sắt, cacbon).'
      ],
      finalAnswer: 'Nêu đúng 2 vật thể tự nhiên, 2 vật thể nhân tạo và chất cấu tạo.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-6-2',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 6 (Không khí & Sự cháy)',
    sourceTag: SRC_2006_6,
    lessonNumber: 2,
    title: 'Không khí, Khí Oxi & Sự cháy – Hô hấp (Cầu nối Lớp 6 hệ 2006)',
    subtitle: 'Tìm hiểu tỉ lệ 21% Oxi – 78% Nitơ trong không khí và điều kiện phát sinh – dập tắt sự cháy',
    description:
      'Làm quen sớm vai trò của khí Oxi ($O_2$) và khí Cacbonic ($CO_2$) trong đời sống để chuẩn bị bước vào Chương IV SGK Hóa học 8 (2006).',
    theory1Heading: '1. Thành phần Không khí & Khí Oxi',
    theory1:
      '• Không khí gồm khoảng **$21\\%$ khí Oxi ($\\text{O}_2$)**, **$78\\%$ khí Nitơ ($\\text{N}_2$)** và **$1\\%$** khí khác ($\\text{CO}_2$, hơi nước).\n• Oxi cần cho người/động vật hô hấp và làm cho mọi nhiên liệu bùng cháy.',
    theory2Heading: '2. Cách nhận biết $O_2$ và Bảo vệ không khí',
    theory2:
      '• Đưa que đóm còn tàn đỏ vào ống nghiệm đựng khí Oxi $\\to$ que đóm **bùng cháy lại**.\n• Dập tắt đám cháy bằng cách hạ nhiệt độ (phun nước với củi) hoặc cách li Oxi (trùm chăn ẩm, phủ cát).',
    keyFormulas: [
      '\\text{Không khí} \\approx 21\\%\\,\\text{O}_2 + 78\\%\\,\\text{N}_2 + 1\\%\\,\\text{khí khác}'
    ],
    sim2d: 'oxygen_combustion_2d',
    sim3d: 'combustion_reactor_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Trong không khí, chất khí nào duy trì sự sống của con người và sự cháy của bếp than?',
      options: ['A. Khí Nitơ', 'B. Khí Oxi ($\\text{O}_2$)', 'C. Khí Cacbonic', 'D. Khí Hiđro'],
      correctIndex: 1,
      explanation: 'Khí Oxi chiếm 21% thể tích không khí là khí duy trì hô hấp và sự cháy.'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Tại sao không dùng nước để dập đám cháy xăng dầu trên mặt đường?',
      options: [
        'A. Xăng dầu nhẹ hơn nước nên nổi lên trên mặt nước và tiếp tục cháy lan rộng',
        'B. Nước làm xăng đông đặc',
        'C. Nước biến thành oxi',
        'D. Vì nước quá nặng'
      ],
      correctIndex: 0,
      explanation: 'Xăng dầu không tan và nhẹ hơn nước nên nổi lềnh bềnh theo dòng nước làm lửa lan rộng hơn.'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Để bếp củi đang cháy âm ỉ nhanh bén lửa bùng to hơn, người ta thường làm gì và vì sao?',
      hints: ['Cần cung cấp thêm khí Oxi và tăng diện tích tiếp xúc.'],
      solutionSteps: [
        'Thường chẻ củi vừa phải xếp thoáng có khe hở và quạt nhẹ gió vào bếp.',
        'Cách làm này giúp luồng không khí giàu khí Oxi lưu thông liên tục tiếp xúc với than củi.'
      ],
      finalAnswer: 'Xếp thoáng và quạt gió nhẹ để cung cấp thêm khí Oxi.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-6-3',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 6 (Hỗn hợp & Tách chất)',
    sourceTag: SRC_2006_6,
    lessonNumber: 3,
    title: 'Hỗn hợp & Cách tách chất: Lọc – Bay hơi – Chiết – Nam châm (Cầu nối Lớp 6 hệ 2006)',
    subtitle: 'Chọn dụng cụ tách cát, muối ăn, dầu ăn, bột sắt dựa theo sự khác biệt tính chất vật lí',
    description:
      'Làm quen các dụng cụ tách chất cơ bản (phễu lọc, bát sứ cô cạn, phễu chiết, nam châm) ngay trên mô phỏng 2D và 3D.',
    theory1Heading: '1. Nguyên tắc tách chất ra khỏi Hỗn hợp',
    theory1:
      '• Muốn tách riêng từng chất trong hỗn hợp, ta dựa vào **tính chất vật lí khác nhau** của chúng (tính tan trong nước, khối lượng riêng, nhiệt độ sôi, từ tính).',
    theory2Heading: '2. Bốn phương pháp tách chất cơ bản',
    theory2:
      '• **Lọc**: tách rắn không tan khỏi chất lỏng (cát + nước).\n• **Bay hơi / Cô cạn**: tách rắn tan bền nhiệt khỏi nước (làm muối biển).\n• **Chiết**: tách hai chất lỏng tách lớp không hòa tan (dầu ăn + nước).\n• **Nam châm**: hút bột sắt ra khỏi bột lưu huỳnh/gỗ.',
    keyFormulas: [
      '\\text{Lọc (không tan)} \\cdot \\text{Cô cạn (tan bền nhiệt)} \\cdot \\text{Chiết (lỏng 2 lớp)}'
    ],
    sim2d: 'mixture_separation_2d',
    sim3d: 'separation_lab_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Để tách bột sắt ($\\text{Fe}$) bị lẫn trong bột gỗ mùn cưa khô nhanh nhất, ta dùng:',
      options: ['A. Đổ vào phễu lọc', 'B. Dùng thanh nam châm rà qua hỗn hợp', 'C. Đun nóng chảy', 'D. Dùng phễu chiết'],
      correctIndex: 1,
      explanation: 'Nam châm hút sạch bột sắt có từ tính ra khỏi mùn cưa.'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Nước biển chứa nhiều muối ăn hòa tan. Để thu được muối ăn tinh thể từ nước biển, ta dùng cách nào?',
      options: ['A. Lọc qua giấy', 'B. Phơi nắng cho nước bay hơi (cô cạn)', 'C. Chiết bằng phễu', 'D. Thổi không khí qua'],
      correctIndex: 1,
      explanation: 'Nước bay hơi ở nhiệt độ thường/nắng nóng để lại muối kết tinh.'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Một hỗn hợp gồm dầu ăn, nước muối và cát. Nêu thứ tự các bước tách riêng cả 3 thành phần (cát, dầu ăn và muối tinh).',
      hints: ['Chiết lớp dầu nổi trên cùng trước, rồi lọc cát, cuối cùng cô cạn nước muối.'],
      solutionSteps: [
        '1. Đổ hỗn hợp vào phễu chiết để yên tách lớp $\\to$ xả phần nước muối lẫn cát xuống cốc, giữ lại **dầu ăn** ở lớp trên.',
        '2. Đem phần nước muối lẫn cát đổ qua phễu giấy lọc $\\to$ giữ lại **cát** trên giấy lọc.',
        '3. Đun cô cạn dung dịch nước muối trong suốt $\\to$ nước bay hơi hết thu được **muối tinh**.'
      ],
      finalAnswer: 'Chiết (lấy dầu ăn) $\\to$ Lọc (lấy cát) $\\to$ Cô cạn (lấy muối).'
    }
  }),

  // ==========================================================================
  // LỚP 7 — GDPT 2006 (3 BÀI CẦU NỐI NGUYÊN TỬ – KÍ HIỆU – HÓA TRỊ LÊN HÓA 8)
  // ==========================================================================
  makeChemLesson({
    id: 'chem-2006-7-1',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 7 (Nguyên tử & đvC)',
    sourceTag: SRC_2006_7,
    lessonNumber: 1,
    title: 'Nguyên tử, Lớp vỏ Electron & Đơn vị Cacbon đvC (Cầu nối Lớp 7 hệ 2006)',
    subtitle: 'Cấu tạo hạt nhân (proton +, nơtron 0) + lớp electron và quy ước 1 đvC bằng 1/12 khối lượng nguyên tử Cacbon',
    description:
      'Làm quen sớm cấu trúc nguyên tử và đơn vị khối lượng nguyên tử theo SGK 2006 (đơn vị cacbon — đvC) để học bứt phá ngay khi vào Hóa học 8.',
    theory1Heading: '1. Cấu tạo Nguyên tử ($p, n, e$)',
    theory1:
      '• Hạt nhân mang điện dương gồm **proton ($p, +$)** và **nơtron ($n, 0$)**.\n• Lớp vỏ gồm các **electron ($e, -$)** sắp xếp theo từng lớp ($2 - 8 - 8...$).\n• Vì nguyên tử trung hòa điện nên **Số $p$ = Số $e$**.',
    theory2Heading: '2. Đơn vị Cacbon (đvC) & Nguyên tử khối',
    theory2:
      '• Theo SGK 2006, $1\\text{ đvC}$ quy ước bằng $\\frac{1}{12}$ khối lượng của nguyên tử Cacbon ($\\text{C} = 12\\text{ đvC}$).\n• Nhờ đó: $\\text{H} = 1, \\text{O} = 16, \\text{Na} = 23, \\text{S} = 32, \\text{Fe} = 56, \\text{Cu} = 64\\text{ đvC}$.',
    keyFormulas: [
      '\\text{Số } p = \\text{Số } e',
      '1\\text{ đvC} = \\frac{1}{12} m_{\\text{C}}'
    ],
    sim2d: 'bohr_shells_2d',
    sim3d: 'atomic_orbitals_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Nguyên tử X có tổng số electron ở lớp vỏ là $13$. Số proton trong hạt nhân nguyên tử X là:',
      options: ['A. $12$', 'B. $13$', 'C. $14$', 'D. $26$'],
      correctIndex: 1,
      explanation: 'Trong mọi nguyên tử trung hòa điện, số $p$ bằng đúng số $e = 13$.'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Theo quy ước SGK 2006, nguyên tử khối của nguyên tố Oxi và Sắt lần lượt là:',
      options: ['A. $12$ và $32$ đvC', 'B. $16$ và $56$ đvC', 'C. $14$ và $64$ đvC', 'D. $32$ và $56$ đvC'],
      correctIndex: 1,
      explanation: 'Oxi có nguyên tử khối $16$ đvC, Sắt là $56$ đvC.'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Nguyên tử Cacbon có nguyên tử khối $12\\text{ đvC}$, nguyên tử Magie nặng gấp $2$ lần nguyên tử Cacbon. Tính nguyên tử khối của Magie.',
      hints: ['Nhân $12 \\cdot 2$.'],
      solutionSteps: [
        'Nguyên tử khối Magie $= 2 \\cdot 12 = 24\\text{ đvC}$.'
      ],
      finalAnswer: '$24\\text{ đvC}$.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-7-2',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 7 (Kí hiệu & Phân tử)',
    sourceTag: SRC_2006_7,
    lessonNumber: 2,
    title: 'Nguyên tố, Kí hiệu hóa học, Đơn chất – Hợp chất & Phân tử khối (Cầu nối Lớp 7 hệ 2006)',
    subtitle: 'Thuộc tên tiếng Việt 2006 (Oxi, Hiđro, Natri, Sắt, Đồng) và cách tính nhanh Phân tử khối',
    description:
      'Nắm chắc bảng kí hiệu hóa học truyền thống hệ 2006 và kĩ năng tính Phân tử khối để không bị bỡ ngỡ khi lập phương trình ở Lớp 8.',
    theory1Heading: '1. Kí hiệu Hóa học & Tên gọi SGK 2006',
    theory1:
      '• Các nguyên tố hay gặp: $\\text{H}$ (Hiđro, 1), $\\text{C}$ (Cacbon, 12), $\\text{N}$ (Nitơ, 14), $\\text{O}$ (Oxi, 16), $\\text{Na}$ (Natri, 23), $\\text{Mg}$ (Magie, 24), $\\text{Al}$ (Nhôm, 27), $\\text{S}$ (Lưu huỳnh, 32), $\\text{Cl}$ (Clo, 35,5), $\\text{K}$ (Kali, 39), $\\text{Ca}$ (Canxi, 40), $\\text{Fe}$ (Sắt, 56), $\\text{Cu}$ (Đồng, 64), $\\text{Zn}$ (Kẽm, 65).',
    theory2Heading: '2. Phân tử & Phân tử khối (đvC)',
    theory2:
      '• **Đơn chất** do 1 nguyên tố tạo nên ($\\text{H}_2, \\text{O}_2, \\text{Fe}$); **Hợp chất** do từ 2 nguyên tố trở lên tạo nên ($\\text{H}_2\\text{O}, \\text{NaCl}, \\text{CaCO}_3$).\n• **Phân tử khối** là tổng nguyên tử khối các nguyên tử trong phân tử.',
    keyFormulas: [
      '\\text{PTK}(\\text{H}_2\\text{SO}_4) = 2\\cdot 1 + 32 + 4\\cdot 16 = 98\\text{ đvC}'
    ],
    sim2d: 'bohr_shells_2d',
    sim3d: 'ionic_covalent_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Kí hiệu hóa học của hai nguyên tố Natri và Kali lần lượt là:',
      options: ['A. $\\text{N}$ và $\\text{K}$', 'B. $\\text{Na}$ và $\\text{K}$', 'C. $\\text{Na}$ và $\\text{Ca}$', 'D. $\\text{Ni}$ và $\\text{P}$'],
      correctIndex: 1,
      explanation: 'Natri là Na ($23$ đvC), Kali là K ($39$ đvC).'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Phân tử khối của đá vôi $\\text{CaCO}_3$ (biết $\\text{Ca}=40, \\text{C}=12, \\text{O}=16$) là:',
      options: ['A. $68\\text{ đvC}$', 'B. $84\\text{ đvC}$', 'C. $100\\text{ đvC}$', 'D. $116\\text{ đvC}$'],
      correctIndex: 2,
      explanation: '$40 + 12 + 3 \\cdot 16 = 100\\text{ đvC}$.'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Tính phân tử khối của hai hợp chất sau: $\\text{CuSO}_4$ và $\\text{Fe(OH)}_3$ (cho $\\text{Cu}=64, \\text{S}=32, \\text{O}=16, \\text{Fe}=56, \\text{H}=1$).',
      hints: ['Trong $\\text{Fe(OH)}_3$ có 1 Fe, 3 O và 3 H.'],
      solutionSteps: [
        '$\\text{PTK}(\\text{CuSO}_4) = 64 + 32 + 4 \\cdot 16 = 160\\text{ đvC}$.',
        '$\\text{PTK}(\\text{Fe(OH)}_3) = 56 + 3 \\cdot (16 + 1) = 56 + 51 = 107\\text{ đvC}$.'
      ],
      finalAnswer: '$160\\text{ đvC}$ và $107\\text{ đvC}$.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-7-3',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 7 (Hóa trị)',
    sourceTag: SRC_2006_7,
    lessonNumber: 3,
    title: 'Hóa trị & Quy tắc lập Công thức hóa học $x \\cdot a = y \\cdot b$ (Cầu nối Lớp 7 hệ 2006)',
    subtitle: 'Cách thuộc nhanh hóa trị I–II–III và lập chính xác công thức oxit, axit, bazơ, muối',
    description:
      'Làm chủ quy tắc hóa trị $x \\cdot a = y \\cdot b$ — kĩ năng quan trọng nhất để viết đúng mọi phương trình hóa học trong SGK Hóa 8.',
    theory1Heading: '1. Hóa trị nguyên tố & Nhóm nguyên tử hay gặp',
    theory1:
      '• Hóa trị **I**: $\\text{H, Na, K, Ag, Cl}$, nhóm $\\text{OH, NO}_3$.\n• Hóa trị **II**: $\\text{O, Mg, Ca, Ba, Zn, Cu}$, nhóm $\\text{SO}_4, \\text{CO}_3$.\n• Hóa trị **III**: $\\text{Al}$, nhóm $\\text{PO}_4$; Sắt $\\text{Fe}$ có hóa trị **II** và **III**.',
    theory2Heading: '2. Quy tắc Hóa trị $x \\cdot a = y \\cdot b$',
    theory2:
      '• Trong công thức $A_x^a B_y^b$, tích chỉ số và hóa trị của nguyên tố/nhóm này bằng tích của nguyên tố/nhóm kia: **$x \\cdot a = y \\cdot b$** $\\implies \\frac{x}{y} = \\frac{b}{a}$ (tối giản).',
    keyFormulas: [
      'A_x^a B_y^b \\implies x \\cdot a = y \\cdot b \\implies \\frac{x}{y} = \\frac{b}{a}'
    ],
    sim2d: 'bohr_shells_2d',
    sim3d: 'ionic_covalent_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Lập công thức hóa học của hợp chất tạo bởi $\\text{Ba}$ (hóa trị II) và nhóm $\\text{PO}_4$ (hóa trị III):',
      options: ['A. $\\text{BaPO}_4$', 'B. $\\text{Ba}_2(\\text{PO}_4)_3$', 'C. $\\text{Ba}_3(\\text{PO}_4)_2$', 'D. $\\text{Ba}_3\\text{PO}_4$'],
      correctIndex: 2,
      explanation: 'Đặt chéo hóa trị: chỉ số Ba là $3$, chỉ số nhóm $\\text{PO}_4$ là $2 \\implies \\text{Ba}_3(\\text{PO}_4)_2$.'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Trong công thức $\\text{Cr}_2\\text{O}_3$ (với O hóa trị II), hóa trị của nguyên tố Crom ($\\text{Cr}$) là:',
      options: ['A. I', 'B. II', 'C. III', 'D. VI'],
      correctIndex: 2,
      explanation: '$2 \\cdot a = 3 \\cdot II \\implies a = III$.'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Lập nhanh công thức hóa học của 2 hợp chất: (a) $\\text{P(V)}$ với $\\text{O(II)}$; (b) $\\text{Ca(II)}$ với nhóm $\\text{NO}_3\\text{(I)}$.',
      hints: ['Dùng quy tắc đặt chéo $x \\cdot a = y \\cdot b$.'],
      solutionSteps: [
        '(a) $\\text{P}_x^V \\text{O}_y^{II} \\implies x=2, y=5 \\implies \\text{P}_2\\text{O}_5$.',
        '(b) $\\text{Ca}_x^{II}(\\text{NO}_3)_y^I \\implies x=1, y=2 \\implies \\text{Ca(NO}_3)_2$.'
      ],
      finalAnswer: '(a) $\\text{P}_2\\text{O}_5$; (b) $\\text{Ca(NO}_3)_2$.'
    }
  }),

  // ==========================================================================
  // LỚP 8 — GDPT 2006 (SGK HÓA HỌC 8 · ĐỦ 6 CHƯƠNG I → VI)
  // ==========================================================================
  makeChemLesson({
    id: 'chem-2006-8-1',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'SGK Hóa 8 (2006) · Chương I: Chất – Nguyên tử – Phân tử',
    sourceTag: SRC_2006_8,
    lessonNumber: 1,
    title: 'Chương I (Hóa 8 2006): Chất – Nguyên tử – Nguyên tố – Phân tử & Quy tắc Hóa trị',
    subtitle: 'Hệ thống toàn bộ Chương I SGK Hóa học 8: đơn vị cacbon đvC, đơn chất vs hợp chất và lập CTHH chính xác',
    description:
      'Ôn trọn Chương I SGK Hóa học 8 (2006): phân biệt nguyên tử với phân tử, đơn chất kim loại vs phi kim và vận dụng thành thạo quy tắc hóa trị.',
    theory1Heading: '1. Nguyên tử – Nguyên tố – Đơn chất & Hợp chất',
    theory1:
      '• **Nguyên tử** gồm hạt nhân ($p+, n0$) và lớp vỏ ($e-$); số $p = e$.\n• **Đơn chất** do 1 nguyên tố tạo nên (kim loại viết $1$ kí hiệu: $\\text{Fe, Cu}$; phi kim khí thường có chỉ số $2$: $\\text{H}_2, \\text{O}_2, \\text{N}_2, \\text{Cl}_2$).\n• **Hợp chất** do từ 2 nguyên tố hóa học trở lên tạo nên ($\\text{H}_2\\text{O}, \\text{H}_2\\text{SO}_4$).',
    theory2Heading: '2. Ý nghĩa Công thức Hóa học & Hóa trị',
    theory2:
      '• Mỗi công thức hóa học cho biết $3$ ý: (1) Các nguyên tố tạo chất, (2) Số nguyên tử mỗi nguyên tố trong $1$ phân tử, (3) Phân tử khối của chất.\n• Kiểm tra công thức đúng hay sai bằng **$x \\cdot a = y \\cdot b$**.',
    keyFormulas: [
      'p = e; \\quad x \\cdot a = y \\cdot b',
      '\\text{PTK} = \\sum (\\text{Chỉ số} \\times \\text{NTK})'
    ],
    sim2d: 'bohr_shells_2d',
    sim3d: 'ionic_covalent_3d',
    mcq1: {
      source: 'SGK Hóa 8 (2006) · Chương I',
      question: 'Công thức hóa học nào sau đây viết SAI theo quy tắc hóa trị (cho $\\text{Na(I)}, \\text{Mg(II)}, \\text{Al(III)}, \\text{O(II)}, \\text{Cl(I)}$)?',
      options: ['A. $\\text{Na}_2\\text{O}$', 'B. $\\text{MgCl}_2$', 'C. $\\text{AlO}$', 'D. $\\text{Al}_2\\text{O}_3$'],
      correctIndex: 2,
      explanation: 'Al hóa trị III, O hóa trị II nên $1\\cdot III \\neq 1\\cdot II$; công thức đúng phải là $\\text{Al}_2\\text{O}_3$.'
    },
    mcq2: {
      source: 'SGK Hóa 8 (2006) · Chương I',
      question: 'Công thức $\\text{Fe}_2(\\text{SO}_4)_3$ cho biết trong $1$ phân tử có bao nhiêu nguyên tử Oxi?',
      options: ['A. $4$', 'B. $7$', 'C. $12$', 'D. $3$'],
      correctIndex: 2,
      explanation: 'Mỗi nhóm $\\text{SO}_4$ có $4$ Oxi, có $3$ nhóm nên tổng có $4 \\cdot 3 = 12$ nguyên tử Oxi.'
    },
    essay: {
      source: 'SGK Hóa 8 (2006) · Chương I',
      question: 'Một hợp chất khí X tạo bởi Nitơ và Oxi có phân tử khối $46\\text{ đvC}$, biết trong phân tử chỉ có $1$ nguyên tử Nitơ ($\\text{N}=14, \\text{O}=16$). Tìm công thức của X và hóa trị của Nitơ trong X.',
      hints: ['Lấy $46 - 14$ để tìm khối lượng phần Oxi, rồi chia cho $16$.'],
      solutionSteps: [
        'Khối lượng các nguyên tử Oxi trong X: $46 - 14 = 32\\text{ đvC} \\implies$ số nguyên tử Oxi $= 32 / 16 = 2$.',
        'Công thức phân tử của X là $\\text{NO}_2$.',
        'Theo quy tắc hóa trị: $1 \\cdot a = 2 \\cdot II \\implies$ Nitơ có hóa trị **IV**.'
      ],
      finalAnswer: 'Công thức $\\text{NO}_2$; hóa trị N là IV.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-8-2',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'SGK Hóa 8 (2006) · Chương II: Phản ứng hóa học',
    sourceTag: SRC_2006_8,
    lessonNumber: 2,
    title: 'Chương II (Hóa 8 2006): Hiện tượng Hóa học, Bảo toàn Khối lượng & Lập PTHH',
    subtitle: 'Phân biệt hiện tượng vật lí vs hóa học, viết phương trình chữ – công thức hóa học và cân bằng PTHH',
    description:
      'Làm chủ Chương II SGK Hóa học 8 (2006): giải thích bản chất phản ứng chỉ làm đổi liên kết nguyên tử, bảo toàn khối lượng và 3 bước lập PTHH.',
    theory1Heading: '1. Hiện tượng Vật lí vs Hiện tượng Hóa học & Phản ứng',
    theory1:
      '• **Hiện tượng vật lí**: chất biến đổi hình dạng/trạng thái nhưng vẫn giữ nguyên là chất ban đầu.\n• **Hiện tượng hóa học**: có sự biến đổi từ chất này sang chất khác (tạo chất mới).\n• Trong phản ứng hóa học, **liên kết giữa các nguyên tử thay đổi**, còn số nguyên tử mỗi nguyên tố giữ nguyên.',
    theory2Heading: '2. Định luật Bảo toàn Khối lượng & Lập PTHH',
    theory2:
      '• Tổng khối lượng các chất sản phẩm bằng tổng khối lượng các chất tham gia: $m_A + m_B = m_C + m_D$.\n• Khi cân bằng PTHH: luôn bắt đầu từ nguyên tố có số nguyên tử không bằng nhau nhiều nhất (hoặc làm chẵn số lẻ nguyên tử Oxi/Hiđro), chỉ đặt **hệ số** trước công thức.',
    keyFormulas: [
      'm_{\\text{chất tham gia}} = m_{\\text{sản phẩm}}'
    ],
    sim2d: 'mass_conservation_2d',
    sim3d: 'mass_balance_3d',
    mcq1: {
      source: 'SGK Hóa 8 (2006) · Chương II',
      question: 'Đốt cháy hoàn toàn $3{,}1\\text{ g}$ Photpho ($\\text{P}$) trong khí Oxi thu được $7{,}1\\text{ g}$ điphotpho pentaoxit ($\\text{P}_2\\text{O}_5$). Khối lượng khí Oxi đã phản ứng là:',
      options: ['A. $10{,}2\\text{ g}$', 'B. $4{,}0\\text{ g}$', 'C. $3{,}2\\text{ g}$', 'D. $4{,}8\\text{ g}$'],
      correctIndex: 1,
      explanation: 'Theo BTKL: $m_{\\text{O}_2} = 7{,}1 - 3{,}1 = 4{,}0\\text{ g}$.'
    },
    mcq2: {
      source: 'SGK Hóa 8 (2006) · Chương II',
      question: 'Phương trình hóa học nào sau đây cân bằng ĐÚNG?',
      options: [
        'A. $\\text{P} + \\text{O}_2 \\xrightarrow{t^\\circ} \\text{P}_2\\text{O}_5$',
        'B. $4\\text{P} + 5\\text{O}_2 \\xrightarrow{t^\\circ} 2\\text{P}_2\\text{O}_5$',
        'C. $2\\text{P} + 5\\text{O}_2 \\xrightarrow{t^\\circ} \\text{P}_2\\text{O}_5$',
        'D. $2\\text{Fe} + 2\\text{HCl} \\to 2\\text{FeCl}_2 + \\text{H}_2$'
      ],
      correctIndex: 1,
      explanation: 'Vế trái có $4\\text{ P}$ và $10\\text{ O}$; vế phải $2\\text{P}_2\\text{O}_5$ cũng có $4\\text{ P}$ và $10\\text{ O}$.'
    },
    essay: {
      source: 'SGK Hóa 8 (2006) · Chương II',
      question: 'Lập PTHH của các sơ đồ sau: (a) $\\text{Fe(OH)}_3 \\xrightarrow{t^\\circ} \\text{Fe}_2\\text{O}_3 + \\text{H}_2\\text{O}$; (b) $\\text{Al} + \\text{CuSO}_4 \\to \\text{Al}_2(\\text{SO}_4)_3 + \\text{Cu}$.',
      hints: ['(a) Đặt 2 trước $\\text{Fe(OH)}_3$; (b) Đặt 3 trước $\\text{CuSO}_4$ để cân bằng nhóm $\\text{SO}_4$.'],
      solutionSteps: [
        '(a) $2\\text{Fe(OH)}_3 \\xrightarrow{t^\\circ} \\text{Fe}_2\\text{O}_3 + 3\\text{H}_2\\text{O}$.',
        '(b) $2\\text{Al} + 3\\text{CuSO}_4 \\to \\text{Al}_2(\\text{SO}_4)_3 + 3\\text{Cu}$.'
      ],
      finalAnswer: '(a) $2 : 1 : 3$; (b) $2 : 3 : 1 : 3$.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-8-3',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'SGK Hóa 8 (2006) · Chương III: Mol & Tính toán Hóa học',
    sourceTag: SRC_2006_8,
    lessonNumber: 3,
    title: 'Chương III (Hóa 8 2006): Mol, Thể tích khí đktc $22{,}4\\text{ L/mol}$, Tỉ khối & Tính theo PTHH',
    subtitle: 'Trọn bộ công thức tính toán SGK Hóa 8 (2006) với $V = 22{,}4 \\cdot n$ ở $0^\\circ\\text{C}, 1\\text{ atm}$',
    description:
      'Làm chủ toàn bộ Chương III SGK Hóa học 8 (2006): chuyển đổi mol – khối lượng – thể tích khí đktc ($22{,}4\\text{ lít}$), tỉ khối chất khí và bài toán dư–hết theo PTHH.',
    theory1Heading: '1. Mol ($N_A = 6 \\cdot 10^{23}$) & Thể tích khí đktc ($22{,}4\\text{ L}$)',
    theory1:
      '• **Mol** là lượng chất chứa $6 \\cdot 10^{23}$ nguyên tử hoặc phân tử chất đó.\n• Trong chương trình SGK 2006, ở **điều kiện tiêu chuẩn (đktc: $0^\\circ\\text{C}, 1\\text{ atm}$)**, $1\\text{ mol}$ mọi chất khí chiếm thể tích đúng **$22{,}4\\text{ lít}$**.',
    theory2Heading: '2. Tỉ khối chất khí & Bài toán tính theo PTHH',
    theory2:
      '• $d_{A/B} = \\frac{M_A}{M_B}$; so với không khí: $d_{A/\\text{kk}} = \\frac{M_A}{29}$.\n• Để giải bài toán tính theo PTHH: đổi ra số mol $\\to$ viết PTHH $\\to$ suy số mol chất cần tìm $\\to$ tính khối lượng hoặc thể tích ($22{,}4\\cdot n$).',
    keyFormulas: [
      'n = \\frac{m}{M} = \\frac{V_{\\text{khí (đktc)}}}{22{,}4}',
      'd_{A/B} = \\frac{M_A}{M_B}; \\quad d_{A/\\text{kk}} = \\frac{M_A}{29}'
    ],
    sim2d: 'stoichiometry_gas_2d',
    sim3d: 'equilibrium_piston_3d',
    mcq1: {
      source: 'SGK Hóa 8 (2006) · Chương III',
      question: 'Ở điều kiện tiêu chuẩn (đktc 2006), $6{,}72\\text{ lít}$ khí $\\text{O}_2$ có số mol và khối lượng bằng bao nhiêu?',
      options: ['A. $0{,}3\\text{ mol}$ và $9{,}6\\text{ g}$', 'B. $0{,}25\\text{ mol}$ và $8\\text{ g}$', 'C. $0{,}3\\text{ mol}$ và $4{,}8\\text{ g}$', 'D. $0{,}4\\text{ mol}$ và $12{,}8\\text{ g}$'],
      correctIndex: 0,
      explanation: '$n = \\frac{6{,}72}{22{,}4} = 0{,}3\\text{ mol} \\implies m = 0{,}3 \\cdot 32 = 9{,}6\\text{ g}$.'
    },
    mcq2: {
      source: 'SGK Hóa 8 (2006) · Chương III',
      question: 'Khí $\\text{SO}_2$ ($M = 64$) nặng hơn khí $\\text{O}_2$ ($M = 32$) gấp bao nhiêu lần?',
      options: ['A. $0{,}5$ lần', 'B. $2$ lần', 'C. $3$ lần', 'D. $4$ lần'],
      correctIndex: 1,
      explanation: '$d_{\\text{SO}_2/\\text{O}_2} = \\frac{64}{32} = 2$ lần.'
    },
    essay: {
      source: 'SGK Hóa 8 (2006) · Chương III',
      question: 'Đốt cháy hoàn toàn $6{,}5\\text{ g}$ kẽm ($\text{Zn} = 65$) trong bình chứa khí Oxi dư theo PTHH $2\\text{Zn} + \\text{O}_2 \\xrightarrow{t^\\circ} 2\\text{ZnO}$. Tính thể tích khí Oxi cần dùng ở đktc ($22{,}4\\text{ L/mol}$) và khối lượng $\\text{ZnO}$ thu được.',
      hints: ['Tính $n_{\\text{Zn}} = 6{,}5 / 65 = 0{,}1\\text{ mol}$.'],
      solutionSteps: [
        'Số mol kẽm: $n_{\\text{Zn}} = \\frac{6{,}5}{65} = 0{,}1\\text{ mol}$.',
        'Theo PTHH $2\\text{Zn} + \\text{O}_2 \\xrightarrow{t^\\circ} 2\\text{ZnO}$: $n_{\\text{O}_2} = 0{,}05\\text{ mol}$; $n_{\\text{ZnO}} = 0{,}1\\text{ mol}$.',
        '$V_{\\text{O}_2} = 0{,}05 \\cdot 22{,}4 = 1{,}12\\text{ lít}$; $m_{\\text{ZnO}} = 0{,}1 \\cdot (65 + 16) = 8{,}1\\text{ g}$.'
      ],
      finalAnswer: '$V_{\\text{O}_2} = 1{,}12\\text{ lít}$; $m_{\\text{ZnO}} = 8{,}1\\text{ g}$.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-8-4',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'SGK Hóa 8 (2006) · Chương IV: Oxi – Không khí',
    sourceTag: SRC_2006_8,
    lessonNumber: 4,
    title: 'Chương IV (Hóa 8 2006): Oxi, Oxit, Điều chế Oxi & Phản ứng Hóa hợp – Phân hủy',
    subtitle: 'Tính chất hóa học của Oxi (tác dụng phi kim, kim loại, hợp chất), nhiệt phân KMnO₄/KClO₃ và gọi tên Oxit',
    description:
      'Bao trọn Chương IV SGK Hóa học 8 (2006): so sánh phản ứng hóa hợp vs phân hủy, thí nghiệm đốt dây sắt trong lọ Oxi và cách thu khí Oxi đẩy nước/đẩy không khí.',
    theory1Heading: '1. Tính chất & Điều chế Oxi trong Phòng thí nghiệm',
    theory1:
      '• Oxi tác dụng với **Phi kim** ($\\text{S} + \\text{O}_2 \\xrightarrow{t^\\circ} \\text{SO}_2$), **Kim loại** ($3\\text{Fe} + 2\\text{O}_2 \\xrightarrow{t^\\circ} \\text{Fe}_3\\text{O}_4$), **Hợp chất** ($\\text{CH}_4 + 2\\text{O}_2 \\to \\text{CO}_2 + 2\\text{H}_2\\text{O}$).\n• **Điều chế Oxi PTN**: Nhiệt phân hợp chất giàu Oxi như $\\text{KMnO}_4$ hoặc $\\text{KClO}_3$. Vì $\\text{O}_2$ nặng hơn không khí ($32 > 29$) và ít tan trong nước nên thu bằng cách **đặt ngửa bình** hoặc **đẩy nước**.',
    theory2Heading: '2. Phản ứng Hóa hợp – Phân hủy & Oxit (2006)',
    theory2:
      '• **Hóa hợp**: từ $2$ hay nhiều chất tạo thành **1 chất** ($\\text{CaO} + \\text{H}_2\\text{O} \\to \\text{Ca(OH)}_2$).\n• **Phân hủy**: từ **1 chất** sinh ra $2$ hay nhiều chất ($2\\text{KMnO}_4 \\xrightarrow{t^\\circ} \\text{K}_2\\text{MnO}_4 + \\text{MnO}_2 + \\text{O}_2\\uparrow$).',
    keyFormulas: [
      '2\\text{KMnO}_4 \\xrightarrow{t^\\circ} \\text{K}_2\\text{MnO}_4 + \\text{MnO}_2 + \\text{O}_2\\uparrow',
      '2\\text{KClO}_3 \\xrightarrow{t^\\circ, \\text{MnO}_2} 2\\text{KCl} + 3\\text{O}_2\\uparrow'
    ],
    sim2d: 'oxygen_combustion_2d',
    sim3d: 'combustion_reactor_3d',
    mcq1: {
      source: 'SGK Hóa 8 (2006) · Chương IV',
      question: 'Phản ứng $2\\text{KClO}_3 \\xrightarrow{t^\\circ, \\text{MnO}_2} 2\\text{KCl} + 3\\text{O}_2\\uparrow$ thuộc loại phản ứng nào?',
      options: ['A. Phản ứng hóa hợp', 'B. Phản ứng phân hủy', 'C. Phản ứng thế', 'D. Phản ứng trung hòa'],
      correctIndex: 1,
      explanation: 'Từ $1$ chất ban đầu ($\\text{KClO}_3$) phân tách thành $2$ chất mới nên là phản ứng phân hủy.'
    },
    mcq2: {
      source: 'SGK Hóa 8 (2006) · Chương IV',
      question: 'Thu khí Oxi trong phòng thí nghiệm bằng cách đẩy không khí phải đặt ống nghiệm như thế nào?',
      options: [
        'A. Đặt úp ngược ống nghiệm xuống',
        'B. Đặt ngửa miệng ống nghiệm lên trên (vì $d_{\\text{O}_2/\\text{kk}} = 32/29 > 1$)',
        'C. Đặt nằm ngang',
        'D. Không thu được bằng đẩy không khí'
      ],
      correctIndex: 1,
      explanation: 'Khí Oxi nặng hơn không khí nên chìm xuống đáy ống nghiệm đặt ngửa.'
    },
    essay: {
      source: 'SGK Hóa 8 (2006) · Chương IV',
      question: 'Nhiệt phân hoàn toàn $31{,}6\\text{ g}$ thuốc tím $\\text{KMnO}_4$ ($M = 158$). Tính thể tích khí Oxi thu được ở đktc ($22{,}4\\text{ L/mol}$).',
      hints: ['Theo PTHH $2\\text{KMnO}_4 \\xrightarrow{t^\\circ} \\text{K}_2\\text{MnO}_4 + \\text{MnO}_2 + \\text{O}_2\\uparrow$, số mol $\\text{O}_2$ bằng nửa số mol $\\text{KMnO}_4$.'],
      solutionSteps: [
        'Số mol $\\text{KMnO}_4$: $n = \\frac{31{,}6}{158} = 0{,}2\\text{ mol}$.',
        'Số mol Oxi sinh ra: $n_{\\text{O}_2} = \\frac{0{,}2}{2} = 0{,}1\\text{ mol}$.',
        'Thể tích Oxi (đktc): $V = 0{,}1 \\cdot 22{,}4 = 2{,}24\\text{ lít}$.'
      ],
      finalAnswer: '$2{,}24\\text{ lít}$ (đktc).'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-8-5',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'SGK Hóa 8 (2006) · Chương V: Hiđro – Nước',
    sourceTag: SRC_2006_8,
    lessonNumber: 5,
    title: 'Chương V (Hóa 8 2006): Hiđro, Phản ứng Thế – Oxi hóa khử & Nước – Axit – Bazơ – Muối',
    subtitle: 'Hiđro khử CuO ở nhiệt độ cao, thu khí H₂ bằng cách úp bình, tính chất Nước và nhận biết Axit – Bazơ – Muối',
    description:
      'Làm chủ trọn Chương V SGK Hóa học 8 (2006): tính khử của Hiđro, phản ứng thế, tính chất hóa học của Nước và phân loại 4 hợp chất vô cơ.',
    theory1Heading: '1. Hiđro ($\\text{H}_2$), Phản ứng Thế & Phản ứng Oxi hóa – Khử',
    theory1:
      '• **Hiđro** nhẹ nhất trong mọi khí ($M = 2 < 29$), thu bằng **úp ngược ống nghiệm**. Hỗn hợp $2\\text{ H}_2 : 1\\text{ O}_2$ nổ rất mạnh!\n• Hiđro có **tính khử**: chiếm Oxi của oxit kim loại sau Al như $\\text{CuO} + \\text{H}_2 \\xrightarrow{t^\\circ} \\text{Cu (đỏ)} + \\text{H}_2\\text{O}$.\n• **Phản ứng thế**: Đơn chất thay thế nguyên tử một nguyên tố trong hợp chất ($\\text{Zn} + 2\\text{HCl} \\to \\text{ZnCl}_2 + \\text{H}_2\\uparrow$).',
    theory2Heading: '2. Nước & Bốn loại hợp chất vô cơ (Oxit – Axit – Bazơ – Muối)',
    theory2:
      '• Nước tác dụng kim loại kiềm ($2\\text{Na} + 2\\text{H}_2\\text{O} \\to 2\\text{NaOH} + \\text{H}_2\\uparrow$), tác dụng oxit bazơ tan tạo bazơ (quỳ xanh), tác dụng oxit axit tạo axit (quỳ đỏ).\n• Phân loại nhanh: **Axit** có $\\text{H}$ đầu ($\\text{HCl}$), **Bazơ** có nhóm $\\text{OH}$ cuối ($\\text{NaOH}$), **Muối** gồm kim loại + gốc axit ($\\text{Na}_2\\text{SO}_4$).',
    keyFormulas: [
      '\\text{CuO (đen)} + \\text{H}_2 \\xrightarrow{t^\\circ} \\text{Cu (đỏ)} + \\text{H}_2\\text{O}',
      '\\text{Zn} + 2\\text{HCl} \\to \\text{ZnCl}_2 + \\text{H}_2\\uparrow'
    ],
    sim2d: 'acid_base_oxide_2d',
    sim3d: 'indicator_bench_3d',
    mcq1: {
      source: 'SGK Hóa 8 (2006) · Chương V',
      question: 'Dẫn luồng khí $\\text{H}_2$ dư đi qua ống sứ đựng bột $\\text{CuO}$ màu đen đun nóng, hiện tượng quan sát được là:',
      options: [
        'A. Bột đen giữ nguyên màu đen',
        'B. Bột đen chuyển dần thành kim loại Đồng màu đỏ gạch và có hơi nước đọng ở đầu ống',
        'C. Có kết tủa trắng xuất hiện',
        'D. Bột biến thành màu xanh lam'
      ],
      correctIndex: 1,
      explanation: '$\\text{H}_2$ khử $\\text{CuO}$ đen thành $\\text{Cu}$ đỏ và tạo hơi nước.'
    },
    mcq2: {
      source: 'SGK Hóa 8 (2006) · Chương V',
      question: 'Cho các chất: $\\text{HNO}_3, \\text{Ca(OH)}_2, \\text{Na}_2\\text{CO}_3, \\text{SO}_3$. Thứ tự phân loại đúng lần lượt là:',
      options: [
        'A. Bazơ, Axit, Oxit, Muối',
        'B. Axit, Bazơ, Muối, Oxit axit',
        'C. Muối, Bazơ, Axit, Oxit bazơ',
        'D. Axit, Muối, Bazơ, Oxit'
      ],
      correctIndex: 1,
      explanation: '$\\text{HNO}_3$ là axit; $\\text{Ca(OH)}_2$ là bazơ; $\\text{Na}_2\\text{CO}_3$ là muối; $\\text{SO}_3$ là oxit axit.'
    },
    essay: {
      source: 'SGK Hóa 8 (2006) · Chương V',
      question: 'Khử hoàn toàn $16\\text{ g}$ $\\text{Fe}_2\\text{O}_3$ ($M = 160$) bằng khí $\\text{H}_2$ dư ở nhiệt độ cao. Viết PTHH và tính khối lượng kim loại Sắt ($\text{Fe} = 56$) thu được.',
      hints: ['Cân bằng $\\text{Fe}_2\\text{O}_3 + 3\\text{H}_2 \\xrightarrow{t^\\circ} 2\\text{Fe} + 3\\text{H}_2\\text{O}$.'],
      solutionSteps: [
        'PTHH: $\\text{Fe}_2\\text{O}_3 + 3\\text{H}_2 \\xrightarrow{t^\\circ} 2\\text{Fe} + 3\\text{H}_2\\text{O}$.',
        'Số mol $\\text{Fe}_2\\text{O}_3$: $n = \\frac{16}{160} = 0{,}1\\text{ mol} \\implies n_{\\text{Fe}} = 2 \\cdot 0{,}1 = 0{,}2\\text{ mol}$.',
        'Khối lượng Sắt thu được: $m_{\\text{Fe}} = 0{,}2 \\cdot 56 = 11{,}2\\text{ g}$.'
      ],
      finalAnswer: '$11{,}2\\text{ g}$ Sắt.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-8-6',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'SGK Hóa 8 (2006) · Chương VI: Dung dịch',
    sourceTag: SRC_2006_8,
    lessonNumber: 6,
    title: 'Chương VI (Hóa 8 2006): Dung dịch, Độ tan ($S$), Nồng độ $C\\% - C_M$ & Pha chế dung dịch',
    subtitle: 'Công thức liên hệ S với C%, quy đổi $C\\% \\leftrightarrow C_M$ qua $D$ và các bước pha loãng dung dịch chuẩn phòng thí nghiệm',
    description:
      'Chinh phục Chương VI kết thúc SGK Hóa học 8 (2006): phân biệt dung dịch bão hòa/chưa bão hòa, công thức độ tan $S$, nồng độ $C\\%$, $C_M$ và kĩ thuật pha chế dung dịch.',
    theory1Heading: '1. Độ tan ($S$) & Dung dịch bão hòa',
    theory1:
      '• **Độ tan ($S$)** của một chất trong nước là số gam chất đó hòa tan trong **$100\\text{ g}$ nước** để tạo thành **dung dịch bão hòa** ở nhiệt độ xác định.\n• Khi tăng nhiệt độ, độ tan của đa số **chất rắn tăng**, còn độ tan của **chất khí giảm**.',
    theory2Heading: '2. Nồng độ $C\\%$, Nồng độ mol $C_M$ & Pha chế',
    theory2:
      '• $C\\% = \\frac{m_{\\text{ct}}}{m_{\\text{dd}}} \\cdot 100\\%$ và $C_M = \\frac{n}{V_{\\text{lít}}}$.\n• **Mẹo pha loãng**: Khi thêm nước vào dung dịch, **số mol và khối lượng chất tan KHÔNG ĐỔI**, chỉ có khối lượng và thể tích dung dịch tăng lên ($C_{M1} V_1 = C_{M2} V_2$).',
    keyFormulas: [
      'S = \\frac{m_{\\text{ct}}}{m_{\\text{H}_2\\text{O}}} \\cdot 100; \\quad C\\%_{\\text{bão hòa}} = \\frac{S}{100 + S} \\cdot 100\\%',
      'C\\% = \\frac{m_{\\text{ct}}}{m_{\\text{dd}}} \\cdot 100\\%, \\quad C_M = \\frac{n}{V_{\\text{lít}}}, \\quad C_M = \\frac{10 \\cdot D \\cdot C\\%}{M}'
    ],
    sim2d: 'solution_solubility_2d',
    sim3d: 'solution_mixing_3d',
    mcq1: {
      source: 'SGK Hóa 8 (2006) · Chương VI',
      question: 'Ở $20^\\circ\\text{C}$, hòa tan tối đa $36\\text{ g}$ $\\text{NaCl}$ vào $100\\text{ g}$ nước để được dung dịch bão hòa. Nồng độ phần trăm $C\\%$ của dung dịch bão hòa này là:',
      options: ['A. $36\\%$', 'B. $\\approx 26{,}47\\%$', 'C. $30\\%$', 'D. $18\\%$'],
      correctIndex: 1,
      explanation: '$m_{\\text{dd}} = 36 + 100 = 136\\text{ g} \\implies C\\% = \\frac{36}{136} \\cdot 100\\% \\approx 26{,}47\\%$.'
    },
    mcq2: {
      source: 'SGK Hóa 8 (2006) · Chương VI',
      question: 'Lấy $100\\text{ ml}$ dung dịch $\\text{HCl}\\ 2\\text{M}$, thêm nước cất cho đủ $400\\text{ ml}$. Nồng độ mol của dung dịch sau khi pha loãng là:',
      options: ['A. $0{,}25\\text{ M}$', 'B. $0{,}5\\text{ M}$', 'C. $1{,}0\\text{ M}$', 'D. $8{,}0\\text{ M}$'],
      correctIndex: 1,
      explanation: 'Thể tích tăng $4$ lần ($100 \\to 400\\text{ ml}$) nên nồng độ giảm $4$ lần: $2 : 4 = 0{,}5\\text{ M}$.'
    },
    essay: {
      source: 'SGK Hóa 8 (2006) · Chương VI',
      question: 'Tính khối lượng tinh thể $\\text{CuSO}_4$ ($M = 160$) và lượng nước cần dùng để pha chế $200\\text{ g}$ dung dịch $\\text{CuSO}_4$ nồng độ $16\\%$.',
      hints: ['Tính $m_{\\text{ct}} = m_{\\text{dd}} \\cdot C\\% / 100$, rồi $m_{\\text{H}_2\\text{O}} = m_{\\text{dd}} - m_{\\text{ct}}$.'],
      solutionSteps: [
        'Khối lượng chất tan $\\text{CuSO}_4$: $m_{\\text{ct}} = \\frac{200 \\cdot 16}{100} = 32\\text{ g}$.',
        'Khối lượng nước cần lấy: $m_{\\text{H}_2\\text{O}} = 200 - 32 = 168\\text{ g}$ (tương đương $168\\text{ ml}$ nước).'
      ],
      finalAnswer: 'Cân $32\\text{ g}$ $\\text{CuSO}_4$ hòa tan trong $168\\text{ g}$ nước.'
    }
  })
];
