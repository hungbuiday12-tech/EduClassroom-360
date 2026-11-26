export type ElementCategory =
  | 'nonmetal'
  | 'noble_gas'
  | 'alkali'
  | 'alkaline_earth'
  | 'metalloid'
  | 'halogen'
  | 'transition'
  | 'post_transition'
  | 'lanthanide'
  | 'actinide';

export type ElementBlock = 's' | 'p' | 'd' | 'f';
export type ElementState = 'Rắn' | 'Lỏng' | 'Khí';

export interface PeriodicElement118 {
  z: number;
  sym: string;
  nameVi: string;
  nameEn: string;
  mass: number;
  period: number;
  group: number; // 1..18 (f-block placed in col 3..17 on row 8/9)
  row: number;   // visual grid row 1..9 (8=La..Lu, 9=Ac..Lr)
  col: number;   // visual grid col 1..18
  block: ElementBlock;
  category: ElementCategory;
  state: ElementState;
  shells: number[];
  config: string;
  en: number | null; // Pauling electronegativity
  ie: number; // First ionization energy (eV)
  radiusPm: number;
  meltC: number | null;
  boilC: number | null;
  oxidation: string;
  flameHex: string;
  spectralLinesNm: number[];
  reactionVi: string;
  applicationVi: string;
}

export const CATEGORY_META: Record<
  ElementCategory,
  { labelVi: string; badgeClass: string; tileBg: string; borderHex: string; accentHex: string }
> = {
  nonmetal: {
    labelVi: 'Phi kim hoạt động',
    badgeClass: 'bg-sky-500/15 border-sky-400/50 text-sky-300',
    tileBg: 'from-sky-950/90 to-cyan-950/70 border-sky-500/45 hover:border-sky-300',
    borderHex: '#38bdf8',
    accentHex: '#0ea5e9',
  },
  noble_gas: {
    labelVi: 'Khí hiếm (VIII A)',
    badgeClass: 'bg-violet-500/15 border-violet-400/50 text-violet-300',
    tileBg: 'from-violet-950/90 to-fuchsia-950/70 border-violet-500/45 hover:border-violet-300',
    borderHex: '#a78bfa',
    accentHex: '#8b5cf6',
  },
  alkali: {
    labelVi: 'Kim loại kiềm (I A)',
    badgeClass: 'bg-rose-500/15 border-rose-400/50 text-rose-300',
    tileBg: 'from-rose-950/90 to-red-950/70 border-rose-500/45 hover:border-rose-300',
    borderHex: '#fb7185',
    accentHex: '#f43f5e',
  },
  alkaline_earth: {
    labelVi: 'Kiềm thổ (II A)',
    badgeClass: 'bg-amber-500/15 border-amber-400/50 text-amber-300',
    tileBg: 'from-amber-950/90 to-orange-950/70 border-amber-500/45 hover:border-amber-300',
    borderHex: '#fbbf24',
    accentHex: '#f59e0b',
  },
  metalloid: {
    labelVi: 'Á kim bán dẫn',
    badgeClass: 'bg-teal-500/15 border-teal-400/50 text-teal-300',
    tileBg: 'from-teal-950/90 to-emerald-950/70 border-teal-500/45 hover:border-teal-300',
    borderHex: '#2dd4bf',
    accentHex: '#14b8a6',
  },
  halogen: {
    labelVi: 'Halogen (VII A)',
    badgeClass: 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300',
    tileBg: 'from-emerald-950/90 to-lime-950/70 border-emerald-500/45 hover:border-emerald-300',
    borderHex: '#34d399',
    accentHex: '#10b981',
  },
  transition: {
    labelVi: 'Kim loại chuyển tiếp (d)',
    badgeClass: 'bg-blue-500/15 border-blue-400/50 text-blue-300',
    tileBg: 'from-slate-900/95 to-blue-950/75 border-blue-500/40 hover:border-blue-300',
    borderHex: '#60a5fa',
    accentHex: '#3b82f6',
  },
  post_transition: {
    labelVi: 'Kim loại sau chuyển tiếp',
    badgeClass: 'bg-indigo-500/15 border-indigo-400/50 text-indigo-300',
    tileBg: 'from-slate-900/95 to-indigo-950/70 border-indigo-500/40 hover:border-indigo-300',
    borderHex: '#818cf8',
    accentHex: '#6366f1',
  },
  lanthanide: {
    labelVi: 'Họ Lanthan (4f)',
    badgeClass: 'bg-pink-500/15 border-pink-400/50 text-pink-300',
    tileBg: 'from-pink-950/90 to-rose-950/70 border-pink-500/45 hover:border-pink-300',
    borderHex: '#f472b6',
    accentHex: '#ec4899',
  },
  actinide: {
    labelVi: 'Họ Actinide (5f · Phóng xạ)',
    badgeClass: 'bg-orange-500/15 border-orange-400/50 text-orange-300',
    tileBg: 'from-orange-950/90 to-red-950/70 border-orange-500/45 hover:border-orange-300',
    borderHex: '#fb923c',
    accentHex: '#f97316',
  },
};

type RawEl = [
  number, // z
  string, // sym
  string, // nameVi
  string, // nameEn
  number, // mass
  number, // period
  number, // group
  number, // row
  number, // col
  ElementBlock,
  ElementCategory,
  ElementState,
  number[], // shells
  string, // config
  number | null, // en
  number, // ie
  number, // radiusPm
  number | null, // meltC
  number | null, // boilC
  string, // oxidation
  string, // flameHex
  number[], // spectralLinesNm
  string?, // reactionVi
  string? // applicationVi
];

const RAW_118: RawEl[] = [
  [1,'H','Hiđro','Hydrogen',1.008,1,1,1,1,'s','nonmetal','Khí',[1],'1s¹',2.20,13.6,53,-259,-253,'+1, −1','#e879f9',[656,486,434,410],'2H₂ + O₂ → 2H₂O (nổ tỉ lệ 2:1); khử oxit kim loại ở t° cao','Nhiên liệu tên lửa LH₂, pin nhiên liệu H₂, tổng hợp NH₃ Haber-Bosch'],
  [2,'He','Heli','Helium',4.0026,1,18,1,18,'s','noble_gas','Khí',[2],'1s²',null,24.59,31,-272,-269,'0','#fcd34d',[587,667,501,447],'Trơ hóa học hoàn toàn do lớp vỏ 1s² bão hòa bền vững','Làm lạnh nam châm siêu dẫn MRI/LHC ở 4,2 K, khí nâng khinh khí cầu'],
  [3,'Li','Liti','Lithium',6.94,2,1,2,1,'s','alkali','Rắn',[2,1],'[He] 2s¹',0.98,5.39,167,181,1342,'+1','#f43f5e',[671,610,460],'2Li + 2H₂O → 2LiOH + H₂↑ (phản ứng êm hơn Na); ngọn lửa đỏ tía rực','Pin Li-ion xe điện & điện thoại, hợp kim siêu nhẹ hàng không'],
  [4,'Be','Beri','Beryllium',9.0122,2,2,2,2,'s','alkaline_earth','Rắn',[2,2],'[He] 2s²',1.57,9.32,112,1287,2471,'+2','#e2e8f0',[457,332,234],'Be + 2NaOH + 2H₂O → Na₂[Be(OH)₄] + H₂↑ (hiđroxit lưỡng tính)','Cửa sổ ống tia X, gương kính thiên văn James Webb, hợp kim đồng-beri'],
  [5,'B','Bo','Boron',10.81,2,13,2,13,'p','metalloid','Rắn',[2,3],'[He] 2s² 2p¹',2.04,8.30,87,2076,3927,'+3','#4ade80',[548,518,345],'4B + 3O₂ → 2B₂O₃ (t°); tạo liên kết 3 tâm thiếu electron trong B₂H₆','Thủy tinh chịu nhiệt borosilicate (Pyrex), thanh hấp thụ neutron lò phản ứng'],
  [6,'C','Cacbon','Carbon',12.011,2,14,2,14,'p','nonmetal','Rắn',[2,4],'[He] 2s² 2p²',2.55,11.26,67,3550,4027,'−4..+4','#38bdf8',[658,505,427],'C + O₂ → CO₂ (t°); C + H₂O(hơi) ⇌ CO + H₂; tạo mạch hữu cơ C–C vô tận','Nền tảng mọi phân tử hữu cơ, kim cương, graphen, sợi cacbon siêu bền'],
  [7,'N','Nitơ','Nitrogen',14.007,2,15,2,15,'p','nonmetal','Khí',[2,5],'[He] 2s² 2p³',3.04,14.53,56,-210,-196,'−3..+5','#a855f7',[648,568,463,400],'N₂ + 3H₂ ⇌ 2NH₃ (Fe, 450°C, 200 atm); liên kết ba N≡N cực bền (945 kJ/mol)','Sản xuất phân đạm urê, axit HNO₃, khí bảo quản mẫu sinh học Nitơ lỏng'],
  [8,'O','Oxi','Oxygen',15.999,2,16,2,16,'p','nonmetal','Khí',[2,6],'[He] 2s² 2p⁴',3.44,13.62,48,-219,-183,'−2, −1','#60a5fa',[616,533,436],'Oxi hóa mạnh hầu hết kim loại & phi kim; O₂ có tính thuận từ do 2 e độc thân π*','Hô hấp hiếu khí tạo ATP, luyện thép, chất oxi hóa nhiên liệu tên lửa'],
  [9,'F','Flo','Fluorine',18.998,2,17,2,17,'p','halogen','Khí',[2,7],'[He] 2s² 2p⁵',3.98,17.42,42,-220,-188,'−1','#bef264',[685,624,520],'2F₂ + 2H₂O → 4HF + O₂↑ (nổ trong bóng tối, phi kim có độ âm điện lớn nhất 3,98)','Chế tạo nhựa chống dính Teflon (PTFE), kem đánh răng chống sâu răng, UF₆'],
  [10,'Ne','Neon','Neon',20.180,2,18,2,18,'p','noble_gas','Khí',[2,8],'[He] 2s² 2p⁶',null,21.56,38,-249,-246,'0','#fb7185',[640,614,585,540],'Không tạo hợp chất bền; phóng điện phát sáng đỏ cam rực rỡ đặc trưng','Đèn ống quảng cáo Neon, laser He–Ne chuẩn bước sóng 632,8 nm'],
  [11,'Na','Natri','Sodium',22.990,3,1,3,1,'s','alkali','Rắn',[2,8,1],'[Ne] 3s¹',0.93,5.14,190,98,883,'+1','#facc15',[589,589.6,569],'2Na + 2H₂O → 2NaOH + H₂↑ (nóng chảy thành giọt tròn, cháy vàng rực 589 nm)','Đèn cao áp Natri vàng, sản xuất NaOH–Cl₂, truyền xung thần kinh Na⁺/K⁺'],
  [12,'Mg','Magie','Magnesium',24.305,3,2,3,2,'s','alkaline_earth','Rắn',[2,8,2],'[Ne] 3s²',1.31,7.65,145,650,1091,'+2','#f8fafc',[518,517,383],'2Mg + O₂ → 2MgO (sáng chói trắng UV); Mg cháy được trong khí CO₂','Pháo sáng, hợp kim siêu nhẹ khung máy bay, trung tâm phân tử diệp lục Chlorophyll'],
  [13,'Al','Nhôm','Aluminum',26.982,3,13,3,13,'p','post_transition','Rắn',[2,8,3],'[Ne] 3s² 3p¹',1.61,5.99,118,660,2470,'+3','#e0f2fe',[396,394,309],'2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑; phản ứng nhiệt nhôm 2Al + Fe₂O₃ → 2Fe + Al₂O₃','Vỏ máy bay, dây tải điện cao áp, phản ứng nhiệt nhôm hàn đường ray'],
  [14,'Si','Silic','Silicon',28.085,3,14,3,14,'p','metalloid','Rắn',[2,8,4],'[Ne] 3s² 3p²',1.90,8.15,111,1414,3265,'−4, +4','#67e8f9',[635,505,390],'Si + 2NaOH + H₂O → Na₂SiO₃ + 2H₂↑; tạo mạng tinh thể cộng hóa trị kim cương','Vi mạch bán dẫn CPU/GPU, pin mặt trời quang điện, thủy tinh & xi măng'],
  [15,'P','Photpho','Phosphorus',30.974,3,15,3,15,'p','nonmetal','Rắn',[2,8,5],'[Ne] 3s² 3p³',2.19,10.49,98,44,280,'−3, +3, +5','#a3e635',[604,542,460],'4P + 5O₂ → 2P₂O₅; P trắng phát quang hóa học trong bóng tối & tự bốc cháy ở 40°C','Phân lân supephotphat, que diêm (P đỏ), khung xương & phân tử năng lượng ATP/DNA'],
  [16,'S','Lưu huỳnh','Sulfur',32.06,3,16,3,16,'p','nonmetal','Rắn',[2,8,6],'[Ne] 3s² 3p⁴',2.58,10.36,88,115,445,'−2, +4, +6','#60a5fa',[545,481,416],'S + O₂ → SO₂ (ngọn lửa xanh lam); Hg + S → HgS ngay nhiệt độ thường','Sản xuất H₂SO₄ (hóa chất công nghiệp số 1), lưu hóa cao su lốp xe'],
  [17,'Cl','Clo','Chlorine',35.45,3,17,3,17,'p','halogen','Khí',[2,8,7],'[Ne] 3s² 3p⁵',3.16,12.97,79,-102,-34,'−1..+7','#84cc16',[542,481,434],'Cl₂ + 2NaOH → NaCl + NaClO + H₂O (nước Javen); oxi hóa Fe lên +3','Khử trùng nước sinh hoạt, nhựa PVC, thuốc tẩy Javen, dung môi hữu cơ'],
  [18,'Ar','Argon','Argon',39.948,3,18,3,18,'p','noble_gas','Khí',[2,8,8],'[Ne] 3s² 3p⁶',null,15.76,71,-189,-186,'0','#818cf8',[696,549,470,415],'Khí hiếm chiếm ~0,93% khí quyển Trái Đất; phát quang tím-xanh trong điện trường cao','Khí bảo vệ mối hàn hồ quang TIG, bơm bóng đèn sợi đốt, buồng găng tay thí nghiệm'],
  [19,'K','Kali','Potassium',39.098,4,1,4,1,'s','alkali','Rắn',[2,8,8,1],'[Ar] 4s¹',0.82,4.34,243,64,759,'+1','#d8b4fe',[766,770,404],'2K + 2H₂O → 2KOH + H₂↑ (tự bốc cháy ngay lập tức với ngọn lửa tím hoa cà)','Phân kali nông nghiệp, kính bảo hộ, duy trì điện thế màng tế bào thần kinh'],
  [20,'Ca','Canxi','Calcium',40.078,4,2,4,2,'s','alkaline_earth','Rắn',[2,8,8,2],'[Ar] 4s²',1.00,6.11,194,842,1484,'+2','#fb7185',[622,559,422],'Ca + 2H₂O → Ca(OH)₂ + H₂↑; CaCO₃ phân hủy ở 900°C thành vôi sống CaO','Xi măng – vật liệu xây dựng, thành phần chính của xương & răng người'],
  [21,'Sc','Scandi','Scandium',44.956,4,3,4,3,'d','transition','Rắn',[2,8,9,2],'[Ar] 3d¹ 4s²',1.36,6.56,184,1541,2836,'+3','#fb923c',[630,567,424],'2Sc + 6HCl → 2ScCl₃ + 3H₂↑; tạo ion Sc³⁺ không màu cấu hình Ar','Hợp kim Al–Sc siêu nhẹ bền cho khung xe đạp đua & vỏ tên lửa'],
  [22,'Ti','Titan','Titanium',47.867,4,4,4,4,'d','transition','Rắn',[2,8,10,2],'[Ar] 3d² 4s²',1.54,6.83,176,1668,3287,'+2, +3, +4','#e2e8f0',[521,498,453],'Siêu bền nhờ màng thụ động TiO₂; tác dụng Cl₂ nóng tạo TiCl₄ lỏng','Vỏ tàu vũ trụ, khớp xương – trụ răng implant y sinh, sơn trắng TiO₂'],
  [23,'V','Vanadi','Vanadium',50.942,4,5,4,5,'d','transition','Rắn',[2,8,11,2],'[Ar] 3d³ 4s²',1.63,6.75,171,1910,3407,'+2..+5','#fde047',[609,438,411],'Dung dịch chuyển 4 màu rực rỡ theo số oxi hóa: V⁵⁺(vàng) → V⁴⁺(lam) → V³⁺(lục) → V²⁺(tím)','Xúc tác V₂O₅ tổng hợp axit sunfuric, thép hợp kim siêu cứng, pin dòng chảy VRFB'],
  [24,'Cr','Crom','Chromium',51.996,4,6,4,6,'d','transition','Rắn',[2,8,13,1],'[Ar] 3d⁵ 4s¹',1.66,6.77,166,1907,2671,'+2, +3, +6','#4ade80',[520,425,358],'Cấu hình bán bão hòa 3d⁵ 4s¹; CrO₄²⁻ (vàng) ⇌ Cr₂O₇²⁻ (da cam) theo pH','Thép không gỉ Inox (≥11% Cr), mạ crom sáng bóng chống ăn mòn, phẩm màu ruby'],
  [25,'Mn','Mangan','Manganese',54.938,4,7,4,7,'d','transition','Rắn',[2,8,13,2],'[Ar] 3d⁵ 4s²',1.55,7.43,161,1246,2061,'+2, +4, +7','#e879f9',[534,482,403],'KMnO₄ tím oxi hóa cực mạnh trong môi trường axit về Mn²⁺ không màu','Hợp kim thép đường ray chống mài mòn, chất oxi hóa KMnO₄, pin khô MnO₂'],
  [26,'Fe','Sắt','Iron',55.845,4,8,4,8,'d','transition','Rắn',[2,8,14,2],'[Ar] 3d⁶ 4s²',1.83,7.90,156,1538,2862,'+2, +3','#fbbf24',[527,438,386],'Fe + 2HCl → FeCl₂ + H₂↑; thụ động trong HNO₃/H₂SO₄ đặc nguội; sắt từ tính mạnh','Thép kết cấu công trình, nam châm điện từ, nhân Hemoglobin vận chuyển O₂ trong máu'],
  [27,'Co','Coban','Cobalt',58.933,4,9,4,9,'d','transition','Rắn',[2,8,15,2],'[Ar] 3d⁷ 4s²',1.88,7.88,152,1495,2927,'+2, +3','#3b82f6',[535,484,412],'[Co(H₂O)₆]²⁺ (hồng) + 4Cl⁻ ⇌ [CoCl₄]²⁻ (xanh coban) nhạy nhiệt & ẩm','Gốm sứ xanh coban, catôt pin LiCoO₂, nhân vitamin B₁₂, siêu hợp kim tua-bin'],
  [28,'Ni','Niken','Nickel',58.693,4,10,4,10,'d','transition','Rắn',[2,8,16,2],'[Ar] 3d⁸ 4s²',1.91,7.64,149,1455,2913,'+2','#34d399',[547,471,352],'Tạo phức màu xanh lục [Ni(H₂O)₆]²⁺; xúc tác hiđro hóa anken (Ni, t°)','Xúc tác công nghiệp dầu thực vật, thép không gỉ, pin NiMH & catôt xe điện NMC'],
  [29,'Cu','Đồng','Copper',63.546,4,11,4,11,'d','transition','Rắn',[2,8,18,1],'[Ar] 3d¹⁰ 4s¹',1.90,7.73,145,1085,2562,'+1, +2','#2dd4bf',[578,521,510,325],'Cu + 4HNO₃(đặc) → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O; ngọn lửa xanh ngọc lục bảo đặc trưng','Dây dẫn điện dân dụng, bo mạch PCB, hợp kim đồng thau, thuốc diệt nấm CuSO₄'],
  [30,'Zn','Kẽm','Zinc',65.38,4,12,4,12,'d','transition','Rắn',[2,8,18,2],'[Ar] 3d¹⁰ 4s²',1.65,9.39,142,420,907,'+2','#38bdf8',[636,481,472],'Zn + 2NaOH + 2H₂O → Na₂[Zn(OH)₄] + H₂↑; bảo vệ điện hóa vỏ tàu thép (anot hy sinh)','Mạ kẽm chống gỉ tôn thép, vỏ pin kẽm-cacbon, hợp kim đồng thau, enzyme sinh học'],
  [31,'Ga','Gali','Gallium',69.723,4,13,4,13,'p','post_transition','Rắn',[2,8,18,3],'[Ar] 3d¹⁰ 4s² 4p¹',1.81,6.00,136,30,2204,'+3','#a5b4fc',[417,403],'Nóng chảy ngay trên lòng bàn tay ở 29,8°C; tạo bán dẫn GaAs/GaN phát quang xanh','Đèn LED xanh lam GaN, chip tần số cao 5G & radar GaAs, nhiệt kế thay thủy ngân'],
  [32,'Ge','Gecmani','Germanium',72.630,4,14,4,14,'p','metalloid','Rắn',[2,8,18,4],'[Ar] 3d¹⁰ 4s² 4p²',2.01,7.90,125,938,2833,'+2, +4','#60a5fa',[422,303,265],'Ge + 2Cl₂ → GeCl₄; độ linh động hạt tải điện cao dùng trong quang học hồng ngoại','Cáp quang truyền dẫn, thấu kính camera nhiệt hồng ngoại, transistor thế hệ đầu'],
  [33,'As','Asen','Arsenic',74.922,4,15,4,15,'p','metalloid','Rắn',[2,8,18,5],'[Ar] 3d¹⁰ 4s² 4p³',2.18,9.79,114,817,615,'−3, +3, +5','#93c5fd',[286,278,229],'Thăng hoa ở 615°C; phản ứng Marsh tạo gương Asen đen bóng','Pha tạp bán dẫn loại n (GaAs), hợp kim chì ắc quy, nghiên cứu độc chất học'],
  [34,'Se','Selen','Selenium',78.971,4,16,4,16,'p','nonmetal','Rắn',[2,8,18,6],'[Ar] 3d¹⁰ 4s² 4p⁴',2.55,9.75,103,221,685,'−2, +4, +6','#38bdf8',[473,204,196],'Độ dẫn điện tăng hàng trăm lần khi chiếu ánh sáng (hiệu ứng quang dẫn)','Tế bào quang điện, máy photocopy, chất khử màu xanh của thủy tinh, vi lượng chống oxi hóa'],
  [35,'Br','Brom','Bromine',79.904,4,17,4,17,'p','halogen','Lỏng',[2,8,18,7],'[Ar] 3d¹⁰ 4s² 4p⁵',2.96,11.81,94,-7,59,'−1, +1, +5','#ea580c',[635,583,478],'Phi kim duy nhất ở thể lỏng (nâu đỏ bốc hơi); làm mất màu dung dịch anken ngay tức thì','Thuốc thử nhận biết liên kết đôi C=C, chất chống cháy, tổng hợp dược phẩm'],
  [36,'Kr','Kripton','Krypton',83.798,4,18,4,18,'p','noble_gas','Khí',[2,8,18,8],'[Ar] 3d¹⁰ 4s² 4p⁶',3.00,14.00,88,-157,-153,'0, +2','#e0e7ff',[587,557,432],'Tạo được hợp chất KrF₂ ở điều kiện phóng điện lạnh; vạch phổ cam chuẩn mét cũ','Đèn flash tốc độ cao, kính cửa sổ cách nhiệt, động cơ đẩy ion vệ tinh'],
  [37,'Rb','Rubidi','Rubidium',85.468,5,1,5,1,'s','alkali','Rắn',[2,8,18,8,1],'[Kr] 5s¹',0.82,4.18,265,39,688,'+1','#e11d48',[780,795,420],'Bốc cháy ngay khi tiếp xúc không khí ẩm và nước; ngọn lửa đỏ tím sâu','Đồng hồ nguyên tử Rubidi chuẩn GPS, làm lạnh laser ngưng tụ Bose-Einstein'],
  [38,'Sr','Stronti','Strontium',87.62,5,2,5,2,'s','alkaline_earth','Rắn',[2,8,18,8,2],'[Kr] 5s²',0.95,5.69,219,777,1377,'+2','#ef4444',[687,640,461,408],'Sr + 2H₂O → Sr(OH)₂ + H₂↑; muối stronti nhuộm ngọn lửa màu đỏ son rực rỡ','Pháo hoa đỏ rực, đồng hồ quang học chính xác nhất thế giới, màn hình CRT cũ'],
  [39,'Y','Ytri','Yttrium',88.906,5,3,5,3,'d','transition','Rắn',[2,8,18,9,2],'[Kr] 4d¹ 5s²',1.22,6.22,212,1526,3336,'+3','#f472b6',[643,546,410],'Y₂O₃ tạo chất siêu dẫn nhiệt độ cao YBCO (YBa₂Cu₃O₇) ở 93 K (> Nitơ lỏng)','Laser YAG phẫu thuật, vật liệu siêu dẫn YBCO, đèn LED trắng phát quang YAG:Ce'],
  [40,'Zr','Zirconi','Zirconium',91.224,5,4,5,4,'d','transition','Rắn',[2,8,18,10,2],'[Kr] 4d² 5s²',1.33,6.63,206,1855,4409,'+4','#fef08a',[612,468,360],'Chống ăn mòn axit & kiềm cực mạnh; tiết diện hấp thụ neutron nhiệt cực thấp','Ống bọc thanh nhiên liệu hạt nhân, răng sứ Zirconia, kim cương nhân tạo CZ'],
  [41,'Nb','Niobi','Niobium',92.906,5,5,5,5,'d','transition','Rắn',[2,8,18,12,1],'[Kr] 4d⁴ 5s¹',1.60,6.76,198,2477,4744,'+5','#38bdf8',[534,410,405],'Siêu dẫn ở nhiệt độ chuyển tiếp cao nhất trong các đơn chất (9,2 K)','Nam châm siêu dẫn NbTi/Nb₃Sn trong máy gia tốc CERN LHC & máy chụp MRI'],
  [42,'Mo','Molipđen','Molybdenum',95.95,5,6,5,6,'d','transition','Rắn',[2,8,18,13,1],'[Kr] 4d⁵ 5s¹',2.16,7.09,190,2623,4639,'+4, +6','#86efac',[550,390,380],'Nhiệt độ nóng chảy cực cao (2623°C); tạo MoS₂ cấu trúc lớp trơn mượt','Thép hợp kim chịu nhiệt nòng súng/tua-bin, chất bôi trơn rắn MoS₂, enzyme cố định đạm'],
  [43,'Tc','Tecneti','Technetium',98,5,7,5,7,'d','transition','Rắn',[2,8,18,13,2],'[Kr] 4d⁵ 5s²',1.90,7.28,183,2157,4265,'+4, +7','#fb923c',[429,426,363],'Nguyên tố nhẹ nhất không có đồng vị bền (Z=43); phát tia gamma 140 keV (⁹⁹ᵐTc)','Đồng vị ⁹⁹ᵐTc chiếm >80% ca xạ hình chẩn đoán ung thư & tim mạch hạt nhân'],
  [44,'Ru','Ruteni','Ruthenium',101.07,5,8,5,8,'d','transition','Rắn',[2,8,18,15,1],'[Kr] 4d⁷ 5s¹',2.20,7.36,178,2334,4150,'+3, +4, +8','#22d3ee',[517,455,372],'Không tan trong nước cường toan ở t° thường; tạo phức chất xúc tác chuyển hóa olefin','Xúc tác hóa học hữu cơ đạt giải Nobel (Grubbs), ngòi bút máy cao cấp, chip từ cứng'],
  [45,'Rh','Rodi','Rhodium',102.91,5,9,5,9,'d','transition','Rắn',[2,8,18,16,1],'[Kr] 4d⁸ 5s¹',2.28,7.46,173,1964,3695,'+3','#e2e8f0',[559,437,369],'Kim loại quý phản xạ ánh sáng mạnh nhất & chống oxi hóa tuyệt đối','Bộ xúc tác 3 chiều khử khí độc NOx ống xả ô tô, mạ trang sức bạch kim'],
  [46,'Pd','Paladi','Palladium',106.42,5,10,5,10,'d','transition','Rắn',[2,8,18,18],'[Kr] 4d¹⁰',2.20,8.34,169,1555,2963,'+2, +4','#cbd5e1',[529,421,363],'Hấp thụ tới 900 lần thể tích khí H₂ ở nhiệt độ phòng; xúc tác phản ứng ghép nối C–C','Màng lọc tinh chế khí Hydro siêu sạch, tụ gốm MLCC, xúc tác Heck/Suzuki'],
  [47,'Ag','Bạc','Silver',107.87,5,11,5,11,'d','transition','Rắn',[2,8,18,18,1],'[Kr] 4d¹⁰ 5s¹',1.93,7.58,165,962,2162,'+1','#f8fafc',[546,521,338,328],'Dẫn điện & dẫn nhiệt cao nhất mọi kim loại; Ag⁺ + Cl⁻ → AgCl↓ trắng hóa đen dưới ánh sáng','Mạch điện tử chính xác, tráng gương, kháng khuẩn nano bạc y tế, pin mặt trời'],
  [48,'Cd','Cadimi','Cadmium',112.41,5,12,5,12,'d','transition','Rắn',[2,8,18,18,2],'[Kr] 4d¹⁰ 5s²',1.69,8.99,161,321,767,'+2','#38bdf8',[644,508,480,468],'Cd²⁺ + S²⁻ → CdS↓ màu vàng rực; hấp thụ mạnh neutron nhiệt trong lò hạt nhân','Chấm lượng tử QLED (CdSe), thanh điều khiển lò phản ứng, pin Ni–Cd cũ'],
  [49,'In','Indi','Indium',114.82,5,13,5,13,'p','post_transition','Rắn',[2,8,18,18,3],'[Kr] 4d¹⁰ 5s² 5p¹',1.78,5.79,156,157,2072,'+3','#6366f1',[451,410,325],'Kim loại mềm uốn cong phát tiếng kêu "kẽo kẹt"; đặt tên theo vạch phổ chàm Indigo','Lớp phủ dẫn điện trong suốt ITO cho 100% màn hình cảm ứng điện thoại & LCD'],
  [50,'Sn','Thiếc','Solder/Tin',118.71,5,14,5,14,'p','post_transition','Rắn',[2,8,18,18,4],'[Kr] 4d¹⁰ 5s² 5p²',1.96,7.34,145,232,2602,'+2, +4','#93c5fd',[452,326,284],'Chuyển thù hình thiếc trắng ↔ thiếc xám dưới 13°C; không gỉ trong môi trường thực phẩm','Thiếc hàn linh kiện điện tử (không chì SAC), tráng vỏ hộp thực phẩm, hợp kim đồng thiếc'],
  [51,'Sb','Antimon','Antimony',121.76,5,15,5,15,'p','metalloid','Rắn',[2,8,18,18,5],'[Kr] 4d¹⁰ 5s² 5p³',2.05,8.61,133,631,1587,'−3, +3, +5','#a7f3d0',[403,326,259],'Giãn nở khi đông đặc như nước; Sb₂O₃ chống cháy lan nhựa hiệu quả','Phụ gia chống cháy nhựa vỏ thiết bị điện tử, làm cứng bản cực chì ắc quy'],
  [52,'Te','Telu','Tellurium',127.60,5,16,5,16,'p','metalloid','Rắn',[2,8,18,18,6],'[Kr] 4d¹⁰ 5s² 5p⁴',2.10,9.01,123,450,988,'−2, +4, +6','#67e8f9',[238,225,214],'Bán dẫn CdTe hiệu suất cao; Bi₂Te₃ làm vật liệu nhiệt điện làm lạnh Peltier','Pin mặt trời màng mỏng CdTe, bộ làm lạnh nhiệt điện Peltier, đĩa quang ghi lại'],
  [53,'I','Iot','Iodine',126.90,5,17,5,17,'p','halogen','Rắn',[2,8,18,18,7],'[Kr] 4d¹⁰ 5s² 5p⁵',2.66,10.45,115,114,184,'−1, +1, +5, +7','#c084fc',[608,546,516],'Tinh thể tím đen thăng hoa thành hơi tím đẹp; tạo phức xanh tím đậm với hồ tinh bột','Sát trùng povidon-iodine, muối iot phòng bướu cổ (tổng hợp hormone tuyến giáp T₃/T₄)'],
  [54,'Xe','Xenon','Xenon',131.29,5,18,5,18,'p','noble_gas','Khí',[2,8,18,18,8],'[Kr] 4d¹⁰ 5s² 5p⁶',2.60,12.13,108,-112,-108,'0, +2, +4, +6, +8','#60a5fa',[687,529,484,467],'Khí hiếm đầu tiên tổng hợp được hợp chất thực (XePtF₆, XeF₄) bởi Neil Bartlett 1962','Động cơ đẩy ion tàu vũ trụ không gian sâu (Dawn, Starlink), đèn pha Xenon, gây mê'],
  [55,'Cs','Xesi','Cesium',132.91,6,1,6,1,'s','alkali','Rắn',[2,8,18,18,8,1],'[Xe] 6s¹',0.79,3.89,298,28.5,671,'+1','#38bdf8',[852,697,459,455],'Kim loại hoạt động hóa học mạnh nhất; nổ tung ngay trong nước đá −116°C; ngọn lửa xanh lam','Định nghĩa chuẩn 1 giây SI theo tần số siêu tinh tế 9.192.631.770 Hz của ¹³³Cs'],
  [56,'Ba','Bari','Barium',137.33,6,2,6,2,'s','alkaline_earth','Rắn',[2,8,18,18,8,2],'[Xe] 6s²',0.89,5.21,253,727,1897,'+2','#4ade80',[554,493,455],'Ba²⁺ + SO₄²⁻ → BaSO₄↓ trắng không tan trong mọi axit; nhuộm ngọn lửa xanh lục táo','Thuốc cản quang X-quang dạ dày BaSO₄ (an toàn vì không tan), pháo hoa xanh lá'],
  [57,'La','Lantan','Lanthanum',138.91,6,3,8,3,'f','lanthanide','Rắn',[2,8,18,18,9,2],'[Xe] 5d¹ 6s²',1.10,5.58,195,920,3464,'+3','#34d399',[625,545,492],'Kim loại đất hiếm mềm dẻo; hợp kim LaNi₅ hấp thụ khí H₂ thuận nghịch mật độ cao','Thấu kính máy ảnh chiết suất cao ít tán sắc, điện cực âm pin NiMH xe hybrid'],
  [58,'Ce','Xeri','Cerium',140.12,6,3,8,4,'f','lanthanide','Rắn',[2,8,18,19,9,2],'[Xe] 4f¹ 5d¹ 6s²',1.12,5.54,185,795,3443,'+3, +4','#fbbf24',[551,456,418],'Đất hiếm phổ biến nhất; hợp kim Ce–Fe đánh ra tia lửa sáng khi quẹt đá lửa bật lửa','Đá lửa bật lửa, bột đánh bóng mặt kính quang học CeO₂, xúc tác lọc khí thải'],
  [59,'Pr','Praseođim','Praseodymium',140.91,6,3,8,5,'f','lanthanide','Rắn',[2,8,18,21,8,2],'[Xe] 4f³ 6s²',1.13,5.47,247,935,3520,'+3','#a3e635',[522,495,418],'Ion Pr³⁺ tạo màu vàng lục tươi cho thủy tinh và lọc ánh sáng vàng chói của Natri','Kính bảo hộ thợ thổi thủy tinh & thợ hàn, nam châm siêu mạnh, lõi cáp quang'],
  [60,'Nd','Neođim','Neodymium',144.24,6,3,8,6,'f','lanthanide','Rắn',[2,8,18,22,8,2],'[Xe] 4f⁴ 6s²',1.14,5.53,206,1024,3074,'+3','#e879f9',[562,492,430],'Ion Nd³⁺ đổi màu thủy tinh từ tím dưới đèn sợi đốt sang xanh lam dưới đèn huỳnh quang','Nam châm vĩnh cửu mạnh nhất thế giới Nd₂Fe₁₄B cho động cơ xe điện, tua-bin gió, tai nghe'],
  [61,'Pm','Prometi','Promethium',145,6,3,8,7,'f','lanthanide','Rắn',[2,8,18,23,8,2],'[Xe] 4f⁵ 6s²',1.13,5.58,205,1042,3000,'+3','#34d399',[652,489,398],'Nguyên tố họ Lanthan duy nhất phóng xạ không có đồng vị bền (chu kỳ bán rã 2,6 năm)','Pin hạt nhân mini phát điện cho tàu thăm dò vũ trụ & máy điều hòa nhịp tim cổ điển'],
  [62,'Sm','Samari','Samarium',150.36,6,3,8,8,'f','lanthanide','Rắn',[2,8,18,24,8,2],'[Xe] 4f⁶ 6s²',1.17,5.64,238,1072,1794,'+2, +3','#fb7185',[528,442,429],'SmI₂ là chất khử 1-electron nổi tiếng trong tổng hợp hữu cơ chọn lọc lập thể','Nam châm chịu nhiệt cao SmCo₅ (>300°C) trong động cơ tên lửa & hàng không'],
  [63,'Eu','Europi','Europium',151.96,6,3,8,9,'f','lanthanide','Rắn',[2,8,18,25,8,2],'[Xe] 4f⁷ 6s²',1.20,5.67,231,826,1529,'+2, +3','#f43f5e',[619,466,420],'Phát huỳnh quang đỏ (Eu³⁺) và xanh lam (Eu²⁺) cực sắc nét dưới tia UV','Chất chống giả tờ tiền Euro phát quang dưới đèn UV, bột huỳnh quang màn hình & LED'],
  [64,'Gd','Gađolini','Gadolinium',157.25,6,3,8,10,'f','lanthanide','Rắn',[2,8,18,25,9,2],'[Xe] 4f⁷ 5d¹ 6s²',1.20,6.15,233,1312,3273,'+3','#38bdf8',[510,422,376],'Có 7 electron độc thân 4f⁷ nên tính thuận từ mạnh nhất & tiết diện bắt neutron cực cao','Thuốc tiêm tương phản chụp cộng hưởng từ MRI não/mạch máu, làm lạnh từ tính'],
  [65,'Tb','Terbi','Terbium',158.93,6,3,8,11,'f','lanthanide','Rắn',[2,8,18,27,8,2],'[Xe] 4f⁹ 6s²',1.20,5.86,225,1356,3230,'+3','#4ade80',[543,432,387],'Ion Tb³⁺ phát huỳnh quang xanh lục ngọc cực mạnh ở 545 nm khi kích thích UV','Bột phát quang xanh lục của đèn LED & màn hình, hợp kim Terfenol-D biến hình theo từ trường'],
  [66,'Dy','Đisprosi','Dysprosium',162.50,6,3,8,12,'f','lanthanide','Rắn',[2,8,18,28,8,2],'[Xe] 4f¹⁰ 6s²',1.22,5.94,228,1407,2567,'+3','#fde047',[421,404,353],'Mômen từ nguyên tử lớn bậc nhất; giữ từ tính cho nam châm NdFeB ở nhiệt độ cao','Pha vào nam châm động cơ xe điện chống mất từ khi nóng, thanh điều khiển lò hạt nhân'],
  [67,'Ho','Honmi','Holmium',164.93,6,3,8,13,'f','lanthanide','Rắn',[2,8,18,29,8,2],'[Xe] 4f¹¹ 6s²',1.23,6.02,226,1461,2720,'+3','#fbbf24',[598,410,389],'Sở hữu từ tính mạnh nhất trong tất cả các nguyên tố tự nhiên','Tạo từ trường siêu cao tập trung từ thông, laser Holmium-YAG tán sỏi thận y khoa'],
  [68,'Er','Erbi','Erbium',167.26,6,3,8,14,'f','lanthanide','Rắn',[2,8,18,30,8,2],'[Xe] 4f¹² 6s²',1.24,6.11,226,1529,2868,'+3','#f472b6',[582,400,386],'Ion Er³⁺ khuếch đại trực tiếp tín hiệu ánh sáng 1550 nm trong sợi thủy tinh mà không cần đổi điện','Bộ khuếch đại quang EDFA xương sống mạng Internet cáp quang toàn cầu, kính hồng phấn'],
  [69,'Tm','Tuli','Thulium',168.93,6,3,8,15,'f','lanthanide','Rắn',[2,8,18,31,8,2],'[Xe] 4f¹³ 6s²',1.25,6.18,222,1545,1950,'+3','#60a5fa',[563,410,371],'Lanthanide hiếm nhất; phát tia X nhẹ khi kích hoạt đồng vị ¹⁷⁰Tm','Máy chụp X-quang di động cầm tay không cần điện cao thế, laser phẫu thuật mô mềm'],
  [70,'Yb','Yterbi','Ytterbium',173.05,6,3,8,16,'f','lanthanide','Rắn',[2,8,18,32,8,2],'[Xe] 4f¹⁴ 6s²',1.10,6.25,222,824,1196,'+2, +3','#86efac',[555,399,369],'Lớp 4f¹⁴ bão hòa nên chỉ còn 2 e 6s; dùng trong đồng hồ mạng quang học chính xác 10⁻¹⁸','Đồng hồ quang học Yb siêu chính xác, laser sợi công nghiệp cắt kim loại, máy đo ứng suất địa chấn'],
  [71,'Lu','Luteti','Lutetium',174.97,6,3,8,17,'d','lanthanide','Rắn',[2,8,18,32,9,2],'[Xe] 4f¹⁴ 5d¹ 6s²',1.27,5.43,217,1652,3402,'+3','#cbd5e1',[547,451,350],'Nguyên tố nặng nhất & cứng nhất họ Lanthan; mở đầu trở lại phân lớp 5d','Tinh thể nhấp nháy LSO trong máy quét ung thư PET Scan, xúc tác cracking dầu mỏ'],
  [72,'Hf','Hafni','Hafnium',178.49,6,4,6,4,'d','transition','Rắn',[2,8,18,32,10,2],'[Xe] 4f¹⁴ 5d² 6s²',1.30,6.83,208,2233,4603,'+4','#e2e8f0',[409,368,307],'Trái ngược hoàn toàn với Zr, Hafni hấp thụ neutron mạnh gấp 600 lần; lớp HfO₂ siêu cách điện','Lớp điện môi high-κ HfO₂ trong mọi chip xử lý CPU dưới 45 nm, thanh kiểm soát tàu ngầm hạt nhân'],
  [73,'Ta','Tantan','Tantalum',180.95,6,5,6,5,'d','transition','Rắn',[2,8,18,32,11,2],'[Xe] 4f¹⁴ 5d³ 6s²',1.50,7.55,200,3017,5458,'+5','#93c5fd',[540,481,362],'Miễn nhiễm với hầu hết axit ở <150°C kể cả nước cường toan; tương thích mô người tuyệt đối','Tụ điện Tantalum siêu nhỏ trong smartphone, đinh vít/lưới sọ cấy ghép xương y khoa'],
  [74,'W','Vonfram','Tungsten',183.84,6,6,6,6,'d','transition','Rắn',[2,8,18,32,12,2],'[Xe] 4f¹⁴ 5d⁴ 6s²',2.36,7.86,193,3422,5930,'+4, +6','#fef08a',[522,430,400],'Điểm nóng chảy cao nhất trong mọi kim loại nguyên chất (3.422°C); tỉ trọng 19,25 g/cm³','Dây tóc bóng đèn, mũi khoan siêu cứng WC, điện cực hàn TIG, tấm chắn bức xạ'],
  [75,'Re','Reni','Rhenium',186.21,6,7,6,7,'d','transition','Rắn',[2,8,18,32,13,2],'[Xe] 4f¹⁴ 5d⁵ 6s²',1.90,7.83,188,3186,5596,'+4, +7','#67e8f9',[527,489,346],'Điểm sôi gần cao nhất; chống rão ở >1.000°C khi pha vào siêu hợp kim đơn tinh thể','Cánh tuabin động cơ máy bay phản lực thế hệ mới, xúc tác Pt–Re tinh chế xăng'],
  [76,'Os','Osmi','Osmium',190.23,6,8,6,8,'d','transition','Rắn',[2,8,18,32,14,2],'[Xe] 4f¹⁴ 5d⁶ 6s²',2.20,8.44,185,3033,5012,'+4, +8','#60a5fa',[442,426,305],'Vật chất tự nhiên đặc nặng nhất Trái Đất (22,59 g/cm³); tạo OsO₄ ở số oxi hóa +8','Đầu kim máy hát, ngòi bút vĩnh cửu, thuốc nhuộm mẫu mô kính hiển vi điện tử OsO₄'],
  [77,'Ir','Iridi','Iridium',192.22,6,9,6,9,'d','transition','Rắn',[2,8,18,32,15,2],'[Xe] 4f¹⁴ 5d⁷ 6s²',2.20,8.97,180,2446,4130,'+3, +4','#a5b4fc',[545,380,351],'Kim loại chống ăn mòn hóa học bậc nhất; lớp địa tầng giàu Iridi minh chứng thiên thạch diệt khủng long','Bugi đánh lửa siêu bền, nồi nung tinh thể đơn ở >2.000°C, cực OLED phát quang lân quang'],
  [78,'Pt','Bạch kim','Platinum',195.08,6,10,6,10,'d','transition','Rắn',[2,8,18,32,16,2],'[Xe] 4f¹⁴ 5d⁹ 6s¹',2.28,8.96,177,1768,3825,'+2, +4','#f8fafc',[548,506,306],'Không bị oxi hóa ở mọi nhiệt độ; chỉ tan trong nước cường toan (HCl + HNO₃); xúc tác điện cực chuẩn SHE','Pin nhiên liệu Hydro, bộ lọc khí thải ô tô, thuốc hóa trị ung thư Cisplatin, trang sức'],
  [79,'Au','Vàng','Gold',196.97,6,11,6,11,'d','transition','Rắn',[2,8,18,32,18,1],'[Xe] 4f¹⁴ 5d¹⁰ 6s¹',2.54,9.23,174,1064,2970,'+1, +3','#facc15',[628,479,312],'Màu vàng do hiệu ứng tương đối tính thu hẹp khe năng lượng 5d→6s; dát mỏng tới 0,1 µm xuyên sáng','Chân tiếp xúc vi mạch chống oxi hóa, hạt nano vàng chẩn đoán y sinh, dự trữ tài chính'],
  [80,'Hg','Thủy ngân','Mercury',200.59,6,12,6,12,'d','transition','Lỏng',[2,8,18,32,18,2],'[Xe] 4f¹⁴ 5d¹⁰ 6s²',2.00,10.44,171,-39,357,'+1, +2','#38bdf8',[579,546,436,405,254],'Kim loại duy nhất lỏng ở 25°C do hiệu ứng co tương đối tính orbital 6s²; tạo hỗn hống với Au, Ag','Đèn huỳnh quang phát tia UV 254 nm, áp kế Torricelli, nhiệt kế phòng lab (đang thay thế)'],
  [81,'Tl','Tali','Thallium',204.38,6,13,6,13,'p','post_transition','Rắn',[2,8,18,32,18,3],'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹',1.62,6.11,156,304,1473,'+1, +3','#22c55e',[535,378,352],'Vạch phổ xanh lá cây tươi 535 nm (chữ Hy Lạp thallos = chồi non); Tl⁺ giống K⁺ nhưng rất độc','Đầu dò nhấp nháy NaI(Tl) đo tia gamma, tế bào quang trở hồng ngoại, xạ hình tim ²⁰¹Tl'],
  [82,'Pb','Chì','Lead',207.2,6,14,6,14,'p','post_transition','Rắn',[2,8,18,32,18,4],'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²',1.87,7.42,154,327,1749,'+2, +4','#93c5fd',[406,368,283],'Tạo màng thụ động PbSO₄/PbCO₃; Pb²⁺ + 2I⁻ → PbI₂↓ tinh thể vàng óng ánh ("mưa vàng")','Ắc quy chì-axit (Pb/PbO₂/H₂SO₄), áo giáp chắn tia X & bức xạ gamma, thủy tinh pha lê'],
  [83,'Bi','Bitmut','Bismuth',208.98,6,15,6,15,'p','post_transition','Rắn',[2,8,18,32,18,5],'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³',2.02,7.29,143,271,1564,'+3, +5','#c084fc',[472,306,290],'Tinh thể bậc thang cầu vồng do lớp oxit giao thoa ánh sáng; hầu như không phóng xạ (T₁/₂ = 10¹⁹ năm)','Thuốc trị loét dạ dày Pepto-Bismol, chất hàn thay chì không độc, hợp kim cầu chì nhiệt độ thấp'],
  [84,'Po','Poloni','Polonium',209,6,16,6,16,'p','post_transition','Rắn',[2,8,18,32,18,6],'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴',2.00,8.42,135,254,962,'−2, +2, +4','#fb7185',[417,300,245],'Nguyên tố phóng xạ mạnh do Marie & Pierre Curie tìm ra (1898); phát hạt alpha tỏa nhiệt lớn','Nguồn nhiệt RTG xe tự hành Lunokhod, bàn chải khử tĩnh điện chính xác (²¹⁰Po)'],
  [85,'At','Astatin','Astatine',210,6,17,6,17,'p','halogen','Rắn',[2,8,18,32,18,7],'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵',2.20,9.32,127,302,337,'−1, +1, +5','#fb923c',[224,216],'Nguyên tố tự nhiên hiếm nhất vỏ Trái Đất (<30 g toàn cầu); có tính kim loại nhẹ hơn Iot','Liệu pháp alpha nhắm trúng đích tiêu diệt tế bào ung thư (²¹¹At) đang thử nghiệm lâm sàng'],
  [86,'Rn','Radon','Radon',222,6,18,6,18,'p','noble_gas','Khí',[2,8,18,32,18,8],'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶',2.20,10.75,120,-71,-62,'0, +2','#e879f9',[745,705,434],'Khí phóng xạ nặng nhất sinh ra từ phân rã tự nhiên của Urani trong đá granit','Cảnh báo thông gió tầng hầm chống phóng xạ tự nhiên, chỉ thị dự báo động đất'],
  [87,'Fr','Franxi','Francium',223,7,1,7,1,'s','alkali','Rắn',[2,8,18,32,18,8,1],'[Rn] 7s¹',0.70,4.07,348,27,677,'+1','#f43f5e',[718,817],'Kim loại kiềm nặng nhất & kém bền nhất (T₁/₂ = 22 phút); hiệu ứng tương đối tính làm 7s co lại','Nghiên cứu bẫy nguyên tử siêu lạnh kiểm chứng phá vỡ đối xứng chẵn-lẻ hạt nhân'],
  [88,'Ra','Rađi','Radium',226,7,2,7,2,'s','alkaline_earth','Rắn',[2,8,18,32,18,8,2],'[Rn] 7s²',0.90,5.28,283,700,1737,'+2','#38bdf8',[483,468,381],'Phát sáng xanh lam mờ trong không khí do bức xạ ion hóa N₂; do vợ chồng Curie tách chiết 1898','Nguồn phát hiện tượng phóng xạ lịch sử, điều chế ²²³Ra điều trị di căn xương'],
  [89,'Ac','Actini','Actinium',227,7,3,9,3,'f','actinide','Rắn',[2,8,18,32,18,9,2],'[Rn] 6d¹ 7s²',1.10,5.17,195,1050,3200,'+3','#38bdf8',[481,418,408],'Phát ánh sáng xanh Cherenkov nhẹ trong bóng tối; mở đầu dãy 15 nguyên tố Actinide','Xạ trị miễn dịch nhắm đích bằng hạt alpha (²²⁵Ac) tiêu diệt khối u ác tính'],
  [90,'Th','Thori','Thorium',232.04,7,3,9,4,'f','actinide','Rắn',[2,8,18,32,18,10,2],'[Rn] 6d² 7s²',1.30,6.31,180,1750,4788,'+4','#e2e8f0',[486,439,401],'Trữ lượng gấp 3–4 lần Urani; ThO₂ có nhiệt độ nóng chảy 3.390°C cao nhất mọi oxit','Nhiên liệu lò phản ứng muối nóng chảy MSR thế hệ IV an toàn hơn Urani, mỏ hàn TIG'],
  [91,'Pa','Protactini','Protactinium',231.04,7,3,9,5,'f','actinide','Rắn',[2,8,18,32,20,9,2],'[Rn] 5f² 6d¹ 7s²',1.50,5.89,180,1568,4027,'+4, +5','#fbbf24',[421,398],'Cực hiếm và độc phóng xạ; là cầu nối phân rã trung gian giữa ²³⁵U và ²²⁷Ac','Định tuổi trầm tích đáy đại dương cổ đại bằng tỉ lệ đồng vị ²³¹Pa / ²³⁰Th'],
  [92,'U','Urani','Uranium',238.03,7,3,9,6,'f','actinide','Rắn',[2,8,18,32,21,9,2],'[Rn] 5f³ 6d¹ 7s²',1.38,6.19,175,1132,4131,'+4, +6','#4ade80',[591,549,409],'²³⁵U phân hạch khi bắt neutron chậm giải phóng ~200 MeV/hạt nhân & 2–3 neutron mới','Nhiên liệu nhà máy điện hạt nhân, định tuổi đá cổ Trái Đất U–Pb, thủy tinh phát huỳnh quang xanh'],
  [93,'Np','Neptuni','Neptunium',237,7,3,9,7,'f','actinide','Rắn',[2,8,18,32,22,9,2],'[Rn] 5f⁴ 6d¹ 7s²',1.36,6.27,175,644,3902,'+3..+7','#34d399',[504,415],'Nguyên tố siêu Urani tổng hợp đầu tiên (1940); có tới 5 trạng thái oxi hóa từ +3 đến +7','Nguyên liệu bắn neutron điều chế đồng vị năng lượng vũ trụ ²³⁸Pu'],
  [94,'Pu','Plutoni','Plutonium',244,7,3,9,8,'f','actinide','Rắn',[2,8,18,32,24,8,2],'[Rn] 5f⁶ 7s²',1.28,6.03,175,639,3228,'+3..+6','#f97316',[453,420,398],'Có tới 6 dạng thù hình tinh thể phức tạp; ²³⁸Pu tự tỏa nhiệt 0,56 W/g phát sáng đỏ','Pin đồng vị phóng xạ RTG cấp điện cho tàu Voyager, Curiosity, Perseverance trên Sao Hỏa'],
  [95,'Am','Americi','Americium',243,7,3,9,9,'f','actinide','Rắn',[2,8,18,32,25,8,2],'[Rn] 5f⁷ 7s²',1.30,5.97,175,1176,2607,'+3, +4','#fb923c',[466,430,367],'Đồng vị ²⁴¹Am phát hạt alpha ion hóa luồng không khí ổn định trong buồng đo','Cảm biến báo khói ion hóa dân dụng trong hàng triệu tòa nhà, nguồn neutron thăm dò dầu khí'],
  [96,'Cm','Curi','Curium',247,7,3,9,10,'f','actinide','Rắn',[2,8,18,32,25,9,2],'[Rn] 5f⁷ 6d¹ 7s²',1.30,5.99,176,1340,3110,'+3','#a855f7',[420,395],'Phát quang tím hồng trong bóng tối do cường độ phân rã alpha rất cao','Nguồn tia alpha trong máy quang phổ APXS phân tích đất đá Sao Hỏa & sao chổi'],
  [97,'Bk','Berkeli','Berkelium',247,7,3,9,11,'f','actinide','Rắn',[2,8,18,32,27,8,2],'[Rn] 5f⁹ 7s²',1.30,6.20,176,986,2627,'+3, +4','#60a5fa',[390,375],'Tổng hợp tại Berkeley; đóng vai trò bia hạt nhân then chốt tạo Tennessine (Z=117)','Tổng hợp nguyên tố siêu nặng trong máy gia tốc ion nặng'],
  [98,'Cf','Californi','Californium',251,7,3,9,12,'f','actinide','Rắn',[2,8,18,32,28,8,2],'[Rn] 5f¹⁰ 7s²',1.30,6.28,176,900,1470,'+3','#38bdf8',[442,380],'1 microgam ²⁵²Cf phát ra 2,3 triệu neutron mỗi giây bằng phân hạch tự phát','Khởi động lò phản ứng hạt nhân, dò quặng vàng/bạc & vết nứt cánh máy bay bằng neutron'],
  [99,'Es','Einsteini','Einsteinium',252,7,3,9,13,'f','actinide','Rắn',[2,8,18,32,29,8,2],'[Rn] 5f¹¹ 7s²',1.30,6.42,176,860,996,'+3','#38bdf8',[410,360],'Phát hiện trong tro bụi vụ nổ nhiệt hạch Ivy Mike (1952); bức xạ làm hỏng chính mạng tinh thể nó','Nghiên cứu cấu trúc hóa học f-orbital giới hạn & tổng hợp Mendelevi'],
  [100,'Fm','Fecmi','Fermium',257,7,3,9,14,'f','actinide','Rắn',[2,8,18,32,30,8,2],'[Rn] 5f¹² 7s²',1.30,6.50,176,1527,null,'+3','#e879f9',[400],'Nguyên tố nặng nhất có thể tạo ra bằng cách bắn phá neutron; chỉ có lượng siêu vi','Nghiên cứu vật lí hạt nhân siêu nặng và giới hạn bắt neutron (r-process)'],
  [101,'Md','Mendelevi','Mendelevium',258,7,3,9,15,'f','actinide','Rắn',[2,8,18,32,31,8,2],'[Rn] 5f¹³ 7s²',1.30,6.58,176,827,null,'+2, +3','#c084fc',[400],'Đặt tên vinh danh Dmitri Mendeleev; nghiên cứu từng nguyên tử một bằng hóa học nhanh','Nghiên cứu hóa học đơn nguyên tử & trạng thái oxi hóa +2 bất thường cuối dãy 5f'],
  [102,'No','Nobeli','Nobelium',259,7,3,9,16,'f','actinide','Rắn',[2,8,18,32,32,8,2],'[Rn] 5f¹⁴ 7s²',1.30,6.65,176,827,null,'+2, +3','#818cf8',[400],'Phân lớp 5f¹⁴ bão hòa làm trạng thái oxi hóa +2 bền hơn +3 trong dung dịch','Nghiên cứu hiệu ứng tương đối tính lên cấu hình điện tử lớp ngoài cùng'],
  [103,'Lr','Lawrenci','Lawrencium',266,7,3,9,17,'d','actinide','Rắn',[2,8,18,32,32,8,3],'[Rn] 5f¹⁴ 7s² 7p¹',1.30,4.90,176,1627,null,'+3','#fb923c',[400],'Hiệu ứng tương đối tính đưa electron cuối cùng vào orbital 7p¹ thay vì 6d¹','Kiểm chứng lý thuyết cơ học lượng tử tương đối tính cuối dãy Actinide'],
  [104,'Rf','Rutherfordi','Rutherfordium',267,7,4,7,4,'d','transition','Rắn',[2,8,18,32,32,10,2],'[Rn] 5f¹⁴ 6d² 7s²',null,6.0,157,2100,5500,'+4','#38bdf8',[400],'Nguyên tố chuyển tiếp siêu nặng đầu tiên (nhóm IVB dưới Hf), T₁/₂ ~48 phút (²⁶⁷Rf)','Thí nghiệm sắc ký pha khí kiểm tra độ bền phức clorua tương tự Zr/Hf'],
  [105,'Db','Dubni','Dubnium',268,7,5,7,5,'d','transition','Rắn',[2,8,18,32,32,11,2],'[Rn] 5f¹⁴ 6d³ 7s²',null,6.8,149,null,null,'+5','#60a5fa',[400],'Đặt tên theo Viện Liên hiệp Nghiên cứu Hạt nhân Dubna; tính chất gần Ta/Nb','Nghiên cứu động học phức halogenua siêu nặng trong phòng thí nghiệm hạt nhân'],
  [106,'Sg','Seaborgi','Seaborgium',269,7,6,7,6,'d','transition','Rắn',[2,8,18,32,32,12,2],'[Rn] 5f¹⁴ 6d⁴ 7s²',null,7.8,143,null,null,'+6','#818cf8',[400],'Tạo phân tử khí bay hơi Sg(CO)₆ và SgO₂Cl₂ tương tự Vonfram (W)','Chứng minh định luật tuần hoàn vẫn đứng vững ở hàng Z=106 với liên kết phối trí CO'],
  [107,'Bh','Bohri','Bohrium',270,7,7,7,7,'d','transition','Rắn',[2,8,18,32,32,13,2],'[Rn] 5f¹⁴ 6d⁵ 7s²',null,7.7,141,null,null,'+7','#a855f7',[400],'Đặt tên theo Niels Bohr; tạo oxiclorua BhO₃Cl bay hơi giống ReO₃Cl','Nghiên cứu tương đồng nhóm VIIB giữa Mn, Tc, Re và Bh'],
  [108,'Hs','Hassi','Hassium',277,7,8,7,8,'d','transition','Rắn',[2,8,18,32,32,14,2],'[Rn] 5f¹⁴ 6d⁶ 7s²',null,7.6,134,null,null,'+8','#22d3ee',[400],'Tổng hợp được phân tử bay hơi HsO₄ (số oxi hóa +8) giống OsO₄ ở nhiệt độ phòng','Kiểm chứng trực tiếp hóa học nhóm VIII B của nguyên tố siêu nặng'],
  [109,'Mt','Meitneri','Meitnerium',278,7,9,7,9,'d','transition','Rắn',[2,8,18,32,32,15,2],'[Rn] 5f¹⁴ 6d⁷ 7s²',null,8.3,129,null,null,'+3','#e2e8f0',[400],'Vinh danh nhà vật lí Lise Meitner (người giải thích phản ứng phân hạch hạt nhân)','Nghiên cứu vật lí hạt nhân siêu nặng & ổn định vỏ hạt nhân'],
  [110,'Ds','Darmstadti','Darmstadtium',281,7,10,7,10,'d','transition','Rắn',[2,8,18,32,32,17,1],'[Rn] 5f¹⁴ 6d⁸ 7s²',null,9.6,128,null,null,'+2, +4','#cbd5e1',[400],'Tổng hợp tại GSI Darmstadt bằng phản ứng ²⁰⁸Pb + ⁶²Ni → ²⁶⁹Ds + n','Nghiên cứu vùng biến dạng hạt nhân cận đảo ổn định'],
  [111,'Rg','Roentgeni','Roentgenium',282,7,11,7,11,'d','transition','Rắn',[2,8,18,32,32,17,2],'[Rn] 5f¹⁴ 6d⁹ 7s²',null,10.6,121,null,null,'+3, +5','#fbbf24',[400],'Cùng nhóm với Cu, Ag, Au nhưng dự đoán có màu bạc do hiệu ứng tương đối tính mạnh hơn Vàng','Thử nghiệm mô hình cơ học lượng tử tương đối tính của nhóm kim loại quý'],
  [112,'Cn','Copernici','Copernicium',285,7,12,7,12,'d','transition','Lỏng',[2,8,18,32,32,18,2],'[Rn] 5f¹⁴ 6d¹⁰ 7s²',null,11.97,122,10,67,'+2','#38bdf8',[400],'Hiệu ứng tương đối tính làm lớp 7s² cực bền đến mức Cn rất dễ bay hơi giống khí hiếm/Hg','Nghiên cứu tính chất kim loại lỏng – khí hiếm giao thoa ở Z=112'],
  [113,'Nh','Nihoni','Nihonium',286,7,13,7,13,'p','post_transition','Rắn',[2,8,18,32,32,18,3],'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹',null,7.31,136,430,1130,'+1','#a5b4fc',[400],'Nguyên tố đầu tiên được phát hiện tại châu Á (RIKEN Nhật Bản, 2004)','Nghiên cứu chuỗi phân rã alpha và tương tác spin-quỹ đạo 7p'],
  [114,'Fl','Flerovi','Flerovium',289,7,14,7,14,'p','post_transition','Rắn',[2,8,18,32,32,18,4],'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²',null,8.54,143,200,380,'+2','#93c5fd',[400],'Lớp vỏ giả khép kín 7s² 7p₁/₂² làm Fl hoạt động rất trơ, giống khí hiếm hơn Chì','Nghiên cứu "Đảo ổn định hạt nhân" (N ≈ 184) trong vật lí hạt nhân'],
  [115,'Mc','Moscovi','Moscovium',290,7,15,7,15,'p','post_transition','Rắn',[2,8,18,32,32,18,5],'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³',null,5.58,162,400,1100,'+1, +3','#c084fc',[400],'Tổng hợp bằng bắn phá ²⁴³Am bằng chùm ion ⁴⁸Ca tại JINR Dubna','Khảo sát hiệu ứng tách mức năng lượng p₁/₂ – p₃/₂ của nguyên tố siêu nặng'],
  [116,'Lv','Livermori','Livermorium',293,7,16,7,16,'p','post_transition','Rắn',[2,8,18,32,32,18,6],'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴',null,6.8,175,435,810,'+2, +4','#fb7185',[400],'Phân rã alpha nhanh thành Flerovi (Z=114) chỉ trong vài phần nghìn giây','Nghiên cứu trạng thái oxi hóa +2 ổn định hơn +4/+6 trong nhóm VIA siêu nặng'],
  [117,'Ts','Tennessine','Tennessine',294,7,17,7,17,'p','halogen','Rắn',[2,8,18,32,32,18,7],'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵',null,7.7,165,450,610,'−1, +1, +3','#fb923c',[400],'Thuộc nhóm Halogen nhưng dự đoán có tính bán kim – kim loại rõ rệt do tách spin-quỹ đạo','Nghiên cứu giới hạn tính phi kim của họ Halogen ở chu kì 7'],
  [118,'Og','Oganesson','Oganesson',294,7,18,7,18,'p','noble_gas','Rắn',[2,8,18,32,32,18,8],'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶',null,8.91,157,52,177,'0, +2, +6','#f472b6',[400],'Nguyên tố nặng nhất bảng tuần hoàn; dự đoán là chất bán dẫn rắn thay vì khí trơ ở 25°C','Kiểm chứng lý thuyết phân hủy cấu trúc lớp vỏ lượng tử ở Z=118'],
];

export const PERIODIC_ELEMENTS_118: PeriodicElement118[] = RAW_118.map((r) => ({
  z: r[0],
  sym: r[1],
  nameVi: r[2],
  nameEn: r[3],
  mass: r[4],
  period: r[5],
  group: r[6],
  row: r[7],
  col: r[8],
  block: r[9],
  category: r[10],
  state: r[11],
  shells: r[12],
  config: r[13],
  en: r[14],
  ie: r[15],
  radiusPm: r[16],
  meltC: r[17],
  boilC: r[18],
  oxidation: r[19],
  flameHex: r[20],
  spectralLinesNm: r[21],
  reactionVi: r[22] || 'Tham gia các phản ứng đặc trưng theo nhóm và chu kì trong bảng tuần hoàn.',
  applicationVi: r[23] || 'Ứng dụng trong nghiên cứu vật liệu tiên tiến, hóa học lượng tử và vật lí hạt nhân.',
}));
