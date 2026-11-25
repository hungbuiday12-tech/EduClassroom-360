import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { AlertTriangle, Atom, Camera, Orbit, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import { MiniTelemetryChart, captureCanvasPng, exportRowsToCsv } from '../common/SimProToolkit';

interface WhatIfPhysics3DLabProps {
  onEarnXP?: (xp: number) => void;
}

type PresetId = 'standard' | 'super_gravity' | 'inverse_cube' | 'slow_light_quantum';

interface SimParams {
  gravityMult: number;     // 0.2 .. 3.0
  distancePower: number;   // 1.5 .. 3.2 (real universe = 2.0)
  lightSpeedMult: number;  // 0.15 .. 2.0 (real = 1.0)
  planckMult: number;      // 0.0 .. 3.0 (macro quantum jitter)
  timeScale: number;       // 0.2 .. 2.5
}

const PRESETS: Record<PresetId, { labelVi: string; labelEn: string; params: SimParams }> = {
  standard: {
    labelVi: 'Vũ trụ Chuẩn (F ∝ 1/r²)',
    labelEn: 'Real Universe (F ∝ 1/r²)',
    params: { gravityMult: 1.0, distancePower: 2.0, lightSpeedMult: 1.0, planckMult: 0.0, timeScale: 1.0 },
  },
  super_gravity: {
    labelVi: 'Hấp dẫn Siêu cường (G × 2.5)',
    labelEn: 'Super Gravity (G × 2.5)',
    params: { gravityMult: 2.5, distancePower: 2.0, lightSpeedMult: 1.0, planckMult: 0.1, timeScale: 1.1 },
  },
  inverse_cube: {
    labelVi: 'Định luật 1/r³ (Quỹ đạo vỡ)',
    labelEn: 'Inverse-Cube 1/r³ (Unstable)',
    params: { gravityMult: 1.15, distancePower: 3.0, lightSpeedMult: 1.0, planckMult: 0.0, timeScale: 1.0 },
  },
  slow_light_quantum: {
    labelVi: 'Ánh sáng chậm & Lượng tử vĩ mô',
    labelEn: 'Slow Light & Macro Quantum',
    params: { gravityMult: 1.0, distancePower: 2.0, lightSpeedMult: 0.25, planckMult: 2.4, timeScale: 1.0 },
  },
};

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

export const WhatIfPhysics3DLab: React.FC<WhatIfPhysics3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const { perfMode } = useBackgroundTheme();
  const isEn = language === 'en';
  const isUltra = perfMode === 'ultra';
  const isBalanced = perfMode === 'balanced';

  const [preset, setPreset] = useState<PresetId>('standard');
  const [params, setParams] = useState<SimParams>(PRESETS.standard.params);
  const [running, setRunning] = useState(true);
  const [autoOrbit, setAutoOrbit] = useState(false);
  const [resetTick, setResetTick] = useState(0);
  const [telemetry, setTelemetry] = useState({
    speed: 1.85,
    radius: 3.2,
    status: 'stable' as 'stable' | 'collapse' | 'escape' | 'quantum',
  });
  const [orbitLog, setOrbitLog] = useState<{ t: number; speed: number; radius: number }[]>([]);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const paramsRef = useRef<SimParams>(params);
  const runningRef = useRef<boolean>(running);
  const autoOrbitRef = useRef<boolean>(autoOrbit);
  const camPresetFnRef = useRef<((mode: 'iso' | 'top' | 'side') => void) | null>(null);
  const snapFnRef = useRef<(() => void) | null>(null);
  paramsRef.current = params;
  runningRef.current = running;
  autoOrbitRef.current = autoOrbit;

  const xpAwardedRef = useRef(false);

  const applyPreset = (id: PresetId) => {
    setPreset(id);
    setParams(PRESETS[id].params);
    setResetTick((t) => t + 1);
    if (!xpAwardedRef.current && id !== 'standard') {
      xpAwardedRef.current = true;
      onEarnXP?.(25);
    }
  };

  // Scientific consequence explanation
  const consequence = useMemo(() => {
    if (Math.abs(params.distancePower - 2.0) >= 0.45) {
      return isEn
        ? 'Bertrand’s Theorem broken! Closed stable orbits only exist for 1/r² (and Hooke’s r). With 1/r³, planets inevitably spiral into the star or escape into deep space.'
        : 'Định lý Bertrand bị phá vỡ! Quỹ đạo khép kín bền vững chỉ tồn tại khi lực tỉ lệ nghịch 1/r². Với 1/r³, hành tinh chắc chắn sẽ lao vào Mặt Trời hoặc văng mất vào không gian.';
    }
    if (params.gravityMult >= 2.0) {
      return isEn
        ? 'Extreme Gravity (G ≥ 2×): Stars burn fuel 10× faster, orbits shrink violently, and rocky planets suffer catastrophic tidal heating.'
        : 'Hấp dẫn siêu cường (G ≥ 2×): Ngôi sao đốt nhiên liệu nhanh gấp 10 lần, quỹ đạo bị kéo sập mạnh và các hành tinh đá bị nung chảy bởi lực thủy triều.';
    }
    if (params.planckMult >= 1.2 || params.lightSpeedMult <= 0.45) {
      return isEn
        ? 'Macroscopic Quantum & Slow Light: Relativistic Doppler rings warp spacetime around fast bodies, while large Planck constant h causes macroscopic position uncertainty (Heisenberg jitter).'
        : 'Lượng tử vĩ mô & Ánh sáng chậm: Nón ánh sáng tương đối tính bẻ cong mạnh quanh hành tinh, đồng thời hằng số Planck h lớn khiến ngay cả hành tinh cũng bị nhòe vị trí theo nguyên lý bất định Heisenberg.';
    }
    return isEn
      ? 'Real Universe Constants: Inverse-square gravity (1/r²) produces stable Keplerian ellipses, allowing planets to maintain habitable zones for billions of years.'
      : 'Hằng số Vũ trụ chuẩn: Lực hấp dẫn tỉ lệ 1/r² tạo ra quỹ đạo elip Kepler ổn định hàng tỷ năm, là điều kiện tiên quyết để hình thành sự sống.';
  }, [isEn, params]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const isSw = detectSoftwareGl();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040712);
    scene.fog = new THREE.FogExp2(0x040712, 0.025);

    const w = mount.clientWidth || 720;
    const h = mount.clientHeight || 460;
    const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 120);
    camera.position.set(0, 6.5, 9.8);

    const renderer = new THREE.WebGLRenderer({ antialias: !isSw, powerPreference: 'high-performance' });
    renderer.setSize(w, h);
    renderer.setPixelRatio(isSw ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xbae6fd, 0x0f172a, 0.8));
    const starLight = new THREE.PointLight(0xfbbf24, 6, 40);
    scene.add(starLight);

    // Spacetime warped grid
    const grid = new THREE.GridHelper(18, 24, 0x38bdf8, 0x1e293b);
    grid.position.y = -1.2;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    scene.add(grid);

    // Central Star
    const sunGeo = new THREE.SphereGeometry(0.95, 28, 28);
    const sunMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.35,
      roughness: 0.25,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // Pro & Balanced: Dynamic Solar Corona Rings + 3D Rotating Starfield
    let coronaRing1: THREE.Mesh | null = null;
    let coronaRing2: THREE.Mesh | null = null;
    let starPoints: THREE.Points | null = null;
    const extraGeos: THREE.BufferGeometry[] = [];
    const extraMats: THREE.Material[] = [];

    if (perfMode !== 'smooth') {
      const cGeo1 = new THREE.TorusGeometry(1.32, 0.028, 12, 64);
      const cMat1 = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: isUltra ? 0.65 : 0.4,
      });
      coronaRing1 = new THREE.Mesh(cGeo1, cMat1);
      coronaRing1.rotation.x = Math.PI / 2.4;
      scene.add(coronaRing1);
      extraGeos.push(cGeo1);
      extraMats.push(cMat1);

      if (isUltra) {
        const cGeo2 = new THREE.TorusGeometry(1.58, 0.02, 12, 64);
        const cMat2 = new THREE.MeshBasicMaterial({
          color: 0xf472b6,
          transparent: true,
          opacity: 0.48,
        });
        coronaRing2 = new THREE.Mesh(cGeo2, cMat2);
        coronaRing2.rotation.x = -Math.PI / 3;
        coronaRing2.rotation.y = Math.PI / 5;
        scene.add(coronaRing2);
        extraGeos.push(cGeo2);
        extraMats.push(cMat2);
      }

      const starCount = isUltra ? 650 : 220;
      const starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const rad = 14 + Math.random() * 28;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPositions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
        starPositions[i * 3 + 1] = rad * Math.cos(phi);
        starPositions[i * 3 + 2] = rad * Math.sin(phi) * Math.sin(theta);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({
        color: isUltra ? 0xbae6fd : 0x94a3b8,
        size: isUltra ? 0.14 : 0.1,
        transparent: true,
        opacity: isUltra ? 0.85 : 0.55,
      });
      starPoints = new THREE.Points(starGeo, starMat);
      scene.add(starPoints);
      extraGeos.push(starGeo);
      extraMats.push(starMat);
    }

    // Relativistic Light-Cone Ring (reacts to lightSpeedMult)
    const coneGeo = new THREE.TorusGeometry(2.2, 0.035, 12, 64);
    const coneMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    const lightRing = new THREE.Mesh(coneGeo, coneMat);
    lightRing.rotation.x = Math.PI / 2;
    scene.add(lightRing);

    // 3 Orbiting Planets with trails
    interface Body {
      mesh: THREE.Mesh;
      pos: THREE.Vector3;
      vel: THREE.Vector3;
      initPos: THREE.Vector3;
      initVel: THREE.Vector3;
      trailGeo: THREE.BufferGeometry;
      trailLine: THREE.Line;
      trailPts: THREE.Vector3[];
    }

    const bodySpecs = [
      { r: 2.7, v: 2.25, size: 0.28, color: 0x38bdf8 },
      { r: 4.1, v: 1.82, size: 0.36, color: 0x10b981 },
      { r: 5.5, v: 1.56, size: 0.24, color: 0xa855f7 },
    ];

    const disposablesGeo: THREE.BufferGeometry[] = [sunGeo, coneGeo];
    const disposablesMat: THREE.Material[] = [sunMat, coneMat];

    const bodies: Body[] = bodySpecs.map((spec, idx) => {
      const geo = new THREE.SphereGeometry(spec.size, 22, 22);
      const mat = new THREE.MeshStandardMaterial({
        color: spec.color,
        emissive: spec.color,
        emissiveIntensity: 0.3,
        metalness: 0.35,
        roughness: 0.35,
      });
      disposablesGeo.push(geo);
      disposablesMat.push(mat);

      const mesh = new THREE.Mesh(geo, mat);
      const angle = idx * 2.1;
      const initPos = new THREE.Vector3(Math.cos(angle) * spec.r, 0, Math.sin(angle) * spec.r);
      const initVel = new THREE.Vector3(-Math.sin(angle) * spec.v, 0, Math.cos(angle) * spec.v);
      mesh.position.copy(initPos);
      scene.add(mesh);

      const trailGeo = new THREE.BufferGeometry();
      const trailMat = new THREE.LineBasicMaterial({ color: spec.color, transparent: true, opacity: 0.65 });
      disposablesGeo.push(trailGeo);
      disposablesMat.push(trailMat);
      const trailLine = new THREE.Line(trailGeo, trailMat);
      scene.add(trailLine);

      return {
        mesh,
        pos: initPos.clone(),
        vel: initVel.clone(),
        initPos,
        initVel,
        trailGeo,
        trailLine,
        trailPts: [initPos.clone()],
      };
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSw;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4;
    controls.maxDistance = 24;

    camPresetFnRef.current = (mode) => {
      if (mode === 'top') {
        camera.position.set(0.01, 13.5, 0.8);
      } else if (mode === 'side') {
        camera.position.set(11.5, 1.4, 0.2);
      } else {
        camera.position.set(0, 6.5, 9.8);
      }
      controls.target.set(0, 0, 0);
      controls.update();
    };
    snapFnRef.current = () => {
      renderer.render(scene, camera);
      captureCanvasPng(renderer.domElement, `synapse-whatif-${preset}`);
    };

    const ro = new ResizeObserver(() => {
      if (!mount) return;
      const nw = mount.clientWidth || 720;
      const nh = mount.clientHeight || 460;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(mount);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let telemetryTimer = 0;

    const tick = () => {
      if (disposed) return;
      const rawDt = Math.min(0.04, clock.getDelta());
      const p = paramsRef.current;
      const dt = rawDt * p.timeScale;

      sunMesh.rotation.y += rawDt * 0.4;
      const elapsed = clock.elapsedTime;
      if (coronaRing1) {
        coronaRing1.rotation.z += rawDt * (isUltra ? 0.9 : 0.45);
        coronaRing1.scale.setScalar(1 + Math.sin(elapsed * 2.4) * (isUltra ? 0.07 : 0.03));
      }
      if (coronaRing2) {
        coronaRing2.rotation.z -= rawDt * 1.15;
        coronaRing2.rotation.y += rawDt * 0.35;
      }
      if (starPoints) {
        starPoints.rotation.y += rawDt * (isUltra ? 0.045 : 0.02);
      }
      if (isUltra) {
        sunMat.emissiveIntensity = 1.3 + Math.sin(elapsed * 3.2) * 0.25;
      }
      const ringScale = Math.max(0.5, Math.min(2.6, 1.0 / Math.max(0.25, p.lightSpeedMult)));
      lightRing.scale.setScalar(THREE.MathUtils.lerp(lightRing.scale.x, ringScale, 0.08));
      coneMat.color.setHex(p.lightSpeedMult < 0.5 ? 0xf43f5e : 0x38bdf8);

      if (runningRef.current) {
        const GM = 13.8 * p.gravityMult;
        for (const b of bodies) {
          const r = Math.max(0.75, b.pos.length());
          // Modified force law: a = -GM / r^(distancePower) * r_hat
          const accMag = GM / Math.pow(r, p.distancePower);
          const acc = b.pos.clone().normalize().multiplyScalar(-accMag);

          // Relativistic drag / precession when c is slow
          if (p.lightSpeedMult < 0.9) {
            const v2 = b.vel.lengthSq();
            const c2 = Math.pow(4.2 * p.lightSpeedMult, 2);
            const gammaBoost = 1 + Math.min(2.5, v2 / Math.max(0.5, c2));
            acc.multiplyScalar(gammaBoost);
          }

          b.vel.addScaledVector(acc, dt);
          b.pos.addScaledVector(b.vel, dt);

          // Respawn if collapsed into star or escaped too far
          if (b.pos.length() < 0.9 || b.pos.length() > 14) {
            b.pos.copy(b.initPos);
            b.vel.copy(b.initVel);
            b.trailPts = [b.pos.clone()];
          }

          // Macroscopic Quantum Uncertainty jitter (Heisenberg)
          const jitter = p.planckMult * 0.14;
          b.mesh.position.set(
            b.pos.x + (Math.random() - 0.5) * jitter,
            b.pos.y + (Math.random() - 0.5) * jitter,
            b.pos.z + (Math.random() - 0.5) * jitter
          );

          b.trailPts.push(b.pos.clone());
          if (b.trailPts.length > 90) b.trailPts.shift();
          b.trailGeo.setFromPoints(b.trailPts);
        }

        telemetryTimer += rawDt;
        if (telemetryTimer > 0.25) {
          telemetryTimer = 0;
          const b0 = bodies[0];
          const r0 = b0.pos.length();
          const v0 = b0.vel.length();
          const status =
            p.planckMult >= 1.2
              ? 'quantum'
              : r0 < 1.65
              ? 'collapse'
              : r0 > 7.5
              ? 'escape'
              : 'stable';
          setTelemetry({ speed: +v0.toFixed(2), radius: +r0.toFixed(2), status });
          setOrbitLog((prev) => [
            ...prev.slice(-47),
            { t: Number(clock.elapsedTime.toFixed(1)), speed: +v0.toFixed(2), radius: +r0.toFixed(2) },
          ]);
        }
      }

      if (autoOrbitRef.current) {
        const ang = rawDt * 0.32;
        const cx = camera.position.x - controls.target.x;
        const cz = camera.position.z - controls.target.z;
        camera.position.x = controls.target.x + cx * Math.cos(ang) - cz * Math.sin(ang);
        camera.position.z = controls.target.z + cx * Math.sin(ang) + cz * Math.cos(ang);
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
      disposablesGeo.forEach((g) => g.dispose());
      disposablesMat.forEach((m) => m.dispose());
      extraGeos.forEach((g) => g.dispose());
      extraMats.forEach((m) => m.dispose());
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [resetTick, perfMode]);

  return (
    <div className="space-y-4">
      {/* Preset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(PRESETS) as PresetId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => applyPreset(id)}
              className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                preset === id
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isEn ? PRESETS[id].labelEn : PRESETS[id].labelVi}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center rounded-lg bg-slate-800 border border-slate-700 p-0.5 text-[11px] font-mono">
            {([0.25, 0.5, 1, 2] as const).map((sp) => (
              <button
                key={sp}
                type="button"
                onClick={() => setParams((p) => ({ ...p, timeScale: sp }))}
                className={`px-2 py-1 rounded font-bold cursor-pointer ${
                  Math.abs(params.timeScale - sp) < 0.05 ? 'bg-sky-500 text-slate-950' : 'text-slate-300'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAutoOrbit((o) => !o)}
            className={`min-h-[38px] inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-bold cursor-pointer ${
              autoOrbit
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isEn ? 'Orbit' : 'Tự xoay'}</span>
          </button>
          <button
            type="button"
            onClick={() => snapFnRef.current?.()}
            className="min-h-[38px] inline-flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs font-bold text-sky-300 hover:border-sky-400 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>PNG</span>
          </button>
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="min-h-[38px] inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 cursor-pointer"
          >
            {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {running ? (isEn ? 'Pause' : 'Tạm dừng') : isEn ? 'Resume' : 'Chạy tiếp'}
          </button>
          <button
            type="button"
            onClick={() => {
              setOrbitLog([]);
              setResetTick((t) => t + 1);
            }}
            className="min-h-[38px] inline-flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isEn ? 'Reset' : 'Đặt lại'}
          </button>
        </div>
      </div>

      {/* Main 3D Stage + Constant Control Panel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* 3D Viewport (Stacked HUD above canvas on phones, floating on sm+) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#040712] flex flex-col sm:block">
            {/* Telemetry HUD */}
            <div className="relative sm:pointer-events-none sm:absolute sm:left-3 sm:top-3 z-10 sm:rounded-xl border-b sm:border border-slate-700/80 bg-slate-950/94 px-3 py-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-sky-300">
                <Orbit className="h-3.5 w-3.5 shrink-0" />
                <span>What-If Physics Sandbox 3D</span>
              </div>
              <div className="mt-1 font-mono text-[11px] text-slate-300">
                F = G·M·m / r^{params.distancePower.toFixed(2)} · G = {params.gravityMult.toFixed(2)}× · c = {params.lightSpeedMult.toFixed(2)}c
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px]">
                <span className="text-slate-400">v = {telemetry.speed} km/s</span>
                <span className="text-slate-400">r = {telemetry.radius} AU</span>
                <span
                  className={`font-bold ${
                    telemetry.status === 'stable'
                      ? 'text-emerald-400'
                      : telemetry.status === 'quantum'
                      ? 'text-violet-400'
                      : 'text-rose-400'
                  }`}
                >
                  {telemetry.status === 'stable'
                    ? '● Ổn định'
                    : telemetry.status === 'quantum'
                    ? '● Hỗn loạn lượng tử'
                    : telemetry.status === 'collapse'
                    ? '● Sụp đổ quỹ đạo!'
                    : '● Thoát ly vũ trụ!'}
                </span>
              </div>
            </div>

            {/* Camera Angle Presets Top-Right */}
            <div className="hidden sm:flex items-center gap-1 absolute right-3 top-3 z-10">
              {(['iso', 'top', 'side'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => camPresetFnRef.current?.(m)}
                  className="px-2 py-1 rounded-md bg-slate-950/90 border border-slate-700 hover:border-sky-400 text-[10px] font-mono font-bold uppercase text-slate-200 cursor-pointer"
                >
                  {m}
                </button>
              ))}
            </div>

            <div ref={mountRef} className="h-[300px] sm:h-[400px] lg:h-[460px] w-full cursor-grab active:cursor-grabbing touch-none" />
          </div>

          <MiniTelemetryChart
            title={isEn ? 'Live Orbital Kinematics Telemetry' : 'Dao động ký Quỹ đạo Thời gian thực'}
            darkSurface={true}
            height={86}
            onExportCsv={() =>
              exportRowsToCsv(
                `whatif-orbit-${preset}`,
                ['Time (s)', 'Speed (km/s)', 'Radius (AU)', 'G', 'Exponent n', 'c'],
                orbitLog.map((pt) => [
                  pt.t,
                  pt.speed,
                  pt.radius,
                  params.gravityMult,
                  params.distancePower,
                  params.lightSpeedMult,
                ])
              )
            }
            series={[
              { id: 'v', label: 'v', unit: 'km/s', color: '#38bdf8', values: orbitLog.map((d) => d.speed) },
              { id: 'r', label: 'r', unit: 'AU', color: '#fbbf24', values: orbitLog.map((d) => d.radius) },
            ]}
          />
        </div>

        {/* Sliders & Analysis */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 lg:col-span-4">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Atom className="h-4 w-4 text-sky-400" />
              {isEn ? 'Break Natural Constants' : 'Phá vỡ Hằng số Tự nhiên'}
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Hằng số Hấp dẫn (G)</span>
                <span className="font-mono font-bold text-sky-300">{params.gravityMult.toFixed(2)}×</span>
              </div>
              <input
                type="range"
                min={0.2}
                max={3.0}
                step={0.05}
                value={params.gravityMult}
                onChange={(e) => setParams((p) => ({ ...p, gravityMult: parseFloat(e.target.value) }))}
                className="mt-1 w-full accent-sky-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Số mũ khoảng cách (1/rⁿ)</span>
                <span className="font-mono font-bold text-amber-300">n = {params.distancePower.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={1.4}
                max={3.2}
                step={0.05}
                value={params.distancePower}
                onChange={(e) => setParams((p) => ({ ...p, distancePower: parseFloat(e.target.value) }))}
                className="mt-1 w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Tốc độ Ánh sáng (c)</span>
                <span className="font-mono font-bold text-rose-300">{params.lightSpeedMult.toFixed(2)}c</span>
              </div>
              <input
                type="range"
                min={0.15}
                max={2.0}
                step={0.05}
                value={params.lightSpeedMult}
                onChange={(e) => setParams((p) => ({ ...p, lightSpeedMult: parseFloat(e.target.value) }))}
                className="mt-1 w-full accent-rose-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Hằng số Planck vĩ mô (h)</span>
                <span className="font-mono font-bold text-violet-300">{params.planckMult.toFixed(2)}×</span>
              </div>
              <input
                type="range"
                min={0}
                max={3.0}
                step={0.1}
                value={params.planckMult}
                onChange={(e) => setParams((p) => ({ ...p, planckMult: parseFloat(e.target.value) }))}
                className="mt-1 w-full accent-violet-500"
              />
            </div>
          </div>

          {/* Scientific Consequence Box */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-100">
            <div className="mb-1 flex items-center gap-1.5 font-bold text-amber-300">
              {telemetry.status === 'stable' ? (
                <Sparkles className="h-3.5 w-3.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5" />
              )}
              {isEn ? 'Physical Consequence' : 'Hệ quả Vật lí khi đổi định luật'}
            </div>
            {consequence}
          </div>
        </div>
      </div>
    </div>
  );
};
