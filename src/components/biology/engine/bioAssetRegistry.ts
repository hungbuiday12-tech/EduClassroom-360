export type BiologyAssetTopic =
  | 'anatomy'
  | 'cellular'
  | 'human'
  | 'plant'
  | 'microbiology'
  | 'ecology'
  | 'genetics';

export interface BiologyPartMetadata {
  id: string;
  name: string;
  nameEn: string;
  latinName?: string;
  layer?: string;
  structure: string;
  function: string;
  histology?: string;
}

export interface BiologyCameraPresetSpec {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export interface BiologyAssetSpec {
  id: string;
  name: string;
  nameVi: string;
  topic: BiologyAssetTopic;
  /** Optional external/local GLB/GLTF asset path (lazy loaded with procedural PBR anatomical fallback) */
  assetPath?: string;
  description: string;
  sourceLicense: string;
  defaultCamera: BiologyCameraPresetSpec;
  selectableParts: BiologyPartMetadata[];
}

export const BIOLOGY_ASSET_MANIFEST: Record<string, BiologyAssetSpec> = {
  human_anatomy_3d: {
    id: 'human_anatomy_3d',
    name: 'Human Anatomy 3D Explorer',
    nameVi: 'Giải Phẫu Cơ Thể Người 3D Đa Hệ Cơ Quan',
    topic: 'anatomy',
    description:
      'Mô hình giải phẫu người toàn thân với 11 hệ cơ quan (Xương, Cơ, Tuần hoàn, Hô hấp, Tiêu hóa, Thần kinh, Tiết niệu, Nội tiết, Miễn dịch, Sinh sản, Giác quan), tùy chỉnh độ trong suốt da/cơ/xương và cắt lớp giải phẫu.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas (CC BY-SA 4.0 Compatible)',
    defaultCamera: { position: [0.35, 1.35, 5.4], target: [0, 0.25, 0], fov: 42 },
    selectableParts: [
      {
        id: 'brain_nervous',
        name: 'Não bộ & Tủy sống',
        nameEn: 'Brain & Spinal Cord',
        latinName: 'Encephalon et Medulla spinalis',
        layer: 'nervous',
        structure: 'Đại não 2 bán cầu có nếp nhăn hồi não, tiểu não lá xếp, thân não và tủy sống đốt sống.',
        function: 'Trung tâm xử lí thông tin thần kinh, nhận thức, điều hòa vận động và phản xạ tự động.',
        histology: 'Chất xám (thân nơron) ở vỏ não và chất trắng (sợi trục myelin) dẫn truyền lên tới 120 m/s.'
      },
      {
        id: 'heart_circulatory',
        name: 'Tim 4 ngăn & Hệ mạch lớn',
        nameEn: 'Heart & Major Vessels',
        latinName: 'Cor et Vasa sanguinea',
        layer: 'circulatory',
        structure: 'Tim 4 buồng lệch trái với cung động mạch chủ 3 nhánh, động mạch phổi, tĩnh mạch chủ và mạch vành.',
        function: 'Bơm máu giàu O₂ qua vòng tuần hoàn lớn và đưa máu tĩnh mạch lên phổi trao đổi khí.',
        histology: 'Cơ tim phân nhánh nối đĩa xen kẽ giàu ti thể, nút xoang nhĩ (SA) tự phát nhịp.'
      },
      {
        id: 'lungs_respiratory',
        name: 'Phổi 3 thùy/2 thùy & Khí quản',
        nameEn: 'Lungs, Trachea & Diaphragm',
        latinName: 'Pulmones, Trachea et Diaphragma',
        layer: 'respiratory',
        structure: 'Thanh quản, khí quản vòng sụn chữ C, cây phế quản, phổi phải 3 thùy, phổi trái 2 thùy có khuyết tim và cơ hoành.',
        function: 'Thông khí hít O₂ và thải CO₂ qua hàng trăm triệu phế nang.',
        histology: 'Phế bào loại I siêu mỏng (0,5 µm) sát mao mạch phổi và phế bào loại II tiết surfactant.'
      },
      {
        id: 'liver_gallbladder',
        name: 'Gan & Túi mật',
        nameEn: 'Liver & Gallbladder',
        latinName: 'Hepar et Vesica biliaris',
        layer: 'digestive',
        structure: 'Thùy gan phải lớn, thùy trái hình nêm ngăn bởi dây chằng liềm, túi mật xanh nằm mặt dưới.',
        function: 'Giải độc máu tĩnh mạch cửa, tổng hợp protein huyết tương, dự trữ glycogen và tiết mật nhũ tương hóa lipid.',
        histology: 'Tiểu thùy gan lục giác gồm các dải tế bào gan tỏa quanh tĩnh mạch trung tâm.'
      },
      {
        id: 'stomach_intestines',
        name: 'Dạ dày, Ruột non & Ruột già',
        nameEn: 'Stomach & Intestinal Tract',
        latinName: 'Gaster, Intestinum tenue et crassum',
        layer: 'digestive',
        structure: 'Thực quản, dạ dày hình chữ J, khung đại tràng có bướu kết tràng ôm cuộn hồi-hỗng tràng ở giữa.',
        function: 'Tiêu hóa cơ học và enzyme (pepsin, amylase, lipase), hấp thụ chất dinh dưỡng và tái hấp thu nước.',
        histology: 'Lớp cơ trơn 3 chiều ở dạ dày; hàng triệu nhung mao và vi nhung mao ở ruột non.'
      },
      {
        id: 'kidneys_urinary',
        name: 'Hệ Tiết niệu (Thận – Niệu quản – Bàng quang)',
        nameEn: 'Kidneys, Ureters & Bladder',
        latinName: 'Renes, Ureteres et Vesica urinaria',
        layer: 'urinary',
        structure: 'Hai quả thận hình hạt đậu sau phúc mạc (thận phải thấp hơn nhẹ), niệu quản dẫn xuống bàng quang.',
        function: 'Lọc huyết tương, cân bằng nước – điện giải – pH máu và đào thải urê qua nước tiểu.',
        histology: 'Mỗi thận chứa ~1 triệu nephron gồm cầu thận, nang Bowman, quai Henle và ống góp.'
      },
      {
        id: 'endocrine_glands',
        name: 'Tuyến Nội tiết (Tuyến giáp – Thượng thận – Tụy)',
        nameEn: 'Thyroid, Adrenals & Pancreas',
        latinName: 'Systema endocrinum',
        layer: 'endocrine',
        structure: 'Tuyến giáp hình cánh bướm trước khí quản, hai tuyến thượng thận trên đỉnh thận và tụy nằm sau dạ dày.',
        function: 'Tiết hormone (Thyroxine, Adrenaline, Cortisol, Insulin, Glucagon) điều hòa chuyển hóa và đường huyết.',
        histology: 'Các nang tuyến giáp giàu mao mạch và đảo Langerhans chứa tế bào α/β.'
      },
      {
        id: 'skeletal_frame',
        name: 'Hệ Xương (Sọ – Cột sống – Lồng ngực – Chi)',
        nameEn: 'Human Skeletal System',
        latinName: 'Systema skeletale',
        layer: 'skeletal',
        structure: 'Hộp sọ, cột sống phân đốt có đĩa đệm, xương ức, 10 đôi xương sườn cong, khung chậu và xương chi.',
        function: 'Nâng đỡ cơ thể, bảo vệ não/tim/phổi, tạo đòn bẩy vận động và sinh tế bào máu ở tủy xương.',
        histology: 'Mô xương đặc gồm các hệ Havers đồng tâm và xương xốp giàu tủy đỏ.'
      },
      {
        id: 'muscular_system',
        name: 'Hệ Cơ Vân (Ngực – Vai – Bụng – Tứ chi)',
        nameEn: 'Skeletal Muscular System',
        latinName: 'Systema musculare',
        layer: 'muscular',
        structure: 'Cơ ức-đòn-chũm, cơ ngực lớn, cơ delta vai, cơ thẳng bụng phân múi, cơ nhị đầu tay và tứ đầu đùi.',
        function: 'Co rút tạo lực kéo xương quanh khớp giúp di chuyển, duy trì tư thế và sinh nhiệt.',
        histology: 'Sợi cơ vân đa nhân chứa đơn vị co cơ sarcomere gồm sợi actin và myosin.'
      },
      {
        id: 'lymphatic_immune',
        name: 'Hệ Miễn dịch (Tuyến ức – Lách – Hạch bạch huyết)',
        nameEn: 'Lymphatic & Immune System',
        latinName: 'Systema lymphoideum',
        layer: 'lymphatic',
        structure: 'Tuyến ức sau xương ức, lách nằm hạ sườn trái, ống ngực và các chuỗi hạch cổ, nách, bẹn.',
        function: 'Trưởng thành tế bào lympho T/B, lọc bạch huyết, loại bỏ hồng cầu già và đáp ứng miễn dịch đặc hiệu.',
        histology: 'Mô bạch huyết giàu đại thực bào, nang lympho vùng vỏ tủy và lưới sợi võng.'
      },
      {
        id: 'reproductive_pelvic',
        name: 'Hệ Sinh sản (Tử cung – Buồng trứng – Ống dẫn)',
        nameEn: 'Pelvic Reproductive System',
        latinName: 'Systema genitale',
        layer: 'reproductive',
        structure: 'Cơ quan sinh dục trong vùng chậu gồm tử cung, vòi dẫn và đôi tuyến sinh dục hai bên.',
        function: 'Sản sinh giao tử, tiết hormone sinh dục (Estrogen/Progesterone/Testosterone) và duy trì nòi giống.',
        histology: 'Lớp cơ trơn tử cung dày khỏe kèm niêm mạc nội mạc chu kỳ và các nang noãn.'
      },
      {
        id: 'sensory_organs',
        name: 'Cơ quan Giác quan (Mắt – Dây thị giác – Ốc tai)',
        nameEn: 'Sensory Organs (Eye & Inner Ear)',
        latinName: 'Organa sensuum',
        layer: 'sensory',
        structure: 'Đôi cầu mắt trong hốc mắt nối dây thần kinh thị giác II và hệ ốc tai xoắn – ống bán khuyên trong xương thái dương.',
        function: 'Chuyển đổi kích thích ánh sáng và sóng âm cơ học thành xung thần kinh truyền về vỏ não.',
        histology: 'Tế bào que/nón ở võng mạc và hàng nghìn tế bào lông cơ quan Corti trên màng đáy ốc tai.'
      }
    ]
  },

  eukaryotic_cell_3d: {
    id: 'eukaryotic_cell_3d',
    name: 'Eukaryotic Animal & Plant Cell',
    nameVi: 'Tế bào Nhân thực (Động vật & Thực vật)',
    topic: 'cellular',
    description: 'Cấu trúc siêu hiển vi tế bào nhân thực cắt lớp với nhân có lỗ màng nhân, lưới nội chất hạt, Golgi, ti thể, lục lạp và không bào.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas (CC BY-SA 4.0 Compatible)',
    defaultCamera: { position: [4.2, 2.9, 5.2], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      {
        id: 'nucleus',
        name: 'Nhân & Hạch nhân',
        nameEn: 'Nucleus & Nucleolus',
        structure: 'Màng nhân kép có lỗ nhân, chất nhiễm sắc DNA và hạch nhân đậm đặc.',
        function: 'Lưu giữ thông tin di truyền DNA, nhân đôi DNA và tổng hợp RNA.'
      },
      {
        id: 'rough_er',
        name: 'Lưới nội chất hạt (RER)',
        nameEn: 'Rough Endoplasmic Reticulum',
        structure: 'Hệ thống túi dẹt nối tiếp màng nhân có gắn hạt ribosome 80S.',
        function: 'Tổng hợp và gấp cuộn chuỗi polypeptide xuất bào hoặc protein màng.'
      },
      {
        id: 'golgi',
        name: 'Bộ máy Golgi',
        nameEn: 'Golgi Apparatus',
        structure: 'Chồng túi dẹt phân cực Cis–Trans kèm các túi cầu nảy chồi.',
        function: 'Sửa đổi, glycosyl hóa, phân loại và đóng gói protein vào túi tiết.'
      },
      {
        id: 'mitochondrion',
        name: 'Ti thể (Mitochondrion)',
        nameEn: 'Mitochondrion',
        structure: 'Màng kép với màng trong gấp nếp tạo mào cristae chứa ATP synthase.',
        function: 'Hô hấp hiếu khí tạo ATP cung cấp năng lượng cho tế bào.'
      },
      {
        id: 'chloroplast',
        name: 'Lục lạp (Chỉ có ở Thực vật)',
        nameEn: 'Chloroplast',
        structure: 'Bao kép chứa các chồng đĩa thylakoid grana giàu diệp lục và chất nền stroma.',
        function: 'Hấp thụ quang năng thực hiện pha sáng và chu trình Calvin tổng hợp đường.'
      }
    ]
  },

  dna_double_helix_3d: {
    id: 'dna_double_helix_3d',
    name: 'DNA Double Helix & RNA Transcription',
    nameVi: 'Xoắn kép DNA & Phiên mã mRNA',
    topic: 'genetics',
    description: 'Mô hình phân tử DNA 2 mạch đối song xoắn đều với rãnh lớn/rãnh nhỏ, cặp bazơ nitơ A=T, G≡C và enzyme Helicase/RNA Polymerase.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [4.1, 2.4, 5.0], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'at_pair', name: 'Cặp bazơ A = T (2 LK Hydro)', nameEn: 'Adenine–Thymine Pair', structure: 'Purine (A) liên kết bổ sung Pyrimidine (T) bằng 2 liên kết hydro.', function: 'Bảo toàn thông tin di truyền chính xác khi nhân đôi.' },
      { id: 'gc_pair', name: 'Cặp bazơ G ≡ C (3 LK Hydro)', nameEn: 'Guanine–Cytosine Pair', structure: 'Purine (G) nối Pyrimidine (C) bằng 3 liên kết hydro bền vững.', function: 'Tăng độ bền nhiệt của phân tử DNA.' },
      { id: 'backbone', name: 'Khung đường–photphat', nameEn: 'Sugar–Phosphate Backbone', structure: 'Chuỗi đường Deoxyribose nối nhóm Phosphate bằng liên kết phosphodiester 3’–5’.', function: 'Tạo bộ khung bền vững nâng đỡ xoắn kép.' },
      { id: 'helicase', name: 'Enzyme Helicase & mRNA', nameEn: 'Helicase & Nascent mRNA', structure: 'Vòng enzyme 6 tiểu phần ôm chạc chữ Y tháo xoắn.', function: 'Cắt đứt liên kết hydro tách hai mạch đơn để nhân đôi hoặc phiên mã.' }
    ]
  },

  ribosome_translation_3d: {
    id: 'ribosome_translation_3d',
    name: 'Ribosome 60S/40S & Translation',
    nameVi: 'Ribosome 3D & Dịch mã mRNA',
    topic: 'genetics',
    description: 'Phức hợp Ribosome tiểu phần lớn/bé với 3 vị trí A–P–E, phân tử tRNA chữ L mang axit amin lắp ráp chuỗi polypeptide.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [4.0, 2.2, 4.9], target: [0, 0.2, 0], fov: 42 },
    selectableParts: [
      { id: 'large_sub', name: 'Tiểu phần lớn Ribosome (60S/50S)', nameEn: 'Large Ribosomal Subunit', structure: 'Khối rRNA và protein tạo khe thoát polypeptide.', function: 'Xúc tác hình thành liên kết peptit (hoạt tính peptidyl transferase).' },
      { id: 'small_sub', name: 'Tiểu phần bé Ribosome (40S/30S)', nameEn: 'Small Ribosomal Subunit', structure: 'Khe rãnh kẹp sợi mRNA.', function: 'Giải mã bộ ba codon mRNA đối chiếu anticodon của tRNA.' },
      { id: 'trna_complex', name: 'Phân tử tRNA & Axit amin', nameEn: 'tRNA & Polypeptide Chain', structure: 'Cấu trúc gập chữ L mang bộ ba đối mã và axit amin đầu 3’.', function: 'Vận chuyển đúng axit amin tương ứng vào vị trí A/P.' }
    ]
  },

  mitochondria_atp_3d: {
    id: 'mitochondria_atp_3d',
    name: 'Mitochondrion & ATP Synthase',
    nameVi: 'Ti thể & Động cơ ATP Synthase',
    topic: 'cellular',
    description: 'Cấu trúc cắt lớp ti thể với màng ngoài nhẵn, màng trong uốn lượn mào cristae, chất nền matrix chứa DNA vòng và cụm rotor F₀F₁ ATP synthase.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.8, 2.5, 4.8], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'outer_membrane', name: 'Màng ngoài Ti thể', nameEn: 'Outer Mitochondrial Membrane', structure: 'Lớp kép lipid chứa kênh porin cho phân tử nhỏ đi qua.', function: 'Bao bọc bảo vệ và trao đổi chất với tế bào chất.' },
      { id: 'cristae', name: 'Mào trong Cristae', nameEn: 'Inner Membrane Cristae', structure: 'Màng trong gấp nếp sâu tạo khoang gian màng hẹp.', function: 'Tăng gấp bội diện tích gắn chuỗi truyền electron và bơm proton H⁺.' },
      { id: 'atp_synthase', name: 'Phức hợp F₀F₁ ATP Synthase', nameEn: 'ATP Synthase Rotor', structure: 'Gồm vòng c xuyên màng (F₀) và đầu xúc tác 6 múi α₃β₃ (F₁).', function: 'Dùng thế năng gradient H⁺ quay rotor tổng hợp ATP từ ADP + Pᵢ.' }
    ]
  },

  chloroplast_thylakoid_3d: {
    id: 'chloroplast_thylakoid_3d',
    name: 'Chloroplast & Thylakoid Grana',
    nameVi: 'Lục lạp & Đĩa Thylakoid',
    topic: 'plant',
    description: 'Lục lạp thực vật cắt lớp 3/4 để lộ các chồng đĩa Thylakoid (Grana) nối với nhau bởi bản màng Stroma lamellae và hạt tinh bột.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [4.0, 2.5, 4.9], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'envelope', name: 'Màng kép Lục lạp', nameEn: 'Chloroplast Double Envelope', structure: 'Hai lớp màng lipid bao kín hệ quang hợp nội bào.', function: 'Kiểm soát trao đổi triose phosphate và CO₂/O₂ với tế bào chất.' },
      { id: 'grana', name: 'Cột Grana & Màng Thylakoid', nameEn: 'Thylakoid Grana & Lamellae', structure: 'Chồng đĩa màng dẹt xếp khít nối cầu stroma lamellae.', function: 'Chứa hệ quang hóa PSI/PSII thực hiện pha sáng tách nước tạo ATP, NADPH.' },
      { id: 'stroma', name: 'Chất nền Stroma & Hạt tinh bột', nameEn: 'Stroma Matrix', structure: 'Dịch đặc chứa enzyme RuBisCO, DNA vòng và ribôxôm 70S.', function: 'Thực hiện chu trình Calvin cố định CO₂ thành glucozơ.' }
    ]
  },

  phospholipid_bilayer_3d: {
    id: 'phospholipid_bilayer_3d',
    name: 'Fluid-Mosaic Cell Membrane',
    nameVi: 'Màng Sinh chất Khảm lỏng 3D',
    topic: 'cellular',
    description: 'Màng tế bào gồm 2 lớp phospholipid đầu ưa nước – đuôi kị nước uốn gãy, phân tử cholesterol ổn định màng, chuỗi glycoprotein và kênh protein xuyên màng.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.9, 2.3, 4.8], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'lipid_heads', name: 'Đầu photphat ưa nước', nameEn: 'Hydrophilic Phosphate Heads', structure: 'Nhóm photphat phân cực hướng về dịch ngoại bào và bào tương.', function: 'Tạo bề mặt ưa nước ổn định tiếp xúc môi trường nước.' },
      { id: 'lipid_tails', name: 'Đuôi axit béo kị nước', nameEn: 'Hydrophobic Fatty Acid Tails', structure: 'Chuỗi hidrocacbon no và không no (gấp khúc liên kết đôi cis).', function: 'Ngăn cản ion và phân tử phân cực khuếch tán tự do.' },
      { id: 'channel_protein', name: 'Kênh Protein xuyên màng & Cholesterol', nameEn: 'Transmembrane Channel & Cholesterol', structure: 'Cụm 4 chuỗi xoắn α tạo lỗ lọc chọn lọc kèm vòng sterol.', function: 'Vận chuyển nước (Aquaporin) và bơm ion Na⁺/K⁺ chủ động.' }
    ]
  },

  chromosome_mitosis_3d: {
    id: 'chromosome_mitosis_3d',
    name: 'Mitotic Chromosome & Spindle',
    nameVi: 'Nhiễm sắc thể Kép & Thoi phân bào',
    topic: 'cellular',
    description: 'Nhiễm sắc thể kép xoắn siêu xoắn từ sợi chromatin gồm 2 crômatit chị em, đĩa tâm động Kinetochore, mũ Telomere và vi ống thoi vô sắc.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [4.2, 2.0, 5.2], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'chromatid_1', name: 'Crômatit chị em & Sợi xoắn Chromatin', nameEn: 'Sister Chromatid', structure: 'Sợi DNA quấn quanh lõi octamer histone nén cực đại vào kì giữa.', function: 'Mang bản sao DNA giống hệt nhau phân chia về tế bào con.' },
      { id: 'kinetochore', name: 'Tâm động & Đĩa Kinetochore', nameEn: 'Centromere & Kinetochore', structure: 'Vùng eo thắt sơ cấp gắn phức hợp protein bám vi ống.', function: 'Neo giữ 2 crômatit và kéo tách đồng đều ở kì sau.' }
    ]
  },

  enzyme_substrate_3d: {
    id: 'enzyme_substrate_3d',
    name: 'Enzyme–Substrate Induced Fit',
    nameVi: 'Enzyme & Cơ chế Khớp cảm ứng',
    topic: 'cellular',
    description: 'Mô hình protein hình cầu 3D có khe trung tâm hoạt động điêu khắc khớp với cơ chất đặc hiệu và vị trí chất ức chế cạnh tranh.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.8, 2.1, 4.7], target: [0.2, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'enzyme_domain', name: 'Phân tử Enzyme & Khe Hoạt động', nameEn: 'Enzyme Catalytic Cleft', structure: 'Protein bậc 3 gập cuộn tạo hốc không gian kị/ưa nước đặc hiệu.', function: 'Hạ thấp năng lượng hoạt hóa phản ứng sinh hóa.' },
      { id: 'substrate', name: 'Cơ chất (Substrate)', nameEn: 'Substrate Molecule', structure: 'Phân tử khớp hình học và điện tích vào trung tâm hoạt động.', function: 'Chuyển hóa thành sản phẩm sinh học sau xúc tác.' }
    ]
  },

  biomolecules_3d: {
    id: 'biomolecules_3d',
    name: 'Biological Macromolecules',
    nameVi: 'Nước & 4 Đại phân tử Sinh học',
    topic: 'cellular',
    description: 'Khảo sát cụm liên kết hydro H₂O, vòng lục giác α-Glucozơ, cấu trúc bậc 3/xoắn α của Protein và lớp kép Phospholipid.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.8, 2.2, 4.8], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'macromolecule', name: 'Đại phân tử sinh học đang khảo sát', nameEn: 'Selected Biomolecule', structure: 'Đơn phân liên kết cộng hóa trị và các liên kết yếu định hình không gian.', function: 'Cấu tạo tế bào, dự trữ năng lượng và xúc tác phản ứng sống.' }
    ]
  },

  human_heart_3d: {
    id: 'human_heart_3d',
    name: 'Human Heart 4 Chambers',
    nameVi: 'Tim Người 4 Ngăn & Hệ Mạch Vành',
    topic: 'human',
    description: 'Mô hình tim người giải phẫu với mỏm tim lệch trái, 4 buồng (tâm thất/tâm nhĩ), rãnh liên thất mang động mạch vành, cung động mạch chủ 3 nhánh và thân động mạch phổi.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.4, 1.9, 4.5], target: [0, 0.1, 0], fov: 42 },
    selectableParts: [
      { id: 'left_ventricle', name: 'Tâm thất Trái', nameEn: 'Left Ventricle', latinName: 'Ventriculus sinister', structure: 'Thành cơ tim dày nhất tạo mỏm tim hướng xuống trái.', function: 'Tạo huyết áp ~120 mmHg đẩy máu giàu O₂ vào động mạch chủ.' },
      { id: 'right_ventricle', name: 'Tâm thất Phải', nameEn: 'Right Ventricle', latinName: 'Ventriculus dexter', structure: 'Nằm phía trước phải, thành mỏng hơn tâm thất trái.', function: 'Đẩy máu nghèo O₂ lên thân động mạch phổi.' },
      { id: 'aorta', name: 'Cung Động mạch Chủ', nameEn: 'Aortic Arch', latinName: 'Arcus aortae', structure: 'Ống động mạch lớn uốn vòng chia 3 nhánh cấp máu đầu và tay.', function: 'Phân phối máu giàu O₂ đi nuôi toàn cơ thể.' },
      { id: 'coronary', name: 'Hệ Động mạch Vành', nameEn: 'Coronary Arteries', latinName: 'Arteriae coronariae', structure: 'Nhánh mạch ôm dọc rãnh liên thất và rãnh vành.', function: 'Nuôi dưỡng trực tiếp cơ tim hoạt động liên tục.' }
    ]
  },

  alveoli_capillary_3d: {
    id: 'alveoli_capillary_3d',
    name: 'Lungs, Bronchioles & Alveolar Capillary Bed',
    nameVi: 'Phổi Phân Thùy & Chùm Phế nang Trao đổi Khí',
    topic: 'human',
    description: 'Chùm phế nang mọng trong suốt ôm bởi lưới mao mạch phổi đỏ–xanh và nhánh tiểu phế quản tận sụn trơn.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.6, 2.0, 4.6], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'trachea_bronchi', name: 'Khí quản Sụn chữ C & Cây Phế quản', nameEn: 'Trachea & Bronchial Tree', structure: 'Ống khí quản vòng sụn chữ C chia đôi phế quản gốc và lưới phổi bán trong suốt.', function: 'Dẫn, lọc, làm ấm luồng khí từ thanh quản tới tiểu phế quản tận.' },
      { id: 'alveoli_cluster', name: 'Chùm Phế nang & Lỗ thông khí', nameEn: 'Alveolar Sacs', structure: 'Các túi cầu mỏng liên thông thành chùm nho tận cùng tiểu phế quản.', function: 'Nơi O₂ khuếch tán qua màng hô hấp vào máu.' },
      { id: 'capillary_net', name: 'Mạng Mao mạch Phổi & Hồng cầu', nameEn: 'Pulmonary Capillary Network', structure: 'Lưới ống mạch siêu nhỏ chuyển sắc từ xanh (nghèo O₂) sang đỏ tươi (giàu O₂) cùng dòng hồng cầu.', function: 'Vận chuyển hồng cầu gắn Hemoglobin nhận O₂ và thải CO₂.' }
    ]
  },

  nephron_kidney_3d: {
    id: 'nephron_kidney_3d',
    name: 'Kidney Cutaway & Nephron Unit',
    nameVi: 'Thận Cắt Lớp & Đơn vị Lọc Nephron',
    topic: 'human',
    description: 'Thận bổ dọc để lộ vỏ thận, tháp tủy thận, bể thận dẫn niệu quản cùng đơn vị vi thể Nephron (cầu thận Malpighi, nang Bowman, ống lượn, quai Henle, ống góp).',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.8, 2.1, 4.9], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'kidney_cortex', name: 'Thận bổ dọc (Vỏ – Tháp tủy – Bể thận)', nameEn: 'Renal Cortex & Medulla', structure: 'Khối mô hạt đậu màu nâu đỏ có các tháp tủy hình nón hội tụ về bể thận.', function: 'Chứa ~1 triệu nephron lọc ~180L dịch mỗi ngày.' },
      { id: 'bowman_glomerulus', name: 'Cầu thận & Nang Bowman', nameEn: 'Glomerulus & Bowman Capsule', structure: 'Cuộn mao mạch động mạch bọc trong chén kép nang Bowman.', function: 'Thực hiện giai đoạn siêu lọc đầu tiên tạo nước tiểu đầu.' },
      { id: 'henle_collecting', name: 'Quai Henle & Ống góp (ADH)', nameEn: 'Loop of Henle & Collecting Duct', structure: 'Quai chữ U cắm sâu vào tủy thận nối về ống góp.', function: 'Tái hấp thu nước, Na⁺/Cl⁻ và cô đặc nước tiểu.' }
    ]
  },

  human_brain_3d: {
    id: 'human_brain_3d',
    name: 'Human Brain Anatomy',
    nameVi: 'Giải Phẫu Não Bộ Người 3D (4 Thùy – Tiểu não – Thân não)',
    topic: 'human',
    description: 'Mô hình não người có nếp hồi não/rãnh não (gyri/sulci), phân biệt thùy trán, đỉnh, thái dương, chẩm, thể chai, tiểu não lá xếp (arbor vitae) và thân não.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.5, 1.8, 4.4], target: [0, 0.1, 0], fov: 42 },
    selectableParts: [
      { id: 'frontal_lobe', name: 'Thùy Trán (Frontal Lobe)', nameEn: 'Frontal Lobe', latinName: 'Lobus frontalis', structure: 'Phần trước vỏ đại não có hồi trán trước vận động.', function: 'Tư duy logic, lập kế hoạch, ngôn ngữ (Broca) và điều khiển vận động chủ ý.' },
      { id: 'parietal_temporal', name: 'Thùy Đỉnh & Thái dương', nameEn: 'Parietal & Temporal Lobes', latinName: 'Lobi parietalis et temporalis', structure: 'Vùng đỉnh trên và vùng thái dương hai bên.', function: 'Xử lí xúc giác, không gian, thính giác và trí nhớ (Hippocampus).' },
      { id: 'occipital_lobe', name: 'Thùy Chẩm (Thị giác)', nameEn: 'Occipital Lobe', latinName: 'Lobus occipitalis', structure: 'Vùng sau cùng của vỏ đại não.', function: 'Tiếp nhận và phân tích thông tin thị giác từ võng mạc.' },
      { id: 'cerebellum', name: 'Tiểu não (Cerebellum)', nameEn: 'Cerebellum', latinName: 'Cerebellum', structure: 'Hai bán cầu có rãnh lá ngang mịn chứa ~50% tổng số nơron não.', function: 'Giữ thăng bằng, phối hợp động tác tinh và học vận động.' },
      { id: 'brainstem', name: 'Thân não (Cầu não & Hành não)', nameEn: 'Brainstem', latinName: 'Truncus encephali', structure: 'Trụ dẫn truyền nối não bộ với tủy sống.', function: 'Điều hòa chức năng sinh tồn: nhịp tim, hô hấp, huyết áp.' }
    ]
  },

  liver_digestive_3d: {
    id: 'liver_digestive_3d',
    name: 'Liver, Stomach & Intestines 3D',
    nameVi: 'Gan – Túi mật – Dạ dày & Ruột 3D',
    topic: 'human',
    description: 'Cụm cơ quan tiêu hóa ổ bụng: Gan hai thùy + dây chằng liềm + túi mật, Dạ dày chữ J cắt mở nếp niêm mạc rugae, Tụy và Khung đại tràng ôm ruột non.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.6, 1.8, 5.0], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'liver', name: 'Gan & Túi mật', nameEn: 'Liver & Gallbladder', structure: 'Thùy phải–trái hình nêm mượt, ống mật chủ và túi mật xanh lục.', function: 'Chuyển hóa dinh dưỡng, dự trữ glycogen, khử độc và tạo dịch mật.' },
      { id: 'stomach', name: 'Dạ dày chữ J', nameEn: 'Stomach', structure: 'Phình vị, thân vị với nếp niêm mạc rugae, môn vị nối tá tràng.', function: 'Tiết HCl pH~2 và pepsinogen nhào trộn biến thức ăn thành nhũ trấp.' },
      { id: 'small_intestine', name: 'Ruột non (Tá – Hỗng – Hồi tràng)', nameEn: 'Small Intestine', structure: 'Ống cuộn dài gấp nếp treo bởi mạc treo.', function: 'Tiêu hóa triệt để và hấp thụ axit amin, đường đơn, axit béo.' },
      { id: 'large_intestine', name: 'Ruột già (Khung Đại tràng)', nameEn: 'Large Intestine', structure: 'Manh tràng, đại tràng lên–ngang–xuống–sigma có bướu kết tràng.', function: 'Tái hấp thu nước, muối khoáng và tổng hợp vitamin K nhờ vi sinh vật.' }
    ]
  },

  neuron_synapse_3d: {
    id: 'neuron_synapse_3d',
    name: 'Multipolar Neuron & Synapse',
    nameVi: 'Nơron Đa cực & Khe Xináp',
    topic: 'human',
    description: 'Thân nơron tỏa nhiều sợi nhánh tua gai, sợi trục bọc bao Myelin phân đoạn eo Ranvier và chùy xináp chứa túi chất dẫn truyền thần kinh.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [4.2, 2.2, 5.2], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'soma', name: 'Thân nơron & Sợi nhánh', nameEn: 'Soma & Dendrites', structure: 'Khối sao chứa nhân lớn và mạng sợi nhánh tua gai tiếp nhận tín hiệu.', function: 'Tổng hợp điện thế kích thích/ức chế sau xináp.' },
      { id: 'myelin_sheath', name: 'Bao Myelin & Eo Ranvier', nameEn: 'Myelin Sheath & Nodes of Ranvier', structure: 'Bao lipid cách điện do tế bào Schwann quấn quanh sợi trục.', function: 'Giúp xung thần kinh truyền nhảy cóc siêu nhanh.' },
      { id: 'synaptic_bulb', name: 'Chùy Xináp', nameEn: 'Synaptic Terminal', structure: 'Đầu phình tận cùng chứa bóng Acetylcholine và kênh Ca²⁺.', function: 'Giải phóng chất trung gian hóa học truyền tin một chiều.' }
    ]
  },

  endocrine_pancreas_3d: {
    id: 'endocrine_pancreas_3d',
    name: 'Pancreas & Islets of Langerhans',
    nameVi: 'Tuyến Tụy & Đảo Langerhans',
    topic: 'human',
    description: 'Cấu trúc tuyến tụy (đầu–thân–đuôi) với ống tụy chính kèm cụm vi thể Đảo Langerhans (tế bào β tiết Insulin, tế bào α tiết Glucagon) sát mao mạch.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [4.0, 2.2, 5.0], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'pancreas_gland', name: 'Tuyến Tụy (Đầu – Thân – Đuôi)', nameEn: 'Pancreas Anatomy', structure: 'Tuyến pha ngoại tiết–nội tiết hình lá có các tiểu thùy và ống tụy.', function: 'Tiết dịch tụy tiêu hóa vào tá tràng và hormone vào máu.' },
      { id: 'beta_cells', name: 'Tế bào β đảo tụy', nameEn: 'Pancreatic Beta Cells', structure: 'Tập trung ở trung tâm đảo tụy cạnh mao mạch máu.', function: 'Cảm ứng tăng đường huyết, tiết Insulin hạ glucose máu.' },
      { id: 'alpha_cells', name: 'Tế bào α đảo tụy', nameEn: 'Pancreatic Alpha Cells', structure: 'Nằm rìa đảo tụy.', function: 'Tiết Glucagon kích thích gan phân giải glycogen khi hạ đường huyết.' }
    ]
  },

  antibody_antigen_3d: {
    id: 'antibody_antigen_3d',
    name: 'IgG Antibody & Antigen Complex',
    nameVi: 'Kháng thể IgG & Kháng nguyên',
    topic: 'human',
    description: 'Cấu trúc phân tử 4 chuỗi polypeptide (2 nặng, 2 nhẹ) nối cầu disulfua tạo hình chữ Y đặc trưng với hai đầu Fab khóa Epitope kháng nguyên.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.8, 2.0, 4.9], target: [0, 0.2, 0], fov: 42 },
    selectableParts: [
      { id: 'fc_stem', name: 'Vùng Fc (Chuỗi nặng)', nameEn: 'Fc Region', structure: 'Thân chữ Y gồm hai chuỗi nặng bảo thủ.', function: 'Gắn thụ thể đại thực bào và kích hoạt hệ bổ thể.' },
      { id: 'fab_arms', name: 'Hai nhánh biến đổi Fab', nameEn: 'Fab Antigen-Binding Arms', structure: 'Chuỗi nhẹ + phần đầu chuỗi nặng tạo ổ khóa bổ sung hình học.', function: 'Nhận diện và trung hòa đặc hiệu kháng nguyên.' }
    ]
  },

  plant_vascular_3d: {
    id: 'plant_vascular_3d',
    name: 'Plant Root–Stem–Leaf & Xylem/Phloem',
    nameVi: 'Rễ – Thân – Lá & Hệ Mạch gỗ / Mạch rây',
    topic: 'plant',
    description: 'Cấu trúc giải phẫu thực vật hoàn chỉnh từ hệ rễ có lông hút, mặt cắt thân cây bó mạch Xylem vòng xoắn lignin & ống rây Phloem có bản rây, đến lá quang hợp.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [4.2, 2.5, 5.2], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'xylem', name: 'Mạch gỗ (Xylem)', nameEn: 'Xylem Vessels', structure: 'Tế bào chết hóa gỗ dày vòng xoắn nối thành ống thông suốt.', function: 'Dẫn nước và ion khoáng một chiều từ rễ lên lá.' },
      { id: 'phloem', name: 'Mạch rây (Phloem)', nameEn: 'Phloem Sieve Tubes', structure: 'Ống rây tế bào sống có bản rây đục lỗ kèm tế bào bạn.', function: 'Vận chuyển dòng đường saccarozơ từ lá đến rễ, quả, đỉnh sinh trưởng.' },
      { id: 'root_system', name: 'Rễ & Lông hút', nameEn: 'Roots & Root Hairs', structure: 'Rễ cọc phân nhánh nhiều rễ phụ và lông hút biểu bì.', function: 'Hấp thụ nước thẩm thấu và ion khoáng chủ động từ đất.' }
    ]
  },

  plant_leaf_transpiration_3d: {
    id: 'plant_leaf_transpiration_3d',
    name: 'Leaf Cross-Section & Stomata Transpiration',
    nameVi: 'Giải phẫu Lá, Khí khổng & Thoát hơi nước',
    topic: 'plant',
    description: 'Mặt cắt phiến lá thực vật: Lớp cutin sáp, biểu bì trên, mô giậu xếp khít giàu lục lạp, mô khuyết nhiều khoảng gian bào, bó gân lá và cặp tế bào hạt đậu đóng mở khí khổng.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.9, 2.4, 4.9], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'palisade_mesophyll', name: 'Mô giậu giàu Lục lạp', nameEn: 'Palisade Mesophyll', structure: 'Tế bào hình trụ xếp sát vuông góc bề mặt lá.', function: 'Hấp thụ ánh sáng tối đa để quang hợp.' },
      { id: 'spongy_mesophyll', name: 'Mô khuyết & Khoang khí', nameEn: 'Spongy Mesophyll', structure: 'Tế bào tròn thưa tạo hệ thống khoang khuếch tán khí.', function: 'Lưu thông CO₂, O₂ và hơi nước đến khí khổng.' },
      { id: 'stomata_guard', name: 'Khí khổng (Tế bào Hạt đậu)', nameEn: 'Stomata & Guard Cells', structure: 'Cặp tế bào hình hạt đậu ở biểu bì dưới có thành trong dày hơn thành ngoài.', function: 'Trương nước mở khe cho CO₂ vào và thoát hơi nước tạo lực hút mạch gỗ.' }
    ]
  },

  bacteria_prokaryote_3d: {
    id: 'bacteria_prokaryote_3d',
    name: 'Prokaryotic Bacterium Cell',
    nameVi: 'Vi khuẩn Nhân sơ (Cấu trúc Cắt lớp 3D)',
    topic: 'microbiology',
    description: 'Tế bào vi khuẩn hình que cắt lớp: Vỏ nhầy capsule, thành peptidoglycan, màng sinh chất, vùng nhân DNA vòng trần, plasmid, ribôxôm 70S, lông nhung pili và roi xoắn flagellum.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [4.2, 2.2, 5.0], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'capsule_wall', name: 'Vỏ nhầy & Thành Peptidoglycan', nameEn: 'Capsule & Cell Wall', structure: 'Lớp vỏ polisaccarit ngoài cùng bọc thành peptidoglycan vững chắc.', function: 'Bảo vệ khỏi thực bào, duy trì hình dạng và áp suất thẩm thấu.' },
      { id: 'nucleoid', name: 'Vùng nhân (DNA vòng) & Plasmid', nameEn: 'Nucleoid & Plasmids', structure: 'Phân tử DNA mạch kép dạng vòng không có màng nhân bao bọc.', function: 'Lưu giữ gen thiết yếu và gen kháng kháng sinh (plasmid).' },
      { id: 'flagellum_pili', name: 'Roi xoắn (Flagellum) & Lông Pili', nameEn: 'Rotary Flagellum & Pili', structure: 'Sợi protein flagellin gắn động cơ quay xuyên màng và các gai pili.', function: 'Bơi định hướng theo hóa chất và tiếp hợp truyền plasmid.' }
    ]
  },

  virus_bacteriophage_3d: {
    id: 'virus_bacteriophage_3d',
    name: 'Bacteriophage T4 & Enveloped Virus',
    nameVi: 'Virus: Thực khuẩn thể T4 & Virus có Vỏ bọc',
    topic: 'microbiology',
    description: 'Thể thực khuẩn T4 (đầu 20 mặt icosahedron, cổ, bao đuôi lò xo xoắn, đĩa gốc gai bám, 6 chân) kèm chế độ so sánh Virus có vỏ lipid & gai Glycoprotein (SARS-CoV-2).',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [4.0, 2.3, 5.0], target: [0, 0.1, 0], fov: 42 },
    selectableParts: [
      { id: 'capsid_head', name: 'Đầu Capsid 20 mặt & Lõi Nucleic Acid', nameEn: 'Icosahedral Capsid & Genome', structure: 'Vỏ protein đa diện đối xứng bao bọc DNA hoặc RNA lõi.', function: 'Bảo vệ vật chất di truyền và nén áp suất bơm vào vật chủ.' },
      { id: 'tail_sheath', name: 'Bao đuôi co bóp & Chân bám', nameEn: 'Contractile Tail & Fibers', structure: 'Ống xoắn protein có thể rút ngắn gắn 6 sợi chân nhận diện thụ thể.', function: 'Bám màng vi khuẩn chủ và tiêm DNA xuyên thành tế bào.' },
      { id: 'spike_glycoprotein', name: 'Vỏ Lipid & Gai Glycoprotein (Chế độ Virus vỏ ngoài)', nameEn: 'Envelope & Spike Trimers', structure: 'Màng kép lipid nguồn vật chủ gắn các gai trimer S.', function: 'Gắn đặc hiệu thụ thể ACE2 màng tế bào người để xâm nhập.' }
    ]
  },

  fungi_microorganisms_3d: {
    id: 'fungi_microorganisms_3d',
    name: 'Fungi (Mycelium/Fruiting Body) & Protist Microorganisms',
    nameVi: 'Nấm Sợi – Quả thể & Vi sinh vật (Trùng giày · Trùng biến hình)',
    topic: 'microbiology',
    description: 'Khám phá giới Nấm (mũ nấm có phiến bào tử, cuống nấm, mạng sợi nấm vách ngăn, túi bào tử) đặt cùng vi sinh vật đơn bào có tiêm mao/chân giả.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [4.3, 2.4, 5.3], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'mushroom_fruiting', name: 'Quả thể Nấm & Phiến Bào tử', nameEn: 'Fruiting Body & Gills', structure: 'Mũ nấm kitin, vòng phiến mang đảm bào tử và cuống nấm.', function: 'Tạo và phát tán hàng triệu bào tử sinh sản.' },
      { id: 'mycelium_hyphae', name: 'Hệ sợi Nấm (Mycelium)', nameEn: 'Hyphal Mycelium Network', structure: 'Mạng sợi phân nhánh có vách ngăn (septa) len trong chất nền.', function: 'Tiết enzyme phân giải chất hữu cơ ngoài cơ thể rồi hấp thụ.' },
      { id: 'protist_microbe', name: 'Vi sinh vật Đơn bào (Trùng giày Paramecium)', nameEn: 'Paramecium Protist', structure: 'Cơ thể đơn bào phủ lông bơi, rãnh miệng, không bào co bóp hình sao và nhân lớn/nhỏ.', function: 'Vận động bằng lông bơi, điều hòa áp suất thẩm thấu và tiêu hóa nội bào.' }
    ]
  },

  ecosystem_biome_3d: {
    id: 'ecosystem_biome_3d',
    name: '3D Ecosystem Diorama, Food Web & Biodiversity',
    nameVi: 'Hệ Sinh thái, Chuỗi–Lưới Thức ăn & Đa dạng Sinh học',
    topic: 'ecology',
    description: 'Sa bàn hệ sinh thái đa tầng: Thực vật sản xuất (cây tầng tán & cỏ), Sinh vật tiêu thụ bậc 1–2–3, Nấm/Vi khuẩn phân giải cùng dòng năng lượng 10% và tháp sinh thái.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [4.8, 3.0, 5.6], target: [0, 0.1, 0], fov: 42 },
    selectableParts: [
      { id: 'producers', name: 'Sinh vật Sản xuất (Thực vật tầng tán)', nameEn: 'Primary Producers', structure: 'Cây xanh, thảm cỏ và thực vật thủy sinh thực hiện quang hợp.', function: 'Cố định năng lượng mặt trời tạo sinh khối bậc 1 (100%).' },
      { id: 'herbivores', name: 'Sinh vật Tiêu thụ Bậc 1 (Ăn cỏ)', nameEn: 'Primary Consumers', structure: 'Động vật ăn thực vật (thỏ, côn trùng, cá ăn thực vật).', function: 'Chuyển hóa ~10% năng lượng từ thực vật lên bậc dinh dưỡng 2.' },
      { id: 'carnivores', name: 'Sinh vật Tiêu thụ Bậc cao & Đỉnh chuỗi', nameEn: 'Secondary & Apex Predators', structure: 'Động vật ăn thịt bậc trung và chim săn mồi đầu bảng.', function: 'Kiểm soát mật độ quần thể con mồi, duy trì cân bằng lưới thức ăn.' },
      { id: 'decomposers', name: 'Sinh vật Phân giải (Nấm & Vi khuẩn đất)', nameEn: 'Decomposers', structure: 'Nấm hoại sinh và vi khuẩn khoáng hóa ở tầng đất mùn.', function: 'Phân giải xác bã hữu cơ trả lại muối khoáng N, P, K và CO₂.' }
    ]
  },

  mendel_peas_3d: {
    id: 'mendel_peas_3d',
    name: 'Mendelian Pea Hybridization 3D',
    nameVi: 'Thí nghiệm Lai Đậu Hà Lan Mendel 3D',
    topic: 'genetics',
    description: 'Thí nghiệm lai 1 cặp, 2 cặp tính trạng và lai phân tích trên cây đậu Hà Lan với chậu đất, cánh hoa, hạt phấn thụ phấn, quả đậu F₂ và tháp tỉ lệ kiểu hình.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [0.3, 1.8, 6.2], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'parent_p1', name: 'Cây Bố P₁ (Thân cao · Hoa Tím · AABB)', nameEn: 'P1 Dominant Pea Plant', structure: 'Cây đậu Hà Lan thân cao, lá kép và hoa tím trội.', function: 'Cung cấp hạt phấn mang alen trội A, B.' },
      { id: 'f1_plant', name: 'Cây P₂ / F₁ Thụ phấn Chéo', nameEn: 'P2 / F1 Cross Plant', structure: 'Cây đậu mẹ và đường truyền hạt phấn lai tạo thế hệ sau.', function: 'Nhận hạt phấn tạo hợp tử F₁ và kiểm nghiệm phân li.' },
      { id: 'f2_pod_seeds', name: 'Quả đậu F₂ & Biểu đồ Tỉ lệ', nameEn: 'F2 Pod, Seeds & Ratio Bars', structure: 'Vỏ quả đậu mở tách lộ hạt Vàng Trơn, Xanh Nhăn và cột tỉ lệ 9:3:3:1 / 3:1.', function: 'Minh họa quy luật phân li độc lập của các cặp alen.' }
    ]
  },

  population_genetics_3d: {
    id: 'population_genetics_3d',
    name: 'Hardy–Weinberg Population Genetics 3D',
    nameVi: 'Di truyền Quần thể & Cân bằng Hardy–Weinberg',
    topic: 'genetics',
    description: 'Không gian quần thể lưỡng bội với các cụm cá thể AA, Aa, aa và trụ tần số p² + 2pq + q² = 1 biến thiên theo tần số alen p và giao phối gần.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.6, 2.5, 5.4], target: [0, 0.1, 0], fov: 42 },
    selectableParts: [
      { id: 'genotype_AA', name: 'Kiểu gen Đồng hợp Trội AA (p²)', nameEn: 'Homozygous Dominant AA', structure: 'Nhóm cá thể mang 2 alen trội p² trên trụ tần số lam.', function: 'Duy trì alen A ổn định qua các thế hệ ngẫu phối.' },
      { id: 'genotype_Aa', name: 'Kiểu gen Dị hợp Aa (2pq)', nameEn: 'Heterozygous Aa', structure: 'Nhóm cá thể dị hợp 2pq đạt cực đại 0,5 khi p = q = 0,5.', function: 'Dự trữ biến dị di truyền ẩn dưới dạng alen lặn.' },
      { id: 'genotype_aa', name: 'Kiểu gen Đồng hợp Lặn aa (q²)', nameEn: 'Homozygous Recessive aa', structure: 'Nhóm cá thể đồng hợp lặn q² tăng khi nội phối.', function: 'Biểu hiện kiểu hình lặn chịu tác động của chọn lọc tự nhiên.' }
    ]
  },

  biotech_pcr_crispr_3d: {
    id: 'biotech_pcr_crispr_3d',
    name: 'PCR Amplification & CRISPR-Cas9 3D',
    nameVi: 'Công nghệ Gen: Chu kì PCR & Cắt sửa CRISPR-Cas9',
    topic: 'genetics',
    description: 'Mạch kép DNA khuôn biến tính theo nhiệt độ (95°C → 55°C → 72°C) cùng phức hợp hai thùy Cas9 / Taq Polymerase và đoạn mồi / sgRNA dẫn đường.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.4, 2.0, 5.2], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'pcr_template', name: 'Mạch DNA Khuôn & Liên kết Hydro', nameEn: 'Template DNA Strands', structure: 'Hai mạch DNA đối song tách nhau khi nhiệt độ đạt 95°C.', function: 'Cung cấp trình tự gốc để tổng hợp hàng tỷ bản sao DNA.' },
      { id: 'cas9_taq', name: 'Phức hệ Enzyme Cas9 / Taq Polymerase', nameEn: 'Cas9 / Taq Enzyme', structure: 'Cụm protein 2 thùy REC–NUC chịu nhiệt có rãnh kẹp DNA.', function: 'Tổng hợp mạch mới ở 72°C hoặc cắt đặc hiệu điểm PAM trong CRISPR.' },
      { id: 'primer_sgrna', name: 'Đoạn mồi PCR / sgRNA dẫn đường', nameEn: 'Primer / Guide RNA', structure: 'Chuỗi oligonucleotide ngắn bắt cặp bổ sung đặc hiệu vùng mục tiêu.', function: 'Xác định chính xác điểm khởi đầu nhân bản hoặc vị trí chỉnh sửa gen.' }
    ]
  },

  gene_linkage_3d: {
    id: 'gene_linkage_3d',
    name: 'Chromosome Linkage & Crossing Over 3D',
    nameVi: 'Liên kết Gen & Hoán vị Gen Morgan 3D',
    topic: 'genetics',
    description: 'Cặp NST tương đồng thắt eo tâm động mang các băng locus AB / ab tiếp hợp và trao đổi chéo tại điểm chiasma.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.6, 1.9, 5.0], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'homolog_AB', name: 'NST Tương đồng mang gen AB', nameEn: 'Homolog Chromosome AB', structure: 'Nhiễm sắc thể mang các băng locus trội cùng nằm trên 1 phân tử DNA.', function: 'Di truyền liên kết bền vững nhóm tính trạng trội.' },
      { id: 'homolog_ab', name: 'NST Tương đồng mang gen ab', nameEn: 'Homolog Chromosome ab', structure: 'Nhiễm sắc thể tương đồng mang cặp alen lặn đối ứng.', function: 'Tiếp hợp cặp đôi với NST chị em ở kì đầu giảm phân I.' },
      { id: 'chiasma_node', name: 'Điểm bắt chéo Chiasma', nameEn: 'Crossing-over Chiasma', structure: 'Nút phức hợp trao đổi đoạn giữa hai crômatit khác nguồn.', function: 'Tạo giao tử hoán vị Ab, aB làm tăng đa dạng di truyền.' }
    ]
  },

  plant_flower_seed_3d: {
    id: 'plant_flower_seed_3d',
    name: 'Angiosperm Flower & Ovule Fertilization 3D',
    nameVi: 'Giải phẫu Hoa Lưỡng tính, Thụ phấn & Tạo Hạt',
    topic: 'plant',
    description: 'Cấu trúc đầy đủ hoa kín: Cuống, đế hoa, đài xanh, tràng cánh hoa uốn cong, 6 nhị mang bao phấn và nhụy hoa cắt mở lộ noãn & ống phấn.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.8, 2.3, 4.9], target: [0, 0.1, 0], fov: 42 },
    selectableParts: [
      { id: 'calyx_stem', name: 'Cuống hoa, Đế hoa & Đài hoa', nameEn: 'Pedicel, Receptacle & Calyx', structure: 'Trục nâng và vòng lá đài xanh bảo vệ nụ hoa.', function: 'Nâng đỡ bông hoa và bảo vệ bao phấn, bầu nhụy non.' },
      { id: 'corolla_petals', name: 'Tràng Cánh hoa', nameEn: 'Corolla Petals', structure: 'Vòng cánh hoa sắc màu rực rỡ xếp tỏa tròn.', function: 'Thu hút côn trùng thụ phấn và che chở nhị–nhụy.' },
      { id: 'stamen_anthers', name: 'Nhị hoa (Chỉ nhị & Bao phấn)', nameEn: 'Stamens & Anthers', structure: 'Chỉ nhị mảnh nâng bao phấn 2 ô chứa hạt phấn.', function: 'Sản sinh và phát tán hạt phấn mang giao tử đực.' },
      { id: 'pistil_ovules', name: 'Nhụy hoa, Bầu nhụy & Noãn', nameEn: 'Pistil, Ovary & Ovules', structure: 'Đầu nhụy, vòi nhụy dẫn ống phấn xuống bầu nhụy chứa noãn.', function: 'Thụ tinh kép tạo hợp tử (hạt) và nội nhũ, bầu phát triển thành quả.' }
    ]
  },

  comparative_hearts_3d: {
    id: 'comparative_hearts_3d',
    name: 'Comparative Vertebrate Hearts Evolution 3D',
    nameVi: 'Tiến hóa Hệ Tuần hoàn Có Xương Sống (Tim 2 – 3 – 4 Ngăn)',
    topic: 'human',
    description: 'Đặt cạnh và so sánh trực quan cấu trúc giải phẫu tim 2 ngăn (Cá), tim 3 ngăn (Lưỡng cư) và tim 4 ngăn hoàn chỉnh (Chim/Thú).',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [0.2, 1.5, 5.8], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'fish_heart', name: 'Tim Cá 2 Ngăn', nameEn: '2-Chamber Fish Heart', structure: 'Gồm 1 tâm nhĩ và 1 tâm thất thông với cung mang.', function: 'Tuần hoàn đơn chứa hoàn toàn máu nghèo O₂ bơm lên mang.' },
      { id: 'amphibian_heart', name: 'Tim Lưỡng cư 3 Ngăn', nameEn: '3-Chamber Amphibian Heart', structure: '2 tâm nhĩ đổ chung vào 1 tâm thất không có vách ngăn kín.', function: 'Tạo 2 vòng tuần hoàn với máu pha đi nuôi cơ thể.' },
      { id: 'mammal_heart', name: 'Tim Chim & Thú 4 Ngăn', nameEn: '4-Chamber Avian/Mammalian Heart', structure: 'Vách liên thất hoàn chỉnh chia đôi nửa phải–trái cùng cung chủ và phổi.', function: 'Tách biệt hoàn toàn máu giàu O₂ và máu tĩnh mạch phục vụ đẳng nhiệt.' }
    ]
  },

  digestive_tract_3d: {
    id: 'digestive_tract_3d',
    name: 'Human Digestive System 3D',
    nameVi: 'Hệ Tiêu hóa Người Hoàn chỉnh 3D',
    topic: 'human',
    description: 'Đường tiêu hóa liên hoàn từ Thực quản, Dạ dày chữ J, Gan hình nêm & Túi mật, Tuyến tụy hình lá đến Ruột non gấp khúc và Khung Đại tràng.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.2, 1.8, 5.4], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'stomach_esophagus', name: 'Thực quản & Dạ dày chữ J', nameEn: 'Esophagus & Stomach', structure: 'Ống cơ thực quản nối dạ dày chữ J cong lớn–cong nhỏ.', function: 'Co bóp nhào trộn thức ăn với dịch vị axit HCl và pepsin.' },
      { id: 'liver_pancreas', name: 'Gan, Túi mật & Tuyến Tụy', nameEn: 'Liver, Gallbladder & Pancreas', structure: 'Hai thùy gan, túi mật xanh dưới mặt gan và tụy tiết kiềm.', function: 'Tiết dịch mật nhũ tương hóa mỡ và enzyme tiêu hóa vào tá tràng.' },
      { id: 'intestines', name: 'Ruột non & Khung Đại tràng', nameEn: 'Small & Large Intestines', structure: 'Cuộn ruột non trung tâm bọc quanh bởi đại tràng lên–ngang–xuống.', function: 'Tiêu hóa triệt để, hấp thụ chất dinh dưỡng và tái hấp thu nước.' }
    ]
  },

  invertebrate_biodiversity_3d: {
    id: 'invertebrate_biodiversity_3d',
    name: 'Invertebrate Phyla Diversity 3D',
    nameVi: 'Đa dạng Động vật Không Xương Sống 3D',
    topic: 'ecology',
    description: '4 ngành tiêu biểu: Ruột khoang (Thủy tức), Giun đốt (Giun đất có đai sinh dục), Thân mềm (Ốc sên vỏ xoắn) và Chân khớp (Côn trùng 3 phần · 6 chân).',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [0.3, 2.1, 6.2], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'cnidaria_hydra', name: 'Ngành Ruột khoang (Thủy tức)', nameEn: 'Cnidaria (Hydra)', structure: 'Cơ thể đối xứng tỏa tròn với vành xúc tu quanh lỗ miệng.', function: 'Bắt mồi nhờ tế bào gai độc và tiêu hóa dạng túi.' },
      { id: 'annelid_worm', name: 'Ngành Giun đốt (Giun đất)', nameEn: 'Annelida (Earthworm)', structure: 'Thân dài phân đốt đồng đều có đai sinh dục phình to.', function: 'Làm tơi xốp đất mùn và hô hấp qua da ẩm.' },
      { id: 'mollusk_snail', name: 'Ngành Thân mềm (Ốc xoắn)', nameEn: 'Mollusca (Snail)', structure: 'Thân mềm không phân đốt được bảo vệ bởi vỏ đá vôi xoắn ốc.', function: 'Di chuyển bằng chân cơ tiết nhầy và bảo vệ bằng vỏ cứng.' },
      { id: 'arthropod_insect', name: 'Ngành Chân khớp (Côn trùng)', nameEn: 'Arthropoda (Insect)', structure: 'Bộ xương ngoài kitin chia đầu–ngực–bụng, 3 đôi chân đốt và đôi cánh.', function: 'Thích nghi đa dạng nhất trên cạn, bay lượn và thụ phấn.' }
    ]
  },

  plant_tropism_germination_3d: {
    id: 'plant_tropism_germination_3d',
    name: 'Seed Germination & Plant Tropism 3D',
    nameVi: 'Nảy mầm & Tính Hướng sáng / Hướng trọng lực (Auxin)',
    topic: 'plant',
    description: 'Hạt đậu nảy mầm trong đất ẩm: hệ rễ cọc + lông hút đâm sâu xuống đất (hướng trọng lực dương) và chồi non có lá mầm uốn cong về phía nguồn sáng.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [3.6, 2.2, 5.0], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'seed_soil', name: 'Hạt nảy mầm & Tầng đất ẩm', nameEn: 'Germinating Seed & Soil', structure: 'Hạt trương nước nứt vỏ trên tầng đất giàu mùn.', function: 'Cung cấp tinh bột dự trữ từ lá mầm nuôi phôi phát triển.' },
      { id: 'root_gravitropism', name: 'Rễ cọc & Rễ phụ (Hướng đất +)', nameEn: 'Root Positive Gravitropism', structure: 'Trục rễ chính đâm thẳng xuống dưới tỏa các rễ nhánh.', function: 'Giữ cây đứng vững và hút nước–khoáng trong đất.' },
      { id: 'shoot_phototropism', name: 'Thân uốn theo Ánh sáng (Auxin)', nameEn: 'Shoot Phototropism', structure: 'Thân non uốn cong về phía nguồn sáng kèm lá mầm xòe rộng.', function: 'Phân bố Auxin không đều về phía tối kích thích dãn tế bào hướng sáng.' }
    ]
  },

  skeleton_senses_3d: {
    id: 'skeleton_senses_3d',
    name: 'Musculoskeletal Lever, Eye & Ear Anatomy 3D',
    nameVi: 'Cơ–Xương Đòn bẩy, Cầu Mắt & Tai Trong 3D',
    topic: 'human',
    description: 'Ba cấu trúc vận động & cảm giác cơ thể người: Xương cánh–cẳng tay + khớp khuỷu + cơ nhị đầu, Cầu mắt cắt lớp lộ thủy tinh thể/võng mạc và Tai ngoài–xương con–ốc tai xoắn.',
    sourceLicense: 'EduClassroom-360 Scientific PBR Procedural Atlas',
    defaultCamera: { position: [0.3, 1.8, 5.8], target: [0, 0, 0], fov: 42 },
    selectableParts: [
      { id: 'arm_lever', name: 'Hệ Vận động: Xương Tay & Cơ Nhị đầu', nameEn: 'Arm Bones, Elbow & Biceps', structure: 'Xương cánh tay nối xương quay/trụ qua khớp bản lề và bắp cơ nhị đầu bám gân.', function: 'Tạo đòn bẩy cơ học gập duỗi cẳng tay linh hoạt.' },
      { id: 'eye_cutaway', name: 'Thị giác: Cầu Mắt cắt lớp', nameEn: 'Human Eye Cutaway', structure: 'Giác mạc trong suốt, mống mắt, thể thủy tinh hội tụ và võng mạc chứa dây thị giác.', function: 'Điều tiết hội tụ ảnh rõ nét lên điểm vàng võng mạc.' },
      { id: 'ear_cochlea', name: 'Thính giác: Tai & Ốc Tai Xoắn', nameEn: 'Ear, Ossicles & Cochlea', structure: 'Vành tai, ống tai, màng nhĩ, chuỗi 3 xương con và ốc tai xoắn 2,5 vòng.', function: 'Khuếch đại rung động âm thanh chuyển thành tín hiệu thần kinh thính giác.' }
    ]
  }
};

/** Fallback lookup returning asset spec if present or synthesizing clean metadata from mode ID */
export function getBiologyAssetSpec(id: string): BiologyAssetSpec | undefined {
  return BIOLOGY_ASSET_MANIFEST[id];
}

export function listBiologyAssetsByTopic(topic: BiologyAssetTopic): BiologyAssetSpec[] {
  return Object.values(BIOLOGY_ASSET_MANIFEST).filter((a) => a.topic === topic);
}
