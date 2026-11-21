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
  Hand,
  Layers,
  Magnet,
  Play,
  Plus,
  RotateCcw,
  RotateCw,
  Scan,
  Scissors,
  Sparkles,
  Square,
  Timer,
  Trash2,
  Volume2,
  VolumeX,
  Wrench,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ASSEMBLY_MODELS } from './assembly/assemblyCatalog';
import {
  buildAssemblyPartMesh,
  buildGhostHologramClone,
  createCarbonWeaveTexture,
} from './assembly/assemblyMeshes';
import {
  AUX_PART_CATALOG,
  AuxPartKind,
  buildAuxiliaryPartMesh,
  buildWorkbenchToolMesh,
  buildWorkshopEnvironment,
  WorkshopEnvironmentHandle,
} from './assembly/workshopEnvironment';
import {
  AssemblyDifficulty,
  AssemblyModelId,
  AssemblyPartSpec,
  PartRuntimeNode,
} from './assembly/assemblyTypes';

type WorkshopToolMode = 'hand' | 'wrench' | 'screwdriver';

interface SpawnedAuxPartState {
  uid: string;
  kind: AuxPartKind;
  nameVi: string;
  nameEn: string;
  accentHex: string;
  torqued: boolean;
  calibrated: boolean;
  pos: [number, number, number];
  rotY: number;
}

interface AuxRuntimeNode {
  uid: string;
  kind: AuxPartKind;
  group: THREE.Group;
  rotor?: THREE.Object3D;
  needle?: THREE.Object3D;
  spinBoost: boolean;
  dispose: () => void;
}

interface AssemblyStudio3DLabProps {
  onEarnXP?: (xp: number) => void;
}

const _vec3 = new THREE.Vector3();
const _dragPlane = new THREE.Plane();
const _planeHit = new THREE.Vector3();
const _camDir = new THREE.Vector3();
const _pointerNdc = new THREE.Vector2();
const _tmpColor = new THREE.Color();

const CASING_PART_IDS = new Set<string>([
  'engine_block',
  'cylinder_head',
  'watch_mainplate',
  'sapphire_bezel',
  'aero_canopy',
  'ring_housing',
  'output_cover',
]);

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
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const sync = () => setIsDark(document.documentElement.classList.contains('dark'));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

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
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);
  const [isAutoAssembling, setIsAutoAssembling] = useState<boolean>(false);
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [runSpeed, setRunSpeed] = useState<number>(1.0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<WorkshopToolMode>('hand');
  const [sectionEnabled, setSectionEnabled] = useState<boolean>(false);
  const [sectionPos, setSectionPos] = useState<number>(0.15);
  const [showAddPartDrawer, setShowAddPartDrawer] = useState<boolean>(false);
  const [torquedIds, setTorquedIds] = useState<string[]>([]);
  const [calibratedIds, setCalibratedIds] = useState<string[]>([]);
  const [auxParts, setAuxParts] = useState<SpawnedAuxPartState[]>([]);
  const [selectedAuxUid, setSelectedAuxUid] = useState<string | null>(null);
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
  const toolBonusPartsRef = useRef<Set<string>>(new Set());

  // Mutable refs for 60fps Three.js loop
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const installedIdsRef = useRef<string[]>(installedIds);
  const selectedPartIdRef = useRef<string | null>(selectedPartId);
  const hoveredPartIdRef = useRef<string | null>(hoveredPartId);
  const draggingPartIdRef = useRef<string | null>(draggingPartId);
  const snapReadyRef = useRef<string | null>(snapReadyPartId);
  const explodeRef = useRef<number>(explodeFactor);
  const showGhostsRef = useRef<boolean>(showGhostGuides);
  const isXRayRef = useRef<boolean>(isXRayMode);
  const difficultyRef = useRef<AssemblyDifficulty>(difficulty);
  const isRunningTestRef = useRef<boolean>(isRunningTest);
  const runSpeedRef = useRef<number>(runSpeed);
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  const isDarkRef = useRef<boolean>(isDark);
  const activeModelRef = useRef(activeModel);
  const activeToolRef = useRef<WorkshopToolMode>(activeTool);
  const sectionEnabledRef = useRef<boolean>(sectionEnabled);
  const sectionPosRef = useRef<number>(sectionPos);
  const auxPartsRef = useRef<SpawnedAuxPartState[]>(auxParts);

  installedIdsRef.current = installedIds;
  selectedPartIdRef.current = selectedPartId;
  hoveredPartIdRef.current = hoveredPartId;
  draggingPartIdRef.current = draggingPartId;
  snapReadyRef.current = snapReadyPartId;
  explodeRef.current = explodeFactor;
  showGhostsRef.current = showGhostGuides;
  isXRayRef.current = isXRayMode;
  difficultyRef.current = difficulty;
  isRunningTestRef.current = isRunningTest;
  runSpeedRef.current = runSpeed;
  soundEnabledRef.current = soundEnabled;
  isDarkRef.current = isDark;
  activeModelRef.current = activeModel;
  activeToolRef.current = activeTool;
  sectionEnabledRef.current = sectionEnabled;
  sectionPosRef.current = sectionPos;
  auxPartsRef.current = auxParts;

  // Scene refs for imperative control
  const nodesRef = useRef<Map<string, PartRuntimeNode>>(new Map());
  const auxNodesRef = useRef<Map<string, AuxRuntimeNode>>(new Map());
  const auxRootRef = useRef<THREE.Group | null>(null);
  const auxPickablesRef = useRef<THREE.Object3D[]>([]);
  const sectionPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.15));
  const toolAnimRef = useRef<{
    tool: 'wrench' | 'screwdriver';
    target: THREE.Vector3;
    progress: number;
    active: boolean;
  }>({
    tool: 'wrench',
    target: new THREE.Vector3(),
    progress: 0,
    active: false,
  });
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const workshopEnvRef = useRef<WorkshopEnvironmentHandle | null>(null);
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

  // Web Audio API mechanical snap, ratchet & calibration synth (zero external .mp3 files)
  const playSynthCue = useCallback(
    (kind: 'snap' | 'error' | 'complete' | 'tick' | 'ratchet' | 'calibrate') => {
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
        } else if (kind === 'ratchet') {
          [0, 0.055, 0.11, 0.165].forEach((offset, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(920 + idx * 90, now + offset);
            osc.frequency.exponentialRampToValueAtTime(420, now + offset + 0.035);
            gain.gain.setValueAtTime(0.07, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.04);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.045);
          });
        } else if (kind === 'calibrate') {
          [0, 0.07, 0.14].forEach((offset, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1180 + idx * 240, now + offset);
            gain.gain.setValueAtTime(0.09, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.05);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.055);
          });
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
    },
    []
  );

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
      setIsXRayMode(false);
      setSectionEnabled(false);
      setTorquedIds([]);
      setCalibratedIds([]);
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

  // Trigger 3D animated tool action (Wrench / Screwdriver) on an installed part or auxiliary module
  const applyWorkshopToolAt = useCallback(
    (tool: 'wrench' | 'screwdriver', targetPos: THREE.Vector3, label: string, partKey: string, isAux = false) => {
      toolAnimRef.current.tool = tool;
      toolAnimRef.current.target.copy(targetPos);
      toolAnimRef.current.progress = 1.0;
      toolAnimRef.current.active = true;

      if (lockRingMeshRef.current) {
        lockRingMeshRef.current.position.set(targetPos.x, Math.max(-0.58, targetPos.y), targetPos.z);
        lockRingMeshRef.current.visible = true;
        lockRingPulseRef.current = 1.0;
        const ringMat = lockRingMeshRef.current.material as THREE.MeshBasicMaterial;
        ringMat.color.setHex(tool === 'wrench' ? 0xf59e0b : 0x38bdf8);
      }

      playSynthCue(tool === 'wrench' ? 'ratchet' : 'calibrate');

      if (isAux) {
        setAuxParts((prev) =>
          prev.map((a) =>
            a.uid === partKey
              ? {
                  ...a,
                  torqued: tool === 'wrench' ? true : a.torqued,
                  calibrated: tool === 'screwdriver' ? true : a.calibrated,
                }
              : a
          )
        );
        const auxNode = auxNodesRef.current.get(partKey);
        if (auxNode && tool === 'screwdriver') {
          auxNode.spinBoost = !auxNode.spinBoost;
        }
      } else {
        if (tool === 'wrench') {
          setTorquedIds((prev) => (prev.includes(partKey) ? prev : [...prev, partKey]));
        } else {
          setCalibratedIds((prev) => (prev.includes(partKey) ? prev : [...prev, partKey]));
        }
        const bonusKey = `${activeModelRef.current.id}:${tool}:${partKey}`;
        if (!toolBonusPartsRef.current.has(bonusKey)) {
          toolBonusPartsRef.current.add(bonusKey);
          onEarnXP?.(5);
        }
      }

      setFeedbackBanner({
        type: 'ok',
        text:
          tool === 'wrench'
            ? isEn
              ? `Torqued "${label}" to OEM spec (+5 XP)`
              : `Đã dùng Cờ lê siết lực chuẩn cho "${label}"`
            : isEn
            ? `Calibrated "${label}" tolerance (+5 XP)`
            : `Đã dùng Tua vít căn chỉnh chuẩn "${label}"`,
      });
    },
    [isEn, onEarnXP, playSynthCue]
  );

  // Add an auxiliary mechanical hardware module onto the workbench
  const handleAddAuxPart = useCallback(
    (kind: AuxPartKind) => {
      if (auxPartsRef.current.length >= 12) {
        setFeedbackBanner({
          type: 'warn',
          text: isEn ? 'Workbench limit reached (12 added modules).' : 'Đã đạt giới hạn 12 bộ phận thêm trên bàn.',
        });
        return;
      }
      const catalogItem = AUX_PART_CATALOG.find((c) => c.kind === kind);
      if (!catalogItem) return;

      // Pick clean open bench slot around the central rotary plate
      const idx = auxPartsRef.current.length;
      const slots: [number, number][] = [
        [-2.75, 1.55],
        [2.75, 1.55],
        [-2.95, 0.2],
        [2.95, 0.2],
        [-2.75, -1.25],
        [2.75, -1.25],
        [-1.8, 1.95],
        [1.8, 1.95],
        [0, 2.05],
        [-3.45, 0.9],
        [3.45, 0.9],
        [0, -2.05],
      ];
      const [sx, sz] = slots[idx % slots.length];
      const uid = `aux_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const newAux: SpawnedAuxPartState = {
        uid,
        kind,
        nameVi: catalogItem.nameVi,
        nameEn: catalogItem.nameEn,
        accentHex: catalogItem.accentHex,
        torqued: false,
        calibrated: false,
        pos: [sx, -0.70, sz],
        rotY: 0,
      };
      setAuxParts((prev) => [...prev, newAux]);
      setSelectedAuxUid(uid);
      setSelectedPartId(null);
      playSynthCue('snap');
      setFeedbackBanner({
        type: 'ok',
        text: isEn
          ? `Added "${catalogItem.nameEn}" to workbench. Drag to position or use Wrench/Screwdriver!`
          : `Đã thêm "${catalogItem.nameVi}" lên bàn kỹ thuật. Kéo để sắp đặt hoặc dùng Cờ lê/Tua vít!`,
      });
    },
    [isEn, playSynthCue]
  );

  const handleRemoveAuxPart = useCallback((uid: string) => {
    setAuxParts((prev) => prev.filter((a) => a.uid !== uid));
    setSelectedAuxUid((prev) => (prev === uid ? null : prev));
  }, []);

  const handleRotateSelectedAux = useCallback(() => {
    if (!selectedAuxUid) return;
    setAuxParts((prev) =>
      prev.map((a) => (a.uid === selectedAuxUid ? { ...a, rotY: a.rotY + Math.PI / 4 } : a))
    );
  }, [selectedAuxUid]);

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

      // Trigger axis slide-in animation & lock ring shockwave at part's assembled world position
      const node = nodesRef.current.get(partId);
      if (node) {
        node.seatProgress = 0;
        node.flashIntensity = 1.0;
      }
      if (node && lockRingMeshRef.current) {
        lockRingMeshRef.current.position.set(
          spec.assembledPos[0],
          spec.assembledPos[1],
          spec.assembledPos[2]
        );
        lockRingMeshRef.current.visible = true;
        lockRingPulseRef.current = 1.0;
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
    renderer.localClippingEnabled = true;
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
    const hemi = new THREE.HemisphereLight(0xdbeafe, 0x334155, 0.75);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(6, 9, 6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.15);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Full 3D Mechanical Engineering Workshop Floor + Steel Workbench (replaces bare grid)
    const workshopEnv = buildWorkshopEnvironment(
      isDarkRef.current,
      renderer.capabilities.getMaxAnisotropy(),
      isSoftwareGl
    );
    workshopEnvRef.current = workshopEnv;
    scene.add(workshopEnv.group);

    // Auxiliary parts container on top of steel workbench
    const auxRoot = new THREE.Group();
    auxRootRef.current = auxRoot;
    scene.add(auxRoot);

    // Interactive 3D animated Wrench & Screwdriver models
    const wrenchMesh = buildWorkbenchToolMesh('wrench');
    wrenchMesh.visible = false;
    scene.add(wrenchMesh);

    const screwdriverMesh = buildWorkbenchToolMesh('screwdriver');
    screwdriverMesh.visible = false;
    scene.add(screwdriverMesh);

    // Lock-in / Torque shockwave ring
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
    const accentHexMap = new Map<string, number>();
    const casingMaterials: THREE.Material[] = [];
    const clippableMaterials: THREE.Material[] = [];
    const pickableObjects: THREE.Object3D[] = [];
    const sectionClipArray = [sectionPlaneRef.current];

    activeModel.parts.forEach((spec) => {
      const built = buildAssemblyPartMesh(activeModel.id, spec.id, isSoftwareGl, carbonTex);
      const partGroup = built.group;
      const isCasing = CASING_PART_IDS.has(spec.id);
      partGroup.userData.partId = spec.id;
      partGroup.traverse((c) => {
        c.userData.partId = spec.id;
        if ((c as THREE.Mesh).isMesh) {
          const mesh = c as THREE.Mesh;
          const prepMat = (mat: THREE.Material) => {
            const cloned = mat.clone();
            cloned.userData.baseMat = {
              transparent: cloned.transparent,
              opacity: cloned.opacity,
              depthWrite: cloned.depthWrite,
              side: cloned.side,
            };
            cloned.clippingPlanes = sectionClipArray;
            cloned.clipShadows = true;
            clippableMaterials.push(cloned);
            if (isCasing) casingMaterials.push(cloned);
            return cloned;
          };
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map(prepMat);
          } else if (mesh.material) {
            mesh.material = prepMat(mesh.material);
          }
        }
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

      accentHexMap.set(spec.id, _tmpColor.set(spec.accentHex).getHex());

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

    // Re-attach existing spawned auxiliary parts cleanly if model switched
    auxNodesRef.current.clear();
    auxPickablesRef.current = [];
    auxPartsRef.current.forEach((item) => {
      const built = buildAuxiliaryPartMesh(item.kind, sectionClipArray);
      built.group.position.set(...item.pos);
      built.group.rotation.y = item.rotY;
      built.group.userData.auxUid = item.uid;
      built.group.traverse((c) => {
        c.userData.auxUid = item.uid;
      });
      auxRoot.add(built.group);
      auxPickablesRef.current.push(built.group);
      auxNodesRef.current.set(item.uid, {
        uid: item.uid,
        kind: item.kind,
        group: built.group,
        rotor: built.rotor,
        needle: built.needle,
        spinBoost: item.calibrated,
        dispose: () => {
          built.group.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
              const m = obj as THREE.Mesh;
              m.geometry?.dispose();
              if (Array.isArray(m.material)) m.material.forEach((mm) => mm.dispose());
              else m.material?.dispose();
            }
          });
        },
      });
    });

    // Raycaster for hover, 3D drag-and-drop, workbench aux placement, & Wrench/Screwdriver actions
    const raycaster = new THREE.Raycaster();
    let pointerDownPos = { x: 0, y: 0 };
    let activeDragId: string | null = null;
    let activeAuxDragUid: string | null = null;
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

      const allTargets = [...pickableObjects, ...auxPickablesRef.current];
      const hits = raycaster.intersectObjects(allTargets, true);
      if (hits.length === 0) return;

      const hitAuxUid = hits[0].object.userData?.auxUid as string | undefined;
      const hitPartId = hits[0].object.userData?.partId as string | undefined;
      const tool = activeToolRef.current;

      // Case A: User clicked an Auxiliary Workshop Module on the bench
      if (hitAuxUid) {
        setSelectedAuxUid(hitAuxUid);
        setSelectedPartId(null);
        const auxNode = auxNodesRef.current.get(hitAuxUid);
        const auxState = auxPartsRef.current.find((a) => a.uid === hitAuxUid);
        if (!auxNode || !auxState) return;

        if (tool === 'wrench' || tool === 'screwdriver') {
          applyWorkshopToolAt(
            tool,
            hits[0].point,
            isEn ? auxState.nameEn : auxState.nameVi,
            hitAuxUid,
            true
          );
          return;
        }

        // Hand mode: drag across workbench XZ surface (y = -0.70)
        activeAuxDragUid = hitAuxUid;
        controls.enabled = false;
        try {
          renderer.domElement.setPointerCapture(e.pointerId);
        } catch {}
        _dragPlane.set(new THREE.Vector3(0, 1, 0), 0.70);
        renderer.domElement.style.cursor = 'grabbing';
        return;
      }

      if (!hitPartId) return;
      setSelectedPartId(hitPartId);
      setSelectedAuxUid(null);

      // Case B: Wrench or Screwdriver applied to an already-installed assembly part
      if (tool === 'wrench' || tool === 'screwdriver') {
        if (installedIdsRef.current.includes(hitPartId)) {
          const spec = activeModelRef.current.parts.find((p) => p.id === hitPartId);
          applyWorkshopToolAt(
            tool,
            hits[0].point,
            spec ? (isEn ? spec.nameEn : spec.nameVi) : hitPartId,
            hitPartId,
            false
          );
        } else {
          setFeedbackBanner({
            type: 'warn',
            text: isEn
              ? 'Mount this part first (switch to Hand tool) before using Wrench/Screwdriver!'
              : 'Hãy lắp chi tiết vào vị trí trước rồi mới dùng Cờ lê / Tua vít!',
          });
        }
        return;
      }

      // Case C: Hand mode dragging an uninstalled part toward its hologram socket
      if (!installedIdsRef.current.includes(hitPartId)) {
        const node = runtimeMap.get(hitPartId);
        if (node) {
          activeDragId = hitPartId;
          setDraggingPartId(hitPartId);
          controls.enabled = false;
          try {
            renderer.domElement.setPointerCapture(e.pointerId);
          } catch {}
          camera.getWorldDirection(_camDir);
          _dragPlane.setFromNormalAndCoplanarPoint(_camDir, node.group.position);
          renderer.domElement.style.cursor = 'grabbing';
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      updateNdc(e.clientX, e.clientY);

      if (activeAuxDragUid) {
        const auxNode = auxNodesRef.current.get(activeAuxDragUid);
        if (!auxNode) return;
        raycaster.setFromCamera(_pointerNdc, camera);
        if (raycaster.ray.intersectPlane(_dragPlane, _planeHit)) {
          const clampedX = Math.max(-3.9, Math.min(3.9, _planeHit.x));
          const clampedZ = Math.max(-2.2, Math.min(2.2, _planeHit.z));
          auxNode.group.position.set(clampedX, -0.70, clampedZ);
        }
        return;
      }

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
      const allTargets = [...pickableObjects, ...auxPickablesRef.current];
      const hits = raycaster.intersectObjects(allTargets, true);
      const hitId = hits.length > 0 ? (hits[0].object.userData?.partId as string | undefined) : null;
      const hitAux = hits.length > 0 ? (hits[0].object.userData?.auxUid as string | undefined) : null;
      if (hitId !== hoveredPartIdRef.current) {
        setHoveredPartId(hitId || null);
      }
      if (activeToolRef.current !== 'hand' && (hitId || hitAux)) {
        renderer.domElement.style.cursor = 'crosshair';
      } else {
        renderer.domElement.style.cursor =
          hitAux || (hitId && !installedIdsRef.current.includes(hitId))
            ? 'grab'
            : hitId
            ? 'pointer'
            : 'default';
      }
    };

    const onPointerUp = (e?: PointerEvent) => {
      if (e) {
        try {
          if (renderer.domElement.hasPointerCapture(e.pointerId)) {
            renderer.domElement.releasePointerCapture(e.pointerId);
          }
        } catch {}
      }
      if (activeAuxDragUid) {
        const uid = activeAuxDragUid;
        const auxNode = auxNodesRef.current.get(uid);
        activeAuxDragUid = null;
        controls.enabled = true;
        renderer.domElement.style.cursor = 'default';
        if (auxNode) {
          const p = auxNode.group.position;
          setAuxParts((prev) =>
            prev.map((a) => (a.uid === uid ? { ...a, pos: [p.x, p.y, p.z] } : a))
          );
        }
        return;
      }
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
          if (dist <= activeModelRef.current.snapDistance || movedDistance < 6) {
            const ok = tryInstallPart(draggedId, false);
            if (!ok) {
              node.targetPos.set(...node.spec.stagingPos);
            }
          } else {
            node.targetPos.set(...node.spec.stagingPos);
          }
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domEl.addEventListener('pointercancel', onPointerUp);

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

    let lastXRayApplied = false;
    let lastSectionApplied = false;
    let lastThemeApplied = isDarkRef.current;

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      // Sync theme colors dynamically without recreating WebGL context
      if (lastThemeApplied !== isDarkRef.current) {
        lastThemeApplied = isDarkRef.current;
        const wantBg = lastThemeApplied ? 0x070d1a : 0xf1f5f9;
        (scene.background as THREE.Color).setHex(wantBg);
        (scene.fog as THREE.FogExp2).color.setHex(wantBg);
        workshopEnv.updateTheme(lastThemeApplied);
      }

      // Apply dynamic Section Cutaway plane
      if (sectionEnabledRef.current) {
        sectionPlaneRef.current.constant = sectionPosRef.current;
      } else {
        sectionPlaneRef.current.constant = 50;
      }
      if (lastSectionApplied !== sectionEnabledRef.current) {
        lastSectionApplied = sectionEnabledRef.current;
        for (let i = 0; i < clippableMaterials.length; i++) {
          const mat = clippableMaterials[i];
          const base = mat.userData.baseMat as { side: THREE.Side } | undefined;
          if (!base) continue;
          mat.side = lastSectionApplied ? THREE.DoubleSide : base.side;
          mat.needsUpdate = true;
        }
      }

      // Apply X-Ray Cutaway transparency only when toggled
      if (lastXRayApplied !== isXRayRef.current) {
        lastXRayApplied = isXRayRef.current;
        for (let i = 0; i < casingMaterials.length; i++) {
          const mat = casingMaterials[i];
          const base = mat.userData.baseMat as
            | { transparent: boolean; opacity: number; depthWrite: boolean }
            | undefined;
          if (!base) continue;
          if (lastXRayApplied) {
            mat.transparent = true;
            mat.opacity = 0.24;
            mat.depthWrite = false;
          } else {
            mat.transparent = base.transparent;
            mat.opacity = base.opacity;
            mat.depthWrite = base.depthWrite;
          }
          mat.needsUpdate = true;
        }
      }

      // Animate 3D Wrench / Screwdriver tool cue
      if (toolAnimRef.current.active) {
        toolAnimRef.current.progress -= delta * 1.45;
        const p = Math.max(0, toolAnimRef.current.progress);
        const phase = 1 - p;
        if (toolAnimRef.current.tool === 'wrench') {
          wrenchMesh.visible = true;
          screwdriverMesh.visible = false;
          wrenchMesh.position.set(
            toolAnimRef.current.target.x,
            toolAnimRef.current.target.y + 0.12 + p * 0.22,
            toolAnimRef.current.target.z
          );
          wrenchMesh.rotation.set(0, Math.sin(phase * Math.PI * 4) * 0.72, 0);
        } else {
          screwdriverMesh.visible = true;
          wrenchMesh.visible = false;
          screwdriverMesh.position.set(
            toolAnimRef.current.target.x,
            toolAnimRef.current.target.y + 0.05 + Math.abs(Math.sin(phase * Math.PI * 2)) * 0.14,
            toolAnimRef.current.target.z
          );
          screwdriverMesh.rotation.set(0, phase * Math.PI * 10, 0);
        }
        if (p <= 0) {
          toolAnimRef.current.active = false;
          wrenchMesh.visible = false;
          screwdriverMesh.visible = false;
        }
      }

      // Animate spawned auxiliary modules (fan rotors, pulley wheels, pressure gauge needle)
      auxNodesRef.current.forEach((node) => {
        const activeSpin = isRunningTestRef.current || node.spinBoost;
        if (node.rotor && activeSpin) {
          node.rotor.rotation.y += delta * (node.spinBoost ? 14 : 9) * runSpeedRef.current;
        }
        if (node.needle) {
          const targetAngle = isRunningTestRef.current
            ? -0.95 + Math.sin(elapsed * 5.2) * 0.22
            : node.spinBoost
            ? -0.25
            : 0.7;
          node.needle.rotation.z = THREE.MathUtils.damp(node.needle.rotation.z, targetAngle, 6, delta);
        }
      });

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
            node.seatProgress = THREE.MathUtils.damp(node.seatProgress, 1, 9, delta);
            // Axis-guided slide-in insertion curve while locking into bore/socket
            const slideAmp =
              explodeVal < 0.02 ? (1 - node.seatProgress) * (1 - node.seatProgress) * 0.65 : 0;
            _vec3.set(
              node.spec.assembledPos[0] +
                node.spec.explodeOffset[0] * explodeVal +
                node.spec.snapAxis[0] * slideAmp,
              node.spec.assembledPos[1] +
                node.spec.explodeOffset[1] * explodeVal +
                node.spec.snapAxis[1] * slideAmp,
              node.spec.assembledPos[2] +
                node.spec.explodeOffset[2] * explodeVal +
                node.spec.snapAxis[2] * slideAmp
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
          const partAccentHex = accentHexMap.get(node.spec.id) ?? 0x38bdf8;
          node.ghostGroup.traverse((c) => {
            if ((c as THREE.Mesh).isMesh) {
              const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
              m.opacity = pulse;
              m.color.setHex(isSnapReady ? 0x10b981 : partAccentHex);
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
      domEl.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      workshopEnv.dispose();
      auxNodesRef.current.forEach((n) => n.dispose());
      auxNodesRef.current.clear();
      auxPickablesRef.current = [];
      auxRootRef.current = null;
      workshopEnvRef.current = null;
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
  }, [activeModel, applyWorkshopToolAt, isEn, tryInstallPart]);

  // Synchronize dynamically spawned Auxiliary Parts ("Thêm Bộ Phận") with the active Three.js scene
  useEffect(() => {
    const auxRoot = auxRootRef.current;
    if (!auxRoot) return;
    const sectionClipArray = [sectionPlaneRef.current];
    const desiredUids = new Set(auxParts.map((a) => a.uid));

    // Remove deleted aux meshes cleanly
    auxNodesRef.current.forEach((node, uid) => {
      if (!desiredUids.has(uid)) {
        auxRoot.remove(node.group);
        node.dispose();
        auxNodesRef.current.delete(uid);
      }
    });

    // Rebuild pickables & update/add nodes
    const nextPickables: THREE.Object3D[] = [];
    auxParts.forEach((item) => {
      let node = auxNodesRef.current.get(item.uid);
      if (!node) {
        const built = buildAuxiliaryPartMesh(item.kind, sectionClipArray);
        built.group.userData.auxUid = item.uid;
        built.group.traverse((c) => {
          c.userData.auxUid = item.uid;
        });
        auxRoot.add(built.group);
        node = {
          uid: item.uid,
          kind: item.kind,
          group: built.group,
          rotor: built.rotor,
          needle: built.needle,
          spinBoost: item.calibrated,
          dispose: () => {
            built.group.traverse((obj) => {
              if ((obj as THREE.Mesh).isMesh) {
                const m = obj as THREE.Mesh;
                m.geometry?.dispose();
                if (Array.isArray(m.material)) m.material.forEach((mm) => mm.dispose());
                else m.material?.dispose();
              }
            });
          },
        };
        auxNodesRef.current.set(item.uid, node);
      }
      node.group.position.set(...item.pos);
      node.group.rotation.y = item.rotY;
      nextPickables.push(node.group);
    });
    auxPickablesRef.current = nextPickables;
  }, [auxParts, activeModel]);

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

  const handleQuickCompleteAll = () => {
    setIsAutoAssembling(false);
    const allIds = activeModel.parts.map((p) => p.id);
    allIds.forEach((id) => {
      const n = nodesRef.current.get(id);
      if (n && !installedIdsRef.current.includes(id)) {
        n.seatProgress = 0;
      }
    });
    installedIdsRef.current = allIds;
    setInstalledIds(allIds);
    setBuildCompleted(true);
    setExplodeFactor(0);
    playSynthCue('complete');
    setFeedbackBanner({
      type: 'complete',
      text: isEn
        ? `100% Complete! Try "${activeModel.runLabelEn}", X-Ray Cutaway, or Exploded View.`
        : `Đã lắp hoàn chỉnh 100%! Bấm "${activeModel.runLabelVi}", X-Ray hoặc kéo Tách lớp 3D.`,
    });
    if (!rewardedModelsRef.current.has(activeModel.id)) {
      rewardedModelsRef.current.add(activeModel.id);
      onEarnXP?.(80);
    }
  };

  const liveTelemetryLabel = useMemo(() => {
    if (!isRunningTest) return null;
    if (selectedModelId === 'v4_engine') {
      return `${Math.round(950 * runSpeed + 720).toLocaleString()} RPM · 1-3-4-2`;
    }
    if (selectedModelId === 'tourbillon_watch') {
      return `${Math.round(28800 * runSpeed).toLocaleString()} VPH · ${(4 * runSpeed).toFixed(1)} Hz`;
    }
    if (selectedModelId === 'fpv_drone') {
      return `${Math.round(14500 * runSpeed).toLocaleString()} RPM · ${(1.6 * runSpeed).toFixed(1)} kg/rotor`;
    }
    return `In ${Math.round(1200 * runSpeed)} → Out ${Math.round(300 * runSpeed)} RPM (4:1)`;
  }, [isRunningTest, selectedModelId, runSpeed]);

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
              {liveTelemetryLabel && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-bold text-cyan-600 dark:text-cyan-300">
                    <Gauge className="w-3.5 h-3.5" />
                    {liveTelemetryLabel}
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
              <button
                type="button"
                onClick={() => setIsXRayMode((v) => !v)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer whitespace-nowrap ${
                  isXRayMode
                    ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/50'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isEn ? 'Toggle X-Ray Cutaway Housing' : 'Mở chế độ X-Ray xuyên vỏ thấy chuyển động bên trong'}
              >
                <Scan className="w-3.5 h-3.5" />
                <span>X-Ray</span>
              </button>
              <button
                type="button"
                onClick={() => setSectionEnabled((v) => !v)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer whitespace-nowrap ${
                  sectionEnabled
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/50'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isEn ? 'Toggle Dynamic CAD Section Cutaway' : 'Bật Mặt cắt CAD 3D xem cấu tạo bên trong'}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>{isEn ? 'Section' : 'Mặt cắt'}</span>
              </button>
            </div>

            {sectionEnabled && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-400/60 bg-white/95 dark:bg-slate-900/95 px-3 py-1.5 shadow-md">
                <Scissors className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  {isEn ? 'Cut Plane X' : 'Mặt cắt X'}
                </span>
                <input
                  type="range"
                  min={-2.1}
                  max={2.1}
                  step={0.05}
                  value={sectionPos}
                  onChange={(e) => setSectionPos(parseFloat(e.target.value))}
                  className="w-28 accent-amber-500 cursor-pointer"
                  aria-label="Section cut plane position"
                />
                <span className="text-[11px] font-mono tabular-nums font-bold text-amber-600 dark:text-amber-300 w-12 text-right">
                  {sectionPos >= 0 ? `+${sectionPos.toFixed(2)}` : sectionPos.toFixed(2)}
                </span>
              </div>
            )}

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
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[96%] max-w-5xl z-10 flex flex-col items-center">
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
              {/* Row 1: Workshop Tools + Primary Actions + Exploded View Slider */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Workshop Tool Mode Selector */}
                  <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setActiveTool('hand')}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        activeTool === 'hand'
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
                      }`}
                      title={isEn ? 'Drag & Mount Parts' : 'Chọn & Kéo lắp linh kiện'}
                    >
                      <Hand className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Hand' : 'Chọn/Kéo'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTool('wrench')}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        activeTool === 'wrench'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
                      }`}
                      title={isEn ? 'Torque Wrench: click mounted parts to tighten' : 'Cờ lê Siết Lực: bấm vào chi tiết đã lắp để siết bu-lông'}
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Wrench' : 'Cờ lê'}</span>
                      {torquedIds.length > 0 && (
                        <span className="font-mono text-[10px] opacity-80">({torquedIds.length})</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTool('screwdriver')}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        activeTool === 'screwdriver'
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
                      }`}
                      title={isEn ? 'Calibration Screwdriver: click parts to fine-tune' : 'Tua vít Căn Chỉnh: bấm chi tiết để hiệu chỉnh độ rơ'}
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Driver' : 'Tua vít'}</span>
                      {calibratedIds.length > 0 && (
                        <span className="font-mono text-[10px] opacity-80">({calibratedIds.length})</span>
                      )}
                    </button>
                  </div>

                  {/* Add Hardware Parts Button */}
                  <button
                    type="button"
                    onClick={() => setShowAddPartDrawer((v) => !v)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer whitespace-nowrap transition-colors ${
                      showAddPartDrawer
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:border-emerald-400'
                    }`}
                    title={isEn ? 'Spawn extra mechanical modules onto workbench' : 'Thêm bộ phận cơ khí phụ trợ lên bàn kỹ thuật'}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Add Part' : 'Thêm Bộ Phận'}</span>
                    {auxParts.length > 0 && (
                      <span className="px-1 py-0.2 rounded bg-black/15 dark:bg-white/15 font-mono text-[10px]">
                        {auxParts.length}
                      </span>
                    )}
                  </button>

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
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer whitespace-nowrap ${
                        isAutoAssembling
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:border-amber-400'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {isAutoAssembling
                          ? isEn
                            ? 'Pause'
                            : 'Tạm dừng'
                          : isEn
                          ? 'Auto'
                          : 'Tự Lắp'}
                      </span>
                    </button>
                  )}

                  {!isFullyAssembled && (
                    <button
                      type="button"
                      onClick={handleQuickCompleteAll}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap shadow-sm"
                      title={isEn ? 'Instantly assemble all parts to test Explode & Mechanism' : 'Lắp hoàn chỉnh 100% ngay để test tách lớp & chạy thử'}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Quick 100%' : 'Lắp 100%'}</span>
                    </button>
                  )}

                  {isFullyAssembled && (
                    <button
                      type="button"
                      onClick={() => {
                        setExplodeFactor(0);
                        setIsRunningTest((v) => !v);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap shadow-sm ${
                        isRunningTest
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isRunningTest ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>
                        {isRunningTest
                          ? isEn
                            ? 'Stop'
                            : 'Dừng Thử'
                          : isEn
                          ? activeModel.runLabelEn
                          : activeModel.runLabelVi}
                      </span>
                    </button>
                  )}

                  {isRunningTest && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <Gauge className="w-3.5 h-3.5 text-emerald-500" />
                      <input
                        type="range"
                        min={0.4}
                        max={3.0}
                        step={0.1}
                        value={runSpeed}
                        onChange={(e) => setRunSpeed(parseFloat(e.target.value))}
                        className="w-14 accent-emerald-500 cursor-pointer"
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
                    className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Reset' : 'Tháo Rời'}</span>
                  </button>
                </div>

                {/* Exploded View Slider */}
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
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
                    className="w-20 sm:w-28 accent-amber-500 cursor-pointer"
                    aria-label="Exploded view"
                  />
                  <span className="text-[11px] font-mono tabular-nums font-bold text-amber-600 dark:text-amber-300 w-9 text-right">
                    {Math.round(explodeFactor * 100)}%
                  </span>
                </div>
              </div>

              {/* Expandable Add Hardware Catalog Drawer */}
              {showAddPartDrawer && (
                <div className="rounded-xl border border-emerald-300/70 dark:border-emerald-700/60 bg-emerald-50/75 dark:bg-emerald-950/35 p-2.5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-200">
                      {isEn
                        ? 'Workshop Hardware Catalog — Click to spawn onto steel bench (drag to arrange, rotate, or torque):'
                        : 'Kho Bộ Phận Cơ Khí — Bấm để đặt lên bàn kỹ thuật (kéo sắp đặt, xoay, hoặc dùng Cờ lê/Tua vít):'}
                    </span>
                    {auxParts.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        {selectedAuxUid && (
                          <>
                            <button
                              type="button"
                              onClick={handleRotateSelectedAux}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold cursor-pointer"
                            >
                              <RotateCw className="w-3 h-3" />
                              <span>{isEn ? 'Rotate 45°' : 'Xoay 45°'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveAuxPart(selectedAuxUid)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>{isEn ? 'Delete Selected' : 'Xóa đang chọn'}</span>
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setAuxParts([]);
                            setSelectedAuxUid(null);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 text-[10px] font-semibold cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        >
                          {isEn ? 'Clear All' : 'Xóa tất cả'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
                    {AUX_PART_CATALOG.map((item) => (
                      <button
                        key={item.kind}
                        type="button"
                        onClick={() => handleAddAuxPart(item.kind)}
                        className="shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-emerald-300/80 dark:border-emerald-700/70 bg-white dark:bg-slate-900 hover:border-emerald-500 text-left cursor-pointer transition-colors"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ backgroundColor: item.accentHex }}
                        />
                        <div>
                          <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                            + {isEn ? item.nameEn : item.nameVi}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {isEn ? item.specEn : item.specVi}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Row 2: Horizontal Scrollable Parts Inventory Tray */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
                {activeModel.parts.map((part) => {
                  const isInstalled = installedIds.includes(part.id);
                  const isTorqued = torquedIds.includes(part.id);
                  const isCalibrated = calibratedIds.includes(part.id);
                  const isNext = nextRecommendedPart?.id === part.id;
                  const isSelected = selectedPartId === part.id;
                  return (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => {
                        setSelectedPartId(part.id);
                        setSelectedAuxUid(null);
                        if (!isInstalled) {
                          tryInstallPart(part.id, false);
                        } else if (activeTool === 'wrench' || activeTool === 'screwdriver') {
                          const node = nodesRef.current.get(part.id);
                          if (node) {
                            applyWorkshopToolAt(
                              activeTool,
                              node.currentPos,
                              isEn ? part.nameEn : part.nameVi,
                              part.id,
                              false
                            );
                          }
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
                      {(isTorqued || isCalibrated) && (
                        <span className="text-[9px] font-mono font-bold px-1 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                          {isTorqued && isCalibrated ? '✓✓' : isTorqued ? '🔧' : '⚙'}
                        </span>
                      )}
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
              ? 'Mount parts with Hand tool, tighten with Wrench, fine-tune with Screwdriver, slice with Section View, or spawn modules via + Add Part.'
              : 'Dùng Chọn/Kéo để lắp khớp & di chuyển bộ phận, Cờ lê để siết lực, Tua vít để căn chỉnh, Mặt cắt để xẻ cấu tạo và + Thêm Bộ Phận để mở rộng bàn máy.'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          {isEn ? 'Drag background to Orbit · Scroll to Zoom' : 'Kéo nền để Xoay 360° · Cuộn để Thu phóng'}
        </span>
      </div>
    </div>
  );
};
