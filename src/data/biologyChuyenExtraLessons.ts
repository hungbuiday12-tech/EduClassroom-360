import { Biology3DMode, BiologyLesson, BiologySimType, SpecializedTier } from '../types';
import { makeBioLesson } from './biologyGdpt2018Lessons';

type BioChuyenSpec = [
  id: string,
  grade: BiologyLesson['grade'],
  tier: SpecializedTier,
  stageLabel: string,
  sourceTag: string,
  lessonNumber: number,
  title: string,
  subtitle: string,
  theory1: string,
  theory2: string,
  formula: string,
  sim2d: BiologySimType,
  sim3d: Biology3DMode,
  q: string,
  opts: [string, string, string, string],
  ans: number,
  exp: string,
  essayQ: string,
  essayA: string
];

const SPECS: BioChuyenSpec[] = [
  [
    'bio-chuyen-9-1', 'Lớp 9', 'Cơ bản', 'Khu Chuyên Sinh · Bậc 1: Chuyên 9', 'Tuyển sinh Chuyên Sinh 10', 1,
    'Bài toán Quy đổi Phiên mã – Dịch mã, Polyribosome & Đột biến Điểm Chuỗi Axit Amin',
    'Tính số lượng tRNA, phân tử H₂O giải phóng, năng lượng ATP/GTP dịch mã và biến đổi bộ ba',
    'Một mRNA có $r$ ribosome cùng trượt qua $1$ lần tạo $r$ chuỗi polypeptide, mỗi chuỗi gồm $k = \\frac{N_{\\text{mRNA}}}{3} - 2$ axit amin (đã cắt Met mở đầu và bỏ mã kết thúc).',
    'Số liên kết peptit hình thành trên mỗi chuỗi hoàn chỉnh là $k - 1$ (hoặc $\\frac{N}{6}-2$ tính từ lúc tổng hợp).',
    'n_{\\text{aa môi trường}} = r \\cdot \\left(\\frac{N_{\\text{mRNA}}}{3} - 1\\right)',
    'transcription_translation_2d', 'ribosome_translation_3d',
    'Một gen dài $5100\\text{ Å}$ phiên mã tạo mRNA, trên mỗi mRNA có $5$ ribosome trượt qua $1$ lần không lặp lại. Tổng số axit amin môi trường cung cấp cho cả quá trình dịch mã là:',
    ['A. 2495 aa', 'B. 2490 aa', 'C. 499 aa', 'D. 500 aa'], 0,
    '$N_{\\text{mRNA}} = 1500\\text{ nu} \\Rightarrow 500\\text{ codon} \\Rightarrow 499\\text{ aa/chuỗi} \\Rightarrow 5 \\times 499 = 2495\\text{ aa}$.',
    'Một đột biến thay thế 1 cặp nucleotit biến codon $5\'-UGG-3\'$ (Trp) thành $5\'-UGA-3\'$ (kết thúc). Hậu quả đối với chuỗi protein là gì?', 'Dịch mã dừng sớm đột ngột tại vị trí đó (đột biến vô nghĩa) tạo protein cụt mất chức năng.'
  ],
  [
    'bio-chuyen-9-2', 'Lớp 9', 'Cơ bản', 'Khu Chuyên Sinh · Bậc 1: Chuyên 9', 'Tuyển sinh Chuyên Sinh 10', 2,
    'Bài toán Nguyên phân – Giảm phân – Thụ tinh & Xác định Số NST qua Các Kì',
    'Tính $N_{\\text{NST}}, N_{\\text{cromatit}}, N_{\\text{tâm động}}$ và số nguyên liệu NST mới môi trường cung cấp',
    'Từ $a$ tế bào sinh dưỡng ($2n$) nguyên phân liên tiếp $k$ lần tạo $a\\cdot 2^k$ tế bào con; môi trường cung cấp tương đương $a\\cdot 2n(2^k - 1)$ NST đơn.',
    'Một tế bào sinh tinh ($2n$) giảm phân tạo $4$ tinh trùng ($n$); một tế bào sinh trứng ($2n$) giảm phân tạo $1$ trứng ($n$) và $3$ thể cực.',
    'N_{\\text{NST môi trường}} = a \\cdot 2n \\cdot (2^k - 1)',
    'mitosis_meiosis_2d', 'chromosome_mitosis_3d',
    'Một tế bào xôma của ruồi giấm ($2n = 8$) bước vào **kì sau của nguyên phân**. Trong tế bào lúc này có số lượng NST đơn và số cromatit lần lượt là:',
    ['A. 8 NST kép, 16 cromatit', 'B. 16 NST đơn, 0 cromatit', 'C. 8 NST đơn, 8 cromatit', 'D. 16 NST kép, 32 cromatit'], 1,
    'Ở kì sau nguyên phân, mỗi NST kép tách thành 2 NST đơn phân li về 2 cực nên có $4n = 16$ NST đơn và $0$ cromatit.',
    'Có $5$ tế bào sinh dục sơ khai đực ($2n=14$) nguyên phân $3$ lần rồi tất cả bước vào giảm phân. Tính tổng số tinh trùng tạo thành.', '5 × 2³ × 4 = 160 tinh trùng.'
  ],
  [
    'bio-chuyen-10-2', 'Lớp 10', 'Cơ bản', 'Khu Chuyên Sinh · Bậc 1: Chuyên 10', 'Chuyên Sinh 10 · Thẩm thấu', 2,
    'Thế Nước ($\\Psi_w = \\Psi_s + \\Psi_p$), Áp suất Thẩm thấu Van ’t Hoff & Chiều Dòng Nước',
    'Tính toán định lượng thế thẩm thấu $\\Psi_s = -iCRT$, trạng thái co nguyên sinh giới hạn ($\\Psi_p = 0$)',
    'Nước luôn di chuyển từ nơi có **thế nước cao** ($\\Psi_w$ ít âm hơn) sang nơi có **thế nước thấp** ($\\Psi_w$ âm hơn).',
    'Tại trạng thái cân bằng với dung dịch ngoài: $\\Psi_{w\\text{ tế bào}} = \\Psi_{s\\text{ tế bào}} + \\Psi_p = \\Psi_{s\\text{ dung dịch}}$.',
    '\\Psi_w = \\Psi_s + \\Psi_p,\\quad \\Psi_s = -iCRT',
    'membrane_osmosis_2d', 'phospholipid_bilayer_3d',
    'Một tế bào thực vật có $\\Psi_s = -0{,}8\\text{ MPa}$ và áp suất trương $\\Psi_p = +0{,}3\\text{ MPa}$ được thả vào dung dịch đường có $\\Psi_s = -0{,}6\\text{ MPa}$. Nước sẽ di chuyển như thế nào?',
    ['A. Nước đi từ tế bào ra ngoài dung dịch', 'B. Nước đi từ ngoài dung dịch vào tế bào', 'C. Không có sự di chuyển nước', 'D. Màng sinh chất bị vỡ ngay lập tức'], 0,
    'Thế nước tế bào $= \\Psi_s + \\Psi_p = -0{,}8 + 0{,}3 = -0{,}5\\text{ MPa}$. Vì $-0{,}5 > -0{,}6\\text{ MPa}$, thế nước trong tế bào cao hơn dung dịch nên nước đi TỪ TẾ BÀO RA NGOÀI dung dịch (chọn A).',
    'Đặt lại câu hỏi chuẩn: nếu $\\Psi_{w\\text{ tế bào}} = -0{,}9\\text{ MPa}$ và dung dịch ngoài $-0{,}4\\text{ MPa}$, tính thế nước cân bằng cuối cùng biết bình ngoài rất lớn.', 'Nước đi vào tế bào tới khi Ψp tăng lên giúp Ψw tế bào đạt -0,4 MPa.'
  ],
  [
    'bio-chuyen-10-3', 'Lớp 10', 'Nâng cao', 'Khu Chuyên Sinh · Bậc 2: Chuyên 10', 'HSG Quốc gia Sinh 10', 3,
    'Chuỗi Truyền Electron Ti thể, Năng lượng Tự do ATP & Chất Tách cặp (Uncoupler)',
    'Hiệu ứng DNP/UCP-1 mở kênh proton màng trong ti thể tiêu tán $\\Delta pH$ thành nhiệt (mô mỡ nâu)',
    'Động cơ quay $F_0F_1$ ATP Synthase tổng hợp ATP nhờ gradient proton $\\Delta\\mu_{H^+}$ tạo bởi phức hệ I, III, IV.',
    'Chất tách cặp (DNP, UCP-1) cho $H^+$ rò rỉ xuyên màng không qua ATP Synthase → tiêu thụ $O_2$ và NADH tăng vọt, sinh nhiệt cao nhưng sản lượng ATP giảm mạnh.',
    '\\Delta G_{\\text{ATP}} = \\Delta G^\\circ + RT\\ln\\frac{[\\text{ADP}][P_i]}{[\\text{ATP}]}',
    'cellular_respiration_2d', 'mitochondria_atp_3d',
    'Khi bổ sung chất tách cặp (uncoupler DNP) vào huyền phù ti thể đang hô hấp hiếu khí, chỉ số nào **TĂNG LÊN** còn sản lượng ATP giảm?',
    ['A. Tốc độ tiêu thụ O₂ và tỏa nhiệt', 'B. Tốc độ tổng hợp ATP', 'C. Độ pH xoang gian màng giảm mạnh', 'D. Nồng độ glucose tăng lên'], 0,
    'Không còn ức chế bởi gradient H⁺ ngược, chuỗi truyền e chạy hết công suất tiêu thụ nhiều $O_2$ và giải phóng năng lượng dưới dạng nhiệt.',
    'Giải thích ý nghĩa sinh lí của protein tách cặp thermogenin (UCP-1) trong mô mỡ nâu của động vật ngủ đông và trẻ sơ sinh.', 'Giúp sinh nhiệt giữ ấm cơ thể không cần run cơ bằng cách tách cặp oxi hóa – phosphoryl hóa.'
  ],
  [
    'bio-chuyen-10-4', 'Lớp 10', 'Nâng cao', 'Khu Chuyên Sinh · Bậc 2: Chuyên 10', 'HSG Sinh 10 · Quang hợp', 4,
    'Quang hợp C3, C4, CAM, Enzyme RuBisCO & Hô hấp Sáng (Photorespiration)',
    'Phân tích đường cong bão hòa ánh sáng/CO₂, giải phẫu vòng Kranz ở thực vật C4 và đóng khí khổng ban ngày CAM',
    'Enzyme RuBisCO có hoạt tính kép: gắn $CO_2$ (quang hợp) hoặc gắn $O_2$ (hô hấp sáng khi nhiệt độ cao, khô hạn làm mất tới 30% sản phẩm quang hợp).',
    'Thực vật C4 ($PEPC$ ái lực $CO_2$ cao, giải phẫu Kranz) cô đặc $CO_2$ quanh RuBisCO ở tế bào bao bó mạch nên triệt tiêu hô hấp sáng.',
    '\\text{C4}: \\text{PEP} + \\text{HCO}_3^- \\xrightarrow{\\text{PEPC}} \\text{OAA (4C)} \\to \\text{Malate}',
    'photosynthesis_calvin_2d', 'chloroplast_thylakoid_3d',
    'Trong buồng đo quang hợp kín ở điều kiện ánh sáng mạnh và nồng độ $CO_2$ ban đầu giảm dần, nhóm thực vật nào chết trước do điểm bù $CO_2$ cao?',
    ['A. Cây C3 (lúa, đậu)', 'B. Cây C4 (ngô, mía)', 'C. Cây CAM (dứa, xương rồng)', 'D. Vi khuẩn lam'], 0,
    'Cây C3 có điểm bù $CO_2$ cao (30–70 ppm), trong khi C4 có điểm bù $CO_2$ gần bằng 0–10 ppm nên hút sạch $CO_2$ từ cây C3.',
    'Vì sao cây CAM (xương rồng, dứa) mở khí khổng vào ban đêm để lấy $CO_2$ tích trữ thành axit malic trong không bào?', 'Thích nghi sa mạc khô hạn, ban ngày đóng kín khí khổng chống mất nước.'
  ],
  [
    'bio-chuyen-11-2', 'Lớp 11', 'Nâng cao', 'Khu Chuyên Sinh · Bậc 2: Chuyên 11', 'HSG Quốc gia Sinh 11', 2,
    'Cơ học Tim mạch, Đường cong Phân li Oxy–Hemoglobin (Bohr / Myoglobin / Thai nhi HbF)',
    'Áp suất tâm nhĩ – tâm thất – động mạch chủ trong chu kì tim 0,8s và dịch chuyển đường cong Hb',
    'Chu kì tim $0{,}8\\text{ s}$ ở người trưởng thành ($75\\text{ nhịp/phút}$): Co tâm nhĩ ($0{,}1\\text{ s}$) → Co tâm thất ($0{,}3\\text{ s}$) → Dãn chung ($0{,}4\\text{ s}$).',
    'Hemoglobin thai nhi ($HbF$) có ái lực với $O_2$ cao hơn $HbA$ của mẹ (đường cong dịch trái) giúp thai nhi lấy $O_2$ từ máu mẹ qua nhau thai.',
    'CO = HR \\times (EDV - ESV),\\quad \\text{P}_{50}(\\text{HbF}) < \\text{P}_{50}(\\text{HbA})',
    'bohr_hemoglobin_2d', 'human_heart_3d',
    'Khi chạy bộ đường dài, nhiệt độ cơ tăng lên $39^\\circ\\text{C}$, $pH$ máu giảm nhẹ còn $7{,}2$ và nồng độ 2,3-BPG tăng. Đường cong phân li $Hb–O_2$ thay đổi thế nào?',
    ['A. Dịch sang trái làm tăng giữ O₂', 'B. Dịch sang phải (Hiệu ứng Bohr) tăng giải phóng O₂ cho cơ bắp', 'C. Không đổi hình dạng', 'D. Chuyển thành đường thẳng'], 1,
    'Nhiệt tăng, $H^+$ tăng, $CO_2$ tăng đều đẩy đường cong dịch phải giảm ái lực $Hb$ với $O_2$ để nhả $O_2$ mạnh tại mô hoạt động.',
    'Tại sao van nhĩ–thất và van bán nguyệt không bao giờ mở cùng lúc trong một chu kì tim bình thường?', 'Tâm thất co tăng áp đóng van nhĩ-thất rồi mới đủ áp đẩy mở van bán nguyệt; tâm thất dãn hạ áp đóng van bán nguyệt trước khi mở van nhĩ-thất.'
  ],
  [
    'bio-chuyen-11-3', 'Lớp 11', 'Nâng cao', 'Khu Chuyên Sinh · Bậc 2: Chuyên 11', 'HSG Quốc gia Sinh 11', 3,
    'Sinh lí Thận: Áp suất Lọc Cầu thận, Hệ Tăng nồng độ Ngược dòng Quai Henle & Trục RAAS',
    'Tính áp suất lọc hiệu quả $P_{\\text{lọc}}$, vai trò Aldosterone, ADH và động vật sống sa mạc vs cá nước ngọt',
    'Áp suất lọc hữu hiệu cầu thận: $P_{\\text{hiệu}} = P_{\\text{máu mao mạch}} - (P_{\\text{keo huyết tương}} + P_{\\text{nang Bowman}})$.',
    'Hệ Renin–Angiotensin–Aldosterone (RAAS) kích hoạt khi huyết áp/lượng máu giảm, tăng tái hấp thu $Na^+$ và nước phục hồi huyết áp.',
    'P_{\\text{lọc}} = P_{\\text{GC}} - (\\pi_{\\text{GC}} + P_{\\text{BS}})',
    'nephron_filtration_2d', 'nephron_kidney_3d',
    'Uống rượu bia làm tăng tiểu tiện nhanh chóng là do chất cồn ức chế tuyến yên tiết hormone nào?',
    ['A. Insulin', 'B. ADH (Vasopressin — hormone chống bài niệu)', 'C. Thyroxin', 'D. Calcitonin'], 1,
    'ADH giảm khiến kênh nước Aquaporin-2 ở ống góp đóng lại, nước không được tái hấp thu gây đi tiểu nhiều.',
    'Tại sao các loài thú gặm nhấm sống ở sa mạc (chuột kangaroo) lại có quai Henle dài bất thường so với chuột nước ngọt?', 'Quai Henle càng dài càng tạo gradient thẩm thấu tủy thận cực cao giúp cô đặc nước tiểu giữ tối đa nước.'
  ],
  [
    'bio-chuyen-11-4', 'Lớp 11', 'Chuyên / HSG', 'Khu Chuyên Sinh · Bậc 3: Chuyên 11', 'HSG Quốc gia Sinh 11', 4,
    'Cân bằng Toan–Kiềm Máu ($pH = 7{,}35–7{,}45$), Hệ Đệm Bicarbonate & Bù trừ Phổi – Thận',
    'Phương trình Henderson–Hasselbalch sinh lí và phân biệt Toan/Kiềm Hô hấp vs Chuyển hóa',
    'Hệ đệm chính trong huyết tương: $pH = 6{,}1 + \\log\\frac{[HCO_3^-]}{0{,}03 \\cdot P_{CO_2}}$; giữ nguyên tỉ lệ $[HCO_3^-]/P_{CO_2} \\approx 20/1$.',
    'Phổi điều chỉnh nhanh $P_{CO_2}$ qua nhịp thở (phút); Thận điều chỉnh chậm $[HCO_3^-]$ và thải $H^+$ (giờ–ngày).',
    'pH = 6{,}1 + \\log\\frac{[HCO_3^-]}{0{,}03 \\cdot P_{CO_2}}',
    'bohr_hemoglobin_2d', 'alveoli_capillary_3d',
    'Một bệnh nhân bị hen phế quản cấp tắc nghẽn thở kém, dẫn tới ứ đọng khí $P_{CO_2} = 60\\text{ mmHg}$ và $pH$ máu giảm xuống $7{,}22$. Đây là tình trạng nào?',
    ['A. Nhiễm kiềm hô hấp', 'B. Nhiễm toan hô hấp', 'C. Nhiễm toan chuyển hóa', 'D. Nhiễm kiềm chuyển hóa'], 1,
    'Giảm thông khí làm ứ $CO_2$ tăng $H_2CO_3$ gây hạ pH máu → nhiễm toan hô hấp.',
    'Một người bị tiêu chảy nặng mất nhiều dịch ruột giàu $HCO_3^-$ sẽ có nhịp thở thay đổi thế nào để bù trừ?', 'Nhiễm toan chuyển hóa kích thích trung khu hô hấp tăng nhịp thở sâu (thở Kussmaul) thải bớt CO₂.'
  ],
  [
    'bio-chuyen-12-3', 'Lớp 12', 'Nâng cao', 'Khu Chuyên Sinh · Bậc 2: Chuyên 12', 'HSG Quốc gia Sinh 12', 4,
    'Hoán vị Gen Nhiều Cặp, Tương tác Gen Kèm Hoán vị & Quy luật Liên kết Giới tính',
    'Giải ngược tỉ lệ kiểu hình lặn $\\underline{ab}/\\underline{ab}$ tìm tần số hoán vị $f$ và kiểu gen dị hợp đều/chéo',
    'Với hai cặp gen nằm trên cùng 1 cặp NST thường: biết $A-B- = 0{,}5 + \\frac{ab}{ab}$; $A-bb = aaB- = 0{,}25 - \\frac{ab}{ab}$.',
    'Nếu $\\frac{ab}{ab} > 0{,}0625$ ($6{,}25\\%$): cả bố và mẹ có khả năng cao mang kiểu gen dị hợp **đều** ($\\frac{AB}{ab}$); nếu $\\frac{ab}{ab} < 0{,}0625$: có dị hợp chéo ($\\frac{Ab}{aB}$).',
    'A-B- = 0{,}5 + \\frac{ab}{ab},\\quad A-bb = 0{,}25 - \\frac{ab}{ab}',
    'gene_linkage_2d', 'chromosome_mitosis_3d',
    'Cho phép lai $P: \\frac{AB}{ab} \\times \\frac{AB}{ab}$ thu được $F_1$ có $16\\%$ cây thân thấp, quả chua ($\\frac{ab}{ab}$). Tần số hoán vị gen $f$ là (biết hoán vị xảy ra ở 2 giới như nhau):',
    ['A. 10%', 'B. 20%', 'C. 30%', 'D. 40%'], 1,
    '$\\underline{ab} = \\sqrt{0{,}16} = 0{,}4 > 0{,}25$ (giao tử liên kết) $\\Rightarrow f = (0{,}5 - 0{,}4)\\times 2 = 0{,}20 = 20\\%$.',
    'Tính tỉ lệ kiểu hình $A-bb$ ở đời con phép lai trên.', 'A-bb = 0,25 - 0,16 = 0,09 = 9%.'
  ],
  [
    'bio-chuyen-12-4', 'Lớp 12', 'Chuyên / HSG', 'Khu Chuyên Sinh · Bậc 3: Chuyên 12', 'HSG Quốc gia / IBO', 5,
    'Di truyền Học Quần thể Nâng cao: Tự thụ phấn, Nội phối ($F$), Đột biến & Chọn lọc ($s$)',
    'Suy giảm dị hợp tử sau $n$ thế hệ tự thụ phấn và biến thiên $\\Delta q$ dưới chọn lọc chống lặn/trội',
    'Quần thể có cấu trúc ban đầu $d\\ AA + h\\ Aa + r\\ aa = 1$ tự thụ phấn qua $n$ thế hệ: tỉ lệ dị hợp tử $Aa$ giảm theo $h_n = h \\cdot (1/2)^n$.',
    'Trong chọn lọc chống lại thể đồng hợp lặn $aa$ (hệ số thích nghi $w_{aa} = 1 - s$), biến thiên tần số alen lặn sau 1 thế hệ là $\\Delta q = \\frac{-s p q^2}{1 - s q^2}$.',
    'h_n = h_0 \\left(\\frac{1}{2}\\right)^n,\\quad \\Delta q = \\frac{-s p q^2}{1 - s q^2}',
    'hardy_weinberg_2d', 'ecosystem_biome_3d',
    'Một quần thể ban đầu gồm $100\\%$ cá thể có kiểu gen dị hợp $Aa$ ($h_0 = 1$). Sau $4$ thế hệ tự thụ phấn bắt buộc, tỉ lệ kiểu gen đồng hợp trội $AA$ là:',
    ['A. 1/16', 'B. 15/32 (46,875%)', 'C. 7/16', 'D. 15/16'], 1,
    '$Aa_4 = (1/2)^4 = 1/16 \\Rightarrow AA_4 = aa_4 = (1 - 1/16)/2 = 15/32$.',
    'Giải thích vì sao không thể dùng chọn lọc nhân tạo hay tự nhiên để loại bỏ **hoàn toàn ngay lập tức** alen lặn gây bệnh khỏi quần thể ngẫu phối lớn.', 'Khi q nhỏ, hầu hết alen lặn ẩn náu trong thể dị hợp Aa bình thường nên thoát khỏi chọn lọc.'
  ],
  [
    'bio-chuyen-12-5', 'Lớp 12', 'Chuyên / HSG', 'Khu Chuyên Sinh · Bậc 3: Chuyên 12', 'HSG Quốc gia / IBO', 6,
    'Bài toán Phả hệ Định lượng Xác suất Phức tạp (Xác suất Điều kiện Bayes & Đa tính trạng)',
    'Tính xác suất sinh con mang bệnh khi biết bố mẹ bình thường nhưng anh/chị/em mắc bệnh',
    'Khi bố mẹ bình thường ($Aa \\times Aa$) sinh người con bình thường $X$, xác suất để người con $X$ này mang kiểu gen dị hợp $Aa$ là **$2/3$** (chứ không phải $1/2$).',
    'Với hai bệnh độc lập, nhân xác suất sinh con bình thường từng bệnh lại với nhau.',
    'P(Aa \\mid \\text{Bình thường từ } Aa \\times Aa) = \\frac{2/4}{3/4} = \\frac{2}{3}',
    'blood_typing_2d', 'chromosome_mitosis_3d',
    'Bố mẹ bình thường sinh con trai đầu bị bệnh bạch tạng (gen lặn NST thường). Xác suất để người con gái tiếp theo bình thường của họ mang alen gây bệnh ($Aa$) là:',
    ['A. 1/4', 'B. 1/2', 'C. 2/3', 'D. 3/4'], 2,
    'Trong 3 phần bình thường ($1\\ AA : 2\\ Aa$), tỉ lệ mang gen bệnh $Aa$ là $2/3$.',
    'Nếu người con gái bình thường trên kết hôn với một người đàn ông có kiểu gen $Aa$, xác suất sinh con đầu lòng bị bạch tạng là bao nhiêu?', '(2/3) × (1/4) = 1/6 (≈ 16,67%).'
  ],
  [
    'bio-chuyen-12-6', 'Lớp 12', 'Chuyên / HSG', 'Khu Chuyên Sinh · Bậc 3: Chuyên 12', 'HSG Quốc gia / IBO', 7,
    'Sinh thái Học Định lượng: Mô hình Lotka–Volterra, Chỉ số Đa dạng Shannon $H\'$ & Quần đảo MacArthur',
    'Tính chỉ số đa dạng sinh học Shannon–Wiener, cân bằng nhập cư – tuyệt chủng trên đảo và cạnh tranh 2 loài',
    'Chỉ số đa dạng loài Shannon: $H\' = -\\sum_{i=1}^S p_i \\ln(p_i)$ ($p_i$ là tỉ lệ cá thể loài thứ $i$); $H\'$ càng cao quần xã càng phong phú và cân bằng.',
    'Mô hình cân bằng đảo MacArthur–Wilson: đảo càng lớn và càng gần đất liền có số loài cân bằng $S^*$ càng cao.',
    'H\' = -\\sum_{i=1}^{S} p_i \\ln(p_i)',
    'predator_prey_2d', 'ecosystem_biome_3d',
    'Trong mô hình dao động Vật ăn thịt – Con mồi Lotka–Volterra, đỉnh số lượng của vật ăn thịt ($P$) thường xuất hiện như thế nào so với đỉnh của con mồi ($N$)?',
    ['A. Đỉnh vật ăn thịt đi trước đỉnh con mồi', 'B. Đỉnh vật ăn thịt lệch pha trễ hơn (theo sau) đỉnh con mồi', 'C. Hai đỉnh trùng khít hoàn toàn', 'D. Vật ăn thịt luôn không đổi'], 1,
    'Con mồi dồi dào trước rồi mới kéo theo quần thể vật ăn thịt sinh sản đạt đỉnh sau đó.',
    'Tính chỉ số Shannon $H\'$ cho một quần xã nhỏ có 2 loài chiếm tỉ lệ bằng nhau ($p_1 = p_2 = 0{,}5$).', 'H\' = -2 × (0,5 ln 0,5) = ln 2 ≈ 0,693.'
  ],
  [
    'bio-chuyen-12-7', 'Lớp 12', 'Chuyên / HSG', 'Khu Chuyên Sinh · Bậc 3: Chuyên 12', 'IBO Prep · Di truyền & Sinh thái', 8,
    'Tổng hợp Kỹ năng Giải Đề IBO & HSG Quốc gia: Cây Phát sinh Chủng loại (Cladogram)',
    'Đọc cây phát sinh phân tử theo nguyên lí Tiết kiệm tối đa (Parsimony) và Đồng hồ Phân tử',
    'Cây phát sinh chủng loại (Cladogram) đúng nhất theo nguyên lí **Parsimony** là cây có tổng số sự kiện biến đổi tiến hóa (đột biến) ít nhất.',
    'Đồng hồ phân tử dựa vào tốc độ tích lũy đột biến trung tính ổn định trên DNA ty thể / rRNA 16S để ước tính thời điểm phân li 2 loài.',
    '\\text{Số sai khác trình tự} \\propto 2 \\times t_{\\text{phân li}}',
    'dna_replication_2d', 'dna_double_helix_3d',
    'Khi so sánh trình tự axit amin của chuỗi hemoglobin $\\beta$, loài A khác người 1 aa, loài B khác 12 aa, loài C khác 45 aa. Loài nào có quan hệ họ hàng gần với người nhất?',
    ['A. Loài A', 'B. Loài B', 'C. Loài C', 'D. Cả ba như nhau'], 0,
    'Số sai khác càng ít chứng tỏ hai loài mới phân li gần đây và có quan hệ họ hàng gần nhất.',
    'Tại sao rRNA 16S (ở vi khuẩn) hoặc Cytochrome c được ưa chuộng dùng dựng cây phát sinh chủng loại toàn sinh giới?', 'Vì tồn tại ở hầu hết sinh vật, có các vùng bảo thủ cao xen kẽ vùng biến đổi chậm theo thời gian tiến hóa.'
  ]
];

// Additional Chuyen Tier 1-3 topics across Grades 9-12 to complete 25 Chuyen Bio lessons (4 existing + 21 extra = 25)
const EXTRA_CHUYEN_SPECS: BioChuyenSpec[] = [
  [
    'bio-chuyen-9-3', 'Lớp 9', 'Cơ bản', 'Khu Chuyên Sinh · Bậc 1: Chuyên 9', 'Chuyên Sinh 9–10', 3,
    'Biện luận Kiểu gen P từ Tỉ lệ Phân li Kiểu hình Phức tạp & Lai Phân tích',
    'Tách từng cặp tính trạng, xác định trội lặn và phát hiện tương tác hay liên kết từ 9:3:3:1 / 3:3:1:1',
    'Bước 1: Xét riêng từng tính trạng để suy ra phép lai của từng cặp gen. Bước 2: Nhân tích tỉ lệ hai cặp; nếu khớp đề bài → phân li độc lập, nếu khác → liên kết/hoán vị.',
    'Các tỉ lệ đặc trưng cần nhớ: $3:3:1:1 = (3:1)(1:1)$ ($AaBb \\times Aabb$ hoặc $aaBb$).',
    '\\text{Nếu } P(\\text{tách}) = P(\\text{gộp}) \\implies \\text{Phân li độc lập}',
    'mendel_punnett_2d', 'chromosome_mitosis_3d',
    'Phép lai nào cho đời con có tỉ lệ kiểu hình $3:3:1:1$ khi hai cặp gen phân li độc lập?',
    ['A. AaBb × AaBb', 'B. AaBb × Aabb', 'C. Aabb × aaBb', 'D. AaBB × aaBb'], 1,
    '$(Aa \\times Aa)(Bb \\times bb) = (3:1)(1:1) = 3:3:1:1$.',
    'Từ tỉ lệ đời con $1\\text{ cao, đỏ} : 2\\text{ cao, hồng} : 1\\text{ cao, trắng}$, rút ra nhận xét gì về tính trạng màu hoa?', 'Tính trạng màu hoa di truyền theo kiểu trội không hoàn toàn (F₁ dị hợp màu hồng).'
  ],
  [
    'bio-chuyen-10-5', 'Lớp 10', 'Nâng cao', 'Khu Chuyên Sinh · Bậc 2: Chuyên 10', 'HSG Sinh 10 · Vi sinh', 5,
    'Chuyển hóa Vật chất Năng lượng Vi sinh vật: Hô hấp Hiếu khí, Hô hấp Kị khí & Lên men',
    'Phân biệt chất nhận electron cuối cùng ($O_2$ vs $NO_3^-/SO_4^{2-}$ vs chất hữu cơ nội bào)',
    'Hô hấp **hiếu khí**: chất nhận $e^-$ cuối là $O_2$. Hô hấp **kị khí**: chất nhận $e^-$ cuối là phân tử vô cơ ($NO_3^-, SO_4^{2-}$). **Lên men**: chất nhận là chất hữu cơ nội sinh.',
    'Vi khuẩn nitrat hóa oxi hóa $NH_4^+ \\to NO_2^- \\to NO_3^-$ cung cấp nguồn đạm dễ tiêu cho cây trồng (hóa tự dưỡng).',
    '\\text{Lên men}:\\ \\text{Không cần chuỗi truyền } e^-,\\ 2\\text{ ATP/Glucose}',
    'cellular_respiration_2d', 'mitochondria_atp_3d',
    'Điểm khác biệt cơ bản giữa hô hấp kị khí (ví dụ vi khuẩn phản nitrat hóa) và quá trình lên men là:',
    ['A. Hô hấp kị khí có chuỗi truyền electron với chất nhận cuối vô cơ (NO₃⁻, SO₄²⁻)', 'B. Lên men tạo nhiều ATP hơn', 'C. Hô hấp kị khí cần O₂', 'D. Lên men xảy ra trong nhân'], 0,
    'Hô hấp kị khí vẫn sử dụng chuỗi truyền electron trên màng sinh chất nhưng dùng $NO_3^-$ hoặc $SO_4^{2-}$ thay $O_2$.',
    'Vì sao ruộng ngập úng lâu ngày bị sục bùn thiếu khí dễ làm mất đạm của đất?', 'Vi khuẩn phản nitrat hóa hô hấp kị khí biến NO₃⁻ thành khí N₂ bay mất.'
  ],
  [
    'bio-chuyen-10-6', 'Lớp 10', 'Chuyên / HSG', 'Khu Chuyên Sinh · Bậc 3: Chuyên 10', 'HSG Quốc gia · Virus', 6,
    'Sinh học Phân tử Virus: Retrovirus (HIV/Reverse Transcriptase) & Chu kì Tiềm tan – Sinh tan',
    'Phiên mã ngược RNA → cDNA chèn vào hệ gen chủ, cơ chế trốn tránh miễn dịch của virus cúm & HIV',
    'Retrovirus (HIV) mang enzyme **phiên mã ngược (Reverse Transcriptase)** tổng hợp DNA từ khuôn RNA rồi tích hợp thành provirus vào DNA tế bào T-CD4.',
    'Các virus RNA thường có tần số đột biến rất cao do RNA polymerase không có chức năng sửa sai ($3\'\\to 5\'$ exonuclease).',
    '\\text{RNA virus} \\xrightarrow{\\text{Phiên mã ngược}} \\text{cDNA} \\xrightarrow{\\text{Integrase}} \\text{Hệ gen chủ}',
    'viral_lytic_cycle_2d', 'virus_bacteriophage_3d',
    'Enzyme đặc hiệu nào của virus HIV biến hệ gen RNA sợi đơn thành sợi kép DNA để chèn vào nhân tế bào lympho T-CD4?',
    ['A. DNA polymerase III', 'B. Reverse Transcriptase (Enzyme phiên mã ngược)', 'C. Helicase', 'D. Restrictase'], 1,
    'Đây là đích tác động chính của các thuốc kháng virus ARV (như AZT).',
    'Tại sao phải tiêm nhắc lại vaccine cúm hằng năm nhưng vaccine sởi chỉ tiêm theo phác đồ cơ bản?', 'Virus cúm có hệ gen RNA phân đoạn dễ tái tổ hợp và đột biến nhanh làm thay đổi kháng nguyên bề mặt.'
  ],
  [
    'bio-chuyen-11-5', 'Lớp 11', 'Nâng cao', 'Khu Chuyên Sinh · Bậc 2: Chuyên 11', 'HSG Sinh 11 · Nội tiết', 5,
    'Điều hòa Đường huyết (Insulin – Glucagon – Cortisol), Bệnh Đái tháo đường Type 1 & Type 2',
    'So sánh cơ chế thiếu insulin tuyệt đối (Type 1) vs kháng insulin thụ thể (Type 2) và đường niệu',
    'Khi đường huyết tăng sau ăn, tế bào $\\beta$ đảo tụy tiết **Insulin** hoạt hóa kênh GLUT4 đưa glucose vào tế bào cơ/mỡ và tích lũy glycogen ở gan.',
    'Khi đường huyết hạ, tế bào $\\alpha$ tiết **Glucagon** phân giải glycogen gan; vượt ngưỡng thận (~180 mg/dL) gây tiểu đường.',
    '\\text{Đường huyết cao} \\to \\text{Insulin} \\implies \\text{Glucose} \\to \\text{Glycogen}',
    'glucose_insulin_2d', 'human_heart_3d',
    'Sự khác biệt bản chất nhất giữa bệnh nhân đái tháo đường Type 1 và Type 2 là:',
    ['A. Type 1 tụy không sản xuất đủ insulin (tự miễn tế bào β); Type 2 thụ thể tế bào đề kháng với insulin', 'B. Type 2 hoàn toàn không có đường trong máu', 'C. Type 1 chỉ xảy ra ở người già', 'D. Type 2 không liên quan đến receptor'], 0,
    'Type 1 phụ thuộc tiêm insulin ngoại sinh; Type 2 liên quan kháng insulin và lối sống.',
    'Tại sao bệnh nhân đái tháo đường không kiểm soát thường hay khát nước và đi tiểu nhiều?', 'Đường thừa thoát qua nước tiểu kéo theo nước theo cơ chế thẩm thấu gây lợi niệu thẩm thấu.'
  ],
  [
    'bio-chuyen-11-6', 'Lớp 11', 'Chuyên / HSG', 'Khu Chuyên Sinh · Bậc 3: Chuyên 11', 'HSG Quốc gia · Thực vật', 6,
    'Cơ chế Đóng mở Khí khổng (Bơm $H^+$, Ion $K^+$, Axit Abxixic) & Thuyết Dòng Áp suất Münch',
    'Vận chuyển chủ động đường sucrose vào ống rây Phloem nhờ đồng vận chuyển $H^+$-sucrose',
    'Ánh sáng xanh lam hoạt hóa bơm $H^+$-ATPase đẩy $H^+$ ra khỏi tế bào bảo vệ → $K^+$ tràn vào, kéo nước vào làm tăng sức trương mở khí khổng.',
    'Khi cây hạn hán, hormone **ABA** kích hoạt kênh thoát $K^+, Cl^-$ làm tế bào bảo vệ mất nước và đóng khí khổng tức thì.',
    '\\text{K}^+ \\text{ vào tế bào bảo vệ} \\implies \\Psi_s\\text{ giảm} \\implies \\text{Mở khí khổng}',
    'plant_transpiration_2d', 'plant_vascular_3d',
    'Hoocmôn nào làm khí khổng đóng nhanh chóng khi cây bị thiếu nước để hạn chế mất hơi nước?',
    ['A. Auxin', 'B. Axit Abxixic (ABA)', 'C. Gibberellin', 'D. Cytokinin'], 1,
    'ABA gắn thụ thể trên tế bào bảo vệ gây xuất bào $K^+$ và đóng khí khổng.',
    'Mô tả động lực đẩy dịch đường từ cơ quan nguồn (lá) tới cơ quan chứa (củ, quả) theo thuyết Münch.', 'Chênh lệch áp suất thủy tĩnh giữa đầu nguồn (nạp đường hút nước từ xylem) và đầu chứa (dỡ đường trả nước).'
  ],
  [
    'bio-chuyen-12-8', 'Lớp 12', 'Chuyên / HSG', 'Khu Chuyên Sinh · Bậc 3: Chuyên 12', 'HSG Quốc gia · Phân tử', 9,
    'Điều hòa Biểu hiện Gen ở Sinh vật Nhân thực (Epigenetics, Enhancer, Splicing & miRNA)',
    'Methyl hóa DNA/Acetyl hóa Histone, cắt nối exon thay thế (Alternative Splicing) và can thiệp RNA',
    'Acetyl hóa đuôi Histone trung hòa điện tích dương giúp nới lỏng chất nhiễm sắc (**euchromatin**) tăng phiên mã; methyl hóa DNA thường tắt gen.',
    'Cắt intron – nối **exon thay thế** giúp 1 gen duy nhất ở người có thể tạo ra nhiều loại protein khác nhau ở các mô.',
    '\\text{Acetyl hóa Histone} \\to \\text{Nới lỏng nhiễm sắc} \\to \\text{Bật phiên mã}',
    'lac_operon_2d', 'dna_double_helix_3d',
    'Cơ chế nào giúp tế bào nhân thực tạo ra hàng trăm nghìn loại protein khác nhau dù chỉ có khoảng $20\\,000$ gen mã hóa?',
    ['A. Mỗi gen có 100 promoter', 'B. Cắt nối exon thay thế (Alternative Splicing) các mRNA sơ khai', 'C. Thay đổi mã di truyền ở từng cơ quan', 'D. Nhân đôi plasmid liên tục'], 1,
    'Ghép nối các tổ hợp exon khác nhau từ cùng một tiền mRNA tạo nhiều biến thể polypeptide.',
    'Nêu tác dụng của phân tử miRNA / siRNA trong điều hòa biểu hiện gen sau phiên mã.', 'Bắt cặp bổ sung với mRNA đích để phân giải mRNA hoặc phong tỏa dịch mã.'
  ],
  [
    'bio-chuyen-12-9', 'Lớp 12', 'Chuyên / HSG', 'Khu Chuyên Sinh · Bậc 3: Chuyên 12', 'IBO Prep · Công nghệ Sinh học', 10,
    'Kỹ thuật Giải trình tự Sanger (ddNTP), Điện di Mao quản & Chip Sinh học Microarray',
    'Nguyên lí dừng tổng hợp mạch khi gắn dideoxynucleoside triphosphat (ddNTP) thiếu nhóm $3\'-OH$',
    'Trong phương pháp Sanger, khi DNA polymerase gắn phải $ddNTP$ (không có nhóm $-OH$ tự do ở C3\'), chuỗi DNA ngừng kéo dài tạo tập hợp các đoạn hơn kém nhau 1 nucleotit.',
    'Chạy điện di phân giải 1 bp kết hợp laser đọc màu huỳnh quang của 4 loại $ddNTP$ cho ra trình tự gốc chính xác của gen.',
    '\\text{Thiếu nhóm } 3\'-OH \\text{ ở ddNTP} \\implies \\text{Ngừng kéo dài chuỗi DNA}',
    'pcr_electrophoresis_2d', 'dna_double_helix_3d',
    'Vì sao phân tử $ddNTP$ (dideoxynucleotide) có khả năng làm dừng phản ứng tổng hợp DNA trong phương pháp giải trình tự Sanger?',
    ['A. Không có nhóm photphat ở C5\'', 'B. Thiếu nhóm -OH ở vị trí C3\' nên không tạo được liên kết photphodieste tiếp theo', 'C. Bị phân hủy ở 37°C', 'D. Không bắt cặp được với bazơ đối diện'], 1,
    'DNA polymerase cần đầu $3\'-OH$ tự do để gắn nucleotit kế tiếp.',
    'Một băng DNA chạy nhanh hơn (gần cực dương hơn) trên gel agarose trong điện di có kích thước lớn hay nhỏ hơn băng ở gần giếng tra mẫu?', 'Nhỏ hơn (chạy nhanh hơn qua mắt lưới gel agarose).'
  ],
  [
    'bio-chuyen-12-10', 'Lớp 12', 'Chuyên / HSG', 'Khu Chuyên Sinh · Bậc 3: Chuyên 12', 'IBO Prep · Sinh thái', 11,
    'Chu trình Sinh địa hóa Toàn cầu, Năng suất Sơ cấp Thuần (NPP) & Bảo tồn Đa dạng Sinh học',
    'Quan hệ $NPP = GPP - R$, phú dưỡng hồ, phân mảnh sinh cảnh và hiệu ứng mép rừng',
    'Sản lượng sơ cấp tinh $NPP$ (Net Primary Productivity) bằng tổng quang hợp $GPP$ trừ đi hô hấp thực vật $R$: phần năng lượng thực tế sẵn sàng cho bậc tiêu thụ bậc 1.',
    'Xây dựng hành lang đa dạng sinh học nối các khu bảo tồn bị phân mảnh giúp duy trì dòng gen, giảm giao phối cận huyết và nguy cơ tuyệt chủng cục bộ.',
    'NPP = GPP - R_a',
    'carbon_nitrogen_cycle_2d', 'ecosystem_biome_3d',
    'Phần năng lượng thực tế tích lũy trong sinh khối thực vật sẵn sàng cung cấp cho động vật ăn cỏ là:',
    ['A. Sản lượng sơ cấp thô (GPP)', 'B. Sản lượng sơ cấp tinh (NPP = GPP - R)', 'C. Nhiệt lượng hô hấp tế bào R', 'D. Tổng bức xạ Mặt Trời'], 1,
    '$NPP$ là lượng chất hữu cơ còn lại sau khi thực vật tự tiêu dùng cho hô hấp của chính nó.',
    'Nêu 2 hậu quả sinh thái nghiêm trọng của việc chia cắt một khu rừng lớn thành nhiều mảnh nhỏ biệt lập.', 'Suy giảm kích thước quần thể dẫn tới cận huyết – phiêu bạt di truyền và gia tăng hiệu ứng mép.'
  ]
];

export const BIOLOGY_CHUYEN_EXTRA_LESSONS: BiologyLesson[] = [...SPECS, ...EXTRA_CHUYEN_SPECS].map((s) =>
  makeBioLesson({
    id: s[0],
    track: 'chuyen',
    grade: s[1],
    tier: s[2],
    stageLabel: s[3],
    sourceTag: s[4],
    lessonNumber: s[5],
    title: s[6],
    subtitle: s[7],
    description: s[8],
    theory1Heading: '1. Lí thuyết Chuyên sâu & Phương pháp Tư duy HSG',
    theory1: s[8],
    theory2Heading: '2. Công thức Định lượng & Mở rộng Olympic IBO',
    theory2: `${s[9]}\n• Công thức cốt lõi: $$${s[10]}$$`,
    keyFormulas: [s[10]],
    sim2d: s[11],
    sim3d: s[12],
    mcq1: {
      source: s[4],
      question: s[13],
      options: s[14],
      correctIndex: s[15],
      explanation: s[16]
    },
    mcq2: {
      source: s[4],
      question: `Trong chuyên đề Chuyên Sinh "${s[6]}", hệ thức hoặc phát biểu nào sau đây đúng?`,
      options: [
        `A. $${s[10]}$`,
        'B. Tần số alen tự thay đổi theo định luật Hardy–Weinberg chuẩn',
        'C. Sản lượng ATP hô hấp kị khí cao gấp 18 lần hiếu khí',
        'D. Không cần enzyme xúc tác trong cơ thể sống'
      ],
      correctIndex: 0,
      explanation: `${s[8]} ${s[9]}`
    },
    essay: {
      source: s[4],
      question: s[17],
      solutionSteps: [s[18]],
      finalAnswer: s[18]
    }
  })
);
