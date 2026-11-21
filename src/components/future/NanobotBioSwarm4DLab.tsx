import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Activity, Bot, Pause, Play, RotateCcw, Syringe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface NanobotBioSwarm4DLabProps {
  onEarnXP?: (xp: number) => void;
}

type SwarmAlgoId = 'boids_seek' | 'pid_laminar' | 'surround_ablate';

function isSoftwareWebGL(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _dir = new THREE.Vector3();

export const NanobotBioSwarm4DLab: React.FC<NanobotBioSwarm4DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [algo, setAlgo] = useState<SwarmAlgoId>('boids_seek');
  const [seekGain, setSeekGain] = useState<number>(1.8);
  const [avoidGain, setAvoidGain] = useState<number>(1.4);
  const [bloodFlow, setBloodFlow] = useState<number>(1.1);
  const [laserPower, setLaserPower] = useState<number>(1.2);
  const [paused, setPaused] = useState<boolean>(false);
  const [clotHealth, setClotHealth] = useState<number>(100);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [injectNonce, setInjectNonce] = useState<number>(0);

  const paramsRef = useRef({ algo, seekGain, avoidGain, bloodFlow, laserPower, paused, injectNonce });
  paramsRef.current = { algo, seekGain, avoidGain, bloodFlow, laserPower, paused, injectNonce };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const softwareGl = isSoftwareWebGL();
    const w = mount.clientWidth || 860;
    const h = mount.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b050a);
    scene.fog = new THREE.FogExp2(0x0b050a, 0.036);

    const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 120);
    camera.position.set(0.6, 2.2, 8.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: !softwareGl,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(softwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmrem.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !softwareGl;
    controls.dampingFactor = 0.07;
    controls.target.set(0, 0, 0);
    controls.minDistance = 4;
    controls.maxDistance = 18;

    scene.add(new THREE.HemisphereLight(0xfda4af, 0x1a060d, 1.0));
    const key = new THREE.DirectionalLight(0xfff1f2, 2.0);
    key.position.set(5, 9, 7);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x22d3ee, 1.3);
    rim.position.set(-6, -4, -6);
    scene.add(rim);

    // 1. Pulsing Artery Vessel Tunnel (Outer + Inner Ribbed Rings)
    const VESSEL_R = 2.45;
    const VESSEL_LEN = 14.5;
    const vesselGroup = new THREE.Group();
    const wallGeo = new THREE.CylinderGeometry(VESSEL_R, VESSEL_R, VESSEL_LEN, 36, 1, true);
    wallGeo.rotateZ(Math.PI / 2);
    const wallMat = new THREE.MeshPhysicalMaterial({
      color: 0x9f1239,
      roughness: 0.35,
      metalness: 0.05,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    vesselGroup.add(wallMesh);

    const ringGeo = new THREE.TorusGeometry(VESSEL_R * 1.01, 0.024, 10, 48);
    ringGeo.rotateY(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xfb7185, transparent: true, opacity: 0.28 });
    for (let x = -6; x <= 6; x += 2) {
      const rMesh = new THREE.Mesh(ringGeo, ringMat);
      rMesh.position.x = x;
      vesselGroup.add(rMesh);
    }
    scene.add(vesselGroup);

    // 2. Target Fibrin Clot Cluster (Composite 9-nodule cluster on upper-right wall)
    const clotCenter = new THREE.Vector3(2.2, 0.45, 0.15);
    const clotGroup = new THREE.Group();
    clotGroup.position.copy(clotCenter);
    const clotMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xb45309,
      emissiveIntensity: 0.55,
      roughness: 0.52
    });
    const noduleOffsets = [
      [0, 0, 0, 0.55],
      [0.36, 0.22, 0.18, 0.38],
      [-0.34, 0.18, -0.22, 0.36],
      [0.14, -0.3, 0.28, 0.34],
      [-0.2, -0.24, 0.3, 0.32],
      [0.28, 0.05, -0.34, 0.31],
      [-0.1, 0.35, 0.08, 0.33]
    ];
    noduleOffsets.forEach(([ox, oy, oz, rad]) => {
      const nod = new THREE.Mesh(new THREE.DodecahedronGeometry(rad, 1), clotMat);
      nod.position.set(ox, oy, oz);
      clotGroup.add(nod);
    });
    scene.add(clotGroup);

    // 3. Red Blood Cells (InstancedMesh biconcave discs flowing via Navier-Stokes Poiseuille profile)
    const RBC_COUNT = 84;
    const rbcGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 16);
    const rbcMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      emissive: 0x881337,
      emissiveIntensity: 0.3,
      roughness: 0.42
    });
    const rbcMesh = new THREE.InstancedMesh(rbcGeo, rbcMat, RBC_COUNT);
    rbcMesh.frustumCulled = false;
    scene.add(rbcMesh);

    const rbcs = Array.from({ length: RBC_COUNT }, (_, i) => {
      const ang = (i * 2.399) % (Math.PI * 2);
      const rad = Math.sqrt(((i * 17) % 100) / 100) * (VESSEL_R - 0.55);
      return {
        x: (((i * 29) % 140) / 140 - 0.5) * VESSEL_LEN,
        y: Math.sin(ang) * rad,
        z: Math.cos(ang) * rad,
        spinX: (i % 5) * 0.4 + 0.5,
        spinZ: (i % 7) * 0.3 + 0.4,
        phase: i * 0.7
      };
    });

    // 4. Autonomous Nanobot Swarm (InstancedMesh metallic-cyan drones)
    const BOT_COUNT = 36;
    const botGeo = new THREE.ConeGeometry(0.11, 0.34, 6);
    botGeo.rotateX(Math.PI / 2); // point forward along +Z
    const botMat = new THREE.MeshPhysicalMaterial({
      color: 0x22d3ee,
      emissive: 0x0891b2,
      emissiveIntensity: 0.9,
      metalness: 0.86,
      roughness: 0.16
    });
    const botMesh = new THREE.InstancedMesh(botGeo, botMat, BOT_COUNT);
    botMesh.frustumCulled = false;
    scene.add(botMesh);

    const bots = Array.from({ length: BOT_COUNT }, (_, i) => ({
      pos: new THREE.Vector3(-5.8 + (i % 4) * 0.4, (((i * 37) % 100) / 100 - 0.5) * 2.2, (((i * 53) % 100) / 100 - 0.5) * 2.2),
      vel: new THREE.Vector3(1.6, 0, 0)
    }));

    const resetMission = () => {
      bots.forEach((b, i) => {
        b.pos.set(-5.8 + (i % 5) * 0.35, (((i * 37) % 100) / 100 - 0.5) * 2.1, (((i * 53) % 100) / 100 - 0.5) * 2.1);
        b.vel.set(1.5, 0, 0);
      });
      clotHp = 100;
      setClotHealth(100);
    };

    let clotHp = 100;
    let lastInject = paramsRef.current.injectNonce;
    let lastUiPush = 0;

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
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(0.045, clock.getDelta());
      const t = clock.getElapsedTime();
      const cfg = paramsRef.current;

      if (cfg.injectNonce !== lastInject) {
        lastInject = cfg.injectNonce;
        resetMission();
      }

      // Arterial heartbeat pulse
      const pulse = 1 + 0.035 * Math.pow(Math.max(0, Math.sin(t * 3.8)), 4);
      vesselGroup.scale.set(1, pulse, pulse);

      if (!cfg.paused) {
        // Laminar Poiseuille RBC flow
        const flowOcclusion = 0.42 + 0.58 * (1 - clotHp / 100);
        for (let i = 0; i < RBC_COUNT; i++) {
          const rbc = rbcs[i];
          const radial = Math.hypot(rbc.y, rbc.z) / VESSEL_R;
          const poiseuille = Math.max(0.25, 1 - radial * radial);
          rbc.x += dt * cfg.bloodFlow * 2.8 * poiseuille * flowOcclusion;
          if (rbc.x > VESSEL_LEN * 0.5) rbc.x = -VESSEL_LEN * 0.5;

          _pos.set(rbc.x, rbc.y, rbc.z);
          _quat.setFromEuler(
            new THREE.Euler(t * rbc.spinX + rbc.phase, t * 0.5, t * rbc.spinZ)
          );
          _scale.set(1, 1, 1);
          _mat4.compose(_pos, _quat, _scale);
          rbcMesh.setMatrixAt(i, _mat4);
        }
        rbcMesh.instanceMatrix.needsUpdate = true;

        // Swarm AI Boids + Seek + Collision Avoidance
        let activeHits = 0;
        for (let i = 0; i < BOT_COUNT; i++) {
          const bot = bots[i];

          // Target seek depending on Swarm Algorithm
          if (cfg.algo === 'surround_ablate') {
            const ang = (i / BOT_COUNT) * Math.PI * 2 + t * 1.4;
            _pos.set(
              clotCenter.x + Math.cos(ang) * 0.95,
              clotCenter.y + Math.sin(ang) * 0.72,
              clotCenter.z + Math.sin(ang * 1.7) * 0.75
            );
          } else {
            _pos.copy(clotCenter);
          }

          _dir.copy(_pos).sub(bot.pos);
          const distToTarget = _dir.length() || 1;
          if (distToTarget < 1.35) activeHits++;
          _dir.normalize().multiplyScalar(cfg.seekGain * 3.2);
          bot.vel.addScaledVector(_dir, dt);

          // Separation among nanobots
          for (let j = 0; j < BOT_COUNT; j++) {
            if (i === j) continue;
            const dSq = bot.pos.distanceToSquared(bots[j].pos);
            if (dSq > 0.0001 && dSq < 0.42) {
              _dir.copy(bot.pos).sub(bots[j].pos).normalize().multiplyScalar(cfg.avoidGain * 2.2);
              bot.vel.addScaledVector(_dir, dt);
            }
          }

          // PID laminar flow compensation vs drift
          if (cfg.algo === 'pid_laminar') {
            bot.vel.x += (clotCenter.x - bot.pos.x) * 0.75 * dt;
          } else {
            bot.vel.x += cfg.bloodFlow * 0.25 * dt;
          }

          // Clamp inside vessel wall
          const rBot = Math.hypot(bot.pos.y, bot.pos.z);
          if (rBot > VESSEL_R - 0.35) {
            bot.vel.y -= (bot.pos.y / rBot) * 4.5 * dt;
            bot.vel.z -= (bot.pos.z / rBot) * 4.5 * dt;
          }

          bot.vel.clampLength(0.4, 3.8);
          bot.pos.addScaledVector(bot.vel, dt);

          _dir.copy(bot.vel).normalize();
          _quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), _dir);
          _scale.set(1, 1, 1);
          _mat4.compose(bot.pos, _quat, _scale);
          botMesh.setMatrixAt(i, _mat4);
        }
        botMesh.instanceMatrix.needsUpdate = true;

        // Dissolve Fibrin Clot smoothly
        if (clotHp > 0 && activeHits > 0) {
          clotHp = Math.max(0, clotHp - activeHits * cfg.laserPower * dt * 0.55);
          if (t - lastUiPush > 0.16) {
            lastUiPush = t;
            setClotHealth(Math.round(clotHp));
          }
        }
      }

      const clotScale = Math.max(0.05, clotHp / 100);
      clotGroup.scale.setScalar(clotScale);
      clotGroup.visible = clotHp > 1;

      controls.update();
      renderer.render(scene, camera);

      if (softwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth || 860;
      const nh = mount.clientHeight || 520;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    if (softwareGl) afterDraw(tick);
    else frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mm) => mm.dispose());
          else m.material?.dispose();
        }
      });
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const flowEfficiency = Math.round(42 + 58 * (1 - clotHealth / 100));

  return (
    <div className="relative w-full lg:h-[700px] rounded-2xl overflow-hidden border border-rose-500/40 bg-[#0b050a] text-white shadow-2xl flex flex-col lg:block">
      {/* Top-Left Bio-Swarm Telemetry (Stacked on < lg, floating on lg+) */}
      <div className="relative z-20 p-2.5 sm:p-3 lg:pointer-events-none lg:absolute lg:top-3 lg:left-3 bg-[#0b050a]/95 lg:bg-transparent border-b border-rose-500/20 lg:border-b-0 max-w-full lg:max-w-md shrink-0">
        <div className="pointer-events-auto rounded-lg bg-[#14070e]/92 border border-rose-500/40 px-3.5 py-2.5 space-y-1.5 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-extrabold text-rose-300">
            <Activity className="w-4 h-4 shrink-0" />
            <span>{isEn ? 'Nanobot Bio-Swarm 4D' : 'Đàn Robot Nano Trong Mạch Máu 4D'}</span>
          </div>
          <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-[11px] font-mono tabular-nums text-slate-200">
            <span>
              {isEn ? 'Clot:' : 'Cục máu đông:'}{' '}
              <strong className={clotHealth <= 5 ? 'text-emerald-300' : 'text-amber-300'}>{clotHealth}%</strong>
            </span>
            <span>·</span>
            <span>
              {isEn ? 'Blood Flow:' : 'Lưu lượng:'}{' '}
              <strong className="text-cyan-300">{flowEfficiency}%</strong>
            </span>
            <span>·</span>
            <span>36 Nanobots</span>
          </div>
          <div className="w-full h-1.5 rounded bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-[width] duration-200"
              style={{ width: `${100 - clotHealth}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="relative w-full h-[290px] sm:h-[380px] lg:absolute lg:inset-0 lg:h-full">
        <div ref={mountRef} className="w-full h-full touch-none" />
      </div>

      {/* Collapsible Bottom Control Dock (Stacked below canvas on < lg, floating on lg+) */}
      <div className="relative lg:absolute lg:bottom-3 lg:left-1/2 lg:-translate-x-1/2 z-20 w-full lg:w-[min(920px,95vw)] p-2.5 lg:p-0 bg-[#0b050a]/95 lg:bg-transparent border-t border-rose-500/20 lg:border-t-0 flex flex-col items-center shrink-0">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="min-h-[34px] px-3 py-1 rounded-md lg:rounded-b-none bg-[#160911]/95 border lg:border-b-0 border-rose-500/40 text-[10px] font-mono font-bold text-rose-200 cursor-pointer"
        >
          {dockCollapsed
            ? isEn ? '▴ Show Swarm AI Rules' : '▴ Mở Bảng Thuật Toán Đàn Nano'
            : isEn ? '▾ Hide Controls' : '▾ Thu Gọn Bảng Điều Khiển'}
        </button>

        {!dockCollapsed && (
          <div className="w-full mt-1.5 lg:mt-0 rounded-xl bg-[#160911]/95 border border-rose-500/40 p-3 space-y-2.5 shadow-2xl max-h-[38dvh] lg:max-h-none overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
              <label className="space-y-1">
                <div className="flex justify-between font-mono text-slate-300">
                  <span>{isEn ? 'Target Seek' : 'Lực Bám Mục Tiêu'}</span>
                  <span className="text-cyan-300 font-bold">{seekGain.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={0.4}
                  max={3.5}
                  step={0.1}
                  value={seekGain}
                  onChange={(e) => setSeekGain(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between font-mono text-slate-300">
                  <span>{isEn ? 'Separation' : 'Độ Tách Đàn'}</span>
                  <span className="text-emerald-300 font-bold">{avoidGain.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={3.0}
                  step={0.1}
                  value={avoidGain}
                  onChange={(e) => setAvoidGain(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between font-mono text-slate-300">
                  <span>{isEn ? 'Blood Flow' : 'Tốc Độ Dòng Máu'}</span>
                  <span className="text-rose-300 font-bold">{bloodFlow.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={2.4}
                  step={0.1}
                  value={bloodFlow}
                  onChange={(e) => setBloodFlow(parseFloat(e.target.value))}
                  className="w-full accent-rose-400"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between font-mono text-slate-300">
                  <span>{isEn ? 'Ablation Power' : 'Công Suất Phá Hủy'}</span>
                  <span className="text-amber-300 font-bold">{laserPower.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={0.4}
                  max={3.0}
                  step={0.1}
                  value={laserPower}
                  onChange={(e) => setLaserPower(parseFloat(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <Bot className="w-3.5 h-3.5 text-cyan-300" />
                {(
                  [
                    ['boids_seek', isEn ? 'Swarm Boids' : 'Thuật toán Boids'],
                    ['pid_laminar', isEn ? 'PID Counter-Flow' : 'PID Bù Dòng Chảy'],
                    ['surround_ablate', isEn ? 'Orbital Surround' : 'Vây Quét Toàn Diện']
                  ] as const
                ).map(([id, lbl]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setAlgo(id);
                      onEarnXP?.(5);
                    }}
                    className={`px-2.5 py-1 rounded border font-bold cursor-pointer whitespace-nowrap ${
                      algo === id
                        ? 'bg-cyan-500 border-cyan-300 text-slate-950'
                        : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-cyan-400'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaused((v) => !v)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 border border-slate-600 text-xs font-bold text-slate-100 hover:border-cyan-400 cursor-pointer"
                >
                  {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{paused ? (isEn ? 'Resume' : 'Chạy') : isEn ? 'Pause' : 'Dừng'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInjectNonce((n) => n + 1);
                    onEarnXP?.(6);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold cursor-pointer"
                >
                  <Syringe className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Re-Inject Swarm' : 'Tiêm Đàn Nano Mới'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
