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
  const [fieldStrength, setFieldStrength] = useState(1.35);
  const [bFieldStrength, setBFieldStrength] = useState(1.15);
  const [damping, setDamping] = useState(0.982);
  const [cameraActive, setCameraActive] = useState(false);
  const [hudExpanded, setHudExpanded] = useState(true);
  const [activeHandsBadge, setActiveHandsBadge] = useState<{
    count: number;
    action: 'idle' | 'attract' | 'repel' | 'bipolar';
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
    h1vx: 0,
    h1vy: 0,
    h1Sign: 1,
    h1Active: true,
    h2x: 1.8,
    h2y: -0.2,
    h2z: 0,
    h2vx: 0,
    h2vy: 0,
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
      attractorsRef.current.h1vx = 0;
      attractorsRef.current.h1vy = 0;
      attractorsRef.current.h2vx = 0;
      attractorsRef.current.h2vy = 0;
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
    const particleCount = isSoftwareGl ? 3600 : 26000;

    const width = Math.max(300, mount.clientWidth);
    const height = Math.max(300, mount.clientHeight);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050914);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 8.8);

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
    const basePositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const energies = new Float32Array(particleCount);

    const seedParticles = (currentMode: FieldSandboxMode) => {
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        if (currentMode === 'wave_interference') {
          const cols = Math.floor(Math.sqrt(particleCount));
          const row = Math.floor(i / cols);
          const col = i % cols;
          const bx = ((col / cols) - 0.5) * 9.6;
          const by = ((row / cols) - 0.5) * 5.8;
          positions[i3] = bx;
          positions[i3 + 1] = by;
          positions[i3 + 2] = 0;
          basePositions[i3] = bx;
          basePositions[i3 + 1] = by;
          basePositions[i3 + 2] = 0;
          velocities[i3] = 0;
          velocities[i3 + 1] = 0;
          velocities[i3 + 2] = 0;
        } else if (currentMode === 'rutherford_scatter') {
          positions[i3] = -5.5 + Math.random() * 10.5;
          positions[i3 + 1] = (Math.random() - 0.5) * 4.6;
          positions[i3 + 2] = (Math.random() - 0.5) * 1.4;
          velocities[i3] = 3.0 + Math.random() * 0.9;
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.25;
          velocities[i3 + 2] = 0;
        } else {
          const ang = Math.random() * Math.PI * 2;
          const r = 0.4 + Math.random() * 4.3;
          positions[i3] = Math.cos(ang) * r;
          positions[i3 + 1] = (Math.random() - 0.5) * 3.0;
          positions[i3 + 2] = Math.sin(ang) * r * 0.35;
          velocities[i3] = -Math.sin(ang) * 0.95;
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.4;
          velocities[i3 + 2] = Math.cos(ang) * 0.45;
        }
        energies[i] = 0.25;
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
        uPointSize: { value: isSoftwareGl ? 7.2 : 4.8 },
        uModeTint: { value: new THREE.Color('#38bdf8') }
      },
      vertexShader: `
        attribute float aEnergy;
        varying float vEnergy;
        uniform float uPointSize;
        void main() {
          vEnergy = clamp(aEnergy, 0.0, 1.0);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uPointSize * (6.2 / max(1.0, -mvPos.z));
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
          vec3 hot = vec3(1.0, 0.76, 0.26);
          vec3 col = mix(uModeTint, hot, vEnergy);
          gl_FragColor = vec4(col, alpha * 0.9);
        }
      `
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Hand Force Sphere Markers + Halo Rings
    const handGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const ringGeo = new THREE.RingGeometry(0.32, 0.40, 32);
    const hand1Mat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true });
    const hand2Mat = new THREE.MeshBasicMaterial({ color: 0xf97316, wireframe: true });
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xf97316, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const hand1Mesh = new THREE.Mesh(handGeo, hand1Mat);
    const hand2Mesh = new THREE.Mesh(handGeo, hand2Mat);
    const ring1Mesh = new THREE.Mesh(ringGeo, ring1Mat);
    const ring2Mesh = new THREE.Mesh(ringGeo, ring2Mat);
    hand1Mesh.add(ring1Mesh);
    hand2Mesh.add(ring2Mesh);
    scene.add(hand1Mesh, hand2Mesh);

    const updateForceFromPointer = (ev: PointerEvent) => {
      if (paramsRef.current.cameraActive) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((ev.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const ny = -(((ev.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1);
      const isRepel = paramsRef.current.manualAction === 'repel' || ev.shiftKey;

      const targetX = nx * 4.8;
      const targetY = ny * 3.0;
      const a = attractorsRef.current;
      a.h1vx = Math.max(-18, Math.min(18, (targetX - a.h1x) * 14));
      a.h1vy = Math.max(-18, Math.min(18, (targetY - a.h1y) * 14));
      a.h1x = targetX;
      a.h1y = targetY;
      a.h1Active = true;
      a.h1Sign = isRepel ? -1 : 1;

      const target2X = -targetX;
      const target2Y = -targetY;
      a.h2vx = Math.max(-18, Math.min(18, (target2X - a.h2x) * 14));
      a.h2vy = Math.max(-18, Math.min(18, (target2Y - a.h2y) * 14));
      a.h2x = target2X;
      a.h2y = target2Y;
      a.h2Active = isRepel;
      a.h2Sign = -1;
    };
    renderer.domElement.addEventListener('pointermove', updateForceFromPointer);
    renderer.domElement.addEventListener('pointerdown', updateForceFromPointer);

    const updateBadge = (count: number, action: 'idle' | 'attract' | 'repel' | 'bipolar') => {
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

      // Decay manual pointer velocity smoothly each frame
      if (!cfg.cameraActive) {
        attractorsRef.current.h1vx *= 0.88;
        attractorsRef.current.h1vy *= 0.88;
        attractorsRef.current.h2vx *= 0.88;
        attractorsRef.current.h2vy *= 0.88;
      }

      // 2-Hand Gesture Tracking:
      // - 1 hand raised => ATTRACT & VORTEX toward that single hand (+ wake velocity)
      // - 2 hands raised =>
      //     * Both open: REPEL + Dual-Vortex Swirl + Bipolar Flux + Wake Sweep
      //     * Pinch on 1 hand: Pinching hand ATTRACTS (+1), open hand REPELS (-1) -> Bipolar Bridge!
      //     * Both pinch: Dual Attracting Galaxies
      if (cfg.cameraActive && videoRef.current && trackerRef.current && now - lastHandPoll > 40) {
        const pollDt = Math.max(0.025, (now - lastHandPoll) / 1000);
        lastHandPoll = now;
        const frame = trackerRef.current.process(videoRef.current, {
          mirror: true,
          smoothing: 0.35,
          minimalControlMode: false,
          stabilityFrames: 1,
          gestureHoldMs: 40
        });
        const primaryHand = frame.hand1Index || frame.hand2Index;
        const secondaryHand = frame.hand1Index && frame.hand2Index ? frame.hand2Index : null;
        const a = attractorsRef.current;

        if (frame.detected && frame.handCount >= 2 && primaryHand && secondaryHand) {
          const nx1 = (primaryHand.x - 0.5) * 9.6;
          const ny1 = (0.5 - primaryHand.y) * 5.8;
          const nx2 = (secondaryHand.x - 0.5) * 9.6;
          const ny2 = (0.5 - secondaryHand.y) * 5.8;

          if (a.h1Active) {
            a.h1vx = Math.max(-22, Math.min(22, (nx1 - a.h1x) / pollDt));
            a.h1vy = Math.max(-22, Math.min(22, (ny1 - a.h1y) / pollDt));
          } else {
            a.h1vx = 0;
            a.h1vy = 0;
          }
          if (a.h2Active) {
            a.h2vx = Math.max(-22, Math.min(22, (nx2 - a.h2x) / pollDt));
            a.h2vy = Math.max(-22, Math.min(22, (ny2 - a.h2y) / pollDt));
          } else {
            a.h2vx = 0;
            a.h2vy = 0;
          }

          a.h1x = nx1;
          a.h1y = ny1;
          a.h1Sign = frame.hand1Pinching ? 1 : -1;
          a.h1Active = true;

          a.h2x = nx2;
          a.h2y = ny2;
          a.h2Sign = frame.hand2Pinching ? 1 : -1;
          a.h2Active = true;

          const badgeAction =
            a.h1Sign > 0 && a.h2Sign > 0
              ? 'attract'
              : a.h1Sign !== a.h2Sign
              ? 'bipolar'
              : 'repel';
          updateBadge(2, badgeAction);
        } else if (frame.detected && frame.handCount >= 1 && primaryHand) {
          const nx1 = (primaryHand.x - 0.5) * 9.6;
          const ny1 = (0.5 - primaryHand.y) * 5.8;
          if (a.h1Active) {
            a.h1vx = Math.max(-22, Math.min(22, (nx1 - a.h1x) / pollDt));
            a.h1vy = Math.max(-22, Math.min(22, (ny1 - a.h1y) / pollDt));
          } else {
            a.h1vx = 0;
            a.h1vy = 0;
          }
          a.h1x = nx1;
          a.h1y = ny1;
          a.h1Sign = 1;
          a.h1Active = true;
          a.h2Active = false;
          a.h2vx = 0;
          a.h2vy = 0;

          updateBadge(1, 'attract');
        } else {
          a.h1Active = false;
          a.h2Active = false;
          a.h1vx = 0;
          a.h1vy = 0;
          a.h2vx = 0;
          a.h2vy = 0;
          updateBadge(0, 'idle');
        }
      }

      const {
        h1x,
        h1y,
        h1z,
        h1vx,
        h1vy,
        h1Sign,
        h1Active,
        h2x,
        h2y,
        h2z,
        h2vx,
        h2vy,
        h2Sign,
        h2Active
      } = attractorsRef.current;

      hand1Mesh.visible = h1Active;
      hand2Mesh.visible = h2Active;
      hand1Mesh.position.set(h1x, h1y, h1z);
      hand2Mesh.position.set(h2x, h2y, h2z);
      const pulse = 1 + Math.sin(elapsedTotal * 7) * 0.14;
      hand1Mesh.scale.setScalar(h1Sign < 0 ? pulse * 1.25 : pulse);
      hand2Mesh.scale.setScalar(h2Sign < 0 ? pulse * 1.25 : pulse);
      const h1Hex = h1Sign > 0 ? 0x22d3ee : 0xf43f5e;
      const h2Hex = h2Sign > 0 ? 0x22d3ee : 0xf97316;
      hand1Mat.color.setHex(h1Hex);
      ring1Mat.color.setHex(h1Hex);
      hand2Mat.color.setHex(h2Hex);
      ring2Mat.color.setHex(h2Hex);
      ring1Mesh.rotation.z = elapsedTotal * (h1Sign > 0 ? 2.4 : -2.4);
      ring2Mesh.rotation.z = elapsedTotal * (h2Sign > 0 ? 2.4 : -2.4);

      const strength = cfg.fieldStrength;
      const damp = cfg.damping;
      const B = cfg.bFieldStrength;
      const bothActive = h1Active && h2Active;

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

          // Gentle ambient orbital drift + Z-plane harmonic restoring so particles never stall or drift out of view
          let ax = -py * 0.22 - px * 0.06;
          let ay = px * 0.22 - py * 0.06;
          let az = -pz * 1.65;

          if (h1Active) {
            const dx1 = h1x - px;
            const dy1 = h1y - py;
            const dz1 = h1z - pz;
            // Weight Z lightly so hands at z=0 grip particles across all depth layers strongly
            const r1Sq = dx1 * dx1 + dy1 * dy1 + dz1 * dz1 * 0.16 + 0.24;
            const r1 = Math.sqrt(r1Sq);
            // Core soft repulsion if attracting too tightly inside r < 0.42 so particles swirl around hand instead of collapsing
            const radialSign1 = h1Sign > 0 && r1 < 0.48 ? -0.45 : h1Sign;
            const force1 = (strength * radialSign1 * 7.8) / (r1Sq * r1);
            ax += dx1 * force1;
            ay += dy1 * force1;
            az += dz1 * force1 * 0.45;

            // Tangential vortex curl + sweeping hand velocity wake
            const influence1 = Math.exp(-r1Sq * 0.18);
            const swirlDir1 = h1Sign > 0 ? 1 : -1.35;
            ax += -dy1 * influence1 * strength * 4.2 * swirlDir1 + h1vx * influence1 * 2.4;
            ay += dx1 * influence1 * strength * 4.2 * swirlDir1 + h1vy * influence1 * 2.4;
          }

          if (h2Active) {
            const dx2 = h2x - px;
            const dy2 = h2y - py;
            const dz2 = h2z - pz;
            const r2Sq = dx2 * dx2 + dy2 * dy2 + dz2 * dz2 * 0.16 + 0.24;
            const r2 = Math.sqrt(r2Sq);
            const radialSign2 = h2Sign > 0 && r2 < 0.48 ? -0.45 : h2Sign;
            const force2 = (strength * radialSign2 * 7.8) / (r2Sq * r2);
            ax += dx2 * force2;
            ay += dy2 * force2;
            az += dz2 * force2 * 0.45;

            const influence2 = Math.exp(-r2Sq * 0.18);
            // Opposite swirl chirality between Hand 1 & Hand 2 creates vibrant dual-hand eddies & avoids dead-zone cancellation!
            const swirlDir2 = h2Sign > 0 ? -1 : 1.35;
            ax += -dy2 * influence2 * strength * 4.2 * swirlDir2 + h2vx * influence2 * 2.4;
            ay += dx2 * influence2 * strength * 4.2 * swirlDir2 + h2vy * influence2 * 2.4;
          }

          // When 2 hands are both active, add a live dipolar stream between them so the mid-zone constantly churns
          if (bothActive) {
            const bdx = h2x - h1x;
            const bdy = h2y - h1y;
            const bLen = Math.hypot(bdx, bdy) + 0.25;
            const midX = (h1x + h2x) * 0.5;
            const midY = (h1y + h2y) * 0.5;
            const midSq = (px - midX) * (px - midX) + (py - midY) * (py - midY) + 0.6;
            const flux = Math.exp(-midSq * 0.22) * strength * 3.4;
            ax += (bdx / bLen) * flux;
            ay += (bdy / bLen) * flux;
          }

          if (cfg.mode === 'lorentz_b') {
            ax += vy * B * 2.35;
            ay += -vx * B * 2.35;
          }

          vx = (vx + ax * dt) * damp;
          vy = (vy + ay * dt) * damp;
          vz = (vz + az * dt) * damp;

          // Cap runaway velocity cleanly
          const speedSq = vx * vx + vy * vy + vz * vz;
          if (speedSq > 144) {
            const scale = 12 / Math.sqrt(speedSq);
            vx *= scale;
            vy *= scale;
            vz *= scale;
          }

          px += vx * dt;
          py += vy * dt;
          pz += vz * dt;

          // Soft viewport boundary containment so all 3 axes bounce smoothly & stay inside camera frustum
          if (px > 6.2) {
            px = 6.2;
            vx = -Math.abs(vx) * 0.7;
          } else if (px < -6.2) {
            px = -6.2;
            vx = Math.abs(vx) * 0.7;
          }
          if (py > 3.7) {
            py = 3.7;
            vy = -Math.abs(vy) * 0.7;
          } else if (py < -3.7) {
            py = -3.7;
            vy = Math.abs(vy) * 0.7;
          }
          if (pz > 2.2) {
            pz = 2.2;
            vz = -Math.abs(vz) * 0.7;
          } else if (pz < -2.2) {
            pz = -2.2;
            vz = Math.abs(vz) * 0.7;
          }

          positions[i3] = px;
          positions[i3 + 1] = py;
          positions[i3 + 2] = pz;
          velocities[i3] = vx;
          velocities[i3 + 1] = vy;
          velocities[i3 + 2] = vz;
          energies[i] = Math.min(1, Math.hypot(vx, vy, vz) * 0.24);
        }
      } else if (cfg.mode === 'wave_interference') {
        mat.uniforms.uModeTint.value.set('#2dd4bf');
        const kWave = 4.2 * strength;
        const wFreq = 6.8 * B;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const bx = basePositions[i3];
          const by = basePositions[i3 + 1];
          let amp = 0;
          let dispX = 0;
          let dispY = 0;
          if (h1Active && h2Active) {
            const dx1 = bx - h1x;
            const dy1 = by - h1y;
            const r1 = Math.hypot(dx1, dy1) + 0.001;
            const dx2 = bx - h2x;
            const dy2 = by - h2y;
            const r2 = Math.hypot(dx2, dy2) + 0.001;
            const w1 = Math.sin(kWave * r1 - elapsedTotal * wFreq);
            const w2 = Math.sin(kWave * r2 - elapsedTotal * wFreq);
            amp = (w1 + w2) * 0.58;
            dispX = (dx1 / r1) * w1 * 0.14 + (dx2 / r2) * w2 * 0.14;
            dispY = (dy1 / r1) * w1 * 0.14 + (dy2 / r2) * w2 * 0.14;
          } else if (h1Active) {
            const dx1 = bx - h1x;
            const dy1 = by - h1y;
            const r1 = Math.hypot(dx1, dy1) + 0.001;
            const w1 = Math.sin(kWave * r1 + elapsedTotal * wFreq);
            amp = w1 * 0.7;
            dispX = (dx1 / r1) * w1 * 0.18;
            dispY = (dy1 / r1) * w1 * 0.18;
          } else {
            const w0 = Math.sin(bx * 1.4 + elapsedTotal * 2.4);
            amp = w0 * 0.18;
            dispY = w0 * 0.05;
          }
          positions[i3] = bx + dispX;
          positions[i3 + 1] = by + dispY;
          positions[i3 + 2] = amp;
          energies[i] = Math.min(1, Math.abs(amp) * 0.9);
        }
      } else {
        // Rutherford scattering: 1 hand focuses/swirls, 2 hands blast/deflect & sweep across entire stage
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
            const r1Sq = dx1 * dx1 + dy1 * dy1 + 0.14;
            const f1 = (-h1Sign * strength * 5.2) / (r1Sq * Math.sqrt(r1Sq));
            const inf1 = Math.exp(-r1Sq * 0.25);
            vx += (dx1 * f1 + h1vx * inf1 * 2.2) * dt;
            vy += (dy1 * f1 + h1vy * inf1 * 2.2) * dt;
          }

          if (h2Active) {
            const dx2 = px - h2x;
            const dy2 = py - h2y;
            const r2Sq = dx2 * dx2 + dy2 * dy2 + 0.14;
            const f2 = (-h2Sign * strength * 5.2) / (r2Sq * Math.sqrt(r2Sq));
            const inf2 = Math.exp(-r2Sq * 0.25);
            vx += (dx2 * f2 + h2vx * inf2 * 2.2) * dt;
            vy += (dy2 * f2 + h2vy * inf2 * 2.2) * dt;
          }

          px += vx * dt;
          py += vy * dt;

          if (px > 6.5 || px < -7.5 || Math.abs(py) > 4.2) {
            px = -6.0 - Math.random() * 1.4;
            py = (Math.random() - 0.5) * 4.4;
            vx = 3.2 + Math.random() * 0.8;
            vy = 0;
          }
          positions[i3] = px;
          positions[i3 + 1] = py;
          velocities[i3] = vx;
          velocities[i3 + 1] = vy;
          energies[i] = Math.min(1, Math.abs(vy) * 0.35 + 0.18);
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
      ringGeo.dispose();
      hand1Mat.dispose();
      hand2Mat.dispose();
      ring1Mat.dispose();
      ring2Mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const badgeToneClass = cameraActive
    ? activeHandsBadge.action === 'attract'
      ? 'border-cyan-400/80 text-cyan-200'
      : activeHandsBadge.action === 'bipolar'
      ? 'border-amber-400/80 text-amber-200'
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
                {isEn ? '2-Pt Repel' : '2 Tâm Đẩy/Xoáy'}
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
                  ? '1 hand · ATTRACT & SWIRL particles (wave hand to sweep)'
                  : '1 tay · HÚT & XOÁY HẠT (vẫy tay để quét dòng hạt)'
                : activeHandsBadge.count >= 2
                ? activeHandsBadge.action === 'bipolar'
                  ? isEn
                    ? '2 hands · BIPOLAR STREAM (Pinch attracts, Open repels)'
                    : '2 tay · CẦU LƯỠNG CỰC (Chụm ngón HÚT · Mở tay ĐẨY)'
                  : activeHandsBadge.action === 'attract'
                  ? isEn
                    ? '2 hands PINCH · DUAL GALAXY ATTRACTORS'
                    : '2 tay CHỤM · HÚT XOÁY HAI THIÊN HÀ'
                  : isEn
                  ? '2 hands · REPEL, VORTEX & WAKE SWEEP (Pinch any hand to Attract)'
                  : '2 tay · ĐẨY XOÁY & CUỐN SÓNG (Chụm ngón tay bất kỳ để Hút)'
                : isEn
                ? '0 hands · Raise 1 hand = Attract · 2 hands = Swirl/Repel'
                : '0 tay · Giơ 1 tay = HÚT · 2 tay = ĐẨY & XOÁY HẠT'
              : manualAction === 'repel'
              ? isEn
                ? 'Touch / Cursor: 2-Point REPEL + VORTEX · Drag to orbit'
                : 'Chuột / Chạm: 2 Tâm ĐẨY & XOÁY HẠT · Kéo xoay 3D'
              : isEn
              ? 'Touch / Cursor: 1-Point ATTRACT (Hold Shift = 2-Point Repel)'
              : 'Chuột / Chạm: 1 Tâm HÚT HẠT (Giữ Shift = Đẩy xoáy 2 tâm)'}
          </span>
        </div>

        {/* Collapsible Bottom Control Dock (solid dark, zero backdrop-blur) */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/94 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono font-bold text-cyan-300 text-[10px] sm:text-[11px] uppercase truncate">
              {isEn
                ? 'GPU SANDBOX · 1 HAND = ATTRACT · 2 HANDS = SWIRL/REPEL · PINCH = PULL'
                : 'SANDBOX HẠT GPU · 1 TAY HÚT · 2 TAY ĐẨY & XOÁY · CHỤM NGÓN = HÚT MẠNH'}
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
