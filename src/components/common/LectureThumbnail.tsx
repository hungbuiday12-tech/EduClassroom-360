import React from 'react';

interface LectureThumbnailProps {
  subject: 'math' | 'physics' | 'cs' | 'chemistry' | 'biology';
  id: string;
  category?: string;
  simType?: string;
  sim2dMode?: string;
  sim3dMode?: string;
  lessonNumber?: number;
  className?: string;
}

export const LectureThumbnail: React.FC<LectureThumbnailProps> = ({
  subject,
  id,
  category = '',
  simType,
  sim2dMode,
  sim3dMode,
  lessonNumber = 1,
  className = ''
}) => {
  const renderMathArt = () => {
    const lowCat = category.toLowerCase();
    const lowId = id.toLowerCase();

    // 3D Solid / Oxyz
    if (
      sim3dMode === 'sphere_plane' ||
      sim3dMode === 'line_plane_oxyz' ||
      lowId.includes('math-6') ||
      lowId.includes('math-12-4')
    ) {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <defs>
            <radialGradient id={`sph-${id}`} cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="55%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </radialGradient>
          </defs>
          <path d="M28 8V28M28 28L10 40M28 28L46 40" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="2 2" />
          <circle cx="28" cy="27" r="13" fill={`url(#sph-${id})`} opacity="0.9" />
          <ellipse cx="28" cy="27" rx="13" ry="4.5" fill="none" stroke="#e0e7ff" strokeWidth="1.2" className="holo-dash" />
          <circle cx="34" cy="21" r="2.2" fill="#fde047" className="math-focus-pulse" />
        </svg>
      );
    }

    // Pyramid / Cone / Cylinder 3D
    if (
      sim3dMode === 'pyramid_section' ||
      sim3dMode === 'revolution_solid' ||
      sim3dMode === 'conic_sections_3d' ||
      lowId.includes('math-7') ||
      lowId.includes('math-12-3') ||
      lowId.includes('math-11-4') ||
      lowId.includes('math-11-7') ||
      lowId.includes('math-9-8')
    ) {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <polygon points="28,9 11,41 35,45" fill="#6366f1" fillOpacity="0.24" stroke="#6366f1" strokeWidth="1.8" strokeLinejoin="round" />
          <polygon points="28,9 35,45 46,36" fill="#4f46e5" fillOpacity="0.4" stroke="#4f46e5" strokeWidth="1.8" strokeLinejoin="round" />
          <line x1="28" y1="9" x2="28" y2="39" stroke="#f59e0b" strokeWidth="1.4" className="holo-dash" />
          <polygon points="20,25 32,27 38,22 25,21" fill="#fbbf24" fillOpacity="0.45" stroke="#f59e0b" strokeWidth="1.2" className="math-focus-pulse" />
        </svg>
      );
    }

    // Integral shaded area
    if (lowId === 'math-5' || sim3dMode === 'integral_disks_3d') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <path d="M8 42H48M12 10V46" stroke="#94a3b8" strokeWidth="1.3" />
          <path d="M16 42V28C22 18 32 14 40 24V42Z" fill="#6366f1" fillOpacity="0.32" className="math-bar-breathe" />
          <path d="M10 34C18 16 32 10 46 28" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" />
          <text x="24" y="37" fontSize="11" fontWeight="bold" fill="#4f46e5">∫</text>
        </svg>
      );
    }

    // 3D Tangent Surface / Derivative
    if (sim3dMode === 'tangent_surface_3d') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <path d="M8 38C16 14 28 16 48 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M10 44C18 22 30 24 48 32" fill="none" stroke="#38bdf8" strokeWidth="1.4" opacity="0.7" />
          <polygon points="18,14 40,20 35,33 13,27" fill="#f59e0b" fillOpacity="0.28" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="27" y1="24" x2="32" y2="11" stroke="#ec4899" strokeWidth="1.9" strokeLinecap="round" />
          <circle cx="27" cy="24" r="2.6" fill="#ec4899" className="math-focus-pulse" />
        </svg>
      );
    }

    // Probability / Statistics histogram & bell curve
    if (sim3dMode === 'probability_bell_3d' || lowCat.includes('xác suất') || lowId.includes('math-12') || lowId.includes('math-9-7')) {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <rect x="10" y="32" width="7" height="12" rx="1.5" fill="#818cf8" opacity="0.7" className="math-bar-breathe" />
          <rect x="20" y="21" width="7" height="23" rx="1.5" fill="#6366f1" opacity="0.85" className="math-bar-breathe" style={{ animationDelay: '0.25s' }} />
          <rect x="30" y="16" width="7" height="28" rx="1.5" fill="#4f46e5" className="math-bar-breathe" style={{ animationDelay: '0.5s' }} />
          <rect x="40" y="27" width="7" height="17" rx="1.5" fill="#818cf8" opacity="0.75" className="math-bar-breathe" style={{ animationDelay: '0.75s' }} />
          <path d="M8 40C15 39 21 13 28 13C35 13 41 39 48 40" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }

    // Trig / Exp / Log / Waves
    if (lowCat.includes('lượng giác') || lowCat.includes('mũ') || lowId.includes('math-8')) {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <path d="M8 28H48M28 8V48" stroke="#94a3b8" strokeWidth="1.2" />
          <path d="M8 28Q15 10 22 28T36 28T48 28" fill="none" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" className="physics-wave-bob" />
          <path d="M12 42Q28 38 43 11" fill="none" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" className="holo-dash" />
          <circle cx="35" cy="24" r="2.5" fill="#f59e0b" className="math-focus-pulse" />
        </svg>
      );
    }

    // Complex numbers Argand plane
    if (lowCat.includes('số phức') || lowId === 'math-9') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <path d="M8 34H48M22 8V48" stroke="#94a3b8" strokeWidth="1.3" />
          <circle cx="22" cy="34" r="14" fill="none" stroke="#8b5cf6" strokeWidth="1.4" className="holo-dash" />
          <line x1="22" y1="34" x2="36" y2="18" stroke="#ec4899" strokeWidth="2.3" strokeLinecap="round" />
          <circle cx="36" cy="18" r="3" fill="#ec4899" className="math-focus-pulse" />
          <text x="38" y="17" fontSize="9" fontWeight="bold" fill="#8b5cf6">z</text>
        </svg>
      );
    }

    // Circle Theorems & Chords / Secants / Two Circles
    if (lowCat.includes('đường tròn') || lowId.includes('math-9-9') || lowId.includes('math-9-10') || lowId.includes('circle')) {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <circle cx="28" cy="28" r="16" fill="#0ea5e9" fillOpacity="0.14" stroke="#0284c7" strokeWidth="2" />
          <line x1="14" y1="36" x2="43" y2="21" stroke="#6366f1" strokeWidth="1.8" />
          <line x1="28" y1="28" x2="40.5" y2="18" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="44" y1="12" x2="36" y2="44" stroke="#f59e0b" strokeWidth="1.8" className="holo-dash" />
          <circle cx="28" cy="28" r="2.2" fill="#0284c7" />
          <circle cx="40.5" cy="18" r="2.4" fill="#ef4444" className="math-focus-pulse" />
        </svg>
      );
    }

    // Geometric Transform 3D / Planar Transformation
    if (sim3dMode === 'geometric_transform_3d' || lowId.includes('11-16') || lowId.includes('11-17')) {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <polygon points="10,40 24,40 16,24" fill="#14b8a6" fillOpacity="0.28" stroke="#0d9488" strokeWidth="1.7" />
          <polygon points="30,28 46,28 38,11" fill="#f59e0b" fillOpacity="0.32" stroke="#d97706" strokeWidth="1.7" />
          <line x1="16" y1="24" x2="38" y2="11" stroke="#ec4899" strokeWidth="1.6" className="holo-dash" />
          <line x1="24" y1="40" x2="46" y2="28" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" />
          <circle cx="38" cy="11" r="2.2" fill="#f59e0b" className="math-focus-pulse" />
        </svg>
      );
    }

    // 2D Geometry / Triangles / Circles / Conics
    if (sim2dMode === 'geometry' || lowCat.includes('hình học')) {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <circle cx="28" cy="29" r="15" fill="#3b82f6" fillOpacity="0.14" stroke="#3b82f6" strokeWidth="1.8" className="holo-dash" />
          <polygon points="28,14 15,38 41,38" fill="#6366f1" fillOpacity="0.25" stroke="#4f46e5" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="28" cy="14" r="2.2" fill="#f59e0b" className="math-focus-pulse" />
          <circle cx="15" cy="38" r="2.2" fill="#f59e0b" className="math-focus-pulse" style={{ animationDelay: '0.4s' }} />
          <circle cx="41" cy="38" r="2.2" fill="#f59e0b" className="math-focus-pulse" style={{ animationDelay: '0.8s' }} />
        </svg>
      );
    }

    // Rational / Hyperbola
    if (lowId === 'math-2') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <line x1="28" y1="8" x2="28" y2="48" stroke="#f59e0b" strokeWidth="1.3" className="holo-dash" />
          <line x1="8" y1="28" x2="48" y2="28" stroke="#f59e0b" strokeWidth="1.3" className="holo-dash" />
          <path d="M10 34Q23 33 25 46" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M31 10Q33 23 46 24" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="28" cy="28" r="2.2" fill="#ec4899" className="math-focus-pulse" />
        </svg>
      );
    }

    // Default Math: Cubic / Quadratic Curve + Tangent
    return (
      <svg viewBox="0 0 56 56" className="w-full h-full">
        <path d="M8 30H48M28 8V48" stroke="#94a3b8" strokeWidth="1.2" />
        <path d="M10 42C16 14 23 14 28 28C33 42 40 42 46 14" fill="none" stroke="#4f46e5" strokeWidth="2.3" strokeLinecap="round" />
        <circle cx="20" cy="18" r="2.6" fill="#ec4899" className="math-focus-pulse" />
        <circle cx="36" cy="38" r="2.6" fill="#10b981" className="math-focus-pulse" style={{ animationDelay: '0.6s' }} />
      </svg>
    );
  };

  const renderPhysicsArt = () => {
    switch (simType) {
      case 'ohm_circuit':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <rect x="11" y="13" width="34" height="30" rx="5" fill="none" stroke="#0284c7" strokeWidth="2.2" className="animate-electric-flow" />
            <path d="M19 13H24L26 9L30 17L33 13H37" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinejoin="round" />
            <circle cx="28" cy="43" r="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" className="holo-ring-pulse" />
            <path d="M15 26L11 22M11 22L7 26" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        );
      case 'ac_rlc_circuit':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <path d="M8 38Q15 22 22 38T36 38T48 38" fill="none" stroke="#f59e0b" strokeWidth="2" className="physics-wave-bob" />
            <line x1="14" y1="26" x2="42" y2="26" stroke="#38bdf8" strokeWidth="2" />
            <line x1="14" y1="26" x2="36" y2="11" stroke="#ef4444" strokeWidth="2.2" />
            <line x1="36" y1="11" x2="36" y2="26" stroke="#10b981" strokeWidth="1.6" className="animate-electric-flow" />
          </svg>
        );
      case 'lens_optics':
      case 'light_refraction':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <line x1="6" y1="28" x2="50" y2="28" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 2" />
            <path d="M28 10Q36 28 28 46Q20 28 28 10Z" fill="#38bdf8" fillOpacity="0.35" stroke="#0284c7" strokeWidth="1.8" />
            <path d="M9 19H28L45 36" fill="none" stroke="#ef4444" strokeWidth="1.8" className="animate-electric-flow" />
            <path d="M9 19L45 36" fill="none" stroke="#f59e0b" strokeWidth="1.6" />
            <circle cx="38" cy="28" r="2.2" fill="#ef4444" className="math-focus-pulse" />
          </svg>
        );
      case 'projectile_motion':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <line x1="8" y1="43" x2="48" y2="43" stroke="#64748b" strokeWidth="2" />
            <path d="M11 43Q28 6 45 43" fill="none" stroke="#38bdf8" strokeWidth="2" className="holo-dash" />
            <circle cx="24" cy="23" r="4" fill="#ef4444" className="physics-wave-bob" />
            <path d="M24 23L34 17" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'free_fall_energy':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <line x1="12" y1="45" x2="44" y2="45" stroke="#64748b" strokeWidth="2" />
            <line x1="22" y1="12" x2="22" y2="32" stroke="#38bdf8" strokeWidth="1.6" className="holo-dash" />
            <circle cx="22" cy="18" r="5" fill="#f59e0b" className="physics-wave-bob" />
            <rect x="35" y="20" width="6" height="25" rx="1.5" fill="#10b981" opacity="0.8" />
            <rect x="35" y="20" width="6" height="11" rx="1.5" fill="#38bdf8" className="math-bar-breathe" />
          </svg>
        );
      case 'spring_pendulum':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <line x1="14" y1="10" x2="42" y2="10" stroke="#64748b" strokeWidth="2.4" />
            <g className="physics-wave-bob">
              <path d="M28 10V14L23 17L33 21L23 25L33 29L28 32V35" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinejoin="round" />
              <rect x="20" y="35" width="16" height="12" rx="3" fill="#f59e0b" />
            </g>
          </svg>
        );
      case 'simple_pendulum':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <line x1="14" y1="10" x2="42" y2="10" stroke="#64748b" strokeWidth="2.4" />
            <path d="M16 37A20 20 0 0 0 40 37" fill="none" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="3 2" />
            <g className="physics-pendulum-anim">
              <line x1="28" y1="10" x2="28" y2="37" stroke="#0284c7" strokeWidth="2" />
              <circle cx="28" cy="38" r="5.5" fill="#f59e0b" />
            </g>
          </svg>
        );
      case 'wave_interference':
      case 'young_interference':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <circle cx="20" cy="28" r="7" fill="none" stroke="#38bdf8" strokeWidth="1.4" className="holo-ring-pulse" />
            <circle cx="20" cy="28" r="13" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.7" className="holo-ring-pulse" style={{ animationDelay: '0.4s' }} />
            <circle cx="36" cy="28" r="7" fill="none" stroke="#f59e0b" strokeWidth="1.4" className="holo-ring-pulse" style={{ animationDelay: '0.2s' }} />
            <circle cx="36" cy="28" r="13" fill="none" stroke="#f59e0b" strokeWidth="1.2" opacity="0.7" className="holo-ring-pulse" style={{ animationDelay: '0.6s' }} />
            <circle cx="20" cy="28" r="2.2" fill="#0284c7" />
            <circle cx="36" cy="28" r="2.2" fill="#d97706" />
          </svg>
        );
      case 'magnetic_induction':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <g className="physics-wave-bob">
              <rect x="9" y="21" width="11" height="14" fill="#ef4444" rx="1.5" />
              <rect x="20" y="21" width="11" height="14" fill="#3b82f6" rx="1.5" />
            </g>
            <ellipse cx="40" cy="28" rx="4" ry="11" fill="none" stroke="#f59e0b" strokeWidth="2.2" className="animate-electric-flow" />
            <ellipse cx="44" cy="28" rx="4" ry="11" fill="none" stroke="#f59e0b" strokeWidth="2.2" />
          </svg>
        );
      case 'electric_field':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <path d="M16 28C23 16 33 16 40 28M16 28C23 40 33 40 40 28M16 28H40" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-electric-flow" />
            <circle cx="15" cy="28" r="5" fill="#ef4444" />
            <circle cx="41" cy="28" r="5" fill="#3b82f6" />
            <text x="12.5" y="31" fontSize="9" fontWeight="bold" fill="#fff">+</text>
            <text x="38.5" y="31" fontSize="9" fontWeight="bold" fill="#fff">−</text>
          </svg>
        );
      case 'thermal_gas':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <rect x="11" y="13" width="34" height="30" rx="5" fill="#f97316" fillOpacity="0.14" stroke="#f97316" strokeWidth="2" />
            <circle cx="20" cy="22" r="2.6" fill="#ef4444" className="physics-wave-bob" />
            <circle cx="34" cy="20" r="2.6" fill="#f59e0b" className="physics-wave-bob" style={{ animationDelay: '0.4s' }} />
            <circle cx="27" cy="33" r="2.6" fill="#38bdf8" className="physics-wave-bob" style={{ animationDelay: '0.8s' }} />
            <circle cx="37" cy="34" r="2.6" fill="#ef4444" className="physics-wave-bob" style={{ animationDelay: '1.1s' }} />
            <path d="M20 22L26 18M34 20L38 26M27 33L21 37" stroke="#f97316" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        );
      case 'nuclear_decay':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <g className="holo-orbit-cw">
              <ellipse cx="28" cy="28" rx="18" ry="7" transform="rotate(35 28 28)" fill="none" stroke="#a855f7" strokeWidth="1.5" />
            </g>
            <g className="holo-orbit-ccw">
              <ellipse cx="28" cy="28" rx="18" ry="7" transform="rotate(-35 28 28)" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            </g>
            <circle cx="26" cy="27" r="3" fill="#ef4444" />
            <circle cx="30" cy="29" r="3" fill="#f59e0b" />
            <circle cx="28" cy="25" r="2.6" fill="#3b82f6" />
          </svg>
        );
      case 'circular_motion':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <circle cx="28" cy="28" r="15" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 2" />
            <g className="holo-orbit-cw">
              <line x1="28" y1="28" x2="40" y2="19" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="40" cy="19" r="4" fill="#ef4444" />
            </g>
            <circle cx="28" cy="28" r="2.5" fill="#64748b" />
          </svg>
        );
      case 'standing_wave':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <path d="M8 28Q14 11 21 28T35 28T48 28" fill="none" stroke="#0ea5e9" strokeWidth="2.2" className="physics-wave-bob" />
            <path d="M8 28Q14 45 21 28T35 28T48 28" fill="none" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="2.5 2" />
            <circle cx="8" cy="28" r="2.6" fill="#ef4444" />
            <circle cx="21" cy="28" r="2.6" fill="#ef4444" />
            <circle cx="35" cy="28" r="2.6" fill="#ef4444" />
            <circle cx="48" cy="28" r="2.6" fill="#ef4444" />
          </svg>
        );
      case 'doppler_effect':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <circle cx="31" cy="28" r="6" fill="none" stroke="#38bdf8" strokeWidth="1.6" className="holo-ring-pulse" />
            <circle cx="27" cy="28" r="12" fill="none" stroke="#38bdf8" strokeWidth="1.4" opacity="0.75" className="holo-ring-pulse" style={{ animationDelay: '0.35s' }} />
            <circle cx="22" cy="28" r="18" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.5" className="holo-ring-pulse" style={{ animationDelay: '0.7s' }} />
            <circle cx="34" cy="28" r="3.4" fill="#f59e0b" />
          </svg>
        );
      case 'photoelectric_effect':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <rect x="11" y="16" width="5" height="24" rx="1.5" fill="#0ea5e9" />
            <rect x="40" y="16" width="5" height="24" rx="1.5" fill="#f59e0b" />
            <path d="M26 10L16 25" stroke="#a855f7" strokeWidth="2" className="animate-electric-flow" />
            <circle cx="26" cy="26" r="2.8" fill="#38bdf8" className="physics-wave-bob" />
            <circle cx="33" cy="31" r="2.8" fill="#38bdf8" className="physics-wave-bob" style={{ animationDelay: '0.45s' }} />
          </svg>
        );
      case 'electric_power_meter':
      case 'joule_lenz_heat':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <rect x="10" y="11" width="36" height="34" rx="5" fill="#0ea5e9" fillOpacity="0.14" stroke="#0284c7" strokeWidth="1.8" />
            <circle cx="28" cy="24" r="7" fill="none" stroke="#f59e0b" strokeWidth="1.8" className="holo-orbit-cw" />
            <path d="M18 37H38" stroke="#ef4444" strokeWidth="2.4" strokeLinecap="round" className="animate-electric-flow" />
            <text x="20" y="27" fontSize="8" fontWeight="bold" fill="#0284c7">kWh</text>
          </svg>
        );
      case 'dc_motor_2d':
      case 'power_plant_generator':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <rect x="8" y="18" width="9" height="20" rx="2" fill="#ef4444" />
            <rect x="39" y="18" width="9" height="20" rx="2" fill="#3b82f6" />
            <circle cx="28" cy="28" r="10" fill="none" stroke="#f59e0b" strokeWidth="2.2" className="holo-orbit-cw" />
            <line x1="21" y1="28" x2="35" y2="28" stroke="#10b981" strokeWidth="2.2" />
            <circle cx="28" cy="28" r="2.5" fill="#f59e0b" className="math-focus-pulse" />
          </svg>
        );
      case 'electrolysis_faraday':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <rect x="12" y="16" width="32" height="28" rx="4" fill="#06b6d4" fillOpacity="0.2" stroke="#0891b2" strokeWidth="1.8" />
            <rect x="18" y="11" width="4" height="26" rx="1" fill="#f59e0b" />
            <rect x="34" y="11" width="4" height="26" rx="1" fill="#64748b" />
            <circle cx="28" cy="30" r="2.5" fill="#38bdf8" className="physics-wave-bob" />
            <circle cx="25" cy="37" r="2" fill="#f59e0b" className="physics-wave-bob" style={{ animationDelay: '0.35s' }} />
          </svg>
        );
      case 'eye_optics_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <ellipse cx="30" cy="28" rx="16" ry="11" fill="#e0f2fe" fillOpacity="0.3" stroke="#0284c7" strokeWidth="1.8" />
            <ellipse cx="22" cy="28" rx="3.2" ry="7" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.4" />
            <path d="M8 23H22L44 28M8 33H22L44 28" fill="none" stroke="#f59e0b" strokeWidth="1.6" />
            <circle cx="44" cy="28" r="2.4" fill="#ef4444" className="math-focus-pulse" />
          </svg>
        );
      case 'fresnel_phasor_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <circle cx="28" cy="28" r="15" fill="none" stroke="#64748b" strokeWidth="1.4" strokeDasharray="3 2" />
            <line x1="28" y1="28" x2="39" y2="19" stroke="#38bdf8" strokeWidth="2" />
            <line x1="28" y1="28" x2="40" y2="33" stroke="#f59e0b" strokeWidth="2" />
            <line x1="28" y1="28" x2="46" y2="24" stroke="#ec4899" strokeWidth="2.3" className="math-focus-pulse" />
          </svg>
        );
      case 'phase_change_heating':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <path d="M10 42L18 32H28L36 20H46" fill="none" stroke="#ef4444" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="18" y="34" width="10" height="4" rx="1" fill="#38bdf8" className="math-bar-breathe" />
            <circle cx="36" cy="20" r="2.6" fill="#f59e0b" className="math-focus-pulse" />
          </svg>
        );
      case 'em_wave_3axis':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <line x1="8" y1="28" x2="48" y2="28" stroke="#94a3b8" strokeWidth="1.3" />
            <path d="M10 28Q16 12 22 28T34 28T46 28" fill="none" stroke="#ef4444" strokeWidth="2" className="physics-wave-bob" />
            <path d="M10 28Q16 38 22 28T34 28T46 28" fill="none" stroke="#38bdf8" strokeWidth="1.8" className="holo-dash" />
          </svg>
        );
      case 'distance_displacement_rel':
      case 'work_power_joule':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <path d="M10 38Q24 14 44 26" fill="none" stroke="#10b981" strokeWidth="2" className="holo-dash" />
            <line x1="10" y1="38" x2="44" y2="26" stroke="#f59e0b" strokeWidth="2.2" />
            <circle cx="10" cy="38" r="3" fill="#3b82f6" />
            <circle cx="44" cy="26" r="3" fill="#ef4444" className="math-focus-pulse" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <path d="M10 42H46M12 12V44" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M12 38L24 22L36 22L46 12" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="24" cy="22" r="2.5" fill="#f59e0b" className="math-focus-pulse" />
          </svg>
        );
    }
  };

  const renderCSArt = () => {
    const num = lessonNumber;
    // Lesson 1: Fast I/O Terminal
    if (num === 1 || id === 'cs-1') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <rect x="9" y="13" width="38" height="30" rx="5" fill="#0f172a" stroke="#10b981" strokeWidth="1.6" />
          <path d="M16 23L22 28L16 33" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="26" y1="33" x2="38" y2="33" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    }
    // Lesson 2: Prime Sieve Grid
    if (num === 2 || id === 'cs-2') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <rect x="11" y="12" width="15" height="14" rx="3" fill="#10b981" />
          <rect x="30" y="12" width="15" height="14" rx="3" fill="#0ea5e9" />
          <rect x="11" y="30" width="15" height="14" rx="3" fill="#64748b" opacity="0.35" />
          <rect x="30" y="30" width="15" height="14" rx="3" fill="#10b981" />
          <text x="16" y="22" fontSize="9" fontWeight="bold" fill="#fff">2</text>
          <text x="35" y="22" fontSize="9" fontWeight="bold" fill="#fff">3</text>
          <text x="35" y="40" fontSize="9" fontWeight="bold" fill="#fff">5</text>
        </svg>
      );
    }
    // Lesson 3: Array Frequency Bars + String
    if (num === 3 || id === 'cs-3') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <rect x="10" y="30" width="7" height="14" rx="2" fill="#38bdf8" />
          <rect x="20" y="18" width="7" height="26" rx="2" fill="#10b981" />
          <rect x="30" y="25" width="7" height="19" rx="2" fill="#38bdf8" />
          <rect x="40" y="13" width="7" height="31" rx="2" fill="#f59e0b" />
        </svg>
      );
    }
    // Lesson 4: Backtracking N-Queens / Recursion Tree
    if (num === 4 || id === 'cs-4') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <rect x="12" y="12" width="32" height="32" rx="4" fill="none" stroke="#8b5cf6" strokeWidth="1.6" />
          <line x1="28" y1="12" x2="28" y2="44" stroke="#94a3b8" strokeWidth="1" />
          <line x1="12" y1="28" x2="44" y2="28" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="20" cy="20" r="4" fill="#f59e0b" />
          <circle cx="36" cy="36" r="4" fill="#10b981" />
        </svg>
      );
    }
    // Lesson 5: Binary Search Halving
    if (num === 5 || id === 'cs-5') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <rect x="8" y="22" width="11" height="12" rx="2" fill="#94a3b8" opacity="0.4" />
          <rect x="22" y="18" width="12" height="20" rx="2.5" fill="#10b981" />
          <rect x="37" y="22" width="11" height="12" rx="2" fill="#94a3b8" opacity="0.4" />
          <path d="M28 10V16" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    }
    // Lesson 6: Two Pointers / Sliding Window
    if (num === 6 || id === 'cs-6') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <rect x="15" y="20" width="26" height="16" rx="4" fill="#0ea5e9" fillOpacity="0.22" stroke="#0ea5e9" strokeWidth="2" />
          <path d="M18 11V17M38 39V45" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="22" cy="28" r="2.2" fill="#10b981" />
          <circle cx="28" cy="28" r="2.2" fill="#10b981" />
          <circle cx="34" cy="28" r="2.2" fill="#10b981" />
        </svg>
      );
    }
    // Lesson 7: DP Knapsack / LIS Staircase
    if (num === 7 || id === 'cs-7') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <path d="M10 40H19V32H28V24H37V15H46" fill="none" stroke="#10b981" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="19" cy="32" r="2.6" fill="#f59e0b" />
          <circle cx="28" cy="24" r="2.6" fill="#f59e0b" />
          <circle cx="37" cy="15" r="2.6" fill="#f59e0b" />
        </svg>
      );
    }
    // Lesson 8: Dijkstra Weighted Graph
    if (num === 8 || id === 'cs-8') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <line x1="14" y1="36" x2="28" y2="15" stroke="#10b981" strokeWidth="2.2" />
          <line x1="28" y1="15" x2="42" y2="32" stroke="#10b981" strokeWidth="2.2" />
          <line x1="14" y1="36" x2="42" y2="32" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="3 2" />
          <circle cx="14" cy="36" r="5" fill="#0ea5e9" />
          <circle cx="28" cy="15" r="5" fill="#10b981" />
          <circle cx="42" cy="32" r="5" fill="#f59e0b" />
        </svg>
      );
    }
    // Lesson 9+: Segment Tree / Binary Tree
    return (
      <svg viewBox="0 0 56 56" className="w-full h-full">
        <line x1="28" y1="14" x2="17" y2="28" stroke="#38bdf8" strokeWidth="1.8" />
        <line x1="28" y1="14" x2="39" y2="28" stroke="#38bdf8" strokeWidth="1.8" />
        <line x1="17" y1="28" x2="11" y2="42" stroke="#94a3b8" strokeWidth="1.4" />
        <line x1="17" y1="28" x2="23" y2="42" stroke="#94a3b8" strokeWidth="1.4" />
        <circle cx="28" cy="14" r="5" fill="#6366f1" />
        <circle cx="17" cy="28" r="4.2" fill="#0ea5e9" />
        <circle cx="39" cy="28" r="4.2" fill="#0ea5e9" />
        <circle cx="11" cy="42" r="3.4" fill="#10b981" />
        <circle cx="23" cy="42" r="3.4" fill="#10b981" />
      </svg>
    );
  };

  const renderChemistryArt = () => {
    switch (simType) {
      case 'atom_orbital_2d':
      case 'periodic_trends_2d':
      case 'flame_spectroscopy_2d':
      case 'ir_ms_spectroscopy_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <g className="holo-orbit-cw">
              <ellipse cx="28" cy="28" rx="18" ry="7" transform="rotate(30 28 28)" fill="none" stroke="#10b981" strokeWidth="1.6" />
              <circle cx="44" cy="24" r="2.4" fill="#0ea5e9" />
            </g>
            <g className="holo-orbit-ccw">
              <ellipse cx="28" cy="28" rx="18" ry="7" transform="rotate(-30 28 28)" fill="none" stroke="#0ea5e9" strokeWidth="1.6" />
              <circle cx="12" cy="32" r="2.4" fill="#f59e0b" />
            </g>
            <circle cx="28" cy="28" r="4.5" fill="#10b981" className="math-focus-pulse" />
          </svg>
        );
      case 'vsepr_bonding_2d':
      case 'crystal_lattice_2d':
      case 'chemical_bond_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <line x1="28" y1="28" x2="14" y2="18" stroke="#0284c7" strokeWidth="2" />
            <line x1="28" y1="28" x2="42" y2="18" stroke="#0284c7" strokeWidth="2" />
            <line x1="28" y1="28" x2="28" y2="45" stroke="#0284c7" strokeWidth="2" />
            <circle cx="28" cy="28" r="6" fill="#6366f1" />
            <circle cx="14" cy="18" r="4.2" fill="#10b981" className="chem-bubble-rise" />
            <circle cx="42" cy="18" r="4.2" fill="#10b981" className="chem-bubble-rise" style={{ animationDelay: '0.4s' }} />
            <circle cx="28" cy="45" r="4.2" fill="#f59e0b" className="chem-bubble-rise" style={{ animationDelay: '0.8s' }} />
          </svg>
        );
      case 'reaction_kinetics_2d':
      case 'enthalpy_hess_2d':
      case 'catalysis_energy_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <path d="M8 40C16 40 20 14 28 14C36 14 40 34 48 34" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M8 40C16 40 22 23 28 23C34 23 40 34 48 34" fill="none" stroke="#10b981" strokeWidth="1.8" className="holo-dash" />
            <circle cx="28" cy="14" r="2.6" fill="#f59e0b" className="math-focus-pulse" />
            <circle cx="28" cy="23" r="2.4" fill="#10b981" className="math-focus-pulse" style={{ animationDelay: '0.4s' }} />
          </svg>
        );
      case 'galvanic_daniell_2d':
      case 'electrolysis_faraday_chem_2d':
      case 'redox_balancing_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <rect x="9" y="22" width="14" height="22" rx="3" fill="#0ea5e9" fillOpacity="0.22" stroke="#0284c7" strokeWidth="1.6" />
            <rect x="33" y="22" width="14" height="22" rx="3" fill="#10b981" fillOpacity="0.22" stroke="#059669" strokeWidth="1.6" />
            <path d="M16 22V12H40V22" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-electric-flow" />
            <circle cx="28" cy="12" r="3.4" fill="#f59e0b" className="math-focus-pulse" />
          </svg>
        );
      case 'alkane_alkene_2d':
      case 'benzene_aromatic_2d':
      case 'carbonyl_alcohol_2d':
      case 'esterification_2d':
      case 'polymerization_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <polygon points="28,12 42,20 42,36 28,44 14,36 14,20" fill="#10b981" fillOpacity="0.16" stroke="#059669" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="28" cy="28" r="8" fill="none" stroke="#f59e0b" strokeWidth="1.6" className="holo-dash" />
            <circle cx="28" cy="12" r="2.3" fill="#0ea5e9" className="math-focus-pulse" />
          </svg>
        );
      case 'qualitative_ion_2d':
      case 'metallurgy_furnace_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <rect x="13" y="13" width="8" height="30" rx="4" fill="#38bdf8" fillOpacity="0.22" stroke="#0284c7" strokeWidth="1.6" />
            <rect x="24" y="13" width="8" height="30" rx="4" fill="#facc15" fillOpacity="0.25" stroke="#eab308" strokeWidth="1.6" />
            <rect x="35" y="13" width="8" height="30" rx="4" fill="#f97316" fillOpacity="0.25" stroke="#ea580c" strokeWidth="1.6" />
            <circle cx="17" cy="36" r="2.6" fill="#f8fafc" />
            <circle cx="28" cy="36" r="2.6" fill="#facc15" />
            <circle cx="39" cy="36" r="2.6" fill="#ef4444" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <path d="M22 12H34M24 12V22L13 41C12 43 13.5 45 16 45H40C42.5 45 44 43 43 41L32 22V12" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 34H39L41.5 40C42 41.5 41 43 39 43H17C15 43 14 41.5 14.5 40L17 34Z" fill="#10b981" fillOpacity="0.45" />
            <circle cx="24" cy="36" r="2" fill="#38bdf8" className="chem-bubble-rise" />
            <circle cx="31" cy="32" r="2.2" fill="#f59e0b" className="chem-bubble-rise" style={{ animationDelay: '0.55s' }} />
            <circle cx="28" cy="26" r="1.6" fill="#10b981" className="chem-bubble-rise" style={{ animationDelay: '1s' }} />
          </svg>
        );
    }
  };

  const renderBiologyArt = () => {
    switch (simType) {
      case 'dna_replication_2d':
      case 'transcription_translation_2d':
      case 'lac_operon_2d':
      case 'crispr_editing_2d':
      case 'pcr_electrophoresis_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <path d="M16 10C36 18 20 38 40 46" fill="none" stroke="#0d9488" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M40 10C20 18 36 38 16 46" fill="none" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="21" y1="16" x2="35" y2="16" stroke="#f59e0b" strokeWidth="1.6" className="bio-strand-pulse" />
            <line x1="23" y1="28" x2="33" y2="28" stroke="#10b981" strokeWidth="1.6" className="bio-strand-pulse" style={{ animationDelay: '0.35s' }} />
            <line x1="21" y1="40" x2="35" y2="40" stroke="#f59e0b" strokeWidth="1.6" className="bio-strand-pulse" style={{ animationDelay: '0.7s' }} />
          </svg>
        );
      case 'enzyme_kinetics_2d':
      case 'biomolecules_2d':
      case 'photosynthesis_calvin_2d':
      case 'cellular_respiration_2d':
      case 'plant_transpiration_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <ellipse cx="28" cy="28" rx="18" ry="11" fill="#10b981" fillOpacity="0.22" stroke="#059669" strokeWidth="1.8" className="bio-cell-breathe" />
            <path d="M14 28Q21 20 28 28T42 28" fill="none" stroke="#0ea5e9" strokeWidth="1.8" className="physics-wave-bob" />
            <circle cx="28" cy="28" r="3" fill="#f59e0b" className="math-focus-pulse" />
          </svg>
        );
      case 'cardiac_cycle_2d':
      case 'bohr_hemoglobin_2d':
      case 'action_potential_2d':
      case 'synapse_transmission_2d':
      case 'nephron_filtration_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <path d="M8 30H17L21 18L26 39L31 23L35 30H48" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="physics-wave-bob" />
            <circle cx="31" cy="23" r="2.5" fill="#14b8a6" className="math-focus-pulse" />
          </svg>
        );
      case 'mendel_punnett_2d':
      case 'gene_linkage_2d':
      case 'hardy_weinberg_2d':
      case 'natural_selection_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <rect x="12" y="12" width="14" height="14" rx="3" fill="#14b8a6" fillOpacity="0.8" />
            <rect x="30" y="12" width="14" height="14" rx="3" fill="#38bdf8" fillOpacity="0.65" />
            <rect x="12" y="30" width="14" height="14" rx="3" fill="#38bdf8" fillOpacity="0.65" />
            <rect x="30" y="30" width="14" height="14" rx="3" fill="#f59e0b" fillOpacity="0.85" className="bio-cell-breathe" />
          </svg>
        );
      case 'pedigree_genetics_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <rect x="12" y="12" width="10" height="10" rx="2" fill="none" stroke="#14b8a6" strokeWidth="1.8" />
            <circle cx="39" cy="17" r="5" fill="#f59e0b" fillOpacity="0.85" stroke="#d97706" strokeWidth="1.5" />
            <line x1="22" y1="17" x2="34" y2="17" stroke="#64748b" strokeWidth="1.5" />
            <line x1="28" y1="17" x2="28" y2="29" stroke="#64748b" strokeWidth="1.5" />
            <line x1="17" y1="29" x2="39" y2="29" stroke="#64748b" strokeWidth="1.5" />
            <rect x="12" y="34" width="10" height="10" rx="2" fill="#f59e0b" fillOpacity="0.85" />
            <circle cx="39" cy="39" r="5" fill="none" stroke="#14b8a6" strokeWidth="1.8" />
          </svg>
        );
      case 'predator_prey_2d':
      case 'logistic_population_2d':
      case 'trophic_pyramid_2d':
      case 'carbon_nitrogen_cycle_2d':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <polygon points="28,10 10,44 46,44" fill="#14b8a6" fillOpacity="0.22" stroke="#0d9488" strokeWidth="1.8" strokeLinejoin="round" />
            <line x1="19" y1="26" x2="37" y2="26" stroke="#0d9488" strokeWidth="1.4" />
            <line x1="14" y1="35" x2="42" y2="35" stroke="#0d9488" strokeWidth="1.4" />
            <circle cx="28" cy="18" r="2.3" fill="#f59e0b" className="math-focus-pulse" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <circle cx="28" cy="28" r="17" fill="#14b8a6" fillOpacity="0.16" stroke="#0d9488" strokeWidth="2" className="bio-cell-breathe" />
            <circle cx="26" cy="26" r="6.5" fill="#6366f1" fillOpacity="0.4" stroke="#4f46e5" strokeWidth="1.6" />
            <ellipse cx="36" cy="34" rx="4.5" ry="2.6" transform="rotate(-25 36 34)" fill="#f59e0b" />
            <circle cx="18" cy="21" r="2.2" fill="#10b981" className="chem-bubble-rise" />
          </svg>
        );
    }
  };

  const containerStyle =
    subject === 'math'
      ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-200/80 dark:border-indigo-800/70'
      : subject === 'physics'
      ? 'bg-amber-50/90 dark:bg-amber-950/50 border-amber-200/80 dark:border-amber-800/70'
      : subject === 'chemistry'
      ? 'bg-emerald-50/90 dark:bg-emerald-950/55 border-emerald-200/80 dark:border-emerald-800/70'
      : subject === 'biology'
      ? 'bg-teal-50/90 dark:bg-teal-950/55 border-teal-200/80 dark:border-teal-800/70'
      : 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-200/80 dark:border-emerald-800/70';

  return (
    <div
      aria-hidden="true"
      className={`w-13 h-13 sm:w-14 sm:h-14 shrink-0 rounded-xl border p-1 shadow-xs overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${containerStyle} ${className}`}
    >
      {subject === 'math' && renderMathArt()}
      {subject === 'physics' && renderPhysicsArt()}
      {subject === 'chemistry' && renderChemistryArt()}
      {subject === 'biology' && renderBiologyArt()}
      {subject === 'cs' && renderCSArt()}
    </div>
  );
};
