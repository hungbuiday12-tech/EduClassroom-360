import React from 'react';
import { FutureLabTabId } from '../../types';

interface PreStudioDiagramPreviewProps {
  id: FutureLabTabId;
  accentHex: string;
  secondaryHex: string;
  isEn?: boolean;
}

export const PreStudioDiagramPreview: React.FC<PreStudioDiagramPreviewProps> = ({
  id,
  accentHex,
  secondaryHex,
  isEn = false
}) => {
  const renderSchematic = () => {
    switch (id) {
      case 'rocket_launch_3d':
        return (
          <g>
            {/* Launch Pad & Umbilical Tower */}
            <line x1="34" y1="132" x2="286" y2="132" stroke="#475569" strokeWidth="1.6" />
            <rect x="44" y="54" width="14" height="78" fill="none" stroke="#94a3b8" strokeWidth="1.4" />
            <line x1="44" y1="74" x2="58" y2="90" stroke="#94a3b8" strokeWidth="1" />
            <line x1="44" y1="92" x2="58" y2="108" stroke="#94a3b8" strokeWidth="1" />
            <line x1="58" y1="68" x2="76" y2="68" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />

            {/* Multi-stage Rocket Cutaway */}
            <g className="holo-float">
              {/* Fairing + Nose */}
              <path d="M 88 26 L 96 42 L 80 42 Z" fill={accentHex} fillOpacity="0.28" stroke={accentHex} strokeWidth="1.8" />
              {/* Stage 2 */}
              <rect x="80" y="42" width="16" height="24" fill="#0f172a" stroke="#e2e8f0" strokeWidth="1.4" />
              <line x1="80" y1="54" x2="96" y2="54" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="2 2" />
              {/* Interstage */}
              <rect x="80" y="66" width="16" height="5" fill="#fbbf24" fillOpacity="0.7" />
              {/* Stage 1 Booster */}
              <rect x="79" y="71" width="18" height="40" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" />
              <rect x="82" y="76" width="12" height="14" rx="2" fill="#38bdf8" fillOpacity="0.32" />
              <rect x="82" y="93" width="12" height="13" rx="2" fill="#f97316" fillOpacity="0.35" />
              {/* Nozzles + Plume */}
              <polygon points="81,111 95,111 98,117 78,117" fill="#64748b" />
              <polygon points="81,117 95,117 88,131" fill="#f59e0b" fillOpacity="0.85" className="holo-ring-pulse" />
            </g>

            {/* Gravity Turn Orbital Trajectory */}
            <path
              d="M 88 42 Q 112 22, 184 36 T 280 86"
              fill="none"
              stroke={secondaryHex}
              strokeWidth="2"
              className="holo-dash"
            />
            {/* Stage Separation Marker */}
            <circle cx="152" cy="29" r="4" fill="#fbbf24" className="holo-ring-pulse" />
            <text x="144" y="21" fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">
              MECO
            </text>
            {/* Orbital Arc & Satellite */}
            <circle cx="242" cy="56" r="5" fill="#22d3ee" stroke="#ffffff" strokeWidth="1" />
            <line x1="232" y1="56" x2="252" y2="56" stroke="#38bdf8" strokeWidth="1.8" />
            <text x="206" y="47" fill="#93c5fd" fontSize="8" fontFamily="monospace">
              LEO 200km
            </text>
          </g>
        );

      case 'jet_engine_3d':
        return (
          <g>
            {/* Engine Centerline Axis */}
            <line x1="22" y1="76" x2="298" y2="76" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
            {/* Outer Bypass Cowl */}
            <path d="M 52 38 Q 160 28 242 46" fill="none" stroke="#94a3b8" strokeWidth="2.2" />
            <path d="M 52 114 Q 160 124 242 106" fill="none" stroke="#94a3b8" strokeWidth="2.2" />
            {/* 1. Intake Fan */}
            <ellipse cx="64" cy="76" rx="8" ry="34" fill="#38bdf8" fillOpacity="0.22" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="48,76 64,66 64,86" fill="#cbd5e1" />
            {/* 2. Axial Compressor Stages */}
            {[90, 104, 118, 132].map((x, idx) => (
              <line
                key={x}
                x1={x}
                y1={52 + idx * 2}
                x2={x}
                y2={100 - idx * 2}
                stroke={accentHex}
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            ))}
            {/* 3. Combustion Chamber */}
            <rect x="144" y="54" width="44" height="44" rx="8" fill="#f97316" fillOpacity="0.25" stroke="#fb923c" strokeWidth="2" className="holo-ring-pulse" />
            <circle cx="166" cy="76" r="10" fill="#fde047" fillOpacity="0.45" />
            {/* 4. Turbine Stages */}
            {[200, 214].map((x) => (
              <line key={x} x1={x} y1="53" x2={x} y2="99" stroke="#e2e8f0" strokeWidth="3.2" strokeLinecap="round" />
            ))}
            {/* 5. Convergent-Divergent Nozzle & Mach Shock Diamonds */}
            <polygon points="224,52 248,58 248,94 224,100" fill="#334155" fillOpacity="0.6" stroke="#94a3b8" strokeWidth="1.6" />
            <polygon points="248,62 270,76 248,90" fill="#f97316" fillOpacity="0.7" className="holo-dash" />
            <polygon points="266,68 286,76 266,84" fill="#38bdf8" fillOpacity="0.6" className="holo-ring-pulse" />
            {/* Airflow Streamlines */}
            <path d="M 24 54 L 54 54 L 92 60 L 146 60" fill="none" stroke="#38bdf8" strokeWidth="1.4" className="holo-dash" />
            <path d="M 24 98 L 54 98 L 92 92 L 146 92" fill="none" stroke="#38bdf8" strokeWidth="1.4" className="holo-dash" />
            <text x="52" y="136" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              FAN · COMPRESSOR · COMBUSTOR · TURBINE · NOZZLE
            </text>
          </g>
        );

      case 'four_d_lectures':
        return (
          <g>
            {/* Left: 4D Tesseract Stereographic Projection */}
            <g className="holo-float">
              <rect x="44" y="34" width="76" height="76" fill="none" stroke={accentHex} strokeWidth="2" />
              <rect x="64" y="54" width="36" height="36" fill="none" stroke={secondaryHex} strokeWidth="1.8" />
              <line x1="44" y1="34" x2="64" y2="54" stroke="#e879f9" strokeWidth="1.5" className="holo-dash" />
              <line x1="120" y1="34" x2="100" y2="54" stroke="#e879f9" strokeWidth="1.5" className="holo-dash" />
              <line x1="44" y1="110" x2="64" y2="90" stroke="#e879f9" strokeWidth="1.5" className="holo-dash" />
              <line x1="120" y1="110" x2="100" y2="90" stroke="#e879f9" strokeWidth="1.5" className="holo-dash" />
              <text x="58" y="128" fill="#e879f9" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                R⁴ → R³ (W)
              </text>
            </g>

            {/* Right: Minkowski 4D Light Cone */}
            <g>
              <line x1="226" y1="24" x2="226" y2="126" stroke="#94a3b8" strokeWidth="1.2" />
              <line x1="168" y1="76" x2="284" y2="76" stroke="#94a3b8" strokeWidth="1.2" />
              <polygon points="184,32 268,32 226,76" fill="#38bdf8" fillOpacity="0.18" stroke="#38bdf8" strokeWidth="1.6" />
              <polygon points="184,120 268,120 226,76" fill="#a855f7" fillOpacity="0.18" stroke="#a855f7" strokeWidth="1.6" />
              <ellipse cx="226" cy="32" rx="42" ry="7" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
              <ellipse cx="226" cy="120" rx="42" ry="7" fill="none" stroke="#a855f7" strokeWidth="1.4" />
              <circle cx="226" cy="76" r="4" fill="#fbbf24" className="holo-ring-pulse" />
              <text x="234" y="29" fill="#7dd3fc" fontSize="8" fontFamily="monospace">
                ct
              </text>
            </g>
          </g>
        );

      case 'robotics_ik_3d':
        return (
          <g>
            {/* Reachable Workspace Arc */}
            <path d="M 56 122 A 95 95 0 0 1 254 96" fill="none" stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="1.4" strokeDasharray="4 4" />
            {/* Base Pedestal */}
            <rect x="66" y="114" width="44" height="14" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="32" y1="128" x2="288" y2="128" stroke="#475569" strokeWidth="1.4" />
            {/* Link 1 & Link 2 & Wrist */}
            <line x1="88" y1="114" x2="128" y2="54" stroke={accentHex} strokeWidth="6" strokeLinecap="round" />
            <line x1="128" y1="54" x2="206" y2="68" stroke={secondaryHex} strokeWidth="5" strokeLinecap="round" />
            <line x1="206" y1="68" x2="234" y2="90" stroke="#e2e8f0" strokeWidth="3.2" strokeLinecap="round" />
            {/* Servo Joints */}
            <circle cx="88" cy="114" r="6" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="128" cy="54" r="6" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="206" cy="68" r="5" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
            {/* Target Cube & IK Crosshair */}
            <rect x="228" y="96" width="16" height="16" rx="2" fill="#10b981" fillOpacity="0.35" stroke="#34d399" strokeWidth="1.6" />
            <circle cx="236" cy="94" r="10" fill="none" stroke="#f43f5e" strokeWidth="1.4" strokeDasharray="3 2" className="holo-orbit-cw" />
            <text x="178" y="42" fill="#7dd3fc" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              IK TARGET (X,Y,Z)
            </text>
          </g>
        );

      case 'cannon_ballistics_3d':
        return (
          <g>
            {/* Ground Range Grid */}
            <line x1="28" y1="124" x2="292" y2="124" stroke="#64748b" strokeWidth="1.6" />
            {[90, 150, 210, 270].map((x) => (
              <line key={x} x1={x} y1="121" x2={x} y2="127" stroke="#94a3b8" strokeWidth="1.2" />
            ))}
            {/* Vacuum Ideal Parabola (dashed) */}
            <path d="M 68 102 Q 168 14, 276 124" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 4" />
            {/* Drag & Wind Actual Trajectory */}
            <path d="M 68 102 Q 156 26, 244 124" fill="none" stroke={accentHex} strokeWidth="2.4" className="holo-dash" />
            {/* Velocity Vector v0 */}
            <line x1="68" y1="102" x2="108" y2="68" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="152" cy="63" r="3.5" fill="#fbbf24" />
            <text x="132" y="55" fill="#fbbf24" fontSize="8" fontFamily="monospace">
              H_max
            </text>
            {/* Schematic Artillery Silhouette */}
            <line x1="48" y1="114" x2="72" y2="98" stroke="#e2e8f0" strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="52" cy="116" r="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
            {/* Downrange Bullseye Target */}
            <circle cx="244" cy="118" r="7" fill="none" stroke="#f43f5e" strokeWidth="2" className="holo-ring-pulse" />
            <circle cx="244" cy="118" r="2.5" fill="#f43f5e" />
            <text x="220" y="139" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              TARGET
            </text>
          </g>
        );

      case 'megastructures':
        return (
          <g>
            <circle cx="160" cy="76" r="52" fill="none" stroke={accentHex} strokeOpacity="0.3" strokeDasharray="4 6" className="holo-orbit-cw" />
            <ellipse cx="160" cy="76" rx="66" ry="21" fill="none" stroke={secondaryHex} strokeWidth="2" className="holo-orbit-ccw" />
            <ellipse cx="160" cy="76" rx="46" ry="15" transform="rotate(30 160 76)" fill="none" stroke={accentHex} strokeWidth="1.6" className="holo-dash" />
            <ellipse cx="160" cy="76" rx="46" ry="15" transform="rotate(-30 160 76)" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="160" cy="76" r="13" fill="#020617" stroke="#fbbf24" strokeWidth="2.4" className="holo-ring-pulse" />
            <text x="20" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              30 WEBGL MODELS · CUTAWAY · X-RAY
            </text>
          </g>
        );

      case 'galaxy3d':
        return (
          <g>
            <ellipse cx="160" cy="76" rx="84" ry="26" fill="none" stroke="#6366f1" strokeWidth="1.6" strokeDasharray="4 4" />
            <ellipse cx="160" cy="76" rx="54" ry="18" fill="none" stroke="#38bdf8" strokeWidth="1.8" className="holo-orbit-cw" />
            <circle cx="160" cy="76" r="10" fill="#fbbf24" className="holo-ring-pulse" />
            <circle cx="96" cy="64" r="6" fill="#38bdf8" />
            <circle cx="222" cy="84" r="6" fill="#34d399" />
            <circle cx="176" cy="54" r="5" fill="#f43f5e" />
            <line x1="96" y1="64" x2="160" y2="76" stroke="#38bdf8" strokeOpacity="0.5" strokeWidth="1.2" />
            <line x1="222" y1="84" x2="160" y2="76" stroke="#34d399" strokeOpacity="0.5" strokeWidth="1.2" />
            <text x="18" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              3D KNOWLEDGE GALAXY · MATH / PHYSICS / CS
            </text>
          </g>
        );

      case 'text_to_sim':
        return (
          <g>
            {/* Prompt Box -> Compiler -> 3D Engine */}
            <rect x="24" y="48" width="76" height="54" rx="6" fill="#0f172a" stroke={accentHex} strokeWidth="1.6" />
            <line x1="34" y1="66" x2="88" y2="66" stroke="#7dd3fc" strokeWidth="2" />
            <line x1="34" y1="78" x2="78" y2="78" stroke="#94a3b8" strokeWidth="1.6" />
            <line x1="34" y1="90" x2="68" y2="90" stroke="#94a3b8" strokeWidth="1.6" />
            <line x1="104" y1="75" x2="138" y2="75" stroke={secondaryHex} strokeWidth="2" className="holo-dash" />
            <polygon points="138,71 146,75 138,79" fill={secondaryHex} />
            {/* 3D Isometric Cube + Parabolic Curve */}
            <polygon points="214,32 266,54 266,102 214,124 162,102 162,54" fill={accentHex} fillOpacity="0.14" stroke={accentHex} strokeWidth="1.8" />
            <path d="M 176 94 Q 214 40, 254 90" fill="none" stroke="#fbbf24" strokeWidth="2.2" className="holo-dash" />
            <circle cx="214" cy="67" r="5" fill="#38bdf8" className="holo-ring-pulse" />
            <text x="158" y="139" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              TEXT → 3D WEBGL PHYSICS
            </text>
          </g>
        );

      case 'paper_to_sim':
        return (
          <g>
            {/* Paper Sheet Scan */}
            <rect x="30" y="34" width="74" height="86" rx="4" fill="#0f172a" stroke="#14b8a6" strokeWidth="1.6" />
            <path d="M 42 86 Q 66 44, 92 86" fill="none" stroke="#38bdf8" strokeWidth="1.8" />
            <line x1="30" y1="64" x2="104" y2="64" stroke="#22d3ee" strokeWidth="1.5" className="holo-ring-pulse" />
            <line x1="112" y1="76" x2="148" y2="76" stroke="#2dd4bf" strokeWidth="2" className="holo-dash" />
            {/* Reconstructed 3D Ramp & Force Vectors */}
            <polygon points="164,114 276,114 164,48" fill="#14b8a6" fillOpacity="0.2" stroke="#2dd4bf" strokeWidth="1.8" />
            <rect x="200" y="64" width="22" height="16" transform="rotate(30 211 72)" fill="#fbbf24" />
            <line x1="212" y1="72" x2="212" y2="104" stroke="#f43f5e" strokeWidth="2" />
            <line x1="212" y1="72" x2="230" y2="42" stroke="#34d399" strokeWidth="2" />
            <text x="162" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              VISION → 3D MODEL + CHECK
            </text>
          </g>
        );

      case 'audio_fft':
        return (
          <g>
            {/* 3D Spectral Waterfall Bars */}
            {[56, 78, 100, 122, 144, 166, 188, 210, 232, 254].map((x, idx) => {
              const h = [22, 48, 72, 38, 84, 58, 42, 66, 30, 18][idx];
              return (
                <rect
                  key={x}
                  x={x}
                  y={114 - h}
                  width="12"
                  height={h}
                  rx="2"
                  fill={idx === 4 ? '#f59e0b' : accentHex}
                  fillOpacity="0.65"
                  stroke="#fde047"
                  strokeOpacity="0.4"
                  strokeWidth="1"
                />
              );
            })}
            <path d="M 46 66 Q 110 26 160 66 T 274 66" fill="none" stroke="#38bdf8" strokeWidth="2" className="holo-dash" />
            <text x="20" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              3D FFT WATERFALL · DOPPLER · HZ
            </text>
          </g>
        );

      case 'silicon_neural':
        return (
          <g>
            {/* 3D Layered Neural Net Nodes */}
            {[
              [60, [48, 76, 104]],
              [126, [36, 62, 88, 114]],
              [192, [50, 76, 102]],
              [254, [76]]
            ].map(([lx, ys], li, arr) => {
              const next = arr[li + 1];
              return (
                <g key={li}>
                  {next &&
                    (ys as number[]).map((y1) =>
                      (next[1] as number[]).map((y2) => (
                        <line
                          key={`${y1}-${y2}`}
                          x1={lx as number}
                          y1={y1}
                          x2={next[0] as number}
                          y2={y2}
                          stroke={(y1 + y2) % 2 === 0 ? accentHex : secondaryHex}
                          strokeOpacity="0.45"
                          strokeWidth="1.2"
                        />
                      ))
                    )}
                  {(ys as number[]).map((y) => (
                    <circle
                      key={y}
                      cx={lx as number}
                      cy={y}
                      r="5.5"
                      fill="#0f172a"
                      stroke={li === 3 ? '#fbbf24' : '#38bdf8'}
                      strokeWidth="2"
                    />
                  ))}
                </g>
              );
            })}
            <text x="20" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              3D BACKPROP MANIFOLD · 4-BIT SILICON DIE
            </text>
          </g>
        );

      case 'phone_sensor_lab':
        return (
          <g>
            {/* 3D Smartphone Tilted Silhouette */}
            <g transform="rotate(-14 96 76)">
              <rect x="74" y="38" width="44" height="76" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <line x1="96" y1="76" x2="128" y2="76" stroke="#f43f5e" strokeWidth="2" />
              <line x1="96" y1="76" x2="96" y2="46" stroke="#34d399" strokeWidth="2" />
              <line x1="96" y1="76" x2="76" y2="94" stroke="#38bdf8" strokeWidth="2" />
            </g>
            {/* Dual Trace Wave */}
            <path d="M 148 76 Q 170 40, 192 76 T 236 76 T 280 76" fill="none" stroke="#22d3ee" strokeWidth="2.2" className="holo-dash" />
            <path d="M 148 76 Q 170 44, 192 76 T 236 76 T 280 76" fill="none" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="4 3" />
            <text x="148" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              3D DIGITAL TWIN · QR TELEMETRY
            </text>
          </g>
        );

      case 'dual_hand_sandbox':
        return (
          <g>
            <circle cx="104" cy="76" r="24" fill="none" stroke={accentHex} strokeWidth="1.6" strokeDasharray="4 4" className="holo-orbit-cw" />
            <circle cx="216" cy="76" r="24" fill="none" stroke={secondaryHex} strokeWidth="1.6" strokeDasharray="4 4" className="holo-orbit-ccw" />
            <circle cx="104" cy="76" r="7" fill="#38bdf8" className="holo-ring-pulse" />
            <circle cx="216" cy="76" r="7" fill="#a855f7" className="holo-ring-pulse" />
            {[
              [142, 48], [160, 62], [178, 52], [148, 92], [164, 102], [182, 86], [126, 56], [194, 98]
            ].map(([px, py], i) => (
              <circle key={i} cx={px} cy={py} r="2.8" fill={i % 2 === 0 ? '#7dd3fc' : '#c084fc'} />
            ))}
            <text x="20" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              28,000 GPU PARTICLES · LORENTZ &amp; GRAVITY
            </text>
          </g>
        );

      case 'quantum_holodeck_3d':
        return (
          <g>
            {/* Bloch Sphere Left */}
            <circle cx="96" cy="76" r="42" fill={accentHex} fillOpacity="0.1" stroke={accentHex} strokeWidth="1.8" />
            <ellipse cx="96" cy="76" rx="42" ry="13" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="96" y1="30" x2="96" y2="122" stroke="#94a3b8" strokeWidth="1" />
            <line x1="96" y1="76" x2="124" y2="46" stroke="#fde047" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="124" cy="46" r="4" fill="#fde047" className="holo-ring-pulse" />
            <text x="90" y="25" fill="#7dd3fc" fontSize="8" fontFamily="monospace" fontWeight="bold">|0⟩</text>
            <text x="90" y="135" fill="#fda4af" fontSize="8" fontFamily="monospace" fontWeight="bold">|1⟩</text>
            {/* Entanglement Bridge */}
            <path d="M 138 76 Q 176 42, 214 76" fill="none" stroke="#c084fc" strokeWidth="2" className="holo-dash" />
            {/* Coupled Qubit B */}
            <circle cx="238" cy="76" r="24" fill="#a855f7" fillOpacity="0.14" stroke="#c084fc" strokeWidth="1.6" strokeDasharray="4 3" className="holo-orbit-cw" />
            <circle cx="238" cy="76" r="6" fill="#2dd4bf" className="holo-ring-pulse" />
            <text x="150" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              BLOCH SPHERE · H · CNOT · MEASURE
            </text>
          </g>
        );

      case 'universe_forge_3d':
        return (
          <g>
            {/* Spacetime Funnel Grid Arcs */}
            <path d="M 32 58 Q 160 72, 288 58" fill="none" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1.2" />
            <path d="M 38 78 Q 160 124, 282 78" fill="none" stroke="#38bdf8" strokeOpacity="0.55" strokeWidth="1.4" />
            <path d="M 54 98 Q 160 142, 266 98" fill="none" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1.2" />
            {/* Black Hole Singularity & Accretion */}
            <ellipse cx="160" cy="76" rx="46" ry="14" fill="none" stroke="#f97316" strokeWidth="2.4" className="holo-orbit-cw" />
            <circle cx="160" cy="76" r="14" fill="#020617" stroke="#fbbf24" strokeWidth="2" />
            {/* Relativistic Probe Orbit */}
            <ellipse cx="160" cy="76" rx="92" ry="30" fill="none" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="5 4" className="holo-dash" />
            <polygon points="244,64 258,70 244,76" fill="#38bdf8" />
            <text x="20" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              LORENTZ γ · DOPPLER · LAW 1/rⁿ
            </text>
          </g>
        );

      case 'nanobot_bioswarm_4d':
        return (
          <g>
            {/* Artery Walls */}
            <line x1="20" y1="36" x2="300" y2="36" stroke="#fb7185" strokeWidth="2.2" />
            <line x1="20" y1="116" x2="300" y2="116" stroke="#fb7185" strokeWidth="2.2" />
            {/* Target Clot Cluster */}
            <circle cx="242" cy="64" r="15" fill="#f59e0b" fillOpacity="0.35" stroke="#fbbf24" strokeWidth="1.8" className="holo-ring-pulse" />
            <circle cx="254" cy="74" r="10" fill="#f59e0b" fillOpacity="0.45" stroke="#fbbf24" strokeWidth="1.4" />
            {/* Red Blood Cells */}
            <ellipse cx="74" cy="86" rx="10" ry="5" fill="#e11d48" fillOpacity="0.7" />
            <ellipse cx="136" cy="54" rx="10" ry="5" fill="#e11d48" fillOpacity="0.7" />
            <ellipse cx="182" cy="94" rx="10" ry="5" fill="#e11d48" fillOpacity="0.7" />
            {/* Autonomous Nanobots */}
            {[
              [62, 58], [98, 68], [156, 72], [198, 62], [212, 76]
            ].map(([bx, by], i) => (
              <g key={i}>
                <polygon points={`${bx},${by - 4} ${bx + 9},${by} ${bx},${by + 4}`} fill="#22d3ee" />
                <line x1={bx + 9} y1={by} x2="236" y2="66" stroke="#22d3ee" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 2" />
              </g>
            ))}
            <text x="20" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              BOIDS SWARM AI · NAVIER-STOKES ARTERY
            </text>
          </g>
        );

      case 'timemachine_holo_3d':
        return (
          <g>
            {/* Hologram Rings */}
            <ellipse cx="160" cy="112" rx="88" ry="14" fill="#6366f1" fillOpacity="0.16" stroke="#818cf8" strokeWidth="1.8" />
            <line x1="94" y1="110" x2="112" y2="34" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1.2" />
            <line x1="226" y1="110" x2="208" y2="34" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1.2" />
            {/* 3 Enigma Rotors Silhouette */}
            {[120, 160, 200].map((rx) => (
              <rect key={rx} x={rx - 12} y="48" width="24" height="44" rx="4" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.8" />
            ))}
            <circle cx="160" cy="30" r="7" fill="#38bdf8" className="holo-ring-pulse" />
            <text x="20" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              1940 ENIGMA · 1801 SLIT · 1609 GALILEO
            </text>
          </g>
        );

      case 'spatial_gesture_3d':
        return (
          <g>
            {/* WebAR Desk Grid & Hologram Projection */}
            <polygon points="48,118 272,118 240,86 80,86" fill="#0f172a" stroke="#2dd4bf" strokeOpacity="0.55" strokeWidth="1.4" />
            {/* Hand Tracking Skeleton Nodes */}
            <circle cx="88" cy="66" r="14" fill="none" stroke="#2dd4bf" strokeWidth="1.6" strokeDasharray="3 2" className="holo-orbit-cw" />
            <path d="M 88 84 L 88 66 M 88 66 L 76 48 M 88 66 L 88 44 M 88 66 L 100 48 M 88 66 L 106 60" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" />
            <circle cx="88" cy="44" r="3" fill="#fde047" />
            <circle cx="76" cy="48" r="2.5" fill="#2dd4bf" />
            <circle cx="100" cy="48" r="2.5" fill="#2dd4bf" />
            {/* Isometric Explodable Hologram Solid */}
            <g className="holo-float">
              <polygon points="208,32 252,52 252,90 208,110 164,90 164,52" fill={accentHex} fillOpacity="0.16" stroke={accentHex} strokeWidth="1.8" />
              <line x1="208" y1="32" x2="208" y2="70" stroke={secondaryHex} strokeWidth="1.4" strokeDasharray="3 2" />
              <line x1="164" y1="52" x2="208" y2="70" stroke={secondaryHex} strokeWidth="1.4" />
              <line x1="252" y1="52" x2="208" y2="70" stroke={secondaryHex} strokeWidth="1.4" />
              <line x1="208" y1="70" x2="208" y2="110" stroke={secondaryHex} strokeWidth="1.4" />
            </g>
            <line x1="112" y1="62" x2="160" y2="62" stroke="#38bdf8" strokeWidth="1.6" className="holo-dash" />
            <text x="20" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              10-FINGER AI · WEBAR DESK · GAZE PARALLAX
            </text>
          </g>
        );

      case 'tech_teardown_3d':
        return (
          <g>
            {/* Exploded Hardware Layers */}
            <rect x="42" y="42" width="44" height="68" rx="3" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.6" />
            <rect x="104" y="46" width="54" height="60" rx="3" fill="#064e3b" fillOpacity="0.65" stroke="#10b981" strokeWidth="1.8" />
            {/* Copper Coil / Transformer */}
            <rect x="116" y="58" width="18" height="22" rx="2" fill="#f59e0b" fillOpacity="0.7" stroke="#fde047" strokeWidth="1.2" />
            <rect x="140" y="64" width="10" height="18" rx="2" fill="#ef4444" fillOpacity="0.8" stroke="#fca5a5" strokeWidth="1.2" />
            {/* Dashed Explode Axes */}
            <line x1="86" y1="76" x2="104" y2="76" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3 2" />
            <line x1="158" y1="76" x2="180" y2="76" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3 2" />
            {/* VOM Multimeter Probe & LCD */}
            <rect x="184" y="38" width="94" height="76" rx="4" fill="#1e293b" stroke={accentHex} strokeWidth="1.8" />
            <rect x="194" y="46" width="74" height="24" rx="2" fill="#022c22" stroke="#34d399" strokeWidth="1.2" />
            <text x="200" y="62" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">
              0.00V / OL
            </text>
            <circle cx="231" cy="90" r="12" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.6" />
            <line x1="231" y1="90" x2="239" y2="82" stroke="#fbbf24" strokeWidth="2" />
            <line x1="145" y1="64" x2="184" y2="54" stroke="#f43f5e" strokeWidth="1.8" className="holo-dash" />
            <circle cx="145" cy="64" r="3.5" fill="#fbbf24" className="holo-ring-pulse" />
            <text x="20" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              EXPLODED VIEW 3D · VOM PROBE · FAULT REPAIR
            </text>
          </g>
        );

      case 'assembly_3d':
        return (
          <g>
            {/* Central Assembled Core + Exploded Snap Layers */}
            <ellipse cx="160" cy="108" rx="76" ry="14" fill="#0f172a" stroke="#38bdf8" strokeOpacity="0.45" strokeWidth="1.4" />
            <rect x="128" y="80" width="64" height="24" rx="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.6" />
            {/* Ghost Hologram Target Slot */}
            <rect x="134" y="48" width="52" height="22" rx="3" fill="#10b981" fillOpacity="0.14" stroke="#34d399" strokeWidth="1.4" strokeDasharray="3 2" />
            {/* Floating Snap-Fit Part */}
            <g className="holo-float">
              <rect x="64" y="28" width="46" height="20" rx="3" fill={accentHex} fillOpacity="0.3" stroke={accentHex} strokeWidth="1.8" />
              <circle cx="234" cy="40" r="14" fill="#0ea5e9" fillOpacity="0.22" stroke="#38bdf8" strokeWidth="1.6" className="holo-orbit-cw" />
            </g>
            {/* Magnetic Alignment Trajectories */}
            <path d="M 110 38 Q 134 38 148 54" fill="none" stroke="#34d399" strokeWidth="1.6" className="holo-dash" />
            <path d="M 220 40 Q 196 42 184 56" fill="none" stroke="#38bdf8" strokeWidth="1.6" className="holo-dash" />
            <circle cx="160" cy="60" r="5" fill="#fbbf24" className="holo-ring-pulse" />
            <text x="20" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              3D DRAG &amp; MAGNETIC SNAP · EXPLODED VIEW · LIVE RUN
            </text>
          </g>
        );

      case 'solar_system_3d':
        return (
          <g>
            {/* Concentric Keplerian Orbits */}
            <ellipse cx="160" cy="76" rx="46" ry="20" fill="none" stroke="#38bdf8" strokeOpacity="0.45" strokeWidth="1.2" />
            <ellipse cx="160" cy="76" rx="82" ry="34" fill="none" stroke="#f59e0b" strokeOpacity="0.42" strokeWidth="1.2" />
            <ellipse cx="160" cy="76" rx="122" ry="50" fill="none" stroke="#a855f7" strokeOpacity="0.36" strokeWidth="1.2" strokeDasharray="3 3" />
            {/* Plasma Sun */}
            <circle cx="160" cy="76" r="16" fill="#f59e0b" fillOpacity="0.28" className="holo-ring-pulse" />
            <circle cx="160" cy="76" r="10" fill="#fbbf24" stroke="#fef08a" strokeWidth="1.4" />
            {/* Earth & Mars */}
            <circle cx="204" cy="72" r="4" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="1" />
            <circle cx="102" cy="52" r="3.5" fill="#fb7185" />
            {/* Saturn + Ring */}
            <g className="holo-float">
              <ellipse cx="268" cy="56" rx="13" ry="4.5" fill="none" stroke="#fde047" strokeWidth="1.4" transform="rotate(-18 268 56)" />
              <circle cx="268" cy="56" r="5.5" fill="#eab308" />
            </g>
            <text x="20" y="138" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              KEPLER J2000 (1800–2100) · GLSL SUN · LIGHT-MIN TELEMETRY
            </text>
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden border border-slate-300/70 dark:border-slate-700/80 shadow-inner"
      style={{
        background: `radial-gradient(circle at 50% 45%, ${accentHex}24 0%, ${secondaryHex}14 44%, #060e21 88%)`
      }}
    >
      {/* Crisp Technical Blueprint Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(56,189,248,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.12) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Direct Scientific Schematic SVG */}
      <svg
        viewBox="0 0 320 152"
        className="relative z-10 w-full h-full"
        aria-hidden="true"
      >
        {renderSchematic()}
      </svg>

      {/* Top Subtle Readout */}
      <div className="pointer-events-none absolute top-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono font-semibold text-sky-200/80">
        <span>{isEn ? '3D+ Interactive Schematic' : 'Sơ đồ Mô phỏng 3D+'}</span>
        <span className="text-slate-400">WebGL</span>
      </div>
    </div>
  );
};
