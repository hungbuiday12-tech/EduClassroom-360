import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {
  Camera,
  Grid3X3,
  Layers,
  MousePointerClick,
  Pause,
  Play,
  RotateCcw,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  MEET_3D_MODELS,
  Meet3DModelId,
  MeetCameraPreset,
  MeetGraphicsQuality,
  MeetShared3DState,
} from './meetTypes';
import { fetchCustomSpatialModels } from '../spatial3d/customModelStore';
import { buildCustomSpatialModel } from '../spatial3d/customModelBuilder';
import { CustomSpatialModel } from '../spatial3d/customModelTypes';
import { resolveApiUrl } from '../../lib/apiClient';
import {
  createCrispLine2,
  createPostProcessingPipeline,
  createTroikaLabel,
  GPUParticlePool,
  PostProcessPipeline,
  syncLine2Resolution,
  updateBillboardLabels,
} from '../../lib/three3DEnhancements';

interface MeetShared3DStageProps {
  isEn: boolean;
  graphicsQuality?: MeetGraphicsQuality;
  sharedState: MeetShared3DState;
  onPatchState: (patch: Partial<MeetShared3DState>) => void;
}

interface InspectedPartInfo {
  name: string;
  triangles: number;
  sizeText: string;
}

interface ExplodablePart {
  obj: THREE.Object3D;
  basePos: THREE.Vector3;
  dir: THREE.Vector3;
}

const CAMERA_PRESET_TARGETS: Record<MeetCameraPreset, { pos: [number, number, number]; target: [number, number, number]; labelVi: string; labelEn: string }> = {
  perspective: { pos: [0, 2.35, 5.6], target: [0, 1.45, 0], labelVi: 'Toàn cảnh', labelEn: '3D View' },
  front: { pos: [0, 1.5, 5.4], target: [0, 1.45, 0], labelVi: 'Trước', labelEn: 'Front' },
  top: { pos: [0.01, 6.2, 1.15], target: [0, 1.3, 0], labelVi: 'Trên', labelEn: 'Top' },
  closeup: { pos: [2.1, 2.0, 2.85], target: [0, 1.5, 0], labelVi: 'Cận cảnh', labelEn: 'Detail' },
};

const _tmpVec = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _targetCtrl = new THREE.Vector3();

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

function buildMeetModel(modelId: Meet3DModelId, tier: MeetGraphicsQuality): {
  group: THREE.Group;
  parts: ExplodablePart[];
  spinners: THREE.Object3D[];
  disposables: { geometries: THREE.BufferGeometry[]; materials: THREE.Material[] };
} {
  const group = new THREE.Group();
  const parts: ExplodablePart[] = [];
  const spinners: THREE.Object3D[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const isLow = tier === 'low';
  const isHigh = tier === 'high';

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };
  const addPart = (obj: THREE.Object3D, dir: [number, number, number]) => {
    group.add(obj);
    parts.push({
      obj,
      basePos: obj.position.clone(),
      dir: new THREE.Vector3(dir[0], dir[1], dir[2]),
    });
  };

  const makeMat = (opts: {
    color: number;
    emissive?: number;
    emissiveIntensity?: number;
    metalness?: number;
    roughness?: number;
    clearcoat?: number;
    side?: THREE.Side;
    transparent?: boolean;
    opacity?: number;
    depthWrite?: boolean;
  }) => {
    if (isLow) {
      return trackMat(
        new THREE.MeshLambertMaterial({
          color: opts.color,
          emissive: opts.emissive ?? 0x000000,
          emissiveIntensity: (opts.emissiveIntensity ?? 0.25) * 0.7,
          side: opts.side ?? THREE.FrontSide,
          transparent: Boolean(opts.transparent),
          opacity: opts.opacity ?? 1,
          depthWrite: opts.depthWrite ?? true,
        })
      );
    }
    return trackMat(
      new THREE.MeshPhysicalMaterial({
        color: opts.color,
        emissive: opts.emissive ?? 0x000000,
        emissiveIntensity: isHigh ? (opts.emissiveIntensity ?? 0.35) * 1.35 : opts.emissiveIntensity ?? 0.28,
        metalness: opts.metalness ?? 0.45,
        roughness: opts.roughness ?? 0.26,
        clearcoat: isHigh ? opts.clearcoat ?? 0.85 : 0.3,
        side: opts.side ?? THREE.FrontSide,
        transparent: Boolean(opts.transparent),
        opacity: opts.opacity ?? 1,
        depthWrite: opts.depthWrite ?? true,
      })
    );
  };

  const metalMat = makeMat({ color: 0x94a3b8, metalness: 0.9, roughness: 0.16, clearcoat: 0.85 });
  const darkMat = makeMat({ color: 0x1e293b, metalness: 0.5, roughness: 0.44, clearcoat: 0.45 });
  const cyanMat = makeMat({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.45, metalness: 0.38, roughness: 0.18, clearcoat: 0.95 });
  const amberMat = makeMat({ color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.48, metalness: 0.62, roughness: 0.18, clearcoat: 0.9 });
  const emeraldMat = makeMat({ color: 0x10b981, emissive: 0x047857, emissiveIntensity: 0.42, metalness: 0.35, roughness: 0.2, clearcoat: 0.9 });
  const violetMat = makeMat({ color: 0xa855f7, emissive: 0x6b21a8, emissiveIntensity: 0.45, metalness: 0.38, roughness: 0.2, clearcoat: 0.9 });

  if (modelId === 'turbofan') {
    const casingGeo = trackGeo(new THREE.CylinderGeometry(1.18, 1.05, 2.3, isLow ? 20 : 36, 1, true));
    casingGeo.rotateZ(Math.PI / 2);
    const casingMat = makeMat({
      color: 0x334155,
      metalness: 0.78,
      roughness: 0.22,
      clearcoat: 0.8,
      side: THREE.DoubleSide,
    });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.name = 'Vỏ động cơ Turbofan';
    casing.position.y = 1.45;
    addPart(casing, [0, 1.35, 0]);

    const intakeRingGeo = trackGeo(new THREE.TorusGeometry(1.06, 0.065, isLow ? 10 : 16, isLow ? 28 : 48));
    intakeRingGeo.rotateY(Math.PI / 2);
    const intakeRing = new THREE.Mesh(intakeRingGeo, metalMat);
    intakeRing.name = 'Vành nạp khí';
    intakeRing.position.set(-1.14, 1.45, 0);
    addPart(intakeRing, [-0.95, 0.85, 0]);

    const coreGeo = trackGeo(new THREE.CylinderGeometry(0.42, 0.55, 2.5, isLow ? 16 : 28));
    coreGeo.rotateZ(Math.PI / 2);
    const core = new THREE.Mesh(coreGeo, amberMat);
    core.name = 'Lõi buồng đốt';
    core.position.y = 1.45;
    addPart(core, [0, 0, 0]);

    const fanGroup = new THREE.Group();
    fanGroup.name = 'Cụm cánh quạt nén';
    fanGroup.position.set(-1.05, 1.45, 0);
    const coneGeo = trackGeo(new THREE.ConeGeometry(0.32, 0.65, 24));
    coneGeo.rotateZ(Math.PI / 2);
    const spinnerCone = new THREE.Mesh(coneGeo, cyanMat);
    spinnerCone.name = 'Mũi nón khí động';
    fanGroup.add(spinnerCone);
    const bladeGeo = trackGeo(new THREE.BoxGeometry(0.08, 0.88, 0.22));
    for (let i = 0; i < 12; i++) {
      const b = new THREE.Mesh(bladeGeo, metalMat);
      b.name = `Cánh quạt #${i + 1}`;
      const ang = (i / 12) * Math.PI * 2;
      b.position.set(0, Math.cos(ang) * 0.58, Math.sin(ang) * 0.58);
      b.rotation.x = ang;
      b.rotation.y = 0.35;
      fanGroup.add(b);
    }
    spinners.push(fanGroup);
    addPart(fanGroup, [-1.45, 0, 0]);

    const nozzleGeo = trackGeo(new THREE.CylinderGeometry(0.52, 0.82, 0.85, isLow ? 16 : 28, 1, true));
    nozzleGeo.rotateZ(Math.PI / 2);
    const nozzle = new THREE.Mesh(nozzleGeo, darkMat);
    nozzle.name = 'Ống xả phản lực';
    nozzle.position.set(1.45, 1.45, 0);
    addPart(nozzle, [1.4, 0, 0]);
  } else if (modelId === 'solar_system') {
    const sunGeo = trackGeo(new THREE.SphereGeometry(0.55, isLow ? 16 : 28, isLow ? 16 : 28));
    const sun = new THREE.Mesh(sunGeo, amberMat);
    sun.name = 'Mặt Trời';
    sun.position.y = 1.5;
    addPart(sun, [0, 0.9, 0]);

    const configs = [
      { r: 1.05, size: 0.14, color: 0x38bdf8, yOff: 0.15, name: 'Hành tinh quỹ đạo trong' },
      { r: 1.55, size: 0.2, color: 0x10b981, yOff: 0.35, name: 'Trái Đất & Khí quyển' },
      { r: 2.15, size: 0.26, color: 0xf97316, yOff: -0.25, name: 'Hành tinh khí khổng lồ' },
    ];
    configs.forEach((cfg, idx) => {
      const orbitGroup = new THREE.Group();
      orbitGroup.position.y = 1.5;
      const ringGeo = trackGeo(new THREE.TorusGeometry(cfg.r, 0.018, 10, isLow ? 28 : 52));
      ringGeo.rotateX(Math.PI / 2);
      const orbitMesh = new THREE.Mesh(ringGeo, darkMat);
      orbitMesh.name = `Quỹ đạo ${idx + 1}`;
      orbitGroup.add(orbitMesh);

      const pMat = makeMat({ color: cfg.color, emissive: cfg.color, emissiveIntensity: 0.22, metalness: 0.25, roughness: 0.4 });
      const pMesh = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(cfg.size, 20, 20)), pMat);
      pMesh.name = cfg.name;
      pMesh.position.set(cfg.r, 0, 0);
      orbitGroup.add(pMesh);
      orbitGroup.rotation.y = idx * 1.9;
      spinners.push(orbitGroup);
      addPart(orbitGroup, [0, cfg.yOff * 2.2, 0]);
    });
  } else if (modelId === 'bohr_atom') {
    const nucleus = new THREE.Group();
    nucleus.position.y = 1.6;
    const nGeo = trackGeo(new THREE.SphereGeometry(0.22, 16, 16));
    const offsets: [number, number, number][] = [
      [0.14, 0.1, 0],
      [-0.14, -0.08, 0.1],
      [0, 0.12, -0.14],
      [0.05, -0.14, -0.08],
    ];
    offsets.forEach((o, i) => {
      const m = new THREE.Mesh(nGeo, i % 2 === 0 ? amberMat : cyanMat);
      m.name = i % 2 === 0 ? `Proton #${i + 1}` : `Neutron #${i + 1}`;
      m.position.set(o[0], o[1], o[2]);
      nucleus.add(m);
    });
    addPart(nucleus, [0, 0, 0]);

    for (let s = 0; s < 3; s++) {
      const shell = new THREE.Group();
      shell.position.y = 1.6;
      const r = 0.95 + s * 0.42;
      const ring = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(r, 0.02, 10, 48)), violetMat);
      ring.name = `Quỹ đạo lượng tử n=${s + 1}`;
      shell.add(ring);
      const eMesh = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.11, 14, 14)), cyanMat);
      eMesh.name = `Electron lớp ${s + 1}`;
      eMesh.position.set(r, 0, 0);
      shell.add(eMesh);
      shell.rotation.set(s * 0.85, s * 0.65, s * 0.45);
      spinners.push(shell);
      addPart(shell, [(s - 1) * 1.1, (s - 1) * 0.5, 0]);
    }
  } else if (modelId === 'dna_helix') {
    const ptsA: THREE.Vector3[] = [];
    const ptsB: THREE.Vector3[] = [];
    for (let i = 0; i <= 36; i++) {
      const t = i / 36;
      const ang = t * Math.PI * 3.6;
      const y = 0.25 + t * 2.85;
      ptsA.push(new THREE.Vector3(Math.cos(ang) * 0.72, y, Math.sin(ang) * 0.72));
      ptsB.push(new THREE.Vector3(Math.cos(ang + Math.PI) * 0.72, y, Math.sin(ang + Math.PI) * 0.72));
    }
    const cA = new THREE.CatmullRomCurve3(ptsA);
    const cB = new THREE.CatmullRomCurve3(ptsB);
    const sA = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(cA, 48, 0.075, 10, false)), cyanMat);
    sA.name = 'Mạch khung đường-photphat 1';
    const sB = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(cB, 48, 0.075, 10, false)), emeraldMat);
    sB.name = 'Mạch khung đường-photphat 2';
    addPart(sA, [-1.2, 0, 0]);
    addPart(sB, [1.2, 0, 0]);

    const rungs = new THREE.Group();
    const rungGeo = trackGeo(new THREE.CylinderGeometry(0.038, 0.038, 1.36, 10));
    rungGeo.rotateZ(Math.PI / 2);
    const bpNodeGeo = trackGeo(new THREE.SphereGeometry(0.095, 14, 12));
    for (let i = 1; i <= 12; i++) {
      const t = i / 13;
      const pA = cA.getPoint(t);
      const pB = cB.getPoint(t);
      const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(pB, pA).normalize();
      const rMesh = new THREE.Mesh(rungGeo, i % 2 === 0 ? amberMat : violetMat);
      rMesh.name = i % 2 === 0 ? `Cặp Bazơ A-T #${i}` : `Cặp Bazơ G-C #${i}`;
      rMesh.position.copy(mid);
      rMesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
      const bondOrb = new THREE.Mesh(bpNodeGeo, i % 2 === 0 ? cyanMat : emeraldMat);
      bondOrb.name = 'Liên kết Hydro';
      bondOrb.position.copy(mid);
      rungs.add(rMesh, bondOrb);
    }
    addPart(rungs, [0, 0.7, 0.9]);
  } else if (modelId === 'oxyz_pyramid') {
    const base = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.2, 0.16, 2.2)), emeraldMat);
    base.name = 'Mặt đáy hình vuông ABCD';
    base.position.y = 0.2;
    addPart(base, [0, -0.85, 0]);

    const cone = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(1.52, 2.35, 4)), cyanMat);
    cone.name = 'Khối chóp tứ giác S.ABCD';
    cone.position.y = 1.45;
    cone.rotation.y = Math.PI / 4;
    addPart(cone, [0, 1.15, 0]);

    const axis = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 2.35, 12)), amberMat);
    axis.name = 'Đường cao SH';
    axis.position.y = 1.45;
    addPart(axis, [-1.2, 0.2, 0]);
  } else if (modelId === 'sphere_slice') {
    const sphereMat = makeMat({
      color: 0xec4899,
      emissive: 0xbe185d,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.48,
      roughness: 0.08,
      metalness: 0.15,
      clearcoat: 1.0,
      depthWrite: false,
    });
    const outer = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(1.45, 36, 28)), sphereMat);
    outer.name = 'Mặt cầu (S) bán kính R';
    outer.position.y = 1.65;
    addPart(outer, [0, 0.85, 0]);

    const core = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.32, 18, 18)), amberMat);
    core.name = 'Tâm I của mặt cầu';
    core.position.y = 1.65;
    addPart(core, [0, 0, 0]);

    const ring = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.22, 0.045, 12, 48)), cyanMat);
    ring.name = 'Đường tròn thiết diện (C)';
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 2.15;
    addPart(ring, [0, 1.4, 0]);
  } else if (modelId === 'robot_arm') {
    const plinth = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.95, 1.1, 0.28, 24)), darkMat);
    plinth.name = 'Đế xoay bậc 1';
    plinth.position.y = 0.15;
    addPart(plinth, [0, -0.6, 0]);

    const lowerArm = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.34, 1.35, 0.34)), amberMat);
    lowerArm.name = 'Cánh tay dưới (θ₁)';
    lowerArm.position.set(0, 0.95, 0);
    lowerArm.rotation.z = -0.22;
    addPart(lowerArm, [-0.9, 0.4, 0]);

    const upperArm = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.26, 1.25, 0.26)), cyanMat);
    upperArm.name = 'Cánh tay trên (θ₂)';
    upperArm.position.set(0.55, 1.95, 0);
    upperArm.rotation.z = -0.85;
    addPart(upperArm, [0.95, 0.85, 0]);

    const claw = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.24, 0.06, 10, 20, Math.PI * 1.4)), metalMat);
    claw.name = 'Kẹp gắp End-Effector';
    claw.position.set(1.18, 2.38, 0);
    addPart(claw, [1.45, 1.15, 0]);
  } else {
    const tower = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.11, 0.26, 2.5, 20)), metalMat);
    tower.name = 'Tháp trụ đỡ Tuabin';
    tower.position.y = 1.25;
    addPart(tower, [0, -0.5, 0]);

    const nacelle = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.42, 0.36, 0.85)), darkMat);
    nacelle.name = 'Vỏ máy phát điện Nacelle';
    nacelle.position.set(0, 2.52, -0.1);
    addPart(nacelle, [0, 0.9, -0.8]);

    const rotor = new THREE.Group();
    rotor.position.set(0, 2.52, 0.38);
    const hub = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.16, 14, 14)), cyanMat);
    hub.name = 'Trục Rotor';
    rotor.add(hub);
    const bladeGeo = trackGeo(new THREE.BoxGeometry(0.11, 1.25, 0.04));
    for (let i = 0; i < 3; i++) {
      const pivot = new THREE.Group();
      pivot.rotation.z = (i * Math.PI * 2) / 3;
      const blade = new THREE.Mesh(bladeGeo, emeraldMat);
      blade.name = `Cánh quạt gió #${i + 1}`;
      blade.position.y = 0.65;
      pivot.add(blade);
      rotor.add(pivot);
    }
    spinners.push(rotor);
    addPart(rotor, [0, 0.45, 1.35]);
  }

  return { group, parts, spinners, disposables: { geometries, materials } };
}

export const MeetShared3DStage: React.FC<MeetShared3DStageProps> = ({
  isEn,
  graphicsQuality = 'medium',
  sharedState,
  onPatchState,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sharedStateRef = useRef<MeetShared3DState>(sharedState);
  const onPatchRef = useRef(onPatchState);
  const graphicsQualityRef = useRef<MeetGraphicsQuality>(graphicsQuality);
  sharedStateRef.current = sharedState;
  onPatchRef.current = onPatchState;
  graphicsQualityRef.current = graphicsQuality;

  const modelRuntimeRef = useRef<ReturnType<typeof buildMeetModel> | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const postPipelineRef = useRef<PostProcessPipeline | null>(null);
  const starfieldRef = useRef<THREE.Points | null>(null);
  const axisGuideRef = useRef<THREE.Group | null>(null);
  const energyRingRef = useRef<THREE.Mesh | null>(null);
  const energyLineRef = useRef<THREE.Object3D | null>(null);
  const rimOrbitLightRef = useRef<THREE.PointLight | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const stageDiscRef = useRef<THREE.Mesh | null>(null);
  const particlePoolRef = useRef<GPUParticlePool | null>(null);
  const troikaLabelRef = useRef<any>(null);
  const presetLerpActiveRef = useRef<boolean>(false);

  const isUserDraggingRef = useRef(false);
  const lastEmitAtRef = useRef(0);
  const prevExplodeRef = useRef<number>(sharedState.explode);

  const [interactiveModels, setInteractiveModels] = useState<CustomSpatialModel[]>([]);
  const [inspectedPart, setInspectedPart] = useState<InspectedPartInfo | null>(null);
  const [uploadingModel, setUploadingModel] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchCustomSpatialModels()
      .then((list) => {
        if (active) setInteractiveModels(list);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Trigger camera preset interpolation when cameraPreset changes
  useEffect(() => {
    if (sharedState.cameraPreset) {
      presetLerpActiveRef.current = true;
    }
  }, [sharedState.cameraPreset]);

  // Burst GPUParticlePool when toggling explode layers in High tier
  useEffect(() => {
    const prev = prevExplodeRef.current;
    prevExplodeRef.current = sharedState.explode;
    if (Math.abs(prev - sharedState.explode) > 0.2 && particlePoolRef.current && graphicsQuality === 'high') {
      const pool = particlePoolRef.current;
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        pool.spawn(
          Math.cos(a) * 0.4,
          1.45 + (Math.random() - 0.5) * 0.6,
          Math.sin(a) * 0.4,
          Math.cos(a) * 1.9,
          (Math.random() - 0.3) * 1.2,
          Math.sin(a) * 1.9,
          0.75,
          1.15
        );
      }
    }
  }, [sharedState.explode, graphicsQuality]);

  // Sync runtime graphics tier changes dynamically
  useEffect(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const isSw = detectSoftwareGl();

    if (renderer) {
      const maxDpr = graphicsQuality === 'high' ? 2 : graphicsQuality === 'medium' ? 1.35 : 1;
      renderer.setPixelRatio(isSw ? 1 : Math.min(window.devicePixelRatio || 1, maxDpr));
      renderer.shadowMap.enabled = !isSw && graphicsQuality !== 'low';
      renderer.toneMappingExposure = graphicsQuality === 'high' ? 1.24 : graphicsQuality === 'medium' ? 1.12 : 1.0;
    }
    if (keyLightRef.current) {
      keyLightRef.current.castShadow = !isSw && graphicsQuality !== 'low';
    }
    if (stageDiscRef.current) {
      stageDiscRef.current.receiveShadow = !isSw && graphicsQuality !== 'low';
    }
    if (starfieldRef.current) {
      starfieldRef.current.visible = graphicsQuality !== 'low';
      const sm = starfieldRef.current.material as THREE.PointsMaterial;
      sm.opacity = graphicsQuality === 'high' ? 0.65 : 0.25;
      sm.size = graphicsQuality === 'high' ? 0.065 : 0.045;
    }
    if (axisGuideRef.current) {
      axisGuideRef.current.visible = graphicsQuality !== 'low';
    }
    if (energyRingRef.current) {
      energyRingRef.current.visible = graphicsQuality === 'high';
    }
    if (energyLineRef.current) {
      energyLineRef.current.visible = graphicsQuality !== 'low';
    }
    if (rimOrbitLightRef.current) {
      rimOrbitLightRef.current.intensity = graphicsQuality === 'high' ? 3.2 : 0;
    }
    if (particlePoolRef.current) {
      particlePoolRef.current.mesh.visible = graphicsQuality === 'high';
    }
    if (troikaLabelRef.current) {
      troikaLabelRef.current.visible = graphicsQuality === 'high';
    }

    // Manage post-processing pipeline on tier toggle
    if (renderer && scene && camera) {
      if (graphicsQuality === 'high' && !isSw) {
        if (!postPipelineRef.current) {
          const pp = createPostProcessingPipeline(renderer, scene, camera, {
            bloomIntensity: 0.36,
            luminanceThreshold: 0.82,
            enableSmaa: true,
          });
          const mount = mountRef.current;
          if (mount) pp.setSize(mount.clientWidth || 640, mount.clientHeight || 420);
          postPipelineRef.current = pp;
        }
      } else if (postPipelineRef.current) {
        postPipelineRef.current.dispose();
        postPipelineRef.current = null;
      }
    }
  }, [graphicsQuality]);

  useEffect(() => {
    const built = modelRuntimeRef.current;
    if (!built) return;
    const wf = Boolean(sharedState.wireframe);
    built.group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m: any) => {
          if (m && 'wireframe' in m) m.wireframe = wf;
        });
      }
    });
  }, [sharedState.wireframe, sharedState.modelId, sharedState.uploadedFileUrl]);

  const normalizeExternalGroup = (obj: THREE.Object3D): ReturnType<typeof buildMeetModel> => {
    const wrapper = new THREE.Group();
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const scale = 2.6 / maxDim;
    obj.scale.multiplyScalar(scale);
    obj.position.sub(center.multiplyScalar(scale));
    obj.position.y += (size.y * scale) / 2 + 0.25;

    const parts: ExplodablePart[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    let partIdx = 0;

    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!mesh.name) mesh.name = `Chi tiết #${++partIdx}`;
        if (mesh.geometry) geometries.push(mesh.geometry);
        if (Array.isArray(mesh.material)) materials.push(...mesh.material);
        else if (mesh.material) materials.push(mesh.material);
        const dir = mesh.position.clone();
        if (dir.lengthSq() < 0.01) dir.set((partIdx % 3) - 1, 0.5, ((partIdx + 1) % 3) - 1);
        dir.normalize().multiplyScalar(0.85);
        parts.push({ obj: mesh, basePos: mesh.position.clone(), dir });
      }
    });
    wrapper.add(obj);
    return { group: wrapper, parts, spinners: [], disposables: { geometries, materials } };
  };

  // Update floating 3D Troika label whenever active model changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (troikaLabelRef.current) {
      scene.remove(troikaLabelRef.current);
      troikaLabelRef.current.dispose?.();
      troikaLabelRef.current = null;
    }

    const activeBuiltIn = MEET_3D_MODELS.find((m) => m.id === sharedState.modelId);
    const activeCustom = sharedState.modelId.startsWith('custom:')
      ? interactiveModels.find((m) => `custom:${m.id}` === sharedState.modelId)
      : undefined;
    const text =
      sharedState.modelId === 'uploaded'
        ? sharedState.customModelName || 'Uploaded 3D Model'
        : activeCustom
        ? activeCustom.titleVi
        : activeBuiltIn
        ? `${isEn ? activeBuiltIn.titleEn : activeBuiltIn.titleVi}\n${activeBuiltIn.formula}`
        : MEET_3D_MODELS[0].titleVi;

    const lbl = createTroikaLabel({
      text,
      position: [0, 3.25, 0],
      fontSize: 0.19,
      color: 0xe0f2fe,
      outlineColor: 0x020617,
      outlineWidth: 0.02,
      maxWidth: 4.5,
    });
    lbl.visible = graphicsQualityRef.current === 'high';
    scene.add(lbl);
    troikaLabelRef.current = lbl;

    return () => {
      if (troikaLabelRef.current) {
        scene.remove(troikaLabelRef.current);
        troikaLabelRef.current.dispose?.();
        troikaLabelRef.current = null;
      }
    };
  }, [sharedState.modelId, sharedState.customModelName, interactiveModels, isEn]);

  // Build / rebuild 3D model when modelId, uploadedFileUrl, or tier changes
  useEffect(() => {
    const root = rootGroupRef.current;
    if (!root) return;
    let cancelled = false;
    const isSw = detectSoftwareGl();

    const disposeCurrent = () => {
      if (modelRuntimeRef.current) {
        root.remove(modelRuntimeRef.current.group);
        modelRuntimeRef.current.disposables.geometries.forEach((g) => g.dispose());
        modelRuntimeRef.current.disposables.materials.forEach((m) => m.dispose());
        modelRuntimeRef.current = null;
      }
    };

    const mountBuilt = (built: ReturnType<typeof buildMeetModel>) => {
      if (cancelled) return;
      disposeCurrent();
      built.group.rotation.y = sharedStateRef.current.rotY;
      built.group.rotation.x = sharedStateRef.current.rotX;
      built.group.scale.setScalar(sharedStateRef.current.zoom);
      if (!isSw && graphicsQualityRef.current !== 'low') {
        built.group.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            (o as THREE.Mesh).castShadow = true;
            (o as THREE.Mesh).receiveShadow = true;
          }
        });
      }
      if (sharedStateRef.current.wireframe) {
        built.group.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            const mats = Array.isArray((o as THREE.Mesh).material)
              ? ((o as THREE.Mesh).material as any[])
              : [(o as THREE.Mesh).material as any];
            mats.forEach((m) => {
              if (m && 'wireframe' in m) m.wireframe = true;
            });
          }
        });
      }
      root.add(built.group);
      modelRuntimeRef.current = built;
      setInspectedPart(null);

      // Particle welcome burst on High tier
      if (particlePoolRef.current && graphicsQualityRef.current === 'high') {
        for (let i = 0; i < 18; i++) {
          const a = (i / 18) * Math.PI * 2;
          particlePoolRef.current.spawn(
            Math.cos(a) * 0.5,
            1.4,
            Math.sin(a) * 0.5,
            Math.cos(a) * 1.4,
            0.8 + Math.random() * 0.8,
            Math.sin(a) * 1.4,
            0.7,
            1.0
          );
        }
      }
    };

    if (sharedState.modelId === 'uploaded' && sharedState.uploadedFileUrl) {
      const ext = sharedState.uploadedFileExt || 'glb';
      if (ext === 'obj') {
        new OBJLoader().load(
          sharedState.uploadedFileUrl,
          (obj) => {
            obj.traverse((c) => {
              if ((c as THREE.Mesh).isMesh && !(c as THREE.Mesh).material) {
                (c as THREE.Mesh).material = new THREE.MeshStandardMaterial({
                  color: 0x38bdf8,
                  metalness: 0.35,
                  roughness: 0.45,
                });
              }
            });
            mountBuilt(normalizeExternalGroup(obj));
          },
          undefined,
          () => setUploadError('Không thể tải file .obj đã chia sẻ.')
        );
      } else {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        const base = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
        const normBase = base.endsWith('/') ? base : `${base}/`;
        dracoLoader.setDecoderPath(`${normBase}draco/`);
        gltfLoader.setDRACOLoader(dracoLoader);
        gltfLoader.setMeshoptDecoder(MeshoptDecoder);
        gltfLoader.load(
          sharedState.uploadedFileUrl,
          (gltf) => {
            dracoLoader.dispose();
            mountBuilt(normalizeExternalGroup(gltf.scene));
          },
          undefined,
          () => {
            dracoLoader.dispose();
            setUploadError('Không thể tải file .glb/.gltf đã chia sẻ.');
          }
        );
      }
      return () => {
        cancelled = true;
      };
    }

    if (sharedState.modelId.startsWith('custom:')) {
      const customId = sharedState.modelId.slice('custom:'.length);
      const found = interactiveModels.find((m) => m.id === customId);
      if (found) {
        const mats = {
          primary: new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.45, roughness: 0.32 }),
          secondary: new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.5, roughness: 0.4 }),
          highlight: new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.35, roughness: 0.3 }),
          edge: new THREE.LineBasicMaterial({ color: 0x7dd3fc }),
          glow: new THREE.MeshStandardMaterial({
            color: 0x22d3ee,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.75,
          }),
        };
        const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 100);
        const dyn = buildCustomSpatialModel(found, mats, 'solid', clipPlane, isSw);
        const parts: ExplodablePart[] = dyn.explodables.map((e) => ({
          obj: e.mesh,
          basePos: e.basePos.clone(),
          dir: e.explodeDir.clone(),
        }));
        const geometries: THREE.BufferGeometry[] = [];
        const materials: THREE.Material[] = [];
        dyn.group.traverse((c) => {
          if ((c as THREE.Mesh).isMesh) {
            const mesh = c as THREE.Mesh;
            if (mesh.geometry) geometries.push(mesh.geometry);
            if (Array.isArray(mesh.material)) materials.push(...mesh.material);
            else if (mesh.material) materials.push(mesh.material);
          }
        });
        mountBuilt({ group: dyn.group, parts, spinners: [], disposables: { geometries, materials } });
        return () => {
          cancelled = true;
        };
      }
    }

    const builtId = (
      MEET_3D_MODELS.some((m) => m.id === sharedState.modelId) ? sharedState.modelId : 'turbofan'
    ) as Meet3DModelId;
    mountBuilt(buildMeetModel(builtId, graphicsQuality));

    return () => {
      cancelled = true;
    };
  }, [sharedState.modelId, sharedState.uploadedFileUrl, sharedState.uploadedFileExt, interactiveModels, graphicsQuality]);

  // Mount Three.js WebGL stage once
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const isSoftwareGl = detectSoftwareGl();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060b16);
    scene.fog = new THREE.FogExp2(0x060b16, 0.032);
    sceneRef.current = scene;

    const w = mount.clientWidth || 640;
    const h = mount.clientHeight || 420;
    const camera = new THREE.PerspectiveCamera(45, w / Math.max(1, h), 0.1, 100);
    camera.position.set(0, 2.35, 5.6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    const tier = graphicsQualityRef.current;
    const maxDpr = tier === 'high' ? 2 : tier === 'medium' ? 1.35 : 1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = tier === 'high' ? 1.24 : tier === 'medium' ? 1.12 : 1.0;
    if (!isSoftwareGl && tier !== 'low') {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xbae6fd, 0x0f172a, 0.95));
    const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.2);
    keyLight.position.set(5, 8, 6);
    if (!isSoftwareGl && tier !== 'low') {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -6;
      keyLight.shadow.camera.right = 6;
      keyLight.shadow.camera.top = 6;
      keyLight.shadow.camera.bottom = -6;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.35);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    const rimOrbitLight = new THREE.PointLight(0x22d3ee, tier === 'high' ? 3.2 : 0, 12);
    rimOrbitLight.position.set(3.2, 2.2, 2.8);
    scene.add(rimOrbitLight);
    rimOrbitLightRef.current = rimOrbitLight;

    const stageDiscGeo = new THREE.CylinderGeometry(6.0, 6.3, 0.07, 48);
    const stageDiscMat = new THREE.MeshStandardMaterial({ color: 0x070d1b, roughness: 0.7, metalness: 0.25 });
    const stageDisc = new THREE.Mesh(stageDiscGeo, stageDiscMat);
    stageDisc.position.y = -0.045;
    stageDisc.receiveShadow = !isSoftwareGl && tier !== 'low';
    scene.add(stageDisc);
    stageDiscRef.current = stageDisc;

    // Pedestal outer glowing ring (High tier)
    const energyRingGeo = new THREE.TorusGeometry(3.25, 0.026, 12, 80);
    energyRingGeo.rotateX(Math.PI / 2);
    const energyRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.72,
    });
    const energyRing = new THREE.Mesh(energyRingGeo, energyRingMat);
    energyRing.position.y = 0.015;
    energyRing.visible = tier === 'high';
    scene.add(energyRing);
    energyRingRef.current = energyRing;

    // Dashed outer Line2 perimeter ring (Medium + High)
    const ringPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      ringPts.push(new THREE.Vector3(Math.cos(a) * 3.7, 0.012, Math.sin(a) * 3.7));
    }
    const energyLine = createCrispLine2(ringPts, {
      color: 0x38bdf8,
      linewidth: 1.7,
      dashed: true,
      dashSize: 0.25,
      gapSize: 0.16,
      transparent: true,
      opacity: 0.45,
    });
    energyLine.visible = tier !== 'low';
    scene.add(energyLine);
    energyLineRef.current = energyLine;

    // Precision Oxyz axis guides via Line2 (Medium + High)
    const axisGroup = new THREE.Group();
    axisGroup.visible = tier !== 'low';
    const xLine = createCrispLine2([[-3.4, 0.02, 0], [3.4, 0.02, 0]], { color: 0xf43f5e, linewidth: 1.5, transparent: true, opacity: 0.42 });
    const yLine = createCrispLine2([[0, 0.02, 0], [0, 3.6, 0]], { color: 0x10b981, linewidth: 1.5, transparent: true, opacity: 0.42 });
    const zLine = createCrispLine2([[0, 0.02, -3.4], [0, 0.02, 3.4]], { color: 0x38bdf8, linewidth: 1.5, transparent: true, opacity: 0.42 });
    axisGroup.add(xLine, yLine, zLine);
    scene.add(axisGroup);
    axisGuideRef.current = axisGroup;

    const grid = new THREE.GridHelper(12, 18, 0x38bdf8, 0x1e293b);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.42;
    grid.position.y = -0.006;
    scene.add(grid);

    // Ambient particle field (Medium + High)
    const starCount = 260;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 20;
      starPos[i * 3 + 1] = Math.random() * 10 - 1;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: tier === 'high' ? 0.065 : 0.045,
      transparent: true,
      opacity: tier === 'high' ? 0.65 : 0.25,
    });
    const starfield = new THREE.Points(starGeo, starMat);
    starfield.visible = tier !== 'low';
    scene.add(starfield);
    starfieldRef.current = starfield;

    // Instanced GPU Particle Pool (High tier)
    const particlePool = new GPUParticlePool(72, 0.042, 0x38bdf8, 0xfacc15);
    particlePool.mesh.visible = tier === 'high';
    scene.add(particlePool.mesh);
    particlePoolRef.current = particlePool;

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    rootGroupRef.current = rootGroup;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.screenSpacePanning = true;
    controls.target.set(0, 1.45, 0);
    controls.minDistance = 1.6;
    controls.maxDistance = 14;
    controlsRef.current = controls;

    if (tier === 'high' && !isSoftwareGl) {
      const pp = createPostProcessingPipeline(renderer, scene, camera, {
        bloomIntensity: 0.36,
        luminanceThreshold: 0.82,
        enableSmaa: true,
      });
      pp.setSize(w, h);
      postPipelineRef.current = pp;
    }
    syncLine2Resolution(scene, w, h);

    // Raycaster for inspecting individual 3D parts
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (Math.hypot(dx, dy) > 6) return;
      const built = modelRuntimeRef.current;
      if (!built) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(built.group.children, true);
      const hitMesh = hits.find((h) => (h.object as THREE.Mesh).isMesh)?.object as THREE.Mesh | undefined;
      if (hitMesh) {
        const geo = hitMesh.geometry;
        const triCount = geo.index
          ? Math.round(geo.index.count / 3)
          : Math.round((geo.attributes.position?.count || 0) / 3);
        const box = new THREE.Box3().setFromObject(hitMesh);
        const sz = new THREE.Vector3();
        box.getSize(sz);
        const partName = hitMesh.name || 'Chi tiết cấu tạo 3D';
        setInspectedPart({
          name: partName,
          triangles: triCount,
          sizeText: `${sz.x.toFixed(2)} × ${sz.y.toFixed(2)} × ${sz.z.toFixed(2)} đv`,
        });
        onPatchRef.current({ selectedPartName: partName });
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const emitSyncedOrientation = () => {
      const now = performance.now();
      if (now - lastEmitAtRef.current < 85) return;
      lastEmitAtRef.current = now;
      const offset = _tmpVec.subVectors(camera.position, controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      const rotY = +spherical.theta.toFixed(3);
      const rotX = +THREE.MathUtils.clamp(spherical.phi - Math.PI / 2, -0.8, 0.8).toFixed(3);
      const zoom = +THREE.MathUtils.clamp(5.6 / Math.max(2.2, spherical.radius), 0.55, 2.1).toFixed(2);
      onPatchRef.current({ rotY, rotX, zoom, autoSpin: false });
    };

    const onStart = () => {
      isUserDraggingRef.current = true;
      presetLerpActiveRef.current = false;
    };
    const onChange = () => {
      if (isUserDraggingRef.current) {
        emitSyncedOrientation();
      }
    };
    const onEnd = () => {
      isUserDraggingRef.current = false;
    };
    controls.addEventListener('start', onStart);
    controls.addEventListener('change', onChange);
    controls.addEventListener('end', onEnd);

    const ro = new ResizeObserver(() => {
      if (!mount) return;
      const nw = mount.clientWidth || 640;
      const nh = mount.clientHeight || 420;
      camera.aspect = nw / Math.max(1, nh);
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      postPipelineRef.current?.setSize(nw, nh);
      syncLine2Resolution(scene, nw, nh);
    });
    ro.observe(mount);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const st = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (st === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 6);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 6);
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(0.05, clock.getDelta());
      const elapsed = clock.elapsedTime;
      const st = sharedStateRef.current;
      const q = graphicsQualityRef.current;
      const built = modelRuntimeRef.current;

      if (built) {
        for (const sp of built.spinners) {
          if (st.modelId === 'turbofan') sp.rotation.x += dt * 3.8;
          else if (st.modelId === 'wind_turbine') sp.rotation.z -= dt * 2.2;
          else sp.rotation.y += dt * 0.9;
        }

        const lerpAlpha = 1 - Math.exp(-10 * dt);
        for (const p of built.parts) {
          _tmpVec.copy(p.basePos).addScaledVector(p.dir, st.explode);
          p.obj.position.lerp(_tmpVec, lerpAlpha);
        }

        if (st.autoSpin && !isUserDraggingRef.current) {
          built.group.rotation.y += dt * 0.45;
        } else if (!isUserDraggingRef.current) {
          built.group.rotation.y = THREE.MathUtils.damp(built.group.rotation.y, st.rotY, 8, dt);
          built.group.rotation.x = THREE.MathUtils.damp(built.group.rotation.x, st.rotX, 8, dt);
        }

        const nextScale = THREE.MathUtils.damp(built.group.scale.x, st.zoom, 8, dt);
        built.group.scale.setScalar(nextScale);
      }

      if (presetLerpActiveRef.current && st.cameraPreset && !isUserDraggingRef.current) {
        const preset = CAMERA_PRESET_TARGETS[st.cameraPreset] || CAMERA_PRESET_TARGETS.perspective;
        _targetCamPos.set(preset.pos[0], preset.pos[1], preset.pos[2]);
        _targetCtrl.set(preset.target[0], preset.target[1], preset.target[2]);
        const alpha = 1 - Math.exp(-7 * dt);
        camera.position.lerp(_targetCamPos, alpha);
        controls.target.lerp(_targetCtrl, alpha);
        if (camera.position.distanceTo(_targetCamPos) < 0.03) {
          presetLerpActiveRef.current = false;
        }
      }

      if (starfield.visible) {
        starfield.rotation.y += dt * (q === 'high' ? 0.05 : 0.02);
      }
      if (energyLine.visible) {
        energyLine.rotation.y -= dt * 0.14;
      }
      if (energyRing.visible) {
        energyRingMat.opacity = 0.52 + Math.sin(elapsed * 2.4) * 0.22;
      }
      if (q === 'high') {
        rimOrbitLight.position.x = Math.cos(elapsed * 0.85) * 3.8;
        rimOrbitLight.position.z = Math.sin(elapsed * 0.85) * 3.8;
        particlePool.update(dt, 0.08);
        updateBillboardLabels(scene, camera);
      }

      controls.update();
      if (postPipelineRef.current && q === 'high') {
        postPipelineRef.current.render(dt);
      } else {
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    if (isSoftwareGl) afterDraw(tick);
    else frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('change', onChange);
      controls.removeEventListener('end', onEnd);
      controls.dispose();
      postPipelineRef.current?.dispose();
      postPipelineRef.current = null;
      particlePool.dispose();
      xLine.geometry.dispose();
      xLine.material.dispose();
      yLine.geometry.dispose();
      yLine.material.dispose();
      zLine.geometry.dispose();
      zLine.material.dispose();
      energyLine.geometry.dispose();
      energyLine.material.dispose();
      energyRingGeo.dispose();
      energyRingMat.dispose();
      stageDiscGeo.dispose();
      stageDiscMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      if (troikaLabelRef.current) {
        troikaLabelRef.current.dispose?.();
        troikaLabelRef.current = null;
      }
      if (modelRuntimeRef.current) {
        modelRuntimeRef.current.disposables.geometries.forEach((g) => g.dispose());
        modelRuntimeRef.current.disposables.materials.forEach((m) => m.dispose());
        modelRuntimeRef.current = null;
      }
      envTex.dispose();
      renderer.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      starfieldRef.current = null;
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleUpload3DFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);

    const extMatch = file.name.toLowerCase().match(/\.(glb|gltf|obj)$/);
    if (!extMatch) {
      setUploadError('Chỉ hỗ trợ định dạng mô hình 3D: .glb, .gltf hoặc .obj');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setUploadError('File mô hình 3D phải nhỏ hơn 12MB.');
      return;
    }

    const ext = extMatch[1] as 'glb' | 'gltf' | 'obj';
    setUploadingModel(true);
    try {
      const arrayBuf = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuf);
      let binary = '';
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      const dataBase64 = btoa(binary);

      const res = await fetch(resolveApiUrl('/api/meet/models'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, ext, dataBase64 }),
      });
      const ct = res.headers.get('content-type') || '';
      let modelUrl = '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        modelUrl = data?.url || '';
      }
      if (!modelUrl) {
        modelUrl = URL.createObjectURL(file);
      }
      onPatchState({
        modelId: 'uploaded',
        customModelName: file.name,
        uploadedFileUrl: modelUrl,
        uploadedFileExt: ext,
        explode: 0,
        rotX: 0.2,
        rotY: 0,
        zoom: 1,
        autoSpin: false,
      });
    } catch (err: any) {
      setUploadError(err?.message || 'Không thể tải lên mô hình 3D.');
    } finally {
      setUploadingModel(false);
    }
  };

  const activeBuiltIn = MEET_3D_MODELS.find((m) => m.id === sharedState.modelId);
  const activeCustom = sharedState.modelId.startsWith('custom:')
    ? interactiveModels.find((m) => `custom:${m.id}` === sharedState.modelId)
    : undefined;

  const displayTitle =
    sharedState.modelId === 'uploaded'
      ? sharedState.customModelName || 'Mô hình 3D tải lên'
      : activeCustom
      ? activeCustom.titleVi
      : activeBuiltIn
      ? isEn
        ? activeBuiltIn.titleEn
        : activeBuiltIn.titleVi
      : MEET_3D_MODELS[0].titleVi;

  const displaySubject =
    sharedState.modelId === 'uploaded'
      ? 'Mô hình 3D tải lên (.glb/.obj)'
      : activeCustom
      ? 'Học tương tác 3D · Mô hình đã lưu'
      : activeBuiltIn
      ? isEn
        ? activeBuiltIn.subjectEn
        : activeBuiltIn.subjectVi
      : MEET_3D_MODELS[0].subjectVi;

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-xl overflow-hidden bg-[#060b16] border border-slate-700/80">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top-Left Model Spec & Graphics Tier Tag (no backdrop-blur over WebGL) */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none max-w-[310px] rounded-lg bg-slate-950/92 border border-slate-700/80 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px] font-bold text-cyan-300 truncate">{displaySubject}</div>
          <span
            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${
              graphicsQuality === 'high'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                : graphicsQuality === 'medium'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            {graphicsQuality === 'high' ? 'PRO 3D' : graphicsQuality === 'medium' ? 'MED' : 'LOW'}
          </span>
        </div>
        <div className="text-xs sm:text-sm font-extrabold text-white truncate">{displayTitle}</div>
        {activeBuiltIn && (
          <div className="text-[11px] font-mono text-slate-300 mt-0.5">{activeBuiltIn.formula}</div>
        )}
        <div className="text-[10px] text-slate-400 mt-1">
          Chuột trái: Xoay · Chuột phải: Di chuyển · Cuộn: Zoom · Click: Soi chi tiết
        </div>
        {sharedState.updatedBy && (
          <div className="text-[10px] text-emerald-300 mt-0.5 truncate">
            {isEn ? `Synced by ${sharedState.updatedBy}` : `Đang đồng bộ bởi ${sharedState.updatedBy}`}
          </div>
        )}
      </div>

      {/* Top-Right Clicked Part Inspection Card */}
      {(inspectedPart || uploadError) && (
        <div className="absolute top-3 right-3 z-10 max-w-[240px] rounded-lg bg-slate-950/95 border border-sky-500/40 px-3 py-2 text-xs">
          {uploadError ? (
            <div className="text-rose-300">{uploadError}</div>
          ) : (
            inspectedPart && (
              <>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-300">
                  <MousePointerClick className="w-3.5 h-3.5" />
                  Đang nghiên cứu chi tiết
                </div>
                <div className="mt-0.5 font-semibold text-white truncate">{inspectedPart.name}</div>
                <div className="mt-0.5 text-[10px] text-slate-400">
                  Kích thước: {inspectedPart.sizeText}
                </div>
                <div className="text-[10px] text-slate-400">
                  Đa giác: {inspectedPart.triangles.toLocaleString()} tam giác
                </div>
              </>
            )
          )}
        </div>
      )}

      {/* Hidden File Input for .glb / .gltf / .obj */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf,.obj"
        onChange={handleUpload3DFile}
        className="hidden"
      />

      {/* Bottom Compact Synchronized 3D Controls */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex flex-wrap items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/95 border border-slate-700/85 max-w-[96%]">
        <select
          value={sharedState.modelId}
          onChange={(e) =>
            onPatchState({
              modelId: e.target.value,
              explode: 0,
              rotY: 0,
              rotX: 0,
              zoom: 1,
            })
          }
          className="max-w-[185px] px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-[11px] font-bold text-white cursor-pointer"
        >
          <optgroup label="Mô hình STEM có sẵn">
            {MEET_3D_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {isEn ? m.titleEn : m.titleVi}
              </option>
            ))}
          </optgroup>
          {interactiveModels.length > 0 && (
            <optgroup label="Từ Học tương tác 3D">
              {interactiveModels.map((cm) => (
                <option key={cm.id} value={`custom:${cm.id}`}>
                  ★ {cm.titleVi}
                </option>
              ))}
            </optgroup>
          )}
          {sharedState.modelId === 'uploaded' && (
            <option value="uploaded">
              ⬆ {sharedState.customModelName || 'Mô hình tải lên'}
            </option>
          )}
        </select>

        {/* Camera Presets synced across peers */}
        <div className="hidden sm:flex items-center gap-0.5 rounded-md bg-slate-900 border border-slate-700 p-0.5">
          <Camera className="w-3 h-3 text-slate-400 mx-1 shrink-0" />
          {(['perspective', 'front', 'top', 'closeup'] as MeetCameraPreset[]).map((presetKey) => {
            const p = CAMERA_PRESET_TARGETS[presetKey];
            const active = (sharedState.cameraPreset || 'perspective') === presetKey;
            return (
              <button
                key={presetKey}
                type="button"
                onClick={() => onPatchState({ cameraPreset: presetKey })}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap cursor-pointer ${
                  active ? 'bg-sky-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {isEn ? p.labelEn : p.labelVi}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={uploadingModel}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-500/20 border border-sky-400/50 text-sky-200 hover:bg-sky-500 hover:text-slate-950 text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          title="Tải lên file 3D (.glb, .gltf, .obj) để cả phòng cùng xem"
        >
          <Upload className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadingModel ? 'Đang tải...' : 'Up 3D'}</span>
        </button>

        <button
          type="button"
          onClick={() => onPatchState({ wireframe: !sharedState.wireframe })}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer ${
            sharedState.wireframe
              ? 'bg-violet-500 text-white'
              : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-violet-400'
          }`}
          title="Chế độ khung dây nghiên cứu cấu trúc"
        >
          <Grid3X3 className="w-3.5 h-3.5 shrink-0" />
          <span>Khung dây</span>
        </button>

        <button
          type="button"
          onClick={() => onPatchState({ explode: sharedState.explode >= 0.4 ? 0 : 1.0 })}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer ${
            sharedState.explode >= 0.4
              ? 'bg-amber-400 text-slate-950'
              : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span>
            {sharedState.explode >= 0.4
              ? isEn
                ? 'Assemble'
                : 'Lắp lại'
              : isEn
              ? 'Explode'
              : 'Tách lớp'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onPatchState({ zoom: +Math.max(0.55, sharedState.zoom - 0.15).toFixed(2) })}
          className="p-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 cursor-pointer"
          title={isEn ? 'Zoom Out' : 'Thu nhỏ'}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-mono font-bold text-cyan-300 tabular-nums px-1">
          {sharedState.zoom.toFixed(2)}x
        </span>
        <button
          type="button"
          onClick={() => onPatchState({ zoom: +Math.min(2.1, sharedState.zoom + 0.15).toFixed(2) })}
          className="p-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 cursor-pointer"
          title={isEn ? 'Zoom In' : 'Phóng to'}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onPatchState({ autoSpin: !sharedState.autoSpin })}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer ${
            sharedState.autoSpin
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-slate-900 border-slate-700 text-slate-300'
          }`}
        >
          {sharedState.autoSpin ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{isEn ? 'Spin' : 'Xoay'}</span>
        </button>

        <button
          type="button"
          onClick={() =>
            onPatchState({ rotY: 0, rotX: 0, zoom: 1, explode: 0, autoSpin: true, cameraPreset: 'perspective' })
          }
          className="p-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 cursor-pointer"
          title={isEn ? 'Reset 3D Model' : 'Đặt lại mô hình'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
