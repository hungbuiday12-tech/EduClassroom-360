import { Chemistry3DMode, ChemistryLesson, ChemistrySimType } from '../types';
import { CHEMISTRY_2D_SIMS } from './chemistryDomainsData';

function paramsFor(sim: ChemistrySimType) {
  const spec = CHEMISTRY_2D_SIMS.find((s) => s.id === sim) || CHEMISTRY_2D_SIMS[0];
  return {
    defaultParams: { ...spec.defaultParams },
    paramBounds: { ...spec.paramBounds }
  };
}

interface SeedChemInput {
  id: string;
  track: ChemistryLesson['track'];
  grade: ChemistryLesson['grade'];
  tier?: ChemistryLesson['tier'];
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
  sim2d: ChemistrySimType;
  sim3d: Chemistry3DMode;
  mcq1: ChemistryLesson['practiceExercises'][number];
  mcq2: ChemistryLesson['practiceExercises'][number];
  essay: ChemistryLesson['essayExercises'][number];
}

export function makeChemLesson(s: SeedChemInput): ChemistryLesson {
  const { defaultParams, paramBounds } = paramsFor(s.sim2d);
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

export const CHEMISTRY_GDPT_2018_LESSONS: ChemistryLesson[] = [
  // ==================== KHTN 9 (GDPT 2018) ====================
  makeChemLesson({
    id: 'chem-9-1',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'GDPT 2018 · KHTN 9 (Hóa học)',
    sourceTag: 'KHTN 9 · Kết nối tri thức / Chân trời sáng tạo',
    lessonNumber: 1,
    title: 'Tính chất chung của Kim loại & Dãy hoạt động hóa học',
    subtitle: 'Tính dẻo, dẫn điện, phản ứng với phi kim, nước, dung dịch acid và dung dịch muối',
    description: 'Khảo sát tính chất vật lí chung (ánh kim, dẫn điện Ag > Cu > Au > Al > Fe) và quy luật đẩy kim loại đứng trước đẩy kim loại đứng sau ra khỏi dung dịch muối.',
    theory1Heading: '1. Tính chất hóa học đặc trưng của Kim loại',
    theory1: '• Tác dụng với phi kim ($O_2, Cl_2, S$): tạo oxit hoặc muối.\n• Tác dụng với dung dịch acid ($HCl, H_2SO_4$ loãng): kim loại đứng trước H giải phóng khí $H_2\\uparrow$.\n• Kim loại kiềm/kiềm thổ (K, Na, Ca, Ba) phản ứng với $H_2O$ ở nhiệt độ thường tạo kiềm + $H_2$.',
    theory2Heading: '2. Dãy hoạt động hóa học (K, Na, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Au)',
    theory2: '• Mức độ hoạt động giảm dần từ trái sang phải.\n• Từ Mg trở đi, kim loại đứng trước đẩy được kim loại đứng sau ra khỏi dung dịch muối: $\\text{Fe} + \\text{CuSO}_4 \\to \\text{FeSO}_4 + \\text{Cu}\\downarrow$.',
    keyFormulas: [
      'n_{\\text{khí (ĐKC)}} = \\frac{V}{24{,}79}',
      '\\text{Fe} + \\text{Cu}^{2+} \\to \\text{Fe}^{2+} + \\text{Cu}\\downarrow',
      '2\\text{Al} + 6\\text{HCl} \\to 2\\text{AlCl}_3 + 3\\text{H}_2\\uparrow'
    ],
    sim2d: 'metal_activity_2d',
    sim3d: 'metal_corrosion_3d',
    mcq1: {
      source: 'KHTN 9 · GDPT 2018',
      question: 'Ngâm một đinh sắt sạch trong dung dịch $\\text{CuSO}_4$ dư. Hiện tượng quan sát được là:',
      options: ['A. Khí không màu thoát ra mạnh', 'B. Kim loại màu đỏ bám ngoài đinh sắt, màu xanh dung dịch nhạt dần', 'C. Xuất hiện kết tủa trắng', 'D. Không có hiện tượng gì xảy ra'],
      correctIndex: 1,
      explanation: 'Sắt đứng trước đồng trong dãy hoạt động nên khử $\\text{Cu}^{2+}$ thành đồng đỏ bám trên đinh sắt, đồng thời tạo $\\text{FeSO}_4$ lục nhạt.'
    },
    mcq2: {
      source: 'KHTN 9 · Tính toán ĐKC',
      question: 'Hòa tan hoàn toàn $6{,}5\\text{ g}$ Zn bằng dung dịch HCl dư. Thể tích khí $H_2$ thu được ở điều kiện chuẩn (25°C, 1 bar) là:',
      options: ['A. 2,479 L', 'B. 4,958 L', 'C. 1,2395 L', 'D. 3,7185 L'],
      correctIndex: 0,
      explanation: '$n_{\\text{Zn}} = 6{,}5/65 = 0{,}1\\text{ mol} \\Rightarrow n_{\\text{H}_2} = 0{,}1\\text{ mol} \\Rightarrow V = 0{,}1 \\times 24{,}79 = 2{,}479\\text{ L}$.'
    },
    essay: {
      source: 'Bài tập thực hành KHTN 9',
      question: 'Cho $11{,}2\\text{ g}$ bột Fe tác dụng hoàn toàn với $200\\text{ mL}$ dung dịch $\\text{CuSO}_4$ $1{,}5\\text{M}$. Tính khối lượng chất rắn thu được sau phản ứng.',
      hints: ['Tính số mol Fe và $\\text{CuSO}_4$ để xác định chất hết, chất dư'],
      solutionSteps: ['$n_{\\text{Fe}} = 11{,}2/56 = 0{,}2\\text{ mol}$; $n_{\\text{CuSO}_4} = 0{,}2 \\times 1{,}5 = 0{,}3\\text{ mol}$.', 'Vì $0{,}2 < 0{,}3$, Fe hết, $\\text{CuSO}_4$ dư.', 'Theo PTHH: $n_{\\text{Cu}} = n_{\\text{Fe}} = 0{,}2\\text{ mol} \\Rightarrow m_{\\text{Cu}} = 0{,}2 \\times 64 = 12{,}8\\text{ g}$.'],
      finalAnswer: '12,8 g Cu'
    }
  }),
  makeChemLesson({
    id: 'chem-9-2',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'GDPT 2018 · KHTN 9 (Hóa học)',
    sourceTag: 'KHTN 9 · Gang, Thép & Tách kim loại',
    lessonNumber: 2,
    title: 'Quá trình tách Kim loại & Hợp kim Gang – Thép',
    subtitle: 'Nhiệt luyện, thủy luyện, điện phân nóng chảy và quy trình luyện gang trong lò cao',
    description: 'Hiểu 3 phương pháp điều chế kim loại theo mức độ hoạt động và các phản ứng khử oxit sắt bằng khí CO trong lò cao.',
    theory1Heading: '1. Nguyên tắc chọn phương pháp tách kim loại',
    theory1: '• Kim loại hoạt động mạnh (K, Na, Ca, Mg, Al): **điện phân nóng chảy** ($2\\text{Al}_2\\text{O}_3 \\xrightarrow{\\text{đpnc, criolit}} 4\\text{Al} + 3\\text{O}_2$).\n• Kim loại trung bình/yếu (Zn, Fe, Sn, Pb, Cu): **nhiệt luyện** (khử bằng CO, C, $H_2$, Al) hoặc **thủy luyện**.',
    theory2Heading: '2. Luyện Gang và luyện Thép',
    theory2: '• Luyện gang dùng CO khử $\\text{Fe}_2\\text{O}_3$ ở nhiệt độ cao: $\\text{Fe}_2\\text{O}_3 + 3\\text{CO} \\xrightarrow{t^\\circ} 2\\text{Fe} + 3\\text{CO}_2$.\n• Luyện thép thổi $O_2$ vào gang lỏng để oxi hóa giảm hàm lượng C xuống dưới $2\\%$.',
    keyFormulas: [
      '\\text{Fe}_2\\text{O}_3 + 3\\text{CO} \\xrightarrow{t^\\circ} 2\\text{Fe} + 3\\text{CO}_2',
      '2\\text{Al}_2\\text{O}_3 \\xrightarrow{\\text{đpnc, Na}_3\\text{AlF}_6} 4\\text{Al} + 3\\text{O}_2\\uparrow'
    ],
    sim2d: 'metallurgy_furnace_2d',
    sim3d: 'metal_corrosion_3d',
    mcq1: {
      source: 'KHTN 9',
      question: 'Trong công nghiệp, kim loại Nhôm (Al) được sản xuất bằng phương pháp nào?',
      options: ['A. Điện phân dung dịch AlCl₃', 'B. Điện phân nóng chảy Al₂O₃ có mặt criolit', 'C. Dùng CO khử Al₂O₃ ở nhiệt độ cao', 'D. Dùng Zn đẩy Al khỏi Al₂(SO₄)₃'],
      correctIndex: 1,
      explanation: 'Al là kim loại hoạt động mạnh nên chỉ tách được bằng điện phân nóng chảy $\\text{Al}_2\\text{O}_3$ (criolit hạ nhiệt độ nóng chảy từ 2050°C xuống ~900°C).'
    },
    mcq2: {
      source: 'KHTN 9',
      question: 'Sự khác biệt cơ bản về thành phần hóa học giữa thép và gang là:',
      options: ['A. Thép chứa 2–5% C, gang dưới 2% C', 'B. Thép chứa dưới 2% C, gang chứa 2–5% C', 'C. Gang là Fe nguyên chất', 'D. Thép chứa hoàn toàn là đồng'],
      correctIndex: 1,
      explanation: 'Hợp kim Fe–C có 2%–5% C là gang (giòn); dưới 2% C là thép (dẻo, đàn hồi, chịu lực tốt).'
    },
    essay: {
      source: 'Luyện tập tách kim loại KHTN 9',
      question: 'Khử hoàn toàn $16\\text{ g}$ $\\text{Fe}_2\\text{O}_3$ bằng khí CO dư ở nhiệt độ cao. Tính khối lượng sắt tạo thành và thể tích khí $\\text{CO}_2$ (ĐKC).',
      solutionSteps: ['$n_{\\text{Fe}_2\\text{O}_3} = 16/160 = 0{,}1\\text{ mol}$.', '$\\text{Fe}_2\\text{O}_3 + 3\\text{CO} \\to 2\\text{Fe} + 3\\text{CO}_2$.', '$n_{\\text{Fe}} = 0{,}2\\text{ mol} \\Rightarrow m_{\\text{Fe}} = 11{,}2\\text{ g}$; $n_{\\text{CO}_2} = 0{,}3\\text{ mol} \\Rightarrow V = 0{,}3 \\times 24{,}79 = 7{,}437\\text{ L}$.'],
      finalAnswer: '11,2 g Fe và 7,437 L CO₂'
    }
  }),
  makeChemLesson({
    id: 'chem-9-3',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'GDPT 2018 · KHTN 9 (Hóa học)',
    sourceTag: 'KHTN 9 · Phi kim & Chu trình Carbon',
    lessonNumber: 3,
    title: 'Tính chất Phi kim: Clo, Cacbon & Hợp chất Vô cơ',
    subtitle: 'Sự khác biệt phi kim–kim loại, phản ứng của Cl₂ với kiềm/nước và hiệu ứng nhà kính CO₂',
    description: 'Tìm hiểu tính oxi hóa mạnh của halogen (Cl₂), tính khử của cacbon ở nhiệt độ cao và vai trò cân bằng $\\text{CO}_2$ tự nhiên.',
    theory1Heading: '1. Tính chất đặc trưng của Phi kim',
    theory1: '• Phi kim có độ âm điện lớn, dễ nhận electron tạo ion âm hoặc liên kết cộng hóa trị.\n• Clo tác dụng trực tiếp với kim loại tạo muối clorua hóa trị cao ($2\\text{Fe} + 3\\text{Cl}_2 \\xrightarrow{t^\\circ} 2\\text{FeCl}_3$).',
    theory2Heading: '2. Nước Gia-ven & Khử trùng',
    theory2: '• Sục $Cl_2$ vào dung dịch NaOH nguội tạo nước Gia-ven: $\\text{Cl}_2 + 2\\text{NaOH} \\to \\text{NaCl} + \\text{NaClO} + \\text{H}_2\\text{O}$.\n• Muối $\\text{NaClO}$ có tính oxi hóa mạnh giúp tẩy trắng và sát khuẩn.',
    keyFormulas: [
      '2\\text{Fe} + 3\\text{Cl}_2 \\xrightarrow{t^\\circ} 2\\text{FeCl}_3',
      '\\text{Cl}_2 + 2\\text{NaOH} \\to \\text{NaCl} + \\text{NaClO} + \\text{H}_2\\text{O}'
    ],
    sim2d: 'halogen_displacement_2d',
    sim3d: 'halogen_ion_bench_3d',
    mcq1: {
      source: 'KHTN 9',
      question: 'Sục khí Clo vào dung dịch NaOH ở nhiệt độ thường thu được dung dịch nước Gia-ven chứa hai muối là:',
      options: ['A. NaCl và NaClO₃', 'B. NaCl và NaClO', 'C. NaClO và NaClO₄', 'D. Chỉ có NaCl'],
      correctIndex: 1,
      explanation: 'Ở nhiệt độ thường: $\\text{Cl}_2 + 2\\text{NaOH} \\to \\text{NaCl} + \\text{NaClO} + \\text{H}_2\\text{O}$.'
    },
    mcq2: {
      source: 'KHTN 9',
      question: 'Kim loại nào sau đây tác dụng với HCl và tác dụng với $Cl_2$ cho ra cùng một loại muối?',
      options: ['A. Fe', 'B. Cu', 'C. Zn', 'D. Ag'],
      correctIndex: 2,
      explanation: 'Zn chỉ có một hóa trị II trong hợp chất nên đều tạo $\\text{ZnCl}_2$. Fe tạo $\\text{FeCl}_2$ (với HCl) nhưng $\\text{FeCl}_3$ (với $\\text{Cl}_2$).'
    },
    essay: {
      source: 'KHTN 9',
      question: 'Dẫn $2{,}479\\text{ L}$ khí $\\text{CO}_2$ (ĐKC) vào $100\\text{ mL}$ dung dịch $\\text{Ca(OH)}_2$ $1\\text{M}$. Tính khối lượng kết tủa $\\text{CaCO}_3$ thu được.',
      solutionSteps: ['$n_{\\text{CO}_2} = 0{,}1\\text{ mol}$, $n_{\\text{Ca(OH)}_2} = 0{,}1\\text{ mol}$.', 'Tỉ lệ $1:1 \\Rightarrow \\text{CO}_2 + \\text{Ca(OH)}_2 \\to \\text{CaCO}_3\\downarrow + \\text{H}_2\\text{O}$.', '$m_{\\text{CaCO}_3} = 0{,}1 \\times 100 = 10\\text{ g}$.'],
      finalAnswer: '10 g CaCO₃'
    }
  }),
  makeChemLesson({
    id: 'chem-9-4',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'GDPT 2018 · KHTN 9 (Hóa Hữu cơ)',
    sourceTag: 'KHTN 9 · Hiđrocacbon & Nhiên liệu hóa thạch',
    lessonNumber: 4,
    title: 'Alkane (CH₄), Alkene (C₂H₄) & Nguồn Nhiên Liệu',
    subtitle: 'Cấu tạo tứ diện metan, nối đôi etilen làm mất màu nước brom và phản ứng trùng hợp PE',
    description: 'Khởi đầu Hóa Hữu cơ lớp 9 theo chuẩn danh pháp IUPAC mới (GDPT 2018): phân biệt liên kết đơn và liên kết đôi C=C.',
    theory1Heading: '1. Metan (Methane) và Phản ứng thế với Clo',
    theory1: '• Phân tử $CH_4$ có cấu trúc tứ diện đều góc $109{,}5^\\circ$, chỉ có liên kết đơn C–H bền vững.\n• Phản ứng đặc trưng: $\\text{CH}_4 + \\text{Cl}_2 \\xrightarrow{\\text{ánh sáng}} \\text{CH}_3\\text{Cl} + \\text{HCl}$.',
    theory2Heading: '2. Etilen (Ethylene) và Liên kết đôi C=C',
    theory2: '• Trong $C_2H_4$ có 1 liên kết $\\pi$ kém bền dễ đứt ra khi cộng $Br_2$: $\\text{C}_2\\text{H}_4 + \\text{Br}_2 \\to \\text{C}_2\\text{H}_4\\text{Br}_2$ (mất màu dung dịch brom).\n• Trùng hợp tạo nhựa PE.',
    keyFormulas: [
      '\\text{CH}_4 + 2\\text{O}_2 \\xrightarrow{t^\\circ} \\text{CO}_2 + 2\\text{H}_2\\text{O}',
      '\\text{CH}_2=\\text{CH}_2 + \\text{Br}_2 \\to \\text{BrCH}_2-\\text{CH}_2\\text{Br}'
    ],
    sim2d: 'alkene_addition_2d',
    sim3d: 'alkene_addition_3d',
    mcq1: {
      source: 'KHTN 9 · Hữu cơ',
      question: 'Thuốc thử đơn giản nhất dùng để phân biệt hai khí không màu Methane ($CH_4$) và Ethylene ($C_2H_4$) là:',
      options: ['A. Quỳ tím ẩm', 'B. Dung dịch nước Brom (nâu đỏ)', 'C. Dung dịch NaOH', 'D. Nước cất'],
      correctIndex: 1,
      explanation: '$C_2H_4$ có liên kết đôi C=C làm mất màu nâu đỏ của dung dịch brom, còn $CH_4$ thì không.'
    },
    mcq2: {
      source: 'KHTN 9',
      question: 'Đốt cháy hoàn toàn $0{,}2\\text{ mol}$ hỗn hợp gồm $CH_4$ và $C_2H_4$ cần vừa đủ $V$ lít $O_2$ (ĐKC) và thu được $0{,}3\\text{ mol}$ $CO_2$. Tổng số mol $H_2O$ sinh ra là:',
      options: ['A. 0,4 mol', 'B. 0,5 mol', 'C. 0,6 mol', 'D. 0,3 mol'],
      correctIndex: 0,
      explanation: 'Cả hai phân tử $CH_4$ và $C_2H_4$ đều chứa 4 nguyên tử H nên $1\\text{ mol}$ bất kì hỗn hợp hai khí này khi đốt cháy luôn sinh ra $2\\text{ mol } H_2O$. Do đó $n_{\\text{H}_2\\text{O}} = 2 \\times 0{,}2 = 0{,}4\\text{ mol}$.',
    },
    essay: {
      source: 'KHTN 9',
      question: 'Dẫn $4{,}958\\text{ L}$ (ĐKC) hỗn hợp khí $CH_4$ và $C_2H_4$ lội qua bình đựng dung dịch $Br_2$ dư thấy khối lượng bình tăng thêm $2{,}8\\text{ g}$. Tính phần trăm thể tích mỗi khí.',
      solutionSteps: ['$n_{\\text{hh}} = 4{,}958/24{,}79 = 0{,}2\\text{ mol}$.', 'Khối lượng bình brom tăng chính là khối lượng $C_2H_4$ bị hấp thụ: $n_{\\text{C}_2\\text{H}_4} = 2{,}8/28 = 0{,}1\\text{ mol}$.', 'Do đó $n_{\\text{CH}_4} = 0{,}1\\text{ mol}$, mỗi khí chiếm $50\\%$ thể tích.'],
      finalAnswer: '50% CH₄ và 50% C₂H₄'
    }
  }),
  makeChemLesson({
    id: 'chem-9-5',
    track: 'khong_chuyen',
    grade: 'Lớp 9',
    stageLabel: 'GDPT 2018 · KHTN 9 (Hóa Hữu cơ)',
    sourceTag: 'KHTN 9 · Ethylic Alcohol, Acetic Acid & Lipid – Tinh bột',
    lessonNumber: 5,
    title: 'Ethylic Alcohol, Acetic Acid, Este hóa & Sinh học phân tử',
    subtitle: 'Độ cồn, tính acid của giấm ăn, phản ứng este hóa tạo mùi thơm và thủy phân chất béo – tinh bột',
    description: 'Kết nối toàn diện dẫn xuất hiđrocacbon lớp 9: nhóm -OH, -COOH, độ rượu và tổng hợp etyl axetat.',
    theory1Heading: '1. Ethylic Alcohol (C₂H₅OH) & Acetic Acid (CH₃COOH)',
    theory1: '• Độ cồn = $(V_{\\text{C}_2\\text{H}_5\\text{OH}} / V_{\\text{dd}}) \\times 100$. Cồn $45^\\circ$ chứa $45\\text{ mL}$ rượu nguyên chất trong $100\\text{ mL}$ dung dịch.\n• $CH_3COOH$ làm quỳ hóa đỏ, tác dụng Mg, CuO, $CaCO_3$ giải phóng $CO_2$.',
    theory2Heading: '2. Phản ứng Este hóa & Thủy phân Chất béo – Tinh bột',
    theory2: '• $\\text{CH}_3\\text{COOH} + \\text{C}_2\\text{H}_5\\text{OH} \\xrightleftharpoons[t^\\circ]{\\text{H}_2\\text{SO}_4\\text{ đặc}} \\text{CH}_3\\text{COOC}_2\\text{H}_5 + \\text{H}_2\\text{O}$.\n• Hồ tinh bột làm dung dịch iot ($I_2$) chuyển sang màu xanh tím đặc trưng.',
    keyFormulas: [
      '\\text{Độ rượu} = \\frac{V_{\\text{rượu}}}{V_{\\text{dung dịch}}} \\times 100',
      '\\text{CH}_3\\text{COOH} + \\text{C}_2\\text{H}_5\\text{OH} \\rightleftharpoons \\text{CH}_3\\text{COOC}_2\\text{H}_5 + \\text{H}_2\\text{O}'
    ],
    sim2d: 'esterification_2d',
    sim3d: 'ester_reflux_3d',
    mcq1: {
      source: 'KHTN 9',
      question: 'Trong $200\\text{ mL}$ dung dịch ethylic alcohol $40^\\circ$ có chứa bao nhiêu mL $C_2H_5OH$ nguyên chất?',
      options: ['A. 40 mL', 'B. 80 mL', 'C. 120 mL', 'D. 50 mL'],
      correctIndex: 1,
      explanation: '$V_{\\text{C}_2\\text{H}_5\\text{OH}} = 200 \\times 40 / 100 = 80\\text{ mL}$.'
    },
    mcq2: {
      source: 'KHTN 9',
      question: 'Để tẩy cặn vôi ($CaCO_3$) bám trong ấm đun nước lâu ngày, người ta có thể dùng dung dịch nào an toàn trong bếp?',
      options: ['A. Nước muối ăn', 'B. Dung dịch cồn 70°', 'C. Giấm ăn (CH₃COOH)', 'D. Dầu thực vật'],
      correctIndex: 2,
      explanation: '$2\\text{CH}_3\\text{COOH} + \\text{CaCO}_3 \\to (\\text{CH}_3\\text{COO})_2\\text{Ca} + \\text{CO}_2\\uparrow + \\text{H}_2\\text{O}$ hòa tan cặn đá vôi.'
    },
    essay: {
      source: 'KHTN 9',
      question: 'Đun nóng $12\\text{ g}$ axit axetic với lượng dư ancol etylic (xúc tác $H_2SO_4$ đặc), thu được $11\\text{ g}$ etyl axetat. Tính hiệu suất phản ứng este hóa.',
      solutionSteps: ['$n_{\\text{CH}_3\\text{COOH}} = 12/60 = 0{,}2\\text{ mol}$.', '$n_{\\text{este thực tế}} = 11/88 = 0{,}125\\text{ mol}$.', 'Hiệu suất $H = (0{,}125 / 0{,}2) \\times 100\\% = 62{,}5\\%$.'],
      finalAnswer: 'H = 62,5%'
    }
  }),

  // ==================== HÓA HỌC 10 (GDPT 2018) ====================
  makeChemLesson({
    id: 'chem-10-1',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Hóa học 10',
    sourceTag: 'Hóa 10 · Chương 1: Cấu tạo nguyên tử',
    lessonNumber: 1,
    title: 'Cấu tạo vỏ nguyên tử, Orbital (AO) & Cấu hình Electron',
    subtitle: 'Cách electron sắp xếp theo lớp – phân lớp, hình dạng đám mây orbital và quy tắc điền electron cơ bản',
    description: 'Hiểu trực quan vì sao electron chuyển động thành từng lớp năng lượng, cách viết cấu hình electron (Z=1 đến Z=30) và dự đoán nguyên tố là kim loại hay phi kim.',
    theory1Heading: '1. Khái niệm Orbital (AO) & Quy tắc sắp xếp Electron',
    theory1: '• **Orbital nguyên tử (AO)** là vùng không gian quanh hạt nhân mà ở đó xác suất tìm thấy electron lớn nhất (~90%); AO s có dạng hình cầu, AO p có dạng hình số 8 nổi.\n• **Quy tắc điền e dễ nhớ**: Mỗi ô AO chứa tối đa 2 electron quay ngược chiều nhau (Pauli); electron điền từ mức năng lượng thấp lên cao ($1s\\ 2s\\ 2p\\ 3s\\ 3p\\ 4s\\ 3d\\ 4p$); trong cùng phân lớp, electron ưu tiên đứng riêng lẻ trước khi ghép đôi (quy tắc Hund).',
    theory2Heading: '2. Tính chất lớp vỏ ngoài cùng & Ngoại lệ Cr, Cu',
    theory2: '• **Tính chất cơ bản**: Lớp ngoài cùng có 1, 2, 3 electron thường là **kim loại** (trừ H, He, B); có 5, 6, 7 electron thường là **phi kim**; có 8 electron là **khí hiếm** trơ bền.\n• **Lưu ý 2 ngoại lệ đặc biệt**: Cr ($Z=24$) là $[\\text{Ar}]3d^5 4s^1$ và Cu ($Z=29$) là $[\\text{Ar}]3d^{10} 4s^1$ vì phân lớp $3d$ nửa đầy ($d^5$) hoặc đầy ($d^{10}$) bền vững hơn.',
    keyFormulas: [
      'A = Z + N,\\quad \\text{Số e tối đa lớp } n = 2n^2',
      '\\text{Cr }(Z=24): [\\text{Ar}]3d^5 4s^1,\\quad \\text{Cu }(Z=29): [\\text{Ar}]3d^{10} 4s^1'
    ],
    sim2d: 'atomic_orbitals_2d',
    sim3d: 'atomic_orbitals_3d',
    mcq1: {
      source: 'Hóa 10 · GDPT 2018',
      question: 'Cấu hình electron đúng ở trạng thái cơ bản của nguyên tử Sắt Fe ($Z = 26$) là:',
      options: ['A. [Ar] 3d⁶ 4s²', 'B. [Ar] 3d⁸', 'C. [Ar] 3d⁵ 4s³', 'D. [Ar] 4s² 3d⁶ 4p¹'],
      correctIndex: 0,
      explanation: 'Thứ tự mức năng lượng điền đến $4s^2$ (20e), còn 6e vào $3d^6$. Sắp xếp theo lớp thu được $[\\text{Ar}]3d^6 4s^2$.'
    },
    mcq2: {
      source: 'Hóa 10 · GDPT 2018',
      question: 'Số electron độc thân của nguyên tử Nitơ N ($Z = 7$) ở trạng thái cơ bản là:',
      options: ['A. 1', 'B. 2', 'C. 3', 'D. 5'],
      correctIndex: 2,
      explanation: 'N: $1s^2 2s^2 2p^3$. Theo quy tắc Hund, 3 electron $2p$ điền vào 3 AO $p_x, p_y, p_z$ nên có 3 electron độc thân.'
    },
    essay: {
      source: 'Hóa 10',
      question: 'Tổng số hạt proton, notron, electron trong nguyên tử nguyên tố X là 40. Trong đó số hạt mang điện nhiều hơn số hạt không mang điện là 12. Xác định Z, số khối A và viết cấu hình electron của X.',
      solutionSteps: ['$2Z + N = 40$ và $2Z - N = 12 \\Rightarrow 4Z = 52 \\Rightarrow Z = 13$ (Al), $N = 14$.', '$A = Z + N = 27$.', 'Cấu hình electron: $1s^2 2s^2 2p^6 3s^2 3p^1$ (có 3e lớp ngoài cùng, là kim loại).'],
      finalAnswer: 'Al (Z=13, A=27): [Ne]3s²3p¹'
    }
  }),
  makeChemLesson({
    id: 'chem-10-2',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Hóa học 10',
    sourceTag: 'Hóa 10 · Chương 2: Bảng tuần hoàn & Định luật tuần hoàn',
    lessonNumber: 2,
    title: 'Bảng Tuần Hoàn & Xu Hướng Biến Đổi Tính Chất',
    subtitle: 'Chu kì, nhóm A/B, bán kính nguyên tử, độ âm điện Pauling, tính kim loại – phi kim & oxit/hiđroxit cao nhất',
    description: 'Phân tích sự biến thiên tuần hoàn theo quy luật điện tích hạt nhân tăng dần và cách suy luận công thức oxit, hiđroxit từ vị trí nhóm.',
    theory1Heading: '1. Quy luật biến đổi trong Chu kì và Nhóm A',
    theory1: '• Trong một **chu kì** (từ trái sang phải): điện tích hạt nhân tăng, cùng số lớp e $\\Rightarrow$ bán kính $R$ **giảm**, độ âm điện $\\chi$ **tăng**, tính phi kim **tăng**, tính kim loại **giảm**.\n• Trong một **nhóm A** (từ trên xuống): số lớp e tăng nhanh $\\Rightarrow R$ **tăng**, $\\chi$ **giảm**, tính kim loại **tăng**.',
    theory2Heading: '2. Hóa trị cao nhất & Hợp chất với Hydro',
    theory2: '• Nhóm $n$A có hóa trị cao nhất với oxi là $n$ (trừ F), công thức oxit cao nhất $R_2O_n$ (hay rút gọn).\n• Phi kim từ nhóm IVA–VIIA tạo hợp chất khí với H dạng $RH_{8-n}$.',
    keyFormulas: [
      '\\text{Hóa trị với O} + \\text{Hóa trị với H} = 8\\text{ (nhóm IVA–VIIA)}',
      '\\text{Tính axit oxit/hiđroxit tăng theo chiều tăng độ âm điện}'
    ],
    sim2d: 'periodic_trends_2d',
    sim3d: 'periodic_tower_3d',
    mcq1: {
      source: 'Hóa 10',
      question: 'Dãy nguyên tố nào sau đây được sắp xếp theo chiều tăng dần độ âm điện (trái -> phải)?',
      options: ['A. Na < Mg < Al < Si < P < S < Cl', 'B. F < O < N < C', 'C. Cs < K < Na < Li < F < Cl', 'D. Cl < Br < I < F'],
      correctIndex: 0,
      explanation: 'Các nguyên tố thuộc chu kì 3 từ trái sang phải có Z tăng từ 11 đến 17 nên độ âm điện tăng đều từ Na (0,93) đến Cl (3,16).'
    },
    mcq2: {
      source: 'Hóa 10',
      question: 'Nguyên tố R tạo hợp chất khí với hiđro là $RH_3$. Công thức oxit cao nhất của R là:',
      options: ['A. RO₂', 'B. R₂O₅', 'C. RO₃', 'D. R₂O₃'],
      correctIndex: 1,
      explanation: 'Hóa trị với H là 3 $\\Rightarrow$ hóa trị cao nhất với O là $8 - 3 = 5$ (Nhóm VA) $\\Rightarrow R_2O_5$.'
    },
    essay: {
      source: 'Hóa 10',
      question: 'Oxit cao nhất của một nguyên tố R nhóm VIA có $60\\%$ khối lượng oxi. Xác định nguyên tố R và viết công thức axit tương ứng.',
      solutionSteps: ['Nhóm VIA $\\Rightarrow$ oxit cao nhất là $RO_3$.', '$\\frac{48}{M_R + 48} = 0{,}6 \\Rightarrow M_R = 32$ (Lưu huỳnh S).', 'Axit tương ứng là $\\text{H}_2\\text{SO}_4$ (tính axit mạnh).'],
      finalAnswer: 'R = S (Lưu huỳnh), H₂SO₄'
    }
  }),
  makeChemLesson({
    id: 'chem-10-3',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Hóa học 10',
    sourceTag: 'Hóa 10 · Chương 3: Liên kết hóa học',
    lessonNumber: 3,
    title: 'Liên kết Ion, Cộng hóa trị, Liên kết Hydrogen & Hình dạng Phân tử',
    subtitle: 'Quy tắc 8 electron (Octet), cách phân biệt liên kết qua hiệu độ âm điện Δχ và lực hút giữa các phân tử',
    description: 'Hiểu bản chất nhường – nhận hay góp chung electron, vì sao nước ($H_2O$) có nhiệt độ sôi cao bất thường ở $100^\\circ\\text{C}$ và hình dạng không gian 3D của phân tử.',
    theory1Heading: '1. Khái niệm & Tính chất của Liên kết Ion và Cộng hóa trị',
    theory1: '• **Liên kết ion** ($\\Delta\\chi \\ge 1{,}7$): Kim loại nhường e thành ion dương, phi kim nhận e thành ion âm hút nhau (ví dụ muối ăn $NaCl$: rắn, nhiệt độ nóng chảy cao, tan tốt trong nước).\n• **Liên kết cộng hóa trị** ($\\Delta\\chi < 1{,}7$): Các nguyên tử góp chung electron (như $H_2, HCl, H_2O$); nếu cặp e lệch về nguyên tử hút mạnh hơn thì là liên kết phân cực ($0{,}4 \\le \\Delta\\chi < 1{,}7$).',
    theory2Heading: '2. Liên kết Hydrogen & Tính chất vật lí dễ nhận biết',
    theory2: '• **Liên kết Hydrogen** ($X-H\\cdots Y$ với F, O, N) giúp các phân tử hút nhau bền hơn, làm tăng mạnh **nhiệt độ sôi** và **độ tan trong nước** (ví dụ $H_2O$ sôi ở $100^\\circ\\text{C}$, ancol etylic tan vô hạn trong nước, còn $H_2S$ không có liên kết H nên là chất khí ở $-60^\\circ\\text{C}$).',
    keyFormulas: [
      '\\Delta\\chi = |\\chi_A - \\chi_B|',
      'T_{\\text{sôi}}: \\text{HF} > \\text{HI} > \\text{HBr} > \\text{HCl}'
    ],
    sim2d: 'vsepr_bonding_2d',
    sim3d: 'vsepr_geometry_3d',
    mcq1: {
      source: 'Hóa 10 · GDPT 2018',
      question: 'Yếu tố chính khiến nước ($H_2O$) có nhiệt độ sôi ($100^\\circ\\text{C}$) cao bất thường so với $H_2S$ ($-60^\\circ\\text{C}$) là:',
      options: ['A. Khối lượng phân tử nước lớn hơn', 'B. Liên kết hydrogen liên phân tử giữa các phân tử H₂O', 'C. Liên kết ion trong phân tử nước', 'D. Tương tác van der Waals yếu hơn'],
      correctIndex: 1,
      explanation: 'Oxi có độ âm điện rất lớn và còn cặp e tự do tạo mạng lưới liên kết hydrogen liên phân tử bền vững.'
    },
    mcq2: {
      source: 'Hóa 10',
      question: 'Phân tử nào sau đây có cấu tạo thẳng (góc liên kết $180^\\circ$) và không phân cực dù chứa liên kết phân cực?',
      options: ['A. H₂O', 'B. SO₂', 'C. CO₂', 'D. NH₃'],
      correctIndex: 2,
      explanation: '$CO_2$ ($O=C=O$) thẳng hàng $180^\\circ$ nên hai vectơ lưỡng cực triệt tiêu lẫn nhau ($\\mu = 0$).'
    },
    essay: {
      source: 'Hóa 10',
      question: 'Dựa vào mô hình VSEPR và sự lai hóa, giải thích vì sao góc liên kết trong $CH_4$ ($109{,}5^\\circ$), $NH_3$ ($107^\\circ$) và $H_2O$ ($104{,}5^\\circ$) giảm dần.',
      solutionSteps: ['Cả C, N, O đều lai hóa $sp^3$ nên bộ khung điện tử có 4 hướng tứ diện.', 'Trong $CH_4$ có 4 cặp liên kết (BP), không có cặp tự do (LP).', 'Trong $NH_3$ có 1 cặp LP và trong $H_2O$ có 2 cặp LP. Vì lực đẩy $LP-LP > LP-BP > BP-BP$, các cặp tự do chiếm nhiều không gian hơn và ép góc giữa các liên kết H–X–H nhỏ dần.'],
      finalAnswer: '109,5° -> 107° -> 104,5° do số cặp e không liên kết tăng'
    }
  }),
  makeChemLesson({
    id: 'chem-10-4',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Hóa học 10',
    sourceTag: 'Hóa 10 · Chương 4: Phản ứng Oxi hóa – Khử',
    lessonNumber: 4,
    title: 'Số oxi hóa & Phương pháp Thăng bằng Electron',
    subtitle: 'Chất khử (cho e, số oxi hóa tăng), chất oxi hóa (nhận e, số oxi hóa giảm) và bảo toàn electron',
    description: 'Cân bằng thành thạo mọi phản ứng oxi hóa – khử phức tạp ($KMnO_4, K_2Cr_2O_7, HNO_3, FeS_2$) và vận dụng định luật bảo toàn electron.',
    theory1Heading: '1. Nguyên tắc ghi nhớ Khử – Oxi hóa',
    theory1: '• **Khử cho – O nhận**: Chất khử nhường electron $\\to$ số oxi hóa tăng (quá trình oxi hóa).\n• Chất oxi hóa nhận electron $\\to$ số oxi hóa giảm (quá trình khử).',
    theory2Heading: '2. Các bước lập phương trình bằng thăng bằng electron',
    theory2: '• Bước 1: Xác định số oxi hóa thay đổi.\n• Bước 2: Viết hai quá trình cho – nhận e.\n• Bước 3: Tìm bội chung nhỏ nhất sao cho $\\sum e_{\\text{nhường}} = \\sum e_{\\text{nhận}}$.\n• Bước 4: Điền hệ số và kiểm tra bảo toàn H, O.',
    keyFormulas: [
      '\\sum n_{e\\text{ nhường}} = \\sum n_{e\\text{ nhận}}',
      '\\text{Cu}: 0 \\to +2\\ (+2e);\\quad \\text{N}^{+5} \\to \\text{N}^{+2}\\ (+3e)'
    ],
    sim2d: 'redox_balancing_2d',
    sim3d: 'galvanic_cell_3d',
    mcq1: {
      source: 'Hóa 10',
      question: 'Trong phản ứng $3\\text{Cu} + 8\\text{HNO}_3 \\to 3\\text{Cu(NO}_3)_2 + 2\\text{NO}\\uparrow + 4\\text{H}_2\\text{O}$, phân tử $\\text{HNO}_3$ đóng vai trò:',
      options: ['A. Chỉ là chất oxi hóa', 'B. Chỉ là môi trường tạo muối', 'C. Vừa là chất oxi hóa vừa là môi trường', 'D. Chất khử'],
      correctIndex: 2,
      explanation: '2 trong số 8 phân tử $HNO_3$ đóng vai trò chất oxi hóa tạo NO; 6 phân tử còn lại tạo muối $Cu(NO_3)_2$ (môi trường).'
    },
    mcq2: {
      source: 'Hóa 10',
      question: 'Hệ số cân bằng nguyên tối giản của $KMnO_4$ và $HCl$ trong phản ứng $a\\text{KMnO}_4 + b\\text{HCl} \\to \\text{KCl} + \\text{MnCl}_2 + \\text{Cl}_2 + \\text{H}_2\\text{O}$ lần lượt là:',
      options: ['A. 2 và 10', 'B. 2 và 16', 'C. 1 và 8', 'D. 2 và 14'],
      correctIndex: 1,
      explanation: '$2\\text{KMnO}_4 + 16\\text{HCl} \\to 2\\text{KCl} + 2\\text{MnCl}_2 + 5\\text{Cl}_2 + 8\\text{H}_2\\text{O}$.'
    },
    essay: {
      source: 'Hóa 10 · Bảo toàn e',
      question: 'Hòa tan hoàn toàn $8{,}1\\text{ g}$ Al bằng dung dịch $HNO_3$ loãng dư thu được khí NO (sản phẩm khử duy nhất). Tính thể tích khí NO ở ĐKC.',
      solutionSteps: ['$n_{\\text{Al}} = 8{,}1/27 = 0{,}3\\text{ mol}$.', 'Bảo toàn electron: $3n_{\\text{Al}} = 3n_{\\text{NO}} \\Rightarrow n_{\\text{NO}} = 0{,}3\\text{ mol}$.', '$V_{\\text{NO}} = 0{,}3 \\times 24{,}79 = 7{,}437\\text{ L}$.'],
      finalAnswer: '7,437 L NO'
    }
  }),
  makeChemLesson({
    id: 'chem-10-5',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Hóa học 10',
    sourceTag: 'Hóa 10 · Chương 5: Năng lượng hóa học',
    lessonNumber: 5,
    title: 'Biến thiên Enthalpy ΔH & Tính theo nhiệt tạo thành, năng lượng liên kết',
    subtitle: 'Phản ứng tỏa nhiệt (ΔH < 0), thu nhiệt (ΔH > 0), điều kiện chuẩn 298K–1 bar và định luật Hess',
    description: 'Sử dụng đúng công thức phân biệt tính $\\Delta_r H^\\circ_{298}$ từ $\\Delta_f H^\\circ$ (sản phẩm trừ chất đầu) và từ $E_b$ (chất đầu trừ sản phẩm).',
    theory1Heading: '1. Tính ΔH từ Enthalpy tạo thành chuẩn ΔfH°₂₉₈',
    theory1: '• $\\Delta_r H^\\circ_{298} = \\sum \\Delta_f H^\\circ_{298}(\\text{sản phẩm}) - \\sum \\Delta_f H^\\circ_{298}(\\text{chất đầu})$.\n• Chú ý: Đơn chất bền nhất ở 25°C, 1 bar có $\\Delta_f H^\\circ_{298} = 0$.',
    theory2Heading: '2. Tính ΔH từ Năng lượng liên kết Eb',
    theory2: '• Cần cung cấp năng lượng để bẻ gãy liên kết chất đầu (+) và tỏa năng lượng khi hình thành liên kết sản phẩm (-):\n  $$\\Delta_r H^\\circ_{298} = \\sum E_b(\\text{chất đầu}) - \\sum E_b(\\text{sản phẩm})$$',
    keyFormulas: [
      '\\Delta_r H^\\circ = \\sum \\Delta_f H^\\circ(\\text{sp}) - \\sum \\Delta_f H^\\circ(\\text{cđ})',
      '\\Delta_r H^\\circ = \\sum E_b(\\text{cđ}) - \\sum E_b(\\text{sp})'
    ],
    sim2d: 'enthalpy_hess_2d',
    sim3d: 'activation_surface_3d',
    mcq1: {
      source: 'Hóa 10 · GDPT 2018',
      question: 'Phản ứng $2\\text{H}_2(g) + \\text{O}_2(g) \\to 2\\text{H}_2\\text{O}(l)$ có $\\Delta_r H^\\circ_{298} = -571{,}6\\text{ kJ}$. Nhận xét nào đúng?',
      options: ['A. Phản ứng thu nhiệt rất mạnh', 'B. Phản ứng tỏa nhiệt, nhiệt tạo thành chuẩn của H₂O(l) là -285,8 kJ/mol', 'C. H₂O(l) kém bền năng lượng hơn hỗn hợp H₂ + O₂', 'D. Cần cấp 571,6 kJ liên tục để tạo 2 mol H₂O'],
      correctIndex: 1,
      explanation: '$\\Delta H < 0$ là phản ứng tỏa nhiệt; tạo 2 mol $H_2O(l)$ từ đơn chất bền giải phóng $571{,}6\\text{ kJ}$ nên $\\Delta_f H^\\circ = -285{,}8\\text{ kJ/mol}$.'
    },
    mcq2: {
      source: 'Hóa 10',
      question: 'Cho $E_b(H-H)=436$, $E_b(Cl-Cl)=243$, $E_b(H-Cl)=432\\text{ kJ/mol}$. Biến thiên enthalpy chuẩn của phản ứng $H_2(g) + Cl_2(g) \\to 2HCl(g)$ là:',
      options: ['A. -185 kJ', 'B. +185 kJ', 'C. -247 kJ', 'D. +247 kJ'],
      correctIndex: 0,
      explanation: '$\\Delta_r H^\\circ = (436 + 243) - 2 \\times 432 = 679 - 864 = -185\\text{ kJ}$.'
    },
    essay: {
      source: 'Hóa 10 · Nhiệt hóa học',
      question: 'Tính $\\Delta_r H^\\circ_{298}$ của phản ứng đốt cháy 1 mol metan $\\text{CH}_4(g) + 2\\text{O}_2(g) \\to \\text{CO}_2(g) + 2\\text{H}_2\\text{O}(l)$, biết $\\Delta_f H^\\circ$ của $CH_4(g)=-74{,}6$, $CO_2(g)=-393{,}5$, $H_2O(l)=-285{,}8\\text{ kJ/mol}$.',
      solutionSteps: ['$\\Delta_f H^\\circ(\\text{O}_2) = 0$.', '$\\Delta_r H^\\circ = [(-393{,}5) + 2(-285{,}8)] - [(-74{,}6) + 0] = -965{,}1 + 74{,}6 = -890{,}5\\text{ kJ}$.'],
      finalAnswer: '-890,5 kJ (tỏa nhiệt)'
    }
  }),
  makeChemLesson({
    id: 'chem-10-6',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Hóa học 10',
    sourceTag: 'Hóa 10 · Chương 6: Tốc độ phản ứng',
    lessonNumber: 6,
    title: 'Tốc độ phản ứng, Định luật tác dụng khối lượng & Van ’t Hoff',
    subtitle: 'Tốc độ trung bình, tốc độ tức thời v = k·C_A^a·C_B^b, quy tắc nhiệt độ γ và vai trò chất xúc tác',
    description: 'Khảo sát động học phản ứng bằng đường cong Maxwell–Boltzmann: vì sao tăng nhiệt độ 10°C tốc độ tăng 2–4 lần.',
    theory1Heading: '1. Biểu thức định luật tác dụng khối lượng',
    theory1: '• Cho phản ứng đơn giản $aA + bB \\to \\text{SP}$: $v = k \\cdot C_A^a \\cdot C_B^b$.\n• Hằng số tốc độ $k$ chỉ phụ thuộc vào **nhiệt độ** và **bản chất chất phản ứng / xúc tác**, không phụ thuộc nồng độ.',
    theory2Heading: '2. Quy tắc kinh nghiệm Van ’t Hoff & Xúc tác',
    theory2: '• $\\frac{v_{T_2}}{v_{T_1}} = \\gamma^{\\frac{T_2 - T_1}{10}}$ (với $\\gamma \\in [2; 4]$).\n• Xúc tác làm **giảm năng lượng hoạt hóa $E_a$** nên tốc độ tăng mạnh mà bản thân xúc tác không bị tiêu hao sau phản ứng.',
    keyFormulas: [
      'v_{\\text{tb}} = \\pm\\frac{1}{a}\\frac{\\Delta C_A}{\\Delta t}',
      '\\frac{v_{T_2}}{v_{T_1}} = \\gamma^{(T_2 - T_1)/10}'
    ],
    sim2d: 'reaction_kinetics_2d',
    sim3d: 'activation_surface_3d',
    mcq1: {
      source: 'Hóa 10',
      question: 'Một phản ứng có hệ số nhiệt độ Van ’t Hoff $\\gamma = 3$. Khi tăng nhiệt độ từ $20^\\circ\\text{C}$ lên $50^\\circ\\text{C}$, tốc độ phản ứng tăng bao nhiêu lần?',
      options: ['A. 9 lần', 'B. 27 lần', 'C. 6 lần', 'D. 81 lần'],
      correctIndex: 1,
      explanation: '$\\frac{v_{50}}{v_{20}} = 3^{(50-20)/10} = 3^3 = 27$ lần.'
    },
    mcq2: {
      source: 'Hóa 10',
      question: 'Cho phản ứng $2\\text{NO}(g) + \\text{O}_2(g) \\to 2\\text{NO}_2(g)$ tuân theo biểu thức $v = k[\\text{NO}]^2[\\text{O}_2]$. Nếu tăng áp suất hệ lên 2 lần (giữ nguyên T), tốc độ phản ứng thay đổi thế nào?',
      options: ['A. Tăng 2 lần', 'B. Tăng 4 lần', 'C. Tăng 8 lần', 'D. Không đổi'],
      correctIndex: 2,
      explanation: 'Áp suất tăng 2 lần $\\Rightarrow$ nồng độ mỗi khí tăng 2 lần $\\Rightarrow v\' = k(2[\\text{NO}])^2(2[\\text{O}_2]) = 8v$.'
    },
    essay: {
      source: 'Hóa 10 · Động hóa học',
      question: 'Một phản ứng hóa học hoàn thành trong 48 phút ở $25^\\circ\\text{C}$. Biết hệ số nhiệt độ $\\gamma = 2$. Hỏi ở $55^\\circ\\text{C}$ phản ứng hoàn thành trong bao lâu?',
      solutionSteps: ['Tốc độ tăng $2^{(55-25)/10} = 2^3 = 8$ lần.', 'Thời gian phản ứng tỉ lệ nghịch với tốc độ: $t_2 = 48 / 8 = 6$ phút.'],
      finalAnswer: '6 phút'
    }
  }),
  makeChemLesson({
    id: 'chem-10-7',
    track: 'khong_chuyen',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2018 · Hóa học 10',
    sourceTag: 'Hóa 10 · Chương 7: Nguyên tố Nhóm VIIA (Halogen)',
    lessonNumber: 7,
    title: 'Đơn chất Halogen & Hydrogen Halide – Ion Halide',
    subtitle: 'Quy luật biến đổi từ F₂ đến I₂, tính oxi hóa giảm dần, axit HX tăng dần (HF yếu -> HI mạnh nhất) & nhận biết AgNO₃',
    description: 'Giải thích nghịch lý độ mạnh acid $HF < HCl < HBr < HI$ và thí nghiệm phân biệt ion $F^-, Cl^-, Br^-, I^-$ bằng $AgNO_3$.',
    theory1Heading: '1. Tính oxi hóa giảm dần từ F₂ → Cl₂ → Br₂ → I₂',
    theory1: '• Halogen đứng trước đẩy được ion halide đứng sau (trừ $F_2$ phản ứng với nước): $\\text{Cl}_2 + 2\\text{NaBr} \\to 2\\text{NaCl} + \\text{Br}_2$.\n• $I_2$ làm hồ tinh bột chuyển màu xanh tím đặc trưng.',
    theory2Heading: '2. Tính acid HX & Thuốc thử AgNO₃',
    theory2: '• Độ dài liên kết H–X tăng $\\Rightarrow$ độ mạnh acid tăng: $\\text{HF} \\text{ (yếu)} < \\text{HCl} < \\text{HBr} < \\text{HI}$.\n• Với $\\text{AgNO}_3$: AgF tan; AgCl kết tủa trắng; AgBr vàng nhạt; AgI vàng đậm.',
    keyFormulas: [
      '\\text{Ag}^+ + \\text{Cl}^- \\to \\text{AgCl}\\downarrow\\text{ (trắng)}',
      '\\text{HF} + \\text{SiO}_2 \\to \\text{SiF}_4\\uparrow + \\text{H}_2\\text{O}'
    ],
    sim2d: 'halogen_displacement_2d',
    sim3d: 'halogen_ion_bench_3d',
    mcq1: {
      source: 'Hóa 10 · GDPT 2018',
      question: 'Trong dãy hydrogen halide HF, HCl, HBr, HI, dung dịch nào là acid yếu nhưng có khả năng ăn mòn thủy tinh ($SiO_2$)?',
      options: ['A. HCl', 'B. HF', 'C. HBr', 'D. HI'],
      correctIndex: 1,
      explanation: 'HF là acid yếu (vì liên kết H–F bền và tạo liên kết H) nhưng phản ứng riêng với $SiO_2$ tạo $SiF_4$ và $H_2O$ nên dùng khắc chữ lên thủy tinh.'
    },
    mcq2: {
      source: 'Hóa 10',
      question: 'Nhỏ vài giọt dung dịch $AgNO_3$ lần lượt vào 4 ống nghiệm chứa NaF, NaCl, NaBr, NaI. Hiện tượng thu được lần lượt là:',
      options: ['A. 4 kết tủa màu trắng', 'B. Không tủa, tủa trắng, tủa vàng nhạt, tủa vàng đậm', 'C. Tủa vàng, tủa trắng, không tủa, tủa nâu', 'D. Tất cả đều tạo kết tủa trắng rồi đen dần'],
      correctIndex: 1,
      explanation: 'AgF tan hoàn toàn trong nước; AgCl trắng; AgBr vàng nhạt; AgI vàng đậm.'
    },
    essay: {
      source: 'Hóa 10',
      question: 'Sục từ từ $2{,}479\\text{ L}$ khí $Cl_2$ (ĐKC) qua dung dịch chứa $0{,}15\\text{ mol}$ NaBr. Tính khối lượng muối thu được sau phản ứng (sau khi cô cạn đuổi hết $Br_2$).',
      solutionSteps: ['$n_{\\text{Cl}_2} = 0{,}1\\text{ mol}$.', '$\\text{Cl}_2 + 2\\text{NaBr} \\to 2\\text{NaCl} + \\text{Br}_2$.', 'Theo phương trình, 0,1 mol $\\text{Cl}_2$ cần 0,2 mol NaBr nhưng chỉ có 0,15 mol NaBr $\\Rightarrow$ NaBr hết!', '$n_{\\text{NaCl}} = 0{,}15\\text{ mol} \\Rightarrow m_{\\text{NaCl}} = 0{,}15 \\times 58{,}5 = 8{,}775\\text{ g}$.'],
      finalAnswer: '8,775 g NaCl'
    }
  }),

  // ==================== HÓA HỌC 11 (GDPT 2018) ====================
  makeChemLesson({
    id: 'chem-11-1',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Hóa học 11',
    sourceTag: 'Hóa 11 · Chương 1: Cân bằng hóa học',
    lessonNumber: 1,
    title: 'Cân bằng Hóa học, Hằng số Kc & Nguyên lí Le Chatelier',
    subtitle: 'Trạng thái cân bằng động v_thuận = v_nghịch, hằng số Kc chỉ phụ thuộc nhiệt độ và dự đoán chiều chuyển dịch',
    description: 'Vận dụng nguyên lí Le Chatelier trên hệ $\\text{N}_2\\text{O}_4 \\rightleftharpoons 2\\text{NO}_2$ và bài toán tính nồng độ cân bằng bằng bảng I.C.E.',
    theory1Heading: '1. Hằng số cân bằng Kc',
    theory1: '• Phản ứng thuận nghịch $aA + bB \\rightleftharpoons cC + dD$: $K_C = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$ (không đưa chất rắn nguyên chất vào biểu thức $K_C$).\n• $K_C$ **chỉ phụ thuộc nhiệt độ T**, không phụ thuộc nồng độ ban đầu, áp suất hay xúc tác.',
    theory2Heading: '2. Nguyên lí chuyển dịch cân bằng Le Chatelier',
    theory2: '• Tăng $T$ $\\to$ chuyển theo chiều thu nhiệt ($\\Delta H > 0$).\n• Tăng $P$ $\\to$ chuyển về vế có ít số mol khí hơn.\n• Xúc tác làm tăng cả $v_t$ và $v_n$ như nhau $\\Rightarrow$ **không làm chuyển dịch cân bằng**.',
    keyFormulas: [
      'K_C = \\frac{[C]^c[D]^d}{[A]^a[B]^b}',
      'Q_C < K_C \\Rightarrow \\text{chiều thuận};\\quad Q_C > K_C \\Rightarrow \\text{chiều nghịch}'
    ],
    sim2d: 'equilibrium_shift_2d',
    sim3d: 'equilibrium_piston_3d',
    mcq1: {
      source: 'Hóa 11 · GDPT 2018',
      question: 'Cho cân bằng $\\text{2SO}_2(g) + \\text{O}_2(g) \\rightleftharpoons 2\\text{SO}_3(g)$ ($\\Delta_r H^\\circ = -198\\text{ kJ}$). Tác động nào làm cân bằng chuyển dịch theo chiều thuận?',
      options: ['A. Tăng nhiệt độ', 'B. Giảm áp suất chung của hệ', 'C. Giảm nhiệt độ và tăng áp suất', 'D. Thêm chất xúc tác V₂O₅'],
      correctIndex: 2,
      explanation: 'Phản ứng thuận tỏa nhiệt ($\\Delta H < 0$) và giảm số mol khí ($3 \\to 2$), nên giảm nhiệt độ và tăng áp suất đều đẩy cân bằng sang phải.'
    },
    mcq2: {
      source: 'Hóa 11',
      question: 'Ở nhiệt độ không đổi, cân bằng $\\text{H}_2(g) + \\text{I}_2(g) \\rightleftharpoons 2\\text{HI}(g)$ có $[\\text{H}_2]=0{,}2\\text{ M}$, $[\\text{I}_2]=0{,}2\\text{ M}$, $[\\text{HI}]=1{,}2\\text{ M}$. Giá trị $K_C$ là:',
      options: ['A. 30', 'B. 36', 'C. 6', 'D. 12'],
      correctIndex: 1,
      explanation: '$K_C = \\frac{[\\text{HI}]^2}{[\\text{H}_2][\\text{I}_2]} = \\frac{1{,}2^2}{0{,}2 \\times 0{,}2} = \\frac{1{,}44}{0{,}04} = 36$.'
    },
    essay: {
      source: 'Hóa 11 · Bảng I.C.E',
      question: 'Trộn $1\\text{ mol}$ $H_2$ và $1\\text{ mol}$ $I_2$ trong bình kín $1\\text{ L}$ ở $430^\\circ\\text{C}$. Biết ở nhiệt độ này $K_C = 49$. Tính nồng độ các khí khi đạt cân bằng.',
      solutionSteps: ['Đặt $x$ là số mol $H_2$ phản ứng: $[H_2]=[I_2]=1-x$, $[HI]=2x$.', '$K_C = \\frac{(2x)^2}{(1-x)^2} = 49 \\Rightarrow \\frac{2x}{1-x} = 7 \\Rightarrow 2x = 7 - 7x \\Rightarrow x = 7/9 \\approx 0{,}778\\text{ M}$.', 'Vậy $[H_2]=[I_2] = 0{,}222\\text{ M}$, $[HI] = 1{,}556\\text{ M}$.'],
      finalAnswer: '[H₂] = [I₂] ≈ 0,222 M; [HI] ≈ 1,556 M'
    }
  }),
  makeChemLesson({
    id: 'chem-11-2',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Hóa học 11',
    sourceTag: 'Hóa 11 · Cân bằng trong dung dịch nước',
    lessonNumber: 2,
    title: 'Thuyết Brønsted–Lowry, pH & Chuẩn độ Acid – Base',
    subtitle: 'Chất điện li mạnh/yếu, cho–nhận H⁺, công thức pH, thủy phân muối và đường cong chuẩn độ',
    description: 'Thực hành thí nghiệm chuẩn độ acid–base bằng NaOH với chỉ thị phenolphthalein và tính chính xác pH sau trộn dung dịch.',
    theory1Heading: '1. Thuyết Acid – Base Brønsted–Lowry & pH',
    theory1: '• **Acid** là chất cho proton $H^+$; **Base** là chất nhận proton $H^+$.\n• Ở $25^\\circ\\text{C}$: $K_w = [\\text{H}^+][\\text{OH}^-] = 10^{-14}$; $\\text{pH} = -\\log[\\text{H}^+]$; $\\text{pH} + \\text{pOH} = 14$.',
    theory2Heading: '2. Thủy phân muối & Nguyên tắc chuẩn độ',
    theory2: '• Muối tạo bởi cation base yếu ($NH_4^+, Al^{3+}, Fe^{3+}$) cho môi trường acid ($\\text{pH} < 7$).\n• Muối tạo bởi anion acid yếu ($CO_3^{2-}, CH_3COO^-$) cho môi trường kiềm ($\\text{pH} > 7$).\n• Chuẩn độ: $C_a V_a = C_b V_b$ tại điểm tương đương.',
    keyFormulas: [
      '\\text{pH} = -\\log[\\text{H}^+],\\quad \\text{pH} + \\text{pOH} = 14',
      'C_a V_a = C_b V_b\\text{ (đơn acid – đơn base)}'
    ],
    sim2d: 'acid_base_titration_2d',
    sim3d: 'titration_bench_3d',
    mcq1: {
      source: 'Hóa 11 · GDPT 2018',
      question: 'Chuẩn độ $25{,}0\\text{ mL}$ dung dịch HCl chưa rõ nồng độ bằng dung dịch NaOH $0{,}10\\text{ M}$ (chỉ thị phenolphthalein). Khi hết $20{,}0\\text{ mL}$ NaOH thì dung dịch chuyển hồng nhạt bền. Nồng độ HCl là:',
      options: ['A. 0,08 M', 'B. 0,10 M', 'C. 0,125 M', 'D. 0,04 M'],
      correctIndex: 0,
      explanation: '$C_{\\text{HCl}} = \\frac{0{,}10 \\times 20{,}0}{25{,}0} = 0{,}08\\text{ M}$.'
    },
    mcq2: {
      source: 'Hóa 11',
      question: 'Dung dịch muối nào sau đây làm quỳ tím chuyển sang màu xanh ($\\text{pH} > 7$)?',
      options: ['A. NH₄Cl', 'B. NaCl', 'C. Na₂CO₃', 'D. Al₂(SO₄)₃'],
      correctIndex: 2,
      explanation: '$CO_3^{2-} + H_2O \\rightleftharpoons HCO_3^- + OH^-$ tạo môi trường kiềm làm quỳ hóa xanh.'
    },
    essay: {
      source: 'Hóa 11 · Tính pH',
      question: 'Trộn $100\\text{ mL}$ dung dịch HCl $0{,}2\\text{ M}$ với $100\\text{ mL}$ dung dịch NaOH $0{,}1\\text{ M}$. Tính pH của dung dịch thu được ở $25^\\circ\\text{C}$.',
      solutionSteps: ['$n_{\\text{H}^+} = 0{,}02\\text{ mol}$, $n_{\\text{OH}^-} = 0{,}01\\text{ mol}$.', 'Sau trung hòa, $H^+$ dư $0{,}01\\text{ mol}$ trong $0{,}2\\text{ L}$.', '$[H^+] = 0{,}01 / 0{,}2 = 0{,}05\\text{ M} \\Rightarrow \\text{pH} = -\\log(0{,}05) \\approx 1{,}30$.'],
      finalAnswer: 'pH ≈ 1,30'
    }
  }),
  makeChemLesson({
    id: 'chem-11-3',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Hóa học 11',
    sourceTag: 'Hóa 11 · Chương 2: Nitrogen & Hợp chất',
    lessonNumber: 3,
    title: 'Nitrogen, Ammonia (Haber–Bosch) & Nitric Acid',
    subtitle: 'Liên kết ba N≡N trơ ở nhiệt độ thường, tổng hợp NH₃ công nghiệp và tính oxi hóa mạnh của HNO₃',
    description: 'Khám phá quy trình Haber–Bosch tổng hợp phân đạm thế giới và cơ chế phú dưỡng hóa nguồn nước.',
    theory1Heading: '1. Nitrogen N₂ & Quy trình Haber–Bosch',
    theory1: '• Phân tử $N\\equiv N$ có năng lượng liên kết $945\\text{ kJ/mol}$ rất bền nên khá trơ ở nhiệt độ thường.\n• Tổng hợp $NH_3$: $\\text{N}_2 + 3\\text{H}_2 \\xrightleftharpoons[\\text{Fe}, 450^\\circ\\text{C}, 200\\text{ atm}]{} 2\\text{NH}_3$ ($\\Delta H = -92\\text{ kJ}$).',
    theory2Heading: '2. Tính base của NH₃ & Tính oxi hóa của HNO₃',
    theory2: '• $NH_3$ hòa tan mạnh trong nước tạo dung dịch kiềm yếu, tạo kết tủa hiđroxit với nhiều muối và tạo phức tan với $Cu^{2+}, Ag^+$.\n• $HNO_3$ oxi hóa hầu hết kim loại (trừ Au, Pt); thụ động hóa Al, Fe, Cr ở trạng thái **đặc nguội**.',
    keyFormulas: [
      '\\text{N}_2 + 3\\text{H}_2 \\rightleftharpoons 2\\text{NH}_3\\quad (\\Delta H = -92\\text{ kJ})',
      '[\\text{Cu(NH}_3)_4]^{2+}\\text{ (xanh lam thẫm)}'
    ],
    sim2d: 'haber_ammonia_2d',
    sim3d: 'haber_contact_reactor_3d',
    mcq1: {
      source: 'Hóa 11',
      question: 'Trong phản ứng $4\\text{NH}_3 + 5\\text{O}_2 \\xrightarrow{\\text{Pt}, 850^\\circ\\text{C}} 4\\text{NO} + 6\\text{H}_2\\text{O}$, amoniac thể hiện tính chất gì?',
      options: ['A. Tính acid', 'B. Tính base', 'C. Tính khử', 'D. Tính oxi hóa'],
      correctIndex: 2,
      explanation: 'Số oxi hóa của N tăng từ $-3$ trong $NH_3$ lên $+2$ trong $NO$ nên $NH_3$ là chất khử.'
    },
    mcq2: {
      source: 'Hóa 11',
      question: 'Kim loại nào KHÔNG tan trong dung dịch $HNO_3$ đặc nguội nhưng tan mạnh trong $HNO_3$ loãng?',
      options: ['A. Cu, Ag', 'B. Al, Fe, Cr', 'C. Zn, Mg', 'D. Au, Pt'],
      correctIndex: 1,
      explanation: 'Al, Fe, Cr bị thụ động hóa bởi lớp màng oxit siêu bền trong $HNO_3$ đặc nguội và $H_2SO_4$ đặc nguội.'
    },
    essay: {
      source: 'Hóa 11 · Haber–Bosch',
      question: 'Tổng hợp $NH_3$ từ hỗn hợp gồm $2\\text{ mol } N_2$ và $6\\text{ mol } H_2$ với hiệu suất $25\\%$. Tính số mol $NH_3$ thu được và áp suất bình sau phản ứng (so với ban đầu ở cùng T, V).',
      solutionSteps: ['$n_{\\text{NH}_3} = 2 \\times 2 \\times 0{,}25 = 1\\text{ mol}$ (tổng mol khí ban đầu 8 mol).', 'Số mol phản ứng: $0{,}5\\text{ mol } N_2$ và $1{,}5\\text{ mol } H_2 \\Rightarrow$ còn $1{,}5\\text{ mol } N_2 + 4{,}5\\text{ mol } H_2 + 1\\text{ mol } NH_3 = 7\\text{ mol}$.', 'Áp suất tỉ lệ với số mol khí: $P_{\\text{sau}} = \\frac{7}{8} P_{\\text{đầu}}$.'],
      finalAnswer: '1 mol NH₃; P_sau = 7/8 P_đầu'
    }
  }),
  makeChemLesson({
    id: 'chem-11-4',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Hóa học 11',
    sourceTag: 'Hóa 11 · Lưu huỳnh & Sunfuric Acid',
    lessonNumber: 4,
    title: 'Sulfur, SO₂ & Quy trình Tiếp xúc sản xuất H₂SO₄',
    subtitle: 'Tính oxi hóa & khử của S, SO₂, tính háo nước của H₂SO₄ đặc và an toàn pha loãng acid',
    description: 'Khảo sát công nghệ tiếp xúc V₂O₅ biến đổi $SO_2 \\to SO_3 \\to \\text{Oleum}$ và quy tắc pha loãng acid đặc an toàn.',
    theory1Heading: '1. Quy trình sản xuất H₂SO₄ (Phương pháp Tiếp xúc)',
    theory1: '• Giai đoạn 1: Đốt S hoặc quặng pirit sắt $4\\text{FeS}_2 + 11\\text{O}_2 \\xrightarrow{t^\\circ} 2\\text{Fe}_2\\text{O}_3 + 8\\text{SO}_2$.\n• Giai đoạn 2: $2\\text{SO}_2 + \\text{O}_2 \\xrightleftharpoons[\\text{V}_2\\text{O}_5]{450^\\circ\\text{C}} 2\\text{SO}_3$.\n• Giai đoạn 3: Dùng $H_2SO_4$ 98% hấp thụ $SO_3$ tạo oleum $H_2SO_4\\cdot nSO_3$ rồi pha loãng.',
    theory2Heading: '2. Tính chất đặc biệt của H₂SO₄ đặc',
    theory2: '• Tính **oxi hóa mạnh**: $Cu + 2H_2SO_4\\text{ (đặc)} \\xrightarrow{t^\\circ} CuSO_4 + SO_2\\uparrow + 2H_2O$.\n• Tính **háo nước**: than hóa đường $C_{12}H_{22}O_{11} \\xrightarrow{H_2SO_4\\text{ đặc}} 12C + 11H_2O$.\n• Khi pha loãng: rót từ từ $H_2SO_4$ đặc vào nước, tuyệt đối không làm ngược lại.',
    keyFormulas: [
      '2\\text{SO}_2 + \\text{O}_2 \\xrightleftharpoons[\\text{V}_2\\text{O}_5]{450^\\circ\\text{C}} 2\\text{SO}_3',
      '\\text{Ba}^{2+} + \\text{SO}_4^{2-} \\to \\text{BaSO}_4\\downarrow\\text{ (trắng không tan trong axit)}'
    ],
    sim2d: 'contact_sulfuric_2d',
    sim3d: 'haber_contact_reactor_3d',
    mcq1: {
      source: 'Hóa 11 · An toàn thí nghiệm',
      question: 'Cách pha loãng dung dịch $H_2SO_4$ đặc đúng quy trình an toàn phòng thí nghiệm là:',
      options: ['A. Rót nhanh nước cất vào axit đặc', 'B. Rót từ từ axit đặc theo đũa thủy tinh vào nước và khuấy nhẹ', 'C. Đun sôi nước rồi đổ vào axit đặc', 'D. Cho trực tiếp nước đá vào bình axit đặc'],
      correctIndex: 1,
      explanation: 'Axit đặc nặng hơn nước và tỏa nhiệt rất mạnh khi hiđrat hóa; rót từ từ axit vào nước giúp nhiệt tỏa đều, tránh sôi bắn bỏng axit.'
    },
    mcq2: {
      source: 'Hóa 11',
      question: 'Thuốc thử đặc hiệu dùng để nhận biết ion sunfat ($SO_4^{2-}$) trong dung dịch là muối của ion:',
      options: ['A. Ag⁺', 'B. Ba²⁺', 'C. Ca²⁺', 'D. Mg²⁺'],
      correctIndex: 1,
      explanation: '$Ba^{2+} + SO_4^{2-} \\to BaSO_4\\downarrow$ kết tủa trắng bền không tan trong acid mạnh.'
    },
    essay: {
      source: 'Hóa 11 · Oleum',
      question: 'Hòa tan $3{,}38\\text{ g}$ oleum $H_2SO_4\\cdot 3SO_3$ vào nước rồi trung hòa bằng dung dịch NaOH $1\\text{ M}$. Tính thể tích NaOH cần dùng.',
      solutionSteps: ['$M_{\\text{oleum}} = 98 + 3 \\times 80 = 338\\text{ g/mol} \\Rightarrow n_{\\text{oleum}} = 0{,}01\\text{ mol}$.', 'Khi hòa tan vào nước tạo $1 + 3 = 4$ mol $H_2SO_4$ ứng với 1 mol oleum $\\Rightarrow n_{\\text{H}_2\\text{SO}_4} = 0{,}04\\text{ mol}$.', '$n_{\\text{NaOH}} = 2 \\times 0{,}04 = 0{,}08\\text{ mol} \\Rightarrow V = 80\\text{ mL}$.'],
      finalAnswer: '80 mL NaOH 1M'
    }
  }),
  makeChemLesson({
    id: 'chem-11-5',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Hóa học 11',
    sourceTag: 'Hóa 11 · Đại cương Hóa học Hữu cơ',
    lessonNumber: 5,
    title: 'Nhóm chức, Phổ Hồng ngoại (IR), Phổ Khối (MS) & Tách chất',
    subtitle: 'Chiết, kết tinh, chưng cất, sắc kí cột và xác định công thức phân tử qua phổ MS (M⁺) và IR',
    description: 'Đọc thành thạo phổ hồng ngoại IR nhận diện nhóm -OH (~3300 cm⁻¹), C=O (~1700 cm⁻¹) và đỉnh ion phân tử M⁺ trên phổ khối lượng MS.',
    theory1Heading: '1. Phương pháp tách biệt & tinh chế chất hữu cơ',
    theory1: '• **Chưng cất**: tách chất lỏng có nhiệt độ sôi khác nhau (như ancol–nước).\n• **Chiết**: tách chất bằng hai dung môi không trộn lẫn (chiết lỏng–lỏng hoặc chiết rắn–lỏng).\n• **Kết tinh lại**: dựa vào độ tan thay đổi theo nhiệt độ.',
    theory2Heading: '2. Phổ IR & Phổ MS xác định cấu trúc',
    theory2: '• Trên phổ MS, pic có giá trị $m/z$ lớn nhất thường ứng với phân tử khối $M$ của chất.\n• Trên phổ IR: dải tù rộng $3600–3200\\text{ cm}^{-1}$ là nhóm $-OH$; pic nhọn mạnh $1750–1680\\text{ cm}^{-1}$ là nhóm $C=O$.',
    keyFormulas: [
      'C_xH_yO_z: \\frac{x}{\\frac{\\%C}{12}} = \\frac{y}{\\frac{\\%H}{1}} = \\frac{z}{\\frac{\\%O}{16}}',
      'k = \\frac{2C + 2 - H + N}{2}\\text{ (Độ bất bão hòa)}'
    ],
    sim2d: 'ir_ms_spectroscopy_2d',
    sim3d: 'spectroscopy_prism_3d',
    mcq1: {
      source: 'Hóa 11 · GDPT 2018',
      question: 'Trên phổ hồng ngoại (IR) của một hợp chất hữu cơ X thấy xuất hiện tín hiệu hấp thụ mạnh, sắc nét ở $1715\\text{ cm}^{-1}$ và không có dải tù ở $3300\\text{ cm}^{-1}$. X nhiều khả năng chứa nhóm chức nào?',
      options: ['A. Ancol (-OH)', 'B. Ketone / Ester / Aldehyde (C=O)', 'C. Ankan chỉ có C-H', 'D. Amin bậc 1 (-NH₂)'],
      correctIndex: 1,
      explanation: 'Số sóng đặc trưng của liên kết đôi $C=O$ nằm trong vùng $1680–1750\\text{ cm}^{-1}$.'
    },
    mcq2: {
      source: 'Hóa 11 · GDPT 2018',
      question: 'Phân tích nguyên tố hợp chất X thu được $54{,}54\\%$ C, $9{,}09\\%$ H, còn lại là O. Phổ MS cho pic ion phân tử $[M^+]$ có $m/z = 88$. Công thức phân tử của X là:',
      options: ['A. C₂H₄O', 'B. C₃H₆O₂', 'C. C₄H₈O₂', 'D. C₄H₁₀O'],
      correctIndex: 2,
      explanation: '$x:y:z = \\frac{54{,}54}{12} : \\frac{9{,}09}{1} : \\frac{36{,}37}{16} = 4{,}545 : 9{,}09 : 2{,}273 = 2:4:1 \\Rightarrow (C_2H_4O)_n$. Với $M=88 \\Rightarrow 44n=88 \\Rightarrow n=2 \\Rightarrow C_4H_8O_2$.'
    },
    essay: {
      source: 'Hóa 11',
      question: 'Ngâm rễ/vỏ cây thảo dược trong cồn $70^\\circ$ để thu lấy hoạt chất là phương pháp tách nào? Giải thích cơ sở khoa học.',
      solutionSteps: ['Đó là phương pháp **chiết lỏng – rắn**.', 'Dung môi hữu cơ (etanol/nước) thấm vào mô thực vật, hòa tan chọn lọc các hợp chất hữu cơ tan tốt hơn trong dung môi rồi lọc bỏ bã rắn.'],
      finalAnswer: 'Phương pháp chiết lỏng – rắn'
    }
  }),
  makeChemLesson({
    id: 'chem-11-6',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Hóa học 11',
    sourceTag: 'Hóa 11 · Alkane',
    lessonNumber: 6,
    title: 'Alkane (CₙH₂ₙ₊₂): Đồng phân, Danh pháp IUPAC & Cracking',
    subtitle: 'Gọi tên mạch nhánh chuẩn IUPAC, phản ứng thế halogen (clo hóa có quy luật bậc C) và phản ứng cracking dầu mỏ',
    description: 'Nắm vững quy tắc chọn mạch chính dài nhất, đánh số gần nhánh nhất và dự đoán sản phẩm thế chính trên bậc cacbon cao.',
    theory1Heading: '1. Đồng phân và Danh pháp thay thế IUPAC',
    theory1: '• Chọn mạch C dài nhất, nhiều nhánh nhất làm mạch chính.\n• Đánh số sao cho tổng chỉ số vị trí các nhánh nhỏ nhất.\n• Tên: [Vị trí–Tên nhánh theo ABC] + [Tên mạch chính] + **ane**.',
    theory2Heading: '2. Phản ứng thế Halogen & Cracking',
    theory2: '• Thế nguyên tử H ở cacbon bậc cao hơn dễ xảy ra hơn (ưu tiên bậc III > bậc II > bậc I).\n• Cracking: bẻ gãy ankan mạch dài thành ankan ngắn hơn + anken: $\\text{C}_n\\text{H}_{2n+2} \\to \\text{C}_a\\text{H}_{2a+2} + \\text{C}_b\\text{H}_{2b}$.',
    keyFormulas: [
      '\\text{C}_n\\text{H}_{2n+2} + \\frac{3n+1}{2}\\text{O}_2 \\to n\\text{CO}_2 + (n+1)\\text{H}_2\\text{O}',
      'n_{\\text{ankan}} = n_{\\text{H}_2\\text{O}} - n_{\\text{CO}_2}'
    ],
    sim2d: 'hydrocarbon_isomers_2d',
    sim3d: 'methane_ethane_3d',
    mcq1: {
      source: 'Hóa 11',
      question: 'Số đồng phân cấu tạo của ankan có công thức phân tử $C_5H_{12}$ là:',
      options: ['A. 2', 'B. 3', 'C. 4', 'D. 5'],
      correctIndex: 1,
      explanation: '$C_5H_{12}$ có 3 đồng phân cấu tạo: pentane, 2-methylbutane (isopentane), và 2,2-dimethylpropane (neopentane).'
    },
    mcq2: {
      source: 'Hóa 11',
      question: 'Cho 2-methylbutane phản ứng thế với $Cl_2$ (tỉ lệ 1:1, chiếu sáng). Có thể thu được tối đa bao nhiêu dẫn xuất monoclo?',
      options: ['A. 2', 'B. 3', 'C. 4', 'D. 5'],
      correctIndex: 2,
      explanation: '$(CH_3)_2CH-CH_2-CH_3$ có 4 vị trí H không tương đương nhau nên tạo tối đa 4 dẫn xuất monoclo (sản phẩm chính thế ở C bậc III).'
    },
    essay: {
      source: 'Hóa 11 · Đốt cháy Ankan',
      question: 'Đốt cháy hoàn toàn một ankan X thu được $0{,}4\\text{ mol } CO_2$ và $0{,}5\\text{ mol } H_2O$. Xác định công thức phân tử X và gọi tên các đồng phân của X.',
      solutionSteps: ['$n_{\\text{ankan}} = n_{\\text{H}_2\\text{O}} - n_{\\text{CO}_2} = 0{,}5 - 0{,}4 = 0{,}1\\text{ mol}$.', 'Số nguyên tử C: $n = 0{,}4 / 0{,}1 = 4 \\Rightarrow C_4H_{10}$.', 'Gồm 2 đồng phân: butane và 2-methylpropane (isobutane).'],
      finalAnswer: 'C₄H₁₀ (butane & 2-methylpropane)'
    }
  }),
  makeChemLesson({
    id: 'chem-11-7',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Hóa học 11',
    sourceTag: 'Hóa 11 · Alkene & Alkyne',
    lessonNumber: 7,
    title: 'Alkene, Alkyne, Đồng phân Hình học cis/trans & Markovnikov',
    subtitle: 'Điều kiện đồng phân cis-trans, quy tắc cộng Markovnikov, và phản ứng thế H linh động đầu mạch C≡CH với AgNO₃/NH₃',
    description: 'Phân biệt chính xác alkane – alkene – alk-1-yne bằng nước brom và dung dịch $\\text{AgNO}_3/\\text{NH}_3$.',
    theory1Heading: '1. Đồng phân hình học cis – trans & Quy tắc Markovnikov',
    theory1: '• $a b C=C c d$ có đồng phân hình học khi $a \\ne b$ và $c \\ne d$.\n• **Quy tắc Markovnikov**: Khi cộng $HX$ ($HBr, HCl, H_2O$) vào anken bất đối xứng, $H^+$ cộng vào C bậc thấp (nhiều H hơn), còn $X^-$ cộng vào C bậc cao (ít H hơn).',
    theory2Heading: '2. Alkyne & Phản ứng đặc trưng của Alk-1-yne',
    theory2: '• Liên kết $C\\equiv CH$ có nguyên tử H linh động dễ thế bởi $Ag^+$ tạo kết tủa vàng nhạt:\n  $$\\text{HC}\\equiv\\text{CH} + 2\\text{AgNO}_3 + 2\\text{NH}_3 \\to \\text{AgC}\\equiv\\text{CAg}\\downarrow + 2\\text{NH}_4\\text{NO}_3$$',
    keyFormulas: [
      '\\text{CH}_3-\\text{CH}=\\text{CH}_2 + \\text{HBr} \\to \\text{CH}_3-\\text{CHBr}-\\text{CH}_3\\text{ (Chính)}',
      '\\text{R}-\\text{C}\\equiv\\text{CH} + [\\text{Ag}(\\text{NH}_3)_2]\\text{OH} \\to \\text{R}-\\text{C}\\equiv\\text{CAg}\\downarrow\\text{ (vàng)}'
    ],
    sim2d: 'alkene_addition_2d',
    sim3d: 'alkene_addition_3d',
    mcq1: {
      source: 'Hóa 11 · GDPT 2018',
      question: 'Chất nào sau đây có đồng phân hình học (cis–trans)?',
      options: ['A. Propene (CH₂=CH-CH₃)', 'B. But-1-ene (CH₂=CH-CH₂-CH₃)', 'C. But-2-ene (CH₃-CH=CH-CH₃)', 'D. 2-methylpropene'],
      correctIndex: 2,
      explanation: 'But-2-ene có hai nhóm thế khác nhau ($H$ và $CH_3$) ở mỗi cacbon nối đôi nên tồn tại dạng cis-but-2-ene và trans-but-2-ene.'
    },
    mcq2: {
      source: 'Hóa 11',
      question: 'Ankin nào sau đây KHÔNG phản ứng với dung dịch $AgNO_3/NH_3$ tạo kết tủa vàng?',
      options: ['A. Ethyne (CH≡CH)', 'B. Propyne (CH≡C-CH₃)', 'C. But-1-yne', 'D. But-2-yne (CH₃-C≡C-CH₃)'],
      correctIndex: 3,
      explanation: 'But-2-yne không có nguyên tử H gắn trực tiếp vào C mang liên kết ba nên không tạo kết tủa bạc axetilua.'
    },
    essay: {
      source: 'Hóa 11',
      question: 'Sục $4{,}958\\text{ L}$ khí acetylene $C_2H_2$ (ĐKC) vào dung dịch $AgNO_3/NH_3$ dư. Tính khối lượng kết tủa vàng thu được.',
      solutionSteps: ['$n_{\\text{C}_2\\text{H}_2} = 4{,}958 / 24{,}79 = 0{,}2\\text{ mol}$.', 'Tạo bạc axetilua $Ag_2C_2\\downarrow$ ($M = 240$).', '$m_{\\text{Ag}_2\\text{C}_2} = 0{,}2 \\times 240 = 48\\text{ g}$.'],
      finalAnswer: '48 g Ag₂C₂'
    }
  }),
  makeChemLesson({
    id: 'chem-11-8',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Hóa học 11',
    sourceTag: 'Hóa 11 · Arene, Dẫn xuất Halogen, Alcohol & Phenol',
    lessonNumber: 8,
    title: 'Arene (Benzen, Toluen), Dẫn xuất Halogen, Alcohol & Phenol',
    subtitle: 'Vòng thơm liên hợp π, bậc ancol & oxi hóa bởi CuO, và tính acid yếu của phenol phản ứng với Br₂',
    description: 'Tổng hợp liên hoàn nhóm thơm, tách nước tạo anken theo quy tắc Zaitsev và phân biệt etanol – glixerol – phenol.',
    theory1Heading: '1. Vòng thơm Benzen & Toluen',
    theory1: '• Benzen dễ thế hơn cộng (nhờ hệ 6e $\\pi$ giải tỏa bền vững).\n• Toluen có nhóm $-CH_3$ đẩy e làm hoạt hóa vòng $\\Rightarrow$ thế ưu tiên vị trí ortho/para và làm mất màu dung dịch $KMnO_4$ khi đun nóng (tạo kali benzoat).',
    theory2Heading: '2. Alcohol & Phenol (C₆H₅OH)',
    theory2: '• **Alcohol đa chức** có các nhóm -OH liền kề (như glixerol) hòa tan $Cu(OH)_2$ cho dung dịch **xanh lam thẫm**.\n• **Phenol** có tính acid rất yếu (không làm đổi màu quỳ, tan trong NaOH, bị $CO_2$ đẩy ra khỏi muối phenolate) và tạo kết tủa trắng 2,4,6-tribromophenol ngay với nước brom.',
    keyFormulas: [
      '\\text{C}_6\\text{H}_5\\text{OH} + 3\\text{Br}_2 \\to \\text{C}_6\\text{H}_2\\text{Br}_3\\text{OH}\\downarrow\\text{ (trắng)} + 3\\text{HBr}',
      '\\text{RCH}_2\\text{OH} + \\text{CuO} \\xrightarrow{t^\\circ} \\text{RCHO} + \\text{Cu} + \\text{H}_2\\text{O}'
    ],
    sim2d: 'benzene_substitution_2d',
    sim3d: 'benzene_pi_3d',
    mcq1: {
      source: 'Hóa 11 · GDPT 2018',
      question: 'Ba lọ mất nhãn chứa riêng biệt: ethanol, glycerol ($C_3H_5(OH)_3$) và phenol lỏng. Dùng cặp thuốc thử nào nhận biết cả 3 chất?',
      options: ['A. Quỳ tím và Na', 'B. Cu(OH)₂ ở nhiệt độ thường và nước Brom', 'C. Dung dịch NaCl và CaCO₃', 'D. Khí H₂ và CuO'],
      correctIndex: 1,
      explanation: 'Glycerol hòa tan $Cu(OH)_2$ tạo phức xanh lam thẫm; Phenol tạo kết tủa trắng tức thì với nước $Br_2$; Ethanol không tạo hai hiện tượng đó.'
    },
    mcq2: {
      source: 'Hóa 11',
      question: 'Đun nóng butan-2-ol với $H_2SO_4$ đặc ở $170^\\circ\\text{C}$, theo quy tắc Zaitsev sản phẩm chính thu được là:',
      options: ['A. But-1-ene', 'B. But-2-ene', 'C. Đibutil ete', 'D. Butane'],
      correctIndex: 1,
      explanation: 'Quy tắc tách nước Zaitsev: nhóm -OH tách cùng với H ở cacbon bậc cao hơn bên cạnh để tạo anken thế nhiều nhất (but-2-ene).'
    },
    essay: {
      source: 'Hóa 11',
      question: 'Cho $18{,}8\\text{ g}$ phenol tác dụng vừa đủ với dung dịch nước brom $20\\%$. Tính khối lượng kết tủa trắng 2,4,6-tribromophenol tạo thành.',
      solutionSteps: ['$n_{\\text{phenol}} = 18{,}8 / 94 = 0{,}2\\text{ mol}$.', 'Tạo $0{,}2\\text{ mol}$ kết tủa $C_6H_2Br_3OH$ ($M = 331$).', '$m_{\\text{kết tủa}} = 0{,}2 \\times 331 = 66{,}2\\text{ g}$.'],
      finalAnswer: '66,2 g kết tủa trắng'
    }
  }),
  makeChemLesson({
    id: 'chem-11-9',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2018 · Hóa học 11',
    sourceTag: 'Hóa 11 · Aldehyde – Ketone – Carboxylic Acid',
    lessonNumber: 9,
    title: 'Hợp chất Carbonyl (Aldehyde, Ketone) & Carboxylic Acid',
    subtitle: 'Phản ứng tráng bạc Tollens, phản ứng tạo iodoform CHI₃ và lực acid RCOOH',
    description: 'Phân biệt aldehyde (R-CHO) với ketone (R-CO-R\') và các yếu tố hút/đẩy electron ảnh hưởng độ mạnh carboxylic acid.',
    theory1Heading: '1. Aldehyde & Ketone (Nhóm C=O)',
    theory1: '• **Aldehyde** ($-CHO$) khử $Ag^+$ trong thuốc thử Tollens tạo Ag sáng, khử $Cu(OH)_2/OH^-$ đun nóng tạo kết tủa đỏ gạch $Cu_2O$ (riêng $HCHO$ cho tỉ lệ $1:4$ Ag).\n• Ketone nhóm $CH_3-CO-R$ (và ethanol/etanal) cho phản ứng iodoform tạo kết tủa vàng $CHI_3$.',
    theory2Heading: '2. Carboxylic Acid (R-COOH)',
    theory2: '• Là acid yếu nhưng mạnh hơn $H_2CO_3$ nên đẩy được khí $CO_2$ khỏi muối cacbonat ($Na_2CO_3, CaCO_3$).\n• Nhóm hút electron ($-Cl, -F$) làm tăng tính acid; nhóm đẩy e ($-CH_3$) làm giảm tính acid ($HCOOH > CH_3COOH$).',
    keyFormulas: [
      '\\text{RCHO} + 2[\\text{Ag}(\\text{NH}_3)_2]\\text{OH} \\xrightarrow{t^\\circ} \\text{RCOONH}_4 + 2\\text{Ag}\\downarrow + 3\\text{NH}_3 + \\text{H}_2\\text{O}',
      '\\text{HCHO} \\to 4\\text{Ag}\\downarrow'
    ],
    sim2d: 'carbonyl_alcohol_2d',
    sim3d: 'carbonyl_alcohol_3d',
    mcq1: {
      source: 'Hóa 11 · GDPT 2018',
      question: 'Sục $0{,}1\\text{ mol}$ khí methanal ($HCHO$) vào lượng dư dung dịch $AgNO_3/NH_3$ đun nóng. Khối lượng Ag thu được là:',
      options: ['A. 10,8 g', 'B. 21,6 g', 'C. 43,2 g', 'D. 32,4 g'],
      correctIndex: 2,
      explanation: 'Methanal (andehit fomic) tương đương có hai đầu $-CHO$ nên 1 mol $HCHO$ tạo ra 4 mol Ag: $0{,}4 \\times 108 = 43{,}2\\text{ g}$.'
    },
    mcq2: {
      source: 'Hóa 11',
      question: 'Cặp chất nào sau đây đều tham gia phản ứng tạo kết tủa vàng iodoform ($CHI_3$) với $I_2/NaOH$?',
      options: ['A. Methanol và Propanal', 'B. Ethanal (CH₃CHO) và Propanone (CH₃COCH₃)', 'C. Formic acid và Benzoic acid', 'D. Formaldehyde và Methanol'],
      correctIndex: 1,
      explanation: 'Các hợp chất có nhóm $CH_3-CO-$ hoặc $CH_3-CH(OH)-$ đều tạo kết tủa vàng $CHI_3$ trong $I_2/NaOH$.'
    },
    essay: {
      source: 'Hóa 11',
      question: 'Sắp xếp các acid sau theo thứ tự tăng dần lực acid: $CH_3COOH$, $HCOOH$, $ClCH_2COOH$, $C_2H_5COOH$. Giải thích ngắn gọn.',
      solutionSteps: ['Nhóm đẩy e ($-C_2H_5, -CH_3$) làm tăng mật độ electron trên $-COO^-$, giảm sự phân li $H^+ \\Rightarrow C_2H_5COOH < CH_3COOH < HCOOH$.', 'Nguyên tử Cl có độ âm điện lớn rút electron theo hiệu ứng cảm ứng làm tăng bền anion $\\Rightarrow ClCH_2COOH$ mạnh nhất.'],
      finalAnswer: 'C₂H₅COOH < CH₃COOH < HCOOH < ClCH₂COOH'
    }
  }),

  // ==================== HÓA HỌC 12 (GDPT 2018) ====================
  makeChemLesson({
    id: 'chem-12-1',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Hóa học 12',
    sourceTag: 'Hóa 12 · Chương 1: Ester – Lipid – Xà phòng',
    lessonNumber: 1,
    title: 'Ester, Chất béo (Triglyceride) & Xà phòng – Mixen',
    subtitle: 'Phản ứng thủy phân thuận nghịch vs xà phòng hóa 1 chiều, hiđro hóa dầu thực vật và cơ chế giặt rửa mixen',
    description: 'Nắm trọn chuyên đề Ester – Lipid trọng tâm kỳ thi THPT: bảo toàn khối lượng xà phòng hóa và tính chất lưỡng cực của hạt mixen.',
    theory1Heading: '1. Thủy phân Ester trong Acid vs Kiềm',
    theory1: '• Trong môi trường acid: phản ứng **thuận nghịch** tạo acid và ancol.\n• Trong môi trường kiềm (xà phòng hóa): phản ứng **một chiều** tạo muối $RCOONa$ và ancol (hoặc anđehit/xeton/muối phenolat đối với este đặc biệt).',
    theory2Heading: '2. Lipid & Chất giặt rửa',
    theory2: '• Chất béo là trieste của glycerol và các acid béo ($C_{15}H_{31}COOH, C_{17}H_{35}COOH$ no; $C_{17}H_{33}COOH, C_{17}H_{31}COOH$ không no).\n• Phản ứng $1\\text{ mol}$ chất béo + $3\\text{ mol NaOH} \\to \\text{xà phòng} + 1\\text{ mol glycerol}$.',
    keyFormulas: [
      '(R\\text{COO})_3\\text{C}_3\\text{H}_5 + 3\\text{NaOH} \\xrightarrow{t^\\circ} 3R\\text{COONa} + \\text{C}_3\\text{H}_5(\\text{OH})_3',
      'm_{\\text{chất béo}} + m_{\\text{NaOH}} = m_{\\text{muối}} + m_{\\text{glixerol}}'
    ],
    sim2d: 'soap_micelle_2d',
    sim3d: 'colloid_micelle_3d',
    mcq1: {
      source: 'Hóa 12 · GDPT 2018',
      question: 'Thủy phân este nào sau đây trong dung dịch NaOH đun nóng thu được anđehit?',
      options: ['A. CH₃COOC₂H₅', 'B. CH₃COOCH=CH₂ (vinyl axetat)', 'C. HCOOCH₃', 'D. CH₃COOC₆H₅'],
      correctIndex: 1,
      explanation: '$\\text{CH}_3\\text{COOCH}=\\text{CH}_2 + \\text{NaOH} \\to \\text{CH}_3\\text{COONa} + \\text{CH}_3\\text{CHO}$ (do ancol vinylic không bền chuyển hóa thành axetanđehit).'
    },
    mcq2: {
      source: 'Hóa 12 · THPT Quốc gia',
      question: 'Xà phòng hóa hoàn toàn $17{,}8\\text{ g}$ tristearin $(C_{17}H_{35}COO)_3C_3H_5$ ($M=890$) bằng lượng vừa đủ NaOH thu được khối lượng xà phòng (natri stearat) là:',
      options: ['A. 18,36 g', 'B. 18,00 g', 'C. 6,12 g', 'D. 19,20 g'],
      correctIndex: 0,
      explanation: '$n_{\\text{tristearin}} = 17{,}8/890 = 0{,}02\\text{ mol} \\Rightarrow n_{\\text{NaOH}} = 0{,}06$, $n_{\\text{glixerol}} = 0{,}02$. Bảo toàn khối lượng: $17{,}8 + 0{,}06\\times 40 - 0{,}02\\times 92 = 18{,}36\\text{ g}$.'
    },
    essay: {
      source: 'Hóa 12',
      question: 'Vì sao xà phòng giảm tác dụng tẩy rửa trong nước cứng (nhiều $Ca^{2+}, Mg^{2+}$) trong khi chất giặt rửa tổng hợp vẫn hoạt động tốt?',
      solutionSteps: ['Ion $RCOO^-$ của xà phòng phản ứng với $Ca^{2+}, Mg^{2+}$ tạo kết tủa muối canxi/magie $(RCOO)_2Ca$ bám lên vải và mất chất hoạt động bề mặt.', 'Chất giặt rửa tổng hợp chứa đầu sunfat ($-OSO_3^-$) hoặc sunfonat ($-SO_3^-$) tạo muối canxi/magie vẫn tan được trong nước.'],
      finalAnswer: 'Xà phòng tạo kết tủa với Ca²⁺/Mg²⁺, chất giặt rửa tổng hợp thì không'
    }
  }),
  makeChemLesson({
    id: 'chem-12-2',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Hóa học 12',
    sourceTag: 'Hóa 12 · Chương 2: Carbohydrate',
    lessonNumber: 2,
    title: 'Carbohydrate: Glucose, Fructose, Saccharose, Tinh bột & Cellulose',
    subtitle: 'Cấu dạng mạch vòng α/β, phản ứng tráng bạc, phức đồng xanh lam và thủy phân polisaccarit',
    description: 'Phân biệt chính xác tính khử, liên kết α-1,4 vs β-1,4 glycoside và tính toán lên men ethanol từ tinh bột/xenlulozơ.',
    theory1Heading: '1. Monosaccharide & Disaccharide',
    theory1: '• **Glucose & Fructose** ($C_6H_{12}O_6$): đều hòa tan $Cu(OH)_2$ tạo phức xanh lam và tráng bạc ($1\\text{ mol} \\to 2\\text{ mol Ag}$); **chỉ Glucose** làm mất màu nước brom (nhờ nhóm $-CHO$).\n• **Saccharose** ($C_{12}H_{22}O_{11}$): hòa tan $Cu(OH)_2$ nhưng **không tráng bạc** do không còn nhóm $-OH$ hemiaxetal tự do.',
    theory2Heading: '2. Tinh bột & Cellulose ((C₆H₁₀O₅)ₙ)',
    theory2: '• Tinh bột gồm amilozơ xoắn lò xo (tạo màu xanh tím với $I_2$) và amilopectin phân nhánh.\n• Cellulose mạch thẳng không phân nhánh, tạo bởi gốc $\\beta$-glucose, không tan trong nước nhưng tan trong nước Schweizer.',
    keyFormulas: [
      '(\\text{C}_6\\text{H}_{10}\\text{O}_5)_n \\xrightarrow{+n\\text{H}_2\\text{O}} n\\text{C}_6\\text{H}_{12}\\text{O}_6 \\xrightarrow{\\text{men}} 2n\\text{C}_2\\text{H}_5\\text{OH} + 2n\\text{CO}_2'
    ],
    sim2d: 'carbohydrate_ring_2d',
    sim3d: 'carbohydrate_ring_3d',
    mcq1: {
      source: 'Hóa 12',
      question: 'Thuốc thử duy nhất để phân biệt hai dung dịch Glucose và Fructose là:',
      options: ['A. Cu(OH)₂ ở nhiệt độ thường', 'B. AgNO₃/NH₃ đun nóng', 'C. Dung dịch nước Brom (Br₂)', 'D. Na kim loại'],
      correctIndex: 2,
      explanation: 'Glucose có nhóm $-CHO$ oxi hóa được bởi nước brom làm mất màu nâu đỏ của $Br_2$, còn Fructose thì không phản ứng với $Br_2$.'
    },
    mcq2: {
      source: 'Hóa 12',
      question: 'Lên men $90\\text{ g}$ glucose tạo ethanol với hiệu suất $80\\%$. Khối lượng ethanol thu được là:',
      options: ['A. 36,8 g', 'B. 46,0 g', 'C. 23,0 g', 'D. 38,4 g'],
      correctIndex: 0,
      explanation: '$n_{\\text{glucose}} = 90/180 = 0{,}5\\text{ mol} \\Rightarrow n_{\\text{C}_2\\text{H}_5\\text{OH}} = 2 \\times 0{,}5 \\times 0{,}8 = 0{,}8\\text{ mol} \\Rightarrow m = 0{,}8 \\times 46 = 36{,}8\\text{ g}$.'
    },
    essay: {
      source: 'Hóa 12 · Xenlulozơ trinitrat',
      question: 'Từ $16{,}2\\text{ kg}$ cellulose tác dụng với lượng dư $HNO_3$ đặc (xúc tác $H_2SO_4$ đặc, hiệu suất $90\\%$), thu được bao nhiêu kg thuốc súng không khói cellulose trinitrate?',
      solutionSteps: ['$C_6H_7O_2(OH)_3 + 3HNO_3 \\to C_6H_7O_2(ONO_2)_3 + 3H_2O$.', '$M_{\\text{mắt xích cellulose}} = 162$; $M_{\\text{cellulose trinitrate}} = 297$.', '$m_{\\text{sp}} = \\frac{16{,}2}{162} \\times 297 \\times 0{,}9 = 26{,}73\\text{ kg}$.'],
      finalAnswer: '26,73 kg cellulose trinitrate'
    }
  }),
  makeChemLesson({
    id: 'chem-12-3',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Hóa học 12',
    sourceTag: 'Hóa 12 · Chương 3: Hợp chất chứa Nitrogen',
    lessonNumber: 3,
    title: 'Amine, Amino Acid (Lưỡng tính – Điện di) & Peptide – Protein',
    subtitle: 'Lực base của amin, ion lưỡng cực amino axit di chuyển trong điện trường và phản ứng màu Biuret',
    description: 'Dự đoán chiều di chuyển điện di của Glycine, Acid Glutamic, Lysine theo pH và viết nhanh thủy phân tripeptide/tetrapeptide.',
    theory1Heading: '1. Amine & Tính base của nhóm -NH₂',
    theory1: '• Tính base: amin béo bậc 2 > bậc 1 > $NH_3$ > anilin ($C_6H_5NH_2$ rất yếu không làm đổi màu quỳ).\n• Anilin tạo kết tủa trắng 2,4,6-tribromoanilin với nước brom.',
    theory2Heading: '2. Amino Acid (Ion lưỡng cực) & Peptide',
    theory2: '• Trong dung dịch, amino acid tồn tại ở dạng ion lưỡng cực $H_3N^+-R-COO^-$. Ở $pH < pI$ tích điện dương (chạy về cực âm); ở $pH > pI$ tích điện âm (chạy về cực dương).\n• **Peptide** từ **tripeptide trở lên** (có $\\ge 2$ liên kết $-CO-NH-$) tạo phức **màu tím** với $Cu(OH)_2$ (phản ứng Biuret).',
    keyFormulas: [
      '\\text{Lực base: } (\\text{CH}_3)_2\\text{NH} > \\text{CH}_3\\text{NH}_2 > \\text{NH}_3 > \\text{C}_6\\text{H}_5\\text{NH}_2',
      '\\text{Biuret (tím)}: \\text{Peptide có } \\ge 2\\text{ liên kết peptide} + \\text{Cu(OH)}_2'
    ],
    sim2d: 'amino_acid_zwitterion_2d',
    sim3d: 'amino_peptide_3d',
    mcq1: {
      source: 'Hóa 12 · Điện di',
      question: 'Đặt hỗn hợp 3 amino acid: Glycine ($pI = 6{,}0$), Glutamic acid ($pI = 3{,}2$) và Lysine ($pI = 9{,}7$) lên giấy thấm tẩm đệm $pH = 6{,}0$ rồi nối nguồn điện một chiều. Ion nào dịch chuyển về cực dương (Anode)?',
      options: ['A. Glycine', 'B. Lysine', 'C. Glutamic acid', 'D. Cả ba đứng yên'],
      correctIndex: 2,
      explanation: 'Tại $pH = 6{,}0 > pI_{\\text{Glu}} = 3{,}2$, Glutamic acid nhường $H^+$ thành anion tích điện âm nên bị hút về cực dương (Anode).'
    },
    mcq2: {
      source: 'Hóa 12',
      question: 'Phát biểu nào sau đây SAI về peptide Gly–Ala–Val?',
      options: ['A. Là một tripeptide chứa 2 liên kết peptide', 'B. Có phản ứng màu biuret với Cu(OH)₂ tạo màu tím', 'C. Thủy phân hoàn toàn thu được 3 amino acid', 'D. Không tác dụng với dung dịch HCl'],
      correctIndex: 3,
      explanation: 'Gly–Ala–Val vẫn còn đầu $-NH_2$ tự do và liên kết peptide bị thủy phân trong môi trường acid HCl.'
    },
    essay: {
      source: 'Hóa 12',
      question: 'Cho $15\\text{ g}$ Glycine ($H_2NCH_2COOH$, $M=75$) tác dụng hoàn toàn với dung dịch NaOH dư. Tính khối lượng muối thu được.',
      solutionSteps: ['$n_{\\text{Gly}} = 15/75 = 0{,}2\\text{ mol}$.', '$H_2NCH_2COOH + NaOH \\to H_2NCH_2COONa + H_2O$.', '$M_{\\text{muối}} = 97 \\Rightarrow m_{\\text{muối}} = 0{,}2 \\times 97 = 19{,}4\\text{ g}$.'],
      finalAnswer: '19,4 g H₂NCH₂COONa'
    }
  }),
  makeChemLesson({
    id: 'chem-12-4b',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Hóa học 12',
    sourceTag: 'Hóa 12 · Chương 4: Polymer',
    lessonNumber: 4,
    title: 'Đại cương Polymer: Trùng hợp, Trùng ngưng & Vật liệu mới',
    subtitle: 'Chất dẻo (PE, PVC, PPF), Tơ (Nilon-6,6, Nitron), Cao su lưu hóa và Keo dán – Vật liệu Composite',
    description: 'Phân biệt nhanh phản ứng trùng hợp vs trùng ngưng và nhận diện hệ số polime hóa $n$ khi cắt mạch.',
    theory1Heading: '1. Phân biệt Trùng hợp và Trùng ngưng',
    theory1: '• **Trùng hợp**: Monomer có liên kết đôi $C=C$ hoặc vòng kém bền $\\to$ cộng hợp nối dài thành mạch lớn, **không tách phân tử nhỏ** ($PE, PP, PVC, PS, \\text{tơ nitron}$).\n• **Trùng ngưng**: Monomer có ít nhất 2 nhóm chức phản ứng được $\\to$ kết hợp giải phóng $H_2O$ (Nilon-6,6, tơ lapsan, nhựa PPF).',
    theory2Heading: '2. Cao su & Lưu hóa cao su',
    theory2: '• Cao su thiên nhiên là poliisopren (cấu hình *cis*). Khi đun với lưu huỳnh tạo cầu đisunfua $-S-S-$ khâu mạch thành mạng không gian giúp tăng độ đàn hồi, chịu nhiệt.',
    keyFormulas: [
      'n_{\\text{mắt xích}} = \\frac{M_{\\text{polymer}}}{M_{\\text{mắt xích}}}',
      '\\text{Nilon-6,6}: (-\\text{NH}-(CH_2)_6-\\text{NH}-\\text{CO}-(CH_2)_4-\\text{CO}-)_n'
    ],
    sim2d: 'polymerization_2d',
    sim3d: 'polymer_chain_3d',
    mcq1: {
      source: 'Hóa 12 · GDPT 2018',
      question: 'Polymer nào sau đây được điều chế bằng phản ứng **trùng ngưng**?',
      options: ['A. Poli(vinyl clorua) (PVC)', 'B. Polietilen (PE)', 'C. Nilon-6,6', 'D. Polistiren (PS)'],
      correctIndex: 2,
      explanation: 'Nilon-6,6 được tổng hợp bằng phản ứng trùng ngưng giữa hexametylenđiamin và axit ađipic có tách $H_2O$.'
    },
    mcq2: {
      source: 'Hóa 12',
      question: 'Một đoạn mạch PVC có phân tử khối là $312500\\text{ amu}$. Hệ số polymer hóa $n$ của đoạn mạch đó là (mắt xích $C_2H_3Cl = 62{,}5$):',
      options: ['A. 3000', 'B. 4000', 'C. 5000', 'D. 6000'],
      correctIndex: 2,
      explanation: '$n = 312500 / 62{,}5 = 5000$ mắt xích.'
    },
    essay: {
      source: 'Hóa 12',
      question: 'Vì sao chất dẻo PVC có thể tái chế khi đun nóng (nhiệt dẻo) còn nhựa bakelit / cao su lưu hóa thì không (nhiệt rắn)?',
      solutionSteps: ['PVC có cấu trúc mạch thẳng không phân nhánh, các mạch chỉ hút nhau bằng lực van der Waals nên nóng chảy được khi gia nhiệt.', 'Nhựa bakelit và cao su lưu hóa có cấu trúc **mạng không gian 3D** nối bằng các liên kết cộng hóa trị bền vững, không thể chảy dẻo mà chỉ bị phân hủy ở nhiệt độ rất cao.'],
      finalAnswer: 'Mạch thẳng (nhiệt dẻo) vs Mạng không gian (nhiệt rắn)'
    }
  }),
  makeChemLesson({
    id: 'chem-12-4',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Hóa học 12',
    sourceTag: 'Hóa 12 · Chương 5: Pin điện & Thế điện cực chuẩn',
    lessonNumber: 5,
    title: 'Thế điện cực chuẩn E° & Pin điện hóa (Galvani)',
    subtitle: 'Quy tắc α dự đoán chiều phản ứng oxi hóa khử, cấu tạo Pin Daniell và tính suất điện động E°_pin',
    description: 'Tự lắp ráp bán pin Zn|Zn²⁺ và Cu|Cu²⁺ trong phòng lab ảo 2D/3D để đo thế điện cực chuẩn $E^\\circ_{\\text{pin}}$ và chiều electron.',
    theory1Heading: '1. Cặp oxi hóa – khử & Quy tắc α',
    theory1: '• Giá trị thế điện cực chuẩn $E^\\circ(M^{n+}/M)$ càng lớn thì tính **oxi hóa của $M^{n+}$ càng mạnh**, tính **khử của $M$ càng yếu**.\n• Chất oxi hóa mạnh hơn (cặp $E^\\circ$ lớn) phản ứng với chất khử mạnh hơn (cặp $E^\\circ$ nhỏ).',
    theory2Heading: '2. Pin điện hóa Galvani',
    theory2: '• **Anode (-)**: Kim loại có $E^\\circ$ nhỏ hơn, xảy ra quá trình oxi hóa ($Zn \\to Zn^{2+} + 2e$).\n• **Cathode (+)**: Có $E^\\circ$ lớn hơn, xảy ra quá trình khử ($Cu^{2+} + 2e \\to Cu$).\n• Suất điện động chuẩn: $E^\\circ_{\\text{pin}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}$.',
    keyFormulas: [
      'E^\\circ_{\\text{pin}} = E^\\circ_{\\text{cathode (+)}} - E^\\circ_{\\text{anode (-)}}',
      '\\text{Pin Zn–Cu}: E^\\circ = +0{,}34 - (-0{,}76) = 1{,}10\\text{ V}'
    ],
    sim2d: 'galvanic_cell_2d',
    sim3d: 'galvanic_cell_3d',
    mcq1: {
      source: 'Hóa 12 · GDPT 2018',
      question: 'Cho $E^\\circ(Mg^{2+}/Mg) = -2{,}37\\text{ V}$ và $E^\\circ(Ag^+/Ag) = +0{,}80\\text{ V}$. Suất điện động chuẩn của pin điện hóa Mg – Ag là:',
      options: ['A. 1,57 V', 'B. 3,17 V', 'C. -3,17 V', 'D. 2,37 V'],
      correctIndex: 1,
      explanation: '$E^\\circ_{\\text{pin}} = E^\\circ_{\\text{Ag}^+/\\text{Ag}} - E^\\circ_{\\text{Mg}^{2+}/\\text{Mg}} = 0{,}80 - (-2{,}37) = 3{,}17\\text{ V}$.'
    },
    mcq2: {
      source: 'Hóa 12',
      question: 'Khi pin điện hóa Fe – Cu hoạt động, khẳng định nào sau đây ĐÚNG?',
      options: ['A. Electron di chuyển từ điện cực Cu sang điện cực Fe qua dây dẫn', 'B. Tại cực âm (Anode), thanh Fe bị oxi hóa và mòn dần', 'C. Nồng độ ion Cu²⁺ trong dung dịch tăng dần', 'D. Cầu muối không tham gia cân bằng điện tích'],
      correctIndex: 1,
      explanation: 'Fe ($E^\\circ = -0{,}44\\text{ V}$) làm Anode bị oxi hóa thành $Fe^{2+}$, electron chạy qua dây dẫn sang cực dương Cu để khử $Cu^{2+}$.'
    },
    essay: {
      source: 'Hóa 12 · Thế điện cực',
      question: 'Pin Galvani X–Y có $E^\\circ_{\\text{pin}} = 1{,}10\\text{ V}$, trong đó X là kim loại Zn ($E^\\circ = -0{,}76\\text{ V}$) đóng vai trò Anode. Xác định $E^\\circ$ của bán pin Y và dự đoán kim loại Y.',
      solutionSteps: ['$E^\\circ_{\\text{pin}} = E^\\circ_Y - (-0{,}76) = 1{,}10 \\Rightarrow E^\\circ_Y = +0{,}34\\text{ V}$.', 'Tra bảng thế điện cực chuẩn: $E^\\circ(Cu^{2+}/Cu) = +0{,}34\\text{ V}$.'],
      finalAnswer: '+0,34 V (Đồng Cu)'
    }
  }),
  makeChemLesson({
    id: 'chem-12-5',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Hóa học 12',
    sourceTag: 'Hóa 12 · Chương 5: Điện phân & Định luật Faraday',
    lessonNumber: 6,
    title: 'Điện phân nóng chảy, Điện phân dung dịch & Định luật Faraday',
    subtitle: 'Thứ tự điện phân tại Cathode/Anode, điện phân NaCl màng ngăn và tính lượng chất theo m = AIt/(nF)',
    description: 'Thành thạo thứ tự ưu tiên ion điện phân ở hai điện cực và tính chính xác thời gian dung dịch chuyển pH khi điện phân.',
    theory1Heading: '1. Thứ tự điện phân trong dung dịch (điện cực trơ)',
    theory1: '• Tại **Cathode (-)**: Ion có $E^\\circ$ lớn bị khử trước: $Ag^+ > Fe^{3+} > Cu^{2+} > H^+/H_2O$ (cation $K^+, Na^+, Ca^{2+}, Mg^{2+}, Al^{3+}$ không bị khử trong nước).\n• Tại **Anode (+)**: $I^- > Br^- > Cl^- > OH^-/H_2O$ ($SO_4^{2-}, NO_3^-$ không bị oxi hóa).',
    theory2Heading: '2. Công thức Faraday tính lượng chất điện phân',
    theory2: '• Số mol electron trao đổi: $n_e = \\frac{I \\cdot t}{F}$ với $F = 96500\\text{ C/mol}$.\n• Khối lượng chất thoát ra: $m = \\frac{A \\cdot I \\cdot t}{n \\cdot F}$.',
    keyFormulas: [
      'n_e = \\frac{I\\cdot t}{96500},\\quad m = \\frac{A\\cdot I\\cdot t}{n\\cdot 96500}'
    ],
    sim2d: 'electrolysis_faraday_2d',
    sim3d: 'electrolysis_cell_3d',
    mcq1: {
      source: 'Hóa 12 · Faraday',
      question: 'Điện phân dung dịch $CuSO_4$ với điện cực trơ bằng dòng điện cường độ $I = 5\\text{ A}$ trong $32\\text{ phút } 10\\text{ giây}$ ($1930\\text{ s}$). Khối lượng Cu bám lên Cathode là ($Cu = 64$):',
      options: ['A. 1,6 g', 'B. 3,2 g', 'C. 6,4 g', 'D. 4,8 g'],
      correctIndex: 1,
      explanation: '$n_e = \\frac{5 \\times 1930}{96500} = 0{,}1\\text{ mol} \\Rightarrow n_{\\text{Cu}} = 0{,}1/2 = 0{,}05\\text{ mol} \\Rightarrow m_{\\text{Cu}} = 0{,}05 \\times 64 = 3{,}2\\text{ g}$.'
    },
    mcq2: {
      source: 'Hóa 12',
      question: 'Khi điện phân dung dịch NaCl bão hòa có màng ngăn xốp với điện cực trơ, sản phẩm thu được ở cực âm (Cathode) và cực dương (Anode) lần lượt là:',
      options: ['A. Kim loại Na và khí Cl₂', 'B. Khí H₂ (+ NaOH) và khí Cl₂', 'C. Khí O₂ và khí H₂', 'D. Khí Cl₂ và khí H₂'],
      correctIndex: 1,
      explanation: 'Tại Cathode, $H_2O$ nhận e sinh $H_2\\uparrow + 2OH^-$ (tạo NaOH); tại Anode, $2Cl^- \\to Cl_2\\uparrow + 2e$.'
    },
    essay: {
      source: 'Hóa 12',
      question: 'Điện phân $200\\text{ mL}$ dung dịch hỗn hợp $Cu(NO_3)_2\\ 0{,}2\\text{ M}$ và $AgNO_3\\ 0{,}1\\text{ M}$ với cường độ $I = 1{,}93\\text{ A}$ trong 50 phút. Tính khối lượng kim loại bám ở Cathode.',
      solutionSteps: ['$n_e = \\frac{1{,}93 \\times 3000}{96500} = 0{,}06\\text{ mol}$.', '$n_{\\text{Ag}^+} = 0{,}02\\text{ mol}$ bị khử hết trước (nhận $0{,}02\\text{ mol e}$) cho $m_{\\text{Ag}} = 2{,}16\\text{ g}$.', 'Số mol e còn lại $= 0{,}04\\text{ mol}$ khử $Cu^{2+}$ ($n_{\\text{Cu}^{2+}} = 0{,}04\\text{ mol}$ dư) $\\Rightarrow n_{\\text{Cu}} = 0{,}02\\text{ mol}$ cho $m_{\\text{Cu}} = 1{,}28\\text{ g}$.', 'Tổng khối lượng kim loại = $2{,}16 + 1{,}28 = 3{,}44\\text{ g}$.'],
      finalAnswer: '3,44 g kim loại (Ag + Cu)'
    }
  }),
  makeChemLesson({
    id: 'chem-12-6',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Hóa học 12',
    sourceTag: 'Hóa 12 · Chương 6: Đại cương Kim loại & Ăn mòn',
    lessonNumber: 6,
    title: 'Ăn mòn Kim loại, Bảo vệ Catot & Tái chế Kim loại',
    subtitle: 'Phân biệt ăn mòn hóa học và ăn mòn điện hóa (3 điều kiện cần), bảo vệ vỏ tàu biển bằng thanh kẽm hy sinh',
    description: 'Thực hành thí nghiệm ăn mòn pin cục bộ Fe–C và kiểm chứng cơ chế thanh Zn bảo vệ kết cấu thép.',
    theory1Heading: '1. Ba điều kiện xảy ra Ăn mòn Điện hóa',
    theory1: '1. Có ít nhất 2 điện cực khác nhau về bản chất (kim loại–kim loại hoặc kim loại–phi kim).\n2. Hai điện cực tiếp xúc trực tiếp hoặc qua dây dẫn.\n3. Cùng nhúng trong một dung dịch chất điện li (kể cả không khí ẩm).',
    theory2Heading: '2. Phương pháp chống ăn mòn điện hóa',
    theory2: '• **Bảo vệ bề mặt**: Sơn phủ, mạ crom/niken/thiếc.\n• **Bảo vệ điện hóa (Anode hy sinh)**: Gắn thanh Zn hoặc Mg vào vỏ tàu thép để Zn đóng vai trò cực âm bị ăn mòn thay sắt.',
    keyFormulas: [
      '\\text{Fe–C trong khí ẩm}: \\text{Fe} \\to \\text{Fe}^{2+} + 2e\\text{ (bị ăn mòn)}',
      '\\text{Gắn Zn}: \\text{Zn} \\to \\text{Zn}^{2+} + 2e\\text{ (Fe được bảo vệ)}'
    ],
    sim2d: 'corrosion_protection_2d',
    sim3d: 'metal_corrosion_3d',
    mcq1: {
      source: 'Hóa 12 · GDPT 2018',
      question: 'Trường hợp nào sau đây xảy ra **ăn mòn điện hóa**?',
      options: ['A. Đốt dây sắt trong bình khí oxi khô', 'B. Nhúng thanh Zn tinh khiết vào dung dịch H₂SO₄ loãng', 'C. Để đồ vật bằng gang (hợp kim Fe–C) ngoài không khí ẩm', 'D. Hòa tan dây đồng trong HNO₃ đặc'],
      correctIndex: 2,
      explanation: 'Gang chứa Fe và C tiếp xúc trực tiếp trong lớp màng nước ẩm có hòa tan $CO_2/O_2$ tạo hàng loạt pin điện hóa Fe–C.'
    },
    mcq2: {
      source: 'Hóa 12',
      question: 'Để bảo vệ vỏ tàu biển bằng thép theo phương pháp điện hóa, người ta thường gắn lên vỏ tàu các tấm kim loại nào?',
      options: ['A. Đồng (Cu)', 'B. Kẽm (Zn)', 'C. Bạc (Ag)', 'D. Chì (Pb)'],
      correctIndex: 1,
      explanation: 'Zn có tính khử mạnh hơn Fe ($E^\\circ_{\\text{Zn}} < E^\\circ_{\\text{Fe}}$) nên đóng vai trò cực âm (Anode hy sinh), còn vỏ thép là Cathode được bảo vệ.'
    },
    essay: {
      source: 'Hóa 12',
      question: 'Tại sao khi nhỏ vài giọt dung dịch $CuSO_4$ vào ống nghiệm đang cho hạt Zn tác dụng với $H_2SO_4$ loãng, bọt khí $H_2$ lại thoát ra nhanh hơn rất nhiều?',
      solutionSteps: ['Ban đầu Zn phản ứng với $CuSO_4$ sinh ra đồng đỏ bám ngay lên bề mặt thanh Zn.', 'Cu và Zn tạo thành pin điện hóa ngay trong axit $H_2SO_4$: Zn nhường e chuyển sang Cu, ion $H^+$ nhận e ngay trên bề mặt Cu giúp giải phóng $H_2$ nhanh hơn hẳn ăn mòn hóa học ban đầu.'],
      finalAnswer: 'Hình thành pin điện hóa Zn–Cu tăng tốc phản ứng'
    }
  }),
  makeChemLesson({
    id: 'chem-12-7',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Hóa học 12',
    sourceTag: 'Hóa 12 · Chương 7: Kim loại nhóm IA & IIA, Nước cứng',
    lessonNumber: 7,
    title: 'Kim loại Kiềm (IA), Kiềm thổ (IIA), Độ cứng nước & Phổ ngọn lửa',
    subtitle: 'Tính khử cực mạnh, màu ngọn lửa Li/Na/K/Ca/Ba, phân loại nước cứng tạm thời–vĩnh cửu và làm mềm nước',
    description: 'Nhận diện phổ phát xạ ngọn lửa các ion nhóm IA/IIA và xử lý nước cứng bằng đun sôi hoặc $Na_2CO_3, Na_3PO_4$.',
    theory1Heading: '1. Nhóm IA & IIA – Phản ứng thử ngọn lửa',
    theory1: '• Ngọn lửa: $Li^+$ đỏ tía; $Na^+$ vàng; $K^+$ tím; $Ca^{2+}$ đỏ cam; $Ba^{2+}$ lục vàng.\n• Độ tan $M(OH)_2$ nhóm IIA tăng dần từ $Mg(OH)_2$ (tủa) $\\to Ca(OH)_2$ (ít tan) $\\to Ba(OH)_2$ (tan tốt).',
    theory2Heading: '2. Nước cứng & Cách làm mềm',
    theory2: '• **Tạm thời**: chứa $Ca^{2+}, Mg^{2+}, HCO_3^-$ (làm mềm bằng đun sôi hoặc $Ca(OH)_2$ vừa đủ).\n• **Vĩnh cửu**: chứa $Cl^-, SO_4^{2-}$ (dùng $Na_2CO_3$ hoặc $Na_3PO_4$ hoặc nhựa trao đổi ion).',
    keyFormulas: [
      '\\text{Ca(HCO}_3)_2 \\xrightarrow{t^\\circ} \\text{CaCO}_3\\downarrow + \\text{CO}_2\\uparrow + \\text{H}_2\\text{O}',
      '\\text{Ca}^{2+} + \\text{CO}_3^{2-} \\to \\text{CaCO}_3\\downarrow'
    ],
    sim2d: 'flame_spectroscopy_2d',
    sim3d: 'spectroscopy_prism_3d',
    mcq1: {
      source: 'Hóa 12',
      question: 'Hợp chất nào sau đây làm mềm được cả nước cứng tạm thời và nước cứng vĩnh cửu?',
      options: ['A. HCl', 'B. NaCl', 'C. Na₂CO₃ (hoặc Na₃PO₄)', 'D. MgCl₂'],
      correctIndex: 2,
      explanation: 'Ion $CO_3^{2-}$ kết tủa hoàn toàn $Ca^{2+}$ và $Mg^{2+}$ thành $CaCO_3\\downarrow, MgCO_3\\downarrow$ bất kể anion ban đầu là gì.'
    },
    mcq2: {
      source: 'Hóa 12',
      question: 'Đốt cháy muối natri (NaCl) trên ngọn lửa đèn khí không màu, ngọn lửa xuất hiện màu nào?',
      options: ['A. Tím hoa cà', 'B. Đỏ cam', 'C. Vàng tươi (589 nm)', 'D. Xanh lục'],
      correctIndex: 2,
      explanation: 'Ion $Na^+$ phát xạ vạch kép D đặc trưng ở bước sóng $589\\text{ nm}$ tạo màu vàng rực.'
    },
    essay: {
      source: 'Hóa 12 · Bài toán CO₂ tác dụng kiềm',
      question: 'Sục từ từ $0{,}25\\text{ mol}$ khí $CO_2$ vào dung dịch chứa $0{,}15\\text{ mol } Ca(OH)_2$. Tính khối lượng kết tủa $CaCO_3$ thu được.',
      solutionSteps: ['$n_{\\text{OH}^-} = 0{,}30\\text{ mol}$. Vì $1 < \\frac{n_{\\text{OH}^-}}{n_{\\text{CO}_2}} = 1{,}2 < 2$, tạo hai muối $CO_3^{2-}$ và $HCO_3^-$.', '$n_{\\text{CO}_3^{2-}} = n_{\\text{OH}^-} - n_{\\text{CO}_2} = 0{,}30 - 0{,}25 = 0{,}05\\text{ mol}$.', '$n_{\\text{Ca}^{2+}} = 0{,}15 > 0{,}05 \\Rightarrow n_{\\text{CaCO}_3} = 0{,}05\\text{ mol} \\Rightarrow m = 5{,}0\\text{ g}$.'],
      finalAnswer: '5,0 g CaCO₃'
    }
  }),
  makeChemLesson({
    id: 'chem-12-8',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2018 · Hóa học 12',
    sourceTag: 'Hóa 12 · Chương 8: Kim loại chuyển tiếp & Phức chất',
    lessonNumber: 8,
    title: 'Kim loại Chuyển tiếp dãy 1 (Sc → Zn) & Sơ lược Phức chất',
    subtitle: 'Tính chất nhiều số oxi hóa, màu sắc ion đặc trưng và cách các phân tử nước/amoniac liên kết tạo phức chất',
    description: 'Tìm hiểu trực quan về kim loại chuyển tiếp quen thuộc (Sắt, Đồng, Crom, Mangan) và cấu tạo phức chất xanh lam $[Cu(NH_3)_4(H_2O)_2]^{2+}$.',
    theory1Heading: '1. Khái niệm & Tính chất chung của Kim loại chuyển tiếp dãy 1',
    theory1: '• **Vị trí & Cấu tạo**: Gồm các kim loại chu kì 4 từ Sc ($Z=21$) đến Cu ($Z=29$) có electron điền vào phân lớp $3d$ (thêm Zn ở cuối dãy). Đặc trưng bởi độ cứng cao, nhiệt độ nóng chảy cao và **có nhiều số oxi hóa** (ví dụ Fe có $+2, +3$; Mn có $+2, +4, +7$).\n• **Tính chất nhận biết**: Hợp chất và dung dịch ion thường có **màu sắc rất rực rỡ** ($Cu^{2+}$ xanh lam, $Fe^{3+}$ vàng nâu, $MnO_4^-$ tím thẫm).',
    theory2Heading: '2. Khái niệm Phức chất (Nguyên tử trung tâm & Phối tử)',
    theory2: '• **Cấu tạo đơn giản**: Phức chất gồm một **cation kim loại trung tâm** ở giữa (như $Cu^{2+}, Fe^{2+}, Ag^+$) hút các phân tử hoặc ion nhỏ xung quanh gọi là **phối tử** ($H_2O, NH_3, Cl^-, CN^-$) bằng liên kết cho–nhận.\n• **Hình dạng phổ biến**: Phức 6 phối tử xếp thành hình **bát diện** (như $[Cu(H_2O)_6]^{2+}$), phức 4 phối tử xếp **tứ diện** hoặc **vuông phẳng** (như thuốc thử phức đồng xanh lam thẫm với $NH_3$).',
    keyFormulas: [
      '[\\text{Cu}(\\text{H}_2\\text{O})_6]^{2+} + 4\\text{NH}_3 \\to [\\text{Cu}(\\text{NH}_3)_4(\\text{H}_2\\text{O})_2]^{2+} + 4\\text{H}_2\\text{O}',
      '\\Delta_o = \\frac{hc}{\\lambda}'
    ],
    sim2d: 'complex_ligand_2d',
    sim3d: 'coordination_complex_3d',
    mcq1: {
      source: 'Hóa 12 · GDPT 2018',
      question: 'Trong phức chất bát diện $[Fe(CN)_6]^{4-}$, số oxi hóa của nguyên tử trung tâm Fe và số phối trí của Fe lần lượt là:',
      options: ['A. +2 và 6', 'B. +3 và 6', 'C. +4 và 6', 'D. +2 và 4'],
      correctIndex: 0,
      explanation: 'Mỗi phối tử $CN^-$ mang điện tích $-1$; tổng điện tích phức $= x + 6(-1) = -4 \\Rightarrow x = +2$, có 6 phối tử nên số phối trí là 6.'
    },
    mcq2: {
      source: 'Hóa 12 · GDPT 2018',
      question: 'Khi nhỏ từ từ dung dịch $NH_3$ đến dư vào dung dịch $CuSO_4$, hiện tượng xảy ra là:',
      options: ['A. Chỉ tạo kết tủa xanh không tan', 'B. Tạo kết tủa xanh nhạt Cu(OH)₂, sau đó tan thành dung dịch xanh lam thẫm', 'C. Tạo dung dịch không màu', 'D. Tạo kết tủa đỏ gạch'],
      correctIndex: 1,
      explanation: 'Ban đầu $NH_3 + H_2O$ tạo tủa $Cu(OH)_2$; khi $NH_3$ dư tạo phức $[Cu(NH_3)_4(H_2O)_2]^{2+}$ tan màu xanh lam thẫm.'
    },
    essay: {
      source: 'Hóa 12 · Chuẩn độ KMnO₄',
      question: 'Trong môi trường $H_2SO_4$ loãng, $20{,}0\\text{ mL}$ dung dịch $FeSO_4$ phản ứng vừa đủ với $25{,}0\\text{ mL}$ dung dịch $KMnO_4\\ 0{,}02\\text{ M}$. Tính nồng độ mol của $FeSO_4$.',
      solutionSteps: ['$10\\text{FeSO}_4 + 2\\text{KMnO}_4 + 8\\text{H}_2\\text{SO}_4 \\to 5\\text{Fe}_2(\\text{SO}_4)_3 + \\text{K}_2\\text{SO}_4 + 2\\text{MnSO}_4 + 8\\text{H}_2\\text{O}$.', '$n_{\\text{MnO}_4^-} = 0{,}025 \\times 0{,}02 = 5\\times 10^{-4}\\text{ mol}$.', 'Bảo toàn e: $n_{\\text{Fe}^{2+}} = 5 \\times n_{\\text{MnO}_4^-} = 2{,}5\\times 10^{-3}\\text{ mol} \\Rightarrow C_M = 2{,}5\\times 10^{-3} / 0{,}02 = 0{,}125\\text{ M}$.'],
      finalAnswer: '0,125 M'
    }
  })
];
