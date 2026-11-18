import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  APPARATUS_BY_ID,
  APPARATUS_CATEGORIES,
  ApparatusCategoryId,
  PHYSICS_APPARATUS_CATALOG,
  PhysicsApparatusItem,
  evaluateApparatusReading,
  getRecommendedToolsForSim
} from '../../data/physicsApparatusData';
import { PhysicsDomainId } from '../../types';
import {
  Compass as CompassIcon,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Search,
  Sparkles,
  Trash2,
  Wrench,
  X,
  Plus
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface PlacedApparatusInstance {
  uid: string;
  toolId: string;
  xPct: number;
  yPct: number;
  rotationDeg: number;
  massValueGrams?: number;
}

interface PhysicsApparatusWorkbenchProps {
  dimension: '2d' | '3d';
  simId: string;
  domainId: PhysicsDomainId;
  simParams: Record<string, number>;
  simTimeRef?: React.MutableRefObject<number>;
  simTime?: number;
  stageClassName?: string;
  children: React.ReactNode;
}

export const PhysicsApparatusWorkbench: React.FC<PhysicsApparatusWorkbenchProps> = ({
  dimension,
  simId,
  domainId,
  simParams,
  simTimeRef,
  simTime = 0,
  stageClassName = '',
  children
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const stageRef = useRef<HTMLDivElement | null>(null);
  const [placedTools, setPlacedTools] = useState<PlacedApparatusInstance[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ApparatusCategoryId>('all');

  // Lightweight UI clock (~10 Hz) for probe telemetry, stopwatch & compass needles without parent re-renders
  const [liveTick, setLiveTick] = useState(0);
  const [toolStopwatchRunning, setToolStopwatchRunning] = useState(false);
  const [toolStopwatchSec, setToolStopwatchSec] = useState(0);

  useEffect(() => {
    if (placedTools.length === 0 && !toolStopwatchRunning) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      setLiveTick((v) => v + 1);
      if (toolStopwatchRunning) {
        setToolStopwatchSec((prev) => prev + Math.min(0.2, dt));
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [placedTools.length, toolStopwatchRunning]);

  // Clear or preserve? Keep user's placed tools across parameter tweaks, only keep clean per-instance
  const recommendedTools = useMemo(
    () => getRecommendedToolsForSim(dimension, simId, domainId),
    [dimension, simId, domainId]
  );

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PHYSICS_APPARATUS_CATALOG.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.viName.toLowerCase().includes(q) ||
        item.enName.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q)
      );
    });
  }, [categoryFilter, searchQuery]);

  const addToolAt = (toolId: string, xPct?: number, yPct?: number) => {
    setPlacedTools((prev) => {
      const idx = prev.length;
      const defaultX = xPct ?? Math.min(82, 18 + (idx % 4) * 20);
      const defaultY = yPct ?? Math.min(78, 22 + Math.floor(idx / 4) * 24);
      return [
        ...prev,
        {
          uid: `${toolId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          toolId,
          xPct: Math.max(8, Math.min(92, defaultX)),
          yPct: Math.max(10, Math.min(88, defaultY)),
          rotationDeg: 0,
          massValueGrams: 200
        }
      ];
    });
  };

  const quickAddRecommendedKit = () => {
    const existingIds = new Set(placedTools.map((p) => p.toolId));
    const missing = recommendedTools.filter((r) => !existingIds.has(r.id));
    if (missing.length === 0) return;
    setPlacedTools((prev) => [
      ...prev,
      ...missing.map((item, idx) => ({
        uid: `${item.id}_${Date.now()}_${idx}`,
        toolId: item.id,
        xPct: Math.min(84, 16 + ((prev.length + idx) % 4) * 21),
        yPct: Math.min(80, 20 + Math.floor((prev.length + idx) / 4) * 24),
        rotationDeg: 0,
        massValueGrams: 200
      }))
    ]);
  };

  // Dragging from toolbox into stage
  const handleStageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes('application/x-physics-tool')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleStageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const toolId = e.dataTransfer.getData('application/x-physics-tool');
    if (!toolId || !stageRef.current) return;
    e.preventDefault();
    const rect = stageRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 100;
    const yPct = ((e.clientY - rect.top) / Math.max(1, rect.height)) * 100;
    addToolAt(toolId, xPct, yPct);
  };

  // Pointer repositioning of placed instruments inside stage
  const dragStateRef = useRef<{ uid: string; offsetX: number; offsetY: number } | null>(null);

  const handleWidgetPointerDown = (e: React.PointerEvent<HTMLDivElement>, inst: PlacedApparatusInstance) => {
    // Allow interactive controls inside widget to function without starting drag
    if ((e.target as HTMLElement).closest('button')) return;
    e.stopPropagation();
    e.preventDefault();
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const curX = (inst.xPct / 100) * rect.width + rect.left;
    const curY = (inst.yPct / 100) * rect.height + rect.top;
    dragStateRef.current = {
      uid: inst.uid,
      offsetX: e.clientX - curX,
      offsetY: e.clientY - curY
    };

    const onMove = (ev: PointerEvent) => {
      if (!dragStateRef.current || !stageRef.current) return;
      const r = stageRef.current.getBoundingClientRect();
      const nextX = ((ev.clientX - dragStateRef.current.offsetX - r.left) / Math.max(1, r.width)) * 100;
      const nextY = ((ev.clientY - dragStateRef.current.offsetY - r.top) / Math.max(1, r.height)) * 100;
      const targetUid = dragStateRef.current.uid;
      setPlacedTools((prev) =>
        prev.map((item) =>
          item.uid === targetUid
            ? {
                ...item,
                xPct: Math.max(6, Math.min(94, nextX)),
                yPct: Math.max(8, Math.min(90, nextY))
              }
            : item
        )
      );
    };

    const onUp = () => {
      dragStateRef.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const currentSimTime = simTimeRef ? simTimeRef.current : simTime;

  // Keep liveTick referenced so probes stay fresh
  void liveTick;

  return (
    <div className="sim-physics-scope space-y-2">
      {/* RECOMMENDED TOOLS STRIP + APPARATUS DRAWER TOGGLE */}
      <div className="rounded-[4px] border border-slate-200/90 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 px-3 py-2 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              {isEn ? 'Suggested Lab Kit:' : 'Gợi ý dụng cụ cần có:'}
            </span>
            {recommendedTools.map((tool) => (
              <div
                key={tool.id}
                role="button"
                tabIndex={0}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/x-physics-tool', tool.id);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => addToolAt(tool.id)}
                title={isEn ? `Drag or click to add: ${tool.shortDescEn}` : `Kéo thả hoặc bấm để đặt: ${tool.shortDescVi}`}
                className="group sim-btn-tile sim-btn-phy inline-flex items-center gap-1 px-2.5 py-1 rounded-[3px] text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-300/90 dark:border-slate-700 hover:border-sky-500 text-slate-700 dark:text-slate-200 cursor-grab active:cursor-grabbing select-none shadow-2xs"
              >
                <span
                  className="w-2 h-2 rounded-[1px] shrink-0"
                  style={{ backgroundColor: tool.accentHex }}
                />
                <span className="truncate max-w-[140px]">{isEn ? tool.enName : tool.viName}</span>
                <Plus className="w-3 h-3 text-sky-500 opacity-75 group-hover:opacity-100" />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={quickAddRecommendedKit}
              className="group sim-btn-phy sim-btn-hero px-2.5 py-1 rounded-[3px] border border-sky-400/60 text-[11px] font-bold bg-sky-600 hover:bg-sky-700 text-white cursor-pointer whitespace-nowrap"
            >
              {isEn ? '+ Quick Kit' : '+ Đặt bộ gợi ý'}
            </button>

            {placedTools.length > 0 && (
              <button
                type="button"
                onClick={() => setPlacedTools([])}
                className="group sim-btn-phy inline-flex items-center gap-1 px-2 py-1 rounded-[3px] text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 hover:bg-rose-100 cursor-pointer"
                title={isEn ? 'Remove all apparatus' : 'Xóa hết dụng cụ trên bàn'}
              >
                <Trash2 className="w-3 h-3" />
                <span>({placedTools.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setDrawerOpen((o) => !o)}
              className={`group sim-btn-phy sim-btn-hero inline-flex items-center gap-1 px-2.5 py-1 rounded-[3px] text-[11px] font-bold border cursor-pointer ${
                drawerOpen
                  ? 'sim-btn-active bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 border-slate-900 dark:border-amber-400'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-amber-500'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{isEn ? `Lab Apparatus (${PHYSICS_APPARATUS_CATALOG.length})` : `Kho dụng cụ (${PHYSICS_APPARATUS_CATALOG.length})`}</span>
              {drawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* EXPANDABLE SEARCHABLE APPARATUS DOCK */}
        {drawerOpen && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? 'Search apparatus (voltmeter, ruler, compass...)' : 'Tìm kiếm dụng cụ thí nghiệm (ampe kế, thước, từ trường...)'}
                  className="w-full pl-8 pr-7 py-1.5 rounded-md bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1">
                {APPARATUS_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                      categoryFilter === cat.id
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                    }`}
                  >
                    {isEn ? cat.en : cat.vi}
                  </button>
                ))}
              </div>
            </div>

            {/* Draggable Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredCatalog.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/x-physics-tool', item.id);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  onClick={() => addToolAt(item.id)}
                  title={isEn ? item.shortDescEn : item.shortDescVi}
                  className="flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-md bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-500 cursor-grab active:cursor-grabbing select-none transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-extrabold text-white shrink-0"
                      style={{ backgroundColor: item.accentHex }}
                    >
                      {item.symbol}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
                        {isEn ? item.enName : item.viName}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 truncate">{item.unit}</div>
                    </div>
                  </div>
                  <GripVertical className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
              ))}
              {filteredCatalog.length === 0 && (
                <div className="col-span-full py-3 text-center text-xs text-slate-500">
                  {isEn ? 'No apparatus found.' : 'Không tìm thấy dụng cụ phù hợp.'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SIMULATION STAGE WITH DRAG-DROP RECEIVER & INTERACTIVE INSTRUMENTS OVERLAY */}
      <div
        ref={stageRef}
        onDragOver={handleStageDragOver}
        onDrop={handleStageDrop}
        className={`relative ${stageClassName}`}
      >
        {children}

        {/* Floating Placed Instruments Layer (pointer-events-none so canvas/3D camera stays unobstructed) */}
        {placedTools.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none">
            {placedTools.map((inst) => {
              const spec: PhysicsApparatusItem | undefined = APPARATUS_BY_ID[inst.toolId];
              if (!spec) return null;

              const reading = evaluateApparatusReading(
                inst.toolId,
                simId,
                simParams,
                currentSimTime,
                inst.xPct,
                inst.yPct
              );

              const removeOne = () =>
                setPlacedTools((prev) => prev.filter((item) => item.uid !== inst.uid));

              const rotateBy = (delta: number) =>
                setPlacedTools((prev) =>
                  prev.map((item) =>
                    item.uid === inst.uid
                      ? { ...item, rotationDeg: (item.rotationDeg + delta + 360) % 360 }
                      : item
                  )
                );

              // SPECIAL INTERACTIVE WIDGET 1: RULER (mm/cm transparent rotatable bar)
              if (spec.widgetKind === 'ruler') {
                return (
                  <div
                    key={inst.uid}
                    onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                    style={{
                      left: `${inst.xPct}%`,
                      top: `${inst.yPct}%`,
                      transform: `translate(-50%, -50%) rotate(${inst.rotationDeg}deg)`
                    }}
                    className="pointer-events-auto absolute cursor-move group"
                  >
                    <div className="w-56 h-10 rounded bg-amber-300/85 border border-amber-700/80 shadow-lg flex flex-col justify-between px-2 py-0.5 text-slate-950">
                      <div className="flex items-end justify-between border-b border-slate-900/40 pb-0.5">
                        {Array.from({ length: 11 }).map((_, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <span className="text-[8px] font-mono font-bold leading-none">{idx * 2}</span>
                            <span className="w-[1px] h-2 bg-slate-900" />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-bold">
                        <span>Thước 20 cm ({inst.rotationDeg}°)</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => rotateBy(15)}
                            className="p-0.5 rounded bg-amber-500/50 hover:bg-amber-500 text-slate-950 cursor-pointer"
                            title="Xoay +15°"
                          >
                            <RotateCw className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={removeOne}
                            className="p-0.5 rounded bg-rose-600 text-white cursor-pointer"
                            title="Gỡ thước"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // SPECIAL INTERACTIVE WIDGET 2: 360 PROTRACTOR
              if (spec.widgetKind === 'protractor') {
                return (
                  <div
                    key={inst.uid}
                    onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                    style={{
                      left: `${inst.xPct}%`,
                      top: `${inst.yPct}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="pointer-events-auto absolute cursor-move"
                  >
                    <div className="relative w-32 h-32">
                      <svg
                        viewBox="0 0 120 120"
                        className="w-full h-full drop-shadow-md"
                        style={{ transform: `rotate(${inst.rotationDeg}deg)` }}
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="rgba(168,85,247,0.12)"
                          stroke="#a855f7"
                          strokeWidth="2"
                        />
                        <line x1="6" y1="60" x2="114" y2="60" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" />
                        <line x1="60" y1="6" x2="60" y2="114" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" />
                        {Array.from({ length: 12 }).map((_, i) => {
                          const ang = (i * 30 * Math.PI) / 180;
                          const x1 = 60 + Math.cos(ang) * 45;
                          const y1 = 60 + Math.sin(ang) * 45;
                          const x2 = 60 + Math.cos(ang) * 54;
                          const y2 = 60 + Math.sin(ang) * 54;
                          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c084fc" strokeWidth="1.5" />;
                        })}
                        <text x="60" y="18" textAnchor="middle" fill="#e9d5ff" fontSize="8" fontWeight="bold">0°</text>
                        <text x="103" y="63" textAnchor="middle" fill="#e9d5ff" fontSize="8" fontWeight="bold">90°</text>
                      </svg>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900/95 border border-purple-400/70 rounded px-1.5 py-0.5 text-[9px] text-white whitespace-nowrap">
                        <span className="font-mono">{inst.rotationDeg}°</span>
                        <button type="button" onClick={() => rotateBy(15)} className="hover:text-purple-300 cursor-pointer">
                          <RotateCw className="w-2.5 h-2.5" />
                        </button>
                        <button type="button" onClick={removeOne} className="text-rose-400 hover:text-rose-300 cursor-pointer">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // SPECIAL INTERACTIVE WIDGET 3: STOPWATCH
              if (spec.widgetKind === 'stopwatch') {
                return (
                  <div
                    key={inst.uid}
                    onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                    style={{
                      left: `${inst.xPct}%`,
                      top: `${inst.yPct}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="pointer-events-auto absolute cursor-move w-40 rounded-md bg-slate-950/95 border-2 border-indigo-400/80 shadow-xl p-2 text-white"
                  >
                    <div className="flex items-center justify-between text-[9px] font-bold text-indigo-300 mb-1">
                      <span>ĐỒNG HỒ BẤM GIỜ</span>
                      <button type="button" onClick={removeOne} className="text-slate-400 hover:text-rose-400 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-center font-mono text-base font-extrabold text-emerald-400 bg-slate-900 rounded py-0.5 border border-slate-800">
                      {toolStopwatchSec.toFixed(2)}s
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setToolStopwatchRunning((r) => !r)}
                        className={`flex-1 py-0.5 rounded text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer ${
                          toolStopwatchRunning ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}
                      >
                        {toolStopwatchRunning ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                        <span>{toolStopwatchRunning ? 'Dừng' : 'Chạy'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setToolStopwatchRunning(false);
                          setToolStopwatchSec(0);
                        }}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] cursor-pointer"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                );
              }

              // SPECIAL INTERACTIVE WIDGET 4: MINI OSCILLOSCOPE CRO
              if (spec.widgetKind === 'oscilloscope') {
                const freq = reading.waveFreq ?? 2;
                const amp = reading.waveAmp ?? 0.6;
                const dPath = Array.from({ length: 34 })
                  .map((_, i) => {
                    const x = i * 4;
                    const y = 18 - Math.sin(i * freq * 0.35 - currentSimTime * 6) * (13 * amp);
                    return `${i === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`;
                  })
                  .join(' ');
                return (
                  <div
                    key={inst.uid}
                    onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                    style={{
                      left: `${inst.xPct}%`,
                      top: `${inst.yPct}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="pointer-events-auto absolute cursor-move w-44 rounded-md bg-slate-950/95 border border-emerald-500/80 shadow-xl p-2 text-white"
                  >
                    <div className="flex items-center justify-between text-[9px] font-bold text-emerald-400 mb-1">
                      <span>MÁY HIỆN SÓNG CRO</span>
                      <button type="button" onClick={removeOne} className="text-slate-400 hover:text-rose-400 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <svg viewBox="0 0 132 36" className="w-full h-9 bg-emerald-950/50 rounded border border-emerald-800/60">
                      <line x1="0" y1="18" x2="132" y2="18" stroke="#065f46" strokeWidth="1" />
                      <path d={dPath} fill="none" stroke="#34d399" strokeWidth="1.8" />
                    </svg>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mt-1">
                      <span>{reading.valueText}</span>
                      <span className="text-slate-400">{reading.subLabel}</span>
                    </div>
                  </div>
                );
              }

              // SPECIAL INTERACTIVE WIDGET 5: MAGNETIC COMPASS
              if (spec.widgetKind === 'compass') {
                return (
                  <div
                    key={inst.uid}
                    onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                    style={{
                      left: `${inst.xPct}%`,
                      top: `${inst.yPct}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="pointer-events-auto absolute cursor-move w-28 rounded-md bg-slate-950/95 border border-rose-400/80 shadow-xl p-1.5 text-white flex flex-col items-center"
                  >
                    <div className="w-full flex items-center justify-between text-[9px] font-bold text-rose-300">
                      <span>LA BÀN B</span>
                      <button type="button" onClick={removeOne} className="text-slate-400 hover:text-rose-400 cursor-pointer">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <div className="my-1 w-10 h-10 rounded-full border-2 border-slate-600 bg-slate-900 flex items-center justify-center relative">
                      <div
                        className="w-1.5 h-8 relative transition-transform duration-100"
                        style={{ transform: `rotate(${reading.needleDeg ?? 0}deg)` }}
                      >
                        <div className="w-full h-1/2 bg-rose-500 rounded-t" />
                        <div className="w-full h-1/2 bg-sky-400 rounded-b" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold">{reading.valueText}</span>
                  </div>
                );
              }

              // STANDARD & MASS/DIGITAL INSTRUMENT CARDS
              return (
                <div
                  key={inst.uid}
                  onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                  style={{
                    left: `${inst.xPct}%`,
                    top: `${inst.yPct}%`,
                    transform: 'translate(-50%, -50%)',
                    borderColor: spec.accentHex
                  }}
                  className="pointer-events-auto absolute cursor-move min-w-[136px] max-w-[172px] rounded-md bg-slate-950/95 border-2 shadow-xl px-2.5 py-1.5 text-white"
                >
                  <div className="flex items-center justify-between gap-1 text-[9px] font-bold mb-0.5">
                    <span className="flex items-center gap-1 truncate" style={{ color: spec.accentHex }}>
                      <CompassIcon className="w-2.5 h-2.5 shrink-0" />
                      {isEn ? spec.enName : spec.viName}
                    </span>
                    <button
                      type="button"
                      onClick={removeOne}
                      className="text-slate-400 hover:text-rose-400 shrink-0 cursor-pointer"
                      title="Gỡ dụng cụ"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {spec.widgetKind === 'component_toggle' ? (
                    <div className="flex items-center justify-between gap-1 bg-slate-900 rounded px-1.5 py-1 border border-slate-800">
                      <span className="text-xs font-mono font-extrabold text-amber-300">
                        {inst.massValueGrams ?? 200} g
                      </span>
                      <div className="flex items-center gap-1">
                        {[100, 250, 500].map((gVal) => (
                          <button
                            key={gVal}
                            type="button"
                            onClick={() =>
                              setPlacedTools((prev) =>
                                prev.map((it) => (it.uid === inst.uid ? { ...it, massValueGrams: gVal } : it))
                              )
                            }
                            className={`px-1 py-0.5 rounded text-[9px] font-mono cursor-pointer ${
                              (inst.massValueGrams ?? 200) === gVal
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {gVal}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900 rounded px-2 py-1 border border-slate-800">
                      <div className="text-xs font-mono font-extrabold text-emerald-400 truncate">
                        {reading.valueText}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 truncate">
                        {reading.subLabel}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
