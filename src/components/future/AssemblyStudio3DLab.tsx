import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  EyeOff,
  Gauge,
  Layers,
  Magnet,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Timer,
  Volume2,
  VolumeX,
  Wrench,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import { ASSEMBLY_MODELS } from './assembly/assemblyCatalog';
import {
  buildAssemblyPartMesh,
  buildGhostHologramClone,
  createCarbonWeaveTexture,
} from './assembly/assemblyMeshes';
import {
  AssemblyDifficulty,
  AssemblyModelId,
  AssemblyPartSpec,
  PartRuntimeNode,
} from './assembly/assemblyTypes';

interface AssemblyStudio3DLabProps {
  onEarnXP?: (xp: number) => void;
}

const _vec3 = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _dragPlane = new THREE.Plane();
const _planeHit = new THREE.Vector3();
const _camDir = new THREE.Vector3();
const _pointerNdc = new THREE.Vector2();

function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const AssemblyStudio3DLab: React.FC<AssemblyStudio3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { resolvedTheme } = useBackgroundTheme();
  const isDark = resolvedTheme === 'dark';

  const [selectedModelId, setSelectedModelId] = useState<AssemblyModelId>('v4_engine');
  const activeModel = useMemo(
    () => ASSEMBLY_MODELS.find((m) => m.id === selectedModelId) || ASSEMBLY_MODELS[0],
    [selectedModelId]
  );

  const [difficulty, setDifficulty] = useState<AssemblyDifficulty>('guided');
  const [installedIds, setInstalledIds] = useState<string[]>(() => {
    const base = ASSEMBLY_MODELS[0].parts.find((p) => p.isBase);
    return base ? [base.id] : [];
  });
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);
  const [draggingPartId, setDraggingPartId] = useState<string | null>(null);
  const [snapReadyPartId, setSnapReadyPartId] = useState<string | null>(null);
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [showGhostGuides, setShowGhostGuides] = useState<boolean>(true);
  const [isAutoAssembling, setIsAutoAssembling] = useState<boolean>(false);
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [runSpeed, setRunSpeed] = useState<number>(1.0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'ok' | 'warn' | 'complete';
    text: string;
  } | null>(null);

  // Speedrun / Accuracy telemetry
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [buildCompleted, setBuildCompleted] = useState<boolean>(false);
  const timerStartRef = useRef<number | null>(null);
  const rewardedModelsRef = useRef<Set<string>>(new Set());

  // Mutable refs for 60fps Three.js loop
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const installedIdsRef = useRef<string[]>(installedIds);
  const selectedPartIdRef = useRef<string | null>(selectedPartId);
  const hoveredPartIdRef = useRef<string | null>(hoveredPartId);
  const draggingPartIdRef = useRef<string | null>(draggingPartId);
  const snapReadyRef = useRef<string | null>(snapReadyPartId);
  const explodeRef = useRef<number>(explodeFactor);
  const showGhostsRef = useRef<boolean>(showGhostGuides);
  const difficultyRef = useRef<AssemblyDifficulty>(difficulty);
  const isRunningTestRef = useRef<boolean>(isRunningTest);
  const runSpeedRef = useRef<number>(runSpeed);
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  const isDarkRef = useRef<boolean>(isDark);
  const activeModelRef = useRef(activeModel);

  installedIdsRef.current = installedIds;
  selectedPartIdRef.current = selectedPartId;
  hoveredPartIdRef.current = hoveredPartId;
  draggingPartIdRef.current = draggingPartId;
  snapReadyRef.current = snapReadyPartId;
  explodeRef.current = explodeFactor;
  showGhostsRef.current = showGhostGuides;
  difficultyRef.current = difficulty;
  isRunningTestRef.current = isRunningTest;
  runSpeedRef.current = runSpeed;
  soundEnabledRef.current = soundEnabled;
  isDarkRef.current = isDark;
  activeModelRef.current = activeModel;

  // Scene refs for imperative control
  const nodesRef = useRef<Map<string, PartRuntimeNode>>(new Map());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const lockRingMeshRef = useRef<THREE.Mesh | null>(null);
  const lockRingPulseRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const cameraTweenRef = useRef<{
    active: boolean;
    pos: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    pos: new THREE.Vector3(),
    target: new THREE.Vector3(),
  });

  // Web Audio API mechanical snap & test-run synth (zero external .mp3 files)
  const playSynthCue = useCallback((kind: 'snap' | 'error' | 'complete' | 'tick') => {
    if (!soundEnabledRef.current) return;
    try {
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtor();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;

      if (kind === 'snap') {
        // Metallic magnetic click + solid ratchet thud
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(760, now);
        osc1.frequency.exponentialRampToValueAtTime(190, now + 0.085);
        gain1.gain.setValueAtTime(0.18, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc1.connect(gain1).connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.095);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1420, now + 0.02);
        osc2.frequency.exponentialRampToValueAtTime(980, now + 0.075);
        gain2.gain.setValueAtTime(0.09, now + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc2.connect(gain2).connect(ctx.destination);
        osc2.start(now + 0.02);
        osc2.stop(now + 0.085);
      } else if (kind === 'error') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(210, now);
        osc.frequency.linearRampToValueAtTime(145, now + 0.14);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (kind === 'complete') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          const start = now + idx * 0.07;
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.12, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
          osc.connect(gain).connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.3);
        });
      } else if (kind === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1250, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch {}
  }, []);

  // Determine the next recommended part based on order & prerequisites
  const nextRecommendedPart = useMemo(() => {
    const installedSet = new Set(installedIds);
    return (
      activeModel.parts.find(
        (p) => !installedSet.has(p.id) && p.requires.every((req) => installedSet.has(req))
      ) || null
    );
  }, [activeModel, installedIds]);

  const progressPct = Math.round(
    (installedIds.length / Math.max(1, activeModel.parts.length)) * 100
  );
  const isFullyAssembled = installedIds.length === activeModel.parts.length;

  // Reset assembly state when switching models
  const resetModelState = useCallback(
    (modelId: AssemblyModelId, autoMode?: AssemblyDifficulty) => {
      const targetModel = ASSEMBLY_MODELS.find((m) => m.id === modelId) || ASSEMBLY_MODELS[0];
      const base = targetModel.parts.find((p) => p.isBase);
      const initial = base ? [base.id] : [];
      setInstalledIds(initial);
      installedIdsRef.current = initial;
      setSelectedPartId(null);
      setHoveredPartId(null);
      setDraggingPartId(null);
      setSnapReadyPartId(null);
      setExplodeFactor(0);
      setIsAutoAssembling(false);
      setIsRunningTest(false);
      setElapsedMs(0);
      setMistakesCount(0);
      setBuildCompleted(false);
      setFeedbackBanner(null);
      timerStartRef.current = null;
      if (autoMode) setDifficulty(autoMode);
    },
    []
  );

  // Switch model handler
  const handleSelectModel = (modelId: AssemblyModelId) => {
    setSelectedModelId(modelId);
    resetModelState(modelId);
  };

  // Attempt to install a specific part
  const tryInstallPart = useCallback(
    (partId: string, skipOrderWarning = false): boolean => {
      const model = activeModelRef.current;
      const spec = model.parts.find((p) => p.id === partId);
      if (!spec) return false;
      if (installedIdsRef.current.includes(partId)) return true;

      const installedSet = new Set(installedIdsRef.current);
      const missingReq = spec.requires.find((reqId) => !installedSet.has(reqId));

      if (missingReq && !skipOrderWarning) {
        const reqSpec = model.parts.find((p) => p.id === missingReq);
        setMistakesCount((c) => c + 1);
        playSynthCue('error');
        setSelectedPartId(missingReq);
        setFeedbackBanner({
          type: 'warn',
          text: isEn
            ? `Install "${reqSpec?.nameEn || missingReq}" first before mounting "${spec.nameEn}".`
            : `Cần lắp "${reqSpec?.nameVi || missingReq}" trước khi gắn "${spec.nameVi}".`,
        });
        return false;
      }

      if (!timerStartRef.current) {
        timerStartRef.current = performance.now();
      }

      const nextList = [...installedIdsRef.current, partId];
      installedIdsRef.current = nextList;
      setInstalledIds(nextList);
      setSelectedPartId(partId);
      setExplodeFactor(0);

      // Trigger lock ring shockwave at part's assembled world position
      const node = nodesRef.current.get(partId);
      if (node && lockRingMeshRef.current) {
        lockRingMeshRef.current.position.set(
          spec.assembledPos[0],
          spec.assembledPos[1],
          spec.assembledPos[2]
        );
        lockRingMeshRef.current.visible = true;
        lockRingPulseRef.current = 1.0;
        node.flashIntensity = 1.0;
      }

      if (nextList.length >= model.parts.length) {
        setBuildCompleted(true);
        playSynthCue('complete');
        setFeedbackBanner({
          type: 'complete',
          text: isEn
            ? `Assembly Complete! Click "${model.runLabelEn}" or drag the Exploded View slider.`
            : `Hoàn tất lắp ráp 100%! Bấm "${model.runLabelVi}" để chạy thử cơ cấu hoặc kéo thanh Tách lớp 3D.`,
        });
        if (!rewardedModelsRef.current.has(model.id)) {
          rewardedModelsRef.current.add(model.id);
          onEarnXP?.(80);
        }
      } else {
        playSynthCue('snap');
        setFeedbackBanner({
          type: 'ok',
          text: isEn
            ? `Locked ${spec.nameEn} (${nextList.length}/${model.parts.length})`
            : `Đã khớp ${spec.nameVi} (${nextList.length}/${model.parts.length})`,
        });
      }
      return true;
    },
    [isEn, onEarnXP, playSynthCue]
  );

  // Speedrun timer loop
  useEffect(() => {
    if (buildCompleted || !timerStartRef.current) return;
    const id = window.setInterval(() => {
      if (timerStartRef.current && !buildCompleted) {
        setElapsedMs(performance.now() - timerStartRef.current);
      }
    }, 80);
    return () => window.clearInterval(id);
  }, [buildCompleted, installedIds.length]);

  // Auto-assemble sequential cinematic animation
  useEffect(() => {
    if (!isAutoAssembling) return;
    if (installedIds.length >= activeModel.parts.length) {
      setIsAutoAssembling(false);
      return;
    }
    const timer = window.setTimeout(() => {
      const next = activeModel.parts.find((p) => !installedIdsRef.current.includes(p.id));
      if (next) {
        tryInstallPart(next.id, true);
      } else {
        setIsAutoAssembling(false);
      }
    }, 640);
    return () => window.clearTimeout(timer);
  }, [isAutoAssembling, installedIds, activeModel.parts, tryInstallPart]);

  // Subtle watch/engine/test run sound tick
  useEffect(() => {
    if (!isRunningTest || !soundEnabled) return;
    if (selectedModelId === 'tourbillon_watch') {
      const interval = Math.max(90, Math.round(250 / runSpeed));
      const id = window.setInterval(() => playSynthCue('tick'), interval);
      return () => window.clearInterval(id);
    }
    return undefined;
  }, [isRunningTest, soundEnabled, selectedModelId, runSpeed, playSynthCue]);

  // Camera view preset helper
  const moveCameraPreset = (preset: 'iso' | 'front' | 'top' | 'side') => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const [tx, ty, tz] = activeModel.defaultTarget;
    cameraTweenRef.current.target.set(tx, ty, tz);
    if (preset === 'iso') {
      cameraTweenRef.current.pos.set(...activeModel.defaultCameraPos);
    } else if (preset === 'front') {
      cameraTweenRef.current.pos.set(0, ty + 0.8, 6.2);
    } else if (preset === 'top') {
      cameraTweenRef.current.pos.set(0.01, 6.4, 0.9);
    } else {
      cameraTweenRef.current.pos.set(6.2, ty + 1.0, 0.2);
    }
    cameraTweenRef.current.active = true;
  };

  // ==================== BUILD & RUN THREE.JS VIEWPORT ====================
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = mount.clientWidth || 960;
    const height = mount.clientHeight || 600;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const bgHex = isDarkRef.current ? 0x070d1a : 0xf1f5f9;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.032);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(...activeModel.defaultCameraPos);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // Mandatory studio environment reflection
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    // 3-Point Warm/Cool Studio Lighting Rig
    const hemi = new THREE.HemisphereLight(0xdbeafe, 0x334155, 0.72);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(6, 9, 6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.15);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Workbench turntable pedestal & calibration grid
    const pedestalGroup = new THREE.Group();
    const padMat = new THREE.MeshStandardMaterial({
      color: isDarkRef.current ? 0x0f172a : 0xe2e8f0,
      metalness: 0.35,
      roughness: 0.72,
    });
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(2.45, 2.6, 0.14, 48), padMat);
    pad.position.y = -0.68;
    pad.receiveShadow = true;
    pedestalGroup.add(pad);

    const ringRim = new THREE.Mesh(
      new THREE.TorusGeometry(2.46, 0.025, 10, 64),
      new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.45 })
    );
    ringRim.rotation.x = Math.PI / 2;
    ringRim.position.y = -0.61;
    pedestalGroup.add(ringRim);

    const grid = new THREE.GridHelper(
      18,
      28,
      isDarkRef.current ? 0x1e293b : 0xcbd5e1,
      isDarkRef.current ? 0x0f172a : 0xe2e8f0
    );
    grid.position.y = -0.76;
    gridHelperRef.current = grid;
    pedestalGroup.add(grid);
    scene.add(pedestalGroup);

    // Lock-in shockwave ring
    const lockRing = new THREE.Mesh(
      new THREE.RingGeometry(0.45, 0.62, 36),
      new THREE.MeshBasicMaterial({
        color: 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    );
    lockRing.rotation.x = -Math.PI / 2;
    lockRing.visible = false;
    lockRingMeshRef.current = lockRing;
    scene.add(lockRing);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...activeModel.defaultTarget);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.6;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI * 0.56;
    controls.addEventListener('start', () => {
      cameraTweenRef.current.active = false;
    });
    controlsRef.current = controls;

    // Build all parts & ghost holograms for the active model
    const assemblyRoot = new THREE.Group();
    scene.add(assemblyRoot);

    const carbonTex = createCarbonWeaveTexture();
    const runtimeMap = new Map<string, PartRuntimeNode>();
    const pickableObjects: THREE.Object3D[] = [];

    activeModel.parts.forEach((spec) => {
      const built = buildAssemblyPartMesh(activeModel.id, spec.id, isSoftwareGl, carbonTex);
      const partGroup = built.group;
      partGroup.userData.partId = spec.id;
      partGroup.traverse((c) => {
        c.userData.partId = spec.id;
      });

      const isAlreadyInstalled = installedIdsRef.current.includes(spec.id);
      const initPos = new THREE.Vector3(
        ...(isAlreadyInstalled ? spec.assembledPos : spec.stagingPos)
      );
      partGroup.position.copy(initPos);
      assemblyRoot.add(partGroup);
      pickableObjects.push(partGroup);

      // Ghost slot hologram
      const ghostGroup = buildGhostHologramClone(partGroup, spec.accentHex);
      ghostGroup.position.set(...spec.assembledPos);
      assemblyRoot.add(ghostGroup);

      // Alignment laser dashed trajectory line
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        initPos.clone(),
        new THREE.Vector3(...spec.assembledPos),
      ]);
      const lineMat = new THREE.LineDashedMaterial({
        color: new THREE.Color(spec.accentHex),
        dashSize: 0.14,
        gapSize: 0.08,
        transparent: true,
        opacity: 0.65,
      });
      const guideLine = new THREE.Line(lineGeo, lineMat);
      guideLine.computeLineDistances();
      guideLine.visible = false;
      assemblyRoot.add(guideLine);

      runtimeMap.set(spec.id, {
        spec,
        group: partGroup,
        ghostGroup,
        guideLine,
        animatedParts: built.animatedParts,
        seatProgress: isAlreadyInstalled ? 1 : 0,
        currentPos: initPos.clone(),
        targetPos: initPos.clone(),
        flashIntensity: 0,
      });
    });

    nodesRef.current = runtimeMap;

    // Raycaster for hover, 3D drag-and-drop & click-to-snap
    const raycaster = new THREE.Raycaster();
    let pointerDownPos = { x: 0, y: 0 };
    let activeDragId: string | null = null;
    let movedDistance = 0;

    const updateNdc = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      updateNdc(e.clientX, e.clientY);
      pointerDownPos = { x: e.clientX, y: e.clientY };
      movedDistance = 0;
      raycaster.setFromCamera(_pointerNdc, camera);
      const hits = raycaster.intersectObjects(pickableObjects, true);
      if (hits.length === 0) return;

      const hitPartId = hits[0].object.userData?.partId as string | undefined;
      if (!hitPartId) return;

      setSelectedPartId(hitPartId);

      // Only allow dragging parts that are NOT yet installed
      if (!installedIdsRef.current.includes(hitPartId)) {
        const node = runtimeMap.get(hitPartId);
        if (node) {
          activeDragId = hitPartId;
          setDraggingPartId(hitPartId);
          controls.enabled = false;
          camera.getWorldDirection(_camDir);
          _dragPlane.setFromNormalAndCoplanarPoint(_camDir, node.group.position);
          renderer.domElement.style.cursor = 'grabbing';
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      updateNdc(e.clientX, e.clientY);

      if (activeDragId) {
        movedDistance = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
        const node = runtimeMap.get(activeDragId);
        if (!node) return;
        raycaster.setFromCamera(_pointerNdc, camera);
        if (raycaster.ray.intersectPlane(_dragPlane, _planeHit)) {
          _planeHit.y = Math.max(-0.45, Math.min(4.8, _planeHit.y));
          node.targetPos.copy(_planeHit);
          node.currentPos.copy(_planeHit);
          node.group.position.copy(_planeHit);

          _vec3.set(...node.spec.assembledPos);
          const dist = _planeHit.distanceTo(_vec3);
          const ready = dist <= activeModelRef.current.snapDistance;
          const nextReady = ready ? activeDragId : null;
          if (snapReadyRef.current !== nextReady) {
            setSnapReadyPartId(nextReady);
          }
        }
        return;
      }

      // Hover highlight check
      raycaster.setFromCamera(_pointerNdc, camera);
      const hits = raycaster.intersectObjects(pickableObjects, true);
      const hitId = hits.length > 0 ? (hits[0].object.userData?.partId as string | undefined) : null;
      if (hitId !== hoveredPartIdRef.current) {
        setHoveredPartId(hitId || null);
      }
      renderer.domElement.style.cursor =
        hitId && !installedIdsRef.current.includes(hitId) ? 'grab' : hitId ? 'pointer' : 'default';
    };

    const onPointerUp = () => {
      if (activeDragId) {
        const draggedId = activeDragId;
        const node = runtimeMap.get(draggedId);
        activeDragId = null;
        setDraggingPartId(null);
        setSnapReadyPartId(null);
        controls.enabled = true;
        renderer.domElement.style.cursor = 'default';

        if (node) {
          _vec3.set(...node.spec.assembledPos);
          const dist = node.currentPos.distanceTo(_vec3);
          // Snap if dropped within snap threshold OR if user tapped quickly (< 6px drag)
          if (dist <= activeModelRef.current.snapDistance || movedDistance < 6) {
            const ok = tryInstallPart(draggedId, false);
            if (!ok) {
              node.targetPos.set(...node.spec.stagingPos);
            }
          } else {
            // Elastic return back to staging slot when released far away
            node.targetPos.set(...node.spec.stagingPos);
          }
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 960;
      const h = mount.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Pre-compile shaders if hardware GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Animation loop with software-WebGL afterDraw pacing
    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let mechTime = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      // Sync theme colors dynamically without recreating WebGL context
      const wantBg = isDarkRef.current ? 0x070d1a : 0xf1f5f9;
      if ((scene.background as THREE.Color).getHex() !== wantBg) {
        (scene.background as THREE.Color).setHex(wantBg);
        (scene.fog as THREE.FogExp2).color.setHex(wantBg);
        padMat.color.setHex(isDarkRef.current ? 0x0f172a : 0xe2e8f0);
      }

      // Smooth camera preset tween
      if (cameraTweenRef.current.active) {
        camera.position.lerp(cameraTweenRef.current.pos, 1 - Math.exp(-8 * delta));
        controls.target.lerp(cameraTweenRef.current.target, 1 - Math.exp(-8 * delta));
        if (camera.position.distanceTo(cameraTweenRef.current.pos) < 0.03) {
          cameraTweenRef.current.active = false;
        }
      }
      controls.update();

      const installedSet = new Set(installedIdsRef.current);
      const explodeVal = explodeRef.current;
      const nextStepSpec = activeModelRef.current.parts.find(
        (p) => !installedSet.has(p.id) && p.requires.every((r) => installedSet.has(r))
      );

      // Update each part's spring position, staging idle bob, ghost hologram, and guide trajectory
      runtimeMap.forEach((node) => {
        const isInstalled = installedSet.has(node.spec.id);
        const isDraggingThis = draggingPartIdRef.current === node.spec.id;

        if (!isDraggingThis) {
          if (isInstalled) {
            node.seatProgress = THREE.MathUtils.damp(node.seatProgress, 1, 10, delta);
            _vec3.set(
              node.spec.assembledPos[0] + node.spec.explodeOffset[0] * explodeVal,
              node.spec.assembledPos[1] + node.spec.explodeOffset[1] * explodeVal,
              node.spec.assembledPos[2] + node.spec.explodeOffset[2] * explodeVal
            );
            node.targetPos.copy(_vec3);
          } else {
            node.seatProgress = THREE.MathUtils.damp(node.seatProgress, 0, 8, delta);
            const hoverLift =
              hoveredPartIdRef.current === node.spec.id || selectedPartIdRef.current === node.spec.id
                ? 0.22
                : 0;
            const bob = Math.sin(elapsed * 1.9 + node.spec.order * 0.9) * 0.055;
            node.targetPos.set(
              node.spec.stagingPos[0],
              node.spec.stagingPos[1] + bob + hoverLift,
              node.spec.stagingPos[2]
            );
          }

          node.currentPos.x = THREE.MathUtils.damp(node.currentPos.x, node.targetPos.x, 12, delta);
          node.currentPos.y = THREE.MathUtils.damp(node.currentPos.y, node.targetPos.y, 12, delta);
          node.currentPos.z = THREE.MathUtils.damp(node.currentPos.z, node.targetPos.z, 12, delta);
          node.group.position.copy(node.currentPos);
        }

        // Gentle staging turntable rotation on uninstalled floating parts (paused when dragging)
        if (!isInstalled && !isDraggingThis && activeModelRef.current.id !== 'v4_engine') {
          node.group.rotation.y = Math.sin(elapsed * 0.6 + node.spec.order) * 0.16;
        } else {
          node.group.rotation.y = THREE.MathUtils.damp(node.group.rotation.y, 0, 10, delta);
        }

        // Ghost target visibility logic
        const shouldShowGhost =
          !isInstalled &&
          showGhostsRef.current &&
          (difficultyRef.current === 'guided'
            ? nextStepSpec?.id === node.spec.id ||
              selectedPartIdRef.current === node.spec.id ||
              draggingPartIdRef.current === node.spec.id
            : draggingPartIdRef.current === node.spec.id);

        node.ghostGroup.visible = shouldShowGhost;
        if (shouldShowGhost) {
          const isSnapReady = snapReadyRef.current === node.spec.id;
          const pulse = isSnapReady ? 0.52 : 0.2 + Math.sin(elapsed * 4.5) * 0.08;
          node.ghostGroup.traverse((c) => {
            if ((c as THREE.Mesh).isMesh) {
              const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
              m.opacity = pulse;
              m.color.setHex(isSnapReady ? 0x10b981 : new THREE.Color(node.spec.accentHex).getHex());
            }
          });
        }

        // Dashed guide trajectory line between part and target socket
        const showGuide =
          !isInstalled &&
          (draggingPartIdRef.current === node.spec.id ||
            selectedPartIdRef.current === node.spec.id ||
            (difficultyRef.current === 'guided' &&
              showGhostsRef.current &&
              nextStepSpec?.id === node.spec.id));
        node.guideLine.visible = showGuide;
        if (showGuide) {
          const posAttr = node.guideLine.geometry.getAttribute('position') as THREE.BufferAttribute;
          posAttr.setXYZ(0, node.currentPos.x, node.currentPos.y, node.currentPos.z);
          posAttr.setXYZ(
            1,
            node.spec.assembledPos[0],
            node.spec.assembledPos[1],
            node.spec.assembledPos[2]
          );
          posAttr.needsUpdate = true;
          node.guideLine.computeLineDistances();
        }

        // Emissive snap flash decay
        if (node.flashIntensity > 0.005) {
          node.flashIntensity = THREE.MathUtils.damp(node.flashIntensity, 0, 7, delta);
        }
      });

      // Lock shockwave animation
      if (lockRingMeshRef.current && lockRingPulseRef.current > 0.01) {
        lockRingPulseRef.current = THREE.MathUtils.damp(lockRingPulseRef.current, 0, 7, delta);
        const s = 1 + (1 - lockRingPulseRef.current) * 2.1;
        lockRingMeshRef.current.scale.set(s, s, 1);
        const rm = lockRingMeshRef.current.material as THREE.MeshBasicMaterial;
        rm.opacity = lockRingPulseRef.current * 0.8;
        if (lockRingPulseRef.current < 0.02) {
          lockRingMeshRef.current.visible = false;
        }
      }

      // Live Mechanism Kinematics when 100% assembled & Test Run active
      if (isRunningTestRef.current && installedIdsRef.current.length === activeModelRef.current.parts.length) {
        mechTime += delta * runSpeedRef.current;

        if (activeModelRef.current.id === 'v4_engine') {
          const omega = mechTime * 9.0;
          const crankNode = runtimeMap.get('crankshaft');
          if (crankNode?.animatedParts.crank) {
            crankNode.animatedParts.crank.rotation.x = omega;
          }
          const throws = [0, Math.PI, Math.PI, 0];
          const conRodNode = runtimeMap.get('con_rods');
          const pistonNode = runtimeMap.get('pistons');
          throws.forEach((ph, idx) => {
            const ang = omega + ph;
            const stroke = Math.cos(ang) * 0.14;
            const swing = Math.sin(ang) * 0.17;
            if (conRodNode?.animatedParts[`rod_${idx}`]) {
              conRodNode.animatedParts[`rod_${idx}`].position.y = stroke;
              conRodNode.animatedParts[`rod_${idx}`].rotation.x = swing;
            }
            if (pistonNode?.animatedParts[`piston_${idx}`]) {
              pistonNode.animatedParts[`piston_${idx}`].position.y = stroke;
            }
            const flame = pistonNode?.animatedParts[`flame_${idx}`] as THREE.Mesh | undefined;
            if (flame) {
              const fm = flame.material as THREE.MeshBasicMaterial;
              const fireVal = Math.max(0, Math.cos(ang));
              fm.opacity = fireVal > 0.86 ? (fireVal - 0.86) * 6.5 : 0;
            }
          });
          const camNode = runtimeMap.get('camshafts');
          if (camNode) {
            if (camNode.animatedParts.cam_0) camNode.animatedParts.cam_0.rotation.x = omega * 0.5;
            if (camNode.animatedParts.cam_1) camNode.animatedParts.cam_1.rotation.x = omega * 0.5;
          }
          const turboNode = runtimeMap.get('turbo_manifold');
          if (turboNode?.animatedParts.turboWheel) {
            turboNode.animatedParts.turboWheel.rotation.x = omega * 3.8;
          }
        } else if (activeModelRef.current.id === 'tourbillon_watch') {
          const barrel = runtimeMap.get('mainspring_barrel')?.animatedParts.barrel;
          const train = runtimeMap.get('gear_train');
          const esc = runtimeMap.get('ruby_escapement');
          const tourb = runtimeMap.get('tourbillon_cage');
          const hands = runtimeMap.get('hands_dial');

          if (barrel) barrel.rotation.y = mechTime * 0.35;
          if (train?.animatedParts.centerWheel) train.animatedParts.centerWheel.rotation.y = -mechTime * 1.1;
          if (train?.animatedParts.thirdWheel) train.animatedParts.thirdWheel.rotation.y = mechTime * 2.4;
          if (esc?.animatedParts.escWheel) esc.animatedParts.escWheel.rotation.y = -mechTime * 6.0;
          if (esc?.animatedParts.palletFork) {
            esc.animatedParts.palletFork.rotation.y = Math.sin(mechTime * 22) * 0.12;
          }
          if (tourb?.animatedParts.tourbillonCage) {
            tourb.animatedParts.tourbillonCage.rotation.y = mechTime * 0.8;
          }
          if (tourb?.animatedParts.balanceWheel) {
            tourb.animatedParts.balanceWheel.rotation.y = Math.sin(mechTime * 16) * 1.4;
          }
          if (hands?.animatedParts.secHand) hands.animatedParts.secHand.rotation.y = -mechTime * 1.05;
          if (hands?.animatedParts.minHand) hands.animatedParts.minHand.rotation.y = -mechTime * 0.08;
          if (hands?.animatedParts.hourHand) hands.animatedParts.hourHand.rotation.y = -mechTime * 0.015;
        } else if (activeModelRef.current.id === 'fpv_drone') {
          const props = runtimeMap.get('propellers');
          if (props) {
            [0, 1, 2, 3].forEach((idx) => {
              const p = props.animatedParts[`prop_${idx}`];
              if (p) {
                const dir = idx === 0 || idx === 3 ? 1 : -1;
                p.rotation.y += dir * delta * runSpeedRef.current * 28;
              }
            });
          }
          assemblyRoot.position.y = Math.sin(mechTime * 3.5) * 0.09 + 0.14;
          assemblyRoot.rotation.z = Math.sin(mechTime * 2.1) * 0.03;
        } else if (activeModelRef.current.id === 'planetary_gearbox') {
          const sunAngle = mechTime * 4.2;
          const sun = runtimeMap.get('sun_gear')?.animatedParts.sunGear;
          const planets = runtimeMap.get('planet_gears');
          const carrier = runtimeMap.get('planet_carrier')?.animatedParts.carrier;
          const out = runtimeMap.get('output_cover')?.animatedParts.outputShaft;

          const carrierAngle = sunAngle / 4.0; // Exact 1 + (36/12) = 4:1 ratio
          if (sun) sun.rotation.y = sunAngle;
          if (planets?.animatedParts.planetOrbit) {
            planets.animatedParts.planetOrbit.rotation.y = carrierAngle;
          }
          for (let i = 0; i < 3; i++) {
            const p = planets?.animatedParts[`planet_${i}`];
            if (p) p.rotation.y = -sunAngle * 0.75;
          }
          if (carrier) carrier.rotation.y = carrierAngle;
          if (out) out.rotation.y = carrierAngle;
        }
      } else {
        assemblyRoot.position.y = THREE.MathUtils.damp(assemblyRoot.position.y, 0, 8, delta);
        assemblyRoot.rotation.z = THREE.MathUtils.damp(assemblyRoot.rotation.z, 0, 8, delta);
      }

      renderer.render(scene, camera);
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      carbonTex.dispose();
      envRT.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mm) => mm.dispose());
          else m.material?.dispose();
        }
      });
      renderer.dispose();
    };
  }, [activeModel, tryInstallPart]);

  // Helper formatters
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${tenths}`;
  };

  const inspectedPart: AssemblyPartSpec | null = useMemo(() => {
    if (selectedPartId) {
      return activeModel.parts.find((p) => p.id === selectedPartId) || null;
    }
    return nextRecommendedPart || activeModel.parts[0];
  }, [activeModel.parts, selectedPartId, nextRecommendedPart]);

  const handleInstallNext = () => {
    if (nextRecommendedPart) {
      tryInstallPart(nextRecommendedPart.id, false);
    }
  };

  const handleDisassembleAll = () => {
    setIsAutoAssembling(false);
    setIsRunningTest(false);
    resetModelState(selectedModelId);
    setExplodeFactor(0);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Top Model Selector & Difficulty Mode Strip */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {ASSEMBLY_MODELS.map((m) => {
              const active = m.id === selectedModelId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectModel(m.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-400/60'
                  }`}
                >
                  {isEn ? m.titleEn : m.titleVi}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Guided vs Hardcore Speedrun Segmented Switch */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setDifficulty('guided')}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  difficulty === 'guided'
                    ? 'bg-white dark:bg-slate-950 text-sky-700 dark:text-sky-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {isEn ? 'Guided Mode' : 'Hướng dẫn 3D'}
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('hardcore')}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  difficulty === 'hardcore'
                    ? 'bg-white dark:bg-slate-950 text-rose-600 dark:text-rose-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {isEn ? 'Hardcore Speedrun' : 'Thử thách Tốc độ'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSoundEnabled((v) => !v)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
              title={soundEnabled ? (isEn ? 'Mute Audio' : 'Tắt âm thanh') : (isEn ? 'Enable Audio' : 'Bật âm thanh')}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Unobstructed 3D Interactive Workbench Viewport */}
      <div className="relative rounded-2xl border border-slate-300 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-950 shadow-xl">
        {/* Isolated WebGL Mount Container */}
        <div
          ref={canvasMountRef}
          className="w-full h-[540px] sm:h-[620px] select-none touch-none"
        />

        {/* Top-Left Compact Telemetry & Progress HUD */}
        <div className="pointer-events-none absolute top-3 left-3 right-3 flex flex-wrap items-start justify-between gap-2 z-10">
          <div className="pointer-events-auto rounded-xl border border-slate-300/80 dark:border-slate-700/80 bg-white/92 dark:bg-slate-900/92 px-3.5 py-2.5 shadow-md max-w-md">
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="font-bold text-amber-600 dark:text-amber-400">{activeModel.badge}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-semibold text-slate-800 dark:text-slate-100">
                {installedIds.length}/{activeModel.parts.length} {isEn ? 'parts' : 'chi tiết'} ({progressPct}%)
              </span>
            </div>
            <div className="mt-1.5 w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center gap-3 text-[11px] font-mono tabular-nums text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1">
                <Timer className="w-3.5 h-3.5 text-sky-500" />
                {formatTime(elapsedMs)}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {isEn ? 'Order Errors:' : 'Sai thứ tự:'}{' '}
                <strong className={mistakesCount > 0 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}>
                  {mistakesCount}
                </strong>
              </span>
              {snapReadyPartId && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <Magnet className="w-3.5 h-3.5" />
                    {isEn ? 'Release to Lock!' : 'Thả để khớp!'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Top-Right Quick Camera Views & Inspector Card */}
          <div className="pointer-events-auto flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-slate-300/80 dark:border-slate-700/80 bg-white/92 dark:bg-slate-900/92 p-1 shadow-md">
              {(
                [
                  { id: 'iso', labelVi: '3/4', labelEn: '3/4' },
                  { id: 'front', labelVi: 'Trước', labelEn: 'Front' },
                  { id: 'top', labelVi: 'Trên', labelEn: 'Top' },
                  { id: 'side', labelVi: 'Cạnh', labelEn: 'Side' },
                ] as const
              ).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => moveCameraPreset(v.id)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap"
                >
                  {isEn ? v.labelEn : v.labelVi}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowGhostGuides((v) => !v)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer whitespace-nowrap ${
                  showGhostGuides
                    ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
                title={isEn ? 'Toggle Hologram Slot Guides' : 'Bật/tắt khung hologram định vị'}
              >
                {showGhostGuides ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Holo</span>
              </button>
            </div>

            {inspectedPart && !hudCollapsed && (
              <div className="hidden md:block w-72 rounded-xl border border-slate-300/80 dark:border-slate-700/80 bg-white/92 dark:bg-slate-900/92 p-3 shadow-md space-y-1">
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <span>
                    {isEn ? `PART 0${inspectedPart.order}` : `CHI TIẾT 0${inspectedPart.order}`} ·{' '}
                    {isEn ? inspectedPart.materialTagEn : inspectedPart.materialTagVi}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isEn ? inspectedPart.nameEn : inspectedPart.nameVi}
                </div>
                <p className="text-[11px] leading-snug text-slate-600 dark:text-slate-300">
                  {isEn ? inspectedPart.roleEn : inspectedPart.roleVi}
                </p>
                <div className="text-[10px] font-mono text-sky-700 dark:text-sky-300 pt-0.5">
                  {inspectedPart.specs}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transient Action Feedback Banner */}
        {feedbackBanner && (
          <div className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 z-10">
            <div
              className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold shadow-md whitespace-nowrap ${
                feedbackBanner.type === 'warn'
                  ? 'bg-rose-50 dark:bg-rose-950/95 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-200'
                  : feedbackBanner.type === 'complete'
                  ? 'bg-emerald-50 dark:bg-emerald-950/95 border-emerald-400 dark:border-emerald-600 text-emerald-700 dark:text-emerald-200'
                  : 'bg-sky-50 dark:bg-slate-900/95 border-sky-300 dark:border-sky-600 text-sky-800 dark:text-sky-200'
              }`}
            >
              {feedbackBanner.text}
            </div>
          </div>
        )}

        {/* Collapsible Unified Bottom Control Dock */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[96%] max-w-4xl z-10 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setHudCollapsed((v) => !v)}
            className="mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg border border-b-0 border-slate-300/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 text-[11px] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm"
          >
            {hudCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>{isEn ? 'Show Assembly Controls' : 'Mở Bảng Lắp Ráp'}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>{isEn ? 'Hide Controls' : 'Thu Gọn Khung'}</span>
              </>
            )}
          </button>

          {!hudCollapsed && (
            <div className="w-full rounded-2xl border border-slate-300/90 dark:border-slate-700/90 bg-white/95 dark:bg-slate-900/95 p-3 shadow-xl space-y-2.5">
              {/* Row 1: Primary Action Buttons + Exploded View Slider */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {!isFullyAssembled && nextRecommendedPart && (
                    <button
                      type="button"
                      onClick={handleInstallNext}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>
                        {isEn
                          ? `Snap Step ${nextRecommendedPart.order}`
                          : `Lắp Bước ${nextRecommendedPart.order}`}
                      </span>
                    </button>
                  )}

                  {!isFullyAssembled && (
                    <button
                      type="button"
                      onClick={() => setIsAutoAssembling((v) => !v)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer whitespace-nowrap ${
                        isAutoAssembling
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:border-amber-400'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {isAutoAssembling
                          ? isEn
                            ? 'Pause Auto'
                            : 'Tạm dừng'
                          : isEn
                          ? 'Auto Assemble'
                          : 'Tự Lắp Ráp'}
                      </span>
                    </button>
                  )}

                  {isFullyAssembled && (
                    <button
                      type="button"
                      onClick={() => {
                        setExplodeFactor(0);
                        setIsRunningTest((v) => !v);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap shadow-sm ${
                        isRunningTest
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isRunningTest ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>
                        {isRunningTest
                          ? isEn
                            ? 'Stop Mechanism'
                            : 'Dừng Chạy Thử'
                          : isEn
                          ? activeModel.runLabelEn
                          : activeModel.runLabelVi}
                      </span>
                    </button>
                  )}

                  {isRunningTest && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <Gauge className="w-3.5 h-3.5 text-emerald-500" />
                      <input
                        type="range"
                        min={0.4}
                        max={3.0}
                        step={0.1}
                        value={runSpeed}
                        onChange={(e) => setRunSpeed(parseFloat(e.target.value))}
                        className="w-16 accent-emerald-500 cursor-pointer"
                        aria-label="Test run speed"
                      />
                      <span className="text-[11px] font-mono tabular-nums text-slate-700 dark:text-slate-200">
                        {runSpeed.toFixed(1)}x
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleDisassembleAll}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Disassemble' : 'Tháo Rời'}</span>
                  </button>
                </div>

                {/* Exploded View Slider */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                  <Layers className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                    {isEn ? 'Explode' : 'Tách lớp'}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={explodeFactor}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (val > 0.02 && isRunningTest) setIsRunningTest(false);
                      setExplodeFactor(val);
                    }}
                    className="w-24 sm:w-32 accent-amber-500 cursor-pointer"
                    aria-label="Exploded view"
                  />
                  <span className="text-[11px] font-mono tabular-nums font-bold text-amber-600 dark:text-amber-300 w-9 text-right">
                    {Math.round(explodeFactor * 100)}%
                  </span>
                </div>
              </div>

              {/* Row 2: Horizontal Scrollable Parts Inventory Tray */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
                {activeModel.parts.map((part) => {
                  const isInstalled = installedIds.includes(part.id);
                  const isNext = nextRecommendedPart?.id === part.id;
                  const isSelected = selectedPartId === part.id;
                  return (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => {
                        setSelectedPartId(part.id);
                        if (!isInstalled) {
                          tryInstallPart(part.id, false);
                        }
                      }}
                      className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isInstalled
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-400/60 text-emerald-800 dark:text-emerald-200'
                          : isNext && difficulty === 'guided'
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200 shadow-sm'
                          : isSelected
                          ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 text-sky-900 dark:text-sky-200'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-400/60'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-mono font-bold text-white shrink-0"
                        style={{ backgroundColor: isInstalled ? '#10b981' : part.accentHex }}
                      >
                        {isInstalled ? <CheckCircle2 className="w-3 h-3" /> : part.order}
                      </span>
                      <span className="text-[11px] font-semibold whitespace-nowrap max-w-[140px] truncate">
                        {isEn ? part.nameEn : part.nameVi}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Engineering Interaction Legend */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Compass className="w-3.5 h-3.5 text-sky-500" />
            {isEn
              ? 'Drag floating 3D parts directly onto glowing hologram slots, or click parts in the bottom tray.'
              : 'Kéo thả trực tiếp linh kiện 3D nổi vào khung hologram phát sáng, hoặc chạm thẻ ở khay dưới để lắp khớp.'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          {isEn ? 'Drag background to Orbit · Scroll to Zoom' : 'Kéo nền để Xoay 360° · Cuộn để Thu phóng'}
        </span>
      </div>
    </div>
  );
};
