import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Camera, Grid3X3, Orbit, RotateCcw } from 'lucide-react';
import { PaperSimKind, PaperToSimParam, SimEngineKind } from '../../types';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import { captureCanvasPng } from '../common/SimProToolkit';

export type UnifiedSimKind = SimEngineKind | PaperSimKind;

interface StemSim3DViewportProps {
  simKind: UnifiedSimKind;
  params: PaperToSimParam[];
  playing: boolean;
  speedMultiplier?: number;
  resetSignal?: number;
  heightClass?: string;
}

const SCRATCH_VEC_A = new THREE.Vector3();
const SCRATCH_VEC_B = new THREE.Vector3();
const SCRATCH_MAT = new THREE.Matrix4();
const SCRATCH_QUAT = new THREE.Quaternion();
const SCRATCH_SCALE = new THREE.Vector3();

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

export const StemSim3DViewport: React.FC<StemSim3DViewportProps> = ({
  simKind,
  params,
  playing,
  speedMultiplier = 1,
  resetSignal = 0,
  heightClass = 'h-[340px] sm:h-[380px]'
}) => {
  const { perfMode } = useBackgroundTheme();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoOrbit, setAutoOrbit] = useState(false);
  const [localSpeed, setLocalSpeed] = useState<number>(speedMultiplier);
  const wireframeRef = useRef(false);
  wireframeRef.current = wireframe;
  const autoOrbitRef = useRef(false);
  autoOrbitRef.current = autoOrbit;

  const simKindRef = useRef(simKind);
  simKindRef.current = simKind;
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const playingRef = useRef(playing);
  playingRef.current = playing;
  const speedRef = useRef(localSpeed);
  speedRef.current = localSpeed;

  useEffect(() => {
    setLocalSpeed(speedMultiplier);
  }, [speedMultiplier]);

  const [hudReadout, setHudReadout] = useState('WEBGL 3D');
  const [contextLost, setContextLost] = useState(false);

  const simTimeRef = useRef(0);
  const resetCamRef = useRef<((preset?: 'iso' | 'front' | 'top') => void) | null>(null);
  const snapshotRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    simTimeRef.current = 0;
  }, [resetSignal, simKind]);

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
      return;
    }

    const hostDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : perfMode === 'smooth' ? Math.min(hostDpr, 1.15) : Math.min(hostDpr, 1.5)
    );
    renderer.setSize(container.clientWidth || 700, container.clientHeight || 360);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl && perfMode !== 'smooth';

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
    scene.background = new THREE.Color(0x060f1f);
    scene.fog = new THREE.FogExp2(0x060f1f, 0.025);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(
      46,
      (container.clientWidth || 700) / (container.clientHeight || 360),
      0.1,
      140
    );
    camera.position.set(0, 4.4, 9.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 3.2;
    controls.maxDistance = 24;
    controls.target.set(0, 1.2, 0);
    controls.update();

    const hemi = new THREE.HemisphereLight(0x93c5fd, 0x0f172a, 0.85);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff5e4, 2.0);
    key.position.set(6, 12, 7);
    if (renderer.shadowMap.enabled) key.castShadow = true;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x38bdf8, 0.9);
    rim.position.set(-6, 5, -6);
    scene.add(rim);

    // Bench & Grid
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x0b162a, roughness: 0.78, metalness: 0.2 })
    );
    bench.position.y = -0.1;
    bench.receiveShadow = renderer.shadowMap.enabled;
    scene.add(bench);

    const grid = new THREE.GridHelper(16, 16, 0x38bdf8, 0x1e293b);
    grid.position.y = 0.015;
    scene.add(grid);

    // Shared PBR Materials
    const cyanMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
      roughness: 0.22,
      metalness: 0.55,
      clearcoat: 0.7
    });
    const amberMat = new THREE.MeshPhysicalMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.25,
      roughness: 0.25,
      metalness: 0.65,
      clearcoat: 0.6
    });
    const emeraldMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      roughness: 0.3,
      metalness: 0.5
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.42,
      metalness: 0.82
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.48
    });

    const toggleableMats = [cyanMat, amberMat, emeraldMat, steelMat];

    // ==================== DYNAMIC 3D APPARATUSES ====================
    // 1. Collision 1D Group
    const collisionGroup = new THREE.Group();
    scene.add(collisionGroup);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(11, 0.25, 1.1), steelMat);
    rail.position.y = 0.125;
    collisionGroup.add(rail);
    const ball1 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), cyanMat);
    const ball2 = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), amberMat);
    collisionGroup.add(ball1, ball2);

    // 2. Standing Wave / Trig Wave 3D String Nodes (InstancedMesh)
    const waveGroup = new THREE.Group();
    scene.add(waveGroup);
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 3.2, 12), steelMat);
    postL.position.set(-4.8, 1.6, 0);
    const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 3.2, 12), steelMat);
    postR.position.set(4.8, 1.6, 0);
    waveGroup.add(postL, postR);

    const WAVE_BEADS = 72;
    const waveBeads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.09, 10, 10), cyanMat, WAVE_BEADS);
    waveBeads.frustumCulled = false;
    waveGroup.add(waveBeads);

    // 3. Optics 3D Optical Bench
    const opticsGroup = new THREE.Group();
    scene.add(opticsGroup);
    const optRail = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.22, 0.65), steelMat);
    optRail.position.y = 0.11;
    opticsGroup.add(optRail);
    const lensMesh = new THREE.Mesh(new THREE.SphereGeometry(1.35, 28, 28), glassMat);
    lensMesh.scale.set(0.18, 1.0, 1.0);
    lensMesh.position.y = 1.6;
    opticsGroup.add(lensMesh);
    const objArrow = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.2, 16), emeraldMat);
    opticsGroup.add(objArrow);
    const imgArrow = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.2, 16), amberMat);
    opticsGroup.add(imgArrow);
    const rayPts = new Float32Array(6 * 3);
    const rayGeo = new THREE.BufferGeometry();
    rayGeo.setAttribute('position', new THREE.BufferAttribute(rayPts, 3));
    const rayLines = new THREE.LineSegments(rayGeo, new THREE.LineBasicMaterial({ color: 0xfbbf24 }));
    opticsGroup.add(rayLines);

    // 4. Curve 3D Surface / Tangent & Parabola
    const curveGroup = new THREE.Group();
    scene.add(curveGroup);
    const axisX = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 10, 8), steelMat);
    axisX.rotation.z = Math.PI / 2;
    axisX.position.y = 2.0;
    const axisY = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 4.4, 8), steelMat);
    axisY.position.y = 2.2;
    curveGroup.add(axisX, axisY);

    const CURVE_SAMPLES = 80;
    const curvePos = new Float32Array(CURVE_SAMPLES * 3);
    const curveGeo = new THREE.BufferGeometry();
    curveGeo.setAttribute('position', new THREE.BufferAttribute(curvePos, 3));
    const curveLine = new THREE.Line(curveGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8 }));
    curveGroup.add(curveLine);

    const tangentGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const tangentLine = new THREE.Line(tangentGeo, new THREE.LineBasicMaterial({ color: 0xfbbf24 }));
    curveGroup.add(tangentLine);

    const curveBead = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), amberMat);
    curveGroup.add(curveBead);

    // 5. Incline 3D Ramp & Force Vectors
    const inclineGroup = new THREE.Group();
    scene.add(inclineGroup);
    const rampPivot = new THREE.Group();
    rampPivot.position.set(2.5, 0.05, 0);
    inclineGroup.add(rampPivot);
    const rampPlank = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.2, 2.2), steelMat);
    rampPlank.position.set(-3.25, 0, 0);
    rampPivot.add(rampPlank);
    const slidingBlock = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.55, 0.75), amberMat);
    rampPivot.add(slidingBlock);
    const normalVec = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.3, 0), 1.4, 0x34d399);
    const gravityVec = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0.3, 0), 1.6, 0xf43f5e);
    slidingBlock.add(normalVec);
    inclineGroup.add(gravityVec);

    // 6. Projectile 3D Trajectory
    const projGroup = new THREE.Group();
    scene.add(projGroup);
    const PROJ_SAMPLES = 70;
    const projArr = new Float32Array(PROJ_SAMPLES * 3);
    const projGeo = new THREE.BufferGeometry();
    projGeo.setAttribute('position', new THREE.BufferAttribute(projArr, 3));
    const projArc = new THREE.Line(projGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8 }));
    projGroup.add(projArc);
    const projSphere = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), amberMat);
    projGroup.add(projSphere);

    // 7. Pendulum & Spring 3D
    const oscGroup = new THREE.Group();
    scene.add(oscGroup);
    const gantry = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.4, 0.3), steelMat);
    gantry.position.set(-4.2, 2.2, 0);
    const topArm = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.25, 0.3), steelMat);
    topArm.position.set(-2.0, 4.3, 0);
    oscGroup.add(gantry, topArm);

    const pendPivot = new THREE.Group();
    pendPivot.position.set(0, 4.2, 0);
    oscGroup.add(pendPivot);
    const pendRod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.8, 10), steelMat);
    pendRod.position.y = -1.4;
    const pendBob = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 20), cyanMat);
    pendBob.position.y = -2.8;
    pendPivot.add(pendRod, pendBob);

    const springBob = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), amberMat);
    oscGroup.add(springBob);
    const springHelixPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 48; i++) {
      const f = i / 48;
      springHelixPts.push(new THREE.Vector3(Math.cos(f * Math.PI * 12) * 0.22, -f, Math.sin(f * Math.PI * 12) * 0.22));
    }
    const springHelixGeo = new THREE.BufferGeometry().setFromPoints(springHelixPts);
    const springHelix = new THREE.Line(springHelixGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8 }));
    springHelix.position.set(0, 4.2, 0);
    oscGroup.add(springHelix);

    // 8. Oxyz 3D Solid
    const oxyzGroup = new THREE.Group();
    scene.add(oxyzGroup);
    const pyramidMesh = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.8, 4), cyanMat);
    pyramidMesh.position.y = 1.4;
    oxyzGroup.add(pyramidMesh);
    const pyramidWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.ConeGeometry(1.62, 2.82, 4)),
      new THREE.LineBasicMaterial({ color: 0xfbbf24 })
    );
    pyramidWire.position.y = 1.4;
    oxyzGroup.add(pyramidWire);

    resetCamRef.current = (preset = 'iso') => {
      if (preset === 'front') {
        camera.position.set(0, 2.2, 10.6);
        controls.target.set(0, 1.4, 0);
      } else if (preset === 'top') {
        camera.position.set(0.01, 11.4, 2.4);
        controls.target.set(0, 0.8, 0);
      } else {
        camera.position.set(5.4, 4.4, 8.8);
        controls.target.set(0, 1.2, 0);
      }
      controls.update();
    };

    snapshotRef.current = () => {
      renderer.render(scene, camera);
      captureCanvasPng(renderer.domElement, `synapse-stem-${simKindRef.current}`);
    };

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth || 700;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    let rafId = 0;
    let alive = true;
    const clock = new THREE.Clock();
    let hudTimer = 0;

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
      if (playingRef.current) simTimeRef.current += dt * speedRef.current;
      const t = simTimeRef.current;

      toggleableMats.forEach((m) => {
        m.wireframe = wireframeRef.current;
      });

      const kind = simKindRef.current;
      const pList = paramsRef.current;
      const pv = (idx: number, fb: number) => pList[idx]?.value ?? fb;

      collisionGroup.visible = kind === 'collision_1d';
      waveGroup.visible = kind === 'wave_standing' || kind === 'trig_wave';
      opticsGroup.visible = kind === 'optics_lens';
      curveGroup.visible = kind === 'math_tangent' || kind === 'parabola';
      inclineGroup.visible = kind === 'incline' || kind === 'incline_forces';
      projGroup.visible = kind === 'projectile' || kind === 'projectile_drag';
      oscGroup.visible = kind === 'pendulum' || kind === 'spring';
      oxyzGroup.visible = kind === 'oxyz_solid';

      let nextReadout = '';

      if (kind === 'collision_1d') {
        const m1 = pv(0, 4);
        const m2 = pv(1, 2);
        const v1 = pv(2, 6);
        const v1p = ((m1 - m2) / (m1 + m2)) * v1;
        const v2p = ((2 * m1) / (m1 + m2)) * v1;
        const s1 = 0.35 + m1 * 0.04;
        const s2 = 0.35 + m2 * 0.04;
        ball1.scale.setScalar(s1 / 0.55);
        ball2.scale.setScalar(s2 / 0.45);
        const cyc = t % 4.4;
        const tHit = 1.6;
        let x1 = -4.2 + (cyc / tHit) * 3.6;
        let x2 = 0.4;
        if (cyc >= tHit) {
          const dtH = cyc - tHit;
          x1 = -0.6 + v1p * dtH * 0.65;
          x2 = 0.4 + v2p * dtH * 0.65;
        }
        ball1.position.set(x1, 0.25 + s1, 0);
        ball2.position.set(x2, 0.25 + s2, 0);
        nextReadout = `3D COLLISION · v₁'=${v1p.toFixed(2)} m/s · v₂'=${v2p.toFixed(2)} m/s`;
      } else if (kind === 'wave_standing' || kind === 'trig_wave') {
        const k = Math.max(1, Math.round(pv(0, 4)));
        const amp = (kind === 'wave_standing' ? pv(1, 36) / 30 : Math.abs(pv(1, 1.5)) * 0.7);
        const freq = pv(2, 1.8);
        for (let i = 0; i < WAVE_BEADS; i++) {
          const u = i / (WAVE_BEADS - 1);
          const x = -4.8 + u * 9.6;
          const y =
            kind === 'wave_standing'
              ? 1.8 + amp * Math.sin(k * Math.PI * u) * Math.cos(t * freq * Math.PI * 2)
              : 1.8 + amp * Math.sin(k * u * 6 + t * 2.5);
          SCRATCH_SCALE.setScalar(1);
          SCRATCH_MAT.compose(SCRATCH_VEC_A.set(x, y, 0), SCRATCH_QUAT.identity(), SCRATCH_SCALE);
          waveBeads.setMatrixAt(i, SCRATCH_MAT);
        }
        waveBeads.instanceMatrix.needsUpdate = true;
        nextReadout = `3D HARMONIC WAVE · k=${k} · f=${freq.toFixed(1)}Hz`;
      } else if (kind === 'optics_lens') {
        const f = pv(0, 90) / 38;
        const d = pv(1, 150) / 38;
        const h = pv(2, 44) / 38;
        const denom = d - f;
        const dp = Math.abs(denom) < 0.08 ? 8 : (d * f) / denom;
        const hp = (-dp / d) * h;
        objArrow.scale.set(1, Math.max(0.25, h), 1);
        objArrow.position.set(-d, 0.25 + h * 0.6, 0);
        imgArrow.scale.set(1, Math.max(0.25, Math.abs(hp)), 1);
        imgArrow.rotation.z = hp < 0 ? Math.PI : 0;
        imgArrow.position.set(dp, 0.25 + Math.abs(hp) * 0.6, 0);

        const objTopY = 0.25 + h * 1.2;
        const imgTopY = 0.25 + Math.max(0.1, Math.abs(hp) * 1.2) * (hp < 0 ? 0.5 : 1);
        const rArr = rayGeo.attributes.position.array as Float32Array;
        // Ray 1: Parallel then through F'
        rArr[0] = -d; rArr[1] = objTopY; rArr[2] = 0;
        rArr[3] = 0; rArr[4] = objTopY; rArr[5] = 0;
        rArr[6] = 0; rArr[7] = objTopY; rArr[8] = 0;
        rArr[9] = dp; rArr[10] = imgTopY; rArr[11] = 0;
        // Ray 2: Through optical center
        rArr[12] = -d; rArr[13] = objTopY; rArr[14] = 0;
        rArr[15] = dp; rArr[16] = imgTopY; rArr[17] = 0;
        rayGeo.attributes.position.needsUpdate = true;
        nextReadout = `3D OPTICS · d'=${(dp * 38).toFixed(1)} cm · k=${(-dp / d).toFixed(2)}`;
      } else if (kind === 'math_tangent' || kind === 'parabola') {
        const a = pv(0, 0.5);
        const b = pv(1, -1.5);
        const x0OrC = pv(2, 0.5);
        const arr = curveGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < CURVE_SAMPLES; i++) {
          const x = -4.2 + (i / (CURVE_SAMPLES - 1)) * 8.4;
          const y = kind === 'math_tangent' ? a * x * x * x * 0.15 + b * x * 0.35 : a * x * x * 0.28 + b * x * 0.4 + x0OrC * 0.4;
          arr[i * 3] = x;
          arr[i * 3 + 1] = THREE.MathUtils.clamp(2.0 + y, 0.2, 4.8);
          arr[i * 3 + 2] = 0;
        }
        curveGeo.attributes.position.needsUpdate = true;
        const xPt = kind === 'math_tangent' ? x0OrC : Math.abs(a) > 0.05 ? -b / (2 * a) : 0;
        const yPt = kind === 'math_tangent' ? a * xPt * xPt * xPt * 0.15 + b * xPt * 0.35 : a * xPt * xPt * 0.28 + b * xPt * 0.4 + x0OrC * 0.4;
        const slope = kind === 'math_tangent' ? 3 * a * xPt * xPt * 0.15 + b * 0.35 : 0;
        curveBead.position.set(THREE.MathUtils.clamp(xPt, -4, 4), THREE.MathUtils.clamp(2.0 + yPt, 0.2, 4.8), 0);
        const tAttr = tangentGeo.attributes.position.array as Float32Array;
        tAttr[0] = curveBead.position.x - 1.8;
        tAttr[1] = curveBead.position.y - slope * 1.8;
        tAttr[3] = curveBead.position.x + 1.8;
        tAttr[4] = curveBead.position.y + slope * 1.8;
        tangentGeo.attributes.position.needsUpdate = true;
        nextReadout = kind === 'math_tangent' ? `3D TANGENT · x₀=${xPt.toFixed(1)}` : `3D PARABOLA · vertex x=${xPt.toFixed(2)}`;
      } else if (kind === 'incline' || kind === 'incline_forces') {
        const deg = kind === 'incline_forces' ? pv(1, 32) : pv(0, 32);
        const mu = kind === 'incline_forces' ? pv(2, 0.15) : pv(1, 0.15);
        const rad = THREE.MathUtils.degToRad(deg);
        rampPivot.rotation.z = -rad;
        const acc = Math.max(0, 9.8 * (Math.sin(rad) - mu * Math.cos(rad)));
        const cyc = (t % 3.0) / 3.0;
        const s = acc > 0.05 ? cyc * cyc : 0.2;
        const localX = -5.6 + s * 4.8;
        slidingBlock.position.set(localX, 0.38, 0);
        slidingBlock.getWorldPosition(SCRATCH_VEC_A);
        gravityVec.position.copy(SCRATCH_VEC_A);
        nextReadout = `3D INCLINE · α=${deg}° · μ=${mu.toFixed(2)} · a=${acc.toFixed(2)} m/s²`;
      } else if (kind === 'projectile' || kind === 'projectile_drag') {
        const v0 = pv(0, 20);
        const deg = pv(1, 45);
        const g = kind === 'projectile' ? pv(2, 9.8) : 9.8;
        const rad = THREE.MathUtils.degToRad(deg);
        const vx = v0 * Math.cos(rad);
        const vy = v0 * Math.sin(rad);
        const tMax = Math.max(0.5, (2 * vy) / g);
        const range = vx * tMax;
        const sc = 8.5 / Math.max(12, range);
        const pArr = projGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < PROJ_SAMPLES; i++) {
          const ti = (i / (PROJ_SAMPLES - 1)) * tMax;
          pArr[i * 3] = -4.2 + vx * ti * sc;
          pArr[i * 3 + 1] = 0.2 + Math.max(0, vy * ti - 0.5 * g * ti * ti) * sc;
          pArr[i * 3 + 2] = 0;
        }
        projGeo.attributes.position.needsUpdate = true;
        const tNow = t % tMax;
        projSphere.position.set(
          -4.2 + vx * tNow * sc,
          0.2 + Math.max(0, vy * tNow - 0.5 * g * tNow * tNow) * sc,
          0
        );
        nextReadout = `3D PROJECTILE · Range L=${range.toFixed(1)}m · α=${deg}°`;
      } else if (kind === 'pendulum' || kind === 'spring') {
        const p0 = pv(0, 1.5);
        const p1 = pv(1, 20);
        const omega = kind === 'pendulum' ? Math.sqrt(9.8 / Math.max(0.3, p0)) : Math.sqrt(Math.max(1, p1) / Math.max(0.2, p0));
        pendPivot.visible = kind === 'pendulum';
        springBob.visible = kind === 'spring';
        springHelix.visible = kind === 'spring';
        if (kind === 'pendulum') {
          const thMax = THREE.MathUtils.degToRad(p1);
          pendPivot.rotation.z = thMax * Math.cos(omega * t);
          nextReadout = `3D PENDULUM · T=${((2 * Math.PI) / omega).toFixed(2)}s`;
        } else {
          const stretch = 1.8 + 0.85 * Math.cos(omega * t);
          springHelix.scale.y = stretch;
          springBob.position.set(0, 4.2 - stretch - 0.35, 0);
          nextReadout = `3D SPRING · ω=${omega.toFixed(2)} rad/s`;
        }
      } else {
        const r = pv(0, 1.5);
        const h = pv(1, 2.5);
        pyramidMesh.scale.set(r * 0.75, h * 0.5, r * 0.75);
        pyramidMesh.position.y = h * 0.7;
        pyramidWire.scale.copy(pyramidMesh.scale);
        pyramidWire.position.copy(pyramidMesh.position);
        oxyzGroup.rotation.y += dt * 0.65;
        nextReadout = `3D OXYZ SOLID · r=${r.toFixed(1)} · h=${h.toFixed(1)}`;
      }

      if (autoOrbitRef.current) {
        const ang = dt * 0.42;
        const dx = camera.position.x - controls.target.x;
        const dz = camera.position.z - controls.target.z;
        camera.position.x = controls.target.x + dx * Math.cos(ang) - dz * Math.sin(ang);
        camera.position.z = controls.target.z + dx * Math.sin(ang) + dz * Math.cos(ang);
      }
      controls.update();
      renderer.render(scene, camera);

      hudTimer += dt;
      if (hudTimer >= 0.1) {
        hudTimer = 0;
        setHudReadout(nextReadout);
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

  return (
    <div className={`relative w-full ${heightClass} rounded-lg overflow-hidden border border-slate-800 bg-[#060f1f] select-none`}>
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {contextLost && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/85 text-cyan-300 text-xs font-mono">
          Restoring 3D WebGL...
        </div>
      )}

      {/* Top-Left Clean Telemetry Readout */}
      <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded bg-slate-950/88 border border-sky-500/35 text-[11px] font-mono font-bold text-cyan-300">
        {hudReadout}
      </div>

      {/* Top-Right Compact 3D Utility Controls */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-wrap items-center justify-end gap-1">
        {(['iso', 'front', 'top'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => resetCamRef.current?.(p)}
            className="px-1.5 py-1 rounded border border-slate-700 bg-slate-950/88 hover:border-sky-400 text-[10px] font-mono font-bold uppercase text-slate-200 cursor-pointer"
            title={`Camera ${p}`}
          >
            {p}
          </button>
        ))}
        {([0.5, 1, 2] as const).map((sp) => (
          <button
            key={sp}
            type="button"
            onClick={() => setLocalSpeed(sp)}
            className={`px-1.5 py-1 rounded border text-[10px] font-mono font-bold cursor-pointer ${
              localSpeed === sp
                ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                : 'bg-slate-950/88 border-slate-700 text-slate-300'
            }`}
          >
            {sp}x
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAutoOrbit((o) => !o)}
          className={`px-2 py-1 rounded border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer ${
            autoOrbit
              ? 'bg-cyan-500 text-slate-950 border-cyan-300'
              : 'bg-slate-950/88 border-slate-700 text-slate-200'
          }`}
          title="Auto-Orbit 3D"
        >
          <Orbit className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => setWireframe((w) => !w)}
          className={`px-2 py-1 rounded border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer ${
            wireframe
              ? 'bg-sky-500 text-slate-950 border-sky-300'
              : 'bg-slate-950/88 border-slate-700 text-slate-200'
          }`}
          title="Wireframe 3D"
        >
          <Grid3X3 className="w-3 h-3" />
          <span>Wire</span>
        </button>
        <button
          type="button"
          onClick={() => snapshotRef.current?.()}
          className="p-1.5 rounded border border-slate-700 bg-slate-950/88 hover:border-sky-400 text-sky-300 cursor-pointer"
          title="PNG Snapshot"
        >
          <Camera className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => resetCamRef.current?.('iso')}
          className="p-1.5 rounded border border-slate-700 bg-slate-950/88 text-slate-200 cursor-pointer"
          title="Reset Camera"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
