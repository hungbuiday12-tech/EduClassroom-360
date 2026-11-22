import type { Physics2DSimSpec, Physics3DSimSpec } from './physicsDomainsData';
import type { Extra3DSceneConfig } from './physicsExtraSimsData';

export type Batch2PhysicsSim2DId =
  | 'archimedes_buoyancy'
  | 'spring_oscillation_horizontal'
  | 'centrifuge_banked_curve'
  | 'planetary_escape_velocity'
  | 'single_slit_diffraction'
  | 'mach_shockwave'
  | 'coupled_oscillators_2d'
  | 'hall_effect'
  | 'cyclotron_accelerator'
  | 'electromagnet_crane'
  | 'diode_rectifier'
  | 'telescope_microscope'
  | 'thin_film_interference'
  | 'compton_scattering'
  | 'fiber_optic_tir'
  | 'carnot_cycle_pv'
  | 'thermal_conduction_bar'
  | 'binding_energy_curve';

export type Batch2Physics3DModeId =
  | 'atwood_pulley_3d'
  | 'newtons_cradle_3d'
  | 'foucault_pendulum_3d'
  | 'transverse_longitudinal_3d'
  | 'lissajous_3d'
  | 'acoustic_interference_3d'
  | 'cyclotron_3d'
  | 'cathode_ray_tube_3d'
  | 'helmholtz_coils_3d'
  | 'electroscope_3d'
  | 'fiber_optic_3d'
  | 'compton_3d'
  | 'double_lens_microscope_3d'
  | 'diffusion_gases_3d'
  | 'brownian_motion_3d'
  | 'tokamak_fusion_3d';

export const BATCH2_PHYSICS_2D_SIMS: Record<Batch2PhysicsSim2DId, Physics2DSimSpec> = {
  // MECHANICS (+4)
  archimedes_buoyancy: {
    id: 'archimedes_buoyancy',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Lực Đẩy Ác-si-mét & Điều Kiện Nổi',
    subtitle: 'Nhúng khối vật liệu vào chất lỏng khảo sát P, lực đẩy F_A và mực chất lỏng dâng lên',
    formula: 'F_A = ρ_lỏng · g · V_chìm · P = m·g',
    linkedLessonId: 'phys-10-b34',
    defaultParams: { densityObj: 750, densityFluid: 1000, volumeL: 4.0 },
    paramBounds: {
      densityObj: { min: 200, max: 3000, step: 50, unit: 'kg/m³', label: 'Khối lượng riêng vật ρ' },
      densityFluid: { min: 600, max: 2000, step: 50, unit: 'kg/m³', label: 'Khối lượng riêng chất lỏng' },
      volumeL: { min: 1.0, max: 10.0, step: 0.5, unit: 'lít', label: 'Thể tích khối V' }
    },
    presets: [
      { label: 'Gỗ nổi trên nước', description: 'ρ = 750 < 1000 → nổi 25%', params: { densityObj: 750, densityFluid: 1000, volumeL: 4.0 } },
      { label: 'Nước đá lơ lửng', description: 'ρ = 920 nổi nhẹ mặt thoáng', params: { densityObj: 920, densityFluid: 1000, volumeL: 5.0 } },
      { label: 'Sắt chìm trong nước', description: 'ρ = 2600 > 1000 → chìm đáy', params: { densityObj: 2600, densityFluid: 1000, volumeL: 3.0 } }
    ]
  },
  spring_oscillation_horizontal: {
    id: 'spring_oscillation_horizontal',
    domainId: 'mechanics',
    grades: ['Lớp 10', 'Lớp 11'],
    title: 'Con Lắc Lò Xo Nằm Ngang Có Ma Sát',
    subtitle: 'Dao động con lắc lò xo trên mặt bàn có hệ số ma sát trượt μ làm giảm biên độ theo từng nửa chu kì',
    formula: 'ΔA = 2μmg / k · T = 2π√(m/k)',
    linkedLessonId: 'phys-ext-1',
    defaultParams: { kSpring: 40, mass: 1.0, mu: 0.08 },
    paramBounds: {
      kSpring: { min: 15, max: 100, step: 5, unit: 'N/m', label: 'Độ cứng k' },
      mass: { min: 0.4, max: 3.0, step: 0.2, unit: 'kg', label: 'Khối lượng m' },
      mu: { min: 0, max: 0.3, step: 0.02, unit: '', label: 'Hệ số ma sát μ' }
    },
    presets: [
      { label: 'Ma sát nhỏ (μ=0.06)', description: 'Tắt dần chậm qua nhiều chu kì', params: { kSpring: 45, mass: 1.0, mu: 0.06 } },
      { label: 'Mặt băng trơn (μ=0)', description: 'Bảo toàn cơ năng hoàn toàn', params: { kSpring: 40, mass: 1.0, mu: 0 } },
      { label: 'Ma sát lớn (μ=0.22)', description: 'Tắt nhanh sau vài dao động', params: { kSpring: 35, mass: 1.2, mu: 0.22 } }
    ]
  },
  centrifuge_banked_curve: {
    id: 'centrifuge_banked_curve',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Xe Vào Khúc Cua Nghiêng & Lực Hướng Tâm',
    subtitle: 'Phân tích phản lực N, ma sát nghỉ và góc nghiêng mặt đường θ giúp xe ôm cua an toàn',
    formula: 'v_max = √(R·g·tanθ) · F_ht = mv²/R',
    linkedLessonId: 'phys-10-b32',
    defaultParams: { speedMs: 18, radiusM: 45, bankDeg: 18 },
    paramBounds: {
      speedMs: { min: 5, max: 40, step: 1, unit: 'm/s', label: 'Vận tốc xe v' },
      radiusM: { min: 20, max: 100, step: 5, unit: 'm', label: 'Bán kính cua R' },
      bankDeg: { min: 0, max: 40, step: 2, unit: '°', label: 'Góc nghiêng mặt đường θ' }
    },
    presets: [
      { label: 'Cua cân bằng lí tưởng', description: 'Không cần ma sát ngang', params: { speedMs: 12, radiusM: 45, bankDeg: 18 } },
      { label: 'Tốc độ cao đường bằng', description: 'θ = 0°, dễ trượt li tâm', params: { speedMs: 28, radiusM: 35, bankDeg: 0 } },
      { label: 'Đường đua nghiêng 32°', description: 'Ôm cua tốc độ cao an toàn', params: { speedMs: 30, radiusM: 60, bankDeg: 32 } }
    ]
  },
  planetary_escape_velocity: {
    id: 'planetary_escape_velocity',
    domainId: 'mechanics',
    grades: ['Lớp 10', 'Lớp 11'],
    title: 'Vận Tốc Vũ Trụ Cấp I & Cấp II Phóng Vệ Tinh',
    subtitle: 'Thay đổi vận tốc phóng ngang từ trạm quỹ đạo để quan sát quỹ đạo tròn, elip hay thoát li vĩnh viễn',
    formula: 'v₁ = √(GM/R) = 7.9 km/s · v₂ = √2 · v₁',
    linkedLessonId: 'phys-cd-11-1',
    defaultParams: { launchV: 8.2, altitudeKm: 600, massIndex: 1.0 },
    paramBounds: {
      launchV: { min: 4.5, max: 12.5, step: 0.2, unit: 'km/s', label: 'Vận tốc phóng v' },
      altitudeKm: { min: 200, max: 2000, step: 100, unit: 'km', label: 'Độ cao quỹ đạo h' },
      massIndex: { min: 0.5, max: 1.5, step: 0.1, unit: 'M⊕', label: 'Khối lượng hành tinh' }
    },
    presets: [
      { label: 'Quỹ đạo tròn cấp I', description: 'v ≈ 7.6 km/s tại h = 600 km', params: { launchV: 7.6, altitudeKm: 600, massIndex: 1.0 } },
      { label: 'Quỹ đạo elip dẹt', description: 'v = 9.4 km/s', params: { launchV: 9.4, altitudeKm: 500, massIndex: 1.0 } },
      { label: 'Thoát trường hấp dẫn (v₂)', description: 'v ≥ 11.2 km/s bay ra ngoài', params: { launchV: 11.6, altitudeKm: 500, massIndex: 1.0 } }
    ]
  },

  // WAVES & OSCILLATIONS (+3)
  single_slit_diffraction: {
    id: 'single_slit_diffraction',
    domainId: 'waves_osc',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Nhiễu Xạ Ánh Sáng Qua Một Khe Hẹp',
    subtitle: 'Biểu đồ phân bố cường độ sáng I(θ) = I₀·(sinβ/β)² với vân trung tâm rộng gấp đôi vân phụ',
    formula: 'a·sinθ_k = k·λ · Δy_TT = 2λD / a',
    linkedLessonId: 'phys-ext-4',
    defaultParams: { slitWidthUm: 40, wavelengthNm: 550, screenDistM: 1.5 },
    paramBounds: {
      slitWidthUm: { min: 15, max: 100, step: 5, unit: 'μm', label: 'Bề rộng khe a' },
      wavelengthNm: { min: 400, max: 700, step: 10, unit: 'nm', label: 'Bước sóng λ' },
      screenDistM: { min: 0.8, max: 3.0, step: 0.2, unit: 'm', label: 'Khoảng cách màn D' }
    },
    presets: [
      { label: 'Laser lục (532nm)', description: 'Đỉnh trung tâm sắc nét', params: { slitWidthUm: 45, wavelengthNm: 530, screenDistM: 1.6 } },
      { label: 'Khe siêu hẹp (20μm)', description: 'Vân nhiễu xạ mở rộng mạnh', params: { slitWidthUm: 20, wavelengthNm: 630, screenDistM: 1.8 } },
      { label: 'Tia tím (410nm)', description: 'Vân sáng thu hẹp', params: { slitWidthUm: 50, wavelengthNm: 410, screenDistM: 1.5 } }
    ]
  },
  mach_shockwave: {
    id: 'mach_shockwave',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Nón Sóng Xung Kích Siêu Thanh (Số Mach)',
    subtitle: 'Quan sát nguồn âm vượt tốc độ truyền âm tạo đường bao hình nón Mach với góc mở sinα = v/v_s = 1/M',
    formula: 'sinα = 1 / M = v_âm / v_nguồn',
    linkedLessonId: 'phys-doppler-effect',
    defaultParams: { machNumber: 1.45, waveSpeed: 340, emitFreq: 3.0 },
    paramBounds: {
      machNumber: { min: 0.6, max: 2.5, step: 0.05, unit: 'Mach', label: 'Số Mach (v_s / v)' },
      waveSpeed: { min: 280, max: 400, step: 20, unit: 'm/s', label: 'Tốc độ truyền âm' },
      emitFreq: { min: 1.5, max: 5.0, step: 0.5, unit: 'Hz', label: 'Tần số xung nguồn' }
    },
    presets: [
      { label: 'Cận âm (M=0.8)', description: 'Chưa hình thành sóng xung kích', params: { machNumber: 0.8, waveSpeed: 340, emitFreq: 3.0 } },
      { label: 'Bức tường âm (M=1.0)', description: 'Đầu sóng chập làm một mặt phẳng', params: { machNumber: 1.0, waveSpeed: 340, emitFreq: 3.5 } },
      { label: 'Siêu thanh (M=1.8)', description: 'Nón Mach góc hẹp α = 33.7°', params: { machNumber: 1.8, waveSpeed: 340, emitFreq: 3.0 } }
    ]
  },
  coupled_oscillators_2d: {
    id: 'coupled_oscillators_2d',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Dao Động Ghép Nối & Truyền Năng Lượng Phách',
    subtitle: 'Hai con lắc nối bằng lò xo ghép k_c trao đổi tuần hoàn động năng và thế năng cho nhau',
    formula: 'ω₁ = √(g/l) · ω₂ = √(g/l + 2k_c/m)',
    linkedLessonId: 'phys-11-resonance',
    defaultParams: { kCouple: 12, lengthM: 1.2, massKg: 1.0 },
    paramBounds: {
      kCouple: { min: 2, max: 30, step: 2, unit: 'N/m', label: 'Độ cứng lò xo ghép k_c' },
      lengthM: { min: 0.6, max: 2.5, step: 0.1, unit: 'm', label: 'Chiều dài dây l' },
      massKg: { min: 0.5, max: 2.5, step: 0.25, unit: 'kg', label: 'Khối lượng mỗi vật' }
    },
    presets: [
      { label: 'Ghép yếu (k_c=6)', description: 'Năng lượng truyền qua lại chậm', params: { kCouple: 6, lengthM: 1.2, massKg: 1.0 } },
      { label: 'Ghép trung bình', description: 'Nhịp phách năng lượng rõ rệt', params: { kCouple: 14, lengthM: 1.2, massKg: 1.0 } },
      { label: 'Ghép mạnh (k_c=26)', description: 'Truyền năng lượng cực nhanh', params: { kCouple: 26, lengthM: 1.0, massKg: 0.75 } }
    ]
  },

  // ELECTRICITY & MAGNETISM (+4)
  hall_effect: {
    id: 'hall_effect',
    domainId: 'electricity_mag',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Hiệu Ứng Hall & Cảm Biến Từ Trường',
    subtitle: 'Hạt tải điện bị lực Lorentz dạt sang hai mép bản dẫn tạo hiệu điện thế Hall U_H = I·B/(n·q·d)',
    formula: 'U_H = (I · B) / (n · e · d)',
    linkedLessonId: 'phys-ext-7',
    defaultParams: { currentI: 4.0, magneticB: 1.2, thicknessMm: 2.0 },
    paramBounds: {
      currentI: { min: 1.0, max: 10.0, step: 0.5, unit: 'A', label: 'Dòng điện I' },
      magneticB: { min: 0.2, max: 2.5, step: 0.1, unit: 'T', label: 'Cảm ứng từ B' },
      thicknessMm: { min: 0.5, max: 5.0, step: 0.5, unit: 'mm', label: 'Bề dày tấm dẫn d' }
    },
    presets: [
      { label: 'Tấm bán dẫn chuẩn', description: 'Đo U_H tỉ lệ thuận B', params: { currentI: 4.0, magneticB: 1.2, thicknessMm: 2.0 } },
      { label: 'Từ trường mạnh 2.2T', description: 'U_H tăng cao gần gấp đôi', params: { currentI: 6.0, magneticB: 2.2, thicknessMm: 1.5 } }
    ]
  },
  cyclotron_accelerator: {
    id: 'cyclotron_accelerator',
    domainId: 'electricity_mag',
    grades: ['Lớp 12'],
    title: 'Máy Gia Tốc Hạt Cyclotron 2 Hộp Chữ D',
    subtitle: 'Proton tăng tốc mỗi lần băng qua khe điện trường xoay chiều và uốn cong trong từ trường B',
    formula: 'f_c = qB / (2πm) · R_max = √(2mE_max) / (qB)',
    linkedLessonId: 'phys-ext-7',
    defaultParams: { magneticB: 1.5, gapVoltageKv: 40, chargeQ: 1 },
    paramBounds: {
      magneticB: { min: 0.6, max: 2.6, step: 0.1, unit: 'T', label: 'Cảm ứng từ B' },
      gapVoltageKv: { min: 15, max: 80, step: 5, unit: 'kV', label: 'Điện áp khe U' },
      chargeQ: { min: 1, max: 2, step: 1, unit: 'e', label: 'Điện tích hạt q' }
    },
    presets: [
      { label: 'Proton gia tốc chuẩn', description: 'B = 1.5 T, U = 40 kV', params: { magneticB: 1.5, gapVoltageKv: 40, chargeQ: 1 } },
      { label: 'Hạt Alpha (q=2e)', description: 'Tăng năng lượng mỗi vòng nhanh', params: { magneticB: 1.8, gapVoltageKv: 60, chargeQ: 2 } }
    ]
  },
  electromagnet_crane: {
    id: 'electromagnet_crane',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Nam Châm Điện & Sức Nâng Cần Cẩu Từ',
    subtitle: 'Thay đổi số vòng dây N, dòng điện I và độ hở lõi sắt để khảo sát từ trường và lực hút vật từ',
    formula: 'B = μ₀·μ_r·n·I · F ∝ B²·S',
    linkedLessonId: 'phys-12-b14',
    defaultParams: { currentI: 5.0, turnsN: 300, ironCore: 1 },
    paramBounds: {
      currentI: { min: 0, max: 12, step: 0.5, unit: 'A', label: 'Cường độ dòng I' },
      turnsN: { min: 50, max: 600, step: 25, unit: 'vòng', label: 'Số vòng cuộn dây N' },
      ironCore: { min: 0, max: 1, step: 1, unit: '', label: 'Lõi sắt non (0:Không / 1:Có)' }
    },
    presets: [
      { label: 'Bật lõi sắt hút nặng', description: 'Từ cảm tăng gấp nhiều lần', params: { currentI: 6.5, turnsN: 450, ironCore: 1 } },
      { label: 'Không lõi sắt (cuộn không)', description: 'Lực nâng rất yếu', params: { currentI: 6.5, turnsN: 450, ironCore: 0 } }
    ]
  },
  diode_rectifier: {
    id: 'diode_rectifier',
    domainId: 'electricity_mag',
    grades: ['Lớp 12'],
    title: 'Mạch Chỉnh Lưu Điốt & Tụ Lọc Nguồn DC',
    subtitle: 'So sánh chỉnh lưu nửa chu kì với cầu 4 điốt kèm tụ lọc C làm phẳng điện áp ra tải R',
    formula: 'U_DC ≈ U₀ · ΔU ≈ I_tải / (2f·C)',
    linkedLessonId: 'phys-cd-11-3',
    defaultParams: { acPeakV: 12, bridgeMode: 1, filterCapUf: 120 },
    paramBounds: {
      acPeakV: { min: 4, max: 24, step: 1, unit: 'V', label: 'Biên độ AC vào U₀' },
      bridgeMode: { min: 0, max: 1, step: 1, unit: '', label: 'Chế độ (0:Nửa / 1:Cầu 4 Điốt)' },
      filterCapUf: { min: 0, max: 300, step: 20, unit: 'μF', label: 'Tụ lọc phẳng C' }
    },
    presets: [
      { label: 'Nửa chu kì không tụ', description: 'Chỉ dẫn bán kì dương', params: { acPeakV: 12, bridgeMode: 0, filterCapUf: 0 } },
      { label: 'Cầu 4 điốt + Tụ lọc', description: 'Đầu ra DC phẳng ổn định', params: { acPeakV: 12, bridgeMode: 1, filterCapUf: 220 } }
    ]
  },

  // OPTICS & QUANTUM (+4)
  telescope_microscope: {
    id: 'telescope_microscope',
    domainId: 'optics_quantum',
    grades: ['Lớp 11'],
    title: 'Quang Hệ Kính Hiển Vi & Kính Thiên Văn (2 Thấu Kính)',
    subtitle: 'Tạo ảnh trung gian qua vật kính L₁ rồi phóng đại góc trông qua thị kính L₂',
    formula: 'G_∞ = δ·Đ / (f₁·f₂) · G_tv = f₁ / f₂',
    linkedLessonId: 'phys-pro-4',
    defaultParams: { f1Cm: 10, f2Cm: 4, objDistCm: 14 },
    paramBounds: {
      f1Cm: { min: 5, max: 25, step: 1, unit: 'cm', label: 'Tiêu cự vật kính f₁' },
      f2Cm: { min: 2, max: 12, step: 0.5, unit: 'cm', label: 'Tiêu cự thị kính f₂' },
      objDistCm: { min: 7, max: 40, step: 1, unit: 'cm', label: 'Khoảng cách vật d₁' }
    },
    presets: [
      { label: 'Chế độ Kính hiển vi', description: 'f₁ nhỏ, vật sát tiêu điểm F₁', params: { f1Cm: 8, f2Cm: 3.5, objDistCm: 11 } },
      { label: 'Chế độ Kính thiên văn', description: 'f₁ lớn, f₂ nhỏ (G = f₁/f₂)', params: { f1Cm: 22, f2Cm: 4, objDistCm: 36 } }
    ]
  },
  thin_film_interference: {
    id: 'thin_film_interference',
    domainId: 'optics_quantum',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Giao Thoa Bản Mỏng Xà Phòng & Phủ Chống Phản Xạ',
    subtitle: 'Hai tia phản xạ mặt trước và mặt sau màng mỏng giao thoa tăng cường hoặc triệt tiêu theo độ dày d',
    formula: '2n·d·cosr = (k + ½)λ (Cực đại phản xạ)',
    linkedLessonId: 'phys-ext-4',
    defaultParams: { thicknessNm: 260, filmIndexN: 1.38, wavelengthNm: 550 },
    paramBounds: {
      thicknessNm: { min: 60, max: 700, step: 10, unit: 'nm', label: 'Độ dày màng d' },
      filmIndexN: { min: 1.2, max: 1.7, step: 0.02, unit: '', label: 'Chiết suất màng n' },
      wavelengthNm: { min: 400, max: 700, step: 10, unit: 'nm', label: 'Bước sóng λ' }
    },
    presets: [
      { label: 'Lớp phủ chống chói (d=λ/4n)', description: 'Triệt tiêu ánh sáng phản xạ', params: { thicknessNm: 100, filmIndexN: 1.38, wavelengthNm: 550 } },
      { label: 'Bong bóng xà phòng rực sắc', description: 'Giao thoa tăng cường màu vàng-lục', params: { thicknessNm: 295, filmIndexN: 1.34, wavelengthNm: 530 } }
    ]
  },
  compton_scattering: {
    id: 'compton_scattering',
    domainId: 'optics_quantum',
    grades: ['Lớp 12'],
    title: 'Tán Xạ Lượng Tử Compton (Photon – Electron)',
    subtitle: 'Photon tia X va chạm đàn hồi vào electron tự do làm bước sóng tăng thêm Δλ = λ_C(1 − cosθ)',
    formula: 'Δλ = (h / m_ec)·(1 − cosθ) = 2.426 pm · (1 − cosθ)',
    linkedLessonId: 'phys-ext-5',
    defaultParams: { scatterAngleDeg: 90, incidentPm: 40 },
    paramBounds: {
      scatterAngleDeg: { min: 10, max: 175, step: 5, unit: '°', label: 'Góc tán xạ photon θ' },
      incidentPm: { min: 15, max: 100, step: 5, unit: 'pm', label: 'Bước sóng ban đầu λ' }
    },
    presets: [
      { label: 'Tán xạ vuông góc (90°)', description: 'Độ dịch Δλ = λ_C = 2.43 pm', params: { scatterAngleDeg: 90, incidentPm: 40 } },
      { label: 'Va chạm bật ngược (180°)', description: 'Electron giật lùi động năng cực đại', params: { scatterAngleDeg: 180, incidentPm: 25 } }
    ]
  },
  fiber_optic_tir: {
    id: 'fiber_optic_tir',
    domainId: 'optics_quantum',
    grades: ['Lớp 11'],
    title: 'Cáp Quang & Phản Xạ Toàn Phần Dẫn Tín Hiệu',
    subtitle: 'Tia sáng truyền trong lõi chiết suất n₁ lớn hơn vỏ n₂ liên tục phản xạ toàn phần với mọi góc i ≥ i_gh',
    formula: 'sin(i_gh) = n₂ / n₁ · NA = √(n₁² - n₂²)',
    linkedLessonId: 'phys-ext-10',
    defaultParams: { nCore: 1.52, nClad: 1.36, launchAngleDeg: 22 },
    paramBounds: {
      nCore: { min: 1.4, max: 1.8, step: 0.02, unit: '', label: 'Chiết suất lõi n₁' },
      nClad: { min: 1.0, max: 1.48, step: 0.02, unit: '', label: 'Chiết suất vỏ n₂' },
      launchAngleDeg: { min: 5, max: 58, step: 1, unit: '°', label: 'Góc phóng tia θ' }
    },
    presets: [
      { label: 'Dẫn quang học chuẩn', description: 'Tia sáng giữ kín trong lõi cáp', params: { nCore: 1.52, nClad: 1.36, launchAngleDeg: 22 } },
      { label: 'Góc phóng quá lớn (thoát tia)', description: 'Rò rỉ ánh sáng ra vỏ bọc n₂', params: { nCore: 1.48, nClad: 1.42, launchAngleDeg: 45 } }
    ]
  },

  // THERMAL & NUCLEAR (+3)
  carnot_cycle_pv: {
    id: 'carnot_cycle_pv',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Chu Trình Nhiệt Carnot 4 Quá Trình (p–V)',
    subtitle: 'Khảo sát đẳng nhiệt nóng, đoạn nhiệt giãn, đẳng nhiệt lạnh và đoạn nhiệt nén trên giản đồ p–V',
    formula: 'H_Carnot = 1 − T₂ / T₁ = A / Q₁',
    linkedLessonId: 'phys-ext-8',
    defaultParams: { tempHotK: 800, tempColdK: 300, compressionRatio: 3.0 },
    paramBounds: {
      tempHotK: { min: 450, max: 1200, step: 25, unit: 'K', label: 'Nhiệt độ nguồn nóng T₁' },
      tempColdK: { min: 200, max: 420, step: 20, unit: 'K', label: 'Nhiệt độ nguồn lạnh T₂' },
      compressionRatio: { min: 1.5, max: 5.0, step: 0.25, unit: '×', label: 'Tỉ số giãn nở V₂/V₁' }
    },
    presets: [
      { label: 'Chu trình hiệu suất 62.5%', description: 'T₁ = 800 K, T₂ = 300 K', params: { tempHotK: 800, tempColdK: 300, compressionRatio: 3.0 } },
      { label: 'Chênh nhiệt nhỏ (25%)', description: 'T₁ = 450 K, T₂ = 340 K', params: { tempHotK: 450, tempColdK: 340, compressionRatio: 2.2 } }
    ]
  },
  thermal_conduction_bar: {
    id: 'thermal_conduction_bar',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Truyền Nhiệt Dẫn Qua Thanh Kim Loại (Fourier)',
    subtitle: 'Quan sát phân bố nhiệt độ T(x) dọc theo thanh nối giữa nguồn nóng T₁ và nguồn lạnh T₂',
    formula: 'Φ = Q/t = λ_th · S · (T₁ − T₂) / L',
    linkedLessonId: 'phys-12-b4',
    defaultParams: { tempLeftC: 100, tempRightC: 20, conductivity: 380 },
    paramBounds: {
      tempLeftC: { min: 40, max: 200, step: 10, unit: '°C', label: 'Nhiệt độ đầu nóng' },
      tempRightC: { min: 0, max: 80, step: 5, unit: '°C', label: 'Nhiệt độ đầu lạnh' },
      conductivity: { min: 40, max: 420, step: 20, unit: 'W/mK', label: 'Hệ số dẫn nhiệt λ' }
    },
    presets: [
      { label: 'Thanh Đồng nguyên chất', description: 'λ = 385 W/m·K dẫn nhiệt cực nhanh', params: { tempLeftC: 120, tempRightC: 20, conductivity: 385 } },
      { label: 'Thanh Thép không gỉ', description: 'λ = 45 W/m·K giữ độ chênh lớn', params: { tempLeftC: 120, tempRightC: 20, conductivity: 45 } }
    ]
  },
  binding_energy_curve: {
    id: 'binding_energy_curve',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Đường Cong Năng Lượng Liên Kết Riêng Hạt Nhân',
    subtitle: 'So sánh độ bền vững từ ¹H, ⁴He đến ⁵⁶Fe (đỉnh bền nhất) và ²³⁵U cùng phản ứng nhiệt hạch/phân hạch',
    formula: 'W_lkr = Δm·c² / A (MeV / nuclôn)',
    linkedLessonId: 'phys-12-nuclear',
    defaultParams: { massNumberA: 56, fusionBoost: 1.0 },
    paramBounds: {
      massNumberA: { min: 2, max: 238, step: 2, unit: 'A', label: 'Số khối hạt nhân A' },
      fusionBoost: { min: 0.5, max: 1.8, step: 0.1, unit: '×', label: 'Tỉ lệ hiển thị năng lượng' }
    },
    presets: [
      { label: 'Sắt ⁵⁶Fe (Bền vững nhất)', description: 'Đỉnh ≈ 8.8 MeV/nuclôn', params: { massNumberA: 56, fusionBoost: 1.0 } },
      { label: 'Vùng Nhiệt Hạch (²H → ⁴He)', description: 'Độ dốc cao tạo năng lượng lớn', params: { massNumberA: 4, fusionBoost: 1.2 } },
      { label: 'Vùng Phân Hạch (²³⁵U)', description: 'Tách thành 2 hạt trung bình bền hơn', params: { massNumberA: 235, fusionBoost: 1.0 } }
    ]
  }
};

export const BATCH2_PHYSICS_3D_SIMS: Record<Batch2Physics3DModeId, Physics3DSimSpec> = {
  // MECHANICS (+3)
  atwood_pulley_3d: {
    id: 'atwood_pulley_3d',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Máy Atwood & Ròng Rọc 3D',
    subtitle: 'Hai khối m₁, m₂ treo qua ròng rọc quay thật theo định luật II Newton trong không gian 3D',
    formula: 'a = (m₂ - m₁)g / (m₁ + m₂)',
    linkedLessonId: 'phys-10-b17',
    presets: [
      { label: 'Gia tốc chuẩn', description: 'm₂ nặng hơn m₁ vừa phải', settings: { speed: 1, amplitude: 1.4 } },
      { label: 'Cân bằng tĩnh', description: 'm₁ ≈ m₂ đứng yên', settings: { speed: 1, amplitude: 1.0 } }
    ]
  },
  newtons_cradle_3d: {
    id: 'newtons_cradle_3d',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Con Lắc Newton Bảo Toàn Động Lượng 3D',
    subtitle: 'Chuỗi bi thép va chạm đàn hồi truyền gần như toàn bộ động lượng & động năng xuyên qua dãy bi',
    formula: 'Σp_trước = Σp_sau · ΣW_đ = const',
    linkedLessonId: 'phys-10-b29',
    presets: [
      { label: 'Va chạm 1 bi chuẩn', description: '1 bi đập làm 1 bi đối diện văng', settings: { speed: 1, amplitude: 1 } },
      { label: 'Va chạm 2 bi mạnh', description: 'Tăng góc nâng & tốc độ', settings: { speed: 1.3, amplitude: 1.4 } }
    ]
  },
  foucault_pendulum_3d: {
    id: 'foucault_pendulum_3d',
    domainId: 'mechanics',
    grades: ['Lớp 10', 'Lớp 11'],
    title: 'Con Lắc Foucault & Tiến Động Mặt Phẳng Quay 3D',
    subtitle: 'Quan sát vệt dao động con lắc dài quay chậm trên mặt sàn chứng minh sự tự quay của Trái Đất',
    formula: 'Ω_quay = ω_TĐ · sinφ',
    linkedLessonId: 'phys-ext-2',
    presets: [
      { label: 'Vĩ độ trung bình (45°)', description: 'Mặt phẳng dao động xoay đều', settings: { speed: 1, amplitude: 1 } },
      { label: 'Tại Cực Bắc (90°)', description: 'Tốc độ tiến động nhanh nhất', settings: { speed: 1.5, amplitude: 1.4 } }
    ]
  },

  // WAVES & OSC (+3)
  transverse_longitudinal_3d: {
    id: 'transverse_longitudinal_3d',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'So Sánh Sóng Ngang & Sóng Dọc 3D',
    subtitle: 'Hiển thị song song sóng ngang (lệch vuông góc) và sóng dọc (nén giãn dọc phương truyền) bằng lưới bi 3D',
    formula: 'u = A·cos(ωt - 2πx/λ)',
    linkedLessonId: 'phys-11-b9',
    presets: [
      { label: 'Tần số đồng bộ', description: 'Dễ so sánh phương dao động ⊥ và //', settings: { speed: 1, frequency: 1 } },
      { label: 'Sóng biên độ lớn', description: 'Tăng rõ điểm nén/giãn và đỉnh sóng', settings: { speed: 1.2, amplitude: 1.4, frequency: 1.2 } }
    ]
  },
  lissajous_3d: {
    id: 'lissajous_3d',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Đường Cong Không Gian Lissajous 3D',
    subtitle: 'Tổng hợp 3 dao động điều hòa vuông góc trên 3 trục X, Y, Z vẽ nên nút thắt 3D kỳ ảo',
    formula: 'x = A·sin(ω_xt + δ), y = B·sin(ω_yt), z = C·sin(ω_zt)',
    linkedLessonId: 'phys-11-b3',
    presets: [
      { label: 'Tỉ lệ tần số 2:3', description: 'Hình thắt nơ đối xứng đẹp mắt', settings: { speed: 1, frequency: 1.5 } },
      { label: 'Tỉ lệ 3:4 nhanh', description: 'Vẽ đường 3D nhiều nút', settings: { speed: 1.4, frequency: 1.33 } }
    ]
  },
  acoustic_interference_3d: {
    id: 'acoustic_interference_3d',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Giao Thoa Hai Nguồn Âm Thanh 3D',
    subtitle: 'Hai loa kết hợp tạo vùng cộng hưởng áp suất cực đại & vùng triệt tiêu âm thanh trong phòng 3D',
    formula: 'Δd = kλ (Cực đại) · Δd = (k+½)λ (Triệt tiêu)',
    linkedLessonId: 'phys-11-b12',
    presets: [
      { label: 'Hai loa đồng pha', description: 'Cực đại ngay chính giữa', settings: { speed: 1, frequency: 1 } },
      { label: 'Tần số cao (nhiều vân)', description: 'Bước sóng ngắn tạo dày đặc vân âm', settings: { speed: 1.1, frequency: 1.6 } }
    ]
  },

  // ELECTRICITY & MAG (+4)
  cyclotron_3d: {
    id: 'cyclotron_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 12'],
    title: 'Máy Gia Tốc Hạt Cyclotron 3D',
    subtitle: 'Hai bán hộp chữ D kim loại đặt trong từ trường dọc gia tốc proton xoắn ốc ra ngoài',
    formula: 'R = mv / (qB) · E_max = (qBR)² / (2m)',
    linkedLessonId: 'phys-ext-7',
    presets: [
      { label: 'Gia tốc xoắn ốc', description: 'Từ trường 1.5T, góc nghiêng rõ', settings: { speed: 1, amplitude: 1 } },
      { label: 'Chùm năng lượng cao', description: 'Tốc độ tăng tốc nhanh', settings: { speed: 1.6, amplitude: 1.3 } }
    ]
  },
  cathode_ray_tube_3d: {
    id: 'cathode_ray_tube_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Ống Tia Âm Cực (CRT) & Lệch Điện Từ 3D',
    subtitle: 'Chùm electron bắn qua hai cặp bản cực tụ điện lệch theo parabol trước khi chạm màn huỳnh quang',
    formula: 'y = (e·U·L²) / (2·m·d·v₀²)',
    linkedLessonId: 'phys-cd-11-3',
    presets: [
      { label: 'Quét tia ngang chuẩn', description: 'Vẽ điểm sáng quét trên màn', settings: { speed: 1, amplitude: 1 } },
      { label: 'Độ lệch cao', description: 'Tăng điện áp cặp bản lái tia', settings: { speed: 1.2, amplitude: 1.6 } }
    ]
  },
  helmholtz_coils_3d: {
    id: 'helmholtz_coils_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 12'],
    title: 'Cặp Cuộn Helmholtz Tạo Từ Trường Đều 3D',
    subtitle: 'Hai cuộn tròn đặt cách nhau đúng bằng bán kính R sinh vùng từ trường đồng nhất ở tâm',
    formula: 'B_tâm = (4/5)^(3/2) · μ₀·N·I / R',
    linkedLessonId: 'phys-12-b16',
    presets: [
      { label: 'Khoảng cách chuẩn d = R', description: 'Độ đồng nhất từ trường cực đại', settings: { speed: 1, amplitude: 1 } },
      { label: 'Dòng cường độ cao', description: 'Đường sức dày và rõ nét', settings: { speed: 1.3, amplitude: 1.5 } }
    ]
  },
  electroscope_3d: {
    id: 'electroscope_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 11'],
    title: 'Điện Nghiệm Tĩnh Điện Lá Vàng 3D',
    subtitle: 'Đưa thanh mang điện lại gần quả cầu đồng làm hai lá vàng xòe góc tỉ lệ với độ lớn điện tích |q|',
    formula: 'F_e = k·q² / r² · góc xòe θ ∝ |q|',
    linkedLessonId: 'phys-11-efield',
    presets: [
      { label: 'Tích điện trung bình', description: 'Hai lá vàng xòe góc 35°', settings: { speed: 1, amplitude: 1 } },
      { label: 'Tích điện cực mạnh', description: 'Góc đẩy tĩnh điện mở rộng tối đa', settings: { speed: 1.2, amplitude: 1.6 } }
    ]
  },

  // OPTICS & QUANTUM (+3)
  fiber_optic_3d: {
    id: 'fiber_optic_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 11'],
    title: 'Lõi Cáp Quang Phản Xạ Toàn Phần 3D',
    subtitle: 'Chùm tia laser phản xạ zigzag bên trong ống trụ thủy tinh chiết suất cao n₁ trong không gian 3D',
    formula: 'n₁·sin(i) > n₂ → Phản xạ 100%',
    linkedLessonId: 'phys-ext-10',
    presets: [
      { label: 'Phản xạ zigzag đẹp', description: 'Góc phóng 25° qua 5 lần phản xạ', settings: { speed: 1, amplitude: 1 } },
      { label: 'Mật độ bước dích dắc cao', description: 'Tăng góc nghiêng tia phóng', settings: { speed: 1.2, amplitude: 1.5 } }
    ]
  },
  compton_3d: {
    id: 'compton_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 12'],
    title: 'Va Chạm Lượng Tử Photon – Electron Compton 3D',
    subtitle: 'Photon bước sóng ngắn va chạm electron làm đổi bước sóng và bắn electron giật lùi trong 3D',
    formula: 'Δλ = λ_C(1 − cosθ) · p_ph + p_e = const',
    linkedLessonId: 'phys-ext-5',
    presets: [
      { label: 'Va chạm góc 90°', description: 'Quan sát hai hạt tách góc vuông', settings: { speed: 1, amplitude: 1 } },
      { label: 'Chế độ Slow-motion', description: 'Theo dõi rõ xung sóng photon đổi màu', settings: { speed: 0.6, amplitude: 1.2 } }
    ]
  },
  double_lens_microscope_3d: {
    id: 'double_lens_microscope_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 11'],
    title: 'Hệ Kính Hiển Vi Hai Thấu Kính 3D',
    subtitle: 'Băng quang học 3D minh họa đường đi chùm tia qua Vật kính L₁ và Thị kính L₂ phóng đại ảnh',
    formula: 'k_hệ = k₁ · G₂',
    linkedLessonId: 'phys-pro-4',
    presets: [
      { label: 'Hội tụ vật mẫu chuẩn', description: 'Ảnh trung gian rõ giữa hai kính', settings: { speed: 1, amplitude: 1 } },
      { label: 'Phóng đại cực đại', description: 'Thu ngắn tiêu cự vật kính', settings: { speed: 1, amplitude: 1.4 } }
    ]
  },

  // THERMAL & NUCLEAR (+3)
  diffusion_gases_3d: {
    id: 'diffusion_gases_3d',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Khuếch Tán Hai Chất Khí Qua Vách Ngăn 3D',
    subtitle: 'Các phân tử khí Xanh và Đỏ chuyển động nhiệt hòa trộn đồng đều sau khi nâng vách ngăn',
    formula: 'v_tb = √(3RT / M) · J = -D·(dc/dx)',
    linkedLessonId: 'phys-12-b12',
    presets: [
      { label: 'Mở vách khuếch tán', description: 'Hai khí trộn đều tự nhiên theo thời gian', settings: { speed: 1, amplitude: 1 } },
      { label: 'Nhiệt độ cao (trộn nhanh)', description: 'Động năng phân tử tăng vọt', settings: { speed: 1.7, frequency: 1.5 } }
    ]
  },
  brownian_motion_3d: {
    id: 'brownian_motion_3d',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Chuyển Động Brown Hỗn Loạn 3D',
    subtitle: 'Hạt phấn hoa lớn chuyển động ziczac ngẫu nhiên 3D do bị hàng chục phân tử môi trường va đập',
    formula: '⟨r²⟩ = 6·D·t · D = k_B·T / (6πηr)',
    linkedLessonId: 'phys-12-b12',
    presets: [
      { label: 'Hạt phấn trong nước 300K', description: 'Quỹ đạo gấp khúc liên tục', settings: { speed: 1, amplitude: 1 } },
      { label: 'Đun nóng môi trường', description: 'Tần suất va chạm và độ lệch tăng', settings: { speed: 1.6, frequency: 1.5 } }
    ]
  },
  tokamak_fusion_3d: {
    id: 'tokamak_fusion_3d',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Lò Phản Ứng Nhiệt Hạch Từ Trường Tokamak 3D',
    subtitle: 'Dòng Plasma Deuterium–Tritium nhiệt độ hàng trăm triệu Kelvin được giam giữ trong xuyến từ trường',
    formula: '²H + ³H → ⁴He + n + 17.6 MeV',
    linkedLessonId: 'phys-ext-9',
    presets: [
      { label: 'Plasma ổn định', description: 'Từ trường xuyến giữ plasma không chạm thành', settings: { speed: 1, amplitude: 1 } },
      { label: 'Đốt nóng nhiệt hạch tối đa', description: 'Tốc độ tổng hợp & phát tia X cao', settings: { speed: 1.6, amplitude: 1.4 } }
    ]
  }
};

export const BATCH2_3D_SCENE_CONFIGS: Record<Batch2Physics3DModeId, Extra3DSceneConfig> = {
  atwood_pulley_3d: {
    mode: 'atwood_pulley_3d',
    shortLabel: 'Máy Atwood 3D',
    hudTitle: 'Hệ Ròng Rọc Máy Atwood 3D',
    params: [
      { key: 'p1', label: 'Khối lượng m₁', unit: 'kg', min: 1, max: 10, step: 0.5, defaultVal: 2.5, accent: 'accent-sky-500' },
      { key: 'p2', label: 'Khối lượng m₂', unit: 'kg', min: 1, max: 10, step: 0.5, defaultVal: 4.5, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => {
      const a = ((v.p2 - v.p1) * 9.8) / (v.p1 + v.p2);
      const tension = (2 * v.p1 * v.p2 * 9.8) / (v.p1 + v.p2);
      return `Gia tốc hệ a = ${a.toFixed(2)} m/s² · Lực căng dây T = ${tension.toFixed(1)} N`;
    }
  },
  newtons_cradle_3d: {
    mode: 'newtons_cradle_3d',
    shortLabel: 'Con Lắc Newton 3D',
    hudTitle: 'Con Lắc Newton 5 Bi Va Chạm Đàn Hồi 3D',
    params: [
      { key: 'p1', label: 'Góc nâng biên θ₀', unit: '°', min: 15, max: 65, step: 5, defaultVal: 40, accent: 'accent-cyan-500' },
      { key: 'p2', label: 'Tốc độ dao động', unit: '×', min: 0.5, max: 2.0, step: 0.1, defaultVal: 1.0, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => `Bảo toàn động lượng p và cơ năng W: góc nâng ${v.p1}° truyền toàn phần từ bi trái sang bi phải.`
  },
  foucault_pendulum_3d: {
    mode: 'foucault_pendulum_3d',
    shortLabel: 'Con Lắc Foucault 3D',
    hudTitle: 'Con Lắc Foucault Tiến Động Theo Vĩ Độ 3D',
    params: [
      { key: 'p1', label: 'Vĩ độ địa lí φ', unit: '°', min: 10, max: 90, step: 5, defaultVal: 45, accent: 'accent-emerald-500' },
      { key: 'p2', label: 'Biên độ góc α', unit: '×', min: 0.5, max: 1.6, step: 0.1, defaultVal: 1.0, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => `Tốc độ xoay mặt phẳng dao động tỉ lệ sin(${v.p1}°) = ${Math.sin((v.p1 * Math.PI) / 180).toFixed(2)}.`
  },
  transverse_longitudinal_3d: {
    mode: 'transverse_longitudinal_3d',
    shortLabel: 'Sóng Ngang / Dọc 3D',
    hudTitle: 'So Sánh Trực Quan Sóng Ngang & Sóng Dọc 3D',
    params: [
      { key: 'p1', label: 'Tần số sóng f', unit: 'Hz', min: 0.8, max: 4.0, step: 0.2, defaultVal: 2.0, accent: 'accent-cyan-500' },
      { key: 'p2', label: 'Biên độ sóng A', unit: 'm', min: 0.3, max: 1.3, step: 0.1, defaultVal: 0.8, accent: 'accent-emerald-500' }
    ],
    computeReadout: (v) => `Hàng trên: Sóng ngang (dao động ⊥ phương truyền) · Hàng dưới: Sóng dọc (nén giãn // phương truyền, f = ${v.p1} Hz).`
  },
  lissajous_3d: {
    mode: 'lissajous_3d',
    shortLabel: 'Lissajous 3D',
    hudTitle: 'Quỹ Đạo Giao Thoa Không Gian Lissajous 3D',
    params: [
      { key: 'p1', label: 'Tỉ số tần số ω_y / ω_x', unit: '', min: 1, max: 5, step: 0.5, defaultVal: 1.5, accent: 'accent-violet-500' },
      { key: 'p2', label: 'Tần số trục Z ω_z', unit: '', min: 1, max: 4, step: 0.5, defaultVal: 2.0, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => `Đường cong khép kín không gian 3D ứng với tỉ lệ tần số 1 : ${v.p1} : ${v.p2}.`
  },
  acoustic_interference_3d: {
    mode: 'acoustic_interference_3d',
    shortLabel: 'Giao Thoa Âm 3D',
    hudTitle: 'Sóng Âm 2 Nguồn Kết Hợp Giao Thoa 3D',
    params: [
      { key: 'p1', label: 'Tần số âm f', unit: 'Hz', min: 1.2, max: 4.5, step: 0.2, defaultVal: 2.4, accent: 'accent-emerald-500' },
      { key: 'p2', label: 'Khoảng cách 2 loa d', unit: 'm', min: 1.5, max: 4.5, step: 0.25, defaultVal: 2.8, accent: 'accent-sky-500' }
    ],
    computeReadout: (v) => `Khoảng cách S₁S₂ = ${v.p2} m tạo các dải cực đại cộng hưởng và các rãnh triệt tiêu âm thanh đối xứng.`
  },
  cyclotron_3d: {
    mode: 'cyclotron_3d',
    shortLabel: 'Máy Cyclotron 3D',
    hudTitle: 'Máy Gia Tốc Hạt Cyclotron Hai Hộp D 3D',
    params: [
      { key: 'p1', label: 'Cảm ứng từ B', unit: 'T', min: 0.6, max: 2.6, step: 0.1, defaultVal: 1.5, accent: 'accent-blue-500' },
      { key: 'p2', label: 'Điện áp khe U', unit: 'kV', min: 20, max: 80, step: 5, defaultVal: 45, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => `Tần số cộng hưởng Cyclotron f = qB/(2πm) ∝ ${(v.p1 * 15.2).toFixed(1)} MHz · Năng lượng tăng tỉ lệ số vòng quay.`
  },
  cathode_ray_tube_3d: {
    mode: 'cathode_ray_tube_3d',
    shortLabel: 'Ống Tia Âm Cực 3D',
    hudTitle: 'Ống Tia Âm Cực CRT & Bản Lái Tia 3D',
    params: [
      { key: 'p1', label: 'Điện áp lái tia Y', unit: 'V', min: -60, max: 60, step: 5, defaultVal: 30, accent: 'accent-emerald-500' },
      { key: 'p2', label: 'Tần số quét X', unit: 'Hz', min: 0.5, max: 3.5, step: 0.25, defaultVal: 1.5, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => `Độ lệch đứng trên màn huỳnh quang tỉ lệ thuận điện áp U_y = ${v.p1} V đặt giữa hai bản tụ.`
  },
  helmholtz_coils_3d: {
    mode: 'helmholtz_coils_3d',
    shortLabel: 'Cuộn Helmholtz 3D',
    hudTitle: 'Cặp Cuộn Dây Helmholtz Từ Trường Đều 3D',
    params: [
      { key: 'p1', label: 'Dòng điện I', unit: 'A', min: 1, max: 10, step: 0.5, defaultVal: 5.0, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Khoảng cách d / R', unit: '×R', min: 0.6, max: 1.8, step: 0.1, defaultVal: 1.0, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => `Tại d = ${v.p2}·R: ${Math.abs(v.p2 - 1.0) < 0.12 ? 'Từ trường ở vùng giữa ĐỒNG ĐỀU tối ưu (Cấu hình Helmholtz chuẩn)!' : 'Từ trường vùng giữa bị lõm/lồi không đều.'}`
  },
  electroscope_3d: {
    mode: 'electroscope_3d',
    shortLabel: 'Điện Nghiệm 3D',
    hudTitle: 'Điện Nghiệm Tĩnh Điện Hai Lá Vàng 3D',
    params: [
      { key: 'p1', label: 'Điện tích thanh nạp q', unit: 'μC', min: 0, max: 10, step: 0.5, defaultVal: 5.5, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Độ gần nguồn điện', unit: '×', min: 0.4, max: 1.5, step: 0.1, defaultVal: 1.0, accent: 'accent-sky-500' }
    ],
    computeReadout: (v) => `Lực đẩy Coulomb F ∝ q² làm hai lá vàng xòe góc ≈ ${Math.min(72, v.p1 * v.p2 * 6.5).toFixed(1)}°.`
  },
  fiber_optic_3d: {
    mode: 'fiber_optic_3d',
    shortLabel: 'Cáp Quang 3D',
    hudTitle: 'Truyền Tia Sáng Trong Lõi Cáp Quang 3D',
    params: [
      { key: 'p1', label: 'Góc phóng tia θ', unit: '°', min: 10, max: 45, step: 2, defaultVal: 24, accent: 'accent-cyan-500' },
      { key: 'p2', label: 'Chiết suất lõi n₁', unit: '', min: 1.35, max: 1.75, step: 0.05, defaultVal: 1.52, accent: 'accent-emerald-500' }
    ],
    computeReadout: (v) => `Tia laser phản xạ toàn phần liên tục trong lõi n₁ = ${v.p2} với góc tới ${(90 - v.p1).toFixed(0)}° > góc giới hạn.`
  },
  compton_3d: {
    mode: 'compton_3d',
    shortLabel: 'Tán Xạ Compton 3D',
    hudTitle: 'Tán Xạ Lượng Tử Photon – Electron Compton 3D',
    params: [
      { key: 'p1', label: 'Góc tán xạ photon θ', unit: '°', min: 20, max: 165, step: 5, defaultVal: 75, accent: 'accent-violet-500' },
      { key: 'p2', label: 'Tốc độ xung mô phỏng', unit: '×', min: 0.5, max: 2.0, step: 0.25, defaultVal: 1.0, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => `Độ dịch bước sóng Compton Δλ = 2.43·(1 − cos${v.p1}°) = ${(2.426 * (1 - Math.cos((v.p1 * Math.PI) / 180))).toFixed(2)} pm.`
  },
  double_lens_microscope_3d: {
    mode: 'double_lens_microscope_3d',
    shortLabel: 'Kính Hiển Vi 3D',
    hudTitle: 'Hệ Quang Học Kính Hiển Vi Hai Thấu Kính 3D',
    params: [
      { key: 'p1', label: 'Tiêu cự vật kính f₁', unit: 'm', min: 0.7, max: 1.8, step: 0.1, defaultVal: 1.1, accent: 'accent-sky-500' },
      { key: 'p2', label: 'Vị trí đặt vật d₁', unit: 'm', min: 1.3, max: 2.8, step: 0.1, defaultVal: 1.7, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => `Ảnh thật trung gian đảo chiều tạo giữa vật kính L₁ và thị kính L₂ rồi được phóng đại mạnh ở đầu ra.`
  },
  diffusion_gases_3d: {
    mode: 'diffusion_gases_3d',
    shortLabel: 'Khuếch Tán Khí 3D',
    hudTitle: 'Khuếch Tán Hai Chất Khí Qua Vách Ngăn 3D',
    params: [
      { key: 'p1', label: 'Nhiệt độ khối khí T', unit: 'K', min: 180, max: 700, step: 20, defaultVal: 360, accent: 'accent-rose-500' },
      { key: 'p2', label: 'Mở vách ngăn (0:Đóng / 1:Mở)', unit: '', min: 0, max: 1, step: 1, defaultVal: 1, accent: 'accent-emerald-500' }
    ],
    computeReadout: (v) => (v.p2 >= 0.5 ? `Vách ngăn ĐÃ MỞ: Hai loại phân tử khí khuếch tán qua lại hỗn loạn ở T = ${v.p1} K.` : `Vách ngăn ĐÓNG: Hai chất khí bị giam giữ riêng biệt ở hai nửa hộp.`)
  },
  brownian_motion_3d: {
    mode: 'brownian_motion_3d',
    shortLabel: 'Chuyển Động Brown 3D',
    hudTitle: 'Chuyển Động Hỗn Loạn Hạt Phấn Brown 3D',
    params: [
      { key: 'p1', label: 'Nhiệt độ dung môi T', unit: 'K', min: 200, max: 600, step: 25, defaultVal: 325, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Mật độ phân tử va chạm', unit: '×', min: 0.6, max: 1.8, step: 0.2, defaultVal: 1.0, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => `Hạt lớn màu vàng dịch chuyển ziczac không ngừng do chênh lệch xung lượng va chạm từ các phân tử xung quanh tại ${v.p1} K.`
  },
  tokamak_fusion_3d: {
    mode: 'tokamak_fusion_3d',
    shortLabel: 'Lò Tokamak 3D',
    hudTitle: 'Lò Phản Ứng Nhiệt Hạch Xuyến Từ Trường Tokamak 3D',
    params: [
      { key: 'p1', label: 'Cường độ từ trường giam B', unit: 'T', min: 2, max: 12, step: 0.5, defaultVal: 6.5, accent: 'accent-sky-500' },
      { key: 'p2', label: 'Nhiệt độ Plasma', unit: 'triệu K', min: 50, max: 250, step: 10, defaultVal: 150, accent: 'accent-rose-500' }
    ],
    computeReadout: (v) => `Plasma ${v.p2} triệu K xoáy chặt theo đường sức từ xuyến B = ${v.p1} T thực hiện phản ứng tổng hợp D + T → He + n.`
  }
};
