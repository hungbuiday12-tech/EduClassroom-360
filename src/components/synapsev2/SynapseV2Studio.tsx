import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Cpu,
  Disc,
  Dna,
  Eye,
  EyeOff,
  Flame,
  Infinity as InfinityIcon,
  Layers,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Orbit,
  Pause,
  Play,
  Radar,
  Radio,
  Rocket,
  RotateCcw,
  Satellite,
  Search,
  Server,
  Share2,
  ShieldCheck,
  Sliders,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  Waves
} from 'lucide-react';
import { SubjectType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  buildCitadelEnvironment,
  buildCosmicSkyDome,
  buildMonument,
  BuiltMonument,
  computeTelemetry,
  createCircuitPlateTexture,
  createContactShadowTexture,
  createGlowSpriteTexture,
  MONUMENT_CATALOG,
  MonumentCategory,
  MonumentId,
  SynapseV2Params
} from './monumentBuilders';
import { FuturisticThumbPreview } from './FuturisticThumbPreview';
import { FuturisticCosmicBackdrop } from './FuturisticCosmicBackdrop';

interface SynapseV2StudioProps {
  onBack?: () => void;
  onNavigate?: (subject: SubjectType) => void;
  onEarnXP?: (xp: number) => void;
}

type CameraPresetId = 'overview' | 'core' | 'zenith' | 'drone';

const CAMERA_PRESETS: Record<
  CameraPresetId,
  { pos: [number, number, number]; target: [number, number, number]; labelVi: string; labelEn: string }
> = {
  overview: {
    pos: [12.5, 6.2, 13.8],
    target: [0, 0.5, 0],
    labelVi: 'Toàn cảnh Đài',
    labelEn: 'Citadel Overview'
  },
  core: {
    pos: [5.4, 2.1, 5.8],
    target: [0, 0.65, 0],
    labelVi: 'Cận cảnh Lõi',
    labelEn: 'Core Close-Up'
  },
  zenith: {
    pos: [0.1, 17.5, 6.2],
    target: [0, 0, 0],
    labelVi: 'Góc nhìn Từ đỉnh',
    labelEn: 'Zenith Aerial'
  },
  drone: {
    pos: [11.2, 4.4, 11.2],
    target: [0, 0.7, 0],
    labelVi: 'Drone Quỹ đạo',
    labelEn: 'Auto-Orbit Drone'
  }
};

function renderMonumentIcon(id: MonumentId, className = 'w-4 h-4') {
  switch (id) {
    case 'dyson':
      return <Orbit className={`${className} text-sky-400 icon-anim-cosmos`} />;
    case 'tokamak':
      return <Flame className={`${className} text-amber-400 icon-anim-zap`} />;
    case 'tesseract':
      return <Compass className={`${className} text-purple-400 icon-anim-compass`} />;
    case 'neural_aero':
      return <Cpu className={`${className} text-emerald-400 icon-anim-code`} />;
    case 'quantum_cryostat':
      return <Atom className={`${className} text-yellow-400 icon-anim-atom`} />;
    case 'gravitational_ligo':
      return <Waves className={`${className} text-cyan-400 icon-anim-wave`} />;
    case 'space_elevator':
      return <Rocket className={`${className} text-sky-400 icon-anim-trophy`} />;
    case 'warp_alcubierre':
      return <Radar className={`${className} text-indigo-400 icon-anim-cosmos`} />;
    case 'hyperbolic_calabi':
      return <InfinityIcon className={`${className} text-pink-400 icon-anim-compass`} />;
    case 'dna_nanobot':
      return <Dna className={`${className} text-teal-400 icon-anim-branch`} />;
    case 'penning_antimatter':
      return <Sparkles className={`${className} text-rose-400 icon-anim-star`} />;
    case 'fractal_attractor':
      return <Layers className={`${className} text-orange-400 icon-anim-list`} />;
    case 'james_webb':
      return <Satellite className={`${className} text-amber-300 icon-anim-cosmos`} />;
    case 'wormhole_morris':
      return <Disc className={`${className} text-violet-400 icon-anim-compass`} />;
    case 'pulsar_magnetar':
      return <Radio className={`${className} text-cyan-300 icon-anim-wave`} />;
    case 'oort_solar_sail':
      return <Sun className={`${className} text-sky-300 icon-anim-star`} />;
    case 'supercomputer_torus':
      return <Server className={`${className} text-emerald-400 icon-anim-code`} />;
    case 'cpu_pipeline_core':
      return <Cpu className={`${className} text-lime-400 icon-anim-zap`} />;
    case 'blockchain_zk_lattice':
      return <ShieldCheck className={`${className} text-violet-300 icon-anim-branch`} />;
    case 'graph_dijkstra_citadel':
      return <Share2 className={`${className} text-amber-300 icon-anim-list`} />;
    default:
      return <Orbit className={`${className} text-cyan-400 icon-anim-cosmos`} />;
  }
}

export const SynapseV2Studio: React.FC<SynapseV2StudioProps> = ({
  onBack,
  onNavigate,
  onEarnXP
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { location, navigate } = useNavigation();

  // Synced with NavigationContext so clicking 'Lớp học ảo · Synapse v2' in Header always returns to 12-Chamber home
  const studioMode = location.synapseMode || 'catalog';
  const activeId = (MONUMENT_CATALOG.some((m) => m.id === location.synapseMonumentId)
    ? location.synapseMonumentId
    : 'dyson') as MonumentId;

  const [categoryFilter, setCategoryFilter] = useState<'all' | MonumentCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const mountRef = useRef<HTMLDivElement | null>(null);
  const activeDef = useMemo(
    () => MONUMENT_CATALOG.find((m) => m.id === activeId) || MONUMENT_CATALOG[0],
    [activeId]
  );

  // Simulation parameters
  const [primaryParam, setPrimaryParam] = useState<number>(activeDef.primaryRange[2]);
  const [secondaryParam, setSecondaryParam] = useState<number>(activeDef.secondaryRange[2]);
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeScale, setTimeScale] = useState<number>(1.0);
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('drone');
  const [isDockOpen, setIsDockOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [contextLost, setContextLost] = useState<boolean>(false);
  const [webglError, setWebglError] = useState<boolean>(false);
  const [visitedWonders, setVisitedWonders] = useState<MonumentId[]>(['dyson']);
  const [isAmbientOn, setIsAmbientOn] = useState<boolean>(false);

  // Ensure fullscreen exits & parameters stay synced when returning to catalog or navigating Back/Forward
  useEffect(() => {
    if (studioMode === 'catalog') {
      setIsFullscreen(false);
    }
  }, [studioMode]);

  useEffect(() => {
    const def = MONUMENT_CATALOG.find((m) => m.id === activeId) || MONUMENT_CATALOG[0];
    setPrimaryParam(def.primaryRange[2]);
    setSecondaryParam(def.secondaryRange[2]);
    setExplodeFactor(0);
    setIsPaused(false);
  }, [activeId]);

  useEffect(() => {
    const onSynapseReset = () => {
      setIsFullscreen(false);
      setCategoryFilter('all');
      setSearchQuery('');
    };
    window.addEventListener('educlassroom:synapse-reset', onSynapseReset);
    return () => window.removeEventListener('educlassroom:synapse-reset', onSynapseReset);
  }, []);

  const filteredCatalog = useMemo(() => {
    const kw = searchQuery.trim().toLowerCase();
    return MONUMENT_CATALOG.filter((m) => {
      if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
      if (kw) {
        const hay =
          `${m.code} ${m.titleVi} ${m.titleEn} ${m.subtitleVi} ${m.subtitleEn} ${m.descriptionVi}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [categoryFilter, searchQuery]);

  const handleSelectMonument = (nextId: MonumentId, openStage = false) => {
    const def = MONUMENT_CATALOG.find((m) => m.id === nextId) || MONUMENT_CATALOG[0];
    setPrimaryParam(def.primaryRange[2]);
    setSecondaryParam(def.secondaryRange[2]);
    setExplodeFactor(0);
    setIsPaused(false);

    if (openStage || studioMode === 'stage') {
      navigate(
        {
          subject: 'synapse_v2',
          synapseMonumentId: nextId,
          synapseMode: openStage ? 'stage' : studioMode
        },
        { replace: !openStage && studioMode === 'stage' }
      );
    } else {
      navigate({ subject: 'synapse_v2', synapseMonumentId: nextId }, { replace: true });
    }

    if (!visitedWonders.includes(nextId)) {
      setVisitedWonders((prev) => [...prev, nextId]);
      onEarnXP?.(25);
    }
  };

  // Live refs read by requestAnimationFrame without resetting WebGLRenderer
  const paramsRef = useRef<SynapseV2Params>({
    primaryParam,
    secondaryParam,
    explodeFactor,
    timeScale
  });
  paramsRef.current = {
    primaryParam,
    secondaryParam,
    explodeFactor,
    timeScale: isPaused ? 0 : timeScale
  };

  const activeIdRef = useRef<MonumentId>(activeId);
  activeIdRef.current = activeId;

  const presetRef = useRef<CameraPresetId>(cameraPreset);
  presetRef.current = cameraPreset;
  const cameraLerpingRef = useRef<boolean>(false);
  const desiredCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(...CAMERA_PRESETS.drone.pos));
  const desiredTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(...CAMERA_PRESETS.drone.target));

  const applyCameraPreset = (preset: CameraPresetId) => {
    setCameraPreset(preset);
    const cfg = CAMERA_PRESETS[preset];
    desiredCamPosRef.current.set(...cfg.pos);
    desiredTargetRef.current.set(...cfg.target);
    cameraLerpingRef.current = true;
  };

  // Optional procedural harmonic Web Audio cosmic drone
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioGainRef = useRef<GainNode | null>(null);

  const toggleAmbientAudio = () => {
    try {
      if (!isAmbientOn) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = audioCtxRef.current || new AudioCtx();
        audioCtxRef.current = ctx;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        if (!audioGainRef.current) {
          const master = ctx.createGain();
          master.gain.setValueAtTime(0.001, ctx.currentTime);
          master.gain.exponentialRampToValueAtTime(0.055, ctx.currentTime + 0.8);
          master.connect(ctx.destination);
          audioGainRef.current = master;

          const freqs = [110, 164.81, 220, 277.18];
          freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(f, ctx.currentTime);
            const g = ctx.createGain();
            g.gain.value = idx === 0 ? 0.45 : 0.16;
            osc.connect(g);
            g.connect(master);
            osc.start();
          });
        } else {
          audioGainRef.current.gain.setTargetAtTime(0.055, ctx.currentTime, 0.25);
        }
        setIsAmbientOn(true);
      } else {
        if (audioCtxRef.current && audioGainRef.current) {
          audioGainRef.current.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.2);
        }
        setIsAmbientOn(false);
      }
    } catch {
      setIsAmbientOn(false);
    }
  };

  useEffect(() => {
    return () => {
      try {
        if (audioCtxRef.current) {
          audioCtxRef.current.close();
          audioCtxRef.current = null;
          audioGainRef.current = null;
        }
      } catch {}
    };
  }, []);

  // Keyboard shortcuts ('H' to toggle HUD dock, 'Escape' to exit fullscreen)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key.toLowerCase() === 'h' && studioMode === 'stage') {
        setIsDockOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFullscreen, studioMode]);

  // Persistent Three.js Scene & Renderer Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const monumentSlotRef = useRef<THREE.Group | null>(null);
  const activeBuiltRef = useRef<BuiltMonument | null>(null);
  const isSoftwareGlRef = useRef<boolean>(false);

  // Initialize Three.js World ONLY while in 'stage' mode
  useEffect(() => {
    if (studioMode !== 'stage') return;
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
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
    })();
    isSoftwareGlRef.current = isSoftwareGl;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance'
      });
    } catch {
      setWebglError(true);
      return;
    }

    const width = container.clientWidth || 960;
    const height = Math.max(container.clientHeight || 620, 480);
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x07102a);
    scene.fog = new THREE.FogExp2(0x091436, 0.0105);

    const skyDome = buildCosmicSkyDome(isSoftwareGl);
    scene.add(skyDome.mesh);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.88;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 200);
    camera.position.set(...CAMERA_PRESETS.drone.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.055;
    controls.minDistance = 3.2;
    controls.maxDistance = 34;
    controls.maxPolarAngle = Math.PI * 0.62;
    controls.target.set(...CAMERA_PRESETS.drone.target);

    const cancelLerp = () => {
      cameraLerpingRef.current = false;
    };
    controls.addEventListener('start', cancelLerp);

    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x1e1b4b, 0.82);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.25);
    keyLight.position.set(12, 18, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.65);
    rimLight.position.set(-14, 7, -12);
    scene.add(rimLight);

    const magentaFillLight = new THREE.DirectionalLight(0xa855f7, 0.95);
    magentaFillLight.position.set(10, 4, -14);
    scene.add(magentaFillLight);

    const coreAccentLight = new THREE.PointLight(0x6366f1, 2.4, 26, 1.4);
    coreAccentLight.position.set(0, 1.5, 0);
    scene.add(coreAccentLight);

    const glowTex = createGlowSpriteTexture();
    const bgStarsCount = isSoftwareGl ? 600 : 1600;
    const bgStarGeo = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgStarsCount * 3);
    const bgColors = new Float32Array(bgStarsCount * 3);
    const tmpCol = new THREE.Color();
    for (let i = 0; i < bgStarsCount; i++) {
      const r = 34 + Math.random() * 58;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      bgPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      bgPositions[i * 3 + 1] = r * Math.cos(phi);
      bgPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      tmpCol.setHSL(0.55 + (Math.random() - 0.5) * 0.25, 0.7, 0.72 + Math.random() * 0.25);
      bgColors[i * 3] = tmpCol.r;
      bgColors[i * 3 + 1] = tmpCol.g;
      bgColors[i * 3 + 2] = tmpCol.b;
    }
    bgStarGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    bgStarGeo.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));
    const bgStarMat = new THREE.PointsMaterial({
      size: 0.42,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const bgStarField = new THREE.Points(bgStarGeo, bgStarMat);
    scene.add(bgStarField);

    const circuitTex = createCircuitPlateTexture();
    const shadowTex = createContactShadowTexture();
    const citadel = buildCitadelEnvironment(circuitTex, shadowTex, isSoftwareGl);
    scene.add(citadel.group);

    const monumentSlot = new THREE.Group();
    scene.add(monumentSlot);
    monumentSlotRef.current = monumentSlot;

    const initialBuilt = buildMonument(activeIdRef.current, isSoftwareGl);
    monumentSlot.add(initialBuilt.root);
    activeBuiltRef.current = initialBuilt;

    const canvasEl = renderer.domElement;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    canvasEl.addEventListener('webglcontextlost', onContextLost);
    canvasEl.addEventListener('webglcontextrestored', onContextRestored);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    if (resizeObserver) resizeObserver.observe(container);

    let frameId = 0;
    let paceTimer: number | null = null;
    let disposed = false;
    let lastTime = performance.now();
    let elapsed = 0;

    const afterDraw = (cb: () => void) => {
      try {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            paceTimer = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            paceTimer = window.setTimeout(cb, 80);
          }
        };
        paceTimer = window.setTimeout(poll, 5);
      } catch {
        paceTimer = window.setTimeout(cb, 80);
      }
    };

    const tick = () => {
      if (disposed) return;
      if (document.hidden) {
        lastTime = performance.now();
        frameId = requestAnimationFrame(tick);
        return;
      }

      const now = performance.now();
      const rawDelta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const params = paramsRef.current;
      elapsed += rawDelta * (params.timeScale > 0 ? 1 : 0);

      skyDome.update(elapsed);
      citadel.update(elapsed);
      bgStarField.rotation.y += rawDelta * 0.012;
      activeBuiltRef.current?.update(elapsed, rawDelta, params);

      if (cameraLerpingRef.current) {
        const alpha = 1 - Math.exp(-5.5 * rawDelta);
        camera.position.lerp(desiredCamPosRef.current, alpha);
        controls.target.lerp(desiredTargetRef.current, alpha);
        if (camera.position.distanceTo(desiredCamPosRef.current) < 0.05) {
          cameraLerpingRef.current = false;
        }
      } else if (presetRef.current === 'drone' && params.timeScale > 0) {
        const rotAngle = rawDelta * 0.14 * Math.min(1.5, params.timeScale);
        const cx = camera.position.x - controls.target.x;
        const cz = camera.position.z - controls.target.z;
        const cosA = Math.cos(rotAngle);
        const sinA = Math.sin(rotAngle);
        camera.position.x = controls.target.x + cx * cosA - cz * sinA;
        camera.position.z = controls.target.z + cx * sinA + cz * cosA;
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(() => {
          if (!disposed) frameId = requestAnimationFrame(tick);
        });
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      if (paceTimer !== null) window.clearTimeout(paceTimer);
      controls.removeEventListener('start', cancelLerp);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('webglcontextlost', onContextLost);
      canvasEl.removeEventListener('webglcontextrestored', onContextRestored);
      resizeObserver?.disconnect();
      controls.dispose();
      activeBuiltRef.current?.dispose();
      citadel.dispose();
      skyDome.dispose();
      envRT.dispose();
      circuitTex.dispose();
      shadowTex.dispose();
      glowTex.dispose();
      bgStarGeo.dispose();
      bgStarMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      monumentSlotRef.current = null;
      activeBuiltRef.current = null;
    };
  }, [studioMode]);

  // Swap Active Monument inside the persistent WebGL stage cleanly
  useEffect(() => {
    if (studioMode !== 'stage') return;
    const slot = monumentSlotRef.current;
    if (!slot) return;

    if (activeBuiltRef.current) {
      slot.remove(activeBuiltRef.current.root);
      activeBuiltRef.current.dispose();
      activeBuiltRef.current = null;
    }

    const nextBuilt = buildMonument(activeId, isSoftwareGlRef.current);
    slot.add(nextBuilt.root);
    activeBuiltRef.current = nextBuilt;
  }, [activeId, studioMode]);

  const telemetry = useMemo(
    () =>
      computeTelemetry(activeId, {
        primaryParam,
        secondaryParam,
        explodeFactor,
        timeScale
      }),
    [activeId, primaryParam, secondaryParam, explodeFactor, timeScale]
  );

  const primaryDisplay =
    activeId === 'neural_aero' ? (primaryParam / 10).toFixed(1) : Math.round(primaryParam);

  // =========================================================================
  // VIEW 1: FUTURISTIC 20-CARD VIRTUAL CAMPUS LECTURE GALLERY
  // =========================================================================
  if (studioMode === 'catalog') {
    const totalChambers = MONUMENT_CATALOG.length;
    const categories: { id: 'all' | MonumentCategory; vi: string; en: string }[] = [
      { id: 'all', vi: `Tất cả ${totalChambers} Công trình`, en: `All ${totalChambers} Chambers` },
      { id: 'cosmos', vi: 'Khoa học Vũ trụ', en: 'Space Science' },
      { id: 'cs', vi: 'Khoa học Vi tính', en: 'Computer Science' },
      { id: 'physics', vi: 'Vật lí & Năng lượng', en: 'Physics & Energy' },
      { id: 'math', vi: 'Toán học Đa chiều', en: 'Higher-Dim Math' },
      { id: 'future_tech', vi: 'AI & Công nghệ Lượng tử', en: 'AI & Quantum Tech' }
    ];

    const unlockedPct = Math.round((visitedWonders.length / totalChambers) * 100);

    return (
      <>
        <FuturisticCosmicBackdrop />
        <div className="relative z-10 space-y-7 pb-14">
          {/* Futuristic Quantum Command Header Banner */}
          <section className="relative overflow-hidden rounded-[2rem] border border-cyan-400/45 bg-gradient-to-br from-[#0a163b]/88 via-[#0c1438]/90 to-[#190f3d]/88 text-white p-6 sm:p-8 shadow-[0_26px_90px_-18px_rgba(6,182,212,0.52)] backdrop-blur-md">
            {/* Animated Holographic Horizon Grid + Sweeping Scan Beam */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 14% 18%, rgba(34,211,238,0.34) 0%, transparent 45%), radial-gradient(circle at 88% 72%, rgba(168,85,247,0.32) 0%, transparent 48%), linear-gradient(to right, rgba(56,189,248,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.12) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 100% 100%, 30px 30px, 30px 30px'
              }}
            />
            <div
              aria-hidden="true"
              className="holo-scan-beam pointer-events-none absolute inset-x-0 h-20 opacity-45"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, rgba(56,189,248,0.22) 50%, transparent 100%)'
              }}
            />

            {/* Corner Cyber Reticles */}
            <span className="pointer-events-none absolute top-3.5 left-3.5 w-5 h-5 border-t-2 border-l-2 border-cyan-400/75 rounded-tl-md" />
            <span className="pointer-events-none absolute top-3.5 right-3.5 w-5 h-5 border-t-2 border-r-2 border-cyan-400/75 rounded-tr-md" />
            <span className="pointer-events-none absolute bottom-3.5 left-3.5 w-5 h-5 border-b-2 border-l-2 border-violet-400/75 rounded-bl-md" />
            <span className="pointer-events-none absolute bottom-3.5 right-3.5 w-5 h-5 border-b-2 border-r-2 border-violet-400/75 rounded-br-md" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-cyan-500/25 border border-white/20 hover:border-cyan-400/60 text-xs font-bold text-slate-100 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                      <span>{isEn ? 'Back' : 'Quay lại'}</span>
                    </button>
                  )}
                  <span className="inline-flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.22em] text-cyan-300">
                    <Orbit className="w-4 h-4 text-cyan-300 icon-anim-cosmos" />
                    {isEn ? 'SYNAPSE V2 · ORBITAL OBSERVATORY' : 'LỚP HỌC ẢO · SYNAPSE V2'}
                  </span>
                  <span className="text-slate-500" aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-300 font-bold tabular-nums">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {visitedWonders.length}/{totalChambers} {isEn ? 'Chambers Unlocked' : 'Công trình đã thám hiểm'}
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-indigo-200 bg-clip-text text-transparent leading-tight">
                  {isEn
                    ? `${totalChambers} Futuristic Holographic 3D Chambers`
                    : `${totalChambers} Đại Công Trình & Phòng Học Ảo Tương Lai`}
                </h1>

                <p className="text-sm text-sky-100/85 leading-relaxed">
                  {isEn
                    ? `Explore ${totalChambers} real-time procedural WebGL 3D simulations spanning space science (James Webb, Wormhole, Pulsar, Solar Sail), computer science (Exascale Torus, Superscalar CPU, ZK-Merkle, Dijkstra Graph), quantum tech, and relativistic physics.`
                    : `Hệ thống ${totalChambers} đại công trình mô phỏng 3D WebGL thời gian thực vượt bậc: từ Khoa học Vũ trụ (Kính James Webb, Lỗ Sâu Morris-Thorne, Sao Neutron Pulsar, Cánh Buồm Ánh Sáng) đến Khoa học Vi tính (Siêu Máy Tính Exascale, Vi Xử Lí Đường Ống 5 Tầng, Mạng Khối ZK-Merkle, Đồ Thị Dijkstra 3D) cùng Vật lí và Toán học đa chiều.`}
                </p>

                {/* Quantum Exploration Progress Bar */}
                <div className="pt-1 max-w-md space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-200/90">
                    <span>{isEn ? 'CAMPUS EXPLORATION MATRIX' : 'TIẾN ĐỘ KHÁM PHÁ VŨ TRỤ ẢO'}</span>
                    <span className="font-bold text-emerald-300 tabular-nums">{unlockedPct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-900/80 border border-cyan-500/30 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 transition-all duration-500"
                      style={{ width: `${Math.max(8, unlockedPct)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3.5 shrink-0">
                {/* Animated Orbital Astrolabe Emblem */}
                <div
                  aria-hidden="true"
                  className="hidden lg:flex items-center justify-center relative w-24 h-24 rounded-full border border-cyan-400/35 bg-cyan-950/35 shadow-[0_0_35px_rgba(34,211,238,0.25)]"
                >
                  <svg viewBox="0 0 100 100" className="w-20 h-20">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="5 6" className="holo-orbit-cw" />
                    <ellipse cx="50" cy="50" rx="34" ry="13" fill="none" stroke="#a855f7" strokeWidth="1.6" className="holo-orbit-ccw" />
                    <ellipse cx="50" cy="50" rx="34" ry="13" transform="rotate(60 50 50)" fill="none" stroke="#22d3ee" strokeWidth="1.4" />
                    <circle cx="50" cy="50" r="7" fill="#38bdf8" className="holo-ring-pulse" />
                  </svg>
                </div>

                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => handleSelectMonument(activeId, true)}
                  className="group cs-deck-btn px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 text-slate-950 font-extrabold text-sm shadow-[0_14px_38px_-6px_rgba(34,211,238,0.75)] flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-4 h-4 fill-slate-950 icon-anim-wave" />
                  <span>{isEn ? 'Launch 3D Observatory' : 'Vào Ngay Không Gian 3D'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-xs font-mono text-cyan-200/90 text-right tabular-nums">
                  +25 XP {isEn ? 'per newly explored chamber' : 'khi mở mỗi công trình mới'}
                </div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="relative z-10 mt-6 pt-5 border-t border-cyan-400/20 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => {
                  const selected = categoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`group cs-deck-btn px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer border transition-all ${
                        selected
                          ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 border-cyan-200 shadow-[0_8px_24px_-4px_rgba(34,211,238,0.75)]'
                          : 'bg-sky-950/55 text-sky-100 border-cyan-400/20 hover:bg-cyan-950/75 hover:text-white hover:border-cyan-400/60'
                      }`}
                    >
                      {isEn ? cat.en : cat.vi}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-cyan-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isEn
                      ? `Search ${totalChambers} holographic labs...`
                      : `Tìm ${totalChambers} đại công trình tương lai...`
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/65 border border-cyan-400/30 focus:border-cyan-300 focus:outline-none text-xs text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </section>

          {/* 12 Futuristic Holographic Lecture Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCatalog.map((item) => {
              const isExplored = visitedWonders.includes(item.id);
              return (
                <div
                  key={item.id}
                  style={
                    {
                      '--holo-accent': item.accentHex,
                      '--holo-secondary': item.secondaryHex
                    } as React.CSSProperties
                  }
                  className="holo-card-frame group shadow-[0_20px_50px_-14px_rgba(14,165,233,0.35)] hover:shadow-[0_28px_70px_-12px_rgba(34,211,238,0.58)]"
                >
                  {/* Rotating Holographic Conic Plasma Perimeter Ring */}
                  <div aria-hidden="true" className="holo-conic-ring" />

                  {/* Card Inner Futuristic Container */}
                  <button
                    type="button"
                    data-ripple="true"
                    onClick={() => handleSelectMonument(item.id, true)}
                    className="relative z-10 w-full h-full flex flex-col justify-between text-left rounded-[1.42rem] bg-gradient-to-br from-[#0a1536] via-[#08102b] to-[#130d31] text-white overflow-hidden cursor-pointer"
                  >
                    <div>
                      {/* Live Animated Holographic Artwork Header */}
                      <FuturisticThumbPreview
                        id={item.id}
                        accentHex={item.accentHex}
                        secondaryHex={item.secondaryHex}
                      />

                      {/* Card Body */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {renderMonumentIcon(item.id, 'w-4 h-4 shrink-0')}
                            <span className="font-extrabold text-cyan-300 truncate">{item.code}</span>
                            <span className="text-slate-500" aria-hidden="true">·</span>
                            <span className="text-sky-200/75 truncate">
                              {isEn ? item.categoryLabelEn : item.categoryLabelVi}
                            </span>
                          </div>

                          {isExplored ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {isEn ? 'Unlocked' : 'Đã mở'}
                            </span>
                          ) : (
                            <span className="text-amber-300 font-bold shrink-0">+25 XP</span>
                          )}
                        </div>

                        <h3 className="font-display text-base sm:text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                          {isEn ? item.titleEn : item.titleVi}
                        </h3>

                        <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-2">
                          {isEn ? item.descriptionEn : item.descriptionVi}
                        </p>

                        {/* Futuristic Telemetry Spec Bar */}
                        <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div className="rounded-xl bg-sky-950/45 border border-cyan-400/20 px-2.5 py-1.5 truncate">
                            <span className="text-sky-300/70 block text-[9px] uppercase">
                              {isEn ? item.primaryLabelEn : item.primaryLabelVi}
                            </span>
                            <span className="text-cyan-300 font-bold tabular-nums">
                              {item.primaryRange[0]}–{item.primaryRange[1]} {item.primaryUnit}
                            </span>
                          </div>
                          <div className="rounded-xl bg-indigo-950/45 border border-indigo-400/20 px-2.5 py-1.5 truncate">
                            <span className="text-indigo-200/70 block text-[9px] uppercase">
                              {isEn ? item.secondaryLabelEn : item.secondaryLabelVi}
                            </span>
                            <span className="text-amber-300 font-bold tabular-nums">
                              {item.secondaryRange[0]}–{item.secondaryRange[1]} {item.secondaryUnit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Launch Bar */}
                    <div className="px-5 py-3.5 border-t border-cyan-400/15 bg-gradient-to-r from-cyan-500/[0.06] to-violet-500/[0.08] flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-[11px] text-sky-200/75 truncate">
                        {item.tierBadge} · 3D Cutaway
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-extrabold text-cyan-300 group-hover:text-white transition-colors shrink-0">
                        <span>{isEn ? 'Launch 3D' : 'Khởi chạy 3D'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // =========================================================================
  // VIEW 2: FULL INTERACTIVE 3D WEBGL OBSERVATORY STAGE
  // =========================================================================
  return (
    <>
      {!isFullscreen && <FuturisticCosmicBackdrop />}
      <div
        className={
          isFullscreen
            ? 'fixed inset-0 z-[120] bg-[#07102a] text-white flex flex-col overflow-hidden'
            : 'relative z-10 w-full min-h-[700px] h-[calc(100vh-146px)] rounded-3xl overflow-hidden border border-cyan-400/50 bg-[#07102a] text-white shadow-[0_28px_90px_-14px_rgba(34,211,238,0.52)]'
        }
      >
        {/* Full-Viewport 3D Observatory Canvas */}
        <div
          ref={mountRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Fallback UI if WebGL Unavailable or Context Lost */}
        {(webglError || contextLost) && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/95 p-6 text-center">
            <div className="max-w-md space-y-3 rounded-2xl border border-cyan-500/40 bg-slate-900 p-6">
              <Orbit className="w-10 h-10 text-cyan-400 mx-auto" />
              <h3 className="font-display text-lg font-bold text-white">
                {isEn ? 'Reconnecting WebGL Observatory...' : 'Đang khôi phục Không gian 3D WebGL...'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isEn
                  ? 'Your graphics context paused momentarily. Return to the gallery or switch chambers to resume.'
                  : 'Bộ tăng tốc đồ họa tạm ngắt kết nối. Quay lại danh sách hoặc đổi công trình để tiếp tục.'}
              </p>
            </div>
          </div>
        )}

        {/* TOP FLOATING HEADER STRIP (Solid obsidian over WebGL - no backdrop-blur stalling) */}
        <div className="relative z-20 pointer-events-none p-3 sm:p-4 flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Catalog Back + Brand Title */}
            <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-slate-950/92 border border-cyan-400/30 rounded-2xl px-3 py-2 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setIsFullscreen(false);
                  navigate({ subject: 'synapse_v2', synapseMode: 'catalog' });
                }}
                className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/50 text-cyan-200 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                title={
                  isEn
                    ? `Return to ${MONUMENT_CATALOG.length} Virtual Chambers`
                    : `Quay lại ${MONUMENT_CATALOG.length} Khung Lớp Học Ảo`
                }
              >
                <LayoutGrid className="w-3.5 h-3.5 text-cyan-300" />
                <span>
                  {isEn ? `${MONUMENT_CATALOG.length} Chambers` : `${MONUMENT_CATALOG.length} Khung Ảo`}
                </span>
              </button>
            <Orbit className="w-5 h-5 text-cyan-400 icon-anim-cosmos shrink-0 hidden sm:inline" />
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-cyan-300">
                {activeDef.code}
              </div>
              <h1 className="font-display text-xs sm:text-sm font-extrabold text-white leading-tight">
                {isEn ? activeDef.titleEn : activeDef.titleVi}
              </h1>
            </div>
          </div>

          {/* Right Quick Actions: Audio + Camera Presets + Hide Dock + Fullscreen */}
          <div className="pointer-events-auto flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={toggleAmbientAudio}
              className={`group flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                isAmbientOn
                  ? 'bg-emerald-500/20 border-emerald-400/70 text-emerald-300'
                  : 'bg-slate-950/92 border-white/15 text-slate-200 hover:border-cyan-400/60'
              }`}
              title={isEn ? 'Cosmic Resonance Audio' : 'Âm thanh Cộng hưởng Vũ trụ'}
            >
              {isAmbientOn ? (
                <Volume2 className="w-4 h-4 icon-anim-wave" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <span className="hidden md:inline">
                {isEn ? 'Cosmic Audio' : 'Âm thanh 3D'}
              </span>
            </button>

            <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-slate-950/92 border border-white/15">
              {(Object.keys(CAMERA_PRESETS) as CameraPresetId[]).map((pid) => (
                <button
                  key={pid}
                  type="button"
                  onClick={() => applyCameraPreset(pid)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    cameraPreset === pid
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span>{isEn ? CAMERA_PRESETS[pid].labelEn : CAMERA_PRESETS[pid].labelVi}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsDockOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/92 border border-white/15 hover:border-cyan-400/60 text-xs font-bold text-slate-200 cursor-pointer"
              title={isEn ? 'Toggle Control Console (H)' : 'Thu gọn/Mở bảng điều khiển (Phím H)'}
            >
              {isDockOpen ? (
                <EyeOff className="w-4 h-4 text-cyan-400" />
              ) : (
                <Eye className="w-4 h-4 text-cyan-400" />
              )}
              <span className="hidden sm:inline">
                {isDockOpen
                  ? isEn
                    ? 'Hide HUD (H)'
                    : 'Thu gọn (H)'
                  : isEn
                  ? 'Show HUD (H)'
                  : 'Mở điều khiển (H)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen((v) => !v)}
              className="p-2 rounded-xl bg-slate-950/92 border border-white/15 hover:border-cyan-400/60 text-slate-200 cursor-pointer"
              title={isEn ? 'Toggle Fullscreen' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick Strip of All Futuristic Chambers */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {MONUMENT_CATALOG.map((m) => {
            const selected = m.id === activeId;
            return (
              <button
                key={m.id}
                type="button"
                data-ripple="true"
                onClick={() => handleSelectMonument(m.id, false)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-left transition-all shrink-0 cursor-pointer ${
                  selected
                    ? 'bg-indigo-950/95 border-cyan-400 text-white shadow-lg'
                    : 'bg-slate-950/88 border-white/12 text-slate-300 hover:border-white/35 hover:text-white'
                }`}
              >
                {renderMonumentIcon(m.id, 'w-3.5 h-3.5 shrink-0')}
                <div className="leading-tight">
                  <div className="text-[9px] font-mono text-cyan-300/90 font-bold">
                    #{String(m.index).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] font-extrabold whitespace-nowrap">
                    {isEn ? m.titleEn.split('&')[0].trim() : m.titleVi.split('&')[0].trim()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* COLLAPSIBLE BOTTOM CONTROL & SCIENTIFIC TELEMETRY DOCK */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4 pointer-events-none flex flex-col items-center">
        {!isDockOpen ? (
          <button
            type="button"
            onClick={() => setIsDockOpen(true)}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/95 border border-cyan-400/50 text-xs font-bold text-cyan-200 hover:bg-indigo-950 shadow-lg cursor-pointer"
          >
            <ChevronUp className="w-4 h-4 text-cyan-400" />
            <span>
              {isEn ? 'Expand Engineering Console (H)' : 'Mở Bảng Điều Khiển Đại Công Trình (H)'}
            </span>
          </button>
        ) : (
          <div className="pointer-events-auto w-full max-w-6xl rounded-3xl bg-slate-950/94 border border-white/15 shadow-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isEn ? telemetry.statusEn : telemetry.statusVi}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">
                    {isEn
                      ? `Explored ${visitedWonders.length}/${MONUMENT_CATALOG.length} Chambers (+25 XP each)`
                      : `Đã thám hiểm ${visitedWonders.length}/${MONUMENT_CATALOG.length} Công trình`}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {isEn ? activeDef.descriptionEn : activeDef.descriptionVi}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsPaused((p) => !p)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer"
                >
                  {isPaused ? (
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{isPaused ? (isEn ? 'Resume' : 'Tiếp tục') : isEn ? 'Pause' : 'Tạm dừng'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPrimaryParam(activeDef.primaryRange[2]);
                    setSecondaryParam(activeDef.secondaryRange[2]);
                    setExplodeFactor(0);
                    setTimeScale(1);
                    setIsPaused(false);
                    applyCameraPreset('drone');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 cursor-pointer"
                  title={isEn ? 'Reset parameters' : 'Đặt lại thông số'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Reset' : 'Đặt lại'}</span>
                </button>

                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate(activeDef.relatedSubject)}
                    className="group flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold cursor-pointer transition-colors"
                  >
                    <span>{isEn ? activeDef.relatedLabelEn : activeDef.relatedLabelVi}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsDockOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
                  title={isEn ? 'Collapse dock' : 'Thu gọn'}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1.5 bg-white/[0.04] border border-white/10 rounded-2xl p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300 truncate flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-cyan-400 shrink-0" />
                      {isEn ? activeDef.primaryLabelEn : activeDef.primaryLabelVi}
                    </span>
                    <span className="font-mono font-extrabold text-cyan-300 tabular-nums shrink-0">
                      {primaryDisplay} {activeDef.primaryUnit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={activeDef.primaryRange[0]}
                    max={activeDef.primaryRange[1]}
                    step={1}
                    value={primaryParam}
                    onChange={(e) => setPrimaryParam(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 bg-white/[0.04] border border-white/10 rounded-2xl p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300 truncate">
                      {isEn ? activeDef.secondaryLabelEn : activeDef.secondaryLabelVi}
                    </span>
                    <span className="font-mono font-extrabold text-amber-300 tabular-nums shrink-0">
                      {Math.round(secondaryParam)} {activeDef.secondaryUnit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={activeDef.secondaryRange[0]}
                    max={activeDef.secondaryRange[1]}
                    step={1}
                    value={secondaryParam}
                    onChange={(e) => setSecondaryParam(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 bg-white/[0.04] border border-white/10 rounded-2xl p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300 truncate">
                      {isEn ? 'Exploded Cutaway' : 'Mặt cắt / Tách lớp 3D'}
                    </span>
                    <span className="font-mono font-extrabold text-purple-300 tabular-nums shrink-0">
                      {Math.round(explodeFactor * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round(explodeFactor * 100)}
                    onChange={(e) => setExplodeFactor(Number(e.target.value) / 100)}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="md:col-span-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-3 py-2.5">
                  <div className="text-[10px] text-slate-400 truncate">
                    {isEn ? telemetry.metric1LabelEn : telemetry.metric1LabelVi}
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-extrabold text-cyan-300 tabular-nums mt-0.5 truncate">
                    {telemetry.metric1Value}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-3 py-2.5">
                  <div className="text-[10px] text-slate-400 truncate">
                    {isEn ? telemetry.metric2LabelEn : telemetry.metric2LabelVi}
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-extrabold text-amber-300 tabular-nums mt-0.5 truncate">
                    {telemetry.metric2Value}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-3 py-2.5">
                  <div className="text-[10px] text-slate-400 truncate">
                    {isEn ? telemetry.metric3LabelEn : telemetry.metric3LabelVi}
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-extrabold text-emerald-300 tabular-nums mt-0.5 truncate">
                    {telemetry.metric3Value}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};
