import { Physics3DMode, PhysicsLesson, PhysicsSimType } from '../types';
import { PHYSICS_2D_SIMS } from './physicsDomainsData';

export type SimBinding = Pick<
  PhysicsLesson,
  'simulationType' | 'sim3dType' | 'defaultParams' | 'paramBounds'
>;

function makePreset(
  simulationType: PhysicsSimType,
  sim3dType: Physics3DMode,
  paramOverrides?: Record<string, number>
): SimBinding {
  const spec = PHYSICS_2D_SIMS[simulationType];
  return {
    simulationType,
    sim3dType,
    defaultParams: { ...spec.defaultParams, ...(paramOverrides || {}) },
    paramBounds: spec.paramBounds,
  };
}

export const SIM_PRESETS: Record<string, SimBinding> = {
  kinematics: makePreset('kinematics_graphs', 'kinematics_3d'),
  vectors: makePreset('kinematics_graphs', 'kinematics_3d', { vizMode: 0, v0: 5, accel: 0, angleDeg: 60, f1: 35, f2: 25 }),
  free_fall: makePreset('free_fall_energy', 'mechanical_energy_3d'),
  work_power: makePreset('work_power_joule', 'mechanical_energy_3d'),
  projectile: makePreset('projectile_motion', 'projectile_3d'),
  circular: makePreset('circular_motion', 'circular_motion_3d'),
  centrifuge: makePreset('centrifuge_banked_curve', 'circular_motion_3d'),
  atwood: makePreset('atwood_pulley', 'atwood_pulley_3d'),
  inclined: makePreset('inclined_plane', 'inclined_plane_3d'),
  momentum: makePreset('momentum_collision', 'collision_spheres_3d'),
  newton_cradle: makePreset('momentum_collision', 'newtons_cradle_3d'),
  torque: makePreset('torque_lever', 'gyroscope_precession_3d'),
  archimedes: makePreset('archimedes_buoyancy', 'archimedes_buoyancy_3d'),
  kepler: makePreset('kepler_orbit', 'kepler_orbit_3d'),
  spring: makePreset('spring_pendulum', 'pendulum_spring'),
  lissajous: makePreset('lissajous_shm', 'lissajous_3d'),
  pendulum: makePreset('simple_pendulum', 'simple_pendulum_3d'),
  damped_resonance: makePreset('damped_resonance', 'coupled_pendulums_3d'),
  wave_interference: makePreset('wave_interference', 'wave_ripple'),
  wave_longitudinal: makePreset('wave_interference', 'transverse_longitudinal_3d'),
  sound_intensity: makePreset('sound_intensity', 'resonance_tubes_3d'),
  young_light: makePreset('young_interference', 'young_interference_3d'),
  em_wave: makePreset('lc_oscillation', 'polarization_3d'),
  standing_wave: makePreset('standing_wave', 'standing_wave_3d'),
  standing_sound: makePreset('standing_wave', 'resonance_tubes_3d'),
  doppler: makePreset('doppler_effect', 'doppler_effect_3d'),
  coulomb: makePreset('coulomb_pendulum', 'electroscope_3d'),
  electric_field: makePreset('electric_field', 'electric_dipole_3d'),
  capacitor: makePreset('rc_capacitor', 'electric_dipole_3d'),
  ohm_dc: makePreset('ohm_circuit', 'ohm_circuit_3d'),
  joule_lenz: makePreset('joule_lenz_heat', 'ohm_circuit_3d'),
  wheatstone: makePreset('wheatstone_bridge', 'ohm_circuit_3d'),
  diode: makePreset('diode_rectifier', 'cathode_ray_tube_3d'),
  thermal_gas: makePreset('thermal_gas', 'thermal_gas_3d'),
  calorimetry: makePreset('calorimetry_mixing', 'calorimetry_beaker_3d'),
  phase_change: makePreset('calorimetry_mixing', 'calorimetry_beaker_3d'),
  pv_thermo: makePreset('pv_thermodynamics', 'carnot_piston_3d'),
  mag_induction: makePreset('magnetic_induction', 'solenoid_field_3d'),
  mag_faraday: makePreset('magnetic_induction', 'helmholtz_coils_3d'),
  hall_lorentz: makePreset('hall_effect', 'lorentz_helix'),
  transformer: makePreset('transformer_2d', 'transformer_3d'),
  ac_rlc: makePreset('ac_rlc_circuit', 'ac_generator_3d'),
  nuclear: makePreset('nuclear_decay', 'nuclear_fission_3d'),
  nuclear_fission: makePreset('nuclear_fission', 'nuclear_fission_3d'),
  binding_energy: makePreset('binding_energy_curve', 'tokamak_fusion_3d'),
  rutherford: makePreset('nuclear_decay', 'rutherford_scattering_3d'),
  photoelectric: makePreset('photoelectric_effect', 'photoelectric_3d'),
  compton: makePreset('compton_scattering', 'compton_3d'),
  refraction: makePreset('light_refraction', 'refraction_tank_3d'),
  fiber_optic: makePreset('fiber_optic_tir', 'fiber_optic_3d'),
  lens_single: makePreset('lens_optics', 'optics_3d'),
  prism: makePreset('prism_dispersion', 'prism_dispersion_3d'),
  telescope: makePreset('telescope_microscope', 'double_lens_microscope_3d'),
};
