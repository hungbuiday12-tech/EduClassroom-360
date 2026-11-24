import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  APPARATUS_BY_ID,
  APPARATUS_CATEGORIES,
  ApparatusCategoryId,
  PHYSICS_APPARATUS_CATALOG,
  PhysicsApparatusItem,
  evaluateApparatusReading,
  getRecommendedToolsForSim
} from '../../data/physicsApparatusData';
import { PhysicsDomainId } from '../../types';
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  RotateCw,
  Search,
  Sparkles,
  Trash2,
  Wrench,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface PlacedApparatusInstance {
  uid: string;
  toolId: string;
  xPct: number;
  yPct: number;
  rotationDeg: number;
  massValueGrams?: number;
}

interface PhysicsApparatusWorkbenchProps {
  dimension: '2d' | '3d';
  simId: string;
  domainId: PhysicsDomainId;
  simParams: Record<string, number>;
  simTimeRef?: React.MutableRefObject<number>;
  simTime?: number;
  stageClassName?: string;
  onPlacedToolsChange?: (tools: PlacedApparatusInstance[]) => void;
  children: React.ReactNode;
}

function parseNumericReading(text: string): number {
  const m = text.replace(/,/g, '.').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
}

/**
 * Lifelike frameless real-world SVG physics apparatus graphics (transparent outer silhouette,
 * metallic/glass/bakelite shading, embedded scale/LCD/needle directly on the physical device).
 */
const LifelikeInstrumentGraphic: React.FC<{
  spec: PhysicsApparatusItem;
  readingValue: string;
  simTime: number;
  massValueGrams?: number;
}> = ({ spec, readingValue, simTime, massValueGrams = 200 }) => {
  const numVal = parseNumericReading(readingValue);
  const uidPrefix = spec.id.replace(/[^a-z0-9]/gi, '');

  // 1. Classic Analog Benchtop Galvanometers (Ammeter / Voltmeter)
  if (spec.id === 'ammeter_dc_ac' || spec.id === 'voltmeter_dc_ac') {
    const isAmp = spec.id === 'ammeter_dc_ac';
    const maxScale = isAmp ? 12 : 24;
    const norm = Math.max(0, Math.min(1, Math.abs(numVal) / maxScale));
    const needleDeg = -52 + norm * 104;
    return (
      <svg viewBox="0 0 148 124" className="w-[138px] h-[116px] overflow-visible drop-shadow-[0_10px_16px_rgba(0,0,0,0.45)]">
        <defs>
          <linearGradient id={`${uidPrefix}-case`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="55%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id={`${uidPrefix}-face`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
        {/* Rubber feet */}
        <rect x="20" y="114" width="16" height="6" rx="2" fill="#090d16" />
        <rect x="112" y="114" width="16" height="6" rx="2" fill="#090d16" />
        {/* Sloped trapezoid meter housing */}
        <path
          d="M 18 14 Q 18 8 24 8 L 124 8 Q 130 8 130 14 L 138 106 Q 138 114 130 114 L 18 114 Q 10 114 10 106 Z"
          fill={`url(#${uidPrefix}-case)`}
          stroke="#475569"
          strokeWidth="1.5"
        />
        {/* Recessed meter glass window */}
        <rect x="22" y="15" width="104" height="58" rx="5" fill={`url(#${uidPrefix}-face)`} stroke="#0f172a" strokeWidth="2.5" />
        {/* Curved mirrored scale arc */}
        <path d="M 34 61 A 44 44 0 0 1 114 61" fill="none" stroke="#1e293b" strokeWidth="2" />
        <path d="M 38 57 A 39 39 0 0 1 110 57" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 3" />
        {Array.from({ length: 11 }).map((_, idx) => {
          const ang = ((-52 + idx * 10.4) * Math.PI) / 180;
          const x1 = 74 + Math.sin(ang) * 38;
          const y1 = 68 - Math.cos(ang) * 38;
          const x2 = 74 + Math.sin(ang) * (idx % 2 === 0 ? 45 : 42);
          const y2 = 68 - Math.cos(ang) * (idx % 2 === 0 ? 45 : 42);
          return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0f172a" strokeWidth={idx % 2 === 0 ? 1.5 : 0.9} />;
        })}
        {/* Unit symbol printed on dial */}
        <text x="74" y="47" textAnchor="middle" fill={isAmp ? '#dc2626' : '#2563eb'} fontSize="14" fontWeight="900" fontFamily="serif">
          {isAmp ? 'A' : 'V'}
        </text>
        <line x1="68" y1="50" x2="80" y2="50" stroke="#475569" strokeWidth="1.2" />
        {/* Analog needle */}
        <g transform={`translate(74, 68) rotate(${needleDeg})`}>
          <line x1="0" y1="4" x2="0" y2="-41" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="0" cy="0" r="4.5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.2" />
        </g>
        {/* Zero-adjust brass screw */}
        <circle cx="74" cy="79" r="4" fill="#94a3b8" stroke="#334155" strokeWidth="1" />
        <line x1="71.5" y1="79" x2="76.5" y2="79" stroke="#1e293b" strokeWidth="1.2" />
        {/* Small digital readout strip built into bezel */}
        <rect x="44" y="88" width="60" height="15" rx="2.5" fill="#06120e" stroke="#334155" strokeWidth="1" />
        <text x="74" y="99" textAnchor="middle" fill="#34d399" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
          {readingValue.slice(0, 10)}
        </text>
        {/* Positive Red & Negative Black Binding Posts */}
        <circle cx="28" cy="96" r="7.5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.6" />
        <circle cx="28" cy="96" r="3" fill="#fca5a5" />
        <text x="28" y="110" textAnchor="middle" fill="#f87171" fontSize="8" fontWeight="bold">+</text>
        <circle cx="120" cy="96" r="7.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <circle cx="120" cy="96" r="3" fill="#475569" />
        <text x="120" y="110" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">−</text>
        {/* Glass reflection highlight */}
        <path d="M 24 18 L 62 18 L 36 52 L 24 52 Z" fill="rgba(255,255,255,0.22)" />
      </svg>
    );
  }

  // 2. Digital Handheld Multimeter (Yellow Rubber Holster Fluke-style)
  if (spec.id === 'multimeter_pro') {
    return (
      <svg viewBox="0 0 110 164" className="w-[96px] h-[144px] overflow-visible drop-shadow-[0_10px_16px_rgba(0,0,0,0.48)]">
        {/* Outer yellow rubber boot */}
        <rect x="8" y="6" width="94" height="152" rx="14" fill="#eab308" stroke="#a16207" strokeWidth="2" />
        {/* Inner dark grey instrument body */}
        <rect x="15" y="14" width="80" height="136" rx="9" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
        {/* Backlit LCD screen */}
        <rect x="22" y="21" width="66" height="34" rx="4" fill="#a7f3d0" stroke="#065f46" strokeWidth="1.6" />
        <text x="55" y="42" textAnchor="middle" fill="#064e3b" fontSize="12.5" fontWeight="900" fontFamily="monospace">
          {readingValue.slice(0, 9)}
        </text>
        <text x="26" y="30" fill="#047857" fontSize="6.5" fontWeight="bold" fontFamily="monospace">AUTO DC/AC</text>
        {/* Function buttons */}
        <rect x="24" y="60" width="16" height="7" rx="2" fill="#eab308" />
        <rect x="47" y="60" width="16" height="7" rx="2" fill="#38bdf8" />
        <rect x="70" y="60" width="16" height="7" rx="2" fill="#64748b" />
        {/* Central Rotary Selector Dial */}
        <circle cx="55" cy="96" r="22" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
        <g transform="rotate(-28 55 96)">
          <rect x="51" y="75" width="8" height="42" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
          <polygon points="55,76 52,82 58,82" fill="#eab308" />
        </g>
        <text x="27" y="83" fill="#e2e8f0" fontSize="6.5" fontWeight="bold">V~</text>
        <text x="24" y="102" fill="#e2e8f0" fontSize="6.5" fontWeight="bold">V=</text>
        <text x="80" y="83" fill="#e2e8f0" fontSize="6.5" fontWeight="bold">Ω</text>
        <text x="79" y="102" fill="#e2e8f0" fontSize="6.5" fontWeight="bold">mA</text>
        {/* 3 Banana Probe Jacks at bottom */}
        <circle cx="30" cy="133" r="6.5" fill="#dc2626" stroke="#090d16" strokeWidth="2" />
        <circle cx="55" cy="133" r="6.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="80" cy="133" r="6.5" fill="#dc2626" stroke="#090d16" strokeWidth="2" />
        <text x="30" y="146" textAnchor="middle" fill="#cbd5e1" fontSize="6" fontWeight="bold">10A</text>
        <text x="55" y="146" textAnchor="middle" fill="#cbd5e1" fontSize="6" fontWeight="bold">COM</text>
        <text x="80" y="146" textAnchor="middle" fill="#cbd5e1" fontSize="6" fontWeight="bold">VΩ</text>
      </svg>
    );
  }

  // 3. Handheld Sensor Meters (Lux, Decibel, Gaussmeter, Geiger Counter)
  if (
    spec.id === 'lux_photometer' ||
    spec.id === 'decibel_meter' ||
    spec.id === 'gaussmeter_hall' ||
    spec.id === 'geiger_counter'
  ) {
    const bodyCol =
      spec.id === 'geiger_counter'
        ? '#f59e0b'
        : spec.id === 'gaussmeter_hall'
        ? '#0284c7'
        : spec.id === 'decibel_meter'
        ? '#334155'
        : '#0f766e';
    return (
      <svg viewBox="0 0 100 156" className="w-[88px] h-[138px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]">
        {/* Top Physical Sensor Probe Head */}
        {spec.id === 'lux_photometer' && (
          <path d="M 32 32 A 18 16 0 0 1 68 32 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
        )}
        {spec.id === 'decibel_meter' && (
          <>
            <rect x="43" y="18" width="14" height="16" fill="#64748b" />
            <circle cx="50" cy="14" r="11" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
          </>
        )}
        {(spec.id === 'gaussmeter_hall' || spec.id === 'geiger_counter') && (
          <>
            <rect x="44" y="6" width="12" height="28" rx="4" fill="#475569" stroke="#cbd5e1" strokeWidth="1.2" />
            <circle cx="50" cy="9" r="3.5" fill={spec.id === 'geiger_counter' ? '#ef4444' : '#38bdf8'} />
          </>
        )}
        {/* Handheld ergonomic casing */}
        <path
          d="M 22 36 Q 22 28 30 28 L 70 28 Q 78 28 78 36 L 74 142 Q 74 150 66 150 L 34 150 Q 26 150 26 142 Z"
          fill={bodyCol}
          stroke="#0f172a"
          strokeWidth="2"
        />
        {/* LCD window */}
        <rect x="29" y="42" width="42" height="32" rx="3" fill="#d1fae5" stroke="#0f172a" strokeWidth="1.5" />
        <text x="50" y="62" textAnchor="middle" fill="#064e3b" fontSize="10" fontWeight="900" fontFamily="monospace">
          {readingValue.slice(0, 8)}
        </text>
        {/* Keypad buttons */}
        <circle cx="38" cy="92" r="5" fill="#0f172a" />
        <circle cx="62" cy="92" r="5" fill="#0f172a" />
        <circle cx="50" cy="108" r="6" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.2" />
        {/* Speaker grille slots for Geiger/dB */}
        <line x1="36" y1="126" x2="64" y2="126" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="133" x2="62" y2="133" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. Brass Bourdon Pressure Manometer Gauge
  if (spec.id === 'pressure_manometer') {
    const norm = Math.max(0, Math.min(1, Math.abs(numVal) / 6));
    const needleDeg = -130 + norm * 260;
    return (
      <svg viewBox="0 0 112 134" className="w-[100px] h-[120px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]">
        {/* Bottom threaded brass pipe stem */}
        <rect x="48" y="96" width="16" height="22" fill="#d97706" stroke="#78350f" strokeWidth="1.4" />
        <rect x="44" y="103" width="24" height="7" rx="1" fill="#fbbf24" stroke="#92400e" strokeWidth="1.2" />
        {/* Circular brass bezel */}
        <circle cx="56" cy="54" r="46" fill="#d97706" stroke="#78350f" strokeWidth="2" />
        <circle cx="56" cy="54" r="39" fill="#f8fafc" stroke="#92400e" strokeWidth="1.5" />
        {Array.from({ length: 13 }).map((_, i) => {
          const ang = ((-130 + i * 21.66) * Math.PI) / 180;
          const x1 = 56 + Math.sin(ang) * 30;
          const y1 = 54 - Math.cos(ang) * 30;
          const x2 = 56 + Math.sin(ang) * 36;
          const y2 = 54 - Math.cos(ang) * 36;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i >= 10 ? '#dc2626' : '#0f172a'} strokeWidth={i % 2 === 0 ? 1.8 : 1} />;
        })}
        <text x="56" y="75" textAnchor="middle" fill="#0f172a" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
          {readingValue.slice(0, 8)}
        </text>
        <g transform={`translate(56, 54) rotate(${needleDeg})`}>
          <line x1="0" y1="6" x2="0" y2="-31" stroke="#dc2626" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="0" cy="0" r="4.5" fill="#334155" />
        </g>
        <path d="M 28 32 A 34 34 0 0 1 78 26" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 5. Brushed Stainless Vernier Caliper
  if (spec.id === 'vernier_caliper') {
    const jawShift = 44 + Math.sin(simTime * 1.4) * 14;
    return (
      <svg viewBox="0 0 210 82" className="w-[196px] h-[76px] overflow-visible drop-shadow-[0_8px_14px_rgba(0,0,0,0.45)]">
        <defs>
          <linearGradient id={`${uidPrefix}-steel`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        {/* Depth rod tail */}
        <rect x="190" y="29" width="16" height="4" fill="#94a3b8" />
        {/* Main steel beam + fixed jaws */}
        <polygon points="14,22 28,22 21,6 14,16" fill={`url(#${uidPrefix}-steel)`} stroke="#475569" strokeWidth="1" />
        <polygon points="14,38 28,38 26,64 17,76 14,56" fill={`url(#${uidPrefix}-steel)`} stroke="#475569" strokeWidth="1" />
        <rect x="14" y="22" width="178" height="16" rx="1.5" fill={`url(#${uidPrefix}-steel)`} stroke="#475569" strokeWidth="1.2" />
        {/* Engraved millimeter rule */}
        {Array.from({ length: 28 }).map((_, i) => (
          <line
            key={i}
            x1={28 + i * 5.6}
            y1="22"
            x2={28 + i * 5.6}
            y2={i % 5 === 0 ? 31 : 27}
            stroke="#0f172a"
            strokeWidth={i % 5 === 0 ? 1.1 : 0.7}
          />
        ))}
        {/* Sliding Vernier Carriage with Digital Readout */}
        <g transform={`translate(${jawShift}, 0)`}>
          <polygon points="0,22 10,22 10,6 3,16" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
          <polygon points="0,38 11,38 11,56 7,76 0,64" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
          <rect x="-2" y="18" width="60" height="24" rx="3" fill="#1e293b" stroke="#64748b" strokeWidth="1.3" />
          {/* Locking thumb screw & wheel */}
          <rect x="20" y="13" width="10" height="5" rx="1" fill="#eab308" />
          <circle cx="46" cy="44" r="5" fill="#64748b" stroke="#0f172a" strokeWidth="1" />
          {/* LCD screen on slider */}
          <rect x="4" y="22" width="48" height="16" rx="2" fill="#d1fae5" stroke="#0f172a" strokeWidth="1" />
          <text x="28" y="33.5" textAnchor="middle" fill="#064e3b" fontSize="9" fontWeight="900" fontFamily="monospace">
            {readingValue.slice(0, 8)}
          </text>
        </g>
      </svg>
    );
  }

  // 6. Real Laboratory Mercury/Alcohol Glass Thermometer
  if (spec.id === 'thermometer_probe') {
    const frac = Math.max(0.14, Math.min(0.92, (numVal + 20) / 220));
    const colH = 14 + frac * 102;
    return (
      <svg viewBox="0 0 64 166" className="w-[58px] h-[150px] overflow-visible drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)]">
        {/* Glass outer body */}
        <rect x="22" y="6" width="20" height="132" rx="10" fill="rgba(248,250,252,0.92)" stroke="#94a3b8" strokeWidth="1.6" />
        {/* Calibration ticks */}
        {Array.from({ length: 13 }).map((_, i) => (
          <line
            key={i}
            x1="24"
            y1={18 + i * 9}
            x2={i % 2 === 0 ? 31 : 28}
            y2={18 + i * 9}
            stroke="#334155"
            strokeWidth={i % 2 === 0 ? 1.2 : 0.8}
          />
        ))}
        {/* Capillary tube */}
        <rect x="29.5" y="14" width="5" height="122" rx="2.5" fill="#cbd5e1" />
        {/* Red mercury column */}
        <rect x="30" y={134 - colH} width="4" height={colH + 6} rx="2" fill="#dc2626" />
        {/* Glass bulb */}
        <circle cx="32" cy="145" r="13" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.6" />
        <ellipse cx="28" cy="141" rx="4" ry="2.5" fill="rgba(255,255,255,0.45)" transform="rotate(-35 28 141)" />
        {/* Etched numeric readout tag inside upper glass collar */}
        <rect x="11" y="12" width="42" height="14" rx="3" fill="rgba(15,23,42,0.86)" />
        <text x="32" y="22" textAnchor="middle" fill="#fca5a5" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
          {readingValue.slice(0, 7)}
        </text>
      </svg>
    );
  }

  // 7. Cylindrical Spring Dynamometer / Coil Spring / Mass Weights / Pendulum
  if (spec.id === 'dynamometer_spring' || spec.id === 'coil_spring_ref') {
    const pullPx = Math.max(4, Math.min(26, Math.abs(numVal) * 2.1));
    return (
      <svg viewBox="0 0 74 166" className="w-[68px] h-[152px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]">
        {/* Hanging metal ring */}
        <circle cx="37" cy="11" r="7" fill="none" stroke="#cbd5e1" strokeWidth="2.8" />
        {/* Top metal cap */}
        <rect x="23" y="18" width="28" height="10" rx="2" fill="#2563eb" stroke="#1e3a8a" strokeWidth="1.4" />
        {/* Clear acrylic / white graduated cylinder body */}
        <rect x="25" y="28" width="24" height="86" rx="3" fill="rgba(241,245,249,0.92)" stroke="#64748b" strokeWidth="1.5" />
        {/* Newton graduation ticks */}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={i} x1="27" y1={35 + i * 7.2} x2={i % 2 === 0 ? 35 : 32} y2={35 + i * 7.2} stroke="#0f172a" strokeWidth="1" />
        ))}
        {/* Internal steel spring */}
        <path
          d={`M 37 28 L 32 ${34 + pullPx * 0.15} L 42 ${41 + pullPx * 0.3} L 32 ${48 + pullPx * 0.45} L 42 ${55 + pullPx * 0.6} L 32 ${62 + pullPx * 0.75} L 37 ${68 + pullPx}`}
          fill="none"
          stroke="#475569"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Sliding red pointer indicator */}
        <rect x="26" y={66 + pullPx} width="22" height="4" rx="1" fill="#dc2626" />
        {/* Bottom plunger rod & steel hook */}
        <line x1="37" y1={70 + pullPx} x2="37" y2={128 + pullPx * 0.4} stroke="#94a3b8" strokeWidth="2.8" />
        <path
          d={`M 37 ${128 + pullPx * 0.4} C 37 ${138 + pullPx * 0.4}, 47 ${138 + pullPx * 0.4}, 45 ${131 + pullPx * 0.4}`}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Small Newton scale collar badge */}
        <rect x="13" y="88" width="48" height="14" rx="2.5" fill="#0f172a" />
        <text x="37" y="98" textAnchor="middle" fill="#38bdf8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
          {readingValue.slice(0, 8)}
        </text>
      </svg>
    );
  }

  if (spec.id === 'mass_set') {
    return (
      <svg viewBox="0 0 88 94" className="w-[80px] h-[86px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.48)]">
        <defs>
          <linearGradient id={`${uidPrefix}-brass`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="35%" stopColor="#fbbf24" />
            <stop offset="68%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
        {/* Top lifting knob / ring */}
        <circle cx="44" cy="14" r="6" fill="none" stroke="#fbbf24" strokeWidth="3" />
        <rect x="38" y="20" width="12" height="8" rx="1" fill={`url(#${uidPrefix}-brass)`} stroke="#78350f" strokeWidth="1" />
        {/* Slotted cylindrical brass weight */}
        <path
          d="M 18 32 Q 44 26 70 32 L 72 78 Q 44 86 16 78 Z"
          fill={`url(#${uidPrefix}-brass)`}
          stroke="#78350f"
          strokeWidth="1.5"
        />
        <ellipse cx="44" cy="32" rx="26" ry="5.5" fill="#fde68a" stroke="#b45309" strokeWidth="1" />
        <text x="44" y="61" textAnchor="middle" fill="#451a03" fontSize="13" fontWeight="900" fontFamily="monospace">
          {massValueGrams}g
        </text>
      </svg>
    );
  }

  if (spec.id === 'pendulum_bob_kit') {
    const swingDeg = Math.sin(simTime * 3.1) * 18;
    return (
      <svg viewBox="0 0 92 126" className="w-[84px] h-[116px] overflow-visible drop-shadow-[0_10px_12px_rgba(0,0,0,0.45)]">
        {/* Stand crossbar */}
        <rect x="18" y="8" width="56" height="7" rx="2" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
        <circle cx="46" cy="15" r="3" fill="#94a3b8" />
        <g transform={`translate(46, 15) rotate(${swingDeg})`}>
          <line x1="0" y1="0" x2="0" y2="74" stroke="#e2e8f0" strokeWidth="1.6" />
          <circle cx="0" cy="84" r="14" fill="#d97706" stroke="#78350f" strokeWidth="1.6" />
          <circle cx="-4" cy="79" r="4" fill="#fef3c7" opacity="0.6" />
        </g>
        <rect x="20" y="106" width="52" height="14" rx="2" fill="rgba(15,23,42,0.86)" />
        <text x="46" y="116" textAnchor="middle" fill="#fcd34d" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
          {readingValue.slice(0, 8)}
        </text>
      </svg>
    );
  }

  // 8. Analytical Electronic Lab Scale
  if (spec.id === 'analytical_balance') {
    return (
      <svg viewBox="0 0 156 104" className="w-[144px] h-[96px] overflow-visible drop-shadow-[0_10px_16px_rgba(0,0,0,0.45)]">
        {/* Brushed stainless steel weighing pan */}
        <rect x="28" y="16" width="100" height="8" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.4" />
        <rect x="64" y="24" width="28" height="8" fill="#64748b" />
        {/* Scale body */}
        <path
          d="M 18 32 L 138 32 L 148 88 Q 148 94 140 94 L 16 94 Q 8 94 8 88 Z"
          fill="#f1f5f9"
          stroke="#475569"
          strokeWidth="1.8"
        />
        {/* Front sloped dark control panel */}
        <path d="M 14 62 L 142 62 L 146 88 L 10 88 Z" fill="#1e293b" />
        <rect x="34" y="66" width="66" height="18" rx="2.5" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
        <text x="67" y="79" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="900" fontFamily="monospace">
          {readingValue.slice(0, 9)}
        </text>
        <circle cx="116" cy="75" r="5" fill="#38bdf8" />
        <circle cx="131" cy="75" r="4" fill="#ef4444" />
      </svg>
    );
  }

  // 9. Optics Equipment (Laser, Lens, Mirror, Flint Glass Prism)
  if (spec.id === 'laser_pointer_rgb') {
    return (
      <svg viewBox="0 0 184 56" className="w-[172px] h-[52px] overflow-visible drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)]">
        {/* Anodized black aluminum cylindrical laser barrel */}
        <rect x="10" y="18" width="84" height="20" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.4" />
        <rect x="26" y="17" width="10" height="22" rx="1" fill="#ec4899" />
        <rect x="94" y="21" width="10" height="14" rx="1.5" fill="#eab308" />
        <circle cx="55" cy="28" r="4" fill="#ef4444" stroke="#fecaca" strokeWidth="1" />
        {/* Sharp glowing collimated laser beam */}
        <line x1="104" y1="28" x2="180" y2="28" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="104" y1="28" x2="180" y2="28" stroke="#fecdd3" strokeWidth="1.2" />
      </svg>
    );
  }

  if (spec.id === 'glass_prism_block') {
    return (
      <svg viewBox="0 0 164 102" className="w-[152px] h-[94px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.4)]">
        {/* White incident ray */}
        <line x1="6" y1="62" x2="62" y2="48" stroke="#f8fafc" strokeWidth="2.8" />
        {/* Rainbow dispersed rays */}
        <line x1="98" y1="47" x2="156" y2="38" stroke="#ef4444" strokeWidth="2.3" />
        <line x1="99" y1="49" x2="156" y2="48" stroke="#f59e0b" strokeWidth="2.3" />
        <line x1="100" y1="51" x2="156" y2="58" stroke="#22c55e" strokeWidth="2.3" />
        <line x1="101" y1="53" x2="156" y2="68" stroke="#3b82f6" strokeWidth="2.3" />
        <line x1="102" y1="55" x2="156" y2="78" stroke="#a855f7" strokeWidth="2.3" />
        {/* Equilateral 3D optical flint glass prism */}
        <polygon points="82,12 42,86 122,86" fill="rgba(186,230,253,0.34)" stroke="#bae6fd" strokeWidth="2.2" />
        <polygon points="82,12 122,86 106,80" fill="rgba(255,255,255,0.22)" />
      </svg>
    );
  }

  if (spec.id === 'convex_concave_lens' || spec.id === 'optical_mirror') {
    const isMirror = spec.id === 'optical_mirror';
    return (
      <svg viewBox="0 0 96 126" className="w-[88px] h-[116px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]">
        {/* Black optical pedestal base */}
        <rect x="26" y="108" width="44" height="8" rx="2" fill="#1e293b" stroke="#64748b" strokeWidth="1.2" />
        <rect x="44" y="92" width="8" height="16" fill="#475569" />
        {/* Metal rim holder */}
        <ellipse
          cx="48"
          cy="52"
          rx={isMirror ? 13 : 16}
          ry="42"
          fill={isMirror ? 'rgba(226,232,240,0.62)' : 'rgba(125,211,252,0.36)'}
          stroke={isMirror ? '#cbd5e1' : '#38bdf8'}
          strokeWidth="3"
        />
        <path d="M 41 20 Q 38 52 41 84" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round" />
        <rect x="22" y="88" width="52" height="13" rx="2" fill="rgba(15,23,42,0.88)" />
        <text x="48" y="97.5" textAnchor="middle" fill="#7dd3fc" fontSize="8" fontWeight="bold" fontFamily="monospace">
          {readingValue.slice(0, 8)}
        </text>
      </svg>
    );
  }

  // 10. Painted Steel Bar Magnet (N-S)
  if (spec.id === 'bar_magnet_ns') {
    return (
      <svg viewBox="0 0 170 62" className="w-[158px] h-[56px] overflow-visible drop-shadow-[0_10px_12px_rgba(0,0,0,0.48)]">
        {/* Top bevel highlight */}
        <polygon points="16,14 158,14 150,20 10,20" fill="#cbd5e1" opacity="0.35" />
        <rect x="10" y="20" width="70" height="28" rx="2" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
        <rect x="80" y="20" width="70" height="28" rx="2" fill="#2563eb" stroke="#1e3a8a" strokeWidth="1.5" />
        <text x="45" y="39" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">N</text>
        <text x="115" y="39" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">S</text>
      </svg>
    );
  }

  // 11. Solenoid / Rheostat / Resistor Decade / Capacitor / Power Supply / Photogate
  if (spec.id === 'inductor_solenoid') {
    return (
      <svg viewBox="0 0 166 72" className="w-[156px] h-[68px] overflow-visible drop-shadow-[0_10px_12px_rgba(0,0,0,0.45)]">
        <rect x="18" y="24" width="130" height="24" rx="5" fill="#94a3b8" stroke="#475569" strokeWidth="1.4" />
        {Array.from({ length: 10 }).map((_, k) => (
          <ellipse key={k} cx={30 + k * 12} cy="36" rx="5" ry="18" fill="none" stroke="#ea580c" strokeWidth="3.2" />
        ))}
        <circle cx="14" cy="48" r="5" fill="#dc2626" />
        <circle cx="152" cy="48" r="5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
      </svg>
    );
  }

  if (spec.id === 'rheostat_slider') {
    return (
      <svg viewBox="0 0 176 76" className="w-[164px] h-[72px] overflow-visible drop-shadow-[0_10px_12px_rgba(0,0,0,0.45)]">
        {/* Stand legs */}
        <rect x="18" y="54" width="12" height="14" rx="2" fill="#334155" />
        <rect x="146" y="54" width="12" height="14" rx="2" fill="#334155" />
        {/* Ceramic core wound with resistance wire */}
        <rect x="16" y="30" width="144" height="26" rx="4" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
        {Array.from({ length: 18 }).map((_, k) => (
          <line key={k} x1={24 + k * 7.2} y1="30" x2={24 + k * 7.2} y2="56" stroke="#cbd5e1" strokeWidth="1.6" />
        ))}
        {/* Top brass slider bar */}
        <rect x="14" y="16" width="148" height="6" rx="2" fill="#d97706" />
        {/* Bakelite sliding knob */}
        <rect x="74" y="6" width="26" height="22" rx="4" fill="#0f172a" stroke="#64748b" strokeWidth="1.4" />
      </svg>
    );
  }

  if (spec.id === 'photogate_timer') {
    return (
      <svg viewBox="0 0 132 106" className="w-[122px] h-[98px] overflow-visible drop-shadow-[0_10px_12px_rgba(0,0,0,0.45)]">
        {/* U-shaped optical gate frame */}
        <path d="M 28 94 L 28 18 L 104 18 L 104 94" fill="none" stroke="#1e293b" strokeWidth="14" strokeLinejoin="round" />
        <path d="M 28 94 L 28 18 L 104 18 L 104 94" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinejoin="round" />
        {/* IR laser beam */}
        <line x1="35" y1="68" x2="97" y2="68" stroke="#ef4444" strokeWidth="2.4" strokeDasharray="4 2" />
        <circle cx="35" cy="68" r="3" fill="#f87171" />
        <circle cx="97" cy="68" r="3" fill="#f87171" />
        <rect x="40" y="11" width="52" height="14" rx="2" fill="#020617" />
        <text x="66" y="21" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold" fontFamily="monospace">
          {readingValue.slice(0, 8)}
        </text>
      </svg>
    );
  }

  if (spec.id === 'tuning_fork_ref') {
    return (
      <svg viewBox="0 0 92 128" className="w-[84px] h-[118px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]">
        {/* Wooden resonance sound box */}
        <rect x="14" y="84" width="64" height="34" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1.6" />
        <circle cx="46" cy="101" r="9" fill="#451a03" />
        {/* Steel U-shaped tuning fork */}
        <path d="M 33 12 L 33 56 Q 33 68 46 68 Q 59 68 59 56 L 59 12" fill="none" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
        <line x1="46" y1="68" x2="46" y2="84" stroke="#cbd5e1" strokeWidth="5.5" />
      </svg>
    );
  }

  if (spec.id === 'pulley_wheel') {
    return (
      <svg viewBox="0 0 92 116" className="w-[84px] h-[106px] overflow-visible drop-shadow-[0_10px_12px_rgba(0,0,0,0.45)]">
        <line x1="46" y1="6" x2="46" y2="24" stroke="#cbd5e1" strokeWidth="3.5" />
        <circle cx="46" cy="62" r="32" fill="#d97706" stroke="#78350f" strokeWidth="2.5" />
        <circle cx="46" cy="62" r="24" fill="#92400e" />
        <circle cx="46" cy="62" r="18" fill="#fbbf24" />
        <path d="M 32 26 L 46 62 L 60 26" fill="none" stroke="#475569" strokeWidth="5" strokeLinejoin="round" />
        <circle cx="46" cy="62" r="5.5" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" />
      </svg>
    );
  }

  if (spec.id === 'calorimeter_cup') {
    return (
      <svg viewBox="0 0 108 118" className="w-[98px] h-[108px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]">
        {/* Thermometer + Stirrer sticking up */}
        <line x1="38" y1="8" x2="38" y2="38" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="68" y1="12" x2="68" y2="38" stroke="#cbd5e1" strokeWidth="2.5" />
        {/* Insulated lid */}
        <rect x="18" y="34" width="72" height="11" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.4" />
        {/* Brushed aluminum double cylinder cup */}
        <rect x="20" y="45" width="68" height="62" rx="6" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.8" />
        <rect x="26" y="64" width="56" height="18" rx="3" fill="#0f172a" />
        <text x="54" y="76" textAnchor="middle" fill="#fda4af" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
          {readingValue.slice(0, 8)}
        </text>
      </svg>
    );
  }

  // 12. Remaining Benchtop Electrical/Mechanics Modules (Power Supply, Resistor Box, Capacitor Bank, Air Track Cart, Wave Vibrator)
  return (
    <svg viewBox="0 0 156 84" className="w-[144px] h-[78px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.46)]">
      {spec.id === 'air_track_cart' ? (
        <>
          <rect x="10" y="54" width="136" height="10" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
          <polygon points="28,54 44,24 112,24 128,54" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.6" />
          <rect x="66" y="8" width="24" height="16" rx="2" fill="#f43f5e" />
          <text x="78" y="43" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
            {readingValue.slice(0, 8)}
          </text>
        </>
      ) : spec.id === 'capacitor_bank' ? (
        <>
          <rect x="16" y="52" width="124" height="22" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <rect x="34" y="16" width="24" height="38" rx="4" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.4" />
          <rect x="66" y="16" width="24" height="38" rx="4" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.4" />
          <rect x="98" y="16" width="24" height="38" rx="4" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.4" />
          <text x="78" y="66" textAnchor="middle" fill="#34d399" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
            {readingValue.slice(0, 10)}
          </text>
        </>
      ) : (
        <>
          {/* Compact Benchtop Instrument Chassis (Power Supply / Decade Box / Wave Vibrator) */}
          <rect x="10" y="10" width="136" height="64" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.8" />
          <rect x="20" y="20" width="66" height="24" rx="3" fill="#020617" stroke="#334155" strokeWidth="1" />
          <text x="53" y="36" textAnchor="middle" fill="#34d399" fontSize="10.5" fontWeight="900" fontFamily="monospace">
            {readingValue.slice(0, 10)}
          </text>
          {/* Rotary control knob */}
          <circle cx="116" cy="34" r="13" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.6" />
          <line x1="116" y1="34" x2="123" y2="25" stroke={spec.accentHex} strokeWidth="2.5" strokeLinecap="round" />
          {/* Red & Black Terminals */}
          <circle cx="30" cy="59" r="6" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.4" />
          <circle cx="52" cy="59" r="6" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.4" />
          <rect x="70" y="54" width="22" height="10" rx="2" fill={spec.accentHex} />
        </>
      )}
    </svg>
  );
};

export const PhysicsApparatusWorkbench: React.FC<PhysicsApparatusWorkbenchProps> = ({
  dimension,
  simId,
  domainId,
  simParams,
  simTimeRef,
  simTime = 0,
  stageClassName = '',
  onPlacedToolsChange,
  children
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const stageRef = useRef<HTMLDivElement | null>(null);
  const [placedTools, setPlacedTools] = useState<PlacedApparatusInstance[]>([]);
  const [show2DOverlayIn3D, setShow2DOverlayIn3D] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ApparatusCategoryId>('all');

  useEffect(() => {
    onPlacedToolsChange?.(placedTools);
  }, [placedTools, onPlacedToolsChange]);

  // Lightweight UI clock (~10 Hz) for probe telemetry, stopwatch & compass needles without parent re-renders
  const [liveTick, setLiveTick] = useState(0);
  const [toolStopwatchRunning, setToolStopwatchRunning] = useState(false);
  const [toolStopwatchSec, setToolStopwatchSec] = useState(0);

  useEffect(() => {
    if (placedTools.length === 0 && !toolStopwatchRunning) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      setLiveTick((v) => v + 1);
      if (toolStopwatchRunning) {
        setToolStopwatchSec((prev) => prev + Math.min(0.2, dt));
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [placedTools.length, toolStopwatchRunning]);

  const recommendedTools = useMemo(
    () => getRecommendedToolsForSim(dimension, simId, domainId),
    [dimension, simId, domainId]
  );

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PHYSICS_APPARATUS_CATALOG.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.viName.toLowerCase().includes(q) ||
        item.enName.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q)
      );
    });
  }, [categoryFilter, searchQuery]);

  const addToolAt = (toolId: string, xPct?: number, yPct?: number) => {
    setPlacedTools((prev) => {
      const idx = prev.length;
      const defaultX = xPct ?? Math.min(82, 18 + (idx % 4) * 20);
      const defaultY = yPct ?? Math.min(78, 22 + Math.floor(idx / 4) * 24);
      return [
        ...prev,
        {
          uid: `${toolId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          toolId,
          xPct: Math.max(8, Math.min(92, defaultX)),
          yPct: Math.max(10, Math.min(88, defaultY)),
          rotationDeg: 0,
          massValueGrams: 200
        }
      ];
    });
  };

  const quickAddRecommendedKit = () => {
    const existingIds = new Set(placedTools.map((p) => p.toolId));
    const missing = recommendedTools.filter((r) => !existingIds.has(r.id));
    if (missing.length === 0) return;
    setPlacedTools((prev) => [
      ...prev,
      ...missing.map((item, idx) => ({
        uid: `${item.id}_${Date.now()}_${idx}`,
        toolId: item.id,
        xPct: Math.min(84, 16 + ((prev.length + idx) % 4) * 21),
        yPct: Math.min(80, 20 + Math.floor((prev.length + idx) / 4) * 24),
        rotationDeg: 0,
        massValueGrams: 200
      }))
    ]);
  };

  // Dragging from toolbox into stage
  const handleStageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes('application/x-physics-tool')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleStageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const toolId = e.dataTransfer.getData('application/x-physics-tool');
    if (!toolId || !stageRef.current) return;
    e.preventDefault();
    const rect = stageRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 100;
    const yPct = ((e.clientY - rect.top) / Math.max(1, rect.height)) * 100;
    addToolAt(toolId, xPct, yPct);
  };

  // Pointer repositioning of placed instruments inside stage
  const dragStateRef = useRef<{ uid: string; offsetX: number; offsetY: number } | null>(null);

  const handleWidgetPointerDown = (e: React.PointerEvent<HTMLDivElement>, inst: PlacedApparatusInstance) => {
    if ((e.target as HTMLElement).closest('button, [data-clickable-part="true"]')) return;
    e.stopPropagation();
    e.preventDefault();
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const curX = (inst.xPct / 100) * rect.width + rect.left;
    const curY = (inst.yPct / 100) * rect.height + rect.top;
    dragStateRef.current = {
      uid: inst.uid,
      offsetX: e.clientX - curX,
      offsetY: e.clientY - curY
    };

    const onMove = (ev: PointerEvent) => {
      if (!dragStateRef.current || !stageRef.current) return;
      const r = stageRef.current.getBoundingClientRect();
      const nextX = ((ev.clientX - dragStateRef.current.offsetX - r.left) / Math.max(1, r.width)) * 100;
      const nextY = ((ev.clientY - dragStateRef.current.offsetY - r.top) / Math.max(1, r.height)) * 100;
      const targetUid = dragStateRef.current.uid;
      setPlacedTools((prev) =>
        prev.map((item) =>
          item.uid === targetUid
            ? {
                ...item,
                xPct: Math.max(6, Math.min(94, nextX)),
                yPct: Math.max(8, Math.min(90, nextY))
              }
            : item
        )
      );
    };

    const onUp = () => {
      dragStateRef.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const currentSimTime = simTimeRef ? simTimeRef.current : simTime;
  void liveTick;

  const renderHoverActions = (
    onRotate: () => void,
    onRemove: () => void,
    showRotate = true
  ) => (
    <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 absolute -top-3.5 -right-2 flex items-center gap-1 z-20">
      {showRotate && (
        <button
          type="button"
          onClick={onRotate}
          className="w-5 h-5 rounded-full bg-slate-900/90 text-amber-300 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center shadow cursor-pointer"
          title={isEn ? 'Rotate +15°' : 'Xoay +15°'}
        >
          <RotateCw className="w-2.5 h-2.5" />
        </button>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="w-5 h-5 rounded-full bg-slate-900/90 text-rose-400 hover:bg-rose-600 hover:text-white flex items-center justify-center shadow cursor-pointer"
        title={isEn ? 'Remove instrument' : 'Cất dụng cụ'}
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  );

  return (
    <div className="sim-physics-scope space-y-2">
      {/* RECOMMENDED TOOLS STRIP + APPARATUS DRAWER TOGGLE */}
      <div className="rounded-[4px] border border-slate-200/90 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 px-3 py-2 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              {isEn ? 'Suggested Lab Kit:' : 'Gợi ý dụng cụ cần có:'}
            </span>
            {recommendedTools.map((tool) => (
              <div
                key={tool.id}
                role="button"
                tabIndex={0}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/x-physics-tool', tool.id);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => addToolAt(tool.id)}
                title={isEn ? `Drag or click to add: ${tool.shortDescEn}` : `Kéo thả hoặc bấm để đặt: ${tool.shortDescVi}`}
                className="group sim-btn-tile sim-btn-phy inline-flex items-center gap-1 px-2.5 py-1 rounded-[3px] text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-300/90 dark:border-slate-700 hover:border-sky-500 text-slate-700 dark:text-slate-200 cursor-grab active:cursor-grabbing select-none shadow-2xs"
              >
                <span
                  className="w-2 h-2 rounded-[1px] shrink-0"
                  style={{ backgroundColor: tool.accentHex }}
                />
                <span className="truncate max-w-[140px]">{isEn ? tool.enName : tool.viName}</span>
                <Plus className="w-3 h-3 text-sky-500 opacity-75 group-hover:opacity-100" />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={quickAddRecommendedKit}
              className="group sim-btn-phy sim-btn-hero px-2.5 py-1 rounded-[3px] border border-sky-400/60 text-[11px] font-bold bg-sky-600 hover:bg-sky-700 text-white cursor-pointer whitespace-nowrap"
            >
              {isEn ? '+ Quick Kit' : '+ Đặt bộ gợi ý'}
            </button>

            {placedTools.length > 0 && dimension === '3d' && (
              <button
                type="button"
                onClick={() => setShow2DOverlayIn3D((v) => !v)}
                className={`group sim-btn-phy inline-flex items-center gap-1 px-2 py-1 rounded-[3px] text-[11px] font-semibold border cursor-pointer whitespace-nowrap ${
                  show2DOverlayIn3D
                    ? 'bg-sky-600 text-white border-sky-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                }`}
                title="Bật/tắt dụng cụ 2D trực quan nổi trên mô hình 3D"
              >
                <span>{show2DOverlayIn3D ? 'Ẩn dụng cụ 2D' : 'Hiện dụng cụ 2D'}</span>
              </button>
            )}

            {placedTools.length > 0 && (
              <button
                type="button"
                onClick={() => setPlacedTools([])}
                className="group sim-btn-phy inline-flex items-center gap-1 px-2 py-1 rounded-[3px] text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 hover:bg-rose-100 cursor-pointer"
                title={isEn ? 'Remove all apparatus' : 'Cất hết dụng cụ'}
              >
                <Trash2 className="w-3 h-3" />
                <span>({placedTools.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setDrawerOpen((o) => !o)}
              className={`group sim-btn-phy sim-btn-hero inline-flex items-center gap-1 px-2.5 py-1 rounded-[3px] text-[11px] font-bold border cursor-pointer ${
                drawerOpen
                  ? 'sim-btn-active bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 border-slate-900 dark:border-amber-400'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-amber-500'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{isEn ? `Lab Apparatus (${PHYSICS_APPARATUS_CATALOG.length})` : `Kho dụng cụ (${PHYSICS_APPARATUS_CATALOG.length})`}</span>
              {drawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* EXPANDABLE SEARCHABLE APPARATUS DOCK */}
        {drawerOpen && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? 'Search apparatus (voltmeter, ruler, compass...)' : 'Tìm kiếm dụng cụ thí nghiệm (ampe kế, thước, từ trường...)'}
                  className="w-full pl-8 pr-7 py-1.5 rounded-md bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1">
                {APPARATUS_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                      categoryFilter === cat.id
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                    }`}
                  >
                    {isEn ? cat.en : cat.vi}
                  </button>
                ))}
              </div>
            </div>

            {/* Draggable Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredCatalog.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/x-physics-tool', item.id);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  onClick={() => addToolAt(item.id)}
                  title={isEn ? item.shortDescEn : item.shortDescVi}
                  className="flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-md bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-500 cursor-grab active:cursor-grabbing select-none transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-extrabold text-white shrink-0"
                      style={{ backgroundColor: item.accentHex }}
                    >
                      {item.symbol}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
                        {isEn ? item.enName : item.viName}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 truncate">{item.unit}</div>
                    </div>
                  </div>
                  <GripVertical className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
              ))}
              {filteredCatalog.length === 0 && (
                <div className="col-span-full py-3 text-center text-xs text-slate-500">
                  {isEn ? 'No apparatus found.' : 'Không tìm thấy dụng cụ phù hợp.'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SIMULATION STAGE WITH DRAG-DROP RECEIVER & FRAMELESS REALISTIC INSTRUMENTS */}
      <div
        ref={stageRef}
        onDragOver={handleStageDragOver}
        onDrop={handleStageDrop}
        className={`relative ${stageClassName}`}
      >
        {children}

        {/* Floating Placed Instruments Layer (ZERO outer box frames — pure real-world instruments only) */}
        {placedTools.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none">
            {placedTools.map((inst) => {
              const spec: PhysicsApparatusItem | undefined = APPARATUS_BY_ID[inst.toolId];
              if (!spec) return null;

              const reading = evaluateApparatusReading(
                inst.toolId,
                simId,
                simParams,
                currentSimTime,
                inst.xPct,
                inst.yPct
              );

              const removeOne = () =>
                setPlacedTools((prev) => prev.filter((item) => item.uid !== inst.uid));

              const rotateBy = (delta: number) =>
                setPlacedTools((prev) =>
                  prev.map((item) =>
                    item.uid === inst.uid
                      ? { ...item, rotationDeg: (item.rotationDeg + delta + 360) % 360 }
                      : item
                  )
                );

              // SPECIAL INTERACTIVE 1: FRAMELESS REAL WOOD/ACRYLIC CM-MM RULER
              if (spec.widgetKind === 'ruler') {
                return (
                  <div
                    key={inst.uid}
                    onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                    style={{
                      left: `${inst.xPct}%`,
                      top: `${inst.yPct}%`,
                      transform: `translate(-50%, -50%) rotate(${inst.rotationDeg}deg)`
                    }}
                    className="pointer-events-auto absolute cursor-move group bg-transparent"
                    title={`${spec.viName} (${inst.rotationDeg}°)`}
                  >
                    {renderHoverActions(() => rotateBy(15), removeOne)}
                    <svg viewBox="0 0 240 36" className="w-[230px] h-[34px] overflow-visible drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]">
                      <defs>
                        <linearGradient id={`ruler-wood-${inst.uid}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(253, 224, 71, 0.88)" />
                          <stop offset="100%" stopColor="rgba(245, 158, 11, 0.88)" />
                        </linearGradient>
                      </defs>
                      <rect
                        x="2"
                        y="2"
                        width="236"
                        height="32"
                        rx="3"
                        fill={`url(#ruler-wood-${inst.uid})`}
                        stroke="#92400e"
                        strokeWidth="1.2"
                      />
                      {Array.from({ length: 41 }).map((_, idx) => {
                        const x = 14 + idx * 5.3;
                        const isMajor = idx % 4 === 0;
                        const isMid = idx % 2 === 0 && !isMajor;
                        const tickH = isMajor ? 13 : isMid ? 9 : 5.5;
                        return (
                          <g key={idx}>
                            <line x1={x} y1="2" x2={x} y2={2 + tickH} stroke="#1e293b" strokeWidth={isMajor ? 1.2 : 0.7} />
                            {isMajor && (
                              <text x={x} y="25" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">
                                {(idx / 2).toFixed(0)}
                              </text>
                            )}
                          </g>
                        );
                      })}
                      <text x="228" y="30" textAnchor="end" fill="#78350f" fontSize="6.5" fontWeight="bold" fontFamily="monospace">
                        cm
                      </text>
                    </svg>
                  </div>
                );
              }

              // SPECIAL INTERACTIVE 2: CRYSTAL-CLEAR 360° ACRYLIC PROTRACTOR
              if (spec.widgetKind === 'protractor') {
                return (
                  <div
                    key={inst.uid}
                    onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                    style={{
                      left: `${inst.xPct}%`,
                      top: `${inst.yPct}%`,
                      transform: `translate(-50%, -50%) rotate(${inst.rotationDeg}deg)`
                    }}
                    className="pointer-events-auto absolute cursor-move group bg-transparent"
                    title={`${spec.viName} (${inst.rotationDeg}°)`}
                  >
                    {renderHoverActions(() => rotateBy(15), removeOne)}
                    <svg viewBox="0 0 140 140" className="w-[132px] h-[132px] overflow-visible drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)]">
                      <circle
                        cx="70"
                        cy="70"
                        r="64"
                        fill="rgba(226, 232, 240, 0.16)"
                        stroke="rgba(248, 250, 252, 0.72)"
                        strokeWidth="1.6"
                      />
                      <circle cx="70" cy="70" r="24" fill="none" stroke="rgba(248, 250, 252, 0.35)" strokeWidth="1" />
                      <line x1="10" y1="70" x2="130" y2="70" stroke="rgba(167, 139, 250, 0.55)" strokeWidth="1" strokeDasharray="3 2" />
                      <line x1="70" y1="10" x2="70" y2="130" stroke="rgba(167, 139, 250, 0.55)" strokeWidth="1" strokeDasharray="3 2" />
                      <circle cx="70" cy="70" r="2.8" fill="#f43f5e" />
                      {Array.from({ length: 36 }).map((_, i) => {
                        const deg = i * 10;
                        const ang = ((deg - 90) * Math.PI) / 180;
                        const isMajor = deg % 30 === 0;
                        const rIn = isMajor ? 53 : 58;
                        const x1 = 70 + Math.cos(ang) * rIn;
                        const y1 = 70 + Math.sin(ang) * rIn;
                        const x2 = 70 + Math.cos(ang) * 64;
                        const y2 = 70 + Math.sin(ang) * 64;
                        return (
                          <g key={i}>
                            <line
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke={isMajor ? '#e2e8f0' : 'rgba(226,232,240,0.55)'}
                              strokeWidth={isMajor ? 1.4 : 0.8}
                            />
                            {deg % 90 === 0 && (
                              <text
                                x={70 + Math.cos(ang) * 44}
                                y={70 + Math.sin(ang) * 44 + 3}
                                textAnchor="middle"
                                fill="#f8fafc"
                                fontSize="8"
                                fontWeight="bold"
                                fontFamily="monospace"
                              >
                                {deg}°
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                );
              }

              // SPECIAL INTERACTIVE 3: REAL CHROME ATHLETIC STOPWATCH (Buttons built right onto physical lugs)
              if (spec.widgetKind === 'stopwatch') {
                const secAngle = (toolStopwatchSec % 60) * 6;
                return (
                  <div
                    key={inst.uid}
                    onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                    style={{
                      left: `${inst.xPct}%`,
                      top: `${inst.yPct}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="pointer-events-auto absolute cursor-move group bg-transparent"
                    title={spec.viName}
                  >
                    {renderHoverActions(() => {}, removeOne, false)}
                    <svg viewBox="0 0 120 138" className="w-[114px] h-[132px] overflow-visible drop-shadow-[0_10px_16px_rgba(0,0,0,0.5)]">
                      <defs>
                        <linearGradient id={`sw-chrome-${inst.uid}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#f8fafc" />
                          <stop offset="45%" stopColor="#94a3b8" />
                          <stop offset="100%" stopColor="#475569" />
                        </linearGradient>
                      </defs>
                      {/* Top lanyard loop & crown */}
                      <circle cx="60" cy="14" r="9" fill="none" stroke="#cbd5e1" strokeWidth="2.8" />
                      <rect x="54" y="20" width="12" height="10" rx="2" fill={`url(#sw-chrome-${inst.uid})`} stroke="#334155" strokeWidth="1" />
                      {/* Clickable Reset Plunger (Top Left Lug) */}
                      <g
                        data-clickable-part="true"
                        onClick={() => {
                          setToolStopwatchRunning(false);
                          setToolStopwatchSec(0);
                        }}
                        className="cursor-pointer"
                      >
                        <title>{isEn ? 'Reset Stopwatch' : 'Đặt lại 0.00s'}</title>
                        <rect
                          x="22"
                          y="24"
                          width="10"
                          height="13"
                          rx="2"
                          transform="rotate(-32 27 30)"
                          fill="#64748b"
                          stroke="#e2e8f0"
                          strokeWidth="1.2"
                        />
                      </g>
                      {/* Clickable Start/Pause Plunger (Top Right Lug) */}
                      <g
                        data-clickable-part="true"
                        onClick={() => setToolStopwatchRunning((r) => !r)}
                        className="cursor-pointer"
                      >
                        <title>{toolStopwatchRunning ? 'Dừng bấm giờ' : 'Bắt đầu bấm giờ'}</title>
                        <rect
                          x="88"
                          y="24"
                          width="10"
                          height="14"
                          rx="2"
                          transform="rotate(32 93 30)"
                          fill={toolStopwatchRunning ? '#f59e0b' : '#10b981'}
                          stroke="#f8fafc"
                          strokeWidth="1.2"
                        />
                      </g>
                      {/* Metallic round stopwatch case & white dial */}
                      <circle cx="60" cy="80" r="50" fill={`url(#sw-chrome-${inst.uid})`} stroke="#1e293b" strokeWidth="2" />
                      <circle cx="60" cy="80" r="42" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
                      {Array.from({ length: 12 }).map((_, i) => {
                        const ang = (i * 30 * Math.PI) / 180;
                        return (
                          <line
                            key={i}
                            x1={60 + Math.sin(ang) * 35}
                            y1={80 - Math.cos(ang) * 35}
                            x2={60 + Math.sin(ang) * 40}
                            y2={80 - Math.cos(ang) * 40}
                            stroke="#0f172a"
                            strokeWidth="1.6"
                          />
                        );
                      })}
                      {/* Embedded LCD digital readout right on dial */}
                      <rect x="33" y="92" width="54" height="15" rx="2.5" fill="#064e3b" stroke="#0f172a" strokeWidth="1" />
                      <text x="60" y="103" textAnchor="middle" fill="#6ee7b7" fontSize="9.5" fontWeight="900" fontFamily="monospace">
                        {toolStopwatchSec.toFixed(2)}s
                      </text>
                      {/* Clickable central Run/Stop button hint */}
                      <g transform={`translate(60, 80) rotate(${secAngle})`}>
                        <line x1="0" y1="6" x2="0" y2="-35" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="0" cy="0" r="4" fill="#1e293b" />
                      </g>
                    </svg>
                  </div>
                );
              }

              // SPECIAL INTERACTIVE 4: REAL BENCHTOP CRT OSCILLOSCOPE CRO
              if (spec.widgetKind === 'oscilloscope') {
                const freq = reading.waveFreq ?? 2;
                const amp = reading.waveAmp ?? 0.6;
                const dPath = Array.from({ length: 32 })
                  .map((_, i) => {
                    const x = 18 + i * 3.1;
                    const y = 44 - Math.sin(i * freq * 0.35 - currentSimTime * 6) * (18 * amp);
                    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
                  })
                  .join(' ');
                return (
                  <div
                    key={inst.uid}
                    onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                    style={{
                      left: `${inst.xPct}%`,
                      top: `${inst.yPct}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="pointer-events-auto absolute cursor-move group bg-transparent"
                    title={spec.viName}
                  >
                    {renderHoverActions(() => {}, removeOne, false)}
                    <svg viewBox="0 0 184 108" className="w-[176px] h-[102px] overflow-visible drop-shadow-[0_12px_18px_rgba(0,0,0,0.52)]">
                      {/* Molded steel oscilloscope chassis */}
                      <rect x="6" y="10" width="172" height="90" rx="6" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                      {/* Carry handle on top */}
                      <path d="M 52 10 L 56 3 L 128 3 L 132 10" fill="none" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />
                      {/* Recessed dark CRT phosphor screen */}
                      <rect x="14" y="18" width="104" height="54" rx="4" fill="#03261b" stroke="#0f172a" strokeWidth="2.5" />
                      <line x1="14" y1="45" x2="118" y2="45" stroke="rgba(16,185,129,0.28)" strokeWidth="1" />
                      <line x1="66" y1="18" x2="66" y2="72" stroke="rgba(16,185,129,0.28)" strokeWidth="1" />
                      <path d={dPath} fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" />
                      {/* Live scope measurement etched in CRT corner */}
                      <text x="19" y="29" fill="#6ee7b7" fontSize="8" fontWeight="bold" fontFamily="monospace">
                        {reading.valueText.slice(0, 11)}
                      </text>
                      {/* Rotary knobs on right control bay */}
                      <circle cx="136" cy="30" r="8" fill="#1e293b" stroke="#64748b" strokeWidth="1.2" />
                      <line x1="136" y1="30" x2="140" y2="23" stroke="#38bdf8" strokeWidth="1.8" />
                      <circle cx="160" cy="30" r="8" fill="#1e293b" stroke="#64748b" strokeWidth="1.2" />
                      <line x1="160" y1="30" x2="155" y2="24" stroke="#f59e0b" strokeWidth="1.8" />
                      <circle cx="136" cy="54" r="6.5" fill="#334155" stroke="#0f172a" strokeWidth="1" />
                      <circle cx="160" cy="54" r="6.5" fill="#334155" stroke="#0f172a" strokeWidth="1" />
                      {/* BNC metal jacks at lower panel */}
                      <circle cx="134" cy="82" r="6.5" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />
                      <circle cx="134" cy="82" r="2.2" fill="#020617" />
                      <circle cx="158" cy="82" r="6.5" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />
                      <circle cx="158" cy="82" r="2.2" fill="#020617" />
                      {/* Power LED + toggle */}
                      <circle cx="24" cy="85" r="3.5" fill="#ef4444" />
                      <rect x="36" y="80" width="54" height="10" rx="2" fill="#0f172a" />
                      <text x="63" y="87.5" textAnchor="middle" fill="#cbd5e1" fontSize="7" fontFamily="monospace">
                        {reading.subLabel.slice(0, 10)}
                      </text>
                    </svg>
                  </div>
                );
              }

              // SPECIAL INTERACTIVE 5: REAL BRASS POCKET MAGNETIC COMPASS
              if (spec.widgetKind === 'compass') {
                return (
                  <div
                    key={inst.uid}
                    onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                    style={{
                      left: `${inst.xPct}%`,
                      top: `${inst.yPct}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="pointer-events-auto absolute cursor-move group bg-transparent"
                    title={`${spec.viName}: ${reading.valueText}`}
                  >
                    {renderHoverActions(() => {}, removeOne, false)}
                    <svg viewBox="0 0 104 118" className="w-[94px] h-[108px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.48)]">
                      {/* Top brass ring */}
                      <circle cx="52" cy="11" r="7" fill="none" stroke="#fbbf24" strokeWidth="2.8" />
                      {/* Machined brass housing */}
                      <circle cx="52" cy="64" r="44" fill="#d97706" stroke="#78350f" strokeWidth="2" />
                      <circle cx="52" cy="64" r="37" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.2" />
                      <text x="52" y="38" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="900">N</text>
                      <text x="52" y="95" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">S</text>
                      <text x="23" y="67" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">W</text>
                      <text x="81" y="67" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">E</text>
                      {/* Animated rotating magnetic needle */}
                      <g transform={`translate(52, 64) rotate(${reading.needleDeg ?? 0})`}>
                        <polygon points="0,-28 -4.5,0 4.5,0" fill="#ef4444" />
                        <polygon points="0,28 -4.5,0 4.5,0" fill="#38bdf8" />
                        <circle cx="0" cy="0" r="4" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
                      </g>
                      <rect x="26" y="102" width="52" height="13" rx="2.5" fill="rgba(15,23,42,0.88)" />
                      <text x="52" y="111.5" textAnchor="middle" fill="#fcd34d" fontSize="8" fontWeight="bold" fontFamily="monospace">
                        {reading.valueText.slice(0, 8)}
                      </text>
                    </svg>
                  </div>
                );
              }

              // IN 3D MODE (default compact translucent-free micro tag when using native 3D WebGL geometry)
              if (dimension === '3d' && !show2DOverlayIn3D) {
                return (
                  <div
                    key={inst.uid}
                    onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                    style={{
                      left: `${inst.xPct}%`,
                      top: `${inst.yPct}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="pointer-events-auto absolute cursor-move group flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 text-white shadow whitespace-nowrap"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: spec.accentHex }}
                    />
                    <span className="text-[10px] font-bold text-slate-200 max-w-[100px] truncate">
                      {isEn ? spec.enName : spec.viName}
                    </span>
                    <span className="text-[10px] font-mono font-extrabold text-emerald-400 tabular-nums">
                      {spec.widgetKind === 'component_toggle' ? `${inst.massValueGrams ?? 200}g` : reading.valueText}
                    </span>
                    <button
                      type="button"
                      onClick={() => rotateBy(30)}
                      className="opacity-70 hover:opacity-100 text-amber-300 cursor-pointer"
                      title="Xoay dụng cụ 3D (+30°)"
                    >
                      <RotateCw className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={removeOne}
                      className="opacity-70 hover:opacity-100 text-rose-400 cursor-pointer"
                      title="Gỡ dụng cụ 3D"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              }

              // PURE FRAMELESS REAL-WORLD PHYSICAL INSTRUMENTS (2D Lab or toggled 2D overlay in 3D)
              return (
                <div
                  key={inst.uid}
                  onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                  style={{
                    left: `${inst.xPct}%`,
                    top: `${inst.yPct}%`,
                    transform: `translate(-50%, -50%) rotate(${inst.rotationDeg}deg)`
                  }}
                  className="pointer-events-auto absolute cursor-move group bg-transparent"
                  title={`${isEn ? spec.enName : spec.viName} — ${reading.valueText}`}
                >
                  {renderHoverActions(() => rotateBy(15), removeOne)}

                  <LifelikeInstrumentGraphic
                    spec={spec}
                    readingValue={reading.valueText}
                    simTime={currentSimTime}
                    massValueGrams={inst.massValueGrams}
                  />

                  {spec.widgetKind === 'component_toggle' && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-slate-900/90 rounded-full px-1.5 py-0.5 shadow z-20">
                      {[100, 250, 500].map((gVal) => (
                        <button
                          key={gVal}
                          type="button"
                          onClick={() =>
                            setPlacedTools((prev) =>
                              prev.map((it) => (it.uid === inst.uid ? { ...it, massValueGrams: gVal } : it))
                            )
                          }
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono cursor-pointer ${
                            (inst.massValueGrams ?? 200) === gVal
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {gVal}g
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
