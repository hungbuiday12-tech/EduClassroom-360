import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Atom,
  Beaker,
  Calculator,
  CheckCircle2,
  Download,
  Droplets,
  Flame,
  FlaskConical,
  GitBranch,
  RotateCcw,
  Scale,
  Sparkles,
  Trophy
} from 'lucide-react';
import { MathFormula } from '../common/MathRenderer';
import { SandboxIntroGuideBanner } from '../common/SandboxIntroGuideBanner';
import { useBackgroundTheme } from '../../context/BackgroundContext';

function triggerDownloadText(filename: string, content: string, mime = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

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

type QualIonId = 'Cl-' | 'Br-' | 'I-' | 'SO4^2-' | 'Fe^3+' | 'Fe^2+' | 'Cu^2+' | 'Al^3+' | 'NH4+';
type QualReagentId = 'agno3' | 'bacl2' | 'naoh' | 'naoh_ex' | 'nh3_ex' | 'litmus_heat';

const QUAL_IONS: { id: QualIonId; label: string; initColor: string }[] = [
  { id: 'Cl-', label: 'Cl⁻', initColor: 'rgba(148,163,184,0.18)' },
  { id: 'Br-', label: 'Br⁻', initColor: 'rgba(148,163,184,0.18)' },
  { id: 'I-', label: 'I⁻', initColor: 'rgba(148,163,184,0.18)' },
  { id: 'SO4^2-', label: 'SO₄²⁻', initColor: 'rgba(148,163,184,0.18)' },
  { id: 'Fe^3+', label: 'Fe³⁺', initColor: 'rgba(245,158,11,0.28)' },
  { id: 'Fe^2+', label: 'Fe²⁺', initColor: 'rgba(16,185,129,0.2)' },
  { id: 'Cu^2+', label: 'Cu²⁺', initColor: 'rgba(14,165,233,0.34)' },
  { id: 'Al^3+', label: 'Al³⁺', initColor: 'rgba(148,163,184,0.18)' },
  { id: 'NH4+', label: 'NH₄⁺', initColor: 'rgba(148,163,184,0.18)' }
];

const FLAME_SALTS = [
  { id: 'Li+', name: 'Li⁺ (Liti)', color: '#e11d48', desc: 'Đỏ son rực (671 nm)', lines: [671, 610] },
  { id: 'Na+', name: 'Na⁺ (Natri)', color: '#facc15', desc: 'Vàng rực đặc trưng (589 nm)', lines: [589, 589.6] },
  { id: 'K+', name: 'K⁺ (Kali)', color: '#a855f7', desc: 'Tím hoa cà (404 nm)', lines: [404, 766] },
  { id: 'Ca2+', name: 'Ca²⁺ (Canxi)', color: '#f97316', desc: 'Đỏ cam (622 nm)', lines: [622, 553] },
  { id: 'Sr2+', name: 'Sr²⁺ (Stronti)', color: '#dc2626', desc: 'Đỏ thắm (650 nm)', lines: [650, 461] },
  { id: 'Ba2+', name: 'Ba²⁺ (Bari)', color: '#84cc16', desc: 'Xanh lục vàng (524 nm)', lines: [524, 554] },
  { id: 'Cu2+', name: 'Cu²⁺ (Đồng)', color: '#10b981', desc: 'Xanh lục lam (515 nm)', lines: [515, 522] }
];

function evaluateQualitativeReaction(ion: QualIonId, reagent: QualReagentId): {
  result: string;
  solColor: string;
  pptColor: string | null;
  gasColor: string | null;
  equation: string;
} {
  if (reagent === 'agno3') {
    if (ion === 'Cl-') return { result: 'Kết tủa trắng AgCl↓', solColor: 'rgba(226,232,240,0.2)', pptColor: '#f8fafc', gasColor: null, equation: 'Ag⁺ + Cl⁻ → AgCl↓ (trắng)' };
    if (ion === 'Br-') return { result: 'Kết tủa vàng nhạt AgBr↓', solColor: 'rgba(254,240,138,0.22)', pptColor: '#fef08a', gasColor: null, equation: 'Ag⁺ + Br⁻ → AgBr↓ (vàng nhạt)' };
    if (ion === 'I-') return { result: 'Kết tủa vàng đậm AgI↓', solColor: 'rgba(234,179,8,0.22)', pptColor: '#eab308', gasColor: null, equation: 'Ag⁺ + I⁻ → AgI↓ (vàng đậm)' };
  }
  if (reagent === 'bacl2' && ion === 'SO4^2-') {
    return { result: 'Kết tủa trắng BaSO₄↓ không tan trong axit', solColor: 'rgba(226,232,240,0.22)', pptColor: '#f8fafc', gasColor: null, equation: 'Ba²⁺ + SO₄²⁻ → BaSO₄↓' };
  }
  if (reagent === 'naoh') {
    if (ion === 'Fe^3+') return { result: 'Kết tủa nâu đỏ Fe(OH)₃↓', solColor: 'rgba(245,158,11,0.2)', pptColor: '#9a3412', gasColor: null, equation: 'Fe³⁺ + 3OH⁻ → Fe(OH)₃↓' };
    if (ion === 'Fe^2+') return { result: 'Kết tủa trắng xanh Fe(OH)₂↓ hóa nâu dần', solColor: 'rgba(16,185,129,0.2)', pptColor: '#86efac', gasColor: null, equation: 'Fe²⁺ + 2OH⁻ → Fe(OH)₂↓' };
    if (ion === 'Cu^2+') return { result: 'Kết tủa xanh lam Cu(OH)₂↓', solColor: 'rgba(14,165,233,0.25)', pptColor: '#0284c7', gasColor: null, equation: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂↓' };
    if (ion === 'Al^3+') return { result: 'Kết tủa keo trắng Al(OH)₃↓', solColor: 'rgba(226,232,240,0.22)', pptColor: '#e2e8f0', gasColor: null, equation: 'Al³⁺ + 3OH⁻ → Al(OH)₃↓' };
    if (ion === 'NH4+') return { result: 'Khí mùi khai NH₃↑ thoát ra', solColor: 'rgba(148,163,184,0.18)', pptColor: null, gasColor: '#38bdf8', equation: 'NH₄⁺ + OH⁻ → NH₃↑ + H₂O' };
  }
  if (reagent === 'naoh_ex') {
    if (ion === 'Al^3+') return { result: 'Kết tủa keo trắng TAN hết tạo [Al(OH)₄]⁻!', solColor: 'rgba(226,232,240,0.14)', pptColor: null, gasColor: null, equation: 'Al(OH)₃ + OH⁻ → [Al(OH)₄]⁻ (tan trong suốt)' };
    if (ion === 'Fe^3+') return { result: 'Kết tủa nâu đỏ Fe(OH)₃↓ không tan', solColor: 'rgba(245,158,11,0.2)', pptColor: '#9a3412', gasColor: null, equation: 'Fe(OH)₃ + NaOH → Không tan' };
    if (ion === 'Cu^2+') return { result: 'Kết tủa xanh lam Cu(OH)₂↓ không tan', solColor: 'rgba(14,165,233,0.25)', pptColor: '#0284c7', gasColor: null, equation: 'Cu(OH)₂ + NaOH → Không tan' };
  }
  if (reagent === 'nh3_ex') {
    if (ion === 'Cu^2+') return { result: 'Tạo phức đồng-amoniac [Cu(NH₃)₄]²⁺ xanh thẫm!', solColor: 'rgba(29,78,216,0.82)', pptColor: null, gasColor: null, equation: 'Cu(OH)₂ + 4NH₃ → [Cu(NH₃)₄](OH)₂ (xanh thẫm)' };
    if (ion === 'Cl-') return { result: 'AgCl tan hết trong NH₃ dư tạo [Ag(NH₃)₂]⁺', solColor: 'rgba(226,232,240,0.16)', pptColor: null, gasColor: null, equation: 'AgCl + 2NH₃ → [Ag(NH₃)₂]⁺ + Cl⁻' };
    if (ion === 'Al^3+') return { result: 'Kết tủa keo trắng Al(OH)₃↓ KHÔNG tan trong NH₃ dư', solColor: 'rgba(226,232,240,0.22)', pptColor: '#e2e8f0', gasColor: null, equation: 'Al³⁺ + 3NH₃ + 3H₂O → Al(OH)₃↓ + 3NH₄⁺' };
  }
  if (reagent === 'litmus_heat' && ion === 'NH4+') {
    return { result: 'Đun nóng với kiềm làm quỳ tím ẩm hóa XANH!', solColor: 'rgba(56,189,248,0.22)', pptColor: null, gasColor: '#3b82f6', equation: 'NH₄⁺ + OH⁻ (t°) → NH₃↑ (làm xanh quỳ ẩm)' };
  }
  return { result: 'Không có hiện tượng kết tủa hay khí đặc trưng', solColor: 'rgba(148,163,184,0.18)', pptColor: null, gasColor: null, equation: 'Không phản ứng' };
}

interface RedoxStepPreset {
  id: string;
  label: string;
  unbalanced: string;
  oxStates: string;
  halfOxidation: string;
  halfReduction: string;
  multipliers: string;
  balancedLatex: string;
  balancedPlain: string;
  note: string;
}

const REDOX_PRESETS: RedoxStepPreset[] = [
  {
    id: 'cu-hno3',
    label: 'Cu + HNO₃ (loãng) → NO↑',
    unbalanced: 'Cu + HNO₃ → Cu(NO₃)₂ + NO↑ + H₂O',
    oxStates: 'Cu⁰ → Cu⁺² (chất khử) ; N⁺⁵ → N⁺² (chất oxi hóa)',
    halfOxidation: 'Cu⁰ → Cu⁺² + 2e   (nhường 2e)',
    halfReduction: 'N⁺⁵ + 3e → N⁺²   (nhận 3e)',
    multipliers: 'BCNN(2, 3) = 6 → nhân 3 cho Cu, nhân 2 cho NO',
    balancedLatex: '3\\text{Cu} + 8\\text{HNO}_3 \\rightarrow 3\\text{Cu(NO}_3)_2 + 2\\text{NO}\\uparrow + 4\\text{H}_2\\text{O}',
    balancedPlain: '3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O',
    note: 'Tổng N ở vế phải = 3×2 (muối) + 2 (NO) = 8 nên hệ số HNO₃ là 8, H₂O là 4.'
  },
  {
    id: 'fes2-o2',
    label: 'FeS₂ + O₂ → Fe₂O₃ + SO₂',
    unbalanced: 'FeS₂ + O₂ → Fe₂O₃ + SO₂↑',
    oxStates: 'FeS₂⁰ (tổng nhóm = 0) → Fe⁺³ + 2S⁺⁴ ; O₂⁰ → 2O⁻²',
    halfOxidation: '2FeS₂⁰ → 2Fe⁺³ + 4S⁺⁴ + 22e   (1 FeS₂ nhường 11e)',
    halfReduction: 'O₂⁰ + 4e → 2O⁻²   (nhận 4e)',
    multipliers: 'BCNN(22, 4) = 44 → nhân 2 cho 2FeS₂ (tức 4 FeS₂), nhân 11 cho O₂',
    balancedLatex: '4\\text{FeS}_2 + 11\\text{O}_2 \\xrightarrow{t^\\circ} 2\\text{Fe}_2\\text{O}_3 + 8\\text{SO}_2\\uparrow',
    balancedPlain: '4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂↑',
    note: 'Mẹo: Coi cả phân tử FeS₂ có số oxi hóa tổng bằng 0 để tránh tách nhầm S⁻¹.'
  },
  {
    id: 'fes2-hno3',
    label: 'FeS₂ + HNO₃ → H₂SO₄ + NO↑',
    unbalanced: 'FeS₂ + HNO₃ → Fe(NO₃)₃ + H₂SO₄ + NO↑ + H₂O',
    oxStates: 'FeS₂⁰ → Fe⁺³ + 2S⁺⁶ ; N⁺⁵ → N⁺²',
    halfOxidation: 'FeS₂⁰ → Fe⁺³ + 2S⁺⁶ + 15e   (1 phân tử nhường 15e!)',
    halfReduction: 'N⁺⁵ + 3e → N⁺²   (nhận 3e)',
    multipliers: 'BCNN(15, 3) = 15 → nhân 1 cho FeS₂, nhân 5 cho NO',
    balancedLatex: '\\text{FeS}_2 + 8\\text{HNO}_3 \\rightarrow \\text{Fe(NO}_3)_3 + 2\\text{H}_2\\text{SO}_4 + 5\\text{NO}\\uparrow + 2\\text{H}_2\\text{O}',
    balancedPlain: 'FeS₂ + 8HNO₃ → Fe(NO₃)₃ + 2H₂SO₄ + 5NO↑ + 2H₂O',
    note: 'Cả Fe và S đều tăng lên số oxi hóa cực đại (+3 và +6): 1×3 + 2×6 = 15e.'
  },
  {
    id: 'kmno4-hcl',
    label: 'KMnO₄ + HCl → Cl₂↑ (điều chế Cl₂)',
    unbalanced: 'KMnO₄ + HCl (đặc) → KCl + MnCl₂ + Cl₂↑ + H₂O',
    oxStates: 'Mn⁺⁷ → Mn⁺² (chất oxi hóa) ; 2Cl⁻¹ → Cl₂⁰ (chất khử)',
    halfOxidation: '2Cl⁻¹ → Cl₂⁰ + 2e   (nhường 2e)',
    halfReduction: 'Mn⁺⁷ + 5e → Mn⁺²   (nhận 5e)',
    multipliers: 'BCNN(2, 5) = 10 → nhân 5 cho Cl₂, nhân 2 cho KMnO₄',
    balancedLatex: '2\\text{KMnO}_4 + 16\\text{HCl} \\rightarrow 2\\text{KCl} + 2\\text{MnCl}_2 + 5\\text{Cl}_2\\uparrow + 8\\text{H}_2\\text{O}',
    balancedPlain: '2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂↑ + 8H₂O',
    note: 'Trong 16 mol HCl có 10 mol tạo Cl₂ (khử) và 6 mol tạo muối KCl, MnCl₂ (môi trường).'
  },
  {
    id: 'fe3o4-hno3',
    label: 'Fe₃O₄ + HNO₃ → Fe(NO₃)₃ + NO↑',
    unbalanced: 'Fe₃O₄ + HNO₃ → Fe(NO₃)₃ + NO↑ + H₂O',
    oxStates: 'Fe⁺⁸/³ (3 nguyên tử Fe) → 3Fe⁺³ ; N⁺⁵ → N⁺²',
    halfOxidation: '3Fe⁺⁸/³ → 3Fe⁺³ + 1e   (1 phân tử Fe₃O₄ nhường 1e)',
    halfReduction: 'N⁺⁵ + 3e → N⁺²   (nhận 3e)',
    multipliers: 'BCNN(1, 3) = 3 → nhân 3 cho Fe₃O₄, nhân 1 cho NO',
    balancedLatex: '3\\text{Fe}_3\\text{O}_4 + 28\\text{HNO}_3 \\rightarrow 9\\text{Fe(NO}_3)_3 + \\text{NO}\\uparrow + 14\\text{H}_2\\text{O}',
    balancedPlain: '3Fe₃O₄ + 28HNO₃ → 9Fe(NO₃)₃ + NO↑ + 14H₂O',
    note: 'Fe₃O₄ = FeO·Fe₂O₃ nên thực chất chỉ có 1 Fe⁺² lên Fe⁺³, nhường đúng 1e/phân tử.'
  },
  {
    id: 'kmno4-feso4',
    label: 'KMnO₄ + FeSO₄ + H₂SO₄',
    unbalanced: 'KMnO₄ + FeSO₄ + H₂SO₄ → Fe₂(SO₄)₃ + K₂SO₄ + MnSO₄ + H₂O',
    oxStates: 'Fe⁺² → Fe⁺³ ; Mn⁺⁷ → Mn⁺²',
    halfOxidation: '2Fe⁺² → 2Fe⁺³ + 2e   (cân bằng sẵn Fe₂)',
    halfReduction: 'Mn⁺⁷ + 5e → Mn⁺²',
    multipliers: 'BCNN(2, 5) = 10 → nhân 5 cho Fe₂(SO₄)₃ (tức 10 FeSO₄), nhân 2 cho KMnO₄',
    balancedLatex: '2\\text{KMnO}_4 + 10\\text{FeSO}_4 + 8\\text{H}_2\\text{SO}_4 \\rightarrow 5\\text{Fe}_2(\\text{SO}_4)_3 + \\text{K}_2\\text{SO}_4 + 2\\text{MnSO}_4 + 8\\text{H}_2\\text{O}',
    balancedPlain: '2KMnO₄ + 10FeSO₄ + 8H₂SO₄ → 5Fe₂(SO₄)₃ + K₂SO₄ + 2MnSO₄ + 8H₂O',
    note: 'Phản ứng chuẩn độ Permanganat kinh điển xác định hàm lượng muối sắt (II).'
  },
  {
    id: 'al-hno3-nh4no3',
    label: 'Al + HNO₃ (rất loãng) → NH₄NO₃',
    unbalanced: 'Al + HNO₃ → Al(NO₃)₃ + NH₄NO₃ + H₂O',
    oxStates: 'Al⁰ → Al⁺³ ; N⁺⁵ → N⁻³ (trong NH₄⁺)',
    halfOxidation: 'Al⁰ → Al⁺³ + 3e   (nhường 3e)',
    halfReduction: 'N⁺⁵ + 8e → N⁻³   (nhận 8e)',
    multipliers: 'BCNN(3, 8) = 24 → nhân 8 cho Al, nhân 3 cho NH₄NO₃',
    balancedLatex: '8\\text{Al} + 30\\text{HNO}_3 \\rightarrow 8\\text{Al(NO}_3)_3 + 3\\text{NH}_4\\text{NO}_3 + 9\\text{H}_2\\text{O}',
    balancedPlain: '8Al + 30HNO₃ → 8Al(NO₃)₃ + 3NH₄NO₃ + 9H₂O',
    note: 'Lưu ý: Sản phẩm khử không khí (NH₄NO₃) rất dễ bị bỏ sót khi dùng Bảo toàn Electron!'
  },
  {
    id: 'so2-kmno4',
    label: 'SO₂ + KMnO₄ + H₂O (mất màu thuốc tím)',
    unbalanced: 'SO₂ + KMnO₄ + H₂O → K₂SO₄ + MnSO₄ + H₂SO₄',
    oxStates: 'S⁺⁴ → S⁺⁶ ; Mn⁺⁷ → Mn⁺²',
    halfOxidation: 'S⁺⁴ → S⁺⁶ + 2e   (nhường 2e)',
    halfReduction: 'Mn⁺⁷ + 5e → Mn⁺²   (nhận 5e)',
    multipliers: 'BCNN(2, 5) = 10 → nhân 5 cho SO₂, nhân 2 cho KMnO₄',
    balancedLatex: '5\\text{SO}_2 + 2\\text{KMnO}_4 + 2\\text{H}_2\\text{O} \\rightarrow \\text{K}_2\\text{SO}_4 + 2\\text{MnSO}_4 + 2\\text{H}_2\\text{SO}_4',
    balancedPlain: '5SO₂ + 2KMnO₄ + 2H₂O → K₂SO₄ + 2MnSO₄ + 2H₂SO₄',
    note: 'Phản ứng dùng để nhận biết khí SO₂ làm mất màu dung dịch thuốc tím KMnO₄.'
  }
];

interface ReactionChainPuzzle {
  id: string;
  title: string;
  category: string;
  nodes: string[];
  steps: {
    prompt: string;
    options: string[];
    correctIdx: number;
    equation: string;
  }[];
}

const CHAIN_PUZZLES: ReactionChainPuzzle[] = [
  {
    id: 'iron_chain',
    title: 'Chuỗi Sắt & Hợp chất (Vô cơ 12)',
    category: 'Vô cơ · Kim loại chuyển tiếp',
    nodes: ['Fe', 'FeCl₂', 'Fe(OH)₂', 'Fe(OH)₃', 'Fe₂O₃'],
    steps: [
      {
        prompt: 'Fe → FeCl₂',
        options: ['+ Cl₂ (t°)', '+ HCl loãng', '+ HNO₃ đặc nguội', '+ CuSO₄'],
        correctIdx: 1,
        equation: 'Fe + 2HCl → FeCl₂ + H₂↑'
      },
      {
        prompt: 'FeCl₂ → Fe(OH)₂↓',
        options: ['+ NaOH (tránh không khí)', '+ H₂O (đun sôi)', '+ NaCl', '+ NH₄Cl'],
        correctIdx: 0,
        equation: 'FeCl₂ + 2NaOH → Fe(OH)₂↓ (trắng xanh) + 2NaCl'
      },
      {
        prompt: 'Fe(OH)₂ → Fe(OH)₃↓',
        options: ['+ H₂ (t°)', '+ O₂ + H₂O (trong không khí)', '+ NaOH dư', '+ CO₂'],
        correctIdx: 1,
        equation: '4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃↓ (nâu đỏ)'
      },
      {
        prompt: 'Fe(OH)₃ → Fe₂O₃',
        options: ['+ H₂SO₄ loãng', '+ HCl dư', 'Nhiệt phân (t° cao)', '+ Na₂CO₃'],
        correctIdx: 2,
        equation: '2Fe(OH)₃ (t°) → Fe₂O₃ + 3H₂O'
      }
    ]
  },
  {
    id: 'aluminum_chain',
    title: 'Chuỗi Lưỡng tính Nhôm (Al)',
    category: 'Vô cơ · Tính lưỡng tính',
    nodes: ['Al', 'Al₂O₃', 'AlCl₃', 'Al(OH)₃', 'Na[Al(OH)₄]'],
    steps: [
      {
        prompt: 'Al → Al₂O₃',
        options: ['+ H₂O lạnh', '+ O₂ (t°)', '+ NaOH', '+ HCl'],
        correctIdx: 1,
        equation: '4Al + 3O₂ (t°) → 2Al₂O₃'
      },
      {
        prompt: 'Al₂O₃ → AlCl₃',
        options: ['+ HCl', '+ NaCl', '+ Cl₂', '+ NH₃'],
        correctIdx: 0,
        equation: 'Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O'
      },
      {
        prompt: 'AlCl₃ → Al(OH)₃↓',
        options: ['+ NaOH rất dư', '+ Dung dịch NH₃ dư', '+ H₂SO₄', '+ KNO₃'],
        correctIdx: 1,
        equation: 'AlCl₃ + 3NH₃ + 3H₂O → Al(OH)₃↓ + 3NH₄Cl (không tan trong NH₃ dư)'
      },
      {
        prompt: 'Al(OH)₃ → Na[Al(OH)₄]',
        options: ['+ NaCl', '+ NaOH (kiềm mạnh)', '+ CO₂ + H₂O', '+ NH₄Cl'],
        correctIdx: 1,
        equation: 'Al(OH)₃ + NaOH → Na[Al(OH)₄] (phức tan trong suốt)'
      }
    ]
  },
  {
    id: 'ester_chain',
    title: 'Chuỗi Hữu cơ Etilen → Etyl Axetat',
    category: 'Hữu cơ · Ancol – Axit – Este',
    nodes: ['C₂H₄', 'C₂H₅OH', 'CH₃COOH', 'CH₃COOC₂H₅'],
    steps: [
      {
        prompt: 'C₂H₄ → C₂H₅OH',
        options: ['+ H₂O (xúc tác H⁺, t°)', '+ NaOH', '+ H₂ (Ni, t°)', '+ Br₂'],
        correctIdx: 0,
        equation: 'CH₂=CH₂ + H₂O (H⁺, t°) → C₂H₅OH'
      },
      {
        prompt: 'C₂H₅OH → CH₃COOH',
        options: ['+ H₂SO₄ đặc (170°C)', '+ O₂ (xúc tác men giấm)', '+ Na kim loại', '+ CuO (t°)'],
        correctIdx: 1,
        equation: 'C₂H₅OH + O₂ (men giấm) → CH₃COOH + H₂O'
      },
      {
        prompt: 'CH₃COOH → CH₃COOC₂H₅',
        options: ['+ C₂H₅OH (H₂SO₄ đặc, t°)', '+ NaOH', '+ C₂H₄', '+ CH₃OH (H₂SO₄ đặc)'],
        correctIdx: 0,
        equation: 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O (H₂SO₄ đặc, t°)'
      }
    ]
  }
];

const CHEM_SANDBOX_GUIDES: Record<
  'periodic' | 'stoich' | 'titration' | 'vsepr' | 'qualitative' | 'redox',
  {
    titleVi: string;
    titleEn: string;
    introVi: string;
    introEn: string;
    stepsVi: string[];
    stepsEn: string[];
    tipVi: string;
    tipEn: string;
  }
> = {
  periodic: {
    titleVi: 'Bảng Tuần Hoàn Tương Tác (Z = 1..36)',
    titleEn: 'Interactive Periodic Table (Z = 1..36)',
    introVi:
      'Tra cứu cấu hình electron, phân lớp s/p/d, độ âm điện Pauling, bán kính nguyên tử và quy luật biến thiên tuần hoàn từ Hydrogen (Z=1) đến Krypton (Z=36).',
    introEn:
      'Inspect electron configurations, s/p/d blocks, Pauling electronegativity, atomic radius, and periodic trends from Z=1 to Z=36.',
    stepsVi: [
      'Nhấp chọn một ô nguyên tố bất kì (Z = 1 đến 36) trên bảng tuần hoàn.',
      'Đọc thẻ chi tiết bên phải: cấu hình electron, nguyên tử khối và số oxi hóa.',
      'Theo dõi đồ thị biến thiên Độ âm điện (xanh ngọc) & Bán kính (vàng) bên dưới.',
      'Bấm "Xuất CSV Z=1..36" nếu muốn lưu dữ liệu nguyên tố để ôn tập.',
    ],
    stepsEn: [
      'Click any element tile (Z=1 to 36) in the periodic table.',
      'Inspect electron configuration, atomic mass, and oxidation states on the right.',
      'Compare electronegativity and atomic radius trends along the chart below.',
      'Export the full CSV table for offline study.',
    ],
    tipVi: 'Trong một chu kì từ trái sang phải, bán kính nguyên tử giảm dần còn độ âm điện tăng dần.',
    tipEn: 'Across a period left-to-right, atomic radius decreases while electronegativity rises.',
  },
  stoich: {
    titleVi: 'Tính Toán Mol, Chất Hết / Chất Dư & Hiệu Suất',
    titleEn: 'Stoichiometry, Limiting Reagent & Yield',
    introVi:
      'Thực hành bài toán hóa học định lượng theo phương trình: xác định chất hết trước, lượng chất dư còn lại, thể tích khí ở ĐKC (24,79 L/mol) và ảnh hưởng của hiệu suất phản ứng H%.',
    introEn:
      'Compute limiting reagents, leftover excess moles, STP gas volumes (24.79 L/mol), and percent yield across classic reactions.',
    stepsVi: [
      'Chọn một phương trình phản ứng mẫu trong danh sách.',
      'Kéo thanh trượt số mol ban đầu của hai chất tham gia và hiệu suất H (%).',
      'Quan sát cốc phản ứng minh họa chuyển đổi lượng chất theo thời gian thực.',
      'Đọc ngay chất hết trước, số mol dư và thể tích khí thu được ở ĐKC.',
    ],
    stepsEn: [
      'Choose a sample chemical reaction equation.',
      'Drag sliders for initial moles of reactants and reaction yield (%).',
      'Watch the stoichiometric balance canvas update in real time.',
      'Read limiting reagent, excess moles remaining, and gas volume.',
    ],
    tipVi: 'Số mol sản phẩm luôn tính theo chất có tỉ lệ (n_ban_đầu / hệ_số) nhỏ hơn.',
    tipEn: 'Product yield is governed by the reactant with the smaller (moles / coefficient) ratio.',
  },
  titration: {
    titleVi: 'Chuẩn Độ Axit – Bazơ & Đường Cong pH',
    titleEn: 'Acid-Base Burette Titration & pH Curve',
    introVi:
      'Mô phỏng bình chuẩn độ với Buret nhỏ từng giọt NaOH vào dung dịch HCl hoặc CH₃COOH có chất chỉ thị Phenolphthalein, giúp nhận diện chính xác điểm tương đương và bước nhảy pH.',
    introEn:
      'Simulate dropwise NaOH titration of strong (HCl) or weak (CH₃COOH) acids with Phenolphthalein indicator and live pH curve plotting.',
    stepsVi: [
      'Chọn dung dịch cần chuẩn độ (Acid mạnh HCl hoặc Acid yếu CH₃COOH).',
      'Thiết lập nồng độ Cₐ, C_b rồi kéo thanh thể tích hoặc bấm "+0,5 mL nhỏ giọt".',
      'Quan sát bình nón đổi từ không màu sang hồng nhạt tại vùng pH 8,2–10.',
      'Bấm "Nhảy tới điểm tương đương" để so sánh bước nhảy pH của acid mạnh vs yếu.',
    ],
    stepsEn: [
      'Select strong acid HCl or weak acid CH₃COOH.',
      'Set concentrations Cₐ and C_b, then drip NaOH via "+0.5 mL" or the volume slider.',
      'Watch the Erlenmeyer flask shift from colorless to pale pink at pH 8.2–10.',
      'Jump to equivalence point to compare strong vs weak acid titration curves.',
    ],
    tipVi: 'Chuẩn độ acid yếu CH₃COOH bằng NaOH tạo vùng đệm trước điểm tương đương nên pH_eq > 7.',
    tipEn: 'Weak acid titration forms a buffer region and reaches equivalence at pH > 7.',
  },
  vsepr: {
    titleVi: 'Mô Hình Hình Học Phân Tử VSEPR 3D',
    titleEn: '3D VSEPR Molecular Geometry Explorer',
    introVi:
      'Khám phá lý thuyết đẩy giữa các cặp electron lớp vỏ hóa trị (VSEPR): lý giải vì sao CO₂ thẳng (180°), CH₄ tứ diện (109,5°), NH₃ chóp tam giác (107°) và H₂O chữ V (104,5°).',
    introEn:
      'Explore VSEPR electron-pair repulsion explaining linear, tetrahedral, trigonal pyramidal, and bent geometries in 3D.',
    stepsVi: [
      'Chọn một phân tử tiêu biểu ở cột bên trái (CO₂, BF₃, CH₄, NH₃, H₂O, SF₆).',
      'Quan sát mô hình 3D xoay liên tục hiển thị cặp liên kết và cặp electron tự do (E).',
      'Đối chiếu trạng thái lai hóa (sp, sp², sp³, sp³d²), góc liên kết và tính phân cực.',
    ],
    stepsEn: [
      'Pick a molecule preset (CO₂, BF₃, CH₄, NH₃, H₂O, SF₆) from the left panel.',
      'Inspect the rotating 3D structure showing bonding pairs and lone pairs (E).',
      'Compare hybridization states, bond angles, and net dipole polarity.',
    ],
    tipVi: 'Cặp electron tự do (E) chiếm không gian lớn hơn nên ép góc liên kết nhỏ lại.',
    tipEn: 'Lone pairs exert greater repulsion, compressing adjacent bonding angles.',
  },
  qualitative: {
    titleVi: 'Nhận Biết Ion, Thử Ngọn Lửa & Chuỗi Phản Ứng',
    titleEn: 'Ion Tests, Flame Spectroscopy & Reaction Chains',
    introVi:
      'Thực hành phân tích định tính vô cơ qua 3 chế độ: nhỏ thuốc thử nhận biết ion/lọ mất nhãn, đốt muối thử màu ngọn lửa quang phổ vạch và giải trò chơi chuỗi chuyển hóa.',
    introEn:
      'Practice qualitative inorganic analysis across ion precipitation/gas tests, flame spectroscopy, and multi-step reaction chains.',
    stepsVi: [
      'Chọn một trong 3 chế độ: Nhận biết Ion & Lọ mất nhãn, Thử Ngọn lửa hoặc Chuỗi PƯ.',
      'Ở chế độ Ion: nhỏ AgNO₃, BaCl₂, NaOH, NH₃... để xem kết tủa màu hoặc khí thoát ra.',
      'Bật "Thử thách Lọ Mất Nhãn" để tự nhỏ thuốc thử và suy luận ion bí ẩn.',
      'Ở chế độ Chuỗi PƯ: chọn đúng tác nhân cho từng mũi tên chuyển hóa.',
    ],
    stepsEn: [
      'Switch between Ion/Mystery Bottle, Flame Test, or Reaction Chain Game.',
      'Drop reagents (AgNO₃, BaCl₂, NaOH, NH₃) to inspect characteristic precipitates and gases.',
      'Try Mystery Bottle mode to deduce the unknown ion from observations.',
      'In Reaction Chains, pick the right reagent/condition for each conversion step.',
    ],
    tipVi: 'Kết tủa Cu(OH)₂ xanh lam tan trong NH₃ dư tạo phức xanh thẫm [Cu(NH₃)₄](OH)₂.',
    tipEn: 'Blue Cu(OH)₂ precipitate dissolves in excess NH₃ forming a deep-blue complex.',
  },
  redox: {
    titleVi: 'Cân Bằng Oxi Hóa–Khử & 3 Định Luật Bảo Toàn',
    titleEn: 'Redox Balancer & Conservation Laws Solver',
    introVi:
      'Thành thạo phương pháp thăng bằng electron qua 4 bước trực quan và giải nhanh bài toán kim loại tác dụng HNO₃ / H₂SO₄ đặc bằng Bảo toàn Electron, Nguyên tố và Khối lượng.',
    introEn:
      'Master 4-step electron-balance redox equations and solve metal-acid problems using Electron, Element, and Mass Conservation.',
    stepsVi: [
      'Bên trái: chọn một phương trình OXH–Khử rồi bấm "Bước tiếp" để xem 4 bước cân bằng.',
      'Bên phải: chọn kim loại (Cu, Fe, Al, Mg), kéo khối lượng m(g) và chọn loại axit oxi hóa.',
      'Quan sát hệ thống giải đồng thời số mol e trao đổi, lượng axit phản ứng và khối lượng muối.',
      'Kiểm chứng tổng khối lượng chất tham gia luôn bằng tổng khối lượng sản phẩm (BTKL).',
    ],
    stepsEn: [
      'Left panel: select a redox equation and step through all 4 electron-balancing stages.',
      'Right panel: choose a metal (Cu, Fe, Al, Mg), mass (g), and oxidizing acid.',
      'Track electrons transferred, acid consumed, and anhydrous salt mass.',
      'Verify total reactant mass equals total product mass via Mass Conservation.',
    ],
    tipVi: 'Luôn ghi nhớ ∑nₑ(nhường) = ∑nₑ(nhận) trước khi lập phương trình bảo toàn nguyên tố N hoặc S.',
    tipEn: 'Always equate total electrons lost and gained before applying N or S element conservation.',
  },
};

export const ChemistrySandboxes: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const { perfMode } = useBackgroundTheme();
  const [activeTab, setActiveTab] = useState<'periodic' | 'stoich' | 'titration' | 'vsepr' | 'qualitative' | 'redox'>('periodic');

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

  // 4. VSEPR visualizer state (3D-projected rotating geometry + perfMode glow)
  const [vseprId, setVseprId] = useState<string>('ch4');
  const activeVsepr = useMemo(
    () => VSEPR_PRESETS.find((v) => v.id === vseprId) || VSEPR_PRESETS[2],
    [vseprId]
  );
  const vseprCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const stoichCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const titrationCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 5. Qualitative Ion, Flame Bench & Reaction Chain Game state
  const [qualMode, setQualMode] = useState<'ion' | 'flame' | 'chain'>('ion');
  const [selectedIon, setSelectedIon] = useState<QualIonId>('Cu^2+');
  const [mysteryMode, setMysteryMode] = useState(false);
  const [mysteryIon, setMysteryIon] = useState<QualIonId>('Al^3+');
  const [mysteryGuess, setMysteryGuess] = useState<QualIonId | ''>('');
  const [activeReagent, setActiveReagent] = useState<QualReagentId>('naoh');
  const [qualLogs, setQualLogs] = useState<{ reagent: string; obs: string; eq: string }[]>([]);
  const [flameId, setFlameId] = useState<string>('Na+');
  const qualCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Chain reaction puzzle state
  const [chainId, setChainId] = useState<string>('iron_chain');
  const [chainAnswers, setChainAnswers] = useState<Record<string, number>>({});
  const activeChain = useMemo(
    () => CHAIN_PUZZLES.find((c) => c.id === chainId) || CHAIN_PUZZLES[0],
    [chainId]
  );
  const chainScore = useMemo(() => {
    let correct = 0;
    activeChain.steps.forEach((st, idx) => {
      if (chainAnswers[`${activeChain.id}-${idx}`] === st.correctIdx) correct++;
    });
    return correct;
  }, [activeChain, chainAnswers]);

  // 6. Redox Balancer & Conservation Laws Solver state
  const [redoxId, setRedoxId] = useState<string>('cu-hno3');
  const [redoxStep, setRedoxStep] = useState<number>(4);
  const activeRedox = useMemo(
    () => REDOX_PRESETS.find((r) => r.id === redoxId) || REDOX_PRESETS[0],
    [redoxId]
  );
  const [consMetal, setConsMetal] = useState<'Cu' | 'Fe' | 'Al' | 'Mg'>('Cu');
  const [consMassG, setConsMassG] = useState<number>(9.6);
  const [consAcid, setConsAcid] = useState<'hno3_no' | 'hno3_no2' | 'h2so4_so2'>('hno3_no');
  const consCalc = useMemo(() => {
    const metalSpec = {
      Cu: { M: 64, val: 2, saltName: 'Cu(NO₃)₂', sulfName: 'CuSO₄' },
      Fe: { M: 56, val: 3, saltName: 'Fe(NO₃)₃', sulfName: 'Fe₂(SO₄)₃' },
      Al: { M: 27, val: 3, saltName: 'Al(NO₃)₃', sulfName: 'Al₂(SO₄)₃' },
      Mg: { M: 24, val: 2, saltName: 'Mg(NO₃)₂', sulfName: 'MgSO₄' }
    }[consMetal];
    const nMetal = consMassG / metalSpec.M;
    const neGive = nMetal * metalSpec.val;
    const acidInfo = {
      hno3_no: { gas: 'NO', ePerGas: 3, anionMass: 62, label: 'HNO₃ loãng → NO↑' },
      hno3_no2: { gas: 'NO₂', ePerGas: 1, anionMass: 62, label: 'HNO₃ đặc → NO₂↑' },
      h2so4_so2: { gas: 'SO₂', ePerGas: 2, anionMass: 48, label: 'H₂SO₄ đặc, t° → SO₂↑' }
    }[consAcid];
    const nGas = neGive / acidInfo.ePerGas;
    const vGasDkc = nGas * 24.79;
    const nAcidUsed = consAcid === 'h2so4_so2' ? neGive / 2 + nGas : neGive + nGas;
    const mSalt = consMassG + acidInfo.anionMass * neGive;
    const nWater = consAcid === 'h2so4_so2' ? nAcidUsed : nAcidUsed / 2;
    const massReactants = consMassG + nAcidUsed * (consAcid === 'h2so4_so2' ? 98 : 63);
    const gasMolarMass = consAcid === 'hno3_no' ? 30 : consAcid === 'hno3_no2' ? 46 : 64;
    const massProducts = mSalt + nGas * gasMolarMass + nWater * 18;
    return {
      metalSpec,
      nMetal,
      neGive,
      acidInfo,
      nGas,
      vGasDkc,
      nAcidUsed,
      mSalt,
      nWater,
      massReactants,
      massProducts
    };
  }, [consMetal, consMassG, consAcid]);

  const effectiveIon = mysteryMode ? mysteryIon : selectedIon;
  const currentQualRx = useMemo(
    () => evaluateQualitativeReaction(effectiveIon, activeReagent),
    [effectiveIon, activeReagent]
  );
  const activeFlame = useMemo(
    () => FLAME_SALTS.find((f) => f.id === flameId) || FLAME_SALTS[1],
    [flameId]
  );

  // VSEPR 3D-projected animated canvas
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

      if (perfMode !== 'smooth') {
        const bgGrad = ctx.createRadialGradient(cx, cy, 12, cx, cy, 175);
        bgGrad.addColorStop(0, perfMode === 'ultra' ? 'rgba(99,102,241,0.22)' : 'rgba(99,102,241,0.12)');
        bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // 3D coordinates for VSEPR directions
      const dirs: [number, number, number][] = [];
      const tot = activeVsepr.bondingPairs + activeVsepr.lonePairs;
      if (tot === 2) {
        dirs.push([-1, 0, 0], [1, 0, 0]);
      } else if (tot === 3) {
        dirs.push([0, -1, 0], [0.866, 0.5, 0], [-0.866, 0.5, 0]);
      } else if (tot === 4) {
        dirs.push([0, -1, 0], [0.943, 0.333, 0], [-0.471, 0.333, 0.816], [-0.471, 0.333, -0.816]);
      } else if (tot === 5) {
        dirs.push([0, -1, 0], [0, 1, 0], [1, 0, 0], [-0.5, 0, 0.866], [-0.5, 0, -0.866]);
      } else {
        dirs.push([0, -1, 0], [0, 1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]);
      }

      const ry = t * 0.72;
      const rx = 0.32 + Math.sin(t * 0.45) * 0.12;
      const proj = dirs.map((d, idx) => {
        const x1 = d[0] * Math.cos(ry) - d[2] * Math.sin(ry);
        const z1 = d[0] * Math.sin(ry) + d[2] * Math.cos(ry);
        const y2 = d[1] * Math.cos(rx) - z1 * Math.sin(rx);
        const z2 = d[1] * Math.sin(rx) + z1 * Math.cos(rx);
        const persp = 1 / (1 - z2 * 0.28);
        return {
          idx,
          sx: cx + x1 * R * persp,
          sy: cy + y2 * R * persp,
          z: z2,
          persp,
          isLone: idx >= activeVsepr.bondingPairs
        };
      });

      const items = [...proj, { idx: -1, sx: cx, sy: cy, z: 0, persp: 1, isLone: false }].sort((a, b) => a.z - b.z);
      items.forEach((it) => {
        if (it.idx === -1) {
          if (perfMode !== 'smooth') {
            ctx.save();
            ctx.shadowColor = '#6366f1';
            ctx.shadowBlur = perfMode === 'ultra' ? 22 : 10;
            ctx.fillStyle = '#6366f1';
            ctx.beginPath();
            ctx.arc(cx, cy, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            ctx.fillStyle = '#6366f1';
            ctx.beginPath();
            ctx.arc(cx, cy, 22, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.strokeStyle = '#c7d2fe';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('A', cx, cy + 5);
          return;
        }

        if (it.isLone) {
          const lx = cx + (it.sx - cx) * 0.62;
          const ly = cy + (it.sy - cy) * 0.62;
          const ang = Math.atan2(ly - cy, lx - cx);
          ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.ellipse(lx, ly, 22 * it.persp, 12 * it.persp, ang, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#fde68a';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('••', lx, ly + 3);
        } else {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4 * it.persp;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(it.sx, it.sy);
          ctx.stroke();

          ctx.fillStyle = '#0ea5e9';
          ctx.beginPath();
          ctx.arc(it.sx, it.sy, 15 * it.persp, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('X', it.sx, it.sy + 4);
        }
      });

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${activeVsepr.formula} · Lai hóa ${activeVsepr.hybrid} · Góc ≈ ${activeVsepr.angle}° · 3D Auto-Orbit`, 14, 24);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [activeTab, activeVsepr, perfMode]);

  // Stoichiometry animated vessel + gas syringe canvas
  useEffect(() => {
    if (activeTab !== 'stoich') return;
    const canvas = stoichCanvasRef.current;
    if (!canvas) return;
    let raf = 0;
    const draw = (now: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const t = now * 0.001;
      ctx.fillStyle = '#090f1e';
      ctx.fillRect(0, 0, w, h);

      if (perfMode !== 'smooth') {
        const g = ctx.createRadialGradient(w * 0.28, h * 0.62, 10, w * 0.28, h * 0.62, 130);
        g.addColorStop(0, perfMode === 'ultra' ? 'rgba(16,185,129,0.24)' : 'rgba(16,185,129,0.12)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // Reaction flask on left
      const fx = w * 0.24;
      const fy = h * 0.56;
      ctx.fillStyle = 'rgba(56,189,248,0.22)';
      ctx.fillRect(fx - 52, fy - 12, 104, 62);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.2;
      ctx.strokeRect(fx - 52, fy - 42, 104, 92);

      // Bubbles or solid deposit
      const intensity = Math.min(1, stoichStats.prodMol * 2.2);
      const count = Math.round(6 + intensity * (perfMode === 'ultra' ? 20 : 12));
      for (let i = 0; i < count; i++) {
        if (activeReaction.productC.isGas) {
          const bx = fx - 38 + ((i * 19) % 76);
          const by = fy + 42 - ((t * (35 + intensity * 45) + i * 14) % 78);
          ctx.fillStyle = 'rgba(226,232,240,0.75)';
          ctx.beginPath();
          ctx.arc(bx, by, 2.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const px = fx - 40 + ((i * 21) % 80);
          const py = fy + 38 + ((i * 7) % 10);
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Gas Syringe on right
      const sx = w * 0.5;
      const sy = h * 0.42;
      const maxLen = w * 0.4;
      const fillFrac = Math.min(1, stoichStats.prodMol / 1.5);
      const pLen = 24 + fillFrac * (maxLen - 34);
      ctx.fillStyle = activeReaction.productC.isGas ? 'rgba(16,185,129,0.28)' : 'rgba(245,158,11,0.22)';
      ctx.fillRect(sx, sy, pLen, 36);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(sx, sy, maxLen, 36);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(sx + pLen, sy - 2, 10, 40);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11.5px monospace';
      ctx.fillText(`Thu ${activeReaction.productC.formula}: ${stoichStats.prodMol.toFixed(3)} mol`, sx, sy - 10);
      if (stoichStats.gasVol > 0) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`V = ${stoichStats.gasVol.toFixed(2)} L (ĐKC)`, sx, sy + 56);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [activeTab, activeReaction, stoichStats, perfMode]);

  // Titration animated flask + dripping burette canvas
  useEffect(() => {
    if (activeTab !== 'titration') return;
    const canvas = titrationCanvasRef.current;
    if (!canvas) return;
    let raf = 0;
    const draw = (now: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const t = now * 0.001;
      ctx.fillStyle = '#090f1e';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const isPink = currentPH >= 8.2;
      const isDeepPink = currentPH >= 10;

      if (perfMode !== 'smooth') {
        const glow = ctx.createRadialGradient(cx, h * 0.68, 8, cx, h * 0.68, 95);
        glow.addColorStop(0, isPink ? 'rgba(236,72,153,0.34)' : 'rgba(56,189,248,0.18)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }

      // Burette tip & falling drop
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(cx - 5, 14, 10, 42);
      const dropY = 60 + ((t * 90) % 72);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, dropY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Erlenmeyer flask
      const fy = h * 0.72;
      ctx.beginPath();
      ctx.moveTo(cx - 16, fy - 52);
      ctx.lineTo(cx - 64, fy + 48);
      ctx.lineTo(cx + 64, fy + 48);
      ctx.lineTo(cx + 16, fy - 52);
      ctx.closePath();
      ctx.fillStyle = isDeepPink ? 'rgba(236,72,153,0.72)' : isPink ? 'rgba(244,114,182,0.42)' : 'rgba(226,232,240,0.18)';
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // Spinning magnetic stir bar
      const barW = 10 + Math.abs(Math.cos(t * 7)) * 16;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(cx - barW / 2, fy + 38, barW, 4);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`pH = ${currentPH.toFixed(2)}`, cx, fy + 10);
      ctx.textAlign = 'left';
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [activeTab, currentPH, perfMode]);

  // Qualitative Ion & Flame animated canvas
  useEffect(() => {
    if (activeTab !== 'qualitative') return;
    const canvas = qualCanvasRef.current;
    if (!canvas) return;
    let raf = 0;
    const draw = (now: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const t = now * 0.001;
      ctx.fillStyle = '#090f1e';
      ctx.fillRect(0, 0, w, h);

      if (qualMode === 'flame') {
        const bx = w * 0.26;
        const by = h * 0.78;
        if (perfMode !== 'smooth') {
          const g = ctx.createRadialGradient(bx, by - 55, 6, bx, by - 55, perfMode === 'ultra' ? 120 : 85);
          g.addColorStop(0, `${activeFlame.color}55`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.fillStyle = '#475569';
        ctx.fillRect(bx - 14, by, 28, 48);
        const flick = Math.sin(t * 10) * 5;
        ctx.save();
        if (perfMode === 'ultra') {
          ctx.shadowColor = activeFlame.color;
          ctx.shadowBlur = 24;
        }
        const fg = ctx.createRadialGradient(bx, by - 40, 4, bx, by - 52, 62);
        fg.addColorStop(0, '#ffffff');
        fg.addColorStop(0.35, activeFlame.color);
        fg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.moveTo(bx - 22, by);
        ctx.quadraticCurveTo(bx - 28, by - 64, bx + flick, by - 122);
        ctx.quadraticCurveTo(bx + 28, by - 64, bx + 22, by);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Platinum wire loop in flame
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(bx - 92, by - 30);
        ctx.lineTo(bx - 4, by - 48);
        ctx.stroke();

        // Emission Spectrum Bar
        const sx = w * 0.48;
        const sw = w * 0.46;
        const sy = h * 0.4;
        ctx.fillStyle = '#020617';
        ctx.fillRect(sx, sy, sw, 56);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(sx, sy, sw, 56);
        activeFlame.lines.forEach((nm) => {
          const u = Math.max(0.04, Math.min(0.96, (nm - 380) / 400));
          const lx = sx + u * sw;
          ctx.save();
          if (perfMode !== 'smooth') {
            ctx.shadowColor = activeFlame.color;
            ctx.shadowBlur = 12;
          }
          ctx.fillStyle = activeFlame.color;
          ctx.fillRect(lx - 2, sy + 2, 4, 52);
          ctx.restore();
          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(`${nm}nm`, lx - 16, sy - 8);
        });
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`${activeFlame.name}: ${activeFlame.desc}`, 16, 24);
      } else {
        // Test tube for qualitative ion test
        const cx = w * 0.5;
        const tx = cx - 44;
        const ty = 64;
        if (perfMode !== 'smooth') {
          const glowCol = currentQualRx.pptColor || currentQualRx.gasColor || '#38bdf8';
          const g = ctx.createRadialGradient(cx, ty + 90, 8, cx, ty + 90, 96);
          g.addColorStop(0, `${glowCol}30`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }

        // Dropper
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cx - 5, 16, 10, 26);
        const dropY = 44 + ((t * 85) % 44);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx, dropY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = currentQualRx.solColor;
        ctx.fillRect(tx, ty + 24, 88, 136);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.6;
        ctx.strokeRect(tx, ty, 88, 160);

        if (currentQualRx.pptColor) {
          const pN = perfMode === 'ultra' ? 28 : 16;
          for (let i = 0; i < pN; i++) {
            const px = tx + 10 + ((i * 19) % 68);
            const py = ty + 124 + ((i * 11 + Math.sin(t * 2 + i) * 3) % 30);
            ctx.fillStyle = currentQualRx.pptColor;
            ctx.beginPath();
            ctx.arc(px, py, 3.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        if (currentQualRx.gasColor) {
          for (let i = 0; i < 12; i++) {
            const bx = tx + 16 + ((i * 17) % 56);
            const by = ty + 145 - ((t * 48 + i * 16) % 130);
            ctx.fillStyle = currentQualRx.gasColor;
            ctx.beginPath();
            ctx.arc(bx, by, 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(currentQualRx.result, 16, 24);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '11px monospace';
        ctx.fillText(currentQualRx.equation, 16, h - 14);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [activeTab, qualMode, currentQualRx, activeFlame, perfMode]);

  return (
    <div className="chem-zone-frame sci-frame rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-6 relative overflow-hidden">
      <span className="chem-energy-sweep" aria-hidden="true" />
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600 icon-anim-flask shrink-0" />
            <span>{isEn ? 'Interactive Chemistry Sandbox Workbench (6 Labs)' : 'Sandbox Hóa Học Tương Tác (6 Phòng Thực Hành)'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Periodic Table Z=1..36, Stoichiometry, Burette pH, VSEPR 3D, Ion/Reaction Chain Game, and Step-by-Step Redox & Conservation Solver.'
              : 'Bảng Tuần Hoàn Z=1..36, Mol hết/dư, Buret pH, VSEPR 3D, Trò chơi Nhận biết Ion & Chuỗi Phản ứng, và Cân bằng Oxi hóa–Khử / Bảo toàn.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {(
            [
              { id: 'periodic', label: isEn ? 'Periodic Z=1..36' : 'Bảng Tuần Hoàn', icon: Atom },
              { id: 'stoich', label: isEn ? 'Stoichiometry' : 'Tính Mol Hết/Dư', icon: Scale },
              { id: 'titration', label: isEn ? 'Burette pH' : 'Buret Chuẩn Độ pH', icon: Beaker },
              { id: 'vsepr', label: isEn ? 'VSEPR 3D' : 'Hình học VSEPR', icon: FlaskConical },
              { id: 'qualitative', label: isEn ? 'Ion & Chain Game' : 'Nhận biết & Chuỗi PƯ', icon: Flame },
              { id: 'redox', label: isEn ? 'Redox & Conservation' : 'Cân bằng OXH & Bảo toàn', icon: Calculator }
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                data-ripple="true"
                onClick={() => setActiveTab(tab.id)}
                className={`sim-btn-chem inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-emerald-600 text-white chem-zone-active'
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

      {(() => {
        const g = CHEM_SANDBOX_GUIDES[activeTab];
        return (
          <SandboxIntroGuideBanner
            subject="chem"
            title={isEn ? g.titleEn : g.titleVi}
            intro={isEn ? g.introEn : g.introVi}
            steps={isEn ? g.stepsEn : g.stepsVi}
            tip={isEn ? g.tipEn : g.tipVi}
            isEn={isEn}
          />
        );
      })()}

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
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex flex-wrap items-center gap-3">
                <span>Khối s: IA–IIA</span>
                <span>·</span>
                <span>Khối p: IIIA–VIIIA</span>
                <span>·</span>
                <span>Khối d: Chuyển tiếp Sc → Zn</span>
              </div>
              <button
                type="button"
                data-ripple="true"
                onClick={() =>
                  triggerDownloadText(
                    'bang_tuan_hoan_Z1_36.csv',
                    'Z,Symbol,Name,Mass,Group,Period,Block,Electronegativity,RadiusPm,Config\n' +
                      ELEMENTS_36.map((e) => `${e.z},${e.symbol},${e.name},${e.mass},${e.group},${e.period},${e.block},${e.en},${e.radiusPm},"${e.config}"`).join('\n')
                  )
                }
                className="sim-btn-chem inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <Download className="w-3 h-3 text-emerald-600" />
                <span>Xuất CSV Z=1..36</span>
              </button>
            </div>
            {/* Live Periodic Electronegativity & Atomic Radius Trend SVG */}
            <div className="mt-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 p-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mb-1">
                <span>Biến thiên Độ âm điện (Xanh ngọc) &amp; Bán kính nguyên tử (Vàng) theo Z = 1..36</span>
                <span className="text-emerald-400">Đang chọn: {selectedEl.symbol} (Z={selectedEl.z})</span>
              </div>
              <svg viewBox="0 0 540 96" className="w-full h-24">
                <path
                  d={ELEMENTS_36.map((e, i) => {
                    const x = 14 + (i / 35) * 512;
                    const y = 84 - (e.radiusPm / 250) * 68;
                    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.8"
                />
                <path
                  d={ELEMENTS_36.map((e, i) => {
                    const x = 14 + (i / 35) * 512;
                    const y = 84 - (e.en / 4.0) * 68;
                    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="2"
                />
                <circle
                  cx={14 + ((selectedEl.z - 1) / 35) * 512}
                  cy={84 - (selectedEl.radiusPm / 250) * 68}
                  r="4"
                  fill="#fbbf24"
                />
                <circle
                  cx={14 + ((selectedEl.z - 1) / 35) * 512}
                  cy={84 - (selectedEl.en / 4.0) * 68}
                  r="4"
                  fill="#34d399"
                />
              </svg>
            </div>
          </div>

          <div className="chem-card-frame rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-5 space-y-3.5">
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
            <canvas ref={stoichCanvasRef} width={480} height={155} className="w-full h-36 rounded-lg border border-slate-200 dark:border-slate-700" />
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
                  data-ripple="true"
                  onClick={() => setVBaseMl((v) => Math.min(50, Math.round((v + 0.5) * 10) / 10))}
                  className="sim-btn-chem px-2.5 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-semibold cursor-pointer"
                >
                  +0,5 mL nhỏ giọt
                </button>
                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => setVBaseMl(Math.min(50, Math.round(eqVolMl * 10) / 10))}
                  className="sim-btn-chem px-2.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
                >
                  Nhảy tới điểm tương đương ({eqVolMl.toFixed(1)} mL)
                </button>
                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => setVBaseMl(0)}
                  className="sim-btn-chem px-2.5 py-1.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>0 mL</span>
                </button>
                <button
                  type="button"
                  data-ripple="true"
                  onClick={() =>
                    triggerDownloadText(
                      `duong_cong_chuan_do_${acidType}.csv`,
                      'V_NaOH_mL,pH\n' + titrationCurvePoints.map((pt) => `${pt.v.toFixed(1)},${pt.ph.toFixed(3)}`).join('\n')
                    )
                  }
                  className="sim-btn-chem px-2.5 py-1.5 rounded-md bg-slate-800 text-white font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Xuất CSV pH</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-3 flex flex-col items-center justify-between gap-2">
              <div className="text-xs font-bold text-slate-300">Bình nón Phenolphthalein khuấy từ</div>
              <canvas ref={titrationCanvasRef} width={220} height={180} className="w-full h-40 rounded-lg" />
              <div className="text-[11px] text-center font-semibold text-slate-300">
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

      {/* TAB 5: QUALITATIVE ION BENCH, FLAME SPECTROSCOPY & REACTION CHAIN GAME */}
      {activeTab === 'qualitative' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setQualMode('ion')}
                className={`py-1.5 px-3 rounded-md font-bold cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                  qualMode === 'ion' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Nhận biết Ion &amp; Lọ mất nhãn</span>
              </button>
              <button
                type="button"
                onClick={() => setQualMode('flame')}
                className={`py-1.5 px-3 rounded-md font-bold cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                  qualMode === 'flame' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Thử Ngọn lửa</span>
              </button>
              <button
                type="button"
                onClick={() => setQualMode('chain')}
                className={`py-1.5 px-3 rounded-md font-bold cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                  qualMode === 'chain' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Trò chơi Chuỗi Phản Ứng</span>
              </button>
            </div>
          </div>

          {qualMode === 'chain' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
              <div className="lg:col-span-4 space-y-3">
                <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                  <span>Chọn sơ đồ chuyển hóa:</span>
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono">
                    <Trophy className="w-3.5 h-3.5" />
                    {chainScore}/{activeChain.steps.length} mắt xích
                  </span>
                </div>
                <div className="space-y-2">
                  {CHAIN_PUZZLES.map((puz) => (
                    <button
                      key={puz.id}
                      type="button"
                      onClick={() => setChainId(puz.id)}
                      className={`w-full text-left p-3 rounded-xl border cursor-pointer transition-colors ${
                        puz.id === activeChain.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-bold">{puz.title}</div>
                      <div className={`text-[11px] mt-0.5 ${puz.id === activeChain.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {puz.category}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setChainAnswers({})}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại tất cả chuỗi</span>
                </button>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 flex flex-wrap items-center justify-center gap-2">
                  {activeChain.nodes.map((node, i) => {
                    const stepDone = i > 0 && chainAnswers[`${activeChain.id}-${i - 1}`] === activeChain.steps[i - 1].correctIdx;
                    return (
                      <React.Fragment key={node}>
                        <div
                          className={`px-3.5 py-2 rounded-lg border font-mono font-bold text-sm ${
                            i === 0 || stepDone
                              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                              : 'bg-slate-900 border-slate-700 text-slate-200'
                          }`}
                        >
                          {node}
                        </div>
                        {i < activeChain.steps.length && (
                          <div className="flex flex-col items-center px-1">
                            <span className="text-[10px] font-mono text-amber-400">({i + 1})</span>
                            <ArrowRight className={`w-4 h-4 ${chainAnswers[`${activeChain.id}-${i}`] === activeChain.steps[i].correctIdx ? 'text-emerald-400' : 'text-slate-500'}`} />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  {activeChain.steps.map((st, idx) => {
                    const key = `${activeChain.id}-${idx}`;
                    const picked = chainAnswers[key];
                    const isRight = picked === st.correctIdx;
                    return (
                      <div
                        key={key}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3.5 space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                            Mắt xích ({idx + 1}): {st.prompt}
                          </span>
                          {picked !== undefined && (
                            <span
                              className={`inline-flex items-center gap-1 font-bold ${
                                isRight ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {isRight ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                              <span>{isRight ? 'Chính xác!' : 'Chưa đúng điều kiện/thuốc thử'}</span>
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {st.options.map((opt, oi) => {
                            const selected = picked === oi;
                            const cls = selected
                              ? oi === st.correctIdx
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-500';
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setChainAnswers((prev) => ({ ...prev, [key]: oi }))}
                                className={`px-2.5 py-2 rounded-lg border font-semibold text-left cursor-pointer transition-colors ${cls}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {isRight && (
                          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-3 py-2 font-mono text-[11px] text-emerald-800 dark:text-emerald-200">
                            PTHH: {st.equation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="space-y-4">
                {qualMode === 'ion' ? (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {mysteryMode ? 'Chế độ Lọ Mất Nhãn (Đoán Ion!)' : 'Chọn Ion cần nhận biết:'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !mysteryMode;
                          setMysteryMode(next);
                          setMysteryGuess('');
                          setQualLogs([]);
                          if (next) {
                            const rnd = QUAL_IONS[Math.floor(Math.random() * QUAL_IONS.length)].id;
                            setMysteryIon(rnd);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-md font-bold cursor-pointer border ${
                          mysteryMode
                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {mysteryMode ? 'Thoát Lọ Mất Nhãn' : 'Thử thách Lọ Mất Nhãn'}
                      </button>
                    </div>

                    {!mysteryMode && (
                      <div className="grid grid-cols-3 gap-1.5">
                        {QUAL_IONS.map((ion) => (
                          <button
                            key={ion.id}
                            type="button"
                            onClick={() => setSelectedIon(ion.id)}
                            className={`py-1.5 px-2 rounded-md border font-mono font-bold cursor-pointer ${
                              selectedIon === ion.id
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {ion.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-700 dark:text-slate-200 block">Nhỏ thuốc thử vào ống nghiệm:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(
                          [
                            { id: 'agno3', label: 'AgNO₃' },
                            { id: 'bacl2', label: 'BaCl₂' },
                            { id: 'naoh', label: 'NaOH loãng' },
                            { id: 'naoh_ex', label: 'NaOH dư' },
                            { id: 'nh3_ex', label: 'NH₃ dư' },
                            { id: 'litmus_heat', label: 'Kiềm + Quỳ (t°)' }
                          ] as const
                        ).map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                              setActiveReagent(r.id);
                              const rx = evaluateQualitativeReaction(effectiveIon, r.id);
                              setQualLogs((prev) => [{ reagent: r.label, obs: rx.result, eq: rx.equation }, ...prev].slice(0, 5));
                            }}
                            className={`py-1.5 px-2.5 rounded-md border text-left font-semibold cursor-pointer ${
                              activeReagent === r.id
                                ? 'bg-sky-600 text-white border-sky-600'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            + {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {mysteryMode && (
                      <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 space-y-2 bg-slate-50 dark:bg-slate-800/60">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold">Kết luận lọ mất nhãn chứa ion nào?</span>
                          <button
                            type="button"
                            onClick={() => {
                              const rnd = QUAL_IONS[Math.floor(Math.random() * QUAL_IONS.length)].id;
                              setMysteryIon(rnd);
                              setMysteryGuess('');
                              setQualLogs([]);
                            }}
                            className="text-[11px] font-semibold text-sky-600 hover:underline cursor-pointer"
                          >
                            Đổi lọ mới
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {QUAL_IONS.map((ion) => (
                            <button
                              key={ion.id}
                              type="button"
                              onClick={() => setMysteryGuess(ion.id)}
                              className={`py-1 rounded font-mono font-bold cursor-pointer border ${
                                mysteryGuess === ion.id
                                  ? ion.id === mysteryIon
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-rose-600 text-white border-rose-600'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {ion.label}
                            </button>
                          ))}
                        </div>
                        {mysteryGuess && (
                          <div className={`font-bold ${mysteryGuess === mysteryIon ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {mysteryGuess === mysteryIon ? 'Chính xác hoàn toàn!' : 'Chưa đúng, thử thêm thuốc thử khác nhé!'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-slate-700 dark:text-slate-200">Chọn muối Kim loại đốt trên dây Platin:</div>
                    {FLAME_SALTS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFlameId(f.id)}
                        className={`w-full text-left p-2.5 rounded-lg border cursor-pointer flex items-center justify-between ${
                          flameId === f.id
                            ? 'bg-slate-900 text-white border-amber-500'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span className="font-bold">{f.name}</span>
                        <span className="font-mono text-[11px]">{f.lines[0]} nm</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 space-y-3">
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-3">
                  <canvas ref={qualCanvasRef} width={640} height={290} className="w-full h-72 rounded-lg" />
                </div>
                {qualMode === 'ion' && qualLogs.length > 0 && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-700 dark:text-slate-200">Nhật kí nhỏ giọt thuốc thử gần nhất</div>
                    {qualLogs.map((l, i) => (
                      <div key={i} className="flex flex-wrap justify-between gap-2 border-t border-slate-200 dark:border-slate-700 pt-1.5">
                        <span className="font-bold text-sky-600 dark:text-sky-400">+{l.reagent}</span>
                        <span className="text-slate-700 dark:text-slate-200">{l.obs}</span>
                        <span className="font-mono text-[11px] text-slate-500">{l.eq}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: STEP-BY-STEP REDOX BALANCER & CONSERVATION LAWS SOLVER */}
      {activeTab === 'redox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
          {/* Left: 4-step Redox Balancer */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Cân Bằng Oxi Hóa – Khử 4 Bước (Thăng Bằng Electron)</span>
              </div>
              <button
                type="button"
                onClick={() => setRedoxStep((s) => (s >= 4 ? 1 : s + 1))}
                className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
              >
                {redoxStep >= 4 ? 'Xem từng bước (1/4)' : `Bước tiếp (${redoxStep + 1}/4)`}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {REDOX_PRESETS.map((rx) => (
                <button
                  key={rx.id}
                  type="button"
                  onClick={() => {
                    setRedoxId(rx.id);
                    setRedoxStep(4);
                  }}
                  className={`p-2 rounded-lg border text-left font-semibold cursor-pointer transition-colors ${
                    rx.id === activeRedox.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {rx.label}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
              <div className="font-mono font-bold text-slate-800 dark:text-slate-100">
                Sơ đồ chưa cân bằng: <span className="text-sky-600 dark:text-sky-400">{activeRedox.unbalanced}</span>
              </div>

              <div className="space-y-2">
                <div className={`rounded-lg border p-3 ${redoxStep >= 1 ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700' : 'opacity-40 bg-slate-100 dark:bg-slate-900/40 border-dashed border-slate-300'}`}>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">Bước 1 · Xác định số oxi hóa thay đổi</div>
                  {redoxStep >= 1 && <div className="font-mono mt-1 text-slate-800 dark:text-slate-100">{activeRedox.oxStates}</div>}
                </div>

                <div className={`rounded-lg border p-3 ${redoxStep >= 2 ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700' : 'opacity-40 bg-slate-100 dark:bg-slate-900/40 border-dashed border-slate-300'}`}>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">Bước 2 · Viết quá trình Oxi hóa (nhường e) &amp; Khử (nhận e)</div>
                  {redoxStep >= 2 && (
                    <div className="font-mono mt-1 space-y-0.5 text-slate-800 dark:text-slate-100">
                      <div>• Quá trình oxi hóa: <span className="text-amber-600 dark:text-amber-400">{activeRedox.halfOxidation}</span></div>
                      <div>• Quá trình khử: <span className="text-sky-600 dark:text-sky-400">{activeRedox.halfReduction}</span></div>
                    </div>
                  )}
                </div>

                <div className={`rounded-lg border p-3 ${redoxStep >= 3 ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700' : 'opacity-40 bg-slate-100 dark:bg-slate-900/40 border-dashed border-slate-300'}`}>
                  <div className="font-bold text-amber-600 dark:text-amber-400">Bước 3 · Nhân hệ số thăng bằng (∑e nhường = ∑e nhận)</div>
                  {redoxStep >= 3 && <div className="font-mono mt-1 text-slate-800 dark:text-slate-100">{activeRedox.multipliers}</div>}
                </div>

                <div className={`rounded-lg border p-3 ${redoxStep >= 4 ? 'bg-emerald-50 dark:bg-emerald-950/35 border-emerald-300 dark:border-emerald-700' : 'opacity-40 bg-slate-100 dark:bg-slate-900/40 border-dashed border-slate-300'}`}>
                  <div className="font-bold text-emerald-700 dark:text-emerald-300 mb-1.5">Bước 4 · Phương trình hóa học hoàn chỉnh</div>
                  {redoxStep >= 4 && (
                    <div className="space-y-1.5">
                      <MathFormula formula={activeRedox.balancedLatex} />
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">{activeRedox.note}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: 3-Conservation Laws Step-by-Step Solver */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-4">
            <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-sky-600" />
              <span>Giải Toán Tư Duy 3 Định Luật Bảo Toàn</span>
            </div>

            <div className="space-y-2.5">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">1. Chọn Kim loại phản ứng hoàn toàn:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Cu', 'Fe', 'Al', 'Mg'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setConsMetal(m)}
                      className={`py-1.5 rounded-md border font-mono font-bold cursor-pointer ${
                        consMetal === m ? 'bg-sky-600 text-white border-sky-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Khối lượng kim loại m({consMetal})</span>
                  <span className="font-mono tabular-nums text-sky-600 dark:text-sky-400">
                    {consMassG.toFixed(1)} g ({consCalc.nMetal.toFixed(3)} mol)
                  </span>
                </div>
                <input
                  type="range"
                  min={1.2}
                  max={24}
                  step={0.4}
                  value={consMassG}
                  onChange={(e) => setConsMassG(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </label>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">2. Chọn Axit oxi hóa &amp; sản phẩm khử:</span>
                <div className="grid grid-cols-1 gap-1.5">
                  {(
                    [
                      { id: 'hno3_no', label: 'HNO₃ loãng → NO↑ (nhận 3e)' },
                      { id: 'hno3_no2', label: 'HNO₃ đặc → NO₂↑ (nhận 1e)' },
                      { id: 'h2so4_so2', label: 'H₂SO₄ đặc, t° → SO₂↑ (nhận 2e)' }
                    ] as const
                  ).map((ax) => (
                    <button
                      key={ax.id}
                      type="button"
                      onClick={() => setConsAcid(ax.id)}
                      className={`px-3 py-1.5 rounded-md border text-left font-semibold cursor-pointer ${
                        consAcid === ax.id
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {ax.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 font-mono tabular-nums border-t border-slate-200 dark:border-slate-700 pt-3">
              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5">
                <div className="font-sans font-bold text-sky-600 dark:text-sky-400">① Bảo toàn Electron (∑nₑ nhường = ∑nₑ nhận)</div>
                <div className="mt-1">
                  nₑ = {consCalc.metalSpec.val}×n({consMetal}) = <strong>{consCalc.neGive.toFixed(3)} mol</strong>
                </div>
                <div>
                  ⇒ n({consCalc.acidInfo.gas}) = nₑ / {consCalc.acidInfo.ePerGas} = <strong>{consCalc.nGas.toFixed(3)} mol</strong> ({consCalc.vGasDkc.toFixed(2)} L ĐKC)
                </div>
              </div>

              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5">
                <div className="font-sans font-bold text-amber-600 dark:text-amber-400">
                  ② Bảo toàn Nguyên tố ({consAcid === 'h2so4_so2' ? 'S' : 'N'})
                </div>
                <div className="mt-1">
                  n(Axit pư) = n(gốc trong muối) + n({consCalc.acidInfo.gas}) = <strong>{consCalc.nAcidUsed.toFixed(3)} mol</strong>
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-300 dark:border-emerald-700 p-2.5">
                <div className="font-sans font-bold text-emerald-700 dark:text-emerald-300">③ Bảo toàn Khối lượng (BTKL)</div>
                <div className="mt-1">
                  m(muối khan) = m(KL) + m(gốc axit) = <strong>{consCalc.mSalt.toFixed(2)} g</strong>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  Kiểm chứng: ∑m(trước) = {consCalc.massReactants.toFixed(2)} g = ∑m(sau) = {consCalc.massProducts.toFixed(2)} g
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
