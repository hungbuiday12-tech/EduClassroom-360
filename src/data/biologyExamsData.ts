import { BiologySimType, ExamPaper, ExamQuestion } from '../types';

interface BioGeneratorSpec {
  topic: string;
  grade: string;
  simId: BiologySimType;
  simLabel: string;
  formula: string;
  genChuyen: (k: number) => { content: string; solution: string };
  genStandard: (k: number) => { content: string; solution: string };
}

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

const BIO_GENERATORS: BioGeneratorSpec[] = [
  {
    topic: 'Tế bào học, Thế nước Thẩm thấu & Động học Enzyme',
    grade: 'Lớp 10',
    simId: 'enzyme_kinetics_2d',
    simLabel: 'Mô phỏng Động học Enzyme Michaelis–Menten 2D',
    formula: 'V = \\frac{V_{\\max}[S]}{K_m + [S]},\\quad \\Psi_w = \\Psi_s + \\Psi_p',
    genChuyen: (k) => {
      const vmax = 80 + (k % 8) * 20;
      const km = 2 + (k % 5) * 2;
      const S = km * ((k % 3) + 2);
      const inhRatio = 1 + (k % 3);
      const vPrime = ((vmax / (1 + inhRatio)) * S) / (km + S);
      return {
        content: `Động học Enzyme #${k + 1}: Một enzyme tuân theo phương trình Michaelis–Menten có $V_{\\max} = ${vmax}\\text{ }\\mu\\text{M/phút}$ và $K_m = ${km}\\text{ mM}$. Khi bổ sung chất ức chế không cạnh tranh thuận nghịch với $[I]/K_I = ${inhRatio}$, tính tốc độ phản ứng $V$ tại nồng độ cơ chất $[S] = ${S}\\text{ mM}$.`,
        solution: `Chất ức chế không cạnh tranh làm $V_{\\max}\' = \\frac{${vmax}}{1 + ${inhRatio}} = ${(vmax / (1 + inhRatio)).toFixed(1)}\\text{ }\\mu\\text{M/phút}$, giữ nguyên $K_m = ${km}\\text{ mM}$. Suy ra $V = \\frac{${(vmax / (1 + inhRatio)).toFixed(1)}\\times ${S}}{${km} + ${S}} = ${vPrime.toFixed(2)}\\text{ }\\mu\\text{M/phút}$.`
      };
    },
    genStandard: (k) => {
      const psiS = -(0.6 + (k % 5) * 0.2);
      const psiP = 0.2 + (k % 3) * 0.1;
      const psiW = (psiS + psiP).toFixed(1);
      const env = -0.9 - (k % 4) * 0.2;
      return {
        content: `Thẩm thấu tế bào #${k + 1}: Đặt một tế bào biểu bì vảy hành tím có $\\Psi_s = ${psiS.toFixed(1)}\\text{ MPa}$ và áp suất trương $\\Psi_p = +${psiP.toFixed(1)}\\text{ MPa}$ vào dung dịch đường có thế nước $\\Psi_{\\text{dd}} = ${env.toFixed(1)}\\text{ MPa}$. Nước đi theo chiều nào và tế bào xảy ra hiện tượng gì?`,
        solution: `Thế nước tế bào $\\Psi_w = ${psiS.toFixed(1)} + ${psiP.toFixed(1)} = ${psiW}\\text{ MPa} > ${env.toFixed(1)}\\text{ MPa}$. Nước thẩm thấu từ tế bào ra ngoài môi trường ưu trương gây co nguyên sinh.`
      };
    }
  },
  {
    topic: 'Quang hợp C3/C4/CAM & Hô hấp Hiếu khí Ti thể',
    grade: 'Lớp 10 – 11',
    simId: 'photosynthesis_calvin_2d',
    simLabel: 'Mô phỏng Quang hợp & Chu trình Calvin 2D',
    formula: '6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\to \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2',
    genChuyen: (k) => {
      const nCO2 = 6 + (k % 7) * 6;
      const atpC3 = nCO2 * 3;
      const atpC4 = nCO2 * 5;
      const nadph = nCO2 * 2;
      return {
        content: `Năng lượng Quang hợp #${k + 1}: Để tổng hợp đủ khung cacbon từ $${nCO2}$ phân tử $\\text{CO}_2$ qua chu trình Calvin không kể hô hấp sáng, hãy tính số phân tử ATP và NADPH cần tiêu thụ ở thực vật C3 và C4, đồng thời giải thích vì sao C4 vẫn đạt năng suất cao hơn C3 ở vùng nắng nóng.`,
        solution: `Thực vật C3 tiêu tốn $3 \\times ${nCO2} = ${atpC3}\\text{ ATP}$ và $2 \\times ${nCO2} = ${nadph}\\text{ NADPH}$; thực vật C4 tốn thêm $2\\text{ ATP/CO}_2$ cho bơm PEPC nên cần $${atpC4}\\text{ ATP}$ và $${nadph}\\text{ NADPH}$. Tuy nhiên C4 cô đặc $\\text{CO}_2$ quanh RuBisCO ở tế bào bao bó mạch nên triệt tiêu hô hấp sáng.`
      };
    },
    genStandard: (k) => {
      const nGluc = (k % 8) + 1;
      return {
        content: `Hô hấp tế bào #${k + 1}: Khi oxy hóa hoàn toàn $${nGluc}\\text{ mol}$ glucose qua đường phân, chu trình Krebs và chuỗi truyền electron ti thể (lấy hệ số $32\\text{ ATP/mol glucose}$), tế bào thu được tối đa bao nhiêu mol ATP và giải phóng bao nhiêu mol $\\text{CO}_2$?`,
        solution: `Mỗi mol glucose tạo khoảng $32\\text{ ATP}$ và $6\\text{ mol CO}_2$. Với $${nGluc}\\text{ mol}$ glucose thu được $${nGluc * 32}\\text{ mol ATP}$ và $${nGluc * 6}\\text{ mol CO}_2$.`
      };
    }
  },
  {
    topic: 'Sinh lí Tuần hoàn Tim mạch, Hiệu ứng Bohr & Bài tiết Thận',
    grade: 'Lớp 11',
    simId: 'bohr_hemoglobin_2d',
    simLabel: 'Mô phỏng Hiệu ứng Bohr Hemoglobin 2D',
    formula: 'CO = HR \\times SV,\\quad P_{\\text{lọc}} = P_{\\text{GC}} - (\\pi_{\\text{GC}} + P_{\\text{BS}})',
    genChuyen: (k) => {
      const pGC = 55 + (k % 6) * 3;
      const piGC = 26 + (k % 4) * 2;
      const pBS = 14 + (k % 3);
      const pNet = pGC - (piGC + pBS);
      return {
        content: `Sinh lí Thận & Tim mạch #${k + 1}: Tại cầu thận của một động vật có vú, áp suất thủy tĩnh mao mạch cầu thận là $P_{\\text{GC}} = ${pGC}\\text{ mmHg}$, áp suất keo huyết tương $\\pi_{\\text{GC}} = ${piGC}\\text{ mmHg}$ và áp suất thủy tĩnh nang Bowman $P_{\\text{BS}} = ${pBS}\\text{ mmHg}$. Tính áp suất lọc hữu hiệu cầu thận và cho biết điều gì xảy ra nếu huyết áp tụt khiến $P_{\\text{GC}}$ giảm còn $35\\text{ mmHg}$.`,
        solution: `$P_{\\text{lọc}} = ${pGC} - (${piGC} + ${pBS}) = ${pNet}\\text{ mmHg}$. Nếu $P_{\\text{GC}}$ giảm xuống $35\\text{ mmHg}$, $P_{\\text{lọc}} = ${35 - (piGC + pBS)}\\text{ mmHg}$ khiến lọc cầu thận ngưng trệ (vô niệu), kích hoạt trục RAAS nâng huyết áp.`
      };
    },
    genStandard: (k) => {
      const hr = 65 + (k % 8) * 5;
      const sv = 65 + (k % 5) * 5;
      const co = ((hr * sv) / 1000).toFixed(2);
      return {
        content: `Lưu lượng tim #${k + 1}: Một người trưởng thành có nhịp tim lúc nghỉ ngơi là $${hr}\\text{ nhịp/phút}$ và thể tích tâm thu mỗi nhát bóp $SV = ${sv}\\text{ mL}$. Tính cung lượng tim $CO$ (lít/phút).`,
        solution: `$CO = HR \\times SV = ${hr} \\times ${sv} = ${hr * sv}\\text{ mL/phút} = ${co}\\text{ L/phút}$.`
      };
    }
  },
  {
    topic: 'Cảm ứng Thần kinh Neuron, Điện thế Nernst & Hệ Miễn dịch',
    grade: 'Lớp 11',
    simId: 'action_potential_2d',
    simLabel: 'Mô phỏng Điện thế Hoạt động Neuron 2D',
    formula: 'E_{\\text{ion}} = \\frac{61{,}5}{z}\\log_{10}\\frac{[\\text{Ion}]_{\\text{ngoài}}}{[\\text{Ion}]_{\\text{trong}}}',
    genChuyen: (k) => {
      const kOut = 4 + (k % 5);
      const kIn = 120 + (k % 4) * 15;
      const eK = (61.5 * Math.log10(kOut / kIn)).toFixed(1);
      return {
        content: `Điện thế Nernst #${k + 1}: Một sợi trục nơ-ron ở $37^\\circ\\text{C}$ có $[\\text{K}^+]_{\\text{ngoài}} = ${kOut}\\text{ mM}$ và $[\\text{K}^+]_{\\text{trong}} = ${kIn}\\text{ mM}$. Tính điện thế cân bằng $E_K$ (mV) và giải thích sự thay đổi điện thế nghỉ nếu nồng độ $\\text{K}^+$ máu ngoại bào tăng gấp đôi.`,
        solution: `$E_K = 61{,}5\\times \\log_{10}(${kOut}/${kIn}) = ${eK}\\text{ mV}$. Khi $[\\text{K}^+]_{\\text{ngoài}}$ tăng gấp đôi, chênh lệch nồng độ giảm khiến $E_K$ ít âm hơn, màng bị khử cực nhẹ tiến gần ngưỡng kích thích.`
      };
    },
    genStandard: (k) => {
      const speed = 20 + (k % 6) * 15;
      const dist = 1.2 + (k % 4) * 0.3;
      const timeMs = ((dist / speed) * 1000).toFixed(1);
      return {
        content: `Truyền xung thần kinh #${k + 1}: Xung thần kinh lan truyền nhảy cóc trên sợi trục có bao myelin với vận tốc $${speed}\\text{ m/s}$ trên quãng đường dài $${dist.toFixed(1)}\\text{ m}$. Tính thời gian truyền (ms) và nêu vai trò của bao myelin.`,
        solution: `Thời gian $t = \\frac{${dist.toFixed(1)}}{${speed}} \\times 1000 = ${timeMs}\\text{ ms}$. Bao myelin cách điện giúp xung nhảy cóc qua các eo Ranvier, tăng tốc độ và tiết kiệm ATP cho bơm $\\text{Na}^+/\\text{K}^+$.`
      };
    }
  },
  {
    topic: 'Cơ chế Di truyền Phân tử DNA – mRNA – Protein & Operon Lac',
    grade: 'Lớp 12',
    simId: 'dna_replication_2d',
    simLabel: 'Mô phỏng Tái bản DNA & Operon Lac 2D',
    formula: 'N = 2A + 2G,\\quad H = 2A + 3G,\\quad L = \\frac{N}{2}\\cdot 3{,}4\\text{ Å}',
    genChuyen: (k) => {
      const turns = 90 + (k % 10) * 15;
      const N = turns * 20;
      const pctA = 18 + (k % 5) * 4;
      const pctG = 50 - pctA;
      const A = (N * pctA) / 100;
      const G = (N * pctG) / 100;
      const H = 2 * A + 3 * G;
      const rep = (k % 3) + 2;
      const mult = Math.pow(2, rep) - 1;
      return {
        content: `Cấu trúc & Tái bản DNA #${k + 1}: Một gen có $${turns}$ chu kì xoắn và hiệu số $G - A = ${pctG - pctA}\\%$ tổng số nucleotit của gen. Gen nhân đôi liên tiếp $${rep}$ lần. Tính số nucleotit mỗi loại môi trường cung cấp và tổng số liên kết hiđrô bị phá vỡ trong quá trình trên.`,
        solution: `$N = ${turns}\\times 20 = ${N}$. $A = T = ${pctA}\\% = ${A}$, $G = C = ${pctG}\\% = ${G}$; $H = ${H}$. Sau ${rep} lần nhân đôi ($2^{${rep}}-1 = ${mult}$): $A_{cc}=T_{cc}=${A * mult}$, $G_{cc}=C_{cc}=${G * mult}$, $\\sum H_{\\text{phá}} = ${H * mult}$.`
      };
    },
    genStandard: (k) => {
      const N = 1200 + (k % 8) * 300;
      const L = (N / 2) * 3.4;
      const A = Math.round(N * 0.2);
      const G = N / 2 - A;
      const H = 2 * A + 3 * G;
      return {
        content: `Bài tập DNA #${k + 1}: Một đoạn phân tử DNA có chiều dài $L = ${L}\\text{ Å}$ và có $A = ${A}$ nucleotit. Tính tổng số nucleotit $N$, số nucleotit loại $G$ và tổng số liên kết hiđrô $H$ của gen.`,
        solution: `$N = \\frac{2\\times ${L}}{3{,}4} = ${N}\\text{ nu}$; $G = ${N / 2} - ${A} = ${G}\\text{ nu}$; $H = 2(${A}) + 3(${G}) = ${H}$.`
      };
    }
  },
  {
    topic: 'Quy luật Di truyền Mendel, Liên kết & Hoán vị Gen Morgan',
    grade: 'Lớp 12',
    simId: 'gene_linkage_2d',
    simLabel: 'Mô phỏng Liên kết & Hoán vị Gen Morgan 2D',
    formula: 'f_{\\text{hoán vị}} = 2 \\times \\text{giao tử hoán vị} \\le 50\\%',
    genChuyen: (k) => {
      const fPct = 16 + (k % 6) * 4;
      const f = fPct / 100;
      const gFemaleAb = (1 - f) / 2;
      const gMaleAb = f / 2;
      const aabb = gFemaleAb * gMaleAb;
      const A_B_ = 0.5 + aabb;
      const res3 = (A_B_ * 0.75 * 100).toFixed(2);
      return {
        content: `Hoán vị gen #${k + 1}: Cho phép lai $P: \\frac{AB}{ab}X^D X^d \\times \\frac{Ab}{aB}X^D Y$ với tần số hoán vị gen giữa $A$ và $B$ ở cả hai giới là $f = ${fPct}\\%$. Tính tỉ lệ cá thể mang kiểu hình trội cả 3 tính trạng ($A-B-D-$) ở $F_1$.`,
        solution: `Bên cái cho $\\underline{ab} = ${gFemaleAb.toFixed(2)}$, bên đực cho $\\underline{ab} = ${gMaleAb.toFixed(2)} \\Rightarrow \\frac{ab}{ab} = ${aabb.toFixed(4)} \\Rightarrow A-B- = 0{,}5 + ${aabb.toFixed(4)} = ${A_B_.toFixed(4)}$. Nhân với $P(D-) = 0{,}75$ thu được $A-B-D- = ${res3}\\%$.`
      };
    },
    genStandard: (k) => {
      const fPct = 10 + (k % 8) * 4;
      const link = (100 - fPct) / 2;
      const recomb = fPct / 2;
      return {
        content: `Giao tử hoán vị #${k + 1}: Cá thể dị hợp chéo $\\frac{Ab}{aB}$ giảm phân bình thường xảy ra hoán vị gen với tần số $f = ${fPct}\\%$. Viết tỉ lệ phần trăm 4 loại giao tử tạo thành.`,
        solution: `Giao tử liên kết $\\underline{Ab} = \\underline{aB} = (100\\% - ${fPct}\\%)/2 = ${link}\\%$; giao tử hoán vị $\\underline{AB} = \\underline{ab} = ${fPct}\\%/2 = ${recomb}\\%$.`
      };
    }
  },
  {
    topic: 'Di truyền Quần thể Hardy–Weinberg & Sinh thái học Lotka–Volterra',
    grade: 'Lớp 12',
    simId: 'hardy_weinberg_2d',
    simLabel: 'Mô phỏng Cân bằng Hardy–Weinberg & Sinh thái 2D',
    formula: 'p^2 + 2pq + q^2 = 1,\\quad \\frac{dN}{dt} = rN\\left(1 - \\frac{N}{K}\\right)',
    genChuyen: (k) => {
      const rVals = [0.2, 0.3, 0.4, 0.5];
      const r = rVals[k % rVals.length];
      const pctO = (r * r * 100).toFixed(0);
      const q = 0.2;
      const p = Number((1 - r - q).toFixed(1));
      const pctB = (((q * q + 2 * q * r) * 100)).toFixed(0);
      const pctA = ((p * p + 2 * p * r) * 100).toFixed(0);
      const hetInA = (2 * p * r) / (p * p + 2 * p * r);
      const pChildO = hetInA * hetInA * 0.25;
      const pChildA = ((1 - pChildO) * 100).toFixed(2);
      return {
        content: `Quần thể ABO #${k + 1}: Một quần thể người cân bằng Hardy–Weinberg có tỉ lệ nhóm máu O là $${pctO}\\%$ và nhóm máu B là $${pctB}\\%$. Tính tỉ lệ nhóm máu A trong quần thể và xác suất một cặp vợ chồng đều có nhóm máu A sinh được người con đầu lòng nhóm máu A.`,
        solution: `Tần số alen $r = ${r}$, $q + r = \\sqrt{${((Number(pctO) + Number(pctB)) / 100).toFixed(2)}} \\Rightarrow q = ${q},\\ p = ${p}$. Nhóm máu A chiếm $${pctA}\\%$. Tỉ lệ kiểu gen dị hợp $I^A i$ trong nhóm A là ${(hetInA * 100).toFixed(1)}\\% \\Rightarrow P(\\text{con A}) = 1 - P(\\text{con O}) = ${pChildA}\\%$.`
      };
    },
    genStandard: (k) => {
      const p = Number((0.2 + (k % 7) * 0.1).toFixed(1));
      const q = Number((1 - p).toFixed(1));
      return {
        content: `Cân bằng Quần thể #${k + 1}: Một quần thể giao phối ngẫu nhiên đạt trạng thái cân bằng Hardy–Weinberg có tần số alen trội $p(A) = ${p}$. Xác định cấu trúc di truyền và tỉ lệ kiểu hình lặn $aa$.`,
        solution: `$q(a) = 1 - ${p} = ${q}$. Cấu trúc di truyền: $${(p * p).toFixed(2)}\\ AA + ${(2 * p * q).toFixed(2)}\\ Aa + ${(q * q).toFixed(2)}\\ aa = 1$, tỉ lệ kiểu hình lặn chiếm $${((q * q) * 100).toFixed(0)}\\%$.`
      };
    }
  }
];

function buildBioPaper(index: number, track: 'chuyen' | 'khong_chuyen'): ExamPaper {
  const num = index + 1;
  const g1 = BIO_GENERATORS[index % BIO_GENERATORS.length];
  const g2 = BIO_GENERATORS[(index + 3) % BIO_GENERATORS.length];
  const isChuyen = track === 'chuyen';
  const yearNum = 2020 + (index % 7);
  const year = `${yearNum}-${yearNum + 1}`;
  const code = `${isChuyen ? 'SC' : 'SK'}-${String(num).padStart(3, '0')}`;
  const school = isChuyen
    ? CHUYEN_SCHOOLS[index % CHUYEN_SCHOOLS.length]
    : STANDARD_SCHOOLS[index % STANDARD_SCHOOLS.length];

  const res1 = isChuyen ? g1.genChuyen(index) : g1.genStandard(index);
  const res2 = isChuyen ? g2.genChuyen(index + 5) : g2.genStandard(index + 5);

  const questions: ExamQuestion[] = [
    {
      number: 'Câu 1',
      points: isChuyen ? '3.5 điểm' : '3.0 điểm',
      content: res1.content,
      solution: res1.solution,
      keyFormulasOrHints: [`$${g1.formula}$`],
      simulationLink: {
        type: 'biology',
        targetId: g1.simId,
        label: g1.simLabel
      }
    },
    {
      number: 'Câu 2',
      points: isChuyen ? '3.0 điểm' : '2.0 điểm',
      content: `Chuyên đề #${num} (**${g1.topic}**): Biểu thức hoặc quy luật sinh học chuẩn nào mô tả đúng bản chất hiện tượng?\nA. $${g1.formula}$\nB. Chiều dài phân tử DNA không phụ thuộc số lượng đơn phân\nC. Tần số alen tự thay đổi theo định luật bảo toàn cơ năng\nD. Vận tốc phản ứng enzyme tăng tuyến tính mãi tới $100^\\circ\\text{C}$`,
      solution: `**Đáp án đúng: A.** Công thức chuẩn của chuyên đề "${g1.topic}" là $${g1.formula}$.`,
      keyFormulasOrHints: [`$${g1.formula}$`],
      simulationLink: {
        type: 'biology',
        targetId: g1.simId,
        label: g1.simLabel
      }
    },
    {
      number: 'Câu 3',
      points: isChuyen ? '3.5 điểm' : '5.0 điểm',
      content: res2.content,
      solution: res2.solution,
      keyFormulasOrHints: [`$${g2.formula}$`],
      simulationLink: {
        type: 'biology',
        targetId: g2.simId,
        label: g2.simLabel
      }
    }
  ];

  return {
    id: isChuyen ? `bio-chuyen-${num}` : `bio-kc-${num}`,
    examCode: code,
    subject: 'biology',
    track,
    subjectTag: isChuyen ? `Sinh Chuyên · ${g1.grade}` : `Sinh học ${g1.grade}`,
    categoryTag: isChuyen
      ? num % 3 === 0
        ? 'HSG Quốc gia / Olympic'
        : 'Tuyển Sinh Chuyên Sinh'
      : num % 3 === 0
      ? 'Đánh Giá Năng Lực'
      : 'Chuẩn GDPT 2018 & 2006',
    academicYear: year,
    title: isChuyen
      ? `Đề Chuyên Sinh #${String(num).padStart(3, '0')} · ${g1.topic}`
      : `Đề Ôn Thi Sinh #${String(num).padStart(3, '0')} · ${g1.topic}`,
    school,
    source: isChuyen ? 'Kho Đề Chuyên Sinh Synapse 2020–2026' : 'Bộ Đề Chuẩn GDPT Synapse',
    timeMinutes: isChuyen ? 150 : 50,
    featuredSnippet: res1.content,
    topics: [g1.topic, g2.topic, g1.grade],
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
