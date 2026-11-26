import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, HeartPulse, Pill, RotateCcw, Wind, Zap } from 'lucide-react';
import { useBackgroundTheme } from '../../../context/BackgroundContext';

type StimulusId = 'none' | 'caffeine' | 'insulin_shot' | 'beta_blocker';

export const HumanPhysiologySandbox: React.FC<{ isEn?: boolean }> = () => {
  const { perfMode } = useBackgroundTheme();
  const [sugarIntake, setSugarIntake] = useState<number>(35); // grams carb load
  const [exerciseLevel, setExerciseLevel] = useState<number>(20); // 0..100 %
  const [sleepDeprivation, setSleepDeprivation] = useState<number>(10); // 0..100 %
  const [stimulus, setStimulus] = useState<StimulusId>('none');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [trace, setTrace] = useState<{ bpm: number; glucose: number }[]>([]);

  const physiology = useMemo(() => {
    const adrenalineBase =
      12 +
      exerciseLevel * 0.65 +
      sleepDeprivation * 0.35 +
      (stimulus === 'caffeine' ? 32 : stimulus === 'beta_blocker' ? -12 : 0);
    const adrenaline = Math.max(5, Math.min(100, Math.round(adrenalineBase)));

    const rawGlucose =
      88 +
      sugarIntake * 1.15 -
      exerciseLevel * 0.32 +
      sleepDeprivation * 0.18 +
      adrenaline * 0.14;
    const insulinBase =
      Math.max(5, (rawGlucose - 75) * 0.95) + (stimulus === 'insulin_shot' ? 45 : 0);
    const insulin = Math.max(5, Math.min(100, Math.round(insulinBase)));

    const bloodGlucose = Math.max(
      52,
      Math.min(260, Math.round(rawGlucose - insulin * 0.36))
    );

    let bpm =
      64 +
      exerciseLevel * 1.05 +
      sleepDeprivation * 0.18 +
      adrenaline * 0.28 +
      (stimulus === 'caffeine' ? 18 : 0);
    if (stimulus === 'beta_blocker') bpm *= 0.78;
    const heartRate = Math.max(48, Math.min(192, Math.round(bpm)));

    const respRate = Math.max(12, Math.min(44, Math.round(13 + exerciseLevel * 0.24 + adrenaline * 0.05)));
    const systolic = Math.round(108 + heartRate * 0.32 + adrenaline * 0.18);
    const diastolic = Math.round(68 + sleepDeprivation * 0.12 + adrenaline * 0.08);
    const cortisol = Math.min(100, Math.round(15 + sleepDeprivation * 0.72 + exerciseLevel * 0.12));

    const chainNotes: string[] = [];
    if (bloodGlucose > 145) {
      chainNotes.push('Đường huyết cao (>145 mg/dL) → Tế bào beta Tuyến tụy tăng tiết Insulin để đưa Glucose vào Gan & Cơ.');
    } else if (bloodGlucose < 70) {
      chainNotes.push('Hạ đường huyết (<70 mg/dL) → Tuyến tụy tiết Glucagon & Tuyến thượng thận tăng Adrenaline phân giải Glycogen.');
    } else {
      chainNotes.push('Đường huyết ổn định trong ngưỡng sinh lý (70–135 mg/dL) nhờ cân bằng Insulin / Glucagon.');
    }

    if (exerciseLevel >= 60) {
      chainNotes.push('Vận động cường độ cao → Cơ tiêu thụ ATP & Glucose nhanh, Tim & Phổi tăng nhịp để cấp O₂ và thải CO₂.');
    }
    if (sleepDeprivation >= 55) {
      chainNotes.push('Thiếu ngủ kéo dài → Cortisol tăng cao, giảm độ nhạy Insulin và gây căng thẳng hệ giao cảm.');
    }
    if (stimulus === 'caffeine') {
      chainNotes.push('Caffeine kích thích thụ thể giao cảm → tăng Adrenaline và nhịp tim tức thời.');
    } else if (stimulus === 'insulin_shot') {
      chainNotes.push('Tiêm Insulin ngoại sinh → kéo đường huyết xuống nhanh; cần theo dõi tránh hạ đường huyết.');
    } else if (stimulus === 'beta_blocker') {
      chainNotes.push('Thuốc chẹn Beta → ức chế tác động Adrenaline lên nút xoang, hạ nhịp tim & huyết áp.');
    }

    return {
      heartRate,
      respRate,
      bloodGlucose,
      insulin,
      adrenaline,
      cortisol,
      bp: `${systolic}/${diastolic}`,
      chainNotes,
    };
  }, [sugarIntake, exerciseLevel, sleepDeprivation, stimulus]);

  const physRef = useRef(physiology);
  physRef.current = physiology;

  useEffect(() => {
    const id = window.setInterval(() => {
      setTrace((prev) => [
        ...prev.slice(-39),
        { bpm: physRef.current.heartRate, glucose: physRef.current.bloodGlucose },
      ]);
    }, 450);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let raf = 0;
    const render = (now: number) => {
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
            const W = rect.width;
            const H = rect.height;
            const p = physRef.current;
            const t = now * 0.001;

            ctx.fillStyle = '#070d19';
            ctx.fillRect(0, 0, W, H);

            const cx = W * 0.5;
            const cy = H * 0.52;

            // Silhouette torso & head
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.38)';
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.lineWidth = 2;
            // Head
            ctx.beginPath();
            ctx.arc(cx, H * 0.14, 28, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Torso
            ctx.beginPath();
            ctx.roundRect(cx - 88, H * 0.24, 176, H * 0.64, 34);
            ctx.fill();
            ctx.stroke();

            // Lungs (breathing synced to respRate)
            const breath = 1 + Math.sin(t * (p.respRate / 60) * Math.PI * 2) * 0.09;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(cx - 38, H * 0.39, 24 * breath, 36 * breath, -0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(cx + 38, H * 0.39, 24 * breath, 36 * breath, 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Heart (beating synced to heartRate)
            const beatPhase = (t * (p.heartRate / 60)) % 1;
            const pulse = beatPhase < 0.18 ? 1 + Math.sin((beatPhase / 0.18) * Math.PI) * 0.18 : 1;
            ctx.fillStyle = '#e11d48';
            ctx.strokeStyle = '#fda4af';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(cx + 6, H * 0.41, 16 * pulse, 21 * pulse, 0.22, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Liver (glycogen buffer)
            ctx.fillStyle = 'rgba(180, 83, 9, 0.65)';
            ctx.strokeStyle = '#f59e0b';
            ctx.beginPath();
            ctx.ellipse(cx - 26, H * 0.56, 30, 14, -0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Pancreas (glow intensity proportional to insulin secretion)
            const insGlow = 0.25 + (p.insulin / 100) * 0.7;
            ctx.fillStyle = `rgba(250, 204, 21, ${insGlow.toFixed(2)})`;
            ctx.strokeStyle = '#fde047';
            ctx.beginPath();
            ctx.ellipse(cx + 22, H * 0.6, 22, 8, 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Adrenal glands (glow proportional to adrenaline)
            const adrGlow = 0.2 + (p.adrenaline / 100) * 0.75;
            ctx.fillStyle = `rgba(192, 132, 252, ${adrGlow.toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(cx - 28, H * 0.69, 8, 0, Math.PI * 2);
            ctx.arc(cx + 28, H * 0.69, 8, 0, Math.PI * 2);
            ctx.fill();

            // Circulating glucose / hormone particles along central aorta
            if (!perfMode) {
              const flowSpeed = 0.5 + (p.heartRate / 60) * 0.8;
              const numP = Math.min(24, 6 + Math.round(p.bloodGlucose / 16));
              for (let i = 0; i < numP; i++) {
                const f = (t * flowSpeed + i / numP) % 1;
                const py = H * 0.25 + f * (H * 0.6);
                const px = cx + Math.sin(f * 10 + i) * 14;
                ctx.fillStyle = i % 3 === 0 ? '#fde047' : '#fb7185';
                ctx.beginPath();
                ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                ctx.fill();
              }
            }

            // Callout Labels positioned clearly on left/right sides
            ctx.font = 'bold 11px sans-serif';
            ctx.fillStyle = '#93c5fd';
            ctx.textAlign = 'left';
            ctx.fillText(`Phổi (${p.respRate} lần/phút)`, 16, H * 0.38);
            ctx.fillStyle = '#fcd34d';
            ctx.fillText('Gan (Dự trữ Glycogen)', 16, H * 0.56);
            ctx.fillStyle = '#d8b4fe';
            ctx.fillText(`Thượng thận (Adrenaline ${p.adrenaline}%)`, 16, H * 0.7);

            ctx.textAlign = 'right';
            ctx.fillStyle = '#fda4af';
            ctx.fillText(`Tim (${p.heartRate} BPM)`, W - 16, H * 0.41);
            ctx.fillStyle = '#fde047';
            ctx.fillText(`Tụy (Insulin ${p.insulin}%)`, W - 16, H * 0.6);

            ctx.restore();
          }
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Animated Organ Canvas */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-[390px] sm:h-[430px] block" />
        </div>

        {/* Right: Nutrition/Activity Sliders + Telemetry + Chain Reactions */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span>Điều chỉnh Chế độ Dinh dưỡng &amp; Trạng thái Cơ thể</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                setSugarIntake(35);
                setExerciseLevel(20);
                setSleepDeprivation(10);
                setStimulus('none');
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cân bằng lại</span>
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Lượng đường / Tinh bột nạp vào</span>
                <span className="font-mono tabular-nums text-amber-600 dark:text-amber-400">{sugarIntake} g</span>
              </div>
              <input type="range" min={0} max={150} value={sugarIntake} onChange={(e) => setSugarIntake(Number(e.target.value))} className="w-full accent-amber-500" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Cường độ vận động</span>
                <span className="font-mono tabular-nums text-rose-600 dark:text-rose-400">{exerciseLevel}%</span>
              </div>
              <input type="range" min={0} max={100} value={exerciseLevel} onChange={(e) => setExerciseLevel(Number(e.target.value))} className="w-full accent-rose-500" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Mức độ thiếu ngủ / Stress</span>
                <span className="font-mono tabular-nums text-purple-600 dark:text-purple-400">{sleepDeprivation}%</span>
              </div>
              <input type="range" min={0} max={100} value={sleepDeprivation} onChange={(e) => setSleepDeprivation(Number(e.target.value))} className="w-full accent-purple-500" />
            </label>
          </div>

          {/* Pharmacological / Stimulus Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {([
              { id: 'none', label: 'Không dùng chất' },
              { id: 'caffeine', label: 'Caffeine / Kích thích' },
              { id: 'insulin_shot', label: 'Tiêm Insulin' },
              { id: 'beta_blocker', label: 'Thuốc chẹn Beta' },
            ] as { id: StimulusId; label: string }[]).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStimulus(st.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                  stimulus === st.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <Pill className="w-3.5 h-3.5" />
                <span>{st.label}</span>
              </button>
            ))}
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5">
              <div className="text-[11px] text-slate-500 flex items-center gap-1"><Activity className="w-3 h-3 text-rose-500" /> Nhịp tim</div>
              <div className="text-base font-mono font-extrabold tabular-nums text-rose-600 dark:text-rose-400">{physiology.heartRate} BPM</div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5">
              <div className="text-[11px] text-slate-500">Đường huyết</div>
              <div className="text-base font-mono font-extrabold tabular-nums text-amber-600 dark:text-amber-400">{physiology.bloodGlucose} mg/dL</div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5">
              <div className="text-[11px] text-slate-500 flex items-center gap-1"><Wind className="w-3 h-3 text-sky-500" /> Huyết áp</div>
              <div className="text-base font-mono font-extrabold tabular-nums text-sky-600 dark:text-sky-400">{physiology.bp}</div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5">
              <div className="text-[11px] text-slate-500 flex items-center gap-1"><Zap className="w-3 h-3 text-purple-500" /> Cortisol</div>
              <div className="text-base font-mono font-extrabold tabular-nums text-purple-600 dark:text-purple-400">{physiology.cortisol}%</div>
            </div>
          </div>

          {/* Live Multi-Channel Sparkline */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 p-2.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span className="text-rose-400">─ Nhịp tim (BPM)</span>
              <span className="text-amber-400">─ Đường huyết (mg/dL)</span>
            </div>
            <svg viewBox="0 0 320 46" className="w-full h-11 overflow-visible">
              {trace.length > 1 && (
                <>
                  <polyline
                    fill="none"
                    stroke="#fb7185"
                    strokeWidth="2"
                    points={trace
                      .map((pt, i) => `${((i / (trace.length - 1)) * 320).toFixed(1)},${(44 - ((pt.bpm - 45) / 150) * 40).toFixed(1)}`)
                      .join(' ')}
                  />
                  <polyline
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    points={trace
                      .map((pt, i) => `${((i / (trace.length - 1)) * 320).toFixed(1)},${(44 - ((pt.glucose - 50) / 210) * 40).toFixed(1)}`)
                      .join(' ')}
                  />
                </>
              )}
            </svg>
          </div>

          {/* Physiological Chain Reactions */}
          <div className="space-y-1.5 text-xs">
            {physiology.chainNotes.map((n, idx) => (
              <div key={idx} className="rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-700 dark:text-slate-200">
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
