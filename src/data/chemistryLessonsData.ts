import { Chemistry3DMode, ChemistryLesson, ChemistrySimType } from '../types';
import { CHEMISTRY_GDPT_2018_LESSONS, makeChemLesson } from './chemistryGdpt2018Lessons';
import { CHEMISTRY_GDPT_2018_EXTRA_LESSONS } from './chemistryGdpt2018ExtraLessons';
import { CHEMISTRY_GDPT_2006_LESSONS } from './chemistryGdpt2006Lessons';
import { CHEMISTRY_GDPT_2006_EXTRA_LESSONS } from './chemistryGdpt2006ExtraLessons';
import { CHEMISTRY_CHUYEN_LESSONS } from './chemistryChuyenLessons';
import { CHEMISTRY_CHUYEN_EXTRA_LESSONS } from './chemistryChuyenExtraLessons';
import { CHEMISTRY_SYLLABUS_MODULES } from './chemistrySyllabusModules';
import { CHEMISTRY_MIDDLE_SCHOOL_LESSONS } from './chemistryMiddleSchoolLessons';

interface ChemSupplementarySpec {
  id: string;
  track: ChemistryLesson['track'];
  grade: ChemistryLesson['grade'];
  tier?: ChemistryLesson['tier'];
  stageLabel: string;
  sourceTag: string;
  lessonNumber: number;
  title: string;
  subtitle: string;
  description?: string;
  concept: string;
  formula: string;
  sim2d: ChemistrySimType;
  sim3d: Chemistry3DMode;
  q: string;
  opts: [string, string, string, string];
  ans: number;
  exp: string;
  essayQ: string;
  essayA: string;
}

const CHEM_SUPPLEMENTARY_SPECS: ChemSupplementarySpec[] = [
  {
    id: 'chem-cd-10-1',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Chuyên đề Học tập Hóa 10',
    sourceTag: 'Chuyên đề Hóa 10 · Cơ sở Hóa học',
    lessonNumber: 8,
    title: 'Chuyên đề 10: Liên kết σ, π, Phản ứng Hạt nhân & Phổ Động học',
    subtitle: 'Trạng thái lai hóa sp, sp², sp³, năng lượng liên kết và cân bằng phản ứng phân hạch – nhiệt hạch trong hóa học hạt nhân',
    concept: 'Liên kết $\\sigma$ hình thành do xen phủ trục (bền hơn), liên kết $\\pi$ do xen phủ bên. Tổng số proton và số khối luôn được bảo toàn trong mọi biến đổi hạt nhân.',
    formula: '\\text{Bậc liên kết} = \\frac{n_{e\\text{ liên kết}} - n_{e\\text{ phản liên kết}}}{2}',
    sim2d: 'vsepr_bonding_2d',
    sim3d: 'vsepr_geometry_3d',
    q: 'Phân tử etilen ($C_2H_4$) chứa tổng cộng bao nhiêu liên kết $\\sigma$ và bao nhiêu liên kết $\\pi$?',
    opts: ['A. 4 liên kết σ và 2 liên kết π', 'B. 5 liên kết σ và 1 liên kết π', 'C. 3 liên kết σ và 1 liên kết π', 'D. 6 liên kết σ và 0 liên kết π'],
    ans: 1,
    exp: 'Trong $CH_2=CH_2$ có 4 liên kết đơn C–H ($4\\sigma$) và 1 liên kết đôi C=C ($1\\sigma + 1\\pi$), tổng cộng $5\\sigma$ và $1\\pi$.',
    essayQ: 'Xác định kiểu lai hóa của nguyên tử cacbon trong $CH_4$, $C_2H_4$ và $C_2H_2$, nêu góc liên kết tương ứng.',
    essayA: 'CH₄: sp³ (109,5°); C₂H₄: sp² (120°); C₂H₂: sp (180°)'
  },
  {
    id: 'chem-cd-10-2',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Chuyên đề Học tập Hóa 10',
    sourceTag: 'Chuyên đề Hóa 10 · Hóa học trong Phòng cháy chữa cháy',
    lessonNumber: 9,
    title: 'Chuyên đề 10: Phản ứng Cháy, Nổ & Phòng chống Cháy nổ (Tam giác Cháy)',
    subtitle: 'Điểm chớp cháy, nhiệt độ tự bốc cháy, nổ bụi/nổ khí và nguyên lí bình chữa cháy CO₂ – bột khô',
    concept: 'Sự cháy cần đủ 3 yếu tố (Tam giác cháy): Chất cháy + Chất oxi hóa ($O_2$) + Nguồn nhiệt đạt ngưỡng kích hoạt. Không dùng nước dập đám cháy kim loại kiềm hoặc xăng dầu.',
    formula: 'Q_{\\text{cháy}} = n \\cdot |\\Delta_c H^\\circ_{298}|',
    sim2d: 'oxygen_combustion_2d',
    sim3d: 'combustion_reactor_3d',
    q: 'Vì sao KHÔNG được dùng nước để dập tắt đám cháy kim loại Natri (Na) hoặc Magie (Mg) đang cháy?',
    opts: ['A. Nước làm bay hơi mất màu ngọn lửa', 'B. Kim loại kiềm/Mg nóng phản ứng với nước giải phóng khí H₂ dễ gây nổ', 'C. Nước làm đông cứng kim loại', 'D. Nước chứa nhiều CO₂ hòa tan'],
    ans: 1,
    exp: '$2\\text{Na} + 2\\text{H}_2\\text{O} \\to 2\\text{NaOH} + \\text{H}_2\\uparrow$ giải phóng hiđro và tỏa nhiệt lớn làm đám cháy bùng phát dữ dội hơn.',
    essayQ: 'Giải thích cơ chế dập lửa của bình chữa cháy khí $CO_2$ nén lỏng.',
    essayA: 'CO₂ nặng hơn không khí (d = 44/29 ≈ 1,52) đẩy O₂ khỏi vùng cháy và hóa hơi thu nhiệt làm hạ nhiệt độ dưới điểm bắt cháy.'
  },
  {
    id: 'chem-cd-11-1',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Chuyên đề Học tập Hóa 11',
    sourceTag: 'Chuyên đề Hóa 11 · Phân bón Hóa học & Chế biến Dầu mỏ',
    lessonNumber: 10,
    title: 'Chuyên đề 11: Phân bón Vô cơ – Hữu cơ, Chưng cất Phân đoạn Dầu mỏ & Chỉ số Octane',
    subtitle: 'Phân đạm – lân – kali – NPK, cải tạo đất chua bằng vôi và quá trình Reforming xúc tác nâng chỉ số Octane',
    concept: 'Chưng cất dầu mỏ dựa vào sự khác biệt nhiệt độ sôi các phân đoạn; Reforming biến ankan mạch thẳng thành mạch nhánh/vòng thơm giúp xăng chống kích nổ tốt hơn (chỉ số Octane cao).',
    formula: '\\text{Chỉ số Octane}: \\text{isooctane} = 100,\\quad \\text{n-heptane} = 0',
    sim2d: 'hydrocarbon_isomers_2d',
    sim3d: 'methane_ethane_3d',
    q: 'Quá trình Reforming xúc tác trong lọc hóa dầu nhằm mục đích chính nào?',
    opts: ['A. Tạo thêm nhựa đường', 'B. Chuyển ankan mạch thẳng thành mạch nhánh và hiđrocacbon thơm để tăng chỉ số Octane', 'C. Tách lưu huỳnh bằng kiềm', 'D. Chưng cất lấy khí hóa lỏng LPG'],
    ans: 1,
    exp: 'Hiđrocacbon phân nhánh và vòng thơm cháy êm hơn trong động cơ đốt trong, làm tăng chỉ số Octane của xăng (RON 92, RON 95).',
    essayQ: 'Không nên trộn phân đạm amoni ($NH_4NO_3, (NH_4)_2SO_4$) chung với vôi bột $Ca(OH)_2$ hoặc tro bếp khi bón ruộng. Hãy viết phương trình hóa học giải thích.',
    essayA: '2NH₄⁺ + Ca(OH)₂ → Ca²⁺ + 2NH₃↑ + 2H₂O làm thất thoát đạm bay hơi.'
  },
  {
    id: 'chem-cd-12-1',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Chuyên đề Học tập Hóa 12',
    sourceTag: 'Chuyên đề Hóa 12 · Cơ chế Phản ứng Hữu cơ & Hóa học Xanh',
    lessonNumber: 9,
    title: 'Chuyên đề 12: Cơ chế Phản ứng, Pin Nhiên liệu Hydro & 12 Nguyên tắc Hóa học Xanh',
    subtitle: 'Pin nhiên liệu H₂–O₂ hiệu suất cao (không phát thải CO₂) và kinh tế nguyên tử (Atom Economy)',
    concept: 'Kinh tế nguyên tử đo phần trăm khối lượng chất đầu đi vào sản phẩm mong muốn. Pin nhiên liệu $H_2-O_2$ biến trực tiếp năng lượng hóa học thành điện năng với sản phẩm phụ duy nhất là nước sạch.',
    formula: '\\%\\text{Atom Economy} = \\frac{M_{\\text{sản phẩm mong muốn}}}{\\sum M_{\\text{chất tham gia}}} \\times 100\\%',
    sim2d: 'galvanic_cell_2d',
    sim3d: 'galvanic_cell_3d',
    q: 'Sản phẩm phát thải tại điện cực của pin nhiên liệu Hydro – Oxi ($H_2–O_2$) hoạt động là:',
    opts: ['A. Khí CO₂', 'B. Khí NOₓ và SO₂', 'C. Nước tinh khiết (H₂O)', 'D. Khí Metan CH₄'],
    ans: 2,
    exp: 'Tổng phản ứng pin nhiên liệu là $2\\text{H}_2 + \\text{O}_2 \\to 2\\text{H}_2\\text{O}$ cùng dòng điện sạch.',
    essayQ: 'Tính chỉ số kinh tế nguyên tử (% Atom Economy) cho phản ứng cộng $C_2H_4 + Br_2 \\to C_2H_4Br_2$.',
    essayA: '100% (vì toàn bộ nguyên tử chất tham gia đều đi vào sản phẩm duy nhất).'
  },
  {
    id: 'chem-2006-11-3',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2006 · Hóa học 11',
    sourceTag: 'SGK Hóa 11 (2006) · Chương VI–IX: Hiđrocacbon, Ancol, Phenol, Anđehit, Axit',
    lessonNumber: 3,
    title: 'Anđehit, Xeton & Axit Cacboxylic – Hiệu suất Chuỗi Chuyển hóa (2006)',
    subtitle: 'Dãy biến hóa CH₄ → C₂H₂ → C₂H₄ → C₂H₅OH → CH₃CHO → CH₃COOH → CH₃COOC₂H₅',
    description: 'Hệ thống hóa toàn bộ sơ đồ chuyển hóa hữu cơ Hóa 11 (2006) phục vụ luyện thi THPT.',
    concept: 'Từ metan làm lạnh nhanh ở $1500^\\circ\\text{C}$ điều chế axetilen; hiđrat hóa etilen tạo etanol; oxi hóa etanol bằng $CuO$ tạo etanal; oxi hóa tiếp thu axit axetic.',
    formula: '2\\text{CH}_4 \\xrightarrow{1500^\\circ\\text{C, làm lạnh nhanh}} \\text{C}_2\\text{H}_2 + 3\\text{H}_2',
    sim2d: 'carbonyl_alcohol_2d',
    sim3d: 'carbonyl_alcohol_3d',
    q: 'Trong sơ đồ $C_2H_4 \\xrightarrow{(1)} X \\xrightarrow{(2)} CH_3CHO \\xrightarrow{(3)} CH_3COOH$, chất trung gian X là:',
    opts: ['A. CH₃OH', 'B. C₂H₅OH', 'C. CH₃COOCH₃', 'D. C₂H₂'],
    ans: 1,
    exp: 'Cộng nước vào $C_2H_4$ thu được $C_2H_5OH$, oxi hóa nhẹ bởi $CuO$ thu $CH_3CHO$.',
    essayQ: 'Cho $4{,}4\\text{ g}$ $CH_3CHO$ tác dụng lượng dư $AgNO_3/NH_3$. Tính khối lượng Ag kết tủa.',
    essayA: 'n(CH₃CHO) = 0,1 mol -> n(Ag) = 0,2 mol -> 21,6 g Ag'
  },
  {
    id: 'chem-2006-12-3',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2006 · Hóa học 12',
    sourceTag: 'SGK Hóa 12 (2006) · Chuyên đề Phản ứng Nhiệt nhôm & Oxit Sắt',
    lessonNumber: 3,
    title: 'Phản ứng Nhiệt Nhôm (Al + FeₓOᵧ) & Bài toán Quy đổi 2006',
    subtitle: 'Xác định thành phần rắn sau nhiệt nhôm dựa vào lượng khí H₂ khi cho tác dụng NaOH dư và HCl dư',
    concept: 'Hỗn hợp sau phản ứng nhiệt nhôm tác dụng kiềm dư giải phóng $H_2$ chứng tỏ Al còn dư ($\\Rightarrow$ phản ứng hoàn toàn thì oxit sắt hết).',
    formula: '2y\\text{Al} + 3\\text{Fe}_x\\text{O}_y \\xrightarrow{t^\\circ} y\\text{Al}_2\\text{O}_3 + 3x\\text{Fe}',
    sim2d: 'metallurgy_furnace_2d',
    sim3d: 'metal_corrosion_3d',
    q: 'Thực hiện phản ứng nhiệt nhôm hỗn hợp Al và $Fe_2O_3$ (không có oxi). Lấy chất rắn sau phản ứng cho vào dung dịch NaOH dư thấy thoát ra khí $H_2$. Kết luận chắc chắn nào đúng?',
    opts: ['A. Oxit Fe₂O₃ còn dư', 'B. Al còn dư', 'C. Không tạo thành Fe', 'D. Chỉ tạo FeO'],
    ans: 1,
    exp: 'Trong rắn sau nhiệt nhôm chỉ có Al dư mới phản ứng với dung dịch kiềm giải phóng khí $H_2$.',
    essayQ: 'Nung hỗn hợp gồm $0{,}2\\text{ mol}$ Al và $0{,}1\\text{ mol } Fe_2O_3$ (hiệu suất 100%). Tính khối lượng Fe thu được.',
    essayA: '2Al + Fe₂O₃ → Al₂O₃ + 2Fe (vừa đủ) -> 0,2 mol Fe = 11,2 g'
  },
  {
    id: 'chem-chuyen-12-2',
    track: 'chuyen',
    grade: 'Lớp 12',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Hóa · Bậc 3: Tổng hợp Hữu cơ Chuyên sâu',
    sourceTag: 'HSG Quốc gia / IChO · Phản ứng Ozon phân, Wittig, Aldol & Ester Đa chức',
    lessonNumber: 7,
    title: 'Biện luận Ester Đa chức – Peptide Chuyên sâu & Phản ứng Ozon phân',
    subtitle: 'Giải cấu tạo este mạch vòng/hai chức chứa gốc phenol, peptide nhiều mắt xích và cắt nối đôi C=C bằng O₃/Zn',
    concept: 'Ozon phân khử ($O_3$, sau đó $Zn/CH_3COOH$ hoặc $Me_2S$) cắt đôi liên kết $C=C$ thành hai nhóm $C=O$ (anđehit hoặc xeton), giúp xác định chính xác vị trí nối đôi.',
    formula: 'R_1CH=CR_2R_3 \\xrightarrow{1.\\,O_3;\\ 2.\\,Zn/H^+} R_1CHO + O=CR_2R_3',
    sim2d: 'esterification_2d',
    sim3d: 'ester_reflux_3d',
    q: 'Ozon phân khử một anken X mạch hở thu được duy nhất một sản phẩm hữu cơ là propanone ($CH_3COCH_3$). Tên gọi của X là:',
    opts: ['A. 2-methylbut-2-ene', 'B. 2,3-dimethylbut-2-ene', 'C. Hex-3-ene', 'D. 2-methylpropene'],
    ans: 1,
    exp: 'Ghép hai phân tử $CH_3-C(=O)-CH_3$ lại qua nối đôi C=C thu được $(CH_3)_2C=C(CH_3)_2$: 2,3-dimethylbut-2-ene.',
    essayQ: 'Xà phòng hóa hoàn toàn $0{,}1\\text{ mol}$ este X công thức $C_8H_8O_2$ cần dùng vừa đủ $0{,}2\\text{ mol } NaOH$ và không thấy ancol tạo thành. Xác định công thức cấu tạo của X.',
    essayA: 'Este tác dụng 2 mol NaOH không tạo ancol nên là este của phenol: CH₃COOC₆H₅ (phenyl axetat).'
  }
];

const BUILT_SUPPLEMENTARY: ChemistryLesson[] = CHEM_SUPPLEMENTARY_SPECS.map((s) =>
  makeChemLesson({
    id: s.id,
    track: s.track,
    grade: s.grade,
    tier: s.tier,
    stageLabel: s.stageLabel,
    sourceTag: s.sourceTag,
    lessonNumber: s.lessonNumber,
    title: s.title,
    subtitle: s.subtitle,
    description: s.description || s.concept,
    theory1Heading: '1. Kiến thức cốt lõi & Bản chất hóa học',
    theory1: s.concept,
    theory2Heading: '2. Biểu thức & Nguyên tắc vận dụng',
    theory2: `• Công thức trọng tâm: $$${s.formula}$$`,
    keyFormulas: [s.formula],
    sim2d: s.sim2d,
    sim3d: s.sim3d,
    mcq1: {
      source: s.sourceTag,
      question: s.q,
      options: s.opts,
      correctIndex: s.ans,
      explanation: s.exp
    },
    mcq2: {
      source: s.sourceTag,
      question: `Trong chuyên đề "${s.title}", đại lượng/quy luật cốt lõi nào mô tả đúng bản chất hiện tượng?`,
      options: [
        `A. $${s.formula}$`,
        'B. Áp dụng định luật bảo toàn cơ năng không đổi',
        'C. Chỉ phụ thuộc vào khối lượng riêng bình chứa',
        'D. Không chịu ảnh hưởng của cấu tạo phân tử và nhiệt độ'
      ],
      correctIndex: 0,
      explanation: s.concept
    },
    essay: {
      source: s.sourceTag,
      question: s.essayQ,
      solutionSteps: [s.essayA],
      finalAnswer: s.essayA
    }
  })
);

export const CHEMISTRY_LESSONS: ChemistryLesson[] = [
  ...CHEMISTRY_MIDDLE_SCHOOL_LESSONS,
  ...CHEMISTRY_GDPT_2018_LESSONS,
  ...CHEMISTRY_GDPT_2018_EXTRA_LESSONS,
  ...CHEMISTRY_GDPT_2006_LESSONS,
  ...CHEMISTRY_GDPT_2006_EXTRA_LESSONS,
  ...CHEMISTRY_CHUYEN_LESSONS,
  ...CHEMISTRY_CHUYEN_EXTRA_LESSONS,
  ...CHEMISTRY_SYLLABUS_MODULES,
  ...BUILT_SUPPLEMENTARY
];
