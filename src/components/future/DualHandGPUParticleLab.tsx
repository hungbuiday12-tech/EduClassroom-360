import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  Camera,
  CameraOff,
  ChevronDown,
  ChevronUp,
  Hand,
  Magnet,
  Orbit,
  RotateCcw,
  Sparkles,
  Waves
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { HandGestureTracker } from '../spatial3d/handGestureTracker';
import { setLiveWorkspaceContext } from '../../lib/liveCoPilotBridge';

type FieldSandboxMode = 'binary_gravity' | 'lorentz_b' | 'wave_interference' | 'rutherford_scatter';
type ManualForceAction = 'attract' | 'repel';

function detectSoftwareGl(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return true;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (!dbg) return false;
    const r = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
    return /swiftshader|llvmpipe|softpipe|software|mesa/.test(r);
  } catch {
    return false;
  }
}

export const DualHandGPUParticleLab: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [mode, setMode] = useState<FieldSandboxMode>('binary_gravity');
  const [manualAction, setManualAction] = useState<ManualForceAction>('attract');
  const [fieldStrength, setFieldStrength] = useState(1.25);
  const [bFieldStrength, setBFieldStrength] = useState(1.1);
  const [damping, setDamping] = useState(0.985);
  const [cameraActive, setCameraActive] = useState(false);
  const [hudExpanded, setHudExpanded] = useState(true);
  const [activeHandsBadge, setActiveHandsBadge] = useState<{
    count: number;
    action: 'idle' | 'attract' | 'repel';
  }>({ count: 0, action: 'idle' });

  const mountRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackerRef = useRef<HandGestureTracker | null>(null);
  const lastBadgeKeyRef = useRef<string>('0:idle');

  const paramsRef = useRef({
    mode,
    manualAction,
    fieldStrength,
    bFieldStrength,
    damping,
    cameraActive
  });
  paramsRef.current = { mode, manualAction, fieldStrength, bFieldStrength, damping, cameraActive };

  const attractorsRef = useRef({
    h1x: 0,
    h1y: 0,
    h1z: 0,
    h1Sign: 1,
    h1Active: true,
    h2x: 1.6,
    h2y: -0.2,
    h2z: 0,
    h2Sign: -1,
    h2Active: false,
    resetRequested: false
  });

  useEffect(() => {
    setLiveWorkspaceContext({
      subject: 'physics',
      title: isEn ? 'Dual-Hand GPU Particle Field Sandbox' : 'Sandbox Trường Hạt GPU Hai Tay',
      summary: `GPU Particles · Mode=${mode} · G/k=${fieldStrength.toFixed(2)} · B=${bFieldStrength.toFixed(2)} · Hands=${activeHandsBadge.count} (${activeHandsBadge.action})`,
      formula:
        mode === 'lorentz_b'
          ? '\\vec{F} = q(\\vec{E} + \\vec{v}\\times\\vec{B})'
          : mode === 'binary_gravity'
          ? '\\vec{F} = -\\sum_{k=1}^2 \\frac{GM_k m}{r_k^2 + \\varepsilon}\\hat{r}_k'
          : mode === 'wave_interference'
          ? 'A = A_1\\cos(kr_1 - \\omega t) + A_2\\cos(kr_2 - \\omega t)'
          : '\\vec{F} = +k_e \\frac{q_\\alpha Q_{\\text{Au}}}{r^2}\\hat{r}',
      paramsSummary: `mode=${mode}, strength=${fieldStrength}, B=${bFieldStrength}, hands=${activeHandsBadge.count}`
    });
  }, [activeHandsBadge.action, activeHandsBadge.count, bFieldStrength, fieldStrength, isEn, mode]);

  const toggleCamera = useCallback(async () => {
    if (cameraActive) {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraActive(false);
      lastBadgeKeyRef.current = '0:idle';
      setActiveHandsBadge({ count: 0, action: 'idle' });
      const isRepel = paramsRef.current.manualAction === 'repel';
      attractorsRef.current.h1Active = true;
      attractorsRef.current.h1Sign = isRepel ? -1 : 1;
      attractorsRef.current.h2Active = isRepel;
      attractorsRef.current.h2Sign = -1;
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 480, max: 640 },
          height: { ideal: 360, max: 480 },
          frameRate: { ideal: 60, max: 60 },
          facingMode: 'user'
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        void videoRef.current.play();
      }
      if (!trackerRef.current) trackerRef.current = new HandGestureTracker();
      void trackerRef.current.ensureInitialized();
      attractorsRef.current.h1Active = false;
      attractorsRef.current.h2Active = false;
      lastBadgeKeyRef.current = '0:idle';
      setActiveHandsBadge({ count: 0, action: 'idle' });
      setCameraActive(true);
    } catch {
      setCameraActive(false);
    }
  }, [cameraActive]);

  const handleManualActionChange = useCallback((next: ManualForceAction) => {
    setManualAction(next);
    if (!paramsRef.current.cameraActive) {
      const isRepel = next === 'repel';
      attractorsRef.current.h1Active = true;
      attractorsRef.current.h1Sign = isRepel ? -1 : 1;
      attractorsRef.current.h2Active = isRepel;
      attractorsRef.current.h2Sign = -1;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      trackerRef.current?.dispose();
      trackerRef.current = null;
    };
  }, []);

  // Main Three.js GPU Particle Field loop
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const isSoftwareGl = detectSoftwareGl();
    const particleCount = isSoftwareGl ? 3600 : 28000;

    const width = Math.max(300, mount.clientWidth);
    const height = Math.max(300, mount.clientHeight);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050914);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 8.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 1.5));
    mount.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 18;

    // Pre-allocated typed buffers (zero per-frame allocations)
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const energies = new Float32Array(particleCount);

    const seedParticles = (currentMode: FieldSandboxMode) => {
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        if (currentMode === 'wave_interference') {
          const cols = Math.floor(Math.sqrt(particleCount));
          const row = Math.floor(i / cols);
          const col = i % cols;
          positions[i3] = ((col / cols) - 0.5) * 9.5;
          positions[i3 + 1] = ((row / cols) - 0.5) * 5.6;
          positions[i3 + 2] = 0;
          velocities[i3] = 0;
          velocities[i3 + 1] = 0;
          velocities[i3 + 2] = 0;
        } else if (currentMode === 'rutherford_scatter') {
          positions[i3] = -5.5 - Math.random() * 4.5;
          positions[i3 + 1] = (Math.random() - 0.5) * 4.6;
          positions[i3 + 2] = (Math.random() - 0.5) * 1.4;
          velocities[i3] = 3.2 + Math.random() * 0.8;
          velocities[i3 + 1] = 0;
          velocities[i3 + 2] = 0;
        } else {
          const ang = Math.random() * Math.PI * 2;
          const r = 0.6 + Math.random() * 4.2;
          positions[i3] = Math.cos(ang) * r;
          positions[i3 + 1] = (Math.random() - 0.5) * 2.4;
          positions[i3 + 2] = Math.sin(ang) * r * 0.45;
          velocities[i3] = -Math.sin(ang) * 0.7;
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.3;
          velocities[i3 + 2] = Math.cos(ang) * 0.5;
        }
        energies[i] = 0.2;
      }
    };

    seedParticles(paramsRef.current.mode);

    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    const energyAttr = new THREE.BufferAttribute(energies, 1);
    energyAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    geo.setAttribute('aEnergy', energyAttr);

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uPointSize: { value: isSoftwareGl ? 6.5 : 4.2 },
        uModeTint: { value: new THREE.Color('#38bdf8') }
      },
      vertexShader: `
        attribute float aEnergy;
        varying float vEnergy;
        uniform float uPointSize;
        void main() {
          vEnergy = clamp(aEnergy, 0.0, 1.0);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uPointSize * (6.0 / max(1.0, -mvPos.z));
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying float vEnergy;
        uniform vec3 uModeTint;
        void main() {
          vec2 d = gl_PointCoord - vec2(0.5);
          float r = dot(d, d);
          if (r > 0.25) discard;
          float alpha = smoothstep(0.25, 0.0, r);
          vec3 hot = vec3(1.0, 0.72, 0.22);
          vec3 col = mix(uModeTint, hot, vEnergy);
          gl_FragColor = vec4(col, alpha * 0.85);
        }
      `
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Hand Force Sphere Markers (1 hand = Cyan Attract, 2 hands = Rose & Orange Repel)
    const handGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const hand1Mat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true });
    const hand2Mat = new THREE.MeshBasicMaterial({ color: 0xf97316, wireframe: true });
    const hand1Mesh = new THREE.Mesh(handGeo, hand1Mat);
    const hand2Mesh = new THREE.Mesh(handGeo, hand2Mat);
    scene.add(hand1Mesh, hand2Mesh);

    const updateForceFromPointer = (ev: PointerEvent) => {
      if (paramsRef.current.cameraActive) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((ev.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const ny = -(((ev.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1);
      const isRepel = paramsRef.current.manualAction === 'repel' || ev.shiftKey;
      attractorsRef.current.h1x = nx * 4.4;
      attractorsRef.current.h1y = ny * 2.8;
      attractorsRef.current.h1Active = true;
      attractorsRef.current.h1Sign = isRepel ? -1 : 1;
      attractorsRef.current.h2x = -nx * 4.4;
      attractorsRef.current.h2y = -ny * 2.8;
      attractorsRef.current.h2Active = isRepel;
      attractorsRef.current.h2Sign = -1;
    };
    renderer.domElement.addEventListener('pointermove', updateForceFromPointer);
    renderer.domElement.addEventListener('pointerdown', updateForceFromPointer);

    const updateBadge = (count: number, action: 'idle' | 'attract' | 'repel') => {
      const key = `${count}:${action}`;
      if (lastBadgeKeyRef.current !== key) {
        lastBadgeKeyRef.current = key;
        setActiveHandsBadge({ count, action });
      }
    };

    let lastHandPoll = 0;
    let lastSimTime = performance.now();
    let elapsedTotal = 0;
    let prevMode: FieldSandboxMode = paramsRef.current.mode;
    let rafId = 0;

    const animate = (now: number) => {
      const dt = Math.min(0.033, Math.max(0.008, (now - lastSimTime) / 1000));
      lastSimTime = now;
      elapsedTotal += dt;

      const cfg = paramsRef.current;
      if (cfg.mode !== prevMode || attractorsRef.current.resetRequested) {
        prevMode = cfg.mode;
        attractorsRef.current.resetRequested = false;
        seedParticles(cfg.mode);
      }

      // Simple 2-Hand Gesture Rule:
      // - 1 hand raised => ATTRACT (HÚT) toward that single hand
      // - 2 hands raised => REPEL (ĐẨY) away from both hands
      // - 0 hands raised => neutral drift (markers hidden)
      if (cfg.cameraActive && videoRef.current && trackerRef.current && now - lastHandPoll > 55) {
        lastHandPoll = now;
        const frame = trackerRef.current.process(videoRef.current, { mirror: true, smoothing: 0.45 });
        const primaryHand = frame.hand1Index || frame.hand2Index;
        const secondaryHand = frame.hand1Index && frame.hand2Index ? frame.hand2Index : null;

        if (frame.detected && frame.handCount >= 2 && primaryHand && secondaryHand) {
          attractorsRef.current.h1x = (primaryHand.x - 0.5) * 8.6;
          attractorsRef.current.h1y = (0.5 - primaryHand.y) * 5.2;
          attractorsRef.current.h1Sign = -1;
          attractorsRef.current.h1Active = true;

          attractorsRef.current.h2x = (secondaryHand.x - 0.5) * 8.6;
          attractorsRef.current.h2y = (0.5 - secondaryHand.y) * 5.2;
          attractorsRef.current.h2Sign = -1;
          attractorsRef.current.h2Active = true;

          updateBadge(2, 'repel');
        } else if (frame.detected && frame.handCount >= 1 && primaryHand) {
          attractorsRef.current.h1x = (primaryHand.x - 0.5) * 8.6;
          attractorsRef.current.h1y = (0.5 - primaryHand.y) * 5.2;
          attractorsRef.current.h1Sign = 1;
          attractorsRef.current.h1Active = true;
          attractorsRef.current.h2Active = false;

          updateBadge(1, 'attract');
        } else {
          attractorsRef.current.h1Active = false;
          attractorsRef.current.h2Active = false;
          updateBadge(0, 'idle');
        }
      }

      const { h1x, h1y, h1z, h1Sign, h1Active, h2x, h2y, h2z, h2Sign, h2Active } = attractorsRef.current;
      hand1Mesh.visible = h1Active;
      hand2Mesh.visible = h2Active;
      hand1Mesh.position.set(h1x, h1y, h1z);
      hand2Mesh.position.set(h2x, h2y, h2z);
      const pulse = 1 + Math.sin(elapsedTotal * 7) * 0.14;
      hand1Mesh.scale.setScalar(h1Sign < 0 ? pulse * 1.25 : pulse);
      hand2Mesh.scale.setScalar(pulse * 1.25);
      hand1Mat.color.setHex(h1Sign > 0 ? 0x22d3ee : 0xf43f5e);
      hand2Mat.color.setHex(0xf97316);

      const strength = cfg.fieldStrength;
      const damp = cfg.damping;
      const B = cfg.bFieldStrength;

      if (cfg.mode === 'binary_gravity' || cfg.mode === 'lorentz_b') {
        mat.uniforms.uModeTint.value.set(cfg.mode === 'lorentz_b' ? '#a855f7' : '#38bdf8');
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          let px = positions[i3];
          let py = positions[i3 + 1];
          let pz = positions[i3 + 2];
          let vx = velocities[i3];
          let vy = velocities[i3 + 1];
          let vz = velocities[i3 + 2];

          let ax = 0;
          let ay = 0;
          let az = 0;

          if (h1Active) {
            const dx1 = h1x - px;
            const dy1 = h1y - py;
            const dz1 = h1z - pz;
            const r1Sq = dx1 * dx1 + dy1 * dy1 + dz1 * dz1 + 0.18;
            const inv1 = (strength * h1Sign * 5.4) / (r1Sq * Math.sqrt(r1Sq));
            ax += dx1 * inv1;
            ay += dy1 * inv1;
            az += dz1 * inv1;
          }

          if (h2Active) {
            const dx2 = h2x - px;
            const dy2 = h2y - py;
            const dz2 = h2z - pz;
            const r2Sq = dx2 * dx2 + dy2 * dy2 + dz2 * dz2 + 0.18;
            const inv2 = (strength * h2Sign * 5.4) / (r2Sq * Math.sqrt(r2Sq));
            ax += dx2 * inv2;
            ay += dy2 * inv2;
            az += dz2 * inv2;
          }

          if (cfg.mode === 'lorentz_b') {
            // F_B = q (v x B_z)
            ax += vy * B * 2.2;
            ay += -vx * B * 2.2;
          }

          vx = (vx + ax * dt) * damp;
          vy = (vy + ay * dt) * damp;
          vz = (vz + az * dt) * damp;

          px += vx * dt;
          py += vy * dt;
          pz += vz * dt;

          if (Math.abs(px) > 7.5 || Math.abs(py) > 5.0) {
            px *= 0.65;
            py *= 0.65;
          }

          positions[i3] = px;
          positions[i3 + 1] = py;
          positions[i3 + 2] = pz;
          velocities[i3] = vx;
          velocities[i3 + 1] = vy;
          velocities[i3 + 2] = vz;
          energies[i] = Math.min(1, Math.hypot(vx, vy, vz) * 0.22);
        }
      } else if (cfg.mode === 'wave_interference') {
        mat.uniforms.uModeTint.value.set('#2dd4bf');
        const kWave = 4.2 * strength;
        const wFreq = 6.5 * B;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const px = positions[i3];
          const py = positions[i3 + 1];
          let amp = 0;
          if (h1Active && h2Active) {
            // 2 hands => dual-source outward interfering waves
            const r1 = Math.hypot(px - h1x, py - h1y);
            const r2 = Math.hypot(px - h2x, py - h2y);
            amp = (Math.sin(kWave * r1 - elapsedTotal * wFreq) + Math.sin(kWave * r2 - elapsedTotal * wFreq)) * 0.55;
          } else if (h1Active) {
            // 1 hand => converging suction wave toward the single hand
            const r1 = Math.hypot(px - h1x, py - h1y);
            amp = Math.sin(kWave * r1 + elapsedTotal * wFreq) * 0.65;
          } else {
            amp = Math.sin(px * 1.4 + elapsedTotal * 2.2) * 0.14;
          }
          positions[i3 + 2] = amp;
          energies[i] = Math.abs(amp) * 0.85;
        }
      } else {
        // Rutherford scattering: 1 hand pulls/focuses, 2 hands blast/repel strongly
        mat.uniforms.uModeTint.value.set('#34d399');
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          let px = positions[i3];
          let py = positions[i3 + 1];
          let vx = velocities[i3];
          let vy = velocities[i3 + 1];

          if (h1Active) {
            const dx1 = px - h1x;
            const dy1 = py - h1y;
            const r1Sq = dx1 * dx1 + dy1 * dy1 + 0.08;
            // h1Sign = +1 (attract toward hand), h1Sign = -1 (repel away from hand)
            const f1 = (-h1Sign * strength * 3.8) / (r1Sq * Math.sqrt(r1Sq));
            vx += dx1 * f1 * dt;
            vy += dy1 * f1 * dt;
          }

          if (h2Active) {
            const dx2 = px - h2x;
            const dy2 = py - h2y;
            const r2Sq = dx2 * dx2 + dy2 * dy2 + 0.08;
            const f2 = (-h2Sign * strength * 3.8) / (r2Sq * Math.sqrt(r2Sq));
            vx += dx2 * f2 * dt;
            vy += dy2 * f2 * dt;
          }

          px += vx * dt;
          py += vy * dt;

          if (px > 6.5 || px < -10.5 || Math.abs(py) > 4.5) {
            px = -6.0 - Math.random() * 2.5;
            py = (Math.random() - 0.5) * 4.4;
            vx = 3.2 + Math.random() * 0.8;
            vy = 0;
          }
          positions[i3] = px;
          positions[i3 + 1] = py;
          velocities[i3] = vx;
          velocities[i3 + 1] = vy;
          energies[i] = Math.min(1, Math.abs(vy) * 0.35 + 0.15);
        }
      }

      posAttr.needsUpdate = true;
      energyAttr.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      const w = Math.max(300, mount.clientWidth);
      const h = Math.max(300, mount.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    if (resizeObserver) resizeObserver.observe(mount);
    window.addEventListener('resize', handleResize);
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('pointermove', updateForceFromPointer);
      renderer.domElement.removeEventListener('pointerdown', updateForceFromPointer);
      controls.dispose();
      geo.dispose();
      mat.dispose();
      handGeo.dispose();
      hand1Mat.dispose();
      hand2Mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const badgeToneClass = cameraActive
    ? activeHandsBadge.action === 'attract'
      ? 'border-cyan-400/80 text-cyan-200'
      : activeHandsBadge.action === 'repel'
      ? 'border-rose-400/80 text-rose-200'
      : 'border-slate-700 text-slate-200'
    : manualAction === 'repel'
    ? 'border-rose-400/70 text-rose-200'
    : 'border-cyan-400/70 text-cyan-200';

  return (
    <div className="space-y-3">
      {/* Top Mode Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 sm:p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'binary_gravity', vi: 'Hấp dẫn Hạt', en: 'Gravity Field', icon: Orbit },
              { id: 'lorentz_b', vi: 'Từ trường Lorentz', en: 'Lorentz Magnetic', icon: Magnet },
              { id: 'wave_interference', vi: 'Giao thoa Sóng', en: 'Wave Field', icon: Waves },
              { id: 'rutherford_scatter', vi: 'Tán xạ Alpha', en: 'Rutherford Scatter', icon: Sparkles }
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                  mode === item.id
                    ? 'bg-sky-600 border-sky-500 text-white'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{isEn ? item.en : item.vi}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!cameraActive && (
            <div className="inline-flex rounded-md border border-slate-300 dark:border-slate-700 overflow-hidden">
              <button
                type="button"
                onClick={() => handleManualActionChange('attract')}
                className={`min-h-[36px] px-2.5 py-1.5 text-xs font-bold cursor-pointer ${
                  manualAction === 'attract'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isEn ? '1-Pt Attract' : '1 Tâm Hút'}
              </button>
              <button
                type="button"
                onClick={() => handleManualActionChange('repel')}
                className={`min-h-[36px] px-2.5 py-1.5 text-xs font-bold cursor-pointer ${
                  manualAction === 'repel'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isEn ? '2-Pt Repel' : '2 Tâm Đẩy'}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={toggleCamera}
            className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
              cameraActive
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-transparent'
            }`}
          >
            {cameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
            <span>
              {cameraActive
                ? isEn
                  ? 'Stop Hand Cam'
                  : 'Tắt Webcam Tay'
                : isEn
                ? 'Enable Hand Cam'
                : 'Bật Điều Khiển Tay'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              attractorsRef.current.resetRequested = true;
            }}
            className="min-h-[36px] min-w-[36px] p-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer flex items-center justify-center"
            title={isEn ? 'Reset Particles' : 'Khởi tạo lại trường hạt'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Stage with Docked Translucent-Free Bottom Control Strip */}
      <div className="relative rounded-xl overflow-hidden border border-sky-500/40 bg-[#050914] h-[360px] sm:h-[460px] lg:h-[520px]">
        <div ref={mountRef} className="w-full h-full" />

        {/* Webcam PIP preview when active */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute top-2.5 right-2.5 w-24 h-20 sm:w-36 sm:h-27 rounded border border-cyan-400/60 object-cover -scale-x-100 bg-slate-950 ${
            cameraActive ? 'block' : 'hidden'
          }`}
        />

        {/* Top-left Instruction / Active Mode Badge */}
        <div
          className={`pointer-events-none absolute top-2.5 left-2.5 px-2.5 sm:px-3 py-1.5 rounded bg-slate-950/90 border text-[11px] font-mono flex items-center gap-1.5 sm:gap-2 ${
            cameraActive ? 'max-w-[calc(100%-120px)] sm:max-w-[70%]' : 'max-w-[calc(100%-20px)]'
          } ${badgeToneClass}`}
        >
          <Hand className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate sm:whitespace-normal">
            {cameraActive
              ? activeHandsBadge.count === 1
                ? isEn
                  ? '1 hand · ATTRACTING particles'
                  : 'Giơ 1 tay · ĐANG HÚT HẠT'
                : activeHandsBadge.count >= 2
                ? isEn
                  ? '2 hands · REPELLING particles'
                  : 'Giơ 2 tay · ĐANG ĐẨY HẠT'
                : isEn
                ? '0 hands · Raise 1 hand = Attract · 2 hands = Repel'
                : '0 tay · Giơ 1 tay = HÚT · 2 tay = ĐẨY'
              : manualAction === 'repel'
              ? isEn
                ? 'Touch / Cursor: 2-Point REPEL · Drag to orbit'
                : 'Chuột / Chạm: 2 Tâm ĐẨY HẠT · Kéo xoay 3D'
              : isEn
              ? 'Touch / Cursor: 1-Point ATTRACT (Hold Shift = Repel)'
              : 'Chuột / Chạm: 1 Tâm HÚT HẠT (Giữ Shift = Đẩy 2 tâm)'}
          </span>
        </div>

        {/* Collapsible Bottom Control Dock (solid dark, zero backdrop-blur) */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/94 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono font-bold text-cyan-300 text-[10px] sm:text-[11px] uppercase truncate">
              {isEn ? 'GPU SANDBOX · 1 HAND = ATTRACT · 2 HANDS = REPEL' : 'SANDBOX HẠT GPU · 1 TAY HÚT · 2 TAY ĐẨY'}
            </span>
            <button
              type="button"
              onClick={() => setHudExpanded((v) => !v)}
              className="min-h-[30px] text-slate-300 hover:text-white flex items-center gap-1 text-[11px] font-bold cursor-pointer shrink-0"
            >
              <span>{hudExpanded ? (isEn ? 'Collapse' : 'Thu gọn') : isEn ? 'Expand' : 'Mở thông số'}</span>
              {hudExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
          {hudExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-2 pt-2 border-t border-slate-800">
              <label className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">{isEn ? 'Field Intensity' : 'Cường độ lực trường'}</span>
                  <span className="font-mono font-bold text-cyan-300">{fieldStrength.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0.3}
                  max={2.8}
                  step={0.05}
                  value={fieldStrength}
                  onChange={(e) => setFieldStrength(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </label>
              <label className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">{isEn ? 'Magnetic / Freq B' : 'Từ cảm B / Tần số sóng'}</span>
                  <span className="font-mono font-bold text-purple-300">{bFieldStrength.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={2.5}
                  step={0.05}
                  value={bFieldStrength}
                  onChange={(e) => setBFieldStrength(Number(e.target.value))}
                  className="w-full accent-purple-400"
                />
              </label>
              <label className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">{isEn ? 'Velocity Damping' : 'Độ giữ quán tính'}</span>
                  <span className="font-mono font-bold text-emerald-300">{damping.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min={0.92}
                  max={0.999}
                  step={0.002}
                  value={damping}
                  onChange={(e) => setDamping(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
