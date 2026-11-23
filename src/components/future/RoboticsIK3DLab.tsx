import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  AlertTriangle,
  Bot,
  Crosshair,
  Eye,
  EyeOff,
  Gauge,
  Maximize2,
  Minimize2,
  Package,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';

interface RoboticsIK3DLabProps {
  onEarnXP?: (xp: number) => void;
}

type TrajectoryMode = 'circle' | 'figure8' | 'pick_place' | 'manual';

const TRAIL_LIMIT = 150;
const ARM_MAX_REACH = 3.72; // L1 (2.05) + L2 (1.75) - 0.08 safety margin
const SHOULDER_Y = 1.2;
const SOURCE_PAD_POS = new THREE.Vector3(2.15, 0.34, 1.35);
const DROP_PAD_POS = new THREE.Vector3(-2.15, 0.34, -1.25);

const SCRATCH_VEC_A = new THREE.Vector3();
const SCRATCH_VEC_B = new THREE.Vector3();
const SCRATCH_VEC_C = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const r = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|Software|Basic Render/i.test(r);
  } catch {
    return false;
  }
}

export const RoboticsIK3DLab: React.FC<RoboticsIK3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode } = useBackgroundTheme();

  const mountRef = useRef<HTMLDivElement | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [trajectoryMode, setTrajectoryMode] = useState<TrajectoryMode>('pick_place');
  const trajectoryModeRef = useRef<TrajectoryMode>('pick_place');
  trajectoryModeRef.current = trajectoryMode;

  const [speedMult, setSpeedMult] = useState(1.0);
  const speedMultRef = useRef(1.0);
  speedMultRef.current = speedMult;

  const [showDome, setShowDome] = useState(true);
  const showDomeRef = useRef(true);
  showDomeRef.current = showDome;

  const [gripperClosed, setGripperClosed] = useState(false);
  const gripperRef = useRef(false);
  gripperRef.current = gripperClosed;

  const [targetPos, setTargetPos] = useState({ x: 2.2, y: 2.1, z: 1.4 });
  const targetPosRef = useRef(targetPos);
  targetPosRef.current = targetPos;

  const [jointReadout, setJointReadout] = useState({
    j1Deg: 32,
    j2Deg: 40,
    j3Deg: -65,
    j4Deg: -25,
    errMm: 1.2,
    outOfReach: false,
    cargoPhase: 'approach' as 'approach' | 'carry' | 'drop' | 'return'
  });

  const [webglError, setWebglError] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const clearTrailRef = useRef<(() => void) | null>(null);
  const resetCamRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && perfMode !== 'smooth',
        powerPreference: 'high-performance'
      });
    } catch {
      setWebglError(true);
      return;
    }

    const hostDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : perfMode === 'smooth' ? Math.min(hostDpr, 1.15) : Math.min(hostDpr, 1.5)
    );
    renderer.setSize(container.clientWidth || 960, container.clientHeight || 620);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl && perfMode !== 'smooth';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const onLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onRestored = () => setContextLost(false);
    renderer.domElement.addEventListener('webglcontextlost', onLost);
    renderer.domElement.addEventListener('webglcontextrestored', onRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07101f);
    scene.fog = new THREE.FogExp2(0x07101f, 0.02);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(
      46,
      (container.clientWidth || 960) / (container.clientHeight || 620),
      0.15,
      150
    );
    camera.position.set(5.4, 4.6, 5.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 3;
    controls.maxDistance = 18;
    controls.target.set(0.2, 1.65, 0);
    controls.update();

    const hemi = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.85);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff5e4, 2.0);
    key.position.set(7, 12, 6);
    if (renderer.shadowMap.enabled) {
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
    }
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x34d399, 0.9);
    rim.position.set(-6, 6, -6);
    scene.add(rim);

    // Metrology Floor Plate grounded flush at y = 0
    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(8.5, 8.8, 0.2, 48),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.72, metalness: 0.3 })
    );
    floor.position.y = -0.1;
    floor.receiveShadow = renderer.shadowMap.enabled;
    scene.add(floor);
    const grid = new THREE.GridHelper(16, 16, 0x10b981, 0x1e293b);
    grid.position.y = 0.02;
    scene.add(grid);

    // Reachable Workspace Envelope Dome
    const domeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(4.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      domeMat
    );
    dome.position.y = 0.75;
    scene.add(dome);

    // ==================== PICK & PLACE INDUSTRIAL STATIONS & MAGNETIC CARGO CUBE ====================
    const padSteel = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.78 });
    const sourceTrimMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.85,
      roughness: 0.25
    });
    const dropTrimMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.85,
      roughness: 0.25
    });

    const createStation = (pos: THREE.Vector3, trimMat: THREE.MeshStandardMaterial) => {
      const stGroup = new THREE.Group();
      stGroup.position.set(pos.x, 0, pos.z);
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.56, 0.34, 20), padSteel);
      col.position.y = 0.17;
      col.castShadow = renderer.shadowMap.enabled;
      col.receiveShadow = renderer.shadowMap.enabled;
      stGroup.add(col);

      const trim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.032, 10, 28), trimMat);
      trim.rotation.x = Math.PI / 2;
      trim.position.y = 0.34;
      stGroup.add(trim);
      scene.add(stGroup);
    };
    createStation(SOURCE_PAD_POS, sourceTrimMat);
    createStation(DROP_PAD_POS, dropTrimMat);

    const cargoGroup = new THREE.Group();
    const cargoBodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      roughness: 0.25,
      metalness: 0.65,
      clearcoat: 0.8
    });
    const cargoBody = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), cargoBodyMat);
    cargoBody.castShadow = renderer.shadowMap.enabled;
    cargoGroup.add(cargoBody);

    const cargoBand = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.08, 0.36),
      new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.8
      })
    );
    cargoGroup.add(cargoBand);
    cargoGroup.position.set(SOURCE_PAD_POS.x, SOURCE_PAD_POS.y + 0.17, SOURCE_PAD_POS.z);
    scene.add(cargoGroup);

    // ==================== COMPOSITE 6-DOF ARTICULATED ROBOT ARM ====================
    const darkSteel = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.85 });
    const orangeCoat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      roughness: 0.28,
      metalness: 0.45,
      clearcoat: 0.7
    });
    const tealCoat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.3, metalness: 0.7 });
    const servoGold = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.25, metalness: 0.92 });

    const basePedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, 0.65, 32), darkSteel);
    basePedestal.position.y = 0.325;
    basePedestal.castShadow = renderer.shadowMap.enabled;
    scene.add(basePedestal);

    // Joint 1: Base Yaw Turret
    const j1Yaw = new THREE.Group();
    j1Yaw.position.y = 0.65;
    scene.add(j1Yaw);

    const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.72, 0.45, 28), orangeCoat);
    turret.position.y = 0.22;
    j1Yaw.add(turret);

    // Joint 2: Shoulder Pitch
    const j2Shoulder = new THREE.Group();
    j2Shoulder.position.y = 0.55;
    j1Yaw.add(j2Shoulder);

    const shoulderDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.72, 20), servoGold);
    shoulderDrum.rotation.x = Math.PI / 2;
    j2Shoulder.add(shoulderDrum);

    const L1 = 2.05;
    const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.38, L1, 0.38), orangeCoat);
    upperArm.position.y = L1 * 0.5;
    upperArm.castShadow = renderer.shadowMap.enabled;
    j2Shoulder.add(upperArm);

    // Joint 3: Elbow Pitch
    const j3Elbow = new THREE.Group();
    j3Elbow.position.y = L1;
    j2Shoulder.add(j3Elbow);

    const elbowDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.58, 20), servoGold);
    elbowDrum.rotation.x = Math.PI / 2;
    j3Elbow.add(elbowDrum);

    const L2 = 1.75;
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, L2, 20), tealCoat);
    forearm.position.y = L2 * 0.5;
    forearm.castShadow = renderer.shadowMap.enabled;
    j3Elbow.add(forearm);

    // Joint 4: Wrist & Magnetic Gripper Jaw
    const j4Wrist = new THREE.Group();
    j4Wrist.position.y = L2;
    j3Elbow.add(j4Wrist);

    const wristHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.35, 16), darkSteel);
    wristHousing.position.y = 0.16;
    j4Wrist.add(wristHousing);

    const jawL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.14), servoGold);
    jawL.position.set(-0.14, 0.45, 0);
    j4Wrist.add(jawL);
    const jawR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.14), servoGold);
    jawR.position.set(0.14, 0.45, 0);
    j4Wrist.add(jawR);

    const tcpPoint = new THREE.Object3D();
    tcpPoint.position.set(0, 0.58, 0);
    j4Wrist.add(tcpPoint);

    const tcpBeaconMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const tcpBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 14), tcpBeaconMat);
    tcpPoint.add(tcpBeacon);

    // Movable IK Target Reticle
    const targetMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 1.1
    });
    const targetBeacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), targetMat);
    scene.add(targetBeacon);

    // End-effector glowing trail
    const trailArr = new Float32Array(TRAIL_LIMIT * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailArr, 3));
    trailGeo.setDrawRange(0, 0);
    const trailLine = new THREE.Line(
      trailGeo,
      new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.82 })
    );
    scene.add(trailLine);
    let trailCount = 0;

    clearTrailRef.current = () => {
      trailCount = 0;
      trailGeo.setDrawRange(0, 0);
    };

    resetCamRef.current = () => {
      camera.position.set(5.4, 4.6, 5.8);
      controls.target.set(0.2, 1.65, 0);
      controls.update();
    };

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 620;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    let rafId = 0;
    let alive = true;
    const clock = new THREE.Clock();
    let hudTimer = 0;
    let trailAcc = 0;
    let simPhase = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        rafId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (!alive) return;
        const s = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (s === gl.UNSIGNALED) rafId = window.setTimeout(poll, 5);
        else {
          gl.deleteSync(sync);
          rafId = window.setTimeout(cb, 80);
        }
      };
      rafId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (!alive) return;
      const dt = Math.min(0.05, clock.getDelta());
      const speed = speedMultRef.current;
      simPhase += dt * speed;
      dome.visible = showDomeRef.current;

      const mode = trajectoryModeRef.current;
      let autoGrip = gripperRef.current;
      let phaseLabel: 'approach' | 'carry' | 'drop' | 'return' = 'approach';
      let cargoAttached = false;

      if (mode === 'circle') {
        SCRATCH_VEC_A.set(
          Math.cos(simPhase * 0.9) * 2.15,
          1.7 + Math.sin(simPhase * 1.8) * 0.85,
          Math.sin(simPhase * 0.9) * 2.15
        );
        cargoGroup.position.set(SOURCE_PAD_POS.x, SOURCE_PAD_POS.y + 0.17, SOURCE_PAD_POS.z);
      } else if (mode === 'figure8') {
        const s = simPhase * 0.95;
        SCRATCH_VEC_A.set(
          Math.sin(s) * 2.45,
          1.85 + Math.cos(s * 2) * 0.72,
          Math.sin(s * 2) * 1.35
        );
        cargoGroup.position.set(SOURCE_PAD_POS.x, SOURCE_PAD_POS.y + 0.17, SOURCE_PAD_POS.z);
      } else if (mode === 'pick_place') {
        // 4-phase industrial Pick & Place cycle (period = 8 units)
        const cycle = (simPhase * 0.75) % 4;
        if (cycle < 1.0) {
          // Descend onto Source Pad
          phaseLabel = 'approach';
          const f = THREE.MathUtils.smoothstep(cycle, 0, 1);
          SCRATCH_VEC_A.set(
            SOURCE_PAD_POS.x,
            THREE.MathUtils.lerp(2.35, SOURCE_PAD_POS.y + 0.56, f),
            SOURCE_PAD_POS.z
          );
          autoGrip = f > 0.85;
          cargoGroup.position.set(SOURCE_PAD_POS.x, SOURCE_PAD_POS.y + 0.17, SOURCE_PAD_POS.z);
        } else if (cycle < 2.2) {
          // Lift & Transfer Cargo along elevated arc to Drop Pad
          phaseLabel = 'carry';
          const f = (cycle - 1.0) / 1.2;
          const liftY = Math.sin(f * Math.PI) * 1.65;
          SCRATCH_VEC_A.set(
            THREE.MathUtils.lerp(SOURCE_PAD_POS.x, DROP_PAD_POS.x, f),
            SOURCE_PAD_POS.y + 0.56 + liftY,
            THREE.MathUtils.lerp(SOURCE_PAD_POS.z, DROP_PAD_POS.z, f)
          );
          autoGrip = true;
          cargoAttached = true;
        } else if (cycle < 3.0) {
          // Lower onto Drop Pad & release jaw
          phaseLabel = 'drop';
          const f = (cycle - 2.2) / 0.8;
          SCRATCH_VEC_A.set(
            DROP_PAD_POS.x,
            THREE.MathUtils.lerp(DROP_PAD_POS.y + 0.95, DROP_PAD_POS.y + 0.56, f),
            DROP_PAD_POS.z
          );
          autoGrip = f < 0.35;
          if (autoGrip) cargoAttached = true;
          else cargoGroup.position.set(DROP_PAD_POS.x, DROP_PAD_POS.y + 0.17, DROP_PAD_POS.z);
        } else {
          // Return empty wrist to Source hover & reset cargo on Source for next cycle
          phaseLabel = 'return';
          const f = (cycle - 3.0) / 1.0;
          SCRATCH_VEC_A.set(
            THREE.MathUtils.lerp(DROP_PAD_POS.x, SOURCE_PAD_POS.x, f),
            THREE.MathUtils.lerp(DROP_PAD_POS.y + 1.15, 2.35, f),
            THREE.MathUtils.lerp(DROP_PAD_POS.z, SOURCE_PAD_POS.z, f)
          );
          autoGrip = false;
          cargoGroup.position.set(
            THREE.MathUtils.lerp(DROP_PAD_POS.x, SOURCE_PAD_POS.x, f),
            SOURCE_PAD_POS.y + 0.17 + Math.sin(f * Math.PI) * 0.25,
            THREE.MathUtils.lerp(DROP_PAD_POS.z, SOURCE_PAD_POS.z, f)
          );
        }
      } else {
        const tp = targetPosRef.current;
        SCRATCH_VEC_A.set(tp.x, tp.y, tp.z);
        cargoGroup.position.set(SOURCE_PAD_POS.x, SOURCE_PAD_POS.y + 0.17, SOURCE_PAD_POS.z);
      }

      targetBeacon.position.copy(SCRATCH_VEC_A);
      targetBeacon.rotation.y += dt * 2.2;

      // Analytical + Damped 3D Inverse Kinematics
      const dx = SCRATCH_VEC_A.x;
      const dz = SCRATCH_VEC_A.z;
      const dy = SCRATCH_VEC_A.y - SHOULDER_Y;
      const rawDistFromShoulder = Math.hypot(dx, dy, dz);
      const outOfReach = rawDistFromShoulder > ARM_MAX_REACH || rawDistFromShoulder < 0.65;

      const goalYaw = Math.atan2(-dz, dx);
      const horizDist = Math.hypot(dx, dz);
      const wristReachDist = Math.max(0.65, Math.min(ARM_MAX_REACH, Math.hypot(horizDist, dy)));
      const alpha = Math.atan2(dy, horizDist);

      const cosShoulder = THREE.MathUtils.clamp(
        (L1 * L1 + wristReachDist * wristReachDist - L2 * L2) / (2 * L1 * wristReachDist),
        -0.98,
        0.98
      );
      const shoulderInner = Math.acos(cosShoulder);
      const goalJ2 = -(Math.PI / 2 - (alpha + shoulderInner));

      const cosElbow = THREE.MathUtils.clamp(
        (L1 * L1 + L2 * L2 - wristReachDist * wristReachDist) / (2 * L1 * L2),
        -0.98,
        0.98
      );
      const goalJ3 = -(Math.PI - Math.acos(cosElbow));
      const goalJ4 = -(goalJ2 + goalJ3) - Math.PI * 0.5;

      const dampRate = 7.5 + speed * 2.5;
      j1Yaw.rotation.y = THREE.MathUtils.damp(j1Yaw.rotation.y, goalYaw, dampRate, dt);
      j2Shoulder.rotation.z = THREE.MathUtils.damp(j2Shoulder.rotation.z, goalJ2, dampRate, dt);
      j3Elbow.rotation.z = THREE.MathUtils.damp(j3Elbow.rotation.z, goalJ3, dampRate, dt);
      j4Wrist.rotation.z = THREE.MathUtils.damp(j4Wrist.rotation.z, goalJ4, dampRate, dt);

      // Gripper fingers + Singularity beacon tint
      const jawX = autoGrip ? 0.06 : 0.16;
      jawL.position.x = THREE.MathUtils.damp(jawL.position.x, -jawX, 12, dt);
      jawR.position.x = THREE.MathUtils.damp(jawR.position.x, jawX, 12, dt);
      tcpBeaconMat.color.setHex(outOfReach ? 0xf43f5e : 0x34d399);
      domeMat.color.setHex(outOfReach ? 0xf43f5e : 0x38bdf8);

      j1Yaw.updateMatrixWorld(true);
      tcpPoint.getWorldPosition(SCRATCH_VEC_B);

      if (cargoAttached) {
        cargoGroup.position.set(SCRATCH_VEC_B.x, SCRATCH_VEC_B.y - 0.14, SCRATCH_VEC_B.z);
        cargoGroup.rotation.y = j1Yaw.rotation.y;
      } else {
        cargoGroup.rotation.y = 0;
      }

      // Record TCP laser trail
      trailAcc += dt;
      if (trailAcc >= 0.03) {
        trailAcc = 0;
        if (trailCount >= TRAIL_LIMIT) {
          trailArr.copyWithin(0, 3);
          trailCount = TRAIL_LIMIT - 1;
        }
        trailArr[trailCount * 3] = SCRATCH_VEC_B.x;
        trailArr[trailCount * 3 + 1] = SCRATCH_VEC_B.y;
        trailArr[trailCount * 3 + 2] = SCRATCH_VEC_B.z;
        trailCount++;
        trailGeo.attributes.position.needsUpdate = true;
        trailGeo.setDrawRange(0, trailCount);
      }

      controls.update();
      renderer.render(scene, camera);

      hudTimer += dt;
      if (hudTimer >= 0.08) {
        hudTimer = 0;
        const errMm = SCRATCH_VEC_C.copy(SCRATCH_VEC_B).distanceTo(SCRATCH_VEC_A) * 100;
        setJointReadout({
          j1Deg: Math.round(THREE.MathUtils.radToDeg(j1Yaw.rotation.y)),
          j2Deg: Math.round(THREE.MathUtils.radToDeg(j2Shoulder.rotation.z)),
          j3Deg: Math.round(THREE.MathUtils.radToDeg(j3Elbow.rotation.z)),
          j4Deg: Math.round(THREE.MathUtils.radToDeg(j4Wrist.rotation.z)),
          errMm: Number(errMm.toFixed(1)),
          outOfReach,
          cargoPhase: phaseLabel
        });
      }

      if (isSoftwareGl) afterDraw(tick);
      else rafId = requestAnimationFrame(tick);
    };

    if (isSoftwareGl) afterDraw(tick);
    else rafId = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      clearTimeout(rafId);
      ro.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh || (obj as THREE.Line).isLine) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material?.dispose();
        }
      });
      envRT.dispose();
      renderer.dispose();
    };
  }, [perfMode]);

  if (webglError) {
    return (
      <div className="p-8 rounded-xl border border-rose-500/40 bg-slate-950 text-center text-rose-300 text-sm">
        WebGL 3D Unavailable
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden border border-emerald-500/35 bg-[#07101f] text-white shadow-2xl select-none flex flex-col lg:block ${
        isFullscreen
          ? 'fixed inset-0 z-[140] h-[100dvh] rounded-none border-0 overflow-y-auto lg:overflow-hidden'
          : 'rounded-xl lg:h-[700px]'
      }`}
    >
      {/* Top-Left Joint Telemetry (Stacked on mobile/iPad, floating on lg+) */}
      <div className="relative z-20 p-2.5 sm:p-3 lg:pointer-events-none lg:absolute lg:top-3 lg:left-3 lg:right-3 flex flex-wrap items-start justify-between gap-2 bg-[#07101f]/95 lg:bg-transparent border-b border-emerald-500/20 lg:border-b-0 shrink-0">
        <div className="pointer-events-auto space-y-1.5 max-w-full">
          <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/92 border border-emerald-400/40 text-xs font-mono">
            <Bot className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-extrabold text-white">6-DOF INVERSE KINEMATICS</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-300 tabular-nums">ERR {jointReadout.errMm} mm</span>
            {jointReadout.outOfReach && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/25 border border-rose-400 text-rose-200 text-[10px] font-bold">
                <AlertTriangle className="w-3 h-3" />
                {isEn ? 'OUT OF REACH' : 'VƯỢT TẦM VỚI'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 text-[11px] font-mono tabular-nums">
            <span className="px-2 py-1 rounded bg-slate-950/90 border border-slate-700 text-amber-300">
              J1(Yaw) {jointReadout.j1Deg}°
            </span>
            <span className="px-2 py-1 rounded bg-slate-950/90 border border-slate-700 text-sky-300">
              J2(Shldr) {jointReadout.j2Deg}°
            </span>
            <span className="px-2 py-1 rounded bg-slate-950/90 border border-slate-700 text-cyan-300">
              J3(Elbow) {jointReadout.j3Deg}°
            </span>
            <span className="px-2 py-1 rounded bg-slate-950/90 border border-slate-700 text-emerald-300">
              J4(Wrist) {jointReadout.j4Deg}°
            </span>
          </div>
        </div>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={() => setIsFullscreen((f) => !f)}
          className="pointer-events-auto min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-950/92 border border-emerald-400/40 hover:border-emerald-300 text-xs font-bold text-slate-100 flex items-center gap-1.5 cursor-pointer shrink-0"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isFullscreen ? (isEn ? 'Exit' : 'Thu nhỏ') : isEn ? 'Fullscreen' : 'Toàn màn hình'}</span>
        </button>
      </div>

      {/* 3D WebGL Stage */}
      <div
        className={`relative w-full ${
          isFullscreen ? 'flex-1 min-h-[280px] lg:h-full' : 'h-[290px] sm:h-[390px] lg:absolute lg:inset-0 lg:h-full'
        }`}
      >
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />
        {contextLost && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/90 text-emerald-300 text-sm font-mono">
            Restoring 6-DOF Kinematics Arm...
          </div>
        )}
      </div>

      {/* Collapsible Bottom Dock */}
      <div className="relative lg:absolute lg:bottom-3 lg:left-1/2 lg:-translate-x-1/2 z-20 w-full lg:w-[95%] lg:max-w-[960px] p-2.5 lg:p-0 bg-[#07101f]/95 lg:bg-transparent border-t border-emerald-500/20 lg:border-t-0 flex flex-col items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => setControlsVisible((v) => !v)}
          className="min-h-[36px] px-3.5 py-1.5 rounded-md bg-slate-950/92 border border-emerald-400/40 text-[11px] font-mono font-bold text-emerald-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          {controlsVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>
            {controlsVisible
              ? isEn ? 'Hide Robotics Controls' : 'Thu gọn Bảng Robot'
              : isEn ? 'Show Robotics Controls' : 'Mở Bảng Robot'}
          </span>
        </button>

        {controlsVisible && (
          <div className="w-full rounded-xl bg-slate-950/94 border border-slate-700/85 p-3 sm:p-4 space-y-3 text-xs text-slate-100 shadow-2xl max-h-[38dvh] lg:max-h-none overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'pick_place', icon: Package, vi: 'Gắp Thả Hàng', en: 'Pick & Place' },
                    { id: 'circle', icon: Bot, vi: 'Quỹ đạo Tròn', en: 'Circle Orbit' },
                    { id: 'figure8', icon: Bot, vi: 'Quỹ đạo Số 8', en: 'Figure-8' },
                    { id: 'manual', icon: Crosshair, vi: 'Tọa độ Tay', en: 'Manual XYZ' }
                  ] as const
                ).map((m) => {
                  const Icon = m.icon;
                  const active = trajectoryMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setTrajectoryMode(m.id);
                        onEarnXP?.(8);
                      }}
                      className={`min-h-[38px] px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 cursor-pointer ${
                        active
                          ? 'bg-emerald-500 border-emerald-300 text-slate-950'
                          : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-emerald-400/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{isEn ? m.en : m.vi}</span>
                    </button>
                  );
                })}

                {trajectoryMode === 'manual' && (
                  <button
                    type="button"
                    onClick={() => setGripperClosed((g) => !g)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-lg border font-bold cursor-pointer ${
                      gripperClosed
                        ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    {gripperClosed ? (isEn ? 'Gripper: Closed' : 'Kẹp: Đóng') : isEn ? 'Gripper: Open' : 'Kẹp: Mở'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowDome((d) => !d)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg border font-bold cursor-pointer ${
                    showDome
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  {isEn ? 'Workspace Dome' : 'Vòm Tầm Với'}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => clearTrailRef.current?.()}
                  className="min-h-[38px] px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Clear Trail' : 'Xóa Vệt'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => resetCamRef.current?.()}
                  className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-200 cursor-pointer"
                  title="Reset View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
              <label className="space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-amber-400" /> {isEn ? 'Servo Speed' : 'Tốc độ Servo'}
                  </span>
                  <span className="text-amber-300 font-bold tabular-nums">{speedMult.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={2.5}
                  step={0.1}
                  value={speedMult}
                  onChange={(e) => setSpeedMult(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Crosshair className="w-3 h-3 text-rose-400" /> Target X
                  </span>
                  <span className="text-rose-300 font-bold tabular-nums">{targetPos.x.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min={-3.2}
                  max={3.2}
                  step={0.1}
                  value={targetPos.x}
                  onChange={(e) => {
                    setTrajectoryMode('manual');
                    setTargetPos((p) => ({ ...p, x: Number(e.target.value) }));
                  }}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-300">Target Y (Alt)</span>
                  <span className="text-emerald-300 font-bold tabular-nums">{targetPos.y.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={4.2}
                  step={0.1}
                  value={targetPos.y}
                  onChange={(e) => {
                    setTrajectoryMode('manual');
                    setTargetPos((p) => ({ ...p, y: Number(e.target.value) }));
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-300">Target Z (Depth)</span>
                  <span className="text-sky-300 font-bold tabular-nums">{targetPos.z.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min={-3.2}
                  max={3.2}
                  step={0.1}
                  value={targetPos.z}
                  onChange={(e) => {
                    setTrajectoryMode('manual');
                    setTargetPos((p) => ({ ...p, z: Number(e.target.value) }));
                  }}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
