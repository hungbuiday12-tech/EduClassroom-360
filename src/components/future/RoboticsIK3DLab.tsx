import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Bot,
  Crosshair,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';

interface RoboticsIK3DLabProps {
  onEarnXP?: (xp: number) => void;
}

const TRAIL_LIMIT = 140;
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
  const [autoPatrol, setAutoPatrol] = useState(true);
  const autoPatrolRef = useRef(true);
  autoPatrolRef.current = autoPatrol;

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
    errMm: 1.2
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
      isSoftwareGl ? 1 : perfMode === 'smooth' ? Math.min(hostDpr, 1.15) : Math.min(hostDpr, 1.85)
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
    controls.target.set(0.4, 1.8, 0);
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
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(4.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.14 })
    );
    dome.position.y = 0.75;
    scene.add(dome);

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

    const tcpBeacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 14, 14),
      new THREE.MeshBasicMaterial({ color: 0x34d399 })
    );
    tcpPoint.add(tcpBeacon);

    // Movable IK Target Reticle & Payload Cube
    const targetBeacon = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.2, 0),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 1.1 })
    );
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
      controls.target.set(0.4, 1.8, 0);
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
      const elapsed = clock.elapsedTime;
      dome.visible = showDomeRef.current;

      // Determine IK Target
      if (autoPatrolRef.current) {
        SCRATCH_VEC_A.set(
          Math.cos(elapsed * 0.9) * 2.15,
          1.7 + Math.sin(elapsed * 1.8) * 0.85,
          Math.sin(elapsed * 0.9) * 2.15
        );
      } else {
        const tp = targetPosRef.current;
        SCRATCH_VEC_A.set(tp.x, tp.y, tp.z);
      }
      targetBeacon.position.copy(SCRATCH_VEC_A);
      targetBeacon.rotation.y += dt * 2.2;

      // Analytical + Damped 3D Inverse Kinematics
      const shoulderY = 1.2;
      const dx = SCRATCH_VEC_A.x;
      const dz = SCRATCH_VEC_A.z;
      const dy = SCRATCH_VEC_A.y - shoulderY;
      const goalYaw = Math.atan2(-dz, dx);

      const horizDist = Math.hypot(dx, dz);
      const wristReachDist = Math.max(0.65, Math.min(L1 + L2 - 0.08, Math.hypot(horizDist, dy)));
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

      j1Yaw.rotation.y = THREE.MathUtils.damp(j1Yaw.rotation.y, goalYaw, 8, dt);
      j2Shoulder.rotation.z = THREE.MathUtils.damp(j2Shoulder.rotation.z, goalJ2, 8, dt);
      j3Elbow.rotation.z = THREE.MathUtils.damp(j3Elbow.rotation.z, goalJ3, 8, dt);
      j4Wrist.rotation.z = THREE.MathUtils.damp(j4Wrist.rotation.z, goalJ4, 8, dt);

      // Gripper fingers
      const jawX = gripperRef.current ? 0.06 : 0.16;
      jawL.position.x = THREE.MathUtils.damp(jawL.position.x, -jawX, 12, dt);
      jawR.position.x = THREE.MathUtils.damp(jawR.position.x, jawX, 12, dt);

      j1Yaw.updateMatrixWorld(true);
      tcpPoint.getWorldPosition(SCRATCH_VEC_B);

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
          errMm: Number(errMm.toFixed(1))
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
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material.dispose();
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
    <div className="relative w-full h-[640px] sm:h-[700px] rounded-xl overflow-hidden border border-emerald-500/35 bg-[#07101f] shadow-2xl select-none">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {contextLost && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/90 text-emerald-300 text-sm font-mono">
          Restoring 6-DOF Kinematics Arm...
        </div>
      )}

      {/* Top-Left Joint Telemetry */}
      <div className="pointer-events-none absolute top-3 left-3 z-20 max-w-md space-y-1.5">
        <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/88 border border-emerald-400/40 text-xs font-mono">
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-extrabold text-white">6-DOF INVERSE KINEMATICS</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-300">ERR {jointReadout.errMm} mm</span>
        </div>

        <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
          <span className="px-2 py-1 rounded bg-slate-950/85 border border-slate-700 text-amber-300">
            J1(Yaw) {jointReadout.j1Deg}°
          </span>
          <span className="px-2 py-1 rounded bg-slate-950/85 border border-slate-700 text-sky-300">
            J2(Shoulder) {jointReadout.j2Deg}°
          </span>
          <span className="px-2 py-1 rounded bg-slate-950/85 border border-slate-700 text-cyan-300">
            J3(Elbow) {jointReadout.j3Deg}°
          </span>
        </div>
      </div>

      {/* Collapsible Bottom Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-[920px] flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={() => setControlsVisible((v) => !v)}
          className="px-3 py-1 rounded-md bg-slate-950/90 border border-emerald-400/40 text-[11px] font-mono font-bold text-emerald-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          {controlsVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>
            {controlsVisible
              ? isEn ? 'Hide Robotics Controls' : 'Thu gọn Bảng Robot'
              : isEn ? 'Show Robotics Controls' : 'Mở Bảng Robot'}
          </span>
        </button>

        {controlsVisible && (
          <div className="w-full rounded-xl bg-slate-950/92 border border-slate-700/85 p-3 sm:p-4 space-y-3 text-xs text-slate-100 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAutoPatrol((a) => !a);
                    onEarnXP?.(10);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer ${
                    autoPatrol
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 border border-slate-600 text-slate-200'
                  }`}
                >
                  {autoPatrol ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{autoPatrol ? (isEn ? 'Auto Patrol' : 'Tuần Tra Tự Động') : isEn ? 'Manual Target' : 'Điều Khiển Tọa Độ'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGripperClosed((g) => !g)}
                  className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer ${
                    gripperClosed
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  {gripperClosed ? (isEn ? 'Gripper: Closed' : 'Kẹp: Đóng') : isEn ? 'Gripper: Open' : 'Kẹp: Mở'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowDome((d) => !d)}
                  className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer ${
                    showDome
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  {isEn ? 'Workspace Envelope' : 'Vòm Tầm Với'}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => clearTrailRef.current?.()}
                  className="px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Clear Trail' : 'Xóa Vệt'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => resetCamRef.current?.()}
                  className="p-1.5 rounded border border-slate-700 bg-slate-900 text-slate-200 cursor-pointer"
                  title="Reset View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
              <label className="space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Crosshair className="w-3 h-3 text-rose-400" /> Target X
                  </span>
                  <span className="text-rose-300 font-bold">{targetPos.x.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min={-2.8}
                  max={2.8}
                  step={0.1}
                  value={targetPos.x}
                  onChange={(e) => {
                    setAutoPatrol(false);
                    setTargetPos((p) => ({ ...p, x: Number(e.target.value) }));
                  }}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-300">Target Y (Alt)</span>
                  <span className="text-emerald-300 font-bold">{targetPos.y.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min={0.6}
                  max={3.5}
                  step={0.1}
                  value={targetPos.y}
                  onChange={(e) => {
                    setAutoPatrol(false);
                    setTargetPos((p) => ({ ...p, y: Number(e.target.value) }));
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-300">Target Z (Depth)</span>
                  <span className="text-sky-300 font-bold">{targetPos.z.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min={-2.8}
                  max={2.8}
                  step={0.1}
                  value={targetPos.z}
                  onChange={(e) => {
                    setAutoPatrol(false);
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
