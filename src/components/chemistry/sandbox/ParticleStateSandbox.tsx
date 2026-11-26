import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Flame, Gauge, Pause, Play, RotateCcw, Sparkles, Wind } from 'lucide-react';
import { useBackgroundTheme } from '../../../context/BackgroundContext';

type ParticleModeId = 'water_phase' | 'haber_nh3' | 'hi_eq' | 'ideal_gas';

interface ParticleAgent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  kind: 'A' | 'B' | 'P';
  flash: number;
}

const MODES: {
  id: ParticleModeId;
  title: string;
  formula: string;
  eaNoCat: number;
  eaCat: number;
  exothermic: boolean;
}[] = [
  { id: 'water_phase', title: 'Chuyển pha H₂O (Rắn – Lỏng – Khí)', formula: 'H₂O(s) ⇌ H₂O(l) ⇌ H₂O(g)', eaNoCat: 0, eaCat: 0, exothermic: false },
  { id: 'haber_nh3', title: 'Tổng hợp Amoniac (Haber)', formula: 'N₂ + 3H₂ ⇌ 2NH₃ (ΔH < 0)', eaNoCat: 68, eaCat: 34, exothermic: true },
  { id: 'hi_eq', title: 'Cân bằng Hiđro Iotua', formula: 'H₂ + I₂ ⇌ 2HI', eaNoCat: 52, eaCat: 26, exothermic: true },
  { id: 'ideal_gas', title: 'Khí Lí Tưởng & Va chạm', formula: 'P·V = n·R·T', eaNoCat: 0, eaCat: 0, exothermic: false },
];

export const ParticleStateSandbox: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const { perfMode } = useBackgroundTheme();
  const [modeId, setModeId] = useState<ParticleModeId>('haber_nh3');
  const [tempK, setTempK] = useState<number>(420);
  const [volumePct, setVolumePct] = useState<number>(75);
  const [catalystOn, setCatalystOn] = useState<boolean>(false);
  const [particleCount, setParticleCount] = useState<number>(64);
  const [playing, setPlaying] = useState<boolean>(true);
  const [telemetry, setTelemetry] = useState({
    pressureAtm: 2.1,
    rmsSpeed: 540,
    collisionsPerSec: 18,
    productPct: 24,
    phaseLabel: 'Khí (Gas)',
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const agentsRef = useRef<ParticleAgent[]>([]);
  const stateRef = useRef({ modeId, tempK, volumePct, catalystOn, playing });
  stateRef.current = { modeId, tempK, volumePct, catalystOn, playing };

  const activeMode = useMemo(() => MODES.find((m) => m.id === modeId) || MODES[0], [modeId]);

  const resetParticles = (count = particleCount, mId = modeId) => {
    const arr: ParticleAgent[] = [];
    for (let i = 0; i < count; i++) {
      const kind: 'A' | 'B' | 'P' =
        mId === 'water_phase' || mId === 'ideal_gas'
          ? 'A'
          : i % 4 === 0
          ? 'A'
          : i % 4 === 3
          ? 'P'
          : 'B';
      arr.push({
        x: 60 + ((i * 53) % 340),
        y: 60 + ((i * 37) % 190),
        vx: (((i % 7) - 3) || 1.4) * 32,
        vy: (((i % 5) - 2) || -1.2) * 32,
        kind,
        flash: 0,
      });
    }
    agentsRef.current = arr;
  };

  useEffect(() => {
    resetParticles(particleCount, modeId);
  }, [particleCount, modeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    let last = performance.now();
    let frameCount = 0;
    let collisionBucket = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.035, (now - last) / 1000);
      last = now;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const tw = Math.round(rect.width * dpr);
        const th = Math.round(rect.height * dpr);
        if (canvas.width !== tw || canvas.height !== th) {
          canvas.width = tw;
          canvas.height = th;
        }
        ctx.save();
        ctx.scale(dpr, dpr);
        const w = rect.width;
        const h = rect.height;
        const st = stateRef.current;

        ctx.fillStyle = '#060a14';
        ctx.fillRect(0, 0, w, h);

        // Chamber bounds controlled by volumePct (piston moves from right)
        const padL = 24;
        const padT = 26;
        const padB = 26;
        const maxChamberW = w - 48;
        const chamberW = Math.max(130, maxChamberW * (st.volumePct / 100));
        const chamberH = h - padT - padB;
        const rightWall = padL + chamberW;

        // Heat tint background inside chamber
        const heatRatio = Math.min(1, st.tempK / 1100);
        ctx.fillStyle = `rgba(${Math.round(14 + heatRatio * 95)}, ${Math.round(24 + heatRatio * 20)}, ${Math.round(48 - heatRatio * 25)}, 0.55)`;
        ctx.fillRect(padL, padT, chamberW, chamberH);

        // Catalyst bed at bottom if active
        if (st.catalystOn && (st.modeId === 'haber_nh3' || st.modeId === 'hi_eq')) {
          ctx.fillStyle = '#78350f';
          ctx.fillRect(padL + 2, padT + chamberH - 14, chamberW - 4, 14);
          for (let sx = padL + 16; sx < rightWall - 12; sx += 26) {
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(sx, padT + chamberH - 14, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Movable piston head on the right
        ctx.fillStyle = '#334155';
        ctx.fillRect(rightWall, padT - 4, 18, chamberH + 8);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(rightWall + 18, padT + chamberH / 2 - 8, Math.max(10, w - rightWall - 18), 16);

        // Chamber border
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(padL, padT, chamberW, chamberH);

        const agents = agentsRef.current;
        const speedFactor = Math.sqrt(Math.max(10, st.tempK) / 300);
        const isSolidPhase = st.modeId === 'water_phase' && st.tempK < 273;
        const isLiquidPhase = st.modeId === 'water_phase' && st.tempK >= 273 && st.tempK < 373;

        if (st.playing) {
          for (let i = 0; i < agents.length; i++) {
            const p = agents[i];
            if (p.flash > 0) p.flash = Math.max(0, p.flash - dt * 2.5);

            if (isSolidPhase) {
              // Lattice arrangement near bottom-left
              const cols = Math.max(5, Math.floor(chamberW / 24));
              const tx = padL + 22 + (i % cols) * 20;
              const ty = padT + chamberH - 22 - Math.floor(i / cols) * 20;
              const vib = (st.tempK / 273) * 2.6;
              p.x += (tx - p.x) * 0.14 + (Math.random() - 0.5) * vib;
              p.y += (ty - p.y) * 0.14 + (Math.random() - 0.5) * vib;
            } else {
              if (isLiquidPhase) {
                // Gravity pulls to bottom pool
                p.vy += 120 * dt;
                p.vx *= 0.992;
                p.vy *= 0.992;
              }
              p.x += p.vx * speedFactor * dt;
              p.y += p.vy * speedFactor * dt;

              if (p.x < padL + 8) {
                p.x = padL + 8;
                p.vx = Math.abs(p.vx);
              } else if (p.x > rightWall - 8) {
                p.x = rightWall - 8;
                p.vx = -Math.abs(p.vx);
              }
              if (p.y < padT + 8) {
                p.y = padT + 8;
                p.vy = Math.abs(p.vy);
              } else if (p.y > padT + chamberH - (st.catalystOn ? 20 : 8)) {
                p.y = padT + chamberH - (st.catalystOn ? 20 : 8);
                p.vy = isLiquidPhase ? -Math.abs(p.vy) * 0.55 - Math.random() * 14 : -Math.abs(p.vy);
              }
            }
          }

          // Pairwise collisions & chemical reaction / equilibrium
          const eaEff = st.catalystOn ? 32 : 64;
          for (let i = 0; i < agents.length; i++) {
            for (let j = i + 1; j < agents.length; j++) {
              const a = agents[i];
              const b = agents[j];
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < 225 && d2 > 0.1) {
                const d = Math.sqrt(d2);
                const nx = dx / d;
                const ny = dy / d;
                const overlap = 15 - d;
                a.x -= nx * overlap * 0.5;
                a.y -= ny * overlap * 0.5;
                b.x += nx * overlap * 0.5;
                b.y += ny * overlap * 0.5;

                const dvx = a.vx - b.vx;
                const dvy = a.vy - b.vy;
                const rel = dvx * nx + dvy * ny;
                if (rel > 0) {
                  a.vx -= rel * nx;
                  a.vy -= rel * ny;
                  b.vx += rel * nx;
                  b.vy += rel * ny;
                  collisionBucket++;

                  if (st.modeId === 'haber_nh3' || st.modeId === 'hi_eq') {
                    const energy = st.tempK * 0.14 + (100 - st.volumePct) * 0.28 + (st.catalystOn ? 24 : 0);
                    if (a.kind !== b.kind && a.kind !== 'P' && b.kind !== 'P' && energy > eaEff && Math.random() < 0.18) {
                      a.kind = 'P';
                      b.kind = 'P';
                      a.flash = 1;
                      b.flash = 1;
                    } else if (a.kind === 'P' && b.kind === 'P' && st.tempK > 680 && Math.random() < 0.14) {
                      // Endothermic reverse dissociation at very high T
                      a.kind = 'A';
                      b.kind = 'B';
                      a.flash = 0.8;
                    }
                  }
                }
              }
            }
          }
        }

        // Draw particles
        for (let i = 0; i < agents.length; i++) {
          const p = agents[i];
          const color =
            p.kind === 'P'
              ? '#10b981'
              : p.kind === 'B'
              ? '#f43f5e'
              : st.modeId === 'water_phase'
              ? isSolidPhase
                ? '#bae6fd'
                : isLiquidPhase
                ? '#0ea5e9'
                : '#38bdf8'
              : '#38bdf8';

          if (p.flash > 0.05 && perfMode !== 'smooth') {
            ctx.strokeStyle = `rgba(250, 204, 21, ${p.flash.toFixed(2)})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 11 + (1 - p.flash) * 8, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.kind === 'P' ? 7 : 5.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        frameCount++;
        if (frameCount % 15 === 0) {
          const prodCount = agents.filter((a) => a.kind === 'P').length;
          const pressureAtm = Number(((agents.length / 40) * (st.tempK / 300) * (100 / Math.max(25, st.volumePct)) * 1.1).toFixed(2));
          const rmsSpeed = Math.round(310 * Math.sqrt(Math.max(10, st.tempK) / 100));
          const phaseLabel =
            st.modeId === 'water_phase'
              ? st.tempK < 273
                ? 'Rắn (Băng tinh thể)'
                : st.tempK < 373
                ? 'Lỏng (H₂O lỏng)'
                : 'Khí (Hơi nước)'
              : st.catalystOn
              ? 'Có xúc tác (Ea hạ)'
              : 'Không xúc tác';
          setTelemetry({
            pressureAtm,
            rmsSpeed,
            collisionsPerSec: collisionBucket * 4,
            productPct: Math.round((prodCount / Math.max(1, agents.length)) * 100),
            phaseLabel,
          });
          collisionBucket = 0;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [perfMode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/45 p-4 space-y-2.5">
          <div className="font-bold text-sm text-slate-900 dark:text-white">Chọn hệ Vật lí Hạt &amp; Cân bằng</div>
          <div className="space-y-1.5">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setModeId(m.id)}
                className={`w-full text-left p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  m.id === modeId
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                }`}
              >
                <div className="font-bold">{m.title}</div>
                <div className={`font-mono text-[11px] mt-0.5 ${m.id === modeId ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {m.formula}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/45 p-4 space-y-3">
          <label className="block space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="inline-flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /> Nhiệt độ bình kín (T)</span>
              <span className="font-mono tabular-nums text-orange-600 dark:text-orange-400">
                {tempK} K ({tempK - 273} °C)
              </span>
            </div>
            <input type="range" min={120} max={1000} step={10} value={tempK} onChange={(e) => setTempK(Number(e.target.value))} className="w-full accent-orange-500" />
          </label>

          <label className="block space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="inline-flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-sky-500" /> Thể tích Piston (V)</span>
              <span className="font-mono tabular-nums text-sky-600 dark:text-sky-400">{volumePct} %</span>
            </div>
            <input type="range" min={30} max={100} step={5} value={volumePct} onChange={(e) => setVolumePct(Number(e.target.value))} className="w-full accent-sky-500" />
          </label>

          <label className="block space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="inline-flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-emerald-500" /> Số phân tử trong hộp</span>
              <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">{particleCount} hạt</span>
            </div>
            <input type="range" min={24} max={110} step={4} value={particleCount} onChange={(e) => setParticleCount(Number(e.target.value))} className="w-full accent-emerald-500" />
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setCatalystOn((c) => !c)}
              className={`flex-1 py-2 px-3 rounded-lg border font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                catalystOn
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{catalystOn ? 'Đã bật Chất xúc tác' : 'Thêm Chất xúc tác'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="py-2 px-3 rounded-lg bg-emerald-600 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{playing ? 'Dừng' : 'Chạy'}</span>
            </button>
            <button
              type="button"
              onClick={() => resetParticles(particleCount, modeId)}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-slate-200">
            <span className="font-bold">{activeMode.title}</span>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-sky-400">● Chất A</span>
              {(modeId === 'haber_nh3' || modeId === 'hi_eq') && (
                <>
                  <span className="text-rose-400">● Chất B</span>
                  <span className="text-emerald-400">● Sản phẩm</span>
                </>
              )}
            </div>
          </div>
          <canvas ref={canvasRef} className="w-full h-[310px] sm:h-[340px] block" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono tabular-nums">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
            <div className="text-slate-500 font-sans">Áp suất bình kín</div>
            <div className="text-lg font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">{telemetry.pressureAtm} atm</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
            <div className="text-slate-500 font-sans">Vận tốc trung bình</div>
            <div className="text-lg font-extrabold text-orange-600 dark:text-orange-400 mt-0.5">{telemetry.rmsSpeed} m/s</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
            <div className="text-slate-500 font-sans">Tần suất va chạm</div>
            <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{telemetry.collisionsPerSec}/s</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
            <div className="text-slate-500 font-sans">{modeId === 'water_phase' ? 'Trạng thái pha' : 'Tỉ lệ Sản phẩm'}</div>
            <div className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
              {modeId === 'water_phase' || modeId === 'ideal_gas' ? telemetry.phaseLabel : `${telemetry.productPct}%`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
