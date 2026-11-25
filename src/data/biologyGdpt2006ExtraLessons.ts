import { Biology3DMode, BiologyLesson, BiologySimType } from '../types';
import { makeBioLesson } from './biologyGdpt2018Lessons';

type Bio2006Spec = [
  id: string,
  grade: BiologyLesson['grade'],
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

const SPECS: Bio2006Spec[] = [
  // ==================== SINH HỌC 9 (GDPT 2006) ====================
  [
    'bio-2006-9-2', 'Lớp 9', 'GDPT 2006 · Sinh học 9', 'SGK Sinh 9 (2006) · Chương I–II', 2,
    'Lai Một cặp – Hai cặp Tính trạng & Di truyền Liên kết Morgan (Sinh 9 – 2006)',
    'Phân biệt tỉ lệ 9:3:3:1 (phân li độc lập) và 3:1 hoặc 1:1 (liên kết gen hoàn toàn) ở ruồi giấm',
    'Khi các cặp gen nằm trên cùng một cặp NST và liên kết hoàn toàn, phép lai phân tích dị hợp cho tỉ lệ $1:1$ (giảm xuất hiện biến dị tổ hợp, duy trì nhóm tính trạng quý).',
    'Di truyền liên kết giới tính: gen nằm trên $X$ (không có trên $Y$) truyền chéo từ mẹ sang con trai, bố truyền cho con gái.',
    '\\frac{BV}{bv} \\times \\frac{bv}{bv} \\xrightarrow{\\text{Liên kết hoàn toàn}} 1\\frac{BV}{bv} : 1\\frac{bv}{bv}',
    'gene_linkage_2d', 'gene_linkage_3d',
    'Morgan phát hiện hiện tượng di truyền liên kết gen hoàn toàn nhờ thí nghiệm lai phân tích loài nào?',
    ['A. Đậu Hà Lan', 'B. Ruồi giấm (Drosophila melanogaster)', 'C. Hoa phấn', 'D. Chuột nhắt'], 1,
    'Ở ruồi giấm đực không có trao đổi chéo nên lai phân tích $F_1$ đực thân xám cánh dài $\\times$ cái đen cụt thu tỉ lệ $1:1$.',
    'Nêu ý nghĩa sinh học của hiện tượng di truyền liên kết hoàn toàn trong chọn giống.', 'Giúp các tính trạng tốt luôn di truyền ổn định cùng nhau thành nhóm liên kết.'
  ],
  [
    'bio-2006-9-3', 'Lớp 9', 'GDPT 2006 · Sinh học 9', 'SGK Sinh 9 (2006) · Chương III–IV', 3,
    'Tự nhân đôi ADN, Tổng hợp ARN, Protein & Thường biến – Mức Phản ứng (2006)',
    'Phân biệt Đột biến (di truyền) và Thường biến (không di truyền) với ví dụ hoa anh thảo / cây rau mác',
    'Thường biến là những biến đổi kiểu hình phát sinh do ảnh hưởng trực tiếp của môi trường trong đời cá thể, mang tính đồng loạt định hướng và không di truyền.',
    'Giới hạn của thường biến do kiểu gen quy định gọi là **mức phản ứng** (năng suất tối đa của giống tốt cần đi kèm kỹ thuật canh tác tốt).',
    '\\text{Kiểu hình} = \\text{Kiểu gen} + \\text{Môi trường}',
    'transcription_translation_2d', 'ribosome_translation_3d',
    'Hiện tượng lá cây rau mác có hình mũi mác khi mọc trong không khí nhưng hình bản dải dài khi chìm dưới nước là ví dụ của:',
    ['A. Đột biến số lượng NST', 'B. Thường biến (Thích nghi môi trường)', 'C. Đột biến gen lặn', 'D. Ưu thế lai'], 1,
    'Cùng một kiểu gen phản ứng tạo kiểu hình khác nhau trong các môi trường khác nhau.',
    'Giải thích câu tục ngữ nông nghiệp: "Nhất nước, nhì phân, tam cần, tứ giống" theo di truyền học.', 'Giống tốt (kiểu gen) quy định giới hạn năng suất; phân, nước, chăm sóc (môi trường) giúp đạt đỉnh mức phản ứng.'
  ],
  [
    'bio-2006-9-4', 'Lớp 9', 'GDPT 2006 · Sinh học 9', 'SGK Sinh 9 (2006) · Chương V–VI', 4,
    'Thoái hóa Giống, Ưu thế Lai ($F_1$), Hệ Sinh thái & Chuỗi Thức ăn (2006)',
    'Vì sao tự thụ phấn ở cây giao phấn gây thoái hóa, tại sao $F_1$ ưu thế lai cao nhất không dùng làm giống',
    'Tự thụ phấn bắt buộc qua nhiều thế hệ làm tăng thể đồng hợp lặn biểu hiện tính trạng xấu (thoái hóa giống), trừ một số loài tự thụ phấn nghiêm ngặt như đậu Hà Lan.',
    'Con lai $F_1$ tập trung nhiều gen trội có lợi ở trạng thái dị hợp đạt **ưu thế lai cao nhất** nhưng sẽ giảm dần ở các thế hệ sau nên chỉ dùng sản xuất thương phẩm.',
    'P(\\text{Dị hợp}) = \\left(\\frac{1}{2}\\right)^n \\to 0',
    'hardy_weinberg_2d', 'population_genetics_3d',
    'Tại sao không dùng con lai $F_1$ (như ngô lai $F_1$) để giữ làm hạt giống cho vụ mùa sau?',
    ['A. Hạt F₁ không nảy mầm', 'B. Từ F₂ tỉ lệ dị hợp giảm một nửa, đồng hợp lặn xấu xuất hiện làm giảm năng suất (giảm ưu thế lai)', 'C. F₁ bị nhiễm sâu bệnh nặng hơn', 'D. F₁ tốn phân bón gấp đôi'], 1,
    'Phân li kiểu gen ở $F_2$ phá vỡ trạng thái dị hợp tối ưu của $F_1$.',
    'Viết một chuỗi thức ăn 4 mắt xích ở hệ sinh thái đồng ruộng và chỉ rõ sinh vật sản xuất, tiêu thụ bậc 1–2–3.', 'Cây lúa → Sâu cuốn lá → Ếch đồng → Rắn hổ mang.'
  ],

  // ==================== SINH HỌC 10 (GDPT 2006) ====================
  [
    'bio-2006-10-2', 'Lớp 10', 'GDPT 2006 · Sinh học 10', 'SGK Sinh 10 (2006) · Phần 1–2', 2,
    'Giới Giới Thiệu 5 Giới Sinh vật (Whittaker) & Thành phần Hóa học Tế bào (2006)',
    'Phân loại 5 giới: Khởi sinh, Nguyên sinh, Nấm, Thực vật, Động vật và các đại phân tử hữu cơ',
    'Hệ thống 5 giới chia sinh giới dựa theo cấu tạo tế bào (nhân sơ/nhân thực), mức độ tổ chức (đơn bào/đa bào) và kiểu dinh dưỡng (tự dưỡng/dị dưỡng).',
    'Giới Nấm có tế bào nhân thực, thành tế bào bằng **kitin**, sống dị dưỡng hoại sinh/kí sinh (không có lục lạp).',
    '5\\text{ Giới}: \\text{Khởi sinh} \\to \\text{Nguyên sinh} \\to \\text{Nấm, Thực vật, Động vật}',
    'cell_organelles_2d', 'eukaryotic_cell_3d',
    'Đặc điểm nào giúp phân biệt Giới Nấm với Giới Thực vật?',
    ['A. Nấm sống tự dưỡng quang hợp', 'B. Nấm sống dị dưỡng và có thành tế bào cấu tạo từ kitin (thực vật bằng xenlulozơ)', 'C. Nấm thuộc tế bào nhân sơ', 'D. Nấm không có nhân'], 1,
    'Nấm không có diệp lục, sống dị dưỡng và thành tế bào chứa kitin.',
    'Nêu 4 nguyên tố đại lượng chiếm tới ~96% khối lượng cơ thể sống.', 'C (Cacbon), H (Hiđro), O (Oxi), N (Nitơ).'
  ],
  [
    'bio-2006-10-3', 'Lớp 10', 'GDPT 2006 · Sinh học 10', 'SGK Sinh 10 (2006) · Phần 2', 3,
    'Cấu trúc Tế bào Nhân thực & Vận chuyển Thụ động – Chủ động – Xuất Nhập bào (2006)',
    'Bơm $Na^+-K^+$ ATPase, thực bào bạch cầu, ẩm bào và thí nghiệm co – phản co nguyên sinh',
    'Vận chuyển **thụ động** (khuếch tán, thẩm thấu) đi xuôi chiều gradient nồng độ không tiêu tốn ATP; vận chuyển **chủ động** đi ngược chiều gradient cần protein bơm đặc hiệu và tiêu tốn ATP.',
    'Nhập bào gồm **thực bào** (nuốt phần tử rắn như vi khuẩn ở bạch cầu) và **ẩm bào** (uống giọt dịch).',
    '\\text{Bơm } \\text{Na}^+\\text{-K}^+: 3\\text{Na}^+\\text{ ra} \\mid 2\\text{K}^+\\text{ vào} \\ (\\text{tốn } 1\\text{ ATP})',
    'membrane_osmosis_2d', 'phospholipid_bilayer_3d',
    'Bơm Natri–Kali ($Na^+-K^+$ ATPase) trên màng tế bào thần kinh hoạt động theo cơ chế nào?',
    ['A. Khuếch tán đơn giản qua lớp phospholipid', 'B. Vận chuyển chủ động ngược gradient nồng độ tiêu tốn ATP', 'C. Thẩm thấu qua kênh aquaporin', 'D. Xuất bào'], 1,
    'Bơm dùng năng lượng ATP đẩy $3Na^+$ ra ngoài và đưa $2K^+$ vào trong ngược dốc nồng độ.',
    'Khi tưới phân đạm quá đặc (nồng độ cao) vào gốc rau, cây bị héo rũ lá vì sao?', 'Dung dịch đất trở nên ưu trương hút nước ra khỏi tế bào lông hút của rễ.'
  ],
  [
    'bio-2006-10-4', 'Lớp 10', 'GDPT 2006 · Sinh học 10', 'SGK Sinh 10 (2006) · Phần 2', 4,
    'Chu kì Tế bào, Nguyên phân, Giảm phân & Phát sinh Giao tử (2006)',
    'Pha G₁–S–G₂ của kì trung gian, điểm kiểm soát chu kì và ý nghĩa trao đổi chéo kì đầu I',
    'Ở pha **S** của kì trung gian, phân tử DNA tự nhân đôi làm mỗi NST đơn trở thành 1 NST kép gồm 2 cromatit chị em.',
    'Tại kì đầu giảm phân I xảy ra tiếp hợp và **trao đổi chéo** giữa các cromatit khác nguồn gốc tạo vô số tổ hợp giao tử đa dạng.',
    '\\text{Pha } G_1 \\ (2n\\text{ đơn}) \\xrightarrow{\\text{Pha S}} G_2 \\ (2n\\text{ kép, } 4n\\text{ cromatit})',
    'mitosis_meiosis_2d', 'chromosome_mitosis_3d',
    'Sự nhân đôi DNA và nhân đôi NST diễn ra tại pha nào của kì trung gian trong chu kì tế bào?',
    ['A. Pha G₁', 'B. Pha S', 'C. Pha G₂', 'D. Kì giữa'], 1,
    'Pha S (Synthesis) tổng hợp bản sao DNA chuẩn bị cho phân bào.',
    'Trong giảm phân, sự kiện tách 2 cromatit chị em ở tâm động phân li về 2 cực xảy ra ở kì nào?', 'Kì sau II của giảm phân (kì sau I tách cặp NST kép tương đồng).'
  ],
  [
    'bio-2006-10-5', 'Lớp 10', 'GDPT 2006 · Sinh học 10', 'SGK Sinh 10 (2006) · Phần 3', 5,
    'Virus, Bệnh Truyền nhiễm, Interferon & Miễn dịch Cộng đồng (2006)',
    'Cấu trúc vỏ Capsid – gai Glycoprotein, 5 giai đoạn nhân lên và 3 đường lây truyền HIV',
    'Virus là dạng sống chưa có cấu tạo tế bào, sống kí sinh nội bào bắt buộc; mỗi loại chỉ mang DNA **hoặc** RNA.',
    'Interferon là protein đặc hiệu do tế bào bị nhiễm virus tiết ra giúp các tế bào lân cận kích hoạt cơ chế ức chế tổng hợp protein virus.',
    '\\text{Virus} = \\text{Lõi Nucleic Acid (DNA hoặc RNA)} + \\text{Vỏ Protein (Capsid)}',
    'viral_lytic_cycle_2d', 'virus_bacteriophage_3d',
    'Tại sao thuốc kháng sinh thông thường (như Penicillin, Amoxicillin) **KHÔNG** điều trị khỏi được bệnh cảm cúm do virus?',
    ['A. Virus quá nhỏ không uống thuốc được', 'B. Kháng sinh nhắm vào thành tế bào peptidoglycan/ribosome 70S của vi khuẩn, trong khi virus không có các cấu trúc đó', 'C. Kháng sinh chỉ diệt nấm', 'D. Virus có vỏ xenlulozơ'], 1,
    'Virus không có cấu tạo tế bào vi khuẩn nên kháng sinh hoàn toàn vô hiệu với virus.',
    'Kể tên 3 con đường lây truyền của virus HIV và nguyên tắc phòng tránh.', 'Đường máu, đường tình dục và từ mẹ sang con; không lây qua tiếp xúc thông thường hay muỗi đốt.'
  ],

  // ==================== SINH HỌC 11 (GDPT 2006) ====================
  [
    'bio-2006-11-2', 'Lớp 11', 'GDPT 2006 · Sinh học 11', 'SGK Sinh 11 (2006) · Chương 1', 2,
    'Trao đổi Nước, Khoáng, Quang hợp & Hô hấp ở Thực vật (2006)',
    'Hấp thụ nước theo cơ chế thẩm thấu ở lông hút, con đường gian bào/tế bào chất và đai Caspari',
    'Nước từ đất vào mạch gỗ rễ qua 2 con đường: **gian bào** (nhanh, qua thành tế bào) và **tế bào chất**; khi qua nội bì gặp **đai Caspari** ép toàn bộ dòng nước đi qua tế bào chất để kiểm soát ion khoáng.',
    '3 động lực vận chuyển nước trong mạch gỗ (xylem): áp suất rễ (lực đẩy), thoát hơi nước ở lá (lực hút) và lực liên kết phân tử nước với thành mạch.',
    '\\text{Đai Caspari kiểm soát chọn lọc ion khoáng đi vào trung trụ}',
    'plant_transpiration_2d', 'plant_vascular_3d',
    'Vai trò sinh lí quan trọng nhất của đai Caspari ở lớp tế bào nội bì rễ cây là:',
    ['A. Đẩy nước bay hơi nhanh hơn', 'B. Chặn dòng gian bào buộc nước và ion khoáng đi qua màng tế bào nội bì để kiểm soát lượng khoáng hấp thụ', 'C. Lưu trữ tinh bột', 'D. Quang hợp dưới đất'], 1,
    'Đai Caspari thấm suberin không thấm nước buộc dòng vận chuyển đi xuyên qua màng sinh chất có tính thấm chọn lọc.',
    'Tại sao hiện tượng ứ giọt chỉ quan sát thấy ở các cây thân thảo thấp vào sáng sớm độ ẩm không khí bão hòa?', 'Không khí bão hòa hơi nước làm lá không thoát hơi nước được, áp suất rễ đẩy nước trào qua thủy khổng mép lá.'
  ],
  [
    'bio-2006-11-3', 'Lớp 11', 'GDPT 2006 · Sinh học 11', 'SGK Sinh 11 (2006) · Chương 1', 3,
    'Tuần hoàn Hở vs Kín – Đơn vs Kép, Hệ Dẫn truyền Tim & Cân bằng Nội môi (2006)',
    'Tiến hóa hệ tim (cá 2 ngăn → lưỡng cư 3 ngăn → bò sát → chim/thú 4 ngăn), nút xoang nhĩ – bó His',
    'Tim tự động co bóp nhịp nhàng nhờ **hệ dẫn truyền tự động**: Nút xoang nhĩ (phát nhịp chủ) $\\to$ Nút nhĩ thất $\\to$ Bó His $\\to$ Mạng lưới Purkinje.',
    'Huyết áp giảm dần dọc hệ mạch: Động mạch lớn $\\to$ Tiểu động mạch $\\to$ Mao mạch $\\to$ Tĩnh mạch; vận tốc máu chậm nhất ở mao mạch (giúp trao đổi chất triệt để).',
    '\\text{Vận tốc máu tỉ lệ nghịch với tổng tiết diện mạch}',
    'cardiac_cycle_2d', 'human_heart_3d',
    'Bộ phận nào trong tim người đóng vai trò phát xung nhịp tự động chuẩn (~75 nhịp/phút)?',
    ['A. Van hai lá', 'B. Nút xoang nhĩ (Nút Keith–Flack)', 'C. Mạng Purkinje', 'D. Động mạch chủ'], 1,
    'Nút xoang nhĩ ở tâm nhĩ phải tự phát điện thế hoạt động đều đặn khởi phát mỗi nhịp tim.',
    'Tại sao tổng tiết diện hệ mao mạch rất lớn khiến vận tốc máu chảy chậm nhất lại có ý nghĩa sống còn?', 'Giúp máu đủ thời gian trao đổi O₂, CO₂, chất dinh dưỡng và chất thải qua thành mao mạch.'
  ],
  [
    'bio-2006-11-4', 'Lớp 11', 'GDPT 2006 · Sinh học 11', 'SGK Sinh 11 (2006) · Chương 2', 4,
    'Cảm ứng ở Động vật: Hệ Thần kinh Dạng Lưới – Chuỗi Hạch – Ống & Điện thế Hoạt động (2006)',
    'Tiến hóa từ thủy tức → giun/côn trùng → động vật có xương sống và truyền tin nhảy cóc qua eo Ranvier',
    'Sợi thần kinh có bao Myelin dẫn truyền xung nhảy cóc qua các **eo Ranvier** nhanh gấp hàng chục lần (tới $100–120\\text{ m/s}$) và tiết kiệm năng lượng ATP cho bơm $Na^+-K^+$.',
    'Độ lớn (biên độ) điện thế hoạt động không đổi dọc sợi trục (quy luật "Tất cả hoặc Không"); cường độ kích thích mạnh được mã hóa bằng **tần số** xung.',
    'v_{\\text{nhảy cóc (có myelin)}} \\gg v_{\\text{không myelin}}',
    'action_potential_2d', 'neuron_synapse_3d',
    'Động lực làm thay đổi điện thế màng từ trạng thái nghỉ ($-70\\text{ mV}$) sang giai đoạn mất phân cực / đảo cực ($+35\\text{ mV}$) là:',
    ['A. Ion K⁺ tràn ra ngoài màng', 'B. Kênh Na⁺ mở làm ion Na⁺ ồ ạt tràn vào trong tế bào', 'C. Bơm Ca²⁺ đẩy Ca²⁺ ra', 'D. Nước đi vào'], 1,
    '$Na^+$ mang điện dương đi vào trong làm mặt trong màng trở nên dương tính so với mặt ngoài.',
    'Phân biệt cơ chế truyền tin qua xinap hóa học và vai trò của ion $Ca^{2+}$ tại chùy xinap.', 'Xung điện tới chùy mở kênh Ca²⁺ làm bóng chứa chất trung gian hòa màng giải phóng chất trung gian vào khe xinap.'
  ],
  [
    'bio-2006-11-5', 'Lớp 11', 'GDPT 2006 · Sinh học 11', 'SGK Sinh 11 (2006) · Chương 3–4', 5,
    'Ứng dụng Sinh trưởng (Auxin, Gibberellin, Etilen), Sinh sản Vô tính & Hữu tính Động vật (2006)',
    'Giâm – chiết – ghép cành, thụ tinh ngoài vs trong, đẻ trứng vs đẻ con và điều hòa sinh tinh – sinh trứng',
    'Chiết cành/ghép cành giữ nguyên đặc tính di truyền của cây mẹ ưu tú và rút ngắn thời gian cho thu hoạch quả.',
    'Sinh sản hữu tính tạo ra biến dị tổ hợp phong phú giúp sinh vật thích nghi tốt khi môi trường sống biến động.',
    '\\text{Sinh sản vô tính}:\\ \\text{Giữ nguyên kiểu gen} \\mid \\text{Hữu tính}:\\ \\text{Biến dị tổ hợp}',
    'phytohormone_tropism_2d', 'plant_vascular_3d',
    'Loại hormone thực vật ở dạng khí nào thúc đẩy nhanh quá trình rụng lá và chín quả (dùng dấm chuối, cà chua)?',
    ['A. Auxin', 'B. Gibberellin', 'C. Ethylene (Etilen)', 'D. Axit Abxixic'], 2,
    'Khí etilen ($C_2H_4$) kích thích hô hấp đột biến hô hấp (climacteric) làm quả nhanh chín đồng loạt.',
    'Tại sao trong sản xuất nông nghiệp, người ta thường bấm ngọn các cây đậu, bông, cà phê hoặc tỉa thưa cành?', 'Loại bỏ ưu thế ngọn (giảm nguồn Auxin từ đỉnh) để kích thích nhiều chồi bên và cành mang quả.'
  ],

  // ==================== SINH HỌC 12 (GDPT 2006) ====================
  [
    'bio-2006-12-4', 'Lớp 12', 'GDPT 2006 · Sinh học 12', 'SGK Sinh 12 (2006) · Chương 1', 4,
    'Gen, Mã Di truyền (64 Bộ ba) & Phiên mã – Dịch mã (2006)',
    '4 đặc điểm mã di truyền (liên tục, đặc hiệu, thoái hóa, phổ biến) và bộ ba mở đầu AUG / 3 mã kết thúc',
    'Có $4^3 = 64$ bộ ba, trong đó 3 bộ ba kết thúc ($5\'-UAA-3\', 5\'-UAG-3\', 5\'-UGA-3\'$) không mã hóa axit amin; 61 bộ ba mã hóa 20 loại axit amin (mã mở đầu $5\'-AUG-3\'$ mã hóa Met ở nhân thực).',
    'Chiều đọc mRNA của ribosome luôn là **$5\' \\to 3\'$**; chiều bổ sung đối mã tRNA là $3\'\\text{-UAC-}5\'$ ứng với $5\'\\text{-AUG-}3\'$.',
    '\\text{Số bộ ba mã hóa aa} = 64 - 3 = 61',
    'transcription_translation_2d', 'ribosome_translation_3d',
    'Ba bộ ba kết thúc dịch mã trên phân tử mRNA (theo chiều $5\'\\to 3\'$) là:',
    ['A. AUG, UGG, UAC', 'B. UAA, UAG, UGA', 'C. UUU, AAA, GGG', 'D. GUA, GUG, GCU'], 1,
    '$5\'-UAA-3\', 5\'-UAG-3\', 5\'-UGA-3\'$ không có tRNA tương ứng nên chấm dứt dịch mã.',
    'Tính số phân tử nước giải phóng khi tổng hợp hoàn chỉnh 1 chuỗi polypeptide gồm $200$ axit amin.', '200 - 1 = 199 liên kết peptit -> giải phóng 199 phân tử H₂O.'
  ],
  [
    'bio-2006-12-5', 'Lớp 12', 'GDPT 2006 · Sinh học 12', 'SGK Sinh 12 (2006) · Chương 2', 5,
    'Quy luật Tương tác Gen, Tác động Đa hiệu & Di truyền Liên kết Giới tính (2006)',
    'Phân biệt trội–lặn giới tính (túm lông tai ở Y, mù màu ở X, gà lông vằn ZW) và đa hiệu gen HbS',
    'Gen đa hiệu: một gen quy định nhiều tính trạng (ví dụ đột biến $Hb\\beta^S$ gây hồng cầu hình liềm đồng thời gây thiếu máu, tắc mạch, suy thận).',
    'Ở gà/chim/bướm, giới đực là $ZZ$ và giới cái là $ZW$ (ngược lại với người/ruồi giấm $XX/XY$).',
    '\\text{Người, Thú, Ruồi giấm}: \\text{Cái } XX,\\ \\text{Đực } XY \\mid \\text{Chim, Gà}: \\text{Đực } ZZ,\\ \\text{Cái } ZW',
    'mendel_punnett_2d', 'mendel_peas_3d',
    'Một gen quy định bệnh chỉ biểu hiện ở giới nam mà không bao giờ biểu hiện ở nữ, truyền trực tiếp từ bố cho tất cả con trai. Gen này nằm ở đâu?',
    ['A. NST thường', 'B. Vùng không tương đồng trên NST giới tính Y', 'C. Vùng không tương đồng trên X', 'D. DNA ti thể'], 1,
    'Gen nằm trên đoạn không tương đồng của NST $Y$ di truyền thẳng theo dòng bố (chỉ truyền cho con trai).',
    'Giải thích hiện tượng mèo tam thể (lông 3 màu đen–vàng–trắng) hầu như luôn là mèo cái.', 'Màu lông đen/vàng do 2 alen nằm trên X; mèo cái dị hợp XᴰXᵛ bất hoạt ngẫu nhiên 1 trong 2 NST X (thể Barr) ở từng vùng da.'
  ],
  [
    'bio-2006-12-6', 'Lớp 12', 'GDPT 2006 · Sinh học 12', 'SGK Sinh 12 (2006) · Chương 3–4', 6,
    'Chọn giống Vật nuôi Cây trồng, Gây Đột biến Nhân tạo & Lai Xa – Đa bội hóa (2006)',
    'Tạo giống dâu tằm tam bội $3n$, cây song nhị bội (cải bắp–cải củ) và cừu Dolly',
    'Lai xa ($A \\times B$) thường tạo con lai bất thụ ($n_A + n_B$ không tiếp hợp được trong giảm phân); xử lí **colchicine** gây đa bội hóa tạo thể **song nhị bội** ($2n_A + 2n_B$) hữu thụ hoàn toàn.',
    'Cừu nhân bản vô tính mang toàn bộ DNA nhân của cừu cho nhân và DNA ti thể của cừu cho tế bào trứng bỏ nhân.',
    '\\text{Cây } A\\ (2n_A) \\times B\\ (2n_B) \\to n_A + n_B \\xrightarrow{\\text{Colchicine}} \\text{Song nhị bội } (2n_A + 2n_B)',
    'mitosis_meiosis_2d', 'chromosome_mitosis_3d',
    'Hóa chất Colchicine được sử dụng trong chọn giống thực vật nhằm mục đích gì?',
    ['A. Cắt đoạn DNA', 'B. Cản trở hình thành thoi phân bào để gây đột biến đa bội (4n, song nhị bội)', 'C. Diệt cỏ dại', 'D. Tăng tốc độ phiên mã'], 1,
    'Colchicine ức chế trùng hợp vi ống thoi vô sắc nên NST đã nhân đôi không phân li → tạo tế bào $4n$.',
    'Trình bày tóm tắt 3 bước quy trình tạo cừu Dolly bằng phương pháp cấy truyền nhân.', '1. Lấy nhân 2n tuyến vú cừu cho; 2. Bỏ nhân trứng cừu khác rồi dung hợp nhân 2n vào tế bào trứng; 3. Nuôi thành phôi và cấy vào tử cung cừu mang thai hộ.'
  ],
  [
    'bio-2006-12-7', 'Lớp 12', 'GDPT 2006 · Sinh học 12', 'SGK Sinh 12 (2006) · Phần 6', 7,
    'Bằng chứng Tiến hóa Phân tử, Nguồn gốc Sự sống & Đại Địa chất (2006)',
    'Tiến hóa hóa học (thí nghiệm Miller–Urey) → Tiền sinh học (Coacervat) → Sinh học qua 5 đại Địa chất',
    'Khí quyển Trái Đất nguyên thủy chứa $CH_4, NH_3, H_2, H_2O$ (chưa có $O_2$ tự do); dưới tác dụng phóng điện/UV tạo ra các hợp chất hữu cơ đầu tiên (axit amin, nucleotit — Thí nghiệm Miller 1953).',
    'Bằng chứng sinh học phân tử (mã di truyền thống nhất, tương đồng trình tự DNA và Protein) chứng minh toàn bộ sinh giới có chung nguồn gốc.',
    '\\text{Vô cơ } (CH_4, NH_3, H_2, H_2O) \\xrightarrow{\\text{Tia lửa điện}} \\text{Axit amin, Đơn phân}',
    'natural_selection_2d', 'dna_double_helix_3d',
    'Khí nào hầu như **KHÔNG** có mặt tự do trong bầu khí quyển nguyên thủy Trái Đất trước khi xuất hiện vi khuẩn lam quang hợp?',
    ['A. Hơi nước H₂O', 'B. Metan CH₄', 'C. Khí Oxi phân tử O₂', 'D. Amoniac NH₃'], 2,
    'Khí quyển sơ khai có tính khử; $O_2$ chỉ tích lũy sau khi vi khuẩn lam quang hợp giải phóng $O_2$ (Sự kiện Oxi hóa Lớn).',
    'Vì sao hiện nay trên Trái Đất sự sống không còn tự hình thành ngẫu nhiên từ các chất vô cơ ngoài tự nhiên nữa?', 'Vì khí quyển giàu O₂ sẽ oxi hóa ngay phân tử hữu cơ đơn giản và vi sinh vật hiện đại sẽ phân hủy ngay.'
  ],
  [
    'bio-2006-12-8', 'Lớp 12', 'GDPT 2006 · Sinh học 12', 'SGK Sinh 12 (2006) · Phần 7', 8,
    'Các Mối Quan hệ Sinh thái Trong Quần xã, Diễn thế & Chu trình Nitơ – Cacbon (2006)',
    'Phân biệt Cộng sinh – Hợp tác – Hội sinh – Kí sinh – Ức chế cảm nhiễm và Ôn tập Đề Sinh 12 (2006)',
    'Quan hệ **hỗ trợ**: Cộng sinh (cả 2 đều lợi và bắt buộc như địa y, hải quỳ–cua ẩn cư), Hợp tác (cả 2 lợi không bắt buộc như chim sáo–trâu), Hội sinh (1 lợi, 1 không hại như phong lan bám thân gỗ).',
    'Quan hệ **ức chế – cảm nhiễm**: tảo giáp nở hoa tiết độc tố làm chết cá tôm mà bản thân tảo không sử dụng xác cá.',
    '\\text{Cộng sinh } (+,+) \\mid \\text{Hội sinh } (+,0) \\mid \\text{Kí sinh } (+,-) \\mid \\text{Cạnh tranh } (-,-)',
    'carbon_nitrogen_cycle_2d', 'ecosystem_biome_3d',
    'Mối quan hệ giữa vi khuẩn *Rhizobium* sống trong nốt sần rễ cây họ Đậu và cây họ Đậu thuộc kiểu quan hệ sinh thái nào?',
    ['A. Hội sinh', 'B. Cộng sinh (+/+)', 'C. Kí sinh', 'D. Ức chế – cảm nhiễm'], 1,
    'Vi khuẩn cung cấp $NH_4^+$ cho cây Đậu, cây Đậu cung cấp đường hữu cơ và chỗ ở cho vi khuẩn.',
    'Phân biệt diễn thế nguyên sinh (khởi đầu từ môi trường trống trơn như tro núi lửa, cát mới) và diễn thế thứ sinh (từ rừng bị cháy/chặt phá).', 'Diễn thế nguyên sinh xuất phát từ nơi chưa có quần xã; thứ sinh bắt đầu trên đất đã từng có quần xã sinh vật.'
  ]
];

export const BIOLOGY_GDPT_2006_EXTRA_LESSONS: BiologyLesson[] = SPECS.map((s) =>
  makeBioLesson({
    id: s[0],
    track: 'gdpt_2006',
    grade: s[1],
    stageLabel: s[2],
    sourceTag: s[3],
    lessonNumber: s[4],
    title: s[5],
    subtitle: s[6],
    description: s[7],
    theory1Heading: '1. Kiến thức Trọng tâm Chương trình GDPT 2006',
    theory1: s[7],
    theory2Heading: '2. Vận dụng Giải Bài tập & Thực nghiệm Sinh học',
    theory2: `${s[8]}\n• Công thức / Quy luật cốt lõi: $$${s[9]}$$`,
    keyFormulas: [s[9]],
    sim2d: s[10],
    sim3d: s[11],
    mcq1: {
      source: s[3],
      question: s[12],
      options: s[13],
      correctIndex: s[14],
      explanation: s[15]
    },
    mcq2: {
      source: s[3],
      question: `Trong chuyên đề "${s[5]}" (GDPT 2006), biểu thức/quy luật chuẩn xác là:`,
      options: [
        `A. $${s[9]}$`,
        'B. Mọi tính trạng đều di truyền thẳng qua NST Y',
        'C. Hiệu suất sinh thái luôn đạt 100% giữa các bậc dinh dưỡng',
        'D. Enzym hoạt động mạnh nhất ở 100°C'
      ],
      correctIndex: 0,
      explanation: `${s[7]} ${s[8]}`
    },
    essay: {
      source: s[3],
      question: s[16],
      solutionSteps: [s[17]],
      finalAnswer: s[17]
    }
  })
);
