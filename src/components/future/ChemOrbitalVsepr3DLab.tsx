import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Atom, Camera, Pause, Play, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  captureCanvasPng,
  exportRowsToCsv,
  MiniTelemetryChart,
  RecordVideoButton,
  useCanvasRecorder
} from '../common/SimProToolkit';
import { SimAnalysisProBar } from '../common/SimAnalysisProBar';
import {
  applyClipPlaneToObject,
  CameraBookmarkPose,
  detectSoftwareGl,
  Pre3DProControlsBar,
  QuickCamPreset,
  scheduleSyncedGlFrame,
  SliceAxis,
  updateClipPlaneFromState
} from './Pre3DViewportBar';

interface ChemOrbitalVsepr3DLabProps {
  onEarnXP?: (xp: number) => void;
}

type VseprPresetId = 'sp' | 'sp2' | 'sp3' | 'sp3d' | 'sp3d2' | 'p_z' | 'd_z2';

interface VseprConfig {
  id: VseprPresetId;
  nameVi: string;
  nameEn: string;
  formulaExample: string;
  geometryVi: string;
  geometryEn: string;
  bondAngleDeg: number;
  hybridization: string;
  vectors: [number, number, number][];
}

const DEFAULT_CAM_POS: [number, number, number] = [4.5, 3.2, 5.2];
const DEFAULT_CAM_TARGET: [number, number, number] = [0, 0, 0];

const VSEPR_PRESETS: VseprConfig[] = [
  {
    id: 'sp',
    nameVi: 'Lai hóa sp (Thẳng)',
    nameEn: 'sp Hybrid (Linear)',
    formulaExample: 'BeCl₂ / CO₂',
    geometryVi: 'Đường thẳng · 180°',
    geometryEn: 'Linear · 180°',
    bondAngleDeg: 180,
    hybridization: 'sp (2 AO)',
    vectors: [[1, 0, 0], [-1, 0, 0]]
  },
  {
    id: 'sp2',
    nameVi: 'Lai hóa sp² (Tam giác phẳng)',
    nameEn: 'sp² Hybrid (Trigonal Planar)',
    formulaExample: 'BF₃ / C₂H₄',
    geometryVi: 'Tam giác phẳng · 120°',
    geometryEn: 'Trigonal Planar · 120°',
    bondAngleDeg: 120,
    hybridization: 'sp² (3 AO)',
    vectors: [
      [1, 0, 0],
      [-0.5, 0, 0.866],
      [-0.5, 0, -0.866]
    ]
  },
  {
    id: 'sp3',
    nameVi: 'Lai hóa sp³ (Tứ diện)',
    nameEn: 'sp³ Hybrid (Tetrahedral)',
    formulaExample: 'CH₄ / NH₄⁺',
    geometryVi: 'Tứ diện đều · 109.5°',
    geometryEn: 'Tetrahedral · 109.5°',
    bondAngleDeg: 109.5,
    hybridization: 'sp³ (4 AO)',
    vectors: [
      [0, 1, 0],
      [0.943, -0.333, 0],
      [-0.471, -0.333, 0.816],
      [-0.471, -0.333, -0.816]
    ]
  },
  {
    id: 'sp3d',
    nameVi: 'Lai hóa sp³d (Lưỡng tháp tam giác)',
    nameEn: 'sp³d Hybrid (Trigonal Bipyramidal)',
    formulaExample: 'PCl₅',
    geometryVi: 'Lưỡng tháp tam giác · 90° / 120°',
    geometryEn: 'Trigonal Bipyramidal · 90° / 120°',
    bondAngleDeg: 90,
    hybridization: 'sp³d (5 AO)',
    vectors: [
      [0, 1, 0],
      [0, -1, 0],
      [1, 0, 0],
      [-0.5, 0, 0.866],
      [-0.5, 0, -0.866]
    ]
  },
  {
    id: 'sp3d2',
    nameVi: 'Lai hóa sp³d² (Bát diện)',
    nameEn: 'sp³d² Hybrid (Octahedral)',
    formulaExample: 'SF₆',
    geometryVi: 'Bát diện đều · 90°',
    geometryEn: 'Octahedral · 90°',
    bondAngleDeg: 90,
    hybridization: 'sp³d² (6 AO)',
    vectors: [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1]
    ]
  },
  {
    id: 'p_z',
    nameVi: 'Orbital Lượng tử 2p_z',
    nameEn: 'Quantum 2p_z Orbital',
    formulaExample: 'n=2, l=1, m=0',
    geometryVi: 'Hình số 8 đối xứng (+ψ / −ψ)',
    geometryEn: 'Dumbbell Lobes (+ψ / −ψ)',
    bondAngleDeg: 180,
    hybridization: '2p_z AO',
    vectors: [[0, 1, 0], [0, -1, 0]]
  },
  {
    id: 'd_z2',
    nameVi: 'Orbital Lượng tử 3d_z²',
    nameEn: 'Quantum 3d_z² Orbital',
    formulaExample: 'n=3, l=2, m=0',
    geometryVi: '2 thùy dọc + vành xuyến mặt phẳng XY',
    geometryEn: 'Axial Lobes + Equatorial Torus',
    bondAngleDeg: 90,
    hybridization: '3d_z² AO',
    vectors: [[0, 1, 0], [0, -1, 0]]
  }
];

export const ChemOrbitalVsepr3DLab: React.FC<ChemOrbitalVsepr3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [presetId, setPresetId] = useState<VseprPresetId>('sp3');
  const [lonePairs, setLonePairs] = useState<number>(0);
  const [lobeScale, setLobeScale] = useState<number>(1.0);
  const [cloudOpacity, setCloudOpacity] = useState<number>(0.72);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [rotSpeed, setRotSpeed] = useState<number>(0.8);
  const [sliceEnabled, setSliceEnabled] = useState<boolean>(false);
  const [sliceAxis, setSliceAxis] = useState<SliceAxis>('y');
  const [sliceOffset, setSliceOffset] = useState<number>(0.5);
  const [showTelemetry, setShowTelemetry] = useState<boolean>(false);
  const [telemetryRows, setTelemetryRows] = useState<{ t: string; angle: number; density: number; aoCount: number }[]>([]);
  const [bookmark, setBookmark] = useState<CameraBookmarkPose | null>(null);
  const [isSoftwareGl] = useState(() => detectSoftwareGl());

  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const clipPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.5));
  const exploredRef = useRef<Set<VseprPresetId>>(new Set(['sp3']));

  const recorder = useCanvasRecorder(() => canvasRef.current, `synapse-pre-vsepr-${presetId}`);

  const activePreset = useMemo(
    () => VSEPR_PRESETS.find((p) => p.id === presetId) || VSEPR_PRESETS[2],
    [presetId]
  );

  const effectiveAngleDeg = useMemo(() => {
    const maxLp = Math.max(0, activePreset.vectors.length - 2);
    const clampedLp = Math.min(lonePairs, maxLp);
    if (presetId === 'p_z' || presetId === 'd_z2') return activePreset.bondAngleDeg;
    return Math.max(82, Math.round((activePreset.bondAngleDeg - clampedLp * 2.5) * 10) / 10);
  }, [activePreset, lonePairs, presetId]);

  const liveRef = useRef({
    presetId,
    lonePairs,
    lobeScale,
    cloudOpacity,
    isPaused,
    rotSpeed,
    sliceEnabled
  });
  liveRef.current = {
    presetId,
    lonePairs,
    lobeScale,
    cloudOpacity,
    isPaused,
    rotSpeed,
    sliceEnabled
  };

  const selectPreset = (id: VseprPresetId) => {
    setPresetId(id);
    if (!exploredRef.current.has(id)) {
      exploredRef.current.add(id);
      if (exploredRef.current.size >= 4) onEarnXP?.(25);
    }
  };

  useEffect(() => {
    updateClipPlaneFromState(clipPlaneRef.current, sliceAxis, sliceOffset);
    if (modelGroupRef.current) {
      applyClipPlaneToObject(modelGroupRef.current, sliceEnabled ? [clipPlaneRef.current] : null);
    }
  }, [sliceEnabled, sliceAxis, sliceOffset]);

  useEffect(() => {
    if (!showTelemetry) return;
    const pushPoint = () => {
      const nowLabel = new Date().toLocaleTimeString('en-GB', { hour12: false });
      setTelemetryRows((prev) => [
        ...prev.slice(-39),
        {
          t: nowLabel,
          angle: effectiveAngleDeg,
          density: Math.round(cloudOpacity * 100),
          aoCount: activePreset.vectors.length
        }
      ]);
    };
    pushPoint();
    const id = window.setInterval(pushPoint, 450);
    return () => window.clearInterval(id);
  }, [showTelemetry, effectiveAngleDeg, cloudOpacity, activePreset.vectors.length]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090f1d);

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 480;
    const camera = new THREE.PerspectiveCamera(44, w / h, 0.1, 100);
    camera.position.set(...DEFAULT_CAM_POS);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.localClippingEnabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    canvasRef.current = renderer.domElement;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmrem.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.target.set(...DEFAULT_CAM_TARGET);
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(6, 8, 6);
    scene.add(key);

    const grid = new THREE.GridHelper(10, 12, 0x1e293b, 0x0f172a);
    grid.position.y = -2.2;
    scene.add(grid);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    const disposables: { dispose: () => void }[] = [];
    const upVec = new THREE.Vector3(0, 1, 0);
    const dirVec = new THREE.Vector3();

    const rebuildModel = () => {
      while (modelGroup.children.length > 0) {
        modelGroup.remove(modelGroup.children[0]);
      }
      disposables.forEach((d) => d.dispose());
      disposables.length = 0;

      const cur = liveRef.current;
      const cfg = VSEPR_PRESETS.find((p) => p.id === cur.presetId) || VSEPR_PRESETS[2];
      const activePlanes = cur.sliceEnabled ? [clipPlaneRef.current] : null;

      const nucGeo = new THREE.SphereGeometry(0.32, 24, 24);
      const nucMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.25,
        metalness: 0.4,
        clippingPlanes: activePlanes
      });
      modelGroup.add(new THREE.Mesh(nucGeo, nucMat));
      disposables.push(nucGeo, nucMat);

      if (cur.presetId === 'p_z' || cur.presetId === 'd_z2') {
        const gTop = new THREE.SphereGeometry(0.88 * cur.lobeScale, 28, 24);
        const mPos = new THREE.MeshStandardMaterial({
          color: 0x0ea5e9,
          transparent: true,
          opacity: cur.cloudOpacity,
          roughness: 0.22,
          clippingPlanes: activePlanes
        });
        const mNeg = new THREE.MeshStandardMaterial({
          color: 0xf43f5e,
          transparent: true,
          opacity: cur.cloudOpacity,
          roughness: 0.22,
          clippingPlanes: activePlanes
        });
        const topMesh = new THREE.Mesh(gTop, mPos);
        topMesh.scale.set(0.7, 1.45, 0.7);
        topMesh.position.set(0, 1.18 * cur.lobeScale, 0);

        const botMesh = new THREE.Mesh(gTop, mNeg);
        botMesh.scale.set(0.7, 1.45, 0.7);
        botMesh.position.set(0, -1.18 * cur.lobeScale, 0);
        modelGroup.add(topMesh, botMesh);
        disposables.push(gTop, mPos, mNeg);

        if (cur.presetId === 'd_z2') {
          const torGeo = new THREE.TorusGeometry(1.15 * cur.lobeScale, 0.24 * cur.lobeScale, 18, 48);
          const torMat = new THREE.MeshStandardMaterial({
            color: 0xa855f7,
            transparent: true,
            opacity: cur.cloudOpacity * 0.85,
            roughness: 0.25,
            clippingPlanes: activePlanes
          });
          const torMesh = new THREE.Mesh(torGeo, torMat);
          torMesh.rotation.x = Math.PI / 2;
          modelGroup.add(torMesh);
          disposables.push(torGeo, torMat);
        }
        return;
      }

      const maxLp = Math.max(0, cfg.vectors.length - 2);
      const activeLp = Math.min(cur.lonePairs, maxLp);
      const bondLen = 2.05 * cur.lobeScale;

      const bondMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.5, clippingPlanes: activePlanes });
      const ligMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25, metalness: 0.35, clippingPlanes: activePlanes });
      const lpMat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        transparent: true,
        opacity: cur.cloudOpacity,
        roughness: 0.2,
        clippingPlanes: activePlanes
      });
      const orbitalMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: cur.cloudOpacity * 0.45,
        roughness: 0.28,
        clippingPlanes: activePlanes
      });
      disposables.push(bondMat, ligMat, lpMat, orbitalMat);

      cfg.vectors.forEach((rawV, idx) => {
        dirVec.set(rawV[0], rawV[1], rawV[2]).normalize();
        const isLone = idx < activeLp;

        if (isLone) {
          const lobeGeo = new THREE.SphereGeometry(0.42 * cur.lobeScale, 20, 18);
          const lobeMesh = new THREE.Mesh(lobeGeo, lpMat);
          lobeMesh.scale.set(0.85, 1.5, 0.85);
          lobeMesh.quaternion.setFromUnitVectors(upVec, dirVec);
          lobeMesh.position.copy(dirVec).multiplyScalar(0.92 * cur.lobeScale);
          modelGroup.add(lobeMesh);
          disposables.push(lobeGeo);
        } else {
          const cylGeo = new THREE.CylinderGeometry(0.06, 0.06, bondLen, 12);
          const cyl = new THREE.Mesh(cylGeo, bondMat);
          cyl.quaternion.setFromUnitVectors(upVec, dirVec);
          cyl.position.copy(dirVec).multiplyScalar(bondLen * 0.5);

          const ligGeo = new THREE.SphereGeometry(0.24, 20, 20);
          const lig = new THREE.Mesh(ligGeo, ligMat);
          lig.position.copy(dirVec).multiplyScalar(bondLen);

          const envGeo = new THREE.SphereGeometry(0.35 * cur.lobeScale, 18, 16);
          const env = new THREE.Mesh(envGeo, orbitalMat);
          env.scale.set(0.75, 1.5, 0.75);
          env.quaternion.setFromUnitVectors(upVec, dirVec);
          env.position.copy(dirVec).multiplyScalar(bondLen * 0.48);

          modelGroup.add(cyl, lig, env);
          disposables.push(cylGeo, ligGeo, envGeo);
        }
      });
    };

    rebuildModel();

    let cancelNextFrame = () => {};
    let disposed = false;
    let last = performance.now();
    let prevSig = '';

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 800;
      const nh = container.clientHeight || 480;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const cur = liveRef.current;
      const sig = `${cur.presetId}|${cur.lonePairs}|${cur.lobeScale}|${cur.cloudOpacity}`;
      if (sig !== prevSig) {
        prevSig = sig;
        rebuildModel();
      }
      if (!cur.isPaused) {
        modelGroup.rotation.y += dt * cur.rotSpeed * 0.7;
      }
      controls.update();
      renderer.render(scene, camera);
      if (!disposed) {
        scheduleSyncedGlFrame(renderer, isSoftwareGl, tick, (c) => {
          cancelNextFrame = c;
        });
      }
    };

    scheduleSyncedGlFrame(renderer, isSoftwareGl, tick, (c) => {
      cancelNextFrame = c;
    });

    return () => {
      disposed = true;
      cancelNextFrame();
      ro.disconnect();
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      envRT.dispose();
      renderer.dispose();
      cameraRef.current = null;
      controlsRef.current = null;
      modelGroupRef.current = null;
    };
  }, [isSoftwareGl]);

  const applyCameraPreset = (preset: QuickCamPreset) => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    if (preset === 'iso') cam.position.set(...DEFAULT_CAM_POS);
    else if (preset === 'top') cam.position.set(0.01, 7.2, 0.01);
    else cam.position.set(0, 0.6, 6.4);
    ctrl.target.set(...DEFAULT_CAM_TARGET);
    ctrl.update();
  };

  const resetCamera = () => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    cam.position.set(...DEFAULT_CAM_POS);
    ctrl.target.set(...DEFAULT_CAM_TARGET);
    ctrl.update();
  };

  const handleSaveBookmark = () => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    setBookmark({
      pos: [cam.position.x, cam.position.y, cam.position.z],
      target: [ctrl.target.x, ctrl.target.y, ctrl.target.z]
    });
  };

  const handleRecallBookmark = () => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl || !bookmark) return;
    cam.position.set(...bookmark.pos);
    ctrl.target.set(...bookmark.target);
    ctrl.update();
  };

  const handleReset = () => {
    setPresetId('sp3');
    setLonePairs(0);
    setLobeScale(1.0);
    setCloudOpacity(0.72);
    setRotSpeed(0.8);
    setIsPaused(false);
    setSliceEnabled(false);
    resetCamera();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              {isEn ? '3D Quantum Orbitals & VSEPR Hybridization Studio' : 'Orbital Lượng Tử 3D & Lai Hóa VSEPR'}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPaused((v) => !v)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPaused ? (isEn ? 'Rotate' : 'Xoay') : (isEn ? 'Pause' : 'Dừng')}</span>
            </button>
            <RecordVideoButton
              isRecording={recorder.isRecording}
              recordSeconds={recorder.recordSeconds}
              onToggle={recorder.toggleRecording}
              supported={recorder.supported}
              isEn={isEn}
            />
            <button
              type="button"
              onClick={() => captureCanvasPng(canvasRef.current, `chem-vsepr-${presetId}`)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Camera className="w-3.5 h-3.5 text-sky-400" />
              <span>PNG</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
              title={isEn ? 'Reset Lab' : 'Đặt lại'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <Pre3DProControlsBar
          isEn={isEn}
          sliceEnabled={sliceEnabled}
          onToggleSlice={() => setSliceEnabled((v) => !v)}
          sliceAxis={sliceAxis}
          onChangeSliceAxis={setSliceAxis}
          sliceOffset={sliceOffset}
          onChangeSliceOffset={setSliceOffset}
          sliceMin={-2.5}
          sliceMax={2.5}
          showTelemetry={showTelemetry}
          onToggleTelemetry={() => setShowTelemetry((v) => !v)}
          hasBookmark={Boolean(bookmark)}
          onSaveBookmark={handleSaveBookmark}
          onRecallBookmark={handleRecallBookmark}
          onCameraPreset={applyCameraPreset}
          onResetCamera={resetCamera}
        />

        <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap gap-1.5">
          {VSEPR_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPreset(p.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                presetId === p.id
                  ? 'bg-sky-500 text-slate-950 border-sky-300'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-sky-400/50'
              }`}
            >
              {isEn ? p.nameEn : p.nameVi}
            </button>
          ))}
        </div>

        <div className="relative h-[420px] sm:h-[470px] w-full bg-[#090f1d]">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-4">
          {showTelemetry && (
            <MiniTelemetryChart
              title={isEn ? 'VSEPR Orbital Telemetry' : 'Dao động ký Orbital & VSEPR'}
              darkSurface
              onExportCsv={() =>
                exportRowsToCsv(
                  `chem-vsepr-${presetId}.csv`,
                  ['Time', 'BondAngle_deg', 'ElectronCloud_%', 'HybridAOs'],
                  telemetryRows.map((r) => [r.t, r.angle, r.density, r.aoCount])
                )
              }
              series={[
                { id: 'angle', label: isEn ? 'Angle (°)' : 'Góc (°)', color: '#fbbf24', values: telemetryRows.map((r) => r.angle) },
                { id: 'density', label: '|ψ|² (%)', color: '#38bdf8', values: telemetryRows.map((r) => r.density) },
                { id: 'ao', label: 'AO', color: '#10b981', values: telemetryRows.map((r) => r.aoCount) }
              ]}
            />
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
              <div className="text-slate-400 text-[11px]">{isEn ? 'Hybridization' : 'Trạng thái Lai hóa'}</div>
              <div className="text-base font-extrabold text-sky-300 mt-0.5">{activePreset.hybridization}</div>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
              <div className="text-slate-400 text-[11px]">{isEn ? 'Representative Molecule' : 'Phân tử tiêu biểu'}</div>
              <div className="text-base font-extrabold text-emerald-300 mt-0.5">{activePreset.formulaExample}</div>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
              <div className="text-slate-400 text-[11px]">{isEn ? 'Effective Bond Angle' : 'Góc liên kết hiệu dụng'}</div>
              <div className="text-base font-extrabold text-amber-300 tabular-nums mt-0.5">{effectiveAngleDeg}°</div>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
              <div className="text-slate-400 text-[11px]">{isEn ? 'Geometry Class' : 'Hình học không gian'}</div>
              <div className="text-xs sm:text-sm font-bold text-slate-100 mt-1 truncate">
                {isEn ? activePreset.geometryEn : activePreset.geometryVi}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>{isEn ? 'Lone Electron Pairs (E)' : 'Cặp e không liên kết (E)'}</span>
                <span className="font-mono font-bold text-rose-300 tabular-nums">{lonePairs}</span>
              </div>
              <input type="range" min={0} max={2} step={1} value={lonePairs} onChange={(e) => setLonePairs(Number(e.target.value))} className="w-full accent-rose-400 cursor-pointer" />
            </label>

            <label className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>{isEn ? 'Orbital Radius Scale' : 'Tỉ lệ Đám mây AO'}</span>
                <span className="font-mono font-bold text-emerald-300 tabular-nums">{lobeScale.toFixed(2)}×</span>
              </div>
              <input type="range" min={0.6} max={1.45} step={0.05} value={lobeScale} onChange={(e) => setLobeScale(Number(e.target.value))} className="w-full accent-emerald-400 cursor-pointer" />
            </label>

            <label className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>{isEn ? 'Electron Cloud Opacity' : 'Độ mờ Mật độ |ψ|²'}</span>
                <span className="font-mono font-bold text-sky-300 tabular-nums">{Math.round(cloudOpacity * 100)}%</span>
              </div>
              <input type="range" min={0.2} max={0.95} step={0.05} value={cloudOpacity} onChange={(e) => setCloudOpacity(Number(e.target.value))} className="w-full accent-sky-400 cursor-pointer" />
            </label>
          </div>
        </div>
      </div>

      <SimAnalysisProBar
        simKey={`pre_chem_vsepr_${presetId}`}
        title={isEn ? activePreset.nameEn : activePreset.nameVi}
        formula={`AX_${Math.max(1, activePreset.vectors.length - lonePairs)}E_${lonePairs} (${activePreset.hybridization})`}
        darkSurface
        isEn={isEn}
        params={{ lonePairs, lobeScale, cloudOpacity }}
        paramBounds={{
          lonePairs: { min: 0, max: 2, step: 1, unit: 'pairs', label: isEn ? 'Lone Pairs E' : 'Cặp e tự do E' },
          lobeScale: { min: 0.6, max: 1.45, step: 0.05, unit: '×', label: isEn ? 'Orbital Scale' : 'Tỉ lệ AO' },
          cloudOpacity: { min: 0.2, max: 0.95, step: 0.05, unit: 'α', label: isEn ? 'Cloud Density' : 'Độ mờ |ψ|²' }
        }}
        metrics={[
          { label: isEn ? 'Bond Angle' : 'Góc liên kết', value: effectiveAngleDeg, unit: '°' },
          { label: isEn ? 'Hybrid Count' : 'Số AO tham gia', value: activePreset.vectors.length, unit: 'AO' }
        ]}
        onApplyParams={(next) => {
          if (typeof next.lonePairs === 'number') setLonePairs(next.lonePairs);
          if (typeof next.lobeScale === 'number') setLobeScale(next.lobeScale);
          if (typeof next.cloudOpacity === 'number') setCloudOpacity(next.cloudOpacity);
        }}
        onTogglePlay={() => setIsPaused((p) => !p)}
        onReset={handleReset}
        onSpeedDelta={(d) => setRotSpeed((r) => Math.max(0.2, Math.min(3, r + d)))}
        evaluateSweep={(paramKey, val) => {
          if (paramKey === 'lonePairs') {
            return {
              value: Math.max(82, activePreset.bondAngleDeg - val * 2.5),
              metricLabel: isEn ? 'Compressed Bond Angle' : 'Góc liên kết bị nén',
              metricUnit: '°'
            };
          }
          return {
            value: Number((val * 100).toFixed(1)),
            metricLabel: isEn ? 'Orbital Envelope Index' : 'Chỉ số bao phủ Orbital',
            metricUnit: '%'
          };
        }}
      />
    </div>
  );
};
