import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  RotateCcw,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Zap,
  Activity,
  Waves,
  Atom,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type Physics3DMode = 'pendulum_spring' | 'projectile_3d' | 'lorentz_helix' | 'wave_ripple' | 'bohr_atom';

interface Physics3DViewProps {
  initialMode?: Physics3DMode;
}

export const Physics3DView: React.FC<Physics3DViewProps> = ({ initialMode = 'pendulum_spring' }) => {
  const { t } = useLanguage();
  const mountRef = useRef<HTMLDivElement>(null);

  // States
  const [mode, setMode] = useState<Physics3DMode>(initialMode);
  const [isRunning, setIsRunning] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsExpanded, setIsControlsExpanded] = useState(true);

  // Simulation physics parameters
  // 1. Pendulum / Spring
  const [mass, setMass] = useState(1.0); // kg
  const [springK, setSpringK] = useState(40); // N/m
  const [gravityPreset, setGravityPreset] = useState<'earth' | 'moon' | 'mars'>('earth');

  // 2. Projectile
  const [projAngle, setProjAngle] = useState(45); // degrees
  const [projV0, setProjV0] = useState(18); // m/s

  // 3. Lorentz
  const [magneticB, setMagneticB] = useState(2.0); // Tesla
  const [particleSpeed, setParticleSpeed] = useState(4.0);

  // 4. Wave Ripple
  const [waveFrequency, setWaveFrequency] = useState(2.5); // Hz
  const [sourceDistance, setSourceDistance] = useState(4.0); // m

  // 5. Bohr Atom
  const [quantumN, setQuantumN] = useState(2); // level n = 1, 2, 3, 4

  // Refs for animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const simStateRef = useRef({
    time: 0,
    projT: 0,
    particlePos: new THREE.Vector3(0, 0, 0),
    particleVel: new THREE.Vector3(0, 0, 0),
    electronAngle: 0,
  });

  const getGravityValue = () => {
    if (gravityPreset === 'moon') return 1.62;
    if (gravityPreset === 'mars') return 3.72;
    return 9.8;
  };

  // Initialize Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.025);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 300),
      0.1,
      100
    );
    camera.position.set(0, 6, 12);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 30;
    controls.minDistance = 2;

    // Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x88bbff, 0.8);
    fillLight.position.set(-6, -4, -6);
    scene.add(fillLight);

    // Grid Floor
    const grid = new THREE.GridHelper(20, 20, 0x3b82f6, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    // Dynamic models group
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicGroupRef.current = dynamicGroup;

    // Animation loop
    let frameId = 0;
    let lastTime = performance.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (isRunning) {
        simStateRef.current.time += dt;
        simStateRef.current.projT += dt;
        simStateRef.current.electronAngle += dt * 3.0;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / Math.max(height, 200);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Construct and animate 3D scene elements per tick
  useEffect(() => {
    const group = dynamicGroupRef.current;
    if (!group) return;

    // Clear previous geometries safely
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as any).geometry) (child as any).geometry.dispose();
      if ((child as any).material) {
        if (Array.isArray((child as any).material)) {
          (child as any).material.forEach((m: any) => m.dispose());
        } else {
          (child as any).material.dispose();
        }
      }
    }

    // -------------------------------------------------------------
    // SCENE 1: CON LẮC ĐƠN & CON LẮC LÒ XO 3D
    // -------------------------------------------------------------
    if (mode === 'pendulum_spring') {
      const g = getGravityValue();
      const omega = Math.sqrt(springK / mass);

      // Support Beam
      const beamGeo = new THREE.BoxGeometry(7, 0.2, 0.5);
      const beamMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, 5, 0);
      group.add(beam);

      // Spring mount position: (-2, 5, 0)
      // Pendulum mount position: (2, 5, 0)

      // Spring Bob
      const springBobGeo = new THREE.SphereGeometry(0.5, 32, 32);
      const springBobMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.6, roughness: 0.2 });
      const springBob = new THREE.Mesh(springBobGeo, springBobMat);
      springBob.position.set(-2, 2.5, 0);
      group.add(springBob);

      // Spring Coil (Helix)
      const numTurns = 12;
      const springRadius = 0.25;
      const springCurvePoints: THREE.Vector3[] = [];
      const steps = 120;
      for (let i = 0; i <= steps; i++) {
        const tVal = i / steps;
        const angle = tVal * numTurns * Math.PI * 2;
        const x = -2 + Math.cos(angle) * springRadius;
        const z = Math.sin(angle) * springRadius;
        const y = 5 - tVal * 2.5;
        springCurvePoints.push(new THREE.Vector3(x, y, z));
      }
      const springCurve = new THREE.CatmullRomCurve3(springCurvePoints);
      const springTubeGeo = new THREE.TubeGeometry(springCurve, 100, 0.04, 8, false);
      const springTubeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
      const springMesh = new THREE.Mesh(springTubeGeo, springTubeMat);
      group.add(springMesh);

      // Pendulum String & Bob
      const pendLen = 3.5;
      const pendBobGeo = new THREE.SphereGeometry(0.45, 32, 32);
      const pendBobMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.7, roughness: 0.2 });
      const pendBob = new THREE.Mesh(pendBobGeo, pendBobMat);
      group.add(pendBob);

      const pendLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(2, 5, 0), new THREE.Vector3(2, 1.5, 0)]);
      const pendLineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
      const pendLine = new THREE.Line(pendLineGeo, pendLineMat);
      group.add(pendLine);

      // Tick update for spring and pendulum
      const updateInterval = setInterval(() => {
        if (!isRunning) return;
        const tNow = simStateRef.current.time;
        // Spring Y:
        const springY = 2.5 + Math.sin(omega * tNow) * 1.2;
        springBob.position.y = springY;

        // Rebuild spring tube with current height
        const currentPoints: THREE.Vector3[] = [];
        const currentH = 5 - springY;
        for (let i = 0; i <= steps; i++) {
          const tVal = i / steps;
          const angle = tVal * numTurns * Math.PI * 2;
          const x = -2 + Math.cos(angle) * springRadius;
          const z = Math.sin(angle) * springRadius;
          const y = 5 - tVal * currentH;
          currentPoints.push(new THREE.Vector3(x, y, z));
        }
        springMesh.geometry.dispose();
        springMesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(currentPoints), 100, 0.04, 8, false);

        // Pendulum angle theta:
        const omegaP = Math.sqrt(g / pendLen);
        const theta = Math.sin(omegaP * tNow) * 0.55;
        const pendX = 2 + Math.sin(theta) * pendLen;
        const pendY = 5 - Math.cos(theta) * pendLen;
        pendBob.position.set(pendX, pendY, 0);

        pendLine.geometry.dispose();
        pendLine.geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(2, 5, 0),
          new THREE.Vector3(pendX, pendY, 0),
        ]);
      }, 30);

      return () => clearInterval(updateInterval);
    }

    // -------------------------------------------------------------
    // SCENE 2: NÉM XIÊN 3D (3D PROJECTILE CANNON)
    // -------------------------------------------------------------
    else if (mode === 'projectile_3d') {
      const g = getGravityValue();
      const rad = (projAngle * Math.PI) / 180;
      const v0x = projV0 * Math.cos(rad);
      const v0y = projV0 * Math.sin(rad);
      const tMax = (2 * v0y) / g;

      // Cannon Base & Barrel
      const cannonGroup = new THREE.Group();
      const baseGeo = new THREE.CylinderGeometry(0.8, 1.0, 0.4, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      cannonGroup.add(new THREE.Mesh(baseGeo, baseMat));

      const barrelGeo = new THREE.CylinderGeometry(0.25, 0.3, 2.0, 16);
      barrelGeo.translate(0, 1.0, 0);
      const barrelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 });
      const barrel = new THREE.Mesh(barrelGeo, barrelMat);
      barrel.rotation.z = -rad;
      cannonGroup.add(barrel);
      cannonGroup.position.set(-6, 0.2, 0);
      group.add(cannonGroup);

      // Projectile Cannon Ball
      const ballGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const ballMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.7 });
      const ball = new THREE.Mesh(ballGeo, ballMat);
      group.add(ball);

      // Trajectory Path (Dotted curve)
      const pathPoints: THREE.Vector3[] = [];
      const numPts = 60;
      for (let i = 0; i <= numPts; i++) {
        const tCur = (i / numPts) * tMax;
        const px = -6 + v0x * tCur * 0.4;
        const py = Math.max(0, 0.2 + (v0y * tCur - 0.5 * g * tCur * tCur) * 0.4);
        pathPoints.push(new THREE.Vector3(px, py, 0));
      }
      const pathGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
      const pathMat = new THREE.LineDashedMaterial({ color: 0x38bdf8, dashSize: 0.2, gapSize: 0.1 });
      const pathLine = new THREE.Line(pathGeo, pathMat);
      pathLine.computeLineDistances();
      group.add(pathLine);

      // Target Ring on the ground
      const targetDist = -6 + v0x * tMax * 0.4;
      const ringGeo = new THREE.RingGeometry(0.4, 0.6, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(targetDist, 0.02, 0);
      group.add(ring);

      const updateInterval = setInterval(() => {
        if (!isRunning) return;
        const currentSimT = (simStateRef.current.projT % (tMax + 0.8));
        if (currentSimT <= tMax) {
          const bx = -6 + v0x * currentSimT * 0.4;
          const by = Math.max(0, 0.2 + (v0y * currentSimT - 0.5 * g * currentSimT * currentSimT) * 0.4);
          ball.position.set(bx, by, 0);
          ball.visible = true;
        } else {
          ball.visible = false;
        }
      }, 30);

      return () => clearInterval(updateInterval);
    }

    // -------------------------------------------------------------
    // SCENE 3: TỪ TRƯỜNG LORENTZ & QUỸ ĐẠO XOẮN ỐC 3D (HELIX)
    // -------------------------------------------------------------
    else if (mode === 'lorentz_helix') {
      // 3D Magnetic Field Lines (Arrows pointing along Z)
      const fieldGridSize = 3;
      for (let ix = -fieldGridSize; ix <= fieldGridSize; ix += 2) {
        for (let iy = 1; iy <= 5; iy += 2) {
          const arrow = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(ix, iy, -4),
            8,
            0x3b82f6,
            0.4,
            0.2
          );
          group.add(arrow);
        }
      }

      // Charged Particle (Proton / Electron)
      const partGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const partMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xef4444,
        emissiveIntensity: 0.5,
      });
      const particle = new THREE.Mesh(partGeo, partMat);
      group.add(particle);

      // Trajectory Helix Path
      const helixPoints: THREE.Vector3[] = [];
      const R_cyclotron = particleSpeed / Math.max(0.2, magneticB);
      const vz = 1.2; // Axial drift
      const steps = 300;
      for (let i = 0; i < steps; i++) {
        const phi = (i / 30) * Math.PI * 2;
        const px = Math.cos(phi) * R_cyclotron;
        const py = 3 + Math.sin(phi) * R_cyclotron;
        const pz = -3 + (i / steps) * 6;
        helixPoints.push(new THREE.Vector3(px, py, pz));
      }
      const helixGeo = new THREE.BufferGeometry().setFromPoints(helixPoints);
      const helixMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 });
      group.add(new THREE.Line(helixGeo, helixMat));

      const updateInterval = setInterval(() => {
        if (!isRunning) return;
        const tCur = simStateRef.current.time * 2.5;
        const px = Math.cos(tCur) * R_cyclotron;
        const py = 3 + Math.sin(tCur) * R_cyclotron;
        const pz = -3 + ((tCur * 0.8) % 6);
        particle.position.set(px, py, pz);
      }, 30);

      return () => clearInterval(updateInterval);
    }

    // -------------------------------------------------------------
    // SCENE 4: GIAO THOA SÓNG MẶT NƯỚC 3D (RIPPLE SURFACE)
    // -------------------------------------------------------------
    else if (mode === 'wave_ripple') {
      const planeW = 12;
      const planeH = 12;
      const segments = 60;
      const planeGeo = new THREE.PlaneGeometry(planeW, planeH, segments, segments);
      planeGeo.rotateX(-Math.PI / 2);

      const planeMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        metalness: 0.4,
        wireframe: false,
        side: THREE.DoubleSide,
      });
      const rippleMesh = new THREE.Mesh(planeGeo, planeMat);
      rippleMesh.position.y = 1.0;
      group.add(rippleMesh);

      // Two coherent point sources S1 and S2
      const s1Pos = new THREE.Vector3(-sourceDistance / 2, 1.2, 0);
      const s2Pos = new THREE.Vector3(sourceDistance / 2, 1.2, 0);

      const sGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const sMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.6 });
      const s1Mesh = new THREE.Mesh(sGeo, sMat);
      s1Mesh.position.copy(s1Pos);
      const s2Mesh = new THREE.Mesh(sGeo, sMat);
      s2Mesh.position.copy(s2Pos);
      group.add(s1Mesh);
      group.add(s2Mesh);

      const posAttr = planeGeo.attributes.position;
      const origY = new Float32Array(posAttr.count);
      for (let i = 0; i < posAttr.count; i++) origY[i] = posAttr.getY(i);

      const updateInterval = setInterval(() => {
        if (!isRunning) return;
        const tNow = simStateRef.current.time;
        const omega = waveFrequency * Math.PI * 2;
        const k = 1.8;

        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i);
          const vz = posAttr.getZ(i);

          const d1 = Math.sqrt((vx - s1Pos.x) ** 2 + (vz - s1Pos.z) ** 2);
          const d2 = Math.sqrt((vx - s2Pos.x) ** 2 + (vz - s2Pos.z) ** 2);

          const yVal =
            0.25 * Math.sin(k * d1 - omega * tNow) / Math.max(1, Math.sqrt(d1)) +
            0.25 * Math.sin(k * d2 - omega * tNow) / Math.max(1, Math.sqrt(d2));

          posAttr.setY(i, yVal);
        }
        posAttr.needsUpdate = true;
        planeGeo.computeVertexNormals();
      }, 35);

      return () => clearInterval(updateInterval);
    }

    // -------------------------------------------------------------
    // SCENE 5: MẪU NGUYÊN TỬ BOHR 3D (BOHR ATOM)
    // -------------------------------------------------------------
    else if (mode === 'bohr_atom') {
      // Nucleus (Protons + Neutrons cluster)
      const nucleusGroup = new THREE.Group();
      const nucColors = [0xef4444, 0x3b82f6]; // Red proton, Blue neutron
      for (let i = 0; i < 14; i++) {
        const sphereGeo = new THREE.SphereGeometry(0.18, 12, 12);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: nucColors[i % 2],
          roughness: 0.3,
          metalness: 0.5,
        });
        const nucSphere = new THREE.Mesh(sphereGeo, sphereMat);
        nucSphere.position.set(
          (Math.random() - 0.5) * 0.6,
          2.5 + (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.6
        );
        nucleusGroup.add(nucSphere);
      }
      group.add(nucleusGroup);

      // Quantized energy level rings (K, L, M, N: n=1, 2, 3, 4)
      const orbitRadii = [1.2, 2.2, 3.4, 4.8];
      orbitRadii.forEach((r, idx) => {
        const ringGeo = new THREE.RingGeometry(r - 0.02, r + 0.02, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: idx + 1 === quantumN ? 0xf59e0b : 0x475569,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: idx + 1 === quantumN ? 0.9 : 0.3,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = 2.5;
        group.add(ringMesh);
      });

      // Electron particle
      const electronGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const electronMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.8,
      });
      const electron = new THREE.Mesh(electronGeo, electronMat);
      group.add(electron);

      const currentOrbitR = orbitRadii[quantumN - 1];

      const updateInterval = setInterval(() => {
        if (!isRunning) return;
        const angle = simStateRef.current.electronAngle * (2.0 / Math.sqrt(quantumN));
        const ex = Math.cos(angle) * currentOrbitR;
        const ez = Math.sin(angle) * currentOrbitR;
        electron.position.set(ex, 2.5, ez);
      }, 30);

      return () => clearInterval(updateInterval);
    }
  }, [mode, isRunning, mass, springK, gravityPreset, projAngle, projV0, magneticB, particleSpeed, waveFrequency, sourceDistance, quantumN]);

  // Derived telemetry
  const gVal = getGravityValue();
  const radVal = (projAngle * Math.PI) / 180;
  const hMax = ((projV0 * Math.sin(radVal)) ** 2 / (2 * gVal)).toFixed(2);
  const rangeL = ((projV0 ** 2 * Math.sin(2 * radVal)) / gVal).toFixed(2);

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[620px]'
      }`}
    >
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* TOP HEADER OVERLAY */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white shadow-lg">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold tracking-wide">
            {mode === 'pendulum_spring' && 'Con Lắc Đơn & Con Lắc Lò Xo 3D'}
            {mode === 'projectile_3d' && 'Chuyển Động Ném Xiên & Bệ Pháo 3D'}
            {mode === 'lorentz_helix' && 'Từ Trường Lorentz & Quỹ Đạo Xoắn Ốc 3D'}
            {mode === 'wave_ripple' && 'Giao Thoa Sóng Mặt Nước Nổi Khối 3D'}
            {mode === 'bohr_atom' && 'Mẫu Nguyên Tử Bohr & Các Mức Lượng Tử'}
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Mode Switcher Buttons */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-lg">
            <button
              onClick={() => setMode('pendulum_spring')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                mode === 'pendulum_spring' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Con Lắc 3D
            </button>
            <button
              onClick={() => setMode('projectile_3d')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                mode === 'projectile_3d' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Ném Xiên 3D
            </button>
            <button
              onClick={() => setMode('lorentz_helix')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                mode === 'lorentz_helix' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Từ Trường Lorentz
            </button>
            <button
              onClick={() => setMode('wave_ripple')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                mode === 'wave_ripple' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sóng Nước 3D
            </button>
            <button
              onClick={() => setMode('bohr_atom')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                mode === 'bohr_atom' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Nguyên Tử Bohr
            </button>
          </div>

          {/* Play/Pause */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer"
            title={isRunning ? 'Tạm dừng mô phỏng' : 'Tiếp tục mô phỏng'}
          >
            {isRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ERGONOMIC COLLAPSIBLE BOTTOM CONTROL DOCK */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl pointer-events-none z-20">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-4 text-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Thông Số Vật Lý & Môi Trường 3D</span>
            </div>
            <button
              onClick={() => setIsControlsExpanded(!isControlsExpanded)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <span>{isControlsExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
              {isControlsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isControlsExpanded && (
            <div className="animate-in fade-in duration-200">
              {/* 1. Pendulum / Spring */}
              {mode === 'pendulum_spring' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Độ cứng k:</span>
                        <span className="font-bold text-blue-400">{springK} N/m</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={springK}
                        onChange={(e) => setSpringK(Number(e.target.value))}
                        className="w-full accent-blue-500 h-1.5"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Khối lượng m:</span>
                        <span className="font-bold text-emerald-400">{mass} kg</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="3.0"
                        step="0.1"
                        value={mass}
                        onChange={(e) => setMass(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5"
                      />
                    </div>

                    <div>
                      <span className="block text-slate-300 mb-1">Trọng trường g:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setGravityPreset('earth')}
                          className={`px-2 py-1 rounded text-[11px] font-bold ${
                            gravityPreset === 'earth' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Trái Đất (9.8)
                        </button>
                        <button
                          onClick={() => setGravityPreset('moon')}
                          className={`px-2 py-1 rounded text-[11px] font-bold ${
                            gravityPreset === 'moon' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Mặt Trăng (1.6)
                        </button>
                        <button
                          onClick={() => setGravityPreset('mars')}
                          className={`px-2 py-1 rounded text-[11px] font-bold ${
                            gravityPreset === 'mars' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Sao Hỏa (3.7)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-950/60 rounded-xl text-xs font-mono flex flex-wrap items-center justify-between text-slate-300">
                    <span>Chu kỳ lò xo: T = 2π√(m/k) = {(2 * Math.PI * Math.sqrt(mass / springK)).toFixed(2)} s</span>
                    <span>Tần số góc: ω = {Math.sqrt(springK / mass).toFixed(2)} rad/s</span>
                  </div>
                </div>
              )}

              {/* 2. Projectile */}
              {mode === 'projectile_3d' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Góc bắn α:</span>
                        <span className="font-bold text-amber-400">{projAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="80"
                        value={projAngle}
                        onChange={(e) => setProjAngle(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1.5"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Vận tốc ban đầu v₀:</span>
                        <span className="font-bold text-emerald-400">{projV0} m/s</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        value={projV0}
                        onChange={(e) => setProjV0(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5"
                      />
                    </div>
                  </div>

                  <div className="p-2 bg-slate-950/60 rounded-xl text-xs font-mono flex flex-wrap items-center justify-between text-slate-300">
                    <span className="text-blue-400">Độ cao cực đại: H_max = {hMax} m</span>
                    <span className="text-amber-400">Tầm xa mặt đất: L = {rangeL} m</span>
                  </div>
                </div>
              )}

              {/* 3. Lorentz */}
              {mode === 'lorentz_helix' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Cảm ứng từ B:</span>
                        <span className="font-bold text-blue-400">{magneticB.toFixed(1)} Tesla</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="4.0"
                        step="0.1"
                        value={magneticB}
                        onChange={(e) => setMagneticB(Number(e.target.value))}
                        className="w-full accent-blue-500 h-1.5"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Vận tốc hạt v:</span>
                        <span className="font-bold text-rose-400">{particleSpeed.toFixed(1)} × 10⁶ m/s</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="8.0"
                        step="0.2"
                        value={particleSpeed}
                        onChange={(e) => setParticleSpeed(Number(e.target.value))}
                        className="w-full accent-rose-500 h-1.5"
                      />
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Lực Lorentz F = |q|·v·B uốn hạt thành đường tròn/xoắn ốc cyclotron bán kính R = mv / (|q|B).
                  </div>
                </div>
              )}

              {/* 4. Wave Ripple */}
              {mode === 'wave_ripple' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Tần số nguồn f:</span>
                        <span className="font-bold text-cyan-400">{waveFrequency.toFixed(1)} Hz</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="5.0"
                        step="0.2"
                        value={waveFrequency}
                        onChange={(e) => setWaveFrequency(Number(e.target.value))}
                        className="w-full accent-cyan-500 h-1.5"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Khoảng cách 2 nguồn S₁S₂:</span>
                        <span className="font-bold text-amber-400">{sourceDistance.toFixed(1)} m</span>
                      </div>
                      <input
                        type="range"
                        min="2.0"
                        max="6.0"
                        step="0.2"
                        value={sourceDistance}
                        onChange={(e) => setSourceDistance(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Bohr Atom */}
              {mode === 'bohr_atom' && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">Mức quỹ đạo dừng n:</span>
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        onClick={() => setQuantumN(level)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          quantumN === level ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        n = {level} ({['K', 'L', 'M', 'N'][level - 1]})
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Năng lượng mức n: E_n = -13.6 / n² eV. Bán kính r_n = n² · r₀ (với r₀ = 0.53 Å).
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
