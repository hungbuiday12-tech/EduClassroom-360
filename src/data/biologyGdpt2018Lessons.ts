import { Biology3DMode, BiologyLesson, BiologySimType } from '../types';
import { BIOLOGY_2D_SIMS } from './biologyDomainsData';

function paramsForBio(sim: BiologySimType) {
  const spec = BIOLOGY_2D_SIMS.find((s) => s.id === sim) || BIOLOGY_2D_SIMS[0];
  return {
    defaultParams: { ...spec.defaultParams },
    paramBounds: { ...spec.paramBounds }
  };
}

export interface SeedBioInput {
  id: string;
  track: BiologyLesson['track'];
  grade: BiologyLesson['grade'];
  tier?: BiologyLesson['tier'];
  stageLabel: string;
  sourceTag: string;
  lessonNumber: number;
  title: string;
  subtitle: string;
  description: string;
  theory1Heading: string;
  theory1: string;
  theory2Heading: string;
  theory2: string;
  keyFormulas: string[];
  sim2d: BiologySimType;
  sim3d: Biology3DMode;
  mcq1: BiologyLesson['practiceExercises'][number];
  mcq2: BiologyLesson['practiceExercises'][number];
  essay: BiologyLesson['essayExercises'][number];
}

export function makeBioLesson(s: SeedBioInput): BiologyLesson {
  const { defaultParams, paramBounds } = paramsForBio(s.sim2d);
  return {
    id: s.id,
    track: s.track,
    grade: s.grade,
    tier: s.tier,
    stageLabel: s.stageLabel,
    sourceTag: s.sourceTag,
    lessonNumber: s.lessonNumber,
    title: s.title,
    subtitle: s.subtitle,
    description: s.description,
    theorySections: [
      { heading: s.theory1Heading, content: s.theory1 },
      { heading: s.theory2Heading, content: s.theory2 }
    ],
    keyFormulas: s.keyFormulas,
    simulationType: s.sim2d,
    sim3dType: s.sim3d,
    defaultParams,
    paramBounds,
    practiceExercises: [s.mcq1, s.mcq2],
    essayExercises: [s.essay]
  };
}

export const BIOLOGY_GDPT_2018_LESSONS: BiologyLesson[] = [
  // ==================== KHTN 9 (SINH HỌC) ====================
  makeBioLesson({
    id: 'bio-9-1',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'GDPT 2018 · KHTN 9 (Sinh học)',
    sourceTag: 'KHTN 9 · Di truyền Mendel',
    lessonNumber: 1,
    title: 'Quy luật Phân li & Phân li Độc lập của Mendel',
    subtitle: 'Thí nghiệm lai 1 cặp và 2 cặp tính trạng ở đậu Hà Lan, biến dị tổ hợp',
    description: 'Mỗi tính trạng do một cặp alen quy định; các alen phân li đồng đều về giao tử và tổ hợp tự do trong thụ tinh.',
    theory1Heading: '1. Quy luật Phân li (Lai 1 cặp tính trạng)',
    theory1: '• P thuần chủng tương phản ($AA \\times aa$) cho $F_1$ đồng tính $100\\%\\ Aa$, $F_2$ phân li $3\\text{ trội} : 1\\text{ lặn}$ (tỉ lệ kiểu gen $1:2:1$).\n• Lai phân tích ($Aa \\times aa$) dùng để kiểm tra kiểu gen cơ thể trội.',
    theory2Heading: '2. Quy luật Phân li Độc lập & Biến dị Tổ hợp',
    theory2: '• Khi lai hai cặp tính trạng độc lập ($AaBb \\times AaBb$), tỉ lệ $F_2$ bằng tích xác suất từng cặp: $(3:1)(3:1) = 9:3:3:1$.\n• Giải thích sự xuất hiện biến dị tổ hợp phong phú trong sinh sản hữu tính.',
    keyFormulas: ['(3:1)^n \\text{ (tỉ lệ kiểu hình } F_2\\text{)}', '(1:2:1)^n \\text{ (tỉ lệ kiểu gen } F_2\\text{)}'],
    sim2d: 'mendel_punnett_2d',
    sim3d: 'chromosome_mitosis_3d',
    mcq1: {
      source: 'KHTN 9 · Mendel',
      question: 'Cho đậu Hà Lan hạt vàng, trơn thuần chủng ($AABB$) lai với hạt xanh, nhăn ($aabb$). Tỉ lệ kiểu hình ở $F_2$ là:',
      options: ['A. 3 : 1', 'B. 9 : 3 : 3 : 1', 'C. 1 : 2 : 1', 'D. 1 : 1 : 1 : 1'],
      correctIndex: 1,
      explanation: 'Hai cặp gen phân li độc lập nên $F_1\\ AaBb$ tự thụ phấn cho $F_2$ gồm $9A-B- : 3A-bb : 3aaB- : 1aabb$.'
    },
    mcq2: {
      source: 'KHTN 9 · Lai phân tích',
      question: 'Phép lai nào là phép lai phân tích?',
      options: ['A. AA × AA', 'B. Aa × Aa', 'C. AaBb × aabb', 'D. AABB × AaBB'],
      correctIndex: 2,
      explanation: 'Lai phân tích là lai cá thể mang tính trạng trội với cá thể đồng hợp lặn ($aabb$).'
    },
    essay: {
      source: 'KHTN 9',
      question: 'Viết sơ đồ lai $AaBb \\times Aabb$ và xác định tỉ lệ kiểu hình $A-bb$ ở đời con.',
      solutionSteps: ['$P: Aa \\times Aa \\to 3/4\\ A-$; $Bb \\times bb \\to 1/2\\ bb$', 'Tỉ lệ $A-bb = 3/4 \\times 1/2 = 3/8$'],
      finalAnswer: '3/8 (37,5%)'
    }
  }),
  makeBioLesson({
    id: 'bio-9-2',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'GDPT 2018 · KHTN 9 (Sinh học)',
    sourceTag: 'KHTN 9 · Axit Nucleic & Gen',
    lessonNumber: 2,
    title: 'Cấu trúc DNA, RNA & Mối quan hệ Gen – Protein – Tính trạng',
    subtitle: 'Nguyên tắc bổ sung A–T, G–C và sơ đồ trung tâm của sinh học phân tử',
    description: 'Nắm vững cấu tạo đơn phân nucleotit, chiều dài gen $L = (N/2)\\cdot 3{,}4\\text{ Å}$ và cơ chế truyền đạt thông tin di truyền.',
    theory1Heading: '1. Cấu trúc hóa học và không gian của DNA',
    theory1: '• DNA cấu tạo theo nguyên tắc đa phân với 4 loại đơn phân A, T, G, C; hai mạch xoắn kép song song ngược chiều theo nguyên tắc bổ sung $A=T$, $G\\equiv C$.\n• Mỗi chu kì xoắn dài $34\\text{ Å}$ gồm $10$ cặp nucleotit.',
    theory2Heading: '2. Dòng thông tin di truyền',
    theory2: '• DNA $\\xrightarrow{\\text{Phiên mã}}$ mRNA $\\xrightarrow{\\text{Dịch mã}}$ Polypeptide $\\to$ Protein $\\to$ Biểu hiện tính trạng.',
    keyFormulas: ['N = 2A + 2G', 'L = \\frac{N}{2} \\times 3{,}4\\text{ Å}', 'H = 2A + 3G'],
    sim2d: 'dna_replication_2d',
    sim3d: 'dna_double_helix_3d',
    mcq1: {
      source: 'KHTN 9 · Bài tập DNA',
      question: 'Một đoạn DNA có $3000$ nucleotit và $A = 600$. Số liên kết hiđrô của đoạn DNA này là:',
      options: ['A. 3600', 'B. 3900', 'C. 3000', 'D. 4200'],
      correctIndex: 1,
      explanation: '$G = N/2 - A = 1500 - 600 = 900 \\Rightarrow H = 2(600) + 3(900) = 3900$.'
    },
    mcq2: {
      source: 'KHTN 9',
      question: 'Loại axit nucleic trực tiếp làm khuôn cho quá trình dịch mã tổng hợp protein ở ribosome là:',
      options: ['A. mRNA', 'B. tRNA', 'C. rRNA', 'D. DNA'],
      correctIndex: 0,
      explanation: 'mRNA (RNA thông tin) mang các bộ ba mã sao làm khuôn trực tiếp trên ribosome.'
    },
    essay: {
      source: 'KHTN 9',
      question: 'Một gen dài $5100\\text{ Å}$ có tỉ lệ $A/G = 2/3$. Tính số nucleotit mỗi loại.',
      solutionSteps: ['$N = 2L/3{,}4 = 3000$ nu $\\Rightarrow A + G = 1500$', '$A/G = 2/3 \\Rightarrow A = T = 600,\\ G = C = 900$'],
      finalAnswer: 'A = T = 600; G = C = 900'
    }
  }),
  makeBioLesson({
    id: 'bio-9-3',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'GDPT 2018 · KHTN 9 (Sinh học)',
    sourceTag: 'KHTN 9 · Nhiễm sắc thể & Tiến hóa cơ bản',
    lessonNumber: 3,
    title: 'Nhiễm sắc thể, Đột biến & Chọn lọc Cơ bản',
    subtitle: 'Bộ NST 2n, cơ chế xác định giới tính XX/XY, đột biến cấu trúc/số lượng NST',
    description: 'Tìm hiểu hình thái NST ở kì giữa, cơ chế sinh con trai/gái theo NST giới tính và ứng dụng lai tạo giống.',
    theory1Heading: '1. Bộ NST đặc trưng & Cơ chế xác định giới tính',
    theory1: '• Tế bào xôma chứa bộ $2n$ NST tồn tại thành từng cặp tương đồng; giao tử chứa $n$ NST.\n• Ở người và động vật có vú: giới cái $XX$ tạo 1 loại trứng $X$, giới đực $XY$ tạo 2 loại tinh trùng $X$ và $Y$ tỉ lệ $1:1$.',
    theory2Heading: '2. Đột biến gen & Đột biến NST',
    theory2: '• Đột biến số lượng (thể dị bội $2n+1, 2n-1$ như hội chứng Down 3 NST 21; thể đa bội $3n, 4n$) là nguồn nguyên liệu cho tiến hóa và chọn giống.',
    keyFormulas: ['\\text{Thể tam nhiễm}: 2n + 1,\\quad \\text{Thể một nhiễm}: 2n - 1'],
    sim2d: 'mitosis_meiosis_2d',
    sim3d: 'chromosome_mitosis_3d',
    mcq1: {
      source: 'KHTN 9',
      question: 'Hình thái đặc trưng của NST được quan sát rõ nhất ở kì nào của quá trình nguyên phân?',
      options: ['A. Kì đầu', 'B. Kì giữa', 'C. Kì sau', 'D. Kì cuối'],
      correctIndex: 1,
      explanation: 'Tại kì giữa nguyên phân, NST co xoắn cực đại và tập trung thành 1 hàng trên mặt phẳng xích đạo.'
    },
    mcq2: {
      source: 'KHTN 9',
      question: 'Hội chứng Down ở người có bộ NST bằng bao nhiêu?',
      options: ['A. 45 (XO)', 'B. 46', 'C. 47 (3 NST số 21)', 'D. 47 (XXY)'],
      correctIndex: 2,
      explanation: 'Người mắc hội chứng Down thuộc thể ba nhiễm (2n + 1 = 47) có 3 chiếc ở cặp NST số 21.'
    },
    essay: {
      source: 'KHTN 9',
      question: 'Tại sao thể đa bội lẻ ($3n$) thường không có hạt (như dưa hấu không hạt, chuối nhà)?',
      solutionSteps: ['Bộ NST $3n$ khi giảm phân không phân li đồng đều thành các cặp tương đồng', 'Giao tử bị rối loạn số lượng NST nên bất thụ, không hình thành hạt'],
      finalAnswer: 'Do rối loạn tiếp hợp và phân li NST trong giảm phân tạo giao tử bất thụ.'
    }
  }),

  // ==================== SINH HỌC 10 (GDPT 2018) ====================
  makeBioLesson({
    id: 'bio-10-1',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Sinh học 10',
    sourceTag: 'Sinh 10 · Thành phần hóa học Tế bào',
    lessonNumber: 1,
    title: 'Nước & Các Đại phân tử Sinh học (Carbohydrate, Lipid, Protein, Nucleic Acid)',
    subtitle: 'Tính phân cực liên kết hiđrô của H₂O và cấu trúc 4 bậc của Protein',
    description: 'Khảo sát vai trò nguyên tố đại lượng/vi lượng, tính chất đặc biệt của nước và cấu trúc – chức năng 4 đại phân tử hữu cơ.',
    theory1Heading: '1. Nước và Liên kết Hiđrô',
    theory1: '• Phân tử $H_2O$ có tính phân cực do độ âm điện O > H, tạo mạng lưới liên kết hiđrô mang lại nhiệt dung riêng cao và khả năng hòa tan chất phân cực.',
    theory2Heading: '2. Bốn đại phân tử sinh học',
    theory2: '• **Carbohydrate**: đơn phân đường đơn (glucose, fructose) cung cấp năng lượng nhanh.\n• **Lipid**: không theo nguyên tắc đa phân, kị nước (mỡ, phospholipid, steroid).\n• **Protein**: đa phân axit amin nối bằng liên kết peptit, 4 bậc cấu trúc.',
    keyFormulas: ['\\text{Liên kết peptit: } -\\text{CO}-\\text{NH}-', '\\text{Cấu trúc bậc 3/4 quyết định chức năng}'],
    sim2d: 'enzyme_kinetics_2d',
    sim3d: 'enzyme_substrate_3d',
    mcq1: {
      source: 'Sinh 10 · GDPT 2018',
      question: 'Đại phân tử sinh học nào KHÔNG cấu tạo theo nguyên tắc đa phân?',
      options: ['A. Tinh bột', 'B. Protein', 'C. Phospholipid', 'D. DNA'],
      correctIndex: 2,
      explanation: 'Lipid (mỡ, phospholipid, steroid) không được cấu tạo từ các đơn phân lặp lại như đa phân.'
    },
    mcq2: {
      source: 'Sinh 10',
      question: 'Khi đun nóng quá nhiệt độ tối ưu, protein bị mất chức năng sinh học chủ yếu vì:',
      options: ['A. Đứt toàn bộ liên kết peptit', 'B. Phá vỡ cấu trúc không gian bậc 3/4 (biến tính)', 'C. Biến đổi thành lipid', 'D. Giảm khối lượng nguyên tử'],
      correctIndex: 1,
      explanation: 'Nhiệt độ cao phá vỡ các liên kết yếu (hiđrô, ion, kị nước) duy trì cấu hình 3D tự nhiên của protein.'
    },
    essay: {
      source: 'Sinh 10',
      question: 'Vì sao khi cho rau xanh vào ngăn đá tủ lạnh rồi rã đông, rau lại bị mềm nhũn?',
      solutionSteps: ['Nước khi đóng băng tăng thể tích (mạng tinh thể hiđrô rỗng) làm vỡ màng tế bào và không bào'],
      finalAnswer: 'Tinh thể nước đá giãn nở xé rách màng tế bào, làm mất sức trương khi rã đông.'
    }
  }),
  makeBioLesson({
    id: 'bio-10-2',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Sinh học 10',
    sourceTag: 'Sinh 10 · Cấu trúc Tế bào',
    lessonNumber: 2,
    title: 'Tế bào Nhân sơ & Tế bào Nhân thực (Nhân, Lưới nội chất, Golgi, Ti thể, Lục lạp)',
    subtitle: 'Hệ thống màng nội bào, quá trình tổng hợp và vận chuyển protein xuất bào',
    description: 'Phân biệt tế bào nhân sơ – nhân thực, tế bào động vật – thực vật và sự phối hợp giữa các bào quan.',
    theory1Heading: '1. Đặc điểm Tế bào Nhân sơ vs Nhân thực',
    theory1: '• Nhân sơ (vi khuẩn): kích thước nhỏ (1–5 μm), chưa có màng nhân và bào quan có màng, DNA vòng trần.\n• Nhân thực: có nhân hoàn chỉnh màng kép và hệ thống bào quan phân vùng chức năng.',
    theory2Heading: '2. Dòng tổng hợp & tiết Protein',
    theory2: '• Ribosome trên lưới nội chất hạt (RER) tổng hợp protein $\\to$ túi vận chuyển sang bộ máy Golgi gắn nhóm đường/gói bọc $\\to$ hòa màng xuất bào.',
    keyFormulas: ['\\text{Thuyết nội cộng sinh: Ti thể \\& Lục lạp có DNA vòng + Ribosome 70S}'],
    sim2d: 'cell_organelles_2d',
    sim3d: 'eukaryotic_cell_3d',
    mcq1: {
      source: 'Sinh 10',
      question: 'Hai bào quan nào trong tế bào nhân thực có màng kép và chứa DNA vòng riêng?',
      options: ['A. Golgi và Lysosome', 'B. Ti thể và Lục lạp', 'C. RER và SER', 'D. Trung thể và Không bào'],
      correctIndex: 1,
      explanation: 'Theo thuyết nội cộng sinh, ti thể và lục lạp đều có màng kép, DNA vòng kép và ribosome 70S giống vi khuẩn.'
    },
    mcq2: {
      source: 'Sinh 10',
      question: 'Bào quan nào chịu trách nhiệm phân loại, biến đổi, đóng gói và phân phối sản phẩm protein?',
      options: ['A. Bộ máy Golgi', 'B. Peroxisome', 'C. Màng sinh chất', 'D. Không bào trung tâm'],
      correctIndex: 0,
      explanation: 'Bộ máy Golgi tiếp nhận túi tiết từ lưới nội chất để hoàn thiện cấu trúc và định tuyến xuất bào.'
    },
    essay: {
      source: 'Sinh 10',
      question: 'Trình bày các điểm khác biệt giữa tế bào thực vật và tế bào động vật.',
      solutionSteps: ['Tế bào thực vật có thành cellulose, lục lạp, không bào trung tâm lớn và thường không có trung thể'],
      finalAnswer: 'Thành cellulose, lục lạp, không bào lớn (thực vật) vs trung thể, lysosome phổ biến (động vật).'
    }
  }),
  makeBioLesson({
    id: 'bio-10-3',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Sinh học 10',
    sourceTag: 'Sinh 10 · Vận chuyển qua Màng',
    lessonNumber: 3,
    title: 'Màng Sinh chất & Các Hình thức Vận chuyển qua Màng (Thụ động, Chủ động)',
    subtitle: 'Mô hình khảm lỏng, thẩm thấu đẳng/ưu/nhược trương và bơm Na⁺/K⁺ tiêu tốn ATP',
    description: 'Khám phá tính thấm chọn lọc của lớp kép phospholipid và sự đóng mở kênh protein vận chuyển.',
    theory1Heading: '1. Cấu trúc Khảm lỏng của Màng sinh chất',
    theory1: '• Lớp kép phospholipid giữ vai trò nền tảng (đầu ưa nước quay ra ngoài, đuôi kị nước quay vào trong) cùng protein xuyên màng/bám màng và cholesterol ổn định độ nhớt.',
    theory2Heading: '2. Vận chuyển Thụ động, Chủ động & Xuất/Nhập bào',
    theory2: '• **Thụ động**: theo chiều gradient nồng độ, không tốn ATP (khuếch tán đơn giản, qua kênh Aquaporin, thẩm thấu nước).\n• **Chủ động**: ngược chiều gradient nồng độ, cần bơm protein và tiêu tốn năng lượng ATP.',
    keyFormulas: ['\\text{Thẩm thấu nước}: \\text{Từ thế nước cao (nhược trương)} \\to \\text{thế nước thấp (ưu trương)}'],
    sim2d: 'membrane_osmosis_2d',
    sim3d: 'phospholipid_bilayer_3d',
    mcq1: {
      source: 'Sinh 10',
      question: 'Khi đặt tế bào hồng cầu người vào dung dịch muối $NaCl$ rất loãng (nhược trương $0{,}2\\%$), hiện tượng gì xảy ra?',
      options: ['A. Tế bào co lại nhăn nheo', 'B. Nước thẩm thấu vào làm hồng cầu trương phồng và có thể vỡ', 'C. Nước rút ra ngoài hoàn toàn', 'D. Không thay đổi thể tích'],
      correctIndex: 1,
      explanation: 'Không có thành tế bào bảo vệ, hồng cầu hút nước trong môi trường nhược trương dẫn tới trương phồng và tan máu.'
    },
    mcq2: {
      source: 'Sinh 10',
      question: 'Đặc điểm phân biệt vận chuyển chủ động với khuếch tán tăng cường là:',
      options: ['A. Cần chất mang protein', 'B. Vận chuyển ngược gradient nồng độ và tiêu tốn ATP', 'C. Chỉ vận chuyển nước', 'D. Không phụ thuộc nhiệt độ'],
      correctIndex: 1,
      explanation: 'Cả hai đều có thể dùng protein màng, nhưng vận chuyển chủ động đi ngược dốc nồng độ nên đòi hỏi ATP.'
    },
    essay: {
      source: 'Sinh 10',
      question: 'Giải thích hiện tượng tế bào thực vật không bị vỡ khi ngâm trong nước cất.',
      solutionSteps: ['Nước vào không bào tạo sức trương lên màng sinh chất, nhưng thành cellulose cứng tạo áp suất thành cản lại cân bằng thế nước'],
      finalAnswer: 'Nhờ thành tế bào bằng cellulose chịu lực và giữ trạng thái trương nước.'
    }
  }),
  makeBioLesson({
    id: 'bio-10-4',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Sinh học 10',
    sourceTag: 'Sinh 10 · Năng lượng & Enzyme',
    lessonNumber: 4,
    title: 'ATP – Đồng tiền năng lượng & Cơ chế Xúc tác của Enzyme',
    subtitle: 'Giảm năng lượng hoạt hóa Ea, phương trình Michaelis–Menten và điều hòa ức chế ngược',
    description: 'Tìm hiểu cách enzyme hạ thấp hàng rào năng lượng phản ứng và các yếu tố ảnh hưởng đến tốc độ xúc tác.',
    theory1Heading: '1. Cấu tạo ATP & Năng lượng hoạt hóa',
    theory1: '• ATP gồm bazơ Ađenin + đường Ribose + 3 nhóm Photphat (2 liên kết cao năng dễ thủy phân giải phóng $\\approx 30{,}5\\text{ kJ/mol}$).\n• Enzyme không bị biến đổi sau phản ứng, giúp giảm năng lượng hoạt hóa $E_a$.',
    theory2Heading: '2. Động học & Các yếu tố ảnh hưởng',
    theory2: '• Tốc độ phản ứng tăng theo $[S]$ đến khi bão hòa $V_{\\max}$. Nhiệt độ hay pH lệch khỏi ngưỡng tối ưu làm biến tính trung tâm hoạt động.',
    keyFormulas: ['V = \\frac{V_{\\max}[S]}{K_m + [S]}', '\\text{ATP} + \\text{H}_2\\text{O} \\to \\text{ADP} + P_i + \\text{Năng lượng}'],
    sim2d: 'enzyme_kinetics_2d',
    sim3d: 'enzyme_substrate_3d',
    mcq1: {
      source: 'Sinh 10',
      question: 'Enzyme làm tăng tốc độ phản ứng sinh hóa bằng cách nào?',
      options: ['A. Tăng nhiệt độ tế bào', 'B. Giảm năng lượng hoạt hóa (Ea) của phản ứng', 'C. Cung cấp thêm phân tử ATP', 'D. Thay đổi ΔG của phản ứng'],
      correctIndex: 1,
      explanation: 'Enzyme liên kết cơ chất tại trung tâm hoạt động giúp hạ thấp năng lượng hoạt hóa mà không làm thay đổi ΔG.'
    },
    mcq2: {
      source: 'Sinh 10',
      question: 'Khi chất ức chế cạnh tranh gắn vào trung tâm hoạt động của enzyme, có thể khắc phục bằng cách:',
      options: ['A. Tăng nồng độ cơ chất [S]', 'B. Đun sôi dung dịch', 'C. Hạ pH xuống 1', 'D. Giảm lượng enzyme'],
      correctIndex: 0,
      explanation: 'Tăng mạnh $[S]$ giúp cơ chất cạnh tranh thắng chất ức chế để chiếm lại trung tâm hoạt động.'
    },
    essay: {
      source: 'Sinh 10',
      question: 'Giải thích vì sao cơ thể người sốt cao trên $41^\\circ\\text{C}$ lại rất nguy hiểm tới tính mạng.',
      solutionSteps: ['Nhiệt độ quá cao làm biến tính hàng loạt enzyme chuyển hóa thiết yếu trong tế bào não và tim'],
      finalAnswer: 'Do các enzyme trong cơ thể bị biến tính, làm đình trệ các phản ứng trao đổi chất sống còn.'
    }
  }),
  makeBioLesson({
    id: 'bio-10-5',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Sinh học 10',
    sourceTag: 'Sinh 10 · Hô hấp & Quang hợp Tế bào',
    lessonNumber: 5,
    title: 'Hô hấp Tế bào (Đường phân – Krebs – Chuỗi truyền e⁻) & Lên men',
    subtitle: 'Bản chất oxi hóa khử giải phóng năng lượng từng bước và sự tổng hợp 30–32 ATP',
    description: 'Theo dõi hành trình chuyển hóa 1 phân tử glucose qua 3 giai đoạn trong tế bào chất và ti thể.',
    theory1Heading: '1. Ba giai đoạn Hô hấp Hiếu khí',
    theory1: '• **Đường phân** (tế bào chất): $1\\text{ Glucose} \\to 2\\text{ Pyruvate} + 2\\text{ ATP} + 2\\text{ NADH}$.\n• **Chu trình Krebs** (chất nền ti thể): tạo $2\\text{ ATP} + 8\\text{ NADH} + 2\\text{ FADH}_2$ (tính từ 2 pyruvate) và thải $CO_2$.\n• **Chuỗi truyền electron** (màng trong ti thể): $O_2$ là chất nhận electron cuối tạo $H_2O$ và $\\approx 26\\text{--}28\\text{ ATP}$.',
    theory2Heading: '2. Lên men Kỵ khí',
    theory2: '• Khi thiếu $O_2$, tế bào thực hiện lên men lactic (cơ người) hoặc lên men rượu (nấm men), chỉ thu $2\\text{ ATP}$/glucose.',
    keyFormulas: ['\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\to 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + 30\\text{--}32\\,\\text{ATP}'],
    sim2d: 'cellular_respiration_2d',
    sim3d: 'mitochondria_atp_3d',
    mcq1: {
      source: 'Sinh 10',
      question: 'Trong chuỗi truyền electron hô hấp ở màng trong ti thể, chất nhận electron cuối cùng là:',
      options: ['A. CO₂', 'B. NAD⁺', 'C. O₂', 'D. Pyruvate'],
      correctIndex: 2,
      explanation: 'Oxi nguyên tử nhận $e^-$ và $H^+$ tạo thành nước ($H_2O$) ở cuối chuỗi truyền electron.'
    },
    mcq2: {
      source: 'Sinh 10',
      question: 'Giai đoạn nào diễn ra trong tế bào chất và không cần đến $O_2$?',
      options: ['A. Đường phân', 'B. Chu trình Krebs', 'C. Chuỗi truyền electron', 'D. Phosphoryl hóa oxi hóa'],
      correctIndex: 0,
      explanation: 'Đường phân là con đường tiến hóa cổ xưa diễn ra tại bào tương cả khi có và không có $O_2$.'
    },
    essay: {
      source: 'Sinh 10',
      question: 'Tại sao chạy nhanh gắng sức lại gây mỏi cơ bắp?',
      solutionSteps: ['Cơ thiếu oxy chuyển sang lên men lactic thu 2 ATP, tích tụ axit lactic gây mỏi và giảm pH cơ'],
      finalAnswer: 'Do lên men lactic tích tụ axit lactic khi cơ không được cung cấp đủ $O_2$.'
    }
  }),
  makeBioLesson({
    id: 'bio-10-6',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Sinh học 10',
    sourceTag: 'Sinh 10 · Phân bào & Công nghệ Tế bào',
    lessonNumber: 6,
    title: 'Chu kì Tế bào, Nguyên phân, Giảm phân & Điều hòa Ung thư',
    subtitle: 'Các điểm kiểm soát G1/S/G2/M và cơ chế tạo biến dị tổ hợp trong giảm phân I',
    description: 'Hiểu quy trình nhân đôi DNA ở pha S, sự phân li nhiễm sắc thể và ứng dụng nuôi cấy mô/nhân bản vô tính.',
    theory1Heading: '1. Chu kì Tế bào & Các Điểm kiểm soát',
    theory1: '• Kì trung gian gồm pha $G_1$ (tổng hợp chất), pha $S$ (nhân đôi DNA và NST thành NST kép), pha $G_2$.\n• Rối loạn điểm kiểm soát chu kì làm tế bào phân chia mất kiểm soát gây khối u (ung thư).',
    theory2Heading: '2. Ý nghĩa Nguyên phân & Giảm phân',
    theory2: '• Nguyên phân giữ ổn định bộ $2n$ giúp lớn lên và tái sinh mô.\n• Giảm phân (1 lần nhân đôi, 2 lần phân bào) giảm bộ NST xuống $n$ và trao đổi chéo ở kì đầu I tạo đa dạng di truyền.',
    keyFormulas: ['\\text{Số tế bào sau } k\\text{ lần nguyên phân} = a \\cdot 2^k', '1\\text{ TB sinh tinh} \\to 4\\text{ tinh trùng}'],
    sim2d: 'mitosis_meiosis_2d',
    sim3d: 'chromosome_mitosis_3d',
    mcq1: {
      source: 'Sinh 10',
      question: 'DNA và NST nhân đôi ở pha nào của kì trung gian?',
      options: ['A. Pha G₁', 'B. Pha S', 'C. Pha G₂', 'D. Kì đầu nguyên phân'],
      correctIndex: 1,
      explanation: 'Pha S (Synthesis) là giai đoạn tổng hợp và nhân đôi DNA, biến NST đơn thành NST kép gồm 2 cromatit.'
    },
    mcq2: {
      source: 'Sinh 10',
      question: 'Hiện tượng tiếp hợp và trao đổi chéo giữa các cromatit khác nguồn diễn ra ở kì nào?',
      options: ['A. Kì đầu I giảm phân', 'B. Kì giữa nguyên phân', 'C. Kì sau II giảm phân', 'D. Pha G₁'],
      correctIndex: 0,
      explanation: 'Trao đổi chéo xảy ra tại kì đầu giảm phân I giữa các cặp NST tương đồng.'
    },
    essay: {
      source: 'Sinh 10',
      question: 'Từ $5$ tế bào xôma nguyên phân liên tiếp $4$ lần tạo bao nhiêu tế bào con?',
      solutionSteps: ['$5 \\times 2^4 = 5 \\times 16 = 80$'],
      finalAnswer: '80 tế bào con'
    }
  }),
  makeBioLesson({
    id: 'bio-10-7',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Sinh học 10',
    sourceTag: 'Sinh 10 · Vi sinh vật & Virus',
    lessonNumber: 7,
    title: 'Sinh trưởng Vi sinh vật & Chu trình Nhân lên của Virus',
    subtitle: 'Đường cong 4 pha quần thể vi khuẩn và chu trình Sinh tan / Tiềm tan của Phage',
    description: 'Tìm hiểu cấu tạo đơn giản của virus (lõi axit nucleic + vỏ capsid), miễn dịch phòng chống bệnh truyền nhiễm.',
    theory1Heading: '1. Sinh trưởng Quần thể Vi khuẩn',
    theory1: '• Trong nuôi cấy không liên tục gồm 4 pha: Tiềm phát (Lag) $\\to$ Lũy thừa (Log, chia theo $2^n$) $\\to$ Cân bằng $\\to$ Suy vong.',
    theory2Heading: '2. Virus & Vắc-xin',
    theory2: '• Virus sống kí sinh nội bào bắt buộc. Thể thực khuẩn có chu trình sinh tan (làm vỡ tế bào chủ) hoặc tiềm tan (cài prophage vào DNA chủ).',
    keyFormulas: ['N_t = N_0 \\cdot 2^{t/g}'],
    sim2d: 'viral_lytic_cycle_2d',
    sim3d: 'virus_bacteriophage_3d',
    mcq1: {
      source: 'Sinh 10 · Bài tập Vi sinh',
      question: 'Một tế bào vi khuẩn có thời gian thế hệ $g = 20$ phút. Sau $2$ giờ ($120$ phút), từ $1$ tế bào ban đầu tạo được:',
      options: ['A. 16 tế bào', 'B. 32 tế bào', 'C. 64 tế bào', 'D. 128 tế bào'],
      correctIndex: 2,
      explanation: 'Số lần phân chia $n = 120 / 20 = 6 \\Rightarrow N = 1 \\times 2^6 = 64$.'
    },
    mcq2: {
      source: 'Sinh 10',
      question: 'Thành phần bắt buộc có mặt ở mọi loại virus là:',
      options: ['A. Ribosome và màng nhầy', 'B. Lõi axit nucleic (DNA hoặc RNA) và vỏ protein capsid', 'C. Thành peptidoglycan', 'D. Ti thể và lưới nội chất'],
      correctIndex: 1,
      explanation: 'Mọi virus đều có hai phần cơ bản là hệ gen (DNA hoặc RNA) và vỏ bọc protein capsid.'
    },
    essay: {
      source: 'Sinh 10',
      question: 'Vì sao không dùng thuốc kháng sinh (như Penicillin) để tiêu diệt virus cảm cúm hay SARS-CoV-2?',
      solutionSteps: ['Kháng sinh ức chế thành peptidoglycan hoặc ribosome 70S của vi khuẩn; virus không có thành tế bào và mượn bộ máy tế bào người'],
      finalAnswer: 'Vì virus không có cấu tạo tế bào, thành peptidoglycan hay ribosome riêng để kháng sinh tác động.'
    }
  }),

  // ==================== SINH HỌC 11 (GDPT 2018) ====================
  makeBioLesson({
    id: 'bio-11-1',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Sinh học 11',
    sourceTag: 'Sinh 11 · Quang hợp Thực vật',
    lessonNumber: 1,
    title: 'Quang hợp ở Thực vật C3, C4 và CAM',
    subtitle: 'Pha sáng quang phân li nước tại Thylakoid và chu trình Calvin tại Stroma',
    description: 'Phân tích cơ chế thích nghi quang hợp của thực vật C3, C4 (tránh hô hấp sáng) và CAM (đóng khí khổng ban ngày).',
    theory1Heading: '1. Pha sáng & Pha tối (Chu trình Calvin)',
    theory1: '• **Pha sáng** (thylakoid): năng lượng ánh sáng phân li $H_2O$ giải phóng $O_2$, tạo $ATP$ và $NADPH$.\n• **Pha tối** (stroma): cố định $CO_2$ qua chu trình Calvin tạo đường $C_6H_{12}O_6$ (chất nhận $CO_2$ đầu tiên ở C3 là RuBP 5C).',
    theory2Heading: '2. So sánh Thực vật C3, C4 & CAM',
    theory2: '• **C4** (ngô, mía): cố định $CO_2$ bằng PEP cacboxylaza không bị ức chế bởi $O_2$, không có hô hấp sáng.\n• **CAM** (xương rồng, dứa): mở khí khổng ban đêm nhận $CO_2$, ban ngày đóng giữ nước.',
    keyFormulas: ['6\\text{CO}_2 + 12\\text{H}_2\\text{O} \\to \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 + 6\\text{H}_2\\text{O}'],
    sim2d: 'photosynthesis_calvin_2d',
    sim3d: 'chloroplast_thylakoid_3d',
    mcq1: {
      source: 'Sinh 11',
      question: 'Khí $O_2$ thải ra trong quang hợp có nguồn gốc từ phân tử nào?',
      options: ['A. CO₂', 'B. H₂O (quang phân li nước)', 'C. Glucose', 'D. Diệp lục a'],
      correctIndex: 1,
      explanation: 'Thí nghiệm đồng vị phóng xạ $O^{18}$ chứng minh toàn bộ khí $O_2$ giải phóng ở pha sáng đến từ quang phân li nước.'
    },
    mcq2: {
      source: 'Sinh 11',
      question: 'Nhóm thực vật nào mở khí khổng lấy $CO_2$ vào ban đêm và đóng khí khổng vào ban ngày để tiết kiệm nước?',
      options: ['A. Thực vật C3 (lúa)', 'B. Thực vật C4 (ngô)', 'C. Thực vật CAM (xương rồng, dứa)', 'D. Rong nước ngọt'],
      correctIndex: 2,
      explanation: 'Thực vật CAM vùng khô hạn cố định $CO_2$ ban đêm thành axit malic rồi dùng cho chu trình Calvin ban ngày.'
    },
    essay: {
      source: 'Sinh 11',
      question: 'Vì sao năng suất sinh học của cây ngô, mía (C4) thường cao hơn cây lúa (C3) trong điều kiện nắng nóng?',
      solutionSteps: ['Cây C4 có enzyme PEP-carboxylase ái lực cao với $CO_2$, phân tách không gian cố định $CO_2$ nên loại bỏ hô hấp sáng'],
      finalAnswer: 'Vì cây C4 không xảy ra hô hấp sáng lãng phí sản phẩm quang hợp ở nhiệt độ và cường độ ánh sáng cao.'
    }
  }),
  makeBioLesson({
    id: 'bio-11-2',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Sinh học 11',
    sourceTag: 'Sinh 11 · Trao đổi Nước & Khoáng',
    lessonNumber: 2,
    title: 'Trao đổi Nước, Khoáng (Mạch gỗ – Mạch rây) & Dinh dưỡng Nitơ ở Thực vật',
    subtitle: 'Động lực đẩy/hút của dòng mạch gỗ, cơ chế đóng mở khí khổng và cố định đạm N₂',
    description: 'Phân biệt con đường gian bào/tế bào chất qua đai Caspary rễ và chu trình chuyển hóa Nitơ cho cây trồng.',
    theory1Heading: '1. Dòng Mạch gỗ (Xylem) & Dòng Mạch rây (Phloem)',
    theory1: '• Mạch gỗ (tế bào chết hóa gỗ) vận chuyển nước & ion khoáng nhờ 3 lực: áp suất rễ, lực liên kết hydro và lực kéo thoát hơi nước ở lá.\n• Mạch rây (ống rây + tế bào kèm) vận chuyển saccarôzơ từ lá xuống cơ quan dự trữ.',
    theory2Heading: '2. Dinh dưỡng Nitơ',
    theory2: '• Cây chỉ hấp thụ được nitơ vô cơ dạng $NH_4^+$ và $NO_3^-$. Vi khuẩn cộng sinh nốt sần cây họ Đậu cố định $N_2$ khí quyển nhờ enzyme Nitrogenase.',
    keyFormulas: ['\\text{N}_2 + 8H^+ + 8e^- + 16\\text{ATP} \\to 2\\text{NH}_3 + \\text{H}_2 + 16\\text{ADP}'],
    sim2d: 'plant_transpiration_2d',
    sim3d: 'plant_vascular_3d',
    mcq1: {
      source: 'Sinh 11',
      question: 'Động lực chủ yếu giúp kéo cột nước cao hàng chục mét từ rễ lên ngọn cây là:',
      options: ['A. Áp suất thẩm thấu của hoa', 'B. Lực hút do thoát hơi nước ở lá', 'C. Chênh lệch saccarôzơ mạch rây', 'D. Lực đẩy của khí quyển'],
      correctIndex: 1,
      explanation: 'Sự thoát hơi nước qua khí khổng tạo sức hút rất lớn kết hợp lực liên kết giữa các phân tử nước trong mạch gỗ.'
    },
    mcq2: {
      source: 'Sinh 11',
      question: 'Rễ cây chỉ hấp thụ được Nitơ dưới hai dạng ion nào?',
      options: ['A. N₂ tự do và NO₂', 'B. NH₄⁺ và NO₃⁻', 'C. Protein và Axit amin', 'D. N₂O và NH₃'],
      correctIndex: 1,
      explanation: 'Nitơ khoáng cây hấp thụ trực tiếp là dạng amoni ($NH_4^+$) và nitrat ($NO_3^-$).'
    },
    essay: {
      source: 'Sinh 11',
      question: 'Vai trò của đai Caspary ở tế bào nội bì rễ là gì?',
      solutionSteps: ['Đai Caspary chặn dòng nước đi theo con đường gian bào, ép nước và khoáng đi qua màng sinh chất tế bào nội bì'],
      finalAnswer: 'Kiểm soát và chọn lọc lượng nước cùng ion khoáng trước khi đi vào mạch gỗ trung trụ.'
    }
  }),
  makeBioLesson({
    id: 'bio-11-3',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Sinh học 11',
    sourceTag: 'Sinh 11 · Cảm ứng & Hoocmôn Thực vật',
    lessonNumber: 3,
    title: 'Hoocmôn Thực vật (Auxin, Gibberellin, Cytokinin, ABA, Etilen) & Cảm ứng',
    subtitle: 'Cơ chế hướng sáng, hướng trọng lực và ứng động đóng mở hoa/lá',
    description: 'Khảo sát nhóm chất kích thích sinh trưởng và nhóm chất ức chế sinh trưởng cùng ứng dụng nông nghiệp.',
    theory1Heading: '1. Nhóm Kích thích vs Ức chế Sinh trưởng',
    theory1: '• **Kích thích**: Auxin (giãn dài tế bào, ra rễ), Gibberellin (vươn lóng, nảy mầm), Cytokinin (phân chia tế bào, chống già hóa).\n• **Ức chế**: Axit Abxixic ABA (ngủ hạt, đóng khí khổng khi hạn), Etilen (chín quả nhanh, rụng lá).',
    theory2Heading: '2. Tính Hướng động (Tropism)',
    theory2: '• Ngọn hướng sáng dương do Auxin di chuyển sang phía tối kích thích tế bào phía tối giãn dài nhanh hơn.',
    keyFormulas: ['\\text{Auxin cao / Cytokinin thấp} \\to \\text{Ra rễ};\\quad \\text{Cytokinin cao / Auxin thấp} \\to \\text{Chồi}'],
    sim2d: 'phytohormone_tropism_2d',
    sim3d: 'plant_vascular_3d',
    mcq1: {
      source: 'Sinh 11',
      question: 'Hoocmôn thực vật ở thể khí thúc đẩy nhanh quá trình chín của quả là:',
      options: ['A. Auxin', 'B. Gibberellin', 'C. Etilen (C₂H₄)', 'D. Cytokinin'],
      correctIndex: 2,
      explanation: 'Etilen là hoocmôn khí điều hòa sự chín quả, tăng hô hấp đột biến ở quả chín.'
    },
    mcq2: {
      source: 'Sinh 11',
      question: 'Khi đất khô hạn, hoocmôn nào tăng nhanh để kích thích đóng khí khổng giữ nước?',
      options: ['A. Axit abxixic (ABA)', 'B. Auxin', 'C. Gibberellin', 'D. Florigen'],
      correctIndex: 0,
      explanation: 'ABA tác động lên kênh ion tế bào hạt đậu làm thoát $K^+$ và nước, giúp đóng khí khổng kịp thời.'
    },
    essay: {
      source: 'Sinh 11',
      question: 'Tại sao đặt chuối xanh cạnh một quả táo chín lại giúp chuối chín vàng nhanh hơn?',
      solutionSteps: ['Quả táo chín giải phóng khí Etilen, khuếch tán sang quả chuối xanh kích thích tổng hợp enzyme phân giải tinh bột thành đường'],
      finalAnswer: 'Do khí Etilen phát ra từ táo chín kích thích phản ứng chín quả của chuối.'
    }
  }),
  makeBioLesson({
    id: 'bio-11-4',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Sinh học 11',
    sourceTag: 'Sinh 11 · Tuần hoàn & Tim mạch',
    lessonNumber: 4,
    title: 'Hệ Tuần hoàn Động vật, Chu kì Tim & Điều hòa Huyết áp',
    subtitle: 'Hệ dẫn truyền tim tự động (Nút xoang nhĩ SA → AV → Bó His → Purkinje) & Điện tâm đồ',
    description: 'Phân tích tuần hoàn đơn/kép, pha co/giãn chu kì tim 0,8 giây và quy luật biến đổi huyết áp – vận tốc máu.',
    theory1Heading: '1. Chu kì Hoạt động Tim (0,8 giây ở 75 nhịp/phút)',
    theory1: '• Co tâm nhĩ ($0{,}1\\text{ s}$) $\\to$ Co tâm thất ($0{,}3\\text{ s}$) $\\to$ Giãn chung ($0{,}4\\text{ s}$).\n• Tính tự động tim do nút xoang nhĩ (SA node) phát nhịp.',
    theory2Heading: '2. Huyết áp và Vận tốc máu trong Hệ mạch',
    theory2: '• Huyết áp giảm dần từ Động mạch $\\to$ Mao mạch $\\to$ Tĩnh mạch.\n• Vận tốc máu chậm nhất ở Mao mạch (tổng tiết diện lớn nhất) giúp tối ưu trao đổi chất.',
    keyFormulas: ['CO = HR \\times SV \\approx 5{,}25\\text{ L/phút}'],
    sim2d: 'cardiac_cycle_2d',
    sim3d: 'human_heart_3d',
    mcq1: {
      source: 'Sinh 11',
      question: 'Vận tốc máu chảy chậm nhất ở đoạn mạch nào sau đây?',
      options: ['A. Động mạch chủ', 'B. Tiểu động mạch', 'C. Hệ mao mạch', 'D. Tĩnh mạch chủ'],
      correctIndex: 2,
      explanation: 'Vì tổng tiết diện của hệ mao mạch là lớn nhất nên dòng máu chảy chậm nhất (~0,5 mm/s) để kịp trao đổi khí và chất.'
    },
    mcq2: {
      source: 'Sinh 11',
      question: 'Bộ phận phát nhịp chủ nhịp tự động cho toàn bộ quả tim người là:',
      options: ['A. Nút nhĩ thất (AV)', 'B. Nút xoang nhĩ (SA)', 'C. Bó His', 'D. Mạng lưới Purkinje'],
      correctIndex: 1,
      explanation: 'Nút xoang nhĩ nằm ở tâm nhĩ phải tự động phát xung điện với tần số cao nhất (~75 lần/phút).'
    },
    essay: {
      source: 'Sinh 11',
      question: 'Một người có nhịp tim $80\\text{ lần/phút}$ và thể tích mỗi nhát bóp tâm thu là $75\\text{ mL}$. Tính lưu lượng tim.',
      solutionSteps: ['$CO = 80 \\times 75 = 6000\\text{ mL/phút} = 6{,}0\\text{ L/phút}$'],
      finalAnswer: '6,0 lít/phút'
    }
  }),
  makeBioLesson({
    id: 'bio-11-5',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Sinh học 11',
    sourceTag: 'Sinh 11 · Hô hấp Động vật',
    lessonNumber: 5,
    title: 'Hô hấp Động vật, Trao đổi Khí Phế nang & Hiệu ứng Bohr Hemoglobin',
    subtitle: '4 bề mặt trao đổi khí và sự dịch chuyển đường cong phân li O₂ theo pH/CO₂',
    description: 'Khám phá quá trình thông khí ở phổi, cấu trúc hàng trăm triệu phế nang và cơ chế vận chuyển O₂, CO₂ trong máu.',
    theory1Heading: '1. Đặc điểm Bề mặt Trao đổi Khí',
    theory1: '• Diện tích rộng, mỏng và ẩm ướt, có nhiều mao mạch giàu sắc tố hô hấp (Hemoglobin) và sự lưu thông khí liên tục.',
    theory2Heading: '2. Vận chuyển O₂ và Hiệu ứng Bohr',
    theory2: '• Ở mô hoạt động mạnh, nồng độ $CO_2$ tăng và pH giảm đẩy cân bằng phân li sang phải (hiệu ứng Bohr), giúp Hemoglobin nhả thêm $O_2$ kịp thời cho tế bào.',
    keyFormulas: ['\\text{Hb} + 4\\text{O}_2 \\rightleftharpoons \\text{Hb}(\\text{O}_2)_4'],
    sim2d: 'bohr_hemoglobin_2d',
    sim3d: 'alveoli_capillary_3d',
    mcq1: {
      source: 'Sinh 11',
      question: 'Động vật nào trao đổi khí đạt hiệu quả cao nhất nhờ dòng máu chảy song song ngược chiều với dòng nước qua mang?',
      options: ['A. Giun đất', 'B. Côn trùng', 'C. Cá xương', 'D. Lưỡng cư'],
      correctIndex: 2,
      explanation: 'Cơ chế dòng chảy ngược chiều giúp cá xương lấy được tới hơn 80% lượng oxy hòa tan trong nước.'
    },
    mcq2: {
      source: 'Sinh 11',
      question: 'Khí $CO$ (cacbon monoxit) gây ngạt tử vong nhanh chóng do:',
      options: ['A. Kết hợp bền chặt với Hemoglobin mạnh hơn O₂ gấp ~210 lần tạo HbCO', 'B. Phá hủy hoàn toàn phế nang', 'C. Làm đông máu ngay lập tức', 'D. Ngăn cản CO₂ vào tế bào'],
      correctIndex: 0,
      explanation: 'Ái lực cực mạnh của $CO$ chiếm chỗ gắn $O_2$ trên nhân Hem của Hemoglobin khiến mô thiếu oxy nghiêm trọng.'
    },
    essay: {
      source: 'Sinh 11',
      question: 'Giải thích ý nghĩa của hiệu ứng Bohr đối với vận động viên chạy marathon.',
      solutionSteps: ['Cơ tăng hô hấp tạo $CO_2$ và axit lactic làm giảm pH tại mô cơ', 'Độ bão hòa $HbO_2$ giảm xuống giúp giải phóng nhiều $O_2$ hơn đúng nơi đang cần'],
      finalAnswer: 'Tăng cường cấp $O_2$ đúng tại mô cơ đang tăng chuyển hóa và sinh nhiều $CO_2$/H⁺.'
    }
  }),
  makeBioLesson({
    id: 'bio-11-6',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Sinh học 11',
    sourceTag: 'Sinh 11 · Bài tiết & Cân bằng Nội môi',
    lessonNumber: 6,
    title: 'Bài tiết Nước tiểu qua Nephron & Cân bằng Nội môi (pH, Đường huyết, Áp suất Thẩm thấu)',
    subtitle: 'Điều hòa đường huyết Insulin–Glucagon, áp suất thẩm thấu ADH và hệ đệm bicarbonat pH máu',
    description: 'Hiểu cơ chế lọc máu ở cầu thận và cơ chế phản hồi âm duy trì hằng tính nội môi cơ thể.',
    theory1Heading: '1. Cấu trúc Nephron & 3 Quá trình Tạo Nước tiểu',
    theory1: '• Mỗi quả thận chứa ~1 triệu nephron gồm: **Lọc** ở nang Bowman $\\to$ **Tái hấp thu** đường/axit amin/Na⁺/nước tại ống lượn & quai Henle $\\to$ **Tiết tiếp** chất độc tại ống lượn xa.',
    theory2Heading: '2. Điều hòa Nội môi bằng Phản hồi Âm',
    theory2: '• **Đường huyết**: cao $\\to$ tụy tiết Insulin; hạ $\\to$ tụy tiết Glucagon.\n• **pH máu ($7{,}35\\text{--}7{,}45$)**: giữ bởi hệ đệm $H_2CO_3/HCO_3^-$, phổi và thận.',
    keyFormulas: ['\\text{pH máu chuẩn}: 7{,}35 - 7{,}45,\\quad \\text{Glucose đói}: 3{,}9 - 6{,}4\\text{ mmol/L}'],
    sim2d: 'nephron_filtration_2d',
    sim3d: 'nephron_kidney_3d',
    mcq1: {
      source: 'Sinh 11',
      question: 'Hormone nào làm giảm đường huyết bằng cách kích thích tế bào nhận glucose và chuyển thành glycogen dự trữ ở gan?',
      options: ['A. Glucagon', 'B. Insulin', 'C. ADH', 'D. Adrenalin'],
      correctIndex: 1,
      explanation: 'Insulin do tế bào $\\beta$ đảo tụy tiết ra có tác dụng hạ đường huyết sau bữa ăn.'
    },
    mcq2: {
      source: 'Sinh 11',
      question: 'Quá trình siêu lọc máu diễn ra ở bộ phận nào của Nephron?',
      options: ['A. Quản cầu Malpighi và nang Bowman', 'B. Quai Henle', 'C. Ống góp', 'D. Bể thận'],
      correctIndex: 0,
      explanation: 'Áp suất máu cao ở mao mạch cầu thận đẩy nước và phân tử nhỏ qua màng lọc vào khoang nang Bowman.'
    },
    essay: {
      source: 'Sinh 11',
      question: 'Tại sao sau khi ăn quá mặn ta thường cảm thấy khát nước và lượng nước tiểu ít đậm đặc?',
      solutionSteps: ['Áp suất thẩm thấu máu tăng kích thích vùng dưới đồi gây cảm giác khát và tuyến yên tiết ADH', 'ADH tăng mở kênh aquaporin ở ống góp để tái hấp thu giữ nước lại cơ thể'],
      finalAnswer: 'Do cơ chế tăng tiết ADH tái hấp thu nước ở thận và kích hoạt trung khu khát.'
    }
  }),
  makeBioLesson({
    id: 'bio-11-7',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Sinh học 11',
    sourceTag: 'Sinh 11 · Cảm ứng Thần kinh',
    lessonNumber: 7,
    title: 'Điện thế Nghỉ, Điện thế Hoạt động Neuron & Truyền tin qua Xináp',
    subtitle: 'Kênh K⁺/Na⁺, lan truyền nhảy cóc qua bao Myelin và xináp hóa học',
    description: 'Khảo sát sự hình thành xung điện thần kinh và truyền xung một chiều qua khe xináp hóa học.',
    theory1Heading: '1. Điện thế Nghỉ (-70 mV) & Điện thế Hoạt động (+35 mV)',
    theory1: '• Nghỉ: ngoài tích điện dương, trong tích âm nhờ chênh lệch $K^+$ và bơm $Na^+/K^+$.\n• Khi kích thích đạt ngưỡng: mở kênh $Na^+$ gây mất phân cực/đảo cực ($+35\\text{ mV}$), sau đó mở kênh $K^+$ tái phân cực.',
    theory2Heading: '2. Xináp Hóa học',
    theory2: '• Chỉ truyền theo 1 chiều từ màng trước (chứa bóng chất trung gian ACh) sang màng sau (chứa thụ thể đặc hiệu).',
    keyFormulas: ['\\text{Nghỉ } (-70\\text{ mV}) \\xrightarrow{\\text{Na}^+\\text{ vào}} \\text{Khử cực } (+35\\text{ mV}) \\xrightarrow{\\text{K}^+\\text{ ra}} \\text{Tái phân cực}'],
    sim2d: 'action_potential_2d',
    sim3d: 'neuron_synapse_3d',
    mcq1: {
      source: 'Sinh 11',
      question: 'Xung thần kinh truyền qua xináp hóa học chỉ đi theo một chiều vì:',
      options: ['A. Màng sau mới có bóng chứa chất trung gian', 'B. Chỉ màng trước có bóng chất trung gian và chỉ màng sau có thụ thể tiếp nhận', 'C. Bao myelin ngăn không cho quay lại', 'D. Bơm Na⁺/K⁺ chỉ đẩy 1 chiều'],
      correctIndex: 1,
      explanation: 'Cấu tạo bất đối xứng của xináp (túi chất trung gian ở chùy xináp, thụ thể ở màng sau) đảm bảo truyền tin 1 chiều.'
    },
    mcq2: {
      source: 'Sinh 11',
      question: 'Giai đoạn mất phân cực và đảo cực của điện thế hoạt động do dòng ion nào di chuyển vào trong tế bào?',
      options: ['A. Ion K⁺', 'B. Ion Cl⁻', 'C. Ion Na⁺', 'D. Ion Mg²⁺'],
      correctIndex: 2,
      explanation: 'Kênh $Na^+$ cổng điện thế mở ồ ạt cho $Na^+$ tràn từ ngoài vào làm mặt trong trở nên dương.'
    },
    essay: {
      source: 'Sinh 11',
      question: 'Tại sao xung thần kinh lan truyền trên sợi có bao myelin nhanh hơn rất nhiều và ít tốn ATP hơn sợi không có bao myelin?',
      solutionSteps: ['Bao myelin cách điện khiến xung nhảy cóc qua các eo Ranvier, giảm số lượng điểm khử cực và giảm hoạt động bơm Na⁺/K⁺'],
      finalAnswer: 'Nhờ cơ chế lan truyền nhảy cóc giữa các eo Ranvier và tiết kiệm ATP cho bơm Na⁺/K⁺.'
    }
  }),
  makeBioLesson({
    id: 'bio-11-8',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Sinh học 11',
    sourceTag: 'Sinh 11 · Miễn dịch ở Người & Động vật',
    lessonNumber: 8,
    title: 'Hệ Miễn dịch Không đặc hiệu & Đặc hiệu (Dịch thể IgG / Tế bào T) & Vắc-xin',
    subtitle: 'Tế bào B tiết kháng thể, tế bào T độc tiêu diệt tế bào nhiễm và trí nhớ miễn dịch',
    description: 'Phân biệt hàng rào vật lí–hóa học, đáp ứng miễn dịch nguyên phát – thứ phát và cơ chế dị ứng / tự miễn.',
    theory1Heading: '1. Miễn dịch Không đặc hiệu vs Đặc hiệu',
    theory1: '• **Không đặc hiệu** (bẩm sinh): da, niêm mạc, dịch nhầy, bạch cầu đại thực bào, phản ứng sốt/viêm.\n• **Đặc hiệu** (thu được): tế bào lympho B (miễn dịch dịch thể tiết kháng thể) và lympho T độc (tiêu diệt tế bào nhiễm virus/ung thư).',
    theory2Heading: '2. Cơ sở khoa học của Vắc-xin',
    theory2: '• Vắc-xin đưa kháng nguyên đã làm suy yếu/bất hoạt kích hoạt hình thành **tế bào nhớ miễn dịch**; khi mầm bệnh thật xâm nhập, đáp ứng thứ phát diễn ra cực nhanh và mạnh.',
    keyFormulas: ['\\text{Mũi 1 (Nguyên phát)} \\to \\text{Tế bào nhớ B/T} \\xrightarrow{\\text{Mũi 2}} \\text{IgG}\\uparrow\\uparrow'],
    sim2d: 'immune_antibody_2d',
    sim3d: 'antibody_antigen_3d',
    mcq1: {
      source: 'Sinh 11',
      question: 'Loại tế bào nào trực tiếp sản xuất và giải phóng kháng thể vào máu trong miễn dịch dịch thể?',
      options: ['A. Hồng cầu', 'B. Tế bào T độc', 'C. Tương bào (phát triển từ lympho B)', 'D. Tiểu cầu'],
      correctIndex: 2,
      explanation: 'Khi được hoạt hóa, tế bào lympho B biệt hóa thành tương bào tiết ra lượng lớn kháng thể đặc hiệu.'
    },
    mcq2: {
      source: 'Sinh 11',
      question: 'Bệnh AIDS do virus HIV làm suy giảm miễn dịch nghiêm trọng vì HIV tấn công phá hủy chủ yếu tế bào nào?',
      options: ['A. Tế bào T hỗ trợ (CD4⁺)', 'B. Tế bào cơ tim', 'C. Hồng cầu trưởng thành', 'D. Nơron vận động'],
      correctIndex: 0,
      explanation: 'HIV xâm nhập tế bào T hỗ trợ (Th) làm sụp đổ cả miễn dịch dịch thể lẫn miễn dịch tế bào.'
    },
    essay: {
      source: 'Sinh 11',
      question: 'Giải thích vì sao sau khi tiêm phòng vắc-xin đủ liều, người ta vẫn cần tiêm nhắc lại sau một khoảng thời gian.',
      solutionSteps: ['Kích hoạt lại tế bào nhớ giúp nhân nhanh quần thể B nhớ và nâng nồng độ kháng thể IgG bảo vệ vượt ngưỡng miễn dịch'],
      finalAnswer: 'Để củng cố trí nhớ miễn dịch và duy trì nồng độ kháng thể đặc hiệu cao.'
    }
  }),

  // ==================== SINH HỌC 12 (GDPT 2018) ====================
  makeBioLesson({
    id: 'bio-12-1',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Sinh học 12',
    sourceTag: 'Sinh 12 · Tái bản DNA & Mã di truyền',
    lessonNumber: 1,
    title: 'DNA, Mã di truyền & Cơ chế Tái bản bán bảo toàn (Enzyme DNA Polymerase)',
    subtitle: 'Mạch dẫn liên tục 3’→5’, mạch chậm Okazaki, ligase nối đoạn và đặc điểm mã bộ ba',
    description: 'Hiểu bản chất tái bản DNA ở cả hai chạc chữ Y và cách tính số phân tử DNA con chứa mạch cũ/mới.',
    theory1Heading: '1. Đặc điểm Mã di truyền (64 bộ ba)',
    theory1: '• Mã bộ ba đọc liên tục theo chiều $5\' \\to 3\'$, có tính phổ biến, đặc hiệu và thoái hóa.\n• Mã mở đầu: $5\'AUG3\'$ (Met); 3 bộ ba kết thúc: $UAA, UAG, UGA$.',
    theory2Heading: '2. Cơ chế Tái bản DNA',
    theory2: '• DNA polymerase chỉ tổng hợp mạch mới theo chiều $5\' \\to 3\'$ nên một mạch khuôn $3\'\\to 5\'$ tổng hợp liên tục, mạch còn lại gián đoạn thành đoạn Okazaki rồi được Ligase nối lại.',
    keyFormulas: ['\\text{Số DNA mới hoàn toàn sau } k\\text{ lần} = 2^k - 2', '64 = 4^3\\text{ bộ ba (61 mã hóa aa + 3 stop)}'],
    sim2d: 'dna_replication_2d',
    sim3d: 'dna_double_helix_3d',
    mcq1: {
      source: 'Sinh 12',
      question: 'Enzyme DNA polymerase tổng hợp mạch DNA mới theo chiều nào?',
      options: ['A. 3’ → 5’', 'B. 5’ → 3’', 'C. Cả hai chiều cùng lúc', 'D. Ngẫu nhiên'],
      correctIndex: 1,
      explanation: 'DNA polymerase chỉ có thể gắn thêm dNTP tự do vào đầu $3\'-OH$ nên luôn kéo dài mạch mới theo chiều $5\' \\to 3\'$.'
    },
    mcq2: {
      source: 'Sinh 12',
      question: 'Từ $1$ phân tử DNA mẹ đánh dấu đồng vị $N^{15}$ nhân đôi $4$ lần trong môi trường $N^{14}$ thường. Có bao nhiêu phân tử DNA con hoàn toàn chỉ chứa $N^{14}$?',
      options: ['A. 16', 'B. 14', 'C. 8', 'D. 2'],
      correctIndex: 1,
      explanation: 'Theo nguyên tắc bán bảo toàn, có $2$ phân tử còn giữ mỗi mạch $N^{15}$ cũ, nên số phân tử mới hoàn toàn $= 2^4 - 2 = 14$.'
    },
    essay: {
      source: 'Sinh 12',
      question: 'Tại sao trên một chạc chữ Y chỉ có một mạch được tổng hợp liên tục còn mạch kia tổng hợp gián đoạn?',
      solutionSteps: ['Hai mạch khuôn DNA song song ngược chiều mà DNA polymerase chỉ xúc tác chiều $5\' \\to 3\'$'],
      finalAnswer: 'Vì hai mạch khuôn ngược chiều nhau và DNA polymerase chỉ kéo dài theo chiều 5’→3’.'
    }
  }),
  makeBioLesson({
    id: 'bio-12-2',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Sinh học 12',
    sourceTag: 'Sinh 12 · Phiên mã, Dịch mã & Operon Lac',
    lessonNumber: 2,
    title: 'Phiên mã mRNA, Dịch mã Ribosome & Điều hòa Biểu hiện Gen (Operon Lac)',
    subtitle: 'Polysome tăng năng suất tổng hợp protein và mô hình bật/tắt Operon Lac ở E. coli',
    description: 'Khảo sát mạch mã gốc $3\'\\to 5\'$, nối đoạn exon/cắt intron ở sinh vật nhân thực và cơ chế điều hòa cảm ứng.',
    theory1Heading: '1. Phiên mã & Dịch mã Polysome',
    theory1: '• RNA polymerase trượt trên mạch gốc $3\'\\to 5\'$ tổng hợp mRNA chiều $5\'\\to 3\'$ ($A_{\\text{gốc}} \\to U$, $T \\to A$, $G \\to C$, $C \\to G$).\n• Nhiều ribosome cùng trượt trên 1 mRNA gọi là polysome giúp tăng tốc tổng hợp cùng loại protein.',
    theory2Heading: '2. Điều hòa Biểu hiện Gen Operon Lac',
    theory2: '• Gồm Promoter (P), Operator (O) và cụm gen cấu trúc Z, Y, A. Gen điều hòa $lacI$ nằm ngoài operon tạo protein ức chế.\n• Không có lactose: protein ức chế bám vào O $\\to$ tắt phiên mã. Có lactose: allolactose bất hoạt protein ức chế $\\to$ bật Z, Y, A.',
    keyFormulas: ['n_{\\text{aa trong 1 chuỗi}} = \\frac{N_{\\text{mRNA}}}{3} - 1', 'N_{\\text{gen}} = 2 N_{\\text{mRNA}}'],
    sim2d: 'lac_operon_2d',
    sim3d: 'ribosome_translation_3d',
    mcq1: {
      source: 'Sinh 12',
      question: 'Trong mô hình Operon Lac của Monod và Jacob, thành phần nào KHÔNG thuộc cấu trúc của Operon Lac?',
      options: ['A. Vùng khởi động P', 'B. Vùng vận hành O', 'C. Cụm gen cấu trúc lacZ, lacY, lacA', 'D. Gen điều hòa lacI'],
      correctIndex: 3,
      explanation: 'Gen điều hòa $lacI$ nằm bên ngoài và điều khiển hoạt động của Operon Lac.'
    },
    mcq2: {
      source: 'Sinh 12',
      question: 'Đột biến xảy ra tại vùng nào khiến cụm gen Z, Y, A phiên mã liên tục ngay cả khi không có lactose?',
      options: ['A. Vùng khởi động P bị hỏng', 'B. Đột biến gen lacI làm protein ức chế mất khả năng bám O', 'C. Đột biến mất gen Z', 'D. Tăng nồng độ glucose cao'],
      correctIndex: 1,
      explanation: 'Khi protein ức chế bị biến đổi không bám được vào Operator (O), RNA polymerase tự do phiên mã Z, Y, A.'
    },
    essay: {
      source: 'Sinh 12',
      question: 'Một phân tử mRNA trưởng thành có $900$ ribonucleotit. Tính số axit amin trong chuỗi polypeptit hoàn chỉnh được tổng hợp từ mRNA đó.',
      solutionSteps: ['Số bộ ba $= 900/3 = 300$', 'Trừ 1 bộ ba mở đầu (bị cắt Met) và 1 bộ ba kết thúc: $300 - 2 = 298$'],
      finalAnswer: '298 axit amin'
    }
  }),
  makeBioLesson({
    id: 'bio-12-3',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Sinh học 12',
    sourceTag: 'Sinh 12 · Công nghệ DNA & CRISPR',
    lessonNumber: 3,
    title: 'Đột biến Gen, Công nghệ DNA Tái tổ hợp & Chỉnh sửa Gen CRISPR–Cas9',
    subtitle: 'Các dạng đột biến điểm (mất/thêm/thay thế 1 cặp nu) và ứng dụng CRISPR–Cas9 trong y sinh',
    description: 'Đánh giá hậu quả đột biến dịch khung vs đột biến đồng nghĩa/nhầm nghĩa và quy trình tạo plasmid tái tổ hợp.',
    theory1Heading: '1. Đột biến Gen',
    theory1: '• Thay thế 1 cặp nu có thể gây đột biến đồng nghĩa (cùng mã hóa 1 aa), nhầm nghĩa hoặc vô nghĩa (tạo stop codon sớm).\n• Mất hoặc thêm 1 cặp nu gây **đột biến dịch khung** từ vị trí đột biến trở về sau.',
    theory2Heading: '2. Kỹ thuật Di truyền & CRISPR–Cas9',
    theory2: '• Tạo DNA tái tổ hợp cần enzyme cắt giới hạn (Restriction endonuclease) và enzyme nối T4 DNA ligase.\n• Hệ CRISPR–Cas9 dùng sgRNA dẫn đường cắt chính xác DNA tại vị trí cạnh trình tự PAM ($5\'-NGG-3\'$).',
    keyFormulas: ['\\text{Thay } A-T \\leftrightarrow G-C \\implies \\Delta H = \\pm 1\\text{ LK Hydro}'],
    sim2d: 'crispr_editing_2d',
    sim3d: 'dna_double_helix_3d',
    mcq1: {
      source: 'Sinh 12',
      question: 'Dạng đột biến điểm nào thường làm thay đổi nhiều axit amin nhất trong chuỗi polypeptit?',
      options: ['A. Thay thế 1 cặp A–T bằng T–A', 'B. Thay thế 1 cặp G–C bằng A–T', 'C. Mất hoặc thêm 1 cặp nucleotit gần đầu gen', 'D. Thay thế 1 cặp ở bộ ba thứ 3'],
      correctIndex: 2,
      explanation: 'Mất hoặc thêm 1 cặp nu làm dịch chuyển toàn bộ khung đọc bộ ba từ điểm đột biến tới cuối mRNA.'
    },
    mcq2: {
      source: 'Sinh 12 · Công nghệ Gen',
      question: 'Trong công nghệ DNA tái tổ hợp, cặp enzyme thiết yếu để cắt và nối đoạn gen ngoại lai vào plasmid là:',
      options: ['A. Amylase và Lipase', 'B. Restrictase (cắt giới hạn) và Ligase (nối)', 'C. Helicase và Primase', 'D. Pepsin và Trypsin'],
      correctIndex: 1,
      explanation: 'Enzyme giới hạn cắt tạo đầu dính bổ sung và DNA ligase xúc tác nối liên kết phosphodieste tạo plasmid tái tổ hợp.'
    },
    essay: {
      source: 'Sinh 12',
      question: 'Một gen đột biến điểm khiến chiều dài không đổi nhưng số liên kết hiđrô giảm đi 1. Xác định dạng đột biến.',
      solutionSteps: ['Chiều dài không đổi $\\Rightarrow$ thay thế 1 cặp nu', 'Giảm 1 liên kết hiđrô $\\Rightarrow$ thay 1 cặp $G-C$ (3 LK) bằng 1 cặp $A-T$ (2 LK)'],
      finalAnswer: 'Thay thế 1 cặp G–C bằng 1 cặp A–T'
    }
  }),
  makeBioLesson({
    id: 'bio-12-4',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Sinh học 12',
    sourceTag: 'Sinh 12 · Mở rộng học thuyết Mendel & Di truyền Liên kết',
    lessonNumber: 4,
    title: 'Tương tác Gen, Liên kết Gen – Hoán vị Gen Morgan & Di truyền Giới tính',
    subtitle: 'Tỉ lệ 9:7, 9:6:1, 13:3; hoán vị gen với tần số f ≤ 50% và gen lặn trên NST X',
    description: 'Thành thạo kỹ năng tính tỉ lệ giao tử hoán vị $(f/2)$, nhận diện gen nằm trên X hay nhiễm sắc thể thường.',
    theory1Heading: '1. Liên kết & Hoán vị Gen',
    theory1: '• Cơ thể $\\frac{AB}{ab}$ tạo 2 giao tử liên kết $\\underline{AB}=\\underline{ab}=\\frac{1-f}{2}$ và 2 giao tử hoán vị $\\underline{Ab}=\\underline{aB}=\\frac{f}{2}$.\n• Ý nghĩa: lập bản đồ di truyền (1% hoán vị = 1 cM) và tạo biến dị tổ hợp.',
    theory2Heading: '2. Di truyền Liên kết Giới tính',
    theory2: '• Bệnh máu khó đông, mù màu do alen lặn trên vùng không tương đồng của NST $X$ có đặc điểm di truyền chéo (ông ngoại $\\to$ mẹ $\\to$ con trai).',
    keyFormulas: ['\\text{Giao tử hoán vị} = \\frac{f}{2},\\quad \\text{Giao tử liên kết} = \\frac{1 - f}{2}\\quad (f \\le 50\\%)'],
    sim2d: 'gene_linkage_2d',
    sim3d: 'chromosome_mitosis_3d',
    mcq1: {
      source: 'Sinh 12 · Hoán vị gen',
      question: 'Một cơ thể có kiểu gen $\\frac{AB}{ab}$ xảy ra hoán vị gen với tần số $f = 24\\%$. Tỉ lệ loại giao tử $\\underline{Ab}$ tạo ra là:',
      options: ['A. 24%', 'B. 12%', 'C. 38%', 'D. 6%'],
      correctIndex: 1,
      explanation: '$\\underline{Ab}$ là giao tử hoán vị nên chiếm tỉ lệ $f/2 = 24\\%/2 = 12\\%$.'
    },
    mcq2: {
      source: 'Sinh 12 · Giới tính',
      question: 'Người bố bị mù màu ($X^aY$), người mẹ bình thường đồng hợp ($X^AX^A$). Xác suất sinh con trai bị mù màu là:',
      options: ['A. 0%', 'B. 25%', 'C. 50%', 'D. 100%'],
      correctIndex: 0,
      explanation: 'Con trai luôn nhận $Y$ từ bố và $X^A$ từ mẹ $\\Rightarrow 100\\% X^AY$ bình thường.'
    },
    essay: {
      source: 'Sinh 12',
      question: 'Cho phép lai $P: \\frac{AB}{ab} \\times \\frac{AB}{ab}$ (hoán vị cả hai bên với $f = 20\\%$). Tính tỉ lệ kiểu hình đồng hợp lặn $\\frac{ab}{ab}$ ở $F_1$.',
      solutionSteps: ['Giao tử liên kết $\\underline{ab} = (1 - 0{,}2)/2 = 0{,}4$', '$\\frac{ab}{ab} = 0{,}4 \\times 0{,}4 = 0{,}16 = 16\\%$'],
      finalAnswer: '16%'
    }
  }),
  makeBioLesson({
    id: 'bio-12-5',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Sinh học 12',
    sourceTag: 'Sinh 12 · Di truyền Quần thể & Tiến hóa',
    lessonNumber: 5,
    title: 'Di truyền Quần thể (Hardy–Weinberg) & Các Nhân tố Tiến hóa Hiện đại',
    subtitle: 'Cân bằng ngẫu phối p²AA + 2pqAa + q²aa, tự thụ phấn giảm dị hợp và 5 nhân tố tiến hóa',
    description: 'Kiểm chứng điều kiện cân bằng quần thể, phân tích tác động đột biến, di nhập gen, chọn lọc tự nhiên và phiêu bạt di truyền.',
    theory1Heading: '1. Định luật Hardy–Weinberg',
    theory1: '• Một quần thể ngẫu phối lớn, không đột biến, không chọn lọc, không di nhập gen sẽ đạt trạng thái cân bằng: $p^2 AA + 2pq Aa + q^2 aa = 1$ ngay sau 1 thế hệ ngẫu phối.\n• Ngược lại, tự thụ phấn làm tỉ lệ dị hợp $Aa$ giảm một nửa mỗi thế hệ: $(1/2)^n$.',
    theory2Heading: '2. Năm Nhân tố Tiến hóa',
    theory2: '• Đột biến (tạo alen mới), Dòng gen, Phiêu bạt di truyền (làm nghèo vốn gen ở quần thể nhỏ), Giao phối không ngẫu nhiên (không đổi p, q nhưng đổi tần số kiểu gen) và **Chọn lọc tự nhiên** (nhân tố định hướng duy nhất).',
    keyFormulas: ['p + q = 1,\\quad p^2 + 2pq + q^2 = 1', 'H_n = H_0\\left(\\frac{1}{2}\\right)^n\\text{ (tự thụ)}'],
    sim2d: 'hardy_weinberg_2d',
    sim3d: 'ecosystem_biome_3d',
    mcq1: {
      source: 'Sinh 12 · Hardy–Weinberg',
      question: 'Trong một quần thể người cân bằng Hardy–Weinberg, tỉ lệ người bị bệnh bạch tạng (kiểu gen đồng hợp lặn $aa$) là $1/10000 = 0{,}0001$. Tỉ lệ người mang gen dị hợp ($Aa$) không biểu hiện bệnh là:',
      options: ['A. 0,98%', 'B. 1,98%', 'C. 2,00%', 'D. 9,90%'],
      correctIndex: 1,
      explanation: '$q^2 = 0{,}0001 \\Rightarrow q = 0{,}01 \\Rightarrow p = 0{,}99$. Tỉ lệ $Aa = 2pq = 2 \\times 0{,}99 \\times 0{,}01 = 0{,}0198 = 1{,}98\\%$.'
    },
    mcq2: {
      source: 'Sinh 12 · Tiến hóa',
      question: 'Nhân tố tiến hóa nào quy định chiều hướng và nhịp điệu tiến hóa thích nghi của sinh giới?',
      options: ['A. Đột biến ngẫu nhiên', 'B. Phiêu bạt di truyền', 'C. Chọn lọc tự nhiên', 'D. Giao phối không ngẫu nhiên'],
      correctIndex: 2,
      explanation: 'Chọn lọc tự nhiên giữ lại các kiểu hình có giá trị thích nghi cao nên là nhân tố định hướng duy nhất.'
    },
    essay: {
      source: 'Sinh 12',
      question: 'Quần thể thực vật ban đầu có $100\\%\\ Aa$ tự thụ phấn bắt buộc qua $3$ thế hệ. Xác định tỉ lệ kiểu gen $AA, Aa, aa$ ở $F_3$.',
      solutionSteps: ['$Aa = (1/2)^3 = 1/8 = 12{,}5\\%$', '$AA = aa = (1 - 1/8)/2 = 7/16 = 43{,}75\\%$'],
      finalAnswer: '0,4375 AA : 0,125 Aa : 0,4375 aa'
    }
  }),
  makeBioLesson({
    id: 'bio-12-6',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Sinh học 12',
    sourceTag: 'Sinh 12 · Sinh thái học',
    lessonNumber: 6,
    title: 'Quần thể, Quần xã & Hệ sinh thái (Dòng Năng lượng – Tháp Sinh thái 10%)',
    subtitle: 'Tăng trưởng logistic K, tương tác vật ăn thịt–con mồi Lotka–Volterra và chu trình sinh địa hóa',
    description: 'Khám phá giới hạn sinh thái, ổ sinh thái, diễn thế sinh thái nguyên sinh/thứ sinh và dòng năng lượng một chiều.',
    theory1Heading: '1. Sinh thái Quần thể & Quần xã',
    theory1: '• Tăng trưởng thực tế dạng chữ S chịu giới hạn sức chứa môi trường $K$.\n• Các mối quan hệ hỗ trợ (cộng sinh, hội sinh, hợp tác) và đối kháng (cạnh tranh, vật ăn thịt – con mồi, kí sinh).',
    theory2Heading: '2. Dòng Năng lượng & Hiệu suất Sinh thái',
    theory2: '• Vật chất tuần hoàn trong hệ sinh thái nhưng **năng lượng đi theo một chiều** (năng lượng mất khoảng $90\\%$ qua hô hấp, bài tiết ở mỗi bậc dinh dưỡng, chỉ $\\approx 10\\%$ truyền lên bậc kế tiếp).',
    keyFormulas: ['\\frac{dN}{dt} = rN\\left(1 - \\frac{N}{K}\\right)', 'H = \\frac{E_{n+1}}{E_n} \\times 100\\%'],
    sim2d: 'trophic_pyramid_2d',
    sim3d: 'ecosystem_biome_3d',
    mcq1: {
      source: 'Sinh 12 · Sinh thái',
      question: 'Cho chuỗi thức ăn: Cỏ ($12000\\text{ kcal}$) $\\to$ Châu chấu $\\to$ Ếch $\\to$ Rắn. Biết hiệu suất sinh thái giữa mỗi bậc đều là $10\\%$. Năng lượng tích lũy ở bậc Rắn là:',
      options: ['A. 1200 kcal', 'B. 120 kcal', 'C. 12 kcal', 'D. 1,2 kcal'],
      correctIndex: 2,
      explanation: 'Qua 3 bậc chuyển tiếp: $12000 \\times 0{,}1^3 = 12\\text{ kcal}$.'
    },
    mcq2: {
      source: 'Sinh 12',
      question: 'Quá trình diễn thế sinh thái khởi đầu từ một môi trường chưa có sinh vật (như đảo núi lửa mới hình thành) là:',
      options: ['A. Diễn thế nguyên sinh', 'B. Diễn thế thứ sinh', 'C. Diễn thế phân hủy', 'D. Cân bằng đỉnh cực'],
      correctIndex: 0,
      explanation: 'Diễn thế nguyên sinh bắt đầu ở vùng đất trống trơn chưa có mầm mống quần xã trước đó.'
    },
    essay: {
      source: 'Sinh 12',
      question: 'Tại sao chuỗi thức ăn trong hệ sinh thái tự nhiên thường chỉ kéo dài tối đa 4–6 mắt xích?',
      solutionSteps: ['Vì mỗi bậc dinh dưỡng chỉ truyền được ~10% năng lượng lên bậc tiếp theo, phần lớn thất thoát qua nhiệt hô hấp'],
      finalAnswer: 'Do năng lượng hao hụt khoảng 90% qua mỗi bậc dinh dưỡng nên bậc cao không đủ năng lượng duy trì quần thể.'
    }
  })
];
