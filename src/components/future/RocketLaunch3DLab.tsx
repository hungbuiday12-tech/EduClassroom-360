import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Eye,
  EyeOff,
  Flame,
  Layers,
  Orbit,
  RotateCcw,
  Rocket,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';

interface RocketLaunch3DLabProps {
  onEarnXP?: (xp: number) => void;
}

type CameraPreset = 'pad' | 'chase' | 'separation' | 'horizon';
type LaunchPhase =
  | 'PRE_LAUNCH'
  | 'IGNITION'
  | 'MAX_Q'
  | 'MECO_SEP'
  | 'FAIRING_JETTISON'
  | 'ORBIT';

interface SimParams {
  thrustToWeight: number;
  pitchKickDeg: number;
  payloadMassTons: number;
  timeScale: number;
}

interface Telemetry {
  phase: LaunchPhase;
  missionTime: number;
  altitudeKm: number;
  velocityKms: number;
  pitchDeg: number;
  stage1FuelPct: number;
  stage2FuelPct: number;
  dynPressureKpa: number;
  gForce: number;
  stageSeparated: boolean;
  fairingJettisoned: boolean;
}

const PLUME_POOL = 96;
const STAR_COUNT = 700;

const SCRATCH_VEC_A = new THREE.Vector3();
const SCRATCH_VEC_B = new THREE.Vector3();
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
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
  } catch {
    return false;
  }
}

function createLaunchpadTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0c1524';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 16; i++) {
    const p = (i / 16) * size;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, size);
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
  ctx.lineWidth = 6;
  ctx.strokeRect(180, 180, 152, 152);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const PHASE_LABELS: Record<LaunchPhase, { vi: string; en: string; descVi: string; descEn: string }> = {
  PRE_LAUNCH: {
    vi: 'CHỜ PHÓNG TRÊN BỆ',
    en: 'PRE-LAUNCH READY',
    descVi: 'Nạp nhiên liệu LOX (-183°C) & RP-1. Tháp rốn kết nối cấp nguồn.',
    descEn: 'LOX (-183°C) & RP-1 loaded. Umbilical tower connected.'
  },
  IGNITION: {
    vi: 'ĐÁNH LỬA & CẤT CÁNH',
    en: 'IGNITION & LIFTOFF',
    descVi: '9 động cơ tầng 1 đốt cháy đạt lực đẩy > trọng lượng (T/W > 1), tháp kẹp nhả chốt.',
    descEn: 'Stage-1 engines reach full thrust (T/W > 1), hold-down clamps release.'
  },
  MAX_Q: {
    vi: 'MAX-Q & BẺ QUỸ ĐẠO',
    en: 'MAX-Q & GRAVITY TURN',
    descVi: 'Áp suất động lực học cực đại qua khí quyển; tên lửa nghiêng dần theo trọng lực.',
    descEn: 'Peak aerodynamic pressure in dense atmosphere; executing gravity turn.'
  },
  MECO_SEP: {
    vi: 'MECO & TÁCH TẦNG 1',
    en: 'MECO & STAGE SEPARATION',
    descVi: 'Tắt động cơ tầng 1 (MECO), kích nổ chốt khí nén tách tầng và kích hoạt động cơ chân không tầng 2.',
    descEn: 'Main Engine Cut-Off, pneumatic pushers separate Stage 1; Stage-2 vacuum engine ignites.'
  },
  FAIRING_JETTISON: {
    vi: 'TÁCH NẮP BẢO VỆ TẢI',
    en: 'FAIRING JETTISON',
    descVi: 'Thoát khỏi tầng khí quyển dày (>100 km), tách hai nửa chóp bảo vệ vệ tinh.',
    descEn: 'Above dense atmosphere (>100 km), payload fairing halves separate cleanly.'
  },
  ORBIT: {
    vi: 'ĐẠT QUỸ ĐẠO LEO',
    en: 'LEO ORBIT INSERTION',
    descVi: 'Đạt tốc độ vũ trụ cấp 1 (~7.8 km/s), giải phóng vệ tinh viễn thông lên quỹ đạo.',
    descEn: 'Orbital velocity reached (~7.8 km/s); payload satellite deployed cleanly.'
  }
};

export const RocketLaunch3DLab: React.FC<RocketLaunch3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode } = useBackgroundTheme();

  const mountRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [controlsVisible, setControlsVisible] = useState(true);
  const [cutaway, setCutaway] = useState(false);
  const cutawayRef = useRef(false);
  cutawayRef.current = cutaway;

  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  mutedRef.current = muted;

  const [camPreset, setCamPreset] = useState<CameraPreset>('pad');
  const camPresetRef = useRef<CameraPreset>('pad');
  camPresetRef.current = camPreset;

  const [webglError, setWebglError] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const [params, setParams] = useState<SimParams>({
    thrustToWeight: 1.48,
    pitchKickDeg: 22,
    payloadMassTons: 8.5,
    timeScale: 1
  });
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const [telemetry, setTelemetry] = useState<Telemetry>({
    phase: 'PRE_LAUNCH',
    missionTime: 0,
    altitudeKm: 0,
    velocityKms: 0,
    pitchDeg: 90,
    stage1FuelPct: 100,
    stage2FuelPct: 100,
    dynPressureKpa: 0,
    gForce: 1.0,
    stageSeparated: false,
    fairingJettisoned: false
  });

  const launchActionRef = useRef<(() => void) | null>(null);
  const resetActionRef = useRef<(() => void) | null>(null);
  const applyCamRef = useRef<((p: CameraPreset) => void) | null>(null);

  const playRocketSfx = useCallback((kind: 'ignition' | 'sep' | 'orbit') => {
    if (mutedRef.current) return;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AC();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const now = ctx.currentTime;

      if (kind === 'ignition') {
        const dur = 1.4;
        const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < ch.length; i++) {
          ch[i] = (Math.random() * 2 - 1) * Math.min(1, i / (ctx.sampleRate * 0.2)) * Math.exp(-i / (ctx.sampleRate * 0.9));
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(240, now);
        lp.frequency.exponentialRampToValueAtTime(520, now + 0.6);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
        src.connect(lp).connect(gain).connect(ctx.destination);
        src.start(now);
      } else if (kind === 'sep') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.25);
        g.gain.setValueAtTime(0.18, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(g).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          g.gain.setValueAtTime(0.1, now + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + i * 0.08);
          osc.connect(g).connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + 0.55 + i * 0.08);
        });
      }
    } catch {}
  }, []);

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
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : perfMode === 'smooth' ? Math.min(hostDpr, 1.15) : Math.min(hostDpr, 1.85)
    );
    renderer.setSize(container.clientWidth || 960, container.clientHeight || 620);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl && perfMode !== 'smooth';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const onLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onRestored = () => setContextLost(false);
    renderer.domElement.addEventListener('webglcontextlost', onLost);
    renderer.domElement.addEventListener('webglcontextrestored', onRestored);

    const scene = new THREE.Scene();
    const skyColor = new THREE.Color(0x0b1f3b);
    const spaceColor = new THREE.Color(0x020611);
    scene.background = skyColor.clone();
    scene.fog = new THREE.FogExp2(0x0b1f3b, 0.0022);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(
      48,
      (container.clientWidth || 960) / (container.clientHeight || 620),
      0.25,
      1400
    );
    camera.position.set(18, 12, 24);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 6;
    controls.maxDistance = 180;
    controls.target.set(0, 7, 0);
    controls.update();

    let userInteracting = false;
    controls.addEventListener('start', () => {
      userInteracting = true;
    });

    // Studio & Atmospheric 3-Point Lighting
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.85);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e4, 2.3);
    sunLight.position.set(28, 45, 22);
    if (renderer.shadowMap.enabled) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.camera.near = 2;
      sunLight.shadow.camera.far = 140;
      sunLight.shadow.camera.left = -24;
      sunLight.shadow.camera.right = 24;
      sunLight.shadow.camera.top = 36;
      sunLight.shadow.camera.bottom = -12;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.95);
    rimLight.position.set(-24, 18, -24);
    scene.add(rimLight);

    const engineLight = new THREE.PointLight(0xff8c1a, 0, 48, 1.8);
    scene.add(engineLight);

    // High-altitude orbital starfield
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 380 + Math.random() * 240;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.92 + 0.05);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi) + 40;
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xe2e8f0,
      size: 1.4,
      transparent: true,
      opacity: 0.12
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Launch Complex Pad (Grounded flush at y = 0)
    const padGroup = new THREE.Group();
    scene.add(padGroup);

    const padTex = createLaunchpadTexture();
    padTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(160, 160, 0.4, 48),
      new THREE.MeshStandardMaterial({ map: padTex, roughness: 0.88, metalness: 0.12 })
    );
    ground.position.y = -0.2;
    ground.receiveShadow = renderer.shadowMap.enabled;
    padGroup.add(ground);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.45, metalness: 0.78 });
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85, metalness: 0.1 });
    const flameTrench = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 14), concreteMat);
    flameTrench.position.y = 0.7;
    flameTrench.receiveShadow = renderer.shadowMap.enabled;
    padGroup.add(flameTrench);

    // Umbilical Launch Tower
    const towerGroup = new THREE.Group();
    towerGroup.position.set(-4.2, 0, 0);
    padGroup.add(towerGroup);
    const towerCore = new THREE.Mesh(new THREE.BoxGeometry(2.1, 17, 2.1), steelMat);
    towerCore.position.y = 8.5;
    towerCore.castShadow = renderer.shadowMap.enabled;
    towerGroup.add(towerCore);

    const umbilicalArm = new THREE.Group();
    umbilicalArm.position.set(1.05, 11.2, 0);
    const armBeam = new THREE.Mesh(
      new THREE.BoxGeometry(2.9, 0.34, 0.34),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35, metalness: 0.75 })
    );
    armBeam.position.x = 1.45;
    umbilicalArm.add(armBeam);
    towerGroup.add(umbilicalArm);

    const crewArm = new THREE.Group();
    crewArm.position.set(1.05, 14.2, 0);
    const crewBeam = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.45, 0.55), steelMat);
    crewBeam.position.x = 1.35;
    crewArm.add(crewBeam);
    towerGroup.add(crewArm);

    // ==================== COMPOSITE MULTI-STAGE ROCKET ====================
    const rocketAssembly = new THREE.Group();
    rocketAssembly.position.set(0, 1.4, 0);
    scene.add(rocketAssembly);

    // Materials with varied roughness/metalness + cutaway glass support
    const hullWhiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      roughness: 0.28,
      metalness: 0.18,
      clearcoat: 0.65,
      transparent: true,
      opacity: 1
    });
    const hullDarkMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.42,
      metalness: 0.8
    });
    const interstageMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.85
    });
    const nozzleMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.25,
      metalness: 0.92
    });
    const loxMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.2
    });
    const rp1Mat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.2
    });

    // --- STAGE 1 BOOSTER ---
    const stage1Group = new THREE.Group();
    rocketAssembly.add(stage1Group);

    const s1Hull = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 8.6, 32), hullWhiteMat);
    s1Hull.position.y = 4.6;
    s1Hull.castShadow = renderer.shadowMap.enabled;
    stage1Group.add(s1Hull);

    // Cutaway Internal Tanks (LOX Upper + RP-1 Lower)
    const loxTank1 = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 3.6, 24), loxMat);
    loxTank1.position.y = 6.5;
    stage1Group.add(loxTank1);

    const rp1Tank1 = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 3.5, 24), rp1Mat);
    rp1Tank1.position.y = 2.6;
    stage1Group.add(rp1Tank1);

    // Interstage ring + Grid Fins + Landing Legs
    const interstage = new THREE.Mesh(new THREE.CylinderGeometry(1.07, 1.07, 0.85, 32), hullDarkMat);
    interstage.position.y = 9.0;
    stage1Group.add(interstage);

    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.72, 0.08), hullDarkMat);
      fin.position.set(Math.cos(a) * 1.25, 8.4, Math.sin(a) * 1.25);
      fin.rotation.y = -a;
      stage1Group.add(fin);

      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.9, 0.14), hullDarkMat);
      leg.position.set(Math.cos(a) * 1.12, 1.15, Math.sin(a) * 1.12);
      leg.rotation.y = -a;
      stage1Group.add(leg);
    }

    // 5 Cluster Engine Bells + Thrust Plume Cones
    const s1NozzleRing = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.08, 0.5, 24), hullDarkMat);
    s1NozzleRing.position.y = 0.25;
    stage1Group.add(s1NozzleRing);

    const nozzleOffsets = [
      [0, 0],
      [0.52, 0],
      [-0.52, 0],
      [0, 0.52],
      [0, -0.52]
    ];
    nozzleOffsets.forEach(([nx, nz]) => {
      const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.26, 0.56, 16, 1, true), nozzleMat);
      bell.position.set(nx, -0.22, nz);
      stage1Group.add(bell);
    });

    const plume1Mat = new THREE.MeshBasicMaterial({
      color: 0xffa733,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const plume1Mesh = new THREE.Mesh(new THREE.ConeGeometry(0.92, 6.2, 24), plume1Mat);
    plume1Mesh.rotation.x = Math.PI;
    plume1Mesh.position.y = -3.4;
    stage1Group.add(plume1Mesh);

    // --- STAGE 2 UPPER STAGE ---
    const stage2Group = new THREE.Group();
    stage2Group.position.y = 9.4;
    rocketAssembly.add(stage2Group);

    const s2Hull = new THREE.Mesh(new THREE.CylinderGeometry(1.03, 1.03, 3.6, 32), hullWhiteMat);
    s2Hull.position.y = 1.9;
    stage2Group.add(s2Hull);

    const s2Band = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.28, 32), interstageMat);
    s2Band.position.y = 0.25;
    stage2Group.add(s2Band);

    const s2Tank = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.76, 2.7, 24), loxMat);
    s2Tank.position.y = 1.9;
    stage2Group.add(s2Tank);

    const s2Nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.62, 0.95, 24, 1, true), nozzleMat);
    s2Nozzle.position.y = -0.35;
    stage2Group.add(s2Nozzle);

    const plume2Mat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const plume2Mesh = new THREE.Mesh(new THREE.ConeGeometry(0.68, 4.4, 24), plume2Mat);
    plume2Mesh.rotation.x = Math.PI;
    plume2Mesh.position.y = -2.8;
    stage2Group.add(plume2Mesh);

    // --- PAYLOAD SATELLITE INSIDE FAIRING ---
    const satelliteGroup = new THREE.Group();
    satelliteGroup.position.y = 4.3;
    stage2Group.add(satelliteGroup);

    const satBus = new THREE.Mesh(
      new THREE.BoxGeometry(0.76, 0.95, 0.76),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.22, metalness: 0.9 })
    );
    satelliteGroup.add(satBus);

    const solarPanelMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.65
    });
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.04), solarPanelMat);
    wingL.position.x = -0.5;
    satelliteGroup.add(wingL);
    const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.04), solarPanelMat);
    wingR.position.x = 0.5;
    satelliteGroup.add(wingR);

    // --- TWO-HALF PAYLOAD FAIRING (Lathe shell halves) ---
    const fairingProfile = [
      new THREE.Vector2(1.04, 0),
      new THREE.Vector2(1.08, 0.6),
      new THREE.Vector2(0.95, 1.55),
      new THREE.Vector2(0.55, 2.35),
      new THREE.Vector2(0.02, 2.85)
    ];
    const fairingLeftGeo = new THREE.LatheGeometry(fairingProfile, 16, 0, Math.PI);
    const fairingRightGeo = new THREE.LatheGeometry(fairingProfile, 16, Math.PI, Math.PI);
    const fairingLeft = new THREE.Mesh(fairingLeftGeo, hullWhiteMat);
    const fairingRight = new THREE.Mesh(fairingRightGeo, hullWhiteMat);
    fairingLeft.position.y = 3.7;
    fairingRight.position.y = 3.7;
    stage2Group.add(fairingLeft);
    stage2Group.add(fairingRight);

    // Instanced Plume & Smoke Particles
    const smokeGeo = new THREE.IcosahedronGeometry(0.42, 0);
    const smokeMat = new THREE.MeshStandardMaterial({
      roughness: 0.85,
      metalness: 0.05,
      transparent: true,
      opacity: 0.85
    });
    const plumeParticles = new THREE.InstancedMesh(smokeGeo, smokeMat, PLUME_POOL);
    plumeParticles.frustumCulled = false;
    plumeParticles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(plumeParticles);

    const pPool = Array.from({ length: PLUME_POOL }, () => ({
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
      g: 0.7,
      b: 0.25
    }));
    let pCursor = 0;

    // Orbital Trajectory Guide Line
    const arcPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 80; i++) {
      const f = i / 80;
      const x = Math.pow(f, 1.65) * 185;
      const y = 1.4 + f * 220 - Math.pow(f, 2.4) * 35;
      arcPts.push(new THREE.Vector3(x, y, 0));
    }
    const trajGeo = new THREE.BufferGeometry().setFromPoints(arcPts);
    const trajLine = new THREE.Line(
      trajGeo,
      new THREE.LineDashedMaterial({ color: 0x38bdf8, dashSize: 2.5, gapSize: 1.5, transparent: true, opacity: 0.55 })
    );
    trajLine.computeLineDistances();
    scene.add(trajLine);

    // Simulation State
    const sim = {
      running: false,
      missionTime: 0,
      phase: 'PRE_LAUNCH' as LaunchPhase,
      altKm: 0,
      velKms: 0,
      pitchDeg: 90,
      fuel1: 100,
      fuel2: 100,
      stageSep: false,
      fairingSep: false,
      satDeployed: false,
      // Stage 1 detached coast state
      s1WorldPos: new THREE.Vector3(),
      s1Vel: new THREE.Vector3(),
      s1RotZ: 0,
      // Fairing separation drift
      fairingSpread: 0,
      satPop: 0,
      telemetryTimer: 0
    };

    const resetSimulation = () => {
      sim.running = false;
      sim.missionTime = 0;
      sim.phase = 'PRE_LAUNCH';
      sim.altKm = 0;
      sim.velKms = 0;
      sim.pitchDeg = 90;
      sim.fuel1 = 100;
      sim.fuel2 = 100;
      sim.stageSep = false;
      sim.fairingSep = false;
      sim.satDeployed = false;
      sim.fairingSpread = 0;
      sim.satPop = 0;

      rocketAssembly.position.set(0, 1.4, 0);
      rocketAssembly.rotation.set(0, 0, 0);

      rocketAssembly.add(stage1Group);
      stage1Group.position.set(0, 0, 0);
      stage1Group.rotation.set(0, 0, 0);
      stage1Group.visible = true;

      stage2Group.position.set(0, 9.4, 0);
      stage2Group.rotation.set(0, 0, 0);

      fairingLeft.position.set(0, 3.7, 0);
      fairingLeft.rotation.set(0, 0, 0);
      fairingLeft.visible = true;
      fairingRight.position.set(0, 3.7, 0);
      fairingRight.rotation.set(0, 0, 0);
      fairingRight.visible = true;

      satelliteGroup.position.set(0, 4.3, 0);
      wingL.scale.x = 1;
      wingR.scale.x = 1;
      wingL.position.x = -0.5;
      wingR.position.x = 0.5;

      umbilicalArm.rotation.y = 0;
      crewArm.rotation.y = 0;
      plume1Mat.opacity = 0;
      plume2Mat.opacity = 0;
      engineLight.intensity = 0;

      for (const p of pPool) p.active = false;

      setTelemetry({
        phase: 'PRE_LAUNCH',
        missionTime: 0,
        altitudeKm: 0,
        velocityKms: 0,
        pitchDeg: 90,
        stage1FuelPct: 100,
        stage2FuelPct: 100,
        dynPressureKpa: 0,
        gForce: 1.0,
        stageSeparated: false,
        fairingJettisoned: false
      });
    };

    launchActionRef.current = () => {
      if (sim.phase === 'ORBIT') resetSimulation();
      sim.running = true;
      if (sim.missionTime < 0.05) {
        playRocketSfx('ignition');
        onEarnXP?.(20);
      }
    };
    resetActionRef.current = resetSimulation;

    applyCamRef.current = (preset: CameraPreset) => {
      userInteracting = false;
      if (preset === 'pad') {
        camera.position.set(18, 12, 24);
        controls.target.set(0, 7, 0);
      } else if (preset === 'horizon') {
        camera.position.set(-14, 24, 92);
        controls.target.set(42, 42, 0);
      } else {
        controls.target.copy(rocketAssembly.position).add(SCRATCH_VEC_A.set(0, 8, 0));
      }
      controls.update();
    };

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 620;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    let rafId = 0;
    let alive = true;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        rafId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (!alive) return;
        const st = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (st === gl.UNSIGNALED) {
          rafId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          rafId = window.setTimeout(cb, 80);
        }
      };
      rafId = window.setTimeout(poll, 5);
    }

    const emitPlumeParticle = (ox: number, oy: number, oz: number, hot: boolean) => {
      const p = pPool[pCursor];
      pCursor = (pCursor + 1) % PLUME_POOL;
      p.active = true;
      p.x = ox + (Math.random() - 0.5) * 0.65;
      p.y = oy + (Math.random() - 0.5) * 0.4;
      p.z = oz + (Math.random() - 0.5) * 0.65;
      p.vx = (Math.random() - 0.5) * 5.5;
      p.vy = -6 - Math.random() * 6;
      p.vz = (Math.random() - 0.5) * 5.5;
      p.maxLife = 0.6 + Math.random() * 0.65;
      p.life = p.maxLife;
      p.scale = 0.8 + Math.random() * 1.4;
      p.r = hot ? 1.0 : 0.78;
      p.g = hot ? 0.58 : 0.83;
      p.b = hot ? 0.16 : 0.9;
    };

    const tick = () => {
      if (!alive) return;
      const rawDt = Math.min(0.05, clock.getDelta());
      const p = paramsRef.current;

      // Cutaway transparency smooth transition
      const targetOpacity = cutawayRef.current ? 0.24 : 1.0;
      hullWhiteMat.opacity = THREE.MathUtils.damp(hullWhiteMat.opacity, targetOpacity, 8, rawDt);
      hullWhiteMat.depthWrite = hullWhiteMat.opacity > 0.7;

      // Tank fluid height visualization
      loxTank1.scale.y = Math.max(0.05, sim.fuel1 / 100);
      rp1Tank1.scale.y = Math.max(0.05, sim.fuel1 / 100);
      s2Tank.scale.y = Math.max(0.05, sim.fuel2 / 100);

      if (sim.running && sim.phase !== 'ORBIT') {
        const dt = rawDt * p.timeScale;
        sim.missionTime += dt;
        const t = sim.missionTime;
        const thrustScale = p.thrustToWeight / 1.48;
        const massFactor = 1.0 - (p.payloadMassTons - 8.5) * 0.018;
        const rate = thrustScale * Math.max(0.75, massFactor);

        // Swing away tower arms after liftoff
        umbilicalArm.rotation.y = THREE.MathUtils.damp(umbilicalArm.rotation.y, -1.15, 4, rawDt);
        crewArm.rotation.y = THREE.MathUtils.damp(crewArm.rotation.y, -1.35, 3, rawDt);

        if (t < 6.0) {
          sim.phase = 'IGNITION';
          sim.fuel1 = Math.max(45, 100 - t * 9.1);
          sim.altKm = t * t * 0.52 * rate;
          sim.velKms = t * 0.17 * rate;
          sim.pitchDeg = 90 - Math.max(0, (t - 2) * (p.pitchKickDeg * 0.12));
        } else if (t < 13.0) {
          sim.phase = 'MAX_Q';
          const u = t - 6.0;
          sim.fuel1 = Math.max(0, 45 - u * 6.45);
          sim.altKm = 18.7 * rate + u * 4.5 * rate;
          sim.velKms = 1.02 * rate + u * 0.34 * rate;
          sim.pitchDeg = Math.max(36, 90 - p.pitchKickDeg - u * 3.8);
        } else if (t < 20.0) {
          if (!sim.stageSep) {
            sim.stageSep = true;
            playRocketSfx('sep');
            // Detach stage 1 cleanly into world space
            stage1Group.getWorldPosition(sim.s1WorldPos);
            stage1Group.getWorldQuaternion(SCRATCH_QUAT);
            scene.add(stage1Group);
            stage1Group.position.copy(sim.s1WorldPos);
            stage1Group.quaternion.copy(SCRATCH_QUAT);
            sim.s1Vel.set(-1.8, -3.5, 0.8);
            plume1Mat.opacity = 0;
          }
          sim.phase = 'MECO_SEP';
          const u = t - 13.0;
          sim.fuel1 = 0;
          sim.fuel2 = Math.max(58, 100 - u * 6.0);
          sim.altKm = 50.2 * rate + u * 7.4 * rate;
          sim.velKms = 3.4 * rate + u * 0.42 * rate;
          sim.pitchDeg = Math.max(16, 48 - u * 3.6);
        } else if (t < 27.0) {
          if (!sim.fairingSep) {
            sim.fairingSep = true;
            playRocketSfx('sep');
          }
          sim.phase = 'FAIRING_JETTISON';
          const u = t - 20.0;
          sim.fuel2 = Math.max(18, 58 - u * 5.7);
          sim.altKm = 102 * rate + u * 11.2 * rate;
          sim.velKms = 6.34 * rate + u * 0.21 * rate;
          sim.pitchDeg = Math.max(4, 22 - u * 2.4);
          sim.fairingSpread = Math.min(1, u * 0.42);
          fairingLeft.position.x = -sim.fairingSpread * 4.2;
          fairingLeft.position.y = 3.7 - sim.fairingSpread * 3.5;
          fairingLeft.rotation.z = sim.fairingSpread * 0.85;
          fairingRight.position.x = sim.fairingSpread * 4.2;
          fairingRight.position.y = 3.7 - sim.fairingSpread * 3.5;
          fairingRight.rotation.z = -sim.fairingSpread * 0.85;
          if (sim.fairingSpread >= 0.99) {
            fairingLeft.visible = false;
            fairingRight.visible = false;
          }
        } else {
          if (!sim.satDeployed) {
            sim.satDeployed = true;
            playRocketSfx('orbit');
            onEarnXP?.(35);
          }
          sim.phase = 'ORBIT';
          sim.fuel2 = 16;
          sim.altKm = 205;
          sim.velKms = 7.82;
          sim.pitchDeg = 0;
          plume2Mat.opacity = 0;
          engineLight.intensity = 0;
        }

        // Map rocket path smoothly along 3D climb corridor
        const progress = Math.min(1, sim.missionTime / 28);
        const worldX = Math.pow(progress, 1.65) * 185;
        const worldY = 1.4 + progress * 220 - Math.pow(progress, 2.4) * 35;
        rocketAssembly.position.set(worldX, worldY, 0);
        rocketAssembly.rotation.z = -THREE.MathUtils.degToRad(90 - sim.pitchDeg);

        // Detached stage 1 drift
        if (sim.stageSep) {
          stage1Group.position.addScaledVector(sim.s1Vel, dt);
          stage1Group.rotation.z += dt * 0.45;
          if (stage1Group.position.y < -30) stage1Group.visible = false;
        }

        // Plume lighting & particles
        if (!sim.stageSep) {
          plume1Mat.opacity = 0.78 + Math.sin(t * 45) * 0.14;
          plume1Mesh.scale.set(1, 0.9 + Math.sin(t * 50) * 0.16, 1);
          plume2Mat.opacity = 0;
          rocketAssembly.getWorldPosition(SCRATCH_VEC_A);
          engineLight.position.copy(SCRATCH_VEC_A).add(SCRATCH_VEC_B.set(-0.5, -1.2, 0));
          engineLight.intensity = 16;
          if (Math.random() < 0.85) {
            emitPlumeParticle(SCRATCH_VEC_A.x, Math.max(0.5, SCRATCH_VEC_A.y - 1.2), SCRATCH_VEC_A.z, true);
          }
        } else if (sim.phase !== 'ORBIT') {
          plume2Mat.opacity = 0.72 + Math.sin(t * 40) * 0.12;
          stage2Group.getWorldPosition(SCRATCH_VEC_A);
          engineLight.position.copy(SCRATCH_VEC_A);
          engineLight.intensity = 9;
        }
      }

      // Satellite solar wings unfold cleanly upon reaching orbit
      if (sim.satDeployed) {
        sim.satPop = THREE.MathUtils.damp(sim.satPop, 1, 3.2, rawDt);
        satelliteGroup.position.y = 4.3 + sim.satPop * 3.1;
        satelliteGroup.rotation.y += rawDt * 0.6;
        wingL.scale.x = 1 + sim.satPop * 18;
        wingL.position.x = -0.5 - sim.satPop * 1.15;
        wingR.scale.x = 1 + sim.satPop * 18;
        wingR.position.x = 0.5 + sim.satPop * 1.15;
      }

      // Atmosphere -> Deep Space sky & starfield transition
      const spaceBlend = THREE.MathUtils.clamp(sim.altKm / 110, 0, 1);
      SCRATCH_COLOR.copy(skyColor).lerp(spaceColor, spaceBlend);
      (scene.background as THREE.Color).copy(SCRATCH_COLOR);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(SCRATCH_COLOR);
        scene.fog.density = THREE.MathUtils.lerp(0.0022, 0.00015, spaceBlend);
      }
      starMat.opacity = THREE.MathUtils.lerp(0.12, 0.92, spaceBlend);

      // Update InstancedMesh smoke & flame particles (Zero GC)
      for (let i = 0; i < PLUME_POOL; i++) {
        const pt = pPool[i];
        if (!pt.active) {
          SCRATCH_SCALE.set(0, 0, 0);
          SCRATCH_MAT.compose(SCRATCH_VEC_A.set(0, -80, 0), SCRATCH_QUAT.identity(), SCRATCH_SCALE);
          plumeParticles.setMatrixAt(i, SCRATCH_MAT);
          continue;
        }
        pt.life -= rawDt;
        if (pt.life <= 0) {
          pt.active = false;
          continue;
        }
        pt.x += pt.vx * rawDt;
        pt.y += pt.vy * rawDt;
        pt.z += pt.vz * rawDt;
        if (pt.y < 0.4) {
          pt.y = 0.4;
          pt.vy = 1.8;
          pt.vx *= 1.35;
          pt.vz *= 1.35;
        }
        const f = pt.life / pt.maxLife;
        const s = pt.scale * (1.8 - f);
        SCRATCH_SCALE.set(s, s, s);
        SCRATCH_MAT.compose(SCRATCH_VEC_A.set(pt.x, pt.y, pt.z), SCRATCH_QUAT.identity(), SCRATCH_SCALE);
        plumeParticles.setMatrixAt(i, SCRATCH_MAT);
        plumeParticles.setColorAt(i, SCRATCH_COLOR.setRGB(pt.r, pt.g * f + 0.35 * (1 - f), pt.b + 0.45 * (1 - f)));
      }
      plumeParticles.instanceMatrix.needsUpdate = true;
      if (plumeParticles.instanceColor) plumeParticles.instanceColor.needsUpdate = true;

      // Camera Chase / Separation Auto-Tracking unless user grabbed controls
      if (!userInteracting) {
        if (camPresetRef.current === 'chase') {
          const focus = rocketAssembly.position;
          SCRATCH_VEC_A.set(focus.x + 14, focus.y + 8, focus.z + 24);
          camera.position.lerp(SCRATCH_VEC_A, Math.min(1, rawDt * 4.5));
          SCRATCH_VEC_B.set(focus.x, focus.y + 7, focus.z);
          controls.target.lerp(SCRATCH_VEC_B, Math.min(1, rawDt * 6));
        } else if (camPresetRef.current === 'separation') {
          stage2Group.getWorldPosition(SCRATCH_VEC_B);
          SCRATCH_VEC_A.set(SCRATCH_VEC_B.x - 10, SCRATCH_VEC_B.y + 3, SCRATCH_VEC_B.z + 18);
          camera.position.lerp(SCRATCH_VEC_A, Math.min(1, rawDt * 5));
          controls.target.lerp(SCRATCH_VEC_B, Math.min(1, rawDt * 6));
        }
      }

      controls.update();
      renderer.render(scene, camera);

      // Sync HUD telemetry at ~12Hz
      sim.telemetryTimer += rawDt;
      if (sim.telemetryTimer >= 0.08) {
        sim.telemetryTimer = 0;
        const atmDensity = Math.exp(-sim.altKm / 8.5);
        const speedMs = sim.velKms * 1000;
        const dynP = 0.5 * 1.225 * atmDensity * speedMs * speedMs / 1000;
        const gLoad = sim.phase === 'PRE_LAUNCH' ? 1.0 : sim.phase === 'ORBIT' ? 0.0 : p.thrustToWeight * (1.1 + sim.missionTime * 0.05);
        setTelemetry({
          phase: sim.phase,
          missionTime: sim.missionTime,
          altitudeKm: sim.altKm,
          velocityKms: sim.velKms,
          pitchDeg: sim.pitchDeg,
          stage1FuelPct: sim.fuel1,
          stage2FuelPct: sim.fuel2,
          dynPressureKpa: Math.min(48, dynP),
          gForce: Math.min(4.6, gLoad),
          stageSeparated: sim.stageSep,
          fairingJettisoned: sim.fairingSep
        });
      }

      if (isSoftwareGl) afterDraw(tick);
      else rafId = requestAnimationFrame(tick);
    };

    if (isSoftwareGl) afterDraw(tick);
    else rafId = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      clearTimeout(rafId);
      ro.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material.dispose();
        }
      });
      envRT.dispose();
      padTex.dispose();
      starGeo.dispose();
      starMat.dispose();
      trajGeo.dispose();
      renderer.dispose();
    };
  }, [onEarnXP, perfMode, playRocketSfx]);

  const phaseMeta = PHASE_LABELS[telemetry.phase];

  if (webglError) {
    return (
      <div className="p-8 rounded-xl border border-rose-500/40 bg-slate-950 text-center text-rose-300 text-sm">
        {isEn
          ? 'WebGL 3D context could not be initialized on this device.'
          : 'Thiết bị chưa hỗ trợ khởi tạo ngữ cảnh WebGL 3D.'}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[640px] sm:h-[700px] rounded-xl overflow-hidden border border-sky-500/35 bg-[#050b18] shadow-2xl select-none">
      {/* Isolated WebGL Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {contextLost && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/90 text-amber-300 text-sm font-mono">
          {isEn ? 'Restoring WebGL 3D Rocket Engine...' : 'Đang khôi phục GPU WebGL 3D...'}
        </div>
      )}

      {/* Minimal Top-Left Mission Telemetry Strip (Unobstructed center) */}
      <div className="pointer-events-none absolute top-3 left-3 z-20 max-w-md space-y-1.5">
        <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/88 border border-sky-400/40 text-xs font-mono text-sky-200">
          <Rocket className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-extrabold text-white">T+{telemetry.missionTime.toFixed(1)}s</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-300 font-bold">{isEn ? phaseMeta.en : phaseMeta.vi}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          <span className="px-2 py-1 rounded bg-slate-950/85 border border-slate-700 text-cyan-300 tabular-nums">
            ALT {telemetry.altitudeKm.toFixed(1)} km
          </span>
          <span className="px-2 py-1 rounded bg-slate-950/85 border border-slate-700 text-emerald-300 tabular-nums">
            VEL {telemetry.velocityKms.toFixed(2)} km/s
          </span>
          <span className="px-2 py-1 rounded bg-slate-950/85 border border-slate-700 text-amber-300 tabular-nums">
            {telemetry.gForce.toFixed(1)}G · Q {telemetry.dynPressureKpa.toFixed(1)} kPa
          </span>
          <span className="px-2 py-1 rounded bg-slate-950/85 border border-slate-700 text-slate-200 tabular-nums">
            S1 {telemetry.stage1FuelPct.toFixed(0)}% · S2 {telemetry.stage2FuelPct.toFixed(0)}%
          </span>
        </div>

        <div className="px-2.5 py-1.5 rounded bg-slate-950/82 border border-slate-800 text-[11px] text-slate-200 leading-snug">
          {isEn ? phaseMeta.descEn : phaseMeta.descVi}
        </div>
      </div>

      {/* Collapsible Bottom Control Dock (Zero Center Occlusion, No backdrop-blur) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-[920px] flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={() => setControlsVisible((v) => !v)}
          className="px-3 py-1 rounded-md bg-slate-950/90 border border-sky-400/40 text-[11px] font-mono font-bold text-sky-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          {controlsVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>
            {controlsVisible
              ? isEn ? 'Hide Launch Controls' : 'Thu gọn Bảng Phóng'
              : isEn ? 'Show Launch Controls' : 'Mở Bảng Phóng'}
          </span>
        </button>

        {controlsVisible && (
          <div className="w-full rounded-xl bg-slate-950/92 border border-slate-700/85 p-3 sm:p-4 space-y-3 text-xs text-slate-100 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => launchActionRef.current?.()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold flex items-center gap-1.5 cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  <span>
                    {telemetry.phase === 'PRE_LAUNCH'
                      ? isEn ? 'IGNITE & LAUNCH' : 'ĐÁNH LỬA & PHÓNG TÊN LỬA'
                      : telemetry.phase === 'ORBIT'
                      ? isEn ? 'RE-LAUNCH' : 'PHÓNG LẠI'
                      : isEn ? 'ASCENDING...' : 'ĐANG BAY LÊN QUỸ ĐẠO'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => resetActionRef.current?.()}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCutaway((c) => !c)}
                  className={`px-3 py-2 rounded-lg border font-bold flex items-center gap-1.5 cursor-pointer ${
                    cutaway
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Cutaway LOX/RP-1' : 'Mặt cắt Bình Nhiên liệu'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'pad', vi: 'Bệ Phóng', en: 'Pad' },
                    { id: 'chase', vi: 'Bám Tên Lửa', en: 'Chase' },
                    { id: 'separation', vi: 'Tách Tầng', en: 'Stage Sep' },
                    { id: 'horizon', vi: 'Quỹ Đạo', en: 'Horizon' }
                  ] as { id: CameraPreset; vi: string; en: string }[]
                ).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCamPreset(c.id);
                      applyCamRef.current?.(c.id);
                    }}
                    className={`px-2.5 py-1.5 rounded border text-[11px] font-bold cursor-pointer ${
                      camPreset === c.id
                        ? 'bg-sky-500/25 border-sky-400 text-sky-200'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    {isEn ? c.en : c.vi}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  className="p-2 rounded border border-slate-700 bg-slate-900 text-slate-200 cursor-pointer"
                  title={isEn ? 'Toggle Sound' : 'Bật/Tắt Âm Thanh'}
                >
                  {muted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Physics Tuners */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
              <label className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-300">T/W Ratio</span>
                  <span className="text-amber-300 font-bold">{params.thrustToWeight.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={1.15}
                  max={2.1}
                  step={0.05}
                  value={params.thrustToWeight}
                  onChange={(e) => setParams((prev) => ({ ...prev, thrustToWeight: Number(e.target.value) }))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-300">{isEn ? 'Gravity Turn' : 'Góc bẻ quỹ đạo'}</span>
                  <span className="text-sky-300 font-bold">{params.pitchKickDeg}°</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={38}
                  step={1}
                  value={params.pitchKickDeg}
                  onChange={(e) => setParams((prev) => ({ ...prev, pitchKickDeg: Number(e.target.value) }))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-300">{isEn ? 'Payload Mass' : 'Tải Vệ tinh'}</span>
                  <span className="text-emerald-300 font-bold">{params.payloadMassTons.toFixed(1)} T</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={18}
                  step={0.5}
                  value={params.payloadMassTons}
                  onChange={(e) => setParams((prev) => ({ ...prev, payloadMassTons: Number(e.target.value) }))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Orbit className="w-3 h-3" />
                    {isEn ? 'Time Scale' : 'Tốc độ mô phỏng'}
                  </span>
                  <span className="text-violet-300 font-bold">{params.timeScale.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={2.5}
                  step={0.25}
                  value={params.timeScale}
                  onChange={(e) => setParams((prev) => ({ ...prev, timeScale: Number(e.target.value) }))}
                  className="w-full accent-violet-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
