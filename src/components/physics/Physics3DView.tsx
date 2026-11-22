import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { AnaglyphEffect } from 'three/addons/effects/AnaglyphEffect.js';
import { StereoEffect } from 'three/addons/effects/StereoEffect.js';
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
  FileCode2,
  Scissors,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ViewportPortal } from '../common/ViewportPortal';
import { PHYSICS_3D_SIMS, getDomainFor3DSim } from '../../data/physicsDomainsData';
import { Physics3DMode as SharedPhysics3DMode } from '../../types';
import { EXTRA_3D_SCENE_CONFIGS, ExtraPhysics3DModeId } from '../../data/physicsExtraSimsData';
import { buildExtra3DScene } from './physics3DExtraScenes';
import { PhysicsApparatusWorkbench } from './PhysicsApparatusWorkbench';
import {
  applyOffAxisProjection,
  HologramDisplayMode,
  useHeadTrackedHologram
} from '../../hooks/useHeadTrackedHologram';
import { HologramModeControls } from '../common/HologramModeControls';
import { SimToCodeModal } from './SimToCodeModal';
import { applySphericalOrbitDelta, subscribeRemoteCommand } from '../../lib/remoteControlBus';
import {
  createCrispLine2,
  createPostProcessingPipeline,
  createTroikaLabel,
  GPUParticlePool,
  OptimizedTrail,
  PostProcessPipeline,
  syncLine2Resolution,
  updateBillboardLabels,
} from '../../lib/three3DEnhancements';

const CUTAWAY_PHYSICS_MODES = new Set<string>([
  'thermal_gas_3d',
  'photoelectric_3d',
  'resonance_tubes_3d',
  'blackbody_cavity_3d',
  'carnot_piston_3d',
  'cathode_ray_tube_3d',
  'electroscope_3d',
  'fiber_optic_3d',
  'diffusion_gases_3d',
  'tokamak_fusion_3d',
]);

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
            className="w-9 h-9 md:w-7 md:h-7 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            title={`Giảm ${step}`}
          >
            <Minus className="w-3.5 h-3.5" />
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
            className="w-16 min-h-[36px] md:min-h-0 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 focus:border-amber-500 text-right font-mono font-bold text-white text-xs outline-none"
          />
          <button
            type="button"
            onClick={() => onChange(Number((value + step).toFixed(4)))}
            className="w-9 h-9 md:w-7 md:h-7 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            title={`Tăng ${step}`}
          >
            <Plus className="w-3.5 h-3.5" />
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
  const [showCutaway3D, setShowCutaway3D] = useState(false);
  const [quality3D, setQuality3D] = useState<'light' | 'high'>('light');
  const [hologramMode, setHologramMode] = useState<HologramDisplayMode>('normal');
  const hologramModeRef = useRef<HologramDisplayMode>('normal');
  hologramModeRef.current = hologramMode;
  const { headOffsetRef, camStatus } = useHeadTrackedHologram(hologramMode);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

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
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const isSoftwareGlRef = useRef<boolean>(false);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const sceneTickRef = useRef<((effDt: number) => void) | null>(null);
  const pipelineRef = useRef<PostProcessPipeline | null>(null);
  const particlePoolRef = useRef<GPUParticlePool | null>(null);
  const trailRef = useRef<OptimizedTrail | null>(null);
  const cutawayPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.15));
  const modeRef = useRef<Physics3DMode>(mode);
  modeRef.current = mode;
  const quality3DRef = useRef<'light' | 'high'>(quality3D);
  quality3DRef.current = quality3D;
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
    if (!isSoftwareGl) {
      setQuality3D('high');
    }

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.022);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 300),
      0.1,
      100
    );
    camera.position.set(0, 6, 12);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.localClippingEnabled = true;
    if (!isSoftwareGl) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 30;
    controls.minDistance = 2;

    // Studio Environment Reflection for metallic materials (PBR)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Lighting Rig (Warm Key + Cool Hemisphere Fill + Rim)
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 0.88);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.75);
    keyLight.position.set(6, 11, 8);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -9;
      keyLight.shadow.camera.right = 9;
      keyLight.shadow.camera.top = 9;
      keyLight.shadow.camera.bottom = -9;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 32;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 1.0);
    fillLight.position.set(-6, 4, -6);
    scene.add(fillLight);

    // Studio Workbench Plinth + Glowing Ring + Grid Floor
    const stageDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(10.2, 10.6, 0.08, 64),
      new THREE.MeshStandardMaterial({ color: 0x060b17, roughness: 0.72, metalness: 0.25 })
    );
    stageDisc.position.y = -0.052;
    stageDisc.receiveShadow = !isSoftwareGl;
    scene.add(stageDisc);

    const stageRing = new THREE.Mesh(
      new THREE.TorusGeometry(10.2, 0.03, 12, 72),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.45, metalness: 0.6, roughness: 0.25 })
    );
    stageRing.rotation.x = Math.PI / 2;
    stageRing.position.y = -0.01;
    scene.add(stageRing);

    const grid = new THREE.GridHelper(20, 20, 0x3b82f6, 0x1e293b);
    grid.position.y = -0.006;
    grid.visible = showGrid3D;
    gridRef.current = grid;
    scene.add(grid);

    // Dynamic models group + GPU particle pool + LOD trail
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicGroupRef.current = dynamicGroup;

    const particlePool = new GPUParticlePool(96, 0.06, 0x38bdf8, 0x0ea5e9);
    scene.add(particlePool.mesh);
    particlePoolRef.current = particlePool;

    const trail = new OptimizedTrail(64, 0x38bdf8, 0.85);
    scene.add(trail.line);
    trailRef.current = trail;

    // Post-processing pipeline (pmndrs/postprocessing Bloom + SMAA, bypassed on software GL)
    let pipeline: PostProcessPipeline | null = null;
    if (!isSoftwareGl) {
      try {
        pipeline = createPostProcessingPipeline(renderer, scene, camera, {
          bloomIntensity: 0.48,
          luminanceThreshold: 0.78,
          enableSmaa: true,
        });
        pipeline.setSize(container.clientWidth, Math.max(container.clientHeight, 300));
      } catch {
        pipeline = null;
      }
    }
    pipelineRef.current = pipeline;

    // Anaglyph & Stereo VR Effects
    const anaglyphEffect = new AnaglyphEffect(renderer);
    anaglyphEffect.setSize(container.clientWidth, Math.max(container.clientHeight, 300));
    const stereoEffect = new StereoEffect(renderer);
    stereoEffect.setSize(container.clientWidth, Math.max(container.clientHeight, 300));
    let lastHoloMode: HologramDisplayMode = 'normal';

    // Unified single Animation Loop (time integration + scene kinematics + WebGL render)
    let frameId = 0;
    let alive = true;
    let lastTime = performance.now();
    let lastTickStep = -1;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (!alive) return;
        const s = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (s === gl.UNSIGNALED) frameId = window.setTimeout(poll, 5);
        else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const animate = () => {
      if (!alive) return;
      if (document.hidden) {
        lastTime = performance.now();
        if (isSoftwareGl) frameId = window.setTimeout(animate, 120);
        else frameId = requestAnimationFrame(animate);
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
        particlePool.update(effDt, modeRef.current === 'projectile_3d' ? -3.92 : 0);
      }

      controls.update();
      updateBillboardLabels(dynamicGroup, camera);

      const curHolo = hologramModeRef.current;
      if (curHolo === 'head_cam' || curHolo === 'head_mouse') {
        applyOffAxisProjection(camera, headOffsetRef.current, 12, 3.8);
      } else if (lastHoloMode === 'head_cam' || lastHoloMode === 'head_mouse') {
        camera.updateProjectionMatrix();
      }
      if ((lastHoloMode === 'anaglyph' || lastHoloMode === 'vr_stereo') && curHolo !== lastHoloMode) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w > 0 && h > 0) {
          renderer.setSize(w, h);
          pipeline?.setSize(w, h);
        }
      }
      lastHoloMode = curHolo;

      if (curHolo === 'anaglyph') {
        anaglyphEffect.render(scene, camera);
      } else if (curHolo === 'vr_stereo') {
        stereoEffect.render(scene, camera);
      } else if (pipeline && !isSoftwareGl && quality3DRef.current === 'high') {
        pipeline.render(dt);
      } else {
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) afterDraw(animate);
      else frameId = requestAnimationFrame(animate);
    };
    if (isSoftwareGl) afterDraw(animate);
    else frameId = requestAnimationFrame(animate);

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
      pipeline?.setSize(width, height);
      anaglyphEffect.setSize(width, height);
      stereoEffect.setSize(width, height);
      syncLine2Resolution(dynamicGroup, width, height);
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    if (resizeObserver) resizeObserver.observe(container);

    const unsubRemote = subscribeRemoteCommand((cmd) => {
      if (cmd.type === 'orbit') {
        applySphericalOrbitDelta(
          camera,
          controls.target,
          cmd.yawDelta,
          cmd.pitchDelta,
          cmd.zoomDelta,
          controls.minDistance,
          controls.maxDistance
        );
        controls.update();
      } else if (cmd.type === 'reset_view') {
        camera.position.set(0, 6, 12);
        controls.target.set(0, 0, 0);
        controls.update();
      } else if (cmd.type === 'toggle_play') {
        setIsRunning((prev) => !prev);
      }
    });

    return () => {
      alive = false;
      unsubRemote();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('webglcontextlost', onContextLost);
      canvasEl.removeEventListener('webglcontextrestored', onContextRestored);
      resizeObserver?.disconnect();
      controls.dispose();
      pipeline?.dispose();
      pipelineRef.current = null;
      particlePool.dispose();
      particlePoolRef.current = null;
      trail.dispose();
      trailRef.current = null;
      anaglyphEffect.dispose();
      scene.traverse((obj: any) => {
        if (typeof obj.dispose === 'function' && obj.userData?.isTroikaLabel) {
          obj.dispose();
        }
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
          else obj.material.dispose();
        }
      });
      sceneTickRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      gridRef.current = null;
      envRT.dispose();
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

    // Clear previous geometries, Troika workers, trails, and expired sparks to prevent GPU leaks
    trailRef.current?.clear();
    particlePoolRef.current?.update(3.0, 0);
    const clipPlanes = showCutaway3D ? [cutawayPlaneRef.current] : [];

    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      child.traverse((obj: any) => {
        if (typeof obj.dispose === 'function' && obj.userData?.isTroikaLabel) {
          obj.dispose();
        }
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
      const isSw = isSoftwareGlRef.current;

      // Grounded Lab Gantry Frame (base pads + vertical pillars + support beam + clamp collars)
      const frameMat = new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.82, roughness: 0.22, clearcoat: 0.6 });
      const clampMat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.78, roughness: 0.2, clearcoat: 0.8 });
      [-3.4, 3.4].forEach((px) => {
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.16, 20), frameMat);
        pad.position.set(px, 0.08, 0);
        pad.castShadow = !isSw;
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 5.0, 16), frameMat);
        pillar.position.set(px, 2.58, 0);
        pillar.castShadow = !isSw;
        group.add(pad, pillar);
      });

      const beam = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.24, 0.52), frameMat);
      beam.position.set(0, 5.05, 0);
      beam.castShadow = !isSw;
      group.add(beam);

      [-2, 2].forEach((cx) => {
        const collar = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.34, 0.6), clampMat);
        collar.position.set(cx, 5.05, 0);
        group.add(collar);
      });

      // Spring Bob (clearcoat physical metallic blue sphere)
      const springBobGeo = new THREE.SphereGeometry(0.5, 32, 32);
      const springBobMat = new THREE.MeshPhysicalMaterial({ color: 0x3b82f6, metalness: 0.65, roughness: 0.14, clearcoat: 1.0, clearcoatRoughness: 0.06 });
      const springBob = new THREE.Mesh(springBobGeo, springBobMat);
      springBob.position.set(-2, 2.5, 0);
      springBob.castShadow = !isSw;
      group.add(springBob);

      // Equilibrium target ring under spring bob
      const eqRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.025, 10, 40),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.5 })
      );
      eqRing.rotation.x = Math.PI / 2;
      eqRing.position.set(-2, 2.5, 0);
      group.add(eqRing);

      // Spring Coil
      const numTurns = 12;
      const springRadius = 0.25;
      const springCurvePoints: THREE.Vector3[] = [];
      const steps = 108;
      for (let i = 0; i <= steps; i++) {
        const tVal = i / steps;
        const angle = tVal * numTurns * Math.PI * 2;
        const x = Math.cos(angle) * springRadius;
        const z = Math.sin(angle) * springRadius;
        const y = -tVal;
        springCurvePoints.push(new THREE.Vector3(x, y, z));
      }
      const springCurve = new THREE.CatmullRomCurve3(springCurvePoints);
      const springTubeGeo = new THREE.TubeGeometry(springCurve, 96, 0.042, 10, false);
      const springTubeMat = new THREE.MeshPhysicalMaterial({ color: 0xcbd5e1, metalness: 0.92, roughness: 0.12, clearcoat: 0.8 });
      const springMesh = new THREE.Mesh(springTubeGeo, springTubeMat);
      springMesh.position.set(-2, 5, 0);
      springMesh.scale.y = 2.5;
      springMesh.castShadow = !isSw;
      group.add(springMesh);

      // Pendulum Rod & Bob (cylindrical steel rod instead of 1px line)
      const pendLen = 3.5;
      const pendBobGeo = new THREE.SphereGeometry(0.45, 28, 24);
      const pendBobMat = new THREE.MeshPhysicalMaterial({ color: 0x10b981, metalness: 0.68, roughness: 0.14, clearcoat: 1.0, clearcoatRoughness: 0.06 });
      const pendBob = new THREE.Mesh(pendBobGeo, pendBobMat);
      pendBob.castShadow = !isSw;
      group.add(pendBob);

      const pendRodGeo = new THREE.CylinderGeometry(0.032, 0.032, pendLen, 10);
      pendRodGeo.translate(0, -pendLen / 2, 0);
      const pendRod = new THREE.Mesh(
        pendRodGeo,
        new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.18 })
      );
      pendRod.position.set(2, 5, 0);
      pendRod.castShadow = !isSw;
      group.add(
        pendRod,
        createTroikaLabel({ text: `Con lắc lò xo (k=${safeK} N/m)`, position: [-2, 5.7, 0], fontSize: 0.3, color: 0x38bdf8 }),
        createTroikaLabel({ text: `Con lắc đơn (g=${g} m/s²)`, position: [2, 5.7, 0], fontSize: 0.3, color: 0x34d399 })
      );

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
        pendRod.rotation.z = theta;
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
      const scale = 0.4;

      const cannonBaseX = -6;
      const pivotY = 0.62;
      const barrelLength = 2.0;

      // Exact world coordinates of the cannon barrel muzzle tip
      const muzzleX = cannonBaseX + barrelLength * Math.cos(rad);
      const muzzleY = pivotY + barrelLength * Math.sin(rad);

      // Solve exact time until projectile hits ground (py = 0) from muzzleY
      const aQuad = 0.5 * g * scale;
      const bQuad = v0y * scale;
      const tImpact = Math.max(
        0.1,
        (bQuad + Math.sqrt(bQuad * bQuad + 4 * aQuad * muzzleY)) / (2 * aQuad)
      );

      // Composite Multi-Part Cannon Assembly
      const cannonGroup = new THREE.Group();
      cannonGroup.position.set(cannonBaseX, 0, 0);

      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.55,
        roughness: 0.48
      });
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.86,
        roughness: 0.22
      });
      const steelMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.85,
        roughness: 0.25
      });

      // 1. Heavy cylindrical plinth flush on ground (y = 0)
      const basePlinth = new THREE.Mesh(
        new THREE.CylinderGeometry(0.92, 1.12, 0.24, 24),
        baseMat
      );
      basePlinth.position.y = 0.12;
      cannonGroup.add(basePlinth);

      // 2. Brass turret ring
      const turretRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.74, 0.78, 0.1, 24),
        brassMat
      );
      turretRing.position.y = 0.29;
      cannonGroup.add(turretRing);

      // 3. Dual side carriage brackets + elevation trunnion axle
      [-0.42, 0.42].forEach((zOff) => {
        const bracket = new THREE.Mesh(
          new THREE.BoxGeometry(1.05, 0.44, 0.12),
          baseMat
        );
        bracket.position.set(-0.08, 0.48, zOff);
        cannonGroup.add(bracket);
      });
      const axle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 1.02, 16),
        brassMat
      );
      axle.rotation.x = Math.PI / 2;
      axle.position.set(0, pivotY, 0);
      cannonGroup.add(axle);

      // 4. Barrel pivot rotated strictly to launch angle `safeAngle` above +X
      // Cylinder points along +Y, so rotation.z = rad - Math.PI / 2 aligns +Y with (cos(rad), sin(rad))
      const barrelPivot = new THREE.Group();
      barrelPivot.position.set(0, pivotY, 0);
      barrelPivot.rotation.z = rad - Math.PI / 2;

      const barrelGeo = new THREE.CylinderGeometry(0.22, 0.31, barrelLength, 24);
      barrelGeo.translate(0, barrelLength / 2, 0);
      const barrelMesh = new THREE.Mesh(barrelGeo, steelMat);
      barrelPivot.add(barrelMesh);

      // Breech cap & cascabel knob at rear (y <= 0 along barrel axis)
      const breechSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.31, 20, 16),
        steelMat
      );
      barrelPivot.add(breechSphere);
      const breechKnob = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 14, 14),
        brassMat
      );
      breechKnob.position.y = -0.36;
      barrelPivot.add(breechKnob);

      // Brass reinforcing collar rings + glowing muzzle rim
      [0.45, 1.25].forEach((yBand, idx) => {
        const band = new THREE.Mesh(
          new THREE.TorusGeometry(idx === 0 ? 0.295 : 0.258, 0.036, 12, 24),
          brassMat
        );
        band.rotation.x = Math.PI / 2;
        band.position.y = yBand;
        barrelPivot.add(band);
      });

      const muzzleCollar = new THREE.Mesh(
        new THREE.TorusGeometry(0.235, 0.045, 12, 24),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.6,
          metalness: 0.7,
          roughness: 0.25
        })
      );
      muzzleCollar.rotation.x = Math.PI / 2;
      muzzleCollar.position.y = barrelLength;
      barrelPivot.add(muzzleCollar);

      const boreCap = new THREE.Mesh(
        new THREE.CircleGeometry(0.18, 20),
        new THREE.MeshBasicMaterial({ color: 0x090d16, side: THREE.DoubleSide })
      );
      boreCap.rotation.x = -Math.PI / 2;
      boreCap.position.y = barrelLength + 0.005;
      barrelPivot.add(boreCap);

      cannonGroup.add(barrelPivot);

      // Angle elevation arc indicator beside cannon
      const arcPts: THREE.Vector3[] = [new THREE.Vector3(0, pivotY, 0.02)];
      const arcR = 1.35;
      for (let i = 0; i <= 18; i++) {
        const a = (i / 18) * rad;
        arcPts.push(new THREE.Vector3(arcR * Math.cos(a), pivotY + arcR * Math.sin(a), 0.02));
      }
      arcPts.push(new THREE.Vector3(0, pivotY, 0.02));
      const arcLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(arcPts),
        new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.75 })
      );
      cannonGroup.add(arcLine);

      group.add(cannonGroup);

      // Projectile Cannon Ball + instant velocity arrow
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 20, 20),
        new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xb45309,
          emissiveIntensity: 0.35,
          roughness: 0.22,
          metalness: 0.65
        })
      );
      group.add(ball);

      const velArrow = new THREE.ArrowHelper(
        new THREE.Vector3(Math.cos(rad), Math.sin(rad), 0),
        new THREE.Vector3(muzzleX, muzzleY, 0),
        1.4,
        0x10b981,
        0.26,
        0.14
      );
      group.add(velArrow);

      // Trajectory Path (Glowing Parabolic Tube starting strictly at muzzle tip)
      const pathPoints: THREE.Vector3[] = [];
      const numPts = 72;
      for (let i = 0; i <= numPts; i++) {
        const tCur = (i / numPts) * tImpact;
        const px = muzzleX + v0x * tCur * scale;
        const py = Math.max(0.02, muzzleY + (v0y * tCur - 0.5 * g * tCur * tCur) * scale);
        pathPoints.push(new THREE.Vector3(px, py, 0));
      }
      const pathCurve = new THREE.CatmullRomCurve3(pathPoints);
      const pathTube = new THREE.Mesh(
        new THREE.TubeGeometry(pathCurve, 80, 0.036, 10, false),
        new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.65,
          transparent: true,
          opacity: 0.72,
          roughness: 0.2,
          clearcoat: 0.8
        })
      );
      group.add(pathTube);

      // Target Bullseye Rings on the ground at exact impact point
      const targetDist = muzzleX + v0x * tImpact * scale;
      const ringGeo = new THREE.RingGeometry(0.36, 0.62, 32);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.6, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(targetDist, 0.02, 0);
      const innerBull = new THREE.Mesh(
        new THREE.CircleGeometry(0.22, 24),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.8, side: THREE.DoubleSide })
      );
      innerBull.rotation.x = Math.PI / 2;
      innerBull.position.set(targetDist, 0.024, 0);
      group.add(ring, innerBull);

      const velVec = new THREE.Vector3();
      const cosA = Math.cos(rad);
      const sinA = Math.sin(rad);
      group.add(
        createTroikaLabel({ text: `v₀ = ${safeV0} m/s · α = ${safeAngle}°`, position: [cannonBaseX, 2.35, 0], fontSize: 0.3, color: 0xfbbf24 }),
        createTroikaLabel({ text: 'Điểm rơi L', position: [targetDist, 0.72, 0], fontSize: 0.28, color: 0xf87171 })
      );

      let prevInFlight = false;
      let firedBurst = false;

      sceneTickRef.current = () => {
        const currentSimT = simStateRef.current.projT % (tImpact + 0.8);
        if (currentSimT <= tImpact) {
          if (!prevInFlight) {
            trailRef.current?.clear();
            firedBurst = false;
          }
          prevInFlight = true;
          const bx = muzzleX + v0x * currentSimT * scale;
          const by = Math.max(0.02, muzzleY + (v0y * currentSimT - 0.5 * g * currentSimT * currentSimT) * scale);
          ball.position.set(bx, by, 0);
          ball.visible = true;
          trailRef.current?.pushAndRender(bx, by, 0, cameraRef.current ?? undefined, 0.02, 32);

          if (!firedBurst && currentSimT > 0 && particlePoolRef.current) {
            firedBurst = true;
            for (let k = 0; k < 14; k++) {
              const sp = 1.4 + Math.random() * 2.0;
              particlePoolRef.current.spawn(
                muzzleX,
                muzzleY,
                0,
                cosA * sp + (Math.random() - 0.5) * 0.9,
                sinA * sp + (Math.random() - 0.5) * 0.9,
                (Math.random() - 0.5) * 1.1,
                0.55,
                0.85,
                k % 2 === 0 ? 0xfbbf24 : 0xf97316
              );
            }
          }

          const vyCur = v0y - g * currentSimT;
          velVec.set(v0x, vyCur, 0);
          const speedCur = velVec.length();
          if (speedCur > 0.01) {
            velArrow.position.set(bx, by, 0);
            velArrow.setDirection(velVec.normalize());
            velArrow.setLength(Math.min(2.2, Math.max(0.7, speedCur * 0.09)), 0.26, 0.13);
            velArrow.visible = true;
          }

          // Subtle physical barrel recoil right as shell exits muzzle
          const recoil = currentSimT < 0.16 ? Math.sin((currentSimT / 0.16) * Math.PI) * 0.18 : 0;
          barrelPivot.position.set(-recoil * cosA, pivotY - recoil * sinA, 0);
          ring.scale.setScalar(1);
        } else {
          if (prevInFlight && particlePoolRef.current) {
            prevInFlight = false;
            for (let k = 0; k < 16; k++) {
              const a = (k / 16) * Math.PI * 2;
              particlePoolRef.current.spawn(
                targetDist,
                0.08,
                0,
                Math.cos(a) * 1.6,
                1.2 + Math.random() * 1.8,
                Math.sin(a) * 1.6,
                0.65,
                0.95,
                k % 2 === 0 ? 0xef4444 : 0xfbbf24
              );
            }
          }
          ball.visible = false;
          velArrow.visible = false;
          barrelPivot.position.set(0, pivotY, 0);
          const pulse = 1 + 0.22 * Math.sin(((currentSimT - tImpact) / 0.8) * Math.PI);
          ring.scale.setScalar(pulse);
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

      // Cylindrical containment coil rings around Lorentz field region
      for (let cz = -3; cz <= 3; cz += 2) {
        const fieldRing = new THREE.Mesh(
          new THREE.TorusGeometry(3.8, 0.04, 10, 48),
          new THREE.MeshStandardMaterial({ color: 0x1d4ed8, emissive: 0x1e40af, emissiveIntensity: 0.35, transparent: true, opacity: 0.45 })
        );
        fieldRing.position.set(0, 3, cz);
        group.add(fieldRing);
      }

      // Charged Particle (Proton / Electron) with energy aura
      const partGeo = new THREE.SphereGeometry(0.22, 20, 20);
      const partMat = new THREE.MeshPhysicalMaterial({
        color: 0xef4444,
        emissive: 0xef4444,
        emissiveIntensity: 0.7,
        clearcoat: 0.9
      });
      const particle = new THREE.Mesh(partGeo, partMat);
      const partHalo = new THREE.Mesh(
        new THREE.SphereGeometry(0.36, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xfca5a5, transparent: true, opacity: 0.24 })
      );
      particle.add(partHalo);
      group.add(particle);

      // Trajectory Helix Path rendered as smooth glowing PBR tube
      const helixPoints: THREE.Vector3[] = [];
      const R_cyclotron = Math.min(4.5, Math.max(0.2, Math.abs(particleSpeed) / Math.max(0.2, Math.abs(magneticB))));
      const steps = 160;
      for (let i = 0; i <= steps; i++) {
        const phi = (i / 18) * Math.PI * 2;
        const px = Math.cos(phi) * R_cyclotron;
        const py = 3 + Math.sin(phi) * R_cyclotron;
        const pz = -3 + (i / steps) * 6;
        helixPoints.push(new THREE.Vector3(px, py, pz));
      }
      const helixCurve = new THREE.CatmullRomCurve3(helixPoints);
      const helixTubeGeo = new THREE.TubeGeometry(helixCurve, 180, 0.048, 12, false);
      const helixTubeMat = new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.55,
        roughness: 0.18,
        metalness: 0.4,
        clearcoat: 0.85
      });
      group.add(
        new THREE.Mesh(helixTubeGeo, helixTubeMat),
        createTroikaLabel({ text: `B⃗ = ${magneticB.toFixed(1)} T · R = mv/qB`, position: [0, 5.8, 0], fontSize: 0.32, color: 0x60a5fa }),
        createTroikaLabel({ text: 'Hạt điện tích q', position: [0, 0.7, 0], fontSize: 0.28, color: 0xfca5a5 })
      );

      let prevZ = -3;
      sceneTickRef.current = () => {
        const tCur = simStateRef.current.time * 2.5;
        const px = Math.cos(tCur) * R_cyclotron;
        const py = 3 + Math.sin(tCur) * R_cyclotron;
        const pz = -3 + ((tCur * 0.8) % 6);
        if (pz < prevZ) trailRef.current?.clear();
        prevZ = pz;
        particle.position.set(px, py, pz);
        trailRef.current?.pushAndRender(px, py, pz, cameraRef.current ?? undefined, 0.02, 30);
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
      const segments = 68;
      const planeGeo = new THREE.PlaneGeometry(planeW, planeH, segments, segments);
      planeGeo.rotateX(-Math.PI / 2);

      // Ripple tank frame perimeter rails
      const tankMat = new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.72, roughness: 0.25, clearcoat: 0.6 });
      const railH = new THREE.Mesh(new THREE.BoxGeometry(planeW + 0.4, 0.45, 0.22), tankMat);
      const railN = railH.clone();
      railN.position.set(0, 1.0, -planeH / 2 - 0.1);
      railH.position.set(0, 1.0, planeH / 2 + 0.1);
      const railW = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.45, planeH + 0.4), tankMat);
      const railE = railW.clone();
      railW.position.set(-planeW / 2 - 0.1, 1.0, 0);
      railE.position.set(planeW / 2 + 0.1, 1.0, 0);
      group.add(railN, railH, railW, railE);

      const posAttr = planeGeo.attributes.position as THREE.BufferAttribute;
      const vertCount = posAttr.count;
      const waveCols = new Float32Array(vertCount * 3);
      planeGeo.setAttribute('color', new THREE.BufferAttribute(waveCols, 3));

      const planeMat = new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.06,
        metalness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        side: THREE.DoubleSide,
      });
      const rippleMesh = new THREE.Mesh(planeGeo, planeMat);
      rippleMesh.position.y = 1.0;
      group.add(rippleMesh);

      // Two coherent point sources S1 and S2
      const s1Pos = new THREE.Vector3(-sourceDistance / 2, 1.25, 0);
      const s2Pos = new THREE.Vector3(sourceDistance / 2, 1.25, 0);

      const sGeo = new THREE.SphereGeometry(0.22, 18, 18);
      const sMat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.7, clearcoat: 0.9 });
      const s1Mesh = new THREE.Mesh(sGeo, sMat);
      s1Mesh.position.copy(s1Pos);
      const s2Mesh = new THREE.Mesh(sGeo, sMat);
      s2Mesh.position.copy(s2Pos);
      group.add(
        s1Mesh,
        s2Mesh,
        createTroikaLabel({ text: 'S₁', position: [s1Pos.x, 1.9, 0], fontSize: 0.32, color: 0xfbbf24 }),
        createTroikaLabel({ text: 'S₂', position: [s2Pos.x, 1.9, 0], fontSize: 0.32, color: 0xfbbf24 })
      );

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
      const colAttr = planeGeo.attributes.color as THREE.BufferAttribute;

      sceneTickRef.current = () => {
        const tNow = simStateRef.current.time;
        const phaseShift = Math.max(0.2, waveFrequency) * Math.PI * 2 * tNow;
        const k = 1.8;

        for (let i = 0; i < vertCount; i++) {
          const yVal =
            invSqrtD1[i] * Math.sin(k * d1Arr[i] - phaseShift) +
            invSqrtD2[i] * Math.sin(k * d2Arr[i] - phaseShift);
          posAttr.setY(i, yVal);
          const norm = Math.max(0, Math.min(1, 0.5 + yVal * 1.4));
          colAttr.setXYZ(i, 0.03 + norm * 0.22, 0.28 + norm * 0.62, 0.55 + norm * 0.45);
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
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
      // Nucleus (Fibonacci sphere packed Protons + Neutrons cluster)
      const nucleusGroup = new THREE.Group();
      const nucColors = [0xef4444, 0x3b82f6]; // Red proton, Blue neutron
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const nucleonCount = 16;
      for (let i = 0; i < nucleonCount; i++) {
        const yOff = 1 - (i / (nucleonCount - 1)) * 2;
        const rSlice = Math.sqrt(Math.max(0, 1 - yOff * yOff));
        const theta = goldenAngle * i;
        const packR = i === 0 ? 0 : 0.28;
        const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const sphereMat = new THREE.MeshPhysicalMaterial({
          color: nucColors[i % 2],
          roughness: 0.22,
          metalness: 0.35,
          clearcoat: 0.7
        });
        const nucSphere = new THREE.Mesh(sphereGeo, sphereMat);
        nucSphere.position.set(
          Math.cos(theta) * rSlice * packR,
          2.5 + yOff * packR,
          Math.sin(theta) * rSlice * packR
        );
        nucleusGroup.add(nucSphere);
      }
      const nucGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.68, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.16, depthWrite: false })
      );
      nucGlow.position.y = 2.5;
      group.add(nucGlow);
      group.add(nucleusGroup);

      // Quantized energy level rings (K, L, M, N: n=1, 2, 3, 4) rendered as 3D Torus rings
      const orbitRadii = [1.2, 2.2, 3.4, 4.8];
      orbitRadii.forEach((r, idx) => {
        const isActive = idx + 1 === quantumN;
        const ringGeo = new THREE.TorusGeometry(r, isActive ? 0.032 : 0.016, 12, 72);
        const ringMat = new THREE.MeshStandardMaterial({
          color: isActive ? 0xf59e0b : 0x475569,
          emissive: isActive ? 0xd97706 : 0x000000,
          emissiveIntensity: isActive ? 0.65 : 0,
          transparent: true,
          opacity: isActive ? 0.95 : 0.38,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = 2.5;
        group.add(ringMesh);
      });

      // Electron particle with subtle halo
      const electronGeo = new THREE.SphereGeometry(0.16, 20, 20);
      const electronMat = new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.95,
      });
      const electron = new THREE.Mesh(electronGeo, electronMat);
      const haloMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25 })
      );
      electron.add(haloMesh);
      group.add(electron);

      const safeN = Math.max(1, Math.min(4, quantumN));
      const currentOrbitR = orbitRadii[safeN - 1];
      const shellNames = ['K', 'L', 'M', 'N'];
      group.add(
        createTroikaLabel({ text: `Mức lượng tử n=${safeN} (${shellNames[safeN - 1]})`, position: [0, 4.35, 0], fontSize: 0.34, color: 0xfbbf24 }),
        createTroikaLabel({ text: 'e⁻', position: [currentOrbitR, 3.05, 0], fontSize: 0.28, color: 0x38bdf8 })
      );
      if (particlePoolRef.current) {
        for (let k = 0; k < 14; k++) {
          const a = (k / 14) * Math.PI * 2;
          particlePoolRef.current.spawn(Math.cos(a) * currentOrbitR, 2.5, Math.sin(a) * currentOrbitR, Math.cos(a) * 0.9, (Math.random() - 0.5) * 1.1, Math.sin(a) * 0.9, 0.65, 0.9, 0x38bdf8);
        }
      }

      sceneTickRef.current = () => {
        const angle = simStateRef.current.electronAngle * (2.0 / Math.sqrt(safeN));
        const ex = Math.cos(angle) * currentOrbitR;
        const ez = Math.sin(angle) * currentOrbitR;
        electron.position.set(ex, 2.5, ez);
        nucleusGroup.rotation.y = simStateRef.current.time * 0.4;
        trailRef.current?.pushAndRender(ex, 2.5, ez, cameraRef.current ?? undefined, 0.02, 30);
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
      const isSw = isSoftwareGlRef.current;

      // Optical Bench Rail + Pedestal Stand under lens
      const benchMat = new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.78, roughness: 0.28, clearcoat: 0.5 });
      const benchRail = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.18, 0.9), benchMat);
      benchRail.position.set(0, 0.09, 0);
      benchRail.receiveShadow = !isSw;
      const lensStand = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 0.2, 16), benchMat);
      lensStand.position.set(0, 0.1, 0);
      group.add(benchRail, lensStand);

      // Optical axis along X
      const axisGeo = new THREE.CylinderGeometry(0.025, 0.025, 13, 12);
      axisGeo.rotateZ(Math.PI / 2);
      const axisMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.5 });
      const axis = new THREE.Mesh(axisGeo, axisMat);
      axis.position.y = 2.0;
      group.add(axis);

      // Optical Glass 3D Lens at X = 0, Y = 2.0 with metallic rim collar
      const lensGeo = isDiverging3D
        ? new THREE.CylinderGeometry(2.1, 2.1, 0.24, 36)
        : new THREE.SphereGeometry(2.2, 44, 30);
      if (isDiverging3D) {
        lensGeo.rotateZ(Math.PI / 2);
      } else {
        lensGeo.scale(0.18, 1.0, 1.0);
      }
      const lensMat = new THREE.MeshPhysicalMaterial({
        color: isDiverging3D ? 0xc084fc : 0x38bdf8,
        roughness: 0.05,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        transparent: true,
        opacity: isSw ? 0.42 : 0.86,
        transmission: isSw ? 0 : 0.78,
        ior: 1.54,
        thickness: 0.5,
        depthWrite: false,
      });
      const lensMesh = new THREE.Mesh(lensGeo, lensMat);
      lensMesh.position.set(0, 2.0, 0);
      group.add(lensMesh);

      const lensRim = new THREE.Mesh(
        new THREE.TorusGeometry(2.15, 0.05, 14, 56),
        new THREE.MeshPhysicalMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.16, clearcoat: 0.8 })
      );
      lensRim.rotation.y = Math.PI / 2;
      lensRim.position.set(0, 2.0, 0);
      group.add(lensRim);

      // Focal markers F and F'
      const fGeo = new THREE.SphereGeometry(0.13, 18, 18);
      const fMat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.6, clearcoat: 0.8 });
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

      // Principal light rays rendered as crisp glowing beams
      const B = new THREE.Vector3(-safeD, 2.0 + objH, 0);
      const L_top = new THREE.Vector3(0, 2.0 + objH, 0);
      const B_prime = new THREE.Vector3(clampedDPrime, 2.0 + imgH, 0);
      const O = new THREE.Vector3(0, 2.0, 0);

      const beamMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.75
      });
      const addRaySegment = (p1: THREE.Vector3, p2: THREE.Vector3) => {
        if (p1.distanceTo(p2) < 0.02) return;
        const c = new THREE.LineCurve3(p1, p2);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(c, 4, 0.028, 8, false), beamMat));
      };
      const ray1Out = isDiverging3D
        ? new THREE.Vector3(5.5, 2.0 + objH + (objH / safeFMag) * 5.5, 0)
        : dPrime > 0
        ? B_prime
        : new THREE.Vector3(5.5, 2.0 + objH - (objH / safeFMag) * 5.5, 0);

      addRaySegment(B, L_top);
      addRaySegment(L_top, ray1Out);
      addRaySegment(B, O);
      addRaySegment(O, dPrime > 0 ? B_prime : new THREE.Vector3(5.5, 2.0 - (objH / safeD) * 5.5, 0));

      if (dPrime < 0) {
        const vMat = new THREE.LineDashedMaterial({ color: 0xc084fc, dashSize: 0.15, gapSize: 0.1 });
        const v1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([L_top, B_prime]), vMat);
        v1.computeLineDistances();
        const v2 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([O, B_prime]), vMat);
        v2.computeLineDistances();
        group.add(v1, v2);
      }

      group.add(
        createTroikaLabel({ text: 'Vật AB', position: [-safeD, 3.8, 0], fontSize: 0.3, color: 0x34d399 }),
        createTroikaLabel({ text: 'F', position: [-fSigned, 1.55, 0], fontSize: 0.3, color: 0xfbbf24 }),
        createTroikaLabel({ text: "F'", position: [fSigned, 1.55, 0], fontSize: 0.3, color: 0xfbbf24 }),
        createTroikaLabel({ text: dPrime > 0 ? "Ảnh thật A'B'" : "Ảnh ảo A'B'", position: [clampedDPrime, 2.0 + imgH + (imgH >= 0 ? 0.55 : -0.55), 0], fontSize: 0.3, color: dPrime > 0 ? 0xf87171 : 0xc084fc }),
        createCrispLine2([[-6.4, 2.0, 0], [6.4, 2.0, 0]], { color: 0x94a3b8, linewidth: 2.2 })
      );
    }

    // -------------------------------------------------------------
    // SCENE 7: ĐỘNG HỌC & VECTƠ HỢP LỰC 3D
    // -------------------------------------------------------------
    else if (mode === 'kinematics_3d') {
      const isSw = isSoftwareGlRef.current;
      // Road Track with centerline sleepers
      const trackGeo = new THREE.BoxGeometry(12, 0.25, 2.2);
      const trackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65, metalness: 0.2 });
      const track = new THREE.Mesh(trackGeo, trackMat);
      track.position.set(0, 0.125, 0);
      track.receiveShadow = !isSw;
      group.add(track);

      const stripeMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xd97706, emissiveIntensity: 0.2 });
      for (let sx = -5; sx <= 5; sx += 1.25) {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.02, 0.14), stripeMat);
        stripe.position.set(sx, 0.255, 0);
        group.add(stripe);
      }

      // Composite Multi-Part Lab Cart (Chassis + Cabin + 4 Wheels)
      const carGroup = new THREE.Group();
      carGroup.position.set(-4.8, 0.25, 0);
      const chassis = new THREE.Mesh(
        new THREE.BoxGeometry(1.25, 0.34, 0.82),
        new THREE.MeshPhysicalMaterial({ color: 0x3b82f6, metalness: 0.55, roughness: 0.18, clearcoat: 1.0 })
      );
      chassis.position.y = 0.3;
      chassis.castShadow = !isSw;
      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.26, 0.68),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, metalness: 0.25, roughness: 0.12, clearcoat: 1.0, transparent: true, opacity: 0.85 })
      );
      cabin.position.set(-0.08, 0.58, 0);
      const wheelGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 18);
      wheelGeo.rotateX(Math.PI / 2);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 });
      const wheelPositions: [number, number][] = [[-0.4, 0.42], [0.4, 0.42], [-0.4, -0.42], [0.4, -0.42]];
      wheelPositions.forEach(([wx, wz]) => {
        const wMesh = new THREE.Mesh(wheelGeo, wheelMat);
        wMesh.position.set(wx, 0.16, wz);
        carGroup.add(wMesh);
      });
      carGroup.add(chassis, cabin);
      group.add(carGroup);

      // Velocity Vector Arrow attached to car (green)
      const vArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-4.8, 1.15, 0), 1.4, 0x10b981, 0.3, 0.16);
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

      const pMat = new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.15, gapSize: 0.1 });
      const pLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          originVec.clone().add(f1Vec),
          originVec.clone().add(fSumVec),
          originVec.clone().add(f2Vec),
        ]),
        pMat
      );
      group.add(
        createCrispLine2(
          [originVec.clone().add(f1Vec), originVec.clone().add(fSumVec), originVec.clone().add(f2Vec)],
          { color: 0x94a3b8, linewidth: 2.2, dashed: true }
        ),
        createTroikaLabel({ text: 'F⃗₁', position: [originVec.x + f1Vec.x * 0.6, originVec.y - 0.38, 0], fontSize: 0.3, color: 0x38bdf8 }),
        createTroikaLabel({ text: 'F⃗₂', position: [originVec.x + f2Vec.x * 0.55 - 0.38, originVec.y + f2Vec.y * 0.65, 0], fontSize: 0.3, color: 0xfbbf24 }),
        createTroikaLabel({ text: 'F⃗ hợp lực', position: [originVec.x + fSumVec.x + 0.65, originVec.y + fSumVec.y, 0], fontSize: 0.32, color: 0xf87171 })
      );

      sceneTickRef.current = () => {
        const cycleT = simStateRef.current.time % 3.6;
        const rawX = -4.8 + kinV0 * cycleT * 0.45 + 0.5 * kinAccel * cycleT * cycleT * 0.45;
        const clampedX = Math.max(-5.2, Math.min(5.0, rawX));
        const curV = kinV0 + kinAccel * cycleT;
        carGroup.position.x = clampedX;
        vArrow.position.set(clampedX, 1.15, 0);
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

      // Translucent Glass Chamber + Heater Base Plate + Piston Rod
      const chamberGeo = new THREE.BoxGeometry(boxW, boxH, boxD);
      const chamberGlass = new THREE.Mesh(
        chamberGeo,
        new THREE.MeshPhysicalMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.14,
          roughness: 0.08,
          clearcoat: 1.0,
          depthWrite: false,
          side: THREE.DoubleSide,
          clippingPlanes: clipPlanes,
        })
      );
      chamberGlass.position.y = boxH / 2 + 0.1;
      group.add(chamberGlass);

      const chamberEdges = new THREE.EdgesGeometry(chamberGeo);
      const chamberLine = new THREE.LineSegments(
        chamberEdges,
        new THREE.LineBasicMaterial({ color: 0x38bdf8 })
      );
      chamberLine.position.y = boxH / 2 + 0.1;
      group.add(chamberLine);

      const heaterBase = new THREE.Mesh(
        new THREE.BoxGeometry(boxW + 0.3, 0.2, boxD + 0.3),
        new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          emissive: gasTempK > 450 ? 0xef4444 : gasTempK > 330 ? 0xd97706 : 0x0284c7,
          emissiveIntensity: 0.35,
          metalness: 0.5,
          roughness: 0.4
        })
      );
      heaterBase.position.y = 0.06;
      group.add(heaterBase);

      // Movable Top Piston + Chrome Shaft
      const pistonGeo = new THREE.BoxGeometry(boxW - 0.1, 0.22, boxD - 0.1);
      const pistonMat = new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        metalness: 0.72,
        roughness: 0.18,
        clearcoat: 0.85,
        transparent: true,
        opacity: 0.9,
        clippingPlanes: clipPlanes,
      });
      const piston = new THREE.Mesh(pistonGeo, pistonMat);
      piston.position.y = boxH + 0.1;
      const pistonStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 1.4, 14),
        new THREE.MeshPhysicalMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.15, clearcoat: 0.8 })
      );
      pistonStem.position.y = 0.78;
      piston.add(pistonStem);
      group.add(
        piston,
        createTroikaLabel({ text: `pV = nRT (${gasTempK}K)`, position: [0, boxH + 1.85, 0], fontSize: 0.32, color: 0xfbbf24 })
      );

      // 24 Gas Particles bouncing inside
      const numParticles = 24;
      const safeTemp = Math.max(10, gasTempK);
      const speedScale = Math.sqrt(safeTemp / 300) * 0.085;
      const pColor = safeTemp > 450 ? 0xef4444 : safeTemp > 330 ? 0xf59e0b : 0x38bdf8;
      const partGeo = new THREE.SphereGeometry(0.14, 14, 14);
      const partMat = new THREE.MeshStandardMaterial({
        color: pColor,
        emissive: pColor,
        emissiveIntensity: 0.45,
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
      const isSw = isSoftwareGlRef.current;

      // Grounded Turntable Base + Central Pivot Post
      const tableBase = new THREE.Mesh(
        new THREE.CylinderGeometry(r + 0.45, r + 0.65, 0.14, 48),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.55, metalness: 0.35 })
      );
      tableBase.position.y = 0.07;
      tableBase.receiveShadow = !isSw;
      group.add(tableBase);

      const pivot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.18, yLevel, 18),
        new THREE.MeshPhysicalMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.2, clearcoat: 0.7 })
      );
      pivot.position.y = yLevel / 2;
      group.add(pivot);

      const omegaArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, yLevel + 0.1, 0), 1.8, 0xf59e0b, 0.3, 0.16);
      group.add(omegaArrow);

      // Orbit ring
      const ringGeo = new THREE.TorusGeometry(r, 0.038, 12, 64);
      ringGeo.rotateX(Math.PI / 2);
      const ring = new THREE.Mesh(
        ringGeo,
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.45, transparent: true, opacity: 0.72 })
      );
      ring.position.y = yLevel;
      group.add(ring);

      // Orbiting sphere + cylindrical connecting rod (rotated dynamically)
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 28, 24),
        new THREE.MeshPhysicalMaterial({ color: 0x3b82f6, metalness: 0.65, roughness: 0.15, clearcoat: 1.0 })
      );
      ball.castShadow = !isSw;
      group.add(ball);

      const rodGeo = new THREE.CylinderGeometry(0.032, 0.032, r, 12);
      rodGeo.rotateZ(-Math.PI / 2);
      rodGeo.translate(r / 2, 0, 0);
      const rodMesh = new THREE.Mesh(
        rodGeo,
        new THREE.MeshPhysicalMaterial({ color: 0xcbd5e1, metalness: 0.85, roughness: 0.18 })
      );
      rodMesh.position.y = yLevel;
      group.add(rodMesh);

      const vArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(r, yLevel, 0), 1.8, 0x10b981, 0.3, 0.16);
      const fArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(r, yLevel, 0), 1.5, 0xef4444, 0.3, 0.16);
      group.add(
        vArrow,
        fArrow,
        createTroikaLabel({ text: `ω = ${circOmega3D} rad/s`, position: [0, yLevel + 2.35, 0], fontSize: 0.32, color: 0xfbbf24 }),
        createTroikaLabel({ text: 'v⃗ (tiếp tuyến) · F⃗_ht', position: [0, yLevel + 0.6, r + 0.5], fontSize: 0.28, color: 0x34d399 })
      );

      const vDir = new THREE.Vector3();
      const fDir = new THREE.Vector3();
      sceneTickRef.current = () => {
        const theta = simStateRef.current.time * Math.max(0.2, circOmega3D);
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const bx = cosT * r;
        const bz = -sinT * r;
        ball.position.set(bx, yLevel, bz);
        rodMesh.rotation.y = theta;
        trailRef.current?.pushAndRender(bx, yLevel, bz, cameraRef.current ?? undefined, 0.02, 30);

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
      const isSw = isSoftwareGlRef.current;
      // N Pole (Red, left), S Pole (Blue, right) & Base Magnetic Yoke Plate
      const yoke = new THREE.Mesh(
        new THREE.BoxGeometry(8.8, 0.35, 3.4),
        new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.72, roughness: 0.28 })
      );
      yoke.position.set(0, 0.18, 0);
      yoke.receiveShadow = !isSw;
      group.add(yoke);

      const nPole = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 3.2, 3.2),
        new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.22, metalness: 0.38, clearcoat: 0.75 })
      );
      nPole.position.set(-3.6, 2.0, 0);
      nPole.castShadow = !isSw;
      const sPole = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 3.2, 3.2),
        new THREE.MeshPhysicalMaterial({ color: 0x3b82f6, roughness: 0.22, metalness: 0.38, clearcoat: 0.75 })
      );
      sPole.position.set(3.6, 2.0, 0);
      sPole.castShadow = !isSw;
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
      const coilGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wirePts, false, 'catmullrom', 0.05), 48, 0.075, 12, false);
      const coilMesh = new THREE.Mesh(
        coilGeo,
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.88, roughness: 0.16, clearcoat: 0.85, anisotropy: 0.5 })
      );
      coilMesh.castShadow = !isSw;
      coilGroup.add(coilMesh);

      const normalArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1.6, 0x10b981, 0.28, 0.15);
      coilGroup.add(normalArrow);
      group.add(coilGroup);

      // Slip rings + steel axle
      const axle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.065, 4.8, 16),
        new THREE.MeshPhysicalMaterial({ color: 0xcbd5e1, metalness: 0.92, roughness: 0.14 })
      );
      axle.rotation.x = Math.PI / 2;
      axle.position.set(0, 2.2, 0);
      group.add(axle);

      const ringCopperMat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15, clearcoat: 0.8 });
      [1.85, 2.15].forEach((rz) => {
        const slipRing = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.045, 12, 28), ringCopperMat);
        slipRing.position.set(0, 2.2, rz);
        group.add(slipRing);
      });

      group.add(
        createTroikaLabel({ text: 'N', position: [-3.6, 3.9, 0], fontSize: 0.38, color: 0xf87171 }),
        createTroikaLabel({ text: 'S', position: [3.6, 3.9, 0], fontSize: 0.38, color: 0x60a5fa }),
        createTroikaLabel({ text: 'e = E₀ sin(ωt)', position: [0, 4.1, 0], fontSize: 0.32, color: 0x34d399 })
      );

      let brushCooldown = 0;
      sceneTickRef.current = (effDt: number) => {
        coilGroup.rotation.z = simStateRef.current.time * Math.max(0.2, genOmega3D);
        brushCooldown -= effDt;
        if (particlePoolRef.current && brushCooldown <= 0) {
          brushCooldown = 0.22;
          particlePoolRef.current.spawn(0.22, 2.2, 2.0, 0.4 + Math.random() * 0.6, 0.5 + Math.random() * 0.6, (Math.random() - 0.5) * 0.5, 0.4, 0.65, 0xfbbf24);
        }
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

      // Optical Bench Base Rail
      const optRail = new THREE.Mesh(
        new THREE.BoxGeometry(8.2, 0.16, 5.6),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.65, metalness: 0.3 })
      );
      optRail.position.set(0.3, 0.08, 0);
      group.add(optRail);

      // Barrier with two glowing slits S1 and S2 at X = -3.2
      const barrier = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 3.6, 5.2),
        new THREE.MeshPhysicalMaterial({ color: 0x334155, roughness: 0.42, metalness: 0.35, clearcoat: 0.5 })
      );
      barrier.position.set(-3.2, 2.0, 0);
      group.add(barrier);

      [-slitGap / 2, slitGap / 2].forEach((zSlit) => {
        const slitGlow = new THREE.Mesh(
          new THREE.BoxGeometry(0.24, 1.8, 0.15),
          new THREE.MeshStandardMaterial({ color: hexColor, emissive: hexColor, emissiveIntensity: 0.95 })
        );
        slitGlow.position.set(-3.2, 2.0, zSlit);
        group.add(slitGlow);

        for (let targetZ = -2.2; targetZ <= 2.2; targetZ += 1.1) {
          const rayCurve = new THREE.LineCurve3(
            new THREE.Vector3(-3.1, 2.0, zSlit),
            new THREE.Vector3(3.8, 2.0, targetZ)
          );
          const rayTube = new THREE.Mesh(
            new THREE.TubeGeometry(rayCurve, 4, 0.018, 6, false),
            new THREE.MeshBasicMaterial({ color: hexColor, transparent: true, opacity: 0.42 })
          );
          group.add(rayTube);
        }
      });

      // Procedural interference fringe texture on observation screen at X = 3.8
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 512;
      texCanvas.height = 128;
      const tCtx = texCanvas.getContext('2d');
      if (tCtx) {
        tCtx.fillStyle = '#050814';
        tCtx.fillRect(0, 0, 512, 128);
        const fringePeriodPx = (youngLambdaUm * 92) / Math.max(0.25, youngSlitMm);
        for (let px = 0; px < 512; px++) {
          const xRel = px - 256;
          const intensity = Math.pow(Math.cos((Math.PI * xRel) / fringePeriodPx), 2);
          tCtx.fillStyle = `rgba(${cssColor.r}, ${cssColor.g}, ${cssColor.b}, ${Math.max(0.05, intensity)})`;
          tCtx.fillRect(px, 0, 1, 128);
        }
      }
      const screenTex = new THREE.CanvasTexture(texCanvas);
      screenTex.colorSpace = THREE.SRGBColorSpace;
      screenTex.anisotropy = 8;
      const screenMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3.6, 5.4),
        new THREE.MeshStandardMaterial({ map: screenTex, emissiveMap: screenTex, emissive: 0xffffff, emissiveIntensity: 0.55, roughness: 0.35 })
      );
      screenMesh.position.set(3.8, 2.0, 0);
      group.add(
        screenMesh,
        createTroikaLabel({ text: `Khe kép S₁, S₂ (a=${youngSlitMm}mm)`, position: [-3.2, 4.25, 0], fontSize: 0.3, color: 0x38bdf8 }),
        createTroikaLabel({ text: `Vân giao thoa (λ=${nm}nm)`, position: [3.8, 4.25, 0], fontSize: 0.3, color: 0xfbbf24 })
      );
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

      const isSw = isSoftwareGlRef.current;
      // Grounded optical/wave bench baseplate + Support posts with brass clamp collars
      const benchMat = new THREE.MeshPhysicalMaterial({ color: 0x1e293b, metalness: 0.65, roughness: 0.35, clearcoat: 0.4 });
      const benchBase = new THREE.Mesh(new THREE.BoxGeometry(span + 1.4, 0.24, 1.4), benchMat);
      benchBase.position.set(0, 0.12, 0);
      benchBase.receiveShadow = !isSw;
      group.add(benchBase);

      const postMat = new THREE.MeshPhysicalMaterial({ color: 0x64748b, metalness: 0.78, roughness: 0.22, clearcoat: 0.6 });
      const clampMat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.82, roughness: 0.18, clearcoat: 0.8 });
      [-halfSpan, halfSpan].forEach((px) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, yBase + 1.2, 20), postMat);
        post.position.set(px, (yBase + 1.2) / 2, 0);
        post.castShadow = !isSw;
        const clamp = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.24, 20), clampMat);
        clamp.position.set(px, yBase, 0);
        group.add(post, clamp);
      });

      // Equilibrium centerline rod
      const eqRod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, span, 10),
        new THREE.MeshStandardMaterial({ color: 0x475569, transparent: true, opacity: 0.65 })
      );
      eqRod.rotation.z = Math.PI / 2;
      eqRod.position.set(0, yBase, 0);
      group.add(eqRod);

      // Red node spheres with clearcoat
      for (let i = 0; i <= harmonics; i++) {
        const nx = -halfSpan + (i / harmonics) * span;
        const nodeOrb = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 20, 20),
          new THREE.MeshPhysicalMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.42, clearcoat: 0.85, roughness: 0.18 })
        );
        nodeOrb.position.set(nx, yBase, 0);
        group.add(nodeOrb);
      }

      // Segmented vibrating beads + connecting polyline
      const segs = 64;
      const beads: THREE.Mesh[] = [];
      const beadGeo = new THREE.SphereGeometry(0.09, 14, 14);
      const beadMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.55, clearcoat: 0.85, roughness: 0.15 });
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
      group.add(
        stringLine,
        createTroikaLabel({ text: `Sóng dừng k = ${harmonics} bụng · ${harmonics + 1} nút`, position: [0, 4.2, 0], fontSize: 0.32, color: 0x38bdf8 })
      );

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

      const isSw = isSoftwareGlRef.current;
      // Ground track lane along X
      const trackLane = new THREE.Mesh(
        new THREE.BoxGeometry(10.2, 0.08, 0.9),
        new THREE.MeshPhysicalMaterial({ color: 0x1e293b, roughness: 0.55, metalness: 0.35 })
      );
      trackLane.position.set(0, 0.04, 0);
      trackLane.receiveShadow = !isSw;
      group.add(trackLane);

      // Ground observer acoustic receiver stand & dish at +X
      const obsBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.42, 0.16, 20),
        new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.72, roughness: 0.28 })
      );
      obsBase.position.set(4.5, 0.08, 0);
      const obs = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 1.5, 18),
        new THREE.MeshPhysicalMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.35, clearcoat: 0.7, roughness: 0.25 })
      );
      obs.position.set(4.5, 0.82, 0);
      obs.castShadow = !isSw;
      const dish = new THREE.Mesh(
        new THREE.ConeGeometry(0.38, 0.45, 24, 1, true),
        new THREE.MeshPhysicalMaterial({ color: 0x34d399, metalness: 0.65, roughness: 0.22, clearcoat: 0.8, side: THREE.DoubleSide })
      );
      dish.rotation.z = -Math.PI / 2;
      dish.position.set(4.28, 1.6, 0);
      group.add(obsBase, obs, dish);

      // Moving emitter sphere + energy halo
      const sourceOrb = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 28, 28),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.68, clearcoat: 0.95, roughness: 0.15 })
      );
      sourceOrb.castShadow = !isSw;
      const sourceHalo = new THREE.Mesh(
        new THREE.SphereGeometry(0.52, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.2, depthWrite: false })
      );
      sourceOrb.add(sourceHalo);
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
      group.add(
        createTroikaLabel({ text: `Nguồn phát (v/c = ${ratio.toFixed(2)})`, position: [0, 3.6, 0], fontSize: 0.3, color: 0xfbbf24 }),
        createTroikaLabel({ text: "Máy thu f'", position: [4.5, 2.55, 0], fontSize: 0.3, color: 0x34d399 })
      );

      let shockCooldown = 0;
      sceneTickRef.current = (effDt: number) => {
        const tCycle = simStateRef.current.time % cycleLen;
        const srcX = ratio < 0.01 ? 0 : -4.2 + srcV * tCycle;
        const curSrcX = Math.min(4.8, srcX);
        sourceOrb.position.set(curSrcX, yWave, 0);

        shockCooldown -= effDt;
        if (particlePoolRef.current && ratio >= 1.0 && shockCooldown <= 0) {
          shockCooldown = 0.14;
          particlePoolRef.current.spawn(curSrcX, yWave, 0, -1.2, (Math.random() - 0.5) * 1.4, (Math.random() - 0.5) * 1.4, 0.45, 0.75, 0x38bdf8);
        }

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

      // Quartz Vacuum Envelope Tube + Brass End Caps & Pedestals
      const isSw = isSoftwareGlRef.current;
      const glassTube = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 7.0, 36, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: 0xbae6fd,
          transparent: true,
          opacity: isSw ? 0.22 : 0.42,
          roughness: 0.06,
          clearcoat: 1.0,
          ior: 1.48,
          depthWrite: false,
          side: THREE.DoubleSide,
          clippingPlanes: clipPlanes,
        })
      );
      glassTube.rotation.z = Math.PI / 2;
      glassTube.position.set(0, 2.1, 0);
      group.add(
        glassTube,
        createTroikaLabel({ text: 'Catôt K', position: [-2.9, 3.85, 0], fontSize: 0.3, color: 0x38bdf8 }),
        createTroikaLabel({ text: 'Anôt A', position: [2.9, 3.85, 0], fontSize: 0.3, color: 0xfbbf24 }),
        createTroikaLabel({ text: canEmit ? `hν (${photonEv.toFixed(2)}eV) ≥ A` : `hν (${photonEv.toFixed(2)}eV) < A`, position: [0, 4.65, 0], fontSize: 0.3, color: canEmit ? 0x34d399 : 0xf87171 })
      );

      const brassStandMat = new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.24, clearcoat: 0.6 });
      [-3.5, 3.5].forEach((ex) => {
        const endCollar = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.065, 14, 40), brassStandMat);
        endCollar.rotation.y = Math.PI / 2;
        endCollar.position.set(ex, 2.1, 0);
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 0.5), brassStandMat);
        leg.position.set(ex, 0.35, 0);
        group.add(endCollar, leg);
      });

      // Cathode (Blue left disc) & Anode (Amber right disc)
      const cathode = new THREE.Mesh(
        new THREE.CylinderGeometry(1.25, 1.25, 0.22, 28),
        new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, emissive: 0x0284c7, emissiveIntensity: 0.25, metalness: 0.78, roughness: 0.18, clearcoat: 0.85 })
      );
      cathode.rotation.z = Math.PI / 2;
      cathode.position.set(-2.9, 2.1, 0);
      group.add(cathode);

      const anode = new THREE.Mesh(
        new THREE.CylinderGeometry(1.25, 1.25, 0.22, 28),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.25, metalness: 0.78, roughness: 0.18, clearcoat: 0.85 })
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
      let emitSparkCooldown = 0;
      sceneTickRef.current = (effDt: number) => {
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
          emitSparkCooldown -= effDt;
          if (particlePoolRef.current && emitSparkCooldown <= 0) {
            emitSparkCooldown = 0.25;
            particlePoolRef.current.spawn(-2.75, 2.1 + (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, 2.0 * keScale, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, 0.5, 0.7, 0x38bdf8);
          }
        }
      };
      sceneTickRef.current(0);

      return () => {
        sceneTickRef.current = null;
      };
    }

    // -------------------------------------------------------------
    // SCENES 15..48: +34 EXTRA 3D PHYSICS SIMULATIONS
    // -------------------------------------------------------------
    const extraCtx: Extra3DSceneContext = {
      particlePool: particlePoolRef.current,
      trail: trailRef.current,
      cutawayPlanes: clipPlanes,
      camera: cameraRef.current,
    };
    const extraTick = buildExtra3DScene(
      mode,
      group,
      () => extraParamsRef.current,
      () => simStateRef.current.time,
      extraCtx
    );
    if (mountRef.current) {
      syncLine2Resolution(group, mountRef.current.clientWidth || 760, mountRef.current.clientHeight || 420);
    }
    if (extraTick) {
      sceneTickRef.current = extraTick;
      extraTick(0);
      return () => {
        sceneTickRef.current = null;
      };
    }
    if (mountRef.current) {
      syncLine2Resolution(group, mountRef.current.clientWidth || 760, mountRef.current.clientHeight || 420);
    }
  }, [
    mode,
    showCutaway3D,
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

  const active3DProbeParams = {
    mass,
    springK,
    projAngle,
    projV0,
    magneticB: extraParams.p1 ?? magneticB,
    fieldB: genFieldB3D,
    freq: mode === 'wave_ripple' ? waveFrequency : mode === 'doppler_effect_3d' ? dopplerFreq : extraParams.p1 ?? 2.5,
    tempK: mode === 'thermal_gas_3d' ? gasTempK : extraParams.p1 ?? 320,
    volume: gasVolumeFactor * 10,
    wavelengthNm: mode === 'photoelectric_3d' ? photoLambdaNm : youngLambdaUm * 1000,
    polarizerAngle: extraParams.p1 ?? 35,
    voltage: extraParams.p2 ?? 12,
    currentI: extraParams.p1 ?? 4,
    p1: extraParams.p1,
    p2: extraParams.p2
  };

  return (
    <ViewportPortal active={isFullscreen}>
      <div
        className={
          isFullscreen
            ? 'sim-physics-scope fixed inset-0 z-[100] h-[100dvh] w-screen bg-slate-950 p-2 sm:p-3 flex flex-col gap-2 overflow-y-auto'
            : 'sim-physics-scope space-y-2'
        }
      >
        <PhysicsApparatusWorkbench
          dimension="3d"
          simId={mode}
          domainId={getDomainFor3DSim(mode)}
          simParams={active3DProbeParams}
          simTime={simStateRef.current.time}
          stageClassName={isFullscreen ? 'flex-1 min-h-0 flex flex-col' : ''}
        >
          <div
            className={`relative w-full overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 shadow-2xl transition-all flex flex-col lg:block ${
              isFullscreen
                ? 'flex-1 min-h-[420px] rounded-[4px]'
                : 'rounded-[4px] min-h-[560px] lg:min-h-0 lg:h-[640px]'
            }`}
          >
        {/* TOP HEADER OVERLAY (No backdrop-blur over WebGL; stacked on < lg, floating on lg+) */}
        <div className="relative z-20 p-2.5 sm:p-3 lg:p-0 lg:absolute lg:top-4 lg:left-4 lg:right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/95 lg:bg-transparent border-b border-slate-800/80 lg:border-b-0 lg:pointer-events-none shrink-0">
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-slate-900/95 border border-slate-700/80 text-white shadow-lg max-w-full">
            {(isFullscreen || onBack) && (
              <button
                onClick={() => {
                  if (isFullscreen) {
                    setIsFullscreen(false);
                  } else if (onBack) {
                    onBack();
                  }
                }}
                className="sim-btn-phy flex items-center gap-1 px-2.5 py-1 rounded-[3px] border border-amber-400/60 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white shrink-0 cursor-pointer"
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

          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 max-w-full overflow-x-auto lg:overflow-visible scrollbar-none pb-0.5 lg:pb-0">
            {/* Domain-scoped Mode Switcher Buttons */}
            <div className="sim-seg-box flex items-center gap-1 p-1 bg-slate-900/95 border border-slate-700/80 rounded-[4px] shadow-lg overflow-x-auto max-w-[68vw] sm:max-w-full scrollbar-none shrink-0">
              {visibleModeTabs.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id);
                    onSelectMode?.(m.id);
                  }}
                  className={`sim-btn-phy min-h-[34px] px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold rounded-[3px] border whitespace-nowrap shrink-0 cursor-pointer ${
                    mode === m.id
                      ? 'sim-btn-active bg-amber-600 border-amber-300/70 text-white shadow-sm'
                      : 'border-transparent text-slate-300 hover:text-white'
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

            {CUTAWAY_PHYSICS_MODES.has(mode) && (
              <button
                onClick={() => setShowCutaway3D((v) => !v)}
                className={`p-2 rounded-md border transition-colors shadow-lg cursor-pointer shrink-0 ${
                  showCutaway3D
                    ? 'bg-amber-600/90 border-amber-400 text-white'
                    : 'bg-slate-900/95 border-slate-700/80 text-slate-300 hover:text-white'
                }`}
                title={showCutaway3D ? 'Tắt mặt cắt 3D' : 'Bật mặt cắt 3D (xuyên vỏ)'}
              >
                <Scissors className="w-4 h-4" />
              </button>
            )}

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

            <HologramModeControls
              mode={hologramMode}
              onChangeMode={setHologramMode}
              camStatus={camStatus}
              compact
            />

            <button
              type="button"
              onClick={() => setIsCodeModalOpen(true)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold transition-colors shadow-lg cursor-pointer shrink-0 whitespace-nowrap"
              title="Dịch ngược mô hình 3D sang Phương trình Vi phân & Code Python/C++"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Code RK4</span>
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
      </PhysicsApparatusWorkbench>
      <SimToCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        simId={mode}
        simTitle={current3DSpec?.title || mode}
        params={active3DProbeParams}
      />
      </div>
    </ViewportPortal>
  );
};
