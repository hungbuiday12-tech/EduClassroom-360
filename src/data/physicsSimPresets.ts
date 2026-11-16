import { Physics3DMode, PhysicsLesson, PhysicsSimType } from '../types';

export type SimBinding = Pick<
  PhysicsLesson,
  'simulationType' | 'sim3dType' | 'defaultParams' | 'paramBounds'
>;

export const SIM_PRESETS: Record<string, SimBinding> = {
  kinematics: {
    simulationType: 'kinematics_graphs',
    sim3dType: 'kinematics_3d',
    defaultParams: { vizMode: 1, v0: 4, accel: 2, angleDeg: 35, f1: 30, f2: 20 },
    paramBounds: {
      vizMode: { min: 0, max: 2, step: 1, unit: '', label: 'Chế độ đồ thị (0:Vectơ / 1:d-t / 2:v-t)' },
      v0: { min: 0, max: 15, step: 0.5, unit: 'm/s', label: 'Vận tốc đầu v₀' },
      accel: { min: -5, max: 6, step: 0.5, unit: 'm/s²', label: 'Gia tốc a' },
      angleDeg: { min: 10, max: 150, step: 5, unit: '°', label: 'Góc hợp vectơ α' }
    }
  },
  vectors: {
    simulationType: 'kinematics_graphs',
    sim3dType: 'kinematics_3d',
    defaultParams: { vizMode: 0, v0: 5, accel: 0, angleDeg: 60, f1: 35, f2: 25 },
    paramBounds: {
      vizMode: { min: 0, max: 2, step: 1, unit: '', label: 'Chế độ (0:Vectơ / 1:d-t / 2:v-t)' },
      angleDeg: { min: 10, max: 160, step: 5, unit: '°', label: 'Góc hợp 2 lực α' },
      f1: { min: 10, max: 60, step: 5, unit: 'N', label: 'Lực F₁' },
      f2: { min: 10, max: 60, step: 5, unit: 'N', label: 'Lực F₂' }
    }
  },
  free_fall: {
    simulationType: 'free_fall_energy',
    sim3dType: 'kinematics_3d',
    defaultParams: { mass: 2, height: 25, gravity: 9.8 },
    paramBounds: {
      mass: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng m' },
      height: { min: 5, max: 50, step: 1, unit: 'm', label: 'Độ cao thả h' },
      gravity: { min: 1.6, max: 20, step: 0.2, unit: 'm/s²', label: 'Gia tốc g' }
    }
  },
  projectile: {
    simulationType: 'projectile_motion',
    sim3dType: 'projectile_3d',
    defaultParams: { v0: 24, angle: 45, g: 9.8 },
    paramBounds: {
      v0: { min: 10, max: 40, step: 1, unit: 'm/s', label: 'Vận tốc bắn v₀' },
      angle: { min: 15, max: 80, step: 1, unit: '°', label: 'Góc nâng α' },
      g: { min: 2, max: 20, step: 0.2, unit: 'm/s²', label: 'Trọng trường g' }
    }
  },
  circular: {
    simulationType: 'circular_motion',
    sim3dType: 'circular_motion_3d',
    defaultParams: { radius: 2.5, omega: 2.5, mass: 2 },
    paramBounds: {
      radius: { min: 1, max: 5, step: 0.2, unit: 'm', label: 'Bán kính R' },
      omega: { min: 0.5, max: 6, step: 0.1, unit: 'rad/s', label: 'Tốc độ góc ω' },
      mass: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng m' }
    }
  },
  spring: {
    simulationType: 'spring_pendulum',
    sim3dType: 'pendulum_spring',
    defaultParams: { amplitude: 10, stiffness: 40, mass: 1 },
    paramBounds: {
      amplitude: { min: 3, max: 18, step: 1, unit: 'cm', label: 'Biên độ A' },
      stiffness: { min: 10, max: 100, step: 5, unit: 'N/m', label: 'Độ cứng k' },
      mass: { min: 0.2, max: 4, step: 0.1, unit: 'kg', label: 'Khối lượng m' }
    }
  },
  pendulum: {
    simulationType: 'simple_pendulum',
    sim3dType: 'pendulum_spring',
    defaultParams: { length: 1.5, angle0: 14, gravity: 9.8 },
    paramBounds: {
      length: { min: 0.4, max: 3.5, step: 0.1, unit: 'm', label: 'Chiều dài dây l' },
      angle0: { min: 4, max: 30, step: 1, unit: '°', label: 'Góc lệch α₀' },
      gravity: { min: 1.6, max: 20, step: 0.2, unit: 'm/s²', label: 'Trọng trường g' }
    }
  },
  wave_interference: {
    simulationType: 'wave_interference',
    sim3dType: 'wave_ripple',
    defaultParams: { freq: 2.5, speed: 60, sep: 120 },
    paramBounds: {
      freq: { min: 0.8, max: 5, step: 0.2, unit: 'Hz', label: 'Tần số f' },
      speed: { min: 25, max: 120, step: 5, unit: 'cm/s', label: 'Tốc độ truyền sóng v' },
      sep: { min: 60, max: 180, step: 10, unit: 'mm', label: 'Khoảng cách S₁S₂' }
    }
  },
  young_light: {
    simulationType: 'young_interference',
    sim3dType: 'young_interference_3d',
    defaultParams: { lambda: 0.55, slitA: 1.0, screenD: 2.0 },
    paramBounds: {
      lambda: { min: 0.38, max: 0.76, step: 0.02, unit: 'μm', label: 'Bước sóng λ' },
      slitA: { min: 0.4, max: 2.5, step: 0.1, unit: 'mm', label: 'Khoảng cách 2 khe a' },
      screenD: { min: 0.8, max: 3.5, step: 0.1, unit: 'm', label: 'Khoảng cách màn D' }
    }
  },
  standing_wave: {
    simulationType: 'standing_wave',
    sim3dType: 'standing_wave_3d',
    defaultParams: { length: 2.4, waveSpeed: 24, amplitude: 5, harmonicN: 3, openEnd: 0 },
    paramBounds: {
      harmonicN: { min: 1, max: 7, step: 1, unit: 'bó', label: 'Số bó sóng k' },
      amplitude: { min: 2, max: 9, step: 0.5, unit: 'cm', label: 'Biên độ bụng' },
      waveSpeed: { min: 8, max: 48, step: 2, unit: 'm/s', label: 'Tốc độ truyền v' },
      length: { min: 1.0, max: 4.0, step: 0.2, unit: 'm', label: 'Chiều dài dây l' }
    }
  },
  doppler: {
    simulationType: 'doppler_effect',
    sim3dType: 'doppler_effect_3d',
    defaultParams: { sourceSpeed: 150, waveSpeed: 340, sourceFreq: 440 },
    paramBounds: {
      sourceSpeed: { min: 0, max: 480, step: 10, unit: 'm/s', label: 'Tốc độ nguồn v_s' },
      waveSpeed: { min: 200, max: 400, step: 10, unit: 'm/s', label: 'Tốc độ âm v' },
      sourceFreq: { min: 150, max: 800, step: 20, unit: 'Hz', label: 'Tần số phát f₀' }
    }
  },
  electric_field: {
    simulationType: 'electric_field',
    sim3dType: 'lorentz_helix',
    defaultParams: { q1: 4, q2: -4, dist: 180 },
    paramBounds: {
      q1: { min: -8, max: 8, step: 1, unit: 'μC', label: 'Điện tích q₁' },
      q2: { min: -8, max: 8, step: 1, unit: 'μC', label: 'Điện tích q₂' },
      dist: { min: 80, max: 280, step: 10, unit: 'mm', label: 'Khoảng cách r' }
    }
  },
  ohm_dc: {
    simulationType: 'ohm_circuit',
    sim3dType: 'lorentz_helix',
    defaultParams: { voltage: 12, r1: 4, r2: 8, circuitType: 0 },
    paramBounds: {
      circuitType: { min: 0, max: 1, step: 1, unit: '', label: 'Kiểu ghép (0:NT / 1:SS)' },
      voltage: { min: 1, max: 24, step: 1, unit: 'V', label: 'Hiệu điện thế U' },
      r1: { min: 1, max: 20, step: 1, unit: 'Ω', label: 'Điện trở R₁' },
      r2: { min: 1, max: 20, step: 1, unit: 'Ω', label: 'Điện trở R₂' }
    }
  },
  thermal_gas: {
    simulationType: 'thermal_gas',
    sim3dType: 'thermal_gas_3d',
    defaultParams: { tempK: 320, volume: 10, moles: 1.0 },
    paramBounds: {
      tempK: { min: 150, max: 600, step: 15, unit: 'K', label: 'Nhiệt độ T' },
      volume: { min: 4, max: 20, step: 1, unit: 'L', label: 'Thể tích V' },
      moles: { min: 0.4, max: 3.0, step: 0.2, unit: 'mol', label: 'Số mol n' }
    }
  },
  mag_induction: {
    simulationType: 'magnetic_induction',
    sim3dType: 'ac_generator_3d',
    defaultParams: { magnetSpeed: 4, turns: 12, bField: 1.5 },
    paramBounds: {
      magnetSpeed: { min: 1, max: 10, step: 0.5, unit: 'm/s', label: 'Tốc độ nam châm' },
      turns: { min: 4, max: 24, step: 2, unit: 'vòng', label: 'Số vòng dây N' },
      bField: { min: 0.5, max: 3, step: 0.1, unit: 'T', label: 'Cảm ứng từ B' }
    }
  },
  ac_rlc: {
    simulationType: 'ac_rlc_circuit',
    sim3dType: 'ac_generator_3d',
    defaultParams: { uEff: 120, resR: 40, indL: 0.3, capC: 40, freq: 50 },
    paramBounds: {
      uEff: { min: 40, max: 220, step: 10, unit: 'V', label: 'Điện áp hiệu dụng U' },
      resR: { min: 10, max: 120, step: 5, unit: 'Ω', label: 'Điện trở R' },
      indL: { min: 0.05, max: 0.6, step: 0.05, unit: 'H', label: 'Độ tự cảm L' },
      capC: { min: 10, max: 120, step: 5, unit: 'μF', label: 'Điện dung C' },
      freq: { min: 20, max: 100, step: 2, unit: 'Hz', label: 'Tần số f' }
    }
  },
  nuclear: {
    simulationType: 'nuclear_decay',
    sim3dType: 'bohr_atom',
    defaultParams: { n0: 160, halfLife: 4.0 },
    paramBounds: {
      n0: { min: 50, max: 320, step: 10, unit: 'hạt', label: 'Số hạt ban đầu N₀' },
      halfLife: { min: 1, max: 10, step: 0.5, unit: 's', label: 'Chu kì bán rã T' }
    }
  },
  photoelectric: {
    simulationType: 'photoelectric_effect',
    sim3dType: 'photoelectric_3d',
    defaultParams: { wavelengthNm: 280, workFunctionEv: 2.14, voltageUak: 1.5 },
    paramBounds: {
      wavelengthNm: { min: 180, max: 750, step: 10, unit: 'nm', label: 'Bước sóng λ' },
      workFunctionEv: { min: 1.8, max: 5.0, step: 0.1, unit: 'eV', label: 'Công thoát A' },
      voltageUak: { min: -4, max: 4, step: 0.2, unit: 'V', label: 'Điện áp U_AK' }
    }
  }
};
