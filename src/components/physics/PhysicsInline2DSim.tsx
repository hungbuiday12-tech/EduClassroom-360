import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Box,
  Compass,
  Grid,
  Maximize2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sliders,
  StepForward,
  Zap
} from 'lucide-react';
import { PhysicsLesson, PhysicsSimType } from '../../types';
import {
  DEFAULT_PHYSICS_2D_OVERLAYS,
  Physics2DFlags,
  Physics2DOverlayState,
  Physics2DTelemetry,
  renderPhysics2DSimulation
} from './physics2DEngine';
import { CustomStepSimId, renderCustomStepPhysicsSim } from './physicsStepCustomRenderers';
import { resolveStepSimulation } from './physicsStepSimResolver';

interface PhysicsInline2DSimProps {
  lesson: PhysicsLesson;
  stepIndex: number;
  totalSteps: number;
  stepTitle?: string;
  stepConcept?: string;
  onOpenSim2D?: () => void;
  onOpenSim3D?: () => void;
}

interface InlineNumericParamFieldProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (nextVal: number) => void;
}

const InlineNumericParamField: React.FC<InlineNumericParamFieldProps> = ({
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
    <div className="rounded-sm bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 px-3 py-2 space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 min-w-0">
          <Sliders className="w-3 h-3 text-sky-500 shrink-0" />
          <span className="truncate">{label}</span>
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            className="w-8 h-8 sm:w-6 sm:h-6 rounded-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            title={`Giảm ${step}`}
          >
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="number"
            step="any"
            aria-label={label}
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
            className="w-16 min-h-[32px] sm:min-h-0 px-1.5 py-0.5 text-right font-mono text-xs font-bold bg-slate-50 dark:bg-slate-950 text-sky-600 dark:text-sky-400 border border-slate-200 dark:border-slate-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 tabular-nums"
          />
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="w-8 h-8 sm:w-6 sm:h-6 rounded-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            title={`Tăng ${step}`}
          >
            <Plus className="w-3 h-3" />
          </button>
          {unit && (
            <span className="font-mono font-semibold text-slate-500 dark:text-slate-400 text-[10px] min-w-[20px]">
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
          const v = Number(e.target.value);
          onChange(v);
          setDraft(String(v));
        }}
        className="w-full h-1.5 accent-sky-600 cursor-pointer"
      />
      <div className="flex justify-between text-[9.5px] text-slate-400 font-mono">
        <span>{min} {unit}</span>
        <span>{max} {unit} (nhập số tự do)</span>
      </div>
    </div>
  );
};

export const PhysicsInline2DSim: React.FC<PhysicsInline2DSimProps> = ({
  lesson,
  stepIndex,
  totalSteps,
  stepTitle,
  stepConcept,
  onOpenSim2D,
  onOpenSim3D
}) => {
  const resolved = useMemo(
    () => resolveStepSimulation(lesson, stepIndex, stepTitle, stepConcept),
    [lesson, stepIndex, stepTitle, stepConcept]
  );

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [params, setParams] = useState<Record<string, number>>(resolved.defaultParams);
  const [flags, setFlags] = useState<Physics2DFlags>(resolved.flags);
  const [overlays, setOverlays] = useState<Physics2DOverlayState>(DEFAULT_PHYSICS_2D_OVERLAYS);

  const [telemetry, setTelemetry] = useState<Physics2DTelemetry>({
    metric1Label: 'Thông số 1',
    metric1Val: '--',
    metric2Label: 'Thông số 2',
    metric2Val: '--',
    metric3Label: 'Thông số 3',
    metric3Val: '--',
    note: resolved.observationGoal
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simTimeRef = useRef<number>(0);
  const animIdRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(isRunning);
  const simSpeedRef = useRef<number>(simSpeed);
  const paramsRef = useRef<Record<string, number>>(params);
  const flagsRef = useRef<Physics2DFlags>(flags);
  const overlaysRef = useRef<Physics2DOverlayState>(overlays);
  const oscHistoryRef = useRef<number[]>([]);
  const forceTelemetryRef = useRef<boolean>(true);
  const lastTelemetryMsRef = useRef<number>(0);

  // Sync resolved simulation & regime whenever step changes
  useEffect(() => {
    setParams(resolved.defaultParams);
    setFlags(resolved.flags);
    paramsRef.current = resolved.defaultParams;
    flagsRef.current = resolved.flags;
    simTimeRef.current = 0;
    oscHistoryRef.current = [];
    setIsRunning(true);
    isRunningRef.current = true;
    forceTelemetryRef.current = true;
    setTelemetry((prev) => ({ ...prev, note: resolved.observationGoal }));
  }, [resolved]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    simSpeedRef.current = simSpeed;
  }, [simSpeed]);

  useEffect(() => {
    paramsRef.current = params;
    forceTelemetryRef.current = true;
  }, [params]);

  useEffect(() => {
    flagsRef.current = flags;
    forceTelemetryRef.current = true;
  }, [flags]);

  useEffect(() => {
    overlaysRef.current = overlays;
    forceTelemetryRef.current = true;
  }, [overlays]);

  const pushTelemetry = useCallback((next: Physics2DTelemetry) => {
    const now = performance.now();
    if (forceTelemetryRef.current || now - lastTelemetryMsRef.current >= 110) {
      lastTelemetryMsRef.current = now;
      forceTelemetryRef.current = false;
      setTelemetry(next);
    }
  }, []);

  // 60 FPS Canvas Animation Loop supporting BOTH 59 catalog sims & 10 custom step sims
  useEffect(() => {
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

    let lastTs = performance.now();
    let lastIdleMs = 0;

    const frame = (now: number) => {
      animIdRef.current = requestAnimationFrame(frame);
      if (document.hidden) {
        lastTs = now;
        return;
      }
      if (!isRunningRef.current && now - lastIdleMs < 80) {
        lastTs = now;
        return;
      }
      lastIdleMs = now;

      const rawDt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;
      if (isRunningRef.current) {
        simTimeRef.current += rawDt * simSpeedRef.current;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = cachedW || canvas.clientWidth;
      const h = cachedH || canvas.clientHeight;
      if (w < 40 || h < 40) return;

      const targetW = Math.floor(w * dpr);
      const targetH = Math.floor(h * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      if (resolved.isCustomEngine) {
        renderCustomStepPhysicsSim({
          ctx,
          w,
          h,
          t: simTimeRef.current,
          isDark: cachedDark,
          simId: resolved.simId as CustomStepSimId,
          params: paramsRef.current,
          flags: flagsRef.current,
          overlays: overlaysRef.current,
          pushTelemetry
        });
      } else {
        renderPhysics2DSimulation({
          ctx,
          w,
          h,
          t: simTimeRef.current,
          isRunning: isRunningRef.current,
          isDark: cachedDark,
          simType: resolved.simId as PhysicsSimType,
          params: paramsRef.current,
          flags: flagsRef.current,
          overlays: overlaysRef.current,
          oscHistory: oscHistoryRef.current,
          pushTelemetry
        });
      }

      ctx.restore();
    };

    animIdRef.current = requestAnimationFrame(frame);
    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      resizeObs?.disconnect();
      classObs.disconnect();
    };
  }, [resolved.simId, resolved.isCustomEngine, pushTelemetry]);

  const handleStepOnce = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    simTimeRef.current += 0.05;
    forceTelemetryRef.current = true;
  };

  const handleResetStep = () => {
    simTimeRef.current = 0;
    oscHistoryRef.current = [];
    setParams(resolved.defaultParams);
    setFlags(resolved.flags);
    paramsRef.current = resolved.defaultParams;
    flagsRef.current = resolved.flags;
    setIsRunning(true);
    forceTelemetryRef.current = true;
  };

  const paramControls = useMemo(
    () => Object.entries(resolved.paramBounds || {}),
    [resolved.paramBounds]
  );

  // Contextual experiment toggles matched directly to the active simulation
  const flagControls = useMemo(() => {
    const controls: { key: string; label: string; active: boolean; toggle: () => void }[] = [];
    const sim = resolved.simId;

    if (sim === 'average_velocity_stages') {
      controls.push({
        key: 'equalTime',
        label: flags.airDrag ? 'Đang bật: Chia theo Thời gian (t₁=t₂)' : 'Chế độ: Chia theo Thời gian (t₁=t₂)',
        active: flags.airDrag,
        toggle: () => setFlags((f) => ({ ...f, airDrag: !f.airDrag }))
      });
    } else if (sim === 'distance_displacement_rel') {
      controls.push({
        key: 'turn1D',
        label: flags.airDrag ? 'Đang bật: Đi thẳng & Quay đầu 1D' : 'Chế độ: Đi thẳng & Quay đầu 1D',
        active: flags.airDrag,
        toggle: () => setFlags((f) => ({ ...f, airDrag: !f.airDrag }))
      });
    } else if (sim === 'em_wave_3axis') {
      controls.push({
        key: 'amMod',
        label: 'Điều chế Biên độ AM',
        active: flags.airDrag,
        toggle: () => setFlags((f) => ({ ...f, airDrag: !f.airDrag }))
      });
    } else if (sim === 'ohm_circuit') {
      controls.push(
        {
          key: 'circuitOpen',
          label: flags.circuitOpen ? 'Khóa K: MỞ' : 'Khóa K: ĐÓNG',
          active: !flags.circuitOpen,
          toggle: () => setFlags((f) => ({ ...f, circuitOpen: !f.circuitOpen }))
        },
        {
          key: 'reversePolarity',
          label: 'Đảo cực nguồn',
          active: flags.reversePolarity,
          toggle: () => setFlags((f) => ({ ...f, reversePolarity: !f.reversePolarity }))
        },
        {
          key: 'showVoltmeter',
          label: 'Vôn kế R₁',
          active: flags.showVoltmeter,
          toggle: () => setFlags((f) => ({ ...f, showVoltmeter: !f.showVoltmeter }))
        },
        {
          key: 'showElectrons',
          label: 'Hiện e⁻ (− → +)',
          active: Boolean(flags.showElectrons),
          toggle: () => setFlags((f) => ({ ...f, showElectrons: !f.showElectrons }))
        }
      );
    } else if (sim === 'joule_lenz_heat') {
      controls.push(
        {
          key: 'circuitOpen',
          label: flags.circuitOpen ? 'Khóa K: MỞ' : 'Khóa K: ĐÓNG',
          active: !flags.circuitOpen,
          toggle: () => setFlags((f) => ({ ...f, circuitOpen: !f.circuitOpen }))
        },
        {
          key: 'reversePolarity',
          label: 'Đảo cực nguồn',
          active: flags.reversePolarity,
          toggle: () => setFlags((f) => ({ ...f, reversePolarity: !f.reversePolarity }))
        },
        {
          key: 'showElectrons',
          label: 'Hiện e⁻ (− → +)',
          active: Boolean(flags.showElectrons),
          toggle: () => setFlags((f) => ({ ...f, showElectrons: !f.showElectrons }))
        }
      );
    } else if (sim === 'lens_optics') {
      controls.push(
        {
          key: 'isDiverging',
          label: flags.isDiverging ? 'TK Phân kì' : 'TK Hội tụ',
          active: flags.isDiverging,
          toggle: () => setFlags((f) => ({ ...f, isDiverging: !f.isDiverging }))
        },
        {
          key: 'showThirdRay',
          label: 'Tia thứ 3 (qua F)',
          active: flags.showThirdRay,
          toggle: () => setFlags((f) => ({ ...f, showThirdRay: !f.showThirdRay }))
        }
      );
    } else if (sim === 'projectile_motion' || sim === 'free_fall_energy') {
      controls.push({
        key: 'airDrag',
        label: 'Lực cản không khí',
        active: flags.airDrag,
        toggle: () => setFlags((f) => ({ ...f, airDrag: !f.airDrag }))
      });
    } else if (sim === 'spring_pendulum' || sim === 'simple_pendulum' || sim === 'damped_resonance') {
      controls.push({
        key: 'hasFriction',
        label: 'Ma sát tắt dần',
        active: flags.hasFriction,
        toggle: () => setFlags((f) => ({ ...f, hasFriction: !f.hasFriction }))
      });
    } else if (sim === 'magnetic_induction') {
      controls.push({
        key: 'flipMagnet',
        label: 'Đảo cực Nam châm',
        active: flags.flipMagnet,
        toggle: () => setFlags((f) => ({ ...f, flipMagnet: !f.flipMagnet }))
      });
    } else if (sim === 'wave_interference') {
      controls.push({
        key: 'showNodalLines',
        label: 'Hiện vân cực đại/tiểu',
        active: flags.showNodalLines,
        toggle: () => setFlags((f) => ({ ...f, showNodalLines: !f.showNodalLines }))
      });
    } else if (sim === 'light_refraction') {
      controls.push({
        key: 'showProtractor',
        label: 'Thước đo góc',
        active: flags.showProtractor,
        toggle: () => setFlags((f) => ({ ...f, showProtractor: !f.showProtractor }))
      });
    }
    return controls;
  }, [resolved.simId, flags]);

  return (
    <section
      data-testid={`physics-inline-2d-step-${stepIndex}`}
      className="rounded-md border border-sky-300/80 dark:border-sky-800/70 bg-white dark:bg-slate-950/90 shadow-sm overflow-hidden"
    >
      {/* Top Bar: Step-matched Title, Formula & Quick Launch */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-sky-50 via-white to-indigo-50/60 dark:from-slate-900 dark:via-slate-950 dark:to-sky-950/40 border-b border-sky-200/80 dark:border-sky-800/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-sky-600 text-white text-[10px] font-mono font-extrabold tracking-wider uppercase shrink-0">
            <span className="w-1.5 h-1.5 rounded-xs bg-emerald-300 animate-pulse" />
            MÔ PHỎNG 2D · PHẦN {stepIndex + 1}/{totalSteps}
          </span>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
            {resolved.title}
          </h4>
          {resolved.formula && (
            <span className="hidden xl:inline-block px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-sky-700 dark:text-sky-300 truncate max-w-[320px]">
              {resolved.formula}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenSim2D && (
            <button
              type="button"
              onClick={onOpenSim2D}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cs-deck-btn cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Lab 2D Đầy đủ</span>
            </button>
          )}
          {onOpenSim3D && (
            <button
              type="button"
              onClick={onOpenSim3D}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors cs-deck-btn cursor-pointer"
            >
              <Box className="w-3 h-3" />
              <span>3D</span>
            </button>
          )}
        </div>
      </div>

      {/* Step Regime Banner + Quick Presets */}
      <div className="px-4 py-2 bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-300 font-bold">
            <Activity className="w-3.5 h-3.5 shrink-0" />
            <span>{resolved.regimeLabel}</span>
          </div>
          {resolved.presets.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              {resolved.presets.slice(0, 3).map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    const merged = { ...resolved.defaultParams, ...preset.params };
                    setParams(merged);
                    paramsRef.current = merged;
                    simTimeRef.current = 0;
                    forceTelemetryRef.current = true;
                  }}
                  title={preset.description}
                  className="px-2 py-0.5 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:text-sky-700 dark:hover:text-sky-300 text-[10px] font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
          {resolved.observationGoal}
        </p>
      </div>

      {/* Live Unobstructed 2D Canvas Stage */}
      <div className="relative bg-slate-50 dark:bg-[#0c101d] border-b border-slate-200/80 dark:border-slate-800">
        <canvas
          ref={canvasRef}
          className="w-full h-[250px] sm:h-[280px] block select-none"
        />
      </div>

      {/* Dedicated Transport & Visual Overlay Strip BELOW Canvas (Never covers canvas objects!) */}
      <div className="px-3 py-2 bg-slate-50/95 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsRunning((r) => !r)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-bold cursor-pointer transition-colors ${
              isRunning
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isRunning ? 'Tạm dừng' : 'Chạy'}</span>
          </button>

          <button
            type="button"
            onClick={handleStepOnce}
            title="Nhích từng bước +0.05s"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            <StepForward className="w-3 h-3" />
            <span>+0.05s</span>
          </button>

          <button
            type="button"
            onClick={handleResetStep}
            title="Đặt lại tham số chuẩn của mục này"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại</span>
          </button>

          <span className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 hidden sm:inline-block" />

          {[0.5, 1, 1.5].map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => setSimSpeed(sp)}
              className={`px-2 py-1 rounded-sm text-[10px] font-mono font-bold tabular-nums cursor-pointer ${
                simSpeed === sp
                  ? 'bg-sky-600 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {sp}x
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setOverlays((o) => ({ ...o, showVectors: !o.showVectors }))}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-bold cursor-pointer ${
              overlays.showVectors
                ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>Vectơ</span>
          </button>
          <button
            type="button"
            onClick={() => setOverlays((o) => ({ ...o, showRulerGrid: !o.showRulerGrid }))}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-bold cursor-pointer ${
              overlays.showRulerGrid
                ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
          >
            <Grid className="w-3 h-3" />
            <span>Lưới</span>
          </button>
        </div>
      </div>

      {/* Live SI Telemetry Readout Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-slate-800 bg-white dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800">
        <div className="px-3.5 py-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {telemetry.metric1Label}
          </div>
          <div className="text-sm font-mono font-bold text-sky-600 dark:text-sky-400 tabular-nums">
            {telemetry.metric1Val}
          </div>
        </div>
        <div className="px-3.5 py-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {telemetry.metric2Label}
          </div>
          <div className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {telemetry.metric2Val}
          </div>
        </div>
        <div className="px-3.5 py-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {telemetry.metric3Label}
          </div>
          <div className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {telemetry.metric3Val}
          </div>
        </div>
      </div>

      {/* Interactive Free-Input Parameters + Experiment Flags matched to this step */}
      {(paramControls.length > 0 || flagControls.length > 0 || telemetry.note) && (
        <div className="p-3 sm:p-3.5 bg-slate-50/75 dark:bg-slate-900/50 space-y-2.5">
          {paramControls.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2.5">
              {paramControls.map(([key, bound]) => {
                const curVal = params[key] ?? resolved.defaultParams[key] ?? bound.min;

                if (key === 'circuitType' || key === 'vizMode' || key === 'modeCharge' || key === 'convexMode' || key === 'processType' || key === 'openEnd') {
                  const opts =
                    key === 'circuitType'
                      ? [
                          { v: 0, label: 'Mắc Nối Tiếp' },
                          { v: 1, label: 'Mắc Song Song' }
                        ]
                      : key === 'vizMode'
                      ? [
                          { v: 0, label: 'Vectơ' },
                          { v: 1, label: 'Đồ thị d-t' },
                          { v: 2, label: 'Đồ thị v-t' }
                        ]
                      : key === 'modeCharge'
                      ? [
                          { v: 1, label: 'Nạp tụ' },
                          { v: 0, label: 'Xả tụ' }
                        ]
                      : key === 'convexMode'
                      ? [
                          { v: 0, label: 'Gương Lõm' },
                          { v: 1, label: 'Gương Lồi' }
                        ]
                      : key === 'openEnd'
                      ? [
                          { v: 0, label: '2 đầu cố định' },
                          { v: 1, label: '1 đầu tự do' }
                        ]
                      : [
                          { v: 0, label: 'Đẳng nhiệt' },
                          { v: 1, label: 'Đẳng áp' },
                          { v: 2, label: 'Đẳng tích' }
                        ];

                  return (
                    <div
                      key={key}
                      className="rounded-sm bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 px-3 py-2 flex flex-col justify-between gap-1.5"
                    >
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                        {bound.label}
                      </span>
                      <div className={`grid gap-1.5 ${opts.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                        {opts.map((opt) => (
                          <button
                            key={opt.v}
                            type="button"
                            onClick={() => setParams((prev) => ({ ...prev, [key]: opt.v }))}
                            className={`py-1.5 px-2 rounded-sm text-[11px] font-bold transition-colors cursor-pointer ${
                              Math.round(curVal) === opt.v
                                ? 'bg-sky-600 text-white'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-400'
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
                  <InlineNumericParamField
                    key={key}
                    label={bound.label}
                    unit={bound.unit}
                    value={curVal}
                    min={bound.min}
                    max={bound.max}
                    step={bound.step}
                    onChange={(nextVal) =>
                      setParams((prev) => ({ ...prev, [key]: nextVal }))
                    }
                  />
                );
              })}
            </div>
          )}

          {flagControls.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Công tắc thí nghiệm:
              </span>
              {flagControls.map((fc) => (
                <button
                  key={fc.key}
                  type="button"
                  onClick={fc.toggle}
                  className={`px-2.5 py-1 rounded-sm text-[11px] font-bold border transition-colors cursor-pointer ${
                    fc.active
                      ? 'bg-sky-600 text-white border-sky-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-sky-400'
                  }`}
                >
                  {fc.label}
                </button>
              ))}
            </div>
          )}

          {telemetry.note && (
            <div className="flex items-start gap-2 rounded-sm bg-sky-50/90 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/60 px-3 py-1.5 text-[11px] text-slate-700 dark:text-slate-300">
              <Zap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{telemetry.note}</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
