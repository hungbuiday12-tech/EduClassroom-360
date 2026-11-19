import React, { useState } from 'react';
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Clock,
  Compass,
  Hand,
  Layers,
  MousePointerClick,
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';
import { GESTURE_DEFINITIONS, REAL_GRAB_GESTURES } from './handGestureTracker';

interface Spatial3DGuideModalProps {
  isOpen: boolean;
  isEn: boolean;
  autoShowOn3D: boolean;
  onToggleAutoShow: (val: boolean) => void;
  onClose: () => void;
  onSwitchTo2D?: () => void;
}

type GuideTab = 'workflow' | 'gestures' | 'mouse';

export const Spatial3DGuideModal: React.FC<Spatial3DGuideModalProps> = ({
  isOpen,
  isEn,
  autoShowOn3D,
  onToggleAutoShow,
  onClose,
  onSwitchTo2D
}) => {
  const [activeTab, setActiveTab] = useState<GuideTab>('workflow');

  if (!isOpen) return null;

  const steps3D = [
    {
      step: '01',
      title: isEn ? '2 Fingers V · Line Up 1 Fixed Horizontal Row (✌️)' : '2 Ngón Chữ V · Tách Xếp 1 Hàng Ngang Cố Định (✌️)',
      desc: isEn
        ? 'Show a clear V-sign (2 fingers) to line all components up in a single fixed, immovable horizontal row (no purple plane, no spinning). Show ✌️ again to reassemble!'
        : 'Giơ 2 ngón chữ V để xếp toàn bộ linh kiện thành 1 hàng ngang thẳng hàng và khóa cố định vị trí (không còn mặt cắt tím, không xoay loạn). Giơ ✌️ lại để lắp về nguyên bản!',
      accent: 'text-purple-300 border-purple-500/45 bg-purple-500/10'
    },
    {
      step: '02',
      title: isEn ? 'Open Hand · Move Along Row to Aim (🖐️)' : 'Mở Tay · Di Tay Ngang Qua Linh Kiện (🖐️)',
      desc: isEn
        ? 'Slide your open hand left or right across the horizontal row — each component lights up steadily while every part stays locked in place.'
        : 'Di chuyển bàn tay mở qua trái hoặc phải dọc theo hàng ngang — khung sáng tự bắt đúng linh kiện bạn đang trỏ tới mà không làm xê dịch vị trí.',
      accent: 'text-cyan-300 border-cyan-500/45 bg-cyan-500/10'
    },
    {
      step: '03',
      title: isEn ? '1 Thumb Up · Select Component Calmly (👍)' : 'Giơ 1 Ngón Cái · Chọn & Đọc Thông Tin (👍)',
      desc: isEn
        ? 'Keep your hand steady over a component and raise 1 Thumb (👍) to select it, highlight it, and open its Structure & Function card instantly.'
        : 'Khi tay đang trỏ vào linh kiện cần xem, chỉ cần giơ 1 ngón cái (👍) để chọn dứt khoát và mở ngay bảng Cấu tạo & Chức năng.',
      accent: 'text-amber-300 border-amber-500/45 bg-amber-500/10'
    },
    {
      step: '04',
      title: isEn ? 'Closed Fist · Rotate Assembled Model 360° (✊)' : 'Nắm Đấm · Xoay Cả Khối 360° Khi Đang Ghép (✊)',
      desc: isEn
        ? 'When the model is assembled, close a fist to rotate it 360° smoothly. While separated in the horizontal row, positions stay locked so nothing spins accidentally.'
        : 'Khi mô hình đang ghép nguyên khối, nắm tay để xoay tròn 360° quan sát mọi mặt. Khi đang tách hàng ngang, các khối được khóa cố định tuyệt đối.',
      accent: 'text-emerald-300 border-emerald-500/45 bg-emerald-500/10'
    },
    {
      step: '05',
      title: isEn ? '2 Hands · Zoom + Weak-PC 0.5x / 30 FPS (👐)' : '2 Tay Thu Phóng · Giảm Lag Máy Yếu 0.5x / 30 FPS (👐)',
      desc: isEn
        ? 'Spread both hands apart to Zoom In or bring closer to Zoom Out on either the assembled model or horizontal row. Pick 0.5x scale & 30F cap in Dock for weak PCs!'
        : 'Tách 2 tay ra xa để Phóng To hoặc khép gần để Thu Nhỏ cả hàng ngang linh kiện. Trên máy yếu, bật độ phân giải 0.5x và 30F ở thanh công cụ để mượt 100%!',
      accent: 'text-sky-300 border-sky-500/55 bg-sky-500/15'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85"
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? '3D Spatial Studio Usage Guide' : 'Hướng dẫn sử dụng Không gian 3D'}
    >
      <div data-modal-shell="true" className="spatial-holo-card spatial-step-reveal w-full max-w-4xl max-h-[92dvh] flex flex-col shadow-2xl">
        <div className="spatial-holo-ring" />
        <div className="relative z-10 flex flex-col max-h-[92dvh] rounded-[9px] bg-[#060b18] border border-sky-500/35 overflow-hidden">
          <div className="spatial-laser-sweep" />

          {/* Modal Header */}
          <div className="relative shrink-0 flex items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-950/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-500/15 border border-sky-400/50 flex items-center justify-center text-sky-300 shrink-0">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? '3D Real-Grab Guide · 5 Clear Gestures' : 'Hướng Dẫn 3D · 5 Cử Chỉ Cầm Nắm Rõ Ràng'}</span>
                </div>
                <h2 className="text-base sm:text-xl font-extrabold text-white mt-0.5">
                  {isEn
                    ? 'Minimal 5-Gesture 3D Hand Control & Weak-PC Boost'
                    : 'Điều Khiển Tay 3D Rõ Ràng (5 Cử Chỉ) & Giảm Độ Trễ Máy Yếu'}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md bg-slate-900 border border-slate-700 hover:border-sky-400 text-slate-300 hover:text-white cursor-pointer shrink-0"
              aria-label={isEn ? 'Close guide' : 'Đóng hướng dẫn'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Instant Grab Safety Highlight */}
          <div className="shrink-0 px-4 sm:px-6 py-2 bg-sky-950/55 border-b border-sky-500/30 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
            <div className="flex items-center gap-2 text-sky-200 font-semibold">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                {isEn
                  ? 'Calm Horizontal Row Mode: ✌️ lines all parts into 1 immovable horizontal row, 🖐️ moves aim along the row, and 👍 1 Thumb selects cleanly!'
                  : 'Chế độ Hàng Ngang Cố Định: ✌️ xếp mọi linh kiện thành 1 hàng ngang không xê dịch · 🖐️ Di tay ngắm · 👍 Giơ 1 ngón cái để chọn · ✊ Nắm xoay · 👐 2 tay thu phóng!'}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="shrink-0 px-4 sm:px-6 pt-2.5 flex flex-nowrap sm:flex-wrap items-center gap-2 overflow-x-auto scrollbar-none border-b border-slate-800/80 pb-2.5 bg-slate-950/60">
            {(
              [
                {
                  id: 'workflow',
                  labelVi: '5 Cử Chỉ Cầm Nắm Rõ Ràng (3D)',
                  labelEn: '5 Clear Real-Grab Gestures (3D)',
                  icon: Layers
                },
                {
                  id: 'gestures',
                  labelVi: 'Bảng Đầy Đủ (Thực Tế & Cổ Điển)',
                  labelEn: 'Full Gesture Table',
                  icon: Hand
                },
                {
                  id: 'mouse',
                  labelVi: 'Chuột · Phím Tắt · Chế Độ Máy Yếu',
                  labelEn: 'Mouse · Keys · Weak-PC Mode',
                  icon: MousePointerClick
                }
              ] as const
            ).map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-sky-500 text-slate-950 border-sky-300'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-sky-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? t.labelEn : t.labelVi}</span>
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto space-y-3">
            {activeTab === 'workflow' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {steps3D.map((s, idx) => (
                  <div
                    key={s.step}
                    style={{ animationDelay: `${idx * 65}ms` }}
                    className={`spatial-soft-frame spatial-step-reveal rounded-lg border p-3.5 flex flex-col justify-between gap-2 ${s.accent} ${
                      idx === 4 ? 'sm:col-span-2 lg:col-span-2' : ''
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold tracking-widest opacity-90">
                          STEP {s.step}
                        </span>
                        <CheckCircle2 className="w-4 h-4 opacity-80" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-white">{s.title}</h3>
                      <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gestures' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
                    {isEn ? '5 Real-Grab 3D Gestures (Recommended)' : '5 Cử Chỉ Cầm Nắm Thực Tế 3D (Khuyên Dùng)'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {REAL_GRAB_GESTURES.map((g, idx) => (
                      <div
                        key={`rg-${g.id}`}
                        style={{ animationDelay: `${idx * 40}ms` }}
                        className="spatial-soft-frame spatial-soft-frame-emerald spatial-step-reveal rounded-lg bg-slate-900/95 border border-emerald-500/35 p-3 flex items-start gap-3"
                      >
                        <div
                          className="w-10 h-10 rounded-md border border-slate-600/80 bg-slate-950 flex items-center justify-center text-lg shrink-0"
                          style={{ color: g.accent }}
                        >
                          {g.fingers}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="text-xs font-extrabold text-white">
                            {isEn ? g.labelEn : g.labelVi}
                          </div>
                          <div className="text-[11px] text-slate-300 leading-snug">
                            {isEn ? g.actionEn : g.actionVi}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    {isEn ? 'Classic 8 Gestures (2D / Classic Mode)' : '8 Cử Chỉ Cổ Điển (Dành cho 2D / Chế Độ Cổ Điển)'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {GESTURE_DEFINITIONS.map((g, idx) => (
                      <div
                        key={g.id}
                        style={{ animationDelay: `${idx * 35}ms` }}
                        className="spatial-soft-frame spatial-step-reveal rounded-lg bg-slate-900/95 border border-slate-700/80 p-2.5 flex items-start gap-3"
                      >
                        <div
                          className="w-9 h-9 rounded-md border border-slate-600/80 bg-slate-950 flex items-center justify-center font-mono text-xs font-extrabold shrink-0"
                          style={{ color: g.accent }}
                        >
                          {g.fingers}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="text-xs font-extrabold text-white">
                            {isEn ? g.labelEn : g.labelVi}
                          </div>
                          <div className="text-[11px] text-slate-400 leading-snug">
                            {isEn ? g.actionEn : g.actionVi}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mouse' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="spatial-soft-frame rounded-lg bg-slate-900 border border-slate-700/80 p-3.5 space-y-1.5">
                  <div className="font-extrabold text-cyan-300">
                    {isEn ? 'Mouse & Touch Viewport' : 'Chuột & Màn Hình Cảm Ứng'}
                  </div>
                  <ul className="space-y-1 text-slate-200 list-disc pl-4">
                    <li>{isEn ? 'Drag left mouse / 1 finger: Rotate model 360°' : 'Kéo chuột trái / 1 ngón: Xoay mô hình 360°'}</li>
                    <li>{isEn ? 'Scroll wheel / 2-finger pinch: Zoom in & out' : 'Cuộn chuột / chụm 2 ngón màn hình: Phóng to & Thu nhỏ'}</li>
                    <li>{isEn ? 'Right drag: Pan camera position' : 'Kéo chuột phải: Dịch chuyển khung nhìn'}</li>
                    <li>{isEn ? 'Click any exploded block: Isolate & inspect part' : 'Bấm trực tiếp vào bộ phận đã tách: Xem riêng & đọc chức năng'}</li>
                  </ul>
                </div>

                <div className="spatial-soft-frame spatial-soft-frame-emerald rounded-lg bg-slate-900 border border-slate-700/80 p-3.5 space-y-1.5">
                  <div className="font-extrabold text-emerald-300">
                    {isEn ? 'Virtual Gesture Pad & Dock Shortcuts' : 'Bàn Di Cử Chỉ Ảo & Phím Tắt'}
                  </div>
                  <ul className="space-y-1 text-slate-200 list-disc pl-4">
                    <li>{isEn ? 'Pick any of 8 gestures in Dock → "8 Gestures" without camera' : 'Chọn nhanh 1 trong 8 cử chỉ ở thanh dưới để mô phỏng không cần Webcam'}</li>
                    <li>{isEn ? 'Click "4 Fingers" in Dock to reassemble immediately' : 'Bấm nút "4 Ngón · Ghép lại" để hợp nhất mô hình tức thì'}</li>
                    <li>{isEn ? 'Space: Freeze/Unfreeze · R: Reset view · H: Hide HUD' : 'Phím Space: Đóng băng · Phím R: Đặt lại góc nhìn · Phím H: Ẩn HUD'}</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Row */}
          <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-950/95 flex flex-wrap items-center justify-between gap-2.5">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoShowOn3D}
                onChange={(e) => onToggleAutoShow(e.target.checked)}
                className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
              />
              <span>
                {isEn
                  ? 'Show guide automatically when entering 3D Space'
                  : 'Hiện khung hướng dẫn này mỗi khi bấm vào Không gian 3D'}
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-2 ml-auto">
              {onSwitchTo2D && (
                <button
                  type="button"
                  onClick={onSwitchTo2D}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-900 border border-slate-700 hover:border-emerald-400 text-xs font-bold text-emerald-300 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Open 2D Free Create' : 'Sang Không gian 2D'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isEn ? 'Close' : 'Đóng'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="cs-deck-btn flex items-center gap-1.5 px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 border border-sky-300 text-xs font-extrabold text-slate-950 cursor-pointer"
              >
                <span>{isEn ? 'Start 3D Manipulation' : 'Bắt Đầu Thao Tác 3D'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
