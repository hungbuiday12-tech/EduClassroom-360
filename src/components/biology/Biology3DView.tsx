import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Camera, ChevronDown, ChevronUp, Pause, Play, RotateCcw } from 'lucide-react';
import { Biology3DMode } from '../../types';
import { captureCanvasPng, RecordVideoButton, useCanvasRecorder } from '../common/SimProToolkit';

interface Biology3DViewProps {
  mode: Biology3DMode;
  title?: string;
  heightClass?: string;
  isEn?: boolean;
}

function detectSoftwareGl(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return true;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (!dbg) return false;
    const r = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
    return /SwiftShader|llvmpipe|Software/i.test(r);
  } catch {
    return true;
  }
}

export const Biology3DView: React.FC<Biology3DViewProps> = ({
  mode,
  title,
  heightClass = 'h-[430px]',
  isEn = false
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [explode, setExplode] = useState(0);
  const [dockOpen, setDockOpen] = useState(true);
  const [selectedPart, setSelectedPart] = useState('');
  const [isSoftwareGl] = useState(() => detectSoftwareGl());

  const pausedRef = useRef(paused);
  const speedRef = useRef(speed);
  const explodeRef = useRef(explode);
  pausedRef.current = paused;
  speedRef.current = speed;
  explodeRef.current = explode;

  const recorder = useCanvasRecorder(() => canvasRef.current, `bio-3d-${mode}`);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || isSoftwareGl) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07111a);

    const w = container.clientWidth || 720;
    const h = container.clientHeight || 430;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(4.6, 3.2, 5.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    canvasRef.current = renderer.domElement;

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const grid = new THREE.GridHelper(10, 12, 0x134e4a, 0x0f172a);
    grid.position.y = -2.0;
    scene.add(grid);

    const root = new THREE.Group();
    scene.add(root);

    const parts: { mesh: THREE.Object3D; home: THREE.Vector3; dir: THREE.Vector3; label: string }[] = [];
    const register = (mesh: THREE.Object3D, label: string, dir: [number, number, number]) => {
      mesh.userData.partLabel = label;
      root.add(mesh);
      parts.push({ mesh, home: mesh.position.clone(), dir: new THREE.Vector3(...dir), label });
    };

    if (mode === 'dna_double_helix_3d' || mode === 'ribosome_translation_3d') {
      const mA = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.2 });
      const mT = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3, metalness: 0.2 });
      const mG = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.2 });
      const mC = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.2 });
      const pairMats = [
        [mA, mT, 'Cặp A – T (2 LK Hydro)'],
        [mG, mC, 'Cặp G ≡ C (3 LK Hydro)']
      ] as const;

      for (let i = -8; i <= 8; i++) {
        const y = i * 0.26;
        const ang = i * 0.55;
        const r = 1.05;
        const x1 = Math.cos(ang) * r;
        const z1 = Math.sin(ang) * r;
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
      }
    } else if (mode === 'phospholipid_bilayer_3d') {
      const headMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 });
      const tailMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.6 });
      for (let ix = -3; ix <= 3; ix++) {
        for (let iz = -2; iz <= 2; iz++) {
          if (ix === 0 && iz === 0) continue;
          const topH = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), headMat);
          topH.position.set(ix * 0.52, 0.65, iz * 0.52);
          register(topH, 'Đầu ưa nước Phosphat', [0, 1, 0]);

          const botH = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), headMat);
          botH.position.set(ix * 0.52, -0.65, iz * 0.52);
          register(botH, 'Đầu ưa nước lớp dưới', [0, -1, 0]);

          const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8), tailMat);
          tail.position.set(ix * 0.52, 0, iz * 0.52);
          register(tail, 'Đuôi kị nước axit béo', [0, 0.2, 0]);
        }
      }
      const channel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.45, 1.8, 20, 1, true),
        new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.25, side: THREE.DoubleSide })
      );
      register(channel, 'Kênh Protein xuyên màng (Aquaporin)', [0, 0, 1]);
    } else if (mode === 'human_heart_3d') {
      const heartMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.35, metalness: 0.1 });
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
    } else {
      // Eukaryotic cell / organelle multi-layer assembly
      const outerShell = new THREE.Mesh(
        new THREE.SphereGeometry(1.85, 32, 24, 0, Math.PI * 1.45),
        new THREE.MeshPhysicalMaterial({
          color: 0x10b981,
          transparent: true,
          opacity: 0.32,
          roughness: 0.2,
          side: THREE.DoubleSide
        })
      );
      register(outerShell, 'Màng sinh chất / Thành tế bào', [1.2, 0, 0]);

      const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.68, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.35 })
      );
      register(nucleus, 'Nhân tế bào chứa DNA', [0, 0.9, 0]);

      const mito = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.24, 0.55, 10, 18),
        new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35 })
      );
      mito.position.set(0.95, -0.4, 0.5);
      mito.rotation.z = 0.7;
      register(mito, 'Ti thể (Tổng hợp ATP)', [1.1, -0.4, 0.6]);

      const chloro = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 18, 18),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.3 })
      );
      chloro.scale.set(1.5, 0.7, 1.0);
      chloro.position.set(-0.95, -0.35, 0.45);
      register(chloro, 'Lục lạp / Bào quan chuyển hóa', [-1.1, -0.3, 0.5]);

      const golgi = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.08, 12, 24, Math.PI * 1.2),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.35 })
      );
      golgi.position.set(0.2, 0.3, 0.95);
      register(golgi, 'Bộ máy Golgi đóng gói protein', [0.2, 0.3, 1.2]);
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const handleClick = (ev: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(root.children, true);
      if (hits.length > 0) {
        let obj: THREE.Object3D | null = hits[0].object;
        while (obj && !obj.userData.partLabel) obj = obj.parent;
        if (obj?.userData.partLabel) setSelectedPart(obj.userData.partLabel);
      }
    };
    renderer.domElement.addEventListener('click', handleClick);

    const onResize = () => {
      const nw = container.clientWidth || 720;
      const nh = container.clientHeight || 430;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    let lastTs = performance.now();
    const animate = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      if (!pausedRef.current) {
        root.rotation.y += dt * 0.45 * speedRef.current;
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
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('click', handleClick);
      root.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
        const m = (obj as THREE.Mesh).material;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else if (m) m.dispose();
      });
      controls.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [mode, isSoftwareGl]);

  if (isSoftwareGl) {
    return (
      <div className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-6 flex flex-col justify-center items-center ${heightClass}`}>
        <div className="text-sm font-bold text-emerald-400">{title || mode}</div>
        <p className="mt-2 text-xs text-slate-400 text-center max-w-md">
          {isEn
            ? '3D WebGL scene paused cleanly in software-rendering mode.'
            : 'Phòng Lab 3D Sinh học đang chạy ở chế độ tiết kiệm GPU. Chuyển sang Mô phỏng 2D để xem đường cong sinh học trực tiếp.'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
      <div ref={mountRef} className={`w-full ${heightClass}`} />
      {selectedPart && (
        <div className="absolute top-3 left-3 z-10 rounded-lg bg-slate-900/90 border border-emerald-500/40 px-3 py-1.5 text-xs text-emerald-200 font-semibold">
          {isEn ? 'Selected structure:' : 'Cấu trúc đã chọn:'} {selectedPart}
        </div>
      )}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => captureCanvasPng(canvasRef.current, `bio-3d-${mode}`)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          <span>PNG</span>
        </button>
        <RecordVideoButton
          isRecording={recorder.isRecording}
          recordSeconds={recorder.recordSeconds}
          onToggle={recorder.toggleRecording}
          supported={recorder.supported}
          compact
          isEn={isEn}
        />
        <button
          type="button"
          onClick={() => setDockOpen((v) => !v)}
          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
        >
          {dockOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {dockOpen && (
        <div className="border-t border-slate-800 bg-slate-900/95 px-3 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{paused ? 'Chạy' : 'Tạm dừng'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPaused(false);
                setSpeed(1);
                setExplode(0);
                setSelectedPart('');
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-slate-400">Tốc độ</span>
              <input
                type="range"
                min={0.25}
                max={2.5}
                step={0.25}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-24 accent-emerald-500"
              />
              <span className="font-mono tabular-nums w-9">{speed.toFixed(2)}×</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-slate-400">Tách lớp</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={explode}
                onChange={(e) => setExplode(Number(e.target.value))}
                className="w-24 accent-amber-500"
              />
              <span className="font-mono tabular-nums w-9">{explode}%</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
