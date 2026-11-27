import { Chemistry3DMode, ChemistryDomainId, ChemistrySimType } from '../types';

export interface ChemistryDomainMeta {
  id: ChemistryDomainId;
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

export interface ChemistryParamBound {
  min: number;
  max: number;
  step: number;
  unit: string;
  label: string;
}

export interface Chemistry2DSimSpec {
  id: ChemistrySimType;
  domainId: ChemistryDomainId;
  grades: ('Lớp 6' | 'Lớp 7' | 'Lớp 8' | 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12')[];
  title: string;
  subtitle: string;
  formula: string;
  linkedLessonId: string;
  defaultParams: Record<string, number>;
  paramBounds: Record<string, ChemistryParamBound>;
  presets: {
    label: string;
    description: string;
    params: Record<string, number>;
  }[];
}

export interface Chemistry3DSimSpec {
  id: Chemistry3DMode;
  domainId: ChemistryDomainId;
  grades: ('Lớp 6' | 'Lớp 7' | 'Lớp 8' | 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12')[];
  title: string;
  subtitle: string;
  formula: string;
  linkedLessonId: string;
  presets: {
    label: string;
    description: string;
    settings: {
      speed?: number;
      temperature?: number;
      concentration?: number;
      showLabels?: boolean;
      showVectors?: boolean;
      showGrid?: boolean;
    };
  }[];
}

export const CHEMISTRY_DOMAINS: ChemistryDomainMeta[] = [
  {
    id: 'atomic_periodic',
    code: 'ATM · 01',
    name: 'Nguyên tử & Bảng tuần hoàn',
    shortName: 'Nguyên tử & BTH',
    grades: 'Lớp 9 – 10',
    tagline: 'Đám mây orbital s/p/d, cấu hình electron, bán kính nguyên tử, độ âm điện & phổ phát xạ ngọn lửa.',
    accentHex: '#0ea5e9',
    accentBadgeClass: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/15 border-sky-200 dark:border-sky-500/30',
    borderClass: 'border-sky-300 dark:border-sky-500/40',
    bgActiveClass: 'bg-sky-600 text-white border-sky-600'
  },
  {
    id: 'bonding_structure',
    code: 'BND · 02',
    name: 'Liên kết & Tinh thể VSEPR',
    shortName: 'Liên kết & VSEPR',
    grades: 'Lớp 10 – 12',
    tagline: 'Hình học phân tử VSEPR (lai hóa sp, sp², sp³), mạng tinh thể NaCl/kim cương, liên kết hiđro & phức chất.',
    accentHex: '#6366f1',
    accentBadgeClass: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/15 border-indigo-200 dark:border-indigo-500/30',
    borderClass: 'border-indigo-300 dark:border-indigo-500/40',
    bgActiveClass: 'bg-indigo-600 text-white border-indigo-600'
  },
  {
    id: 'kinetics_thermo',
    code: 'KIN · 03',
    name: 'Nhiệt động & Động hóa học',
    shortName: 'Nhiệt & Động hóa',
    grades: 'Lớp 10 – 11',
    tagline: 'Biến thiên enthalpy ΔH, năng lượng hoạt hóa E_a, phân bố Maxwell–Boltzmann, tốc độ phản ứng & xúc tác.',
    accentHex: '#f59e0b',
    accentBadgeClass: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30',
    borderClass: 'border-amber-300 dark:border-amber-500/40',
    bgActiveClass: 'bg-amber-600 text-white border-amber-600'
  },
  {
    id: 'equilibrium_acidbase',
    code: 'EQB · 04',
    name: 'Cân bằng & Dung dịch Acid–Base',
    shortName: 'Cân bằng & pH',
    grades: 'Lớp 11 – 12',
    tagline: 'Chuyển dịch Le Chatelier, đường cong chuẩn độ pH acid–base, dung dịch đệm Henderson–Hasselbalch & tính chất dung dịch.',
    accentHex: '#10b981',
    accentBadgeClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30',
    borderClass: 'border-emerald-300 dark:border-emerald-500/40',
    bgActiveClass: 'bg-emerald-600 text-white border-emerald-600'
  },
  {
    id: 'electro_inorganic',
    code: 'ELC · 05',
    name: 'Điện hóa & Hóa Vô cơ',
    shortName: 'Điện hóa & Vô cơ',
    grades: 'Lớp 9 – 12',
    tagline: 'Pin điện hóa Daniell E°_pin, điện phân Faraday, dãy điện hóa kim loại, halogen, amoniac Haber & ăn mòn điện hóa.',
    accentHex: '#8b5cf6',
    accentBadgeClass: 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/15 border-violet-200 dark:border-violet-500/30',
    borderClass: 'border-violet-300 dark:border-violet-500/40',
    bgActiveClass: 'bg-violet-600 text-white border-violet-600'
  },
  {
    id: 'organic_polymer',
    code: 'ORG · 06',
    name: 'Hóa Hữu cơ & Polime',
    shortName: 'Hữu cơ & Polime',
    grades: 'Lớp 9 – 12',
    tagline: 'Đồng phân hiđrocacbon, cộng Markovnikov, vòng thơm benzen, este hóa, xà phòng hóa, cacbohiđrat, amino axit & polime.',
    accentHex: '#f43f5e',
    accentBadgeClass: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/15 border-rose-200 dark:border-rose-500/30',
    borderClass: 'border-rose-300 dark:border-rose-500/40',
    bgActiveClass: 'bg-rose-600 text-white border-rose-600'
  }
];

export const CHEMISTRY_2D_SIMS: Chemistry2DSimSpec[] = [
  {
    id: 'atomic_orbitals_2d',
    domainId: 'atomic_periodic',
    grades: ['Lớp 10'],
    title: 'Mật Độ Xác Suất Orbital Nguyên Tử (1s, 2p, 3d)',
    subtitle: 'Phân bố hàm sóng xuyên tâm |ψ|² và hình dạng AO theo số lượng tử (n, l)',
    formula: '\\psi_{n,l,m}(r,\\theta,\\varphi) = R_{n,l}(r)Y_l^m(\\theta,\\varphi)',
    linkedLessonId: 'chem-10-1',
    defaultParams: { n: 2, l: 1, zEff: 6 },
    paramBounds: {
      n: { min: 1, max: 4, step: 1, unit: '', label: 'Số lượng tử chính n' },
      l: { min: 0, max: 2, step: 1, unit: '', label: 'Phân lớp l (0=s, 1=p, 2=d)' },
      zEff: { min: 1, max: 20, step: 1, unit: '', label: 'Điện tích hạt nhân Z' }
    },
    presets: [
      { label: 'Orbital 1s (Hydro)', description: 'Đối xứng cầu, không có nút xuyên tâm', params: { n: 1, l: 0, zEff: 1 } },
      { label: 'Orbital 2p (Cacbon)', description: 'Hình số 8 nổi, 1 mặt phẳng nút', params: { n: 2, l: 1, zEff: 6 } },
      { label: 'Orbital 3d (Sắt)', description: '4 thùy xen dấu, phân lớp ngoài kim loại d', params: { n: 3, l: 2, zEff: 26 } }
    ]
  },
  {
    id: 'periodic_trends_2d',
    domainId: 'atomic_periodic',
    grades: ['Lớp 10'],
    title: 'Biến Thiên Tuần Hoàn R, IE₁ & Độ Âm Điện',
    subtitle: 'Đồ thị chu kì Z = 1..36 cho bán kính nguyên tử, năng lượng ion hóa thứ nhất và độ âm điện Pauling',
    formula: 'Z_{\\text{eff}} = Z - \\sigma,\\quad R \\propto \\frac{n^2}{Z_{\\text{eff}}}',
    linkedLessonId: 'chem-10-2',
    defaultParams: { zMax: 20, highlightZ: 11, mode: 1 },
    paramBounds: {
      zMax: { min: 10, max: 36, step: 2, unit: '', label: 'Phạm vi Z tối đa' },
      highlightZ: { min: 1, max: 36, step: 1, unit: '', label: 'Nguyên tố chọn Z' },
      mode: { min: 1, max: 3, step: 1, unit: '', label: 'Chỉ số (1:R, 2:IE₁, 3:χ)' }
    },
    presets: [
      { label: 'Bán kính R (Z=1..20)', description: 'Giảm dần trong chu kì, tăng vọt sang chu kì mới', params: { zMax: 20, highlightZ: 11, mode: 1 } },
      { label: 'Năng lượng ion hóa IE₁', description: 'Đạt đỉnh ở khí hiếm He, Ne, Ar', params: { zMax: 20, highlightZ: 10, mode: 2 } },
      { label: 'Độ âm điện Pauling χ', description: 'F = 3.98 lớn nhất, kim loại kiềm nhỏ nhất', params: { zMax: 20, highlightZ: 9, mode: 3 } }
    ]
  },
  {
    id: 'flame_spectroscopy_2d',
    domainId: 'atomic_periodic',
    grades: ['Lớp 10', 'Lớp 12'],
    title: 'Quang Phổ Vạch & Màu Ngọn Lửa Ion Kim Loại',
    subtitle: 'Bước chuyển mức năng lượng ΔE = hc/λ của Li⁺, Na⁺, K⁺, Ca²⁺, Cu²⁺, Ba²⁺',
    formula: '\\Delta E = E_2 - E_1 = \\frac{hc}{\\lambda}',
    linkedLessonId: 'chem-12-7',
    defaultParams: { ionCode: 2, tempK: 1800, slitWidth: 2 },
    paramBounds: {
      ionCode: { min: 1, max: 6, step: 1, unit: '', label: 'Ion (1:Li 2:Na 3:K 4:Ca 5:Cu 6:Ba)' },
      tempK: { min: 900, max: 2600, step: 50, unit: 'K', label: 'Nhiệt độ ngọn lửa' },
      slitWidth: { min: 1, max: 5, step: 1, unit: 'nm', label: 'Độ rộng khe phổ' }
    },
    presets: [
      { label: 'Na⁺ (Vàng 589 nm)', description: 'Cặp vạch kép D natri đặc trưng', params: { ionCode: 2, tempK: 1800, slitWidth: 2 } },
      { label: 'Cu²⁺ (Xanh lục 515 nm)', description: 'Ngọn lửa xanh lục lam của đồng', params: { ionCode: 5, tempK: 2000, slitWidth: 2 } },
      { label: 'K⁺ (Tím 404/766 nm)', description: 'Ngọn lửa tím hoa cà đặc trưng', params: { ionCode: 3, tempK: 1750, slitWidth: 2 } }
    ]
  },
  {
    id: 'vsepr_bonding_2d',
    domainId: 'bonding_structure',
    grades: ['Lớp 10', 'Lớp 11'],
    title: 'Hình Học Phân Tử VSEPR & Lai Hóa sp–sp³d²',
    subtitle: 'Tính góc liên kết, lực đẩy cặp electron tự do (LP–LP > LP–BP > BP–BP) và moment lưỡng cực',
    formula: '\\text{Số cặp e} = \\sigma + E \\Rightarrow \\text{Dạng hình học}',
    linkedLessonId: 'chem-10-3',
    defaultParams: { bondingPairs: 4, lonePairs: 0, enDiff: 0.4 },
    paramBounds: {
      bondingPairs: { min: 2, max: 6, step: 1, unit: '', label: 'Số cặp liên kết σ' },
      lonePairs: { min: 0, max: 2, step: 1, unit: '', label: 'Cặp e tự do E' },
      enDiff: { min: 0, max: 2.2, step: 0.1, unit: '', label: 'Hiệu độ âm điện Δχ' }
    },
    presets: [
      { label: 'CH₄ (Tứ diện 109.5°)', description: '4 cặp liên kết, 0 cặp tự do, không phân cực', params: { bondingPairs: 4, lonePairs: 0, enDiff: 0.35 } },
      { label: 'NH₃ (Chóp tam giác 107°)', description: '3 cặp σ + 1 cặp tự do nén góc', params: { bondingPairs: 3, lonePairs: 1, enDiff: 0.84 } },
      { label: 'H₂O (Chữ V 104.5°)', description: '2 cặp σ + 2 cặp tự do nén mạnh', params: { bondingPairs: 2, lonePairs: 2, enDiff: 1.24 } }
    ]
  },
  {
    id: 'crystal_packing_2d',
    domainId: 'bonding_structure',
    grades: ['Lớp 10', 'Lớp 12'],
    title: 'Mặt Cắt Mạng Tinh Thể Ion & Kim Loại',
    subtitle: 'Tính số phối trí, bán kính hốc tứ diện/bát diện và độ đặc khít tinh thể lập phương',
    formula: '\\eta = \\frac{Z \\cdot \\frac{4}{3}\\pi r^3}{a^3} \\times 100\\%',
    linkedLessonId: 'chem-chuyen-10-2',
    defaultParams: { latticeType: 2, radiusRatio: 0.55, tempScale: 300 },
    paramBounds: {
      latticeType: { min: 1, max: 3, step: 1, unit: '', label: 'Mạng (1:SC 2:BCC 3:FCC)' },
      radiusRatio: { min: 0.25, max: 0.9, step: 0.05, unit: '', label: 'Tỉ lệ r⁺/r⁻' },
      tempScale: { min: 100, max: 900, step: 25, unit: 'K', label: 'Dao động nhiệt' }
    },
    presets: [
      { label: 'Lập phương đơn giản SC (52.4%)', description: 'Z = 1 nguyên tử / ô mạng', params: { latticeType: 1, radiusRatio: 0.55, tempScale: 298 } },
      { label: 'Lập phương tâm khối BCC (68%)', description: 'Z = 2 (Fe-α, Na, K, Cr)', params: { latticeType: 2, radiusRatio: 0.55, tempScale: 298 } },
      { label: 'Lập phương tâm mặt FCC (74%)', description: 'Z = 4 (Cu, Al, Au, Ag) đặc khít nhất', params: { latticeType: 3, radiusRatio: 0.55, tempScale: 298 } }
    ]
  },
  {
    id: 'complex_ligand_2d',
    domainId: 'bonding_structure',
    grades: ['Lớp 12'],
    title: 'Phức Chất & Tách Mức Năng Lượng Trường Tinh Thể Δ₀',
    subtitle: 'Phân tách obitan d thành t₂g và e_g tạo màu sắc đặc trưng của phức kim loại chuyển tiếp',
    formula: '\\Delta_o = \\frac{hc}{\\lambda_{\\text{hấp thụ}}}',
    linkedLessonId: 'chem-12-8',
    defaultParams: { dElectrons: 9, ligandStrength: 1.4, complexGeom: 1 },
    paramBounds: {
      dElectrons: { min: 1, max: 9, step: 1, unit: '', label: 'Số electron d' },
      ligandStrength: { min: 0.7, max: 2.5, step: 0.1, unit: 'eV', label: 'Cường độ phối tử Δ₀' },
      complexGeom: { min: 1, max: 2, step: 1, unit: '', label: 'Hình học (1:Bát diện 2:Tứ diện)' }
    },
    presets: [
      { label: '[Cu(H₂O)₆]²⁺ Xanh lam nhạt', description: 'd⁹ hấp thụ vùng đỏ cam (~780 nm)', params: { dElectrons: 9, ligandStrength: 1.5, complexGeom: 1 } },
      { label: '[Cu(NH₃)₄(H₂O)₂]²⁺ Xanh thẫm', description: 'Phối tử NH₃ trường mạnh hơn đẩy Δ₀ tăng', params: { dElectrons: 9, ligandStrength: 2.0, complexGeom: 1 } },
      { label: '[Fe(CN)₆]³⁻ Spin thấp', description: 'CN⁻ trường rất mạnh ghép cặp t₂g', params: { dElectrons: 5, ligandStrength: 2.4, complexGeom: 1 } }
    ]
  },
  {
    id: 'enthalpy_hess_2d',
    domainId: 'kinetics_thermo',
    grades: ['Lớp 10'],
    title: 'Giản Đồ Năng Lượng Enthalpy ΔH & Năng Lượng Hoạt Hóa',
    subtitle: 'So sánh phản ứng tỏa nhiệt (ΔH < 0) vs thu nhiệt (ΔH > 0) khi có mặt xúc tác làm giảm E_a',
    formula: '\\Delta_r H^\\circ_{298} = \\sum \\Delta_f H^\\circ(\\text{sp}) - \\sum \\Delta_f H^\\circ(\\text{cđ})',
    linkedLessonId: 'chem-10-5',
    defaultParams: { deltaH: -92, ea: 110, catalystDrop: 38 },
    paramBounds: {
      deltaH: { min: -200, max: 160, step: 5, unit: 'kJ', label: 'Biến thiên ΔH' },
      ea: { min: 40, max: 180, step: 5, unit: 'kJ', label: 'Năng lượng hoạt hóa Ea' },
      catalystDrop: { min: 0, max: 70, step: 5, unit: 'kJ', label: 'Giảm Ea nhờ xúc tác' }
    },
    presets: [
      { label: 'Tổng hợp NH₃ (Tỏa nhiệt)', description: 'ΔH = -92 kJ/mol, xúc tác Fe giảm Ea', params: { deltaH: -92, ea: 120, catalystDrop: 45 } },
      { label: 'Nhiệt phân CaCO₃ (Thu nhiệt)', description: 'ΔH = +178 kJ/mol, thu năng lượng liên tục', params: { deltaH: 145, ea: 170, catalystDrop: 20 } },
      { label: 'Đốt cháy CH₄', description: 'Tỏa nhiệt rất mạnh', params: { deltaH: -180, ea: 90, catalystDrop: 30 } }
    ]
  },
  {
    id: 'reaction_kinetics_2d',
    domainId: 'kinetics_thermo',
    grades: ['Lớp 10'],
    title: 'Động Học Va Chạm & Tốc Độ Phản Ứng Hóa Học',
    subtitle: 'Ảnh hưởng của nồng độ C, nhiệt độ T (quy tắc Van ’t Hoff γ), áp suất và diện tích bề mặt',
    formula: 'v = k[A]^m[B]^n,\\quad \\frac{v_{T_2}}{v_{T_1}} = \\gamma^{(T_2 - T_1)/10}',
    linkedLessonId: 'chem-10-6',
    defaultParams: { concA: 1.5, tempC: 35, gamma: 2.2, catalystOn: 0 },
    paramBounds: {
      concA: { min: 0.4, max: 3.0, step: 0.1, unit: 'M', label: 'Nồng độ chất A' },
      tempC: { min: 10, max: 80, step: 5, unit: '°C', label: 'Nhiệt độ phản ứng' },
      gamma: { min: 2, max: 4, step: 0.2, unit: '', label: 'Hệ số Van \'t Hoff γ' },
      catalystOn: { min: 0, max: 1, step: 1, unit: '', label: 'Xúc tác (0/1)' }
    },
    presets: [
      { label: 'Điều kiện chuẩn (25°C, 1M)', description: 'Tốc độ cơ sở v₀', params: { concA: 1.0, tempC: 25, gamma: 2, catalystOn: 0 } },
      { label: 'Tăng nhiệt độ +20°C', description: 'Tốc độ tăng γ² = 4 lần', params: { concA: 1.0, tempC: 45, gamma: 2, catalystOn: 0 } },
      { label: 'Nồng độ cao + Xúc tác', description: 'Tần suất va chạm hiệu quả tăng vọt', params: { concA: 2.5, tempC: 55, gamma: 2.5, catalystOn: 1 } }
    ]
  },
  {
    id: 'maxwell_boltzmann_2d',
    domainId: 'kinetics_thermo',
    grades: ['Lớp 10', 'Lớp 11'],
    title: 'Phân Bố Động Năng Maxwell–Boltzmann & Ngưỡng Ea',
    subtitle: 'Diện tích phần hạt có động năng E ≥ Ea quyết định hằng số tốc độ k = A·e^(-Ea/RT)',
    formula: 'k = A \\exp\\left(-\\frac{E_a}{RT}\\right)',
    linkedLessonId: 'chem-10-6',
    defaultParams: { tempK: 350, eaThreshold: 55, catalystShift: 0 },
    paramBounds: {
      tempK: { min: 250, max: 650, step: 10, unit: 'K', label: 'Nhiệt độ tuyệt đối T' },
      eaThreshold: { min: 30, max: 90, step: 2, unit: 'kJ', label: 'Ngưỡng hoạt hóa Ea' },
      catalystShift: { min: 0, max: 25, step: 1, unit: 'kJ', label: 'Hạ Ea nhờ xúc tác' }
    },
    presets: [
      { label: 'T = 300K không xúc tác', description: 'Ít phân tử vượt ngưỡng Ea', params: { tempK: 300, eaThreshold: 65, catalystShift: 0 } },
      { label: 'Đun nóng T = 500K', description: 'Đỉnh phân bố dẹt xuống và dịch sang phải', params: { tempK: 500, eaThreshold: 65, catalystShift: 0 } },
      { label: 'Dùng xúc tác ở 300K', description: 'Đường ngưỡng Ea dịch trái giúp phần phản ứng tăng gấp bội', params: { tempK: 300, eaThreshold: 65, catalystShift: 22 } }
    ]
  },
  {
    id: 'equilibrium_shift_2d',
    domainId: 'equilibrium_acidbase',
    grades: ['Lớp 11'],
    title: 'Chuyển Dịch Cân Bằng Hóa Học (Le Chatelier)',
    subtitle: 'Hệ thuận nghịch N₂O₄ (không màu) ⇌ 2NO₂ (nâu đỏ), ΔH = +58 kJ theo T và áp suất P',
    formula: 'K_C = \\frac{[\\text{NO}_2]^2}{[\\text{N}_2\\text{O}_4]},\\quad K_p = \\frac{p_{\\text{NO}_2}^2}{p_{\\text{N}_2\\text{O}_4}}',
    linkedLessonId: 'chem-11-1',
    defaultParams: { tempC: 35, pressureAtm: 1.5, initN2O4: 1.0 },
    paramBounds: {
      tempC: { min: 0, max: 90, step: 5, unit: '°C', label: 'Nhiệt độ bình phản ứng' },
      pressureAtm: { min: 0.5, max: 4.0, step: 0.1, unit: 'atm', label: 'Áp suất pít-tông' },
      initN2O4: { min: 0.5, max: 2.0, step: 0.1, unit: 'M', label: 'Nồng độ ban đầu' }
    },
    presets: [
      { label: 'Ngâm nước đá (0°C)', description: 'Thuận nhiệt bị ức chế -> chuyển trái, nhạt màu', params: { tempC: 0, pressureAtm: 1.5, initN2O4: 1.0 } },
      { label: 'Đun nước nóng (75°C)', description: 'Cân bằng chuyển phải -> sinh NO₂ nâu đỏ đậm', params: { tempC: 75, pressureAtm: 1.5, initN2O4: 1.0 } },
      { label: 'Nén áp suất cao (3.5 atm)', description: 'Chuyển sang vế ít mol khí hơn (tạo N₂O₄)', params: { tempC: 35, pressureAtm: 3.5, initN2O4: 1.2 } }
    ]
  },
  {
    id: 'acid_base_titration_2d',
    domainId: 'equilibrium_acidbase',
    grades: ['Lớp 11', 'Lớp 9'],
    title: 'Chuẩn Độ Acid – Base & Đường Cong pH',
    subtitle: 'Nhỏ từ từ dung dịch NaOH từ buret xuống bình tam giác chứa HCl hoặc CH₃COOH với chỉ thị phenolphthalein',
    formula: 'V_{\\text{td}} = \\frac{C_a V_a}{C_b},\\quad \\text{pH} = -\\log[\\text{H}^+]',
    linkedLessonId: 'chem-11-2',
    defaultParams: { acidConc: 0.1, baseAddedMl: 12, isWeakAcid: 0 },
    paramBounds: {
      acidConc: { min: 0.05, max: 0.2, step: 0.01, unit: 'M', label: 'Nồng độ Acid (25 mL)' },
      baseAddedMl: { min: 0, max: 50, step: 0.5, unit: 'mL', label: 'Thể tích NaOH 0.1M đã nhỏ' },
      isWeakAcid: { min: 0, max: 1, step: 1, unit: '', label: 'Loại (0:HCl, 1:CH₃COOH)' }
    },
    presets: [
      { label: 'Trước điểm tương đương', description: 'Dung dịch vẫn trong suốt (pH < 7)', params: { acidConc: 0.1, baseAddedMl: 15, isWeakAcid: 0 } },
      { label: 'Tại điểm tương đương (25 mL)', description: 'Bước nhảy pH thẳng đứng', params: { acidConc: 0.1, baseAddedMl: 25, isWeakAcid: 0 } },
      { label: 'Chuẩn độ Acid yếu CH₃COOH', description: 'pH tại tương đương > 7 (vùng đệm trước đó)', params: { acidConc: 0.1, baseAddedMl: 25, isWeakAcid: 1 } }
    ]
  },
  {
    id: 'buffer_ph_2d',
    domainId: 'equilibrium_acidbase',
    grades: ['Lớp 11'],
    title: 'Dung Dịch Đệm & Cân Bằng Henderson–Hasselbalch',
    subtitle: 'Khả năng giữ ổn định pH khi thêm H⁺ hoặc OH⁻ nhờ cặp acid-base liên hợp HA/A⁻',
    formula: '\\text{pH} = \\text{p}K_a + \\log\\frac{[A^-]}{[HA]}',
    linkedLessonId: 'chem-chuyen-11-1',
    defaultParams: { pka: 4.76, ratioSaltAcid: 1.0, addedStrongMl: 0 },
    paramBounds: {
      pka: { min: 3.5, max: 9.25, step: 0.1, unit: '', label: 'Hằng số pK_a' },
      ratioSaltAcid: { min: 0.2, max: 5.0, step: 0.1, unit: '', label: 'Tỉ số [A⁻]/[HA]' },
      addedStrongMl: { min: -15, max: 15, step: 1, unit: 'mmol', label: 'Thêm HCl (-) / NaOH (+)' }
    },
    presets: [
      { label: 'Đệm Axetat tối ưu (pH=4.76)', description: '[CH₃COO⁻] = [CH₃COOH]', params: { pka: 4.76, ratioSaltAcid: 1.0, addedStrongMl: 0 } },
      { label: 'Đệm máu HCO₃⁻/H₂CO₃ (pH=7.4)', description: 'Giữ pH máu sinh lý ổn định', params: { pka: 6.1, ratioSaltAcid: 4.5, addedStrongMl: 0 } },
      { label: 'Thử thêm kiềm mạnh', description: 'pH chỉ nhích nhẹ nhờ lượng HA trung hòa', params: { pka: 4.76, ratioSaltAcid: 1.0, addedStrongMl: 8 } }
    ]
  },
  {
    id: 'galvanic_cell_2d',
    domainId: 'electro_inorganic',
    grades: ['Lớp 12'],
    title: 'Pin Điện Hóa Daniell Zn–Cu & Cầu Muối Ion',
    subtitle: 'Dòng electron chạy từ Anode (oxi hóa) sang Cathode (khử), cầu muối KCl cân bằng điện tích hai bán pin',
    formula: 'E^\\circ_{\\text{pin}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}},\\quad E = E^\\circ - \\frac{0.0592}{n}\\log Q',
    linkedLessonId: 'chem-12-4',
    defaultParams: { anodeMetal: 1, znConc: 1.0, cuConc: 1.0 },
    paramBounds: {
      anodeMetal: { min: 1, max: 3, step: 1, unit: '', label: 'Anode (1:Zn 2:Fe 3:Mg)' },
      znConc: { min: 0.05, max: 2.0, step: 0.05, unit: 'M', label: 'Nồng độ ion Anode' },
      cuConc: { min: 0.05, max: 2.0, step: 0.05, unit: 'M', label: 'Nồng độ Cu²⁺ Cathode' }
    },
    presets: [
      { label: 'Pin Daniell Chuẩn (1.10 V)', description: 'Zn | Zn²⁺(1M) || Cu²⁺(1M) | Cu', params: { anodeMetal: 1, znConc: 1.0, cuConc: 1.0 } },
      { label: 'Pin Mg – Cu (2.71 V)', description: 'Suất điện động chuẩn rất lớn', params: { anodeMetal: 3, znConc: 1.0, cuConc: 1.0 } },
      { label: 'Pin Fe – Cu (0.78 V)', description: 'Fe bị oxi hóa tạo Fe²⁺', params: { anodeMetal: 2, znConc: 1.0, cuConc: 1.0 } }
    ]
  },
  {
    id: 'electrolysis_faraday_2d',
    domainId: 'electro_inorganic',
    grades: ['Lớp 12'],
    title: 'Bình Điện Phân Dung Dịch & Định Luật Faraday',
    subtitle: 'Theo dõi kết tủa Cu bám lên Cathode, khí Cl₂/O₂ thoát ra tại Anode và tính khối lượng m = AIt/(nF)',
    formula: 'm = \\frac{A \\cdot I \\cdot t}{n \\cdot F},\\quad F = 96500\\text{ C/mol}',
    linkedLessonId: 'chem-12-5',
    defaultParams: { currentA: 5, timeMin: 16, electrolyteCode: 1 },
    paramBounds: {
      currentA: { min: 1, max: 12, step: 0.5, unit: 'A', label: 'Cường độ dòng điện I' },
      timeMin: { min: 2, max: 60, step: 2, unit: 'phút', label: 'Thời gian điện phân t' },
      electrolyteCode: { min: 1, max: 3, step: 1, unit: '', label: 'Dung dịch (1:CuSO₄ 2:NaCl 3:CuCl₂)' }
    },
    presets: [
      { label: 'Điện phân CuSO₄ (I=5A, 32 phút)', description: 'Cathode bám Cu đỏ, Anode sủi bọt khí O₂', params: { currentA: 5, timeMin: 32, electrolyteCode: 1 } },
      { label: 'Điện phân NaCl có màng ngăn', description: 'Sinh khí H₂ ở Cathode, Cl₂ ở Anode, dung dịch hóa kiềm NaOH', params: { currentA: 6, timeMin: 20, electrolyteCode: 2 } },
      { label: 'Điện phân CuCl₂', description: 'Cu bám Cathode, khí Cl₂ vàng lục ở Anode', params: { currentA: 4, timeMin: 24, electrolyteCode: 3 } }
    ]
  },
  {
    id: 'metal_activity_2d',
    domainId: 'electro_inorganic',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Dãy Hoạt Động Hóa Học Kim Loại & Đẩy Muối',
    subtitle: 'Thí nghiệm nhúng thanh kim loại (Zn, Fe, Cu, Mg) vào dung dịch muối hoặc HCl quan sát tốc độ bọt khí H₂ & đổi màu dung dịch',
    formula: '\\text{M} + \\text{Cu}^{2+} \\to \\text{M}^{2+} + \\text{Cu}\\downarrow',
    linkedLessonId: 'chem-9-3',
    defaultParams: { metalCode: 2, solutionCode: 2, acidConc: 1.5 },
    paramBounds: {
      metalCode: { min: 1, max: 4, step: 1, unit: '', label: 'Kim loại (1:Mg 2:Zn 3:Fe 4:Cu)' },
      solutionCode: { min: 1, max: 3, step: 1, unit: '', label: 'Dung dịch (1:HCl 2:CuSO₄ 3:AgNO₃)' },
      acidConc: { min: 0.5, max: 3.0, step: 0.25, unit: 'M', label: 'Nồng độ dung dịch' }
    },
    presets: [
      { label: 'Đinh sắt trong CuSO₄', description: 'Đồng đỏ bám ngoài đinh sắt, dung dịch xanh lam nhạt dần', params: { metalCode: 3, solutionCode: 2, acidConc: 1.0 } },
      { label: 'Mg tác dụng với HCl', description: 'Bọt khí H₂ thoát ra mãnh liệt', params: { metalCode: 1, solutionCode: 1, acidConc: 2.0 } },
      { label: 'Cu nhúng vào AgNO₃', description: 'Lớp bạc trắng sáng kết tinh, dung dịch hóa xanh lam', params: { metalCode: 4, solutionCode: 3, acidConc: 1.0 } }
    ]
  },
  {
    id: 'halogen_displacement_2d',
    domainId: 'electro_inorganic',
    grades: ['Lớp 10'],
    title: 'Tính Oxi Hóa Của Nhóm Halogen (F₂ > Cl₂ > Br₂ > I₂)',
    subtitle: 'Sục Cl₂ vào NaBr / NaI và tách lớp dung môi hữu cơ (hexan) quan sát sự biến đổi màu đặc trưng',
    formula: '\\text{Cl}_2 + 2\\text{Br}^- \\to 2\\text{Cl}^- + \\text{Br}_2',
    linkedLessonId: 'chem-10-7',
    defaultParams: { halogenAdded: 1, halideSalt: 2, shakeLevel: 50 },
    paramBounds: {
      halogenAdded: { min: 1, max: 3, step: 1, unit: '', label: 'Halogen thêm (1:Cl₂ 2:Br₂ 3:I₂)' },
      halideSalt: { min: 1, max: 3, step: 1, unit: '', label: 'Muối (1:NaCl 2:NaBr 3:KI)' },
      shakeLevel: { min: 0, max: 100, step: 10, unit: '%', label: 'Mức độ phản ứng' }
    },
    presets: [
      { label: 'Cl₂ đẩy Br₂ khỏi NaBr', description: 'Dung dịch chuyển vàng nâu, lớp hexan hóa da cam', params: { halogenAdded: 1, halideSalt: 2, shakeLevel: 80 } },
      { label: 'Cl₂ đẩy I₂ khỏi KI', description: 'I₂ tự do nhuộm hồ tinh bột xanh tím', params: { halogenAdded: 1, halideSalt: 3, shakeLevel: 90 } },
      { label: 'Br₂ vào NaCl (Không pư)', description: 'Brom yếu hơn Clo nên không đẩy được Cl⁻', params: { halogenAdded: 2, halideSalt: 1, shakeLevel: 60 } }
    ]
  },
  {
    id: 'haber_ammonia_2d',
    domainId: 'equilibrium_acidbase',
    grades: ['Lớp 11'],
    title: 'Tháp Tổng Hợp Amoniac (Quy Trình Haber–Bosch)',
    subtitle: 'Tối ưu hiệu suất N₂ + 3H₂ ⇌ 2NH₃ (ΔH = -92 kJ) theo nhiệt độ 400–550°C, áp suất 200 atm & xúc tác Fe',
    formula: '\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g),\\quad \\Delta H = -92\\text{ kJ}',
    linkedLessonId: 'chem-11-3',
    defaultParams: { tempC: 450, pressureAtm: 200, catalystActivity: 90 },
    paramBounds: {
      tempC: { min: 250, max: 650, step: 25, unit: '°C', label: 'Nhiệt độ lò' },
      pressureAtm: { min: 50, max: 350, step: 25, unit: 'atm', label: 'Áp suất nén' },
      catalystActivity: { min: 20, max: 100, step: 10, unit: '%', label: 'Hoạt tính xúc tác Fe' }
    },
    presets: [
      { label: 'Điểm tối ưu công nghiệp (450°C, 200 atm)', description: 'Cân bằng giữa tốc độ và hiệu suất', params: { tempC: 450, pressureAtm: 200, catalystActivity: 95 } },
      { label: 'Nhiệt độ quá cao (650°C)', description: 'Phản ứng nhanh nhưng hiệu suất cân bằng sụt giảm', params: { tempC: 650, pressureAtm: 200, catalystActivity: 95 } },
      { label: 'Áp suất cực đại (350 atm)', description: 'Chuyển mạnh sang NH₃ (giảm số mol khí từ 4 xuống 2)', params: { tempC: 425, pressureAtm: 350, catalystActivity: 95 } }
    ]
  },
  {
    id: 'contact_sulfuric_2d',
    domainId: 'equilibrium_acidbase',
    grades: ['Lớp 11'],
    title: 'Sản Xuất H₂SO₄ Bằng Phương Pháp Tiếp Xúc (V₂O₅)',
    subtitle: 'Quá trình 3 công đoạn: S/FeS₂ → SO₂ → SO₃ (xúc tác V₂O₅, 450°C) → Oleum H₂SO₄·nSO₃',
    formula: '2\\text{SO}_2 + \\text{O}_2 \\xrightleftharpoons[\\text{V}_2\\text{O}_5]{450^\\circ\\text{C}} 2\\text{SO}_3,\\quad \\Delta H = -198\\text{ kJ}',
    linkedLessonId: 'chem-11-4',
    defaultParams: { tempC: 450, o2Excess: 1.5, stages: 3 },
    paramBounds: {
      tempC: { min: 350, max: 600, step: 10, unit: '°C', label: 'Nhiệt độ tháp tiếp xúc' },
      o2Excess: { min: 0.5, max: 3.0, step: 0.1, unit: 'mol', label: 'Lượng O₂ dư' },
      stages: { min: 1, max: 4, step: 1, unit: 'tầng', label: 'Số tầng xúc tác V₂O₅' }
    },
    presets: [
      { label: '4 tầng V₂O₅ (Hiệu suất ~99.5%)', description: 'Chuẩn dây chuyền hiện đại kép 2 lần hấp thụ', params: { tempC: 450, o2Excess: 1.8, stages: 4 } },
      { label: '1 tầng xúc tác', description: 'Hiệu suất chuyển hóa SO₂ còn hạn chế', params: { tempC: 450, o2Excess: 1.0, stages: 1 } }
    ]
  },
  {
    id: 'redox_balancing_2d',
    domainId: 'electro_inorganic',
    grades: ['Lớp 10'],
    title: 'Cân Bằng Phản Ứng Oxi Hóa – Khử Theo Thăng Bằng Electron',
    subtitle: 'Theo dõi dòng electron nhường/nhận giữa chất khử và chất oxi hóa với kiểm chứng bảo toàn nguyên tố',
    formula: '\\sum n_{e\\text{ nhường}} = \\sum n_{e\\text{ nhận}}',
    linkedLessonId: 'chem-10-4',
    defaultParams: { rxnId: 1, acidRatio: 1, stepPhase: 4 },
    paramBounds: {
      rxnId: { min: 1, max: 4, step: 1, unit: '', label: 'Phản ứng (1:Cu+HNO₃ 2:Fe+H₂SO₄ 3:KMnO₄+HCl 4:Al+HNO₃)' },
      acidRatio: { min: 1, max: 2, step: 1, unit: '', label: 'Loại sản phẩm khử' },
      stepPhase: { min: 1, max: 4, step: 1, unit: 'bước', label: 'Bước thăng bằng e' }
    },
    presets: [
      { label: 'Cu + HNO₃ đặc/loãng', description: 'Cu nhường 2e, N⁺⁵ nhận 3e hoặc 1e', params: { rxnId: 1, acidRatio: 1, stepPhase: 4 } },
      { label: 'KMnO₄ + HCl đặc', description: 'Mn⁺⁷ nhận 5e, Cl⁻¹ nhường 1e tạo Cl₂', params: { rxnId: 3, acidRatio: 1, stepPhase: 4 } }
    ]
  },
  {
    id: 'hydrocarbon_isomers_2d',
    domainId: 'organic_polymer',
    grades: ['Lớp 11', 'Lớp 9'],
    title: 'Đồng Phân Cấu Tạo & Nhiệt Độ Sôi Hiđrocacbon',
    subtitle: 'So sánh mạch thẳng vs mạch nhánh (C₄H₁₀, C₅H₁₂, C₆H₁₄) ảnh hưởng đến diện tích tiếp xúc van der Waals',
    formula: 'C_nH_{2n+2},\\quad \\text{Mạch càng phân nhánh } \\Rightarrow T_{\\text{sôi}} \\text{ càng giảm}',
    linkedLessonId: 'chem-11-6',
    defaultParams: { carbonCount: 5, branchLevel: 0, bondType: 1 },
    paramBounds: {
      carbonCount: { min: 4, max: 7, step: 1, unit: 'C', label: 'Số nguyên tử Cacbon' },
      branchLevel: { min: 0, max: 2, step: 1, unit: 'nhánh', label: 'Mức độ phân nhánh' },
      bondType: { min: 1, max: 3, step: 1, unit: '', label: 'Bậc liên kết (1:Ankan 2:Anken 3:Ankin)' }
    },
    presets: [
      { label: 'n-Pentan (36.1°C)', description: 'Mạch không phân nhánh, tương tác van der Waals mạnh nhất', params: { carbonCount: 5, branchLevel: 0, bondType: 1 } },
      { label: 'Neopentan (9.5°C)', description: 'Hình cầu gọn, nhiệt độ sôi thấp nhất trong đồng phân C₅H₁₂', params: { carbonCount: 5, branchLevel: 2, bondType: 1 } }
    ]
  },
  {
    id: 'alkene_addition_2d',
    domainId: 'organic_polymer',
    grades: ['Lớp 11'],
    title: 'Cơ Chế Cộng Ái Điện Tử & Quy Tắc Markovnikov',
    subtitle: 'Phân tích cacbocation trung gian bậc cao bền hơn khi cộng HX vào anken bất đối xứng như propen',
    formula: '\\text{CH}_3-\\text{CH}=\\text{CH}_2 + \\text{HBr} \\to \\text{CH}_3-\\text{CHBr}-\\text{CH}_3\\text{ (Chính)}',
    linkedLessonId: 'chem-11-7',
    defaultParams: { reagentCode: 1, tempFactor: 25, peroxide: 0 },
    paramBounds: {
      reagentCode: { min: 1, max: 3, step: 1, unit: '', label: 'Tác nhân (1:HBr 2:H₂O/H⁺ 3:Br₂)' },
      tempFactor: { min: 0, max: 80, step: 5, unit: '°C', label: 'Nhiệt độ' },
      peroxide: { min: 0, max: 1, step: 1, unit: '', label: 'Hiệu ứng Peroxit (0/1)' }
    },
    presets: [
      { label: 'Cộng HBr theo Markovnikov', description: 'H vào C nhiều H hơn (~92% sản phẩm chính)', params: { reagentCode: 1, tempFactor: 25, peroxide: 0 } },
      { label: 'Cộng Br₂ mất màu nước brom', description: 'Tạo dẫn xuất đibrom không màu', params: { reagentCode: 3, tempFactor: 25, peroxide: 0 } }
    ]
  },
  {
    id: 'benzene_substitution_2d',
    domainId: 'organic_polymer',
    grades: ['Lớp 11'],
    title: 'Hệ Liên Hợp Thơm Benzen & Quy Luật Thế Vòng Thơm',
    subtitle: 'Ảnh hưởng của nhóm thế loại I (-CH₃, -OH, -NH₂ định hướng o/p) và loại II (-NO₂, -COOH định hướng m)',
    formula: '\\text{Nhóm đẩy e } \\to \\text{ortho, para} \\quad | \\quad \\text{Nhóm hút e } \\to \\text{meta}',
    linkedLessonId: 'chem-11-8',
    defaultParams: { substituent: 1, electrophile: 1, stepFrame: 100 },
    paramBounds: {
      substituent: { min: 1, max: 4, step: 1, unit: '', label: 'Nhóm sẵn có (1:H 2:CH₃ 3:OH 4:NO₂)' },
      electrophile: { min: 1, max: 2, step: 1, unit: '', label: 'Tác nhân (1:Br₂/FeBr₃ 2:HNO₃/H₂SO₄)' },
      stepFrame: { min: 0, max: 100, step: 10, unit: '%', label: 'Tiến độ cơ chế σ-phức' }
    },
    presets: [
      { label: 'Toluen + HNO₃ (Định hướng o/p)', description: 'Nhóm -CH₃ đẩy e làm vòng hoạt hóa mạnh ở ortho & para', params: { substituent: 2, electrophile: 2, stepFrame: 100 } },
      { label: 'Nitrobenzen (Định hướng meta)', description: 'Nhóm -NO₂ rút e phản hoạt hóa vòng, ưu tiên thế meta', params: { substituent: 4, electrophile: 1, stepFrame: 100 } }
    ]
  },
  {
    id: 'esterification_2d',
    domainId: 'organic_polymer',
    grades: ['Lớp 12', 'Lớp 9'],
    title: 'Phản Ứng Este Hóa Fischer & Chiết Tách Este',
    subtitle: 'Cân bằng CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O dưới tác dụng xúc tác H₂SO₄ đặc hút nước',
    formula: 'K_c = \\frac{[\\text{Este}][\\text{H}_2\\text{O}]}{[\\text{Acid}][\\text{Ancol}]} \\approx 4',
    linkedLessonId: 'chem-12-1',
    defaultParams: { acidMol: 1.0, alcoholMol: 2.0, catalystH2SO4: 1 },
    paramBounds: {
      acidMol: { min: 0.5, max: 3.0, step: 0.5, unit: 'mol', label: 'Số mol Acid CH₃COOH' },
      alcoholMol: { min: 0.5, max: 4.0, step: 0.5, unit: 'mol', label: 'Số mol Ancol C₂H₅OH' },
      catalystH2SO4: { min: 0, max: 1, step: 1, unit: '', label: 'H₂SO₄ đặc hút nước (0/1)' }
    },
    presets: [
      { label: 'Tỉ lệ 1:1 (Hiệu suất ~66.7%)', description: 'Cân bằng đạt 2/3 lượng ban đầu', params: { acidMol: 1.0, alcoholMol: 1.0, catalystH2SO4: 1 } },
      { label: 'Dư Ancol gấp 3 (Hiệu suất ~90%)', description: 'Chuyển dịch cân bằng mạnh về phía tạo este', params: { acidMol: 1.0, alcoholMol: 3.0, catalystH2SO4: 1 } }
    ]
  },
  {
    id: 'soap_micelle_2d',
    domainId: 'organic_polymer',
    grades: ['Lớp 12'],
    title: 'Cấu Trúc Hạt Mixen & Cơ Chế Giặt Rửa Xà Phòng',
    subtitle: 'Đầu ưa nước (-COO⁻Na⁺) hướng ra ngoài nước, đuôi kị nước (-R hidrocacbon) chui vào giọt dầu mỡ nhũ hóa vết bẩn',
    formula: 'R\\text{COONa}: \\text{Đuôi kị nước } R- + \\text{Đầu ưa nước } -\\text{COO}^-',
    linkedLessonId: 'chem-12-1',
    defaultParams: { soapConc: 65, waterHardness: 0, agitation: 60 },
    paramBounds: {
      soapConc: { min: 10, max: 100, step: 5, unit: '%', label: 'Nồng độ chất giặt rửa' },
      waterHardness: { min: 0, max: 1, step: 1, unit: '', label: 'Nước cứng Ca²⁺/Mg²⁺ (0/1)' },
      agitation: { min: 10, max: 100, step: 10, unit: '%', label: 'Khuấy trộn cơ học' }
    },
    presets: [
      { label: 'Nước mềm + Xà phòng đủ CMC', description: 'Hình thành mixen bao bọc đánh bật giọt dầu', params: { soapConc: 75, waterHardness: 0, agitation: 70 } },
      { label: 'Nước cứng Ca²⁺/Mg²⁺', description: 'Xà phòng tạo kết tủa (RCOO)₂Ca làm giảm hiệu quả', params: { soapConc: 75, waterHardness: 1, agitation: 70 } }
    ]
  },
  {
    id: 'carbohydrate_ring_2d',
    domainId: 'organic_polymer',
    grades: ['Lớp 12'],
    title: 'Cân Bằng Mở Vòng – Đóng Vòng Glucozơ & Phản Ứng Tráng Bạc',
    subtitle: 'Chuyển hóa giữa α-glucozơ, dạng mạch hở (-CHO) và β-glucozơ cùng phản ứng [Ag(NH₃)₂]⁺ tạo gương bạc',
    formula: '\\text{C}_6\\text{H}_{12}\\text{O}_6 + 2[\\text{Ag}(\\text{NH}_3)_2]\\text{OH} \\to \\text{RCOONH}_4 + 2\\text{Ag}\\downarrow',
    linkedLessonId: 'chem-12-2',
    defaultParams: { sugarType: 1, phLevel: 7, silverTest: 1 },
    paramBounds: {
      sugarType: { min: 1, max: 3, step: 1, unit: '', label: 'Đường (1:Glucozơ 2:Fructozơ 3:Saccarozơ)' },
      phLevel: { min: 3, max: 11, step: 0.5, unit: '', label: 'Môi trường pH' },
      silverTest: { min: 0, max: 1, step: 1, unit: '', label: 'Thuốc thử Tollens (0/1)' }
    },
    presets: [
      { label: 'Glucozơ tráng bạc (pH=10)', description: '1 mol Glucozơ tạo 2 mol Ag kết tủa sáng', params: { sugarType: 1, phLevel: 10, silverTest: 1 } },
      { label: 'Saccarozơ (Không tráng bạc)', description: 'Không còn nhóm -OH hemiaxetal tự do', params: { sugarType: 3, phLevel: 9, silverTest: 1 } }
    ]
  },
  {
    id: 'amino_acid_zwitterion_2d',
    domainId: 'organic_polymer',
    grades: ['Lớp 12'],
    title: 'Tính Lưỡng Tính Amino Acid & Điểm Đẳng Điện pI',
    subtitle: 'Quan sát dạng cation (pH < pI), ion lưỡng cực (pH = pI) và anion (pH > pI) di chuyển trong điện trường điện di',
    formula: '\\text{p}I = \\frac{\\text{p}K_{a1} + \\text{p}K_{a2}}{2}',
    linkedLessonId: 'chem-12-3',
    defaultParams: { phSolution: 6.0, aminoAcidId: 1, eFieldOn: 1 },
    paramBounds: {
      phSolution: { min: 1, max: 13, step: 0.5, unit: '', label: 'pH dung dịch đệm' },
      aminoAcidId: { min: 1, max: 3, step: 1, unit: '', label: 'Axit (1:Gly pI=6 2:Glu pI=3.2 3:Lys pI=9.7)' },
      eFieldOn: { min: 0, max: 1, step: 1, unit: '', label: 'Điện trường điện di (0/1)' }
    },
    presets: [
      { label: 'Glyxin tại pH = 6.0 (pI)', description: 'Dạng ion lưỡng cực đứng yên giữa hai điện cực', params: { phSolution: 6.0, aminoAcidId: 1, eFieldOn: 1 } },
      { label: 'Axit Glutamic ở pH = 7', description: 'Tích điện âm chạy về cực dương (Anode)', params: { phSolution: 7.0, aminoAcidId: 2, eFieldOn: 1 } },
      { label: 'Lysin ở pH = 7', description: 'Tích điện dương chạy về cực âm (Cathode)', params: { phSolution: 7.0, aminoAcidId: 3, eFieldOn: 1 } }
    ]
  },
  {
    id: 'polymerization_2d',
    domainId: 'organic_polymer',
    grades: ['Lớp 12'],
    title: 'Phản Ứng Trùng Hợp & Trùng Ngưng Tạo Polime',
    subtitle: 'Theo dõi quá trình mở nối đôi tạo mạch PE/PVC hoặc tách phân tử nhỏ H₂O tạo tơ Nilon-6,6',
    formula: 'n\\,\\text{CH}_2=\\text{CH}_2 \\xrightarrow{t^\\circ, p, \\text{xt}} (-\\text{CH}_2-\\text{CH}_2-)_n',
    linkedLessonId: 'chem-12-4b',
    defaultParams: { polymerMode: 1, monomerCount: 14, crosslink: 20 },
    paramBounds: {
      polymerMode: { min: 1, max: 3, step: 1, unit: '', label: 'Loại (1:Trùng hợp PE 2:Trùng ngưng Nilon 3:Lưu hóa cao su)' },
      monomerCount: { min: 6, max: 24, step: 2, unit: 'mắt xích', label: 'Độ dài mạch n' },
      crosslink: { min: 0, max: 100, step: 10, unit: '%', label: 'Mức độ khâu mạch cầu S' }
    },
    presets: [
      { label: 'Trùng hợp Etilen -> PE', description: 'Mạch thẳng nhiệt dẻo mềm dẻo', params: { polymerMode: 1, monomerCount: 16, crosslink: 0 } },
      { label: 'Lưu hóa cao su buna', description: 'Cầu nối -S-S- tạo mạng không gian đàn hồi cao', params: { polymerMode: 3, monomerCount: 14, crosslink: 80 } }
    ]
  },
  {
    id: 'corrosion_protection_2d',
    domainId: 'electro_inorganic',
    grades: ['Lớp 12'],
    title: 'Ăn Mòn Điện Hóa Thép & Bảo Vệ Catot Bằng Kẽm (Hy Sinh)',
    subtitle: 'Pin cục bộ Fe–C trong giọt nước ẩm vs khi gắn thêm thanh Zn (Anode hy sinh bảo vệ vỏ tàu)',
    formula: '\\text{Anode (Zn)}: \\text{Zn} \\to \\text{Zn}^{2+} + 2e\\quad (\\text{Fe được bảo vệ})',
    linkedLessonId: 'chem-12-6',
    defaultParams: { zincAttached: 0, salinity: 3.5, oxygenLevel: 80 },
    paramBounds: {
      zincAttached: { min: 0, max: 1, step: 1, unit: '', label: 'Gắn thanh Zn bảo vệ (0/1)' },
      salinity: { min: 0.5, max: 5.0, step: 0.5, unit: '%', label: 'Độ mặn NaCl điện li' },
      oxygenLevel: { min: 10, max: 100, step: 10, unit: '%', label: 'O₂ hòa tan' }
    },
    presets: [
      { label: 'Vỏ thép không bảo vệ', description: 'Fe bị oxi hóa nhanh tại cặp pin cục bộ Fe-C, tạo gỉ sắt nâu đỏ', params: { zincAttached: 0, salinity: 3.5, oxygenLevel: 85 } },
      { label: 'Gắn Anode Hy Sinh Zn', description: 'Kẽm nhường e thay sắt -> thép hoàn toàn nguyên vẹn!', params: { zincAttached: 1, salinity: 3.5, oxygenLevel: 85 } }
    ]
  },
  {
    id: 'colligative_boiling_2d',
    domainId: 'equilibrium_acidbase',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Tính Chất Dung Dịch: Tăng Nhiệt Độ Sôi & Hạ Nhiệt Độ Đông Đặc',
    subtitle: 'Hiệu ứng hạt chất tan không bay hơi (NaCl i=2, CaCl₂ i=3) cản trở phân tử dung môi thoát hơi',
    formula: '\\Delta T_b = i\\cdot K_b \\cdot m,\\quad \\Delta T_f = i\\cdot K_f \\cdot m',
    linkedLessonId: 'chem-chuyen-11-2',
    defaultParams: { molality: 1.5, vantHoffI: 2, tempCurrent: 99 },
    paramBounds: {
      molality: { min: 0, max: 4.0, step: 0.25, unit: 'mol/kg', label: 'Nồng độ molan m' },
      vantHoffI: { min: 1, max: 3, step: 1, unit: '', label: 'Hệ số Van \'t Hoff i (1:Đường 2:NaCl 3:CaCl₂)' },
      tempCurrent: { min: -10, max: 108, step: 1, unit: '°C', label: 'Nhiệt độ gia nhiệt' }
    },
    presets: [
      { label: 'Nước nguyên chất (0°C / 100°C)', description: 'm = 0 mol/kg', params: { molality: 0, vantHoffI: 1, tempCurrent: 100 } },
      { label: 'Rải muối CaCl₂ chống đóng băng', description: 'i = 3 làm nhiệt độ đông đặc hạ mạnh dưới 0°C', params: { molality: 2.5, vantHoffI: 3, tempCurrent: -6 } }
    ]
  },
  {
    id: 'stoichiometry_gas_2d',
    domainId: 'kinetics_thermo',
    grades: ['Lớp 9', 'Lớp 10'],
    title: 'Bài Toán Lượng Chất Hết – Dư & Khí Chuẩn ĐKC (24.79 L/mol)',
    subtitle: 'Cân đo mol phản ứng Zn + 2HCl -> ZnCl₂ + H₂↑ trên piston thu khí theo chuẩn 25°C, 1 bar (GDPT 2018)',
    formula: 'n_{\\text{khí}} = \\frac{V}{24{,}79}\\text{ (25°C, 1 bar)},\\quad m = n \\cdot M',
    linkedLessonId: 'chem-9-1',
    defaultParams: { molZn: 0.2, molHCl: 0.3, gasStd: 1 },
    paramBounds: {
      molZn: { min: 0.05, max: 0.5, step: 0.05, unit: 'mol', label: 'Số mol Zn ban đầu' },
      molHCl: { min: 0.1, max: 1.2, step: 0.05, unit: 'mol', label: 'Số mol HCl ban đầu' },
      gasStd: { min: 1, max: 2, step: 1, unit: '', label: 'Chuẩn (1:ĐKC 24.79L | 2:ĐKTC 22.4L)' }
    },
    presets: [
      { label: 'Vừa đủ (0.2 Zn + 0.4 HCl)', description: 'Cả hai hết hoàn toàn, thu 0.2 mol H₂', params: { molZn: 0.2, molHCl: 0.4, gasStd: 1 } },
      { label: 'Dư Zn (0.3 Zn + 0.4 HCl)', description: 'Tính thể tích H₂ theo chất hết HCl', params: { molZn: 0.3, molHCl: 0.4, gasStd: 1 } }
    ]
  },
  {
    id: 'carbonyl_alcohol_2d',
    domainId: 'organic_polymer',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Ancol – Phenol – Anđehit: Tráng Bạc Tollens, Cu(OH)₂ & Iodoform',
    subtitle: 'Thí nghiệm phân biệt Etanol, Glixerol (phức xanh lam Cu(OH)₂), Phenol (↓ trắng Br₂) và Anđehit fomic/axetic (gương Ag)',
    formula: '\\text{RCHO} + 2[\\text{Ag}(\\text{NH}_3)_2]\\text{OH} \\xrightarrow{t^\\circ} \\text{RCOONH}_4 + 2\\text{Ag}\\downarrow + 3\\text{NH}_3 + \\text{H}_2\\text{O}',
    linkedLessonId: 'chem-11-9',
    defaultParams: { compoundId: 3, reagentId: 1, tempC: 65 },
    paramBounds: {
      compoundId: { min: 1, max: 4, step: 1, unit: '', label: 'Chất hữu cơ (1:C₂H₅OH 2:Glixerol 3:CH₃CHO 4:Phenol)' },
      reagentId: { min: 1, max: 4, step: 1, unit: '', label: 'Thuốc thử (1:Tollens Ag 2:Cu(OH)₂ 3:Nước Br₂ 4:I₂/NaOH)' },
      tempC: { min: 20, max: 90, step: 5, unit: '°C', label: 'Nhiệt độ đun cách thủy' }
    },
    presets: [
      { label: 'CH₃CHO tráng bạc Tollens', description: 'Kết tủa Ag trắng sáng bám thành ống nghiệm', params: { compoundId: 3, reagentId: 1, tempC: 70 } },
      { label: 'Glixerol + Cu(OH)₂', description: 'Tạo dung dịch phức đồng(II) glixerat xanh lam thẫm', params: { compoundId: 2, reagentId: 2, tempC: 25 } },
      { label: 'Phenol + Nước Brom', description: 'Xuất hiện kết tủa trắng 2,4,6-tribromophenol ngay lập tức', params: { compoundId: 4, reagentId: 3, tempC: 25 } },
      { label: 'Phản ứng Iodoform (CHI₃)', description: 'Kết tủa vàng chanh iodoform đặc trưng nhóm CH₃CO- / CH₃CH(OH)-', params: { compoundId: 3, reagentId: 4, tempC: 55 } }
    ]
  },
  {
    id: 'qualitative_ion_2d',
    domainId: 'electro_inorganic',
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    title: 'Nhận Biết Ion Vô Cơ & Tích Số Tan Kết Tủa (AgX, BaSO₄, Fe²⁺/³⁺, Al³⁺)',
    subtitle: 'Nhỏ thuốc thử AgNO₃, BaCl₂, NaOH/NH₃ dư vào ống nghiệm quan sát màu kết tủa, tan lưỡng tính và tạo phức [Cu(NH₃)₄]²⁺',
    formula: '\\text{Ag}^+ + \\text{Cl}^- \\to \\text{AgCl}\\downarrow\\text{ (trắng)}\\quad |\\quad \\text{Al(OH)}_3 + \\text{OH}^- \\to [\\text{Al(OH)}_4]^-',
    linkedLessonId: 'chem-10-20',
    defaultParams: { ionCode: 1, reagentDrops: 70, excessBase: 0 },
    paramBounds: {
      ionCode: { min: 1, max: 6, step: 1, unit: '', label: 'Ion mẫu (1:Cl⁻/Br⁻/I⁻ 2:SO₄²⁻ 3:Fe³⁺ 4:Fe²⁺ 5:Cu²⁺ 6:Al³⁺)' },
      reagentDrops: { min: 0, max: 100, step: 5, unit: '%', label: 'Lượng thuốc thử nhỏ vào' },
      excessBase: { min: 0, max: 1, step: 1, unit: '', label: 'Thêm kiềm / NH₃ dư (0/1)' }
    },
    presets: [
      { label: 'Phân biệt Cl⁻ / Br⁻ / I⁻ bằng AgNO₃', description: 'AgCl trắng, AgBr vàng nhạt, AgI vàng đậm', params: { ionCode: 1, reagentDrops: 80, excessBase: 0 } },
      { label: 'Cu²⁺ + NH₃ dư -> [Cu(NH₃)₄]²⁺', description: 'Kết tủa xanh lơ tan tạo phức xanh thẫm', params: { ionCode: 5, reagentDrops: 75, excessBase: 1 } },
      { label: 'Al³⁺ lưỡng tính trong NaOH dư', description: 'Kết tủa keo trắng Al(OH)₃ sinh ra rồi tan hết', params: { ionCode: 6, reagentDrops: 75, excessBase: 1 } }
    ]
  },
  {
    id: 'metallurgy_furnace_2d',
    domainId: 'electro_inorganic',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Lò Cao Luyện Gang – Thép & Phản Ứng Nhiệt Nhôm (Al + Fe₂O₃)',
    subtitle: 'Khảo sát phân tầng nhiệt độ lò cao (C → CO₂ → CO khử Fe₂O₃ thành gang lỏng) và phản ứng tỏa nhiệt mạnh nhiệt nhôm 2500°C',
    formula: '\\text{Fe}_2\\text{O}_3 + 3\\text{CO} \\xrightarrow{t^\\circ} 2\\text{Fe} + 3\\text{CO}_2\\quad |\\quad 2\\text{Al} + \\text{Fe}_2\\text{O}_3 \\xrightarrow{t^\\circ} \\text{Al}_2\\text{O}_3 + 2\\text{Fe}',
    linkedLessonId: 'chem-9-2',
    defaultParams: { processMode: 1, blastTemp: 1550, oxygenBlast: 75 },
    paramBounds: {
      processMode: { min: 1, max: 2, step: 1, unit: '', label: 'Quy trình (1:Lò cao Gang-Thép 2:Nhiệt nhôm Al+Fe₂O₃)' },
      blastTemp: { min: 600, max: 2400, step: 50, unit: '°C', label: 'Nhiệt độ vùng phản ứng' },
      oxygenBlast: { min: 20, max: 100, step: 5, unit: '%', label: 'Lưu lượng khí O₂ / Xung kích hoạt' }
    },
    presets: [
      { label: 'Lò cao luyện Gang lỏng (1600°C)', description: 'Than cốc cháy tạo CO khử quặng Hematit và đá vôi tạo xỉ CaSiO₃', params: { processMode: 1, blastTemp: 1600, oxygenBlast: 80 } },
      { label: 'Phản ứng Nhiệt nhôm (2200°C)', description: 'Sắt nóng chảy rực sáng dùng hàn đường ray xe lửa', params: { processMode: 2, blastTemp: 2200, oxygenBlast: 95 } }
    ]
  },
  {
    id: 'states_of_matter_2d',
    domainId: 'kinetics_thermo',
    grades: ['Lớp 6', 'Lớp 8'],
    title: 'Ba Thể Của Chất (Rắn – Lỏng – Khí), Chuyển Thể & Thành Phần Không Khí (21% O₂)',
    subtitle: 'Điều chỉnh nhiệt độ từ -20°C đến 130°C để quan sát phân tử chuyển từ mạng rắn sang lỏng, sôi hóa hơi và thử tàn đóm với khí O₂',
    formula: '\\text{Rắn } (<0^\\circ\\text{C}) \\rightleftharpoons \\text{Lỏng } (0-100^\\circ\\text{C}) \\rightleftharpoons \\text{Khí } (>100^\\circ\\text{C})',
    linkedLessonId: 'chem-6-b1',
    defaultParams: { tempC: 25, airMixMode: 0, pressureAtm: 1 },
    paramBounds: {
      tempC: { min: -25, max: 140, step: 5, unit: '°C', label: 'Nhiệt độ khối chất' },
      airMixMode: { min: 0, max: 1, step: 1, unit: '', label: 'Chế độ (0:Ba thể Rắn-Lỏng-Khí / 1:Không khí 21% O₂)' },
      pressureAtm: { min: 1, max: 3, step: 0.5, unit: 'bar', label: 'Áp suất nén xi-lanh' }
    },
    presets: [
      { label: 'Thể rắn (−15°C · Nước đá)', description: 'Các hạt xếp khít trật tự và rung tại chỗ', params: { tempC: -15, airMixMode: 0, pressureAtm: 1 } },
      { label: 'Thể lỏng (25°C · Nước lỏng)', description: 'Các phân tử trượt linh hoạt lên nhau', params: { tempC: 25, airMixMode: 0, pressureAtm: 1 } },
      { label: 'Thể khí (120°C · Hơi nước)', description: 'Hạt bay tự do tốc độ cao khắp bình', params: { tempC: 120, airMixMode: 0, pressureAtm: 1 } },
      { label: 'Biểu đồ Không khí 78% N₂ + 21% O₂', description: 'Khí O₂ duy trì sự cháy bùng que đóm', params: { tempC: 25, airMixMode: 1, pressureAtm: 1 } }
    ]
  },
  {
    id: 'mixture_separation_2d',
    domainId: 'bonding_structure',
    grades: ['Lớp 6', 'Lớp 7'],
    title: 'Phân Loại Hỗn Hợp & 4 Phương Pháp Tách Chất (Lọc – Cô Cạn – Chiết – Nam Châm)',
    subtitle: 'Trực quan hóa quá trình lọc cát trên phễu giấy, đun cô cạn thu muối, mở khóa phễu chiết dầu–nước và tách sắt bằng nam châm',
    formula: '\\text{Lọc (rắn không tan)} \\cdot \\text{Cô cạn (rắn tan)} \\cdot \\text{Chiết (2 lớp lỏng)}',
    linkedLessonId: 'chem-6-b2',
    defaultParams: { methodId: 1, progressPct: 65, heatLevel: 50 },
    paramBounds: {
      methodId: { min: 1, max: 4, step: 1, unit: '', label: 'Phương pháp (1:Lọc 2:Cô cạn 3:Chiết dầu-nước 4:Nam châm Fe+S)' },
      progressPct: { min: 0, max: 100, step: 5, unit: '%', label: 'Tiến trình tách chất' },
      heatLevel: { min: 0, max: 100, step: 10, unit: '%', label: 'Cường độ đun / Từ lực' }
    },
    presets: [
      { label: '1. Lọc nước lẫn cát qua phễu giấy', description: 'Cát giữ lại trên giấy lọc, nước trong chảy xuống bình', params: { methodId: 1, progressPct: 75, heatLevel: 50 } },
      { label: '2. Cô cạn nước muối trên bát sứ', description: 'Hơi nước bay đi hết, còn lại tinh thể muối trắng', params: { methodId: 2, progressPct: 80, heatLevel: 85 } },
      { label: '3. Phễu chiết tách Dầu ăn & Nước', description: 'Nước nặng hơn ở dưới chảy ra trước, dầu ăn nổi giữ lại', params: { methodId: 3, progressPct: 60, heatLevel: 40 } },
      { label: '4. Nam châm tách bột Sắt (Fe) khỏi Lưu huỳnh (S)', description: 'Sắt bị nam châm hút sạch lên trên', params: { methodId: 4, progressPct: 75, heatLevel: 80 } }
    ]
  },
  {
    id: 'bohr_shells_2d',
    domainId: 'atomic_periodic',
    grades: ['Lớp 7', 'Lớp 8', 'Lớp 10'],
    title: 'Mô Hình Nguyên Tử Bohr (2-8-8-2), Bảng Tuần Hoàn & Liên Kết Ion – Cộng Hóa Trị',
    subtitle: 'Chọn nguyên tố Z = 1..20 quan sát số proton hạt nhân, xếp lớp vỏ electron và mô phỏng cho-nhận NaCl vs góp chung H₂O',
    formula: 'Z = p = e \\quad|\\quad \\text{Lớp K(2) – L(8) – M(8) – N(2)} \\quad|\\quad x\\cdot a = y\\cdot b',
    linkedLessonId: 'chem-7-b1',
    defaultParams: { atomicZ: 11, bondDemoMode: 0, electronAnim: 1 },
    paramBounds: {
      atomicZ: { min: 1, max: 20, step: 1, unit: 'p', label: 'Số hiệu nguyên tử Z (1:H → 20:Ca)' },
      bondDemoMode: { min: 0, max: 2, step: 1, unit: '', label: 'Chế độ (0:Vỏ Bohr 1:LK Ion NaCl 2:LK CHT H₂O)' },
      electronAnim: { min: 0, max: 1, step: 1, unit: '', label: 'Quay electron (0:Dừng / 1:Chạy)' }
    },
    presets: [
      { label: 'Sodium Na (Z=11 · 2-8-1)', description: 'Kim loại kiềm dễ nhường 1e lớp ngoài cùng', params: { atomicZ: 11, bondDemoMode: 0, electronAnim: 1 } },
      { label: 'Liên kết Ion NaCl (Cho–nhận 1e)', description: 'Na nhường 1e cho Cl tạo Na⁺ hút Cl⁻', params: { atomicZ: 11, bondDemoMode: 1, electronAnim: 1 } },
      { label: 'Liên kết Cộng hóa trị H₂O (Góp chung)', description: 'Oxy và 2 Hydro dùng chung 2 cặp electron bền vững', params: { atomicZ: 8, bondDemoMode: 2, electronAnim: 1 } }
    ]
  },
  {
    id: 'acid_base_oxide_2d',
    domainId: 'equilibrium_acidbase',
    grades: ['Lớp 8', 'Lớp 9', 'Lớp 11'],
    title: 'Thang pH (0–14), Chất Chỉ Thị (Quỳ Tím – Phenolphthalein) & Acid–Base–Oxide–Muối',
    subtitle: 'Nhúng giấy quỳ tím và nhỏ phenolphthalein vào từng mẫu HCl, Giấm, Nước tinh khiết, NaOH và quan sát phản ứng trung hòa',
    formula: '\\text{pH} < 7\\text{ (Acid: Quỳ đỏ)} \\cdot \\text{pH} = 7\\text{ (Trung tính)} \\cdot \\text{pH} > 7\\text{ (Base: Quỳ xanh, Phenol hồng)}',
    linkedLessonId: 'chem-8-b2',
    defaultParams: { samplePh: 2.0, indicatorType: 1, addZnRibbon: 0 },
    paramBounds: {
      samplePh: { min: 1.0, max: 13.5, step: 0.5, unit: 'pH', label: 'Độ pH dung dịch mẫu' },
      indicatorType: { min: 1, max: 3, step: 1, unit: '', label: 'Chỉ thị (1:Quỳ tím 2:Phenolphthalein 3:Bắp cải tím)' },
      addZnRibbon: { min: 0, max: 1, step: 1, unit: '', label: 'Thả viên Kẽm Zn kiểm tra khí H₂ (0/1)' }
    },
    presets: [
      { label: 'Acid HCl (pH = 1.5 · Quỳ ĐỎ)', description: 'Thả kẽm thấy bọt khí H₂ thoát ra mạnh', params: { samplePh: 1.5, indicatorType: 1, addZnRibbon: 1 } },
      { label: 'Nước cất trung tính (pH = 7.0)', description: 'Quỳ giữ nguyên tím, phenolphthalein không màu', params: { samplePh: 7.0, indicatorType: 1, addZnRibbon: 0 } },
      { label: 'Dung dịch Kiềm NaOH (pH = 12.5)', description: 'Quỳ hóa XANH, Phenolphthalein hóa HỒNG cánh sen', params: { samplePh: 12.5, indicatorType: 2, addZnRibbon: 0 } }
    ]
  },
  {
    id: 'oxygen_combustion_2d',
    domainId: 'kinetics_thermo',
    grades: ['Lớp 6', 'Lớp 8'],
    title: 'Khí Oxygen (O₂), Sự Cháy Trong Không Khí & Phản Ứng Khử CuO Bằng H₂',
    subtitle: 'Thay đổi nồng độ O₂ và nhiệt độ kích hoạt để quan sát tàn đóm bùng cháy, dây sắt cháy sáng rực và khử oxit đồng bằng H₂',
    formula: '3\\text{Fe} + 2\\text{O}_2 \\xrightarrow{t^\\circ} \\text{Fe}_3\\text{O}_4 \\quad|\\quad \\text{H}_2 + \\text{CuO} \\xrightarrow{t^\\circ} \\text{Cu} + \\text{H}_2\\text{O}',
    linkedLessonId: 'chem-2006-8-4',
    defaultParams: { o2Concentration: 95, fuelType: 1, ignitionTemp: 550 },
    paramBounds: {
      o2Concentration: { min: 10, max: 100, step: 5, unit: '%', label: 'Nồng độ O₂ trong bình' },
      fuelType: { min: 1, max: 3, step: 1, unit: '', label: 'Thí nghiệm (1:Tàn đóm 2:Đốt Fe 3:Khử CuO)' },
      ignitionTemp: { min: 200, max: 900, step: 50, unit: '°C', label: 'Nhiệt độ mồi cháy' }
    },
    presets: [
      { label: 'Bình O₂ tinh khiết (95%): Bùng cháy!', description: 'Que đóm còn tàn hồng đưa vào bình O₂ bùng thành ngọn lửa', params: { o2Concentration: 95, fuelType: 1, ignitionTemp: 550 } },
      { label: 'Đốt dây Sắt Fe tạo hoa lửa', description: 'Tạo oxit sắt từ Fe₃O₄ màu nâu đen', params: { o2Concentration: 95, fuelType: 2, ignitionTemp: 750 } },
      { label: 'Khí H₂ khử CuO đen thành Đồng đỏ', description: 'Phản ứng thế/khử đặc trưng của Hydro', params: { o2Concentration: 80, fuelType: 3, ignitionTemp: 600 } }
    ]
  },
  {
    id: 'mass_conservation_2d',
    domainId: 'kinetics_thermo',
    grades: ['Lớp 8'],
    title: 'Định Luật Bảo Toàn Khối Lượng & Cân Bằng Phương Trình Hóa Học',
    subtitle: 'So sánh cân điện tử khi phản ứng trong bình kín (Σm_đầu = Σm_sau) và bình hở có khí thoát ra ngoài',
    formula: '\\sum m_{\\text{tham gia}} = \\sum m_{\\text{sản phẩm}}',
    linkedLessonId: 'chem-8-b1',
    defaultParams: { massReactantA: 20.8, massReactantB: 14.2, isClosedSystem: 1, reactionProgress: 80 },
    paramBounds: {
      massReactantA: { min: 5, max: 50, step: 1, unit: 'g', label: 'Khối lượng chất A' },
      massReactantB: { min: 5, max: 50, step: 1, unit: 'g', label: 'Khối lượng chất B' },
      isClosedSystem: { min: 0, max: 1, step: 1, unit: '', label: 'Hệ bình (1:Kín / 0:Hở thoát khí)' },
      reactionProgress: { min: 0, max: 100, step: 20, unit: '%', label: 'Tiến độ phản ứng' }
    },
    presets: [
      { label: 'Bình kín BaCl₂ + Na₂SO₄', description: 'Cân giữ nguyên 35.0 g dù tạo kết tủa trắng', params: { massReactantA: 20.8, massReactantB: 14.2, isClosedSystem: 1, reactionProgress: 80 } },
      { label: 'Bình hở CaCO₃ + HCl thoát CO₂', description: 'Khối lượng trên cân giảm đúng bằng khối lượng khí CO₂ bay đi', params: { massReactantA: 20, massReactantB: 16, isClosedSystem: 0, reactionProgress: 80 } }
    ]
  },
  {
    id: 'solution_solubility_2d',
    domainId: 'equilibrium_acidbase',
    grades: ['Lớp 8'],
    title: 'Dung Dịch Bão Hòa, Độ Tan S(t°C) & Nồng Độ C%, C_M',
    subtitle: 'Điều chỉnh lượng chất tan, nước và nhiệt độ để quan sát điểm bão hòa trên đồ thị độ tan và tinh thể kết tinh dư',
    formula: 'S = \\frac{m_{\\text{ct max}}}{m_{\\text{H}_2\\text{O}}}\\cdot 100 \\quad|\\quad C\\% = \\frac{m_{\\text{ct}}}{m_{\\text{dd}}}\\cdot 100\\%',
    linkedLessonId: 'chem-2006-8-11',
    defaultParams: { soluteMassG: 36, waterMassG: 100, solutionTempC: 25 },
    paramBounds: {
      soluteMassG: { min: 5, max: 95, step: 5, unit: 'g', label: 'Khối lượng chất tan cho vào' },
      waterMassG: { min: 50, max: 200, step: 25, unit: 'g', label: 'Khối lượng nước (dung môi)' },
      solutionTempC: { min: 5, max: 95, step: 5, unit: '°C', label: 'Nhiệt độ dung dịch' }
    },
    presets: [
      { label: 'Chưa bão hòa (30g / 100g H₂O · 40°C)', description: 'Tan hoàn toàn trong nước tạo dung dịch trong suốt', params: { soluteMassG: 30, waterMassG: 100, solutionTempC: 40 } },
      { label: 'Bão hòa dư tinh thể (75g · 25°C)', description: 'Vượt độ tan S = 36,3g nên phần dư lắng đáy', params: { soluteMassG: 75, waterMassG: 100, solutionTempC: 25 } }
    ]
  }
];

export const CHEMISTRY_3D_SIMS: Chemistry3DSimSpec[] = [
  {
    id: 'atomic_orbitals_3d',
    domainId: 'atomic_periodic',
    grades: ['Lớp 10'],
    title: 'Orbital Nguyên Tử 3D (s, p_x/p_y/p_z, d_z²/d_{x²-y²})',
    subtitle: 'Khối cầu s, cặp thùy p đối xứng trục và đám mây điện tử 3D phát sáng theo dấu hàm sóng',
    formula: '\\int |\\psi|^2 dV = 1',
    linkedLessonId: 'chem-10-1',
    presets: [
      { label: 'Orbital 2p_z', description: 'Hai thùy đối xứng dọc trục Z', settings: { speed: 1, concentration: 2, showLabels: true } },
      { label: 'Orbital 3d_{z²}', description: 'Thùy chính trục Z kèm vòng xuyến eo', settings: { speed: 1, concentration: 3, showLabels: true } }
    ]
  },
  {
    id: 'vsepr_geometry_3d',
    domainId: 'bonding_structure',
    grades: ['Lớp 10'],
    title: 'Hình Học Phân Tử VSEPR 3D Tương Tác',
    subtitle: 'Tuyến tính 180°, Tam giác phẳng 120°, Tứ diện CH₄ 109.5°, Lưỡng chóp tam giác PCl₅ & Bát diện SF₆',
    formula: 'AX_nE_m \\Rightarrow \\text{Phân bố tối thiểu lực đẩy cặp e}',
    linkedLessonId: 'chem-10-3',
    presets: [
      { label: 'Tứ diện đều CH₄', description: 'Góc liên kết H-C-H = 109.5°', settings: { speed: 1, concentration: 4 } },
      { label: 'Bát diện SF₆', description: '6 liên kết đối xứng 90°', settings: { speed: 1, concentration: 6 } }
    ]
  },
  {
    id: 'crystal_lattice_3d',
    domainId: 'bonding_structure',
    grades: ['Lớp 10', 'Lớp 12'],
    title: 'Mạng Tinh Thể 3D: NaCl (Ion) & Kim Cương (Cộng hóa trị)',
    subtitle: 'Xoay ô mạng cơ sở 3×3, đếm ion Na⁺/Cl⁻ hoặc mạng tứ diện sp³ cứng nhất tự nhiên',
    formula: 'Z_{\\text{NaCl}} = 4\\text{ cặp ion / ô mạng}',
    linkedLessonId: 'chem-chuyen-10-2',
    presets: [
      { label: 'Tinh thể muối ăn NaCl', description: 'Lập phương tâm mặt xen kẽ', settings: { speed: 0.8, concentration: 1 } },
      { label: 'Mạng tứ diện Kim cương', description: 'Mỗi nguyên tử C lai hóa sp³ liên kết 4 C lân cận', settings: { speed: 0.8, concentration: 2 } }
    ]
  },
  {
    id: 'galvanic_cell_3d',
    domainId: 'electro_inorganic',
    grades: ['Lớp 12'],
    title: 'Pin Điện Hóa Daniell Zn–Cu 3D Với Cầu Muối & Dòng Electron',
    subtitle: 'Quan sát thanh Zn mòn dần, thanh Cu dày thêm, ion NO₃⁻/K⁺ di chuyển qua cầu muối thủy tinh và đồng hồ Vôn',
    formula: '\\text{Zn} + \\text{Cu}^{2+} \\to \\text{Zn}^{2+} + \\text{Cu},\\quad E^\\circ = 1{,}10\\text{ V}',
    linkedLessonId: 'chem-12-4',
    presets: [
      { label: 'Pin Daniell hoạt động', description: 'Dòng electron qua dây dẫn thắp sáng vôn kế', settings: { speed: 1.2, showVectors: true } }
    ]
  },
  {
    id: 'electrolysis_cell_3d',
    domainId: 'electro_inorganic',
    grades: ['Lớp 12'],
    title: 'Bình Điện Phân 3D & Sủi Bọt Khí Trên Điện Cực Than Chì',
    subtitle: 'Các ion dương Cu²⁺ di chuyển về cực âm (Cathode), bọt khí O₂/Cl₂ nổi lên liên tục ở cực dương (Anode)',
    formula: '2\\text{CuSO}_4 + 2\\text{H}_2\\text{O} \\xrightarrow{\\text{đpdd}} 2\\text{Cu} + 2\\text{H}_2\\text{SO}_4 + \\text{O}_2\\uparrow',
    linkedLessonId: 'chem-12-5',
    presets: [
      { label: 'Điện phân CuSO₄', description: 'Đóng lớp Cu đỏ trên cực âm', settings: { speed: 1.4 } }
    ]
  },
  {
    id: 'titration_bench_3d',
    domainId: 'equilibrium_acidbase',
    grades: ['Lớp 11', 'Lớp 9'],
    title: 'Bàn Thí Nghiệm Chuẩn Độ Buret – Bình Tam Giác 3D',
    subtitle: 'Giọt kiềm NaOH rơi từ khóa buret xuống bình nón có máy khuấy từ, đổi màu dung dịch sang hồng cánh sen khi chạm điểm tương đương',
    formula: 'C_a V_a = C_b V_b',
    linkedLessonId: 'chem-11-2',
    presets: [
      { label: 'Đang nhỏ chuẩn độ', description: 'Dung dịch đổi màu hồng bền 30 giây', settings: { speed: 1 } }
    ]
  },
  {
    id: 'activation_surface_3d',
    domainId: 'kinetics_thermo',
    grades: ['Lớp 10'],
    title: 'Bề Mặt Thế Năng 3D (PES) & Trạng Thái Chuyển Tiếp',
    subtitle: 'Quả cầu trạng thái phản ứng vượt yên ngựa năng lượng hoạt hóa E_a từ thung lũng chất đầu sang sản phẩm',
    formula: 'k = \\frac{k_B T}{h} e^{-\\Delta G^\\ddagger / RT}',
    linkedLessonId: 'chem-10-5',
    presets: [
      { label: 'Vượt đèo yên ngựa Ea', description: 'Xúc tác hạ thấp chiều cao đèo yên ngựa', settings: { speed: 1 } }
    ]
  },
  {
    id: 'equilibrium_piston_3d',
    domainId: 'equilibrium_acidbase',
    grades: ['Lớp 11'],
    title: 'Xy-lanh Cân Bằng Khí 3D (N₂O₄ ⇌ 2NO₂)',
    subtitle: 'Quan sát mật độ phân tử đơn lẻ và đôi va chạm đàn hồi 3D khi nén thể tích pít-tông',
    formula: 'K_c = \\frac{[\\text{NO}_2]^2}{[\\text{N}_2\\text{O}_4]}',
    linkedLessonId: 'chem-11-1',
    presets: [
      { label: 'Hệ khí nén 3D', description: 'Phân tử va chạm liên tục đạt cân bằng động', settings: { speed: 1.2, temperature: 320 } }
    ]
  },
  {
    id: 'benzene_pi_3d',
    domainId: 'organic_polymer',
    grades: ['Lớp 11'],
    title: 'Vòng Thơm Benzen C₆H₆ & Đám Mây Electron π Liên Hợp 3D',
    subtitle: 'Khung phẳng 6 nguyên tử C lai hóa sp² với hai vòng nhẫn electron π giải tỏa phía trên và dưới mặt phẳng vòng',
    formula: '\\text{6 } e_\\pi \\text{ giải tỏa đều trên 6 cạnh } 1{,}39\\text{ \\AA}',
    linkedLessonId: 'chem-11-8',
    presets: [
      { label: 'Vành electron π giải tỏa', description: 'Độ dài tất cả liên kết C-C bằng nhau', settings: { speed: 1 } }
    ]
  },
  {
    id: 'ester_reflux_3d',
    domainId: 'organic_polymer',
    grades: ['Lớp 12'],
    title: 'Hệ Bình Cầu Đun Hồi Lưu & Sinh Hàn Tổng Hợp Este 3D',
    subtitle: 'Ống sinh hàn ngưng tụ hơi etyl axetat chảy về bình hứng tách lớp mùi thơm chuối/dứa chín',
    formula: '\\text{RCOOH} + \\text{R\'OH} \\xrightleftharpoons[t^\\circ]{\\text{H}_2\\text{SO}_4\\text{ đặc}} \\text{RCOOR\'} + \\text{H}_2\\text{O}',
    linkedLessonId: 'chem-12-1',
    presets: [
      { label: 'Chưng cất Etyl Axetat', description: 'Hơi ngưng tụ chảy qua ống sinh hàn', settings: { speed: 1.1 } }
    ]
  },
  {
    id: 'polymer_chain_3d',
    domainId: 'organic_polymer',
    grades: ['Lớp 12'],
    title: 'Mạch Xoắn Đại Phân Tử Polime & Cầu Khâu Mạng Không Gian 3D',
    subtitle: 'Chuỗi cacbon zig-zag sp³ uốn lượn 3D với các cầu lưu huỳnh hoặc nhóm thế tuần hoàn',
    formula: '(-\\text{CH}_2-\\text{CH}(X)-)_n',
    linkedLessonId: 'chem-12-4b',
    presets: [
      { label: 'Mạch PE / PVC 3D', description: 'Chuỗi mắt xích lặp lại không gian', settings: { speed: 1 } }
    ]
  },
  {
    id: 'coordination_complex_3d',
    domainId: 'bonding_structure',
    grades: ['Lớp 12'],
    title: 'Phức Chất Bát Diện [Cu(NH₃)₄(H₂O)₂]²⁺ & Tứ Diện 3D',
    subtitle: 'Ion trung tâm kim loại chuyển tiếp liên kết cho-nhận với 4–6 phối tử xung quanh',
    formula: '[M(L)_6]^{z+}',
    linkedLessonId: 'chem-12-8',
    presets: [
      { label: 'Phức bát diện 6 phối tử', description: 'Cấu trúc bát diện đối xứng', settings: { speed: 1 } }
    ]
  },
  {
    id: 'methane_ethane_3d',
    domainId: 'organic_polymer',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Mô Hình Ball-and-Stick Ankan – Anken – Ankin 3D',
    subtitle: 'So sánh liên kết đơn quay tự do (C₂H₆), nối đôi phẳng khóa góc cis/trans (C₂H₄) và nối ba thẳng 180° (C₂H₂)',
    formula: 'sp^3 (109{,}5^\\circ) \\to sp^2 (120^\\circ) \\to sp (180^\\circ)',
    linkedLessonId: 'chem-11-6',
    presets: [
      { label: 'Anken nối đôi π', description: 'Không quay tự do quanh C=C', settings: { speed: 1 } }
    ]
  },
  {
    id: 'spectroscopy_prism_3d',
    domainId: 'atomic_periodic',
    grades: ['Lớp 10', 'Lớp 11'],
    title: 'Máy Quang Phổ Lăng Kính & Phân Tích Vạch Phát Xạ 3D',
    subtitle: 'Chùm sáng ngọn lửa đi qua khe hẹp và lăng kính thủy tinh tách thành các vạch màu đơn sắc đặc trưng nguyên tố',
    formula: 'E_n = -\\frac{13{,}6 Z^2}{n^2}\\text{ eV}',
    linkedLessonId: 'chem-12-7',
    presets: [
      { label: 'Phổ vạch tán sắc 3D', description: 'Tách tia đơn sắc sau lăng kính', settings: { speed: 1 } }
    ]
  },
  {
    id: 'periodic_tower_3d',
    domainId: 'atomic_periodic',
    grades: ['Lớp 10'],
    title: 'Tháp Bảng Tuần Hoàn 3D Theo Độ Âm Điện & Bán Kính',
    subtitle: 'Chiều cao mỗi cột biểu diễn độ âm điện hoặc năng lượng ion hóa trên toàn bộ các nhóm A',
    formula: '\\chi_{\\text{F}} = 3{,}98\\text{ (Lớn nhất)}',
    linkedLessonId: 'chem-10-2',
    presets: [
      { label: 'Chiều cao = Độ âm điện χ', description: 'Tăng dần hướng về góc trên phải (F)', settings: { speed: 0.7 } }
    ]
  },
  {
    id: 'colloid_micelle_3d',
    domainId: 'organic_polymer',
    grades: ['Lớp 12'],
    title: 'Quả Cầu Mixen Xà Phòng 3D Bao Bọc Giọt Dầu Mỡ',
    subtitle: 'Hàng chục phân tử chất hoạt động bề mặt định hướng xuyên tâm tạo nhũ tương ổn định trong nước',
    formula: '\\text{Micelle: nhân kị nước + vỏ ưa nước}',
    linkedLessonId: 'chem-12-1',
    presets: [
      { label: 'Cấu trúc cầu Mixen 3D', description: 'Đuôi hướng tâm, đầu -COO⁻ hướng nước', settings: { speed: 0.9 } }
    ]
  },
  {
    id: 'carbohydrate_ring_3d',
    domainId: 'organic_polymer',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Vòng Ghế α/β-Glucozơ, Fructozơ & Chuỗi Xoắn Amylose 3D',
    subtitle: 'Cấu dạng ghế 6 cạnh pyranose bền vững với các nhóm -OH định hướng xích đạo (equatorial) & trục (axial)',
    formula: '\\alpha\\text{-D-Glucopyranose} \\rightleftharpoons \\text{Mạch hở (-CHO)} \\rightleftharpoons \\beta\\text{-D-Glucopyranose}',
    linkedLessonId: 'chem-12-2',
    presets: [
      { label: 'Vòng 6 cạnh α/β-Glucozơ', description: 'Dị phân hóa tại C1 tạo liên kết α-1,4 và β-1,4 glycosid', settings: { speed: 1, showLabels: true } }
    ]
  },
  {
    id: 'carbonyl_alcohol_3d',
    domainId: 'organic_polymer',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Ống Nghiệm Tráng Bạc Tollens & Phân Tử Ancol – Anđehit 3D',
    subtitle: 'Lớp gương bạc kim loại phản xạ sáng bóng kết tinh dần trên thành thủy tinh borosilicate cùng mô hình CH₃CHO / C₂H₅OH',
    formula: '\\text{CH}_3\\text{CHO} + 2[\\text{Ag}(\\text{NH}_3)_2]\\text{OH} \\xrightarrow{t^\\circ} \\text{CH}_3\\text{COONH}_4 + 2\\text{Ag}\\downarrow',
    linkedLessonId: 'chem-11-9',
    presets: [
      { label: 'Gương bạc Tollens phản xạ PBR', description: 'Đun nóng nhẹ 60°C kết tủa bạc phủ đều ống nghiệm', settings: { speed: 1.1, temperature: 340 } }
    ]
  },
  {
    id: 'haber_contact_reactor_3d',
    domainId: 'equilibrium_acidbase',
    grades: ['Lớp 11'],
    title: 'Tháp Tổng Hợp Haber–Bosch (NH₃) & Lò Tiếp Xúc V₂O₅ (SO₃) 3D',
    subtitle: 'Khí N₂ + 3H₂ qua các tầng xúc tác Fe nung đỏ 450°C dưới áp suất 200 atm và dàn ngưng tụ NH₃ lỏng',
    formula: '\\text{N}_2 + 3\\text{H}_2 \\xrightleftharpoons[450^\\circ\\text{C}, 200\\text{ atm}]{\\text{Fe}} 2\\text{NH}_3',
    linkedLessonId: 'chem-11-3',
    presets: [
      { label: 'Tháp tổng hợp công nghiệp', description: 'Dòng khí tuần hoàn qua tầng xúc tác phát sáng', settings: { speed: 1.2, temperature: 450 } }
    ]
  },
  {
    id: 'metal_corrosion_3d',
    domainId: 'electro_inorganic',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Ăn Mòn Điện Hóa, Lò Cao Luyện Gang & Đẩy Muối CuSO₄ 3D',
    subtitle: 'Thanh Fe nhúng CuSO₄ bám đồng đỏ, vỏ thép gắn Kẽm hy sinh bảo vệ catot và hạt electron chuyển dịch',
    formula: '\\text{Fe} + \\text{Cu}^{2+} \\to \\text{Fe}^{2+} + \\text{Cu}\\downarrow\\quad |\\quad \\text{Zn (Anode hy sinh)} \\to \\text{Zn}^{2+} + 2e',
    linkedLessonId: 'chem-12-6',
    presets: [
      { label: 'Bảo vệ Catot bằng Kẽm', description: 'Dòng electron từ thanh Zn bảo vệ hoàn toàn tấm thép Fe', settings: { speed: 1, showVectors: true } }
    ]
  },
  {
    id: 'alkene_addition_3d',
    domainId: 'organic_polymer',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Cơ Chế Cộng Ái Điện Tử π (Anken C=C + Br₂ / HBr) 3D',
    subtitle: 'Đám mây orbital π tím-lam phía trên và dưới liên kết đôi C=C mở ra đón phân tử Br₂ chuyển thành dẫn xuất bão hòa sp³',
    formula: '\\text{CH}_2=\\text{CH}_2 + \\text{Br}_2 \\to \\text{CH}_2\\text{Br}-\\text{CH}_2\\text{Br}',
    linkedLessonId: 'chem-11-7',
    presets: [
      { label: 'Phá vỡ liên kết π', description: 'Chuyển góc lai hóa sp² (120°) sang tứ diện sp³ (109.5°)', settings: { speed: 1.1 } }
    ]
  },
  {
    id: 'amino_peptide_3d',
    domainId: 'organic_polymer',
    grades: ['Lớp 12'],
    title: 'Ion Lưỡng Cực Amino Axit, Liên Kết Peptide –CONH– & Chuỗi Xoắn α 3D',
    subtitle: 'Nhóm -NH₃⁺ và -COO⁻ tạo ion lưỡng cực, liên kết peptide phẳng liên hợp và phức màu tím Biuret với Cu²⁺',
    formula: '^+\\text{H}_3\\text{N}-\\text{CH}(R)-\\text{COO}^- \\xrightarrow{\\text{ngưng tụ}} (-\\text{NH}-\\text{CH}(R)-\\text{CO}-)_n',
    linkedLessonId: 'chem-12-3',
    presets: [
      { label: 'Chuỗi Tripeptit & Mặt phẳng -CONH-', description: 'Liên kết peptit phẳng cố định không gian', settings: { speed: 0.9, showLabels: true } }
    ]
  },
  {
    id: 'halogen_ion_bench_3d',
    domainId: 'electro_inorganic',
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    title: 'Giá Ống Nghiệm Kết Tủa AgX, BaSO₄ & Phản Ứng Đẩy Halogen 3D',
    subtitle: '4 ống nghiệm thủy tinh chứa kết tủa AgCl trắng, AgBr vàng nhạt, AgI vàng đậm và phức Cu(NH₃)₄²⁺ xanh thẫm',
    formula: '\\text{AgCl}\\text{ (trắng)} \\mid \\text{AgBr}\\text{ (vàng nhạt)} \\mid \\text{AgI}\\text{ (vàng đậm)}',
    linkedLessonId: 'chem-10-20',
    presets: [
      { label: 'So sánh 4 ống nghiệm nhận biết', description: 'Quan sát trực quan độ sâu màu kết tủa bạc halogenua', settings: { speed: 1, showLabels: true } }
    ]
  },
  {
    id: 'matter_states_3d',
    domainId: 'kinetics_thermo',
    grades: ['Lớp 6', 'Lớp 8'],
    title: 'Ba Thể Rắn – Lỏng – Khí & Quá Trình Chuyển Thể 3D',
    subtitle: 'Quan sát trực tiếp các phân tử trong hộp thủy tinh thay đổi trật tự từ mạng tinh thể rắn sang lỏng chảy và khí bay tán loạn theo nhiệt độ',
    formula: 'T < T_{\\text{nc}} \\text{ (Rắn)} \\longrightarrow T_{\\text{nc}} < T < T_{\\text{sôi}} \\text{ (Lỏng)} \\longrightarrow T > T_{\\text{sôi}} \\text{ (Khí)}',
    linkedLessonId: 'chem-6-b1',
    presets: [
      { label: 'Thể rắn (Đóng băng)', description: 'Các hạt xếp khít dao động quanh vị trí cân bằng', settings: { speed: 0.7, temperature: -10 } },
      { label: 'Thể khí (Đun sôi 120°C)', description: 'Các phân tử bứt khỏi liên kết bay khắp bình', settings: { speed: 1.5, temperature: 120 } }
    ]
  },
  {
    id: 'separation_lab_3d',
    domainId: 'bonding_structure',
    grades: ['Lớp 6', 'Lớp 7'],
    title: 'Bàn Thí Nghiệm Tách Chất 3D (Phễu Lọc – Bát Cô Cạn – Phễu Chiết – Nam Châm)',
    subtitle: '4 bộ dụng cụ thủy tinh thực tế trên bàn lab 3D tách hỗn hợp không đồng nhất và dung dịch muối',
    formula: '\\text{Lọc} \\mid \\text{Cô cạn} \\mid \\text{Chiết} \\mid \\text{Từ tính}',
    linkedLessonId: 'chem-6-b2',
    presets: [
      { label: 'Phễu lọc & Bát cô cạn', description: 'Giữ cát trên giấy lọc, bay hơi thu muối trắng', settings: { speed: 1, showLabels: true } }
    ]
  },
  {
    id: 'ionic_covalent_3d',
    domainId: 'bonding_structure',
    grades: ['Lớp 7', 'Lớp 8', 'Lớp 10'],
    title: 'Liên Kết Ion (Cho–Nhận Na⁺Cl⁻) vs Cộng Hóa Trị (Góp Chung H₂O) 3D',
    subtitle: 'Chuyển đổi giữa cơ chế Na nhường hẳn 1 electron cho Cl và hai nguyên tử H góp chung electron với Oxygen',
    formula: '\\text{Na} \\xrightarrow{-1e} \\text{Na}^+ + \\text{Cl}^- \\quad | \\quad \\text{H}:\\ddot{\\text{O}}:\\text{H}',
    linkedLessonId: 'chem-7-b2',
    presets: [
      { label: 'Liên kết Ion (NaCl)', description: 'Hạt electron dịch chuyển sang Cl tạo cặp ion hút nhau', settings: { speed: 1, showLabels: true } },
      { label: 'Liên kết Cộng hóa trị (H₂O)', description: 'Cặp electron dùng chung quay quanh cả O và H', settings: { speed: 1.1, showLabels: true } }
    ]
  },
  {
    id: 'indicator_bench_3d',
    domainId: 'equilibrium_acidbase',
    grades: ['Lớp 8', 'Lớp 9', 'Lớp 11'],
    title: 'Giá Cốc Thí Nghiệm pH 0–14, Quỳ Tím & Sủi Khí H₂ (Acid–Base–Muối) 3D',
    subtitle: 'Nhúng giấy quỳ tím vào cốc dung dịch pH tùy chỉnh, đổi màu dung dịch và thả hạt kẽm vào cốc acid sinh bọt khí H₂ bay lên',
    formula: '\\text{Zn} + 2\\text{HCl} \\to \\text{ZnCl}_2 + \\text{H}_2\\uparrow \\quad|\\quad \\text{Acid} + \\text{Base} \\to \\text{Muối} + \\text{H}_2\\text{O}',
    linkedLessonId: 'chem-8-b2',
    presets: [
      { label: 'Cốc Acid pH = 1.5 + Zn', description: 'Quỳ hóa đỏ rực và bọt H₂ sủi lên liên tục', settings: { speed: 1.2, showLabels: true } },
      { label: 'Cốc Kiềm NaOH pH = 12.5', description: 'Quỳ hóa xanh thẫm, Phenolphthalein hồng', settings: { speed: 1, showLabels: true } }
    ]
  },
  {
    id: 'combustion_reactor_3d',
    domainId: 'kinetics_thermo',
    grades: ['Lớp 6', 'Lớp 8'],
    title: 'Bình Phản Ứng Đốt Cháy Trong Khí O₂ & Phản Ứng Hóa Hợp 3D',
    subtitle: 'Quan sát dây sắt/tàn đóm cháy sáng bắn tia lửa trong bình thủy tinh chứa khí O₂ tinh khiết',
    formula: '3\\text{Fe} + 2\\text{O}_2 \\xrightarrow{t^\\circ} \\text{Fe}_3\\text{O}_4',
    linkedLessonId: 'chem-2006-8-4',
    presets: [
      { label: 'Bùng cháy trong bình O₂ 95%', description: 'Tia lửa bắn mạnh trong khí Oxygen đậm đặc', settings: { speed: 1.2, showLabels: true } }
    ]
  },
  {
    id: 'mass_balance_3d',
    domainId: 'kinetics_thermo',
    grades: ['Lớp 8'],
    title: 'Cân Đòn 2 Đĩa Kiểm Chứng Định Luật Bảo Toàn Khối Lượng 3D',
    subtitle: 'So sánh phản ứng xảy ra trong bình đậy nút kín (cân thăng bằng tuyệt đối) với bình hở thoát khí',
    formula: '\\sum m_{\\text{trước}} = \\sum m_{\\text{sau}}',
    linkedLessonId: 'chem-8-b1',
    presets: [
      { label: 'Hệ kín nút cao su cân bằng', description: 'Đòn cân thăng bằng hoàn hảo trước và sau phản ứng', settings: { speed: 1, showLabels: true } }
    ]
  },
  {
    id: 'solution_mixing_3d',
    domainId: 'equilibrium_acidbase',
    grades: ['Lớp 8'],
    title: 'Cốc Khuấy Từ Pha Dung Dịch, Độ Tan S & Kết Tinh 3D',
    subtitle: 'Khuấy tan tinh thể muối/CuSO₄ và quan sát ngưỡng bão hòa kết tinh khi giảm nhiệt độ',
    formula: 'C\\% = \\frac{m_{\\text{ct}}}{m_{\\text{dd}}}\\cdot 100\\% \\quad|\\quad C_M = \\frac{n}{V}',
    linkedLessonId: 'chem-2006-8-11',
    presets: [
      { label: 'Dung dịch bão hòa có kết tinh', description: 'Tinh thể dư lắng đáy cốc khi vượt độ tan S', settings: { speed: 1, showLabels: true } }
    ]
  }
];
