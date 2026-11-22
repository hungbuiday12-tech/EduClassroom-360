import * as THREE from 'three';
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
} from 'postprocessing';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { Text as TroikaText } from 'troika-three-text';

// ============================================================================
// 1. POSTPROCESSING PIPELINE (pmndrs/postprocessing: Bloom + SMAA)
// ============================================================================
export interface PostProcessPipeline {
  composer: EffectComposer;
  bloomEffect: BloomEffect;
  setSize: (width: number, height: number) => void;
  render: (delta?: number) => void;
  dispose: () => void;
}

export function createPostProcessingPipeline(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  options?: {
    bloomIntensity?: number;
    luminanceThreshold?: number;
    enableSmaa?: boolean;
  }
): PostProcessPipeline {
  const composer = new EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType,
  });

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomEffect = new BloomEffect({
    mipmapBlur: true,
    luminanceThreshold: options?.luminanceThreshold ?? 0.72,
    luminanceSmoothing: 0.18,
    intensity: options?.bloomIntensity ?? 0.52,
  });

  const effects: any[] = [bloomEffect];
  if (options?.enableSmaa !== false) {
    effects.push(new SMAAEffect({ preset: SMAAPreset.MEDIUM }));
  }

  const effectPass = new EffectPass(camera, ...effects);
  composer.addPass(effectPass);

  return {
    composer,
    bloomEffect,
    setSize: (width: number, height: number) => {
      if (width > 0 && height > 0) {
        composer.setSize(width, height, false);
      }
    },
    render: (delta?: number) => {
      composer.render(delta);
    },
    dispose: () => {
      composer.dispose();
    },
  };
}

// ============================================================================
// 2. TROIKA 3D TEXT LABELS + BILLBOARDING
// ============================================================================
export interface TroikaLabelOptions {
  text: string;
  position?: [number, number, number];
  fontSize?: number;
  color?: number | string;
  outlineColor?: number | string;
  outlineWidth?: number;
  anchorX?: 'left' | 'center' | 'right';
  anchorY?: 'top' | 'middle' | 'bottom';
  billboard?: boolean;
  onSync?: () => void;
}

export function createTroikaLabel(opts: TroikaLabelOptions): TroikaText {
  const label = new TroikaText();
  label.text = opts.text;
  label.fontSize = opts.fontSize ?? 0.34;
  label.color = opts.color ?? 0xf8fafc;
  label.anchorX = opts.anchorX ?? 'center';
  label.anchorY = opts.anchorY ?? 'middle';
  label.outlineColor = opts.outlineColor ?? 0x020617;
  label.outlineWidth = opts.outlineWidth ?? 0.04;
  label.outlineOpacity = 0.92;
  label.depthOffset = -1;
  label.renderOrder = 20;
  label.userData.isTroikaLabel = true;
  label.userData.billboard = opts.billboard !== false;
  if (opts.position) {
    label.position.set(opts.position[0], opts.position[1], opts.position[2]);
  }
  label.sync(() => {
    opts.onSync?.();
  });
  return label;
}

export function updateBillboardLabels(root: THREE.Object3D, camera: THREE.Camera): void {
  root.traverse((obj) => {
    if (obj.userData?.isTroikaLabel && obj.userData.billboard && obj.visible) {
      obj.quaternion.copy(camera.quaternion);
    }
  });
}

// ============================================================================
// 3. CRISP VARIABLE-WIDTH 3D LINE2 HELPER
// ============================================================================
export function createCrispLine2(
  points: [number, number, number][] | THREE.Vector3[],
  options?: {
    color?: number;
    linewidth?: number;
    dashed?: boolean;
    dashSize?: number;
    gapSize?: number;
    transparent?: boolean;
    opacity?: number;
    resolution?: [number, number];
  }
): Line2 {
  const flat: number[] = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (Array.isArray(p)) {
      flat.push(p[0], p[1], p[2]);
    } else {
      flat.push(p.x, p.y, p.z);
    }
  }
  const geometry = new LineGeometry();
  geometry.setPositions(flat);

  const [rw, rh] = options?.resolution ?? [
    typeof window !== 'undefined' ? window.innerWidth : 1024,
    typeof window !== 'undefined' ? window.innerHeight : 768,
  ];
  const material = new LineMaterial({
    color: options?.color ?? 0x38bdf8,
    linewidth: options?.linewidth ?? 2.6,
    dashed: Boolean(options?.dashed),
    dashSize: options?.dashSize ?? 0.25,
    gapSize: options?.gapSize ?? 0.14,
    transparent: Boolean(options?.transparent),
    opacity: options?.opacity ?? 1,
    worldUnits: false,
  });
  material.resolution.set(rw, rh);

  const line = new Line2(geometry, material);
  line.computeLineDistances();
  line.userData.isLine2 = true;
  return line;
}

export function syncLine2Resolution(root: THREE.Object3D, width: number, height: number): void {
  if (width <= 0 || height <= 0) return;
  root.traverse((obj: any) => {
    if (obj.userData?.isLine2 && obj.material?.resolution) {
      obj.material.resolution.set(width, height);
    }
  });
}

// ============================================================================
// 4. BOUNDED GPU INSTANCED PARTICLE POOL (MAX PARTICLES + LIFETIME, ZERO GC)
// ============================================================================
const _pDummy = new THREE.Object3D();
const _pColor = new THREE.Color();

export class GPUParticlePool {
  public readonly mesh: THREE.InstancedMesh;
  public readonly maxParticles: number;
  private readonly px: Float32Array;
  private readonly py: Float32Array;
  private readonly pz: Float32Array;
  private readonly vx: Float32Array;
  private readonly vy: Float32Array;
  private readonly vz: Float32Array;
  private readonly age: Float32Array;
  private readonly lifetime: Float32Array;
  private readonly baseScale: Float32Array;
  private readonly colorHex: Uint32Array;
  private cursor = 0;

  constructor(
    maxParticles = 96,
    baseRadius = 0.055,
    color = 0x38bdf8,
    emissive = 0x0ea5e9
  ) {
    this.maxParticles = Math.max(8, Math.min(256, maxParticles));
    const geo = new THREE.IcosahedronGeometry(baseRadius, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive,
      emissiveIntensity: 1.35,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    });
    this.mesh = new THREE.InstancedMesh(geo, mat, this.maxParticles);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;

    const n = this.maxParticles;
    this.px = new Float32Array(n);
    this.py = new Float32Array(n);
    this.pz = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.vz = new Float32Array(n);
    this.age = new Float32Array(n);
    this.lifetime = new Float32Array(n);
    this.baseScale = new Float32Array(n);
    this.colorHex = new Uint32Array(n);

    _pColor.setHex(color);
    _pDummy.scale.setScalar(0);
    _pDummy.updateMatrix();
    for (let i = 0; i < n; i++) {
      this.age[i] = 999;
      this.lifetime[i] = 1;
      this.colorHex[i] = color;
      this.mesh.setMatrixAt(i, _pDummy.matrix);
      this.mesh.setColorAt(i, _pColor);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  public spawn(
    x: number,
    y: number,
    z: number,
    vx: number,
    vy: number,
    vz: number,
    lifetime = 0.9,
    scale = 1.0,
    hex = 0x38bdf8
  ): void {
    const idx = this.cursor;
    this.cursor = (this.cursor + 1) % this.maxParticles;
    this.px[idx] = x;
    this.py[idx] = y;
    this.pz[idx] = z;
    this.vx[idx] = vx;
    this.vy[idx] = vy;
    this.vz[idx] = vz;
    this.age[idx] = 0;
    this.lifetime[idx] = Math.max(0.12, lifetime);
    this.baseScale[idx] = scale;
    this.colorHex[idx] = hex;
  }

  public update(dt: number, gravityY = 0): void {
    const n = this.maxParticles;
    let colorDirty = false;
    for (let i = 0; i < n; i++) {
      const life = this.lifetime[i];
      if (this.age[i] >= life) {
        _pDummy.scale.setScalar(0);
        _pDummy.updateMatrix();
        this.mesh.setMatrixAt(i, _pDummy.matrix);
        continue;
      }
      this.age[i] += dt;
      const tNorm = this.age[i] / life;
      if (tNorm >= 1) {
        _pDummy.scale.setScalar(0);
        _pDummy.updateMatrix();
        this.mesh.setMatrixAt(i, _pDummy.matrix);
        continue;
      }
      this.vy[i] += gravityY * dt;
      this.px[i] += this.vx[i] * dt;
      this.py[i] += this.vy[i] * dt;
      this.pz[i] += this.vz[i] * dt;

      const s = this.baseScale[i] * (1 - tNorm) * (tNorm < 0.15 ? tNorm / 0.15 : 1);
      _pDummy.position.set(this.px[i], this.py[i], this.pz[i]);
      _pDummy.scale.setScalar(Math.max(0.001, s));
      _pDummy.updateMatrix();
      this.mesh.setMatrixAt(i, _pDummy.matrix);

      _pColor.setHex(this.colorHex[i]);
      _pColor.multiplyScalar(1 - tNorm * 0.45);
      this.mesh.setColorAt(i, _pColor);
      colorDirty = true;
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    if (colorDirty && this.mesh.instanceColor) {
      this.mesh.instanceColor.needsUpdate = true;
    }
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}

// ============================================================================
// 5. OPTIMIZED RING-BUFFER TRAIL WITH CAMERA-DISTANCE LOD CULLING
// ============================================================================
export class OptimizedTrail {
  public readonly line: THREE.Line;
  public readonly maxPoints: number;
  private readonly buffer: Float32Array;
  private readonly drawPositions: Float32Array;
  private head = 0;
  private count = 0;
  private lastX = 0;
  private lastY = 0;
  private lastZ = 0;

  constructor(maxPoints = 64, color = 0x38bdf8, opacity = 0.85) {
    this.maxPoints = Math.max(16, Math.min(128, maxPoints));
    this.buffer = new Float32Array(this.maxPoints * 3);
    this.drawPositions = new Float32Array(this.maxPoints * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.drawPositions, 3));
    geo.setDrawRange(0, 0);
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
    });
    this.line = new THREE.Line(geo, mat);
    this.line.frustumCulled = false;
  }

  public clear(): void {
    this.head = 0;
    this.count = 0;
    this.line.geometry.setDrawRange(0, 0);
  }

  public pushAndRender(
    x: number,
    y: number,
    z: number,
    camera?: THREE.Camera,
    minStepSq = 0.015,
    maxLodDistance = 26
  ): void {
    if (this.count > 0) {
      const dx = x - this.lastX;
      const dy = y - this.lastY;
      const dz = z - this.lastZ;
      if (dx * dx + dy * dy + dz * dz >= minStepSq) {
        this.pushPoint(x, y, z);
      }
    } else {
      this.pushPoint(x, y, z);
    }

    // Distance-based LOD culling & point decimation
    let stride = 1;
    if (camera) {
      const cx = camera.position.x - x;
      const cy = camera.position.y - y;
      const cz = camera.position.z - z;
      const distSq = cx * cx + cy * cy + cz * cz;
      if (distSq > maxLodDistance * maxLodDistance) {
        this.line.visible = false;
        return;
      }
      if (distSq > (maxLodDistance * 0.6) ** 2) {
        stride = 2;
      }
    }
    this.line.visible = true;

    const total = this.count;
    if (total < 2) {
      this.line.geometry.setDrawRange(0, 0);
      return;
    }

    const start = (this.head - total + this.maxPoints) % this.maxPoints;
    let outIdx = 0;
    for (let i = 0; i < total; i += stride) {
      const ringIdx = ((start + i) % this.maxPoints) * 3;
      this.drawPositions[outIdx++] = this.buffer[ringIdx];
      this.drawPositions[outIdx++] = this.buffer[ringIdx + 1];
      this.drawPositions[outIdx++] = this.buffer[ringIdx + 2];
    }
    // Always include latest head point for continuity
    if ((total - 1) % stride !== 0) {
      const lastRing = ((this.head - 1 + this.maxPoints) % this.maxPoints) * 3;
      this.drawPositions[outIdx++] = this.buffer[lastRing];
      this.drawPositions[outIdx++] = this.buffer[lastRing + 1];
      this.drawPositions[outIdx++] = this.buffer[lastRing + 2];
    }

    const posAttr = this.line.geometry.attributes.position as THREE.BufferAttribute;
    posAttr.needsUpdate = true;
    this.line.geometry.setDrawRange(0, outIdx / 3);
  }

  private pushPoint(x: number, y: number, z: number): void {
    const idx = this.head * 3;
    this.buffer[idx] = x;
    this.buffer[idx + 1] = y;
    this.buffer[idx + 2] = z;
    this.lastX = x;
    this.lastY = y;
    this.lastZ = z;
    this.head = (this.head + 1) % this.maxPoints;
    if (this.count < this.maxPoints) {
      this.count++;
    }
  }

  public dispose(): void {
    this.line.geometry.dispose();
    (this.line.material as THREE.Material).dispose();
  }
}
