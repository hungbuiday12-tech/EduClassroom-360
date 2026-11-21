import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Eye,
  EyeOff,
  Flame,
  Gauge,
  Layers,
  Maximize2,
  Minimize2,
  RotateCcw,
  Volume2,
  VolumeX,
  Wind
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';

interface JetPropulsion3DLabProps {
  onEarnXP?: (xp: number) => void;
}

type EngineStageId = 'intake' | 'compressor' | 'combustor' | 'turbine' | 'nozzle';

interface BraytonStageInfo {
  id: EngineStageId;
  vi: string;
  en: string;
  formula: string;
  descVi: string;
  descEn: string;
}

const BRAYTON_STAGES: BraytonStageInfo[] = [
  {
    id: 'intake',
    vi: '1. Quạt Hút (Intake Fan)',
    en: '1. Intake Fan',
    formula: 'ṁ = ρ·A·V',
    descVi: 'Cánh quạt titan đường kính lớn hút khối khí lạnh, tách dòng Bypass (80%) và Core (20%).',
    descEn: 'Titanium wide-chord blades draw cold air and split 80% Bypass vs 20% Core flow.'
  },
  {
    id: 'compressor',
    vi: '2. Máy Nén (Compressor)',
    en: '2. Axial Compressor',
    formula: 'P₂/P₁ ≈ 32:1',
    descVi: '4 tầng rô-to nén khí liên tiếp tăng áp suất gấp 32 lần và nhiệt độ lên ~650°C.',
    descEn: 'Multi-stage axial rotors compress air adiabatically up to 32:1 pressure ratio and ~650°C.'
  },
  {
    id: 'combustor',
    vi: '3. Buồng Đốt (Combustor)',
    en: '3. Annular Combustor',
    formula: 'Q = ṁ·c_p·ΔT',
    descVi: 'Nhiên liệu Jet-A1 phun sương cháy đẳng áp đạt ~1750°C, giãn nở thể tích cực mạnh.',
    descEn: 'Atomized Jet-A1 burns at constant pressure reaching ~1750°C thermal peak.'
  },
  {
    id: 'turbine',
    vi: '4. Tua-bin (Turbine)',
    en: '4. High-Pressure Turbine',
    formula: 'W_t = W_c',
    descVi: 'Khí nóng làm quay tua-bin truyền công ngược trục đồng tâm để kéo quạt & máy nén phía trước.',
    descEn: 'Expanding hot gas drives turbine blades coupled via concentric shaft to drive compressor.'
  },
  {
    id: 'nozzle',
    vi: '5. Vòi Phun & Đốt Sau',
    en: '5. Nozzle & Mach Diamonds',
    formula: 'F = ṁ(V_e − V₀)',
    descVi: 'Vòi hội tụ-phân kỳ tăng tốc dòng khí phụt siêu thanh tạo sóng xung kích Mach Diamonds.',
    descEn: 'Convergent-divergent nozzle accelerates exhaust supersonic forming glowing Mach shock diamonds.'
  }
];

const FLOW_PARTICLES = 110;
const SCRATCH_VEC = new THREE.Vector3();
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
    return /SwiftShader|llvmpipe|Software|Basic Render/i.test(rendererStr);
  } catch {
    return false;
  }
}

export const JetPropulsion3DLab: React.FC<JetPropulsion3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode } = useBackgroundTheme();

  const mountRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const turbineOscRef = useRef<OscillatorNode | null>(null);
  const turbineGainRef = useRef<GainNode | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [throttle, setThrottle] = useState(68);
  const throttleRef = useRef(68);
  throttleRef.current = throttle;

  const [afterburner, setAfterburner] = useState(false);
  const afterburnerRef = useRef(false);
  afterburnerRef.current = afterburner;

  const [explodedPct, setExplodedPct] = useState(0);
  const explodedRef = useRef(0);
  explodedRef.current = explodedPct / 100;

  const [cutawayCowl, setCutawayCowl] = useState(true);
  const cutawayRef = useRef(true);
  cutawayRef.current = cutawayCowl;

  const [activeStage, setActiveStage] = useState<EngineStageId>('combustor');
  const activeStageRef = useRef<EngineStageId>('combustor');
  activeStageRef.current = activeStage;

  const [muted, setMuted] = useState(true);
  const [webglError, setWebglError] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const resetCamRef = useRef<(() => void) | null>(null);
  const focusStageCamRef = useRef<((st: EngineStageId) => void) | null>(null);

  const toggleJetAudio = useCallback(() => {
    setMuted((prevMuted) => {
      const nextMuted = !prevMuted;
      try {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return nextMuted;
        if (!audioCtxRef.current) audioCtxRef.current = new AC();
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') void ctx.resume();

        if (!nextMuted && !turbineOscRef.current) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(110 + throttleRef.current * 2.4, ctx.currentTime);
          gain.gain.setValueAtTime(0.035, ctx.currentTime);
          osc.connect(gain).connect(ctx.destination);
          osc.start();
          turbineOscRef.current = osc;
          turbineGainRef.current = gain;
        } else if (turbineGainRef.current) {
          turbineGainRef.current.gain.setTargetAtTime(nextMuted ? 0 : 0.038, ctx.currentTime, 0.08);
        }
      } catch {}
      return nextMuted;
    });
  }, []);

  useEffect(() => {
    if (!muted && turbineOscRef.current && audioCtxRef.current) {
      const freq = 95 + throttle * 2.7 + (afterburner ? 95 : 0);
      turbineOscRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.1);
    }
  }, [throttle, afterburner, muted]);

  const toggleFullscreen = () => {
    const el = rootRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => setIsFullscreen((f) => !f));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => setIsFullscreen(false));
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => {
    return () => {
      try {
        turbineOscRef.current?.stop();
        turbineOscRef.current?.disconnect();
      } catch {}
    };
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
    renderer.toneMappingExposure = 1.12;
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
    scene.background = new THREE.Color(0x060c1a);
    scene.fog = new THREE.FogExp2(0x060c1a, 0.016);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(
      45,
      (container.clientWidth || 960) / (container.clientHeight || 620),
      0.15,
      200
    );
    camera.position.set(6.4, 3.6, 8.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 3.2;
    controls.maxDistance = 24;
    controls.target.set(0, 1.8, 0);
    controls.update();

    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.78);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.1);
    keyLight.position.set(8, 12, 8);
    if (renderer.shadowMap.enabled) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    rimLight.position.set(-8, 5, -7);
    scene.add(rimLight);

    const burnerLight = new THREE.PointLight(0xff7b1c, 3.5, 14, 1.8);
    burnerLight.position.set(0.6, 1.9, 0);
    scene.add(burnerLight);

    // Test Cell Pedestal Floor (grounded at y = 0)
    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(18, 18, 0.2, 48),
      new THREE.MeshStandardMaterial({ color: 0x0b1324, roughness: 0.75, metalness: 0.25 })
    );
    floor.position.y = -0.1;
    floor.receiveShadow = renderer.shadowMap.enabled;
    scene.add(floor);

    const grid = new THREE.GridHelper(28, 28, 0x38bdf8, 0x1e293b);
    grid.position.y = 0.02;
    scene.add(grid);

    // ==================== COMPOSITE TURBOFAN ENGINE ON STAND ====================
    const engineRoot = new THREE.Group();
    scene.add(engineRoot);

    const brushedTitanium = new THREE.MeshPhysicalMaterial({
      color: 0xcbd5e1,
      roughness: 0.2,
      metalness: 0.92,
      anisotropy: 0.75
    });
    const darkAlloy = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.42,
      metalness: 0.85
    });
    const copperCoil = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.28,
      metalness: 0.88
    });
    const cowlMat = new THREE.MeshPhysicalMaterial({
      color: 0x334155,
      roughness: 0.26,
      metalness: 0.65,
      clearcoat: 0.75,
      transparent: true,
      opacity: 0.36,
      side: THREE.DoubleSide
    });

    // Test Stand Pylons grounded at y = 0
    [-1.6, 1.6].forEach((px) => {
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.9, 0.7), darkAlloy);
      pylon.position.set(px, 0.95, 0);
      pylon.castShadow = renderer.shadowMap.enabled;
      engineRoot.add(pylon);
    });

    const axisY = 2.05;

    // Central Concentric Drive Shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 6.2, 20), copperCoil);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(0, axisY, 0);
    engineRoot.add(shaft);

    // Outer Bypass Nacelle Cowl (LatheGeometry along X)
    const cowlProfile = [
      new THREE.Vector2(1.52, -2.5),
      new THREE.Vector2(1.72, -1.6),
      new THREE.Vector2(1.74, 0.2),
      new THREE.Vector2(1.56, 1.8),
      new THREE.Vector2(1.26, 2.7)
    ];
    const cowlGeo = new THREE.LatheGeometry(cowlProfile, 36, 0, Math.PI * 1.45);
    cowlGeo.rotateZ(-Math.PI / 2);
    const cowlMesh = new THREE.Mesh(cowlGeo, cowlMat);
    cowlMesh.position.set(0, axisY, 0);
    engineRoot.add(cowlMesh);

    // --- 1. INTAKE FAN ASSEMBLY ---
    const intakeGroup = new THREE.Group();
    intakeGroup.position.set(-2.2, axisY, 0);
    engineRoot.add(intakeGroup);

    const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.95, 24), darkAlloy);
    spinner.rotation.z = Math.PI / 2;
    spinner.position.x = -0.35;
    intakeGroup.add(spinner);

    const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.36, 24), brushedTitanium);
    fanHub.rotation.z = Math.PI / 2;
    intakeGroup.add(fanHub);

    const fanRotor = new THREE.Group();
    intakeGroup.add(fanRotor);
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.18, 0.24), brushedTitanium);
      blade.position.set(0, Math.cos(a) * 0.95, Math.sin(a) * 0.95);
      blade.rotation.x = a;
      blade.rotation.y = 0.42;
      fanRotor.add(blade);
    }
    const intakeShockMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const intakeShockRing = new THREE.Mesh(new THREE.RingGeometry(1.18, 1.38, 32), intakeShockMat);
    intakeShockRing.rotation.y = Math.PI / 2;
    intakeShockRing.position.x = -0.58;
    intakeGroup.add(intakeShockRing);

    // --- 2. 4-STAGE AXIAL COMPRESSOR ---
    const compressorGroup = new THREE.Group();
    compressorGroup.position.set(-0.9, axisY, 0);
    engineRoot.add(compressorGroup);

    const compRotors: THREE.Group[] = [];
    for (let st = 0; st < 4; st++) {
      const rGroup = new THREE.Group();
      rGroup.position.x = -0.45 + st * 0.32;
      const radius = 0.92 - st * 0.08;
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 20), darkAlloy);
      hub.rotation.z = Math.PI / 2;
      rGroup.add(hub);
      for (let b = 0; b < 14; b++) {
        const a = (b / 14) * Math.PI * 2;
        const vane = new THREE.Mesh(new THREE.BoxGeometry(0.04, radius - 0.24, 0.14), brushedTitanium);
        vane.position.set(0, Math.cos(a) * (radius * 0.62), Math.sin(a) * (radius * 0.62));
        vane.rotation.x = a;
        vane.rotation.y = 0.38;
        rGroup.add(vane);
      }
      compressorGroup.add(rGroup);
      compRotors.push(rGroup);
    }

    // --- 3. ANNULAR COMBUSTOR CHAMBER ---
    const combustorGroup = new THREE.Group();
    combustorGroup.position.set(0.45, axisY, 0);
    engineRoot.add(combustorGroup);

    const combGlowMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xff5a1f,
      emissiveIntensity: 1.6,
      roughness: 0.3,
      metalness: 0.4
    });
    const flameRing = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.18, 16, 36), combGlowMat);
    flameRing.rotation.y = Math.PI / 2;
    combustorGroup.add(flameRing);

    const combCasing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.84, 0.84, 0.9, 28, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.35,
        metalness: 0.82,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
      })
    );
    combCasing.rotation.z = Math.PI / 2;
    combustorGroup.add(combCasing);

    // --- 4. 2-STAGE TURBINE ---
    const turbineGroup = new THREE.Group();
    turbineGroup.position.set(1.5, axisY, 0);
    engineRoot.add(turbineGroup);

    const turbRotors: THREE.Group[] = [];
    for (let st = 0; st < 2; st++) {
      const tGroup = new THREE.Group();
      tGroup.position.x = -0.18 + st * 0.36;
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 20), copperCoil);
      hub.rotation.z = Math.PI / 2;
      tGroup.add(hub);
      for (let b = 0; b < 16; b++) {
        const a = (b / 16) * Math.PI * 2;
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.62, 0.15), copperCoil);
        blade.position.set(0, Math.cos(a) * 0.54, Math.sin(a) * 0.54);
        blade.rotation.x = a;
        blade.rotation.y = -0.45;
        tGroup.add(blade);
      }
      turbineGroup.add(tGroup);
      turbRotors.push(tGroup);
    }

    // --- 5. VARIABLE EXHAUST NOZZLE & MACH SHOCK DIAMONDS ---
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.set(2.55, axisY, 0);
    engineRoot.add(nozzleGroup);

    const nozzleCone = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.68, 1.15, 28, 1, true), darkAlloy);
    nozzleCone.rotation.z = Math.PI / 2;
    nozzleGroup.add(nozzleCone);

    const exhaustConeMat = new THREE.MeshBasicMaterial({
      color: 0xff8c1a,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const exhaustPlume = new THREE.Mesh(new THREE.ConeGeometry(0.62, 3.6, 24), exhaustConeMat);
    exhaustPlume.rotation.z = -Math.PI / 2;
    exhaustPlume.position.x = 2.2;
    nozzleGroup.add(exhaustPlume);

    const machDiamonds: THREE.Mesh[] = [];
    for (let d = 0; d < 3; d++) {
      const dia = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.32 - d * 0.06, 0),
        new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      dia.scale.set(1.7, 0.7, 0.7);
      dia.position.x = 1.2 + d * 0.95;
      nozzleGroup.add(dia);
      machDiamonds.push(dia);
    }

    // --- THERMAL AIRFLOW PARTICLE STREAM ---
    const flowGeo = new THREE.SphereGeometry(0.055, 8, 8);
    const flowMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9 });
    const flowInstanced = new THREE.InstancedMesh(flowGeo, flowMat, FLOW_PARTICLES);
    flowInstanced.frustumCulled = false;
    flowInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(flowInstanced);

    const particles = Array.from({ length: FLOW_PARTICLES }, (_, i) => ({
      x: -4.2 + (i / FLOW_PARTICLES) * 9.5,
      r: 0.35 + ((i * 19) % 100) / 100 * 1.1,
      theta: ((i * 73) % 360) * (Math.PI / 180),
      bypass: i % 3 === 0
    }));

    resetCamRef.current = () => {
      camera.position.set(6.4, 3.6, 8.2);
      controls.target.set(0, 1.8, 0);
      controls.update();
    };

    focusStageCamRef.current = (st: EngineStageId) => {
      const targetX =
        st === 'intake' ? -2.2 : st === 'compressor' ? -0.9 : st === 'combustor' ? 0.45 : st === 'turbine' ? 1.5 : 2.8;
      controls.target.set(targetX, axisY, 0);
      camera.position.set(targetX + 2.2, axisY + 1.4, 5.2);
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
        const s = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (s === gl.UNSIGNALED) rafId = window.setTimeout(poll, 5);
        else {
          gl.deleteSync(sync);
          rafId = window.setTimeout(cb, 80);
        }
      };
      rafId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (!alive) return;
      const dt = Math.min(0.05, clock.getDelta());
      const elapsed = clock.elapsedTime;
      const thr = throttleRef.current / 100;
      const ab = afterburnerRef.current;
      const exp = explodedRef.current;

      // Smoothly separate 5 axial engine modules along X when Exploded View increases
      intakeGroup.position.x = THREE.MathUtils.damp(intakeGroup.position.x, -2.2 - exp * 2.1, 7, dt);
      compressorGroup.position.x = THREE.MathUtils.damp(compressorGroup.position.x, -0.9 - exp * 0.9, 7, dt);
      combustorGroup.position.x = THREE.MathUtils.damp(combustorGroup.position.x, 0.45, 7, dt);
      turbineGroup.position.x = THREE.MathUtils.damp(turbineGroup.position.x, 1.5 + exp * 0.95, 7, dt);
      nozzleGroup.position.x = THREE.MathUtils.damp(nozzleGroup.position.x, 2.55 + exp * 2.1, 7, dt);

      cowlMat.opacity = THREE.MathUtils.damp(cowlMat.opacity, cutawayRef.current ? 0.25 : 0.96, 8, dt);

      // Spin fan, compressor, and turbine proportional to throttle RPM
      const omega = 2.0 + thr * 18.0 + (ab ? 4.0 : 0);
      fanRotor.rotation.x += dt * omega * 0.65;
      compRotors.forEach((cr, i) => {
        cr.rotation.x += dt * omega * (1.0 + i * 0.14);
      });
      turbRotors.forEach((tr, i) => {
        tr.rotation.x += dt * omega * (1.35 + i * 0.12);
      });

      // Combustor & Exhaust glow
      combGlowMat.emissiveIntensity = 0.6 + thr * 2.0 + (ab ? 1.4 : 0) + Math.sin(elapsed * 26) * 0.18;
      burnerLight.intensity = 1.5 + thr * 5.0 + (ab ? 5.0 : 0);
      exhaustConeMat.opacity = 0.25 + thr * 0.5 + (ab ? 0.22 : 0);
      exhaustConeMat.color.setHex(ab ? 0x38bdf8 : 0xff8c1a);
      const plumeLen = 0.55 + thr * 0.9 + (ab ? 0.65 : 0) + Math.sin(elapsed * 32) * 0.05;
      exhaustPlume.scale.set(1, plumeLen, 1);

      machDiamonds.forEach((md, idx) => {
        const m = md.material as THREE.MeshBasicMaterial;
        m.opacity = ab ? 0.72 - idx * 0.16 : thr > 0.72 ? 0.28 : 0;
        md.position.x = 1.15 + idx * (0.8 + (ab ? 0.2 : 0));
      });

      const machVal = 0.35 + thr * 0.88 + (ab ? 0.85 : 0);
      intakeShockMat.opacity = machVal >= 1.0 ? 0.35 + Math.sin(elapsed * 18) * 0.15 : 0;
      intakeShockRing.scale.setScalar(1 + Math.sin(elapsed * 14) * 0.04);

      // Update thermal flow particles (cool blue -> compressed cyan -> combustor orange -> supersonic violet/gold)
      const flowSpeed = 3.2 + thr * 11.5 + (ab ? 4.5 : 0);
      for (let i = 0; i < FLOW_PARTICLES; i++) {
        const pt = particles[i];
        pt.x += dt * flowSpeed * (pt.x > 0.4 ? 1.55 : 1.0);
        pt.theta += dt * (pt.bypass ? 0.5 : 2.6 + thr * 3.0);
        if (pt.x > 6.2) pt.x = -4.2;

        const rad = pt.bypass ? Math.max(0.95, pt.r * 1.15) : Math.min(0.68, pt.r * 0.62);
        const py = axisY + Math.cos(pt.theta) * rad;
        const pz = Math.sin(pt.theta) * rad;
        SCRATCH_SCALE.set(1 + thr * 0.4, 0.75, 0.75);
        SCRATCH_MAT.compose(SCRATCH_VEC.set(pt.x, py, pz), SCRATCH_QUAT.identity(), SCRATCH_SCALE);
        flowInstanced.setMatrixAt(i, SCRATCH_MAT);

        if (pt.bypass || pt.x < -0.9) {
          SCRATCH_COLOR.setHex(0x38bdf8); // cold intake/bypass blue
        } else if (pt.x < 0.25) {
          SCRATCH_COLOR.setHex(0xfbbf24); // compressed hot yellow
        } else if (pt.x < 2.2) {
          SCRATCH_COLOR.setHex(0xff5a1f); // combustion orange-red
        } else {
          SCRATCH_COLOR.setHex(ab ? 0x60a5fa : 0xfb923c); // nozzle supersonic jet
        }
        flowInstanced.setColorAt(i, SCRATCH_COLOR);
      }
      flowInstanced.instanceMatrix.needsUpdate = true;
      if (flowInstanced.instanceColor) flowInstanced.instanceColor.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);

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
      renderer.dispose();
    };
  }, [perfMode]);

  const thrustKn = Math.round(14 + throttle * 1.15 + (afterburner ? 52 : 0));
  const egtC = Math.round(410 + throttle * 5.2 + (afterburner ? 420 : 0));
  const rpmPct = Math.round(28 + throttle * 0.72);
  const machOut = (0.35 + (throttle / 100) * 0.88 + (afterburner ? 0.85 : 0)).toFixed(2);
  const tsfc = (15.5 + (100 - throttle) * 0.09 + (afterburner ? 18.4 : 0)).toFixed(1);
  const thermalEffPct = Math.round(29 + (throttle / 100) * 16 - (afterburner ? 7 : 0));
  const stageInfo = BRAYTON_STAGES.find((s) => s.id === activeStage) || BRAYTON_STAGES[2];

  // Dynamic Brayton Cycle P-V coordinates driven by throttle & afterburner
  const pvPeakY = Math.max(8, 30 - (throttle / 100) * 18);
  const pvRightX = Math.min(104, 62 + (throttle / 100) * 20 + (afterburner ? 18 : 0));
  const pvPath = `M 86 44 C 54 42, 42 ${pvPeakY + 8}, 36 ${pvPeakY} L ${pvRightX} ${pvPeakY} C ${pvRightX + 4} 28, ${pvRightX + 10} 38, ${pvRightX} 44 Z`;

  if (webglError) {
    return (
      <div className="p-8 rounded-xl border border-rose-500/40 bg-slate-950 text-center text-rose-300 text-sm">
        {isEn ? 'WebGL 3D context unavailable.' : 'Không thể khởi tạo WebGL 3D.'}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`flex flex-col lg:block lg:relative w-full rounded-xl overflow-hidden border border-amber-500/35 bg-[#060c1a] shadow-2xl select-none ${
        isFullscreen ? 'fixed inset-0 z-[140] h-[100dvh] rounded-none border-0 overflow-y-auto lg:overflow-hidden' : 'lg:h-[700px]'
      }`}
    >
      {/* Top-Left Live Thermodynamic Telemetry + Brayton P-V Diagram */}
      <div className="relative lg:pointer-events-none lg:absolute lg:top-3 lg:left-3 z-20 p-2.5 lg:p-0 bg-slate-950/95 lg:bg-transparent border-b border-slate-800 lg:border-b-0 lg:max-w-lg space-y-1.5 shrink-0">
        <div className="lg:pointer-events-auto flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-amber-400/40 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <Gauge className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-extrabold text-white">{thrustKn} kN</span>
            <span className="text-orange-300">{egtC}°C</span>
            <span className="text-cyan-300">N1 {rpmPct}%</span>
            <span className="text-sky-300 font-bold">M {machOut}</span>
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="min-h-[32px] min-w-[32px] inline-flex items-center justify-center rounded border border-slate-700 bg-slate-900 text-slate-200 cursor-pointer"
            title={isEn ? 'Fullscreen' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="px-3 py-2 rounded-lg bg-slate-950/88 border border-slate-700/80 text-[11px] flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 font-mono font-bold text-amber-300">
              <span>{isEn ? stageInfo.en : stageInfo.vi}</span>
              <span className="text-cyan-300">{stageInfo.formula}</span>
            </div>
            <p className="text-slate-200 leading-snug">{isEn ? stageInfo.descEn : stageInfo.descVi}</p>
            <div className="text-[10px] font-mono text-emerald-300 pt-0.5">
              TSFC: {tsfc} g/(kN·s) · η_th: {thermalEffPct}%
            </div>
          </div>

          {/* Interactive Brayton Cycle P-V Diagram */}
          <svg viewBox="0 0 116 52" className="hidden sm:block w-28 h-12 shrink-0 rounded bg-slate-900/90 border border-slate-800 p-0.5">
            <line x1="12" y1="6" x2="12" y2="46" stroke="#475569" strokeWidth="1" />
            <line x1="12" y1="46" x2="110" y2="46" stroke="#475569" strokeWidth="1" />
            <path d={pvPath} fill={afterburner ? 'rgba(56,189,248,0.22)' : 'rgba(245,158,11,0.22)'} stroke={afterburner ? '#38bdf8' : '#f59e0b'} strokeWidth="1.6" />
            <text x="4" y="13" fill="#94a3b8" fontSize="6" fontFamily="monospace">P</text>
            <text x="102" y="44" fill="#94a3b8" fontSize="6" fontFamily="monospace">V</text>
          </svg>
        </div>
      </div>

      {/* Unobstructed 3D Viewport */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1 min-h-[260px] lg:absolute lg:inset-0 lg:h-full' : 'h-[290px] sm:h-[380px] lg:absolute lg:inset-0 lg:h-full'}`}>
        <div ref={mountRef} className="w-full h-full" />
        {contextLost && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/90 text-amber-300 text-sm font-mono">
            Restoring WebGL Jet Turbine...
          </div>
        )}
      </div>

      {/* Collapsible Bottom Dock */}
      <div className="relative lg:absolute lg:bottom-3 lg:left-1/2 lg:-translate-x-1/2 z-20 w-full lg:w-[95%] lg:max-w-[940px] flex flex-col items-center gap-1.5 p-2 lg:p-0 bg-slate-950 lg:bg-transparent border-t border-slate-800 lg:border-t-0 shrink-0">
        <button
          type="button"
          onClick={() => setControlsVisible((v) => !v)}
          className="min-h-[36px] px-3 py-1 rounded-md bg-slate-950/92 border border-amber-400/40 text-[11px] font-mono font-bold text-amber-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          {controlsVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>
            {controlsVisible
              ? isEn ? 'Hide Turbine Controls' : 'Thu gọn Bảng Tua-bin'
              : isEn ? 'Show Turbine Controls' : 'Mở Bảng Tua-bin'}
          </span>
        </button>

        {controlsVisible && (
          <div className="w-full max-h-[38dvh] lg:max-h-none overflow-y-auto rounded-xl bg-slate-950/94 border border-slate-700/85 p-3 sm:p-4 space-y-2.5 text-xs text-slate-100 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap gap-1.5 w-full sm:w-auto scrollbar-none pb-0.5 sm:pb-0">
                {BRAYTON_STAGES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setActiveStage(st.id);
                      focusStageCamRef.current?.(st.id);
                      onEarnXP?.(10);
                    }}
                    className={`min-h-[36px] px-2.5 py-1 rounded border text-[11px] font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                      activeStage === st.id
                        ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    {isEn ? st.en : st.vi}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {/* Flight Regime Presets */}
                {(
                  [
                    { label: 'Takeoff 95%', thr: 95, ab: false },
                    { label: 'M0.85 Cruise', thr: 58, ab: false },
                    { label: 'M2.2 Sprint', thr: 100, ab: true }
                  ] as const
                ).map((pr) => (
                  <button
                    key={pr.label}
                    type="button"
                    onClick={() => {
                      setThrottle(pr.thr);
                      setAfterburner(pr.ab);
                    }}
                    className="min-h-[36px] px-2 py-1 rounded border border-slate-700 bg-slate-900 hover:border-amber-400 text-[10px] font-mono text-slate-200 cursor-pointer"
                  >
                    {pr.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCutawayCowl((c) => !c)}
                  className={`min-h-[36px] px-2.5 py-1 rounded border text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                    cutawayCowl ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Cutaway' : 'Mặt cắt'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAfterburner((a) => !a)}
                  className={`min-h-[36px] px-2.5 py-1 rounded border text-[11px] font-extrabold flex items-center gap-1 cursor-pointer ${
                    afterburner
                      ? 'bg-sky-500 text-slate-950 border-sky-300'
                      : 'bg-slate-900 border-slate-700 text-orange-300'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Afterburner' : 'Đốt Sau'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => resetCamRef.current?.()}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded border border-slate-700 bg-slate-900 text-slate-200 cursor-pointer"
                  title="Reset Camera"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={toggleJetAudio}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded border border-slate-700 bg-slate-900 text-slate-200 cursor-pointer"
                  title={isEn ? 'Jet Audio' : 'Âm thanh Tua-bin'}
                >
                  {muted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <label className="space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-orange-400" />
                    {isEn ? 'Throttle Level' : 'Cần Ga Động Cơ (Throttle)'}
                  </span>
                  <span className="text-amber-300 font-bold">{throttle}%</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={100}
                  step={1}
                  value={throttle}
                  onChange={(e) => setThrottle(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    {isEn ? 'Axial Exploded View' : 'Tách Lớp Cơ Khí Dọc Trục'}
                  </span>
                  <span className="text-cyan-300 font-bold">{explodedPct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={explodedPct}
                  onChange={(e) => setExplodedPct(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
