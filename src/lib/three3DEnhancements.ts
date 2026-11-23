import * as THREE from 'three';
import { Text as TroikaText } from 'troika-three-text';
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
  const { bloomIntensity = 0.4, luminanceThreshold = 0.78, enableSmaa = true } = options;

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

export function createTroikaLabel(options: TroikaLabelOptions): TroikaText {
  const label = new TroikaText();
  label.text = options.text;
  label.fontSize = options.fontSize ?? 0.3;
  label.color = options.color ?? 0xf8fafc;
  label.anchorX = options.anchorX ?? 'center';
  label.anchorY = options.anchorY ?? 'middle';
  label.outlineWidth = options.outlineWidth ?? 0.025;
  label.outlineColor = options.outlineColor ?? 0x020617;
  label.outlineOpacity = 0.85;
  label.depthOffset = -0.5;
  if (options.maxWidth !== undefined) {
    label.maxWidth = options.maxWidth;
  }
  if (options.position) {
    label.position.set(options.position[0], options.position[1], options.position[2]);
  }
  label.userData.isBillboardLabel = true;
  label.userData.lastText = options.text;
  label.userData.lastColor = label.color;
  label.sync(options.onSync);
  return label;
}

export function updateBillboardLabels(root: THREE.Object3D, camera: THREE.Camera): void {
  root.traverse((obj) => {
    if (obj.userData && obj.userData.isBillboardLabel) {
      obj.quaternion.copy(camera.quaternion);
    }
  });
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
