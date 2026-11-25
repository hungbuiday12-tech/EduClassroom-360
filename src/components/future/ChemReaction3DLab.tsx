import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Camera, Flame, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
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

interface ChemReaction3DLabProps {
  onEarnXP?: (xp: number) => void;
}

const DEFAULT_CAM_POS: [number, number, number] = [5.6, 4.4, 7.6];
const DEFAULT_CAM_TARGET: [number, number, number] = [0, 1.1, 0];

export const ChemReaction3DLab: React.FC<ChemReaction3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [tempK, setTempK] = useState<number>(360);
  const [eaKj, setEaKj] = useState<number>(58);
  const [catalystDrop, setCatalystDrop] = useState<number>(22);
  const [deltaHKj, setDeltaHKj] = useState<number>(-28);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [showCatalystCurve, setShowCatalystCurve] = useState<boolean>(true);
  const [sliceEnabled, setSliceEnabled] = useState<boolean>(false);
  const [sliceAxis, setSliceAxis] = useState<SliceAxis>('z');
  const [sliceOffset, setSliceOffset] = useState<number>(1.2);
  const [showTelemetry, setShowTelemetry] = useState<boolean>(false);
  const [telemetryRows, setTelemetryRows] = useState<{ t: string; kCat: number; yieldPct: number; ea: number }[]>([]);
  const [bookmark, setBookmark] = useState<CameraBookmarkPose | null>(null);
  const [isSoftwareGl] = useState(() => detectSoftwareGl());

  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const specimenRef = useRef<THREE.Group | null>(null);
  const clipPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 0, -1), 1.2));
  const xpAwardedRef = useRef(false);

  const recorder = useCanvasRecorder(() => canvasRef.current, 'synapse-pre-chem-reaction-3d');

  const effectiveEa = useMemo(() => {
    const raw = showCatalystCurve ? eaKj - catalystDrop : eaKj;
    return Math.max(8, Math.round(raw * 10) / 10);
  }, [eaKj, catalystDrop, showCatalystCurve]);

  const kinetics = useMemo(() => {
    const R = 8.314e-3;
    const kUncat = 1e6 * Math.exp(-eaKj / (R * tempK));
    const kCat = 1e6 * Math.exp(-effectiveEa / (R * tempK));
    const speedup = kCat / Math.max(1e-18, kUncat);
    const boltzmannFraction = Math.exp(-effectiveEa / (R * tempK)) * 100;
    return {
      kUncat,
      kCat,
      speedup,
      boltzmannFraction: Math.min(99.9, boltzmannFraction)
    };
  }, [eaKj, effectiveEa, tempK]);

  const liveRef = useRef({
    tempK,
    eaKj,
    effectiveEa,
    deltaHKj,
    isPaused,
    speed,
    showCatalystCurve
  });
  liveRef.current = {
    tempK,
    eaKj,
    effectiveEa,
    deltaHKj,
    isPaused,
    speed,
    showCatalystCurve
  };

  useEffect(() => {
    if (!xpAwardedRef.current && showCatalystCurve && catalystDrop >= 25) {
      xpAwardedRef.current = true;
      onEarnXP?.(25);
    }
  }, [catalystDrop, showCatalystCurve, onEarnXP]);

  useEffect(() => {
    updateClipPlaneFromState(clipPlaneRef.current, sliceAxis, sliceOffset);
    if (specimenRef.current) {
      applyClipPlaneToObject(specimenRef.current, sliceEnabled ? [clipPlaneRef.current] : null);
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
          kCat: Number(Math.log10(Math.max(1e-6, kinetics.kCat)).toFixed(3)),
          yieldPct: Number(kinetics.boltzmannFraction.toFixed(4)),
          ea: effectiveEa
        }
      ]);
    };
    pushPoint();
    const id = window.setInterval(pushPoint, 450);
    return () => window.clearInterval(id);
  }, [showTelemetry, kinetics.kCat, kinetics.boltzmannFraction, effectiveEa]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07101e);

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 480;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 120);
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
    renderer.toneMappingExposure = 1.12;
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

    scene.add(new THREE.AmbientLight(0xffffff, 0.48));
    const dir = new THREE.DirectionalLight(0xf8fafc, 1.45);
    dir.position.set(6, 10, 7);
    scene.add(dir);

    const grid = new THREE.GridHelper(12, 16, 0x1e293b, 0x0f172a);
    scene.add(grid);

    const specimenRoot = new THREE.Group();
    scene.add(specimenRoot);
    specimenRef.current = specimenRoot;

    const segX = 48;
    const segZ = 22;
    const surfaceGeo = new THREE.PlaneGeometry(8.4, 3.8, segX, segZ);
    surfaceGeo.rotateX(-Math.PI / 2);
    const colors = new Float32Array((segX + 1) * (segZ + 1) * 3);
    surfaceGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const surfaceMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.35,
      metalness: 0.15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.86
    });
    const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
    specimenRoot.add(surfaceMesh);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const wireMesh = new THREE.Mesh(surfaceGeo, wireMat);
    specimenRoot.add(wireMesh);

    const catCurveMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
    const catCurveGeo = new THREE.BufferGeometry();
    const catLine = new THREE.Line(catCurveGeo, catCurveMat);
    specimenRoot.add(catLine);

    const uncatCurveMat = new THREE.LineBasicMaterial({ color: 0xf43f5e, linewidth: 2 });
    const uncatCurveGeo = new THREE.BufferGeometry();
    const uncatLine = new THREE.Line(uncatCurveGeo, uncatCurveMat);
    specimenRoot.add(uncatLine);

    const tsGeo = new THREE.SphereGeometry(0.18, 20, 20);
    const tsMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.55,
      roughness: 0.2
    });
    const tsMarker = new THREE.Mesh(tsGeo, tsMat);
    specimenRoot.add(tsMarker);

    const moleculeCount = 26;
    const molGroup = new THREE.Group();
    specimenRoot.add(molGroup);
    const molGeo = new THREE.SphereGeometry(0.11, 14, 14);
    const mols: {
      mesh: THREE.Mesh;
      mat: THREE.MeshStandardMaterial;
      xNorm: number;
      zNorm: number;
      dir: number;
      energyFrac: number;
    }[] = [];

    for (let i = 0; i < moleculeCount; i++) {
      const mat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25, metalness: 0.25 });
      const mesh = new THREE.Mesh(molGeo, mat);
      molGroup.add(mesh);
      mols.push({
        mesh,
        mat,
        xNorm: Math.random(),
        zNorm: (Math.random() - 0.5) * 0.65,
        dir: 1,
        energyFrac: Math.random()
      });
    }

    const cLow = new THREE.Color(0x0284c7);
    const cMid = new THREE.Color(0x10b981);
    const cHigh = new THREE.Color(0xf43f5e);
    const tmpColor = new THREE.Color();
    const uncatPts: THREE.Vector3[] = Array.from({ length: 61 }, () => new THREE.Vector3());
    const catPts: THREE.Vector3[] = Array.from({ length: 61 }, () => new THREE.Vector3());

    const evalEnergy = (u: number, z: number, eaScale: number, dHScale: number) => {
      const reactantLevel = 1.15;
      const productLevel = Math.max(0.2, reactantLevel + dHScale);
      const baseline = reactantLevel + ((u + 1) * 0.5) * (productLevel - reactantLevel);
      const barrier = eaScale * Math.exp(-(u * u) / 0.16);
      const valleyWall = z * z * 0.52;
      return baseline + barrier + valleyWall;
    };

    const updateSurfaceGeometry = () => {
      const { eaKj: curEa, effectiveEa: curEffEa, deltaHKj: curDH, showCatalystCurve: showCat } = liveRef.current;
      const eaUncatNorm = curEa / 40;
      const eaCatNorm = curEffEa / 40;
      const dHNorm = curDH / 80;

      const posAttr = surfaceGeo.getAttribute('position') as THREE.BufferAttribute;
      const colAttr = surfaceGeo.getAttribute('color') as THREE.BufferAttribute;

      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vz = posAttr.getZ(i);
        const u = vx / 4.2;
        const activeBarrier = showCat ? eaCatNorm : eaUncatNorm;
        const y = evalEnergy(u, vz, activeBarrier, dHNorm);
        posAttr.setY(i, y);

        const t = Math.min(1, Math.max(0, (y - 0.3) / 3.0));
        if (t < 0.5) tmpColor.lerpColors(cLow, cMid, t * 2);
        else tmpColor.lerpColors(cMid, cHigh, (t - 0.5) * 2);
        colAttr.setXYZ(i, tmpColor.r, tmpColor.g, tmpColor.b);
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      surfaceGeo.computeVertexNormals();

      for (let k = 0; k <= 60; k++) {
        const u = -1 + (k / 60) * 2;
        const x = u * 4.2;
        uncatPts[k].set(x, evalEnergy(u, 0, eaUncatNorm, dHNorm) + 0.06, 0);
        catPts[k].set(x, evalEnergy(u, 0, eaCatNorm, dHNorm) + 0.08, 0);
      }
      uncatCurveGeo.setFromPoints(uncatPts);
      catCurveGeo.setFromPoints(catPts);
      catLine.visible = showCat;

      const tsY = evalEnergy(0, 0, showCat ? eaCatNorm : eaUncatNorm, dHNorm);
      tsMarker.position.set(0, tsY + 0.2, 0);
    };

    updateSurfaceGeometry();

    let cancelNextFrame = () => {};
    let disposed = false;
    let last = performance.now();
    let prevSignature = '';

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

    const animate = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const cur = liveRef.current;
      const sig = `${cur.eaKj}|${cur.effectiveEa}|${cur.deltaHKj}|${cur.showCatalystCurve}`;
      if (sig !== prevSignature) {
        prevSignature = sig;
        updateSurfaceGeometry();
      }

      if (!cur.isPaused) {
        const barrierThreshold = cur.effectiveEa / 120;
        const tempScale = cur.tempK / 360;
        const eaNorm = cur.effectiveEa / 40;
        const dHNorm = cur.deltaHKj / 80;

        for (let i = 0; i < mols.length; i++) {
          const m = mols[i];
          const speedBoost = 0.25 + 0.45 * tempScale;
          m.xNorm += dt * cur.speed * speedBoost * m.dir;

          const thermalBoost = m.energyFrac * (tempScale * 1.15);
          const crossesBarrier = thermalBoost > barrierThreshold;

          if (m.dir > 0 && !crossesBarrier && m.xNorm >= 0.46) {
            m.dir = -1;
            m.mat.color.setHex(0xf43f5e);
          } else if (m.dir > 0 && crossesBarrier && m.xNorm >= 0.5) {
            m.mat.color.setHex(0x10b981);
          }

          if (m.xNorm > 1 || m.xNorm < 0) {
            m.xNorm = 0;
            m.dir = 1;
            m.energyFrac = Math.random();
            m.mat.color.setHex(0x38bdf8);
          }

          const u = m.xNorm * 2 - 1;
          const x = u * 4.0;
          const z = m.zNorm * 1.8;
          const surfY = evalEnergy(u, z, eaNorm, dHNorm);
          m.mesh.position.set(x, surfY + 0.14, z);
        }
      }

      controls.update();
      renderer.render(scene, camera);
      if (!disposed) {
        scheduleSyncedGlFrame(renderer, isSoftwareGl, animate, (c) => {
          cancelNextFrame = c;
        });
      }
    };

    scheduleSyncedGlFrame(renderer, isSoftwareGl, animate, (c) => {
      cancelNextFrame = c;
    });

    return () => {
      disposed = true;
      cancelNextFrame();
      ro.disconnect();
      controls.dispose();
      surfaceGeo.dispose();
      surfaceMat.dispose();
      wireMat.dispose();
      catCurveGeo.dispose();
      catCurveMat.dispose();
      uncatCurveGeo.dispose();
      uncatCurveMat.dispose();
      tsGeo.dispose();
      tsMat.dispose();
      molGeo.dispose();
      mols.forEach((m) => m.mat.dispose());
      envRT.dispose();
      renderer.dispose();
      cameraRef.current = null;
      controlsRef.current = null;
      specimenRef.current = null;
    };
  }, [isSoftwareGl]);

  const applyCameraPreset = (preset: QuickCamPreset) => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    if (preset === 'iso') cam.position.set(...DEFAULT_CAM_POS);
    else if (preset === 'top') cam.position.set(0.01, 10.2, 0.01);
    else cam.position.set(0, 2.2, 8.8);
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
    setTempK(360);
    setEaKj(58);
    setCatalystDrop(22);
    setDeltaHKj(-28);
    setShowCatalystCurve(true);
    setSpeed(1.0);
    setIsPaused(false);
    setSliceEnabled(false);
    resetCamera();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              {isEn
                ? '3D Potential Energy Surface & Catalytic Reaction Kinetics'
                : 'Bề Mặt Thế Năng 3D & Động Học Xúc Tác Arrhenius'}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowCatalystCurve((v) => !v)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer whitespace-nowrap shrink-0 ${
                showCatalystCurve
                  ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showCatalystCurve ? (isEn ? 'Catalyst: ON' : 'Chất xúc tác: BẬT') : (isEn ? 'Catalyst: OFF' : 'Chất xúc tác: TẮT')}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPaused((v) => !v)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPaused ? (isEn ? 'Resume' : 'Chạy') : (isEn ? 'Pause' : 'Dừng')}</span>
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
              onClick={() => captureCanvasPng(canvasRef.current, 'chem-reaction-3d')}
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
          sliceMin={-3.5}
          sliceMax={3.5}
          showTelemetry={showTelemetry}
          onToggleTelemetry={() => setShowTelemetry((v) => !v)}
          hasBookmark={Boolean(bookmark)}
          onSaveBookmark={handleSaveBookmark}
          onRecallBookmark={handleRecallBookmark}
          onCameraPreset={applyCameraPreset}
          onResetCamera={resetCamera}
        />

        <div className="relative h-[420px] sm:h-[480px] w-full bg-[#07101e]">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-4">
          {showTelemetry && (
            <MiniTelemetryChart
              title={isEn ? 'Arrhenius Kinetics Telemetry' : 'Dao động ký Động học Arrhenius'}
              darkSurface
              onExportCsv={() =>
                exportRowsToCsv(
                  'chem-reaction-kinetics.csv',
                  ['Time', 'log10(k_cat)', 'BoltzmannYield_%', 'EffectiveEa_kJ_mol'],
                  telemetryRows.map((r) => [r.t, r.kCat, r.yieldPct, r.ea])
                )
              }
              series={[
                { id: 'ea', label: 'Ea (kJ)', color: '#f59e0b', values: telemetryRows.map((r) => r.ea) },
                { id: 'kcat', label: 'log10(k)', color: '#10b981', values: telemetryRows.map((r) => r.kCat) },
                { id: 'yield', label: 'Yield %', color: '#38bdf8', values: telemetryRows.map((r) => r.yieldPct) }
              ]}
            />
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
              <div className="text-slate-400 text-[11px]">{isEn ? 'Effective Ea' : 'Năng lượng hoạt hóa Ea'}</div>
              <div className="text-base font-extrabold text-amber-300 tabular-nums mt-0.5">{effectiveEa} kJ/mol</div>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
              <div className="text-slate-400 text-[11px]">{isEn ? 'Catalytic Speedup' : 'Tốc độ tăng nhờ xúc tác'}</div>
              <div className="text-base font-extrabold text-emerald-300 tabular-nums mt-0.5">
                {showCatalystCurve ? `${kinetics.speedup >= 1000 ? kinetics.speedup.toExponential(2) : kinetics.speedup.toFixed(1)}×` : '1.0×'}
              </div>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
              <div className="text-slate-400 text-[11px]">{isEn ? 'Active Fraction ≥ Ea' : 'Tỉ lệ va chạm hiệu quả'}</div>
              <div className="text-base font-extrabold text-sky-300 tabular-nums mt-0.5">
                {kinetics.boltzmannFraction.toExponential(2)}%
              </div>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
              <div className="text-slate-400 text-[11px]">{isEn ? 'Enthalpy ΔrH°' : 'Biến thiên Enthalpy ΔH'}</div>
              <div className={`text-base font-extrabold tabular-nums mt-0.5 ${deltaHKj <= 0 ? 'text-rose-300' : 'text-cyan-300'}`}>
                {deltaHKj > 0 ? `+${deltaHKj}` : deltaHKj} kJ/mol
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>{isEn ? 'Temperature T' : 'Nhiệt độ T'}</span>
                <span className="font-mono font-bold text-sky-300 tabular-nums">{tempK} K</span>
              </div>
              <input type="range" min={220} max={700} step={5} value={tempK} onChange={(e) => setTempK(Number(e.target.value))} className="w-full accent-sky-400 cursor-pointer" />
            </label>

            <label className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>{isEn ? 'Base Ea' : 'Ngưỡng Ea gốc'}</span>
                <span className="font-mono font-bold text-rose-300 tabular-nums">{eaKj} kJ/mol</span>
              </div>
              <input type="range" min={25} max={120} step={1} value={eaKj} onChange={(e) => setEaKj(Number(e.target.value))} className="w-full accent-rose-400 cursor-pointer" />
            </label>

            <label className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>{isEn ? 'Catalyst ΔEa' : 'Hạ rào xúc tác ΔEa'}</span>
                <span className="font-mono font-bold text-emerald-300 tabular-nums">-{catalystDrop} kJ/mol</span>
              </div>
              <input type="range" min={0} max={50} step={1} value={catalystDrop} onChange={(e) => setCatalystDrop(Number(e.target.value))} className="w-full accent-emerald-400 cursor-pointer" />
            </label>

            <label className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>{isEn ? 'Enthalpy ΔH' : 'Hiệu ứng nhiệt ΔH'}</span>
                <span className="font-mono font-bold text-amber-300 tabular-nums">{deltaHKj} kJ/mol</span>
              </div>
              <input type="range" min={-80} max={60} step={2} value={deltaHKj} onChange={(e) => setDeltaHKj(Number(e.target.value))} className="w-full accent-amber-400 cursor-pointer" />
            </label>
          </div>
        </div>
      </div>

      <SimAnalysisProBar
        simKey="pre_chem_reaction_3d"
        title={isEn ? '3D Potential Energy Surface & Arrhenius Kinetics' : 'Bề Mặt Thế Năng 3D & Động Học Arrhenius'}
        formula="k = A * exp(-Ea / (R * T))"
        darkSurface
        isEn={isEn}
        params={{ tempK, eaKj, catalystDrop, deltaHKj }}
        paramBounds={{
          tempK: { min: 220, max: 700, step: 5, unit: 'K', label: isEn ? 'Temperature T' : 'Nhiệt độ T' },
          eaKj: { min: 25, max: 120, step: 1, unit: 'kJ/mol', label: isEn ? 'Base Ea' : 'Rào thế Ea' },
          catalystDrop: { min: 0, max: 50, step: 1, unit: 'kJ/mol', label: isEn ? 'Catalyst Drop' : 'Giảm rào Xúc tác' },
          deltaHKj: { min: -80, max: 60, step: 2, unit: 'kJ/mol', label: 'ΔH' }
        }}
        metrics={[
          { label: isEn ? 'Effective Ea' : 'Ea hiệu dụng', value: effectiveEa, unit: 'kJ/mol' },
          { label: isEn ? 'Catalytic Speedup' : 'Tốc độ tăng xúc tác', value: Number(kinetics.speedup.toFixed(2)), unit: '×' },
          { label: isEn ? 'Collision Yield' : 'Va chạm vượt rào', value: Number(kinetics.boltzmannFraction.toFixed(4)), unit: '%' }
        ]}
        onApplyParams={(next) => {
          if (typeof next.tempK === 'number') setTempK(next.tempK);
          if (typeof next.eaKj === 'number') setEaKj(next.eaKj);
          if (typeof next.catalystDrop === 'number') setCatalystDrop(next.catalystDrop);
          if (typeof next.deltaHKj === 'number') setDeltaHKj(next.deltaHKj);
        }}
        onTogglePlay={() => setIsPaused((p) => !p)}
        onReset={handleReset}
        onSpeedDelta={(d) => setSpeed((s) => Math.max(0.25, Math.min(3, s + d)))}
        evaluateSweep={(paramKey, val, base) => {
          const R = 8.314e-3;
          const tVal = paramKey === 'tempK' ? val : base.tempK;
          const eVal = Math.max(8, (paramKey === 'eaKj' ? val : base.eaKj) - (paramKey === 'catalystDrop' ? val : base.catalystDrop));
          const yieldPct = Math.min(99.9, Math.exp(-eVal / (R * tVal)) * 100);
          return {
            value: Number(yieldPct.toFixed(4)),
            metricLabel: isEn ? 'Boltzmann Collision Fraction' : 'Tỉ lệ va chạm hiệu quả',
            metricUnit: '%'
          };
        }}
      />
    </div>
  );
};
