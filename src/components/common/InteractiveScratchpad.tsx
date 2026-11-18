import React, { useEffect, useRef, useState } from 'react';
import {
  Eraser,
  Grid3X3,
  PenTool,
  RotateCcw,
  Send,
  Sparkles,
  Trash2,
  X,
  Download
} from 'lucide-react';
import { GrowthSubject, TutorContextPayload } from '../../types';
import { MathFormula } from './MathRenderer';

interface InteractiveScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: GrowthSubject;
  contextTitle?: string;
  /** Optional direct callback when opened inside SocraticAITutor */
  onAttachToTutor?: (imageBase64: string, latexNote: string) => void;
}

const PEN_COLORS = [
  { id: 'ink', hex: '#0f172a', label: 'Đen mực' },
  { id: 'blue', hex: '#2563eb', label: 'Xanh dương' },
  { id: 'rose', hex: '#e11d48', label: 'Đỏ nổi bật' },
  { id: 'emerald', hex: '#059669', label: 'Xanh lục' }
];

const QUICK_MATH_SYMBOLS = [
  { label: '∫', insert: '\\int_{a}^{b} f(x)\\,dx' },
  { label: '∑', insert: '\\sum_{i=1}^{n} ' },
  { label: 'lim', insert: '\\lim_{x \\to 0} ' },
  { label: 'a/b', insert: '\\frac{a}{b}' },
  { label: '√', insert: '\\sqrt{x}' },
  { label: 'vec', insert: '\\vec{v}' },
  { label: 'Δ', insert: '\\Delta ' },
  { label: 'ω', insert: '\\omega ' },
  { label: 'π', insert: '\\pi ' },
  { label: 'Ω', insert: '\\Omega ' },
  { label: '→', insert: '\\Rightarrow ' },
  { label: 'O(n)', insert: 'O(N \\log N)' }
];

export const InteractiveScratchpad: React.FC<InteractiveScratchpadProps> = ({
  isOpen,
  onClose,
  defaultSubject = 'math',
  contextTitle,
  onAttachToTutor
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const drawingRef = useRef(false);
  const lastPtRef = useRef<{ x: number; y: number } | null>(null);

  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState<string>(PEN_COLORS[0].hex);
  const [penWidth, setPenWidth] = useState<number>(3);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [latexNote, setLatexNote] = useState<string>('');
  const [canUndo, setCanUndo] = useState<boolean>(false);

  const initCanvasWhite = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [];
    setCanUndo(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      initCanvasWhite();
    }, 30);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const pushSnapshot = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current = [...historyRef.current.slice(-18), snap];
      setCanUndo(true);
    } catch {}
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    pushSnapshot();
    drawingRef.current = true;
    lastPtRef.current = getPointerPos(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !lastPtRef.current) return;

    const pt = getPointerPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPtRef.current.x, lastPtRef.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : penColor;
    ctx.lineWidth = tool === 'eraser' ? penWidth * 4.5 : penWidth;
    ctx.stroke();
    lastPtRef.current = pt;
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
    lastPtRef.current = null;
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || historyRef.current.length === 0) return;
    const prev = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    ctx.putImageData(prev, 0, 0);
    setCanUndo(historyRef.current.length > 0);
  };

  const exportCompositeDataUrl = (): string => {
    const src = canvasRef.current;
    if (!src) return '';
    const out = document.createElement('canvas');
    out.width = src.width;
    out.height = src.height;
    const ctx = out.getContext('2d');
    if (!ctx) return src.toDataURL('image/jpeg', 0.9);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, out.width, out.height);
    if (showGrid) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let x = 0; x <= out.width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, out.height);
        ctx.stroke();
      }
      for (let y = 0; y <= out.height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(out.width, y);
        ctx.stroke();
      }
    }
    ctx.drawImage(src, 0, 0);
    return out.toDataURL('image/jpeg', 0.88);
  };

  const handleDownloadPng = () => {
    const url = exportCompositeDataUrl();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapse-nhap-${Date.now()}.jpg`;
    a.click();
  };

  const handleSendToSynAI = () => {
    const dataUrl = exportCompositeDataUrl();
    if (!dataUrl) return;
    if (onAttachToTutor) {
      onAttachToTutor(dataUrl, latexNote.trim());
      onClose();
      return;
    }

    const payload: TutorContextPayload = {
      subject: defaultSubject,
      mode: 'explain_no_answer',
      topicTitle: contextTitle || 'Bài làm nháp từ Bảng Nháp Vẽ Tay',
      problemStatement: latexNote.trim()
        ? `Ghi chú công thức kèm theo của em: $$${latexNote.trim()}$$. Hãy soi ảnh bài nháp em vừa vẽ và chỉ rõ bước nào đúng, bước nào cần chỉnh.`
        : 'Hãy xem ảnh bài làm nháp em vừa viết trên bảng nháp, kiểm tra từng bước biến đổi và gợi ý hướng sửa nếu có chỗ nhầm.',
      initialImageBase64: dataUrl,
      initialImageMimeType: 'image/jpeg'
    };
    window.dispatchEvent(new CustomEvent('educlassroom:open-tutor-with-payload', { detail: payload }));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[180] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="sci-frame syn-top-laser w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="px-4 py-3 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded bg-sky-600 flex items-center justify-center shrink-0">
              <PenTool className="w-4 h-4 text-white" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-sm sm:text-base font-bold truncate">
                Bảng Nháp Tương Tác & Công Thức Toán/Lí
              </h3>
              <p className="text-[11px] font-mono text-slate-400 truncate">
                Vẽ sơ đồ, viết nháp từng bước · Gửi thẳng cho Syn AI soi lỗi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Đóng bảng nháp"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawing Toolbar */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTool('pen')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                tool === 'pen'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Bút vẽ</span>
            </button>
            <button
              type="button"
              onClick={() => setTool('eraser')}
              className={`px-2.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                tool === 'eraser'
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Tẩy</span>
            </button>

            <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            {PEN_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setPenColor(c.hex);
                  setTool('pen');
                }}
                title={c.label}
                aria-label={c.label}
                className={`w-6 h-6 rounded border-2 cursor-pointer transition-transform ${
                  penColor === c.hex && tool === 'pen'
                    ? 'border-sky-500 scale-110'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}

            <select
              value={penWidth}
              onChange={(e) => setPenWidth(Number(e.target.value))}
              className="ml-1 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-700 dark:text-slate-200 cursor-pointer"
              aria-label="Cỡ nét bút"
            >
              <option value={2}>Mảnh (2px)</option>
              <option value={3}>Vừa (3px)</option>
              <option value={5}>Đậm (5px)</option>
              <option value={8}>To (8px)</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowGrid((g) => !g)}
              className={`px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 border cursor-pointer ${
                showGrid
                  ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 text-sky-700 dark:text-sky-300'
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Lưới Oxy</span>
            </button>
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className="px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hoàn tác</span>
            </button>
            <button
              type="button"
              onClick={initCanvasWhite}
              className="px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa bảng</span>
            </button>
          </div>
        </div>

        {/* Canvas + Math Ink Formula Bar */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100 dark:bg-slate-950">
          <div className="relative rounded border border-slate-300 dark:border-slate-700 bg-white overflow-hidden shadow-inner">
            {showGrid && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
                  backgroundSize: '28px 28px'
                }}
              />
            )}
            <canvas
              ref={canvasRef}
              width={920}
              height={420}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative z-10 w-full h-[280px] sm:h-[340px] block touch-none cursor-crosshair bg-transparent"
            />
          </div>

          {/* Quick LaTeX Math Ink Composer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-3 space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Thanh Ký Hiệu Nhanh (Toán · Vật lí · Tin)
              </span>
              <div className="flex flex-wrap gap-1">
                {QUICK_MATH_SYMBOLS.map((sym) => (
                  <button
                    key={sym.label}
                    type="button"
                    onClick={() => setLatexNote((prev) => `${prev}${sym.insert}`)}
                    className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    {sym.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 items-center">
              <input
                type="text"
                value={latexNote}
                onChange={(e) => setLatexNote(e.target.value)}
                placeholder="Gõ hoặc bấm ký hiệu để tạo công thức LaTeX kèm theo..."
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <div className="min-h-[38px] px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center text-sm text-slate-900 dark:text-slate-100 overflow-x-auto">
                {latexNote.trim() ? (
                  <MathFormula formula={latexNote} />
                ) : (
                  <span className="text-[11px] text-slate-400">Xem trước công thức KaTeX...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleDownloadPng}
            className="cs-deck-btn px-3.5 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải ảnh nháp (.jpg)</span>
          </button>

          <button
            type="button"
            onClick={handleSendToSynAI}
            className="cs-deck-btn px-4 py-2 rounded bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Gửi Syn AI soi bước giải</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
