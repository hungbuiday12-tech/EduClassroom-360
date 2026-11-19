import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bell,
  Clock,
  Coffee,
  Download,
  Eraser,
  Maximize2,
  Music,
  Pause,
  PenTool,
  Play,
  Plus,
  RotateCcw,
  StickyNote,
  Trash2,
  Undo2,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Flame,
  GripVertical,
  PinOff
} from 'lucide-react';
import { useFocusTimer, STUDY_FORMAT_PRESETS } from '../../context/FocusTimerContext';
import { useAudio } from '../../context/AudioContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { BELL_SOUND_OPTIONS, BG_SOUND_OPTIONS, BellSoundId, BgSoundId } from '../../lib/soundEngine';
import { useDraggableWidget } from '../../hooks/useDraggableWidget';
import { InfiniteStemCanvas } from '../future/InfiniteStemCanvas';
import { InfiniteCanvasNode } from '../../types';
import { FormattedText } from './MathRenderer';

type DockMode = 'focus' | 'scratchpad';

interface MiniStrokePoint {
  x: number;
  y: number;
}

interface MiniStroke {
  color: string;
  size: number;
  isEraser: boolean;
  points: MiniStrokePoint[];
}

const SCRATCH_STROKES_KEY = 'synapse_mini_scratchpad_strokes_v1';
const INFINITE_CANVAS_KEY = 'synapse_infinite_canvas_v1';

const PEN_COLORS = [
  { id: 'cyan', hex: '#38bdf8', label: 'Cyan' },
  { id: 'amber', hex: '#fbbf24', label: 'Amber' },
  { id: 'emerald', hex: '#34d399', label: 'Emerald' },
  { id: 'rose', hex: '#fb7185', label: 'Rose' },
  { id: 'white', hex: '#f8fafc', label: 'White' }
];

function formatClock(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const FloatingFocusTimer: React.FC = () => {
  const { location } = useNavigation();
  const isMobileSimOrExamRoute =
    ['math_sims', 'physics_sims', 'cs_sims', 'synapse_v2', 'future_lab', 'spatial_3d', 'exams', 'arena'].includes(
      location.subject
    ) ||
    (location.subject === 'physics' && location.physicsView !== 'catalog') ||
    (location.subject === 'cs' && location.csViewMode === 'visualizer');
  const { language } = useLanguage();
  const isEn = language === 'en';
  const {
    studyFormat,
    setStudyFormat,
    customFocusMinutes,
    setCustomFocusMinutes,
    customBreakMinutes,
    setCustomBreakMinutes,
    phase,
    switchPhase,
    timeLeft,
    totalDuration,
    isRunning,
    startPause,
    resetTimer,
    completedSessions,
    alarmRinging,
    dismissAlarm,
    isWidgetOpen,
    setIsWidgetOpen
  } = useFocusTimer();

  const {
    bellSound,
    setBellSound,
    playBell,
    bgSound,
    setBgSound,
    bgVolume,
    setBgVolume,
    isBgPlaying,
    toggleBgPlaying
  } = useAudio();

  const [dockMode, setDockMode] = useState<DockMode>('focus');
  const [isFullscreenCanvas, setIsFullscreenCanvas] = useState(false);

  // Mini Scratchpad Drawing State
  const padCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingActiveRef = useRef(false);
  const currentStrokeRef = useRef<MiniStroke | null>(null);
  const [penColor, setPenColor] = useState<string>('#38bdf8');
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [strokes, setStrokes] = useState<MiniStroke[]>(() => {
    try {
      const raw = localStorage.getItem(SCRATCH_STROKES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Quick Sticky Notes / Formulas synced with Bảng Vô Cực STEM
  const [quickNoteText, setQuickNoteText] = useState('');
  const [syncedNotes, setSyncedNotes] = useState<InfiniteCanvasNode[]>(() => {
    try {
      const raw = localStorage.getItem(INFINITE_CANVAS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.nodes)) {
          return parsed.nodes.filter(
            (n: InfiniteCanvasNode) => n.kind === 'note' || n.kind === 'formula'
          );
        }
      }
    } catch {}
    return [];
  });

  const refreshSyncedNotes = useCallback(() => {
    try {
      const raw = localStorage.getItem(INFINITE_CANVAS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.nodes)) {
          setSyncedNotes(
            parsed.nodes.filter(
              (n: InfiniteCanvasNode) => n.kind === 'note' || n.kind === 'formula'
            )
          );
        }
      }
    } catch {}
  }, []);

  // Listen for custom global events to open Bảng Nháp Mini-Chat or Fullscreen Canvas
  useEffect(() => {
    const onOpenScratchpad = (ev: Event) => {
      const detail = (ev as CustomEvent<{ fullscreen?: boolean }>).detail;
      if (detail?.fullscreen) {
        setIsFullscreenCanvas(true);
        return;
      }
      setDockMode('scratchpad');
      setIsWidgetOpen(true);
      refreshSyncedNotes();
    };
    window.addEventListener('synapse:open-scratchpad-mini', onOpenScratchpad);
    return () => window.removeEventListener('synapse:open-scratchpad-mini', onOpenScratchpad);
  }, [refreshSyncedNotes, setIsWidgetOpen]);

  // Persist mini strokes
  useEffect(() => {
    try {
      localStorage.setItem(SCRATCH_STROKES_KEY, JSON.stringify(strokes.slice(-160)));
    } catch {}
  }, [strokes]);

  const redrawPad = useCallback((extraStroke?: MiniStroke | null) => {
    const canvas = padCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#071122';
    ctx.fillRect(0, 0, w, h);

    // Subtle blueprint grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 20; x < w; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 20; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const list = extraStroke ? [...strokes, extraStroke] : strokes;
    for (const st of list) {
      if (st.points.length === 0) continue;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = st.isEraser ? '#071122' : st.color;
      ctx.lineWidth = st.size;
      ctx.beginPath();
      ctx.moveTo(st.points[0].x, st.points[0].y);
      if (st.points.length === 1) {
        ctx.lineTo(st.points[0].x + 0.5, st.points[0].y + 0.5);
      } else {
        for (let i = 1; i < st.points.length; i += 1) {
          ctx.lineTo(st.points[i].x, st.points[i].y);
        }
      }
      ctx.stroke();
      ctx.restore();
    }
  }, [strokes]);

  useEffect(() => {
    if (isWidgetOpen && dockMode === 'scratchpad') {
      const id = window.requestAnimationFrame(() => redrawPad(null));
      return () => window.cancelAnimationFrame(id);
    }
  }, [isWidgetOpen, dockMode, redrawPad]);

  const getPadCoords = (e: React.PointerEvent<HTMLCanvasElement>): MiniStrokePoint => {
    const canvas = padCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / Math.max(1, rect.width)) * canvas.width,
      y: ((e.clientY - rect.top) / Math.max(1, rect.height)) * canvas.height
    };
  };

  const handlePadPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getPadCoords(e);
    drawingActiveRef.current = true;
    const nextStroke: MiniStroke = {
      color: penColor,
      size: isEraser ? 14 : 2.6,
      isEraser,
      points: [pt]
    };
    currentStrokeRef.current = nextStroke;
    redrawPad(nextStroke);
  };

  const handlePadPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingActiveRef.current || !currentStrokeRef.current) return;
    const pt = getPadCoords(e);
    currentStrokeRef.current.points.push(pt);
    redrawPad(currentStrokeRef.current);
  };

  const handlePadPointerUp = () => {
    if (!drawingActiveRef.current) return;
    drawingActiveRef.current = false;
    const finished = currentStrokeRef.current;
    currentStrokeRef.current = null;
    if (finished && finished.points.length > 0) {
      setStrokes((prev) => [...prev, finished]);
    }
  };

  const handleSavePadPng = () => {
    const canvas = padCanvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `synapse-bang-nhap-${Date.now()}.png`;
    a.click();
  };

  const handleAddQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    const content = quickNoteText.trim();
    if (!content) return;
    setQuickNoteText('');
    try {
      const raw = localStorage.getItem(INFINITE_CANVAS_KEY);
      const parsed = raw ? JSON.parse(raw) : { nodes: [], edges: [] };
      const existingNodes: InfiniteCanvasNode[] = Array.isArray(parsed?.nodes)
        ? parsed.nodes
        : [];
      const existingEdges = Array.isArray(parsed?.edges) ? parsed.edges : [];
      const hasMath = /\$|\\frac|\\sqrt|=/.test(content);
      const newNode: InfiniteCanvasNode = {
        id: `n_mini_${Date.now()}`,
        kind: hasMath ? 'formula' : 'note',
        x: 80 + ((existingNodes.length * 45) % 340),
        y: 80 + ((existingNodes.length * 35) % 240),
        width: 260,
        title: hasMath
          ? isEn ? 'Quick Formula' : 'Công thức nháp nhanh'
          : isEn ? 'Quick Note' : 'Ghi chú nháp nhanh',
        accent: hasMath ? 'sky' : 'amber',
        content
      };
      const nextNodes = [...existingNodes, newNode];
      localStorage.setItem(
        INFINITE_CANVAS_KEY,
        JSON.stringify({ nodes: nextNodes, edges: existingEdges })
      );
      setSyncedNotes(
        nextNodes.filter((n) => n.kind === 'note' || n.kind === 'formula')
      );
    } catch {}
  };

  const handleDeleteSyncedNote = (id: string) => {
    try {
      const raw = localStorage.getItem(INFINITE_CANVAS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const nextNodes: InfiniteCanvasNode[] = (parsed?.nodes || []).filter(
        (n: InfiniteCanvasNode) => n.id !== id
      );
      const nextEdges = (parsed?.edges || []).filter(
        (ed: { fromId: string; toId: string }) => ed.fromId !== id && ed.toId !== id
      );
      localStorage.setItem(
        INFINITE_CANVAS_KEY,
        JSON.stringify({ nodes: nextNodes, edges: nextEdges })
      );
      setSyncedNotes(
        nextNodes.filter((n) => n.kind === 'note' || n.kind === 'formula')
      );
    } catch {}
  };

  const activePreset = STUDY_FORMAT_PRESETS.find((p) => p.id === studyFormat) || STUDY_FORMAT_PRESETS[0];
  const progressRatio = totalDuration > 0 ? Math.max(0, Math.min(1, timeLeft / totalDuration)) : 0;
  const ringRadius = 40;
  const ringCircumference = 2 * Math.PI * ringRadius;

  const {
    containerRef,
    position,
    isDragging,
    isCustomPositioned,
    isRightHalf,
    isBottomHalf,
    handleDragStart,
    consumeDidDrag,
    resetPosition
  } = useDraggableWidget({ storageKey: 'synapse_widget_pos_focus_v1' });

  const openOrToggleMode = (target: DockMode) => {
    if (consumeDidDrag()) return;
    if (isWidgetOpen && dockMode === target) {
      setIsWidgetOpen(false);
    } else {
      setDockMode(target);
      setIsWidgetOpen(true);
      if (target === 'scratchpad') refreshSyncedNotes();
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        style={position ? { left: `${position.x}px`, top: `${position.y}px` } : undefined}
        className={`fixed z-[85] ${
          isMobileSimOrExamRoute ? 'hidden lg:block' : ''
        } ${
          position
            ? ''
            : 'bottom-[74px] left-3 sm:left-4 lg:bottom-5 lg:left-[calc(var(--sidebar-w,248px)+16px)] transition-[left] duration-200'
        }`}
      >
        {/* Combined Mini-Chat Drawer (Focus Studio OR Bảng Nháp STEM) */}
        {isWidgetOpen && (
          <div
            className={`sci-frame syn-window-enter absolute z-20 ${
              isBottomHalf ? 'bottom-full mb-2.5' : 'top-full mt-2.5'
            } ${
              isRightHalf ? 'right-0' : 'left-0'
            } ${
              dockMode === 'scratchpad'
                ? 'w-[min(392px,calc(100vw-24px))]'
                : 'w-[min(344px,calc(100vw-24px))]'
            } rounded-md bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-300 dark:border-slate-700 shadow-[0_24px_60px_-14px_rgba(15,23,42,0.58)] overflow-hidden text-xs`}
          >
            {/* Shared Header with Instant Mode Switcher */}
            <div className="px-3 py-2.5 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded border border-slate-700 min-w-0">
                <button
                  type="button"
                  onClick={() => setDockMode('focus')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                    dockMode === 'focus'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{isEn ? 'Focus' : 'Góc tập trung'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDockMode('scratchpad');
                    refreshSyncedNotes();
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                    dockMode === 'scratchpad'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{isEn ? 'Scratchpad' : 'Bảng nháp'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {dockMode === 'scratchpad' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsWidgetOpen(false);
                      setIsFullscreenCanvas(true);
                    }}
                    className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/40 text-cyan-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    title={isEn ? 'Expand to Full Infinite STEM Canvas' : 'Mở rộng Bảng Vô Cực STEM'}
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span className="hidden sm:inline">{isEn ? 'Expand' : 'Mở rộng'}</span>
                  </button>
                )}
                {isCustomPositioned && (
                  <button
                    type="button"
                    onClick={resetPosition}
                    className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
                    title={isEn ? 'Reset default corner position' : 'Đặt lại vị trí góc mặc định'}
                  >
                    <PinOff className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsWidgetOpen(false)}
                  className="p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label={isEn ? 'Minimize mini panel' : 'Thu gọn'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* MODE 1: FOCUS TIMER */}
            {dockMode === 'focus' && (
              <div className="p-4 space-y-3.5 max-h-[72vh] overflow-y-auto">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{isEn ? activePreset.labelEn : activePreset.labelVi}</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {completedSessions} {isEn ? 'sessions' : 'phiên'}
                  </span>
                </div>

                {/* Alarm Banner when finished */}
                {alarmRinging && (
                  <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/70 flex items-center justify-between gap-2 text-amber-900 dark:text-amber-200">
                    <div className="flex items-center gap-2 font-bold">
                      <Bell className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        {phase === 'focus'
                          ? isEn
                            ? 'Focus block complete!'
                            : 'Hoàn thành phiên tập trung!'
                          : isEn
                          ? 'Break finished!'
                          : 'Hết giờ nghỉ giải lao!'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={dismissAlarm}
                      className="px-2 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px] cursor-pointer shrink-0"
                    >
                      OK
                    </button>
                  </div>
                )}

                {/* Phase Switch + Circular Clock */}
                <div className="flex items-center gap-4 bg-slate-50/90 dark:bg-slate-900/70 rounded-md p-3 border border-slate-200/70 dark:border-white/10">
                  <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                      <circle
                        cx="50"
                        cy="50"
                        r={ringRadius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="7"
                        className="text-slate-200 dark:text-slate-800"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r={ringRadius}
                        fill="none"
                        stroke={phase === 'break' ? '#10b981' : isRunning ? '#f59e0b' : '#6366f1'}
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={ringCircumference * (1 - progressRatio)}
                        className="transition-[stroke-dashoffset,stroke] duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-lg font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {formatClock(timeLeft)}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {phase === 'focus' ? (isEn ? 'Focus' : 'Học') : isEn ? 'Break' : 'Nghỉ'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="grid grid-cols-2 gap-1 p-1 rounded bg-slate-200/70 dark:bg-slate-800">
                      <button
                        type="button"
                        onClick={() => switchPhase('focus')}
                        className={`py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                          phase === 'focus'
                            ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Flame className="w-3 h-3" />
                        <span>{isEn ? 'Focus' : 'Tập trung'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => switchPhase('break')}
                        className={`py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                          phase === 'break'
                            ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Coffee className="w-3 h-3" />
                        <span>{isEn ? 'Break' : 'Nghỉ'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={startPause}
                        className={`flex-1 py-2 rounded text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                          isRunning
                            ? 'bg-amber-600 hover:bg-amber-500'
                            : 'bg-indigo-600 hover:bg-indigo-500'
                        }`}
                      >
                        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>
                          {isRunning
                            ? isEn
                              ? 'Pause'
                              : 'Tạm dừng'
                            : isEn
                            ? 'Start'
                            : 'Bắt đầu'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={resetTimer}
                        className="p-2 rounded bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                        title={isEn ? 'Reset timer' : 'Đặt lại'}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Study Formats Grid */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {isEn ? 'Study Method / Rhythm' : 'Hình thức học tập'}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {STUDY_FORMAT_PRESETS.map((preset) => {
                      const selected = preset.id === studyFormat;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setStudyFormat(preset.id)}
                          className={`px-2.5 py-1.5 rounded border text-left text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-between gap-1 ${
                            selected
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300 font-bold'
                              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                          }`}
                        >
                          <span className="truncate">{isEn ? preset.labelEn : preset.labelVi}</span>
                          {selected && <CheckCircle2 className="w-3 h-3 shrink-0 text-indigo-500" />}
                        </button>
                      );
                    })}
                  </div>

                  {studyFormat === 'custom' && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <label className="block">
                        <span className="text-[10px] text-slate-500 block mb-0.5">
                          {isEn ? 'Focus (min)' : 'Học (phút)'}
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={120}
                          value={customFocusMinutes}
                          onChange={(e) => setCustomFocusMinutes(Number(e.target.value) || 1)}
                          className="w-full px-2.5 py-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 font-mono text-xs"
                        />
                      </label>
                      <label className="block">
                        <span className="text-[10px] text-slate-500 block mb-0.5">
                          {isEn ? 'Break (min)' : 'Nghỉ (phút)'}
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={45}
                          value={customBreakMinutes}
                          onChange={(e) => setCustomBreakMinutes(Number(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 font-mono text-xs"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Alarm Bell Selector + Test */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/70 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Bell className="w-3 h-3 text-amber-500" />
                      {isEn ? 'Completion Bell' : 'Chuông báo hết giờ'}
                    </span>
                    <button
                      type="button"
                      onClick={() => playBell()}
                      className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {isEn ? 'Test bell' : 'Nghe thử chuông'}
                    </button>
                  </div>
                  <select
                    value={bellSound}
                    onChange={(e) => setBellSound(e.target.value as BellSoundId)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-white/15 text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {BELL_SOUND_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {isEn ? opt.labelEn : opt.labelVi}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Background Study Ambience Quick Picker */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/70 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Music className="w-3 h-3 text-sky-500" />
                      {isEn ? 'Background Sound' : 'Âm thanh nền học tập'}
                    </span>
                    <button
                      type="button"
                      onClick={toggleBgPlaying}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        isBgPlaying && bgSound !== 'off'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isBgPlaying && bgSound !== 'off' ? (
                        <Volume2 className="w-3 h-3" />
                      ) : (
                        <VolumeX className="w-3 h-3" />
                      )}
                      <span>
                        {isBgPlaying && bgSound !== 'off'
                          ? isEn
                            ? 'Playing'
                            : 'Đang phát'
                          : isEn
                          ? 'Muted'
                          : 'Đang tắt'}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={bgSound}
                      onChange={(e) => setBgSound(e.target.value as BgSoundId)}
                      className="flex-1 px-2.5 py-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-white/15 text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                    >
                      {BG_SOUND_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {isEn ? opt.labelEn : opt.labelVi}
                        </option>
                      ))}
                    </select>
                    <input
                      type="range"
                      min={0.05}
                      max={1}
                      step={0.05}
                      value={bgVolume}
                      onChange={(e) => setBgVolume(Number(e.target.value))}
                      aria-label={isEn ? 'Ambient volume' : 'Âm lượng nền'}
                      className="w-16 accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2: BẢNG NHÁP MINI-CHAT (Vẽ Nhanh + Ghi Chú Công Thức + Mở Rộng Bảng Vô Cực) */}
            {dockMode === 'scratchpad' && (
              <div className="p-3 space-y-3 max-h-[74vh] overflow-y-auto">
                {/* Drawing Tool Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {PEN_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setIsEraser(false);
                          setPenColor(c.hex);
                        }}
                        className={`w-5 h-5 rounded border transition cursor-pointer ${
                          !isEraser && penColor === c.hex
                            ? 'border-white scale-110 ring-2 ring-cyan-400'
                            : 'border-slate-500/70'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.label}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => setIsEraser((v) => !v)}
                      className={`px-2 py-1 rounded border text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                        isEraser
                          ? 'bg-rose-600 border-rose-400 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                      title={isEn ? 'Eraser' : 'Tẩy'}
                    >
                      <Eraser className="w-3 h-3" />
                      <span>{isEn ? 'Erase' : 'Tẩy'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setStrokes((prev) => prev.slice(0, -1))}
                      disabled={strokes.length === 0}
                      className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer"
                      title={isEn ? 'Undo' : 'Hoàn tác'}
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePadPng}
                      className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                      title={isEn ? 'Save PNG' : 'Lưu ảnh nháp'}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStrokes([])}
                      className="p-1.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-300 cursor-pointer"
                      title={isEn ? 'Clear canvas' : 'Xóa bảng vẽ'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mini 2D Scratch Canvas */}
                <canvas
                  ref={padCanvasRef}
                  width={360}
                  height={210}
                  onPointerDown={handlePadPointerDown}
                  onPointerMove={handlePadPointerMove}
                  onPointerUp={handlePadPointerUp}
                  onPointerCancel={handlePadPointerUp}
                  className="w-full h-[185px] rounded border border-cyan-500/40 bg-[#071122] touch-none cursor-crosshair"
                />

                {/* Quick Note / Formula Input synced with Bảng Vô Cực STEM */}
                <form onSubmit={handleAddQuickNote} className="flex gap-1.5">
                  <input
                    type="text"
                    value={quickNoteText}
                    onChange={(e) => setQuickNoteText(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Jot quick note or $E=mc^2$...'
                        : 'Ghi nhanh nháp hoặc công thức $...$...'
                    }
                    className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[11px] focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={!quickNoteText.trim()}
                    className="px-2.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 disabled:opacity-45 text-slate-950 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Pin' : 'Ghim'}</span>
                  </button>
                </form>

                {/* Recent Pinned Notes */}
                {syncedNotes.length > 0 && (
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-0.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <StickyNote className="w-3 h-3 text-amber-400" />
                      {isEn ? 'Pinned Scratch Notes' : 'Ghi chú đã ghim'} ({syncedNotes.length})
                    </div>
                    {syncedNotes.slice(-4).reverse().map((note) => (
                      <div
                        key={note.id}
                        className="flex items-start justify-between gap-2 px-2.5 py-1.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]"
                      >
                        <div className="min-w-0 text-slate-800 dark:text-slate-200 break-words">
                          <FormattedText text={note.content} />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSyncedNote(note.id)}
                          className="text-slate-400 hover:text-rose-500 shrink-0 cursor-pointer"
                          title={isEn ? 'Delete note' : 'Xóa ghi chú'}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsWidgetOpen(false);
                    setIsFullscreenCanvas(true);
                  }}
                  className="w-full py-2 rounded border border-cyan-500/45 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-700 dark:text-cyan-200 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>
                    {isEn
                      ? 'Open Full Infinite STEM Whiteboard'
                      : 'Mở Bảng Vô Cực STEM Toàn Màn Hình'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* United Bottom-Left Draggable Bar: Focus Timer + Bảng Nháp Mini-Chat */}
        <div
          className={`sci-frame inline-flex items-center rounded-md border backdrop-blur-md shadow-[0_14px_34px_-10px_rgba(15,23,42,0.58)] select-none touch-none overflow-hidden ${
            isDragging
              ? 'cursor-grabbing ring-2 ring-sky-400/70 scale-[1.03] border-sky-400'
              : 'border-slate-700/85 bg-slate-950/92'
          }`}
        >
          {/* Focus Timer Launcher Button */}
          <button
            type="button"
            data-no-lift="true"
            onPointerDown={handleDragStart}
            onClick={() => openOrToggleMode('focus')}
            aria-expanded={isWidgetOpen && dockMode === 'focus'}
            className={`group flex items-center gap-2 px-3 py-2 cursor-grab transition-colors ${
              alarmRinging
                ? 'bg-amber-400 text-slate-950'
                : isRunning
                ? 'bg-indigo-600/95 hover:bg-indigo-500 text-white'
                : isWidgetOpen && dockMode === 'focus'
                ? 'bg-slate-800 text-white'
                : 'hover:bg-slate-900 text-white'
            }`}
            title={
              isEn
                ? 'Click to open Focus Studio · Drag to move dock'
                : 'Bấm để mở Góc tập trung · Kéo giữ để di chuyển cụm nút'
            }
          >
            <GripVertical className="w-3.5 h-3.5 shrink-0 text-slate-400/80 group-hover:text-white/90" />
            <span
              className={`w-2 h-2 rounded-sm shrink-0 ${
                alarmRinging
                  ? 'bg-slate-950 animate-ping'
                  : isRunning
                  ? 'bg-emerald-400 syn-core-pulse'
                  : isBgPlaying && bgSound !== 'off'
                  ? 'bg-sky-400 syn-core-pulse'
                  : 'bg-slate-400'
              }`}
            />
            {alarmRinging ? (
              <Bell className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Clock className="w-3.5 h-3.5 shrink-0 text-sky-300" />
            )}
            <span className="font-mono tabular-nums text-xs font-extrabold tracking-tight">
              {formatClock(timeLeft)}
            </span>
            {isBgPlaying && bgSound !== 'off' && (
              <Volume2 className="w-3 h-3 shrink-0 text-sky-300" />
            )}
          </button>

          <span className="w-px self-stretch bg-slate-700/80" aria-hidden="true" />

          {/* Companion Bảng Nháp Mini-Chat Button */}
          <button
            type="button"
            data-no-lift="true"
            onPointerDown={handleDragStart}
            onClick={() => openOrToggleMode('scratchpad')}
            aria-expanded={isWidgetOpen && dockMode === 'scratchpad'}
            className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold cursor-pointer transition-colors ${
              isWidgetOpen && dockMode === 'scratchpad'
                ? 'bg-amber-500 text-slate-950'
                : 'text-amber-300 hover:bg-slate-900 hover:text-amber-200'
            }`}
            title={
              isEn
                ? 'Open Mini Scratchpad & Formulas · Drag to move dock'
                : 'Mở Bảng Nháp Mini-Chat · Kéo giữ để di chuyển cụm nút'
            }
          >
            <PenTool className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{isEn ? 'Scratchpad' : 'Bảng nháp'}</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Modal Overlay hosting InfiniteStemCanvas */}
      {isFullscreenCanvas && (
        <div className="fixed inset-0 z-[95] bg-slate-950/85 backdrop-blur-sm p-3 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 rounded-t-md border border-b-0 border-slate-700 bg-slate-900 text-white">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
              <PenTool className="w-4 h-4 text-amber-400" />
              <span>
                {isEn
                  ? 'Infinite STEM Scratchpad Canvas'
                  : 'Bảng Nháp Vô Cực STEM (Đồ thị · Khối 3D · Công thức · C++)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsFullscreenCanvas(false);
                refreshSyncedNotes();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-rose-600 border border-slate-600 text-xs font-bold cursor-pointer transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isEn ? 'Close' : 'Đóng'}</span>
            </button>
          </div>
          <div className="flex-1 overflow-auto rounded-b-md border border-slate-700 bg-slate-950 p-3">
            <InfiniteStemCanvas language={language} />
          </div>
        </div>
      )}
    </>
  );
};
