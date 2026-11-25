import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Camera, ChevronDown, ChevronUp, Eye, Pause, Play, RotateCcw } from 'lucide-react';
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
    const r = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
    return /SwiftShader|llvmpipe|softpipe|Software/i.test(r);
  } catch {
    return true;
  }
}

// Module-level reusable math helpers to prevent GC churn in animation loops
const _vecA = new THREE.Vector3();
const _vecB = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

function addBondCylinder(
  parent: THREE.Group,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  radius: number,
  mat: THREE.Material
) {
  _vecA.copy(p2).sub(p1);
  const len = _vecA.length();
  if (len < 0.001) return;
  const geom = new THREE.CylinderGeometry(radius, radius, len, 12);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
  _vecB.copy(_vecA).normalize();
  mesh.quaternion.setFromUnitVectors(_up, _vecB);
  parent.add(mesh);
}

export const Chemistry3DView: React.FC<Chemistry3DViewProps> = ({
  mode,
  title,
  heightClass = 'h-[430px]',
  isEn = false
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [explode, setExplode] = useState(0);
  const [xray, setXray] = useState(false);
  const [dockOpen, setDockOpen] = useState(true);
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [isSoftwareGl] = useState(() => detectSoftwareGl());

  const pausedRef = useRef(paused);
  const speedRef = useRef(speed);
  const explodeRef = useRef(explode);
  const xrayRef = useRef(xray);
  pausedRef.current = paused;
  speedRef.current = speed;
  explodeRef.current = explode;
  xrayRef.current = xray;

  const recorder = useCanvasRecorder(() => canvasRef.current, `chem-3d-${mode}`);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09111f);
    scene.fog = new THREE.FogExp2(0x09111f, 0.032);

    const w = container.clientWidth || 720;
    const h = container.clientHeight || 430;
    const camera = new THREE.PerspectiveCamera(44, w / h, 0.1, 100);
    camera.position.set(5.2, 3.6, 6.2);
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
    renderer.toneMappingExposure = 1.08;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    canvasRef.current = renderer.domElement;

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controlsRef.current = controls;

    // Warm/cool studio 3-point lighting rig
    const hemi = new THREE.HemisphereLight(0x93c5fd, 0x0f172a, 0.72);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.45);
    keyLight.position.set(6, 9, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.65);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    const grid = new THREE.GridHelper(12, 16, 0x1e293b, 0x0f172a);
    grid.position.y = -2.1;
    scene.add(grid);

    const root = new THREE.Group();
    scene.add(root);

    const partsWithHome: { mesh: THREE.Object3D; home: THREE.Vector3; dir: THREE.Vector3; label: string }[] = [];
    const shellMeshes: THREE.Mesh[] = [];
    const registerPart = (
      mesh: THREE.Object3D,
      label: string,
      dir: [number, number, number],
      isOuterShell = false
    ) => {
      mesh.userData.partLabel = label;
      mesh.traverse((c) => {
        c.userData.partLabel = label;
      });
      root.add(mesh);
      partsWithHome.push({
        mesh,
        home: mesh.position.clone(),
        dir: new THREE.Vector3(...dir),
        label
      });
      if (isOuterShell && mesh instanceof THREE.Mesh) {
        mesh.userData.origOpacity = (mesh.material as THREE.Material).opacity ?? 1;
        shellMeshes.push(mesh);
      }
    };

    const dynamicSpinners: THREE.Object3D[] = [];
    const animatedParticles: { mesh: THREE.Object3D; phase: number; mode: 'flow' | 'rise' | 'bounce' }[] = [];

    const glassMat = (color: number, opacity = 0.28) =>
      new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity,
        roughness: 0.12,
        metalness: 0.05,
        clearcoat: 1.0,
        depthWrite: false
      });

    switch (mode) {
      case 'atomic_orbitals_3d': {
        const nucleus = new THREE.Mesh(
          new THREE.SphereGeometry(0.28, 24, 24),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.55, roughness: 0.25 })
        );
        registerPart(nucleus, 'Hạt nhân nguyên tử (+Z)', [0, 0, 0]);
        const lobeTop = new THREE.Mesh(
          new THREE.SphereGeometry(0.9, 32, 24),
          new THREE.MeshStandardMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.78, roughness: 0.25 })
        );
        lobeTop.scale.set(0.76, 1.45, 0.76);
        lobeTop.position.set(0, 1.15, 0);
        registerPart(lobeTop, 'Thùy Orbital +ψ (2p_z / d_z²)', [0, 0.8, 0], true);
        const lobeBot = new THREE.Mesh(
          new THREE.SphereGeometry(0.9, 32, 24),
          new THREE.MeshStandardMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.78, roughness: 0.25 })
        );
        lobeBot.scale.set(0.76, 1.45, 0.76);
        lobeBot.position.set(0, -1.15, 0);
        registerPart(lobeBot, 'Thùy Orbital −ψ (2p_z / d_z²)', [0, -0.8, 0], true);
        const nodal = new THREE.Mesh(
          new THREE.RingGeometry(0.35, 1.9, 48),
          new THREE.MeshBasicMaterial({ color: 0x94a3b8, side: THREE.DoubleSide, transparent: true, opacity: 0.25 })
        );
        nodal.rotation.x = Math.PI / 2;
        registerPart(nodal, 'Mặt phẳng nút (ψ = 0)', [0, 0, 0.7]);
        const torusOrb = new THREE.Mesh(
          new THREE.TorusGeometry(1.15, 0.14, 16, 48),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.3 })
        );
        torusOrb.rotation.x = Math.PI / 2;
        registerPart(torusOrb, 'Vòng xuyến phân lớp d_{z²}', [0.8, 0, 0]);
        break;
      }

      case 'vsepr_geometry_3d':
      case 'coordination_complex_3d': {
        const isComplex = mode === 'coordination_complex_3d';
        const center = new THREE.Mesh(
          new THREE.SphereGeometry(0.48, 28, 28),
          new THREE.MeshStandardMaterial({ color: isComplex ? 0x0284c7 : 0x6366f1, metalness: 0.6, roughness: 0.22 })
        );
        registerPart(center, isComplex ? 'Ion trung tâm [Cu(NH₃)₄(H₂O)₂]²⁺' : 'Nguyên tử trung tâm lai hóa sp³', [0, 0, 0]);
        const bondMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.45, roughness: 0.35 });
        const dirs: [number, number, number][] = isComplex
          ? [[1.65, 0, 0], [-1.65, 0, 0], [0, 1.75, 0], [0, -1.75, 0], [0, 0, 1.65], [0, 0, -1.65]]
          : [[0, 1.6, 0], [1.5, -0.53, 0], [-0.75, -0.53, 1.3], [-0.75, -0.53, -1.3]];
        dirs.forEach((d, idx) => {
          const v = new THREE.Vector3(...d);
          const lig = new THREE.Mesh(
            new THREE.SphereGeometry(0.28, 22, 22),
            new THREE.MeshStandardMaterial({
              color: isComplex && idx >= 2 && idx <= 3 ? 0xef4444 : idx % 2 === 0 ? 0x10b981 : 0x38bdf8,
              roughness: 0.3
            })
          );
          lig.position.copy(v);
          registerPart(
            lig,
            isComplex ? (idx >= 2 && idx <= 3 ? 'Phối tử trục H₂O' : `Phối tử xích đạo NH₃ #${idx + 1}`) : `Liên kết σ #${idx + 1} (109.5°)`,
            [d[0] * 0.45, d[1] * 0.45, d[2] * 0.45]
          );
          addBondCylinder(root, new THREE.Vector3(0, 0, 0), v, 0.065, bondMat);
        });
        dynamicSpinners.push(root);
        break;
      }

      case 'crystal_lattice_3d': {
        const naMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.35, roughness: 0.3 });
        const clMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.25, roughness: 0.35 });
        for (let ix = -1; ix <= 1; ix++) {
          for (let iy = -1; iy <= 1; iy++) {
            for (let iz = -1; iz <= 1; iz++) {
              const isNa = (ix + iy + iz + 6) % 2 === 0;
              const ion = new THREE.Mesh(new THREE.SphereGeometry(isNa ? 0.24 : 0.36, 18, 18), isNa ? naMat : clMat);
              ion.position.set(ix * 1.12, iy * 1.12, iz * 1.12);
              registerPart(ion, isNa ? 'Cation Na⁺' : 'Anion Cl⁻', [ix * 0.45, iy * 0.45, iz * 0.45]);
            }
          }
        }
        break;
      }

      case 'galvanic_cell_3d':
      case 'electrolysis_cell_3d': {
        const isElectro = mode === 'electrolysis_cell_3d';
        if (isElectro) {
          const tank = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.2, 2.0), glassMat(0x0ea5e9, 0.32));
          tank.position.set(0, -0.35, 0);
          registerPart(tank, 'Bình điện phân dung dịch CuSO₄ / NaCl', [0, 0, 0.7], true);
        } else {
          const lTank = new THREE.Mesh(new THREE.BoxGeometry(1.75, 2.0, 1.6), glassMat(0x94a3b8, 0.24));
          lTank.position.set(-1.55, -0.35, 0);
          registerPart(lTank, 'Bán pin Anode (−)', [-0.8, 0, 0], true);
          const rTank = new THREE.Mesh(new THREE.BoxGeometry(1.75, 2.0, 1.6), glassMat(0x0ea5e9, 0.34));
          rTank.position.set(1.55, -0.35, 0);
          registerPart(rTank, 'Bán pin Cathode (+)', [0.8, 0, 0], true);
          const bridge = new THREE.Mesh(
            new THREE.TorusGeometry(1.05, 0.13, 16, 40, Math.PI),
            new THREE.MeshStandardMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.75 })
          );
          bridge.position.set(0, 0.25, 0);
          registerPart(bridge, 'Cầu muối KCl (Cân bằng ion)', [0, 0.85, 0]);
        }

        const rodL = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 2.1, 0.28),
          new THREE.MeshStandardMaterial({ color: isElectro ? 0x334155 : 0xcbd5e1, metalness: 0.82, roughness: 0.25 })
        );
        rodL.position.set(isElectro ? -0.95 : -1.85, 0.08, 0);
        registerPart(rodL, isElectro ? 'Cathode (−) bám Cu' : 'Điện cực Zn (−)', [-0.55, 0.3, 0]);

        const rodR = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 2.1, 0.28),
          new THREE.MeshStandardMaterial({ color: isElectro ? 0x475569 : 0xd97706, metalness: 0.82, roughness: 0.25 })
        );
        rodR.position.set(isElectro ? 0.95 : 1.85, 0.08, 0);
        registerPart(rodR, isElectro ? 'Anode (+) sủi khí O₂/Cl₂' : 'Điện cực Cu (+)', [0.55, 0.3, 0]);

        for (let i = 0; i < 6; i++) {
          const p = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 12, 12),
            new THREE.MeshStandardMaterial({ color: isElectro ? 0xa3e635 : 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.85 })
          );
          p.position.set(isElectro ? 0.95 : -1.8 + i * 0.65, isElectro ? -0.9 : 1.6, 0);
          root.add(p);
          animatedParticles.push({ mesh: p, phase: i / 6, mode: isElectro ? 'rise' : 'flow' });
        }
        break;
      }

      case 'titration_bench_3d': {
        const base = new THREE.Mesh(
          new THREE.BoxGeometry(3.2, 0.24, 2.2),
          new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.4, roughness: 0.5 })
        );
        base.position.set(0, -1.65, 0);
        registerPart(base, 'Đế máy khuấy từ', [0, -0.5, 0]);
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 3.6, 12),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 })
        );
        pole.position.set(-1.1, 0.15, 0);
        registerPart(pole, 'Giá đỡ Buret', [-0.7, 0, 0]);
        const burette = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 2.2, 16), glassMat(0x38bdf8, 0.45));
        burette.position.set(0, 1.35, 0);
        registerPart(burette, 'Ống Buret nhỏ giọt NaOH 0.1M', [0, 0.9, 0]);
        const flask = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.5, 24, 1, false), glassMat(0xf472b6, 0.42));
        flask.position.set(0, -0.78, 0);
        registerPart(flask, 'Bình tam giác chứa Acid + Phenolphthalein', [0, -0.3, 0.6], true);
        const liquid = new THREE.Mesh(
          new THREE.ConeGeometry(0.75, 0.72, 24),
          new THREE.MeshStandardMaterial({ color: 0xec4899, transparent: true, opacity: 0.7, roughness: 0.2 })
        );
        liquid.position.set(0, -1.16, 0);
        registerPart(liquid, 'Dung dịch chuyển hồng cánh sen', [0, -0.4, 0]);
        const drop = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1 })
        );
        drop.position.set(0, 0.1, 0);
        root.add(drop);
        animatedParticles.push({ mesh: drop, phase: 0, mode: 'rise' });
        break;
      }

      case 'activation_surface_3d': {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 28; i++) {
          const u = i / 28;
          const x = (u - 0.5) * 4.8;
          const y = Math.sin(u * Math.PI) * 1.8 - u * 0.75 - 0.35;
          pts.push(new THREE.Vector3(x, y, 0));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        const pathTube = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 48, 0.16, 12, false),
          new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.35, metalness: 0.2 })
        );
        registerPart(pathTube, 'Đường phản ứng không xúc tác (Ea cao)', [0, 0.6, 0]);

        const catPts = pts.map((p, i) => new THREE.Vector3(p.x, p.y - Math.sin((i / 28) * Math.PI) * 0.65, 0.65));
        const catTube = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(catPts), 48, 0.14, 12, false),
          new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.35, metalness: 0.25 })
        );
        registerPart(catTube, 'Đường phản ứng CÓ Xúc tác (Hạ Ea)', [0, -0.6, 0.5]);

        const stateSphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.24, 20, 20),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.3, roughness: 0.2 })
        );
        stateSphere.position.copy(pts[0]);
        root.add(stateSphere);
        animatedParticles.push({ mesh: stateSphere, phase: 0, mode: 'bounce' });
        break;
      }

      case 'equilibrium_piston_3d': {
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3.0, 28, 1, true), glassMat(0xf97316, 0.26));
        registerPart(cyl, 'Xi-lanh chứa N₂O₄ ⇌ 2NO₂', [0, 0, 0.8], true);
        const piston = new THREE.Mesh(
          new THREE.CylinderGeometry(1.16, 1.16, 0.22, 24),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 })
        );
        piston.position.set(0, 0.9, 0);
        registerPart(piston, 'Đầu pít-tông nén áp suất P', [0, 0.8, 0]);
        for (let i = 0; i < 12; i++) {
          const mol = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 14, 14),
            new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xef4444 : 0x38bdf8, roughness: 0.3 })
          );
          mol.position.set(Math.sin(i * 1.7) * 0.7, -0.6 + (i % 4) * 0.32, Math.cos(i * 2.1) * 0.7);
          root.add(mol);
          animatedParticles.push({ mesh: mol, phase: i / 12, mode: 'bounce' });
        }
        break;
      }

      case 'benzene_pi_3d': {
        const cMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.3, roughness: 0.4 });
        const hMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
        const bondMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.4 });
        const cPts: THREE.Vector3[] = [];
        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          const pos = new THREE.Vector3(Math.cos(ang) * 1.4, 0, Math.sin(ang) * 1.4);
          cPts.push(pos);
          const c = new THREE.Mesh(new THREE.SphereGeometry(0.28, 22, 22), cMat);
          c.position.copy(pos);
          registerPart(c, `Cacbon sp² C${i + 1}`, [Math.cos(ang) * 0.6, 0, Math.sin(ang) * 0.6]);
          const hPos = new THREE.Vector3(Math.cos(ang) * 2.35, 0, Math.sin(ang) * 2.35);
          const hAtom = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), hMat);
          hAtom.position.copy(hPos);
          registerPart(hAtom, `Hydro H${i + 1}`, [Math.cos(ang) * 0.9, 0, Math.sin(ang) * 0.9]);
          addBondCylinder(root, pos, hPos, 0.05, bondMat);
        }
        for (let i = 0; i < 6; i++) addBondCylinder(root, cPts[i], cPts[(i + 1) % 6], 0.08, bondMat);
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
        break;
      }

      case 'ester_reflux_3d': {
        const boiler = new THREE.Mesh(new THREE.SphereGeometry(0.95, 24, 24), glassMat(0xf59e0b, 0.38));
        boiler.position.set(-1.35, -0.75, 0);
        registerPart(boiler, 'Bình cầu đun CH₃COOH + C₂H₅OH + H₂SO₄ đặc', [-0.6, -0.3, 0], true);
        const condenser = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 2.5, 20), glassMat(0x38bdf8, 0.38));
        condenser.position.set(0.15, 0.45, 0);
        condenser.rotation.z = -1.15;
        registerPart(condenser, 'Ống sinh hàn làm lạnh ngưng tụ hơi Este', [0, 0.8, 0]);
        const receiver = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 1.35, 20), glassMat(0xfbbf24, 0.45));
        receiver.position.set(1.55, -0.85, 0);
        registerPart(receiver, 'Bình hứng CH₃COOC₂H₅ nổi trên lớp nước', [0.6, -0.3, 0], true);
        break;
      }

      case 'polymer_chain_3d': {
        const pts: THREE.Vector3[] = [];
        const cMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.3, roughness: 0.35 });
        const bMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4 });
        for (let i = 0; i < 12; i++) {
          const p = new THREE.Vector3(-2.6 + i * 0.48, Math.sin(i * 0.9) * 0.65, Math.cos(i * 0.9) * 0.65);
          pts.push(p);
          const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), cMat);
          m.position.copy(p);
          registerPart(m, `Mắt xích Polime (-CH₂-CHX-) #${i + 1}`, [0, Math.sin(i) * 0.4, Math.cos(i) * 0.4]);
          if (i > 0) addBondCylinder(root, pts[i - 1], p, 0.06, bMat);
        }
        dynamicSpinners.push(root);
        break;
      }

      case 'methane_ethane_3d': {
        const cMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.35, roughness: 0.35 });
        const hMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
        const bondMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.35 });
        const c1Pos = new THREE.Vector3(-0.78, 0, 0);
        const c2Pos = new THREE.Vector3(0.78, 0, 0);
        const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), cMat);
        c1.position.copy(c1Pos);
        registerPart(c1, 'Nguyên tử C1 (lai hóa sp²/sp³)', [-0.5, 0, 0]);
        const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), cMat);
        c2.position.copy(c2Pos);
        registerPart(c2, 'Nguyên tử C2 (liên kết C=C / C-C)', [0.5, 0, 0]);
        addBondCylinder(root, new THREE.Vector3(-0.78, 0.09, 0), new THREE.Vector3(0.78, 0.09, 0), 0.06, bondMat);
        addBondCylinder(root, new THREE.Vector3(-0.78, -0.09, 0), new THREE.Vector3(0.78, -0.09, 0), 0.06, bondMat);
        [[-1.65, 0.9, 0], [-1.65, -0.9, 0], [1.65, 0.9, 0], [1.65, -0.9, 0]].forEach((hp, i) => {
          const p = new THREE.Vector3(...hp);
          const h = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), hMat);
          h.position.copy(p);
          registerPart(h, `Nguyên tử Hydro H${i + 1}`, [hp[0] * 0.35, hp[1] * 0.35, 0]);
          addBondCylinder(root, i < 2 ? c1Pos : c2Pos, p, 0.05, bondMat);
        });
        dynamicSpinners.push(root);
        break;
      }

      case 'spectroscopy_prism_3d': {
        const prism = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 1.3, 3), glassMat(0xe0f2fe, 0.45));
        registerPart(prism, 'Lăng kính tán sắc quang phổ', [0, 0.6, 0], true);
        const inBeam = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12),
          new THREE.MeshBasicMaterial({ color: 0xf8fafc })
        );
        inBeam.rotation.z = Math.PI / 2;
        inBeam.position.set(-1.7, 0, 0);
        registerPart(inBeam, 'Chùm sáng ngọn lửa tới', [-0.7, 0, 0]);
        [0x8b5cf6, 0x3b82f6, 0x10b981, 0xfacc15, 0xef4444].forEach((col, i) => {
          const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 10), new THREE.MeshBasicMaterial({ color: col }));
          ray.rotation.z = Math.PI / 2 - (i - 2) * 0.14;
          ray.position.set(1.7, (i - 2) * 0.32, 0);
          registerPart(ray, `Vạch phát xạ đơn sắc #${i + 1}`, [0.6, (i - 2) * 0.25, 0]);
        });
        break;
      }

      case 'periodic_tower_3d': {
        const cols = [0xef4444, 0xf97316, 0xfacc15, 0x10b981, 0x0ea5e9, 0x6366f1, 0xa855f7, 0x64748b];
        for (let g = 0; g < 8; g++) {
          for (let p = 0; p < 3; p++) {
            const val = g === 7 ? 0.2 : 0.4 + g * 0.38 - p * 0.08;
            const colMesh = new THREE.Mesh(
              new THREE.BoxGeometry(0.45, Math.max(0.25, val), 0.45),
              new THREE.MeshStandardMaterial({ color: cols[g], roughness: 0.35, metalness: 0.2 })
            );
            colMesh.position.set(-1.9 + g * 0.54, -1.6 + val * 0.5, -0.6 + p * 0.6);
            registerPart(colMesh, `Nhóm ${g + 1}A · Chu kì ${p + 2}`, [0, 0.45, 0]);
          }
        }
        break;
      }

      case 'colloid_micelle_3d': {
        const core = new THREE.Mesh(
          new THREE.SphereGeometry(0.85, 24, 24),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.55 })
        );
        registerPart(core, 'Nhân giọt dầu kị nước', [0, 0, 0]);
        const headMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.25 });
        const tailMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.45 });
        const nMol = 22;
        for (let i = 0; i < nMol; i++) {
          const phi = Math.acos(1 - (2 * (i + 0.5)) / nMol);
          const theta = Math.PI * (1 + Math.sqrt(5)) * i;
          const nx = Math.sin(phi) * Math.cos(theta);
          const ny = Math.cos(phi);
          const nz = Math.sin(phi) * Math.sin(theta);
          const headPos = new THREE.Vector3(nx * 1.75, ny * 1.75, nz * 1.75);
          const tailStart = new THREE.Vector3(nx * 0.9, ny * 0.9, nz * 0.9);
          const hSphere = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 14), headMat);
          hSphere.position.copy(headPos);
          registerPart(hSphere, 'Đầu ưa nước (-COO⁻Na⁺)', [nx * 0.7, ny * 0.7, nz * 0.7]);
          addBondCylinder(root, tailStart, headPos, 0.045, tailMat);
        }
        dynamicSpinners.push(root);
        break;
      }
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
        const lbl = hits[0].object.userData?.partLabel || '';
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

    let frameId = 0;
    let disposed = false;
    let elapsed = 0;
    let last = performance.now();

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const status = sync && gl.getSyncParameter ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 6);
        } else {
          if (sync && gl.deleteSync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 6);
    };

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!pausedRef.current) {
        elapsed += dt * speedRef.current;
        dynamicSpinners.forEach((sp) => {
          sp.rotation.y += dt * 0.45 * speedRef.current;
        });
        animatedParticles.forEach((p, idx) => {
          const u = (elapsed * 0.4 + p.phase) % 1;
          if (p.mode === 'flow') {
            p.mesh.position.x = -1.8 + u * 3.6;
            p.mesh.position.y = 1.6 + Math.sin(u * Math.PI) * 0.14;
          } else if (p.mode === 'rise') {
            p.mesh.position.y = -0.9 + u * 2.0;
          } else {
            p.mesh.position.y = Math.sin(elapsed * 2.2 + idx) * 0.65;
          }
        });
      }
      const ex = explodeRef.current / 100;
      partsWithHome.forEach((p) => {
        const tx = p.home.x + p.dir.x * ex * 1.4;
        const ty = p.home.y + p.dir.y * ex * 1.4;
        const tz = p.home.z + p.dir.z * ex * 1.4;
        p.mesh.position.x = THREE.MathUtils.damp(p.mesh.position.x, tx, 8, dt);
        p.mesh.position.y = THREE.MathUtils.damp(p.mesh.position.y, ty, 8, dt);
        p.mesh.position.z = THREE.MathUtils.damp(p.mesh.position.z, tz, 8, dt);
      });
      shellMeshes.forEach((sm) => {
        const mat = sm.material as THREE.Material;
        const baseOp = typeof sm.userData.origOpacity === 'number' ? sm.userData.origOpacity : 0.35;
        mat.opacity = xrayRef.current ? Math.min(0.14, baseOp * 0.4) : baseOp;
      });
      controls.update();
      renderer.render(scene, camera);
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
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
  }, [isSoftwareGl, mode]);

  return (
    <div className="chem-zone-frame sci-frame relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
      <div className="chem-energy-sweep" />
      <div ref={mountRef} className={`w-full ${heightClass}`} />

      {selectedPart && (
        <div className="absolute top-3 left-3 z-10 rounded-lg bg-slate-900/95 border border-sky-500/40 px-3 py-1.5 text-xs text-sky-200 font-semibold">
          {isEn ? 'Selected component:' : 'Thành phần đã chọn:'} {selectedPart}
        </div>
      )}

      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setXray((v) => !v)}
          className={`sim-btn-chem inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
            xray
              ? 'bg-sky-600 border-sky-500 text-white'
              : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{xray ? 'Hiện vỏ' : 'X-Quang'}</span>
        </button>
        <button
          type="button"
          onClick={() => captureCanvasPng(canvasRef.current, `chem-3d-${mode}`)}
          className="sim-btn-chem inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
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
          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
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
              className="sim-btn-chem inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold cursor-pointer"
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
                setXray(false);
                setSelectedPart('');
                if (cameraRef.current && controlsRef.current) {
                  cameraRef.current.position.set(5.2, 3.6, 6.2);
                  controlsRef.current.target.set(0, 0, 0);
                  controlsRef.current.update();
                }
              }}
              className="sim-btn-chem inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Reset View' : 'Đặt lại góc'}</span>
            </button>
            {title && (
              <span className="hidden md:inline text-[11px] font-medium text-slate-400 truncate max-w-[200px]">
                {title}
              </span>
            )}
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
