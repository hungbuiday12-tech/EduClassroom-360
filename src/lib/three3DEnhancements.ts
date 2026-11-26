import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
} from 'postprocessing';

export interface PostProcessPipeline {
  render: (dt?: number) => void;
  setSize: (width: number, height: number) => void;
  dispose: () => void;
}

export interface PostProcessOptions {
  bloomIntensity?: number;
  luminanceThreshold?: number;
  enableSmaa?: boolean;
}

export function createPostProcessingPipeline(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  options: PostProcessOptions = {}
): PostProcessPipeline {
  const { bloomIntensity = 0.34, luminanceThreshold = 0.9, enableSmaa = true } = options;

  try {
    const composer = new EffectComposer(renderer, {
      multisampling: 0,
    });
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const effects: Array<BloomEffect | SMAAEffect> = [];
    effects.push(
      new BloomEffect({
        intensity: bloomIntensity,
        luminanceThreshold,
        luminanceSmoothing: 0.25,
        mipmapBlur: true,
      })
    );
    if (enableSmaa) {
      effects.push(new SMAAEffect({ preset: SMAAPreset.MEDIUM }));
    }

    const effectPass = new EffectPass(camera, ...effects);
    composer.addPass(effectPass);

    return {
      render: (dt?: number) => {
        composer.render(dt);
      },
      setSize: (width: number, height: number) => {
        composer.setSize(Math.max(1, width), Math.max(1, height), false);
      },
      dispose: () => {
        composer.dispose();
      },
    };
  } catch {
    return {
      render: () => {
        renderer.render(scene, camera);
      },
      setSize: () => {},
      dispose: () => {},
    };
  }
}

export interface TroikaLabelOptions {
  text: string;
  position?: [number, number, number];
  fontSize?: number;
  color?: number | string;
  outlineWidth?: number;
  outlineColor?: number | string;
  anchorX?: 'left' | 'center' | 'right' | number;
  anchorY?: 'top' | 'middle' | 'bottom' | number;
  maxWidth?: number;
  onSync?: () => void;
}

function toCssColor(c: number | string | undefined, fallback: string): string {
  if (typeof c === 'number') {
    return `#${(c & 0xffffff).toString(16).padStart(6, '0')}`;
  }
  if (typeof c === 'string' && c.trim()) return c;
  return fallback;
}

export class BillboardTextLabel extends THREE.Group {
  public text: string;
  public fontSize: number;
  public color: number | string;
  public outlineWidth: number;
  public outlineColor: number | string;
  public anchorX: 'left' | 'center' | 'right' | number;
  public anchorY: 'top' | 'middle' | 'bottom' | number;
  public maxWidth?: number;

  private readonly plane: THREE.Mesh;
  private readonly mat: THREE.MeshBasicMaterial;
  private canvas: HTMLCanvasElement | null = null;
  private tex: THREE.CanvasTexture | null = null;
  private renderedKey = '';

  constructor(options: TroikaLabelOptions) {
    super();
    this.text = options.text ?? '';
    this.fontSize = options.fontSize ?? 0.3;
    this.color = options.color ?? 0xf8fafc;
    this.outlineWidth = options.outlineWidth ?? 0.025;
    this.outlineColor = options.outlineColor ?? 0x020617;
    this.anchorX = options.anchorX ?? 'center';
    this.anchorY = options.anchorY ?? 'middle';
    this.maxWidth = options.maxWidth;

    this.mat = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    const geo = new THREE.PlaneGeometry(1, 1);
    this.plane = new THREE.Mesh(geo, this.mat);
    this.plane.renderOrder = 25;
    this.add(this.plane);

    if (options.position) {
      this.position.set(options.position[0], options.position[1], options.position[2]);
    }
    this.userData.isBillboardLabel = true;
    this.userData.lastText = this.text;
    this.userData.lastColor = this.color;
    this.sync(options.onSync);
  }

  public sync(onSync?: () => void): void {
    const cleanText = String(this.text ?? '');
    const fillCss = toCssColor(this.color, '#f8fafc');
    const key = `${cleanText}|${fillCss}|${this.fontSize}|${this.anchorX}|${this.anchorY}|${this.maxWidth ?? ''}`;
    if (key === this.renderedKey) {
      onSync?.();
      return;
    }
    this.renderedKey = key;

    if (!cleanText.trim()) {
      this.plane.visible = false;
      onSync?.();
      return;
    }
    this.plane.visible = true;

    if (typeof document === 'undefined') {
      onSync?.();
      return;
    }

    const pxFont = 96;
    const fontFamily = `'Inter', 'Segoe UI', 'Noto Sans', 'DejaVu Sans', system-ui, -apple-system, sans-serif`;
    const fontStr = `600 ${pxFont}px ${fontFamily}`;

    const canvas = this.canvas || document.createElement('canvas');
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      onSync?.();
      return;
    }

    ctx.font = fontStr;
    const rawLines = cleanText.split('\n');
    let lines = rawLines;
    if (this.maxWidth && this.maxWidth > 0) {
      const worldPerPx = this.fontSize / pxFont;
      const maxPxW = this.maxWidth / Math.max(0.0001, worldPerPx);
      const wrapped: string[] = [];
      for (const raw of rawLines) {
        const words = raw.split(' ');
        let cur = '';
        for (const w of words) {
          const test = cur ? `${cur} ${w}` : w;
          if (ctx.measureText(test).width > maxPxW && cur) {
            wrapped.push(cur);
            cur = w;
          } else {
            cur = test;
          }
        }
        if (cur) wrapped.push(cur);
      }
      if (wrapped.length > 0) lines = wrapped;
    }

    const lineHeight = Math.round(pxFont * 1.28);
    const maxTextW = Math.max(
      40,
      ...lines.map((l) => Math.ceil(ctx.measureText(l).width))
    );
    const padX = 44;
    const padY = 26;
    const cw = Math.max(128, maxTextW + padX * 2);
    const ch = Math.max(88, lines.length * lineHeight + padY * 2);

    canvas.width = cw;
    canvas.height = ch;
    ctx.clearRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Crisp high-contrast dark slate plate with clean hairline accent border
    const r = 24;
    ctx.beginPath();
    ctx.roundRect(6, 6, cw - 12, ch - 12, r);
    ctx.fillStyle = 'rgba(6, 11, 23, 0.93)';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = fillCss;
    ctx.globalAlpha = 0.65;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.font = fontStr;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;

    const outlineCss = toCssColor(this.outlineColor, '#020617');
    for (let i = 0; i < lines.length; i++) {
      const ly = padY + (i + 0.52) * lineHeight;
      ctx.lineWidth = Math.max(3, Math.round(pxFont * 0.065));
      ctx.strokeStyle = outlineCss;
      ctx.strokeText(lines[i], cw / 2, ly);
      ctx.fillStyle = fillCss;
      ctx.fillText(lines[i], cw / 2, ly);
    }

    if (this.tex) {
      this.tex.dispose();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    this.tex = tex;
    this.mat.map = tex;
    this.mat.needsUpdate = true;

    const worldH = (ch / pxFont) * this.fontSize * 1.06;
    const worldW = (cw / ch) * worldH;
    this.plane.scale.set(worldW, worldH, 1);

    let ox = 0;
    if (this.anchorX === 'left') ox = worldW * 0.5;
    else if (this.anchorX === 'right') ox = -worldW * 0.5;
    let oy = 0;
    if (this.anchorY === 'top') oy = -worldH * 0.5;
    else if (this.anchorY === 'bottom') oy = worldH * 0.5;
    this.plane.position.set(ox, oy, 0);

    onSync?.();
  }

  public dispose(): void {
    if (this.tex) {
      this.tex.dispose();
      this.tex = null;
    }
    this.plane.geometry.dispose();
    this.mat.dispose();
  }
}

export function createTroikaLabel(options: TroikaLabelOptions): BillboardTextLabel {
  return new BillboardTextLabel(options);
}

export function updateBillboardLabels(root: THREE.Object3D, camera: THREE.Camera): void {
  root.traverse((obj) => {
    if (obj.userData && obj.userData.isBillboardLabel) {
      obj.quaternion.copy(camera.quaternion);
    }
  });
}

export interface LeaderArrowOptions {
  text: string;
  labelPos: [number, number, number];
  anchorPos: [number, number, number];
  color?: number;
  fontSize?: number;
  maxWidth?: number;
}

export class LeaderArrowLabel extends THREE.Group {
  public readonly label: BillboardTextLabel;
  private readonly line: THREE.Line;
  private readonly dot: THREE.Mesh;
  private readonly arrow: THREE.Mesh;
  private readonly linePositions: Float32Array;
  private readonly tmpDir = new THREE.Vector3();
  private readonly upVec = new THREE.Vector3(0, 1, 0);
  private readonly aVec = new THREE.Vector3();
  private readonly lVec = new THREE.Vector3();
  private readonly startVec = new THREE.Vector3();

  constructor(options: LeaderArrowOptions) {
    super();
    const color = options.color ?? 0x7dd3fc;

    this.label = new BillboardTextLabel({
      text: options.text,
      position: options.labelPos,
      fontSize: options.fontSize ?? 0.21,
      color,
      maxWidth: options.maxWidth ?? 2.8,
    });
    this.add(this.label);

    this.linePositions = new Float32Array(6);
    const lineGeo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(this.linePositions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute('position', posAttr);
    const lineMat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.86,
      depthTest: false,
    });
    this.line = new THREE.Line(lineGeo, lineMat);
    this.line.renderOrder = 18;
    this.add(this.line);

    this.dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.048, 12, 10),
      new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.95 })
    );
    this.dot.renderOrder = 20;
    this.add(this.dot);

    this.arrow = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.17, 12),
      new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.96 })
    );
    this.arrow.renderOrder = 21;
    this.add(this.arrow);

    this.setEndpoints(options.labelPos, options.anchorPos);
  }

  public setEndpoints(
    labelPos: [number, number, number] | THREE.Vector3,
    anchorPos: [number, number, number] | THREE.Vector3
  ): void {
    if (Array.isArray(labelPos)) this.lVec.set(labelPos[0], labelPos[1], labelPos[2]);
    else this.lVec.copy(labelPos);

    if (Array.isArray(anchorPos)) this.aVec.set(anchorPos[0], anchorPos[1], anchorPos[2]);
    else this.aVec.copy(anchorPos);

    this.label.position.copy(this.lVec);
    this.dot.position.copy(this.aVec);

    this.tmpDir.subVectors(this.aVec, this.lVec);
    const dist = this.tmpDir.length();
    if (dist > 0.001) {
      this.tmpDir.divideScalar(dist);
      // Offset line start slightly away from text center so line emerges cleanly from badge rim
      const trimStart = Math.min(0.32, dist * 0.25);
      this.startVec.copy(this.lVec).addScaledVector(this.tmpDir, trimStart);
      this.arrow.position.copy(this.aVec).addScaledVector(this.tmpDir, -0.09);
      this.arrow.quaternion.setFromUnitVectors(this.upVec, this.tmpDir);
      this.arrow.visible = dist > 0.22;
    } else {
      this.startVec.copy(this.lVec);
      this.arrow.position.copy(this.aVec);
      this.arrow.visible = false;
    }

    this.linePositions[0] = this.startVec.x;
    this.linePositions[1] = this.startVec.y;
    this.linePositions[2] = this.startVec.z;
    this.linePositions[3] = this.aVec.x;
    this.linePositions[4] = this.aVec.y;
    this.linePositions[5] = this.aVec.z;

    const attr = this.line.geometry.getAttribute('position') as THREE.BufferAttribute;
    attr.needsUpdate = true;
    this.line.geometry.computeBoundingSphere();
  }

  public dispose(): void {
    this.label.dispose();
    this.line.geometry.dispose();
    (this.line.material as THREE.Material).dispose();
    this.dot.geometry.dispose();
    (this.dot.material as THREE.Material).dispose();
    this.arrow.geometry.dispose();
    (this.arrow.material as THREE.Material).dispose();
  }
}

export function createLeaderArrowLabel(options: LeaderArrowOptions): LeaderArrowLabel {
  return new LeaderArrowLabel(options);
}

export interface CrispLine2Options {
  color?: number;
  linewidth?: number;
  dashed?: boolean;
  dashSize?: number;
  gapSize?: number;
  transparent?: boolean;
  opacity?: number;
}

export function createCrispLine2(
  points: Array<THREE.Vector3 | [number, number, number]>,
  options: CrispLine2Options = {}
): Line2 {
  const positions: number[] = [];
  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    if (Array.isArray(pt)) {
      positions.push(pt[0], pt[1], pt[2]);
    } else {
      positions.push(pt.x, pt.y, pt.z);
    }
  }
  if (positions.length < 6) {
    positions.push(0, 0, 0, 0, 0, 0);
  }

  const geometry = new LineGeometry();
  geometry.setPositions(positions);

  const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const h = typeof window !== 'undefined' ? window.innerHeight : 720;

  const material = new LineMaterial({
    color: options.color ?? 0x38bdf8,
    linewidth: options.linewidth ?? 2.2,
    dashed: Boolean(options.dashed),
    dashSize: options.dashSize ?? 0.25,
    gapSize: options.gapSize ?? 0.14,
    transparent: options.transparent ?? (options.opacity !== undefined && options.opacity < 1),
    opacity: options.opacity ?? 1,
    worldUnits: false,
  });
  material.resolution.set(w, h);

  const line = new Line2(geometry, material);
  line.computeLineDistances();
  line.userData.isLine2 = true;
  return line;
}

export function syncLine2Resolution(root: THREE.Object3D, width: number, height: number): void {
  const safeW = Math.max(1, width);
  const safeH = Math.max(1, height);
  root.traverse((obj) => {
    if ((obj as Line2).isLine2) {
      const mat = (obj as Line2).material;
      if (mat && mat.resolution) {
        mat.resolution.set(safeW, safeH);
      }
    }
  });
}

const _dummy = new THREE.Object3D();
const _tmpColor = new THREE.Color();

export class GPUParticlePool {
  public readonly mesh: THREE.InstancedMesh;
  private readonly maxCount: number;
  private readonly posX: Float32Array;
  private readonly posY: Float32Array;
  private readonly posZ: Float32Array;
  private readonly velX: Float32Array;
  private readonly velY: Float32Array;
  private readonly velZ: Float32Array;
  private readonly life: Float32Array;
  private readonly maxLife: Float32Array;
  private readonly sizeScale: Float32Array;
  private cursor = 0;
  private readonly baseColor: number;
  private readonly altColor: number;

  constructor(
    maxCount = 96,
    radius = 0.05,
    primaryColor = 0x38bdf8,
    secondaryColor = 0xfacc15
  ) {
    this.maxCount = maxCount;
    this.baseColor = primaryColor;
    this.altColor = secondaryColor;
    this.posX = new Float32Array(maxCount);
    this.posY = new Float32Array(maxCount);
    this.posZ = new Float32Array(maxCount);
    this.velX = new Float32Array(maxCount);
    this.velY = new Float32Array(maxCount);
    this.velZ = new Float32Array(maxCount);
    this.life = new Float32Array(maxCount);
    this.maxLife = new Float32Array(maxCount);
    this.sizeScale = new Float32Array(maxCount);

    const geo = new THREE.SphereGeometry(radius, 8, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.mesh = new THREE.InstancedMesh(geo, mat, maxCount);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;

    _dummy.position.set(0, -9999, 0);
    _dummy.scale.setScalar(0);
    _dummy.updateMatrix();
    for (let i = 0; i < maxCount; i++) {
      this.mesh.setMatrixAt(i, _dummy.matrix);
      _tmpColor.setHex(i % 2 === 0 ? this.baseColor : this.altColor);
      this.mesh.setColorAt(i, _tmpColor);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  public spawn(
    x: number,
    y: number,
    z: number,
    vx = 0,
    vy = 0,
    vz = 0,
    lifetime = 0.65,
    scale = 1,
    colorHex?: number
  ): void {
    const idx = this.cursor;
    this.cursor = (this.cursor + 1) % this.maxCount;
    this.posX[idx] = x;
    this.posY[idx] = y;
    this.posZ[idx] = z;
    this.velX[idx] = vx;
    this.velY[idx] = vy;
    this.velZ[idx] = vz;
    this.life[idx] = Math.max(0.05, lifetime);
    this.maxLife[idx] = Math.max(0.05, lifetime);
    this.sizeScale[idx] = scale;

    _tmpColor.setHex(colorHex ?? (idx % 2 === 0 ? this.baseColor : this.altColor));
    this.mesh.setColorAt(idx, _tmpColor);
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  public update(dt: number, gravityY = 0): void {
    const clampedDt = Math.min(Math.max(dt, 0), 0.1);
    let anyDirty = false;
    for (let i = 0; i < this.maxCount; i++) {
      const rem = this.life[i];
      if (rem <= 0) continue;
      anyDirty = true;
      const next = rem - clampedDt;
      this.life[i] = next;
      if (next <= 0) {
        _dummy.position.set(0, -9999, 0);
        _dummy.scale.setScalar(0);
        _dummy.updateMatrix();
        this.mesh.setMatrixAt(i, _dummy.matrix);
        continue;
      }
      this.velY[i] += gravityY * clampedDt;
      this.posX[i] += this.velX[i] * clampedDt;
      this.posY[i] += this.velY[i] * clampedDt;
      this.posZ[i] += this.velZ[i] * clampedDt;

      const t = next / this.maxLife[i];
      _dummy.position.set(this.posX[i], this.posY[i], this.posZ[i]);
      _dummy.scale.setScalar(this.sizeScale[i] * Math.max(0.05, t));
      _dummy.updateMatrix();
      this.mesh.setMatrixAt(i, _dummy.matrix);
    }
    if (anyDirty) {
      this.mesh.instanceMatrix.needsUpdate = true;
    }
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    if (Array.isArray(this.mesh.material)) {
      this.mesh.material.forEach((m) => m.dispose());
    } else {
      this.mesh.material.dispose();
    }
  }
}

export class OptimizedTrail {
  public readonly line: THREE.Line;
  private readonly maxPoints: number;
  private readonly positions: Float32Array;
  private count = 0;
  private lastX = 0;
  private lastY = 0;
  private lastZ = 0;

  constructor(maxPoints = 64, colorHex = 0x38bdf8, opacity = 0.85) {
    this.maxPoints = maxPoints;
    this.positions = new Float32Array(maxPoints * 3);
    const geo = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(this.positions, 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', attr);
    geo.setDrawRange(0, 0);

    const mat = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: opacity < 1,
      opacity,
      depthWrite: false,
    });

    this.line = new THREE.Line(geo, mat);
    this.line.frustumCulled = false;
  }

  public pushAndRender(
    x: number,
    y: number,
    z: number,
    _camera?: THREE.Camera,
    minDist = 0.02,
    activeCap?: number
  ): void {
    const cap = activeCap ? Math.min(this.maxPoints, Math.max(2, activeCap)) : this.maxPoints;
    if (this.count > 0) {
      const dx = x - this.lastX;
      const dy = y - this.lastY;
      const dz = z - this.lastZ;
      if (dx * dx + dy * dy + dz * dz < minDist * minDist) {
        return;
      }
    }
    this.lastX = x;
    this.lastY = y;
    this.lastZ = z;

    if (this.count >= cap) {
      const shift = this.count - cap + 1;
      for (let i = 0; i < (cap - 1) * 3; i++) {
        this.positions[i] = this.positions[i + shift * 3];
      }
      this.count = cap - 1;
    }

    const offset = this.count * 3;
    this.positions[offset] = x;
    this.positions[offset + 1] = y;
    this.positions[offset + 2] = z;
    this.count += 1;

    const geo = this.line.geometry;
    const attr = geo.getAttribute('position') as THREE.BufferAttribute;
    attr.needsUpdate = true;
    geo.setDrawRange(0, this.count);
    this.line.visible = this.count >= 2;
  }

  public clear(): void {
    this.count = 0;
    this.line.geometry.setDrawRange(0, 0);
    this.line.visible = false;
  }

  public dispose(): void {
    this.line.geometry.dispose();
    if (Array.isArray(this.line.material)) {
      this.line.material.forEach((m) => m.dispose());
    } else {
      this.line.material.dispose();
    }
  }
}
