import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Camera, Dna, Pause, Play, RotateCcw, Scissors } from 'lucide-react';
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

interface BioDnaCrispr3DLabProps {
  onEarnXP?: (xp: number) => void;
}

type CrisprStage = 'scan' | 'pam_lock' | 'dsb_cleave' | 'hdr_repair';

const DEFAULT_CAM_POS: [number, number, number] = [4.9, 2.8, 6.2];
const DEFAULT_CAM_TARGET: [number, number, number] = [0, 0, 0];

export const BioDnaCrispr3DLab: React.FC<BioDnaCrispr3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [stage, setStage] = useState<CrisprStage>('scan');
  const [helixTwist, setHelixTwist] = useState<number>(34.3);
  const [gcPercent, setGcPercent] = useState<number>(52);
  const [repairEfficiency, setRepairEfficiency] = useState<number>(78);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [sliceEnabled, setSliceEnabled] = useState<boolean>(false);
  const [sliceAxis, setSliceAxis] = useState<SliceAxis>('x');
  const [sliceOffset, setSliceOffset] = useState<number>(1.5);
  const [showTelemetry, setShowTelemetry] = useState<boolean>(false);
  const [telemetryRows, setTelemetryRows] = useState<{ t: string; tm: number; hBonds: number; hdr: number }[]>([]);
  const [bookmark, setBookmark] = useState<CameraBookmarkPose | null>(null);
  const [isSoftwareGl] = useState(() => detectSoftwareGl());

  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRootRef = useRef<THREE.Group | null>(null);
  const clipPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1.5));
  const stagesVisitedRef = useRef<Set<CrisprStage>>(new Set(['scan']));

  const recorder = useCanvasRecorder(() => canvasRef.current, 'synapse-pre-dna-crispr-3d');

  const crisprMetrics = useMemo(() => {
    const tmCelsius = Math.round((64.9 + 0.41 * gcPercent - 675 / 20) * 10) / 10;
    const hBondsPer20 = Math.round(20 * ((gcPercent / 100) * 3 + (1 - gcPercent / 100) * 2));
    return { tmCelsius, hBondsPer20 };
  }, [gcPercent]);

  const liveRef = useRef({ stage, helixTwist, gcPercent, repairEfficiency, isPaused });
  liveRef.current = { stage, helixTwist, gcPercent, repairEfficiency, isPaused };

  const selectStage = (s: CrisprStage) => {
    setStage(s);
    if (!stagesVisitedRef.current.has(s)) {
      stagesVisitedRef.current.add(s);
      if (stagesVisitedRef.current.size >= 4) onEarnXP?.(25);
    }
  };

  useEffect(() => {
    updateClipPlaneFromState(clipPlaneRef.current, sliceAxis, sliceOffset);
    if (sceneRootRef.current) {
      applyClipPlaneToObject(sceneRootRef.current, sliceEnabled ? [clipPlaneRef.current] : null);
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
          tm: crisprMetrics.tmCelsius,
          hBonds: crisprMetrics.hBondsPer20,
          hdr: repairEfficiency
        }
      ]);
    };
    pushPoint();
    const id = window.setInterval(pushPoint, 450);
    return () => window.clearInterval(id);
  }, [showTelemetry, crisprMetrics.tmCelsius, crisprMetrics.hBondsPer20, repairEfficiency]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070d1b);

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 480;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
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

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.45);
    key.position.set(6, 9, 6);
    scene.add(key);

    const grid = new THREE.GridHelper(12, 14, 0x1e293b, 0x0f172a);
    grid.position.y = -2.4;
    scene.add(grid);

    const sceneRoot = new THREE.Group();
    scene.add(sceneRoot);
    sceneRootRef.current = sceneRoot;

    const dnaGroup = new THREE.Group();
    dnaGroup.rotation.z = Math.PI / 2;
    sceneRoot.add(dnaGroup);

    const cas9Group = new THREE.Group();
    sceneRoot.add(cas9Group);

    const cas9Mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.38,
      roughness: 0.3
    });
    const recGeo = new THREE.SphereGeometry(1.15, 24, 20);
    const nucGeo = new THREE.SphereGeometry(0.98, 24, 20);
    const recLobe = new THREE.Mesh(recGeo, cas9Mat);
    recLobe.scale.set(1.15, 0.85, 0.9);
    recLobe.position.set(0, 0.55, 0);
    const nucLobe = new THREE.Mesh(nucGeo, cas9Mat);
    nucLobe.scale.set(1.1, 0.78, 0.9);
    nucLobe.position.set(0, -0.55, 0);

    const sgGeo = new THREE.TorusGeometry(0.95, 0.06, 12, 32, Math.PI * 1.4);
    const sgMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
      roughness: 0.25
    });
    const sgMesh = new THREE.Mesh(sgGeo, sgMat);
    sgMesh.rotation.x = Math.PI / 2;

    cas9Group.add(recLobe, nucLobe, sgMesh);

    const bpGeo = new THREE.SphereGeometry(0.13, 14, 14);
    const rungGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.9, 10);
    const rungGeoHalf = new THREE.CylinderGeometry(0.035, 0.035, 0.72, 10);

    const mA = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
    const mT = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
    const mG = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    const mC = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.3 });
    const mHdr = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4,
      roughness: 0.25
    });
    const mBack = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.35 });

    const rebuildDna = () => {
      while (dnaGroup.children.length > 0) {
        dnaGroup.remove(dnaGroup.children[0]);
      }
      const cur = liveRef.current;
      const twistRad = (cur.helixTwist * Math.PI) / 180;
      const totalBp = 22;
      const r = 0.95;

      for (let i = 0; i < totalBp; i++) {
        const y = (i - totalBp / 2) * 0.28;
        const idxFromCenter = Math.abs(i - totalBp / 2);
        const isCleaveZone = cur.stage === 'dsb_cleave' && idxFromCenter < 2.2;
        const isHdrPatch = cur.stage === 'hdr_repair' && idxFromCenter < 2.2;
        const gapOffset = isCleaveZone ? 0.42 : 0;

        const yAdj = y + (i >= totalBp / 2 ? gapOffset : -gapOffset);
        const ang = i * twistRad;
        const x1 = Math.cos(ang) * r;
        const z1 = Math.sin(ang) * r;

        const isGC = (i * 37) % 100 < cur.gcPercent;
        const leftMat = isHdrPatch ? mHdr : isGC ? mG : mA;
        const rightMat = isHdrPatch ? mHdr : isGC ? mC : mT;

        const b1 = new THREE.Mesh(bpGeo, leftMat);
        b1.position.set(x1, yAdj, z1);
        const b2 = new THREE.Mesh(bpGeo, rightMat);
        b2.position.set(-x1, yAdj, -z1);

        if (isCleaveZone) {
          const r1 = new THREE.Mesh(rungGeoHalf, leftMat);
          r1.position.set(x1 * 0.62, yAdj, z1 * 0.62);
          r1.rotation.z = Math.PI / 2;
          r1.rotation.y = -ang;
          const r2 = new THREE.Mesh(rungGeoHalf, rightMat);
          r2.position.set(-x1 * 0.62, yAdj, -z1 * 0.62);
          r2.rotation.z = Math.PI / 2;
          r2.rotation.y = -ang;
          dnaGroup.add(b1, b2, r1, r2);
        } else {
          const rung = new THREE.Mesh(rungGeo, mBack);
          rung.position.set(0, yAdj, 0);
          rung.rotation.z = Math.PI / 2;
          rung.rotation.y = -ang;
          dnaGroup.add(b1, b2, rung);
        }
      }
    };

    rebuildDna();

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

    let cancelNextFrame = () => {};
    let disposed = false;
    let last = performance.now();
    let t = 0;
    let prevSig = '';

    const animate = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const cur = liveRef.current;

      const sig = `${cur.stage}|${cur.helixTwist}|${cur.gcPercent}`;
      if (sig !== prevSig) {
        prevSig = sig;
        rebuildDna();
      }

      if (!cur.isPaused) {
        t += dt;
        dnaGroup.rotation.x += dt * 0.35;
        if (cur.stage === 'scan') {
          cas9Group.position.x = Math.sin(t * 1.4) * 2.1;
          cas9Group.scale.setScalar(1);
        } else if (cur.stage === 'pam_lock') {
          cas9Group.position.x += (0.5 - cas9Group.position.x) * 0.12;
          cas9Group.scale.setScalar(1.04);
        } else if (cur.stage === 'dsb_cleave') {
          cas9Group.position.x += (0 - cas9Group.position.x) * 0.15;
          cas9Group.scale.setScalar(1.08);
        } else {
          cas9Group.position.x += (0 - cas9Group.position.x) * 0.1;
          cas9Group.scale.setScalar(0.94);
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
      recGeo.dispose();
      nucGeo.dispose();
      cas9Mat.dispose();
      sgGeo.dispose();
      sgMat.dispose();
      bpGeo.dispose();
      rungGeo.dispose();
      rungGeoHalf.dispose();
      mA.dispose();
      mT.dispose();
      mG.dispose();
      mC.dispose();
      mHdr.dispose();
      mBack.dispose();
      envRT.dispose();
      renderer.dispose();
      cameraRef.current = null;
      controlsRef.current = null;
      sceneRootRef.current = null;
    };
  }, [isSoftwareGl]);

  const applyCameraPreset = (preset: QuickCamPreset) => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    if (preset === 'iso') cam.position.set(...DEFAULT_CAM_POS);
    else if (preset === 'top') cam.position.set(0.01, 8.2, 0.01);
    else cam.position.set(0, 0.8, 7.6);
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
    setStage('scan');
    setHelixTwist(34.3);
    setGcPercent(52);
    setRepairEfficiency(78);
    setIsPaused(false);
    setSliceEnabled(false);
    resetCamera();
  };

  const stageLabel = useMemo(() => {
    const map: Record<CrisprStage, { vi: string; en: string }> = {
      scan: { vi: '1. Cas9 dò trình tự PAM 5′-NGG-3′', en: '1. Cas9 Scanning PAM 5′-NGG-3′' },
      pam_lock: { vi: '2. Mở xoắn R-loop & Bắt cặp sgRNA', en: '2. R-Loop Unwinding & sgRNA Hybridization' },
      dsb_cleave: { vi: '3. Cắt đứt mạch kép (HNH & RuvC)', en: '3. Double-Strand Break (HNH & RuvC)' },
      hdr_repair: { vi: '4. Sửa chữa Chính xác theo Khuôn HDR', en: '4. Homology-Directed Repair (HDR)' }
    };
    return isEn ? map[stage].en : map[stage].vi;
  }, [stage, isEn]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              {isEn
                ? '3D DNA Double Helix & CRISPR-Cas9 Gene Editing Lab'
                : 'Chuỗi Xoắn Kép ADN 3D & Chỉnh Sửa Gen CRISPR-Cas9'}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
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
              onClick={() => captureCanvasPng(canvasRef.current, 'bio-dna-crispr-3d')}
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

        <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap gap-1.5">
          {(
            [
              { id: 'scan', vi: '1. Dò PAM (5′-NGG-3′)', en: '1. PAM Scan' },
              { id: 'pam_lock', vi: '2. Mở xoắn & Khớp sgRNA', en: '2. R-Loop Lock' },
              { id: 'dsb_cleave', vi: '3. Cắt DSB (HNH/RuvC)', en: '3. DSB Cleavage' },
              { id: 'hdr_repair', vi: '4. Chỉnh sửa Gen HDR', en: '4. HDR Donor Repair' }
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => selectStage(st.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                stage === st.id
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-cyan-400/50'
              }`}
            >
              {st.id === 'dsb_cleave' && <Scissors className="w-3.5 h-3.5" />}
              <span>{isEn ? st.en : st.vi}</span>
            </button>
          ))}
        </div>

        <div className="relative h-[420px] sm:h-[470px] w-full bg-[#070d1b]">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-4">
          {showTelemetry && (
            <MiniTelemetryChart
              title={isEn ? 'CRISPR-Cas9 Thermodynamic Telemetry' : 'Dao động ký Nhiệt động CRISPR & ADN'}
              darkSurface
              onExportCsv={() =>
                exportRowsToCsv(
                  'bio-dna-crispr.csv',
                  ['Time', 'Tm_C', 'H_Bonds_20bp', 'HDR_Efficiency_%'],
                  telemetryRows.map((r) => [r.t, r.tm, r.hBonds, r.hdr])
                )
              }
              series={[
                { id: 'tm', label: 'Tm (°C)', color: '#fbbf24', values: telemetryRows.map((r) => r.tm) },
                { id: 'hb', label: 'H-Bonds', color: '#10b981', values: telemetryRows.map((r) => r.hBonds) },
                { id: 'hdr', label: 'HDR %', color: '#38bdf8', values: telemetryRows.map((r) => r.hdr) }
              ]}
            />
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
              <div className="text-slate-400 text-[11px]">{isEn ? 'Active CRISPR Step' : 'Pha CRISPR hiện tại'}</div>
              <div className="text-xs sm:text-sm font-bold text-cyan-300 mt-1 truncate">{stageLabel}</div>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
              <div className="text-slate-400 text-[11px]">{isEn ? 'sgRNA Melting Temp Tm' : 'Nhiệt độ nóng chảy Tm'}</div>
              <div className="text-base font-extrabold text-amber-300 tabular-nums mt-0.5">{crisprMetrics.tmCelsius} °C</div>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
              <div className="text-slate-400 text-[11px]">{isEn ? 'H-Bonds (20 bp spacer)' : 'Số LK Hydro (đoạn 20 bp)'}</div>
              <div className="text-base font-extrabold text-emerald-300 tabular-nums mt-0.5">{crisprMetrics.hBondsPer20}</div>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
              <div className="text-slate-400 text-[11px]">{isEn ? 'HDR Editing Fidelity' : 'Độ chính xác ghép gen HDR'}</div>
              <div className="text-base font-extrabold text-sky-300 tabular-nums mt-0.5">{repairEfficiency}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>{isEn ? 'GC Content %' : 'Tỉ lệ cặp G ≡ C (%)'}</span>
                <span className="font-mono font-bold text-emerald-300 tabular-nums">{gcPercent}%</span>
              </div>
              <input type="range" min={20} max={85} step={1} value={gcPercent} onChange={(e) => setGcPercent(Number(e.target.value))} className="w-full accent-emerald-400 cursor-pointer" />
            </label>

            <label className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>{isEn ? 'Helix Twist / bp' : 'Góc xoắn mỗi cặp Nu'}</span>
                <span className="font-mono font-bold text-sky-300 tabular-nums">{helixTwist.toFixed(1)}°</span>
              </div>
              <input type="range" min={26} max={42} step={0.5} value={helixTwist} onChange={(e) => setHelixTwist(Number(e.target.value))} className="w-full accent-sky-400 cursor-pointer" />
            </label>

            <label className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>{isEn ? 'HDR Donor Efficiency' : 'Hiệu suất Khuôn HDR'}</span>
                <span className="font-mono font-bold text-amber-300 tabular-nums">{repairEfficiency}%</span>
              </div>
              <input type="range" min={25} max={98} step={1} value={repairEfficiency} onChange={(e) => setRepairEfficiency(Number(e.target.value))} className="w-full accent-amber-400 cursor-pointer" />
            </label>
          </div>
        </div>
      </div>

      <SimAnalysisProBar
        simKey="pre_bio_dna_crispr_3d"
        title={isEn ? '3D DNA & CRISPR-Cas9 Editing Simulator' : 'Mô Phỏng ADN 3D & Chỉnh Sửa Gen CRISPR-Cas9'}
        formula="Tm = 64.9 + 0.41*(%GC) - 675/N"
        darkSurface
        isEn={isEn}
        params={{ gcPercent, helixTwist, repairEfficiency }}
        paramBounds={{
          gcPercent: { min: 20, max: 85, step: 1, unit: '%', label: isEn ? 'GC Content' : 'Tỉ lệ G≡C' },
          helixTwist: { min: 26, max: 42, step: 0.5, unit: '°/bp', label: isEn ? 'Helix Twist' : 'Góc xoắn' },
          repairEfficiency: { min: 25, max: 98, step: 1, unit: '%', label: isEn ? 'HDR Fidelity' : 'Độ chính xác HDR' }
        }}
        metrics={[
          { label: 'Tm', value: crisprMetrics.tmCelsius, unit: '°C' },
          { label: isEn ? 'H-Bonds (20 bp)' : 'Liên kết Hydro', value: crisprMetrics.hBondsPer20, unit: 'bonds' }
        ]}
        onApplyParams={(next) => {
          if (typeof next.gcPercent === 'number') setGcPercent(next.gcPercent);
          if (typeof next.helixTwist === 'number') setHelixTwist(next.helixTwist);
          if (typeof next.repairEfficiency === 'number') setRepairEfficiency(next.repairEfficiency);
        }}
        onTogglePlay={() => setIsPaused((p) => !p)}
        onReset={handleReset}
        evaluateSweep={(paramKey, val) => {
          if (paramKey === 'gcPercent') {
            return {
              value: Math.round((64.9 + 0.41 * val - 675 / 20) * 10) / 10,
              metricLabel: isEn ? 'sgRNA Melting Temperature Tm' : 'Nhiệt độ nóng chảy Tm',
              metricUnit: '°C'
            };
          }
          return {
            value: val,
            metricLabel: paramKey === 'helixTwist' ? (isEn ? 'Helical Pitch Angle' : 'Góc xoắn bậc') : (isEn ? 'HDR Precision' : 'Độ chuẩn HDR'),
            metricUnit: paramKey === 'helixTwist' ? '°' : '%'
          };
        }}
      />
    </div>
  );
};
