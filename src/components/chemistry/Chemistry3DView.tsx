import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Camera, ChevronDown, ChevronUp, Pause, Play, RotateCcw } from 'lucide-react';
import { Chemistry3DMode } from '../../types';
import { captureCanvasPng, RecordVideoButton, useCanvasRecorder } from '../common/SimProToolkit';

interface Chemistry3DViewProps {
  mode: Chemistry3DMode;
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
    const renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
    return /SwiftShader|llvmpipe|Software/i.test(renderer);
  } catch {
    return true;
  }
}

export const Chemistry3DView: React.FC<Chemistry3DViewProps> = ({
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
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [isSoftwareGl] = useState(() => detectSoftwareGl());
  const pausedRef = useRef(paused);
  const speedRef = useRef(speed);
  const explodeRef = useRef(explode);
  pausedRef.current = paused;
  speedRef.current = speed;
  explodeRef.current = explode;

  const recorder = useCanvasRecorder(() => canvasRef.current, `chem-3d-${mode}`);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || isSoftwareGl) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);

    const w = container.clientWidth || 720;
    const h = container.clientHeight || 430;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(4.8, 3.4, 5.8);

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

    const grid = new THREE.GridHelper(10, 12, 0x1e293b, 0x0f172a);
    grid.position.y = -1.9;
    scene.add(grid);

    const root = new THREE.Group();
    scene.add(root);

    const partsWithHome: { mesh: THREE.Object3D; home: THREE.Vector3; dir: THREE.Vector3; label: string }[] = [];
    const registerPart = (mesh: THREE.Object3D, label: string, dir: [number, number, number]) => {
      mesh.userData.partLabel = label;
      root.add(mesh);
      partsWithHome.push({
        mesh,
        home: mesh.position.clone(),
        dir: new THREE.Vector3(...dir),
        label
      });
    };

    const dynamicSpinners: THREE.Object3D[] = [];
    const movingElectrons: { mesh: THREE.Mesh; phase: number }[] = [];

    if (mode === 'atomic_orbitals_3d') {
      const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.26, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.4, roughness: 0.3 })
      );
      registerPart(nucleus, 'Hạt nhân (+Z)', [0, 0, 0]);
      const lobeMatA = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.78, roughness: 0.25 });
      const lobeMatB = new THREE.MeshStandardMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.78, roughness: 0.25 });
      const lobeTop = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 24), lobeMatA);
      lobeTop.scale.set(0.75, 1.45, 0.75);
      lobeTop.position.set(0, 1.1, 0);
      registerPart(lobeTop, 'Thùy Orbital +ψ (2p_z)', [0, 0.7, 0]);
      const lobeBot = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 24), lobeMatB);
      lobeBot.scale.set(0.75, 1.45, 0.75);
      lobeBot.position.set(0, -1.1, 0);
      registerPart(lobeBot, 'Thùy Orbital −ψ (2p_z)', [0, -0.7, 0]);
      const nodalPlane = new THREE.Mesh(
        new THREE.RingGeometry(0.35, 1.85, 48),
        new THREE.MeshBasicMaterial({ color: 0x94a3b8, side: THREE.DoubleSide, transparent: true, opacity: 0.25 })
      );
      nodalPlane.rotation.x = Math.PI / 2;
      registerPart(nodalPlane, 'Mặt phẳng nút (ψ = 0)', [0, 0, 0.6]);
    } else if (mode === 'crystal_lattice_3d') {
      const naMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.35, roughness: 0.3 });
      const clMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.25, roughness: 0.35 });
      for (let ix = -1; ix <= 1; ix++) {
        for (let iy = -1; iy <= 1; iy++) {
          for (let iz = -1; iz <= 1; iz++) {
            const isNa = (ix + iy + iz + 6) % 2 === 0;
            const ion = new THREE.Mesh(
              new THREE.SphereGeometry(isNa ? 0.26 : 0.38, 22, 22),
              isNa ? naMat : clMat
            );
            ion.position.set(ix * 1.15, iy * 1.15, iz * 1.15);
            registerPart(ion, isNa ? 'Cation Na⁺ (r nhỏ)' : 'Anion Cl⁻ (r lớn)', [ix * 0.45, iy * 0.45, iz * 0.45]);
          }
        }
      }
    } else if (mode === 'galvanic_cell_3d' || mode === 'electrolysis_cell_3d') {
      const leftTank = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 2.0, 1.6),
        new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.24, roughness: 0.1 })
      );
      leftTank.position.set(-1.6, -0.3, 0);
      registerPart(leftTank, 'Bán pin Anode (−)', [-0.8, 0, 0]);
      const rightTank = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 2.0, 1.6),
        new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.34, roughness: 0.1 })
      );
      rightTank.position.set(1.6, -0.3, 0);
      registerPart(rightTank, 'Bán pin Cathode (+)', [0.8, 0, 0]);

      const znRod = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 2.1, 0.28),
        new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.85, roughness: 0.25 })
      );
      znRod.position.set(-1.95, 0.1, 0);
      registerPart(znRod, 'Điện cực Zn / Than chì (−)', [-0.6, 0.4, 0]);

      const cuRod = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 2.1, 0.28),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 })
      );
      cuRod.position.set(1.95, 0.1, 0);
      registerPart(cuRod, 'Điện cực Cu (+)', [0.6, 0.4, 0]);

      const bridge = new THREE.Mesh(
        new THREE.TorusGeometry(1.1, 0.12, 16, 40, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.7 })
      );
      bridge.position.set(0, 0.3, 0);
      registerPart(bridge, 'Cầu muối KCl (Cân bằng ion)', [0, 0.8, 0]);

      for (let i = 0; i < 6; i++) {
        const e = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 14, 14),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.9 })
        );
        e.position.set(-1.8 + i * 0.65, 1.65, 0);
        root.add(e);
        movingElectrons.push({ mesh: e, phase: i / 6 });
      }
    } else if (mode === 'benzene_pi_3d') {
      const cMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.3, roughness: 0.4 });
      const hMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        const c = new THREE.Mesh(new THREE.SphereGeometry(0.28, 22, 22), cMat);
        c.position.set(Math.cos(ang) * 1.4, 0, Math.sin(ang) * 1.4);
        registerPart(c, `Cacbon sp² C${i + 1}`, [Math.cos(ang) * 0.6, 0, Math.sin(ang) * 0.6]);
        const hAtom = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), hMat);
        hAtom.position.set(Math.cos(ang) * 2.35, 0, Math.sin(ang) * 2.35);
        registerPart(hAtom, `Nguyên tử H${i + 1}`, [Math.cos(ang) * 0.9, 0, Math.sin(ang) * 0.9]);
      }
      const piTop = new THREE.Mesh(
        new THREE.TorusGeometry(1.4, 0.14, 18, 48),
        new THREE.MeshStandardMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.72 })
      );
      piTop.rotation.x = Math.PI / 2;
      piTop.position.y = 0.55;
      registerPart(piTop, 'Đám mây π liên hợp trên', [0, 0.8, 0]);
      const piBot = piTop.clone();
      piBot.position.y = -0.55;
      registerPart(piBot, 'Đám mây π liên hợp dưới', [0, -0.8, 0]);
      dynamicSpinners.push(root);
    } else {
      // VSEPR Tetrahedral / Coordination Complex / Polymer / Titration Bench 3D
      const center = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 28, 28),
        new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.45, roughness: 0.28 })
      );
      registerPart(center, 'Nguyên tử / Ion trung tâm', [0, 0, 0]);
      const dirs: [number, number, number][] = [
        [0, 1.55, 0],
        [1.45, -0.52, 0],
        [-0.72, -0.52, 1.26],
        [-0.72, -0.52, -1.26]
      ];
      dirs.forEach((d, idx) => {
        const lig = new THREE.Mesh(
          new THREE.SphereGeometry(0.28, 22, 22),
          new THREE.MeshStandardMaterial({ color: idx % 2 === 0 ? 0x10b981 : 0x38bdf8, roughness: 0.3 })
        );
        lig.position.set(...d);
        registerPart(lig, `Phối tử / Liên kết #${idx + 1}`, [d[0] * 0.5, d[1] * 0.5, d[2] * 0.5]);
        const v = new THREE.Vector3(...d);
        const bond = new THREE.Mesh(
          new THREE.CylinderGeometry(0.07, 0.07, v.length(), 14),
          new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.4 })
        );
        bond.position.copy(v.clone().multiplyScalar(0.5));
        bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize());
        root.add(bond);
      });
      dynamicSpinners.push(root);
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onPointerDown = (ev: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(root.children, true);
      if (hits.length > 0) {
        const hitObj = hits[0].object;
        const lbl = hitObj.userData?.partLabel || '';
        if (lbl) setSelectedPart(lbl);
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 720;
      const nh = container.clientHeight || 430;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    let elapsed = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!pausedRef.current) {
        elapsed += dt * speedRef.current;
        dynamicSpinners.forEach((sp) => {
          sp.rotation.y += dt * 0.45 * speedRef.current;
        });
        movingElectrons.forEach((el) => {
          const u = (elapsed * 0.35 + el.phase) % 1;
          el.mesh.position.x = -1.9 + u * 3.8;
          el.mesh.position.y = 1.65 + Math.sin(u * Math.PI) * 0.15;
        });
      }
      const ex = explodeRef.current / 100;
      partsWithHome.forEach((p) => {
        p.mesh.position.copy(p.home).addScaledVector(p.dir, ex * 1.4);
      });
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      controls.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [isSoftwareGl, mode]);

  if (isSoftwareGl) {
    return (
      <div className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-6 flex flex-col justify-center items-center ${heightClass}`}>
        <div className="text-sm font-bold text-sky-400">
          {title || mode}
        </div>
        <p className="mt-2 text-xs text-slate-400 text-center max-w-md">
          {isEn
            ? '3D WebGL scene paused cleanly in software-rendering mode. Switch to 2D Interactive Simulation tab for real-time chemical curves.'
            : 'Phòng Lab 3D Hóa học đang chạy ở chế độ tiết kiệm GPU. Bạn có thể chuyển sang tab Mô phỏng 2D để quan sát hoạt ảnh chi tiết.'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
      <div ref={mountRef} className={`w-full ${heightClass}`} />

      {selectedPart && (
        <div className="absolute top-3 left-3 z-10 rounded-lg bg-slate-900/90 border border-sky-500/40 px-3 py-1.5 text-xs text-sky-200 font-semibold">
          {isEn ? 'Selected component:' : 'Thành phần đã chọn:'} {selectedPart}
        </div>
      )}

      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => captureCanvasPng(canvasRef.current, `chem-3d-${mode}`)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5 text-sky-400" />
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold cursor-pointer"
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{paused ? (isEn ? 'Resume' : 'Chạy') : (isEn ? 'Pause' : 'Tạm dừng')}</span>
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
              <span>{isEn ? 'Reset' : 'Đặt lại'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">{isEn ? 'Speed' : 'Tốc độ'}</span>
              <input
                type="range"
                min={0.25}
                max={2.5}
                step={0.25}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-24 accent-sky-500"
              />
              <span className="font-mono tabular-nums w-9">{speed.toFixed(2)}×</span>
            </label>

            <label className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">{isEn ? 'Explode' : 'Tách lớp'}</span>
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
