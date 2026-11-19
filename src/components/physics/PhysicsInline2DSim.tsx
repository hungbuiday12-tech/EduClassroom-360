import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Box,
  Compass,
  Grid,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  StepForward,
  Zap
} from 'lucide-react';
import { PhysicsLesson } from '../../types';
import { PHYSICS_2D_SIMS } from '../../data/physicsDomainsData';
import {
  DEFAULT_PHYSICS_2D_FLAGS,
  DEFAULT_PHYSICS_2D_OVERLAYS,
  Physics2DFlags,
  Physics2DOverlayState,
  Physics2DTelemetry,
  renderPhysics2DSimulation
} from './physics2DEngine';

interface PhysicsInline2DSimProps {
  lesson: PhysicsLesson;
  stepIndex: number;
  totalSteps: number;
  stepTitle?: string;
  onOpenSim2D?: () => void;
  onOpenSim3D?: () => void;
}

interface StepRegimeConfig {
  label: string;
  observationGoal: string;
  params: Record<string, number>;
  flags: Physics2DFlags;
}

function clampAndSnap(val: number, min: number, max: number, step: number): number {
  const clamped = Math.min(max, Math.max(min, val));
  const steps = Math.round((clamped - min) / step);
  const decimals = (step.toString().split('.')[1] || '').length;
  return Number((min + steps * step).toFixed(Math.max(decimals, 2)));
}

function deriveStepRegime(lesson: PhysicsLesson, stepIndex: number): StepRegimeConfig {
  const baseParams = { ...lesson.defaultParams };
  const baseFlags: Physics2DFlags = { ...DEFAULT_PHYSICS_2D_FLAGS };
  const boundsEntries = Object.entries(lesson.paramBounds || {});
  const simType = lesson.simulationType;

  // Step 0: Chuẩn mực khái niệm cơ bản
  if (stepIndex === 0) {
    return {
      label: 'Trạng thái cơ bản · Quan sát hiện tượng nền',
      observationGoal:
        'Quan sát chuyển động/hiện tượng ở tham số chuẩn trước khi kéo thanh trượt để kiểm nghiệm mối quan hệ định luật.',
      params: baseParams,
      flags: baseFlags
    };
  }

  // Clone and craft step-specific instructive presets
  const nextParams = { ...baseParams };
  const nextFlags = { ...baseFlags };

  if (stepIndex === 1) {
    // Khảo sát định luật / công thức: tăng hoặc tối ưu thông số chính để thấy biến thiên định lượng
    if (boundsEntries.length > 0) {
      const [k0, b0] = boundsEntries[0];
      const cur0 = nextParams[k0] ?? b0.min;
      const midHi = cur0 + (b0.max - cur0) * 0.42;
      nextParams[k0] = clampAndSnap(midHi, b0.min, b0.max, b0.step);
    }
    return {
      label: 'Khảo sát định lượng · Thay đổi thông số chính',
      observationGoal:
        'Tham số chính đã được tăng lên để bạn thấy rõ tốc độ biến thiên của các đại lượng trên thanh đo SI trực tiếp.',
      params: nextParams,
      flags: nextFlags
    };
  }

  if (stepIndex === 2) {
    // Trường hợp đặc biệt / Giới hạn vật lí theo từng loại mô phỏng
    if (simType === 'lens_optics' && nextParams.f != null) {
      // Đặt vật trong khoảng d < f để thấy ảnh ảo phóng đại (kính lúp)
      const fVal = Math.abs(nextParams.f || 15);
      const bD = lesson.paramBounds.d;
      if (bD) {
        nextParams.d = clampAndSnap(Math.max(bD.min, fVal * 0.65), bD.min, bD.max, bD.step);
      }
      return {
        label: 'Trường hợp đặc biệt · Vật trong tiêu cự (d < f)',
        observationGoal:
          'Khi đưa vật vào gần thấu kính hơn tiêu cự F (d < f), tia ló phân kì cho ảnh ảo cùng chiều, lớn hơn vật.',
        params: nextParams,
        flags: nextFlags
      };
    }

    if (simType === 'projectile_motion' && nextParams.angle != null) {
      nextParams.angle = 45;
      return {
        label: 'Cực trị động học · Góc ném tối ưu α = 45°',
        observationGoal:
          'Tại α = 45° (không có lực cản không khí), tầm xa L đạt giá trị cực đại với cùng vận tốc ban đầu v₀.',
        params: nextParams,
        flags: nextFlags
      };
    }

    if (simType === 'ohm_circuit' && boundsEntries.length >= 2) {
      nextParams.circuitType = 1;
      return {
        label: 'Biến thể mạch điện · Mắc song song (U₁ = U₂)',
        observationGoal:
          'So sánh cường độ dòng điện tổng I và độ sáng đèn khi chuyển sang mạch song song làm giảm Rtđ.',
        params: nextParams,
        flags: nextFlags
      };
    }

    if (boundsEntries.length >= 2) {
      const [k1, b1] = boundsEntries[1];
      const cur1 = nextParams[k1] ?? b1.min;
      const target1 = cur1 + (b1.max - cur1) * 0.55;
      nextParams[k1] = clampAndSnap(target1, b1.min, b1.max, b1.step);
    } else if (boundsEntries.length === 1) {
      const [k0, b0] = boundsEntries[0];
      nextParams[k0] = clampAndSnap(b0.min + (b0.max - b0.min) * 0.8, b0.min, b0.max, b0.step);
    }

    return {
      label: 'Thử nghiệm mở rộng · Thay đổi tham số thứ cấp',
      observationGoal:
        'Thay đổi thông số thứ cấp giúp kiểm tra vai trò của từng biến độc lập trong công thức vật lí.',
      params: nextParams,
      flags: nextFlags
    };
  }

  // Step 3+: Thực tế / Lỗi sai cần tránh / Ma sát / Tán sắc / Ngắt mạch
  if (simType === 'projectile_motion' || simType === 'free_fall_energy') {
    nextFlags.airDrag = true;
    return {
      label: 'Điều kiện thực tế · Bật lực cản không khí',
      observationGoal:
        'Quan sát sự hao hụt cơ năng / thu hẹp tầm xa khi xuất hiện lực cản môi trường — lỗi sai hay gặp khi áp dụng máy móc công thức lí tưởng!',
      params: nextParams,
      flags: nextFlags
    };
  }

  if (simType === 'spring_pendulum' || simType === 'simple_pendulum') {
    nextFlags.hasFriction = true;
    return {
      label: 'Điều kiện thực tế · Dao động tắt dần có ma sát',
      observationGoal:
        'Biên độ giảm dần theo hàm mũ vì công của lực ma sát chuyển hóa cơ năng thành nhiệt năng.',
      params: nextParams,
      flags: nextFlags
    };
  }

  if (simType === 'lens_optics') {
    nextFlags.isDiverging = true;
    return {
      label: 'So sánh đối chiếu · Chuyển sang Thấu kính phân kì',
      observationGoal:
        'Nhận biết bẫy dấu tiêu cự f < 0: Thấu kính phân kì luôn tạo ảnh ảo, cùng chiều và nhỏ hơn vật.',
      params: nextParams,
      flags: nextFlags
    };
  }

  if (simType === 'magnetic_induction') {
    nextFlags.flipMagnet = true;
    return {
      label: 'Kiểm chứng định luật Len-xơ · Đảo cực nam châm',
      observationGoal:
        'Khi đảo chiều cực Bắc–Nam của nam châm, chiều dòng điện cảm ứng i_c và kim điện kế đảo dấu ngược lại.',
      params: nextParams,
      flags: nextFlags
    };
  }

  if (simType === 'wave_interference') {
    nextFlags.showNodalLines = true;
    return {
      label: 'Phân tích vân cực đại – cực tiểu giao thoa',
      observationGoal:
        'Quan sát số dãy hyperbol cực đại nằm giữa hai nguồn S1S2 và điều chỉnh khoảng cách/tần số để thấy vân thay đổi.',
      params: nextParams,
      flags: nextFlags
    };
  }

  if (boundsEntries.length > 0) {
    const idxParam = stepIndex % boundsEntries.length;
    const [kp, bp] = boundsEntries[idxParam];
    const ratio = stepIndex % 2 === 1 ? 0.22 : 0.85;
    nextParams[kp] = clampAndSnap(bp.min + (bp.max - bp.min) * ratio, bp.min, bp.max, bp.step);
  }

  return {
    label: `Thực hành trực quan · Kịch bản #${stepIndex + 1}`,
    observationGoal:
      'Kéo các thanh trượt bên dưới để tự kiểm chứng điều kiện áp dụng công thức và phát hiện trường hợp giới hạn.',
    params: nextParams,
    flags: nextFlags
  };
}

export const PhysicsInline2DSim: React.FC<PhysicsInline2DSimProps> = ({
  lesson,
  stepIndex,
  totalSteps,
  onOpenSim2D,
  onOpenSim3D
}) => {
  const simSpec = PHYSICS_2D_SIMS[lesson.simulationType];
  const regime = useMemo(() => deriveStepRegime(lesson, stepIndex), [lesson, stepIndex]);

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [params, setParams] = useState<Record<string, number>>(regime.params);
  const [flags, setFlags] = useState<Physics2DFlags>(regime.flags);
  const [overlays, setOverlays] = useState<Physics2DOverlayState>(DEFAULT_PHYSICS_2D_OVERLAYS);

  const [telemetry, setTelemetry] = useState<Physics2DTelemetry>({
    metric1Label: 'Thông số 1',
    metric1Val: '--',
    metric2Label: 'Thông số 2',
    metric2Val: '--',
    metric3Label: 'Thông số 3',
    metric3Val: '--',
    note: regime.observationGoal
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

  // Sync step regime when moving between lessons or lecture steps
  useEffect(() => {
    setParams(regime.params);
    setFlags(regime.flags);
    paramsRef.current = regime.params;
    flagsRef.current = regime.flags;
    simTimeRef.current = 0;
    oscHistoryRef.current = [];
    setIsRunning(true);
    isRunningRef.current = true;
    forceTelemetryRef.current = true;
  }, [lesson.id, stepIndex, regime]);

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

  // 60 FPS Canvas Animation Loop
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

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = cachedW || canvas.clientWidth;
      const h = cachedH || canvas.clientHeight;
      if (w <= 0 || h <= 0) return;

      const targetCw = Math.floor(w * dpr);
      const targetCh = Math.floor(h * dpr);
      if (canvas.width !== targetCw || canvas.height !== targetCh) {
        canvas.width = targetCw;
        canvas.height = targetCh;
      }

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      renderPhysics2DSimulation({
        simType: lesson.simulationType,
        ctx,
        w,
        h,
        t: simTimeRef.current,
        isDark: cachedDark,
        isRunning: isRunningRef.current,
        params: paramsRef.current,
        flags: flagsRef.current,
        overlays: overlaysRef.current,
        oscHistory: oscHistoryRef.current,
        pushTelemetry
      });

      ctx.restore();
    };

    animIdRef.current = requestAnimationFrame(frame);
    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      resizeObs?.disconnect();
      classObs.disconnect();
    };
  }, [lesson.simulationType, pushTelemetry]);

  const handleStepOnce = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    simTimeRef.current += 0.05;
    forceTelemetryRef.current = true;
  };

  const handleResetStep = () => {
    simTimeRef.current = 0;
    oscHistoryRef.current = [];
    setParams(regime.params);
    setFlags(regime.flags);
    paramsRef.current = regime.params;
    flagsRef.current = regime.flags;
    setIsRunning(true);
    forceTelemetryRef.current = true;
  };

  const quickSliders = useMemo(
    () => Object.entries(lesson.paramBounds || {}).slice(0, 3),
    [lesson.paramBounds]
  );

  // Contextual experiment toggles relevant to the active physics simulation
  const flagControls = useMemo(() => {
    const controls: { key: keyof Physics2DFlags; label: string; active: boolean; toggle: () => void }[] = [];
    const sim = lesson.simulationType;
    if (sim === 'ohm_circuit') {
      controls.push(
        {
          key: 'circuitOpen',
          label: flags.circuitOpen ? 'Mở khóa K' : 'Đóng khóa K',
          active: flags.circuitOpen,
          toggle: () => setFlags((f) => ({ ...f, circuitOpen: !f.circuitOpen }))
        },
        {
          key: 'reversePolarity',
          label: 'Đảo cực nguồn',
          active: flags.reversePolarity,
          toggle: () => setFlags((f) => ({ ...f, reversePolarity: !f.reversePolarity }))
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
    } else if (sim === 'spring_pendulum' || sim === 'simple_pendulum') {
      controls.push({
        key: 'hasFriction',
        label: 'Ma sát tắt dần',
        active: flags.hasFriction,
        toggle: () => setFlags((f) => ({ ...f, hasFriction: !f.hasFriction }))
      });
    } else if (sim === 'magnetic_induction') {
      controls.push({
        key: 'flipMagnet',
        label: 'Đảo cực N/S',
        active: flags.flipMagnet,
        toggle: () => setFlags((f) => ({ ...f, flipMagnet: !f.flipMagnet }))
      });
    } else if (sim === 'wave_interference') {
      controls.push(
        {
          key: 'showNodalLines',
          label: 'Vân cực đại',
          active: flags.showNodalLines,
          toggle: () => setFlags((f) => ({ ...f, showNodalLines: !f.showNodalLines }))
        },
        {
          key: 'singleSource',
          label: '1 nguồn đơn',
          active: flags.singleSource,
          toggle: () => setFlags((f) => ({ ...f, singleSource: !f.singleSource }))
        }
      );
    }
    return controls;
  }, [lesson.simulationType, flags]);

  return (
    <section className="rm-arch-frame rounded-md border border-sky-200/90 dark:border-sky-800/70 bg-white dark:bg-slate-950/90 overflow-hidden shadow-xs">
      <div className="h-0.5 w-full roadmap-shimmer-bar" />

      {/* Header bar */}
      <div className="px-4 py-2.5 bg-sky-50/80 dark:bg-slate-900/95 border-b border-sky-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono font-extrabold uppercase tracking-wider bg-sky-600 text-white shrink-0">
            <span className="w-1.5 h-1.5 bg-emerald-300 arena-live-dot" />
            Mô phỏng 2D Trực tiếp · Phần {stepIndex + 1}/{totalSteps}
          </span>
          <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">
            {simSpec?.title || lesson.title}
          </span>
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

      {/* Step Regime Banner */}
      <div className="px-4 py-2 bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-300 font-bold">
          <Activity className="w-3.5 h-3.5 shrink-0" />
          <span>{regime.label}</span>
        </div>
        <span className="text-slate-600 dark:text-slate-400 leading-snug">
          {regime.observationGoal}
        </span>
      </div>

      {/* Live Canvas Stage */}
      <div className="relative bg-slate-50 dark:bg-[#0c101d] border-b border-slate-200/80 dark:border-slate-800">
        <canvas
          ref={canvasRef}
          className="w-full h-[240px] sm:h-[268px] block select-none"
        />

        {/* Floating Overlay Transport Toolbar (bottom-left over canvas) */}
        <div className="absolute bottom-2.5 left-2.5 flex flex-wrap items-center gap-1 bg-white/92 dark:bg-slate-900/92 border border-slate-200 dark:border-slate-700 rounded-sm p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setIsRunning((r) => !r)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[11px] font-bold cursor-pointer transition-colors ${
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
            className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            <StepForward className="w-3 h-3" />
            <span>+0.05s</span>
          </button>

          <button
            type="button"
            onClick={handleResetStep}
            title="Khôi phục kịch bản bước này"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {[0.5, 1, 1.5].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => setSimSpeed(spd)}
              className={`px-1.5 py-0.5 rounded-sm text-[10px] font-mono font-bold tabular-nums cursor-pointer ${
                simSpeed === spd
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {spd}x
            </button>
          ))}

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

          <button
            type="button"
            onClick={() => setOverlays((o) => ({ ...o, showVectors: !o.showVectors }))}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-bold cursor-pointer ${
              overlays.showVectors
                ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300'
                : 'text-slate-500 dark:text-slate-400'
            }`}
            title="Bật/tắt vectơ"
          >
            <Compass className="w-3 h-3" />
            <span>Vectơ</span>
          </button>
          <button
            type="button"
            onClick={() => setOverlays((o) => ({ ...o, showRulerGrid: !o.showRulerGrid }))}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-bold cursor-pointer ${
              overlays.showRulerGrid
                ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300'
                : 'text-slate-500 dark:text-slate-400'
            }`}
            title="Bật/tắt lưới đo"
          >
            <Grid className="w-3 h-3" />
            <span>Lưới</span>
          </button>
        </div>
      </div>

      {/* Live SI Telemetry Readout Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 bg-slate-50/75 dark:bg-slate-900/75 border-b border-slate-200/80 dark:border-slate-800">
        <div className="px-3.5 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 truncate">
            {telemetry.metric1Label}
          </div>
          <div className="text-xs sm:text-sm font-mono font-extrabold text-sky-700 dark:text-sky-300 tabular-nums mt-0.5">
            {telemetry.metric1Val}
          </div>
        </div>
        <div className="px-3.5 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 truncate">
            {telemetry.metric2Label}
          </div>
          <div className="text-xs sm:text-sm font-mono font-extrabold text-emerald-700 dark:text-emerald-300 tabular-nums mt-0.5">
            {telemetry.metric2Val}
          </div>
        </div>
        <div className="px-3.5 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 truncate">
            {telemetry.metric3Label}
          </div>
          <div className="text-xs sm:text-sm font-mono font-extrabold text-amber-700 dark:text-amber-300 tabular-nums mt-0.5">
            {telemetry.metric3Val}
          </div>
        </div>
      </div>

      {/* Parameter Sliders + Flags + Scientific Note */}
      <div className="p-3.5 space-y-2.5 bg-white dark:bg-slate-950/80">
        {(quickSliders.length > 0 || flagControls.length > 0) && (
          <div className="space-y-2.5">
            {quickSliders.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {quickSliders.map(([key, bound]) => {
                  const val = params[key] ?? lesson.defaultParams[key] ?? bound.min;
                  return (
                    <div
                      key={key}
                      className="p-2 rounded-sm bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 truncate">
                          <Sliders className="w-3 h-3 text-sky-500 shrink-0" />
                          <span className="truncate">{bound.label}</span>
                        </span>
                        <span className="font-mono font-bold text-sky-700 dark:text-sky-300 tabular-nums shrink-0">
                          {val} {bound.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={bound.min}
                        max={bound.max}
                        step={bound.step}
                        value={Math.min(bound.max, Math.max(bound.min, val))}
                        onChange={(e) => {
                          const nextVal = parseFloat(e.target.value);
                          setParams((prev) => ({ ...prev, [key]: nextVal }));
                        }}
                        className="w-full accent-sky-600 cursor-pointer h-1.5"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {flagControls.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
                  Công tắc thí nghiệm:
                </span>
                {flagControls.map((ctrl) => (
                  <button
                    key={String(ctrl.key)}
                    type="button"
                    onClick={ctrl.toggle}
                    className={`px-2.5 py-1 rounded-sm text-[11px] font-bold border transition-colors cursor-pointer ${
                      ctrl.active
                        ? 'bg-sky-600 text-white border-sky-500'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                    }`}
                  >
                    {ctrl.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-start gap-2 px-3 py-2 rounded-sm bg-sky-50/70 dark:bg-sky-950/25 border border-sky-200/60 dark:border-sky-900/50 text-[11px] text-slate-700 dark:text-slate-200 leading-relaxed">
          <Zap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <span>{telemetry.note}</span>
        </div>
      </div>
    </section>
  );
};
