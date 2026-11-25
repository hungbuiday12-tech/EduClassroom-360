import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Atom,
  Award,
  Bookmark,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Cpu,
  Disc,
  Dna,
  Download,
  Eye,
  EyeOff,
  Flame,
  Gauge,
  GitCompareArrows,
  Grid,
  Infinity as InfinityIcon,
  Layers,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Music,
  Orbit,
  Pause,
  Play,
  QrCode,
  Radar,
  Radio,
  Rocket,
  RotateCcw,
  Ruler,
  Satellite,
  Scissors,
  Search,
  Server,
  Share2,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Sun,
  Volume2,
  VolumeX,
  Waves,
  X,
  Zap
} from 'lucide-react';
import { SubjectType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { useAudio } from '../../context/AudioContext';
import { PerformanceMode, useBackgroundTheme } from '../../context/BackgroundContext';
import { useRemoteController } from '../../context/RemoteControllerContext';
import { applySphericalOrbitDelta, subscribeRemoteCommand } from '../../lib/remoteControlBus';
import {
  buildCitadelEnvironment,
  buildCosmicSkyDome,
  buildMonument,
  BuiltMonument,
  computeTelemetry,
  createCircuitPlateTexture,
  createContactShadowTexture,
  createGlowSpriteTexture,
  MONUMENT_CATALOG,
  MonumentCategory,
  MonumentId,
  SynapseV2Params
} from './monumentBuilders';
import { FuturisticThumbPreview } from './FuturisticThumbPreview';
import { FuturisticCosmicBackdrop } from './FuturisticCosmicBackdrop';
import { SpatialVoiceMentor } from '../spatial3d/SpatialVoiceMentor';
import { WonderStageVoiceCommand } from '../../lib/voiceIntentEngine';
import {
  MiniTelemetryChart,
  RecordVideoButton,
  exportRowsToCsv,
  useCanvasRecorder
} from '../common/SimProToolkit';

interface SynapseV2StudioProps {
  onBack?: () => void;
  onNavigate?: (subject: SubjectType) => void;
  onEarnXP?: (xp: number) => void;
  embeddedInPre?: boolean;
}

type CameraPresetId = 'overview' | 'core' | 'zenith' | 'drone' | 'side' | 'lowAngle';
type RenderStyleId = 'pbr' | 'wireframe' | 'xray' | 'thermal' | 'stress' | 'flux';
type LightingMoodId = 'cosmic' | 'studio' | 'solar';
type SliceAxisId = 'x' | 'y' | 'z';
type SynapseResScale = 0.5 | 0.65 | 0.85 | 1.0 | 1.35;
type SynapseFpsCap = 30 | 60;

interface OutlinerNode {
  key: string;
  label: string;
  obj: THREE.Object3D;
  visible: boolean;
}

const SYNAPSE_PERF_KEY = 'synapse_v2_perf_prefs_v1';
const SYNAPSE_PINNED_KEY = 'synapse_v2_pinned_v1';
const SYNAPSE_MISSIONS_KEY = 'synapse_v2_missions_v1';

function parseLeadingFloat(str: string): number {
  const m = String(str || '').match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
}

function loadSynapsePerfPrefs(perfMode: PerformanceMode): {
  resolutionScale: SynapseResScale;
  targetFps: SynapseFpsCap;
} {
  try {
    const raw = localStorage.getItem(SYNAPSE_PERF_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<{
        resolutionScale: SynapseResScale;
        targetFps: SynapseFpsCap;
      }>;
      if (
        parsed.resolutionScale &&
        [0.5, 0.65, 0.85, 1.0, 1.35].includes(parsed.resolutionScale) &&
        (parsed.targetFps === 30 || parsed.targetFps === 60)
      ) {
        return {
          resolutionScale: parsed.resolutionScale,
          targetFps: parsed.targetFps
        };
      }
    }
  } catch {}
  if (perfMode === 'smooth') return { resolutionScale: 0.65, targetFps: 30 };
  if (perfMode === 'ultra') return { resolutionScale: 1.0, targetFps: 60 };
  return { resolutionScale: 0.85, targetFps: 60 };
}

function computeSynapseDpr(isSoftwareGl: boolean, scale: SynapseResScale): number {
  const hostDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const effective = Math.min(hostDpr, 1.5) * Math.min(scale, 1.25);
  return Math.min(1.5, Math.max(0.45, isSoftwareGl ? Math.min(effective, 1.0) : effective));
}

const CAMERA_PRESETS: Record<
  CameraPresetId,
  { pos: [number, number, number]; target: [number, number, number]; labelVi: string; labelEn: string }
> = {
  drone: {
    pos: [11.2, 4.4, 11.2],
    target: [0, 0.7, 0],
    labelVi: 'Quỹ đạo',
    labelEn: 'Orbit'
  },
  overview: {
    pos: [12.5, 6.2, 13.8],
    target: [0, 0.5, 0],
    labelVi: 'Toàn cảnh',
    labelEn: 'Overview'
  },
  core: {
    pos: [5.4, 2.1, 5.8],
    target: [0, 0.65, 0],
    labelVi: 'Cận lõi',
    labelEn: 'Core'
  },
  zenith: {
    pos: [0.1, 17.5, 6.2],
    target: [0, 0, 0],
    labelVi: 'Từ đỉnh',
    labelEn: 'Zenith'
  },
  side: {
    pos: [14.0, 1.4, 0.2],
    target: [0, 1.0, 0],
    labelVi: 'Mặt ngang',
    labelEn: 'Side'
  },
  lowAngle: {
    pos: [7.8, 0.65, 8.2],
    target: [0, 2.1, 0],
    labelVi: 'Góc ngước',
    labelEn: 'Hero Low'
  }
};

function renderMonumentIcon(id: MonumentId, className = 'w-4 h-4') {
  switch (id) {
    case 'dyson':
      return <Orbit className={`${className} text-sky-400 icon-anim-cosmos`} />;
    case 'tokamak':
      return <Flame className={`${className} text-amber-400 icon-anim-zap`} />;
    case 'tesseract':
      return <Compass className={`${className} text-purple-400 icon-anim-compass`} />;
    case 'neural_aero':
      return <Cpu className={`${className} text-emerald-400 icon-anim-code`} />;
    case 'quantum_cryostat':
      return <Atom className={`${className} text-yellow-400 icon-anim-atom`} />;
    case 'gravitational_ligo':
      return <Waves className={`${className} text-cyan-400 icon-anim-wave`} />;
    case 'space_elevator':
      return <Rocket className={`${className} text-sky-400 icon-anim-trophy`} />;
    case 'warp_alcubierre':
      return <Radar className={`${className} text-indigo-400 icon-anim-cosmos`} />;
    case 'hyperbolic_calabi':
      return <InfinityIcon className={`${className} text-pink-400 icon-anim-compass`} />;
    case 'dna_nanobot':
      return <Dna className={`${className} text-teal-400 icon-anim-branch`} />;
    case 'penning_antimatter':
      return <Sparkles className={`${className} text-rose-400 icon-anim-star`} />;
    case 'fractal_attractor':
      return <Layers className={`${className} text-orange-400 icon-anim-list`} />;
    case 'james_webb':
      return <Satellite className={`${className} text-amber-300 icon-anim-cosmos`} />;
    case 'wormhole_morris':
      return <Disc className={`${className} text-violet-400 icon-anim-compass`} />;
    case 'pulsar_magnetar':
      return <Radio className={`${className} text-cyan-300 icon-anim-wave`} />;
    case 'oort_solar_sail':
      return <Sun className={`${className} text-sky-300 icon-anim-star`} />;
    case 'supercomputer_torus':
      return <Server className={`${className} text-emerald-400 icon-anim-code`} />;
    case 'cpu_pipeline_core':
      return <Cpu className={`${className} text-lime-400 icon-anim-zap`} />;
    case 'blockchain_zk_lattice':
      return <ShieldCheck className={`${className} text-violet-300 icon-anim-branch`} />;
    case 'graph_dijkstra_citadel':
      return <Share2 className={`${className} text-amber-300 icon-anim-list`} />;
    case 'lhc_collider':
      return <Atom className={`${className} text-sky-400 icon-anim-atom`} />;
    case 'laser_interferometer':
      return <Waves className={`${className} text-emerald-400 icon-anim-wave`} />;
    case 'tesla_electromagnet':
      return <Zap className={`${className} text-purple-400 icon-anim-zap`} />;
    case 'lidar_autonomous_core':
      return <Radar className={`${className} text-cyan-400 icon-anim-cosmos`} />;
    case 'solar_thermal_tower':
      return <Sun className={`${className} text-amber-400 icon-anim-star`} />;
    case 'mri_tomography_ring':
      return <Disc className={`${className} text-sky-400 icon-anim-cosmos`} />;
    case 'sagnac_ring_gyro':
      return <Orbit className={`${className} text-amber-300 icon-anim-compass`} />;
    case 'metamaterial_cloak':
      return <ShieldCheck className={`${className} text-emerald-400 icon-anim-branch`} />;
    case 'acoustic_levitation':
      return <Waves className={`${className} text-cyan-300 icon-anim-wave`} />;
    case 'photonic_tensor_core':
      return <Cpu className={`${className} text-amber-400 icon-anim-code`} />;
    default:
      return <Orbit className={`${className} text-cyan-400 icon-anim-cosmos`} />;
  }
}

export const SynapseV2Studio: React.FC<SynapseV2StudioProps> = ({
  onBack,
  onNavigate,
  onEarnXP,
  embeddedInPre = false
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { location, navigate } = useNavigation();
  const { bgSound, setBgSound, isBgPlaying, toggleBgPlaying } = useAudio();
  const { perfMode } = useBackgroundTheme();
  const { openModal: openRemoteModal, controllerCount } = useRemoteController();

  // Synced with NavigationContext so clicking 'Lớp học ảo · Synapse v2' in Header always returns to 12-Chamber home
  const studioMode = location.synapseMode || 'catalog';
  const activeId = (MONUMENT_CATALOG.some((m) => m.id === location.synapseMonumentId)
    ? location.synapseMonumentId
    : 'dyson') as MonumentId;

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'pinned' | MonumentCategory>('all');
  const [subjectZoneFilter, setSubjectZoneFilter] = useState<'all' | 'physics' | 'bio_chem' | 'math' | 'cs'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pinnedWonders, setPinnedWonders] = useState<MonumentId[]>(() => {
    try {
      const raw = localStorage.getItem(SYNAPSE_PINNED_KEY);
      return raw ? (JSON.parse(raw) as MonumentId[]) : ['dyson', 'tokamak'];
    } catch {
      return ['dyson', 'tokamak'];
    }
  });
  const [compareOpen, setCompareOpen] = useState<boolean>(false);
  const [compareIdA, setCompareIdA] = useState<MonumentId>('dyson');
  const [compareIdB, setCompareIdB] = useState<MonumentId>('tokamak');
  const [compareRegime, setCompareRegime] = useState<'nominal' | 'max'>('nominal');

  const mountRef = useRef<HTMLDivElement | null>(null);
  const activeDef = useMemo(
    () => MONUMENT_CATALOG.find((m) => m.id === activeId) || MONUMENT_CATALOG[0],
    [activeId]
  );

  // Simulation parameters & comprehensive monument controls
  const [primaryParam, setPrimaryParam] = useState<number>(activeDef.primaryRange[2]);
  const [secondaryParam, setSecondaryParam] = useState<number>(activeDef.secondaryRange[2]);
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeScale, setTimeScale] = useState<number>(1.0);
  const [orbitSpeed, setOrbitSpeed] = useState<number>(1.0);
  const [autoOrbitEnabled, setAutoOrbitEnabled] = useState<boolean>(true);
  const [cameraFov, setCameraFov] = useState<number>(46);
  const [renderStyle, setRenderStyle] = useState<RenderStyleId>('pbr');
  const [lightingMood, setLightingMood] = useState<LightingMoodId>('cosmic');
  const [sliceEnabled, setSliceEnabled] = useState<boolean>(false);
  const [sliceHeight, setSliceHeight] = useState<number>(3.5);
  const [sliceAxis, setSliceAxis] = useState<SliceAxisId>('y');
  const [sliceInvert, setSliceInvert] = useState<boolean>(false);
  const [showPlatform, setShowPlatform] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('drone');
  const [isDockOpen, setIsDockOpen] = useState<boolean>(false);
  const [isAdvancedDockOpen, setIsAdvancedDockOpen] = useState<boolean>(true);
  const [isWonderStripOpen, setIsWonderStripOpen] = useState<boolean>(false);
  const [isCameraMenuOpen, setIsCameraMenuOpen] = useState<boolean>(false);
  const [cameraBookmark, setCameraBookmark] = useState<{
    pos: [number, number, number];
    target: [number, number, number];
    fov: number;
  } | null>(null);
  const [isPerfMenuOpen, setIsPerfMenuOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [contextLost, setContextLost] = useState<boolean>(false);
  const [webglError, setWebglError] = useState<boolean>(false);
  const [visitedWonders, setVisitedWonders] = useState<MonumentId[]>(['dyson']);
  const [measureMode, setMeasureMode] = useState<boolean>(false);
  const [measurePoints, setMeasurePoints] = useState<{ x: number; y: number; z: number }[]>([]);
  const [showTelemetryChart, setShowTelemetryChart] = useState<boolean>(false);
  const [showSweepPanel, setShowSweepPanel] = useState<boolean>(false);
  const [showOutliner, setShowOutliner] = useState<boolean>(false);
  const [autoTourEnabled, setAutoTourEnabled] = useState<boolean>(false);
  const [outlinerNodes, setOutlinerNodes] = useState<OutlinerNode[]>([]);
  const [isolatedNodeKey, setIsolatedNodeKey] = useState<string | null>(null);
  const [telemetryHistory, setTelemetryHistory] = useState<
    { t: string; m1: number; m2: number; m3: number }[]
  >([]);
  const [completedMissions, setCompletedMissions] = useState<MonumentId[]>(() => {
    try {
      const raw = localStorage.getItem(SYNAPSE_MISSIONS_KEY);
      return raw ? (JSON.parse(raw) as MonumentId[]) : [];
    } catch {
      return [];
    }
  });
  const [perfPrefs, setPerfPrefs] = useState<{
    resolutionScale: SynapseResScale;
    targetFps: SynapseFpsCap;
  }>(() => loadSynapsePerfPrefs(perfMode));
  const resolutionScale = perfPrefs.resolutionScale;
  const targetFps = perfPrefs.targetFps;

  const updatePerfPrefs = useCallback(
    (patch: Partial<{ resolutionScale: SynapseResScale; targetFps: SynapseFpsCap }>) => {
      setPerfPrefs((prev) => {
        const next = { ...prev, ...patch };
        try {
          localStorage.setItem(SYNAPSE_PERF_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    []
  );

  // Ensure fullscreen exits & parameters stay synced when returning to catalog or navigating Back/Forward
  useEffect(() => {
    if (studioMode === 'catalog') {
      setIsFullscreen(false);
    }
  }, [studioMode]);

  useEffect(() => {
    const def = MONUMENT_CATALOG.find((m) => m.id === activeId) || MONUMENT_CATALOG[0];
    setPrimaryParam(def.primaryRange[2]);
    setSecondaryParam(def.secondaryRange[2]);
    setExplodeFactor(0);
    setIsPaused(false);
  }, [activeId]);

  useEffect(() => {
    const onSynapseReset = () => {
      setIsFullscreen(false);
      setCategoryFilter('all');
      setSubjectZoneFilter('all');
      setSearchQuery('');
    };
    window.addEventListener('educlassroom:synapse-reset', onSynapseReset);
    return () => window.removeEventListener('educlassroom:synapse-reset', onSynapseReset);
  }, []);

  const togglePinWonder = useCallback((id: MonumentId) => {
    setPinnedWonders((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(SYNAPSE_PINNED_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const filteredCatalog = useMemo(() => {
    const kw = searchQuery.trim().toLowerCase();
    return MONUMENT_CATALOG.filter((m) => {
      if (subjectZoneFilter === 'bio_chem') {
        if (m.relatedSubject !== 'chemistry' && m.relatedSubject !== 'biology') return false;
      } else if (subjectZoneFilter !== 'all' && m.relatedSubject !== subjectZoneFilter) {
        return false;
      }
      if (categoryFilter === 'pinned') {
        if (!pinnedWonders.includes(m.id)) return false;
      } else if (categoryFilter !== 'all' && m.category !== categoryFilter) {
        return false;
      }
      if (kw) {
        const hay =
          `${m.code} ${m.titleVi} ${m.titleEn} ${m.subtitleVi} ${m.subtitleEn} ${m.descriptionVi}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [categoryFilter, subjectZoneFilter, searchQuery, pinnedWonders]);

  const handleSelectMonument = (nextId: MonumentId, openStage = false) => {
    const def = MONUMENT_CATALOG.find((m) => m.id === nextId) || MONUMENT_CATALOG[0];
    setPrimaryParam(def.primaryRange[2]);
    setSecondaryParam(def.secondaryRange[2]);
    setExplodeFactor(0);
    setIsPaused(false);
    setMeasurePoints([]);
    setTelemetryHistory([]);

    if (openStage || studioMode === 'stage') {
      navigate(
        {
          subject: 'synapse_v2',
          futureTab: 'megastructures',
          synapseMonumentId: nextId,
          synapseMode: openStage ? 'stage' : studioMode
        },
        { replace: !openStage && studioMode === 'stage' }
      );
    } else {
      navigate(
        { subject: 'synapse_v2', futureTab: 'megastructures', synapseMonumentId: nextId },
        { replace: true }
      );
    }

    if (!visitedWonders.includes(nextId)) {
      setVisitedWonders((prev) => [...prev, nextId]);
      onEarnXP?.(25);
    }
  };

  // Live refs read by requestAnimationFrame without resetting WebGLRenderer
  const paramsRef = useRef<SynapseV2Params>({
    primaryParam,
    secondaryParam,
    explodeFactor,
    timeScale
  });
  paramsRef.current = {
    primaryParam,
    secondaryParam,
    explodeFactor,
    timeScale: isPaused ? 0 : timeScale
  };

  const activeIdRef = useRef<MonumentId>(activeId);
  activeIdRef.current = activeId;

  const presetRef = useRef<CameraPresetId>(cameraPreset);
  presetRef.current = cameraPreset;
  const cameraLerpingRef = useRef<boolean>(false);
  const desiredCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(...CAMERA_PRESETS.drone.pos));
  const desiredTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(...CAMERA_PRESETS.drone.target));

  const autoOrbitRef = useRef<{ enabled: boolean; speed: number }>({
    enabled: autoOrbitEnabled,
    speed: orbitSpeed
  });
  autoOrbitRef.current = { enabled: autoOrbitEnabled, speed: orbitSpeed };

  const applyCameraPreset = (preset: CameraPresetId) => {
    setCameraPreset(preset);
    if (preset === 'drone') {
      setAutoOrbitEnabled(true);
    }
    const cfg = CAMERA_PRESETS[preset];
    desiredCamPosRef.current.set(...cfg.pos);
    desiredTargetRef.current.set(...cfg.target);
    cameraLerpingRef.current = true;
  };

  const saveCameraBookmark = () => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    setCameraBookmark({
      pos: [cam.position.x, cam.position.y, cam.position.z],
      target: [ctrl.target.x, ctrl.target.y, ctrl.target.z],
      fov: cameraFov
    });
  };

  const recallCameraBookmark = () => {
    if (!cameraBookmark) return;
    setAutoOrbitEnabled(false);
    setCameraFov(cameraBookmark.fov);
    desiredCamPosRef.current.set(...cameraBookmark.pos);
    desiredTargetRef.current.set(...cameraBookmark.target);
    cameraLerpingRef.current = true;
  };

  const resetCurrentMonument = useCallback(() => {
    setPrimaryParam(activeDef.primaryRange[2]);
    setSecondaryParam(activeDef.secondaryRange[2]);
    setExplodeFactor(0);
    setTimeScale(1);
    setOrbitSpeed(1);
    setAutoOrbitEnabled(true);
    setCameraFov(46);
    setRenderStyle('pbr');
    setLightingMood('cosmic');
    setSliceEnabled(false);
    setSliceHeight(3.5);
    setSliceAxis('y');
    setSliceInvert(false);
    setShowPlatform(true);
    setMeasurePoints([]);
    setIsPaused(false);
    applyCameraPreset('drone');
  }, [activeDef]);

  // Keyboard shortcuts ('H' toggle HUD, 'Space' play/pause, 'R' reset, 'Escape' exit fullscreen)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (studioMode === 'stage') {
        const lower = e.key.toLowerCase();
        if (lower === 'h') {
          setIsDockOpen((prev) => !prev);
        } else if (e.code === 'Space') {
          e.preventDefault();
          setIsPaused((p) => !p);
        } else if (lower === 'r') {
          resetCurrentMonument();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFullscreen, studioMode, resetCurrentMonument]);

  // Persistent Three.js Scene & Renderer Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const citadelGroupRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<{
    hemi: THREE.HemisphereLight;
    key: THREE.DirectionalLight;
    rim: THREE.DirectionalLight;
    magenta: THREE.DirectionalLight;
    core: THREE.PointLight;
  } | null>(null);
  const clipPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, -1, 0), 3.5));
  const materialOrigRef = useRef<
    WeakMap<
      THREE.Material,
      {
        wireframe: boolean;
        transparent: boolean;
        opacity: number;
        side: THREE.Side;
        transmission: number;
        colorHex?: number;
        emissiveHex?: number;
        emissiveIntensity?: number;
      }
    >
  >(new WeakMap());
  const monumentSlotRef = useRef<THREE.Group | null>(null);
  const activeBuiltRef = useRef<BuiltMonument | null>(null);
  const bgStarFieldRef = useRef<THREE.Points | null>(null);
  const sliceGuideRef = useRef<THREE.Group | null>(null);
  const measureGroupRef = useRef<THREE.Group | null>(null);
  const measureModeRef = useRef<boolean>(measureMode);
  measureModeRef.current = measureMode;
  const isSoftwareGlRef = useRef<boolean>(false);
  const perfPrefsRef = useRef(perfPrefs);
  perfPrefsRef.current = perfPrefs;

  // Initialize Three.js World ONLY while in 'stage' mode
  useEffect(() => {
    if (studioMode !== 'stage') return;
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();
    isSoftwareGlRef.current = isSoftwareGl;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance'
      });
    } catch {
      setWebglError(true);
      return;
    }

    const width = container.clientWidth || 960;
    const height = Math.max(container.clientHeight || 620, 480);
    renderer.setSize(width, height);
    renderer.setPixelRatio(
      computeSynapseDpr(isSoftwareGl, perfPrefsRef.current.resolutionScale)
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.localClippingEnabled = true;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x07102a);
    scene.fog = new THREE.FogExp2(0x091436, 0.0105);

    const skyDome = buildCosmicSkyDome(isSoftwareGl);
    scene.add(skyDome.mesh);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.88;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 200);
    camera.position.set(...CAMERA_PRESETS.drone.pos);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.055;
    controls.minDistance = 3.2;
    controls.maxDistance = 34;
    controls.maxPolarAngle = Math.PI * 0.62;
    controls.target.set(...CAMERA_PRESETS.drone.target);

    const cancelLerp = () => {
      cameraLerpingRef.current = false;
    };
    controls.addEventListener('start', cancelLerp);

    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x1e1b4b, 0.82);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.25);
    keyLight.position.set(12, 18, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.65);
    rimLight.position.set(-14, 7, -12);
    scene.add(rimLight);

    const magentaFillLight = new THREE.DirectionalLight(0xa855f7, 0.95);
    magentaFillLight.position.set(10, 4, -14);
    scene.add(magentaFillLight);

    const coreAccentLight = new THREE.PointLight(0x6366f1, 2.4, 26, 1.4);
    coreAccentLight.position.set(0, 1.5, 0);
    scene.add(coreAccentLight);
    lightsRef.current = {
      hemi: hemiLight,
      key: keyLight,
      rim: rimLight,
      magenta: magentaFillLight,
      core: coreAccentLight
    };

    const glowTex = createGlowSpriteTexture();
    const bgStarsCount = isSoftwareGl ? 600 : 1600;
    const bgStarGeo = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgStarsCount * 3);
    const bgColors = new Float32Array(bgStarsCount * 3);
    const tmpCol = new THREE.Color();
    for (let i = 0; i < bgStarsCount; i++) {
      const r = 34 + Math.random() * 58;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      bgPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      bgPositions[i * 3 + 1] = r * Math.cos(phi);
      bgPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      tmpCol.setHSL(0.55 + (Math.random() - 0.5) * 0.25, 0.7, 0.72 + Math.random() * 0.25);
      bgColors[i * 3] = tmpCol.r;
      bgColors[i * 3 + 1] = tmpCol.g;
      bgColors[i * 3 + 2] = tmpCol.b;
    }
    bgStarGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    bgStarGeo.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));
    const bgStarMat = new THREE.PointsMaterial({
      size: 0.42,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const bgStarField = new THREE.Points(bgStarGeo, bgStarMat);
    bgStarField.visible = perfPrefsRef.current.resolutionScale > 0.55;
    scene.add(bgStarField);
    bgStarFieldRef.current = bgStarField;

    const circuitTex = createCircuitPlateTexture();
    const shadowTex = createContactShadowTexture();
    const citadel = buildCitadelEnvironment(circuitTex, shadowTex, isSoftwareGl);
    scene.add(citadel.group);
    citadelGroupRef.current = citadel.group;

    const monumentSlot = new THREE.Group();
    scene.add(monumentSlot);
    monumentSlotRef.current = monumentSlot;

    const initialBuilt = buildMonument(activeIdRef.current, isSoftwareGl);
    monumentSlot.add(initialBuilt.root);
    activeBuiltRef.current = initialBuilt;

    // Cross-section laser guide plane (visible only when sliceEnabled is true)
    const sliceGuideGroup = new THREE.Group();
    const slicePlaneGeo = new THREE.PlaneGeometry(11, 11);
    const slicePlaneMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const slicePlaneMesh = new THREE.Mesh(slicePlaneGeo, slicePlaneMat);
    slicePlaneMesh.rotation.x = -Math.PI / 2;
    const sliceEdgesGeo = new THREE.EdgesGeometry(slicePlaneGeo);
    const sliceEdgesMat = new THREE.LineBasicMaterial({
      color: 0xfb7185,
      transparent: true,
      opacity: 0.72
    });
    const sliceEdges = new THREE.LineSegments(sliceEdgesGeo, sliceEdgesMat);
    sliceEdges.rotation.x = -Math.PI / 2;
    sliceGuideGroup.add(slicePlaneMesh, sliceEdges);
    sliceGuideGroup.visible = false;
    scene.add(sliceGuideGroup);
    sliceGuideRef.current = sliceGuideGroup;

    // Spatial 3D ruler measurement group
    const measureGroup = new THREE.Group();
    scene.add(measureGroup);
    measureGroupRef.current = measureGroup;

    const canvasEl = renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const pointerDownPos = { x: 0, y: 0 };
    const onPointerDown = (ev: PointerEvent) => {
      pointerDownPos.x = ev.clientX;
      pointerDownPos.y = ev.clientY;
    };
    const onPointerUp = (ev: PointerEvent) => {
      if (!measureModeRef.current || !monumentSlotRef.current) return;
      const distMoved = Math.hypot(ev.clientX - pointerDownPos.x, ev.clientY - pointerDownPos.y);
      if (distMoved > 5) return;
      const rect = canvasEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const ndc = new THREE.Vector2(
        ((ev.clientX - rect.left) / rect.width) * 2 - 1,
        -((ev.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(monumentSlotRef.current.children, true);
      if (hits.length > 0) {
        const pt = hits[0].point;
        const sample = { x: pt.x, y: pt.y, z: pt.z };
        setMeasurePoints((prev) => (prev.length >= 2 ? [sample] : [...prev, sample]));
      }
    };
    canvasEl.addEventListener('pointerdown', onPointerDown);
    canvasEl.addEventListener('pointerup', onPointerUp);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    canvasEl.addEventListener('webglcontextlost', onContextLost);
    canvasEl.addEventListener('webglcontextrestored', onContextRestored);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    if (resizeObserver) resizeObserver.observe(container);

    let frameId = 0;
    let paceTimer: number | null = null;
    let disposed = false;
    let lastTime = performance.now();
    let lastRenderAt = 0;
    let elapsed = 0;

    const afterDraw = (cb: () => void) => {
      try {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            paceTimer = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            paceTimer = window.setTimeout(cb, 80);
          }
        };
        paceTimer = window.setTimeout(poll, 5);
      } catch {
        paceTimer = window.setTimeout(cb, 80);
      }
    };

    const tick = () => {
      if (disposed) return;
      if (document.hidden) {
        lastTime = performance.now();
        frameId = requestAnimationFrame(tick);
        return;
      }

      const now = performance.now();
      const rawDelta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const params = paramsRef.current;
      elapsed += rawDelta * (params.timeScale > 0 ? 1 : 0);

      skyDome.update(elapsed);
      citadel.update(elapsed);
      bgStarField.rotation.y += rawDelta * 0.012;
      activeBuiltRef.current?.update(elapsed, rawDelta, params);

      if (cameraLerpingRef.current) {
        const alpha = 1 - Math.exp(-5.5 * rawDelta);
        camera.position.lerp(desiredCamPosRef.current, alpha);
        controls.target.lerp(desiredTargetRef.current, alpha);
        if (camera.position.distanceTo(desiredCamPosRef.current) < 0.05) {
          cameraLerpingRef.current = false;
        }
      } else if (autoOrbitRef.current.enabled && autoOrbitRef.current.speed > 0.01) {
        const rotAngle = rawDelta * 0.16 * autoOrbitRef.current.speed;
        const cx = camera.position.x - controls.target.x;
        const cz = camera.position.z - controls.target.z;
        const cosA = Math.cos(rotAngle);
        const sinA = Math.sin(rotAngle);
        camera.position.x = controls.target.x + cx * cosA - cz * sinA;
        camera.position.z = controls.target.z + cx * sinA + cz * cosA;
      }

      controls.update();
      const fpsCap = perfPrefsRef.current.targetFps;
      if (fpsCap > 30 || isSoftwareGl || now - lastRenderAt >= 31) {
        lastRenderAt = now;
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(() => {
          if (!disposed) frameId = requestAnimationFrame(tick);
        });
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    const unsubRemote = subscribeRemoteCommand((cmd) => {
      if (cmd.type === 'orbit') {
        cameraLerpingRef.current = false;
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
      } else if (cmd.type === 'explode_set') {
        setExplodeFactor(Math.max(0, Math.min(1, cmd.value)));
      } else if (cmd.type === 'explode_toggle') {
        setExplodeFactor((prev) => (prev > 0.25 ? 0 : 0.75));
      } else if (cmd.type === 'toggle_play') {
        setIsPaused((prev) => !prev);
      } else if (cmd.type === 'reset_view') {
        resetCurrentMonument();
      } else if (cmd.type === 'slide_prev' || cmd.type === 'slide_next') {
        const presetKeys = Object.keys(CAMERA_PRESETS) as CameraPresetId[];
        const idx = presetKeys.indexOf(presetRef.current);
        const nextIdx =
          cmd.type === 'slide_next'
            ? (idx + 1) % presetKeys.length
            : (idx - 1 + presetKeys.length) % presetKeys.length;
        applyCameraPreset(presetKeys[nextIdx]);
      }
    });

    return () => {
      unsubRemote();
      disposed = true;
      cancelAnimationFrame(frameId);
      if (paceTimer !== null) window.clearTimeout(paceTimer);
      controls.removeEventListener('start', cancelLerp);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('pointerdown', onPointerDown);
      canvasEl.removeEventListener('pointerup', onPointerUp);
      canvasEl.removeEventListener('webglcontextlost', onContextLost);
      canvasEl.removeEventListener('webglcontextrestored', onContextRestored);
      resizeObserver?.disconnect();
      controls.dispose();
      activeBuiltRef.current?.dispose();
      citadel.dispose();
      skyDome.dispose();
      envRT.dispose();
      circuitTex.dispose();
      shadowTex.dispose();
      glowTex.dispose();
      bgStarGeo.dispose();
      bgStarMat.dispose();
      slicePlaneGeo.dispose();
      slicePlaneMat.dispose();
      sliceEdgesGeo.dispose();
      sliceEdgesMat.dispose();
      if (measureGroupRef.current) {
        measureGroupRef.current.children.forEach((child) => {
          const obj = child as THREE.Mesh;
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material?.dispose();
        });
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      monumentSlotRef.current = null;
      activeBuiltRef.current = null;
      bgStarFieldRef.current = null;
      sliceGuideRef.current = null;
      measureGroupRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      citadelGroupRef.current = null;
      lightsRef.current = null;
      sceneRef.current = null;
    };
  }, [studioMode]);

  // Apply Render Material Style (PBR / Wireframe / X-Ray Glass / Thermal / Stress / Flux) cleanly
  const applyRenderStyleToMonument = useCallback((root: THREE.Object3D | null, style: RenderStyleId) => {
    if (!root) return;
    const disableTransmission =
      isSoftwareGlRef.current || perfPrefsRef.current.resolutionScale <= 0.75;
    const tmpBox = new THREE.Box3().setFromObject(root);
    const maxR = Math.max(1.5, tmpBox.getSize(new THREE.Vector3()).length() * 0.5);
    const tmpPos = new THREE.Vector3();
    const cCool = new THREE.Color(0x0284c7);
    const cMid = new THREE.Color(0xf59e0b);
    const cHot = new THREE.Color(0xf43f5e);
    const cFluxA = new THREE.Color(0x6366f1);
    const cFluxB = new THREE.Color(0x10b981);

    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh && !(obj as THREE.Line).isLine) return;
      mesh.getWorldPosition(tmpPos);
      const radialNorm = Math.min(1, tmpPos.length() / maxR);
      const heightNorm = Math.min(1, Math.max(0, (tmpPos.y - tmpBox.min.y) / Math.max(0.5, tmpBox.max.y - tmpBox.min.y)));

      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        if (!mat) return;
        let orig = materialOrigRef.current.get(mat);
        if (!orig) {
          const std = mat as THREE.MeshStandardMaterial;
          orig = {
            wireframe: 'wireframe' in mat ? Boolean(std.wireframe) : false,
            transparent: Boolean(mat.transparent),
            opacity: typeof mat.opacity === 'number' ? mat.opacity : 1,
            side: mat.side,
            transmission:
              'transmission' in mat ? Number((mat as THREE.MeshPhysicalMaterial).transmission || 0) : 0,
            colorHex: 'color' in std && std.color ? std.color.getHex() : undefined,
            emissiveHex: 'emissive' in std && std.emissive ? std.emissive.getHex() : undefined,
            emissiveIntensity: 'emissiveIntensity' in std ? std.emissiveIntensity : undefined
          };
          materialOrigRef.current.set(mat, orig);
        }
        const std = mat as THREE.MeshStandardMaterial;
        // Restore base colors first before applying analytic overlays
        if (orig.colorHex !== undefined && 'color' in std && std.color) {
          std.color.setHex(orig.colorHex);
        }
        if (orig.emissiveHex !== undefined && 'emissive' in std && std.emissive) {
          std.emissive.setHex(orig.emissiveHex);
        }
        if (orig.emissiveIntensity !== undefined && 'emissiveIntensity' in std) {
          std.emissiveIntensity = orig.emissiveIntensity;
        }

        if (style === 'pbr') {
          if ('wireframe' in mat) std.wireframe = orig.wireframe;
          mat.transparent = orig.transparent;
          mat.opacity = orig.opacity;
          mat.side = orig.side;
          if ('transmission' in mat) {
            (mat as THREE.MeshPhysicalMaterial).transmission = disableTransmission ? 0 : orig.transmission;
          }
        } else if (style === 'wireframe') {
          if ('wireframe' in mat) std.wireframe = true;
          mat.transparent = true;
          mat.opacity = Math.max(0.45, Math.min(0.95, orig.opacity));
          if ('transmission' in mat) (mat as THREE.MeshPhysicalMaterial).transmission = 0;
        } else if (style === 'xray') {
          if ('wireframe' in mat) std.wireframe = false;
          mat.transparent = true;
          mat.opacity = Math.min(0.36, orig.opacity);
          mat.side = THREE.DoubleSide;
          if ('transmission' in mat) (mat as THREE.MeshPhysicalMaterial).transmission = 0;
        } else if (style === 'thermal') {
          if ('wireframe' in mat) std.wireframe = false;
          mat.transparent = orig.transparent;
          mat.opacity = orig.opacity;
          const heat = 1 - radialNorm;
          if ('color' in std && std.color) {
            if (heat < 0.5) std.color.lerpColors(cCool, cMid, heat * 2);
            else std.color.lerpColors(cMid, cHot, (heat - 0.5) * 2);
          }
          if ('emissive' in std && std.emissive) {
            std.emissive.copy(heat > 0.6 ? cHot : cCool);
            std.emissiveIntensity = 0.2 + heat * 0.45;
          }
        } else if (style === 'stress') {
          if ('wireframe' in mat) std.wireframe = false;
          mat.transparent = orig.transparent;
          mat.opacity = orig.opacity;
          const load = 1 - heightNorm;
          if ('color' in std && std.color) {
            if (load < 0.5) std.color.lerpColors(cFluxB, cMid, load * 2);
            else std.color.lerpColors(cMid, cHot, (load - 0.5) * 2);
          }
        } else if (style === 'flux') {
          if ('wireframe' in mat) std.wireframe = false;
          mat.transparent = true;
          mat.opacity = Math.min(0.92, Math.max(0.55, orig.opacity));
          if ('color' in std && std.color) {
            std.color.lerpColors(cFluxA, cFluxB, radialNorm);
          }
          if ('emissive' in std && std.emissive) {
            std.emissive.setHex(0x22d3ee);
            std.emissiveIntensity = 0.35;
          }
        }
        mat.needsUpdate = true;
      });
    });
  }, []);

  // Swap Active Monument inside the persistent WebGL stage cleanly & index sub-assembly outliner
  useEffect(() => {
    if (studioMode !== 'stage') return;
    const slot = monumentSlotRef.current;
    if (!slot) return;

    if (activeBuiltRef.current) {
      slot.remove(activeBuiltRef.current.root);
      activeBuiltRef.current.dispose();
      activeBuiltRef.current = null;
    }

    const nextBuilt = buildMonument(
      activeId,
      isSoftwareGlRef.current || perfPrefsRef.current.resolutionScale <= 0.65
    );
    applyRenderStyleToMonument(nextBuilt.root, renderStyle);
    slot.add(nextBuilt.root);
    activeBuiltRef.current = nextBuilt;

    const nodes: OutlinerNode[] = nextBuilt.root.children.slice(0, 14).map((child, idx) => {
      const geoType =
        (child as THREE.Mesh).geometry?.type?.replace('Geometry', '') ||
        (child.children?.length ? `Assembly (${child.children.length} parts)` : 'Module');
      const label = child.name?.trim()
        ? child.name
        : `${isEn ? 'Sub-Assembly' : 'Cụm chi tiết'} #${String(idx + 1).padStart(2, '0')} · ${geoType}`;
      return {
        key: `${activeId}_sub_${idx}`,
        label,
        obj: child,
        visible: true
      };
    });
    setOutlinerNodes(nodes);
    setIsolatedNodeKey(null);
  }, [activeId, studioMode, applyRenderStyleToMonument, isEn]);

  // Guided Camera Waypoint Auto-Tour
  useEffect(() => {
    if (!autoTourEnabled || studioMode !== 'stage') return;
    const seq: CameraPresetId[] = ['overview', 'core', 'zenith', 'side', 'lowAngle', 'drone'];
    let stepIdx = 0;
    const id = window.setInterval(() => {
      stepIdx = (stepIdx + 1) % seq.length;
      applyCameraPreset(seq[stepIdx]);
    }, 4200);
    return () => window.clearInterval(id);
  }, [autoTourEnabled, studioMode]);

  // Live updates for Resolution Scale, FOV, RenderStyle, LightingMood, Cross-Section Slice Plane, and Citadel Platform
  useEffect(() => {
    if (studioMode !== 'stage') return;
    const r = rendererRef.current;
    if (r) {
      r.setPixelRatio(computeSynapseDpr(isSoftwareGlRef.current, resolutionScale));
    }
    if (bgStarFieldRef.current) {
      bgStarFieldRef.current.visible = resolutionScale > 0.55;
    }
    applyRenderStyleToMonument(activeBuiltRef.current?.root || null, renderStyle);
  }, [resolutionScale, studioMode, renderStyle, applyRenderStyleToMonument]);

  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    cam.fov = cameraFov;
    cam.updateProjectionMatrix();
  }, [cameraFov]);

  useEffect(() => {
    const r = rendererRef.current;
    if (!r) return;
    const sign = sliceInvert ? 1 : -1;
    if (sliceAxis === 'x') {
      clipPlaneRef.current.normal.set(sign, 0, 0);
      clipPlaneRef.current.constant = sliceInvert ? -sliceHeight : sliceHeight;
    } else if (sliceAxis === 'z') {
      clipPlaneRef.current.normal.set(0, 0, sign);
      clipPlaneRef.current.constant = sliceInvert ? -sliceHeight : sliceHeight;
    } else {
      clipPlaneRef.current.normal.set(0, sign, 0);
      clipPlaneRef.current.constant = sliceInvert ? -sliceHeight : sliceHeight;
    }
    r.clippingPlanes = sliceEnabled ? [clipPlaneRef.current] : [];

    if (sliceGuideRef.current) {
      sliceGuideRef.current.visible = sliceEnabled;
      sliceGuideRef.current.position.set(0, 0, 0);
      sliceGuideRef.current.rotation.set(0, 0, 0);
      if (sliceAxis === 'x') {
        sliceGuideRef.current.rotation.z = Math.PI / 2;
        sliceGuideRef.current.position.x = sliceHeight;
      } else if (sliceAxis === 'z') {
        sliceGuideRef.current.rotation.x = Math.PI / 2;
        sliceGuideRef.current.position.z = sliceHeight;
      } else {
        sliceGuideRef.current.position.y = sliceHeight;
      }
    }
  }, [sliceEnabled, sliceHeight, sliceAxis, sliceInvert, studioMode]);

  useEffect(() => {
    const grp = measureGroupRef.current;
    if (!grp) return;
    while (grp.children.length > 0) {
      const child = grp.children[0] as THREE.Mesh;
      grp.remove(child);
      child.geometry?.dispose();
      if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
      else child.material?.dispose();
    }
    if (measurePoints.length === 0) return;

    measurePoints.forEach((pt, idx) => {
      const sGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const sMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0x38bdf8 : 0x34d399
      });
      const marker = new THREE.Mesh(sGeo, sMat);
      marker.position.set(pt.x, pt.y, pt.z);
      grp.add(marker);
    });

    if (measurePoints.length === 2) {
      const [p1, p2] = measurePoints;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(p1.x, p1.y, p1.z),
        new THREE.Vector3(p2.x, p2.y, p2.z)
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x34d399 });
      grp.add(new THREE.Line(lineGeo, lineMat));
    }
  }, [measurePoints, studioMode]);

  useEffect(() => {
    if (citadelGroupRef.current) {
      citadelGroupRef.current.visible = showPlatform;
    }
  }, [showPlatform, studioMode]);

  useEffect(() => {
    const sc = sceneRef.current;
    const r = rendererRef.current;
    const l = lightsRef.current;
    if (!sc || !r || !l) return;

    if (lightingMood === 'cosmic') {
      sc.background = new THREE.Color(0x07102a);
      sc.fog = new THREE.FogExp2(0x091436, 0.0105);
      l.hemi.color.setHex(0xbae6fd);
      l.hemi.intensity = 0.82;
      l.key.color.setHex(0xfff4e0);
      l.key.intensity = 2.25;
      l.rim.color.setHex(0x38bdf8);
      l.rim.intensity = 1.65;
      l.magenta.intensity = 0.95;
      r.toneMappingExposure = 1.15;
    } else if (lightingMood === 'studio') {
      sc.background = new THREE.Color(0x0f172a);
      sc.fog = new THREE.FogExp2(0x0f172a, 0.005);
      l.hemi.color.setHex(0xffffff);
      l.hemi.intensity = 1.35;
      l.key.color.setHex(0xf8fafc);
      l.key.intensity = 2.85;
      l.rim.color.setHex(0x7dd3fc);
      l.rim.intensity = 1.35;
      l.magenta.intensity = 0.45;
      r.toneMappingExposure = 1.32;
    } else {
      sc.background = new THREE.Color(0x160f24);
      sc.fog = new THREE.FogExp2(0x1e1330, 0.009);
      l.hemi.color.setHex(0xfef08a);
      l.hemi.intensity = 0.95;
      l.key.color.setHex(0xfbbf24);
      l.key.intensity = 3.1;
      l.rim.color.setHex(0xf97316);
      l.rim.intensity = 1.85;
      l.magenta.intensity = 0.7;
      r.toneMappingExposure = 1.22;
    }
  }, [lightingMood, studioMode]);

  const handleCaptureSnapshot = () => {
    const r = rendererRef.current;
    const sc = sceneRef.current;
    const cam = cameraRef.current;
    if (!r || !sc || !cam) return;
    r.render(sc, cam);
    const dataUrl = r.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `synapse-3d-${activeDef.id}.png`;
    a.click();
  };

  const {
    isRecording: isRecording3D,
    recordSeconds: recordSeconds3D,
    toggleRecording: toggleRecording3D,
    stopRecording: stopRecording3D,
    supported: videoRecSupported
  } = useCanvasRecorder(() => rendererRef.current?.domElement, `synapse-3d-${activeDef.id}`);

  const telemetry = useMemo(
    () =>
      computeTelemetry(activeId, {
        primaryParam,
        secondaryParam,
        explodeFactor,
        timeScale
      }),
    [activeId, primaryParam, secondaryParam, explodeFactor, timeScale]
  );

  // Append telemetry history points when parameters change or live tick runs
  useEffect(() => {
    if (studioMode !== 'stage') return;
    const stamp = new Date().toLocaleTimeString('vi-VN', {
      minute: '2-digit',
      second: '2-digit'
    });
    const m1 = parseLeadingFloat(telemetry.metric1Value);
    const m2 = parseLeadingFloat(telemetry.metric2Value);
    const m3 = parseLeadingFloat(telemetry.metric3Value);
    setTelemetryHistory((prev) => [...prev.slice(-47), { t: stamp, m1, m2, m3 }]);
  }, [telemetry, studioMode]);

  // Engineering Mission per monument: reach high-output peak regime OR cutaway inspection
  const primaryNorm =
    (primaryParam - activeDef.primaryRange[0]) /
    Math.max(1e-4, activeDef.primaryRange[1] - activeDef.primaryRange[0]);
  const secondaryNorm =
    (secondaryParam - activeDef.secondaryRange[0]) /
    Math.max(1e-4, activeDef.secondaryRange[1] - activeDef.secondaryRange[0]);
  const missionDoneNow = primaryNorm >= 0.72 && secondaryNorm >= 0.62 && explodeFactor >= 0.3;

  useEffect(() => {
    if (studioMode !== 'stage' || !missionDoneNow) return;
    if (!completedMissions.includes(activeId)) {
      const next = [...completedMissions, activeId];
      setCompletedMissions(next);
      try {
        localStorage.setItem(SYNAPSE_MISSIONS_KEY, JSON.stringify(next));
      } catch {}
      onEarnXP?.(35);
    }
  }, [missionDoneNow, activeId, studioMode, completedMissions, onEarnXP]);

  const handleExportTelemetryCsv = () => {
    const rows = (telemetryHistory.length > 0
      ? telemetryHistory
      : [
          {
            t: new Date().toLocaleTimeString('vi-VN'),
            m1: parseLeadingFloat(telemetry.metric1Value),
            m2: parseLeadingFloat(telemetry.metric2Value),
            m3: parseLeadingFloat(telemetry.metric3Value)
          }
        ]
    ).map((pt, idx) => [
      idx + 1,
      pt.t,
      activeDef.code,
      primaryParam,
      secondaryParam,
      Math.round(explodeFactor * 100),
      pt.m1,
      pt.m2,
      pt.m3
    ]);
    exportRowsToCsv(
      `synapse-telemetry-${activeDef.id}`,
      [
        'Sample',
        'Time',
        'Code',
        isEn ? activeDef.primaryLabelEn : activeDef.primaryLabelVi,
        isEn ? activeDef.secondaryLabelEn : activeDef.secondaryLabelVi,
        'Explode %',
        isEn ? telemetry.metric1LabelEn : telemetry.metric1LabelVi,
        isEn ? telemetry.metric2LabelEn : telemetry.metric2LabelVi,
        isEn ? telemetry.metric3LabelEn : telemetry.metric3LabelVi
      ],
      rows
    );
  };

  const handleExportMarkdownDossier = () => {
    const lines = [
      `# SYNAPSE PRE ENGINEERING DOSSIER — ${activeDef.code}`,
      ``,
      `- **${isEn ? 'Megastructure' : 'Đại công trình'}**: ${isEn ? activeDef.titleEn : activeDef.titleVi}`,
      `- **${isEn ? 'Generated At' : 'Thời gian xuất'}**: ${new Date().toLocaleString('vi-VN')}`,
      `- **${isEn ? 'Inspection Shader' : 'Chế độ vật liệu'}**: ${renderStyle.toUpperCase()}`,
      `- **${isEn ? 'Exploded View' : 'Tách lớp cơ khí'}**: ${Math.round(explodeFactor * 100)}%`,
      ``,
      `## ${isEn ? '1. Operating Setpoints' : '1. Tham Số Vận Hành'}`,
      `- **${isEn ? activeDef.primaryLabelEn : activeDef.primaryLabelVi}**: ${primaryParam} ${activeDef.primaryUnit}`,
      `- **${isEn ? activeDef.secondaryLabelEn : activeDef.secondaryLabelVi}**: ${secondaryParam} ${activeDef.secondaryUnit}`,
      ``,
      `## ${isEn ? '2. Live Physical Telemetry' : '2. Chỉ Số Đo Đạc Kỹ Thuật'}`,
      `- **${isEn ? telemetry.metric1LabelEn : telemetry.metric1LabelVi}**: ${telemetry.metric1Value}`,
      `- **${isEn ? telemetry.metric2LabelEn : telemetry.metric2LabelVi}**: ${telemetry.metric2Value}`,
      `- **${isEn ? telemetry.metric3LabelEn : telemetry.metric3LabelVi}**: ${telemetry.metric3Value}`,
      ``,
      `## ${isEn ? '3. Engineering Overview' : '3. Mô Tả Nguyên Lí'}`,
      `${isEn ? activeDef.descriptionEn : activeDef.descriptionVi}`
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapse-dossier-${activeDef.id}.md`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  };

  const toggleOutlinerVisibility = (key: string) => {
    setOutlinerNodes((prev) =>
      prev.map((n) => {
        if (n.key !== key) return n;
        const nextVis = !n.visible;
        n.obj.visible = nextVis;
        return { ...n, visible: nextVis };
      })
    );
  };

  const toggleIsolateOutlinerNode = (key: string) => {
    const nextIso = isolatedNodeKey === key ? null : key;
    setIsolatedNodeKey(nextIso);
    setOutlinerNodes((prev) =>
      prev.map((n) => {
        const nextVis = nextIso === null ? true : n.key === nextIso;
        n.obj.visible = nextVis;
        return { ...n, visible: nextVis };
      })
    );
  };

  const sweepCurveData = useMemo(() => {
    const [minP, maxP] = activeDef.primaryRange;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 20; i++) {
      const p = minP + ((maxP - minP) * i) / 20;
      const t = computeTelemetry(activeId, {
        primaryParam: p,
        secondaryParam,
        explodeFactor,
        timeScale
      });
      pts.push({ x: Math.round(p * 100) / 100, y: parseLeadingFloat(t.metric1Value) });
    }
    const minY = Math.min(...pts.map((p) => p.y));
    const maxY = Math.max(...pts.map((p) => p.y));
    return { pts, minY, maxY, minP, maxP };
  }, [activeDef, activeId, explodeFactor, secondaryParam, timeScale]);

  const primaryDisplay =
    activeId === 'neural_aero' ? (primaryParam / 10).toFixed(1) : Math.round(primaryParam);

  // =========================================================================
  // VIEW 1: FUTURISTIC 30-CARD VIRTUAL CAMPUS LECTURE GALLERY
  // =========================================================================
  if (studioMode === 'catalog') {
    const totalChambers = MONUMENT_CATALOG.length;
    const categories: { id: 'all' | 'pinned' | MonumentCategory; vi: string; en: string }[] = [
      { id: 'all', vi: `Tất cả ${totalChambers} Công trình`, en: `All ${totalChambers} Chambers` },
      { id: 'pinned', vi: `Đã ghim (${pinnedWonders.length})`, en: `Pinned (${pinnedWonders.length})` },
      { id: 'cosmos', vi: 'Khoa học Vũ trụ', en: 'Space Science' },
      { id: 'cs', vi: 'Khoa học Vi tính', en: 'Computer Science' },
      { id: 'physics', vi: 'Vật lí & Năng lượng', en: 'Physics & Energy' },
      { id: 'math', vi: 'Toán học Đa chiều', en: 'Higher-Dim Math' },
      { id: 'future_tech', vi: 'AI & Công nghệ Lượng tử', en: 'AI & Quantum Tech' }
    ];

    const unlockedPct = Math.round((visitedWonders.length / totalChambers) * 100);

    return (
      <>
        {!embeddedInPre && <FuturisticCosmicBackdrop />}
        <div className="relative z-10 space-y-7 pb-14">
          {/* Futuristic Quantum Command Header Banner */}
          <section className="sci-scan-bar relative overflow-hidden rounded-xl border border-sky-400/45 bg-gradient-to-br from-[#06132b] via-[#091b3a] to-[#0b2540] text-white p-6 sm:p-8 shadow-[0_26px_90px_-18px_rgba(2,132,199,0.45)]">
            {/* Animated Holographic Horizon Grid + Sweeping Scan Beam */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 14% 18%, rgba(56,189,248,0.32) 0%, transparent 45%), radial-gradient(circle at 88% 72%, rgba(20,184,166,0.28) 0%, transparent 48%), linear-gradient(to right, rgba(56,189,248,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.12) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 100% 100%, 30px 30px, 30px 30px'
              }}
            />
            <div
              aria-hidden="true"
              className="holo-scan-beam pointer-events-none absolute inset-x-0 h-20 opacity-45"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, rgba(56,189,248,0.22) 50%, transparent 100%)'
              }}
            />

            {/* Corner Cyber Reticles */}
            <span className="pointer-events-none absolute top-3.5 left-3.5 w-5 h-5 border-t-2 border-l-2 border-sky-400/75" />
            <span className="pointer-events-none absolute top-3.5 right-3.5 w-5 h-5 border-t-2 border-r-2 border-sky-400/75" />
            <span className="pointer-events-none absolute bottom-3.5 left-3.5 w-5 h-5 border-b-2 border-l-2 border-teal-400/75" />
            <span className="pointer-events-none absolute bottom-3.5 right-3.5 w-5 h-5 border-b-2 border-r-2 border-teal-400/75" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  {onBack && !embeddedInPre && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="cs-deck-btn group flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-white/10 hover:bg-sky-500/25 border border-white/20 hover:border-sky-400/60 text-xs font-bold text-slate-100 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                      <span>{isEn ? 'Back' : 'Quay lại'}</span>
                    </button>
                  )}
                  <span className="inline-flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.22em] text-sky-300">
                    <Orbit className="w-4 h-4 text-sky-300 icon-anim-cosmos" />
                    {isEn ? 'SYNAPSE PRE · FUTURISTIC MEGASTRUCTURES' : 'ĐẠI CÔNG TRÌNH TƯƠNG LAI · SYNAPSE PRE'}
                  </span>
                  <span className="text-slate-500" aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-300 font-bold tabular-nums">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    {visitedWonders.length}/{totalChambers} {isEn ? 'Megastructures Unlocked' : 'Công trình đã thám hiểm'}
                  </span>
                  <button
                    type="button"
                    onClick={openRemoteModal}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold cursor-pointer whitespace-nowrap ${
                      controllerCount > 0
                        ? 'bg-emerald-500/20 border-emerald-400/70 text-emerald-200'
                        : 'bg-sky-500/15 hover:bg-sky-500/30 border-sky-400/50 text-sky-200'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? 'QR Phone Remote' : 'QR Điều khiển 3D'}</span>
                    {controllerCount > 0 && (
                      <span className="px-1 rounded-[3px] bg-emerald-500 text-slate-950 text-[10px] font-mono font-extrabold tabular-nums">
                        {controllerCount}
                      </span>
                    )}
                  </button>
                </div>

                <h1 className="font-display text-2xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight bg-gradient-to-r from-white via-sky-100 to-teal-200 bg-clip-text text-transparent leading-tight">
                  {isEn
                    ? `${totalChambers} Futuristic Holographic 3D Megastructures`
                    : `${totalChambers} Đại Công Trình Tương Lai 3D Thời Gian Thực`}
                </h1>

                <p className="text-sm text-sky-100/85 leading-relaxed">
                  {isEn
                    ? `Explore ${totalChambers} real-time procedural WebGL 3D simulations spanning physics (CERN LHC Collider, Quantum Double-Slit Laser, Tesla Resonant Coil, Tokamak), space science (James Webb, Wormhole, Pulsar), computer science (Exascale Torus, Superscalar CPU, ZK-Merkle, Dijkstra Graph), and higher-dimensional math.`
                    : `Hệ thống ${totalChambers} đại công trình mô phỏng 3D WebGL thời gian thực vượt bậc: từ Vật lí & Năng lượng (Máy Gia Tốc LHC, Giao Thoa Kế Laser Khe Kép, Tháp Cộng Hưởng Tesla, Lò Tokamak), Khoa học Vũ trụ (Kính James Webb, Lỗ Sâu Morris-Thorne, Pulsar) đến Khoa học Vi tính (Siêu Máy Tính Exascale, CPU 5 Tầng, ZK-Merkle, Dijkstra 3D) và Toán học đa chiều.`}
                </p>

                {/* Quantum Exploration Progress Bar */}
                <div className="pt-1 max-w-md space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-sky-200/90">
                    <span>{isEn ? 'CAMPUS EXPLORATION MATRIX' : 'TIẾN ĐỘ KHÁM PHÁ VŨ TRỤ ẢO'}</span>
                    <span className="font-bold text-emerald-300 tabular-nums">{unlockedPct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-sm bg-slate-900/80 border border-sky-500/30 overflow-hidden">
                    <div
                      className="h-full rounded-sm bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.max(8, unlockedPct)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3.5 shrink-0">
                {/* Animated Orbital Astrolabe Emblem */}
                <div
                  aria-hidden="true"
                  className="hidden lg:flex items-center justify-center relative w-24 h-24 rounded-full border border-sky-400/35 bg-sky-950/35 shadow-[0_0_35px_rgba(56,189,248,0.22)]"
                >
                  <svg viewBox="0 0 100 100" className="w-20 h-20">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="5 6" className="holo-orbit-cw" />
                    <ellipse cx="50" cy="50" rx="34" ry="13" fill="none" stroke="#14b8a6" strokeWidth="1.6" className="holo-orbit-ccw" />
                    <ellipse cx="50" cy="50" rx="34" ry="13" transform="rotate(60 50 50)" fill="none" stroke="#22d3ee" strokeWidth="1.4" />
                    <circle cx="50" cy="50" r="7" fill="#38bdf8" className="holo-ring-pulse" />
                  </svg>
                </div>

                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => handleSelectMonument(activeId, true)}
                  className="group cs-deck-btn px-7 py-3 rounded-md bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 text-slate-950 font-extrabold text-sm shadow-[0_14px_38px_-6px_rgba(56,189,248,0.55)] flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-4 h-4 fill-slate-950 icon-anim-wave" />
                  <span>{isEn ? 'Launch 3D Observatory' : 'Vào Ngay Không Gian 3D'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => setCompareOpen(true)}
                  className="px-4 py-2 rounded-md bg-sky-500/15 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <GitCompareArrows className="w-4 h-4 text-sky-300" />
                  <span>{isEn ? 'Compare 2 Megastructures' : 'So sánh 2 Đại Công Trình'}</span>
                </button>

                <div className="text-xs font-mono text-sky-200/90 text-right tabular-nums">
                  +25 XP {isEn ? 'explore' : 'khám phá'} · +35 XP {isEn ? 'mission' : 'nhiệm vụ'}
                </div>
              </div>
            </div>

            {/* Subject Zone Partition Filter Bar */}
            <div className="relative z-10 mt-6 pt-5 border-t border-sky-400/20 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300/80 mr-1">
                {isEn ? 'Subject Zone:' : 'Khu Môn học:'}
              </span>
              {(
                [
                  { id: 'all', vi: 'Tất cả 5 Môn', en: 'All 5 Subjects' },
                  { id: 'physics', vi: 'Vật lí & Vũ trụ', en: 'Physics & Cosmos' },
                  { id: 'bio_chem', vi: 'Hóa & Sinh Y sinh', en: 'Chem & Bio Labs' },
                  { id: 'math', vi: 'Toán học 4D', en: '4D Mathematics' },
                  { id: 'cs', vi: 'Tin học & AI', en: 'CS & AI Systems' }
                ] as const
              ).map((z) => {
                const activeZone = subjectZoneFilter === z.id;
                return (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setSubjectZoneFilter(z.id)}
                    className={`px-3 py-1.5 rounded-md text-[11px] font-bold whitespace-nowrap cursor-pointer border transition-all ${
                      activeZone
                        ? 'bg-emerald-400 text-slate-950 border-emerald-200 shadow-sm'
                        : 'bg-slate-950/55 text-slate-200 border-white/15 hover:border-emerald-400/60 hover:text-white'
                    }`}
                  >
                    {isEn ? z.en : z.vi}
                  </button>
                );
              })}
            </div>

            {/* Filter & Search Toolbar */}
            <div className="relative z-10 mt-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => {
                  const selected = categoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`group cs-deck-btn px-4 py-2 rounded-md text-xs font-bold whitespace-nowrap cursor-pointer border transition-all ${
                        selected
                          ? 'bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 border-sky-200 shadow-[0_8px_24px_-4px_rgba(56,189,248,0.55)]'
                          : 'bg-sky-950/55 text-sky-100 border-sky-400/20 hover:bg-sky-950/75 hover:text-white hover:border-sky-400/60'
                      }`}
                    >
                      {isEn ? cat.en : cat.vi}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-sky-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isEn
                      ? `Search ${totalChambers} holographic labs...`
                      : `Tìm ${totalChambers} đại công trình tương lai...`
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-950/65 border border-sky-400/30 focus:border-sky-300 focus:outline-none text-xs text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </section>

          {/* 30 Futuristic Holographic Lecture Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCatalog.map((item) => {
              const isExplored = visitedWonders.includes(item.id);
              const isPinned = pinnedWonders.includes(item.id);
              const isMissionDone = completedMissions.includes(item.id);
              return (
                <div
                  key={item.id}
                  style={
                    {
                      '--holo-accent': item.accentHex,
                      '--holo-secondary': item.secondaryHex
                    } as React.CSSProperties
                  }
                  className="holo-card-frame group shadow-[0_20px_50px_-14px_rgba(14,165,233,0.35)] hover:shadow-[0_28px_70px_-12px_rgba(34,211,238,0.58)]"
                >
                  {/* Rotating Holographic Conic Plasma Perimeter Ring */}
                  <div aria-hidden="true" className="holo-conic-ring" />

                  {/* Pin Favorite Star Button (sibling outside launch button so no nested <button>) */}
                  <button
                    type="button"
                    onClick={() => togglePinWonder(item.id)}
                    title={isPinned ? (isEn ? 'Unpin' : 'Bỏ ghim') : isEn ? 'Pin Favorite' : 'Ghim yêu thích'}
                    className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                      isPinned
                        ? 'bg-amber-400/90 border-amber-200 text-slate-950 shadow-md'
                        : 'bg-slate-950/75 border-white/20 text-slate-300 hover:border-amber-300 hover:text-amber-300'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isPinned ? 'fill-slate-950' : ''}`} />
                  </button>

                  {/* Card Inner Futuristic Container */}
                  <button
                    type="button"
                    data-ripple="true"
                    onClick={() => handleSelectMonument(item.id, true)}
                    className="relative z-10 w-full h-full flex flex-col justify-between text-left rounded-[0.68rem] bg-gradient-to-br from-[#071429] via-[#061124] to-[#0a1c36] text-white overflow-hidden cursor-pointer"
                  >
                    <div>
                      {/* Live Animated Holographic Artwork Header */}
                      <FuturisticThumbPreview
                        id={item.id}
                        accentHex={item.accentHex}
                        secondaryHex={item.secondaryHex}
                      />

                      {/* Card Body */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {renderMonumentIcon(item.id, 'w-4 h-4 shrink-0')}
                            <span className="font-extrabold text-sky-300 truncate">{item.code}</span>
                            <span className="text-slate-500" aria-hidden="true">·</span>
                            <span className="text-sky-200/75 truncate">
                              {isEn ? item.categoryLabelEn : item.categoryLabelVi}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isMissionDone && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold">
                                <Award className="w-3 h-3" />
                                PRO
                              </span>
                            )}
                            {isExplored ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {isEn ? 'Unlocked' : 'Đã mở'}
                              </span>
                            ) : (
                              <span className="text-amber-300 font-bold">+25 XP</span>
                            )}
                          </div>
                        </div>

                        <h3 className="font-display text-base sm:text-lg font-extrabold text-white group-hover:text-sky-300 transition-colors leading-snug">
                          {isEn ? item.titleEn : item.titleVi}
                        </h3>

                        <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-2">
                          {isEn ? item.descriptionEn : item.descriptionVi}
                        </p>

                        {/* Futuristic Telemetry Spec Bar */}
                        <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div className="rounded-md bg-sky-950/45 border border-sky-400/20 px-2.5 py-1.5 truncate">
                            <span className="text-sky-300/70 block text-[9px] uppercase">
                              {isEn ? item.primaryLabelEn : item.primaryLabelVi}
                            </span>
                            <span className="text-sky-300 font-bold tabular-nums">
                              {item.primaryRange[0]}–{item.primaryRange[1]} {item.primaryUnit}
                            </span>
                          </div>
                          <div className="rounded-md bg-teal-950/40 border border-teal-400/20 px-2.5 py-1.5 truncate">
                            <span className="text-teal-200/70 block text-[9px] uppercase">
                              {isEn ? item.secondaryLabelEn : item.secondaryLabelVi}
                            </span>
                            <span className="text-amber-300 font-bold tabular-nums">
                              {item.secondaryRange[0]}–{item.secondaryRange[1]} {item.secondaryUnit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Launch Bar */}
                    <div className="px-5 py-3.5 border-t border-sky-400/15 bg-gradient-to-r from-sky-500/[0.06] to-teal-500/[0.08] flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-[11px] text-sky-200/75 truncate">
                        {item.tierBadge} · 3D Cutaway
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-extrabold text-sky-300 group-hover:text-white transition-colors shrink-0">
                        <span>{isEn ? 'Launch 3D' : 'Khởi chạy 3D'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side-by-Side Megastructure Spec Comparator Modal */}
        {compareOpen && (
          <div className="fixed inset-0 z-[150] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <div className="w-full max-w-4xl rounded-2xl border border-sky-400/45 bg-[#08152e] text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="px-5 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70">
                <div className="flex items-center gap-2.5">
                  <GitCompareArrows className="w-5 h-5 text-sky-400" />
                  <h2 className="font-display text-base sm:text-lg font-extrabold">
                    {isEn ? 'Side-by-Side Megastructure Comparator' : 'So sánh Thông số 2 Đại Công Trình'}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-lg border border-white/15 bg-white/5 p-0.5 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setCompareRegime('nominal')}
                      className={`px-2.5 py-1 rounded-md cursor-pointer ${
                        compareRegime === 'nominal' ? 'bg-sky-500 text-slate-950' : 'text-slate-300'
                      }`}
                    >
                      {isEn ? 'Nominal' : 'Chuẩn'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompareRegime('max')}
                      className={`px-2.5 py-1 rounded-md cursor-pointer ${
                        compareRegime === 'max' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
                      }`}
                    >
                      {isEn ? 'Peak Max' : 'Cực đại'}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCompareOpen(false)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: compareIdA, setId: setCompareIdA, slot: 'A', accent: 'border-sky-400/50' },
                  { id: compareIdB, setId: setCompareIdB, slot: 'B', accent: 'border-emerald-400/50' }
                ].map(({ id, setId, slot, accent }) => {
                  const def = MONUMENT_CATALOG.find((m) => m.id === id) || MONUMENT_CATALOG[0];
                  const idxVal = compareRegime === 'max' ? 1 : 2;
                  const t = computeTelemetry(def.id, {
                    primaryParam: def.primaryRange[idxVal],
                    secondaryParam: def.secondaryRange[idxVal],
                    explodeFactor: 0,
                    timeScale: 1
                  });
                  return (
                    <div key={slot} className={`rounded-xl border ${accent} bg-slate-950/70 p-4 space-y-3`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono font-bold text-sky-300">
                          {isEn ? `MEGASTRUCTURE ${slot}` : `CÔNG TRÌNH ${slot}`} · {def.code}
                        </span>
                        <select
                          value={id}
                          onChange={(e) => setId(e.target.value as MonumentId)}
                          className="max-w-[210px] rounded-lg bg-slate-900 border border-white/20 px-2.5 py-1.5 text-xs font-bold text-white"
                        >
                          {MONUMENT_CATALOG.map((m) => (
                            <option key={m.id} value={m.id}>
                              #{m.index} {isEn ? m.titleEn : m.titleVi}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        {renderMonumentIcon(def.id, 'w-5 h-5 shrink-0')}
                        <h3 className="font-display text-base font-extrabold text-white">
                          {isEn ? def.titleEn : def.titleVi}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {isEn ? def.descriptionEn : def.descriptionVi}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="rounded-lg bg-white/[0.04] border border-white/10 p-2">
                          <div className="text-[10px] text-slate-400">
                            {isEn ? def.primaryLabelEn : def.primaryLabelVi}
                          </div>
                          <div className="font-bold text-sky-300">
                            {def.primaryRange[idxVal]} {def.primaryUnit}
                          </div>
                        </div>
                        <div className="rounded-lg bg-white/[0.04] border border-white/10 p-2">
                          <div className="text-[10px] text-slate-400">
                            {isEn ? def.secondaryLabelEn : def.secondaryLabelVi}
                          </div>
                          <div className="font-bold text-amber-300">
                            {def.secondaryRange[idxVal]} {def.secondaryUnit}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 rounded-lg bg-slate-900/90 border border-white/10 p-3 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-400">{isEn ? t.metric1LabelEn : t.metric1LabelVi}</span>
                          <span className="font-bold text-cyan-300">{t.metric1Value}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">{isEn ? t.metric2LabelEn : t.metric2LabelVi}</span>
                          <span className="font-bold text-amber-300">{t.metric2Value}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">{isEn ? t.metric3LabelEn : t.metric3LabelVi}</span>
                          <span className="font-bold text-emerald-300">{t.metric3Value}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCompareOpen(false);
                          handleSelectMonument(def.id, true);
                        }}
                        className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        <span>{isEn ? 'Launch This 3D Stage' : 'Mở Công Trình Này'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const handleWonderVoiceCommand = (cmd: WonderStageVoiceCommand) => {
    switch (cmd.kind) {
      case 'select_monument':
        if (cmd.monument) handleSelectMonument(cmd.monument.id, false);
        break;
      case 'next_monument': {
        const curIdx = MONUMENT_CATALOG.findIndex((m) => m.id === activeId);
        const nextM = MONUMENT_CATALOG[(curIdx + 1) % MONUMENT_CATALOG.length];
        if (nextM) handleSelectMonument(nextM.id, false);
        break;
      }
      case 'prev_monument': {
        const curIdx = MONUMENT_CATALOG.findIndex((m) => m.id === activeId);
        const prevM =
          MONUMENT_CATALOG[(curIdx - 1 + MONUMENT_CATALOG.length) % MONUMENT_CATALOG.length];
        if (prevM) handleSelectMonument(prevM.id, false);
        break;
      }
      case 'back_catalog':
        setIsFullscreen(false);
        navigate({ subject: 'synapse_v2', futureTab: 'megastructures', synapseMode: 'catalog' });
        break;
      case 'camera': {
        const mapPreset: Record<NonNullable<typeof cmd.cameraPreset>, CameraPresetId> = {
          orbit: 'drone',
          overview: 'overview',
          core: 'core',
          top: 'zenith',
          side: 'side',
          low: 'lowAngle'
        };
        if (cmd.cameraPreset) applyCameraPreset(mapPreset[cmd.cameraPreset]);
        break;
      }
      case 'explode':
        setExplodeFactor(cmd.explodeValue ?? 0.7);
        break;
      case 'pause':
        setIsPaused(true);
        break;
      case 'play':
        setIsPaused(false);
        break;
      case 'music_track':
        if (cmd.musicTrack) setBgSound(cmd.musicTrack);
        break;
      case 'music_toggle':
        if (isBgPlaying) toggleBgPlaying();
        break;
      case 'low_spec':
        updatePerfPrefs({ resolutionScale: 0.5, targetFps: 30 });
        break;
      case 'high_spec':
        updatePerfPrefs({ resolutionScale: 1.0, targetFps: 60 });
        break;
      default:
        break;
    }
  };

  // =========================================================================
  // VIEW 2: FULL INTERACTIVE 3D WEBGL OBSERVATORY STAGE
  // =========================================================================
  return (
    <>
      <div
        className={
          isFullscreen
            ? 'fixed inset-y-0 right-0 left-0 lg:left-[var(--sidebar-w,272px)] z-[45] bg-[#07102a] text-white flex flex-col overflow-hidden'
            : 'relative z-10 w-full flex flex-col lg:block lg:min-h-[680px] lg:h-[calc(100vh-146px)] rounded-xl overflow-hidden border border-sky-400/50 bg-[#07102a] text-white shadow-[0_28px_90px_-14px_rgba(2,132,199,0.45)]'
        }
      >
        {/* COMPACT TOP HUD BAR (Above canvas on < lg, floating overlay on lg+) */}
        <div className="relative z-20 p-2 sm:p-2.5 lg:p-3 lg:pointer-events-none flex flex-col gap-2 shrink-0 bg-slate-950/90 lg:bg-transparent border-b border-white/10 lg:border-b-0">
          <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 bg-slate-950/88 border border-white/15 rounded-xl px-2 sm:px-2.5 py-1.5 shadow-xl">
            {/* Left Cluster: Back + Prev/Next + Wonder Title + Toggleable Strip */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <button
                type="button"
                onClick={() => {
                  stopRecording3D();
                  setIsFullscreen(false);
                  navigate({ subject: 'synapse_v2', futureTab: 'megastructures', synapseMode: 'catalog' });
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/50 text-sky-200 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title={
                  isEn
                    ? `Return to ${MONUMENT_CATALOG.length} Megastructures`
                    : `Quay lại ${MONUMENT_CATALOG.length} Đại Công Trình Tương Lai`
                }
              >
                <LayoutGrid className="w-3.5 h-3.5 text-sky-300" />
                <span>{MONUMENT_CATALOG.length}</span>
              </button>

              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const idx = MONUMENT_CATALOG.findIndex((m) => m.id === activeId);
                    const prevM =
                      MONUMENT_CATALOG[(idx - 1 + MONUMENT_CATALOG.length) % MONUMENT_CATALOG.length];
                    if (prevM) handleSelectMonument(prevM.id, false);
                  }}
                  className="min-h-[36px] min-w-[34px] flex items-center justify-center rounded-md bg-white/5 hover:bg-white/15 text-slate-300 cursor-pointer"
                  title={isEn ? 'Previous Wonder' : 'Công trình trước'}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const idx = MONUMENT_CATALOG.findIndex((m) => m.id === activeId);
                    const nextM = MONUMENT_CATALOG[(idx + 1) % MONUMENT_CATALOG.length];
                    if (nextM) handleSelectMonument(nextM.id, false);
                  }}
                  className="min-h-[36px] min-w-[34px] flex items-center justify-center rounded-md bg-white/5 hover:bg-white/15 text-slate-300 cursor-pointer"
                  title={isEn ? 'Next Wonder' : 'Công trình tiếp theo'}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="min-w-0 px-1">
                <div className="text-[10px] font-mono font-bold text-sky-300 leading-none">
                  #{String(activeDef.index).padStart(2, '0')}/{MONUMENT_CATALOG.length} · {activeDef.code}
                </div>
                <h1 className="font-display text-xs sm:text-sm font-extrabold text-white truncate max-w-[140px] sm:max-w-[290px] leading-tight mt-0.5">
                  {isEn ? activeDef.titleEn : activeDef.titleVi}
                </h1>
              </div>

              <button
                type="button"
                onClick={() => setIsWonderStripOpen((v) => !v)}
                className={`flex items-center gap-1 min-h-[36px] px-2 py-1.5 rounded-md border text-[11px] font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                  isWonderStripOpen
                    ? 'bg-sky-500/25 border-sky-400 text-sky-200'
                    : 'bg-white/5 border-white/15 text-slate-300 hover:text-white'
                }`}
                title={isEn ? 'Toggle quick 30-wonder switcher bar' : 'Mở/Ẩn dải chọn nhanh 30 công trình'}
              >
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">{isEn ? 'List' : 'Chọn nhanh'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${isWonderStripOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {/* Right Cluster: Music + Compact Perf + Compact Camera + Voice AI + Snapshot + Dock + Fullscreen */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  if (!isBgPlaying || bgSound === 'off') {
                    setBgSound('minecraft_calm');
                  } else {
                    toggleBgPlaying();
                  }
                }}
                className={`flex items-center gap-1 min-h-[36px] px-2.5 py-1.5 rounded-md border text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  isBgPlaying && bgSound !== 'off'
                    ? 'bg-emerald-500/25 border-emerald-400/70 text-emerald-200'
                    : 'bg-white/5 border-white/15 text-slate-200 hover:border-sky-400/60'
                }`}
                title={isEn ? 'Toggle Minecraft / Cosmic Music' : 'Bật/Tắt Nhạc nền'}
              >
                {isBgPlaying && bgSound !== 'off' ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className="hidden lg:inline">
                  {bgSound === 'cosmic_drone' ? 'Vũ trụ' : 'Minecraft'}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setBgSound(bgSound === 'minecraft_calm' ? 'cosmic_drone' : 'minecraft_calm')
                }
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md bg-white/5 border border-white/15 hover:border-sky-400/60 text-sky-300 cursor-pointer"
                title={isEn ? 'Switch track (Minecraft / Cosmic)' : 'Đổi bài (Minecraft / Vũ trụ)'}
              >
                <Music className="w-3.5 h-3.5" />
              </button>

              {/* Compact Performance Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsPerfMenuOpen((v) => !v);
                    setIsCameraMenuOpen(false);
                  }}
                  className="flex items-center gap-1 min-h-[36px] px-2.5 py-1.5 rounded-md bg-white/5 border border-white/15 hover:border-sky-400/60 text-[11px] font-mono font-bold text-cyan-200 cursor-pointer whitespace-nowrap"
                  title={isEn ? '3D Resolution & FPS' : 'Độ phân giải & FPS'}
                >
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{resolutionScale}x · {targetFps}F</span>
                </button>
                {isPerfMenuOpen && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 z-50 w-52 max-w-[calc(100vw-24px)] rounded-lg bg-slate-950/98 border border-white/20 p-2.5 shadow-2xl space-y-2">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      {isEn ? 'Resolution Scale' : 'Độ phân giải 3D'}
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {([0.5, 0.65, 0.85, 1.0] as const).map((sc) => (
                        <button
                          key={sc}
                          type="button"
                          onClick={() => updatePerfPrefs({ resolutionScale: sc })}
                          className={`py-1.5 rounded text-[11px] font-mono font-bold cursor-pointer ${
                            resolutionScale === sc
                              ? 'bg-sky-500 text-slate-950'
                              : 'bg-white/10 text-slate-300 hover:bg-white/20'
                          }`}
                        >
                          {sc}x
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <span className="text-[11px] text-slate-300">FPS Cap</span>
                      <button
                        type="button"
                        onClick={() => updatePerfPrefs({ targetFps: targetFps === 30 ? 60 : 30 })}
                        className={`px-2 py-1 rounded text-[11px] font-mono font-bold cursor-pointer ${
                          targetFps === 30 ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-500 text-slate-950'
                        }`}
                      >
                        {targetFps} FPS
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Camera Preset Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsCameraMenuOpen((v) => !v);
                    setIsPerfMenuOpen(false);
                  }}
                  className="flex items-center gap-1 min-h-[36px] px-2.5 py-1.5 rounded-md bg-white/5 border border-white/15 hover:border-sky-400/60 text-xs font-bold text-slate-200 cursor-pointer whitespace-nowrap"
                  title={isEn ? 'Camera Angles' : 'Chọn góc máy'}
                >
                  <Camera className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">
                    {isEn ? CAMERA_PRESETS[cameraPreset].labelEn : CAMERA_PRESETS[cameraPreset].labelVi}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {isCameraMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 z-50 w-48 max-w-[calc(100vw-24px)] rounded-lg bg-slate-950/98 border border-white/20 p-1.5 shadow-2xl space-y-0.5">
                    {(Object.keys(CAMERA_PRESETS) as CameraPresetId[]).map((pid) => (
                      <button
                        key={pid}
                        type="button"
                        onClick={() => {
                          applyCameraPreset(pid);
                          setIsCameraMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-semibold text-left cursor-pointer ${
                          cameraPreset === pid
                            ? 'bg-sky-500 text-slate-950 font-bold'
                            : 'text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <Camera className="w-3 h-3 shrink-0" />
                        <span>{isEn ? CAMERA_PRESETS[pid].labelEn : CAMERA_PRESETS[pid].labelVi}</span>
                      </button>
                    ))}
                    <div className="pt-1 mt-1 border-t border-white/15 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          saveCameraBookmark();
                          setIsCameraMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-semibold text-left text-emerald-300 hover:bg-emerald-500/15 cursor-pointer"
                      >
                        <Bookmark className="w-3 h-3 shrink-0" />
                        <span>{isEn ? 'Save View' : 'Lưu Góc nhìn'}</span>
                      </button>
                      {cameraBookmark && (
                        <button
                          type="button"
                          onClick={() => {
                            recallCameraBookmark();
                            setIsCameraMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-bold text-left bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 cursor-pointer"
                        >
                          <Camera className="w-3 h-3 shrink-0" />
                          <span>{isEn ? 'Recall Saved View' : 'Mở Góc đã Lưu'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Integrated 3D Voice Mentor right inside top bar */}
              <SpatialVoiceMentor
                compactButton
                spaceName="Synapse Pre · Đại công trình tương lai"
                modelTitle={isEn ? activeDef.titleEn : activeDef.titleVi}
                partName={activeDef.code}
                partDescription={isEn ? activeDef.descriptionEn : activeDef.descriptionVi}
                formula={`${isEn ? activeDef.primaryLabelEn : activeDef.primaryLabelVi}: ${primaryParam} ${activeDef.primaryUnit}`}
                language={language}
                onWonderCommand={handleWonderVoiceCommand}
              />

              <button
                type="button"
                onClick={openRemoteModal}
                className={`flex items-center gap-1 min-h-[36px] px-2.5 py-1.5 rounded-md border text-xs font-bold cursor-pointer whitespace-nowrap ${
                  controllerCount > 0
                    ? 'bg-emerald-500/20 border-emerald-400/70 text-emerald-200'
                    : 'bg-white/5 border-white/15 hover:border-sky-400/60 text-sky-300'
                }`}
                title={
                  isEn
                    ? 'Scan QR to use Phone as 3D Controller'
                    : 'Quét QR dùng Điện thoại xoay 3D & Thuyết trình từ xa'
                }
              >
                <QrCode className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline">{isEn ? 'QR Remote' : 'QR 3D'}</span>
                {controllerCount > 0 && (
                  <span className="px-1 rounded-[3px] bg-emerald-500 text-slate-950 text-[10px] font-mono font-extrabold tabular-nums">
                    {controllerCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMeasureMode((v) => !v);
                  if (measureMode) setMeasurePoints([]);
                }}
                className={`flex items-center gap-1 min-h-[36px] px-2.5 py-1.5 rounded-md border text-xs font-bold cursor-pointer whitespace-nowrap ${
                  measureMode
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                    : 'bg-white/5 border-white/15 hover:border-sky-400/60 text-slate-200'
                }`}
                title={isEn ? '3D Spatial Laser Ruler (click 2 points)' : 'Thước đo Laser 3D (chạm 2 điểm trên mô hình)'}
              >
                <Ruler className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden lg:inline">{isEn ? '3D Ruler' : 'Đo 3D'}</span>
              </button>

              <RecordVideoButton
                isRecording={isRecording3D}
                recordSeconds={recordSeconds3D}
                onToggle={toggleRecording3D}
                supported={videoRecSupported}
                isEn={isEn}
              />

              <button
                type="button"
                onClick={handleCaptureSnapshot}
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md bg-white/5 border border-white/15 hover:border-sky-400/60 text-slate-200 cursor-pointer"
                title={isEn ? 'Save 3D Snapshot PNG' : 'Chụp ảnh PNG'}
              >
                <Download className="w-3.5 h-3.5 text-sky-300" />
              </button>

              <button
                type="button"
                onClick={() => setAutoTourEnabled((v) => !v)}
                className={`flex items-center gap-1 min-h-[36px] px-2.5 py-1.5 rounded-md border text-xs font-bold cursor-pointer whitespace-nowrap ${
                  autoTourEnabled
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                    : 'bg-white/5 border-white/15 hover:border-sky-400/60 text-slate-200'
                }`}
                title={isEn ? 'Guided Camera Auto-Tour' : 'Bay Camera Tự Động qua 6 Góc Máy'}
              >
                <Compass className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden lg:inline">{isEn ? 'Auto Tour' : 'Bay Tour'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowOutliner((v) => !v)}
                className={`flex items-center gap-1 min-h-[36px] px-2.5 py-1.5 rounded-md border text-xs font-bold cursor-pointer whitespace-nowrap ${
                  showOutliner
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                    : 'bg-white/5 border-white/15 hover:border-sky-400/60 text-slate-200'
                }`}
                title={isEn ? 'Sub-Assembly Outliner Tree' : 'Cây Cụm Chi Tiết 3D'}
              >
                <Layers className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden lg:inline">{isEn ? 'Parts' : 'Cấu Kiện'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDockOpen((v) => !v)}
                className="flex items-center gap-1 min-h-[36px] px-2.5 py-1.5 rounded-md bg-white/5 border border-white/15 hover:border-sky-400/60 text-xs font-bold text-slate-200 cursor-pointer whitespace-nowrap"
                title={isEn ? 'Toggle Control Console (H)' : 'Bảng điều khiển thông số (Phím H)'}
              >
                {isDockOpen ? (
                  <EyeOff className="w-3.5 h-3.5 text-sky-400" />
                ) : (
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                )}
                <span className="hidden sm:inline">
                  {isDockOpen ? (isEn ? 'Hide' : 'Ẩn') : (isEn ? 'Controls' : 'Thông số')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen((v) => !v)}
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md bg-white/5 border border-white/15 hover:border-sky-400/60 text-slate-200 cursor-pointer"
                title={isEn ? 'Toggle Fullscreen' : 'Toàn màn hình'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {measureMode && (
            <div className="pointer-events-auto self-start flex flex-wrap items-center gap-2.5 rounded-lg bg-slate-950/95 border border-emerald-400/60 px-3 py-1.5 text-xs font-mono shadow-lg">
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300">
                <Ruler className="w-3.5 h-3.5" />
                {measurePoints.length === 0
                  ? isEn
                    ? 'Click 1st point on 3D model'
                    : 'Chạm điểm thứ 1 trên mô hình 3D'
                  : measurePoints.length === 1
                  ? isEn
                    ? 'Click 2nd point on 3D model'
                    : 'Chạm điểm thứ 2 để đo khoảng cách'
                  : (() => {
                      const [a, b] = measurePoints;
                      const dx = b.x - a.x;
                      const dy = b.y - a.y;
                      const dz = b.z - a.z;
                      const dist = Math.hypot(dx, dy, dz);
                      const elev = (Math.atan2(dy, Math.hypot(dx, dz)) * 180) / Math.PI;
                      return `d = ${dist.toFixed(2)} m · Δx=${dx.toFixed(2)} · Δy=${dy.toFixed(2)} · Δz=${dz.toFixed(2)} · α=${elev.toFixed(1)}°`;
                    })()}
              </span>
              {measurePoints.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMeasurePoints([])}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-bold text-slate-200 cursor-pointer"
                >
                  {isEn ? 'Clear' : 'Đo lại'}
                </button>
              )}
            </div>
          )}

          {/* Toggleable Quick Strip of All 30 Futuristic Chambers (hidden by default to keep 3D viewport unobstructed) */}
          {isWonderStripOpen && (
            <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-slate-950/85 border border-white/10 rounded-lg p-1.5">
              {MONUMENT_CATALOG.map((m) => {
                const selected = m.id === activeId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    data-ripple="true"
                    onClick={() => handleSelectMonument(m.id, false)}
                    className={`group flex items-center gap-2 px-2.5 py-1 rounded-md border text-left transition-all shrink-0 cursor-pointer ${
                      selected
                        ? 'bg-sky-950/95 border-sky-400 text-white shadow-md'
                        : 'bg-slate-900/80 border-white/12 text-slate-300 hover:border-white/35 hover:text-white'
                    }`}
                  >
                    {renderMonumentIcon(m.id, 'w-3.5 h-3.5 shrink-0')}
                    <div className="leading-tight">
                      <div className="text-[9px] font-mono text-sky-300/90 font-bold">
                        #{String(m.index).padStart(2, '0')}
                      </div>
                      <div className="text-[11px] font-extrabold whitespace-nowrap">
                        {isEn ? m.titleEn.split('&')[0].trim() : m.titleVi.split('&')[0].trim()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      {/* Sub-Assembly Outliner Floating Drawer */}
      {showOutliner && outlinerNodes.length > 0 && (
        <div className="pointer-events-auto self-start w-72 max-h-64 overflow-y-auto rounded-xl bg-slate-950/95 border border-amber-400/50 p-2.5 space-y-1.5 shadow-2xl">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-300 pb-1 border-b border-white/10">
            <span>{isEn ? `Sub-Assemblies (${outlinerNodes.length})` : `Cây Cụm Chi Tiết (${outlinerNodes.length})`}</span>
            {isolatedNodeKey && (
              <button
                type="button"
                onClick={() => toggleIsolateOutlinerNode(isolatedNodeKey)}
                className="text-[10px] text-sky-300 underline cursor-pointer"
              >
                {isEn ? 'Show All' : 'Hiện tất cả'}
              </button>
            )}
          </div>
          {outlinerNodes.map((n) => (
            <div key={n.key} className="flex items-center justify-between gap-1.5 text-[11px] bg-white/[0.04] rounded-md px-2 py-1">
              <button
                type="button"
                onClick={() => toggleIsolateOutlinerNode(n.key)}
                className={`truncate text-left flex-1 cursor-pointer ${
                  isolatedNodeKey === n.key ? 'text-cyan-300 font-bold' : 'text-slate-200 hover:text-white'
                }`}
              >
                {n.label}
              </button>
              <button
                type="button"
                onClick={() => toggleOutlinerVisibility(n.key)}
                className="p-1 rounded hover:bg-white/10 text-slate-300 cursor-pointer shrink-0"
                title={n.visible ? (isEn ? 'Hide part' : 'Ẩn cụm') : (isEn ? 'Show part' : 'Hiện cụm')}
              >
                {n.visible ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3D Observatory Canvas (Dedicated unobstructed stage on < lg, full-bleed on lg+) */}
      <div
        className={
          isFullscreen
            ? 'relative flex-1 min-h-[260px] w-full'
            : 'relative w-full h-[300px] sm:h-[390px] lg:absolute lg:inset-0 lg:h-full'
        }
      >
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />

        {(webglError || contextLost) && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/95 p-6 text-center">
            <div className="max-w-md space-y-3 rounded-xl border border-sky-500/40 bg-slate-900 p-6">
              <Orbit className="w-10 h-10 text-sky-400 mx-auto" />
              <h3 className="font-display text-lg font-bold text-white">
                {isEn ? 'Reconnecting WebGL Observatory...' : 'Đang khôi phục Không gian 3D WebGL...'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isEn
                  ? 'Your graphics context paused momentarily. Return to the gallery or switch chambers to resume.'
                  : 'Bộ tăng tốc đồ họa tạm ngắt kết nối. Quay lại danh sách hoặc đổi công trình để tiếp tục.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* COLLAPSIBLE BOTTOM CONTROL & SCIENTIFIC TELEMETRY DOCK */}
      <div className="relative lg:absolute lg:inset-x-0 lg:bottom-0 z-20 p-2.5 sm:p-3.5 lg:p-4 lg:pointer-events-none flex flex-col items-center bg-slate-950/95 lg:bg-transparent border-t border-white/10 lg:border-t-0 shrink-0">
        {!isDockOpen ? (
          <button
            type="button"
            onClick={() => setIsDockOpen(true)}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-950/95 border border-sky-400/50 text-xs font-bold text-sky-200 hover:bg-sky-950 shadow-lg cursor-pointer"
          >
            <ChevronUp className="w-4 h-4 text-sky-400" />
            <span>
              {isEn ? 'Expand Engineering Console (H)' : 'Mở Bảng Điều Khiển Đại Công Trình (H)'}
            </span>
          </button>
        ) : (
          <div className="pointer-events-auto w-full max-w-6xl rounded-xl bg-slate-950/94 border border-white/15 shadow-2xl p-3.5 sm:p-5 space-y-3 sm:space-y-4 max-h-[42dvh] lg:max-h-none overflow-y-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isEn ? telemetry.statusEn : telemetry.statusVi}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">
                    {isEn
                      ? `Explored ${visitedWonders.length}/${MONUMENT_CATALOG.length} Chambers (+25 XP each)`
                      : `Đã thám hiểm ${visitedWonders.length}/${MONUMENT_CATALOG.length} Công trình`}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {isEn ? activeDef.descriptionEn : activeDef.descriptionVi}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                {/* Parameter Quick Presets */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.05] border border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setPrimaryParam(activeDef.primaryRange[0]);
                      setSecondaryParam(activeDef.secondaryRange[0]);
                    }}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-300 hover:bg-white/10 cursor-pointer"
                  >
                    Min
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPrimaryParam(activeDef.primaryRange[2]);
                      setSecondaryParam(activeDef.secondaryRange[2]);
                    }}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
                  >
                    {isEn ? 'Nominal' : 'Chuẩn'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPrimaryParam(activeDef.primaryRange[1]);
                      setSecondaryParam(activeDef.secondaryRange[1]);
                    }}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-amber-300 hover:bg-amber-500/20 cursor-pointer"
                  >
                    Max
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPaused((p) => !p)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer whitespace-nowrap"
                >
                  {isPaused ? (
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{isPaused ? (isEn ? 'Resume' : 'Tiếp tục') : isEn ? 'Pause' : 'Tạm dừng'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowTelemetryChart((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border whitespace-nowrap ${
                    showTelemetryChart
                      ? 'bg-emerald-500/25 border-emerald-400/60 text-emerald-200'
                      : 'bg-white/10 border-transparent text-slate-200 hover:bg-white/20'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{isEn ? 'Telemetry Graph' : 'Đồ thị Telemetry'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSweepPanel((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border whitespace-nowrap ${
                    showSweepPanel
                      ? 'bg-sky-500/25 border-sky-400/60 text-sky-200'
                      : 'bg-white/10 border-transparent text-slate-200 hover:bg-white/20'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-sky-300" />
                  <span>{isEn ? 'Param Sweep' : 'Quét Biến'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportMarkdownDossier}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{isEn ? 'Dossier .md' : 'Hồ Sơ .md'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAdvancedDockOpen((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border whitespace-nowrap ${
                    isAdvancedDockOpen
                      ? 'bg-indigo-500/25 border-indigo-400/60 text-indigo-200'
                      : 'bg-white/10 border-transparent text-slate-200 hover:bg-white/20'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Pro Controls' : 'Điều khiển Chi tiết'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetCurrentMonument}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 cursor-pointer whitespace-nowrap"
                  title={isEn ? 'Reset all (R)' : 'Đặt lại toàn bộ (Phím R)'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Reset' : 'Đặt lại'}</span>
                </button>

                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate(activeDef.relatedSubject)}
                    className="group flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <span>{isEn ? activeDef.relatedLabelEn : activeDef.relatedLabelVi}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsDockOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
                  title={isEn ? 'Collapse dock' : 'Thu gọn'}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Engineering Mission Bar + Telemetry Graph Toggleable */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/[0.03] border border-white/10 px-3 py-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Award
                  className={`w-4 h-4 shrink-0 ${
                    completedMissions.includes(activeId) ? 'text-emerald-400' : 'text-amber-300'
                  }`}
                />
                <span className="font-semibold text-slate-200 truncate">
                  {completedMissions.includes(activeId)
                    ? isEn
                      ? 'Engineering Mission Completed (+35 XP): Peak Output & Cutaway Verified'
                      : 'Hoàn thành Nhiệm vụ Kỹ sư (+35 XP): Đã kiểm thử tải cao & tách lớp 3D'
                    : isEn
                    ? 'Mission (+35 XP): Push Primary >= 72%, Secondary >= 62%, Explode >= 30%'
                    : 'Nhiệm vụ Kỹ sư (+35 XP): Đẩy Thông số 1 >= 72%, Thông số 2 >= 62% & Tách lớp >= 30%'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleExportTelemetryCsv}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 text-[11px] font-bold cursor-pointer shrink-0"
              >
                <Download className="w-3 h-3" />
                <span>{isEn ? 'Export CSV Report' : 'Xuất Báo cáo CSV'}</span>
              </button>
            </div>

            {showSweepPanel && (
              <div className="rounded-xl bg-slate-900/90 border border-sky-500/30 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-sky-300 font-bold">
                    {isEn ? `Sweep Curve: ${telemetry.metric1LabelEn} vs ${activeDef.primaryLabelEn}` : `Đồ thị Quét Biến: ${telemetry.metric1LabelVi} theo ${activeDef.primaryLabelVi}`}
                  </span>
                  <span className="text-slate-400 tabular-nums">
                    [{sweepCurveData.minP} .. {sweepCurveData.maxP} {activeDef.primaryUnit}]
                  </span>
                </div>
                <svg viewBox="0 0 600 96" className="w-full h-24 rounded-lg bg-slate-950">
                  {(() => {
                    const { pts, minY, maxY, minP, maxP } = sweepCurveData;
                    const spanY = maxY - minY || 1;
                    const toX = (x: number) => 20 + ((x - minP) / (maxP - minP || 1)) * 560;
                    const toY = (y: number) => 80 - ((y - minY) / spanY) * 60;
                    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.x).toFixed(1)} ${toY(p.y).toFixed(1)}`).join(' ');
                    const curX = toX(primaryParam);
                    return (
                      <>
                        <line x1="20" y1="80" x2="580" y2="80" stroke="#334155" strokeWidth="1" />
                        <path d={d} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinejoin="round" />
                        <line x1={curX} y1="12" x2={curX} y2="80" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                      </>
                    );
                  })()}
                </svg>
              </div>
            )}

            {showTelemetryChart && (
              <MiniTelemetryChart
                title={isEn ? `${activeDef.code} · Live Telemetry Oscilloscope` : `${activeDef.code} · Dao động ký Telemetry Thời gian thực`}
                darkSurface={true}
                onExportCsv={handleExportTelemetryCsv}
                exportLabel="CSV"
                series={[
                  {
                    id: 'm1',
                    label: isEn ? telemetry.metric1LabelEn : telemetry.metric1LabelVi,
                    color: '#38bdf8',
                    values: telemetryHistory.map((p) => p.m1)
                  },
                  {
                    id: 'm2',
                    label: isEn ? telemetry.metric2LabelEn : telemetry.metric2LabelVi,
                    color: '#fbbf24',
                    values: telemetryHistory.map((p) => p.m2)
                  },
                  {
                    id: 'm3',
                    label: isEn ? telemetry.metric3LabelEn : telemetry.metric3LabelVi,
                    color: '#34d399',
                    values: telemetryHistory.map((p) => p.m3)
                  }
                ]}
              />
            )}

            {/* Primary Simulation Sliders & Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1.5 bg-white/[0.04] border border-white/10 rounded-2xl p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300 truncate flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-cyan-400 shrink-0" />
                      {isEn ? activeDef.primaryLabelEn : activeDef.primaryLabelVi}
                    </span>
                    <span className="font-mono font-extrabold text-cyan-300 tabular-nums shrink-0">
                      {primaryDisplay} {activeDef.primaryUnit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={activeDef.primaryRange[0]}
                    max={activeDef.primaryRange[1]}
                    step={1}
                    value={primaryParam}
                    onChange={(e) => setPrimaryParam(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 bg-white/[0.04] border border-white/10 rounded-2xl p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300 truncate">
                      {isEn ? activeDef.secondaryLabelEn : activeDef.secondaryLabelVi}
                    </span>
                    <span className="font-mono font-extrabold text-amber-300 tabular-nums shrink-0">
                      {Math.round(secondaryParam)} {activeDef.secondaryUnit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={activeDef.secondaryRange[0]}
                    max={activeDef.secondaryRange[1]}
                    step={1}
                    value={secondaryParam}
                    onChange={(e) => setSecondaryParam(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 bg-white/[0.04] border border-white/10 rounded-2xl p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300 truncate">
                      {isEn ? 'Exploded Cutaway' : 'Tách lớp 3D'}
                    </span>
                    <span className="font-mono font-extrabold text-purple-300 tabular-nums shrink-0">
                      {Math.round(explodeFactor * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round(explodeFactor * 100)}
                    onChange={(e) => setExplodeFactor(Number(e.target.value) / 100)}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="md:col-span-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-3 py-2.5">
                  <div className="text-[10px] text-slate-400 truncate">
                    {isEn ? telemetry.metric1LabelEn : telemetry.metric1LabelVi}
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-extrabold text-cyan-300 tabular-nums mt-0.5 truncate">
                    {telemetry.metric1Value}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-3 py-2.5">
                  <div className="text-[10px] text-slate-400 truncate">
                    {isEn ? telemetry.metric2LabelEn : telemetry.metric2LabelVi}
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-extrabold text-amber-300 tabular-nums mt-0.5 truncate">
                    {telemetry.metric2Value}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-3 py-2.5">
                  <div className="text-[10px] text-slate-400 truncate">
                    {isEn ? telemetry.metric3LabelEn : telemetry.metric3LabelVi}
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-extrabold text-emerald-300 tabular-nums mt-0.5 truncate">
                    {telemetry.metric3Value}
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive Monument Engineering Row (Speed, Orbit, FOV, Render Style, Mood, Cross-Section Slice, Platform) */}
            {isAdvancedDockOpen && (
              <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 items-center">
                {/* Time Scale */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-300">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Gauge className="w-3 h-3 text-emerald-400" />
                      {isEn ? 'Sim Speed' : 'Tốc độ mô phỏng'}
                    </span>
                    <span className="font-mono font-bold text-emerald-300 tabular-nums">
                      {timeScale.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={3.0}
                    step={0.1}
                    value={timeScale}
                    onChange={(e) => setTimeScale(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                {/* Auto-Orbit Toggle & Speed */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-300">
                    <button
                      type="button"
                      onClick={() => setAutoOrbitEnabled((v) => !v)}
                      className={`font-bold cursor-pointer ${
                        autoOrbitEnabled ? 'text-cyan-300' : 'text-slate-400'
                      }`}
                    >
                      {autoOrbitEnabled ? (isEn ? 'Orbit: ON' : 'Tự xoay: BẬT') : isEn ? 'Orbit: OFF' : 'Tự xoay: TẮT'}
                    </button>
                    <span className="font-mono text-cyan-300 tabular-nums">{orbitSpeed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={3.0}
                    step={0.1}
                    value={orbitSpeed}
                    onChange={(e) => {
                      setOrbitSpeed(Number(e.target.value));
                      if (!autoOrbitEnabled) setAutoOrbitEnabled(true);
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Camera FOV */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-300">
                    <span className="font-semibold">{isEn ? 'Lens FOV' : 'Góc ống kính FOV'}</span>
                    <span className="font-mono font-bold text-sky-300 tabular-nums">{cameraFov}°</span>
                  </div>
                  <input
                    type="range"
                    min={28}
                    max={72}
                    step={1}
                    value={cameraFov}
                    onChange={(e) => setCameraFov(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                {/* Material / Inspection Shader */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2 space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400">
                    {isEn ? 'Inspection Shader' : 'Chế độ Kiểm tra 3D'}
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(
                      [
                        { id: 'pbr', label: 'PBR' },
                        { id: 'thermal', label: isEn ? 'Thermal' : 'Nhiệt' },
                        { id: 'stress', label: isEn ? 'Stress' : 'Ứng suất' },
                        { id: 'flux', label: isEn ? 'Flux' : 'Từ thông' },
                        { id: 'xray', label: 'X-Ray' },
                        { id: 'wireframe', label: isEn ? 'Wire' : 'Lưới' }
                      ] as const
                    ).map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setRenderStyle(st.id)}
                        className={`py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                          renderStyle === st.id
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-white/5 text-slate-300 hover:bg-white/15'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lighting Mood */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2 space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400">
                    {isEn ? 'Lighting Studio' : 'Ánh sáng Không gian'}
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(
                      [
                        { id: 'cosmic', label: isEn ? 'Space' : 'Vũ trụ' },
                        { id: 'studio', label: 'Lab' },
                        { id: 'solar', label: isEn ? 'Solar' : 'Vàng' }
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setLightingMood(m.id)}
                        className={`py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                          lightingMood === m.id
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-white/5 text-slate-300 hover:bg-white/15'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3-Axis Cross-Section Slice Plane & Citadel Floor */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <button
                      type="button"
                      onClick={() => setSliceEnabled((v) => !v)}
                      className={`inline-flex items-center gap-1 font-bold cursor-pointer ${
                        sliceEnabled ? 'text-rose-300' : 'text-slate-300'
                      }`}
                    >
                      <Scissors className="w-3 h-3" />
                      <span>
                        {sliceEnabled
                          ? `${sliceAxis.toUpperCase()}=${sliceHeight.toFixed(1)}m`
                          : isEn
                          ? 'Slice OFF'
                          : 'Mặt cắt TẮT'}
                      </span>
                    </button>
                    <div className="flex items-center gap-1">
                      {(['x', 'y', 'z'] as const).map((ax) => (
                        <button
                          key={ax}
                          type="button"
                          onClick={() => {
                            setSliceAxis(ax);
                            if (!sliceEnabled) setSliceEnabled(true);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase cursor-pointer ${
                            sliceAxis === ax && sliceEnabled
                              ? 'bg-rose-500 text-white'
                              : 'bg-white/10 text-slate-300 hover:bg-white/20'
                          }`}
                        >
                          {ax}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setSliceInvert((v) => !v);
                          if (!sliceEnabled) setSliceEnabled(true);
                        }}
                        className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[9px] font-mono text-slate-200 cursor-pointer"
                        title={isEn ? 'Flip slice direction' : 'Đảo chiều cắt'}
                      >
                        {sliceInvert ? '+' : '-'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPlatform((v) => !v)}
                        className={`inline-flex items-center gap-0.5 ml-1 font-bold cursor-pointer ${
                          showPlatform ? 'text-emerald-300' : 'text-slate-500'
                        }`}
                        title={isEn ? 'Toggle Citadel Floor' : 'Bật/Tắt Sàn Đài 3D'}
                      >
                        <Grid className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={-4.5}
                    max={6.5}
                    step={0.1}
                    value={sliceHeight}
                    onChange={(e) => {
                      setSliceHeight(Number(e.target.value));
                      if (!sliceEnabled) setSliceEnabled(true);
                    }}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                </div>

                {/* Weak-PC Resolution & FPS Cap */}
                <div className="sm:col-span-2 lg:col-span-6 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="font-semibold text-sky-300">
                    {isEn ? '3D Performance · Resolution & FPS Cap:' : 'Tối ưu Máy yếu · Độ phân giải & Khóa FPS:'}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {([0.5, 0.65, 0.85, 1.0, 1.35] as const).map((sc) => (
                      <button
                        key={sc}
                        type="button"
                        onClick={() => updatePerfPrefs({ resolutionScale: sc })}
                        className={`px-2 py-1 rounded-md font-mono font-bold cursor-pointer border ${
                          resolutionScale === sc
                            ? 'bg-sky-500 text-slate-950 border-sky-300'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15'
                        }`}
                      >
                        {sc}x
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => updatePerfPrefs({ targetFps: 30 })}
                      className={`px-2.5 py-1 rounded-md font-mono font-bold cursor-pointer border ${
                        targetFps === 30
                          ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15'
                      }`}
                    >
                      {isEn ? '30 FPS (Weak PC)' : '30 FPS (Máy yếu)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePerfPrefs({ targetFps: 60 })}
                      className={`px-2.5 py-1 rounded-md font-mono font-bold cursor-pointer border ${
                        targetFps === 60
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15'
                      }`}
                    >
                      60 FPS
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};
