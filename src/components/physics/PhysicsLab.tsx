import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { PHYSICS_LESSONS } from '../../data/physicsLessonsData';
import {
  CurriculumTrack,
  Physics3DMode,
  PhysicsDomainId,
  PhysicsLesson,
  PhysicsSimType,
  SpecializedTier
} from '../../types';
import {
  PHYSICS_DOMAINS,
  PHYSICS_2D_SIMS,
  PHYSICS_3D_SIMS,
  get2DSimsByDomain,
  get3DSimsByDomain,
  getDomainFor2DSim,
  getDomainFor3DSim,
  getPhysicsSimCounts
} from '../../data/physicsDomainsData';
import { PhysicsApparatusWorkbench } from './PhysicsApparatusWorkbench';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Award,
  GraduationCap,
  Maximize2,
  Minimize2,
  Box,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  FileText,
  Clock,
  Grid,
  Activity,
  Plus,
  Minus,
  StepForward,
  Camera,
  Trash2,
  Compass,
  ArrowRightLeft,
  Eye,
  Atom,
  Layers,
  FileCode2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MathFormula, FormattedText } from '../common/MathRenderer';
import { Physics3DView } from './Physics3DView';
import { useLanguage } from '../../context/LanguageContext';
import { ViewportPortal } from '../common/ViewportPortal';
import { InteractiveLectureRoom } from '../common/InteractiveLectureRoom';
import { LectureThumbnail } from '../common/LectureThumbnail';
import { buildPhysicsLectureSteps } from '../../data/lectureStepsBuilder';
import { useNavigation } from '../../context/NavigationContext';
import { renderExtra2DPhysicsSim } from './physics2DExtraRenderer';
import { LabDataLoggerPanel } from '../common/LabDataLoggerPanel';
import { LabTimeMachineBar } from './LabTimeMachineBar';
import { SimToCodeModal } from './SimToCodeModal';

interface OverlayState {
  showRulerGrid: boolean;
  showVectors: boolean;
  showTrace: boolean;
  showRealtimeChart: boolean;
}

interface LabFlags {
  circuitOpen: boolean;
  reversePolarity: boolean;
  showVoltmeter: boolean;
  isDiverging: boolean;
  showThirdRay: boolean;
  airDrag: boolean;
  hasFriction: boolean;
  singleSource: boolean;
  showNodalLines: boolean;
  flipMagnet: boolean;
  inductionAction: number; // 0: Dao động | 1: Đưa vào | 2: Rút ra | 3: Đứng yên
  showProtractor: boolean;
  showFieldGrid: boolean;
}

interface DataLogEntry {
  id: number;
  timeStr: string;
  m1Label: string;
  m1Val: string;
  m2Label: string;
  m2Val: string;
  m3Label: string;
  m3Val: string;
}

interface NumericParamFieldProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (nextVal: number) => void;
}

const NumericParamField: React.FC<NumericParamFieldProps> = ({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange
}) => {
  const [draft, setDraft] = useState<string>(String(value));
  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    if (!focused) {
      setDraft(String(value));
    }
  }, [value, focused]);

  const commitDraft = (raw: string) => {
    const normalized = raw.replace(',', '.').trim();
    const parsed = parseFloat(normalized);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      onChange(parsed);
      setDraft(String(parsed));
    } else {
      setDraft(String(value));
    }
  };

  const handleStep = (dir: -1 | 1) => {
    const decimals = (step.toString().split('.')[1] || '').length;
    const next = Number((value + dir * step).toFixed(Math.max(decimals, 2)));
    onChange(next);
    setDraft(String(next));
  };

  const sliderVal = Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

  return (
    <div className="space-y-1.5 bg-slate-50/80 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-200 leading-snug">
          {label}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            className="w-9 h-9 md:w-7 md:h-7 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={`Giảm ${step}`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <input
            type="number"
            step="any"
            value={focused ? draft : String(value)}
            onFocus={() => {
              setFocused(true);
              setDraft(String(value));
            }}
            onChange={(e) => {
              const raw = e.target.value;
              setDraft(raw);
              const parsed = parseFloat(raw.replace(',', '.'));
              if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
                onChange(parsed);
              }
            }}
            onBlur={() => {
              setFocused(false);
              commitDraft(draft);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commitDraft(draft);
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="w-20 min-h-[36px] md:min-h-0 px-2 py-1 text-right font-mono text-xs font-bold bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="w-9 h-9 md:w-7 md:h-7 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={`Tăng ${step}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          {unit && (
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 min-w-[24px]">
              {unit}
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderVal}
        onChange={(e) => {
          const parsed = parseFloat(e.target.value);
          if (!Number.isNaN(parsed)) {
            onChange(parsed);
            setDraft(String(parsed));
          }
        }}
        className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
      />
      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
        <span>Gợi ý: {min} {unit}</span>
        <span>{max} {unit} (nhập số tự do)</span>
      </div>
    </div>
  );
};

interface PhysicsLabProps {
  onScoreEarned?: (xp: number) => void;
  onBack?: () => void;
}

export const PhysicsLab: React.FC<PhysicsLabProps> = ({ onScoreEarned, onBack }) => {
  const { t, translate } = useLanguage();
  const { location, navigate, goBack } = useNavigation();
  // View flow: 'catalog' (Danh sách bài học) -> 'lecture' (Giao diện lớp giảng bài chi tiết)
  const activeView = location.physicsView;
  // Two explicit zones: 'khong_chuyen' (GDPT 9-12) | 'chuyen' (Cơ bản -> Nâng cao -> Chuyên/HSG)
  const [selectedTrack, setSelectedTrack] = useState<CurriculumTrack>('khong_chuyen');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<'all' | SpecializedTier>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [showStudyPrinciples, setShowStudyPrinciples] = useState<boolean>(false);

  useEffect(() => {
    setSelectedChapter('all');
  }, [selectedTrack, selectedGrade, selectedTier]);

  const availableChapters = useMemo(() => {
    if (selectedTrack === 'khong_chuyen' && selectedGrade === 'all') return [];
    const set = new Set<string>();
    const gradeOrder: Record<string, number> = { 'Lớp 9': 9, 'Lớp 10': 10, 'Lớp 11': 11, 'Lớp 12': 12 };
    const sorted = [...PHYSICS_LESSONS].sort((a, b) => {
      const gDiff = (gradeOrder[a.grade] ?? 99) - (gradeOrder[b.grade] ?? 99);
      if (gDiff !== 0) return gDiff;
      return a.lessonNumber - b.lessonNumber;
    });
    sorted.forEach((l) => {
      if (l.track !== selectedTrack) return;
      if (selectedTrack === 'khong_chuyen' && l.grade !== selectedGrade) return;
      if (selectedTrack === 'chuyen' && selectedTier !== 'all' && l.tier !== selectedTier) return;
      if (l.stageLabel) set.add(l.stageLabel);
    });
    return Array.from(set);
  }, [selectedTrack, selectedGrade, selectedTier]);

  // Filtered lessons by track + grade/tier + chapter
  const filteredLessons = useMemo(() => {
    const gradeOrder: Record<string, number> = { 'Lớp 9': 9, 'Lớp 10': 10, 'Lớp 11': 11, 'Lớp 12': 12 };
    return PHYSICS_LESSONS.filter((l) => {
      if (l.track !== selectedTrack) return false;
      if (selectedTrack === 'khong_chuyen') {
        if (selectedGrade !== 'all' && l.grade !== selectedGrade) return false;
      } else {
        if (selectedTier !== 'all' && l.tier !== selectedTier) return false;
      }
      if (selectedChapter !== 'all' && l.stageLabel !== selectedChapter) return false;
      return true;
    }).sort((a, b) => {
      if (selectedTrack === 'khong_chuyen') {
        const gDiff = (gradeOrder[a.grade] ?? 99) - (gradeOrder[b.grade] ?? 99);
        if (gDiff !== 0) return gDiff;
        return a.lessonNumber - b.lessonNumber;
      }
      return 0;
    });
  }, [selectedTrack, selectedGrade, selectedTier, selectedChapter]);

  // Current selected lesson
  const selectedLessonId = location.physicsLessonId;
  const lesson = useMemo(() => {
    const matchInAny = PHYSICS_LESSONS.find((l) => l.id === selectedLessonId);
    const matchInTrack = filteredLessons.find((l) => l.id === selectedLessonId);
    if (matchInTrack) return matchInTrack;
    if (matchInAny) return matchInAny;
    return filteredLessons[0] || PHYSICS_LESSONS[0];
  }, [selectedLessonId, filteredLessons]);

  const currentLessonIndex = useMemo(
    () => filteredLessons.findIndex((l) => l.id === lesson.id),
    [filteredLessons, lesson.id]
  );

  // Active sub-tab: 'theory' | 'simulation' | 'sim3d' | 'practice'
  const activeTab = location.physicsTab;
  const is2DHub = activeView === 'sim2d_hub';
  const is3DHub = activeView === 'sim3d_hub';

  const activeDomainMeta = useMemo(
    () => PHYSICS_DOMAINS.find((d) => d.id === location.physicsDomain) || PHYSICS_DOMAINS[0],
    [location.physicsDomain]
  );
  const activeDomain2DSims = useMemo(
    () => get2DSimsByDomain(activeDomainMeta.id),
    [activeDomainMeta.id]
  );
  const activeDomain3DSims = useMemo(
    () => get3DSimsByDomain(activeDomainMeta.id),
    [activeDomainMeta.id]
  );

  const active2DSpec = useMemo(() => {
    if (is2DHub) {
      return (
        PHYSICS_2D_SIMS[location.physicsSim2D] ||
        activeDomain2DSims[0] ||
        PHYSICS_2D_SIMS.kinematics_graphs
      );
    }
    return PHYSICS_2D_SIMS[lesson.simulationType] || null;
  }, [is2DHub, location.physicsSim2D, activeDomain2DSims, lesson.simulationType]);

  const active3DSpec = useMemo(() => {
    return (
      PHYSICS_3D_SIMS[location.physicsSim3D] ||
      activeDomain3DSims[0] ||
      PHYSICS_3D_SIMS.kinematics_3d
    );
  }, [location.physicsSim3D, activeDomain3DSims]);

  const activeSimType: PhysicsSimType = is2DHub && active2DSpec
    ? active2DSpec.id
    : lesson.simulationType;
  const activeDefaultParams: Record<string, number> = is2DHub && active2DSpec
    ? active2DSpec.defaultParams
    : lesson.defaultParams;
  const activeParamBounds = is2DHub && active2DSpec
    ? active2DSpec.paramBounds
    : lesson.paramBounds;
  const activeSimTitle = is2DHub && active2DSpec
    ? active2DSpec.title
    : lesson.title.split(':')[0];
  const activePresets = active2DSpec?.presets || [];

  const [isSimFullscreen, setIsSimFullscreen] = useState<boolean>(false);
  const [isCodeCompilerOpen, setIsCodeCompilerOpen] = useState<boolean>(false);

  // Simulation controls & params
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [params, setParams] = useState<Record<string, number>>(activeDefaultParams);

  // Interactive scientific overlays, experiment flags, stopwatch & data logger
  const [overlays, setOverlays] = useState<OverlayState>({
    showRulerGrid: true,
    showVectors: true,
    showTrace: true,
    showRealtimeChart: true
  });
  const [labFlags, setLabFlags] = useState<LabFlags>({
    circuitOpen: false,
    reversePolarity: false,
    showVoltmeter: true,
    isDiverging: false,
    showThirdRay: true,
    airDrag: false,
    hasFriction: false,
    singleSource: false,
    showNodalLines: true,
    flipMagnet: false,
    inductionAction: 0,
    showProtractor: true,
    showFieldGrid: true
  });

  const [stopwatchRunning, setStopwatchRunning] = useState<boolean>(false);
  const [stopwatchElapsed, setStopwatchElapsed] = useState<number>(0);
  const [dataLogs, setDataLogs] = useState<DataLogEntry[]>([]);

  // Quiz / practice states
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [revealedEssayHints, setRevealedEssayHints] = useState<Record<string, boolean>>({});
  const [revealedEssaySolutions, setRevealedEssaySolutions] = useState<Record<string, boolean>>({});

  // Canvas & simulation refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(isRunning);
  const simSpeedRef = useRef<number>(simSpeed);
  const paramsRef = useRef<Record<string, number>>(params);
  const overlaysRef = useRef<OverlayState>(overlays);
  const labFlagsRef = useRef<LabFlags>(labFlags);
  const stopwatchRunningRef = useRef<boolean>(stopwatchRunning);
  const stopwatchAccumRef = useRef<number>(0);
  const lastStopwatchUiRef = useRef<number>(0);
  const lastTelemetryUpdateRef = useRef<number>(0);
  const forceTelemetrySyncRef = useRef<boolean>(true);
  const oscHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    simSpeedRef.current = simSpeed;
  }, [simSpeed]);

  useEffect(() => {
    paramsRef.current = params;
    forceTelemetrySyncRef.current = true;
  }, [params]);

  useEffect(() => {
    overlaysRef.current = overlays;
    forceTelemetrySyncRef.current = true;
  }, [overlays]);

  useEffect(() => {
    labFlagsRef.current = labFlags;
    forceTelemetrySyncRef.current = true;
  }, [labFlags]);

  useEffect(() => {
    stopwatchRunningRef.current = stopwatchRunning;
  }, [stopwatchRunning]);

  // Telemetry real-time values
  const [telemetry, setTelemetry] = useState<{
    metric1Label: string;
    metric1Val: string;
    metric2Label: string;
    metric2Val: string;
    metric3Label: string;
    metric3Val: string;
    note: string;
  }>({
    metric1Label: 'Thông số 1',
    metric1Val: '--',
    metric2Label: 'Thông số 2',
    metric2Val: '--',
    metric3Label: 'Thông số 3',
    metric3Val: '--',
    note: 'Điều chỉnh tham số hoặc nhập số trực tiếp để khảo sát quy luật vật lí theo thời gian thực.'
  });
  const telemetryRef = useRef(telemetry);

  const pushTelemetry = useCallback((next: typeof telemetry) => {
    telemetryRef.current = next;
    const now = performance.now();
    if (forceTelemetrySyncRef.current || now - lastTelemetryUpdateRef.current >= 100) {
      lastTelemetryUpdateRef.current = now;
      forceTelemetrySyncRef.current = false;
      setTelemetry(next);
    }
  }, []);

  // When lesson or standalone domain sim changes, reset params, clock, stopwatch & data logs
  useEffect(() => {
    setParams(activeDefaultParams);
    paramsRef.current = activeDefaultParams;
    simTimeRef.current = 0;
    oscHistoryRef.current = [];
    stopwatchAccumRef.current = 0;
    setStopwatchElapsed(0);
    setStopwatchRunning(false);
    setDataLogs([]);
    setIsRunning(true);
    forceTelemetrySyncRef.current = true;
  }, [activeView, activeSimType, lesson.id]);

  // Escape key to exit simulation fullscreen
  useEffect(() => {
    if (!isSimFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSimFullscreen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSimFullscreen]);

  const handleOpenLesson = (targetLesson: PhysicsLesson, targetTab: 'theory' | 'simulation' | 'sim3d' | 'practice' = 'theory') => {
    navigate({
      physicsLessonId: targetLesson.id,
      physicsTab: targetTab,
      physicsView: 'lecture'
    });
  };

  const openDomain2D = (domainId: PhysicsDomainId, simId?: PhysicsSimType) => {
    const sims = get2DSimsByDomain(domainId);
    const chosen = simId && PHYSICS_2D_SIMS[simId]?.domainId === domainId ? simId : sims[0]?.id || 'kinematics_graphs';
    setIsSimFullscreen(false);
    navigate({
      subject: 'physics',
      physicsView: 'sim2d_hub',
      physicsDomain: domainId,
      physicsSim2D: chosen
    });
  };

  const openDomain3D = (domainId: PhysicsDomainId, modeId?: Physics3DMode) => {
    const sims = get3DSimsByDomain(domainId);
    const chosen = modeId && PHYSICS_3D_SIMS[modeId]?.domainId === domainId ? modeId : sims[0]?.id || 'kinematics_3d';
    setIsSimFullscreen(false);
    navigate({
      subject: 'physics',
      physicsView: 'sim3d_hub',
      physicsDomain: domainId,
      physicsSim3D: chosen
    });
  };

  const handleStepOnce = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    simTimeRef.current += 0.05;
    if (stopwatchRunningRef.current) {
      stopwatchAccumRef.current += 0.05;
      setStopwatchElapsed(stopwatchAccumRef.current);
    }
    forceTelemetrySyncRef.current = true;
  };

  const handleResetSim = () => {
    simTimeRef.current = 0;
    oscHistoryRef.current = [];
    stopwatchAccumRef.current = 0;
    setStopwatchElapsed(0);
    setParams(activeDefaultParams);
    setIsRunning(true);
    forceTelemetrySyncRef.current = true;
  };

  const handleLogSample = () => {
    const snap = telemetryRef.current;
    setDataLogs((prev) => [
      {
        id: prev.length + 1,
        timeStr: `${simTimeRef.current.toFixed(2)} s`,
        m1Label: snap.metric1Label,
        m1Val: snap.metric1Val,
        m2Label: snap.metric2Label,
        m2Val: snap.metric2Val,
        m3Label: snap.metric3Label,
        m3Val: snap.metric3Val
      },
      ...prev.slice(0, 14)
    ]);
  };

  // Submit exercise answer
  const handleAnswer = (exId: string, optIndex: number, correctIdx: number) => {
    if (userAnswers[exId] !== undefined) return; // already answered
    setUserAnswers((prev) => ({ ...prev, [exId]: optIndex }));

    if (optIndex === correctIdx) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      if (onScoreEarned) onScoreEarned(25);
    }
  };

  // -------------------------------------------------------------
  // 60 FPS HTML5 Canvas Physics Engine (Ref-driven, zero stutter)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!((activeView === 'lecture' && activeTab === 'simulation') || activeView === 'sim2d_hub')) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cachedW = canvas.clientWidth;
    let cachedH = canvas.clientHeight;
    let cachedDark = document.documentElement.classList.contains('dark');
    const classObs = new MutationObserver(() => {
      cachedDark = document.documentElement.classList.contains('dark');
    });
    classObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const resizeObs =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
              cachedW = entry.contentRect.width;
              cachedH = entry.contentRect.height;
            }
          })
        : null;
    resizeObs?.observe(canvas);

    let lastTimestamp = performance.now();
    let lastIdleDrawMs = 0;

    const render = (now: number) => {
      animFrameIdRef.current = requestAnimationFrame(render);
      if (document.hidden) {
        lastTimestamp = now;
        return;
      }

      if (!isRunningRef.current && now - lastIdleDrawMs < 65) {
        lastTimestamp = now;
        return;
      }
      lastIdleDrawMs = now;

      const rawDt = Math.min((now - lastTimestamp) / 1000, 0.05);
      const dt = rawDt * simSpeedRef.current;
      lastTimestamp = now;

      if (isRunningRef.current) {
        simTimeRef.current += dt;
        if (stopwatchRunningRef.current) {
          stopwatchAccumRef.current += dt;
          if (now - lastStopwatchUiRef.current >= 60) {
            lastStopwatchUiRef.current = now;
            setStopwatchElapsed(stopwatchAccumRef.current);
          }
        }
      }
      const t = simTimeRef.current;
      const curOverlays = overlaysRef.current;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = cachedW || canvas.clientWidth;
      const h = cachedH || canvas.clientHeight;
      if (w <= 0 || h <= 0) {
        return;
      }
      const targetCw = Math.floor(w * dpr);
      const targetCh = Math.floor(h * dpr);
      if (canvas.width !== targetCw || canvas.height !== targetCh) {
        canvas.width = targetCw;
        canvas.height = targetCh;
      }

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const isDark = cachedDark;

      // Clear Canvas Background
      ctx.fillStyle = isDark ? '#0c101d' : '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      // Draw Grid / Ruler Overlay (single batched stroke call)
      if (curOverlays.showRulerGrid) {
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)';
        ctx.lineWidth = 1;
        const gridSize = 30;
        ctx.beginPath();
        for (let x = 0; x < w; x += gridSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
        }
        for (let y = 0; y < h; y += gridSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }
        ctx.stroke();
      }

      // Render specialized 2D simulation
      switch (activeSimType) {
        case 'ohm_circuit':
          drawOhmCircuit(ctx, w, h, t, isDark);
          break;
        case 'lens_optics':
          drawLensOptics(ctx, w, h, t, isDark);
          break;
        case 'projectile_motion':
          drawProjectile(ctx, w, h, t, isDark);
          break;
        case 'free_fall_energy':
          drawFreeFall(ctx, w, h, t, isDark);
          break;
        case 'light_refraction':
          drawRefraction(ctx, w, h, isDark);
          break;
        case 'magnetic_induction':
          drawInduction(ctx, w, h, t, isDark);
          break;
        case 'spring_pendulum':
          drawSpring(ctx, w, h, t, isDark);
          break;
        case 'simple_pendulum':
          drawPendulum(ctx, w, h, t, isDark);
          break;
        case 'wave_interference':
          drawWaveInterference(ctx, w, h, t, isDark);
          break;
        case 'kinematics_graphs':
          drawKinematicsGraphs(ctx, w, h, t, isDark);
          break;
        case 'thermal_gas':
          drawThermalGas(ctx, w, h, t, isDark);
          break;
        case 'electric_field':
          drawElectricField(ctx, w, h, t, isDark);
          break;
        case 'nuclear_decay':
          drawNuclearDecay(ctx, w, h, t, isDark);
          break;
        case 'circular_motion':
          drawCircularMotion(ctx, w, h, t, isDark);
          break;
        case 'ac_rlc_circuit':
          drawAcRlcCircuit(ctx, w, h, t, isDark);
          break;
        case 'young_interference':
          drawYoungInterference(ctx, w, h, t, isDark);
          break;
        case 'standing_wave':
          drawStandingWave(ctx, w, h, t, isDark);
          break;
        case 'doppler_effect':
          drawDopplerEffect(ctx, w, h, t, isDark);
          break;
        case 'photoelectric_effect':
          drawPhotoelectricEffect(ctx, w, h, t, isDark);
          break;
        default: {
          const handledExtra = renderExtra2DPhysicsSim(
            activeSimType,
            ctx,
            w,
            h,
            t,
            isDark,
            paramsRef.current,
            curOverlays,
            pushTelemetry
          );
          if (!handledExtra) {
            drawSpring(ctx, w, h, t, isDark);
          }
          break;
        }
      }

      // Subtle Time Stamp badge in top-right of canvas
      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.72)' : 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(w - 94, 8, 84, 22);
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(w - 94, 8, 84, 22);
      ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`t = ${t.toFixed(2)}s`, w - 52, 23);

      ctx.restore();
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObs?.disconnect();
      classObs.disconnect();
    };
  }, [activeView, activeTab, activeSimType, isSimFullscreen]);

  // 1. Ohm's Law Circuit (Lớp 9 & 11)
  const drawOhmCircuit = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const flags = labFlagsRef.current;
    const ov = overlaysRef.current;

    const U = Math.max(0, p.voltage ?? 12);
    const R1 = Math.max(0.1, p.r1 ?? p.resistor1 ?? 10);
    const R2 = Math.max(0.1, p.r2 ?? p.resistor2 ?? 10);
    const isParallel = Math.round(p.circuitType ?? p.circuitMode ?? 0) === 1;
    const isOpen = flags.circuitOpen;
    const signDir = flags.reversePolarity ? -1 : 1;

    const R_eq = isParallel ? (R1 * R2) / Math.max(0.1, R1 + R2) : R1 + R2;
    const I = isOpen ? 0 : U / Math.max(0.1, R_eq);
    const P = U * I;
    const U1 = isOpen ? 0 : isParallel ? U : I * R1;

    pushTelemetry({
      metric1Label: 'Điện trở tương đương (Rtđ)',
      metric1Val: `${R_eq.toFixed(2)} Ω`,
      metric2Label: 'Cường độ dòng (I)',
      metric2Val: isOpen ? '0.00 A (Ngắt K)' : `${(I * signDir).toFixed(2)} A`,
      metric3Label: 'Công suất tiêu thụ (P)',
      metric3Val: `${P.toFixed(2)} W`,
      note: isOpen
        ? 'Khóa K đang MỞ: Mạch hở nên I = 0 A, đèn tắt.'
        : isParallel
        ? `Mạch song song: I₁ = ${(U / R1).toFixed(2)} A, I₂ = ${(U / R2).toFixed(2)} A, U₁ = U₂ = ${U.toFixed(1)} V`
        : `Mạch nối tiếp: Rtđ = R₁ + R₂. U₁ = ${(I * R1).toFixed(1)} V, U₂ = ${(I * R2).toFixed(1)} V`
    });

    const cx = w / 2;
    const cy = h / 2;
    const cw = Math.min(w * 0.68, 460);
    const ch = Math.min(h * 0.56, 250);

    const left = cx - cw / 2;
    const right = cx + cw / 2;
    const top = cy - ch / 2;
    const bottom = cy + ch / 2;

    // Draw Circuit Wire
    ctx.strokeStyle = isOpen ? '#64748b' : isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(cx + cw * 0.22, top);
    if (!isOpen) {
      ctx.lineTo(right, top);
    } else {
      ctx.moveTo(cx + cw * 0.36, top);
      ctx.lineTo(right, top);
    }
    ctx.lineTo(right, bottom);
    ctx.lineTo(left, bottom);
    ctx.closePath();
    ctx.stroke();

    // Switch K on Top-Right Wire
    const swX1 = cx + cw * 0.22;
    const swX2 = cx + cw * 0.36;
    ctx.fillStyle = isDark ? '#0c101d' : '#f8fafc';
    ctx.fillRect(swX1, top - 14, swX2 - swX1, 24);
    ctx.strokeStyle = isOpen ? '#ef4444' : '#10b981';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(swX1, top);
    if (isOpen) {
      ctx.lineTo(swX2 - 4, top - 20);
    } else {
      ctx.lineTo(swX2, top);
    }
    ctx.stroke();
    ctx.fillStyle = isDark ? '#e2e8f0' : '#0f172a';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isOpen ? 'K (Mở)' : 'K (Đóng)', (swX1 + swX2) / 2, top + 16);

    // Moving electrons / current flow
    if (!isOpen && I > 0.01) {
      const electronCount = 20;
      const perimeter = 2 * (cw + ch);
      const speedPix = Math.min(260, I * 55);
      const electronOffset = ((t * speedPix * signDir) % perimeter + perimeter) % perimeter;

      ctx.fillStyle = ov.showVectors ? '#facc15' : '#fde047';
      for (let i = 0; i < electronCount; i++) {
        const d = (electronOffset + (i * perimeter) / electronCount) % perimeter;
        let ex = left;
        let ey = top;

        if (d < cw) {
          ex = left + d;
          ey = top;
        } else if (d < cw + ch) {
          ex = right;
          ey = top + (d - cw);
        } else if (d < 2 * cw + ch) {
          ex = right - (d - cw - ch);
          ey = bottom;
        } else {
          ex = left;
          ey = bottom - (d - 2 * cw - ch);
        }

        ctx.beginPath();
        ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (ov.showVectors) {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(signDir > 0 ? 'Chiều I →' : '← Chiều I', cx - cw * 0.28, top - 10);
      }
    }

    // DC Battery on Top Wire
    const batW = 50;
    ctx.fillStyle = isDark ? '#0c101d' : '#f8fafc';
    ctx.fillRect(cx - batW / 2 - 20, top - 16, batW, 32);

    const batCx = cx - 20;
    const posOffset = flags.reversePolarity ? 9 : -9;
    const negOffset = flags.reversePolarity ? -9 : 9;

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(batCx + posOffset, top - 15);
    ctx.lineTo(batCx + posOffset, top + 15);
    ctx.stroke();

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(batCx + negOffset, top - 9);
    ctx.lineTo(batCx + negOffset, top + 9);
    ctx.stroke();

    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${flags.reversePolarity ? '−' : '+'} Nguồn U = ${U}V ${flags.reversePolarity ? '+' : '−'}`,
      batCx,
      top - 24
    );

    // Resistors on Bottom Wire
    if (!isParallel) {
      const drawResistorBox = (rx: number, ry: number, label: string, rVal: number) => {
        ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
        ctx.fillRect(rx - 36, ry - 14, 72, 28);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(rx - 36, ry - 14, 72, 28);

        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.font = '11px monospace';
        ctx.fillText(`${label}: ${rVal}Ω`, rx, ry + 4);
      };

      drawResistorBox(cx - 72, bottom, 'R1', R1);
      drawResistorBox(cx + 72, bottom, 'R2', R2);

      // Voltmeter across R1
      if (flags.showVoltmeter) {
        const vx = cx - 72;
        const vy = bottom - 48;
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(vx - 44, bottom);
        ctx.lineTo(vx - 44, vy);
        ctx.lineTo(vx + 44, vy);
        ctx.lineTo(vx + 44, bottom);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#1e293b' : '#f3e8ff';
        ctx.beginPath();
        ctx.arc(vx, vy, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`V:${U1.toFixed(1)}`, vx, vy + 4);
      }
    } else {
      const drawResistorBox = (rx: number, ry: number, label: string, rVal: number) => {
        ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
        ctx.fillRect(rx - 34, ry - 12, 68, 24);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(rx - 34, ry - 12, 68, 24);

        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.font = '10px monospace';
        ctx.fillText(`${label}=${rVal}Ω`, rx, ry + 3);
      };

      ctx.strokeStyle = isOpen ? '#64748b' : isDark ? '#38bdf8' : '#0284c7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 80, bottom);
      ctx.lineTo(cx - 80, bottom - 34);
      ctx.lineTo(cx + 80, bottom - 34);
      ctx.lineTo(cx + 80, bottom);
      ctx.stroke();

      drawResistorBox(cx, bottom, 'R1', R1);
      drawResistorBox(cx, bottom - 34, 'R2', R2);

      if (flags.showVoltmeter) {
        const vy = bottom - 70;
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx - 80, bottom - 34);
        ctx.lineTo(cx - 80, vy);
        ctx.lineTo(cx + 80, vy);
        ctx.lineTo(cx + 80, bottom - 34);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#1e293b' : '#f3e8ff';
        ctx.beginPath();
        ctx.arc(cx, vy, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`${U1.toFixed(1)}V`, cx, vy + 4);
      }
    }

    // Ammeter on Right Wire
    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.beginPath();
    ctx.arc(right, cy, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`${I.toFixed(2)}A`, right, cy + 4);

    // Glowing Lamp on Left Wire
    if (!isOpen && P > 0.05) {
      const glowRadius = Math.min(30 + P * 1.6, 65);
      const lampGrad = ctx.createRadialGradient(left, cy, 5, left, cy, glowRadius);
      lampGrad.addColorStop(0, 'rgba(250, 204, 21, 0.9)');
      lampGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = lampGrad;
      ctx.beginPath();
      ctx.arc(left, cy, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = isOpen ? '#64748b' : '#fbbf24';
    ctx.beginPath();
    ctx.arc(left, cy, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isOpen ? '#475569' : '#d97706';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = isOpen ? '#f8fafc' : '#78350f';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('Đèn', left, cy + 4);
  };

  // 2. Converging / Diverging Lens (Lớp 9 & Chuyên)
  const drawLensOptics = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    _t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const flags = labFlagsRef.current;
    const ov = overlaysRef.current;

    const fRaw = Math.max(1, Math.abs(p.f ?? p.focalLength ?? 15)); // cm
    const f = flags.isDiverging ? -fRaw : fRaw;
    const d = Math.max(0.5, p.d ?? p.objectDistance ?? 35); // cm
    const hObj = Math.max(0.5, p.objH ?? p.objectHeight ?? 10); // cm

    // Lens formula: 1/f = 1/d + 1/d' => d' = d*f / (d - f)
    const isAtFocal = Math.abs(d - f) < 0.15;
    const dPrime = isAtFocal ? 999999 : (d * f) / (d - f);
    const k = isAtFocal ? 0 : -dPrime / d;
    const hPrime = isAtFocal ? 0 : k * hObj;

    pushTelemetry({
      metric1Label: "Vị trí ảnh (d')",
      metric1Val: isAtFocal ? 'Vô cực (∞)' : `${dPrime.toFixed(1)} cm`,
      metric2Label: 'Số phóng đại (k)',
      metric2Val: isAtFocal ? '∞' : `${k.toFixed(2)}x`,
      metric3Label: "Chiều cao ảnh (A'B')",
      metric3Val: isAtFocal ? '∞' : `${Math.abs(hPrime).toFixed(1)} cm`,
      note: flags.isDiverging
        ? 'Thấu kính phân kì (f < 0): Luôn cho ảnh ảo, cùng chiều và nhỏ hơn vật.'
        : isAtFocal
        ? 'Vật đặt tại tiêu điểm F (d = f): Chùm tia ló song song, ảnh ở vô cực.'
        : dPrime > 0
        ? 'Thấu kính hội tụ: Ảnh thật, ngược chiều, hứng được trên màn chắn phía sau.'
        : 'Thấu kính hội tụ (d < f): Ảnh ảo cùng chiều, lớn hơn vật (kính lúp).'
    });

    const s = Math.min(1, w / 560, h / 320);
    const maxSpan = Math.max(30, Math.abs(d), isAtFocal ? fRaw * 2 : Math.min(140, Math.abs(dPrime)));
    const scale = Math.min(5.5 * s, (w * 0.42) / maxSpan);
    const lensHalfH = 128 * s;
    const cx = w / 2;
    const cy = h / 2;

    // Principal Axis
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, cy);
    ctx.lineTo(w - 20, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Optional cm ticks along principal axis
    if (ov.showRulerGrid) {
      ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      for (let cm = -80; cm <= 80; cm += 10) {
        if (cm === 0) continue;
        const tx = cx + cm * scale;
        if (tx > 25 && tx < w - 25) {
          ctx.beginPath();
          ctx.moveTo(tx, cy - 3);
          ctx.lineTo(tx, cy + 3);
          ctx.stroke();
          if (cm % 20 === 0) ctx.fillText(`${Math.abs(cm)}`, tx, cy + 13);
        }
      }
    }

    // Lens Body at Center
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy - lensHalfH);
    ctx.lineTo(cx, cy + lensHalfH);
    ctx.stroke();

    // Lens Arrows (Converging outward vs Diverging inward)
    ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
    if (!flags.isDiverging) {
      ctx.beginPath();
      ctx.moveTo(cx - 8 * s, cy - lensHalfH + 10 * s);
      ctx.lineTo(cx, cy - lensHalfH - 4 * s);
      ctx.lineTo(cx + 8 * s, cy - lensHalfH + 10 * s);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx - 8 * s, cy + lensHalfH - 10 * s);
      ctx.lineTo(cx, cy + lensHalfH + 4 * s);
      ctx.lineTo(cx + 8 * s, cy + lensHalfH - 10 * s);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx - 8 * s, cy - lensHalfH - 4 * s);
      ctx.lineTo(cx, cy - lensHalfH + 10 * s);
      ctx.lineTo(cx + 8 * s, cy - lensHalfH - 4 * s);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx - 8 * s, cy + lensHalfH + 4 * s);
      ctx.lineTo(cx, cy + lensHalfH - 10 * s);
      ctx.lineTo(cx + 8 * s, cy + lensHalfH + 4 * s);
      ctx.fill();
    }

    // Optical Center O & Foci F, F'
    const fPix = fRaw * scale;
    const leftFocusX = cx - fPix;
    const rightFocusX = cx + fPix;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(leftFocusX, cy, 4, 0, Math.PI * 2);
    ctx.arc(rightFocusX, cy, 4, 0, Math.PI * 2);
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('O', cx + 8, cy + 15);
    ctx.fillText(flags.isDiverging ? "F'" : 'F', leftFocusX, cy - 10);
    ctx.fillText(flags.isDiverging ? 'F' : "F'", rightFocusX, cy - 10);

    // Object AB
    const objX = cx - d * scale;
    const objY = cy - hObj * scale;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(objX, cy);
    ctx.lineTo(objX, objY);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(objX - 6, objY + 8);
    ctx.lineTo(objX, objY - 2);
    ctx.lineTo(objX + 6, objY + 8);
    ctx.fill();
    ctx.fillText('B (Vật)', objX, objY - 10);

    // Image A'B' & Rays
    if (!isAtFocal && Math.abs(dPrime) < 220) {
      const imgX = cx + dPrime * scale;
      const imgY = cy - hPrime * scale;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      if (dPrime < 0) ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(imgX, cy);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();
      ctx.setLineDash([]);

      const arrowDir = hPrime < 0 ? 1 : -1;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(imgX - 5, imgY - arrowDir * 6);
      ctx.lineTo(imgX, imgY + arrowDir * 2);
      ctx.lineTo(imgX + 5, imgY - arrowDir * 6);
      ctx.fill();
      ctx.fillText(dPrime > 0 ? "B' (Thật)" : "B' (Ảo)", imgX, imgY + (hPrime < 0 ? 18 : -10));

      // Ray 1: Parallel to axis -> refracted via F'
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(cx, objY);
      if (dPrime > 0) {
        ctx.lineTo(imgX, imgY);
      } else {
        const slope = flags.isDiverging
          ? (objY - cy) / (cx - leftFocusX)
          : (cy - objY) / (rightFocusX - cx);
        ctx.lineTo(w - 20, objY + slope * (w - 20 - cx));
      }
      ctx.stroke();

      if (dPrime < 0) {
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(cx, objY);
        ctx.lineTo(imgX, imgY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Ray 2: Straight through O
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(dPrime > 0 ? imgX : w - 20, dPrime > 0 ? imgY : cy + ((cy - objY) / (cx - objX)) * (w - 20 - cx));
      ctx.stroke();

      // Ray 3: Through F -> parallel to axis
      if (flags.showThirdRay && !flags.isDiverging) {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.75)';
        ctx.beginPath();
        ctx.moveTo(objX, objY);
        ctx.lineTo(cx, imgY);
        if (dPrime > 0) {
          ctx.lineTo(imgX, imgY);
        } else {
          ctx.lineTo(w - 20, imgY);
        }
        ctx.stroke();
        if (dPrime < 0) {
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.moveTo(cx, imgY);
          ctx.lineTo(imgX, imgY);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }
  };

  // 3. Projectile Motion (Lớp 10 & Chuyên)
  const drawProjectile = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const flags = labFlagsRef.current;
    const ov = overlaysRef.current;

    const v0 = Math.max(0.5, p.v0 ?? p.initialVelocity ?? 25);
    const alphaDeg = p.angle ?? p.launchAngle ?? p.angleDeg ?? 45;
    const alphaRad = (alphaDeg * Math.PI) / 180;
    const g = Math.max(0.2, p.g ?? p.gravity ?? 9.8);
    const h0 = Math.max(0, p.h0 ?? p.height ?? 0);

    const v0x = v0 * Math.cos(alphaRad);
    const v0y = v0 * Math.sin(alphaRad);
    const dragCoeff = flags.airDrag ? 0.16 : 0;

    // Total flight time (analytical vacuum + drag scaling)
    const delta = v0y * v0y + 2 * g * h0;
    const tVac = (v0y + Math.sqrt(Math.max(0, delta))) / g;
    const tTotal = flags.airDrag ? tVac * 0.92 : tVac;
    const posAt = (tt: number) => {
      if (!flags.airDrag) {
        return {
          x: v0x * tt,
          y: Math.max(0, h0 + v0y * tt - 0.5 * g * tt * tt),
          vx: v0x,
          vy: v0y - g * tt
        };
      }
      const k = dragCoeff;
      const expFactor = (1 - Math.exp(-k * tt)) / k;
      const xDrag = v0x * expFactor;
      const yDrag = Math.max(0, h0 + v0y * expFactor * 0.94 - 0.5 * g * tt * tt * 0.98);
      return {
        x: xDrag,
        y: yDrag,
        vx: v0x * Math.exp(-k * tt),
        vy: v0y * Math.exp(-k * tt) - g * tt
      };
    };

    const endSample = posAt(tTotal);
    const maxRange = Math.max(1, endSample.x);
    const maxH = Math.max(1, h0 + (v0y > 0 ? (v0y * v0y) / (2 * g) : 0));

    const curT = t % (tTotal + 1.1);
    const inFlight = curT <= tTotal;
    const curState = inFlight ? posAt(curT) : { x: maxRange, y: 0, vx: 0, vy: 0 };
    const curV = Math.sqrt(curState.vx * curState.vx + curState.vy * curState.vy);

    pushTelemetry({
      metric1Label: 'Tầm xa tối đa (L)',
      metric1Val: `${maxRange.toFixed(1)} m`,
      metric2Label: 'Độ cao cực đại (Hmax)',
      metric2Val: `${maxH.toFixed(1)} m`,
      metric3Label: 'Vận tốc tức thời (v)',
      metric3Val: `${curV.toFixed(1)} m/s`,
      note: flags.airDrag
        ? `Có lực cản không khí: Tầm xa giảm còn ${maxRange.toFixed(1)} m. vx giảm theo hàm mũ.`
        : `Chuyển động ném không ma sát: t = ${curT.toFixed(2)}s / ${tTotal.toFixed(2)}s | vx = ${curState.vx.toFixed(1)} m/s, vy = ${curState.vy.toFixed(1)} m/s`
    });

    const groundY = h - 54;
    const scaleX = (w - 130) / Math.max(10, maxRange * 1.12);
    const scaleY = (h - 130) / Math.max(5, maxH * 1.22);
    const originX = 56;

    // Ground
    ctx.fillStyle = isDark ? '#1e293b' : '#cbd5e1';
    ctx.fillRect(0, groundY, w, 54);
    ctx.strokeStyle = isDark ? '#334155' : '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Ground meter ticks
    if (ov.showRulerGrid) {
      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      const stepM = Math.max(5, Math.ceil(maxRange / 5 / 5) * 5);
      for (let m = 0; m <= maxRange * 1.1; m += stepM) {
        const rx = originX + m * scaleX;
        if (rx < w - 20) {
          ctx.beginPath();
          ctx.moveTo(rx, groundY);
          ctx.lineTo(rx, groundY + 6);
          ctx.stroke();
          ctx.fillText(`${m}m`, rx, groundY + 18);
        }
      }
    }

    // Launch cliff (h0)
    if (h0 > 0) {
      const hillW = originX - 8;
      const hillTopY = groundY - h0 * scaleY;
      ctx.fillStyle = isDark ? '#334155' : '#94a3b8';
      ctx.fillRect(0, hillTopY, hillW, groundY - hillTopY);
    }

    // Parabolic trajectory trace
    if (ov.showTrace) {
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.5)' : 'rgba(2, 132, 199, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        const sample = posAt((i / steps) * tTotal);
        const px = originX + sample.x * scaleX;
        const py = groundY - sample.y * scaleY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Projectile Ball
    const ballPx = originX + curState.x * scaleX;
    const ballPy = groundY - curState.y * scaleY;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(ballPx, ballPy, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fee2e2';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Velocity Vector & Components
    if (ov.showVectors && inFlight) {
      const vecScale = 1.25;
      // vx
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(ballPx, ballPy);
      ctx.lineTo(ballPx + curState.vx * vecScale, ballPy);
      ctx.stroke();
      // vy
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(ballPx, ballPy);
      ctx.lineTo(ballPx, ballPy - curState.vy * vecScale);
      ctx.stroke();
      // v total
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(ballPx, ballPy);
      ctx.lineTo(ballPx + curState.vx * vecScale, ballPy - curState.vy * vecScale);
      ctx.stroke();
    }
  };

  // 4. Free Fall & Mechanical Energy (Lớp 9 & 10)
  const drawFreeFall = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const flags = labFlagsRef.current;
    const ov = overlaysRef.current;

    const H = Math.max(0.5, p.height ?? p.dropHeight ?? 20);
    const m = Math.max(0.05, p.mass ?? 2.0);
    const g = Math.max(0.2, p.gravity ?? 9.8);

    const tVac = Math.sqrt((2 * H) / g);
    const tTotal = flags.airDrag ? tVac * 1.18 : tVac;
    const curT = t % (tTotal + 1.0);
    const inDrop = curT <= tTotal;

    const dragFactor = flags.airDrag ? 0.85 : 1.0;
    const curY = inDrop ? Math.max(0, H - 0.5 * g * dragFactor * curT * curT * (tVac / tTotal) ** 0.3) : 0;
    const curV = inDrop ? g * curT * (flags.airDrag ? 0.78 : 1.0) : Math.sqrt(2 * g * H) * (flags.airDrag ? 0.78 : 1.0);

    const Ep = m * g * curY;
    const Ek = 0.5 * m * curV * curV;
    const ETotal = Math.max(0.01, m * g * H);
    const EThermal = flags.airDrag ? Math.max(0, ETotal - Ep - Ek) : 0;

    pushTelemetry({
      metric1Label: 'Thế năng (Wt)',
      metric1Val: `${Ep.toFixed(1)} J`,
      metric2Label: 'Động năng (Wđ)',
      metric2Val: `${Ek.toFixed(1)} J`,
      metric3Label: flags.airDrag ? 'Nhiệt hao phí (Q)' : 'Cơ năng (W)',
      metric3Val: flags.airDrag ? `${EThermal.toFixed(1)} J` : `${ETotal.toFixed(1)} J`,
      note: flags.airDrag
        ? `Có lực cản không khí: Một phần cơ năng chuyển hóa thành nhiệt (${EThermal.toFixed(1)} J).`
        : `Bảo toàn cơ năng: W = Wđ + Wt = ${ETotal.toFixed(1)} J. Vận tốc chạm đất: ${Math.sqrt(2 * g * H).toFixed(1)} m/s.`
    });

    const groundY = h - 46;
    const topY = 44;
    const dropScale = Math.max(1, groundY - topY) / H;
    const ballX = Math.max(76, w * 0.3);
    const ballY = topY + (H - curY) * dropScale;

    // Ground
    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.fillRect(0, groundY, w, 46);

    // Height Ruler
    if (ov.showRulerGrid) {
      ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ballX - 34, topY);
      ctx.lineTo(ballX - 34, groundY);
      ctx.stroke();

      const stepM = Math.max(2, Math.floor(H / 5));
      for (let meter = 0; meter <= H; meter += stepM) {
        const markY = groundY - meter * dropScale;
        ctx.beginPath();
        ctx.moveTo(ballX - 42, markY);
        ctx.lineTo(ballX - 34, markY);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${meter}m`, Math.max(6, ballX - 66), markY + 4);
      }
    }

    // Strobe motion trail
    if (ov.showTrace && inDrop) {
      for (let i = 1; i <= 4; i++) {
        const pastT = Math.max(0, curT - i * 0.14);
        const pastY = Math.max(0, H - 0.5 * g * dragFactor * pastT * pastT);
        const py = topY + (H - pastY) * dropScale;
        ctx.fillStyle = `rgba(59, 130, 246, ${0.35 - i * 0.07})`;
        ctx.beginPath();
        ctx.arc(ballX, py, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Falling Ball
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Velocity & Weight vector
    if (ov.showVectors) {
      const vLen = Math.min(70, curV * 2.5);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ballX + 18, ballY);
      ctx.lineTo(ballX + 18, ballY + vLen);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('v', ballX + 23, ballY + vLen / 2 + 4);
    }

    // Energy Bar Chart on Right side
    if (ov.showRealtimeChart) {
      const barW = Math.min(82, Math.max(54, w * 0.22));
      const barX = Math.min(w - barW - 18, w * 0.62);
      const barMaxH = Math.min(180, Math.max(100, groundY - topY - 12));
      const barY = groundY - barMaxH;

      ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.fillRect(barX, barY, barW, barMaxH);

      const epHeight = Math.max(0, Math.min(barMaxH, (Ep / ETotal) * barMaxH));
      ctx.fillStyle = '#10b981';
      ctx.fillRect(barX, groundY - epHeight, barW, epHeight);

      const ekHeight = Math.max(0, Math.min(barMaxH - epHeight, (Ek / ETotal) * barMaxH));
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(barX, groundY - epHeight - ekHeight, barW, ekHeight);

      if (EThermal > 0.1) {
        const thHeight = Math.max(0, barMaxH - epHeight - ekHeight);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(barX, barY, barW, thHeight);
      }

      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Biểu đồ Năng lượng', barX + barW / 2, barY - 12);
      if (epHeight > 14) ctx.fillText(`Wt: ${Ep.toFixed(0)}J`, barX + barW / 2, groundY - epHeight / 2 + 4);
      if (ekHeight > 14) {
        ctx.fillText(`Wđ: ${Ek.toFixed(0)}J`, barX + barW / 2, groundY - epHeight - ekHeight / 2 + 4);
      }
    }
  };

  // 5. Light Refraction & Total Internal Reflection (Lớp 11 & 12)
  const drawRefraction = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const flags = labFlagsRef.current;
    const ov = overlaysRef.current;

    const n1 = Math.max(1.0, p.n1 ?? 1.33);
    const n2 = Math.max(1.0, p.n2 ?? 1.0);
    const iDeg = Math.max(0, Math.min(89.9, p.angleI ?? p.angle ?? p.incidentAngle ?? 30));
    const iRad = (iDeg * Math.PI) / 180;

    const sinI = Math.sin(iRad);
    const sinR = (n1 / n2) * sinI;
    const isTIR = sinR > 1.0;
    const rRad = isTIR ? 0 : Math.asin(sinR);
    const rDeg = isTIR ? 0 : (rRad * 180) / Math.PI;

    const sinIgh = n1 > n2 ? n2 / n1 : 1.0;
    const ighDeg = n1 > n2 ? (Math.asin(sinIgh) * 180) / Math.PI : 90;

    pushTelemetry({
      metric1Label: 'Góc tới hạn (igh)',
      metric1Val: n1 > n2 ? `${ighDeg.toFixed(1)}°` : 'Không có (n1 ≤ n2)',
      metric2Label: 'Góc khúc xạ (r)',
      metric2Val: isTIR ? 'Phản xạ toàn phần' : `${rDeg.toFixed(1)}°`,
      metric3Label: 'Trạng thái tia ló',
      metric3Val: isTIR ? '100% Tia phản xạ' : 'Khúc xạ + Phản xạ 1 phần',
      note: isTIR
        ? `Phản xạ toàn phần vì i (${iDeg.toFixed(1)}°) > igh (${ighDeg.toFixed(1)}°)`
        : `Định luật Snell: ${n1.toFixed(2)} · sin(${iDeg.toFixed(1)}°) = ${n2.toFixed(2)} · sin(${rDeg.toFixed(1)}°)`
    });

    const midY = h / 2;
    const midX = w / 2;
    const beamLen = Math.min(165, Math.min(w, h) * 0.42);

    // Mediums
    ctx.fillStyle = isDark ? '#1e293b' : '#e0f2fe';
    ctx.fillRect(0, 0, w, midY);
    ctx.fillStyle = isDark ? '#0f172a' : '#f0fdf4';
    ctx.fillRect(0, midY, w, h - midY);

    // Boundary
    ctx.strokeStyle = isDark ? '#64748b' : '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    // Protractor overlay (Thước đo góc 360°)
    if (flags.showProtractor) {
      const pR = Math.min(110, Math.min(w, h) * 0.28);
      ctx.strokeStyle = isDark ? 'rgba(248, 250, 252, 0.22)' : 'rgba(15, 23, 42, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(midX, midY, pR, 0, Math.PI * 2);
      ctx.stroke();

      for (let deg = 0; deg < 360; deg += 15) {
        const rad = (deg * Math.PI) / 180;
        const inner = deg % 45 === 0 ? pR - 10 : pR - 5;
        ctx.beginPath();
        ctx.moveTo(midX + inner * Math.cos(rad), midY + inner * Math.sin(rad));
        ctx.lineTo(midX + pR * Math.cos(rad), midY + pR * Math.sin(rad));
        ctx.stroke();
      }
    }

    // Normal line
    ctx.strokeStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(midX, 20);
    ctx.lineTo(midX, h - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = isDark ? '#93c5fd' : '#0369a1';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Môi trường 1 (n₁ = ${n1.toFixed(2)})`, 20, 30);
    ctx.fillText(`Môi trường 2 (n₂ = ${n2.toFixed(2)})`, 20, midY + 30);

    // Incident Ray
    const incStartX = midX - beamLen * Math.sin(iRad);
    const incStartY = midY - beamLen * Math.cos(iRad);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(incStartX, incStartY);
    ctx.lineTo(midX, midY);
    ctx.stroke();

    // Reflected Ray
    const refEndX = midX + beamLen * Math.sin(iRad);
    const refEndY = midY - beamLen * Math.cos(iRad);
    ctx.strokeStyle = isTIR ? '#ef4444' : 'rgba(239, 68, 68, 0.45)';
    ctx.lineWidth = isTIR ? 3.5 : 2;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(refEndX, refEndY);
    ctx.stroke();

    // Refracted Ray
    if (!isTIR) {
      const refrEndX = midX + beamLen * Math.sin(rRad);
      const refrEndY = midY + beamLen * Math.cos(rRad);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(refrEndX, refrEndY);
      ctx.stroke();

      if (ov.showVectors) {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`r=${rDeg.toFixed(1)}°`, midX + 18, midY + 55);
      }
    }
    if (ov.showVectors) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`i=${iDeg.toFixed(1)}°`, midX - 62, midY - 40);
    }
  };

  // 6. Magnetic Induction (Lớp 11 & 12)
  const drawInduction = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const flags = labFlagsRef.current;
    const ov = overlaysRef.current;

    const N = Math.max(1, p.turns ?? 15);
    const B0 = Math.max(0.05, p.B ?? p.bField ?? p.magneticField ?? 1.2);
    const speed = Math.max(0.1, p.velocity ?? p.magnetSpeed ?? (p.rotationSpeed ? p.rotationSpeed / 30 : 4.0));
    const poleSign = flags.flipMagnet ? -1 : 1;

    // inductionAction: 0 = Oscillate, 1 = Move In, 2 = Pull Out, 3 = Stationary
    let magnetPos = 0;
    let dPosDt = 0;
    if (flags.inductionAction === 0) {
      const freq = speed * 0.7;
      magnetPos = Math.sin(t * freq);
      dPosDt = freq * Math.cos(t * freq);
    } else if (flags.inductionAction === 1) {
      const cycle = (t * speed * 0.35) % 2;
      magnetPos = cycle <= 1 ? -1 + 2 * cycle : 1;
      dPosDt = cycle <= 1 ? speed * 0.7 : 0;
    } else if (flags.inductionAction === 2) {
      const cycle = (t * speed * 0.35) % 2;
      magnetPos = cycle <= 1 ? 1 - 2 * cycle : -1;
      dPosDt = cycle <= 1 ? -speed * 0.7 : 0;
    } else {
      magnetPos = 0.25;
      dPosDt = 0;
    }

    const flux = poleSign * B0 * N * 0.015 * (1 + 0.8 * magnetPos);
    const eC = -poleSign * B0 * N * 0.015 * 0.8 * dPosDt;

    if (isRunningRef.current) {
      oscHistoryRef.current.push(eC);
      if (oscHistoryRef.current.length > 90) oscHistoryRef.current.shift();
    }

    pushTelemetry({
      metric1Label: 'Từ thông qua ống dây (Φ)',
      metric1Val: `${(flux * 1000).toFixed(1)} mWb`,
      metric2Label: 'Suất điện động cảm ứng (ec)',
      metric2Val: `${eC.toFixed(2)} V`,
      metric3Label: 'Dòng điện cảm ứng (ic)',
      metric3Val: `${(eC * 12).toFixed(1)} mA`,
      note:
        Math.abs(eC) < 0.05
          ? 'Nam châm ĐỨNG YÊN: Từ thông không đổi (ΔΦ = 0) → Không có dòng điện cảm ứng!'
          : eC > 0
          ? 'Định luật Len-xơ: Từ trường cảm ứng chống lại sự biến thiên từ thông ban đầu.'
          : 'Đảo cực hoặc đổi chiều chuyển động làm đổi dấu suất điện động cảm ứng e_c.'
    });

    const midX = w / 2;
    const midY = h * 0.44;
    const s = Math.min(1, w / 480, h / 280);

    // Solenoid Coil
    const coilW = 140 * s;
    const coilH = 70 * s;
    ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
    ctx.fillRect(midX - coilW / 2, midY - coilH / 2, coilW, coilH);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;

    const loops = Math.min(12, Math.max(4, Math.round(N / 2)));
    for (let i = 0; i < loops; i++) {
      const lx = midX - coilW / 2 + (i * coilW) / (loops - 1);
      ctx.beginPath();
      ctx.ellipse(lx, midY, 6 * s, coilH / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Bar Magnet
    const magW = 84 * s;
    const magH = 36 * s;
    const magX = midX - 155 * s + magnetPos * 54 * s;
    const magY = midY;

    // Field lines around magnet
    if (ov.showVectors) {
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.3)';
      ctx.lineWidth = 1.4;
      for (let arc = 1; arc <= 2; arc++) {
        ctx.beginPath();
        ctx.ellipse(magX + magW / 2, magY, magW * (0.65 + arc * 0.25), magH * (0.75 + arc * 0.45), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const leftIsNorth = flags.flipMagnet;
    ctx.fillStyle = leftIsNorth ? '#ef4444' : '#3b82f6';
    ctx.fillRect(magX, magY - magH / 2, magW / 2, magH);
    ctx.fillStyle = leftIsNorth ? '#3b82f6' : '#ef4444';
    ctx.fillRect(magX + magW / 2, magY - magH / 2, magW / 2, magH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(leftIsNorth ? 'N' : 'S', magX + magW / 4, magY + 4);
    ctx.fillText(leftIsNorth ? 'S' : 'N', magX + (3 * magW) / 4, magY + 4);

    // Galvanometer
    const galX = midX;
    const galY = Math.min(h - 32, midY + 86 * s);
    const galR = 24 * s;
    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.beginPath();
    ctx.arc(galX, galY, galR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const needleAngle = -Math.PI / 2 + Math.max(-1.2, Math.min(1.2, eC * 0.35));
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(galX, galY);
    ctx.lineTo(galX + 17 * s * Math.cos(needleAngle), galY + 17 * s * Math.sin(needleAngle));
    ctx.stroke();

    // Live e_c(t) mini oscilloscope chart
    if (ov.showRealtimeChart && oscHistoryRef.current.length > 2) {
      const cw2 = Math.min(130, w * 0.28);
      const ch2 = 54;
      const cx2 = w - cw2 - 12;
      const cy2 = h - ch2 - 12;
      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(cx2, cy2, cw2, ch2);
      ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx2, cy2, cw2, ch2);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      const hist = oscHistoryRef.current;
      const maxAmp = Math.max(1.5, ...hist.map(Math.abs));
      for (let i = 0; i < hist.length; i++) {
        const px = cx2 + (i / Math.max(1, hist.length - 1)) * cw2;
        const py = cy2 + ch2 / 2 - (hist[i] / maxAmp) * (ch2 * 0.38);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  };

  // 7. Spring Pendulum (Lớp 11 & 12)
  const drawSpring = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const flags = labFlagsRef.current;
    const ov = overlaysRef.current;

    const m = Math.max(0.05, p.m ?? p.mass ?? 1.0);
    const k = Math.max(0.5, p.k ?? p.stiffness ?? p.springK ?? 40);
    const rawAmp = p.A ?? p.amplitude ?? 12;
    const A = Math.min(0.45, Math.abs(rawAmp > 1 ? rawAmp / 100 : rawAmp)); // m
    const gamma = flags.hasFriction ? 0.24 : 0;

    const omega0 = Math.sqrt(k / m);
    const env = Math.exp(-gamma * t);
    const x = A * env * Math.cos(omega0 * t);
    const v = -A * omega0 * env * Math.sin(omega0 * t);

    const Ek = 0.5 * m * v * v;
    const Ep = 0.5 * k * x * x;
    const ETotal = Ek + Ep;

    if (isRunningRef.current) {
      oscHistoryRef.current.push(x * 100);
      if (oscHistoryRef.current.length > 100) oscHistoryRef.current.shift();
    }

    pushTelemetry({
      metric1Label: 'Li độ (x)',
      metric1Val: `${(x * 100).toFixed(1)} cm`,
      metric2Label: 'Vận tốc (v)',
      metric2Val: `${(v * 100).toFixed(1)} cm/s`,
      metric3Label: 'Cơ năng (W)',
      metric3Val: `${ETotal.toFixed(3)} J`,
      note: flags.hasFriction
        ? `Dao động tắt dần (có ma sát): Biên độ giảm theo hàm mũ. ω₀ = ${omega0.toFixed(2)} rad/s.`
        : `Dao động điều hòa lí tưởng: ω = ${omega0.toFixed(2)} rad/s | T = ${(2 * Math.PI / omega0).toFixed(2)} s`
    });

    const midY = h * 0.48;
    const s = Math.min(1, w / 480);
    const anchorX = Math.max(24, w * 0.1);
    const eqX = w * 0.56;
    const scale = 500 * s;
    const massSize = Math.max(36, 50 * s);
    const halfM = massSize / 2;
    const massX = Math.max(anchorX + halfM + 30, Math.min(w - halfM - 12, eqX + x * scale));

    // Equilibrium Line & Ruler
    if (ov.showRulerGrid) {
      ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.45)' : 'rgba(5, 150, 105, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(eqX, midY - 68);
      ctx.lineTo(eqX, midY + 68);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VTCB O', eqX, midY - 74);
    }

    // Anchor Wall
    ctx.fillStyle = isDark ? '#334155' : '#94a3b8';
    ctx.fillRect(anchorX - 14, midY - 56 * s, 14, 112 * s);

    // Spring Coils
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(anchorX, midY);
    const coils = 16;
    const coilW = (massX - anchorX - halfM) / coils;
    for (let i = 0; i < coils; i++) {
      const cx_pt = anchorX + i * coilW;
      const cy_pt = midY + (i % 2 === 0 ? -13 * s : 13 * s);
      ctx.lineTo(cx_pt, cy_pt);
    }
    ctx.lineTo(massX - halfM, midY);
    ctx.stroke();

    // Mass Block
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(massX - halfM, midY - halfM, massSize, massSize);
    ctx.strokeStyle = '#c4b5fd';
    ctx.lineWidth = 2;
    ctx.strokeRect(massX - halfM, midY - halfM, massSize, massSize);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${m}kg`, massX, midY + 4);

    // Restoring Force & Velocity Vectors
    if (ov.showVectors) {
      const fLen = Math.max(-55, Math.min(55, -k * x * 12));
      if (Math.abs(fLen) > 3) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(massX, midY - halfM - 10);
        ctx.lineTo(massX + fLen, midY - halfM - 10);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('Fkv', massX + fLen / 2, midY - halfM - 16);
      }

      const vLen = Math.max(-55, Math.min(55, v * 45));
      if (Math.abs(vLen) > 3) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(massX, midY + halfM + 12);
        ctx.lineTo(massX + vLen, midY + halfM + 12);
        ctx.stroke();
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('v', massX + vLen / 2, midY + halfM + 25);
      }
    }

    // Real-time x(t) chart at bottom
    if (ov.showRealtimeChart && oscHistoryRef.current.length > 2) {
      const cw2 = Math.min(200, w * 0.42);
      const ch2 = 52;
      const cx2 = w - cw2 - 14;
      const cy2 = h - ch2 - 12;
      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.88)';
      ctx.fillRect(cx2, cy2, cw2, ch2);
      ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx2, cy2, cw2, ch2);

      const hist = oscHistoryRef.current;
      const maxXcm = Math.max(1, A * 100);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < hist.length; i++) {
        const px = cx2 + (i / Math.max(1, hist.length - 1)) * cw2;
        const py = cy2 + ch2 / 2 - (hist[i] / maxXcm) * (ch2 * 0.38);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  };

  // 8. Simple Pendulum (Lớp 12 & Chuyên)
  const drawPendulum = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const flags = labFlagsRef.current;
    const ov = overlaysRef.current;

    const l = Math.max(0.1, p.length ?? 2.0);
    const g = Math.max(0.2, p.gravity ?? 9.8);
    const theta0Deg = p.theta0 ?? p.angle0 ?? p.initialAngleDeg ?? 15;
    const theta0Rad = (theta0Deg * Math.PI) / 180;
    const omega = Math.sqrt(g / l);
    const gamma = flags.hasFriction ? 0.14 : 0;
    const env = Math.exp(-gamma * t);

    const theta = theta0Rad * env * Math.cos(omega * t);
    const v = -omega * l * theta0Rad * env * Math.sin(omega * t);

    pushTelemetry({
      metric1Label: 'Góc lệch (α)',
      metric1Val: `${((theta * 180) / Math.PI).toFixed(1)}°`,
      metric2Label: 'Vận tốc tiếp tuyến (v)',
      metric2Val: `${v.toFixed(2)} m/s`,
      metric3Label: 'Chu kỳ dao động (T)',
      metric3Val: `${((2 * Math.PI) / omega).toFixed(2)} s`,
      note: flags.hasFriction
        ? `Con lắc tắt dần (có lực cản môi trường): Biên độ góc giảm dần theo thời gian.`
        : `Dao động điều hòa: T = 2π√(l/g) = ${((2 * Math.PI) / omega).toFixed(2)} s (không phụ thuộc khối lượng m).`
    });

    const pivotX = w / 2;
    const pivotY = 46;
    const lengthPix = Math.min(h * 0.66, Math.max(70, l * 95));

    const bobX = pivotX + lengthPix * Math.sin(theta);
    const bobY = pivotY + lengthPix * Math.cos(theta);

    // Protractor arc
    if (flags.showProtractor) {
      ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(pivotX, pivotY + lengthPix + 20);
      ctx.stroke();
      ctx.setLineDash([]);

      const arcR = 56;
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, arcR, Math.PI / 2 - Math.abs(theta0Rad), Math.PI / 2 + Math.abs(theta0Rad));
      ctx.stroke();
    }

    // Arc swing trace
    if (ov.showTrace) {
      ctx.strokeStyle = isDark ? 'rgba(236, 72, 153, 0.35)' : 'rgba(219, 39, 119, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        pivotX,
        pivotY,
        lengthPix,
        Math.PI / 2 - Math.abs(theta0Rad) * env,
        Math.PI / 2 + Math.abs(theta0Rad) * env
      );
      ctx.stroke();
    }

    // Pivot
    ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
    ctx.fill();

    // String
    ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Bob
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(bobX, bobY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbcfe8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tangential Velocity Vector
    if (ov.showVectors && Math.abs(v) > 0.02) {
      const vx = v * Math.cos(theta) * 28;
      const vy = -v * Math.sin(theta) * 28;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bobX, bobY);
      ctx.lineTo(bobX + vx, bobY + vy);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('v', bobX + vx + 8, bobY + vy);
    }
  };

  // 9. Wave Interference (Lớp 11 & 12)
  const drawWaveInterference = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const flags = labFlagsRef.current;

    const freq = Math.max(0.2, p.freq ?? 2.5); // Hz
    const speed = Math.max(10, p.speed ?? 60); // cm/s
    const d = Math.max(10, p.sep ?? p.sourceDistance ?? p.separation ?? 120);
    const lambda = p.wavelength ?? Math.max(8, speed / freq);

    const maxK = Math.floor(d / Math.max(1, lambda));

    pushTelemetry({
      metric1Label: 'Bước sóng (λ = v/f)',
      metric1Val: `${lambda.toFixed(1)} cm`,
      metric2Label: 'Khoảng cách nguồn (S1S2)',
      metric2Val: flags.singleSource ? '1 nguồn đơn' : `${d.toFixed(0)} cm`,
      metric3Label: 'Số cực đại giao thoa',
      metric3Val: flags.singleSource ? 'Không giao thoa' : `${2 * maxK + 1} dãy`,
      note: flags.singleSource
        ? 'Chế độ 1 nguồn: Sóng tròn lan tỏa đều với tốc độ v, chưa có giao thoa.'
        : `Giao thoa 2 nguồn cùng pha: d₂ - d₁ = kλ (cực đại), d₂ - d₁ = (k + 0.5)λ (cực tiểu).`
    });

    const midY = h / 2;
    const drawD = Math.min(d * 1.4, Math.max(70, w * 0.56));
    const s1X = flags.singleSource ? w / 2 : w / 2 - drawD / 2;
    const s2X = w / 2 + drawD / 2;
    const waveStepPix = Math.max(14, Math.min(70, lambda * 1.3));
    const maxR = Math.min(w, h) * 0.72;

    ctx.lineWidth = 1.6;
    for (let r = (t * speed * 0.8) % waveStepPix; r < maxR; r += waveStepPix) {
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.32)';
      ctx.beginPath();
      ctx.arc(s1X, midY, r, 0, Math.PI * 2);
      ctx.stroke();

      if (!flags.singleSource) {
        ctx.strokeStyle = isDark ? 'rgba(236, 72, 153, 0.35)' : 'rgba(219, 39, 119, 0.32)';
        ctx.beginPath();
        ctx.arc(s2X, midY, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Antinodal (Cực đại) hyperbola guides
    if (!flags.singleSource && flags.showNodalLines) {
      ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.4)' : 'rgba(5, 150, 105, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      const kLim = Math.min(4, maxK);
      for (let k = -kLim; k <= kLim; k++) {
        ctx.beginPath();
        const a = (k * (drawD / Math.max(1, d / lambda))) / 2;
        const c = drawD / 2;
        if (Math.abs(a) < c) {
          const b = Math.sqrt(Math.max(1, c * c - a * a));
          for (let yy = -h * 0.42; yy <= h * 0.42; yy += 10) {
            const xHyp = w / 2 + (a >= 0 ? 1 : -1) * Math.abs(a) * Math.sqrt(1 + (yy * yy) / (b * b));
            if (yy === -h * 0.42) ctx.moveTo(xHyp, midY + yy);
            else ctx.lineTo(xHyp, midY + yy);
          }
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);
    }

    // Source 1 point
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(s1X, midY, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('S1', s1X, midY - 12);

    // Source 2 point
    if (!flags.singleSource) {
      ctx.fillStyle = '#db2777';
      ctx.beginPath();
      ctx.arc(s2X, midY, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('S2', s2X, midY - 12);
    }
  };

  // 10. Kinematics Graphs (d-t, v-t) & Vector / Trigonometry Visualizer
  const drawKinematicsGraphs = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const ov = overlaysRef.current;

    const vizMode = Math.round(p.vizMode ?? 1);
    const v0 = p.v0 ?? 5;
    const accel = p.accel ?? 0;
    const angleDeg = p.angleDeg ?? 35;
    const f1 = p.f1 ?? 30;
    const f2 = p.f2 ?? 20;

    if (vizMode === 0) {
      const rad = (angleDeg * Math.PI) / 180;
      const res = Math.sqrt(f1 * f1 + f2 * f2 + 2 * f1 * f2 * Math.cos(rad));
      const fx = f1 + f2 * Math.cos(rad);
      const fy = f2 * Math.sin(rad);

      pushTelemetry({
        metric1Label: 'Thành phần ngang (Fx)',
        metric1Val: `${fx.toFixed(1)} N`,
        metric2Label: 'Thành phần đứng (Fy)',
        metric2Val: `${fy.toFixed(1)} N`,
        metric3Label: 'Hợp lực tổng (F)',
        metric3Val: `${res.toFixed(1)} N`,
        note: `sin(${angleDeg}°) = ${Math.sin(rad).toFixed(2)}, cos(${angleDeg}°) = ${Math.cos(rad).toFixed(2)} | F = √(F₁² + F₂² + 2F₁F₂cosα)`
      });

      const ox = Math.max(70, w * 0.25);
      const oy = h * 0.72;
      const maxForce = Math.max(10, Math.abs(f1), Math.abs(f2), res);
      const scale = Math.min(w, h) * 0.45 / maxForce;

      ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(40, oy);
      ctx.lineTo(w - 30, oy);
      ctx.moveTo(ox, h - 25);
      ctx.lineTo(ox, 25);
      ctx.stroke();

      const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, label: string) => {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        const a = Math.atan2(y2 - y1, x2 - x1);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - 10 * Math.cos(a - 0.35), y2 - 10 * Math.sin(a - 0.35));
        ctx.lineTo(x2 - 10 * Math.cos(a + 0.35), y2 - 10 * Math.sin(a + 0.35));
        ctx.closePath();
        ctx.fill();
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(label, (x1 + x2) / 2 + 8, (y1 + y2) / 2 - 8);
      };

      const p1x = ox + f1 * scale;
      const p1y = oy;
      const p2x = ox + f2 * Math.cos(rad) * scale;
      const p2y = oy - f2 * Math.sin(rad) * scale;
      const prx = ox + fx * scale;
      const pry = oy - fy * scale;

      if (ov.showTrace) {
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.5)' : 'rgba(100,116,139,0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(prx, pry);
        ctx.lineTo(p2x, p2y);
        ctx.moveTo(prx, pry);
        ctx.lineTo(prx, oy);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      drawArrow(ox, oy, p1x, p1y, '#38bdf8', `F₁ = ${f1}N`);
      drawArrow(ox, oy, p2x, p2y, '#f59e0b', `F₂ = ${f2}N`);
      if (ov.showVectors) {
        drawArrow(ox, oy, prx, pry, '#ef4444', `F = ${res.toFixed(1)}N`);
      }
      return;
    }

    const maxT = 5.0;
    const tCur = t % maxT;
    const curD = v0 * tCur + 0.5 * accel * tCur * tCur;
    const curV = v0 + accel * tCur;

    pushTelemetry({
      metric1Label: 'Thời gian (t)',
      metric1Val: `${tCur.toFixed(2)} s`,
      metric2Label: 'Vận tốc tức thời (v)',
      metric2Val: `${curV.toFixed(2)} m/s`,
      metric3Label: 'Độ dịch chuyển (d)',
      metric3Val: `${curD.toFixed(2)} m`,
      note:
        vizMode === 1
          ? 'Đồ thị (d - t): Độ dốc biểu thị vận tốc v. Nếu a = 0 đường thẳng xiên đều.'
          : 'Đồ thị (v - t): Độ dốc là gia tốc a, diện tích tô màu dưới đường bằng độ dịch chuyển d!'
    });

    const roadY = h * 0.24;
    ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, roadY + 18);
    ctx.lineTo(w - 40, roadY + 18);
    ctx.stroke();

    const maxD = Math.max(15, Math.abs(v0 * maxT + 0.5 * accel * maxT * maxT));
    const normPos = Math.max(0, Math.min(1, curD / maxD));
    const carX = 50 + normPos * (w - 130);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(carX, roadY - 12, 46, 22);
    ctx.fillStyle = isDark ? '#e2e8f0' : '#0f172a';
    ctx.beginPath();
    ctx.arc(carX + 10, roadY + 12, 6, 0, Math.PI * 2);
    ctx.arc(carX + 36, roadY + 12, 6, 0, Math.PI * 2);
    ctx.fill();

    if (ov.showVectors) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(carX + 46, roadY - 2);
      ctx.lineTo(carX + 46 + Math.max(-30, Math.min(70, curV * 4)), roadY - 2);
      ctx.stroke();
    }

    // Bottom half: Graph Plot
    const gx0 = 60;
    const gy0 = h * 0.88;
    const gw = w - 100;
    const gh = h * 0.44;

    ctx.strokeStyle = isDark ? '#64748b' : '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(gx0, gy0 - gh);
    ctx.lineTo(gx0, gy0);
    ctx.lineTo(gx0 + gw, gy0);
    ctx.stroke();

    ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('t (s)', gx0 + gw - 22, gy0 + 16);
    ctx.fillText(vizMode === 1 ? 'd (m)' : 'v (m/s)', gx0 - 42, gy0 - gh + 10);

    const valAtT = (tt: number) => (vizMode === 1 ? v0 * tt + 0.5 * accel * tt * tt : v0 + accel * tt);
    const maxYVal = Math.max(10, Math.abs(valAtT(maxT)), Math.abs(valAtT(0)));

    if (vizMode === 2) {
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.16)' : 'rgba(14, 165, 233, 0.15)';
      ctx.beginPath();
      ctx.moveTo(gx0, gy0);
      for (let i = 0; i <= 40; i++) {
        const tt = (i / 40) * tCur;
        const px = gx0 + (tt / maxT) * gw;
        const py = gy0 - Math.max(0, Math.min(gh, (valAtT(tt) / maxYVal) * gh * 0.85));
        ctx.lineTo(px, py);
      }
      ctx.lineTo(gx0 + (tCur / maxT) * gw, gy0);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = vizMode === 1 ? '#f59e0b' : '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const tt = (i / 60) * maxT;
      const px = gx0 + (tt / maxT) * gw;
      const py = gy0 - Math.max(-10, Math.min(gh, (valAtT(tt) / maxYVal) * gh * 0.85));
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const dotX = gx0 + (tCur / maxT) * gw;
    const dotY = gy0 - Math.max(-10, Math.min(gh, (valAtT(tCur) / maxYVal) * gh * 0.85));
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5.5, 0, Math.PI * 2);
    ctx.fill();
  };

  // 11. Thermal Gas & Ideal Gas Law Chamber (Lớp 12)
  const drawThermalGas = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const ov = overlaysRef.current;

    const tempK = Math.max(10, p.tempK ?? 320);
    const vol = Math.max(0.5, p.volume ?? 10);
    const moles = Math.max(0.1, p.moles ?? 1);
    const pressureKPa = (moles * 8.31 * tempK) / vol;
    const eMean = (1.5 * 1.38e-23 * tempK) * 1e21;

    pushTelemetry({
      metric1Label: 'Nhiệt độ tuyệt đối (T)',
      metric1Val: `${tempK} K (${(tempK - 273).toFixed(0)} °C)`,
      metric2Label: 'Áp suất khí (p)',
      metric2Val: `${pressureKPa.toFixed(1)} kPa`,
      metric3Label: 'Động năng TB phân tử',
      metric3Val: `${eMean.toFixed(2)} × 10⁻²¹ J`,
      note: 'Phương trình Clapeyron: pV = nRT. Tăng nhiệt độ T làm tốc độ phân tử và áp suất tăng tỉ lệ thuận.'
    });

    const boxW = Math.min(w * 0.52, 290);
    const maxBoxH = h * 0.68;
    const boxH = Math.max(60, Math.min(maxBoxH, (vol / 18) * maxBoxH));
    const bx = w / 2 - boxW / 2 - 20;
    const byBottom = h * 0.85;
    const byTop = byBottom - boxH;

    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 3;
    ctx.strokeRect(bx, byTop, boxW, boxH);

    // Movable Piston
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(bx + 2, byTop - 12, boxW - 4, 12);

    const count = Math.min(80, Math.max(6, Math.round(14 + moles * 10)));
    const speedFactor = Math.sqrt(tempK / 300) * 90;
    ctx.fillStyle = tempK > 450 ? '#ef4444' : tempK > 330 ? '#f59e0b' : '#38bdf8';

    for (let i = 0; i < count; i++) {
      const rx = ((i * 73 + 19) % 100) / 100;
      const ry = ((i * 41 + 7) % 100) / 100;
      const vx = ((i % 2 === 0 ? 1 : -1) * (0.7 + (i % 5) * 0.2)) * speedFactor;
      const vy = ((i % 3 === 0 ? 1 : -1) * (0.6 + (i % 4) * 0.22)) * speedFactor;

      const spanX = Math.max(12, boxW - 16);
      const spanY = Math.max(12, boxH - 16);
      const rawX = (((rx * boxW + vx * t) % (2 * spanX)) + 2 * spanX) % (2 * spanX);
      const posX = bx + 8 + (rawX > spanX ? 2 * spanX - rawX : rawX);
      const rawY = (((ry * boxH + vy * t) % (2 * spanY)) + 2 * spanY) % (2 * spanY);
      const posY = byTop + 8 + (rawY > spanY ? 2 * spanY - rawY : rawY);

      ctx.beginPath();
      ctx.arc(posX, posY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      if (ov.showVectors && i < 6) {
        ctx.strokeStyle = isDark ? 'rgba(248, 250, 252, 0.55)' : 'rgba(15, 23, 42, 0.55)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(posX, posY);
        ctx.lineTo(posX + (vx / speedFactor) * 14, posY + (vy / speedFactor) * 14);
        ctx.stroke();
      }
    }

    // Pressure Gauge Column on right
    if (ov.showRealtimeChart) {
      const gx = bx + boxW + 24;
      const gh = 140;
      const gy = byBottom - gh;
      ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.fillRect(gx, gy, 24, gh);
      const pFrac = Math.min(1, pressureKPa / 800);
      ctx.fillStyle = pressureKPa > 450 ? '#ef4444' : '#10b981';
      ctx.fillRect(gx, byBottom - pFrac * gh, 24, pFrac * gh);
      ctx.fillStyle = isDark ? '#e2e8f0' : '#0f172a';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('p', gx + 12, gy - 6);
    }
  };

  // 12. Electric Field & Coulomb Interaction (Lớp 11)
  const drawElectricField = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const flags = labFlagsRef.current;
    const ov = overlaysRef.current;

    const q1 = p.q1 ?? 4;
    const q2 = p.q2 ?? -4;
    const distMm = Math.max(10, p.dist ?? 180);
    const rMeters = distMm / 1000;
    const force = (9e9 * Math.abs(q1 * q2) * 1e-12) / (rMeters * rMeters);
    const sameSign = q1 * q2 > 0;

    pushTelemetry({
      metric1Label: 'Lực tương tác Coulomb',
      metric1Val: `${force.toFixed(2)} N`,
      metric2Label: 'Tính chất tương tác',
      metric2Val: q1 === 0 || q2 === 0 ? 'Không tương tác' : sameSign ? 'Đẩy nhau' : 'Hút nhau',
      metric3Label: 'Khoảng cách r',
      metric3Val: `${distMm} mm`,
      note: 'Định luật Coulomb: F = k|q₁q₂|/r². Mũi tên lưới biểu diễn hướng vectơ cường độ điện trường tổng hợp E.'
    });

    const cy = h / 2;
    const drawSpan = Math.min(w * 0.65, Math.max(70, distMm * 1.4));
    const x1 = w / 2 - drawSpan / 2;
    const x2 = w / 2 + drawSpan / 2;

    // 2D E-Field Grid Arrows
    if (flags.showFieldGrid) {
      const step = 42;
      for (let gx = 30; gx < w - 20; gx += step) {
        for (let gy = 30; gy < h - 20; gy += step) {
          const dx1 = gx - x1;
          const dy1 = gy - cy;
          const r1Sq = Math.max(400, dx1 * dx1 + dy1 * dy1);
          const dx2 = gx - x2;
          const dy2 = gy - cy;
          const r2Sq = Math.max(400, dx2 * dx2 + dy2 * dy2);

          const ex = (q1 * dx1) / Math.pow(r1Sq, 1.5) + (q2 * dx2) / Math.pow(r2Sq, 1.5);
          const ey = (q1 * dy1) / Math.pow(r1Sq, 1.5) + (q2 * dy2) / Math.pow(r2Sq, 1.5);
          const mag = Math.hypot(ex, ey);
          if (mag > 1e-7) {
            const ux = (ex / mag) * 13;
            const uy = (ey / mag) * 13;
            const alpha = Math.min(0.8, 0.25 + mag * 15000);
            ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(gx - ux * 0.5, gy - uy * 0.5);
            ctx.lineTo(gx + ux * 0.5, gy + uy * 0.5);
            ctx.stroke();
            ctx.fillStyle = ctx.strokeStyle;
            ctx.beginPath();
            ctx.arc(gx + ux * 0.5, gy + uy * 0.5, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // Equipotential ripples
    for (let i = 1; i <= 3; i++) {
      const rad = i * 24 + ((t * 14) % 24);
      ctx.strokeStyle = q1 >= 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x1, cy, rad, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = q2 >= 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)';
      ctx.beginPath();
      ctx.arc(x2, cy, rad, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Force arrows
    if (ov.showVectors && q1 !== 0 && q2 !== 0) {
      const fLen = Math.min(75, Math.max(25, force * 8));
      const dir1 = sameSign ? -1 : 1;
      const dir2 = sameSign ? 1 : -1;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, cy);
      ctx.lineTo(x1 + dir1 * fLen, cy);
      ctx.moveTo(x2, cy);
      ctx.lineTo(x2 + dir2 * fLen, cy);
      ctx.stroke();
    }

    const drawCharge = (cx: number, q: number, name: string) => {
      ctx.fillStyle = q > 0 ? '#ef4444' : q < 0 ? '#3b82f6' : '#64748b';
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(q > 0 ? '+' : q < 0 ? '−' : '0', cx, cy + 5);
      ctx.fillStyle = isDark ? '#e2e8f0' : '#0f172a';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`${name} = ${q > 0 ? '+' : ''}${q} μC`, cx, cy - 26);
    };

    drawCharge(x1, q1, 'q₁');
    drawCharge(x2, q2, 'q₂');
  };

  // 13. Nuclear Decay Grid & Exponential Curve (Lớp 12)
  const drawNuclearDecay = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const ov = overlaysRef.current;

    const halfLife = Math.max(0.2, p.halfLife ?? 4.0);
    const n0 = Math.max(1, p.n0 ?? 100);
    const cycleT = t % (halfLife * 4.2);
    const remaining = n0 * Math.pow(2, -cycleT / halfLife);
    const decayed = n0 - remaining;

    pushTelemetry({
      metric1Label: 'Thời gian trôi qua (t)',
      metric1Val: `${cycleT.toFixed(1)} s (${(cycleT / halfLife).toFixed(2)} T)`,
      metric2Label: 'Số hạt còn lại N(t)',
      metric2Val: `${remaining.toFixed(1)} (${((remaining / n0) * 100).toFixed(1)}%)`,
      metric3Label: 'Đã phân rã ΔN',
      metric3Val: `${decayed.toFixed(1)}`,
      note: 'Định luật phóng xạ: N(t) = N₀ · 2^(-t/T). Sau mỗi chu kì bán rã T, một nửa số hạt nhân mẹ phân rã thành hạt con.'
    });

    // Left panel: 10x10 Atom Lattice
    const cols = 10;
    const rows = 10;
    const cell = Math.min((w * 0.42) / cols, (h * 0.72) / rows);
    const startX = 28;
    const startY = h / 2 - (rows * cell) / 2;
    const activeCount = Math.round((remaining / n0) * 100);

    for (let idx = 0; idx < 100; idx++) {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const orderRank = (idx * 37 + 13) % 100;
      const isParent = orderRank < activeCount;
      ctx.fillStyle = isParent ? '#f59e0b' : isDark ? '#334155' : '#cbd5e1';
      ctx.beginPath();
      ctx.arc(startX + c * cell + cell / 2, startY + r * cell + cell / 2, cell * 0.34, 0, Math.PI * 2);
      ctx.fill();
    }

    // Right panel: Exponential decay graph N(t)
    if (ov.showRealtimeChart) {
      const gx0 = w * 0.54;
      const gy0 = h * 0.82;
      const gw = w * 0.4;
      const gh = h * 0.62;

      ctx.strokeStyle = isDark ? '#64748b' : '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gx0, gy0 - gh);
      ctx.lineTo(gx0, gy0);
      ctx.lineTo(gx0 + gw, gy0);
      ctx.stroke();

      // Half-life vertical ticks 1T, 2T, 3T, 4T
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      const maxGraphT = halfLife * 4.2;
      for (let k = 1; k <= 4; k++) {
        const tx = gx0 + ((k * halfLife) / maxGraphT) * gw;
        ctx.fillText(`${k}T`, tx, gy0 + 14);
      }

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const tt = (i / 60) * maxGraphT;
        const frac = Math.pow(2, -tt / halfLife);
        const px = gx0 + (tt / maxGraphT) * gw;
        const py = gy0 - frac * gh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const curPx = gx0 + (cycleT / maxGraphT) * gw;
      const curPy = gy0 - (remaining / n0) * gh;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(curPx, curPy, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 14. Uniform Circular Motion & Centripetal Force (Lớp 10)
  const drawCircularMotion = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const ov = overlaysRef.current;

    const r = Math.max(0.2, p.radius ?? 2.0); // m
    const omega = Math.max(0.2, p.omega ?? 2.5); // rad/s
    const mass = Math.max(0.1, p.mass ?? 1.5); // kg

    const v = omega * r;
    const aHt = omega * omega * r;
    const fHt = mass * aHt;
    const period = (2 * Math.PI) / omega;

    pushTelemetry({
      metric1Label: 'Tốc độ dài v = ω·r',
      metric1Val: `${v.toFixed(2)} m/s`,
      metric2Label: 'Gia tốc hướng tâm a_ht',
      metric2Val: `${aHt.toFixed(2)} m/s²`,
      metric3Label: 'Lực hướng tâm F_ht · Chu kì T',
      metric3Val: `${fHt.toFixed(1)} N · ${period.toFixed(2)} s`,
      note: 'Trong chuyển động tròn đều: vectơ vận tốc v luôn tiếp tuyến quỹ đạo, còn gia tốc & lực hướng tâm luôn hướng vào tâm O.'
    });

    const cx = w * 0.42;
    const cy = h * 0.52;
    const rPx = Math.min(w * 0.28, h * 0.36) * Math.min(1.2, Math.max(0.45, r / 3.0));
    const angle = omega * t;
    const objX = cx + rPx * Math.cos(angle);
    const objY = cy - rPx * Math.sin(angle);

    // Orbital circle
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.5)' : 'rgba(2, 132, 199, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    //Swept sector & trail
    if (ov.showTrace) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rPx, -angle, -angle + Math.PI / 3, false);
      ctx.closePath();
      ctx.fill();
    }

    // Center O & radius arm
    ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(objX, objY);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`O (r=${r.toFixed(1)}m)`, cx + 8, cy + 16);

    // Vector helpers
    const drawVec = (x0: number, y0: number, dx: number, dy: number, color: string, label: string) => {
      const len = Math.hypot(dx, dy);
      if (len < 4) return;
      const ang = Math.atan2(dy, dx);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 + dx, y0 + dy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x0 + dx, y0 + dy);
      ctx.lineTo(x0 + dx - 10 * Math.cos(ang - Math.PI / 6), y0 + dy - 10 * Math.sin(ang - Math.PI / 6));
      ctx.lineTo(x0 + dx - 10 * Math.cos(ang + Math.PI / 6), y0 + dy - 10 * Math.sin(ang + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
      ctx.font = 'bold 11px monospace';
      ctx.fillText(label, x0 + dx + 6, y0 + dy - 4);
    };

    if (ov.showVectors) {
      // Tangent velocity vector (counter-clockwise)
      const vScale = Math.min(85, Math.max(26, v * 8));
      const tx = -Math.sin(angle) * vScale;
      const ty = -Math.cos(angle) * vScale;
      drawVec(objX, objY, tx, ty, '#10b981', 'v');

      // Centripetal force F_ht toward center
      const fScale = Math.min(rPx * 0.78, Math.max(24, fHt * 1.4));
      const fx = -Math.cos(angle) * fScale;
      const fy = Math.sin(angle) * fScale;
      drawVec(objX, objY, fx, fy, '#ef4444', 'F_ht');
    }

    // Rotating mass ball
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(objX, objY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Right-side real-time projection x(t) = r*cos(ωt) wave chart
    if (ov.showRealtimeChart && w > 420) {
      const gx = w * 0.72;
      const gy = h * 0.52;
      const gw = w * 0.24;
      ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(gx, gy - rPx);
      ctx.lineTo(gx, gy + rPx);
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + gw, gy);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const dtBack = (i / 60) * 3.0;
        const yProj = gy - rPx * Math.sin(omega * (t - dtBack));
        const px = gx + (i / 60) * gw;
        if (i === 0) ctx.moveTo(px, yProj);
        else ctx.lineTo(px, yProj);
      }
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('Hình chiếu y(t) = r·sin(ωt)', gx, gy - rPx - 8);
    }
  };

  // 15. AC RLC Series Circuit, Fresnel Phasor & Oscilloscope (Lớp 12)
  const drawAcRlcCircuit = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const ov = overlaysRef.current;

    const uEff = Math.max(10, p.uEff ?? 120); // V
    const freq = Math.max(10, p.freq ?? 50); // Hz
    const resR = Math.max(5, p.resR ?? 40); // Ohm
    const indL = Math.max(0.05, p.indL ?? 0.3); // H
    const capC = Math.max(5, p.capC ?? 40); // uF -> convert to F

    const omega = 2 * Math.PI * freq;
    const zl = omega * indL;
    const zc = 1 / (omega * capC * 1e-6);
    const zTotal = Math.sqrt(resR * resR + (zl - zc) * (zl - zc));
    const iEff = uEff / zTotal;
    const phi = Math.atan2(zl - zc, resR);
    const cosPhi = resR / zTotal;
    const powerP = uEff * iEff * cosPhi;
    const isResonance = Math.abs(zl - zc) < Math.max(4, resR * 0.12);

    pushTelemetry({
      metric1Label: 'Cảm kháng Z_L · Dung kháng Z_C',
      metric1Val: `${zl.toFixed(1)} Ω · ${zc.toFixed(1)} Ω`,
      metric2Label: 'Tổng trở Z · Dòng I hiệu dụng',
      metric2Val: `${zTotal.toFixed(1)} Ω · ${iEff.toFixed(2)} A`,
      metric3Label: 'Hệ số cos φ · Công suất P',
      metric3Val: `${cosPhi.toFixed(2)} · ${powerP.toFixed(0)} W`,
      note: isResonance
        ? 'ĐANG CỘNG HƯỞNG ĐIỆN (Z_L ≈ Z_C): Tổng trở Z = R cực tiểu, I đạt cực đại và cos φ ≈ 1!'
        : `Độ lệch pha φ = ${((phi * 180) / Math.PI).toFixed(1)}°. ${zl > zc ? 'Mạch có tính cảm kháng (u sớm pha hơn i).' : 'Mạch có tính dung kháng (u trễ pha hơn i).'}`
    });

    // Left: Schematic R-L-C loop
    const boxLeft = 26;
    const boxTop = 44;
    const boxW = Math.min(w * 0.44, 320);
    const boxH = h * 0.38;

    ctx.strokeStyle = isDark ? '#64748b' : '#475569';
    ctx.lineWidth = 2.2;
    ctx.strokeRect(boxLeft, boxTop, boxW, boxH);

    // AC Source circle at left vertical edge
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.beginPath();
    ctx.arc(boxLeft, boxTop + boxH / 2, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('~', boxLeft, boxTop + boxH / 2 + 5);

    // R, L, C components along top edge
    const segW = boxW / 3;
    // Resistor R
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(boxLeft + segW * 0.25, boxTop - 9, 44, 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('R', boxLeft + segW * 0.25 + 22, boxTop + 3);
    // Inductor L
    ctx.fillStyle = '#10b981';
    ctx.fillRect(boxLeft + segW * 1.25, boxTop - 9, 44, 18);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('L', boxLeft + segW * 1.25 + 22, boxTop + 3);
    // Capacitor C
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(boxLeft + segW * 2.25, boxTop - 9, 44, 18);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('C', boxLeft + segW * 2.25 + 22, boxTop + 3);

    // Animated AC electron drift along circuit wire
    const driftPos = Math.sin(t * 4) * 18;
    ctx.fillStyle = isResonance ? '#10b981' : '#38bdf8';
    ctx.beginPath();
    ctx.arc(boxLeft + boxW / 2 + driftPos, boxTop + boxH, 5, 0, Math.PI * 2);
    ctx.fill();

    if (isResonance) {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('⚡ CỘNG HƯỞNG ĐIỆN (Z_L = Z_C)', boxLeft, boxTop + boxH + 22);
    }

    // Bottom-left: Oscilloscope u(t) & i(t)
    const oscX = 26;
    const oscY = h * 0.78;
    const oscW = Math.min(w * 0.48, 360);
    const oscH = h * 0.16;
    ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(oscX, oscY);
    ctx.lineTo(oscX + oscW, oscY);
    ctx.stroke();

    const drawSine = (amp: number, phaseOffset: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const theta = (i / 80) * Math.PI * 4 - t * 4;
        const px = oscX + (i / 80) * oscW;
        const py = oscY - amp * Math.sin(theta + phaseOffset);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    };
    drawSine(oscH, 0, '#f59e0b');
    drawSine(oscH * Math.min(1.0, (iEff / Math.max(1, uEff / resR)) * 0.85), -phi, '#38bdf8');
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('u(t)', oscX, oscY - oscH - 4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('i(t)', oscX + 42, oscY - oscH - 4);

    // Right: Fresnel Rotating Phasor Diagram
    const phX = w * 0.74;
    const phY = h * 0.56;
    const phScale = Math.min(w * 0.18, h * 0.34) / Math.max(1, iEff * Math.max(resR, zl, zc));
    const uR_px = Math.min(110, Math.max(25, iEff * resR * phScale));
    const uL_px = Math.min(125, iEff * zl * phScale);
    const uC_px = Math.min(125, iEff * zc * phScale);

    // Axes
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.3)' : 'rgba(100,116,139,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(phX - 40, phY);
    ctx.lineTo(phX + 120, phY);
    ctx.moveTo(phX, phY - 120);
    ctx.lineTo(phX, phY + 120);
    ctx.stroke();

    if (ov.showVectors) {
      const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, text: string) => {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.font = 'bold 10px monospace';
        ctx.fillText(text, x2 + 6, y2 + 3);
      };
      drawArrow(phX, phY, phX + uR_px, phY, '#3b82f6', 'U_R (I)');
      drawArrow(phX, phY, phX, phY - uL_px, '#10b981', 'U_L');
      drawArrow(phX, phY, phX, phY + uC_px, '#a855f7', 'U_C');
      drawArrow(phX, phY, phX + uR_px, phY - (uL_px - uC_px), '#f59e0b', 'U_AB');
    }
  };

  // Helper: visible light wavelength (nm) -> CSS rgb
  const wavelengthToColor = (nm: number): string => {
    let r = 0, g = 0, b = 0;
    if (nm >= 380 && nm < 440) {
      r = -(nm - 440) / 60;
      b = 1;
    } else if (nm >= 440 && nm < 490) {
      g = (nm - 440) / 50;
      b = 1;
    } else if (nm >= 490 && nm < 510) {
      g = 1;
      b = -(nm - 510) / 20;
    } else if (nm >= 510 && nm < 580) {
      r = (nm - 510) / 70;
      g = 1;
    } else if (nm >= 580 && nm < 645) {
      r = 1;
      g = -(nm - 645) / 65;
    } else if (nm >= 645 && nm <= 780) {
      r = 1;
    }
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  };

  // 16. Young's Double-Slit Interference (Lớp 12)
  const drawYoungInterference = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const ov = overlaysRef.current;

    const lambdaUm = Math.max(0.38, Math.min(0.76, p.lambda ?? 0.55)); // μm
    const slitA = Math.max(0.2, p.slitA ?? 1.0); // mm
    const screenD = Math.max(0.5, p.screenD ?? 2.0); // m
    const fringeI = (lambdaUm * screenD) / slitA; // mm

    const lightColor = wavelengthToColor(lambdaUm * 1000);

    pushTelemetry({
      metric1Label: 'Bước sóng λ · Màu sắc',
      metric1Val: `${lambdaUm.toFixed(2)} μm (${Math.round(lambdaUm * 1000)} nm)`,
      metric2Label: 'Khoảng vân i = λD/a',
      metric2Val: `${fringeI.toFixed(2)} mm`,
      metric3Label: 'Vân sáng bậc 1 · Vân tối 1',
      metric3Val: `±${fringeI.toFixed(2)} · ±${(fringeI * 0.5).toFixed(2)} mm`,
      note: 'Vân sáng: x_s = k·i (k ∈ Z). Vân tối: x_t = (k + 0.5)·i. Ánh sáng có λ càng lớn (đỏ) thì khoảng vân i càng rộng.'
    });

    const slitX = w * 0.22;
    const screenX = w * 0.72;
    const cy = h * 0.52;
    const slitHalfGap = Math.max(16, Math.min(54, slitA * 22));
    const s1Y = cy - slitHalfGap;
    const s2Y = cy + slitHalfGap;

    // Incident plane laser wave hitting slits
    ctx.strokeStyle = lightColor;
    ctx.lineWidth = 2;
    for (let x = 22 + ((t * 45) % 18); x < slitX - 8; x += 18) {
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.moveTo(x, cy - 65);
      ctx.lineTo(x, cy + 65);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Double slit barrier wall
    ctx.fillStyle = isDark ? '#475569' : '#334155';
    ctx.fillRect(slitX - 4, 24, 8, s1Y - 28);
    ctx.fillRect(slitX - 4, s1Y + 5, 8, s2Y - s1Y - 10);
    ctx.fillRect(slitX - 4, s2Y + 5, 8, h - 24 - (s2Y + 5));

    // Coherent wave arcs radiating from S1 and S2
    const waveStep = Math.max(12, lambdaUm * 32);
    const phaseShift = (((t * 50) % waveStep) + waveStep) % waveStep;
    ctx.strokeStyle = lightColor;
    ctx.lineWidth = 1.3;
    for (let rad = Math.max(1, phaseShift); rad < screenX - slitX; rad += waveStep) {
      ctx.globalAlpha = Math.max(0.08, 0.45 * (1 - rad / Math.max(1, screenX - slitX)));
      ctx.beginPath();
      ctx.arc(slitX, s1Y, rad, -Math.PI / 2.6, Math.PI / 2.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(slitX, s2Y, rad, -Math.PI / 2.6, Math.PI / 2.6);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Interference Screen Strip & Intensity Profile
    const screenH = h - 56;
    const screenTop = 28;
    const pxPerMm = 26 / Math.max(0.5, fringeI / 1.1);
    const stripW = 28;

    for (let y = 0; y < screenH; y += 2) {
      const distFromCenterMm = (y - screenH / 2) / pxPerMm;
      const intensity = Math.pow(Math.cos((Math.PI * distFromCenterMm) / fringeI), 2);
      ctx.fillStyle = lightColor;
      ctx.globalAlpha = Math.max(0.04, intensity);
      ctx.fillRect(screenX, screenTop + y, stripW, 2);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = isDark ? '#94a3b8' : '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(screenX, screenTop, stripW, screenH);

    // Intensity curve next to screen
    if (ov.showRealtimeChart) {
      const graphBaseX = screenX + stripW + 12;
      const maxAmp = Math.min(72, w - graphBaseX - 18);
      if (maxAmp > 20) {
        ctx.strokeStyle = lightColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let y = 0; y < screenH; y += 2) {
          const distFromCenterMm = (y - screenH / 2) / pxPerMm;
          const intensity = Math.pow(Math.cos((Math.PI * distFromCenterMm) / fringeI), 2);
          const gx = graphBaseX + intensity * maxAmp;
          const gy = screenTop + y;
          if (y === 0) ctx.moveTo(gx, gy);
          else ctx.lineTo(gx, gy);
        }
        ctx.stroke();
      }
    }

    // Labels
    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('S₁', slitX - 24, s1Y + 4);
    ctx.fillText('S₂', slitX - 24, s2Y + 4);
    ctx.fillText(`i = ${fringeI.toFixed(2)} mm`, screenX - 12, screenTop + screenH + 16);
  };

  // 17. Standing Waves on a String (Sóng Dừng Trên Sợi Dây - Lớp 11 & Chuyên)
  const drawStandingWave = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const ov = overlaysRef.current;

    const lengthM = Math.max(0.5, p.length ?? 2.4);
    const speedV = Math.max(4, p.waveSpeed ?? 24);
    const ampCm = Math.max(1, Math.min(10, p.amplitude ?? 4));
    const harmonicN = Math.max(1, Math.min(8, Math.round(p.harmonicN ?? 3)));
    const isFreeEnd = Math.round(p.openEnd ?? 0) === 1;

    // Resonant wavelength & frequency depending on boundary condition
    const lambdaM = isFreeEnd
      ? (4 * lengthM) / Math.max(1, 2 * harmonicN - 1)
      : (2 * lengthM) / harmonicN;
    const freqHz = speedV / lambdaM;
    const omega = 2 * Math.PI * Math.min(4.5, Math.max(0.6, freqHz * 0.14));

    const padX = 56;
    const wireStartX = padX;
    const wireEndX = w - padX;
    const wireLenPx = Math.max(120, wireEndX - wireStartX);
    const centerY = h * 0.52;
    const ampPx = Math.min(h * 0.28, ampCm * 8.5);
    const effectiveHalfWaves = isFreeEnd ? harmonicN - 0.5 : harmonicN;

    pushTelemetry({
      metric1Label: 'Bước sóng λ',
      metric1Val: `${lambdaM.toFixed(2)} m`,
      metric2Label: 'Tần số cộng hưởng f',
      metric2Val: `${freqHz.toFixed(2)} Hz`,
      metric3Label: isFreeEnd ? 'Số bó / Nút-Bụng (1 đầu tự do)' : 'Số bó sóng nguyên (k)',
      metric3Val: isFreeEnd ? `${harmonicN} nút · ${harmonicN} bụng` : `${harmonicN} bó (${harmonicN + 1} nút)`,
      note: isFreeEnd
        ? `Dây 1 đầu cố định 1 đầu tự do: l = (2k - 1)λ/4 = ${lengthM.toFixed(2)} m với k = ${harmonicN}.`
        : `Dây 2 đầu cố định: l = k·λ/2 = ${lengthM.toFixed(2)} m với k = ${harmonicN} bó sóng.`
    });

    // Equilibrium axis
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.35)' : 'rgba(100,116,139,0.4)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(wireStartX, centerY);
    ctx.lineTo(wireEndX, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Envelope curves (+/- 2A sin(kx))
    ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.28)' : 'rgba(14,165,233,0.3)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.4;
    for (const sign of [-1, 1]) {
      ctx.beginPath();
      for (let i = 0; i <= 160; i++) {
        const u = i / 160;
        const x = wireStartX + u * wireLenPx;
        const envY = centerY + sign * ampPx * Math.abs(Math.sin(effectiveHalfWaves * Math.PI * u));
        if (i === 0) ctx.moveTo(x, envY);
        else ctx.lineTo(x, envY);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Instantaneous standing wave string y(x,t) = A * sin(k*x) * cos(w*t)
    const cosWt = Math.cos(omega * t);
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    for (let i = 0; i <= 180; i++) {
      const u = i / 180;
      const x = wireStartX + u * wireLenPx;
      const y = centerY - ampPx * Math.sin(effectiveHalfWaves * Math.PI * u) * cosWt;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Support clamps
    ctx.fillStyle = isDark ? '#475569' : '#334155';
    ctx.fillRect(wireStartX - 10, centerY - 38, 10, 76);

    if (isFreeEnd) {
      // Vertical frictionless ring rod on right
      ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(wireEndX + 2, centerY - ampPx - 18);
      ctx.lineTo(wireEndX + 2, centerY + ampPx + 18);
      ctx.stroke();
      const tipY = centerY - ampPx * Math.sin(effectiveHalfWaves * Math.PI) * cosWt;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(wireEndX + 2, tipY, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = isDark ? '#475569' : '#334155';
      ctx.fillRect(wireEndX, centerY - 38, 10, 76);
    }

    // Highlight Nodes (Red) & Antinodes (Emerald)
    const nodeCount = isFreeEnd ? harmonicN : harmonicN + 1;
    for (let nIdx = 0; nIdx < nodeCount; nIdx++) {
      const uNode = nIdx / effectiveHalfWaves;
      if (uNode <= 1.001) {
        const nx = wireStartX + Math.min(1, uNode) * wireLenPx;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(nx, centerY, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let aIdx = 0; aIdx < harmonicN; aIdx++) {
      const uAnti = (aIdx + 0.5) / effectiveHalfWaves;
      const ax = wireStartX + Math.min(1, uAnti) * wireLenPx;
      const ay = centerY - ampPx * Math.sin(effectiveHalfWaves * Math.PI * Math.min(1, uAnti)) * cosWt;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(ax, ay, 4.8, 0, Math.PI * 2);
      ctx.fill();

      if (ov.showVectors && Math.abs(cosWt) > 0.15) {
        const vY = centerY - ampPx * Math.sin(effectiveHalfWaves * Math.PI * Math.min(1, uAnti)) * Math.sin(omega * t) * 0.45;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax, ay + (ay - vY) * 0.55);
        ctx.stroke();
      }
    }

    // Legend tags
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('● Nút sóng (Biên độ = 0)', wireStartX, 26);
    ctx.fillStyle = '#10b981';
    ctx.fillText('● Bụng sóng (Biên độ 2A)', wireStartX + 165, 26);
    ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
    ctx.fillText(`l = ${lengthM.toFixed(2)} m · v = ${speedV.toFixed(0)} m/s`, wireStartX, h - 14);
  };

  // 18. Doppler Effect & Mach Cone (Hiệu Ứng Doppler & Nón Sóng Xung Kích)
  const drawDopplerEffect = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const ov = overlaysRef.current;

    const vWave = Math.max(100, p.waveSpeed ?? 340);
    const vSource = Math.max(0, Math.min(vWave * 1.6, p.sourceSpeed ?? 140));
    const f0 = Math.max(100, p.sourceFreq ?? 440);
    const ratio = vSource / vWave;
    const isMach = ratio >= 1;

    const fApproach = ratio < 0.99 ? f0 * (vWave / (vWave - vSource)) : Infinity;
    const fRecede = f0 * (vWave / (vWave + vSource));

    pushTelemetry({
      metric1Label: 'Tần số máy thu phía trước (f\')',
      metric1Val: Number.isFinite(fApproach) ? `${fApproach.toFixed(1)} Hz` : 'Sóng xung kích!',
      metric2Label: 'Tần số phía sau (f")',
      metric2Val: `${fRecede.toFixed(1)} Hz`,
      metric3Label: 'Tỉ số Mach (v_s / v)',
      metric3Val: `${ratio.toFixed(2)} M`,
      note: isMach
        ? `Nguồn vượt tốc độ sóng (Mach = ${ratio.toFixed(2)}) tạo mặt đầu sóng hình nón (Sóng xung kích)!`
        : `Phía trước nguồn, các gợn sóng bị nén (λ' = λ·(1 - v_s/v)) nên tần số tăng lên ${fApproach.toFixed(1)} Hz.`
    });

    const cy = h * 0.52;
    const pxSpeedWave = 68;
    const pxSpeedSrc = pxSpeedWave * ratio;
    const periodSec = Math.max(0.16, 1.35 / Math.max(1, f0 / 350));

    // Continuous cyclic wrap every 8s so emitter sweeps smoothly left -> right
    const cycleDuration = Math.max(4.5, (w * 0.85) / Math.max(18, pxSpeedSrc || 40));
    const localT = ratio < 0.01 ? t % 6 : t % cycleDuration;
    const srcStartX = ratio < 0.01 ? w * 0.5 : w * 0.14;
    const srcX = srcStartX + pxSpeedSrc * localT;

    // Draw emitted circular wavefronts from past emission instants
    const numPulses = 16;
    const currentStep = Math.floor(localT / periodSec);
    for (let k = Math.max(0, currentStep - numPulses); k <= currentStep; k++) {
      const emitT = k * periodSec;
      const age = localT - emitT;
      if (age <= 0) continue;
      const emitX = srcStartX + pxSpeedSrc * emitT;
      const rad = pxSpeedWave * age;
      const alpha = Math.max(0.08, 1 - age / (numPulses * periodSec));

      ctx.strokeStyle = isDark
        ? `rgba(56, 189, 248, ${alpha.toFixed(2)})`
        : `rgba(2, 132, 199, ${alpha.toFixed(2)})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(emitX, cy, rad, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Mach shock cone tangent lines when v_s >= v
    if (isMach && localT > 0.25) {
      const halfConeAngle = Math.asin(Math.min(1, 1 / ratio));
      const coneLen = Math.min(w * 0.65, pxSpeedSrc * localT * 1.15);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.4;
      for (const sgn of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(srcX, cy);
        ctx.lineTo(
          srcX - coneLen * Math.cos(halfConeAngle),
          cy + sgn * coneLen * Math.sin(halfConeAngle)
        );
        ctx.stroke();
      }
    }

    // Velocity vector & Emitter dot
    if (ov.showVectors && vSource > 0) {
      const arrowLen = Math.min(90, 20 + ratio * 48);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(srcX, cy);
      ctx.lineTo(srcX + arrowLen, cy);
      ctx.lineTo(srcX + arrowLen - 7, cy - 5);
      ctx.moveTo(srcX + arrowLen, cy);
      ctx.lineTo(srcX + arrowLen - 7, cy + 5);
      ctx.stroke();
    }

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(srcX, cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Stationary observer microphone on the right
    const obsX = w - 48;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(obsX, cy, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Máy thu', obsX, cy - 15);
    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.fillText(`Nguồn f₀=${f0.toFixed(0)}Hz`, Math.min(w - 90, Math.max(70, srcX)), cy + 24);
  };

  // 19. Photoelectric Effect (Hiệu Ứng Quang Điện Ngoài - Lớp 12)
  const drawPhotoelectricEffect = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const p = paramsRef.current;
    const ov = overlaysRef.current;

    const lambdaNm = Math.max(150, Math.min(760, p.wavelengthNm ?? 280));
    const workEv = Math.max(1.2, Math.min(5.5, p.workFunctionEv ?? 2.14));
    const stopV = Math.max(-5, Math.min(5, p.voltageUak ?? 1.5));

    // Photon energy E = hc / lambda in eV (hc ≈ 1240 eV·nm)
    const photonEv = 1240 / lambdaNm;
    const lambda0Nm = 1240 / workEv;
    const canEmit = photonEv >= workEv;
    const maxKeEv = canEmit ? Math.max(0, photonEv - workEv) : 0;
    const stoppingV = maxKeEv; // in Volts numerically equal to eV
    const netReachable = canEmit && (stopV >= -stoppingV);

    // Light color from wavelength
    let beamColor = '#8b5cf6';
    if (lambdaNm < 380) beamColor = '#a855f7'; // UV
    else if (lambdaNm < 450) beamColor = '#6366f1';
    else if (lambdaNm < 495) beamColor = '#3b82f6';
    else if (lambdaNm < 570) beamColor = '#10b981';
    else if (lambdaNm < 590) beamColor = '#eab308';
    else if (lambdaNm < 620) beamColor = '#f97316';
    else beamColor = '#ef4444';

    pushTelemetry({
      metric1Label: 'Năng lượng photon (ε)',
      metric1Val: `${photonEv.toFixed(2)} eV`,
      metric2Label: 'Giới hạn quang điện (λ₀)',
      metric2Val: `${lambda0Nm.toFixed(0)} nm`,
      metric3Label: 'Động năng ban đầu W_đ0max',
      metric3Val: canEmit ? `${maxKeEv.toFixed(2)} eV (U_h=${stoppingV.toFixed(2)}V)` : '0 eV (Không bứt e)',
      note: canEmit
        ? netReachable
          ? `ε = ${photonEv.toFixed(2)} eV ≥ A = ${workEv.toFixed(2)} eV → Bật quang electron! ${stopV < 0 ? 'Điện áp hãm đang làm chậm dòng e.' : 'U_AK giúp tăng tốc dòng quang điện.'}`
          : `Electron đã bật ra nhưng bị điện áp hãm |U_AK| = ${Math.abs(stopV).toFixed(2)} V > U_h = ${stoppingV.toFixed(2)} V đẩy ngược lại Catốt!`
        : `λ = ${lambdaNm.toFixed(0)} nm > λ₀ = ${lambda0Nm.toFixed(0)} nm (ε < A) → Không xảy ra hiệu ứng quang điện.`
    });

    // Vacuum quartz tube
    const tubeL = w * 0.14;
    const tubeR = w * 0.86;
    const tubeW = tubeR - tubeL;
    const tubeTop = h * 0.24;
    const tubeBot = h * 0.78;
    const tubeMidY = (tubeTop + tubeBot) / 2;

    ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(226, 232, 240, 0.55)';
    ctx.strokeStyle = isDark ? '#475569' : '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(tubeL, tubeTop, tubeW, tubeBot - tubeTop, 32);
    ctx.fill();
    ctx.stroke();

    // Cathode (left plate) & Anode (right plate)
    const catX = tubeL + 36;
    const anoX = tubeR - 36;
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(catX - 6, tubeTop + 22, 12, tubeBot - tubeTop - 44);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(anoX - 6, tubeTop + 22, 12, tubeBot - tubeTop - 44);

    // Incoming photon rays hitting Cathode from top-right
    for (let i = 0; i < 4; i++) {
      const targetY = tubeTop + 42 + i * ((tubeBot - tubeTop - 84) / 3);
      const startX = tubeL + tubeW * 0.42 + i * 16;
      const startY = 18;
      const progress = (t * 1.4 + i * 0.23) % 1;
      const px = startX + (catX - startX) * progress;
      const py = startY + (targetY - startY) * progress;

      ctx.strokeStyle = beamColor;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(catX, targetY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      ctx.fillStyle = beamColor;
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ejected photoelectrons moving between Cathode and Anode
    if (canEmit) {
      const travelSpan = anoX - catX - 12;
      const eSpeedFactor = Math.max(0.35, Math.min(2.2, 0.5 + maxKeEv * 0.35 + stopV * 0.14));
      for (let i = 0; i < 7; i++) {
        const yOff = tubeTop + 34 + ((i * 29) % Math.max(30, tubeBot - tubeTop - 68));
        const phase = (t * eSpeedFactor + i * 0.14) % 1;
        let ex: number;
        if (netReachable) {
          ex = catX + 8 + phase * travelSpan;
        } else {
          // Electron travels partway then reverses back to cathode due to strong stopping voltage
          const maxReachRatio = Math.max(0.12, Math.min(0.85, stoppingV / Math.max(0.1, Math.abs(stopV))));
          const dist = Math.sin(phase * Math.PI) * travelSpan * maxReachRatio;
          ex = catX + 8 + dist;
        }
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ex, yOff, 4, 0, Math.PI * 2);
        ctx.fill();
        if (ov.showVectors) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(ex, yOff);
          ctx.lineTo(ex + (netReachable || phase < 0.5 ? 10 : -10), yOff);
          ctx.stroke();
        }
      }
    }

    // Labels & Voltage readout
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0ea5e9';
    ctx.fillText(`Catốt (K) · A=${workEv.toFixed(2)}eV`, catX + 18, tubeBot + 18);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`Anốt (A) · U_AK=${stopV.toFixed(1)}V`, anoX - 18, tubeBot + 18);
    ctx.fillStyle = beamColor;
    ctx.fillText(`Chùm sáng λ = ${lambdaNm.toFixed(0)} nm`, w * 0.5, 22);
    if (!canEmit) {
      ctx.fillStyle = '#ef4444';
      ctx.fillText('KHÔNG BỨT ELECTRON (λ > λ₀)', (catX + anoX) / 2, tubeMidY);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 overflow-x-hidden">
      {activeView === 'catalog' && (
        <>
          {/* Header Banner & 2-Zone Framed Selector */}
          <div className="sci-frame sci-blueprint-bg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {(onBack || true) && (
                    <button
                      onClick={onBack || goBack}
                      className="cs-deck-btn flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t('nav.back_prev', 'Quay lại trang trước', 'Back')}</span>
                    </button>
                  )}
                  <span className="font-bold text-blue-700 dark:text-sky-400 uppercase tracking-wider">
                    Vật Lí 9 – 12 &amp; Bồi Dưỡng Chuyên
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Giảng bài từng bước · Thí nghiệm 2D/3D tương tác</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Hệ Thống Bài Giảng &amp; Phòng Thí Nghiệm Vật Lí
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Chọn khung chương trình bên dưới rồi mở bài giảng, Mô phỏng 2D hoặc Mô phỏng 3D tương tác theo thời gian thực.
                </p>
              </div>

              {/* Quick Dedicated Domain 2D / 3D Simulation Launch Buttons */}
              {(() => {
                const counts = getPhysicsSimCounts();
                return (
                  <div className="sim-physics-scope flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
                    <button
                      type="button"
                      data-ripple="true"
                      onClick={() => openDomain2D(location.physicsDomain || 'mechanics')}
                      className="group sim-btn-phy sim-btn-hero sim-btn-active flex items-center gap-2 px-4 py-2.5 rounded-[3px] border border-sky-400/70 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-sm whitespace-nowrap cursor-pointer"
                    >
                      <span className="sim-led-square text-cyan-200" />
                      <Zap className="w-4 h-4 icon-anim-zap" />
                      <span>Mô phỏng 2D ({counts.domainCount} Lĩnh Vực · {counts.count2D} Lab)</span>
                    </button>
                    <button
                      type="button"
                      data-ripple="true"
                      onClick={() => openDomain3D(location.physicsDomain || 'mechanics')}
                      className="group sim-btn-phy sim-btn-hero sim-btn-active flex items-center gap-2 px-4 py-2.5 rounded-[3px] border border-amber-300/80 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm whitespace-nowrap cursor-pointer"
                    >
                      <span className="sim-led-square text-slate-900" />
                      <Box className="w-4 h-4 icon-anim-3d-cube" />
                      <span>Mô phỏng 3D ({counts.domainCount} Lĩnh Vực · {counts.count3D} Lab)</span>
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* Dedicated Simulation Page Banner (opens standalone Physics 2D/3D Domains view) */}
            <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                  <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>Trang Mô Phỏng Vật Lí Tách Riêng Theo {PHYSICS_DOMAINS.length} Lĩnh Vực (Lớp 9 – 12 · Tương Tác 2D/3D)</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {PHYSICS_DOMAINS.map((d) => d.shortName).join(' · ')} — kèm Quang học Raytracing, Bản cát Chladni &amp; animation Vật lí riêng
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate({ subject: 'physics_sims' })}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 dark:bg-sky-600 hover:bg-blue-700 dark:hover:bg-sky-500 text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Atom className="w-4 h-4 shrink-0" />
                <span>Mở Trang Mô Phỏng Riêng (2D &amp; 3D)</span>
              </button>
            </div>

            {/* 2 Separate Animated Framed Track Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Khung 1: Khu Không Chuyên (GDPT 9-12) */}
              <div
                style={
                  {
                    '--phy-accent': '#0284c7',
                    '--phy-secondary': '#38bdf8'
                  } as React.CSSProperties
                }
                className={`physics-zone-frame group ${
                  selectedTrack === 'khong_chuyen'
                    ? 'physics-zone-active shadow-[0_14px_34px_-12px_rgba(2,132,199,0.4)]'
                    : 'shadow-xs'
                }`}
              >
                <div aria-hidden="true" className="physics-orbit-ring" />
                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => setSelectedTrack('khong_chuyen')}
                  className={`relative z-10 w-full h-full text-left rounded-[0.5rem] p-4 sm:p-5 overflow-hidden transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                    selectedTrack === 'khong_chuyen'
                      ? 'bg-gradient-to-br from-blue-700 via-sky-600 to-cyan-600 text-white'
                      : 'bg-slate-50/95 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <span aria-hidden="true" className="physics-energy-sweep" />
                  <div className="relative z-10 flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        selectedTrack === 'khong_chuyen'
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      <Atom className="w-6 h-6 icon-anim-atom" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="text-sm sm:text-base font-extrabold leading-snug">
                        Khu GDPT 2018 (Lớp 9–12)
                      </div>
                      <div
                        className={`text-xs leading-relaxed ${
                          selectedTrack === 'khong_chuyen'
                            ? 'text-sky-100'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        KHTN 9 &amp; Vật lí 10–11–12 chuẩn Thông tư 32 · {PHYSICS_LESSONS.filter((l) => l.track === 'khong_chuyen').length} bài học
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10 shrink-0 flex items-center gap-1.5 text-xs font-bold whitespace-nowrap">
                    {selectedTrack === 'khong_chuyen' ? (
                      <span className="inline-flex items-center gap-1 text-white">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đang mở</span>
                      </span>
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                        Chọn khu →
                      </span>
                    )}
                  </div>
                </button>
              </div>

              {/* Khung 2: Khu Chuyên Lí (CB -> NC -> Chuyên) */}
              <div
                style={
                  {
                    '--phy-accent': '#d97706',
                    '--phy-secondary': '#f97316'
                  } as React.CSSProperties
                }
                className={`physics-zone-frame group ${
                  selectedTrack === 'chuyen'
                    ? 'physics-zone-active shadow-[0_14px_34px_-12px_rgba(217,119,6,0.45)]'
                    : 'shadow-xs'
                }`}
              >
                <div aria-hidden="true" className="physics-orbit-ring" />
                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => setSelectedTrack('chuyen')}
                  className={`relative z-10 w-full h-full text-left rounded-[0.5rem] p-4 sm:p-5 overflow-hidden transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                    selectedTrack === 'chuyen'
                      ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-slate-950'
                      : 'bg-slate-50/95 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <span aria-hidden="true" className="physics-energy-sweep" />
                  <div className="relative z-10 flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        selectedTrack === 'chuyen'
                          ? 'bg-slate-950/15 text-slate-950'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      <Zap className="w-6 h-6 icon-anim-zap" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="text-sm sm:text-base font-extrabold leading-snug">
                        Khu Chuyên Lí &amp; Chuyên đề GDPT 2018
                      </div>
                      <div
                        className={`text-xs leading-relaxed ${
                          selectedTrack === 'chuyen'
                            ? 'text-slate-900/85 font-medium'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        Chuyên đề 10–11–12 · Bồi dưỡng HSG Quốc Gia · {PHYSICS_LESSONS.filter((l) => l.track === 'chuyen').length} chuyên đề
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10 shrink-0 flex items-center gap-1.5 text-xs font-bold whitespace-nowrap">
                    {selectedTrack === 'chuyen' ? (
                      <span className="inline-flex items-center gap-1 text-slate-950">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đang mở</span>
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                        Chọn khu →
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Sub-Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/70 dark:border-slate-800">
              {selectedTrack === 'khong_chuyen' ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 mr-1">Khối lớp:</span>
                  {['all', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map((grade) => {
                    const count =
                      grade === 'all'
                        ? PHYSICS_LESSONS.filter((l) => l.track === 'khong_chuyen').length
                        : PHYSICS_LESSONS.filter((l) => l.track === 'khong_chuyen' && l.grade === grade).length;
                    return (
                      <button
                        key={grade}
                        onClick={() => setSelectedGrade(grade)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                          selectedGrade === grade
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {grade === 'all' ? `Tất cả (${count} bài)` : `${grade} (${count})`}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 mr-1">Trình độ Chuyên:</span>
                  {(['all', 'Cơ bản', 'Nâng cao', 'Chuyên / HSG'] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedTier === tier
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tier === 'all' ? 'Tất cả lộ trình Chuyên' : tier}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowStudyPrinciples(!showStudyPrinciples)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors self-start sm:self-auto"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Nguyên tắc tự học SGK &amp; Sổ tay SI</span>
                {showStudyPrinciples ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {availableChapters.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/70">
                <span className="text-[11px] font-semibold text-slate-500 mr-1">Chương GDPT 2018:</span>
                <button
                  type="button"
                  onClick={() => setSelectedChapter('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all ${
                    selectedChapter === 'all'
                      ? 'bg-slate-900 dark:bg-sky-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Tất cả chương
                </button>
                {availableChapters.map((chap) => (
                  <button
                    key={chap}
                    type="button"
                    onClick={() => setSelectedChapter(chap)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all text-left ${
                      selectedChapter === chap
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {chap}
                  </button>
                ))}
              </div>
            )}

            {showStudyPrinciples && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    Tập trung vào Sách Giáo Khoa &amp; Thí nghiệm
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Đọc kỹ phần mô tả thí nghiệm, câu hỏi thảo luận SGK, tự kiểm chứng lại qua Mô phỏng 2D/3D trên lớp và giải hết bài tập Trắc nghiệm – Tự luận cuối mỗi bài.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-500" />
                    Ghi chép bằng Sơ đồ tư duy &amp; Sổ công thức hệ SI
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Hệ thống hóa kiến thức theo sơ đồ nhánh, tóm tắt công thức then chốt kèm đơn vị đo chuẩn hệ SI (m, kg, s, N, J, W, A, V, Ω) để tra cứu nhanh khi giải bài.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 3-Column Animated Framed Physics Lesson Cards Catalog */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map((l) => {
              const isPro = l.track === 'chuyen';
              return (
                <div
                  key={l.id}
                  style={
                    {
                      '--phy-accent': isPro ? '#f59e0b' : '#0284c7',
                      '--phy-secondary': isPro ? '#ef4444' : '#38bdf8'
                    } as React.CSSProperties
                  }
                  className="physics-card-frame group shadow-sm hover:shadow-[0_18px_40px_-14px_rgba(2,132,199,0.34)]"
                >
                  <div aria-hidden="true" className="physics-orbit-ring" />
                  <div
                    onClick={() => handleOpenLesson(l, 'theory')}
                    className="relative z-10 h-full cursor-pointer bg-white/95 dark:bg-slate-900/95 rounded-[0.65rem] p-5 flex flex-col justify-between gap-4 overflow-hidden"
                  >
                    <span aria-hidden="true" className="physics-energy-sweep" />
                    <div className="relative z-10 space-y-2.5">
                      <div className="flex items-start gap-3">
                        <LectureThumbnail
                          subject="physics"
                          id={l.id}
                          category={l.grade}
                          simType={l.simulationType}
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className={`font-bold uppercase tracking-wider ${isPro ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                              {isPro ? `Chuyên Lí · ${l.tier || 'Nâng cao'}` : `${l.grade} · Bài ${l.lessonNumber}`}
                            </span>
                            <span className="font-mono shrink-0 tabular-nums">{l.practiceExercises.length} TN + {(l.essayExercises || []).length} TL</span>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                            {translate(l.title)}
                          </h3>
                          {l.stageLabel && (
                            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                              {l.stageLabel}
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {translate(l.description)}
                      </p>
                    </div>

                    <div className="relative z-10 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          data-ripple="true"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenLesson(l, 'simulation');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <Zap className="w-3 h-3 icon-anim-zap" />
                          <span>Mô phỏng 2D</span>
                        </button>
                        <button
                          type="button"
                          data-ripple="true"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenLesson(l, 'sim3d');
                          }}
                          className="sim-btn-3d inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <Box className="w-3 h-3 icon-anim-3d-cube" />
                          <span>Mô phỏng 3D</span>
                        </button>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                        <span>Vào bài</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeView === 'lecture' && (
        <>
          {/* Dedicated Classroom Navigation Bar & Header */}
          <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setIsSimFullscreen(false);
                    goBack();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại</span>
                </button>
                <button
                  onClick={() => {
                    setIsSimFullscreen(false);
                    navigate({ physicsView: 'catalog' });
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <span>Danh sách Vật Lí</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentLessonIndex <= 0}
                    onClick={() => {
                      if (currentLessonIndex > 0) {
                        navigate({ physicsLessonId: filteredLessons[currentLessonIndex - 1].id });
                      }
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Bài trước</span>
                  </button>
                  <button
                    disabled={currentLessonIndex < 0 || currentLessonIndex >= filteredLessons.length - 1}
                    onClick={() => {
                      if (currentLessonIndex >= 0 && currentLessonIndex < filteredLessons.length - 1) {
                        navigate({ physicsLessonId: filteredLessons[currentLessonIndex + 1].id });
                      }
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span>Bài tiếp</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Main Classroom Sub-Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <button
                  onClick={() => navigate({ physicsTab: 'theory' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeTab === 'theory'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t('sim.theory', '1. Bài Giảng', '1. Lecture')}</span>
                </button>
                <button
                  onClick={() => navigate({ physicsTab: 'simulation' })}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeTab === 'simulation'
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 icon-anim-zap" />
                  <span>{t('sim.2d', '2. Mô phỏng 2D', '2. 2D Sim')}</span>
                </button>
                <button
                  onClick={() => navigate({ physicsTab: 'sim3d' })}
                  className={`group sim-btn-3d flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeTab === 'sim3d'
                      ? 'bg-amber-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5 icon-anim-3d-cube" />
                  <span>{t('sim.3d', '3. Mô phỏng 3D', '3. 3D Sim')}</span>
                </button>
                <button
                  onClick={() => navigate({ physicsTab: 'practice' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeTab === 'practice'
                      ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{t('sim.practice', '4. Bài Tập', '4. Practice')}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {lesson.track === 'chuyen'
                    ? `Chuyên Lí · ${lesson.tier || 'Nâng cao'} (${lesson.grade})`
                    : `${lesson.grade} · Bài ${lesson.lessonNumber}`}
                </span>
                {lesson.stageLabel && (
                  <>
                    <span>·</span>
                    <span>{lesson.stageLabel}</span>
                  </>
                )}
                {lesson.sourceTag && (
                  <>
                    <span>·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{lesson.sourceTag}</span>
                  </>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {translate(lesson.title)}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {translate(lesson.description)}
              </p>
            </div>

            {/* Key Formulas with KaTeX */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('', 'Công thức hệ SI:', 'SI Formulas:')}
              </span>
              {lesson.keyFormulas.map((kf, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-mono rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <MathFormula formula={kf} />
                </span>
              ))}
            </div>
          </div>

          {/* VIEW 1: DEDICATED STEP-BY-STEP INTERACTIVE LECTURE ROOM */}
          {activeTab === 'theory' && (
            <InteractiveLectureRoom
              lessonKey={lesson.id}
              subject="physics"
              grade={lesson.grade}
              subjectAccent={lesson.track === 'chuyen' ? 'amber' : 'blue'}
              kicker={
                lesson.track === 'chuyen'
                  ? `Bồi dưỡng Chuyên Lí · ${lesson.tier || 'Nâng cao'}`
                  : `${lesson.grade} · Bài giảng Vật Lí chi tiết`
              }
              title={translate(lesson.title)}
              subtitle={translate(lesson.description)}
              steps={buildPhysicsLectureSteps(lesson)}
              keyFormulas={lesson.keyFormulas}
              onEarnXP={onScoreEarned}
              onOpenSim2D={() => navigate({ physicsTab: 'simulation' })}
              onOpenSim3D={() => navigate({ physicsTab: 'sim3d' })}
              onNextLesson={
                currentLessonIndex >= 0 && currentLessonIndex < filteredLessons.length - 1
                  ? () => navigate({ physicsLessonId: filteredLessons[currentLessonIndex + 1].id })
                  : undefined
              }
              actions={[
                {
                  label: t('', 'Mở Phòng Thí Nghiệm 2D', 'Open 2D Lab'),
                  onClick: () => navigate({ physicsTab: 'simulation' }),
                  variant: 'primary',
                  icon: <Zap className="w-4 h-4" />
                },
                {
                  label: t('', 'Mở Mô Phỏng 3D', 'Open 3D Simulation'),
                  onClick: () => navigate({ physicsTab: 'sim3d' }),
                  variant: 'amber',
                  icon: <Box className="w-4 h-4" />
                },
                {
                  label: t('', 'Làm Bài Tập Củng Cố (+25 XP)', 'Practice Exercises (+25 XP)'),
                  onClick: () => navigate({ physicsTab: 'practice' }),
                  variant: 'emerald',
                  icon: <GraduationCap className="w-4 h-4" />
                }
              ]}
            />
          )}

          {/* VIEW 3D: THREE.JS 3D PHYSICS SIMULATION */}
          {activeTab === 'sim3d' && (
            <Physics3DView
              initialMode={lesson.sim3dType}
              domainTitle={PHYSICS_DOMAINS.find((d) => d.id === getDomainFor3DSim(lesson.sim3dType))?.shortName}
              onBack={goBack}
            />
          )}

          {/* VIEW 2: 2D INTERACTIVE PHYSICS LAB */}
          {activeTab === 'simulation' && (
            <ViewportPortal active={isSimFullscreen}>
              <div
                className={
                  isSimFullscreen
                    ? 'fixed inset-0 z-[100] h-[100dvh] w-screen p-3 sm:p-5 bg-slate-100/98 dark:bg-slate-950/98 flex flex-col gap-4 overflow-y-auto'
                    : 'space-y-4'
                }
              >
                {/* Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 dark:bg-slate-900/95 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800/80 shadow-xs shrink-0">
                  <div className="flex items-center gap-2.5">
                    {isSimFullscreen ? (
                      <button
                        onClick={() => setIsSimFullscreen(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{t('', 'Quay lại (Esc)', 'Back (Esc)')}</span>
                      </button>
                    ) : (
                      <button
                        onClick={goBack}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{t('btn.back', 'Quay lại', 'Back')}</span>
                      </button>
                    )}

                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {t('', 'Phòng Thí Nghiệm 2D', '2D Physics Lab')} · {translate(activeSimTitle)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDomain2D(getDomainFor2DSim(activeSimType), activeSimType)}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{t('', 'Mở trang riêng lĩnh vực', 'Open Domain View')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsSimFullscreen(false);
                        navigate({ physicsTab: 'sim3d' });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>{t('', 'Chuyển sang 3D', 'Switch to 3D')}</span>
                    </button>

                    <button
                      onClick={() => setIsSimFullscreen(!isSimFullscreen)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                        isSimFullscreen
                          ? 'bg-slate-800 text-white hover:bg-slate-700'
                          : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 hover:bg-blue-100'
                      }`}
                    >
                      {isSimFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                      <span>{isSimFullscreen ? t('btn.exitFullscreen', 'Thu nhỏ', 'Exit Fullscreen') : t('btn.fullscreen', 'Toàn màn hình', 'Fullscreen')}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Experiment Presets Strip */}
                {activePresets.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 bg-white/95 dark:bg-slate-900/95 px-3 py-2 rounded-lg border border-slate-200/80 dark:border-slate-800/80 shadow-xs text-xs">
                    <span className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-300">
                      <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                      {t('', 'Mẫu thí nghiệm nhanh:', 'Quick Experiment Presets:')}
                    </span>
                    {activePresets.map((pr) => (
                      <button
                        key={pr.label}
                        type="button"
                        onClick={() => setParams({ ...activeDefaultParams, ...pr.params })}
                        title={pr.description}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        {pr.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Canvas Main Stage + Telemetry + Data Logger (2 cols) */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white/95 dark:bg-slate-900/95 rounded-lg border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
                      {/* Transport, Step, Speed & Stopwatch Toolbar */}
                      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-800/50">
                        <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap items-center gap-1.5 scrollbar-none pb-0.5 sm:pb-0 [&>button]:shrink-0 [&>button]:whitespace-nowrap [&>button]:min-h-[36px]">
                          <button
                            onClick={() => setIsRunning(!isRunning)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                              isRunning
                                ? 'bg-amber-500 text-white hover:bg-amber-600'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            <span>{isRunning ? t('btn.pause', 'Tạm dừng', 'Pause') : t('btn.resume', 'Chạy tiếp', 'Resume')}</span>
                          </button>

                          <button
                            onClick={handleStepOnce}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Tiến từng bước 0.05 giây"
                          >
                            <StepForward className="w-3.5 h-3.5 text-blue-500" />
                            <span>+0.05s</span>
                          </button>

                          <button
                            onClick={handleResetSim}
                            className="p-2 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Đặt lại trạng thái ban đầu"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>

                          <div className="flex items-center gap-1 ml-1 text-xs text-slate-500 dark:text-slate-400 shrink-0">
                            {[0.25, 0.5, 1.0, 2.0].map((spd) => (
                              <button
                                key={spd}
                                onClick={() => setSimSpeed(spd)}
                                className={`min-h-[34px] px-2 py-1 rounded-md text-[11px] font-mono ${
                                  simSpeed === spd
                                    ? 'bg-blue-600 text-white font-bold'
                                    : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                {spd}x
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Built-in Stopwatch + Log Sample */}
                        <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap items-center gap-2 scrollbar-none pb-0.5 sm:pb-0 [&>button]:shrink-0 [&>button]:whitespace-nowrap [&>button]:min-h-[36px]">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs shrink-0">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-100 min-w-[54px]">
                              {stopwatchElapsed.toFixed(2)}s
                            </span>
                            <button
                              onClick={() => setStopwatchRunning(!stopwatchRunning)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                stopwatchRunning
                                  ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                                  : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                              }`}
                            >
                              {stopwatchRunning ? 'Dừng' : 'Bấm'}
                            </button>
                            <button
                              onClick={() => {
                                setStopwatchRunning(false);
                                stopwatchAccumRef.current = 0;
                                setStopwatchElapsed(0);
                              }}
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                            >
                              0
                            </button>
                          </div>

                          <button
                            onClick={handleLogSample}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Ghi mẫu đo</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsCodeCompilerOpen(true)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-500 transition-colors cursor-pointer"
                            title="Dịch ngược mô hình sang Phương trình Vi phân & Code Python/C++"
                          >
                            <FileCode2 className="w-3.5 h-3.5" />
                            <span>Code RK4</span>
                          </button>
                        </div>
                      </div>

                      {/* Visual Overlays & Experiment Actions Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 text-[11px]">
                        <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap items-center gap-1.5 max-w-full scrollbar-none [&>button]:shrink-0 [&>button]:whitespace-nowrap [&>button]:min-h-[34px]">
                          <span className="font-semibold text-slate-500 dark:text-slate-400 mr-0.5">Hiển thị:</span>
                          <button
                            onClick={() => setOverlays((o) => ({ ...o, showRulerGrid: !o.showRulerGrid }))}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold border transition-colors ${
                              overlays.showRulerGrid
                                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                            }`}
                          >
                            <Grid className="w-3 h-3" />
                            <span>Lưới &amp; Thước</span>
                          </button>
                          <button
                            onClick={() => setOverlays((o) => ({ ...o, showVectors: !o.showVectors }))}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold border transition-colors ${
                              overlays.showVectors
                                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                            }`}
                          >
                            <Compass className="w-3 h-3" />
                            <span>Vectơ</span>
                          </button>
                          <button
                            onClick={() => setOverlays((o) => ({ ...o, showTrace: !o.showTrace }))}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold border transition-colors ${
                              overlays.showTrace
                                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                            }`}
                          >
                            <Eye className="w-3 h-3" />
                            <span>Quỹ đạo</span>
                          </button>
                          <button
                            onClick={() => setOverlays((o) => ({ ...o, showRealtimeChart: !o.showRealtimeChart }))}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold border transition-colors ${
                              overlays.showRealtimeChart
                                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                            }`}
                          >
                            <Activity className="w-3 h-3" />
                            <span>Biểu đồ</span>
                          </button>
                        </div>

                        {/* Experiment-Specific Action Controls */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {activeSimType === 'ohm_circuit' && (
                            <>
                              <button
                                onClick={() => setLabFlags((f) => ({ ...f, circuitOpen: !f.circuitOpen }))}
                                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                                  labFlags.circuitOpen
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-emerald-600 text-white'
                                }`}
                              >
                                {labFlags.circuitOpen ? 'Khóa K: MỞ (Đóng K)' : 'Khóa K: ĐÓNG (Ngắt K)'}
                              </button>
                              <button
                                onClick={() => setLabFlags((f) => ({ ...f, reversePolarity: !f.reversePolarity }))}
                                className="flex items-center gap-1 px-2 py-1 rounded-md font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              >
                                <ArrowRightLeft className="w-3 h-3" />
                                <span>Đảo cực nguồn</span>
                              </button>
                              <button
                                onClick={() => setLabFlags((f) => ({ ...f, showVoltmeter: !f.showVoltmeter }))}
                                className={`px-2 py-1 rounded-md font-semibold border ${
                                  labFlags.showVoltmeter
                                    ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                                }`}
                              >
                                Vôn kế R1
                              </button>
                            </>
                          )}

                          {activeSimType === 'lens_optics' && (
                            <>
                              <button
                                onClick={() => setLabFlags((f) => ({ ...f, isDiverging: !f.isDiverging }))}
                                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                                  labFlags.isDiverging
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-blue-600 text-white'
                                }`}
                              >
                                {labFlags.isDiverging ? 'Thấu kính Phân kì' : 'Thấu kính Hội tụ'}
                              </button>
                              <button
                                onClick={() => setLabFlags((f) => ({ ...f, showThirdRay: !f.showThirdRay }))}
                                className={`px-2 py-1 rounded-md font-semibold border ${
                                  labFlags.showThirdRay
                                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                                }`}
                              >
                                Tia qua F
                              </button>
                            </>
                          )}

                          {(activeSimType === 'projectile_motion' || activeSimType === 'free_fall_energy') && (
                            <button
                              onClick={() => setLabFlags((f) => ({ ...f, airDrag: !f.airDrag }))}
                              className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                                labFlags.airDrag
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {labFlags.airDrag ? 'Lực cản KK: BẬT' : 'Lực cản KK: TẮT'}
                            </button>
                          )}

                          {(activeSimType === 'spring_pendulum' || activeSimType === 'simple_pendulum') && (
                            <button
                              onClick={() => setLabFlags((f) => ({ ...f, hasFriction: !f.hasFriction }))}
                              className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                                labFlags.hasFriction
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {labFlags.hasFriction ? 'Ma sát tắt dần: BẬT' : 'Dao động lí tưởng'}
                            </button>
                          )}

                          {activeSimType === 'simple_pendulum' && (
                            <button
                              onClick={() => setLabFlags((f) => ({ ...f, showProtractor: !f.showProtractor }))}
                              className={`px-2 py-1 rounded-md font-semibold border ${
                                labFlags.showProtractor
                                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                              }`}
                            >
                              Thước đo góc
                            </button>
                          )}

                          {activeSimType === 'light_refraction' && (
                            <button
                              onClick={() => setLabFlags((f) => ({ ...f, showProtractor: !f.showProtractor }))}
                              className={`px-2.5 py-1 rounded-md font-semibold border ${
                                labFlags.showProtractor
                                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                              }`}
                            >
                              Thước đo góc 360°
                            </button>
                          )}

                          {activeSimType === 'wave_interference' && (
                            <>
                              <button
                                onClick={() => setLabFlags((f) => ({ ...f, singleSource: !f.singleSource }))}
                                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                                  labFlags.singleSource
                                    ? 'bg-slate-700 text-white'
                                    : 'bg-blue-600 text-white'
                                }`}
                              >
                                {labFlags.singleSource ? '1 Nguồn đơn' : '2 Nguồn giao thoa'}
                              </button>
                              <button
                                onClick={() => setLabFlags((f) => ({ ...f, showNodalLines: !f.showNodalLines }))}
                                className={`px-2 py-1 rounded-md font-semibold border ${
                                  labFlags.showNodalLines
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                                }`}
                              >
                                Đường cực đại
                              </button>
                            </>
                          )}

                          {activeSimType === 'magnetic_induction' && (
                            <>
                              <button
                                onClick={() => setLabFlags((f) => ({ ...f, flipMagnet: !f.flipMagnet }))}
                                className="flex items-center gap-1 px-2 py-1 rounded-md font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                              >
                                <ArrowRightLeft className="w-3 h-3" />
                                <span>Đảo cực N-S</span>
                              </button>
                              {[
                                { idx: 0, label: 'Dao động' },
                                { idx: 1, label: 'Đưa vào' },
                                { idx: 2, label: 'Rút ra' },
                                { idx: 3, label: 'Đứng yên' }
                              ].map((act) => (
                                <button
                                  key={act.idx}
                                  onClick={() => setLabFlags((f) => ({ ...f, inductionAction: act.idx }))}
                                  className={`px-2 py-1 rounded-md font-semibold ${
                                    labFlags.inductionAction === act.idx
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  {act.label}
                                </button>
                              ))}
                            </>
                          )}

                          {activeSimType === 'electric_field' && (
                            <button
                              onClick={() => setLabFlags((f) => ({ ...f, showFieldGrid: !f.showFieldGrid }))}
                              className={`px-2.5 py-1 rounded-md font-semibold border ${
                                labFlags.showFieldGrid
                                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                              }`}
                            >
                              Lưới điện trường E
                            </button>
                          )}

                          {activeSimType === 'nuclear_decay' && (
                            <button
                              onClick={() => {
                                const T = Math.max(0.2, params.halfLife ?? 4.0);
                                simTimeRef.current += T;
                                forceTelemetrySyncRef.current = true;
                              }}
                              className="px-2.5 py-1 rounded-md font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                            >
                              +1 Chu kì bán rã (T)
                            </button>
                          )}

                          {activeSimType === 'ac_rlc_circuit' && (
                            <button
                              onClick={() => {
                                const L = Math.max(0.05, params.indL ?? 0.3);
                                const C_uF = Math.max(5, params.capC ?? 40);
                                const fRes = 1 / (2 * Math.PI * Math.sqrt(L * C_uF * 1e-6));
                                setParams((prev) => ({ ...prev, freq: Number(fRes.toFixed(1)) }));
                              }}
                              className="px-2.5 py-1 rounded-md font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                            >
                              Đặt cộng hưởng (Z_L = Z_C)
                            </button>
                          )}

                          {activeSimType === 'standing_wave' && (
                            <button
                              onClick={() =>
                                setParams((prev) => ({
                                  ...prev,
                                  openEnd: Math.round(prev.openEnd ?? 0) === 1 ? 0 : 1
                                }))
                              }
                              className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                                Math.round(params.openEnd ?? 0) === 1
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-blue-600 text-white'
                              }`}
                            >
                              {Math.round(params.openEnd ?? 0) === 1
                                ? 'Chế độ: 1 đầu tự do'
                                : 'Chế độ: 2 đầu cố định'}
                            </button>
                          )}

                          {activeSimType === 'doppler_effect' && (
                            <div className="flex flex-wrap items-center gap-1">
                              {[
                                { label: 'Dưới âm (0.45M)', ratio: 0.45 },
                                { label: 'Cận âm (1.0M)', ratio: 1.0 },
                                { label: 'Siêu âm (1.35M)', ratio: 1.35 }
                              ].map((preset) => (
                                <button
                                  key={preset.label}
                                  onClick={() => {
                                    const vw = Math.max(100, params.waveSpeed ?? 340);
                                    setParams((prev) => ({
                                      ...prev,
                                      sourceSpeed: Number((vw * preset.ratio).toFixed(0))
                                    }));
                                  }}
                                  className="px-2 py-1 rounded-md font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100"
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          )}

                          {activeSimType === 'photoelectric_effect' && (
                            <div className="flex flex-wrap items-center gap-1">
                              {[
                                { label: 'Cs (2.14 eV)', work: 2.14 },
                                { label: 'Na (2.28 eV)', work: 2.28 },
                                { label: 'Zn (3.63 eV)', work: 3.63 },
                                { label: 'Cu (4.70 eV)', work: 4.7 }
                              ].map((metal) => (
                                <button
                                  key={metal.label}
                                  onClick={() =>
                                    setParams((prev) => ({ ...prev, workFunctionEv: metal.work }))
                                  }
                                  className={`px-2 py-1 rounded-md font-semibold border ${
                                    Math.abs((params.workFunctionEv ?? 2.14) - metal.work) < 0.05
                                      ? 'bg-purple-600 text-white border-purple-600'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                  }`}
                                >
                                  {metal.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Interactive Apparatus Bench + HTML5 Canvas */}
                      <div className="p-2.5 bg-slate-900/95">
                        <PhysicsApparatusWorkbench
                          dimension="2d"
                          simId={activeSimType}
                          domainId={getDomainFor2DSim(activeSimType)}
                          simParams={params}
                          simTimeRef={simTimeRef}
                          stageClassName={`relative w-full bg-slate-950 rounded-md overflow-hidden ${isSimFullscreen ? 'h-[280px] sm:h-[450px] lg:h-[500px]' : 'h-[280px] sm:h-[380px]'}`}
                        >
                          <canvas ref={canvasRef} className="w-full h-full block" />
                        </PhysicsApparatusWorkbench>
                      </div>

                      {/* Lab Time-Machine Scrubber + Stroboscope Multi-Exposure */}
                      <LabTimeMachineBar
                        simKey={`lec-${activeSimType}`}
                        canvasRef={canvasRef}
                        isRunning={isRunning}
                        onSetRunning={setIsRunning}
                        simSpeed={simSpeed}
                        onSetSimSpeed={setSimSpeed}
                        simTimeRef={simTimeRef}
                      />

                      {/* Real-time Telemetry Dashboard */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-md border border-slate-200/60 dark:border-slate-800/60">
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {telemetry.metric1Label}
                          </div>
                          <div className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                            {telemetry.metric1Val}
                          </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-3 rounded-md border border-slate-200/60 dark:border-slate-800/60">
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {telemetry.metric2Label}
                          </div>
                          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                            {telemetry.metric2Val}
                          </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-3 rounded-md border border-slate-200/60 dark:border-slate-800/60">
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {telemetry.metric3Label}
                          </div>
                          <div className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                            {telemetry.metric3Val}
                          </div>
                        </div>
                      </div>

                      {/* Physical Note / Law explanation */}
                      <div className="px-4 py-2.5 bg-blue-50/50 dark:bg-blue-950/20 border-t border-blue-100 dark:border-blue-900/30 text-xs text-blue-800 dark:text-blue-300 font-medium flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                        <span><FormattedText text={telemetry.note} /></span>
                      </div>
                    </div>

                    {/* Data Logger & Regression Analysis Panel (#3) */}
                    {dataLogs.length > 0 && (
                      <LabDataLoggerPanel
                        title={active2DSpec?.title || lesson?.title || 'Thí nghiệm Vật lí 2D'}
                        rows={dataLogs}
                        onClear={() => setDataLogs([])}
                      />
                    )}
                  </div>

                  {/* Interactive Parameters Numeric Panel (1 col) */}
                  <div className="space-y-4">
                    <div className="bg-white/95 dark:bg-slate-900/95 rounded-lg p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            Tham Số Thí Nghiệm (Nhập số tự do)
                          </h3>
                        </div>
                        <button
                          onClick={() => setParams(activeDefaultParams)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          Mặc định
                        </button>
                      </div>

                      <div className="space-y-3">
                        {Object.entries(activeParamBounds).map(([paramKey, bound]) => {
                          const curVal = params[paramKey] ?? activeDefaultParams[paramKey] ?? bound.min;

                          if (paramKey === 'circuitType') {
                            return (
                              <div key={paramKey} className="space-y-1.5 bg-slate-50/80 dark:bg-slate-800/40 p-2.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                  {bound.label}
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {[
                                    { v: 0, label: 'Mắc Nối Tiếp' },
                                    { v: 1, label: 'Mắc Song Song' }
                                  ].map((opt) => (
                                    <button
                                      key={opt.v}
                                      type="button"
                                      onClick={() => setParams((prev) => ({ ...prev, [paramKey]: opt.v }))}
                                      className={`py-1.5 rounded-md text-xs font-bold transition-colors ${
                                        Math.round(curVal) === opt.v
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          }

                          if (paramKey === 'vizMode') {
                            return (
                              <div key={paramKey} className="space-y-1.5 bg-slate-50/80 dark:bg-slate-800/40 p-2.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                  {bound.label}
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  {[
                                    { v: 0, label: 'Vectơ' },
                                    { v: 1, label: 'Đồ thị d-t' },
                                    { v: 2, label: 'Đồ thị v-t' }
                                  ].map((opt) => (
                                    <button
                                      key={opt.v}
                                      type="button"
                                      onClick={() => setParams((prev) => ({ ...prev, [paramKey]: opt.v }))}
                                      className={`py-1.5 rounded-md text-[11px] font-bold transition-colors ${
                                        Math.round(curVal) === opt.v
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          }

                          return (
                            <NumericParamField
                              key={paramKey}
                              label={bound.label}
                              unit={bound.unit}
                              value={curVal}
                              min={bound.min}
                              max={bound.max}
                              step={bound.step}
                              onChange={(nextVal) =>
                                setParams((prev) => ({
                                  ...prev,
                                  [paramKey]: nextVal
                                }))
                              }
                            />
                          );
                        })}
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                        <button
                          onClick={() => {
                            setIsSimFullscreen(false);
                            navigate({ physicsTab: 'practice' });
                          }}
                          className="w-full py-2.5 rounded-md bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <GraduationCap className="w-4 h-4" />
                          <span>Làm Bài Tập Củng Cố Ngay (+25 XP)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ViewportPortal>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* STANDALONE SEPARATE DOMAIN PAGE: MÔ PHỎNG 2D (GRADES 9–12)   */}
      {/* ============================================================ */}
      {is2DHub && active2DSpec && (
        <div className="sim-physics-scope space-y-4">
          {/* Top Domain Page Header & Cross-Nav */}
          <div className="sci-frame bg-white/95 dark:bg-slate-900/95 rounded-[4px] p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setIsSimFullscreen(false);
                    navigate({ physicsView: 'catalog' });
                  }}
                  className="group sim-btn-phy flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Tất cả Vật Lí</span>
                </button>
                <span className={`px-2.5 py-1 rounded-[3px] text-[11px] font-bold border ${activeDomainMeta.accentBadgeClass}`}>
                  Mô phỏng 2D · {activeDomainMeta.name} ({activeDomainMeta.grades})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => openDomain3D(activeDomainMeta.id)}
                  className="group sim-btn-phy sim-btn-hero sim-btn-active flex items-center gap-1.5 px-3.5 py-1.5 rounded-[3px] border border-amber-300/70 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
                >
                  <span className="icon-anim-3d-cube">
                    <Box className="w-3.5 h-3.5" />
                  </span>
                  <span>Sang Mô phỏng 3D · {activeDomainMeta.shortName}</span>
                </button>
                <button
                  onClick={() => {
                    const targetLesson = PHYSICS_LESSONS.find((l) => l.id === active2DSpec.linkedLessonId) || lesson;
                    handleOpenLesson(targetLesson, 'theory');
                  }}
                  className="group sim-btn-phy sim-btn-hero flex items-center gap-1.5 px-3.5 py-1.5 rounded-[3px] text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 hover:bg-blue-100 cursor-pointer"
                >
                  <span className="icon-anim-book">
                    <BookOpen className="w-3.5 h-3.5" />
                  </span>
                  <span>Mở Bài Giảng Liên Quan</span>
                </button>
              </div>
            </div>

            {/* Domain Switcher Tabs (Each opens its own separate domain 2D page) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-800">
              {PHYSICS_DOMAINS.map((dom) => {
                const isSelected = dom.id === activeDomainMeta.id;
                return (
                  <button
                    key={dom.id}
                    onClick={() => openDomain2D(dom.id)}
                    className={`sim-btn-phy px-3 py-1.5 rounded-[3px] text-xs font-bold border cursor-pointer ${
                      isSelected
                        ? `sim-btn-active ${dom.bgActiveClass}`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && <span className="sim-led-square mr-1.5 align-middle" />}
                    {dom.shortName} ({get2DSimsByDomain(dom.id).length})
                  </button>
                );
              })}
            </div>

            {/* Horizontal Simulation Selector scoped ONLY to activeDomainMeta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {activeDomain2DSims.map((spec) => {
                const isActiveSim = spec.id === active2DSpec.id;
                return (
                  <button
                    key={spec.id}
                    onClick={() => openDomain2D(activeDomainMeta.id, spec.id)}
                    className={`group sim-btn-tile sim-btn-phy text-left p-3 rounded-[3px] border cursor-pointer space-y-1 ${
                      isActiveSim
                        ? 'sim-btn-active bg-blue-600 text-white border-sky-300 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400'
                    }`}
                  >
                    <div className={`text-[10px] font-mono font-bold ${isActiveSim ? 'text-sky-100' : 'text-blue-600 dark:text-blue-400'}`}>
                      {spec.grades.join(' · ')}
                    </div>
                    <div className="text-xs font-extrabold leading-snug">{spec.title}</div>
                    <div className={`text-[10px] font-mono truncate ${isActiveSim ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {spec.formula}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dedicated 2D Interactive Lab Canvas Stage */}
          <ViewportPortal active={isSimFullscreen}>
            <div
              className={
                isSimFullscreen
                  ? 'sim-physics-scope fixed inset-0 z-[100] h-[100dvh] w-screen p-3 sm:p-5 bg-slate-100/98 dark:bg-slate-950/98 flex flex-col gap-4 overflow-y-auto'
                  : 'space-y-4'
              }
            >
              {/* Top Lab Controls + Formula */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 dark:bg-slate-900/95 p-3 rounded-[4px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs shrink-0">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {active2DSpec.title} · <span className="font-mono text-blue-600 dark:text-blue-400">{active2DSpec.formula}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {active2DSpec.subtitle}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {activePresets.map((pr) => (
                    <button
                      key={pr.label}
                      type="button"
                      onClick={() => setParams({ ...activeDefaultParams, ...pr.params })}
                      title={pr.description}
                      className="hidden md:inline-flex sim-btn-phy px-2.5 py-1.5 rounded-[3px] text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700 cursor-pointer"
                    >
                      {pr.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsSimFullscreen(!isSimFullscreen)}
                    className="sim-btn-phy sim-btn-hero flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] border border-sky-400/60 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  >
                    {isSimFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    <span>{isSimFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white/95 dark:bg-slate-900/95 rounded-[4px] border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
                    {/* Transport & Stopwatch Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-800/50">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => setIsRunning(!isRunning)}
                          className={`sim-btn-phy sim-btn-hero sim-btn-active flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] border text-xs font-bold cursor-pointer ${
                            isRunning
                              ? 'bg-amber-500 border-amber-300 text-slate-950 hover:bg-amber-400'
                              : 'bg-emerald-600 border-emerald-400 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isRunning ? 'Tạm dừng' : 'Chạy tiếp'}</span>
                        </button>
                        <button
                          onClick={handleStepOnce}
                          className="sim-btn-phy flex items-center gap-1 px-2.5 py-1.5 rounded-[3px] text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                        >
                          <StepForward className="w-3.5 h-3.5 text-blue-500" />
                          <span>+0.05s</span>
                        </button>
                        <button
                          onClick={handleResetSim}
                          className="sim-btn-phy p-1.5 rounded-[3px] bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1 ml-1 text-xs">
                          {[0.25, 0.5, 1.0, 2.0].map((spd) => (
                            <button
                              key={spd}
                              onClick={() => setSimSpeed(spd)}
                              className={`sim-btn-phy px-2 py-1 rounded-[3px] border text-[11px] font-mono cursor-pointer ${
                                simSpeed === spd
                                  ? 'sim-btn-active bg-blue-600 border-sky-400 text-white font-bold'
                                  : 'bg-slate-200/80 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {spd}x
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-100 min-w-[54px]">
                            {stopwatchElapsed.toFixed(2)}s
                          </span>
                          <button
                            onClick={() => setStopwatchRunning(!stopwatchRunning)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              stopwatchRunning
                                ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                                : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {stopwatchRunning ? 'Dừng' : 'Bấm'}
                          </button>
                          <button
                            onClick={() => {
                              setStopwatchRunning(false);
                              stopwatchAccumRef.current = 0;
                              setStopwatchElapsed(0);
                            }}
                            className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500"
                          >
                            0
                          </button>
                        </div>
                        <button
                          onClick={handleLogSample}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Ghi mẫu đo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCodeCompilerOpen(true)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-500 transition-colors cursor-pointer"
                          title="Dịch ngược mô hình sang Phương trình Vi phân & Code Python/C++"
                        >
                          <FileCode2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Code RK4</span>
                        </button>
                      </div>
                    </div>

                    {/* Overlays & Experiment Actions Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 text-[11px]">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 mr-0.5">Hiển thị:</span>
                        <button
                          onClick={() => setOverlays((o) => ({ ...o, showRulerGrid: !o.showRulerGrid }))}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold border ${
                            overlays.showRulerGrid
                              ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                          }`}
                        >
                          <Grid className="w-3 h-3" />
                          <span>Lưới &amp; Thước</span>
                        </button>
                        <button
                          onClick={() => setOverlays((o) => ({ ...o, showVectors: !o.showVectors }))}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold border ${
                            overlays.showVectors
                              ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                          }`}
                        >
                          <Compass className="w-3 h-3" />
                          <span>Vectơ</span>
                        </button>
                        <button
                          onClick={() => setOverlays((o) => ({ ...o, showTrace: !o.showTrace }))}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold border ${
                            overlays.showTrace
                              ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>Quỹ đạo</span>
                        </button>
                        <button
                          onClick={() => setOverlays((o) => ({ ...o, showRealtimeChart: !o.showRealtimeChart }))}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold border ${
                            overlays.showRealtimeChart
                              ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                          }`}
                        >
                          <Activity className="w-3 h-3" />
                          <span>Biểu đồ</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {activeSimType === 'ohm_circuit' && (
                          <>
                            <button
                              onClick={() => setLabFlags((f) => ({ ...f, circuitOpen: !f.circuitOpen }))}
                              className={`px-2.5 py-1 rounded-md font-bold ${
                                labFlags.circuitOpen ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {labFlags.circuitOpen ? 'Khóa K: MỞ' : 'Khóa K: ĐÓNG'}
                            </button>
                            <button
                              onClick={() => setLabFlags((f) => ({ ...f, reversePolarity: !f.reversePolarity }))}
                              className="flex items-center gap-1 px-2 py-1 rounded-md font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>Đảo cực</span>
                            </button>
                            <button
                              onClick={() => setLabFlags((f) => ({ ...f, showVoltmeter: !f.showVoltmeter }))}
                              className={`px-2 py-1 rounded-md font-semibold border ${
                                labFlags.showVoltmeter
                                  ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                              }`}
                            >
                              Vôn kế R1
                            </button>
                          </>
                        )}
                        {activeSimType === 'lens_optics' && (
                          <>
                            <button
                              onClick={() => setLabFlags((f) => ({ ...f, isDiverging: !f.isDiverging }))}
                              className={`px-2.5 py-1 rounded-md font-bold ${labFlags.isDiverging ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}
                            >
                              {labFlags.isDiverging ? 'TK Phân kì' : 'TK Hội tụ'}
                            </button>
                            <button
                              onClick={() => setLabFlags((f) => ({ ...f, showThirdRay: !f.showThirdRay }))}
                              className="px-2 py-1 rounded-md font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                            >
                              Tia qua F
                            </button>
                          </>
                        )}
                        {(activeSimType === 'projectile_motion' || activeSimType === 'free_fall_energy') && (
                          <button
                            onClick={() => setLabFlags((f) => ({ ...f, airDrag: !f.airDrag }))}
                            className={`px-2.5 py-1 rounded-md font-bold ${
                              labFlags.airDrag ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {labFlags.airDrag ? 'Lực cản KK: BẬT' : 'Lực cản KK: TẮT'}
                          </button>
                        )}
                        {(activeSimType === 'spring_pendulum' || activeSimType === 'simple_pendulum') && (
                          <button
                            onClick={() => setLabFlags((f) => ({ ...f, hasFriction: !f.hasFriction }))}
                            className={`px-2.5 py-1 rounded-md font-bold ${
                              labFlags.hasFriction ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {labFlags.hasFriction ? 'Ma sát: BẬT' : 'Lí tưởng'}
                          </button>
                        )}
                        {activeSimType === 'wave_interference' && (
                          <>
                            <button
                              onClick={() => setLabFlags((f) => ({ ...f, singleSource: !f.singleSource }))}
                              className="px-2.5 py-1 rounded-md font-bold bg-blue-600 text-white"
                            >
                              {labFlags.singleSource ? '1 Nguồn' : '2 Nguồn'}
                            </button>
                            <button
                              onClick={() => setLabFlags((f) => ({ ...f, showNodalLines: !f.showNodalLines }))}
                              className="px-2 py-1 rounded-md font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            >
                              Đường cực đại
                            </button>
                          </>
                        )}
                        {activeSimType === 'magnetic_induction' && (
                          <button
                            onClick={() => setLabFlags((f) => ({ ...f, flipMagnet: !f.flipMagnet }))}
                            className="flex items-center gap-1 px-2 py-1 rounded-md font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            <span>Đảo cực N-S</span>
                          </button>
                        )}
                        {activeSimType === 'electric_field' && (
                          <button
                            onClick={() => setLabFlags((f) => ({ ...f, showFieldGrid: !f.showFieldGrid }))}
                            className="px-2.5 py-1 rounded-md font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          >
                            Lưới E
                          </button>
                        )}
                        {activeSimType === 'nuclear_decay' && (
                          <button
                            onClick={() => {
                              const T = Math.max(0.2, params.halfLife ?? 4.0);
                              simTimeRef.current += T;
                              forceTelemetrySyncRef.current = true;
                            }}
                            className="px-2.5 py-1 rounded-md font-bold bg-amber-600 text-white"
                          >
                            +1 Chu kì T
                          </button>
                        )}
                        {activeSimType === 'ac_rlc_circuit' && (
                          <button
                            onClick={() => {
                              const L = Math.max(0.05, params.indL ?? 0.3);
                              const C_uF = Math.max(5, params.capC ?? 40);
                              const fRes = 1 / (2 * Math.PI * Math.sqrt(L * C_uF * 1e-6));
                              setParams((prev) => ({ ...prev, freq: Number(fRes.toFixed(1)) }));
                            }}
                            className="px-2.5 py-1 rounded-md font-bold bg-emerald-600 text-white"
                          >
                            Cộng hưởng
                          </button>
                        )}
                        {activeSimType === 'standing_wave' && (
                          <button
                            onClick={() =>
                              setParams((prev) => ({ ...prev, openEnd: Math.round(prev.openEnd ?? 0) === 1 ? 0 : 1 }))
                            }
                            className="px-2.5 py-1 rounded-md font-bold bg-blue-600 text-white"
                          >
                            {Math.round(params.openEnd ?? 0) === 1 ? '1 đầu tự do' : '2 đầu cố định'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900/95">
                      <PhysicsApparatusWorkbench
                        dimension="2d"
                        simId={activeSimType}
                        domainId={activeDomainMeta.id}
                        simParams={params}
                        simTimeRef={simTimeRef}
                        stageClassName={`relative w-full bg-slate-950 rounded-md overflow-hidden ${isSimFullscreen ? 'h-[280px] sm:h-[450px] lg:h-[500px]' : 'h-[300px] sm:h-[400px]'}`}
                      >
                        <canvas ref={canvasRef} className="w-full h-full block" />
                      </PhysicsApparatusWorkbench>
                    </div>

                    <LabTimeMachineBar
                      simKey={`hub-${activeSimType}`}
                      canvasRef={canvasRef}
                      isRunning={isRunning}
                      onSetRunning={setIsRunning}
                      simSpeed={simSpeed}
                      onSetSimSpeed={setSimSpeed}
                      simTimeRef={simTimeRef}
                    />

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-md border border-slate-200/60 dark:border-slate-800/60">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{telemetry.metric1Label}</div>
                        <div className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5">{telemetry.metric1Val}</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-md border border-slate-200/60 dark:border-slate-800/60">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{telemetry.metric2Label}</div>
                        <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{telemetry.metric2Val}</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-md border border-slate-200/60 dark:border-slate-800/60">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{telemetry.metric3Label}</div>
                        <div className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">{telemetry.metric3Val}</div>
                      </div>
                    </div>

                    <div className="px-4 py-2.5 bg-blue-50/50 dark:bg-blue-950/20 border-t border-blue-100 dark:border-blue-900/30 text-xs text-blue-800 dark:text-blue-300 font-medium flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                      <span><FormattedText text={telemetry.note} /></span>
                    </div>
                  </div>

                  {dataLogs.length > 0 && (
                    <LabDataLoggerPanel
                      title={lesson?.title || active2DSpec?.title || 'Thí nghiệm Vật lí'}
                      rows={dataLogs}
                      onClear={() => setDataLogs([])}
                    />
                  )}
                </div>

                {/* Numeric Parameters Panel */}
                <div className="space-y-4">
                  <div className="bg-white/95 dark:bg-slate-900/95 rounded-lg p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Tham Số Thí Nghiệm
                        </h3>
                      </div>
                      <button
                        onClick={() => setParams(activeDefaultParams)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        Mặc định
                      </button>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(activeParamBounds).map(([paramKey, bound]) => {
                        const curVal = params[paramKey] ?? activeDefaultParams[paramKey] ?? bound.min;
                        if (paramKey === 'circuitType') {
                          return (
                            <div key={paramKey} className="space-y-1.5 bg-slate-50/80 dark:bg-slate-800/40 p-2.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                              <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{bound.label}</div>
                              <div className="grid grid-cols-2 gap-1.5">
                                {[{ v: 0, label: 'Mắc Nối Tiếp' }, { v: 1, label: 'Mắc Song Song' }].map((opt) => (
                                  <button
                                    key={opt.v}
                                    type="button"
                                    onClick={() => setParams((prev) => ({ ...prev, [paramKey]: opt.v }))}
                                    className={`py-1.5 rounded-md text-xs font-bold transition-colors ${
                                      Math.round(curVal) === opt.v
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        if (paramKey === 'vizMode') {
                          return (
                            <div key={paramKey} className="space-y-1.5 bg-slate-50/80 dark:bg-slate-800/40 p-2.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                              <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{bound.label}</div>
                              <div className="grid grid-cols-3 gap-1">
                                {[{ v: 0, label: 'Vectơ' }, { v: 1, label: 'Đồ thị d-t' }, { v: 2, label: 'Đồ thị v-t' }].map((opt) => (
                                  <button
                                    key={opt.v}
                                    type="button"
                                    onClick={() => setParams((prev) => ({ ...prev, [paramKey]: opt.v }))}
                                    className={`py-1.5 rounded-md text-[11px] font-bold transition-colors ${
                                      Math.round(curVal) === opt.v
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        if (paramKey === 'modeCharge' || paramKey === 'convexMode' || paramKey === 'processType') {
                          const opts =
                            paramKey === 'modeCharge'
                              ? [
                                  { v: 1, label: 'Nạp tụ (Charge)' },
                                  { v: 0, label: 'Xả tụ (Discharge)' }
                                ]
                              : paramKey === 'convexMode'
                              ? [
                                  { v: 0, label: 'Gương cầu Lõm' },
                                  { v: 1, label: 'Gương cầu Lồi' }
                                ]
                              : [
                                  { v: 0, label: 'Đẳng nhiệt' },
                                  { v: 1, label: 'Đẳng áp' },
                                  { v: 2, label: 'Đẳng tích' }
                                ];
                          return (
                            <div key={paramKey} className="space-y-1.5 bg-slate-50/80 dark:bg-slate-800/40 p-2.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                              <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                {bound.label}
                              </div>
                              <div className={`grid gap-1 ${opts.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                                {opts.map((opt) => (
                                  <button
                                    key={opt.v}
                                    type="button"
                                    onClick={() => setParams((prev) => ({ ...prev, [paramKey]: opt.v }))}
                                    className={`py-1.5 rounded-md text-[11px] font-bold transition-colors ${
                                      Math.round(curVal) === opt.v
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <NumericParamField
                            key={paramKey}
                            label={bound.label}
                            unit={bound.unit}
                            value={curVal}
                            min={bound.min}
                            max={bound.max}
                            step={bound.step}
                            onChange={(nextVal) =>
                              setParams((prev) => ({
                                ...prev,
                                [paramKey]: nextVal
                              }))
                            }
                          />
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
                      <button
                        onClick={() => {
                          setIsSimFullscreen(false);
                          const targetLesson = PHYSICS_LESSONS.find((l) => l.id === active2DSpec.linkedLessonId) || lesson;
                          handleOpenLesson(targetLesson, 'practice');
                        }}
                        className="w-full py-2.5 rounded-md bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Làm Bài Tập Lĩnh Vực Này (+25 XP)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ViewportPortal>
        </div>
      )}

      {/* ============================================================ */}
      {/* STANDALONE SEPARATE DOMAIN PAGE: MÔ PHỎNG 3D (GRADES 9–12)   */}
      {/* ============================================================ */}
      {is3DHub && active3DSpec && (
        <div className="sim-physics-scope space-y-4">
          <div className="sci-frame bg-white/95 dark:bg-slate-900/95 rounded-[4px] p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => navigate({ physicsView: 'catalog' })}
                  className="group sim-btn-phy flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Tất cả Vật Lí</span>
                </button>
                <span className={`px-2.5 py-1 rounded-[3px] text-[11px] font-bold border ${activeDomainMeta.accentBadgeClass}`}>
                  Mô phỏng 3D · {activeDomainMeta.name} ({activeDomainMeta.grades})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => openDomain2D(activeDomainMeta.id)}
                  className="group sim-btn-phy sim-btn-hero sim-btn-active flex items-center gap-1.5 px-3.5 py-1.5 rounded-[3px] border border-sky-400/70 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <span className="icon-anim-zap">
                    <Zap className="w-3.5 h-3.5" />
                  </span>
                  <span>Sang Mô phỏng 2D · {activeDomainMeta.shortName}</span>
                </button>
                <button
                  onClick={() => {
                    const targetLesson = PHYSICS_LESSONS.find((l) => l.id === active3DSpec.linkedLessonId) || lesson;
                    handleOpenLesson(targetLesson, 'theory');
                  }}
                  className="group sim-btn-phy sim-btn-hero flex items-center gap-1.5 px-3.5 py-1.5 rounded-[3px] text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 cursor-pointer"
                >
                  <span className="icon-anim-book">
                    <BookOpen className="w-3.5 h-3.5" />
                  </span>
                  <span>Mở Bài Giảng Liên Quan</span>
                </button>
              </div>
            </div>

            {/* Domain Switcher Tabs (Each opens its own separate domain 3D page) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-800">
              {PHYSICS_DOMAINS.map((dom) => {
                const isSelected = dom.id === activeDomainMeta.id;
                return (
                  <button
                    key={dom.id}
                    onClick={() => openDomain3D(dom.id)}
                    className={`sim-btn-phy px-3 py-1.5 rounded-[3px] text-xs font-bold border cursor-pointer ${
                      isSelected
                        ? `sim-btn-active ${dom.bgActiveClass}`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && <span className="sim-led-square mr-1.5 align-middle" />}
                    {dom.shortName} ({get3DSimsByDomain(dom.id).length})
                  </button>
                );
              })}
            </div>

            {/* Simulation 3D Cards scoped ONLY to activeDomainMeta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {activeDomain3DSims.map((spec) => {
                const isActive3D = spec.id === active3DSpec.id;
                return (
                  <button
                    key={spec.id}
                    onClick={() => openDomain3D(activeDomainMeta.id, spec.id)}
                    className={`group sim-btn-tile sim-btn-tile-amber sim-btn-phy text-left p-3 rounded-[3px] border cursor-pointer space-y-1 ${
                      isActive3D
                        ? 'sim-btn-active bg-amber-500 text-slate-950 border-amber-300 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 border-slate-200/80 dark:border-slate-700/80 hover:border-amber-400'
                    }`}
                  >
                    <div className={`text-[10px] font-mono font-bold ${isActive3D ? 'text-slate-900' : 'text-amber-600 dark:text-amber-400'}`}>
                      {spec.grades.join(' · ')}
                    </div>
                    <div className="text-xs font-extrabold leading-snug">{spec.title}</div>
                    <div className={`text-[10px] font-mono truncate ${isActive3D ? 'text-slate-800' : 'text-slate-500 dark:text-slate-400'}`}>
                      {spec.formula}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Physics3DView
            initialMode={active3DSpec.id}
            allowedModes={activeDomain3DSims.map((s) => s.id)}
            domainTitle={activeDomainMeta.shortName}
            onSelectMode={(nextMode) => navigate({ physicsSim3D: nextMode })}
            onBack={goBack}
          />
        </div>
      )}

      {/* VIEW 4: PRACTICE EXERCISES (MCQ + ESSAY - VIETJACK / LOIGIAIHAY STYLE) */}
      {activeView === 'lecture' && activeTab === 'practice' && (
        <div className="space-y-8">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Bài Tập Trắc Nghiệm &amp; Tự Luận Có Lời Giải Chi Tiết
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Biên soạn chuẩn SGK (VietJack / Loigiaihay). Mỗi câu trắc nghiệm đúng nhận ngay +25 XP!
                </p>
              </div>
            </div>
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>
          </div>

          {/* SECTION A: MULTIPLE CHOICE */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Phần A · Trắc Nghiệm Củng Cố ({lesson.practiceExercises.length} câu)
              </h4>
            </div>

            {lesson.practiceExercises.map((ex, exIdx) => {
              const exKey = `${lesson.id}-ex-${exIdx}`;
              const selectedOpt = userAnswers[exKey];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === ex.correctIndex;
              const isRevealed = revealedSolutions[exKey] || isAnswered;

              return (
                <div
                  key={exKey}
                  className="bg-white/95 dark:bg-slate-900/95 rounded-lg p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4"
                >
                  <div className="space-y-1.5">
                    {ex.source && (
                      <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                        {ex.source}
                      </div>
                    )}
                    <div className="flex items-start gap-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold shrink-0">
                        Câu {exIdx + 1}
                      </span>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                        <FormattedText text={ex.question} />
                      </div>
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {ex.options.map((opt, optIdx) => {
                      let btnStyle =
                        'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300';

                      if (isAnswered) {
                        if (optIdx === ex.correctIndex) {
                          btnStyle =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold';
                        } else if (optIdx === selectedOpt) {
                          btnStyle =
                            'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 line-through';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleAnswer(exKey, optIdx, ex.correctIndex)}
                          className={`p-3.5 rounded-md border text-left text-xs font-medium transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span><FormattedText text={opt} /></span>
                          {isAnswered && optIdx === ex.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                          )}
                          {isAnswered && optIdx === selectedOpt && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Solution Accordion */}
                  <div className="pt-1">
                    <button
                      onClick={() =>
                        setRevealedSolutions((prev) => ({
                          ...prev,
                          [exKey]: !prev[exKey]
                        }))
                      }
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>
                        {revealedSolutions[exKey]
                          ? 'Ẩn lời giải chi tiết'
                          : 'Xem lời giải chi tiết & Phân tích đáp án'}
                      </span>
                    </button>

                    {isRevealed && (
                      <div className="mt-3 p-4 rounded-md bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300 flex-wrap">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>
                            {t('physics.correct_ans', 'Đáp án đúng:', 'Correct answer:')}{' '}
                            <FormattedText text={ex.options[ex.correctIndex]} />
                          </span>
                        </div>
                        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                          <FormattedText text={ex.explanation} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SECTION B: ESSAY EXERCISES (TỰ LUẬN) */}
          {lesson.essayExercises && lesson.essayExercises.length > 0 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Phần B · Bài Tập Tự Luận Giải Chi Tiết ({lesson.essayExercises.length} bài)
                </h4>
              </div>

              {lesson.essayExercises.map((essay, eIdx) => {
                const essayKey = `${lesson.id}-essay-${eIdx}`;
                const hintOpen = !!revealedEssayHints[essayKey];
                const solOpen = !!revealedEssaySolutions[essayKey];

                return (
                  <div
                    key={essayKey}
                    className="bg-white/95 dark:bg-slate-900/95 rounded-lg p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4"
                  >
                    <div className="space-y-1.5">
                      {essay.source && (
                        <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          {essay.source}
                        </div>
                      )}
                      <div className="flex items-start gap-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold shrink-0">
                          Bài {eIdx + 1}
                        </span>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                          <FormattedText text={essay.question} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {essay.hints && essay.hints.length > 0 && (
                        <button
                          onClick={() =>
                            setRevealedEssayHints((prev) => ({ ...prev, [essayKey]: !prev[essayKey] }))
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-100 transition-colors"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{hintOpen ? 'Ẩn gợi ý' : 'Xem gợi ý hướng giải'}</span>
                        </button>
                      )}

                      <button
                        onClick={() =>
                          setRevealedEssaySolutions((prev) => ({ ...prev, [essayKey]: !prev[essayKey] }))
                        }
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{solOpen ? 'Thu gọn bài giải' : 'Xem lời giải chi tiết từng bước'}</span>
                      </button>
                    </div>

                    {hintOpen && essay.hints && (
                      <div className="p-3.5 rounded-md bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/70 dark:border-amber-900/50 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                        <div className="font-bold">Gợi ý phương pháp:</div>
                        {essay.hints.map((h, i) => (
                          <div key={i}><FormattedText text={h} /></div>
                        ))}
                      </div>
                    )}

                    {solOpen && (
                      <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 text-xs">
                        <div className="font-bold text-emerald-700 dark:text-emerald-300 text-xs uppercase tracking-wide">
                          Bài giải tham khảo chi tiết
                        </div>
                        <div className="space-y-2 text-slate-700 dark:text-slate-200 leading-relaxed">
                          {essay.solutionSteps.map((step, sIdx) => (
                            <div key={sIdx} className="p-2.5 rounded-md bg-white/80 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-700/60">
                              <FormattedText text={step} />
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                          Đáp số: <FormattedText text={essay.finalAnswer} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <SimToCodeModal
        isOpen={isCodeCompilerOpen}
        onClose={() => setIsCodeCompilerOpen(false)}
        simId={activeSimType}
        simTitle={activeSimTitle}
        params={params}
      />
    </div>
  );
};
