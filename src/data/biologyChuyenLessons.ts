import { BiologyLesson } from '../types';
import { makeBioLesson } from './biologyGdpt2018Lessons';

export const BIOLOGY_CHUYEN_LESSONS: BiologyLesson[] = [
  makeBioLesson({
    id: 'bio-chuyen-10-1',
    track: 'chuyen',
    grade: 'Lớp 10',
    tier: 'Cơ bản',
    stageLabel: 'Khu Chuyên Sinh · Bậc 1: Tế bào & Động học Enzyme',
    sourceTag: 'Chuyên Sinh 10 · Ức chế cạnh tranh vs Không cạnh tranh',
    lessonNumber: 1,
    title: 'Đồ thị Lineweaver–Burk, Các kiểu Ức chế Enzyme & Điều hòa Dị lập thể',
    subtitle: 'Phân tích biến thiên Vmax và Km dưới tác dụng chất ức chế cạnh tranh, không cạnh tranh và dị lập thể',
    description: 'Làm chủ đồ thị nghịch đảo kép $1/V$ theo $1/[S]$ thường gặp trong đề thi HSG Quốc gia và IBO.',
    theory1Heading: '1. Phương trình Michaelis–Menten & Lineweaver–Burk',
    theory1: '• Nghịch đảo phương trình: $\\frac{1}{V} = \\frac{K_m}{V_{\\max}}\\cdot\\frac{1}{[S]} + \\frac{1}{V_{\\max}}$.\n• **Ức chế cạnh tranh**: $V_{\\max}$ không đổi, $K_m$ biểu kiến **tăng**.\n• **Ức chế không cạnh tranh thuần túy**: $K_m$ không đổi, $V_{\\max}$ **giảm**.',
    theory2Heading: '2. Điều hòa Dị lập thể (Allosteric) & Ức chế Ngược',
    theory2: '• Enzyme dị lập thể có nhiều tiểu đơn vị tạo đường cong sigmoidal chữ S; sản phẩm cuối con đường chuyển hóa quay lại ức chế enzyme đầu tiên tránh dư thừa.',
    keyFormulas: ['\\frac{1}{V} = \\frac{K_m}{V_{\\max}}\\frac{1}{[S]} + \\frac{1}{V_{\\max}}', '\\alpha = 1 + \\frac{[I]}{K_I}'],
    sim2d: 'enzyme_kinetics_2d',
    sim3d: 'enzyme_substrate_3d',
    mcq1: {
      source: 'HSG Sinh Quốc gia',
      question: 'Khi bổ sung chất ức chế cạnh tranh thuận nghịch vào phản ứng xúc tác bởi enzyme, thông số động học biến đổi như thế nào?',
      options: ['A. Vmax tăng, Km giảm', 'B. Vmax không đổi, Km tăng', 'C. Vmax giảm, Km không đổi', 'D. Cả Vmax và Km đều giảm'],
      correctIndex: 1,
      explanation: 'Khi $[S]$ rất lớn có thể đẩy chất ức chế cạnh tranh ra khỏi tâm hoạt động nên $V_{\\max}$ vẫn giữ nguyên, nhưng cần nhiều $[S]$ hơn nên $K_m$ tăng.'
    },
    mcq2: {
      source: 'Chuyên Sinh · Sinh hóa',
      question: 'Nếu cả $V_{\\max}$ và $K_m$ đều giảm cùng tỉ lệ như nhau khi thêm chất ức chế $I$, đó là kiểu ức chế nào?',
      options: ['A. Cạnh tranh', 'B. Phi cạnh tranh (Uncompetitive — chỉ gắn phức hợp ES)', 'C. Hoạt hóa dị lập thể', 'D. Biến tính nhiệt'],
      correctIndex: 1,
      explanation: 'Chất ức chế phi cạnh tranh chỉ gắn vào phức hợp $ES$ làm giảm đồng thời $V_{\\max}$ và $K_m$ theo hệ số $\\alpha\'$.'
    },
    essay: {
      source: 'Chuyên Sinh · IBO Prep',
      question: 'Cho $V_{\\max} = 100\\text{ }\\mu\\text{M/phút}$, $K_m = 2{,}0\\text{ mM}$. Tính tốc độ phản ứng khi $[S] = 8{,}0\\text{ mM}$.',
      solutionSteps: ['$V = \\frac{100 \\times 8}{2 + 8} = \\frac{800}{10} = 80\\text{ }\\mu\\text{M/phút}$'],
      finalAnswer: '80 μM/phút (80% Vmax)'
    }
  }),
  makeBioLesson({
    id: 'bio-chuyen-11-1',
    track: 'chuyen',
    grade: 'Lớp 11',
    tier: 'Nâng cao',
    stageLabel: 'Khu Chuyên Sinh · Bậc 2: Sinh lí Động vật Chuyên sâu',
    sourceTag: 'Chuyên Sinh 11 · Phương trình Nernst & Goldmann màng Neuron',
    lessonNumber: 2,
    title: 'Phương trình Nernst Điện thế Cân bằng Ion & Độ dẫn Na⁺/K⁺ (Hodgkin–Huxley)',
    subtitle: 'Tính toán điện thế màng nghỉ bằng Nernst, thời kì trơ tuyệt đối/tương đối và truyền tin xináp ức chế IPSP',
    description: 'Giải thích cơ chế chọn lọc ion và trạng thái bất hoạt của cổng h kênh Na⁺ quy định xung thần kinh đi 1 chiều.',
    theory1Heading: '1. Phương trình Nernst & Điện thế Đảo ngược',
    theory1: '• Ở $37^\\circ\\text{C}$ cho ion hóa trị $+1$: $E_{\\text{ion}} \\approx 61{,}5 \\cdot \\log_{10}\\frac{[\\text{Ion}]_{\\text{ngoài}}}{[\\text{Ion}]_{\\text{trong}}}\\text{ (mV)}$.\n• Vì màng nghỉ thấm $K^+$ cao gấp ~40 lần $Na^+$, điện thế nghỉ ($-70\\text{ mV}$) nằm rất gần $E_K \\approx -90\\text{ mV}$.',
    theory2Heading: '2. Xináp Kích thích (EPSP) vs Ức chế (IPSP)',
    theory2: '• Chất trung gian kích thích (Glutamat, ACh) mở kênh $Na^+$ gây khử cực EPSP.\n• Chất trung gian ức chế (GABA, Glycine) mở kênh $Cl^-$ hoặc $K^+$ gây ưu phân cực IPSP.',
    keyFormulas: ['E_{\\text{ion}} = 61{,}5\\,\\log_{10}\\frac{[\\text{Ion}]_{\\text{ngoài}}}{[\\text{Ion}]_{\\text{trong}}}\\text{ (mV)}'],
    sim2d: 'synapse_transmission_2d',
    sim3d: 'neuron_synapse_3d',
    mcq1: {
      source: 'HSG Sinh Quốc gia',
      question: 'Bổ sung GABA vào khe xináp kích thích mở kênh $Cl^-$ làm màng sau xináp biến đổi thế nào?',
      options: ['A. Khử cực mạnh tạo xung điện', 'B. Tăng phân cực (ưu phân cực — IPSP) khiến neuron khó hưng phấn hơn', 'C. Phá vỡ màng tế bào', 'D. Mở kênh Na⁺ ồ ạt'],
      correctIndex: 1,
      explanation: '$Cl^-$ đi vào làm bên trong màng âm hơn nữa ($-80\\text{ mV}$), gọi là điện thế sau xináp ức chế (IPSP).'
    },
    mcq2: {
      source: 'Chuyên Sinh 11',
      question: 'Tại sao điện thế hoạt động chỉ lan truyền một chiều dọc theo sợi trục mà không dội ngược lại?',
      options: ['A. Vì vùng vừa hưng phấn đang ở giai đoạn trơ tuyệt đối (cổng bất hoạt kênh Na⁺ đang đóng)', 'B. Vì kênh K⁺ đóng vĩnh viễn', 'C. Do bao myelin chặn ngược lại', 'D. Do hết ATP ngay lập tức'],
      correctIndex: 0,
      explanation: 'Sau đỉnh $+35\\text{ mV}$, kênh $Na^+$ rơi vào trạng thái bất hoạt trong vài mili-giây (giai đoạn trơ tuyệt đối), ngăn xung quay ngược.'
    },
    essay: {
      source: 'Chuyên Sinh · IBO Prep',
      question: 'Biết $[K^+]_{\\text{ngoài}} = 4\\text{ mM}$, $[K^+]_{\\text{trong}} = 140\\text{ mM}$ ở $37^\\circ\\text{C}$. Tính điện thế cân bằng $E_K$.',
      solutionSteps: ['$E_K = 61{,}5 \\times \\log_{10}(4 / 140) = 61{,}5 \\times (-1{,}544) \\approx -95\\text{ mV}$'],
      finalAnswer: '≈ -95 mV'
    }
  }),
  makeBioLesson({
    id: 'bio-chuyen-12-1',
    track: 'chuyen',
    grade: 'Lớp 12',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Sinh · Bậc 3: Di truyền Quần thể & Hệ nhóm máu ABO',
    sourceTag: 'HSG Quốc gia / IBO · Hardy–Weinberg Đa alen & Hoán vị 3 điểm',
    lessonNumber: 3,
    title: 'Quần thể Đa alen ABO (p + q + r = 1) & Lập Bản đồ Gen 3 Điểm',
    subtitle: 'Xác định tần số alen $I^A, I^B, i$ từ tỉ lệ nhóm máu và tìm thứ tự gen + hệ số nhiễu trùng hợp',
    description: 'Kỹ năng giải đề HSG Quốc gia bài toán quần thể đa alen cân bằng và bản đồ di truyền ba điểm A–B–C.',
    theory1Heading: '1. Quần thể Cân bằng 3 Alen Hệ Nhóm máu ABO',
    theory1: '• Đặt $p = f(I^A), q = f(I^B), r = f(i)$ với $p + q + r = 1$.\n• Nhóm máu O ($ii$) = $r^2 \\implies r = \\sqrt{\\text{\\% O}}$.\n• Tổng nhóm B + O $= (q + r)^2 \\implies q = \\sqrt{\\text{\\% B + \\% O}} - r$.',
    theory2Heading: '2. Lập Bản đồ 3 Điểm & Hệ số Nhiễu',
    theory2: '• Hai lớp kiểu hình có số lượng nhỏ nhất trong lai phân tích là **trao đổi chéo kép (DCO)**; so sánh với kiểu gen bố mẹ để xác định ngay gen nằm ở giữa.',
    keyFormulas: ['(p + q + r)^2 = 1', 'r = \\sqrt{\\%\\text{O}},\\quad q + r = \\sqrt{\\%\\text{B} + \\%\\text{O}}'],
    sim2d: 'blood_typing_2d',
    sim3d: 'antibody_antigen_3d',
    mcq1: {
      source: 'HSG Sinh Quốc gia',
      question: 'Một quần thể người cân bằng di truyền có $16\\%$ nhóm máu O và $20\\%$ nhóm máu B. Tần số alen $I^B$ là:',
      options: ['A. 0,10', 'B. 0,20', 'C. 0,40', 'D. 0,60'],
      correctIndex: 1,
      explanation: '$r = \\sqrt{0{,}16} = 0{,}40$. Có $(q + r)^2 = 0{,}20 + 0{,}16 = 0{,}36 \\Rightarrow q + r = 0{,}60 \\Rightarrow q(I^B) = 0{,}20$.'
    },
    mcq2: {
      source: 'Chuyên Sinh · Bản đồ 3 điểm',
      question: 'Khi lập bản đồ di truyền 3 gen liên kết trên 1 NST, cặp kiểu hình xuất hiện với tần số thấp nhất trong phép lai phân tích biểu thị sự kiện nào?',
      options: ['A. Không trao đổi chéo', 'B. Trao đổi chéo đơn vùng 1', 'C. Trao đổi chéo kép đồng thời hai vùng', 'D. Đột biến đảo đoạn'],
      correctIndex: 2,
      explanation: 'Xác suất xảy ra đồng thời 2 điểm đứt trao đổi chéo kép $\\approx f_1 \\cdot f_2$ luôn nhỏ hơn trao đổi chéo đơn.'
    },
    essay: {
      source: 'HSG Sinh học 12',
      question: 'Tiếp theo câu trên ($r=0{,}4$, $q=0{,}2$), tính xác suất để một cặp vợ chồng đều có nhóm máu A trong quần thể trên sinh được một người con có nhóm máu O.',
      solutionSteps: ['$p = 1 - 0{,}4 - 0{,}2 = 0{,}4$. Tỉ lệ $I^A I^A = 0{,}16$, $I^A i = 2(0{,}4)(0{,}4) = 0{,}32$', 'Trong số người nhóm A ($0{,}48$), xác suất mang kiểu gen $I^A i = 0{,}32/0{,}48 = 2/3$', 'Xác suất sinh con O ($ii$) $= (2/3) \\times (2/3) \\times (1/4) = 1/9$'],
      finalAnswer: '1/9 (≈ 11,11%)'
    }
  }),
  makeBioLesson({
    id: 'bio-chuyen-12-2',
    track: 'chuyen',
    grade: 'Lớp 12',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Sinh · Bậc 3: Sinh thái Toán học',
    sourceTag: 'HSG Quốc gia / IBO · Lotka–Volterra & Tháp Sinh thái',
    lessonNumber: 4,
    title: 'Mô hình Động lực Quần thể Lotka–Volterra & Chỉ số Đa dạng Shannon H’',
    subtitle: 'Tìm điểm cân bằng nội tại giữa Con mồi – Vật ăn thịt và đánh giá đa dạng sinh học quần xã',
    description: 'Phân tích nghiệm cân bằng $dN/dt = 0,\\ dP/dt = 0$ trong cạnh tranh hai loài và lưới thức ăn định lượng.',
    theory1Heading: '1. Phương trình Vật ăn thịt – Con mồi Lotka–Volterra',
    theory1: '• $\\frac{dN}{dt} = rN - aNP = 0 \\implies P^* = r/a$.\n• $\\frac{dP}{dt} = baNP - mP = 0 \\implies N^* = m/(ba)$.',
    theory2Heading: '2. Chỉ số Đa dạng Shannon–Wiener H’',
    theory2: '• Đo cả độ giàu loài và độ đồng đều cá thể: $H\' = -\\sum p_i \\ln(p_i)$. Giá trị $H\'$ càng cao thì quần xã càng ổn định trước biến động môi trường.',
    keyFormulas: ['N^* = \\frac{m}{ba},\\quad P^* = \\frac{r}{a}', 'H\' = -\\sum_{i=1}^{S} p_i \\ln(p_i)'],
    sim2d: 'predator_prey_2d',
    sim3d: 'ecosystem_biome_3d',
    mcq1: {
      source: 'Chuyên Sinh · Sinh thái Toán học',
      question: 'Theo phương trình Lotka–Volterra ($dN/dt = rN - aNP$, $dP/dt = baNP - mP$), số lượng cân bằng $P^*$ của vật ăn thịt bằng:',
      options: ['A. r / a', 'B. m / (ba)', 'C. r · a', 'D. m · b'],
      correctIndex: 0,
      explanation: 'Đặt $dN/dt = 0$ với $N > 0$ thu được $r - aP = 0 \\Rightarrow P^* = r/a$.'
    },
    mcq2: {
      source: 'Chuyên Sinh · Quần xã',
      question: 'Trong hai khu rừng có cùng 10 loài cây gỗ, khu nào có chỉ số đa dạng Shannon $H\'$ cao hơn?',
      options: ['A. Khu có 1 loài chiếm 91% số cây', 'B. Khu có tỉ lệ số cá thể giữa 10 loài tương đối đồng đều nhau (~10% mỗi loài)', 'C. Khu có mật độ cây ít nhất', 'D. Hai khu luôn bằng nhau'],
      correctIndex: 1,
      explanation: 'Với cùng số loài $S$, độ đồng đều càng cao thì $-\\sum p_i \\ln p_i$ đạt giá trị cực đại ($\\ln S$).'
    },
    essay: {
      source: 'HSG Sinh 12',
      question: 'Một quần xã có 2 loài đồng đều $p_1 = p_2 = 0{,}5$. Tính chỉ số Shannon $H\'$ (lấy $\\ln 2 \\approx 0{,}693$).',
      solutionSteps: ['$H\' = -(0{,}5\\ln 0{,}5 + 0{,}5\\ln 0{,}5) = \\ln 2 \\approx 0{,}693$'],
      finalAnswer: 'H’ ≈ 0,693'
    }
  })
];
