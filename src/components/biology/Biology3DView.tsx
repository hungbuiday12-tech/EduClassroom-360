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
  Dna,
  Download,
  Eye,
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
import { Biology3DMode } from '../../types';
import { BIOLOGY_3D_CONFIGS } from './biology3DControlsData';
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
import { buildMiddleSchool3DBioScene } from './biology3DMiddleSchoolScenes';
import { attachThreeFloorDrag, ThreeFloorDragHandle } from '../../lib/threeFloorDragController';

interface Biology3DViewProps {
  mode: Biology3DMode;
  title?: string;
  heightClass?: string;
  isEn?: boolean;
  embedded?: boolean;
  embeddedBadge?: string;
  onBack?: () => void;
  onOpenFull3D?: () => void;
}

type Mendel3DPreset = 'monohybrid' | 'dihybrid' | 'testcross';

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
            className="w-14 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 focus:border-teal-500 text-right font-mono font-bold text-white text-[11px] outline-none tabular-nums"
          />
          <button
            type="button"
            onClick={() => onChange(Math.min(max, Number((value + step).toFixed(4))))}
            className="w-7 h-7 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            title={`Tăng ${step}`}
          >
            <Plus className="w-3 h-3" />
          </button>
          {unit && <span className="text-[10px] text-slate-400 font-mono min-w-[26px]">{unit}</span>}
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

interface BioLoggedSample3D {
  idx: number;
  timeSec: string;
  equation: string;
  metrics: string;
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

function buildDefaultBioParams(mode: Biology3DMode): Record<string, number> {
  const cfg = BIOLOGY_3D_CONFIGS[mode];
  const out: Record<string, number> = {};
  cfg.params.forEach((p) => {
    out[p.key] = p.defaultVal;
  });
  return out;
}

export const Biology3DView: React.FC<Biology3DViewProps> = ({
  mode,
  title,
  heightClass = 'h-[430px]',
  isEn = false,
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
  const cameraLerpRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);

  const cfg = BIOLOGY_3D_CONFIGS[mode];

  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [explode, setExplode] = useState(0);
  const [xray, setXray] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [autoOrbit, setAutoOrbit] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mendelPreset, setMendelPreset] = useState<Mendel3DPreset>('dihybrid');
  const [dockOpen, setDockOpen] = useState(true);
  const [selectedPart, setSelectedPart] = useState('');
  const [simClock, setSimClock] = useState(0);
  const [isSoftwareGl] = useState(() => detectSoftwareGl());
  const [hologramMode, setHologramMode] = useState<HologramDisplayMode>('normal');
  const hologramModeRef = useRef<HologramDisplayMode>('normal');
  hologramModeRef.current = hologramMode;
  const { headOffsetRef, camStatus } = useHeadTrackedHologram(hologramMode);

  const [modeParams, setModeParams] = useState<Record<string, number>>(() => buildDefaultBioParams(mode));
  const [expFlags, setExpFlags] = useState<Record<string, boolean | number>>(() => ({
    ...BIOLOGY_3D_CONFIGS[mode].defaultFlags
  }));
  const [loggedSamples, setLoggedSamples] = useState<BioLoggedSample3D[]>([]);
  const floorDragRef = useRef<ThreeFloorDragHandle | null>(null);
  const [floorModelMoved, setFloorModelMoved] = useState(false);

  useEffect(() => {
    setModeParams(buildDefaultBioParams(mode));
    setExpFlags({ ...BIOLOGY_3D_CONFIGS[mode].defaultFlags });
    setSelectedPart('');
    setFloorModelMoved(false);
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
  const simTimeRef = useRef(0);
  const stepTriggerRef = useRef(0);
  const modeParamsRef = useRef(modeParams);
  const expFlagsRef = useRef(expFlags);
  const mendelPresetRef = useRef(mendelPreset);

  pausedRef.current = paused;
  speedRef.current = speed;
  explodeRef.current = explode;
  xrayRef.current = xray;
  showLabelsRef.current = showLabels;
  showGridRef.current = showGrid;
  autoOrbitRef.current = autoOrbit;
  modeParamsRef.current = modeParams;
  expFlagsRef.current = expFlags;
  mendelPresetRef.current = mendelPreset;

  const readout = useMemo(
    () => cfg.computeReadout(modeParams, expFlags, simClock),
    [cfg, modeParams, expFlags, simClock]
  );

  const recorder = useCanvasRecorder(() => canvasRef.current, `bio-3d-${mode}`);

  const handleAction = (actionId: string, kind: 'toggle' | 'trigger' | 'reset', flagKey?: string) => {
    if (kind === 'reset') {
      setModeParams(buildDefaultBioParams(mode));
      setExpFlags({ ...cfg.defaultFlags });
      if (mode === 'mendel_peas_3d') setMendelPreset('dihybrid');
      return;
    }
    if (kind === 'toggle' && flagKey) {
      setExpFlags((prev) => {
        const nextVal = !prev[flagKey];
        // If user opens Mendel pod directly, ensure pollination is also marked true
        if (mode === 'mendel_peas_3d' && flagKey === 'podOpened' && nextVal) {
          return { ...prev, pollinated: true, podOpened: true };
        }
        return { ...prev, [flagKey]: nextVal };
      });
      return;
    }
    if (mode === 'biotech_pcr_crispr_3d') {
      if (actionId === 'denature') {
        setModeParams((prev) => ({ ...prev, tempC: 95 }));
        setExpFlags((prev) => ({ ...prev, stepPhase: 1 }));
      } else if (actionId === 'anneal') {
        setModeParams((prev) => ({ ...prev, tempC: 55 }));
        setExpFlags((prev) => ({ ...prev, stepPhase: 2 }));
      } else if (actionId === 'extend') {
        setModeParams((prev) => ({ ...prev, tempC: 72 }));
        setExpFlags((prev) => ({ ...prev, stepPhase: 3 }));
      }
    } else if (mode === 'endocrine_pancreas_3d' && actionId === 'meal') {
      setModeParams((prev) => ({
        ...prev,
        glucoseMg: Math.min(220, (prev.glucoseMg ?? 95) + 70)
      }));
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isUltra = perfMode === 'ultra';
    const isSmooth = perfMode === 'smooth';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isUltra ? 0x050e17 : 0x07111a);
    scene.fog = new THREE.FogExp2(isUltra ? 0x050e17 : 0x07111a, isSmooth ? 0.022 : 0.026);

    const w = container.clientWidth || 720;
    const h = container.clientHeight || 430;
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(4.2, 2.9, 5.2);
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
    controls.maxDistance = 15;
    const cancelCamLerp = () => {
      cameraLerpRef.current = null;
    };
    controls.addEventListener('start', cancelCamLerp);
    controlsRef.current = controls;

    const hemi = new THREE.HemisphereLight(0xa7f3d0, 0x0f172a, isUltra ? 0.85 : 0.68);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xfffbeb, isUltra ? 1.75 : isSmooth ? 1.15 : 1.45);
    keyLight.position.set(5, 8, 6);
    if (!isSmooth && !isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(isUltra ? 2048 : 1024, isUltra ? 2048 : 1024);
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x10b981, isUltra ? 0.9 : 0.58);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    const bioAccentLight = new THREE.PointLight(0x34d399, isUltra ? 1.75 : isSmooth ? 0.4 : 1.05, 14);
    bioAccentLight.position.set(0, 1.5, 2.5);
    scene.add(bioAccentLight);

    const stageDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(5.2, 5.4, 0.14, 48),
      new THREE.MeshStandardMaterial({ color: 0x071a1c, metalness: 0.35, roughness: 0.48 })
    );
    stageDisc.position.y = -2.14;
    stageDisc.receiveShadow = true;
    scene.add(stageDisc);

    const rimRing = new THREE.Mesh(
      new THREE.TorusGeometry(5.2, 0.03, 12, 64),
      new THREE.MeshBasicMaterial({
        color: isUltra ? 0x10b981 : 0x14b8a6,
        transparent: true,
        opacity: isUltra ? 0.72 : 0.36
      })
    );
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = -2.07;
    scene.add(rimRing);

    const grid = new THREE.GridHelper(12, 16, 0x134e4a, 0x0f172a);
    grid.position.y = -2.06;
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

    const poolCap = isUltra ? 280 : isSmooth ? 72 : 160;
    const gpuPool = new GPUParticlePool(poolCap, isUltra ? 0.064 : 0.05, 0x34d399, 0xfacc15);
    scene.add(gpuPool.mesh);

    const parts: { mesh: THREE.Object3D; home: THREE.Vector3; dir: THREE.Vector3; label: string }[] = [];
    const shellMeshes: THREE.Mesh[] = [];
    const pulsers: { mesh: THREE.Object3D; phase: number }[] = [];
    let customEmit: ((t: number, dt: number, params: Record<string, number>, flags: Record<string, boolean | number>) => void) | null = null;
    let onLiveUpdate: ((t: number, dt: number, params: Record<string, number>, flags: Record<string, boolean | number>) => void) | null = null;
    let rotateRoot = true;

    const register = (mesh: THREE.Object3D, label: string, dir: [number, number, number], isOuterShell = false) => {
      mesh.userData.partLabel = label;
      mesh.traverse((c) => {
        c.userData.partLabel = label;
        if ((c as THREE.Mesh).isMesh && !isOuterShell) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      root.add(mesh);
      parts.push({ mesh, home: mesh.position.clone(), dir: new THREE.Vector3(...dir), label });
      if (isOuterShell && mesh instanceof THREE.Mesh) {
        mesh.userData.origOpacity = (mesh.material as THREE.Material).opacity ?? 1;
        shellMeshes.push(mesh);
      }
    };

    const addLabel = (
      text: string,
      pos: [number, number, number],
      color: number = 0xd1fae5,
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
        return leader;
      }
      const lbl = createTroikaLabel({
        text,
        position: pos,
        fontSize: 0.25,
        color,
        outlineWidth: 0.018
      });
      labelGroup.add(lbl);
      return lbl;
    };

    const shellMat = (color: number, opacity = 0.34) =>
      new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity,
        roughness: 0.16,
        clearcoat: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false
      });

    switch (mode) {
      case 'dna_double_helix_3d': {
        const mA = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.28, metalness: 0.25 });
        const mT = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.28, metalness: 0.25 });
        const mG = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.28, metalness: 0.25 });
        const mC = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.28, metalness: 0.25 });
        const pairMats = [
          [mA, mT, 'Cặp A – T (2 LK Hydro)'],
          [mG, mC, 'Cặp G ≡ C (3 LK Hydro)']
        ] as const;

        const strand1Pts: THREE.Vector3[] = [];
        const strand2Pts: THREE.Vector3[] = [];
        const dnaItems: {
          idx: number;
          base1: THREE.Mesh;
          base2: THREE.Mesh;
          rung: THREE.Mesh;
          x1: number;
          y: number;
          z1: number;
        }[] = [];

        for (let i = -8; i <= 8; i++) {
          const y = i * 0.24;
          const ang = i * 0.55;
          const r = 1.05;
          const x1 = Math.cos(ang) * r;
          const z1 = Math.sin(ang) * r;
          strand1Pts.push(new THREE.Vector3(x1, y, z1));
          strand2Pts.push(new THREE.Vector3(-x1, y, -z1));
          const [leftMat, rightMat, lbl] = pairMats[Math.abs(i) % 2];
          const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), leftMat);
          b1.position.set(x1, y, z1);
          register(b1, lbl, [x1, 0, z1]);
          const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), rightMat);
          b2.position.set(-x1, y, -z1);
          register(b2, lbl, [-x1, 0, -z1]);
          const rung = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, r * 2, 10),
            new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4 })
          );
          rung.position.set(0, y, 0);
          rung.rotation.z = Math.PI / 2;
          rung.rotation.y = -ang;
          register(rung, 'Liên kết Hydro giữa 2 mạch', [0, 0.2, 0]);
          dnaItems.push({ idx: i, base1: b1, base2: b2, rung, x1, y, z1 });
        }
        const sLine1 = createCrispLine2(strand1Pts, { color: 0x38bdf8, linewidth: 2.5 });
        const sLine2 = createCrispLine2(strand2Pts, { color: 0xf43f5e, linewidth: 2.5 });
        root.add(sLine1, sLine2);

        const helicase = new THREE.Mesh(
          new THREE.TorusGeometry(0.9, 0.14, 14, 32),
          new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            emissive: 0xd97706,
            emissiveIntensity: 0.65,
            roughness: 0.25
          })
        );
        helicase.rotation.x = Math.PI / 2;
        helicase.position.set(0, -0.3, 0);
        helicase.visible = false;
        register(helicase, 'Enzyme Helicase tháo xoắn cắt liên kết Hydro', [0, 0, 1]);

        addLabel('Chuỗi xoắn kép DNA (5’→3’ // 3’→5’)', [0, 2.25, 0], 0x7dd3fc);

        let unzipFactor = 0;
        onLiveUpdate = (t, dt, _p, flags) => {
          const target = flags.unzipped ? 1 : 0;
          unzipFactor = THREE.MathUtils.damp(unzipFactor, target, 5, dt);
          helicase.visible = unzipFactor > 0.05;
          helicase.rotation.z = t * 2.5;
          helicase.position.y = -0.35 + Math.sin(t * 2) * 0.15;

          dnaItems.forEach((it) => {
            const fork = it.idx < 0 ? ((-it.idx) / 8) * unzipFactor : 0;
            const sep = 1 + fork * 1.15;
            const p1 = parts.find((pt) => pt.mesh === it.base1);
            const p2 = parts.find((pt) => pt.mesh === it.base2);
            if (p1) p1.home.set(it.x1 * sep, it.y, it.z1 * sep);
            if (p2) p2.home.set(-it.x1 * sep, it.y, -it.z1 * sep);
            it.rung.visible = fork < 0.18;
          });
        };
        customEmit = (_t, _dt, _p, flags) => {
          if (flags.unzipped && Math.random() < 0.3) {
            gpuPool.spawn((Math.random() - 0.5) * 0.8, -0.35, (Math.random() - 0.5) * 0.8, 0, 0.7, 0, 0.6, 0.7, 0xfacc15);
          }
        };
        break;
      }

      case 'ribosome_translation_3d': {
        const mrna = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 4.6, 16),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
        );
        mrna.rotation.z = Math.PI / 2;
        register(mrna, 'Phân tử mRNA (5’ → 3’)', [0, 0, 0.5]);

        const riboGroup = new THREE.Group();
        const smallSub = new THREE.Mesh(
          new THREE.SphereGeometry(0.92, 24, 20),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35 })
        );
        smallSub.scale.set(1.2, 0.65, 0.9);
        smallSub.position.set(0, -0.58, 0);
        riboGroup.add(smallSub);

        const largeSub = new THREE.Mesh(
          new THREE.SphereGeometry(1.15, 24, 20),
          new THREE.MeshStandardMaterial({ color: 0x10b981, transparent: true, opacity: 0.85, roughness: 0.3 })
        );
        largeSub.scale.set(1.3, 0.95, 1.0);
        largeSub.position.set(0, 0.62, 0);
        riboGroup.add(largeSub);

        const aaMeshes: THREE.Mesh[] = [];
        for (let i = 0; i < 6; i++) {
          const aa = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 14, 14),
            new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xa855f7 : 0xf43f5e, roughness: 0.25 })
          );
          aa.position.set(-0.3 + i * 0.24, 1.3 + Math.sin(i * 0.8) * 0.25, 0.15);
          riboGroup.add(aa);
          aaMeshes.push(aa);
        }
        register(riboGroup, 'Phức hợp Ribosome + Chuỗi Polipeptit', [0, 0.6, 0]);

        const poly2 = riboGroup.clone();
        poly2.position.set(-1.35, 0, 0);
        poly2.scale.setScalar(0.75);
        poly2.visible = false;
        register(poly2, 'Ribosome #2 (Polyribosome tăng hiệu suất)', [-0.8, 0.6, 0]);

        addLabel('Ribosome dịch mã tổng hợp Protein (AUG → UAA)', [0, 2.05, 0], 0x6ee7b7);

        onLiveUpdate = (t, _dt, params, flags) => {
          const rate = params.rate ?? 15;
          const slide = ((t * (rate / 15) * 0.55) % 2.2) - 1.1;
          const rp = parts.find((pt) => pt.mesh === riboGroup);
          if (rp) rp.home.x = slide;
          aaMeshes.forEach((aa, idx) => {
            aa.position.y = 1.32 + Math.sin(t * 2.5 + idx * 0.7) * 0.14 + idx * 0.08;
          });
          poly2.visible = Boolean(flags.polysome);
          if (flags.polysome) {
            const rp2 = parts.find((pt) => pt.mesh === poly2);
            if (rp2) rp2.home.x = slide - 1.45;
          }
        };
        customEmit = (_t, _dt, params) => {
          if (Math.random() < 0.2) {
            gpuPool.spawn(riboGroup.position.x, 1.85, 0.15, 0, 0.6, 0, 0.7, 0.8, (params.rate ?? 15) > 20 ? 0xa855f7 : 0x38bdf8);
          }
        };
        break;
      }

      case 'phospholipid_bilayer_3d': {
        const headMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 });
        const tailMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.6 });
        const lipidNodes: { mesh: THREE.Object3D; baseY: number; phase: number }[] = [];

        for (let ix = -3; ix <= 3; ix++) {
          for (let iz = -2; iz <= 2; iz++) {
            if (ix === 0 && iz === 0) continue;
            const ph = ix * 0.6 + iz * 0.5;
            const topH = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 12), headMat);
            topH.position.set(ix * 0.5, 0.65, iz * 0.5);
            register(topH, 'Đầu ưa nước Phosphat', [0, 0.95, 0]);
            lipidNodes.push({ mesh: topH, baseY: 0.65, phase: ph });

            const botH = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 12), headMat);
            botH.position.set(ix * 0.5, -0.65, iz * 0.5);
            register(botH, 'Đầu ưa nước lớp dưới', [0, -0.95, 0]);
            lipidNodes.push({ mesh: botH, baseY: -0.65, phase: ph });

            const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8), tailMat);
            tail.position.set(ix * 0.5, 0, iz * 0.5);
            register(tail, 'Đuôi kị nước axit béo', [0, 0.2, 0]);
          }
        }
        const channelMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          emissiveIntensity: 0.2,
          roughness: 0.25,
          side: THREE.DoubleSide
        });
        const channel = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.85, 20, 1, true), channelMat);
        register(channel, 'Kênh Protein xuyên màng (Aquaporin / Bơm ATP)', [0, 0, 1]);
        addLabel('Lớp kép Phospholipid & Kênh Thẩm thấu', [0, 1.4, 0], 0x6ee7b7);

        onLiveUpdate = (t, _dt, params, flags) => {
          const tempFactor = (params.tempC ?? 37) / 37;
          lipidNodes.forEach((n) => {
            const p = parts.find((pt) => pt.mesh === n.mesh);
            if (p) p.home.y = n.baseY + Math.sin(t * 2.2 * tempFactor + n.phase) * 0.045;
          });
          channelMat.color.setHex(flags.activePump ? 0xf59e0b : 0x10b981);
          channelMat.emissiveIntensity = flags.activePump ? 0.55 + Math.sin(t * 6) * 0.2 : 0.2;
        };

        customEmit = (_t, _dt, params, flags) => {
          const solute = params.soluteOut ?? 0.9;
          if (flags.activePump) {
            gpuPool.spawn((Math.random() - 0.5) * 0.22, -1.15, (Math.random() - 0.5) * 0.22, 0, 2.3, 0, 1.0, 0.9, 0xfacc15);
          } else if (solute < 0.7) {
            // Hypotonic: water rushes inside (down)
            gpuPool.spawn((Math.random() - 0.5) * 0.25, 1.15, (Math.random() - 0.5) * 0.25, 0, -2.2, 0, 1.1, 0.9, 0x38bdf8);
          } else if (solute > 1.2) {
            // Hypertonic: water leaves cell (up)
            gpuPool.spawn((Math.random() - 0.5) * 0.25, -1.15, (Math.random() - 0.5) * 0.25, 0, 2.2, 0, 1.1, 0.9, 0x38bdf8);
          } else if (Math.random() < 0.25) {
            const dir = Math.random() > 0.5 ? -1.4 : 1.4;
            gpuPool.spawn((Math.random() - 0.5) * 0.22, dir > 0 ? -0.9 : 0.9, 0, 0, dir, 0, 1.2, 0.65, 0x38bdf8);
          }
        };
        break;
      }

      case 'mitochondria_atp_3d': {
        bioAccentLight.color.setHex(0xf97316);
        const outer = new THREE.Mesh(new THREE.CapsuleGeometry(1.05, 1.8, 12, 24), shellMat(0xf97316, 0.36));
        outer.rotation.z = Math.PI / 2;
        register(outer, 'Màng ngoài Ti thể', [0, 0.85, 0], true);
        for (let i = -3; i <= 3; i++) {
          const crista = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 1.15, 0.95),
            new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.35 })
          );
          crista.position.set(i * 0.42, 0, 0);
          register(crista, 'Mào trong Cristae (Chuỗi truyền e⁻)', [i * 0.25, 0.45, 0]);
        }
        const atpSynthMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.55,
          metalness: 0.4,
          roughness: 0.2
        });
        const atpSynth = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 0), atpSynthMat);
        atpSynth.position.set(0, 0.85, 0.35);
        register(atpSynth, 'Động cơ ATP Synthase', [0, 1.1, 0]);
        addLabel('ATP Synthase (+32 ATP)', [0, 1.45, 0.35], 0xfde047);

        onLiveUpdate = (t, dt, params, flags) => {
          const o2 = flags.aerobic ? (params.o2Pct ?? 80) : 0;
          const active = o2 > 15;
          const spinRate = active ? 2.5 + (o2 / 100) * 4.5 : 0.2;
          atpSynth.rotation.y += dt * spinRate;
          atpSynthMat.emissiveIntensity = active ? 0.5 + Math.sin(t * 5) * 0.25 : 0.08;
          const sc = active ? 1 + Math.sin(t * 6) * 0.1 : 0.88;
          atpSynth.scale.setScalar(sc);
        };

        customEmit = (_t, _dt, params, flags) => {
          const o2 = flags.aerobic ? (params.o2Pct ?? 80) : 0;
          if (o2 > 15) {
            gpuPool.spawn(0, 0.95, 0.35, (Math.random() - 0.5) * 1.2, 1.35, (Math.random() - 0.5) * 1.2, 0.85, 1.0, 0xfacc15);
          } else if (Math.random() < 0.15) {
            gpuPool.spawn(-0.5, 0.2, 0.2, (Math.random() - 0.5) * 0.5, 0.6, 0, 0.6, 0.5, 0xf43f5e);
          }
        };
        break;
      }

      case 'chloroplast_thylakoid_3d': {
        const env = new THREE.Mesh(new THREE.SphereGeometry(1.75, 28, 20), shellMat(0x22c55e, 0.32));
        env.scale.set(1.35, 0.72, 0.95);
        register(env, 'Màng kép Lục lạp & Chất nền Stroma', [0, 0.85, 0], true);
        const discMat = new THREE.MeshStandardMaterial({
          color: 0x15803d,
          emissive: 0x22c55e,
          emissiveIntensity: 0.25,
          roughness: 0.35,
          metalness: 0.15
        });
        for (let s = -1; s <= 1; s++) {
          for (let d = 0; d < 4; d++) {
            const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.14, 20), discMat);
            disc.position.set(s * 1.05, -0.35 + d * 0.22, 0);
            register(disc, 'Cột Grana (Đĩa Thylakoid chứa Diệp lục)', [s * 0.6, d * 0.25, 0]);
          }
        }
        addLabel('Grana (Pha Sáng) + Stroma (Chu trình Calvin)', [0, 1.55, 0], 0x86efac);

        onLiveUpdate = (t, _dt, params, flags) => {
          const light = flags.lightOn ? (params.light ?? 70) : 0;
          const intensity = light / 100;
          discMat.emissiveIntensity = 0.05 + intensity * (0.45 + Math.sin(t * 4) * 0.1);
          bioAccentLight.intensity = 0.2 + intensity * 1.8;
        };
        customEmit = (_t, _dt, params, flags) => {
          const light = flags.lightOn ? (params.light ?? 70) : 0;
          if (light > 10 && Math.random() < light / 120) {
            const gx = ((Math.floor(Math.random() * 3) - 1) * 1.05) + (Math.random() - 0.5) * 0.3;
            gpuPool.spawn(gx, 0.35, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3, 1.3, 0, 1.2, 0.75, 0x7dd3fc);
          }
        };
        break;
      }

      case 'chromosome_mitosis_3d': {
        const cMat1 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35 });
        const cMat2 = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.35 });
        const arm1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 2.1, 10, 16), cMat1);
        arm1.rotation.z = 0.28;
        register(arm1, 'Nhiễm sắc tử chị em #1 (Chromatid)', [-0.7, 0, 0]);
        const arm2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 2.1, 10, 16), cMat2);
        arm2.rotation.z = -0.28;
        register(arm2, 'Nhiễm sắc tử chị em #2 (Chromatid)', [0.7, 0, 0]);
        const centromere = new THREE.Mesh(
          new THREE.SphereGeometry(0.32, 20, 20),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.45, metalness: 0.45 })
        );
        register(centromere, 'Tâm động (Vị trí gắn thoi phân bào)', [0, 0, 0.7]);
        const spindle1 = createCrispLine2([[-3.4, 0, 0], [0, 0, 0]], { color: 0xfde047, linewidth: 2, dashed: true });
        const spindle2 = createCrispLine2([[3.4, 0, 0], [0, 0, 0]], { color: 0xfde047, linewidth: 2, dashed: true });
        root.add(spindle1, spindle2);
        addLabel('NST Kép & Thoi phân bào', [0, 1.7, 0], 0x93c5fd);

        let pull = 0;
        onLiveUpdate = (_t, dt, _p, flags) => {
          pull = THREE.MathUtils.damp(pull, flags.anaphase ? 1 : 0, 5, dt);
          const p1 = parts.find((pt) => pt.mesh === arm1);
          const p2 = parts.find((pt) => pt.mesh === arm2);
          const pc = parts.find((pt) => pt.mesh === centromere);
          if (p1) p1.home.x = -pull * 1.45;
          if (p2) p2.home.x = pull * 1.45;
          if (pc) pc.mesh.scale.setScalar(1 - pull * 0.45);
          arm1.rotation.z = THREE.MathUtils.lerp(0.28, 0.08, pull);
          arm2.rotation.z = THREE.MathUtils.lerp(-0.28, -0.08, pull);
        };
        break;
      }

      case 'enzyme_substrate_3d': {
        const enzymeMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          emissiveIntensity: 0.15,
          roughness: 0.35,
          side: THREE.DoubleSide
        });
        const enzyme = new THREE.Mesh(new THREE.SphereGeometry(1.35, 28, 24, 0, Math.PI * 1.58), enzymeMat);
        register(enzyme, 'Phân tử Enzyme & Trung tâm hoạt động', [-0.6, 0, 0]);
        const sub = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.55, 0),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.25, roughness: 0.25 })
        );
        sub.position.set(1.05, 0.1, 0);
        register(sub, 'Phân tử Cơ chất (Substrate) khớp đặc hiệu', [1.1, 0.3, 0]);

        const inhibitor = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.48, 0),
          new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xbe123c, emissiveIntensity: 0.45, roughness: 0.25 })
        );
        inhibitor.position.set(2.4, -0.9, 0.4);
        inhibitor.visible = false;
        register(inhibitor, 'Chất ức chế cạnh tranh chiếm trung tâm hoạt động', [1.4, -0.5, 0.4]);

        addLabel('Phức hợp Enzyme – Cơ chất', [0, 1.75, 0], 0x6ee7b7);

        let dockProg = 0;
        let inhibProg = 0;
        onLiveUpdate = (t, dt, params, flags) => {
          const temp = params.tempC ?? 37;
          const denatured = temp > 55;
          const inhibited = Boolean(flags.inhibited);

          enzymeMat.color.setHex(denatured ? 0xb45309 : 0x10b981);
          enzyme.scale.set(
            denatured ? 1 + Math.sin(t * 14) * 0.12 : 1,
            denatured ? 0.78 + Math.cos(t * 12) * 0.1 : 1,
            1
          );

          inhibProg = THREE.MathUtils.damp(inhibProg, inhibited ? 1 : 0, 5, dt);
          inhibitor.visible = inhibProg > 0.04;
          const pi = parts.find((pt) => pt.mesh === inhibitor);
          if (pi) {
            pi.home.set(
              THREE.MathUtils.lerp(2.4, 0.62, inhibProg),
              THREE.MathUtils.lerp(-0.9, 0.05, inhibProg),
              THREE.MathUtils.lerp(0.4, 0, inhibProg)
            );
          }

          const shouldDock = !denatured && !inhibited;
          dockProg = THREE.MathUtils.damp(dockProg, shouldDock ? 1 : 0, 4.5, dt);
          const ps = parts.find((pt) => pt.mesh === sub);
          if (ps) {
            const osc = shouldDock ? Math.sin(t * 2.2) * 0.28 : 0;
            ps.home.set(
              THREE.MathUtils.lerp(1.95, 0.65 + osc, dockProg),
              0.08,
              0
            );
          }
          sub.rotation.y = t * 1.2;
        };
        customEmit = (_t, _dt, params, flags) => {
          if ((params.tempC ?? 37) <= 55 && !flags.inhibited && Math.random() < 0.2) {
            gpuPool.spawn(0.65, 0.2, 0, 1.2, (Math.random() - 0.5) * 0.9, 0, 0.75, 0.85, 0x38bdf8);
          }
        };
        break;
      }

      case 'neuron_synapse_3d': {
        bioAccentLight.color.setHex(0x38bdf8);
        const soma = new THREE.Mesh(
          new THREE.SphereGeometry(0.75, 22, 22),
          new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.35 })
        );
        soma.position.set(-1.75, 0, 0);
        register(soma, 'Thân tế bào Thần kinh (Soma)', [-0.8, 0, 0]);
        const axon = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 3.2, 16),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 })
        );
        axon.rotation.z = Math.PI / 2;
        axon.position.set(0.1, 0, 0);
        register(axon, 'Sợi trục dẫn truyền xung thần kinh', [0, 0.4, 0]);
        const sheaths: THREE.Mesh[] = [];
        for (let i = 0; i < 3; i++) {
          const sheath = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.28, 0.55, 8, 16),
            new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.3 })
          );
          sheath.rotation.z = Math.PI / 2;
          sheath.position.set(-0.75 + i * 0.9, 0, 0);
          register(sheath, `Bao Myelin #${i + 1} (Eo Ranvier cách điện)`, [0, 0.8, 0]);
          sheaths.push(sheath);
        }
        const bulbMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          emissiveIntensity: 0.3,
          roughness: 0.3
        });
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 20), bulbMat);
        bulb.position.set(1.75, 0, 0);
        register(bulb, 'Chùy Xináp chứa Acetylcholine', [0.85, 0, 0]);
        addLabel('Xung điện thế hoạt động (+30mV)', [0, 1.35, 0], 0xfde047);

        onLiveUpdate = (t, _dt, params, flags) => {
          const myelin = (params.myelin ?? 80) / 100;
          sheaths.forEach((s) => {
            s.visible = myelin > 0.05;
            s.scale.set(0.55 + myelin * 0.65, 1, 0.55 + myelin * 0.65);
          });
          const firing = Boolean(flags.fired) && (params.stimulusMv ?? 20) >= 15;
          bulbMat.emissiveIntensity = firing ? 0.4 + Math.abs(Math.sin(t * 5)) * 0.7 : 0.1;
          const sc = firing ? 1 + Math.sin(t * 6) * 0.08 : 1;
          bulb.scale.setScalar(sc);
        };

        customEmit = (_t, _dt, params, flags) => {
          const firing = Boolean(flags.fired) && (params.stimulusMv ?? 20) >= 15;
          if (!firing) return;
          const speedMult = 1.6 + ((params.myelin ?? 80) / 100) * 4.0;
          gpuPool.spawn(-1.45, 0, 0, speedMult, 0, 0, 0.78, 1.1, 0xfacc15);
          if (Math.random() < 0.25) {
            gpuPool.spawn(2.15, (Math.random() - 0.5) * 0.2, 0, 1.1, (Math.random() - 0.5) * 0.4, 0, 0.55, 0.75, 0x34d399);
          }
        };
        break;
      }

      case 'human_heart_3d': {
        bioAccentLight.color.setHex(0xe11d48);
        const heartMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.32, metalness: 0.1 });
        const leftV = new THREE.Mesh(new THREE.SphereGeometry(1.05, 24, 24), heartMat);
        leftV.scale.set(0.9, 1.25, 0.85);
        leftV.position.set(0.35, -0.2, 0);
        register(leftV, 'Tâm thất trái (Bơm máu giàu O₂)', [0.8, -0.4, 0]);
        const rightV = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 24), heartMat);
        rightV.scale.set(0.85, 1.1, 0.8);
        rightV.position.set(-0.45, -0.15, 0.1);
        register(rightV, 'Tâm thất phải (Lên phổi)', [-0.8, -0.4, 0]);
        const aorta = new THREE.Mesh(
          new THREE.TorusGeometry(0.7, 0.2, 16, 32, Math.PI),
          new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 })
        );
        aorta.position.set(0.15, 0.9, 0);
        register(aorta, 'Cung Động mạch Chủ', [0, 1.1, 0]);
        const pul = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 1.3, 16),
          new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.35 })
        );
        pul.position.set(-0.45, 0.95, 0.25);
        pul.rotation.z = 0.28;
        register(pul, 'Động mạch Phổi (Máu giàu CO₂)', [-0.7, 0.9, 0]);
        addLabel('Chu kì Tim (Tâm thu / Tâm trương)', [0, 1.85, 0], 0xfda4af);

        onLiveUpdate = (t, _dt, params, flags) => {
          const bpm = flags.exercise ? Math.max(135, params.bpm ?? 145) : (params.bpm ?? 72);
          const svAmp = ((params.strokeMl ?? 70) / 70) * 0.1;
          const phase = (t * (bpm / 60) * Math.PI * 2) % (Math.PI * 2);
          const beat = Math.pow(Math.max(0, Math.sin(phase)), 3) * svAmp;
          leftV.scale.set(0.9 * (1 + beat), 1.25 * (1 + beat), 0.85 * (1 + beat));
          rightV.scale.set(0.85 * (1 + beat * 0.9), 1.1 * (1 + beat * 0.9), 0.8 * (1 + beat * 0.9));
        };
        customEmit = (_t, _dt, params, flags) => {
          const bpm = flags.exercise ? Math.max(135, params.bpm ?? 145) : (params.bpm ?? 72);
          if (Math.random() < bpm / 260) {
            gpuPool.spawn(0.65, 1.35, 0, 0.6, 1.2, 0, 0.65, 0.8, 0xf43f5e);
            gpuPool.spawn(-0.55, 1.35, 0.25, -0.5, 1.1, 0, 0.65, 0.8, 0x3b82f6);
          }
        };
        break;
      }

      case 'alveoli_capillary_3d': {
        const sacs: THREE.Mesh[] = [];
        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          const sac = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), shellMat(0xf472b6, 0.55));
          sac.position.set(Math.cos(ang) * 0.72, (i % 2) * 0.35 - 0.15, Math.sin(ang) * 0.72);
          register(sac, `Chùm Phế nang #${i + 1}`, [Math.cos(ang) * 0.7, 0, Math.sin(ang) * 0.7], true);
          sacs.push(sac);
        }
        const cap = new THREE.Mesh(
          new THREE.TorusGeometry(1.25, 0.12, 14, 36),
          new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 })
        );
        cap.rotation.x = Math.PI / 2;
        register(cap, 'Mạng mao mạch trao đổi O₂ / CO₂', [0, -0.7, 0]);
        addLabel('Phế nang ↔ Mao mạch phổi', [0, 1.35, 0], 0xf9a8d4);

        onLiveUpdate = (t, _dt, params, flags) => {
          const rate = (params.breathRate ?? 16) / 16;
          const amp = flags.deepBreath ? 0.16 : 0.08;
          const sc = 1 + Math.sin(t * 2.2 * rate) * amp;
          sacs.forEach((s) => s.scale.setScalar(sc));
        };
        customEmit = (_t, _dt, params) => {
          const alt = params.altitude ?? 0;
          if (Math.random() < Math.max(0.1, 0.45 - alt * 0.06)) {
            gpuPool.spawn((Math.random() - 0.5) * 0.8, 0.3, (Math.random() - 0.5) * 0.8, 0, -1.0, 0, 0.7, 0.7, 0x38bdf8);
          }
          if (Math.random() < 0.25) {
            gpuPool.spawn((Math.random() - 0.5) * 1.1, -0.2, (Math.random() - 0.5) * 1.1, 0, 1.0, 0, 0.7, 0.65, 0xfbbf24);
          }
        };
        break;
      }

      case 'nephron_kidney_3d': {
        const bowman = new THREE.Mesh(
          new THREE.SphereGeometry(0.75, 20, 20),
          new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 })
        );
        bowman.position.set(-1.35, 0.75, 0);
        register(bowman, 'Cầu thận & Nang Bowman (Siêu lọc)', [-0.7, 0.5, 0]);
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.7, 0.7, 0),
          new THREE.Vector3(-0.2, -1.25, 0.2),
          new THREE.Vector3(0.45, -1.25, -0.2),
          new THREE.Vector3(0.85, 0.75, 0),
          new THREE.Vector3(1.55, -0.95, 0)
        ]);
        const tubule = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 56, 0.16, 12, false),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
        );
        register(tubule, 'Quai Henle & Ống góp (Tái hấp thu ADH)', [0.4, 0, 0.5]);
        addLabel('Cầu thận → Quai Henle → Ống góp', [0, 1.65, 0], 0xfde047);

        onLiveUpdate = (t, _dt, params) => {
          const bpScale = 0.92 + ((params.bp ?? 120) / 120) * 0.12 + Math.sin(t * 4) * 0.04;
          bowman.scale.setScalar(bpScale);
        };
        customEmit = (t, _dt, params, flags) => {
          const adh = flags.highAdh ? 90 : (params.adh ?? 50);
          const u = (t * 0.45) % 1;
          const pt = curve.getPointAt(u);
          gpuPool.spawn(pt.x, pt.y, pt.z, 0.2, -0.2, 0, 0.45, 0.7, 0xfacc15);
          if (Math.random() < adh / 150) {
            gpuPool.spawn(1.2, (Math.random() - 0.5) * 1.2, 0, -1.1, 0, 0, 0.6, 0.7, 0x38bdf8);
          }
        };
        break;
      }

      case 'antibody_antigen_3d': {
        const yMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.3, roughness: 0.28 });
        const stem = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 1.1, 10, 14), yMat);
        stem.position.set(0, -0.55, 0);
        register(stem, 'Chuỗi nặng Fc (Gắn đại thực bào)', [0, -0.8, 0]);
        const armL = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 1.0, 10, 14), yMat);
        armL.position.set(-0.55, 0.45, 0);
        armL.rotation.z = 0.65;
        register(armL, 'Vùng biến đổi Fab trái (Khóa kháng nguyên)', [-0.8, 0.6, 0]);
        const armR = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 1.0, 10, 14), yMat);
        armR.position.set(0.55, 0.45, 0);
        armR.rotation.z = -0.65;
        register(armR, 'Vùng biến đổi Fab phải', [0.8, 0.6, 0]);
        const ag = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.42, 0),
          new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.35 })
        );
        ag.position.set(-1.35, 1.3, 0);
        register(ag, 'Kháng nguyên đặc hiệu (Epitope)', [-1.1, 1.0, 0]);
        const agR = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.42, 0),
          new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.35 })
        );
        agR.position.set(1.35, 1.3, 0);
        agR.visible = false;
        register(agR, 'Kháng nguyên #2 (Đáp ứng thứ phát mạnh)', [1.1, 1.0, 0]);
        addLabel('Kháng thể chữ Y (IgG) khóa Epitope', [0, 1.85, 0], 0x7dd3fc);

        let lock = 0;
        onLiveUpdate = (t, dt, params, flags) => {
          const second = Boolean(flags.memoryBoost) || (params.dose ?? 1) === 2;
          lock = THREE.MathUtils.damp(lock, second ? 1 : 0.35, 4, dt);
          agR.visible = second;
          const paL = parts.find((pt) => pt.mesh === ag);
          if (paL) {
            paL.home.set(
              THREE.MathUtils.lerp(-1.65, -0.96, lock),
              THREE.MathUtils.lerp(1.55, 0.96, lock),
              Math.sin(t * 2) * (1 - lock) * 0.15
            );
          }
          const paR = parts.find((pt) => pt.mesh === agR);
          if (paR) {
            paR.home.set(THREE.MathUtils.lerp(1.65, 0.96, lock), THREE.MathUtils.lerp(1.55, 0.96, lock), 0);
          }
        };
        break;
      }

      case 'virus_bacteriophage_3d': {
        bioAccentLight.color.setHex(0x8b5cf6);
        const head = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.85, 0),
          new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.35, roughness: 0.28 })
        );
        head.position.set(0, 1.25, 0);
        register(head, 'Đầu Capsid 20 mặt chứa DNA Phage', [0, 1.0, 0]);
        const sheath = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.24, 1.25, 16),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.45, roughness: 0.3 })
        );
        sheath.position.set(0, 0.05, 0);
        register(sheath, 'Bao đuôi co bóp bơm DNA', [0, 0, 0.6]);
        const legMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 1.25, 8), legMat);
          leg.position.set(Math.cos(ang) * 0.62, -1.05, Math.sin(ang) * 0.62);
          leg.rotation.z = -Math.cos(ang) * 0.65;
          leg.rotation.x = Math.sin(ang) * 0.65;
          register(leg, `Sợi lông đuôi bám thụ thể #${i + 1}`, [Math.cos(ang) * 0.9, -0.6, Math.sin(ang) * 0.9]);
        }
        const hostMembrane = new THREE.Mesh(
          new THREE.CylinderGeometry(2.6, 2.6, 0.14, 32),
          shellMat(0x22c55e, 0.36)
        );
        hostMembrane.position.set(0, -1.72, 0);
        register(hostMembrane, 'Màng tế bào vi khuẩn chủ E. coli', [0, -0.8, 0], true);
        addLabel('Thực khuẩn thể T4 (Bacteriophage)', [0, 2.3, 0], 0xc4b5fd);

        let injProg = 0;
        onLiveUpdate = (_t, dt, _p, flags) => {
          injProg = THREE.MathUtils.damp(injProg, flags.injected ? 1 : 0, 5, dt);
          const ph = parts.find((pt) => pt.mesh === head);
          const ps = parts.find((pt) => pt.mesh === sheath);
          if (ph) ph.home.y = THREE.MathUtils.lerp(1.25, 0.65, injProg);
          if (ps) ps.home.y = THREE.MathUtils.lerp(0.05, -0.4, injProg);
          sheath.scale.y = THREE.MathUtils.lerp(1, 0.55, injProg);
          sheath.scale.x = THREE.MathUtils.lerp(1, 1.32, injProg);
          sheath.scale.z = THREE.MathUtils.lerp(1, 1.32, injProg);
        };
        customEmit = (_t, _dt, _p, flags) => {
          if (flags.injected) {
            gpuPool.spawn(0, 0.45, 0, 0, -2.8, 0, 0.8, 0.95, 0xfacc15);
          }
        };
        break;
      }

      case 'plant_vascular_3d': {
        const stemShell = new THREE.Mesh(
          new THREE.CylinderGeometry(1.35, 1.35, 2.8, 24, 1, true),
          shellMat(0x22c55e, 0.28)
        );
        register(stemShell, 'Vỏ thân cây (Lục mô)', [0, 0, 0.8], true);
        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          const xylem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.14, 0.14, 2.7, 12),
            new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.25 })
          );
          xylem.position.set(Math.cos(ang) * 0.65, 0, Math.sin(ang) * 0.65);
          register(xylem, 'Mạch gỗ (Xylem) dẫn Nước + Muối khoáng lên', [Math.cos(ang) * 0.7, 0, Math.sin(ang) * 0.7]);
          const phloem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.11, 0.11, 2.7, 12),
            new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.35 })
          );
          phloem.position.set(Math.cos(ang) * 1.0, 0, Math.sin(ang) * 1.0);
          register(phloem, 'Mạch rây (Phloem) dẫn Đường hữu cơ xuống', [Math.cos(ang) * 1.0, 0, Math.sin(ang) * 1.0]);
        }
        addLabel('Mạch gỗ (↑ H₂O) & Mạch rây (↓ Saccarozơ)', [0, 1.75, 0], 0x7dd3fc);
        customEmit = (_t, _dt, params, flags) => {
          const open = flags.abaClosed ? 10 : (params.stomata ?? 70);
          const hum = params.humidity ?? 55;
          const pull = Math.max(0.2, (open * (100 - hum)) / 1800);
          if (Math.random() < Math.min(0.85, 0.2 + pull)) {
            gpuPool.spawn(0.65, -1.2, 0, 0, 1.2 + pull * 1.8, 0, 1.1, 0.85, 0x38bdf8);
          }
          if (Math.random() < 0.35) {
            gpuPool.spawn(1.0, 1.2, 0, 0, -1.6, 0, 1.1, 0.85, 0xfacc15);
          }
        };
        break;
      }

      case 'ecosystem_biome_3d': {
        const tierSpecs = [
          { w: 3.1, col: 0x10b981, y: -1.1, lbl: 'Bậc 1: Sinh vật sản xuất (100%)' },
          { w: 2.3, col: 0x0ea5e9, y: -0.3, lbl: 'Bậc 2: Động vật ăn cỏ' },
          { w: 1.5, col: 0xf59e0b, y: 0.5, lbl: 'Bậc 3: Động vật ăn thịt 1' },
          { w: 0.8, col: 0xef4444, y: 1.3, lbl: 'Bậc 4: Đỉnh chuỗi thức ăn' }
        ];
        const tierMeshes: THREE.Mesh[] = [];
        tierSpecs.forEach((ts, idx) => {
          const slab = new THREE.Mesh(
            new THREE.BoxGeometry(ts.w, 0.55, ts.w),
            new THREE.MeshStandardMaterial({ color: ts.col, roughness: 0.35 })
          );
          slab.position.set(0, ts.y, 0);
          register(slab, ts.lbl, [0, idx * 0.55, 0]);
          tierMeshes.push(slab);
        });
        addLabel('Tháp Năng lượng Sinh thái (H ≈ 10%)', [0, 2.15, 0], 0x6ee7b7);

        onLiveUpdate = (_t, dt, params) => {
          const effRatio = (params.effPct ?? 10) / 10;
          const baseScale = 0.8 + ((params.baseKcal ?? 10) / 100) * 0.45;
          tierMeshes.forEach((m, idx) => {
            const targetSc = baseScale * Math.pow(0.85 + 0.15 * effRatio, idx);
            m.scale.x = THREE.MathUtils.damp(m.scale.x, targetSc, 5, dt);
            m.scale.z = THREE.MathUtils.damp(m.scale.z, targetSc, 5, dt);
          });
        };
        customEmit = (_t, _dt, _p, flags) => {
          if (flags.showLoss && Math.random() < 0.35) {
            const lvl = Math.floor(Math.random() * 3);
            const y0 = -1.1 + lvl * 0.8;
            const ang = Math.random() * Math.PI * 2;
            gpuPool.spawn(Math.cos(ang) * 0.9, y0, Math.sin(ang) * 0.9, Math.cos(ang) * 0.9, 1.1, Math.sin(ang) * 0.9, 0.9, 0.75, 0xf97316);
          }
        };
        break;
      }

      case 'mendel_peas_3d': {
        rotateRoot = false;
        bioAccentLight.color.setHex(0x22c55e);
        const potMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.72 });
        const soilMat = new THREE.MeshStandardMaterial({ color: 0x3f2e21, roughness: 0.92 });
        const greenStemMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.45 });
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4, side: THREE.DoubleSide });
        const purpleFlowerMat = new THREE.MeshStandardMaterial({
          color: 0x9333ea,
          emissive: 0x581c87,
          emissiveIntensity: 0.38,
          roughness: 0.3
        });
        const whiteFlowerMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
        const yellowPeaMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.22, metalness: 0.1 });
        const greenPeaMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.28 });

        const makePot = (x: number, lbl: string) => {
          const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.32, 0.55, 20), potMat);
          pot.position.set(x, -1.78, 0);
          register(pot, lbl, [0, -0.5, 0]);
          const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 20), soilMat);
          soil.position.set(x, -1.5, 0);
          register(soil, lbl, [0, -0.5, 0]);
        };
        makePot(-2.1, 'Chậu cây bố P₁');
        makePot(0.0, 'Chậu cây mẹ P₂ / F₁');

        const makeFlower = (x: number, y: number, pMat: THREE.Material, lbl: string) => {
          const fg = new THREE.Group();
          fg.position.set(x, y, 0.15);
          for (let k = 0; k < 5; k++) {
            const ang = (k * Math.PI * 2) / 5;
            const petal = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), pMat);
            petal.scale.set(1.1, 0.45, 0.7);
            petal.position.set(Math.cos(ang) * 0.2, Math.sin(ang) * 0.2, 0);
            fg.add(petal);
          }
          const core = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 14, 14),
            new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.4 })
          );
          fg.add(core);
          register(fg, lbl, [0, 0.5, 0]);
          return fg;
        };

        // Left Plant P1
        const stem1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.75, 12), greenStemMat);
        stem1.position.set(-2.1, -0.25, 0);
        register(stem1, 'Cây bố P₁: Thân cao · Hoa Tím · Hạt Vàng Trơn', [-0.7, 0, 0]);
        for (let i = 0; i < 4; i++) {
          const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), leafMat);
          leaf.scale.set(1.4, 0.22, 0.7);
          leaf.position.set(-2.1 + (i % 2 === 0 ? 0.35 : -0.35), -0.95 + i * 0.52, 0.1);
          register(leaf, 'Lá đậu Hà Lan P₁', [-0.6, 0, 0]);
        }
        const flower1 = makeFlower(-2.1, 1.25, purpleFlowerMat, 'Hoa Tím trội (Tính trạng màu hoa P₁)');
        pulsers.push({ mesh: flower1, phase: 0 });

        // Right Plant P2 / F1
        const isDihybrid = mendelPreset === 'dihybrid';
        const isTest = mendelPreset === 'testcross';
        const p2Height = isDihybrid ? 2.55 : 1.55;
        const stem2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, p2Height, 12), greenStemMat);
        stem2.position.set(0.0, -1.5 + p2Height * 0.5, 0);
        register(
          stem2,
          isDihybrid ? 'Cây F₁ dị hợp AaBb (Cao · Vàng Trơn)' : 'Cây P₂ thân thấp (aa/aabb) · Hoa Trắng',
          [0, 0, 0]
        );
        const flower2 = makeFlower(
          0.0,
          -1.5 + p2Height + 0.12,
          isDihybrid ? purpleFlowerMat : whiteFlowerMat,
          isDihybrid ? 'Hoa Tím dị hợp F₁' : 'Hoa Trắng lặn (P₂)'
        );

        // Cross pollination arc (shown ONLY after pollination triggered)
        const pollArc = createCrispLine2(
          [
            [-2.1, 1.35, 0.15],
            [-1.05, 1.95, 0.25],
            [0.0, flower2.position.y + 0.1, 0.15]
          ],
          { color: 0xfacc15, linewidth: 2.5, dashed: true }
        );
        pollArc.visible = false;
        root.add(pollArc);

        // Pea Pod + Seeds (revealed ONLY when podOpened is triggered)
        const podHull = new THREE.Mesh(new THREE.CapsuleGeometry(0.45, 2.1, 12, 20), shellMat(0x4ade80, 0.42));
        podHull.rotation.z = Math.PI / 2;
        podHull.position.set(-1.05, -1.35, 1.1);
        register(podHull, 'Quả đậu F₂ mở vỏ quan sát các hạt con', [0, -0.5, 0.8], true);

        const seedColors = isDihybrid
          ? [yellowPeaMat, yellowPeaMat, yellowPeaMat, greenPeaMat]
          : [yellowPeaMat, isTest ? greenPeaMat : yellowPeaMat, yellowPeaMat, greenPeaMat];
        const peaMeshes: THREE.Mesh[] = [];
        seedColors.forEach((sMat, idx) => {
          const pea = new THREE.Mesh(
            idx === 3 ? new THREE.DodecahedronGeometry(0.22, 0) : new THREE.SphereGeometry(0.22, 18, 18),
            sMat
          );
          pea.position.set(-1.72 + idx * 0.45, -1.35, 1.1);
          register(pea, idx === 3 ? 'Hạt Xanh Nhăn (aabb)' : 'Hạt Vàng Trơn (A_B_)', [0, -0.3, 0.9]);
          peaMeshes.push(pea);
        });

        // 3D F2 Ratio Bar Prism on Right
        const barSpecs = isDihybrid
          ? [
              { h: 2.25, col: 0xfacc15, lbl: '9/16 Vàng Trơn (A_B_)' },
              { h: 0.75, col: 0xf97316, lbl: '3/16 Vàng Nhăn (A_bb)' },
              { h: 0.75, col: 0x22c55e, lbl: '3/16 Xanh Trơn (aaB_)' },
              { h: 0.25, col: 0x15803d, lbl: '1/16 Xanh Nhăn (aabb)' }
            ]
          : isTest
          ? [
              { h: 1.0, col: 0xfacc15, lbl: '1/4 AaBb' },
              { h: 1.0, col: 0xf97316, lbl: '1/4 Aabb' },
              { h: 1.0, col: 0x22c55e, lbl: '1/4 aaBb' },
              { h: 1.0, col: 0x15803d, lbl: '1/4 aabb' }
            ]
          : [
              { h: 2.1, col: 0x9333ea, lbl: '3/4 Hoa Tím / Thân Cao (A_)' },
              { h: 0.7, col: 0xe2e8f0, lbl: '1/4 Hoa Trắng / Thân Thấp (aa)' }
            ];

        const barEntries: { mesh: THREE.Mesh; targetH: number }[] = [];
        barSpecs.forEach((b, idx) => {
          const bx = 1.45 + idx * 0.56;
          const bar = new THREE.Mesh(
            new THREE.BoxGeometry(0.42, b.h, 0.42),
            new THREE.MeshStandardMaterial({ color: b.col, roughness: 0.3 })
          );
          bar.position.set(bx, -1.9 + b.h * 0.5, 0);
          register(bar, b.lbl, [0.5, 0.3, 0]);
          barEntries.push({ mesh: bar, targetH: b.h });
        });

        addLabel('Thụ phấn chéo (P₁ ♂ → P₂/F₁ ♀)', [-2.15, 2.25, 0.15], 0xfde047, [-0.65, 1.35, 0]);
        addLabel(
          isDihybrid ? 'Tỉ lệ F₂: 9 : 3 : 3 : 1' : isTest ? 'Lai phân tích 1 : 1 : 1 : 1' : 'Phân li F₂: 3 : 1',
          [2.45, 1.55, 0],
          0x86efac,
          [1.65, 0.55, 0]
        );

        let podReveal = 0;
        const targetY = flower2.position.y + 0.1;
        onLiveUpdate = (_t, dt, _p, flags) => {
          const poll = Boolean(flags.pollinated);
          const pod = Boolean(flags.podOpened);
          pollArc.visible = poll;
          podReveal = THREE.MathUtils.damp(podReveal, pod ? 1 : 0, 5, dt);

          podHull.visible = podReveal > 0.03;
          podHull.scale.setScalar(Math.max(0.01, podReveal));
          peaMeshes.forEach((pm) => {
            pm.visible = podReveal > 0.03;
            pm.scale.setScalar(Math.max(0.01, podReveal));
          });
          barEntries.forEach((be) => {
            be.mesh.visible = podReveal > 0.03;
            const sy = Math.max(0.01, podReveal);
            be.mesh.scale.y = sy;
            const pb = parts.find((pt) => pt.mesh === be.mesh);
            if (pb) pb.home.y = -1.9 + be.targetH * 0.5 * sy;
          });
        };

        customEmit = (t, _dt, _p, flags) => {
          if (!flags.pollinated) return;
          const u = (t * 0.75) % 1;
          const px = -2.1 + u * 2.1;
          const py = THREE.MathUtils.lerp(1.3, targetY, u) + Math.sin(u * Math.PI) * 0.72;
          gpuPool.spawn(px, py, 0.15 + Math.sin(t * 7) * 0.06, 0, 0.05, 0, 0.35, 1.15, 0xfacc15);
        };
        break;
      }

      case 'population_genetics_3d': {
        const blocks = [
          { x: -1.4, h: 2.6, col: 0x38bdf8, lbl: 'Kiểu gen AA (p²)' },
          { x: 0.0, h: 2.6, col: 0x10b981, lbl: 'Kiểu gen dị hợp Aa (2pq)' },
          { x: 1.4, h: 2.6, col: 0xf43f5e, lbl: 'Kiểu gen aa (q²)' }
        ];
        const barMeshes: THREE.Mesh[] = [];
        blocks.forEach((b) => {
          const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.95, b.h, 0.95),
            new THREE.MeshStandardMaterial({ color: b.col, roughness: 0.28, metalness: 0.15 })
          );
          mesh.position.set(b.x, -1.8 + b.h * 0.5, 0);
          register(mesh, b.lbl, [b.x * 0.4, 0.4, 0]);
          barMeshes.push(mesh);
        });
        addLabel('Cân bằng Hardy–Weinberg: p² + 2pq + q² = 1', [0, 1.45, 0], 0x7dd3fc);

        onLiveUpdate = (_t, dt, params, flags) => {
          const pf = params.pFreq ?? 0.6;
          const qf = 1 - pf;
          const het = flags.inbreeding ? pf * qf : 2 * pf * qf;
          const fAA = pf * pf + (flags.inbreeding ? 0.5 * pf * qf : 0);
          const faa = qf * qf + (flags.inbreeding ? 0.5 * pf * qf : 0);
          const vals = [Math.max(0.04, fAA), Math.max(0.04, het), Math.max(0.04, faa)];
          barMeshes.forEach((m, idx) => {
            const targetScale = vals[idx] * 1.15;
            m.scale.y = THREE.MathUtils.damp(m.scale.y, targetScale, 6, dt);
            const pb = parts.find((pt) => pt.mesh === m);
            if (pb) pb.home.y = -1.8 + 2.6 * 0.5 * m.scale.y;
          });
        };
        break;
      }

      case 'endocrine_pancreas_3d': {
        bioAccentLight.color.setHex(0x38bdf8);
        const capillary = new THREE.Mesh(
          new THREE.CylinderGeometry(0.38, 0.38, 4.4, 20),
          new THREE.MeshPhysicalMaterial({ color: 0xe11d48, transparent: true, opacity: 0.65, roughness: 0.2 })
        );
        capillary.rotation.z = Math.PI / 2;
        capillary.position.set(0, -0.65, 0);
        register(capillary, 'Mao mạch máu vận chuyển Glucose & Hoocmôn', [0, -0.6, 0]);
        const betaMats: THREE.MeshStandardMaterial[] = [];
        const alphaMats: THREE.MeshStandardMaterial[] = [];
        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          const isBeta = i % 2 === 0;
          const cMat = new THREE.MeshStandardMaterial({
            color: isBeta ? 0x0ea5e9 : 0xf59e0b,
            emissive: isBeta ? 0x0284c7 : 0xd97706,
            emissiveIntensity: 0.2,
            roughness: 0.3
          });
          if (isBeta) betaMats.push(cMat);
          else alphaMats.push(cMat);
          const cell = new THREE.Mesh(new THREE.SphereGeometry(0.46, 18, 18), cMat);
          cell.position.set(Math.cos(ang) * 1.15, 0.55 + (i % 2) * 0.35, Math.sin(ang) * 0.95);
          register(
            cell,
            isBeta ? 'Tế bào β đảo tụy (Tiết Insulin)' : 'Tế bào α đảo tụy (Tiết Glucagon)',
            [Math.cos(ang) * 0.7, 0.5, Math.sin(ang) * 0.7]
          );
          pulsers.push({ mesh: cell, phase: i * 0.4 });
        }
        addLabel('Đảo tụy Langerhans (Insulin ↔ Glucagon)', [0, 1.85, 0], 0x7dd3fc);

        onLiveUpdate = (t, _dt, params) => {
          const g = params.glucoseMg ?? 95;
          const highG = g > 120;
          const lowG = g < 75;
          betaMats.forEach((m) => {
            m.emissiveIntensity = highG ? 0.6 + Math.sin(t * 6) * 0.3 : 0.15;
          });
          alphaMats.forEach((m) => {
            m.emissiveIntensity = lowG ? 0.6 + Math.sin(t * 6) * 0.3 : 0.15;
          });
        };
        customEmit = (_t, _dt, params) => {
          const g = params.glucoseMg ?? 95;
          if (g > 120 && Math.random() < 0.6) {
            gpuPool.spawn((Math.random() - 0.5) * 1.2, 0.45, 0, 0, -1.1, 0, 0.85, 0.9, 0x38bdf8);
          } else if (g < 75 && Math.random() < 0.6) {
            gpuPool.spawn((Math.random() - 0.5) * 1.2, 0.65, 0, 0, -1.1, 0, 0.85, 0.9, 0xfacc15);
          }
          if (Math.random() < Math.min(0.85, g / 180)) {
            gpuPool.spawn(-2.0, -0.65 + (Math.random() - 0.5) * 0.2, 0, 3.8, 0, 0, 1.0, 0.75, 0xf8fafc);
          }
        };
        break;
      }

      case 'biotech_pcr_crispr_3d': {
        bioAccentLight.color.setHex(0xa855f7);
        const cas9 = new THREE.Mesh(new THREE.SphereGeometry(1.15, 24, 20), shellMat(0x8b5cf6, 0.38));
        cas9.scale.set(1.25, 0.95, 1.0);
        register(cas9, 'Enzyme Taq Polymerase / Phức hệ Cas9', [0, 0.6, 0], true);
        const strandA = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.11, 4.2, 16),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 })
        );
        strandA.rotation.z = Math.PI / 2;
        strandA.position.set(0, 0.3, 0.2);
        register(strandA, 'Mạch DNA khuôn 5’→3’', [0, 0.6, 0]);
        const strandB = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.11, 4.2, 16),
          new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 })
        );
        strandB.rotation.z = Math.PI / 2;
        strandB.position.set(0, -0.3, 0.2);
        register(strandB, 'Mạch DNA khuôn 3’→5’', [0, -0.6, 0]);

        const primer = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.09, 1.8, 14),
          new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.4 })
        );
        primer.rotation.z = Math.PI / 2;
        primer.position.set(-1.1, 0.0, 0.25);
        register(primer, 'Đoạn mồi PCR / sgRNA dẫn đường', [0, -0.3, 0.5]);
        addLabel('Chu kì PCR (95°C → 55°C → 72°C) & CRISPR', [0, 1.85, 0], 0xd8b4fe);

        onLiveUpdate = (t, dt, params) => {
          const temp = params.tempC ?? 72;
          const isDenature = temp >= 88;
          const isAnneal = temp <= 60;
          bioAccentLight.color.setHex(isDenature ? 0xf43f5e : isAnneal ? 0x38bdf8 : 0x10b981);

          const sep = isDenature ? 0.85 : isAnneal ? 0.45 : 0.28;
          const pa = parts.find((pt) => pt.mesh === strandA);
          const pb = parts.find((pt) => pt.mesh === strandB);
          const pp = parts.find((pt) => pt.mesh === primer);
          if (pa) pa.home.y = THREE.MathUtils.damp(pa.home.y, sep, 5, dt);
          if (pb) pb.home.y = THREE.MathUtils.damp(pb.home.y, -sep, 5, dt);
          if (pp) {
            const targetX = isDenature ? -1.4 : isAnneal ? -0.9 : -0.9 + ((t * 1.1) % 2.1);
            const targetY = isDenature ? -1.1 : 0.14;
            pp.home.x = THREE.MathUtils.damp(pp.home.x, targetX, 5, dt);
            pp.home.y = THREE.MathUtils.damp(pp.home.y, targetY, 5, dt);
          }
        };
        customEmit = (_t, _dt, params) => {
          const temp = params.tempC ?? 72;
          if (temp > 62 && temp < 86 && Math.random() < 0.35) {
            gpuPool.spawn((Math.random() - 0.5) * 1.5, 0, 0.2, 0.9, 0.4, 0, 0.65, 0.8, 0x34d399);
          }
        };
        break;
      }

      case 'gene_linkage_3d': {
        const mat1 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
        const mat2 = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
        const ch1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 2.5, 10, 16), mat1);
        ch1.position.set(-0.65, 0, 0);
        ch1.rotation.z = -0.22;
        register(ch1, 'NST tương đồng mang gen AB', [-0.7, 0, 0]);
        const ch2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 2.5, 10, 16), mat2);
        ch2.position.set(0.65, 0, 0);
        ch2.rotation.z = 0.22;
        register(ch2, 'NST tương đồng mang gen ab', [0.7, 0, 0]);
        const chiasma = new THREE.Mesh(
          new THREE.SphereGeometry(0.28, 18, 18),
          new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.55 })
        );
        chiasma.position.set(0, 0.25, 0);
        register(chiasma, 'Điểm bắt chéo Chiasma (Tạo giao tử Ab, aB)', [0, 0.6, 0]);
        addLabel('Hoán vị gen Morgan (f_HV ≤ 50%)', [0, 1.85, 0], 0xfde047);

        onLiveUpdate = (t, dt, params, flags) => {
          const cross = Boolean(flags.crossover) && (params.fPct ?? 20) > 0;
          chiasma.visible = cross;
          const angle = cross ? 0.22 + ((params.fPct ?? 20) / 50) * 0.14 : 0.0;
          ch1.rotation.z = THREE.MathUtils.damp(ch1.rotation.z, -angle, 5, dt);
          ch2.rotation.z = THREE.MathUtils.damp(ch2.rotation.z, angle, 5, dt);
          const p1 = parts.find((pt) => pt.mesh === ch1);
          const p2 = parts.find((pt) => pt.mesh === ch2);
          if (p1) p1.home.x = cross ? -0.42 : -0.75;
          if (p2) p2.home.x = cross ? 0.42 : 0.75;
          if (cross) chiasma.scale.setScalar(1 + Math.sin(t * 4) * 0.12);
        };
        break;
      }

      case 'plant_flower_seed_3d':
      case 'comparative_hearts_3d':
      case 'digestive_tract_3d':
      case 'invertebrate_biodiversity_3d':
      case 'plant_tropism_germination_3d':
      case 'skeleton_senses_3d': {
        const res = buildMiddleSchool3DBioScene({
          mode,
          parts,
          pulsers,
          gpuPool,
          bioAccentLight,
          register,
          addLabel,
          shellMat
        });
        onLiveUpdate = res.onLiveUpdate;
        customEmit = res.customEmit;
        break;
      }

      case 'biomolecules_3d': {
        const waterGrp = new THREE.Group();
        const glucoseGrp = new THREE.Group();
        const proteinGrp = new THREE.Group();
        const lipidGrp = new THREE.Group();
        root.add(waterGrp, glucoseGrp, proteinGrp, lipidGrp);

        const hBondLines: THREE.Mesh[] = [];
        const oMat = new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.25, clearcoat: 0.7 });
        const hMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35 });
        const hbMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.72 });

        // 1. Water H-bond cluster (5 tetrahedral molecules)
        const wCoords: [number, number, number][] = [
          [0, 0, 0],
          [1.25, 0.85, 0.45],
          [-1.25, 0.85, -0.45],
          [0.45, -1.05, 1.05],
          [-0.45, -1.05, -1.05]
        ];
        wCoords.forEach(([wx, wy, wz], idx) => {
          const mol = new THREE.Group();
          mol.position.set(wx, wy, wz);
          const ox = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), oMat);
          const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 14), hMat);
          h1.position.set(0.32, 0.24, 0);
          const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 14), hMat);
          h2.position.set(-0.32, 0.24, 0);
          mol.add(ox, h1, h2);
          register(mol, `Phân tử Nước H₂O #${idx + 1} (O δ⁻ – H δ⁺)`, [wx, wy, wz]);
          waterGrp.add(mol);
          if (idx > 0) {
            const pA = new THREE.Vector3(0, 0, 0);
            const pB = new THREE.Vector3(wx, wy, wz);
            const dist = pA.distanceTo(pB);
            const link = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, dist, 8), hbMat);
            link.position.copy(pA).add(pB).multiplyScalar(0.5);
            link.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pB.clone().sub(pA).normalize());
            waterGrp.add(link);
            hBondLines.push(link);
          }
        });

        // 2. α-Glucose hexagonal ring
        const cMat = new THREE.MeshPhysicalMaterial({ color: 0x10b981, roughness: 0.3, clearcoat: 0.5 });
        const oRingMat = new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, roughness: 0.3, clearcoat: 0.6 });
        for (let k = 0; k < 6; k++) {
          const ang = (k / 6) * Math.PI * 2;
          const r = 1.15;
          const atom = new THREE.Mesh(
            new THREE.SphereGeometry(0.22, 18, 18),
            k === 0 ? oRingMat : cMat
          );
          atom.position.set(Math.cos(ang) * r, (k % 2 === 0 ? 0.14 : -0.14), Math.sin(ang) * r);
          register(atom, k === 0 ? 'Nguyên tử Oxi trong vòng Pyranozơ' : `Cacbon vòng Glucozơ C${k}`, [atom.position.x, atom.position.y, atom.position.z]);
          glucoseGrp.add(atom);
        }

        // 3. Protein 3D helical strand (responds to denaturation tempC > 58)
        const aaSpheres: THREE.Mesh[] = [];
        const aaCols = [0x10b981, 0x38bdf8, 0xf59e0b, 0xa855f7, 0xf43f5e];
        for (let i = 0; i < 14; i++) {
          const sp = new THREE.Mesh(
            new THREE.SphereGeometry(0.22, 18, 18),
            new THREE.MeshPhysicalMaterial({ color: aaCols[i % aaCols.length], roughness: 0.28, clearcoat: 0.7 })
          );
          register(sp, `Axit amin #${i + 1} (Chuỗi Polypeptide)`, [0, 0, 0]);
          proteinGrp.add(sp);
          aaSpheres.push(sp);
        }

        // 4. Phospholipid bilayer miniature patch
        const headMat = new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, roughness: 0.25, clearcoat: 0.8 });
        const tailMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
        for (let ix = -1; ix <= 1; ix++) {
          for (let iz = -1; iz <= 1; iz++) {
            const hx = ix * 0.72;
            const hz = iz * 0.72;
            const hTop = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), headMat);
            hTop.position.set(hx, 0.95, hz);
            const hBot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), headMat);
            hBot.position.set(hx, -0.95, hz);
            const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 1.5, 8), tailMat);
            t1.position.set(hx - 0.07, 0, hz);
            const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 1.5, 8), tailMat);
            t2.position.set(hx + 0.07, 0, hz);
            lipidGrp.add(hTop, hBot, t1, t2);
          }
        }
        register(lipidGrp, 'Lớp kép Phospholipid (Đầu ưa nước – Đuôi kị nước)', [0, 0, 0]);

        addLabel('Nước & 4 Đại Phân Tử Sinh Học 3D', [0, 2.0, 0], 0x6ee7b7);

        let unfoldProg = 0;
        onLiveUpdate = (t, dt, params, flags) => {
          const grp = Math.round(params.molGroup ?? 3);
          const temp = params.tempC ?? 37;
          waterGrp.visible = grp === 1;
          glucoseGrp.visible = grp === 2;
          proteinGrp.visible = grp === 3;
          lipidGrp.visible = grp === 4;

          hBondLines.forEach((l) => {
            l.visible = Boolean(flags.showHBonds !== false) && temp < 80;
          });

          const targetUnfold = grp === 3 && temp > 58 ? 1 : 0;
          unfoldProg = THREE.MathUtils.damp(unfoldProg, targetUnfold, 4, dt);
          aaSpheres.forEach((sp, i) => {
            const u = i / 13;
            const ang = u * Math.PI * 4.5 + t * 0.8;
            const fx = Math.cos(ang) * 0.9;
            const fy = (u - 0.5) * 2.2;
            const fz = Math.sin(ang) * 0.9;
            const ux = (u - 0.5) * 3.6;
            const uy = Math.sin(u * Math.PI * 2 + t * 3) * 0.25;
            const uz = 0;
            const part = parts.find((pt) => pt.mesh === sp);
            if (part) {
              part.home.set(
                THREE.MathUtils.lerp(fx, ux, unfoldProg),
                THREE.MathUtils.lerp(fy, uy, unfoldProg),
                THREE.MathUtils.lerp(fz, uz, unfoldProg)
              );
            }
          });
          glucoseGrp.rotation.y = t * 0.55;
        };
        break;
      }

      default: {
        // eukaryotic_cell_3d
        const outerShell = new THREE.Mesh(
          new THREE.SphereGeometry(1.85, 32, 24, 0, Math.PI * 1.45),
          shellMat(0x10b981, 0.32)
        );
        register(outerShell, 'Màng sinh chất / Thành tế bào Xenlulozơ', [1.2, 0, 0], true);
        const nucleus = new THREE.Mesh(
          new THREE.SphereGeometry(0.68, 24, 24),
          new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.35 })
        );
        register(nucleus, 'Nhân tế bào chứa DNA điều khiển di truyền', [0, 0.9, 0]);
        const mito = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.24, 0.55, 10, 18),
          new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35 })
        );
        mito.position.set(0.95, -0.4, 0.5);
        mito.rotation.z = 0.7;
        register(mito, 'Ti thể (Tổng hợp năng lượng ATP)', [1.1, -0.4, 0.6]);
        const chloro = new THREE.Mesh(
          new THREE.SphereGeometry(0.35, 18, 18),
          new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.3 })
        );
        chloro.scale.set(1.5, 0.7, 1.0);
        chloro.position.set(-0.95, -0.35, 0.45);
        register(chloro, 'Lục lạp (Chỉ có ở Thực vật)', [-1.1, -0.3, 0.5]);
        const golgi = new THREE.Mesh(
          new THREE.TorusGeometry(0.42, 0.08, 12, 24, Math.PI * 1.2),
          new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.35 })
        );
        golgi.position.set(0.2, 0.3, 0.95);
        register(golgi, 'Bộ máy Golgi đóng gói & tiết Protein', [0.2, 0.3, 1.2]);
        addLabel('Tế bào Nhân thực (Nhân · Ti thể · Lục lạp · Golgi)', [0, 2.05, 0], 0x6ee7b7);

        onLiveUpdate = (_t, dt, params, flags) => {
          chloro.visible = Boolean(flags.plantMode);
          const act = (params.activity ?? 70) / 70;
          mito.rotation.y += dt * 1.2 * act;
          golgi.rotation.z += dt * 0.5 * act;
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
      floorY: -2.06,
      maxRadius: 4.6,
      accentColor: 0x10b981,
      onPartClick: (hitObj) => {
        const lbl = hitObj.userData?.partLabel || '';
        if (lbl) setSelectedPart(lbl);
      },
      onDragStatusChange: ({ moved }) => {
        setFloorModelMoved(moved);
      }
    });
    floorDragRef.current = floorDrag;

    const onResize = () => {
      const nw = container.clientWidth || 720;
      const nh = container.clientHeight || 430;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      anaglyphEffect.setSize(nw, nh);
      stereoEffect.setSize(nw, nh);
      pipeline?.setSize(nw, nh);
      syncLine2Resolution(scene, nw, nh);
    };
    window.addEventListener('resize', onResize);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    ro?.observe(container);

    let frameId = 0;
    let disposed = false;
    let lastTs = performance.now();
    let elapsed = 0;
    let lastStepTrigger = stepTriggerRef.current;
    let hudCounter = 0;
    const appliedHoloOffset = new THREE.Vector3();
    let lastHoloMode: HologramDisplayMode = 'normal';

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

    const animate = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;

      // Graphics-tier-aware incoming studio light sweep animation
      const wallT = now * 0.001;
      if (!isSmooth) {
        rimLight.position.x = -5 + Math.sin(wallT * 0.45) * 1.4;
        rimLight.position.z = -5 + Math.cos(wallT * 0.36) * 1.2;
        bioAccentLight.intensity = (isUltra ? 1.75 : 1.05) + Math.sin(wallT * 1.25) * (isUltra ? 0.34 : 0.14);
        if (isUltra) {
          keyLight.position.x = 5 + Math.sin(wallT * 0.38) * 1.5;
          keyLight.position.z = 6 + Math.cos(wallT * 0.32) * 1.1;
          (rimRing.material as THREE.MeshBasicMaterial).opacity = 0.58 + 0.18 * Math.sin(wallT * 1.55);
        }
      }

      const stepped = lastStepTrigger !== stepTriggerRef.current;
      if (!pausedRef.current || stepped) {
        lastStepTrigger = stepTriggerRef.current;
        const effDt = !pausedRef.current ? dt * speedRef.current : 0.05;
        elapsed += effDt;
        simTimeRef.current = elapsed;
        if (rotateRoot) {
          root.rotation.y += effDt * 0.42;
        }
        pulsers.forEach((p) => {
          const s = 1 + Math.sin(elapsed * 3.5 + p.phase) * 0.08;
          p.mesh.scale.set(s, s, s);
        });
        onLiveUpdate?.(elapsed, effDt, modeParamsRef.current, expFlagsRef.current);
        customEmit?.(elapsed, effDt, modeParamsRef.current, expFlagsRef.current);
        gpuPool.update(effDt, 0);
      }

      hudCounter++;
      if (hudCounter % 18 === 0) {
        setSimClock(elapsed);
      }

      grid.visible = showGridRef.current;
      labelGroup.visible = showLabelsRef.current;
      if (showLabelsRef.current) {
        updateBillboardLabels(labelGroup, camera);
      }

      const ex = explodeRef.current / 100;
      parts.forEach((p) => {
        const tx = p.home.x + p.dir.x * ex * 1.4;
        const ty = p.home.y + p.dir.y * ex * 1.4;
        const tz = p.home.z + p.dir.z * ex * 1.4;
        p.mesh.position.x = THREE.MathUtils.damp(p.mesh.position.x, tx, 8, dt);
        p.mesh.position.y = THREE.MathUtils.damp(p.mesh.position.y, ty, 8, dt);
        p.mesh.position.z = THREE.MathUtils.damp(p.mesh.position.z, tz, 8, dt);
      });
      shellMeshes.forEach((sm) => {
        const mat = sm.material as THREE.Material;
        const baseOp = typeof sm.userData.origOpacity === 'number' ? sm.userData.origOpacity : 0.34;
        mat.opacity = xrayRef.current ? Math.min(0.14, baseOp * 0.38) : baseOp;
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

      if (isSoftwareGl) afterDraw(animate);
      else frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

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
      anaglyphEffect.dispose();
      gpuPool.dispose();
      pipeline?.dispose();
      controls.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [mode, isSoftwareGl, perfMode, mendelPreset, headOffsetRef]);

  const setCameraPreset = (preset: 'overview' | 'front' | 'top' | 'closeup') => {
    if (preset === 'overview') {
      cameraLerpRef.current = { pos: new THREE.Vector3(5.0, 3.5, 6.2), target: new THREE.Vector3(0, 0, 0) };
    } else if (preset === 'front') {
      cameraLerpRef.current = { pos: new THREE.Vector3(0, 1.1, 7.2), target: new THREE.Vector3(0, 0, 0) };
    } else if (preset === 'top') {
      cameraLerpRef.current = { pos: new THREE.Vector3(0, 8.2, 0.7), target: new THREE.Vector3(0, 0, 0) };
    } else {
      cameraLerpRef.current = { pos: new THREE.Vector3(2.4, 1.2, 3.2), target: new THREE.Vector3(0, 0, 0) };
    }
  };

  const handleLogSample = () => {
    const tVal = simTimeRef.current;
    setLoggedSamples((prev) => [
      ...prev,
      {
        idx: prev.length + 1,
        timeSec: tVal.toFixed(2),
        equation: readout.equationText,
        metrics: readout.metricsSummary
      }
    ]);
  };

  const handleExportCsv = () => {
    if (loggedSamples.length === 0) return;
    const rows = [
      ['STT', 'Thoi gian t (s)', 'Trang thai sinh hoc', 'Thong so do 3D'].join(','),
      ...loggedSamples.map((r) =>
        [r.idx, r.timeSec, `"${r.equation.replace(/"/g, '""')}"`, `"${r.metrics.replace(/"/g, '""')}"`].join(',')
      )
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bio-3d-${mode}-samples.csv`;
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
        return 'bg-teal-600 border-teal-400 text-white';
    }
  };

  const stageContent = (
    <div
      className={`bio-zone-frame sci-frame relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex flex-col ${
        isFullscreen ? 'flex-1 min-h-0 rounded-xl' : 'rounded-xl'
      }`}
    >
      <div className="bio-helix-sweep" />

      {/* TOP HUD BAR */}
      <div className="relative z-20 p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/95 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {(isFullscreen || onBack) && (
            <button
              type="button"
              onClick={() => (isFullscreen ? setIsFullscreen(false) : onBack?.())}
              className="sim-btn-bio flex items-center gap-1 px-2.5 py-1 rounded-md border border-teal-400/60 text-[11px] font-bold bg-teal-600 hover:bg-teal-700 text-white shrink-0 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isFullscreen ? 'Thu nhỏ' : 'Quay lại'}</span>
            </button>
          )}
          {embeddedBadge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-teal-500/15 border border-teal-400/40 text-teal-300 text-[10px] font-mono font-bold uppercase shrink-0">
              {embeddedBadge}
            </span>
          )}
          <Dna className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold text-white truncate">
            {title || cfg.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="sim-btn-bio inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
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
            className={`sim-btn-bio inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
              showLabels ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{showLabels ? 'Ẩn nhãn' : 'Nhãn 3D'}</span>
          </button>
          <button
            type="button"
            onClick={() => setXray((v) => !v)}
            className={`sim-btn-bio inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
              xray ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-200'
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

      {/* WEBGL CANVAS */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1 min-h-[260px]' : heightClass}`}>
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />
        {selectedPart && (
          <div className="absolute top-3 left-3 z-10 rounded-lg bg-slate-900/95 border border-emerald-500/40 px-3 py-1.5 text-xs text-emerald-200 font-semibold">
            {isEn ? 'Selected structure:' : 'Cấu trúc đã chọn:'} {selectedPart}
          </div>
        )}
        {floorModelMoved && (
          <button
            type="button"
            onClick={() => floorDragRef.current?.resetPosition()}
            className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-teal-600 border border-teal-500/40 text-[11px] font-semibold text-teal-200 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isEn ? 'Reset floor position' : 'Đặt lại vị trí sàn 3D'}</span>
          </button>
        )}
      </div>

      {/* COLLAPSIBLE CONTROL DOCK */}
      <div className="border-t border-slate-800 bg-slate-900/95 px-3 py-2.5 text-xs text-slate-200 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="font-bold text-slate-200 text-xs">Điều Khiển Mô Hình Sinh 3D</span>
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
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-teal-600 border border-slate-700 text-[10px] font-semibold text-slate-200 hover:text-white cursor-pointer whitespace-nowrap"
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
                  { id: 'closeup', label: 'Cận cảnh' }
                ] as const
              ).map((camP) => (
                <button
                  key={camP.id}
                  type="button"
                  onClick={() => setCameraPreset(camP.id)}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold text-slate-300 hover:bg-slate-800 hover:text-teal-300 cursor-pointer whitespace-nowrap"
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
                autoOrbit ? 'bg-teal-600 border-teal-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <RotateCw className={`w-3 h-3 ${autoOrbit ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Xoay 360°</span>
            </button>

            <button
              type="button"
              onClick={() => captureCanvasPng(canvasRef.current, `bio-3d-${mode}`)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-slate-200 cursor-pointer whitespace-nowrap"
            >
              <Camera className="w-3 h-3 text-emerald-400" />
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
                    speed === spd ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
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
            {mode === 'mendel_peas_3d' && (
              <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-950/70 border border-emerald-500/30 px-2.5 py-1.5 text-[11px]">
                <span className="font-bold text-emerald-300 mr-1">Phép lai Mendel:</span>
                {(
                  [
                    ['monohybrid', 'Lai 1 cặp (3:1)'],
                    ['dihybrid', 'Lai 2 cặp (9:3:3:1)'],
                    ['testcross', 'Lai phân tích (1:1:1:1)']
                  ] as const
                ).map(([id, lbl]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMendelPreset(id)}
                    className={`px-2 py-0.5 rounded font-semibold cursor-pointer whitespace-nowrap ${
                      mendelPreset === id
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            )}

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
                      className={`sim-btn-bio px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
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

            <div className="rounded-lg bg-slate-950/80 border border-slate-800 px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <span className="font-mono font-bold text-teal-300 tabular-nums">{readout.equationText}</span>
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
          Bảng Số Liệu Thực Nghiệm Sinh Học 3D ({loggedSamples.length} mẫu)
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold cursor-pointer whitespace-nowrap"
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
              label: 'Giá trị sinh học #1',
              color: '#14b8a6',
              values: loggedSamples.map((r) => {
                const m = (r.metrics + ' ' + r.equation).match(/-?\d+(\.\d+)?/);
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
              <th className="py-1.5 px-2">Trạng thái sinh học</th>
              <th className="py-1.5 px-2">Thông số đo 3D</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
            {loggedSamples.map((r) => (
              <tr key={r.idx}>
                <td className="py-1 px-2 tabular-nums">{r.idx}</td>
                <td className="py-1 px-2 tabular-nums text-sky-600 dark:text-sky-400">{r.timeSec}</td>
                <td className="py-1 px-2">{r.equation}</td>
                <td className="py-1 px-2 text-teal-600 dark:text-teal-400">{r.metrics}</td>
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
            ? 'space-y-2'
            : 'space-y-2'
        }
      >
        {stageContent}
        {telemetrySection}
      </div>
    </ViewportPortal>
  );
};
