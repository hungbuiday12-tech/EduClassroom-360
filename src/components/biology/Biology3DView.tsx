import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Camera, ChevronDown, ChevronUp, Eye, Pause, Play, RotateCcw } from 'lucide-react';
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
    return /SwiftShader|llvmpipe|softpipe|Software/i.test(r);
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
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [explode, setExplode] = useState(0);
  const [xray, setXray] = useState(false);
  const [dockOpen, setDockOpen] = useState(true);
  const [selectedPart, setSelectedPart] = useState('');
  const [isSoftwareGl] = useState(() => detectSoftwareGl());

  const pausedRef = useRef(paused);
  const speedRef = useRef(speed);
  const explodeRef = useRef(explode);
  const xrayRef = useRef(xray);
  pausedRef.current = paused;
  speedRef.current = speed;
  explodeRef.current = explode;
  xrayRef.current = xray;

  const recorder = useCanvasRecorder(() => canvasRef.current, `bio-3d-${mode}`);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07111a);
    scene.fog = new THREE.FogExp2(0x07111a, 0.032);

    const w = container.clientWidth || 720;
    const h = container.clientHeight || 430;
    const camera = new THREE.PerspectiveCamera(44, w / h, 0.1, 100);
    camera.position.set(4.8, 3.3, 5.8);
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

    const hemi = new THREE.HemisphereLight(0xa7f3d0, 0x0f172a, 0.72);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.45);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x10b981, 0.6);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    const grid = new THREE.GridHelper(12, 16, 0x134e4a, 0x0f172a);
    grid.position.y = -2.05;
    scene.add(grid);

    const root = new THREE.Group();
    scene.add(root);

    const parts: { mesh: THREE.Object3D; home: THREE.Vector3; dir: THREE.Vector3; label: string }[] = [];
    const shellMeshes: THREE.Mesh[] = [];
    const pulsers: { mesh: THREE.Object3D; phase: number }[] = [];

    const register = (mesh: THREE.Object3D, label: string, dir: [number, number, number], isOuterShell = false) => {
      mesh.userData.partLabel = label;
      mesh.traverse((c) => {
        c.userData.partLabel = label;
      });
      root.add(mesh);
      parts.push({ mesh, home: mesh.position.clone(), dir: new THREE.Vector3(...dir), label });
      if (isOuterShell && mesh instanceof THREE.Mesh) {
        mesh.userData.origOpacity = (mesh.material as THREE.Material).opacity ?? 1;
        shellMeshes.push(mesh);
      }
    };

    const shellMat = (color: number, opacity = 0.34) =>
      new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity,
        roughness: 0.18,
        clearcoat: 0.85,
        side: THREE.DoubleSide,
        depthWrite: false
      });

    switch (mode) {
      case 'dna_double_helix_3d': {
        const mA = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.25 });
        const mT = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3, metalness: 0.25 });
        const mG = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.25 });
        const mC = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.25 });
        const pairMats = [
          [mA, mT, 'Cặp A – T (2 LK Hydro)'],
          [mG, mC, 'Cặp G ≡ C (3 LK Hydro)']
        ] as const;

        for (let i = -8; i <= 8; i++) {
          const y = i * 0.25;
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
        break;
      }

      case 'ribosome_translation_3d': {
        const mrna = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 4.4, 16),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
        );
        mrna.rotation.z = Math.PI / 2;
        register(mrna, 'Phân tử mRNA (5’ → 3’)', [0, 0, 0.5]);
        const smallSub = new THREE.Mesh(
          new THREE.SphereGeometry(0.92, 24, 20),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35 })
        );
        smallSub.scale.set(1.2, 0.65, 0.9);
        smallSub.position.set(0, -0.58, 0);
        register(smallSub, 'Tiểu phần bé 30S/40S', [0, -0.9, 0]);
        const largeSub = new THREE.Mesh(
          new THREE.SphereGeometry(1.15, 24, 20),
          new THREE.MeshStandardMaterial({ color: 0x10b981, transparent: true, opacity: 0.85, roughness: 0.3 })
        );
        largeSub.scale.set(1.3, 0.95, 1.0);
        largeSub.position.set(0, 0.62, 0);
        register(largeSub, 'Tiểu phần lớn 50S/60S', [0, 0.9, 0], true);
        for (let i = 0; i < 6; i++) {
          const aa = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 14, 14),
            new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xa855f7 : 0xf43f5e, roughness: 0.25 })
          );
          aa.position.set(-0.3 + i * 0.24, 1.3 + Math.sin(i * 0.8) * 0.25, 0.15);
          register(aa, 'Chuỗi Polipeptit đang kéo dài', [0, 0.8, 0.5]);
        }
        break;
      }

      case 'phospholipid_bilayer_3d': {
        const headMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 });
        const tailMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.6 });
        for (let ix = -3; ix <= 3; ix++) {
          for (let iz = -2; iz <= 2; iz++) {
            if (ix === 0 && iz === 0) continue;
            const topH = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 12), headMat);
            topH.position.set(ix * 0.5, 0.65, iz * 0.5);
            register(topH, 'Đầu ưa nước Phosphat', [0, 0.95, 0]);
            const botH = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 12), headMat);
            botH.position.set(ix * 0.5, -0.65, iz * 0.5);
            register(botH, 'Đầu ưa nước lớp dưới', [0, -0.95, 0]);
            const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8), tailMat);
            tail.position.set(ix * 0.5, 0, iz * 0.5);
            register(tail, 'Đuôi kị nước axit béo', [0, 0.2, 0]);
          }
        }
        const channel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.45, 0.45, 1.8, 20, 1, true),
          new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.25, side: THREE.DoubleSide })
        );
        register(channel, 'Kênh Protein xuyên màng (Aquaporin)', [0, 0, 1]);
        break;
      }

      case 'mitochondria_atp_3d': {
        const outer = new THREE.Mesh(new THREE.CapsuleGeometry(1.05, 1.8, 12, 24), shellMat(0xf97316, 0.36));
        outer.rotation.z = Math.PI / 2;
        register(outer, 'Màng ngoài Ti thể', [0, 0.85, 0], true);
        for (let i = -3; i <= 3; i++) {
          const crista = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 1.15, 0.95),
            new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.35 })
          );
          crista.position.set(i * 0.42, 0, 0);
          register(crista, 'Mào trong Cristae (Chuỗi truyền e⁻)', [i * 0.25, 0.45, 0]);
        }
        const atpSynth = new THREE.Mesh(
          new THREE.SphereGeometry(0.28, 18, 18),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.4, roughness: 0.2 })
        );
        atpSynth.position.set(0, 0.85, 0.35);
        register(atpSynth, 'Động cơ ATP Synthase', [0, 1.1, 0]);
        pulsers.push({ mesh: atpSynth, phase: 0 });
        break;
      }

      case 'chloroplast_thylakoid_3d': {
        const env = new THREE.Mesh(new THREE.SphereGeometry(1.75, 28, 20), shellMat(0x22c55e, 0.32));
        env.scale.set(1.35, 0.72, 0.95);
        register(env, 'Màng kép Lục lạp & Chất nền Stroma', [0, 0.85, 0], true);
        const discMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.35, metalness: 0.15 });
        for (let s = -1; s <= 1; s++) {
          for (let d = 0; d < 4; d++) {
            const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.14, 20), discMat);
            disc.position.set(s * 1.05, -0.35 + d * 0.22, 0);
            register(disc, 'Cột Grana (Đĩa Thylakoid chứa Diệp lục)', [s * 0.6, d * 0.25, 0]);
          }
        }
        break;
      }

      case 'chromosome_mitosis_3d': {
        const cMat1 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35 });
        const cMat2 = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.35 });
        const arm1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 2.1, 10, 16), cMat1);
        arm1.rotation.z = 0.28;
        register(arm1, 'Nhiễm sắc tử chị em #1 (Chromatid)', [-0.7, 0, 0]);
        const arm2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 2.1, 10, 16), cMat2);
        arm2.rotation.z = -0.28;
        register(arm2, 'Nhiễm sắc tử chị em #2 (Chromatid)', [0.7, 0, 0]);
        const centromere = new THREE.Mesh(
          new THREE.SphereGeometry(0.32, 20, 20),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.45, roughness: 0.25 })
        );
        register(centromere, 'Tâm động (Vị trí gắn thoi phân bào)', [0, 0, 0.7]);
        break;
      }

      case 'enzyme_substrate_3d': {
        const enzyme = new THREE.Mesh(
          new THREE.SphereGeometry(1.35, 28, 24, 0, Math.PI * 1.58),
          new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.35, side: THREE.DoubleSide })
        );
        register(enzyme, 'Phân tử Enzyme & Trung tâm hoạt động', [-0.6, 0, 0]);
        const sub = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.58, 0),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.25, roughness: 0.25 })
        );
        sub.position.set(0.95, 0.1, 0);
        register(sub, 'Phân tử Cơ chất (Substrate) khớp đặc hiệu', [1.1, 0.3, 0]);
        pulsers.push({ mesh: sub, phase: 0.4 });
        break;
      }

      case 'neuron_synapse_3d': {
        const soma = new THREE.Mesh(
          new THREE.SphereGeometry(0.75, 22, 22),
          new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.35 })
        );
        soma.position.set(-1.75, 0, 0);
        register(soma, 'Thân tế bào Thần kinh (Soma)', [-0.8, 0, 0]);
        const axon = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 3.2, 16),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 })
        );
        axon.rotation.z = Math.PI / 2;
        axon.position.set(0.1, 0, 0);
        register(axon, 'Sợi trục dẫn truyền xung thần kinh', [0, 0.4, 0]);
        for (let i = 0; i < 3; i++) {
          const sheath = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.28, 0.55, 8, 16),
            new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.3 })
          );
          sheath.rotation.z = Math.PI / 2;
          sheath.position.set(-0.75 + i * 0.9, 0, 0);
          register(sheath, `Bao Myelin #${i + 1} (Eo Ranvier cách điện)`, [0, 0.8, 0]);
        }
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.45, 20, 20),
          new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 })
        );
        bulb.position.set(1.75, 0, 0);
        register(bulb, 'Chùy Xináp chứa Acetylcholine', [0.85, 0, 0]);
        pulsers.push({ mesh: bulb, phase: 0 });
        break;
      }

      case 'human_heart_3d': {
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
        pulsers.push({ mesh: leftV, phase: 0 }, { mesh: rightV, phase: 0.1 });
        break;
      }

      case 'alveoli_capillary_3d': {
        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          const sac = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), shellMat(0xf472b6, 0.55));
          sac.position.set(Math.cos(ang) * 0.72, (i % 2) * 0.35 - 0.15, Math.sin(ang) * 0.72);
          register(sac, `Chùm Phế nang #${i + 1}`, [Math.cos(ang) * 0.7, 0, Math.sin(ang) * 0.7], true);
        }
        const cap = new THREE.Mesh(
          new THREE.TorusGeometry(1.25, 0.12, 14, 36),
          new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 })
        );
        cap.rotation.x = Math.PI / 2;
        register(cap, 'Mạng mao mạch trao đổi O₂ / CO₂', [0, -0.7, 0]);
        break;
      }

      case 'nephron_kidney_3d': {
        const bowman = new THREE.Mesh(
          new THREE.SphereGeometry(0.75, 20, 20),
          new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 })
        );
        bowman.position.set(-1.35, 0.75, 0);
        register(bowman, 'Cầu thận & Nang Bowman (Siêu lọc)', [-0.7, 0.5, 0]);
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.7, 0.7, 0),
          new THREE.Vector3(-0.2, -1.25, 0.2),
          new THREE.Vector3(0.45, -1.25, -0.2),
          new THREE.Vector3(0.85, 0.75, 0),
          new THREE.Vector3(1.55, -0.95, 0)
        ]);
        const tubule = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 56, 0.16, 12, false),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
        );
        register(tubule, 'Quai Henle & Ống góp (Tái hấp thu ADH)', [0.4, 0, 0.5]);
        break;
      }

      case 'antibody_antigen_3d': {
        const yMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.3, roughness: 0.28 });
        const stem = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 1.1, 10, 14), yMat);
        stem.position.set(0, -0.55, 0);
        register(stem, 'Chuỗi nặng Fc (Gắn đại thực bào)', [0, -0.8, 0]);
        const armL = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 1.0, 10, 14), yMat);
        armL.position.set(-0.55, 0.45, 0);
        armL.rotation.z = 0.65;
        register(armL, 'Vùng biến đổi Fab trái (Khóa kháng nguyên)', [-0.8, 0.6, 0]);
        const armR = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 1.0, 10, 14), yMat);
        armR.position.set(0.55, 0.45, 0);
        armR.rotation.z = -0.65;
        register(armR, 'Vùng biến đổi Fab phải', [0.8, 0.6, 0]);
        const ag = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.42, 0),
          new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.35 })
        );
        ag.position.set(-0.98, 0.98, 0);
        register(ag, 'Kháng nguyên đặc hiệu (Epitope)', [-1.1, 1.0, 0]);
        break;
      }

      case 'virus_bacteriophage_3d': {
        const head = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.85, 0),
          new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.35, roughness: 0.28 })
        );
        head.position.set(0, 1.05, 0);
        register(head, 'Đầu Capsid 20 mặt chứa DNA Phage', [0, 1.0, 0]);
        const sheath = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.24, 1.25, 16),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.45, roughness: 0.3 })
        );
        sheath.position.set(0, -0.1, 0);
        register(sheath, 'Bao đuôi co bóp bơm DNA', [0, 0, 0.6]);
        const legMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 1.25, 8), legMat);
          leg.position.set(Math.cos(ang) * 0.62, -1.05, Math.sin(ang) * 0.62);
          leg.rotation.z = -Math.cos(ang) * 0.65;
          leg.rotation.x = Math.sin(ang) * 0.65;
          register(leg, `Sợi lông đuôi bám thụ thể #${i + 1}`, [Math.cos(ang) * 0.9, -0.6, Math.sin(ang) * 0.9]);
        }
        break;
      }

      case 'plant_vascular_3d': {
        const stemShell = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 2.8, 24, 1, true), shellMat(0x22c55e, 0.28));
        register(stemShell, 'Vỏ thân cây (Lục mô)', [0, 0, 0.8], true);
        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          const xylem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.14, 0.14, 2.7, 12),
            new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.25 })
          );
          xylem.position.set(Math.cos(ang) * 0.65, 0, Math.sin(ang) * 0.65);
          register(xylem, 'Mạch gỗ (Xylem) dẫn Nước + Muối khoáng lên', [Math.cos(ang) * 0.7, 0, Math.sin(ang) * 0.7]);
          const phloem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.11, 0.11, 2.7, 12),
            new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.35 })
          );
          phloem.position.set(Math.cos(ang) * 1.0, 0, Math.sin(ang) * 1.0);
          register(phloem, 'Mạch rây (Phloem) dẫn Đường hữu cơ xuống', [Math.cos(ang) * 1.0, 0, Math.sin(ang) * 1.0]);
        }
        break;
      }

      case 'ecosystem_biome_3d': {
        const tiers = [
          { w: 3.1, col: 0x10b981, y: -1.1, lbl: 'Bậc 1: Sinh vật sản xuất (100%)' },
          { w: 2.3, col: 0x0ea5e9, y: -0.3, lbl: 'Bậc 2: Động vật ăn cỏ (10%)' },
          { w: 1.5, col: 0xf59e0b, y: 0.5, lbl: 'Bậc 3: Động vật ăn thịt 1 (1%)' },
          { w: 0.8, col: 0xef4444, y: 1.3, lbl: 'Bậc 4: Đỉnh chuỗi thức ăn (0,1%)' }
        ];
        tiers.forEach((t, idx) => {
          const slab = new THREE.Mesh(
            new THREE.BoxGeometry(t.w, 0.55, t.w),
            new THREE.MeshStandardMaterial({ color: t.col, roughness: 0.35 })
          );
          slab.position.set(0, t.y, 0);
          register(slab, t.lbl, [0, idx * 0.55, 0]);
        });
        break;
      }

      default: {
        // eukaryotic_cell_3d
        const outerShell = new THREE.Mesh(
          new THREE.SphereGeometry(1.85, 32, 24, 0, Math.PI * 1.45),
          shellMat(0x10b981, 0.32)
        );
        register(outerShell, 'Màng sinh chất / Thành tế bào', [1.2, 0, 0], true);
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
        break;
      }
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

    let frameId = 0;
    let disposed = false;
    let lastTs = performance.now();
    let elapsed = 0;

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

    const animate = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      if (!pausedRef.current) {
        elapsed += dt * speedRef.current;
        root.rotation.y += dt * 0.45 * speedRef.current;
        pulsers.forEach((p) => {
          const s = 1 + Math.sin(elapsed * 3.5 + p.phase) * 0.08;
          p.mesh.scale.set(s, s, s);
        });
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
      shellMeshes.forEach((sm) => {
        const mat = sm.material as THREE.Material;
        const baseOp = typeof sm.userData.origOpacity === 'number' ? sm.userData.origOpacity : 0.34;
        mat.opacity = xrayRef.current ? Math.min(0.14, baseOp * 0.38) : baseOp;
      });
      controls.update();
      renderer.render(scene, camera);
      if (isSoftwareGl) afterDraw(animate);
      else frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
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

  return (
    <div className="bio-zone-frame sci-frame relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
      <div className="bio-helix-sweep" />
      <div ref={mountRef} className={`w-full ${heightClass}`} />
      {selectedPart && (
        <div className="absolute top-3 left-3 z-10 rounded-lg bg-slate-900/95 border border-emerald-500/40 px-3 py-1.5 text-xs text-emerald-200 font-semibold">
          {isEn ? 'Selected structure:' : 'Cấu trúc đã chọn:'} {selectedPart}
        </div>
      )}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setXray((v) => !v)}
          className={`sim-btn-bio inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
            xray
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{xray ? 'Hiện vỏ' : 'X-Quang'}</span>
        </button>
        <button
          type="button"
          onClick={() => captureCanvasPng(canvasRef.current, `bio-3d-${mode}`)}
          className="sim-btn-bio inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
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
              className="sim-btn-bio inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
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
                setXray(false);
                setSelectedPart('');
                if (cameraRef.current && controlsRef.current) {
                  cameraRef.current.position.set(4.8, 3.3, 5.8);
                  controlsRef.current.target.set(0, 0, 0);
                  controlsRef.current.update();
                }
              }}
              className="sim-btn-bio inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại góc</span>
            </button>
            {title && (
              <span className="hidden md:inline text-[11px] font-medium text-slate-400 truncate max-w-[200px]">
                {title}
              </span>
            )}
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
