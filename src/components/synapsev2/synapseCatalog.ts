import * as THREE from 'three';

export type MonumentId =
  | 'dyson'
  | 'tokamak'
  | 'tesseract'
  | 'neural_aero'
  | 'quantum_cryostat'
  | 'gravitational_ligo'
  | 'space_elevator'
  | 'warp_alcubierre'
  | 'hyperbolic_calabi'
  | 'dna_nanobot'
  | 'penning_antimatter'
  | 'fractal_attractor'
  | 'james_webb'
  | 'wormhole_morris'
  | 'pulsar_magnetar'
  | 'oort_solar_sail'
  | 'supercomputer_torus'
  | 'cpu_pipeline_core'
  | 'blockchain_zk_lattice'
  | 'graph_dijkstra_citadel'
  | 'lhc_collider'
  | 'laser_interferometer'
  | 'tesla_electromagnet'
  | 'lidar_autonomous_core'
  | 'solar_thermal_tower'
  | 'mri_tomography_ring'
  | 'sagnac_ring_gyro'
  | 'metamaterial_cloak'
  | 'acoustic_levitation'
  | 'photonic_tensor_core';

export type MonumentCategory = 'cosmos' | 'cs' | 'physics' | 'math' | 'future_tech';

export interface SynapseV2Params {
  primaryParam: number;
  secondaryParam: number;
  explodeFactor: number;
  timeScale: number;
}

export interface MonumentTelemetry {
  metric1LabelVi: string;
  metric1LabelEn: string;
  metric1Value: string;
  metric2LabelVi: string;
  metric2LabelEn: string;
  metric2Value: string;
  metric3LabelVi: string;
  metric3LabelEn: string;
  metric3Value: string;
  statusVi: string;
  statusEn: string;
}

export interface MonumentDefinition {
  id: MonumentId;
  index: number;
  code: string;
  category: MonumentCategory;
  categoryLabelVi: string;
  categoryLabelEn: string;
  tierBadge: string;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  accentHex: string;
  secondaryHex: string;
  primaryLabelVi: string;
  primaryLabelEn: string;
  primaryUnit: string;
  primaryRange: [number, number, number];
  secondaryLabelVi: string;
  secondaryLabelEn: string;
  secondaryUnit: string;
  secondaryRange: [number, number, number];
  relatedSubject: 'math' | 'physics' | 'cs';
  relatedLabelVi: string;
  relatedLabelEn: string;
}

export interface BuiltMonument {
  root: THREE.Group;
  update: (elapsed: number, delta: number, params: SynapseV2Params) => void;
  dispose: () => void;
}

export const MONUMENT_CATALOG: MonumentDefinition[] = [
  {
    id: 'dyson',
    index: 1,
    code: '01 · KARDASHEV II',
    category: 'cosmos',
    categoryLabelVi: 'Vũ trụ & Tương đối',
    categoryLabelEn: 'Cosmos & Relativity',
    tierBadge: '3D Astrophysical Core',
    titleVi: 'Đài Thiên Văn Vòng Dyson & Hố Đen Kerr',
    titleEn: 'Dyson Sphere Observatory & Kerr Black Hole',
    subtitleVi: 'Vật lí Thiên văn Tương đối · Đĩa bồi tụ & Vòng thu năng lượng Mặt Trời',
    subtitleEn: 'Relativistic Astrophysics · Accretion Disk & Gimbal Solar Collector Array',
    descriptionVi:
      'Siêu cấu trúc vòng Dyson 3 trục quay ngược chiều bao quanh hố đen Kerr phát tia tương đối tính dọc 2 cực, cùng 1.400 ngôi sao quay theo định luật Kepler.',
    descriptionEn:
      'Counter-rotating 3-axis Dyson gimbal rings harvesting energy around a Kerr singularity with bipolar relativistic jets and 1,400 Keplerian orbiting stars.',
    accentHex: '#38bdf8',
    secondaryHex: '#818cf8',
    primaryLabelVi: 'Khối lượng Kỳ dị (M)',
    primaryLabelEn: 'Singularity Mass (M)',
    primaryUnit: 'M☉',
    primaryRange: [10, 120, 45],
    secondaryLabelVi: 'Độ xoắn Đĩa bồi tụ',
    secondaryLabelEn: 'Accretion Spin (a*)',
    secondaryUnit: '%',
    secondaryRange: [15, 100, 68],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Phòng Lab Vật lí 3D',
    relatedLabelEn: 'Open Physics 3D Lab'
  },
  {
    id: 'tokamak',
    index: 2,
    code: '02 · FUSION ITER',
    category: 'physics',
    categoryLabelVi: 'Vật lí & Năng lượng',
    categoryLabelEn: 'Physics & Energy',
    tierBadge: 'Superconducting Reactor',
    titleVi: 'Lò Phản Ứng Nhiệt Hạch Tokamak & Máy Gia Tốc',
    titleEn: 'Cryogenic Tokamak Fusion Reactor & Collider',
    subtitleVi: 'Từ trường siêu dẫn 18 cuộn D · Phản ứng D-T 150 Triệu K',
    subtitleEn: 'Superconducting Magnetics · 18 Cryo D-Coils & Confined Helical D-T Plasma',
    descriptionVi:
      '18 nam châm siêu dẫn hình chữ D giam giữ dòng plasma nóng 150 triệu độ xoắn ốc theo đường sức từ B. Kéo thanh Tách lớp để nhìn xuyên vào lõi lò!',
    descriptionEn:
      '18 sculpted cryogenic D-coils confining a helical 150-million-Kelvin fusion plasma core. Drag the Cutaway slider to inspect the blazing core.',
    accentHex: '#f59e0b',
    secondaryHex: '#f97316',
    primaryLabelVi: 'Cảm ứng Từ trường (B)',
    primaryLabelEn: 'Magnetic Field (B)',
    primaryUnit: 'T',
    primaryRange: [4, 18, 12],
    secondaryLabelVi: 'Nhiệt độ Plasma (T)',
    secondaryLabelEn: 'Plasma Temp (T)',
    secondaryUnit: 'MK',
    secondaryRange: [60, 280, 165],
    relatedSubject: 'physics',
    relatedLabelVi: 'Xem Mô phỏng Từ trường Lorentz',
    relatedLabelEn: 'Explore Lorentz Force 3D'
  },
  {
    id: 'tesseract',
    index: 3,
    code: '03 · 4D RIEMANN',
    category: 'math',
    categoryLabelVi: 'Toán học Đa chiều',
    categoryLabelEn: 'Higher-Dim Math',
    tierBadge: 'Non-Euclidean Manifold',
    titleVi: 'Thánh Đường Hình Học 4D Tesseract & Mặt Riemann',
    titleEn: 'Non-Euclidean 4D Tesseract & Riemann Cathedral',
    subtitleVi: 'Chiếu phối cảnh Siêu lập phương 4 chiều R⁴ → R³ & Đa tạp phức Riemann',
    subtitleEn: 'Real-Time R⁴ → R³ Stereographic Hypercube Projection & Complex Manifold',
    descriptionVi:
      'Siêu lập phương 4 chiều (16 đỉnh, 32 cạnh) xoay thực thời trong mặt phẳng XW/YW lơ lửng giữa Thánh đường 8 cột pha lê và mặt cong giải tích Riemann.',
    descriptionEn:
      'A true 4D hypercube rotating live through orthogonal XW/YW planes above a harmonic Riemann surface inside an 8-pillar crystal temple.',
    accentHex: '#a855f7',
    secondaryHex: '#ec4899',
    primaryLabelVi: 'Tốc độ xoay Chiều thứ 4 (XW)',
    primaryLabelEn: '4D Plane Speed (θ_XW)',
    primaryUnit: '°/s',
    primaryRange: [5, 100, 42],
    secondaryLabelVi: 'Biên độ Độ cong Riemann',
    secondaryLabelEn: 'Riemann Curvature',
    secondaryUnit: '%',
    secondaryRange: [10, 100, 62],
    relatedSubject: 'math',
    relatedLabelVi: 'Mở Toán Không gian Oxyz 3D',
    relatedLabelEn: 'Open Math Oxyz 3D'
  },
  {
    id: 'neural_aero',
    index: 4,
    code: '04 · QUANTUM AI',
    category: 'future_tech',
    categoryLabelVi: 'AI & Công nghệ Tương lai',
    categoryLabelEn: 'AI & Future Tech',
    tierBadge: 'Synaptic Wind Matrix',
    titleVi: 'Siêu Mạng Nơ-ron Lượng Tử & Tháp Khí Động Lực',
    titleEn: 'Quantum Neural Spire & Supersonic Wind Tunnel',
    subtitleVi: 'Tháp tính toán Nơ-ron xung 4 tầng & Dòng chảy Navier-Stokes 3D',
    subtitleEn: '4-Tier Spiking Synaptic Matrix & Real-Time Navier-Stokes Streamlines',
    descriptionVi:
      'Kiến trúc mạng nơ-ron 3D 96 nút phát 480 xung tín hiệu song song cùng khoang thử nghiệm khí động lực siêu thanh với các dải dòng khí uốn lượn.',
    descriptionEn:
      'A towering 96-node 3D neural architecture firing 480 live action-potential pulses beneath a supersonic aerodynamic delta-hull wind tunnel.',
    accentHex: '#10b981',
    secondaryHex: '#06b6d4',
    primaryLabelVi: 'Số Mach Khí Động Lực',
    primaryLabelEn: 'Supersonic Flow (Mach)',
    primaryUnit: 'M',
    primaryRange: [4, 32, 16],
    secondaryLabelVi: 'Tần số Xung Synapses',
    secondaryLabelEn: 'Synaptic Firing Rate',
    secondaryUnit: 'Hz',
    secondaryRange: [15, 120, 65],
    relatedSubject: 'cs',
    relatedLabelVi: 'Mở Đồ thị & Thuật toán Tin học',
    relatedLabelEn: 'Open CS Algo Visualizer'
  },
  {
    id: 'quantum_cryostat',
    index: 5,
    code: '05 · QUBIT 10mK',
    category: 'future_tech',
    categoryLabelVi: 'AI & Công nghệ Tương lai',
    categoryLabelEn: 'AI & Future Tech',
    tierBadge: 'Dilution Cryo Computer',
    titleVi: 'Máy Tính Lượng Tử Siêu Dẫn & Quả Cầu Bloch',
    titleEn: 'Superconducting Quantum Cryostat & Bloch Core',
    subtitleVi: 'Đèn chùm làm lạnh 10 millikelvin · Rối lượng tử Qubit & Vi ba đồng trục',
    subtitleEn: '10mK Golden Dilution Chandelier · Coherent Qubit Bloch Sphere Telemetry',
    descriptionVi:
      'Tháp làm lạnh pha loãng bằng đồng mạ vàng nhiều tầng kết nối hàng chục ống dẫn vi ba tới lõi Quả cầu Bloch biểu diễn trạng thái chồng chập |ψ⟩ = α|0⟩ + β|1⟩.',
    descriptionEn:
      'Multi-tier gold-plated dilution refrigerator channeling microwave waveguides to an interactive Bloch Sphere core visualizing quantum superposition.',
    accentHex: '#eab308',
    secondaryHex: '#38bdf8',
    primaryLabelVi: 'Số Qubit Liên kết (N)',
    primaryLabelEn: 'Entangled Qubits (N)',
    primaryUnit: 'qb',
    primaryRange: [16, 512, 128],
    secondaryLabelVi: 'Thời gian Kết hợp T₂',
    secondaryLabelEn: 'Coherence Time (T₂)',
    secondaryUnit: 'µs',
    secondaryRange: [40, 420, 190],
    relatedSubject: 'cs',
    relatedLabelVi: 'Mở Tin học & Thuật toán VNOI',
    relatedLabelEn: 'Open CS Algorithms'
  },
  {
    id: 'gravitational_ligo',
    index: 6,
    code: '06 · LIGO SPACETIME',
    category: 'cosmos',
    categoryLabelVi: 'Vũ trụ & Tương đối',
    categoryLabelEn: 'Cosmos & Relativity',
    tierBadge: 'Einstein Quadrupole Lab',
    titleVi: 'Giao Thoa Kế Sóng Hấp Dẫn & Hệ Đôi Sao Neutron',
    titleEn: 'Gravitational Wave Interferometer & Binary Inspirals',
    subtitleVi: 'Lưới Không-Thời gian uốn cong thực thời & Hai nhánh Laser Fabry-Pérot',
    subtitleEn: 'Live Deforming Spacetime Metric & Orthogonal 4km Fabry-Pérot Laser Arms',
    descriptionVi:
      'Hai sao neutron xoay xoắn ốc phát ra sóng hấp dẫn làm gợn sóng trực tiếp lưới Không-Thời gian bên dưới hai cánh tay giao thoa laser siêu chính xác.',
    descriptionEn:
      'Spiraling binary neutron stars radiating quadrupole spacetime ripples directly beneath orthogonal high-precision laser interferometer arms.',
    accentHex: '#06b6d4',
    secondaryHex: '#6366f1',
    primaryLabelVi: 'Tần số Quỹ đạo Hệ đôi',
    primaryLabelEn: 'Binary Orbital Freq',
    primaryUnit: 'Hz',
    primaryRange: [20, 350, 140],
    secondaryLabelVi: 'Biên độ Biến dạng (h)',
    secondaryLabelEn: 'Metric Strain (h)',
    secondaryUnit: '×10⁻²¹',
    secondaryRange: [5, 100, 55],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Thí nghiệm Sóng & Giao thoa',
    relatedLabelEn: 'Explore Wave Optics Lab'
  },
  {
    id: 'space_elevator',
    index: 7,
    code: '07 · GEO-TETHER 36K',
    category: 'cosmos',
    categoryLabelVi: 'Vũ trụ & Tương đối',
    categoryLabelEn: 'Cosmos & Relativity',
    tierBadge: 'Orbital Mega-Engineering',
    titleVi: 'Thang Máy Không Gian Quỹ Đạo Địa Tĩnh & Cổng Phóng',
    titleEn: 'Geostationary Space Elevator & Orbital Ringport',
    subtitleVi: 'Cáp ống nano Carbon nối Trái Đất tới Trạm Đối trọng & Vệ tinh Vành đai',
    subtitleEn: 'Carbon Nanotube Tether · Active Climber Carriage & Geo-Counterweight Citadel',
    descriptionVi:
      'Sợi cáp ống nano carbon vươn từ hành tinh xanh xuyên qua buồng thang nâng quỹ đạo lên trạm đối trọng không gian kèm đội hình vệ tinh bao quanh.',
    descriptionEn:
      'An orbital tether rising from a rotating blue world through a luminous magnetic climber station up to a counterweight citadel ringed by satellites.',
    accentHex: '#0ea5e9',
    secondaryHex: '#34d399',
    primaryLabelVi: 'Vận tốc Thang nâng',
    primaryLabelEn: 'Climber Velocity',
    primaryUnit: 'km/h',
    primaryRange: [120, 1200, 480],
    secondaryLabelVi: 'Lực Căng Cáp Carbon',
    secondaryLabelEn: 'Tether Tension',
    secondaryUnit: 'GN',
    secondaryRange: [20, 140, 68],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Mô phỏng Cơ học Quỹ đạo',
    relatedLabelEn: 'Explore Orbital Mechanics'
  },
  {
    id: 'warp_alcubierre',
    index: 8,
    code: '08 · ALCUBIERRE M>',
    category: 'cosmos',
    categoryLabelVi: 'Vũ trụ & Tương đối',
    categoryLabelEn: 'Cosmos & Relativity',
    tierBadge: 'Faster-Than-Light Metric',
    titleVi: 'Động Cơ Bẻ Cong Không-Thời Gian Alcubierre',
    titleEn: 'Alcubierre Warp Drive & Spacetime Bubble Core',
    subtitleVi: 'Co hẹp Không gian phía trước · Giãn nở phía sau bằng Cuộn Năng lượng âm',
    subtitleEn: 'Forward Metric Contraction · Dual Exotic-Matter Toroidal Field Rings',
    descriptionVi:
      'Phi thuyền nghiên cứu nằm gọn bên trong hai vành từ trường năng lượng âm kép, tạo bong bóng bẻ cong không-thời gian và đường hầm ánh sáng siêu tốc.',
    descriptionEn:
      'A sleek starprobe nested inside dual exotic-matter toroidal coils, generating asymmetric spacetime warp shells and relativistic starstreaks.',
    accentHex: '#6366f1',
    secondaryHex: '#22d3ee',
    primaryLabelVi: 'Hệ số Warp Tương đối',
    primaryLabelEn: 'Warp Factor (v/c)',
    primaryUnit: 'c',
    primaryRange: [1, 15, 6],
    secondaryLabelVi: 'Mật độ Năng lượng Âm',
    secondaryLabelEn: 'Exotic Flux Density',
    secondaryUnit: '%',
    secondaryRange: [15, 100, 72],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Mô phỏng Điện từ & Ánh sáng',
    relatedLabelEn: 'Open Electromagnetism 3D'
  },
  {
    id: 'hyperbolic_calabi',
    index: 9,
    code: '09 · CALABI-YAU 6D',
    category: 'math',
    categoryLabelVi: 'Toán học Đa chiều',
    categoryLabelEn: 'Higher-Dim Math',
    tierBadge: 'String Topology Sculpture',
    titleVi: 'Đa Tạp Calabi-Yau 6 Chiều & Lưới Hyperbolic Poincaré',
    titleEn: '6D Calabi-Yau Manifold & Poincaré Hyperbolic Disk',
    subtitleVi: 'Hình học Lý thuyết Dây · Chiếu đa tạp phức bậc n & Nút thắt Hopf',
    subtitleEn: 'String-Theory Complex Manifold · Quintic Petals & Interlocking Hopf Rings',
    descriptionVi:
      'Tác phẩm điêu khắc toán học đa tạp Calabi-Yau ẩn chứa 6 chiều cuộn xoắn trên nền đĩa hyperbolic Poincaré và các nút thắt xuyến vàng lồng nhau.',
    descriptionEn:
      'A luminous parametric Calabi-Yau manifold projection hovering over a multi-ring Poincaré hyperbolic floor framed by interlocking Hopf rings.',
    accentHex: '#ec4899',
    secondaryHex: '#a855f7',
    primaryLabelVi: 'Bậc Đối xứng Đa tạp (n)',
    primaryLabelEn: 'Manifold Degree (n)',
    primaryUnit: 'D',
    primaryRange: [3, 9, 5],
    secondaryLabelVi: 'Pha Cuộn Chiều Ẩn (φ)',
    secondaryLabelEn: 'Compactified Phase (φ)',
    secondaryUnit: '°',
    secondaryRange: [0, 360, 120],
    relatedSubject: 'math',
    relatedLabelVi: 'Mở Đồ thị & Hình học Phức',
    relatedLabelEn: 'Open Math 2D/3D Studio'
  },
  {
    id: 'dna_nanobot',
    index: 10,
    code: '10 · BIO-NANOBOT',
    category: 'future_tech',
    categoryLabelVi: 'AI & Công nghệ Tương lai',
    categoryLabelEn: 'AI & Future Tech',
    tierBadge: 'Synthetic Bio-Assembler',
    titleVi: 'Nhà Máy Nano Sinh Học & Chuỗi Xoắn Kép DNA Lượng Tử',
    titleEn: 'Synthetic DNA Double-Helix & Autonomous Nanobot Swarm',
    subtitleVi: '24 Cặp Base mã hóa A-T/G-C · Đội bay Robot Nano sửa chữa mã gen',
    subtitleEn: '24 Glowing Base-Pair Bridges · Articulated Autonomous Medical Nanobot Drones',
    descriptionVi:
      'Chuỗi xoắn kép DNA phát quang khổng lồ được bao quanh bởi 6 robot nano đa khớp quay quét đọc-sửa trình tự gen; tách lớp giúp tách đôi hai mạch ADN.',
    descriptionEn:
      'A monumental double-helix DNA macromolecule orbited by 6 articulated autonomous nanobot drones scanning genetic sequences with unzip cutaway.',
    accentHex: '#14b8a6',
    secondaryHex: '#f43f5e',
    primaryLabelVi: 'Góc Xoắn Chuỗi Helix',
    primaryLabelEn: 'Helix Twist Rate',
    primaryUnit: '°',
    primaryRange: [18, 60, 34],
    secondaryLabelVi: 'Tốc độ Quét Nano-Bot',
    secondaryLabelEn: 'Nanobot Scan Speed',
    secondaryUnit: '%',
    secondaryRange: [20, 100, 70],
    relatedSubject: 'cs',
    relatedLabelVi: 'Mở Thuật toán Chuỗi & DP',
    relatedLabelEn: 'Open String & DP Algos'
  },
  {
    id: 'penning_antimatter',
    index: 11,
    code: '11 · POSITRON TRAP',
    category: 'physics',
    categoryLabelVi: 'Vật lí & Năng lượng',
    categoryLabelEn: 'Physics & Energy',
    tierBadge: 'Particle Containment Core',
    titleVi: 'Bẫy Từ Trường Penning & Lõi Phản Vật Chất Positron',
    titleEn: 'Hyperbolic Penning Trap & Antimatter Positron Cloud',
    subtitleVi: 'Điện cực Hyperbol đồng siêu dẫn & Quỹ đạo xoáy Cyclotron giam giữ phản hạt',
    subtitleEn: 'Copper-Gold Quadrupole Electrodes & Helical Magnetron Positron Confinement',
    descriptionVi:
      'Buồng bẫy Penning với các điện cực hyperbol mạ đồng vàng và cuộn Helmholtz treo lơ lửng đám mây Positron đang xoáy Cyclotron ổn định ở trung tâm.',
    descriptionEn:
      'Precision copper-gold hyperbolic ring electrodes and Helmholtz cryomagnets suspending a glowing cyclotron positron cloud inside a crystal vessel.',
    accentHex: '#f43f5e',
    secondaryHex: '#38bdf8',
    primaryLabelVi: 'Điện thế Giam giữ (V₀)',
    primaryLabelEn: 'Quadrupole Voltage (V₀)',
    primaryUnit: 'kV',
    primaryRange: [10, 120, 56],
    secondaryLabelVi: 'Mật độ Positron',
    secondaryLabelEn: 'Positron Density',
    secondaryUnit: '×10⁸',
    secondaryRange: [15, 100, 64],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Thí nghiệm Điện tích & Từ trường',
    relatedLabelEn: 'Open Particle Physics Lab'
  },
  {
    id: 'fractal_attractor',
    index: 12,
    code: '12 · CHAOS LORENZ',
    category: 'math',
    categoryLabelVi: 'Toán học Đa chiều',
    categoryLabelEn: 'Higher-Dim Math',
    tierBadge: 'Strange Attractor Sculpture',
    titleVi: 'Điêu Khắc Hỗn Mang Lorenz-Aizawa & Trường Vector 3D',
    titleEn: 'Lorenz-Aizawa Strange Attractor & 3D Vector Field',
    subtitleVi: 'Quỹ đạo Bướm Hỗn mang 3D · 600 hạt pha trượt trên Trường Vector trực quan',
    subtitleEn: 'Luminous Chaotic Phase Orbits · Live Interactive 3D Vector Field Matrix',
    descriptionVi:
      'Quỹ đạo kỳ lạ Lorenz và Aizawa đan xen rực rỡ phía trên ma trận 121 mũi tên trường vector đổi hướng liên tục theo tham số Rayleigh ρ.',
    descriptionEn:
      'Intertwined Lorenz & Aizawa strange attractor trajectories hovering above a reactive 121-vector directional field grid with phase-space tracers.',
    accentHex: '#fb923c',
    secondaryHex: '#38bdf8',
    primaryLabelVi: 'Tham số Rayleigh (ρ)',
    primaryLabelEn: 'Rayleigh Number (ρ)',
    primaryUnit: '',
    primaryRange: [14, 48, 28],
    secondaryLabelVi: 'Độ Phân kỳ Prandtl (σ)',
    secondaryLabelEn: 'Prandtl Divergence (σ)',
    secondaryUnit: '',
    secondaryRange: [5, 24, 10],
    relatedSubject: 'math',
    relatedLabelVi: 'Mở Đồ thị & Vi tích phân',
    relatedLabelEn: 'Open Calculus & Graphs'
  },
  // ==================== +4 KHOA HỌC VŨ TRỤ (SPACE SCIENCE) ====================
  {
    id: 'james_webb',
    index: 13,
    code: '13 · JWST L2',
    category: 'cosmos',
    categoryLabelVi: 'Khoa học Vũ trụ',
    categoryLabelEn: 'Space Science',
    tierBadge: 'Infrared Space Observatory',
    titleVi: 'Kính Viễn Vọng James Webb & 18 Gương Vàng L2',
    titleEn: 'James Webb Infrared Observatory & 18-Hex Gold Mirror',
    subtitleVi: '18 Gương Lục giác Beryllium mạ vàng · Khiên nhiệt 5 lớp Kapton ở Điểm L2',
    subtitleEn: '18 Gold-Coated Beryllium Hex Segments · 5-Layer Kapton Sunshield Array',
    descriptionVi:
      'Kính thiên văn hồng ngoại sâu với 18 mảnh gương lục giác mạ vàng hội tụ tia sáng thiên hà sơ khai cùng bộ khiên chắn nhiệt 5 tầng bạc tách lớp ở điểm Lagrange L2.',
    descriptionEn:
      'Deep-field infrared space telescope with 18 articulated gold-beryllium hexagonal mirrors focusing ancient starlight over a 5-layer deployable silver sunshield.',
    accentHex: '#fbbf24',
    secondaryHex: '#38bdf8',
    primaryLabelVi: 'Bước sóng Hồng ngoại (λ)',
    primaryLabelEn: 'Infrared Wavelength (λ)',
    primaryUnit: 'µm',
    primaryRange: [1, 28, 12],
    secondaryLabelVi: 'Độ đồng pha Gương',
    secondaryLabelEn: 'Mirror Phasing Sync',
    secondaryUnit: '%',
    secondaryRange: [15, 100, 86],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Quang học & Thấu kính',
    relatedLabelEn: 'Explore Optics & Telescopes'
  },
  {
    id: 'wormhole_morris',
    index: 14,
    code: '14 · WORMHOLE ER',
    category: 'cosmos',
    categoryLabelVi: 'Khoa học Vũ trụ',
    categoryLabelEn: 'Space Science',
    tierBadge: 'Traversable Spacetime Bridge',
    titleVi: 'Cầu Einstein-Rosen & Lỗ Sâu Xuyên Không Thời Gian',
    titleEn: 'Morris-Thorne Traversable Wormhole & Exotic Throat',
    subtitleVi: 'Hai phễu Vũ trụ Hyperbol nối thông cổ họng lỗ sâu & Thấu kính hấp dẫn cầu',
    subtitleEn: 'Dual Flaring Embedding Manifolds · Exotic Throat & Gravitational Lens Core',
    descriptionVi:
      'Cầu nối hai vùng không-thời gian xa xôi qua mặt nhúng dạng kèn đôi liên thông bằng vật chất kỳ lạ, khiến các chùm photon từ vũ trụ trên xoáy xuyên qua cổ họng sang vũ trụ dưới.',
    descriptionEn:
      'Dual hyperbolic universe sheets joined through an exotic-matter throat aperture, funneling relativistic photons seamlessly between distant cosmos manifolds.',
    accentHex: '#818cf8',
    secondaryHex: '#f472b6',
    primaryLabelVi: 'Bán kính Cổ họng (b₀)',
    primaryLabelEn: 'Throat Radius (b₀)',
    primaryUnit: 'm',
    primaryRange: [2, 24, 10],
    secondaryLabelVi: 'Độ cong Không-Thời gian',
    secondaryLabelEn: 'Bridge Curvature',
    secondaryUnit: '%',
    secondaryRange: [15, 100, 68],
    relatedSubject: 'math',
    relatedLabelVi: 'Mở Hình học Mặt cong 3D',
    relatedLabelEn: 'Open 3D Manifold Math'
  },
  {
    id: 'pulsar_magnetar',
    index: 15,
    code: '15 · MAGNETAR PSR',
    category: 'cosmos',
    categoryLabelVi: 'Khoa học Vũ trụ',
    categoryLabelEn: 'Space Science',
    tierBadge: 'Relativistic Neutron Beacon',
    titleVi: 'Sao Neutron Xung Nhịp Pulsar & Từ Quyển Magnetar',
    titleEn: 'Millisecond Pulsar Beacon & Magnetar Dipole Field',
    subtitleVi: 'Lõi sao siêu đặc quay trăm vòng/giây · 16 Đường sức lưỡng cực & Nón Bức xạ',
    subtitleEn: 'Millisecond Rotating Crust · 16 Glowing Dipole Flux Loops & Lighthouse Cones',
    descriptionVi:
      'Ngôi sao neutron siêu từ quay cực nhanh với lớp vỏ tinh thể sắt bao bọc lõi siêu lỏng, phóng ra hai chùm nón bức xạ synchrotron và 16 đường sức từ khổng lồ.',
    descriptionEn:
      'Ultra-dense millisecond pulsar clad in crystalline iron-crust plates, sweeping twin synchrotron lighthouse beams through 16 towering magnetic dipole arches.',
    accentHex: '#22d3ee',
    secondaryHex: '#c084fc',
    primaryLabelVi: 'Tần số Xung Quay',
    primaryLabelEn: 'Spin Frequency',
    primaryUnit: 'Hz',
    primaryRange: [50, 716, 320],
    secondaryLabelVi: 'Từ trường Bề mặt (B)',
    secondaryLabelEn: 'Surface Magnetics',
    secondaryUnit: '×10¹¹ T',
    secondaryRange: [1, 15, 9],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Từ trường & Cảm ứng điện từ',
    relatedLabelEn: 'Explore Magnetic Fields'
  },
  {
    id: 'oort_solar_sail',
    index: 16,
    code: '16 · SOLAR SAIL C3',
    category: 'cosmos',
    categoryLabelVi: 'Khoa học Vũ trụ',
    categoryLabelEn: 'Space Science',
    tierBadge: 'Laser Photon Propulsion',
    titleVi: 'Trạm Phóng Cánh Buồm Ánh Sáng Laser & Mạng Liên Sao',
    titleEn: 'Breakthrough Laser Solar Sail & Interstellar Relay Array',
    subtitleVi: 'Cánh buồm Phản xạ Lục giác siêu mỏng · Dàn pháo Laser Pha 100 GW đẩy tới 20% c',
    subtitleEn: 'Iridescent Hexagonal Sail Membrane · 100 GW Phased Laser Beamer Propulsion',
    descriptionVi:
      'Cánh buồm lượng tử siêu mỏng căng trên giàn sợi carbon nhận chùm tia laser kết hợp từ trạm phát quỹ đạo, gia tốc tàu thăm dò liên sao hướng ra đám mây Oort.',
    descriptionEn:
      'An ultra-light reflective diamond-hex solar sail accelerated by coherent gigawatt photon beams from an orbital phased-array emitter toward Alpha Centauri.',
    accentHex: '#34d399',
    secondaryHex: '#f59e0b',
    primaryLabelVi: 'Công suất Pháo Laser',
    primaryLabelEn: 'Laser Array Power',
    primaryUnit: 'GW',
    primaryRange: [10, 120, 64],
    secondaryLabelVi: 'Tốc độ Tiếp cận (% c)',
    secondaryLabelEn: 'Cruise Velocity (% c)',
    secondaryUnit: '%c',
    secondaryRange: [5, 25, 18],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Động lượng Photon & Ánh sáng',
    relatedLabelEn: 'Explore Photon Momentum'
  },
  // ==================== +4 KHOA HỌC VI TÍNH (COMPUTER SCIENCE) ====================
  {
    id: 'supercomputer_torus',
    index: 17,
    code: '17 · EXASCALE TORUS',
    category: 'cs',
    categoryLabelVi: 'Khoa học Vi tính',
    categoryLabelEn: 'Computer Science',
    tierBadge: '6D Optical Interconnect',
    titleVi: 'Siêu Máy Tính Khối Lập Phương 3D Torus & Chuyển Mạch Quang',
    titleEn: 'Exascale 3D Torus Supercomputer & Optical Packet Mesh',
    subtitleVi: '64 Khối Nút Tính Toán 4×4×4 · Lõi Chuyển Mạch Quang & 360 Gói Tin Tốc Độ Ánh Sáng',
    subtitleEn: '64 Blade Compute Lattice · Central Photonic Crossbar & 360 Live Optical Packets',
    descriptionVi:
      'Ma trận siêu máy tính Exascale 64 cụm máy chủ liên kết theo kiến trúc 3D Torus không tắc nghẽn; kéo thanh Tách lớp để mở bung khối 4×4×4 lộ ra bộ chuyển mạch quang trung tâm.',
    descriptionEn:
      'A 4×4×4 exascale supercomputing lattice routing hundreds of glowing optical data packets across X/Y/Z fiber buses around a central photonic crossbar switch.',
    accentHex: '#06b6d4',
    secondaryHex: '#3b82f6',
    primaryLabelVi: 'Hiệu năng Exascale',
    primaryLabelEn: 'Compute Throughput',
    primaryUnit: 'PF',
    primaryRange: [100, 2000, 950],
    secondaryLabelVi: 'Lưu lượng Gói tin Quang',
    secondaryLabelEn: 'Optical Bus Load',
    secondaryUnit: '%',
    secondaryRange: [15, 100, 74],
    relatedSubject: 'cs',
    relatedLabelVi: 'Mở Phòng Lab Tin học VNOI',
    relatedLabelEn: 'Open CS Competitive Lab'
  },
  {
    id: 'cpu_pipeline_core',
    index: 18,
    code: '18 · RISC-V SUPERSCALAR',
    category: 'cs',
    categoryLabelVi: 'Khoa học Vi tính',
    categoryLabelEn: 'Computer Science',
    tierBadge: 'Multi-Layer Silicon Die',
    titleVi: 'Tháp Vi Xử Lí Siêu Vô Hướng & Đường Ống Lệnh 5 Tầng',
    titleEn: 'Superscalar Out-of-Order CPU Tower & 5-Stage Pipeline',
    subtitleVi: 'Tách lớp Wafer Silicon 5 tầng (Fetch · Decode · ALU · Memory · L3 Cache)',
    subtitleEn: 'Explodable Silicon Layers · Fetch, Decode, Out-of-Order ALU & Shared L3 Cache',
    descriptionVi:
      'Mô hình kiến trúc CPU đa tầng gồm bộ nhớ đệm L3, ma trận ALU thực thi song song, bộ dự đoán rẽ nhánh và dòng lệnh màu chảy xuyên suốt 5 tầng pipeline.',
    descriptionEn:
      'Vertical cutaway of a modern superscalar processor with rotating L3 cache banks, parallel ALU execution cores, branch predictor logic, and live pipeline tokens.',
    accentHex: '#10b981',
    secondaryHex: '#fbbf24',
    primaryLabelVi: 'Xung nhịp Đồng hồ',
    primaryLabelEn: 'Clock Frequency',
    primaryUnit: 'GHz',
    primaryRange: [1, 12, 6],
    secondaryLabelVi: 'Hiệu suất Đường ống (IPC)',
    secondaryLabelEn: 'Pipeline Utilization',
    secondaryUnit: '%',
    secondaryRange: [15, 100, 82],
    relatedSubject: 'cs',
    relatedLabelVi: 'Mở Trình Mô phỏng & Code Lab',
    relatedLabelEn: 'Open Code & Algo Studio'
  },
  {
    id: 'blockchain_zk_lattice',
    index: 19,
    code: '19 · CRYPTO ECC-ZK',
    category: 'cs',
    categoryLabelVi: 'Khoa học Vi tính',
    categoryLabelEn: 'Computer Science',
    tierBadge: 'Zero-Knowledge Merkle Spire',
    titleVi: 'Đền Thờ Mật Mã Đường Cong Elliptic & Cây Merkle Zero-Knowledge',
    titleEn: 'Elliptic-Curve Cryptography Lattice & ZK-Merkle Spire',
    subtitleVi: 'Cây băm Merkle 3D hội tụ gốc · Mặt cong Elliptic & Vòng Khối Bất Biến',
    subtitleEn: '3D Binary Merkle Proof Tree · Finite-Field Elliptic Manifold & Hash Vault Rings',
    descriptionVi:
      'Tháp cây băm Merkle 3D xác thực bằng chứng Zero-Knowledge từ các nút lá vươn lên đỉnh Root Hash bên trên mặt đa tạp mật mã đường cong Elliptic.',
    descriptionEn:
      'A glowing 3D Merkle verification pyramid channeling cryptographic proof beams upward from leaf blocks to the Root Hash above an elliptic-curve lattice.',
    accentHex: '#a855f7',
    secondaryHex: '#22d3ee',
    primaryLabelVi: 'Độ dài Khóa Mật mã',
    primaryLabelEn: 'Cryptographic Key Size',
    primaryUnit: 'bit',
    primaryRange: [128, 512, 256],
    secondaryLabelVi: 'Tốc độ Chứng minh ZK',
    secondaryLabelEn: 'ZK-Prover Throughput',
    secondaryUnit: '%',
    secondaryRange: [15, 100, 78],
    relatedSubject: 'cs',
    relatedLabelVi: 'Mở Thuật toán Cây & Băm',
    relatedLabelEn: 'Explore Tree & Hash Algos'
  },
  {
    id: 'graph_dijkstra_citadel',
    index: 20,
    code: '20 · GRAPH TOPOLOGY',
    category: 'cs',
    categoryLabelVi: 'Khoa học Vi tính',
    categoryLabelEn: 'Computer Science',
    tierBadge: '3D Network Routing Engine',
    titleVi: 'Ma Trận Đồ Thị Đường Đi Ngắn Nhất & Cây Khung Cực Tiểu 3D',
    titleEn: '3D Spatial Graph Routing Network & Minimum Spanning Citadel',
    subtitleVi: '32 Đỉnh không gian đa tầng · Sóng lan truyền Dijkstra & Đường trục Tối ưu',
    subtitleEn: '32 Geodesic Graph Nodes · Live Dijkstra Frontier Wave & Minimum Spanning Spine',
    descriptionVi:
      'Đồ thị không gian 32 đỉnh kết nối qua mạng cáp quang trọng số; sóng tìm đường Dijkstra phát sáng tuần tự từ đỉnh nguồn xuyên qua đường đi ngắn nhất tới đích.',
    descriptionEn:
      'Interactive 32-vertex 3D weighted network where live Dijkstra wavefront pulses discover and illuminate the optimal minimum-cost routing backbone.',
    accentHex: '#f43f5e',
    secondaryHex: '#38bdf8',
    primaryLabelVi: 'Mật độ Cạnh Đồ thị',
    primaryLabelEn: 'Graph Edge Density',
    primaryUnit: '%',
    primaryRange: [20, 100, 65],
    secondaryLabelVi: 'Tốc độ Lan truyền Sóng',
    secondaryLabelEn: 'Wavefront Speed',
    secondaryUnit: '%',
    secondaryRange: [15, 100, 70],
    relatedSubject: 'cs',
    relatedLabelVi: 'Mở Mô phỏng Đồ thị 2D/3D',
    relatedLabelEn: 'Open Graph Algo Visualizer'
  },
  {
    id: 'lhc_collider',
    index: 21,
    code: '21 · CERN LHC ATLAS',
    category: 'physics',
    categoryLabelVi: 'Vật lí & Năng lượng',
    categoryLabelEn: 'Physics & Energy',
    tierBadge: 'Particle Accelerator 3D',
    titleVi: 'Máy Gia Tốc Hạt Lớn LHC & Buồng Va Chạm Toroidal',
    titleEn: 'Large Hadron Collider & Toroidal Particle Detector',
    subtitleVi: 'Chùm proton 14 TeV · 8 Cuộn nam châm siêu dẫn & Vệt phân rã Higgs',
    subtitleEn: '14 TeV Proton Beams · 8 Superconducting Toroids & Higgs Decay Tracks',
    descriptionVi:
      'Mô phỏng máy gia tốc hạt va chạm trực diện hai chùm proton ngược chiều qua hệ thống 8 cuộn nam châm siêu dẫn D-coil, quan sát quỹ đạo hạt uốn cong theo lực Lorentz q(v×B).',
    descriptionEn:
      'Interactive particle collider accelerating counter-rotating proton bunches into head-on collisions inside 8 superconducting toroid magnets curving decay trajectories.',
    accentHex: '#38bdf8',
    secondaryHex: '#f43f5e',
    primaryLabelVi: 'Năng lượng Va chạm',
    primaryLabelEn: 'Beam Energy',
    primaryUnit: 'TeV',
    primaryRange: [2, 14, 13],
    secondaryLabelVi: 'Từ trường Siêu dẫn B',
    secondaryLabelEn: 'Toroidal Magnetic Field',
    secondaryUnit: 'T',
    secondaryRange: [2, 12, 8],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Phòng Thí Nghiệm Vật lí',
    relatedLabelEn: 'Open Physics Simulation Lab'
  },
  {
    id: 'laser_interferometer',
    index: 22,
    code: '22 · QUANTUM OPTICS',
    category: 'physics',
    categoryLabelVi: 'Vật lí & Năng lượng',
    categoryLabelEn: 'Physics & Energy',
    tierBadge: 'Wave-Particle Optics Bench',
    titleVi: 'Giao Thoa Kế Laser & Thí Nghiệm Khe Kép Lượng Tử',
    titleEn: 'Laser Interferometer & Quantum Double-Slit Bench',
    subtitleVi: 'Sóng giao thoa 3D thời gian thực · Phổ bước sóng λ (400–700nm)',
    subtitleEn: 'Live 3D Wave Superposition · Tunable Wavelength λ & Interference Fringes',
    descriptionVi:
      'Bàn quang học chính xác với tia laser đơn sắc thay đổi màu sắc theo bước sóng λ, đi qua khe kép d tạo mặt sóng giao thoa 3D và các vân sáng/tối trên màn hứng.',
    descriptionEn:
      'Precision optical bench emitting tunable laser wavelengths through an adjustable double-slit aperture to generate real-time 3D wave interference and detector fringes.',
    accentHex: '#10b981',
    secondaryHex: '#22d3ee',
    primaryLabelVi: 'Bước sóng Laser (λ)',
    primaryLabelEn: 'Laser Wavelength (λ)',
    primaryUnit: 'nm',
    primaryRange: [400, 700, 532],
    secondaryLabelVi: 'Khoảng cách 2 khe (d)',
    secondaryLabelEn: 'Slit Separation (d)',
    secondaryUnit: 'µm',
    secondaryRange: [10, 60, 28],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Mô phỏng Sóng & Quang học',
    relatedLabelEn: 'Open Wave & Optics Lab'
  },
  {
    id: 'tesla_electromagnet',
    index: 23,
    code: '23 · TESLA RESONANT',
    category: 'physics',
    categoryLabelVi: 'Vật lí & Năng lượng',
    categoryLabelEn: 'Physics & Energy',
    tierBadge: 'High-Voltage EM Tower',
    titleVi: 'Tháp Cộng Hưởng Tesla & Trường Điện Từ Cao Áp',
    titleEn: 'Resonant Tesla Coil & High-Voltage EM Field Tower',
    subtitleVi: 'Cảm ứng LC cộng hưởng · Hồ quang Plasma & Đường sức lưỡng cực',
    subtitleEn: 'LC Resonant Induction · Jagged Plasma Arcs & Dipole EM Flux Lines',
    descriptionVi:
      'Biến áp cộng hưởng cao áp với cuộn sơ cấp đồng phẳng, tháp thứ cấp và vành phóng điện cực đại tạo tia sét plasma cao áp và quỹ đạo ion dọc đường sức điện từ.',
    descriptionEn:
      'High-voltage resonant transformer featuring copper primary pancake windings, quartz-shielded secondary tower, live branching plasma discharges, and dipole EM flux.',
    accentHex: '#a855f7',
    secondaryHex: '#38bdf8',
    primaryLabelVi: 'Tần số Cộng hưởng LC',
    primaryLabelEn: 'Resonant Frequency',
    primaryUnit: 'kHz',
    primaryRange: [50, 400, 180],
    secondaryLabelVi: 'Hiệu điện thế Đỉnh',
    secondaryLabelEn: 'Peak Discharge Voltage',
    secondaryUnit: 'kV',
    secondaryRange: [50, 500, 320],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Mô phỏng Điện Từ học',
    relatedLabelEn: 'Open Electromagnetism Lab'
  },
  {
    id: 'lidar_autonomous_core',
    index: 24,
    code: '24 · LIDAR SLAM CORE',
    category: 'future_tech',
    categoryLabelVi: 'Công nghệ Tương lai',
    categoryLabelEn: 'Future Tech',
    tierBadge: '3D Point-Cloud SLAM',
    titleVi: 'Lõi Cảm Biến LiDAR Đa Tia & Quét Bản Đồ SLAM 3D',
    titleEn: 'Autonomous LiDAR Turret & 3D SLAM Point-Cloud Core',
    subtitleVi: 'Quét laser 360° thời gian thực · Tái dựng đám mây điểm địa hình 3D',
    subtitleEn: 'Real-Time 360° Multi-Beam Laser · Live Volumetric SLAM Reconstruction',
    descriptionVi:
      'Cụm tháp gương lục giác quay tốc độ cao phát hai quạt tia laser đồng thời quét và kích hoạt đám mây điểm 3D xung quanh, mô phỏng mắt nhìn xe tự hành.',
    descriptionEn:
      'High-RPM hexagonal mirror turret projecting dual volumetric laser sheets across an instanced 3D spatial point-cloud field for autonomous robotics.',
    accentHex: '#06b6d4',
    secondaryHex: '#22d3ee',
    primaryLabelVi: 'Tốc độ Quét LiDAR',
    primaryLabelEn: 'Scanner RPM',
    primaryUnit: 'rpm',
    primaryRange: [60, 600, 240],
    secondaryLabelVi: 'Số Kênh Laser',
    secondaryLabelEn: 'Laser Channels',
    secondaryUnit: 'ch',
    secondaryRange: [16, 128, 64],
    relatedSubject: 'cs',
    relatedLabelVi: 'Mở Mô phỏng Hình học & CS',
    relatedLabelEn: 'Open CS & Geometry Lab'
  },
  {
    id: 'solar_thermal_tower',
    index: 25,
    code: '25 · HELIOSTAT CSP',
    category: 'physics',
    categoryLabelVi: 'Vật lí & Năng lượng',
    categoryLabelEn: 'Physics & Energy',
    tierBadge: 'Molten-Salt Concentrator',
    titleVi: 'Tháp Nhiệt Mặt Trời & Cánh Đồng Gương Heliostat Hội Tụ',
    titleEn: 'Concentrated Solar Power Tower & Tracking Heliostat Field',
    subtitleVi: 'Quang học phản xạ định hướng · Nhiệt năng muối nóng chảy sạch',
    subtitleEn: 'Specular Heliostat Tracking · Molten-Salt Thermal Receiver Crown',
    descriptionVi:
      '36 gương phản xạ đồng tâm tự động xoay theo góc chiếu Mặt Trời để hội tụ chùm tia năng lượng lên đỉnh tháp muối nóng chảy phát điện sạch.',
    descriptionEn:
      '36 concentric solar-tracking heliostat mirrors dynamically concentrating photon beams onto an incandescent molten-salt central receiver crown.',
    accentHex: '#f59e0b',
    secondaryHex: '#fde047',
    primaryLabelVi: 'Góc Chiếu Mặt Trời',
    primaryLabelEn: 'Solar Elevation',
    primaryUnit: '°',
    primaryRange: [15, 85, 52],
    secondaryLabelVi: 'Công suất Nhiệt Đỉnh',
    secondaryLabelEn: 'Thermal Output',
    secondaryUnit: 'MW',
    secondaryRange: [100, 900, 480],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Mô phỏng Quang & Nhiệt',
    relatedLabelEn: 'Open Optics & Thermal Lab'
  },
  {
    id: 'mri_tomography_ring',
    index: 26,
    code: '26 · 7T MRI SCANNER',
    category: 'physics',
    categoryLabelVi: 'Vật lí & Y sinh',
    categoryLabelEn: 'Physics & BioTech',
    tierBadge: 'Superconducting Cryo Bore',
    titleVi: 'Máy Chụp Cộng Hưởng Từ Siêu Dẫn 7-Tesla & Lát Cắt 3D',
    titleEn: '7-Tesla Superconducting MRI Gantry & Larmor Tomography',
    subtitleVi: 'Cộng hưởng từ hạt nhân (NMR) · Lát cắt ảnh sóng RF thời gian thực',
    subtitleEn: 'Nuclear Magnetic Resonance · Real-Time RF Spin Precession Slices',
    descriptionVi:
      'Khoang nam châm siêu dẫn 4 vòng ghép rời cho phép xem cấu tạo cuộn dây gradient bên trong cùng mặt cắt cộng hưởng từ Larmor chuyển động.',
    descriptionEn:
      'Segmented 7-Tesla superconducting magnet bore featuring an animated motorized scan cradle and oscillating RF Larmor resonance imaging planes.',
    accentHex: '#0284c7',
    secondaryHex: '#38bdf8',
    primaryLabelVi: 'Từ trường Siêu dẫn B₀',
    primaryLabelEn: 'Magnetic Flux B₀',
    primaryUnit: 'T',
    primaryRange: [1.5, 11.7, 7.0],
    secondaryLabelVi: 'Tần số Larmor RF',
    secondaryLabelEn: 'RF Larmor Freq',
    secondaryUnit: 'MHz',
    secondaryRange: [64, 500, 298],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Mô phỏng Từ trường',
    relatedLabelEn: 'Open Magnetic Field Lab'
  },
  {
    id: 'sagnac_ring_gyro',
    index: 27,
    code: '27 · SAGNAC OPTICS',
    category: 'math',
    categoryLabelVi: 'Toán học & Định vị',
    categoryLabelEn: 'Math & Inertial Nav',
    tierBadge: '3-Axis Gimbal Interferometer',
    titleVi: 'Con Quay Hồi Chuyển Laser Sagnac 3 Trục Gimbal',
    titleEn: '3-Axis Gimbal Ring Laser Gyroscope & Sagnac Phase Meter',
    subtitleVi: 'Hình học quay SO(3) & Độ lệch pha giao thoa hai chùm laser ngược chiều',
    subtitleEn: 'SO(3) Euler Gimbal Precession · Counter-Propagating Laser Phase Shift',
    descriptionVi:
      'Hệ 3 vòng gimbal đồng tâm quay theo phép quay SO(3) với cuộn sợi quang lục giác dẫn 2 chùm xung photon ngược chiều đo vận tốc góc tuyệt đối.',
    descriptionEn:
      'Precision 3-axis inertial gimbal cradling an optical loop where counter-propagating photon packets accumulate a relativistic Sagnac phase shift.',
    accentHex: '#fbbf24',
    secondaryHex: '#f43f5e',
    primaryLabelVi: 'Vận tốc Góc Quay Ω',
    primaryLabelEn: 'Angular Rate Ω',
    primaryUnit: 'rad/s',
    primaryRange: [1, 40, 14],
    secondaryLabelVi: 'Chiều dài Sợi quang L',
    secondaryLabelEn: 'Fiber Loop Length L',
    secondaryUnit: 'm',
    secondaryRange: [200, 3000, 1200],
    relatedSubject: 'math',
    relatedLabelVi: 'Mở Không gian Oxyz 3D',
    relatedLabelEn: 'Open Oxyz 3D Math Lab'
  },
  {
    id: 'metamaterial_cloak',
    index: 28,
    code: '28 · NEGATIVE INDEX',
    category: 'future_tech',
    categoryLabelVi: 'Công nghệ Tương lai',
    categoryLabelEn: 'Future Tech',
    tierBadge: 'Transformation Optics Shell',
    titleVi: 'Áo Tàng Hình Siêu Vật Liệu Chiết Suất Âm (Metamaterial)',
    titleEn: 'Negative-Index Metamaterial Cloak & EM Stream Bending',
    subtitleVi: 'Quang học biến đổi · Uốn cong sóng điện từ quanh lõi trung tâm',
    subtitleEn: 'Transformation Optics · Split-Ring Lattice Bending EM Wavefronts',
    descriptionVi:
      'Lớp vỏ siêu vật liệu cộng hưởng vòng hở nhiều tầng uốn dòng hạt sóng điện từ vòng qua khối lõi đen mà không gây tán xạ phía sau.',
    descriptionEn:
      'Multi-shell split-ring metamaterial cloak smoothly guiding electromagnetic wave streams around a concealed core with near-zero wake scatter.',
    accentHex: '#10b981',
    secondaryHex: '#38bdf8',
    primaryLabelVi: 'Chiết suất Âm (n)',
    primaryLabelEn: 'Negative Index (n)',
    primaryUnit: 'n',
    primaryRange: [-3.0, -0.2, -1.4],
    secondaryLabelVi: 'Tần số Sóng Viba',
    secondaryLabelEn: 'Microwave Freq',
    secondaryUnit: 'GHz',
    secondaryRange: [2, 24, 10],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Mô phỏng Khúc xạ & Sóng',
    relatedLabelEn: 'Open Refraction & Wave Lab'
  },
  {
    id: 'acoustic_levitation',
    index: 29,
    code: '29 · ULTRASONIC TRAP',
    category: 'physics',
    categoryLabelVi: 'Vật lí & Sóng âm',
    categoryLabelEn: 'Physics & Acoustics',
    tierBadge: 'Standing-Wave Trap',
    titleVi: 'Bẫy Sóng Dừng Siêu Âm & Nâng Lơ Lửng Hạt Tinh Thể 3D',
    titleEn: 'Phased Ultrasonic Standing-Wave Cavity & Acoustic Levitation',
    subtitleVi: 'Giao thoa sóng dừng cực đại/cực tiểu · Cân bằng trọng lực bằng áp suất âm',
    subtitleEn: 'Harmonic Pressure Nodes · Gravity Counterbalance via Acoustic Force',
    descriptionVi:
      'Hai bản phát sóng siêu âm đối diện tạo trường sóng dừng thẳng đứng với các nút áp suất rõ rệt, giữ 6 giọt tinh thể lơ lửng ổn định giữa không trung.',
    descriptionEn:
      'Opposed ultrasonic transducer plates generating vertical standing pressure nodes that suspend six crystalline droplets in mid-air.',
    accentHex: '#06b6d4',
    secondaryHex: '#fef08a',
    primaryLabelVi: 'Tần số Siêu âm',
    primaryLabelEn: 'Ultrasonic Freq',
    primaryUnit: 'kHz',
    primaryRange: [20, 80, 40],
    secondaryLabelVi: 'Áp suất Sóng đứng',
    secondaryLabelEn: 'Acoustic Pressure',
    secondaryUnit: 'kPa',
    secondaryRange: [10, 120, 65],
    relatedSubject: 'physics',
    relatedLabelVi: 'Mở Mô phỏng Sóng dừng',
    relatedLabelEn: 'Open Standing Wave Lab'
  },
  {
    id: 'photonic_tensor_core',
    index: 30,
    code: '30 · OPTICAL NPU',
    category: 'cs',
    categoryLabelVi: 'Tin học & Kiến trúc',
    categoryLabelEn: 'CS & Optical Computing',
    tierBadge: 'Silicon Photonics Mesh',
    titleVi: 'Bộ Xử Lý Tensor Quang Học Mach-Zehnder 4×4 (Optical NPU)',
    titleEn: 'Silicon Photonics 4×4 Mach-Zehnder Tensor Crossbar NPU',
    subtitleVi: 'Tính toán ma trận bằng xung ánh sáng đa bước sóng WDM · Độ trễ pico-giây',
    subtitleEn: 'WDM Multi-Wavelength Optical Matrix Compute · Picosecond Latency',
    descriptionVi:
      'Chip silicon nitride tích hợp lưới 16 bộ giao thoa Mach-Zehnder nhân ma trận trọng số đồng thời bằng các xung laser đa bước sóng WDM.',
    descriptionEn:
      'Integrated silicon-nitride 4×4 Mach-Zehnder interferometer array performing parallel optical matrix multiplication with multi-wavelength laser pulses.',
    accentHex: '#f59e0b',
    secondaryHex: '#38bdf8',
    primaryLabelVi: 'Xung nhịp Quang học',
    primaryLabelEn: 'Optical Clock',
    primaryUnit: 'GHz',
    primaryRange: [20, 200, 100],
    secondaryLabelVi: 'Kênh Đa bước sóng WDM',
    secondaryLabelEn: 'WDM Channels',
    secondaryUnit: 'λ',
    secondaryRange: [4, 32, 16],
    relatedSubject: 'cs',
    relatedLabelVi: 'Mở Tin học & Thuật toán',
    relatedLabelEn: 'Open CS & Algorithms'
  }
];

export function computeTelemetry(id: MonumentId, p: SynapseV2Params): MonumentTelemetry {
  switch (id) {
    case 'dyson': {
      const mass = p.primaryParam;
      const spin = p.secondaryParam;
      const rsKm = (2.95 * mass).toFixed(1);
      const powerW = ((mass * 0.42 + spin * 0.85) * 0.14).toFixed(2);
      const velC = Math.min(0.99, 0.32 + spin * 0.0062).toFixed(2);
      return {
        metric1LabelVi: 'Bán kính Schwarzschild',
        metric1LabelEn: 'Schwarzschild Radius',
        metric1Value: `${rsKm} km`,
        metric2LabelVi: 'Công suất thu Dyson',
        metric2LabelEn: 'Dyson Output',
        metric2Value: `${powerW}×10²⁶ W`,
        metric3LabelVi: 'Vận tốc Đĩa bồi tụ',
        metric3LabelEn: 'Accretion Velocity',
        metric3Value: `${velC} c`,
        statusVi: spin > 75 ? 'TỐI ĐA · RELATIVISTIC JET' : 'ỔN ĐỊNH · KARDASHEV II',
        statusEn: spin > 75 ? 'PEAK · RELATIVISTIC JET' : 'NOMINAL · KARDASHEV II'
      };
    }
    case 'tokamak': {
      const bTesla = p.primaryParam;
      const tempMK = p.secondaryParam;
      const magPressure = ((bTesla * bTesla) / 2.51).toFixed(1);
      const qFactor = Math.max(0.4, (bTesla * tempMK) / 145).toFixed(2);
      const ignited = Number(qFactor) >= 10;
      return {
        metric1LabelVi: 'Áp suất Từ giam giữ',
        metric1LabelEn: 'Magnetic Pressure',
        metric1Value: `${magPressure} MPa`,
        metric2LabelVi: 'Hệ số Khuếch đại Q',
        metric2LabelEn: 'Fusion Gain (Q)',
        metric2Value: `Q = ${qFactor}`,
        metric3LabelVi: 'Nhiệt độ Lõi Plasma',
        metric3LabelEn: 'Core Temperature',
        metric3Value: `${Math.round(tempMK)} MK`,
        statusVi: ignited ? 'CHÁY NHIỆT HẠCH · Q ≥ 10' : 'ĐANG GIA NHIỆT PLASMA',
        statusEn: ignited ? 'IGNITION · Q ≥ 10' : 'HEATING CONFINEMENT'
      };
    }
    case 'tesseract': {
      const speed = p.primaryParam;
      const curv = p.secondaryParam;
      const gaussK = (-(curv / 35) * 1.42).toFixed(2);
      const wDepth = (1.85 + Math.sin(speed * 0.1) * 0.45).toFixed(2);
      return {
        metric1LabelVi: 'Chiều thứ 4 (W-depth)',
        metric1LabelEn: '4th Dimension (W)',
        metric1Value: `w = ±${wDepth}`,
        metric2LabelVi: 'Cấu trúc Siêu lập phương',
        metric2LabelEn: '4D Cell Topology',
        metric2Value: '16V · 32E · 8C',
        metric3LabelVi: 'Độ cong Gauss (K)',
        metric3LabelEn: 'Gaussian Curvature',
        metric3Value: `K = ${gaussK}`,
        statusVi: 'CHIẾU R⁴ → R³ ĐẲNG CẤU',
        statusEn: 'R⁴ → R³ STEREOGRAPHIC LIVE'
      };
    }
    case 'neural_aero': {
      const mach = (p.primaryParam / 10).toFixed(1);
      const hz = Math.round(p.secondaryParam);
      const reM = (Number(mach) * 4.8).toFixed(1);
      const petaOps = (hz * 1.44).toFixed(1);
      return {
        metric1LabelVi: 'Vận tốc Dòng Mach',
        metric1LabelEn: 'Mach Velocity',
        metric1Value: `M ${mach}`,
        metric2LabelVi: 'Thông lượng Nơ-ron',
        metric2LabelEn: 'Synaptic Throughput',
        metric2Value: `${petaOps} PetaOps/s`,
        metric3LabelVi: 'Số Reynolds (Re)',
        metric3LabelEn: 'Reynolds Number',
        metric3Value: `${reM}×10⁶`,
        statusVi: Number(mach) >= 1.2 ? 'SIÊU THANH · SHOCKWAVE' : 'DÒNG CHẢY TẦNG LAMINAR',
        statusEn: Number(mach) >= 1.2 ? 'SUPERSONIC · SHOCK CONE' : 'SUBSONIC LAMINAR FLOW'
      };
    }
    case 'quantum_cryostat': {
      const qubits = Math.round(p.primaryParam);
      const t2 = Math.round(p.secondaryParam);
      const fidelity = Math.min(99.98, 97.4 + t2 * 0.006).toFixed(2);
      const cryoMk = (8.2 + qubits * 0.014).toFixed(1);
      return {
        metric1LabelVi: 'Không gian Hilbert',
        metric1LabelEn: 'Hilbert State Space',
        metric1Value: `2^${qubits} states`,
        metric2LabelVi: 'Độ trung thực Cổng',
        metric2LabelEn: '2-Qubit Gate Fidelity',
        metric2Value: `${fidelity}%`,
        metric3LabelVi: 'Nhiệt độ Lõi Cryo',
        metric3LabelEn: 'Cryostat Stage Temp',
        metric3Value: `${cryoMk} mK`,
        statusVi: t2 >= 200 ? 'KẾT HỢP TỐI ƯU · 10 mK' : 'LÀM LẠNH PHA LOÃNG ³He/⁴He',
        statusEn: t2 >= 200 ? 'HIGH COHERENCE · 10 mK' : 'DILUTION STAGE COOLING'
      };
    }
    case 'gravitational_ligo': {
      const freq = Math.round(p.primaryParam);
      const strain = Math.round(p.secondaryParam);
      const chirpMass = (1.35 + freq * 0.011).toFixed(2);
      const deltaL = (strain * 0.04).toFixed(2);
      return {
        metric1LabelVi: 'Biến thiên Gương ΔL',
        metric1LabelEn: 'Arm Shift ΔL',
        metric1Value: `${deltaL} attometer`,
        metric2LabelVi: 'Khối lượng Chirp (M_c)',
        metric2LabelEn: 'Chirp Mass (M_c)',
        metric2Value: `${chirpMass} M☉`,
        metric3LabelVi: 'Tần số Bức xạ h(t)',
        metric3LabelEn: 'GW Chirp Frequency',
        metric3Value: `${freq * 2} Hz`,
        statusVi: freq > 220 ? 'CHIRP SẮP VA CHẠM · MERGER' : 'QUỸ ĐẠO XOẮN ỐC INSPIRAL',
        statusEn: freq > 220 ? 'CHIRP MERGER IMMINENT' : 'BINARY INSPIRAL LOCKED'
      };
    }
    case 'space_elevator': {
      const vel = Math.round(p.primaryParam);
      const tension = Math.round(p.secondaryParam);
      const altKm = Math.round(1200 + vel * 28.5);
      const payloadTons = Math.round(tension * 2.4);
      return {
        metric1LabelVi: 'Độ cao Buồng thang',
        metric1LabelEn: 'Climber Altitude',
        metric1Value: `${altKm.toLocaleString()} km`,
        metric2LabelVi: 'Tải trọng Cáp nâng',
        metric2LabelEn: 'Payload Capacity',
        metric2Value: `${payloadTons} Tấn`,
        metric3LabelVi: 'Quỹ đạo Địa tĩnh GEO',
        metric3LabelEn: 'Geostationary Sync',
        metric3Value: '35,786 km',
        statusVi: 'ĐỒNG BỘ TRẠM ĐỐI TRỌNG GEO',
        statusEn: 'GEO COUNTERWEIGHT LOCKED'
      };
    }
    case 'warp_alcubierre': {
      const warpF = Math.round(p.primaryParam);
      const flux = Math.round(p.secondaryParam);
      const expansion = (warpF * 1.45).toFixed(2);
      const bubbleM = (28 + flux * 0.35).toFixed(1);
      return {
        metric1LabelVi: 'Hệ số Siêu Quang (c)',
        metric1LabelEn: 'Effective Velocity',
        metric1Value: `${warpF}.0 c`,
        metric2LabelVi: 'Độ giãn Metric phía sau',
        metric2LabelEn: 'Metric Expansion Tensor',
        metric2Value: `+${expansion} R_w`,
        metric3LabelVi: 'Bán kính Bong bóng Warp',
        metric3LabelEn: 'Warp Shell Radius',
        metric3Value: `${bubbleM} m`,
        statusVi: warpF >= 8 ? 'BONG BÓNG ALCUBIERRE SIÊU QUANG' : 'ỔN ĐỊNH TRƯỜNG NĂNG LƯỢNG ÂM',
        statusEn: warpF >= 8 ? 'FTL METRIC SHELL ACTIVE' : 'EXOTIC TORUS STABILIZED'
      };
    }
    case 'hyperbolic_calabi': {
      const deg = Math.round(p.primaryParam);
      const phase = Math.round(p.secondaryParam);
      const eulerChi = -2 * deg * (deg - 2);
      return {
        metric1LabelVi: 'Đặc trưng Euler χ',
        metric1LabelEn: 'Euler Characteristic χ',
        metric1Value: `χ = ${eulerChi}`,
        metric2LabelVi: 'Số chiều Thực / Phức',
        metric2LabelEn: 'Real / Complex Dim',
        metric2Value: '6D ℝ / 3D ℂ',
        metric3LabelVi: 'Pha Cuộn Chiều Ẩn',
        metric3LabelEn: 'Hidden Fiber Phase',
        metric3Value: `${phase}°`,
        statusVi: 'ĐA TẠP RICCI-FLAT CALABI-YAU',
        statusEn: 'RICCI-FLAT MANIFOLD PROJECTED'
      };
    }
    case 'dna_nanobot': {
      const twist = Math.round(p.primaryParam);
      const scan = Math.round(p.secondaryParam);
      const bpPerSec = Math.round(scan * 42);
      const errorRate = Math.max(0.01, (1.4 - scan * 0.012)).toFixed(2);
      return {
        metric1LabelVi: 'Tốc độ Sửa Gen',
        metric1LabelEn: 'Gene Repair Rate',
        metric1Value: `${bpPerSec} bp/s`,
        metric2LabelVi: 'Góc Bước Xoắn kép',
        metric2LabelEn: 'Helix Pitch Angle',
        metric2Value: `${twist}° / bp`,
        metric3LabelVi: 'Tỷ lệ Sai sót DNA',
        metric3LabelEn: 'Mutation Error Rate',
        metric3Value: `${errorRate} ppm`,
        statusVi: '6 NANO-BOT ĐANG QUÉT TRÌNH TỰ',
        statusEn: '6 NANOBOTS SCANNING SEQUENCE'
      };
    }
    case 'penning_antimatter': {
      const kv = Math.round(p.primaryParam);
      const dens = Math.round(p.secondaryParam);
      const cycMhz = (kv * 0.85 + 24).toFixed(1);
      const energyKj = ((dens * 1.8) / 10).toFixed(2);
      return {
        metric1LabelVi: 'Tần số Cyclotron ω_c',
        metric1LabelEn: 'Cyclotron Freq (ω_c)',
        metric1Value: `${cycMhz} MHz`,
        metric2LabelVi: 'Năng lượng Hủy cặp e⁺e⁻',
        metric2LabelEn: 'Annihilation Potential',
        metric2Value: `${energyKj} GJ`,
        metric3LabelVi: 'Số Hạt Positron Giam giữ',
        metric3LabelEn: 'Confined Positrons',
        metric3Value: `${(dens / 10).toFixed(1)}×10⁹`,
        statusVi: kv >= 70 ? 'GIAM GIỮ PHẢN VẬT CHẤT TỐI ĐA' : 'QUỸ ĐẠO MAGNETRON ỔN ĐỊNH',
        statusEn: kv >= 70 ? 'PEAK ANTIMATTER LOCK' : 'MAGNETRON CONFINEMENT NOMINAL'
      };
    }
    case 'fractal_attractor': {
      const rho = Math.round(p.primaryParam);
      const sigma = Math.round(p.secondaryParam);
      const lyapunov = ((rho - 14) * 0.048 + 0.42).toFixed(3);
      return {
        metric1LabelVi: 'Số mũ Lyapunov (λ₁)',
        metric1LabelEn: 'Lyapunov Exponent (λ₁)',
        metric1Value: `+${lyapunov}`,
        metric2LabelVi: 'Số chiều Fractal (D_KY)',
        metric2LabelEn: 'Kaplan-Yorke Dim',
        metric2Value: '2.06 D',
        metric3LabelVi: 'Cặp Tham số (ρ, σ)',
        metric3LabelEn: 'System Parameters',
        metric3Value: `(${rho}, ${sigma})`,
        statusVi: rho >= 24 ? 'HỖN MANG LORENZ ĐÔI · BIFURCATION' : 'HỘI TỤ ĐIỂM CÂN BẰNG',
        statusEn: rho >= 24 ? 'CHAOTIC STRANGE ATTRACTOR' : 'CONVERGENT FIXED BASIN'
      };
    }
    case 'james_webb': {
      const um = Math.round(p.primaryParam);
      const sync = Math.round(p.secondaryParam);
      const redshiftZ = (6.2 + um * 0.42).toFixed(1);
      const cryoK = (44 - sync * 0.14).toFixed(1);
      return {
        metric1LabelVi: 'Dịch chuyển Đỏ (z)',
        metric1LabelEn: 'Deep-Field Redshift (z)',
        metric1Value: `z = ${redshiftZ}`,
        metric2LabelVi: 'Nhiệt độ Gương L2',
        metric2LabelEn: 'Mirror Cryo Temp',
        metric2Value: `${cryoK} K`,
        metric3LabelVi: 'Độ phân giải Góc',
        metric3LabelEn: 'Angular Resolution',
        metric3Value: `${(0.1 * (sync / 85)).toFixed(2)}″`,
        statusVi: sync >= 75 ? 'ĐỒNG PHA 18 GƯƠNG VÀNG · L2 LOCK' : 'ĐANG HIỆU CHUẨN 132 BỘ TRUYỀN ĐỘNG',
        statusEn: sync >= 75 ? '18-HEX PHASED · L2 HALO LOCKED' : 'CALIBRATING MIRROR ACTUATORS'
      };
    }
    case 'wormhole_morris': {
      const b0 = Math.round(p.primaryParam);
      const curv = Math.round(p.secondaryParam);
      const exoticMass = (b0 * 0.85 * (curv / 60)).toFixed(2);
      const transitMs = Math.max(0.4, (4.8 - curv * 0.036)).toFixed(2);
      return {
        metric1LabelVi: 'Khẩu độ Cổ họng (b₀)',
        metric1LabelEn: 'Throat Aperture (b₀)',
        metric1Value: `${b0}.0 m`,
        metric2LabelVi: 'Mật độ Năng lượng Âm',
        metric2LabelEn: 'Exotic Stress-Energy',
        metric2Value: `-${exoticMass}×10²⁶ J`,
        metric3LabelVi: 'Thời gian Xuyên Vũ trụ',
        metric3LabelEn: 'Proper Transit Time',
        metric3Value: `${transitMs} ms`,
        statusVi: curv >= 60 ? 'CỔ HỌNG MỞ ỔN ĐỊNH · EINSTEIN-ROSEN' : 'ĐANG DUY TRÌ ÁP SUẤT KỲ LẠ',
        statusEn: curv >= 60 ? 'TRAVERSABLE THROAT STABLE' : 'STABILIZING EXOTIC TENSION'
      };
    }
    case 'pulsar_magnetar': {
      const hz = Math.round(p.primaryParam);
      const mag = Math.round(p.secondaryParam);
      const periodMs = (1000 / Math.max(1, hz)).toFixed(2);
      const spinPower = ((hz * mag) * 0.18).toFixed(1);
      return {
        metric1LabelVi: 'Chu kỳ Xung (P)',
        metric1LabelEn: 'Pulse Period (P)',
        metric1Value: `${periodMs} ms`,
        metric2LabelVi: 'Từ trường Cực (B)',
        metric2LabelEn: 'Dipole Magnetic Field',
        metric2Value: `${mag}.0×10¹¹ T`,
        metric3LabelVi: 'Độ rọi Synchrotron',
        metric3LabelEn: 'Spin-Down Luminosity',
        metric3Value: `${spinPower}×10³¹ W`,
        statusVi: mag >= 10 ? 'MAGNETAR SIÊU TỪ · X-RAY BURST' : 'PULSAR MILIGIÂY ĐỒNG BỘ',
        statusEn: mag >= 10 ? 'ULTRA-MAGNETIC MAGNETAR' : 'MILLISECOND PULSAR LOCKED'
      };
    }
    case 'oort_solar_sail': {
      const gw = Math.round(p.primaryParam);
      const vc = Math.round(p.secondaryParam);
      const forceN = Math.round((gw * 6.67));
      const etaAlpha = (4.37 / (vc / 100)).toFixed(1);
      return {
        metric1LabelVi: 'Lực đẩy Áp suất Quang',
        metric1LabelEn: 'Photon Radiation Thrust',
        metric1Value: `${forceN} N`,
        metric2LabelVi: 'Vận tốc Hành trình',
        metric2LabelEn: 'Relativistic Speed',
        metric2Value: `0.${String(vc).padStart(2, '0')} c`,
        metric3LabelVi: 'Thời gian tới Cận Tinh',
        metric3LabelEn: 'Alpha Centauri ETA',
        metric3Value: `${etaAlpha} năm`,
        statusVi: gw >= 70 ? 'GIA TỐC LASER CÔNG SUẤT CAO' : 'HÀNH TRÌNH CÁNH BUỒM ÁNH SÁNG',
        statusEn: gw >= 70 ? 'HIGH-POWER PHOTON BOOST' : 'INTERSTELLAR SAIL CRUISE'
      };
    }
    case 'supercomputer_torus': {
      const pf = Math.round(p.primaryParam);
      const load = Math.round(p.secondaryParam);
      const tbps = ((pf * load) * 0.0085).toFixed(1);
      const latencyNs = Math.max(18, Math.round(92 - load * 0.65));
      return {
        metric1LabelVi: 'Sức mạnh Tính toán',
        metric1LabelEn: 'Peak Exascale Power',
        metric1Value: `${(pf / 1000).toFixed(2)} EF/s`,
        metric2LabelVi: 'Băng thông Chuyển mạch',
        metric2LabelEn: 'Bisection Bandwidth',
        metric2Value: `${tbps} TB/s`,
        metric3LabelVi: 'Độ trễ Nhảy Nút (Hop)',
        metric3LabelEn: '6D Torus Hop Latency',
        metric3Value: `${latencyNs} ns`,
        statusVi: load >= 70 ? 'TẤT CẢ 64 CỤM ĐỒNG BỘ QUANG' : 'CHUYỂN MẠCH GÓI TIN TORUS 3D',
        statusEn: load >= 70 ? 'ALL 64 RACKS PHOTONIC SYNC' : 'TORUS ROUTING NOMINAL'
      };
    }
    case 'cpu_pipeline_core': {
      const ghz = Math.round(p.primaryParam);
      const ipcNorm = Math.round(p.secondaryParam);
      const bips = Math.round(ghz * (ipcNorm / 14));
      const hitRate = Math.min(99.6, 91.5 + ipcNorm * 0.078).toFixed(1);
      return {
        metric1LabelVi: 'Thông lượng Lệnh',
        metric1LabelEn: 'Instruction Rate',
        metric1Value: `${bips} GIPS`,
        metric2LabelVi: 'Dự đoán Rẽ nhánh',
        metric2LabelEn: 'Branch Prediction',
        metric2Value: `${hitRate}%`,
        metric3LabelVi: 'Đường ống Đa luồng',
        metric3LabelEn: 'Superscalar Width',
        metric3Value: `8-Wide · ${ghz} GHz`,
        statusVi: ipcNorm >= 75 ? 'PIPELINE 5 TẦNG BÃO HÒA TỐI ĐA' : 'THỰC THI NGOÀI THỨ TỰ (OoO)',
        statusEn: ipcNorm >= 75 ? 'SUPERSCALAR PEAK IPC' : 'OUT-OF-ORDER EXECUTION'
      };
    }
    case 'blockchain_zk_lattice': {
      const bits = Math.round(p.primaryParam);
      const zkSpeed = Math.round(p.secondaryParam);
      const proofsSec = Math.round(zkSpeed * 24.5);
      const securityLog = Math.round(bits / 2);
      return {
        metric1LabelVi: 'Độ An toàn Mật mã',
        metric1LabelEn: 'Cryptographic Security',
        metric1Value: `2^${securityLog} ops`,
        metric2LabelVi: 'Bằng chứng ZK / giây',
        metric2LabelEn: 'ZK-SNARK Proofs/s',
        metric2Value: `${proofsSec.toLocaleString()} /s`,
        metric3LabelVi: 'Độ sâu Cây Merkle',
        metric3LabelEn: 'Merkle Tree Depth',
        metric3Value: '24 Layers',
        statusVi: zkSpeed >= 70 ? 'MERKLE ROOT ĐÃ XÁC THỰC SNARK' : 'ĐANG TÍNH BẰNG CHỨNG ELLIPTIC',
        statusEn: zkSpeed >= 70 ? 'ZK-MERKLE ROOT VERIFIED' : 'COMPUTING ELLIPTIC WITNESS'
      };
    }
    case 'graph_dijkstra_citadel': {
      const density = Math.round(p.primaryParam);
      const wave = Math.round(p.secondaryParam);
      const edges = Math.round(28 + (density / 100) * 64);
      const pathHops = Math.max(3, Math.round(9 - density * 0.045));
      return {
        metric1LabelVi: 'Cấu trúc Đồ thị (|V|, |E|)',
        metric1LabelEn: 'Graph Topology',
        metric1Value: `32V · ${edges}E`,
        metric2LabelVi: 'Độ dài Đường ngắn nhất',
        metric2LabelEn: 'Shortest Path Hops',
        metric2Value: `${pathHops} Hops`,
        metric3LabelVi: 'Độ phức tạp Thực thi',
        metric3LabelEn: 'Heap Complexity',
        metric3Value: `O(E log V) · ${wave}%`,
        statusVi: 'SÓNG DIJKSTRA ĐANG TÌM CÂY KHUNG MST',
        statusEn: 'DIJKSTRA SHORTEST-PATH WAVE ACTIVE'
      };
    }
    case 'lhc_collider': {
      const tev = Math.round(p.primaryParam);
      const bT = Math.round(p.secondaryParam);
      const lorentzGamma = Math.round((tev * 1000) / 0.938 / 2);
      const bendR = ((tev * 3.3356) / Math.max(1, bT) / 2).toFixed(2);
      return {
        metric1LabelVi: 'Hệ số Tương đối (γ)',
        metric1LabelEn: 'Lorentz Factor (γ)',
        metric1Value: `${lorentzGamma.toLocaleString()}`,
        metric2LabelVi: 'Bán kính Larmor (B)',
        metric2LabelEn: 'Dipole Bend Radius',
        metric2Value: `${bendR} km`,
        metric3LabelVi: 'Vận tốc Chùm Proton',
        metric3LabelEn: 'Proton Velocity',
        metric3Value: '0.99999999 c',
        statusVi: tev >= 12 ? 'VA CHẠM NĂNG LƯỢNG CAO · HIGGS PEAK' : 'ĐỒNG BỘ GIA TỐC SYNCHROTRON',
        statusEn: tev >= 12 ? 'HIGH-ENERGY COLLISION · HIGGS PEAK' : 'SYNCHROTRON BEAM LOCKED'
      };
    }
    case 'laser_interferometer': {
      const lambdaNm = Math.round(p.primaryParam);
      const slitUm = Math.round(p.secondaryParam);
      const photonEv = (1239.84 / Math.max(1, lambdaNm)).toFixed(2);
      const fringeAngle = (((lambdaNm * 1e-3) / Math.max(1, slitUm)) * (180 / Math.PI)).toFixed(2);
      const freqThz = Math.round(299792 / Math.max(1, lambdaNm));
      return {
        metric1LabelVi: 'Năng lượng Photon (hf)',
        metric1LabelEn: 'Photon Energy (hf)',
        metric1Value: `${photonEv} eV`,
        metric2LabelVi: 'Góc Vân Giao Thoa Δθ',
        metric2LabelEn: 'Fringe Spacing Δθ',
        metric2Value: `${fringeAngle}°`,
        metric3LabelVi: 'Tần số Sóng Ánh sáng',
        metric3LabelEn: 'Optical Frequency',
        metric3Value: `${freqThz} THz`,
        statusVi: 'GIAO THOA SÓNG ĐỒNG BỘ · VÂN RÕ NÉT',
        statusEn: 'COHERENT INTERFERENCE LOCKED'
      };
    }
    case 'tesla_electromagnet': {
      const khz = Math.round(p.primaryParam);
      const kv = Math.round(p.secondaryParam);
      const arcDistM = (kv / 300).toFixed(2);
      const eFieldKvM = Math.round(kv * 2.4);
      const powerMw = ((kv * khz) / 950).toFixed(1);
      return {
        metric1LabelVi: 'Cường độ Điện trường',
        metric1LabelEn: 'Peak Electric Field',
        metric1Value: `${eFieldKvM} kV/m`,
        metric2LabelVi: 'Tầm Phóng Hồ quang',
        metric2LabelEn: 'Arc Discharge Span',
        metric2Value: `${arcDistM} m`,
        metric3LabelVi: 'Công suất Xung Cộng hưởng',
        metric3LabelEn: 'Peak Pulse Power',
        metric3Value: `${powerMw} MW`,
        statusVi: kv >= 350 ? 'PHÓNG ĐIỆN PLASMA VƯỢT NGƯỠNG' : 'CỘNG HƯỞNG LC ỔN ĐỊNH',
        statusEn: kv >= 350 ? 'HIGH-VOLTAGE CORONA BREAKDOWN' : 'LC RESONANCE SYNCHRONIZED'
      };
    }
    case 'lidar_autonomous_core': {
      const rpm = Math.round(p.primaryParam);
      const ch = Math.round(p.secondaryParam);
      const ptsSec = ((rpm / 60) * ch * 1800).toFixed(0);
      const hz = (rpm / 60).toFixed(1);
      return {
        metric1LabelVi: 'Mật độ Đám mây Điểm',
        metric1LabelEn: 'Point-Cloud Rate',
        metric1Value: `${Number(ptsSec).toLocaleString()} pts/s`,
        metric2LabelVi: 'Tần số Quét Khung',
        metric2LabelEn: 'Frame Sweep Rate',
        metric2Value: `${hz} Hz`,
        metric3LabelVi: 'Độ phân giải Kênh',
        metric3LabelEn: 'Laser Channel Array',
        metric3Value: `${ch} Ch · 120 m`,
        statusVi: rpm >= 360 ? 'QUÉT SLAM 3D TỐC ĐỘ CAO' : 'ĐỒNG BỘ BẢN ĐỒ ĐIỂM 3D',
        statusEn: rpm >= 360 ? 'HIGH-RPM SLAM LOCK' : '3D POINT-CLOUD STREAMING'
      };
    }
    case 'solar_thermal_tower': {
      const elev = Math.round(p.primaryParam);
      const mw = Math.round(p.secondaryParam);
      const saltTempC = Math.round(380 + (mw / 900) * 210);
      const homes = Math.round(mw * 420);
      return {
        metric1LabelVi: 'Nhiệt độ Muối nóng chảy',
        metric1LabelEn: 'Molten Salt Temp',
        metric1Value: `${saltTempC} °C`,
        metric2LabelVi: 'Góc Hội tụ Heliostat',
        metric2LabelEn: 'Heliostat Tracking',
        metric2Value: `${elev}° · 36 Mirrors`,
        metric3LabelVi: 'Sản lượng Cấp điện',
        metric3LabelEn: 'Grid Capacity',
        metric3Value: `${homes.toLocaleString()} hộ`,
        statusVi: mw >= 600 ? 'HỘI TỤ QUANG NHIỆT CỰC ĐẠI' : 'LƯU TRỮ NHIỆT NĂNG SẠCH',
        statusEn: mw >= 600 ? 'PEAK SOLAR FLUX RECEIVER' : 'HELIOSTAT ARRAY TRACKING'
      };
    }
    case 'mri_tomography_ring': {
      const b0 = p.primaryParam.toFixed(1);
      const larmor = Math.round(p.secondaryParam);
      const snr = (Number(b0) * 18.4).toFixed(0);
      return {
        metric1LabelVi: 'Từ trường Lõi Siêu dẫn',
        metric1LabelEn: 'Cryo Bore Field B₀',
        metric1Value: `${b0} Tesla`,
        metric2LabelVi: 'Tần số Cộng hưởng Larmor',
        metric2LabelEn: 'Larmor Precession',
        metric2Value: `${larmor} MHz`,
        metric3LabelVi: 'Tỷ lệ Tín hiệu/Nhiễu',
        metric3LabelEn: 'Voxel SNR Gain',
        metric3Value: `${snr} dB · 0.2 mm`,
        statusVi: 'LÀM MÁT HELI LỎNG 4.2 K · QUÉT LÁT CẮT',
        statusEn: '4.2 K SUPERCONDUCTING · SCANNING'
      };
    }
    case 'sagnac_ring_gyro': {
      const omega = Math.round(p.primaryParam);
      const lenM = Math.round(p.secondaryParam);
      const deltaPhi = ((omega * lenM) * 0.00042).toFixed(3);
      return {
        metric1LabelVi: 'Độ lệch Pha Sagnac ΔΦ',
        metric1LabelEn: 'Sagnac Phase Shift ΔΦ',
        metric1Value: `${deltaPhi} rad`,
        metric2LabelVi: 'Tốc độ Quay Inertial',
        metric2LabelEn: 'Angular Rate Ω',
        metric2Value: `${omega} rad/s`,
        metric3LabelVi: 'Chiều dài Vòng quang',
        metric3LabelEn: 'Optical Path L',
        metric3Value: `${lenM.toLocaleString()} m`,
        statusVi: '3 TRỤC GIMBAL SO(3) KHÓA PHA QUANG',
        statusEn: '3-AXIS SO(3) INTERFEROMETER LOCKED'
      };
    }
    case 'metamaterial_cloak': {
      const nVal = p.primaryParam.toFixed(2);
      const ghz = Math.round(p.secondaryParam);
      const scatterDb = (-38 - Math.abs(p.primaryParam) * 9).toFixed(1);
      return {
        metric1LabelVi: 'Chỉ số Khúc xạ Âm',
        metric1LabelEn: 'Effective Index (n)',
        metric1Value: `n = ${nVal}`,
        metric2LabelVi: 'Suy hao Tán xạ Ngược',
        metric2LabelEn: 'Radar Cross-Section',
        metric2Value: `${scatterDb} dB`,
        metric3LabelVi: 'Dải Tần Viba Cộng hưởng',
        metric3LabelEn: 'Resonant Band',
        metric3Value: `${ghz} GHz`,
        statusVi: 'UỐN CONG BỨC XẠ ĐẲNG HƯỚNG · TÀNG HÌNH',
        statusEn: 'TRANSFORMATION OPTICS CLOAK ACTIVE'
      };
    }
    case 'acoustic_levitation': {
      const khz = Math.round(p.primaryParam);
      const kpa = Math.round(p.secondaryParam);
      const lambdaMm = (343 / Math.max(1, khz)).toFixed(2);
      return {
        metric1LabelVi: 'Bước sóng Siêu âm λ',
        metric1LabelEn: 'Acoustic Wavelength',
        metric1Value: `${lambdaMm} mm`,
        metric2LabelVi: 'Biên độ Áp suất Bụng',
        metric2LabelEn: 'Peak Node Pressure',
        metric2Value: `${kpa} kPa`,
        metric3LabelVi: 'Số Điểm Nút Sóng dừng',
        metric3LabelEn: 'Trapped Pressure Nodes',
        metric3Value: `6 Nodes · ${khz} kHz`,
        statusVi: 'CÂN BẰNG BỨC XẠ ÂM · NÂNG LƠ LỬNG 6 HẠT',
        statusEn: '6 DROPLETS SUSPENDED IN NODE TRAP'
      };
    }
    case 'photonic_tensor_core': {
      const ghz = Math.round(p.primaryParam);
      const wdm = Math.round(p.secondaryParam);
      const tops = ((ghz * wdm * 16) / 1000).toFixed(1);
      return {
        metric1LabelVi: 'Thông lượng Tensor Quang',
        metric1LabelEn: 'Photonic Compute',
        metric1Value: `${tops} PetaOP/s`,
        metric2LabelVi: 'Kênh Bước sóng WDM',
        metric2LabelEn: 'WDM Optical Lanes',
        metric2Value: `${wdm} λ · 4×4 MZI`,
        metric3LabelVi: 'Độ trễ Lan truyền Chip',
        metric3LabelEn: 'Optical Matrix Latency',
        metric3Value: `${(120 / Math.max(10, ghz)).toFixed(2)} ps`,
        statusVi: 'GIAO THOA KẾ MACH-ZEHNDER ĐỒNG BỘ',
        statusEn: '4×4 MZI PHOTONIC MESH ACTIVE'
      };
    }
  }
}
