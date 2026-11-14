import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  RotateCcw,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Zap,
  Activity,
  Waves,
  Atom,
  ArrowLeft,
  StepForward,
  Plus,
  Minus,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ViewportPortal } from '../common/ViewportPortal';

interface Numeric3DControlProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  accentClass: string;
  onChange: (val: number) => void;
}

const Numeric3DControl: React.FC<Numeric3DControlProps> = ({
  label,
  unit,
  value,
  min,
  max,
  step,
  accentClass,
  onChange,
}) => {
  const [draft, setDraft] = useState<string>(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDraft(String(value));
  }, [value, focused]);

  const handleText = (raw: string) => {
    setDraft(raw);
    const parsed = parseFloat(raw);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-slate-300 truncate">{label}:</span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onChange(Number((value - step).toFixed(4)))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            title={`Giảm ${step}`}
          >
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="number"
            step={step}
            value={focused ? draft : String(value)}
            onFocus={() => {
              setFocused(true);
              setDraft(String(value));
            }}
            onBlur={() => {
              setFocused(false);
              setDraft(String(value));
            }}
            onChange={(e) => handleText(e.target.value)}
            className="w-16 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 focus:border-amber-500 text-right font-mono font-bold text-white text-xs outline-none"
          />
          <button
            type="button"
            onClick={() => onChange(Number((value + step).toFixed(4)))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            title={`Tăng ${step}`}
          >
            <Plus className="w-3 h-3" />
          </button>
          <span className="text-[11px] text-slate-400 font-mono min-w-[28px]">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${accentClass} h-1.5 cursor-pointer`}
      />
    </div>
  );
};

export type Physics3DMode =
  | 'pendulum_spring'
  | 'projectile_3d'
  | 'lorentz_helix'
  | 'wave_ripple'
  | 'bohr_atom'
  | 'optics_3d'
  | 'kinematics_3d'
  | 'thermal_gas_3d';

interface Physics3DViewProps {
  initialMode?: Physics3DMode;
  onBack?: () => void;
}

export const Physics3DView: React.FC<Physics3DViewProps> = ({ initialMode = 'pendulum_spring', onBack }) => {
  const { t } = useLanguage();
  const mountRef = useRef<HTMLDivElement>(null);

  // States
  const [mode, setMode] = useState<Physics3DMode>(initialMode);
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);
  const [isRunning, setIsRunning] = useState(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsExpanded, setIsControlsExpanded] = useState(true);

  // Simulation physics parameters
  // 1. Pendulum / Spring
  const [mass, setMass] = useState(1.0); // kg
  const [springK, setSpringK] = useState(40); // N/m
  const [gravityPreset, setGravityPreset] = useState<'earth' | 'moon' | 'mars'>('earth');

  // 2. Projectile
  const [projAngle, setProjAngle] = useState(45); // degrees
  const [projV0, setProjV0] = useState(18); // m/s

  // 3. Lorentz
  const [magneticB, setMagneticB] = useState(2.0); // Tesla
  const [particleSpeed, setParticleSpeed] = useState(4.0);

  // 4. Wave Ripple
  const [waveFrequency, setWaveFrequency] = useState(2.5); // Hz
  const [sourceDistance, setSourceDistance] = useState(4.0); // m

  // 5. Bohr Atom
  const [quantumN, setQuantumN] = useState(2); // level n = 1, 2, 3, 4

  // 6. Optics 3D
  const [focalLength3D, setFocalLength3D] = useState(2.0); // m (scaled units)
  const [objectDist3D, setObjectDist3D] = useState(3.6); // d
  const [isDiverging3D, setIsDiverging3D] = useState(false);

  // 7. Kinematics & Vector 3D
  const [kinV0, setKinV0] = useState(2.5);
  const [kinAccel, setKinAccel] = useState(1.2);
  const [vecAngle, setVecAngle] = useState(45);

  // 8. Thermal Gas 3D
  const [gasTempK, setGasTempK] = useState(350); // Kelvin
  const [gasVolumeFactor, setGasVolumeFactor] = useState(1.0); // Piston factor 0.55 -> 1.4

  // Refs for animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const isRunningRef = useRef<boolean>(isRunning);
  const simSpeedRef = useRef<number>(simSpeed);
  const stepTriggerRef = useRef<number>(0);
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);
  useEffect(() => {
    simSpeedRef.current = simSpeed;
  }, [simSpeed]);
  const simStateRef = useRef({
    time: 0,
    projT: 0,
    particlePos: new THREE.Vector3(0, 0, 0),
    particleVel: new THREE.Vector3(0, 0, 0),
    electronAngle: 0,
  });

  const handleStepOnce = () => {
    setIsRunning(false);
    simStateRef.current.time += 0.05;
    simStateRef.current.projT += 0.05;
    simStateRef.current.electronAngle += 0.15;
    stepTriggerRef.current += 1;
  };

  const handleReset3D = () => {
    simStateRef.current.time = 0;
    simStateRef.current.projT = 0;
    simStateRef.current.electronAngle = 0;
    stepTriggerRef.current += 1;
  };

  const getGravityValue = () => {
    if (gravityPreset === 'moon') return 1.62;
    if (gravityPreset === 'mars') return 3.72;
    return 9.8;
  };

  // Escape key to exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFullscreen]);

  // Initialize Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.025);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 300),
      0.1,
      100
    );
    camera.position.set(0, 6, 12);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 30;
    controls.minDistance = 2;

    // Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x88bbff, 0.8);
    fillLight.position.set(-6, -4, -6);
    scene.add(fillLight);

    // Grid Floor
    const grid = new THREE.GridHelper(20, 20, 0x3b82f6, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    // Dynamic models group
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicGroupRef.current = dynamicGroup;

    // Animation loop
    let frameId = 0;
    let lastTime = performance.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (isRunningRef.current) {
        const effDt = dt * simSpeedRef.current;
        simStateRef.current.time += effDt;
        simStateRef.current.projT += effDt;
        simStateRef.current.electronAngle += effDt * 3.0;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler + ResizeObserver
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width <= 0 || height <= 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    if (resizeObserver) resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Construct and animate 3D scene elements per tick
  useEffect(() => {
    const group = dynamicGroupRef.current;
    if (!group) return;

    // Clear previous geometries safely
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as any).geometry) (child as any).geometry.dispose();
      if ((child as any).material) {
        if (Array.isArray((child as any).material)) {
          (child as any).material.forEach((m: any) => m.dispose());
        } else {
          (child as any).material.dispose();
        }
      }
    }

    // -------------------------------------------------------------
    // SCENE 1: CON LẮC ĐƠN & CON LẮC LÒ XO 3D
    // -------------------------------------------------------------
    if (mode === 'pendulum_spring') {
      const g = getGravityValue();
      const safeMass = Math.max(0.05, mass);
      const safeK = Math.max(0.5, springK);
      const omega = Math.sqrt(safeK / safeMass);

      // Support Beam
      const beamGeo = new THREE.BoxGeometry(7, 0.2, 0.5);
      const beamMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, 5, 0);
      group.add(beam);

      // Spring mount position: (-2, 5, 0)
      // Pendulum mount position: (2, 5, 0)

      // Spring Bob
      const springBobGeo = new THREE.SphereGeometry(0.5, 32, 32);
      const springBobMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.6, roughness: 0.2 });
      const springBob = new THREE.Mesh(springBobGeo, springBobMat);
      springBob.position.set(-2, 2.5, 0);
      group.add(springBob);

      // Spring Coil (Helix)
      const numTurns = 12;
      const springRadius = 0.25;
      const springCurvePoints: THREE.Vector3[] = [];
      const steps = 120;
      for (let i = 0; i <= steps; i++) {
        const tVal = i / steps;
        const angle = tVal * numTurns * Math.PI * 2;
        const x = -2 + Math.cos(angle) * springRadius;
        const z = Math.sin(angle) * springRadius;
        const y = 5 - tVal * 2.5;
        springCurvePoints.push(new THREE.Vector3(x, y, z));
      }
      const springCurve = new THREE.CatmullRomCurve3(springCurvePoints);
      const springTubeGeo = new THREE.TubeGeometry(springCurve, 100, 0.04, 8, false);
      const springTubeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
      const springMesh = new THREE.Mesh(springTubeGeo, springTubeMat);
      group.add(springMesh);

      // Pendulum String & Bob
      const pendLen = 3.5;
      const pendBobGeo = new THREE.SphereGeometry(0.45, 32, 32);
      const pendBobMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.7, roughness: 0.2 });
      const pendBob = new THREE.Mesh(pendBobGeo, pendBobMat);
      group.add(pendBob);

      const pendLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(2, 5, 0), new THREE.Vector3(2, 1.5, 0)]);
      const pendLineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
      const pendLine = new THREE.Line(pendLineGeo, pendLineMat);
      group.add(pendLine);

      // Tick update for spring and pendulum
      let lastStepSeen = -1;
      const updateInterval = setInterval(() => {
        if (!isRunning && lastStepSeen === stepTriggerRef.current) return;
        lastStepSeen = stepTriggerRef.current;
        const tNow = simStateRef.current.time;
        // Spring Y:
        const springY = 2.5 + Math.sin(omega * tNow) * 1.2;
        springBob.position.y = springY;

        // Rebuild spring tube with current height
        const currentPoints: THREE.Vector3[] = [];
        const currentH = 5 - springY;
        for (let i = 0; i <= steps; i++) {
          const tVal = i / steps;
          const angle = tVal * numTurns * Math.PI * 2;
          const x = -2 + Math.cos(angle) * springRadius;
          const z = Math.sin(angle) * springRadius;
          const y = 5 - tVal * currentH;
          currentPoints.push(new THREE.Vector3(x, y, z));
        }
        springMesh.geometry.dispose();
        springMesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(currentPoints), 100, 0.04, 8, false);

        // Pendulum angle theta:
        const omegaP = Math.sqrt(g / pendLen);
        const theta = Math.sin(omegaP * tNow) * 0.55;
        const pendX = 2 + Math.sin(theta) * pendLen;
        const pendY = 5 - Math.cos(theta) * pendLen;
        pendBob.position.set(pendX, pendY, 0);

        pendLine.geometry.dispose();
        pendLine.geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(2, 5, 0),
          new THREE.Vector3(pendX, pendY, 0),
        ]);
      }, 30);

      return () => clearInterval(updateInterval);
    }

    // -------------------------------------------------------------
    // SCENE 2: NÉM XIÊN 3D (3D PROJECTILE CANNON)
    // -------------------------------------------------------------
    else if (mode === 'projectile_3d') {
      const g = getGravityValue();
      const safeAngle = Math.max(1, Math.min(89, projAngle));
      const safeV0 = Math.max(0.5, projV0);
      const rad = (safeAngle * Math.PI) / 180;
      const v0x = safeV0 * Math.cos(rad);
      const v0y = safeV0 * Math.sin(rad);
      const tMax = Math.max(0.1, (2 * v0y) / g);

      // Cannon Base & Barrel
      const cannonGroup = new THREE.Group();
      const baseGeo = new THREE.CylinderGeometry(0.8, 1.0, 0.4, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      cannonGroup.add(new THREE.Mesh(baseGeo, baseMat));

      const barrelGeo = new THREE.CylinderGeometry(0.25, 0.3, 2.0, 16);
      barrelGeo.translate(0, 1.0, 0);
      const barrelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 });
      const barrel = new THREE.Mesh(barrelGeo, barrelMat);
      barrel.rotation.z = -rad;
      cannonGroup.add(barrel);
      cannonGroup.position.set(-6, 0.2, 0);
      group.add(cannonGroup);

      // Projectile Cannon Ball
      const ballGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const ballMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.7 });
      const ball = new THREE.Mesh(ballGeo, ballMat);
      group.add(ball);

      // Trajectory Path (Dotted curve)
      const pathPoints: THREE.Vector3[] = [];
      const numPts = 60;
      for (let i = 0; i <= numPts; i++) {
        const tCur = (i / numPts) * tMax;
        const px = -6 + v0x * tCur * 0.4;
        const py = Math.max(0, 0.2 + (v0y * tCur - 0.5 * g * tCur * tCur) * 0.4);
        pathPoints.push(new THREE.Vector3(px, py, 0));
      }
      const pathGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
      const pathMat = new THREE.LineDashedMaterial({ color: 0x38bdf8, dashSize: 0.2, gapSize: 0.1 });
      const pathLine = new THREE.Line(pathGeo, pathMat);
      pathLine.computeLineDistances();
      group.add(pathLine);

      // Target Ring on the ground
      const targetDist = -6 + v0x * tMax * 0.4;
      const ringGeo = new THREE.RingGeometry(0.4, 0.6, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(targetDist, 0.02, 0);
      group.add(ring);

      let lastStepSeen = -1;
      const updateInterval = setInterval(() => {
        if (!isRunning && lastStepSeen === stepTriggerRef.current) return;
        lastStepSeen = stepTriggerRef.current;
        const currentSimT = (simStateRef.current.projT % (tMax + 0.8));
        if (currentSimT <= tMax) {
          const bx = -6 + v0x * currentSimT * 0.4;
          const by = Math.max(0, 0.2 + (v0y * currentSimT - 0.5 * g * currentSimT * currentSimT) * 0.4);
          ball.position.set(bx, by, 0);
          ball.visible = true;
        } else {
          ball.visible = false;
        }
      }, 30);

      return () => clearInterval(updateInterval);
    }

    // -------------------------------------------------------------
    // SCENE 3: TỪ TRƯỜNG LORENTZ & QUỸ ĐẠO XOẮN ỐC 3D (HELIX)
    // -------------------------------------------------------------
    else if (mode === 'lorentz_helix') {
      // 3D Magnetic Field Lines (Arrows pointing along Z)
      const fieldGridSize = 3;
      for (let ix = -fieldGridSize; ix <= fieldGridSize; ix += 2) {
        for (let iy = 1; iy <= 5; iy += 2) {
          const arrow = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(ix, iy, -4),
            8,
            0x3b82f6,
            0.4,
            0.2
          );
          group.add(arrow);
        }
      }

      // Charged Particle (Proton / Electron)
      const partGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const partMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xef4444,
        emissiveIntensity: 0.5,
      });
      const particle = new THREE.Mesh(partGeo, partMat);
      group.add(particle);

      // Trajectory Helix Path
      const helixPoints: THREE.Vector3[] = [];
      const R_cyclotron = Math.min(4.5, Math.max(0.2, Math.abs(particleSpeed) / Math.max(0.2, Math.abs(magneticB))));
      const vz = 1.2; // Axial drift
      const steps = 300;
      for (let i = 0; i < steps; i++) {
        const phi = (i / 30) * Math.PI * 2;
        const px = Math.cos(phi) * R_cyclotron;
        const py = 3 + Math.sin(phi) * R_cyclotron;
        const pz = -3 + (i / steps) * 6;
        helixPoints.push(new THREE.Vector3(px, py, pz));
      }
      const helixGeo = new THREE.BufferGeometry().setFromPoints(helixPoints);
      const helixMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 });
      group.add(new THREE.Line(helixGeo, helixMat));

      let lastStepSeen = -1;
      const updateInterval = setInterval(() => {
        if (!isRunning && lastStepSeen === stepTriggerRef.current) return;
        lastStepSeen = stepTriggerRef.current;
        const tCur = simStateRef.current.time * 2.5;
        const px = Math.cos(tCur) * R_cyclotron;
        const py = 3 + Math.sin(tCur) * R_cyclotron;
        const pz = -3 + ((tCur * 0.8) % 6);
        particle.position.set(px, py, pz);
      }, 30);

      return () => clearInterval(updateInterval);
    }

    // -------------------------------------------------------------
    // SCENE 4: GIAO THOA SÓNG MẶT NƯỚC 3D (RIPPLE SURFACE)
    // -------------------------------------------------------------
    else if (mode === 'wave_ripple') {
      const planeW = 12;
      const planeH = 12;
      const segments = 60;
      const planeGeo = new THREE.PlaneGeometry(planeW, planeH, segments, segments);
      planeGeo.rotateX(-Math.PI / 2);

      const planeMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        metalness: 0.4,
        wireframe: false,
        side: THREE.DoubleSide,
      });
      const rippleMesh = new THREE.Mesh(planeGeo, planeMat);
      rippleMesh.position.y = 1.0;
      group.add(rippleMesh);

      // Two coherent point sources S1 and S2
      const s1Pos = new THREE.Vector3(-sourceDistance / 2, 1.2, 0);
      const s2Pos = new THREE.Vector3(sourceDistance / 2, 1.2, 0);

      const sGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const sMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.6 });
      const s1Mesh = new THREE.Mesh(sGeo, sMat);
      s1Mesh.position.copy(s1Pos);
      const s2Mesh = new THREE.Mesh(sGeo, sMat);
      s2Mesh.position.copy(s2Pos);
      group.add(s1Mesh);
      group.add(s2Mesh);

      const posAttr = planeGeo.attributes.position;
      const origY = new Float32Array(posAttr.count);
      for (let i = 0; i < posAttr.count; i++) origY[i] = posAttr.getY(i);

      let lastStepSeen = -1;
      const updateInterval = setInterval(() => {
        if (!isRunning && lastStepSeen === stepTriggerRef.current) return;
        lastStepSeen = stepTriggerRef.current;
        const tNow = simStateRef.current.time;
        const omega = Math.max(0.2, waveFrequency) * Math.PI * 2;
        const k = 1.8;

        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i);
          const vz = posAttr.getZ(i);

          const d1 = Math.sqrt((vx - s1Pos.x) ** 2 + (vz - s1Pos.z) ** 2);
          const d2 = Math.sqrt((vx - s2Pos.x) ** 2 + (vz - s2Pos.z) ** 2);

          const yVal =
            0.25 * Math.sin(k * d1 - omega * tNow) / Math.max(1, Math.sqrt(d1)) +
            0.25 * Math.sin(k * d2 - omega * tNow) / Math.max(1, Math.sqrt(d2));

          posAttr.setY(i, yVal);
        }
        posAttr.needsUpdate = true;
        planeGeo.computeVertexNormals();
      }, 35);

      return () => clearInterval(updateInterval);
    }

    // -------------------------------------------------------------
    // SCENE 5: MẪU NGUYÊN TỬ BOHR 3D (BOHR ATOM)
    // -------------------------------------------------------------
    else if (mode === 'bohr_atom') {
      // Nucleus (Protons + Neutrons cluster)
      const nucleusGroup = new THREE.Group();
      const nucColors = [0xef4444, 0x3b82f6]; // Red proton, Blue neutron
      for (let i = 0; i < 14; i++) {
        const sphereGeo = new THREE.SphereGeometry(0.18, 12, 12);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: nucColors[i % 2],
          roughness: 0.3,
          metalness: 0.5,
        });
        const nucSphere = new THREE.Mesh(sphereGeo, sphereMat);
        nucSphere.position.set(
          (Math.random() - 0.5) * 0.6,
          2.5 + (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.6
        );
        nucleusGroup.add(nucSphere);
      }
      group.add(nucleusGroup);

      // Quantized energy level rings (K, L, M, N: n=1, 2, 3, 4)
      const orbitRadii = [1.2, 2.2, 3.4, 4.8];
      orbitRadii.forEach((r, idx) => {
        const ringGeo = new THREE.RingGeometry(r - 0.02, r + 0.02, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: idx + 1 === quantumN ? 0xf59e0b : 0x475569,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: idx + 1 === quantumN ? 0.9 : 0.3,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = 2.5;
        group.add(ringMesh);
      });

      // Electron particle
      const electronGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const electronMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.8,
      });
      const electron = new THREE.Mesh(electronGeo, electronMat);
      group.add(electron);

      const safeN = Math.max(1, Math.min(4, quantumN));
      const currentOrbitR = orbitRadii[safeN - 1];

      let lastStepSeen = -1;
      const updateInterval = setInterval(() => {
        if (!isRunning && lastStepSeen === stepTriggerRef.current) return;
        lastStepSeen = stepTriggerRef.current;
        const angle = simStateRef.current.electronAngle * (2.0 / Math.sqrt(safeN));
        const ex = Math.cos(angle) * currentOrbitR;
        const ez = Math.sin(angle) * currentOrbitR;
        electron.position.set(ex, 2.5, ez);
      }, 30);

      return () => clearInterval(updateInterval);
    }

    // -------------------------------------------------------------
    // SCENE 6: QUANG HÌNH HỌC 3D (THẤU KÍNH & ĐƯỜNG ĐI TIA SÁNG)
    // -------------------------------------------------------------
    else if (mode === 'optics_3d') {
      const safeFMag = Math.max(0.25, Math.abs(focalLength3D));
      const fSigned = isDiverging3D ? -safeFMag : safeFMag;
      const safeD = Math.max(0.25, Math.abs(objectDist3D));

      // Optical axis along X
      const axisGeo = new THREE.CylinderGeometry(0.025, 0.025, 13, 8);
      axisGeo.rotateZ(Math.PI / 2);
      const axisMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
      const axis = new THREE.Mesh(axisGeo, axisMat);
      axis.position.y = 2.0;
      group.add(axis);

      // 3D Lens at X = 0, Y = 2.0 (Biconvex or Diverging marker)
      const lensGeo = isDiverging3D
        ? new THREE.CylinderGeometry(2.1, 2.1, 0.25, 24)
        : new THREE.SphereGeometry(2.2, 32, 24);
      if (isDiverging3D) {
        lensGeo.rotateZ(Math.PI / 2);
      } else {
        lensGeo.scale(0.18, 1.0, 1.0);
      }
      const lensMat = new THREE.MeshStandardMaterial({
        color: isDiverging3D ? 0xc084fc : 0x38bdf8,
        transparent: true,
        opacity: 0.45,
        roughness: 0.08,
        metalness: 0.25,
      });
      const lensMesh = new THREE.Mesh(lensGeo, lensMat);
      lensMesh.position.set(0, 2.0, 0);
      group.add(lensMesh);

      // Focal markers F and F'
      const fGeo = new THREE.SphereGeometry(0.11, 16, 16);
      const fMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.4 });
      const fLeft = new THREE.Mesh(fGeo, fMat);
      fLeft.position.set(-fSigned, 2.0, 0);
      const fRight = new THREE.Mesh(fGeo, fMat);
      fRight.position.set(fSigned, 2.0, 0);
      group.add(fLeft, fRight);

      // Object Arrow AB at x = -safeD
      const objH = 1.4;
      const objArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(-safeD, 2.0, 0),
        objH,
        0x10b981,
        0.28,
        0.16
      );
      group.add(objArrow);

      // Calculate Image position d' = d*f / (d - f)
      const denom = Math.abs(safeD - fSigned) < 0.08 ? 0.08 : safeD - fSigned;
      const dPrime = (safeD * fSigned) / denom;
      const clampedDPrime = Math.max(-6.2, Math.min(6.2, dPrime));
      const kMag = -clampedDPrime / safeD;
      const imgH = Math.max(-2.6, Math.min(2.6, objH * kMag));

      const imgDir = new THREE.Vector3(0, imgH >= 0 ? 1 : -1, 0);
      const imgColor = dPrime > 0 ? 0xef4444 : 0xa855f7;
      const imgArrow = new THREE.ArrowHelper(
        imgDir,
        new THREE.Vector3(clampedDPrime, 2.0, 0),
        Math.max(0.2, Math.abs(imgH)),
        imgColor,
        0.28,
        0.16
      );
      group.add(imgArrow);

      // Principal light rays
      const B = new THREE.Vector3(-safeD, 2.0 + objH, 0);
      const L_top = new THREE.Vector3(0, 2.0 + objH, 0);
      const B_prime = new THREE.Vector3(clampedDPrime, 2.0 + imgH, 0);
      const O = new THREE.Vector3(0, 2.0, 0);

      const rayMat = new THREE.LineBasicMaterial({ color: 0xfacc15 });
      const ray1Out = isDiverging3D
        ? new THREE.Vector3(5.5, 2.0 + objH + (objH / safeFMag) * 5.5, 0)
        : dPrime > 0
        ? B_prime
        : new THREE.Vector3(5.5, 2.0 + objH - (objH / safeFMag) * 5.5, 0);

      const ray1Geo = new THREE.BufferGeometry().setFromPoints([B, L_top, ray1Out]);
      group.add(new THREE.Line(ray1Geo, rayMat));

      const ray2Geo = new THREE.BufferGeometry().setFromPoints([
        B,
        O,
        dPrime > 0 ? B_prime : new THREE.Vector3(5.5, 2.0 - (objH / safeD) * 5.5, 0),
      ]);
      group.add(new THREE.Line(ray2Geo, rayMat));

      if (dPrime < 0) {
        const vMat = new THREE.LineDashedMaterial({ color: 0xc084fc, dashSize: 0.15, gapSize: 0.1 });
        const v1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([L_top, B_prime]), vMat);
        v1.computeLineDistances();
        const v2 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([O, B_prime]), vMat);
        v2.computeLineDistances();
        group.add(v1, v2);
      }
    }

    // -------------------------------------------------------------
    // SCENE 7: ĐỘNG HỌC & VECTƠ HỢP LỰC 3D
    // -------------------------------------------------------------
    else if (mode === 'kinematics_3d') {
      // Road Track
      const trackGeo = new THREE.BoxGeometry(12, 0.25, 2.2);
      const trackMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
      const track = new THREE.Mesh(trackGeo, trackMat);
      track.position.set(0, 0.12, 0);
      group.add(track);

      // Moving Vehicle Block
      const carGeo = new THREE.BoxGeometry(1.1, 0.55, 0.75);
      const carMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.4, roughness: 0.25 });
      const car = new THREE.Mesh(carGeo, carMat);
      car.position.set(-4.8, 0.55, 0);
      group.add(car);

      // Velocity Vector Arrow attached to car (green)
      const vArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-4.8, 1.05, 0), 1.4, 0x10b981, 0.3, 0.16);
      group.add(vArrow);

      // Force / Vector Addition Visualizer elevated at Y = 2.6
      const rad = (vecAngle * Math.PI) / 180;
      const originVec = new THREE.Vector3(-1.5, 2.5, 0);
      const f1Vec = new THREE.Vector3(2.2, 0, 0);
      const f2Vec = new THREE.Vector3(Math.cos(rad) * 2.0, Math.sin(rad) * 2.0, 0);
      const fSumVec = f1Vec.clone().add(f2Vec);

      group.add(new THREE.ArrowHelper(f1Vec.clone().normalize(), originVec, f1Vec.length(), 0x38bdf8, 0.28, 0.14));
      group.add(new THREE.ArrowHelper(f2Vec.clone().normalize(), originVec, f2Vec.length(), 0xf59e0b, 0.28, 0.14));
      group.add(new THREE.ArrowHelper(fSumVec.clone().normalize(), originVec, fSumVec.length(), 0xef4444, 0.34, 0.18));

      // Parallelogram dashed outline
      const pMat = new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.15, gapSize: 0.1 });
      const pLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          originVec.clone().add(f1Vec),
          originVec.clone().add(fSumVec),
          originVec.clone().add(f2Vec),
        ]),
        pMat
      );
      pLine.computeLineDistances();
      group.add(pLine);

      let lastStepSeen = -1;
      const updateInterval = setInterval(() => {
        if (!isRunning && lastStepSeen === stepTriggerRef.current) return;
        lastStepSeen = stepTriggerRef.current;
        const cycleT = simStateRef.current.time % 3.6;
        const rawX = -4.8 + kinV0 * cycleT * 0.45 + 0.5 * kinAccel * cycleT * cycleT * 0.45;
        const clampedX = Math.max(-5.2, Math.min(5.0, rawX));
        const curV = kinV0 + kinAccel * cycleT;
        car.position.x = clampedX;
        vArrow.position.set(clampedX, 1.05, 0);
        vArrow.setLength(Math.max(0.5, Math.min(3.0, Math.abs(curV) * 0.32)), 0.28, 0.15);
      }, 30);

      return () => clearInterval(updateInterval);
    }

    // -------------------------------------------------------------
    // SCENE 8: CHUYỂN ĐỘNG NHIỆT PHÂN TỬ & KHÍ LÍ TƯỞNG 3D
    // -------------------------------------------------------------
    else if (mode === 'thermal_gas_3d') {
      const boxW = 4.2;
      const boxD = 4.2;
      const safeVol = Math.max(0.3, Math.min(2.2, gasVolumeFactor));
      const boxH = 4.5 * safeVol;

      // Wireframe Cylinder Chamber
      const chamberGeo = new THREE.BoxGeometry(boxW, boxH, boxD);
      const chamberEdges = new THREE.EdgesGeometry(chamberGeo);
      const chamberLine = new THREE.LineSegments(
        chamberEdges,
        new THREE.LineBasicMaterial({ color: 0x38bdf8 })
      );
      chamberLine.position.y = boxH / 2 + 0.1;
      group.add(chamberLine);

      // Movable Top Piston
      const pistonGeo = new THREE.BoxGeometry(boxW - 0.1, 0.22, boxD - 0.1);
      const pistonMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.65,
        roughness: 0.25,
        transparent: true,
        opacity: 0.85,
      });
      const piston = new THREE.Mesh(pistonGeo, pistonMat);
      piston.position.y = boxH + 0.1;
      group.add(piston);

      // 24 Gas Particles bouncing inside
      const numParticles = 24;
      const safeTemp = Math.max(10, gasTempK);
      const speedScale = Math.sqrt(safeTemp / 300) * 0.085;
      const pColor = safeTemp > 450 ? 0xef4444 : safeTemp > 330 ? 0xf59e0b : 0x38bdf8;
      const partGeo = new THREE.SphereGeometry(0.14, 14, 14);
      const partMat = new THREE.MeshStandardMaterial({
        color: pColor,
        emissive: pColor,
        emissiveIntensity: 0.35,
      });

      const particles: { mesh: THREE.Mesh; vel: THREE.Vector3 }[] = [];
      for (let i = 0; i < numParticles; i++) {
        const mesh = new THREE.Mesh(partGeo, partMat);
        mesh.position.set(
          (Math.random() - 0.5) * (boxW - 0.5),
          0.35 + Math.random() * Math.max(0.6, boxH - 0.5),
          (Math.random() - 0.5) * (boxD - 0.5)
        );
        const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        particles.push({ mesh, vel: dir.multiplyScalar(speedScale) });
        group.add(mesh);
      }

      const halfW = boxW / 2 - 0.2;
      const halfD = boxD / 2 - 0.2;
      const minY = 0.28;
      const maxY = Math.max(0.8, boxH - 0.12);

      let lastStepSeen = -1;
      const updateInterval = setInterval(() => {
        if (!isRunning && lastStepSeen === stepTriggerRef.current) return;
        lastStepSeen = stepTriggerRef.current;
        for (const p of particles) {
          p.mesh.position.add(p.vel.clone().multiplyScalar(simSpeedRef.current));
          if (p.mesh.position.x > halfW || p.mesh.position.x < -halfW) p.vel.x *= -1;
          if (p.mesh.position.z > halfD || p.mesh.position.z < -halfD) p.vel.z *= -1;
          if (p.mesh.position.y > maxY || p.mesh.position.y < minY) p.vel.y *= -1;
          p.mesh.position.x = Math.max(-halfW, Math.min(halfW, p.mesh.position.x));
          p.mesh.position.z = Math.max(-halfD, Math.min(halfD, p.mesh.position.z));
          p.mesh.position.y = Math.max(minY, Math.min(maxY, p.mesh.position.y));
        }
      }, 28);

      return () => clearInterval(updateInterval);
    }
  }, [
    mode,
    isRunning,
    mass,
    springK,
    gravityPreset,
    projAngle,
    projV0,
    magneticB,
    particleSpeed,
    waveFrequency,
    sourceDistance,
    quantumN,
    focalLength3D,
    objectDist3D,
    isDiverging3D,
    kinV0,
    kinAccel,
    vecAngle,
    gasTempK,
    gasVolumeFactor,
  ]);

  // Derived telemetry
  const gVal = getGravityValue();
  const radVal = (projAngle * Math.PI) / 180;
  const hMax = ((projV0 * Math.sin(radVal)) ** 2 / (2 * gVal)).toFixed(2);
  const rangeL = ((projV0 ** 2 * Math.sin(2 * radVal)) / gVal).toFixed(2);

  return (
    <ViewportPortal active={isFullscreen}>
      <div
        className={`relative w-full overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 shadow-2xl transition-all flex flex-col lg:block ${
          isFullscreen
            ? 'fixed inset-0 z-[100] h-[100dvh] w-screen rounded-none'
            : 'rounded-2xl sm:rounded-3xl min-h-[540px] lg:min-h-0 lg:h-[620px]'
        }`}
      >
        {/* TOP HEADER OVERLAY (Stacked on < lg to prevent overlapping 3D viewport, floating on lg+) */}
        <div className="relative z-20 p-2.5 sm:p-3 lg:p-0 lg:absolute lg:top-4 lg:left-4 lg:right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/95 lg:bg-transparent border-b border-slate-800/80 lg:border-b-0 lg:pointer-events-none shrink-0">
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-800/70 lg:bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white shadow-lg max-w-full">
            {(isFullscreen || onBack) && (
              <button
                onClick={() => {
                  if (isFullscreen) {
                    setIsFullscreen(false);
                  } else if (onBack) {
                    onBack();
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0"
                title={isFullscreen ? 'Thu nhỏ (Esc)' : 'Quay lại trang trước'}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isFullscreen ? 'Thu nhỏ' : 'Quay lại'}</span>
              </button>
            )}
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wide truncate">
              {mode === 'pendulum_spring' && 'Con Lắc Đơn & Con Lắc Lò Xo 3D'}
              {mode === 'projectile_3d' && 'Chuyển Động Ném Xiên & Bệ Pháo 3D'}
              {mode === 'lorentz_helix' && 'Từ Trường Lorentz & Quỹ Đạo Xoắn Ốc 3D'}
              {mode === 'wave_ripple' && 'Giao Thoa Sóng Mặt Nước Nổi Khối 3D'}
              {mode === 'bohr_atom' && 'Mẫu Nguyên Tử Bohr & Các Mức Lượng Tử'}
              {mode === 'optics_3d' && 'Quang Hình Học 3D & Đường Đi Tia Sáng'}
              {mode === 'kinematics_3d' && 'Động Học Chất Điểm & Tổng Hợp Vectơ 3D'}
              {mode === 'thermal_gas_3d' && 'Động Học Phân Tử & Khí Lí Tưởng 3D'}
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 max-w-full">
            {/* Mode Switcher Buttons (scrollable on phones & iPads) */}
            <div className="flex items-center gap-1 p-1 bg-slate-800/80 lg:bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-lg overflow-x-auto max-w-full scrollbar-none">
              {[
                { id: 'kinematics_3d', label: 'Động Học & Vectơ' },
                { id: 'optics_3d', label: 'Quang Học 3D' },
                { id: 'pendulum_spring', label: 'Con Lắc 3D' },
                { id: 'projectile_3d', label: 'Ném Xiên 3D' },
                { id: 'wave_ripple', label: 'Sóng Nước 3D' },
                { id: 'thermal_gas_3d', label: 'Khí Lí Tưởng 3D' },
                { id: 'lorentz_helix', label: 'Từ Trường Lorentz' },
                { id: 'bohr_atom', label: 'Nguyên Tử Bohr' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as Physics3DMode)}
                  className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                    mode === m.id ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Play/Pause + Step + Speed + Reset */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 rounded-xl bg-slate-800/80 lg:bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer shrink-0"
              title={isRunning ? 'Tạm dừng mô phỏng' : 'Tiếp tục mô phỏng'}
            >
              {isRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={handleStepOnce}
              className="hidden sm:flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800/80 lg:bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-bold text-slate-200 hover:text-white transition-colors shadow-lg cursor-pointer shrink-0 whitespace-nowrap"
              title="Tiến 1 bước +0.05s"
            >
              <StepForward className="w-3.5 h-3.5 text-cyan-400" />
              <span>+0.05s</span>
            </button>

            <button
              onClick={handleReset3D}
              className="p-2 rounded-xl bg-slate-800/80 lg:bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer shrink-0"
              title="Đặt lại thời gian t = 0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800/80 lg:bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer shrink-0"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3D WebGL Canvas (Unobstructed middle stage on < lg, full height on lg+) */}
        <div
          ref={mountRef}
          className={`w-full cursor-grab active:cursor-grabbing touch-none ${
            isFullscreen ? 'flex-1 min-h-[240px] lg:h-full' : 'h-[270px] sm:h-[340px] lg:h-full'
          }`}
        />

        {/* ERGONOMIC COLLAPSIBLE CONTROL DOCK (Below canvas on < lg, floating dock on lg+) */}
        <div className="relative z-20 p-2.5 sm:p-3 lg:p-0 lg:absolute lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-[96%] lg:max-w-3xl lg:pointer-events-none bg-slate-950/95 lg:bg-transparent border-t border-slate-800/80 lg:border-t-0 shrink-0">
          <div className="pointer-events-auto bg-slate-900/95 lg:bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 text-white space-y-2.5 sm:space-y-3 max-h-[34dvh] sm:max-h-[260px] lg:max-h-none overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Thông Số Tùy Chỉnh Tự Do 3D</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
                {[0.25, 0.5, 1, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                      simSpeed === spd ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsControlsExpanded(!isControlsExpanded)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer whitespace-nowrap"
              >
                <span>{isControlsExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
                {isControlsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {isControlsExpanded && (
            <div className="animate-in fade-in duration-200">
              {/* 1. Pendulum / Spring */}
              {mode === 'pendulum_spring' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <Numeric3DControl
                      label="Độ cứng k"
                      unit="N/m"
                      value={springK}
                      min={10}
                      max={100}
                      step={5}
                      accentClass="accent-blue-500"
                      onChange={(v) => setSpringK(v)}
                    />
                    <Numeric3DControl
                      label="Khối lượng m"
                      unit="kg"
                      value={mass}
                      min={0.2}
                      max={3.0}
                      step={0.1}
                      accentClass="accent-emerald-500"
                      onChange={(v) => setMass(v)}
                    />

                    <div>
                      <span className="block text-slate-300 mb-1.5">Trọng trường g:</span>
                      <div className="flex flex-wrap items-center gap-1">
                        <button
                          onClick={() => setGravityPreset('earth')}
                          className={`px-2 py-1 rounded text-[11px] font-bold ${
                            gravityPreset === 'earth' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Trái Đất (9.8)
                        </button>
                        <button
                          onClick={() => setGravityPreset('moon')}
                          className={`px-2 py-1 rounded text-[11px] font-bold ${
                            gravityPreset === 'moon' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Mặt Trăng (1.6)
                        </button>
                        <button
                          onClick={() => setGravityPreset('mars')}
                          className={`px-2 py-1 rounded text-[11px] font-bold ${
                            gravityPreset === 'mars' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Sao Hỏa (3.7)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-950/60 rounded-xl text-xs font-mono flex flex-wrap items-center justify-between text-slate-300">
                    <span>Chu kỳ lò xo: T = 2π√(m/k) = {(2 * Math.PI * Math.sqrt(Math.max(0.05, mass) / Math.max(0.5, springK))).toFixed(2)} s</span>
                    <span>Tần số góc: ω = {Math.sqrt(Math.max(0.5, springK) / Math.max(0.05, mass)).toFixed(2)} rad/s</span>
                  </div>
                </div>
              )}

              {/* 2. Projectile */}
              {mode === 'projectile_3d' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <Numeric3DControl
                      label="Góc bắn α"
                      unit="°"
                      value={projAngle}
                      min={15}
                      max={80}
                      step={1}
                      accentClass="accent-amber-500"
                      onChange={(v) => setProjAngle(v)}
                    />
                    <Numeric3DControl
                      label="Vận tốc ban đầu v₀"
                      unit="m/s"
                      value={projV0}
                      min={5}
                      max={30}
                      step={1}
                      accentClass="accent-emerald-500"
                      onChange={(v) => setProjV0(v)}
                    />
                  </div>

                  <div className="p-2 bg-slate-950/60 rounded-xl text-xs font-mono flex flex-wrap items-center justify-between text-slate-300">
                    <span className="text-blue-400">Độ cao cực đại: H_max = {hMax} m</span>
                    <span className="text-amber-400">Tầm xa mặt đất: L = {rangeL} m</span>
                  </div>
                </div>
              )}

              {/* 3. Lorentz */}
              {mode === 'lorentz_helix' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <Numeric3DControl
                      label="Cảm ứng từ B"
                      unit="T"
                      value={magneticB}
                      min={0.5}
                      max={4.0}
                      step={0.1}
                      accentClass="accent-blue-500"
                      onChange={(v) => setMagneticB(v)}
                    />
                    <Numeric3DControl
                      label="Vận tốc hạt v"
                      unit="×10⁶"
                      value={particleSpeed}
                      min={1.0}
                      max={8.0}
                      step={0.2}
                      accentClass="accent-rose-500"
                      onChange={(v) => setParticleSpeed(v)}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Lực Lorentz F = |q|·v·B uốn hạt thành đường tròn/xoắn ốc cyclotron bán kính R = mv / (|q|B).
                  </div>
                </div>
              )}

              {/* 4. Wave Ripple */}
              {mode === 'wave_ripple' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <Numeric3DControl
                      label="Tần số nguồn f"
                      unit="Hz"
                      value={waveFrequency}
                      min={1.0}
                      max={5.0}
                      step={0.2}
                      accentClass="accent-cyan-500"
                      onChange={(v) => setWaveFrequency(v)}
                    />
                    <Numeric3DControl
                      label="Khoảng cách S₁S₂"
                      unit="m"
                      value={sourceDistance}
                      min={2.0}
                      max={6.0}
                      step={0.2}
                      accentClass="accent-amber-500"
                      onChange={(v) => setSourceDistance(v)}
                    />
                  </div>
                </div>
              )}

              {/* 5. Bohr Atom */}
              {mode === 'bohr_atom' && (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-300">Mức quỹ đạo dừng n:</span>
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        onClick={() => setQuantumN(level)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          quantumN === level ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        n = {level} ({['K', 'L', 'M', 'N'][level - 1]})
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Năng lượng mức n: E_n = -13.6 / n² eV. Bán kính r_n = n² · r₀ (với r₀ = 0.53 Å).
                  </div>
                </div>
              )}

              {/* 6. Optics 3D */}
              {mode === 'optics_3d' && (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setIsDiverging3D(false)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        !isDiverging3D ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Thấu kính Hội tụ (f &gt; 0)
                    </button>
                    <button
                      onClick={() => setIsDiverging3D(true)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        isDiverging3D ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Thấu kính Phân kỳ (f &lt; 0)
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <Numeric3DControl
                      label="Tiêu cự |f|"
                      unit="m"
                      value={focalLength3D}
                      min={1.0}
                      max={3.5}
                      step={0.1}
                      accentClass="accent-cyan-500"
                      onChange={(v) => setFocalLength3D(v)}
                    />
                    <Numeric3DControl
                      label="Khoảng cách vật d"
                      unit="m"
                      value={objectDist3D}
                      min={0.8}
                      max={5.5}
                      step={0.1}
                      accentClass="accent-emerald-500"
                      onChange={(v) => setObjectDist3D(v)}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {isDiverging3D
                      ? `TK Phân kỳ luôn cho Ảnh ẢO cùng chiều, nhỏ hơn vật (d' = ${((-Math.max(0.25, objectDist3D) * Math.max(0.25, focalLength3D)) / (Math.max(0.25, objectDist3D) + Math.max(0.25, focalLength3D))).toFixed(2)} m)`
                      : objectDist3D > focalLength3D
                      ? `Ảnh THẬT ngược chiều (d' = ${((objectDist3D * focalLength3D) / (objectDist3D - focalLength3D)).toFixed(2)} m)`
                      : 'Ảnh ẢO cùng chiều lớn hơn vật (nằm cùng phía vật)'}
                  </div>
                </div>
              )}

              {/* 7. Kinematics & Vector 3D */}
              {mode === 'kinematics_3d' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <Numeric3DControl
                      label="Vận tốc đầu v₀"
                      unit="m/s"
                      value={kinV0}
                      min={0.5}
                      max={4.5}
                      step={0.2}
                      accentClass="accent-emerald-500"
                      onChange={(v) => setKinV0(v)}
                    />
                    <Numeric3DControl
                      label="Gia tốc a"
                      unit="m/s²"
                      value={kinAccel}
                      min={0}
                      max={2.5}
                      step={0.1}
                      accentClass="accent-amber-500"
                      onChange={(v) => setKinAccel(v)}
                    />
                    <Numeric3DControl
                      label="Góc 2 vectơ α"
                      unit="°"
                      value={vecAngle}
                      min={10}
                      max={150}
                      step={5}
                      accentClass="accent-rose-500"
                      onChange={(v) => setVecAngle(v)}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Quy tắc hình bình hành: F² = F₁² + F₂² + 2F₁F₂cos(α). Mũi tên xanh lá biểu diễn véc-tơ vận tốc tức thời.
                  </div>
                </div>
              )}

              {/* 8. Thermal Gas 3D */}
              {mode === 'thermal_gas_3d' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <Numeric3DControl
                      label="Nhiệt độ T"
                      unit="K"
                      value={gasTempK}
                      min={150}
                      max={650}
                      step={10}
                      accentClass="accent-rose-500"
                      onChange={(v) => setGasTempK(v)}
                    />
                    <Numeric3DControl
                      label="Hệ số thể tích"
                      unit="×10L"
                      value={gasVolumeFactor}
                      min={0.55}
                      max={1.4}
                      step={0.05}
                      accentClass="accent-cyan-500"
                      onChange={(v) => setGasVolumeFactor(v)}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Áp suất tỉ lệ P ~ T / V = {((Math.max(10, gasTempK) / 300) / Math.max(0.3, gasVolumeFactor)).toFixed(2)} atm (Động năng phân tử tăng theo T).
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </ViewportPortal>
  );
};
