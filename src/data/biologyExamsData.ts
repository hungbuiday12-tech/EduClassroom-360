import { ExamPaper, ExamQuestion } from '../types';

interface BioTopicSeed {
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

const BIO_TOPIC_SEEDS: BioTopicSeed[] = [
  {
    topic: 'Tế bào học, Thẩm thấu qua Màng & Động học Enzyme',
    grade: 'Lớp 10',
    simId: 'enzyme_kinetics_2d',
    simLabel: 'Mô phỏng Động học Enzyme Michaelis–Menten 2D',
    formula: 'V = \\frac{V_{\\max}[S]}{K_m + [S]},\\quad \\Pi = iCRT',
    qChuyen: 'Một enzyme tuân theo động học Michaelis–Menten có $V_{\\max} = 120\\text{ }\\mu\\text{M/phút}$ và $K_m = 4\\text{ mM}$. Khi có mặt chất ức chế không cạnh tranh thuận nghịch với $[I] = K_I$, tính tốc độ phản ứng tại $[S] = 12\\text{ mM}$.',
    solChuyen: 'Chất ức chế không cạnh tranh làm giảm $V_{\\max}\' = \\frac{V_{\\max}}{1 + [I]/K_I} = 120 / 2 = 60\\text{ }\\mu\\text{M/phút}$, còn $K_m = 4\\text{ mM}$ không đổi. Vậy $V = \\frac{60 \\times 12}{4 + 12} = 45\\text{ }\\mu\\text{M/phút}$.',
    qStandard: 'Đặt tế bào biểu bì vảy hành tím vào dung dịch đường $KNO_3$ ưu trương sẽ xảy ra hiện tượng gì? Giải thích ngắn gọn.',
    solStandard: 'Nước thẩm thấu từ không bào ra môi trường ưu trương làm màng sinh chất tách khỏi thành tế bào (co nguyên sinh).'
  },
  {
    topic: 'Quang hợp C3/C4/CAM & Hô hấp Hiếu khí Ti thể',
    grade: 'Lớp 10 – 11',
    simId: 'photosynthesis_calvin_2d',
    simLabel: 'Mô phỏng Quang hợp & Chu trình Calvin 2D',
    formula: '6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\to \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2',
    qChuyen: 'So sánh điểm bù ánh sáng và nhu cầu ATP cho mỗi phân tử $CO_2$ cố định ở thực vật C3 và C4. Vì sao năng suất C4 vượt trội ở vùng nhiệt đới?',
    solChuyen: 'C3 tốn 3 ATP + 2 NADPH/$CO_2$ nhưng mất tới ~25–30% sản phẩm qua hô hấp sáng; C4 tốn 5 ATP + 2 NADPH/$CO_2$ nhờ bơm $CO_2$ vào tế bào bao bó mạch nên loại bỏ hoàn toàn hô hấp sáng và có điểm bù $CO_2$ gần bằng $0$.',
    qStandard: 'Hô hấp hiếu khí hoàn toàn $1\\text{ mol}$ glucose qua đường phân, chu trình Krebs và chuỗi truyền electron tạo ra khoảng bao nhiêu mol ATP?',
    solStandard: 'Khoảng $30\\text{--}32\\text{ ATP}$ (trong đó đường phân tạo $2\\text{ ATP}$, Krebs tạo $2\\text{ ATP}$, chuỗi truyền electron tạo $26\\text{--}28\\text{ ATP}$).'
  },
  {
    topic: 'Sinh lí Tuần hoàn Tim mạch, Hô hấp Bohr & Bài tiết Thận',
    grade: 'Lớp 11',
    simId: 'bohr_hemoglobin_2d',
    simLabel: 'Mô phỏng Hiệu ứng Bohr Hemoglobin 2D',
    formula: 'CO = HR \\times SV,\\quad \\text{Hb}(\\text{O}_2)_4 + H^+ \\rightleftharpoons \\text{HbH}^+ + 4\\text{O}_2',
    qChuyen: 'Khi một người chạy marathon, pH máu tĩnh mạch tại cơ đùi giảm từ $7{,}40$ xuống $7{,}15$ và $p_{CO_2}$ tăng lên $65\\text{ mmHg}$. Đường cong phân li oxyhemoglobin dịch chuyển theo chiều nào và ý nghĩa sinh lí là gì?',
    solChuyen: 'Đường cong dịch phải (Hiệu ứng Bohr): ái lực gắn $O_2$ của Hemoglobin giảm xuống, giúp tăng lượng $O_2$ nhả ra tại mô cơ đang hoạt động mạnh.',
    qStandard: 'Một người trưởng thành có nhịp tim $75\\text{ nhịp/phút}$ và thể tích tâm thu mỗi nhát bóp $70\\text{ mL}$. Tính lưu lượng tim trong 1 phút.',
    solStandard: 'Lưu lượng tim $CO = 75 \\times 70 = 5250\\text{ mL/phút} = 5{,}25\\text{ L/phút}$.'
  },
  {
    topic: 'Cảm ứng Thần kinh Neuron, Xináp & Hệ Miễn dịch',
    grade: 'Lớp 11',
    simId: 'action_potential_2d',
    simLabel: 'Mô phỏng Điện thế Hoạt động Neuron 2D',
    formula: 'E_{\\text{ion}} = 61{,}5\\log_{10}\\frac{[\\text{Ion}]_{\\text{ngoài}}}{[\\text{Ion}]_{\\text{trong}}}\\text{ (mV)}',
    qChuyen: 'Tính điện thế cân bằng Nernst của ion $Na^+$ ở $37^\\circ\\text{C}$ biết $[Na^+]_{\\text{ngoài}} = 145\\text{ mM}$ và $[Na^+]_{\\text{trong}} = 15\\text{ mM}$. Tại sao đỉnh điện thế hoạt động thường chỉ đạt $+35\\text{ mV}$ thay vì bằng đúng $E_{Na}$?',
    solChuyen: '$E_{Na} = 61{,}5 \\times \\log_{10}(145/15) \\approx +60{,}6\\text{ mV}$. Đỉnh thực tế chỉ đạt $+35\\text{ mV}$ vì kênh $Na^+$ đóng bất hoạt nhanh đồng thời kênh $K^+$ kịp mở đẩy $K^+$ ra ngoài.',
    qStandard: 'Trình bày 2 nguyên nhân khiến xung thần kinh truyền qua xináp hóa học chỉ đi theo 1 chiều.',
    solStandard: 'Chỉ chùy xináp (màng trước) chứa bóng chất trung gian hóa học và chỉ màng sau xináp có thụ thể tiếp nhận đặc hiệu.'
  },
  {
    topic: 'Cơ chế Di truyền Phân tử DNA – mRNA – Protein & Operon Lac',
    grade: 'Lớp 12',
    simId: 'dna_replication_2d',
    simLabel: 'Mô phỏng Tái bản DNA & Operon Lac 2D',
    formula: 'N = 2A + 2G,\\quad H = 2A + 3G,\\quad L = \\frac{N}{2}\\cdot 3{,}4\\text{ Å}',
    qChuyen: 'Một gen có $120$ chu kì xoắn và hiệu số $A - G = 20\\%$ tổng số nucleotit của gen. Sau $3$ lần tái bản liên tiếp, tính tổng số liên kết hiđrô bị phá vỡ và số nucleotit mỗi loại môi trường nội bào cần cung cấp.',
    solChuyen: '$N = 120 \\times 20 = 2400\\text{ nu}$. Vì $A + G = 50\\%$ và $A - G = 20\\% \\Rightarrow A = T = 35\\% = 840$, $G = C = 15\\% = 360$. $H = 2(840)+3(360) = 2760$. Tổng $H$ bị phá $= H(2^3 - 1) = 2760 \\times 7 = 19{,}320$; $A_{cc}=T_{cc}=840\\times 7 = 5880$, $G_{cc}=C_{cc}=360\\times 7 = 2520$.',
    qStandard: 'Một đoạn phân tử DNA có chiều dài $4080\\text{ Å}$ và có $A = 480$ nucleotit. Tính tổng số nucleotit và số liên kết hiđrô của đoạn DNA đó.',
    solStandard: '$N = \\frac{2 \\times 4080}{3{,}4} = 2400\\text{ nu}$. $G = 1200 - 480 = 720$. $H = 2(480) + 3(720) = 3120$.'
  },
  {
    topic: 'Quy luật Di truyền Mendel, Tương tác Gen & Hoán vị Gen Morgan',
    grade: 'Lớp 12',
    simId: 'gene_linkage_2d',
    simLabel: 'Mô phỏng Liên kết & Hoán vị Gen Morgan 2D',
    formula: 'f_{\\text{hoán vị}} = 2 \\times \\text{giao tử hoán vị} \\le 50\\%',
    qChuyen: 'Cho phép lai $P: \\frac{AB}{ab}X^D X^d \\times \\frac{Ab}{aB}X^D Y$ với tần số hoán vị gen giữa A và B ở cả hai giới đều là $20\\%$. Tính tỉ lệ cá thể mang kiểu hình trội cả 3 tính trạng ($A-B-D-$) ở $F_1$.',
    solChuyen: 'Bên cái cho $\\underline{ab}=0{,}4$, bên đực cho $\\underline{ab}=0{,}1 \\Rightarrow \\frac{ab}{ab} = 0{,}04 \\Rightarrow A-B- = 0{,}5 + 0{,}04 = 0{,}54$. Ở cặp $X^DX^d \\times X^DY \\to 3/4\\ D-$. Vậy $A-B-D- = 0{,}54 \\times 0{,}75 = 0{,}405 = 40{,}5\\%$.',
    qStandard: 'Cho cá thể có kiểu gen $\\frac{Ab}{aB}$ giảm phân với tần số hoán vị gen $f = 30\\%$. Viết tỉ lệ các loại giao tử tạo thành.',
    solStandard: 'Giao tử liên kết $\\underline{Ab} = \\underline{aB} = (1 - 0{,}3)/2 = 35\\%$; giao tử hoán vị $\\underline{AB} = \\underline{ab} = 0{,}3/2 = 15\\%$.'
  },
  {
    topic: 'Di truyền Quần thể Hardy–Weinberg & Sinh thái học Lotka–Volterra',
    grade: 'Lớp 12',
    simId: 'hardy_weinberg_2d',
    simLabel: 'Mô phỏng Cân bằng Hardy–Weinberg & Sinh thái 2D',
    formula: 'p^2 + 2pq + q^2 = 1,\\quad \\frac{dN}{dt} = rN\\left(1 - \\frac{N}{K}\\right)',
    qChuyen: 'Một quần thể cân bằng di truyền với hệ nhóm máu ABO có $9\\%$ nhóm máu O và $16\\%$ nhóm máu B. Tính tỉ lệ người nhóm máu A và xác suất một cặp vợ chồng đều nhóm A sinh con nhóm A.',
    solChuyen: '$r = \\sqrt{0{,}09} = 0{,}3$. $q + r = \\sqrt{0{,}09 + 0{,}16} = 0{,}5 \\Rightarrow q = 0{,}2 \\Rightarrow p = 0{,}5$. Nhóm A ($0{,}25\\ I^AI^A + 0{,}30\\ I^Ai = 55\\%$). Trong nhóm A tỉ lệ $I^Ai = 6/11 \\Rightarrow P(\\text{con O}) = (6/11)^2\\cdot 1/4 = 9/121 \\Rightarrow P(\\text{con A}) = 112/121 \\approx 92{,}56\\%$.',
    qStandard: 'Một quần thể ngẫu phối đạt cân bằng Hardy–Weinberg có tần số alen $p(A) = 0{,}7$. Xác định cấu trúc di truyền của quần thể.',
    solStandard: '$q(a) = 0{,}3$. Cấu trúc di truyền: $0{,}49\\ AA + 0{,}42\\ Aa + 0{,}09\\ aa = 1$.'
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

function buildBioPaper(index: number, track: 'chuyen' | 'khong_chuyen'): ExamPaper {
  const num = index + 1;
  const seed = BIO_TOPIC_SEEDS[index % BIO_TOPIC_SEEDS.length];
  const nextSeed = BIO_TOPIC_SEEDS[(index + 3) % BIO_TOPIC_SEEDS.length];
  const isChuyen = track === 'chuyen';
  const yearNum = 2020 + (index % 7);
  const year = `${yearNum}-${yearNum + 1}`;
  const code = `${isChuyen ? 'SC' : 'SK'}-${String(num).padStart(3, '0')}`;
  const school = isChuyen
    ? CHUYEN_SCHOOLS[index % CHUYEN_SCHOOLS.length]
    : STANDARD_SCHOOLS[index % STANDARD_SCHOOLS.length];

  const questions: ExamQuestion[] = [
    {
      number: 'Câu 1',
      points: isChuyen ? '3.5 điểm' : '3.0 điểm',
      content: isChuyen
        ? `(Phân tích Chuyên sâu — ${seed.topic}) ${seed.qChuyen}`
        : `(Vận dụng — ${seed.topic}) ${seed.qStandard}`,
      solution: isChuyen ? seed.solChuyen : seed.solStandard,
      keyFormulasOrHints: [`$${seed.formula}$`],
      simulationLink: {
        type: 'biology',
        targetId: seed.simId,
        label: seed.simLabel
      }
    },
    {
      number: 'Câu 2',
      points: isChuyen ? '3.0 điểm' : '2.0 điểm',
      content: `Trong chuyên đề **${seed.topic}**, công thức hoặc quy luật sinh học chuẩn nào biểu diễn đúng bản chất hiện tượng?\nA. $${seed.formula}$\nB. Chiều dài phân tử DNA không phụ thuộc số lượng đơn phân\nC. Tần số alen tự thay đổi theo định luật bảo toàn cơ năng\nD. Vận tốc phản ứng enzyme tăng tuyến tính mãi tới $100^\\circ\\text{C}$`,
      solution: `**Đáp án đúng: A.**\nCông thức chuẩn của chủ đề "${seed.topic}" là $${seed.formula}$.`,
      keyFormulasOrHints: [`$${seed.formula}$`],
      simulationLink: {
        type: 'biology',
        targetId: seed.simId,
        label: seed.simLabel
      }
    },
    {
      number: 'Câu 3',
      points: isChuyen ? '3.5 điểm' : '5.0 điểm',
      content: isChuyen
        ? `(Liên thông HSG — ${nextSeed.topic}) ${nextSeed.qChuyen}`
        : `(Câu hỏi Thực tiễn — ${nextSeed.topic}) ${nextSeed.qStandard}`,
      solution: isChuyen ? nextSeed.solChuyen : nextSeed.solStandard,
      keyFormulasOrHints: [`$${nextSeed.formula}$`],
      simulationLink: {
        type: 'biology',
        targetId: nextSeed.simId,
        label: nextSeed.simLabel
      }
    }
  ];

  return {
    id: isChuyen ? `bio-chuyen-${num}` : `bio-kc-${num}`,
    examCode: code,
    subject: 'biology',
    track,
    subjectTag: isChuyen ? `Sinh Chuyên · ${seed.grade}` : `Sinh học ${seed.grade}`,
    categoryTag: isChuyen
      ? num % 3 === 0
        ? 'HSG Quốc gia / Olympic'
        : 'Tuyển Sinh Chuyên Sinh'
      : num % 3 === 0
      ? 'Đánh Giá Năng Lực'
      : 'Chuẩn GDPT 2018 & 2006',
    academicYear: year,
    title: isChuyen
      ? `Đề Chuyên Sinh #${String(num).padStart(3, '0')} · ${seed.topic}`
      : `Đề Ôn Thi Sinh #${String(num).padStart(3, '0')} · ${seed.topic}`,
    school,
    source: isChuyen ? 'Kho Đề Chuyên Sinh Synapse 2020–2026' : 'Bộ Đề Chuẩn GDPT Synapse',
    timeMinutes: isChuyen ? 150 : 50,
    featuredSnippet: isChuyen ? seed.qChuyen : seed.qStandard,
    topics: [seed.topic, nextSeed.topic, seed.grade],
    difficulty: isChuyen ? (num % 2 === 0 ? 'Chuyên / HSG' : 'Nâng cao') : num % 2 === 0 ? 'Khá' : 'Cơ bản',
    questions
  };
}

export const BIOLOGY_CHUYEN_EXAMS: ExamPaper[] = Array.from({ length: 175 }, (_, i) =>
  buildBioPaper(i, 'chuyen')
);

export const BIOLOGY_KC_EXAMS: ExamPaper[] = Array.from({ length: 175 }, (_, i) =>
  buildBioPaper(i, 'khong_chuyen')
);

export const ALL_BIOLOGY_EXAMS: ExamPaper[] = [...BIOLOGY_CHUYEN_EXAMS, ...BIOLOGY_KC_EXAMS];
