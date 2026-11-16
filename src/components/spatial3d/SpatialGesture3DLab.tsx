import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ArrowLeft,
  BookOpen,
  Box,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Compass,
  Eraser,
  Eye,
  EyeOff,
  FileDown,
  FlipHorizontal,
  Grid,
  Hand,
  Info,
  Layers,
  Lock,
  Maximize2,
  Minimize2,
  Minus,
  Move,
  Orbit,
  Pause,
  PenTool,
  Play,
  Plus,
  RotateCcw,
  Scissors,
  Settings2,
  Sliders,
  Sparkles,
  Square,
  Star,
  Triangle,
  Undo2,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Wand2
} from 'lucide-react';
import { SubjectType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import {
  ACTION_2D_OPTIONS,
  ACTION_3D_OPTIONS,
  DEFAULT_GESTURE_SETTINGS,
  GESTURE_DEFINITIONS,
  GESTURE_PRESETS,
  GestureAction2D,
  GestureAction3D,
  GestureSettings,
  HandControlMode,
  HandGestureId,
  HandGestureTracker,
  HandTrackingFrame,
  PointerSource
} from './handGestureTracker';
import {
  Free2DToolId,
  SPATIAL_2D_MODES,
  Spatial2DGestureCanvas,
  Spatial2DHandle,
  Spatial2DModeId
} from './Spatial2DGestureCanvas';
import {
  buildAdvancedModel,
  DynamicModelRef,
  ExplodablePart,
  ExplodablePartInfo,
  updateAdvancedKinematics
} from './advancedModels3D';
import { SpatialSenseHub } from './SpatialSenseHub';
import { Spatial3DGuideModal } from './Spatial3DGuideModal';

export type SpatialModeId =
  | 'turbofan'
  | 'solar_system'
  | 'robot_arm'
  | 'supercar_aero'
  | 'wind_turbine'
  | 'cable_bridge'
  | 'pyramid'
  | 'prism'
  | 'cone_conic'
  | 'platonic'
  | 'sphere_slice'
  | 'freehand_oxyz'
  | 'wave_surface'
  | 'quantum_atom'
  | 'dna_helix';

export type MaterialFinishId = 'ceramic' | 'crystal' | 'wireframe' | 'gold';
export type CreativeBrushId = 'tube' | 'cube' | 'sphere' | 'pyramid' | 'torus';
type SpaceMode = '3d' | '2d';
type DockTabId = 'gesture' | 'shapes' | 'params' | 'style' | 'settings';

const GESTURE_SETTINGS_STORAGE_KEY = 'synapse_spatial_gesture_settings_v3';

function loadGestureSettings(): GestureSettings {
  try {
    const raw = localStorage.getItem(GESTURE_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_GESTURE_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<GestureSettings>;
    return {
      ...DEFAULT_GESTURE_SETTINGS,
      ...parsed,
      rotationSensitivity: parsed.rotationSensitivity ?? DEFAULT_GESTURE_SETTINGS.rotationSensitivity,
      gestureHoldMs: parsed.gestureHoldMs ?? DEFAULT_GESTURE_SETTINGS.gestureHoldMs,
      gestureActions3D: {
        ...DEFAULT_GESTURE_SETTINGS.gestureActions3D,
        ...(parsed.gestureActions3D || {})
      },
      gestureActions2D: {
        ...DEFAULT_GESTURE_SETTINGS.gestureActions2D,
        ...(parsed.gestureActions2D || {})
      }
    };
  } catch {
    return DEFAULT_GESTURE_SETTINGS;
  }
}

interface SpatialModeMeta {
  id: SpatialModeId;
  group: 'realistic' | 'geometry' | 'simulation';
  titleVi: string;
  titleEn: string;
  formula: string;
  descVi: string;
  descEn: string;
  badge: string;
}

const SPATIAL_MODES: SpatialModeMeta[] = [
  // 6 Advanced Realistic 3D Creations
  {
    id: 'turbofan',
    group: 'realistic',
    titleVi: 'Động cơ Phản lực Tuabin',
    titleEn: 'Jet Turbofan Engine',
    formula: 'F = ṁ·(V_out - V_in) · P = τ·ω',
    descVi: 'Chụm ngón tăng RPM & luồng nhiệt đốt cháy, 3 ngón tách vỏ nacelle xem 16 lá cánh quạt & lõi nén.',
    descEn: 'Pinch to throttle turbine RPM & exhaust glow; 3 fingers explode nacelle cowling.',
    badge: 'HÀNG KHÔNG'
  },
  {
    id: 'robot_arm',
    group: 'realistic',
    titleVi: 'Cánh tay Robot 6 Bậc (IK Tay)',
    titleEn: '6-DOF Robotic Arm (Live Hand IK)',
    formula: 'T₀⁶ = A₁(θ₁)·A₂(θ₂)·A₃(θ₃)...',
    descVi: 'Giơ 1 ngón để cánh tay Robot xoay khớp vai-khuỷu bám theo tay thật; Chụm ngón để đóng kẹp gắp!',
    descEn: 'Point 1 finger and the articulated robotic arm tracks your hand in 3D; pinch to close gripper!',
    badge: 'ROBOTICS'
  },
  {
    id: 'supercar_aero',
    group: 'realistic',
    titleVi: 'Siêu xe Đường hầm Khí động',
    titleEn: 'Aerodynamic Supercar Wind Tunnel',
    formula: 'F_L = ½·ρ·v²·S·C_L · Re = ρvL/μ',
    descVi: '16 luồng khí động lướt qua thân xe thật, chụm ngón tăng tốc gió & bánh xe, 3 ngón nâng nắp vỏ kính.',
    descEn: 'Animated wind-tunnel streamlines over sculpted chassis; pinch for airspeed, 3 fingers lift canopy.',
    badge: 'KHÍ ĐỘNG'
  },
  {
    id: 'solar_system',
    group: 'realistic',
    titleVi: 'Hệ Mặt Trời & Hành Tinh 3D',
    titleEn: 'Interactive Solar System Orrery',
    formula: 'T² = (4π²/GM)·a³ (Kepler III)',
    descVi: '6 hành tinh + Mặt Trăng + Vành đai Sao Thổ quay quanh Mặt Trời; 3 ngón nâng tách tầng quỹ đạo.',
    descEn: '6 orbiting planets with Moon & Saturn rings; 3 fingers separate orbital planes vertically.',
    badge: 'THIÊN VĂN'
  },
  {
    id: 'wind_turbine',
    group: 'realistic',
    titleVi: 'Tuabin Gió Ngoài Khơi',
    titleEn: 'Offshore Wind Turbine Generator',
    formula: 'P = ½·ρ·A·v³·C_p (Betz Limit 59.3%)',
    descVi: 'Chụm ngón tăng sức gió làm quay rotor & phát sáng cuộn dây máy phát; 3 ngón mở vỏ hộp số.',
    descEn: 'Pinch to boost offshore wind velocity & generator glow; 3 fingers open nacelle gearbox cover.',
    badge: 'NĂNG LƯỢNG'
  },
  {
    id: 'cable_bridge',
    group: 'realistic',
    titleVi: 'Cầu Treo Dây Văng Mỹ Thuận',
    titleEn: 'Cable-Stayed Suspension Bridge',
    formula: 'T·sin(α) = w·x · M_uốn = F·L/4',
    descVi: 'Tháp cầu chữ A đôi kèm 24 dây văng căng đối xứng; 2 ngón cắt mặt cắt dầm cầu, 3 ngón tách kết cấu.',
    descEn: 'Twin diamond pylons with 24 stay cables; 2 fingers slice deck cross-section, 3 fingers explode.',
    badge: 'KỸ THUẬT'
  },
  // Core 3D Geometry, Creative Sculpt & Physics Simulations
  {
    id: 'freehand_oxyz',
    group: 'geometry',
    titleVi: 'Sáng tạo Kiến trúc & Vẽ Oxyz',
    titleEn: '3D Voxel & Neon Sculpt Oxyz',
    formula: 'r(t) = (x(t), y(t), z(t)) ∈ ℝ³',
    descVi: '1 ngón (hoặc 2 tay song song) vẽ dải ánh sáng Neon 3D; Chụm ngón đặt khối lập phương, cầu, chóp.',
    descEn: 'Point 1 finger (or dual hands) to sculpt 3D neon tubes; pinch to stamp architectural blocks.',
    badge: 'SÁNG TẠO 3D'
  },
  {
    id: 'pyramid',
    group: 'geometry',
    titleVi: 'Hình chóp Tứ giác Đều S.ABCD',
    titleEn: 'Regular Square Pyramid S.ABCD',
    formula: 'V = (1/3)·a²·h · Sxq = 4·(1/2)·a·d',
    descVi: 'Tách 4 mặt bên, quan sát đường cao SH & mặt phẳng thiết diện cắt ngang.',
    descEn: 'Explode 4 triangular faces, inspect altitude SH and dynamic horizontal slice.',
    badge: 'HH 11-12'
  },
  {
    id: 'prism',
    group: 'geometry',
    titleVi: 'Lăng trụ Lục giác Đều',
    titleEn: 'Regular Hexagonal Prism',
    formula: 'V = (3√3/2)·a²·h · Sxq = 6·a·h',
    descVi: '2 đáy lục giác đều, 6 mặt bên tách hướng tâm & trục đối xứng.',
    descEn: 'Dual regular hexagon bases with 6 radially explodable lateral walls.',
    badge: 'HH 11-12'
  },
  {
    id: 'cone_conic',
    group: 'geometry',
    titleVi: 'Hình nón & Thiết diện Conic',
    titleEn: 'Cone & Conic Cross-Sections',
    formula: 'V = (1/3)·π·r²·h · x²/a² ± y²/b² = 1',
    descVi: 'Cắt mặt nón tạo vòng Elip trực quan, thay đổi chiều cao & độ mở khối.',
    descEn: 'Slice a translucent cone to inspect conic section intersections in real time.',
    badge: 'TOÁN 10-12'
  },
  {
    id: 'platonic',
    group: 'geometry',
    titleVi: 'Ngũ khối Platon Lồng Nhau',
    titleEn: 'Nested Platonic Solids',
    formula: 'V - E + F = 2 (Euler Polyhedron)',
    descVi: '5 đa diện đều lồng nhau bung tách hướng tâm khi xòe 3–5 ngón.',
    descEn: 'Five nested Platonic polyhedra exploding radially.',
    badge: 'TOÁN HỌC'
  },
  {
    id: 'sphere_slice',
    group: 'geometry',
    titleVi: 'Mặt cầu (S) & Giao tuyến Tròn',
    titleEn: 'Sphere (S) & Intersection Circle',
    formula: '(x-a)² + (y-b)² + (z-c)² = R² · r = √(R² - d²)',
    descVi: 'Kéo mặt cắt bằng cử chỉ 2 ngón để xem bán kính giao tuyến r biến thiên.',
    descEn: 'Slide the 2-finger cross-section plane to watch intersection circle radius r respond.',
    badge: 'OXYZ 12'
  },
  {
    id: 'wave_surface',
    group: 'simulation',
    titleVi: 'Trường Sóng Giao thoa 3D',
    titleEn: '3D Wave Interference Field',
    formula: 'u(r,t) = A·[cos(kr₁ - ωt) + cos(kr₂ - ωt)]',
    descVi: 'Lưới mặt sóng 2 nguồn S₁, S₂ biến dạng thời gian thực theo biên độ tay.',
    descEn: 'Real-time 2-source interference vertex field modulated by hand height.',
    badge: 'VẬT LÍ 11-12'
  },
  {
    id: 'quantum_atom',
    group: 'simulation',
    titleVi: 'Nguyên tử Bohr & Lượng tử',
    titleEn: 'Bohr Atom & Quantum Orbits',
    formula: 'Eₙ = -13.6 / n² (eV) · L = nℏ',
    descVi: 'Hạt nhân đa cầu + 4 quỹ đạo electron nghiêng 3D chuyển động & tách lớp vỏ.',
    descEn: 'Multi-nucleon core with 4 inclined orbital rings and explodable shells.',
    badge: 'LƯỢNG TỬ'
  },
  {
    id: 'dna_helix',
    group: 'simulation',
    titleVi: 'Chuỗi Xoắn Kép DNA 3D',
    titleEn: 'Quantum DNA Double Helix',
    formula: 'r(t) = (R·cos ωt, h·t, R·sin ωt)',
    descVi: '2 mạch xoắn đối xứng + 15 cặp bazơ tách đôi mượt mà khi mở tay.',
    descEn: 'Dual helical backbones with 15 base pairs that split smoothly on explode.',
    badge: 'SINH · LÍ'
  }
];

interface AccentPalette {
  id: string;
  label: string;
  hex: number;
  css: string;
  secondaryHex: number;
}

const ACCENT_PALETTES: AccentPalette[] = [
  { id: 'cyan', label: 'Cyan', hex: 0x22d3ee, css: '#22d3ee', secondaryHex: 0x6366f1 },
  { id: 'indigo', label: 'Indigo', hex: 0x818cf8, css: '#818cf8', secondaryHex: 0x38bdf8 },
  { id: 'emerald', label: 'Emerald', hex: 0x34d399, css: '#34d399', secondaryHex: 0x06b6d4 },
  { id: 'amber', label: 'Amber', hex: 0xfbbf24, css: '#fbbf24', secondaryHex: 0xf97316 },
  { id: 'rose', label: 'Rose', hex: 0xf472b6, css: '#f472b6', secondaryHex: 0xa855f7 }
];

const FINISH_OPTIONS: { id: MaterialFinishId; labelVi: string; labelEn: string }[] = [
  { id: 'ceramic', labelVi: 'Ceramic PBR', labelEn: 'Ceramic PBR' },
  { id: 'crystal', labelVi: 'Pha lê Kính', labelEn: 'Crystal Glass' },
  { id: 'wireframe', labelVi: 'Lưới Neon', labelEn: 'Neon Wireframe' },
  { id: 'gold', labelVi: 'Kim loại Vàng', labelEn: 'Brushed Gold' }
];

const BRUSH_OPTIONS: { id: CreativeBrushId; labelVi: string; labelEn: string }[] = [
  { id: 'tube', labelVi: 'Ống Neon', labelEn: 'Neon Tube' },
  { id: 'cube', labelVi: 'Khối Vuông', labelEn: 'Voxel Cube' },
  { id: 'sphere', labelVi: 'Cầu Pha Lê', labelEn: 'Crystal Sphere' },
  { id: 'pyramid', labelVi: 'Chóp Kim Tự', labelEn: 'Pyramid Block' },
  { id: 'torus', labelVi: 'Vòng Năng Lượng', labelEn: 'Energy Torus' }
];

interface LabRuntime {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  rootGroup: THREE.Group;
  isolatedHolder: THREE.Group;
  isolatedPivot: THREE.Group;
  isolatedRestore: {
    partIndex: number;
    parent: THREE.Object3D;
    pos: THREE.Vector3;
    rot: THREE.Euler;
    scale: THREE.Vector3;
  } | null;
  highlightHelper: THREE.BoxHelper;
  axesGroup: THREE.Group;
  floorGroup: THREE.Group;
  slicePlane: THREE.Plane;
  sliceHelperMesh: THREE.Mesh;
  cursorMesh: THREE.Group;
  tipSensorMeshes: THREE.Mesh[];
  strokesGroup: THREE.Group;
  markersGroup: THREE.Group;
  model: DynamicModelRef | null;
  strokeMeshes: THREE.Mesh[];
  markerMeshes: THREE.Mesh[];
  activeStrokePoints: THREE.Vector3[];
  activeStrokePointsH2: THREE.Vector3[];
  activePreviewLine: THREE.Line | null;
  activePreviewLineH2: THREE.Line | null;
}

interface SpatialGesture3DLabProps {
  onBack?: () => void;
  onNavigate?: (subject: SubjectType) => void;
  onEarnXP?: (xp: number) => void;
}

const _v3TmpA = new THREE.Vector3();
const _v3TmpB = new THREE.Vector3();
const _eulerTmp = new THREE.Euler();
const _colorTmp = new THREE.Color();
const _box3Tmp = new THREE.Box3();
const _centerTmp = new THREE.Vector3();
const _sizeTmp = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _pointerNdc = new THREE.Vector2();

function isSoftwareWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

export const SpatialGesture3DLab: React.FC<SpatialGesture3DLabProps> = ({
  onBack,
  onEarnXP
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { bgSound, isBgPlaying, setBgSound, toggleBgPlaying } = useAudio();

  // Top-level Dual Entry View: Dedicated Spatial Hub vs Interactive Studio (3D / 2D)
  const [entryView, setEntryView] = useState<'hub' | 'studio'>('hub');
  const [show3DGuide, setShow3DGuide] = useState<boolean>(false);
  const [autoShow3DGuide, setAutoShow3DGuide] = useState<boolean>(true);
  const [spaceMode, setSpaceMode] = useState<SpaceMode>('3d');
  const [mode2D, setMode2D] = useState<Spatial2DModeId>('free_create');
  const [free2DTool, setFree2DTool] = useState<Free2DToolId>('freehand');
  const [free2DColor, setFree2DColor] = useState<string>('#22d3ee');
  const [free2DSnap, setFree2DSnap] = useState<boolean>(false);
  const [free2DAutoShape, setFree2DAutoShape] = useState<boolean>(false);
  const [free2DCount, setFree2DCount] = useState<number>(0);
  const [metrics2D, setMetrics2D] = useState<{ metricA: string; metricB: string; metricC: string }>({
    metricA: 'Tự do tạo hình 2D',
    metricB: '0 hình đã tạo',
    metricC: 'Kéo tay/chuột để vẽ'
  });

  const handleEnter3DSpace = useCallback(
    (forceGuide = false) => {
      setEntryView('studio');
      setSpaceMode('3d');
      if (forceGuide || autoShow3DGuide) {
        setShow3DGuide(true);
      }
    },
    [autoShow3DGuide]
  );

  const handleEnter2DSpace = useCallback(() => {
    setEntryView('studio');
    setSpaceMode('2d');
    setMode2D('free_create');
    setShow3DGuide(false);
  }, []);

  // Core 3D studio states
  const [modeId, setModeId] = useState<SpatialModeId>('turbofan');
  const [shapeFilter, setShapeFilter] = useState<'all' | 'realistic' | 'geometry' | 'simulation'>('all');
  const [finish, setFinish] = useState<MaterialFinishId>('ceramic');
  const [paletteId, setPaletteId] = useState<string>('cyan');
  const [creativeBrush, setCreativeBrush] = useState<CreativeBrushId>('tube');
  const [snapGrid, setSnapGrid] = useState<boolean>(false);
  const [scaleVal, setScaleVal] = useState<number>(1.0);
  const [heightVal, setHeightVal] = useState<number>(1.0);
  const [explodeVal, setExplodeVal] = useState<number>(0.0);
  const [sliceEnabled, setSliceEnabled] = useState<boolean>(false);
  const [sliceY, setSliceY] = useState<number>(2.4);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [autoSpin, setAutoSpin] = useState<boolean>(true);
  const [showAxes, setShowAxes] = useState<boolean>(true);
  const [frozen, setFrozen] = useState<boolean>(false);
  const [dockTab, setDockTab] = useState<DockTabId>('shapes');
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [hudHidden, setHudHidden] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [strokeCount, setStrokeCount] = useState<number>(0);
  const [markerCount, setMarkerCount] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 3D Part Selection & Isolation Inspection States
  const [modelParts, setModelParts] = useState<ExplodablePartInfo[]>([]);
  const [highlightedPartIdx, setHighlightedPartIdx] = useState<number | null>(null);
  const [isolatedPartIdx, setIsolatedPartIdx] = useState<number | null>(null);
  const [partCardMinimized, setPartCardMinimized] = useState<boolean>(false);
  const highlightedPartIdxRef = useRef<number | null>(null);
  const isolatedPartIdxRef = useRef<number | null>(null);
  const modelPartsRef = useRef<ExplodablePartInfo[]>([]);
  highlightedPartIdxRef.current = highlightedPartIdx;
  isolatedPartIdxRef.current = isolatedPartIdx;
  modelPartsRef.current = modelParts;

  // Camera & Hand Gesture Tracking states (persisted user settings)
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gestureSettings, setGestureSettings] = useState<GestureSettings>(() => loadGestureSettings());
  const [virtualGesture, setVirtualGesture] = useState<HandGestureId>('palm_5');
  const [showVirtualPad, setShowVirtualPad] = useState<boolean>(true);

  useEffect(() => {
    try {
      localStorage.setItem(GESTURE_SETTINGS_STORAGE_KEY, JSON.stringify(gestureSettings));
    } catch {}
  }, [gestureSettings]);

  const updateGestureSetting = useCallback(
    <K extends keyof GestureSettings>(key: K, val: GestureSettings[K]) => {
      setGestureSettings((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  const mirrorCamera = gestureSettings.mirrorCamera;
  const sensitivity = gestureSettings.pinchSensitivity;
  const smoothing = gestureSettings.smoothing;

  const initialFrame: HandTrackingFrame = {
    detected: false,
    ready: false,
    engine: 'initializing',
    handCount: 0,
    gesture: 'none',
    candidateGesture: 'none',
    gestureHoldProgress: 0,
    gestureSettled: false,
    fingerCount: 0,
    trackedTipCount: 0,
    cursorX: 0.5,
    cursorY: 0.5,
    cursorDX: 0,
    cursorDY: 0,
    hand1VelX: 0,
    hand1VelY: 0,
    pinchRatio: 0,
    hand1Pinching: false,
    hand2Pinching: false,
    hand1Index: null,
    hand2Index: null,
    handTiltAngle: 0,
    twoHandSpan: 0.45,
    twoHandSpanDelta: 0,
    twoHandOppositeSpread: false,
    twoHandMovingCloser: false,
    twoHandAngle: 0,
    swipeEvent: null,
    confidence: 0,
    tips: []
  };

  const [handFrame, setHandFrame] = useState<HandTrackingFrame>(initialFrame);
  const handFrameRef = useRef<HandTrackingFrame>(initialFrame);

  const [oxyzCursor, setOxyzCursor] = useState<{ x: number; y: number; z: number }>({
    x: 0,
    y: 1.5,
    z: 0
  });

  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const canvas2DRef = useRef<Spatial2DHandle | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackerRef = useRef<HandGestureTracker | null>(null);
  const runtimeRef = useRef<LabRuntime | null>(null);

  const paramsRef = useRef({
    entryView,
    spaceMode,
    modeId,
    finish,
    paletteId,
    creativeBrush,
    snapGrid,
    scaleVal,
    heightVal,
    explodeVal,
    sliceEnabled,
    sliceY,
    simSpeed,
    autoSpin,
    showAxes,
    frozen,
    cameraActive,
    mirrorCamera,
    sensitivity,
    smoothing,
    gestureSettings,
    virtualGesture
  });
  paramsRef.current = {
    entryView,
    spaceMode,
    modeId,
    finish,
    paletteId,
    creativeBrush,
    snapGrid,
    scaleVal,
    heightVal,
    explodeVal,
    sliceEnabled,
    sliceY,
    simSpeed,
    autoSpin,
    showAxes,
    frozen,
    cameraActive,
    mirrorCamera,
    sensitivity,
    smoothing,
    gestureSettings,
    virtualGesture
  };

  const smoothTargetRef = useRef({
    scale: 1.0,
    height: 1.0,
    explode: 0.0,
    sliceY: 2.4,
    rotOffset: 0,
    pitchOffset: 0,
    tiltOffset: 0,
    cursorX: 0,
    cursorY: 1.5,
    cursorZ: 0
  });
  const virtualPadDownRef = useRef<boolean>(false);
  const lastPinchStampAtRef = useRef<number>(0);
  const lastTwoFingerSelectAtRef = useRef<number>(0);
  const lastReassembleAtRef = useRef<number>(0);
  const prevGestureRef = useRef<HandGestureId>('none');
  const lastManualSwipeAtRef = useRef<number>(0);
  const pointerDownScreenRef = useRef<{ x: number; y: number } | null>(null);
  const awardFlagRef = useRef<boolean>(false);

  const activePalette = useMemo(
    () => ACCENT_PALETTES.find((p) => p.id === paletteId) || ACCENT_PALETTES[0],
    [paletteId]
  );
  const activeMode = useMemo(
    () => SPATIAL_MODES.find((m) => m.id === modeId) || SPATIAL_MODES[0],
    [modeId]
  );
  const active2DMode = useMemo(
    () => SPATIAL_2D_MODES.find((m) => m.id === mode2D) || SPATIAL_2D_MODES[0],
    [mode2D]
  );

  const filtered3DModes = useMemo(
    () =>
      shapeFilter === 'all'
        ? SPATIAL_MODES
        : SPATIAL_MODES.filter((m) => m.group === shapeFilter),
    [shapeFilter]
  );

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2400);
  }, []);

  // Computed live telemetry for active 2D or 3D mode
  const liveTelemetry = useMemo(() => {
    if (spaceMode === '2d') {
      return metrics2D;
    }

    const a = +(2.6 * scaleVal).toFixed(2);
    const h = +(3.0 * heightVal * scaleVal).toFixed(2);
    const r = +(1.65 * scaleVal).toFixed(2);
    switch (modeId) {
      case 'turbofan': {
        const rpm = Math.round((4200 + heightVal * 6800) * simSpeed);
        return {
          metricA: `${rpm.toLocaleString()} RPM`,
          metricB: `16 Cánh Quạt + 3 Tầng Nén`,
          metricC: `Tách vỏ: ${Math.round(explodeVal * 100)}%`
        };
      }
      case 'solar_system':
        return {
          metricA: `6 Hành tinh + Mặt Trăng`,
          metricB: `Tốc độ quỹ đạo ${simSpeed.toFixed(1)}x`,
          metricC: `Tách tầng: ${Math.round(explodeVal * 100)}%`
        };
      case 'robot_arm':
        return {
          metricA: `Mục tiêu (${oxyzCursor.x.toFixed(1)}, ${oxyzCursor.y.toFixed(1)}, ${oxyzCursor.z.toFixed(1)})`,
          metricB: `6 Bậc Tự Do (IK Bám Tay)`,
          metricC: `Kẹp: Chụm để gắp vật`
        };
      case 'supercar_aero': {
        const windKmh = Math.round((120 + heightVal * 140) * simSpeed);
        return {
          metricA: `Gió hầm: ${windKmh} km/h`,
          metricB: `16 Dòng Khí Động`,
          metricC: `Mở thân xe: ${Math.round(explodeVal * 100)}%`
        };
      }
      case 'wind_turbine': {
        const mw = +(2.5 * Math.pow(heightVal, 1.8) * simSpeed).toFixed(2);
        return {
          metricA: `Công suất: ${mw} MW`,
          metricB: `3 Cánh Airfoil 68m`,
          metricC: `Mở hộp số: ${Math.round(explodeVal * 100)}%`
        };
      }
      case 'cable_bridge':
        return {
          metricA: `2 Tháp Diamond · 24 Dây Văng`,
          metricB: `Nhịp cầu ${(120 * scaleVal).toFixed(0)}m`,
          metricC: `Mặt cắt: ${sliceEnabled ? `${sliceY.toFixed(2)}m` : 'Tắt'}`
        };
      case 'pyramid': {
        const vol = +((a * a * h) / 3).toFixed(2);
        const slant = Math.hypot(h, a * 0.5);
        const sTotal = +(a * a + 2 * a * slant).toFixed(2);
        return {
          metricA: `a = ${a}m · h = ${h}m`,
          metricB: `V = ${vol}m³`,
          metricC: `Stp = ${sTotal}m²`
        };
      }
      case 'prism': {
        const baseArea = ((3 * Math.sqrt(3)) / 2) * (r * r);
        const vol = +(baseArea * h).toFixed(2);
        return {
          metricA: `Rđáy = ${r}m · h = ${h}m`,
          metricB: `V = ${vol}m³`,
          metricC: `6 mặt bên lục giác`
        };
      }
      case 'cone_conic': {
        const vol = +((Math.PI * r * r * h) / 3).toFixed(2);
        const l = +Math.hypot(r, h).toFixed(2);
        return {
          metricA: `r = ${r}m · l = ${l}m`,
          metricB: `h = ${h}m`,
          metricC: `V = ${vol}m³ · Thiết diện Elip`
        };
      }
      case 'sphere_slice': {
        const R = +(2.1 * scaleVal).toFixed(2);
        const dCenter = Math.abs(sliceY - 2.1);
        const rCut =
          sliceEnabled && dCenter < R ? +Math.sqrt(Math.max(0, R * R - dCenter * dCenter)).toFixed(2) : R;
        const vol = +((4 / 3) * Math.PI * R * R * R).toFixed(2);
        return {
          metricA: `R = ${R}m · d = ${dCenter.toFixed(2)}m`,
          metricB: `r_giao = ${rCut}m`,
          metricC: `V = ${vol}m³`
        };
      }
      case 'platonic':
        return {
          metricA: `5 Khối Platon`,
          metricB: `Tách lớp ${Math.round(explodeVal * 100)}%`,
          metricC: `Euler: V - E + F = 2`
        };
      case 'freehand_oxyz':
        return {
          metricA: `O(${oxyzCursor.x.toFixed(1)}, ${oxyzCursor.y.toFixed(1)}, ${oxyzCursor.z.toFixed(1)})`,
          metricB: `${strokeCount} nét ống 3D`,
          metricC: `${markerCount} khối kiến tạo`
        };
      case 'wave_surface':
        return {
          metricA: `Biên độ A = ${(0.42 * heightVal).toFixed(2)}m`,
          metricB: `Tần số ${(1.8 * simSpeed).toFixed(1)} Hz`,
          metricC: `2 nguồn S₁(-1.6) · S₂(+1.6)`
        };
      case 'quantum_atom':
        return {
          metricA: `n = 4 mức quỹ đạo`,
          metricB: `Tách vỏ ${Math.round(explodeVal * 100)}%`,
          metricC: `E₁ = -13.6 eV`
        };
      case 'dna_helix':
        return {
          metricA: `15 cặp bazơ A-T / G-X`,
          metricB: `Bước xoắn ${(3.4 * heightVal).toFixed(1)} Å`,
          metricC: `Tách mạch ${Math.round(explodeVal * 100)}%`
        };
    }
  }, [
    spaceMode,
    metrics2D,
    modeId,
    scaleVal,
    heightVal,
    explodeVal,
    sliceEnabled,
    sliceY,
    simSpeed,
    oxyzCursor,
    strokeCount,
    markerCount
  ]);

  const buildMaterials = useCallback(
    (
      finishMode: MaterialFinishId,
      palette: AccentPalette,
      clipPlane: THREE.Plane,
      softwareGl: boolean
    ) => {
      const makeMat = (isSecondary: boolean, isHighlight = false) => {
        const col = isHighlight ? 0xffffff : isSecondary ? palette.secondaryHex : palette.hex;
        if (finishMode === 'wireframe') {
          return new THREE.MeshBasicMaterial({
            color: col,
            wireframe: true,
            transparent: true,
            opacity: 0.9,
            clippingPlanes: [clipPlane],
            clipShadows: true
          });
        }
        if (finishMode === 'crystal') {
          return new THREE.MeshPhysicalMaterial({
            color: col,
            metalness: 0.08,
            roughness: 0.08,
            transmission: softwareGl ? 0 : 0.72,
            transparent: true,
            opacity: softwareGl ? 0.55 : 0.92,
            ior: 1.52,
            thickness: 1.2,
            clearcoat: 1.0,
            side: THREE.DoubleSide,
            clippingPlanes: [clipPlane],
            clipShadows: true
          });
        }
        if (finishMode === 'gold') {
          return new THREE.MeshPhysicalMaterial({
            color: isSecondary ? 0xf59e0b : 0xfcd34d,
            metalness: 0.92,
            roughness: 0.22,
            clearcoat: 0.6,
            anisotropy: 0.7,
            side: THREE.DoubleSide,
            clippingPlanes: [clipPlane],
            clipShadows: true
          });
        }
        return new THREE.MeshStandardMaterial({
          color: col,
          metalness: isSecondary ? 0.45 : 0.22,
          roughness: isSecondary ? 0.28 : 0.52,
          emissive: col,
          emissiveIntensity: isHighlight ? 0.35 : 0.08,
          side: THREE.DoubleSide,
          clippingPlanes: [clipPlane],
          clipShadows: true
        });
      };

      const edgeMat = new THREE.LineBasicMaterial({
        color: palette.hex,
        transparent: true,
        opacity: 0.85,
        clippingPlanes: [clipPlane]
      });

      const accentGlowMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: palette.hex,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.3,
        clippingPlanes: [clipPlane]
      });

      return {
        primary: makeMat(false),
        secondary: makeMat(true),
        highlight: makeMat(false, true),
        edge: edgeMat,
        glow: accentGlowMat
      };
    },
    []
  );

  const restoreIsolatedPart = useCallback((rt: LabRuntime) => {
    const rest = rt.isolatedRestore;
    if (rest && rt.model && rt.model.explodables[rest.partIndex]) {
      const part = rt.model.explodables[rest.partIndex];
      rt.isolatedPivot.remove(part.mesh);
      rest.parent.add(part.mesh);
      part.mesh.position.copy(rest.pos);
      part.mesh.rotation.copy(rest.rot);
      part.mesh.scale.copy(rest.scale);
    }
    rt.isolatedRestore = null;
    rt.isolatedHolder.visible = false;
    rt.isolatedHolder.rotation.set(0, 0, 0);
    rt.isolatedHolder.scale.set(1, 1, 1);
    rt.isolatedPivot.scale.set(1, 1, 1);
    if (rt.model) {
      rt.model.group.visible = true;
    }
  }, []);

  const syncPartIsolation = useCallback(
    (rt: LabRuntime | null, idx: number | null) => {
      if (!rt) return;
      restoreIsolatedPart(rt);
      if (idx === null || !rt.model || !rt.model.explodables[idx]) {
        return;
      }

      const part = rt.model.explodables[idx];
      const originalParent = part.mesh.parent || rt.model.group;
      rt.isolatedRestore = {
        partIndex: idx,
        parent: originalParent,
        pos: part.mesh.position.clone(),
        rot: part.mesh.rotation.clone(),
        scale: part.mesh.scale.clone()
      };

      rt.model.group.visible = false;
      rt.highlightHelper.visible = false;

      rt.isolatedHolder.visible = true;
      rt.isolatedHolder.position.set(0, 1.85, 0);
      rt.isolatedHolder.rotation.set(0, 0, 0);
      rt.isolatedHolder.scale.set(1, 1, 1);
      rt.isolatedPivot.position.set(0, 0, 0);
      rt.isolatedPivot.rotation.set(0, 0, 0);
      rt.isolatedPivot.scale.set(1, 1, 1);

      originalParent.remove(part.mesh);
      rt.isolatedPivot.add(part.mesh);
      part.mesh.position.set(0, 0, 0);
      rt.isolatedHolder.updateMatrixWorld(true);

      _box3Tmp.setFromObject(part.mesh);
      if (!_box3Tmp.isEmpty()) {
        _box3Tmp.getCenter(_centerTmp);
        _box3Tmp.getSize(_sizeTmp);
        part.mesh.position.set(-_centerTmp.x, -(_centerTmp.y - 1.85), -_centerTmp.z);
        const maxDim = Math.max(_sizeTmp.x, _sizeTmp.y, _sizeTmp.z, 0.25);
        const fitScale = THREE.MathUtils.clamp(2.5 / maxDim, 0.65, 2.8);
        rt.isolatedPivot.scale.setScalar(fitScale);
      }

      smoothTargetRef.current.rotOffset = 0;
      smoothTargetRef.current.pitchOffset = 0;
      smoothTargetRef.current.scale = 1.0;
      setScaleVal(1.0);
    },
    [restoreIsolatedPart]
  );

  const disposeModel = useCallback((model: DynamicModelRef | null) => {
    if (!model) return;
    model.disposables.geometries.forEach((g) => g.dispose());
    model.disposables.materials.forEach((m) => m.dispose());
  }, []);

  const rebuildModel = useCallback(
    (
      runtime: LabRuntime,
      nextMode: SpatialModeId,
      nextFinish: MaterialFinishId,
      palette: AccentPalette,
      softwareGl: boolean
    ) => {
      restoreIsolatedPart(runtime);
      setIsolatedPartIdx(null);
      setHighlightedPartIdx(null);
      setExplodeVal(0.0);
      smoothTargetRef.current.explode = 0.0;

      if (runtime.model) {
        runtime.rootGroup.remove(runtime.model.group);
        disposeModel(runtime.model);
        runtime.model = null;
      }

      const mats = buildMaterials(nextFinish, palette, runtime.slicePlane, softwareGl);

      if (
        nextMode === 'turbofan' ||
        nextMode === 'solar_system' ||
        nextMode === 'robot_arm' ||
        nextMode === 'supercar_aero' ||
        nextMode === 'wind_turbine' ||
        nextMode === 'cable_bridge'
      ) {
        const built = buildAdvancedModel(
          nextMode,
          mats,
          palette.hex,
          palette.secondaryHex,
          runtime.slicePlane,
          softwareGl
        );
        built.materials.push(mats.primary, mats.secondary, mats.highlight, mats.edge, mats.glow);
        runtime.rootGroup.add(built.group);
        runtime.model = {
          group: built.group,
          explodables: built.explodables,
          turbofan: built.turbofan,
          solar: built.solar,
          robotArm: built.robotArm,
          supercar: built.supercar,
          windTurbine: built.windTurbine,
          disposables: { geometries: built.geometries, materials: built.materials }
        };
        setModelParts(built.explodables.map((p) => p.info));
        return;
      }

      const group = new THREE.Group();
      const explodables: ExplodablePart[] = [];
      const geometries: THREE.BufferGeometry[] = [];
      const materials: THREE.Material[] = [mats.primary, mats.secondary, mats.highlight, mats.edge, mats.glow];

      const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
        geometries.push(g);
        return g;
      };
      const trackMat = <T extends THREE.Material>(m: T): T => {
        materials.push(m);
        return m;
      };

      const addPart = (
        mesh: THREE.Object3D,
        explodeDir: THREE.Vector3,
        info: ExplodablePartInfo,
        addEdges = true
      ) => {
        mesh.castShadow = !softwareGl;
        mesh.receiveShadow = !softwareGl;
        group.add(mesh);
        explodables.push({
          mesh,
          basePos: mesh.position.clone(),
          explodeDir: explodeDir.clone(),
          info
        });
        if (addEdges && mesh instanceof THREE.Mesh) {
          const edges = new THREE.EdgesGeometry(mesh.geometry, 20);
          trackGeo(edges);
          mesh.add(new THREE.LineSegments(edges, mats.edge));
        }
      };

      let waveGeo: THREE.PlaneGeometry | undefined;
      let waveBaseZ: Float32Array | undefined;
      let atomElectrons: DynamicModelRef['atomElectrons'];
      let sphereCutRing: THREE.Mesh | undefined;

      if (nextMode === 'pyramid') {
        const baseW = 3.0;
        const baseGeo = trackGeo(new THREE.BoxGeometry(baseW, 0.14, baseW));
        const baseMesh = new THREE.Mesh(baseGeo, mats.secondary);
        baseMesh.position.set(0, 0.07, 0);
        addPart(baseMesh, new THREE.Vector3(0, -1.0, 0), {
          id: 'pyramid_base',
          nameVi: 'Đáy Hình Vuông ABCD',
          nameEn: 'Square Base ABCD',
          badgeVi: 'Mặt đáy',
          badgeEn: 'Base',
          introVi: 'Đa giác đáy hình vuông cạnh a = 3.0m nằm trên mặt phẳng chuẩn (Oxy).',
          introEn: 'Regular square base polygon of side a = 3.0m.',
          functionVi: 'Chịu lực nâng toàn khối chóp và xác định diện tích đáy B = a².',
          functionEn: 'Supports the pyramid faces and defines base area B = a².',
          specFormula: 'S_đáy = a² · Chu vi = 4a'
        });

        const h = 3.2;
        const half = baseW / 2;
        const corners = [
          new THREE.Vector3(-half, 0.14, half),
          new THREE.Vector3(half, 0.14, half),
          new THREE.Vector3(half, 0.14, -half),
          new THREE.Vector3(-half, 0.14, -half)
        ];
        const apex = new THREE.Vector3(0, h + 0.14, 0);
        const faceLabels = ['Mặt bên SAB', 'Mặt bên SBC', 'Mặt bên SCD', 'Mặt bên SDA'];

        for (let i = 0; i < 4; i++) {
          const a = corners[i];
          const b = corners[(i + 1) % 4];
          const faceGeo = trackGeo(new THREE.BufferGeometry());
          const verts = new Float32Array([a.x, a.y, a.z, b.x, b.y, b.z, apex.x, apex.y, apex.z]);
          faceGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
          faceGeo.computeVertexNormals();
          const faceMesh = new THREE.Mesh(faceGeo, mats.primary);
          const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
          addPart(faceMesh, new THREE.Vector3(mid.x, 0.65, mid.z).normalize().multiplyScalar(1.45), {
            id: `pyramid_face_${i + 1}`,
            nameVi: faceLabels[i],
            nameEn: `Lateral Face ${i + 1}`,
            badgeVi: `Mặt bên ${i + 1}/4`,
            badgeEn: `Face ${i + 1}/4`,
            introVi: 'Tam giác cân có cạnh đáy a và trung đoạn d = √(h² + (a/2)²).',
            introEn: 'Isosceles triangular lateral face meeting at apex S.',
            functionVi: '4 mặt bên bằng nhau hợp thành diện tích xung quanh Sxq = 2·a·d.',
            functionEn: 'Four congruent triangles forming total lateral surface S_lat = 2ad.',
            specFormula: 'S_mặt = ½ · a · d'
          });
        }

        const rodGeo = trackGeo(new THREE.CylinderGeometry(0.035, 0.035, h, 12));
        const rodMesh = new THREE.Mesh(rodGeo, mats.glow);
        rodMesh.position.set(0, 0.14 + h / 2, 0);
        addPart(
          rodMesh,
          new THREE.Vector3(0, 1.35, 0),
          {
            id: 'pyramid_altitude',
            nameVi: 'Đường Cao SH',
            nameEn: 'Altitude Axis SH',
            badgeVi: 'Trục cao',
            badgeEn: 'Altitude',
            introVi: 'Đoạn thẳng hạ vuông góc từ đỉnh S xuống tâm H của hình vuông ABCD.',
            introEn: 'Perpendicular height axis from apex S to base center H.',
            functionVi: 'Xác định chiều cao h để tính thể tích hình chóp V = ⅓·B·h.',
            functionEn: 'Defines pyramid height h for volume calculation V = ⅓·B·h.',
            specFormula: 'V = (1/3) · a² · h'
          },
          false
        );

        const apexGeo = trackGeo(new THREE.SphereGeometry(0.14, 20, 20));
        const apexOrb = new THREE.Mesh(apexGeo, mats.glow);
        apexOrb.position.copy(apex);
        addPart(
          apexOrb,
          new THREE.Vector3(0, 2.05, 0),
          {
            id: 'pyramid_apex',
            nameVi: 'Đỉnh Chóp S',
            nameEn: 'Pyramid Apex S',
            badgeVi: 'Đỉnh S',
            badgeEn: 'Apex S',
            introVi: 'Điểm hội tụ chung của 4 cạnh bên SA, SB, SC, SD trong không gian.',
            introEn: 'Convergence vertex of all four slant edges.',
            functionVi: 'Tâm đối xứng trục và điểm chuẩn định hướng góc nghiêng mặt bên.',
            functionEn: 'Anchor vertex determining lateral slant angles.',
            specFormula: 'SA = SB = SC = SD'
          },
          false
        );
      } else if (nextMode === 'prism') {
        const radius = 1.65;
        const h = 3.1;
        const baseGeo = trackGeo(new THREE.CylinderGeometry(radius, radius, 0.12, 6));
        const botBase = new THREE.Mesh(baseGeo, mats.secondary);
        botBase.position.set(0, 0.06, 0);
        addPart(botBase, new THREE.Vector3(0, -1.2, 0), {
          id: 'prism_bot',
          nameVi: 'Đáy Dưới Lục Giác Đều',
          nameEn: 'Bottom Hexagon Base',
          badgeVi: 'Đáy dưới',
          badgeEn: 'Bottom Base',
          introVi: 'Lục giác đều nội tiếp đường tròn bán kính R = 1.65m, gồm 6 tam giác đều.',
          introEn: 'Regular hexagon base composed of 6 equilateral triangles.',
          functionVi: 'Làm nền đáy và xác định diện tích đáy B = (3√3/2)·R².',
          functionEn: 'Defines base footprint and area B = (3√3/2)·R².',
          specFormula: 'B = (3√3 / 2) · a²'
        });

        const topBase = new THREE.Mesh(baseGeo, mats.secondary);
        topBase.position.set(0, h + 0.12, 0);
        addPart(topBase, new THREE.Vector3(0, 1.45, 0), {
          id: 'prism_top',
          nameVi: 'Đáy Trên Lục Giác Đều',
          nameEn: 'Top Hexagon Base',
          badgeVi: 'Đáy trên',
          badgeEn: 'Top Base',
          introVi: 'Mặt đáy song song và bằng với đáy dưới ở độ cao h = 3.1m.',
          introEn: 'Congruent parallel upper hexagonal cap at height h.',
          functionVi: 'Khép kín thể tích lăng trụ đứng và giữ khoảng cách song song chuẩn h.',
          functionEn: 'Seals the prism volume parallel to the bottom face.',
          specFormula: 'V = B · h'
        });

        const sideWidth = 2 * radius * Math.sin(Math.PI / 6);
        const apothem = radius * Math.cos(Math.PI / 6);
        const wallGeo = trackGeo(new THREE.BoxGeometry(sideWidth * 0.96, h, 0.08));

        for (let i = 0; i < 6; i++) {
          const theta = (i * Math.PI) / 3 + Math.PI / 6;
          const wall = new THREE.Mesh(wallGeo, mats.primary);
          wall.position.set(Math.cos(theta) * apothem, 0.12 + h / 2, Math.sin(theta) * apothem);
          wall.rotation.y = -theta + Math.PI / 2;
          addPart(wall, new THREE.Vector3(Math.cos(theta) * 1.45, 0, Math.sin(theta) * 1.45), {
            id: `prism_wall_${i + 1}`,
            nameVi: `Mặt Bên Hình Chữ Nhật #${i + 1}`,
            nameEn: `Lateral Face #${i + 1}`,
            badgeVi: `Mặt bên ${i + 1}/6`,
            badgeEn: `Side ${i + 1}/6`,
            introVi: 'Mặt bên hình chữ nhật vuông góc hai đáy với kích thước a × h.',
            introEn: 'Rectangular lateral wall perpendicular to both hexagon bases.',
            functionVi: 'Tạo thành bao xung quanh Sxq = 6·a·h và chịu lực dọc trục.',
            functionEn: 'Forms 1/6 of the lateral prism surface area.',
            specFormula: 'S_xq = 6 · a · h'
          });
        }
      } else if (nextMode === 'cone_conic') {
        const r = 1.75;
        const h = 3.4;
        const diskGeo = trackGeo(new THREE.CylinderGeometry(r, r, 0.1, 48));
        const disk = new THREE.Mesh(diskGeo, mats.secondary);
        disk.position.set(0, 0.05, 0);
        addPart(disk, new THREE.Vector3(0, -1.2, 0), {
          id: 'cone_base',
          nameVi: 'Mặt Đáy Hình Tròn (O, r)',
          nameEn: 'Circular Base Disk',
          badgeVi: 'Đáy tròn',
          badgeEn: 'Base Disk',
          introVi: 'Hình tròn tâm O bán kính r = 1.75m làm chuẩn dựng đường sinh hình nón.',
          introEn: 'Circular base of radius r = 1.75m.',
          functionVi: 'Xác định diện tích đáy S_đáy = πr² để tính thể tích hình nón.',
          functionEn: 'Defines circular footprint area S = πr².',
          specFormula: 'S_đáy = π · r²'
        });

        const outerConeGeo = trackGeo(new THREE.ConeGeometry(r, h, 48, 1, true));
        const outerConeMat = trackMat(
          new THREE.MeshPhysicalMaterial({
            color: palette.hex,
            roughness: 0.15,
            metalness: 0.1,
            transparent: true,
            opacity: 0.55,
            side: THREE.DoubleSide,
            clippingPlanes: [runtime.slicePlane],
            clipShadows: true
          })
        );
        const outerCone = new THREE.Mesh(outerConeGeo, outerConeMat);
        outerCone.position.set(0, 0.1 + h / 2, 0);
        addPart(
          outerCone,
          new THREE.Vector3(0, 1.25, 0),
          {
            id: 'cone_shell',
            nameVi: 'Mặt Xung Quanh Hình Nón',
            nameEn: 'Conical Lateral Shell',
            badgeVi: 'Mặt nón',
            badgeEn: 'Cone Shell',
            introVi: 'Mặt tròn xoay sinh bởi đường sinh l = √(r² + h²) quay quanh trục.',
            introEn: 'Conical revolution surface swept by slant line l.',
            functionVi: 'Cho phép mặt phẳng cắt nghiêng tạo ra Elip, Parabol và Hyperbol.',
            functionEn: 'Generates conic sections when intersected by planes.',
            specFormula: 'S_xq = π · r · l'
          },
          false
        );

        const conicPlaneGeo = trackGeo(new THREE.TorusGeometry(1.12, 0.045, 16, 64));
        const conicRing = new THREE.Mesh(conicPlaneGeo, mats.glow);
        conicRing.position.set(0, 1.55, 0);
        conicRing.rotation.set(Math.PI / 2 - 0.52, 0, 0.28);
        conicRing.scale.set(1.0, 1.32, 1.0);
        addPart(
          conicRing,
          new THREE.Vector3(1.5, 0.9, 0),
          {
            id: 'cone_ellipse',
            nameVi: 'Thiết Diện Đường Conic (Elip)',
            nameEn: 'Conic Ellipse Cross-Section',
            badgeVi: 'Thiết diện',
            badgeEn: 'Ellipse',
            introVi: 'Giao tuyến cong kín hình Elip tạo bởi mặt phẳng cắt nghiêng cắt mọi đường sinh.',
            introEn: 'Closed elliptical intersection curve from oblique slicing plane.',
            functionVi: 'Minh họa phương trình chính tắc x²/a² + y²/b² = 1 trong không gian 3D.',
            functionEn: 'Visualizes canonical ellipse x²/a² + y²/b² = 1 in 3D.',
            specFormula: 'x²/a² + y²/b² = 1'
          },
          false
        );
      } else if (nextMode === 'platonic') {
        const platonicSpecs: { geo: THREE.BufferGeometry; dir: THREE.Vector3; sec: boolean; info: ExplodablePartInfo }[] = [
          {
            geo: new THREE.TetrahedronGeometry(0.65),
            dir: new THREE.Vector3(0, 1.8, 0),
            sec: false,
            info: {
              id: 'platonic_tetra',
              nameVi: 'Tứ Diện Đều {3, 3}',
              nameEn: 'Regular Tetrahedron',
              badgeVi: '4 Mặt',
              badgeEn: '4 Faces',
              introVi: 'Đa diện đều đơn giản nhất gồm 4 mặt tam giác đều, 4 đỉnh, 6 cạnh.',
              introEn: 'Simplest Platonic solid with 4 equilateral triangle faces.',
              functionVi: 'Khối lõi trong cấu trúc lồng ghép Platon thỏa V - E + F = 2.',
              functionEn: 'Innermost core solid obeying Euler V - E + F = 2.',
              specFormula: 'V=4, E=6, F=4'
            }
          },
          {
            geo: new THREE.BoxGeometry(0.95, 0.95, 0.95),
            dir: new THREE.Vector3(-1.8, 0.5, 0.9),
            sec: true,
            info: {
              id: 'platonic_cube',
              nameVi: 'Hình Lập Phương {4, 3}',
              nameEn: 'Hexahedron (Cube)',
              badgeVi: '6 Mặt',
              badgeEn: '6 Faces',
              introVi: '6 mặt hình vuông bằng nhau, 8 đỉnh, 12 cạnh vuông góc trực giao.',
              introEn: 'Six square faces, 8 vertices, 12 orthogonal edges.',
              functionVi: 'Đối ngẫu hình học với khối Bát diện đều.',
              functionEn: 'Geometric dual of the regular octahedron.',
              specFormula: 'V=8, E=12, F=6'
            }
          },
          {
            geo: new THREE.OctahedronGeometry(1.18),
            dir: new THREE.Vector3(1.8, 0.5, 0.9),
            sec: false,
            info: {
              id: 'platonic_octa',
              nameVi: 'Bát Diện Đều {3, 4}',
              nameEn: 'Regular Octahedron',
              badgeVi: '8 Mặt',
              badgeEn: '8 Faces',
              introVi: '8 mặt tam giác đều ghép hai chóp tứ giác đều chung đáy.',
              introEn: 'Eight equilateral triangular faces forming two joined pyramids.',
              functionVi: 'Khối đối ngẫu của hình lập phương và hay gặp trong tinh thể.',
              functionEn: 'Dual polyhedron of the cube, common in crystal lattices.',
              specFormula: 'V=6, E=12, F=8'
            }
          },
          {
            geo: new THREE.DodecahedronGeometry(1.48),
            dir: new THREE.Vector3(-1.45, 0.55, -1.5),
            sec: true,
            info: {
              id: 'platonic_dodeca',
              nameVi: 'Thập Nhị Diện Đều {5, 3}',
              nameEn: 'Regular Dodecahedron',
              badgeVi: '12 Mặt',
              badgeEn: '12 Faces',
              introVi: '12 mặt ngũ giác đều, 20 đỉnh, 30 cạnh với tỉ lệ vàng φ.',
              introEn: 'Twelve regular pentagonal faces, 20 vertices, 30 edges.',
              functionVi: 'Thể hiện tính đối xứng 5 bậc và tỉ lệ vàng trong không gian.',
              functionEn: 'Demonstrates 5-fold symmetry and golden ratio proportions.',
              specFormula: 'V=20, E=30, F=12'
            }
          },
          {
            geo: new THREE.IcosahedronGeometry(1.85),
            dir: new THREE.Vector3(1.45, 0.55, -1.5),
            sec: false,
            info: {
              id: 'platonic_icosa',
              nameVi: 'Nhị Thập Diện Đều {3, 5}',
              nameEn: 'Regular Icosahedron',
              badgeVi: '20 Mặt',
              badgeEn: '20 Faces',
              introVi: '20 mặt tam giác đều hội tụ 5 mặt tại mỗi đỉnh, 12 đỉnh, 30 cạnh.',
              introEn: 'Twenty equilateral triangles with 5 meeting per vertex.',
              functionVi: 'Lớp vỏ ngoài gần cầu nhất trong 5 khối đa diện Platon.',
              functionEn: 'Outermost spherical-approximation shell in Platonic nesting.',
              specFormula: 'V=12, E=30, F=20'
            }
          }
        ];
        platonicSpecs.forEach((spec, idx) => {
          trackGeo(spec.geo);
          const m = new THREE.Mesh(
            spec.geo,
            idx === 0 ? mats.glow : spec.sec ? mats.secondary : mats.primary
          );
          if (idx > 0 && nextFinish === 'ceramic') {
            m.material = trackMat(
              new THREE.MeshStandardMaterial({
                color: spec.sec ? palette.secondaryHex : palette.hex,
                roughness: 0.25 + idx * 0.08,
                metalness: 0.35,
                transparent: true,
                opacity: Math.max(0.32, 0.9 - idx * 0.13),
                side: THREE.DoubleSide,
                clippingPlanes: [runtime.slicePlane],
                clipShadows: true
              })
            );
          }
          m.position.set(0, 2.0, 0);
          addPart(m, spec.dir, spec.info);
        });
      } else if (nextMode === 'sphere_slice') {
        const R = 1.95;
        const outerGeo = trackGeo(new THREE.SphereGeometry(R, 42, 32));
        const outerMat = trackMat(
          new THREE.MeshPhysicalMaterial({
            color: palette.hex,
            roughness: 0.15,
            metalness: 0.15,
            transparent: true,
            opacity: 0.55,
            side: THREE.DoubleSide,
            clippingPlanes: [runtime.slicePlane],
            clipShadows: true
          })
        );
        const outerSphere = new THREE.Mesh(outerGeo, outerMat);
        outerSphere.position.set(0, R + 0.15, 0);
        addPart(
          outerSphere,
          new THREE.Vector3(0, 1.3, 0),
          {
            id: 'sphere_shell',
            nameVi: 'Vỏ Mặt Cầu (S)',
            nameEn: 'Spherical Surface Shell',
            badgeVi: 'Mặt cầu',
            badgeEn: 'Sphere Shell',
            introVi: 'Tập hợp mọi điểm M(x, y, z) cách đều tâm I cố định đúng bằng R.',
            introEn: 'Locus of points equidistant R from center I.',
            functionVi: 'Cho phép cắt ngang tạo thiết diện tròn bán kính r = √(R² - d²).',
            functionEn: 'Yields circular slice radius r = √(R² - d²).',
            specFormula: 'S = 4πR² · V = (4/3)πR³'
          },
          false
        );

        const coreGeo = trackGeo(new THREE.SphereGeometry(0.45, 24, 24));
        const coreMesh = new THREE.Mesh(coreGeo, mats.glow);
        coreMesh.position.set(0, R + 0.15, 0);
        addPart(
          coreMesh,
          new THREE.Vector3(0, -0.6, 0),
          {
            id: 'sphere_core',
            nameVi: 'Tâm Mặt Cầu I(a, b, c)',
            nameEn: 'Sphere Center Core I',
            badgeVi: 'Tâm I',
            badgeEn: 'Center I',
            introVi: 'Tâm đối xứng mọi phương của mặt cầu trong hệ trục Oxyz.',
            introEn: 'Omnidirectional symmetry center of the sphere.',
            functionVi: 'Làm gốc đo khoảng cách d(I, (P)) xác định giao tuyến tròn.',
            functionEn: 'Origin for measuring plane distance d(I, P).',
            specFormula: 'r_giao = √(R² - d²)'
          },
          false
        );

        const cutGeo = trackGeo(new THREE.TorusGeometry(1.0, 0.045, 16, 64));
        sphereCutRing = new THREE.Mesh(cutGeo, mats.glow);
        sphereCutRing.rotation.x = Math.PI / 2;
        sphereCutRing.position.set(0, R + 0.15, 0);
        group.add(sphereCutRing);
      } else if (nextMode === 'freehand_oxyz') {
        const plinthGeo = trackGeo(new THREE.CylinderGeometry(0.65, 0.85, 0.18, 24));
        const plinth = new THREE.Mesh(plinthGeo, mats.secondary);
        plinth.position.set(0, 0.09, 0);
        addPart(
          plinth,
          new THREE.Vector3(0, -0.8, 0),
          {
            id: 'oxyz_plinth',
            nameVi: 'Đế Gốc Tọa Độ O(0,0,0)',
            nameEn: 'Origin Coordinate Plinth',
            badgeVi: 'Gốc O',
            badgeEn: 'Origin O',
            introVi: 'Bệ chuẩn định vị mặt phẳng Oxz trong không gian vẽ Oxyz.',
            introEn: 'Reference base anchoring the Oxz coordinate plane.',
            functionVi: 'Giúp ước lượng độ cao y và tọa độ 3 chiều của các nét Neon.',
            functionEn: 'Anchors spatial scale and vertical height y.',
            specFormula: 'O(0, 0, 0)'
          },
          false
        );

        const coreOctGeo = trackGeo(new THREE.OctahedronGeometry(0.32));
        const coreOct = new THREE.Mesh(coreOctGeo, mats.glow);
        coreOct.position.set(0, 1.5, 0);
        addPart(coreOct, new THREE.Vector3(0, 1.1, 0), {
          id: 'oxyz_beacon',
          nameVi: 'Tâm Tham Chiếu Không Gian',
          nameEn: 'Spatial Beacon Octahedron',
          badgeVi: 'Tâm chuẩn',
          badgeEn: 'Beacon',
          introVi: 'Khối bát diện phát sáng đặt tại độ cao chuẩn y = 1.5m.',
          introEn: 'Luminous octahedral reference at standard height y = 1.5m.',
          functionVi: 'Là điểm mốc trung tâm để xoay và cân đối khối vẽ 3D.',
          functionEn: 'Central anchor around which 3D neon strokes orbit.',
          specFormula: 'r(t) = (x(t), y(t), z(t))'
        });

        const orbitRingGeo = trackGeo(new THREE.TorusGeometry(1.35, 0.02, 12, 64));
        const orbitRing = new THREE.Mesh(orbitRingGeo, mats.primary);
        orbitRing.rotation.x = Math.PI / 2;
        orbitRing.position.set(0, 1.5, 0);
        addPart(
          orbitRing,
          new THREE.Vector3(1.2, 0.4, 0),
          {
            id: 'oxyz_ring',
            nameVi: 'Vòng Định Hướng Đường Chân Trời',
            nameEn: 'Horizon Orientation Ring',
            badgeVi: 'Vòng chuẩn',
            badgeEn: 'Guide Ring',
            introVi: 'Vòng tròn bán kính 1.35m bao quanh vùng thao tác tay Oxyz.',
            introEn: 'Horizontal reference ring framing the 3D sculpt zone.',
            functionVi: 'Giúp căn tỷ lệ khi đặt khối kiến tạo Voxel hoặc vẽ ống cong.',
            functionEn: 'Assists depth perception during 3D sculpting.',
            specFormula: 'x² + z² = 1.35²'
          },
          false
        );
      } else if (nextMode === 'wave_surface') {
        const size = 5.4;
        const segs = 56;
        waveGeo = trackGeo(new THREE.PlaneGeometry(size, size, segs, segs));
        waveGeo.rotateX(-Math.PI / 2);
        const pos = waveGeo.attributes.position as THREE.BufferAttribute;
        waveBaseZ = new Float32Array(pos.count);
        const colors = new Float32Array(pos.count * 3);
        for (let i = 0; i < pos.count; i++) {
          waveBaseZ[i] = pos.getY(i);
          colors[i * 3] = 0.2;
          colors[i * 3 + 1] = 0.8;
          colors[i * 3 + 2] = 0.95;
        }
        waveGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const waveMat = trackMat(
          new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.22,
            metalness: 0.45,
            wireframe: nextFinish === 'wireframe',
            side: THREE.DoubleSide,
            clippingPlanes: [runtime.slicePlane],
            clipShadows: true
          })
        );
        const waveMesh = new THREE.Mesh(waveGeo, waveMat);
        waveMesh.position.set(0, 1.35, 0);
        addPart(
          waveMesh,
          new THREE.Vector3(0, 1.15, 0),
          {
            id: 'wave_field',
            nameVi: 'Mặt Sóng Giao Thoa Hai Nguồn',
            nameEn: 'Two-Source Wave Field Mesh',
            badgeVi: 'Mặt sóng',
            badgeEn: 'Wave Field',
            introVi: 'Lưới 56×56 đỉnh mô phỏng tổng hợp biên độ từ hai nguồn S₁ và S₂.',
            introEn: 'Dynamic 56×56 vertex surface summing two coherent wave sources.',
            functionVi: 'Hiển thị các vân cực đại (cộng hưởng) và cực tiểu (triệt tiêu) theo thời gian thực.',
            functionEn: 'Displays constructive antinodes and destructive nodal lines.',
            specFormula: 'u = A·[cos(kr₁-ωt) + cos(kr₂-ωt)]'
          },
          false
        );

        const emitterGeo = trackGeo(new THREE.CylinderGeometry(0.12, 0.18, 1.15, 16));
        [-1.6, 1.6].forEach((xPos, sIdx) => {
          const tower = new THREE.Mesh(emitterGeo, mats.secondary);
          tower.position.set(xPos, 0.58, 0);
          addPart(
            tower,
            new THREE.Vector3(Math.sign(xPos) * 1.4, -0.6, 0),
            {
              id: `wave_source_${sIdx + 1}`,
              nameVi: `Nguồn Phát Sóng Kết Hợp S${sIdx + 1}`,
              nameEn: `Coherent Wave Source S${sIdx + 1}`,
              badgeVi: `Nguồn S${sIdx + 1}`,
              badgeEn: `Source S${sIdx + 1}`,
              introVi: `Cần rung dao động điều hòa đặt tại x = ${xPos}m, cùng tần số f và cùng pha.`,
              introEn: `Harmonic wave emitter positioned at x = ${xPos}m.`,
              functionVi: 'Phát sóng tròn đồng tâm lan truyền trên mặt lưới tạo giao thoa.',
              functionEn: 'Emits concentric circular waves creating interference patterns.',
              specFormula: 'Δd = r₂ - r₁ = k·λ'
            },
            false
          );
        });
      } else if (nextMode === 'quantum_atom') {
        const centerY = 2.05;
        const nucleusGroup = new THREE.Group();
        nucleusGroup.position.set(0, centerY, 0);
        const nucleonGeo = trackGeo(new THREE.SphereGeometry(0.24, 18, 18));
        const offsets = [
          [0, 0, 0],
          [0.2, 0.16, 0.12],
          [-0.2, -0.15, 0.14],
          [0.14, -0.18, -0.18],
          [-0.16, 0.18, -0.15]
        ];
        offsets.forEach(([ox, oy, oz], idx) => {
          const nuc = new THREE.Mesh(nucleonGeo, idx % 2 === 0 ? mats.glow : mats.secondary);
          nuc.position.set(ox, oy, oz);
          nucleusGroup.add(nuc);
        });
        addPart(
          nucleusGroup,
          new THREE.Vector3(0, -1.2, 0),
          {
            id: 'atom_nucleus',
            nameVi: 'Hạt Nhân Nguyên Tử (Proton & Neutron)',
            nameEn: 'Atomic Nucleus Cluster',
            badgeVi: 'Hạt nhân',
            badgeEn: 'Nucleus',
            introVi: 'Cụm hạt nhân mang điện tích dương (+Ze) tập trung gần như toàn bộ khối lượng.',
            introEn: 'Positively charged core of protons and neutrons.',
            functionVi: 'Tạo lực hút tĩnh điện Coulomb giữ các electron chuyển động trên quỹ đạo.',
            functionEn: 'Provides Coulomb attraction binding orbital electrons.',
            specFormula: 'F = k·Z·e² / r²'
          },
          false
        );

        atomElectrons = [];
        const tilts: [number, number, number][] = [
          [0.35, 0.2, 0.4],
          [1.15, 0.6, -0.35],
          [-0.95, 0.4, 0.75],
          [0.2, 1.2, -1.1]
        ];
        const eGeo = trackGeo(new THREE.SphereGeometry(0.13, 16, 16));
        const shellNames = ['Lớp K (n=1)', 'Lớp L (n=2)', 'Lớp M (n=3)', 'Lớp N (n=4)'];
        tilts.forEach((tilt, idx) => {
          const r = 1.35 + idx * 0.34;
          const ringGeo = trackGeo(new THREE.TorusGeometry(r, 0.025, 12, 64));
          const ring = new THREE.Mesh(ringGeo, idx % 2 === 0 ? mats.primary : mats.secondary);
          ring.position.set(0, centerY, 0);
          ring.rotation.set(tilt[0], tilt[1], tilt[2]);
          addPart(
            ring,
            new THREE.Vector3(Math.cos(idx * 1.55) * 1.65, 0.55, Math.sin(idx * 1.55) * 1.65),
            {
              id: `atom_shell_${idx + 1}`,
              nameVi: `Quỹ Đạo Dừng ${shellNames[idx]}`,
              nameEn: `Bohr Orbit Shell n=${idx + 1}`,
              badgeVi: `Mức n=${idx + 1}`,
              badgeEn: `Shell n=${idx + 1}`,
              introVi: `Quỹ đạo lượng tử bán kính r = ${r.toFixed(2)}m với mức năng lượng gián đoạn.`,
              introEn: `Quantized orbital ring at radius r = ${r.toFixed(2)}m.`,
              functionVi: 'Quy định trạng thái dừng của electron; chuyển mức sẽ phát/hấp thụ photon.',
              functionEn: 'Hosts orbiting electrons; transitions emit or absorb photons.',
              specFormula: `E_${idx + 1} = -13.6 / ${(idx + 1) * (idx + 1)} eV`
            },
            false
          );

          const electron = new THREE.Mesh(eGeo, mats.glow);
          group.add(electron);
          atomElectrons!.push({
            mesh: electron,
            ringRadius: r,
            tiltEuler: new THREE.Euler(tilt[0], tilt[1], tilt[2]),
            speed: 1.8 - idx * 0.25,
            phase: idx * 1.7
          });
        });
      } else if (nextMode === 'dna_helix') {
        const turns = 2.4;
        const heightSpan = 3.8;
        const radius = 1.05;
        const ptsA: THREE.Vector3[] = [];
        const ptsB: THREE.Vector3[] = [];
        const steps = 64;

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const ang = t * Math.PI * 2 * turns;
          const y = 0.25 + t * heightSpan;
          ptsA.push(new THREE.Vector3(Math.cos(ang) * radius, y, Math.sin(ang) * radius));
          ptsB.push(new THREE.Vector3(Math.cos(ang + Math.PI) * radius, y, Math.sin(ang + Math.PI) * radius));
        }

        const curveA = new THREE.CatmullRomCurve3(ptsA);
        const curveB = new THREE.CatmullRomCurve3(ptsB);
        const tubeGeoA = trackGeo(new THREE.TubeGeometry(curveA, 72, 0.085, 12, false));
        const tubeGeoB = trackGeo(new THREE.TubeGeometry(curveB, 72, 0.085, 12, false));

        addPart(
          new THREE.Mesh(tubeGeoA, mats.primary),
          new THREE.Vector3(-1.75, 0, 0),
          {
            id: 'dna_strand_a',
            nameVi: "Mạch Khung Đường-Photphat 3'→5'",
            nameEn: "Backbone Strand A (3'→5')",
            badgeVi: 'Mạch A',
            badgeEn: 'Strand A',
            introVi: 'Khung xương ngoài xoắn đều tạo từ phân tử đường Deoxyribose và nhóm Photphat.',
            introEn: 'Helical sugar-phosphate backbone running 3′ to 5′.',
            functionVi: 'Bảo vệ trình tự mã di truyền và làm mạch khuôn khi nhân đôi DNA.',
            functionEn: 'Stabilizes genetic sequence and acts as replication template.',
            specFormula: 'Bước xoắn = 34 Å · 10 cặp/vòng'
          },
          false
        );
        addPart(
          new THREE.Mesh(tubeGeoB, mats.secondary),
          new THREE.Vector3(1.75, 0, 0),
          {
            id: 'dna_strand_b',
            nameVi: "Mạch Khung Đối Song 5'→3'",
            nameEn: "Antiparallel Strand B (5'→3')",
            badgeVi: 'Mạch B',
            badgeEn: 'Strand B',
            introVi: 'Mạch xoắn thứ hai chạy ngược chiều đối song và xoắn quanh trục chung.',
            introEn: 'Complementary backbone running antiparallel around the axis.',
            functionVi: 'Giúp cấu trúc xoắn kép bền vững và tự sửa sai khi sao chép.',
            functionEn: 'Provides structural complementarity and error correction.',
            specFormula: 'A = T, G = X (Chargaff)'
          },
          false
        );

        const rungGeo = trackGeo(new THREE.CylinderGeometry(0.04, 0.04, radius * 0.96, 10));
        rungGeo.rotateZ(Math.PI / 2);
        const rungsAGroup = new THREE.Group();
        const rungsBGroup = new THREE.Group();
        const pairs = 15;
        for (let i = 1; i <= pairs; i++) {
          const t = i / (pairs + 1);
          const pA = curveA.getPoint(t);
          const pB = curveB.getPoint(t);
          const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
          const dir = new THREE.Vector3().subVectors(pB, pA).normalize();

          const halfA = new THREE.Mesh(rungGeo, i % 2 === 0 ? mats.glow : mats.primary);
          halfA.position.copy(pA).lerp(mid, 0.5);
          halfA.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
          rungsAGroup.add(halfA);

          const halfB = new THREE.Mesh(rungGeo, i % 2 === 0 ? mats.secondary : mats.glow);
          halfB.position.copy(pB).lerp(mid, 0.5);
          halfB.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
          rungsBGroup.add(halfB);
        }

        addPart(
          rungsAGroup,
          new THREE.Vector3(-0.95, 0.35, 0.95),
          {
            id: 'dna_bases_a',
            nameVi: 'Dãy Bazơ Nitơ Nhánh A (A / G)',
            nameEn: 'Nitrogenous Bases Side A',
            badgeVi: 'Bazơ nhánh A',
            badgeEn: 'Bases A',
            introVi: 'Các bazơ nitơ gắn vào mạch A hướng vào tâm xoắn kép.',
            introEn: 'Nitrogenous bases anchored to strand A facing the helix core.',
            functionVi: 'Lưu giữ thông tin di truyền qua trật tự sắp xếp 4 loại đơn phân A, T, G, X.',
            functionEn: 'Encodes genetic information via base sequence.',
            specFormula: '2–3 liên kết Hydro'
          },
          false
        );
        addPart(
          rungsBGroup,
          new THREE.Vector3(0.95, 0.35, -0.95),
          {
            id: 'dna_bases_b',
            nameVi: 'Dãy Bazơ Bổ Sung Nhánh B (T / X)',
            nameEn: 'Complementary Bases Side B',
            badgeVi: 'Bazơ nhánh B',
            badgeEn: 'Bases B',
            introVi: 'Các bazơ bổ sung liên kết Hydro với nhánh A theo nguyên tắc A–T, G–X.',
            introEn: 'Complementary base rungs pairing A–T and G–C.',
            functionVi: 'Tách liên kết Hydro ở giữa khi enzyme Helicase tháo xoắn nhân đôi.',
            functionEn: 'Unzips hydrogen bonds centrally during DNA replication.',
            specFormula: 'A-T (2 H) · G-X (3 H)'
          },
          false
        );
      }

      runtime.rootGroup.add(group);
      runtime.model = {
        group,
        explodables,
        waveGeo,
        waveBaseZ,
        atomElectrons,
        sphereCutRing,
        disposables: { geometries, materials }
      };
      setModelParts(explodables.map((p) => p.info));
    },
    [buildMaterials, disposeModel, restoreIsolatedPart]
  );

  // Dedicated Unified MediaPipe Hand-Tracking Loop (FPS-throttled per gestureSettings.trackingFps)
  useEffect(() => {
    if (!cameraActive) return;
    let rafId = 0;
    let cancelled = false;
    let lastInferMs = 0;
    let lastPush = 0;

    const scanHands = (nowMs: number) => {
      if (cancelled) return;
      const cfg = paramsRef.current;
      const gs = cfg.gestureSettings;
      const minIntervalMs = 1000 / Math.max(10, gs.trackingFps || 20);

      if (videoRef.current && trackerRef.current && nowMs - lastInferMs >= minIntervalMs) {
        lastInferMs = nowMs;
        const res = trackerRef.current.process(videoRef.current, {
          mirror: gs.mirrorCamera,
          handMode: gs.handMode,
          pointerSource: gs.pointerSource,
          sensitivityX: gs.sensitivityX,
          sensitivityY: gs.sensitivityY,
          pinchSensitivity: gs.pinchSensitivity,
          fingerExtendSensitivity: gs.fingerExtendSensitivity,
          smoothing: gs.smoothing,
          deadzone: gs.deadzone,
          stabilityFrames: gs.stabilityFrames,
          gestureHoldMs: gs.gestureHoldMs,
          invertX: gs.invertX,
          invertY: gs.invertY
        });
        handFrameRef.current = res;

        if (overlayCanvasRef.current) {
          const pal = ACCENT_PALETTES.find((p) => p.id === cfg.paletteId) || ACCENT_PALETTES[0];
          trackerRef.current.drawOverlay(overlayCanvasRef.current, res, pal.css);
        }

        if (nowMs - lastPush > 110) {
          lastPush = nowMs;
          setHandFrame(res);
        }
      }
      rafId = requestAnimationFrame(scanHands);
    };

    rafId = requestAnimationFrame(scanHands);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [cameraActive]);

  // Initialize Three.js WebGL 3D Stage once
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const softwareGl = isSoftwareWebGL();
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050914);
    scene.fog = new THREE.FogExp2(0x050914, 0.022);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 160);
    camera.position.set(6.4, 4.8, 7.6);

    const isLightPref = paramsRef.current.gestureSettings.graphicsQuality === 'light';
    const renderer = new THREE.WebGLRenderer({
      antialias: !softwareGl && !isLightPref,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(
      softwareGl || isLightPref ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio, 2)
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !softwareGl && !isLightPref;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    mount.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !softwareGl;
    controls.dampingFactor = 0.07;
    controls.target.set(0, 1.65, 0);
    controls.minDistance = 2.6;
    controls.maxDistance = 26;

    const hemi = new THREE.HemisphereLight(0xbae6fd, 0x0f172a, 0.95);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.2);
    keyLight.position.set(6.5, 11, 7.5);
    keyLight.castShadow = !softwareGl && !isLightPref;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.35);
    rimLight.position.set(-7, 4, -7);
    scene.add(rimLight);

    const floorGroup = new THREE.Group();
    const gridHelper = new THREE.GridHelper(18, 24, 0x38bdf8, 0x1e293b);
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.55;
    floorGroup.add(gridHelper);

    const discGeo = new THREE.CircleGeometry(8.5, 64);
    discGeo.rotateX(-Math.PI / 2);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x070d1d,
      roughness: 0.78,
      metalness: 0.2,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });
    const floorDisc = new THREE.Mesh(discGeo, discMat);
    floorDisc.position.y = -0.02;
    floorDisc.receiveShadow = !softwareGl;
    floorGroup.add(floorDisc);
    scene.add(floorGroup);

    const axesGroup = new THREE.Group();
    const axesHelper = new THREE.AxesHelper(4.4);
    axesHelper.position.y = 0.01;
    axesGroup.add(axesHelper);
    scene.add(axesGroup);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const isolatedHolder = new THREE.Group();
    isolatedHolder.position.set(0, 1.85, 0);
    isolatedHolder.visible = false;
    const isolatedPivot = new THREE.Group();
    isolatedHolder.add(isolatedPivot);
    scene.add(isolatedHolder);

    const highlightHelper = new THREE.BoxHelper(new THREE.Object3D(), 0x22d3ee);
    highlightHelper.visible = false;
    scene.add(highlightHelper);

    const strokesGroup = new THREE.Group();
    scene.add(strokesGroup);

    const markersGroup = new THREE.Group();
    scene.add(markersGroup);

    const slicePlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 100);
    const sliceHelperGeo = new THREE.PlaneGeometry(5.8, 5.8);
    sliceHelperGeo.rotateX(-Math.PI / 2);
    const sliceHelperMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const sliceHelperMesh = new THREE.Mesh(sliceHelperGeo, sliceHelperMat);
    const sliceBorder = new THREE.LineSegments(
      new THREE.EdgesGeometry(sliceHelperGeo),
      new THREE.LineBasicMaterial({ color: 0xd8b4fe, transparent: true, opacity: 0.85 })
    );
    sliceHelperMesh.add(sliceBorder);
    sliceHelperMesh.visible = false;
    scene.add(sliceHelperMesh);

    const cursorGroup = new THREE.Group();
    const cursorOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee })
    );
    const cursorRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.018, 10, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
    );
    cursorGroup.add(cursorOrb, cursorRing);
    cursorGroup.position.set(0, 1.5, 0);
    scene.add(cursorGroup);

    // 10 dedicated 3D fingertip sensor orbs (5 per hand)
    const tipSensorGeo = new THREE.SphereGeometry(0.085, 16, 16);
    const tipSensorMatH1 = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    const tipSensorMatH2 = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const tipSensorMeshes: THREE.Mesh[] = Array.from({ length: 10 }, (_, idx) => {
      const m = new THREE.Mesh(tipSensorGeo, idx < 5 ? tipSensorMatH1 : tipSensorMatH2);
      m.visible = false;
      scene.add(m);
      return m;
    });

    const runtime: LabRuntime = {
      scene,
      camera,
      renderer,
      controls,
      rootGroup,
      isolatedHolder,
      isolatedPivot,
      isolatedRestore: null,
      highlightHelper,
      axesGroup,
      floorGroup,
      slicePlane,
      sliceHelperMesh,
      cursorMesh: cursorGroup,
      tipSensorMeshes,
      strokesGroup,
      markersGroup,
      model: null,
      strokeMeshes: [],
      markerMeshes: [],
      activeStrokePoints: [],
      activeStrokePointsH2: [],
      activePreviewLine: null,
      activePreviewLineH2: null
    };
    runtimeRef.current = runtime;

    const handleCanvasPointerDown = (e: PointerEvent) => {
      pointerDownScreenRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleCanvasPointerUp = (e: PointerEvent) => {
      const down = pointerDownScreenRef.current;
      pointerDownScreenRef.current = null;
      if (!down) return;
      if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
      if (paramsRef.current.spaceMode !== '3d' || isolatedPartIdxRef.current !== null || !runtime.model) {
        return;
      }
      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.set(
        ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1,
        -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1
      );
      _raycaster.setFromCamera(_pointerNdc, camera);
      const hits = _raycaster.intersectObject(runtime.model.group, true);
      if (hits.length === 0) return;

      let matchedIdx = -1;
      for (const hit of hits) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj && obj !== runtime.model.group) {
          const found = runtime.model.explodables.findIndex((p) => p.mesh === obj);
          if (found !== -1) {
            matchedIdx = found;
            break;
          }
          obj = obj.parent;
        }
        if (matchedIdx !== -1) break;
      }

      if (matchedIdx !== -1) {
        setHighlightedPartIdx(matchedIdx);
        setIsolatedPartIdx(matchedIdx);
        setPartCardMinimized(false);
        const info = runtime.model.explodables[matchedIdx].info;
        showToast(`Đã chọn bộ phận: ${info.nameVi}`);
      }
    };
    renderer.domElement.addEventListener('pointerdown', handleCanvasPointerDown);
    renderer.domElement.addEventListener('pointerup', handleCanvasPointerUp);

    rebuildModel(runtime, paramsRef.current.modeId, paramsRef.current.finish, ACCENT_PALETTES[0], softwareGl);

    if (!softwareGl) {
      renderer.compile(scene, camera);
    }

    if (!trackerRef.current) {
      trackerRef.current = new HandGestureTracker();
    }

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let lastUiPush = 0;

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const finalizeStrokeChannel = (isSecondHand: boolean) => {
      const pts = isSecondHand ? runtime.activeStrokePointsH2 : runtime.activeStrokePoints;
      const preview = isSecondHand ? runtime.activePreviewLineH2 : runtime.activePreviewLine;
      if (preview) {
        runtime.strokesGroup.remove(preview);
        preview.geometry.dispose();
        (preview.material as THREE.Material).dispose();
        if (isSecondHand) runtime.activePreviewLineH2 = null;
        else runtime.activePreviewLine = null;
      }
      if (pts.length >= 3) {
        const curve = new THREE.CatmullRomCurve3(pts);
        const tubeGeo = new THREE.TubeGeometry(curve, Math.min(84, pts.length * 3), 0.065, 10, false);
        const activePal = ACCENT_PALETTES.find((p) => p.id === paramsRef.current.paletteId) || ACCENT_PALETTES[0];
        const colHex = isSecondHand ? 0x34d399 : activePal.hex;
        const tubeMat = new THREE.MeshStandardMaterial({
          color: colHex,
          emissive: colHex,
          emissiveIntensity: 0.45,
          roughness: 0.25,
          metalness: 0.4
        });
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        runtime.strokesGroup.add(tubeMesh);
        runtime.strokeMeshes.push(tubeMesh);
        setStrokeCount(runtime.strokeMeshes.length);
      }
      if (isSecondHand) runtime.activeStrokePointsH2 = [];
      else runtime.activeStrokePoints = [];
    };

    const appendStrokePoint = (pt: THREE.Vector3, isSecondHand: boolean) => {
      const pts = isSecondHand ? runtime.activeStrokePointsH2 : runtime.activeStrokePoints;
      if (pts.length === 0 || pts[pts.length - 1].distanceTo(pt) > 0.14) {
        pts.push(pt.clone());
        if (pts.length > 90) pts.shift();

        const preview = isSecondHand ? runtime.activePreviewLineH2 : runtime.activePreviewLine;
        if (preview) {
          preview.geometry.dispose();
          preview.geometry = new THREE.BufferGeometry().setFromPoints(pts);
        } else if (pts.length >= 2) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
          const lineMat = new THREE.LineBasicMaterial({ color: isSecondHand ? 0x34d399 : 0x22d3ee });
          const nextLine = new THREE.Line(lineGeo, lineMat);
          runtime.strokesGroup.add(nextLine);
          if (isSecondHand) runtime.activePreviewLineH2 = nextLine;
          else runtime.activePreviewLine = nextLine;
        }
      }
    };

    const spawnCreativeStamp = (px: number, py: number, pz: number, brush: CreativeBrushId, useSnap: boolean) => {
      const pal = ACCENT_PALETTES.find((p) => p.id === paramsRef.current.paletteId) || ACCENT_PALETTES[0];
      const snap = (v: number) => (useSnap ? Math.round(v / 0.45) * 0.45 : v);
      const sx = snap(px);
      const sy = Math.max(0.22, snap(py));
      const sz = snap(pz);

      let geo: THREE.BufferGeometry;
      if (brush === 'cube') geo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
      else if (brush === 'sphere') geo = new THREE.SphereGeometry(0.24, 20, 20);
      else if (brush === 'torus') geo = new THREE.TorusGeometry(0.24, 0.08, 12, 28);
      else geo = new THREE.ConeGeometry(0.26, 0.46, 4);

      const mat = new THREE.MeshStandardMaterial({
        color: brush === 'sphere' ? pal.hex : pal.secondaryHex,
        emissive: pal.hex,
        emissiveIntensity: 0.35,
        roughness: 0.22,
        metalness: 0.55
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(sx, sy, sz);
      mesh.castShadow = !softwareGl;
      mesh.receiveShadow = !softwareGl;
      runtime.markersGroup.add(mesh);
      runtime.markerMeshes.push(mesh);
      setMarkerCount(runtime.markerMeshes.length);
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(0.05, clock.getDelta());
      const elapsed = clock.getElapsedTime();
      const cfg = paramsRef.current;

      // Only render 3D canvas while in Studio 3D space mode
      if (cfg.entryView === 'studio' && cfg.spaceMode === '3d') {
        const res = handFrameRef.current;
        const handDetected = cfg.cameraActive && res.detected;
        const currentGesture: HandGestureId = cfg.cameraActive
          ? handDetected
            ? res.gesture
            : 'none'
          : cfg.virtualGesture;

        let cursorNormX = handDetected ? res.cursorX : 0.5;
        let cursorNormY = handDetected ? res.cursorY : 0.5;

        // Sync 10 dedicated 3D fingertip sensors in Oxyz
        if (handDetected) {
          const activeSlotSet = new Set<number>();
          for (const tip of res.tips) {
            const slotIdx = tip.id - 1;
            if (slotIdx < 0 || slotIdx >= 10) continue;
            activeSlotSet.add(slotIdx);
            const sensor = runtime.tipSensorMeshes[slotIdx];
            sensor.visible = true;
            sensor.scale.setScalar(tip.extended ? 1.15 : 0.65);
            const tx = (tip.x - 0.5) * 6.4;
            const ty = THREE.MathUtils.clamp((1 - tip.y) * 3.8, 0.2, 4.0);
            const tz = Math.sin((tip.x - 0.5) * Math.PI) * 1.4 - tip.z * 2.2;
            sensor.position.x = THREE.MathUtils.damp(sensor.position.x, tx, 18, dt);
            sensor.position.y = THREE.MathUtils.damp(sensor.position.y, ty, 18, dt);
            sensor.position.z = THREE.MathUtils.damp(sensor.position.z, tz, 18, dt);
          }
          for (let i = 0; i < 10; i++) {
            if (!activeSlotSet.has(i)) runtime.tipSensorMeshes[i].visible = false;
          }
        } else {
          for (let i = 0; i < 10; i++) runtime.tipSensorMeshes[i].visible = false;
        }

        const activeControl = handDetected || (!cfg.cameraActive && virtualPadDownRef.current);
        if (activeControl && !handDetected) {
          cursorNormX = (smoothTargetRef.current.cursorX + 3.2) / 6.4;
          cursorNormY = 1 - smoothTargetRef.current.cursorY / 3.8;
        }

        const mapped3DAction: GestureAction3D =
          currentGesture === 'none'
            ? 'none'
            : cfg.gestureSettings.gestureActions3D[currentGesture] ?? 'none';

        const shouldPushUi = elapsed - lastUiPush > 0.11;
        if (shouldPushUi) lastUiPush = elapsed;

        const isIsolated = isolatedPartIdxRef.current !== null;
        const rotSens = cfg.gestureSettings.rotationSensitivity || 2.35;

        const isPinchActive =
          activeControl &&
          (mapped3DAction === 'pinch_stamp_scale' ||
            (handDetected && (res.hand1Pinching || res.hand2Pinching) && mapped3DAction !== 'none'));

        // 1. UNIFIED SWIPE LEFT/RIGHT: cycle between exploded/isolated parts
        if (handDetected && res.swipeEvent && modelPartsRef.current.length > 0) {
          const total = modelPartsRef.current.length;
          if (smoothTargetRef.current.explode >= 0.25 || isIsolated) {
            const dir = res.swipeEvent === 'right' ? 1 : -1;
            const baseIdx =
              isolatedPartIdxRef.current !== null
                ? isolatedPartIdxRef.current
                : highlightedPartIdxRef.current ?? 0;
            const nextIdx = (baseIdx + dir + total) % total;
            setHighlightedPartIdx(nextIdx);
            if (isIsolated) {
              setIsolatedPartIdx(nextIdx);
            }
            const nextInfo = modelPartsRef.current[nextIdx];
            showToast(
              `${res.swipeEvent === 'right' ? 'Tiếp →' : '← Trước'} ${nextInfo.nameVi} (${nextIdx + 1}/${total})`
            );
          }
        }

        // 2. RISING-EDGE 2-FINGER SELECTION: isolate / exit highlighted part when exploded
        const nowPerfMs = performance.now();
        const isTwoFingerSelectEdge =
          handDetected &&
          currentGesture === 'slice_2' &&
          prevGestureRef.current !== 'slice_2' &&
          nowPerfMs - lastTwoFingerSelectAtRef.current > 850 &&
          modelPartsRef.current.length > 0 &&
          (smoothTargetRef.current.explode >= 0.25 || isIsolated);

        if (isTwoFingerSelectEdge) {
          lastTwoFingerSelectAtRef.current = nowPerfMs;
          if (isIsolated) {
            setIsolatedPartIdx(null);
            showToast('Quay lại toàn bộ mô hình đã tách');
          } else {
            const pickIdx = highlightedPartIdxRef.current ?? 0;
            setHighlightedPartIdx(pickIdx);
            setIsolatedPartIdx(pickIdx);
            setPartCardMinimized(false);
            showToast(`Xem chi tiết: ${modelPartsRef.current[pickIdx].nameVi}`);
          }
        }

        // 3. RISING-EDGE 4-FINGER REASSEMBLE: merge all separated/isolated parts smoothly back together
        const isReassembleEdge =
          activeControl &&
          mapped3DAction === 'reassemble_parts' &&
          (currentGesture !== prevGestureRef.current || nowPerfMs - lastReassembleAtRef.current > 850) &&
          (smoothTargetRef.current.explode > 0.04 || isIsolated);

        if (isReassembleEdge) {
          lastReassembleAtRef.current = nowPerfMs;
          smoothTargetRef.current.explode = 0;
          setExplodeVal(0);
          setIsolatedPartIdx(null);
          setHighlightedPartIdx(null);
          showToast(
            isEn
              ? '4 Fingers · Reassembled full 3D model!'
              : '4 Ngón · Đã ghép mô hình về nguyên trạng!'
          );
        }

        let isZoomGestureActive = false;

        if (activeControl && mapped3DAction !== 'none') {
          const targetX = (cursorNormX - 0.5) * 6.4;
          const targetY = THREE.MathUtils.clamp((1 - cursorNormY) * 3.8, 0.25, 3.9);
          const targetZ = Math.sin((cursorNormX - 0.5) * Math.PI) * 1.4;
          smoothTargetRef.current.cursorX = targetX;
          smoothTargetRef.current.cursorY = targetY;
          smoothTargetRef.current.cursorZ = targetZ;

          if (mapped3DAction === 'freeze_lock') {
            if (!cfg.frozen) setFrozen(true);
          } else if (cfg.frozen) {
            setFrozen(false);
          }

          if (mapped3DAction === 'auto_spin_toggle' && shouldPushUi) {
            setAutoSpin((v) => !v);
          }

          // TWO-HAND UNIFIED COMMANDS (strictly separated):
          // - Pulling 2 hands opposite left/right -> ONLY triggers Explode/Separate Structure
          // - Moving 2 hands closer together -> ONLY triggers Zoom Out (shrink)
          if (handDetected && res.handCount === 2) {
            if (res.twoHandOppositeSpread && !isIsolated) {
              const step = Math.max(0.015, res.twoHandSpanDelta * 3.4);
              const nextExp = THREE.MathUtils.clamp(smoothTargetRef.current.explode + step, 0, 1.85);
              smoothTargetRef.current.explode = nextExp;
              if (highlightedPartIdxRef.current === null && modelPartsRef.current.length > 0 && nextExp >= 0.25) {
                setHighlightedPartIdx(0);
              }
              if (shouldPushUi) {
                setExplodeVal(+nextExp.toFixed(2));
              }
            } else if (res.twoHandMovingCloser) {
              isZoomGestureActive = true;
              const shrinkStep = Math.max(0.014, Math.abs(res.twoHandSpanDelta) * 3.0);
              const nextScale = THREE.MathUtils.clamp(smoothTargetRef.current.scale - shrinkStep, 0.42, 2.45);
              smoothTargetRef.current.scale = nextScale;
              if (shouldPushUi) {
                setScaleVal(+nextScale.toFixed(2));
              }
            }
          }

          // ONE-HAND PULL UPWARD -> Zoom In (Enlarge model / isolated part)
          const isPullingUp1Hand =
            handDetected &&
            res.handCount === 1 &&
            res.hand1VelY < -0.18 &&
            Math.abs(res.hand1VelX) < 0.28 &&
            currentGesture !== 'fist_0' &&
            !(cfg.modeId === 'freehand_oxyz' && currentGesture === 'point_1');

          if (isPullingUp1Hand) {
            isZoomGestureActive = true;
            const growStep = Math.min(0.06, Math.abs(res.hand1VelY) * 0.085);
            const nextScale = THREE.MathUtils.clamp(smoothTargetRef.current.scale + growStep, 0.42, 2.45);
            smoothTargetRef.current.scale = nextScale;
            if (shouldPushUi) {
              setScaleVal(+nextScale.toFixed(2));
            }
          }

          // 1-Finger OR 2-Hand Symmetrical Dual Neon Tube Sculpting (Freehand Oxyz)
          if (
            !isIsolated &&
            (mapped3DAction === 'draw_neon' ||
              (cfg.modeId === 'freehand_oxyz' && mapped3DAction === 'dual_zoom_tilt'))
          ) {
            if (handDetected && res.handCount === 2 && res.hand1Index && res.hand2Index) {
              const p1x = (res.hand1Index.x - 0.5) * 6.4;
              const p1y = THREE.MathUtils.clamp((1 - res.hand1Index.y) * 3.8, 0.25, 3.9);
              const p1z = Math.sin((res.hand1Index.x - 0.5) * Math.PI) * 1.4;
              appendStrokePoint(_v3TmpA.set(p1x, p1y, p1z), false);

              const p2x = (res.hand2Index.x - 0.5) * 6.4;
              const p2y = THREE.MathUtils.clamp((1 - res.hand2Index.y) * 3.8, 0.25, 3.9);
              const p2z = Math.sin((res.hand2Index.x - 0.5) * Math.PI) * 1.4;
              appendStrokePoint(_v3TmpB.set(p2x, p2y, p2z), true);
            } else {
              appendStrokePoint(_v3TmpA.set(targetX, targetY, targetZ), false);
              if (runtime.activeStrokePointsH2.length > 0) finalizeStrokeChannel(true);
            }

            if (shouldPushUi) {
              setOxyzCursor({ x: targetX, y: targetY, z: targetZ });
            }
          } else {
            if (runtime.activeStrokePoints.length > 0) finalizeStrokeChannel(false);
            if (runtime.activeStrokePointsH2.length > 0) finalizeStrokeChannel(true);
          }

          // Pinch: Stamp creative 3D blocks in Oxyz OR boost RPM/Amplitude (never conflicts with unified zoom/explode)
          if (mapped3DAction === 'pinch_stamp_scale') {
            const nextHeight = THREE.MathUtils.clamp(0.55 + cursorNormX * 1.25, 0.5, 1.85);
            smoothTargetRef.current.height = nextHeight;
            if (shouldPushUi) {
              setHeightVal(+nextHeight.toFixed(2));
            }

            if (
              !isIsolated &&
              (cfg.modeId === 'freehand_oxyz' || cfg.creativeBrush !== 'tube') &&
              nowPerfMs - lastPinchStampAtRef.current > 650
            ) {
              lastPinchStampAtRef.current = nowPerfMs;
              const stampBrush = cfg.creativeBrush === 'tube' ? 'cube' : cfg.creativeBrush;
              spawnCreativeStamp(targetX, targetY, targetZ, stampBrush, cfg.snapGrid);
            }
          }

          // Slice plane ONLY when not exploded and not isolated
          if (
            mapped3DAction === 'slice_plane' &&
            !isIsolated &&
            smoothTargetRef.current.explode < 0.25
          ) {
            if (!cfg.sliceEnabled) setSliceEnabled(true);
            const nextSlice = THREE.MathUtils.clamp((1 - cursorNormY) * 3.8 + 0.1, 0.15, 4.1);
            smoothTargetRef.current.sliceY = nextSlice;
            if (shouldPushUi) {
              setSliceY(+nextSlice.toFixed(2));
            }
          }

          // HIGH-SENSITIVITY MODEL ROTATION (pure orbit_rotate — never triggers explode!)
          if (mapped3DAction === 'orbit_rotate' && !isZoomGestureActive) {
            if (handDetected) {
              smoothTargetRef.current.rotOffset += res.cursorDX * Math.PI * 2.4 * rotSens;
              smoothTargetRef.current.pitchOffset = THREE.MathUtils.clamp(
                smoothTargetRef.current.pitchOffset + res.cursorDY * Math.PI * 1.5 * rotSens,
                -1.1,
                1.1
              );
            } else {
              smoothTargetRef.current.rotOffset = (cursorNormX - 0.5) * Math.PI * 2.4 * rotSens;
              smoothTargetRef.current.pitchOffset = THREE.MathUtils.clamp(
                (cursorNormY - 0.5) * 1.3 * rotSens,
                -1.0,
                1.0
              );
            }
          }

          if (mapped3DAction === 'dual_zoom_tilt' && !res.twoHandOppositeSpread && !res.twoHandMovingCloser) {
            const nextTilt = handDetected ? THREE.MathUtils.clamp(res.twoHandAngle * 0.55, -0.55, 0.55) : 0;
            smoothTargetRef.current.tiltOffset = nextTilt;
          } else {
            smoothTargetRef.current.tiltOffset = 0;
          }

          if (!awardFlagRef.current && onEarnXP) {
            awardFlagRef.current = true;
            onEarnXP(25);
          }
        } else {
          if (runtime.activeStrokePoints.length > 0 && !virtualPadDownRef.current) finalizeStrokeChannel(false);
          if (runtime.activeStrokePointsH2.length > 0 && !virtualPadDownRef.current) finalizeStrokeChannel(true);
        }

        if (!activeControl) {
          smoothTargetRef.current.scale = cfg.scaleVal;
          smoothTargetRef.current.height = cfg.heightVal;
          smoothTargetRef.current.explode = cfg.explodeVal;
          smoothTargetRef.current.sliceY = cfg.sliceY;
          smoothTargetRef.current.tiltOffset = 0;
        }

        prevGestureRef.current = currentGesture;

        runtime.axesGroup.visible = cfg.showAxes;
        runtime.floorGroup.visible = cfg.showAxes;

        cursorGroup.position.x = THREE.MathUtils.damp(cursorGroup.position.x, smoothTargetRef.current.cursorX, 12, dt);
        cursorGroup.position.y = THREE.MathUtils.damp(cursorGroup.position.y, smoothTargetRef.current.cursorY, 12, dt);
        cursorGroup.position.z = THREE.MathUtils.damp(cursorGroup.position.z, smoothTargetRef.current.cursorZ, 12, dt);
        cursorRing.rotation.y += dt * 1.8;
        cursorRing.rotation.x += dt * 1.1;

        const model = runtime.model;
        if (model) {
          const activeTargetGroup = isIsolated ? runtime.isolatedHolder : model.group;
          const s = THREE.MathUtils.damp(activeTargetGroup.scale.x, smoothTargetRef.current.scale, 10, dt);
          const sy = isIsolated
            ? s
            : THREE.MathUtils.damp(
                activeTargetGroup.scale.y,
                smoothTargetRef.current.scale * smoothTargetRef.current.height,
                10,
                dt
              );
          activeTargetGroup.scale.set(s, sy, s);

          activeTargetGroup.rotation.z = THREE.MathUtils.damp(
            activeTargetGroup.rotation.z,
            smoothTargetRef.current.tiltOffset,
            8,
            dt
          );

          if (!cfg.frozen) {
            const isHandOrbiting =
              activeControl &&
              (mapped3DAction === 'orbit_rotate' || (currentGesture === 'two_hand_10' && !res.twoHandOppositeSpread && !res.twoHandMovingCloser));
            if (isHandOrbiting) {
              activeTargetGroup.rotation.y = THREE.MathUtils.damp(
                activeTargetGroup.rotation.y,
                smoothTargetRef.current.rotOffset,
                11,
                dt
              );
              activeTargetGroup.rotation.x = THREE.MathUtils.damp(
                activeTargetGroup.rotation.x,
                smoothTargetRef.current.pitchOffset,
                10,
                dt
              );
            } else if (cfg.autoSpin && (isIsolated || cfg.modeId !== 'robot_arm')) {
              activeTargetGroup.rotation.y += dt * (isIsolated ? 0.3 : 0.34) * cfg.simSpeed;
              smoothTargetRef.current.rotOffset = activeTargetGroup.rotation.y;
            }
          }

          const expTarget = smoothTargetRef.current.explode;
          if (!isIsolated) {
            for (const part of model.explodables) {
              _v3TmpB.copy(part.basePos).addScaledVector(part.explodeDir, expTarget * 2.85);
              part.mesh.position.lerp(_v3TmpB, 1 - Math.exp(-9 * dt));
            }
            if (expTarget >= 0.25 && model.explodables.length > 0) {
              const hIdx = highlightedPartIdxRef.current ?? 0;
              if (highlightedPartIdxRef.current === null && shouldPushUi) {
                setHighlightedPartIdx(0);
              }
              const hPart = model.explodables[hIdx];
              if (hPart) {
                runtime.highlightHelper.setFromObject(hPart.mesh);
                runtime.highlightHelper.visible = true;
              } else {
                runtime.highlightHelper.visible = false;
              }
            } else {
              runtime.highlightHelper.visible = false;
            }
          } else {
            runtime.highlightHelper.visible = false;
          }

          // Update 6 advanced kinetic rigs (skip IK joint clamping when viewing a single isolated robot part)
          updateAdvancedKinematics(
            model,
            dt,
            elapsed,
            cfg.simSpeed,
            cfg.heightVal,
            cfg.frozen,
            smoothTargetRef.current
              ? {
                  x: smoothTargetRef.current.cursorX,
                  y: smoothTargetRef.current.cursorY,
                  z: smoothTargetRef.current.cursorZ
                }
              : { x: 0, y: 1.5, z: 0 },
            isPinchActive,
            isIsolated
          );

          if (model.waveGeo && model.waveBaseZ && !cfg.frozen) {
            const pos = model.waveGeo.attributes.position as THREE.BufferAttribute;
            const col = model.waveGeo.attributes.color as THREE.BufferAttribute;
            const tPhase = elapsed * 2.8 * cfg.simSpeed;
            const amp = 0.28 * cfg.heightVal;
            for (let i = 0; i < pos.count; i++) {
              const x = pos.getX(i);
              const z = pos.getZ(i);
              const r1 = Math.hypot(x + 1.6, z);
              const r2 = Math.hypot(x - 1.6, z);
              const yWave =
                amp *
                (Math.sin(r1 * 3.1 - tPhase) / (1 + r1 * 0.45) +
                  Math.sin(r2 * 3.1 - tPhase) / (1 + r2 * 0.45));
              pos.setY(i, yWave);
              const normH = THREE.MathUtils.clamp((yWave + amp * 1.5) / (amp * 3), 0, 1);
              _colorTmp.setHSL(0.58 - normH * 0.42, 0.88, 0.48 + normH * 0.16);
              col.setXYZ(i, _colorTmp.r, _colorTmp.g, _colorTmp.b);
            }
            pos.needsUpdate = true;
            col.needsUpdate = true;
            model.waveGeo.computeVertexNormals();
          }

          if (model.atomElectrons && !cfg.frozen && !isIsolated) {
            for (const item of model.atomElectrons) {
              const ang = elapsed * item.speed * cfg.simSpeed + item.phase;
              _v3TmpA.set(Math.cos(ang) * item.ringRadius, Math.sin(ang) * item.ringRadius, 0);
              _eulerTmp.copy(item.tiltEuler);
              _v3TmpA.applyEuler(_eulerTmp);
              _v3TmpA.y += 2.05;
              item.mesh.position.copy(_v3TmpA);
            }
          }

          if (model.sphereCutRing) {
            const R = 1.95;
            const centerY = R + 0.15;
            const worldSliceY = smoothTargetRef.current.sliceY / Math.max(0.4, sy);
            const d = Math.abs(worldSliceY - centerY);
            if (cfg.sliceEnabled && !isIsolated && d < R * 0.98) {
              model.sphereCutRing.visible = true;
              const rCut = Math.sqrt(R * R - d * d);
              model.sphereCutRing.scale.set(rCut, rCut, 1);
              model.sphereCutRing.position.y = worldSliceY;
            } else {
              model.sphereCutRing.visible = false;
            }
          }
        }

        if (cfg.sliceEnabled && !isIsolated) {
          const yClip = THREE.MathUtils.damp(runtime.slicePlane.constant, smoothTargetRef.current.sliceY, 12, dt);
          runtime.slicePlane.constant = yClip;
          runtime.sliceHelperMesh.visible = true;
          runtime.sliceHelperMesh.position.y = yClip;
        } else {
          runtime.slicePlane.constant = 100;
          runtime.sliceHelperMesh.visible = false;
        }

        controls.update();
        renderer.render(scene, camera);
      }

      if (softwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    if (softwareGl) afterDraw(tick);
    else frameId = requestAnimationFrame(tick);

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handleCanvasPointerDown);
      renderer.domElement.removeEventListener('pointerup', handleCanvasPointerUp);
      controls.dispose();
      restoreIsolatedPart(runtime);
      disposeModel(runtime.model);
      highlightHelper.geometry.dispose();
      (highlightHelper.material as THREE.Material).dispose();
      envTarget.dispose();
      gridHelper.geometry.dispose();
      (gridHelper.material as THREE.Material).dispose();
      discGeo.dispose();
      discMat.dispose();
      sliceHelperGeo.dispose();
      sliceHelperMat.dispose();
      cursorOrb.geometry.dispose();
      (cursorOrb.material as THREE.Material).dispose();
      cursorRing.geometry.dispose();
      (cursorRing.material as THREE.Material).dispose();
      tipSensorGeo.dispose();
      tipSensorMatH1.dispose();
      tipSensorMatH2.dispose();
      runtime.strokeMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      runtime.markerMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      runtimeRef.current = null;
    };
  }, [disposeModel, onEarnXP, rebuildModel, restoreIsolatedPart, showToast]);

  useEffect(() => {
    const rt = runtimeRef.current;
    if (!rt) return;
    const softwareGl = isSoftwareWebGL();
    rebuildModel(rt, modeId, finish, activePalette, softwareGl);
  }, [modeId, finish, activePalette, rebuildModel]);

  useEffect(() => {
    syncPartIsolation(runtimeRef.current, isolatedPartIdx);
  }, [isolatedPartIdx, syncPartIsolation]);

  useEffect(() => {
    const rt = runtimeRef.current;
    if (!rt) return;
    const softwareGl = isSoftwareWebGL();
    const isLight = gestureSettings.graphicsQuality === 'light';
    rt.renderer.setPixelRatio(
      softwareGl || isLight ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio, 2)
    );
    rt.renderer.shadowMap.enabled = !softwareGl && !isLight;
  }, [gestureSettings.graphicsQuality]);

  // Resize WebGL properly whenever toggling back from Hub or 2D -> 3D
  useEffect(() => {
    if (entryView !== 'studio' || spaceMode !== '3d' || !canvasMountRef.current || !runtimeRef.current) return;
    const resizeNow = () => {
      const mount = canvasMountRef.current;
      const rt = runtimeRef.current;
      if (!mount || !rt) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      rt.camera.aspect = w / h;
      rt.camera.updateProjectionMatrix();
      rt.renderer.setSize(w, h);
    };
    resizeNow();
    const raf = requestAnimationFrame(resizeNow);
    return () => cancelAnimationFrame(raf);
  }, [entryView, spaceMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (!cameraActive || !streamRef.current || !videoRef.current) return;
    const videoEl = videoRef.current;
    if (videoEl.srcObject !== streamRef.current) {
      videoEl.srcObject = streamRef.current;
    }
    videoEl.play().catch(() => {});
  }, [cameraActive, hudHidden]);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        isEn
          ? 'Camera API unavailable. Use the touch pad or mouse directly.'
          : 'Trình duyệt không hỗ trợ Camera API. Bạn vẫn dùng được Bàn di Cử chỉ hoặc chuột trực tiếp!'
      );
      return;
    }

    setCameraLoading(true);
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false
        });
      } catch (constraintErr) {
        const name = constraintErr instanceof Error ? constraintErr.name : '';
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') throw constraintErr;
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = stream;
      setCameraActive(true);
      setCameraLoading(false);

      if (!trackerRef.current) trackerRef.current = new HandGestureTracker();
      void trackerRef.current.ensureInitialized().then((ok) => {
        if (!ok) {
          setCameraError(
            isEn
              ? 'Could not load 10-finger AI tracker model.'
              : 'Không thể tải bộ AI nhận diện 10 đầu ngón tay.'
          );
        }
      });

      showToast(
        isEn
          ? 'Camera active! Use 1 or 2 hands in both 2D & 3D spaces.'
          : 'Webcam đã bật! Dùng 1 hoặc 2 bàn tay (10 cảm biến) cho cả 2D và 3D.'
      );
    } catch (err) {
      setCameraLoading(false);
      setCameraActive(false);
      const message = err instanceof Error ? err.message : 'Permission denied';
      setCameraError(
        isEn
          ? `Camera access unavailable (${message}). Please allow Camera in browser bar.`
          : `Chưa cấp quyền Webcam (${message}). Hãy chọn "Cho phép (Allow)" trên thanh địa chỉ rồi bấm lại.`
      );
    }
  }, [isEn, showToast]);

  const handleUndoStroke = useCallback(() => {
    if (spaceMode === '2d') {
      if (mode2D === 'free_create') {
        canvas2DRef.current?.undoFreeItem();
      }
      return;
    }
    const rt = runtimeRef.current;
    if (!rt) return;
    if (rt.markerMeshes.length > 0 && (creativeBrush !== 'tube' || rt.strokeMeshes.length === 0)) {
      const m = rt.markerMeshes.pop();
      if (m) {
        rt.markersGroup.remove(m);
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
        setMarkerCount(rt.markerMeshes.length);
      }
      return;
    }
    const last = rt.strokeMeshes.pop();
    if (last) {
      rt.strokesGroup.remove(last);
      last.geometry.dispose();
      (last.material as THREE.Material).dispose();
      setStrokeCount(rt.strokeMeshes.length);
    }
  }, [creativeBrush, mode2D, spaceMode]);

  const handleClearCreations = useCallback(() => {
    if (spaceMode === '2d') {
      canvas2DRef.current?.clearCanvas();
      showToast(isEn ? 'Cleared 2D canvas.' : 'Đã làm mới bảng vẽ hình học 2D.');
      return;
    }
    const rt = runtimeRef.current;
    if (!rt) return;
    rt.strokeMeshes.forEach((m) => {
      rt.strokesGroup.remove(m);
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    });
    rt.markerMeshes.forEach((m) => {
      rt.markersGroup.remove(m);
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    });
    rt.strokeMeshes = [];
    rt.markerMeshes = [];
    setStrokeCount(0);
    setMarkerCount(0);
    showToast(isEn ? 'Cleared all Oxyz strokes & blocks.' : 'Đã xóa sạch nét vẽ & khối kiến tạo 3D.');
  }, [isEn, showToast, spaceMode]);

  const handleCyclePart = useCallback(
    (dir: -1 | 1) => {
      if (modelParts.length === 0) return;
      const now = performance.now();
      if (now - lastManualSwipeAtRef.current < 120) return;
      lastManualSwipeAtRef.current = now;
      const base =
        isolatedPartIdx !== null ? isolatedPartIdx : highlightedPartIdx ?? 0;
      const nextIdx = (base + dir + modelParts.length) % modelParts.length;
      setHighlightedPartIdx(nextIdx);
      if (isolatedPartIdx !== null) {
        setIsolatedPartIdx(nextIdx);
      }
    },
    [highlightedPartIdx, isolatedPartIdx, modelParts.length]
  );

  const handleResetView = useCallback(() => {
    if (spaceMode === '2d') {
      canvas2DRef.current?.resetBoard();
      setFrozen(false);
      showToast(isEn ? 'Reset 2D board' : 'Đã đặt lại hình học 2D');
      return;
    }
    setIsolatedPartIdx(null);
    setHighlightedPartIdx(null);
    setScaleVal(1.0);
    setHeightVal(1.0);
    setExplodeVal(0.0);
    setSliceEnabled(false);
    setSliceY(2.4);
    setSimSpeed(1.0);
    setFrozen(false);
    setAutoSpin(true);
    smoothTargetRef.current = {
      scale: 1.0,
      height: 1.0,
      explode: 0.0,
      sliceY: 2.4,
      rotOffset: 0,
      pitchOffset: 0,
      tiltOffset: 0,
      cursorX: 0,
      cursorY: 1.5,
      cursorZ: 0
    };
    if (runtimeRef.current) {
      runtimeRef.current.camera.position.set(6.4, 4.8, 7.6);
      runtimeRef.current.controls.target.set(0, 1.65, 0);
      runtimeRef.current.controls.update();
      if (runtimeRef.current.model) {
        runtimeRef.current.model.group.rotation.set(0, 0, 0);
      }
      runtimeRef.current.isolatedHolder.rotation.set(0, 0, 0);
    }
  }, [isEn, showToast, spaceMode]);

  const handleSnapshot = useCallback(() => {
    if (spaceMode === '2d') {
      canvas2DRef.current?.exportPNG();
      showToast(isEn ? 'Saved 2D geometry PNG!' : 'Đã tải ảnh hình học 2D!');
      return;
    }
    const rt = runtimeRef.current;
    if (!rt) return;
    rt.renderer.render(rt.scene, rt.camera);
    const dataUrl = rt.renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `synapse-spatial3d-${modeId}.png`;
    a.click();
    showToast(isEn ? 'Saved 3D PNG snapshot!' : 'Đã tải ảnh chụp 3D chất lượng cao!');
  }, [isEn, modeId, showToast, spaceMode]);

  const handleExportOBJ = useCallback(() => {
    const rt = runtimeRef.current;
    if (!rt) return;
    let objOutput = `# Synapse Spatial 3D Export (${modeId})\n`;
    let vertexOffset = 1;

    const appendMesh = (mesh: THREE.Mesh, name: string) => {
      const geo = mesh.geometry;
      const pos = geo.attributes.position as THREE.BufferAttribute | undefined;
      if (!pos) return;
      mesh.updateWorldMatrix(true, false);
      objOutput += `o ${name}\n`;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
        objOutput += `v ${v.x.toFixed(4)} ${v.y.toFixed(4)} ${v.z.toFixed(4)}\n`;
      }
      const index = geo.index;
      if (index) {
        for (let i = 0; i < index.count; i += 3) {
          objOutput += `f ${index.getX(i) + vertexOffset} ${index.getX(i + 1) + vertexOffset} ${index.getX(i + 2) + vertexOffset}\n`;
        }
      } else {
        for (let i = 0; i < pos.count; i += 3) {
          objOutput += `f ${i + vertexOffset} ${i + 1 + vertexOffset} ${i + 2 + vertexOffset}\n`;
        }
      }
      vertexOffset += pos.count;
    };

    let idx = 0;
    rt.rootGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) appendMesh(child, `shape_${idx++}`);
    });
    rt.strokesGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) appendMesh(child, `stroke_${idx++}`);
    });
    rt.markersGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) appendMesh(child, `block_${idx++}`);
    });

    const blob = new Blob([objOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapse-3d-${modeId}.obj`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(isEn ? 'Exported 3D .OBJ mesh!' : 'Đã xuất file mô hình 3D (.OBJ)!');
  }, [isEn, modeId, showToast]);

  const handleToggleMusic = useCallback(() => {
    if (!isBgPlaying || bgSound === 'off') {
      setBgSound('minecraft_calm');
      showToast(isEn ? 'Minecraft Calm Piano ON' : 'Đã bật Nhạc nền Minecraft Piano');
    } else {
      toggleBgPlaying();
    }
  }, [bgSound, isBgPlaying, isEn, setBgSound, showToast, toggleBgPlaying]);

  const handleToggleFullscreen = useCallback(() => {
    const el = stageContainerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'h' || e.key === 'H') setHudHidden((v) => !v);
      else if (e.key === 'r' || e.key === 'R') handleResetView();
      else if (e.code === 'Space') {
        e.preventDefault();
        setFrozen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleResetView]);

  const handlePadPointer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = THREE.MathUtils.clamp((e.clientX - rect.left) / rect.width, 0.04, 0.96);
    const ny = THREE.MathUtils.clamp((e.clientY - rect.top) / rect.height, 0.04, 0.96);
    const tx = (nx - 0.5) * 6.4;
    const ty = (1 - ny) * 3.8;
    const tz = Math.sin((nx - 0.5) * Math.PI) * 1.4;
    smoothTargetRef.current.cursorX = tx;
    smoothTargetRef.current.cursorY = ty;
    smoothTargetRef.current.cursorZ = tz;
    setOxyzCursor({ x: tx, y: ty, z: tz });
  }, []);

  const currentGestureMeta =
    GESTURE_DEFINITIONS.find(
      (g) => g.id === (cameraActive && handFrame.detected ? handFrame.gesture : virtualGesture)
    ) || GESTURE_DEFINITIONS[4];

  return (
    <>
      {entryView === 'hub' && (
        <SpatialSenseHub
          isEn={isEn}
          onBack={onBack}
          onLaunch3D={() => handleEnter3DSpace(true)}
          onLaunch2D={handleEnter2DSpace}
        />
      )}

      <div
        ref={stageContainerRef}
        className={`relative w-full overflow-hidden rounded-xl border border-sky-500/35 bg-[#050914] text-slate-100 shadow-2xl select-none ${
          entryView === 'hub'
            ? 'hidden'
            : isFullscreen
            ? 'h-screen rounded-none border-0'
            : 'h-[calc(100vh-128px)] min-h-[640px]'
        }`}
      >
        {/* Dedicated Three.js 3D Viewport */}
        <div
          ref={canvasMountRef}
          className={`absolute inset-0 w-full h-full ${spaceMode === '3d' ? 'block' : 'hidden'}`}
        />

        {/* Dedicated 2D Gesture Geometry Viewport */}
        {entryView === 'studio' && spaceMode === '2d' && (
          <div className="absolute inset-0 w-full h-full">
            <Spatial2DGestureCanvas
              ref={canvas2DRef}
              mode2D={mode2D}
              accentCss={activePalette.css}
              isEn={isEn}
              cameraActive={cameraActive}
              virtualGesture={virtualGesture}
              frozen={frozen}
              handFrameRef={handFrameRef}
              gestureSettings={gestureSettings}
              freeTool={free2DTool}
              freeColor={free2DColor}
              freeSnap={free2DSnap}
              freeAutoShape={free2DAutoShape}
              onFreeCountChange={setFree2DCount}
              onMetricsChange={setMetrics2D}
            />
          </div>
        )}

        {/* Top HUD Bar */}
        {!hudHidden && (
          <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setEntryView('hub')}
                className="cs-deck-btn flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-950/95 border border-sky-500/45 hover:border-sky-400 text-xs font-bold text-sky-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title={isEn ? 'Back to Spatial Sense Portal' : 'Về Trang Học Cảm Giác'}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isEn ? 'Portal' : 'Trang Chính'}</span>
              </button>

              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="cs-deck-btn flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-950/95 border border-slate-700/80 hover:border-sky-400 text-xs font-bold text-slate-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Back' : 'Quay lại'}</span>
                </button>
              )}

              {/* Clean 2D vs 3D Segmented Space Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950/95 border border-sky-500/40">
                <button
                  type="button"
                  onClick={() => {
                    setSpaceMode('2d');
                    setShow3DGuide(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    spaceMode === '2d'
                      ? 'bg-sky-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{isEn ? '2D Geometry' : 'Không gian 2D'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleEnter3DSpace(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    spaceMode === '3d'
                      ? 'bg-sky-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>{isEn ? '3D Realistic Studio' : 'Không gian 3D'}</span>
                </button>
              </div>

              {spaceMode === '3d' && (
                <button
                  type="button"
                  onClick={() => setShow3DGuide(true)}
                  className="cs-deck-btn flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-950/95 border border-amber-400/50 hover:border-amber-300 text-xs font-bold text-amber-200 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isEn ? '3D Guide' : 'Hướng dẫn 3D'}</span>
                </button>
              )}

              {/* Active Mode Subtitle + Gesture Status */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950/95 border border-slate-700/80 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: currentGestureMeta.accent }}
                />
                <span className="font-bold text-white whitespace-nowrap">
                  {spaceMode === '2d'
                    ? isEn
                      ? active2DMode.titleEn
                      : active2DMode.titleVi
                    : isEn
                    ? activeMode.titleEn
                    : activeMode.titleVi}
                </span>
                <span className="text-slate-400">·</span>
                <span className="font-semibold text-sky-300 whitespace-nowrap">
                  {isEn ? currentGestureMeta.labelEn : currentGestureMeta.labelVi}
                </span>
                {frozen && (
                  <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                    · <Lock className="w-3 h-3" /> {isEn ? 'Locked' : 'Khóa'}
                  </span>
                )}
              </div>
            </div>

            {/* Right Quick Actions */}
            <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
              <button
                type="button"
                onClick={cameraActive ? stopCamera : startCamera}
              disabled={cameraLoading}
              className={`cs-deck-btn flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                cameraActive
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : 'bg-sky-500 hover:bg-sky-400 border-sky-300 text-slate-950'
              }`}
            >
              {cameraActive ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
              <span>
                {cameraLoading
                  ? isEn
                    ? 'Starting...'
                    : 'Đang mở...'
                  : cameraActive
                  ? isEn
                    ? 'Stop Cam'
                    : 'Tắt Cam'
                  : isEn
                  ? 'Start Webcam'
                  : 'Bật Webcam 10 Ngón'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleToggleMusic}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md border text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                isBgPlaying && bgSound !== 'off'
                  ? 'bg-emerald-950/95 border-emerald-400/70 text-emerald-300'
                  : 'bg-slate-950/95 border-slate-700/80 text-slate-200 hover:border-sky-400'
              }`}
              title={isEn ? 'Toggle Minecraft / Study Music' : 'Bật/Tắt nhạc nền Minecraft Piano'}
            >
              {isBgPlaying && bgSound !== 'off' ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {bgSound === 'minecraft_calm' && isBgPlaying ? 'Minecraft' : isEn ? 'Music' : 'Nhạc'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFrozen((v) => !v)}
              className={`p-2 rounded-md border text-xs font-bold cursor-pointer ${
                frozen
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-950/95 border-slate-700/80 text-slate-200 hover:border-sky-400'
              }`}
              title={isEn ? 'Pause / Freeze (Space)' : 'Đóng băng / Chạy (Phím Space)'}
            >
              {frozen ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleResetView}
              className="p-2 rounded-md bg-slate-950/95 border border-slate-700/80 hover:border-sky-400 text-slate-200 cursor-pointer"
              title={isEn ? 'Reset View (R)' : 'Đặt lại góc nhìn (Phím R)'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setHudHidden(true)}
              className="p-2 rounded-md bg-slate-950/95 border border-slate-700/80 hover:border-sky-400 text-slate-200 cursor-pointer"
              title={isEn ? 'Hide HUD (H)' : 'Ẩn giao diện (Phím H)'}
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="p-2 rounded-md bg-slate-950/95 border border-slate-700/80 hover:border-sky-400 text-slate-200 cursor-pointer"
              title={isEn ? 'Fullscreen' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Restore HUD Button in Zen Mode */}
      {hudHidden && (
        <button
          type="button"
          onClick={() => setHudHidden(false)}
          className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-950/95 border border-sky-400/60 text-xs font-bold text-sky-300 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isEn ? 'Show HUD (H)' : 'Hiện Bảng Điều Khiển (H)'}</span>
        </button>
      )}

        {/* Top-Right Corner Live Telemetry & 10-Fingertip Webcam PiP */}
        {!hudHidden && (
          <div className="absolute top-16 right-3 z-20 flex flex-col items-end gap-2 max-w-[244px]">
            <div className="spatial-hud-frame w-full rounded-lg bg-slate-950/95 border border-slate-700/85 p-2.5 text-[11px] space-y-1">
              <div className="font-mono font-bold text-cyan-300 truncate">
                {spaceMode === '2d' ? active2DMode.formula : activeMode.formula}
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-slate-200 font-mono text-[10px] tabular-nums">
                <span>{liveTelemetry.metricA}</span>
                <span>·</span>
                <span>{liveTelemetry.metricB}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tabular-nums">{liveTelemetry.metricC}</div>
            </div>

            {cameraActive && (
              <div className="spatial-hud-frame relative w-[240px] h-[180px] rounded-lg overflow-hidden bg-slate-950 border-2 border-cyan-400/60 shadow-xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-fill ${mirrorCamera ? '-scale-x-100' : ''}`}
                />
                <canvas
                  ref={overlayCanvasRef}
                  width={240}
                  height={180}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
                {/* 0.5s finger-settle progress bar */}
                {handFrame.detected && handFrame.candidateGesture !== 'none' && handFrame.gestureHoldProgress < 1 && (
                  <div className="absolute top-1.5 left-1.5 right-1.5 px-2 py-1 rounded bg-slate-950/90 border border-amber-400/50 space-y-1">
                    <div className="flex items-center justify-between text-[9px] font-mono font-bold text-amber-200">
                      <span>{isEn ? 'Settling fingers (0.5s)...' : 'Đang đợi 0.5s ổn định ngón...'}</span>
                      <span>{Math.round(handFrame.gestureHoldProgress * 100)}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-[width] duration-75"
                        style={{ width: `${Math.round(handFrame.gestureHoldProgress * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between px-2 py-0.5 rounded bg-slate-950/90 text-[10px] font-mono text-cyan-200">
                  <span>
                    {!handFrame.ready
                      ? isEn
                        ? 'Loading 10-finger AI...'
                        : 'Đang nạp AI 10 ngón...'
                      : handFrame.detected
                      ? `${handFrame.trackedTipCount}/10 ${isEn ? 'tips' : 'cảm biến'} · ${handFrame.fingerCount} ${isEn ? 'open' : 'duỗi'}`
                      : isEn
                      ? 'Show 1 or 2 hands'
                      : 'Đưa 1–2 bàn tay vào'}
                  </span>
                  <span>{currentGestureMeta.fingers}</span>
                </div>
              </div>
            )}

          {/* Virtual 3D Touch Pad when in 3D without webcam */}
          {spaceMode === '3d' && !cameraActive && showVirtualPad && (
            <div className="w-[224px] rounded-2xl bg-slate-950/95 border border-slate-700/85 p-2 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
                <span className="flex items-center gap-1">
                  <Hand className="w-3 h-3 text-cyan-400" />
                  {isEn ? '3D Gesture Touch Pad' : 'Bàn Di Cử Chỉ 3D Ảo'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowVirtualPad(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  virtualPadDownRef.current = true;
                  handlePadPointer(e);
                }}
                onPointerMove={(e) => {
                  if (virtualPadDownRef.current) handlePadPointer(e);
                }}
                onPointerUp={() => {
                  virtualPadDownRef.current = false;
                }}
                onPointerCancel={() => {
                  virtualPadDownRef.current = false;
                }}
                className="relative w-full h-[108px] rounded-xl bg-slate-900 border border-cyan-500/35 cursor-crosshair overflow-hidden touch-none"
              >
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
                    backgroundSize: '18px 18px'
                  }}
                />
                <div
                  className="absolute w-3.5 h-3.5 -ml-1.5 -mt-1.5 rounded-full border-2 border-white pointer-events-none"
                  style={{
                    left: `${((oxyzCursor.x + 3.2) / 6.4) * 100}%`,
                    top: `${(1 - oxyzCursor.y / 3.8) * 100}%`,
                    backgroundColor: currentGestureMeta.accent
                  }}
                />
                <span className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-400 pointer-events-none">
                  {isEn ? 'Drag to sculpt / drive IK' : 'Kéo để vẽ / dẫn tay Robot'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top-Left Stack: Camera Warning + 3D Part Selection / Isolation Card */}
      {!hudHidden && (
        <div className="absolute top-16 left-3 z-20 flex flex-col gap-2 max-w-[320px] pointer-events-none">
          {cameraError && (
            <div className="pointer-events-auto rounded-lg bg-amber-950/95 border border-amber-500/50 px-3 py-2 text-[11px] text-amber-200">
              {cameraError}
            </div>
          )}

          {/* Case 1: Isolated Part Inspection Card */}
          {spaceMode === '3d' && isolatedPartIdx !== null && modelParts[isolatedPartIdx] && (
            <div className="spatial-hud-frame spatial-step-reveal pointer-events-auto w-[min(316px,calc(100vw-24px))] rounded-lg bg-slate-950/95 border border-cyan-400/60 shadow-2xl p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300">
                  <Info className="w-3 h-3" />
                  {isEn
                    ? `Part ${isolatedPartIdx + 1}/${modelParts.length} · ${modelParts[isolatedPartIdx].badgeEn}`
                    : `Bộ phận ${isolatedPartIdx + 1}/${modelParts.length} · ${modelParts[isolatedPartIdx].badgeVi}`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPartCardMinimized((v) => !v)}
                    className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400 cursor-pointer"
                    title={partCardMinimized ? 'Mở rộng' : 'Thu gọn'}
                  >
                    {partCardMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsolatedPartIdx(null)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-[10px] font-bold text-slate-100 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>{isEn ? 'Full Model' : 'Toàn mô hình'}</span>
                  </button>
                </div>
              </div>

              <div className="text-sm font-extrabold text-white leading-snug">
                {isEn ? modelParts[isolatedPartIdx].nameEn : modelParts[isolatedPartIdx].nameVi}
              </div>

              {!partCardMinimized && (
                <div className="space-y-1.5 text-[11px] leading-relaxed">
                  <div className="rounded bg-slate-900/90 border border-slate-800 px-2.5 py-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-cyan-300">
                      {isEn ? 'Introduction' : 'Giới thiệu cấu tạo'}
                    </div>
                    <p className="text-slate-200 mt-0.5">
                      {isEn ? modelParts[isolatedPartIdx].introEn : modelParts[isolatedPartIdx].introVi}
                    </p>
                  </div>
                  <div className="rounded bg-slate-900/90 border border-slate-800 px-2.5 py-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                      {isEn ? 'Function & Role' : 'Chức năng & Vai trò'}
                    </div>
                    <p className="text-slate-200 mt-0.5">
                      {isEn ? modelParts[isolatedPartIdx].functionEn : modelParts[isolatedPartIdx].functionVi}
                    </p>
                  </div>
                  {modelParts[isolatedPartIdx].specFormula && (
                    <div className="px-2.5 py-1 rounded bg-sky-950/70 border border-sky-500/35 font-mono text-[10px] font-bold text-sky-200">
                      {modelParts[isolatedPartIdx].specFormula}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => handleCyclePart(-1)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-[11px] font-bold text-slate-200 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Prev Part' : 'Bộ phận cũ'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCyclePart(1)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-sky-500 hover:bg-sky-400 text-[11px] font-extrabold text-slate-950 cursor-pointer"
                >
                  <span>{isEn ? 'Next Part' : 'Bộ phận tiếp'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-[10px] text-slate-400">
                {isEn
                  ? 'Swipe L/R to switch · 1 hand up zoom in · 2 hands closer zoom out · 2 fingers exit'
                  : 'Vuốt Trái/Phải đổi · Kéo 1 tay lên phóng to · 2 tay lại gần thu nhỏ · 2 ngón thoát'}
              </div>
            </div>
          )}

          {/* Case 2: Exploded Model Selector Prompt Strip */}
          {spaceMode === '3d' &&
            isolatedPartIdx === null &&
            explodeVal >= 0.25 &&
            modelParts.length > 0 && (
              <div className="spatial-hud-frame spatial-step-reveal pointer-events-auto w-[min(316px,calc(100vw-24px))] rounded-lg bg-slate-950/95 border border-emerald-400/50 shadow-xl p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-300">
                  <span>
                    {isEn
                      ? `EXPLODED · ${modelParts.length} PARTS`
                      : `ĐÃ TÁCH CẤU TRÚC · ${modelParts.length} BỘ PHẬN`}
                  </span>
                  <span>
                    {(highlightedPartIdx ?? 0) + 1}/{modelParts.length}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-white truncate">
                  {isEn
                    ? modelParts[highlightedPartIdx ?? 0].nameEn
                    : modelParts[highlightedPartIdx ?? 0].nameVi}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCyclePart(-1)}
                    className="p-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 cursor-pointer"
                    title={isEn ? 'Previous part' : 'Bộ phận trước'}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const pick = highlightedPartIdx ?? 0;
                      setHighlightedPartIdx(pick);
                      setIsolatedPartIdx(pick);
                      setPartCardMinimized(false);
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-extrabold cursor-pointer truncate"
                  >
                    {isEn ? 'Inspect Selected (2 Fingers)' : 'Xem riêng bộ phận (2 ngón)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCyclePart(1)}
                    className="p-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 cursor-pointer"
                    title={isEn ? 'Next part' : 'Bộ phận tiếp'}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-slate-400">
                  {isEn
                    ? 'Raise 2 fingers or click a part · Swipe L/R to cycle'
                    : 'Giơ 2 ngón tay (hoặc bấm vào khối) để xem riêng · Vuốt Trái/Phải chuyển'}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/95 border border-cyan-400/60 text-xs font-bold text-cyan-200 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* UNIFIED COLLAPSIBLE BOTTOM CONTROL DOCK */}
      {!hudHidden && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[min(980px,96vw)] flex flex-col items-center">
          <button
            type="button"
            onClick={() => setDockCollapsed((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-1 rounded-t-md bg-slate-950/95 border border-b-0 border-slate-700/80 text-[11px] font-bold text-slate-300 hover:text-sky-300 cursor-pointer"
          >
            {dockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>
              {dockCollapsed
                ? isEn
                  ? 'Show Controls'
                  : 'Mở Bảng Điều Chỉnh'
                : isEn
                ? 'Collapse Dock'
                : 'Thu gọn'}
            </span>
          </button>

          {!dockCollapsed && (
            <div className="spatial-hud-frame w-full rounded-xl bg-slate-950/95 border border-slate-700/85 shadow-2xl p-3 space-y-2.5">
              {/* Dock Tabs + Quick Action Shortcuts */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      {
                        id: 'shapes',
                        labelVi: spaceMode === '2d' ? '7 Xưởng Hình Học 2D' : '15 Mô Hình 3D',
                        labelEn: spaceMode === '2d' ? '7 2D Labs' : '15 3D Models',
                        icon: Box
                      },
                      { id: 'gesture', labelVi: '8 Cử Chỉ Tay', labelEn: '8 Gestures', icon: Hand },
                      {
                        id: 'params',
                        labelVi: spaceMode === '2d' ? 'Công Cụ 2D' : 'Sáng Tạo & Cắt',
                        labelEn: spaceMode === '2d' ? '2D Tools' : 'Sculpt & Cut',
                        icon: Sliders
                      },
                      { id: 'settings', labelVi: 'Cài Đặt Cảm Biến & Phím', labelEn: 'Sensor & Action Map', icon: Settings2 },
                      { id: 'style', labelVi: 'Chất Liệu & Xuất', labelEn: 'Finish & Export', icon: Sparkles }
                    ] as const
                  ).map((tab) => {
                    const Icon = tab.icon;
                    const active = dockTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setDockTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-sky-500 text-slate-950'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{isEn ? tab.labelEn : tab.labelVi}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Creation & Undo Shortcuts */}
                <div className="flex items-center gap-1.5">
                  {spaceMode === '2d' && mode2D === 'free_create' && (
                    <button
                      type="button"
                      onClick={handleUndoStroke}
                      disabled={free2DCount === 0}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900 border border-cyan-500/40 disabled:opacity-40 text-[11px] font-bold text-cyan-300 hover:border-cyan-400 cursor-pointer"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>{isEn ? `Undo (${free2DCount})` : `Hoàn tác (${free2DCount})`}</span>
                    </button>
                  )}
                  {spaceMode === '2d' && mode2D === 'polygon_euler' && (
                    <button
                      type="button"
                      onClick={() => canvas2DRef.current?.addVertexOrTile()}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900 border border-cyan-500/40 text-[11px] font-bold text-cyan-300 hover:border-cyan-400 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Add Vertex' : 'Thêm Đỉnh'}</span>
                    </button>
                  )}
                  {spaceMode === '2d' && mode2D === 'symmetry_kaleido' && (
                    <button
                      type="button"
                      onClick={() => canvas2DRef.current?.cycleSymmetry()}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900 border border-cyan-500/40 text-[11px] font-bold text-cyan-300 hover:border-cyan-400 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Cycle Axes' : 'Đổi Số Cánh'}</span>
                    </button>
                  )}
                  {spaceMode === '3d' && !cameraActive && !showVirtualPad && (
                    <button
                      type="button"
                      onClick={() => setShowVirtualPad(true)}
                      className="px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-[11px] font-bold text-cyan-300 cursor-pointer"
                    >
                      {isEn ? 'Touch Pad' : 'Bàn Di 3D'}
                    </button>
                  )}
                  {spaceMode === '3d' && (
                    <button
                      type="button"
                      onClick={handleUndoStroke}
                      disabled={strokeCount === 0 && markerCount === 0}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700 disabled:opacity-40 text-[11px] font-bold text-slate-200 hover:border-cyan-400 cursor-pointer"
                      title={isEn ? 'Undo last stroke/block' : 'Hoàn tác nét/khối 3D'}
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>{strokeCount + markerCount > 0 ? `(${strokeCount + markerCount})` : ''}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleClearCreations}
                    disabled={
                      spaceMode === '3d'
                        ? strokeCount === 0 && markerCount === 0
                        : mode2D === 'free_create' && free2DCount === 0
                    }
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700 disabled:opacity-40 text-[11px] font-bold text-rose-300 hover:border-rose-400 cursor-pointer"
                    title={isEn ? 'Clear drawings' : 'Xóa nét vẽ'}
                  >
                    <Eraser className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* TAB: SHAPES / CREATIONS (2D or 3D) */}
              {dockTab === 'shapes' && spaceMode === '2d' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
                    {SPATIAL_2D_MODES.map((m) => {
                      const active = mode2D === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMode2D(m.id)}
                          className={`text-left p-2 rounded-md border transition-all cursor-pointer ${
                            active
                              ? 'bg-sky-500/20 border-sky-400 text-white'
                              : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <div className="text-[9px] font-mono text-cyan-300">{m.badge}</div>
                          <div className="text-[11px] font-bold mt-0.5 truncate">
                            {isEn ? m.titleEn : m.titleVi}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {mode2D === 'free_create' ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 px-2.5 py-2 rounded-md border border-slate-800 text-[11px]">
                      <div className="flex flex-wrap items-center gap-1">
                        {(
                          [
                            { id: 'freehand', vi: 'Vẽ tay', en: 'Freehand', icon: PenTool },
                            { id: 'line', vi: 'Đoạn thẳng', en: 'Line', icon: Minus },
                            { id: 'circle', vi: 'Hình tròn', en: 'Circle', icon: Circle },
                            { id: 'rect', vi: 'Vuông / CN', en: 'Rect', icon: Square },
                            { id: 'triangle', vi: 'Tam giác', en: 'Triangle', icon: Triangle },
                            { id: 'star', vi: 'Ngôi sao', en: 'Star', icon: Star },
                            { id: 'move', vi: 'Di chuyển', en: 'Move', icon: Move }
                          ] as const
                        ).map((tool) => {
                          const ToolIcon = tool.icon;
                          const active = free2DTool === tool.id;
                          return (
                            <button
                              key={tool.id}
                              type="button"
                              onClick={() => setFree2DTool(tool.id)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-md border font-bold cursor-pointer ${
                                active
                                  ? 'bg-sky-500 text-slate-950 border-sky-300'
                                  : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-sky-400'
                              }`}
                            >
                              <ToolIcon className="w-3 h-3" />
                              <span>{isEn ? tool.en : tool.vi}</span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {['#22d3ee', '#34d399', '#fbbf24', '#f472b6', '#818cf8', '#f8fafc'].map((col) => (
                          <button
                            key={col}
                            type="button"
                            data-circle="true"
                            onClick={() => setFree2DColor(col)}
                            className={`w-4 h-4 rounded-full border cursor-pointer ${
                              free2DColor === col ? 'border-white scale-115' : 'border-slate-700'
                            }`}
                            style={{ backgroundColor: col }}
                            title={col}
                          />
                        ))}
                        <button
                          type="button"
                          onClick={() => setFree2DAutoShape((v) => !v)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md border font-bold cursor-pointer ${
                            free2DAutoShape
                              ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                              : 'bg-slate-950 border-slate-700 text-slate-400'
                          }`}
                        >
                          <Wand2 className="w-3 h-3" />
                          <span>{isEn ? 'Auto Shape' : 'Tự nắn nét'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFree2DSnap((v) => !v)}
                          className={`px-2 py-1 rounded-md border font-bold cursor-pointer ${
                            free2DSnap
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-slate-950 border-slate-700 text-slate-400'
                          }`}
                        >
                          {isEn ? 'Grid Snap' : 'Bắt lưới'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-300 px-1">
                      {isEn ? active2DMode.descEn : active2DMode.descVi}
                    </div>
                  )}
                </div>
              )}

              {dockTab === 'shapes' && spaceMode === '3d' && (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1">
                      {(
                        [
                          { id: 'all', labelVi: 'Tất cả (15)', labelEn: 'All (15)' },
                          { id: 'realistic', labelVi: 'Thực tế & Tiên tiến (6)', labelEn: 'Realistic & Tech (6)' },
                          { id: 'geometry', labelVi: 'Hình học & Sáng tạo (6)', labelEn: 'Geometry & Sculpt (6)' },
                          { id: 'simulation', labelVi: 'Vật lí & Sinh học (3)', labelEn: 'Science Sims (3)' }
                        ] as const
                      ).map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setShapeFilter(cat.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                            shapeFilter === cat.id
                              ? 'bg-slate-800 text-cyan-300 border border-cyan-500/50'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {isEn ? cat.labelEn : cat.labelVi}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 truncate max-w-md">
                      {isEn ? activeMode.descEn : activeMode.descVi}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 max-h-[146px] overflow-y-auto pr-0.5">
                    {filtered3DModes.map((m) => {
                      const active = modeId === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setModeId(m.id)}
                          className={`text-left p-2 rounded-md border transition-all cursor-pointer ${
                            active
                              ? 'bg-sky-500/20 border-sky-400 text-white'
                              : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[9px] font-mono">
                            <span
                              className={
                                m.group === 'realistic'
                                  ? 'text-amber-300'
                                  : m.group === 'geometry'
                                  ? 'text-sky-300'
                                  : 'text-emerald-300'
                              }
                            >
                              {m.badge}
                            </span>
                          </div>
                          <div className="text-[11px] font-bold mt-0.5 truncate">
                            {isEn ? m.titleEn : m.titleVi}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB: 8 HAND GESTURES & CAMERA TUNING */}
              {dockTab === 'gesture' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
                    {GESTURE_DEFINITIONS.map((g) => {
                      const active =
                        (cameraActive && handFrame.detected ? handFrame.gesture : virtualGesture) === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            setVirtualGesture(g.id);
                            if (g.id === 'two_hand_10' && spaceMode === '3d') {
                              setExplodeVal((prev) => (prev >= 0.3 ? 0.0 : 1.35));
                            } else if (g.id === 'reassemble_4' && spaceMode === '3d') {
                              smoothTargetRef.current.explode = 0;
                              setExplodeVal(0);
                              setIsolatedPartIdx(null);
                              setHighlightedPartIdx(null);
                              showToast(
                                isEn
                                  ? '4 Fingers · Reassembled full 3D model!'
                                  : '4 Ngón · Đã ghép mô hình về nguyên trạng!'
                              );
                            } else if (g.id === 'morph_3' && spaceMode === '2d') {
                              canvas2DRef.current?.cycleSymmetry();
                            } else if (g.id === 'slice_2' && spaceMode === '3d') {
                              if (explodeVal >= 0.25 || isolatedPartIdx !== null) {
                                setIsolatedPartIdx((prev) =>
                                  prev !== null ? null : highlightedPartIdx ?? 0
                                );
                              } else {
                                setSliceEnabled(true);
                              }
                            } else if (g.id === 'fist_0') {
                              setFrozen((v) => !v);
                            }
                          }}
                          className={`text-left p-2 rounded-md border transition-all cursor-pointer ${
                            active
                              ? 'bg-slate-800 border-sky-400 text-white'
                              : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-extrabold">
                            <span style={{ color: g.accent }}>{g.fingers} {isEn ? 'Finger' : 'Ngón'}</span>
                            {active && <span className="text-[9px] text-cyan-300">ACTIVE</span>}
                          </div>
                          <div className="text-[11px] font-bold mt-0.5 truncate">
                            {isEn ? g.labelEn.split('·')[1] : g.labelVi.split('·')[1]}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 items-center text-[11px]">
                    <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
                      <span className="text-slate-300 font-semibold">
                        {isEn ? 'Pinch Sensitivity' : 'Độ nhạy Chụm'} ({gestureSettings.pinchSensitivity.toFixed(2)}x)
                      </span>
                      <input
                        type="range"
                        min={0.6}
                        max={1.6}
                        step={0.05}
                        value={gestureSettings.pinchSensitivity}
                        onChange={(e) => updateGestureSetting('pinchSensitivity', Number(e.target.value))}
                        className="w-24 accent-cyan-400"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
                      <span className="text-slate-300 font-semibold">
                        {isEn ? '10-Tip Smoothing' : 'Độ mượt 10 Ngón'} ({Math.round(gestureSettings.smoothing * 100)}%)
                      </span>
                      <input
                        type="range"
                        min={0.1}
                        max={0.9}
                        step={0.05}
                        value={gestureSettings.smoothing}
                        onChange={(e) => updateGestureSetting('smoothing', Number(e.target.value))}
                        className="w-24 accent-cyan-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateGestureSetting('mirrorCamera', !gestureSettings.mirrorCamera)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-bold cursor-pointer ${
                          gestureSettings.mirrorCamera
                            ? 'bg-cyan-500/15 border-cyan-400/60 text-cyan-300'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}
                      >
                        <FlipHorizontal className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Mirror' : 'Lật Gương'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          trackerRef.current?.resetSmoothing();
                          showToast(isEn ? 'Reset 10-finger tracker lock' : 'Đã đặt lại khóa 10 đầu ngón');
                        }}
                        className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-300 cursor-pointer"
                      >
                        {isEn ? 'Reset Lock' : 'Reset Khóa'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDockTab('settings')}
                        className="px-3 py-1.5 rounded-md bg-sky-500/15 border border-sky-400/60 text-xs font-bold text-sky-300 hover:bg-sky-500/25 cursor-pointer"
                      >
                        {isEn ? 'Tune All' : 'Cài đặt sâu'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: FULL SENSOR SENSITIVITY, HAND MODE & CUSTOM ACTION REMAPPING */}
              {dockTab === 'settings' && (
                <div className="space-y-2.5 max-h-[210px] overflow-y-auto pr-1 text-[11px]">
                  {/* Presets & Reset */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 px-3 py-2 rounded-md border border-slate-800">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-bold text-slate-300 mr-1">
                        {isEn ? 'Quick Presets:' : 'Cấu hình nhanh:'}
                      </span>
                      {GESTURE_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setGestureSettings((prev) => ({ ...prev, ...preset.patch }));
                            showToast(
                              isEn ? `Applied preset: ${preset.labelEn}` : `Đã áp dụng: ${preset.labelVi}`
                            );
                          }}
                          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-sky-500/20 border border-slate-700 hover:border-sky-400 text-slate-200 font-semibold cursor-pointer"
                          title={isEn ? preset.descEn : preset.descVi}
                        >
                          {isEn ? preset.labelEn : preset.labelVi}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setGestureSettings(DEFAULT_GESTURE_SETTINGS);
                        trackerRef.current?.resetSmoothing();
                        showToast(isEn ? 'Restored defaults' : 'Đã khôi phục mặc định');
                      }}
                      className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 hover:border-rose-400 text-rose-300 font-bold cursor-pointer"
                    >
                      {isEn ? 'Reset Defaults' : 'Mặc định'}
                    </button>
                  </div>

                  {/* Hand Mode, Pointer Source, FPS, Graphics Quality & Axes Invert */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 space-y-1">
                      <label className="block font-bold text-slate-300">
                        {isEn ? 'Hand Tracking Mode' : 'Phương thức tay'}
                      </label>
                      <select
                        value={gestureSettings.handMode}
                        onChange={(e) => updateGestureSetting('handMode', e.target.value as HandControlMode)}
                        className="w-full px-2 py-1 rounded-md bg-slate-950 border border-slate-700 text-slate-100 font-semibold"
                      >
                        <option value="auto">{isEn ? 'Auto (1–2 Hands)' : 'Tự động (1 hoặc 2 tay)'}</option>
                        <option value="right_only">{isEn ? 'Right Hand Only' : 'Chỉ dùng Tay Phải'}</option>
                        <option value="left_only">{isEn ? 'Left Hand Only' : 'Chỉ dùng Tay Trái'}</option>
                        <option value="two_hands_split">{isEn ? '2 Hands Split Control' : '2 Tay Tách Độc Lập'}</option>
                      </select>
                    </div>

                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 space-y-1">
                      <label className="block font-bold text-slate-300">
                        {isEn ? 'Pointer Anchor' : 'Điểm neo con trỏ'}
                      </label>
                      <select
                        value={gestureSettings.pointerSource}
                        onChange={(e) => updateGestureSetting('pointerSource', e.target.value as PointerSource)}
                        className="w-full px-2 py-1 rounded-md bg-slate-950 border border-slate-700 text-slate-100 font-semibold"
                      >
                        <option value="index">{isEn ? 'Index Fingertip (#2)' : 'Đầu ngón Trỏ'}</option>
                        <option value="middle">{isEn ? 'Middle Fingertip (#3)' : 'Đầu ngón Giữa'}</option>
                        <option value="pinch_mid">{isEn ? 'Pinch Midpoint (Thumb-Index)' : 'Trung điểm Cái–Trỏ'}</option>
                        <option value="palm_center">{isEn ? 'Palm Center' : 'Tâm Lòng Bàn Tay'}</option>
                      </select>
                    </div>

                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 space-y-1">
                      <label className="block font-bold text-slate-300">
                        {isEn ? 'AI Camera Rate' : 'Tần số quét Camera AI'}
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {([12, 20, 30] as const).map((fps) => (
                          <button
                            key={fps}
                            type="button"
                            onClick={() => updateGestureSetting('trackingFps', fps)}
                            className={`py-1 rounded-md border font-bold cursor-pointer ${
                              gestureSettings.trackingFps === fps
                                ? 'bg-sky-500 text-slate-950 border-sky-300'
                                : 'bg-slate-950 border-slate-700 text-slate-300'
                            }`}
                          >
                            {fps} FPS
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 space-y-1">
                      <label className="block font-bold text-slate-300">
                        {isEn ? '3D Graphics Quality' : 'Chất lượng đồ họa 3D'}
                      </label>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => updateGestureSetting('graphicsQuality', 'light')}
                          className={`py-1 rounded-md border font-bold cursor-pointer ${
                            gestureSettings.graphicsQuality === 'light'
                              ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                              : 'bg-slate-950 border-slate-700 text-slate-300'
                          }`}
                        >
                          {isEn ? 'Smooth FPS' : 'Nhẹ (Mượt)'}
                        </button>
                        <button
                          type="button"
                          onClick={() => updateGestureSetting('graphicsQuality', 'high')}
                          className={`py-1 rounded-md border font-bold cursor-pointer ${
                            gestureSettings.graphicsQuality === 'high'
                              ? 'bg-sky-500 text-slate-950 border-sky-300'
                              : 'bg-slate-950 border-slate-700 text-slate-300'
                          }`}
                        >
                          {isEn ? 'High Detail' : 'Sắc nét'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Precision Sensitivity & Stability Sliders */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>{isEn ? 'X Sensitivity' : 'Độ nhạy Ngang X'}</span>
                        <span className="font-mono text-cyan-300">{gestureSettings.sensitivityX.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={2.0}
                        step={0.05}
                        value={gestureSettings.sensitivityX}
                        onChange={(e) => updateGestureSetting('sensitivityX', Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>{isEn ? 'Y Sensitivity' : 'Độ nhạy Dọc Y'}</span>
                        <span className="font-mono text-cyan-300">{gestureSettings.sensitivityY.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={2.0}
                        step={0.05}
                        value={gestureSettings.sensitivityY}
                        onChange={(e) => updateGestureSetting('sensitivityY', Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>{isEn ? 'Pinch Trigger' : 'Độ nhạy Chụm'}</span>
                        <span className="font-mono text-amber-300">{gestureSettings.pinchSensitivity.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min={0.6}
                        max={1.6}
                        step={0.05}
                        value={gestureSettings.pinchSensitivity}
                        onChange={(e) => updateGestureSetting('pinchSensitivity', Number(e.target.value))}
                        className="w-full accent-amber-400"
                      />
                    </div>

                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>{isEn ? 'Extend Threshold' : 'Độ nhạy Duỗi Ngón'}</span>
                        <span className="font-mono text-emerald-300">{gestureSettings.fingerExtendSensitivity.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min={0.6}
                        max={1.5}
                        step={0.05}
                        value={gestureSettings.fingerExtendSensitivity}
                        onChange={(e) => updateGestureSetting('fingerExtendSensitivity', Number(e.target.value))}
                        className="w-full accent-emerald-400"
                      />
                    </div>

                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>{isEn ? 'Smoothing' : 'Độ mượt chuyển động'}</span>
                        <span className="font-mono text-sky-300">{Math.round(gestureSettings.smoothing * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0.1}
                        max={0.9}
                        step={0.05}
                        value={gestureSettings.smoothing}
                        onChange={(e) => updateGestureSetting('smoothing', Number(e.target.value))}
                        className="w-full accent-sky-400"
                      />
                    </div>

                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>{isEn ? 'Deadzone' : 'Vùng chết chống rung'}</span>
                        <span className="font-mono text-sky-300">{(gestureSettings.deadzone * 100).toFixed(1)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={0.04}
                        step={0.002}
                        value={gestureSettings.deadzone}
                        onChange={(e) => updateGestureSetting('deadzone', Number(e.target.value))}
                        className="w-full accent-sky-400"
                      />
                    </div>

                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>{isEn ? '3D Rotation Speed' : 'Độ nhạy Xoay 3D'}</span>
                        <span className="font-mono text-cyan-300">{gestureSettings.rotationSensitivity.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min={1.0}
                        max={4.0}
                        step={0.1}
                        value={gestureSettings.rotationSensitivity}
                        onChange={(e) => updateGestureSetting('rotationSensitivity', Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>{isEn ? 'Hold Frames' : 'Số khung ổn định'}</span>
                        <span className="font-mono text-purple-300">{gestureSettings.stabilityFrames}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={8}
                        step={1}
                        value={gestureSettings.stabilityFrames}
                        onChange={(e) => updateGestureSetting('stabilityFrames', Number(e.target.value))}
                        className="w-full accent-purple-400"
                      />
                    </div>

                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>{isEn ? 'Finger Settle Delay' : 'Đợi ngón ổn định'}</span>
                        <span className="font-mono text-amber-300">{(gestureSettings.gestureHoldMs / 1000).toFixed(2)}s</span>
                      </div>
                      <input
                        type="range"
                        min={200}
                        max={1000}
                        step={50}
                        value={gestureSettings.gestureHoldMs}
                        onChange={(e) => updateGestureSetting('gestureHoldMs', Number(e.target.value))}
                        className="w-full accent-amber-400"
                      />
                    </div>

                    <div className="bg-slate-900 p-2 rounded-md border border-slate-800 flex flex-col justify-between gap-1">
                      <span className="font-semibold text-slate-300">{isEn ? 'Axis & Mirror' : 'Đảo trục & Gương'}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateGestureSetting('mirrorCamera', !gestureSettings.mirrorCamera)}
                          className={`flex-1 py-1 rounded-md border font-bold cursor-pointer ${
                            gestureSettings.mirrorCamera
                              ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                              : 'bg-slate-950 border-slate-700 text-slate-400'
                          }`}
                        >
                          {isEn ? 'Mir' : 'Gương'}
                        </button>
                        <button
                          type="button"
                          onClick={() => updateGestureSetting('invertX', !gestureSettings.invertX)}
                          className={`flex-1 py-1 rounded-md border font-bold cursor-pointer ${
                            gestureSettings.invertX
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-slate-950 border-slate-700 text-slate-400'
                          }`}
                        >
                          Đảo X
                        </button>
                        <button
                          type="button"
                          onClick={() => updateGestureSetting('invertY', !gestureSettings.invertY)}
                          className={`flex-1 py-1 rounded-md border font-bold cursor-pointer ${
                            gestureSettings.invertY
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-slate-950 border-slate-700 text-slate-400'
                          }`}
                        >
                          Đảo Y
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Per-Gesture Custom Action Remapping Table */}
                  <div className="bg-slate-900 p-2.5 rounded-md border border-slate-800 space-y-2">
                    <div className="font-bold text-slate-200">
                      {isEn
                        ? 'Custom Gesture Action Mapping (Per-Operation Preference)'
                        : 'Gán chức năng tùy chỉnh cho từng thao tác tay (3D & 2D)'}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {GESTURE_DEFINITIONS.map((g) => (
                        <div
                          key={g.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-slate-950/90 px-2.5 py-1.5 rounded-md border border-slate-800"
                        >
                          <div className="flex items-center gap-1.5 min-w-[140px]">
                            <span
                              className="w-2 h-2 rounded-xs shrink-0"
                              style={{ backgroundColor: g.accent }}
                            />
                            <span className="font-bold text-slate-200 truncate">
                              {isEn ? g.labelEn.split('·')[0] : g.labelVi.split('·')[0]}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-1">
                            <select
                              value={gestureSettings.gestureActions3D[g.id]}
                              onChange={(e) => {
                                const val = e.target.value as GestureAction3D;
                                setGestureSettings((prev) => ({
                                  ...prev,
                                  gestureActions3D: { ...prev.gestureActions3D, [g.id]: val }
                                }));
                              }}
                              aria-label={`3D action for ${g.id}`}
                              className="flex-1 min-w-0 px-1.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-sky-200 text-[10px] font-semibold"
                            >
                              {ACTION_3D_OPTIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  3D: {isEn ? opt.labelEn : opt.labelVi}
                                </option>
                              ))}
                            </select>
                            <select
                              value={gestureSettings.gestureActions2D[g.id]}
                              onChange={(e) => {
                                const val = e.target.value as GestureAction2D;
                                setGestureSettings((prev) => ({
                                  ...prev,
                                  gestureActions2D: { ...prev.gestureActions2D, [g.id]: val }
                                }));
                              }}
                              aria-label={`2D action for ${g.id}`}
                              className="flex-1 min-w-0 px-1.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-emerald-200 text-[10px] font-semibold"
                            >
                              {ACTION_2D_OPTIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  2D: {isEn ? opt.labelEn : opt.labelVi}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PARAMS, 3D CREATIVE BRUSH & SLICING */}
              {dockTab === 'params' && spaceMode === '3d' && (
                <div className="space-y-2.5 text-[11px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>{isEn ? 'Scale (1 Hand Up / 2 Closer)' : 'Phóng to / Thu nhỏ'}</span>
                        <span className="font-mono text-cyan-300">{scaleVal.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min={0.42}
                        max={2.45}
                        step={0.05}
                        value={scaleVal}
                        onChange={(e) => setScaleVal(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>{isEn ? 'RPM / Wind / Height' : 'Tốc độ Tua / Biên độ'}</span>
                        <span className="font-mono text-amber-300">{heightVal.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={1.85}
                        step={0.05}
                        value={heightVal}
                        onChange={(e) => setHeightVal(Number(e.target.value))}
                        className="w-full accent-amber-400"
                      />
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>{isEn ? 'Explode Structure (2H L/R)' : 'Tách Cấu Trúc (Kéo 2 tay)'}</span>
                        <span className="font-mono text-emerald-300">{Math.round(explodeVal * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1.85}
                        step={0.05}
                        value={explodeVal}
                        onChange={(e) => setExplodeVal(Number(e.target.value))}
                        className="w-full accent-emerald-400"
                      />
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-200">
                        <button
                          type="button"
                          onClick={() => setSliceEnabled((v) => !v)}
                          className={`flex items-center gap-1 cursor-pointer ${
                            sliceEnabled ? 'text-teal-300' : 'text-slate-400'
                          }`}
                        >
                          <Scissors className="w-3.5 h-3.5" />
                          <span>{sliceEnabled ? (isEn ? 'Slice ON' : 'Mặt Cắt BẬT') : isEn ? 'Slice OFF' : 'Mặt Cắt TẮT'}</span>
                        </button>
                        <span className="font-mono text-teal-300">{sliceY.toFixed(2)}m</span>
                      </div>
                      <input
                        type="range"
                        min={0.15}
                        max={4.1}
                        step={0.05}
                        value={sliceY}
                        onChange={(e) => {
                          if (!sliceEnabled) setSliceEnabled(true);
                          setSliceY(Number(e.target.value));
                        }}
                        className="w-full accent-teal-400"
                      />
                    </div>
                  </div>

                  {/* 3D Pinch Creative Stamp Brush Selector */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-300">
                      {isEn ? 'Pinch 3D Stamp Shape:' : 'Cọ Sáng Tạo Khi Chụm Ngón:'}
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {BRUSH_OPTIONS.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setCreativeBrush(b.id)}
                          className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                            creativeBrush === b.id
                              ? 'bg-cyan-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          {isEn ? b.labelEn : b.labelVi}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSnapGrid((v) => !v)}
                        className={`ml-2 px-2.5 py-1 rounded-md border font-bold cursor-pointer ${
                          snapGrid
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {isEn ? 'Snap Grid 0.45m' : 'Bắt Lưới 0.45m'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {dockTab === 'params' && spaceMode === '2d' && mode2D === 'free_create' && (
                <div className="space-y-2 text-[11px] bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1">
                      {(
                        [
                          { id: 'freehand', vi: 'Vẽ tay tự do', en: 'Freehand', icon: PenTool },
                          { id: 'line', vi: 'Đoạn thẳng', en: 'Line', icon: Minus },
                          { id: 'circle', vi: 'Hình tròn', en: 'Circle', icon: Circle },
                          { id: 'rect', vi: 'Chữ nhật / Vuông', en: 'Rectangle', icon: Square },
                          { id: 'triangle', vi: 'Tam giác', en: 'Triangle', icon: Triangle },
                          { id: 'star', vi: 'Ngôi sao 5 cánh', en: '5-Point Star', icon: Star },
                          { id: 'move', vi: 'Di chuyển hình', en: 'Move Shape', icon: Move }
                        ] as const
                      ).map((tool) => {
                        const ToolIcon = tool.icon;
                        const active = free2DTool === tool.id;
                        return (
                          <button
                            key={tool.id}
                            type="button"
                            onClick={() => setFree2DTool(tool.id)}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md border font-bold cursor-pointer ${
                              active
                                ? 'bg-sky-500 text-slate-950 border-sky-300'
                                : 'bg-slate-950 border-slate-700 text-slate-200 hover:border-sky-400'
                            }`}
                          >
                            <ToolIcon className="w-3.5 h-3.5" />
                            <span>{isEn ? tool.en : tool.vi}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {['#22d3ee', '#34d399', '#fbbf24', '#f472b6', '#818cf8', '#f8fafc'].map((col) => (
                        <button
                          key={col}
                          type="button"
                          data-circle="true"
                          onClick={() => setFree2DColor(col)}
                          className={`w-5 h-5 rounded-full border cursor-pointer ${
                            free2DColor === col ? 'border-white scale-110' : 'border-slate-700'
                          }`}
                          style={{ backgroundColor: col }}
                          title={col}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFree2DAutoShape((v) => !v)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md border font-bold cursor-pointer ${
                          free2DAutoShape
                            ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                            : 'bg-slate-950 border-slate-700 text-slate-300'
                        }`}
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Smart Shape Snap' : 'Tự nhận diện & nắn nét đẹp'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFree2DSnap((v) => !v)}
                        className={`px-2.5 py-1.5 rounded-md border font-bold cursor-pointer ${
                          free2DSnap
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-slate-950 border-slate-700 text-slate-300'
                        }`}
                      >
                        {isEn ? 'Grid Snap (0.5u)' : 'Bắt lưới tọa độ (0.5đv)'}
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleUndoStroke}
                        disabled={free2DCount === 0}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 border border-slate-700 disabled:opacity-40 text-slate-200 font-bold cursor-pointer"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Undo' : 'Hoàn tác'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleClearCreations}
                        disabled={free2DCount === 0}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 border border-slate-700 disabled:opacity-40 text-rose-300 font-bold cursor-pointer"
                      >
                        <Eraser className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Clear All' : 'Xóa hết'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {dockTab === 'params' && spaceMode === '2d' && mode2D !== 'free_create' && (
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-300">
                    {isEn ? active2DMode.descEn : active2DMode.descVi}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => canvas2DRef.current?.addVertexOrTile()}
                      className="px-3 py-1.5 rounded-md bg-cyan-500 text-slate-950 font-bold cursor-pointer"
                    >
                      {mode2D === 'tangram_build'
                        ? isEn
                          ? 'Reset Tangram Tiles'
                          : 'Xếp lại 7 mảnh Tangram'
                        : isEn
                        ? 'Add Vertex / Point'
                        : 'Thêm Đỉnh Đa Giác'}
                    </button>
                    <button
                      type="button"
                      onClick={() => canvas2DRef.current?.cycleSymmetry()}
                      className="px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-cyan-300 font-bold cursor-pointer"
                    >
                      {isEn ? 'Cycle Radial Symmetry' : 'Đổi Bậc Đối Xứng (4/6/8/12)'}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetView}
                      className="px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 font-bold cursor-pointer"
                    >
                      {isEn ? 'Reset 2D Board' : 'Đặt Lại Bảng 2D'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: FINISH, COLORS, AXES & EXPORT */}
              {dockTab === 'style' && (
                <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
                  {spaceMode === '3d' && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {FINISH_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setFinish(opt.id)}
                          className={`px-3 py-1.5 rounded-md border font-bold cursor-pointer ${
                            finish === opt.id
                              ? 'bg-sky-500 text-slate-950 border-sky-300'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          {isEn ? opt.labelEn : opt.labelVi}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    {ACCENT_PALETTES.map((pal) => (
                      <button
                        key={pal.id}
                        type="button"
                        data-circle="true"
                        onClick={() => setPaletteId(pal.id)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                          paletteId === pal.id ? 'border-white scale-110' : 'border-slate-700'
                        }`}
                        style={{ backgroundColor: pal.css }}
                        title={pal.label}
                      />
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {spaceMode === '3d' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setShowAxes((v) => !v)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md border font-bold cursor-pointer ${
                            showAxes
                              ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <Grid className="w-3.5 h-3.5" />
                          <span>Oxyz</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAutoSpin((v) => !v)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md border font-bold cursor-pointer ${
                            autoSpin
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <Orbit className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Spin' : 'Xoay'}</span>
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={handleSnapshot}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-sky-400 text-slate-100 font-bold cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-sky-300" />
                      <span>PNG</span>
                    </button>

                    {spaceMode === '3d' && (
                      <button
                        type="button"
                        onClick={handleExportOBJ}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-sky-400 text-slate-100 font-bold cursor-pointer"
                      >
                        <FileDown className="w-3.5 h-3.5 text-amber-300" />
                        <span>.OBJ</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      </div>

      {/* Flashy Animated 3D Usage Guide Frame when entering / clicking Không gian 3D */}
      <Spatial3DGuideModal
        isOpen={entryView === 'studio' && spaceMode === '3d' && show3DGuide}
        isEn={isEn}
        autoShowOn3D={autoShow3DGuide}
        onToggleAutoShow={setAutoShow3DGuide}
        onClose={() => setShow3DGuide(false)}
        onSwitchTo2D={() => {
          setShow3DGuide(false);
          handleEnter2DSpace();
        }}
      />
    </>
  );
};
