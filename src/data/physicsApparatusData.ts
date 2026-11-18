import { Physics3DMode, PhysicsDomainId, PhysicsSimType } from '../types';

export type ApparatusCategoryId =
  | 'all'
  | 'measurement'
  | 'mechanics_waves'
  | 'electricity_mag'
  | 'optics'
  | 'thermal_nuclear';

export type ApparatusWidgetKind =
  | 'ruler'
  | 'caliper'
  | 'protractor'
  | 'stopwatch'
  | 'oscilloscope'
  | 'compass'
  | 'meter_digital'
  | 'component_toggle'
  | 'passive_block';

export interface PhysicsApparatusItem {
  id: string;
  viName: string;
  enName: string;
  category: Exclude<ApparatusCategoryId, 'all'>;
  widgetKind: ApparatusWidgetKind;
  unit: string;
  symbol: string;
  accentHex: string;
  shortDescVi: string;
  shortDescEn: string;
  keywords: string;
  defaultValueLabel?: string;
}

export const APPARATUS_CATEGORIES: { id: ApparatusCategoryId; vi: string; en: string }[] = [
  { id: 'all', vi: 'Tất cả (36)', en: 'All (36)' },
  { id: 'measurement', vi: 'Đo lường & Cảm biến', en: 'Meters & Sensors' },
  { id: 'mechanics_waves', vi: 'Cơ & Sóng âm', en: 'Mechanics & Waves' },
  { id: 'electricity_mag', vi: 'Điện & Từ trường', en: 'Electricity & Mag' },
  { id: 'optics', vi: 'Quang học', en: 'Optics' },
  { id: 'thermal_nuclear', vi: 'Nhiệt & Hạt nhân', en: 'Thermal & Nuclear' }
];

export const PHYSICS_APPARATUS_CATALOG: PhysicsApparatusItem[] = [
  // 1. MEASUREMENT & UNIVERSAL SENSORS (12)
  {
    id: 'ruler_cm',
    viName: 'Thước thẳng mm/cm',
    enName: 'Metric Ruler (cm/mm)',
    category: 'measurement',
    widgetKind: 'ruler',
    unit: 'cm',
    symbol: 'L',
    accentHex: '#f59e0b',
    shortDescVi: 'Thước vạch chia milimét xoay được góc bất kì để đo độ dài trực tiếp trên hình.',
    shortDescEn: 'Rotatable millimeter-scale ruler for direct on-stage length measurement.',
    keywords: 'thuoc thang cm mm chieu dai ruler do khoang cach'
  },
  {
    id: 'vernier_caliper',
    viName: 'Thước kẹp Vernier',
    enName: 'Vernier Caliper',
    category: 'measurement',
    widgetKind: 'caliper',
    unit: 'mm',
    symbol: 'd',
    accentHex: '#38bdf8',
    shortDescVi: 'Đo đường kính, khe hẹp hoặc bề dày bản mỏng với độ chính xác 0.02 mm.',
    shortDescEn: 'Measures diameters, slits, or thin layers down to 0.02 mm precision.',
    keywords: 'thuoc kep panme vernier duong kinh khe hep be day'
  },
  {
    id: 'protractor_360',
    viName: 'Thước đo góc 360°',
    enName: '360° Protractor',
    category: 'measurement',
    widgetKind: 'protractor',
    unit: '°',
    symbol: 'θ',
    accentHex: '#a855f7',
    shortDescVi: 'Vòng chia độ trong suốt đo góc nghiêng, góc khúc xạ, góc phản xạ.',
    shortDescEn: 'Transparent radial degree dial for measuring tilt, incidence, and refraction angles.',
    keywords: 'thuoc do goc 360 do protractor goc nghien khuc xa'
  },
  {
    id: 'stopwatch_pro',
    viName: 'Đồng hồ bấm giờ 0.01s',
    enName: 'Precision Stopwatch',
    category: 'measurement',
    widgetKind: 'stopwatch',
    unit: 's',
    symbol: 't',
    accentHex: '#6366f1',
    shortDescVi: 'Bấm giờ độc lập ngay trên khung thí nghiệm để đo chu kì T hoặc thời gian rơi.',
    shortDescEn: 'Independent on-stage stopwatch to time oscillation periods and falls.',
    keywords: 'dong ho bam gio chu ki thoi gian stopwatch timer'
  },
  {
    id: 'dynamometer_spring',
    viName: 'Lực kế lò xo',
    enName: 'Spring Dynamometer',
    category: 'measurement',
    widgetKind: 'meter_digital',
    unit: 'N',
    symbol: 'F',
    accentHex: '#ef4444',
    shortDescVi: 'Đo trực tiếp trọng lực P, lực căng dây T, lực đàn hồi hay lực đẩy Ác-si-mét.',
    shortDescEn: 'Measures weight, tension, restoring force, or buoyant force in Newtons.',
    keywords: 'luc ke lo xo newton trong luc luc cang luc day'
  },
  {
    id: 'analytical_balance',
    viName: 'Cân điện tử phân tích',
    enName: 'Analytical Balance',
    category: 'measurement',
    widgetKind: 'meter_digital',
    unit: 'kg',
    symbol: 'm',
    accentHex: '#10b981',
    shortDescVi: 'Cân chính xác khối lượng vật mẫu hoặc tải nặng trong thí nghiệm cơ học.',
    shortDescEn: 'High-precision balance displaying active specimen mass.',
    keywords: 'can dien tu khoi luong kg gram balance'
  },
  {
    id: 'photogate_timer',
    viName: 'Cổng quang điện tử',
    enName: 'Photogate Speed Sensor',
    category: 'measurement',
    widgetKind: 'meter_digital',
    unit: 'm/s',
    symbol: 'v',
    accentHex: '#0ea5e9',
    shortDescVi: 'Cảm biến hồng ngoại đo tức thời vận tốc vật chuyển động đi qua điểm đặt.',
    shortDescEn: 'Optical infrared gate sampling instantaneous object velocity.',
    keywords: 'cong quang dien cam bien van toc photogate'
  },
  {
    id: 'ammeter_dc_ac',
    viName: 'Ampe kế số (A)',
    enName: 'Digital Ammeter',
    category: 'measurement',
    widgetKind: 'meter_digital',
    unit: 'A',
    symbol: 'I',
    accentHex: '#f97316',
    shortDescVi: 'Mắc nối tiếp đo cường độ dòng điện chạy trong mạch DC hoặc xoay chiều AC.',
    shortDescEn: 'Measures electric current intensity in Amps across DC or AC loops.',
    keywords: 'ampe ke dong dien ammeter cuong do dong dien'
  },
  {
    id: 'voltmeter_dc_ac',
    viName: 'Vôn kế số (V)',
    enName: 'Digital Voltmeter',
    category: 'measurement',
    widgetKind: 'meter_digital',
    unit: 'V',
    symbol: 'U',
    accentHex: '#eab308',
    shortDescVi: 'Đo hiệu điện thế hai đầu đoạn mạch, tụ điện, cuộn dây hoặc suất điện động.',
    shortDescEn: 'Measures voltage potential difference or induced EMF in Volts.',
    keywords: 'von ke hieu dien the dien ap voltmeter'
  },
  {
    id: 'multimeter_pro',
    viName: 'Đồng hồ vạn năng (U/I/Ω)',
    enName: 'Digital Multimeter',
    category: 'measurement',
    widgetKind: 'meter_digital',
    unit: 'Ω/V/A',
    symbol: 'M',
    accentHex: '#14b8a6',
    shortDescVi: 'Đo tổng hợp Điện trở tương đương Rtđ / Tổng trở Z, điện áp và dòng điện.',
    shortDescEn: 'All-in-one meter reading equivalent resistance, impedance Z, U, and I.',
    keywords: 'dong ho van nang om ke dien tro tong tro multimeter'
  },
  {
    id: 'oscilloscope_cro',
    viName: 'Máy hiện sóng Cathode (CRO)',
    enName: 'Cathode-Ray Oscilloscope',
    category: 'measurement',
    widgetKind: 'oscilloscope',
    unit: 'Hz',
    symbol: '~',
    accentHex: '#22c55e',
    shortDescVi: 'Hiển thị trực tiếp đồ thị sóng điện áp / dao động điều hòa theo thời gian.',
    shortDescEn: 'Live dual-trace waveform display synchronized to active frequency and amplitude.',
    keywords: 'may hien song dao dong ky oscilloscope do thi song'
  },
  {
    id: 'gaussmeter_hall',
    viName: 'Cảm biến từ trường Hall',
    enName: 'Hall Gaussmeter Probe',
    category: 'measurement',
    widgetKind: 'meter_digital',
    unit: 'mT',
    symbol: 'B',
    accentHex: '#3b82f6',
    shortDescVi: 'Đo cảm ứng từ B (mT / T) tại vị trí đầu dò khi kéo lại gần nam châm hoặc ống dây.',
    shortDescEn: 'Spatially sensitive magnetic flux density probe responsive to magnet proximity.',
    keywords: 'cam bien tu truong hall gaussmeter tesla cam ung tu B'
  },

  // 2. MECHANICS & WAVES (8)
  {
    id: 'mass_set',
    viName: 'Bộ quả nặng chuẩn (100g–1kg)',
    enName: 'Standard Mass Set',
    category: 'mechanics_waves',
    widgetKind: 'component_toggle',
    unit: 'g',
    symbol: 'M',
    accentHex: '#64748b',
    shortDescVi: 'Quả cân móc treo chuẩn dùng thay đổi tải trọng trên lò xo, ròng rọc hoặc đòn bẩy.',
    shortDescEn: 'Hooked calibration mass set for springs, pulleys, and lever experiments.',
    keywords: 'qua nang qua can khoi luong chuan mass set'
  },
  {
    id: 'coil_spring_ref',
    viName: 'Lò xo mẫu chuẩn (k N/m)',
    enName: 'Precision Helical Spring',
    category: 'mechanics_waves',
    widgetKind: 'passive_block',
    unit: 'N/m',
    symbol: 'k',
    accentHex: '#0284c7',
    shortDescVi: 'Lò xo thép đàn hồi tuyến tính khảo sát định luật Hooke F = k·Δl.',
    shortDescEn: 'Linear elastic helical spring for Hooke law verification.',
    keywords: 'lo xo dan hoi do cung hooke spring'
  },
  {
    id: 'air_track_cart',
    viName: 'Xe trượt đệm khí ít ma sát',
    enName: 'Low-Friction Air Cart',
    category: 'mechanics_waves',
    widgetKind: 'passive_block',
    unit: 'kg',
    symbol: 'Xe',
    accentHex: '#06b6d4',
    shortDescVi: 'Xe trượt động học dùng đo chuyển động thẳng biến đổi đều và va chạm đàn hồi.',
    shortDescEn: 'Air-track kinematics cart for collision and acceleration runs.',
    keywords: 'xe truot dem khi va cham dong hoc air cart'
  },
  {
    id: 'pulley_wheel',
    viName: 'Ròng rọc cố định ma sát nhỏ',
    enName: 'Low-Friction Pulley',
    category: 'mechanics_waves',
    widgetKind: 'passive_block',
    unit: 'N',
    symbol: 'RR',
    accentHex: '#94a3b8',
    shortDescVi: 'Bánh xe ròng rọc đổi hướng lực căng dây trong hệ cơ máy Atwood.',
    shortDescEn: 'Precision pulley wheel for tension direction and Atwood systems.',
    keywords: 'rong roc atwood luc cang day pulley'
  },
  {
    id: 'tuning_fork_ref',
    viName: 'Âm thoa chuẩn 440 Hz',
    enName: 'Tuning Fork (440 Hz)',
    category: 'mechanics_waves',
    widgetKind: 'meter_digital',
    unit: 'Hz',
    symbol: 'f₀',
    accentHex: '#10b981',
    shortDescVi: 'Nguồn âm chuẩn tạo sóng dừng và hiệu ứng cộng hưởng cột khí.',
    shortDescEn: 'Reference acoustic oscillator for standing waves and resonance tubes.',
    keywords: 'am thoa tan so am thanh cong huong tuning fork'
  },
  {
    id: 'decibel_meter',
    viName: 'Máy đo mức cường độ âm (dB)',
    enName: 'Sound Decibel Meter',
    category: 'mechanics_waves',
    widgetKind: 'meter_digital',
    unit: 'dB',
    symbol: 'L',
    accentHex: '#84cc16',
    shortDescVi: 'Đo mức cường độ âm L (dB) biến thiên theo khoảng cách r tới nguồn phát.',
    shortDescEn: 'Spatially responsive sound intensity level probe in decibels (dB).',
    keywords: 'may do am thanh cuong do am decibel dB song am'
  },
  {
    id: 'wave_vibrator',
    viName: 'Bộ tạo rung sóng cơ (f Hz)',
    enName: 'Mechanical Wave Vibrator',
    category: 'mechanics_waves',
    widgetKind: 'meter_digital',
    unit: 'Hz',
    symbol: 'ω',
    accentHex: '#0ea5e9',
    shortDescVi: 'Cần rung tạo sóng ngang/sóng dừng trên dây đàn hồi hoặc mặt nước.',
    shortDescEn: 'Oscillating wave driver generating ripples and standing waves.',
    keywords: 'bo tao rung song co song nuoc song dung vibrator'
  },
  {
    id: 'pendulum_bob_kit',
    viName: 'Con lắc dây & Quả cầu chuẩn',
    enName: 'Pendulum Bob & Cord',
    category: 'mechanics_waves',
    widgetKind: 'passive_block',
    unit: 'm',
    symbol: 'ℓ',
    accentHex: '#f59e0b',
    shortDescVi: 'Dây treo mảnh không giãn kèm quả cầu kim loại khảo sát chu kì T = 2π√(l/g).',
    shortDescEn: 'Precision bob and inextensible cord for simple pendulum experiments.',
    keywords: 'con lac don day treo qua cau chu ki pendulum'
  },

  // 3. ELECTRICITY & MAGNETISM (7)
  {
    id: 'power_supply_unit',
    viName: 'Bộ nguồn điện DC/AC biến thiên',
    enName: 'Variable DC/AC Power Supply',
    category: 'electricity_mag',
    widgetKind: 'meter_digital',
    unit: 'V',
    symbol: 'E',
    accentHex: '#ef4444',
    shortDescVi: 'Cấp nguồn một chiều hoặc xoay chiều điều chỉnh liên tục 0–240 V.',
    shortDescEn: 'Regulated DC/AC voltage source feeding circuit setups.',
    keywords: 'nguon dien pin acquy bien the power supply'
  },
  {
    id: 'rheostat_slider',
    viName: 'Biến trở con chạy (Ω)',
    enName: 'Sliding Rheostat',
    category: 'electricity_mag',
    widgetKind: 'meter_digital',
    unit: 'Ω',
    symbol: 'R_b',
    accentHex: '#f59e0b',
    shortDescVi: 'Điều chỉnh điện trở mạch để khảo sát định luật Ôm và công suất cực đại.',
    shortDescEn: 'Variable wire-wound resistor controlling total circuit resistance.',
    keywords: 'bien tro con chay dien tro rheostat'
  },
  {
    id: 'resistor_decade',
    viName: 'Hộp điện trở mẫu chuẩn',
    enName: 'Standard Resistor Box',
    category: 'electricity_mag',
    widgetKind: 'passive_block',
    unit: 'Ω',
    symbol: 'R',
    accentHex: '#d97706',
    shortDescVi: 'Các điện trở chính xác mắc nối tiếp/song song hoặc trong cầu Wheatstone.',
    shortDescEn: 'Precision resistors for series/parallel and Wheatstone bridge setups.',
    keywords: 'dien tro mau hop dien tro resistor'
  },
  {
    id: 'capacitor_bank',
    viName: 'Tụ điện mẫu (μF)',
    enName: 'Standard Capacitor',
    category: 'electricity_mag',
    widgetKind: 'meter_digital',
    unit: 'μF',
    symbol: 'C',
    accentHex: '#06b6d4',
    shortDescVi: 'Tụ điện phóng nạp trong mạch RC, mạch dao động LC và chỉnh lưu nguồn.',
    shortDescEn: 'Film/electrolytic capacitor bank for RC, RLC, LC, and rectifier circuits.',
    keywords: 'tu dien dien dung microfarad capacitor RC RLC'
  },
  {
    id: 'inductor_solenoid',
    viName: 'Cuộn cảm & Ống dây Solenoid',
    enName: 'Inductor / Solenoid Coil',
    category: 'electricity_mag',
    widgetKind: 'meter_digital',
    unit: 'mH',
    symbol: 'L',
    accentHex: '#f97316',
    shortDescVi: 'Cuộn dây đồng nhiều vòng tạo từ thông cảm ứng hoặc tự cảm trong mạch RLC.',
    shortDescEn: 'Multi-turn copper solenoid coil for induction and RLC experiments.',
    keywords: 'cuon cam ong day solenoid cam ung tu L'
  },
  {
    id: 'bar_magnet_ns',
    viName: 'Nam châm thẳng N – S',
    enName: 'Bar Magnet (N–S)',
    category: 'electricity_mag',
    widgetKind: 'passive_block',
    unit: 'T',
    symbol: 'N|S',
    accentHex: '#e11d48',
    shortDescVi: 'Nam châm vĩnh cửu hai cực Bắc–Nam dùng tạo từ trường ngoài và cảm ứng điện từ.',
    shortDescEn: 'Permanent dipole bar magnet for induction and field mapping.',
    keywords: 'nam cham thang cuc bac nam magnet'
  },
  {
    id: 'magnetic_compass',
    viName: 'Kim la bàn từ trường',
    enName: 'Magnetic Compass Needle',
    category: 'electricity_mag',
    widgetKind: 'compass',
    unit: '°',
    symbol: 'N',
    accentHex: '#f43f5e',
    shortDescVi: 'Kim nam châm thử tự do xoay theo chiều đường sức từ trường tại vị trí đặt.',
    shortDescEn: 'Animated compass needle aligning with local magnetic field orientation.',
    keywords: 'la ban kim nam cham tu truong compass'
  },

  // 4. OPTICS (5)
  {
    id: 'laser_pointer_rgb',
    viName: 'Đèn Laser đơn sắc (λ nm)',
    enName: 'Monochromatic Laser Source',
    category: 'optics',
    widgetKind: 'meter_digital',
    unit: 'nm',
    symbol: 'λ',
    accentHex: '#ec4899',
    shortDescVi: 'Nguồn phát tia sáng chuẩn trực mảnh đơn sắc bước sóng từ 400–700 nm.',
    shortDescEn: 'Collimated monochromatic laser source adjustable across visible spectrum.',
    keywords: 'den laser buoc song anh sang quang hoc'
  },
  {
    id: 'convex_concave_lens',
    viName: 'Thấu kính Hội tụ / Phân kì',
    enName: 'Optical Lens (Converging/Diverging)',
    category: 'optics',
    widgetKind: 'passive_block',
    unit: 'cm',
    symbol: 'f',
    accentHex: '#38bdf8',
    shortDescVi: 'Thấu kính thủy tinh quang học đặt trên băng chuẩn để tạo ảnh thật / ảnh ảo.',
    shortDescEn: 'Precision optical glass lens on bench mount.',
    keywords: 'thau kinh hoi tu phan ki tieu cu lens'
  },
  {
    id: 'optical_mirror',
    viName: 'Gương phẳng & Gương cầu',
    enName: 'Plane / Spherical Mirror',
    category: 'optics',
    widgetKind: 'passive_block',
    unit: 'cm',
    symbol: 'R/2',
    accentHex: '#94a3b8',
    shortDescVi: 'Gương phản xạ ánh sáng độ bóng cao tạo tiêu điểm hội tụ hoặc phản xạ chuẩn.',
    shortDescEn: 'Front-surface mirror for reflection and focal convergence.',
    keywords: 'guong cau guong phang phan xa mirror'
  },
  {
    id: 'glass_prism_block',
    viName: 'Lăng kính thủy tinh Flint',
    enName: 'Flint Glass Prism (60°)',
    category: 'optics',
    widgetKind: 'passive_block',
    unit: 'n',
    symbol: 'Δ',
    accentHex: '#8b5cf6',
    shortDescVi: 'Khối lăng kính tam giác tán sắc ánh sáng trắng thành 7 màu cầu vồng.',
    shortDescEn: '60° optical glass prism for chromatic dispersion and refraction.',
    keywords: 'lang kinh tan sac quang pho prism'
  },
  {
    id: 'lux_photometer',
    viName: 'Quang kế đo cường độ sáng',
    enName: 'Lux Photometer Sensor',
    category: 'optics',
    widgetKind: 'meter_digital',
    unit: '%',
    symbol: 'I',
    accentHex: '#fbbf24',
    shortDescVi: 'Đo phần trăm cường độ ánh sáng đi qua kính phân cực hoặc tại vị trí đầu dò.',
    shortDescEn: 'Photometric sensor measuring light intensity percentage at probe.',
    keywords: 'quang ke cuong do sang lux phan cuc giao thoa'
  },

  // 5. THERMAL & NUCLEAR (4)
  {
    id: 'thermometer_probe',
    viName: 'Nhiệt kế điện tử K / °C',
    enName: 'Digital Thermometer Probe',
    category: 'thermal_nuclear',
    widgetKind: 'meter_digital',
    unit: '°C / K',
    symbol: 'T',
    accentHex: '#f43f5e',
    shortDescVi: 'Đầu dò nhiệt đo trực tiếp nhiệt độ khối khí, nước nóng hoặc dọc thanh dẫn nhiệt.',
    shortDescEn: 'Spatially aware thermal probe reading °C and Kelvin along stage.',
    keywords: 'nhiet ke nhiet do kelvin do c thermometer'
  },
  {
    id: 'calorimeter_cup',
    viName: 'Bình nhiệt lượng kế cách nhiệt',
    enName: 'Insulated Calorimeter',
    category: 'thermal_nuclear',
    widgetKind: 'passive_block',
    unit: 'J',
    symbol: 'Q',
    accentHex: '#f97316',
    shortDescVi: 'Bình hai lớp cách nhiệt chân không đo cân bằng nhiệt và nhiệt dung riêng.',
    shortDescEn: 'Vacuum-insulated calorimeter vessel for specific heat capacity.',
    keywords: 'binh nhiet luong ke can bang nhiet calorimeter'
  },
  {
    id: 'pressure_manometer',
    viName: 'Áp kế đồng hồ khí (atm)',
    enName: 'Gas Pressure Manometer',
    category: 'thermal_nuclear',
    widgetKind: 'meter_digital',
    unit: 'atm',
    symbol: 'p',
    accentHex: '#0ea5e9',
    shortDescVi: 'Đo áp suất chất khí trong xilanh lí tưởng hay áp suất ống chất lỏng Bernoulli.',
    shortDescEn: 'Measures ideal gas pressure in atm or fluid static pressure.',
    keywords: 'ap ke ap suat khi li tuong manometer bernoulli'
  },
  {
    id: 'geiger_counter',
    viName: 'Máy đếm phóng xạ Geiger–Müller',
    enName: 'Geiger–Müller Counter',
    category: 'thermal_nuclear',
    widgetKind: 'meter_digital',
    unit: 'Bq',
    symbol: '☢',
    accentHex: '#eab308',
    shortDescVi: 'Đo độ phóng xạ H(t) và số hạt nhân phát tia phóng xạ theo thời gian thực.',
    shortDescEn: 'Radiation detector displaying live activity in Becquerels / counts.',
    keywords: 'may dem geiger phong xa hat nhan phan hach radiation'
  }
];

export const APPARATUS_BY_ID: Record<string, PhysicsApparatusItem> = Object.fromEntries(
  PHYSICS_APPARATUS_CATALOG.map((item) => [item.id, item])
);

const DOMAIN_DEFAULT_TOOLS: Record<PhysicsDomainId, string[]> = {
  mechanics: ['ruler_cm', 'stopwatch_pro', 'dynamometer_spring', 'photogate_timer', 'protractor_360'],
  waves_osc: ['oscilloscope_cro', 'stopwatch_pro', 'ruler_cm', 'tuning_fork_ref', 'decibel_meter'],
  electricity_mag: ['voltmeter_dc_ac', 'ammeter_dc_ac', 'multimeter_pro', 'gaussmeter_hall', 'magnetic_compass'],
  optics_quantum: ['laser_pointer_rgb', 'protractor_360', 'ruler_cm', 'lux_photometer', 'convex_concave_lens'],
  thermal_nuclear: ['thermometer_probe', 'pressure_manometer', 'calorimeter_cup', 'geiger_counter', 'stopwatch_pro']
};

const SPECIFIC_2D_TOOLS: Partial<Record<PhysicsSimType, string[]>> = {
  ohm_circuit: ['voltmeter_dc_ac', 'ammeter_dc_ac', 'multimeter_pro', 'power_supply_unit', 'rheostat_slider'],
  ac_rlc_circuit: ['oscilloscope_cro', 'voltmeter_dc_ac', 'ammeter_dc_ac', 'capacitor_bank', 'inductor_solenoid'],
  rc_capacitor: ['voltmeter_dc_ac', 'ammeter_dc_ac', 'stopwatch_pro', 'capacitor_bank', 'oscilloscope_cro'],
  wheatstone_bridge: ['multimeter_pro', 'voltmeter_dc_ac', 'rheostat_slider', 'resistor_decade', 'power_supply_unit'],
  transformer_2d: ['voltmeter_dc_ac', 'ammeter_dc_ac', 'inductor_solenoid', 'oscilloscope_cro', 'power_supply_unit'],
  lc_oscillation: ['oscilloscope_cro', 'capacitor_bank', 'inductor_solenoid', 'voltmeter_dc_ac', 'stopwatch_pro'],
  diode_rectifier: ['oscilloscope_cro', 'voltmeter_dc_ac', 'capacitor_bank', 'resistor_decade', 'power_supply_unit'],
  magnetic_induction: ['voltmeter_dc_ac', 'gaussmeter_hall', 'magnetic_compass', 'bar_magnet_ns', 'inductor_solenoid'],
  hall_effect: ['gaussmeter_hall', 'voltmeter_dc_ac', 'ammeter_dc_ac', 'bar_magnet_ns', 'vernier_caliper'],
  electromagnet_crane: ['gaussmeter_hall', 'ammeter_dc_ac', 'dynamometer_spring', 'inductor_solenoid', 'magnetic_compass'],
  cyclotron_accelerator: ['gaussmeter_hall', 'voltmeter_dc_ac', 'photogate_timer', 'ruler_cm'],
  electric_field: ['voltmeter_dc_ac', 'ruler_cm', 'protractor_360', 'multimeter_pro'],
  coulomb_pendulum: ['protractor_360', 'ruler_cm', 'dynamometer_spring', 'analytical_balance'],

  lens_optics: ['convex_concave_lens', 'ruler_cm', 'laser_pointer_rgb', 'protractor_360'],
  telescope_microscope: ['convex_concave_lens', 'ruler_cm', 'laser_pointer_rgb', 'lux_photometer'],
  light_refraction: ['protractor_360', 'laser_pointer_rgb', 'glass_prism_block', 'ruler_cm'],
  prism_dispersion: ['glass_prism_block', 'protractor_360', 'laser_pointer_rgb', 'lux_photometer'],
  spherical_mirror: ['optical_mirror', 'ruler_cm', 'protractor_360', 'laser_pointer_rgb'],
  fiber_optic_tir: ['laser_pointer_rgb', 'protractor_360', 'lux_photometer', 'vernier_caliper'],
  malus_polarization: ['lux_photometer', 'protractor_360', 'laser_pointer_rgb'],
  young_interference: ['laser_pointer_rgb', 'ruler_cm', 'vernier_caliper', 'lux_photometer'],
  single_slit_diffraction: ['laser_pointer_rgb', 'vernier_caliper', 'ruler_cm', 'lux_photometer'],
  thin_film_interference: ['laser_pointer_rgb', 'vernier_caliper', 'lux_photometer'],
  photoelectric_effect: ['ammeter_dc_ac', 'voltmeter_dc_ac', 'laser_pointer_rgb', 'lux_photometer'],
  hydrogen_spectrum: ['laser_pointer_rgb', 'glass_prism_block', 'lux_photometer', 'ruler_cm'],
  compton_scattering: ['protractor_360', 'geiger_counter', 'photogate_timer', 'ruler_cm'],

  projectile_motion: ['protractor_360', 'ruler_cm', 'stopwatch_pro', 'photogate_timer'],
  free_fall_energy: ['ruler_cm', 'stopwatch_pro', 'photogate_timer', 'analytical_balance'],
  spring_pendulum: ['dynamometer_spring', 'coil_spring_ref', 'mass_set', 'stopwatch_pro', 'ruler_cm'],
  spring_oscillation_horizontal: ['coil_spring_ref', 'mass_set', 'dynamometer_spring', 'stopwatch_pro', 'ruler_cm'],
  simple_pendulum: ['pendulum_bob_kit', 'stopwatch_pro', 'protractor_360', 'ruler_cm'],
  atwood_pulley: ['pulley_wheel', 'mass_set', 'dynamometer_spring', 'stopwatch_pro', 'analytical_balance'],
  inclined_plane: ['protractor_360', 'dynamometer_spring', 'mass_set', 'stopwatch_pro', 'ruler_cm'],
  momentum_collision: ['air_track_cart', 'photogate_timer', 'analytical_balance', 'stopwatch_pro'],
  torque_lever: ['ruler_cm', 'dynamometer_spring', 'mass_set', 'analytical_balance'],
  archimedes_buoyancy: ['dynamometer_spring', 'analytical_balance', 'ruler_cm', 'pressure_manometer'],
  centrifuge_banked_curve: ['protractor_360', 'photogate_timer', 'dynamometer_spring', 'ruler_cm'],
  kepler_orbit: ['stopwatch_pro', 'ruler_cm', 'protractor_360', 'photogate_timer'],
  planetary_escape_velocity: ['photogate_timer', 'stopwatch_pro', 'ruler_cm'],

  wave_interference: ['wave_vibrator', 'ruler_cm', 'stopwatch_pro', 'oscilloscope_cro'],
  standing_wave: ['wave_vibrator', 'ruler_cm', 'tuning_fork_ref', 'oscilloscope_cro'],
  damped_resonance: ['wave_vibrator', 'oscilloscope_cro', 'stopwatch_pro', 'dynamometer_spring'],
  beat_waves: ['tuning_fork_ref', 'oscilloscope_cro', 'decibel_meter', 'stopwatch_pro'],
  sound_intensity: ['decibel_meter', 'tuning_fork_ref', 'ruler_cm', 'oscilloscope_cro'],
  doppler_effect: ['decibel_meter', 'oscilloscope_cro', 'photogate_timer', 'ruler_cm'],
  mach_shockwave: ['protractor_360', 'decibel_meter', 'photogate_timer', 'ruler_cm'],
  lissajous_shm: ['oscilloscope_cro', 'stopwatch_pro', 'ruler_cm'],
  coupled_oscillators_2d: ['pendulum_bob_kit', 'coil_spring_ref', 'stopwatch_pro', 'ruler_cm'],

  thermal_gas: ['thermometer_probe', 'pressure_manometer', 'ruler_cm'],
  pv_thermodynamics: ['pressure_manometer', 'thermometer_probe', 'calorimeter_cup'],
  carnot_cycle_pv: ['thermometer_probe', 'pressure_manometer', 'calorimeter_cup'],
  calorimetry_mixing: ['calorimeter_cup', 'thermometer_probe', 'analytical_balance', 'stopwatch_pro'],
  thermal_conduction_bar: ['thermometer_probe', 'ruler_cm', 'stopwatch_pro', 'calorimeter_cup'],
  bernoulli_flow: ['pressure_manometer', 'photogate_timer', 'vernier_caliper', 'ruler_cm'],
  nuclear_decay: ['geiger_counter', 'stopwatch_pro', 'analytical_balance'],
  nuclear_fission: ['geiger_counter', 'thermometer_probe', 'stopwatch_pro'],
  binding_energy_curve: ['geiger_counter', 'analytical_balance']
};

const SPECIFIC_3D_TOOLS: Partial<Record<Physics3DMode, string[]>> = {
  pendulum_spring: ['coil_spring_ref', 'mass_set', 'stopwatch_pro', 'ruler_cm'],
  projectile_3d: ['protractor_360', 'ruler_cm', 'stopwatch_pro', 'photogate_timer'],
  atwood_pulley_3d: ['pulley_wheel', 'mass_set', 'dynamometer_spring', 'stopwatch_pro'],
  newtons_cradle_3d: ['photogate_timer', 'stopwatch_pro', 'analytical_balance', 'protractor_360'],
  foucault_pendulum_3d: ['pendulum_bob_kit', 'protractor_360', 'stopwatch_pro'],
  inclined_plane_3d: ['protractor_360', 'dynamometer_spring', 'mass_set', 'stopwatch_pro'],
  collision_spheres_3d: ['air_track_cart', 'photogate_timer', 'analytical_balance'],
  solenoid_field_3d: ['gaussmeter_hall', 'magnetic_compass', 'ammeter_dc_ac', 'inductor_solenoid'],
  helmholtz_coils_3d: ['gaussmeter_hall', 'magnetic_compass', 'ammeter_dc_ac', 'ruler_cm'],
  lorentz_helix: ['gaussmeter_hall', 'photogate_timer', 'ruler_cm'],
  cyclotron_3d: ['gaussmeter_hall', 'voltmeter_dc_ac', 'photogate_timer'],
  cathode_ray_tube_3d: ['oscilloscope_cro', 'voltmeter_dc_ac', 'ruler_cm'],
  electroscope_3d: ['protractor_360', 'voltmeter_dc_ac', 'ruler_cm'],
  ac_generator_3d: ['oscilloscope_cro', 'voltmeter_dc_ac', 'gaussmeter_hall'],
  dc_motor_3d: ['ammeter_dc_ac', 'voltmeter_dc_ac', 'gaussmeter_hall', 'stopwatch_pro'],
  transformer_3d: ['voltmeter_dc_ac', 'ammeter_dc_ac', 'inductor_solenoid'],
  prism_dispersion_3d: ['glass_prism_block', 'laser_pointer_rgb', 'protractor_360', 'lux_photometer'],
  optics_3d: ['convex_concave_lens', 'laser_pointer_rgb', 'ruler_cm'],
  curved_mirror_3d: ['optical_mirror', 'laser_pointer_rgb', 'ruler_cm', 'protractor_360'],
  double_lens_microscope_3d: ['convex_concave_lens', 'ruler_cm', 'lux_photometer'],
  fiber_optic_3d: ['laser_pointer_rgb', 'protractor_360', 'lux_photometer'],
  polarization_3d: ['lux_photometer', 'protractor_360', 'laser_pointer_rgb'],
  young_interference_3d: ['laser_pointer_rgb', 'ruler_cm', 'lux_photometer'],
  photoelectric_3d: ['ammeter_dc_ac', 'voltmeter_dc_ac', 'laser_pointer_rgb'],
  compton_3d: ['protractor_360', 'geiger_counter', 'photogate_timer'],
  thermal_gas_3d: ['thermometer_probe', 'pressure_manometer'],
  diffusion_gases_3d: ['thermometer_probe', 'pressure_manometer', 'stopwatch_pro'],
  brownian_motion_3d: ['thermometer_probe', 'stopwatch_pro', 'ruler_cm'],
  carnot_piston_3d: ['thermometer_probe', 'pressure_manometer', 'calorimeter_cup'],
  nuclear_fission_3d: ['geiger_counter', 'thermometer_probe', 'stopwatch_pro'],
  rutherford_scattering_3d: ['geiger_counter', 'protractor_360', 'ruler_cm'],
  tokamak_fusion_3d: ['gaussmeter_hall', 'thermometer_probe', 'geiger_counter'],
  bohr_atom: ['laser_pointer_rgb', 'lux_photometer', 'geiger_counter']
};

export function getRecommendedToolsForSim(
  dimension: '2d' | '3d',
  simId: string,
  domainId: PhysicsDomainId
): PhysicsApparatusItem[] {
  const ids =
    dimension === '2d'
      ? SPECIFIC_2D_TOOLS[simId as PhysicsSimType] || DOMAIN_DEFAULT_TOOLS[domainId]
      : SPECIFIC_3D_TOOLS[simId as Physics3DMode] || DOMAIN_DEFAULT_TOOLS[domainId];
  return ids.map((id) => APPARATUS_BY_ID[id]).filter(Boolean);
}

export interface ApparatusLiveReading {
  valueText: string;
  subLabel: string;
  needleDeg?: number; // for compass / analog feedback
  waveFreq?: number; // for oscilloscope
  waveAmp?: number;
}

/**
 * Computes genuine real-time physics readings for placed probe instruments,
 * combining active simulation parameters, elapsed simulation time, and probe position.
 */
export function evaluateApparatusReading(
  toolId: string,
  simId: string,
  params: Record<string, number>,
  simTime: number,
  xPct: number,
  yPct: number
): ApparatusLiveReading {
  // Normalized distance from stage center (used for spatial field/intensity probes)
  const distNorm = Math.hypot((xPct - 50) / 50, (yPct - 50) / 50);
  const proxFactor = Math.max(0.18, 1.15 - distNorm * 0.72);

  switch (toolId) {
    case 'ammeter_dc_ac': {
      if (simId === 'ohm_circuit' || simId === 'wheatstone_bridge') {
        const u = params.voltage ?? params.acPeakV ?? 12;
        const r1 = params.r1 ?? params.resistor1 ?? 10;
        const r2 = params.r2 ?? params.resistor2 ?? 10;
        const req = Math.round(params.circuitType ?? 0) === 1 ? (r1 * r2) / Math.max(0.2, r1 + r2) : r1 + r2;
        const i = u / Math.max(0.2, req);
        return { valueText: `${i.toFixed(2)} A`, subLabel: `I = U / Rtđ` };
      }
      if (simId === 'ac_rlc_circuit') {
        const u0 = params.u0 ?? params.voltage ?? 100;
        const r = Math.max(5, params.r ?? 40);
        const f = params.freq ?? 50;
        const L = params.indL ?? 0.3;
        const C = (params.capC ?? 40) * 1e-6;
        const z = Math.hypot(r, 2 * Math.PI * f * L - 1 / (2 * Math.PI * f * C));
        const iEff = (u0 / Math.SQRT2 / z) * Math.abs(Math.sin(simTime * 3.5));
        return { valueText: `${(u0 / Math.SQRT2 / z).toFixed(2)} A`, subLabel: `i(t) = ${iEff.toFixed(2)} A` };
      }
      const cur = params.currentI ?? params.current ?? 3.5;
      return { valueText: `${cur.toFixed(2)} A`, subLabel: 'Dòng điện mạch' };
    }

    case 'voltmeter_dc_ac': {
      const u =
        params.voltage ??
        params.u0 ??
        params.acPeakV ??
        params.gapVoltageKv ??
        params.voltageUak ??
        12;
      const unit = simId.includes('cyclotron') ? 'kV' : 'V';
      const ripple = simId.includes('ac') || simId.includes('generator') ? Math.cos(simTime * 3.2) : 1;
      return {
        valueText: `${(u * proxFactor * 0.9 + u * 0.1).toFixed(1)} ${unit}`,
        subLabel: simId.includes('ac') ? `u(t) = ${(u * ripple).toFixed(1)} V` : 'Hiệu điện thế đo được'
      };
    }

    case 'multimeter_pro': {
      const r1 = params.r1 ?? params.resistor1 ?? params.r ?? 12;
      const r2 = params.r2 ?? params.resistor2 ?? 10;
      const req = Math.round(params.circuitType ?? 0) === 1 ? (r1 * r2) / Math.max(0.2, r1 + r2) : r1 + r2;
      return { valueText: `${req.toFixed(1)} Ω`, subLabel: 'Đo thông mạch & Ω' };
    }

    case 'gaussmeter_hall': {
      const bBase = params.magneticB ?? params.fieldB ?? params.p1 ?? (params.currentI ? params.currentI * 0.45 : 1.2);
      const bLocalMt = bBase * 1000 * proxFactor;
      return {
        valueText: bLocalMt >= 1000 ? `${(bLocalMt / 1000).toFixed(2)} T` : `${bLocalMt.toFixed(0)} mT`,
        subLabel: 'Cảm ứng từ tại đầu dò'
      };
    }

    case 'magnetic_compass': {
      const bAngle = ((simTime * 45 + (xPct - 50) * 1.4 + (params.magneticB ?? 1) * 28) % 360);
      return {
        valueText: `${Math.round(bAngle)}°`,
        subLabel: 'Hướng véc-tơ B',
        needleDeg: bAngle
      };
    }

    case 'thermometer_probe': {
      const baseK =
        params.tempK ??
        params.tempHotK ??
        (params.tempLeftC !== undefined ? params.tempLeftC + 273.15 : 300);
      const tempRightC = params.tempRightC ?? 20;
      let measuredK = baseK;
      if (simId === 'thermal_conduction_bar') {
        const frac = Math.min(1, Math.max(0, (xPct - 18) / 64));
        const cVal = (params.tempLeftC ?? 100) * (1 - frac) + tempRightC * frac;
        return { valueText: `${cVal.toFixed(1)} °C`, subLabel: `${(cVal + 273.15).toFixed(0)} K (theo vị trí)` };
      }
      measuredK = Math.max(150, baseK * (0.94 + proxFactor * 0.08));
      return {
        valueText: `${(measuredK - 273.15).toFixed(1)} °C`,
        subLabel: `${measuredK.toFixed(0)} K`
      };
    }

    case 'pressure_manometer': {
      const tK = params.tempK ?? params.tempHotK ?? 320;
      const vol = params.volume ?? 10;
      const n = params.moles ?? 1.0;
      const pAtm = (n * 0.0821 * tK) / Math.max(1, vol);
      return { valueText: `${pAtm.toFixed(2)} atm`, subLabel: `${(pAtm * 101.3).toFixed(0)} kPa` };
    }

    case 'dynamometer_spring': {
      const m = params.mass ?? params.m1 ?? params.massKg ?? 2.0;
      const g = params.g ?? 9.81;
      const fVal = simId === 'archimedes_buoyancy'
        ? (params.densityObj ?? 750) * (params.volumeL ?? 4) * 0.001 * g
        : m * g * (1 + 0.18 * Math.sin(simTime * 3.1));
      return { valueText: `${Math.abs(fVal).toFixed(1)} N`, subLabel: 'Lực kéo tức thời' };
    }

    case 'analytical_balance': {
      const m = params.mass ?? params.m1 ?? params.massKg ?? 1.5;
      return { valueText: `${m.toFixed(2)} kg`, subLabel: `${(m * 1000).toFixed(0)} g` };
    }

    case 'photogate_timer': {
      const v =
        params.v0 ??
        params.projV0 ??
        params.speedMs ??
        params.launchV ??
        Math.abs(Math.sin(simTime * 2.5) * (params.amp ?? 3.5) + 1.2);
      return { valueText: `${v.toFixed(2)} m/s`, subLabel: 'Vận tốc qua cổng quang' };
    }

    case 'decibel_meter': {
      const power = params.sourcePower ?? 1.0;
      const dbVal = Math.max(25, Math.min(130, 82 + 10 * Math.log10(power * proxFactor * 1.4)));
      return { valueText: `${dbVal.toFixed(1)} dB`, subLabel: 'Mức âm tại đầu thu' };
    }

    case 'lux_photometer': {
      const polAngle = params.polarizerAngle ?? params.p1 ?? 30;
      const luxPct = simId.includes('polariz') || simId.includes('malus')
        ? Math.pow(Math.cos((polAngle * Math.PI) / 180), 2) * 100
        : Math.min(100, Math.max(12, 88 * proxFactor));
      return { valueText: `${luxPct.toFixed(1)}%`, subLabel: `${Math.round(luxPct * 12)} Lux` };
    }

    case 'laser_pointer_rgb': {
      const lam = params.wavelengthNm ?? params.lambda ?? 532;
      return { valueText: `${lam.toFixed(0)} nm`, subLabel: `f = ${(3e5 / Math.max(200, lam)).toFixed(0)} THz` };
    }

    case 'geiger_counter': {
      const n0 = params.n0 ?? 160;
      const th = params.halfLife ?? 4.0;
      const act = n0 * Math.pow(0.5, simTime / Math.max(0.5, th));
      return {
        valueText: `${Math.max(1, Math.round(act * proxFactor))} Bq`,
        subLabel: `Còn ${((act / n0) * 100).toFixed(0)}% đồng vị`
      };
    }

    case 'oscilloscope_cro': {
      const f = params.freq ?? params.emitFreq ?? params.p1 ?? 2.5;
      const a = params.amp ?? params.u0 ?? 1.0;
      return {
        valueText: `${f.toFixed(1)} Hz`,
        subLabel: `Đỉnh ${a.toFixed(1)} V/đv`,
        waveFreq: Math.min(6, Math.max(1, f * 0.45)),
        waveAmp: Math.min(1, Math.max(0.35, a * 0.1))
      };
    }

    case 'vernier_caliper': {
      const d = params.slitWidthUm ?? params.thicknessMm ?? params.aSlit ?? 1.25;
      const u = params.slitWidthUm ? 'μm' : 'mm';
      return { valueText: `${d.toFixed(2)} ${u}`, subLabel: 'Độ chia 0.02 mm' };
    }

    case 'tuning_fork_ref': {
      const f = params.f1 ?? params.freq ?? 440;
      return { valueText: `${f.toFixed(0)} Hz`, subLabel: 'Âm chuẩn La4' };
    }

    case 'power_supply_unit': {
      const u = params.voltage ?? params.acPeakV ?? 12;
      return { valueText: `${u.toFixed(1)} V`, subLabel: 'Nguồn cấp chuẩn' };
    }

    case 'rheostat_slider': {
      const r = params.r1 ?? params.r ?? 20;
      return { valueText: `${r.toFixed(1)} Ω`, subLabel: 'Biến trở điều chỉnh' };
    }

    case 'capacitor_bank': {
      const c = params.capC ?? params.filterCapUf ?? 100;
      return { valueText: `${c.toFixed(0)} μF`, subLabel: 'Điện dung C' };
    }

    case 'inductor_solenoid': {
      const lVal = (params.indL ?? 0.3) * 1000;
      return { valueText: `${lVal.toFixed(0)} mH`, subLabel: 'Độ tự cảm L' };
    }

    case 'wave_vibrator': {
      const f = params.freq ?? 2.5;
      return { valueText: `${f.toFixed(1)} Hz`, subLabel: 'Tần số kích rung' };
    }

    default:
      return {
        valueText: 'Đang đặt mẫu',
        subLabel: `${Math.round(xPct)}% × ${Math.round(yPct)}%`
      };
  }
}
