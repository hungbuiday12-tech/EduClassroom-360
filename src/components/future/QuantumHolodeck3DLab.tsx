import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Atom, Cpu, Play, RotateCcw, Sparkles, Volume2, VolumeX, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface QuantumHolodeck3DLabProps {
  onEarnXP?: (xp: number) => void;
}

interface Complex {
  re: number;
  im: number;
}

interface QubitState {
  a: Complex; // |0>
  b: Complex; // |1>
  entangled: boolean;
  bellMode: 'none' | 'phi_plus' | 'teleport';
  lastGate: string;
}

const cAdd = (x: Complex, y: Complex): Complex => ({ re: x.re + y.re, im: x.im + y.im });
const cSub = (x: Complex, y: Complex): Complex => ({ re: x.re - y.re, im: x.im - y.im });
const cMul = (x: Complex, y: Complex): Complex => ({
  re: x.re * y.re - x.im * y.im,
  im: x.re * y.im + x.im * y.re
});
const cAbs2 = (x: Complex) => x.re * x.re + x.im * x.im;

const INV_SQRT2 = 1 / Math.SQRT2;

function blochFromState(s: QubitState) {
  // Normalize & strip global phase from |0>
  const magA = Math.sqrt(cAbs2(s.a));
  const magB = Math.sqrt(cAbs2(s.b));
  const norm = Math.hypot(magA, magB) || 1;
  const p0 = (magA / norm) ** 2;
  const p1 = (magB / norm) ** 2;
  const theta = 2 * Math.acos(Math.min(1, Math.max(0, magA / norm)));
  let phi = 0;
  if (magA > 1e-5 && magB > 1e-5) {
    const phaseA = Math.atan2(s.a.im, s.a.re);
    const phaseB = Math.atan2(s.b.im, s.b.re);
    phi = phaseB - phaseA;
  } else if (magB > 1e-5) {
    phi = Math.atan2(s.b.im, s.b.re);
  }
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.cos(theta); // Three.js Y-up = |0> (+Y), |1> (-Y)
  const z = Math.sin(theta) * Math.sin(phi);
  return { x, y, z, theta, phi, p0, p1 };
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

const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _mat4 = new THREE.Matrix4();
const _col = new THREE.Color();

export const QuantumHolodeck3DLab: React.FC<QuantumHolodeck3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const mountRef = useRef<HTMLDivElement | null>(null);
  const [qubit, setQubit] = useState<QubitState>({
    a: { re: INV_SQRT2, im: 0 },
    b: { re: INV_SQRT2, im: 0 },
    entangled: true,
    bellMode: 'phi_plus',
    lastGate: 'H + CNOT (Bell)'
  });
  const [gateHistory, setGateHistory] = useState<string[]>(['|0⟩', 'H', 'CNOT']);
  const [counts, setCounts] = useState<{ k00: number; k01: number; k10: number; k11: number }>({
    k00: 12,
    k01: 0,
    k10: 0,
    k11: 12
  });
  const [lastMeasure, setLastMeasure] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [showCryostat, setShowCryostat] = useState<boolean>(true);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);

  const bloch = useMemo(() => blochFromState(qubit), [qubit]);
  const stateRef = useRef({ bloch, entangled: qubit.entangled, showCryostat, collapseFlash: 0 });
  stateRef.current.bloch = bloch;
  stateRef.current.entangled = qubit.entangled;
  stateRef.current.showCryostat = showCryostat;

  const playQuantumTone = useCallback(
    (freq: number, dur = 0.16) => {
      if (!soundOn || typeof window === 'undefined') return;
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.28, ctx.currentTime + dur);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
        setTimeout(() => {
          try {
            ctx.close();
          } catch {}
        }, (dur + 0.08) * 1000);
      } catch {}
    },
    [soundOn]
  );

  const applyGate = useCallback(
    (gate: 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'CNOT' | 'RESET') => {
      setQubit((prev) => {
        let nextA = prev.a;
        let nextB = prev.b;
        let entangled = prev.entangled;
        let bellMode = prev.bellMode;

        if (gate === 'RESET') {
          return {
            a: { re: 1, im: 0 },
            b: { re: 0, im: 0 },
            entangled: false,
            bellMode: 'none',
            lastGate: 'RESET |0⟩'
          };
        }
        if (gate === 'H') {
          nextA = { re: (prev.a.re + prev.b.re) * INV_SQRT2, im: (prev.a.im + prev.b.im) * INV_SQRT2 };
          nextB = { re: (prev.a.re - prev.b.re) * INV_SQRT2, im: (prev.a.im - prev.b.im) * INV_SQRT2 };
        } else if (gate === 'X') {
          nextA = prev.b;
          nextB = prev.a;
        } else if (gate === 'Y') {
          nextA = { re: prev.b.im, im: -prev.b.re };
          nextB = { re: -prev.a.im, im: prev.a.re };
        } else if (gate === 'Z') {
          nextB = { re: -prev.b.re, im: -prev.b.im };
        } else if (gate === 'S') {
          nextB = cMul(prev.b, { re: 0, im: 1 });
        } else if (gate === 'T') {
          nextB = cMul(prev.b, { re: INV_SQRT2, im: INV_SQRT2 });
        } else if (gate === 'CNOT') {
          entangled = !prev.entangled || cAbs2(prev.b) > 0.05;
          bellMode = entangled ? 'phi_plus' : 'none';
        }
        return {
          a: nextA,
          b: nextB,
          entangled,
          bellMode,
          lastGate: gate
        };
      });
      setGateHistory((h) => (gate === 'RESET' ? ['|0⟩'] : [...h.slice(-9), gate]));
      playQuantumTone(gate === 'CNOT' ? 660 : gate === 'H' ? 528 : 440);
      onEarnXP?.(4);
    },
    [onEarnXP, playQuantumTone]
  );

  const loadPreset = useCallback(
    (preset: 'superposition' | 'bell' | 'teleport' | 'grover') => {
      if (preset === 'superposition') {
        setQubit({
          a: { re: INV_SQRT2, im: 0 },
          b: { re: INV_SQRT2, im: 0 },
          entangled: false,
          bellMode: 'none',
          lastGate: 'H → |+⟩'
        });
        setGateHistory(['|0⟩', 'H']);
      } else if (preset === 'bell') {
        setQubit({
          a: { re: INV_SQRT2, im: 0 },
          b: { re: INV_SQRT2, im: 0 },
          entangled: true,
          bellMode: 'phi_plus',
          lastGate: 'Bell |Φ+⟩'
        });
        setGateHistory(['|00⟩', 'H(q0)', 'CNOT(q0,q1)']);
      } else if (preset === 'teleport') {
        setQubit({
          a: { re: Math.cos(0.45), im: 0 },
          b: { re: Math.sin(0.45) * Math.cos(0.9), im: Math.sin(0.45) * Math.sin(0.9) },
          entangled: true,
          bellMode: 'teleport',
          lastGate: 'Quantum Teleport'
        });
        setGateHistory(['|ψ⟩', 'Bell', 'CNOT', 'H', 'Tele-Z/X']);
      } else {
        setQubit({
          a: { re: 0.35, im: 0 },
          b: { re: -0.9367, im: 0 },
          entangled: true,
          bellMode: 'phi_plus',
          lastGate: 'Grover Oracle'
        });
        setGateHistory(['H⊗n', 'Oracle(-1)', 'Diffusion']);
      }
      playQuantumTone(587);
    },
    [playQuantumTone]
  );

  const measureQuantum = useCallback(
    (shots: number) => {
      const p1 = bloch.p1;
      let n00 = 0;
      let n01 = 0;
      let n10 = 0;
      let n11 = 0;
      let lastRes = '00';
      for (let i = 0; i < shots; i++) {
        const r = Math.random();
        const q0 = r < p1 ? 1 : 0;
        const q1 = qubit.entangled ? q0 : Math.random() < 0.12 ? 1 : 0;
        lastRes = `${q0}${q1}`;
        if (lastRes === '00') n00++;
        else if (lastRes === '01') n01++;
        else if (lastRes === '10') n10++;
        else n11++;
      }
      setCounts((prev) => ({
        k00: shots === 1 ? prev.k00 + n00 : n00,
        k01: shots === 1 ? prev.k01 + n01 : n01,
        k10: shots === 1 ? prev.k10 + n10 : n10,
        k11: shots === 1 ? prev.k11 + n11 : n11
      }));
      setLastMeasure(`|${lastRes}⟩`);
      stateRef.current.collapseFlash = 1.0;

      if (shots === 1) {
        const collapsedToOne = lastRes.startsWith('1');
        setQubit((prev) => ({
          ...prev,
          a: collapsedToOne ? { re: 0, im: 0 } : { re: 1, im: 0 },
          b: collapsedToOne ? { re: 1, im: 0 } : { re: 0, im: 0 },
          lastGate: `Measure → |${lastRes}⟩`
        }));
      }
      playQuantumTone(lastRes === '11' ? 740 : 392, 0.24);
      onEarnXP?.(8);
    },
    [bloch.p1, onEarnXP, playQuantumTone, qubit.entangled]
  );

  // Initialize Three.js WebGL Stage
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const softwareGl = isSoftwareWebGL();
    const w = mount.clientWidth || 860;
    const h = mount.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040816);
    scene.fog = new THREE.FogExp2(0x040816, 0.032);

    const camera = new THREE.PerspectiveCamera(44, w / h, 0.1, 120);
    camera.position.set(0.4, 2.7, 7.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: !softwareGl,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(softwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = !softwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmrem.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !softwareGl;
    controls.dampingFactor = 0.07;
    controls.target.set(0, 1.3, 0);
    controls.minDistance = 4.0;
    controls.maxDistance = 16;

    const hemi = new THREE.HemisphereLight(0x93c5fd, 0x090d1e, 1.0);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.0);
    keyLight.position.set(5, 9, 6);
    keyLight.castShadow = !softwareGl;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Ground holographic floor grid
    const grid = new THREE.GridHelper(18, 24, 0x22d3ee, 0x162447);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.34;
    grid.position.y = -0.9;
    scene.add(grid);

    // 1. Cryogenic Dilution Refrigerator Chandelier (Composite 8-part Gold/Copper Assembly)
    const cryostatGroup = new THREE.Group();
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      metalness: 0.94,
      roughness: 0.16,
      anisotropy: 0.7
    });
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xc26a3d,
      metalness: 0.85,
      roughness: 0.25
    });
    const plateRadii = [2.25, 1.85, 1.48, 1.15];
    const plateYs = [3.95, 3.45, 2.98, 2.55];
    plateRadii.forEach((r, idx) => {
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.06, 40), goldMat);
      plate.position.y = plateYs[idx];
      cryostatGroup.add(plate);
      if (idx < plateRadii.length - 1) {
        for (let k = 0; k < 6; k++) {
          const ang = (k / 6) * Math.PI * 2;
          const rod = new THREE.Mesh(
            new THREE.CylinderGeometry(0.026, 0.026, plateYs[idx] - plateYs[idx + 1], 10),
            copperMat
          );
          rod.position.set(
            Math.cos(ang) * plateRadii[idx + 1] * 0.84,
            (plateYs[idx] + plateYs[idx + 1]) * 0.5,
            Math.sin(ang) * plateRadii[idx + 1] * 0.84
          );
          cryostatGroup.add(rod);
        }
      }
    });
    // Bottom optical pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.75, 2.1, 0.24, 48),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.72, roughness: 0.28 })
    );
    pedestal.position.y = -0.78;
    cryostatGroup.add(pedestal);
    scene.add(cryostatGroup);

    // 2. Main Bloch Sphere (Qubit A) on Left-Center
    const blochGroup = new THREE.Group();
    blochGroup.position.set(-1.35, 1.15, 0);
    scene.add(blochGroup);

    const sphereGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.08,
      roughness: 0.12,
      transmission: softwareGl ? 0 : 0.72,
      transparent: true,
      opacity: softwareGl ? 0.26 : 0.9,
      ior: 1.48,
      depthWrite: false
    });
    const blochGlass = new THREE.Mesh(new THREE.SphereGeometry(1.42, 36, 28), sphereGlassMat);
    blochGlass.renderOrder = 3;
    blochGroup.add(blochGlass);

    const blochWire = new THREE.Mesh(
      new THREE.SphereGeometry(1.425, 18, 12),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.16 })
    );
    blochGroup.add(blochWire);

    // Equator + Meridian Rings
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const eqRing = new THREE.Mesh(new THREE.TorusGeometry(1.44, 0.015, 12, 64), ringMat);
    eqRing.rotation.x = Math.PI / 2;
    const mRing = new THREE.Mesh(new THREE.TorusGeometry(1.44, 0.012, 12, 64), ringMat);
    blochGroup.add(eqRing, mRing);

    // Axes |0>, |1>, |+>, |->
    const axisGeo = new THREE.CylinderGeometry(0.012, 0.012, 3.1, 8);
    const axisMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.45 });
    const yAxis = new THREE.Mesh(axisGeo, axisMat);
    const xAxis = new THREE.Mesh(axisGeo, axisMat);
    xAxis.rotation.z = Math.PI / 2;
    const zAxis = new THREE.Mesh(axisGeo, axisMat);
    zAxis.rotation.x = Math.PI / 2;
    blochGroup.add(yAxis, xAxis, zAxis);

    // Pole |0> and |1> glow beacons
    const pole0 = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 1.8 })
    );
    pole0.position.set(0, 1.46, 0);
    const pole1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 1.8 })
    );
    pole1.position.set(0, -1.46, 0);
    blochGroup.add(pole0, pole1);

    // State Vector Arrow inside Bloch Sphere
    const vectorPivot = new THREE.Group();
    const shaftMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.036, 0.036, 1.15, 14),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 1.3 })
    );
    shaftMesh.position.y = 0.575;
    const tipMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.095, 0.28, 16),
      new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfacc15, emissiveIntensity: 1.9 })
    );
    tipMesh.position.y = 1.28;
    const tipHalo = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 14, 14),
      new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.38 })
    );
    tipHalo.position.y = 1.36;
    vectorPivot.add(shaftMesh, tipMesh, tipHalo);
    blochGroup.add(vectorPivot);

    // 3. Coupled Qubit B (Entanglement Twin) on Right
    const qubitBGroup = new THREE.Group();
    qubitBGroup.position.set(2.0, 1.15, 0);
    scene.add(qubitBGroup);

    const bShell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.88, 2),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.35 })
    );
    const bCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0x9333ea, emissiveIntensity: 1.7 })
    );
    const bVectorPivot = new THREE.Group();
    const bShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.72, 12),
      new THREE.MeshStandardMaterial({ color: 0x2dd4bf, emissive: 0x14b8a6, emissiveIntensity: 1.4 })
    );
    bShaft.position.y = 0.36;
    const bTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.07, 0.2, 12),
      new THREE.MeshStandardMaterial({ color: 0x5eead4, emissive: 0x2dd4bf, emissiveIntensity: 1.9 })
    );
    bTip.position.y = 0.8;
    bVectorPivot.add(bShaft, bTip);
    qubitBGroup.add(bShell, bCore, bVectorPivot);

    // Entanglement Flux Bridge connecting Qubit A & B
    const curvePts = [
      new THREE.Vector3(-1.35, 1.15, 0),
      new THREE.Vector3(0.32, 1.85, 0.45),
      new THREE.Vector3(2.0, 1.15, 0)
    ];
    const entCurve = new THREE.CatmullRomCurve3(curvePts);
    const entTube = new THREE.Mesh(
      new THREE.TubeGeometry(entCurve, 40, 0.032, 10, false),
      new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.75 })
    );
    scene.add(entTube);

    // Quantum Probability Cloud (InstancedMesh)
    const CLOUD_COUNT = 180;
    const cloudMesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.03, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 }),
      CLOUD_COUNT
    );
    cloudMesh.frustumCulled = false;
    scene.add(cloudMesh);

    const cloudSeeds = Array.from({ length: CLOUD_COUNT }, (_, i) => ({
      phase: i * 0.41,
      speed: 0.7 + (i % 7) * 0.16,
      rad: 0.45 + ((i * 19) % 100) / 85,
      yOff: (((i * 31) % 100) / 100 - 0.5) * 1.4,
      onB: i % 3 === 0
    }));

    const currentVec = new THREE.Vector3(0, 1, 0);
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
      const dt = Math.min(0.05, clock.getDelta());
      const t = clock.getElapsedTime();
      const st = stateRef.current;

      cryostatGroup.visible = st.showCryostat;
      _vA.set(st.bloch.x, st.bloch.y, st.bloch.z).normalize();
      currentVec.lerp(_vA, 1 - Math.exp(-8.5 * dt)).normalize();
      _quat.setFromUnitVectors(_up, currentVec);
      vectorPivot.quaternion.copy(_quat);

      if (st.entangled) {
        bVectorPivot.quaternion.copy(_quat);
        entTube.visible = true;
        (entTube.material as THREE.MeshBasicMaterial).opacity = 0.48 + 0.35 * Math.sin(t * 4.5);
      } else {
        _vB.set(Math.sin(t * 0.8) * 0.12, 1, Math.cos(t * 0.8) * 0.12).normalize();
        _quat.setFromUnitVectors(_up, _vB);
        bVectorPivot.quaternion.copy(_quat);
        entTube.visible = false;
      }

      bShell.rotation.y += dt * 0.45;
      bShell.rotation.x += dt * 0.22;
      blochWire.rotation.y += dt * 0.08;

      if (st.collapseFlash > 0) {
        st.collapseFlash = Math.max(0, st.collapseFlash - dt * 2.6);
        tipHalo.scale.setScalar(1 + st.collapseFlash * 2.4);
      } else {
        tipHalo.scale.setScalar(1 + Math.sin(t * 4) * 0.12);
      }

      // Update InstancedMesh probability cloud
      for (let i = 0; i < CLOUD_COUNT; i++) {
        const sd = cloudSeeds[i];
        const ang = t * sd.speed + sd.phase;
        const cx = sd.onB ? 2.0 : -1.35;
        const r = sd.onB ? sd.rad * 0.65 : sd.rad;
        const px = cx + Math.cos(ang) * r;
        const pz = Math.sin(ang) * r;
        const py = 1.15 + sd.yOff * Math.sin(ang * 0.7 + t);
        _mat4.makeTranslation(px, py, pz);
        cloudMesh.setMatrixAt(i, _mat4);
        if (st.entangled && i % 4 === 0) _col.setHex(0xc084fc);
        else if (i % 2 === 0) _col.setHex(0x38bdf8);
        else _col.setHex(0xfde047);
        cloudMesh.setColorAt(i, _col);
      }
      cloudMesh.instanceMatrix.needsUpdate = true;
      if (cloudMesh.instanceColor) cloudMesh.instanceColor.needsUpdate = true;

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

  const totalCounts = counts.k00 + counts.k01 + counts.k10 + counts.k11 || 1;

  return (
    <div className="relative w-full lg:h-[700px] rounded-2xl overflow-hidden border border-cyan-500/40 bg-[#040816] text-white shadow-2xl flex flex-col lg:block">
      {/* Top Quantum Telemetry & Measurement Header (Stacked on < lg, floating on lg+) */}
      <div className="relative z-20 p-2.5 sm:p-3 lg:pointer-events-none lg:absolute lg:top-3 lg:left-3 lg:right-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2 bg-[#040816]/95 lg:bg-transparent border-b border-cyan-500/20 lg:border-b-0 shrink-0">
        <div className="pointer-events-auto rounded-lg bg-[#050b1d]/92 border border-cyan-500/35 px-3.5 py-2.5 space-y-1 shadow-lg max-w-full sm:max-w-md">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300">
              <Atom className="w-4 h-4 shrink-0" />
              <span>{isEn ? 'Quantum Bloch Holodeck' : 'Máy Tính Lượng Tử & Bloch 3D'}</span>
            </div>
            <button
              type="button"
              onClick={() => setSoundOn((v) => !v)}
              className="min-h-[34px] min-w-[34px] flex items-center justify-center rounded bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-400 cursor-pointer"
              title={isEn ? 'Toggle Sound' : 'Bật/Tắt Âm thanh'}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-cyan-300" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] font-mono tabular-nums text-slate-200">
            <span>θ = {(bloch.theta * (180 / Math.PI)).toFixed(1)}°</span>
            <span>·</span>
            <span>φ = {(bloch.phi * (180 / Math.PI)).toFixed(1)}°</span>
            <span>·</span>
            <span className="text-sky-300">P(|0⟩) = {(bloch.p0 * 100).toFixed(1)}%</span>
            <span>·</span>
            <span className="text-rose-300">P(|1⟩) = {(bloch.p1 * 100).toFixed(1)}%</span>
          </div>
          <div className="text-[10px] font-mono text-purple-300 truncate">
            {isEn ? 'Circuit: ' : 'Mạch cổng: '}
            {gateHistory.join(' → ')}
            {qubit.entangled ? (isEn ? ' · Entangled' : ' · Vướng víu lượng tử') : ''}
          </div>
        </div>

        {/* Measurement Collapse Histogram */}
        <div className="pointer-events-auto rounded-lg bg-[#050b1d]/92 border border-purple-500/35 px-3 py-2 w-full sm:w-52 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold">
            <span className="text-purple-200">{isEn ? 'Measurement' : 'Xác suất Đo'}</span>
            {lastMeasure && <span className="text-amber-300">{lastMeasure}</span>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-1">
            {(
              [
                ['|00⟩', counts.k00, 'bg-sky-400'],
                ['|01⟩', counts.k01, 'bg-indigo-400'],
                ['|10⟩', counts.k10, 'bg-purple-400'],
                ['|11⟩', counts.k11, 'bg-rose-400']
              ] as const
            ).map(([lbl, cnt, barCls]) => {
              const pct = Math.round((cnt / totalCounts) * 100);
              return (
                <div key={lbl} className="flex items-center gap-2 text-[10px] font-mono tabular-nums">
                  <span className="w-7 text-slate-300">{lbl}</span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded overflow-hidden">
                    <div className={`h-full ${barCls}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-slate-300">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Isolated 3D WebGL Viewport */}
      <div className="relative w-full h-[290px] sm:h-[380px] lg:absolute lg:inset-0 lg:h-full">
        <div ref={mountRef} className="w-full h-full touch-none" />
      </div>

      {/* Collapsible Bottom Control Dock (Stacked below canvas on < lg, floating on lg+) */}
      <div className="relative lg:absolute lg:bottom-3 lg:left-1/2 lg:-translate-x-1/2 z-20 w-full lg:w-[min(920px,95vw)] p-2.5 lg:p-0 bg-[#040816]/95 lg:bg-transparent border-t border-cyan-500/20 lg:border-t-0 flex flex-col items-center shrink-0">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="min-h-[34px] px-3 py-1 rounded-md lg:rounded-b-none bg-[#070f24]/95 border lg:border-b-0 border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-200 cursor-pointer"
        >
          {dockCollapsed
            ? isEn ? '▴ Show Quantum Controls' : '▴ Mở Bảng Cổng Lượng Tử'
            : isEn ? '▾ Hide Controls' : '▾ Thu Gọn Bảng Điều Khiển'}
        </button>

        {!dockCollapsed && (
          <div className="w-full mt-1.5 lg:mt-0 rounded-xl bg-[#070f24]/95 border border-cyan-500/40 p-3 space-y-2.5 shadow-2xl max-h-[38dvh] lg:max-h-none overflow-y-auto">
            {/* Row 1: Quantum Gate Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {(['H', 'X', 'Y', 'Z', 'S', 'T', 'CNOT'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => applyGate(g)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-mono font-extrabold border cursor-pointer whitespace-nowrap ${
                      g === 'CNOT'
                        ? 'bg-purple-600/25 border-purple-400/60 text-purple-200 hover:bg-purple-600/45'
                        : 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200 hover:bg-cyan-500/35'
                    }`}
                  >
                    {g}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => applyGate('RESET')}
                  className="min-h-[36px] inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 border border-slate-600 text-xs font-bold text-slate-200 hover:border-sky-400 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>|0⟩</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => measureQuantum(1)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold cursor-pointer whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Measure (1×)' : 'Đo 1 Lần'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => measureQuantum(1000)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Run 1000 Shots' : 'Chạy 1000 Lần'}</span>
                </button>
              </div>
            </div>

            {/* Row 2: Presets + Cryostat Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-400 font-semibold">{isEn ? 'Presets:' : 'Kịch bản:'}</span>
                {(
                  [
                    ['superposition', isEn ? 'Superposition |+⟩' : 'Chồng chập |+⟩'],
                    ['bell', isEn ? 'Bell Entanglement' : 'Vướng víu Bell'],
                    ['teleport', isEn ? 'Teleportation' : 'Dịch chuyển tức thời'],
                    ['grover', isEn ? 'Grover Search' : 'Tìm kiếm Grover']
                  ] as const
                ).map(([pid, lbl]) => (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => loadPreset(pid)}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 font-semibold cursor-pointer whitespace-nowrap"
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowCryostat((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-bold cursor-pointer ${
                  showCryostat
                    ? 'bg-amber-500/15 border-amber-400/50 text-amber-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Cpu className="w-3 h-3" />
                <span>{isEn ? 'Gold Cryostat Rig' : 'Khung Tủ Lạnh Vàng'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
