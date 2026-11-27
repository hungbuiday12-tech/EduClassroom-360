import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Atom,
  BookOpen,
  Box,
  Compass,
  Layers,
  Play,
  Search,
  Sliders,
  X,
  Zap
} from 'lucide-react';
import { Physics3DMode, PhysicsDomainId, PhysicsSimType } from '../../types';
import {
  PHYSICS_DOMAINS,
  PHYSICS_2D_SIMS,
  PHYSICS_3D_SIMS,
  get2DSimsByDomain,
  get3DSimsByDomain
} from '../../data/physicsDomainsData';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { FreeformOpticsRayLab } from './FreeformOpticsRayLab';
import { ChladniPlateLab } from './ChladniPlateLab';
import { FormattedText } from '../common/MathRenderer';

type GradeFilter = 'all' | 'Lớp 6' | 'Lớp 7' | 'Lớp 8' | 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12';
type DimFilter = 'all' | '2d' | '3d';

const DomainPhysicsAnimation: React.FC<{ domainId: PhysicsDomainId }> = ({ domainId }) => {
  switch (domainId) {
    case 'mechanics':
      return (
        <svg viewBox="0 0 320 112" className="w-full h-28" aria-hidden="true">
          <defs>
            <linearGradient id="mec-arc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          {/* Baseline & axes */}
          <line x1="20" y1="92" x2="300" y2="92" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.2" />
          <line x1="34" y1="16" x2="34" y2="96" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.2" />
          {/* Parabolic projectile curve */}
          <path
            d="M 34 88 Q 160 -2 286 88"
            fill="none"
            stroke="url(#mec-arc)"
            strokeWidth="2.2"
            strokeDasharray="6 4"
            className="physics-anim-flux"
          />
          {/* Oscillating trajectory sphere + force vectors */}
          <g className="physics-anim-projectile">
            <circle cx="160" cy="43" r="8" fill="#0ea5e9" fillOpacity="0.22" stroke="#38bdf8" strokeWidth="1.8" />
            <circle cx="160" cy="43" r="3.5" fill="#e0f2fe" />
            <line x1="160" y1="43" x2="196" y2="43" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
            <polygon points="196,40 202,43 196,46" fill="#38bdf8" />
            <line x1="160" y1="43" x2="160" y2="70" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
            <polygon points="157,70 160,76 163,70" fill="#f59e0b" />
          </g>
          {/* Rotating circular-motion orbit marker */}
          <g style={{ transformOrigin: '256px 38px' }} className="physics-anim-orbit">
            <circle cx="256" cy="38" r="18" fill="none" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx="274" cy="38" r="3.2" fill="#38bdf8" />
          </g>
          <text x="42" y="24" className="fill-sky-500/80 dark:fill-sky-400/80 text-[9px] font-mono font-bold">
            v₀ · g = 9.8 m/s²
          </text>
        </svg>
      );
    case 'waves_osc':
      return (
        <svg viewBox="0 0 320 112" className="w-full h-28" aria-hidden="true">
          {/* Spring pendulum on left */}
          <rect x="26" y="12" width="38" height="4" rx="1.5" fill="#10b981" fillOpacity="0.6" />
          <g className="physics-anim-spring">
            <path
              d="M 45 16 L 45 24 L 37 29 L 53 35 L 37 41 L 53 47 L 37 53 L 45 58 L 45 64"
              fill="none"
              stroke="#34d399"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <rect x="33" y="64" width="24" height="16" rx="3" fill="#10b981" fillOpacity="0.28" stroke="#10b981" strokeWidth="1.8" />
          </g>
          {/* Standing / traveling wave center-right */}
          <line x1="88" y1="56" x2="302" y2="56" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
          <g className="physics-anim-wave">
            <path
              d="M 88 56 Q 112 20 136 56 T 184 56 T 232 56 T 280 56 T 328 56"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.4"
            />
            <path
              d="M 88 56 Q 112 92 136 56 T 184 56 T 232 56 T 280 56 T 328 56"
              fill="none"
              stroke="#6ee7b7"
              strokeOpacity="0.55"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            />
          </g>
          <text x="92" y="22" className="fill-emerald-600 dark:fill-emerald-400 text-[9px] font-mono font-bold">
            y = A·cos(ωt − 2πx/λ)
          </text>
        </svg>
      );
    case 'electricity_mag':
      return (
        <svg viewBox="0 0 320 112" className="w-full h-28" aria-hidden="true">
          {/* Solenoid Copper Coils */}
          {[112, 128, 144, 160, 176, 192, 208].map((xPos, idx) => (
            <ellipse
              key={idx}
              cx={xPos}
              cy="56"
              rx="6.5"
              ry="22"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.2"
              strokeOpacity="0.88"
            />
          ))}
          {/* Central Magnetic Core */}
          <rect x="96" y="45" width="128" height="22" rx="4" fill="#f59e0b" fillOpacity="0.14" stroke="#fbbf24" strokeOpacity="0.45" strokeWidth="1.2" />
          {/* Flowing Magnetic Flux Loops */}
          <path
            d="M 60 56 C 60 14, 260 14, 260 56"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeDasharray="6 5"
            className="physics-anim-flux"
          />
          <path
            d="M 60 56 C 60 98, 260 98, 260 56"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeDasharray="6 5"
            className="physics-anim-flux"
          />
          <line x1="36" y1="56" x2="286" y2="56" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="5 4" className="physics-anim-flux" />
          <text x="22" y="22" className="fill-amber-600 dark:fill-amber-400 text-[9px] font-mono font-bold">
            Φ = N·B·S·cosα · e = -ΔΦ/Δt
          </text>
        </svg>
      );
    case 'optics_quantum':
      return (
        <svg viewBox="0 0 320 112" className="w-full h-28" aria-hidden="true">
          {/* Incident White Light Beam */}
          <line x1="24" y1="68" x2="128" y2="48" stroke="#f8fafc" strokeWidth="2.8" className="physics-anim-beam" />
          <line x1="24" y1="68" x2="128" y2="48" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="5 4" className="physics-anim-beam" />
          {/* Refractive Glass Prism */}
          <polygon
            points="154,18 112,86 196,86"
            fill="#8b5cf6"
            fillOpacity="0.16"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Spectral Dispersion Rays */}
          <g className="physics-anim-beam">
            <line x1="172" y1="47" x2="294" y2="36" stroke="#ef4444" strokeWidth="2" />
            <line x1="176" y1="52" x2="294" y2="50" stroke="#f59e0b" strokeWidth="2" />
            <line x1="179" y1="57" x2="294" y2="64" stroke="#10b981" strokeWidth="2" />
            <line x1="183" y1="63" x2="294" y2="79" stroke="#38bdf8" strokeWidth="2" />
            <line x1="186" y1="68" x2="294" y2="94" stroke="#a855f7" strokeWidth="2" />
          </g>
          <text x="22" y="22" className="fill-violet-600 dark:fill-violet-400 text-[9px] font-mono font-bold">
            n₁sin(i) = n₂sin(r) · ε = hf
          </text>
        </svg>
      );
    case 'thermal_nuclear':
      return (
        <svg viewBox="0 0 320 112" className="w-full h-28" aria-hidden="true">
          {/* Bohr Atom Nucleus + Orbits */}
          <g transform="translate(115, 56)">
            <circle cx="0" cy="0" r="8" fill="#f43f5e" />
            <circle cx="0" cy="0" r="13" fill="none" stroke="#fb7185" strokeOpacity="0.4" strokeWidth="1" />
            <g className="physics-anim-orbit">
              <ellipse cx="0" cy="0" rx="38" ry="15" fill="none" stroke="#f43f5e" strokeOpacity="0.7" strokeWidth="1.4" />
              <circle cx="38" cy="0" r="3.4" fill="#38bdf8" />
            </g>
            <g className="physics-anim-orbit-rev">
              <ellipse
                cx="0"
                cy="0"
                rx="38"
                ry="15"
                transform="rotate(60)"
                fill="none"
                stroke="#fb923c"
                strokeOpacity="0.7"
                strokeWidth="1.4"
              />
              <circle cx="-19" cy="-32" r="3.4" fill="#fbbf24" />
            </g>
            <ellipse
              cx="0"
              cy="0"
              rx="38"
              ry="15"
              transform="rotate(-60)"
              fill="none"
              stroke="#f43f5e"
              strokeOpacity="0.45"
              strokeWidth="1.2"
            />
          </g>
          {/* Thermal Gas Box & Kinetic Particles */}
          <rect
            x="202"
            y="24"
            width="92"
            height="68"
            rx="6"
            fill="#f43f5e"
            fillOpacity="0.08"
            stroke="#fb7185"
            strokeOpacity="0.55"
            strokeWidth="1.4"
          />
          <circle cx="222" cy="44" r="4" fill="#fb7185" className="physics-anim-thermal-a" />
          <circle cx="246" cy="64" r="3.5" fill="#fbbf24" className="physics-anim-thermal-b" />
          <circle cx="268" cy="46" r="4.5" fill="#38bdf8" className="physics-anim-thermal-a" />
          <circle cx="274" cy="72" r="3.5" fill="#f43f5e" className="physics-anim-thermal-b" />
          <text x="196" y="18" className="fill-rose-600 dark:fill-rose-400 text-[9px] font-mono font-bold">
            pV = nRT · N = N₀·2^(-t/T)
          </text>
        </svg>
      );
  }
};

export const PhysicsDomainsPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { navigate, goBack } = useNavigation();

  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');
  const [dimFilter, setDimFilter] = useState<DimFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStudioLab, setActiveStudioLab] = useState<'none' | 'optics_ray' | 'chladni'>('optics_ray');

  const total2DCount = Object.keys(PHYSICS_2D_SIMS).length;
  const total3DCount = Object.keys(PHYSICS_3D_SIMS).length;
  const totalSimCount = total2DCount + total3DCount;

  const openDomain2D = (domainId: PhysicsDomainId, simId?: PhysicsSimType) => {
    const sims = get2DSimsByDomain(domainId);
    const chosen = simId || sims[0]?.id || 'spring_pendulum';
    navigate({
      subject: 'physics',
      physicsView: 'sim2d_hub',
      physicsDomain: domainId,
      physicsSim2D: chosen
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDomain3D = (domainId: PhysicsDomainId, simId?: Physics3DMode) => {
    const sims = get3DSimsByDomain(domainId);
    const chosen = simId || sims[0]?.id || 'pendulum_spring';
    navigate({
      subject: 'physics',
      physicsView: 'sim3d_hub',
      physicsDomain: domainId,
      physicsSim3D: chosen
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const domainRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PHYSICS_DOMAINS.map((dom) => {
      const all2d = get2DSimsByDomain(dom.id);
      const all3d = get3DSimsByDomain(dom.id);
      const sims2d = all2d.filter((s) => {
        const matchGrade = gradeFilter === 'all' || s.grades.includes(gradeFilter);
        const matchQuery =
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.subtitle.toLowerCase().includes(q) ||
          s.formula.toLowerCase().includes(q);
        return matchGrade && matchQuery;
      });
      const sims3d = all3d.filter((s) => {
        const matchGrade = gradeFilter === 'all' || s.grades.includes(gradeFilter);
        const matchQuery =
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.subtitle.toLowerCase().includes(q) ||
          s.formula.toLowerCase().includes(q);
        return matchGrade && matchQuery;
      });
      return {
        dom,
        sims2d,
        sims3d,
        totalMatches:
          (dimFilter === '3d' ? 0 : sims2d.length) + (dimFilter === '2d' ? 0 : sims3d.length)
      };
    }).filter((row) => row.totalMatches > 0);
  }, [gradeFilter, dimFilter, searchQuery]);

  return (
    <div className="sim-physics-scope space-y-6 pb-12">
      {/* Header Command Banner */}
      <section className="sci-frame rounded-[4px] bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={onBack || goBack}
                className="group sim-btn-phy flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isEn ? 'Back' : 'Quay lại'}</span>
              </button>
              <span className="font-mono font-bold text-blue-700 dark:text-sky-400 uppercase tracking-wider">
                {isEn ? 'SYNAPSE INTERACTIVE PHYSICS LABS · GRADES 6–12' : 'PHÒNG THÍ NGHIỆM VẬT LÍ TÁCH RIÊNG · LỚP 6–12'}
              </span>
            </div>

            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isEn
                ? `Interactive 2D & 3D Physics Simulations (${PHYSICS_DOMAINS.length} Domains)`
                : `Trang Mô Phỏng Vật Lí 2D & 3D Theo ${PHYSICS_DOMAINS.length} Lĩnh Vực`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              {isEn
                ? `Explore ${total2DCount} 2D real-time labs and ${total3DCount} interactive 3D WebGL experiments (${totalSimCount} total) across ${PHYSICS_DOMAINS.length} domains, plus Freeform Optical Raytracing & Chladni Resonance Plate.`
                : `Tổng hợp ${total2DCount} phòng thí nghiệm 2D và ${total3DCount} mô hình 3D tương tác (tổng ${totalSimCount} mô phỏng) theo ${PHYSICS_DOMAINS.length} lĩnh vực độc lập, tích hợp Quang học Raytracing tự do và Bản cát cộng hưởng Chladni.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate({ subject: 'physics', physicsView: 'catalog' })}
              className="group sim-btn-phy sim-btn-hero flex items-center gap-2 px-4 py-2 rounded-[3px] border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/95 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <span className="icon-anim-book">
                <BookOpen className="w-4 h-4 text-amber-500" />
              </span>
              <span>{isEn ? 'Open Physics Lectures' : 'Mở Bài giảng Vật lí'}</span>
            </button>
            <button
              type="button"
              onClick={() => openDomain2D('mechanics')}
              className="group sim-btn-phy sim-btn-hero sim-btn-active flex items-center gap-2 px-4 py-2 rounded-[3px] border border-sky-400/70 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <span className="sim-led-square text-cyan-200" />
              <span className="icon-anim-zap">
                <Zap className="w-4 h-4" />
              </span>
              <span>{isEn ? `All 2D (${total2DCount})` : `Phòng 2D (${total2DCount})`}</span>
            </button>
            <button
              type="button"
              onClick={() => openDomain3D('mechanics')}
              className="group sim-btn-phy sim-btn-hero sim-btn-active flex items-center gap-2 px-4 py-2 rounded-[3px] border border-amber-300/80 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <span className="sim-led-square text-slate-900" />
              <span className="icon-anim-3d-cube">
                <Box className="w-4 h-4" />
              </span>
              <span>{isEn ? `All 3D (${total3DCount})` : `Phòng 3D (${total3DCount})`}</span>
            </button>
          </div>
        </div>

        {/* Grade, Search & Dimension Filter Bar */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap items-center gap-1.5 max-w-full scrollbar-none pb-0.5 sm:pb-0">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <Sliders className="w-3.5 h-3.5" />
              {isEn ? 'Grade:' : 'Khối lớp:'}
            </span>
            {(['all', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'] as GradeFilter[]).map((g) => {
              const active = gradeFilter === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGradeFilter(g)}
                  className={`sim-btn-phy min-h-[38px] px-3 py-1.5 rounded-[3px] text-xs font-bold border cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'sim-btn-active bg-slate-900 dark:bg-sky-600 text-white border-sky-400/70'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {active && <span className="sim-led-square mr-1.5 text-cyan-300 align-middle" />}
                  {g === 'all' ? (isEn ? 'All Grades' : 'Tất cả (6–12)') : g}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 flex-1 sm:flex-initial justify-end min-w-0">
            <div className="relative w-full sm:w-64 min-w-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? `Search ${totalSimCount} labs or formula...` : `Tìm ${totalSimCount} mô phỏng hoặc công thức...`}
                className="w-full min-h-[38px] pl-8 pr-8 py-1.5 rounded-[3px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="sim-seg-box flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-[4px] border border-slate-200/80 dark:border-slate-700 overflow-x-auto scrollbar-none">
              {(
                [
                  { id: 'all', label: isEn ? '2D + 3D' : 'Cả 2D & 3D' },
                  { id: '2d', label: isEn ? '2D Only' : 'Chỉ 2D' },
                  { id: '3d', label: isEn ? '3D Only' : 'Chỉ 3D' }
                ] as { id: DimFilter; label: string }[]
              ).map((f) => {
                const active = dimFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setDimFilter(f.id)}
                    className={`sim-btn-phy min-h-[34px] px-3 py-1 rounded-[3px] text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'sim-btn-active bg-slate-900 dark:bg-sky-600 text-white border border-sky-400/60 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Next-Gen Interactive Physics Workbenches (Freeform Optics Raytracing & Chladni Acoustic Plate) */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-[4px] px-4 py-2.5">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-violet-500" />
            <span>
              {isEn
                ? 'Next-Gen Interactive Studios (Included inside Physics 2D/3D)'
                : 'Studio Vật Lí Thế Hệ Mới (Tích hợp trực tiếp trong trang Mô phỏng 2D/3D Lí)'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveStudioLab((v) => (v === 'optics_ray' ? 'none' : 'optics_ray'))}
              className={`group sim-btn-phy sim-btn-hero px-3.5 py-1.5 rounded-[3px] font-bold border flex items-center gap-1.5 cursor-pointer ${
                activeStudioLab === 'optics_ray'
                  ? 'sim-btn-active bg-violet-600 border-violet-300 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <span className="icon-anim-compass">
                <Compass className="w-3.5 h-3.5" />
              </span>
              <span>{isEn ? 'Freeform Raytracing Optics' : 'Quang học Raytracing Tự Do'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStudioLab((v) => (v === 'chladni' ? 'none' : 'chladni'))}
              className={`group sim-btn-phy sim-btn-hero px-3.5 py-1.5 rounded-[3px] font-bold border flex items-center gap-1.5 cursor-pointer ${
                activeStudioLab === 'chladni'
                  ? 'sim-btn-active bg-amber-500 border-amber-200 text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <span className="icon-anim-wave">
                <Atom className="w-3.5 h-3.5" />
              </span>
              <span>{isEn ? 'Acoustic Chladni Plate' : 'Bản Cát Cộng Hưởng Chladni'}</span>
            </button>
          </div>
        </div>

        {activeStudioLab === 'optics_ray' && <FreeformOpticsRayLab embedded />}
        {activeStudioLab === 'chladni' && <ChladniPlateLab />}
      </section>

      {/* Empty Filter State */}
      {domainRows.length === 0 && (
        <div className="sci-frame rounded-lg bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {isEn
              ? 'No simulations match the active grade/search filter.'
              : 'Không tìm thấy mô phỏng Vật lí nào khớp bộ lọc hoặc từ khóa đang chọn.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setGradeFilter('all');
              setDimFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
          >
            {isEn ? `Reset All Filters (${totalSimCount} sims)` : `Đặt lại bộ lọc (Xem tất cả ${totalSimCount} mô phỏng)`}
          </button>
        </div>
      )}

      {/* 5 Animated Domain Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {domainRows.map(({ dom, sims2d, sims3d }) => (
          <article
            key={dom.id}
            className="sci-frame rounded-lg bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500/60 transition-colors overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Live Animated Physics Schematic Stage */}
              <div className="px-4 pt-3 pb-1 bg-slate-50/90 dark:bg-slate-950/75 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
                    {dom.code}
                  </span>
                  <span className="font-semibold text-sky-700 dark:text-sky-400">{dom.grades}</span>
                </div>
                <DomainPhysicsAnimation domainId={dom.id} />
              </div>

              {/* Domain Title, Summary & Clickable Experiment Chips */}
              <div className="p-5 space-y-3.5">
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                    {dom.name}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {dom.tagline}
                  </p>
                </div>

                {/* Clickable 2D Experiment List */}
                {dimFilter !== '3d' && sims2d.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-sky-400 flex items-center gap-1">
                      <Compass className="w-3 h-3" />
                      <span>
                        {isEn ? `2D Experiments (${sims2d.length})` : `Thí nghiệm 2D (${sims2d.length})`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {sims2d.map((sim) => (
                        <button
                          key={sim.id}
                          type="button"
                          onClick={() => openDomain2D(dom.id, sim.id)}
                          className="group sim-btn-tile sim-btn-phy inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-blue-50/90 dark:bg-blue-950/40 hover:bg-blue-600 hover:text-white border border-blue-200/90 dark:border-blue-800/70 text-[11px] font-semibold text-blue-800 dark:text-sky-200 cursor-pointer"
                          title={sim.subtitle}
                        >
                          <Play className="w-2.5 h-2.5 shrink-0" />
                          <span><FormattedText text={sim.title} /></span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clickable 3D Experiment List */}
                {dimFilter !== '2d' && sims3d.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <Atom className="w-3 h-3" />
                      <span>
                        {isEn ? `3D Models (${sims3d.length})` : `Mô phỏng 3D (${sims3d.length})`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {sims3d.map((sim) => (
                        <button
                          key={sim.id}
                          type="button"
                          onClick={() => openDomain3D(dom.id, sim.id)}
                          className="group sim-btn-tile sim-btn-tile-amber sim-btn-phy inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-amber-50/90 dark:bg-amber-950/35 hover:bg-amber-500 hover:text-slate-950 border border-amber-200/90 dark:border-amber-800/70 text-[11px] font-semibold text-amber-800 dark:text-amber-200 cursor-pointer"
                          title={sim.subtitle}
                        >
                          <Box className="w-2.5 h-2.5 shrink-0" />
                          <span><FormattedText text={sim.title} /></span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {dom.id === 'optics_quantum' && (
              <div className="px-5 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStudioLab('optics_ray');
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className="group sim-btn-phy sim-btn-hero w-full py-2 px-3 rounded-[3px] bg-violet-600/15 hover:bg-violet-600 hover:text-white border border-violet-400/60 text-violet-700 dark:text-violet-300 text-xs font-bold cursor-pointer"
                >
                  {isEn
                    ? 'Open Freeform Laser & Caustics Raytracing Studio ↑'
                    : 'Mở Studio Quang học Raytracing Tự Do & Sợi quang ↑'}
                </button>
              </div>
            )}

            {/* Domain Action Footer (2D / 3D Square Launch Buttons) */}
            <div className="px-5 pb-5 pt-2 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => openDomain2D(dom.id, sims2d[0]?.id)}
                disabled={sims2d.length === 0}
                className="group sim-btn-phy sim-btn-hero flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[3px] border border-sky-400/60 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white cursor-pointer whitespace-nowrap"
              >
                <span className="icon-anim-zap">
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                </span>
                <span>2D ({sims2d.length})</span>
              </button>
              <button
                type="button"
                onClick={() => openDomain3D(dom.id, sims3d[0]?.id)}
                disabled={sims3d.length === 0}
                className="group sim-btn-phy sim-btn-hero flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[3px] border border-amber-300/70 text-xs font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 cursor-pointer whitespace-nowrap"
              >
                <span className="icon-anim-3d-cube">
                  <Box className="w-3.5 h-3.5 shrink-0" />
                </span>
                <span>3D ({sims3d.length})</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom Notice */}
      <div className="sci-frame rounded-lg bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span>
            {isEn
              ? 'Each simulation includes live parameter sliders, preset scenarios, vector overlays, and an experimental data table.'
              : 'Mỗi mô phỏng đều có thanh chỉnh thông số trực tiếp, kịch bản mẫu nhanh, hiển thị vectơ và bảng ghi số liệu thực nghiệm.'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigate({ subject: 'physics', physicsView: 'catalog' })}
          className="font-bold text-blue-700 dark:text-sky-400 hover:underline cursor-pointer whitespace-nowrap"
        >
          {isEn ? 'Switch to Physics Lecture Library →' : 'Chuyển sang Thư viện Bài giảng Vật lí →'}
        </button>
      </div>
    </div>
  );
};
