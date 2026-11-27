import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Box,
  Camera,
  ChevronDown,
  ChevronUp,
  Dna,
  List,
  Microscope,
  Pause,
  Play,
  RotateCcw,
  Search,
  Zap
} from 'lucide-react';
import { Biology3DMode, BiologyDomainId, BiologySimType } from '../../types';
import { BIOLOGY_2D_SIMS, BIOLOGY_3D_SIMS, BIOLOGY_DOMAINS } from '../../data/biologyDomainsData';
import { renderBiology2DSim, BioSimTelemetry } from './biology2DEngine';
import { Biology3DView } from './Biology3DView';
import { BiologySandboxes } from './BiologySandboxes';
import { BiologyLifeSandboxLab } from './BiologyLifeSandboxLab';
import { SimAnalysisProBar } from '../common/SimAnalysisProBar';
import { captureCanvasPng, RecordVideoButton, useCanvasRecorder } from '../common/SimProToolkit';
import { FormattedText } from '../common/MathRenderer';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import { getStudioDpr } from '../common/studio2DCanvasKit';
import { useCanvasModelDrag } from '../../hooks/useCanvasModelDrag';

export const BiologySimulationsPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { location, navigate, goBack } = useNavigation();
  const { perfMode } = useBackgroundTheme();
  const perfModeRef = useRef(perfMode);
  perfModeRef.current = perfMode;

  const initialZone: 'sim2d' | 'sim3d' | 'sandbox' =
    location.biologyView === 'sandbox'
      ? 'sandbox'
      : location.biologyView === 'sim3d_hub'
      ? 'sim3d'
      : 'sim2d';

  const [zone, setZone] = useState<'sim2d' | 'sim3d' | 'sandbox'>(initialZone);
  const [domainFilter, setDomainFilter] = useState<'all' | BiologyDomainId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogExpanded, setCatalogExpanded] = useState(true);
  const [activeSimId, setActiveSimId] = useState<BiologySimType>(BIOLOGY_2D_SIMS[0].id);
  const [active3DId, setActive3DId] = useState<Biology3DMode>(BIOLOGY_3D_SIMS[0].id);
  const [sandboxSuiteMode, setSandboxSuiteMode] = useState<'open' | 'classic'>('open');

  useEffect(() => {
    if (location.biologyView === 'sandbox') {
      setZone('sandbox');
    } else if (location.biologyView === 'sim3d_hub') {
      setZone('sim3d');
    } else if (location.biologyView === 'sim2d_hub') {
      setZone('sim2d');
    }
  }, [location.biologyView]);

  const selectZone = (nextZone: 'sim2d' | 'sim3d' | 'sandbox') => {
    setZone(nextZone);
    const viewPatch =
      nextZone === 'sandbox' ? 'sandbox' : nextZone === 'sim3d' ? 'sim3d_hub' : 'sim2d_hub';
    navigate({ biologyView: viewPatch }, { replace: true });
  };

  const filtered2D = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BIOLOGY_2D_SIMS.filter((s) => {
      const matchDom = domainFilter === 'all' || s.domainId === domainFilter;
      const matchQ =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.formula.toLowerCase().includes(q);
      return matchDom && matchQ;
    });
  }, [domainFilter, searchQuery]);

  const filtered3D = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BIOLOGY_3D_SIMS.filter((s) => {
      const matchDom = domainFilter === 'all' || s.domainId === domainFilter;
      const matchQ =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.formula.toLowerCase().includes(q);
      return matchDom && matchQ;
    });
  }, [domainFilter, searchQuery]);

  const active2DSpec = useMemo(
    () => BIOLOGY_2D_SIMS.find((s) => s.id === activeSimId) || BIOLOGY_2D_SIMS[0],
    [activeSimId]
  );

  const active3DSpec = useMemo(
    () => BIOLOGY_3D_SIMS.find((s) => s.id === active3DId) || BIOLOGY_3D_SIMS[0],
    [active3DId]
  );

  const [params, setParams] = useState<Record<string, number>>(() => ({ ...active2DSpec.defaultParams }));
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [telemetry, setTelemetry] = useState<BioSimTelemetry>({ metrics: [], statusNote: '' });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simTimeRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const { dragRef, isMoved, resetDrag } = useCanvasModelDrag(canvasRef, {
    resetKey: `${zone}-${active2DSpec.id}`
  });

  const recorder = useCanvasRecorder(() => canvasRef.current, `bio-hub-${active2DSpec.id}`);

  useEffect(() => {
    setParams({ ...active2DSpec.defaultParams });
    simTimeRef.current = 0;
  }, [active2DSpec]);

  useEffect(() => {
    if (zone !== 'sim2d') return;
    let raf = 0;
    let last = performance.now();
    let count = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (runningRef.current) simTimeRef.current += dt * speedRef.current;
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const dpr = getStudioDpr(perfModeRef.current);
          if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
          }
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.scale(dpr, dpr);
            const dark = document.documentElement.classList.contains('dark');
            const out = renderBiology2DSim(
              ctx,
              rect.width,
              rect.height,
              active2DSpec.id,
              paramsRef.current,
              simTimeRef.current,
              dark,
              perfModeRef.current,
              dragRef.current
            );
            ctx.restore();
            count++;
            if (count % 6 === 0) setTelemetry(out);
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [zone, active2DSpec.id]);

  return (
    <div className="space-y-6 pb-12">
      <section className="bio-zone-frame sci-frame rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 relative overflow-hidden">
        <span className="bio-helix-sweep" aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button
                type="button"
                data-ripple="true"
                onClick={onBack || goBack}
                className="sim-btn-bio inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isEn ? 'Back' : 'Quay lại'}</span>
              </button>
              <span className="px-2 py-0.5 rounded-sm bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold">
                Khu Tách Riêng · Sinh học (Lớp 6 – 12)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Dna className="w-6 h-6 text-teal-600 dark:text-teal-400 icon-anim-dna shrink-0" />
              <span>Khu Mô Phỏng 2D, Phòng Lab 3D &amp; Sandbox Sinh Học</span>
            </h1>
          </div>

          <button
            type="button"
            data-ripple="true"
            onClick={() => navigate({ subject: 'biology', biologyView: 'catalog' })}
            className="sim-btn-bio inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>Mở Kho Bài Giảng Sinh Học</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              data-ripple="true"
              onClick={() => selectZone('sim2d')}
              className={`sim-btn-bio inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                zone === 'sim2d' ? 'bg-sky-600 text-white bio-zone-active' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5 icon-anim-zap" />
              <span>Mô phỏng 2D ({BIOLOGY_2D_SIMS.length})</span>
            </button>
            <button
              type="button"
              data-ripple="true"
              onClick={() => selectZone('sim3d')}
              className={`sim-btn-bio inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                zone === 'sim3d' ? 'bg-amber-500 text-slate-950 bio-zone-active' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Phòng Lab 3D ({BIOLOGY_3D_SIMS.length})</span>
            </button>
            <button
              type="button"
              data-ripple="true"
              onClick={() => selectZone('sandbox')}
              className={`sim-btn-bio inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                zone === 'sandbox' ? 'bg-teal-600 text-white bio-zone-active' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Microscope className="w-3.5 h-3.5 icon-anim-dna" />
              <span>Sandbox Sinh học (Tự do &amp; 6 Phòng)</span>
            </button>
          </div>

          {zone !== 'sandbox' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm thí nghiệm / quy luật..."
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
              />
            </div>
          )}
        </div>

        {zone !== 'sandbox' && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              data-ripple="true"
              onClick={() => setDomainFilter('all')}
              className={`sim-btn-bio px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                domainFilter === 'all'
                  ? 'bg-slate-900 dark:bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Tất cả 6 lĩnh vực
            </button>
            {BIOLOGY_DOMAINS.map((d) => (
              <button
                key={d.id}
                type="button"
                data-ripple="true"
                onClick={() => setDomainFilter(d.id)}
                className={`sim-btn-bio px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  domainFilter === d.id
                    ? d.bgActiveClass
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {d.shortName}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ZONE 1: BIOLOGY 2D SIMULATIONS (TOP DIRECTORY + EXPANDED FULL-WIDTH VIEWPORT) */}
      {zone === 'sim2d' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <List className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Mục lục mô phỏng Sinh học 2D ({filtered2D.length}/{BIOLOGY_2D_SIMS.length})
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-400">·</span>
                <span className="hidden sm:inline-block text-xs font-semibold text-teal-600 dark:text-teal-400 truncate max-w-xs">
                  Đang mở: {active2DSpec.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCatalogExpanded((v) => !v)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
              >
                {catalogExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{catalogExpanded ? 'Thu gọn mục lục' : 'Mở rộng mục lục'}</span>
              </button>
            </div>

            {catalogExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-[240px] overflow-y-auto pr-1">
                {filtered2D.map((spec) => {
                  const isAct = spec.id === active2DSpec.id;
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      data-ripple="true"
                      onClick={() => setActiveSimId(spec.id)}
                      className={`bio-card-frame sim-btn-bio w-full text-left p-2.5 rounded-xl border cursor-pointer transition-colors relative ${
                        isAct
                          ? 'bg-teal-600 text-white border-teal-600 bio-zone-active'
                          : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:border-teal-500'
                      }`}
                    >
                      <div className={`text-[10px] font-mono ${isAct ? 'text-teal-100' : 'text-slate-500'}`}>
                        {spec.grades.join(' · ')}
                      </div>
                      <div className="text-xs font-bold mt-0.5 line-clamp-1">{spec.title}</div>
                      <div className={`text-[10px] font-mono truncate mt-0.5 ${isAct ? 'text-teal-100' : 'text-teal-600 dark:text-teal-400'}`}>
                        {spec.formula}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:px-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{active2DSpec.title}</h2>
                  <p className="text-xs text-slate-500">{active2DSpec.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsRunning((r) => !r)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                  >
                    {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isRunning ? 'Tạm dừng' : 'Chạy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setParams({ ...active2DSpec.defaultParams });
                      simTimeRef.current = 0;
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => captureCanvasPng(canvasRef.current, `bio-2d-${active2DSpec.id}`)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer whitespace-nowrap"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>PNG</span>
                  </button>
                  <RecordVideoButton
                    isRecording={recorder.isRecording}
                    recordSeconds={recorder.recordSeconds}
                    onToggle={recorder.toggleRecording}
                    supported={recorder.supported}
                    compact
                    isEn={isEn}
                  />
                </div>
              </div>

              <div className="relative p-2.5 bg-slate-950">
                <canvas
                  ref={canvasRef}
                  title="Kéo thả mô hình trên sàn • Nhấp đúp để đặt lại"
                  className="w-full h-[500px] sm:h-[580px] block rounded-lg"
                />
                {isMoved && (
                  <button
                    type="button"
                    onClick={resetDrag}
                    className="absolute bottom-14 left-5 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-teal-600 border border-teal-500/40 text-[11px] font-semibold text-teal-200 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Đặt lại vị trí</span>
                  </button>
                )}
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  {Object.entries(active2DSpec.paramBounds).map(([k, bound]) => {
                    const v = params[k] ?? active2DSpec.defaultParams[k] ?? bound.min;
                    return (
                      <label key={k} className="block space-y-1 text-xs">
                        <div className="flex justify-between font-semibold">
                          <span>{bound.label}</span>
                          <span className="font-mono tabular-nums text-teal-600 dark:text-teal-400">
                            {v} {bound.unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={bound.min}
                          max={bound.max}
                          step={bound.step}
                          value={v}
                          onChange={(e) => setParams((p) => ({ ...p, [k]: Number(e.target.value) }))}
                          className="w-full accent-teal-600"
                        />
                      </label>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {telemetry.metrics.slice(0, 3).map((m, idx) => (
                      <div key={idx} className="rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-[11px] text-slate-500">{m.label}</div>
                        <div className="text-sm font-mono font-bold tabular-nums text-teal-600 dark:text-teal-400">
                          {m.value} {m.unit || ''}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2.5">
                    <FormattedText text={telemetry.statusNote || active2DSpec.subtitle} />
                  </div>
                </div>
              </div>
            </div>

            <SimAnalysisProBar
              simKey={`bio-hub-${active2DSpec.id}`}
              title={active2DSpec.title}
              formula={active2DSpec.formula}
              params={params}
              paramBounds={active2DSpec.paramBounds}
              metrics={telemetry.metrics}
              onApplyParams={setParams}
              onTogglePlay={() => setIsRunning((r) => !r)}
              onReset={() => {
                setParams({ ...active2DSpec.defaultParams });
                simTimeRef.current = 0;
              }}
              onSpeedDelta={(d) => setSpeed((s) => Math.max(0.25, Math.min(2.5, s + d)))}
              isEn={isEn}
            />
          </div>
        </div>
      )}

      {/* ZONE 2: BIOLOGY 3D WEBGL LAB (TOP DIRECTORY + EXPANDED FULL-WIDTH VIEWPORT) */}
      {zone === 'sim3d' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <List className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Mục lục Phòng Lab 3D Sinh học ({filtered3D.length}/{BIOLOGY_3D_SIMS.length})
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-400">·</span>
                <span className="hidden sm:inline-block text-xs font-semibold text-amber-600 dark:text-amber-400 truncate max-w-xs">
                  Đang mở: {active3DSpec.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCatalogExpanded((v) => !v)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
              >
                {catalogExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{catalogExpanded ? 'Thu gọn mục lục' : 'Mở rộng mục lục'}</span>
              </button>
            </div>

            {catalogExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {filtered3D.map((spec) => {
                  const isAct = spec.id === active3DSpec.id;
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => setActive3DId(spec.id)}
                      className={`w-full text-left p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        isAct
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:border-amber-400'
                      }`}
                    >
                      <div className="text-[10px] font-mono opacity-80">{spec.grades.join(' · ')}</div>
                      <div className="text-xs font-bold mt-0.5 line-clamp-1">{spec.title}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Biology3DView
              mode={active3DSpec.id}
              title={active3DSpec.title}
              heightClass="h-[560px] sm:h-[650px]"
              isEn={isEn}
            />
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold">{active3DSpec.title}</span> · <span className="text-slate-500">{active3DSpec.subtitle}</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  navigate({
                    subject: 'biology',
                    biologyView: 'lecture',
                    biologyLessonId: active3DSpec.linkedLessonId,
                    biologyTab: 'theory'
                  })
                }
                className="inline-flex items-center gap-1.5 font-bold text-teal-600 hover:underline cursor-pointer"
              >
                <Dna className="w-3.5 h-3.5" />
                <span>Mở bài giảng liên quan →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {zone === 'sandbox' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSandboxSuiteMode('open')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                  sandboxSuiteMode === 'open'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                Sandbox Kiến tạo Sự sống (Nhập vai · Hệ sinh thái · Gen · Tế bào · Sinh lý)
              </button>
              <button
                type="button"
                onClick={() => setSandboxSuiteMode('classic')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                  sandboxSuiteMode === 'classic'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                6 Phòng Sinh học Chuyên đề
              </button>
            </div>
            <span className="text-xs text-slate-500">
              {sandboxSuiteMode === 'open'
                ? 'Kiến tạo sinh vật, diễn thế hàng trăm năm & giải phẫu chức năng'
                : 'Kính hiển vi ảo, Lai Mendel, Giải phẫu lớp & Lưới thức ăn'}
            </span>
          </div>

          {sandboxSuiteMode === 'open' ? (
            <BiologyLifeSandboxLab isEn={isEn} />
          ) : (
            <BiologySandboxes isEn={isEn} />
          )}
        </div>
      )}
    </div>
  );
};
