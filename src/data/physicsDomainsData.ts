import { Physics3DMode, PhysicsDomainId, PhysicsSimType } from '../types';
import { EXTRA_PHYSICS_2D_SIMS, EXTRA_PHYSICS_3D_SIMS } from './physicsExtraSimsData';

export interface PhysicsDomainMeta {
  id: PhysicsDomainId;
  code: string;
  name: string;
  shortName: string;
  grades: string;
  tagline: string;
  accentHex: string;
  accentBadgeClass: string;
  borderClass: string;
  bgActiveClass: string;
}

export interface PhysicsParamBound {
  min: number;
  max: number;
  step: number;
  unit: string;
  label: string;
}

export interface Physics2DSimSpec {
  id: PhysicsSimType;
  domainId: PhysicsDomainId;
  grades: ('Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12')[];
  title: string;
  subtitle: string;
  formula: string;
  linkedLessonId: string;
  defaultParams: Record<string, number>;
  paramBounds: Record<string, PhysicsParamBound>;
  presets: {
    label: string;
    description: string;
    params: Record<string, number>;
  }[];
}

export interface Physics3DSimSpec {
  id: Physics3DMode;
  domainId: PhysicsDomainId;
  grades: ('Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12')[];
  title: string;
  subtitle: string;
  formula: string;
  linkedLessonId: string;
  presets: {
    label: string;
    description: string;
    settings: {
      speed?: number;
      amplitude?: number;
      frequency?: number;
      showVectors?: boolean;
      showTrail?: boolean;
      showGrid?: boolean;
    };
  }[];
}

export const PHYSICS_DOMAINS: PhysicsDomainMeta[] = [
  {
    id: 'mechanics',
    code: 'MEC · 01',
    name: 'Cơ học & Chuyển động',
    shortName: 'Cơ học',
    grades: 'Lớp 9 – 10',
    tagline: 'Động học đồ thị, ném xiên, rơi tự do bảo toàn cơ năng & chuyển động tròn đều.',
    accentHex: '#0ea5e9',
    accentBadgeClass: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/15 border-sky-200 dark:border-sky-500/30',
    borderClass: 'border-sky-300 dark:border-sky-500/40',
    bgActiveClass: 'bg-sky-600 text-white border-sky-600'
  },
  {
    id: 'waves_osc',
    code: 'WAV · 02',
    name: 'Dao động & Sóng cơ',
    shortName: 'Dao động & Sóng',
    grades: 'Lớp 11',
    tagline: 'Con lắc lò xo, con lắc đơn, giao thoa sóng nước, sóng dừng & hiệu ứng Doppler.',
    accentHex: '#10b981',
    accentBadgeClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30',
    borderClass: 'border-emerald-300 dark:border-emerald-500/40',
    bgActiveClass: 'bg-emerald-600 text-white border-emerald-600'
  },
  {
    id: 'electricity_mag',
    code: 'ELM · 03',
    name: 'Điện học & Điện từ',
    shortName: 'Điện & Từ',
    grades: 'Lớp 9 – 11 – 12',
    tagline: 'Định luật Ôm, điện trường điểm, cảm ứng điện từ Faraday, mạch RLC & hạt trong từ trường.',
    accentHex: '#f59e0b',
    accentBadgeClass: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30',
    borderClass: 'border-amber-300 dark:border-amber-500/40',
    bgActiveClass: 'bg-amber-600 text-white border-amber-600'
  },
  {
    id: 'optics_quantum',
    code: 'OPT · 04',
    name: 'Quang học & Lượng tử',
    shortName: 'Quang & Lượng tử',
    grades: 'Lớp 9 – 11 – 12',
    tagline: 'Khúc xạ ánh sáng, thấu kính hội tụ/phân kì, giao thoa khe Young & hiện tượng quang điện.',
    accentHex: '#8b5cf6',
    accentBadgeClass: 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/15 border-violet-200 dark:border-violet-500/30',
    borderClass: 'border-violet-300 dark:border-violet-500/40',
    bgActiveClass: 'bg-violet-600 text-white border-violet-600'
  },
  {
    id: 'thermal_nuclear',
    code: 'THM · 05',
    name: 'Nhiệt học & Hạt nhân',
    shortName: 'Nhiệt & Hạt nhân',
    grades: 'Lớp 9 – 12',
    tagline: 'Khí lí tưởng pV = nRT, mẫu nguyên tử Bohr & phân rã phóng xạ theo chu kì bán rã.',
    accentHex: '#f43f5e',
    accentBadgeClass: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/15 border-rose-200 dark:border-rose-500/30',
    borderClass: 'border-rose-300 dark:border-rose-500/40',
    bgActiveClass: 'bg-rose-600 text-white border-rose-600'
  }
];

export const PHYSICS_2D_SIMS: Record<PhysicsSimType, Physics2DSimSpec> = {
  ...EXTRA_PHYSICS_2D_SIMS,
  kinematics_graphs: {
    id: 'kinematics_graphs',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Đồ thị Chuyển động Biến đổi Đều & Vectơ',
    subtitle: 'Quan sát trực tiếp vị trí, vận tốc v(t), gia tốc a(t) và tổng hợp vectơ theo thời gian thực',
    formula: 'x = x₀ + v₀t + ½at² · v = v₀ + at',
    linkedLessonId: 'phys-10-accel',
    defaultParams: { vizMode: 1, v0: 4, accel: 2, angleDeg: 35, f1: 30, f2: 20 },
    paramBounds: {
      vizMode: { min: 0, max: 2, step: 1, unit: '', label: 'Chế độ hiển thị' },
      v0: { min: 0, max: 15, step: 0.5, unit: 'm/s', label: 'Vận tốc ban đầu v₀' },
      accel: { min: -5, max: 6, step: 0.5, unit: 'm/s²', label: 'Gia tốc a' },
      angleDeg: { min: 10, max: 150, step: 5, unit: '°', label: 'Góc hợp vectơ α' }
    },
    presets: [
      { label: 'Nhanh dần đều', description: 'v₀ = 2 m/s, a = 3 m/s² (đồ thị d-t)', params: { vizMode: 1, v0: 2, accel: 3, angleDeg: 35, f1: 30, f2: 20 } },
      { label: 'Chậm dần (đồ thị v-t)', description: 'v₀ = 12 m/s, a = -3 m/s²', params: { vizMode: 2, v0: 12, accel: -3, angleDeg: 35, f1: 30, f2: 20 } },
      { label: 'Tổng hợp Vectơ', description: 'Quy tắc hình bình hành α = 60°', params: { vizMode: 0, v0: 6, accel: 0, angleDeg: 60, f1: 35, f2: 25 } }
    ]
  },
  free_fall_energy: {
    id: 'free_fall_energy',
    domainId: 'mechanics',
    grades: ['Lớp 9', 'Lớp 10'],
    title: 'Rơi Tự Do & Bảo Toàn Cơ Năng',
    subtitle: 'Biểu đồ cột Động năng Wđ, Thế năng Wt và Cơ năng W trong trọng trường',
    formula: 'W = ½mv² + mgh = const',
    linkedLessonId: 'phys-10-b10',
    defaultParams: { mass: 2, height: 25, gravity: 9.8 },
    paramBounds: {
      mass: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng m' },
      height: { min: 5, max: 50, step: 1, unit: 'm', label: 'Độ cao thả h' },
      gravity: { min: 1.6, max: 20, step: 0.2, unit: 'm/s²', label: 'Gia tốc trọng trường g' }
    },
    presets: [
      { label: 'Trái Đất (9.8)', description: 'g = 9.8 m/s², h = 30 m', params: { mass: 2, height: 30, gravity: 9.8 } },
      { label: 'Mặt Trăng (1.6)', description: 'g = 1.6 m/s², h = 30 m', params: { mass: 2, height: 30, gravity: 1.6 } },
      { label: 'Sao Mộc (20.0)', description: 'g = 20 m/s², h = 30 m', params: { mass: 2, height: 30, gravity: 20 } }
    ]
  },
  projectile_motion: {
    id: 'projectile_motion',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Quỹ đạo Ném Xiên Parabol',
    subtitle: 'Phân tích thành phần vận tốc vx, vy, tầm xa L và độ cao cực đại H',
    formula: 'L = (v₀²·sin2α)/g · H = (v₀·sinα)²/(2g)',
    linkedLessonId: 'phys-10-proj',
    defaultParams: { v0: 24, angle: 45, g: 9.8 },
    paramBounds: {
      v0: { min: 10, max: 40, step: 1, unit: 'm/s', label: 'Vận tốc bắn v₀' },
      angle: { min: 15, max: 80, step: 1, unit: '°', label: 'Góc nâng α' },
      g: { min: 2, max: 20, step: 0.2, unit: 'm/s²', label: 'Trọng trường g' }
    },
    presets: [
      { label: 'Tầm xa cực đại (45°)', description: 'α = 45°, v₀ = 28 m/s', params: { v0: 28, angle: 45, g: 9.8 } },
      { label: 'Góc cao 70°', description: 'Quỹ đạo bổng H cao', params: { v0: 28, angle: 70, g: 9.8 } },
      { label: 'Bắn góc thấp 20°', description: 'Đạt tầm xa tương đương 70°', params: { v0: 28, angle: 20, g: 9.8 } }
    ]
  },
  circular_motion: {
    id: 'circular_motion',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Chuyển động Tròn Đều & Lực Hướng Tâm',
    subtitle: 'Vectơ vận tốc tiếp tuyến v và gia tốc hướng tâm a_ht = v²/R',
    formula: 'v = ωR · F_ht = mv²/R = mω²R',
    linkedLessonId: 'phys-10-circular',
    defaultParams: { radius: 2.5, omega: 2.5, mass: 2 },
    paramBounds: {
      radius: { min: 1, max: 5, step: 0.2, unit: 'm', label: 'Bán kính quỹ đạo R' },
      omega: { min: 0.5, max: 6, step: 0.1, unit: 'rad/s', label: 'Tốc độ góc ω' },
      mass: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng m' }
    },
    presets: [
      { label: 'Quỹ đạo chuẩn', description: 'R = 2.5m, ω = 2.5 rad/s', params: { radius: 2.5, omega: 2.5, mass: 2 } },
      { label: 'Quay tốc độ cao', description: 'Tăng ω để thấy F_ht tăng theo ω²', params: { radius: 2.5, omega: 5, mass: 2 } },
      { label: 'Bán kính rộng', description: 'R = 4.6m, ω = 1.5 rad/s', params: { radius: 4.6, omega: 1.5, mass: 3 } }
    ]
  },
  spring_pendulum: {
    id: 'spring_pendulum',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Con Lắc Lò Xo & Dao động Điều Hòa',
    subtitle: 'Đồ thị li độ x(t), lực đàn hồi F = -kx và bảo toàn năng lượng',
    formula: 'T = 2π√(m/k) · x = A·cos(ωt + φ)',
    linkedLessonId: 'phys-11-shm',
    defaultParams: { amplitude: 10, stiffness: 40, mass: 1 },
    paramBounds: {
      amplitude: { min: 3, max: 18, step: 1, unit: 'cm', label: 'Biên độ A' },
      stiffness: { min: 10, max: 100, step: 5, unit: 'N/m', label: 'Độ cứng lò xo k' },
      mass: { min: 0.2, max: 4, step: 0.1, unit: 'kg', label: 'Khối lượng vật m' }
    },
    presets: [
      { label: 'Dao động chuẩn', description: 'k = 40 N/m, m = 1 kg', params: { amplitude: 10, stiffness: 40, mass: 1 } },
      { label: 'Lò xo rất cứng', description: 'Tần số góc ω lớn', params: { amplitude: 8, stiffness: 90, mass: 0.5 } },
      { label: 'Vật nặng chậm', description: 'Chu kì T kéo dài', params: { amplitude: 14, stiffness: 20, mass: 3 } }
    ]
  },
  simple_pendulum: {
    id: 'simple_pendulum',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Con Lắc Đơn & Trọng Trường',
    subtitle: 'Đo chu kì dao động nhỏ theo chiều dài dây treo l và gia tốc trọng trường g',
    formula: 'T = 2π√(l/g) · α_max',
    linkedLessonId: 'phys-11-b5',
    defaultParams: { length: 1.5, angle0: 14, gravity: 9.8 },
    paramBounds: {
      length: { min: 0.4, max: 3.5, step: 0.1, unit: 'm', label: 'Chiều dài dây l' },
      angle0: { min: 4, max: 30, step: 1, unit: '°', label: 'Góc lệch ban đầu α₀' },
      gravity: { min: 1.6, max: 20, step: 0.2, unit: 'm/s²', label: 'Trọng trường g' }
    },
    presets: [
      { label: 'Đồng hồ quả lắc (l=1m)', description: 'T ≈ 2.00 s trên Trái Đất', params: { length: 1.0, angle0: 10, gravity: 9.8 } },
      { label: 'Trên Mặt Trăng', description: 'g = 1.6 m/s², dao động chậm rõ rệt', params: { length: 1.5, angle0: 14, gravity: 1.6 } },
      { label: 'Dây ngắn góc lớn', description: 'l = 0.6 m, α₀ = 25°', params: { length: 0.6, angle0: 25, gravity: 9.8 } }
    ]
  },
  wave_interference: {
    id: 'wave_interference',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Giao Thoa Hai Nguồn Sóng Nước',
    subtitle: 'Vân cực đại – cực tiểu Hypebol từ hai nguồn kết hợp S₁, S₂',
    formula: 'd₂ - d₁ = kλ (Cực đại) · (k+½)λ (Cực tiểu)',
    linkedLessonId: 'phys-11-b12',
    defaultParams: { freq: 2.5, speed: 60, sep: 120 },
    paramBounds: {
      freq: { min: 0.8, max: 5, step: 0.2, unit: 'Hz', label: 'Tần số nguồn f' },
      speed: { min: 25, max: 120, step: 5, unit: 'cm/s', label: 'Tốc độ truyền sóng v' },
      sep: { min: 60, max: 180, step: 10, unit: 'mm', label: 'Khoảng cách S₁S₂' }
    },
    presets: [
      { label: 'Vân rõ tiêu chuẩn', description: 'f = 2.5 Hz, v = 60 cm/s', params: { freq: 2.5, speed: 60, sep: 120 } },
      { label: 'Nhiều vân dày', description: 'f cao → λ nhỏ, nhiều cực đại', params: { freq: 4.5, speed: 50, sep: 160 } },
      { label: 'Ít vân rộng', description: 'λ lớn, vân tách rộng', params: { freq: 1.4, speed: 90, sep: 100 } }
    ]
  },
  standing_wave: {
    id: 'standing_wave',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Sóng Dừng Trên Sợi Dây Đàn Hồi',
    subtitle: 'Hình thành các nút sóng đứng yên và bụng sóng dao động cực đại',
    formula: 'l = k·(λ/2) (2 đầu cố định)',
    linkedLessonId: 'phys-standing-wave',
    defaultParams: { length: 2.4, waveSpeed: 24, amplitude: 5, harmonicN: 3, openEnd: 0 },
    paramBounds: {
      harmonicN: { min: 1, max: 7, step: 1, unit: 'bó', label: 'Số bó sóng k' },
      amplitude: { min: 2, max: 9, step: 0.5, unit: 'cm', label: 'Biên độ bụng' },
      waveSpeed: { min: 8, max: 48, step: 2, unit: 'm/s', label: 'Tốc độ truyền v' },
      length: { min: 1.0, max: 4.0, step: 0.2, unit: 'm', label: 'Chiều dài dây l' }
    },
    presets: [
      { label: 'Họa âm bậc 1 (1 bó)', description: 'k = 1 bó sóng cơ bản', params: { length: 2.4, waveSpeed: 20, amplitude: 7, harmonicN: 1, openEnd: 0 } },
      { label: '3 bó sóng (k = 3)', description: '4 nút, 3 bụng rõ nét', params: { length: 2.4, waveSpeed: 24, amplitude: 5, harmonicN: 3, openEnd: 0 } },
      { label: '1 đầu tự do (Bụng tự do)', description: 'Đầu phải dao động tự do', params: { length: 2.4, waveSpeed: 24, amplitude: 5, harmonicN: 3, openEnd: 1 } }
    ]
  },
  doppler_effect: {
    id: 'doppler_effect',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Hiệu Ứng Doppler Sóng Âm',
    subtitle: 'Biến dạng mặt sóng khi nguồn âm di chuyển với vận tốc vs so với tốc độ âm v',
    formula: "f' = f·(v ± v₀)/(v ∓ v_s)",
    linkedLessonId: 'phys-doppler-effect',
    defaultParams: { sourceSpeed: 150, waveSpeed: 340, sourceFreq: 440 },
    paramBounds: {
      sourceSpeed: { min: 0, max: 480, step: 10, unit: 'm/s', label: 'Tốc độ nguồn vs' },
      waveSpeed: { min: 200, max: 400, step: 10, unit: 'm/s', label: 'Tốc độ sóng v' },
      sourceFreq: { min: 150, max: 800, step: 20, unit: 'Hz', label: 'Tần số phát f₀' }
    },
    presets: [
      { label: 'Dưới âm (0.45 Mach)', description: 'Bước sóng trước ngắn, sau dài', params: { sourceSpeed: 153, waveSpeed: 340, sourceFreq: 440 } },
      { label: 'Tường âm thanh (1.0 Mach)', description: 'v_s = v tạo mặt nón Mach', params: { sourceSpeed: 340, waveSpeed: 340, sourceFreq: 440 } },
      { label: 'Siêu thanh (1.35 Mach)', description: 'Sóng xung kích Mach cone', params: { sourceSpeed: 459, waveSpeed: 340, sourceFreq: 480 } }
    ]
  },
  ohm_circuit: {
    id: 'ohm_circuit',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Định Luật Ôm & Dòng Electron Trong Mạch',
    subtitle: 'Thay đổi suất điện động U và điện trở R₁, R₂ để đo I₁, I₂ và công suất P',
    formula: 'I = U / R_tđ · P = U·I = I²R',
    linkedLessonId: 'phys-9-elec',
    defaultParams: { voltage: 12, r1: 4, r2: 8, circuitType: 0 },
    paramBounds: {
      circuitType: { min: 0, max: 1, step: 1, unit: '', label: 'Kiểu ghép điện trở' },
      voltage: { min: 1, max: 24, step: 1, unit: 'V', label: 'Hiệu điện thế U' },
      r1: { min: 1, max: 20, step: 1, unit: 'Ω', label: 'Điện trở R₁' },
      r2: { min: 1, max: 20, step: 1, unit: 'Ω', label: 'Điện trở R₂' }
    },
    presets: [
      { label: 'Nối tiếp chuẩn 12V', description: 'U = 12V, R₁ = 4Ω nt R₂ = 8Ω', params: { voltage: 12, r1: 4, r2: 8, circuitType: 0 } },
      { label: 'Mắc Song Song 12V', description: 'U = 12V, R₁ = 4Ω // R₂ = 8Ω', params: { voltage: 12, r1: 4, r2: 8, circuitType: 1 } },
      { label: 'Tải cao 24V', description: 'U = 24V, R₁ = 12Ω, R₂ = 12Ω', params: { voltage: 24, r1: 12, r2: 12, circuitType: 0 } }
    ]
  },
  electric_field: {
    id: 'electric_field',
    domainId: 'electricity_mag',
    grades: ['Lớp 11'],
    title: 'Đường Sức Điện Trường Hai Điện Tích',
    subtitle: 'Mô phỏng đường sức tĩnh điện từ điện tích điểm q₁, q₂ và vectơ cường độ E',
    formula: 'E = k|q| / (εr²) · E_tổng = E₁ + E₂',
    linkedLessonId: 'phys-11-b17',
    defaultParams: { q1: 4, q2: -4, dist: 180 },
    paramBounds: {
      q1: { min: -8, max: 8, step: 1, unit: 'μC', label: 'Điện tích q₁' },
      q2: { min: -8, max: 8, step: 1, unit: 'μC', label: 'Điện tích q₂' },
      dist: { min: 80, max: 280, step: 10, unit: 'mm', label: 'Khoảng cách r' }
    },
    presets: [
      { label: 'Lưỡng cực (+q, -q)', description: 'Đường sức đi từ + sang -', params: { q1: 5, q2: -5, dist: 180 } },
      { label: 'Hai điện tích cùng dấu', description: 'Đẩy nhau, xuất hiện điểm triệt tiêu E=0', params: { q1: 5, q2: 5, dist: 180 } },
      { label: 'Lệch độ lớn (+8, -2)', description: 'Mật độ đường sức q₁ dày gấp 4 lần', params: { q1: 8, q2: -2, dist: 190 } }
    ]
  },
  magnetic_induction: {
    id: 'magnetic_induction',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Cảm Ứng Điện Từ Faraday & Lenz',
    subtitle: 'Di chuyển nam châm qua cuộn dây tạo từ thông biến thiên dΦ/dt và dòng điện cảm ứng',
    formula: 'e_c = -ΔΦ / Δt = -N·B·S·cosα / Δt',
    linkedLessonId: 'phys-12-b16',
    defaultParams: { magnetSpeed: 4, turns: 12, bField: 1.5 },
    paramBounds: {
      magnetSpeed: { min: 1, max: 10, step: 0.5, unit: 'm/s', label: 'Tốc độ nam châm' },
      turns: { min: 4, max: 24, step: 2, unit: 'vòng', label: 'Số vòng dây N' },
      bField: { min: 0.5, max: 3, step: 0.1, unit: 'T', label: 'Cảm ứng từ B' }
    },
    presets: [
      { label: 'Thí nghiệm chuẩn', description: 'N = 12 vòng, B = 1.5 T', params: { magnetSpeed: 4, turns: 12, bField: 1.5 } },
      { label: 'Cuộn dày tốc độ cao', description: 'Suất điện động cảm ứng cực đại', params: { magnetSpeed: 9, turns: 24, bField: 2.5 } },
      { label: 'Biến thiên chậm', description: 'Quan sát rõ chiều dòng Lenz', params: { magnetSpeed: 1.5, turns: 8, bField: 1.2 } }
    ]
  },
  ac_rlc_circuit: {
    id: 'ac_rlc_circuit',
    domainId: 'electricity_mag',
    grades: ['Lớp 12'],
    title: 'Mạch Xoay Chiều RLC & Cộng Hưởng Điện',
    subtitle: 'Giản đồ Fresnel (U_R, U_L, U_C), tổng trở Z và độ lệch pha φ',
    formula: 'Z = √(R² + (Z_L - Z_C)²) · I = U / Z',
    linkedLessonId: 'phys-12-ac-rlc',
    defaultParams: { uEff: 120, resR: 40, indL: 0.3, capC: 40, freq: 50 },
    paramBounds: {
      uEff: { min: 40, max: 220, step: 10, unit: 'V', label: 'Điện áp hiệu dụng U' },
      resR: { min: 10, max: 120, step: 5, unit: 'Ω', label: 'Điện trở R' },
      indL: { min: 0.05, max: 0.6, step: 0.05, unit: 'H', label: 'Độ tự cảm L' },
      capC: { min: 10, max: 120, step: 5, unit: 'μF', label: 'Điện dung C' },
      freq: { min: 20, max: 100, step: 2, unit: 'Hz', label: 'Tần số f' }
    },
    presets: [
      { label: 'Cộng hưởng (Z_L = Z_C)', description: 'Hệ số công suất cosφ = 1', params: { uEff: 120, resR: 40, indL: 0.2, capC: 50.6, freq: 50 } },
      { label: 'Tính cảm kháng (φ > 0)', description: 'u nhanh pha hơn i', params: { uEff: 120, resR: 30, indL: 0.45, capC: 60, freq: 60 } },
      { label: 'Tính dung kháng (φ < 0)', description: 'u trễ pha hơn i', params: { uEff: 120, resR: 35, indL: 0.1, capC: 25, freq: 40 } }
    ]
  },
  light_refraction: {
    id: 'light_refraction',
    domainId: 'optics_quantum',
    grades: ['Lớp 9'],
    title: 'Khúc Xạ Ánh Sáng & Phản Xạ Toàn Phần',
    subtitle: 'Định luật Snell n₁sin(i) = n₂sin(r) và góc giới hạn phản xạ toàn phần',
    formula: 'n₁·sin(i) = n₂·sin(r) · sin(i_gh) = n₂/n₁',
    linkedLessonId: 'phys-9-energy-refract',
    defaultParams: { angleI: 40, n1: 1.0, n2: 1.5 },
    paramBounds: {
      angleI: { min: 0, max: 85, step: 1, unit: '°', label: 'Góc tới i' },
      n1: { min: 1.0, max: 2.4, step: 0.05, unit: '', label: 'Chiết suất môi trường 1' },
      n2: { min: 1.0, max: 2.4, step: 0.05, unit: '', label: 'Chiết suất môi trường 2' }
    },
    presets: [
      { label: 'Không khí → Thủy tinh', description: 'n₁ = 1.0 → n₂ = 1.5', params: { angleI: 45, n1: 1.0, n2: 1.5 } },
      { label: 'Phản xạ toàn phần (Nước → KK)', description: 'n₁ = 1.33 → n₂ = 1.0, i = 55° > i_gh', params: { angleI: 55, n1: 1.33, n2: 1.0 } },
      { label: 'Kim cương (n = 2.4)', description: 'Góc tới hạn rất nhỏ', params: { angleI: 30, n1: 2.4, n2: 1.0 } }
    ]
  },
  lens_optics: {
    id: 'lens_optics',
    domainId: 'optics_quantum',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Quang Hình Thấu Kính Hội Tụ & Phân Kì',
    subtitle: 'Dựng 3 tia sáng đặc biệt tạo ảnh thật/ảo, tính tiêu cự và độ phóng đại k',
    formula: '1/f = 1/d + 1/d\' · k = -d\'/d',
    linkedLessonId: 'phys-9-optics',
    defaultParams: { f: 15, d: 35, objH: 10 },
    paramBounds: {
      f: { min: 6, max: 30, step: 1, unit: 'cm', label: 'Tiêu cự |f|' },
      d: { min: 6, max: 55, step: 1, unit: 'cm', label: 'Khoảng cách vật d' },
      objH: { min: 4, max: 16, step: 1, unit: 'cm', label: 'Chiều cao vật h' }
    },
    presets: [
      { label: 'Ảnh thật nhỏ hơn (d > 2f)', description: 'f = 15cm, d = 40cm', params: { f: 15, d: 40, objH: 10 } },
      { label: 'Ảnh thật lớn hơn (f < d < 2f)', description: 'f = 15cm, d = 22cm', params: { f: 15, d: 22, objH: 9 } },
      { label: 'Kính lúp — Ảnh ảo (d < f)', description: 'f = 18cm, d = 10cm', params: { f: 18, d: 10, objH: 8 } }
    ]
  },
  young_interference: {
    id: 'young_interference',
    domainId: 'optics_quantum',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Thí Nghiệm Giao Thoa Khe Young',
    subtitle: 'Đo khoảng vân i = λD/a và phân bố vân sáng/tối trên màn quan sát',
    formula: 'i = λD / a · x_s = k·i',
    linkedLessonId: 'phys-11-b12',
    defaultParams: { lambda: 0.55, slitA: 1.0, screenD: 2.0 },
    paramBounds: {
      lambda: { min: 0.38, max: 0.76, step: 0.02, unit: 'μm', label: 'Bước sóng λ' },
      slitA: { min: 0.4, max: 2.5, step: 0.1, unit: 'mm', label: 'Khoảng cách 2 khe a' },
      screenD: { min: 0.8, max: 3.5, step: 0.1, unit: 'm', label: 'Khoảng cách màn D' }
    },
    presets: [
      { label: 'Ánh sáng Đỏ (0.65μm)', description: 'Khoảng vân i rộng', params: { lambda: 0.65, slitA: 1.0, screenD: 2.0 } },
      { label: 'Ánh sáng Lam (0.46μm)', description: 'Khoảng vân i hẹp hơn', params: { lambda: 0.46, slitA: 1.0, screenD: 2.0 } },
      { label: 'Khe siêu hẹp (a=0.5mm)', description: 'Tăng rõ độ rộng vân', params: { lambda: 0.55, slitA: 0.5, screenD: 2.5 } }
    ]
  },
  photoelectric_effect: {
    id: 'photoelectric_effect',
    domainId: 'optics_quantum',
    grades: ['Lớp 12'],
    title: 'Hiện Tượng Quang Điện Ngoài Einstein',
    subtitle: 'Bắn electron ra khỏi catot kim loại khi λ ≤ λ₀ và đo điện áp hãm U_AK',
    formula: 'hf = A + ½mv²_max · λ₀ = hc/A',
    linkedLessonId: 'phys-12-optics-q',
    defaultParams: { wavelengthNm: 280, workFunctionEv: 2.14, voltageUak: 1.5 },
    paramBounds: {
      wavelengthNm: { min: 180, max: 750, step: 10, unit: 'nm', label: 'Bước sóng ánh sáng λ' },
      workFunctionEv: { min: 1.8, max: 5.0, step: 0.1, unit: 'eV', label: 'Công thoát kim loại A' },
      voltageUak: { min: -4, max: 4, step: 0.2, unit: 'V', label: 'Hiệu điện thế U_AK' }
    },
    presets: [
      { label: 'Tia Tử Ngoại + Natri', description: 'Bật electron mạnh mẽ', params: { wavelengthNm: 260, workFunctionEv: 2.28, voltageUak: 1.5 } },
      { label: 'Ngưỡng đỏ không bứt e', description: 'λ > λ₀ nên dòng quang điện = 0', params: { wavelengthNm: 680, workFunctionEv: 2.28, voltageUak: 1.5 } },
      { label: 'Đặt điện áp hãm (-2.5V)', description: 'Khảo sát hiệu điện thế hãm', params: { wavelengthNm: 260, workFunctionEv: 2.14, voltageUak: -2.5 } }
    ]
  },
  thermal_gas: {
    id: 'thermal_gas',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Động Học Phân Tử & Khí Lí Tưởng',
    subtitle: 'Va chạm phân tử trong xi-lanh pít-tông theo nhiệt độ T và thể tích V',
    formula: 'pV = nRT · W_đ = (3/2)k_BT',
    linkedLessonId: 'phys-12-b12',
    defaultParams: { tempK: 320, volume: 10, moles: 1.0 },
    paramBounds: {
      tempK: { min: 150, max: 600, step: 15, unit: 'K', label: 'Nhiệt độ tuyệt đối T' },
      volume: { min: 4, max: 20, step: 1, unit: 'L', label: 'Thể tích bình V' },
      moles: { min: 0.4, max: 3.0, step: 0.2, unit: 'mol', label: 'Số mol khí n' }
    },
    presets: [
      { label: 'Điều kiện chuẩn (300K)', description: 'Nhiệt độ phòng 27°C', params: { tempK: 300, volume: 10, moles: 1.0 } },
      { label: 'Nén áp suất cao', description: 'V = 5L, T = 540K, n = 2 mol', params: { tempK: 540, volume: 5, moles: 2.0 } },
      { label: 'Làm lạnh chậm (180K)', description: 'Phân tử chuyển động chậm', params: { tempK: 180, volume: 15, moles: 1.0 } }
    ]
  },
  nuclear_decay: {
    id: 'nuclear_decay',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Phóng Xạ & Chu Kì Bán Rã Hạt Nhân',
    subtitle: 'Đường cong phân rã mũ N(t) = N₀·2^(-t/T) theo số hạt nhân còn lại',
    formula: 'N(t) = N₀·2^(-t/T) = N₀·e^(-λt)',
    linkedLessonId: 'phys-12-b23',
    defaultParams: { n0: 160, halfLife: 4.0 },
    paramBounds: {
      n0: { min: 50, max: 320, step: 10, unit: 'hạt', label: 'Số hạt ban đầu N₀' },
      halfLife: { min: 1, max: 10, step: 0.5, unit: 's', label: 'Chu kì bán rã T' }
    },
    presets: [
      { label: 'Phóng xạ chuẩn (T=4s)', description: 'N₀ = 160 hạt, T = 4.0 s', params: { n0: 160, halfLife: 4.0 } },
      { label: 'Phóng xạ nhanh (T=1.5s)', description: 'Phân rã nhanh qua nhiều chu kì', params: { n0: 240, halfLife: 1.5 } },
      { label: 'Mẫu đồng vị bền (T=8s)', description: 'Số hạt giảm chậm theo thời gian', params: { n0: 200, halfLife: 8.0 } }
    ]
  }
};

export const PHYSICS_3D_SIMS: Record<Physics3DMode, Physics3DSimSpec> = {
  ...EXTRA_PHYSICS_3D_SIMS,
  kinematics_3d: {
    id: 'kinematics_3d',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Đường Đua Động Học 3D',
    subtitle: 'So sánh 2 xe thẳng đều & nhanh dần đều kèm vectơ vận tốc/gia tốc 3D',
    formula: 'x = x₀ + v₀t + ½at²',
    linkedLessonId: 'phys-10-accel',
    presets: [
      { label: 'Đuổi kịp chuẩn', description: 'Tốc độ 1.0x, hiện vectơ & quỹ đạo', settings: { speed: 1, amplitude: 1, showVectors: true, showTrail: true } },
      { label: 'Tăng tốc mạnh', description: 'Tốc độ 1.8x, quan sát gia tốc lớn', settings: { speed: 1.8, amplitude: 1.5, showVectors: true, showTrail: true } }
    ]
  },
  projectile_3d: {
    id: 'projectile_3d',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Quỹ Đạo Ném Xiên 3D & Vectơ Thành Phần',
    subtitle: 'Phân tích đồng thời quỹ đạo Parabol không gian với vectơ vx, vy',
    formula: 'y = x·tanα - gx²/(2v₀²cos²α)',
    linkedLessonId: 'phys-10-proj',
    presets: [
      { label: 'Góc phóng 45°', description: 'Tầm xa cực đại', settings: { speed: 1, amplitude: 1, showVectors: true, showTrail: true } },
      { label: 'Bắn chậm phân tích', description: 'Slow motion 0.5x dễ đọc vectơ', settings: { speed: 0.5, amplitude: 1.3, showVectors: true, showTrail: true } }
    ]
  },
  circular_motion_3d: {
    id: 'circular_motion_3d',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Quỹ Đạo Tròn Đều & Hướng Tâm 3D',
    subtitle: 'Quan sát lực hướng tâm và vận tốc tiếp tuyến quay đều quanh trục tọa độ',
    formula: 'F_ht = mω²R · v = ωR',
    linkedLessonId: 'phys-10-circular',
    presets: [
      { label: 'Quay tiêu chuẩn', description: 'R chuẩn, vectơ hướng tâm', settings: { speed: 1, amplitude: 1, showVectors: true, showTrail: true } },
      { label: 'Bán kính lớn & nhanh', description: 'Mở rộng biên độ R, tăng ω', settings: { speed: 1.7, amplitude: 1.4, showVectors: true, showTrail: true } }
    ]
  },
  pendulum_spring: {
    id: 'pendulum_spring',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Con Lắc Lò Xo & Quỹ Đạo Pha 3D',
    subtitle: 'Xoắn lò xo biến dạng thật kết hợp vệt pha điều hòa',
    formula: 'F = -kx · T = 2π√(m/k)',
    linkedLessonId: 'phys-11-shm',
    presets: [
      { label: 'Dao động điều hòa', description: 'Biên độ 1.0x, hiện lực phục hồi', settings: { speed: 1, amplitude: 1, showVectors: true, showTrail: true } },
      { label: 'Biên độ lớn', description: 'Lò xo giãn tối đa', settings: { speed: 1.3, amplitude: 1.6, showVectors: true, showTrail: true } }
    ]
  },
  wave_ripple: {
    id: 'wave_ripple',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Mặt Sóng Giao Thoa 3D (2 Nguồn Kết Hợp)',
    subtitle: 'Mặt nước 3D dập dềnh theo biên độ giao thoa S₁ & S₂ tại mọi điểm (x, z)',
    formula: 'u_M = 2A·cos(π(d₂-d₁)/λ)·cos(ωt - π(d₁+d₂)/λ)',
    linkedLessonId: 'phys-11-b12',
    presets: [
      { label: 'Sóng giao thoa cân bằng', description: 'Vân cực đại-cực tiểu đối xứng', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Biển sóng tần số cao', description: 'Tần số sóng 1.7x tạo nhiều gợn', settings: { speed: 1.2, amplitude: 1.3, frequency: 1.7 } }
    ]
  },
  standing_wave_3d: {
    id: 'standing_wave_3d',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Sóng Dừng Không Gian 3D',
    subtitle: 'Quan sát rõ các nút cố định và bụng dao động trong không gian 3 chiều',
    formula: 'l = k·(λ/2)',
    linkedLessonId: 'phys-standing-wave',
    presets: [
      { label: '3 bó sóng (k=3)', description: 'Cộng hưởng họa âm bậc 3', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Họa âm cao', description: 'Tăng số bụng sóng trên dây', settings: { speed: 1.2, amplitude: 1.2, frequency: 1.8 } }
    ]
  },
  doppler_effect_3d: {
    id: 'doppler_effect_3d',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Sóng Cầu & Nón Mach Doppler 3D',
    subtitle: 'Các vòng mặt sóng lan truyền bị nén phía trước nguồn phát chuyển động',
    formula: "f' = f·v / (v - v_s)",
    linkedLessonId: 'phys-doppler-effect',
    presets: [
      { label: 'Nguồn di chuyển đều', description: 'Hiện rõ hiệu ứng dồn bước sóng', settings: { speed: 1, frequency: 1 } },
      { label: 'Cận tường âm thanh', description: 'Tần số dồn đặc phía đầu', settings: { speed: 1.6, frequency: 1.5 } }
    ]
  },
  lorentz_helix: {
    id: 'lorentz_helix',
    domainId: 'electricity_mag',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Quỹ Đạo Xoắn Ốc Lực Lorentz 3D',
    subtitle: 'Hạt mang điện q bay xiên góc vào từ trường đều B chịu lực f = q(v × B)',
    formula: 'f_L = |q|vB·sinα · R = mv⊥ / (|q|B)',
    linkedLessonId: 'phys-12-mag',
    presets: [
      { label: 'Xoắn ốc đều', description: 'Hiện đầy đủ vectơ v, B và f_L', settings: { speed: 1, amplitude: 1, showVectors: true, showTrail: true } },
      { label: 'Bán kính xoắn lớn', description: 'Giảm từ trường B để R mở rộng', settings: { speed: 1.4, amplitude: 1.6, showVectors: true, showTrail: true } }
    ]
  },
  ac_generator_3d: {
    id: 'ac_generator_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 12'],
    title: 'Máy Phát Điện Xoay Chiều 3D',
    subtitle: 'Khung dây quay đều trong từ trường đều của nam châm chữ U tạo suất điện động sin',
    formula: 'e = E₀·sin(ωt) = ωNBS·sin(ωt)',
    linkedLessonId: 'phys-12-ac-gen',
    presets: [
      { label: 'Tần số lưới 50Hz chậm', description: 'Quan sát cực đại khi mặt phẳng // B', settings: { speed: 1, frequency: 1, showVectors: true } },
      { label: 'Quay công suất lớn', description: 'Tăng ω gấp 2 lần', settings: { speed: 2, frequency: 1.5, showVectors: true } }
    ]
  },
  optics_3d: {
    id: 'optics_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Bàn Thí Nghiệm Quang Học Thấu Kính 3D',
    subtitle: 'Chùm tia sáng song song hội tụ qua thấu kính lồi 3D trên băng quang học',
    formula: '1/f = 1/d + 1/d\'',
    linkedLessonId: 'phys-9-optics',
    presets: [
      { label: 'Hội tụ tiêu chuẩn', description: 'Thấu kính tiêu cự trung bình', settings: { amplitude: 1, showVectors: true } },
      { label: 'Hội tụ mạnh (D lớn)', description: 'Tia hội tụ gần thấu kính', settings: { amplitude: 1.6, showVectors: true } }
    ]
  },
  young_interference_3d: {
    id: 'young_interference_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Hộp Giao Thoa Khe Young 3D',
    subtitle: 'Chùm tia laser từ hai khe S₁, S₂ giao thoa tạo hệ vân sáng-tối trên màn 3D',
    formula: 'i = λD / a',
    linkedLessonId: 'phys-11-b12',
    presets: [
      { label: 'Laser Xanh lục', description: 'Vân sắc nét trên màn ảnh 3D', settings: { frequency: 1, amplitude: 1 } },
      { label: 'Khoảng vân rộng', description: 'Tăng bước sóng/giảm khe a', settings: { frequency: 0.7, amplitude: 1.5 } }
    ]
  },
  photoelectric_3d: {
    id: 'photoelectric_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 12'],
    title: 'Tế Bào Quang Điện & Photon 3D',
    subtitle: 'Các hạt photon bắn vào tấm Catốt giải phóng đám mây quang electron bay về Anốt',
    formula: 'ε = hf = A + W_đmax',
    linkedLessonId: 'phys-12-optics-q',
    presets: [
      { label: 'Chùm photon năng lượng cao', description: 'Electron bắn ra tốc độ cao', settings: { speed: 1.2, frequency: 1.4 } },
      { label: 'Quan sát chậm va chạm', description: 'Slow motion theo dõi từng hạt photon', settings: { speed: 0.5, frequency: 1 } }
    ]
  },
  thermal_gas_3d: {
    id: 'thermal_gas_3d',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Hộp Khí Lí Tưởng Va Đập Đàn Hồi 3D',
    subtitle: 'Chuyển động nhiệt hỗn loạn 3 chiều của các phân tử khí phụ thuộc T',
    formula: 'p = (1/3)nm₀v²_tb',
    linkedLessonId: 'phys-12-b12',
    presets: [
      { label: 'Nhiệt độ phòng', description: 'Tốc độ phân tử trung bình', settings: { speed: 1, frequency: 1 } },
      { label: 'Khí nóng áp suất cao', description: 'Động năng va đập thành bình tăng mạnh', settings: { speed: 2, frequency: 1.6 } }
    ]
  },
  bohr_atom: {
    id: 'bohr_atom',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Mẫu Nguyên Tử Bohr & Quỹ Đạo Dừng 3D',
    subtitle: 'Electron chuyển động trên các quỹ đạo dừng K, L, M quanh hạt nhân trung tâm',
    formula: 'r_n = n²·r₀ · ε = E_cao - E_thấp = hf',
    linkedLessonId: 'phys-12-optics-q',
    presets: [
      { label: 'Quỹ đạo dừng K-L-M', description: 'Hiện đầy đủ quỹ đạo 3D', settings: { speed: 1, showTrail: true } },
      { label: 'Phóng to mô hình', description: 'Tăng kích thước và tốc độ quay', settings: { speed: 1.6, amplitude: 1.3, showTrail: true } }
    ]
  }
};

export function get2DSimsByDomain(domainId: PhysicsDomainId): Physics2DSimSpec[] {
  return Object.values(PHYSICS_2D_SIMS).filter((s) => s.domainId === domainId);
}

export function get3DSimsByDomain(domainId: PhysicsDomainId): Physics3DSimSpec[] {
  return Object.values(PHYSICS_3D_SIMS).filter((s) => s.domainId === domainId);
}

export function getDomainFor2DSim(simId: PhysicsSimType): PhysicsDomainId {
  return PHYSICS_2D_SIMS[simId]?.domainId ?? 'mechanics';
}

export function getDomainFor3DSim(modeId: Physics3DMode): PhysicsDomainId {
  return PHYSICS_3D_SIMS[modeId]?.domainId ?? 'mechanics';
}

export function getPhysicsSimCounts(): { count2D: number; count3D: number; total: number } {
  const count2D = Object.keys(PHYSICS_2D_SIMS).length;
  const count3D = Object.keys(PHYSICS_3D_SIMS).length;
  return { count2D, count3D, total: count2D + count3D };
}
