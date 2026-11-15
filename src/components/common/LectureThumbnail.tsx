import React from 'react';
import { PhysicsSimType } from '../../types';

interface LectureThumbnailProps {
  subject: 'math' | 'physics' | 'cs';
  id: string;
  category?: string;
  simType?: PhysicsSimType;
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
          <ellipse cx="28" cy="27" rx="13" ry="4.5" fill="none" stroke="#e0e7ff" strokeWidth="1.2" strokeDasharray="3 2" />
          <circle cx="34" cy="21" r="2.2" fill="#fde047" />
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
          <line x1="28" y1="9" x2="28" y2="39" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="2.5 2" />
          <polygon points="20,25 32,27 38,22 25,21" fill="#fbbf24" fillOpacity="0.45" stroke="#f59e0b" strokeWidth="1.2" />
        </svg>
      );
    }

    // Integral shaded area
    if (lowId === 'math-5' || sim3dMode === 'integral_disks_3d') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <path d="M8 42H48M12 10V46" stroke="#94a3b8" strokeWidth="1.3" />
          <path d="M16 42V28C22 18 32 14 40 24V42Z" fill="#6366f1" fillOpacity="0.32" />
          <path d="M10 34C18 16 32 10 46 28" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" />
          <text x="24" y="37" fontSize="11" fontWeight="bold" fill="#4f46e5">∫</text>
        </svg>
      );
    }

    // Probability / Statistics histogram & bell curve
    if (lowCat.includes('xác suất') || lowId.includes('math-12') || lowId.includes('math-9-7')) {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <rect x="10" y="32" width="7" height="12" rx="1.5" fill="#818cf8" opacity="0.7" />
          <rect x="20" y="21" width="7" height="23" rx="1.5" fill="#6366f1" opacity="0.85" />
          <rect x="30" y="16" width="7" height="28" rx="1.5" fill="#4f46e5" />
          <rect x="40" y="27" width="7" height="17" rx="1.5" fill="#818cf8" opacity="0.75" />
          <path d="M8 40C15 39 21 13 28 13C35 13 41 39 48 40" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }

    // Trig / Exp / Log / Waves
    if (lowCat.includes('lượng giác') || lowCat.includes('mũ') || lowId.includes('math-8')) {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <path d="M8 28H48M28 8V48" stroke="#94a3b8" strokeWidth="1.2" />
          <path d="M8 28Q15 10 22 28T36 28T48 28" fill="none" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M12 42Q28 38 43 11" fill="none" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 2" />
          <circle cx="35" cy="24" r="2.5" fill="#f59e0b" />
        </svg>
      );
    }

    // Complex numbers Argand plane
    if (lowCat.includes('số phức') || lowId === 'math-9') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <path d="M8 34H48M22 8V48" stroke="#94a3b8" strokeWidth="1.3" />
          <circle cx="22" cy="34" r="14" fill="none" stroke="#8b5cf6" strokeWidth="1.4" strokeDasharray="3 2" />
          <line x1="22" y1="34" x2="36" y2="18" stroke="#ec4899" strokeWidth="2.3" strokeLinecap="round" />
          <circle cx="36" cy="18" r="3" fill="#ec4899" />
          <text x="38" y="17" fontSize="9" fontWeight="bold" fill="#8b5cf6">z</text>
        </svg>
      );
    }

    // 2D Geometry / Triangles / Circles / Conics
    if (sim2dMode === 'geometry' || lowCat.includes('hình học')) {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <circle cx="28" cy="29" r="15" fill="#3b82f6" fillOpacity="0.14" stroke="#3b82f6" strokeWidth="1.8" />
          <polygon points="28,14 15,38 41,38" fill="#6366f1" fillOpacity="0.25" stroke="#4f46e5" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="28" cy="14" r="2.2" fill="#f59e0b" />
          <circle cx="15" cy="38" r="2.2" fill="#f59e0b" />
          <circle cx="41" cy="38" r="2.2" fill="#f59e0b" />
        </svg>
      );
    }

    // Rational / Hyperbola
    if (lowId === 'math-2') {
      return (
        <svg viewBox="0 0 56 56" className="w-full h-full">
          <line x1="28" y1="8" x2="28" y2="48" stroke="#f59e0b" strokeWidth="1.3" strokeDasharray="3 2" />
          <line x1="8" y1="28" x2="48" y2="28" stroke="#f59e0b" strokeWidth="1.3" strokeDasharray="3 2" />
          <path d="M10 34Q23 33 25 46" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M31 10Q33 23 46 24" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    }

    // Default Math: Cubic / Quadratic Curve + Tangent
    return (
      <svg viewBox="0 0 56 56" className="w-full h-full">
        <path d="M8 30H48M28 8V48" stroke="#94a3b8" strokeWidth="1.2" />
        <path d="M10 42C16 14 23 14 28 28C33 42 40 42 46 14" fill="none" stroke="#4f46e5" strokeWidth="2.3" strokeLinecap="round" />
        <circle cx="20" cy="18" r="2.6" fill="#ec4899" />
        <circle cx="36" cy="38" r="2.6" fill="#10b981" />
      </svg>
    );
  };

  const renderPhysicsArt = () => {
    switch (simType) {
      case 'ohm_circuit':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <rect x="11" y="13" width="34" height="30" rx="5" fill="none" stroke="#0284c7" strokeWidth="2.2" />
            <path d="M19 13H24L26 9L30 17L33 13H37" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinejoin="round" />
            <circle cx="28" cy="43" r="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <path d="M15 26L11 22M11 22L7 26" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        );
      case 'ac_rlc_circuit':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <path d="M8 38Q15 22 22 38T36 38T48 38" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <line x1="14" y1="26" x2="42" y2="26" stroke="#38bdf8" strokeWidth="2" />
            <line x1="14" y1="26" x2="36" y2="11" stroke="#ef4444" strokeWidth="2.2" />
            <line x1="36" y1="11" x2="36" y2="26" stroke="#10b981" strokeWidth="1.6" strokeDasharray="2 2" />
          </svg>
        );
      case 'lens_optics':
      case 'light_refraction':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <line x1="6" y1="28" x2="50" y2="28" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 2" />
            <path d="M28 10Q36 28 28 46Q20 28 28 10Z" fill="#38bdf8" fillOpacity="0.35" stroke="#0284c7" strokeWidth="1.8" />
            <path d="M9 19H28L45 36" fill="none" stroke="#ef4444" strokeWidth="1.8" />
            <path d="M9 19L45 36" fill="none" stroke="#f59e0b" strokeWidth="1.6" />
            <circle cx="38" cy="28" r="2" fill="#ef4444" />
          </svg>
        );
      case 'projectile_motion':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <line x1="8" y1="43" x2="48" y2="43" stroke="#64748b" strokeWidth="2" />
            <path d="M11 43Q28 6 45 43" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
            <circle cx="24" cy="23" r="4" fill="#ef4444" />
            <path d="M24 23L34 17" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'free_fall_energy':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <line x1="12" y1="45" x2="44" y2="45" stroke="#64748b" strokeWidth="2" />
            <line x1="22" y1="12" x2="22" y2="32" stroke="#38bdf8" strokeWidth="1.6" strokeDasharray="2 2" />
            <circle cx="22" cy="18" r="5" fill="#f59e0b" />
            <rect x="35" y="20" width="6" height="25" rx="1.5" fill="#10b981" opacity="0.8" />
            <rect x="35" y="20" width="6" height="11" rx="1.5" fill="#38bdf8" />
          </svg>
        );
      case 'spring_pendulum':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <line x1="14" y1="10" x2="42" y2="10" stroke="#64748b" strokeWidth="2.4" />
            <path d="M28 10V14L23 17L33 21L23 25L33 29L28 32V35" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinejoin="round" />
            <rect x="20" y="35" width="16" height="12" rx="3" fill="#f59e0b" />
          </svg>
        );
      case 'simple_pendulum':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <line x1="14" y1="10" x2="42" y2="10" stroke="#64748b" strokeWidth="2.4" />
            <path d="M16 37A20 20 0 0 0 40 37" fill="none" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="3 2" />
            <line x1="28" y1="10" x2="39" y2="35" stroke="#0284c7" strokeWidth="2" />
            <circle cx="39" cy="36" r="5.5" fill="#f59e0b" />
          </svg>
        );
      case 'wave_interference':
      case 'young_interference':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <circle cx="20" cy="28" r="7" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
            <circle cx="20" cy="28" r="13" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.7" />
            <circle cx="36" cy="28" r="7" fill="none" stroke="#f59e0b" strokeWidth="1.4" />
            <circle cx="36" cy="28" r="13" fill="none" stroke="#f59e0b" strokeWidth="1.2" opacity="0.7" />
            <circle cx="20" cy="28" r="2.2" fill="#0284c7" />
            <circle cx="36" cy="28" r="2.2" fill="#d97706" />
          </svg>
        );
      case 'magnetic_induction':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <rect x="9" y="21" width="11" height="14" fill="#ef4444" rx="1.5" />
            <rect x="20" y="21" width="11" height="14" fill="#3b82f6" rx="1.5" />
            <ellipse cx="40" cy="28" rx="4" ry="11" fill="none" stroke="#f59e0b" strokeWidth="2.2" />
            <ellipse cx="44" cy="28" rx="4" ry="11" fill="none" stroke="#f59e0b" strokeWidth="2.2" />
          </svg>
        );
      case 'electric_field':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <path d="M16 28C23 16 33 16 40 28M16 28C23 40 33 40 40 28M16 28H40" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
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
            <circle cx="20" cy="22" r="2.6" fill="#ef4444" />
            <circle cx="34" cy="20" r="2.6" fill="#f59e0b" />
            <circle cx="27" cy="33" r="2.6" fill="#38bdf8" />
            <circle cx="37" cy="34" r="2.6" fill="#ef4444" />
            <path d="M20 22L26 18M34 20L38 26M27 33L21 37" stroke="#f97316" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        );
      case 'nuclear_decay':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <ellipse cx="28" cy="28" rx="18" ry="7" transform="rotate(35 28 28)" fill="none" stroke="#a855f7" strokeWidth="1.5" />
            <ellipse cx="28" cy="28" rx="18" ry="7" transform="rotate(-35 28 28)" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="26" cy="27" r="3" fill="#ef4444" />
            <circle cx="30" cy="29" r="3" fill="#f59e0b" />
            <circle cx="28" cy="25" r="2.6" fill="#3b82f6" />
          </svg>
        );
      case 'circular_motion':
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <circle cx="28" cy="28" r="15" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 2" />
            <line x1="28" y1="28" x2="40" y2="19" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="40" cy="19" r="4" fill="#ef4444" />
            <circle cx="28" cy="28" r="2.5" fill="#64748b" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 56 56" className="w-full h-full">
            <path d="M10 42H46M12 12V44" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M12 38L24 22L36 22L46 12" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="24" cy="22" r="2.5" fill="#f59e0b" />
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

  const containerStyle =
    subject === 'math'
      ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-200/80 dark:border-indigo-800/70'
      : subject === 'physics'
      ? 'bg-amber-50/90 dark:bg-amber-950/50 border-amber-200/80 dark:border-amber-800/70'
      : 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-200/80 dark:border-emerald-800/70';

  return (
    <div
      aria-hidden="true"
      className={`w-13 h-13 sm:w-14 sm:h-14 shrink-0 rounded-xl border p-1 shadow-xs overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${containerStyle} ${className}`}
    >
      {subject === 'math' && renderMathArt()}
      {subject === 'physics' && renderPhysicsArt()}
      {subject === 'cs' && renderCSArt()}
    </div>
  );
};
