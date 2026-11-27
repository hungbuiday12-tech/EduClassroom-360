import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect.js';
import { StereoEffect } from 'three/examples/jsm/effects/StereoEffect.js';
import {
  Activity,
  ArrowLeft,
  Camera,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  FlaskConical,
  Grid,
  Maximize2,
  Minimize2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  RotateCw,
  Sliders,
  Sparkles,
  StepForward,
  Tag,
  Trash2
} from 'lucide-react';
import { Chemistry3DMode, ChemistryDomainId } from '../../types';
import { CHEMISTRY_3D_SIMS } from '../../data/chemistryDomainsData';
import { CHEM_APPARATUS_BY_ID, evaluateChemApparatusReading } from '../../data/chemistryApparatusData';
import { ChemApparatus3DInstance, createChem3DApparatusModel } from './chemistry3DApparatusBuilders';
import { ChemistryApparatusWorkbench, PlacedChemApparatusInstance } from './ChemistryApparatusWorkbench';
import { CHEMISTRY_3D_CONFIGS } from './chemistry3DControlsData';
import { captureCanvasPng, MiniTelemetryChart, RecordVideoButton, useCanvasRecorder } from '../common/SimProToolkit';
import { ViewportPortal } from '../common/ViewportPortal';
import { HologramModeControls } from '../common/HologramModeControls';
import {
  applyOffAxisProjection,
  HologramDisplayMode,
  resetOffAxisProjection,
  useHeadTrackedHologram
} from '../../hooks/useHeadTrackedHologram';
import { applySphericalOrbitDelta } from '../../lib/remoteControlBus';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import {
  createCrispLine2,
  createLeaderArrowLabel,
  createPostProcessingPipeline,
  createTroikaLabel,
  GPUParticlePool,
  PostProcessPipeline,
  syncLine2Resolution,
  updateBillboardLabels
} from '../../lib/three3DEnhancements';
import { buildMiddleSchool3DChemScene } from './chemistry3DMiddleSchoolScenes';
import { attachThreeFloorDrag, ThreeFloorDragHandle } from '../../lib/threeFloorDragController';

interface Chemistry3DViewProps {
  mode: Chemistry3DMode;
  title?: string;
  heightClass?: string;
  isEn?: boolean;
  showApparatusBench?: boolean;
  embedded?: boolean;
  embeddedBadge?: string;
  onBack?: () => void;
  onOpenFull3D?: () => void;
}

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
  onChange
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
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  return (
    <div className="space-y-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80 px-2.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-slate-300 truncate">{label}</span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onChange(Math.max(min, Number((value - step).toFixed(4))))}
            className="w-7 h-7 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
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
            className="w-14 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 focus:border-emerald-500 text-right font-mono font-bold text-white text-[11px] outline-none tabular-nums"
          />
          <button
            type="button"
            onClick={() => onChange(Math.min(max, Number((value + step).toFixed(4))))}
            className="w-7 h-7 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            title={`Tăng ${step}`}
          >
            <Plus className="w-3 h-3" />
          </button>
          <span className="text-[10px] text-slate-400 font-mono min-w-[26px]">{unit}</span>
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

interface ChemLoggedSample3D {
  idx: number;
  timeSec: string;
  equation: string;
  instruments: string;
}

function detectSoftwareGl(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return true;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (!dbg) return false;
    const r = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
    return /SwiftShader|llvmpipe|softpipe|Software/i.test(r);
  } catch {
    return true;
  }
}

const _vecA = new THREE.Vector3();
const _vecB = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

function addBondCylinder(
  parent: THREE.Group,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  radius: number,
  mat: THREE.Material
) {
  _vecA.copy(p2).sub(p1);
  const len = _vecA.length();
  if (len < 0.001) return null;
  const geom = new THREE.CylinderGeometry(radius, radius, len, 14);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
  _vecB.copy(_vecA).normalize();
  mesh.quaternion.setFromUnitVectors(_up, _vecB);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function createErlenmeyerLathe(scale = 1): THREE.LatheGeometry {
  const pts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.88 * scale, 0.0),
    new THREE.Vector2(0.95 * scale, 0.14 * scale),
    new THREE.Vector2(0.32 * scale, 1.32 * scale),
    new THREE.Vector2(0.32 * scale, 1.82 * scale),
    new THREE.Vector2(0.4 * scale, 1.9 * scale),
    new THREE.Vector2(0.37 * scale, 1.92 * scale),
    new THREE.Vector2(0.28 * scale, 1.8 * scale),
    new THREE.Vector2(0.28 * scale, 1.32 * scale),
    new THREE.Vector2(0.89 * scale, 0.15 * scale),
    new THREE.Vector2(0.82 * scale, 0.05 * scale),
    new THREE.Vector2(0.0, 0.05 * scale)
  ];
  return new THREE.LatheGeometry(pts, 32);
}

function createBeakerLathe(radius = 0.85, height = 1.85): THREE.LatheGeometry {
  const pts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(radius, 0.0),
    new THREE.Vector2(radius, height),
    new THREE.Vector2(radius + 0.08, height + 0.06),
    new THREE.Vector2(radius + 0.05, height + 0.09),
    new THREE.Vector2(radius - 0.04, height),
    new THREE.Vector2(radius - 0.04, 0.06),
    new THREE.Vector2(0.0, 0.06)
  ];
  return new THREE.LatheGeometry(pts, 32);
}

function createTestTubeLathe(radius = 0.28, height = 2.1): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * (Math.PI / 2);
    pts.push(new THREE.Vector2(Math.sin(a) * radius, radius - Math.cos(a) * radius));
  }
  pts.push(new THREE.Vector2(radius, height));
  pts.push(new THREE.Vector2(radius + 0.04, height + 0.04));
  pts.push(new THREE.Vector2(radius - 0.03, height));
  pts.push(new THREE.Vector2(radius - 0.03, radius));
  for (let i = 7; i >= 0; i--) {
    const a = (i / 8) * (Math.PI / 2);
    pts.push(new THREE.Vector2(Math.sin(a) * (radius - 0.03), radius - Math.cos(a) * (radius - 0.03)));
  }
  return new THREE.LatheGeometry(pts, 24);
}

function createRoundFlaskLathe(radius = 0.88, neckH = 0.9): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 14; i++) {
    const a = (i / 14) * Math.PI * 0.82;
    pts.push(new THREE.Vector2(Math.sin(a) * radius, radius - Math.cos(a) * radius));
  }
  const topY = radius + Math.cos(Math.PI * 0.18) * radius;
  pts.push(new THREE.Vector2(0.26, topY + 0.12));
  pts.push(new THREE.Vector2(0.26, topY + neckH));
  pts.push(new THREE.Vector2(0.33, topY + neckH + 0.05));
  pts.push(new THREE.Vector2(0.22, topY + neckH));
  pts.push(new THREE.Vector2(0.22, topY + 0.12));
  return new THREE.LatheGeometry(pts, 28);
}

function disposeObjectTree(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const maybeTroika = child as { dispose?: () => void };
    if (typeof maybeTroika.dispose === 'function' && !(child instanceof THREE.Mesh)) {
      try {
        maybeTroika.dispose();
      } catch {
        // ignore
      }
    }
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else if (mat) mat.dispose();
  });
}

function buildDefaultParams(mode: Chemistry3DMode): Record<string, number> {
  const cfg = CHEMISTRY_3D_CONFIGS[mode];
  const out: Record<string, number> = {};
  cfg.params.forEach((p) => {
    out[p.key] = p.defaultVal;
  });
  return out;
}

export const Chemistry3DView: React.FC<Chemistry3DViewProps> = ({
  mode,
  title,
  heightClass = 'h-[430px]',
  isEn = false,
  showApparatusBench = true,
  embedded = false,
  embeddedBadge,
  onBack,
  onOpenFull3D
}) => {
  const { perfMode } = useBackgroundTheme();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const apparatusGroupRef = useRef<THREE.Group | null>(null);
  const apparatusMapRef = useRef<Map<string, ChemApparatus3DInstance>>(new Map());
  const apparatusTickRef = useRef<(() => void) | null>(null);
  const cameraLerpRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);

  const cfg = CHEMISTRY_3D_CONFIGS[mode];

  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [explode, setExplode] = useState(0);
  const [xray, setXray] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [autoOrbit, setAutoOrbit] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dockOpen, setDockOpen] = useState(true);
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [floorModelMoved, setFloorModelMoved] = useState(false);
  const floorDragRef = useRef<ThreeFloorDragHandle | null>(null);
  const [placedTools, setPlacedTools] = useState<PlacedChemApparatusInstance[]>([]);
  const [simClock, setSimClock] = useState(0);
  const [isSoftwareGl] = useState(() => detectSoftwareGl());
  const [hologramMode, setHologramMode] = useState<HologramDisplayMode>('normal');
  const hologramModeRef = useRef<HologramDisplayMode>('normal');
  hologramModeRef.current = hologramMode;
  const { headOffsetRef, camStatus } = useHeadTrackedHologram(hologramMode);

  const [modeParams, setModeParams] = useState<Record<string, number>>(() => buildDefaultParams(mode));
  const [expFlags, setExpFlags] = useState<Record<string, boolean | number>>(() => ({
    ...CHEMISTRY_3D_CONFIGS[mode].defaultFlags
  }));
  const [loggedSamples, setLoggedSamples] = useState<ChemLoggedSample3D[]>([]);

  useEffect(() => {
    setModeParams(buildDefaultParams(mode));
    setExpFlags({ ...CHEMISTRY_3D_CONFIGS[mode].defaultFlags });
    setSelectedPart('');
  }, [mode]);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFullscreen]);

  const pausedRef = useRef(paused);
  const speedRef = useRef(speed);
  const explodeRef = useRef(explode);
  const xrayRef = useRef(xray);
  const showLabelsRef = useRef(showLabels);
  const showGridRef = useRef(showGrid);
  const autoOrbitRef = useRef(autoOrbit);
  const placedToolsRef = useRef(placedTools);
  const simTimeRef = useRef(0);
  const stepTriggerRef = useRef(0);
  const modeParamsRef = useRef(modeParams);
  const expFlagsRef = useRef(expFlags);

  pausedRef.current = paused;
  speedRef.current = speed;
  explodeRef.current = explode;
  xrayRef.current = xray;
  showLabelsRef.current = showLabels;
  showGridRef.current = showGrid;
  autoOrbitRef.current = autoOrbit;
  placedToolsRef.current = placedTools;
  modeParamsRef.current = modeParams;
  expFlagsRef.current = expFlags;

  const domainId: ChemistryDomainId = useMemo(() => {
    return CHEMISTRY_3D_SIMS.find((s) => s.id === mode)?.domainId || 'electro_inorganic';
  }, [mode]);

  const readout = useMemo(
    () => cfg.computeReadout(modeParams, expFlags, simClock),
    [cfg, modeParams, expFlags, simClock]
  );

  const probeParams = useMemo(
    () => ({ ...readout.probeParams, speed }),
    [readout.probeParams, speed]
  );

  const recorder = useCanvasRecorder(() => canvasRef.current, `chem-3d-${mode}`);

  const handleAction = (actionId: string, kind: 'toggle' | 'trigger' | 'reset', flagKey?: string) => {
    if (kind === 'reset') {
      setModeParams(buildDefaultParams(mode));
      setExpFlags({ ...cfg.defaultFlags });
      return;
    }
    if (kind === 'toggle' && flagKey) {
      setExpFlags((prev) => ({ ...prev, [flagKey]: !prev[flagKey] }));
      return;
    }
    if (mode === 'titration_bench_3d' && actionId === 'drip_2ml') {
      setModeParams((prev) => ({
        ...prev,
        vBase: Math.min(40, Number(((prev.vBase ?? 0) + 2).toFixed(1)))
      }));
      setExpFlags((prev) => ({ ...prev, stirring: true }));
    } else if (mode === 'colloid_micelle_3d' && actionId === 'add_soap') {
      setModeParams((prev) => ({
        ...prev,
        soapConc: Math.min(10, Number(((prev.soapConc ?? 0) + 2).toFixed(1)))
      }));
    }
  };

  // Continuous gentle burette drip when valve is left open in titration_bench_3d
  useEffect(() => {
    if (mode !== 'titration_bench_3d' || !expFlags.valveOpen || paused) return;
    const id = window.setInterval(() => {
      setModeParams((prev) => {
        const cur = prev.vBase ?? 0;
        if (cur >= 40) {
          setExpFlags((f) => ({ ...f, valveOpen: false }));
          return prev;
        }
        return { ...prev, vBase: Math.min(40, Number((cur + 0.5).toFixed(1))) };
      });
    }, 550);
    return () => window.clearInterval(id);
  }, [mode, expFlags.valveOpen, paused]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isUltra = perfMode === 'ultra';
    const isSmooth = perfMode === 'smooth';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isUltra ? 0x07101f : 0x09111f);
    scene.fog = new THREE.FogExp2(isUltra ? 0x07101f : 0x09111f, isSmooth ? 0.022 : 0.026);

    const w = container.clientWidth || 720;
    const h = container.clientHeight || 430;
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(4.5, 3.1, 5.4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl && !isSmooth,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(w, h);
    const maxDpr = isUltra ? 2.0 : isSmooth ? 1.35 : 1.85;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isUltra ? 1.16 : isSmooth ? 1.0 : 1.08;
    renderer.shadowMap.enabled = !isSmooth && !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    canvasRef.current = renderer.domElement;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    if ('environmentIntensity' in scene) {
      (scene as THREE.Scene & { environmentIntensity: number }).environmentIntensity = isUltra
        ? 1.05
        : isSmooth
        ? 0.45
        : 0.78;
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2.4;
    controls.maxDistance = 16;
    const cancelCamLerp = () => {
      cameraLerpRef.current = null;
    };
    controls.addEventListener('start', cancelCamLerp);
    controlsRef.current = controls;

    const hemi = new THREE.HemisphereLight(0xbae6fd, 0x0f172a, isUltra ? 0.85 : 0.68);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, isUltra ? 1.75 : isSmooth ? 1.15 : 1.45);
    keyLight.position.set(6, 9, 6);
    if (!isSmooth && !isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(isUltra ? 2048 : 1024, isUltra ? 2048 : 1024);
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, isUltra ? 0.9 : 0.58);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    const accentPoint = new THREE.PointLight(0x34d399, isUltra ? 1.8 : isSmooth ? 0.4 : 1.1, 14);
    accentPoint.position.set(0, 1.4, 2.2);
    scene.add(accentPoint);

    const benchDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(5.6, 5.8, 0.16, 48),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: isUltra ? 0.55 : 0.35,
        roughness: isUltra ? 0.32 : 0.52
      })
    );
    benchDisc.position.y = -2.18;
    benchDisc.receiveShadow = true;
    scene.add(benchDisc);

    const rimRing = new THREE.Mesh(
      new THREE.TorusGeometry(5.6, 0.03, 12, 64),
      new THREE.MeshBasicMaterial({
        color: isUltra ? 0x38bdf8 : 0x0ea5e9,
        transparent: true,
        opacity: isUltra ? 0.72 : 0.35
      })
    );
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = -2.1;
    scene.add(rimRing);

    const grid = new THREE.GridHelper(12, 16, 0x1e293b, 0x0f172a);
    grid.position.y = -2.09;
    scene.add(grid);

    let pipeline: PostProcessPipeline | null = null;
    if (!isSmooth && !isSoftwareGl) {
      pipeline = createPostProcessingPipeline(renderer, scene, camera, {
        bloomIntensity: isUltra ? 0.36 : 0.24,
        luminanceThreshold: isUltra ? 0.88 : 0.92,
        enableSmaa: true
      });
    }

    const anaglyphEffect = new AnaglyphEffect(renderer);
    anaglyphEffect.setSize(w, h);
    const stereoEffect = new StereoEffect(renderer);
    stereoEffect.setSize(w, h);

    const root = new THREE.Group();
    scene.add(root);

    const labelGroup = new THREE.Group();
    scene.add(labelGroup);

    const apparatusGroup = new THREE.Group();
    apparatusGroup.position.y = -2.1;
    scene.add(apparatusGroup);
    apparatusGroupRef.current = apparatusGroup;

    const poolCap = isUltra ? 280 : isSmooth ? 72 : 160;
    const gpuPool = new GPUParticlePool(poolCap, isUltra ? 0.062 : 0.05, 0x38bdf8, 0xfacc15);
    scene.add(gpuPool.mesh);

    const partsWithHome: { mesh: THREE.Object3D; home: THREE.Vector3; dir: THREE.Vector3; label: string }[] = [];
    const shellMeshes: THREE.Mesh[] = [];
    const registerPart = (
      mesh: THREE.Object3D,
      label: string,
      dir: [number, number, number],
      isOuterShell = false
    ) => {
      mesh.userData.partLabel = label;
      mesh.traverse((c) => {
        c.userData.partLabel = label;
        if ((c as THREE.Mesh).isMesh && !isOuterShell) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      root.add(mesh);
      partsWithHome.push({
        mesh,
        home: mesh.position.clone(),
        dir: new THREE.Vector3(...dir),
        label
      });
      if (isOuterShell && mesh instanceof THREE.Mesh) {
        mesh.userData.origOpacity = (mesh.material as THREE.Material).opacity ?? 1;
        shellMeshes.push(mesh);
      }
    };

    const addLabel = (
      text: string,
      pos: [number, number, number],
      color: number = 0xe0f2fe,
      anchorPos?: [number, number, number]
    ) => {
      if (anchorPos) {
        const leader = createLeaderArrowLabel({
          text,
          labelPos: pos,
          anchorPos,
          fontSize: 0.23,
          color,
        });
        labelGroup.add(leader);
      } else {
        const lbl = createTroikaLabel({
          text,
          position: pos,
          fontSize: 0.25,
          color,
          outlineWidth: 0.018
        });
        labelGroup.add(lbl);
      }
    };

    const dynamicSpinners: THREE.Object3D[] = [];
    const animatedParticles: { mesh: THREE.Object3D; phase: number; basePos: THREE.Vector3 }[] = [];
    let customEmit: ((t: number, dt: number, params: Record<string, number>, flags: Record<string, boolean | number>) => void) | null = null;
    let onLiveUpdate: ((t: number, dt: number, params: Record<string, number>, flags: Record<string, boolean | number>) => void) | null = null;

    const glassMat = (color: number, opacity = 0.28) =>
      new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity,
        roughness: 0.08,
        metalness: 0.04,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        side: THREE.DoubleSide,
        depthWrite: false
      });

    switch (mode) {
      case 'titration_bench_3d': {
        accentPoint.color.setHex(0xf472b6);
        // Magnetic Stirrer Base + Control Dial
        const base = new THREE.Mesh(
          new THREE.BoxGeometry(2.8, 0.28, 2.2),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.4 })
        );
        base.position.set(0, -1.85, 0);
        registerPart(base, 'Đế máy khuấy từ', [0, -0.4, 0]);
        const plate = new THREE.Mesh(
          new THREE.CylinderGeometry(0.95, 0.95, 0.06, 28),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.2, roughness: 0.3 })
        );
        plate.position.set(0, -1.68, 0);
        registerPart(plate, 'Mặt gốm máy khuấy từ', [0, -0.35, 0]);

        // Retort stand + Clamp
        const stand = new THREE.Mesh(
          new THREE.CylinderGeometry(0.065, 0.065, 4.1, 14),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 })
        );
        stand.position.set(-1.15, 0.25, -0.2);
        registerPart(stand, 'Giá đỡ Buret thép không gỉ', [-0.7, 0, 0]);
        const clampArm = new THREE.Mesh(
          new THREE.BoxGeometry(1.18, 0.08, 0.14),
          new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.75, roughness: 0.3 })
        );
        clampArm.position.set(-0.58, 1.55, -0.1);
        registerPart(clampArm, 'Kẹp giữ Buret', [-0.4, 0.2, 0]);

        // Graduated Burette + Liquid Column + Rotatable Stopcock
        const buretteGlass = new THREE.Mesh(
          new THREE.CylinderGeometry(0.13, 0.13, 2.35, 22, 1, true),
          glassMat(0xe0f2fe, 0.36)
        );
        buretteGlass.position.set(0, 1.55, 0);
        registerPart(buretteGlass, 'Ống Buret thủy tinh chia vạch mL', [0, 0.8, 0], true);

        const buretteTip = new THREE.Mesh(
          new THREE.ConeGeometry(0.11, 0.32, 16),
          glassMat(0xe0f2fe, 0.42)
        );
        buretteTip.rotation.x = Math.PI;
        buretteTip.position.set(0, 0.22, 0);
        registerPart(buretteTip, 'Đầu nhỏ giọt Buret', [0, 0.5, 0], true);

        const buretteLiquidMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.62,
          roughness: 0.15
        });
        const buretteLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 2.2, 18), buretteLiquidMat);
        buretteLiquid.position.set(0, 1.5, 0);
        registerPart(buretteLiquid, 'Dung dịch chuẩn NaOH 0,1M trong Buret', [0, 0.7, 0]);

        const stopcock = new THREE.Mesh(
          new THREE.BoxGeometry(0.42, 0.08, 0.08),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
        );
        stopcock.position.set(0, 0.38, 0.14);
        registerPart(stopcock, 'Khóa van PTFE Buret (Đóng/Mở)', [0.3, 0.3, 0]);

        // Crisp LatheGeometry Erlenmeyer Flask
        const flaskMesh = new THREE.Mesh(createErlenmeyerLathe(1.0), glassMat(0xe0f2fe, 0.32));
        flaskMesh.position.set(0, -1.64, 0);
        registerPart(flaskMesh, 'Bình tam giác chứa 25 mL HCl', [0, -0.2, 0.6], true);

        const flaskLiquidMat = new THREE.MeshPhysicalMaterial({
          color: 0xdbeafe,
          transparent: true,
          opacity: 0.38,
          roughness: 0.12,
          clearcoat: 0.9
        });
        const flaskLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.85, 0.62, 28), flaskLiquidMat);
        flaskLiquid.position.set(0, -1.28, 0);
        registerPart(flaskLiquid, 'Dung dịch trong bình tam giác', [0, -0.3, 0]);

        const stirBar = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.055, 0.36, 8, 12),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 })
        );
        stirBar.rotation.z = Math.PI / 2;
        stirBar.position.set(0, -1.56, 0);
        registerPart(stirBar, 'Con cá khuấy từ PTFE', [0, -0.2, 0]);

        addLabel('Buret NaOH 0,1M', [1.85, 1.75, 0], 0x7dd3fc, [0.14, 1.55, 0]);
        addLabel('Bình HCl 25 mL', [2.05, -1.05, 0], 0xf9a8d4, [0.65, -1.15, 0]);

        const clearCol = new THREE.Color(0xdbeafe);
        const pinkCol = new THREE.Color(0xec4899);
        const faintPinkCol = new THREE.Color(0xf9a8d4);
        let dripCooldown = 0;

        onLiveUpdate = (t, dt, params, flags) => {
          const vBase = Math.max(0, Math.min(40, params.vBase ?? 0));
          const vAcid = 25;
          const eqVol = (vAcid * (params.concAcid ?? 0.1)) / 0.1;
          const ph = 1.3 + 11.4 / (1 + Math.exp(-((vBase / Math.max(1, eqVol)) - 1) * 8.5));
          const hasInd = Boolean(flags.indicatorAdded);
          const isOpen = Boolean(flags.valveOpen);
          const isStir = Boolean(flags.stirring);

          const fillFrac = Math.max(0.04, (40 - vBase) / 40);
          buretteLiquid.scale.y = fillFrac;
          buretteLiquid.position.y = 0.4 + fillFrac * 1.1;

          stopcock.rotation.z = THREE.MathUtils.damp(stopcock.rotation.z, isOpen ? Math.PI / 2 : 0, 12, dt);

          const flaskScale = 0.72 + (vBase / 40) * 0.48;
          flaskLiquid.scale.y = flaskScale;
          flaskLiquid.position.y = -1.6 + 0.31 * flaskScale;

          if (!hasInd) {
            flaskLiquidMat.color.lerp(clearCol, 0.15);
            flaskLiquidMat.opacity = THREE.MathUtils.damp(flaskLiquidMat.opacity, 0.38, 8, dt);
          } else if (ph >= 8.2) {
            flaskLiquidMat.color.lerp(pinkCol, 0.15);
            flaskLiquidMat.opacity = THREE.MathUtils.damp(flaskLiquidMat.opacity, 0.78, 8, dt);
          } else if (vBase > eqVol * 0.65 && isOpen) {
            flaskLiquidMat.color.lerp(faintPinkCol, 0.08);
            flaskLiquidMat.opacity = THREE.MathUtils.damp(flaskLiquidMat.opacity, 0.52, 8, dt);
          } else {
            flaskLiquidMat.color.lerp(clearCol, 0.15);
            flaskLiquidMat.opacity = THREE.MathUtils.damp(flaskLiquidMat.opacity, 0.38, 8, dt);
          }

          if (isStir) {
            stirBar.rotation.y = t * 14;
          }

          dripCooldown -= dt;
          if (isOpen && vBase < 40 && dripCooldown <= 0) {
            dripCooldown = 0.18;
            gpuPool.spawn(0, 0.06, 0, 0, -2.5, 0, 0.6, 1.15, hasInd && vBase > eqVol * 0.7 ? 0xf472b6 : 0x38bdf8);
          }
        };
        break;
      }

      case 'halogen_ion_bench_3d': {
        accentPoint.color.setHex(0xfacc15);
        const rack = new THREE.Mesh(
          new THREE.BoxGeometry(4.4, 0.18, 1.1),
          new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.4, roughness: 0.45 })
        );
        rack.position.set(0, -1.75, 0);
        registerPart(rack, 'Giá đỡ 4 ống nghiệm Halide', [0, -0.4, 0]);
        const rackTop = new THREE.Mesh(
          new THREE.BoxGeometry(4.4, 0.08, 1.0),
          new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
        );
        rackTop.position.set(0, -0.45, 0);
        registerPart(rackTop, 'Thanh giữ cổ ống nghiệm', [0, -0.2, 0]);

        const tubesCfg = [
          { x: -1.65, col: 0xdbeafe, lbl: 'Ống 1 (NaF): Không kết tủa' },
          { x: -0.55, col: 0xf8fafc, lbl: 'Ống 2 (NaCl): AgCl↓ trắng' },
          { x: 0.55, col: 0xfef08a, lbl: 'Ống 3 (NaBr): AgBr↓ vàng nhạt' },
          { x: 1.65, col: 0xfacc15, lbl: 'Ống 4 (NaI): AgI↓ vàng đậm' }
        ];
        const pptMeshes: THREE.Mesh[] = [];
        const solMats: THREE.MeshStandardMaterial[] = [];

        tubesCfg.forEach((tb, idx) => {
          const tube = new THREE.Mesh(createTestTubeLathe(0.3, 2.25), glassMat(0xe0f2fe, 0.34));
          tube.position.set(tb.x, -1.65, 0);
          registerPart(tube, tb.lbl, [tb.x * 0.25, 0.3, 0], true);

          const solMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.28, roughness: 0.15 });
          solMats.push(solMat);
          const sol = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.25, 18), solMat);
          sol.position.set(tb.x, -0.9, 0);
          registerPart(sol, `Dung dịch ống #${idx + 1}`, [tb.x * 0.25, 0.1, 0]);

          const ppt = new THREE.Mesh(
            new THREE.CylinderGeometry(0.24, 0.21, 0.56, 18),
            new THREE.MeshStandardMaterial({ color: tb.col, transparent: true, opacity: 0, roughness: 0.45 })
          );
          ppt.position.set(tb.x, -1.34, 0);
          ppt.scale.y = 0.05;
          registerPart(ppt, tb.lbl, [tb.x * 0.25, -0.2, 0]);
          pptMeshes.push(ppt);
        });

        addLabel('NaF (không tủa)', [-1.65, 1.05, 0], 0x7dd3fc);
        addLabel('NaCl (AgCl↓)', [-0.55, 1.05, 0], 0xf8fafc);
        addLabel('NaBr (AgBr↓)', [0.55, 1.05, 0], 0xfef08a);
        addLabel('NaI (AgI↓)', [1.65, 1.05, 0], 0xfacc15);

        onLiveUpdate = (_, dt, params, flags) => {
          const ag = Boolean(flags.agno3Added);
          const nh3 = Boolean(flags.nh3Added);
          const concBoost = Math.min(1.25, 0.7 + (params.conc ?? 0.1) * 1.4);

          pptMeshes.forEach((ppt, idx) => {
            const mat = ppt.material as THREE.MeshStandardMaterial;
            let targetOp = 0;
            let targetScale = 0.05;
            if (ag) {
              if (idx === 0) {
                targetOp = 0.05;
                targetScale = 0.05;
              } else if (idx === 1) {
                targetOp = nh3 ? 0.04 : 0.92;
                targetScale = nh3 ? 0.05 : concBoost;
              } else {
                targetOp = 0.94;
                targetScale = concBoost;
              }
            }
            mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOp, 6, dt);
            ppt.scale.y = THREE.MathUtils.damp(ppt.scale.y, targetScale, 6, dt);
            ppt.position.y = -1.6 + 0.28 * ppt.scale.y;
          });
        };
        break;
      }

      case 'galvanic_cell_3d':
      case 'electrolysis_cell_3d': {
        const isElectro = mode === 'electrolysis_cell_3d';
        accentPoint.color.setHex(isElectro ? 0x22d3ee : 0x38bdf8);

        let saltBridgeObj: THREE.Mesh | null = null;
        let switchBlade: THREE.Mesh | null = null;
        let cuPlating: THREE.Mesh | null = null;
        let statusLedMat: THREE.MeshStandardMaterial | null = null;

        if (isElectro) {
          const tank = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.2, 2.0), glassMat(0x0ea5e9, 0.3));
          tank.position.set(0, -0.5, 0);
          registerPart(tank, 'Bình điện phân dung dịch CuSO₄ / NaCl', [0, 0, 0.7], true);

          const sol = new THREE.Mesh(
            new THREE.BoxGeometry(3.32, 1.45, 1.84),
            new THREE.MeshPhysicalMaterial({ color: 0x0284c7, transparent: true, opacity: 0.42, roughness: 0.1 })
          );
          sol.position.set(0, -0.85, 0);
          registerPart(sol, 'Dung dịch điện li CuSO₄', [0, -0.3, 0]);

          const psu = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.85, 1.1),
            new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.35 })
          );
          psu.position.set(0, 1.8, -0.3);
          registerPart(psu, 'Nguồn điện một chiều DC', [0, 0.7, 0]);

          statusLedMat = new THREE.MeshStandardMaterial({ color: 0x475569, emissive: 0x10b981, emissiveIntensity: 0 });
          const led = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), statusLedMat);
          led.position.set(0.45, 1.85, 0.28);
          registerPart(led, 'Đèn báo nguồn DC', [0, 0.7, 0.2]);

          const wire = createCrispLine2([[-0.95, 1.1, 0], [-0.95, 1.8, 0], [0.95, 1.8, 0], [0.95, 1.1, 0]], {
            color: 0xfacc15,
            linewidth: 2.5
          });
          root.add(wire);

          cuPlating = new THREE.Mesh(
            new THREE.BoxGeometry(0.36, 1.35, 0.36),
            new THREE.MeshStandardMaterial({ color: 0xea580c, metalness: 0.88, roughness: 0.18, transparent: true, opacity: 0.02 })
          );
          cuPlating.position.set(-0.95, -0.65, 0);
          registerPart(cuPlating, 'Lớp Đồng (Cu) bám trên Cathode', [-0.4, 0, 0]);
        } else {
          const lBeaker = new THREE.Mesh(createBeakerLathe(0.92, 1.95), glassMat(0xbae6fd, 0.3));
          lBeaker.position.set(-1.6, -1.65, 0);
          registerPart(lBeaker, 'Cốc bán pin Anode (−) Zn | ZnSO₄', [-0.7, 0, 0], true);

          const lSol = new THREE.Mesh(
            new THREE.CylinderGeometry(0.84, 0.84, 1.32, 24),
            new THREE.MeshStandardMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.26, roughness: 0.1 })
          );
          lSol.position.set(-1.6, -0.94, 0);
          registerPart(lSol, 'Dung dịch ZnSO₄ (không màu)', [-0.7, -0.2, 0]);

          const rBeaker = new THREE.Mesh(createBeakerLathe(0.92, 1.95), glassMat(0x7dd3fc, 0.34));
          rBeaker.position.set(1.6, -1.65, 0);
          registerPart(rBeaker, 'Cốc bán pin Cathode (+) CuSO₄ | Cu', [0.7, 0, 0], true);

          const rSol = new THREE.Mesh(
            new THREE.CylinderGeometry(0.84, 0.84, 1.32, 24),
            new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.5, roughness: 0.1 })
          );
          rSol.position.set(1.6, -0.94, 0);
          registerPart(rSol, 'Dung dịch CuSO₄ xanh lam', [0.7, -0.2, 0]);

          saltBridgeObj = new THREE.Mesh(
            new THREE.TorusGeometry(1.12, 0.13, 16, 40, Math.PI),
            new THREE.MeshStandardMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.8 })
          );
          saltBridgeObj.position.set(0, 1.35, 0);
          registerPart(saltBridgeObj, 'Cầu muối KCl (Nhúng nối 2 cốc)', [0, 0.85, 0]);

          const wire = createCrispLine2([[-1.85, 1.25, 0], [-1.85, 2.0, 0], [1.85, 2.0, 0], [1.85, 1.25, 0]], {
            color: 0xfacc15,
            linewidth: 2.5
          });
          root.add(wire);

          const meterBox = new THREE.Mesh(
            new THREE.BoxGeometry(0.95, 0.58, 0.45),
            new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.35 })
          );
          meterBox.position.set(0, 2.02, 0);
          registerPart(meterBox, 'Vôn kế đo E_pin (V)', [0, 0.9, 0]);

          statusLedMat = new THREE.MeshStandardMaterial({ color: 0x475569, emissive: 0x10b981, emissiveIntensity: 0 });
          const meterScreen = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.28, 0.06), statusLedMat);
          meterScreen.position.set(0, 2.02, 0.24);
          registerPart(meterScreen, 'Màn hình Vôn kế', [0, 0.9, 0.2]);

          switchBlade = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 0.06, 0.08),
            new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 })
          );
          switchBlade.position.set(-1.1, 2.06, 0.05);
          switchBlade.rotation.z = 0.6;
          registerPart(switchBlade, 'Công tắc mạch ngoài', [-0.3, 0.9, 0]);
        }

        const rodL = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 2.2, 0.28),
          new THREE.MeshStandardMaterial({ color: isElectro ? 0xd97706 : 0xcbd5e1, metalness: 0.85, roughness: 0.22 })
        );
        rodL.position.set(isElectro ? -0.95 : -1.85, -0.1, 0);
        registerPart(rodL, isElectro ? 'Cathode (−) bám Cu đỏ' : 'Điện cực Kẽm Zn (−) nhường e⁻', [-0.55, 0.3, 0]);

        const rodR = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 2.2, 0.28),
          new THREE.MeshStandardMaterial({ color: isElectro ? 0x475569 : 0xd97706, metalness: 0.85, roughness: 0.22 })
        );
        rodR.position.set(isElectro ? 0.95 : 1.85, -0.1, 0);
        registerPart(rodR, isElectro ? 'Anode (+) sủi khí O₂/Cl₂' : 'Điện cực Đồng Cu (+) nhận e⁻', [0.55, 0.3, 0]);

        addLabel(isElectro ? 'Cathode (−)' : 'Anode Zn (−)', [isElectro ? -0.95 : -1.85, 1.45, 0], 0xfde047);
        addLabel(isElectro ? 'Anode (+)' : 'Cathode Cu (+)', [isElectro ? 0.95 : 1.85, 1.45, 0], 0x7dd3fc);

        let emitCooldown = 0;
        onLiveUpdate = (_, dt, params, flags) => {
          emitCooldown -= dt;
          if (isElectro) {
            const on = Boolean(flags.powerOn);
            const cur = params.currentA ?? 2.5;
            if (statusLedMat) {
              statusLedMat.color.setHex(on ? 0x10b981 : 0x475569);
              statusLedMat.emissiveIntensity = on ? 0.95 : 0;
            }
            if (cuPlating) {
              const mat = cuPlating.material as THREE.MeshStandardMaterial;
              mat.opacity = THREE.MathUtils.damp(mat.opacity, on ? 0.88 : 0.02, 3, dt);
            }
            if (on && emitCooldown <= 0) {
              emitCooldown = Math.max(0.05, 0.35 - cur * 0.03);
              gpuPool.spawn(0.95 + (Math.random() - 0.5) * 0.24, -1.1, (Math.random() - 0.5) * 0.2, 0, 1.6, 0, 0.9, 1.0, 0xa3e635);
            }
          } else {
            const bridgeIn = Boolean(flags.saltBridgeIn);
            const closed = Boolean(flags.circuitClosed);
            const active = bridgeIn && closed;
            if (saltBridgeObj) {
              saltBridgeObj.position.y = THREE.MathUtils.damp(saltBridgeObj.position.y, bridgeIn ? -0.15 : 1.35, 8, dt);
            }
            if (switchBlade) {
              switchBlade.rotation.z = THREE.MathUtils.damp(switchBlade.rotation.z, closed ? 0 : 0.65, 10, dt);
            }
            if (statusLedMat) {
              statusLedMat.color.setHex(active ? 0x10b981 : 0x475569);
              statusLedMat.emissiveIntensity = active ? 0.9 : 0;
            }
            if (active && emitCooldown <= 0) {
              emitCooldown = 0.14;
              gpuPool.spawn(-1.85, 2.0, 0, 3.6, 0, 0, 1.02, 0.85, 0xfacc15);
            }
          }
        };
        break;
      }

      case 'ester_reflux_3d': {
        accentPoint.color.setHex(0xf59e0b);
        const burnerBase = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.38, 0.52, 18),
          new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 })
        );
        burnerBase.position.set(-1.45, -1.78, 0);
        registerPart(burnerBase, 'Đèn Bunsen gia nhiệt bình cầu', [-0.6, -0.5, 0]);

        const flameMesh = new THREE.Mesh(
          new THREE.ConeGeometry(0.22, 0.58, 16),
          new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.85 })
        );
        flameMesh.position.set(-1.45, -1.22, 0);
        flameMesh.visible = false;
        registerPart(flameMesh, 'Ngọn lửa gia nhiệt 78°C', [-0.6, -0.3, 0]);

        const boiler = new THREE.Mesh(createRoundFlaskLathe(0.82, 0.72), glassMat(0xf59e0b, 0.34));
        boiler.position.set(-1.45, -0.88, 0);
        registerPart(boiler, 'Bình cầu đun CH₃COOH + C₂H₅OH + H₂SO₄ đặc', [-0.6, -0.2, 0], true);

        const boilerLiq = new THREE.Mesh(
          new THREE.SphereGeometry(0.68, 20, 16, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55),
          new THREE.MeshStandardMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.55, roughness: 0.2 })
        );
        boilerLiq.position.set(-1.45, -0.1, 0);
        registerPart(boilerLiq, 'Hỗn hợp phản ứng trong bình cầu', [-0.6, -0.1, 0]);

        const condenser = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 2.55, 20), glassMat(0x38bdf8, 0.38));
        condenser.position.set(0.15, 0.52, 0);
        condenser.rotation.z = -1.15;
        registerPart(condenser, 'Ống sinh hàn làm lạnh ngưng tụ hơi Este', [0, 0.8, 0]);

        const receiver = new THREE.Mesh(createErlenmeyerLathe(0.82), glassMat(0xe0f2fe, 0.34));
        receiver.position.set(1.65, -1.65, 0);
        registerPart(receiver, 'Bình hứng phân lớp Ester–Nước', [0.6, -0.3, 0], true);

        const esterLayer = new THREE.Mesh(
          new THREE.CylinderGeometry(0.55, 0.68, 0.35, 22),
          new THREE.MeshStandardMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.05, roughness: 0.15 })
        );
        esterLayer.position.set(1.65, -1.35, 0);
        registerPart(esterLayer, 'Lớp Este Etyl axetat nổi trên nước', [0.6, -0.2, 0]);

        addLabel('Đèn đun + Bình cầu', [-1.45, 0.85, 0], 0xfde047);
        addLabel('Sinh hàn Liebig', [0.15, 1.35, 0], 0x7dd3fc);
        addLabel('Este nổi lớp trên', [1.65, 0.25, 0], 0xfdba74);

        let vaporCooldown = 0;
        onLiveUpdate = (t, dt, params, flags) => {
          const cat = Boolean(flags.catalystAdded);
          const heat = Boolean(flags.burnerOn);
          flameMesh.visible = heat;
          if (heat) {
            const fScale = 0.85 + Math.sin(t * 16) * 0.1 + ((params.tempC ?? 78) - 50) * 0.008;
            flameMesh.scale.set(1, Math.max(0.5, fScale), 1);
          }
          const eMat = esterLayer.material as THREE.MeshStandardMaterial;
          const active = cat && heat;
          eMat.opacity = THREE.MathUtils.damp(eMat.opacity, active ? 0.78 : 0.06, 4, dt);
          esterLayer.scale.y = THREE.MathUtils.damp(esterLayer.scale.y, active ? 1.4 : 0.25, 4, dt);
          vaporCooldown -= dt;
          if (active && vaporCooldown <= 0) {
            vaporCooldown = 0.16;
            gpuPool.spawn(-1.2 + (Math.random() - 0.5) * 0.2, 0.35, 0, 1.45, 0.45, 0, 0.9, 0.95, 0xfbbf24);
          }
        };
        break;
      }

      case 'carbonyl_alcohol_3d': {
        accentPoint.color.setHex(0x38bdf8);
        const cMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
        const oMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x7f1d1d, emissiveIntensity: 0.25, roughness: 0.25 });
        const hMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
        const bMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.35 });

        const c1 = new THREE.Vector3(-0.75, 0.1, 0);
        const c2 = new THREE.Vector3(0.72, 0.1, 0);
        const oPos = new THREE.Vector3(1.55, 1.05, 0);
        const hPos = new THREE.Vector3(1.52, -0.82, 0);
        const mC1 = new THREE.Mesh(new THREE.SphereGeometry(0.36, 22, 22), cMat);
        mC1.position.copy(c1);
        registerPart(mC1, 'Nhóm metyl CH₃-', [-0.6, 0, 0]);
        const mC2 = new THREE.Mesh(new THREE.SphereGeometry(0.36, 22, 22), cMat);
        mC2.position.copy(c2);
        registerPart(mC2, 'Cacbon nhóm Cacbonyl (sp², 120°)', [0.4, 0, 0]);
        const mO = new THREE.Mesh(new THREE.SphereGeometry(0.33, 22, 22), oMat);
        mO.position.copy(oPos);
        registerPart(mO, 'Oxi liên kết đôi C=O (Phân cực δ⁻)', [0.8, 0.6, 0]);
        const mH = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), hMat);
        mH.position.copy(hPos);
        registerPart(mH, 'Hydro -CHO (Tham gia tráng bạc)', [0.8, -0.5, 0]);
        addBondCylinder(root, c1, c2, 0.08, bMat);
        addBondCylinder(root, new THREE.Vector3(c2.x - 0.06, c2.y + 0.07, 0), new THREE.Vector3(oPos.x - 0.06, oPos.y + 0.07, 0), 0.055, bMat);
        addBondCylinder(root, new THREE.Vector3(c2.x + 0.06, c2.y - 0.07, 0), new THREE.Vector3(oPos.x + 0.06, oPos.y - 0.07, 0), 0.055, bMat);
        addBondCylinder(root, c2, hPos, 0.06, bMat);

        const glassShell = new THREE.Mesh(
          new THREE.CylinderGeometry(1.75, 1.75, 2.4, 28, 1, true),
          glassMat(0xe0f2fe, 0.24)
        );
        glassShell.rotation.z = Math.PI / 2;
        registerPart(glassShell, 'Thành ống nghiệm thủy tinh sạch', [0, 0, 1.0], true);

        const mirrorMat = new THREE.MeshStandardMaterial({
          color: 0xe2e8f0,
          metalness: 0.96,
          roughness: 0.06,
          transparent: true,
          opacity: 0.02,
          side: THREE.DoubleSide
        });
        const mirrorTube = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 2.25, 28, 1, true), mirrorMat);
        mirrorTube.rotation.z = Math.PI / 2;
        registerPart(mirrorTube, 'Lớp gương Bạc (Ag↓) tráng thành ống nghiệm', [0, 0, 0.9], true);
        addLabel('Anđehit CH₃-CH=O (Tráng gương Ag⁺)', [0, 1.98, 0], 0xe2e8f0);
        dynamicSpinners.push(root);

        onLiveUpdate = (_, dt, _p, flags) => {
          const tol = Boolean(flags.tollensAdded);
          const warm = Boolean(flags.warmed);
          const targetOp = tol && warm ? 0.78 : tol ? 0.14 : 0.02;
          mirrorMat.opacity = THREE.MathUtils.damp(mirrorMat.opacity, targetOp, 3.5, dt);
        };
        break;
      }

      case 'metal_corrosion_3d': {
        accentPoint.color.setHex(0xf97316);
        const fePlate = new THREE.Mesh(
          new THREE.BoxGeometry(2.2, 0.45, 2.0),
          new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.3 })
        );
        fePlate.position.set(-1.05, -0.85, 0);
        registerPart(fePlate, 'Bản Sắt Fe (Anode bị ăn mòn Fe → Fe²⁺ + 2e⁻)', [-0.7, -0.2, 0]);

        const cuPlate = new THREE.Mesh(
          new THREE.BoxGeometry(2.0, 0.45, 2.0),
          new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.88, roughness: 0.22 })
        );
        cuPlate.position.set(1.05, -0.85, 0);
        registerPart(cuPlate, 'Tạp chất Đồng Cu / C (Cathode khử O₂)', [0.7, -0.2, 0]);

        const znStrip = new THREE.Mesh(
          new THREE.BoxGeometry(0.52, 0.56, 1.7),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 })
        );
        znStrip.position.set(-2.38, -0.8, 0);
        znStrip.visible = false;
        registerPart(znStrip, 'Thanh Kẽm Zn hy sinh (Bảo vệ Catot cho vỏ tàu Fe)', [-0.9, 0, 0]);

        const droplet = new THREE.Mesh(
          new THREE.SphereGeometry(1.75, 28, 20, 0, Math.PI * 2, 0, Math.PI / 2),
          glassMat(0x38bdf8, 0.34)
        );
        droplet.scale.set(1.2, 0.65, 0.9);
        droplet.position.set(0, -0.62, 0);
        droplet.visible = false;
        registerPart(droplet, 'Giọt dung dịch điện li ẩm hòa tan O₂', [0, 0.7, 0], true);

        const rustMeshes: THREE.Mesh[] = [];
        for (let i = 0; i < 6; i++) {
          const rust = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.18, 0),
            new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.85 })
          );
          rust.position.set(-0.8 + (i % 3) * 0.45, -0.5, (i - 2.5) * 0.25);
          rust.visible = false;
          registerPart(rust, 'Gỉ sắt Fe₂O₃·nH₂O nâu đỏ kết tủa', [-0.4, 0.3, 0]);
          rustMeshes.push(rust);
        }

        addLabel('Thanh bảo vệ Zn (−)', [-2.38, 0.3, 0], 0x94a3b8);
        addLabel('Fe (−) ↔ Cu (+)', [0, 0.65, 0], 0xfdba74);

        let eCool = 0;
        onLiveUpdate = (_, dt, _p, flags) => {
          const wet = Boolean(flags.electrolyteWet);
          const zn = Boolean(flags.znProtected);
          droplet.visible = wet;
          znStrip.visible = zn;
          rustMeshes.forEach((rm) => {
            rm.visible = wet && !zn;
          });
          eCool -= dt;
          if (wet && eCool <= 0) {
            eCool = 0.16;
            if (zn) {
              gpuPool.spawn(-2.3, -0.6, 0, 2.8, 0.2, 0, 0.85, 0.9, 0x34d399);
            } else {
              gpuPool.spawn(-0.9, -0.6, 0, 2.2, 0.15, 0, 0.85, 0.9, 0xfacc15);
            }
          }
        };
        break;
      }

      case 'alkene_addition_3d': {
        accentPoint.color.setHex(0xa855f7);
        const cMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
        const brMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, metalness: 0.2, roughness: 0.35 });
        const bMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.35 });
        const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 22, 22), cMat);
        c1.position.set(-0.75, -0.35, 0);
        registerPart(c1, 'Cacbon nối đôi C1 (sp²)', [-0.5, -0.2, 0]);
        const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 22, 22), cMat);
        c2.position.set(0.75, -0.35, 0);
        registerPart(c2, 'Cacbon nối đôi C2 (sp²)', [0.5, -0.2, 0]);
        addBondCylinder(root, c1.position, c2.position, 0.08, bMat);

        const piCloudMat = new THREE.MeshPhysicalMaterial({ color: 0xa855f7, transparent: true, opacity: 0.45, roughness: 0.2 });
        const piCloud = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 1.3, 12, 20), piCloudMat);
        piCloud.rotation.z = Math.PI / 2;
        piCloud.position.set(0, -0.35, 0);
        registerPart(piCloud, 'Đám mây liên kết π (Tác nhân AE tấn công)', [0, 0.4, 0], true);

        const br1 = new THREE.Mesh(new THREE.SphereGeometry(0.36, 22, 22), brMat);
        br1.position.set(-0.42, 1.2, 0);
        registerPart(br1, 'Nguyên tử Brδ⁺ tấn công liên kết π', [-0.3, 0.8, 0]);
        const br2 = new THREE.Mesh(new THREE.SphereGeometry(0.36, 22, 22), brMat);
        br2.position.set(0.42, 1.2, 0);
        registerPart(br2, 'Nguyên tử Brδ⁻ cộng vào C2 làm mất màu Brom', [0.3, 0.8, 0]);

        const bromBeaker = new THREE.Mesh(createBeakerLathe(0.68, 1.15), glassMat(0xe0f2fe, 0.28));
        bromBeaker.position.set(0, -1.95, 0);
        registerPart(bromBeaker, 'Cốc thử nước Brom (Br₂ nâu đỏ)', [0, -0.6, 0], true);

        const bromSolMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, transparent: true, opacity: 0.72, roughness: 0.15 });
        const bromSol = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.65, 24), bromSolMat);
        bromSol.position.set(0, -1.58, 0);
        registerPart(bromSol, 'Màu dung dịch Brom', [0, -0.5, 0]);

        addLabel('Cộng Ái điện tử (C₂H₄ + Br₂)', [0, 2.0, 0], 0xe9d5ff);
        dynamicSpinners.push(root);

        const redCol = new THREE.Color(0xb91c1c);
        const clearCol = new THREE.Color(0xe0f2fe);
        onLiveUpdate = (_, dt, _p, flags) => {
          const bub = Boolean(flags.gasBubbled) && Boolean(flags.bromAdded);
          br1.position.x = THREE.MathUtils.damp(br1.position.x, bub ? -0.75 : -0.42, 6, dt);
          br1.position.y = THREE.MathUtils.damp(br1.position.y, bub ? 0.55 : 1.2, 6, dt);
          br2.position.x = THREE.MathUtils.damp(br2.position.x, bub ? 0.75 : 0.42, 6, dt);
          br2.position.y = THREE.MathUtils.damp(br2.position.y, bub ? -1.15 : 1.2, 6, dt);
          piCloudMat.opacity = THREE.MathUtils.damp(piCloudMat.opacity, bub ? 0.08 : 0.45, 6, dt);
          bromSolMat.color.lerp(bub ? clearCol : redCol, 0.08);
          bromSolMat.opacity = THREE.MathUtils.damp(bromSolMat.opacity, bub ? 0.25 : 0.72, 6, dt);
        };
        break;
      }

      case 'spectroscopy_prism_3d': {
        accentPoint.color.setHex(0xfde047);
        const prism = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 1.3, 3), glassMat(0xe0f2fe, 0.45));
        registerPart(prism, 'Lăng kính tán sắc quang phổ', [0, 0.6, 0], true);

        const burner = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.28, 0.9, 16),
          new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7 })
        );
        burner.position.set(-2.55, -0.75, 0);
        registerPart(burner, 'Đèn Bunsen đốt mẫu muối', [-0.8, -0.3, 0]);

        const flameMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.85 });
        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.65, 16), flameMat);
        flame.position.set(-2.55, -0.02, 0);
        flame.visible = false;
        registerPart(flame, 'Ngọn lửa màu đặc trưng của ion', [-0.8, 0.1, 0]);

        const inBeamMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
        const inBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 2.0, 12), inBeamMat);
        inBeam.rotation.z = Math.PI / 2;
        inBeam.position.set(-1.6, 0, 0);
        inBeam.visible = false;
        registerPart(inBeam, 'Chùm sáng phát xạ tới lăng kính', [-0.7, 0, 0]);

        const rays: THREE.Mesh[] = [];
        [0x8b5cf6, 0x3b82f6, 0x10b981, 0xfacc15, 0xef4444].forEach((col, i) => {
          const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 10), new THREE.MeshBasicMaterial({ color: col }));
          ray.rotation.z = Math.PI / 2 - (i - 2) * 0.14;
          ray.position.set(1.7, (i - 2) * 0.32, 0);
          ray.visible = false;
          registerPart(ray, `Vạch phát xạ đơn sắc #${i + 1}`, [0.6, (i - 2) * 0.25, 0]);
          rays.push(ray);
        });
        addLabel('Quang phổ vạch phát xạ (Na⁺ / K⁺ / Ca²⁺ / Ba²⁺)', [0, 1.55, 0], 0xfef08a);

        const ionColors = [0xfacc15, 0xfacc15, 0xc084fc, 0xf97316, 0xa3e635];
        onLiveUpdate = (t, _dt, params, flags) => {
          const on = Boolean(flags.burnerOn);
          const ion = Math.round(params.ionType ?? 1);
          const hex = ionColors[ion] || 0xfacc15;
          flame.visible = on;
          inBeam.visible = on;
          flameMat.color.setHex(hex);
          inBeamMat.color.setHex(hex);
          if (on) {
            flame.scale.set(1, 0.9 + Math.sin(t * 14) * 0.12, 1);
          }
          rays.forEach((r) => {
            r.visible = on;
          });
        };
        break;
      }

      case 'colloid_micelle_3d': {
        const core = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 24), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.55 }));
        registerPart(core, 'Nhân giọt dầu kị nước', [0, 0, 0]);
        const headMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.25 });
        const tailMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.45 });
        const amphiphiles: { head: THREE.Mesh; unitDir: THREE.Vector3 }[] = [];
        const nMol = 22;
        for (let i = 0; i < nMol; i++) {
          const phi = Math.acos(1 - (2 * (i + 0.5)) / nMol);
          const theta = Math.PI * (1 + Math.sqrt(5)) * i;
          const nx = Math.sin(phi) * Math.cos(theta);
          const ny = Math.cos(phi);
          const nz = Math.sin(phi) * Math.sin(theta);
          const unitDir = new THREE.Vector3(nx, ny, nz);
          const headPos = unitDir.clone().multiplyScalar(1.75);
          const tailStart = unitDir.clone().multiplyScalar(0.9);
          const hSphere = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 14), headMat);
          hSphere.position.copy(headPos);
          registerPart(hSphere, 'Đầu ưa nước (-COO⁻Na⁺)', [nx * 0.7, ny * 0.7, nz * 0.7]);
          addBondCylinder(root, tailStart, headPos, 0.045, tailMat);
          amphiphiles.push({ head: hSphere, unitDir });
        }
        addLabel('Cấu trúc hạt Mixen nhũ tương hóa dầu mỡ', [0, 2.3, 0], 0x6ee7b7);
        dynamicSpinners.push(root);

        onLiveUpdate = (t, dt, params, flags) => {
          const ready = (params.soapConc ?? 0) >= 2 && Boolean(flags.stirred);
          const targetR = ready ? 1.75 : 2.95;
          amphiphiles.forEach((a, idx) => {
            const wobble = ready ? 0 : Math.sin(t * 2.5 + idx) * 0.15;
            const r = targetR + wobble;
            a.head.position.x = THREE.MathUtils.damp(a.head.position.x, a.unitDir.x * r, 6, dt);
            a.head.position.y = THREE.MathUtils.damp(a.head.position.y, a.unitDir.y * r, 6, dt);
            a.head.position.z = THREE.MathUtils.damp(a.head.position.z, a.unitDir.z * r, 6, dt);
          });
        };
        break;
      }

      case 'atomic_orbitals_3d': {
        const nucleus = new THREE.Mesh(
          new THREE.SphereGeometry(0.28, 24, 24),
          new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            emissive: 0xd97706,
            emissiveIntensity: isUltra ? 0.6 : 0.35,
            metalness: 0.55,
            roughness: 0.22
          })
        );
        registerPart(nucleus, 'Hạt nhân nguyên tử (+Z)', [0, 0, 0]);
        const lobeTop = new THREE.Mesh(
          new THREE.SphereGeometry(0.9, 32, 24),
          new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.72, roughness: 0.2, clearcoat: 0.8 })
        );
        lobeTop.scale.set(0.76, 1.45, 0.76);
        lobeTop.position.set(0, 1.15, 0);
        registerPart(lobeTop, 'Thùy Orbital +ψ (2p_z / d_z²)', [0, 0.8, 0], true);
        const lobeBot = new THREE.Mesh(
          new THREE.SphereGeometry(0.9, 32, 24),
          new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.72, roughness: 0.2, clearcoat: 0.8 })
        );
        lobeBot.scale.set(0.76, 1.45, 0.76);
        lobeBot.position.set(0, -1.15, 0);
        registerPart(lobeBot, 'Thùy Orbital −ψ (2p_z / d_z²)', [0, -0.8, 0], true);
        const nodal = new THREE.Mesh(
          new THREE.RingGeometry(0.35, 1.9, 48),
          new THREE.MeshBasicMaterial({ color: 0x94a3b8, side: THREE.DoubleSide, transparent: true, opacity: 0.25 })
        );
        nodal.rotation.x = Math.PI / 2;
        registerPart(nodal, 'Mặt phẳng nút (ψ = 0)', [0, 0, 0.7]);
        const torusOrb = new THREE.Mesh(
          new THREE.TorusGeometry(1.15, 0.14, 16, 48),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.3 })
        );
        torusOrb.rotation.x = Math.PI / 2;
        registerPart(torusOrb, 'Vòng xuyến phân lớp d_{z²}', [0.8, 0, 0]);
        addLabel('Hạt nhân (+Z)', [-2.15, 0.22, 0.15], 0xfde047, [0, 0, 0]);
        addLabel('Thùy +ψ', [2.05, 1.45, 0], 0x7dd3fc, [0, 1.05, 0]);
        addLabel('Thùy −ψ', [2.05, -1.35, 0], 0xfda4af, [0, -1.05, 0]);
        customEmit = (t, _dt, params, flags) => {
          const spd = flags.excited ? 8.2 : 5.0;
          const rad = 0.5 + (params.quantumN ?? 2) * 0.22;
          const ang = t * spd;
          gpuPool.spawn(Math.cos(ang) * rad, Math.sin(t * 3.1) * 1.6, Math.sin(ang) * rad, 0, 0.15, 0, 0.45, 0.9, flags.excited ? 0xfacc15 : 0x38bdf8);
        };
        onLiveUpdate = (t, _dt, params, flags) => {
          const nScale = 0.72 + ((params.quantumN ?? 2) - 1) * 0.18 + (flags.excited ? 0.15 : 0);
          lobeTop.scale.set(0.76 * nScale, 1.45 * nScale, 0.76 * nScale);
          lobeBot.scale.set(0.76 * nScale, 1.45 * nScale, 0.76 * nScale);
          torusOrb.visible = (params.quantumN ?? 2) >= 3;
          torusOrb.rotation.z = Math.sin(t) * 0.08;
        };
        break;
      }

      case 'vsepr_geometry_3d':
      case 'coordination_complex_3d': {
        const isComplex = mode === 'coordination_complex_3d';
        accentPoint.color.setHex(isComplex ? 0x0ea5e9 : 0x818cf8);
        const center = new THREE.Mesh(
          new THREE.SphereGeometry(0.48, 28, 28),
          new THREE.MeshStandardMaterial({
            color: isComplex ? 0x0284c7 : 0x6366f1,
            emissive: isComplex ? 0x0369a1 : 0x312e81,
            emissiveIntensity: 0.35,
            metalness: 0.6,
            roughness: 0.2
          })
        );
        registerPart(center, isComplex ? 'Ion trung tâm Cu²⁺' : 'Nguyên tử trung tâm lai hóa sp³', [0, 0, 0]);
        const bondMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.45, roughness: 0.35 });
        const dirs: [number, number, number][] = isComplex
          ? [[1.65, 0, 0], [-1.65, 0, 0], [0, 1.75, 0], [0, -1.75, 0], [0, 0, 1.65], [0, 0, -1.65]]
          : [[0, 1.6, 0], [1.5, -0.53, 0], [-0.75, -0.53, 1.3], [-0.75, -0.53, -1.3]];
        const eqLigMats: THREE.MeshStandardMaterial[] = [];
        dirs.forEach((d, idx) => {
          const v = new THREE.Vector3(...d);
          const lMat = new THREE.MeshStandardMaterial({
            color: isComplex && idx >= 2 && idx <= 3 ? 0xef4444 : idx % 2 === 0 ? 0x10b981 : 0x38bdf8,
            roughness: 0.28
          });
          if (isComplex && !(idx >= 2 && idx <= 3)) eqLigMats.push(lMat);
          const lig = new THREE.Mesh(new THREE.SphereGeometry(0.28, 22, 22), lMat);
          lig.position.copy(v);
          registerPart(
            lig,
            isComplex ? (idx >= 2 && idx <= 3 ? 'Phối tử trục H₂O' : `Phối tử xích đạo #${idx + 1}`) : `Liên kết σ #${idx + 1} (109.5°)`,
            [d[0] * 0.45, d[1] * 0.45, d[2] * 0.45]
          );
          addBondCylinder(root, new THREE.Vector3(0, 0, 0), v, 0.065, bondMat);
        });

        const dipoleArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 2.4, 0xfacc15, 0.35, 0.16);
        dipoleArrow.visible = false;
        root.add(dipoleArrow);

        addLabel(isComplex ? '[Cu(NH₃)₄(H₂O)₂]²⁺' : 'Lai hóa sp³ (109,5°)', [0, 2.25, 0], 0xe0e7ff);
        dynamicSpinners.push(root);

        const aquaCol = new THREE.Color(0x38bdf8);
        const nh3Col = new THREE.Color(0x1d4ed8);
        onLiveUpdate = (_, _dt, params, flags) => {
          if (isComplex) {
            const ex = Boolean(flags.nh3Excess) || (params.nh3Conc ?? 0) >= 0.8;
            eqLigMats.forEach((m) => m.color.lerp(ex ? nh3Col : aquaCol, 0.15));
          } else {
            dipoleArrow.visible = Boolean(flags.showDipole);
          }
        };
        break;
      }

      case 'crystal_lattice_3d': {
        const naMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.4, roughness: 0.25 });
        const clMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.25, roughness: 0.3 });
        const latticeIons: { mesh: THREE.Mesh; base: THREE.Vector3; seed: number }[] = [];
        for (let ix = -1; ix <= 1; ix++) {
          for (let iy = -1; iy <= 1; iy++) {
            for (let iz = -1; iz <= 1; iz++) {
              const isNa = (ix + iy + iz + 6) % 2 === 0;
              const ion = new THREE.Mesh(new THREE.SphereGeometry(isNa ? 0.24 : 0.36, 18, 18), isNa ? naMat : clMat);
              ion.position.set(ix * 1.12, iy * 1.12, iz * 1.12);
              registerPart(ion, isNa ? 'Cation Na⁺' : 'Anion Cl⁻', [ix * 0.45, iy * 0.45, iz * 0.45]);
              latticeIons.push({ mesh: ion, base: ion.position.clone(), seed: ix * 3 + iy * 5 + iz * 7 });
            }
          }
        }
        const cageLine = createCrispLine2(
          [[-1.12, -1.12, -1.12], [1.12, -1.12, -1.12], [1.12, 1.12, -1.12], [-1.12, 1.12, -1.12], [-1.12, -1.12, -1.12]],
          { color: 0x38bdf8, linewidth: 2 }
        );
        root.add(cageLine);
        addLabel('Mạng tinh thể lập phương tâm mặt NaCl', [0, 2.0, 0], 0x6ee7b7);
        onLiveUpdate = (t, _dt, params, flags) => {
          const free = Boolean(flags.dissolved) || (params.tempC ?? 25) >= 801;
          const amp = free ? 0.48 : 0.04;
          const s = params.ionScale ?? 1.0;
          latticeIons.forEach((it) => {
            it.mesh.scale.setScalar(s);
            if (explodeRef.current < 5) {
              it.mesh.position.x = it.base.x + Math.sin(t * 3.5 + it.seed) * amp;
              it.mesh.position.y = it.base.y + Math.cos(t * 4.1 + it.seed) * amp;
              it.mesh.position.z = it.base.z + Math.sin(t * 2.9 - it.seed) * amp;
            }
          });
        };
        break;
      }

      case 'activation_surface_3d': {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 28; i++) {
          const u = i / 28;
          pts.push(new THREE.Vector3((u - 0.5) * 4.8, Math.sin(u * Math.PI) * 1.8 - u * 0.75 - 0.35, 0));
        }
        const pathTube = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.16, 12, false),
          new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3, metalness: 0.2 })
        );
        registerPart(pathTube, 'Đường phản ứng không xúc tác (Ea cao)', [0, 0.6, 0]);

        const catPts = pts.map((p, i) => new THREE.Vector3(p.x, p.y - Math.sin((i / 28) * Math.PI) * 0.68, 0.65));
        const catTube = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(catPts), 48, 0.14, 12, false),
          new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.35, roughness: 0.3 })
        );
        registerPart(catTube, 'Đường phản ứng CÓ Xúc tác (Hạ Ea)', [0, -0.6, 0.5]);

        const stateSphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.24, 20, 20),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.5 })
        );
        stateSphere.position.copy(pts[0]);
        root.add(stateSphere);
        animatedParticles.push({ mesh: stateSphere, phase: 0, basePos: pts[0].clone() });
        addLabel('Ea (Không xúc tác)', [-1.95, 1.65, 0], 0xfda4af, [0, 1.15, 0]);
        addLabel('Ea (Có xúc tác)', [2.05, 0.72, 0.3], 0x6ee7b7, [0.15, 0.35, 0.2]);
        onLiveUpdate = (_, _dt, _p, flags) => {
          catTube.visible = Boolean(flags.catalystOn);
        };
        break;
      }

      case 'equilibrium_piston_3d': {
        const gasMat = new THREE.MeshPhysicalMaterial({ color: 0xf97316, transparent: true, opacity: 0.35, roughness: 0.15, depthWrite: false });
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3.0, 28, 1, true), gasMat);
        registerPart(cyl, 'Xi-lanh chứa N₂O₄ ⇌ 2NO₂', [0, 0, 0.8], true);
        const piston = new THREE.Mesh(
          new THREE.CylinderGeometry(1.16, 1.16, 0.22, 24),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 })
        );
        piston.position.set(0, 0.9, 0);
        registerPart(piston, 'Đầu pít-tông nén áp suất P', [0, 0.8, 0]);
        for (let i = 0; i < 12; i++) {
          const mol = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 14, 14),
            new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xef4444 : 0x38bdf8, roughness: 0.3 })
          );
          mol.position.set(Math.sin(i * 1.7) * 0.7, -0.6 + (i % 4) * 0.32, Math.cos(i * 2.1) * 0.7);
          root.add(mol);
          animatedParticles.push({ mesh: mol, phase: i / 12, basePos: mol.position.clone() });
        }
        addLabel('N₂O₄ (không màu) ⇌ 2NO₂ (nâu đỏ)', [0, 1.75, 0], 0xfdba74);
        onLiveUpdate = (_, dt, params, flags) => {
          const pr = flags.compressed ? Math.max(2.5, params.pressureAtm ?? 2.5) : params.pressureAtm ?? 1.0;
          const targetY = Math.max(-0.4, Math.min(1.25, 1.35 - pr * 0.42));
          piston.position.y = THREE.MathUtils.damp(piston.position.y, targetY, 8, dt);
          const hot = (params.tempC ?? 25) > 45;
          gasMat.opacity = THREE.MathUtils.damp(gasMat.opacity, hot ? 0.56 : pr > 1.8 ? 0.16 : 0.34, 6, dt);
        };
        break;
      }

      case 'benzene_pi_3d': {
        const cMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.3, roughness: 0.4 });
        const hMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
        const bondMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.4 });
        const cPts: THREE.Vector3[] = [];
        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          const pos = new THREE.Vector3(Math.cos(ang) * 1.4, 0, Math.sin(ang) * 1.4);
          cPts.push(pos);
          const c = new THREE.Mesh(new THREE.SphereGeometry(0.28, 22, 22), cMat);
          c.position.copy(pos);
          registerPart(c, `Cacbon sp² C${i + 1}`, [Math.cos(ang) * 0.6, 0, Math.sin(ang) * 0.6]);
          const hPos = new THREE.Vector3(Math.cos(ang) * 2.35, 0, Math.sin(ang) * 2.35);
          const hAtom = new THREE.Mesh(
            new THREE.SphereGeometry(i === 0 ? 0.24 : 0.16, 16, 16),
            i === 0 ? new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }) : hMat
          );
          hAtom.position.copy(hPos);
          registerPart(hAtom, i === 0 ? 'Vị trí thế H1 / Br' : `Hydro H${i + 1}`, [Math.cos(ang) * 0.9, 0, Math.sin(ang) * 0.9]);
          addBondCylinder(root, pos, hPos, 0.05, bondMat);
          if (i === 0) {
            onLiveUpdate = () => {
              const fe = Boolean(expFlagsRef.current.feBr3Added);
              (hAtom.material as THREE.MeshStandardMaterial).color.setHex(fe ? 0xb91c1c : 0xf8fafc);
            };
          }
        }
        for (let i = 0; i < 6; i++) addBondCylinder(root, cPts[i], cPts[(i + 1) % 6], 0.08, bondMat);
        const piTop = new THREE.Mesh(
          new THREE.TorusGeometry(1.4, 0.14, 18, 48),
          new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0284c7, emissiveIntensity: 0.4, transparent: true, opacity: 0.72 })
        );
        piTop.rotation.x = Math.PI / 2;
        piTop.position.y = 0.55;
        registerPart(piTop, 'Đám mây π liên hợp trên', [0, 0.8, 0]);
        const piBot = piTop.clone();
        piBot.position.y = -0.55;
        registerPart(piBot, 'Đám mây π liên hợp dưới', [0, -0.8, 0]);
        addLabel('Hệ vòng thơm 6π liên hợp (C₆H₆)', [0, 1.35, 0], 0x7dd3fc);
        dynamicSpinners.push(root);
        break;
      }

      case 'polymer_chain_3d': {
        const pts: THREE.Vector3[] = [];
        const cMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.35, roughness: 0.3 });
        const bMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4 });
        const sLinks: THREE.Mesh[] = [];
        for (let i = 0; i < 12; i++) {
          const p = new THREE.Vector3(-2.6 + i * 0.48, Math.sin(i * 0.9) * 0.65, Math.cos(i * 0.9) * 0.65);
          pts.push(p);
          const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), cMat);
          m.position.copy(p);
          registerPart(m, `Mắt xích Polime (-CH₂-CHX-) #${i + 1}`, [0, Math.sin(i) * 0.4, Math.cos(i) * 0.4]);
          if (i > 0) addBondCylinder(root, pts[i - 1], p, 0.06, bMat);
          if (i % 3 === 1 && i < 10) {
            const bridge = new THREE.Mesh(
              new THREE.CylinderGeometry(0.055, 0.055, 1.25, 10),
              new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.4 })
            );
            bridge.position.set(p.x, p.y - 0.55, p.z);
            bridge.visible = false;
            registerPart(bridge, 'Cầu nối lưu huỳnh -S-S- (Lưu hóa)', [0, -0.5, 0]);
            sLinks.push(bridge);
          }
        }
        addLabel('Mạch đại phân tử Polime (-CH₂-CHX-)ₙ', [0, 1.35, 0], 0x7dd3fc);
        dynamicSpinners.push(root);
        onLiveUpdate = (_, _dt, _p, flags) => {
          sLinks.forEach((b) => {
            b.visible = Boolean(flags.vulcanized);
          });
        };
        break;
      }

      case 'methane_ethane_3d': {
        const cMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.35, roughness: 0.35 });
        const hMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
        const bondMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.35 });
        const c1Pos = new THREE.Vector3(-0.78, 0, 0);
        const c2Pos = new THREE.Vector3(0.78, 0, 0);
        const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), cMat);
        c1.position.copy(c1Pos);
        registerPart(c1, 'Nguyên tử C1 (lai hóa sp²)', [-0.5, 0, 0]);
        const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), cMat);
        c2.position.copy(c2Pos);
        registerPart(c2, 'Nguyên tử C2 (liên kết đôi C=C)', [0.5, 0, 0]);
        addBondCylinder(root, new THREE.Vector3(-0.78, 0.09, 0), new THREE.Vector3(0.78, 0.09, 0), 0.06, bondMat);
        const piBond = addBondCylinder(root, new THREE.Vector3(-0.78, -0.09, 0), new THREE.Vector3(0.78, -0.09, 0), 0.06, new THREE.MeshStandardMaterial({ color: 0xa855f7 }));
        [[-1.65, 0.9, 0], [-1.65, -0.9, 0], [1.65, 0.9, 0], [1.65, -0.9, 0]].forEach((hp, i) => {
          const p = new THREE.Vector3(...hp);
          const h = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), hMat);
          h.position.copy(p);
          registerPart(h, `Nguyên tử Hydro H${i + 1}`, [hp[0] * 0.35, hp[1] * 0.35, 0]);
          addBondCylinder(root, i < 2 ? c1Pos : c2Pos, p, 0.05, bondMat);
        });
        addLabel('Etilen C₂H₄ (Góc 120° phẳng)', [0, 1.45, 0], 0xe2e8f0);
        dynamicSpinners.push(root);
        onLiveUpdate = (_, _dt, _p, flags) => {
          if (piBond) piBond.visible = !flags.piOpened;
        };
        break;
      }

      case 'periodic_tower_3d': {
        const cols = [0xef4444, 0xf97316, 0xfacc15, 0x10b981, 0x0ea5e9, 0x6366f1, 0xa855f7, 0x64748b];
        const bars: { mesh: THREE.Mesh; enVal: number; rVal: number; p: number }[] = [];
        for (let g = 0; g < 8; g++) {
          for (let p = 0; p < 3; p++) {
            const enVal = g === 7 ? 0.25 : 0.4 + g * 0.38 - p * 0.08;
            const rVal = 2.6 - g * 0.25 + p * 0.32;
            const colMesh = new THREE.Mesh(
              new THREE.BoxGeometry(0.45, 1, 0.45),
              new THREE.MeshStandardMaterial({ color: cols[g], roughness: 0.32, metalness: 0.25 })
            );
            colMesh.position.set(-1.9 + g * 0.54, -1.6 + enVal * 0.5, -0.6 + p * 0.6);
            registerPart(colMesh, `Nhóm ${g + 1}A · Chu kì ${p + 2}`, [0, 0.45, 0]);
            bars.push({ mesh: colMesh, enVal: Math.max(0.25, enVal), rVal: Math.max(0.3, rVal), p: p + 2 });
          }
        }
        addLabel('Biến thiên Tuần hoàn (Nhóm IA → VIIA)', [0, 1.85, 0], 0x7dd3fc);
        onLiveUpdate = (_, dt, params, flags) => {
          const isR = Boolean(flags.showRadius);
          const ck = Math.round(params.periodHighlight ?? 3);
          bars.forEach((b) => {
            const h = isR ? b.rVal : b.enVal;
            b.mesh.scale.y = THREE.MathUtils.damp(b.mesh.scale.y, h, 8, dt);
            b.mesh.position.y = -1.6 + b.mesh.scale.y * 0.5;
            const mat = b.mesh.material as THREE.MeshStandardMaterial;
            mat.emissive.setHex(b.p === ck ? 0x0ea5e9 : 0x000000);
            mat.emissiveIntensity = b.p === ck ? 0.32 : 0;
          });
        };
        break;
      }

      case 'carbohydrate_ring_3d': {
        accentPoint.color.setHex(0x10b981);
        const cMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.35, roughness: 0.3 });
        const oMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.25, roughness: 0.25 });
        const hMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
        const bMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.35 });

        const ringPts: THREE.Vector3[] = [];
        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          const chairY = i % 2 === 0 ? 0.16 : -0.16;
          const pos = new THREE.Vector3(Math.cos(ang) * 1.35, chairY, Math.sin(ang) * 1.35);
          ringPts.push(pos);
          const isO = i === 0;
          const atom = new THREE.Mesh(new THREE.SphereGeometry(isO ? 0.31 : 0.28, 22, 22), isO ? oMat : cMat);
          atom.position.copy(pos);
          registerPart(
            atom,
            isO ? 'Oxi dị vòng Pyranose (-O-)' : i === 1 ? 'Cacbon Anomer C1 (-OH α/β)' : `Cacbon vòng C${i}`,
            [Math.cos(ang) * 0.6, chairY * 0.5, Math.sin(ang) * 0.6]
          );
          if (!isO) {
            const ohPos = new THREE.Vector3(Math.cos(ang) * 2.25, chairY + (i === 1 ? -0.45 : 0.35), Math.sin(ang) * 2.25);
            const oh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), i === 5 ? cMat : oMat);
            oh.position.copy(ohPos);
            registerPart(oh, i === 5 ? 'Nhánh -CH₂OH (C6)' : `Nhóm -OH tại C${i}`, [Math.cos(ang) * 0.9, 0.3, Math.sin(ang) * 0.9]);
            addBondCylinder(root, pos, ohPos, 0.055, bMat);
            const hTip = ohPos.clone().add(new THREE.Vector3(Math.cos(ang) * 0.45, 0.25, Math.sin(ang) * 0.45));
            const hAtom = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), hMat);
            hAtom.position.copy(hTip);
            registerPart(hAtom, 'Hydro nhóm -OH', [Math.cos(ang) * 1.0, 0.4, Math.sin(ang) * 1.0]);
            addBondCylinder(root, ohPos, hTip, 0.04, bMat);
          }
        }
        for (let i = 0; i < 6; i++) addBondCylinder(root, ringPts[i], ringPts[(i + 1) % 6], 0.08, bMat);

        const complexHaloMat = new THREE.MeshPhysicalMaterial({ color: 0x2563eb, transparent: true, opacity: 0.0, roughness: 0.2, depthWrite: false });
        const complexHalo = new THREE.Mesh(new THREE.SphereGeometry(2.65, 24, 18), complexHaloMat);
        registerPart(complexHalo, 'Phức đồng xanh lam / Tủa Cu₂O đỏ gạch', [0, 0, 0], true);

        addLabel('Vòng α/β-D-Glucozơ (Pyranose 6 cạnh)', [0, 1.55, 0], 0x6ee7b7);
        dynamicSpinners.push(root);
        const blueCol = new THREE.Color(0x2563eb);
        const brickCol = new THREE.Color(0xdc2626);
        onLiveUpdate = (_, dt, params, flags) => {
          const added = Boolean(flags.cuoh2Added);
          const hot = (params.tempC ?? 25) >= 65;
          complexHaloMat.opacity = THREE.MathUtils.damp(complexHaloMat.opacity, added ? 0.26 : 0, 5, dt);
          complexHaloMat.color.lerp(hot ? brickCol : blueCol, 0.1);
        };
        break;
      }

      case 'haber_contact_reactor_3d': {
        accentPoint.color.setHex(0xf97316);
        const towerShell = new THREE.Mesh(
          new THREE.CylinderGeometry(1.45, 1.45, 3.6, 28, 1, true),
          glassMat(0x94a3b8, 0.28)
        );
        registerPart(towerShell, 'Tháp tổng hợp cao áp (Fe / V₂O₅ · 450°C)', [0, 0, 0.9], true);
        const bedMats: THREE.MeshStandardMaterial[] = [];
        [-0.85, 0.05, 0.95].forEach((y, idx) => {
          const bMat = new THREE.MeshStandardMaterial({
            color: idx === 1 ? 0xf59e0b : 0x64748b,
            emissive: 0xb45309,
            emissiveIntensity: 0.15,
            metalness: 0.65,
            roughness: 0.35
          });
          bedMats.push(bMat);
          const bed = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.26, 24), bMat);
          bed.position.y = y;
          registerPart(bed, `Tầng xúc tác rắn #${idx + 1} (Fe / V₂O₅)`, [0, idx * 0.45, 0]);
        });
        const coil = new THREE.Mesh(
          new THREE.TorusGeometry(0.75, 0.09, 12, 36),
          new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.4, metalness: 0.7 })
        );
        coil.rotation.x = Math.PI / 2;
        coil.position.y = -1.45;
        registerPart(coil, 'Bộ trao đổi nhiệt thu hồi năng lượng', [0, -0.7, 0]);
        addLabel('Tháp Xúc tác Haber / Tiếp xúc', [0, 2.2, 0], 0xfdba74);
        let gasCool = 0;
        onLiveUpdate = (_, dt, _p, flags) => {
          const on = Boolean(flags.reactorActive);
          bedMats.forEach((m) => {
            m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, on ? 0.65 : 0.08, 6, dt);
          });
          gasCool -= dt;
          if (on && gasCool <= 0) {
            gasCool = 0.12;
            gpuPool.spawn((Math.random() - 0.5) * 1.4, 1.6, (Math.random() - 0.5) * 1.4, 0, -1.9, 0, 1.0, 1.0, 0x38bdf8);
          }
        };
        break;
      }

      case 'matter_states_3d':
      case 'separation_lab_3d':
      case 'ionic_covalent_3d':
      case 'indicator_bench_3d':
      case 'combustion_reactor_3d':
      case 'mass_balance_3d':
      case 'solution_mixing_3d': {
        onLiveUpdate = buildMiddleSchool3DChemScene({
          mode,
          root,
          accentPoint,
          gpuPool,
          dynamicSpinners,
          registerPart,
          addLabel,
          glassMat
        });
        break;
      }

      default: {
        // amino_peptide_3d
        accentPoint.color.setHex(0x8b5cf6);
        const nMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.25 });
        const cMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
        const oMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.25 });
        const bMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.35 });
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i < 7; i++) {
          const x = -2.2 + i * 0.72;
          const y = i % 2 === 0 ? 0.35 : -0.35;
          pts.push(new THREE.Vector3(x, y, 0));
          const isN = i % 3 === 0;
          const atom = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 18), isN ? nMat : cMat);
          atom.position.set(x, y, 0);
          registerPart(atom, isN ? 'Nhóm Nitơ -NH- liên kết Peptide' : 'Nguyên tử Cacbon mạch chính', [0, y * 0.6, 0]);
          if (i % 3 === 1) {
            const ox = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), oMat);
            ox.position.set(x, y + 0.88, 0);
            registerPart(ox, 'Oxi nhóm cacbonyl C=O', [0, 0.7, 0]);
            addBondCylinder(root, pts[i], ox.position, 0.055, bMat);
          }
          if (i > 0) addBondCylinder(root, pts[i - 1], pts[i], 0.075, bMat);
        }
        const biuretHaloMat = new THREE.MeshPhysicalMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.0, depthWrite: false });
        const biuretHalo = new THREE.Mesh(new THREE.CapsuleGeometry(1.1, 3.8, 12, 20), biuretHaloMat);
        biuretHalo.rotation.z = Math.PI / 2;
        registerPart(biuretHalo, 'Phức màu Tím Biuret (≥ 2 LK peptide)', [0, 0, 0.8], true);
        addLabel('Chuỗi Tripeptide (-CO-NH-) + Thuốc thử Biuret', [0, 1.75, 0], 0xd8b4fe);
        dynamicSpinners.push(root);
        onLiveUpdate = (_, dt, _p, flags) => {
          biuretHaloMat.opacity = THREE.MathUtils.damp(biuretHaloMat.opacity, flags.biuretAdded ? 0.34 : 0.0, 6, dt);
        };
        break;
      }
    }

    const floorDrag = attachThreeFloorDrag({
      domElement: renderer.domElement,
      camera,
      controls,
      scene,
      modelGroup: root,
      apparatusGroup,
      floorY: -2.1,
      maxRadius: 4.9,
      accentColor: 0x10b981,
      onPartClick: (hitObj) => {
        const lbl = hitObj.userData?.partLabel || '';
        if (lbl) setSelectedPart(lbl);
      },
      onApparatusMoved: (uid, lx, lz) => {
        const nextX = Math.max(4, Math.min(96, Number((((lx / 8.4) * 100) + 50).toFixed(1))));
        const nextY = Math.max(4, Math.min(96, Number((((lz / 6.8) * 100) + 50).toFixed(1))));
        setPlacedTools((prev) => prev.map((t) => (t.uid === uid ? { ...t, xPct: nextX, yPct: nextY } : t)));
      },
      onDragStatusChange: ({ moved }) => {
        setFloorModelMoved(moved);
      }
    });
    floorDragRef.current = floorDrag;

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 720;
      const nh = container.clientHeight || 430;
      if (nw <= 0 || nh <= 0) return;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      pipeline?.setSize(nw, nh);
      anaglyphEffect.setSize(nw, nh);
      stereoEffect.setSize(nw, nh);
      syncLine2Resolution(scene, nw, nh);
    };
    window.addEventListener('resize', onResize);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(container);

    let frameId = 0;
    let disposed = false;
    let elapsed = 0;
    let last = performance.now();
    let hudCounter = 0;
    let lastStepTrigger = stepTriggerRef.current;
    let lastHoloMode: HologramDisplayMode = 'normal';
    const appliedHoloOffset = new THREE.Vector3();

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const status = sync && gl.getSyncParameter ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (status === gl.UNSIGNALED) frameId = window.setTimeout(poll, 6);
        else {
          if (sync && gl.deleteSync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 6);
    };

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Graphics-tier-aware incoming studio light sweep animation
      const wallT = now * 0.001;
      if (!isSmooth) {
        rimLight.position.x = -6 + Math.sin(wallT * 0.45) * 1.4;
        rimLight.position.z = -5 + Math.cos(wallT * 0.35) * 1.2;
        accentPoint.intensity = (isUltra ? 1.8 : 1.1) + Math.sin(wallT * 1.3) * (isUltra ? 0.32 : 0.14);
        if (isUltra) {
          keyLight.position.x = 6 + Math.sin(wallT * 0.38) * 1.6;
          keyLight.position.z = 6 + Math.cos(wallT * 0.32) * 1.1;
          (rimRing.material as THREE.MeshBasicMaterial).opacity = 0.58 + 0.18 * Math.sin(wallT * 1.6);
        }
      }

      const stepped = lastStepTrigger !== stepTriggerRef.current;
      if (!pausedRef.current || stepped) {
        lastStepTrigger = stepTriggerRef.current;
        const effDt = !pausedRef.current ? dt * speedRef.current : 0.05;
        elapsed += effDt;
        simTimeRef.current = elapsed;
        dynamicSpinners.forEach((sp) => {
          sp.rotation.y += effDt * 0.42;
        });
        animatedParticles.forEach((p, idx) => {
          p.mesh.position.y = p.basePos.y + Math.sin(elapsed * 2.2 + idx) * 0.42;
        });
        onLiveUpdate?.(elapsed, effDt, modeParamsRef.current, expFlagsRef.current);
        customEmit?.(elapsed, effDt, modeParamsRef.current, expFlagsRef.current);
        gpuPool.update(effDt, 0);
        apparatusTickRef.current?.();
      }

      hudCounter++;
      if (hudCounter % 14 === 0 && placedToolsRef.current.length > 0) {
        setSimClock(elapsed);
      }

      grid.visible = showGridRef.current;
      labelGroup.visible = showLabelsRef.current;
      if (showLabelsRef.current) {
        updateBillboardLabels(labelGroup, camera);
      }

      const ex = explodeRef.current / 100;
      partsWithHome.forEach((p) => {
        const tx = p.home.x + p.dir.x * ex * 1.4;
        const ty = p.home.y + p.dir.y * ex * 1.4;
        const tz = p.home.z + p.dir.z * ex * 1.4;
        p.mesh.position.x = THREE.MathUtils.damp(p.mesh.position.x, tx, 8, dt);
        p.mesh.position.y = THREE.MathUtils.damp(p.mesh.position.y, ty, 8, dt);
        p.mesh.position.z = THREE.MathUtils.damp(p.mesh.position.z, tz, 8, dt);
      });
      shellMeshes.forEach((sm) => {
        const mat = sm.material as THREE.Material;
        const baseOp = typeof sm.userData.origOpacity === 'number' ? sm.userData.origOpacity : 0.35;
        mat.opacity = xrayRef.current ? Math.min(0.14, baseOp * 0.4) : baseOp;
      });

      if (appliedHoloOffset.lengthSq() > 0) {
        camera.position.sub(appliedHoloOffset);
      }
      if (cameraLerpRef.current) {
        camera.position.lerp(cameraLerpRef.current.pos, 0.14);
        controls.target.lerp(cameraLerpRef.current.target, 0.14);
        if (
          camera.position.distanceTo(cameraLerpRef.current.pos) < 0.05 &&
          controls.target.distanceTo(cameraLerpRef.current.target) < 0.03
        ) {
          cameraLerpRef.current = null;
        }
      }
      if (autoOrbitRef.current) {
        applySphericalOrbitDelta(camera, controls.target, dt * 0.36, 0, 0, controls.minDistance, controls.maxDistance);
      }
      controls.update();

      const curHolo = hologramModeRef.current;
      if (curHolo === 'head_cam' || curHolo === 'head_mouse') {
        applyOffAxisProjection(camera, headOffsetRef.current, 12, 3.8, controls.target, appliedHoloOffset);
      } else if (lastHoloMode === 'head_cam' || lastHoloMode === 'head_mouse' || appliedHoloOffset.lengthSq() > 0) {
        resetOffAxisProjection(camera, appliedHoloOffset);
      }
      if ((lastHoloMode === 'anaglyph' || lastHoloMode === 'vr_stereo') && curHolo !== lastHoloMode) {
        onResize();
      }
      lastHoloMode = curHolo;

      const distToTarget = Math.max(2.5, camera.position.distanceTo(controls.target));
      if (curHolo === 'anaglyph') {
        anaglyphEffect.planeDistance = distToTarget;
        anaglyphEffect.eyeSep = distToTarget * 0.048;
        anaglyphEffect.render(scene, camera);
      } else if (curHolo === 'vr_stereo') {
        stereoEffect.setEyeSeparation(Math.max(0.05, distToTarget * 0.042));
        stereoEffect.render(scene, camera);
      } else if (pipeline) {
        pipeline.render(dt);
      } else {
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
      controls.removeEventListener('start', cancelCamLerp);
      floorDrag.dispose();
      floorDragRef.current = null;
      disposeObjectTree(root);
      disposeObjectTree(labelGroup);
      apparatusMapRef.current.forEach((inst) => inst.dispose());
      apparatusMapRef.current.clear();
      apparatusGroupRef.current = null;
      apparatusTickRef.current = null;
      anaglyphEffect.dispose();
      gpuPool.dispose();
      pipeline?.dispose();
      controls.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [isSoftwareGl, mode, perfMode, headOffsetRef]);

  // Sync placed physical chemistry apparatus onto the 3D WebGL benchtop
  useEffect(() => {
    const appGroup = apparatusGroupRef.current;
    if (!appGroup) return;
    const map = apparatusMapRef.current;
    const activeUids = new Set(placedTools.map((t) => t.uid));

    for (const [uid, instance] of map.entries()) {
      if (!activeUids.has(uid)) {
        appGroup.remove(instance.group);
        instance.dispose();
        map.delete(uid);
      }
    }

    placedTools.forEach((tool, idx) => {
      let instance = map.get(tool.uid);
      const spec = CHEM_APPARATUS_BY_ID[tool.toolId];
      if (!instance) {
        if (!spec) return;
        instance = createChem3DApparatusModel(tool.toolId, spec);
        instance.group.userData.apparatusUid = tool.uid;
        instance.group.userData.partLabel = spec.viName;
        map.set(tool.uid, instance);
        appGroup.add(instance.group);
      } else {
        instance.group.userData.apparatusUid = tool.uid;
        if (spec) instance.group.userData.partLabel = spec.viName;
      }
      const wx = ((tool.xPct - 50) / 100) * 8.4;
      const wz = ((tool.yPct - 50) / 100) * 6.8 + (Math.abs(wx) < 2.2 ? (idx % 2 === 0 ? 2.5 : -2.5) : 0);
      instance.group.position.set(wx, 0, wz);
      instance.group.rotation.y = (-tool.rotationDeg * Math.PI) / 180;
    });

    apparatusTickRef.current = () => {
      const tNow = simTimeRef.current;
      for (const tool of placedToolsRef.current) {
        const inst = map.get(tool.uid);
        if (!inst) continue;
        const reading = evaluateChemApparatusReading(tool.toolId, mode, probeParams, tNow, tool.xPct, tool.yPct);
        inst.updateLive(reading, tNow, tool.customValue);
      }
    };
    apparatusTickRef.current();
  }, [placedTools, mode, probeParams]);

  const setCameraPreset = (preset: 'overview' | 'front' | 'top' | 'bench') => {
    if (preset === 'overview') {
      cameraLerpRef.current = { pos: new THREE.Vector3(5.4, 3.8, 6.5), target: new THREE.Vector3(0, 0, 0) };
    } else if (preset === 'front') {
      cameraLerpRef.current = { pos: new THREE.Vector3(0, 1.2, 7.6), target: new THREE.Vector3(0, 0, 0) };
    } else if (preset === 'top') {
      cameraLerpRef.current = { pos: new THREE.Vector3(0, 8.6, 0.8), target: new THREE.Vector3(0, 0, 0) };
    } else {
      cameraLerpRef.current = { pos: new THREE.Vector3(2.8, 1.4, 3.8), target: new THREE.Vector3(0, -0.5, 0) };
    }
  };

  const handleLogSample = () => {
    const tVal = simTimeRef.current;
    const instStr =
      placedTools.length > 0
        ? placedTools
            .slice(0, 3)
            .map((tool) => {
              const sp = CHEM_APPARATUS_BY_ID[tool.toolId];
              const rd = evaluateChemApparatusReading(tool.toolId, mode, probeParams, tVal, tool.xPct, tool.yPct);
              return `${sp?.symbol || tool.toolId}=${rd.valueText}`;
            })
            .join('; ')
        : 'Đọc trực tiếp tại bình';
    setLoggedSamples((prev) => [
      ...prev,
      {
        idx: prev.length + 1,
        timeSec: tVal.toFixed(2),
        equation: readout.equationText,
        instruments: instStr
      }
    ]);
  };

  const handleExportCsv = () => {
    if (loggedSamples.length === 0) return;
    const rows = [
      ['STT', 'Thoi gian t (s)', 'Trang thai phan ung', 'Dung cu do 3D'].join(','),
      ...loggedSamples.map((r) =>
        [r.idx, r.timeSec, `"${r.equation.replace(/"/g, '""')}"`, `"${r.instruments.replace(/"/g, '""')}"`].join(',')
      )
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chem-3d-${mode}-samples.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const actionBtnTone = (accent: string | undefined, isOn: boolean) => {
    if (!isOn) return 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200';
    switch (accent) {
      case 'amber':
        return 'bg-amber-600 border-amber-400 text-white';
      case 'sky':
        return 'bg-sky-600 border-sky-400 text-white';
      case 'rose':
        return 'bg-rose-600 border-rose-400 text-white';
      default:
        return 'bg-emerald-600 border-emerald-400 text-white';
    }
  };

  const stageContent = (
    <div
      className={`chem-zone-frame sci-frame relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex flex-col ${
        isFullscreen ? 'flex-1 min-h-0 rounded-xl' : 'rounded-xl'
      }`}
    >
      <div className="chem-energy-sweep" />

      {/* TOP HEADER OVERLAY / STACKED IN EMBEDDED */}
      <div
        className={`relative z-20 p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/95 border-b border-slate-800/80 shrink-0`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {(isFullscreen || onBack) && (
            <button
              type="button"
              onClick={() => (isFullscreen ? setIsFullscreen(false) : onBack?.())}
              className="sim-btn-chem flex items-center gap-1 px-2.5 py-1 rounded-md border border-emerald-400/60 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isFullscreen ? 'Thu nhỏ' : 'Quay lại'}</span>
            </button>
          )}
          {embeddedBadge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-bold uppercase shrink-0">
              {embeddedBadge}
            </span>
          )}
          <FlaskConical className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold text-white truncate">
            {title || cfg.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="sim-btn-chem inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{paused ? (isEn ? 'Resume' : 'Chạy') : isEn ? 'Pause' : 'Tạm dừng'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPaused(true);
              stepTriggerRef.current += 1;
            }}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            title="Tiến 1 bước +0.05s"
          >
            <StepForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>+0.05s</span>
          </button>
          <button
            type="button"
            onClick={() => setShowGrid((g) => !g)}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer shrink-0 ${
              showGrid ? 'bg-sky-600 border-sky-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title={showGrid ? 'Ẩn lưới tọa độ' : 'Hiện lưới tọa độ'}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowLabels((v) => !v)}
            className={`sim-btn-chem inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
              showLabels ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{showLabels ? 'Ẩn nhãn' : 'Nhãn 3D'}</span>
          </button>
          <button
            type="button"
            onClick={() => setXray((v) => !v)}
            className={`sim-btn-chem inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
              xray ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{xray ? 'Hiện vỏ' : 'X-Quang'}</span>
          </button>
          <HologramModeControls mode={hologramMode} onChangeMode={setHologramMode} camStatus={camStatus} compact />
          <button
            type="button"
            onClick={() => setIsFullscreen((f) => !f)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 cursor-pointer shrink-0"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình 3D'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          {onOpenFull3D && !isFullscreen && (
            <button
              type="button"
              onClick={onOpenFull3D}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Lab 3D Đầy đủ</span>
            </button>
          )}
        </div>
      </div>

      {/* WEBGL CANVAS STAGE */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1 min-h-[260px]' : heightClass}`}>
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />
        {selectedPart && (
          <div className="absolute top-3 left-3 z-10 rounded-lg bg-slate-900/95 border border-sky-500/40 px-3 py-1.5 text-xs text-sky-200 font-semibold">
            {isEn ? 'Selected component:' : 'Thành phần đã chọn:'} {selectedPart}
          </div>
        )}
        {floorModelMoved && (
          <button
            type="button"
            onClick={() => floorDragRef.current?.resetPosition()}
            className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-emerald-600 border border-emerald-500/40 text-[11px] font-semibold text-emerald-200 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isEn ? 'Reset floor position' : 'Đặt lại vị trí sàn 3D'}</span>
          </button>
        )}
      </div>

      {/* ERGONOMIC COLLAPSIBLE CONTROL DOCK */}
      <div className="border-t border-slate-800 bg-slate-900/95 px-3 py-2.5 text-xs text-slate-200 space-y-2.5">
        {/* Dock Bar Row: Presets, Camera Views, Telemetry Logger, Auto-Orbit, PNG/Video, Speed, Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-bold text-slate-200 text-xs">Điều Khiển Thí Nghiệm 3D</span>
            <div className="flex flex-wrap items-center gap-1 ml-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {cfg.presets.map((pr) => (
                <button
                  key={pr.label}
                  type="button"
                  title={pr.description}
                  onClick={() => {
                    setModeParams((prev) => ({ ...prev, ...pr.params }));
                    if (pr.flags) setExpFlags((prev) => ({ ...prev, ...pr.flags }));
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 border border-slate-700 text-[10px] font-semibold text-slate-200 hover:text-white cursor-pointer whitespace-nowrap"
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="hidden md:flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded border border-slate-800">
              {(
                [
                  { id: 'overview', label: 'Tổng quan' },
                  { id: 'front', label: 'Mặt trước' },
                  { id: 'top', label: 'Từ trên' },
                  { id: 'bench', label: 'Cận dụng cụ' }
                ] as const
              ).map((camP) => (
                <button
                  key={camP.id}
                  type="button"
                  onClick={() => setCameraPreset(camP.id)}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold text-slate-300 hover:bg-slate-800 hover:text-emerald-300 cursor-pointer whitespace-nowrap"
                >
                  {camP.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleLogSample}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold cursor-pointer whitespace-nowrap"
            >
              <Activity className="w-3 h-3" />
              <span>Ghi mẫu đo</span>
            </button>

            <button
              type="button"
              onClick={() => setAutoOrbit((o) => !o)}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border cursor-pointer whitespace-nowrap ${
                autoOrbit ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <RotateCw className={`w-3 h-3 ${autoOrbit ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Xoay 360°</span>
            </button>

            <button
              type="button"
              onClick={() => captureCanvasPng(canvasRef.current, `chem-3d-${mode}`)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-slate-200 cursor-pointer whitespace-nowrap"
            >
              <Camera className="w-3 h-3 text-sky-400" />
              <span className="hidden sm:inline">PNG</span>
            </button>

            <RecordVideoButton
              isRecording={recorder.isRecording}
              recordSeconds={recorder.recordSeconds}
              onToggle={recorder.toggleRecording}
              supported={recorder.supported}
              compact
              isEn={isEn}
            />

            <div className="flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded border border-slate-800">
              {[0.25, 0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer tabular-nums ${
                    speed === spd ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCameraPreset('overview')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-semibold text-slate-200 cursor-pointer whitespace-nowrap"
              title="Đặt lại góc camera"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Đặt lại góc</span>
            </button>

            <button
              type="button"
              onClick={() => setDockOpen((v) => !v)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] text-slate-300 cursor-pointer"
            >
              {dockOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {dockOpen && (
          <div className="space-y-2.5">
            {/* Step-by-Step User Experiment Action Buttons */}
            {cfg.actions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-1">
                  Thao tác thí nghiệm:
                </span>
                {cfg.actions.map((act) => {
                  const isOn = act.kind === 'toggle' && act.flagKey ? Boolean(expFlags[act.flagKey]) : false;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => handleAction(act.id, act.kind, act.flagKey)}
                      className={`sim-btn-chem px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        act.kind === 'reset'
                          ? 'bg-slate-800 hover:bg-rose-950/70 border-rose-500/40 text-rose-200'
                          : actionBtnTone(act.accent, isOn)
                      }`}
                    >
                      {act.label}
                      {act.kind === 'toggle' ? (isOn ? ' ✓' : '') : ''}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Parameter Sliders + Explode Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {cfg.params.map((p) => (
                <Numeric3DControl
                  key={p.key}
                  label={p.label}
                  unit={p.unit}
                  value={modeParams[p.key] ?? p.defaultVal}
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  accentClass={p.accentClass}
                  onChange={(val) => setModeParams((prev) => ({ ...prev, [p.key]: val }))}
                />
              ))}
              <Numeric3DControl
                label="Tách lớp chi tiết (Explode)"
                unit="%"
                value={explode}
                min={0}
                max={100}
                step={5}
                accentClass="accent-amber-500"
                onChange={(v) => setExplode(v)}
              />
            </div>

            {/* Live Equation & Guidance Readout Bar */}
            <div className="rounded-lg bg-slate-950/80 border border-slate-800 px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <span className="font-mono font-bold text-emerald-300 tabular-nums">{readout.equationText}</span>
              <span className="text-slate-300">{readout.statusNote}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const telemetrySection = loggedSamples.length > 0 && (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-3 space-y-2 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
          Bảng Số Liệu Thực Nghiệm Hóa 3D ({loggedSamples.length} mẫu)
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3 h-3" />
            <span>Xuất CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setLoggedSamples([])}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-600 dark:text-slate-300 text-[11px] font-semibold cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Xóa bảng</span>
          </button>
        </div>
      </div>

      {loggedSamples.length >= 2 && (
        <MiniTelemetryChart
          title={`Biểu đồ biến thiên mẫu đo (${loggedSamples.length} mẫu)`}
          height={96}
          series={[
            {
              id: 'm1',
              label: 'Giá trị đo #1',
              color: '#10b981',
              values: loggedSamples.map((r) => {
                const m = (r.instruments + ' ' + r.equation).match(/-?\d+(\.\d+)?/);
                return m ? parseFloat(m[0]) : 0;
              })
            },
            {
              id: 't',
              label: 'Thời gian t (s)',
              color: '#fbbf24',
              values: loggedSamples.map((r) => parseFloat(r.timeSec) || r.idx)
            }
          ]}
        />
      )}

      <div className="overflow-x-auto max-h-40">
        <table className="w-full text-left border-collapse text-[11px] font-mono">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="py-1.5 px-2">#</th>
              <th className="py-1.5 px-2">t (s)</th>
              <th className="py-1.5 px-2">Trạng thái phản ứng</th>
              <th className="py-1.5 px-2">Dụng cụ đo 3D</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
            {loggedSamples.map((r) => (
              <tr key={r.idx}>
                <td className="py-1 px-2 tabular-nums">{r.idx}</td>
                <td className="py-1 px-2 tabular-nums text-sky-600 dark:text-sky-400">{r.timeSec}</td>
                <td className="py-1 px-2">{r.equation}</td>
                <td className="py-1 px-2 text-emerald-600 dark:text-emerald-400">{r.instruments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <ViewportPortal active={isFullscreen}>
      <div
        className={
          isFullscreen
            ? 'fixed inset-0 z-[100] h-[100dvh] w-screen bg-slate-950 p-2 sm:p-3 flex flex-col gap-2 overflow-y-auto'
            : embedded
            ? ''
            : 'space-y-2'
        }
      >
        {showApparatusBench ? (
          <ChemistryApparatusWorkbench
            dimension="3d"
            simId={mode}
            domainId={domainId}
            simParams={probeParams}
            simTime={simClock}
            onPlacedToolsChange={setPlacedTools}
          >
            {stageContent}
          </ChemistryApparatusWorkbench>
        ) : (
          stageContent
        )}
        {telemetrySection}
      </div>
    </ViewportPortal>
  );
};
