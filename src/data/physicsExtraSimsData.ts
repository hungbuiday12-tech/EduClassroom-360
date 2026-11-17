import { Physics3DMode, PhysicsSimType } from '../types';
import { Physics2DSimSpec, Physics3DSimSpec } from './physicsDomainsData';

export type ExtraPhysicsSim2DId =
  | 'atwood_pulley'
  | 'inclined_plane'
  | 'momentum_collision'
  | 'torque_lever'
  | 'kepler_orbit'
  | 'damped_resonance'
  | 'beat_waves'
  | 'sound_intensity'
  | 'lissajous_shm'
  | 'coulomb_pendulum'
  | 'rc_capacitor'
  | 'wheatstone_bridge'
  | 'transformer_2d'
  | 'lc_oscillation'
  | 'prism_dispersion'
  | 'spherical_mirror'
  | 'malus_polarization'
  | 'hydrogen_spectrum'
  | 'pv_thermodynamics'
  | 'calorimetry_mixing'
  | 'bernoulli_flow'
  | 'nuclear_fission';

export type ExtraPhysics3DModeId =
  | 'inclined_plane_3d'
  | 'collision_spheres_3d'
  | 'gyroscope_precession_3d'
  | 'kepler_orbit_3d'
  | 'simple_pendulum_3d'
  | 'coupled_pendulums_3d'
  | 'resonance_tubes_3d'
  | 'solenoid_field_3d'
  | 'electric_dipole_3d'
  | 'dc_motor_3d'
  | 'transformer_3d'
  | 'prism_dispersion_3d'
  | 'curved_mirror_3d'
  | 'polarization_3d'
  | 'blackbody_cavity_3d'
  | 'carnot_piston_3d'
  | 'nuclear_fission_3d'
  | 'rutherford_scattering_3d';

export interface Extra3DParamDef {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
  accent: string;
}

export interface Extra3DSceneConfig {
  mode: ExtraPhysics3DModeId;
  shortLabel: string;
  hudTitle: string;
  params: Extra3DParamDef[];
  computeReadout: (vals: Record<string, number>) => string;
}

export const EXTRA_PHYSICS_2D_SIMS: Record<ExtraPhysicsSim2DId, Physics2DSimSpec> = {
  // --------------------------------------------------------------------------
  // DOMAIN 1: MECHANICS (+5)
  // --------------------------------------------------------------------------
  atwood_pulley: {
    id: 'atwood_pulley',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Máy Atwood & Lực Căng Dây Ròng Rọc',
    subtitle: 'Khảo sát gia tốc hai vật treo vắt qua ròng rọc cố định và lực căng T',
    formula: 'a = (m₂ - m₁)g / (m₁ + m₂) · T = 2m₁m₂g / (m₁ + m₂)',
    linkedLessonId: 'phys-10-accel',
    defaultParams: { m1: 2.0, m2: 3.5, g: 9.8 },
    paramBounds: {
      m1: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng m₁' },
      m2: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng m₂' },
      g: { min: 1.6, max: 15, step: 0.2, unit: 'm/s²', label: 'Gia tốc rơi tự do g' }
    },
    presets: [
      { label: 'Chênh lệch nhẹ', description: 'm₁ = 2 kg, m₂ = 3.5 kg', params: { m1: 2, m2: 3.5, g: 9.8 } },
      { label: 'Cân bằng tĩnh', description: 'm₁ = m₂ = 4 kg → a = 0', params: { m1: 4, m2: 4, g: 9.8 } },
      { label: 'Rơi nhanh (m₂ >> m₁)', description: 'm₁ = 1 kg, m₂ = 8 kg', params: { m1: 1, m2: 8, g: 9.8 } }
    ]
  },
  inclined_plane: {
    id: 'inclined_plane',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Mặt Phẳng Nghiêng & Lực Ma Sát Trượt',
    subtitle: 'Phân tích trọng lực P thành Pₓ, Pᵧ và kiểm tra điều kiện trượt Fₘₛ = μN',
    formula: 'a = g(sinα - μ·cosα)',
    linkedLessonId: 'phys-10-accel',
    defaultParams: { angle: 30, mu: 0.2, mass: 3.0 },
    paramBounds: {
      angle: { min: 5, max: 65, step: 1, unit: '°', label: 'Góc nghiêng α' },
      mu: { min: 0, max: 0.8, step: 0.05, unit: '', label: 'Hệ số ma sát μ' },
      mass: { min: 1, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng vật m' }
    },
    presets: [
      { label: 'Trượt có ma sát (30°)', description: 'α = 30°, μ = 0.2', params: { angle: 30, mu: 0.2, mass: 3 } },
      { label: 'Vật đứng yên (μ > tanα)', description: 'α = 18°, μ = 0.45', params: { angle: 18, mu: 0.45, mass: 4 } },
      { label: 'Không ma sát (45°)', description: 'α = 45°, μ = 0', params: { angle: 45, mu: 0, mass: 2 } }
    ]
  },
  momentum_collision: {
    id: 'momentum_collision',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Va Chạm Đàn Hồi & Va Chạm Mềm 1D',
    subtitle: 'Kiểm chứng định luật bảo toàn động lượng và cơ năng trước/sau va chạm',
    formula: 'm₁v₁ + m₂v₂ = m₁v₁\' + m₂v₂\'',
    linkedLessonId: 'phys-10-proj',
    defaultParams: { m1: 3.0, m2: 2.0, v1: 5.0, restitution: 1.0 },
    paramBounds: {
      m1: { min: 1, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng xe 1 (m₁)' },
      m2: { min: 1, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng xe 2 (m₂)' },
      v1: { min: 1, max: 10, step: 0.5, unit: 'm/s', label: 'Vận tốc đầu xe 1 (v₁)' },
      restitution: { min: 0, max: 1, step: 0.1, unit: 'e', label: 'Hệ số đàn hồi e (0: mềm, 1: đàn hồi)' }
    },
    presets: [
      { label: 'Va chạm đàn hồi (e=1)', description: 'Bảo toàn cả động lượng và động năng', params: { m1: 3, m2: 2, v1: 5, restitution: 1 } },
      { label: 'Va chạm mềm (e=0)', description: 'Hai xe dính nhau sau va chạm', params: { m1: 4, m2: 4, v1: 6, restitution: 0 } },
      { label: 'Bi nặng tông bi nhẹ', description: 'm₁ = 8 kg, m₂ = 1 kg, e = 1', params: { m1: 8, m2: 1, v1: 4, restitution: 1 } }
    ]
  },
  torque_lever: {
    id: 'torque_lever',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Cân Bằng Momen Lực & Đòn Bẩy Quay',
    subtitle: 'Khảo sát mômen M = F·d của hai vật đặt trên thanh ngang có trục quay cố định',
    formula: 'M₁ = M₂ ⇔ m₁g·d₁ = m₂g·d₂',
    linkedLessonId: 'phys-9-math-vec',
    defaultParams: { mLeft: 4.0, dLeft: 2.0, mRight: 2.0, dRight: 4.0 },
    paramBounds: {
      mLeft: { min: 1, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng bên trái m₁' },
      dLeft: { min: 0.5, max: 5, step: 0.5, unit: 'm', label: 'Cánh tay đòn trái d₁' },
      mRight: { min: 1, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng bên phải m₂' },
      dRight: { min: 0.5, max: 5, step: 0.5, unit: 'm', label: 'Cánh tay đòn phải d₂' }
    },
    presets: [
      { label: 'Cân bằng hoàn hảo', description: '4kg×2m = 2kg×4m', params: { mLeft: 4, dLeft: 2, mRight: 2, dRight: 4 } },
      { label: 'Nghiêng mạnh trái', description: 'M₁ > M₂', params: { mLeft: 7, dLeft: 3.5, mRight: 2, dRight: 2 } },
      { label: 'Nghiêng phải', description: 'M₂ > M₁', params: { mLeft: 2, dLeft: 2, mRight: 6, dRight: 3.5 } }
    ]
  },
  kepler_orbit: {
    id: 'kepler_orbit',
    domainId: 'mechanics',
    grades: ['Lớp 10', 'Lớp 12'],
    title: 'Quỹ Đạo Hành Tinh Elip & Định Luật Kepler',
    subtitle: 'Vận tốc góc tăng mạnh tại cận nhật và giảm tại viễn nhật (bảo toàn diện tích)',
    formula: 'T² / a³ = 4π² / (GM) · r₁v₁ = r₂v₂',
    linkedLessonId: 'phys-10-circular',
    defaultParams: { semiMajor: 1.5, eccentricity: 0.45, starMass: 1.0 },
    paramBounds: {
      semiMajor: { min: 1.0, max: 2.5, step: 0.1, unit: 'AU', label: 'Bán trục lớn a' },
      eccentricity: { min: 0, max: 0.72, step: 0.03, unit: 'e', label: 'Độ lệch tâm elip e' },
      starMass: { min: 0.5, max: 2.5, step: 0.1, unit: 'M☉', label: 'Khối lượng ngôi sao' }
    },
    presets: [
      { label: 'Sao Thủy (e=0.21)', description: 'Quỹ đạo gần tròn', params: { semiMajor: 1.1, eccentricity: 0.21, starMass: 1.0 } },
      { label: 'Sao chổi Elip dẹt (e=0.65)', description: 'Tăng tốc cực đại gần Mặt Trời', params: { semiMajor: 1.8, eccentricity: 0.65, starMass: 1.2 } },
      { label: 'Tròn hoàn hảo (e=0)', description: 'Tốc độ không đổi', params: { semiMajor: 1.5, eccentricity: 0, starMass: 1.0 } }
    ]
  },

  // --------------------------------------------------------------------------
  // DOMAIN 2: WAVES & OSCILLATIONS (+4)
  // --------------------------------------------------------------------------
  damped_resonance: {
    id: 'damped_resonance',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Dao Động Tắt Dần & Cộng Hưởng Cơ Học',
    subtitle: 'Vẽ đường cong cộng hưởng A(f) khi thay đổi tần số ngoại lực f và lực cản b',
    formula: 'f_ngoại = f₀ = (1/2π)√(k/m) ⇒ A_max',
    linkedLessonId: 'phys-11-shm',
    defaultParams: { f0: 2.5, fDrive: 2.4, damping: 0.25 },
    paramBounds: {
      f0: { min: 1.0, max: 5.0, step: 0.1, unit: 'Hz', label: 'Tần số riêng f₀' },
      fDrive: { min: 0.5, max: 5.5, step: 0.1, unit: 'Hz', label: 'Tần số ngoại lực f' },
      damping: { min: 0.08, max: 1.2, step: 0.04, unit: 'c', label: 'Hệ số cản môi trường' }
    },
    presets: [
      { label: 'Đỉnh Cộng hưởng sắc nét', description: 'f = f₀ = 2.5 Hz, cản nhỏ', params: { f0: 2.5, fDrive: 2.5, damping: 0.12 } },
      { label: 'Ngoài cộng hưởng', description: 'f = 4.2 Hz xa f₀', params: { f0: 2.5, fDrive: 4.2, damping: 0.2 } },
      { label: 'Ma sát nhớt lớn', description: 'Đỉnh cộng hưởng tù thấp', params: { f0: 2.5, fDrive: 2.5, damping: 0.9 } }
    ]
  },
  beat_waves: {
    id: 'beat_waves',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Hiện Tượng Phách Âm & Tổng Hợp Sóng',
    subtitle: 'Cộng 2 sóng x₁ và x₂ có tần số gần nhau f₁ ≈ f₂ tạo hình bao phách tần số |f₁−f₂|',
    formula: 'f_phách = |f₁ - f₂| · f_trung = (f₁ + f₂)/2',
    linkedLessonId: 'phys-11-b12',
    defaultParams: { f1: 8.0, f2: 9.0, amp: 1.0 },
    paramBounds: {
      f1: { min: 4.0, max: 14.0, step: 0.5, unit: 'Hz', label: 'Tần số sóng 1 (f₁)' },
      f2: { min: 4.0, max: 14.0, step: 0.5, unit: 'Hz', label: 'Tần số sóng 2 (f₂)' },
      amp: { min: 0.4, max: 1.5, step: 0.1, unit: 'A', label: 'Biên độ thành phần' }
    },
    presets: [
      { label: 'Phách chậm 1 Hz', description: 'f₁ = 8 Hz, f₂ = 9 Hz', params: { f1: 8, f2: 9, amp: 1 } },
      { label: 'Phách nhanh 2.5 Hz', description: 'f₁ = 7.5 Hz, f₂ = 10 Hz', params: { f1: 7.5, f2: 10, amp: 1 } },
      { label: 'Đồng tần (không phách)', description: 'f₁ = f₂ = 8 Hz → A_tổng = 2A', params: { f1: 8, f2: 8, amp: 1 } }
    ]
  },
  sound_intensity: {
    id: 'sound_intensity',
    domainId: 'waves_osc',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Cường Độ Âm & Mức Cường Độ Âm (dB)',
    subtitle: 'Khảo sát sự suy giảm năng lượng sóng cầu theo khoảng cách r và ngưỡng nghe',
    formula: 'I = P / (4πr²) · L = 10·log₁₀(I / I₀) (dB)',
    linkedLessonId: 'phys-doppler-effect',
    defaultParams: { powerMw: 50, distanceM: 5, freqHz: 440 },
    paramBounds: {
      powerMw: { min: 1, max: 500, step: 5, unit: 'mW', label: 'Công suất nguồn âm P' },
      distanceM: { min: 1, max: 50, step: 1, unit: 'm', label: 'Khoảng cách r' },
      freqHz: { min: 100, max: 2000, step: 20, unit: 'Hz', label: 'Tần số âm f' }
    },
    presets: [
      { label: 'Phòng học (50 mW, 5m)', description: 'Mức âm giao tiếp bình thường', params: { powerMw: 50, distanceM: 5, freqHz: 440 } },
      { label: 'Sát loa công suất lớn', description: 'P = 450 mW, r = 2 m (>100 dB)', params: { powerMw: 450, distanceM: 2, freqHz: 880 } },
      { label: 'Ngoài trời rất xa (40m)', description: 'Âm suy giảm mạnh theo 1/r²', params: { powerMw: 50, distanceM: 40, freqHz: 440 } }
    ]
  },
  lissajous_shm: {
    id: 'lissajous_shm',
    domainId: 'waves_osc',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Đường Cong Lissajous — Tổng Hợp Dao Động Vuông Góc',
    subtitle: 'Dao động tổng hợp theo hai trục Ox và Oy với tỉ số tần số ωₓ : ωᵧ và độ lệch pha Δφ',
    formula: 'x = Aₓcos(ωₓt + Δφ) · y = Aᵧcos(ωᵧt)',
    linkedLessonId: 'phys-11-shm',
    defaultParams: { fx: 3, fy: 2, phaseDeg: 90 },
    paramBounds: {
      fx: { min: 1, max: 6, step: 1, unit: 'Hz', label: 'Tần số trục X (fₓ)' },
      fy: { min: 1, max: 6, step: 1, unit: 'Hz', label: 'Tần số trục Y (fᵧ)' },
      phaseDeg: { min: 0, max: 180, step: 15, unit: '°', label: 'Độ lệch pha Δφ' }
    },
    presets: [
      { label: 'Hình số 8 (2:1)', description: 'fₓ = 2, fᵧ = 1, Δφ = 90°', params: { fx: 2, fy: 1, phaseDeg: 90 } },
      { label: 'Lissajous 3:2', description: 'Hoa văn đối xứng 3:2', params: { fx: 3, fy: 2, phaseDeg: 90 } },
      { label: 'Hình tròn pha 90° (1:1)', description: 'Chuyển động tròn đều', params: { fx: 2, fy: 2, phaseDeg: 90 } }
    ]
  },

  // --------------------------------------------------------------------------
  // DOMAIN 3: ELECTRICITY & MAGNETISM (+5)
  // --------------------------------------------------------------------------
  coulomb_pendulum: {
    id: 'coulomb_pendulum',
    domainId: 'electricity_mag',
    grades: ['Lớp 11'],
    title: 'Con Lắc Tĩnh Điện & Định Luật Coulomb',
    subtitle: 'Hai quả cầu nhỏ tích điện q₁, q₂ đẩy nhau hay hút nhau cân bằng dưới trọng lực P',
    formula: 'F = k|q₁q₂| / r² · tanα = F / (mg)',
    linkedLessonId: 'phys-9-elec',
    defaultParams: { q1uC: 4.0, q2uC: 4.0, massG: 15 },
    paramBounds: {
      q1uC: { min: -8, max: 8, step: 0.5, unit: 'μC', label: 'Điện tích q₁' },
      q2uC: { min: -8, max: 8, step: 0.5, unit: 'μC', label: 'Điện tích q₂' },
      massG: { min: 5, max: 50, step: 5, unit: 'g', label: 'Khối lượng mỗi quả cầu' }
    },
    presets: [
      { label: 'Đẩy nhau cùng dấu (+/+)', description: 'q₁ = +4 μC, q₂ = +4 μC', params: { q1uC: 4, q2uC: 4, massG: 15 } },
      { label: 'Hút nhau trái dấu (+/−)', description: 'q₁ = +4 μC, q₂ = −4 μC', params: { q1uC: 4, q2uC: -4, massG: 15 } },
      { label: 'Điện tích mạnh', description: 'Góc lệch dây mở rộng lớn', params: { q1uC: 7.5, q2uC: 7.5, massG: 10 } }
    ]
  },
  rc_capacitor: {
    id: 'rc_capacitor',
    domainId: 'electricity_mag',
    grades: ['Lớp 11'],
    title: 'Quá Trình Nạp & Xả Tụ Điện Trong Mạch RC',
    subtitle: 'Đồ thị hàm mũ điện áp u_C(t) và dòng điện i(t) theo hằng số thời gian τ = RC',
    formula: 'u_C(t) = E(1 - e^(-t/τ)) · τ = R·C',
    linkedLessonId: 'phys-9-elec',
    defaultParams: { emfV: 12, rKOhm: 20, capUF: 100, modeCharge: 1 },
    paramBounds: {
      emfV: { min: 3, max: 24, step: 1, unit: 'V', label: 'Suất điện động nguồn E' },
      rKOhm: { min: 5, max: 100, step: 5, unit: 'kΩ', label: 'Điện trở R' },
      capUF: { min: 20, max: 220, step: 10, unit: 'μF', label: 'Điện dung tụ C' },
      modeCharge: { min: 0, max: 1, step: 1, unit: '', label: 'Chế độ (1: Nạp tụ, 0: Xả tụ)' }
    },
    presets: [
      { label: 'Nạp tụ chuẩn (τ = 2s)', description: 'R = 20kΩ, C = 100μF', params: { emfV: 12, rKOhm: 20, capUF: 100, modeCharge: 1 } },
      { label: 'Xả tụ qua điện trở', description: 'u_C giảm dần theo e^(-t/τ)', params: { emfV: 12, rKOhm: 20, capUF: 100, modeCharge: 0 } },
      { label: 'Nạp nhanh (τ = 0.5s)', description: 'R nhỏ → tụ đầy nhanh', params: { emfV: 12, rKOhm: 10, capUF: 50, modeCharge: 1 } }
    ]
  },
  wheatstone_bridge: {
    id: 'wheatstone_bridge',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Mạch Cầu Điện Trở Wheatstone & Cân Bằng Cầu',
    subtitle: 'Điều chỉnh các nhánh điện trở để dòng qua điện kế G bằng 0 (R₁R₄ = R₂R₃)',
    formula: 'I_G = 0 ⇔ R₁ / R₂ = R₃ / R₄',
    linkedLessonId: 'phys-9-elec',
    defaultParams: { voltage: 12, r1: 10, r2: 20, r3: 15, r4: 30 },
    paramBounds: {
      voltage: { min: 4, max: 24, step: 2, unit: 'V', label: 'Hiệu điện thế nguồn U' },
      r1: { min: 5, max: 50, step: 5, unit: 'Ω', label: 'Điện trở R₁' },
      r2: { min: 5, max: 50, step: 5, unit: 'Ω', label: 'Điện trở R₂' },
      r3: { min: 5, max: 50, step: 5, unit: 'Ω', label: 'Điện trở R₃' },
      r4: { min: 5, max: 50, step: 5, unit: 'Ω', label: 'Điện trở R₄' }
    },
    presets: [
      { label: 'Cầu cân bằng (I_G = 0)', description: '10/20 = 15/30', params: { voltage: 12, r1: 10, r2: 20, r3: 15, r4: 30 } },
      { label: 'Lệch cầu sang phải', description: 'R₁ = 30 Ω làm U_C < U_D', params: { voltage: 12, r1: 30, r2: 20, r3: 15, r4: 30 } },
      { label: 'Lệch cầu sang trái', description: 'R₄ = 50 Ω làm dòng G đảo chiều', params: { voltage: 12, r1: 10, r2: 20, r3: 15, r4: 50 } }
    ]
  },
  transformer_2d: {
    id: 'transformer_2d',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Máy Biến Áp & Truyền Tải Điện Năng Đi Xa',
    subtitle: 'So sánh tăng áp / hạ áp U₂ = U₁(N₂/N₁) và công suất hao phí ΔP trên đường dây',
    formula: 'U₁ / U₂ = N₁ / N₂ · ΔP = P²R / U²',
    linkedLessonId: 'phys-9-induction-ac',
    defaultParams: { u1: 220, n1: 500, n2: 1000, rLine: 20 },
    paramBounds: {
      u1: { min: 50, max: 500, step: 10, unit: 'V', label: 'Điện áp sơ cấp U₁' },
      n1: { min: 100, max: 2000, step: 100, unit: 'vòng', label: 'Số vòng cuộn sơ cấp N₁' },
      n2: { min: 100, max: 3000, step: 100, unit: 'vòng', label: 'Số vòng cuộn thứ cấp N₂' },
      rLine: { min: 5, max: 60, step: 5, unit: 'Ω', label: 'Điện trở đường dây tải' }
    },
    presets: [
      { label: 'Tăng áp gấp 2 lần', description: 'N₂ = 2 N₁ → giảm hao phí 4 lần', params: { u1: 220, n1: 500, n2: 1000, rLine: 20 } },
      { label: 'Tăng áp 5 lần (Siêu tiết kiệm)', description: 'N₁ = 400, N₂ = 2000 → ΔP giảm 25 lần', params: { u1: 220, n1: 400, n2: 2000, rLine: 20 } },
      { label: 'Hạ áp dùng dân dụng', description: 'N₁ = 1000, N₂ = 200', params: { u1: 220, n1: 1000, n2: 200, rLine: 20 } }
    ]
  },
  lc_oscillation: {
    id: 'lc_oscillation',
    domainId: 'electricity_mag',
    grades: ['Lớp 12'],
    title: 'Mạch Dao Động Điện Từ Tự Do LC',
    subtitle: 'Quan sát sự chuyển hóa nhịp nhàng giữa năng lượng điện trường tụ C và từ trường cuộn L',
    formula: 'ω = 1/√(LC) · W = ½CU₀² = ½LI₀²',
    linkedLessonId: 'phys-12-ac-gen',
    defaultParams: { lMh: 40, cUf: 25, u0: 10 },
    paramBounds: {
      lMh: { min: 10, max: 120, step: 5, unit: 'mH', label: 'Độ tự cảm cuộn dây L' },
      cUf: { min: 5, max: 80, step: 5, unit: 'μF', label: 'Điện dung tụ điện C' },
      u0: { min: 4, max: 20, step: 1, unit: 'V', label: 'Hiệu điện thế cực đại U₀' }
    },
    presets: [
      { label: 'Dao động chuẩn', description: 'L = 40 mH, C = 25 μF', params: { lMh: 40, cUf: 25, u0: 10 } },
      { label: 'Tần số cao (L, C nhỏ)', description: 'Chu kì T ngắn, nạp xả nhanh', params: { lMh: 15, cUf: 10, u0: 12 } },
      { label: 'Năng lượng điện từ lớn', description: 'U₀ = 20 V, C = 60 μF', params: { lMh: 60, cUf: 60, u0: 20 } }
    ]
  },

  // --------------------------------------------------------------------------
  // DOMAIN 4: OPTICS & QUANTUM (+4)
  // --------------------------------------------------------------------------
  prism_dispersion: {
    id: 'prism_dispersion',
    domainId: 'optics_quantum',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Tán Sắc Ánh Sáng Trắng Qua Lăng Kính',
    subtitle: 'Tách chùm sáng trắng thành dải quang phổ liên tục Đỏ → Tím do chiết suất n(λ) khác nhau',
    formula: 'sin(i₁) = n·sin(r₁) · D = i₁ + i₂ - A',
    linkedLessonId: 'phys-9-energy-refract',
    defaultParams: { apexAngle: 60, incidenceDeg: 45, glassDisp: 1.0 },
    paramBounds: {
      apexAngle: { min: 30, max: 75, step: 5, unit: '°', label: 'Góc chiết quang lăng kính A' },
      incidenceDeg: { min: 25, max: 75, step: 1, unit: '°', label: 'Góc tới i₁' },
      glassDisp: { min: 0.4, max: 2.0, step: 0.2, unit: '×', label: 'Độ tán sắc thủy tinh' }
    },
    presets: [
      { label: 'Lăng kính chuẩn 60°', description: 'Dải cầu vồng rõ nét 7 màu', params: { apexAngle: 60, incidenceDeg: 48, glassDisp: 1.0 } },
      { label: 'Thủy tinh Flint (tán sắc mạnh)', description: 'Dải màu tách rộng gấp đôi', params: { apexAngle: 60, incidenceDeg: 50, glassDisp: 1.8 } },
      { label: 'Góc chiết quang nhỏ (35°)', description: 'Góc lệch D nhỏ', params: { apexAngle: 35, incidenceDeg: 35, glassDisp: 1.0 } }
    ]
  },
  spherical_mirror: {
    id: 'spherical_mirror',
    domainId: 'optics_quantum',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Gương Cầu Lõm & Gương Cầu Lồi Tạo Ảnh',
    subtitle: 'Vẽ đường đi tia phản xạ hội tụ qua tiêu điểm gương cầu và xác định ảnh thật/ảo',
    formula: '1/f = 1/d + 1/d\' · f = ±R/2',
    linkedLessonId: 'phys-9-optics',
    defaultParams: { dObj: 180, focal: 80, convexMode: 0 },
    paramBounds: {
      dObj: { min: 40, max: 300, step: 10, unit: 'cm', label: 'Khoảng cách vật d' },
      focal: { min: 40, max: 140, step: 10, unit: 'cm', label: 'Tiêu cự |f|' },
      convexMode: { min: 0, max: 1, step: 1, unit: '', label: 'Loại gương (0: Lõm, 1: Lồi)' }
    },
    presets: [
      { label: 'Gương lõm ảnh thật (d > f)', description: 'Ảnh thật ngược chiều trước gương', params: { dObj: 180, focal: 80, convexMode: 0 } },
      { label: 'Gương trang điểm (d < f)', description: 'Ảnh ảo cùng chiều phóng đại', params: { dObj: 50, focal: 90, convexMode: 0 } },
      { label: 'Gương chiếu hậu (Lồi)', description: 'Luôn cho ảnh ảo nhỏ hơn vật', params: { dObj: 150, focal: 80, convexMode: 1 } }
    ]
  },
  malus_polarization: {
    id: 'malus_polarization',
    domainId: 'optics_quantum',
    grades: ['Lớp 12'],
    title: 'Phân Cực Ánh Sáng & Định Luật Malus',
    subtitle: 'Cường độ sáng truyền qua 2 kính phân cực thay đổi theo cos²θ',
    formula: 'I = I₀ · cos²(θ)',
    linkedLessonId: 'phys-12-optics-q',
    defaultParams: { i0: 100, angleDeg: 45 },
    paramBounds: {
      i0: { min: 20, max: 200, step: 10, unit: 'W/m²', label: 'Cường độ sau kính 1 (I₀)' },
      angleDeg: { min: 0, max: 180, step: 5, unit: '°', label: 'Góc lệch trục phân cực θ' }
    },
    presets: [
      { label: 'Song song (θ = 0°)', description: 'Truyền qua 100% cường độ I₀', params: { i0: 100, angleDeg: 0 } },
      { label: 'Lệch 45° (I = I₀/2)', description: 'Cường độ còn một nửa', params: { i0: 100, angleDeg: 45 } },
      { label: 'Vuông góc (θ = 90°)', description: 'Triệt tiêu hoàn toàn ánh sáng', params: { i0: 100, angleDeg: 90 } }
    ]
  },
  hydrogen_spectrum: {
    id: 'hydrogen_spectrum',
    domainId: 'optics_quantum',
    grades: ['Lớp 12'],
    title: 'Quang Phổ Vạch Nguyên Tử Hiđrô (Lyman – Balmer)',
    subtitle: 'Electron chuyển từ mức năng lượng Eₘ xuống Eₙ phát ra vạch quang phổ bước sóng λ',
    formula: 'hf = hc/λ = Eₘ - Eₙ = 13.6(1/n² - 1/m²) eV',
    linkedLessonId: 'phys-12-optics-q',
    defaultParams: { mUpper: 3, nLower: 2 },
    paramBounds: {
      mUpper: { min: 2, max: 6, step: 1, unit: '', label: 'Mức xuất phát (m cao)' },
      nLower: { min: 1, max: 3, step: 1, unit: '', label: 'Mức đích (n thấp)' }
    },
    presets: [
      { label: 'Vạch Đỏ H_α (3 → 2)', description: 'λ = 656 nm (Dãy Balmer)', params: { mUpper: 3, nLower: 2 } },
      { label: 'Vạch Lam H_β (4 → 2)', description: 'λ = 486 nm (Dãy Balmer)', params: { mUpper: 4, nLower: 2 } },
      { label: 'Tử ngoại Lyman (3 → 1)', description: 'λ = 103 nm (Năng lượng cao)', params: { mUpper: 3, nLower: 1 } }
    ]
  },

  // --------------------------------------------------------------------------
  // DOMAIN 5: THERMAL & NUCLEAR (+4)
  // --------------------------------------------------------------------------
  pv_thermodynamics: {
    id: 'pv_thermodynamics',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Đồ Thị p–V & Các Đẳng Quá Trình Nhiệt Động',
    subtitle: 'So sánh đường đẳng nhiệt, đẳng áp, đẳng tích và công khối khí sinh ra A = ∫p·dV',
    formula: 'pV / T = const · ΔU = A + Q',
    linkedLessonId: 'phys-12-b12',
    defaultParams: { processType: 0, pStart: 2.0, vStart: 4.0, ratio: 2.0 },
    paramBounds: {
      processType: { min: 0, max: 2, step: 1, unit: '', label: 'Quá trình (0: Đẳng nhiệt, 1: Đẳng áp, 2: Đẳng tích)' },
      pStart: { min: 1.0, max: 4.0, step: 0.2, unit: 'atm', label: 'Áp suất ban đầu p₁' },
      vStart: { min: 2.0, max: 8.0, step: 0.5, unit: 'L', label: 'Thể tích ban đầu V₁' },
      ratio: { min: 1.2, max: 3.0, step: 0.2, unit: '×', label: 'Hệ số biến đổi' }
    },
    presets: [
      { label: 'Đẳng nhiệt (Boyle)', description: 'p·V = const (đường Hypebol)', params: { processType: 0, pStart: 3, vStart: 3, ratio: 2.4 } },
      { label: 'Giãn nở Đẳng áp', description: 'Công sinh ra A = p·ΔV lớn nhất', params: { processType: 1, pStart: 2.5, vStart: 3, ratio: 2.4 } },
      { label: 'Đun nóng Đẳng tích', description: 'Công A = 0, toàn bộ nhiệt tăng nội năng', params: { processType: 2, pStart: 1.5, vStart: 5, ratio: 2.2 } }
    ]
  },
  calorimetry_mixing: {
    id: 'calorimetry_mixing',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Cân Bằng Nhiệt & Nhiệt Lượng Kế Trao Đổi Nhiệt',
    subtitle: 'Trộn hai khối chất lỏng ở nhiệt độ khác nhau theo phương trình Q_tỏa = Q_thu',
    formula: 'm₁c₁(t₁ - t_cb) = m₂c₂(t_cb - t₂)',
    linkedLessonId: 'phys-9-mech-heat',
    defaultParams: { mHot: 2.0, tHot: 85, mCold: 3.0, tCold: 20 },
    paramBounds: {
      mHot: { min: 0.5, max: 5.0, step: 0.5, unit: 'kg', label: 'Khối lượng nước nóng m₁' },
      tHot: { min: 50, max: 100, step: 5, unit: '°C', label: 'Nhiệt độ nước nóng t₁' },
      mCold: { min: 0.5, max: 5.0, step: 0.5, unit: 'kg', label: 'Khối lượng nước lạnh m₂' },
      tCold: { min: 0, max: 35, step: 5, unit: '°C', label: 'Nhiệt độ nước lạnh t₂' }
    },
    presets: [
      { label: 'Pha nước ấm 2:3', description: '2kg (85°C) + 3kg (20°C) → 46°C', params: { mHot: 2, tHot: 85, mCold: 3, tCold: 20 } },
      { label: 'Khối lượng bằng nhau', description: 'Nhiệt độ cân bằng là trung bình cộng', params: { mHot: 2.5, tHot: 90, mCold: 2.5, tCold: 20 } },
      { label: 'Nước sôi gặp nước đá 0°C', description: 'Chênh lệch nhiệt độ lớn', params: { mHot: 1.5, tHot: 100, mCold: 3.5, tCold: 0 } }
    ]
  },
  bernoulli_flow: {
    id: 'bernoulli_flow',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 10', 'Lớp 12'],
    title: 'Ống Venturi & Định Luật Bernoulli Chất Lưu',
    subtitle: 'Chỗ ống thắt hẹp vận tốc dòng chảy tăng vọt khiến áp suất tĩnh giảm mạnh',
    formula: 'A₁v₁ = A₂v₂ · p₁ + ½ρv₁² = p₂ + ½ρv₂²',
    linkedLessonId: 'phys-10-accel',
    defaultParams: { v1: 2.0, d1Cm: 10, d2Cm: 5 },
    paramBounds: {
      v1: { min: 0.5, max: 5.0, step: 0.5, unit: 'm/s', label: 'Vận tốc vào ống rộng v₁' },
      d1Cm: { min: 6, max: 16, step: 1, unit: 'cm', label: 'Đường kính ống rộng D₁' },
      d2Cm: { min: 3, max: 10, step: 1, unit: 'cm', label: 'Đường kính chỗ thắt D₂' }
    },
    presets: [
      { label: 'Thắt hẹp gấp đôi (D₁=2D₂)', description: 'Vận tốc tăng 4 lần tại chỗ hẹp', params: { v1: 2.0, d1Cm: 10, d2Cm: 5 } },
      { label: 'Thắt hẹp mạnh (Venturi sâu)', description: 'Chênh lệch cột áp suất lớn', params: { v1: 2.5, d1Cm: 14, d2Cm: 4 } },
      { label: 'Ống gần đều', description: 'Chênh lệch áp suất nhẹ', params: { v1: 3.0, d1Cm: 10, d2Cm: 8 } }
    ]
  },
  nuclear_fission: {
    id: 'nuclear_fission',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Phản Ứng Phân Hạch Dây Chuyền U-235',
    subtitle: 'Nơtron chậm kích thích hạt nhân U-235 vỡ đôi giải phóng ~200 MeV và 2–3 nơtron mới',
    formula: '¹n + ²³⁵U → X + Y + k·¹n + 200 MeV',
    linkedLessonId: 'phys-12-b23',
    defaultParams: { enrichment: 65, controlRod: 45 },
    paramBounds: {
      enrichment: { min: 20, max: 100, step: 5, unit: '%', label: 'Mật độ nhiên liệu U-235' },
      controlRod: { min: 0, max: 90, step: 5, unit: '%', label: 'Độ cắm thanh điều khiển hấp thụ' }
    },
    presets: [
      { label: 'Lò phản ứng ổn định (k ≈ 1)', description: 'Phản ứng duy trì tự kiểm soát', params: { enrichment: 65, controlRod: 45 } },
      { label: 'Vượt ngưỡng tới hạn (k > 1)', description: 'Rút thanh điều khiển → dây chuyền bùng phát', params: { enrichment: 95, controlRod: 5 } },
      { label: 'Dập tắt lò (k < 1)', description: 'Cắm sâu thanh Bo/Cadimi', params: { enrichment: 50, controlRod: 85 } }
    ]
  }
};

export const EXTRA_PHYSICS_3D_SIMS: Record<ExtraPhysics3DModeId, Physics3DSimSpec> = {
  // Mechanics 3D (+4)
  inclined_plane_3d: {
    id: 'inclined_plane_3d',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Mặt Phẳng Nghiêng & Vectơ Trọng Lực 3D',
    subtitle: 'Khối trượt 3D trên máng nghiêng kèm vectơ Trọng lực P, Phản lực N và Ma sát',
    formula: 'a = g(sinα - μ·cosα)',
    linkedLessonId: 'phys-10-accel',
    presets: [
      { label: 'Góc nghiêng 30° chuẩn', description: 'Trượt đều tốc độ mượt', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Dốc đứng 45°', description: 'Gia tốc trượt lớn', settings: { speed: 1.4, amplitude: 1.4, frequency: 1 } }
    ]
  },
  collision_spheres_3d: {
    id: 'collision_spheres_3d',
    domainId: 'mechanics',
    grades: ['Lớp 10'],
    title: 'Va Chạm Hai Quả Cầu Đàn Hồi 3D',
    subtitle: 'Hai khối cầu kim loại va chạm đàn hồi trên ray tuyến tính theo tỉ số khối lượng',
    formula: 'm₁v₁ + m₂v₂ = const',
    linkedLessonId: 'phys-10-proj',
    presets: [
      { label: 'Khối lượng tương đương', description: 'Trao đổi gần trọn vẹn vận tốc', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Cầu lớn húc cầu nhỏ', description: 'Quả nhỏ bật văng tốc độ cao', settings: { speed: 1.3, amplitude: 1.6, frequency: 1 } }
    ]
  },
  gyroscope_precession_3d: {
    id: 'gyroscope_precession_3d',
    domainId: 'mechanics',
    grades: ['Lớp 10', 'Lớp 12'],
    title: 'Con Quay Hồi Chuyển & Tuế Sai 3D',
    subtitle: 'Bánh đà quay nhanh bảo toàn mômen động lượng L gây chuyển động tuế sai quanh trục đứng',
    formula: 'Ω_tuế_sai = mgl / (I·ω)',
    linkedLessonId: 'phys-10-circular',
    presets: [
      { label: 'Quay ổn định', description: 'Tuế sai chậm, bánh đà quay nhanh', settings: { speed: 1, amplitude: 1, frequency: 1.4 } },
      { label: 'Tuế sai mạnh', description: 'Nghiêng trục lớn hơn', settings: { speed: 1.3, amplitude: 1.5, frequency: 0.8 } }
    ]
  },
  kepler_orbit_3d: {
    id: 'kepler_orbit_3d',
    domainId: 'mechanics',
    grades: ['Lớp 10', 'Lớp 12'],
    title: 'Hệ Hành Tinh Quỹ Đạo Elip Kepler 3D',
    subtitle: 'Hành tinh quay quanh Mặt Trời trên quỹ đạo elip 3D kèm vệt sáng không gian',
    formula: 'T² / a³ = const · L = r × p = const',
    linkedLessonId: 'phys-10-circular',
    presets: [
      { label: 'Elip rõ rệt', description: 'Thấy rõ cận nhật nhanh & viễn nhật chậm', settings: { speed: 1, amplitude: 1.4, frequency: 1 } },
      { label: 'Quay tốc độ cao', description: 'Tăng tốc quỹ đạo 1.8x', settings: { speed: 1.8, amplitude: 1.2, frequency: 1 } }
    ]
  },

  // Waves 3D (+3)
  simple_pendulum_3d: {
    id: 'simple_pendulum_3d',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Con Lắc Đơn & Quỹ Đạo Cung Tròn 3D',
    subtitle: 'Con lắc dây mảnh dài L dao động với chu kì T = 2π√(L/g) không phụ thuộc khối lượng',
    formula: 'T = 2π√(L / g)',
    linkedLessonId: 'phys-11-shm',
    presets: [
      { label: 'Góc nhỏ điều hòa', description: 'Dao động chuẩn T = 2π√(L/g)', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Dây ngắn tần số cao', description: 'L ngắn → dao động nhanh', settings: { speed: 1.2, amplitude: 1.3, frequency: 1.6 } }
    ]
  },
  coupled_pendulums_3d: {
    id: 'coupled_pendulums_3d',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Hai Con Lắc Ghép Nối Truyền Năng Lượng 3D',
    subtitle: 'Con lắc 1 truyền toàn bộ năng lượng qua lò xo nối sang con lắc 2 và ngược lại',
    formula: 'ω₁,₂ = √(g/L) , √(g/L + 2k/m)',
    linkedLessonId: 'phys-11-shm',
    presets: [
      { label: 'Trao đổi phách nhịp nhàng', description: 'Năng lượng luân phiên 2 bên', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Liên kết lò xo cứng', description: 'Truyền năng lượng nhanh hơn', settings: { speed: 1.2, amplitude: 1.2, frequency: 1.6 } }
    ]
  },
  resonance_tubes_3d: {
    id: 'resonance_tubes_3d',
    domainId: 'waves_osc',
    grades: ['Lớp 11'],
    title: 'Sóng Âm Dừng Trong Ống Cộng Hưởng 3D',
    subtitle: 'Cột khí bên trong ống trụ trong suốt dao động tạo các nút và bụng áp suất âm',
    formula: 'l = (2k + 1)λ/4 (1 đầu kín) · l = kλ/2 (2 đầu hở)',
    linkedLessonId: 'phys-standing-wave',
    presets: [
      { label: 'Họa âm bậc 3', description: 'Hiển thị rõ 3 vùng bụng dao động', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Họa âm cao', description: 'Mật độ bó sóng dày hơn', settings: { speed: 1.3, amplitude: 1.2, frequency: 1.6 } }
    ]
  },

  // Electricity & Magnetism 3D (+4)
  solenoid_field_3d: {
    id: 'solenoid_field_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Ống Dây Solenoid & Từ Trường Đều Bên Trong 3D',
    subtitle: 'Cuộn dây đồng mang dòng điện I tạo các vòng đường sức từ khép kín Bắc–Nam',
    formula: 'B = 4π·10⁻⁷ · (N / L) · I',
    linkedLessonId: 'phys-12-mag',
    presets: [
      { label: 'Dòng điện chuẩn', description: 'Đường sức xuyên đều lòng ống', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Dòng điện mạnh', description: 'Tốc độ hạt dòng và từ thông tăng', settings: { speed: 1.8, amplitude: 1.5, frequency: 1.4 } }
    ]
  },
  electric_dipole_3d: {
    id: 'electric_dipole_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 11'],
    title: 'Lưỡng Cực Điện (+q / −q) & Đường Sức 3D',
    subtitle: 'Hệ hai điện tích trái dấu cùng độ lớn tạo chùm đường sức uốn cong từ +q sang −q',
    formula: 'E_tổng = E₊ + E₋ · p = q·d',
    linkedLessonId: 'phys-9-elec',
    presets: [
      { label: 'Lưỡng cực cân bằng', description: 'Đường sức đối xứng 3 chiều', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Khoảng cách xa', description: 'Kéo giãn mômen lưỡng cực p', settings: { speed: 1.2, amplitude: 1.5, frequency: 1 } }
    ]
  },
  dc_motor_3d: {
    id: 'dc_motor_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Động Cơ Điện 1 Chiều & Cổ Góp Đổi Chiều 3D',
    subtitle: 'Ngẫu lực từ F = BIl tác dụng lên khung dây và vành bán khuyên giữ khung quay 1 chiều',
    formula: 'M = B·I·S·sinα',
    linkedLessonId: 'phys-9-induction-ac',
    presets: [
      { label: 'Quay ổn định', description: 'Quan sát lực từ đổi chiều qua mặt phẳng trung hòa', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Tăng dòng điện phần ứng', description: 'Tốc độ quay rotor tăng nhanh', settings: { speed: 2.0, amplitude: 1.4, frequency: 1.5 } }
    ]
  },
  transformer_3d: {
    id: 'transformer_3d',
    domainId: 'electricity_mag',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Lõi Thép Biến Áp & Hai Cuộn Dây 3D',
    subtitle: 'Từ thông biến thiên chạy khép kín trong lõi sắt từ ghép nối cuộn sơ cấp N₁ và thứ cấp N₂',
    formula: 'U₁ / U₂ = N₁ / N₂',
    linkedLessonId: 'phys-9-induction-ac',
    presets: [
      { label: 'Biến áp tăng áp', description: 'Cuộn thứ cấp nhiều vòng hơn', settings: { speed: 1, amplitude: 1.4, frequency: 1 } },
      { label: 'Tần số cao', description: 'Từ thông biến thiên nhanh', settings: { speed: 1.6, amplitude: 1.2, frequency: 1.6 } }
    ]
  },

  // Optics & Quantum 3D (+4)
  prism_dispersion_3d: {
    id: 'prism_dispersion_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 11', 'Lớp 12'],
    title: 'Lăng Kính Thủy Tinh & Dải Tán Sắc 3D',
    subtitle: 'Chùm tia trắng chiếu qua khối lăng trụ tam giác 3D tách thành 7 tia màu trên màn hứng',
    formula: 'n_tím > n_lam > ... > n_đỏ ⇒ D_tím > D_đỏ',
    linkedLessonId: 'phys-9-energy-refract',
    presets: [
      { label: 'Góc chiết quang 60°', description: 'Hiện rõ quạt quang phổ 7 màu', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Tăng độ tán sắc', description: 'Dải màu trải rộng hơn', settings: { speed: 1, amplitude: 1.6, frequency: 1 } }
    ]
  },
  curved_mirror_3d: {
    id: 'curved_mirror_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 9', 'Lớp 11'],
    title: 'Gương Cầu Parabol Hội Tụ Tia Sáng 3D',
    subtitle: 'Chùm tia song song chiếu tới lòng gương cầu lõm phản xạ hội tụ chính xác tại tiêu điểm F',
    formula: 'f = R / 2',
    linkedLessonId: 'phys-9-optics',
    presets: [
      { label: 'Hội tụ tiêu chuẩn', description: 'Tất cả tia cắt nhau tại đúng điểm F', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Gương độ cong lớn', description: 'Tiêu cự rút ngắn lại', settings: { speed: 1, amplitude: 1.5, frequency: 1 } }
    ]
  },
  polarization_3d: {
    id: 'polarization_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 12'],
    title: 'Sóng Ngang Điện Từ & Kính Phân Cực 3D',
    subtitle: 'Vectơ điện trường E dao động vuông góc phương truyền bị lọc khi qua bản kính thứ hai',
    formula: 'E = E₀·cosθ · I = I₀·cos²θ',
    linkedLessonId: 'phys-12-optics-q',
    presets: [
      { label: 'Góc lọc 30°', description: 'Sóng ló còn 75% cường độ', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Lệch gần 90° (Tắt sáng)', description: 'Biên độ sóng sau kính giảm sát 0', settings: { speed: 1, amplitude: 0.25, frequency: 1 } }
    ]
  },
  blackbody_cavity_3d: {
    id: 'blackbody_cavity_3d',
    domainId: 'optics_quantum',
    grades: ['Lớp 12'],
    title: 'Bức Xạ Vật Đen & Lượng Tử Ánh Sáng 3D',
    subtitle: 'Nhiệt độ thành khoang T tăng làm dịch chuyển màu bức xạ (Định luật Wien) và mật độ photon',
    formula: 'λ_max · T = 2.898×10⁻³ m·K · ε = n·hf',
    linkedLessonId: 'phys-12-optics-q',
    presets: [
      { label: 'Nóng đỏ (~2500 K)', description: 'Khoang phát ánh sáng đỏ cam ấm', settings: { speed: 0.8, amplitude: 1, frequency: 0.8 } },
      { label: 'Trắng xanh (~6500 K)', description: 'Photon năng lượng cao dày đặc', settings: { speed: 1.5, amplitude: 1.3, frequency: 1.8 } }
    ]
  },

  // Thermal & Nuclear 3D (+3)
  carnot_piston_3d: {
    id: 'carnot_piston_3d',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Động Cơ Nhiệt Piston Chu Trình Carnot 3D',
    subtitle: 'Piston lên xuống trong xilanh trong suốt kết hợp chuyển động hạt khí theo chu kì nén – nổ',
    formula: 'H_max = 1 - T₂ / T₁',
    linkedLessonId: 'phys-12-b12',
    presets: [
      { label: 'Chu kì nhiệt chuẩn', description: 'Tần số nén xả cân bằng', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Công suất lớn', description: 'Tăng tốc độ chu trình và biên độ piston', settings: { speed: 1.8, amplitude: 1.3, frequency: 1.5 } }
    ]
  },
  nuclear_fission_3d: {
    id: 'nuclear_fission_3d',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Phản Ứng Phân Hạch Uranium 3D',
    subtitle: 'Nơtron bay vào hạt nhân U-235 làm hạt nhân vỡ thành 2 mảnh nhẹ hơn kèm sóng năng lượng',
    formula: 'ΔE = (m_trước - m_sau)c² ≈ 200 MeV',
    linkedLessonId: 'phys-12-b23',
    presets: [
      { label: 'Phân hạch dây chuyền', description: 'Nơtron kích hoạt liên hoàn 3D', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Slow motion quan sát vỡ hạt', description: 'Làm chậm để thấy khoảnh khắc tách hạt nhân', settings: { speed: 0.5, amplitude: 1.2, frequency: 1 } }
    ]
  },
  rutherford_scattering_3d: {
    id: 'rutherford_scattering_3d',
    domainId: 'thermal_nuclear',
    grades: ['Lớp 12'],
    title: 'Thí Nghiệm Tán Xạ Hạt Alpha Rutherford 3D',
    subtitle: 'Chùm hạt Alpha (+2e) xuyên qua lá vàng: đa số đi thẳng, số ít bật lệch góc lớn gần hạt nhân',
    formula: 'F_đẩy = k·(2e·Ze) / r²',
    linkedLessonId: 'phys-12-b23',
    presets: [
      { label: 'Chùm Alpha chuẩn', description: 'Thấy rõ hạt đi sát tâm lệch góc lớn', settings: { speed: 1, amplitude: 1, frequency: 1 } },
      { label: 'Năng lượng hạt Alpha cao', description: 'Chùm hạt tiến gần tâm hạt nhân hơn', settings: { speed: 1.6, amplitude: 1.4, frequency: 1.5 } }
    ]
  }
};

export const EXTRA_3D_SCENE_CONFIGS: Record<ExtraPhysics3DModeId, Extra3DSceneConfig> = {
  inclined_plane_3d: {
    mode: 'inclined_plane_3d',
    shortLabel: 'Mặt Phẳng Nghiêng 3D',
    hudTitle: 'Mặt Phẳng Nghiêng & Phân Tích Trọng Lực 3D',
    params: [
      { key: 'p1', label: 'Góc nghiêng α', unit: '°', min: 12, max: 55, step: 1, defaultVal: 30, accent: 'accent-sky-500' },
      { key: 'p2', label: 'Hệ số ma sát μ', unit: '', min: 0, max: 0.5, step: 0.05, defaultVal: 0.12, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => {
      const rad = (v.p1 * Math.PI) / 180;
      const a = Math.max(0, 9.8 * (Math.sin(rad) - v.p2 * Math.cos(rad)));
      return `a = g(sin${v.p1}° − μcos${v.p1}°) = ${a.toFixed(2)} m/s² · ${a === 0 ? 'Vật đứng yên do lực ma sát nghỉ!' : 'Vật trượt nhanh dần đều xuống dốc'}`;
    }
  },
  collision_spheres_3d: {
    mode: 'collision_spheres_3d',
    shortLabel: 'Va Chạm Cầu 3D',
    hudTitle: 'Va Chạm Hai Quả Cầu Đàn Hồi 3D',
    params: [
      { key: 'p1', label: 'Tỉ số khối lượng m₁/m₂', unit: '×', min: 0.4, max: 4.0, step: 0.2, defaultVal: 1.6, accent: 'accent-sky-500' },
      { key: 'p2', label: 'Độ đàn hồi e', unit: '', min: 0.1, max: 1.0, step: 0.1, defaultVal: 1.0, accent: 'accent-emerald-500' }
    ],
    computeReadout: (v) => `Bảo toàn động lượng m₁v₁ + m₂v₂ = const · Hệ số đàn hồi e = ${v.p2.toFixed(1)} · Tỉ lệ m₁/m₂ = ${v.p1.toFixed(1)}`
  },
  gyroscope_precession_3d: {
    mode: 'gyroscope_precession_3d',
    shortLabel: 'Con Quay Tuế Sai 3D',
    hudTitle: 'Con Quay Hồi Chuyển & Tuế Sai Mômen 3D',
    params: [
      { key: 'p1', label: 'Tốc độ quay tự thân ω', unit: 'rad/s', min: 4, max: 20, step: 1, defaultVal: 12, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Góc nghiêng trục θ', unit: '°', min: 10, max: 50, step: 2, defaultVal: 26, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => `Quay càng nhanh (ω = ${v.p1} rad/s), vận tốc tuế sai Ω ∝ 1/ω = ${(12 / Math.max(1, v.p1)).toFixed(2)} rad/s càng chậm và ổn định.`
  },
  kepler_orbit_3d: {
    mode: 'kepler_orbit_3d',
    shortLabel: 'Quỹ Đạo Kepler 3D',
    hudTitle: 'Hệ Hành Tinh Quỹ Đạo Elip Kepler 3D',
    params: [
      { key: 'p1', label: 'Độ lệch tâm e', unit: '', min: 0, max: 0.65, step: 0.05, defaultVal: 0.4, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Bán trục lớn a', unit: 'AU', min: 2.2, max: 4.5, step: 0.1, defaultVal: 3.4, accent: 'accent-sky-500' }
    ],
    computeReadout: (v) => `Định luật II Kepler: Tại cận nhật r_min = ${(v.p2 * (1 - v.p1)).toFixed(2)} AU, hành tinh tăng tốc cực đại để giữ tốc độ quét diện tích không đổi.`
  },
  simple_pendulum_3d: {
    mode: 'simple_pendulum_3d',
    shortLabel: 'Con Lắc Đơn 3D',
    hudTitle: 'Con Lắc Đơn & Cung Dao Động 3D',
    params: [
      { key: 'p1', label: 'Chiều dài dây L', unit: 'm', min: 1.5, max: 4.5, step: 0.2, defaultVal: 3.2, accent: 'accent-emerald-500' },
      { key: 'p2', label: 'Biên độ góc α₀', unit: '°', min: 8, max: 40, step: 2, defaultVal: 24, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => `Chu kì T = 2π√(L/g) = ${(2 * Math.PI * Math.sqrt(v.p1 / 9.8)).toFixed(2)} s · Tần số f = ${(1 / (2 * Math.PI * Math.sqrt(v.p1 / 9.8))).toFixed(2)} Hz`
  },
  coupled_pendulums_3d: {
    mode: 'coupled_pendulums_3d',
    shortLabel: 'Con Lắc Ghép 3D',
    hudTitle: 'Hai Con Lắc Ghép Nối Truyền Năng Lượng 3D',
    params: [
      { key: 'p1', label: 'Độ cứng lò xo ghép k', unit: 'N/m', min: 0.5, max: 3.0, step: 0.25, defaultVal: 1.5, accent: 'accent-emerald-500' },
      { key: 'p2', label: 'Biên độ kích thích', unit: '°', min: 10, max: 35, step: 2, defaultVal: 22, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => `Hai con lắc trao đổi hoàn toàn năng lượng dao động với chu kì phách tỉ lệ nghịch k (k = ${v.p1.toFixed(2)} N/m).`
  },
  resonance_tubes_3d: {
    mode: 'resonance_tubes_3d',
    shortLabel: 'Ống Cộng Hưởng 3D',
    hudTitle: 'Sóng Âm Dừng Trong Ống Cộng Hưởng 3D',
    params: [
      { key: 'p1', label: 'Bậc họa âm n', unit: '', min: 1, max: 5, step: 1, defaultVal: 3, accent: 'accent-emerald-500' },
      { key: 'p2', label: 'Biên độ áp suất', unit: '×', min: 0.4, max: 1.5, step: 0.1, defaultVal: 1.0, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => `Họa âm bậc ${Math.round(v.p1)}: xuất hiện ${Math.round(v.p1)} bụng sóng dao động cực đại và ${Math.round(v.p1) + 1} mặt nút đứng yên.`
  },
  solenoid_field_3d: {
    mode: 'solenoid_field_3d',
    shortLabel: 'Ống Dây Solenoid 3D',
    hudTitle: 'Ống Dây Solenoid & Từ Trường Đều 3D',
    params: [
      { key: 'p1', label: 'Cường độ dòng I', unit: 'A', min: 1, max: 10, step: 0.5, defaultVal: 5, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Mật độ vòng n', unit: 'vòng/cm', min: 5, max: 20, step: 1, defaultVal: 10, accent: 'accent-sky-500' }
    ],
    computeReadout: (v) => `Cảm ứng từ trong lòng ống B = 4π·10⁻⁷·n·I = ${(4 * Math.PI * 1e-4 * v.p2 * 100 * v.p1).toFixed(2)} mT`
  },
  electric_dipole_3d: {
    mode: 'electric_dipole_3d',
    shortLabel: 'Lưỡng Cực Điện 3D',
    hudTitle: 'Lưỡng Cực Điện (+q / −q) & Đường Sức 3D',
    params: [
      { key: 'p1', label: 'Khoảng cách d', unit: 'm', min: 2.0, max: 5.0, step: 0.2, defaultVal: 3.4, accent: 'accent-rose-500' },
      { key: 'p2', label: 'Độ lớn điện tích |q|', unit: 'μC', min: 1, max: 10, step: 1, defaultVal: 5, accent: 'accent-sky-500' }
    ],
    computeReadout: (v) => `Mômen lưỡng cực p = q·d = ${(v.p1 * v.p2).toFixed(1)} μC·m · Đường sức điện luôn đi ra từ +q (đỏ) và đi vào −q (xanh).`
  },
  dc_motor_3d: {
    mode: 'dc_motor_3d',
    shortLabel: 'Động Cơ 1 Chiều 3D',
    hudTitle: 'Động Cơ Điện 1 Chiều & Cổ Góp 3D',
    params: [
      { key: 'p1', label: 'Cường độ dòng I', unit: 'A', min: 1, max: 8, step: 0.5, defaultVal: 4, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Cảm ứng từ B', unit: 'T', min: 0.5, max: 2.5, step: 0.1, defaultVal: 1.2, accent: 'accent-blue-500' }
    ],
    computeReadout: (v) => `Ngẫu lực từ cực đại M_max = B·I·S = ${(v.p1 * v.p2 * 0.4).toFixed(2)} N·m giữ rôto quay liên tục cùng 1 chiều.`
  },
  transformer_3d: {
    mode: 'transformer_3d',
    shortLabel: 'Máy Biến Áp 3D',
    hudTitle: 'Lõi Thép Biến Áp & Hai Cuộn Dây 3D',
    params: [
      { key: 'p1', label: 'Tỉ số vòng N₂/N₁', unit: '×', min: 0.5, max: 3.0, step: 0.25, defaultVal: 2.0, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Điện áp vào U₁', unit: 'V', min: 110, max: 500, step: 10, defaultVal: 220, accent: 'accent-emerald-500' }
    ],
    computeReadout: (v) => `Điện áp thứ cấp U₂ = U₁·(N₂/N₁) = ${(v.p2 * v.p1).toFixed(0)} V (${v.p1 >= 1 ? 'Máy tăng áp' : 'Máy hạ áp'})`
  },
  prism_dispersion_3d: {
    mode: 'prism_dispersion_3d',
    shortLabel: 'Lăng Kính 3D',
    hudTitle: 'Lăng Kính Thủy Tinh & Dải Tán Sắc 3D',
    params: [
      { key: 'p1', label: 'Góc quay lăng kính', unit: '°', min: 15, max: 65, step: 2, defaultVal: 36, accent: 'accent-violet-500' },
      { key: 'p2', label: 'Độ tán sắc thủy tinh', unit: '×', min: 0.5, max: 2.0, step: 0.1, defaultVal: 1.2, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => `Tia Tím chiết suất lớn nhất bị lệch mạnh nhất, tia Đỏ lệch ít nhất → tách dải quang phổ liên tục.`
  },
  curved_mirror_3d: {
    mode: 'curved_mirror_3d',
    shortLabel: 'Gương Cầu 3D',
    hudTitle: 'Gương Cầu Parabol Hội Tụ Tia Sáng 3D',
    params: [
      { key: 'p1', label: 'Độ cong gương', unit: '×', min: 0.6, max: 1.6, step: 0.1, defaultVal: 1.0, accent: 'accent-cyan-500' },
      { key: 'p2', label: 'Số tia sáng tới', unit: 'tia', min: 4, max: 10, step: 2, defaultVal: 6, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => `Tiêu cự gương f = ${(2.4 / v.p1).toFixed(2)} m · Mọi tia sáng song song trục chính đều phản xạ qua đúng tiêu điểm F.`
  },
  polarization_3d: {
    mode: 'polarization_3d',
    shortLabel: 'Phân Cực Sóng 3D',
    hudTitle: 'Sóng Ngang Điện Từ & Kính Phân Cực 3D',
    params: [
      { key: 'p1', label: 'Góc xoay kính lọc θ', unit: '°', min: 0, max: 90, step: 5, defaultVal: 35, accent: 'accent-violet-500' },
      { key: 'p2', label: 'Tần số sóng', unit: 'Hz', min: 1.0, max: 4.0, step: 0.2, defaultVal: 2.2, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => `Định luật Malus: Tỉ lệ truyền qua I/I₀ = cos²(${v.p1}°) = ${(Math.pow(Math.cos((v.p1 * Math.PI) / 180), 2) * 100).toFixed(1)}%`
  },
  blackbody_cavity_3d: {
    mode: 'blackbody_cavity_3d',
    shortLabel: 'Bức Xạ Vật Đen 3D',
    hudTitle: 'Khoang Bức Xạ Vật Đen & Lượng Tử Planck 3D',
    params: [
      { key: 'p1', label: 'Nhiệt độ thành khoang T', unit: 'K', min: 2000, max: 8000, step: 250, defaultVal: 4500, accent: 'accent-rose-500' },
      { key: 'p2', label: 'Mật độ photon', unit: '×', min: 0.5, max: 2.0, step: 0.25, defaultVal: 1.0, accent: 'accent-amber-500' }
    ],
    computeReadout: (v) => `Định luật Wien: Bước sóng đỉnh bức xạ λ_max = ${(2898000 / v.p1).toFixed(0)} nm · Công suất phát xạ ∝ T⁴.`
  },
  carnot_piston_3d: {
    mode: 'carnot_piston_3d',
    shortLabel: 'Động Cơ Carnot 3D',
    hudTitle: 'Động Cơ Nhiệt Piston Chu Trình Carnot 3D',
    params: [
      { key: 'p1', label: 'Nhiệt độ nguồn nóng T₁', unit: 'K', min: 400, max: 1200, step: 50, defaultVal: 800, accent: 'accent-rose-500' },
      { key: 'p2', label: 'Nhiệt độ nguồn lạnh T₂', unit: 'K', min: 200, max: 450, step: 25, defaultVal: 300, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => {
      const eff = Math.max(0, 1 - v.p2 / Math.max(v.p2 + 50, v.p1)) * 100;
      return `Hiệu suất Carnot lí tưởng H = 1 − T₂/T₁ = ${eff.toFixed(1)}% (T₁ = ${v.p1} K, T₂ = ${v.p2} K)`;
    }
  },
  nuclear_fission_3d: {
    mode: 'nuclear_fission_3d',
    shortLabel: 'Phân Hạch U-235 3D',
    hudTitle: 'Phản Ứng Phân Hạch Hạt Nhân Uranium 3D',
    params: [
      { key: 'p1', label: 'Năng lượng nơtron tới', unit: 'eV', min: 0.5, max: 4.0, step: 0.25, defaultVal: 1.5, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Tốc độ phân tách mảnh', unit: '×', min: 0.5, max: 2.0, step: 0.25, defaultVal: 1.0, accent: 'accent-rose-500' }
    ],
    computeReadout: () => `1 phản ứng phân hạch ²³⁵U giải phóng ≈ 200 MeV = 3.2×10⁻¹¹ J và 2–3 nơtron thứ cấp duy trì dây chuyền.`
  },
  rutherford_scattering_3d: {
    mode: 'rutherford_scattering_3d',
    shortLabel: 'Tán Xạ Alpha 3D',
    hudTitle: 'Thí Nghiệm Tán Xạ Hạt Alpha Rutherford 3D',
    params: [
      { key: 'p1', label: 'Điện tích hạt nhân Z', unit: 'e', min: 30, max: 92, step: 2, defaultVal: 79, accent: 'accent-amber-500' },
      { key: 'p2', label: 'Động năng hạt Alpha K', unit: 'MeV', min: 2, max: 10, step: 0.5, defaultVal: 5.5, accent: 'accent-cyan-500' }
    ],
    computeReadout: (v) => `Hạt nhân Vàng (Z = ${v.p1}) tập trung toàn bộ điện tích dương tại tâm kích thước ~10⁻¹⁴ m làm hạt bay sát bị bật ngược.`
  }
};
