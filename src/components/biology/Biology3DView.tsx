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
  Crosshair,
  Dna,
  Download,
  Eye,
  EyeOff,
  FolderUp,
  Grid,
  Info,
  Layers,
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
  Trash2,
  X,
  ZoomIn,
  ZoomOut
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
  createLeaderArrowLabel,
  createPostProcessingPipeline,
  createTroikaLabel,
  GPUParticlePool,
  LeaderArrowLabel,
  PostProcessPipeline,
  syncLine2Resolution,
  updateBillboardLabels
} from '../../lib/three3DEnhancements';
import { attachThreeFloorDrag, ThreeFloorDragHandle } from '../../lib/threeFloorDragController';
import { BioMaterialVault } from './engine/bioMaterials';
import {
  AnatomyBuildResult,
  AnatomySystemKey,
  buildHumanAnatomyExplorer,
  HUMAN_ANATOMY_LABEL_ANCHORS
} from './engine/bioAnatomyBuilder';
import { BioSceneHookContext, buildCellularBiologyScene } from './engine/bioCellularBuilders';
import { buildHumanOrganScene } from './engine/bioHumanOrganBuilders';
import { buildPlantBiologyScene } from './engine/bioPlantBuilders';
import { buildMicroEcologyScene } from './engine/bioMicroEcoBuilders';
import { buildGeneticsMiddleSchoolScene } from './engine/bioGeneticsMiddleSchoolBuilders';
import { getBiologyAssetSpec } from './engine/bioAssetRegistry';
import { disposeObjectTreeFull, loadBiologyGltfOrFallback } from './engine/bioGltfLoader';
import {
  AnatomyGltfSlotSpec,
  fetchAnatomyBundledManifest,
  HUMAN_ANATOMY_ASSET_SLOTS,
  loadAnatomyGltfSource,
  normalizeAndBindGltfOrgan,
  resolveSlotAvailability,
  splitCompositeAnatomyGltf
} from './engine/bioAnatomyAssetSystem';
import { AnatomyAssetManagerModal } from './AnatomyAssetManagerModal';
import {
  CameraPose,
  computeFocusPoseFromBox3,
  computeZoomStepPose,
  resolveFocusBoxForPart,
  resolveObjectWorldBox3,
  resolvePartVisibilityState,
  stepSmoothCameraTransition
} from './engine/bioCameraFocus';

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
  disposeObjectTreeFull(obj);
}

const ANATOMY_SYSTEM_META: Array<{ key: AnatomySystemKey; label: string; tone: string }> = [
  { key: 'skeletal', label: 'Hệ Xương', tone: 'border-slate-300 bg-slate-200/20 text-slate-100' },
  { key: 'muscular', label: 'Hệ Cơ', tone: 'border-rose-400 bg-rose-500/20 text-rose-200' },
  { key: 'circulatory', label: 'Tuần hoàn', tone: 'border-red-400 bg-red-500/20 text-red-200' },
  { key: 'respiratory', label: 'Hô hấp', tone: 'border-sky-400 bg-sky-500/20 text-sky-200' },
  { key: 'digestive', label: 'Tiêu hóa', tone: 'border-amber-400 bg-amber-500/20 text-amber-200' },
  { key: 'nervous', label: 'Thần kinh', tone: 'border-yellow-400 bg-yellow-500/20 text-yellow-200' },
  { key: 'urinary', label: 'Tiết niệu', tone: 'border-orange-400 bg-orange-500/20 text-orange-200' },
  { key: 'endocrine', label: 'Nội tiết', tone: 'border-emerald-400 bg-emerald-500/20 text-emerald-200' },
  { key: 'lymphatic', label: 'Miễn dịch', tone: 'border-teal-400 bg-teal-500/20 text-teal-200' },
  { key: 'reproductive', label: 'Sinh sản', tone: 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-200' },
  { key: 'sensory', label: 'Giác quan', tone: 'border-cyan-400 bg-cyan-500/20 text-cyan-200' }
];

function createDefaultAnatomyLayers(): Record<AnatomySystemKey, boolean> {
  return {
    skeletal: true,
    muscular: true,
    circulatory: true,
    respiratory: true,
    digestive: true,
    nervous: true,
    urinary: true,
    endocrine: true,
    lymphatic: true,
    reproductive: true,
    sensory: true
  };
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
  const cameraLerpRef = useRef<CameraPose | null>(null);

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
  const [selectedPartId, setSelectedPartId] = useState('');
  const [hiddenPartIds, setHiddenPartIds] = useState<string[]>([]);
  const [isolatedPartId, setIsolatedPartId] = useState<string | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [gltfLoading, setGltfLoading] = useState(false);
  const [anatomyLayers, setAnatomyLayers] = useState<Record<AnatomySystemKey, boolean>>(createDefaultAnatomyLayers);
  const [skinOpacity, setSkinOpacity] = useState(0.24);
  const [muscleOpacity, setMuscleOpacity] = useState(0.58);
  const [boneOpacity, setBoneOpacity] = useState(0.92);
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

  const rootRef = useRef<THREE.Group | null>(null);
  const interactablesRef = useRef<THREE.Object3D[]>([]);
  const anatomyRef = useRef<AnatomyBuildResult | null>(null);
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [bundledAnatomyFiles, setBundledAnatomyFiles] = useState<string[]>([]);
  const [sessionUploadedSlots, setSessionUploadedSlots] = useState<Map<string, string>>(() => new Map());
  const sessionGltfCacheRef = useRef<Map<string, THREE.Group>>(new Map());

  const assetSpec = useMemo(() => getBiologyAssetSpec(mode), [mode]);
  const anatomyAssetSummary = useMemo(
    () => resolveSlotAvailability(bundledAnatomyFiles, sessionUploadedSlots),
    [bundledAnatomyFiles, sessionUploadedSlots]
  );

  useEffect(() => {
    setModeParams(buildDefaultBioParams(mode));
    setExpFlags({ ...BIOLOGY_3D_CONFIGS[mode].defaultFlags });
    setSelectedPart('');
    setSelectedPartId('');
    setHiddenPartIds([]);
    setIsolatedPartId(null);
    setFloorModelMoved(false);
    setShowInfoPanel(true);
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
  const engineExplodeRef = useRef(explode / 100);
  const xrayRef = useRef(xray);
  const showLabelsRef = useRef(showLabels);
  const showGridRef = useRef(showGrid);
  const autoOrbitRef = useRef(autoOrbit);
  const simTimeRef = useRef(0);
  const stepTriggerRef = useRef(0);
  const modeParamsRef = useRef(modeParams);
  const expFlagsRef = useRef(expFlags);
  const mendelPresetRef = useRef(mendelPreset);
  const selectedPartIdRef = useRef(selectedPartId);
  const hiddenPartIdsRef = useRef<ReadonlySet<string>>(new Set());
  const isolatedPartIdRef = useRef<string | null>(null);
  const anatomyLayersRef = useRef<Record<AnatomySystemKey, boolean>>(anatomyLayers);
  const skinOpacityRef = useRef(skinOpacity);
  const muscleOpacityRef = useRef(muscleOpacity);
  const boneOpacityRef = useRef(boneOpacity);

  pausedRef.current = paused;
  speedRef.current = speed;
  explodeRef.current = explode;
  engineExplodeRef.current = explode / 100;
  xrayRef.current = xray;
  showLabelsRef.current = showLabels;
  showGridRef.current = showGrid;
  autoOrbitRef.current = autoOrbit;
  modeParamsRef.current = modeParams;
  expFlagsRef.current = expFlags;
  mendelPresetRef.current = mendelPreset;
  selectedPartIdRef.current = selectedPartId;
  hiddenPartIdsRef.current = useMemo(() => new Set(hiddenPartIds), [hiddenPartIds]);
  isolatedPartIdRef.current = isolatedPartId;
  anatomyLayersRef.current = anatomyLayers;
  skinOpacityRef.current = skinOpacity;
  muscleOpacityRef.current = muscleOpacity;
  boneOpacityRef.current = boneOpacity;

  const selectedPartMeta = useMemo(() => {
    if (!assetSpec) return null;
    return (
      assetSpec.selectableParts.find(
        (p) => p.id === selectedPartId || p.name === selectedPart || p.id === selectedPart
      ) || null
    );
  }, [assetSpec, selectedPartId, selectedPart]);

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

    const specForMode = getBiologyAssetSpec(mode);
    const camDef = specForMode?.defaultCamera;
    const w = container.clientWidth || 720;
    const h = container.clientHeight || 430;
    const camera = new THREE.PerspectiveCamera(camDef?.fov ?? 42, w / h, 0.1, 100);
    if (camDef) {
      camera.position.set(...camDef.position);
    } else {
      camera.position.set(4.2, 2.9, 5.2);
    }
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
    renderer.toneMappingExposure = isUltra ? 1.12 : isSmooth ? 1.0 : 1.06;
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
        ? 0.96
        : isSmooth
        ? 0.45
        : 0.78;
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 0.85;
    controls.maxDistance = 16;
    if (camDef) {
      controls.target.set(...camDef.target);
    }
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
        bloomIntensity: mode === 'human_anatomy_3d' ? 0.12 : isUltra ? 0.24 : 0.16,
        luminanceThreshold: 0.94,
        enableSmaa: true
      });
    }

    const anaglyphEffect = new AnaglyphEffect(renderer);
    anaglyphEffect.setSize(w, h);
    const stereoEffect = new StereoEffect(renderer);
    stereoEffect.setSize(w, h);

    const root = new THREE.Group();
    scene.add(root);
    rootRef.current = root;

    const labelGroup = new THREE.Group();
    scene.add(labelGroup);

    const poolCap = isUltra ? 280 : isSmooth ? 72 : 160;
    const gpuPool = new GPUParticlePool(poolCap, isUltra ? 0.064 : 0.05, 0x34d399, 0xfacc15);
    scene.add(gpuPool.mesh);

    const vault = new BioMaterialVault(renderer.capabilities.getMaxAnisotropy(), isSmooth || isSoftwareGl);
    const interactables: THREE.Object3D[] = [];
    interactablesRef.current = interactables;
    anatomyRef.current = null;
    const animatedTickers: Array<(t: number, dt: number) => void> = [];

    let onLiveUpdate: ((t: number, dt: number, params: Record<string, number>, flags: Record<string, boolean | number>) => void) | null = null;
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
          fontSize: 0.14,
          color,
          dotRadius: 0.016,
          arrowScale: 0,
          trimStart: 0.22
        });
        labelGroup.add(leader);
        return leader;
      }
      const lbl = createTroikaLabel({
        text,
        position: pos,
        fontSize: 0.22,
        color,
        outlineWidth: 0.016
      });
      labelGroup.add(lbl);
      return lbl;
    };

    const hookCtx: BioSceneHookContext = {
      vault,
      isLowEnd: isSmooth || isSoftwareGl,
      explodeRef: engineExplodeRef,
      xrayRef,
      modeParamsRef,
      expFlagsRef,
      interactables,
      animatedTickers,
      mendelPresetRef,
      addLabel,
      removeLabel: (obj: THREE.Object3D) => {
        labelGroup.remove(obj);
        disposeObjectTreeFull(obj);
      }
    };

    const gltfAbort = new AbortController();
    let handledByModularEngine = false;

    if (mode === 'human_anatomy_3d') {
      handledByModularEngine = true;
      bioAccentLight.color.setHex(0x38bdf8);
      const anatomy = buildHumanAnatomyExplorer(vault, isSmooth || isSoftwareGl);
      root.add(anatomy.root);
      interactables.push(...anatomy.interactables);
      anatomyRef.current = anatomy;

      // Re-apply any session-uploaded GLB organ overrides across scene rebuilds
      sessionGltfCacheRef.current.forEach((cachedGrp, orgId) => {
        anatomy.replaceOrganWithGltf(orgId, cachedGrp.clone(true));
      });

      // Probe static manifest.json for bundled GLBs (200 OK, zero 404 console spam)
      void fetchAnatomyBundledManifest(gltfAbort.signal).then(async (bundled) => {
        if (gltfAbort.signal.aborted) return;
        setBundledAnatomyFiles(bundled);
        if (bundled.length === 0) return;

        const bundledLower = new Set(bundled.map((b) => b.toLowerCase()));
        if (bundledLower.has('human_anatomy_full.glb')) {
          try {
            const rawFull = await loadAnatomyGltfSource('./assets/anatomy/human_anatomy_full.glb', gltfAbort.signal);
            if (!gltfAbort.signal.aborted) {
              const splitMap = splitCompositeAnatomyGltf(rawFull);
              splitMap.forEach((grp, orgId) => {
                if (!sessionGltfCacheRef.current.has(orgId)) {
                  anatomy.replaceOrganWithGltf(orgId, grp);
                }
              });
            }
          } catch {
            // ignore optional composite load failure
          }
        }

        for (const slot of HUMAN_ANATOMY_ASSET_SLOTS) {
          if (slot.organId === 'full_body_atlas') continue;
          if (!bundledLower.has(slot.expectedFileName.toLowerCase())) continue;
          if (sessionGltfCacheRef.current.has(slot.organId)) continue;
          try {
            const raw = await loadAnatomyGltfSource(slot.expectedPublicPath, gltfAbort.signal);
            if (gltfAbort.signal.aborted) return;
            const bound = normalizeAndBindGltfOrgan(raw, slot);
            anatomy.replaceOrganWithGltf(slot.organId, bound);
          } catch {
            // keep procedural PBR anatomy if a bundled file fails to parse
          }
        }
      });

      // Build compact 3D anatomical leader pins synced with layer toggles & zoom auto-hide
      const anatomyLeaderLabels: Array<{
        organId: string;
        systemKey: AnatomySystemKey;
        obj: LeaderArrowLabel;
      }> = HUMAN_ANATOMY_LABEL_ANCHORS.map((cfgLbl) => {
        const obj = createLeaderArrowLabel({
          text: cfgLbl.text,
          labelPos: cfgLbl.labelPos,
          anchorPos: cfgLbl.anchorPos,
          fontSize: 0.105,
          color: cfgLbl.color,
          dotRadius: 0.015,
          arrowScale: 0,
          trimStart: 0.22
        });
        labelGroup.add(obj);
        return { organId: cfgLbl.organId, systemKey: cfgLbl.systemKey, obj };
      });

      onLiveUpdate = (t, _dt, params) => {
        anatomy.applyState(
          {
            enabledSystems: anatomyLayersRef.current,
            skinOpacity: skinOpacityRef.current,
            muscleOpacity: muscleOpacityRef.current,
            boneOpacity: boneOpacityRef.current,
            explode: engineExplodeRef.current,
            xray: xrayRef.current,
            hiddenPartIds: hiddenPartIdsRef.current,
            isolatedPartId: isolatedPartIdRef.current
          },
          t,
          params.bpm ?? 72
        );
        const dist = camera.position.distanceTo(controls.target);
        const zoomedOrFocused = dist < 3.6 || Boolean(isolatedPartIdRef.current);
        const activeSel = isolatedPartIdRef.current || selectedPartIdRef.current;
        for (const lbl of anatomyLeaderLabels) {
          const sysOn = anatomyLayersRef.current[lbl.systemKey];
          const visDec = resolvePartVisibilityState(lbl.organId, {
            allPartIds: HUMAN_ANATOMY_LABEL_ANCHORS.map((a) => a.organId),
            hiddenPartIds: hiddenPartIdsRef.current,
            isolatedPartId: isolatedPartIdRef.current
          });
          const hideOnFocus = zoomedOrFocused && Boolean(activeSel) && lbl.organId !== activeSel;
          lbl.obj.visible = Boolean(sysOn && visDec.visible && !visDec.dimmed && !hideOnFocus);
        }
      };
    } else if (
      buildHumanOrganScene(mode, root, hookCtx) ||
      buildCellularBiologyScene(mode, root, hookCtx) ||
      buildPlantBiologyScene(mode, root, hookCtx) ||
      buildMicroEcologyScene(mode, root, hookCtx) ||
      buildGeneticsMiddleSchoolScene(mode, root, hookCtx)
    ) {
      handledByModularEngine = true;
      onLiveUpdate = (t, dt) => {
        for (const fn of animatedTickers) fn(t, dt);
      };
    }

    if (specForMode?.assetPath) {
      setGltfLoading(true);
      void loadBiologyGltfOrFallback(mode, { signal: gltfAbort.signal })
        .then((loaded) => {
          if (!loaded || gltfAbort.signal.aborted) return;
          disposeObjectTreeFull(root);
          root.clear();
          root.add(loaded.group);
          interactables.length = 0;
          interactables.push(loaded.group);
        })
        .finally(() => {
          if (!gltfAbort.signal.aborted) setGltfLoading(false);
        });
    } else {
      setGltfLoading(false);
    }

    if (!handledByModularEngine) {
      addLabel(cfg.title, [0, 1.9, 0], 0x6ee7b7);
    }

    const focusWorldBoxForId = (partIdOrLabel: string) => {
      if (!partIdOrLabel) return;
      const found = resolveFocusBoxForPart(root, partIdOrLabel);
      if (!found || found.box.isEmpty()) return;
      const pose = computeFocusPoseFromBox3(found.box, {
        fovDeg: camera.fov,
        aspect: camera.aspect,
        padding: 1.52,
        minDistance: 0.9,
        maxDistance: 12,
        currentCameraPos: camera.position,
        currentTarget: controls.target
      });
      cameraLerpRef.current = pose;
    };

    const selectAndFocusObject = (hitObj: THREE.Object3D) => {
      let cur: THREE.Object3D | null = hitObj;
      let pid = '';
      let lbl = '';
      while (cur && (!pid || !lbl)) {
        if (!pid && (cur.userData?.organId || cur.userData?.partId)) {
          pid = String(cur.userData.organId || cur.userData.partId);
        }
        if (!lbl && cur.userData?.partLabel) {
          lbl = String(cur.userData.partLabel);
        }
        cur = cur.parent;
      }
      if (!pid && !lbl) return;
      const finalId = pid || lbl;
      const meta = specForMode?.selectableParts.find((p) => p.id === finalId || p.name === lbl);
      setSelectedPartId(finalId);
      setSelectedPart(meta?.name || lbl || finalId);
      setShowInfoPanel(true);
      if (mode === 'human_anatomy_3d') {
        if (finalId === 'skeletal_frame') {
          setBoneOpacity((v) => Math.max(v, 0.92));
        } else if (finalId === 'muscular_system') {
          setMuscleOpacity((v) => Math.max(v, 0.72));
        } else {
          setSkinOpacity((v) => Math.min(v, 0.1));
          setMuscleOpacity((v) => Math.min(v, 0.12));
          setBoneOpacity((v) => Math.min(v, 0.25));
        }
      }
      focusWorldBoxForId(finalId);
    };

    // Priority raycast against opaque/anatomical interactables (passes right through transparent outer shells)
    const clickRaycaster = new THREE.Raycaster();
    const clickPtr = new THREE.Vector2();
    let clickDownPt = { x: 0, y: 0 };
    const onCanvasPointerDown = (ev: PointerEvent) => {
      clickDownPt = { x: ev.clientX, y: ev.clientY };
    };
    const onCanvasPointerUp = (ev: PointerEvent) => {
      if (ev.button !== 0 && ev.pointerType === 'mouse') return;
      if (Math.hypot(ev.clientX - clickDownPt.x, ev.clientY - clickDownPt.y) > 5) return;
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      clickPtr.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      clickPtr.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      clickRaycaster.setFromCamera(clickPtr, camera);

      const visibleInteractables = interactables.filter((obj) => {
        let p: THREE.Object3D | null = obj;
        while (p) {
          if (!p.visible) return false;
          p = p.parent;
        }
        return true;
      });
      if (visibleInteractables.length > 0) {
        const hits = clickRaycaster.intersectObjects(visibleInteractables, true);
        if (hits.length > 0) {
          selectAndFocusObject(hits[0].object);
        }
      }
    };
    renderer.domElement.addEventListener('pointerdown', onCanvasPointerDown);
    renderer.domElement.addEventListener('pointerup', onCanvasPointerUp);

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
        // Fallback when user clicks something tagged outside `interactables`
        const hasTag = Boolean(hitObj.userData?.partId || hitObj.userData?.organId || hitObj.userData?.partLabel);
        if (hasTag) selectAndFocusObject(hitObj);
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

      engineExplodeRef.current = explodeRef.current / 100;

      // Graphics-tier-aware incoming studio light sweep animation
      const wallT = now * 0.001;
      if (!isSmooth) {
        rimLight.position.x = -5 + Math.sin(wallT * 0.45) * 1.4;
        rimLight.position.z = -5 + Math.cos(wallT * 0.36) * 1.2;
        bioAccentLight.intensity = (isUltra ? 1.55 : 0.95) + Math.sin(wallT * 1.25) * (isUltra ? 0.25 : 0.12);
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
        onLiveUpdate?.(elapsed, effDt, modeParamsRef.current, expFlagsRef.current);
        gpuPool.update(effDt, 0);
      } else if (mode === 'human_anatomy_3d' && anatomyRef.current) {
        // Keep visibility/opacity sliders responsive even when paused
        onLiveUpdate?.(elapsed, 0, modeParamsRef.current, expFlagsRef.current);
      }

      // Apply Hide/Show and Isolate for non-anatomy modular scenes
      if (mode !== 'human_anatomy_3d') {
        const hiddenSet = hiddenPartIdsRef.current;
        const isoId = isolatedPartIdRef.current;
        const visInput = {
          allPartIds: [],
          hiddenPartIds: hiddenSet,
          isolatedPartId: isoId
        };
        interactables.forEach((obj) => {
          const pid = String(obj.userData?.partId || obj.userData?.partLabel || '');
          if (!pid) return;
          const decision = resolvePartVisibilityState(pid, visInput);
          if (!decision.visible) {
            obj.userData.__bioHiddenByTool = true;
            obj.visible = false;
          } else if (obj.userData.__bioHiddenByTool) {
            obj.userData.__bioHiddenByTool = false;
            obj.visible = true;
          }
          obj.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (!mesh.isMesh) return;
            const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
            mats.forEach((m) => {
              if (!m || !('opacity' in m)) return;
              if (m.userData.__origOpacity === undefined) {
                m.userData.__origOpacity = m.opacity;
                m.userData.__origTransparent = m.transparent;
              }
              if (decision.dimmed) {
                m.transparent = true;
                m.opacity = Math.min(Number(m.userData.__origOpacity ?? 1), 0.14);
                m.depthWrite = false;
              } else if (m.userData.__wasDimmed) {
                m.transparent = Boolean(m.userData.__origTransparent);
                m.opacity = Number(m.userData.__origOpacity ?? 1);
                m.depthWrite = !m.transparent || m.opacity > 0.72;
              }
              m.userData.__wasDimmed = decision.dimmed;
            });
          });
        });
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

      if (appliedHoloOffset.lengthSq() > 0) {
        camera.position.sub(appliedHoloOffset);
      }
      if (cameraLerpRef.current) {
        const settled = stepSmoothCameraTransition(
          camera,
          controls.target,
          cameraLerpRef.current,
          isSoftwareGl ? Math.max(dt * 3, 0.14) : dt,
          isSoftwareGl ? 14 : 7.5
        );
        if (settled) cameraLerpRef.current = null;
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

      const distToTarget = Math.max(1.2, camera.position.distanceTo(controls.target));
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
      gltfAbort.abort();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
      controls.removeEventListener('start', cancelCamLerp);
      renderer.domElement.removeEventListener('pointerdown', onCanvasPointerDown);
      renderer.domElement.removeEventListener('pointerup', onCanvasPointerUp);
      floorDrag.dispose();
      floorDragRef.current = null;
      rootRef.current = null;
      interactablesRef.current = [];
      anatomyRef.current = null;
      vault.disposeAll();
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
  }, [mode, isSoftwareGl, perfMode, headOffsetRef]);

  const focusPartById = (partIdOrLabel: string, fallbackName?: string) => {
    const root = rootRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!root || !camera || !controls || !partIdOrLabel) return;
    const meta = assetSpec?.selectableParts.find((p) => p.id === partIdOrLabel || p.name === partIdOrLabel);
    setSelectedPartId(partIdOrLabel);
    setSelectedPart(meta?.name || fallbackName || partIdOrLabel);
    setShowInfoPanel(true);
    if (mode === 'human_anatomy_3d') {
      if (partIdOrLabel === 'skeletal_frame') {
        setBoneOpacity((v) => Math.max(v, 0.92));
      } else if (partIdOrLabel === 'muscular_system') {
        setMuscleOpacity((v) => Math.max(v, 0.72));
      } else {
        setSkinOpacity((v) => Math.min(v, 0.1));
        setMuscleOpacity((v) => Math.min(v, 0.12));
        setBoneOpacity((v) => Math.min(v, 0.25));
      }
    }

    const found = resolveFocusBoxForPart(root, partIdOrLabel);
    if (!found || found.box.isEmpty()) return;
    const pose = computeFocusPoseFromBox3(found.box, {
      fovDeg: camera.fov,
      aspect: camera.aspect,
      padding: 1.48,
      minDistance: 0.68,
      maxDistance: 12,
      currentCameraPos: camera.position,
      currentTarget: controls.target
    });
    cameraLerpRef.current = pose;
  };

  const handleZoomStep = (zoomFactor: number) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const nextPos = computeZoomStepPose(
      camera.position,
      controls.target,
      zoomFactor,
      controls.minDistance,
      controls.maxDistance
    );
    cameraLerpRef.current = { position: nextPos, target: controls.target.clone() };
  };

  const toggleHidePart = (pid: string) => {
    if (!pid) return;
    setHiddenPartIds((prev) => (prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]));
  };

  const handleUploadAnatomyGltf = async (slot: AnatomyGltfSlotSpec, file: File) => {
    const raw = await loadAnatomyGltfSource(file);
    if (slot.organId === 'full_body_atlas') {
      const splitMap = splitCompositeAnatomyGltf(raw);
      if (splitMap.size === 0) {
        throw new Error(
          'Không tìm thấy tên lưới khớp cơ quan (ví dụ: Heart, Brain, Lung, Liver, Stomach, Kidney, Skeleton, Muscle).'
        );
      }
      setSessionUploadedSlots((prev) => {
        const next = new Map(prev);
        next.set(slot.slotId, file.name);
        splitMap.forEach((grp, orgId) => {
          sessionGltfCacheRef.current.set(orgId, grp.clone(true));
          anatomyRef.current?.replaceOrganWithGltf(orgId, grp);
          next.set(orgId, `${file.name} (${orgId})`);
        });
        return next;
      });
      return;
    }

    const bound = normalizeAndBindGltfOrgan(raw, slot);
    sessionGltfCacheRef.current.set(slot.organId, bound.clone(true));
    anatomyRef.current?.replaceOrganWithGltf(slot.organId, bound);
    setSessionUploadedSlots((prev) => {
      const next = new Map(prev);
      next.set(slot.organId, file.name);
      return next;
    });
  };

  const handleRestoreAnatomySlot = (organId: string) => {
    sessionGltfCacheRef.current.delete(organId);
    anatomyRef.current?.restoreProceduralOrgan(organId);
    setSessionUploadedSlots((prev) => {
      const next = new Map(prev);
      next.delete(organId);
      return next;
    });
  };

  const setCameraPreset = (preset: 'overview' | 'front' | 'top' | 'closeup') => {
    const camera = cameraRef.current;
    const root = rootRef.current;
    const specCam = assetSpec?.defaultCamera;

    if (preset === 'overview' && specCam) {
      cameraLerpRef.current = {
        position: new THREE.Vector3(...specCam.position),
        target: new THREE.Vector3(...specCam.target)
      };
      return;
    }

    if (preset === 'closeup' && selectedPartId && root && camera) {
      focusPartById(selectedPartId, selectedPart);
      return;
    }

    let boxCenter = new THREE.Vector3(0, 0, 0);
    let boxRadius = 2.6;
    if (root) {
      const targetBox = selectedPartId ? resolveFocusBoxForPart(root, selectedPartId)?.box : null;
      const box = targetBox && !targetBox.isEmpty() ? targetBox : resolveObjectWorldBox3(root);
      if (!box.isEmpty()) {
        const sp = new THREE.Sphere();
        box.getCenter(boxCenter);
        box.getBoundingSphere(sp);
        boxRadius = Math.max(0.6, sp.radius);
      }
    }

    if (preset === 'overview' && camera && root) {
      const box = resolveObjectWorldBox3(root);
      const pose = computeFocusPoseFromBox3(box, {
        fovDeg: camera.fov,
        aspect: camera.aspect,
        padding: 1.55,
        minDistance: 1.8,
        maxDistance: 14,
        preferredDirection: new THREE.Vector3(0.55, 0.36, 0.75)
      });
      cameraLerpRef.current = pose;
    } else if (preset === 'front') {
      cameraLerpRef.current = {
        position: boxCenter.clone().add(new THREE.Vector3(0, boxRadius * 0.12, boxRadius * 2.35)),
        target: boxCenter
      };
    } else if (preset === 'top') {
      cameraLerpRef.current = {
        position: boxCenter.clone().add(new THREE.Vector3(0, boxRadius * 2.55, boxRadius * 0.28)),
        target: boxCenter
      };
    } else {
      cameraLerpRef.current = {
        position: boxCenter.clone().add(new THREE.Vector3(boxRadius * 0.85, boxRadius * 0.45, boxRadius * 1.25)),
        target: boxCenter
      };
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
      <div className="relative z-20 p-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-2 bg-slate-900/95 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
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
          <span className="text-[11px] sm:text-xs font-bold text-white truncate min-w-0">
            {title || cfg.title}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-wrap justify-end shrink-0">
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
            onClick={() => handleZoomStep(0.78)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 cursor-pointer shrink-0"
            title={isEn ? 'Zoom In' : 'Phóng to'}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoomStep(1.26)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 cursor-pointer shrink-0"
            title={isEn ? 'Zoom Out' : 'Thu nhỏ'}
          >
            <ZoomOut className="w-3.5 h-3.5" />
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

      {/* HUMAN ANATOMY 11-SYSTEM LAYER & TISSUE OPACITY BAR */}
      {mode === 'human_anatomy_3d' && (
        <div className="relative z-20 px-3 py-2 bg-slate-900/95 border-b border-slate-800 space-y-2 text-[11px]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 font-bold text-teal-300 mr-1">
              <Layers className="w-3.5 h-3.5" />
              <span>11 Hệ Cơ Quan:</span>
            </span>
            {ANATOMY_SYSTEM_META.map((sys) => {
              const on = anatomyLayers[sys.key];
              return (
                <button
                  key={sys.key}
                  type="button"
                  onClick={() =>
                    setAnatomyLayers((prev) => ({ ...prev, [sys.key]: !prev[sys.key] }))
                  }
                  className={`px-2 py-0.5 rounded-md border font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                    on ? sys.tone : 'border-slate-700 bg-slate-950 text-slate-500'
                  }`}
                >
                  {on ? '✓ ' : '○ '}
                  {sys.label}
                </button>
              );
            })}
            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                data-testid="bio-anatomy-glb-btn"
                onClick={() => setAssetModalOpen(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-950/90 hover:bg-teal-900 border border-teal-500/50 text-teal-200 font-semibold cursor-pointer whitespace-nowrap"
                title="Quản lý & nạp mô hình giải phẫu GLB/GLTF"
              >
                <FolderUp className="w-3 h-3" />
                <span>
                  Tài nguyên GLB ({anatomyAssetSummary.readyCount}/{anatomyAssetSummary.totalSlots})
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAnatomyLayers(createDefaultAnatomyLayers());
                  setSkinOpacity(0.24);
                  setMuscleOpacity(0.58);
                  setBoneOpacity(0.92);
                  setHiddenPartIds([]);
                  setIsolatedPartId(null);
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold cursor-pointer whitespace-nowrap"
              >
                Hiện đủ 11 hệ
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-md px-2.5 py-1">
              <span className="text-slate-300 font-semibold shrink-0">Lớp Da:</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={skinOpacity}
                onChange={(e) => setSkinOpacity(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 cursor-pointer"
              />
              <span className="font-mono text-amber-300 w-9 text-right">{Math.round(skinOpacity * 100)}%</span>
            </label>
            <label className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-md px-2.5 py-1">
              <span className="text-slate-300 font-semibold shrink-0">Lớp Cơ:</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muscleOpacity}
                onChange={(e) => setMuscleOpacity(Number(e.target.value))}
                className="w-full accent-rose-400 h-1.5 cursor-pointer"
              />
              <span className="font-mono text-rose-300 w-9 text-right">{Math.round(muscleOpacity * 100)}%</span>
            </label>
            <label className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-md px-2.5 py-1">
              <span className="text-slate-300 font-semibold shrink-0">Hệ Xương:</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={boneOpacity}
                onChange={(e) => setBoneOpacity(Number(e.target.value))}
                className="w-full accent-slate-200 h-1.5 cursor-pointer"
              />
              <span className="font-mono text-slate-200 w-9 text-right">{Math.round(boneOpacity * 100)}%</span>
            </label>
          </div>
        </div>
      )}

      {/* WEBGL CANVAS + SCIENTIFIC INSPECTOR OVERLAY */}
      <div
        data-testid="bio-3d-stage"
        data-bio-mode={mode}
        data-selected-part-id={selectedPartId}
        className={`relative w-full ${isFullscreen ? 'flex-1 min-h-[260px]' : heightClass}`}
      >
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

        {gltfLoading && (
          <div className="absolute top-3 right-3 z-20 rounded-md bg-slate-900/95 border border-teal-500/40 px-2.5 py-1 text-[11px] font-semibold text-teal-200">
            Đang tải mô hình 3D...
          </div>
        )}

        {/* Selected Structure Scientific Info Panel */}
        {(selectedPart || selectedPartMeta) && showInfoPanel && (
          <div
            data-testid="bio-part-info-card"
            className="absolute top-3 left-3 z-10 w-[260px] sm:w-[295px] max-h-[calc(100%-24px)] overflow-y-auto rounded-xl bg-slate-900/92 backdrop-blur-sm border border-teal-500/45 p-2.5 text-xs text-slate-100 space-y-2 shadow-lg"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>{isEn ? 'Selected Structure' : 'Bộ phận đang chọn'}</span>
                </div>
                <div className="text-sm font-extrabold text-white truncate mt-0.5">
                  {selectedPartMeta?.name || selectedPart}
                </div>
                {selectedPartMeta && (
                  <div className="text-[10px] italic text-slate-400 truncate">
                    {selectedPartMeta.latinName || selectedPartMeta.nameEn}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowInfoPanel(false)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer shrink-0"
                title="Đóng bảng thông tin"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {selectedPartMeta && (
              <div className="space-y-1.5 text-[11px] leading-snug">
                <div className="rounded-lg bg-slate-950/90 border border-slate-800 px-2.5 py-1.5">
                  <span className="font-bold text-sky-300">Cấu tạo: </span>
                  <span className="text-slate-200">{selectedPartMeta.structure}</span>
                </div>
                <div className="rounded-lg bg-slate-950/90 border border-slate-800 px-2.5 py-1.5">
                  <span className="font-bold text-emerald-300">Chức năng: </span>
                  <span className="text-slate-200">{selectedPartMeta.function}</span>
                </div>
                {selectedPartMeta.histology && (
                  <div className="rounded-lg bg-slate-950/90 border border-slate-800 px-2.5 py-1.5">
                    <span className="font-bold text-amber-300">Mô học: </span>
                    <span className="text-slate-200">{selectedPartMeta.histology}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => focusPartById(selectedPartId || selectedPart, selectedPart)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold cursor-pointer"
              >
                <Crosshair className="w-3 h-3" />
                <span>Tập trung</span>
              </button>
              <button
                type="button"
                onClick={() => toggleHidePart(selectedPartId || selectedPart)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-bold cursor-pointer ${
                  hiddenPartIds.includes(selectedPartId || selectedPart)
                    ? 'bg-amber-600 border-amber-400 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                {hiddenPartIds.includes(selectedPartId || selectedPart) ? (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>Hiện lại</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span>Ẩn</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() =>
                  setIsolatedPartId((cur) =>
                    cur === (selectedPartId || selectedPart) ? null : selectedPartId || selectedPart
                  )
                }
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-bold cursor-pointer ${
                  isolatedPartId === (selectedPartId || selectedPart)
                    ? 'bg-amber-500 border-amber-300 text-slate-950'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>{isolatedPartId === (selectedPartId || selectedPart) ? 'Bỏ cô lập' : 'Cô lập'}</span>
              </button>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-1.5">
          {hiddenPartIds.length > 0 && (
            <button
              type="button"
              onClick={() => setHiddenPartIds([])}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/95 hover:bg-amber-600 border border-amber-400/50 text-[11px] font-semibold text-amber-200 hover:text-white cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>Hiện lại tất cả ({hiddenPartIds.length} ẩn)</span>
            </button>
          )}
          {floorModelMoved && (
            <button
              type="button"
              onClick={() => floorDragRef.current?.resetPosition()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/95 hover:bg-teal-600 border border-teal-500/40 text-[11px] font-semibold text-teal-200 hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isEn ? 'Reset floor position' : 'Đặt lại vị trí sàn 3D'}</span>
            </button>
          )}
        </div>
      </div>

      {/* COLLAPSIBLE CONTROL DOCK */}
      <div className="border-t border-slate-800 bg-slate-900/95 px-3 py-2.5 text-xs text-slate-200 space-y-2.5">
        {assetSpec && assetSpec.selectableParts.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-800/80">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-300 shrink-0 mr-1">
              <Crosshair className="w-3.5 h-3.5" />
              <span>{isEn ? 'Select Structure:' : 'Chọn Bộ phận 3D:'}</span>
            </span>
            {assetSpec.selectableParts.map((sp) => {
              const isSel = selectedPartId === sp.id;
              const isHidden = hiddenPartIds.includes(sp.id);
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => focusPartById(sp.id, sp.name)}
                  className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                    isSel
                      ? 'bg-teal-600 border-teal-400 text-white'
                      : isHidden
                      ? 'bg-slate-950 border-slate-800 text-slate-500 line-through'
                      : 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-teal-400 hover:text-white'
                  }`}
                  title={`Chọn & tập trung vào ${sp.name}`}
                >
                  {sp.name.split('(')[0].trim()}
                </button>
              );
            })}
          </div>
        )}
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

            {selectedPart && (
              <button
                type="button"
                onClick={() => focusPartById(selectedPartId || selectedPart, selectedPart)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold cursor-pointer whitespace-nowrap"
                title="Di chuyển camera tập trung vào bộ phận đang chọn"
              >
                <Crosshair className="w-3 h-3" />
                <span>Tập trung bộ phận</span>
              </button>
            )}

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
              onClick={() => {
                setSelectedPart('');
                setSelectedPartId('');
                setIsolatedPartId(null);
                setCameraPreset('overview');
              }}
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
            {assetSpec && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-950/60 border border-slate-800/80 px-2.5 py-1.5 text-[10px] text-slate-400">
                <span>{assetSpec.description}</span>
                <span className="font-mono text-slate-500 shrink-0">{assetSpec.sourceLicense}</span>
              </div>
            )}
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
        <AnatomyAssetManagerModal
          open={assetModalOpen}
          onClose={() => setAssetModalOpen(false)}
          bundledFiles={bundledAnatomyFiles}
          sessionUploadedSlots={sessionUploadedSlots}
          onUploadSlotFile={handleUploadAnatomyGltf}
          onRestoreSlot={handleRestoreAnatomySlot}
        />
      </div>
    </ViewportPortal>
  );
};
