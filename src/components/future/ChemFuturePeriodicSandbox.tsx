import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Atom,
  Box,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Flame,
  FlaskConical,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  CATEGORY_META,
  ElementCategory,
  PERIODIC_ELEMENTS_118,
  PeriodicElement118,
} from '../../data/periodicElements118';
import { detectSoftwareGl, scheduleSyncedGlFrame } from './Pre3DViewportBar';

type TableColorMode = 'category' | 'electronegativity' | 'radius' | 'block';
type ElementStageMode = 'hybrid' | 'atom' | 'reaction' | 'bond3d';
type Bond3DPresetId =
  | 'ionic_nacl'
  | 'covalent_n2'
  | 'vsepr_co2'
  | 'vsepr_h2o'
  | 'vsepr_nh3'
  | 'vsepr_ch4'
  | 'vsepr_sf6';

interface Bond3DSpec {
  id: Bond3DPresetId;
  titleVi: string;
  formula: string;
  bondType: string;
  hybridization: string;
  angle: string;
  deltaChi: string;
  noteVi: string;
}

const BOND_3D_SPECS: Bond3DSpec[] = [
  {
    id: 'ionic_nacl',
    titleVi: 'Liên kết Ion (Mạng tinh thể NaCl)',
    formula: 'Na⁺Cl⁻',
    bondType: 'Liên kết Ion (Tĩnh điện)',
    hybridization: 'Mạng lập phương tâm diện',
    angle: '90° (Số phối trí 6)',
    deltaChi: 'Δχ = 3,16 − 0,93 = 2,23 ≥ 1,7',
    noteVi: 'Na nhường hẳn 1e⁻ lớp 3s¹ cho Cl (3p⁵) tạo cation Na⁺ và anion Cl⁻ hút tĩnh điện đa hướng.',
  },
  {
    id: 'covalent_n2',
    titleVi: 'Cộng hóa trị không phân cực (N≡N)',
    formula: 'N₂',
    bondType: 'Liên kết Ba (1σ + 2π)',
    hybridization: 'Xen phủ trục sp + bên p',
    angle: '180°',
    deltaChi: 'Δχ = 0,00',
    noteVi: 'Hai nguyên tử N góp chung 3 cặp electron tạo 1 liên kết σ bền và 2 đám mây π vuông góc nhau.',
  },
  {
    id: 'vsepr_co2',
    titleVi: 'Hình học Đường thẳng AX₂ (CO₂)',
    formula: 'CO₂',
    bondType: 'Cộng hóa trị có cực (Đối xứng không cực)',
    hybridization: 'sp',
    angle: '180°',
    deltaChi: 'Δχ(C–O) = 0,89',
    noteVi: 'Hai cặp electron liên kết đẩy nhau cực đại về 2 phía 180°, hai vectơ lưỡng cực triệt tiêu nhau.',
  },
  {
    id: 'vsepr_h2o',
    titleVi: 'Hình học Chữ V / Gấp khúc AX₂E₂ (H₂O)',
    formula: 'H₂O',
    bondType: 'Cộng hóa trị phân cực mạnh',
    hybridization: 'sp³ (2 cặp e⁻ tự do)',
    angle: '104,5°',
    deltaChi: 'Δχ(O–H) = 1,24',
    noteVi: 'Hai cặp electron chưa liên kết (E₂) ép góc H–O–H co từ 109,5° xuống còn 104,5°.',
  },
  {
    id: 'vsepr_nh3',
    titleVi: 'Hình học Chóp Tam giác AX₃E (NH₃)',
    formula: 'NH₃',
    bondType: 'Cộng hóa trị phân cực',
    hybridization: 'sp³ (1 cặp e⁻ tự do)',
    angle: '107°',
    deltaChi: 'Δχ(N–H) = 0,84',
    noteVi: 'Một cặp electron tự do ở đỉnh chóp đẩy 3 liên kết N–H xuống tạo hình chóp tam giác.',
  },
  {
    id: 'vsepr_ch4',
    titleVi: 'Hình học Tứ diện Đều AX₄ (CH₄)',
    formula: 'CH₄',
    bondType: 'Cộng hóa trị (Phân tử không cực)',
    hybridization: 'sp³',
    angle: '109,5°',
    deltaChi: 'Δχ(C–H) = 0,35',
    noteVi: '4 obitan lai hóa sp³ hướng về 4 đỉnh tứ diện đều đối xứng hoàn toàn trong không gian 3D.',
  },
  {
    id: 'vsepr_sf6',
    titleVi: 'Hình học Bát diện AX₆ (SF₆)',
    formula: 'SF₆',
    bondType: 'Cộng hóa trị mở rộng bát tử',
    hybridization: 'sp³d²',
    angle: '90°',
    deltaChi: 'Δχ(S–F) = 1,40',
    noteVi: 'Lưu huỳnh mở rộng vỏ hóa trị với 6 liên kết S–F đối xứng theo 3 trục trực giao X, Y, Z.',
  },
];

function suggestBondPresetForElement(el: PeriodicElement118): Bond3DPresetId {
  if (el.sym === 'N') return 'vsepr_nh3';
  if (el.sym === 'O' || el.sym === 'H') return 'vsepr_h2o';
  if (el.sym === 'C' || el.sym === 'Si') return 'vsepr_ch4';
  if (el.sym === 'S' || el.sym === 'F') return 'vsepr_sf6';
  if (el.sym === 'Be' || el.sym === 'B') return 'vsepr_co2';
  if (
    el.category === 'alkali' ||
    el.category === 'alkaline_earth' ||
    el.sym === 'Cl' ||
    el.sym === 'Br' ||
    el.sym === 'I'
  ) {
    return 'ionic_nacl';
  }
  return 'covalent_n2';
}

function wavelengthToHex(nm: number): string {
  if (nm < 380) return '#a855f7';
  if (nm < 440) return '#818cf8';
  if (nm < 490) return '#38bdf8';
  if (nm < 520) return '#2dd4bf';
  if (nm < 565) return '#4ade80';
  if (nm < 590) return '#facc15';
  if (nm < 625) return '#fb923c';
  if (nm <= 780) return '#f43f5e';
  return '#e11d48';
}

function getHeatColor(val: number | null, min: number, max: number, warm: boolean): string {
  if (val == null) return 'rgba(30, 41, 59, 0.72)';
  const t = Math.max(0, Math.min(1, (val - min) / Math.max(0.0001, max - min)));
  if (warm) {
    const r = Math.round(30 + t * 215);
    const g = Math.round(58 + (1 - Math.abs(t - 0.5) * 2) * 110);
    const b = Math.round(140 - t * 100);
    return `rgba(${r}, ${g}, ${b}, 0.85)`;
  }
  const r = Math.round(14 + t * 20);
  const g = Math.round(116 + (1 - t) * 70);
  const b = Math.round(144 + t * 105);
  return `rgba(${r}, ${g}, ${b}, 0.85)`;
}

export const ChemFuturePeriodicSandbox: React.FC<{
  onEarnXP?: (xp: number) => void;
}> = ({ onEarnXP }) => {
  const [showTable, setShowTable] = useState(true);
  const [selectedZ, setSelectedZ] = useState<number>(11); // Default Na (vivid alkali reaction)
  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState<'all' | ElementCategory>('all');
  const [colorMode, setColorMode] = useState<TableColorMode>('category');
  const [stageMode, setStageMode] = useState<ElementStageMode>('hybrid');
  const [bondPreset, setBondPreset] = useState<Bond3DPresetId>('ionic_nacl');
  const [reactionPulseTick, setReactionPulseTick] = useState(1);
  const [animSpeed, setAnimSpeed] = useState(1);
  const [waveTick, setWaveTick] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bondMountRef = useRef<HTMLDivElement | null>(null);
  const isSoftwareGl = useMemo(() => detectSoftwareGl(), []);
  const pulseStartRef = useRef<number>(performance.now());
  const selectedElRef = useRef<PeriodicElement118>(PERIODIC_ELEMENTS_118[10]);
  const stageModeRef = useRef<ElementStageMode>(stageMode);
  const speedRef = useRef<number>(animSpeed);

  const selectedEl = useMemo(
    () => PERIODIC_ELEMENTS_118.find((e) => e.z === selectedZ) || PERIODIC_ELEMENTS_118[0],
    [selectedZ]
  );
  const activeBondSpec = useMemo(
    () => BOND_3D_SPECS.find((b) => b.id === bondPreset) || BOND_3D_SPECS[0],
    [bondPreset]
  );
  selectedElRef.current = selectedEl;
  stageModeRef.current = stageMode;
  speedRef.current = animSpeed;

  // Periodic resonance shimmer index across columns 1..18
  useEffect(() => {
    const id = window.setInterval(() => {
      setWaveTick((w) => (w % 18) + 1);
    }, 180);
    return () => window.clearInterval(id);
  }, []);

  const handleSelectElement = (z: number) => {
    setSelectedZ(z);
    const el = PERIODIC_ELEMENTS_118.find((e) => e.z === z);
    if (el) setBondPreset(suggestBondPresetForElement(el));
    pulseStartRef.current = performance.now();
    setReactionPulseTick((n) => n + 1);
    onEarnXP?.(4);
  };

  const triggerReactionBurst = () => {
    pulseStartRef.current = performance.now();
    setReactionPulseTick((n) => n + 1);
    onEarnXP?.(6);
  };

  const matchedZSet = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const set = new Set<number>();
    PERIODIC_ELEMENTS_118.forEach((el) => {
      const catOk = catFilter === 'all' || el.category === catFilter;
      const qOk =
        !q ||
        el.sym.toLowerCase().includes(q) ||
        el.nameVi.toLowerCase().includes(q) ||
        el.nameEn.toLowerCase().includes(q) ||
        String(el.z) === q;
      if (catOk && qOk) set.add(el.z);
    });
    return set;
  }, [searchQuery, catFilter]);

  // Element-specific "Hyper-Chemical" Canvas Animation Loop
  useEffect(() => {
    if (stageMode === 'bond3d') return;
    let raf = 0;
    let time = 0;
    let last = performance.now();

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
      kind: 'spark' | 'bubble' | 'photon' | 'alpha';
    }
    const particles: Particle[] = [];

    const spawnBurst = (el: PeriodicElement118, w: number, h: number, count: number) => {
      const cx = stageModeRef.current === 'atom' ? w * 0.5 : w * 0.72;
      const cy = h * 0.44;
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 25 + Math.random() * 95;
        particles.push({
          x: cx + (Math.random() - 0.5) * 28,
          y: cy + (Math.random() - 0.5) * 24,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - (el.category === 'alkali' ? 40 : 12),
          life: 0.7 + Math.random() * 0.9,
          maxLife: 1.4,
          size: 2 + Math.random() * 3.8,
          color: i % 3 === 0 ? '#ffffff' : el.flameHex,
          kind: el.category === 'actinide' ? 'alpha' : el.category === 'noble_gas' ? 'photon' : 'spark',
        });
      }
      if (particles.length > 160) particles.splice(0, particles.length - 160);
    };

    // Initial burst when element changes
    const canvas0 = canvasRef.current;
    if (canvas0) {
      const rect0 = canvas0.getBoundingClientRect();
      spawnBurst(selectedElRef.current, rect0.width || 560, rect0.height || 360, 28);
    }

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt * speedRef.current;

      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 10 && rect.height > 10) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const targetW = Math.round(rect.width * dpr);
          const targetH = Math.round(rect.height * dpr);
          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
          }
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const w = rect.width;
            const h = rect.height;
            const el = selectedElRef.current;
            const mode = stageModeRef.current;
            const catMeta = CATEGORY_META[el.category];
            const burstAge = Math.max(0, (now - pulseStartRef.current) / 1000);
            const burstEnergy = Math.max(0, 1 - burstAge / 1.8);

            ctx.save();
            ctx.scale(dpr, dpr);

            // 1. Deep futuristic laboratory backdrop + faint hexagonal chemical grid
            const bgGrad = ctx.createRadialGradient(w * 0.35, h * 0.42, 16, w * 0.5, h * 0.5, w * 0.85);
            bgGrad.addColorStop(0, '#0c182e');
            bgGrad.addColorStop(0.55, '#070e1d');
            bgGrad.addColorStop(1, '#030712');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
            ctx.lineWidth = 1;
            const step = 36;
            for (let gx = 0; gx < w; gx += step) {
              ctx.beginPath();
              ctx.moveTo(gx, 0);
              ctx.lineTo(gx, h - 42);
              ctx.stroke();
            }
            for (let gy = 0; gy < h - 42; gy += step) {
              ctx.beginPath();
              ctx.moveTo(0, gy);
              ctx.lineTo(w, gy);
              ctx.stroke();
            }

            // Ambient aura around active element flame color
            const aura = ctx.createRadialGradient(
              mode === 'atom' ? w * 0.5 : mode === 'reaction' ? w * 0.5 : w * 0.31,
              h * 0.44,
              6,
              mode === 'atom' ? w * 0.5 : mode === 'reaction' ? w * 0.5 : w * 0.31,
              h * 0.44,
              150 + burstEnergy * 55
            );
            aura.addColorStop(0, `${el.flameHex}33`);
            aura.addColorStop(0.6, `${catMeta.accentHex}14`);
            aura.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = aura;
            ctx.fillRect(0, 0, w, h - 42);

            // 2. Quantum Bohr Shells Visualization (Left or Center)
            if (mode !== 'reaction') {
              const atomCx = mode === 'atom' ? w * 0.5 : w * 0.31;
              const atomCy = h * 0.43;
              const maxR = Math.min(mode === 'atom' ? w * 0.38 : w * 0.25, (h - 60) * 0.43);
              const shellCount = el.shells.length;

              // Outer energy pulse ring on click
              if (burstEnergy > 0.02) {
                ctx.beginPath();
                ctx.arc(atomCx, atomCy, (1 - burstEnergy) * maxR * 1.45, 0, Math.PI * 2);
                ctx.strokeStyle = el.flameHex;
                ctx.globalAlpha = burstEnergy * 0.7;
                ctx.lineWidth = 2.5;
                ctx.stroke();
                ctx.globalAlpha = 1;
              }

              // Draw shells + tilted quantum orbits
              el.shells.forEach((eCount, sIdx) => {
                const r = 24 + ((sIdx + 1) / Math.max(1, shellCount)) * (maxR - 22);
                const isValence = sIdx === shellCount - 1;
                const tilt = ((sIdx % 3) - 1) * 0.28 + Math.sin(time * 0.4 + sIdx) * 0.06;

                ctx.save();
                ctx.translate(atomCx, atomCy);
                ctx.rotate(tilt);

                ctx.beginPath();
                ctx.ellipse(0, 0, r, r * (mode === 'atom' ? 0.78 : 0.86), 0, 0, Math.PI * 2);
                ctx.strokeStyle = isValence ? el.flameHex : 'rgba(148, 163, 184, 0.32)';
                ctx.lineWidth = isValence ? 1.6 : 1;
                ctx.setLineDash(isValence ? [] : [4, 4]);
                ctx.stroke();
                ctx.setLineDash([]);

                // Electrons orbiting
                const omega = (1.6 - sIdx * 0.16) * (sIdx % 2 === 0 ? 1 : -1);
                for (let k = 0; k < eCount; k++) {
                  const ang = time * omega + (k / eCount) * Math.PI * 2;
                  const ex = Math.cos(ang) * r;
                  const ey = Math.sin(ang) * r * (mode === 'atom' ? 0.78 : 0.86);

                  ctx.beginPath();
                  ctx.arc(ex, ey, isValence ? 4.2 : 2.8, 0, Math.PI * 2);
                  ctx.fillStyle = isValence ? el.flameHex : '#38bdf8';
                  ctx.fill();

                  if (isValence) {
                    ctx.beginPath();
                    ctx.arc(ex, ey, 7.5, 0, Math.PI * 2);
                    ctx.fillStyle = `${el.flameHex}44`;
                    ctx.fill();
                  }
                }
                ctx.restore();
              });

              // Pulsing Nucleus
              const nucR = 13 + Math.sin(time * 4) * 1.1 + burstEnergy * 3;
              const nucGrad = ctx.createRadialGradient(atomCx - 3, atomCy - 3, 2, atomCx, atomCy, nucR + 4);
              nucGrad.addColorStop(0, '#fef08a');
              nucGrad.addColorStop(0.55, el.flameHex);
              nucGrad.addColorStop(1, '#0f172a');
              ctx.beginPath();
              ctx.arc(atomCx, atomCy, nucR, 0, Math.PI * 2);
              ctx.fillStyle = nucGrad;
              ctx.fill();

              ctx.font = '700 11px ui-monospace, monospace';
              ctx.fillStyle = '#020617';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(el.sym, atomCx, atomCy);

              // Shell caption
              ctx.font = '600 10px ui-monospace, monospace';
              ctx.fillStyle = '#94a3b8';
              ctx.fillText(`Lớp e⁻: [${el.shells.join(' · ')}] · +${el.z}`, atomCx, h - 55);
            }

            // 3. Element-Specific Chemical Phenomenon Stage (Right Side or Center)
            if (mode !== 'atom') {
              const rx = mode === 'reaction' ? w * 0.5 : w * 0.74;
              const ry = h * 0.44;
              const boxW = mode === 'reaction' ? w * 0.72 : w * 0.44;
              const boxH = h - 76;

              // Subtle vessel/chamber divider in hybrid mode
              if (mode === 'hybrid') {
                ctx.beginPath();
                ctx.moveTo(w * 0.52, 18);
                ctx.lineTo(w * 0.52, h - 52);
                ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
                ctx.lineWidth = 1;
                ctx.stroke();
              }

              // Continuous periodic particle emitter tailored to element family
              if (Math.random() < 0.36 * speedRef.current) {
                if (el.category === 'alkali' || el.category === 'alkaline_earth') {
                  particles.push({
                    x: rx + Math.sin(time * 4) * 28 + (Math.random() - 0.5) * 14,
                    y: ry + 26,
                    vx: (Math.random() - 0.5) * 42,
                    vy: -55 - Math.random() * 55,
                    life: 0.75,
                    maxLife: 0.75,
                    size: 2.2 + Math.random() * 2.5,
                    color: Math.random() > 0.3 ? el.flameHex : '#f8fafc',
                    kind: 'spark',
                  });
                } else if (el.category === 'halogen') {
                  particles.push({
                    x: rx + (Math.random() - 0.5) * 70,
                    y: ry + 45,
                    vx: (Math.random() - 0.5) * 18,
                    vy: -24 - Math.random() * 24,
                    life: 1.2,
                    maxLife: 1.2,
                    size: 4 + Math.random() * 5,
                    color: el.flameHex,
                    kind: 'bubble',
                  });
                } else if (el.category === 'actinide' || el.z >= 84) {
                  const a = Math.random() * Math.PI * 2;
                  particles.push({
                    x: rx,
                    y: ry,
                    vx: Math.cos(a) * (85 + Math.random() * 60),
                    vy: Math.sin(a) * (85 + Math.random() * 60),
                    life: 0.85,
                    maxLife: 0.85,
                    size: 2.8,
                    color: Math.random() > 0.4 ? '#38bdf8' : el.flameHex,
                    kind: 'alpha',
                  });
                } else if (el.category === 'noble_gas') {
                  particles.push({
                    x: rx - boxW * 0.32,
                    y: ry + (Math.random() - 0.5) * 22,
                    vx: 110 + Math.random() * 60,
                    vy: (Math.random() - 0.5) * 18,
                    life: 0.9,
                    maxLife: 0.9,
                    size: 2.5,
                    color: el.flameHex,
                    kind: 'photon',
                  });
                }
              }

              // Draw element-category chemical scene
              ctx.save();
              if (el.category === 'alkali' || el.category === 'alkaline_earth') {
                // Beaker with water + skittering metal + H2 bubbles + characteristic flame
                const bw = Math.min(132, boxW * 0.72);
                const bh = Math.min(130, boxH * 0.58);
                const bx = rx - bw / 2;
                const by = ry - bh * 0.3;

                // Water body
                const liqY = by + bh * 0.36;
                const liqGrad = ctx.createLinearGradient(0, liqY, 0, by + bh);
                liqGrad.addColorStop(0, el.category === 'alkali' ? 'rgba(236, 72, 153, 0.32)' : 'rgba(56, 189, 248, 0.25)');
                liqGrad.addColorStop(1, el.category === 'alkali' ? 'rgba(219, 39, 119, 0.52)' : 'rgba(14, 165, 233, 0.45)');
                ctx.fillStyle = liqGrad;
                ctx.fillRect(bx + 3, liqY, bw - 6, by + bh - liqY - 3);

                // Meniscus wave
                ctx.beginPath();
                for (let px = bx + 3; px <= bx + bw - 3; px += 4) {
                  const wy = liqY + Math.sin(px * 0.12 + time * 6) * 2.5;
                  if (px === bx + 3) ctx.moveTo(px, wy);
                  else ctx.lineTo(px, wy);
                }
                ctx.strokeStyle = 'rgba(248, 250, 252, 0.55)';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Glass beaker walls
                ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(bx, by);
                ctx.lineTo(bx, by + bh);
                ctx.lineTo(bx + bw, by + bh);
                ctx.lineTo(bx + bw, by);
                ctx.stroke();

                // Metal droplet + flame plume
                const mx = rx + Math.sin(time * (el.category === 'alkali' ? 5.2 : 1.5)) * (bw * 0.26);
                const my = el.category === 'alkali' ? liqY : by + bh - 12;
                const flameH = (el.category === 'alkali' ? 38 : 28) + Math.sin(time * 18) * 7 + burstEnergy * 18;
                const fGrad = ctx.createLinearGradient(mx, my, mx, my - flameH);
                fGrad.addColorStop(0, '#ffffff');
                fGrad.addColorStop(0.35, el.flameHex);
                fGrad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.beginPath();
                ctx.moveTo(mx - 12, my);
                ctx.quadraticCurveTo(mx - 4, my - flameH * 0.65, mx, my - flameH);
                ctx.quadraticCurveTo(mx + 4, my - flameH * 0.65, mx + 12, my);
                ctx.fillStyle = fGrad;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(mx, my, 8, 0, Math.PI * 2);
                ctx.fillStyle = '#e2e8f0';
                ctx.fill();

                ctx.font = '700 10px ui-monospace, monospace';
                ctx.fillStyle = el.flameHex;
                ctx.textAlign = 'center';
                ctx.fillText(
                  el.category === 'alkali' ? `${el.sym} + H₂O → ${el.sym}OH + H₂↑` : `${el.sym} cháy sáng · ${el.sym}²⁺`,
                  rx,
                  by + bh + 18
                );
              } else if (el.category === 'noble_gas') {
                // High-voltage plasma discharge tube
                const tw = Math.min(164, boxW * 0.85);
                const th = 42;
                const tx = rx - tw / 2;
                const ty = ry - th / 2;

                ctx.fillStyle = `${el.flameHex}28`;
                ctx.strokeStyle = el.flameHex;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(tx, ty, tw, th, 21);
                ctx.fill();
                ctx.stroke();

                // Plasma filament wave
                ctx.beginPath();
                for (let px = tx + 16; px <= tx + tw - 16; px += 4) {
                  const py = ry + Math.sin(px * 0.14 - time * 14) * (6 + Math.sin(time * 7) * 3);
                  if (px === tx + 16) ctx.moveTo(px, py);
                  else ctx.lineTo(px, py);
                }
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2.4;
                ctx.stroke();

                // Electrodes
                ctx.fillStyle = '#94a3b8';
                ctx.fillRect(tx - 6, ry - 12, 12, 24);
                ctx.fillRect(tx + tw - 6, ry - 12, 12, 24);

                ctx.font = '700 10px ui-monospace, monospace';
                ctx.fillStyle = el.flameHex;
                ctx.textAlign = 'center';
                ctx.fillText(`Ống phóng điện Plasma ${el.sym} (${el.ie} eV)`, rx, ry + 48);
              } else if (el.category === 'halogen') {
                // Diatomic X2 molecule + electron capture animation
                const sep = 26 + Math.sin(time * 3) * 4;
                [rx - sep, rx + sep].forEach((ax, i) => {
                  const grad = ctx.createRadialGradient(ax - 4, ry - 4, 2, ax, ry, 22);
                  grad.addColorStop(0, '#f8fafc');
                  grad.addColorStop(0.5, el.flameHex);
                  grad.addColorStop(1, '#064e3b');
                  ctx.beginPath();
                  ctx.arc(ax, ry, 20, 0, Math.PI * 2);
                  ctx.fillStyle = grad;
                  ctx.fill();
                  ctx.font = '700 11px ui-monospace, monospace';
                  ctx.fillStyle = '#020617';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText(`${el.sym}${i === 0 ? '' : ''}`, ax, ry);
                });
                // Shared covalent bond glow
                ctx.beginPath();
                ctx.moveTo(rx - sep + 18, ry);
                ctx.lineTo(rx + sep - 18, ry);
                ctx.strokeStyle = '#f8fafc';
                ctx.lineWidth = 4;
                ctx.stroke();

                // Electron capture ring
                const capT = (time * 0.9) % 1;
                const ex = rx - 72 + capT * 48;
                const ey = ry - 46 + capT * 40;
                ctx.beginPath();
                ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
                ctx.fillStyle = '#facc15';
                ctx.fill();
                ctx.font = '700 10px ui-monospace, monospace';
                ctx.fillStyle = el.flameHex;
                ctx.textAlign = 'center';
                ctx.fillText(`Phân tử ${el.sym}₂ + 2e⁻ → 2${el.sym}⁻ (χ = ${el.en ?? '—'})`, rx, ry + 56);
              } else if (el.category === 'transition' || el.category === 'post_transition') {
                // Metallic crystal lattice + d-orbital / magnetic flux or delocalized sea
                const cols = 3;
                const rows = 3;
                const sp = 34;
                for (let ix = -1; ix <= 1; ix++) {
                  for (let iy = -1; iy <= 1; iy++) {
                    const nx = rx + ix * sp + Math.sin(time * 5 + ix * 2 + iy) * 1.8;
                    const ny = ry + iy * sp + Math.cos(time * 4.5 + iy * 3) * 1.8;
                    const nGrad = ctx.createRadialGradient(nx - 3, ny - 3, 1, nx, ny, 11);
                    nGrad.addColorStop(0, '#f8fafc');
                    nGrad.addColorStop(0.55, el.flameHex);
                    nGrad.addColorStop(1, '#1e293b');
                    ctx.beginPath();
                    ctx.arc(nx, ny, 10, 0, Math.PI * 2);
                    ctx.fillStyle = nGrad;
                    ctx.fill();
                  }
                }
                // Free electron sea drifting across crystal
                for (let k = 0; k < 10; k++) {
                  const ex = rx - 52 + ((time * 48 + k * 21) % 104);
                  const ey = ry - 38 + ((k * 19) % 76) + Math.sin(time * 6 + k) * 4;
                  ctx.beginPath();
                  ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
                  ctx.fillStyle = '#38bdf8';
                  ctx.fill();
                }
                // Magnetic field loops for Fe/Co/Ni
                if (el.z === 26 || el.z === 27 || el.z === 28) {
                  ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
                  ctx.lineWidth = 1.3;
                  ctx.beginPath();
                  ctx.ellipse(rx, ry, 68, 48, 0, 0, Math.PI * 2);
                  ctx.stroke();
                }
                ctx.font = '700 10px ui-monospace, monospace';
                ctx.fillStyle = el.flameHex;
                ctx.textAlign = 'center';
                ctx.fillText(
                  el.z === 26 || el.z === 27 || el.z === 28
                    ? `Mạng kim loại ${el.sym} · Từ tính sắt từ`
                    : `Mạng tinh thể & biển e⁻ tự do (${el.sym})`,
                  rx,
                  ry + 62
                );
              } else if (el.category === 'lanthanide' || el.category === 'actinide') {
                // F-block luminescence or nuclear decay tracks
                const isAct = el.category === 'actinide';
                for (let i = 0; i < 6; i++) {
                  const ang = time * 1.4 + (i * Math.PI) / 3;
                  ctx.beginPath();
                  ctx.ellipse(rx, ry, 48, 16, ang, 0, Math.PI * 2);
                  ctx.strokeStyle = isAct ? 'rgba(251, 146, 60, 0.48)' : `${el.flameHex}66`;
                  ctx.lineWidth = 1.4;
                  ctx.stroke();
                }
                ctx.beginPath();
                ctx.arc(rx, ry, 16 + Math.sin(time * 6) * 2, 0, Math.PI * 2);
                ctx.fillStyle = isAct ? '#38bdf8' : el.flameHex;
                ctx.fill();
                ctx.font = '700 10px ui-monospace, monospace';
                ctx.fillStyle = el.flameHex;
                ctx.textAlign = 'center';
                ctx.fillText(
                  isAct ? `Phóng xạ 5f (${el.sym}) · Bức xạ Cherenkov` : `Huỳnh quang lượng tử 4f (${el.sym}³⁺)`,
                  rx,
                  ry + 62
                );
              } else {
                // Nonmetals & Metalloids: Covalent network / Graphene hex / Balmer jumps
                if (el.z === 6 || el.z === 14) {
                  // Hexagonal lattice
                  const rHex = 28;
                  const pts: [number, number][] = [];
                  for (let i = 0; i < 6; i++) {
                    const a = (i * Math.PI) / 3 + time * 0.4;
                    pts.push([rx + Math.cos(a) * rHex, ry + Math.sin(a) * rHex]);
                  }
                  ctx.beginPath();
                  pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
                  ctx.closePath();
                  ctx.strokeStyle = el.flameHex;
                  ctx.lineWidth = 2.2;
                  ctx.stroke();
                  pts.forEach(([px, py]) => {
                    ctx.beginPath();
                    ctx.arc(px, py, 6, 0, Math.PI * 2);
                    ctx.fillStyle = '#f8fafc';
                    ctx.fill();
                  });
                } else {
                  // Covalent dimer / ring + electron cloud
                  const rC = 26;
                  for (let i = 0; i < 4; i++) {
                    const a = (i * Math.PI) / 2 + time * 1.1;
                    const ox = rx + Math.cos(a) * rC;
                    const oy = ry + Math.sin(a) * rC;
                    ctx.beginPath();
                    ctx.moveTo(rx, ry);
                    ctx.lineTo(ox, oy);
                    ctx.strokeStyle = 'rgba(226, 232, 240, 0.5)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(ox, oy, 7, 0, Math.PI * 2);
                    ctx.fillStyle = el.flameHex;
                    ctx.fill();
                  }
                  ctx.beginPath();
                  ctx.arc(rx, ry, 10, 0, Math.PI * 2);
                  ctx.fillStyle = '#f8fafc';
                  ctx.fill();
                }
                ctx.font = '700 10px ui-monospace, monospace';
                ctx.fillStyle = el.flameHex;
                ctx.textAlign = 'center';
                ctx.fillText(`Liên kết cộng hóa trị · ${el.sym} (χ = ${el.en ?? '—'})`, rx, ry + 58);
              }
              ctx.restore();
            }

            // 4. Update & render dynamic reaction particles
            for (let i = particles.length - 1; i >= 0; i--) {
              const p = particles[i];
              p.life -= dt;
              if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
              }
              p.x += p.vx * dt;
              p.y += p.vy * dt;
              const alpha = Math.max(0, p.life / p.maxLife);
              ctx.save();
              ctx.globalAlpha = alpha;
              if (p.kind === 'bubble') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color}55`;
                ctx.fill();
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 1;
                ctx.stroke();
              } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * (0.4 + 0.6 * alpha), 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
              }
              ctx.restore();
            }

            // 5. Bottom Atomic Emission Spectrum Strip (380nm - 780nm)
            const specH = 34;
            const specY = h - specH - 6;
            const specX = 14;
            const specW = w - 28;
            ctx.fillStyle = '#020617';
            ctx.strokeStyle = 'rgba(51, 65, 85, 0.9)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(specX, specY, specW, specH, 6);
            ctx.fill();
            ctx.stroke();

            ctx.font = '700 9px ui-monospace, monospace';
            ctx.fillStyle = '#94a3b8';
            ctx.textAlign = 'left';
            ctx.fillText(`PHỔ PHÁT XẠ ${el.sym} (nm)`, specX + 8, specY + 12);

            el.spectralLinesNm.forEach((nm) => {
              const frac = Math.max(0.03, Math.min(0.97, (nm - 240) / 560));
              const lx = specX + frac * specW;
              const lineCol = wavelengthToHex(nm);
              ctx.fillStyle = lineCol;
              ctx.fillRect(lx - 1.5, specY + 16, 3, specH - 18);
              ctx.fillStyle = `${lineCol}55`;
              ctx.fillRect(lx - 4, specY + 16, 8, specH - 18);
            });

            ctx.restore();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [selectedZ, reactionPulseTick, stageMode]);

  // Interactive 3D WebGL Rotatable Bonding & VSEPR Viewer
  useEffect(() => {
    if (stageMode !== 'bond3d') return;
    const container = bondMountRef.current;
    if (!container) return;

    const w = container.clientWidth || 540;
    const h = container.clientHeight || 340;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(2.9, 2.0, 4.1);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.8));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.0;
    controls.maxDistance = 10;

    scene.add(new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 0.9));
    const keyL = new THREE.DirectionalLight(0xffffff, 1.55);
    keyL.position.set(5, 7, 6);
    scene.add(keyL);
    const rimL = new THREE.DirectionalLight(0x38bdf8, 0.85);
    rimL.position.set(-5, -3, -4);
    scene.add(rimL);

    const root = new THREE.Group();
    scene.add(root);

    const addAtom = (pos: [number, number, number], r: number, hex: number) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(r, 24, 18),
        new THREE.MeshPhysicalMaterial({ color: hex, roughness: 0.25, metalness: 0.15, clearcoat: 0.7 })
      );
      m.position.set(...pos);
      root.add(m);
      return m;
    };

    const addBond = (p1: [number, number, number], p2: [number, number, number], r = 0.065, hex = 0xcbd5e1) => {
      const v1 = new THREE.Vector3(...p1);
      const v2 = new THREE.Vector3(...p2);
      const len = v1.distanceTo(v2);
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(r, r, len, 14),
        new THREE.MeshStandardMaterial({ color: hex, roughness: 0.35, metalness: 0.4 })
      );
      cyl.position.copy(v1).add(v2).multiplyScalar(0.5);
      cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v2.clone().sub(v1).normalize());
      root.add(cyl);
    };

    const addLonePair = (dir: [number, number, number]) => {
      const v = new THREE.Vector3(...dir).normalize();
      const lobe = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 18, 14),
        new THREE.MeshPhysicalMaterial({
          color: 0xfacc15,
          transparent: true,
          opacity: 0.34,
          roughness: 0.2,
          depthWrite: false,
        })
      );
      lobe.scale.set(0.72, 1.45, 0.72);
      lobe.position.copy(v).multiplyScalar(0.88);
      lobe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
      root.add(lobe);
    };

    if (bondPreset === 'ionic_nacl') {
      const step = 0.92;
      for (let ix = -1; ix <= 1; ix++) {
        for (let iy = -1; iy <= 1; iy++) {
          for (let iz = -1; iz <= 1; iz++) {
            const isCation = (Math.abs(ix + iy + iz) % 2) === 0;
            addAtom([ix * step, iy * step, iz * step], isCation ? 0.21 : 0.33, isCation ? 0x8b5cf6 : 0x10b981);
            if (ix < 1) addBond([ix * step, iy * step, iz * step], [(ix + 1) * step, iy * step, iz * step], 0.025, 0x475569);
            if (iy < 1) addBond([ix * step, iy * step, iz * step], [ix * step, (iy + 1) * step, iz * step], 0.025, 0x475569);
            if (iz < 1) addBond([ix * step, iy * step, iz * step], [ix * step, iy * step, (iz + 1) * step], 0.025, 0x475569);
          }
        }
      }
    } else if (bondPreset === 'covalent_n2') {
      addAtom([-0.92, 0, 0], 0.42, 0x3b82f6);
      addAtom([0.92, 0, 0], 0.42, 0x3b82f6);
      addBond([-0.92, 0, 0], [0.92, 0, 0], 0.075, 0xf8fafc);
      addBond([-0.92, 0.22, 0], [0.92, 0.22, 0], 0.048, 0x38bdf8);
      addBond([-0.92, -0.22, 0], [0.92, -0.22, 0], 0.048, 0x38bdf8);
      const piRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.45, 0.08, 12, 32),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
      );
      piRing.rotation.y = Math.PI / 2;
      root.add(piRing);
    } else if (bondPreset === 'vsepr_co2') {
      addAtom([0, 0, 0], 0.42, 0x334155);
      addAtom([-1.45, 0, 0], 0.36, 0xef4444);
      addAtom([1.45, 0, 0], 0.36, 0xef4444);
      addBond([-1.45, 0.09, 0], [0, 0.09, 0], 0.055);
      addBond([-1.45, -0.09, 0], [0, -0.09, 0], 0.055);
      addBond([0, 0.09, 0], [1.45, 0.09, 0], 0.055);
      addBond([0, -0.09, 0], [1.45, -0.09, 0], 0.055);
    } else if (bondPreset === 'vsepr_h2o') {
      addAtom([0, 0, 0], 0.46, 0xef4444);
      const halfAngle = (104.5 * Math.PI) / 360;
      const d = 1.32;
      const h1: [number, number, number] = [-Math.sin(halfAngle) * d, -Math.cos(halfAngle) * d, 0];
      const h2: [number, number, number] = [Math.sin(halfAngle) * d, -Math.cos(halfAngle) * d, 0];
      addAtom(h1, 0.25, 0xf8fafc);
      addAtom(h2, 0.25, 0xf8fafc);
      addBond([0, 0, 0], h1);
      addBond([0, 0, 0], h2);
      addLonePair([0, 0.75, 0.7]);
      addLonePair([0, 0.75, -0.7]);
    } else if (bondPreset === 'vsepr_nh3') {
      addAtom([0, 0.15, 0], 0.44, 0x3b82f6);
      for (let i = 0; i < 3; i++) {
        const a = (i * Math.PI * 2) / 3;
        const hp: [number, number, number] = [Math.cos(a) * 1.18, -0.58, Math.sin(a) * 1.18];
        addAtom(hp, 0.24, 0xf8fafc);
        addBond([0, 0.15, 0], hp);
      }
      addLonePair([0, 1.0, 0]);
    } else if (bondPreset === 'vsepr_ch4') {
      addAtom([0, 0, 0], 0.44, 0x334155);
      const dirs: [number, number, number][] = [
        [0, 1.38, 0],
        [1.3, -0.46, 0],
        [-0.65, -0.46, 1.12],
        [-0.65, -0.46, -1.12],
      ];
      dirs.forEach((p) => {
        addAtom(p, 0.25, 0xf8fafc);
        addBond([0, 0, 0], p);
      });
    } else if (bondPreset === 'vsepr_sf6') {
      addAtom([0, 0, 0], 0.46, 0xfacc15);
      const dirs: [number, number, number][] = [
        [1.42, 0, 0],
        [-1.42, 0, 0],
        [0, 1.42, 0],
        [0, -1.42, 0],
        [0, 0, 1.42],
        [0, 0, -1.42],
      ];
      dirs.forEach((p) => {
        addAtom(p, 0.28, 0x4ade80);
        addBond([0, 0, 0], p);
      });
    }

    let cancelFrame = () => {};
    let disposed = false;
    let last = performance.now();

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      root.rotation.y += dt * 0.45 * speedRef.current;
      controls.update();
      renderer.render(scene, camera);
      scheduleSyncedGlFrame(renderer, isSoftwareGl, tick, (fn) => {
        cancelFrame = fn;
      });
    };

    scheduleSyncedGlFrame(renderer, isSoftwareGl, tick, (fn) => {
      cancelFrame = fn;
    });

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 540;
      const nh = container.clientHeight || 340;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(container);

    return () => {
      disposed = true;
      cancelFrame();
      ro?.disconnect();
      controls.dispose();
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material?.dispose();
        }
      });
      renderer.dispose();
    };
  }, [stageMode, bondPreset, isSoftwareGl]);

  const catMeta = CATEGORY_META[selectedEl.category];
  const prevEl = PERIODIC_ELEMENTS_118.find((e) => e.z === (selectedEl.z > 1 ? selectedEl.z - 1 : 118))!;
  const nextEl = PERIODIC_ELEMENTS_118.find((e) => e.z === (selectedEl.z < 118 ? selectedEl.z + 1 : 1))!;

  return (
    <div className="space-y-4">
      {/* Top Futuristic Command Toolbar */}
      <div className="rounded-2xl border border-emerald-500/35 bg-slate-950/95 p-3.5 sm:p-4 text-white flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
            <Atom className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-white truncate">
              Bảng Tuần Hoàn Hóa Học Tương Lai (118 Nguyên Tố · Quang Phổ &amp; Phản Ứng)
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              Chạm bất kỳ nguyên tố nào để kích hoạt hoạt ảnh hóa học đặc trưng và mở hồ sơ phân tích lớn kế bên
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTable((s) => !s)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border whitespace-nowrap ${
              showTable
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-emerald-400'
            }`}
          >
            {showTable ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showTable ? 'Ẩn Bảng Tuần Hoàn' : 'Hiện Bảng Tuần Hoàn'}</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên, ký hiệu, Z..."
              className="pl-8 pr-3 py-1.5 w-44 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Category & Color Mode Filter Strip */}
      {showTable && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCatFilter('all')}
              className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                catFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600'
              }`}
            >
              Tất cả (118)
            </button>
            {(Object.keys(CATEGORY_META) as ElementCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCatFilter(cat)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold border cursor-pointer transition-colors ${
                  catFilter === cat
                    ? CATEGORY_META[cat].badgeClass
                    : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {CATEGORY_META[cat].labelVi.split(' (')[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {(
              [
                { id: 'category', label: 'Nhóm' },
                { id: 'electronegativity', label: 'Độ âm điện χ' },
                { id: 'radius', label: 'Bán kính R' },
                { id: 'block', label: 'Phân lớp s/p/d/f' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setColorMode(m.id)}
                className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                  colorMode === m.id ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MAIN SIDE-BY-SIDE LAYOUT: PERIODIC TABLE + LARGE INTRODUCTION & ANIMATION FRAME */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {showTable && (
          <div className="xl:col-span-7 rounded-2xl border border-slate-800 bg-slate-950/95 p-3 sm:p-4 overflow-x-auto relative">
            <div className="min-w-[680px]">
              {/* Group Column Numbers 1..18 */}
              <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1 mb-1.5 text-[9px] font-mono text-slate-500 text-center">
                {Array.from({ length: 18 }, (_, i) => (
                  <div
                    key={i}
                    className={`py-0.5 rounded transition-colors ${
                      waveTick === i + 1 ? 'text-emerald-300 bg-emerald-500/10 font-bold' : ''
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* 18-Column Grid (Rows 1..7 + gap + Row 8 Lanthanides + Row 9 Actinides) */}
              <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1">
                {PERIODIC_ELEMENTS_118.map((el) => {
                  const isSelected = el.z === selectedEl.z;
                  const isMatch = matchedZSet.has(el.z);
                  const meta = CATEGORY_META[el.category];
                  const isWave = waveTick === el.col;

                  let customBg: string | undefined;
                  if (colorMode === 'electronegativity') {
                    customBg = getHeatColor(el.en, 0.7, 4.0, true);
                  } else if (colorMode === 'radius') {
                    customBg = getHeatColor(el.radiusPm, 31, 348, false);
                  } else if (colorMode === 'block') {
                    customBg =
                      el.block === 's'
                        ? 'rgba(244, 63, 94, 0.35)'
                        : el.block === 'p'
                        ? 'rgba(16, 185, 129, 0.35)'
                        : el.block === 'd'
                        ? 'rgba(59, 130, 246, 0.35)'
                        : 'rgba(168, 85, 247, 0.35)';
                  }

                  return (
                    <button
                      key={el.z}
                      type="button"
                      onClick={() => handleSelectElement(el.z)}
                      style={{
                        gridColumnStart: el.col,
                        gridRowStart: el.row >= 8 ? el.row + 1 : el.row,
                        backgroundColor: customBg,
                        boxShadow: isSelected
                          ? `0 0 18px ${el.flameHex}88, inset 0 0 10px ${el.flameHex}44`
                          : isWave
                          ? 'inset 0 0 8px rgba(56, 189, 248, 0.22)'
                          : undefined,
                      }}
                      title={`${el.z}. ${el.nameVi} (${el.sym})`}
                      className={`relative rounded-md border p-1 text-left transition-all cursor-pointer select-none ${
                        colorMode === 'category' ? `bg-gradient-to-br ${meta.tileBg}` : 'border-slate-700'
                      } ${
                        isSelected
                          ? 'ring-2 ring-white scale-110 z-20 border-white'
                          : isMatch
                          ? 'opacity-100 hover:scale-105 hover:z-10'
                          : 'opacity-20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[8px] font-mono leading-none text-slate-300">
                        <span>{el.z}</span>
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: el.flameHex }}
                        />
                      </div>
                      <div className="text-[11px] sm:text-xs font-black text-white leading-tight mt-0.5 text-center">
                        {el.sym}
                      </div>
                      <div className="text-[7px] text-slate-300/80 truncate text-center leading-none">
                        {el.nameVi}
                      </div>
                    </button>
                  );
                })}

                {/* Visual spacer row 8 for f-block separation */}
                <div style={{ gridColumn: '1 / span 18', gridRowStart: 8 }} className="h-2.5 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                </div>
                <div
                  style={{ gridColumn: '1 / span 2', gridRowStart: 9 }}
                  className="text-[9px] font-mono text-pink-300 flex items-center justify-end pr-1.5"
                >
                  57–71 · 4f
                </div>
                <div
                  style={{ gridColumn: '1 / span 2', gridRowStart: 10 }}
                  className="text-[9px] font-mono text-orange-300 flex items-center justify-end pr-1.5"
                >
                  89–103 · 5f
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LARGE INTRODUCTION & ELEMENT-SPECIFIC CHEMICAL ANIMATION PANEL */}
        <div
          className={`${
            showTable ? 'xl:col-span-5' : 'xl:col-span-12'
          } rounded-2xl border border-slate-800 bg-slate-950 text-white overflow-hidden shadow-2xl flex flex-col`}
        >
          {/* Element Hero Header */}
          <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                style={{
                  borderColor: selectedEl.flameHex,
                  boxShadow: `0 0 24px ${selectedEl.flameHex}33`,
                }}
                className="w-14 h-14 rounded-2xl border-2 bg-slate-900 flex flex-col items-center justify-center shrink-0"
              >
                <span className="text-[10px] font-mono text-slate-400 leading-none">Z = {selectedEl.z}</span>
                <span className="text-2xl font-black tracking-tight text-white leading-none mt-0.5">
                  {selectedEl.sym}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white truncate">
                    {selectedEl.nameVi} <span className="text-slate-400 font-medium text-sm">({selectedEl.nameEn})</span>
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${catMeta.badgeClass}`}>
                    {catMeta.labelVi}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    M = {selectedEl.mass} · Chu kì {selectedEl.period} · Phân lớp {selectedEl.block}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                    Thể 25°C: {selectedEl.state}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleSelectElement(prevEl.z)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 cursor-pointer"
                title={`Trước: ${prevEl.sym}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement(nextEl.z)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 cursor-pointer"
                title={`Tiếp theo: ${nextEl.sym}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Element-Specific Chemical Animation Stage */}
          <div className="p-3 bg-[#030712] border-b border-slate-800 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
                {(
                  [
                    { id: 'hybrid', label: 'Nguyên tử + Phản ứng' },
                    { id: 'atom', label: 'Vỏ Lượng tử e⁻' },
                    { id: 'reaction', label: 'Hiện tượng Hóa học' },
                    { id: 'bond3d', label: 'Liên kết & VSEPR 3D' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setStageMode(m.id)}
                    className={`px-2.5 py-1 rounded font-bold cursor-pointer inline-flex items-center gap-1 ${
                      stageMode === m.id ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.id === 'bond3d' && <Box className="w-3 h-3" />}
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                {stageMode !== 'bond3d' && (
                  <button
                    type="button"
                    onClick={triggerReactionBurst}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold cursor-pointer whitespace-nowrap"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Kích hoạt Phản ứng</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setAnimSpeed((s) => (s === 1 ? 1.8 : s === 1.8 ? 0.5 : 1))}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono font-bold text-cyan-300 cursor-pointer"
                >
                  {animSpeed}x
                </button>
              </div>
            </div>

            {stageMode === 'bond3d' ? (
              <div className="space-y-2.5">
                <div className="flex flex-wrap gap-1.5">
                  {BOND_3D_SPECS.map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => setBondPreset(sp.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold border cursor-pointer ${
                        bondPreset === sp.id
                          ? 'bg-sky-500 text-slate-950 border-sky-400'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-sky-400'
                      }`}
                    >
                      {sp.formula} · {sp.id.startsWith('ionic') ? 'Ion' : sp.id.startsWith('covalent') ? 'Cộng hóa trị' : 'VSEPR'}
                    </button>
                  ))}
                </div>
                <div
                  ref={bondMountRef}
                  className={`w-full rounded-xl border border-slate-800 cursor-grab active:cursor-grabbing touch-none ${
                    showTable ? 'h-[310px] sm:h-[340px]' : 'h-[380px] sm:h-[440px]'
                  }`}
                />
                <div className="rounded-xl border border-sky-500/35 bg-slate-900/80 p-3 space-y-1 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-extrabold text-sky-300">{activeBondSpec.titleVi}</span>
                    <span className="font-mono text-[11px] text-amber-300">{activeBondSpec.deltaChi}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[11px] text-slate-300">
                    <span>Loại LK: <strong>{activeBondSpec.bondType}</strong></span>
                    <span>Lai hóa: <strong>{activeBondSpec.hybridization}</strong></span>
                    <span>Góc LK: <strong>{activeBondSpec.angle}</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{activeBondSpec.noteVi}</p>
                </div>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                className={`w-full block rounded-xl border border-slate-800 ${
                  showTable ? 'h-[300px] sm:h-[330px]' : 'h-[360px] sm:h-[420px]'
                }`}
              />
            )}
          </div>

          {/* Large Comprehensive Element Introduction Card */}
          <div className="p-4 sm:p-5 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400">Cấu hình electron</div>
                <div className="text-sm font-mono font-bold text-cyan-300 mt-0.5">{selectedEl.config}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase text-slate-400">Số oxi hóa đặc trưng</div>
                <div className="text-sm font-mono font-bold text-amber-300 mt-0.5">{selectedEl.oxidation}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                <div className="text-[10px] text-slate-400">Độ âm điện (χ)</div>
                <div className="text-base font-mono font-bold tabular-nums text-emerald-300">
                  {selectedEl.en ?? '—'}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                <div className="text-[10px] text-slate-400">Năng lượng Ion hóa</div>
                <div className="text-base font-mono font-bold tabular-nums text-sky-300">
                  {selectedEl.ie} eV
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                <div className="text-[10px] text-slate-400">Bán kính nguyên tử</div>
                <div className="text-base font-mono font-bold tabular-nums text-amber-300">
                  {selectedEl.radiusPm} pm
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                <div className="text-[10px] text-slate-400">Nóng chảy / Sôi</div>
                <div className="text-xs font-mono font-bold tabular-nums text-rose-300 mt-0.5">
                  {selectedEl.meltC ?? '—'}°C / {selectedEl.boilC ?? '—'}°C
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Phản ứng &amp; Tính chất hóa học đặc trưng</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{selectedEl.reactionVi}</p>
              </div>

              <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ứng dụng công nghệ, Đời sống &amp; Sinh học</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{selectedEl.applicationVi}</p>
              </div>
            </div>

            {/* Quick Featured Jump Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 inline-flex items-center gap-1 mr-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Khám phá nhanh:
              </span>
              {[1, 6, 11, 12, 17, 19, 26, 29, 47, 53, 60, 79, 92, 118].map((qz) => {
                const qe = PERIODIC_ELEMENTS_118.find((x) => x.z === qz)!;
                return (
                  <button
                    key={qz}
                    type="button"
                    onClick={() => handleSelectElement(qz)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border cursor-pointer ${
                      selectedEl.z === qz
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    {qe.sym}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
