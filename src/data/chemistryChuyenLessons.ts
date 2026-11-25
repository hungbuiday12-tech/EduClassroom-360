import { ChemistryLesson } from '../types';
import { makeChemLesson } from './chemistryGdpt2018Lessons';

export const CHEMISTRY_CHUYEN_LESSONS: ChemistryLesson[] = [
  {
    ...makeChemLesson({
      id: 'chem-chuyen-9-1',
      track: 'chuyen',
      grade: 'Lớp 9',
      tier: 'Cơ bản',
      stageLabel: 'Khu Chuyên Hóa · Bậc 1: Nền tảng Chuyên 9',
      sourceTag: 'Tuyển sinh Chuyên Hóa 10 · Bảo toàn Khối lượng & Tăng giảm Khối lượng',
      lessonNumber: 1,
      title: 'Kỹ thuật Tăng giảm Khối lượng & Quy đổi Hỗn hợp Kim loại – Oxit',
      subtitle: 'Giải nhanh chuỗi phản ứng nhiệt nhôm, khử oxit bằng CO/H₂ và đẩy muối không cần lập nhiều phương trình',
      description: 'Kỹ năng nền tảng để bước vào Khu Chuyên Hóa: quy đổi hỗn hợp $Fe, FeO, Fe_3O_4, Fe_2O_3$ về hai nguyên tố Fe và O kết hợp bảo toàn electron.',
      theory1Heading: '1. Phương pháp Quy đổi Fe – O',
      theory1: '• Mọi hỗn hợp gồm sắt và các oxit sắt có khối lượng $m$ được quy đổi thành $x$ mol Fe và $y$ mol O: $56x + 16y = m$.\n• Khi tác dụng $HNO_3$ hoặc $H_2SO_4$ đặc nóng dư, toàn bộ Fe lên $Fe^{3+}$ nhường $3x$ mol e; O nhận $2y$ mol e; phần còn lại chuyển sang sản phẩm khử.',
      theory2Heading: '2. Công thức Tăng giảm Khối lượng',
      theory2: '• Cứ $1\\text{ mol}$ nhóm $CO_3^{2-}$ chuyển thành $2\\text{ mol } Cl^-$ làm khối lượng muối tăng $71 - 60 = 11\\text{ g}$.',
      keyFormulas: [
        '3n_{\\text{Fe}} = 2n_{\\text{O}} + n_{e\\text{ sản phẩm khử}}',
        '\\Delta m_{\\text{rắn khử oxit}} = m_{\\text{O mất đi}} = 16 \\cdot n_{\\text{CO}_2}'
      ],
      sim2d: 'metallurgy_furnace_2d',
      sim3d: 'metal_corrosion_3d',
      mcq1: {
        source: 'Tuyển sinh Chuyên Hóa 10',
        question: 'Dẫn luồng khí CO dư qua $20\\text{ g}$ hỗn hợp X gồm $FeO, Fe_3O_4, Fe_2O_3$ đun nóng. Khí thoát ra sục vào $Ca(OH)_2$ dư thu được $25\\text{ g}$ kết tủa. Khối lượng sắt thu được là:',
        options: ['A. 16,0 g', 'B. 14,0 g', 'C. 15,6 g', 'D. 12,0 g'],
        correctIndex: 0,
        explanation: '$n_{\\text{O bị chiếm}} = n_{\\text{CO}_2} = n_{\\text{CaCO}_3} = 25/100 = 0{,}25\\text{ mol} \\Rightarrow m_{\\text{Fe}} = 20 - 0{,}25\\times 16 = 16{,}0\\text{ g}$.'
      },
      mcq2: {
        source: 'Đề Chuyên Hóa',
        question: 'Hòa tan hoàn toàn $14{,}2\\text{ g}$ hỗn hợp $MgCO_3$ và $CaCO_3$ trong HCl dư thu được $V$ lít $CO_2$ (ĐKC) và $15{,}85\\text{ g}$ muối khan. Giá trị của $V$ là:',
        options: ['A. 2,479 L', 'B. 3,7185 L', 'C. 4,958 L', 'D. 1,2395 L'],
        correctIndex: 1,
        explanation: '$\\Delta m = 15{,}85 - 14{,}2 = 1{,}65\\text{ g} \\Rightarrow n_{\\text{CO}_2} = 1{,}65 / 11 = 0{,}15\\text{ mol} \\Rightarrow V = 0{,}15 \\times 24{,}79 = 3{,}7185\\text{ L}$.'
      },
      essay: {
        source: 'Đề Chuyên Hóa Sở GD',
        question: 'Nung $11{,}36\\text{ g}$ hỗn hợp gồm $Fe, FeO, Fe_2O_3, Fe_3O_4$ hòa tan hết vào dung dịch $HNO_3$ loãng dư thu được $1{,}344\\text{ L}$ khí NO (ĐKTC, duy nhất). Tính khối lượng muối $Fe(NO_3)_3$ khan thu được.',
        solutionSteps: ['Quy đổi hỗn hợp thành $x$ mol Fe và $y$ mol O: $56x + 16y = 11{,}36$.', 'Bảo toàn electron: $3x - 2y = 3n_{\\text{NO}} = 3 \\times 0{,}06 = 0{,}18$.', 'Giải hệ: $x = 0{,}16\\text{ mol}$; $y = 0{,}15\\text{ mol}$.', '$m_{\\text{Fe(NO}_3)_3} = 0{,}16 \\times 242 = 38{,}72\\text{ g}$.'],
        finalAnswer: '38,72 g Fe(NO₃)₃'
      }
    })
  },
  makeChemLesson({
    id: 'chem-chuyen-10-1',
    track: 'chuyen',
    grade: 'Lớp 10',
    tier: 'Nâng cao',
    stageLabel: 'Khu Chuyên Hóa · Bậc 2: Chuyên Hóa 10',
    sourceTag: 'Chuyên đề HSG Quốc gia · Cơ học Lượng tử & Chu trình Born–Haber',
    lessonNumber: 2,
    title: '4 Số Lượng Tử (n, l, m_l, m_s), Quy tắc Slater & Chu trình Born–Haber',
    subtitle: 'Tính điện tích hạt nhân hiệu dụng Z_eff, năng lượng mạng lưới tinh thể U_L theo chu trình nhiệt động Hess',
    description: 'Chinh phục bài toán năng lượng tinh thể ion $U_L$ và xác định nguyên tố từ bộ 4 số lượng tử của electron cuối cùng.',
    theory1Heading: '1. Bộ 4 Số Lượng Tử mô tả Electron cuối',
    theory1: '• $n$: lớp chính ($1, 2, 3\\dots$); $l$: phân lớp ($0=s, 1=p, 2=d, 3=f$); $m_l \\in [-l; +l]$; $m_s = \\pm 1/2$.\n• Quy ước phổ biến: điền từ $m_l = -l$ đến $+l$ trước với $m_s = +1/2$, sau đó ghép đôi $m_s = -1/2$.',
    theory2Heading: '2. Chu trình Born–Haber cho tinh thể NaCl',
    theory2: '• $\\Delta_f H^\\circ(\\text{NaCl}) = \\Delta_{\\text{th}}H(\\text{Na}) + I_1(\\text{Na}) + \\frac{1}{2}E_b(\\text{Cl}_2) + A_e(\\text{Cl}) + U_L$.',
    keyFormulas: [
      'Z_{\\text{eff}} = Z - \\sigma_{\\text{Slater}}',
      'U_L = \\Delta_f H^\\circ - \\Delta_{\\text{th}}H - I_1 - \\frac{1}{2}E_b - EA'
    ],
    sim2d: 'atomic_orbitals_2d',
    sim3d: 'atomic_orbitals_3d',
    mcq1: {
      source: 'Olympic 30/4 · Chuyên Hóa 10',
      question: 'Bộ 4 số lượng tử nào sau đây hợp lệ cho một electron trong phân lớp $3d$?',
      options: ['A. n=3, l=3, m_l=0, m_s=+1/2', 'B. n=3, l=2, m_l=-2, m_s=-1/2', 'C. n=3, l=2, m_l=+3, m_s=+1/2', 'D. n=3, l=1, m_l=-1, m_s=+1/2'],
      correctIndex: 1,
      explanation: 'Phân lớp $3d$ có $n=3, l=2$, nên $m_l \\in \\{-2,-1,0,+1,+2\\}$ và $m_s = \\pm 1/2$.'
    },
    mcq2: {
      source: 'HSG Hóa 10',
      question: 'Trong chu trình Born–Haber tạo $NaCl(s)$ từ $Na(s)$ và $\\frac{1}{2}Cl_2(g)$, quá trình nào **tỏa nhiệt mạnh nhất**?',
      options: ['A. Thăng hoa Na(s) -> Na(g)', 'B. Ion hóa Na(g) -> Na⁺(g) + e', 'C. Tạo mạng tinh thể Na⁺(g) + Cl⁻(g) -> NaCl(s)', 'D. Phân li phân tử Cl₂ -> 2Cl'],
      correctIndex: 2,
      explanation: 'Năng lượng mạng lưới tinh thể $U_L$ (kết hợp ion khí ngược dấu thành tinh thể rắn) tỏa lượng nhiệt lớn nhất ($\\approx -787\\text{ kJ/mol}$).'
    },
    essay: {
      source: 'Chuyên Hóa 10',
      question: 'Tính năng lượng mạng lưới tinh thể $U_L$ của $NaCl(s)$ biết: $\\Delta_f H^\\circ = -411\\text{ kJ}$; $\\Delta_{\\text{th}}H(Na) = +108$; $I_1(Na) = +496$; $E_b(Cl_2) = +242$; ái lực electron $EA(Cl) = -349\\text{ kJ/mol}$.',
      solutionSteps: ['$U_L = -411 - (108 + 496 + 121 - 349)$.', '$U_L = -411 - 376 = -787\\text{ kJ/mol}$.'],
      finalAnswer: 'U_L = -787 kJ/mol'
    }
  }),
  makeChemLesson({
    id: 'chem-chuyen-10-2',
    track: 'chuyen',
    grade: 'Lớp 10',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Hóa · Bậc 3: HSG Quốc gia / IChO',
    sourceTag: 'HSG Quốc gia Hóa học · Cấu trúc Tinh thể Kim loại & Nhiệt động',
    lessonNumber: 3,
    title: 'Tinh thể Lập phương (SC, BCC, FCC), Độ đặc khít & Hốc Tinh thể',
    subtitle: 'Tính hằng số mạng a, khối lượng riêng ρ = Z·M / (N_A·a³) và điều kiện bền hốc tứ diện/bát diện',
    description: 'Bài toán tinh thể học chuẩn thi Olympic Hóa học Quốc tế IChO và Vòng 2 HSG Quốc gia.',
    theory1Heading: '1. Ba mạng tinh thể Lập phương Kim loại',
    theory1: '• **SC** ($Z=1$): $a = 2R$, độ đặc khít $52{,}4\\%$.\n• **BCC** ($Z=2$): $\\sqrt{3}a = 4R$, độ đặc khít $68\\%$.\n• **FCC** ($Z=4$): $\\sqrt{2}a = 4R$, độ đặc khít $74\\%$.',
    theory2Heading: '2. Công thức Khối lượng riêng Ô mạng cơ sở',
    theory2: '• $\\rho = \\frac{Z \\cdot M}{N_A \\cdot a^3}$ (với $a$ tính theo cm, $N_A = 6{,}022\\times 10^{23}\\text{ mol}^{-1}$).',
    keyFormulas: [
      '\\rho = \\frac{Z \\cdot M}{N_A \\cdot a^3}',
      '\\text{FCC}: a = 2\\sqrt{2}R;\\quad \\text{BCC}: a = \\frac{4R}{\\sqrt{3}}'
    ],
    sim2d: 'crystal_packing_2d',
    sim3d: 'crystal_lattice_3d',
    mcq1: {
      source: 'HSG Quốc gia Hóa 10',
      question: 'Số nguyên tử kim loại hiệu dụng $Z$ nằm trọn trong một ô mạng cơ sở lập phương tâm mặt (FCC, như Cu, Au) là:',
      options: ['A. 1', 'B. 2', 'C. 4', 'D. 6'],
      correctIndex: 2,
      explanation: '8 đỉnh đóng góp $8 \\times \\frac{1}{8} = 1$, 6 mặt đóng góp $6 \\times \\frac{1}{2} = 3 \\Rightarrow Z = 4$.'
    },
    mcq2: {
      source: 'IChO Prep',
      question: 'Trong tinh thể kim loại dạng lập phương tâm khối (BCC), tỉ lệ giữa đường kính quả cầu nguyên tử $2R$ và cạnh ô mạng $a$ thỏa mãn hệ thức nào?',
      options: ['A. a = 2R', 'B. √2 a = 4R', 'C. √3 a = 4R', 'D. a = 4R'],
      correctIndex: 2,
      explanation: 'Trong mạng BCC, các nguyên tử tiếp xúc nhau dọc theo đường chéo khối có độ dài $a\\sqrt{3} = 4R$.'
    },
    essay: {
      source: 'HSG Quốc gia · Tinh thể học',
      question: 'Đồng (Cu, $M = 63{,}55$) kết tinh dạng lập phương tâm mặt (FCC) có cạnh ô mạng $a = 3{,}615\\text{ \\AA}$. Tính bán kính nguyên tử Cu và khối lượng riêng $\\rho$ của Cu.',
      solutionSteps: ['$R = \\frac{a\\sqrt{2}}{4} = \\frac{3{,}615\\sqrt{2}}{4} \\approx 1{,}278\\text{ \\AA}$.', '$a = 3{,}615\\times 10^{-8}\\text{ cm} \\Rightarrow a^3 = 4{,}724\\times 10^{-23}\\text{ cm}^3$.', '$\\rho = \\frac{4 \\times 63{,}55}{6{,}022\\times 10^{23} \\times 4{,}724\\times 10^{-23}} \\approx 8{,}94\\text{ g/cm}^3$.'],
      finalAnswer: 'R ≈ 1,278 Å; ρ ≈ 8,94 g/cm³'
    }
  }),
  makeChemLesson({
    id: 'chem-chuyen-11-1',
    track: 'chuyen',
    grade: 'Lớp 11',
    tier: 'Nâng cao',
    stageLabel: 'Khu Chuyên Hóa · Bậc 2: Chuyên Hóa 11',
    sourceTag: 'Chuyên Hóa 11 · Cân bằng Ion Trong Dung dịch & Dung dịch Đệm',
    lessonNumber: 4,
    title: 'Tính pH Hệ Đệm Henderson–Hasselbalch, Đa Acid & Tích số Tan K_sp',
    subtitle: 'Giải phương trình bậc 2 cân bằng acid yếu, đệm đa nấc và điều kiện xuất hiện kết tủa Q_sp > K_sp',
    description: 'Chinh phục các bài toán định lượng dung dịch điện li chuẩn HSG tỉnh/quốc gia bằng phương pháp bảo toàn proton (PBE).',
    theory1Heading: '1. Dung dịch đệm & Phương trình Bảo toàn Proton (PBE)',
    theory1: '• Hệ đệm $HA / A^-$: $\\text{pH} = \\text{p}K_a + \\log\\frac{[A^-]}{[HA]}$.\n• Acid yếu nồng độ $C_0$, hằng số $K_a$: $K_a = \\frac{[H^+]^2}{C_0 - [H^+]}$.',
    theory2Heading: '2. Tích số tan K_sp & Kết tủa phân đoạn',
    theory2: '• Kết tủa $A_mB_n$ chỉ tách ra khi tích số ion vượt ngưỡng: $Q_{sp} = [A]^{m}[B]^{n} > K_{sp}$.',
    keyFormulas: [
      '\\text{pH} = \\text{p}K_a + \\log\\frac{[A^-]}{[HA]}',
      'Q_{sp} > K_{sp} \\Rightarrow \\text{xuất hiện kết tủa}'
    ],
    sim2d: 'buffer_ph_2d',
    sim3d: 'titration_bench_3d',
    mcq1: {
      source: 'Chuyên Hóa 11',
      question: 'Trộn $100\\text{ mL}$ $CH_3COOH\\ 0{,}2\\text{ M}$ ($pK_a = 4{,}76$) với $100\\text{ mL}$ $CH_3COONa\\ 0{,}2\\text{ M}$. Giá trị pH của dung dịch đệm thu được là:',
      options: ['A. 3,76', 'B. 4,76', 'C. 5,76', 'D. 7,00'],
      correctIndex: 1,
      explanation: 'Khi $[A^-] = [HA]$, $\\text{pH} = \\text{p}K_a + \\log(1) = 4{,}76$.'
    },
    mcq2: {
      source: 'HSG Hóa 11',
      question: 'Biết tích số tan của $AgCl$ là $1{,}8\\times 10^{-10}$ và của $Ag_2CrO_4$ là $1{,}1\\times 10^{-12}$. Trong cùng dung dịch chứa $[Cl^-]=0{,}01\\text{ M}$ và $[CrO_4^{2-}]=0{,}01\\text{ M}$, nhỏ từ từ $AgNO_3$ vào thì:',
      options: ['A. Ag₂CrO₄ kết tủa trước', 'B. AgCl kết tủa trước', 'C. Kết tủa đồng thời', 'D. Không chất nào kết tủa'],
      correctIndex: 1,
      explanation: 'Để tủa AgCl cần $[Ag^+] > 1{,}8\\times 10^{-8}\\text{ M}$; để tủa $Ag_2CrO_4$ cần $[Ag^+] > \\sqrt{1{,}1\\times 10^{-10}} \\approx 1{,}05\\times 10^{-5}\\text{ M}$. Vậy AgCl kết tủa trước!'
    },
    essay: {
      source: 'Chuyên Hóa 11',
      question: 'Tính pH của dung dịch chứa $CH_3COOH\\ 0{,}10\\text{ M}$ ($K_a = 1{,}8\\times 10^{-5}$) và độ điện li $\\alpha$.',
      solutionSteps: ['Vì $C/K_a \\gg 100$, $[H^+] \\approx \\sqrt{K_a \\cdot C} = \\sqrt{1{,}8\\times 10^{-6}} \\approx 1{,}34\\times 10^{-3}\\text{ M}$.', '$\\text{pH} = -\\log(1{,}34\\times 10^{-3}) \\approx 2{,}87$.', 'Độ điện li $\\alpha = 1{,}34\\times 10^{-3} / 0{,}1 = 1{,}34\\%$.'],
      finalAnswer: 'pH ≈ 2,87; α ≈ 1,34%'
    }
  }),
  makeChemLesson({
    id: 'chem-chuyen-11-2',
    track: 'chuyen',
    grade: 'Lớp 11',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Hóa · Bậc 3: Hữu cơ Chuyên sâu',
    sourceTag: 'HSG Quốc gia · Hiệu ứng Điện tử (I, C, H) & Cơ chế S_N1/S_N2, E1/E2',
    lessonNumber: 5,
    title: 'Hiệu ứng Cảm ứng (±I), Liên hợp (±C) & Cơ chế Phản ứng Hữu cơ',
    subtitle: 'Giải thích quy luật định hướng vòng thơm, độ bền cacbocation, tốc độ S_N1 vs S_N2 (nghịch đảo cấu hình Walden)',
    description: 'Nền tảng tư duy cơ chế Hữu cơ bậc đại học – IChO: dự đoán sản phẩm chính và lập thể không gian.',
    theory1Heading: '1. Cơ chế Thế ái nhân S_N1 và S_N2',
    theory1: '• **$S_N2$**: một giai đoạn đồng thời, tốc độ bậc 2 ($v = k[RX][Nu]$), nghịch đảo cấu hình Walden 100%, ưu tiên RX bậc 1 > bậc 2.\n• **$S_N1$**: hai giai đoạn qua cacbocation phẳng $R^+$, tốc độ chỉ phụ thuộc RX ($v = k[RX]$), tạo hỗn hợp raxemic, ưu tiên RX bậc 3.',
    theory2Heading: '2. Hiệu ứng Cộng hưởng & Tính Axit – Bazơ Hữu cơ',
    theory2: '• Nhóm $-NO_2$ gây hiệu ứng $-I, -C$ rất mạnh ở vị trí ortho/para làm tăng mạnh tính acid của phenol (p-nitrophenol mạnh hơn phenol thường hàng trăm lần).',
    keyFormulas: [
      'S_N2: \\text{Bậc } 1 > \\text{Bậc } 2\\quad (\\text{nghịch đảo cấu hình})',
      'S_N1: \\text{Bậc } 3 > \\text{Bậc } 2\\quad (\\text{cacbocation trung gian})'
    ],
    sim2d: 'benzene_substitution_2d',
    sim3d: 'benzene_pi_3d',
    mcq1: {
      source: 'HSG Quốc gia Hóa Hữu cơ',
      question: 'Dẫn xuất halogen nào phản ứng thế ái nhân với dung dịch $NaOH$ theo cơ chế **$S_N2$ nhanh nhất**?',
      options: ['A. (CH₃)₃C-Br', 'B. CH₃-CH(Br)-CH₃', 'C. CH₃-CH₂-Br', 'D. CH₃-Br'],
      correctIndex: 3,
      explanation: '$S_N2$ nhạy cảm với án ngữ không gian nên tốc độ giảm nhanh khi bậc C tăng: $CH_3Br$ phản ứng nhanh nhất.'
    },
    mcq2: {
      source: 'Chuyên Hóa 11',
      question: 'So sánh lực base của 3 chất: p-nitroanilin (1), anilin (2), p-metylanilin (3). Thứ tự tăng dần lực base là:',
      options: ['A. (1) < (2) < (3)', 'B. (3) < (2) < (1)', 'C. (2) < (1) < (3)', 'D. (1) < (3) < (2)'],
      correctIndex: 0,
      explanation: 'Nhóm $-NO_2$ rút electron ($-I, -C$) làm giảm mật độ e trên N $\\Rightarrow$ giảm lực base; nhóm $-CH_3$ đẩy e làm tăng lực base.'
    },
    essay: {
      source: 'Chuyên Hóa 11 · Cơ chế Hữu cơ',
      question: 'Giải thích vì sao khi đun nóng $(R)$-2-bromobutane với dung dịch loãng $NaOH$ đặc trong DMSO (dung môi phân cực phi proton), sản phẩm thu được chủ yếu có cấu hình $(S)$-butan-2-ol.',
      solutionSteps: ['Dung môi phân cực phi proton (DMSO) không solvat hóa mạnh anion $OH^-$, giữ nguyên tính ái nhân mạnh.', 'Phản ứng xảy ra theo cơ chế lưỡng phân tử $S_N2$ với $OH^-$ tấn công từ phía đối diện nhóm đi ra $Br^-$.', 'Kết quả gây nghịch đảo cấu hình Walden từ $(R)$ sang $(S)$.'],
      finalAnswer: 'Cơ chế S_N2 tấn công mặt sau gây nghịch đảo cấu hình'
    }
  }),
  makeChemLesson({
    id: 'chem-chuyen-12-1',
    track: 'chuyen',
    grade: 'Lớp 12',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Hóa · Bậc 3: Nhiệt động – Điện hóa Chuyên sâu',
    sourceTag: 'HSG Quốc gia / IChO · Phương trình Nernst & Quan hệ ΔG° = -nFE°',
    lessonNumber: 6,
    title: 'Phương trình Nernst, Biến thiên Gibbs ΔG° & Hằng số Cân bằng K từ Pin',
    subtitle: 'Tính thế điện cực phụ thuộc nồng độ pH, ghép 2 bán phản ứng tìm E° thứ ba bằng ΔG° cộng tính và K = 10^(nE°/0.0592)',
    description: 'Công cụ điện hóa chuẩn Olympic Hóa học để giải quyết pin nồng độ và các cặp oxi hóa khử liên hoàn (như $Fe^{3+}/Fe^{2+}/Fe$).',
    theory1Heading: '1. Phương trình Nernst ở 298K',
    theory1: '• $E = E^\\circ - \\frac{0{,}0592}{n}\\log Q$ (với $Q = \\frac{[\\text{Khử}]}{[\\text{Oxi hóa}]}$ trong bán phản ứng khử).\n• Liên hệ hằng số cân bằng: $\\Delta G^\\circ = -nFE^\\circ = -RT\\ln K$.',
    theory2Heading: '2. Tính cộng tính của ΔG° (Biểu đồ Latimer)',
    theory2: '• Thế điện cực $E^\\circ$ **không có tính cộng**, phải quy đổi qua $\\Delta G^\\circ = -nFE^\\circ$: $n_3 E^\\circ_3 = n_1 E^\\circ_1 + n_2 E^\\circ_2$.',
    keyFormulas: [
      'E = E^\\circ - \\frac{0{,}0592}{n}\\log\\frac{[\\text{Khử}]}{[\\text{Ox}]}',
      '\\Delta G^\\circ = -nFE^\\circ_{\\text{pin}},\\quad \\log K = \\frac{nE^\\circ_{\\text{pin}}}{0{,}0592}'
    ],
    sim2d: 'galvanic_cell_2d',
    sim3d: 'galvanic_cell_3d',
    mcq1: {
      source: 'Chuyên Hóa 12 · Latimer',
      question: 'Cho $E^\\circ(Fe^{3+}/Fe^{2+}) = +0{,}77\\text{ V}$ và $E^\\circ(Fe^{2+}/Fe) = -0{,}44\\text{ V}$. Thế điện cực chuẩn $E^\\circ(Fe^{3+}/Fe)$ bằng:',
      options: ['A. +0,33 V', 'B. -0,037 V', 'C. +0,11 V', 'D. -0,40 V'],
      correctIndex: 1,
      explanation: '$3 E^\\circ(Fe^{3+}/Fe) = 1\\times 0{,}77 + 2\\times (-0{,}44) = -0{,}11\\text{ V} \\Rightarrow E^\\circ = -0{,}11/3 \\approx -0{,}037\\text{ V}$.'
    },
    mcq2: {
      source: 'HSG Quốc gia · Nernst',
      question: 'Xét bán pin $Cu^{2+} + 2e \\rightleftharpoons Cu$ có $E^\\circ = +0{,}340\\text{ V}$. Nếu pha loãng dung dịch $Cu^{2+}$ xuống còn $0{,}01\\text{ M}$ ở $25^\\circ\\text{C}$, thế điện cực $E$ là:',
      options: ['A. +0,340 V', 'B. +0,281 V', 'C. +0,399 V', 'D. +0,222 V'],
      correctIndex: 1,
      explanation: '$E = 0{,}340 - \\frac{0{,}0592}{2}\\log\\frac{1}{0{,}01} = 0{,}340 - 0{,}0592 = +0{,}2808\\text{ V}$.'
    },
    essay: {
      source: 'HSG Quốc gia',
      question: 'Pin Daniell có $E^\\circ_{\\text{pin}} = 1{,}10\\text{ V}$ ở $25^\\circ\\text{C}$ ứng với phản ứng $\\text{Zn} + \\text{Cu}^{2+} \\rightleftharpoons \\text{Zn}^{2+} + \\text{Cu}$. Tính hằng số cân bằng $K$ của phản ứng ở $298\\text{ K}$.',
      solutionSteps: ['$n = 2$ electron trao đổi.', '$\\log K = \\frac{n E^\\circ}{0{,}0592} = \\frac{2 \\times 1{,}10}{0{,}0592} \\approx 37{,}16$.', '$K = 10^{37{,}16} \\approx 1{,}45\\times 10^{37}$ (phản ứng xảy ra hầu như hoàn toàn).'],
      finalAnswer: 'K ≈ 1,45 × 10³⁷'
    }
  })
];
