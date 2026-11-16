import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Atom,
  BookOpen,
  Box,
  Compass,
  Layers,
  Play,
  Sliders,
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

type GradeFilter = 'all' | 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12';
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

  const total2DCount = Object.keys(PHYSICS_2D_SIMS).length;
  const total3DCount = Object.keys(PHYSICS_3D_SIMS).length;

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
    const chosen = simId || sims[0]?.id || 'spring_3d';
    navigate({
      subject: 'physics',
      physicsView: 'sim3d_hub',
      physicsDomain: domainId,
      physicsSim3D: chosen
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const domainRows = useMemo(() => {
    return PHYSICS_DOMAINS.map((dom) => {
      const all2d = get2DSimsByDomain(dom.id);
      const all3d = get3DSimsByDomain(dom.id);
      const sims2d =
        gradeFilter === 'all' ? all2d : all2d.filter((s) => s.grades.includes(gradeFilter));
      const sims3d =
        gradeFilter === 'all' ? all3d : all3d.filter((s) => s.grades.includes(gradeFilter));
      return {
        dom,
        sims2d,
        sims3d,
        totalMatches:
          (dimFilter === '3d' ? 0 : sims2d.length) + (dimFilter === '2d' ? 0 : sims3d.length)
      };
    }).filter((row) => row.totalMatches > 0 || gradeFilter === 'all');
  }, [gradeFilter, dimFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Command Banner */}
      <section className="sci-frame rounded-lg bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={onBack || goBack}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isEn ? 'Back' : 'Quay lại'}</span>
              </button>
              <span className="font-mono font-bold text-blue-700 dark:text-sky-400 uppercase tracking-wider">
                {isEn ? 'PHET-STYLE PHYSICS LABS · GRADES 9–12' : 'PHÒNG THÍ NGHIỆM VẬT LÍ TÁCH RIÊNG · LỚP 9–12'}
              </span>
            </div>

            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isEn
                ? 'Interactive 2D & 3D Physics Simulations by Domain'
                : 'Trang Mô Phỏng Vật Lí 2D & 3D Theo 5 Lĩnh Vực'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              {isEn
                ? `Explore ${total2DCount} 2D real-time labs and ${total3DCount} interactive 3D WebGL experiments across Mechanics, Waves, Electromagnetism, Optics, and Nuclear Physics.`
                : `Tổng hợp ${total2DCount} phòng thí nghiệm 2D và ${total3DCount} mô hình 3D tương tác theo 5 phân môn độc lập — đầy đủ thanh trượt thông số, đồ thị thời gian thực và bảng ghi số liệu thực hành.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate({ subject: 'physics', physicsView: 'catalog' })}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>{isEn ? 'Open Physics Lectures' : 'Mở Bài giảng Vật lí'}</span>
            </button>
            <button
              type="button"
              onClick={() => openDomain2D('mechanics')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-4 h-4" />
              <span>{isEn ? `All 2D (${total2DCount})` : `Phòng 2D (${total2DCount})`}</span>
            </button>
            <button
              type="button"
              onClick={() => openDomain3D('mechanics')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Box className="w-4 h-4" />
              <span>{isEn ? `All 3D (${total3DCount})` : `Phòng 3D (${total3DCount})`}</span>
            </button>
          </div>
        </div>

        {/* Grade & Dimension Filter Bar */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" />
              {isEn ? 'Grade:' : 'Khối lớp:'}
            </span>
            {(['all', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'] as GradeFilter[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGradeFilter(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  gradeFilter === g
                    ? 'bg-slate-900 dark:bg-sky-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {g === 'all' ? (isEn ? 'All Grades' : 'Tất cả (9–12)') : g}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {(
              [
                { id: 'all', label: isEn ? '2D + 3D' : 'Cả 2D & 3D' },
                { id: '2d', label: isEn ? '2D Only' : 'Chỉ 2D' },
                { id: '3d', label: isEn ? '3D Only' : 'Chỉ 3D' }
              ] as { id: DimFilter; label: string }[]
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setDimFilter(f.id)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  dimFilter === f.id
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

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
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50/90 dark:bg-blue-950/40 hover:bg-blue-600 hover:text-white border border-blue-200/80 dark:border-blue-800/60 text-[11px] font-semibold text-blue-800 dark:text-sky-200 transition-colors cursor-pointer"
                          title={sim.subtitle}
                        >
                          <Play className="w-2.5 h-2.5 shrink-0" />
                          <span>{sim.title}</span>
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
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50/90 dark:bg-amber-950/35 hover:bg-amber-500 hover:text-slate-950 border border-amber-200/80 dark:border-amber-800/60 text-[11px] font-semibold text-amber-800 dark:text-amber-200 transition-colors cursor-pointer"
                          title={sim.subtitle}
                        >
                          <Box className="w-2.5 h-2.5 shrink-0" />
                          <span>{sim.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Domain Action Footer (2D / 3D Square Launch Buttons) */}
            <div className="px-5 pb-5 pt-2 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => openDomain2D(dom.id, sims2d[0]?.id)}
                disabled={sims2d.length === 0}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>2D ({sims2d.length})</span>
              </button>
              <button
                type="button"
                onClick={() => openDomain3D(dom.id, sims3d[0]?.id)}
                disabled={sims3d.length === 0}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded text-xs font-semibold bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Box className="w-3.5 h-3.5 shrink-0" />
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
