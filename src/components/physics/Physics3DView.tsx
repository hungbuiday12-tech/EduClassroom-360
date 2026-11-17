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
  Grid,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ViewportPortal } from '../common/ViewportPortal';
import { PHYSICS_3D_SIMS } from '../../data/physicsDomainsData';
import { Physics3DMode as SharedPhysics3DMode } from '../../types';
import { EXTRA_3D_SCENE_CONFIGS, ExtraPhysics3DModeId } from '../../data/physicsExtraSimsData';
import { buildExtra3DScene } from './physics3DExtraScenes';

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

export type Physics3DMode = SharedPhysics3DMode;

interface Physics3DViewProps {
  initialMode?: Physics3DMode;
  allowedModes?: Physics3DMode[];
  domainTitle?: string;
  onSelectMode?: (mode: Physics3DMode) => void;
  onBack?: () => void;
}

export const Physics3DView: React.FC<Physics3DViewProps> = ({
  initialMode = 'pendulum_spring',
  allowedModes,
  domainTitle,
  onSelectMode,
  onBack,
}) => {
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
  const [showGrid3D, setShowGrid3D] = useState(true);
  const [quality3D, setQuality3D] = useState<'light' | 'high'>('light');

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

  // 9. Circular Motion 3D
  const [circRadius3D, setCircRadius3D] = useState(2.6);
  const [circOmega3D, setCircOmega3D] = useState(2.2);

  // 10. AC Generator 3D
  const [genOmega3D, setGenOmega3D] = useState(2.5);
  const [genFieldB3D, setGenFieldB3D] = useState(1.2);

  // 11. Young Double-Slit Interference 3D
  const [youngLambdaUm, setYoungLambdaUm] = useState(0.55);
  const [youngSlitMm, setYoungSlitMm] = useState(1.0);

  // 12. Standing Wave 3D
  const [standingN, setStandingN] = useState(3);
  const [standingAmp, setStandingAmp] = useState(0.95);

  // 13. Doppler Effect 3D
  const [dopplerSpeedRatio, setDopplerSpeedRatio] = useState(0.55);
  const [dopplerFreq, setDopplerFreq] = useState(2.8);

  // 14. Photoelectric Effect 3D
  const [photoLambdaNm, setPhotoLambdaNm] = useState(280);
  const [photoWorkEv, setPhotoWorkEv] = useState(2.14);

  // 15..32. Extra 18 3D Physics Scenes live parameters
  const [extraParams, setExtraParams] = useState<{ p1: number; p2: number }>({ p1: 1, p2: 1 });
  const extraParamsRef = useRef<{ p1: number; p2: number }>({ p1: 1, p2: 1 });
  useEffect(() => {
    const cfg = EXTRA_3D_SCENE_CONFIGS[mode as ExtraPhysics3DModeId];
    if (cfg) {
      const next = {
        p1: cfg.params[0]?.defaultVal ?? 1,
        p2: cfg.params[1]?.defaultVal ?? 1
      };
      setExtraParams(next);
      extraParamsRef.current = next;
    }
  }, [mode]);
  useEffect(() => {
    extraParamsRef.current = extraParams;
  }, [extraParams]);

  // WebGL context safety
  const [contextLost, setContextLost] = useState(false);

  // Refs for animation (unified single WebGL rAF loop — zero setInterval drift)
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const isSoftwareGlRef = useRef<boolean>(false);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const sceneTickRef = useRef<((effDt: number) => void) | null>(null);
  const isRunningRef = useRef<boolean>(isRunning);
  const simSpeedRef = useRef<number>(simSpeed);
  const stepTriggerRef = useRef<number>(0);
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);
  useEffect(() => {
    simSpeedRef.current = simSpeed;
  }, [simSpeed]);
  useEffect(() => {
    if (gridRef.current) gridRef.current.visible = showGrid3D;
  }, [showGrid3D]);
  useEffect(() => {
    if (rendererRef.current && !isSoftwareGlRef.current) {
      const cap = quality3D === 'high' ? 1.75 : 1.15;
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
    }
  }, [quality3D]);
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

    isSoftwareGlRef.current = isSoftwareGl;

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
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, quality3D === 'high' ? 1.75 : 1.15));
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
    grid.visible = showGrid3D;
    gridRef.current = grid;
    scene.add(grid);

    // Dynamic models group
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicGroupRef.current = dynamicGroup;

    // Unified single Animation Loop (time integration + scene kinematics + WebGL render)
    let frameId = 0;
    let lastTime = performance.now();
    let lastTickStep = -1;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (document.hidden) {
        lastTime = performance.now();
        return;
      }
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const stepped = lastTickStep !== stepTriggerRef.current;
      if (isRunningRef.current || stepped) {
        lastTickStep = stepTriggerRef.current;
        const effDt = isRunningRef.current ? dt * simSpeedRef.current : 0.05;
        if (isRunningRef.current) {
          simStateRef.current.time += effDt;
          simStateRef.current.projT += effDt;
          simStateRef.current.electronAngle += effDt * 3.0;
        }
        sceneTickRef.current?.(effDt);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // WebGL context loss/restore safety
    const canvasEl = renderer.domElement;
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    canvasEl.addEventListener('webglcontextlost', onContextLost);
    canvasEl.addEventListener('webglcontextrestored', onContextRestored);

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
      canvasEl.removeEventListener('webglcontextlost', onContextLost);
      canvasEl.removeEventListener('webglcontextrestored', onContextRestored);
      resizeObserver?.disconnect();
      controls.dispose();
      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
          else obj.material.dispose();
        }
      });
      sceneTickRef.current = null;
      rendererRef.current = null;
      gridRef.current = null;
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Construct and animate 3D scene elements per tick (bound cleanly to rAF)
  useEffect(() => {
    const group = dynamicGroupRef.current;
    if (!group) return;
    sceneTickRef.current = null;

    // Clear previous geometries and materials recursively to prevent GPU leaks
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      child.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m: any) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
        if (obj.material && obj.material.map) {
          obj.material.map.dispose();
        }
      });
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

      // Spring Coil (Helix anchored at Y=5 with unit height = 1, scaled smoothly via GPU matrix!)
      const numTurns = 12;
      const springRadius = 0.25;
      const springCurvePoints: THREE.Vector3[] = [];
      const steps = 108;
      for (let i = 0; i <= steps; i++) {
        const tVal = i / steps;
        const angle = tVal * numTurns * Math.PI * 2;
        const x = Math.cos(angle) * springRadius;
        const z = Math.sin(angle) * springRadius;
        const y = -tVal; // normalized 0 -> -1
        springCurvePoints.push(new THREE.Vector3(x, y, z));
      }
      const springCurve = new THREE.CatmullRomCurve3(springCurvePoints);
      const springTubeGeo = new THREE.TubeGeometry(springCurve, 96, 0.04, 8, false);
      const springTubeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
      const springMesh = new THREE.Mesh(springTubeGeo, springTubeMat);
      springMesh.position.set(-2, 5, 0);
      springMesh.scale.y = 2.5;
      group.add(springMesh);

      // Pendulum String & Bob
      const pendLen = 3.5;
      const pendBobGeo = new THREE.SphereGeometry(0.45, 24, 24);
      const pendBobMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.7, roughness: 0.2 });
      const pendBob = new THREE.Mesh(pendBobGeo, pendBobMat);
      group.add(pendBob);

      const pendLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(2, 5, 0), new THREE.Vector3(2, 1.5, 0)]);
      const pendLineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
      const pendLine = new THREE.Line(pendLineGeo, pendLineMat);
      group.add(pendLine);
      const pendPosAttr = pendLineGeo.attributes.position as THREE.BufferAttribute;

      // Tick update for spring and pendulum (zero geometry allocations, synced to rAF!)
      sceneTickRef.current = () => {
        const tNow = simStateRef.current.time;
        const springY = 2.5 + Math.sin(omega * tNow) * 1.2;
        springBob.position.y = springY;
        springMesh.scale.y = Math.max(0.25, 5 - springY);

        const omegaP = Math.sqrt(g / pendLen);
        const theta = Math.sin(omegaP * tNow) * 0.55;
        const pendX = 2 + Math.sin(theta) * pendLen;
        const pendY = 5 - Math.cos(theta) * pendLen;
        pendBob.position.set(pendX, pendY, 0);

        pendPosAttr.setXYZ(1, pendX, pendY, 0);
        pendPosAttr.needsUpdate = true;
      };
      sceneTickRef.current(0);

      return () => {
        sceneTickRef.current = null;
      };
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

      sceneTickRef.current = () => {
        const currentSimT = simStateRef.current.projT % (tMax + 0.8);
        if (currentSimT <= tMax) {
          const bx = -6 + v0x * currentSimT * 0.4;
          const by = Math.max(0, 0.2 + (v0y * currentSimT - 0.5 * g * currentSimT * currentSimT) * 0.4);
          ball.position.set(bx, by, 0);
          ball.visible = true;
        } else {
          ball.visible = false;
        }
      };
      sceneTickRef.current(0);

      return () => {
        sceneTickRef.current = null;
      };
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

      sceneTickRef.current = () => {
        const tCur = simStateRef.current.time * 2.5;
        const px = Math.cos(tCur) * R_cyclotron;
        const py = 3 + Math.sin(tCur) * R_cyclotron;
        const pz = -3 + ((tCur * 0.8) % 6);
        particle.position.set(px, py, pz);
      };
      sceneTickRef.current(0);

      return () => {
        sceneTickRef.current = null;
      };
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

      const posAttr = planeGeo.attributes.position as THREE.BufferAttribute;
      const vertCount = posAttr.count;
      const d1Arr = new Float32Array(vertCount);
      const d2Arr = new Float32Array(vertCount);
      const invSqrtD1 = new Float32Array(vertCount);
      const invSqrtD2 = new Float32Array(vertCount);
      for (let i = 0; i < vertCount; i++) {
        const vx = posAttr.getX(i);
        const vz = posAttr.getZ(i);
        const d1 = Math.hypot(vx - s1Pos.x, vz - s1Pos.z);
        const d2 = Math.hypot(vx - s2Pos.x, vz - s2Pos.z);
        d1Arr[i] = d1;
        d2Arr[i] = d2;
        invSqrtD1[i] = 0.25 / Math.max(1, Math.sqrt(d1));
        invSqrtD2[i] = 0.25 / Math.max(1, Math.sqrt(d2));
      }

      sceneTickRef.current = () => {
        const tNow = simStateRef.current.time;
        const phaseShift = Math.max(0.2, waveFrequency) * Math.PI * 2 * tNow;
        const k = 1.8;

        for (let i = 0; i < vertCount; i++) {
          const yVal =
            invSqrtD1[i] * Math.sin(k * d1Arr[i] - phaseShift) +
            invSqrtD2[i] * Math.sin(k * d2Arr[i] - phaseShift);
          posAttr.setY(i, yVal);
        }
        posAttr.needsUpdate = true;
        planeGeo.computeVertexNormals();
      };
      sceneTickRef.current(0);

      return () => {
        sceneTickRef.current = null;
      };
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

      sceneTickRef.current = () => {
        const angle = simStateRef.current.electronAngle * (2.0 / Math.sqrt(safeN));
        const ex = Math.cos(angle) * currentOrbitR;
        const ez = Math.sin(angle) * currentOrbitR;
        electron.position.set(ex, 2.5, ez);
      };
      sceneTickRef.current(0);

      return () => {
        sceneTickRef.current = null;
      };
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

      sceneTickRef.current = () => {
        const cycleT = simStateRef.current.time % 3.6;
        const rawX = -4.8 + kinV0 * cycleT * 0.45 + 0.5 * kinAccel * cycleT * cycleT * 0.45;
        const clampedX = Math.max(-5.2, Math.min(5.0, rawX));
        const curV = kinV0 + kinAccel * cycleT;
        car.position.x = clampedX;
        vArrow.position.set(clampedX, 1.05, 0);
        vArrow.setLength(Math.max(0.5, Math.min(3.0, Math.abs(curV) * 0.32)), 0.28, 0.15);
      };
      sceneTickRef.current(0);

      return () => {
        sceneTickRef.current = null;
      };
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

      sceneTickRef.current = (effDt: number) => {
        const dtScale = Math.min(2.5, Math.max(0.15, (effDt || 0.016) * 35));
        for (const p of particles) {
          p.mesh.position.addScaledVector(p.vel, dtScale);
          if (p.mesh.position.x > halfW || p.mesh.position.x < -halfW) p.vel.x *= -1;
          if (p.mesh.position.z > halfD || p.mesh.position.z < -halfD) p.vel.z *= -1;
          if (p.mesh.position.y > maxY || p.mesh.position.y < minY) p.vel.y *= -1;
          p.mesh.position.x = Math.max(-halfW, Math.min(halfW, p.mesh.position.x));
          p.mesh.position.z = Math.max(-halfD, Math.min(halfD, p.mesh.position.z));
          p.mesh.position.y = Math.max(minY, Math.min(maxY, p.mesh.position.y));
        }
      };

      return () => {
        sceneTickRef.current = null;
      };
    }

    // -------------------------------------------------------------
    // SCENE 9: CHUYỂN ĐỘNG TRÒN ĐỀU & LỰC HƯỚNG TÂM 3D
    // -------------------------------------------------------------
    else if (mode === 'circular_motion_3d') {
      const r = Math.max(1.0, Math.min(4.2, circRadius3D));
      const yLevel = 1.6;

      // Central pivot post + angular velocity vector omega
      const pivot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.18, yLevel, 16),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7 })
      );
      pivot.position.y = yLevel / 2;
      group.add(pivot);

      const omegaArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, yLevel + 0.1, 0), 1.8, 0xf59e0b, 0.3, 0.16);
      group.add(omegaArrow);

      // Orbit ring
      const ringGeo = new THREE.TorusGeometry(r, 0.035, 12, 64);
      ringGeo.rotateX(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55 }));
      ring.position.y = yLevel;
      group.add(ring);

      // Orbiting sphere + connecting rod
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.4, roughness: 0.25 })
      );
      group.add(ball);

      const rodLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, yLevel, 0), new THREE.Vector3(r, yLevel, 0)]),
        new THREE.LineBasicMaterial({ color: 0x94a3b8 })
      );
      group.add(rodLine);

      // Tangential velocity & centripetal force arrows
      const vArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(r, yLevel, 0), 1.8, 0x10b981, 0.3, 0.16);
      const fArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(r, yLevel, 0), 1.5, 0xef4444, 0.3, 0.16);
      group.add(vArrow, fArrow);

      const rodPosAttr = rodLine.geometry.attributes.position as THREE.BufferAttribute;
      const vDir = new THREE.Vector3();
      const fDir = new THREE.Vector3();
      sceneTickRef.current = () => {
        const theta = simStateRef.current.time * Math.max(0.2, circOmega3D);
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const bx = cosT * r;
        const bz = -sinT * r;
        ball.position.set(bx, yLevel, bz);

        rodPosAttr.setXYZ(1, bx, yLevel, bz);
        rodPosAttr.needsUpdate = true;

        vDir.set(-sinT, 0, -cosT).normalize();
        fDir.set(-cosT, 0, sinT).normalize();
        vArrow.position.set(bx, yLevel, bz);
        vArrow.setDirection(vDir);
        vArrow.setLength(Math.min(2.6, Math.max(0.8, circOmega3D * r * 0.28)), 0.3, 0.15);

        fArrow.position.set(bx, yLevel, bz);
        fArrow.setDirection(fDir);
        fArrow.setLength(Math.min(r * 0.8, Math.max(0.8, circOmega3D * circOmega3D * r * 0.12)), 0.3, 0.15);
      };
      sceneTickRef.current(0);

      return () => {
        sceneTickRef.current = null;
      };
    }

    // -------------------------------------------------------------
    // SCENE 10: MÁY PHÁT ĐIỆN XOAY CHIỀU 3D (AC GENERATOR & TỪ THÔNG)
    // -------------------------------------------------------------
    else if (mode === 'ac_generator_3d') {
      // N Pole (Red, left) & S Pole (Blue, right)
      const nPole = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 3.0, 3.2),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.3 })
      );
      nPole.position.set(-3.6, 2.2, 0);
      const sPole = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 3.0, 3.2),
        new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3, metalness: 0.3 })
      );
      sPole.position.set(3.6, 2.2, 0);
      group.add(nPole, sPole);

      // Magnetic field arrows N -> S along +X
      for (let iy = 1.4; iy <= 3.0; iy += 0.8) {
        for (let iz = -0.8; iz <= 0.8; iz += 0.8) {
          group.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-2.7, iy, iz), 5.4, 0x38bdf8, 0.28, 0.14));
        }
      }

      // Rotating rectangular copper coil
      const coilGroup = new THREE.Group();
      coilGroup.position.set(0, 2.2, 0);
      const wirePts = [
        new THREE.Vector3(-1.3, -1.1, 0),
        new THREE.Vector3(1.3, -1.1, 0),
        new THREE.Vector3(1.3, 1.1, 0),
        new THREE.Vector3(-1.3, 1.1, 0),
        new THREE.Vector3(-1.3, -1.1, 0)
      ];
      const coilGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wirePts, false, 'catmullrom', 0.05), 48, 0.07, 10, false);
      const coilMesh = new THREE.Mesh(coilGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 }));
      coilGroup.add(coilMesh);

      // Normal vector n attached to coil
      const normalArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1.6, 0x10b981, 0.28, 0.15);
      coilGroup.add(normalArrow);
      group.add(coilGroup);

      // Slip ring axis
      const axle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 4.6, 12),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
      );
      axle.rotation.x = Math.PI / 2;
      axle.position.set(0, 2.2, 0);
      group.add(axle);

      sceneTickRef.current = () => {
        coilGroup.rotation.z = simStateRef.current.time * Math.max(0.2, genOmega3D);
      };
      sceneTickRef.current(0);

      return () => {
        sceneTickRef.current = null;
      };
    }

    // -------------------------------------------------------------
    // SCENE 11: GIAO THOA KHE Y-ÂNG 3D (DOUBLE-SLIT LIGHT FRINGES)
    // -------------------------------------------------------------
    else if (mode === 'young_interference_3d') {
      const nm = Math.round(youngLambdaUm * 1000);
      const cssColor = (() => {
        let r = 0, g = 0, b = 0;
        if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
        else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
        else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
        else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
        else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
        else { r = 1; }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
      })();

      const hexColor = (cssColor.r << 16) | (cssColor.g << 8) | cssColor.b;
      const slitGap = Math.max(0.4, Math.min(2.2, youngSlitMm * 0.9));

      // Barrier with two glowing slits S1 and S2 at X = -3.2
      const barrier = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 3.6, 5.2),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 })
      );
      barrier.position.set(-3.2, 2.0, 0);
      group.add(barrier);

      [-slitGap / 2, slitGap / 2].forEach((zSlit) => {
        const slitGlow = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 1.8, 0.14),
          new THREE.MeshBasicMaterial({ color: hexColor })
        );
        slitGlow.position.set(-3.2, 2.0, zSlit);
        group.add(slitGlow);

        // Diverging rays to screen X = 3.8
        for (let targetZ = -2.2; targetZ <= 2.2; targetZ += 1.1) {
          const rGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-3.1, 2.0, zSlit),
            new THREE.Vector3(3.8, 2.0, targetZ)
          ]);
          const rMat = new THREE.LineBasicMaterial({ color: hexColor, transparent: true, opacity: 0.45 });
          group.add(new THREE.Line(rGeo, rMat));
        }
      });

      // Procedural interference fringe texture on observation screen at X = 3.8
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 256;
      texCanvas.height = 128;
      const tCtx = texCanvas.getContext('2d');
      if (tCtx) {
        tCtx.fillStyle = '#050814';
        tCtx.fillRect(0, 0, 256, 128);
        const fringePeriodPx = (youngLambdaUm * 46) / Math.max(0.25, youngSlitMm);
        for (let px = 0; px < 256; px++) {
          const xRel = px - 128;
          const intensity = Math.pow(Math.cos((Math.PI * xRel) / fringePeriodPx), 2);
          tCtx.fillStyle = `rgba(${cssColor.r}, ${cssColor.g}, ${cssColor.b}, ${Math.max(0.05, intensity)})`;
          tCtx.fillRect(px, 0, 1, 128);
        }
      }
      const screenTex = new THREE.CanvasTexture(texCanvas);
      const screenMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3.6, 5.4),
        new THREE.MeshStandardMaterial({ map: screenTex, roughness: 0.4 })
      );
      screenMesh.position.set(3.8, 2.0, 0);
      group.add(screenMesh);
    }

    // -------------------------------------------------------------
    // SCENE 12: SÓNG DỪNG TRÊN DÂY 3D (STANDING WAVES & NODES)
    // -------------------------------------------------------------
    else if (mode === 'standing_wave_3d') {
      const span = 8.4;
      const halfSpan = span / 2;
      const yBase = 2.2;
      const harmonics = Math.max(1, Math.min(7, Math.round(standingN)));
      const amp = Math.max(0.2, Math.min(1.5, standingAmp));

      // Support posts at both ends
      [-halfSpan, halfSpan].forEach((px) => {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.16, yBase + 1.2, 16),
          new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.65, roughness: 0.3 })
        );
        post.position.set(px, (yBase + 1.2) / 2, 0);
        group.add(post);
      });

      // Equilibrium centerline
      const eqGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-halfSpan, yBase, 0),
        new THREE.Vector3(halfSpan, yBase, 0),
      ]);
      group.add(new THREE.Line(eqGeo, new THREE.LineBasicMaterial({ color: 0x475569 })));

      // Red node spheres
      for (let i = 0; i <= harmonics; i++) {
        const nx = -halfSpan + (i / harmonics) * span;
        const nodeOrb = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.35 })
        );
        nodeOrb.position.set(nx, yBase, 0);
        group.add(nodeOrb);
      }

      // Segmented vibrating beads + connecting polyline
      const segs = 64;
      const beads: THREE.Mesh[] = [];
      const beadGeo = new THREE.SphereGeometry(0.085, 12, 12);
      const beadMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.45 });
      const initPts: THREE.Vector3[] = [];
      for (let i = 0; i <= segs; i++) {
        const u = i / segs;
        const bx = -halfSpan + u * span;
        const bead = new THREE.Mesh(beadGeo, beadMat);
        bead.position.set(bx, yBase, 0);
        group.add(bead);
        beads.push(bead);
        initPts.push(new THREE.Vector3(bx, yBase, 0));
      }

      const stringLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(initPts),
        new THREE.LineBasicMaterial({ color: 0x38bdf8 })
      );
      group.add(stringLine);

      const stringPosAttr = stringLine.geometry.attributes.position as THREE.BufferAttribute;
      const sinHarmonics = new Float32Array(segs + 1);
      for (let i = 0; i <= segs; i++) {
        sinHarmonics[i] = amp * Math.sin(harmonics * Math.PI * (i / segs));
      }

      sceneTickRef.current = () => {
        const tCur = simStateRef.current.time;
        const cosW = Math.cos(tCur * (2.2 + harmonics * 0.55));
        for (let i = 0; i <= segs; i++) {
          const by = yBase + sinHarmonics[i] * cosW;
          beads[i].position.y = by;
          stringPosAttr.setY(i, by);
        }
        stringPosAttr.needsUpdate = true;
      };
      sceneTickRef.current(0);

      return () => {
        sceneTickRef.current = null;
      };
    }

    // -------------------------------------------------------------
    // SCENE 13: HIỆU ỨNG DOPPLER 3D (MOVING SOURCE & WAVEFRONTS)
    // -------------------------------------------------------------
    else if (mode === 'doppler_effect_3d') {
      const yWave = 1.6;
      const ratio = Math.max(0, Math.min(1.45, dopplerSpeedRatio));
      const freq = Math.max(1.0, Math.min(5.0, dopplerFreq));

      // Ground observer post at +X
      const obs = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.2, 1.5, 16),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.3 })
      );
      obs.position.set(4.5, 0.75, 0);
      group.add(obs);

      // Moving emitter sphere
      const sourceOrb = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.55 })
      );
      sourceOrb.position.set(-4.0, yWave, 0);
      group.add(sourceOrb);

      // Pool of 14 expanding 3D wavefront rings
      const rings: { mesh: THREE.Mesh; emitTime: number; emitX: number }[] = [];
      const ringBaseGeo = new THREE.TorusGeometry(1, 0.032, 10, 48);
      ringBaseGeo.rotateX(Math.PI / 2);
      for (let i = 0; i < 14; i++) {
        const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
        const ringMesh = new THREE.Mesh(ringBaseGeo, mat);
        ringMesh.position.set(-4.0, yWave, 0);
        ringMesh.scale.setScalar(0.01);
        group.add(ringMesh);
        rings.push({ mesh: ringMesh, emitTime: -99, emitX: -4.0 });
      }

      const cycleLen = 4.6;
      const waveV = 1.85;
      const srcV = waveV * ratio;

      sceneTickRef.current = () => {
        const tCycle = simStateRef.current.time % cycleLen;
        const srcX = ratio < 0.01 ? 0 : -4.2 + srcV * tCycle;
        sourceOrb.position.set(Math.min(4.8, srcX), yWave, 0);

        const intervalSec = Math.max(0.18, 1 / freq);
        const latestK = Math.floor(tCycle / intervalSec);
        for (let idx = 0; idx < rings.length; idx++) {
          const k = latestK - idx;
          const rObj = rings[idx];
          if (k < 0) {
            rObj.mesh.visible = false;
            continue;
          }
          const emitT = k * intervalSec;
          const age = tCycle - emitT;
          if (age <= 0 || age > 3.2) {
            rObj.mesh.visible = false;
            continue;
          }
          rObj.mesh.visible = true;
          const rad = Math.max(0.08, waveV * age);
          const emitX = ratio < 0.01 ? 0 : -4.2 + srcV * emitT;
          rObj.mesh.position.set(emitX, yWave, 0);
          rObj.mesh.scale.setScalar(rad);
          (rObj.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0.05, 0.85 * (1 - age / 3.2));
        }
      };
      sceneTickRef.current(0);

      return () => {
        sceneTickRef.current = null;
      };
    }

    // -------------------------------------------------------------
    // SCENE 14: HIỆU ỨNG QUANG ĐIỆN NGOÀI 3D (PHOTOELECTRIC TUBE)
    // -------------------------------------------------------------
    else if (mode === 'photoelectric_3d') {
      const photonEv = 1240 / Math.max(150, photoLambdaNm);
      const canEmit = photonEv >= photoWorkEv;

      // Glass outer cylinder
      const glassTube = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 7.0, 28, 1, true),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.16, roughness: 0.1, side: THREE.DoubleSide })
      );
      glassTube.rotation.z = Math.PI / 2;
      glassTube.position.set(0, 2.1, 0);
      group.add(glassTube);

      // Cathode (Blue left disc) & Anode (Amber right disc)
      const cathode = new THREE.Mesh(
        new THREE.CylinderGeometry(1.25, 1.25, 0.2, 24),
        new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.7, roughness: 0.25 })
      );
      cathode.rotation.z = Math.PI / 2;
      cathode.position.set(-2.9, 2.1, 0);
      group.add(cathode);

      const anode = new THREE.Mesh(
        new THREE.CylinderGeometry(1.25, 1.25, 0.2, 24),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.25 })
      );
      anode.rotation.z = Math.PI / 2;
      anode.position.set(2.9, 2.1, 0);
      group.add(anode);

      // Photon spheres hitting cathode
      const beamHex = photoLambdaNm < 380 ? 0xa855f7 : photoLambdaNm < 470 ? 0x3b82f6 : photoLambdaNm < 570 ? 0x10b981 : 0xef4444;
      const photons: THREE.Mesh[] = [];
      const pGeo = new THREE.SphereGeometry(0.11, 12, 12);
      const pMat = new THREE.MeshBasicMaterial({ color: beamHex });
      for (let i = 0; i < 6; i++) {
        const pm = new THREE.Mesh(pGeo, pMat);
        group.add(pm);
        photons.push(pm);
      }

      // Ejected photoelectrons moving cathode -> anode if photonEv >= photoWorkEv
      const electrons: THREE.Mesh[] = [];
      const eGeo = new THREE.SphereGeometry(0.1, 12, 12);
      const eMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.7 });
      for (let i = 0; i < 8; i++) {
        const em = new THREE.Mesh(eGeo, eMat);
        em.visible = canEmit;
        group.add(em);
        electrons.push(em);
      }

      const startVec = new THREE.Vector3();
      const endVec = new THREE.Vector3();
      sceneTickRef.current = () => {
        const tCur = simStateRef.current.time;

        for (let i = 0; i < photons.length; i++) {
          const prog = (tCur * 1.4 + i / photons.length) % 1;
          const zOff = Math.sin(i * 1.9) * 0.55;
          startVec.set(-0.3, 4.4, zOff);
          endVec.set(-2.75, 2.1 + Math.cos(i * 1.4) * 0.5, zOff);
          photons[i].position.lerpVectors(startVec, endVec, prog);
        }

        if (canEmit) {
          const keScale = Math.max(0.45, Math.min(2.4, 0.7 + (photonEv - photoWorkEv) * 0.55));
          for (let i = 0; i < electrons.length; i++) {
            const prog = (tCur * keScale + i / electrons.length) % 1;
            const yOff = 2.1 + Math.sin(i * 2.1) * 0.65;
            const zOff = Math.cos(i * 1.7) * 0.65;
            electrons[i].position.set(-2.7 + prog * 5.4, yOff, zOff);
          }
        }
      };
      sceneTickRef.current(0);

      return () => {
        sceneTickRef.current = null;
      };
    }

    // -------------------------------------------------------------
    // SCENES 15..32: +18 EXTRA 3D PHYSICS SIMULATIONS
    // -------------------------------------------------------------
    const extraTick = buildExtra3DScene(
      mode,
      group,
      () => extraParamsRef.current,
      () => simStateRef.current.time
    );
    if (extraTick) {
      sceneTickRef.current = extraTick;
      extraTick(0);
      return () => {
        sceneTickRef.current = null;
      };
    }
  }, [
    mode,
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
    circRadius3D,
    circOmega3D,
    genOmega3D,
    genFieldB3D,
    youngLambdaUm,
    youngSlitMm,
    standingN,
    standingAmp,
    dopplerSpeedRatio,
    dopplerFreq,
    photoLambdaNm,
    photoWorkEv,
  ]);

  const current3DSpec = PHYSICS_3D_SIMS[mode];

  const apply3DPreset = (settings: {
    speed?: number;
    amplitude?: number;
    frequency?: number;
    showGrid?: boolean;
  }) => {
    if (typeof settings.speed === 'number') setSimSpeed(settings.speed);
    if (typeof settings.showGrid === 'boolean') setShowGrid3D(settings.showGrid);
    const amp = settings.amplitude ?? 1;
    const freq = settings.frequency ?? 1;
    switch (mode) {
      case 'pendulum_spring':
        setSpringK(Math.round(40 / Math.max(0.4, amp)));
        break;
      case 'projectile_3d':
        setProjAngle(45);
        setProjV0(Math.round(18 * amp));
        break;
      case 'circular_motion_3d':
        setCircRadius3D(Number((2.5 * amp).toFixed(1)));
        setCircOmega3D(Number((2.2 * (settings.speed ?? 1)).toFixed(1)));
        break;
      case 'wave_ripple':
        setWaveFrequency(Number((2.5 * freq).toFixed(1)));
        break;
      case 'standing_wave_3d':
        setStandingAmp(Number(Math.min(1.4, 0.9 * amp).toFixed(2)));
        setStandingN(freq > 1.3 ? 5 : 3);
        break;
      case 'doppler_effect_3d':
        setDopplerSpeedRatio((settings.speed ?? 1) > 1.3 ? 0.95 : 0.55);
        setDopplerFreq(Number((2.8 * freq).toFixed(1)));
        break;
      case 'lorentz_helix':
        setMagneticB(amp > 1.3 ? 1.0 : 2.0);
        break;
      case 'ac_generator_3d':
        setGenOmega3D(Number((2.5 * (settings.speed ?? 1)).toFixed(1)));
        break;
      case 'optics_3d':
        setFocalLength3D(amp > 1.3 ? 1.4 : 2.2);
        break;
      case 'young_interference_3d':
        setYoungLambdaUm(freq < 0.85 ? 0.65 : 0.53);
        setYoungSlitMm(amp > 1.3 ? 0.6 : 1.0);
        break;
      case 'photoelectric_3d':
        setPhotoLambdaNm(freq > 1.2 ? 230 : 300);
        break;
      case 'thermal_gas_3d':
        setGasTempK(Math.round(300 * Math.max(0.6, freq)));
        break;
      default: {
        const cfg = EXTRA_3D_SCENE_CONFIGS[mode as ExtraPhysics3DModeId];
        if (cfg) {
          const pDef1 = cfg.params[0];
          const pDef2 = cfg.params[1];
          const mid1 = pDef1 ? pDef1.defaultVal : 1;
          const mid2 = pDef2 ? pDef2.defaultVal : 1;
          const nextP1 = pDef1
            ? Math.min(pDef1.max, Math.max(pDef1.min, Number((mid1 * amp).toFixed(2))))
            : mid1;
          const nextP2 = pDef2
            ? Math.min(pDef2.max, Math.max(pDef2.min, Number((mid2 * freq).toFixed(2))))
            : mid2;
          setExtraParams({ p1: nextP1, p2: nextP2 });
        }
        break;
      }
    }
  };

  const allModeTabs: { id: Physics3DMode; label: string }[] = [
    { id: 'kinematics_3d', label: 'Động Học & Vectơ' },
    { id: 'circular_motion_3d', label: 'Tròn Đều 3D' },
    { id: 'projectile_3d', label: 'Ném Xiên 3D' },
    { id: 'pendulum_spring', label: 'Con Lắc 3D' },
    { id: 'wave_ripple', label: 'Sóng Nước 3D' },
    { id: 'standing_wave_3d', label: 'Sóng Dừng 3D' },
    { id: 'doppler_effect_3d', label: 'Doppler 3D' },
    { id: 'lorentz_helix', label: 'Từ Trường Lorentz' },
    { id: 'ac_generator_3d', label: 'Máy Phát AC 3D' },
    { id: 'optics_3d', label: 'Quang Học 3D' },
    { id: 'young_interference_3d', label: 'Khe Y-âng 3D' },
    { id: 'photoelectric_3d', label: 'Quang Điện 3D' },
    { id: 'thermal_gas_3d', label: 'Khí Lí Tưởng 3D' },
    { id: 'bohr_atom', label: 'Nguyên Tử Bohr' },
    ...(Object.values(EXTRA_3D_SCENE_CONFIGS).map((cfg) => ({
      id: cfg.mode as Physics3DMode,
      label: cfg.shortLabel
    })))
  ];
  const visibleModeTabs =
    allowedModes && allowedModes.length > 0
      ? allModeTabs.filter((m) => allowedModes.includes(m.id))
      : allModeTabs;

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
            : 'rounded-lg min-h-[560px] lg:min-h-0 lg:h-[650px]'
        }`}
      >
        {/* TOP HEADER OVERLAY (No backdrop-blur over WebGL; stacked on < lg, floating on lg+) */}
        <div className="relative z-20 p-2.5 sm:p-3 lg:p-0 lg:absolute lg:top-4 lg:left-4 lg:right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/95 lg:bg-transparent border-b border-slate-800/80 lg:border-b-0 lg:pointer-events-none shrink-0">
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/95 border border-slate-700/80 text-white shadow-lg max-w-full">
            {(isFullscreen || onBack) && (
              <button
                onClick={() => {
                  if (isFullscreen) {
                    setIsFullscreen(false);
                  } else if (onBack) {
                    onBack();
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0"
                title={isFullscreen ? 'Thu nhỏ (Esc)' : 'Quay lại trang trước'}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isFullscreen ? 'Thu nhỏ' : 'Quay lại'}</span>
              </button>
            )}
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wide truncate">
              {domainTitle ? `${domainTitle} · ` : ''}
              {mode === 'pendulum_spring' && 'Con Lắc Đơn & Con Lắc Lò Xo 3D'}
              {mode === 'projectile_3d' && 'Chuyển Động Ném Xiên & Bệ Pháo 3D'}
              {mode === 'lorentz_helix' && 'Từ Trường Lorentz & Quỹ Đạo Xoắn Ốc 3D'}
              {mode === 'wave_ripple' && 'Giao Thoa Sóng Mặt Nước Nổi Khối 3D'}
              {mode === 'bohr_atom' && 'Mẫu Nguyên Tử Bohr & Các Mức Lượng Tử'}
              {mode === 'optics_3d' && 'Quang Hình Học 3D & Đường Đi Tia Sáng'}
              {mode === 'kinematics_3d' && 'Động Học Chất Điểm & Tổng Hợp Vectơ 3D'}
              {mode === 'thermal_gas_3d' && 'Động Học Phân Tử & Khí Lí Tưởng 3D'}
              {mode === 'circular_motion_3d' && 'Chuyển Động Tròn Đều & Lực Hướng Tâm 3D'}
              {mode === 'ac_generator_3d' && 'Máy Phát Điện Xoay Chiều & Từ Thông 3D'}
              {mode === 'young_interference_3d' && 'Giao Thoa Khe Y-âng & Hệ Vân Sáng Tối 3D'}
              {mode === 'standing_wave_3d' && 'Sóng Dừng Trên Sợi Dây & Nút Bụng 3D'}
              {mode === 'doppler_effect_3d' && 'Hiệu Ứng Doppler & Nón Sóng Xung Kích 3D'}
              {mode === 'photoelectric_3d' && 'Ống Chân Không & Hiệu Ứng Quang Điện 3D'}
              {EXTRA_3D_SCENE_CONFIGS[mode as ExtraPhysics3DModeId]?.hudTitle}
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 max-w-full">
            {/* Domain-scoped Mode Switcher Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-900/95 border border-slate-700/80 rounded-lg shadow-lg overflow-x-auto max-w-full scrollbar-none">
              {visibleModeTabs.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id);
                    onSelectMode?.(m.id);
                  }}
                  className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-md whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    mode === m.id ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Play/Pause + Step + Grid + Quality + Reset + Fullscreen */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 rounded-md bg-slate-900/95 border border-slate-700/80 text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer shrink-0"
              title={isRunning ? 'Tạm dừng mô phỏng' : 'Tiếp tục mô phỏng'}
            >
              {isRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={handleStepOnce}
              className="hidden sm:flex items-center gap-1 px-2.5 py-2 rounded-md bg-slate-900/95 border border-slate-700/80 text-[11px] font-bold text-slate-200 hover:text-white transition-colors shadow-lg cursor-pointer shrink-0 whitespace-nowrap"
              title="Tiến 1 bước +0.05s"
            >
              <StepForward className="w-3.5 h-3.5 text-cyan-400" />
              <span>+0.05s</span>
            </button>

            <button
              onClick={() => setShowGrid3D((g) => !g)}
              className={`p-2 rounded-md border transition-colors shadow-lg cursor-pointer shrink-0 ${
                showGrid3D
                  ? 'bg-sky-600/90 border-sky-400 text-white'
                  : 'bg-slate-900/95 border-slate-700/80 text-slate-400 hover:text-white'
              }`}
              title={showGrid3D ? 'Ẩn lưới tọa độ' : 'Hiện lưới tọa độ'}
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              onClick={() => setQuality3D((q) => (q === 'light' ? 'high' : 'light'))}
              className={`hidden md:flex items-center gap-1 px-2 py-2 rounded-md border text-[11px] font-bold transition-colors shadow-lg cursor-pointer shrink-0 ${
                quality3D === 'high'
                  ? 'bg-violet-600/90 border-violet-400 text-white'
                  : 'bg-slate-900/95 border-slate-700/80 text-slate-300 hover:text-white'
              }`}
              title="Chế độ đồ họa WebGL (Nhẹ FPS cao / Sắc nét)"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{quality3D === 'high' ? 'HD' : 'Mượt'}</span>
            </button>

            <button
              onClick={handleReset3D}
              className="p-2 rounded-md bg-slate-900/95 border border-slate-700/80 text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer shrink-0"
              title="Đặt lại thời gian t = 0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-md bg-slate-900/95 border border-slate-700/80 text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer shrink-0"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3D WebGL Canvas (Unobstructed middle stage on < lg, full height on lg+) */}
        <div className={`relative w-full ${isFullscreen ? 'flex-1 min-h-[240px] lg:h-full' : 'h-[280px] sm:h-[360px] lg:h-full'}`}>
          <div
            ref={mountRef}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
          />
          {contextLost && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 text-slate-200 text-xs p-4 text-center">
              Ngữ cảnh WebGL tạm ngưng. Vui lòng chuyển tab hoặc tải lại để khôi phục mô phỏng 3D.
            </div>
          )}
        </div>

        {/* ERGONOMIC COLLAPSIBLE CONTROL DOCK (No backdrop-blur over WebGL) */}
        <div className="relative z-20 p-2.5 sm:p-3 lg:p-0 lg:absolute lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-[96%] lg:max-w-3xl lg:pointer-events-none bg-slate-950/95 lg:bg-transparent border-t border-slate-800/80 lg:border-t-0 shrink-0">
          <div className="pointer-events-auto bg-slate-900/95 border border-slate-700/80 rounded-lg shadow-2xl p-3 sm:p-4 text-white space-y-2.5 sm:space-y-3 max-h-[34dvh] sm:max-h-[260px] lg:max-h-none overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Thông Số Tùy Chỉnh Tự Do 3D</span>
              {current3DSpec && current3DSpec.presets.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 ml-1">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  {current3DSpec.presets.map((pr) => (
                    <button
                      key={pr.label}
                      type="button"
                      onClick={() => apply3DPreset(pr.settings)}
                      title={pr.description}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-md border border-slate-800">
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

              {/* 9. Circular Motion 3D */}
              {mode === 'circular_motion_3d' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <Numeric3DControl
                      label="Bán kính quỹ đạo r"
                      unit="m"
                      value={circRadius3D}
                      min={1.0}
                      max={4.0}
                      step={0.2}
                      accentClass="accent-cyan-500"
                      onChange={(v) => setCircRadius3D(v)}
                    />
                    <Numeric3DControl
                      label="Tốc độ góc ω"
                      unit="rad/s"
                      value={circOmega3D}
                      min={0.5}
                      max={5.0}
                      step={0.2}
                      accentClass="accent-amber-500"
                      onChange={(v) => setCircOmega3D(v)}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    v = ω·r = {(circOmega3D * circRadius3D).toFixed(2)} m/s · a_ht = ω²·r = {(circOmega3D * circOmega3D * circRadius3D).toFixed(2)} m/s² (Mũi tên xanh: v, mũi tên đỏ: F_ht).
                  </div>
                </div>
              )}

              {/* 10. AC Generator 3D */}
              {mode === 'ac_generator_3d' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <Numeric3DControl
                      label="Tốc độ quay ω"
                      unit="rad/s"
                      value={genOmega3D}
                      min={0.5}
                      max={6.0}
                      step={0.25}
                      accentClass="accent-amber-500"
                      onChange={(v) => setGenOmega3D(v)}
                    />
                    <Numeric3DControl
                      label="Cảm ứng từ B"
                      unit="T"
                      value={genFieldB3D}
                      min={0.4}
                      max={2.5}
                      step={0.1}
                      accentClass="accent-blue-500"
                      onChange={(v) => setGenFieldB3D(v)}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Từ thông Φ = NBS·cos(ωt) · Suất điện động cực đại E₀ = NBSω ∝ {(genFieldB3D * genOmega3D).toFixed(2)} V (Pháp tuyến xanh quay cắt đường sức B).
                  </div>
                </div>
              )}

              {/* 11. Young Double-Slit Interference 3D */}
              {mode === 'young_interference_3d' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <Numeric3DControl
                      label="Bước sóng λ"
                      unit="μm"
                      value={youngLambdaUm}
                      min={0.38}
                      max={0.75}
                      step={0.01}
                      accentClass="accent-rose-500"
                      onChange={(v) => setYoungLambdaUm(v)}
                    />
                    <Numeric3DControl
                      label="Khoảng cách 2 khe a"
                      unit="mm"
                      value={youngSlitMm}
                      min={0.4}
                      max={2.2}
                      step={0.1}
                      accentClass="accent-emerald-500"
                      onChange={(v) => setYoungSlitMm(v)}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Khoảng vân i = λD/a (D = 2m) = {((youngLambdaUm * 2.0) / Math.max(0.2, youngSlitMm)).toFixed(2)} mm · Vân sáng trung tâm nằm tại chính giữa màn quan sát!
                  </div>
                </div>
              )}

              {/* 12. Standing Wave 3D */}
              {mode === 'standing_wave_3d' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <Numeric3DControl
                      label="Số bó sóng nguyên k"
                      unit="bó"
                      value={standingN}
                      min={1}
                      max={6}
                      step={1}
                      accentClass="accent-cyan-500"
                      onChange={(v) => setStandingN(v)}
                    />
                    <Numeric3DControl
                      label="Biên độ bụng sóng"
                      unit="m"
                      value={standingAmp}
                      min={0.3}
                      max={1.4}
                      step={0.05}
                      accentClass="accent-emerald-500"
                      onChange={(v) => setStandingAmp(v)}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Dây 2 đầu cố định: Số nút sóng = {Math.round(standingN) + 1} (điểm đỏ đứng yên), số bụng sóng = {Math.round(standingN)} (dao động mạnh nhất).
                  </div>
                </div>
              )}

              {/* 13. Doppler Effect 3D */}
              {mode === 'doppler_effect_3d' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <Numeric3DControl
                      label="Tỉ số tốc độ nguồn v_s / v"
                      unit="Mach"
                      value={dopplerSpeedRatio}
                      min={0}
                      max={1.45}
                      step={0.05}
                      accentClass="accent-amber-500"
                      onChange={(v) => setDopplerSpeedRatio(v)}
                    />
                    <Numeric3DControl
                      label="Tần số phát f₀"
                      unit="Hz"
                      value={dopplerFreq}
                      min={1.0}
                      max={5.0}
                      step={0.2}
                      accentClass="accent-cyan-500"
                      onChange={(v) => setDopplerFreq(v)}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {dopplerSpeedRatio >= 1
                      ? `Nguồn siêu âm (Mach ${dopplerSpeedRatio.toFixed(2)}) vượt mặt đầu sóng → Hình thành sóng xung kích!`
                      : `Các gợn sóng phía trước nguồn nén lại: tần số máy thu f' = ${(dopplerFreq / Math.max(0.05, 1 - dopplerSpeedRatio)).toFixed(2)} Hz.`}
                  </div>
                </div>
              )}

              {/* 14. Photoelectric Effect 3D */}
              {mode === 'photoelectric_3d' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <Numeric3DControl
                      label="Bước sóng ánh sáng λ"
                      unit="nm"
                      value={photoLambdaNm}
                      min={180}
                      max={700}
                      step={10}
                      accentClass="accent-purple-500"
                      onChange={(v) => setPhotoLambdaNm(v)}
                    />
                    <Numeric3DControl
                      label="Công thoát kim loại A"
                      unit="eV"
                      value={photoWorkEv}
                      min={1.8}
                      max={5.0}
                      step={0.1}
                      accentClass="accent-sky-500"
                      onChange={(v) => setPhotoWorkEv(v)}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ε = {(1240 / Math.max(150, photoLambdaNm)).toFixed(2)} eV · Giới hạn λ₀ = {(1240 / photoWorkEv).toFixed(0)} nm ·{' '}
                    {1240 / Math.max(150, photoLambdaNm) >= photoWorkEv
                      ? 'Đủ năng lượng bứt quang electron về phía Anốt!'
                      : 'Chưa đủ công thoát A (ε < A) → Không có quang electron!'}
                  </div>
                </div>
              )}

              {/* 15..32. Extra 18 3D Physics Scene Controls */}
              {EXTRA_3D_SCENE_CONFIGS[mode as ExtraPhysics3DModeId] &&
                (() => {
                  const cfg = EXTRA_3D_SCENE_CONFIGS[mode as ExtraPhysics3DModeId];
                  const pDef1 = cfg.params[0];
                  const pDef2 = cfg.params[1];
                  return (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {pDef1 && (
                          <Numeric3DControl
                            label={pDef1.label}
                            unit={pDef1.unit}
                            value={extraParams.p1}
                            min={pDef1.min}
                            max={pDef1.max}
                            step={pDef1.step}
                            accentClass={pDef1.accent}
                            onChange={(v) => setExtraParams((prev) => ({ ...prev, p1: v }))}
                          />
                        )}
                        {pDef2 && (
                          <Numeric3DControl
                            label={pDef2.label}
                            unit={pDef2.unit}
                            value={extraParams.p2}
                            min={pDef2.min}
                            max={pDef2.max}
                            step={pDef2.step}
                            accentClass={pDef2.accent}
                            onChange={(v) => setExtraParams((prev) => ({ ...prev, p2: v }))}
                          />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {cfg.computeReadout(extraParams)}
                      </div>
                    </div>
                  );
                })()}
            </div>
          )}
        </div>
      </div>
    </div>
    </ViewportPortal>
  );
};
