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
  | 'binding_energy_curve'
  | 'electric_power_meter'
  | 'dc_motor_2d'
  | 'electrolysis_faraday'
  | 'eye_optics_2d'
  | 'em_wave_3axis'
  | 'phase_change_heating'
  | 'distance_displacement_rel'
  | 'power_plant_generator'
  | 'fresnel_phasor_2d'
  | 'measurement_tools_2d'
  | 'thermal_expansion_2d'
  | 'plane_mirror_2d'
  | 'simple_machines_2d'
  | 'fluid_pressure_2d'
  | 'hooke_forces_2d'
  | 'shadow_eclipse_2d'
  | 'magnet_compass_2d'
  | 'heat_transfer_2d';

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
  | 'tokamak_fusion_3d'
  | 'mechanical_energy_3d'
  | 'ohm_circuit_3d'
  | 'refraction_tank_3d'
  | 'calorimetry_beaker_3d'
  | 'archimedes_buoyancy_3d'
  | 'electric_power_meter_3d'
  | 'electrolysis_3d'
  | 'eye_optics_3d'
  | 'em_wave_3d'
  | 'power_plant_3d'
  | 'measurement_bench_3d'
  | 'thermal_expansion_3d'
  | 'plane_mirror_3d'
  | 'lever_pulley_3d'
  | 'hydraulic_press_3d'
  | 'hooke_forces_3d'
  | 'shadow_eclipse_3d'
  | 'magnet_compass_3d'
  | 'electromagnet_bell_3d'
  | 'heat_transfer_3d';

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
  },
  electric_power_meter: {
    id: 'electric_power_meter',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Công Suất Điện (P = UI), Công Tơ Điện (kWh) & Hiệu Suất Nguồn',
    subtitle: 'Đo trực tiếp dòng mạch (+) → (−), độ sáng bóng đèn theo P = UI, đĩa công tơ kWh quay tích lũy điện năng và hiệu suất nguồn H = R/(R+r)',
    formula: 'P = U·I · A = U·I·t · 1 kWh = 3,6×10⁶ J · H = R/(R + r)',
    linkedLessonId: 'phys-2006-9-4',
    defaultParams: { emfV: 220, loadR: 110, internalR: 0 },
    paramBounds: {
      emfV: { min: 12, max: 240, step: 12, unit: 'V', label: 'Suất điện động / Điện áp U' },
      loadR: { min: 10, max: 240, step: 10, unit: 'Ω', label: 'Điện trở tải R' },
      internalR: { min: 0, max: 40, step: 2, unit: 'Ω', label: 'Điện trở trong nguồn r' }
    },
    presets: [
      { label: 'Đèn 220V – 440W (R=110Ω)', description: 'Đĩa công tơ quay đều tích lũy kWh', params: { emfV: 220, loadR: 110, internalR: 0 } },
      { label: 'Tăng công suất tải lớn (R=40Ω)', description: 'Công suất tăng mạnh, đĩa quay nhanh', params: { emfV: 220, loadR: 40, internalR: 0 } },
      { label: 'Nguồn có r = R (H = 50%, P_max)', description: 'Công suất mạch ngoài đạt cực đại E²/4r', params: { emfV: 24, loadR: 10, internalR: 10 } }
    ]
  },
  dc_motor_2d: {
    id: 'dc_motor_2d',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Lực Điện Từ & Động Cơ Điện Một Chiều (Cổ Góp Bán Khuyên)',
    subtitle: 'Khung dây ABCD mang dòng (+) → (−) chịu ngẫu lực bàn tay trái quay liên tục nhờ bộ cổ góp tự động đảo chiều mỗi 180°',
    formula: 'F = B·I·l·sinα · M_ngẫu = N·B·I·S·sinθ',
    linkedLessonId: 'phys-2006-9-8',
    defaultParams: { currentI: 4.0, magneticB: 0.8, coilTurns: 40 },
    paramBounds: {
      currentI: { min: 0.5, max: 10.0, step: 0.5, unit: 'A', label: 'Cường độ dòng I' },
      magneticB: { min: 0.2, max: 2.0, step: 0.1, unit: 'T', label: 'Cảm ứng từ B' },
      coilTurns: { min: 10, max: 100, step: 10, unit: 'vòng', label: 'Số vòng khung N' }
    },
    presets: [
      { label: 'Động cơ quay chuẩn', description: 'Ngẫu lực điện từ quay đều cùng cổ góp', params: { currentI: 4.0, magneticB: 0.8, coilTurns: 40 } },
      { label: 'Tăng dòng & từ trường mạnh', description: 'Tốc độ quay và mômen xoắn tăng vọt', params: { currentI: 8.5, magneticB: 1.6, coilTurns: 80 } }
    ]
  },
  electrolysis_faraday: {
    id: 'electrolysis_faraday',
    domainId: 'electricity_mag',
    grades: ['Lớp 11'],
    title: 'Dòng Điện Trong Chất Điện Phân & Định Luật Fa-ra-đây',
    subtitle: 'Bình điện phân CuSO₄ với dương cực tan: ion Cu²⁺ dịch chuyển về catôt (−), ion SO₄²⁻ về anôt (+) theo chiều dòng điện quy ước',
    formula: 'm = (1 / F) · (A / n) · I · t · F = 96 500 C/mol',
    linkedLessonId: 'phys-2006-11-10',
    defaultParams: { currentI: 4.0, durationMin: 16, molarMass: 64 },
    paramBounds: {
      currentI: { min: 0.5, max: 10.0, step: 0.5, unit: 'A', label: 'Cường độ dòng I' },
      durationMin: { min: 1, max: 60, step: 1, unit: 'phút', label: 'Thời gian điện phân t' },
      molarMass: { min: 27, max: 108, step: 1, unit: 'g/mol', label: 'Khối lượng mol A (Cu=64, Ag=108)' }
    },
    presets: [
      { label: 'Mạ Đồng (CuSO₄, A=64, n=2)', description: 'Dương cực tan Cu bám đều lên Catôt', params: { currentI: 4.0, durationMin: 16, molarMass: 64 } },
      { label: 'Mạ Bạc (AgNO₃, A=108, n=1)', description: 'Lượng kim loại bám cao gấp nhiều lần', params: { currentI: 2.0, durationMin: 16, molarMass: 108 } }
    ]
  },
  eye_optics_2d: {
    id: 'eye_optics_2d',
    domainId: 'optics_quantum',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Quang Học Của Mắt, Điều Tiết & Sửa Tật Cận – Viễn Thị',
    subtitle: 'Khảo sát điểm hội tụ trước/sau võng mạc và tác dụng của kính phân kì (chữa cận) hay kính hội tụ (chữa viễn/lão)',
    formula: 'D_kính cận = −1 / OC_V · 1/f_k = 1/d − 1/OC_C',
    linkedLessonId: 'phys-2006-11-19',
    defaultParams: { eyeDefect: 1, useGlass: 0, objDistCm: 60 },
    paramBounds: {
      eyeDefect: { min: 0, max: 2, step: 1, unit: '', label: 'Tật mắt (0:Thường / 1:Cận / 2:Viễn)' },
      useGlass: { min: 0, max: 1, step: 1, unit: '', label: 'Đeo kính sửa tật (0:Không / 1:Đeo)' },
      objDistCm: { min: 20, max: 200, step: 10, unit: 'cm', label: 'Khoảng cách vật nhìn d' }
    },
    presets: [
      { label: 'Mắt thường nhìn rõ', description: 'Ảnh hội tụ sắc nét trên võng mạc', params: { eyeDefect: 0, useGlass: 0, objDistCm: 80 } },
      { label: 'Mắt cận chưa đeo kính', description: 'Ảnh vật xa hội tụ TRƯỚC võng mạc', params: { eyeDefect: 1, useGlass: 0, objDistCm: 150 } },
      { label: 'Mắt cận đeo thấu kính phân kì', description: 'Chùm tia ló phân kì đưa ảnh về đúng võng mạc', params: { eyeDefect: 1, useGlass: 1, objDistCm: 150 } },
      { label: 'Mắt viễn đeo thấu kính hội tụ', description: 'Tăng hội tụ để đọc rõ chữ ở gần', params: { eyeDefect: 2, useGlass: 1, objDistCm: 25 } }
    ]
  },
  em_wave_3axis: {
    id: 'em_wave_3axis',
    domainId: 'waves_osc',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Sóng Điện Từ Ngang (E ⊥ B ⊥ v) & Điều Chế Sóng Vô Tuyến',
    subtitle: 'Mô phỏng sự lan truyền đồng pha của điện trường E và từ trường B vuông góc nhau cùng điều chế biên độ AM',
    formula: 'c = λ · f ≈ 3×10⁸ m/s · E, B dao động cùng pha, vuông góc',
    linkedLessonId: 'phys-12-b19',
    defaultParams: { freqScale: 120, ampE: 65, modDepth: 50 },
    paramBounds: {
      freqScale: { min: 30, max: 300, step: 15, unit: 'MHz', label: 'Tần số sóng f' },
      ampE: { min: 25, max: 100, step: 5, unit: 'V/m', label: 'Biên độ điện trường E₀' },
      modDepth: { min: 0, max: 85, step: 5, unit: '%', label: 'Độ sâu điều chế AM' }
    },
    presets: [
      { label: 'Sóng FM (120 MHz)', description: 'Sóng mang ngang E ⊥ B thuần túy không điều chế biên độ', params: { freqScale: 120, ampE: 65, modDepth: 0 } },
      { label: 'Sóng Điều chế AM (60%)', description: 'Đường bao tín hiệu âm tần điều chế biên độ sóng cao tần', params: { freqScale: 180, ampE: 65, modDepth: 60 } },
      { label: 'Tần số cao bước sóng ngắn', description: 'λ = c/f giảm tỉ lệ nghịch khi tăng tần số f', params: { freqScale: 270, ampE: 75, modDepth: 0 } }
    ]
  },
  phase_change_heating: {
    id: 'phase_change_heating',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 10', 'Lớp 12'],
    title: 'Đồ Thị Chuyển Thể T(t), Nhiệt Nóng Chảy (λ) & Hóa Hơi (L)',
    subtitle: 'Quan sát hai đoạn nằm ngang giữ nguyên nhiệt độ tại 0°C (nóng chảy) và 100°C (sôi hóa hơi) khi cấp nhiệt đều',
    formula: 'Q = m·c·ΔT · Q_nc = λ·m (0°C) · Q_hh = L·m (100°C)',
    linkedLessonId: 'phys-12-b1',
    defaultParams: { power: 1200, mass: 0.5, tStart: -20 },
    paramBounds: {
      power: { min: 400, max: 2400, step: 200, unit: 'W', label: 'Công suất bếp P' },
      mass: { min: 0.2, max: 1.5, step: 0.1, unit: 'kg', label: 'Khối lượng nước đá m' },
      tStart: { min: -40, max: 0, step: 5, unit: '°C', label: 'Nhiệt độ ban đầu' }
    },
    presets: [
      { label: 'Đun chuẩn từ -20°C', description: 'Quan sát rõ cả hai đoạn nằm ngang 0°C và 100°C', params: { power: 1200, mass: 0.5, tStart: -20 } },
      { label: 'Bếp công suất cao (2200W)', description: 'Độ dốc tăng nhiệt lớn, rút ngắn thời gian chuyển thể', params: { power: 2200, mass: 0.5, tStart: -20 } },
      { label: 'Khối lượng lớn (1.2 kg)', description: 'Cần lượng nhiệt Q = λm và Lm rất dài tại 0°C và 100°C', params: { power: 1200, mass: 1.2, tStart: -10 } }
    ]
  },
  distance_displacement_rel: {
    id: 'distance_displacement_rel',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Tính Tương Đối Chuyển Động & Cộng Vận Tốc Qua Sông',
    subtitle: 'Ca nô hướng vuông góc bờ bị dòng nước kéo xuôi: tổng hợp vectơ v₁₃ = v₁₂ + v₂₃, độ dịch chuyển d và quãng đường đi s',
    formula: 'v₁₃ = v₁₂ + v₂₃ · |d| ≤ s',
    linkedLessonId: 'phys-2006-10-5',
    defaultParams: { v1: 4.0, vStream: 3.0, riverWidth: 40 },
    paramBounds: {
      v1: { min: 1.5, max: 8.0, step: 0.5, unit: 'm/s', label: 'Vận tốc ca nô v₁₂' },
      vStream: { min: 0.0, max: 6.0, step: 0.5, unit: 'm/s', label: 'Vận tốc dòng nước v₂₃' },
      riverWidth: { min: 20, max: 80, step: 5, unit: 'm', label: 'Bề rộng khúc sông L' }
    },
    presets: [
      { label: 'Qua sông vuông góc (3-4-5)', description: 'v₁₂ = 4 m/s, v₂₃ = 3 m/s ⇒ v₁₃ = 5 m/s', params: { v1: 4.0, vStream: 3.0, riverWidth: 40 } },
      { label: 'Nước đứng yên (v₂₃ = 0)', description: 'Đi thẳng sang bờ đối diện không bị dạt', params: { v1: 4.0, vStream: 0.0, riverWidth: 40 } },
      { label: 'Nước chảy xiết (v₂₃ = 5.5 m/s)', description: 'Độ dạt hạ lưu rất lớn dù hướng mũi vuông góc bờ', params: { v1: 3.5, vStream: 5.5, riverWidth: 50 } }
    ]
  },
  power_plant_generator: {
    id: 'power_plant_generator',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Nhà Máy Thủy Điện – Nhiệt Điện & Phát Điện Lưới Quốc Gia',
    subtitle: 'Chuyển hóa thế năng cột nước / nhiệt năng tuabin hơi làm quay rôto máy phát xoay chiều, qua máy tăng áp truyền tải đi xa',
    formula: 'P_phát = H · ρ · g · Q · h · ΔP_tải = P²R / U²',
    linkedLessonId: 'phys-2006-9-17',
    defaultParams: { hydroMode: 1, headOrSteam: 60, loadMw: 120 },
    paramBounds: {
      hydroMode: { min: 0, max: 1, step: 1, unit: '', label: 'Nguồn (0:Nhiệt điện / 1:Thủy điện)' },
      headOrSteam: { min: 20, max: 120, step: 10, unit: 'm/atm', label: 'Cột áp nước / Áp suất hơi' },
      loadMw: { min: 40, max: 240, step: 20, unit: 'MW', label: 'Công suất tải tiêu thụ' }
    },
    presets: [
      { label: 'Thủy điện cột áp 80 m', description: 'Dòng nước xả qua ống áp lực quay tuabin Pelton', params: { hydroMode: 1, headOrSteam: 80, loadMw: 140 } },
      { label: 'Nhiệt điện tuabin hơi cao áp', description: 'Lò hơi đốt sinh luồng hơi áp suất cao quay máy phát', params: { hydroMode: 0, headOrSteam: 100, loadMw: 180 } }
    ]
  },
  fresnel_phasor_2d: {
    id: 'fresnel_phasor_2d',
    domainId: 'waves_osc',
    grades: ['Lớp 12'],
    title: 'Giản Đồ Vectơ Quay Fre-nen & Tổng Hợp Dao Động Điều Hòa',
    subtitle: 'Tổng hợp hai dao động cùng phương cùng tần số x = x₁ + x₂ bằng hình bình hành vectơ quay và so sánh lệch pha Δφ',
    formula: 'A² = A₁² + A₂² + 2A₁A₂·cos(Δφ) · tanφ = (A₁sinφ₁ + A₂sinφ₂)/(A₁cosφ₁ + A₂cosφ₂)',
    linkedLessonId: 'phys-2006-12-5',
    defaultParams: { amp1: 5, amp2: 4, deltaPhiDeg: 60, freqHz: 1.0 },
    paramBounds: {
      amp1: { min: 1, max: 8, step: 0.5, unit: 'cm', label: 'Biên độ A₁' },
      amp2: { min: 1, max: 8, step: 0.5, unit: 'cm', label: 'Biên độ A₂' },
      deltaPhiDeg: { min: 0, max: 180, step: 15, unit: '°', label: 'Độ lệch pha Δφ' },
      freqHz: { min: 0.4, max: 2.0, step: 0.2, unit: 'Hz', label: 'Tần số góc ω = 2πf' }
    },
    presets: [
      { label: 'Lệch pha 60° (Tổng hợp chung)', description: 'Quan sát hình bình hành quay và đồ thị x₁, x₂, x', params: { amp1: 5, amp2: 4, deltaPhiDeg: 60, freqHz: 1.0 } },
      { label: 'Vuông pha Δφ = 90° (Pitago)', description: 'A = √(A₁² + A₂²) = 5 cm với A₁=3, A₂=4', params: { amp1: 3, amp2: 4, deltaPhiDeg: 90, freqHz: 1.0 } },
      { label: 'Cùng pha (Δφ = 0°)', description: 'Biên độ cực đại A_max = A₁ + A₂', params: { amp1: 4, amp2: 4, deltaPhiDeg: 0, freqHz: 1.0 } },
      { label: 'Ngược pha (Δφ = 180°)', description: 'Biên độ cực tiểu A_min = |A₁ − A₂|', params: { amp1: 6, amp2: 4, deltaPhiDeg: 180, freqHz: 1.0 } }
    ]
  },
  measurement_tools_2d: {
    id: 'measurement_tools_2d',
    domainId: 'mechanics',
    grades: ['Lớp 6', 'Lớp 7', 'Lớp 8'],
    title: 'Dụng Cụ Đo Thực Hành: Thước Kẻ, Bình Chia Độ, Lực Kế & Nhiệt Kế',
    subtitle: 'Chọn dụng cụ đo thật, điều chỉnh vật mẫu, kiểm tra sai số nhìn lệch (Parallax) và đọc đúng GHĐ – ĐCNN',
    formula: 'V_{\\text{vật}} = V_2 - V_1 \\quad|\\quad P = 10 \\cdot m \\quad|\\quad t(^\\circ\\text{F}) = 1{,}8\\,t(^\\circ\\text{C}) + 32',
    linkedLessonId: 'phys-6-b1',
    defaultParams: { toolMode: 1, sampleVal: 12.5, eyeTiltDeg: 0 },
    paramBounds: {
      toolMode: { min: 1, max: 4, step: 1, unit: '', label: 'Dụng cụ (1:Thước 2:Bình chia độ 3:Lực kế 4:Nhiệt kế)' },
      sampleVal: { min: 2, max: 50, step: 0.5, unit: 'đơn vị', label: 'Giá trị vật cần đo' },
      eyeTiltDeg: { min: -25, max: 25, step: 5, unit: '°', label: 'Góc đặt mắt nhìn lệch' }
    },
    presets: [
      { label: 'Đo độ dài (Nhìn vuông góc 0°)', description: 'Đọc chuẩn xác không mắc sai số thị sai', params: { toolMode: 1, sampleVal: 14.5, eyeTiltDeg: 0 } },
      { label: 'Bình chia độ đo đá (V₂ − V₁)', description: 'Thả chìm hòn sỏi vào bình nước đang ở 25 mL', params: { toolMode: 2, sampleVal: 18, eyeTiltDeg: 0 } },
      { label: 'Lực kế lò xo đo trọng lượng', description: 'Treo vật 2.5 kg chịu lực hút Trái Đất 25 N', params: { toolMode: 3, sampleVal: 25, eyeTiltDeg: 0 } },
      { label: 'Nhiệt kế chất lỏng (°C ↔ °F)', description: 'Theo dõi mực rượu dâng theo nhiệt độ', params: { toolMode: 4, sampleVal: 37, eyeTiltDeg: 0 } }
    ]
  },
  thermal_expansion_2d: {
    id: 'thermal_expansion_2d',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 6', 'Lớp 8'],
    title: 'Sự Nở Vì Nhiệt Của Rắn – Lỏng – Khí, Băng Kép & Khe Hở Đường Ray',
    subtitle: 'So sánh tốc độ nở nhiệt Rắn < Lỏng < Khí, băng kép uốn cong đóng ngắt bàn là và nhiệt kế hoạt động nhờ sự nở nhiệt',
    formula: '\\Delta l = l_0 \\cdot \\alpha \\cdot \\Delta t \\quad|\\quad \\text{Nở nhiều: Khí > Lỏng > Rắn}',
    linkedLessonId: 'phys-2006-6-4',
    defaultParams: { tempC: 65, matterMode: 1, bimetallic: 1 },
    paramBounds: {
      tempC: { min: 0, max: 140, step: 5, unit: '°C', label: 'Nhiệt độ đun nóng' },
      matterMode: { min: 1, max: 3, step: 1, unit: '', label: 'Thể (1:Băng kép Rắn 2:Lỏng ống mao dẫn 3:Bong bóng Khí)' },
      bimetallic: { min: 0, max: 1, step: 1, unit: '', label: 'Bật đèn cồn gia nhiệt (0/1)' }
    },
    presets: [
      { label: 'Băng kép Đồng – Thép uốn cong', description: 'Đồng nở nhiều hơn thép làm băng kép cong về phía thép', params: { tempC: 95, matterMode: 1, bimetallic: 1 } },
      { label: 'So sánh cả 3 thể cùng lúc', description: 'Thấy rõ bọt khí nở mạnh nhất rồi tới lỏng, rắn', params: { tempC: 85, matterMode: 3, bimetallic: 1 } }
    ]
  },
  plane_mirror_2d: {
    id: 'plane_mirror_2d',
    domainId: 'optics_quantum',
    grades: ['Lớp 7', 'Lớp 9'],
    title: 'Truyền Thẳng Ánh Sáng, Phản Xạ Gương Phẳng (i\' = i) & Ảnh Ảo Đối Xứng',
    subtitle: 'Chiếu tia tới lên gương phẳng hoặc dịch chuyển vật thật AB trước gương để vẽ ảnh ảo A\'B\' đối xứng',
    formula: 'i\' = i \\quad|\\quad d_{\\text{ảnh}} = d_{\\text{vật}}, \\; A\'B\' = AB',
    linkedLessonId: 'phys-7-b3',
    defaultParams: { incidenceDeg: 40, objDistCm: 35, mirrorAngleDeg: 0 },
    paramBounds: {
      incidenceDeg: { min: 10, max: 75, step: 5, unit: '°', label: 'Góc tới i' },
      objDistCm: { min: 15, max: 60, step: 5, unit: 'cm', label: 'Khoảng cách vật đến gương' },
      mirrorAngleDeg: { min: -25, max: 25, step: 5, unit: '°', label: 'Góc nghiêng gương' }
    },
    presets: [
      { label: 'Phản xạ chuẩn i = 40° ⇒ i\' = 40°', description: 'Tia phản xạ đối xứng tia tới qua pháp tuyến N', params: { incidenceDeg: 40, objDistCm: 35, mirrorAngleDeg: 0 } },
      { label: 'Vật lại gần gương (d = 20 cm)', description: 'Ảnh ảo tiến lại gần gương đúng bằng d', params: { incidenceDeg: 55, objDistCm: 20, mirrorAngleDeg: 0 } }
    ]
  },
  simple_machines_2d: {
    id: 'simple_machines_2d',
    domainId: 'mechanics',
    grades: ['Lớp 6', 'Lớp 8', 'Lớp 10'],
    title: 'Ba Máy Cơ Đơn Giản & Moment Lực: Đòn Bẩy – Ròng Rọc – Mặt Phẳng Nghiêng',
    subtitle: 'Thí nghiệm trực tiếp quy tắc đòn bẩy F₁·d₁ = F₂·d₂, ròng rọc động lợi 2 lần lực và mặt phẳng nghiêng lợi lực không lợi công',
    formula: 'F_1 \\cdot d_1 = F_2 \\cdot d_2 \\quad|\\quad F_{\\text{RR động}} = \\frac{P}{2} \\quad|\\quad F_{\\text{MPN}} = P \\cdot \\frac{h}{l}',
    linkedLessonId: 'phys-8-b2',
    defaultParams: { machineType: 1, loadWeightN: 60, armRatio: 2.0 },
    paramBounds: {
      machineType: { min: 1, max: 3, step: 1, unit: '', label: 'Máy cơ (1:Đòn bẩy 2:Ròng rọc động 3:Mặt phẳng nghiêng)' },
      loadWeightN: { min: 20, max: 120, step: 10, unit: 'N', label: 'Trọng lượng vật cần nâng P' },
      armRatio: { min: 1.0, max: 4.0, step: 0.25, unit: '×', label: 'Tỉ số cánh tay đòn / l:h' }
    },
    presets: [
      { label: 'Đòn bẩy lợi 2 lần lực (d₁ = 2d₂)', description: 'Dùng lực 30 N nâng vật nặng 60 N', params: { machineType: 1, loadWeightN: 60, armRatio: 2.0 } },
      { label: 'Hệ thống Ròng rọc động (F = P/2)', description: 'Giảm một nửa lực kéo, thiệt hai lần đường đi', params: { machineType: 2, loadWeightN: 80, armRatio: 2.0 } },
      { label: 'Mặt phẳng nghiêng thoai thoải (l = 3h)', description: 'Kéo vật lên cao nhẹ hơn gấp 3 lần', params: { machineType: 3, loadWeightN: 90, armRatio: 3.0 } }
    ]
  },
  fluid_pressure_2d: {
    id: 'fluid_pressure_2d',
    domainId: 'mechanics',
    grades: ['Lớp 8'],
    title: 'Áp Suất Rắn (p = F/S), Áp Suất Lỏng (p = d·h), Bình Thông Nhau & Máy Ép Thủy Lực',
    subtitle: 'Quan sát tia nước phun mạnh ở đáy sâu, mực nước cân bằng trong bình thông nhau và khuếch đại lực Pascal F₂/F₁ = S₂/S₁',
    formula: 'p = \\frac{F}{S} \\quad|\\quad p = d \\cdot h \\quad|\\quad \\frac{F_2}{F_1} = \\frac{S_2}{S_1}',
    linkedLessonId: 'phys-8-b1',
    defaultParams: { labMode: 1, depthM: 3.5, areaRatio: 6 },
    paramBounds: {
      labMode: { min: 1, max: 3, step: 1, unit: '', label: 'Chế độ (1:Áp suất lỏng p=dh 2:Máy ép thủy lực 3:Áp suất rắn F/S)' },
      depthM: { min: 0.5, max: 6.0, step: 0.5, unit: 'm', label: 'Độ sâu cột nước h / Lực ấn F₁' },
      areaRatio: { min: 2, max: 12, step: 1, unit: '×', label: 'Tỉ số tiết diện S₂/S₁' }
    },
    presets: [
      { label: 'Bình khoan 3 lỗ độ sâu h', description: 'Lỗ càng sâu, áp suất p = d·h càng lớn nên tia phun càng xa', params: { labMode: 1, depthM: 4.5, areaRatio: 6 } },
      { label: 'Máy ép thủy lực Pascal (S₂/S₁ = 8)', description: 'Ấn tay nhẹ 50 N nâng được ô tô 400 N', params: { labMode: 2, depthM: 5.0, areaRatio: 8 } },
      { label: 'Áp suất chân đứng vs mũi đinh', description: 'Giảm diện tích S làm áp suất tăng vọt', params: { labMode: 3, depthM: 4.0, areaRatio: 6 } }
    ]
  },
  hooke_forces_2d: {
    id: 'hooke_forces_2d',
    domainId: 'mechanics',
    grades: ['Lớp 6', 'Lớp 8', 'Lớp 10'],
    title: 'Lực Kế Lò Xo (P = 10m), Trọng Lượng & Lực Ma Sát Trượt',
    subtitle: 'Khảo sát độ dãn lò xo tỉ lệ thuận trọng lượng quả nặng và so sánh lực ma sát trên mặt băng trơn, gỗ và nhám',
    formula: 'P = 10\\,m \\quad|\\quad \\Delta l = \\frac{F}{k} \\quad|\\quad F_{\\text{ms}} = \\mu N',
    linkedLessonId: 'phys-6-b3',
    defaultParams: { massKg: 1.5, springK: 40, surfaceMu: 0.25 },
    paramBounds: {
      massKg: { min: 0.5, max: 5.0, step: 0.5, unit: 'kg', label: 'Khối lượng quả nặng m' },
      springK: { min: 20, max: 100, step: 10, unit: 'N/m', label: 'Độ cứng lò xo lực kế' },
      surfaceMu: { min: 0.05, max: 0.55, step: 0.05, unit: '', label: 'Hệ số ma sát mặt trượt μ' }
    },
    presets: [
      { label: 'Treo quả 1,5 kg (P = 15 N)', description: 'Kiểm chứng độ dãn lò xo tăng theo tỉ lệ thuận P = 10m', params: { massKg: 1.5, springK: 40, surfaceMu: 0.25 } },
      { label: 'Mặt nhám ma sát lớn (μ = 0,5)', description: 'Cần lực kéo lớn hơn để thắng ma sát nghỉ/trượt', params: { massKg: 2.0, springK: 40, surfaceMu: 0.5 } }
    ]
  },
  shadow_eclipse_2d: {
    id: 'shadow_eclipse_2d',
    domainId: 'optics_quantum',
    grades: ['Lớp 7', 'Lớp 9'],
    title: 'Định Luật Truyền Thẳng Ánh Sáng, Bóng Tối – Nửa Tối & Nhật/Nguyệt Thực',
    subtitle: 'Điều chỉnh kích thước nguồn sáng và khoảng cách vật cản để tách biệt vùng bóng tối (Umbra) và bóng nửa tối (Penumbra)',
    formula: '\\text{Tia sáng truyền thẳng trong môi trường đồng tính} \\implies \\text{Bóng tối & Bóng nửa tối}',
    linkedLessonId: 'phys-2006-7-1',
    defaultParams: { sourceSize: 18, objectDist: 0.46, obstacleRadius: 28 },
    paramBounds: {
      sourceSize: { min: 4, max: 32, step: 2, unit: 'px', label: 'Bán kính nguồn sáng' },
      objectDist: { min: 0.25, max: 0.72, step: 0.05, unit: '×', label: 'Vị trí vật cản' },
      obstacleRadius: { min: 16, max: 44, step: 2, unit: 'px', label: 'Kích thước vật cản' }
    },
    presets: [
      { label: 'Nguồn rộng (Nhật thực toàn phần)', description: 'Xuất hiện đồng thời vùng bóng tối và bóng nửa tối trên màn', params: { sourceSize: 18, objectDist: 0.46, obstacleRadius: 28 } },
      { label: 'Nguồn điểm (Bóng tối sắc nét)', description: 'Chỉ có vùng tối đen hoàn toàn không có bóng nửa tối', params: { sourceSize: 4, objectDist: 0.46, obstacleRadius: 28 } }
    ]
  },
  magnet_compass_2d: {
    id: 'magnet_compass_2d',
    domainId: 'electricity_mag',
    grades: ['Lớp 7', 'Lớp 9'],
    title: 'Nam Châm Vĩnh Cửu, Đường Sức Từ & Kim La Bàn Định Hướng',
    subtitle: 'Quan sát quy ước đường sức từ ra cực Bắc (N) vào cực Nam (S) và sự xoay đồng bộ của 4 kim la bàn thử nghiệm',
    formula: '\\text{Đường sức từ: Ra Bắc (N)} \\longrightarrow \\text{Vào Nam (S)}',
    linkedLessonId: 'phys-7-b6',
    defaultParams: { polarityFlip: 1, compassTiltDeg: 0, fieldStrength: 1.0 },
    paramBounds: {
      polarityFlip: { min: -1, max: 1, step: 2, unit: '', label: 'Đảo cực nam châm (1:N–S / -1:S–N)' },
      compassTiltDeg: { min: -45, max: 45, step: 5, unit: '°', label: 'Góc nhiễu từ trường ngoài' },
      fieldStrength: { min: 0.5, max: 2.0, step: 0.25, unit: '×', label: 'Độ mạnh nam châm' }
    },
    presets: [
      { label: 'Nam châm N (trái) – S (phải)', description: 'Đường sức từ hướng từ N sang S ngoài thanh nam châm', params: { polarityFlip: 1, compassTiltDeg: 0, fieldStrength: 1.2 } },
      { label: 'Đảo ngược cực S – N', description: 'Tất cả kim la bàn tự động xoay đảo đầu 180°', params: { polarityFlip: -1, compassTiltDeg: 0, fieldStrength: 1.2 } }
    ]
  },
  heat_transfer_2d: {
    id: 'heat_transfer_2d',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 8'],
    title: 'Ba Hình Thức Truyền Nhiệt: Dẫn Nhiệt – Đối Lưu – Bức Xạ Nhiệt',
    subtitle: 'So sánh tốc độ rơi đinh sáp khi dẫn nhiệt kim loại, dòng đối lưu nóng-lạnh trong bình nước và hấp thụ tia nhiệt của vật đen/bóng',
    formula: '\\text{Dẫn nhiệt (Rắn)} \\mid \\text{Đối lưu (Lỏng/Khí)} \\mid \\text{Bức xạ (Cả chân không)}',
    linkedLessonId: 'phys-2006-8-14',
    defaultParams: { transferMode: 2, heaterPower: 75, materialCoeff: 1.0 },
    paramBounds: {
      transferMode: { min: 1, max: 3, step: 1, unit: '', label: 'Hình thức (1:Dẫn nhiệt 2:Đối lưu 3:Bức xạ)' },
      heaterPower: { min: 20, max: 100, step: 10, unit: '%', label: 'Công suất nguồn nhiệt' },
      materialCoeff: { min: 0.5, max: 1.6, step: 0.1, unit: '×', label: 'Hệ số dẫn nhiệt vật liệu' }
    },
    presets: [
      { label: '1. Dẫn nhiệt & Rơi đinh sáp', description: 'Nhiệt truyền từ đầu nóng sang đầu lạnh làm chảy sáp theo thứ tự', params: { transferMode: 1, heaterPower: 80, materialCoeff: 1.2 } },
      { label: '2. Dòng đối lưu trong chất lỏng', description: 'Nước nóng giãn nở nổi lên, nước lạnh chìm xuống', params: { transferMode: 2, heaterPower: 75, materialCoeff: 1.0 } },
      { label: '3. Bức xạ nhiệt (Vật đen vs Bóng)', description: 'Bề mặt sẫm xù xì hấp thụ tia nhiệt tốt hơn bề mặt sáng bóng', params: { transferMode: 3, heaterPower: 85, materialCoeff: 1.0 } }
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
  },

  // +5 CURRICULUM AUDIT 3D SIMS
  mechanical_energy_3d: {
    id: 'mechanical_energy_3d',
    domainId: 'mechanics',
    grades: ['Lớp 9', 'Lớp 10'],
    title: 'Động Năng, Thế Năng & Bảo Toàn Cơ Năng 3D',
    subtitle: 'Bi cầu lăn trên máng parabol kèm 3 cột năng lượng W_đ (xanh), W_t (hổ phách) và W_cơ (ngọc) biến thiên theo thời gian thực',
    formula: 'W = W_đ + W_t = ½mv² + mgh',
    linkedLessonId: 'phys-9-mech-heat',
    presets: [
      { label: 'Bảo toàn lí tưởng (μ = 0)', description: 'Cơ năng không đổi khi lăn qua lại', settings: { speed: 1, amplitude: 1.2 } },
      { label: 'Có ma sát hao phí', description: 'Cơ năng giảm dần chuyển thành nhiệt', settings: { speed: 1.1, amplitude: 1.5 } }
    ]
  },
  ohm_circuit_3d: {
    id: 'ohm_circuit_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Mạch Điện Định Luật Ohm & Nhiệt Jun – Len-xơ 3D',
    subtitle: 'Bàn thí nghiệm nguồn DC, biến trở con trượt, Ampe/Vôn kế kim, dòng hạt tải điện và bình nhiệt lượng kế đun dây đốt',
    formula: 'I = U / R · Q = I²·R·t',
    linkedLessonId: 'phys-9-b11',
    presets: [
      { label: 'Mạch chuẩn 12V – 6Ω', description: 'Dòng I = 2 A chạy ổn định, sủi bọt nhẹ', settings: { speed: 1, amplitude: 1 } },
      { label: 'Công suất tỏa nhiệt cao (24V)', description: 'Dây đốt đỏ rực, bọt khí bốc mạnh', settings: { speed: 1.5, amplitude: 1.6 } }
    ]
  },
  refraction_tank_3d: {
    id: 'refraction_tank_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Bể Thí Nghiệm Khúc Xạ & Phản Xạ Ánh Sáng 3D',
    subtitle: 'Đèn laser chiếu xiên góc tới i qua mặt phân cách Không khí – Nước/Thủy tinh chiết suất n₂ kèm tia phản xạ & pháp tuyến',
    formula: 'n₁·sin(i) = n₂·sin(r)',
    linkedLessonId: 'phys-9-b5',
    presets: [
      { label: 'Khúc xạ vào nước (n=1,33)', description: 'Tia khúc xạ lệch gần pháp tuyến', settings: { speed: 1, amplitude: 1 } },
      { label: 'Khúc xạ vào kim cương (n=2,4)', description: 'Góc khúc xạ nhỏ gấp nhiều lần góc tới', settings: { speed: 1, amplitude: 1.5 } }
    ]
  },
  calorimetry_beaker_3d: {
    id: 'calorimetry_beaker_3d',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Nhiệt Lượng Kế, Nhiệt Kế & Chuyển Thể 3D',
    subtitle: 'Quan sát nhiệt kế thủy ngân tăng theo công suất đun cùng chuyển động hạt từ mạng tinh thể rắn sang lỏng và hơi',
    formula: 'Q = m·c·ΔT · Q_chuyển thể = m·L',
    linkedLessonId: 'phys-12-b3',
    presets: [
      { label: 'Pha lỏng sôi nhẹ (340 K)', description: 'Các phân tử trượt tự do và bốc hơi', settings: { speed: 1, amplitude: 1 } },
      { label: 'Nung nóng pha hơi (410 K)', description: 'Bứt pha hơi mạnh ở bề mặt thoáng', settings: { speed: 1.4, amplitude: 1.5 } }
    ]
  },
  archimedes_buoyancy_3d: {
    id: 'archimedes_buoyancy_3d',
    domainId: 'mechanics',
    grades: ['Lớp 9', 'Lớp 10'],
    title: 'Lực Đẩy Ác-si-mét & Bình Chia Độ 3D',
    subtitle: 'Khối vật liệu treo lực kế nhúng vào bình nước chia độ: mực chất lỏng dâng theo V_chìm kèm hai véc-tơ P và F_A',
    formula: 'F_A = ρ_lỏng · g · V_chìm · P = ρ_vật · g · V',
    linkedLessonId: 'phys-10-b34',
    presets: [
      { label: 'Gỗ nổi cân bằng (ρ=750)', description: 'Chìm 75% thể tích, F_A = P', settings: { speed: 1, amplitude: 1 } },
      { label: 'Kim loại chìm đáy (ρ=2000)', description: 'P > F_A, vật chìm xuống đáy bình', settings: { speed: 1, amplitude: 1.5 } }
    ]
  },
  electric_power_meter_3d: {
    id: 'electric_power_meter_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Công Suất Điện & Công Tơ Điện kWh 3D',
    subtitle: 'Nguồn DC (+) → (−) cấp điện qua đồng hồ công tơ có đĩa nhôm quay tỉ lệ P = UI và bóng đèn tải sáng rực tương ứng',
    formula: 'P = U·I · A = U·I·t · 1 kWh = 3,6×10⁶ J',
    linkedLessonId: 'phys-2006-9-4',
    presets: [
      { label: 'Mạch 220V tiêu thụ chuẩn', description: 'Đĩa công tơ quay đều, dây tóc phát sáng vừa', settings: { speed: 1, amplitude: 1 } },
      { label: 'Tải công suất lớn', description: 'Đĩa công tơ quay nhanh, đèn rực sáng', settings: { speed: 1.5, amplitude: 1.5 } }
    ]
  },
  electrolysis_3d: {
    id: 'electrolysis_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 11'],
    title: 'Bình Điện Phân & Định Luật Fa-ra-đây 3D',
    subtitle: 'Bình điện phân CuSO₄ với anôt (+) tan dần và catôt (−) được mạ lớp đồng sáng óng ánh cùng dòng ion di chuyển ngược chiều',
    formula: 'm = (1 / F) · (A / n) · I · t',
    linkedLessonId: 'phys-2006-11-10',
    presets: [
      { label: 'Điện phân CuSO₄ chuẩn', description: 'Ion Cu²⁺ tiến về catôt (−) bám kim loại', settings: { speed: 1, amplitude: 1 } },
      { label: 'Dòng điện cường độ cao', description: 'Tốc độ giải phóng kim loại tăng nhanh', settings: { speed: 1.5, amplitude: 1.6 } }
    ]
  },
  eye_optics_3d: {
    id: 'eye_optics_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Mô Hình Mắt Người & Sửa Tật Cận – Viễn 3D',
    subtitle: 'Cắt lớp nhãn cầu 3D thấy rõ thể thủy tinh, võng mạc, kính điều chỉnh và đường đi chùm tia hội tụ đúng hay lệch võng mạc',
    formula: 'D_cận = −1/OC_V · 1/f_viễn = 1/d − 1/OC_C',
    linkedLessonId: 'phys-2006-11-19',
    presets: [
      { label: 'Mắt cận chưa đeo kính', description: 'Chùm tia hội tụ trước võng mạc', settings: { speed: 1, amplitude: 1 } },
      { label: 'Mắt cận đã đeo kính phân kì', description: 'Tia sáng hội tụ sắc nét lên võng mạc', settings: { speed: 1, amplitude: 1.4 } }
    ]
  },
  em_wave_3d: {
    id: 'em_wave_3d',
    domainId: 'waves_osc',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Mô Hình 3 Trục Sóng Điện Từ (E ⊥ B ⊥ v) 3D',
    subtitle: 'Hai sóng sin cường độ điện trường E (đứng) và cảm ứng từ B (ngang) dao động đồng pha trong hai mặt phẳng vuông góc nhau',
    formula: 'E ⊥ B ⊥ v · c = λ · f = 3×10⁸ m/s',
    linkedLessonId: 'phys-12-b19',
    presets: [
      { label: 'Sóng điện từ chuẩn', description: 'E và B vuông góc, dao động đồng pha', settings: { speed: 1, frequency: 1 } },
      { label: 'Tần số cao bước sóng ngắn', description: 'Mật độ bước sóng dày đặc hơn', settings: { speed: 1.2, frequency: 1.6 } }
    ]
  },
  power_plant_3d: {
    id: 'power_plant_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Nhà Máy Thủy Điện – Nhiệt Điện & Truyền Tải Điện 3D',
    subtitle: 'Tổ hợp đập/lò hơi, tuabin cánh quạt quay rôto máy phát xoay chiều, trạm biến áp nâng áp và cột điện truyền tải 3D',
    formula: 'P_phát = η · ρgQh · ΔP = P²R / U²',
    linkedLessonId: 'phys-2006-9-17',
    presets: [
      { label: 'Tổ máy Thủy điện 80%', description: 'Dòng nước áp lực cao quay tuabin – rôto rực sáng', settings: { speed: 1.2, amplitude: 1.3 } },
      { label: 'Tổ máy Nhiệt điện hơi quá nhiệt', description: 'Luồng hơi trắng quay tuabin và trạm biến áp tăng áp', settings: { speed: 1.4, amplitude: 1.4 } }
    ]
  },
  measurement_bench_3d: {
    id: 'measurement_bench_3d',
    domainId: 'mechanics',
    grades: ['Lớp 6', 'Lớp 7', 'Lớp 8'],
    title: 'Bàn Dụng Cụ Đo Thực Hành 3D (Thước – Bình Chia Độ – Lực Kế – Nhiệt Kế)',
    subtitle: 'Quan sát mô hình 3D dụng cụ thật đặt trên bàn thí nghiệm: cân bằng thước, mực nước dâng khi thả vật và độ dãn lực kế lò xo',
    formula: 'V_{\\text{vật}} = V_2 - V_1 \\quad|\\quad P = 10\\,m \\quad|\\quad \\Delta l \\propto F',
    linkedLessonId: 'phys-6-b1',
    presets: [
      { label: 'Bàn đo chuẩn 15 cm · 18 mL', description: 'Đo đồng thời kích thước, thể tích và trọng lượng vật', settings: { speed: 1, amplitude: 1 } },
      { label: 'Vật nặng & thể tích lớn', description: 'Lò xo dãn sâu và mực nước dâng cao rõ nét', settings: { speed: 1, amplitude: 1.5 } }
    ]
  },
  thermal_expansion_3d: {
    id: 'thermal_expansion_3d',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 6', 'Lớp 8'],
    title: 'Thí Nghiệm Quả Cầu – Vòng Kim Loại & Băng Kép Nở Vì Nhiệt 3D',
    subtitle: 'Đun nóng quả cầu đồng trên ngọn lửa đèn cồn khiến quả cầu nở to không lọt qua vòng kim loại, băng kép uốn cong đóng mạch chuông',
    formula: 'V = V_0(1 + \\beta\\Delta t) \\quad|\\quad \\alpha_{\\text{Đồng}} > \\alpha_{\\text{Thép}}',
    linkedLessonId: 'phys-2006-6-4',
    presets: [
      { label: 'Chưa nung (Quả cầu lọt qua vòng)', description: 'Nhiệt độ phòng 25°C, cầu đi qua dễ dàng', settings: { speed: 1, amplitude: 0.7 } },
      { label: 'Nung nóng 120°C (Bị kẹt lại)', description: 'Quả cầu dãn nở mắc kẹt trên vòng và băng kép uốn cong', settings: { speed: 1.3, amplitude: 1.5 } }
    ]
  },
  plane_mirror_3d: {
    id: 'plane_mirror_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 7', 'Lớp 9'],
    title: 'Gương Phẳng, Tia Phản Xạ Laser & Ảnh Ảo Đối Xứng 3D',
    subtitle: 'Tia laser chiếu tới gương phẳng bật lại với góc phản xạ i\' = i; ảnh ảo đối xứng sau gương qua hai chùm tia đối xứng',
    formula: 'i\' = i \\quad|\\quad d_{\\text{ảnh}} = d_{\\text{vật}}',
    linkedLessonId: 'phys-7-b3',
    presets: [
      { label: 'Góc tới chuẩn 40°', description: 'Quan sát rõ góc tới bằng góc phản xạ trên mặt phẳng tới', settings: { speed: 1, amplitude: 1 } },
      { label: 'Góc tới nghiêng lớn 65°', description: 'Tia phản xạ vươn rộng đối xứng qua pháp tuyến', settings: { speed: 1, amplitude: 1.5 } }
    ]
  },
  lever_pulley_3d: {
    id: 'lever_pulley_3d',
    domainId: 'mechanics',
    grades: ['Lớp 6', 'Lớp 8', 'Lớp 10'],
    title: 'Đòn Bẩy Moment Lực & Hệ Ròng Rọc Động – Cố Định 3D',
    subtitle: 'Thanh đòn bẩy quay quanh điểm tựa O theo quy tắc F₁·d₁ = F₂·d₂ đặt cạnh hệ ròng rọc động giúp nâng vật nhẹ đi 2 lần',
    formula: 'M = F \\cdot d \\quad|\\quad F_1 d_1 = F_2 d_2 \\quad|\\quad F_{\\text{RR động}} = P/2',
    linkedLessonId: 'phys-8-b2',
    presets: [
      { label: 'Cân bằng Moment lực', description: 'Quả nặng bên cánh tay ngắn cân với lực nhẹ bên cánh tay dài', settings: { speed: 1, amplitude: 1 } },
      { label: 'Nâng hạ đòn bẩy & ròng rọc', description: 'Quan sát trực tiếp độ lệch tay đòn và vòng quay ròng rọc', settings: { speed: 1.2, amplitude: 1.4 } }
    ]
  },
  hydraulic_press_3d: {
    id: 'hydraulic_press_3d',
    domainId: 'mechanics',
    grades: ['Lớp 8'],
    title: 'Bình Thông Nhau & Máy Ép Thủy Lực Pascal 3D',
    subtitle: 'Hai xilanh nối thông đáy chứa dầu thủy lực: nhấn lực nhỏ f xuống pít-tông hẹp s làm pít-tông lớn S nâng khối nặng F',
    formula: '\\frac{F}{f} = \\frac{S}{s} \\quad|\\quad p = d \\cdot h',
    linkedLessonId: 'phys-2006-8-1',
    presets: [
      { label: 'Ép nhẹ nâng khối lớn (tỉ lệ 6×)', description: 'Pít-tông nhỏ hạ nhiều, pít-tông lớn nâng chậm nhưng lực cực đại', settings: { speed: 1, amplitude: 1.2 } },
      { label: 'Tăng lực nhấn tối đa', description: 'Áp suất chất lỏng truyền nguyên vẹn mọi hướng nâng vật lên cao', settings: { speed: 1.3, amplitude: 1.6 } }
    ]
  },
  hooke_forces_3d: {
    id: 'hooke_forces_3d',
    domainId: 'mechanics',
    grades: ['Lớp 6', 'Lớp 8', 'Lớp 10'],
    title: 'Lực Kế Lò Xo (P = 10m) & Lực Ma Sát Trượt 3D',
    subtitle: 'Treo quả nặng đo trọng lượng bằng độ dãn lò xo bên cạnh mô hình khối trượt chịu ma sát trên mặt bàn',
    formula: 'P = 10\\,m \\quad|\\quad F_{\\text{ms}} = \\mu N',
    linkedLessonId: 'phys-6-b3',
    presets: [
      { label: 'Quả nặng chuẩn 2 kg', description: 'Lực kế chỉ 20 N, khối trượt đều', settings: { speed: 1, amplitude: 1 } }
    ]
  },
  shadow_eclipse_3d: {
    id: 'shadow_eclipse_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 7', 'Lớp 9'],
    title: 'Truyền Thẳng Ánh Sáng, Bóng Tối & Nhật Thực 3D',
    subtitle: 'Chiếu chùm sáng qua vật cản cầu tạo nón bóng tối đen hoàn toàn và vành bóng nửa tối trên màn hứng',
    formula: '\\text{Bóng tối (Umbra)} \\mid \\text{Bóng nửa tối (Penumbra)}',
    linkedLessonId: 'phys-2006-7-1',
    presets: [
      { label: 'Vành bóng tối & nửa tối rõ nét', description: 'Đặt vật cản giữa nguồn sáng rộng và màn', settings: { speed: 1, amplitude: 1 } }
    ]
  },
  magnet_compass_3d: {
    id: 'magnet_compass_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 7', 'Lớp 9'],
    title: 'Nam Châm Vĩnh Cửu, Đường Sức Từ 3D & Kim La Bàn',
    subtitle: 'Đường sức từ không gian 3 chiều quanh thanh nam châm thẳng và 4 kim la bàn xoay theo cực Bắc–Nam',
    formula: '\\text{Từ trường Trái Đất} \\mid \\text{Ra Bắc (N) – Vào Nam (S)}',
    linkedLessonId: 'phys-7-b6',
    presets: [
      { label: 'Đường sức từ chuẩn', description: 'Quan sát kim la bàn chỉ hướng từ phổ', settings: { speed: 1, showVectors: true } }
    ]
  },
  electromagnet_bell_3d: {
    id: 'electromagnet_bell_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 7', 'Lớp 9'],
    title: 'Nam Châm Điện Cuộn Dây Lõi Sắt & Chuông Điện 3D',
    subtitle: 'Dòng điện chạy qua ống dây biến lõi sắt thành nam châm hút búa gõ chuông rung liên hồi',
    formula: 'B \\propto n \\cdot I',
    linkedLessonId: 'phys-7-b7',
    presets: [
      { label: 'Đóng mạch chuông điện reo', description: 'Lõi sắt hút cần rung đập chuông liên tục', settings: { speed: 1.2, amplitude: 1.3 } }
    ]
  },
  heat_transfer_3d: {
    id: 'heat_transfer_3d',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 8'],
    title: 'Dẫn Nhiệt Thanh Kim Loại & Đối Lưu Chất Lỏng 3D',
    subtitle: 'Đặt cạnh nhau thanh đồng dẫn nhiệt trên ngọn lửa và bình thủy tinh đối lưu dòng nóng đi lên – lạnh chìm xuống',
    formula: '\\text{Dẫn nhiệt (Rắn)} \\mid \\text{Đối lưu (Lỏng/Khí)}',
    linkedLessonId: 'phys-2006-8-14',
    presets: [
      { label: 'Gia nhiệt đối lưu mạnh', description: 'Các hạt nhiệt tuần hoàn nhanh trong bình nước', settings: { speed: 1.2, amplitude: 1.3 } }
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
  },
  mechanical_energy_3d: {
    mode: 'mechanical_energy_3d',
    shortLabel: 'Động & Thế Năng 3D',
    hudTitle: 'Bảo Toàn & Chuyển Hóa Động Năng – Thế Năng 3D',
    params: [
      { key: 'p1', label: 'Độ cao thả h₀', unit: 'm', min: 5, max: 30, step: 1, defaultVal: 18, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Hệ số ma sát μ', unit: '', min: 0, max: 0.3, step: 0.02, defaultVal: 0.02, accent: 'accent-rose-500' }
    ],
    computeReadout: (v) => {
      const m = 2.0;
      const g = 9.8;
      const w0 = m * g * v.p1;
      const vMax = Math.sqrt(2 * g * v.p1);
      return `W₀ = mgh₀ = ${w0.toFixed(0)} J (m=2 kg) · Vận tốc đáy cực đại v_max ≈ ${vMax.toFixed(1)} m/s${v.p2 > 0 ? ` · Hao phí ma sát μ = ${v.p2}` : ' · Bảo toàn cơ năng'}`;
    }
  },
  ohm_circuit_3d: {
    mode: 'ohm_circuit_3d',
    shortLabel: 'Mạch Ohm & Jun-Len-xơ 3D',
    hudTitle: 'Bàn Thí Nghiệm Định Luật Ohm & Nhiệt Tỏa I²Rt 3D',
    params: [
      { key: 'p1', label: 'Hiệu điện thế U', unit: 'V', min: 3, max: 24, step: 1, defaultVal: 12, accent: 'accent-sky-500' },
      { key: 'p2', label: 'Điện trở mạch R', unit: 'Ω', min: 2, max: 24, step: 1, defaultVal: 6, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => {
      const i = v.p1 / Math.max(0.5, v.p2);
      const p = v.p1 * i;
      return `Cường độ I = U/R = ${i.toFixed(2)} A · Công suất tỏa nhiệt P = I²R = ${p.toFixed(1)} W`;
    }
  },
  refraction_tank_3d: {
    mode: 'refraction_tank_3d',
    shortLabel: 'Bể Khúc Xạ 3D',
    hudTitle: 'Bể Nước Khúc Xạ & Phản Xạ Tia Laser 3D',
    params: [
      { key: 'p1', label: 'Góc tới i', unit: '°', min: 10, max: 75, step: 1, defaultVal: 45, accent: 'accent-emerald-500' },
      { key: 'p2', label: 'Chiết suất môi trường n₂', unit: '', min: 1.0, max: 2.4, step: 0.05, defaultVal: 1.33, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => {
      const sinR = Math.sin((v.p1 * Math.PI) / 180) / Math.max(1.0, v.p2);
      const rDeg = (Math.asin(Math.min(1, sinR)) * 180) / Math.PI;
      return `n₁ = 1,00 → n₂ = ${v.p2.toFixed(2)} · Góc tới i = ${v.p1}° ⇒ Góc khúc xạ r = ${rDeg.toFixed(1)}°`;
    }
  },
  calorimetry_beaker_3d: {
    mode: 'calorimetry_beaker_3d',
    shortLabel: 'Nhiệt Lượng Kế 3D',
    hudTitle: 'Nhiệt Lượng Kế, Nhiệt Kế & Chuyển Pha 3D',
    params: [
      { key: 'p1', label: 'Nhiệt độ khối mẫu T', unit: 'K', min: 260, max: 420, step: 5, defaultVal: 340, accent: 'accent-rose-500' },
      { key: 'p2', label: 'Công suất gia nhiệt', unit: '×', min: 0.5, max: 2.0, step: 0.1, defaultVal: 1.0, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => {
      const c = v.p1 - 273.15;
      const phase = v.p1 < 273 ? 'Rắn (dao động quanh nút mạng)' : v.p1 < 373 ? 'Lỏng (trượt tự do)' : 'Hơi / Sôi mạnh';
      return `T = ${v.p1} K (${c.toFixed(1)} °C) · Trạng thái: ${phase} · Gia nhiệt ${v.p2.toFixed(1)}×`;
    }
  },
  archimedes_buoyancy_3d: {
    mode: 'archimedes_buoyancy_3d',
    shortLabel: 'Ác-si-mét 3D',
    hudTitle: 'Lực Đẩy Ác-si-mét & Bình Chia Độ 3D',
    params: [
      { key: 'p1', label: 'Khối lượng riêng vật ρ', unit: 'kg/m³', min: 300, max: 2500, step: 50, defaultVal: 750, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Thể tích khối V', unit: 'lít', min: 1, max: 8, step: 0.5, defaultVal: 4, accent: 'accent-sky-500' }
    ],
    computeReadout: (v) => {
      const rhoL = 1000;
      const subFrac = Math.min(1, v.p1 / rhoL);
      const pWeight = v.p1 * (v.p2 * 0.001) * 9.81;
      const fa = rhoL * (v.p2 * 0.001 * subFrac) * 9.81;
      const status = v.p1 < rhoL ? `Nổi (chìm ${(subFrac * 100).toFixed(0)}%)` : v.p1 === rhoL ? 'Lơ lửng' : 'Chìm đáy';
      return `${status} · P = ${pWeight.toFixed(1)} N · F_A = ${fa.toFixed(1)} N`;
    }
  },
  electric_power_meter_3d: {
    mode: 'electric_power_meter_3d',
    shortLabel: 'Công Tơ & P = UI 3D',
    hudTitle: 'Mạch Điện, Công Tơ kWh & Công Suất Tiêu Thụ 3D',
    params: [
      { key: 'p1', label: 'Hiệu điện thế U', unit: 'V', min: 12, max: 240, step: 12, defaultVal: 120, accent: 'accent-sky-500' },
      { key: 'p2', label: 'Điện trở tải R', unit: 'Ω', min: 10, max: 120, step: 5, defaultVal: 30, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => {
      const i = v.p1 / Math.max(1, v.p2);
      const p = v.p1 * i;
      return `I = U/R = ${i.toFixed(2)} A · Công suất P = UI = ${p.toFixed(0)} W · Đĩa công tơ quay tỉ lệ P`;
    }
  },
  electrolysis_3d: {
    mode: 'electrolysis_3d',
    shortLabel: 'Bình Điện Phân 3D',
    hudTitle: 'Bình Điện Phân CuSO₄ & Định Luật Fa-ra-đây 3D',
    params: [
      { key: 'p1', label: 'Cường độ dòng I', unit: 'A', min: 0.5, max: 10, step: 0.5, defaultVal: 4.0, accent: 'accent-cyan-500' },
      { key: 'p2', label: 'Thời gian điện phân', unit: 'phút', min: 2, max: 60, step: 2, defaultVal: 16, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => {
      const mGram = (1 / 96500) * (64 / 2) * v.p1 * (v.p2 * 60);
      return `I = ${v.p1.toFixed(1)} A trong ${v.p2} phút ⇒ Lượng đồng bám Catôt (−): m = ${mGram.toFixed(2)} g`;
    }
  },
  eye_optics_3d: {
    mode: 'eye_optics_3d',
    shortLabel: 'Mắt & Sửa Tật 3D',
    hudTitle: 'Nhãn Cầu 3D, Điều Tiết & Kính Sửa Tật Mắt',
    params: [
      { key: 'p1', label: 'Tật (0:Thường / 1:Cận / 2:Viễn)', unit: '', min: 0, max: 2, step: 1, defaultVal: 1, accent: 'accent-emerald-500' },
      { key: 'p2', label: 'Đeo kính sửa (0:Không / 1:Đeo)', unit: '', min: 0, max: 1, step: 1, defaultVal: 1, accent: 'accent-sky-500' }
    ],
    computeReadout: (v) => {
      const mode = Math.round(v.p1);
      const glass = v.p2 >= 0.5;
      if (mode === 0) return 'Mắt bình thường: Chùm tia hội tụ sắc nét ngay tại võng mạc.';
      if (mode === 1) return glass ? 'Mắt cận ĐEO KÍNH PHÂN KÌ: Tiêu điểm lùi về đúng võng mạc!' : 'Mắt cận KHÔNG KÍNH: Ảnh hội tụ TRƯỚC võng mạc (mờ).';
      return glass ? 'Mắt viễn ĐEO KÍNH HỘI TỤ: Kéo ảnh về đúng võng mạc!' : 'Mắt viễn KHÔNG KÍNH: Ảnh hội tụ SAU võng mạc (mờ).';
    }
  },
  em_wave_3d: {
    mode: 'em_wave_3d',
    shortLabel: 'Sóng Điện Từ 3D',
    hudTitle: 'Sóng Điện Từ Ngang 3 Trục E ⊥ B ⊥ v 3D',
    params: [
      { key: 'p1', label: 'Tần số sóng f', unit: '×f₀', min: 0.5, max: 2.5, step: 0.1, defaultVal: 1.0, accent: 'accent-rose-500' },
      { key: 'p2', label: 'Biên độ điện trường E₀', unit: '×', min: 0.4, max: 1.6, step: 0.1, defaultVal: 1.0, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => `Véctơ E (đỏ, trục Y) và B (xanh lơ, trục Z) vuông góc nhau và dao động CÙNG PHA dọc phương truyền X.`
  },
  power_plant_3d: {
    mode: 'power_plant_3d',
    shortLabel: 'Nhà Máy Điện 3D',
    hudTitle: 'Tổ Hợp Tuabin – Máy Phát & Trạm Tăng Áp 3D',
    params: [
      { key: 'p1', label: 'Lưu lượng nước / hơi', unit: '×', min: 0.5, max: 2.0, step: 0.1, defaultVal: 1.2, accent: 'accent-sky-500' },
      { key: 'p2', label: 'Chế độ (0:Nhiệt / 1:Thủy)', unit: '', min: 0, max: 1, step: 1, defaultVal: 1, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => `${v.p2 >= 0.5 ? 'Thủy điện' : 'Nhiệt điện'}: Tốc độ quay tuabin ${(v.p1 * 50).toFixed(0)} Hz · Điện áp lưới sau trạm nâng áp ${(v.p1 * 220).toFixed(0)} kV.`
  },
  measurement_bench_3d: {
    mode: 'measurement_bench_3d',
    shortLabel: 'Bàn Dụng Cụ Đo 3D',
    hudTitle: 'Bàn Dụng Cụ Đo: Thước – Bình Chia Độ – Lực Kế – Nhiệt Kế 3D',
    params: [
      { key: 'p1', label: 'Thể tích / Độ dài mẫu', unit: 'cm/mL', min: 4, max: 30, step: 2, defaultVal: 14, accent: 'accent-sky-500' },
      { key: 'p2', label: 'Khối lượng treo lực kế', unit: 'kg', min: 0.5, max: 5.0, step: 0.5, defaultVal: 2.0, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => `Thước: ${v.p1} cm · Bình chia độ dâng +${v.p1} mL · Trọng lượng P = 10m = ${(v.p2 * 10).toFixed(1)} N.`
  },
  thermal_expansion_3d: {
    mode: 'thermal_expansion_3d',
    shortLabel: 'Nở Vì Nhiệt 3D',
    hudTitle: 'Quả Cầu – Vòng Kim Loại & Băng Kép Nở Vì Nhiệt 3D',
    params: [
      { key: 'p1', label: 'Nhiệt độ gia nhiệt', unit: '°C', min: 20, max: 180, step: 10, defaultVal: 110, accent: 'accent-rose-500' },
      { key: 'p2', label: 'Độ nhạy băng kép', unit: '×', min: 0.5, max: 1.8, step: 0.1, defaultVal: 1.1, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => v.p1 >= 75 ? `T = ${v.p1}°C: Quả cầu đồng nở to KẸT trên vòng kim loại, băng kép cong đóng tiếp điểm!` : `T = ${v.p1}°C: Quả cầu nguội co lại lọt qua vòng kim loại dễ dàng.`
  },
  plane_mirror_3d: {
    mode: 'plane_mirror_3d',
    shortLabel: 'Gương Phẳng 3D',
    hudTitle: 'Phản Xạ Ánh Sáng & Ảnh Ảo Qua Gương Phẳng 3D',
    params: [
      { key: 'p1', label: 'Góc tới i', unit: '°', min: 10, max: 75, step: 5, defaultVal: 40, accent: 'accent-emerald-500' },
      { key: 'p2', label: 'Khoảng cách vật đến gương', unit: 'm', min: 0.8, max: 2.6, step: 0.2, defaultVal: 1.6, accent: 'accent-sky-500' }
    ],
    computeReadout: (v) => `Định luật phản xạ: Góc phản xạ i' = i = ${v.p1}° · Ảnh ảo cách gương đúng ${v.p2.toFixed(1)} m (cách vật ${(v.p2 * 2).toFixed(1)} m).`
  },
  lever_pulley_3d: {
    mode: 'lever_pulley_3d',
    shortLabel: 'Đòn Bẩy & Ròng Rọc 3D',
    hudTitle: 'Đòn Bẩy Moment Lực & Hệ Ròng Rọc Động 3D',
    params: [
      { key: 'p1', label: 'Cánh tay đòn lực d₁', unit: 'm', min: 0.8, max: 2.8, step: 0.2, defaultVal: 2.0, accent: 'accent-sky-500' },
      { key: 'p2', label: 'Tải trọng vật nặng P', unit: 'N', min: 20, max: 120, step: 10, defaultVal: 60, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => {
      const fLever = (v.p2 * 1.0) / Math.max(0.5, v.p1);
      const fPulley = v.p2 / 2;
      return `Đòn bẩy (d₂=1 m): Cần lực F₁ = ${fLever.toFixed(1)} N (Moment M = ${(v.p2 * 1.0).toFixed(0)} N·m) · Ròng rọc động: F = P/2 = ${fPulley.toFixed(1)} N.`;
    }
  },
  hydraulic_press_3d: {
    mode: 'hydraulic_press_3d',
    shortLabel: 'Máy Ép Thủy Lực 3D',
    hudTitle: 'Bình Thông Nhau & Máy Ép Thủy Lực Pascal 3D',
    params: [
      { key: 'p1', label: 'Lực ấn pít-tông nhỏ f', unit: 'N', min: 10, max: 100, step: 5, defaultVal: 40, accent: 'accent-cyan-500' },
      { key: 'p2', label: 'Tỉ số tiết diện S₂ / S₁', unit: '×', min: 2, max: 10, step: 1, defaultVal: 6, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => `Lực ấn f = ${v.p1} N qua máy ép tỉ số ${v.p2}× tạo lực nâng ở pít-tông lớn F = ${(v.p1 * v.p2).toFixed(0)} N!`
  },
  hooke_forces_3d: {
    mode: 'hooke_forces_3d',
    shortLabel: 'Lực Kế & Ma Sát 3D',
    hudTitle: 'Lực Kế Lò Xo (P = 10m) & Lực Ma Sát Trượt 3D',
    params: [
      { key: 'p1', label: 'Khối lượng quả nặng m', unit: 'kg', min: 0.5, max: 5.0, step: 0.5, defaultVal: 2.0, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Hệ số ma sát μ', unit: '', min: 0.05, max: 0.6, step: 0.05, defaultVal: 0.25, accent: 'accent-rose-500' }
    ],
    computeReadout: (v) => `Trọng lượng P = 10·m = ${(v.p1 * 10).toFixed(1)} N · Lực ma sát trượt F_ms = ${(v.p1 * 10 * v.p2).toFixed(1)} N.`
  },
  shadow_eclipse_3d: {
    mode: 'shadow_eclipse_3d',
    shortLabel: 'Bóng Tối & Nhật Thực 3D',
    hudTitle: 'Truyền Thẳng Ánh Sáng, Bóng Tối & Nhật Thực 3D',
    params: [
      { key: 'p1', label: 'Vị trí vật cản (m)', unit: 'm', min: -1.4, max: 1.4, step: 0.2, defaultVal: 0, accent: 'accent-sky-500' },
      { key: 'p2', label: 'Kích thước nguồn sáng', unit: '×', min: 0.4, max: 1.5, step: 0.1, defaultVal: 1.0, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => `Nguồn sáng kích thước ${v.p2.toFixed(1)}× tạo vùng bóng tối đen và vành bóng nửa tối trên màn ảnh.`
  },
  magnet_compass_3d: {
    mode: 'magnet_compass_3d',
    shortLabel: 'Nam Châm & La Bàn 3D',
    hudTitle: 'Nam Châm Vĩnh Cửu, Đường Sức Từ 3D & Kim La Bàn',
    params: [
      { key: 'p1', label: 'Chiều cực (1:N-S / -1:S-N)', unit: '', min: -1, max: 1, step: 2, defaultVal: 1, accent: 'accent-rose-500' },
      { key: 'p2', label: 'Độ mạnh từ trường', unit: '×', min: 0.5, max: 2.0, step: 0.25, defaultVal: 1.2, accent: 'accent-sky-500' }
    ],
    computeReadout: (v) => `Cực ${v.p1 >= 0 ? 'Bắc (N) bên trái' : 'Bắc (N) bên phải'} · Đường sức đi ra cực Bắc (N) và vào cực Nam (S).`
  },
  electromagnet_bell_3d: {
    mode: 'electromagnet_bell_3d',
    shortLabel: 'Nam Châm Điện 3D',
    hudTitle: 'Nam Châm Điện Cuộn Dây Lõi Sắt & Chuông Điện 3D',
    params: [
      { key: 'p1', label: 'Cường độ dòng điện I', unit: 'A', min: 0, max: 6, step: 0.5, defaultVal: 3.0, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Số vòng dây N', unit: 'vòng', min: 50, max: 300, step: 25, defaultVal: 150, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => v.p1 > 0.2 ? `Dòng I = ${v.p1} A qua ${v.p2} vòng dây: Lõi sắt hóa nam châm mạnh làm chuông reo liên tục!` : 'Ngắt dòng điện (I = 0): Lõi sắt non mất hết từ tính ngay.'
  },
  heat_transfer_3d: {
    mode: 'heat_transfer_3d',
    shortLabel: 'Truyền Nhiệt 3D',
    hudTitle: 'Dẫn Nhiệt (Rắn) & Đối Lưu (Lỏng/Khí) 3D',
    params: [
      { key: 'p1', label: 'Công suất nguồn nhiệt', unit: '%', min: 20, max: 100, step: 10, defaultVal: 75, accent: 'accent-rose-500' },
      { key: 'p2', label: 'Chế độ (1:Dẫn 2:Đối lưu 3:Bức xạ)', unit: '', min: 1, max: 3, step: 1, defaultVal: 2, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => `Công suất ${v.p1}% · Dòng đối lưu nóng nổi lên lạnh chìm xuống kết hợp dẫn nhiệt qua chất rắn.`
  }
};
