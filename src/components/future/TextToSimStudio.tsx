import React, { useState } from 'react';
import { Loader2, Pause, Play, RotateCcw, Sparkles, Wand2 } from 'lucide-react';
import { GeneratedSimConfig } from '../../types';
import { safeFetchJson } from '../../lib/apiClient';
import { FormattedText } from '../common/MathRenderer';
import { StemSim3DViewport } from './StemSim3DViewport';

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
  const [speedMult, setSpeedMult] = useState(1);
  const [resetSignal, setResetSignal] = useState(0);

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
    setResetSignal((r) => r + 1);
    setPlaying(true);
  };

  const updateParam = (key: string, val: number) => {
    setSimConfig((prev) => ({
      ...prev,
      parameters: prev.parameters.map((p) => (p.key === key ? { ...p, value: val } : p))
    }));
  };

  return (
    <div className="space-y-4">
      {/* Prompt Bar */}
      <div className="sci-frame rounded-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              TEXT-TO-3D INTERACTIVE SIMULATION ENGINE
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Gõ Câu Lệnh Tự Nhiên → AI Tự Dựng Phòng Thí Nghiệm 3D WebGL
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
            <span>{loading ? 'Đang biên dịch 3D...' : 'Sinh Mô Phỏng 3D'}</span>
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
                setResetSignal((r) => r + 1);
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

      {/* Interactive 3D Runtime Stage */}
      <div className="sci-frame rounded-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{simConfig.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{simConfig.summary}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setSpeedMult(spd)}
                className={`px-2 py-1 rounded border text-[11px] font-mono font-bold cursor-pointer ${
                  speedMult === spd
                    ? 'bg-amber-500/20 border-amber-400 text-amber-600 dark:text-amber-300'
                    : 'border-slate-300 dark:border-slate-700 text-slate-500'
                }`}
              >
                {spd}x
              </button>
            ))}
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
              onClick={() => setResetSignal((r) => r + 1)}
              className="p-1.5 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="px-3 py-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
          <FormattedText text={simConfig.formulaLatex} />
        </div>

        <StemSim3DViewport
          simKind={simConfig.engine}
          params={simConfig.parameters}
          playing={playing}
          speedMultiplier={speedMult}
          resetSignal={resetSignal}
          heightClass="h-[360px] sm:h-[410px]"
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
                • <FormattedText text={n} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
