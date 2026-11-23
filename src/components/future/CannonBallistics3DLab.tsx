import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Crosshair,
  Eye,
  EyeOff,
  Flame,
  Gauge,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
  Volume2,
  VolumeX,
  Wind,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';

interface CannonBallistics3DLabProps {
  onEarnXP?: (xp: number) => void;
}

type GravityPreset = 'earth' | 'moon' | 'mars' | 'jupiter';
type CameraMode = 'orbit' | 'follow' | 'side' | 'cannon';

interface SimParams {
  pitchDeg: number;
  yawDeg: number;
  velocity: number;
  dragCoeff: number;
  windCross: number;
  windHead: number;
  gravity: number;
  gravityPreset: GravityPreset;
  timeScale: number;
}

interface TelemetryState {
  status: 'ready' | 'flying' | 'impacted';
  elapsed: number;
  speed: number;
  altitude: number;
  range: number;
  maxHeight: number;
  predictedRange: number;
  predictedMaxH: number;
  predictedFlightTime: number;
  vacuumRange: number;
  hits: number;
  shots: number;
  lastHitDistance: number | null;
  directHitBanner: string | null;
}

interface TargetConfig {
  id: number;
  x: number;
  z: number;
  radius: number;
}

const GRAVITY_VALUES: Record<GravityPreset, { g: number; vi: string; en: string }> = {
  earth: { g: 9.81, vi: 'Trái Đất (9.81)', en: 'Earth (9.81)' },
  moon: { g: 1.62, vi: 'Mặt Trăng (1.62)', en: 'Moon (1.62)' },
  mars: { g: 3.71, vi: 'Sao Hỏa (3.71)', en: 'Mars (3.71)' },
  jupiter: { g: 24.79, vi: 'Sao Mộc (24.8)', en: 'Jupiter (24.8)' }
};

const PREDICT_POINTS = 180;
const VACUUM_POINTS = 120;
const ACTIVE_TRAIL_MAX = 480;
const HISTORY_TRAIL_SLOTS = 4;
const PARTICLE_POOL_SIZE = 72;
const WIND_STREAK_COUNT = 32;
const CRATER_POOL_SIZE = 8;
const SHELL_MASS_KG = 12;

type BallisticScenarioId = 'ideal_vac' | 'high_drag' | 'lunar' | 'crosswind';

// Pre-allocated scratch vectors for zero per-frame GC
const SCRATCH_VEC_A = new THREE.Vector3();
const SCRATCH_VEC_B = new THREE.Vector3();
const SCRATCH_VEC_C = new THREE.Vector3();
const SCRATCH_MAT = new THREE.Matrix4();
const SCRATCH_QUAT = new THREE.Quaternion();
const SCRATCH_SCALE = new THREE.Vector3();
const SCRATCH_COLOR = new THREE.Color();

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = String(
      ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) || ''
    );
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|Software Rasterizer|WARP/i.test(rendererStr);
  } catch {
    return false;
  }
}

function createProvingGroundTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#071121';
  ctx.fillRect(0, 0, size, size);

  const grad = ctx.createRadialGradient(size * 0.5, size * 0.5, 16, size * 0.5, size * 0.5, size * 0.5);
  grad.addColorStop(0, '#0c223c');
  grad.addColorStop(0.55, '#081629');
  grad.addColorStop(1, '#040a16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Fine metric grid
  const step = size / 32;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.11)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= 32; i++) {
    const p = i * step;
    ctx.moveTo(p, 0);
    ctx.lineTo(p, size);
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
  }
  ctx.stroke();

  // Major crosshairs
  ctx.strokeStyle = 'rgba(45, 212, 191, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(size * 0.5, 0);
  ctx.lineTo(size * 0.5, size);
  ctx.moveTo(0, size * 0.5);
  ctx.lineTo(size, size * 0.5);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function computeMuzzleState(pitchDeg: number, yawDeg: number) {
  const pitch = THREE.MathUtils.degToRad(pitchDeg);
  const yaw = THREE.MathUtils.degToRad(-yawDeg);
  const pivotY = 1.48;
  const barrelLen = 3.25;
  // Cannon fires along +Z when yaw = 0
  const horiz = Math.cos(pitch) * barrelLen;
  const mx = Math.sin(yaw) * horiz;
  const my = pivotY + Math.sin(pitch) * barrelLen;
  const mz = Math.cos(yaw) * horiz;

  const dx = Math.sin(yaw) * Math.cos(pitch);
  const dy = Math.sin(pitch);
  const dz = Math.cos(yaw) * Math.cos(pitch);

  return {
    pos: { x: mx, y: my, z: mz },
    dir: { x: dx, y: dy, z: dz }
  };
}

function simulatePrediction(p: SimParams) {
  const { pos, dir } = computeMuzzleState(p.pitchDeg, p.yawDeg);
  const dt = 0.04;
  let x = pos.x;
  let y = pos.y;
  let z = pos.z;
  let vx = dir.x * p.velocity;
  let vy = dir.y * p.velocity;
  let vz = dir.z * p.velocity;

  const pts: { x: number; y: number; z: number }[] = [{ x, y, z }];
  let maxH = y;
  let t = 0;

  for (let i = 0; i < 650; i++) {
    const relVx = vx - p.windCross;
    const relVy = vy;
    const relVz = vz - p.windHead;
    const relSpd = Math.hypot(relVx, relVy, relVz);

    const dragFactor = p.dragCoeff * 0.0028 * relSpd;
    const ax = -dragFactor * relVx;
    const ay = -p.gravity - dragFactor * relVy;
    const az = -dragFactor * relVz;

    vx += ax * dt;
    vy += ay * dt;
    vz += az * dt;

    const prevX = x;
    const prevY = y;
    const prevZ = z;
    x += vx * dt;
    y += vy * dt;
    z += vz * dt;
    t += dt;

    if (y > maxH) maxH = y;

    if (y <= 0.18) {
      const frac = THREE.MathUtils.clamp((prevY - 0.18) / Math.max(0.0001, prevY - y), 0, 1);
      const ix = THREE.MathUtils.lerp(prevX, x, frac);
      const iz = THREE.MathUtils.lerp(prevZ, z, frac);
      pts.push({ x: ix, y: 0.18, z: iz });
      t = t - dt + dt * frac;
      break;
    }
    pts.push({ x, y, z });
  }

  const last = pts[pts.length - 1];
  const range = Math.hypot(last.x, last.z);

  // Ideal vacuum formula from ground height y0
  const vy0 = dir.y * p.velocity;
  const vHoriz0 = Math.hypot(dir.x, dir.z) * p.velocity;
  const tVac =
    (vy0 + Math.sqrt(Math.max(0, vy0 * vy0 + 2 * p.gravity * pos.y))) / Math.max(0.1, p.gravity);
  const vacuumRange = vHoriz0 * tVac;

  const vacPts: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i < VACUUM_POINTS; i++) {
    const f = i / (VACUUM_POINTS - 1);
    const ti = f * tVac;
    vacPts.push({
      x: pos.x + dir.x * p.velocity * ti,
      y: Math.max(0.16, pos.y + vy0 * ti - 0.5 * p.gravity * ti * ti),
      z: pos.z + dir.z * p.velocity * ti
    });
  }

  return {
    pts,
    vacPts,
    range,
    maxH,
    flightTime: t,
    vacuumRange,
    impactPos: last
  };
}

export const CannonBallistics3DLab: React.FC<CannonBallistics3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode } = useBackgroundTheme();

  const mountRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  mutedRef.current = muted;

  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVacuumArc, setShowVacuumArc] = useState(true);
  const showVacuumArcRef = useRef(true);
  showVacuumArcRef.current = showVacuumArc;

  const [cameraMode, setCameraMode] = useState<CameraMode>('orbit');
  const cameraModeRef = useRef<CameraMode>('orbit');
  cameraModeRef.current = cameraMode;

  const [webglError, setWebglError] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const [params, setParams] = useState<SimParams>({
    pitchDeg: 42,
    yawDeg: 0,
    velocity: 42,
    dragCoeff: 0.45,
    windCross: 0,
    windHead: 0,
    gravity: 9.81,
    gravityPreset: 'earth',
    timeScale: 1
  });
  const paramsRef = useRef<SimParams>(params);
  paramsRef.current = params;

  const [targets, setTargets] = useState<TargetConfig[]>([
    { id: 1, x: 0, z: 75, radius: 4.5 },
    { id: 2, x: -24, z: 130, radius: 5.0 },
    { id: 3, x: 26, z: 185, radius: 5.5 }
  ]);
  const targetsRef = useRef<TargetConfig[]>(targets);
  targetsRef.current = targets;

  const prediction = useMemo(() => simulatePrediction(params), [params]);

  const [telemetry, setTelemetry] = useState<TelemetryState>(() => ({
    status: 'ready',
    elapsed: 0,
    speed: params.velocity,
    altitude: 1.5,
    range: 0,
    maxHeight: 0,
    predictedRange: prediction.range,
    predictedMaxH: prediction.maxH,
    predictedFlightTime: prediction.flightTime,
    vacuumRange: prediction.vacuumRange,
    hits: 0,
    shots: 0,
    lastHitDistance: null,
    directHitBanner: null
  }));

  useEffect(() => {
    setTelemetry((prev) => ({
      ...prev,
      predictedRange: prediction.range,
      predictedMaxH: prediction.maxH,
      predictedFlightTime: prediction.flightTime,
      vacuumRange: prediction.vacuumRange
    }));
  }, [prediction]);

  const playArtillerySfx = useCallback((kind: 'fire' | 'impact' | 'hit') => {
    if (mutedRef.current) return;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      const now = ctx.currentTime;

      if (kind === 'fire') {
        // Low cannon boom sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(145, now);
        osc.frequency.exponentialRampToValueAtTime(34, now + 0.34);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);

        // Filtered propellant noise burst
        const len = Math.floor(ctx.sampleRate * 0.28);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(650, now);
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.28, now);
        ng.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        noise.connect(lp).connect(ng).connect(ctx.destination);
        noise.start(now);
      } else if (kind === 'impact') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(92, now);
        osc.frequency.exponentialRampToValueAtTime(24, now + 0.32);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      } else {
        // Direct target hit metallic bell
        [660, 990, 1320].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          g.gain.setValueAtTime(0.14, now + idx * 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.45 + idx * 0.05);
          osc.connect(g).connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + 0.5 + idx * 0.05);
        });
      }
    } catch {}
  }, []);

  // Bridge refs for imperative scene actions
  const fireFnRef = useRef<((overridePitch?: number) => void) | null>(null);
  const clearTrailsFnRef = useRef<(() => void) | null>(null);
  const resetCamFnRef = useRef<(() => void) | null>(null);
  const applyCamModeFnRef = useRef<((mode: CameraMode) => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && perfMode !== 'smooth',
        powerPreference: 'high-performance'
      });
    } catch {
      setWebglError(true);
      return;
    }

    const hostDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const dpr = isSoftwareGl
      ? 1
      : perfMode === 'smooth'
      ? Math.min(hostDpr, 1.15)
      : Math.min(hostDpr, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth || 960, container.clientHeight || 620);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isSoftwareGl && perfMode !== 'smooth';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b18);
    scene.fog = new THREE.FogExp2(0x050b18, 0.0026);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(
      50,
      (container.clientWidth || 960) / (container.clientHeight || 620),
      0.3,
      900
    );
    camera.position.set(-22, 14, -18);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 6;
    controls.maxDistance = 320;
    controls.target.set(0, 3.5, 42);
    controls.update();

    // Three-point + outdoor daylight setup
    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x1e293b, 0.72);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.1);
    keyLight.position.set(35, 65, 25);
    if (renderer.shadowMap.enabled) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 5;
      keyLight.shadow.camera.far = 220;
      keyLight.shadow.camera.left = -40;
      keyLight.shadow.camera.right = 40;
      keyLight.shadow.camera.top = 120;
      keyLight.shadow.camera.bottom = -40;
      keyLight.shadow.bias = -0.0004;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    rimLight.position.set(-40, 22, -35);
    scene.add(rimLight);

    const flashLight = new THREE.PointLight(0xff9e3d, 0, 26, 2);
    scene.add(flashLight);

    // Proving ground floor
    const groundTex = createProvingGroundTexture();
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.88,
      metalness: 0.14
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(540, 540), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, 120);
    ground.receiveShadow = renderer.shadowMap.enabled;
    scene.add(ground);

    // Range distance arc rings centered at cannon (50m, 100m, 150m, 200m, 250m)
    const rangeRingMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.34
    });
    [50, 100, 150, 200, 250].forEach((radius) => {
      const pts: THREE.Vector3[] = [];
      for (let i = -36; i <= 36; i++) {
        const a = (i / 36) * (Math.PI * 0.42);
        pts.push(new THREE.Vector3(Math.sin(a) * radius, 0.06, Math.cos(a) * radius));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      scene.add(new THREE.Line(geo, rangeRingMat));
    });

    // Distant horizon mountain silhouettes
    const mountainGroup = new THREE.Group();
    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x0b172c,
      roughness: 0.95,
      metalness: 0.05
    });
    for (let i = 0; i < 26; i++) {
      const ang = (i / 26) * Math.PI * 2;
      const dist = 290 + (i % 3) * 35;
      const h = 18 + ((i * 19) % 28);
      const r = 24 + ((i * 13) % 22);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 6), mountainMat);
      cone.position.set(Math.sin(ang) * dist, h * 0.45, 90 + Math.cos(ang) * dist);
      cone.rotation.y = i * 0.6;
      mountainGroup.add(cone);
    }
    scene.add(mountainGroup);

    // Firing pad pedestal grounded flush at y = 0
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.55,
      metalness: 0.62
    });
    const firingPad = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.1, 0.22, 32), padMat);
    firingPad.position.set(0, 0.11, 0);
    firingPad.receiveShadow = renderer.shadowMap.enabled;
    scene.add(firingPad);

    const padTrim = new THREE.Mesh(
      new THREE.TorusGeometry(3.62, 0.06, 12, 48),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.55,
        roughness: 0.25,
        metalness: 0.8
      })
    );
    padTrim.rotation.x = Math.PI / 2;
    padTrim.position.y = 0.22;
    scene.add(padTrim);

    // ==================== COMPOSITE 3D ARTILLERY CANNON ====================
    const cannonRoot = new THREE.Group();
    cannonRoot.position.set(0, 0.22, 0); // rests cleanly on firing pad
    scene.add(cannonRoot);

    const turntableGroup = new THREE.Group();
    cannonRoot.add(turntableGroup);

    const steelDarkMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.36,
      metalness: 0.82
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4a348,
      roughness: 0.26,
      metalness: 0.9
    });
    const gunmetalMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.24,
      metalness: 0.92
    });
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.15
    });

    // Carriage side rails
    [-0.58, 0.58].forEach((sideX) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.38, 2.3), steelDarkMat);
      rail.position.set(sideX, 0.78, -0.35);
      rail.rotation.x = 0.14;
      rail.castShadow = renderer.shadowMap.enabled;
      turntableGroup.add(rail);

      const cheek = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.62, 0.78), steelDarkMat);
      cheek.position.set(sideX, 1.04, 0.05);
      cheek.castShadow = renderer.shadowMap.enabled;
      turntableGroup.add(cheek);
    });

    // Rear stabilizing trail beam & ground spade
    const trailBeam = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 2.0), steelDarkMat);
    trailBeam.position.set(0, 0.44, -1.75);
    trailBeam.rotation.x = 0.28;
    trailBeam.castShadow = renderer.shadowMap.enabled;
    turntableGroup.add(trailBeam);

    const spade = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.28, 0.16), brassMat);
    spade.position.set(0, 0.14, -2.62);
    turntableGroup.add(spade);

    // Axle & Dual Spoked Artillery Wheels (radius 0.72, resting flush at y = 0 on pad)
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.35, 16), brassMat);
    axle.rotation.z = Math.PI / 2;
    axle.position.set(0, 0.72, 0.12);
    turntableGroup.add(axle);

    const wheelMeshes: THREE.Group[] = [];
    [-1.08, 1.08].forEach((wx) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(wx, 0.72, 0.12);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.09, 14, 32), tireMat);
      rim.rotation.y = Math.PI / 2;
      rim.castShadow = renderer.shadowMap.enabled;
      wGroup.add(rim);

      const innerBand = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.03, 10, 32), brassMat);
      innerBand.rotation.y = Math.PI / 2;
      wGroup.add(innerBand);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.24, 16), brassMat);
      hub.rotation.z = Math.PI / 2;
      wGroup.add(hub);

      for (let s = 0; s < 6; s++) {
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 1.12, 8), steelDarkMat);
        spoke.rotation.x = (s * Math.PI) / 6;
        wGroup.add(spoke);
      }
      turntableGroup.add(wGroup);
      wheelMeshes.push(wGroup);
    });

    // Elevation gear sector arc
    const elevGear = new THREE.Mesh(
      new THREE.TorusGeometry(0.75, 0.045, 10, 24, Math.PI * 0.55),
      brassMat
    );
    elevGear.rotation.y = Math.PI / 2;
    elevGear.position.set(0.42, 1.26, 0.0);
    turntableGroup.add(elevGear);

    // Barrel elevation pivot & recoil assembly
    const barrelPivotGroup = new THREE.Group();
    barrelPivotGroup.position.set(0, 1.26, 0.05);
    turntableGroup.add(barrelPivotGroup);

    const barrelRecoilGroup = new THREE.Group();
    barrelPivotGroup.add(barrelRecoilGroup);

    // Tapered artillery barrel profile via LatheGeometry (aligned along +Z via rotation.x = +Math.PI/2)
    const lathePoints = [
      new THREE.Vector2(0.01, -0.92),
      new THREE.Vector2(0.24, -0.88),
      new THREE.Vector2(0.38, -0.62),
      new THREE.Vector2(0.36, 0.15),
      new THREE.Vector2(0.29, 1.25),
      new THREE.Vector2(0.24, 2.35),
      new THREE.Vector2(0.30, 2.55),
      new THREE.Vector2(0.26, 2.66),
      new THREE.Vector2(0.17, 2.66),
      new THREE.Vector2(0.16, 2.15)
    ];
    const barrelGeo = new THREE.LatheGeometry(lathePoints, 28);
    barrelGeo.rotateX(Math.PI / 2);
    const barrelMesh = new THREE.Mesh(barrelGeo, gunmetalMat);
    barrelMesh.castShadow = renderer.shadowMap.enabled;
    barrelRecoilGroup.add(barrelMesh);

    // Brass reinforcing rings along barrel
    [-0.55, 0.25, 1.35, 2.48].forEach((bz, idx) => {
      const rad = [0.39, 0.36, 0.29, 0.295][idx];
      const band = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.032, 12, 28), brassMat);
      band.position.z = bz;
      barrelRecoilGroup.add(band);
    });

    // Glowing plasma accelerator ring near muzzle
    const muzzleGlowRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.26, 0.025, 10, 28),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 1.4,
        roughness: 0.2
      })
    );
    muzzleGlowRing.position.z = 2.62;
    barrelRecoilGroup.add(muzzleGlowRing);

    // Hydraulic recoil piston cylinder beneath barrel
    const recoilPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.25, 14), brassMat);
    recoilPiston.rotation.x = Math.PI / 2;
    recoilPiston.position.set(0, -0.32, 0.55);
    barrelPivotGroup.add(recoilPiston);

    // Wind vane pole + swaying pennant beside cannon
    const windPoleGroup = new THREE.Group();
    windPoleGroup.position.set(-5.2, 0, 2.5);
    scene.add(windPoleGroup);
    const poleMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 4.2, 10), steelDarkMat);
    poleMesh.position.y = 2.1;
    windPoleGroup.add(poleMesh);
    const flagPivot = new THREE.Group();
    flagPivot.position.set(0, 3.9, 0);
    windPoleGroup.add(flagPivot);
    const flagMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.55, 0.04),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.35,
        roughness: 0.5
      })
    );
    flagMesh.position.x = 0.78;
    flagPivot.add(flagMesh);

    // ==================== INTERACTIVE ARMORED TARGETS ====================
    const targetGroups: { group: THREE.Group; ringMat: THREE.MeshStandardMaterial; hitTimer: number }[] = [];
    const targetsContainer = new THREE.Group();
    scene.add(targetsContainer);

    const rebuildTargetMeshes = (list: TargetConfig[]) => {
      while (targetsContainer.children.length > 0) {
        const ch = targetsContainer.children[0];
        targetsContainer.remove(ch);
      }
      targetGroups.length = 0;

      list.forEach((tCfg) => {
        const tg = new THREE.Group();
        tg.position.set(tCfg.x, 0, tCfg.z);

        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(tCfg.radius * 0.78, tCfg.radius * 0.92, 0.35, 24),
          steelDarkMat
        );
        base.position.y = 0.175;
        base.receiveShadow = renderer.shadowMap.enabled;
        tg.add(base);

        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xf43f5e,
          emissive: 0xe11d48,
          emissiveIntensity: 0.85,
          roughness: 0.25,
          metalness: 0.5
        });

        const groundRing = new THREE.Mesh(new THREE.TorusGeometry(tCfg.radius, 0.14, 12, 40), ringMat);
        groundRing.rotation.x = Math.PI / 2;
        groundRing.position.y = 0.16;
        tg.add(groundRing);

        const shieldBoard = new THREE.Mesh(
          new THREE.CylinderGeometry(tCfg.radius * 0.58, tCfg.radius * 0.58, 0.24, 24),
          new THREE.MeshStandardMaterial({
            color: 0xfef3c7,
            roughness: 0.4,
            metalness: 0.3
          })
        );
        shieldBoard.rotation.x = Math.PI / 2;
        shieldBoard.position.set(0, tCfg.radius * 0.65, 0);
        tg.add(shieldBoard);

        const bullseye = new THREE.Mesh(
          new THREE.TorusGeometry(tCfg.radius * 0.36, 0.1, 10, 32),
          ringMat
        );
        bullseye.position.set(0, tCfg.radius * 0.65, -0.13);
        tg.add(bullseye);

        targetsContainer.add(tg);
        targetGroups.push({ group: tg, ringMat, hitTimer: 0 });
      });
    };
    rebuildTargetMeshes(targetsRef.current);

    // ==================== TRAJECTORY ARCS & RETICLE ====================
    const predPositions = new Float32Array(PREDICT_POINTS * 3);
    const predGeo = new THREE.BufferGeometry();
    predGeo.setAttribute('position', new THREE.BufferAttribute(predPositions, 3));
    const predLine = new THREE.Line(
      predGeo,
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.92
      })
    );
    scene.add(predLine);

    const vacPositions = new Float32Array(VACUUM_POINTS * 3);
    const vacGeo = new THREE.BufferGeometry();
    vacGeo.setAttribute('position', new THREE.BufferAttribute(vacPositions, 3));
    const vacLine = new THREE.Line(
      vacGeo,
      new THREE.LineDashedMaterial({
        color: 0xfbbf24,
        dashSize: 2.2,
        gapSize: 1.4,
        transparent: true,
        opacity: 0.72
      })
    );
    scene.add(vacLine);

    // Apex marker & ground landing reticle
    const apexMarker = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.65, 0),
      new THREE.MeshStandardMaterial({
        color: 0x2dd4bf,
        emissive: 0x14b8a6,
        emissiveIntensity: 0.9,
        roughness: 0.2
      })
    );
    scene.add(apexMarker);

    const landingReticleGroup = new THREE.Group();
    const reticleOuter = new THREE.Mesh(
      new THREE.RingGeometry(1.7, 2.1, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    reticleOuter.rotation.x = -Math.PI / 2;
    landingReticleGroup.add(reticleOuter);
    const reticleInner = new THREE.Mesh(
      new THREE.RingGeometry(0.45, 0.75, 24),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    reticleInner.rotation.x = -Math.PI / 2;
    landingReticleGroup.add(reticleInner);
    landingReticleGroup.position.y = 0.08;
    scene.add(landingReticleGroup);

    // Active cannonball projectile
    const shellMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 18, 18),
      new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xf97316,
        emissiveIntensity: 1.5,
        roughness: 0.22,
        metalness: 0.85
      })
    );
    shellMesh.visible = false;
    scene.add(shellMesh);

    const shellLight = new THREE.PointLight(0xff8c1a, 0, 18, 2);
    scene.add(shellLight);

    // Active flight trail (zero GC)
    const activeTrailArr = new Float32Array(ACTIVE_TRAIL_MAX * 3);
    const activeTrailGeo = new THREE.BufferGeometry();
    activeTrailGeo.setAttribute('position', new THREE.BufferAttribute(activeTrailArr, 3));
    activeTrailGeo.setDrawRange(0, 0);
    const activeTrailLine = new THREE.Line(
      activeTrailGeo,
      new THREE.LineBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.95 })
    );
    scene.add(activeTrailLine);

    // Ring pool of historical trails so students can compare angles (30 / 45 / 60 deg)
    const historyTrails: {
      arr: Float32Array;
      geo: THREE.BufferGeometry;
      line: THREE.Line;
      count: number;
    }[] = [];
    const historyColors = [0xa78bfa, 0x34d399, 0xf472b6, 0x60a5fa];
    for (let i = 0; i < HISTORY_TRAIL_SLOTS; i++) {
      const arr = new Float32Array(ACTIVE_TRAIL_MAX * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      geo.setDrawRange(0, 0);
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({
          color: historyColors[i % historyColors.length],
          transparent: true,
          opacity: 0.55
        })
      );
      scene.add(line);
      historyTrails.push({ arr, geo, line, count: 0 });
    }
    let nextHistorySlot = 0;

    // Ground impact shockwave ring
    const impactRingMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const impactRing = new THREE.Mesh(new THREE.RingGeometry(0.8, 1.5, 36), impactRingMat);
    impactRing.rotation.x = -Math.PI / 2;
    impactRing.visible = false;
    scene.add(impactRing);

    // Persistent Ground Impact Crater Ring Pool (shows shot dispersion)
    const craterGeo = new THREE.RingGeometry(0.9, 1.9, 24);
    craterGeo.rotateX(-Math.PI / 2);
    const craterMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.62,
      side: THREE.DoubleSide
    });
    const craters: THREE.Mesh[] = [];
    for (let i = 0; i < CRATER_POOL_SIZE; i++) {
      const c = new THREE.Mesh(craterGeo, craterMat);
      c.visible = false;
      scene.add(c);
      craters.push(c);
    }
    let craterCursor = 0;

    // 3D Aerodynamic Wind-Stream Streaks Pool
    const windGeo = new THREE.BoxGeometry(2.6, 0.05, 0.05);
    const windMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.42
    });
    const windInstanced = new THREE.InstancedMesh(windGeo, windMat, WIND_STREAK_COUNT);
    windInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(windInstanced);
    const windStreaks = Array.from({ length: WIND_STREAK_COUNT }, (_, idx) => ({
      x: ((idx * 17) % 140) - 70,
      y: 3 + ((idx * 11) % 30),
      z: 10 + ((idx * 23) % 190)
    }));

    // Pre-allocated InstancedMesh particle pool (Muzzle Smoke + Impact Embers)
    const particleGeo = new THREE.IcosahedronGeometry(0.32, 0);
    const particleMat = new THREE.MeshStandardMaterial({
      roughness: 0.65,
      metalness: 0.1,
      transparent: true,
      opacity: 0.92
    });
    const particleInstanced = new THREE.InstancedMesh(particleGeo, particleMat, PARTICLE_POOL_SIZE);
    particleInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(particleInstanced);

    const particles = Array.from({ length: PARTICLE_POOL_SIZE }, () => ({
      active: false,
      x: 0,
      y: -50,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      life: 0,
      maxLife: 1,
      scale: 1,
      r: 1,
      g: 0.6,
      b: 0.2
    }));
    let particleCursor = 0;

    // Hide all particles initially
    SCRATCH_SCALE.set(0, 0, 0);
    SCRATCH_MAT.compose(SCRATCH_VEC_A.set(0, -50, 0), SCRATCH_QUAT.identity(), SCRATCH_SCALE);
    for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
      particleInstanced.setMatrixAt(i, SCRATCH_MAT);
      particleInstanced.setColorAt(i, SCRATCH_COLOR.setRGB(1, 0.6, 0.2));
    }
    particleInstanced.instanceMatrix.needsUpdate = true;
    if (particleInstanced.instanceColor) particleInstanced.instanceColor.needsUpdate = true;

    const spawnBurst = (
      ox: number,
      oy: number,
      oz: number,
      dx: number,
      dy: number,
      dz: number,
      count: number,
      mode: 'muzzle' | 'impact'
    ) => {
      for (let i = 0; i < count; i++) {
        const p = particles[particleCursor];
        particleCursor = (particleCursor + 1) % PARTICLE_POOL_SIZE;
        p.active = true;
        p.x = ox + (Math.random() - 0.5) * 0.4;
        p.y = oy + (Math.random() - 0.5) * 0.4;
        p.z = oz + (Math.random() - 0.5) * 0.4;
        if (mode === 'muzzle') {
          const spd = 4 + Math.random() * 11;
          p.vx = dx * spd + (Math.random() - 0.5) * 4.5;
          p.vy = dy * spd + (Math.random() - 0.5) * 4.5;
          p.vz = dz * spd + (Math.random() - 0.5) * 4.5;
          p.maxLife = 0.55 + Math.random() * 0.55;
          p.scale = 0.8 + Math.random() * 1.1;
          const isFire = i < count * 0.45;
          p.r = isFire ? 1.0 : 0.72;
          p.g = isFire ? 0.55 : 0.78;
          p.b = isFire ? 0.14 : 0.86;
        } else {
          const a = Math.random() * Math.PI * 2;
          const s = 3 + Math.random() * 14;
          p.vx = Math.cos(a) * s;
          p.vy = 4 + Math.random() * 14;
          p.vz = Math.sin(a) * s;
          p.maxLife = 0.65 + Math.random() * 0.7;
          p.scale = 0.75 + Math.random() * 1.2;
          const isSpark = i % 2 === 0;
          p.r = isSpark ? 1.0 : 0.45;
          p.g = isSpark ? 0.45 : 0.52;
          p.b = isSpark ? 0.08 : 0.62;
        }
        p.life = p.maxLife;
      }
    };

    // Physics flight state
    const flight = {
      active: false,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      elapsed: 0,
      maxH: 0,
      trailCount: 0,
      trailSampleAcc: 0,
      recoilOffset: 0,
      recoilVel: 0,
      shockTimer: 0,
      flashIntensity: 0
    };

    let lastPredictKey = '';
    const syncPredictionBuffers = () => {
      const p = paramsRef.current;
      const key = `${p.pitchDeg}|${p.yawDeg}|${p.velocity}|${p.dragCoeff}|${p.windCross}|${p.windHead}|${p.gravity}`;
      if (key === lastPredictKey) return;
      lastPredictKey = key;

      const sim = simulatePrediction(p);
      const pts = sim.pts;
      let peakIdx = 0;
      let peakY = -999;

      for (let i = 0; i < PREDICT_POINTS; i++) {
        const idx = Math.min(pts.length - 1, Math.round((i / (PREDICT_POINTS - 1)) * (pts.length - 1)));
        const pt = pts[idx];
        predPositions[i * 3] = pt.x;
        predPositions[i * 3 + 1] = pt.y;
        predPositions[i * 3 + 2] = pt.z;
        if (pt.y > peakY) {
          peakY = pt.y;
          peakIdx = i;
        }
      }
      predGeo.attributes.position.needsUpdate = true;
      predGeo.computeBoundingSphere();

      apexMarker.position.set(
        predPositions[peakIdx * 3],
        predPositions[peakIdx * 3 + 1],
        predPositions[peakIdx * 3 + 2]
      );
      landingReticleGroup.position.set(sim.impactPos.x, 0.09, sim.impactPos.z);

      for (let i = 0; i < VACUUM_POINTS; i++) {
        const vp = sim.vacPts[i];
        vacPositions[i * 3] = vp.x;
        vacPositions[i * 3 + 1] = vp.y;
        vacPositions[i * 3 + 2] = vp.z;
      }
      vacGeo.attributes.position.needsUpdate = true;
      vacLine.computeLineDistances();
    };
    syncPredictionBuffers();

    fireFnRef.current = (overridePitch?: number) => {
      const p = paramsRef.current;
      const usePitch = typeof overridePitch === 'number' ? overridePitch : p.pitchDeg;

      // Archive previous active trail into history ring buffer
      if (flight.trailCount > 2) {
        const slot = historyTrails[nextHistorySlot];
        nextHistorySlot = (nextHistorySlot + 1) % HISTORY_TRAIL_SLOTS;
        slot.arr.set(activeTrailArr.subarray(0, flight.trailCount * 3));
        slot.count = flight.trailCount;
        slot.geo.attributes.position.needsUpdate = true;
        slot.geo.setDrawRange(0, slot.count);
      }

      const { pos, dir } = computeMuzzleState(usePitch, p.yawDeg);
      flight.active = true;
      flight.x = pos.x;
      flight.y = pos.y + 0.22;
      flight.z = pos.z;
      flight.vx = dir.x * p.velocity;
      flight.vy = dir.y * p.velocity;
      flight.vz = dir.z * p.velocity;
      flight.elapsed = 0;
      flight.maxH = flight.y;
      flight.trailCount = 1;
      flight.trailSampleAcc = 0;
      activeTrailArr[0] = flight.x;
      activeTrailArr[1] = flight.y;
      activeTrailArr[2] = flight.z;
      activeTrailGeo.attributes.position.needsUpdate = true;
      activeTrailGeo.setDrawRange(0, 1);

      flight.recoilOffset = -0.68;
      flight.recoilVel = 0;
      flight.flashIntensity = 18;
      flashLight.position.set(flight.x, flight.y + 0.4, flight.z);
      shellMesh.position.set(flight.x, flight.y, flight.z);
      shellMesh.visible = true;

      spawnBurst(flight.x, flight.y, flight.z, dir.x, dir.y, dir.z, 26, 'muzzle');
      playArtillerySfx('fire');

      setTelemetry((prev) => ({
        ...prev,
        status: 'flying',
        shots: prev.shots + 1,
        directHitBanner: null
      }));
    };

    clearTrailsFnRef.current = () => {
      flight.active = false;
      flight.trailCount = 0;
      activeTrailGeo.setDrawRange(0, 0);
      shellMesh.visible = false;
      shellLight.intensity = 0;
      for (const h of historyTrails) {
        h.count = 0;
        h.geo.setDrawRange(0, 0);
      }
      for (const c of craters) {
        c.visible = false;
      }
      setTelemetry((prev) => ({
        ...prev,
        status: 'ready',
        elapsed: 0,
        altitude: 1.5,
        range: 0,
        directHitBanner: null
      }));
    };

    applyCamModeFnRef.current = (mode: CameraMode) => {
      if (mode === 'orbit') {
        camera.position.set(-24, 15, -18);
        controls.target.set(0, 3.5, 45);
      } else if (mode === 'side') {
        camera.position.set(-115, 28, 75);
        controls.target.set(0, 12, 75);
      } else if (mode === 'cannon') {
        camera.position.set(0, 5.2, -11);
        controls.target.set(0, 6, 65);
      }
      controls.update();
    };

    resetCamFnRef.current = () => {
      setCameraMode('orbit');
      applyCamModeFnRef.current?.('orbit');
    };

    // ResizeObserver for crisp viewport sizing
    const ro = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 620;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    // Render loop with software-GL afterDraw pacing
    let rafId = 0;
    let alive = true;
    const clock = new THREE.Clock();
    let hudSyncAcc = 0;
    let lastTargetKey = '';

    function afterDraw(cb: () => void) {
      requestAnimationFrame(() => setTimeout(cb, 0));
    }

    const tick = () => {
      if (!alive) return;
      const rawDt = Math.min(0.05, clock.getDelta());
      const elapsedTotal = clock.elapsedTime;
      const p = paramsRef.current;

      // Sync target list if changed
      const tKey = targetsRef.current.map((t) => `${t.x},${t.z}`).join(';');
      if (tKey !== lastTargetKey) {
        lastTargetKey = tKey;
        rebuildTargetMeshes(targetsRef.current);
      }

      syncPredictionBuffers();
      vacLine.visible = showVacuumArcRef.current;

      // Cannon orientation (yaw & pitch)
      const targetYaw = THREE.MathUtils.degToRad(-p.yawDeg);
      const targetPitch = THREE.MathUtils.degToRad(-p.pitchDeg);
      turntableGroup.rotation.y = THREE.MathUtils.lerp(turntableGroup.rotation.y, targetYaw, Math.min(1, rawDt * 12));
      barrelPivotGroup.rotation.x = THREE.MathUtils.lerp(barrelPivotGroup.rotation.x, targetPitch, Math.min(1, rawDt * 12));

      // Recoil spring recovery
      if (Math.abs(flight.recoilOffset) > 0.001 || Math.abs(flight.recoilVel) > 0.001) {
        const force = -165 * flight.recoilOffset - 20 * flight.recoilVel;
        flight.recoilVel += force * rawDt;
        flight.recoilOffset += flight.recoilVel * rawDt;
        barrelRecoilGroup.position.z = flight.recoilOffset;
        const wheelRock = flight.recoilOffset * 0.25;
        wheelMeshes.forEach((w) => {
          w.rotation.x = wheelRock;
        });
      }

      // Wind banner animation
      const windMag = Math.hypot(p.windCross, p.windHead);
      const windYaw = windMag > 0.1 ? Math.atan2(-p.windHead, p.windCross) : 0;
      flagPivot.rotation.y = windYaw + Math.sin(elapsedTotal * (2.5 + windMag * 0.45)) * 0.18;
      flagMesh.scale.x = 0.45 + Math.min(1.0, windMag * 0.06);

      // Reticle & apex animation
      reticleOuter.rotation.z = elapsedTotal * 0.9;
      reticleInner.rotation.z = -elapsedTotal * 1.4;
      apexMarker.rotation.y = elapsedTotal * 1.8;

      // Muzzle flash light decay
      if (flight.flashIntensity > 0.05) {
        flight.flashIntensity *= Math.exp(-rawDt * 14);
        flashLight.intensity = flight.flashIntensity;
      } else {
        flashLight.intensity = 0;
      }

      // Active shell sub-stepped physics integration
      if (flight.active) {
        const simDt = rawDt * p.timeScale;
        const subSteps = 4;
        const subDt = simDt / subSteps;

        for (let s = 0; s < subSteps; s++) {
          if (!flight.active) break;
          const relVx = flight.vx - p.windCross;
          const relVy = flight.vy;
          const relVz = flight.vz - p.windHead;
          const relSpd = Math.hypot(relVx, relVy, relVz);

          const dragFactor = p.dragCoeff * 0.0028 * relSpd;
          const ax = -dragFactor * relVx;
          const ay = -p.gravity - dragFactor * relVy;
          const az = -dragFactor * relVz;

          flight.vx += ax * subDt;
          flight.vy += ay * subDt;
          flight.vz += az * subDt;
          flight.x += flight.vx * subDt;
          flight.y += flight.vy * subDt;
          flight.z += flight.vz * subDt;
          flight.elapsed += subDt;

          if (flight.y > flight.maxH) flight.maxH = flight.y;

          // Impact check
          if (flight.y <= 0.25) {
            flight.y = 0.25;
            flight.active = false;
            shellMesh.visible = false;
            shellLight.intensity = 0;

            // Shockwave ring + Persistent ground crater marker
            impactRing.position.set(flight.x, 0.14, flight.z);
            impactRing.scale.set(1, 1, 1);
            impactRing.visible = true;
            flight.shockTimer = 1.0;

            const crater = craters[craterCursor];
            craterCursor = (craterCursor + 1) % CRATER_POOL_SIZE;
            crater.position.set(flight.x, 0.1, flight.z);
            crater.visible = true;

            spawnBurst(flight.x, 0.45, flight.z, 0, 1, 0, 34, 'impact');

            // Append final point to trail
            if (flight.trailCount < ACTIVE_TRAIL_MAX) {
              activeTrailArr[flight.trailCount * 3] = flight.x;
              activeTrailArr[flight.trailCount * 3 + 1] = 0.25;
              activeTrailArr[flight.trailCount * 3 + 2] = flight.z;
              flight.trailCount += 1;
              activeTrailGeo.attributes.position.needsUpdate = true;
              activeTrailGeo.setDrawRange(0, flight.trailCount);
            }

            // Check direct target hits
            let hitIndex = -1;
            let bestDist = Infinity;
            targetsRef.current.forEach((tCfg, idx) => {
              const d = Math.hypot(flight.x - tCfg.x, flight.z - tCfg.z);
              if (d < bestDist) bestDist = d;
              if (d <= tCfg.radius + 1.4) {
                hitIndex = idx;
              }
            });

            if (hitIndex >= 0 && targetGroups[hitIndex]) {
              targetGroups[hitIndex].hitTimer = 1.6;
              playArtillerySfx('hit');
              onEarnXP?.(20);
            } else {
              playArtillerySfx('impact');
            }

            const finalRange = Math.hypot(flight.x, flight.z);
            setTelemetry((prev) => ({
              ...prev,
              status: 'impacted',
              elapsed: flight.elapsed,
              speed: Math.hypot(flight.vx, flight.vy, flight.vz),
              altitude: 0,
              range: finalRange,
              maxHeight: flight.maxH,
              hits: hitIndex >= 0 ? prev.hits + 1 : prev.hits,
              lastHitDistance: bestDist,
              directHitBanner:
                hitIndex >= 0
                  ? isEn
                    ? `DIRECT TARGET HIT #${hitIndex + 1}! (+20 XP)`
                    : `TRÚNG MỤC TIÊU #${hitIndex + 1}! (+20 XP)`
                  : null
            }));
          }
        }

        if (flight.active) {
          shellMesh.position.set(flight.x, flight.y, flight.z);
          shellLight.position.set(flight.x, flight.y, flight.z);
          shellLight.intensity = 4.5;

          flight.trailSampleAcc += rawDt * p.timeScale;
          if (flight.trailSampleAcc >= 0.025 && flight.trailCount < ACTIVE_TRAIL_MAX) {
            flight.trailSampleAcc = 0;
            activeTrailArr[flight.trailCount * 3] = flight.x;
            activeTrailArr[flight.trailCount * 3 + 1] = flight.y;
            activeTrailArr[flight.trailCount * 3 + 2] = flight.z;
            flight.trailCount += 1;
            activeTrailGeo.attributes.position.needsUpdate = true;
            activeTrailGeo.setDrawRange(0, flight.trailCount);
          }

          if (cameraModeRef.current === 'follow') {
            SCRATCH_VEC_A.set(flight.x - 16, Math.max(4.5, flight.y + 7), flight.z - 18);
            camera.position.lerp(SCRATCH_VEC_A, Math.min(1, rawDt * 6.5));
            SCRATCH_VEC_B.set(flight.x, flight.y, flight.z);
            controls.target.lerp(SCRATCH_VEC_B, Math.min(1, rawDt * 8));
          }

          hudSyncAcc += rawDt;
          if (hudSyncAcc >= 0.08) {
            hudSyncAcc = 0;
            setTelemetry((prev) => ({
              ...prev,
              status: 'flying',
              elapsed: flight.elapsed,
              speed: Math.hypot(flight.vx, flight.vy, flight.vz),
              altitude: Math.max(0, flight.y),
              range: Math.hypot(flight.x, flight.z),
              maxHeight: flight.maxH
            }));
          }
        }
      }

      // Impact ring expansion fade
      if (flight.shockTimer > 0) {
        flight.shockTimer = Math.max(0, flight.shockTimer - rawDt * 1.4);
        const s = 1 + (1 - flight.shockTimer) * 7.5;
        impactRing.scale.set(s, s, 1);
        impactRingMat.opacity = flight.shockTimer * 0.85;
        if (flight.shockTimer <= 0.01) impactRing.visible = false;
      }

      // Target hit tilt & green flash animation
      targetGroups.forEach((tg) => {
        if (tg.hitTimer > 0) {
          tg.hitTimer = Math.max(0, tg.hitTimer - rawDt);
          tg.ringMat.color.setHex(0x34d399);
          tg.ringMat.emissive.setHex(0x10b981);
          tg.group.rotation.x = Math.sin(tg.hitTimer * 10) * 0.08;
        } else {
          tg.ringMat.color.setHex(0xf43f5e);
          tg.ringMat.emissive.setHex(0xe11d48);
          tg.group.rotation.x = 0;
        }
      });

      // Instanced particles update (zero allocations)
      let anyParticleDirty = false;
      for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
        const pt = particles[i];
        if (!pt.active) continue;
        anyParticleDirty = true;
        pt.life -= rawDt;
        if (pt.life <= 0) {
          pt.active = false;
          SCRATCH_SCALE.set(0, 0, 0);
          SCRATCH_MAT.compose(SCRATCH_VEC_C.set(0, -50, 0), SCRATCH_QUAT.identity(), SCRATCH_SCALE);
          particleInstanced.setMatrixAt(i, SCRATCH_MAT);
          continue;
        }
        pt.vy -= 9.5 * rawDt;
        pt.x += pt.vx * rawDt;
        pt.y = Math.max(0.1, pt.y + pt.vy * rawDt);
        pt.z += pt.vz * rawDt;
        const lifeFrac = pt.life / pt.maxLife;
        const sc = pt.scale * (0.35 + lifeFrac * 0.85);
        SCRATCH_SCALE.set(sc, sc, sc);
        SCRATCH_MAT.compose(SCRATCH_VEC_C.set(pt.x, pt.y, pt.z), SCRATCH_QUAT.identity(), SCRATCH_SCALE);
        particleInstanced.setMatrixAt(i, SCRATCH_MAT);
        SCRATCH_COLOR.setRGB(pt.r * lifeFrac, pt.g * lifeFrac, pt.b * lifeFrac);
        particleInstanced.setColorAt(i, SCRATCH_COLOR);
      }
      if (anyParticleDirty) {
        particleInstanced.instanceMatrix.needsUpdate = true;
        if (particleInstanced.instanceColor) particleInstanced.instanceColor.needsUpdate = true;
      }

      // 3D Wind-stream streaks update
      const windVisible = windMag > 0.4;
      windInstanced.visible = windVisible;
      if (windVisible) {
        const wYaw = Math.atan2(-p.windHead, p.windCross);
        SCRATCH_QUAT.setFromAxisAngle(SCRATCH_VEC_B.set(0, 1, 0), wYaw);
        const wLen = Math.min(2.6, 0.6 + windMag * 0.12);
        SCRATCH_SCALE.set(wLen, 1, 1);
        for (let i = 0; i < WIND_STREAK_COUNT; i++) {
          const ws = windStreaks[i];
          ws.x += p.windCross * rawDt * 2.2;
          ws.z += p.windHead * rawDt * 2.2;
          if (ws.x > 75) ws.x = -75;
          if (ws.x < -75) ws.x = 75;
          if (ws.z > 210) ws.z = 5;
          if (ws.z < 5) ws.z = 210;
          SCRATCH_MAT.compose(SCRATCH_VEC_C.set(ws.x, ws.y, ws.z), SCRATCH_QUAT, SCRATCH_SCALE);
          windInstanced.setMatrixAt(i, SCRATCH_MAT);
        }
        windInstanced.instanceMatrix.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      clearTimeout(rafId);
      ro.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();
      groundTex.dispose();
      groundMat.dispose();
      predGeo.dispose();
      vacGeo.dispose();
      activeTrailGeo.dispose();
      historyTrails.forEach((h) => h.geo.dispose());
      craterGeo.dispose();
      craterMat.dispose();
      windGeo.dispose();
      windMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      envRT.dispose();
      renderer.dispose();
    };
  }, [isEn, onEarnXP, perfMode, playArtillerySfx]);

  const applyBallisticScenario = (id: BallisticScenarioId) => {
    if (id === 'ideal_vac') {
      setParams((p) => ({
        ...p,
        pitchDeg: 45,
        yawDeg: 0,
        velocity: 38,
        dragCoeff: 0,
        windCross: 0,
        windHead: 0,
        gravity: 9.81,
        gravityPreset: 'earth'
      }));
    } else if (id === 'high_drag') {
      setParams((p) => ({
        ...p,
        pitchDeg: 38,
        yawDeg: 0,
        velocity: 58,
        dragCoeff: 1.35,
        windCross: 0,
        windHead: -4,
        gravity: 9.81,
        gravityPreset: 'earth'
      }));
    } else if (id === 'lunar') {
      setParams((p) => ({
        ...p,
        pitchDeg: 42,
        yawDeg: 0,
        velocity: 22,
        dragCoeff: 0,
        windCross: 0,
        windHead: 0,
        gravity: 1.62,
        gravityPreset: 'moon'
      }));
    } else {
      setParams((p) => ({
        ...p,
        pitchDeg: 44,
        yawDeg: -10,
        velocity: 46,
        dragCoeff: 0.65,
        windCross: 12,
        windHead: 0,
        gravity: 9.81,
        gravityPreset: 'earth'
      }));
    }
  };

  const handleGravityPreset = (preset: GravityPreset) => {
    setParams((prev) => ({
      ...prev,
      gravityPreset: preset,
      gravity: GRAVITY_VALUES[preset].g
    }));
  };

  const handleRandomizeTargets = () => {
    setTargets([
      { id: 1, x: Math.round((Math.random() - 0.5) * 36), z: 55 + Math.round(Math.random() * 25), radius: 4.5 },
      { id: 2, x: Math.round((Math.random() - 0.5) * 56), z: 110 + Math.round(Math.random() * 35), radius: 5.0 },
      { id: 3, x: Math.round((Math.random() - 0.5) * 70), z: 165 + Math.round(Math.random() * 45), radius: 5.5 }
    ]);
  };

  const liveSpeed = telemetry.status === 'flying' ? telemetry.speed : params.velocity;
  const kineticEnergyKj = (0.5 * SHELL_MASS_KG * liveSpeed * liveSpeed) / 1000;

  return (
    <div
      className={`relative w-full overflow-hidden border border-sky-400/45 bg-[#050b18] text-white shadow-[0_28px_80px_-16px_rgba(2,132,199,0.4)] select-none flex flex-col lg:block ${
        isFullscreen
          ? 'fixed inset-0 z-[140] h-[100dvh] rounded-none border-0 overflow-y-auto lg:overflow-hidden'
          : 'rounded-xl lg:h-[700px]'
      }`}
    >
      {/* Top-Left Compact Ballistics Telemetry HUD & Camera Bar (Stacked on mobile/iPad, floating on lg+) */}
      <div className="relative z-20 p-2.5 sm:p-3 lg:p-4 lg:pointer-events-none flex flex-wrap items-start justify-between gap-2.5 bg-[#050b18]/95 lg:bg-transparent border-b border-sky-500/20 lg:border-b-0 shrink-0">
        <div className="pointer-events-auto bg-slate-950/92 border border-sky-400/35 rounded-lg px-3 py-2.5 shadow-xl w-full lg:w-auto lg:max-w-lg space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              <Crosshair className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{isEn ? '3D Artillery Ballistics' : 'Quỹ Đạo Bắn Pháo 3D'}</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-300 font-bold tabular-nums">
              {isEn ? 'Hits' : 'Trúng'}: {telemetry.hits}/{telemetry.shots}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-[11px] font-mono tabular-nums">
            <div className="rounded bg-slate-900/95 border border-slate-800 px-2 py-1">
              <span className="block text-[9px] text-slate-400 uppercase">{isEn ? 'Pred.' : 'Tầm xa'}</span>
              <span className="font-bold text-sky-300">{telemetry.predictedRange.toFixed(1)}m</span>
            </div>
            <div className="rounded bg-slate-900/95 border border-slate-800 px-2 py-1">
              <span className="block text-[9px] text-slate-400 uppercase">{isEn ? 'Vac.' : 'Ch.Không'}</span>
              <span className="font-bold text-amber-300">{telemetry.vacuumRange.toFixed(1)}m</span>
            </div>
            <div className="rounded bg-slate-900/95 border border-slate-800 px-2 py-1">
              <span className="block text-[9px] text-slate-400 uppercase">Hmax</span>
              <span className="font-bold text-teal-300">{telemetry.predictedMaxH.toFixed(1)}m</span>
            </div>
            <div className="rounded bg-slate-900/95 border border-slate-800 px-2 py-1">
              <span className="block text-[9px] text-slate-400 uppercase">T_fly</span>
              <span className="font-bold text-purple-300">{telemetry.predictedFlightTime.toFixed(2)}s</span>
            </div>
            <div className="rounded bg-slate-900/95 border border-slate-800 px-2 py-1">
              <span className="block text-[9px] text-slate-400 uppercase">Ek (12kg)</span>
              <span className="font-bold text-orange-300">{kineticEnergyKj.toFixed(1)}kJ</span>
            </div>
            <div className="rounded bg-slate-900/95 border border-slate-800 px-2 py-1">
              <span className="block text-[9px] text-slate-400 uppercase">{isEn ? 'Live' : 'Đang bay'}</span>
              <span className="font-bold text-white">
                {telemetry.status === 'ready' ? '0.0m' : `${telemetry.range.toFixed(1)}m`}
              </span>
            </div>
          </div>

          {telemetry.directHitBanner && (
            <div className="rounded bg-emerald-500/20 border border-emerald-400/60 px-2.5 py-1 text-xs font-bold text-emerald-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>{telemetry.directHitBanner}</span>
            </div>
          )}
        </div>

        {/* Top-Right Camera & Audio Toolbar */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 bg-slate-950/92 border border-slate-700/80 rounded-lg p-1.5 shadow-xl">
          {(
            [
              { id: 'orbit', vi: 'Tự do', en: 'Orbit' },
              { id: 'follow', vi: 'Theo đạn', en: 'Follow' },
              { id: 'side', vi: 'Mặt cắt', en: 'Side' },
              { id: 'cannon', vi: 'Sau pháo', en: 'Aim' }
            ] as const
          ).map((cam) => (
            <button
              key={cam.id}
              type="button"
              onClick={() => {
                setCameraMode(cam.id);
                applyCamModeFnRef.current?.(cam.id);
              }}
              className={`min-h-[36px] px-2.5 py-1.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                cameraMode === cam.id
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {isEn ? cam.en : cam.vi}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShowVacuumArc((v) => !v)}
            className={`min-h-[36px] px-2.5 py-1.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              showVacuumArc
                ? 'bg-amber-500/25 border border-amber-400/50 text-amber-200'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title={isEn ? 'Compare Ideal Vacuum Parabola' : 'So sánh Parabol chân không lý tưởng'}
          >
            {isEn ? 'Vacuum Arc' : 'Lý tưởng'}
          </button>

          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded bg-slate-900 hover:bg-slate-800 text-slate-200 cursor-pointer"
            title={isEn ? 'Toggle Sound' : 'Bật/Tắt Âm thanh pháo'}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
          </button>

          <button
            type="button"
            onClick={() => resetCamFnRef.current?.()}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded bg-slate-900 hover:bg-slate-800 text-slate-200 cursor-pointer"
            title={isEn ? 'Reset Camera' : 'Đặt lại góc nhìn'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen((f) => !f)}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded bg-slate-900 hover:bg-slate-800 text-slate-200 cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Live WebGL 3D Viewport */}
      <div
        className={`relative w-full ${
          isFullscreen ? 'flex-1 min-h-[280px] lg:h-full' : 'h-[290px] sm:h-[380px] lg:absolute lg:inset-0 lg:h-full'
        }`}
      >
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />

        {(webglError || contextLost) && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/95 p-6 text-center">
            <div className="max-w-md space-y-3 rounded-xl border border-sky-500/40 bg-slate-900 p-6">
              <Target className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="font-display text-lg font-bold text-white">
                {isEn ? 'WebGL Ballistic Range Unavailable' : 'Đang khôi phục Trường Bắn Pháo 3D WebGL'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isEn
                  ? 'Your browser paused the 3D hardware context. Refresh or switch views to restore.'
                  : 'Trình duyệt tạm ngắt ngữ cảnh WebGL 3D. Vui lòng thử tải lại hoặc chuyển tab để tiếp tục.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Collapsible Control Dock (Stacked below canvas on mobile/iPad, floating on lg+) */}
      <div className="relative lg:absolute lg:inset-x-3 lg:bottom-3 z-20 p-2.5 lg:p-0 bg-[#050b18]/95 lg:bg-transparent border-t border-sky-500/20 lg:border-t-0 lg:pointer-events-none flex flex-col items-center gap-2 shrink-0">
        {/* Primary Fire + Scenario + Dock Toggle Row */}
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <button
            type="button"
            data-ripple="true"
            onClick={() => fireFnRef.current?.()}
            className="pre-grand-btn min-h-[40px] px-5 sm:px-6 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-[0_12px_34px_-6px_rgba(249,115,22,0.7)] flex items-center gap-2 cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-slate-950" />
            <span>{isEn ? 'FIRE CANNON' : 'KHAI HỎA BẮN PHÁO'}</span>
          </button>

          <button
            type="button"
            onClick={handleRandomizeTargets}
            className="min-h-[38px] px-3 py-2 rounded-lg bg-slate-950/92 hover:bg-slate-900 border border-emerald-400/45 text-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEn ? 'New Targets' : 'Đổi Mục Tiêu'}</span>
          </button>

          <button
            type="button"
            onClick={() => clearTrailsFnRef.current?.()}
            className="min-h-[38px] px-3 py-2 rounded-lg bg-slate-950/92 hover:bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{isEn ? 'Clear Trails' : 'Xóa vệt bay'}</span>
          </button>

          <button
            type="button"
            onClick={() => setControlsVisible((v) => !v)}
            className="min-h-[38px] px-3 py-2 rounded-lg bg-slate-950/92 hover:bg-slate-900 border border-sky-400/45 text-sky-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            {controlsVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{controlsVisible ? (isEn ? 'Hide Controls' : 'Ẩn Điều Khiển') : (isEn ? 'Show Controls' : 'Hiện Điều Khiển')}</span>
          </button>
        </div>

        {controlsVisible && (
          <div className="pointer-events-auto w-full max-w-5xl rounded-xl border border-sky-400/35 bg-slate-950/94 p-3 sm:p-3.5 shadow-2xl space-y-3 max-h-[38dvh] lg:max-h-none overflow-y-auto">
            {/* Ballistic Quick Scenarios */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-800/90 text-[11px]">
              <span className="inline-flex items-center gap-1 text-slate-400 font-bold mr-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {isEn ? 'Scenarios:' : 'Kịch bản:'}
              </span>
              {(
                [
                  { id: 'ideal_vac', vi: '45° Chân không', en: '45° Ideal Vacuum' },
                  { id: 'high_drag', vi: 'Lực cản lớn', en: 'High Air Drag' },
                  { id: 'lunar', vi: 'Bắn Mặt Trăng', en: 'Lunar 1.62m/s²' },
                  { id: 'crosswind', vi: 'Gió ngang mạnh', en: 'Heavy Crosswind' }
                ] as const
              ).map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => applyBallisticScenario(sc.id)}
                  className="min-h-[34px] px-2.5 py-1 rounded border border-slate-700 bg-slate-900 hover:border-amber-400 text-slate-200 font-bold cursor-pointer"
                >
                  {isEn ? sc.en : sc.vi}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Elevation Pitch */}
              <label className="space-y-1 block">
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span>{isEn ? 'Elevation θ' : 'Góc ngẩng θ'}</span>
                  <span className="font-mono text-sky-300 font-bold tabular-nums">{params.pitchDeg}°</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={85}
                  step={1}
                  value={params.pitchDeg}
                  onChange={(e) => setParams((p) => ({ ...p, pitchDeg: Number(e.target.value) }))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </label>

              {/* Azimuth Yaw */}
              <label className="space-y-1 block">
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span>{isEn ? 'Azimuth Yaw φ' : 'Góc xoay ngang φ'}</span>
                  <span className="font-mono text-teal-300 font-bold tabular-nums">{params.yawDeg}°</span>
                </div>
                <input
                  type="range"
                  min={-45}
                  max={45}
                  step={1}
                  value={params.yawDeg}
                  onChange={(e) => setParams((p) => ({ ...p, yawDeg: Number(e.target.value) }))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </label>

              {/* Muzzle Velocity */}
              <label className="space-y-1 block">
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span>{isEn ? 'Muzzle Speed v₀' : 'Vận tốc đầu nòng v₀'}</span>
                  <span className="font-mono text-amber-300 font-bold tabular-nums">{params.velocity} m/s</span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={82}
                  step={1}
                  value={params.velocity}
                  onChange={(e) => setParams((p) => ({ ...p, velocity: Number(e.target.value) }))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </label>

              {/* Air Drag */}
              <label className="space-y-1 block">
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span>{isEn ? 'Air Drag k' : 'Lực cản không khí k'}</span>
                  <span className="font-mono text-rose-300 font-bold tabular-nums">{params.dragCoeff.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1.6}
                  step={0.05}
                  value={params.dragCoeff}
                  onChange={(e) => setParams((p) => ({ ...p, dragCoeff: Number(e.target.value) }))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </label>
            </div>

            {/* Second Row: Crosswind + Gravity Presets + Time Scale */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/90 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-slate-300 font-semibold">
                  <Wind className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{isEn ? 'Crosswind:' : 'Gió ngang:'}</span>
                  <input
                    type="range"
                    min={-15}
                    max={15}
                    step={1}
                    value={params.windCross}
                    onChange={(e) => setParams((p) => ({ ...p, windCross: Number(e.target.value) }))}
                    className="w-24 accent-amber-400 cursor-pointer"
                  />
                  <span className="font-mono text-amber-300 tabular-nums w-12">
                    {params.windCross > 0 ? `+${params.windCross}` : params.windCross} m/s
                  </span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 font-semibold">
                  <Gauge className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                  <span>{isEn ? 'Speed:' : 'Tốc độ:'}</span>
                  <select
                    value={params.timeScale}
                    onChange={(e) => setParams((p) => ({ ...p, timeScale: Number(e.target.value) }))}
                    className="min-h-[34px] rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs font-mono text-sky-200"
                  >
                    <option value={0.35}>0.35x Slow</option>
                    <option value={0.65}>0.65x</option>
                    <option value={1}>1.0x Normal</option>
                    <option value={1.6}>1.6x Fast</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(['earth', 'moon', 'mars', 'jupiter'] as const).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleGravityPreset(preset)}
                    className={`min-h-[34px] px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                      params.gravityPreset === preset
                        ? 'bg-sky-500 text-slate-950'
                        : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {isEn ? GRAVITY_VALUES[preset].en : GRAVITY_VALUES[preset].vi}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
