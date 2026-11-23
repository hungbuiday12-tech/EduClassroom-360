import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  BookOpen,
  Box,
  Clock,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';

interface FourDLecture3DLabProps {
  onEarnXP?: (xp: number) => void;
}

type FourDTopicId = 'tesseract' | 'hypersphere' | 'minkowski' | 'klein';

interface LectureMeta {
  id: FourDTopicId;
  titleVi: string;
  titleEn: string;
  formula: string;
  lessonVi: string;
  lessonEn: string;
}

const FOUR_D_LECTURES: LectureMeta[] = [
  {
    id: 'tesseract',
    titleVi: '1. Siêu Lập Phương 4D (Tesseract)',
    titleEn: '1. 4D Tesseract (Hypercube)',
    formula: 'V=16 · E=32 · F=24 · C=8',
    lessonVi:
      'Một Tesseract có 16 đỉnh (±1, ±1, ±1, ±1) trong không gian R⁴, giới hạn bởi 8 khối lập phương 3D. Khi xoay trên mặt phẳng (X,W) hoặc (Z,W), khối bên trong và bên ngoài lộn vào nhau liên tục.',
    lessonEn:
      'A 4D Hypercube has 16 vertices (±1,±1,±1,±1) bounded by 8 3D cubic cells. Rotating in the XW/ZW planes turns the inner cell smoothly inside-out through R³ stereographic projection.'
  },
  {
    id: 'hypersphere',
    titleVi: '2. Siêu Mặt Cầu S³ & Hopf Fibration',
    titleEn: '2. 4D Hypersphere S³ Hopf Fibration',
    formula: 'x²+y²+z²+w² = R²',
    lessonVi:
      'Phân thớ Hopf chiếu mặt cầu 4 chiều S³ xuống R³ thành tập các vòng tròn liên kết nhau (toroidal linked circles) không bao giờ cắt nhau.',
    lessonEn:
      'Hopf Fibration maps the 4D 3-sphere S³ into R³ as nested stereographic linked circles forming toroidal fiber shells.'
  },
  {
    id: 'minkowski',
    titleVi: '3. Không-Thời Gian Minkowski 4D',
    titleEn: '3. 4D Minkowski Spacetime Light Cone',
    formula: 'ds² = −c²dt² + dx² + dy² + dz²',
    lessonVi:
      'Trục thẳng đứng là Thời gian (ct), mặt phẳng ngang là Không gian. Khi tăng vận tốc β = v/c, phép biến đổi Lorentz làm nghiêng trục thời gian và không gian lại gần nón ánh sáng.',
    lessonEn:
      'Vertical axis represents time (ct) while horizontal plane is space. Increasing relativistic velocity β = v/c shears the worldline via Lorentz transformation.'
  },
  {
    id: 'klein',
    titleVi: '4. Chai Klein 4D Không Định Hướng',
    titleEn: '4. 4D Non-Orientable Klein Bottle',
    formula: '∂(M) = ∅ · Euler χ = 0',
    lessonVi:
      'Bề mặt 1 phía không có "bên trong" hay "bên ngoài". Trong không gian 4D thật nó không tự cắt, nhưng khi nhúng xuống 3D cổ chai đi xuyên qua thành bình.',
    lessonEn:
      'A non-orientable single-sided manifold with zero boundary. Embedded cleanly in R⁴, its R³ immersion passes smoothly through itself.'
  }
];

// 16 vertices & 32 edges of a 4D unit hypercube
const TESS_VERTS: [number, number, number, number][] = [];
for (let i = 0; i < 16; i++) {
  TESS_VERTS.push([
    i & 1 ? 1 : -1,
    i & 2 ? 1 : -1,
    i & 4 ? 1 : -1,
    i & 8 ? 1 : -1
  ]);
}
const TESS_EDGES: [number, number][] = [];
for (let i = 0; i < 16; i++) {
  for (let b = 0; b < 4; b++) {
    const j = i ^ (1 << b);
    if (i < j) TESS_EDGES.push([i, j]);
  }
}

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

export const FourDLecture3DLab: React.FC<FourDLecture3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode } = useBackgroundTheme();

  const mountRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [topic, setTopic] = useState<FourDTopicId>('tesseract');
  const topicRef = useRef<FourDTopicId>('tesseract');
  topicRef.current = topic;

  const [autoSpin4D, setAutoSpin4D] = useState(true);
  const autoSpinRef = useRef(true);
  autoSpinRef.current = autoSpin4D;

  const [wAngleDeg, setWAngleDeg] = useState(35);
  const wAngleRef = useRef(35);
  wAngleRef.current = wAngleDeg;

  const [zwAngleDeg, setZwAngleDeg] = useState(20);
  const zwAngleRef = useRef(20);
  zwAngleRef.current = zwAngleDeg;

  const [wSlice, setWSlice] = useState(0);
  const wSliceRef = useRef(0);
  wSliceRef.current = wSlice;

  const [betaVelocity, setBetaVelocity] = useState(0.45);
  const betaRef = useRef(0.45);
  betaRef.current = betaVelocity;

  const [eventCt, setEventCt] = useState(1.2);
  const eventCtRef = useRef(1.2);
  eventCtRef.current = eventCt;

  const [eventDx, setEventDx] = useState(0.75);
  const eventDxRef = useRef(0.75);
  eventDxRef.current = eventDx;

  const [webglError, setWebglError] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const resetCamRef = useRef<(() => void) | null>(null);

  const toggleFullscreen = () => {
    const el = rootRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => setIsFullscreen((f) => !f));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => setIsFullscreen(false));
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

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
    renderer.toneMappingExposure = 1.12;

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
    scene.background = new THREE.Color(0x060918);
    scene.fog = new THREE.FogExp2(0x060918, 0.025);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(
      48,
      (container.clientWidth || 960) / (container.clientHeight || 620),
      0.1,
      150
    );
    camera.position.set(4.8, 3.6, 5.4);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2.5;
    controls.maxDistance = 16;
    controls.target.set(0, 0.4, 0);
    controls.update();

    const hemi = new THREE.HemisphereLight(0xc084fc, 0x0f172a, 0.9);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xf8fafc, 2.0);
    key.position.set(6, 10, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x38bdf8, 1.15);
    rim.position.set(-7, -4, -6);
    scene.add(rim);

    const grid = new THREE.GridHelper(16, 16, 0x6366f1, 0x1e293b);
    grid.position.y = -2.4;
    scene.add(grid);

    // ==================== TOPIC 1: TESSERACT (4D HYPERCUBE) ====================
    const tesseractGroup = new THREE.Group();
    scene.add(tesseractGroup);

    const tessEdgePositions = new Float32Array(TESS_EDGES.length * 6);
    const tessGeo = new THREE.BufferGeometry();
    tessGeo.setAttribute('position', new THREE.BufferAttribute(tessEdgePositions, 3));
    const tessLines = new THREE.LineSegments(
      tessGeo,
      new THREE.LineBasicMaterial({ color: 0xe879f9, transparent: true, opacity: 0.95 })
    );
    tesseractGroup.add(tessLines);

    const vertSphereGeo = new THREE.SphereGeometry(0.11, 14, 14);
    const tessVertMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 16; i++) {
      const m = new THREE.Mesh(
        vertSphereGeo,
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0ea5e9,
          emissiveIntensity: 0.85,
          roughness: 0.2,
          metalness: 0.7
        })
      );
      tesseractGroup.add(m);
      tessVertMeshes.push(m);
    }

    // W-Hyperplane intersection slice ring
    const sliceRing = new THREE.Mesh(
      new THREE.RingGeometry(1.1, 1.18, 40),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.55 })
    );
    sliceRing.rotation.x = Math.PI / 2;
    tesseractGroup.add(sliceRing);

    // ==================== TOPIC 2: 4D HYPERSPHERE S3 HOPF FIBRATION ====================
    const hopfGroup = new THREE.Group();
    scene.add(hopfGroup);
    const fiberCount = 24;
    for (let f = 0; f < fiberCount; f++) {
      const phiBase = (f / fiberCount) * Math.PI * 2;
      const eta = 0.45 + (f % 3) * 0.25;
      const pts: THREE.Vector3[] = [];
      for (let s = 0; s <= 64; s++) {
        const xi = (s / 64) * Math.PI * 2;
        const x1 = Math.cos(xi + phiBase) * Math.sin(eta);
        const x2 = Math.sin(xi + phiBase) * Math.sin(eta);
        const x3 = Math.cos(xi - phiBase) * Math.cos(eta);
        const x4 = Math.sin(xi - phiBase) * Math.cos(eta);
        const denom = Math.max(0.35, 1.35 - x4);
        pts.push(new THREE.Vector3((x1 / denom) * 1.45, (x3 / denom) * 1.45, (x2 / denom) * 1.45));
      }
      const curveGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const hue = f / fiberCount;
      const col = new THREE.Color().setHSL(0.55 + hue * 0.3, 0.85, 0.62);
      hopfGroup.add(new THREE.Line(curveGeo, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.85 })));
    }

    // ==================== TOPIC 3: 4D MINKOWSKI SPACETIME LIGHT CONE ====================
    const minkowskiGroup = new THREE.Group();
    scene.add(minkowskiGroup);

    const coneMatFuture = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
      roughness: 0.15
    });
    const coneMatPast = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
      roughness: 0.15
    });
    const futureCone = new THREE.Mesh(new THREE.ConeGeometry(2.4, 2.4, 36, 1, true), coneMatFuture);
    futureCone.rotation.x = Math.PI;
    futureCone.position.y = 1.2;
    minkowskiGroup.add(futureCone);

    const pastCone = new THREE.Mesh(new THREE.ConeGeometry(2.4, 2.4, 36, 1, true), coneMatPast);
    pastCone.position.y = -1.2;
    minkowskiGroup.add(pastCone);

    const presentPlane = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 2.6, 36),
      new THREE.MeshBasicMaterial({ color: 0x64748b, side: THREE.DoubleSide, transparent: true, opacity: 0.3 })
    );
    presentPlane.rotation.x = Math.PI / 2;
    minkowskiGroup.add(presentPlane);

    const eventOrigin = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 1.2 })
    );
    minkowskiGroup.add(eventOrigin);

    const worldlineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -2.5, 0),
      new THREE.Vector3(0, 2.5, 0)
    ]);
    const worldline = new THREE.Line(
      worldlineGeo,
      new THREE.LineBasicMaterial({ color: 0x34d399 })
    );
    minkowskiGroup.add(worldline);

    const simTimePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 4.4),
      new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide, transparent: true, opacity: 0.18 })
    );
    simTimePlane.rotation.x = Math.PI / 2;
    minkowskiGroup.add(simTimePlane);

    const testEventSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 1.1 })
    );
    minkowskiGroup.add(testEventSphere);

    const lightWaveRing = new THREE.Mesh(
      new THREE.RingGeometry(0.95, 1.04, 40),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
    );
    lightWaveRing.rotation.x = Math.PI / 2;
    minkowskiGroup.add(lightWaveRing);

    // ==================== TOPIC 4: 4D KLEIN BOTTLE IMMERSION ====================
    const kleinGroup = new THREE.Group();
    scene.add(kleinGroup);

    // Parametric Figure-8 Klein bottle immersion in R3
    const uSeg = 48;
    const vSeg = 24;
    const kleinPos: number[] = [];
    const kleinIdx: number[] = [];
    for (let i = 0; i <= uSeg; i++) {
      const u = (i / uSeg) * Math.PI * 2;
      for (let j = 0; j <= vSeg; j++) {
        const v = (j / vSeg) * Math.PI * 2;
        const r = 1.6;
        const cosU2 = Math.cos(u * 0.5);
        const sinU2 = Math.sin(u * 0.5);
        const sinV = Math.sin(v);
        const sin2V = Math.sin(2 * v);
        const radius = r + cosU2 * sinV - sinU2 * sin2V;
        const x = radius * Math.cos(u) * 0.85;
        const z = radius * Math.sin(u) * 0.85;
        const y = (sinU2 * sinV + cosU2 * sin2V) * 0.85;
        kleinPos.push(x, y, z);
      }
    }
    for (let i = 0; i < uSeg; i++) {
      for (let j = 0; j < vSeg; j++) {
        const a = i * (vSeg + 1) + j;
        const b = a + vSeg + 1;
        kleinIdx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const kleinGeo = new THREE.BufferGeometry();
    kleinGeo.setAttribute('position', new THREE.Float32BufferAttribute(kleinPos, 3));
    kleinGeo.setIndex(kleinIdx);
    kleinGeo.computeVertexNormals();

    const kleinMesh = new THREE.Mesh(
      kleinGeo,
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        emissive: 0x6366f1,
        emissiveIntensity: 0.28,
        roughness: 0.22,
        metalness: 0.35,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      })
    );
    kleinGroup.add(kleinMesh);
    const kleinWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(kleinGeo),
      new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.28 })
    );
    kleinGroup.add(kleinWire);

    const tracerBead = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 1.4 })
    );
    kleinGroup.add(tracerBead);

    resetCamRef.current = () => {
      camera.position.set(4.8, 3.6, 5.4);
      controls.target.set(0, 0.2, 0);
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
    const projectedPts: THREE.Vector3[] = Array.from({ length: 16 }, () => new THREE.Vector3());

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
      const curTopic = topicRef.current;

      tesseractGroup.visible = curTopic === 'tesseract';
      hopfGroup.visible = curTopic === 'hypersphere';
      minkowskiGroup.visible = curTopic === 'minkowski';
      kleinGroup.visible = curTopic === 'klein';

      if (curTopic === 'tesseract') {
        const theta = autoSpinRef.current ? elapsed * 0.75 : THREE.MathUtils.degToRad(wAngleRef.current);
        const phi = autoSpinRef.current ? elapsed * 0.45 : THREE.MathUtils.degToRad(zwAngleRef.current);
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const cosP = Math.cos(phi);
        const sinP = Math.sin(phi);

        for (let i = 0; i < 16; i++) {
          const [vx, vy, vz, vw] = TESS_VERTS[i];
          const x1 = vx * cosT - vw * sinT;
          const w1 = vx * sinT + vw * cosT;
          const z2 = vz * cosP - w1 * sinP;
          const w2 = vz * sinP + w1 * cosP;
          const wOffset = 2.6 - (w2 - wSliceRef.current * 0.7);
          const scale = 2.4 / Math.max(0.6, wOffset);
          projectedPts[i].set(x1 * scale, vy * scale, z2 * scale);
          tessVertMeshes[i].position.copy(projectedPts[i]);
          const distScale = THREE.MathUtils.clamp(scale * 0.75, 0.5, 1.45);
          tessVertMeshes[i].scale.setScalar(distScale);
          // Encode W coordinate in vertex hue: cyan (-w) -> magenta (0) -> amber (+w)
          const vMat = tessVertMeshes[i].material as THREE.MeshStandardMaterial;
          if (w2 > 0.35) {
            vMat.color.setHex(0xfbbf24);
            vMat.emissive.setHex(0xf59e0b);
          } else if (w2 < -0.35) {
            vMat.color.setHex(0x38bdf8);
            vMat.emissive.setHex(0x0284c7);
          } else {
            vMat.color.setHex(0xe879f9);
            vMat.emissive.setHex(0xc026d3);
          }
        }

        const posArr = tessGeo.attributes.position.array as Float32Array;
        for (let e = 0; e < TESS_EDGES.length; e++) {
          const [a, b] = TESS_EDGES[e];
          const pa = projectedPts[a];
          const pb = projectedPts[b];
          posArr[e * 6] = pa.x;
          posArr[e * 6 + 1] = pa.y;
          posArr[e * 6 + 2] = pa.z;
          posArr[e * 6 + 3] = pb.x;
          posArr[e * 6 + 4] = pb.y;
          posArr[e * 6 + 5] = pb.z;
        }
        tessGeo.attributes.position.needsUpdate = true;
        sliceRing.position.y = wSliceRef.current * 1.1;
      } else if (curTopic === 'hypersphere') {
        hopfGroup.rotation.y += dt * (autoSpinRef.current ? 0.55 : 0.1);
        hopfGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.35;
      } else if (curTopic === 'minkowski') {
        const b = betaRef.current;
        const wAttr = worldlineGeo.attributes.position.array as Float32Array;
        wAttr[0] = -2.4 * b;
        wAttr[1] = -2.4;
        wAttr[3] = 2.4 * b;
        wAttr[4] = 2.4;
        worldlineGeo.attributes.position.needsUpdate = true;
        simTimePlane.rotation.z = Math.atan(b);
        testEventSphere.position.set(eventDxRef.current, eventCtRef.current, 0);
        const evMat = testEventSphere.material as THREE.MeshStandardMaterial;
        const ds2 = -(eventCtRef.current ** 2) + eventDxRef.current ** 2;
        evMat.color.setHex(ds2 < -0.05 ? 0x34d399 : Math.abs(ds2) <= 0.05 ? 0xfacc15 : 0xf43f5e);
        evMat.emissive.copy(evMat.color);
        const pulseR = ((elapsed * 0.9) % 1) * 2.2 + 0.15;
        lightWaveRing.position.y = ((elapsed * 0.9) % 1) * 2.2;
        lightWaveRing.scale.setScalar(pulseR);
      } else if (curTopic === 'klein') {
        kleinGroup.rotation.y += dt * (autoSpinRef.current ? 0.48 : 0.08);
        const u = elapsed * 1.1;
        const v = elapsed * 2.2;
        const radius = 1.6 + Math.cos(u * 0.5) * Math.sin(v) - Math.sin(u * 0.5) * Math.sin(2 * v);
        tracerBead.position.set(
          radius * Math.cos(u) * 0.85,
          (Math.sin(u * 0.5) * Math.sin(v) + Math.cos(u * 0.5) * Math.sin(2 * v)) * 0.85,
          radius * Math.sin(u) * 0.85
        );
      }

      controls.update();
      renderer.render(scene, camera);

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
          m.geometry.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material.dispose();
        }
      });
      envRT.dispose();
      renderer.dispose();
    };
  }, [perfMode]);

  const activeLecture = FOUR_D_LECTURES.find((l) => l.id === topic) || FOUR_D_LECTURES[0];
  const dsSquared = -(eventCt * eventCt) + eventDx * eventDx;
  const intervalLabel =
    dsSquared < -0.05
      ? isEn ? 'TIMELIKE (Causal)' : 'DẠNG THỜI GIAN (Nhân quả)'
      : Math.abs(dsSquared) <= 0.05
      ? isEn ? 'LIGHTLIKE (Null Cone)' : 'DẠNG ÁNH SÁNG (Trên Nón)'
      : isEn ? 'SPACELIKE (Acausal)' : 'DẠNG KHÔNG GIAN (Phi nhân quả)';

  if (webglError) {
    return (
      <div className="p-8 rounded-xl border border-rose-500/40 bg-slate-950 text-center text-rose-300 text-sm">
        WebGL 3D Unavailable
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`flex flex-col lg:block lg:relative w-full rounded-xl overflow-hidden border border-fuchsia-500/35 bg-[#060918] shadow-2xl select-none ${
        isFullscreen ? 'fixed inset-0 z-[140] h-[100dvh] rounded-none border-0 overflow-y-auto lg:overflow-hidden' : 'lg:h-[700px]'
      }`}
    >
      {/* Top-Left 4D Lecture Card */}
      <div className="relative lg:pointer-events-none lg:absolute lg:top-3 lg:left-3 z-20 p-2.5 lg:p-0 bg-slate-950/95 lg:bg-transparent border-b border-slate-800 lg:border-b-0 lg:max-w-md space-y-1.5 shrink-0">
        <div className="lg:pointer-events-auto flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-fuchsia-400/40 text-xs font-mono">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
            <span className="font-extrabold text-white truncate">{isEn ? activeLecture.titleEn : activeLecture.titleVi}</span>
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="min-h-[32px] min-w-[32px] inline-flex items-center justify-center rounded border border-slate-700 bg-slate-900 text-slate-200 cursor-pointer shrink-0"
            title={isEn ? 'Fullscreen' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="px-3 py-2 rounded-lg bg-slate-950/88 border border-slate-700/80 text-[11px] space-y-1">
          <div className="font-mono font-bold text-cyan-300">{activeLecture.formula}</div>
          <p className="text-slate-200 leading-relaxed">{isEn ? activeLecture.lessonEn : activeLecture.lessonVi}</p>
        </div>
      </div>

      {/* Unobstructed 3D Viewport */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1 min-h-[260px] lg:absolute lg:inset-0 lg:h-full' : 'h-[290px] sm:h-[380px] lg:absolute lg:inset-0 lg:h-full'}`}>
        <div ref={mountRef} className="w-full h-full" />
        {contextLost && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/90 text-fuchsia-300 text-sm font-mono">
            Restoring 4D Projection Viewport...
          </div>
        )}
      </div>

      {/* Collapsible Bottom Dock */}
      <div className="relative lg:absolute lg:bottom-3 lg:left-1/2 lg:-translate-x-1/2 z-20 w-full lg:w-[95%] lg:max-w-[940px] flex flex-col items-center gap-1.5 p-2 lg:p-0 bg-slate-950 lg:bg-transparent border-t border-slate-800 lg:border-t-0 shrink-0">
        <button
          type="button"
          onClick={() => setControlsVisible((v) => !v)}
          className="min-h-[36px] px-3 py-1 rounded-md bg-slate-950/92 border border-fuchsia-400/40 text-[11px] font-mono font-bold text-fuchsia-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          {controlsVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>
            {controlsVisible
              ? isEn ? 'Hide 4D Controls' : 'Thu gọn Bảng 4D'
              : isEn ? 'Show 4D Controls' : 'Mở Bảng 4D'}
          </span>
        </button>

        {controlsVisible && (
          <div className="w-full max-h-[38dvh] lg:max-h-none overflow-y-auto rounded-xl bg-slate-950/94 border border-slate-700/85 p-3 sm:p-4 space-y-3 text-xs text-slate-100 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap gap-1.5 w-full sm:w-auto scrollbar-none pb-0.5 sm:pb-0">
                {FOUR_D_LECTURES.map((lec) => (
                  <button
                    key={lec.id}
                    type="button"
                    onClick={() => {
                      setTopic(lec.id);
                      onEarnXP?.(15);
                    }}
                    className={`min-h-[36px] px-2.5 py-1 rounded border text-[11px] font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                      topic === lec.id
                        ? 'bg-fuchsia-500/25 border-fuchsia-400 text-fuchsia-200'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    {lec.id === 'minkowski' ? <Clock className="w-3 h-3" /> : <Box className="w-3 h-3" />}
                    <span>{isEn ? lec.titleEn : lec.titleVi}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setAutoSpin4D((s) => !s)}
                  className={`min-h-[36px] px-3 py-1 rounded border text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                    autoSpin4D
                      ? 'bg-sky-500 text-slate-950 border-sky-300'
                      : 'bg-slate-800 border-slate-600 text-slate-200'
                  }`}
                >
                  {autoSpin4D ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isEn ? '4D Spin' : 'Xoay Trục W'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => resetCamRef.current?.()}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded border border-slate-700 bg-slate-900 text-slate-200 cursor-pointer"
                  title="Reset View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {topic === 'tesseract' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <label className="space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-300">{isEn ? 'XW Plane Rotation' : 'Góc xoay XW'}</span>
                    <span className="text-fuchsia-300 font-bold">{wAngleDeg}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={wAngleDeg}
                    onChange={(e) => {
                      setAutoSpin4D(false);
                      setWAngleDeg(Number(e.target.value));
                    }}
                    className="w-full accent-fuchsia-500 cursor-pointer"
                  />
                </label>

                <label className="space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-300">{isEn ? 'ZW Plane Rotation' : 'Góc xoay ZW'}</span>
                    <span className="text-sky-300 font-bold">{zwAngleDeg}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={zwAngleDeg}
                    onChange={(e) => {
                      setAutoSpin4D(false);
                      setZwAngleDeg(Number(e.target.value));
                    }}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </label>

                <label className="space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-300">{isEn ? 'W Slice (Color Coded)' : 'Mặt cắt Siêu phẳng w'}</span>
                    <span className="text-amber-300 font-bold">{wSlice.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={0.05}
                    value={wSlice}
                    onChange={(e) => setWSlice(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </label>
              </div>
            )}

            {topic === 'minkowski' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <label className="space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      β = v/c
                    </span>
                    <span className="text-emerald-300 font-bold">
                      {betaVelocity.toFixed(2)}c (γ={(1 / Math.sqrt(Math.max(0.05, 1 - betaVelocity * betaVelocity))).toFixed(2)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-0.85}
                    max={0.85}
                    step={0.02}
                    value={betaVelocity}
                    onChange={(e) => setBetaVelocity(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </label>

                <label className="space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-300">Event Δct</span>
                    <span className="text-cyan-300 font-bold">{eventCt.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={-2.0}
                    max={2.0}
                    step={0.05}
                    value={eventCt}
                    onChange={(e) => setEventCt(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </label>

                <label className="space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-300">Event Δx</span>
                    <span className="text-rose-300 font-bold">{eventDx.toFixed(2)} · {intervalLabel}</span>
                  </div>
                  <input
                    type="range"
                    min={-2.0}
                    max={2.0}
                    step={0.05}
                    value={eventDx}
                    onChange={(e) => setEventDx(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </label>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
