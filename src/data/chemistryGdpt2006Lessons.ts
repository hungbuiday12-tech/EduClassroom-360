import { ChemistryLesson } from '../types';
import { makeChemLesson } from './chemistryGdpt2018Lessons';

export const CHEMISTRY_GDPT_2006_LESSONS: ChemistryLesson[] = [
  // ==================== LỚP 9 (GDPT 2006) ====================
  makeChemLesson({
    id: 'chem-2006-9-1',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'GDPT 2006 · Hóa học 9',
    sourceTag: 'SGK Hóa học 9 (2006) · Chương I: Các loại hợp chất vô cơ',
    lessonNumber: 1,
    title: 'Oxit, Axit, Bazơ, Muối & Phân loại – Tính chất Hóa học',
    subtitle: 'Tính chất của oxit bazơ/oxit axit, nhận biết SO₄²⁻, Cl⁻ và điều chế H₂SO₄, NaOH trong công nghiệp',
    description: 'Hệ thống hóa 4 loại hợp chất vô cơ cốt lõi của Hóa 9 (2006): sơ đồ chuyển hóa và phản ứng trao đổi ion.',
    theory1Heading: '1. Oxit Bazơ, Oxit Axit & Sự tạo thành Muối',
    theory1: '• Oxit axit + Kiềm $\\to$ Muối + Nước (chú ý tỉ lệ mol $\\text{CO}_2 / \\text{NaOH}$ tạo muối trung hòa hay axit).\n• Axit mạnh ($HCl, H_2SO_4$ loãng) tác dụng với kim loại trước H, oxit bazơ, bazơ và muối của axit yếu hơn.',
    theory2Heading: '2. Điều kiện Phản ứng Trao đổi trong Dung dịch',
    theory2: '• Phản ứng giữa muối với axit, bazơ hoặc muối khác chỉ xảy ra khi sản phẩm có ít nhất một chất **kết tủa** ($BaSO_4, AgCl, CaCO_3, Cu(OH)_2$), **bay hơi** ($CO_2, SO_2, NH_3$) hoặc **điện li yếu** ($H_2O$).',
    keyFormulas: [
      '\\text{CO}_2 + 2\\text{NaOH} \\to \\text{Na}_2\\text{CO}_3 + \\text{H}_2\\text{O}',
      '\\text{H}_2\\text{SO}_4 + \\text{BaCl}_2 \\to \\text{BaSO}_4\\downarrow + 2\\text{HCl}'
    ],
    sim2d: 'acid_base_titration_2d',
    sim3d: 'titration_bench_3d',
    mcq1: {
      source: 'SGK Hóa 9 (2006)',
      question: 'Cặp chất nào sau đây cùng tồn tại trong một dung dịch (không xảy ra phản ứng trao đổi)?',
      options: ['A. BaCl₂ và Na₂SO₄', 'B. Na₂CO₃ và HCl', 'C. KNO₃ và Na₂SO₄', 'D. CuSO₄ và NaOH'],
      correctIndex: 2,
      explanation: '$KNO_3$ và $Na_2SO_4$ không tạo kết tủa, khí hay nước nên cùng tồn tại bền vững trong dung dịch.'
    },
    mcq2: {
      source: 'Hóa 9 (2006)',
      question: 'Để nhận biết 3 dung dịch $HCl$, $H_2SO_4$, $NaCl$ đựng trong 3 lọ mất nhãn, cặp thuốc thử nhanh nhất là:',
      options: ['A. Quỳ tím và dung dịch BaCl₂', 'B. Phenolphthalein và NaOH', 'C. Dây đồng và AgNO₃', 'D. Nước cất và CaCO₃'],
      correctIndex: 0,
      explanation: 'Quỳ tím hóa đỏ ở HCl và $H_2SO_4$, giữ tím ở NaCl; nhỏ $BaCl_2$ vào hai axit thì $H_2SO_4$ tạo kết tủa trắng $BaSO_4$.'
    },
    essay: {
      source: 'Hóa 9 (2006)',
      question: 'Trung hòa hoàn toàn $200\\text{ g}$ dung dịch $H_2SO_4\\ 9{,}8\\%$ bằng dung dịch KOH $11{,}2\\%$. Tính khối lượng dung dịch KOH cần dùng.',
      solutionSteps: ['$n_{\\text{H}_2\\text{SO}_4} = (200 \\times 0{,}098)/98 = 0{,}2\\text{ mol}$.', '$\\text{H}_2\\text{SO}_4 + 2\\text{KOH} \\to \\text{K}_2\\text{SO}_4 + 2\\text{H}_2\\text{O} \\Rightarrow n_{\\text{KOH}} = 0{,}4\\text{ mol}$.', '$m_{\\text{KOH}} = 0{,}4 \\times 56 = 22{,}4\\text{ g} \\Rightarrow m_{\\text{dd KOH}} = 22{,}4 / 0{,}112 = 200\\text{ g}$.'],
      finalAnswer: '200 g dung dịch KOH 11,2%'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-9-2',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'GDPT 2006 · Hóa học 9',
    sourceTag: 'SGK Hóa học 9 (2006) · Chương II & III: Kim loại & Phi kim',
    lessonNumber: 2,
    title: 'Nhôm (Al), Sắt (Fe), Silic & Bảng Tuần Hoàn Hóa 9',
    subtitle: 'Tính chất lưỡng tính của Al, Al₂O₃, Al(OH)₃; đa hóa trị II–III của Sắt và sản xuất Thủy tinh – Xi măng',
    description: 'Ôn trọn chuyên đề Al – Fe – Phi kim nhóm IVA (C, Si) theo đúng mạch chương II–III Hóa học 9 (2006).',
    theory1Heading: '1. Nhôm (Al) và tính lưỡng tính',
    theory1: '• Al phản ứng được với dung dịch kiềm mạnh: $2\\text{Al} + 2\\text{NaOH} + 2\\text{H}_2\\text{O} \\to 2\\text{NaAlO}_2 + 3\\text{H}_2\\uparrow$.\n• Oxit $Al_2O_3$ và hiđroxit $Al(OH)_3$ là chất lưỡng tính (tan trong cả HCl và NaOH).',
    theory2Heading: '2. Sắt (Fe) & Hợp chất Silic',
    theory2: '• Sắt tác dụng HCl, $H_2SO_4$ loãng tạo muối $Fe(II)$; tác dụng với $Cl_2$, $H_2SO_4$ đặc nóng dư tạo muối $Fe(III)$.\n• Cát trắng ($SiO_2$) tác dụng với $Na_2CO_3, CaCO_3$ ở nhiệt độ cao sản xuất thủy tinh.',
    keyFormulas: [
      '2\\text{Al} + 2\\text{NaOH} + 2\\text{H}_2\\text{O} \\to 2\\text{NaAlO}_2 + 3\\text{H}_2\\uparrow',
      'n_{\\text{khí (ĐKTC 2006)}} = \\frac{V}{22{,}4}'
    ],
    sim2d: 'metal_activity_2d',
    sim3d: 'metal_corrosion_3d',
    mcq1: {
      source: 'Hóa 9 (2006)',
      question: 'Không dùng xô, chậu bằng Nhôm để đựng nước vôi trong ($Ca(OH)_2$) hay dung dịch NaOH vì:',
      options: ['A. Nhôm bị rỉ sét do oxi không khí', 'B. Al₂O₃ và Al đều bị hòa tan bởi dung dịch kiềm giải phóng H₂', 'C. Nhôm đẩy Ca ra khỏi dung dịch kiềm', 'D. Nhôm làm nước vôi hóa đục nhanh hơn'],
      correctIndex: 1,
      explanation: 'Lớp màng bảo vệ $Al_2O_3$ bị hòa tan trong kiềm, sau đó Al kim loại tiếp tục phản ứng giải phóng $H_2$ làm thủng đồ dùng.'
    },
    mcq2: {
      source: 'Hóa 9 (2006)',
      question: 'Hòa tan hết $5{,}4\\text{ g}$ Al trong dung dịch NaOH dư thu được thể tích khí $H_2$ ở ĐKTC ($22{,}4\\text{ L/mol}$) là:',
      options: ['A. 3,36 L', 'B. 4,48 L', 'C. 6,72 L', 'D. 2,24 L'],
      correctIndex: 2,
      explanation: '$n_{\\text{Al}} = 5{,}4/27 = 0{,}2\\text{ mol} \\Rightarrow n_{\\text{H}_2} = 1{,}5 \\times 0{,}2 = 0{,}3\\text{ mol} \\Rightarrow V = 0{,}3 \\times 22{,}4 = 6{,}72\\text{ L}$.'
    },
    essay: {
      source: 'Hóa 9 (2006)',
      question: 'Cho $11\\text{ g}$ hỗn hợp bột Al và Fe tác dụng hoàn toàn với HCl dư thu được $8{,}96\\text{ L}$ khí $H_2$ (ĐKTC). Tính phần trăm khối lượng mỗi kim loại.',
      solutionSteps: ['$n_{\\text{H}_2} = 8{,}96/22{,}4 = 0{,}4\\text{ mol}$.', 'Hệ phương trình: $27x + 56y = 11$ và $1{,}5x + y = 0{,}4 \\Rightarrow x = 0{,}2\\text{ mol Al}$, $y = 0{,}1\\text{ mol Fe}$.', '$m_{\\text{Al}} = 5{,}4\\text{ g } (49{,}09\\%)$, $m_{\\text{Fe}} = 5{,}6\\text{ g } (50{,}91\\%)$.'],
      finalAnswer: '49,09% Al và 50,91% Fe'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-9-3',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'GDPT 2006 · Hóa học 9',
    sourceTag: 'SGK Hóa học 9 (2006) · Chương IV–V: Hiđrocacbon & Dẫn xuất',
    lessonNumber: 3,
    title: 'Axetilen (C₂H₂), Benzen (C₆H₆), Rượu Etylic & Glucozơ',
    subtitle: 'Phản ứng cộng 2 phân tử Br₂ của axetilen, thế Br₂ bột sắt của benzen, thủy phân chất béo & lên men rượu',
    description: 'Hoàn thiện toàn bộ chương IV–V Hóa 9 (2006) với bộ thí nghiệm đốt cháy, làm mất màu brom và tráng gương.',
    theory1Heading: '1. Axetilen (C₂H₂) và Benzen (C₆H₆)',
    theory1: '• $C_2H_2$ có liên kết ba $HC\\equiv CH$: cộng tối đa 2 mol $Br_2$ hoặc 2 mol $H_2$. Điều chế từ đất đèn: $\\text{CaC}_2 + 2\\text{H}_2\\text{O} \\to \\text{C}_2\\text{H}_2\\uparrow + \\text{Ca(OH)}_2$.\n• Benzen không làm mất màu nước brom ở nhiệt độ thường nhưng thế được brom lỏng khi có xúc tác bột Fe, đun nóng.',
    theory2Heading: '2. Rượu Etylic, Axit Axetic, Chất béo & Gluxit',
    theory2: '• Etylic tác dụng Na giải phóng $H_2$; lên men giấm cho axit axetic.\n• Thủy phân chất béo trong kiềm thu được xà phòng + glixerol.',
    keyFormulas: [
      '\\text{CaC}_2 + 2\\text{H}_2\\text{O} \\to \\text{C}_2\\text{H}_2\\uparrow + \\text{Ca(OH)}_2',
      '\\text{C}_6\\text{H}_6 + \\text{Br}_2 \\xrightarrow{\\text{Fe}, t^\\circ} \\text{C}_6\\text{H}_5\\text{Br} + \\text{HBr}'
    ],
    sim2d: 'benzene_substitution_2d',
    sim3d: 'benzene_pi_3d',
    mcq1: {
      source: 'Hóa 9 (2006)',
      question: 'Dẫn khí axetilen ($C_2H_2$) vào dung dịch nước brom dư theo tỉ lệ mol phản ứng tối đa là:',
      options: ['A. 1 : 1', 'B. 1 : 2', 'C. 1 : 3', 'D. 2 : 1'],
      correctIndex: 1,
      explanation: 'Axetilen có 2 liên kết $\\pi$ trong nối ba nên cộng tối đa 2 phân tử $Br_2$ tạo $C_2H_2Br_4$.'
    },
    mcq2: {
      source: 'Hóa 9 (2006)',
      question: 'Dãy chất nào sau đây đều phản ứng được với kim loại Na giải phóng khí $H_2$?',
      options: ['A. C₂H₅OH, CH₃COOH, H₂O', 'B. CH₄, C₂H₄, C₆H₆', 'C. CH₃COOC₂H₅, C₆H₆, H₂O', 'D. C₂H₂, C₂H₄, C₂H₅OH'],
      correctIndex: 0,
      explanation: 'Các chất có nguyên tử H linh động trong nhóm $-OH$ hoặc $-COOH$ đều tác dụng với Na giải phóng $H_2$.'
    },
    essay: {
      source: 'Hóa 9 (2006)',
      question: 'Cho $12{,}8\\text{ g}$ đất đèn chứa $80\\%$ $CaC_2$ nguyên chất tác dụng hoàn toàn với nước dư. Tính thể tích khí $C_2H_2$ thu được ở ĐKTC.',
      solutionSteps: ['$m_{\\text{CaC}_2} = 12{,}8 \\times 0{,}8 = 10{,}24\\text{ g}$.', '$n_{\\text{CaC}_2} = 10{,}24 / 64 = 0{,}16\\text{ mol} = n_{\\text{C}_2\\text{H}_2}$.', '$V_{\\text{C}_2\\text{H}_2} = 0{,}16 \\times 22{,}4 = 3{,}584\\text{ L}$.'],
      finalAnswer: '3,584 L C₂H₂ (ĐKTC)'
    }
  }),

  // ==================== LỚP 10 (GDPT 2006) ====================
  makeChemLesson({
    id: 'chem-2006-10-1',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2006 · Hóa học 10',
    sourceTag: 'SGK Hóa học 10 (2006) · Đồng vị & Nguyên tử khối trung bình',
    lessonNumber: 1,
    title: 'Đồng vị, Nguyên tử khối Trung bình & Vỏ Electron',
    subtitle: 'Tính nguyên tử khối trung bình từ phần trăm số nguyên tử đồng vị và định luật tuần hoàn Mendeleev',
    description: 'Giải nhanh các bài toán tính phần trăm đồng vị tự nhiên của Cl, Cu, Br, Mg và liên hệ bảng tuần hoàn 2006.',
    theory1Heading: '1. Đồng vị và Công thức Nguyên tử khối Trung bình',
    theory1: '• Đồng vị là các nguyên tử có cùng số proton $Z$ nhưng khác số notron $N$ $\\Rightarrow$ khác số khối $A$.\n• Công thức: $\\overline{A} = \\frac{aA_1 + bA_2}{100}$.',
    theory2Heading: '2. Ý nghĩa của Bảng tuần hoàn 2006',
    theory2: '• Số thứ tự ô = $Z$; số thứ tự chu kì = số lớp electron; số thứ tự nhóm A = số electron lớp ngoài cùng.',
    keyFormulas: [
      '\\overline{A} = \\frac{\\%_1 \\cdot A_1 + \\%_2 \\cdot A_2}{100}'
    ],
    sim2d: 'atomic_orbitals_2d',
    sim3d: 'atomic_orbitals_3d',
    mcq1: {
      source: 'Hóa 10 (2006)',
      question: 'Trong tự nhiên, Đồng có hai đồng vị bền $^{63}\\text{Cu}$ ($73\\%$) và $^{65}\\text{Cu}$ ($27\\%$). Nguyên tử khối trung bình của Đồng là:',
      options: ['A. 63,54', 'B. 64,00', 'C. 63,46', 'D. 64,46'],
      correctIndex: 0,
      explanation: '$\\overline{A} = \\frac{63 \\times 73 + 65 \\times 27}{100} = 63{,}54$.'
    },
    mcq2: {
      source: 'Hóa 10 (2006)',
      question: 'Cation $R^{2+}$ có cấu hình electron phân lớp ngoài cùng là $3p^6$. Vị trí của nguyên tố R trong bảng tuần hoàn là:',
      options: ['A. Chu kì 3, nhóm VIIIA', 'B. Chu kì 4, nhóm IIA', 'C. Chu kì 3, nhóm IIA', 'D. Chu kì 4, nhóm VIA'],
      correctIndex: 1,
      explanation: '$R^{2+}$ có $18e$ $\\Rightarrow$ $R$ có $20e$ ($[\\text{Ar}]4s^2$) thuộc chu kì 4, nhóm IIA (Canxi Ca).'
    },
    essay: {
      source: 'Hóa 10 (2006)',
      question: 'Clo có 2 đồng vị $^{35}\\text{Cl}$ và $^{37}\\text{Cl}$, nguyên tử khối trung bình là $35{,}5$. Tính phần trăm khối lượng của đồng vị $^{37}\\text{Cl}$ trong phân tử $KClO_3$ ($K=39, O=16$).',
      solutionSteps: ['$35x + 37(100-x) = 3550 \\Rightarrow x = 75\\%$ ($^{35}\\text{Cl}$), $^{37}\\text{Cl}$ chiếm $25\\%$.', 'Trong 1 mol $KClO_3$ có $0{,}25\\text{ mol } ^{37}\\text{Cl}$ nặng $0{,}25 \\times 37 = 9{,}25\\text{ g}$.', 'Phần trăm khối lượng = $\\frac{9{,}25}{39 + 35{,}5 + 48} \\times 100\\% = 7{,}55\\%$.'],
      finalAnswer: '7,55%'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-10-2',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2006 · Hóa học 10',
    sourceTag: 'SGK Hóa học 10 (2006) · Chương VI: Oxi – Lưu huỳnh',
    lessonNumber: 2,
    title: 'Oxi, Ozon (O₃), H₂S, SO₂ & Axit Sunfuric (Hóa 10 · 2006)',
    subtitle: 'Tính oxi hóa mạnh của O₃ (oxi hóa Ag), tính khử của H₂S, tính vừa oxi hóa vừa khử của SO₂ và muối sunfat',
    description: 'Trọn vẹn chương VI Oxi – Lưu huỳnh đặc trưng của SGK 2006 với bài tập bảo toàn e và quy đổi Fe–O.',
    theory1Heading: '1. Oxi, Ozon & Hiđro sunfua (H₂S)',
    theory1: '• $O_3$ oxi hóa được cả bạc ở nhiệt độ thường: $2\\text{Ag} + \\text{O}_3 \\to \\text{Ag}_2\\text{O} + \\text{O}_2$ (chứng minh $O_3$ mạnh hơn $O_2$).\n• $H_2S$ là axit cực yếu và chất khử mạnh: $2\\text{H}_2\\text{S} + \\text{SO}_2 \\to 3\\text{S}\\downarrow + 2\\text{H}_2\\text{O}$.',
    theory2Heading: '2. SO₂ và H₂SO₄ đặc nóng',
    theory2: '• $SO_2$ làm mất màu nước brom và dung dịch $KMnO_4$ (thể hiện tính khử).\n• $H_2SO_4$ đặc nóng oxi hóa Fe lên $Fe^{3+}$ và Cu lên $Cu^{2+}$ giải phóng $SO_2$.',
    keyFormulas: [
      '2\\text{Ag} + \\text{O}_3 \\to \\text{Ag}_2\\text{O} + \\text{O}_2',
      '2\\text{Fe} + 6\\text{H}_2\\text{SO}_4\\text{ (đặc, nóng)} \\to \\text{Fe}_2(\\text{SO}_4)_3 + 3\\text{SO}_2\\uparrow + 6\\text{H}_2\\text{O}'
    ],
    sim2d: 'contact_sulfuric_2d',
    sim3d: 'haber_contact_reactor_3d',
    mcq1: {
      source: 'Hóa 10 (2006)',
      question: 'Sục khí $SO_2$ đến dư vào dung dịch $Br_2$ màu nâu đỏ. Hiện tượng quan sát được là:',
      options: ['A. Dung dịch mất màu nâu đỏ thành không màu', 'B. Xuất hiện kết tủa vàng', 'C. Có khí thoát ra', 'D. Không có phản ứng'],
      correctIndex: 0,
      explanation: '$\\text{SO}_2 + \\text{Br}_2 + 2\\text{H}_2\\text{O} \\to \\text{H}_2\\text{SO}_4 + 2\\text{HBr}$, làm mất màu nước brom.'
    },
    mcq2: {
      source: 'Hóa 10 (2006)',
      question: 'Khí nào sau đây vừa có thể dùng làm mất màu nước $KMnO_4$, vừa tạo kết tủa vàng khi sục vào dung dịch $H_2S$?',
      options: ['A. CO₂', 'B. SO₂', 'C. N₂', 'D. HCl'],
      correctIndex: 1,
      explanation: '$SO_2$ có số oxi hóa trung gian $+4$: vừa khử $KMnO_4$, vừa oxi hóa $H_2S$ tạo lưu huỳnh kết tủa vàng.'
    },
    essay: {
      source: 'Hóa 10 (2006)',
      question: 'Hòa tan $11{,}2\\text{ g}$ Fe trong dung dịch $H_2SO_4$ đặc nóng dư thu được V lít khí $SO_2$ (ĐKTC, sản phẩm khử duy nhất). Tính V.',
      solutionSteps: ['$n_{\\text{Fe}} = 11{,}2/56 = 0{,}2\\text{ mol}$.', 'Bảo toàn e: $3n_{\\text{Fe}} = 2n_{\\text{SO}_2} \\Rightarrow n_{\\text{SO}_2} = 0{,}3\\text{ mol}$.', '$V_{\\text{SO}_2} = 0{,}3 \\times 22{,}4 = 6{,}72\\text{ L}$.'],
      finalAnswer: '6,72 L SO₂'
    }
  }),

  // ==================== LỚP 11 (GDPT 2006) ====================
  makeChemLesson({
    id: 'chem-2006-11-1',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2006 · Hóa học 11',
    sourceTag: 'SGK Hóa học 11 (2006) · Sự điện li, Axit – Bazơ (Arrhenius) & Phản ứng trao đổi ion',
    lessonNumber: 1,
    title: 'Sự điện li, Axit nhiều nấc, Hiđroxit lưỡng tính & Phương trình Ion rút gọn',
    subtitle: 'Viết phương trình ion thu gọn, bảo toàn điện tích dung dịch và đồ thị Al(OH)₃ tan trong kiềm dư',
    description: 'Trọng tâm Chương I Hóa 11 (2006): Định luật bảo toàn điện tích và bài toán rót từ từ $OH^-$ vào dung dịch muối $Al^{3+}$.',
    theory1Heading: '1. Thuyết Arrhenius & Bảo toàn Điện tích',
    theory1: '• Tổng số mol điện tích dương luôn bằng tổng số mol điện tích âm: $\\sum (n_{\\text{cation}} \\cdot q^+) = \\sum (n_{\\text{anion}} \\cdot |q^-|)$.\n• $Zn(OH)_2, Al(OH)_3, Cr(OH)_3$ là hiđroxit lưỡng tính.',
    theory2Heading: '2. Phương trình Ion rút gọn & Đồ thị kết tủa Al(OH)₃',
    theory2: '• Khi nhỏ kiềm vào $Al^{3+}$: ban đầu tạo tủa cực đại $n_{\\text{OH}^-} = 3n_{\\text{Al}^{3+}}$, sau đó tủa tan dần đến hết khi $n_{\\text{OH}^-} = 4n_{\\text{Al}^{3+}}$.',
    keyFormulas: [
      '\\text{Al}^{3+} + 3\\text{OH}^- \\to \\text{Al(OH)}_3\\downarrow',
      '\\text{Al(OH)}_3 + \\text{OH}^- \\to \\text{AlO}_2^- + 2\\text{H}_2\\text{O}'
    ],
    sim2d: 'buffer_ph_2d',
    sim3d: 'titration_bench_3d',
    mcq1: {
      source: 'Hóa 11 (2006)',
      question: 'Một dung dịch chứa $0{,}1\\text{ mol } Na^+$, $0{,}2\\text{ mol } Mg^{2+}$, $0{,}15\\text{ mol } SO_4^{2-}$ và $x\\text{ mol } Cl^-$. Giá trị của $x$ là:',
      options: ['A. 0,15', 'B. 0,20', 'C. 0,25', 'D. 0,30'],
      correctIndex: 1,
      explanation: 'Bảo toàn điện tích: $0{,}1\\times 1 + 0{,}2\\times 2 = 0{,}15\\times 2 + x \\Rightarrow 0{,}5 = 0{,}3 + x \\Rightarrow x = 0{,}20\\text{ mol}$.'
    },
    mcq2: {
      source: 'Hóa 11 (2006)',
      question: 'Phương trình ion rút gọn $\\text{H}^+ + \\text{OH}^- \\to \\text{H}_2\\text{O}$ KHÔNG biểu diễn bản chất của phản ứng nào sau đây?',
      options: ['A. HCl + NaOH', 'B. HNO₃ + KOH', 'C. H₂SO₄ + Ba(OH)₂', 'D. HBr + Ca(OH)₂'],
      correctIndex: 2,
      explanation: 'Phản ứng $H_2SO_4 + Ba(OH)_2$ tạo kết tủa $BaSO_4\\downarrow$ nên phương trình ion rút gọn phải giữ $Ba^{2+}$ và $SO_4^{2-}$.'
    },
    essay: {
      source: 'Hóa 11 (2006)',
      question: 'Rót $350\\text{ mL}$ dung dịch NaOH $1\\text{ M}$ vào $100\\text{ mL}$ dung dịch $AlCl_3\\ 1\\text{ M}$. Tính khối lượng kết tủa thu được.',
      solutionSteps: ['$n_{\\text{Al}^{3+}} = 0{,}1\\text{ mol}$; $n_{\\text{OH}^-} = 0{,}35\\text{ mol}$.', 'Vì $3 < \\frac{0{,}35}{0{,}1} < 4$, kết tủa đạt cực đại $0{,}1\\text{ mol}$ rồi tan một phần.', '$n_{\\downarrow} = 4n_{\\text{Al}^{3+}} - n_{\\text{OH}^-} = 0{,}4 - 0{,}35 = 0{,}05\\text{ mol} \\Rightarrow m = 0{,}05 \\times 78 = 3{,}9\\text{ g}$.'],
      finalAnswer: '3,9 g Al(OH)₃'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-11-2',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2006 · Hóa học 11',
    sourceTag: 'SGK Hóa học 11 (2006) · Photpho, Axit Photphoric & Phân bón Hóa học',
    lessonNumber: 2,
    title: 'Photpho, H₃PO₄, Nhiệt phân Muối Nitrat & Cacbon – Silic (2006)',
    subtitle: 'Bài toán H₃PO₄ + Kiềm tạo 3 muối (H₂PO₄⁻, HPO₄²⁻, PO₄³⁻), phân NPK độ dinh dưỡng và khí than ướt',
    description: 'Hoàn thành phần Vô cơ Nitơ – Photpho – Cacbon – Silic đặc thù trong đề thi SGK 2006.',
    theory1Heading: '1. Axit Photphoric (H₃PO₄) & Độ dinh dưỡng Phân bón',
    theory1: '• Tùy tỉ số $T = n_{\\text{OH}^-} / n_{\\text{H}_3\\text{PO}_4}$: $T \\le 1$ tạo $H_2PO_4^-$; $T=2$ tạo $HPO_4^{2-}$; $T \\ge 3$ tạo $PO_4^{3-}$.\n• Độ dinh dưỡng: Đạm = $\\%N$; Lân = $\\%P_2O_5$; Kali = $\\%K_2O$.',
    theory2Heading: '2. Quy luật Nhiệt phân Muối Nitrat M(NO₃)ₙ',
    theory2: '• Trước Mg (K, Na, Ba, Ca): $\\to \\text{Muối nitrit } M(NO_2)_n + O_2$.\n• Từ Mg đến Cu: $\\to \\text{Oxit kim loại} + NO_2 + O_2$.\n• Sau Cu (Ag, Hg): $\\to \\text{Kim loại} + NO_2 + O_2$.',
    keyFormulas: [
      '2\\text{Cu(NO}_3)_2 \\xrightarrow{t^\\circ} 2\\text{CuO} + 4\\text{NO}_2\\uparrow + \\text{O}_2\\uparrow',
      '2\\text{AgNO}_3 \\xrightarrow{t^\\circ} 2\\text{Ag} + 2\\text{NO}_2\\uparrow + \\text{O}_2\\uparrow'
    ],
    sim2d: 'stoichiometry_gas_2d',
    sim3d: 'equilibrium_piston_3d',
    mcq1: {
      source: 'Hóa 11 (2006)',
      question: 'Nhiệt phân hoàn toàn chất rắn nào sau đây thu được kim loại tự do?',
      options: ['A. KNO₃', 'B. Cu(NO₃)₂', 'C. AgNO₃', 'D. Fe(NO₃)₃'],
      correctIndex: 2,
      explanation: 'Ag đứng sau Cu nên muối bạc nitrat nhiệt phân đến kim loại Ag, $NO_2$ và $O_2$.'
    },
    mcq2: {
      source: 'Hóa 11 (2006)',
      question: 'Cho $0{,}1\\text{ mol } P_2O_5$ vào dung dịch chứa $0{,}35\\text{ mol } KOH$. Dung dịch sau phản ứng chứa hai muối nào?',
      options: ['A. KH₂PO₄ và K₂HPO₄', 'B. K₂HPO₄ và K₃PO₄', 'C. Chỉ có KH₂PO₄', 'D. Chỉ có K₃PO₄'],
      correctIndex: 0,
      explanation: '$n_{\\text{H}_3\\text{PO}_4} = 0{,}2\\text{ mol}$. Tỉ số $T = \\frac{0{,}35}{0{,}2} = 1{,}75 \\in (1; 2) \\Rightarrow$ tạo $H_2PO_4^-$ và $HPO_4^{2-}$.'
    },
    essay: {
      source: 'Hóa 11 (2006)',
      question: 'Tính độ dinh dưỡng ($\%N$) của phân đạm Ure $(NH_2)_2CO$ nguyên chất ($M = 60$).',
      solutionSteps: ['Trong 1 mol Ure có 2 mol nguyên tử N ($m_N = 28\\text{ g}$).', '$\%N = \\frac{28}{60} \\times 100\\% \\approx 46{,}67\\%$.'],
      finalAnswer: '46,67% N'
    }
  }),

  // ==================== LỚP 12 (GDPT 2006) ====================
  makeChemLesson({
    id: 'chem-2006-12-1',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2006 · Hóa học 12',
    sourceTag: 'SGK Hóa học 12 (2006) · Sắt, Crom & Hợp chất',
    lessonNumber: 1,
    title: 'Sắt (Fe), Crom (Cr) & Hợp chất Quan trọng (Hóa 12 · 2006)',
    subtitle: 'Chuyển hóa Fe²⁺ ⇌ Fe³⁺, cân bằng màu CrO₄²⁻ (vàng) ⇌ Cr₂O₇²⁻ (da cam) theo pH và quặng sắt',
    description: 'Chuyên đề đặc trưng của SGK 2006 (Chương 7): tính khử Fe²⁺, tính oxi hóa Fe³⁺ và tính lưỡng tính của $Cr(OH)_3, Cr_2O_3$.',
    theory1Heading: '1. Hợp chất Sắt(II) & Sắt(III)',
    theory1: '• Hợp chất $Fe^{2+}$ có tính khử đặc trưng ($Fe^{2+}$ tác dụng $Cl_2, HNO_3, KMnO_4/H^+$ lên $Fe^{3+}$).\n• Muối $Fe^{3+}$ có tính oxi hóa: $\\text{Cu} + 2\\text{FeCl}_3 \\to \\text{CuCl}_2 + 2\\text{FeCl}_2$.',
    theory2Heading: '2. Crom (Cr) & Chuyển dịch Cromat – Đicromat',
    theory2: '• Cr là kim loại cứng nhất; thụ động với $HNO_3, H_2SO_4$ đặc nguội.\n• $2\\text{CrO}_4^{2-} \\text{ (vàng)} + 2\\text{H}^+ \\rightleftharpoons \\text{Cr}_2\\text{O}_7^{2-} \\text{ (da cam)} + \\text{H}_2\\text{O}$.',
    keyFormulas: [
      '\\text{Fe} + 2\\text{Fe}^{3+} \\to 3\\text{Fe}^{2+},\\quad \\text{Cu} + 2\\text{Fe}^{3+} \\to \\text{Cu}^{2+} + 2\\text{Fe}^{2+}',
      '2\\text{CrO}_4^{2-} + 2\\text{H}^+ \\rightleftharpoons \\text{Cr}_2\\text{O}_7^{2-} + \\text{H}_2\\text{O}'
    ],
    sim2d: 'equilibrium_shift_2d',
    sim3d: 'coordination_complex_3d',
    mcq1: {
      source: 'Hóa 12 (2006)',
      question: 'Nhỏ vài giọt dung dịch NaOH vào dung dịch $K_2Cr_2O_7$ màu da cam thì dung dịch chuyển sang màu gì?',
      options: ['A. Màu vàng (tạo CrO₄²⁻)', 'B. Màu xanh lục', 'C. Màu đỏ nâu', 'D. Không màu'],
      correctIndex: 0,
      explanation: 'Thêm $OH^-$ làm giảm nồng độ $H^+$ nên cân bằng chuyển sang trái tạo ion $CrO_4^{2-}$ màu vàng.'
    },
    mcq2: {
      source: 'Hóa 12 (2006)',
      question: 'Cho bột Cu dư vào dung dịch $FeCl_3$ thu được dung dịch sau phản ứng gồm hai muối nào?',
      options: ['A. CuCl₂ và FeCl₃', 'B. CuCl₂ và FeCl₂', 'C. Chỉ có CuCl₂', 'D. FeCl₂ và FeCl₃'],
      correctIndex: 1,
      explanation: 'Vì Cu dư nên $Fe^{3+}$ bị khử hoàn toàn về $Fe^{2+}$: $\\text{Cu} + 2\\text{FeCl}_3 \\to \\text{CuCl}_2 + 2\\text{FeCl}_2$.'
    },
    essay: {
      source: 'Hóa 12 (2006)',
      question: 'Cho $5{,}6\\text{ g}$ Fe vào $250\\text{ mL}$ dung dịch $AgNO_3\\ 1\\text{ M}$. Tính khối lượng chất rắn thu được sau khi phản ứng xảy ra hoàn toàn.',
      solutionSteps: ['$n_{\\text{Fe}} = 0{,}1\\text{ mol}$, $n_{\\text{Ag}^+} = 0{,}25\\text{ mol}$.', 'Bước 1: $Fe + 2Ag^+ \\to Fe^{2+} + 2Ag\\downarrow$ (dư $0{,}05\\text{ mol } Ag^+$ tạo $0{,}2\\text{ mol } Ag$).', 'Bước 2: $Fe^{2+} + Ag^+ \\to Fe^{3+} + Ag\\downarrow$ ($0{,}05\\text{ mol } Ag^+$ tạo thêm $0{,}05\\text{ mol } Ag$).', 'Tổng khối lượng $Ag = 0{,}25 \\times 108 = 27{,}0\\text{ g}$.'],
      finalAnswer: '27,0 g Ag'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-12-2',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2006 · Hóa học 12',
    sourceTag: 'SGK Hóa học 12 (2006) · Nhận biết Cation/Anion & Hóa học Môi trường',
    lessonNumber: 2,
    title: 'Nhận biết Một số Ion Trong Dung dịch & Hóa học Môi trường (2006)',
    subtitle: 'Thuốc thử đặc hiệu nhận biết Na⁺, NH₄⁺, Ba²⁺, Al³⁺, Fe²⁺, Fe³⁺, Cu²⁺ và SO₄²⁻, NO₃⁻, CO₃²⁻',
    description: 'Hoàn thiện Chương 8 & 9 SGK 2006: phân biệt nhanh các dung dịch mất nhãn và xử lý ô nhiễm không khí – nguồn nước.',
    theory1Heading: '1. Bảng Thuốc thử Nhận biết Cation & Anion',
    theory1: '• $NH_4^+$ + kiềm $\\xrightarrow{t^\\circ}$ khí $NH_3$ mùi khai làm xanh quỳ ẩm.\n• $Fe^{2+}$ + $OH^-$ $\\to Fe(OH)_2$ trắng xanh hóa nâu đỏ trong không khí; $Fe^{3+}$ + $OH^-$ $\\to Fe(OH)_3$ nâu đỏ.\n• $NO_3^-$ + Cu + $H_2SO_4$ loãng $\\to$ khí $NO$ hóa nâu ngoài không khí và dung dịch xanh.',
    theory2Heading: '2. Hóa học với Vấn đề Kinh tế – Xã hội – Môi trường',
    theory2: '• Khí $CO_2, CH_4$ gây hiệu ứng nhà kính; $SO_2, NO_x$ gây mưa axit; $CFC$ phá hủy tầng ozon.',
    keyFormulas: [
      '\\text{NH}_4^+ + \\text{OH}^- \\xrightarrow{t^\\circ} \\text{NH}_3\\uparrow + \\text{H}_2\\text{O}',
      '3\\text{Cu} + 8\\text{H}^+ + 2\\text{NO}_3^- \\to 3\\text{Cu}^{2+} + 2\\text{NO}\\uparrow + 4\\text{H}_2\\text{O}'
    ],
    sim2d: 'qualitative_ion_2d',
    sim3d: 'halogen_ion_bench_3d',
    mcq1: {
      source: 'Hóa 12 (2006)',
      question: 'Chỉ dùng một thuốc thử duy nhất nào để phân biệt 4 dung dịch: $NH_4Cl$, $FeCl_2$, $FeCl_3$, $AlCl_3$?',
      options: ['A. Dung dịch AgNO₃', 'B. Dung dịch NaOH dư đun nhẹ', 'C. Dung dịch HCl', 'D. Quỳ tím'],
      correctIndex: 1,
      explanation: '$NH_4Cl$: khí mùi khai $NH_3$; $FeCl_2$: tủa trắng xanh hóa nâu; $FeCl_3$: tủa nâu đỏ; $AlCl_3$: tủa keo trắng rồi tan trong NaOH dư.'
    },
    mcq2: {
      source: 'Hóa 12 (2006)',
      question: 'Cặp khí nào là nguyên nhân chủ yếu gây ra hiện tượng **mưa axit**?',
      options: ['A. CO₂ và CH₄', 'B. SO₂ và NO₂', 'C. N₂ và Ar', 'D. H₂ và NH₃'],
      correctIndex: 1,
      explanation: '$SO_2$ và $NO_2$ bị oxi hóa trong khí quyển tạo axit $H_2SO_4$ và $HNO_3$ rơi xuống theo nước mưa.'
    },
    essay: {
      source: 'Hóa 12 (2006)',
      question: 'Trình bày cách phân biệt 3 dung dịch không màu: $Na_2SO_4$, $NaNO_3$, $Na_2CO_3$ chỉ dùng thêm một hóa chất làm thuốc thử.',
      solutionSteps: ['Dùng dung dịch $BaCl_2$ (hoặc axit $HCl$): nếu dùng $HCl$ thì $Na_2CO_3$ sủi bọt khí $CO_2$, hai chất còn lại không hiện tượng.', 'Dùng $Ba(OH)_2$ hoặc kết hợp $H_2SO_4$ + Cu cho $NaNO_3$; tối ưu dùng dung dịch $BaCl_2$ dư rồi nhỏ thêm $HCl$ để phân biệt $BaCO_3$ tan có khí còn $BaSO_4$ không tan.'],
      finalAnswer: 'Dùng BaCl₂ + HCl hoặc HCl + Cu'
    }
  })
];
