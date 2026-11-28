import * as THREE from 'three';

export type BioSurfaceKind =
  | 'cardiac_muscle'
  | 'skeletal_muscle'
  | 'compact_bone'
  | 'cartilage'
  | 'skin_shell'
  | 'brain_cortex'
  | 'lung_parenchyma'
  | 'liver_parenchyma'
  | 'renal_cortex'
  | 'gastric_mucosa'
  | 'arterial_vessel'
  | 'venous_vessel'
  | 'nerve_myelin'
  | 'endocrine_gland'
  | 'lipid_membrane'
  | 'protein_globular'
  | 'plant_epidermis'
  | 'plant_xylem'
  | 'plant_phloem'
  | 'chloroplast_membrane'
  | 'bacterial_capsule'
  | 'chitin_fungi'
  | 'soil_terrain';

interface TextureBundle {
  albedo?: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
  roughness: THREE.CanvasTexture;
}

/**
 * Generates deterministic pseudo-random value from 2D integer coords for organic procedural textures.
 */
function hash2d(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function makeCanvas(size = 256): [HTMLCanvasElement, CanvasRenderingContext2D] | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  return [canvas, ctx];
}

function configureTexture(
  tex: THREE.CanvasTexture,
  isColorMap: boolean,
  anisotropy: number,
  repeat = 2
): THREE.CanvasTexture {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = isColorMap ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = Math.max(1, anisotropy);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Procedural organic biological texture generator (zero external asset requests).
 * Generates tileable albedo, bump, and roughness maps per biological tissue class.
 */
export class BioMaterialVault {
  private readonly textures = new Set<THREE.Texture>();
  private readonly materials = new Set<THREE.Material>();
  private readonly bundleCache = new Map<string, TextureBundle>();
  private readonly matCache = new Map<string, THREE.MeshPhysicalMaterial>();
  private readonly anisotropy: number;
  private readonly isLowEnd: boolean;

  constructor(maxAnisotropy = 4, isLowEnd = false) {
    this.anisotropy = Math.min(8, Math.max(1, maxAnisotropy));
    this.isLowEnd = isLowEnd;
  }

  private getOrBuildBundle(
    pattern: 'fibers' | 'gyri' | 'alveolar' | 'cellular' | 'bone' | 'soil' | 'striated',
    baseHex: number,
    accentHex: number,
    seed: number,
    repeat = 2
  ): TextureBundle | null {
    const key = `${pattern}:${baseHex}:${accentHex}:${seed}:${repeat}`;
    const cached = this.bundleCache.get(key);
    if (cached) return cached;

    const size = this.isLowEnd ? 128 : 256;
    const albedoPair = makeCanvas(size);
    const bumpPair = makeCanvas(size);
    const roughPair = makeCanvas(size);
    if (!albedoPair || !bumpPair || !roughPair) return null;

    const [aCanvas, aCtx] = albedoPair;
    const [bCanvas, bCtx] = bumpPair;
    const [rCanvas, rCtx] = roughPair;

    const baseCol = new THREE.Color(baseHex);
    const accCol = new THREE.Color(accentHex);

    aCtx.fillStyle = `#${baseCol.getHexString()}`;
    aCtx.fillRect(0, 0, size, size);

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    rCtx.fillStyle = '#909090';
    rCtx.fillRect(0, 0, size, size);

    if (pattern === 'fibers' || pattern === 'striated') {
      const count = pattern === 'striated' ? 68 : 48;
      for (let i = 0; i < count; i++) {
        const y = (i / count) * size;
        const amp = 4 + hash2d(i, 1, seed) * 6;
        const mix = 0.25 + hash2d(i, 2, seed) * 0.55;
        const col = baseCol.clone().lerp(accCol, mix);

        aCtx.strokeStyle = `rgba(${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)},0.55)`;
        aCtx.lineWidth = pattern === 'striated' ? 1.8 : 2.6;
        bCtx.strokeStyle = i % 2 === 0 ? 'rgba(215,215,215,0.45)' : 'rgba(65,65,65,0.45)';
        bCtx.lineWidth = 2.0;
        rCtx.strokeStyle = i % 2 === 0 ? 'rgba(110,110,110,0.45)' : 'rgba(185,185,185,0.45)';
        rCtx.lineWidth = 2.0;

        for (const ctx of [aCtx, bCtx, rCtx]) {
          ctx.beginPath();
          for (let x = 0; x <= size; x += 8) {
            const wy = y + Math.sin((x / size) * Math.PI * 4 + i * 0.7) * amp;
            if (x === 0) ctx.moveTo(x, wy);
            else ctx.lineTo(x, wy);
          }
          ctx.stroke();
        }
      }
    } else if (pattern === 'gyri') {
      // Convoluted cortical sulci/gyri ridges
      for (let i = 0; i < 42; i++) {
        const cx = hash2d(i, 3, seed) * size;
        const cy = hash2d(i, 4, seed) * size;
        const r = 10 + hash2d(i, 5, seed) * 20;
        const col = baseCol.clone().lerp(accCol, 0.45 + hash2d(i, 6, seed) * 0.4);
        aCtx.strokeStyle = `rgba(${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)},0.7)`;
        aCtx.lineWidth = 4.2;
        bCtx.strokeStyle = 'rgba(35,35,35,0.85)';
        bCtx.lineWidth = 5.0;
        rCtx.strokeStyle = 'rgba(205,205,205,0.6)';
        rCtx.lineWidth = 4.5;

        for (const ctx of [aCtx, bCtx, rCtx]) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, hash2d(i, 7, seed) * Math.PI, hash2d(i, 8, seed) * Math.PI + 2.3);
          ctx.stroke();
        }
      }
    } else if (pattern === 'alveolar' || pattern === 'cellular') {
      const cells = pattern === 'alveolar' ? 85 : 54;
      for (let i = 0; i < cells; i++) {
        const cx = hash2d(i, 9, seed) * size;
        const cy = hash2d(i, 10, seed) * size;
        const rad = (pattern === 'alveolar' ? 5 : 8) + hash2d(i, 11, seed) * 10;
        const col = baseCol.clone().lerp(accCol, 0.25 + hash2d(i, 12, seed) * 0.5);
        aCtx.fillStyle = `rgba(${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)},0.45)`;
        aCtx.strokeStyle = `rgba(${Math.round(accCol.r * 255)},${Math.round(accCol.g * 255)},${Math.round(accCol.b * 255)},0.55)`;
        aCtx.lineWidth = 1.4;
        aCtx.beginPath();
        aCtx.arc(cx, cy, rad, 0, Math.PI * 2);
        aCtx.fill();
        aCtx.stroke();

        bCtx.fillStyle = 'rgba(205,205,205,0.45)';
        bCtx.strokeStyle = 'rgba(55,55,55,0.7)';
        bCtx.lineWidth = 1.8;
        bCtx.beginPath();
        bCtx.arc(cx, cy, rad, 0, Math.PI * 2);
        bCtx.fill();
        bCtx.stroke();

        rCtx.fillStyle = 'rgba(105,105,105,0.4)';
        rCtx.beginPath();
        rCtx.arc(cx, cy, rad, 0, Math.PI * 2);
        rCtx.fill();
      }
    } else {
      // bone or soil granular micro-porosity
      const dots = pattern === 'soil' ? 220 : 140;
      for (let i = 0; i < dots; i++) {
        const cx = hash2d(i, 13, seed) * size;
        const cy = hash2d(i, 14, seed) * size;
        const rad = 1.5 + hash2d(i, 15, seed) * (pattern === 'soil' ? 5 : 3.2);
        const mix = hash2d(i, 16, seed);
        const col = baseCol.clone().lerp(accCol, mix);
        aCtx.fillStyle = `rgba(${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)},0.45)`;
        aCtx.beginPath();
        aCtx.arc(cx, cy, rad, 0, Math.PI * 2);
        aCtx.fill();

        const bVal = Math.round(70 + mix * 140);
        bCtx.fillStyle = `rgba(${bVal},${bVal},${bVal},0.55)`;
        bCtx.beginPath();
        bCtx.arc(cx, cy, rad, 0, Math.PI * 2);
        bCtx.fill();
      }
    }

    const albedo = configureTexture(new THREE.CanvasTexture(aCanvas), true, this.anisotropy, repeat);
    const bump = configureTexture(new THREE.CanvasTexture(bCanvas), false, this.anisotropy, repeat);
    const roughness = configureTexture(new THREE.CanvasTexture(rCanvas), false, this.anisotropy, repeat);

    this.textures.add(albedo);
    this.textures.add(bump);
    this.textures.add(roughness);

    const bundle = { albedo, bump, roughness };
    this.bundleCache.set(key, bundle);
    return bundle;
  }

  /**
   * Returns a cached or newly calibrated PBR MeshPhysicalMaterial tuned for scientific biology visualization.
   */
  public getMaterial(
    kind: BioSurfaceKind,
    opts?: {
      color?: number;
      opacity?: number;
      transparent?: boolean;
      side?: THREE.Side;
      roughness?: number;
      bumpScale?: number;
      emissive?: number;
      emissiveIntensity?: number;
      cacheKeySuffix?: string;
    }
  ): THREE.MeshPhysicalMaterial {
    const cKey = `${kind}:${opts?.color ?? 'def'}:${opts?.opacity ?? 1}:${opts?.transparent ?? false}:${opts?.side ?? THREE.FrontSide}:${opts?.cacheKeySuffix ?? ''}`;
    const existing = this.matCache.get(cKey);
    if (existing) return existing;

    let defaultColor = 0xffffff;
    let accentColor = 0xcccccc;
    let pattern: 'fibers' | 'gyri' | 'alveolar' | 'cellular' | 'bone' | 'soil' | 'striated' = 'cellular';
    let roughness = 0.45;
    let metalness = 0.03;
    let clearcoat = 0.25;
    let clearcoatRoughness = 0.35;
    let bumpScale = 0.025;
    let repeat = 2;

    switch (kind) {
      case 'cardiac_muscle':
        defaultColor = 0xa92d38;
        accentColor = 0x6b141c;
        pattern = 'striated';
        roughness = 0.36;
        clearcoat = 0.45;
        clearcoatRoughness = 0.25;
        bumpScale = 0.028;
        break;
      case 'skeletal_muscle':
        defaultColor = 0x9f333b;
        accentColor = 0x5c181f;
        pattern = 'striated';
        roughness = 0.52;
        clearcoat = 0.18;
        bumpScale = 0.032;
        repeat = 3;
        break;
      case 'compact_bone':
        defaultColor = 0xe8dfd0;
        accentColor = 0xcbbba0;
        pattern = 'bone';
        roughness = 0.58;
        clearcoat = 0.1;
        bumpScale = 0.02;
        break;
      case 'cartilage':
        defaultColor = 0xc9dfeb;
        accentColor = 0x99bfd1;
        pattern = 'cellular';
        roughness = 0.28;
        clearcoat = 0.55;
        clearcoatRoughness = 0.18;
        bumpScale = 0.012;
        break;
      case 'skin_shell':
        defaultColor = 0xdfb9a2;
        accentColor = 0xc59a82;
        pattern = 'cellular';
        roughness = 0.62;
        clearcoat = 0.08;
        bumpScale = 0.01;
        break;
      case 'brain_cortex':
        defaultColor = 0xe4b6ad;
        accentColor = 0x9c5b58;
        pattern = 'gyri';
        roughness = 0.44;
        clearcoat = 0.38;
        clearcoatRoughness = 0.28;
        bumpScale = 0.045;
        repeat = 2;
        break;
      case 'lung_parenchyma':
        defaultColor = 0xe69ba6;
        accentColor = 0xb86b77;
        pattern = 'alveolar';
        roughness = 0.48;
        clearcoat = 0.32;
        bumpScale = 0.028;
        repeat = 3;
        break;
      case 'liver_parenchyma':
        defaultColor = 0x7a2b25;
        accentColor = 0x4f1713;
        pattern = 'cellular';
        roughness = 0.3;
        clearcoat = 0.52;
        clearcoatRoughness = 0.22;
        bumpScale = 0.015;
        break;
      case 'renal_cortex':
        defaultColor = 0x933e34;
        accentColor = 0x62241f;
        pattern = 'cellular';
        roughness = 0.36;
        clearcoat = 0.42;
        bumpScale = 0.02;
        break;
      case 'gastric_mucosa':
        defaultColor = 0xd47d72;
        accentColor = 0xa84d46;
        pattern = 'fibers';
        roughness = 0.38;
        clearcoat = 0.45;
        bumpScale = 0.026;
        break;
      case 'arterial_vessel':
        defaultColor = 0xc82333;
        accentColor = 0x89121e;
        pattern = 'fibers';
        roughness = 0.32;
        clearcoat = 0.48;
        bumpScale = 0.015;
        break;
      case 'venous_vessel':
        defaultColor = 0x2a5ea8;
        accentColor = 0x193c70;
        pattern = 'fibers';
        roughness = 0.34;
        clearcoat = 0.44;
        bumpScale = 0.015;
        break;
      case 'nerve_myelin':
        defaultColor = 0xf2d16b;
        accentColor = 0xc99f33;
        pattern = 'fibers';
        roughness = 0.36;
        clearcoat = 0.32;
        bumpScale = 0.016;
        break;
      case 'endocrine_gland':
        defaultColor = 0xe8a75d;
        accentColor = 0xb87632;
        pattern = 'alveolar';
        roughness = 0.46;
        clearcoat = 0.28;
        bumpScale = 0.024;
        break;
      case 'lipid_membrane':
        defaultColor = 0x38bdf8;
        accentColor = 0x0e7490;
        pattern = 'cellular';
        roughness = 0.28;
        clearcoat = 0.55;
        clearcoatRoughness = 0.16;
        bumpScale = 0.018;
        break;
      case 'protein_globular':
        defaultColor = 0x6366f1;
        accentColor = 0x4338ca;
        pattern = 'cellular';
        roughness = 0.34;
        clearcoat = 0.35;
        bumpScale = 0.02;
        break;
      case 'plant_epidermis':
        defaultColor = 0x3f9142;
        accentColor = 0x245e27;
        pattern = 'cellular';
        roughness = 0.5;
        clearcoat = 0.25;
        bumpScale = 0.022;
        repeat = 3;
        break;
      case 'plant_xylem':
        defaultColor = 0x3b82f6;
        accentColor = 0x1d4ed8;
        pattern = 'striated';
        roughness = 0.42;
        clearcoat = 0.25;
        bumpScale = 0.025;
        break;
      case 'plant_phloem':
        defaultColor = 0xd97706;
        accentColor = 0x92400e;
        pattern = 'fibers';
        roughness = 0.48;
        clearcoat = 0.15;
        bumpScale = 0.022;
        break;
      case 'chloroplast_membrane':
        defaultColor = 0x15803d;
        accentColor = 0x052e16;
        pattern = 'cellular';
        roughness = 0.35;
        clearcoat = 0.35;
        bumpScale = 0.02;
        break;
      case 'bacterial_capsule':
        defaultColor = 0x10b981;
        accentColor = 0x047857;
        pattern = 'cellular';
        roughness = 0.32;
        clearcoat = 0.48;
        bumpScale = 0.02;
        break;
      case 'chitin_fungi':
        defaultColor = 0xd97757;
        accentColor = 0x9a4a31;
        pattern = 'fibers';
        roughness = 0.62;
        clearcoat = 0.12;
        bumpScale = 0.028;
        break;
      case 'soil_terrain':
        defaultColor = 0x4b3b2c;
        accentColor = 0x2e2217;
        pattern = 'soil';
        roughness = 0.88;
        clearcoat = 0.0;
        bumpScale = 0.04;
        repeat = 4;
        break;
    }

    const chosenColor = opts?.color ?? defaultColor;
    // Slight darker accent computed automatically when custom color overrides default
    const cObj = new THREE.Color(chosenColor);
    const derivedAccent = opts?.color !== undefined ? cObj.clone().multiplyScalar(0.65).getHex() : accentColor;
    const bundle = this.getOrBuildBundle(pattern, chosenColor, derivedAccent, chosenColor & 255, repeat);

    const isTransparent = Boolean(opts?.transparent) || (opts?.opacity !== undefined && opts.opacity < 1);
    const mat = new THREE.MeshPhysicalMaterial({
      // Always use white base when albedo map carries tint so color never gets double-darkened
      color: bundle?.albedo ? 0xffffff : chosenColor,
      map: bundle?.albedo ?? null,
      bumpMap: bundle?.bump ?? null,
      bumpScale: opts?.bumpScale ?? bumpScale,
      roughnessMap: bundle?.roughness ?? null,
      roughness: opts?.roughness ?? roughness,
      metalness,
      clearcoat: this.isLowEnd ? 0 : clearcoat,
      clearcoatRoughness,
      transparent: isTransparent,
      opacity: opts?.opacity ?? 1,
      depthWrite: !isTransparent || (opts?.opacity ?? 1) > 0.72,
      side: opts?.side ?? THREE.FrontSide,
      emissive: opts?.emissive ?? 0x000000,
      emissiveIntensity: opts?.emissiveIntensity ?? 0
    });

    this.materials.add(mat);
    this.matCache.set(cKey, mat);
    return mat;
  }

  /** Creates a standalone tracked material (useful for unique organ layers that mutate opacity/xray independently) */
  public createUniqueMaterial(
    kind: BioSurfaceKind,
    opts?: {
      color?: number;
      opacity?: number;
      transparent?: boolean;
      side?: THREE.Side;
      roughness?: number;
      emissive?: number;
      emissiveIntensity?: number;
    }
  ): THREE.MeshPhysicalMaterial {
    const base = this.getMaterial(kind, {
      ...opts,
      cacheKeySuffix: `uniq-${this.materials.size}`
    });
    return base;
  }

  public disposeAll(): void {
    this.materials.forEach((m) => m.dispose());
    this.materials.clear();
    this.matCache.clear();
    this.textures.forEach((t) => t.dispose());
    this.textures.clear();
    this.bundleCache.clear();
  }
}
