import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { AlertTriangle, Cpu, Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';

interface AlgoCity3DLabProps {
  onEarnXP?: (xp: number) => void;
}

type AlgoMode = 'dijkstra' | 'dp2d' | 'segtree';

interface StepSnapshot {
  label: string;
  activeCells: number[];
  visitedCells: number[];
  pathCells: number[];
  heights: number[];
}

function buildDijkstraSteps(): StepSnapshot[] {
  // 5x5 city grid = 25 towers
  const weights = [
    1, 2, 4, 2, 1,
    3, 1, 5, 2, 3,
    2, 1, 1, 4, 2,
    4, 3, 1, 1, 2,
    2, 4, 2, 1, 1,
  ];
  const steps: StepSnapshot[] = [];
  const visited: number[] = [];
  const order = [0, 1, 5, 6, 11, 12, 17, 18, 23, 24];
  for (let i = 0; i < order.length; i++) {
    const cur = order[i];
    visited.push(cur);
    steps.push({
      label: `Bước ${i + 1}: Thư giãn đỉnh #${cur} (chi phí = ${weights[cur]}) → cập nhật hàng xóm`,
      activeCells: [cur],
      visitedCells: [...visited],
      pathCells: i === order.length - 1 ? [0, 1, 6, 11, 12, 17, 18, 23, 24] : [],
      heights: weights.map((w, idx) => (visited.includes(idx) ? w * 0.55 + 0.6 : w * 0.35 + 0.25)),
    });
  }
  return steps;
}

function buildDp2DSteps(): StepSnapshot[] {
  // 5x5 DP table (25 towers)
  const steps: StepSnapshot[] = [];
  const vals = new Array(25).fill(0.2);
  const visited: number[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const idx = r * 5 + c;
      const top = r > 0 ? vals[(r - 1) * 5 + c] : 0.2;
      const left = c > 0 ? vals[r * 5 + (c - 1)] : 0.2;
      vals[idx] = Math.min(3.4, +(Math.max(top, left) + 0.35 + ((r + c) % 3) * 0.12).toFixed(2));
      visited.push(idx);
      steps.push({
        label: `dp[${r}][${c}] = max(dp[${Math.max(0, r - 1)}][${c}], dp[${r}][${Math.max(0, c - 1)}]) + w → ${vals[idx].toFixed(1)}`,
        activeCells: [idx],
        visitedCells: [...visited],
        pathCells: r === 4 && c === 4 ? [0, 5, 10, 11, 16, 17, 22, 23, 24] : [],
        heights: [...vals],
      });
    }
  }
  return steps;
}

function buildSegTreeSteps(): StepSnapshot[] {
  // 15 nodes in a 4-level Segment Tree mapped to 3D pyramid
  const baseHeights = [3.2, 2.4, 2.6, 1.7, 1.9, 1.8, 2.1, 1.0, 1.2, 1.4, 1.1, 1.3, 0.9, 1.5, 1.2];
  const queryPath = [0, 1, 2, 4, 5, 9, 10];
  return queryPath.map((node, i) => ({
    label: `Truy vấn đoạn [L=2, R=6]: đi qua nút Segment Tree #${node} (O(log N))`,
    activeCells: [node],
    visitedCells: queryPath.slice(0, i + 1),
    pathCells: i === queryPath.length - 1 ? [4, 5, 10] : [],
    heights: baseHeights,
  }));
}

function detectSoftwareGl(): boolean {
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
}

export const AlgoCity3DLab: React.FC<AlgoCity3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const { perfMode } = useBackgroundTheme();
  const isEn = language === 'en';
  const isUltra = perfMode === 'ultra';

  const [mode, setMode] = useState<AlgoMode>('dijkstra');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [simulateOverflow, setSimulateOverflow] = useState(false);

  const steps = useMemo(() => {
    if (mode === 'dp2d') return buildDp2DSteps();
    if (mode === 'segtree') return buildSegTreeSteps();
    return buildDijkstraSteps();
  }, [mode]);

  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
  const stepRef = useRef<StepSnapshot>(currentStep);
  const overflowRef = useRef<boolean>(simulateOverflow);
  stepRef.current = currentStep;
  overflowRef.current = simulateOverflow;

  const mountRef = useRef<HTMLDivElement | null>(null);
  const xpAwardedRef = useRef(false);

  useEffect(() => {
    setStepIdx(0);
  }, [mode]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStepIdx((prev) => {
        if (prev + 1 >= steps.length) {
          if (!xpAwardedRef.current) {
            xpAwardedRef.current = true;
            onEarnXP?.(25);
          }
          return 0;
        }
        return prev + 1;
      });
    }, 850);
    return () => window.clearInterval(timer);
  }, [playing, steps.length, onEarnXP]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const isSw = detectSoftwareGl();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050914);
    scene.fog = new THREE.FogExp2(0x050914, 0.032);

    const w = mount.clientWidth || 720;
    const h = mount.clientHeight || 460;
    const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 100);
    camera.position.set(6.8, 6.2, 7.6);

    const renderer = new THREE.WebGLRenderer({ antialias: !isSw, powerPreference: 'high-performance' });
    renderer.setSize(w, h);
    renderer.setPixelRatio(isSw ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xbae6fd, 0x0f172a, 0.9));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(6, 10, 6);
    scene.add(keyLight);

    const grid = new THREE.GridHelper(14, 20, 0x38bdf8, 0x1e293b);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.4;
    scene.add(grid);

    // Build 3D towers (25 for 5x5 grid or 15 for Segment Tree)
    const count = mode === 'segtree' ? 15 : 25;
    const towerGeo = new THREE.BoxGeometry(0.72, 1, 0.72);
    const towers: { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial }[] = [];

    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.15,
        metalness: 0.45,
        roughness: 0.3,
      });
      const mesh = new THREE.Mesh(towerGeo, mat);

      if (mode === 'segtree') {
        const level = Math.floor(Math.log2(i + 1));
        const posInLevel = i - (Math.pow(2, level) - 1);
        const levelWidth = Math.pow(2, level);
        const spacing = 8.4 / levelWidth;
        const x = (posInLevel - (levelWidth - 1) / 2) * spacing;
        const z = (level - 1.5) * 1.9;
        mesh.position.set(x, 0.5, z);
      } else {
        const r = Math.floor(i / 5);
        const c = i % 5;
        mesh.position.set((c - 2) * 1.25, 0.5, (r - 2) * 1.25);
      }

      scene.add(mesh);
      towers.push({ mesh, mat });
    }

    // Pro & Balanced: Active Node Neon Halo Ring + Rising Cyber-Data Particles
    let activeHalo: THREE.Mesh | null = null;
    let activeHaloOuter: THREE.Mesh | null = null;
    let dataParticles: THREE.Points | null = null;
    let particlePosArr: Float32Array | null = null;

    if (perfMode !== 'smooth') {
      const hGeo = new THREE.TorusGeometry(0.68, 0.035, 10, 48);
      const hMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: isUltra ? 0.9 : 0.6,
      });
      activeHalo = new THREE.Mesh(hGeo, hMat);
      activeHalo.rotation.x = Math.PI / 2;
      scene.add(activeHalo);

      if (isUltra) {
        const hGeo2 = new THREE.TorusGeometry(0.95, 0.022, 10, 48);
        const hMat2 = new THREE.MeshBasicMaterial({
          color: 0x10b981,
          transparent: true,
          opacity: 0.55,
        });
        activeHaloOuter = new THREE.Mesh(hGeo2, hMat2);
        activeHaloOuter.rotation.x = Math.PI / 2;
        scene.add(activeHaloOuter);
      }

      const pCount = isUltra ? 220 : 80;
      particlePosArr = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        particlePosArr[i * 3] = (Math.random() - 0.5) * 11;
        particlePosArr[i * 3 + 1] = Math.random() * 5.5;
        particlePosArr[i * 3 + 2] = (Math.random() - 0.5) * 11;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(particlePosArr, 3));
      const pMat = new THREE.PointsMaterial({
        color: isUltra ? 0x38bdf8 : 0x10b981,
        size: isUltra ? 0.12 : 0.08,
        transparent: true,
        opacity: isUltra ? 0.8 : 0.45,
      });
      dataParticles = new THREE.Points(pGeo, pMat);
      scene.add(dataParticles);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSw;
    controls.dampingFactor = 0.08;
    controls.autoRotate = isUltra;
    controls.autoRotateSpeed = 0.65;
    controls.target.set(0, 1.0, 0);

    const ro = new ResizeObserver(() => {
      if (!mount) return;
      const nw = mount.clientWidth || 720;
      const nh = mount.clientHeight || 460;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(mount);

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(0.05, clock.getDelta());
      const st = stepRef.current;
      const isOverflow = overflowRef.current;
      const t = clock.elapsedTime;

      for (let i = 0; i < towers.length; i++) {
        const { mesh, mat } = towers[i];
        const targetH = Math.max(0.2, st.heights[i] ?? 0.6) * (isOverflow && i % 3 === 0 ? 1.45 : 1.0);
        mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, targetH, 8, dt);
        mesh.position.y = mesh.scale.y / 2;

        if (isOverflow && st.activeCells.includes(i)) {
          mat.color.setHex(0xf43f5e);
          mat.emissive.setHex(0xf43f5e);
          mat.emissiveIntensity = 0.9 + Math.sin(t * 14) * 0.4;
        } else if (st.pathCells.includes(i)) {
          mat.color.setHex(0xf59e0b);
          mat.emissive.setHex(0xf59e0b);
          mat.emissiveIntensity = 0.85;
        } else if (st.activeCells.includes(i)) {
          mat.color.setHex(0x22d3ee);
          mat.emissive.setHex(0x06b6d4);
          mat.emissiveIntensity = 0.95;
        } else if (st.visitedCells.includes(i)) {
          mat.color.setHex(0x10b981);
          mat.emissive.setHex(0x10b981);
          mat.emissiveIntensity = 0.4;
        } else {
          mat.color.setHex(0x1e293b);
          mat.emissive.setHex(0x0ea5e9);
          mat.emissiveIntensity = 0.1;
        }
      }

      // Animate Active Node Halo & Rising Cyber-Data Stream
      if (activeHalo && st.activeCells.length > 0) {
        const activeIdx = st.activeCells[0];
        const targetTower = towers[activeIdx];
        if (targetTower) {
          activeHalo.position.lerp(
            new THREE.Vector3(targetTower.mesh.position.x, targetTower.mesh.scale.y + 0.25, targetTower.mesh.position.z),
            0.18
          );
          activeHalo.rotation.z = t * (isUltra ? 2.4 : 1.2);
          activeHalo.scale.setScalar(1 + Math.sin(t * 5) * 0.1);
          if (activeHaloOuter) {
            activeHaloOuter.position.copy(activeHalo.position);
            activeHaloOuter.position.y -= 0.12;
            activeHaloOuter.rotation.z = -t * 1.8;
            activeHaloOuter.scale.setScalar(1 + Math.cos(t * 4) * 0.14);
          }
        }
      }
      if (dataParticles && particlePosArr) {
        const speed = isOverflow ? 2.8 : isUltra ? 1.15 : 0.65;
        for (let i = 0; i < particlePosArr.length; i += 3) {
          particlePosArr[i + 1] += dt * speed;
          if (particlePosArr[i + 1] > 5.8) {
            particlePosArr[i + 1] = 0.1;
          }
        }
        (dataParticles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      ro.disconnect();
      controls.dispose();
      towerGeo.dispose();
      towers.forEach((tw) => tw.mat.dispose());
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [mode, perfMode]);

  const complexityLabel =
    mode === 'dijkstra'
      ? 'O((V + E) log V)'
      : mode === 'dp2d'
      ? 'O(N × M)'
      : 'O(log N) / truy vấn';

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMode('dijkstra')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
              mode === 'dijkstra' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            Dijkstra 3D (Đường đi ngắn nhất)
          </button>
          <button
            type="button"
            onClick={() => setMode('dp2d')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
              mode === 'dp2d' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            Quy Hoạch Động DP 2D
          </button>
          <button
            type="button"
            onClick={() => setMode('segtree')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${
              mode === 'segtree' ? 'bg-violet-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            Cây Phân Đoạn (Segment Tree 3D)
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSimulateOverflow((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold cursor-pointer ${
              simulateOverflow
                ? 'border-rose-400 bg-rose-500/20 text-rose-200'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {simulateOverflow ? 'Đang quá tải TLE!' : 'Mô phỏng Quá tải / TLE'}
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="min-h-[36px] inline-flex items-center gap-1 rounded-lg bg-sky-500/20 border border-sky-400/40 px-3 py-1.5 text-xs font-bold text-sky-300 cursor-pointer"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? 'Tạm dừng' : 'Chạy'}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStepIdx((s) => (s + 1) % steps.length);
            }}
            className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs font-bold text-slate-200 cursor-pointer"
            title="Bước tiếp theo"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setStepIdx(0)}
            className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs font-bold text-slate-200 cursor-pointer"
            title="Chạy lại"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3D City Stage (HUD stacked above canvas on phones, floating on sm+) */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#050914] flex flex-col sm:block">
        {/* Top-Left HUD */}
        <div className="relative sm:pointer-events-none sm:absolute sm:left-3 sm:top-3 z-10 w-full sm:w-auto sm:max-w-md sm:rounded-xl border-b sm:border border-slate-700/80 bg-slate-950/94 px-3.5 py-2.5 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold text-cyan-300">
              <Cpu className="h-3.5 w-3.5 shrink-0" />
              {isEn ? '3D Algorithm Architecture City' : 'Thành Phố Thuật Toán 3D'}
            </span>
            <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
              {complexityLabel}
            </span>
          </div>
          <div className="mt-1.5 font-mono text-[11px] text-white">{currentStep.label}</div>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
            <span className="text-cyan-300">■ Đang xét</span>
            <span className="text-emerald-400">■ Đã tính xong</span>
            <span className="text-amber-400">■ Đường tối ưu</span>
            <span className="text-rose-400">■ Nghẽn / TLE</span>
          </div>
        </div>

        <div ref={mountRef} className="h-[300px] sm:h-[400px] lg:h-[460px] w-full cursor-grab active:cursor-grabbing touch-none" />
      </div>
    </div>
  );
};
