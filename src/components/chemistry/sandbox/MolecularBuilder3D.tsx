import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  AlertTriangle,
  Atom,
  CheckCircle2,
  Eraser,
  Link2,
  Plus,
  RotateCcw,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { detectSoftwareGl, scheduleSyncedGlFrame } from '../../future/Pre3DViewportBar';

type ElementSym = 'C' | 'H' | 'O' | 'N' | 'Cl' | 'F' | 'Br' | 'S' | 'P';
type BuilderMode = 'attach' | 'connect' | 'erase';

interface ElementSpec {
  sym: ElementSym;
  nameVi: string;
  nameEn: string;
  valence: number;
  allowedValences?: number[];
  mass: number;
  radius: number;
  color: string;
  textDark?: boolean;
}

const ELEMENTS: Record<ElementSym, ElementSpec> = {
  C: { sym: 'C', nameVi: 'Cacbon', nameEn: 'Carbon', valence: 4, mass: 12.011, radius: 0.38, color: '#334155' },
  H: { sym: 'H', nameVi: 'Hiđro', nameEn: 'Hydrogen', valence: 1, mass: 1.008, radius: 0.24, color: '#f8fafc', textDark: true },
  O: { sym: 'O', nameVi: 'Oxi', nameEn: 'Oxygen', valence: 2, mass: 15.999, radius: 0.34, color: '#ef4444' },
  N: { sym: 'N', nameVi: 'Nitơ', nameEn: 'Nitrogen', valence: 3, mass: 14.007, radius: 0.35, color: '#3b82f6' },
  Cl: { sym: 'Cl', nameVi: 'Clo', nameEn: 'Chlorine', valence: 1, mass: 35.45, radius: 0.4, color: '#22c55e', textDark: true },
  F: { sym: 'F', nameVi: 'Flo', nameEn: 'Fluorine', valence: 1, mass: 18.998, radius: 0.31, color: '#84cc16', textDark: true },
  Br: { sym: 'Br', nameVi: 'Brom', nameEn: 'Bromine', valence: 1, mass: 79.904, radius: 0.44, color: '#991b1b' },
  S: { sym: 'S', nameVi: 'Lưu huỳnh', nameEn: 'Sulfur', valence: 2, allowedValences: [2, 4, 6], mass: 32.06, radius: 0.41, color: '#eab308', textDark: true },
  P: { sym: 'P', nameVi: 'Photpho', nameEn: 'Phosphorus', valence: 3, allowedValences: [3, 5], mass: 30.974, radius: 0.4, color: '#f97316' },
};

const ELEMENT_ORDER: ElementSym[] = ['C', 'H', 'O', 'N', 'Cl', 'F', 'Br', 'S', 'P'];

interface BuilderAtom {
  id: number;
  element: ElementSym;
  x: number;
  y: number;
  z: number;
}

interface BuilderBond {
  id: number;
  a: number;
  b: number;
  order: 1 | 2 | 3;
}

interface MoleculePreset {
  id: string;
  label: string;
  formula: string;
  atoms: BuilderAtom[];
  bonds: BuilderBond[];
}

const PRESETS: MoleculePreset[] = [
  {
    id: 'ch4',
    label: 'Metan (CH₄)',
    formula: 'CH₄',
    atoms: [
      { id: 1, element: 'C', x: 0, y: 0, z: 0 },
      { id: 2, element: 'H', x: 0, y: 1.35, z: 0 },
      { id: 3, element: 'H', x: 1.27, y: -0.45, z: 0 },
      { id: 4, element: 'H', x: -0.64, y: -0.45, z: 1.1 },
      { id: 5, element: 'H', x: -0.64, y: -0.45, z: -1.1 },
    ],
    bonds: [
      { id: 1, a: 1, b: 2, order: 1 },
      { id: 2, a: 1, b: 3, order: 1 },
      { id: 3, a: 1, b: 4, order: 1 },
      { id: 4, a: 1, b: 5, order: 1 },
    ],
  },
  {
    id: 'c2h4',
    label: 'Etilen (C₂H₄)',
    formula: 'C₂H₄',
    atoms: [
      { id: 1, element: 'C', x: -0.78, y: 0, z: 0 },
      { id: 2, element: 'C', x: 0.78, y: 0, z: 0 },
      { id: 3, element: 'H', x: -1.42, y: 1.08, z: 0 },
      { id: 4, element: 'H', x: -1.42, y: -1.08, z: 0 },
      { id: 5, element: 'H', x: 1.42, y: 1.08, z: 0 },
      { id: 6, element: 'H', x: 1.42, y: -1.08, z: 0 },
    ],
    bonds: [
      { id: 1, a: 1, b: 2, order: 2 },
      { id: 2, a: 1, b: 3, order: 1 },
      { id: 3, a: 1, b: 4, order: 1 },
      { id: 4, a: 2, b: 5, order: 1 },
      { id: 5, a: 2, b: 6, order: 1 },
    ],
  },
  {
    id: 'c2h2',
    label: 'Axetilen (C₂H₂)',
    formula: 'C₂H₂',
    atoms: [
      { id: 1, element: 'C', x: -0.72, y: 0, z: 0 },
      { id: 2, element: 'C', x: 0.72, y: 0, z: 0 },
      { id: 3, element: 'H', x: -1.96, y: 0, z: 0 },
      { id: 4, element: 'H', x: 1.96, y: 0, z: 0 },
    ],
    bonds: [
      { id: 1, a: 1, b: 2, order: 3 },
      { id: 2, a: 1, b: 3, order: 1 },
      { id: 3, a: 2, b: 4, order: 1 },
    ],
  },
  {
    id: 'c2h5oh',
    label: 'Etanol (C₂H₅OH)',
    formula: 'C₂H₆O',
    atoms: [
      { id: 1, element: 'C', x: -1.1, y: 0.2, z: 0 },
      { id: 2, element: 'C', x: 0.4, y: -0.25, z: 0 },
      { id: 3, element: 'O', x: 1.45, y: 0.75, z: 0 },
      { id: 4, element: 'H', x: 2.38, y: 0.35, z: 0 },
      { id: 5, element: 'H', x: -1.45, y: 1.24, z: 0 },
      { id: 6, element: 'H', x: -1.55, y: -0.28, z: 0.94 },
      { id: 7, element: 'H', x: -1.55, y: -0.28, z: -0.94 },
      { id: 8, element: 'H', x: 0.6, y: -0.9, z: 0.92 },
      { id: 9, element: 'H', x: 0.6, y: -0.9, z: -0.92 },
    ],
    bonds: [
      { id: 1, a: 1, b: 2, order: 1 },
      { id: 2, a: 2, b: 3, order: 1 },
      { id: 3, a: 3, b: 4, order: 1 },
      { id: 4, a: 1, b: 5, order: 1 },
      { id: 5, a: 1, b: 6, order: 1 },
      { id: 6, a: 1, b: 7, order: 1 },
      { id: 7, a: 2, b: 8, order: 1 },
      { id: 8, a: 2, b: 9, order: 1 },
    ],
  },
  {
    id: 'ch3cooh',
    label: 'Axit axetic (CH₃COOH)',
    formula: 'C₂H₄O₂',
    atoms: [
      { id: 1, element: 'C', x: -1.35, y: 0, z: 0 },
      { id: 2, element: 'C', x: 0.25, y: 0, z: 0 },
      { id: 3, element: 'O', x: 1.0, y: 1.28, z: 0 },
      { id: 4, element: 'O', x: 1.0, y: -1.25, z: 0 },
      { id: 5, element: 'H', x: 2.05, y: -1.15, z: 0 },
      { id: 6, element: 'H', x: -1.78, y: 1.05, z: 0 },
      { id: 7, element: 'H', x: -1.78, y: -0.52, z: 0.92 },
      { id: 8, element: 'H', x: -1.78, y: -0.52, z: -0.92 },
    ],
    bonds: [
      { id: 1, a: 1, b: 2, order: 1 },
      { id: 2, a: 2, b: 3, order: 2 },
      { id: 3, a: 2, b: 4, order: 1 },
      { id: 4, a: 4, b: 5, order: 1 },
      { id: 5, a: 1, b: 6, order: 1 },
      { id: 6, a: 1, b: 7, order: 1 },
      { id: 7, a: 1, b: 8, order: 1 },
    ],
  },
  {
    id: 'h2o',
    label: 'Nước (H₂O)',
    formula: 'H₂O',
    atoms: [
      { id: 1, element: 'O', x: 0, y: 0.25, z: 0 },
      { id: 2, element: 'H', x: -0.98, y: -0.52, z: 0 },
      { id: 3, element: 'H', x: 0.98, y: -0.52, z: 0 },
    ],
    bonds: [
      { id: 1, a: 1, b: 2, order: 1 },
      { id: 2, a: 1, b: 3, order: 1 },
    ],
  },
  {
    id: 'nh3',
    label: 'Amoniac (NH₃)',
    formula: 'NH₃',
    atoms: [
      { id: 1, element: 'N', x: 0, y: 0.35, z: 0 },
      { id: 2, element: 'H', x: 1.06, y: -0.25, z: 0 },
      { id: 3, element: 'H', x: -0.53, y: -0.25, z: 0.92 },
      { id: 4, element: 'H', x: -0.53, y: -0.25, z: -0.92 },
    ],
    bonds: [
      { id: 1, a: 1, b: 2, order: 1 },
      { id: 2, a: 1, b: 3, order: 1 },
      { id: 3, a: 1, b: 4, order: 1 },
    ],
  },
  {
    id: 'co2',
    label: 'CO₂',
    formula: 'CO₂',
    atoms: [
      { id: 1, element: 'C', x: 0, y: 0, z: 0 },
      { id: 2, element: 'O', x: -1.42, y: 0, z: 0 },
      { id: 3, element: 'O', x: 1.42, y: 0, z: 0 },
    ],
    bonds: [
      { id: 1, a: 1, b: 2, order: 2 },
      { id: 2, a: 1, b: 3, order: 2 },
    ],
  },
  {
    id: 'hcn',
    label: 'Axit xianhiđric (HCN)',
    formula: 'HCN',
    atoms: [
      { id: 1, element: 'C', x: 0, y: 0, z: 0 },
      { id: 2, element: 'H', x: -1.25, y: 0, z: 0 },
      { id: 3, element: 'N', x: 1.38, y: 0, z: 0 },
    ],
    bonds: [
      { id: 1, a: 1, b: 2, order: 1 },
      { id: 2, a: 1, b: 3, order: 3 },
    ],
  },
];

const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
};

function toSubscript(num: number): string {
  if (num <= 1) return '';
  return String(num)
    .split('')
    .map((d) => SUBSCRIPT_MAP[d] || d)
    .join('');
}

function getMaxValence(el: ElementSym): number {
  const spec = ELEMENTS[el];
  if (!spec.allowedValences || spec.allowedValences.length === 0) return spec.valence;
  return Math.max(...spec.allowedValences);
}

function getUsedValence(atomId: number, bondList: BuilderBond[]): number {
  return bondList
    .filter((b) => b.a === atomId || b.b === atomId)
    .reduce((sum, b) => sum + b.order, 0);
}

function getNextVseprPosition(
  anchor: BuilderAtom,
  existingNeighbors: THREE.Vector3[],
  bondLength = 1.42,
  allAtoms: BuilderAtom[] = []
): THREE.Vector3 {
  const origin = new THREE.Vector3(anchor.x, anchor.y, anchor.z);
  const avoidPoints = allAtoms
    .filter((a) => a.id !== anchor.id)
    .map((a) => new THREE.Vector3(a.x, a.y, a.z));

  const minDistScore = (pt: THREE.Vector3): number => {
    if (avoidPoints.length === 0 && existingNeighbors.length === 0) return 999;
    let minD = 999;
    for (const p of existingNeighbors) minD = Math.min(minD, pt.distanceTo(p));
    for (const p of avoidPoints) minD = Math.min(minD, pt.distanceTo(p));
    return minD;
  };

  if (existingNeighbors.length === 0) {
    return origin.clone().add(new THREE.Vector3(bondLength, 0.2, 0));
  }

  const dirs = existingNeighbors.map((n) => n.clone().sub(origin).normalize());

  if (dirs.length === 1) {
    const d0 = dirs[0];
    const perp = Math.abs(d0.y) < 0.85 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    const tangent = new THREE.Vector3().crossVectors(d0, perp).normalize();
    const bitangent = new THREE.Vector3().crossVectors(d0, tangent).normalize();
    const angle = anchor.element === 'O' ? 104.5 : anchor.element === 'N' ? 107 : 109.5;
    const rad = (angle * Math.PI) / 180;

    let bestPt = origin.clone().add(new THREE.Vector3(bondLength, 0, 0));
    let bestScore = -1;
    for (let k = 0; k < 8; k++) {
      const phi = (k / 8) * Math.PI * 2;
      const radial = tangent
        .clone()
        .multiplyScalar(Math.cos(phi))
        .add(bitangent.clone().multiplyScalar(Math.sin(phi)));
      const dir = d0
        .clone()
        .multiplyScalar(Math.cos(rad))
        .add(radial.multiplyScalar(Math.sin(rad)))
        .normalize();
      const cand = origin.clone().add(dir.multiplyScalar(bondLength));
      const sc = minDistScore(cand);
      if (sc > bestScore) {
        bestScore = sc;
        bestPt = cand;
      }
    }
    return bestPt;
  }

  if (dirs.length === 2) {
    const bisector = dirs[0].clone().add(dirs[1]);
    if (bisector.lengthSq() < 1e-4) {
      const perp = Math.abs(dirs[0].y) < 0.85 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      const ortho = new THREE.Vector3().crossVectors(dirs[0], perp).normalize();
      return origin.clone().add(ortho.multiplyScalar(bondLength));
    }
    const opposite = bisector.normalize().negate();
    const planeNormal = new THREE.Vector3().crossVectors(dirs[0], dirs[1]);
    if (planeNormal.lengthSq() < 1e-4) {
      return origin.clone().add(opposite.multiplyScalar(bondLength));
    }
    planeNormal.normalize();
    const tilt = anchor.element === 'C' || anchor.element === 'N' || anchor.element === 'P' ? 0.82 : 0;
    const candA = origin
      .clone()
      .add(opposite.clone().add(planeNormal.clone().multiplyScalar(tilt)).normalize().multiplyScalar(bondLength));
    const candB = origin
      .clone()
      .add(opposite.clone().add(planeNormal.clone().multiplyScalar(-tilt)).normalize().multiplyScalar(bondLength));
    return minDistScore(candA) >= minDistScore(candB) ? candA : candB;
  }

  if (dirs.length === 3) {
    const sum = new THREE.Vector3();
    dirs.forEach((d) => sum.add(d));
    if (sum.lengthSq() > 1e-3) {
      const bestDir = sum.normalize().negate();
      const cand = origin.clone().add(bestDir.multiplyScalar(bondLength));
      if (minDistScore(cand) > 0.75) return cand;
    }
  }

  // Fallback / 4+ vectors: Fibonacci sphere search to maximize separation and avoid overlap
  let bestPt = origin.clone().add(new THREE.Vector3(0, bondLength, 0));
  let bestScore = -1;
  const samples = 42;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const dir = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r);
    const cand = origin.clone().add(dir.multiplyScalar(bondLength));
    const sc = minDistScore(cand);
    if (sc > bestScore) {
      bestScore = sc;
      bestPt = cand;
    }
  }
  return bestPt;
}

function analyzeMolecule(atoms: BuilderAtom[], bonds: BuilderBond[], isEn: boolean) {
  const counts: Partial<Record<ElementSym, number>> = {};
  atoms.forEach((a) => {
    counts[a.element] = (counts[a.element] || 0) + 1;
  });

  // Molecular Formula (Hill system if C is present, else standard order)
  let formula = '';
  if (counts.C) {
    formula += `C${toSubscript(counts.C)}`;
    if (counts.H) formula += `H${toSubscript(counts.H)}`;
    (['Br', 'Cl', 'F', 'N', 'O', 'P', 'S'] as ElementSym[]).forEach((el) => {
      if (counts[el]) formula += `${el}${toSubscript(counts[el]!)}`;
    });
  } else {
    (['H', 'N', 'P', 'C', 'S', 'O', 'F', 'Cl', 'Br'] as ElementSym[]).forEach((el) => {
      if (counts[el]) formula += `${el}${toSubscript(counts[el]!)}`;
    });
  }

  // Molar Mass
  const molarMass = atoms.reduce((acc, a) => acc + ELEMENTS[a.element].mass, 0);

  // Bond order map & valence audit
  const bondMap = new Map<number, { neighbor: BuilderAtom; order: 1 | 2 | 3 }[]>();
  atoms.forEach((a) => bondMap.set(a.id, []));
  bonds.forEach((b) => {
    const atomA = atoms.find((x) => x.id === b.a);
    const atomB = atoms.find((x) => x.id === b.b);
    if (atomA && atomB) {
      bondMap.get(atomA.id)?.push({ neighbor: atomB, order: b.order });
      bondMap.get(atomB.id)?.push({ neighbor: atomA, order: b.order });
    }
  });

  const valenceIssues: string[] = [];
  let maxBondOrder = 1;
  let hasDouble = false;
  let hasTriple = false;
  bonds.forEach((b) => {
    if (b.order > maxBondOrder) maxBondOrder = b.order;
    if (b.order === 2) hasDouble = true;
    if (b.order === 3) hasTriple = true;
  });

  atoms.forEach((a) => {
    const used = (bondMap.get(a.id) || []).reduce((s, item) => s + item.order, 0);
    const spec = ELEMENTS[a.element];
    const allowed = spec.allowedValences || [spec.valence];
    if (!allowed.includes(used)) {
      valenceIssues.push(`${a.element}#${a.id} (${used}/${spec.valence})`);
    }
  });

  const isBalanced = atoms.length > 0 && valenceIssues.length === 0;

  // Condensed structural representation for heavy atoms
  const heavyAtoms = atoms.filter((a) => a.element !== 'H');
  let condensed = formula;
  if (heavyAtoms.length > 0 && heavyAtoms.length <= 8) {
    const groups = heavyAtoms.map((hAtom) => {
      const neighbors = bondMap.get(hAtom.id) || [];
      const hCount = neighbors.filter((n) => n.neighbor.element === 'H').length;
      return `${hAtom.element}${hCount > 0 ? (hCount === 1 ? 'H' : `H${toSubscript(hCount)}`) : ''}`;
    });
    if (heavyAtoms.length === 1) {
      condensed = groups[0];
    } else {
      const sep = hasTriple ? '≡' : hasDouble ? '=' : '–';
      condensed = groups.join(sep === '–' ? '–' : ' · ');
      if (heavyAtoms.length === 2) {
        const bBetween = bonds.find(
          (b) =>
            (b.a === heavyAtoms[0].id && b.b === heavyAtoms[1].id) ||
            (b.b === heavyAtoms[0].id && b.a === heavyAtoms[1].id)
        );
        const link = bBetween?.order === 3 ? '≡' : bBetween?.order === 2 ? '=' : '–';
        condensed = `${groups[0]}${link}${groups[1]}`;
      }
    }
  }

  // Geometry & hybridization estimation
  let angleLabel = '109.5° (sp³)';
  if (atoms.length <= 2) {
    angleLabel = '180° (Thẳng)';
  } else if (hasTriple || formula === 'CO₂' || formula === 'HCN') {
    angleLabel = '180° (Lai hóa sp)';
  } else if (hasDouble) {
    angleLabel = '120° (Lai hóa sp²)';
  } else if (formula === 'H₂O') {
    angleLabel = '104.5° (Góc gấp khúc)';
  } else if (formula === 'NH₃') {
    angleLabel = '107° (Chóp tam giác)';
  }

  // IUPAC / Common Name dictionary & smart classifier
  const EXACT_NAMES: Record<string, { vi: string; en: string }> = {
    'CH₄': { vi: 'Metan (Ankan C₁)', en: 'Methane' },
    'C₂H₆': { vi: 'Etan (Ankan C₂)', en: 'Ethane' },
    'C₃H₈': { vi: 'Propan (Ankan C₃)', en: 'Propane' },
    'C₄H₁₀': { vi: 'Butan (Ankan C₄)', en: 'Butane' },
    'C₂H₄': { vi: 'Eten / Etilen (Anken C₂)', en: 'Ethene (Ethylene)' },
    'C₃H₆': { vi: 'Propen (Anken C₃)', en: 'Propene' },
    'C₂H₂': { vi: 'Etin / Axetilen (Ankin C₂)', en: 'Ethyne (Acetylene)' },
    'C₃H₄': { vi: 'Propin (Ankin C₃)', en: 'Propyne' },
    'CH₄O': { vi: 'Metanol (CH₃OH)', en: 'Methanol' },
    'C₂H₆O': { vi: 'Etanol / Ancol etylic (C₂H₅OH)', en: 'Ethanol' },
    'CH₂O': { vi: 'Metanal / Fomanđehit (HCHO)', en: 'Methanal (Formaldehyde)' },
    'CH₂O₂': { vi: 'Axit metanoic / Axit fomic (HCOOH)', en: 'Methanoic acid (Formic acid)' },
    'C₂H₄O₂': { vi: 'Axit etanoic / Axit axetic (CH₃COOH)', en: 'Ethanoic acid (Acetic acid)' },
    'CH₃Cl': { vi: 'Clorometan (CH₃Cl)', en: 'Chloromethane' },
    'CCl₄': { vi: 'Tetraclorometan (CCl₄)', en: 'Carbon tetrachloride' },
    'H₂O': { vi: 'Nước (H₂O)', en: 'Water' },
    'NH₃': { vi: 'Amoniac (NH₃)', en: 'Ammonia' },
    'CO₂': { vi: 'Cacbon đioxit (CO₂)', en: 'Carbon dioxide' },
    'HCl': { vi: 'Hiđro clorua (HCl)', en: 'Hydrogen chloride' },
    'H₂': { vi: 'Khí Hiđro (H₂)', en: 'Hydrogen gas' },
    'O₂': { vi: 'Khí Oxi (O₂)', en: 'Oxygen gas' },
    'N₂': { vi: 'Khí Nitơ (N₂)', en: 'Nitrogen gas' },
    'Cl₂': { vi: 'Khí Clo (Cl₂)', en: 'Chlorine gas' },
    'HCN': { vi: 'Hiđro xianua (HCN)', en: 'Hydrogen cyanide' },
    'H₂S': { vi: 'Hiđro sunfua (H₂S)', en: 'Hydrogen sulfide' },
    'SO₂': { vi: 'Lưu huỳnh đioxit (SO₂)', en: 'Sulfur dioxide' },
    'PH₃': { vi: 'Photphin (PH₃)', en: 'Phosphine' },
  };

  let iupacName = '';
  if (EXACT_NAMES[formula]) {
    iupacName = isEn ? EXACT_NAMES[formula].en : EXACT_NAMES[formula].vi;
  } else if (!isBalanced) {
    iupacName = isEn
      ? `Radical / Incomplete structure (${formula || 'Empty'})`
      : `Cấu trúc chưa bão hòa hóa trị (${formula || 'Rỗng'})`;
  } else if (counts.C) {
    const cNum = counts.C;
    const prefixVi = ['', 'Met', 'Et', 'Prop', 'But', 'Pent', 'Hex', 'Hept', 'Oct'][cNum] || `C${cNum}-`;
    if (counts.O && !counts.N && !counts.Cl && !counts.Br && !counts.F) {
      iupacName = isEn
        ? `Oxygenated organic compound (${formula})`
        : `Hợp chất hữu cơ chứa Oxi (${prefixVi} · ${formula})`;
    } else if (counts.N) {
      iupacName = isEn ? `Nitrogenous organic compound (${formula})` : `Amin / Hợp chất hữu cơ chứa N (${formula})`;
    } else if (counts.Cl || counts.F || counts.Br) {
      iupacName = isEn ? `Haloalkane derivative (${formula})` : `Dẫn xuất halogen (${formula})`;
    } else if (hasTriple) {
      iupacName = `${prefixVi}in (Ankin · ${formula})`;
    } else if (hasDouble) {
      iupacName = `${prefixVi}en (Anken · ${formula})`;
    } else {
      iupacName = `${prefixVi}an (Ankan · ${formula})`;
    }
  } else {
    iupacName = isEn ? `Inorganic compound (${formula})` : `Hợp chất vô cơ (${formula})`;
  }

  return {
    formula: formula || '—',
    molarMass,
    condensed,
    angleLabel,
    iupacName,
    valenceIssues,
    isBalanced,
  };
}

export const MolecularBuilder3D: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const initial = PRESETS[0];
  const [atoms, setAtoms] = useState<BuilderAtom[]>(() => initial.atoms.map((a) => ({ ...a })));
  const [bonds, setBonds] = useState<BuilderBond[]>(() => initial.bonds.map((b) => ({ ...b })));
  const [selectedAtomId, setSelectedAtomId] = useState<number | null>(1);
  const [pendingConnectId, setPendingConnectId] = useState<number | null>(null);
  const [activeElement, setActiveElement] = useState<ElementSym>('C');
  const [activeBondOrder, setActiveBondOrder] = useState<1 | 2 | 3>(1);
  const [autoBalanceH, setAutoBalanceH] = useState<boolean>(true);
  const [mode, setMode] = useState<BuilderMode>('attach');
  const [statusMsg, setStatusMsg] = useState<string>('');

  const nextIdRef = useRef<number>(100);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({
    atoms,
    bonds,
    selectedAtomId,
    pendingConnectId,
    activeElement,
    activeBondOrder,
    autoBalanceH,
    mode,
  });
  stateRef.current = {
    atoms,
    bonds,
    selectedAtomId,
    pendingConnectId,
    activeElement,
    activeBondOrder,
    autoBalanceH,
    mode,
  };

  const analysis = useMemo(() => analyzeMolecule(atoms, bonds, isEn), [atoms, bonds, isEn]);

  const loadPreset = (preset: MoleculePreset) => {
    setAtoms(preset.atoms.map((a) => ({ ...a })));
    setBonds(preset.bonds.map((b) => ({ ...b })));
    setSelectedAtomId(preset.atoms[0]?.id ?? null);
    setPendingConnectId(null);
    nextIdRef.current = Math.max(100, preset.atoms.length + preset.bonds.length + 20);
    setStatusMsg(isEn ? `Loaded ${preset.label}` : `Đã nạp mẫu ${preset.label}`);
  };

  const saturateMissingHydrogens = (
    workingAtoms: BuilderAtom[],
    workingBonds: BuilderBond[],
    targetIds?: number[]
  ): number => {
    let added = 0;
    const candidates = targetIds
      ? workingAtoms.filter((a) => targetIds.includes(a.id))
      : [...workingAtoms];

    candidates.forEach((a) => {
      if (a.element === 'H' || a.element === 'Cl' || a.element === 'F' || a.element === 'Br') return;
      const spec = ELEMENTS[a.element];
      const used = getUsedValence(a.id, workingBonds);
      const missing = Math.max(0, spec.valence - used);
      for (let i = 0; i < missing; i++) {
        const neighborVecs: THREE.Vector3[] = [];
        workingBonds.forEach((b) => {
          if (b.a === a.id) {
            const nb = workingAtoms.find((x) => x.id === b.b);
            if (nb) neighborVecs.push(new THREE.Vector3(nb.x, nb.y, nb.z));
          } else if (b.b === a.id) {
            const nb = workingAtoms.find((x) => x.id === b.a);
            if (nb) neighborVecs.push(new THREE.Vector3(nb.x, nb.y, nb.z));
          }
        });
        const pos = getNextVseprPosition(a, neighborVecs, 1.16, workingAtoms);
        const hId = ++nextIdRef.current;
        const bId = ++nextIdRef.current;
        workingAtoms.push({ id: hId, element: 'H', x: pos.x, y: pos.y, z: pos.z });
        workingBonds.push({ id: bId, a: a.id, b: hId, order: 1 });
        added++;
      }
    });
    return added;
  };

  const attachAtomTo = (
    targetId: number,
    el = stateRef.current.activeElement,
    requestedOrder = stateRef.current.activeBondOrder
  ) => {
    let workingAtoms = stateRef.current.atoms.map((a) => ({ ...a }));
    let workingBonds = stateRef.current.bonds.map((b) => ({ ...b }));
    const anchor = workingAtoms.find((a) => a.id === targetId);
    if (!anchor) return;

    const elMaxVal = getMaxValence(el);
    const effectiveOrder = Math.min(requestedOrder, elMaxVal) as 1 | 2 | 3;

    // 1. Clicking a monovalent terminal atom (H, F, Cl, Br)
    if (getMaxValence(anchor.element) === 1 && getUsedValence(anchor.id, workingBonds) >= 1) {
      const parentBond = workingBonds.find((b) => b.a === anchor.id || b.b === anchor.id);
      if (!parentBond) return;
      const parentId = parentBond.a === anchor.id ? parentBond.b : parentBond.a;
      const parentAtom = workingAtoms.find((a) => a.id === parentId);

      if (el === anchor.element) {
        setStatusMsg(
          isEn
            ? `${anchor.element}#${anchor.id} already has max valence (1). Click C/N/O instead.`
            : `${anchor.element}#${anchor.id} đã đạt hóa trị tối đa (1 liên kết) — hãy nhấp vào C/O/N để gắn!`
        );
        return;
      }

      // Smart Substitution: replace this terminal H/halogen in-place with the chosen atom
      if (parentAtom) {
        const parentRemAfterRemove =
          getMaxValence(parentAtom.element) - (getUsedValence(parentAtom.id, workingBonds) - parentBond.order);
        const subOrder = Math.min(effectiveOrder, Math.max(1, parentRemAfterRemove)) as 1 | 2 | 3;
        workingAtoms = workingAtoms.map((a) =>
          a.id === anchor.id ? { ...a, element: el } : a
        );
        workingBonds = workingBonds.map((b) =>
          b.id === parentBond.id ? { ...b, order: subOrder } : b
        );
        if (stateRef.current.autoBalanceH) {
          saturateMissingHydrogens(workingAtoms, workingBonds, [anchor.id, parentAtom.id]);
        }
        setAtoms(workingAtoms);
        setBonds(workingBonds);
        setSelectedAtomId(anchor.id);
        setStatusMsg(
          isEn
            ? `Replaced ${anchor.element}#${anchor.id} with ${el} and balanced valence.`
            : `Đã thế ${anchor.element}#${anchor.id} bằng ${el} và cân bằng đủ liên kết cho ${parentAtom.element}.`
        );
        return;
      }
    }

    // 2. Attaching to a polyvalent atom (C, N, O, S, P)
    const maxVal = getMaxValence(anchor.element);
    let usedVal = getUsedValence(anchor.id, workingBonds);
    let remaining = maxVal - usedVal;

    // Find terminal H atoms attached to anchor that can be cleanly displaced
    const attachedHs = workingBonds
      .filter((b) => (b.a === anchor.id || b.b === anchor.id) && b.order === 1)
      .map((b) => {
        const otherId = b.a === anchor.id ? b.b : b.a;
        return { bondId: b.id, atom: workingAtoms.find((a) => a.id === otherId) };
      })
      .filter((item): item is { bondId: number; atom: BuilderAtom } => {
        if (!item.atom || item.atom.element !== 'H') return false;
        const hBondCount = workingBonds.filter((x) => x.a === item.atom!.id || x.b === item.atom!.id).length;
        return hBondCount === 1;
      });

    if (remaining < effectiveOrder) {
      const needed = effectiveOrder - remaining;
      if (attachedHs.length >= needed) {
        const toRemove = attachedHs.slice(0, needed);
        const removeAtomIds = new Set(toRemove.map((r) => r.atom.id));
        const removeBondIds = new Set(toRemove.map((r) => r.bondId));
        workingAtoms = workingAtoms.filter((a) => !removeAtomIds.has(a.id));
        workingBonds = workingBonds.filter((b) => !removeBondIds.has(b.id));
        usedVal = getUsedValence(anchor.id, workingBonds);
        remaining = maxVal - usedVal;
      } else {
        setStatusMsg(
          isEn
            ? `${anchor.element}#${anchor.id} already reached max valence (${maxVal}).`
            : `${anchor.element}#${anchor.id} đã đủ tối đa ${maxVal} liên kết — không thể gắn thêm tránh lố hóa trị!`
        );
        return;
      }
    }

    if (remaining < effectiveOrder) {
      setStatusMsg(
        isEn
          ? `Insufficient remaining valence on ${anchor.element}#${anchor.id}.`
          : `Không đủ hóa trị trống trên ${anchor.element}#${anchor.id}.`
      );
      return;
    }

    const neighborVecs: THREE.Vector3[] = [];
    workingBonds.forEach((b) => {
      if (b.a === anchor.id) {
        const nb = workingAtoms.find((a) => a.id === b.b);
        if (nb) neighborVecs.push(new THREE.Vector3(nb.x, nb.y, nb.z));
      } else if (b.b === anchor.id) {
        const nb = workingAtoms.find((a) => a.id === b.a);
        if (nb) neighborVecs.push(new THREE.Vector3(nb.x, nb.y, nb.z));
      }
    });

    const bondLen = el === 'H' ? 1.18 : 1.48;
    const pos = getNextVseprPosition(anchor, neighborVecs, bondLen, workingAtoms);
    const newAtomId = ++nextIdRef.current;
    const newBondId = ++nextIdRef.current;

    workingAtoms.push({ id: newAtomId, element: el, x: pos.x, y: pos.y, z: pos.z });
    workingBonds.push({ id: newBondId, a: anchor.id, b: newAtomId, order: effectiveOrder });

    let autoH = 0;
    if (stateRef.current.autoBalanceH && el !== 'H') {
      autoH = saturateMissingHydrogens(workingAtoms, workingBonds, [newAtomId, anchor.id]);
    }

    setAtoms(workingAtoms);
    setBonds(workingBonds);
    setSelectedAtomId(el === 'H' ? anchor.id : newAtomId);
    setStatusMsg(
      isEn
        ? `Attached ${el} (order ${effectiveOrder}) to ${anchor.element}#${anchor.id}${autoH ? ` + ${autoH} H` : ''}`
        : `Đã gắn ${el} (bậc ${effectiveOrder}) vào ${anchor.element}#${anchor.id}${autoH ? ` và tự bù ${autoH} H` : ''}`
    );
  };

  const autoSaturateHydrogens = () => {
    const workingAtoms = atoms.map((a) => ({ ...a }));
    const workingBonds = bonds.map((b) => ({ ...b }));
    const added = saturateMissingHydrogens(workingAtoms, workingBonds);

    setAtoms(workingAtoms);
    setBonds(workingBonds);
    setStatusMsg(
      added > 0
        ? isEn
          ? `Added ${added} H atoms to saturate valence.`
          : `Đã tự động điền thêm ${added} nguyên tử H để bão hòa hóa trị.`
        : isEn
        ? 'All atoms are already valence-saturated.'
        : 'Tất cả nguyên tử đã đủ hóa trị.'
    );
  };

  const handleAtomInteraction = (atomId: number) => {
    const cur = stateRef.current;
    setSelectedAtomId(atomId);

    if (cur.mode === 'attach') {
      attachAtomTo(atomId, cur.activeElement, cur.activeBondOrder);
      return;
    }

    if (cur.mode === 'erase') {
      if (cur.atoms.length <= 1) {
        setStatusMsg(isEn ? 'Keep at least 1 seed atom or press Clear.' : 'Giữ lại ít nhất 1 nguyên tử hạt giống hoặc bấm Dọn bàn.');
        return;
      }
      const targetAtom = cur.atoms.find((a) => a.id === atomId);
      const affectedNeighbors = cur.bonds
        .filter((b) => b.a === atomId || b.b === atomId)
        .map((b) => (b.a === atomId ? b.b : b.a));

      const nextAtoms = cur.atoms.filter((a) => a.id !== atomId);
      const nextBonds = cur.bonds.filter((b) => b.a !== atomId && b.b !== atomId);

      // If removing a heavy substituent while autoBalanceH is ON, refill H on exposed C/N/O
      if (cur.autoBalanceH && targetAtom && targetAtom.element !== 'H') {
        saturateMissingHydrogens(nextAtoms, nextBonds, affectedNeighbors);
      }

      setAtoms(nextAtoms);
      setBonds(nextBonds);
      setSelectedAtomId(nextAtoms[0]?.id ?? null);
      setStatusMsg(isEn ? `Removed atom #${atomId}` : `Đã gỡ nguyên tử ${targetAtom?.element || ''}#${atomId}`);
      return;
    }

    if (cur.mode === 'connect') {
      if (cur.pendingConnectId === null || cur.pendingConnectId === atomId) {
        setPendingConnectId(atomId);
        setStatusMsg(isEn ? `Selected atom #${atomId}. Click second atom to bond.` : `Đã chọn #${atomId}. Nhấp nguyên tử thứ 2 để nối/đổi bậc liên kết.`);
      } else {
        const firstId = cur.pendingConnectId;
        let workingAtoms = cur.atoms.map((a) => ({ ...a }));
        let workingBonds = cur.bonds.map((b) => ({ ...b }));
        const atom1 = workingAtoms.find((a) => a.id === firstId);
        const atom2 = workingAtoms.find((a) => a.id === atomId);
        if (!atom1 || !atom2) {
          setPendingConnectId(null);
          return;
        }

        const existing = workingBonds.find(
          (b) => (b.a === firstId && b.b === atomId) || (b.b === firstId && b.a === atomId)
        );

        const freeOrDisplaceH = (target: BuilderAtom, neededDelta: number): boolean => {
          const rem = getMaxValence(target.element) - getUsedValence(target.id, workingBonds);
          if (rem >= neededDelta) return true;
          const short = neededDelta - rem;
          const hBonds = workingBonds
            .filter((b) => (b.a === target.id || b.b === target.id) && b.order === 1)
            .map((b) => {
              const otherId = b.a === target.id ? b.b : b.a;
              return { bondId: b.id, atom: workingAtoms.find((a) => a.id === otherId) };
            })
            .filter((item): item is { bondId: number; atom: BuilderAtom } => {
              if (!item.atom || item.atom.element !== 'H') return false;
              return workingBonds.filter((x) => x.a === item.atom!.id || x.b === item.atom!.id).length === 1;
            });
          if (hBonds.length < short) return false;
          const dropAtoms = new Set(hBonds.slice(0, short).map((x) => x.atom.id));
          const dropBonds = new Set(hBonds.slice(0, short).map((x) => x.bondId));
          workingAtoms = workingAtoms.filter((a) => !dropAtoms.has(a.id));
          workingBonds = workingBonds.filter((b) => !dropBonds.has(b.id));
          return true;
        };

        if (existing) {
          if (existing.order < 3) {
            if (!freeOrDisplaceH(atom1, 1) || !freeOrDisplaceH(atom2, 1)) {
              setStatusMsg(
                isEn
                  ? 'Cannot upgrade bond order without exceeding max valence.'
                  : 'Không thể nâng bậc liên kết vì vượt quá hóa trị tối đa của nguyên tử!'
              );
              setPendingConnectId(null);
              return;
            }
            const nextOrder = (existing.order + 1) as 2 | 3;
            workingBonds = workingBonds.map((b) =>
              b.id === existing.id ? { ...b, order: nextOrder } : b
            );
            setAtoms(workingAtoms);
            setBonds(workingBonds);
            setStatusMsg(isEn ? `Upgraded bond to order ${nextOrder}` : `Đã nâng liên kết giữa #${firstId}–#${atomId} lên bậc ${nextOrder}`);
          } else {
            workingBonds = workingBonds.filter((b) => b.id !== existing.id);
            if (cur.autoBalanceH) {
              saturateMissingHydrogens(workingAtoms, workingBonds, [firstId, atomId]);
            }
            setAtoms(workingAtoms);
            setBonds(workingBonds);
            setStatusMsg(isEn ? 'Removed bond' : `Đã xóa liên kết giữa #${firstId}–#${atomId}`);
          }
        } else {
          const orderToAdd = Math.min(cur.activeBondOrder, getMaxValence(atom1.element), getMaxValence(atom2.element)) as 1 | 2 | 3;
          if (!freeOrDisplaceH(atom1, orderToAdd) || !freeOrDisplaceH(atom2, orderToAdd)) {
            setStatusMsg(
              isEn
                ? 'Cannot bond: one atom has reached max valence.'
                : 'Không thể nối thêm liên kết vì một nguyên tử đã đạt hóa trị tối đa!'
            );
            setPendingConnectId(null);
            return;
          }
          const bId = ++nextIdRef.current;
          workingBonds.push({ id: bId, a: firstId, b: atomId, order: orderToAdd });
          setAtoms(workingAtoms);
          setBonds(workingBonds);
          setStatusMsg(isEn ? `Bonded #${firstId} and #${atomId}` : `Đã nối liên kết giữa #${firstId} và #${atomId}`);
        }
        setPendingConnectId(null);
      }
    }
  };

  const handleInteractionRef = useRef(handleAtomInteraction);
  handleInteractionRef.current = handleAtomInteraction;

  // Dynamic molecule group inside persistent Three.js WebGL scene
  const moleculeGroupRef = useRef<THREE.Group | null>(null);
  const atomMeshesRef = useRef<THREE.Mesh[]>([]);
  const sceneMaterialsRef = useRef<THREE.Material[]>([]);
  const sceneGeometriesRef = useRef<THREE.BufferGeometry[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSwGl = detectSoftwareGl();
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSwGl,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSwGl ? 1 : 2));
    renderer.setSize(container.clientWidth || 720, container.clientHeight || 460);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070d19');

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(
      44,
      (container.clientWidth || 720) / (container.clientHeight || 460),
      0.1,
      100
    );
    camera.position.set(4.2, 3.0, 5.4);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSwGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.2;
    controls.maxDistance = 16;

    const hemi = new THREE.HemisphereLight(0xe2e8f0, 0x0f172a, 0.8);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    const grid = new THREE.GridHelper(12, 24, 0x1e293b, 0x0f172a);
    grid.position.y = -2.2;
    scene.add(grid);

    const molGroup = new THREE.Group();
    scene.add(molGroup);
    moleculeGroupRef.current = molGroup;

    // Raycaster pointer click (ignoring camera orbit drags)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downX = 0;
    let downY = 0;
    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };
    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (dist > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(atomMeshesRef.current, false);
      if (hits.length > 0) {
        const atomId = hits[0].object.userData.atomId as number | undefined;
        if (typeof atomId === 'number') {
          handleInteractionRef.current(atomId);
        }
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let disposed = false;
    let cancelFrame: () => void = () => {};
    const animate = () => {
      if (disposed) return;
      controls.update();
      renderer.render(scene, camera);
      scheduleSyncedGlFrame(renderer, isSwGl, animate, (c) => {
        cancelFrame = c;
      });
    };
    animate();

    return () => {
      disposed = true;
      cancelFrame();
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      sceneGeometriesRef.current.forEach((g) => g.dispose());
      sceneMaterialsRef.current.forEach((m) => m.dispose());
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  // Rebuild 3D meshes when atoms/bonds/selection change
  useEffect(() => {
    const group = moleculeGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }
    sceneGeometriesRef.current.forEach((g) => g.dispose());
    sceneMaterialsRef.current.forEach((m) => m.dispose());
    sceneGeometriesRef.current = [];
    sceneMaterialsRef.current = [];
    atomMeshesRef.current = [];

    const sphereGeoCache = new Map<ElementSym, THREE.SphereGeometry>();
    const matCache = new Map<ElementSym, THREE.MeshPhysicalMaterial>();

    atoms.forEach((a) => {
      const spec = ELEMENTS[a.element];
      let geo = sphereGeoCache.get(a.element);
      if (!geo) {
        geo = new THREE.SphereGeometry(spec.radius, 28, 22);
        sphereGeoCache.set(a.element, geo);
        sceneGeometriesRef.current.push(geo);
      }
      let mat = matCache.get(a.element);
      if (!mat) {
        mat = new THREE.MeshPhysicalMaterial({
          color: spec.color,
          roughness: 0.25,
          metalness: 0.08,
          clearcoat: 0.65,
          clearcoatRoughness: 0.15,
        });
        matCache.set(a.element, mat);
        sceneMaterialsRef.current.push(mat);
      }
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(a.x, a.y, a.z);
      mesh.userData = { atomId: a.id };
      group.add(mesh);
      atomMeshesRef.current.push(mesh);

      if (a.id === selectedAtomId || a.id === pendingConnectId) {
        const ringGeo = new THREE.TorusGeometry(spec.radius + 0.1, 0.025, 12, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: a.id === pendingConnectId ? 0xf59e0b : 0x38bdf8,
        });
        sceneGeometriesRef.current.push(ringGeo);
        sceneMaterialsRef.current.push(ringMat);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(a.x, a.y, a.z);
        ring.rotation.x = Math.PI / 3;
        group.add(ring);
      }
    });

    const bondMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.35,
      metalness: 0.35,
    });
    sceneMaterialsRef.current.push(bondMat);

    const up = new THREE.Vector3(0, 1, 0);
    bonds.forEach((b) => {
      const atomA = atoms.find((x) => x.id === b.a);
      const atomB = atoms.find((x) => x.id === b.b);
      if (!atomA || !atomB) return;

      const pA = new THREE.Vector3(atomA.x, atomA.y, atomA.z);
      const pB = new THREE.Vector3(atomB.x, atomB.y, atomB.z);
      const dir = pB.clone().sub(pA);
      const len = Math.max(0.1, dir.length());
      const unit = dir.clone().normalize();
      const perpSeed = Math.abs(unit.y) < 0.85 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      const offsetAxis = new THREE.Vector3().crossVectors(unit, perpSeed).normalize();

      const offsets =
        b.order === 1 ? [0] : b.order === 2 ? [-0.08, 0.08] : [-0.11, 0, 0.11];
      const cylRadius = b.order === 1 ? 0.075 : 0.052;
      const cylGeo = new THREE.CylinderGeometry(cylRadius, cylRadius, len, 14);
      sceneGeometriesRef.current.push(cylGeo);

      const quat = new THREE.Quaternion().setFromUnitVectors(up, unit);
      const mid = pA.clone().add(pB).multiplyScalar(0.5);

      offsets.forEach((off) => {
        const cyl = new THREE.Mesh(cylGeo, bondMat);
        cyl.position.copy(mid).addScaledVector(offsetAxis, off);
        cyl.quaternion.copy(quat);
        group.add(cyl);
      });
    });
  }, [atoms, bonds, selectedAtomId, pendingConnectId]);

  const clearToSingleCarbon = () => {
    setAtoms([{ id: 1, element: activeElement === 'H' ? 'C' : activeElement, x: 0, y: 0, z: 0 }]);
    setBonds([]);
    setSelectedAtomId(1);
    setPendingConnectId(null);
    nextIdRef.current = 10;
    setStatusMsg(isEn ? 'Reset to seed atom.' : 'Đã dọn sạch bàn lắp ráp về 1 nguyên tử hạt giống.');
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar: Mode, Element Palette, Bond Order & Presets */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMode('attach');
                setPendingConnectId(null);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                mode === 'attach'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isEn ? 'Click Atom to Attach' : 'Nhấp nguyên tử để Gắn mới'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('connect');
                setPendingConnectId(null);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                mode === 'connect'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Connect / Bond Order' : 'Nối / Đổi bậc liên kết'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('erase');
                setPendingConnectId(null);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                mode === 'erase'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>{isEn ? 'Remove Atom' : 'Gỡ nguyên tử'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {([1, 2, 3] as const).map((ord) => (
              <button
                key={ord}
                type="button"
                onClick={() => setActiveBondOrder(ord)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer whitespace-nowrap ${
                  activeBondOrder === ord
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {ord === 1 ? 'Đơn (–)' : ord === 2 ? 'Đôi (=)' : 'Ba (≡)'}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAutoBalanceH((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer whitespace-nowrap ${
                autoBalanceH
                  ? 'bg-emerald-600/15 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              title="Tự động giữ hóa trị C (4) và phi kim bằng cách thế/bù H hợp lý"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{autoBalanceH ? 'Tự cân bằng H (Bật)' : 'Tự cân bằng H (Tắt)'}</span>
            </button>
            <button
              type="button"
              onClick={autoSaturateHydrogens}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Auto-Fill H' : 'Tự điền H bão hòa'}</span>
            </button>
            <button
              type="button"
              onClick={clearToSingleCarbon}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Empty Seed' : 'Dọn bàn'}</span>
            </button>
          </div>
        </div>

        {/* Atom Palette */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">
            {isEn ? 'Atom Palette:' : 'Chọn nguyên tử gắn:'}
          </span>
          {ELEMENT_ORDER.map((sym) => {
            const spec = ELEMENTS[sym];
            const active = activeElement === sym;
            return (
              <button
                key={sym}
                type="button"
                onClick={() => {
                  setActiveElement(sym);
                  setMode('attach');
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold cursor-pointer whitespace-nowrap transition-transform ${
                  active
                    ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-slate-400/50 shrink-0"
                  style={{ backgroundColor: spec.color }}
                />
                <span>{sym}</span>
                <span className="text-[10px] font-mono text-slate-400">({spec.valence})</span>
              </button>
            );
          })}
          {selectedAtomId !== null && (
            <button
              type="button"
              onClick={() => attachAtomTo(selectedAtomId, activeElement, activeBondOrder)}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gắn {activeElement} vào #{selectedAtomId}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Stage + Live Chemistry Telemetry Dock */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden">
        <div ref={mountRef} className="w-full h-[460px] sm:h-[520px] cursor-crosshair" />

        {/* Bottom Dock: Presets & Chemical Readout (never obscures 3D canvas) */}
        <div className="border-t border-slate-800 bg-slate-900 p-4 space-y-3 text-slate-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
              <div className="text-[11px] text-slate-400">Công thức phân tử &amp; Khối lượng</div>
              <div className="text-base font-mono font-extrabold text-emerald-400 mt-0.5 tabular-nums">
                {analysis.formula} · {analysis.molarMass.toFixed(2)} g/mol
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
              <div className="text-[11px] text-slate-400">Công thức cấu tạo thu gọn</div>
              <div className="text-sm font-mono font-bold text-sky-300 mt-0.5 truncate">
                {analysis.condensed}
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
              <div className="text-[11px] text-slate-400">Góc liên kết &amp; Lai hóa VSEPR</div>
              <div className="text-sm font-mono font-bold text-amber-300 mt-0.5 tabular-nums">
                {analysis.angleLabel}
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
              <div className="text-[11px] text-slate-400">Danh pháp IUPAC / Thông thường</div>
              <div className="text-sm font-bold text-white mt-0.5 truncate" title={analysis.iupacName}>
                {analysis.iupacName}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              {analysis.isBalanced ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Hóa trị toàn phân tử hợp lệ ({atoms.length} nguyên tử · {bonds.length} liên kết).</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Chưa bão hòa hóa trị tại: {analysis.valenceIssues.join(', ')}</span>
                </span>
              )}
              {statusMsg && <span className="text-slate-400 hidden sm:inline">· {statusMsg}</span>}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 mr-1">Mẫu gợi ý:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => loadPreset(p)}
                  className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 cursor-pointer whitespace-nowrap"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
