import React from 'react';
import { AlgoId } from './types';

interface AlgoThumbPreviewProps {
  id: AlgoId;
  accentHex: string;
  secondaryHex: string;
  complexity: string;
}

export const ALGO_THEME_PALETTE: Record<
  AlgoId,
  { accent: string; secondary: string; codeTag: string }
> = {
  coord_hull: { accent: '#38bdf8', secondary: '#818cf8', codeTag: 'GEO-01' },
  coord_sweep: { accent: '#06b6d4', secondary: '#10b981', codeTag: 'GEO-02' },
  string_kmp: { accent: '#10b981', secondary: '#34d399', codeTag: 'STR-03' },
  string_palindrome: { accent: '#a855f7', secondary: '#ec4899', codeTag: 'STR-04' },
  array_prefix_kadane: { accent: '#f59e0b', secondary: '#fbbf24', codeTag: 'ARR-05' },
  array_two_pointers: { accent: '#22d3ee', secondary: '#6366f1', codeTag: 'ARR-06' },
  array_sort_stack: { accent: '#fb7185', secondary: '#f59e0b', codeTag: 'ARR-07' },
  binary_search: { accent: '#84cc16', secondary: '#10b981', codeTag: 'BSR-08' },
  matrix_grid: { accent: '#14b8a6', secondary: '#38bdf8', codeTag: 'MAT-09' },
  dp_knapsack: { accent: '#eab308', secondary: '#f97316', codeTag: 'DP-10' },
  dp_lis: { accent: '#818cf8', secondary: '#22d3ee', codeTag: 'DP-11' },
  dp_lcs: { accent: '#ec4899', secondary: '#8b5cf6', codeTag: 'DP-12' },
  graph_algo: { accent: '#06b6d4', secondary: '#3b82f6', codeTag: 'GRP-13' },
  tree_segtree: { accent: '#34d399', secondary: '#0ea5e9', codeTag: 'TRE-14' },
  backtrack_nqueens: { accent: '#f97316', secondary: '#f43f5e', codeTag: 'BTK-15' },
  number_sieve: { accent: '#c084fc', secondary: '#38bdf8', codeTag: 'NUM-16' }
};

export const AlgoThumbPreview: React.FC<AlgoThumbPreviewProps> = ({
  id,
  accentHex,
  secondaryHex,
  complexity
}) => {
  const renderDiagram = () => {
    switch (id) {
      case 'coord_hull':
        return (
          <g>
            {/* Outer hull animated laser perimeter */}
            <polygon
              points="72,112 108,34 210,28 248,86 196,126 112,124"
              fill={accentHex}
              fillOpacity="0.1"
              stroke={accentHex}
              strokeWidth="2.4"
              className="holo-dash"
            />
            {/* Interior vertices */}
            <circle cx="152" cy="78" r="3.5" fill="#94a3b8" />
            <circle cx="176" cy="64" r="3.5" fill="#94a3b8" />
            <circle cx="136" cy="94" r="3.5" fill="#94a3b8" />
            {/* Hull vertices */}
            {[
              [72, 112],
              [108, 34],
              [210, 28],
              [248, 86],
              [196, 126],
              [112, 124]
            ].map(([cx, cy], idx) => (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r="4.5"
                fill={idx % 2 === 0 ? accentHex : secondaryHex}
                className="algo-node-pulse"
                style={{ animationDelay: `${idx * 0.2}s` }}
              />
            ))}
          </g>
        );

      case 'coord_sweep':
        return (
          <g>
            <line x1="60" y1="112" x2="220" y2="38" stroke={accentHex} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="78" y1="36" x2="232" y2="110" stroke={secondaryHex} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="120" y1="122" x2="255" y2="62" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            {/* Vertical sweeping laser */}
            <g className="algo-sweep-x">
              <line x1="94" y1="18" x2="94" y2="132" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
              <circle cx="94" cy="44" r="4" fill="#fbbf24" />
            </g>
            {/* Intersection node */}
            <polygon points="150,66 157,73 150,80 143,73" fill="#fbbf24" className="algo-node-pulse" />
          </g>
        );

      case 'string_kmp':
        return (
          <g fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" textAnchor="middle">
            {/* Top text ribbon T */}
            {['A', 'B', 'A', 'B', 'C', 'A', 'B', 'A'].map((ch, idx) => {
              const x = 66 + idx * 27;
              const match = idx >= 2 && idx <= 5;
              return (
                <g key={idx}>
                  <rect
                    x={x - 11}
                    y="32"
                    width="22"
                    height="24"
                    rx="4"
                    fill={match ? accentHex : '#0f172a'}
                    fillOpacity={match ? 0.28 : 0.85}
                    stroke={match ? accentHex : '#334155'}
                    strokeWidth="1.4"
                  />
                  <text x={x} y="48" fill={match ? '#ecfdf5' : '#94a3b8'}>
                    {ch}
                  </text>
                </g>
              );
            })}
            {/* Sliding pattern tape P */}
            <g className="algo-window-slide">
              {['A', 'B', 'C', 'A'].map((ch, idx) => {
                const x = 92 + idx * 27;
                return (
                  <g key={idx}>
                    <rect
                      x={x - 11}
                      y="76"
                      width="22"
                      height="24"
                      rx="4"
                      fill={secondaryHex}
                      fillOpacity="0.24"
                      stroke={secondaryHex}
                      strokeWidth="1.4"
                    />
                    <text x={x} y="92" fill="#ffffff">
                      {ch}
                    </text>
                  </g>
                );
              })}
              {/* Failure link arc pi[j-1] */}
              <path
                d="M 173 102 Q 132 126 92 102"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.6"
                className="holo-dash"
              />
            </g>
          </g>
        );

      case 'string_palindrome':
        return (
          <g fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" textAnchor="middle">
            {['B', 'A', 'B', 'A', 'B', 'C', 'A'].map((ch, idx) => {
              const x = 79 + idx * 27;
              const isPal = idx >= 1 && idx <= 3;
              return (
                <g key={idx}>
                  <rect
                    x={x - 11}
                    y="56"
                    width="22"
                    height="26"
                    rx="5"
                    fill={isPal ? accentHex : '#0f172a'}
                    fillOpacity={isPal ? 0.3 : 0.85}
                    stroke={isPal ? accentHex : '#334155'}
                    strokeWidth="1.5"
                  />
                  <text x={x} y="73" fill="#f8fafc">
                    {ch}
                  </text>
                </g>
              );
            })}
            {/* Mirror arcs from center */}
            <path d="M 133 48 Q 106 24 79 48" fill="none" stroke={secondaryHex} strokeWidth="1.8" className="holo-dash" />
            <path d="M 133 48 Q 160 24 187 48" fill="none" stroke={secondaryHex} strokeWidth="1.8" className="holo-dash" />
            <circle cx="133" cy="96" r="5" fill={accentHex} className="algo-node-pulse" />
          </g>
        );

      case 'array_prefix_kadane':
        return (
          <g>
            {[36, 22, 66, 48, 28, 76, 54, 40].map((h, idx) => {
              const x = 66 + idx * 25;
              const active = idx >= 2 && idx <= 5;
              return (
                <rect
                  key={idx}
                  x={x}
                  y={114 - h}
                  width="17"
                  height={h}
                  rx="3"
                  fill={active ? accentHex : '#334155'}
                  fillOpacity={active ? 0.85 : 0.55}
                  className={active ? 'algo-bar-oscillate' : ''}
                  style={{ animationDelay: `${idx * 0.14}s` }}
                />
              );
            })}
            <polyline
              points="74,98 99,92 124,62 149,52 174,64 199,32 224,26 249,22"
              fill="none"
              stroke={secondaryHex}
              strokeWidth="2.2"
              className="holo-dash"
            />
          </g>
        );

      case 'array_two_pointers':
        return (
          <g fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" textAnchor="middle">
            {[3, 1, 2, 7, 4, 2, 1, 5].map((num, idx) => {
              const x = 65 + idx * 27;
              return (
                <g key={idx}>
                  <rect
                    x={x - 11}
                    y="62"
                    width="22"
                    height="24"
                    rx="4"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1.4"
                  />
                  <text x={x} y="78" fill="#e2e8f0">
                    {num}
                  </text>
                </g>
              );
            })}
            {/* Sliding window highlight bracket */}
            <g className="algo-window-slide">
              <rect
                x="78"
                y="55"
                width="86"
                height="38"
                rx="7"
                fill={accentHex}
                fillOpacity="0.16"
                stroke={accentHex}
                strokeWidth="2"
              />
              <text x="86" y="47" fill={accentHex}>L</text>
              <text x="156" y="47" fill={secondaryHex}>R</text>
            </g>
          </g>
        );

      case 'array_sort_stack':
        return (
          <g>
            {/* Sorting bars */}
            {[64, 34, 82, 48, 26, 70].map((h, idx) => (
              <rect
                key={idx}
                x={58 + idx * 20}
                y={116 - h}
                width="13"
                height={h}
                rx="3"
                fill={idx === 2 || idx === 4 ? accentHex : secondaryHex}
                fillOpacity={0.85}
                className="algo-bar-oscillate"
                style={{ animationDelay: `${idx * 0.16}s` }}
              />
            ))}
            {/* Monotonic Stack bucket on right */}
            <path d="M 205 34 L 205 116 L 265 116 L 265 34" fill="none" stroke="#64748b" strokeWidth="2" />
            {[94, 72, 50].map((y, idx) => (
              <rect
                key={idx}
                x="213"
                y={y}
                width="44"
                height="16"
                rx="3"
                fill={idx === 2 ? accentHex : secondaryHex}
                fillOpacity={0.78}
                className="algo-node-pulse"
                style={{ animationDelay: `${idx * 0.25}s` }}
              />
            ))}
          </g>
        );

      case 'binary_search':
        return (
          <g>
            {/* Monotonic curve f(mid) */}
            <path
              d="M 54 114 Q 130 105 170 68 T 268 28"
              fill="none"
              stroke={secondaryHex}
              strokeWidth="2.4"
            />
            {/* Halving vertical bounds */}
            <line x1="92" y1="24" x2="92" y2="122" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="236" y1="24" x2="236" y2="122" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="164" y1="22" x2="164" y2="124" stroke={accentHex} strokeWidth="2.4" className="holo-dash" />
            <circle cx="164" cy="70" r="10" fill="none" stroke={accentHex} strokeOpacity="0.45" strokeWidth="1.4" className="algo-node-pulse" />
            <circle cx="164" cy="70" r="5.5" fill={accentHex} className="algo-node-pulse" />
            <text x="164" y="136" fill={accentHex} fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" textAnchor="middle">
              mid = (lo+hi)/2
            </text>
          </g>
        );

      case 'matrix_grid':
        return (
          <g>
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 6 }).map((__, c) => {
                const isWall = (r === 1 && c === 2) || (r === 2 && c === 2) || (r === 1 && c === 4);
                const isPath =
                  (r === 0 && c === 0) ||
                  (r === 0 && c === 1) ||
                  (r === 0 && c === 2) ||
                  (r === 0 && c === 3) ||
                  (r === 1 && c === 3) ||
                  (r === 2 && c === 3) ||
                  (r === 3 && c === 3) ||
                  (r === 3 && c === 4) ||
                  (r === 3 && c === 5);
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={74 + c * 29}
                    y={26 + r * 24}
                    width="24"
                    height="20"
                    rx="4"
                    fill={isWall ? '#1e293b' : isPath ? accentHex : '#0f172a'}
                    fillOpacity={isWall ? 0.95 : isPath ? 0.45 : 0.8}
                    stroke={isPath ? accentHex : '#334155'}
                    strokeWidth={isPath ? 1.6 : 1}
                    className={isPath ? 'algo-node-pulse' : ''}
                    style={{ animationDelay: `${(r + c) * 0.12}s` }}
                  />
                );
              })
            )}
          </g>
        );

      case 'dp_knapsack':
        return (
          <g>
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 5 }).map((__, c) => {
                const active = (r === 2 && c === 1) || (r === 3 && c === 4) || (r === 1 && c === 1);
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={80 + c * 33}
                    y={26 + r * 24}
                    width="28"
                    height="19"
                    rx="4"
                    fill={active ? accentHex : '#0f172a'}
                    fillOpacity={active ? 0.42 : 0.85}
                    stroke={active ? accentHex : '#334155'}
                    strokeWidth="1.4"
                  />
                );
              })
            )}
            <path d="M 128 60 L 224 106" stroke={secondaryHex} strokeWidth="2.2" className="holo-dash" />
            <circle cx="226" cy="107" r="5" fill={accentHex} className="algo-node-pulse" />
          </g>
        );

      case 'dp_lis':
        return (
          <g>
            {[
              [64, 108],
              [100, 96],
              [136, 76],
              [172, 86],
              [208, 56],
              [248, 34]
            ].map(([x, y], idx) => (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r={idx === 3 ? 4 : 5.5}
                fill={idx === 3 ? '#64748b' : accentHex}
                className={idx !== 3 ? 'algo-node-pulse' : ''}
                style={{ animationDelay: `${idx * 0.16}s` }}
              />
            ))}
            <path
              d="M 64 108 Q 82 88 100 96 Q 118 70 136 76 Q 172 48 208 56 Q 228 32 248 34"
              fill="none"
              stroke={secondaryHex}
              strokeWidth="2.4"
              className="holo-dash"
            />
          </g>
        );

      case 'dp_lcs':
        return (
          <g>
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 4 }).map((__, c) => {
                const diag = r === c;
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={92 + c * 34}
                    y={24 + r * 25}
                    width="28"
                    height="20"
                    rx="4"
                    fill={diag ? accentHex : '#0f172a'}
                    fillOpacity={diag ? 0.35 : 0.85}
                    stroke={diag ? accentHex : '#334155'}
                    strokeWidth="1.4"
                  />
                );
              })
            )}
            <line x1="106" y1="34" x2="208" y2="109" stroke={secondaryHex} strokeWidth="2.4" className="holo-dash" />
          </g>
        );

      case 'graph_algo':
        return (
          <g>
            {/* Graph edges */}
            <line x1="72" y1="74" x2="132" y2="38" stroke="#475569" strokeWidth="1.8" />
            <line x1="72" y1="74" x2="132" y2="110" stroke={accentHex} strokeWidth="2.8" className="holo-dash" />
            <line x1="132" y1="110" x2="196" y2="106" stroke={accentHex} strokeWidth="2.8" className="holo-dash" />
            <line x1="132" y1="38" x2="196" y2="42" stroke="#475569" strokeWidth="1.8" />
            <line x1="132" y1="38" x2="196" y2="106" stroke="#475569" strokeWidth="1.8" />
            <line x1="196" y1="42" x2="252" y2="74" stroke="#475569" strokeWidth="1.8" />
            <line x1="196" y1="106" x2="252" y2="74" stroke={accentHex} strokeWidth="2.8" className="holo-dash" />
            {/* Vertices */}
            {[
              [72, 74, true],
              [132, 38, false],
              [132, 110, true],
              [196, 42, false],
              [196, 106, true],
              [252, 74, true]
            ].map(([cx, cy, active], idx) => (
              <circle
                key={idx}
                cx={cx as number}
                cy={cy as number}
                r={active ? 7 : 5.5}
                fill={active ? accentHex : '#1e293b'}
                stroke={active ? '#ffffff' : secondaryHex}
                strokeWidth="1.8"
                className={active ? 'algo-node-pulse' : ''}
                style={{ animationDelay: `${idx * 0.18}s` }}
              />
            ))}
          </g>
        );

      case 'tree_segtree':
        return (
          <g>
            {/* Tree edges */}
            <line x1="160" y1="32" x2="106" y2="66" stroke={accentHex} strokeWidth="2" />
            <line x1="160" y1="32" x2="214" y2="66" stroke={secondaryHex} strokeWidth="2" />
            <line x1="106" y1="66" x2="78" y2="106" stroke="#475569" strokeWidth="1.6" />
            <line x1="106" y1="66" x2="134" y2="106" stroke={accentHex} strokeWidth="2" className="holo-dash" />
            <line x1="214" y1="66" x2="186" y2="106" stroke={secondaryHex} strokeWidth="2" className="holo-dash" />
            <line x1="214" y1="66" x2="242" y2="106" stroke="#475569" strokeWidth="1.6" />
            {/* Nodes */}
            {[
              [160, 32, true],
              [106, 66, true],
              [214, 66, true],
              [78, 106, false],
              [134, 106, true],
              [186, 106, true],
              [242, 106, false]
            ].map(([cx, cy, active], idx) => (
              <circle
                key={idx}
                cx={cx as number}
                cy={cy as number}
                r={active ? 7 : 5.5}
                fill={active ? accentHex : '#1e293b'}
                stroke="#ffffff"
                strokeWidth="1.4"
                className={active ? 'algo-node-pulse' : ''}
                style={{ animationDelay: `${idx * 0.15}s` }}
              />
            ))}
          </g>
        );

      case 'backtrack_nqueens':
        return (
          <g>
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 4 }).map((__, c) => {
                const isDark = (r + c) % 2 === 1;
                const hasQueen =
                  (r === 0 && c === 1) ||
                  (r === 1 && c === 3) ||
                  (r === 2 && c === 0) ||
                  (r === 3 && c === 2);
                return (
                  <g key={`${r}-${c}`}>
                    <rect
                      x={108 + c * 26}
                      y={22 + r * 26}
                      width="24"
                      height="24"
                      rx="3"
                      fill={hasQueen ? accentHex : isDark ? '#0f172a' : '#1e293b'}
                      fillOpacity={hasQueen ? 0.35 : 0.9}
                      stroke={hasQueen ? accentHex : '#334155'}
                      strokeWidth="1.2"
                    />
                    {hasQueen && (
                      <circle
                        cx={120 + c * 26}
                        cy={34 + r * 26}
                        r="5.5"
                        fill={secondaryHex}
                        className="algo-node-pulse"
                      />
                    )}
                  </g>
                );
              })
            )}
          </g>
        );

      case 'number_sieve':
        return (
          <g fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="700" textAnchor="middle">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num, idx) => {
              const col = idx % 6;
              const row = Math.floor(idx / 6);
              const x = 80 + col * 32;
              const y = 44 + row * 38;
              const isPrime = [2, 3, 5, 7, 11, 13].includes(num);
              return (
                <g key={num}>
                  <rect
                    x={x - 12}
                    y={y - 12}
                    width="24"
                    height="24"
                    rx="5"
                    fill={isPrime ? accentHex : '#0f172a'}
                    fillOpacity={isPrime ? 0.3 : 0.85}
                    stroke={isPrime ? accentHex : '#334155'}
                    strokeWidth="1.3"
                    className={isPrime ? 'algo-node-pulse' : ''}
                    style={{ animationDelay: `${idx * 0.12}s` }}
                  />
                  <text x={x} y={y + 3.5} fill={isPrime ? '#ffffff' : '#64748b'}>
                    {num}
                  </text>
                </g>
              );
            })}
          </g>
        );
    }
  };

  const tag = ALGO_THEME_PALETTE[id].codeTag;

  return (
    <div className="relative h-40 w-full overflow-hidden bg-[#040b18] border-b border-cyan-500/20">
      {/* Cyber Circuit Matrix Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${accentHex}29 0%, transparent 65%), linear-gradient(to right, rgba(56,189,248,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.09) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 20px 20px, 20px 20px'
        }}
      />

      {/* Binary / Hex Micro-stream along left edge */}
      <div
        aria-hidden="true"
        className="algo-data-stream pointer-events-none absolute left-3 top-5 font-mono text-[9px] leading-3 text-emerald-400/50 select-none"
      >
        <div>0101</div>
        <div>1011</div>
        <div>0xAF</div>
        <div>1100</div>
      </div>

      {/* Sweeping Terminal Scan Beam */}
      <div
        aria-hidden="true"
        className="holo-scan-beam pointer-events-none absolute inset-x-0 h-12"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${accentHex}24 50%, transparent 100%)`
        }}
      />

      {/* Animated Algorithm SVG Diagram */}
      <svg
        viewBox="0 0 320 148"
        className="relative z-10 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <filter id="algo-thumb-glow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#algo-thumb-glow)">{renderDiagram()}</g>
      </svg>

      {/* Crisp 4-Corner Terminal Reticles */}
      <span className="pointer-events-none absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400/75 rounded-tl-xs" />
      <span className="pointer-events-none absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400/75 rounded-tr-xs" />
      <span className="pointer-events-none absolute bottom-7 left-2.5 w-2.5 h-2.5 border-b border-l border-emerald-400/45 rounded-bl-xs" />
      <span className="pointer-events-none absolute bottom-7 right-2.5 w-2.5 h-2.5 border-b border-r border-cyan-400/45 rounded-br-xs" />

      {/* Quiet Terminal Telemetry Corners (Unboxed monospace metadata) */}
      <div className="pointer-events-none absolute bottom-2 left-3.5 right-3.5 flex items-center justify-between font-mono text-[10px]">
        <span className="text-emerald-300/90 font-bold tracking-wider">{tag}</span>
        <span className="text-cyan-300 font-bold tabular-nums">{complexity}</span>
      </div>
    </div>
  );
};
