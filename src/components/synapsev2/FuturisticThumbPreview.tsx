import React from 'react';
import { MonumentId } from './synapseCatalog';

interface FuturisticThumbPreviewProps {
  id: MonumentId;
  accentHex: string;
  secondaryHex: string;
}

export const FuturisticThumbPreview: React.FC<FuturisticThumbPreviewProps> = ({
  id,
  accentHex,
  secondaryHex
}) => {
  const renderArtwork = () => {
    switch (id) {
      case 'dyson':
        return (
          <g>
            <circle cx="160" cy="76" r="54" fill="none" stroke={accentHex} strokeOpacity="0.28" strokeDasharray="4 6" className="holo-orbit-cw" />
            <ellipse cx="160" cy="76" rx="68" ry="22" fill="none" stroke={secondaryHex} strokeWidth="2" className="holo-orbit-ccw" />
            <ellipse cx="160" cy="76" rx="48" ry="16" transform="rotate(32 160 76)" fill="none" stroke={accentHex} strokeWidth="1.6" className="holo-dash" />
            <ellipse cx="160" cy="76" rx="48" ry="16" transform="rotate(-32 160 76)" fill="none" stroke="#f59e0b" strokeWidth="1.4" strokeOpacity="0.85" />
            <line x1="160" y1="8" x2="160" y2="144" stroke={accentHex} strokeWidth="1.8" strokeOpacity="0.5" className="holo-dash" />
            <circle cx="160" cy="76" r="14" fill="#020617" stroke="#fbbf24" strokeWidth="2.5" className="holo-ring-pulse" />
            <circle cx="160" cy="76" r="7" fill="#000000" />
          </g>
        );
      case 'tokamak':
        return (
          <g>
            <ellipse cx="160" cy="76" rx="62" ry="30" fill="none" stroke="#f59e0b" strokeWidth="8" strokeOpacity="0.25" className="holo-ring-pulse" />
            <ellipse cx="160" cy="76" rx="62" ry="30" fill="none" stroke="#fbbf24" strokeWidth="2.2" className="holo-dash" />
            <ellipse cx="160" cy="76" rx="34" ry="14" fill="none" stroke="#f97316" strokeWidth="2" className="holo-orbit-cw" />
            <g className="holo-orbit-cw">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <rect
                  key={deg}
                  x="156"
                  y="32"
                  width="8"
                  height="18"
                  rx="3"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  transform={`rotate(${deg} 160 76)`}
                />
              ))}
            </g>
            <circle cx="160" cy="76" r="10" fill="#fb923c" fillOpacity="0.6" className="holo-ring-pulse" />
          </g>
        );
      case 'tesseract':
        return (
          <g className="holo-float">
            <rect x="116" y="32" width="88" height="88" rx="4" fill="none" stroke={accentHex} strokeWidth="2" className="holo-orbit-cw" />
            <rect x="136" y="52" width="48" height="48" rx="3" fill="none" stroke={secondaryHex} strokeWidth="2" className="holo-orbit-ccw" />
            <line x1="116" y1="32" x2="136" y2="52" stroke="#e879f9" strokeWidth="1.5" className="holo-dash" />
            <line x1="204" y1="32" x2="184" y2="52" stroke="#e879f9" strokeWidth="1.5" className="holo-dash" />
            <line x1="116" y1="120" x2="136" y2="100" stroke="#e879f9" strokeWidth="1.5" className="holo-dash" />
            <line x1="204" y1="120" x2="184" y2="100" stroke="#e879f9" strokeWidth="1.5" className="holo-dash" />
            <circle cx="160" cy="76" r="6" fill="#f0abfc" className="holo-ring-pulse" />
          </g>
        );
      case 'neural_aero':
        return (
          <g>
            {[0, 1, 2].map((r) => (
              <path
                key={r}
                d={`M 36 ${50 + r * 26} Q 160 ${24 + r * 32} 284 ${50 + r * 26}`}
                fill="none"
                stroke={r === 1 ? secondaryHex : accentHex}
                strokeWidth="1.8"
                className="holo-dash"
              />
            ))}
            <g className="holo-float">
              <polygon points="108,76 178,56 212,76 178,96" fill={accentHex} fillOpacity="0.22" stroke={accentHex} strokeWidth="2" />
              <circle cx="122" cy="76" r="5" fill="#34d399" className="holo-ring-pulse" />
              <circle cx="160" cy="76" r="6" fill="#22d3ee" />
              <circle cx="196" cy="76" r="5" fill="#34d399" className="holo-ring-pulse" />
            </g>
          </g>
        );
      case 'quantum_cryostat':
        return (
          <g>
            <g className="holo-float">
              {[28, 46, 64, 82].map((y, idx) => (
                <ellipse
                  key={y}
                  cx="160"
                  cy={y}
                  rx={46 - idx * 7}
                  ry="8"
                  fill="#eab308"
                  fillOpacity="0.18"
                  stroke="#facc15"
                  strokeWidth="1.8"
                />
              ))}
              <line x1="126" y1="28" x2="142" y2="82" stroke="#f59e0b" strokeWidth="1.4" />
              <line x1="194" y1="28" x2="178" y2="82" stroke="#f59e0b" strokeWidth="1.4" />
            </g>
            <circle cx="160" cy="112" r="22" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="3 4" className="holo-orbit-cw" />
            <line x1="160" y1="112" x2="174" y2="96" stroke="#22d3ee" strokeWidth="2.4" />
            <circle cx="174" cy="96" r="3.5" fill="#67e8f9" className="holo-ring-pulse" />
          </g>
        );
      case 'gravitational_ligo':
        return (
          <g>
            <circle cx="160" cy="76" r="56" fill="none" stroke={accentHex} strokeWidth="1.4" strokeOpacity="0.4" className="holo-ring-pulse" />
            <circle cx="160" cy="76" r="38" fill="none" stroke={secondaryHex} strokeWidth="1.6" strokeOpacity="0.65" className="holo-ring-pulse" />
            <line x1="76" y1="118" x2="160" y2="118" stroke="#f43f5e" strokeWidth="2.2" className="holo-dash" />
            <line x1="160" y1="118" x2="160" y2="34" stroke="#f43f5e" strokeWidth="2.2" className="holo-dash" />
            <g className="holo-orbit-cw">
              <circle cx="144" cy="76" r="7" fill="#22d3ee" />
              <circle cx="176" cy="76" r="7" fill="#c084fc" />
            </g>
          </g>
        );
      case 'space_elevator':
        return (
          <g>
            <circle cx="160" cy="126" r="46" fill="#0284c7" fillOpacity="0.28" stroke={accentHex} strokeWidth="2" />
            <line x1="160" y1="16" x2="160" y2="96" stroke="#94a3b8" strokeWidth="2.5" className="holo-dash" />
            <g className="holo-float">
              <rect x="142" y="54" width="36" height="14" rx="5" fill="#10b981" fillOpacity="0.3" stroke="#34d399" strokeWidth="1.8" />
            </g>
            <ellipse cx="160" cy="22" rx="44" ry="10" fill="none" stroke="#38bdf8" strokeWidth="1.8" className="holo-orbit-cw" />
          </g>
        );
      case 'warp_alcubierre':
        return (
          <g>
            <ellipse cx="160" cy="76" rx="74" ry="42" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5 5" className="holo-dash" />
            <ellipse cx="142" cy="76" rx="18" ry="44" fill="none" stroke="#6366f1" strokeWidth="3" className="holo-ring-pulse" />
            <ellipse cx="182" cy="76" rx="18" ry="44" fill="none" stroke="#38bdf8" strokeWidth="3" className="holo-ring-pulse" />
            <polygon points="104,76 202,68 218,76 202,84" fill="#e2e8f0" fillOpacity="0.85" className="holo-float" />
          </g>
        );
      case 'hyperbolic_calabi':
        return (
          <g>
            <circle cx="160" cy="76" r="56" fill="none" stroke="#a855f7" strokeWidth="1.4" strokeOpacity="0.45" />
            <g className="holo-orbit-cw">
              {[0, 36, 72, 108, 144].map((deg) => (
                <ellipse
                  key={deg}
                  cx="160"
                  cy="76"
                  rx="48"
                  ry="18"
                  transform={`rotate(${deg} 160 76)`}
                  fill="none"
                  stroke={deg % 72 === 0 ? '#ec4899' : '#c084fc'}
                  strokeWidth="1.7"
                />
              ))}
            </g>
            <circle cx="160" cy="76" r="8" fill="#f472b6" className="holo-ring-pulse" />
          </g>
        );
      case 'dna_nanobot':
        return (
          <g>
            <path d="M 60 54 Q 110 20 160 76 T 260 54" fill="none" stroke="#14b8a6" strokeWidth="2.8" className="holo-dash" />
            <path d="M 60 98 Q 110 132 160 76 T 260 98" fill="none" stroke="#f43f5e" strokeWidth="2.8" className="holo-dash" />
            {[85, 118, 160, 202, 235].map((x) => (
              <line key={x} x1={x} y1="54" x2={x} y2="98" stroke="#38bdf8" strokeWidth="1.8" strokeOpacity="0.7" />
            ))}
            <circle cx="160" cy="40" r="9" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" className="holo-float" />
          </g>
        );
      case 'penning_antimatter':
        return (
          <g>
            <path d="M 96 36 Q 160 66 224 36" fill="none" stroke="#f59e0b" strokeWidth="3.2" />
            <path d="M 96 116 Q 160 86 224 116" fill="none" stroke="#f59e0b" strokeWidth="3.2" />
            <ellipse cx="160" cy="76" rx="52" ry="18" fill="none" stroke="#38bdf8" strokeWidth="2" className="holo-orbit-cw" />
            <circle cx="160" cy="76" r="14" fill="#f43f5e" fillOpacity="0.45" stroke="#fb7185" strokeWidth="2" className="holo-ring-pulse" />
            <circle cx="160" cy="76" r="5" fill="#ffffff" />
          </g>
        );
      case 'fractal_attractor':
        return (
          <g className="holo-float">
            <path
              d="M 160 76 C 110 22, 62 66, 118 112 C 154 138, 168 42, 208 42 C 254 42, 246 118, 198 106 C 174 100, 168 84, 160 76 Z"
              fill="none"
              stroke="#fb923c"
              strokeWidth="2.4"
              className="holo-dash"
            />
            <path
              d="M 160 76 C 122 36, 82 70, 126 102 C 152 122, 168 54, 198 54 C 234 54, 228 104, 192 94"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.8"
            />
            <circle cx="118" cy="74" r="4" fill="#fb923c" className="holo-ring-pulse" />
            <circle cx="204" cy="74" r="4" fill="#38bdf8" className="holo-ring-pulse" />
          </g>
        );
      case 'james_webb':
        return (
          <g className="holo-float">
            <polygon points="102,118 160,104 218,118 160,134" fill="#38bdf8" fillOpacity="0.18" stroke="#94a3b8" strokeWidth="1.8" />
            <g className="holo-ring-pulse">
              {[
                [160, 56], [140, 68], [180, 68],
                [140, 90], [180, 90], [160, 100]
              ].map(([cx, cy], idx) => (
                <polygon
                  key={idx}
                  points={`${cx},${cy - 10} ${cx + 9},${cy - 5} ${cx + 9},${cy + 5} ${cx},${cy + 10} ${cx - 9},${cy + 5} ${cx - 9},${cy - 5}`}
                  fill="#fbbf24"
                  fillOpacity="0.34"
                  stroke="#fbbf24"
                  strokeWidth="1.6"
                />
              ))}
            </g>
            <line x1="160" y1="78" x2="218" y2="54" stroke="#38bdf8" strokeWidth="1.8" className="holo-dash" />
            <circle cx="218" cy="54" r="4" fill="#fbbf24" />
          </g>
        );
      case 'wormhole_morris':
        return (
          <g>
            <path d="M 76 32 Q 160 66 244 32" fill="none" stroke="#818cf8" strokeWidth="2" />
            <path d="M 76 120 Q 160 86 244 120" fill="none" stroke="#f472b6" strokeWidth="2" />
            <path d="M 118 48 Q 160 76 118 104" fill="none" stroke="#38bdf8" strokeWidth="1.6" className="holo-dash" />
            <path d="M 202 48 Q 160 76 202 104" fill="none" stroke="#38bdf8" strokeWidth="1.6" className="holo-dash" />
            <ellipse cx="160" cy="76" rx="22" ry="16" fill="#f472b6" fillOpacity="0.22" stroke="#f472b6" strokeWidth="2.2" className="holo-ring-pulse" />
            <circle cx="160" cy="76" r="8" fill="#38bdf8" />
          </g>
        );
      case 'pulsar_magnetar':
        return (
          <g>
            <ellipse cx="122" cy="76" rx="34" ry="44" fill="none" stroke="#c084fc" strokeWidth="1.8" className="holo-dash" />
            <ellipse cx="198" cy="76" rx="34" ry="44" fill="none" stroke="#c084fc" strokeWidth="1.8" className="holo-dash" />
            <line x1="160" y1="16" x2="188" y2="62" stroke="#22d3ee" strokeWidth="3" strokeOpacity="0.7" />
            <line x1="132" y1="90" x2="160" y2="136" stroke="#22d3ee" strokeWidth="3" strokeOpacity="0.7" />
            <circle cx="160" cy="76" r="14" fill="#22d3ee" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="2.4" className="holo-ring-pulse" />
            <circle cx="160" cy="76" r="6" fill="#ffffff" />
          </g>
        );
      case 'oort_solar_sail':
        return (
          <g>
            <polygon points="160,24 218,54 160,96 102,54" fill="#34d399" fillOpacity="0.24" stroke="#34d399" strokeWidth="2.2" className="holo-float" />
            <line x1="126" y1="132" x2="146" y2="78" stroke="#f59e0b" strokeWidth="2" className="holo-dash" />
            <line x1="160" y1="132" x2="160" y2="86" stroke="#fef08a" strokeWidth="2.4" className="holo-dash" />
            <line x1="194" y1="132" x2="174" y2="78" stroke="#f59e0b" strokeWidth="2" className="holo-dash" />
            <ellipse cx="160" cy="132" rx="44" ry="10" fill="none" stroke="#38bdf8" strokeWidth="1.8" />
          </g>
        );
      case 'supercomputer_torus':
        return (
          <g className="holo-float">
            <rect x="116" y="36" width="88" height="80" rx="8" fill="none" stroke="#06b6d4" strokeWidth="1.6" strokeDasharray="4 4" />
            {[132, 160, 188].map((x) =>
              [52, 76, 100].map((y) => (
                <rect key={`${x}-${y}`} x={x - 7} y={y - 7} width="14" height="14" rx="2.5" fill="#0ea5e9" fillOpacity="0.28" stroke="#38bdf8" strokeWidth="1.5" />
              ))
            )}
            <circle cx="160" cy="76" r="10" fill="#fbbf24" className="holo-ring-pulse" />
          </g>
        );
      case 'cpu_pipeline_core':
        return (
          <g>
            {[36, 56, 76, 96, 116].map((y, idx) => (
              <ellipse
                key={y}
                cx="160"
                cy={y}
                rx={24 + idx * 11}
                ry="8"
                fill="#10b981"
                fillOpacity="0.14"
                stroke={idx % 2 === 0 ? '#10b981' : '#fbbf24'}
                strokeWidth="1.9"
                className="holo-float"
              />
            ))}
            <line x1="160" y1="26" x2="160" y2="128" stroke="#fbbf24" strokeWidth="2.6" className="holo-dash" />
          </g>
        );
      case 'blockchain_zk_lattice':
        return (
          <g>
            <polygon points="160,26 112,118 208,118" fill="none" stroke="#a855f7" strokeWidth="1.8" />
            <line x1="160" y1="26" x2="160" y2="118" stroke="#22d3ee" strokeWidth="1.8" className="holo-dash" />
            <circle cx="160" cy="28" r="8" fill="#fbbf24" className="holo-ring-pulse" />
            <circle cx="136" cy="74" r="6" fill="#22d3ee" />
            <circle cx="184" cy="74" r="6" fill="#22d3ee" />
            <rect x="104" y="110" width="16" height="16" rx="2" fill="#a855f7" />
            <rect x="152" y="110" width="16" height="16" rx="2" fill="#a855f7" />
            <rect x="200" y="110" width="16" height="16" rx="2" fill="#a855f7" />
          </g>
        );
      case 'graph_dijkstra_citadel':
        return (
          <g>
            <polyline points="82,110 124,54 168,94 212,42 246,84" fill="none" stroke="#fbbf24" strokeWidth="2.6" className="holo-dash" />
            <line x1="82" y1="110" x2="168" y2="94" stroke="#38bdf8" strokeWidth="1.4" strokeOpacity="0.6" />
            <line x1="124" y1="54" x2="212" y2="42" stroke="#38bdf8" strokeWidth="1.4" strokeOpacity="0.6" />
            {[
              [82, 110], [124, 54], [168, 94], [212, 42], [246, 84]
            ].map(([cx, cy], idx) => (
              <circle key={idx} cx={cx} cy={cy} r={idx === 0 || idx === 3 ? 7 : 5} fill={idx === 0 || idx === 3 ? '#f43f5e' : '#38bdf8'} className="holo-ring-pulse" />
            ))}
          </g>
        );
    }
  };

  return (
    <div
      className="relative h-48 w-full overflow-hidden rounded-t-[1.35rem] border-b border-cyan-400/20"
      style={{
        background: `radial-gradient(circle at 50% 48%, ${accentHex}38 0%, ${secondaryHex}24 38%, #071230 82%, #050b20 100%)`
      }}
    >
      {/* Perspective Cyber Blueprint Grid + Horizon Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage: `linear-gradient(180deg, transparent 55%, ${accentHex}22 100%), linear-gradient(to right, rgba(56,189,248,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.14) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 22px 22px, 22px 22px'
        }}
      />

      {/* Rotating Holographic Radar Sweep Sector */}
      <div
        aria-hidden="true"
        className="holo-radar-sweep pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full opacity-35"
        style={{
          background: `conic-gradient(from 0deg, ${accentHex}66 0deg, ${accentHex}18 36deg, transparent 78deg, transparent 360deg)`
        }}
      />

      {/* Outer Astrolabe Calibration Ring */}
      <div
        aria-hidden="true"
        className="holo-orbit-ccw pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-dashed border-cyan-300/25"
      />

      {/* Sweeping Holographic Laser Scanner Beam */}
      <div
        aria-hidden="true"
        className="holo-scan-beam pointer-events-none absolute inset-x-0 h-16"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${accentHex}55 50%, transparent 100%)`
        }}
      />

      {/* Live Animated Vector Schematic with Neon Bloom */}
      <svg
        viewBox="0 0 320 152"
        className="relative z-10 w-full h-full drop-shadow-[0_0_10px_rgba(56,189,248,0.45)]"
        aria-hidden="true"
      >
        {renderArtwork()}
      </svg>

      {/* HUD Corner Reticles */}
      <span className="pointer-events-none absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-cyan-300/80 rounded-tl-sm" />
      <span className="pointer-events-none absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-cyan-300/80 rounded-tr-sm" />
      <span className="pointer-events-none absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-cyan-300/80 rounded-bl-sm" />
      <span className="pointer-events-none absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-cyan-300/80 rounded-br-sm" />

      {/* Top HUD Micro-Readout */}
      <div className="pointer-events-none absolute top-2.5 left-5 right-5 flex items-center justify-between text-[10px] font-mono font-bold text-cyan-200/90">
        <span className="inline-flex items-center gap-1.5 tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          WEBGL · PBR 60FPS
        </span>
        <span className="tracking-wider text-sky-200/90">QUANTUM HUD</span>
      </div>
    </div>
  );
};
