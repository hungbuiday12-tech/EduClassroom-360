import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Atom, Beaker, Calculator, CheckCircle2, FlaskConical, RotateCcw, Scale } from 'lucide-react';
import { MathFormula } from '../common/MathRenderer';

interface ElementInfo {
  z: number;
  symbol: string;
  name: string;
  mass: number;
  group: number;
  period: number;
  block: 's' | 'p' | 'd';
  en: number;
  radiusPm: number;
  config: string;
  ox: string;
  category: string;
}

const ELEMENTS_36: ElementInfo[] = [
  { z: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, group: 1, period: 1, block: 's', en: 2.2, radiusPm: 53, config: '1s¹', ox: '-1, +1', category: 'Phi kim' },
  { z: 2, symbol: 'He', name: 'Helium', mass: 4.0026, group: 18, period: 1, block: 's', en: 0, radiusPm: 31, config: '1s²', ox: '0', category: 'Khí hiếm' },
  { z: 3, symbol: 'Li', name: 'Lithium', mass: 6.94, group: 1, period: 2, block: 's', en: 0.98, radiusPm: 167, config: '[He] 2s¹', ox: '+1', category: 'Kim loại kiềm' },
  { z: 4, symbol: 'Be', name: 'Beryllium', mass: 9.012, group: 2, period: 2, block: 's', en: 1.57, radiusPm: 112, config: '[He] 2s²', ox: '+2', category: 'Kiềm thổ' },
  { z: 5, symbol: 'B', name: 'Boron', mass: 10.81, group: 13, period: 2, block: 'p', en: 2.04, radiusPm: 87, config: '[He] 2s² 2p¹', ox: '+3', category: 'Á kim' },
  { z: 6, symbol: 'C', name: 'Carbon', mass: 12.011, group: 14, period: 2, block: 'p', en: 2.55, radiusPm: 67, config: '[He] 2s² 2p²', ox: '-4..+4', category: 'Phi kim' },
  { z: 7, symbol: 'N', name: 'Nitrogen', mass: 14.007, group: 15, period: 2, block: 'p', en: 3.04, radiusPm: 56, config: '[He] 2s² 2p³', ox: '-3..+5', category: 'Phi kim' },
  { z: 8, symbol: 'O', name: 'Oxygen', mass: 15.999, group: 16, period: 2, block: 'p', en: 3.44, radiusPm: 48, config: '[He] 2s² 2p⁴', ox: '-2, -1', category: 'Phi kim' },
  { z: 9, symbol: 'F', name: 'Fluorine', mass: 18.998, group: 17, period: 2, block: 'p', en: 3.98, radiusPm: 42, config: '[He] 2s² 2p⁵', ox: '-1', category: 'Halogen' },
  { z: 10, symbol: 'Ne', name: 'Neon', mass: 20.18, group: 18, period: 2, block: 'p', en: 0, radiusPm: 38, config: '[He] 2s² 2p⁶', ox: '0', category: 'Khí hiếm' },
  { z: 11, symbol: 'Na', name: 'Sodium', mass: 22.99, group: 1, period: 3, block: 's', en: 0.93, radiusPm: 190, config: '[Ne] 3s¹', ox: '+1', category: 'Kim loại kiềm' },
  { z: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.305, group: 2, period: 3, block: 's', en: 1.31, radiusPm: 145, config: '[Ne] 3s²', ox: '+2', category: 'Kiềm thổ' },
  { z: 13, symbol: 'Al', name: 'Aluminium', mass: 26.982, group: 13, period: 3, block: 'p', en: 1.61, radiusPm: 118, config: '[Ne] 3s² 3p¹', ox: '+3', category: 'Kim loại' },
  { z: 14, symbol: 'Si', name: 'Silicon', mass: 28.085, group: 14, period: 3, block: 'p', en: 1.9, radiusPm: 111, config: '[Ne] 3s² 3p²', ox: '-4, +4', category: 'Á kim' },
  { z: 15, symbol: 'P', name: 'Phosphorus', mass: 30.974, group: 15, period: 3, block: 'p', en: 2.19, radiusPm: 98, config: '[Ne] 3s² 3p³', ox: '-3, +3, +5', category: 'Phi kim' },
  { z: 16, symbol: 'S', name: 'Sulfur', mass: 32.06, group: 16, period: 3, block: 'p', en: 2.58, radiusPm: 88, config: '[Ne] 3s² 3p⁴', ox: '-2, +4, +6', category: 'Phi kim' },
  { z: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, group: 17, period: 3, block: 'p', en: 3.16, radiusPm: 79, config: '[Ne] 3s² 3p⁵', ox: '-1..+7', category: 'Halogen' },
  { z: 18, symbol: 'Ar', name: 'Argon', mass: 39.948, group: 18, period: 3, block: 'p', en: 0, radiusPm: 71, config: '[Ne] 3s² 3p⁶', ox: '0', category: 'Khí hiếm' },
  { z: 19, symbol: 'K', name: 'Potassium', mass: 39.098, group: 1, period: 4, block: 's', en: 0.82, radiusPm: 243, config: '[Ar] 4s¹', ox: '+1', category: 'Kim loại kiềm' },
  { z: 20, symbol: 'Ca', name: 'Calcium', mass: 40.078, group: 2, period: 4, block: 's', en: 1.0, radiusPm: 194, config: '[Ar] 4s²', ox: '+2', category: 'Kiềm thổ' },
  { z: 21, symbol: 'Sc', name: 'Scandium', mass: 44.956, group: 3, period: 4, block: 'd', en: 1.36, radiusPm: 184, config: '[Ar] 3d¹ 4s²', ox: '+3', category: 'Chuyển tiếp' },
  { z: 22, symbol: 'Ti', name: 'Titanium', mass: 47.867, group: 4, period: 4, block: 'd', en: 1.54, radiusPm: 176, config: '[Ar] 3d² 4s²', ox: '+2, +3, +4', category: 'Chuyển tiếp' },
  { z: 23, symbol: 'V', name: 'Vanadium', mass: 50.942, group: 5, period: 4, block: 'd', en: 1.63, radiusPm: 171, config: '[Ar] 3d³ 4s²', ox: '+2..+5', category: 'Chuyển tiếp' },
  { z: 24, symbol: 'Cr', name: 'Chromium', mass: 51.996, group: 6, period: 4, block: 'd', en: 1.66, radiusPm: 166, config: '[Ar] 3d⁵ 4s¹', ox: '+2, +3, +6', category: 'Chuyển tiếp' },
  { z: 25, symbol: 'Mn', name: 'Manganese', mass: 54.938, group: 7, period: 4, block: 'd', en: 1.55, radiusPm: 161, config: '[Ar] 3d⁵ 4s²', ox: '+2, +4, +7', category: 'Chuyển tiếp' },
  { z: 26, symbol: 'Fe', name: 'Iron', mass: 55.845, group: 8, period: 4, block: 'd', en: 1.83, radiusPm: 156, config: '[Ar] 3d⁶ 4s²', ox: '+2, +3', category: 'Chuyển tiếp' },
  { z: 27, symbol: 'Co', name: 'Cobalt', mass: 58.933, group: 9, period: 4, block: 'd', en: 1.88, radiusPm: 152, config: '[Ar] 3d⁷ 4s²', ox: '+2, +3', category: 'Chuyển tiếp' },
  { z: 28, symbol: 'Ni', name: 'Nickel', mass: 58.693, group: 10, period: 4, block: 'd', en: 1.91, radiusPm: 149, config: '[Ar] 3d⁸ 4s²', ox: '+2', category: 'Chuyển tiếp' },
  { z: 29, symbol: 'Cu', name: 'Copper', mass: 63.546, group: 11, period: 4, block: 'd', en: 1.9, radiusPm: 145, config: '[Ar] 3d¹⁰ 4s¹', ox: '+1, +2', category: 'Chuyển tiếp' },
  { z: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, group: 12, period: 4, block: 'd', en: 1.65, radiusPm: 142, config: '[Ar] 3d¹⁰ 4s²', ox: '+2', category: 'Chuyển tiếp' },
  { z: 31, symbol: 'Ga', name: 'Gallium', mass: 69.723, group: 13, period: 4, block: 'p', en: 1.81, radiusPm: 136, config: '[Ar] 3d¹⁰ 4s² 4p¹', ox: '+3', category: 'Kim loại' },
  { z: 32, symbol: 'Ge', name: 'Germanium', mass: 72.63, group: 14, period: 4, block: 'p', en: 2.01, radiusPm: 125, config: '[Ar] 3d¹⁰ 4s² 4p²', ox: '+4', category: 'Á kim' },
  { z: 33, symbol: 'As', name: 'Arsenic', mass: 74.922, group: 15, period: 4, block: 'p', en: 2.18, radiusPm: 114, config: '[Ar] 3d¹⁰ 4s² 4p³', ox: '-3, +3, +5', category: 'Á kim' },
  { z: 34, symbol: 'Se', name: 'Selenium', mass: 78.971, group: 16, period: 4, block: 'p', en: 2.55, radiusPm: 103, config: '[Ar] 3d¹⁰ 4s² 4p⁴', ox: '-2, +4, +6', category: 'Phi kim' },
  { z: 35, symbol: 'Br', name: 'Bromine', mass: 79.904, group: 17, period: 4, block: 'p', en: 2.96, radiusPm: 94, config: '[Ar] 3d¹⁰ 4s² 4p⁵', ox: '-1..+5', category: 'Halogen' },
  { z: 36, symbol: 'Kr', name: 'Krypton', mass: 83.798, group: 18, period: 4, block: 'p', en: 3.0, radiusPm: 88, config: '[Ar] 3d¹⁰ 4s² 4p⁶', ox: '0', category: 'Khí hiếm' }
];

interface StoichReaction {
  id: string;
  label: string;
  reactantA: { formula: string; coef: number; molarMass: number; state: 's' | 'aq' | 'g' };
  reactantB: { formula: string; coef: number; molarMass: number; state: 's' | 'aq' | 'g' };
  productC: { formula: string; coef: number; molarMass: number; isGas?: boolean };
  equationLatex: string;
}

const STOICH_REACTIONS: StoichReaction[] = [
  {
    id: 'zn-hcl',
    label: 'Zn + 2HCl → ZnCl₂ + H₂↑',
    reactantA: { formula: 'Zn', coef: 1, molarMass: 65, state: 's' },
    reactantB: { formula: 'HCl', coef: 2, molarMass: 36.5, state: 'aq' },
    productC: { formula: 'H₂', coef: 1, molarMass: 2, isGas: true },
    equationLatex: '\\text{Zn} + 2\\text{HCl} \\to \\text{ZnCl}_2 + \\text{H}_2\\uparrow'
  },
  {
    id: 'fe-cuso4',
    label: 'Fe + CuSO₄ → FeSO₄ + Cu↓',
    reactantA: { formula: 'Fe', coef: 1, molarMass: 56, state: 's' },
    reactantB: { formula: 'CuSO₄', coef: 1, molarMass: 160, state: 'aq' },
    productC: { formula: 'Cu', coef: 1, molarMass: 64, isGas: false },
    equationLatex: '\\text{Fe} + \\text{CuSO}_4 \\to \\text{FeSO}_4 + \\text{Cu}\\downarrow'
  },
  {
    id: 'haber-nh3',
    label: 'N₂ + 3H₂ ⇌ 2NH₃',
    reactantA: { formula: 'N₂', coef: 1, molarMass: 28, state: 'g' },
    reactantB: { formula: 'H₂', coef: 3, molarMass: 2, state: 'g' },
    productC: { formula: 'NH₃', coef: 2, molarMass: 17, isGas: true },
    equationLatex: '\\text{N}_2 + 3\\text{H}_2 \\rightleftharpoons 2\\text{NH}_3'
  },
  {
    id: 'ester-etylaxetat',
    label: 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O',
    reactantA: { formula: 'CH₃COOH', coef: 1, molarMass: 60, state: 'aq' },
    reactantB: { formula: 'C₂H₅OH', coef: 1, molarMass: 46, state: 'aq' },
    productC: { formula: 'CH₃COOC₂H₅', coef: 1, molarMass: 88, isGas: false },
    equationLatex: '\\text{CH}_3\\text{COOH} + \\text{C}_2\\text{H}_5\\text{OH} \\rightleftharpoons \\text{CH}_3\\text{COOC}_2\\text{H}_5 + \\text{H}_2\\text{O}'
  }
];

interface VseprPreset {
  id: string;
  formula: string;
  name: string;
  hybrid: string;
  bondingPairs: number;
  lonePairs: number;
  angle: number;
  geometry: string;
  polar: boolean;
}

const VSEPR_PRESETS: VseprPreset[] = [
  { id: 'becl2', formula: 'BeCl₂ / CO₂', name: 'Thẳng hàng (AX₂)', hybrid: 'sp', bondingPairs: 2, lonePairs: 0, angle: 180, geometry: 'Đường thẳng (Linear)', polar: false },
  { id: 'bf3', formula: 'BF₃ / SO₃', name: 'Tam giác phẳng (AX₃)', hybrid: 'sp²', bondingPairs: 3, lonePairs: 0, angle: 120, geometry: 'Tam giác đều phẳng', polar: false },
  { id: 'ch4', formula: 'CH₄ / NH₄⁺', name: 'Tứ diện đều (AX₄)', hybrid: 'sp³', bondingPairs: 4, lonePairs: 0, angle: 109.5, geometry: 'Tứ diện đều', polar: false },
  { id: 'nh3', formula: 'NH₃', name: 'Chóp tam giác (AX₃E)', hybrid: 'sp³', bondingPairs: 3, lonePairs: 1, angle: 107, geometry: 'Chóp tam giác', polar: true },
  { id: 'h2o', formula: 'H₂O', name: 'Chữ V (AX₂E₂)', hybrid: 'sp³', bondingPairs: 2, lonePairs: 2, angle: 104.5, geometry: 'Gấp khúc (Chữ V)', polar: true },
  { id: 'pcl5', formula: 'PCl₅', name: 'Lưỡng chóp tam giác (AX₅)', hybrid: 'sp³d', bondingPairs: 5, lonePairs: 0, angle: 90, geometry: 'Lưỡng chóp tam giác (90° & 120°)', polar: false },
  { id: 'sf6', formula: 'SF₆', name: 'Bát diện đều (AX₆)', hybrid: 'sp³d²', bondingPairs: 6, lonePairs: 0, angle: 90, geometry: 'Bát diện đều (Octahedral)', polar: false }
];

function computeTitrationPH(
  acidType: 'hcl' | 'ch3cooh',
  vAcidMl: number,
  cAcid: number,
  vBaseMl: number,
  cBase: number
): number {
  const nA = (vAcidMl / 1000) * cAcid;
  const nB = (vBaseMl / 1000) * cBase;
  const vTot = Math.max(0.0001, (vAcidMl + vBaseMl) / 1000);
  const ka = 1.8e-5; // CH3COOH

  if (acidType === 'hcl') {
    const diff = nA - nB;
    if (Math.abs(diff) < 1e-7) return 7;
    if (diff > 0) {
      return Math.max(0.2, Math.min(7, -Math.log10(diff / vTot)));
    }
    const poh = -Math.log10(-diff / vTot);
    return Math.min(13.8, Math.max(7, 14 - poh));
  } else {
    if (nB < 1e-8) {
      const h = Math.sqrt(ka * cAcid);
      return Math.max(1, -Math.log10(h));
    }
    if (nB < nA - 1e-6) {
      const ratio = nB / Math.max(1e-8, nA - nB);
      return Math.max(1.5, Math.min(12, 4.74 + Math.log10(ratio)));
    }
    if (Math.abs(nB - nA) <= 1e-6) {
      const cSalt = nA / vTot;
      const kb = 1e-14 / ka;
      const oh = Math.sqrt(kb * cSalt);
      return 14 + Math.log10(oh);
    }
    const oh = (nB - nA) / vTot;
    return Math.min(13.8, 14 + Math.log10(Math.max(1e-7, oh)));
  }
}

export const ChemistrySandboxes: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const [activeTab, setActiveTab] = useState<'periodic' | 'stoich' | 'titration' | 'vsepr'>('periodic');

  // 1. Periodic table state
  const [selectedZ, setSelectedZ] = useState<number>(6);
  const selectedEl = useMemo(
    () => ELEMENTS_36.find((e) => e.z === selectedZ) || ELEMENTS_36[5],
    [selectedZ]
  );

  // 2. Stoichiometry state
  const [reactionId, setReactionId] = useState<string>('zn-hcl');
  const [molA, setMolA] = useState<number>(0.25);
  const [molB, setMolB] = useState<number>(0.4);
  const [yieldPct, setYieldPct] = useState<number>(100);
  const activeReaction = useMemo(
    () => STOICH_REACTIONS.find((r) => r.id === reactionId) || STOICH_REACTIONS[0],
    [reactionId]
  );
  const stoichStats = useMemo(() => {
    const extA = molA / activeReaction.reactantA.coef;
    const extB = molB / activeReaction.reactantB.coef;
    const ext = Math.min(extA, extB) * (yieldPct / 100);
    const limiting = extA < extB ? activeReaction.reactantA.formula : extB < extA ? activeReaction.reactantB.formula : 'Vừa đủ';
    const leftA = Math.max(0, molA - ext * activeReaction.reactantA.coef);
    const leftB = Math.max(0, molB - ext * activeReaction.reactantB.coef);
    const prodMol = ext * activeReaction.productC.coef;
    const prodMass = prodMol * activeReaction.productC.molarMass;
    const gasVol = activeReaction.productC.isGas ? prodMol * 24.79 : 0;
    return { limiting, leftA, leftB, prodMol, prodMass, gasVol };
  }, [activeReaction, molA, molB, yieldPct]);

  // 3. Titration state
  const [acidType, setAcidType] = useState<'hcl' | 'ch3cooh'>('hcl');
  const [cAcid, setCAcid] = useState<number>(0.1);
  const [vBaseMl, setVBaseMl] = useState<number>(12.5);
  const [cBase, setCBase] = useState<number>(0.1);
  const vAcidMl = 25;
  const currentPH = useMemo(
    () => computeTitrationPH(acidType, vAcidMl, cAcid, vBaseMl, cBase),
    [acidType, cAcid, vBaseMl, cBase]
  );
  const eqVolMl = (vAcidMl * cAcid) / Math.max(0.01, cBase);
  const titrationCurvePoints = useMemo(() => {
    const pts: { v: number; ph: number }[] = [];
    for (let v = 0; v <= 50; v += 0.5) {
      pts.push({ v, ph: computeTitrationPH(acidType, vAcidMl, cAcid, v, cBase) });
    }
    return pts;
  }, [acidType, cAcid, cBase]);

  // 4. VSEPR visualizer state
  const [vseprId, setVseprId] = useState<string>('ch4');
  const activeVsepr = useMemo(
    () => VSEPR_PRESETS.find((v) => v.id === vseprId) || VSEPR_PRESETS[2],
    [vseprId]
  );
  const vseprCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (activeTab !== 'vsepr') return;
    const canvas = vseprCanvasRef.current;
    if (!canvas) return;
    let raf = 0;
    const draw = (now: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#090f1e';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const t = now * 0.001;
      const R = 96;

      // Subtle reference ring
      ctx.strokeStyle = 'rgba(148,163,184,0.18)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const totalDirs = activeVsepr.bondingPairs + activeVsepr.lonePairs;
      const baseAngle = -Math.PI / 2;
      for (let i = 0; i < totalDirs; i++) {
        const theta = baseAngle + (i * Math.PI * 2) / totalDirs + Math.sin(t * 1.1) * 0.08;
        const x = cx + Math.cos(theta) * R;
        const y = cy + Math.sin(theta) * R;
        const isLone = i >= activeVsepr.bondingPairs;

        if (isLone) {
          ctx.fillStyle = 'rgba(251, 191, 36, 0.22)';
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.ellipse(
            cx + Math.cos(theta) * 54,
            cy + Math.sin(theta) * 54,
            24,
            13,
            theta,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#fde68a';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('e⁻ pair', cx + Math.cos(theta) * 62, cy + Math.sin(theta) * 62 + 4);
        } else {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.stroke();

          ctx.fillStyle = '#0ea5e9';
          ctx.beginPath();
          ctx.arc(x, y, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('X', x, y + 4);
        }
      }

      // Central atom
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c7d2fe';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('A', cx, cy + 5);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${activeVsepr.formula} · Lai hóa ${activeVsepr.hybrid} · Góc ≈ ${activeVsepr.angle}°`, 14, 24);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [activeTab, activeVsepr]);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {isEn ? 'Interactive Chemistry Sandbox Workbench (4 Labs)' : 'Sandbox Hóa Học Tương Tác (4 Phòng Thực Hành)'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Explore Periodic Table Z=1..36, Stoichiometry Calculator, Acid–Base Burette Titration, and VSEPR Geometry.'
              : 'Thực hành tra cứu Bảng Tuần Hoàn Z=1..36, Cân bằng & Tính chất hết/dư, Buret Chuẩn độ pH và Hình học VSEPR.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {(
            [
              { id: 'periodic', label: isEn ? 'Periodic Z=1..36' : 'Bảng Tuần Hoàn', icon: Atom },
              { id: 'stoich', label: isEn ? 'Stoichiometry' : 'Tính Mol Hết/Dư', icon: Scale },
              { id: 'titration', label: isEn ? 'Burette pH' : 'Buret Chuẩn Độ pH', icon: Beaker },
              { id: 'vsepr', label: isEn ? 'VSEPR Geometry' : 'Hình học VSEPR', icon: FlaskConical }
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: INTERACTIVE PERIODIC TABLE Z=1..36 */}
      {activeTab === 'periodic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 overflow-x-auto">
            <div className="min-w-[640px] grid grid-cols-18 gap-1">
              {[1, 2, 3, 4].map((period) =>
                Array.from({ length: 18 }, (_, idx) => {
                  const group = idx + 1;
                  const el = ELEMENTS_36.find((x) => x.period === period && x.group === group);
                  if (!el) {
                    return <div key={`${period}-${group}`} className="h-12" />;
                  }
                  const active = el.z === selectedEl.z;
                  const blockCls =
                    el.block === 's'
                      ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800/70'
                      : el.block === 'p'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/70'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70';
                  return (
                    <button
                      key={el.z}
                      type="button"
                      onClick={() => setSelectedZ(el.z)}
                      className={`h-12 rounded-md border flex flex-col items-center justify-center p-0.5 cursor-pointer transition-all ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-400 scale-105 z-10'
                          : `${blockCls} text-slate-800 dark:text-slate-100 hover:border-indigo-500`
                      }`}
                    >
                      <span className="text-[9px] font-mono tabular-nums opacity-75">{el.z}</span>
                      <span className="text-xs font-extrabold leading-none">{el.symbol}</span>
                    </button>
                  );
                })
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>Khối s: Nhóm IA – IIA (H, He, Li, Na, Mg, K, Ca...)</span>
              <span>·</span>
              <span>Khối p: Nhóm IIIA – VIIIA (C, N, O, F, Cl...)</span>
              <span>·</span>
              <span>Khối d: Kim loại chuyển tiếp chu kì 4 (Sc → Zn)</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Z = {selectedEl.z} · Chu kì {selectedEl.period} · Nhóm {selectedEl.group} · Khối {selectedEl.block}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {selectedEl.symbol} — {selectedEl.name}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400">{selectedEl.category}</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0">
                {selectedEl.symbol}
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono tabular-nums border-t border-slate-200 dark:border-slate-700 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Cấu hình electron:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedEl.config}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nguyên tử khối:</span>
                <span className="font-bold">{selectedEl.mass} amu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Độ âm điện (Pauling):</span>
                <span className="font-bold">{selectedEl.en > 0 ? selectedEl.en : '— (Khí hiếm)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bán kính nguyên tử:</span>
                <span className="font-bold">{selectedEl.radiusPm} pm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số oxi hóa đặc trưng:</span>
                <span className="font-bold">{selectedEl.ox}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STOICHIOMETRY LIMITING REAGENT SANDBOX */}
      {activeTab === 'stoich' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Chọn phương trình phản ứng mẫu:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STOICH_REACTIONS.map((rx) => (
                  <button
                    key={rx.id}
                    type="button"
                    onClick={() => setReactionId(rx.id)}
                    className={`p-2.5 rounded-lg border text-left text-xs font-semibold cursor-pointer transition-colors ${
                      rx.id === activeReaction.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {rx.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
              <MathFormula formula={activeReaction.equationLatex} />
            </div>

            <div className="space-y-3 text-xs">
              <label className="block space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Số mol ban đầu n({activeReaction.reactantA.formula})</span>
                  <span className="font-mono tabular-nums text-sky-600 dark:text-sky-400">
                    {molA.toFixed(2)} mol ({(molA * activeReaction.reactantA.molarMass).toFixed(2)} g)
                  </span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={2}
                  step={0.05}
                  value={molA}
                  onChange={(e) => setMolA(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </label>

              <label className="block space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Số mol ban đầu n({activeReaction.reactantB.formula})</span>
                  <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                    {molB.toFixed(2)} mol ({(molB * activeReaction.reactantB.molarMass).toFixed(2)} g)
                  </span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={3}
                  step={0.05}
                  value={molB}
                  onChange={(e) => setMolB(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </label>

              <label className="block space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Hiệu suất phản ứng H (%)</span>
                  <span className="font-mono tabular-nums text-amber-600 dark:text-amber-400">{yieldPct}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={yieldPct}
                  onChange={(e) => setYieldPct(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Kết quả Cân bằng &amp; Chất Hết / Dư (theo ĐKC 24,79 L/mol)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono tabular-nums">
              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3">
                <div className="text-slate-500">Chất hết trước (tính theo):</div>
                <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {stoichStats.limiting}
                </div>
              </div>
              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3">
                <div className="text-slate-500">Sản phẩm {activeReaction.productC.formula}:</div>
                <div className="text-base font-extrabold text-sky-600 dark:text-sky-400 mt-1">
                  {stoichStats.prodMol.toFixed(3)} mol ({stoichStats.prodMass.toFixed(2)} g)
                </div>
              </div>
              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3">
                <span className="text-slate-500">{activeReaction.reactantA.formula} dư:</span>{' '}
                <strong className="text-slate-900 dark:text-white">{stoichStats.leftA.toFixed(3)} mol</strong>
              </div>
              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3">
                <span className="text-slate-500">{activeReaction.reactantB.formula} dư:</span>{' '}
                <strong className="text-slate-900 dark:text-white">{stoichStats.leftB.toFixed(3)} mol</strong>
              </div>
            </div>
            {stoichStats.gasVol > 0 && (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3 text-xs font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Thể tích khí {activeReaction.productC.formula} ở ĐKC (25°C, 1 bar):{' '}
                  <strong className="font-mono tabular-nums">{stoichStats.gasVol.toFixed(3)} lít</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: VIRTUAL BURETTE TITRATION SANDBOX */}
      {activeTab === 'titration' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="space-y-4">
            <div className="flex gap-2">
              {(
                [
                  { id: 'hcl', label: 'Acid mạnh HCl' },
                  { id: 'ch3cooh', label: 'Acid yếu CH₃COOH (Ka = 1,8·10⁻⁵)' }
                ] as const
              ).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAcidType(a.id)}
                  className={`flex-1 py-2 px-2.5 rounded-lg border text-xs font-bold cursor-pointer ${
                    acidType === a.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>

            <div className="space-y-3 text-xs">
              <label className="block space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Thể tích NaOH nhỏ từ Buret (V)</span>
                  <span className="font-mono tabular-nums text-sky-600">{vBaseMl.toFixed(1)} mL</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={0.5}
                  value={vBaseMl}
                  onChange={(e) => setVBaseMl(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </label>

              <label className="block space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Nồng độ acid C_a (trong 25 mL bình tam giác)</span>
                  <span className="font-mono tabular-nums">{cAcid.toFixed(2)} M</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.2}
                  step={0.01}
                  value={cAcid}
                  onChange={(e) => setCAcid(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </label>

              <label className="block space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Nồng độ NaOH chuẩn C_b</span>
                  <span className="font-mono tabular-nums">{cBase.toFixed(2)} M</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.2}
                  step={0.01}
                  value={cBase}
                  onChange={(e) => setCBase(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </label>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setVBaseMl((v) => Math.min(50, Math.round((v + 0.5) * 10) / 10))}
                  className="px-2.5 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-semibold cursor-pointer"
                >
                  +0,5 mL nhỏ giọt
                </button>
                <button
                  type="button"
                  onClick={() => setVBaseMl(Math.min(50, Math.round(eqVolMl * 10) / 10))}
                  className="px-2.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
                >
                  Nhảy tới điểm tương đương ({eqVolMl.toFixed(1)} mL)
                </button>
                <button
                  type="button"
                  onClick={() => setVBaseMl(0)}
                  className="px-2.5 py-1.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>0 mL</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 flex flex-col items-center justify-between">
              <div className="text-xs font-bold text-slate-500">Màu Phenolphthalein bình nón</div>
              <div
                className="w-28 h-28 rounded-full border-4 border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center transition-colors"
                style={{
                  backgroundColor:
                    currentPH >= 10
                      ? 'rgba(236, 72, 153, 0.72)'
                      : currentPH >= 8.2
                      ? 'rgba(244, 114, 182, 0.42)'
                      : 'rgba(226, 232, 240, 0.25)'
                }}
              >
                <span className="text-2xl font-mono font-extrabold tabular-nums text-slate-900 dark:text-white">
                  {currentPH.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300">pH</span>
              </div>
              <div className="text-xs text-center font-semibold text-slate-600 dark:text-slate-300">
                {currentPH < 8.2
                  ? 'Không màu (Dư acid / Đệm)'
                  : currentPH < 10
                  ? 'Hồng nhạt (Chuyển màu 8,2–10)'
                  : 'Hồng cánh sen đậm (Dư bazơ)'}
              </div>
            </div>

            <div className="md:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-3">
              <div className="text-xs font-mono text-slate-400 mb-1">
                Đường cong Chuẩn độ pH theo V_NaOH (Điểm tương đương V_eq = {eqVolMl.toFixed(1)} mL)
              </div>
              <svg viewBox="0 0 420 200" className="w-full h-44">
                <line x1="36" y1="172" x2="404" y2="172" stroke="#334155" />
                <line x1="36" y1="16" x2="36" y2="172" stroke="#334155" />
                <line x1="36" y1={172 - (7 / 14) * 150} x2="404" y2={172 - (7 / 14) * 150} stroke="#475569" strokeDasharray="4 4" />
                <path
                  d={titrationCurvePoints
                    .map((p, i) => {
                      const x = 36 + (p.v / 50) * 360;
                      const y = 172 - (p.ph / 14) * 150;
                      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
                <circle
                  cx={36 + (vBaseMl / 50) * 360}
                  cy={172 - (currentPH / 14) * 150}
                  r="5"
                  fill="#f43f5e"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <text x="8" y="24" fill="#94a3b8" fontSize="10">14</text>
                <text x="12" y="98" fill="#94a3b8" fontSize="10">7</text>
                <text x="12" y="174" fill="#94a3b8" fontSize="10">0</text>
                <text x="36" y="190" fill="#94a3b8" fontSize="10">0 mL</text>
                <text x="365" y="190" fill="#94a3b8" fontSize="10">50 mL</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VSEPR MOLECULAR GEOMETRY EXPLORER */}
      {activeTab === 'vsepr' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="space-y-2">
            {VSEPR_PRESETS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVseprId(v.id)}
                className={`w-full text-left p-3 rounded-lg border cursor-pointer transition-colors ${
                  v.id === activeVsepr.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-xs font-extrabold">{v.formula} · {v.name}</div>
                <div className={`text-[11px] ${v.id === activeVsepr.id ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  Lai hóa {v.hybrid} · Góc {v.angle}° · {v.polar ? 'Phân cực' : 'Không phân cực'}
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-3 flex flex-col justify-between">
            <canvas ref={vseprCanvasRef} width={640} height={320} className="w-full h-72 rounded-lg" />
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-200 font-mono tabular-nums">
              <div className="bg-slate-900 rounded-lg p-2.5 border border-slate-800">
                <div className="text-slate-400">Hình học không gian</div>
                <div className="font-bold text-sky-400 mt-0.5">{activeVsepr.geometry}</div>
              </div>
              <div className="bg-slate-900 rounded-lg p-2.5 border border-slate-800">
                <div className="text-slate-400">Cặp e liên kết / Tự do</div>
                <div className="font-bold text-amber-400 mt-0.5">{activeVsepr.bondingPairs} LK / {activeVsepr.lonePairs} E</div>
              </div>
              <div className="bg-slate-900 rounded-lg p-2.5 border border-slate-800">
                <div className="text-slate-400">Tính phân cực</div>
                <div className="font-bold text-emerald-400 mt-0.5">{activeVsepr.polar ? 'Phân cực (μ ≠ 0)' : 'Đối xứng (μ = 0)'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
