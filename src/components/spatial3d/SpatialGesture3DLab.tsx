import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ArrowLeft,
  Box,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Eraser,
  Eye,
  EyeOff,
  FileDown,
  FlipHorizontal,
  Grid,
  Hand,
  Lock,
  Maximize2,
  Minimize2,
  Orbit,
  Pause,
  Play,
  RotateCcw,
  Scissors,
  Sliders,
  Sparkles,
  Undo2,
  Video,
  VideoOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { SubjectType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import {
  GESTURE_DEFINITIONS,
  HandGestureId,
  HandGestureTracker,
  HandTrackingFrame
} from './handGestureTracker';

export type SpatialModeId =
  | 'pyramid'
  | 'prism'
  | 'cone_conic'
  | 'platonic'
  | 'sphere_slice'
  | 'freehand_oxyz'
  | 'wave_surface'
  | 'quantum_atom'
  | 'math_saddle'
  | 'dna_helix';

export type MaterialFinishId = 'ceramic' | 'crystal' | 'wireframe' | 'gold';
type DockTabId = 'gesture' | 'shapes' | 'params' | 'style';

interface SpatialModeMeta {
  id: SpatialModeId;
  group: 'geometry' | 'simulation';
  titleVi: string;
  titleEn: string;
  formula: string;
  descVi: string;
  descEn: string;
  badge: string;
}

const SPATIAL_MODES: SpatialModeMeta[] = [
  {
    id: 'pyramid',
    group: 'geometry',
    titleVi: 'Hình chóp Tứ giác Đều S.ABCD',
    titleEn: 'Regular Square Pyramid S.ABCD',
    formula: 'V = (1/3)·a²·h · Sxq = 4·(1/2)·a·d',
    descVi: 'Tách 4 mặt bên, quan sát đường cao SH, trung đoạn & mặt phẳng thiết diện cắt ngang.',
    descEn: 'Explode 4 triangular faces, inspect altitude SH, apothem, and dynamic horizontal slice.',
    badge: 'HH 11-12'
  },
  {
    id: 'prism',
    group: 'geometry',
    titleVi: 'Lăng trụ Lục giác Đều',
    titleEn: 'Regular Hexagonal Prism',
    formula: 'V = (3√3/2)·a²·h · Sxq = 6·a·h',
    descVi: '2 đáy lục giác đều, 6 mặt bên tách hướng tâm & các đường chéo không gian.',
    descEn: 'Dual regular hexagon bases, 6 radially explodable lateral walls, and spatial diagonals.',
    badge: 'HH 11-12'
  },
  {
    id: 'cone_conic',
    group: 'geometry',
    titleVi: 'Hình nón & Thiết diện Conic',
    titleEn: 'Cone & Conic Cross-Sections',
    formula: 'V = (1/3)·π·r²·h · x²/a² ± y²/b² = 1',
    descVi: 'Cắt mặt nón tạo vòng Elip/Parabol trực quan, thay đổi chiều cao & góc mở đỉnh nón.',
    descEn: 'Slice a translucent cone to inspect conic section intersections in real time.',
    badge: 'TOÁN 10-12'
  },
  {
    id: 'platonic',
    group: 'geometry',
    titleVi: 'Ngũ khối Platon Lồng Nhau',
    titleEn: 'Nested Platonic Solids',
    formula: 'V - E + F = 2 (Euler Polyhedron)',
    descVi: 'Tứ diện · Lập phương · Bát diện · Thập nhị diện · Nhị thập diện bung lớp 3D.',
    descEn: 'Tetrahedron, Cube, Octahedron, Dodecahedron & Icosahedron exploding radially.',
    badge: 'TOÁN HỌC'
  },
  {
    id: 'sphere_slice',
    group: 'geometry',
    titleVi: 'Mặt cầu (S) & Giao tuyến Tròn',
    titleEn: 'Sphere (S) & Intersection Circle',
    formula: '(x-a)² + (y-b)² + (z-c)² = R² · r = √(R² - d²)',
    descVi: 'Kéo mặt phẳng cắt theo cử chỉ 2 ngón để thấy bán kính giao tuyến r biến thiên tức thì.',
    descEn: 'Slide the 2-finger cross-section plane to watch intersection circle radius r respond.',
    badge: 'OXYZ 12'
  },
  {
    id: 'freehand_oxyz',
    group: 'geometry',
    titleVi: 'Điêu khắc Tự do Không gian Oxyz',
    titleEn: 'Freehand Oxyz 3D Sculpting',
    formula: 'r(t) = (x(t), y(t), z(t)) ∈ ℝ³',
    descVi: 'Dùng 1 ngón tay (hoặc bàn di) để vẽ nét ống 3D phát sáng & đặt đa diện trong hệ Oxyz.',
    descEn: 'Use 1-finger gesture or pad to draw glowing 3D tube strokes and place markers in Oxyz.',
    badge: 'SÁNG TẠO'
  },
  {
    id: 'wave_surface',
    group: 'simulation',
    titleVi: 'Trường Sóng Giao thoa 3D',
    titleEn: '3D Wave Interference Field',
    formula: 'u(r,t) = A·[cos(kr₁ - ωt) + cos(kr₂ - ωt)]',
    descVi: 'Lưới mặt sóng 2 nguồn S₁, S₂ biến dạng thời gian thực theo chiều cao biên độ tay.',
    descEn: 'Real-time 2-source interference vertex field modulated by pinch amplitude.',
    badge: 'VẬT LÍ 11-12'
  },
  {
    id: 'quantum_atom',
    group: 'simulation',
    titleVi: 'Nguyên tử Bohr & Quỹ đạo Lượng tử',
    titleEn: 'Bohr Atom & Quantum Orbits',
    formula: 'Eₙ = -13.6 / n² (eV) · L = nℏ',
    descVi: 'Hạt nhân đa cầu + 4 quỹ đạo electron nghiêng 3D chuyển động & tách lớp vỏ năng lượng.',
    descEn: 'Multi-nucleon core with 4 inclined orbital rings and radially explodable energy shells.',
    badge: 'LƯỢNG TỬ'
  },
  {
    id: 'math_saddle',
    group: 'simulation',
    titleVi: 'Mặt Cong Giải tích Yên ngựa',
    titleEn: 'Hyperbolic Paraboloid Saddle',
    formula: 'z = (x²/a²) - (y²/b²)',
    descVi: 'Bề mặt paraboloid hyperbolic kèm 2 đường sinh trực giao & điểm yên ngựa tại O.',
    descEn: 'Parametric hyperbolic paraboloid mesh with orthogonal curves and saddle origin.',
    badge: 'GIẢI TÍCH'
  },
  {
    id: 'dna_helix',
    group: 'simulation',
    titleVi: 'Chuỗi Xoắn Kép DNA Lượng tử',
    titleEn: 'Quantum DNA Double Helix',
    formula: 'r(t) = (R·cos ωt, h·t, R·sin ωt)',
    descVi: '2 khung xoắn đối xứng + 16 cặp bazơ nitơ tách đôi mượt mà khi mở lòng bàn tay.',
    descEn: 'Dual helical backbones with 16 nitrogenous base pairs that split smoothly on explode.',
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

interface ExplodablePart {
  mesh: THREE.Object3D;
  basePos: THREE.Vector3;
  explodeDir: THREE.Vector3;
}

interface DynamicModelRef {
  group: THREE.Group;
  explodables: ExplodablePart[];
  waveGeo?: THREE.PlaneGeometry;
  waveBaseZ?: Float32Array;
  atomElectrons?: { mesh: THREE.Object3D; ringRadius: number; tiltEuler: THREE.Euler; speed: number; phase: number }[];
  sphereCutRing?: THREE.Mesh;
  disposables: { geometries: THREE.BufferGeometry[]; materials: THREE.Material[] };
}

interface LabRuntime {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  rootGroup: THREE.Group;
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
  strokePointsLists: THREE.Vector3[][];
  markerMeshes: THREE.Mesh[];
  activeStrokePoints: THREE.Vector3[];
  activePreviewLine: THREE.Line | null;
}

interface SpatialGesture3DLabProps {
  onBack?: () => void;
  onNavigate?: (subject: SubjectType) => void;
  onEarnXP?: (xp: number) => void;
}

// Pre-allocated math objects outside animation loop (Zero GC rule)
const _v3TmpA = new THREE.Vector3();
const _v3TmpB = new THREE.Vector3();
const _eulerTmp = new THREE.Euler();
const _colorTmp = new THREE.Color();

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

  // Core studio states
  const [modeId, setModeId] = useState<SpatialModeId>('pyramid');
  const [finish, setFinish] = useState<MaterialFinishId>('ceramic');
  const [paletteId, setPaletteId] = useState<string>('cyan');
  const [scaleVal, setScaleVal] = useState<number>(1.0);
  const [heightVal, setHeightVal] = useState<number>(1.0);
  const [explodeVal, setExplodeVal] = useState<number>(0.15);
  const [sliceEnabled, setSliceEnabled] = useState<boolean>(false);
  const [sliceY, setSliceY] = useState<number>(2.4);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [autoSpin, setAutoSpin] = useState<boolean>(true);
  const [showAxes, setShowAxes] = useState<boolean>(true);
  const [frozen, setFrozen] = useState<boolean>(false);
  const [dockTab, setDockTab] = useState<DockTabId>('gesture');
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [hudHidden, setHudHidden] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [strokeCount, setStrokeCount] = useState<number>(0);
  const [markerCount, setMarkerCount] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Camera & Hand Gesture Tracking states
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [mirrorCamera, setMirrorCamera] = useState<boolean>(true);
  const [sensitivity, setSensitivity] = useState<number>(1.05);
  const [smoothing, setSmoothing] = useState<number>(0.55);
  const [virtualGesture, setVirtualGesture] = useState<HandGestureId>('palm_5');
  const [showVirtualPad, setShowVirtualPad] = useState<boolean>(true);

  const [handFrame, setHandFrame] = useState<HandTrackingFrame>({
    detected: false,
    gesture: 'none',
    fingerCount: 0,
    cursorX: 0.5,
    cursorY: 0.5,
    pinchRatio: 0,
    spreadScale: 1,
    confidence: 0,
    palmRadius: 0.1,
    skinCoverage: 0,
    tips: [],
    bbox: null
  });

  // Live cursor display in Oxyz coords
  const [oxyzCursor, setOxyzCursor] = useState<{ x: number; y: number; z: number }>({
    x: 0,
    y: 1.5,
    z: 0
  });

  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackerRef = useRef<HandGestureTracker | null>(null);
  const runtimeRef = useRef<LabRuntime | null>(null);

  // Mutable state ref for animation loop so WebGL canvas never remounts on UI updates
  const paramsRef = useRef({
    modeId,
    finish,
    paletteId,
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
    virtualGesture
  });
  paramsRef.current = {
    modeId,
    finish,
    paletteId,
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
    virtualGesture
  };

  // Smooth target refs for exponential damping & gesture control
  const smoothTargetRef = useRef({
    scale: 1.0,
    height: 1.0,
    explode: 0.15,
    sliceY: 2.4,
    rotOffset: 0,
    cursorX: 0,
    cursorY: 1.5,
    cursorZ: 0
  });
  const virtualPadDownRef = useRef<boolean>(false);
  const lastMorphAtRef = useRef<number>(0);
  const lastPinchStampAtRef = useRef<number>(0);
  const awardFlagRef = useRef<boolean>(false);

  const activePalette = useMemo(
    () => ACCENT_PALETTES.find((p) => p.id === paletteId) || ACCENT_PALETTES[0],
    [paletteId]
  );
  const activeMode = useMemo(
    () => SPATIAL_MODES.find((m) => m.id === modeId) || SPATIAL_MODES[0],
    [modeId]
  );

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2400);
  }, []);

  // Computed live academic telemetry for current shape
  const liveTelemetry = useMemo(() => {
    const a = +(2.6 * scaleVal).toFixed(2);
    const h = +(3.0 * heightVal * scaleVal).toFixed(2);
    const r = +(1.65 * scaleVal).toFixed(2);
    switch (modeId) {
      case 'pyramid': {
        const vol = +((a * a * h) / 3).toFixed(2);
        const slant = Math.hypot(h, a * 0.5);
        const sTotal = +(a * a + 2 * a * slant).toFixed(2);
        return {
          metricA: `a = ${a}m`,
          metricB: `h = ${h}m`,
          metricC: `V = ${vol}m³ · Stp = ${sTotal}m²`
        };
      }
      case 'prism': {
        const baseArea = ((3 * Math.sqrt(3)) / 2) * (r * r);
        const vol = +(baseArea * h).toFixed(2);
        return {
          metricA: `Rđáy = ${r}m`,
          metricB: `h = ${h}m`,
          metricC: `V = ${vol}m³ · 6 mặt bên`
        };
      }
      case 'cone_conic': {
        const vol = +((Math.PI * r * r * h) / 3).toFixed(2);
        const l = +Math.hypot(r, h).toFixed(2);
        return {
          metricA: `r = ${r}m · l = ${l}m`,
          metricB: `h = ${h}m`,
          metricC: `V = ${vol}m³ · Elip góc 32°`
        };
      }
      case 'sphere_slice': {
        const R = +(2.1 * scaleVal).toFixed(2);
        const dCenter = Math.abs(sliceY - 2.1);
        const rCut = sliceEnabled && dCenter < R ? +Math.sqrt(Math.max(0, R * R - dCenter * dCenter)).toFixed(2) : R;
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
          metricC: `${markerCount} khối đánh dấu`
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
      case 'math_saddle':
        return {
          metricA: `Hệ số k = ${(0.45 * heightVal).toFixed(2)}`,
          metricB: `Điểm yên ngựa O(0,0,0)`,
          metricC: `K_Gauss < 0`
        };
      case 'dna_helix':
        return {
          metricA: `16 cặp bazơ A-T / G-X`,
          metricB: `Bước xoắn ${(3.4 * heightVal).toFixed(1)} Å`,
          metricC: `Tách mạch ${Math.round(explodeVal * 100)}%`
        };
    }
  }, [modeId, scaleVal, heightVal, explodeVal, sliceEnabled, sliceY, simSpeed, oxyzCursor, strokeCount, markerCount]);

  // Helper to create material matching user's finish & palette + clipping plane
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
        // Ceramic PBR default
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

  // Dispose active dynamic model safely
  const disposeModel = useCallback((model: DynamicModelRef | null) => {
    if (!model) return;
    model.disposables.geometries.forEach((g) => g.dispose());
    model.disposables.materials.forEach((m) => m.dispose());
  }, []);

  // Build selected 3D composite model inside rootGroup
  const rebuildModel = useCallback(
    (
      runtime: LabRuntime,
      nextMode: SpatialModeId,
      nextFinish: MaterialFinishId,
      palette: AccentPalette,
      softwareGl: boolean
    ) => {
      if (runtime.model) {
        runtime.rootGroup.remove(runtime.model.group);
        disposeModel(runtime.model);
        runtime.model = null;
      }

      const group = new THREE.Group();
      const explodables: ExplodablePart[] = [];
      const geometries: THREE.BufferGeometry[] = [];
      const materials: THREE.Material[] = [];

      const mats = buildMaterials(nextFinish, palette, runtime.slicePlane, softwareGl);
      materials.push(mats.primary, mats.secondary, mats.highlight, mats.edge, mats.glow);

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
        addEdges = true
      ) => {
        mesh.castShadow = !softwareGl;
        mesh.receiveShadow = !softwareGl;
        group.add(mesh);
        explodables.push({
          mesh,
          basePos: mesh.position.clone(),
          explodeDir: explodeDir.clone()
        });
        if (addEdges && mesh instanceof THREE.Mesh) {
          const edges = new THREE.EdgesGeometry(mesh.geometry, 20);
          trackGeo(edges);
          const line = new THREE.LineSegments(edges, mats.edge);
          mesh.add(line);
        }
      };

      let waveGeo: THREE.PlaneGeometry | undefined;
      let waveBaseZ: Float32Array | undefined;
      let atomElectrons: DynamicModelRef['atomElectrons'];
      let sphereCutRing: THREE.Mesh | undefined;

      if (nextMode === 'pyramid') {
        // Composite square pyramid: solid base slab + 4 triangular walls + altitude rod + apex orb
        const baseW = 3.0;
        const baseGeo = trackGeo(new THREE.BoxGeometry(baseW, 0.14, baseW));
        const baseMesh = new THREE.Mesh(baseGeo, mats.secondary);
        baseMesh.position.set(0, 0.07, 0);
        addPart(baseMesh, new THREE.Vector3(0, -0.5, 0));

        const h = 3.2;
        const half = baseW / 2;
        const corners = [
          new THREE.Vector3(-half, 0.14, half),
          new THREE.Vector3(half, 0.14, half),
          new THREE.Vector3(half, 0.14, -half),
          new THREE.Vector3(-half, 0.14, -half)
        ];
        const apex = new THREE.Vector3(0, h + 0.14, 0);

        for (let i = 0; i < 4; i++) {
          const a = corners[i];
          const b = corners[(i + 1) % 4];
          const faceGeo = trackGeo(new THREE.BufferGeometry());
          const verts = new Float32Array([
            a.x, a.y, a.z,
            b.x, b.y, b.z,
            apex.x, apex.y, apex.z
          ]);
          faceGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
          faceGeo.computeVertexNormals();
          const faceMesh = new THREE.Mesh(faceGeo, mats.primary);
          const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
          const dir = new THREE.Vector3(mid.x, 0.5, mid.z).normalize();
          addPart(faceMesh, dir);
        }

        // Altitude SH rod + Apex glowing node
        const rodGeo = trackGeo(new THREE.CylinderGeometry(0.035, 0.035, h, 12));
        const rodMesh = new THREE.Mesh(rodGeo, mats.glow);
        rodMesh.position.set(0, 0.14 + h / 2, 0);
        addPart(rodMesh, new THREE.Vector3(0, 0.8, 0), false);

        const apexGeo = trackGeo(new THREE.SphereGeometry(0.14, 20, 20));
        const apexOrb = new THREE.Mesh(apexGeo, mats.glow);
        apexOrb.position.copy(apex);
        addPart(apexOrb, new THREE.Vector3(0, 1.4, 0), false);
      } else if (nextMode === 'prism') {
        const radius = 1.65;
        const h = 3.1;
        const baseGeo = trackGeo(new THREE.CylinderGeometry(radius, radius, 0.12, 6));
        const botBase = new THREE.Mesh(baseGeo, mats.secondary);
        botBase.position.set(0, 0.06, 0);
        addPart(botBase, new THREE.Vector3(0, -0.7, 0));

        const topBase = new THREE.Mesh(baseGeo, mats.secondary);
        topBase.position.set(0, h + 0.12, 0);
        addPart(topBase, new THREE.Vector3(0, 1.1, 0));

        const sideWidth = 2 * radius * Math.sin(Math.PI / 6);
        const apothem = radius * Math.cos(Math.PI / 6);
        const wallGeo = trackGeo(new THREE.BoxGeometry(sideWidth * 0.96, h, 0.08));

        for (let i = 0; i < 6; i++) {
          const theta = (i * Math.PI) / 3 + Math.PI / 6;
          const wall = new THREE.Mesh(wallGeo, mats.primary);
          wall.position.set(Math.cos(theta) * apothem, 0.12 + h / 2, Math.sin(theta) * apothem);
          wall.rotation.y = -theta + Math.PI / 2;
          addPart(wall, new THREE.Vector3(Math.cos(theta), 0, Math.sin(theta)));
        }

        // Inner symmetry axis rod
        const axisGeo = trackGeo(new THREE.CylinderGeometry(0.05, 0.05, h + 0.4, 14));
        const axisRod = new THREE.Mesh(axisGeo, mats.glow);
        axisRod.position.set(0, 0.12 + h / 2, 0);
        addPart(axisRod, new THREE.Vector3(0, 0.3, 0), false);
      } else if (nextMode === 'cone_conic') {
        const r = 1.75;
        const h = 3.4;
        const diskGeo = trackGeo(new THREE.CylinderGeometry(r, r, 0.1, 48));
        const disk = new THREE.Mesh(diskGeo, mats.secondary);
        disk.position.set(0, 0.05, 0);
        addPart(disk, new THREE.Vector3(0, -0.7, 0));

        const outerConeGeo = trackGeo(new THREE.ConeGeometry(r, h, 48, 1, true));
        const outerConeMat = trackMat(
          new THREE.MeshPhysicalMaterial({
            color: palette.hex,
            roughness: 0.15,
            metalness: 0.1,
            transparent: true,
            opacity: 0.42,
            side: THREE.DoubleSide,
            clippingPlanes: [runtime.slicePlane],
            clipShadows: true
          })
        );
        const outerCone = new THREE.Mesh(outerConeGeo, outerConeMat);
        outerCone.position.set(0, 0.1 + h / 2, 0);
        addPart(outerCone, new THREE.Vector3(0, 0.7, 0), false);

        const innerConeGeo = trackGeo(new THREE.ConeGeometry(r * 0.62, h * 0.78, 32));
        const innerCone = new THREE.Mesh(innerConeGeo, mats.primary);
        innerCone.position.set(0, 0.1 + h * 0.39, 0);
        addPart(innerCone, new THREE.Vector3(0, 0.25, 0));

        // Tilted conic section ellipse plane ring
        const conicPlaneGeo = trackGeo(new THREE.TorusGeometry(1.12, 0.045, 16, 64));
        const conicRing = new THREE.Mesh(conicPlaneGeo, mats.glow);
        conicRing.position.set(0, 1.55, 0);
        conicRing.rotation.set(Math.PI / 2 - 0.52, 0, 0.28);
        conicRing.scale.set(1.0, 1.32, 1.0);
        addPart(conicRing, new THREE.Vector3(0.8, 0.6, 0), false);
      } else if (nextMode === 'platonic') {
        const platonicSpecs: { geo: THREE.BufferGeometry; dir: THREE.Vector3; sec: boolean }[] = [
          { geo: new THREE.TetrahedronGeometry(0.65), dir: new THREE.Vector3(0, 1.3, 0), sec: false },
          { geo: new THREE.BoxGeometry(0.95, 0.95, 0.95), dir: new THREE.Vector3(-1.3, 0.3, 0.6), sec: true },
          { geo: new THREE.OctahedronGeometry(1.18), dir: new THREE.Vector3(1.3, 0.3, 0.6), sec: false },
          { geo: new THREE.DodecahedronGeometry(1.48), dir: new THREE.Vector3(-0.9, 0.4, -1.1), sec: true },
          { geo: new THREE.IcosahedronGeometry(1.85), dir: new THREE.Vector3(0.9, 0.4, -1.1), sec: false }
        ];

        platonicSpecs.forEach((spec, idx) => {
          trackGeo(spec.geo);
          const m = new THREE.Mesh(
            spec.geo,
            idx === 0 ? mats.glow : spec.sec ? mats.secondary : mats.primary
          );
          if (idx > 0 && nextFinish === 'ceramic') {
            const shellMat = trackMat(
              new THREE.MeshStandardMaterial({
                color: spec.sec ? palette.secondaryHex : palette.hex,
                roughness: 0.25 + idx * 0.08,
                metalness: 0.35,
                transparent: true,
                opacity: Math.max(0.28, 0.9 - idx * 0.14),
                side: THREE.DoubleSide,
                clippingPlanes: [runtime.slicePlane],
                clipShadows: true
              })
            );
            m.material = shellMat;
          }
          m.position.set(0, 2.0, 0);
          addPart(m, spec.dir);
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
        addPart(outerSphere, new THREE.Vector3(0, 0.6, 0), false);

        // Inner core sphere + latitude meridians
        const coreGeo = trackGeo(new THREE.SphereGeometry(0.45, 24, 24));
        const coreMesh = new THREE.Mesh(coreGeo, mats.glow);
        coreMesh.position.set(0, R + 0.15, 0);
        addPart(coreMesh, new THREE.Vector3(0, 0, 0), false);

        for (let i = 0; i < 3; i++) {
          const ringGeo = trackGeo(new THREE.TorusGeometry(R * 1.005, 0.02, 12, 64));
          const ring = new THREE.Mesh(ringGeo, mats.secondary);
          ring.position.set(0, R + 0.15, 0);
          ring.rotation.y = (i * Math.PI) / 3;
          addPart(ring, new THREE.Vector3(Math.cos(i * 2), 0.2, Math.sin(i * 2)), false);
        }

        // Dynamic horizontal intersection ring
        const cutGeo = trackGeo(new THREE.TorusGeometry(1.0, 0.045, 16, 64));
        sphereCutRing = new THREE.Mesh(cutGeo, mats.glow);
        sphereCutRing.rotation.x = Math.PI / 2;
        sphereCutRing.position.set(0, R + 0.15, 0);
        group.add(sphereCutRing);
      } else if (nextMode === 'freehand_oxyz') {
        // Architectural Origin Beacon & Calibration Cage
        const plinthGeo = trackGeo(new THREE.CylinderGeometry(0.65, 0.85, 0.18, 24));
        const plinth = new THREE.Mesh(plinthGeo, mats.secondary);
        plinth.position.set(0, 0.09, 0);
        addPart(plinth, new THREE.Vector3(0, -0.4, 0), false);

        const coreOctGeo = trackGeo(new THREE.OctahedronGeometry(0.38));
        const coreOct = new THREE.Mesh(coreOctGeo, mats.glow);
        coreOct.position.set(0, 1.5, 0);
        addPart(coreOct, new THREE.Vector3(0, 0.5, 0));

        const orbitRingGeo = trackGeo(new THREE.TorusGeometry(1.35, 0.02, 12, 64));
        const orbitRing = new THREE.Mesh(orbitRingGeo, mats.primary);
        orbitRing.rotation.x = Math.PI / 2;
        orbitRing.position.set(0, 1.5, 0);
        addPart(orbitRing, new THREE.Vector3(0, 0.2, 0), false);
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
        addPart(waveMesh, new THREE.Vector3(0, 0.4, 0), false);

        // Two wave emitter towers S1, S2
        const emitterGeo = trackGeo(new THREE.CylinderGeometry(0.12, 0.18, 1.15, 16));
        [-1.6, 1.6].forEach((xPos) => {
          const tower = new THREE.Mesh(emitterGeo, mats.secondary);
          tower.position.set(xPos, 0.58, 0);
          addPart(tower, new THREE.Vector3(Math.sign(xPos), -0.3, 0), false);
        });
      } else if (nextMode === 'quantum_atom') {
        const centerY = 2.05;
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
          nuc.position.set(ox, centerY + oy, oz);
          addPart(nuc, new THREE.Vector3(ox * 2, oy * 2, oz * 2), false);
        });

        atomElectrons = [];
        const tilts: [number, number, number][] = [
          [0.35, 0.2, 0.4],
          [1.15, 0.6, -0.35],
          [-0.95, 0.4, 0.75],
          [0.2, 1.2, -1.1]
        ];
        const eGeo = trackGeo(new THREE.SphereGeometry(0.13, 16, 16));
        tilts.forEach((tilt, idx) => {
          const r = 1.35 + idx * 0.34;
          const ringGeo = trackGeo(new THREE.TorusGeometry(r, 0.025, 12, 64));
          const ring = new THREE.Mesh(ringGeo, idx % 2 === 0 ? mats.primary : mats.secondary);
          ring.position.set(0, centerY, 0);
          ring.rotation.set(tilt[0], tilt[1], tilt[2]);
          addPart(ring, new THREE.Vector3(Math.cos(idx * 1.5), 0.3, Math.sin(idx * 1.5)), false);

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
      } else if (nextMode === 'math_saddle') {
        const size = 4.6;
        const segs = 40;
        const saddleGeo = trackGeo(new THREE.PlaneGeometry(size, size, segs, segs));
        saddleGeo.rotateX(-Math.PI / 2);
        const pos = saddleGeo.attributes.position as THREE.BufferAttribute;
        const cols = new Float32Array(pos.count * 3);
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const z = pos.getZ(i);
          const yVal = (x * x - z * z) * 0.24;
          pos.setY(i, yVal);
          const t = THREE.MathUtils.clamp((yVal + 1.3) / 2.6, 0, 1);
          _colorTmp.setHSL(0.55 - t * 0.42, 0.85, 0.52);
          cols[i * 3] = _colorTmp.r;
          cols[i * 3 + 1] = _colorTmp.g;
          cols[i * 3 + 2] = _colorTmp.b;
        }
        saddleGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
        saddleGeo.computeVertexNormals();

        const saddleMat = trackMat(
          new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.3,
            metalness: 0.35,
            wireframe: nextFinish === 'wireframe',
            side: THREE.DoubleSide,
            clippingPlanes: [runtime.slicePlane],
            clipShadows: true
          })
        );
        const saddleMesh = new THREE.Mesh(saddleGeo, saddleMat);
        saddleMesh.position.set(0, 1.85, 0);
        addPart(saddleMesh, new THREE.Vector3(0, 0.3, 0), false);

        const saddlePtGeo = trackGeo(new THREE.SphereGeometry(0.16, 20, 20));
        const saddlePt = new THREE.Mesh(saddlePtGeo, mats.glow);
        saddlePt.position.set(0, 1.85, 0);
        addPart(saddlePt, new THREE.Vector3(0, 1.1, 0), false);
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

        const strandA = new THREE.Mesh(tubeGeoA, mats.primary);
        const strandB = new THREE.Mesh(tubeGeoB, mats.secondary);
        addPart(strandA, new THREE.Vector3(-0.9, 0, 0), false);
        addPart(strandB, new THREE.Vector3(0.9, 0, 0), false);

        const rungGeo = trackGeo(new THREE.CylinderGeometry(0.04, 0.04, radius * 0.96, 10));
        rungGeo.rotateZ(Math.PI / 2);
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
          addPart(halfA, dir.clone().multiplyScalar(-0.7), false);

          const halfB = new THREE.Mesh(rungGeo, i % 2 === 0 ? mats.secondary : mats.glow);
          halfB.position.copy(pB).lerp(mid, 0.5);
          halfB.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
          addPart(halfB, dir.clone().multiplyScalar(0.7), false);
        }
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
    },
    [buildMaterials, disposeModel]
  );

  // Sync Three.js scene & animation loop once
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

    const renderer = new THREE.WebGLRenderer({
      antialias: !softwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(softwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !softwareGl;
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

    // 3-point warm/cool studio lighting
    const hemi = new THREE.HemisphereLight(0xbae6fd, 0x0f172a, 0.95);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.2);
    keyLight.position.set(6.5, 11, 7.5);
    keyLight.castShadow = !softwareGl;
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

    // Floor & Oxyz Axes
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

    // Root model group + freehand Oxyz drawing groups
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const strokesGroup = new THREE.Group();
    scene.add(strokesGroup);

    const markersGroup = new THREE.Group();
    scene.add(markersGroup);

    // Dynamic clipping slice plane + visual guide frame
    const slicePlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 100);
    const sliceHelperGeo = new THREE.PlaneGeometry(5.6, 5.6);
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

    // 3D Hand Laser Cursor Beacon
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

    // 5 dedicated 3D fingertip sensor orbs (strictly on the 5 fingertips)
    const tipSensorGeo = new THREE.SphereGeometry(0.085, 16, 16);
    const tipSensorMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    const tipSensorMeshes: THREE.Mesh[] = Array.from({ length: 5 }, () => {
      const m = new THREE.Mesh(tipSensorGeo, tipSensorMat);
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
      strokePointsLists: [],
      markerMeshes: [],
      activeStrokePoints: [],
      activePreviewLine: null
    };
    runtimeRef.current = runtime;

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
    let lastGestureFramePush = 0;

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

    const finalizeActiveStroke = () => {
      const pts = runtime.activeStrokePoints;
      if (runtime.activePreviewLine) {
        runtime.strokesGroup.remove(runtime.activePreviewLine);
        runtime.activePreviewLine.geometry.dispose();
        (runtime.activePreviewLine.material as THREE.Material).dispose();
        runtime.activePreviewLine = null;
      }
      if (pts.length >= 3) {
        const curve = new THREE.CatmullRomCurve3(pts);
        const tubeGeo = new THREE.TubeGeometry(curve, Math.min(84, pts.length * 3), 0.065, 10, false);
        const activePal = ACCENT_PALETTES.find((p) => p.id === paramsRef.current.paletteId) || ACCENT_PALETTES[0];
        const tubeMat = new THREE.MeshStandardMaterial({
          color: activePal.hex,
          emissive: activePal.hex,
          emissiveIntensity: 0.45,
          roughness: 0.25,
          metalness: 0.4
        });
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        runtime.strokesGroup.add(tubeMesh);
        runtime.strokeMeshes.push(tubeMesh);
        runtime.strokePointsLists.push(pts.map((p) => p.clone()));
        setStrokeCount(runtime.strokeMeshes.length);
      }
      runtime.activeStrokePoints = [];
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(0.05, clock.getDelta());
      const elapsed = clock.getElapsedTime();
      const cfg = paramsRef.current;

      // Process live webcam frame if active
      let currentGesture: HandGestureId = cfg.cameraActive ? 'none' : cfg.virtualGesture;
      let cursorNormX = 0.5;
      let cursorNormY = 0.5;
      let handDetected = false;

      if (cfg.cameraActive && videoRef.current && trackerRef.current) {
        const res = trackerRef.current.process(videoRef.current, {
          mirror: cfg.mirrorCamera,
          sensitivity: cfg.sensitivity,
          smoothing: cfg.smoothing
        });

        if (overlayCanvasRef.current) {
          const pal = ACCENT_PALETTES.find((p) => p.id === cfg.paletteId) || ACCENT_PALETTES[0];
          trackerRef.current.drawOverlay(overlayCanvasRef.current, res, pal.css);
        }

        handDetected = res.detected;
        if (res.detected) {
          currentGesture = res.gesture;
          cursorNormX = res.cursorX;
          cursorNormY = res.cursorY;
          // Position the 5 3D fingertip sensor orbs strictly at detected fingertips
          for (let i = 0; i < 5; i++) {
            const sensor = runtime.tipSensorMeshes[i];
            const tip = res.tips[i];
            if (tip) {
              sensor.visible = true;
              const tx = (tip.x - 0.5) * 6.4;
              const ty = THREE.MathUtils.clamp((1 - tip.y) * 3.8, 0.2, 4.0);
              const tz = Math.sin((tip.x - 0.5) * Math.PI) * 1.4;
              sensor.position.x = THREE.MathUtils.damp(sensor.position.x, tx, 14, dt);
              sensor.position.y = THREE.MathUtils.damp(sensor.position.y, ty, 14, dt);
              sensor.position.z = THREE.MathUtils.damp(sensor.position.z, tz, 14, dt);
            } else {
              sensor.visible = false;
            }
          }
        } else {
          for (let i = 0; i < 5; i++) {
            runtime.tipSensorMeshes[i].visible = false;
          }
        }

        if (elapsed - lastGestureFramePush > 0.08) {
          lastGestureFramePush = elapsed;
          setHandFrame(res);
        }
      } else {
        for (let i = 0; i < 5; i++) {
          runtime.tipSensorMeshes[i].visible = false;
        }
      }

      // Apply gesture actions to 3D parameters (when camera hand detected OR virtual gesture active on drag)
      const activeControl = handDetected || (!cfg.cameraActive && virtualPadDownRef.current);
      if (activeControl && !handDetected) {
        cursorNormX = (smoothTargetRef.current.cursorX + 3.2) / 6.4;
        cursorNormY = 1 - smoothTargetRef.current.cursorY / 3.8;
      }

      if (activeControl) {
        const targetX = (cursorNormX - 0.5) * 6.4;
        const targetY = THREE.MathUtils.clamp((1 - cursorNormY) * 3.8, 0.25, 3.9);
        const targetZ = Math.sin((cursorNormX - 0.5) * Math.PI) * 1.4;
        smoothTargetRef.current.cursorX = targetX;
        smoothTargetRef.current.cursorY = targetY;
        smoothTargetRef.current.cursorZ = targetZ;

        if (currentGesture === 'fist_0') {
          if (!cfg.frozen) setFrozen(true);
        } else if (cfg.frozen) {
          setFrozen(false);
        }

        if (currentGesture === 'point_1') {
          // 1 finger: sculpt glowing 3D strokes in Oxyz
          _v3TmpA.set(targetX, targetY, targetZ);
          const pts = runtime.activeStrokePoints;
          if (pts.length === 0 || pts[pts.length - 1].distanceTo(_v3TmpA) > 0.14) {
            pts.push(_v3TmpA.clone());
            if (pts.length > 90) pts.shift();

            if (runtime.activePreviewLine) {
              runtime.activePreviewLine.geometry.dispose();
              runtime.activePreviewLine.geometry = new THREE.BufferGeometry().setFromPoints(pts);
            } else if (pts.length >= 2) {
              const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
              const lineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee });
              runtime.activePreviewLine = new THREE.Line(lineGeo, lineMat);
              runtime.strokesGroup.add(runtime.activePreviewLine);
            }
          }
          if (elapsed - lastGestureFramePush > 0.1) {
            setOxyzCursor({ x: targetX, y: targetY, z: targetZ });
          }
        } else {
          if (runtime.activeStrokePoints.length > 0) {
            finalizeActiveStroke();
          }
        }

        if (currentGesture === 'pinch') {
          const nextScale = THREE.MathUtils.clamp(0.55 + (1 - cursorNormY) * 1.15, 0.5, 1.75);
          const nextHeight = THREE.MathUtils.clamp(0.55 + cursorNormX * 1.25, 0.5, 1.85);
          smoothTargetRef.current.scale = nextScale;
          smoothTargetRef.current.height = nextHeight;
          setScaleVal(+nextScale.toFixed(2));
          setHeightVal(+nextHeight.toFixed(2));

          // In Freehand Oxyz mode, pinch also stamps a floating crystal polyhedron marker
          const nowMs = performance.now();
          if (cfg.modeId === 'freehand_oxyz' && nowMs - lastPinchStampAtRef.current > 850) {
            lastPinchStampAtRef.current = nowMs;
            const pal = ACCENT_PALETTES.find((p) => p.id === cfg.paletteId) || ACCENT_PALETTES[0];
            const mGeo = new THREE.OctahedronGeometry(0.18);
            const mMat = new THREE.MeshStandardMaterial({
              color: pal.secondaryHex,
              emissive: pal.hex,
              emissiveIntensity: 0.4,
              roughness: 0.2,
              metalness: 0.6
            });
            const mMesh = new THREE.Mesh(mGeo, mMat);
            mMesh.position.set(targetX, targetY, targetZ);
            runtime.markersGroup.add(mMesh);
            runtime.markerMeshes.push(mMesh);
            setMarkerCount(runtime.markerMeshes.length);
          }
        }

        if (currentGesture === 'slice_2') {
          if (!cfg.sliceEnabled) setSliceEnabled(true);
          const nextSlice = THREE.MathUtils.clamp((1 - cursorNormY) * 3.8 + 0.1, 0.15, 4.1);
          smoothTargetRef.current.sliceY = nextSlice;
          setSliceY(+nextSlice.toFixed(2));
        }

        if (currentGesture === 'palm_5') {
          const nextRot = (cursorNormX - 0.5) * Math.PI * 2.4;
          const nextExp = THREE.MathUtils.clamp((1 - cursorNormY) * 1.25, 0, 1.2);
          smoothTargetRef.current.rotOffset = nextRot;
          smoothTargetRef.current.explode = nextExp;
          setExplodeVal(+nextExp.toFixed(2));
        }

        if (currentGesture === 'morph_3') {
          // Safe inspection action: smoothly zoom/scale and separate layers on the CURRENT simulation (never jumps to another simulation)
          const focusExp = THREE.MathUtils.clamp((1 - cursorNormY) * 1.15, 0.1, 1.15);
          smoothTargetRef.current.explode = focusExp;
          setExplodeVal(+focusExp.toFixed(2));
        }

        if (!awardFlagRef.current && onEarnXP) {
          awardFlagRef.current = true;
          onEarnXP(25);
        }
      } else if (runtime.activeStrokePoints.length > 0 && !virtualPadDownRef.current) {
        finalizeActiveStroke();
      }

      // Sync UI targets when user drags sliders manually
      if (!activeControl) {
        smoothTargetRef.current.scale = cfg.scaleVal;
        smoothTargetRef.current.height = cfg.heightVal;
        smoothTargetRef.current.explode = cfg.explodeVal;
        smoothTargetRef.current.sliceY = cfg.sliceY;
      }

      // Smoothly damp 3D scene properties
      runtime.axesGroup.visible = cfg.showAxes;
      runtime.floorGroup.visible = cfg.showAxes;

      cursorGroup.position.x = THREE.MathUtils.damp(
        cursorGroup.position.x,
        smoothTargetRef.current.cursorX,
        12,
        dt
      );
      cursorGroup.position.y = THREE.MathUtils.damp(
        cursorGroup.position.y,
        smoothTargetRef.current.cursorY,
        12,
        dt
      );
      cursorGroup.position.z = THREE.MathUtils.damp(
        cursorGroup.position.z,
        smoothTargetRef.current.cursorZ,
        12,
        dt
      );
      cursorRing.rotation.y += dt * 1.8;
      cursorRing.rotation.x += dt * 1.1;

      const model = runtime.model;
      if (model) {
        const s = THREE.MathUtils.damp(model.group.scale.x, smoothTargetRef.current.scale, 9, dt);
        const sy = THREE.MathUtils.damp(
          model.group.scale.y,
          smoothTargetRef.current.scale * smoothTargetRef.current.height,
          9,
          dt
        );
        model.group.scale.set(s, sy, s);

        if (!cfg.frozen) {
          if (activeControl && currentGesture === 'palm_5') {
            model.group.rotation.y = THREE.MathUtils.damp(
              model.group.rotation.y,
              smoothTargetRef.current.rotOffset,
              7,
              dt
            );
          } else if (cfg.autoSpin) {
            model.group.rotation.y += dt * 0.34 * cfg.simSpeed;
          }
        }

        // Smooth explode factor for all composite parts
        const expTarget = smoothTargetRef.current.explode;
        for (const part of model.explodables) {
          _v3TmpB.copy(part.basePos).addScaledVector(part.explodeDir, expTarget * 1.35);
          part.mesh.position.lerp(_v3TmpB, 1 - Math.exp(-9 * dt));
        }

        // Dynamic wave surface animation
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

        // Quantum atom electron orbital motion
        if (model.atomElectrons && !cfg.frozen) {
          for (const item of model.atomElectrons) {
            const ang = elapsed * item.speed * cfg.simSpeed + item.phase;
            _v3TmpA.set(Math.cos(ang) * item.ringRadius, Math.sin(ang) * item.ringRadius, 0);
            _eulerTmp.copy(item.tiltEuler);
            _v3TmpA.applyEuler(_eulerTmp);
            _v3TmpA.y += 2.05;
            item.mesh.position.copy(_v3TmpA);
          }
        }

        // Sphere cross-section glowing ring tracker
        if (model.sphereCutRing) {
          const R = 1.95;
          const centerY = R + 0.15;
          const worldSliceY = smoothTargetRef.current.sliceY / Math.max(0.4, sy);
          const d = Math.abs(worldSliceY - centerY);
          if (cfg.sliceEnabled && d < R * 0.98) {
            model.sphereCutRing.visible = true;
            const rCut = Math.sqrt(R * R - d * d);
            model.sphereCutRing.scale.set(rCut, rCut, 1);
            model.sphereCutRing.position.y = worldSliceY;
          } else {
            model.sphereCutRing.visible = false;
          }
        }
      }

      // Clipping plane sync
      if (cfg.sliceEnabled) {
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
      controls.dispose();
      disposeModel(runtime.model);
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
      tipSensorMat.dispose();
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
  }, [disposeModel, onEarnXP, rebuildModel]);

  // Rebuild model cleanly whenever shape, material finish, or accent color changes
  useEffect(() => {
    const rt = runtimeRef.current;
    if (!rt) return;
    const softwareGl = isSoftwareWebGL();
    rebuildModel(rt, modeId, finish, activePalette, softwareGl);
  }, [modeId, finish, activePalette, rebuildModel]);

  // Clean up webcam stream on unmount or stop
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

  // Attach active MediaStream immediately when video element is mounted
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
          ? 'Camera API is unavailable in this browser. Use the Virtual Gesture Pad below.'
          : 'Trình duyệt không hỗ trợ Camera API. Bạn vẫn dùng được Bàn di Cử chỉ Ảo bên dưới!'
      );
      return;
    }

    setCameraLoading(true);
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: false
        });
      } catch (constraintErr) {
        const name = constraintErr instanceof Error ? constraintErr.name : '';
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          throw constraintErr;
        }
        // Fallback for desktop webcams that reject facingMode/resolution constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      streamRef.current = stream;
      setCameraActive(true);
      setCameraLoading(false);
      showToast(
        isEn
          ? 'Camera active! Hold palm inside center dashed box & click Calibrate.'
          : 'Webcam đã bật! Đưa tay vào khung đứt nét giữa màn hình và bấm Hiệu chỉnh Da.'
      );
    } catch (err) {
      setCameraLoading(false);
      setCameraActive(false);
      const message = err instanceof Error ? err.message : 'Permission denied';
      setCameraError(
        isEn
          ? `Camera access unavailable (${message}). Please allow Camera in your browser bar, then retry.`
          : `Chưa cấp quyền Webcam (${message}). Hãy chọn "Cho phép (Allow)" trên thanh địa chỉ trình duyệt rồi bấm Bật Webcam lại.`
      );
    }
  }, [isEn, showToast]);

  const handleCalibrateSkin = useCallback(() => {
    if (!videoRef.current || !trackerRef.current) return;
    const ok = trackerRef.current.calibrateCenter(videoRef.current, mirrorCamera);
    if (ok) {
      showToast(
        isEn
          ? 'Skin & lighting profile calibrated!'
          : 'Đã hiệu chỉnh màu da & ánh sáng thành công!'
      );
    } else {
      showToast(
        isEn
          ? 'Hold palm steady inside center box then click again.'
          : 'Hãy đặt lòng bàn tay vào ô trung tâm rồi bấm hiệu chỉnh lại.'
      );
    }
  }, [isEn, mirrorCamera, showToast]);

  const handleUndoStroke = useCallback(() => {
    const rt = runtimeRef.current;
    if (!rt) return;
    const last = rt.strokeMeshes.pop();
    rt.strokePointsLists.pop();
    if (last) {
      rt.strokesGroup.remove(last);
      last.geometry.dispose();
      (last.material as THREE.Material).dispose();
      setStrokeCount(rt.strokeMeshes.length);
    }
  }, []);

  const handleClearStrokes = useCallback(() => {
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
    rt.strokePointsLists = [];
    rt.markerMeshes = [];
    setStrokeCount(0);
    setMarkerCount(0);
    showToast(isEn ? 'Cleared all Oxyz strokes & markers.' : 'Đã xóa sạch nét vẽ & điểm đánh dấu Oxyz.');
  }, [isEn, showToast]);

  const handleResetView = useCallback(() => {
    setScaleVal(1.0);
    setHeightVal(1.0);
    setExplodeVal(0.15);
    setSliceEnabled(false);
    setSliceY(2.4);
    setSimSpeed(1.0);
    setFrozen(false);
    setAutoSpin(true);
    smoothTargetRef.current = {
      scale: 1.0,
      height: 1.0,
      explode: 0.15,
      sliceY: 2.4,
      rotOffset: 0,
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
    }
  }, []);

  const handleSnapshot = useCallback(() => {
    const rt = runtimeRef.current;
    if (!rt) return;
    rt.renderer.render(rt.scene, rt.camera);
    const dataUrl = rt.renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `synapse-spatial3d-${modeId}.png`;
    a.click();
    showToast(isEn ? 'Saved 3D PNG snapshot!' : 'Đã tải ảnh chụp 3D chất lượng cao!');
  }, [isEn, modeId, showToast]);

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
          const a = index.getX(i) + vertexOffset;
          const b = index.getX(i + 1) + vertexOffset;
          const c = index.getX(i + 2) + vertexOffset;
          objOutput += `f ${a} ${b} ${c}\n`;
        }
      } else {
        for (let i = 0; i < pos.count; i += 3) {
          const a = i + vertexOffset;
          const b = i + 1 + vertexOffset;
          const c = i + 2 + vertexOffset;
          objOutput += `f ${a} ${b} ${c}\n`;
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

  // Keyboard shortcuts: H = Hide HUD, R = Reset, Space = Freeze/Unfreeze
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

  // Interactive Virtual 2D Gesture Pad pointer handler (works without webcam)
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
    <div
      ref={stageContainerRef}
      className={`relative w-full overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#050914] text-slate-100 shadow-2xl select-none ${
        isFullscreen ? 'h-screen rounded-none border-0' : 'h-[calc(100vh-128px)] min-h-[640px]'
      }`}
    >
      {/* Dedicated Three.js Canvas Mount (Isolated Ref) */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full" />

      {/* Top HUD Bar (Solid Obsidian, zero backdrop-blur over WebGL) */}
      {!hudHidden && (
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/95 border border-slate-700/80 hover:border-cyan-400 text-xs font-bold text-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isEn ? 'Back' : 'Quay lại'}</span>
              </button>
            )}

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/95 border border-cyan-500/40">
              <Hand className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="leading-tight">
                <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <span>{isEn ? 'Spatial 3D Gesture Lab' : 'Học Cảm Giác 3D'}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-cyan-300">{activeMode.badge}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {isEn ? activeMode.titleEn : activeMode.titleVi}
                </div>
              </div>
            </div>

            {/* Active Gesture Static Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/95 border border-slate-700/80 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: currentGestureMeta.accent }}
              />
              <span className="font-bold text-slate-100">
                {isEn ? currentGestureMeta.labelEn : currentGestureMeta.labelVi}
              </span>
              {cameraActive && (
                <span className="text-[11px] font-mono text-cyan-300">
                  · {handFrame.detected ? `${Math.round(handFrame.confidence * 100)}%` : isEn ? 'Scanning' : 'Đang quét'}
                </span>
              )}
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
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-extrabold transition-colors cursor-pointer ${
                cameraActive
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-400 border-cyan-300 text-slate-950'
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
                  : 'Bật Webcam Quét Tay'}
              </span>
            </button>

            {cameraActive && (
              <button
                type="button"
                onClick={handleCalibrateSkin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold cursor-pointer"
                title={isEn ? 'Calibrate hand skin tone in center box' : 'Hiệu chỉnh màu da tay trong ô giữa'}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>{isEn ? 'Calibrate' : 'Hiệu chỉnh Da'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleMusic}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                isBgPlaying && bgSound !== 'off'
                  ? 'bg-emerald-950/95 border-emerald-400/70 text-emerald-300'
                  : 'bg-slate-950/95 border-slate-700/80 text-slate-200 hover:border-cyan-400'
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
              className={`p-2 rounded-xl border text-xs font-bold cursor-pointer ${
                frozen
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-950/95 border-slate-700/80 text-slate-200 hover:border-cyan-400'
              }`}
              title={isEn ? 'Pause / Freeze (Space)' : 'Đóng băng / Chạy (Phím Space)'}
            >
              {frozen ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleResetView}
              className="p-2 rounded-xl bg-slate-950/95 border border-slate-700/80 hover:border-cyan-400 text-slate-200 cursor-pointer"
              title={isEn ? 'Reset Camera & Params (R)' : 'Đặt lại góc nhìn (Phím R)'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setHudHidden(true)}
              className="p-2 rounded-xl bg-slate-950/95 border border-slate-700/80 hover:border-cyan-400 text-slate-200 cursor-pointer"
              title={isEn ? 'Hide HUD (H)' : 'Ẩn giao diện (Phím H)'}
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="p-2 rounded-xl bg-slate-950/95 border border-slate-700/80 hover:border-cyan-400 text-slate-200 cursor-pointer"
              title={isEn ? 'Fullscreen' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Restore HUD Floating Button in Zen Mode */}
      {hudHidden && (
        <button
          type="button"
          onClick={() => setHudHidden(false)}
          className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/95 border border-cyan-400/60 text-xs font-bold text-cyan-300 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isEn ? 'Show HUD (H)' : 'Hiện Bảng Điều Khiển (H)'}</span>
        </button>
      )}

      {/* Compact Top-Right Corner Telemetry & Webcam PiP (keeps center 3D unobstructed) */}
      {!hudHidden && (
        <div className="absolute top-16 right-3 z-20 flex flex-col items-end gap-2 max-w-[232px]">
          {/* Formula & Live Metric Chip */}
          <div className="w-full rounded-2xl bg-slate-950/95 border border-slate-700/85 p-2.5 text-[11px] space-y-1">
            <div className="font-mono font-bold text-cyan-300 truncate">{activeMode.formula}</div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-slate-300 font-mono text-[10px]">
              <span>{liveTelemetry.metricA}</span>
              <span>·</span>
              <span>{liveTelemetry.metricB}</span>
            </div>
            <div className="text-[10px] text-slate-400">{liveTelemetry.metricC}</div>
          </div>

          {/* Live Webcam Skeleton PiP */}
          {cameraActive && (
            <div className="relative w-[216px] h-[162px] rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-400/60 shadow-xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${mirrorCamera ? '-scale-x-100' : ''}`}
              />
              <canvas
                ref={overlayCanvasRef}
                width={216}
                height={162}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between px-2 py-0.5 rounded-lg bg-slate-950/90 text-[10px] font-mono text-cyan-200">
                <span>
                  {handFrame.detected
                    ? `${Math.min(5, handFrame.fingerCount)}/5 ${isEn ? 'fingertip sensors' : 'cảm biến đầu ngón'}`
                    : isEn
                    ? 'Show 1–5 fingertips'
                    : 'Đưa 1–5 đầu ngón vào'}
                </span>
                <span>{currentGestureMeta.fingers}</span>
              </div>
            </div>
          )}

          {/* Zero-Hardware Virtual Hand Interactive Pad (when camera is off) */}
          {!cameraActive && showVirtualPad && (
            <div className="w-[216px] rounded-2xl bg-slate-950/95 border border-slate-700/85 p-2 space-y-1.5">
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
                className="relative w-full h-[112px] rounded-xl bg-slate-900 border border-cyan-500/35 cursor-crosshair overflow-hidden touch-none"
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
                  {isEn ? 'Drag to sculpt / control' : 'Chạm & kéo để điều khiển 3D'}
                </span>
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

      {/* Camera Warning Banner */}
      {cameraError && !hudHidden && (
        <div className="absolute top-16 left-3 z-20 max-w-sm rounded-xl bg-amber-950/95 border border-amber-500/50 px-3 py-2 text-[11px] text-amber-200">
          {cameraError}
        </div>
      )}

      {/* UNIFIED COLLAPSIBLE BOTTOM CONTROL DOCK */}
      {!hudHidden && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[min(940px,96vw)] flex flex-col items-center">
          {/* Collapse / Expand Pill Handle */}
          <button
            type="button"
            onClick={() => setDockCollapsed((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-1 rounded-t-xl bg-slate-950/95 border border-b-0 border-slate-700/80 text-[11px] font-bold text-slate-300 hover:text-cyan-300 cursor-pointer"
          >
            {dockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>
              {dockCollapsed
                ? isEn
                  ? 'Show 3D Controls'
                  : 'Mở Bảng Điều Chỉnh 3D'
                : isEn
                ? 'Collapse Dock'
                : 'Thu gọn'}
            </span>
          </button>

          {!dockCollapsed && (
            <div className="w-full rounded-2xl bg-slate-950/95 border border-slate-700/85 shadow-2xl p-3 space-y-2.5">
              {/* Dock Tabs + Quick Action Chips */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: 'gesture', labelVi: 'Cử Chỉ Tay & Cam', labelEn: 'Hand & Camera', icon: Hand },
                      { id: 'shapes', labelVi: '10 Mô Hình & Mô Phỏng', labelEn: '10 Shapes & Sims', icon: Box },
                      { id: 'params', labelVi: 'Thông Số & Cắt Lớp', labelEn: 'Params & Slice', icon: Sliders },
                      { id: 'style', labelVi: 'Chất Liệu & Xuất File', labelEn: 'Finish & Export', icon: Sparkles }
                    ] as const
                  ).map((tab) => {
                    const Icon = tab.icon;
                    const active = dockTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setDockTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          active
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{isEn ? tab.labelEn : tab.labelVi}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Always-reachable Sculpt & Export Shortcuts */}
                <div className="flex items-center gap-1.5">
                  {!cameraActive && !showVirtualPad && (
                    <button
                      type="button"
                      onClick={() => setShowVirtualPad(true)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-[11px] font-bold text-cyan-300 cursor-pointer"
                    >
                      {isEn ? 'Show Touch Pad' : 'Hiện Bàn Di 3D'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleUndoStroke}
                    disabled={strokeCount === 0}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-40 text-[11px] font-bold text-slate-200 hover:border-cyan-400 cursor-pointer"
                    title={isEn ? 'Undo last Oxyz 3D stroke' : 'Hoàn tác nét vẽ 3D'}
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>{strokeCount > 0 ? `(${strokeCount})` : ''}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearStrokes}
                    disabled={strokeCount === 0 && markerCount === 0}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-40 text-[11px] font-bold text-rose-300 hover:border-rose-400 cursor-pointer"
                    title={isEn ? 'Clear Oxyz strokes' : 'Xóa tất cả nét vẽ Oxyz'}
                  >
                    <Eraser className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* TAB 1: HAND GESTURE & CAMERA CONTROLS */}
              {dockTab === 'gesture' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
                    {GESTURE_DEFINITIONS.map((g) => {
                      const active =
                        (cameraActive && handFrame.detected ? handFrame.gesture : virtualGesture) === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            setVirtualGesture(g.id);
                            if (g.id === 'morph_3') {
                              setExplodeVal((prev) => (prev > 0.6 ? 0.15 : 0.85));
                            } else if (g.id === 'slice_2') {
                              setSliceEnabled(true);
                            } else if (g.id === 'fist_0') {
                              setFrozen((v) => !v);
                            }
                          }}
                          className={`text-left p-2 rounded-xl border transition-all cursor-pointer ${
                            active
                              ? 'bg-slate-800 border-cyan-400 text-white'
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

                  {/* Camera Tuning Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 items-center text-[11px]">
                    <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      <span className="text-slate-300 font-semibold">
                        {isEn ? 'Sensitivity' : 'Độ nhạy Quét'} ({sensitivity.toFixed(2)}x)
                      </span>
                      <input
                        type="range"
                        min={0.6}
                        max={1.5}
                        step={0.05}
                        value={sensitivity}
                        onChange={(e) => setSensitivity(Number(e.target.value))}
                        className="w-24 accent-cyan-400"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      <span className="text-slate-300 font-semibold">
                        {isEn ? 'Smoothing' : 'Độ mượt Tay'} ({Math.round(smoothing * 100)}%)
                      </span>
                      <input
                        type="range"
                        min={0.1}
                        max={0.9}
                        step={0.05}
                        value={smoothing}
                        onChange={(e) => setSmoothing(Number(e.target.value))}
                        className="w-24 accent-cyan-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMirrorCamera((v) => !v)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                          mirrorCamera
                            ? 'bg-cyan-500/15 border-cyan-400/60 text-cyan-300'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}
                      >
                        <FlipHorizontal className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Mirror Cam' : 'Lật Gương'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          trackerRef.current?.resetCalibration();
                          showToast(isEn ? 'Reset skin profile' : 'Đã đặt lại bộ lọc da tay mặc định');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-300 cursor-pointer"
                      >
                        {isEn ? 'Reset Filter' : 'Reset Bộ Lọc'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: 10 SPATIAL GEOMETRIES & MODERN SIMULATIONS */}
              {dockTab === 'shapes' && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {SPATIAL_MODES.map((m) => {
                    const active = modeId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setModeId(m.id)}
                        className={`text-left p-2 rounded-xl border transition-all cursor-pointer ${
                          active
                            ? 'bg-cyan-500/18 border-cyan-400 text-white'
                            : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[9px] font-mono">
                          <span className={m.group === 'geometry' ? 'text-sky-300' : 'text-emerald-300'}>
                            {m.group === 'geometry'
                              ? isEn
                                ? 'GEOMETRY'
                                : 'HÌNH HỌC'
                              : isEn
                              ? 'SIMULATION'
                              : 'MÔ PHỎNG'}
                          </span>
                          <span className="text-slate-400">{m.badge}</span>
                        </div>
                        <div className="text-[11px] font-bold mt-0.5 truncate">
                          {isEn ? m.titleEn : m.titleVi}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: DIMENSIONS, EXPLODE & CROSS-SECTION SLICE */}
              {dockTab === 'params' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px]">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>{isEn ? 'Scale (Pinch)' : 'Tỷ lệ Khối'}</span>
                      <span className="font-mono text-cyan-300">{scaleVal.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={1.75}
                      step={0.05}
                      value={scaleVal}
                      onChange={(e) => setScaleVal(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>{isEn ? 'Height / Amplitude' : 'Chiều cao / Biên độ'}</span>
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

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>{isEn ? 'Explode Layers (5 Fingers)' : 'Tách Lớp (5 Ngón)'}</span>
                      <span className="font-mono text-emerald-300">{Math.round(explodeVal * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1.2}
                      step={0.05}
                      value={explodeVal}
                      onChange={(e) => setExplodeVal(Number(e.target.value))}
                      className="w-full accent-emerald-400"
                    />
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <button
                        type="button"
                        onClick={() => setSliceEnabled((v) => !v)}
                        className={`flex items-center gap-1 cursor-pointer ${
                          sliceEnabled ? 'text-purple-300' : 'text-slate-400'
                        }`}
                      >
                        <Scissors className="w-3.5 h-3.5" />
                        <span>{sliceEnabled ? (isEn ? 'Slice ON' : 'Cắt Lớp BẬT') : isEn ? 'Slice OFF' : 'Mặt Cắt TẮT'}</span>
                      </button>
                      <span className="font-mono text-purple-300">{sliceY.toFixed(2)}m</span>
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
                      className="w-full accent-purple-400"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: MATERIAL FINISH, COLORS, AXES & EXPORT */}
              {dockTab === 'style' && (
                <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {FINISH_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFinish(opt.id)}
                        className={`px-3 py-1.5 rounded-xl border font-bold cursor-pointer ${
                          finish === opt.id
                            ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        {isEn ? opt.labelEn : opt.labelVi}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {ACCENT_PALETTES.map((pal) => (
                      <button
                        key={pal.id}
                        type="button"
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
                    <button
                      type="button"
                      onClick={() => setShowAxes((v) => !v)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-bold cursor-pointer ${
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
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-bold cursor-pointer ${
                        autoSpin
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Orbit className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Spin' : 'Xoay'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSnapshot}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-100 font-bold cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-cyan-300" />
                      <span>PNG</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportOBJ}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-100 font-bold cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5 text-amber-300" />
                      <span>.OBJ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
