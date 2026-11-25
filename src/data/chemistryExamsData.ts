import { ExamPaper, ExamQuestion } from '../types';

interface ChemTopicSeed {
  topic: string;
  grade: string;
  simId: string;
  simLabel: string;
  formula: string;
  qChuyen: string;
  solChuyen: string;
  qStandard: string;
  solStandard: string;
}

const CHEM_TOPIC_SEEDS: ChemTopicSeed[] = [
  {
    topic: 'Cấu tạo nguyên tử, Orbital & Bảng tuần hoàn',
    grade: 'Lớp 10',
    simId: 'atomic_orbitals_2d',
    simLabel: 'Mô phỏng Orbital & Biến thiên Tuần hoàn 2D',
    formula: '2Z + N = \\text{Tổng hạt},\\quad Z_{\\text{eff}} = Z - \\sigma',
    qChuyen: 'Tổng số hạt cơ bản trong ion $M^{2+}$ là $78$, trong đó số hạt mang điện nhiều hơn số hạt không mang điện là $22$. Xác định vị trí của M trong bảng tuần hoàn và bộ 4 số lượng tử của electron cuối cùng.',
    solChuyen: 'Nguyên tử M có $(2Z - 2) + N = 78$ và $(2Z - 2) - N = 22 \\Rightarrow 4Z = 104 \\Rightarrow Z = 26$ (Fe), $N = 28$. Cấu hình $[\\text{Ar}]3d^6 4s^2$, chu kì 4, nhóm VIIIB. Electron cuối cùng thuộc $3d^6$: $n=3, l=2, m_l=-2, m_s=-1/2$.',
    qStandard: 'Nguyên tử nguyên tố X có cấu hình electron lớp ngoài cùng là $3s^2 3p^5$. Xác định số hiệu nguyên tử Z, chu kì, nhóm và công thức oxit cao nhất của X.',
    solStandard: 'Cấu hình đầy đủ $1s^2 2s^2 2p^6 3s^2 3p^5$ ($Z = 17$, Clo). Thuộc chu kì 3, nhóm VIIA. Oxit cao nhất là $Cl_2O_7$, hiđroxit tương ứng $HClO_4$ (axit mạnh nhất).'
  },
  {
    topic: 'Nhiệt động học ΔH, Định luật Hess & Chu trình Born–Haber',
    grade: 'Lớp 10',
    simId: 'enthalpy_hess_2d',
    simLabel: 'Mô phỏng Giản đồ Enthalpy ΔH & Hoạt hóa Ea',
    formula: '\\Delta_r H^\\circ = \\sum \\Delta_f H^\\circ(\\text{sp}) - \\sum \\Delta_f H^\\circ(\\text{cđ})',
    qChuyen: 'Cho nhiệt cháy chuẩn của $C_2H_2(g)$, $H_2(g)$ và $C_2H_6(g)$ lần lượt là $-1300$, $-286$ và $-1560\\text{ kJ/mol}$. Tính biến thiên enthalpy chuẩn của phản ứng hiđro hóa $C_2H_2(g) + 2H_2(g) \\to C_2H_6(g)$ ở $298\\text{ K}$.',
    solChuyen: '$\\Delta_r H^\\circ = \\Delta_c H^\\circ(C_2H_2) + 2\\Delta_c H^\\circ(H_2) - \\Delta_c H^\\circ(C_2H_6) = -1300 + 2(-286) - (-1560) = -312\\text{ kJ}$.',
    qStandard: 'Tính $\\Delta_r H^\\circ_{298}$ của phản ứng $N_2(g) + 3H_2(g) \\to 2NH_3(g)$ từ năng lượng liên kết: $E_b(N\\equiv N) = 945$, $E_b(H-H) = 436$, $E_b(N-H) = 391\\text{ kJ/mol}$.',
    solStandard: '$\\Delta_r H^\\circ = [945 + 3(436)] - 6(391) = 2253 - 2346 = -93\\text{ kJ}$ (phản ứng tỏa nhiệt).'
  },
  {
    topic: 'Động hóa học & Cân bằng hóa học Le Chatelier',
    grade: 'Lớp 11',
    simId: 'equilibrium_shift_2d',
    simLabel: 'Mô phỏng Cân bằng N₂O₄ ⇌ 2NO₂',
    formula: 'K_C = \\frac{[C]^c[D]^d}{[A]^a[B]^b},\\quad \\frac{v_2}{v_1} = \\gamma^{(T_2-T_1)/10}',
    qChuyen: 'Trong bình kín dung tích $2\\text{ L}$ ở nhiệt độ không đổi, ban đầu nạp $0{,}8\\text{ mol } CO$ và $0{,}8\\text{ mol } H_2O(g)$ cho phản ứng $CO(g) + H_2O(g) \\rightleftharpoons CO_2(g) + H_2(g)$ có $K_C = 4{,}0$. Tính nồng độ các khí ở trạng thái cân bằng.',
    solChuyen: 'Nồng độ đầu $[CO]=[H_2O]=0{,}4\\text{ M}$. Đặt lượng phản ứng $x$: $\\frac{x^2}{(0{,}4-x)^2} = 4 \\Rightarrow \\frac{x}{0{,}4-x} = 2 \\Rightarrow x = \\frac{0{,}8}{3} \\approx 0{,}267\\text{ M}$. Vậy $[CO]=[H_2O]=0{,}133\\text{ M}$, $[CO_2]=[H_2]=0{,}267\\text{ M}$.',
    qStandard: 'Phản ứng $A + 2B \\to C$ ở $30^\\circ\\text{C}$ mất 27 phút để hoàn thành. Biết hệ số Van ’t Hoff $\\gamma = 3$. Hỏi ở $50^\\circ\\text{C}$ cần bao nhiêu phút?',
    solStandard: 'Tốc độ tăng $3^{(50-30)/10} = 9$ lần $\\Rightarrow$ thời gian giảm 9 lần: $t = 27 / 9 = 3$ phút.'
  },
  {
    topic: 'Dung dịch điện li, pH, Đệm & Chuẩn độ Acid–Base',
    grade: 'Lớp 11',
    simId: 'acid_base_titration_2d',
    simLabel: 'Mô phỏng Chuẩn độ Acid–Base & Đường cong pH',
    formula: '\\text{pH} = -\\log[\\text{H}^+],\\quad \\text{pH} = \\text{p}K_a + \\log\\frac{[A^-]}{[HA]}',
    qChuyen: 'Trộn $50\\text{ mL}$ $CH_3COOH\\ 0{,}2\\text{ M}$ ($K_a = 1{,}8\\times 10^{-5}$) với $25\\text{ mL}$ $NaOH\\ 0{,}2\\text{ M}$. Tính pH dung dịch thu được ở $25^\\circ\\text{C}$.',
    solChuyen: '$n_{\\text{CH}_3\\text{COOH}} = 0{,}01\\text{ mol}$, $n_{\\text{NaOH}} = 0{,}005\\text{ mol}$. Sau phản ứng tạo hệ đệm chứa $0{,}005\\text{ mol } CH_3COOH$ và $0{,}005\\text{ mol } CH_3COONa$. Vì $[A^-]=[HA] \\Rightarrow \\text{pH} = \\text{p}K_a = -\\log(1{,}8\\times 10^{-5}) \\approx 4{,}74$.',
    qStandard: 'Chuẩn độ $20\\text{ mL}$ dung dịch HCl cần đúng $25\\text{ mL}$ dung dịch NaOH $0{,}08\\text{ M}$. Tính nồng độ mol dung dịch HCl ban đầu.',
    solStandard: '$n_{\\text{HCl}} = n_{\\text{NaOH}} = 0{,}025 \\times 0{,}08 = 0{,}002\\text{ mol} \\Rightarrow C_{\\text{HCl}} = 0{,}002 / 0{,}02 = 0{,}10\\text{ M}$.'
  },
  {
    topic: 'Pin điện hóa, Điện phân Faraday & Thế điện cực Nernst',
    grade: 'Lớp 12',
    simId: 'galvanic_cell_2d',
    simLabel: 'Mô phỏng Pin Daniell & Điện phân 2D',
    formula: 'E^\\circ_{\\text{pin}} = E^\\circ_{\\text{cat}} - E^\\circ_{\\text{an}},\\quad m = \\frac{AIt}{nF}',
    qChuyen: 'Điện phân $200\\text{ mL}$ dung dịch chứa $CuSO_4\\ 0{,}5\\text{ M}$ và $NaCl\\ 0{,}6\\text{ M}$ với điện cực trơ, cường độ $I = 5\\text{ A}$ trong $3860\\text{ giây}$. Tính khối lượng dung dịch giảm sau điện phân.',
    solChuyen: '$n_e = \\frac{5 \\times 3860}{96500} = 0{,}20\\text{ mol}$. Cathode: $n_{\\text{Cu}^{2+}} = 0{,}10\\text{ mol}$ vừa đủ nhận $0{,}20\\text{ mol e} \\Rightarrow m_{\\text{Cu}} = 6{,}4\\text{ g}$. Anode: $n_{\\text{Cl}^-} = 0{,}12\\text{ mol} \\to 0{,}06\\text{ mol } Cl_2$ (nhường $0{,}12\\text{ mol e}$), còn $0{,}08\\text{ mol e}$ do $H_2O$ nhường sinh $0{,}02\\text{ mol } O_2$. Tổng khối lượng giảm $= 6{,}4 + 0{,}06\\times 71 + 0{,}02\\times 32 = 11{,}3\\text{ g}$.',
    qStandard: 'Tính suất điện động chuẩn của pin điện hóa Fe – Ag biết $E^\\circ(Fe^{2+}/Fe) = -0{,}44\\text{ V}$ và $E^\\circ(Ag^+/Ag) = +0{,}80\\text{ V}$.',
    solStandard: '$E^\\circ_{\\text{pin}} = 0{,}80 - (-0{,}44) = 1{,}24\\text{ V}$. Thanh Fe làm cực âm (Anode), Ag làm cực dương (Cathode).'
  },
  {
    topic: 'Ester, Lipid, Carbohydrate, Amino Acid & Polymer',
    grade: 'Lớp 12',
    simId: 'esterification_2d',
    simLabel: 'Mô phỏng Este hóa & Thủy phân Xà phòng 2D',
    formula: 'm_{\\text{este}} + m_{\\text{NaOH}} = m_{\\text{muối}} + m_{\\text{ancol}}',
    qChuyen: 'Xà phòng hóa hoàn toàn $22{,}2\\text{ g}$ hỗn hợp hai este đơn chức đồng phân của nhau bằng $300\\text{ mL}$ dung dịch NaOH $1{,}2\\text{ M}$, cô cạn thu được $24{,}6\\text{ g}$ chất rắn khan. Xác định công thức phân tử và tên hai este biết chúng có mùi thơm hoa quả.',
    solChuyen: '$n_{\\text{NaOH đầu}} = 0{,}36\\text{ mol}$. Nếu este dạng $C_3H_6O_2$ ($M=74$) thì $n_{\\text{este}} = 22{,}2/74 = 0{,}30\\text{ mol}$. Phần rắn gồm muối + $0{,}06\\text{ mol NaOH dư}$ ($2{,}4\\text{ g}$) $\\Rightarrow m_{\\text{muối}} = 22{,}2\\text{ g}$. Vậy $\\overline{M}_{\\text{muối}} = 22{,}2/0{,}3 = 74$ (nửa là $HCOONa=68$, nửa là $CH_3COONa=82$, hoặc tùy tỉ lệ $HCOOC_2H_5$ và $CH_3COOCH_3$).',
    qStandard: 'Đun nóng $6{,}0\\text{ g}$ axit axetic với $6{,}9\\text{ g}$ ancol etylic (xúc tác $H_2SO_4$ đặc), thu được $5{,}28\\text{ g}$ etyl axetat. Tính hiệu suất phản ứng.',
    solStandard: '$n_{\\text{CH}_3\\text{COOH}} = 0{,}1\\text{ mol}$ (hết trước $0{,}15\\text{ mol } C_2H_5OH$). $n_{\\text{este thực}} = 5{,}28/88 = 0{,}06\\text{ mol} \\Rightarrow H = 60\\%$.'
  },
  {
    topic: 'Vô cơ: Kim loại Kiềm, Kiềm thổ, Nhôm, Sắt & Bảo toàn Electron',
    grade: 'Lớp 12',
    simId: 'redox_balancing_2d',
    simLabel: 'Mô phỏng Thăng bằng Electron & Oxi hóa khử',
    formula: '\\sum n_{e\\text{ nhường}} = \\sum n_{e\\text{ nhận}}',
    qChuyen: 'Hòa tan hoàn toàn $19{,}2\\text{ g}$ hỗn hợp gồm Mg và Fe trong dung dịch $HNO_3$ dư thu được $4{,}958\\text{ L}$ khí NO (ĐKC, sản phẩm khử duy nhất). Tính khối lượng muối thu được sau phản ứng.',
    solChuyen: '$n_{\\text{NO}} = 4{,}958/24{,}79 = 0{,}2\\text{ mol} \\Rightarrow n_e = 0{,}6\\text{ mol} = n_{\\text{NO}_3^-\\text{ trong muối}}$. $m_{\\text{muối}} = m_{\\text{KL}} + 62 n_e = 19{,}2 + 62 \\times 0{,}6 = 56{,}4\\text{ g}$.',
    qStandard: 'Cho $3{,}9\\text{ g}$ kim loại Kali tác dụng hoàn toàn với nước dư thu được V lít khí $H_2$ (ĐKC). Tính V.',
    solStandard: '$n_K = 0{,}1\\text{ mol} \\Rightarrow n_{\\text{H}_2} = 0{,}05\\text{ mol} \\Rightarrow V = 0{,}05 \\times 24{,}79 = 1{,}2395\\text{ L}$.'
  }
];

const CHUYEN_SCHOOLS = [
  'THPT Chuyên Khoa học Tự nhiên (ĐHKHTN Hà Nội)',
  'THPT Chuyên Hà Nội – Amsterdam',
  'THPT Chuyên Lê Hồng Phong (TP.HCM)',
  'Phổ thông Năng khiếu (ĐHQG TP.HCM)',
  'THPT Chuyên Bến Tre (Hội đồng Tuyển sinh Chuyên)',
  'THPT Chuyên Phan Bội Châu (Nghệ An)',
  'THPT Chuyên Quốc học Huế',
  'THPT Chuyên Lê Quý Đôn (Đà Nẵng)'
];

const STANDARD_SCHOOLS = [
  'Kỳ thi Tốt nghiệp THPT · Bộ GD&ĐT',
  'Đề Đánh giá Năng lực ĐHQG TP.HCM & Hà Nội',
  'Sở GD&ĐT Bến Tre · Tuyển sinh Lớp 10 & Kiểm tra HK',
  'Sở GD&ĐT Hà Nội · Khảo sát Chất lượng Lớp 12',
  'Sở GD&ĐT TP.HCM · Đề Tham khảo Chuẩn GDPT 2018',
  'Trường THCS–THPT Chuẩn Quốc gia · Ôn tập Chương'
];

function buildChemPaper(index: number, track: 'chuyen' | 'khong_chuyen'): ExamPaper {
  const num = index + 1;
  const seed = CHEM_TOPIC_SEEDS[index % CHEM_TOPIC_SEEDS.length];
  const nextSeed = CHEM_TOPIC_SEEDS[(index + 2) % CHEM_TOPIC_SEEDS.length];
  const isChuyen = track === 'chuyen';
  const yearNum = 2020 + (index % 7);
  const year = `${yearNum}–${yearNum + 1}`;
  const code = isChuyen
    ? `CHEM-CH-${String(num).padStart(3, '0')}`
    : `CHEM-PT-${String(num).padStart(3, '0')}`;

  const q1: ExamQuestion = {
    number: 'Câu 1',
    points: isChuyen ? '3.0 điểm' : '2.5 điểm',
    content: isChuyen ? seed.qChuyen : seed.qStandard,
    solution: isChuyen ? seed.solChuyen : seed.solStandard,
    keyFormulasOrHints: [`$${seed.formula}$`],
    simulationLink: {
      type: 'chemistry',
      targetId: seed.simId,
      label: seed.simLabel
    }
  };

  const q2: ExamQuestion = {
    number: 'Câu 2',
    points: isChuyen ? '3.5 điểm' : '2.5 điểm',
    content: isChuyen ? nextSeed.qChuyen : nextSeed.qStandard,
    solution: isChuyen ? nextSeed.solChuyen : nextSeed.solStandard,
    keyFormulasOrHints: [`$${nextSeed.formula}$`],
    simulationLink: {
      type: 'chemistry',
      targetId: nextSeed.simId,
      label: nextSeed.simLabel
    }
  };

  const extraMol = ((index % 5) + 1) * 0.1;
  const q3: ExamQuestion = {
    number: 'Câu 3',
    points: isChuyen ? '3.5 điểm' : '5.0 điểm',
    content: isChuyen
      ? `Hòa tan hoàn toàn $${(extraMol * 16).toFixed(1)}\\text{ g}$ $\\text{Fe}_2\\text{O}_3$ và $\\text{CuO}$ trong dung dịch $\\text{HCl}$ dư, thu được dung dịch X chứa $2$ muối. Cho toàn bộ kim loại dư thích hợp hoặc cô cạn tính lượng $HCl$ phản ứng biết cần $${(extraMol * 6).toFixed(2)}\\text{ mol}$ $\\text{H}^+$ quy đổi qua bảo toàn O.`
      : `Thực hiện phản ứng trung hòa $${(extraMol * 100).toFixed(0)}\\text{ mL}$ dung dịch HCl $1{,}0\\text{ M}$ bằng dung dịch NaOH $0{,}5\\text{ M}$. Tính thể tích NaOH cần dùng và khối lượng muối thu được sau khi cô cạn.`,
    solution: isChuyen
      ? `Áp dụng bảo toàn nguyên tố O: $n_{\\text{HCl}} = 2n_{\\text{O trong oxit}} = 2 \\times ${(extraMol * 3).toFixed(2)} = ${(extraMol * 6).toFixed(2)}\\text{ mol}$, bảo toàn khối lượng suy ra tổng muối clorua $= m_{\\text{oxit}} + 55\\cdot n_{\\text{O}}$.`
      : `$n_{\\text{HCl}} = ${extraMol.toFixed(1)}\\text{ mol} \\Rightarrow n_{\\text{NaOH}} = ${extraMol.toFixed(1)}\\text{ mol} \\Rightarrow V_{\\text{NaOH}} = ${(extraMol / 0.5).toFixed(2)}\\text{ L} = ${((extraMol / 0.5) * 1000).toFixed(0)}\\text{ mL}$. $m_{\\text{NaCl}} = ${extraMol.toFixed(1)} \\times 58{,}5 = ${(extraMol * 58.5).toFixed(2)}\\text{ g}$.`,
    keyFormulasOrHints: ['$n_{\\text{H}^+} = 2n_{\\text{O}}^{2-}$', '$m_{\\text{NaCl}} = n \\times 58{,}5$'],
    simulationLink: {
      type: 'chemistry',
      targetId: 'acid_base_titration_2d',
      label: 'Mở Buret Chuẩn độ pH'
    }
  };

  return {
    id: isChuyen ? `chem-chuyen-${num}` : `chem-kc-${num}`,
    examCode: code,
    subject: 'chemistry',
    track,
    subjectTag: isChuyen ? `Hóa Chuyên · ${seed.grade}` : `Hóa học ${seed.grade}`,
    categoryTag: isChuyen
      ? num % 3 === 0
        ? 'HSG Quốc gia / Olympic'
        : 'Tuyển Sinh Chuyên Hóa'
      : num % 3 === 0
      ? 'Đánh Giá Năng Lực'
      : 'Chuẩn GDPT 2018 & 2006',
    academicYear: year,
    title: isChuyen
      ? `Đề Chuyên Hóa #${String(num).padStart(3, '0')} · ${seed.topic}`
      : `Đề Ôn Thi Hóa #${String(num).padStart(3, '0')} · ${seed.topic}`,
    school: isChuyen
      ? CHUYEN_SCHOOLS[index % CHUYEN_SCHOOLS.length]
      : STANDARD_SCHOOLS[index % STANDARD_SCHOOLS.length],
    source: isChuyen ? 'Kho Đề Chuyên Hóa Synapse 2020–2026' : 'Bộ Đề Chuẩn GDPT Synapse',
    timeMinutes: isChuyen ? 150 : 50,
    featuredSnippet: isChuyen ? seed.qChuyen : seed.qStandard,
    topics: [seed.topic, nextSeed.topic, seed.grade],
    difficulty: isChuyen ? (num % 2 === 0 ? 'Chuyên / HSG' : 'Nâng cao') : num % 2 === 0 ? 'Khá' : 'Cơ bản',
    questions: [q1, q2, q3]
  };
}

export const CHEMISTRY_CHUYEN_EXAMS: ExamPaper[] = Array.from({ length: 175 }, (_, i) =>
  buildChemPaper(i, 'chuyen')
);

export const CHEMISTRY_KC_EXAMS: ExamPaper[] = Array.from({ length: 175 }, (_, i) =>
  buildChemPaper(i, 'khong_chuyen')
);

export const ALL_CHEMISTRY_EXAMS: ExamPaper[] = [
  ...CHEMISTRY_CHUYEN_EXAMS,
  ...CHEMISTRY_KC_EXAMS
];
