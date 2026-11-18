import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Waves, Sparkles, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

type PlateShape = 'square' | 'circle' | 'hexagon';

interface ChladniPreset {
  labelVi: string;
  labelEn: string;
  freq: number;
  n: number;
  m: number;
  a: number;
  b: number;
  shape: PlateShape;
}

const CHLADNI_PRESETS: ChladniPreset[] = [
  { labelVi: 'Chữ thập Cộng hưởng', labelEn: 'Resonant Cross', freq: 260, n: 1, m: 3, a: 1, b: -1, shape: 'square' },
  { labelVi: 'Hoa văn Bướm (2,5)', labelEn: 'Butterfly Mode (2,5)', freq: 620, n: 2, m: 5, a: 1, b: 1, shape: 'square' },
  { labelVi: 'Ngôi sao 8 cánh (3,7)', labelEn: '8-Point Star (3,7)', freq: 1180, n: 3, m: 7, a: 1, b: -1, shape: 'circle' },
  { labelVi: 'Mạng Tinh thể (4,9)', labelEn: 'Crystal Lattice (4,9)', freq: 1940, n: 4, m: 9, a: 1, b: 1, shape: 'square' },
  { labelVi: 'Lục giác Sóng đứng', labelEn: 'Hexagonal Mode', freq: 2480, n: 5, m: 8, a: 1, b: -0.8, shape: 'hexagon' }
];

const PARTICLE_COUNT = 12000;

export const ChladniPlateLab: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [plateShape, setPlateShape] = useState<PlateShape>('square');
  const [frequency, setFrequency] = useState<number>(620);
  const [modeN, setModeN] = useState<number>(2);
  const [modeM, setModeM] = useState<number>(5);
  const [coeffA, setCoeffA] = useState<number>(1);
  const [coeffB, setCoeffB] = useState<number>(1);
  const [vibrationPower, setVibrationPower] = useState<number>(1.0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [sandPalette, setSandPalette] = useState<'gold' | 'cyan' | 'emerald'>('gold');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Float32Array | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stateRef = useRef({
    plateShape,
    modeN,
    modeM,
    coeffA,
    coeffB,
    vibrationPower,
    sandPalette,
    frequency
  });
  stateRef.current = {
    plateShape,
    modeN,
    modeM,
    coeffA,
    coeffB,
    vibrationPower,
    sandPalette,
    frequency
  };

  const scatterSand = () => {
    const arr = new Float32Array(PARTICLE_COUNT * 2);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 2] = Math.random() * 2 - 1;
      arr[i * 2 + 1] = Math.random() * 2 - 1;
    }
    particlesRef.current = arr;
  };

  useEffect(() => {
    scatterSand();
  }, []);

  // Derive n, m smoothly when slider moves in manual sweep
  const handleFreqChange = (hz: number) => {
    setFrequency(hz);
    const norm = (hz - 80) / 3120;
    const nextN = Math.max(1, Math.min(8, Math.round(1 + norm * 6.5)));
    const nextM = Math.max(2, Math.min(11, Math.round(2 + norm * 8.5 + (hz % 120 > 60 ? 1 : 0))));
    setModeN(nextN);
    setModeM(nextN === nextM ? nextM + 1 : nextM);
  };

  // Real WebAudio Sound Synthesizer
  useEffect(() => {
    if (!soundEnabled) {
      try {
        gainRef.current?.gain.setTargetAtTime(0, audioCtxRef.current?.currentTime || 0, 0.04);
      } catch {}
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = frequency;
        gain.gain.value = 0.035;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        audioCtxRef.current = ctx;
        oscRef.current = osc;
        gainRef.current = gain;
      } else {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
        gainRef.current?.gain.setTargetAtTime(0.035, audioCtxRef.current.currentTime, 0.04);
      }
    } catch {}
  }, [soundEnabled]);

  useEffect(() => {
    if (soundEnabled && oscRef.current && audioCtxRef.current) {
      try {
        oscRef.current.frequency.setTargetAtTime(
          Math.max(60, Math.min(2600, frequency)),
          audioCtxRef.current.currentTime,
          0.03
        );
      } catch {}
    }
  }, [frequency, soundEnabled]);

  useEffect(() => {
    return () => {
      try {
        oscRef.current?.stop();
        audioCtxRef.current?.close();
      } catch {}
    };
  }, []);

  // 60FPS Sand Particle Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const W = 520;
    const H = 360;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const insidePlate = (nx: number, ny: number, shape: PlateShape): boolean => {
      if (shape === 'circle') return nx * nx + ny * ny <= 0.94 * 0.94;
      if (shape === 'hexagon') {
        const ax = Math.abs(nx);
        const ay = Math.abs(ny);
        return ay <= 0.88 && ax * 0.866 + ay * 0.5 <= 0.88;
      }
      return Math.abs(nx) <= 0.94 && Math.abs(ny) <= 0.94;
    };

    const evalChladni = (x: number, y: number, n: number, m: number, a: number, b: number) => {
      const pi = Math.PI;
      return a * Math.cos(n * pi * x) * Math.cos(m * pi * y) + b * Math.cos(m * pi * x) * Math.cos(n * pi * y);
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (document.hidden || !particlesRef.current) return;

      const {
        plateShape: shape,
        modeN: n,
        modeM: m,
        coeffA: a,
        coeffB: b,
        vibrationPower: amp,
        sandPalette: pal
      } = stateRef.current;
      const pts = particlesRef.current;
      const half = Math.min(W, H) * 0.45;
      const cx = W / 2;
      const cy = H / 2;

      ctx.fillStyle = '#070b14';
      ctx.fillRect(0, 0, W, H);

      // Draw vibrating metal plate silhouette
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.fillStyle = '#0f172a';
      ctx.lineWidth = 2;
      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(cx, cy, half * 0.96, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (shape === 'hexagon') {
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const ang = (k / 6) * Math.PI * 2;
          const px = cx + Math.cos(ang) * half * 0.98;
          const py = cy + Math.sin(ang) * half * 0.98;
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(cx - half * 0.96, cy - half * 0.96, half * 1.92, half * 1.92);
        ctx.strokeRect(cx - half * 0.96, cy - half * 0.96, half * 1.92, half * 1.92);
      }
      ctx.restore();

      const particleColor =
        pal === 'cyan'
          ? 'rgba(103, 232, 249, 0.85)'
          : pal === 'emerald'
          ? 'rgba(110, 231, 183, 0.85)'
          : 'rgba(253, 224, 71, 0.86)';
      ctx.fillStyle = particleColor;

      // Update sand grains toward nodal lines W(x,y) = 0
      const eps = 0.012;
      const stepScale = 0.032 * amp;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 2;
        let x = pts[idx];
        let y = pts[idx + 1];

        if (!insidePlate(x, y, shape)) {
          x = (Math.random() * 2 - 1) * 0.8;
          y = (Math.random() * 2 - 1) * 0.8;
        }

        const w = evalChladni(x, y, n, m, a, b);
        const absW = Math.abs(w);
        if (absW > 0.015) {
          // Stochastic jitter + gradient descent along |W|^2 -> nodal curve
          const wx = evalChladni(x + eps, y, n, m, a, b) - w;
          const wy = evalChladni(x, y + eps, n, m, a, b) - w;
          const sign = w >= 0 ? -1 : 1;
          const jitter = Math.min(0.025, absW * 0.014 * amp);
          x += (sign * wx * stepScale) / eps * 0.04 + (Math.random() - 0.5) * jitter;
          y += (sign * wy * stepScale) / eps * 0.04 + (Math.random() - 0.5) * jitter;
        } else {
          // Tiny micro thermal settle near nodal zero-crossing
          x += (Math.random() - 0.5) * 0.0018 * amp;
          y += (Math.random() - 0.5) * 0.0018 * amp;
        }

        if (x > 0.94) x = 0.94;
        if (x < -0.94) x = -0.94;
        if (y > 0.94) y = 0.94;
        if (y < -0.94) y = -0.94;
        pts[idx] = x;
        pts[idx + 1] = y;

        if (insidePlate(x, y, shape)) {
          ctx.fillRect(cx + x * half, cy + y * half, 1.4, 1.4);
        }
      }

      // Center excitation node marker
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
      ctx.fill();
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const applyPreset = (p: ChladniPreset) => {
    setPlateShape(p.shape);
    setFrequency(p.freq);
    setModeN(p.n);
    setModeM(p.m);
    setCoeffA(p.a);
    setCoeffB(p.b);
    scatterSand();
  };

  return (
    <div className="sci-frame rounded-lg bg-slate-950 text-slate-100 border border-amber-500/40 overflow-hidden shadow-lg">
      <div className="px-4 py-3 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold">
            <Waves className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {isEn
                ? 'ACOUSTIC CHLADNI RESONANCE PLATE & SOUND SYNTHESIZER'
                : 'BẢN CỘNG HƯỞNG CÁT CHLADNI & SÓNG DỪNG ÂM THANH THỜI GIAN THỰC'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isEn
              ? '12,000 sand grains settle onto standing-wave nodal lines as resonance frequency changes.'
              : '12.000 hạt cát vật lí rung theo phương trình sóng đứng 2D và tự xếp thành hoa văn giao thoa đối xứng.'}
          </p>
        </div>

        <div className="sim-physics-scope flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSoundEnabled((v) => !v)}
            className={`group sim-btn-phy sim-btn-hero px-3 py-1.5 rounded-[3px] border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              soundEnabled
                ? 'sim-btn-active bg-emerald-600 border-emerald-400 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-400'
            }`}
          >
            {soundEnabled && <span className="sim-led-square text-emerald-200" />}
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? `${frequency} Hz ON` : isEn ? 'Audio Off' : 'Bật Âm Thanh'}</span>
          </button>

          <button
            type="button"
            onClick={scatterSand}
            className="group sim-btn-phy px-3 py-1.5 rounded-[3px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'Scatter Sand' : 'Rải Lại Cát'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Live Sand Plate Canvas */}
        <div className="lg:col-span-7 bg-[#070b14] p-3 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800">
          <canvas ref={canvasRef} className="w-full max-w-[520px] aspect-[520/360] rounded" />
        </div>

        {/* Resonance Controls */}
        <div className="lg:col-span-5 p-4 space-y-4 bg-slate-900/65 text-xs">
          {/* Quick Harmonic Presets */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{isEn ? 'Harmonic Resonance Presets' : 'Chế độ Cộng hưởng Chuẩn'}</span>
            </div>
            <div className="sim-physics-scope flex flex-wrap gap-1.5">
              {CHLADNI_PRESETS.map((p) => (
                <button
                  key={p.labelEn}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="sim-btn-phy px-2.5 py-1 rounded-[3px] bg-slate-800 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 text-[11px] font-semibold cursor-pointer"
                >
                  {isEn ? p.labelEn : p.labelVi}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency & Mode Controls */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-300">{isEn ? 'Frequency f' : 'Tần số kích thích f'}</span>
                <span className="text-amber-300 font-bold tabular-nums">{frequency} Hz</span>
              </div>
              <input
                type="range"
                min={80}
                max={3200}
                step={10}
                value={frequency}
                onChange={(e) => handleFreqChange(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span>Mode n</span>
                  <span className="text-cyan-300 font-bold">{modeN}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={9}
                  step={1}
                  value={modeN}
                  onChange={(e) => setModeN(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span>Mode m</span>
                  <span className="text-cyan-300 font-bold">{modeM}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={11}
                  step={1}
                  value={modeM}
                  onChange={(e) => setModeM(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono mb-1">
                <span>{isEn ? 'Vibration Gain' : 'Biên độ rung bản kim loại'}</span>
                <span className="text-emerald-300 font-bold">{vibrationPower.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.4}
                max={2.2}
                step={0.1}
                value={vibrationPower}
                onChange={(e) => setVibrationPower(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Plate Shape & Color */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  {isEn ? 'Plate Shape' : 'Hình dạng bản'}
                </div>
                <div className="sim-physics-scope flex gap-1">
                  {(['square', 'circle', 'hexagon'] as PlateShape[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPlateShape(s)}
                      className={`sim-btn-phy flex-1 py-1 rounded-[3px] border text-[11px] font-bold cursor-pointer ${
                        plateShape === s
                          ? 'sim-btn-active bg-amber-500 border-amber-300 text-slate-950'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {s === 'square' ? (isEn ? 'Sq' : 'Vuông') : s === 'circle' ? (isEn ? 'Cir' : 'Tròn') : 'Hex'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  {isEn ? 'Sand Grain' : 'Màu hạt cát'}
                </div>
                <div className="sim-physics-scope flex gap-1">
                  {(['gold', 'cyan', 'emerald'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSandPalette(c)}
                      className={`sim-btn-phy flex-1 py-1 rounded-[3px] border text-[11px] font-bold cursor-pointer ${
                        sandPalette === c
                          ? 'sim-btn-active bg-sky-500 border-sky-300 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {c === 'gold' ? 'Vàng' : c === 'cyan' ? 'Cyan' : 'Lục'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-950/90 border border-slate-800 font-mono text-[11px] text-slate-300">
              W(x,y) = {coeffA.toFixed(1)}·cos({modeN}πx)cos({modeM}πy) {coeffB >= 0 ? '+' : '−'}{' '}
              {Math.abs(coeffB).toFixed(1)}·cos({modeM}πx)cos({modeN}πy) = 0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
