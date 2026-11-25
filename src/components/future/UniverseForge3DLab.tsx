import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Camera, Check, Copy, Orbit, Pause, Play, RotateCcw, Share2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { captureCanvasPng } from '../common/SimProToolkit';

interface UniverseForge3DLabProps {
  onEarnXP?: (xp: number) => void;
}

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

const _vTmp = new THREE.Vector3();
const _vDir = new THREE.Vector3();
const _up = new THREE.Vector3(0, 0, 1);
const _quat = new THREE.Quaternion();
const _mat4 = new THREE.Matrix4();
const _col = new THREE.Color();

export const UniverseForge3DLab: React.FC<UniverseForge3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [gravityG, setGravityG] = useState<number>(1.35); // -1.2 (repulsive) to 3.2
  const [forceExp, setForceExp] = useState<number>(2.0); // 1.4 to 3.1
  const [speedOfLight, setSpeedOfLight] = useState<number>(40); // 15 to 120 m/s sim scale
  const [betaFrac, setBetaFrac] = useState<number>(0.68); // v / c (0.08 to 0.96)
  const [paused, setPaused] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [resetNonce, setResetNonce] = useState<number>(0);
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [codeInput, setCodeInput] = useState<string>('');
  const [codeNotice, setCodeNotice] = useState<string | null>(null);
  const [camMode, setCamMode] = useState<'overview' | 'follow' | 'top'>('overview');
  const [clockStats, setClockStats] = useState<{ earth: number; ship: number }>({ earth: 0, ship: 0 });
  const camModeRef = useRef(camMode);
  camModeRef.current = camMode;
  const snapFnRef = useRef<(() => void) | null>(null);

  const universeCode = useMemo(
    () => `SYN-U1:${gravityG.toFixed(2)}:${forceExp.toFixed(2)}:${Math.round(speedOfLight)}:${betaFrac.toFixed(2)}`,
    [gravityG, forceExp, speedOfLight, betaFrac]
  );

  const handleCopyUniverseCode = async () => {
    try {
      await navigator.clipboard.writeText(universeCode);
    } catch {}
    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 1800);
  };

  const handleApplyUniverseCode = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = codeInput.trim();
    const m = raw.match(/^(?:SYN-U1:)?(-?\d+(?:\.\d+)?):(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/i);
    if (!m) {
      setCodeNotice(isEn ? 'Invalid code format' : 'Mã vũ trụ không đúng định dạng');
      return;
    }
    const g = THREE.MathUtils.clamp(parseFloat(m[1]), -1.2, 3.0);
    const n = THREE.MathUtils.clamp(parseFloat(m[2]), 1.4, 3.1);
    const c = THREE.MathUtils.clamp(parseFloat(m[3]), 15, 120);
    const b = THREE.MathUtils.clamp(parseFloat(m[4]), 0.08, 0.96);
    setGravityG(g);
    setForceExp(n);
    setSpeedOfLight(c);
    setBetaFrac(b);
    setResetNonce((prev) => prev + 1);
    setCodeNotice(isEn ? 'Loaded shared universe!' : 'Đã nạp thành công vũ trụ!');
    window.setTimeout(() => setCodeNotice(null), 2000);
    onEarnXP?.(8);
  };

  const lorentzGamma = useMemo(() => 1 / Math.sqrt(Math.max(0.02, 1 - betaFrac * betaFrac)), [betaFrac]);
  const lengthRatio = useMemo(() => Math.sqrt(Math.max(0.02, 1 - betaFrac * betaFrac)), [betaFrac]);

  const paramsRef = useRef({ gravityG, forceExp, speedOfLight, betaFrac, paused, resetNonce });
  paramsRef.current = { gravityG, forceExp, speedOfLight, betaFrac, paused, resetNonce };

  const applyPreset = (id: 'solar' | 'slow_c' | 'antigrav' | 'rosette') => {
    if (id === 'solar') {
      setGravityG(1.3);
      setForceExp(2.0);
      setSpeedOfLight(100);
      setBetaFrac(0.24);
    } else if (id === 'slow_c') {
      setGravityG(1.45);
      setForceExp(2.05);
      setSpeedOfLight(18);
      setBetaFrac(0.91);
    } else if (id === 'antigrav') {
      setGravityG(-0.95);
      setForceExp(2.0);
      setSpeedOfLight(45);
      setBetaFrac(0.55);
    } else {
      setGravityG(1.65);
      setForceExp(2.42);
      setSpeedOfLight(34);
      setBetaFrac(0.76);
    }
    setResetNonce((n) => n + 1);
    onEarnXP?.(6);
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const softwareGl = isSoftwareWebGL();
    const w = mount.clientWidth || 860;
    const h = mount.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030612);
    scene.fog = new THREE.FogExp2(0x030612, 0.022);

    const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 180);
    camera.position.set(0, 6.2, 11.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: !softwareGl,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(softwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmrem.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !softwareGl;
    controls.dampingFactor = 0.07;
    controls.target.set(0, 0.2, 0);
    controls.minDistance = 4;
    controls.maxDistance = 28;
    snapFnRef.current = () => {
      renderer.render(scene, camera);
      captureCanvasPng(renderer.domElement, 'synapse-universe-forge');
    };

    scene.add(new THREE.HemisphereLight(0x93c5fd, 0x090b18, 0.9));
    const key = new THREE.DirectionalLight(0xfff4df, 1.9);
    key.position.set(8, 12, 6);
    scene.add(key);

    // 1. Central Singularity + Photon Ring + Accretion Disk
    const singularityGroup = new THREE.Group();
    const eventHorizon = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 36, 28),
      new THREE.MeshStandardMaterial({ color: 0x02040a, roughness: 0.1, metalness: 0.9 })
    );
    const photonRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.12, 0.045, 16, 72),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
    );
    const lensingHalo = new THREE.Mesh(
      new THREE.TorusGeometry(1.28, 0.03, 14, 72),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.72 })
    );
    lensingHalo.rotation.x = Math.PI / 2;
    const accretionDisk = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.22, 16, 72),
      new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xea580c,
        emissiveIntensity: 1.35,
        roughness: 0.4,
        transparent: true,
        opacity: 0.78
      })
    );
    accretionDisk.rotation.x = Math.PI / 2 - 0.14;
    accretionDisk.scale.z = 0.28;
    singularityGroup.add(eventHorizon, photonRing, lensingHalo, accretionDisk);
    scene.add(singularityGroup);

    // 2. Dynamic Spacetime Curvature Wireframe Grid
    const gridGeo = new THREE.PlaneGeometry(18, 18, 38, 38);
    gridGeo.rotateX(-Math.PI / 2);
    const basePos = Float32Array.from(gridGeo.attributes.position.array);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.34
    });
    const spacetimeMesh = new THREE.Mesh(gridGeo, gridMat);
    spacetimeMesh.position.y = -1.25;
    scene.add(spacetimeMesh);

    // 3. Relativistic Starship Probe (Composite 6-part Group with Lorentz Contraction)
    const probeGroup = new THREE.Group();
    const hullMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 0.8
    });
    const fuselage = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.95, 16), hullMat);
    fuselage.rotation.x = Math.PI / 2;
    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 12),
      new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8, roughness: 0.1 })
    );
    cockpit.position.set(0, 0.1, 0.12);
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.32), hullMat);
    wingL.position.set(0, -0.02, -0.15);
    const nacelleMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.6
    });
    const thrusterL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.42, 12), nacelleMat);
    thrusterL.rotation.x = Math.PI / 2;
    thrusterL.position.set(-0.34, 0, -0.32);
    const thrusterR = thrusterL.clone();
    thrusterR.position.set(0.34, 0, -0.32);
    probeGroup.add(fuselage, cockpit, wingL, thrusterL, thrusterR);
    scene.add(probeGroup);

    // Orbital Trajectory Ribbon
    const TRAIL_MAX = 160;
    const trailPts = new Float32Array(TRAIL_MAX * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPts, 3));
    const trailLine = new THREE.Line(
      trailGeo,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
    );
    trailLine.frustumCulled = false;
    scene.add(trailLine);

    // Starfield InstancedMesh (shows Doppler blueshift/redshift tint)
    const STAR_COUNT = 220;
    const starMesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.045, 5, 5),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
      STAR_COUNT
    );
    starMesh.frustumCulled = false;
    const starCoords = Array.from({ length: STAR_COUNT }, (_, i) => {
      const ang = i * 2.39996;
      const rad = 11 + ((i * 29) % 24);
      const y = (((i * 47) % 100) / 100 - 0.5) * 16;
      return [Math.cos(ang) * rad, y, Math.sin(ang) * rad];
    });
    scene.add(starMesh);

    // Orbital Physics State
    const pos = new THREE.Vector3(4.6, 0.2, 0);
    const vel = new THREE.Vector3(0, 0, 2.8);
    let lastReset = paramsRef.current.resetNonce;
    const trailQueue: number[] = [];

    const resetOrbit = () => {
      pos.set(4.6, 0.25, 0);
      const vMag = 1.4 + paramsRef.current.betaFrac * 3.1;
      vel.set(0, 0, vMag);
      trailQueue.length = 0;
    };
    resetOrbit();

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let earthTime = 0;
    let shipTime = 0;
    let clockReportTimer = 0;

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

      if (cfg.resetNonce !== lastReset) {
        lastReset = cfg.resetNonce;
        resetOrbit();
      }

      // 1. Deform Spacetime Funnel Grid live based on G and 1/r^n
      const gAttr = gridGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < gAttr.count; i++) {
        const bx = basePos[i * 3];
        const bz = basePos[i * 3 + 2];
        const r = Math.max(1.15, Math.hypot(bx, bz));
        const well = -cfg.gravityG * (4.2 / Math.pow(r, Math.max(0.7, cfg.forceExp - 0.6)));
        gAttr.setY(i, THREE.MathUtils.clamp(well, -4.2, 2.8));
      }
      gAttr.needsUpdate = true;
      gridMat.color.setHex(cfg.gravityG < 0 ? 0xf43f5e : 0x38bdf8);

      // 2. Integrate Starship Orbit under Custom Gravity Law F ~ G / r^n
      if (!cfg.paused) {
        const subSteps = 3;
        const hStep = dt / subSteps;
        const targetSpeed = 1.6 + (cfg.betaFrac * cfg.speedOfLight) / 14;
        for (let s = 0; s < subSteps; s++) {
          const r = Math.max(1.45, pos.length());
          const forceMag = (cfg.gravityG * 18.0) / Math.pow(r, cfg.forceExp);
          _vTmp.copy(pos).normalize().multiplyScalar(-forceMag * hStep);
          vel.add(_vTmp);
          // Gentle orbital speed regulator so probe responds dramatically to beta without flying offscreen instantly
          const currSpd = vel.length() || 1;
          vel.multiplyScalar(THREE.MathUtils.lerp(1, targetSpeed / currSpd, 0.04));
          pos.addScaledVector(vel, hStep);
          pos.y = THREE.MathUtils.lerp(pos.y, 0.25, 0.06);
          if (pos.length() > 9.5 || pos.length() < 1.35) {
            resetOrbit();
            break;
          }
        }
        trailQueue.push(pos.x, pos.y, pos.z);
        if (trailQueue.length > TRAIL_MAX * 3) trailQueue.splice(0, 3);
      }

      // Apply trail geometry
      const tAttr = trailGeo.attributes.position as THREE.BufferAttribute;
      const countPts = Math.floor(trailQueue.length / 3);
      for (let i = 0; i < TRAIL_MAX; i++) {
        const idx = Math.min(i, Math.max(0, countPts - 1)) * 3;
        tAttr.setXYZ(i, trailQueue[idx] ?? pos.x, trailQueue[idx + 1] ?? pos.y, trailQueue[idx + 2] ?? pos.z);
      }
      tAttr.needsUpdate = true;

      // 3. Orient Probe + Apply Relativistic Lorentz Length Contraction & Doppler Color Shift
      probeGroup.position.copy(pos);
      if (vel.lengthSq() > 0.0001) {
        _vDir.copy(vel).normalize();
        _quat.setFromUnitVectors(_up, _vDir);
        probeGroup.quaternion.copy(_quat);
      }
      const lorentzScaleZ = Math.sqrt(Math.max(0.18, 1 - cfg.betaFrac * cfg.betaFrac));
      probeGroup.scale.set(1, 1, lorentzScaleZ);

      // Doppler shift relative to camera line of sight
      _vTmp.copy(camera.position).sub(pos).normalize();
      const approach = _vDir.dot(_vTmp) * cfg.betaFrac; // + = approaching (blueshift), - = receding (redshift)
      const dopplerHue = THREE.MathUtils.clamp(0.54 + approach * 0.26, 0.02, 0.66);
      nacelleMat.emissive.setHSL(dopplerHue, 0.95, 0.55);
      (trailLine.material as THREE.LineBasicMaterial).color.setHSL(dopplerHue, 0.9, 0.6);

      // Rotate accretion disk & photon ring
      accretionDisk.rotation.z += dt * 0.8;
      photonRing.lookAt(camera.position);

      for (let i = 0; i < STAR_COUNT; i++) {
        const [sx, sy, sz] = starCoords[i];
        _mat4.makeTranslation(sx, sy, sz);
        starMesh.setMatrixAt(i, _mat4);
        const shift = THREE.MathUtils.clamp(0.55 + Math.sin(t + i) * 0.08 + approach * 0.2, 0.05, 0.68);
        _col.setHSL(shift, 0.78, 0.78);
        starMesh.setColorAt(i, _col);
      }
      starMesh.instanceMatrix.needsUpdate = true;
      if (starMesh.instanceColor) starMesh.instanceColor.needsUpdate = true;

      if (!cfg.paused) {
        const gamma = 1 / Math.sqrt(Math.max(0.02, 1 - cfg.betaFrac * cfg.betaFrac));
        earthTime += dt;
        shipTime += dt / gamma;
        clockReportTimer += dt;
        if (clockReportTimer >= 0.2) {
          clockReportTimer = 0;
          setClockStats({ earth: earthTime, ship: shipTime });
        }
      }

      if (camModeRef.current === 'follow') {
        controls.target.lerp(probeGroup.position, 1 - Math.exp(-5 * dt));
      } else if (camModeRef.current === 'top') {
        controls.target.lerp(_vTmp.set(0, 0, 0), 1 - Math.exp(-5 * dt));
        camera.position.lerp(_vDir.set(0.05, 16.5, 2.2), 1 - Math.exp(-4 * dt));
      } else {
        controls.target.lerp(_vTmp.set(0, 0.2, 0), 1 - Math.exp(-5 * dt));
      }

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

  return (
    <div className="relative w-full lg:h-[700px] rounded-2xl overflow-hidden border border-amber-500/40 bg-[#030612] text-white shadow-2xl flex flex-col lg:block">
      {/* Top-Left Relativistic Telemetry (Stacked on < lg, floating on lg+) */}
      <div className="relative z-20 p-2.5 sm:p-3 lg:pointer-events-none lg:absolute lg:top-3 lg:left-3 lg:right-3 flex flex-wrap items-start justify-between gap-2 bg-[#030612]/95 lg:bg-transparent border-b border-amber-500/20 lg:border-b-0 shrink-0">
        <div className="pointer-events-auto rounded-lg bg-[#050a18]/92 border border-amber-500/40 px-3.5 py-2.5 space-y-1 shadow-lg max-w-full lg:max-w-md">
          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
            <Orbit className="w-4 h-4 shrink-0" />
            <span>{isEn ? 'Universe Forge · Custom Relativity' : 'Lò Rèn Vũ Trụ & Tương Đối Tính 3D'}</span>
          </div>
          <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-[11px] font-mono tabular-nums text-slate-200">
            <span>γ = {lorentzGamma.toFixed(2)}</span>
            <span>·</span>
            <span>L/L₀ = {(lengthRatio * 100).toFixed(0)}%</span>
            <span>·</span>
            <span className="text-sky-300">F ∝ {gravityG.toFixed(2)} / r^{forceExp.toFixed(2)}</span>
          </div>
          <div className="flex flex-wrap gap-x-3 text-[10px] font-mono tabular-nums text-emerald-300">
            <span>t_Earth = {clockStats.earth.toFixed(1)}s</span>
            <span>τ_Ship = {clockStats.ship.toFixed(1)}s (×{(1 / lorentzGamma).toFixed(2)})</span>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-lg bg-[#050a18]/92 border border-amber-500/35 px-2.5 py-1.5 shadow-lg">
          {(
            [
              ['overview', isEn ? 'Overview' : 'Toàn cảnh'],
              ['follow', isEn ? 'Follow Ship' : 'Theo Tàu'],
              ['top', isEn ? 'Top Funnel' : 'Đỉnh Phễu'],
            ] as const
          ).map(([id, lbl]) => (
            <button
              key={id}
              type="button"
              onClick={() => setCamMode(id)}
              className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                camMode === id
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              {lbl}
            </button>
          ))}
          <button
            type="button"
            onClick={() => snapFnRef.current?.()}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:border-sky-400 text-[10px] font-mono font-bold text-sky-300 cursor-pointer"
          >
            <Camera className="w-3 h-3" />
            <span>PNG</span>
          </button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="relative w-full h-[290px] sm:h-[380px] lg:absolute lg:inset-0 lg:h-full">
        <div ref={mountRef} className="w-full h-full touch-none" />
      </div>

      {/* Collapsible Bottom Control Dock (Stacked below canvas on < lg, floating on lg+) */}
      <div className="relative lg:absolute lg:bottom-3 lg:left-1/2 lg:-translate-x-1/2 z-20 w-full lg:w-[min(920px,95vw)] p-2.5 lg:p-0 bg-[#030612]/95 lg:bg-transparent border-t border-amber-500/20 lg:border-t-0 flex flex-col items-center shrink-0">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="min-h-[34px] px-3 py-1 rounded-md lg:rounded-b-none bg-[#060c1d]/95 border lg:border-b-0 border-amber-500/40 text-[10px] font-mono font-bold text-amber-200 cursor-pointer"
        >
          {dockCollapsed
            ? isEn ? '▴ Show Universe Constants' : '▴ Mở Hằng Số Vũ Trụ'
            : isEn ? '▾ Hide Controls' : '▾ Thu Gọn Bảng Điều Khiển'}
        </button>

        {!dockCollapsed && (
          <div className="w-full mt-1.5 lg:mt-0 rounded-xl bg-[#060c1d]/95 border border-amber-500/40 p-3 space-y-2.5 shadow-2xl max-h-[38dvh] lg:max-h-none overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
              <label className="space-y-1">
                <div className="flex justify-between font-mono text-slate-300">
                  <span>{isEn ? 'Gravity G' : 'Hằng số Hấp dẫn G'}</span>
                  <span className="text-amber-300 font-bold">{gravityG.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={-1.2}
                  max={3.0}
                  step={0.05}
                  value={gravityG}
                  onChange={(e) => setGravityG(parseFloat(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between font-mono text-slate-300">
                  <span>{isEn ? 'Law 1/r^n' : 'Số mũ lực 1/rⁿ'}</span>
                  <span className="text-sky-300 font-bold">n = {forceExp.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={1.4}
                  max={3.1}
                  step={0.02}
                  value={forceExp}
                  onChange={(e) => setForceExp(parseFloat(e.target.value))}
                  className="w-full accent-sky-400"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between font-mono text-slate-300">
                  <span>{isEn ? 'Speed of Light c' : 'Tốc độ Ánh sáng c'}</span>
                  <span className="text-cyan-300 font-bold">{speedOfLight} m/s</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={120}
                  step={1}
                  value={speedOfLight}
                  onChange={(e) => setSpeedOfLight(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </label>

              <label className="space-y-1">
                <div className="flex justify-between font-mono text-slate-300">
                  <span>{isEn ? 'Velocity β = v/c' : 'Tốc độ Tàu β = v/c'}</span>
                  <span className="text-rose-300 font-bold">{betaFrac.toFixed(2)}c</span>
                </div>
                <input
                  type="range"
                  min={0.08}
                  max={0.96}
                  step={0.01}
                  value={betaFrac}
                  onChange={(e) => setBetaFrac(parseFloat(e.target.value))}
                  className="w-full accent-rose-400"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-400 font-semibold">{isEn ? 'Universes:' : 'Vũ trụ mẫu:'}</span>
                {(
                  [
                    ['solar', isEn ? 'Standard 1/r²' : 'Chuẩn Newton 1/r²'],
                    ['slow_c', isEn ? 'Slow Light (0.91c)' : 'Ánh sáng chậm (0.91c)'],
                    ['antigrav', isEn ? 'Anti-Gravity' : 'Phản Hấp Dẫn (G<0)'],
                    ['rosette', isEn ? 'Relativistic Rosette' : 'Quỹ đạo Hoa Hồng']
                  ] as const
                ).map(([pid, lbl]) => (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => applyPreset(pid)}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 font-semibold cursor-pointer whitespace-nowrap"
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaused((v) => !v)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold cursor-pointer"
                >
                  {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{paused ? (isEn ? 'Resume' : 'Chạy') : isEn ? 'Pause' : 'Tạm dừng'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResetNonce((n) => n + 1)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 border border-slate-600 text-slate-200 text-xs font-bold hover:border-sky-400 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Reset Orbit' : 'Đặt lại'}</span>
                </button>
              </div>
            </div>

            {/* Row 3: Universe Share Code */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="text-slate-400 font-semibold">{isEn ? 'Share Code:' : 'Mã Vũ Trụ:'}</span>
                <code className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30 font-mono text-amber-200">
                  {universeCode}
                </code>
                <button
                  type="button"
                  onClick={() => void handleCopyUniverseCode()}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/50 hover:bg-amber-500/30 text-amber-200 font-bold cursor-pointer"
                >
                  {shareCopied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  <span>{shareCopied ? (isEn ? 'Copied' : 'Đã chép') : isEn ? 'Copy' : 'Lưu mã'}</span>
                </button>
              </div>

              <form onSubmit={handleApplyUniverseCode} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="SYN-U1:1.35:2.00:40:0.68"
                  className="w-44 px-2 py-1 rounded bg-slate-900 border border-slate-700 focus:border-sky-400 font-mono text-[10px] text-white outline-none"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-[10px] cursor-pointer"
                >
                  {isEn ? 'Load Code' : 'Nạp Mã'}
                </button>
                {codeNotice && <span className="text-emerald-300 font-semibold">{codeNotice}</span>}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
