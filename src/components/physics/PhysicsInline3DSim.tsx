import React, { useMemo } from 'react';
import { Box, Maximize2, Play, Sparkles } from 'lucide-react';
import { Physics3DMode, PhysicsLesson } from '../../types';
import {
  get3DSimsByDomain,
  getDomainFor3DSim,
  PHYSICS_3D_SIMS,
  PHYSICS_DOMAINS
} from '../../data/physicsDomainsData';
import { AnyStepSimId, resolveStepSimulation } from './physicsStepSimResolver';
import { Physics3DView } from './Physics3DView';
import { FormattedText, MathFormula } from '../common/MathRenderer';

interface PhysicsInline3DSimProps {
  lesson: PhysicsLesson;
  stepIndex: number;
  totalSteps: number;
  stepTitle?: string;
  stepConcept?: string;
  isWebGLActive?: boolean;
  onActivateWebGL?: () => void;
  onOpenSim3D?: () => void;
}

const STEP_2D_TO_3D_MAP: Partial<Record<AnyStepSimId, Physics3DMode>> = {
  kinematics_graphs: 'kinematics_3d',
  average_velocity_stages: 'kinematics_3d',
  vector_addition_2d: 'kinematics_3d',
  distance_displacement_rel: 'kinematics_3d',
  work_power_joule: 'mechanical_energy_3d',
  free_fall_energy: 'mechanical_energy_3d',
  projectile_motion: 'projectile_3d',
  circular_motion: 'circular_motion_3d',
  centrifuge_banked_curve: 'circular_motion_3d',
  inclined_plane: 'inclined_plane_3d',
  atwood_pulley: 'atwood_pulley_3d',
  momentum_collision: 'collision_spheres_3d',
  torque_lever: 'gyroscope_precession_3d',
  kepler_orbit: 'kepler_orbit_3d',
  planetary_escape_velocity: 'kepler_orbit_3d',
  archimedes_buoyancy: 'archimedes_buoyancy_3d',
  bernoulli_flow: 'diffusion_gases_3d',
  spring_pendulum: 'pendulum_spring',
  spring_oscillation_horizontal: 'pendulum_spring',
  hooke_spring_stat: 'pendulum_spring',
  damped_resonance: 'coupled_pendulums_3d',
  simple_pendulum: 'simple_pendulum_3d',
  coupled_oscillators_2d: 'coupled_pendulums_3d',
  lissajous_shm: 'lissajous_3d',
  wave_interference: 'wave_ripple',
  beat_waves: 'wave_ripple',
  single_slit_diffraction: 'young_interference_3d',
  standing_wave: 'standing_wave_3d',
  sound_intensity: 'acoustic_interference_3d',
  doppler_effect: 'doppler_effect_3d',
  mach_shockwave: 'doppler_effect_3d',
  electric_field: 'electric_dipole_3d',
  coulomb_pendulum: 'electroscope_3d',
  ohm_circuit: 'ohm_circuit_3d',
  joule_lenz_heat: 'ohm_circuit_3d',
  electric_power_meter: 'electric_power_meter_3d',
  dc_motor_2d: 'dc_motor_3d',
  electrolysis_faraday: 'electrolysis_3d',
  eye_optics_2d: 'eye_optics_3d',
  power_plant_generator: 'power_plant_3d',
  fresnel_phasor_2d: 'lissajous_3d',
  magnetic_induction: 'solenoid_field_3d',
  electromagnet_crane: 'solenoid_field_3d',
  hall_effect: 'lorentz_helix',
  rc_capacitor: 'electric_dipole_3d',
  wheatstone_bridge: 'ohm_circuit_3d',
  diode_rectifier: 'cathode_ray_tube_3d',
  cyclotron_accelerator: 'cyclotron_3d',
  ac_rlc_circuit: 'ac_generator_3d',
  lc_oscillation: 'ac_generator_3d',
  transformer_2d: 'transformer_3d',
  em_wave_3axis: 'em_wave_3d',
  lens_optics: 'optics_3d',
  light_refraction: 'refraction_tank_3d',
  fiber_optic_tir: 'fiber_optic_3d',
  telescope_microscope: 'double_lens_microscope_3d',
  spherical_mirror: 'curved_mirror_3d',
  prism_dispersion: 'prism_dispersion_3d',
  malus_polarization: 'polarization_3d',
  young_interference: 'young_interference_3d',
  thin_film_interference: 'young_interference_3d',
  photoelectric_effect: 'photoelectric_3d',
  compton_scattering: 'compton_3d',
  hydrogen_spectrum: 'bohr_atom',
  bohr_energy_levels: 'bohr_atom',
  thermal_gas: 'thermal_gas_3d',
  pv_thermodynamics: 'carnot_piston_3d',
  carnot_cycle_pv: 'carnot_piston_3d',
  phase_change_heating: 'calorimetry_beaker_3d',
  calorimetry_mixing: 'calorimetry_beaker_3d',
  thermal_conduction_bar: 'calorimetry_beaker_3d',
  nuclear_decay: 'nuclear_fission_3d',
  nuclear_fission: 'nuclear_fission_3d',
  binding_energy_curve: 'tokamak_fusion_3d'
};

export function resolveStep3DMode(
  lesson: PhysicsLesson,
  stepIndex: number,
  stepTitle?: string,
  stepConcept?: string
): Physics3DMode {
  const resolved2D = resolveStepSimulation(lesson, stepIndex, stepTitle, stepConcept);
  if (
    resolved2D.simId === lesson.simulationType ||
    resolved2D.simId === 'measurement_error_lab'
  ) {
    return lesson.sim3dType;
  }
  return STEP_2D_TO_3D_MAP[resolved2D.simId] ?? lesson.sim3dType;
}

export const PhysicsInline3DSim: React.FC<PhysicsInline3DSimProps> = ({
  lesson,
  stepIndex,
  totalSteps,
  stepTitle,
  stepConcept,
  isWebGLActive = true,
  onActivateWebGL,
  onOpenSim3D
}) => {
  const step3DMode = useMemo(
    () => resolveStep3DMode(lesson, stepIndex, stepTitle, stepConcept),
    [lesson, stepIndex, stepTitle, stepConcept]
  );

  const spec = PHYSICS_3D_SIMS[step3DMode] || PHYSICS_3D_SIMS[lesson.sim3dType];
  const domainId = getDomainFor3DSim(step3DMode);
  const domainMeta = PHYSICS_DOMAINS.find((d) => d.id === domainId);

  const allowedModes = useMemo(() => {
    const primaryDomainModes = get3DSimsByDomain(domainId).map((s) => s.id);
    const lessonDomainModes = get3DSimsByDomain(getDomainFor3DSim(lesson.sim3dType)).map((s) => s.id);
    const merged = [step3DMode, lesson.sim3dType, ...primaryDomainModes, ...lessonDomainModes];
    return Array.from(new Set(merged)).slice(0, 8);
  }, [domainId, lesson.sim3dType, step3DMode]);

  if (!isWebGLActive) {
    return (
      <section
        data-testid={`physics-inline-3d-step-${stepIndex}`}
        className="rounded-xl border border-slate-800 bg-slate-950 text-white shadow-sm overflow-hidden"
      >
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold tracking-wider uppercase shrink-0">
              <Box className="w-3 h-3" />
              3D · PHẦN {stepIndex + 1}/{totalSteps}
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
              <FormattedText text={spec?.title || lesson.title} />
            </h4>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onActivateWebGL && (
              <button
                type="button"
                onClick={onActivateWebGL}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Chạy Mô phỏng 3D WebGL</span>
              </button>
            )}
            {onOpenSim3D && (
              <button
                type="button"
                onClick={onOpenSim3D}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Lab 3D Đầy đủ</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#080d1a]">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THREE.JS WEBGL · {domainMeta?.shortName?.toUpperCase() || 'VẬT LÍ 3D'}</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              <FormattedText text={spec?.subtitle || lesson.description} />
            </div>
            {spec?.formula && (
              <div className="inline-block px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-mono text-[11px] text-sky-300">
                <MathFormula formula={spec.formula} />
              </div>
            )}
          </div>

          {onActivateWebGL && (
            <button
              type="button"
              onClick={onActivateWebGL}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm transition-colors shrink-0 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4" />
              <span>Mở cảnh 3D tại đây</span>
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      data-testid={`physics-inline-3d-step-${stepIndex}`}
      className="space-y-1.5"
    >
      <Physics3DView
        embedded
        embeddedBadge={`3D · PHẦN ${stepIndex + 1}/${totalSteps}`}
        initialMode={step3DMode}
        allowedModes={allowedModes}
        domainTitle={domainMeta?.shortName}
        onOpenFull3D={onOpenSim3D}
      />
    </section>
  );
};
