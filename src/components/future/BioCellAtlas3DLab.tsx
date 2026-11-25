import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Camera, Layers, Microscope, Pause, Play, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { captureCanvasPng, RecordVideoButton, useCanvasRecorder } from '../common/SimProToolkit';
import { SimAnalysisProBar } from '../common/SimAnalysisProBar';

interface BioCellAtlas3DLabProps {
  onEarnXP?: (xp: number) => void;
}

interface OrganelleInfo {
  id: string;
  nameVi: string;
  nameEn: string;
  roleVi: string;
  roleEn: string;
  metricVi: string;
  metricEn: string;
  colorHex: number;
}

const ORGANELLES: OrganelleInfo[] = [
  {
    id: 'nucleus',
    nameVi: 'Nhân & Hạch nhân (Nucleus)',
    nameEn: 'Nucleus & Nucleolus',
    roleVi: 'Lưu giữ NST ADN mạch kép, thực hiện nhân đôi ADN và phiên mã tổng hợp mARN, rARN.',
    roleEn: 'Houses genomic DNA chromosomes, orchestrates replication and mRNA/rRNA transcription.',
    metricVi: 'Đường kính ~5–10 µm · Màng kép có lỗ nhân',
    metricEn: 'Ø ~5–10 µm · Double envelope with NPCs',
    colorHex: 0x8b5cf6
  },
  {
    id: 'mitochondria',
    nameVi: 'Ti thể (Mitochondrion & ATP Synthase)',
    nameEn: 'Mitochondrion & ATP Synthase',
    roleVi: 'Hô hấp hiếu khí tạo ATP (30–32 ATP/glucozo) qua chu trình Krebs và chuỗi truyền electron ở màng trong gấp nếp (mào).',
    roleEn: 'Generates ATP via Krebs cycle & oxidative phosphorylation along inner cristae.',
    metricVi: 'Sản lượng ~10⁷ phân tử ATP/giây',
    metricEn: '~10⁷ ATP molecules/sec',
    colorHex: 0xf43f5e
  },
  {
    id: 'chloroplast',
    nameVi: 'Lục lạp (Chloroplast · Thylakoid Grana)',
    nameEn: 'Chloroplast · Thylakoid Grana',
    roleVi: 'Thực hiện quang hợp ở thực vật: Pha sáng trên màng Thylakoid (tạo ATP, NADPH, O₂) và Chu trình Calvin trong chất nền Stroma.',
    roleEn: 'Photosynthesis: Light reactions on Thylakoid grana and Calvin cycle in Stroma.',
    metricVi: 'Có ADN vòng & Ribosome 70S riêng',
    metricEn: 'Autonomous circular DNA & 70S ribosomes',
    colorHex: 0x10b981
  },
  {
    id: 'golgi',
    nameVi: 'Bộ máy Golgi (Cisternae)',
    nameEn: 'Golgi Apparatus',
    roleVi: 'Biến đổi, gắn nhãn đường (glycosyl hóa), phân loại và đóng gói protein/lipid vào túi tiết xuất bào.',
    roleEn: 'Modifies, sorts, glycosylates, and packages proteins into secretory vesicles.',
    metricVi: '4–8 túi dẹt xếp chồng phân cực Cis → Trans',
    metricEn: 'Polarized Cis-to-Trans stacked cisternae',
    colorHex: 0xf59e0b
  },
  {
    id: 'er',
    nameVi: 'Lưới nội chất hạt (Rough ER)',
    nameEn: 'Rough Endoplasmic Reticulum',
    roleVi: 'Tổng hợp chuỗi polipeptit nhờ ribosome 80S đính trên màng và gấp cuộn cấu trúc bậc 3.',
    roleEn: 'Translates membrane & secretory proteins on membrane-bound 80S ribosomes.',
    metricVi: 'Liên thông trực tiếp màng nhân ngoài',
    metricEn: 'Continuous with outer nuclear envelope',
    colorHex: 0x38bdf8
  },
  {
    id: 'membrane',
    nameVi: 'Màng sinh chất Khảm lỏng (Phospholipid)',
    nameEn: 'Fluid-Mosaic Plasma Membrane',
    roleVi: 'Lớp kép phospholipid kị nước ngăn cách tế bào, kênh protein xuyên màng vận chuyển có chọn lọc.',
    roleEn: 'Semi-permeable phospholipid bilayer with embedded channel & pump proteins.',
    metricVi: 'Bề dày ~7.5 nm · Tính thấm chọn lọc',
    metricEn: '~7.5 nm thickness · Selective permeability',
    colorHex: 0x14b8a6
  }
];

function detectSoftwareGl(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return true;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (!dbg) return false;
    const renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software/i.test(renderer);
  } catch {
    return true;
  }
}

export const BioCellAtlas3DLab: React.FC<BioCellAtlas3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [selectedOrgId, setSelectedOrgId] = useState<string>('mitochondria');
  const [explodeFactor, setExplodeFactor] = useState<number>(0.18);
  const [atpActivity, setAtpActivity] = useState<number>(1.2);
  const [isolateSelected, setIsolateSelected] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSoftwareGl] = useState(() => detectSoftwareGl());

  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inspectedRef = useRef<Set<string>>(new Set(['mitochondria']));

  const recorder = useCanvasRecorder(() => canvasRef.current, 'synapse-pre-bio-cell-atlas-3d');

  const selectedOrg = useMemo(
    () => ORGANELLES.find((o) => o.id === selectedOrgId) || ORGANELLES[0],
    [selectedOrgId]
  );

  const liveRef = useRef({ selectedOrgId, explodeFactor, atpActivity, isolateSelected, isPaused });
  liveRef.current = { selectedOrgId, explodeFactor, atpActivity, isolateSelected, isPaused };

  const handleSelectOrg = (id: string) => {
    setSelectedOrgId(id);
    if (!inspectedRef.current.has(id)) {
      inspectedRef.current.add(id);
      if (inspectedRef.current.size >= 4) onEarnXP?.(25);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container || isSoftwareGl) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x061219);

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 480;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(5.2, 3.8, 5.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    canvasRef.current = renderer.domElement;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmrem.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.45);
    key.position.set(6, 9, 6);
    scene.add(key);

    const grid = new THREE.GridHelper(10, 12, 0x134e4a, 0x0f172a);
    grid.position.y = -2.6;
    scene.add(grid);

    const cellRoot = new THREE.Group();
    scene.add(cellRoot);

    const orgRecords: {
      id: string;
      group: THREE.Group;
      home: THREE.Vector3;
      explodeDir: THREE.Vector3;
      mats: THREE.MeshStandardMaterial[];
      spinRotor?: THREE.Object3D;
    }[] = [];

    const disposables: { dispose: () => void }[] = [];

    // 1. Cutaway Plasma Membrane Shell
    const memGroup = new THREE.Group();
    const memGeo = new THREE.SphereGeometry(2.55, 36, 28, 0, Math.PI * 1.45);
    const memMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.28,
      roughness: 0.35,
      side: THREE.DoubleSide
    });
    const memMesh = new THREE.Mesh(memGeo, memMat);
    memMesh.userData.orgId = 'membrane';
    memGroup.add(memMesh);
    disposables.push(memGeo, memMat);
    cellRoot.add(memGroup);
    orgRecords.push({
      id: 'membrane',
      group: memGroup,
      home: new THREE.Vector3(0, 0, 0),
      explodeDir: new THREE.Vector3(0, -0.5, 0),
      mats: [memMat]
    });

    // 2. Nucleus & Nucleolus
    const nucGroup = new THREE.Group();
    const nucGeo = new THREE.SphereGeometry(0.85, 28, 24, 0, Math.PI * 1.55);
    const nucMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const nucMesh = new THREE.Mesh(nucGeo, nucMat);
    nucMesh.userData.orgId = 'nucleus';
    const coreGeo = new THREE.SphereGeometry(0.32, 20, 20);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.25 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.userData.orgId = 'nucleus';
    nucGroup.add(nucMesh, coreMesh);
    disposables.push(nucGeo, nucMat, coreGeo, coreMat);
    cellRoot.add(nucGroup);
    orgRecords.push({
      id: 'nucleus',
      group: nucGroup,
      home: new THREE.Vector3(-0.35, 0.25, -0.2),
      explodeDir: new THREE.Vector3(-0.8, 1.4, -0.4),
      mats: [nucMat, coreMat]
    });

    // 3. Rough ER arcs around Nucleus
    const erGroup = new THREE.Group();
    const erMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35 });
    const riboMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.2 });
    const erMats = [erMat, riboMat];
    for (let i = 0; i < 3; i++) {
      const tGeo = new THREE.TorusGeometry(1.12 + i * 0.2, 0.08, 12, 28, Math.PI * 0.85);
      const tMesh = new THREE.Mesh(tGeo, erMat);
      tMesh.rotation.x = Math.PI * 0.4;
      tMesh.rotation.z = i * 0.35;
      tMesh.userData.orgId = 'er';
      erGroup.add(tMesh);
      disposables.push(tGeo);
    }
    const rGeo = new THREE.SphereGeometry(0.045, 8, 8);
    disposables.push(rGeo, erMat, riboMat);
    for (let r = 0; r < 14; r++) {
      const rMesh = new THREE.Mesh(rGeo, riboMat);
      const a = 0.2 + r * 0.18;
      rMesh.position.set(Math.cos(a) * 1.28, 0.1 * Math.sin(r), Math.sin(a) * 1.28);
      rMesh.userData.orgId = 'er';
      erGroup.add(rMesh);
    }
    cellRoot.add(erGroup);
    orgRecords.push({
      id: 'er',
      group: erGroup,
      home: new THREE.Vector3(-0.2, 0.1, -0.15),
      explodeDir: new THREE.Vector3(-1.3, 0.3, 0.9),
      mats: erMats
    });

    // 4. Mitochondrion + Spinning ATP Synthase F1 Rotor
    const mitoGroup = new THREE.Group();
    const mitoGeo = new THREE.CapsuleGeometry(0.32, 0.85, 14, 24);
    const mitoMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.28,
      metalness: 0.15
    });
    const mitoMesh = new THREE.Mesh(mitoGeo, mitoMat);
    mitoMesh.rotation.z = Math.PI / 2.4;
    mitoMesh.userData.orgId = 'mitochondria';

    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 0.45, 0);
    const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.28, 10);
    const headGeo = new THREE.TorusKnotGeometry(0.11, 0.035, 32, 8, 2, 3);
    const atpMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.45,
      roughness: 0.2
    });
    const stem = new THREE.Mesh(stemGeo, atpMat);
    const head = new THREE.Mesh(headGeo, atpMat);
    head.position.y = 0.16;
    stem.userData.orgId = 'mitochondria';
    head.userData.orgId = 'mitochondria';
    rotorGroup.add(stem, head);

    mitoGroup.add(mitoMesh, rotorGroup);
    disposables.push(mitoGeo, mitoMat, stemGeo, headGeo, atpMat);
    cellRoot.add(mitoGroup);
    orgRecords.push({
      id: 'mitochondria',
      group: mitoGroup,
      home: new THREE.Vector3(1.15, -0.25, 0.75),
      explodeDir: new THREE.Vector3(1.5, 0.4, 1.1),
      mats: [mitoMat, atpMat],
      spinRotor: rotorGroup
    });

    // 5. Chloroplast with Thylakoid Grana Stacks
    const chloroGroup = new THREE.Group();
    const chShellGeo = new THREE.SphereGeometry(0.58, 22, 18);
    const chShellMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.42,
      roughness: 0.28
    });
    const chShell = new THREE.Mesh(chShellGeo, chShellMat);
    chShell.scale.set(1.25, 0.62, 0.85);
    chShell.userData.orgId = 'chloroplast';
    chloroGroup.add(chShell);
    const discGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.05, 16);
    const discMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.25 });
    for (let s = -1; s <= 1; s++) {
      for (let d = 0; d < 4; d++) {
        const disc = new THREE.Mesh(discGeo, discMat);
        disc.position.set(s * 0.26, -0.1 + d * 0.065, 0);
        disc.userData.orgId = 'chloroplast';
        chloroGroup.add(disc);
      }
    }
    disposables.push(chShellGeo, chShellMat, discGeo, discMat);
    cellRoot.add(chloroGroup);
    orgRecords.push({
      id: 'chloroplast',
      group: chloroGroup,
      home: new THREE.Vector3(1.05, 0.55, -0.95),
      explodeDir: new THREE.Vector3(1.4, 1.1, -1.2),
      mats: [chShellMat, discMat]
    });

    // 6. Golgi Apparatus Cisternae
    const golgiGroup = new THREE.Group();
    const gMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
    for (let c = 0; c < 4; c++) {
      const cGeo = new THREE.TorusGeometry(0.32 + c * 0.1, 0.055, 12, 24, Math.PI);
      const cMesh = new THREE.Mesh(cGeo, gMat);
      cMesh.position.set(0, c * 0.09, 0);
      cMesh.userData.orgId = 'golgi';
      golgiGroup.add(cMesh);
      disposables.push(cGeo);
    }
    disposables.push(gMat);
    cellRoot.add(golgiGroup);
    orgRecords.push({
      id: 'golgi',
      group: golgiGroup,
      home: new THREE.Vector3(-0.75, -0.65, 1.05),
      explodeDir: new THREE.Vector3(-1.1, -0.4, 1.5),
      mats: [gMat]
    });

    // Raycaster to click organelles inside 3D canvas
    const raycaster = new THREE.Raycaster();
    const downPos = { x: 0, y: 0 };
    const onPointerDown = (e: PointerEvent) => {
      downPos.x = e.clientX;
      downPos.y = e.clientY;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 5) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(cellRoot.children, true);
      if (hits.length > 0 && hits[0].object.userData.orgId) {
        handleSelectOrg(String(hits[0].object.userData.orgId));
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

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

    let rafId = 0;
    let last = performance.now();

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const cur = liveRef.current;

      orgRecords.forEach((rec) => {
        rec.group.position.copy(rec.home).addScaledVector(rec.explodeDir, cur.explodeFactor * 1.4);
        const isTarget = rec.id === cur.selectedOrgId;
        rec.group.visible = !cur.isolateSelected || isTarget;
        rec.mats.forEach((m) => {
          m.emissive.setHex(isTarget ? 0x22d3ee : 0x000000);
          m.emissiveIntensity = isTarget ? 0.28 : 0;
        });
        if (!cur.isPaused && rec.spinRotor) {
          rec.spinRotor.rotation.y += dt * 3.5 * cur.atpActivity;
        }
      });

      if (!cur.isPaused) {
        cellRoot.rotation.y += dt * 0.16;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      envRT.dispose();
      renderer.dispose();
    };
  }, [isSoftwareGl]);

  const handleReset = () => {
    setSelectedOrgId('mitochondria');
    setExplodeFactor(0.18);
    setAtpActivity(1.2);
    setIsolateSelected(false);
    setIsPaused(false);
  };

  const atpOutputRate = Math.round(atpActivity * 32 * 100) / 100;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Microscope className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              {isEn
                ? '3D Eukaryotic Cell Atlas & Organelle Cutaway Studio'
                : 'Atlas Tế Bào Nhân Thực 3D & Tách Lớp Bào Quan'}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsolateSelected((v) => !v)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer whitespace-nowrap shrink-0 ${
                isolateSelected
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  : 'bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isolateSelected ? (isEn ? 'Show Full Cell' : 'Hiện Cả Tế Bào') : (isEn ? 'Isolate Part' : 'Cô Lập Bào Quan')}</span>
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
              onClick={() => captureCanvasPng(canvasRef.current, 'bio-cell-atlas-3d')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Camera className="w-3.5 h-3.5 text-sky-400" />
              <span>PNG</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Organelle Selector Bar */}
        <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap gap-1.5">
          {ORGANELLES.map((org) => (
            <button
              key={org.id}
              type="button"
              onClick={() => handleSelectOrg(org.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                selectedOrgId === org.id
                  ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-emerald-400/50'
              }`}
            >
              {isEn ? org.nameEn.split('(')[0].trim() : org.nameVi.split('(')[0].trim()}
            </button>
          ))}
        </div>

        <div className="relative h-[420px] sm:h-[470px] w-full bg-[#061219]">
          {isSoftwareGl ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300 space-y-2">
              <Microscope className="w-8 h-8 text-emerald-400" />
              <p className="text-sm font-bold text-white">{isEn ? selectedOrg.nameEn : selectedOrg.nameVi}</p>
              <p className="text-xs max-w-md text-slate-400">{isEn ? selectedOrg.roleEn : selectedOrg.roleVi}</p>
            </div>
          ) : (
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-4">
          <div className="rounded-xl bg-slate-950/85 border border-emerald-500/30 p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-sm font-extrabold text-emerald-300">
                {isEn ? selectedOrg.nameEn : selectedOrg.nameVi}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {isEn ? selectedOrg.roleEn : selectedOrg.roleVi}
              </p>
            </div>
            <div className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-amber-300 shrink-0 tabular-nums">
              {isEn ? selectedOrg.metricEn : selectedOrg.metricVi}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>{isEn ? '3D Explode Cutaway' : 'Tách lớp Bào quan 3D'}</span>
                <span className="font-mono font-bold text-sky-300 tabular-nums">{Math.round(explodeFactor * 100)}%</span>
              </div>
              <input type="range" min={0} max={1} step={0.02} value={explodeFactor} onChange={(e) => setExplodeFactor(Number(e.target.value))} className="w-full accent-sky-400 cursor-pointer" />
            </label>

            <label className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>{isEn ? 'ATP Synthase Metabolic Flux' : 'Cường độ ATP Synthase'}</span>
                <span className="font-mono font-bold text-amber-300 tabular-nums">{atpOutputRate} ATP/glucose</span>
              </div>
              <input type="range" min={0.2} max={2.5} step={0.1} value={atpActivity} onChange={(e) => setAtpActivity(Number(e.target.value))} className="w-full accent-amber-400 cursor-pointer" />
            </label>
          </div>
        </div>
      </div>

      <SimAnalysisProBar
        simKey="pre_bio_cell_atlas_3d"
        title={isEn ? '3D Eukaryotic Cell Atlas & ATP Flux' : 'Atlas Tế Bào Nhân Thực 3D & Động Lực ATP'}
        formula="C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O + 30-32 ATP"
        darkSurface
        isEn={isEn}
        params={{ explodeFactor, atpActivity }}
        paramBounds={{
          explodeFactor: { min: 0, max: 1, step: 0.05, unit: 'ratio', label: isEn ? 'Explode Factor' : 'Hệ số tách lớp' },
          atpActivity: { min: 0.2, max: 2.5, step: 0.1, unit: '×', label: isEn ? 'ATP Flux' : 'Tốc độ ATP Synthase' }
        }}
        metrics={[
          { label: isEn ? 'Selected Organelle' : 'Bào quan chọn', value: selectedOrg.id, unit: '' },
          { label: isEn ? 'Net ATP Yield' : 'Hiệu suất ATP', value: atpOutputRate, unit: 'ATP/glc' }
        ]}
        onApplyParams={(next) => {
          if (typeof next.explodeFactor === 'number') setExplodeFactor(next.explodeFactor);
          if (typeof next.atpActivity === 'number') setAtpActivity(next.atpActivity);
        }}
        onTogglePlay={() => setIsPaused((p) => !p)}
        onReset={handleReset}
        onSpeedDelta={(d) => setAtpActivity((a) => Math.max(0.2, Math.min(2.5, a + d)))}
        evaluateSweep={(paramKey, val) => {
          if (paramKey === 'atpActivity') {
            return {
              value: Math.round(val * 32 * 100) / 100,
              metricLabel: isEn ? 'Net ATP Generation' : 'Sản lượng ATP/glucose',
              metricUnit: 'ATP'
            };
          }
          return {
            value: Math.round(val * 100),
            metricLabel: isEn ? 'Cutaway Separation' : 'Độ tách lớp bào quan',
            metricUnit: '%'
          };
        }}
      />
    </div>
  );
};
