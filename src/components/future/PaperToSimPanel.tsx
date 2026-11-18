import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  CameraOff,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Upload,
  ScanLine
} from 'lucide-react';
import { PaperToSimResult } from '../../types';
import { safeFetchJson } from '../../lib/apiClient';
import { FormattedText } from '../common/MathRenderer';

interface PaperToSimPanelProps {
  language?: 'vi' | 'en';
}

const SAMPLE_RESULTS: Record<'parabola' | 'incline' | 'projectile', PaperToSimResult> = {
  parabola: {
    detectedSubject: 'math',
    title: 'Parabol & Tiếp tuyến viết tay (y = ax² + bx + c)',
    detectedFormula: '$$y = ax^2 + bx + c, \\quad x_{\\text{đỉnh}} = -\\frac{b}{2a}$$',
    simKind: 'parabola',
    summary: 'Đã chuyển nét vẽ đồ thị parabol trên giấy thành đồ thị tương tác theo 3 hệ số a, b, c.',
    params: [
      { key: 'a', label: 'Hệ số a', unit: '', min: -2.5, max: 2.5, step: 0.1, value: 0.8 },
      { key: 'b', label: 'Hệ số b', unit: '', min: -5, max: 5, step: 0.2, value: -1.6 },
      { key: 'c', label: 'Tung độ c', unit: '', min: -4, max: 4, step: 0.2, value: -1 }
    ],
    stepsCheck: [
      { line: "y' = 2ax + b = 0 => x = -b/(2a)", status: 'ok', note: 'Hoành độ đỉnh và trục đối xứng chính xác.' },
      { line: 'Δ = b² - 4ac > 0 => 2 nghiệm phân biệt', status: 'ok', note: 'Đồ thị cắt trục Ox tại 2 điểm.' }
    ]
  },
  incline: {
    detectedSubject: 'physics',
    title: 'Vật trượt trên mặt phẳng nghiêng (giấy nháp Vật lí)',
    detectedFormula: '$$a = g(\\sin\\alpha - \\mu\\cos\\alpha)$$',
    simKind: 'incline',
    summary: 'Nhận diện hình vẽ mặt nghiêng góc α và các vector trọng lực, phản lực, lực ma sát.',
    params: [
      { key: 'angle', label: 'Góc nghiêng α', unit: '°', min: 10, max: 65, step: 1, value: 32 },
      { key: 'mu', label: 'Hệ số ma sát μ', unit: '', min: 0, max: 0.6, step: 0.02, value: 0.15 },
      { key: 'mass', label: 'Khối lượng m', unit: 'kg', min: 1, max: 15, step: 0.5, value: 4 }
    ],
    stepsCheck: [
      { line: 'Chiếu lên Ox: P·sin(α) - F_ms = m·a', status: 'ok', note: 'Chọn chiều dương dọc dốc xuống hợp lý.' },
      { line: 'N = m·g·sin(α)', status: 'error', note: 'Nhầm lượng giác! Phản lực pháp tuyến phải là N = m·g·cos(α).' }
    ]
  },
  projectile: {
    detectedSubject: 'physics',
    title: 'Chuyển động ném xiên (giấy nháp Động học)',
    detectedFormula: '$$y(x) = x\\tan\\alpha - \\frac{g x^2}{2 v_0^2 \\cos^2\\alpha}$$',
    simKind: 'projectile',
    summary: 'Phân tích quỹ đạo parabol vật ném xiên theo vận tốc đầu v₀ và góc ném α.',
    params: [
      { key: 'v0', label: 'Vận tốc đầu v₀', unit: 'm/s', min: 5, max: 35, step: 1, value: 20 },
      { key: 'angle', label: 'Góc ném α', unit: '°', min: 15, max: 80, step: 1, value: 45 },
      { key: 'g', label: 'Gia tốc g', unit: 'm/s²', min: 5, max: 15, step: 0.2, value: 9.8 }
    ],
    stepsCheck: [
      { line: 'Tầm bay xa L = v₀²·sin(2α)/g', status: 'ok', note: 'Đạt cực đại khi α = 45°.' }
    ]
  }
};

export const PaperToSimPanel: React.FC<PaperToSimPanelProps> = ({ language = 'vi' }) => {
  const isEn = language === 'en';
  const [camActive, setCamActive] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string>('');
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [simResult, setSimResult] = useState<PaperToSimResult>(SAMPLE_RESULTS.incline);
  const [playing, setPlaying] = useState(true);
  const [simClock, setSimClock] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const simCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setCamError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError('Trình duyệt chưa hỗ trợ truy cập camera trực tiếp.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 960 }, height: { ideal: 540 } },
        audio: false
      });
      streamRef.current = stream;
      setCamActive(true);
      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play().catch(() => {});
        }
      }, 60);
    } catch {
      setCamError('Không mở được Camera. Em có thể tải ảnh chụp giấy nháp ở nút bên cạnh.');
    }
  };

  const captureFromWebcam = () => {
    const v = videoRef.current;
    if (!v || v.videoWidth === 0) return;
    const c = document.createElement('canvas');
    const maxW = 900;
    const scale = Math.min(1, maxW / v.videoWidth);
    c.width = Math.round(v.videoWidth * scale);
    c.height = Math.round(v.videoHeight * scale);
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const url = c.toDataURL('image/jpeg', 0.82);
    setCapturedDataUrl(url);
    void analyzePaper(url);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : '';
      if (url) {
        setCapturedDataUrl(url);
        void analyzePaper(url);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzePaper = async (imageOverride?: string) => {
    const img = imageOverride ?? capturedDataUrl;
    if (!img && !hint.trim()) {
      setErrorMsg('Hãy chụp/tải ảnh giấy nháp hoặc nhập biểu thức mô tả trước nhé.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    const res = await safeFetchJson<{ success: boolean; result: PaperToSimResult }>(
      '/api/gemini/paper-to-sim',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: img || '',
          mimeType: 'image/jpeg',
          hint: hint.trim(),
          language
        })
      },
      38000
    );
    setLoading(false);
    if (!res.ok || !res.data?.result) {
      setErrorMsg(res.error || 'Chưa nhận diện được tờ giấy nháp.');
      return;
    }
    setSimResult(res.data.result);
    setSimClock(0);
    setPlaying(true);
  };

  const updateParam = (key: string, nextVal: number) => {
    setSimResult((prev) => ({
      ...prev,
      params: prev.params.map((p) => (p.key === key ? { ...p, value: nextVal } : p))
    }));
  };

  // Interactive 60fps Canvas Simulator driven by simResult
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (playing) {
        setSimClock((prev) => prev + dt);
      }
      raf = requestAnimationFrame(renderFrame);
    };
    raf = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => {
    const canvas = simCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#071122';
    ctx.fillRect(0, 0, W, H);

    // Subtle scientific grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    const pVal = (idx: number, fallback: number) => simResult.params[idx]?.value ?? fallback;
    const kind = simResult.simKind;

    if (kind === 'parabola' || kind === 'trig_wave') {
      const cx = W / 2;
      const cy = H / 2;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.beginPath();
      ctx.moveTo(20, cy);
      ctx.lineTo(W - 20, cy);
      ctx.moveTo(cx, 20);
      ctx.lineTo(cx, H - 20);
      ctx.stroke();

      const scaleX = 42;
      const scaleY = 28;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const a = pVal(0, 1);
      const b = pVal(1, -1.5);
      const c = pVal(2, -1);

      for (let px = 24; px <= W - 24; px += 2) {
        const x = (px - cx) / scaleX;
        const y = kind === 'parabola' ? a * x * x + b * x + c : a * Math.sin(b * x + c + simClock * 1.4);
        const py = cy - y * scaleY;
        if (px === 24) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      if (kind === 'parabola' && Math.abs(a) > 0.05) {
        const vx = -b / (2 * a);
        const vy = a * vx * vx + b * vx + c;
        const sx = cx + vx * scaleX;
        const sy = cy - vy * scaleY;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`Đỉnh (${vx.toFixed(2)}, ${vy.toFixed(2)})`, sx + 10, sy - 6);
      }
    } else if (kind === 'incline') {
      const deg = pVal(0, 32);
      const mu = pVal(1, 0.15);
      const rad = (deg * Math.PI) / 180;
      const g = 9.8;
      const acc = Math.max(0, g * (Math.sin(rad) - mu * Math.cos(rad)));
      const baseL = 330;
      const x0 = 90;
      const y0 = H - 45;
      const xTop = x0;
      const yTop = y0 - baseL * Math.tan(rad) * 0.72;
      const xRight = x0 + baseL;

      ctx.fillStyle = 'rgba(30, 58, 138, 0.45)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(xRight, y0);
      ctx.lineTo(xTop, yTop);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const slideCycle = (simClock % 3.2) / 3.2;
      const dist = acc > 0.05 ? slideCycle * slideCycle : 0.25;
      const slopeDx = xRight - xTop;
      const slopeDy = y0 - yTop;
      const bx = xTop + slopeDx * (0.14 + 0.65 * dist);
      const by = yTop + slopeDy * (0.14 + 0.65 * dist);

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(Math.atan2(slopeDy, slopeDx));
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-16, -28, 28, 28);
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(-16, -28, 28, 28);
      // Force vectors
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(0, -56);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`Gia tốc a = ${acc.toFixed(2)} m/s²`, 24, 30);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`α = ${deg}° · μ = ${mu.toFixed(2)}`, 24, 48);
    } else if (kind === 'projectile') {
      const v0 = pVal(0, 20);
      const deg = pVal(1, 45);
      const g = pVal(2, 9.8);
      const rad = (deg * Math.PI) / 180;
      const vx = v0 * Math.cos(rad);
      const vy = v0 * Math.sin(rad);
      const tMax = (2 * vy) / g;
      const range = vx * tMax;
      const maxH = (vy * vy) / (2 * g);
      const scale = Math.min((W - 80) / Math.max(10, range), (H - 80) / Math.max(8, maxH));
      const ox = 42;
      const oy = H - 38;

      ctx.strokeStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(20, oy);
      ctx.lineTo(W - 20, oy);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      for (let i = 0; i <= 50; i++) {
        const ti = (tMax * i) / 50;
        const px = ox + vx * ti * scale;
        const py = oy - (vy * ti - 0.5 * g * ti * ti) * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      const tNow = simClock % Math.max(0.4, tMax);
      const curX = ox + vx * tNow * scale;
      const curY = oy - (vy * tNow - 0.5 * g * tNow * tNow) * scale;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(curX, curY, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`Tầm xa L = ${range.toFixed(1)}m · Độ cao max H = ${maxH.toFixed(1)}m`, 24, 28);
    } else if (kind === 'pendulum' || kind === 'spring') {
      const p0 = pVal(0, 1.5);
      const p1 = pVal(1, 20);
      const omega = kind === 'pendulum' ? Math.sqrt(9.8 / Math.max(0.3, p0)) : Math.sqrt(Math.max(1, p1) / Math.max(0.2, p0));
      if (kind === 'pendulum') {
        const pivotX = W / 2;
        const pivotY = 38;
        const Lpx = Math.min(180, 75 + p0 * 38);
        const thetaMax = (p1 * Math.PI) / 180;
        const theta = thetaMax * Math.cos(omega * simClock);
        const bx = pivotX + Lpx * Math.sin(theta);
        const by = pivotY + Lpx * Math.cos(theta);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.arc(bx, by, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`Chu kỳ T = ${((2 * Math.PI) / omega).toFixed(2)}s`, 24, 28);
      } else {
        const anchorX = 64;
        const midY = H / 2;
        const amp = 55;
        const dx = amp * Math.cos(omega * simClock);
        const massX = W / 2 + dx;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(anchorX, midY);
        const coils = 12;
        for (let i = 1; i < coils; i++) {
          const sx = anchorX + ((massX - anchorX) * i) / coils;
          const sy = midY + (i % 2 === 0 ? -14 : 14);
          ctx.lineTo(sx, sy);
        }
        ctx.lineTo(massX, midY);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(massX, midY - 22, 44, 44);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`ω = ${omega.toFixed(2)} rad/s`, 24, 28);
      }
    } else {
      // oxyz_solid simple rotating pyramid/prism preview
      const r = pVal(0, 1.5);
      const h = pVal(1, 2.5);
      const cx = W / 2;
      const cy = H / 2 + 45;
      const ang = simClock * 0.9;
      const pts: [number, number][] = [];
      for (let i = 0; i < 4; i++) {
        const a = ang + (i * Math.PI) / 2;
        const x = Math.cos(a) * r * 52;
        const z = Math.sin(a) * r * 52;
        pts.push([cx + x, cy + z * 0.35]);
      }
      const apex: [number, number] = [cx, cy - h * 48];
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      pts.forEach((p, idx) => {
        const next = pts[(idx + 1) % pts.length];
        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
        ctx.lineTo(next[0], next[1]);
        ctx.lineTo(apex[0], apex[1]);
        ctx.stroke();
      });
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`Hình không gian Oxyz · r = ${r} · h = ${h}`, 24, 28);
    }
  }, [simResult, simClock]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left: Paper Scanner / Upload / Prompt */}
      <div className="lg:col-span-5 sci-frame rounded-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              LIVE PAPER-TO-SIM VISION
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isEn ? 'Turn Paper Sketches into Live Simulations' : 'Đưa Giấy Nháp Lên Camera → Mô Phỏng Thật'}
            </h3>
          </div>
          <ScanLine className="w-5 h-5 text-cyan-500 shrink-0" />
        </div>

        <div className="relative rounded-md overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 aspect-video flex items-center justify-center">
          {camActive ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : capturedDataUrl ? (
            <img src={capturedDataUrl} alt="Giấy nháp đã chụp" className="w-full h-full object-contain" />
          ) : (
            <div className="text-center p-4 space-y-1.5 text-slate-400 text-xs">
              <Camera className="w-8 h-8 mx-auto text-cyan-400/70" />
              <p>Bật Camera soi trang vở viết tay hoặc tải ảnh bài tập Toán / Lí lên.</p>
            </div>
          )}
          <div className="pointer-events-none absolute inset-4 border border-dashed border-cyan-400/45 rounded-sm" />
        </div>

        {camError && <p className="text-xs text-amber-600 dark:text-amber-400">{camError}</p>}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={camActive ? stopCamera : startCamera}
            className="cs-deck-btn px-3 py-2 rounded bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            {camActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{camActive ? 'Tắt Camera' : 'Mở Camera Soi Vở'}</span>
          </button>
          {camActive && (
            <button
              type="button"
              onClick={captureFromWebcam}
              className="cs-deck-btn px-3 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chụp & Dựng Mô Phỏng</span>
            </button>
          )}
          <label className="cs-deck-btn px-3 py-2 rounded bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-600/50 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Tải Ảnh Nháp</span>
            <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
          </label>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="Gợi ý thêm (VD: y = x^2 - 4x + 3 hoặc vật trượt nghiêng 30 độ)..."
            className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => void analyzePaper()}
            className="cs-deck-btn w-full py-2.5 rounded bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Syn AI đang đọc giấy nháp...' : 'Phân Tích & Biến Thành Mô Phỏng'}</span>
          </button>
          {errorMsg && <p className="text-xs text-rose-500">{errorMsg}</p>}
        </div>

        {/* Sample One-Click Tryouts */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500">Thử nhanh mẫu giấy nháp có sẵn:</div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSimResult(SAMPLE_RESULTS.parabola)}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:border-sky-400 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold cursor-pointer"
            >
              Parabol & Đỉnh
            </button>
            <button
              type="button"
              onClick={() => setSimResult(SAMPLE_RESULTS.incline)}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:border-amber-400 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold cursor-pointer"
            >
              Mặt phẳng nghiêng (kèm bắt lỗi)
            </button>
            <button
              type="button"
              onClick={() => setSimResult(SAMPLE_RESULTS.projectile)}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:border-emerald-400 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold cursor-pointer"
            >
              Ném xiên động học
            </button>
          </div>
        </div>
      </div>

      {/* Right: Live Interactive Simulation + Error Check */}
      <div className="lg:col-span-7 sci-frame rounded-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{simResult.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{simResult.summary}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="px-2.5 py-1.5 rounded bg-sky-500 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{playing ? 'Tạm dừng' : 'Chạy'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSimClock(0)}
              className="p-1.5 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
              title="Đặt lại"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="px-3 py-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
          <FormattedText text={simResult.detectedFormula} />
        </div>

        <canvas
          ref={simCanvasRef}
          width={640}
          height={310}
          className="w-full rounded-md border border-slate-800 bg-[#071122]"
        />

        {/* Dynamic Extracted Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {simResult.params.map((p) => (
            <div
              key={p.key}
              className="p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1"
            >
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span>{p.label}</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 tabular-nums">
                  {p.value} {p.unit}
                </span>
              </div>
              <input
                type="range"
                min={p.min}
                max={p.max}
                step={p.step}
                value={p.value}
                onChange={(e) => updateParam(p.key, Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* AI Line-by-Line Paper Verification */}
        {simResult.stepsCheck.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Kiểm tra từng bước viết trên giấy nháp:
            </div>
            <div className="space-y-1.5">
              {simResult.stepsCheck.map((st, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 p-2.5 rounded border text-xs ${
                    st.status === 'error'
                      ? 'bg-rose-50 dark:bg-rose-950/35 border-rose-300 dark:border-rose-700/60 text-rose-800 dark:text-rose-200'
                      : st.status === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-950/35 border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-200'
                      : 'bg-emerald-50 dark:bg-emerald-950/35 border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-200'
                  }`}
                >
                  {st.status === 'error' ? (
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : st.status === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-mono font-bold">
                      <FormattedText text={st.line} />
                    </div>
                    <div className="opacity-90 mt-0.5">
                      <FormattedText text={st.note} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
