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
import { renderPhysics2DSimulation } from './physics2DEngine';
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

      renderPhysics2DSimulation({
        simType: activeSimType,
        ctx,
        w,
        h,
        t,
        isDark,
        isRunning: isRunningRef.current,
        params: paramsRef.current,
        flags: labFlagsRef.current,
        overlays: curOverlays,
        oscHistory: oscHistoryRef.current,
        pushTelemetry
      });

      ctx.restore();
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObs?.disconnect();
      classObs.disconnect();
    };
  }, [activeView, activeTab, activeSimType, isSimFullscreen]);


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
              physicsLesson={lesson}
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
