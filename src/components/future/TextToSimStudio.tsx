import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Pause, Play, RotateCcw, Sparkles, Wand2 } from 'lucide-react';
import { GeneratedSimConfig } from '../../types';
import { safeFetchJson } from '../../lib/apiClient';
import { FormattedText } from '../common/MathRenderer';

interface TextToSimStudioProps {
  language?: 'vi' | 'en';
}

const PRESET_SIMS: GeneratedSimConfig[] = [
  {
    engine: 'collision_1d',
    title: 'Va chạm đàn hồi 2 vật trên ray không ma sát',
    summary: 'Bảo toàn động lượng & động năng giữa 2 quả cầu khối lượng m₁, m₂.',
    formulaLatex: '$$m_1 v_1 + m_2 v_2 = m_1 v_1\' + m_2 v_2\'$$',
    parameters: [
      { key: 'm1', label: 'Khối lượng m₁', unit: 'kg', min: 1, max: 12, step: 0.5, value: 4 },
      { key: 'm2', label: 'Khối lượng m₂', unit: 'kg', min: 1, max: 12, step: 0.5, value: 2 },
      { key: 'v1', label: 'Vận tốc đầu v₁', unit: 'm/s', min: 1, max: 15, step: 0.5, value: 6 }
    ],
    notes: ['Vật nhẹ hơn bật ra nhanh hơn sau va chạm đàn hồi.', 'Tổng động lượng hệ cô lập luôn không đổi.']
  },
  {
    engine: 'wave_standing',
    title: 'Sóng dừng trên dây hai đầu cố định',
    summary: 'Giao thoa giữa sóng tới và sóng phản xạ tạo nút sóng và bụng sóng ổn định.',
    formulaLatex: '$$L = k \\frac{\\lambda}{2}, \\quad f_k = \\frac{k v}{2L}$$',
    parameters: [
      { key: 'k', label: 'Số bó sóng k', unit: 'bó', min: 1, max: 7, step: 1, value: 4 },
      { key: 'amp', label: 'Biên độ A', unit: 'cm', min: 10, max: 55, step: 2, value: 36 },
      { key: 'freq', label: 'Tần số rung', unit: 'Hz', min: 0.5, max: 4, step: 0.1, value: 1.8 }
    ],
    notes: ['Số nút = k + 1, số bụng = k.', 'Khoảng cách 2 nút liên tiếp bằng λ/2.']
  },
  {
    engine: 'optics_lens',
    title: 'Đường đi tia sáng qua Thấu kính Hội tụ',
    summary: 'Dịch chuyển vật AB để quan sát ảnh thật ngược chiều hoặc ảnh ảo cùng chiều.',
    formulaLatex: '$$\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}, \\quad k = -\\frac{d\'}{d}$$',
    parameters: [
      { key: 'f', label: 'Tiêu cự f', unit: 'cm', min: 40, max: 160, step: 5, value: 90 },
      { key: 'd', label: 'Khoảng cách vật d', unit: 'cm', min: 30, max: 260, step: 5, value: 150 },
      { key: 'h', label: 'Chiều cao vật h', unit: 'cm', min: 20, max: 70, step: 2, value: 44 }
    ],
    notes: ['Khi d > f cho ảnh thật ngược chiều.', 'Khi d < f đóng vai trò kính lúp tạo ảnh ảo lớn hơn vật.']
  },
  {
    engine: 'math_tangent',
    title: 'Tiếp tuyến trượt & Đạo hàm hàm bậc 3',
    summary: 'Quan sát hệ số góc tiếp tuyến k = f\'(x₀) đổi dấu qua hai điểm cực trị.',
    formulaLatex: '$$f(x) = a x^3 + b x, \\quad k = f\'(x_0) = 3a x_0^2 + b$$',
    parameters: [
      { key: 'a', label: 'Hệ số a', unit: '', min: 0.2, max: 1.5, step: 0.1, value: 0.5 },
      { key: 'b', label: 'Hệ số b', unit: '', min: -4, max: 2, step: 0.2, value: -1.8 },
      { key: 'x0', label: 'Hoành độ x₀', unit: '', min: -3, max: 3, step: 0.1, value: 0.8 }
    ],
    notes: ['Khi k = 0 tiếp tuyến song song trục hoành Ox (điểm cực trị).']
  }
];

export const TextToSimStudio: React.FC<TextToSimStudioProps> = () => {
  const [prompt, setPrompt] = useState(
    'Cho 2 quả cầu va chạm đàn hồi trên ray ngang không ma sát, hiển thị vector vận tốc và động lượng'
  );
  const [simConfig, setSimConfig] = useState<GeneratedSimConfig>(PRESET_SIMS[0]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const [simTime, setSimTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (playing) setSimTime((t) => t + dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const handleGenerate = async (customPrompt?: string) => {
    const q = (customPrompt ?? prompt).trim();
    if (!q) return;
    setLoading(true);
    setErrorMsg(null);
    const res = await safeFetchJson<{ success: boolean; config: GeneratedSimConfig }>(
      '/api/gemini/text-to-sim',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q, language: 'vi' })
      },
      30000
    );
    setLoading(false);
    if (!res.ok || !res.data?.config) {
      setErrorMsg(res.error || 'Chưa biên dịch được mô phỏng từ câu lệnh.');
      return;
    }
    setSimConfig(res.data.config);
    setSimTime(0);
    setPlaying(true);
  };

  const updateParam = (key: string, val: number) => {
    setSimConfig((prev) => ({
      ...prev,
      parameters: prev.parameters.map((p) => (p.key === key ? { ...p, value: val } : p))
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060f1f';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    for (let x = 0; x <= W; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    const p = (i: number, fb: number) => simConfig.parameters[i]?.value ?? fb;
    const eng = simConfig.engine;

    if (eng === 'collision_1d') {
      const m1 = p(0, 4);
      const m2 = p(1, 2);
      const v1 = p(2, 6);
      const v1p = ((m1 - m2) / (m1 + m2)) * v1;
      const v2p = ((2 * m1) / (m1 + m2)) * v1;

      const floorY = H - 64;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(30, floorY);
      ctx.lineTo(W - 30, floorY);
      ctx.stroke();

      const tCycle = simTime % 4.4;
      const tHit = 1.6;
      const hitX = W * 0.45;
      let x1 = hitX - 180 + (tCycle / tHit) * 155;
      let x2 = hitX + 25;
      if (tCycle >= tHit) {
        const dtHit = tCycle - tHit;
        x1 = hitX - 25 + v1p * dtHit * 22;
        x2 = hitX + 25 + v2p * dtHit * 22;
      }

      const r1 = 16 + m1 * 1.4;
      const r2 = 16 + m2 * 1.4;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(x1, floorY - r1, r1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(x2, floorY - r2, r2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(
        `Sau va chạm: v₁' = ${v1p.toFixed(2)} m/s | v₂' = ${v2p.toFixed(2)} m/s`,
        24,
        30
      );
    } else if (eng === 'wave_standing') {
      const k = Math.max(1, Math.round(p(0, 4)));
      const amp = p(1, 36);
      const freq = p(2, 1.8);
      const leftX = 48;
      const rightX = W - 48;
      const L = rightX - leftX;
      const midY = H / 2;

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.beginPath();
      ctx.moveTo(leftX, midY);
      ctx.lineTo(rightX, midY);
      ctx.stroke();

      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const u = i / 140;
        const y = amp * Math.sin(k * Math.PI * u) * Math.cos(simTime * freq * Math.PI * 2);
        const px = leftX + u * L;
        const py = midY - y;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      for (let n = 0; n <= k; n++) {
        ctx.beginPath();
        ctx.arc(leftX + (n / k) * L, midY, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`Số bó sóng k = ${k} · Số nút = ${k + 1}`, 24, 28);
    } else if (eng === 'optics_lens') {
      const f = p(0, 90);
      const d = p(1, 150);
      const h = p(2, 44);
      const cx = W / 2;
      const cy = H / 2;

      ctx.strokeStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(20, cy);
      ctx.lineTo(W - 20, cy);
      ctx.stroke();

      // Converging Lens
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 110);
      ctx.lineTo(cx, cy + 110);
      ctx.stroke();

      // Focal points
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx - f, cy, 4, 0, Math.PI * 2);
      ctx.arc(cx + f, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Object AB
      const objX = cx - d;
      const objTopY = cy - h;
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(objX, cy);
      ctx.lineTo(objX, objTopY);
      ctx.stroke();

      // Image A'B'
      const denom = d - f;
      const dp = Math.abs(denom) < 2 ? 9999 : (d * f) / denom;
      const hp = (-dp / d) * h;
      const imgX = cx + dp;
      const imgTopY = cy - hp;

      ctx.strokeStyle = dp > 0 ? '#f43f5e' : '#a78bfa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(cx, objTopY);
      ctx.lineTo(imgX, imgTopY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(imgX, imgTopY);
      ctx.stroke();

      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(imgX, cy);
      ctx.lineTo(imgX, imgTopY);
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`d' = ${dp.toFixed(1)} cm · Độ phóng đại k = ${(-dp / d).toFixed(2)}`, 24, 28);
    } else if (eng === 'math_tangent') {
      const a = p(0, 0.5);
      const b = p(1, -1.8);
      const x0 = p(2, 0.8);
      const cx = W / 2;
      const cy = H / 2;
      const sx = 54;
      const sy = 28;

      ctx.strokeStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(20, cy);
      ctx.lineTo(W - 20, cy);
      ctx.moveTo(cx, 20);
      ctx.lineTo(cx, H - 20);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let px = 30; px <= W - 30; px += 2) {
        const x = (px - cx) / sx;
        const y = a * x * x * x + b * x;
        const py = cy - y * sy;
        if (px === 30) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const y0 = a * x0 * x0 * x0 + b * x0;
      const slope = 3 * a * x0 * x0 + b;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const tx1 = x0 - 1.8;
      const ty1 = y0 + slope * (tx1 - x0);
      const tx2 = x0 + 1.8;
      const ty2 = y0 + slope * (tx2 - x0);
      ctx.moveTo(cx + tx1 * sx, cy - ty1 * sy);
      ctx.lineTo(cx + tx2 * sx, cy - ty2 * sy);
      ctx.stroke();

      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(cx + x0 * sx, cy - y0 * sy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`Tiếp điểm x₀ = ${x0.toFixed(1)} · Hệ số góc k = ${slope.toFixed(2)}`, 24, 28);
    } else {
      // incline_forces or projectile_drag dynamic preview
      const v0 = p(0, 14);
      const deg = p(1, 35);
      const mu = p(2, 0.12);
      const rad = (deg * Math.PI) / 180;
      const x0 = 90;
      const y0 = H - 44;
      const dx = 320;
      const dy = Math.min(180, dx * Math.tan(rad) * 0.65);

      ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 + dx, y0);
      ctx.lineTo(x0, y0 - dy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const acc = Math.max(0.2, 9.8 * (Math.sin(rad) - mu * Math.cos(rad)));
      const t = (simTime % 3.0) / 3.0;
      const bx = x0 + dx * (0.1 + 0.72 * t * t);
      const by = y0 - dy + dy * (0.1 + 0.72 * t * t);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(bx, by - 12, 13, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`v₀=${v0} · α=${deg}° · μ=${mu} · a=${acc.toFixed(2)} m/s²`, 24, 28);
    }
  }, [simConfig, simTime]);

  return (
    <div className="space-y-4">
      {/* Prompt Bar */}
      <div className="sci-frame rounded-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              TEXT-TO-INTERACTIVE SIMULATION ENGINE
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Gõ Câu Lệnh Tự Nhiên → AI Tự Dựng Phòng Thí Nghiệm Tương Tác
            </h3>
          </div>
          <Wand2 className="w-5 h-5 text-amber-500" />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Mô tả thí nghiệm muốn dựng (VD: Sóng dừng 5 bụng sóng, Thấu kính hội tụ f=100cm, Va chạm đàn hồi...)"
            className="flex-1 px-3 py-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => void handleGenerate()}
            className="cs-deck-btn px-4 py-2.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Đang biên dịch...' : 'Sinh Mô Phỏng Ngay'}</span>
          </button>
        </div>

        {errorMsg && <p className="text-xs text-rose-500">{errorMsg}</p>}

        <div className="flex flex-wrap gap-1.5">
          {PRESET_SIMS.map((pr, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setSimConfig(pr);
                setPrompt(pr.title);
                setSimTime(0);
              }}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold cursor-pointer ${
                simConfig.title === pr.title
                  ? 'bg-amber-500/20 border-amber-400 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {pr.title}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Runtime Stage */}
      <div className="sci-frame rounded-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{simConfig.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{simConfig.summary}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="px-3 py-1.5 rounded bg-sky-500 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{playing ? 'Tạm dừng' : 'Chạy'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSimTime(0)}
              className="p-1.5 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="px-3 py-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
          <FormattedText text={simConfig.formulaLatex} />
        </div>

        <canvas
          ref={canvasRef}
          width={760}
          height={320}
          className="w-full rounded-md border border-slate-800 bg-[#060f1f]"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {simConfig.parameters.map((param) => (
            <div
              key={param.key}
              className="p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1"
            >
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span>{param.label}</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                  {param.value} {param.unit}
                </span>
              </div>
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={param.value}
                onChange={(e) => updateParam(param.key, Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          ))}
        </div>

        {simConfig.notes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {simConfig.notes.map((n, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs text-sky-800 dark:text-sky-200"
              >
                • {n}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
