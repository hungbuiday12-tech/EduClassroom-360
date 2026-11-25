import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  FlaskConical,
  Maximize2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sliders,
  Sparkles,
  StepForward
} from 'lucide-react';
import { ChemistryLesson } from '../../types';
import { resolveChemStepSim } from './chemistryStepSimResolver';
import { ChemSimTelemetry, renderChemistry2DSim } from './chemistry2DEngine';
import { Chemistry3DView } from './Chemistry3DView';
import { FormattedText, MathFormula } from '../common/MathRenderer';

interface ChemistryInlineStepSimProps {
  lesson: ChemistryLesson;
  stepIndex: number;
  totalSteps: number;
  stepTitle?: string;
  stepConcept?: string;
  viewMode: 'both' | '2d' | '3d';
  isWebGLActive?: boolean;
  onActivateWebGL?: () => void;
  onOpenSim2D?: () => void;
  onOpenSim3D?: () => void;
}

export const ChemistryInlineStepSim: React.FC<ChemistryInlineStepSimProps> = ({
  lesson,
  stepIndex,
  totalSteps,
  stepTitle,
  stepConcept,
  viewMode,
  isWebGLActive = true,
  onActivateWebGL,
  onOpenSim2D,
  onOpenSim3D
}) => {
  const resolved = useMemo(
    () => resolveChemStepSim(lesson, stepIndex, stepTitle, stepConcept),
    [lesson, stepIndex, stepTitle, stepConcept]
  );

  const [params, setParams] = useState<Record<string, number>>(() => ({ ...resolved.defaultParams }));
  const [isRunning, setIsRunning] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [telemetry, setTelemetry] = useState<ChemSimTelemetry>({ metrics: [], statusNote: '' });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simTimeRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;
  const speedRef = useRef(simSpeed);
  speedRef.current = simSpeed;

  useEffect(() => {
    setParams({ ...resolved.defaultParams });
    simTimeRef.current = 0;
  }, [resolved.sim2dId, lesson.id, stepIndex]);

  useEffect(() => {
    if (viewMode === '3d') return;
    let raf = 0;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (runningRef.current) simTimeRef.current += dt * speedRef.current;

      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
          }
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.scale(dpr, dpr);
            const isDark = document.documentElement.classList.contains('dark');
            const out = renderChemistry2DSim(
              ctx,
              rect.width,
              rect.height,
              resolved.sim2dId,
              paramsRef.current,
              simTimeRef.current,
              isDark
            );
            ctx.restore();
            frame++;
            if (frame % 6 === 0) setTelemetry(out);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [viewMode, resolved.sim2dId]);

  const paramEntries = useMemo(() => Object.entries(resolved.paramBounds), [resolved.paramBounds]);

  return (
    <div className="space-y-3">
      {(viewMode === 'both' || viewMode === '2d') && (
        <section
          data-testid={`chem-inline-2d-step-${stepIndex}`}
          className="chem-zone-frame chem-card-frame rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-white dark:bg-slate-950 overflow-hidden shadow-sm relative"
        >
          <span className="chem-energy-sweep" aria-hidden="true" />
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold uppercase shrink-0">
                <FlaskConical className="w-3 h-3 icon-anim-flask" />
                2D HÓA · PHẦN {stepIndex + 1}/{totalSteps}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                <FormattedText text={resolved.regimeLabel} />
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              {resolved.spec2D.presets.slice(0, 3).map((pr) => (
                <button
                  key={pr.label}
                  type="button"
                  data-ripple="true"
                  onClick={() => setParams({ ...resolved.defaultParams, ...pr.params })}
                  className="sim-btn-chem px-2 py-1 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer whitespace-nowrap"
                >
                  {pr.label}
                </button>
              ))}
              {onOpenSim2D && (
                <button
                  type="button"
                  data-ripple="true"
                  onClick={onOpenSim2D}
                  className="sim-btn-chem inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer whitespace-nowrap"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Phòng Lab 2D</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-slate-950 border-b border-slate-200 dark:border-slate-800">
            <canvas ref={canvasRef} className="w-full h-[255px] sm:h-[290px] block select-none" />
          </div>

          <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                data-ripple="true"
                onClick={() => setIsRunning((r) => !r)}
                className={`sim-btn-chem inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-bold cursor-pointer ${
                  isRunning ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                }`}
              >
                {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isRunning ? 'Tạm dừng' : 'Chạy'}</span>
              </button>
              <button
                type="button"
                data-ripple="true"
                onClick={() => {
                  simTimeRef.current += 0.25;
                }}
                className="sim-btn-chem inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold cursor-pointer"
              >
                <StepForward className="w-3 h-3 text-emerald-500" />
                <span>+0.25s</span>
              </button>
              <button
                type="button"
                data-ripple="true"
                onClick={() => {
                  setParams({ ...resolved.defaultParams });
                  simTimeRef.current = 0;
                }}
                className="sim-btn-chem inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
              {[0.5, 1, 1.5].map((sp) => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => setSimSpeed(sp)}
                  className={`px-2 py-1 rounded-sm text-[10px] font-mono font-bold tabular-nums cursor-pointer ${
                    simSpeed === sp
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {sp}x
                </button>
              ))}
            </div>

            <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 truncate max-w-md">
              <MathFormula formula={resolved.spec2D.formula} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
            {telemetry.metrics.slice(0, 3).map((m, idx) => (
              <div key={idx} className="px-4 py-2">
                <div className="text-[10px] font-mono uppercase text-slate-500">{m.label}</div>
                <div className="text-sm font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                  {m.value} {m.unit || ''}
                </div>
              </div>
            ))}
          </div>

          {paramEntries.length > 0 && (
            <div className="p-3 bg-slate-50/75 dark:bg-slate-900/50 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {paramEntries.map(([key, bound]) => {
                const v = params[key] ?? resolved.defaultParams[key] ?? bound.min;
                const decimals = (bound.step.toString().split('.')[1] || '').length;
                return (
                  <div
                    key={key}
                    className="rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 truncate">
                        <Sliders className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{bound.label}</span>
                      </span>
                      <div className="flex items-center gap-1 shrink-0 font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                        <button
                          type="button"
                          onClick={() =>
                            setParams((p) => ({
                              ...p,
                              [key]: Math.max(bound.min, Number((v - bound.step).toFixed(Math.max(decimals, 2))))
                            }))
                          }
                          className="w-6 h-6 rounded-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="min-w-[54px] text-right">
                          {v} {bound.unit}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setParams((p) => ({
                              ...p,
                              [key]: Math.min(bound.max, Number((v + bound.step).toFixed(Math.max(decimals, 2))))
                            }))
                          }
                          className="w-6 h-6 rounded-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={bound.min}
                      max={bound.max}
                      step={bound.step}
                      value={v}
                      onChange={(e) => setParams((p) => ({ ...p, [key]: Number(e.target.value) }))}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {(viewMode === 'both' || viewMode === '3d') && (
        <section data-testid={`chem-inline-3d-step-${stepIndex}`} className="chem-zone-frame rounded-xl overflow-hidden">
          {!isWebGLActive ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950 text-white overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold uppercase shrink-0">
                    <Box className="w-3 h-3" />
                    3D HÓA · PHẦN {stepIndex + 1}/{totalSteps}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {resolved.spec3D.title}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  {onActivateWebGL && (
                    <button
                      type="button"
                      data-ripple="true"
                      onClick={onActivateWebGL}
                      className="sim-btn-chem inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Mở Mô hình 3D WebGL</span>
                    </button>
                  )}
                  {onOpenSim3D && (
                    <button
                      type="button"
                      onClick={onOpenSim3D}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Lab 3D Đầy đủ</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080f18]">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 icon-anim-flask" />
                    <span>THREE.JS WEBGL · {resolved.spec3D.title.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-slate-300">{resolved.spec3D.subtitle}</p>
                </div>
                {onActivateWebGL && (
                  <button
                    type="button"
                    data-ripple="true"
                    onClick={onActivateWebGL}
                    className="sim-btn-chem inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    <span>Chạy cảnh 3D tại đây</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <Chemistry3DView
              mode={resolved.sim3dMode}
              title={`${resolved.spec3D.title} · Phần ${stepIndex + 1}/${totalSteps}`}
              heightClass="h-[340px]"
            />
          )}
        </section>
      )}
    </div>
  );
};
