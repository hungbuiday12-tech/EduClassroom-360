import React, { useState } from 'react';
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Compass,
  Hand,
  Info,
  Layers,
  MousePointerClick,
  RotateCcw,
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
      title: isEn ? '2 Fingers V · Line Up Horizontal Row' : '2 Ngón Chữ V · Xếp Hàng Ngang Cố Định',
      desc: isEn
        ? 'Show a clear V-sign (2 fingers) to line all components up in a single fixed horizontal row. Show V again to reassemble the model.'
        : 'Giơ 2 ngón chữ V để xếp toàn bộ linh kiện thành 1 hàng ngang thẳng hàng và khóa cố định vị trí. Giơ 2 ngón lại để lắp về nguyên bản.',
      accent: 'text-sky-300 border-sky-500/35 bg-slate-900'
    },
    {
      step: '02',
      title: isEn ? 'Open Hand · Move Along Row to Aim' : 'Mở Tay · Di Tay Ngang Qua Linh Kiện',
      desc: isEn
        ? 'Slide your open hand left or right across the horizontal row — each component highlights steadily while every part stays locked in place.'
        : 'Di chuyển bàn tay mở qua trái hoặc phải dọc theo hàng ngang — khung sáng tự chọn đúng linh kiện bạn đang trỏ tới mà không làm xê dịch vị trí.',
      accent: 'text-cyan-300 border-cyan-500/35 bg-slate-900'
    },
    {
      step: '03',
      title: isEn ? '1 Thumb Up · Select & Inspect Part' : 'Giơ 1 Ngón Cái · Chọn & Đọc Cấu Tạo',
      desc: isEn
        ? 'Keep your hand steady over a component and raise 1 Thumb to select it, isolate it, and open its Structure & Function card.'
        : 'Khi tay đang trỏ vào linh kiện cần xem, giơ 1 ngón cái để chọn dứt khoát và mở ngay bảng Cấu tạo & Chức năng.',
      accent: 'text-amber-300 border-amber-500/35 bg-slate-900'
    },
    {
      step: '04',
      title: isEn ? 'Closed Fist · Rotate Assembled Model 360°' : 'Nắm Đấm · Xoay Khối 360° Khi Đang Ghép',
      desc: isEn
        ? 'When the model is assembled, close a fist to rotate it 360° smoothly. While separated in the horizontal row, positions stay locked.'
        : 'Khi mô hình đang ghép nguyên khối, nắm tay để xoay tròn 360° quan sát mọi mặt. Khi đang tách hàng ngang, các khối được khóa cố định.',
      accent: 'text-emerald-300 border-emerald-500/35 bg-slate-900'
    },
    {
      step: '05',
      title: isEn ? '2 Hands · Zoom + Weak-PC 0.5x / 30 FPS' : '2 Tay Thu Phóng · Tối Ưu Máy Yếu 0.5x / 30 FPS',
      desc: isEn
        ? 'Spread both hands apart to Zoom In or bring closer to Zoom Out on either the assembled model or horizontal row. Pick 0.5x scale & 30 FPS cap in Dock for low-spec PCs.'
        : 'Tách 2 tay ra xa để Phóng To hoặc khép gần để Thu Nhỏ mô hình. Trên máy cấu hình yếu, chọn độ phân giải 0.5x và giới hạn 30 FPS ngay ở thanh công cụ.',
      accent: 'text-slate-200 border-slate-700 bg-slate-900'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85"
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? '3D Spatial Studio Usage Guide' : 'Hướng dẫn sử dụng Không gian 3D'}
    >
      <div
        data-modal-shell="true"
        className="w-full max-w-4xl max-h-[92dvh] flex flex-col rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="shrink-0 flex items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/15 border border-sky-500/40 flex items-center justify-center text-sky-300 shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold text-sky-300 uppercase tracking-wider">
                {isEn ? '3D Spatial Guide · 5 Clear Gestures' : 'Hướng Dẫn Không Gian 3D · 5 Thao Tác Rõ Ràng'}
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white mt-0.5">
                {isEn
                  ? '3D Hand Control, Mouse Orbit & Low-Spec Performance'
                  : 'Điều Khiển Tay 3D, Xoay Chuột & Chế Độ Máy Yếu'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white cursor-pointer shrink-0"
            aria-label={isEn ? 'Close guide' : 'Đóng hướng dẫn'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary Strip */}
        <div className="shrink-0 px-4 sm:px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 text-[11px] sm:text-xs text-slate-200">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            {isEn
              ? 'Horizontal Row Mode: 2-finger V aligns all parts · Open hand aims along the row · 1 Thumb selects · Fist rotates · 2 hands zoom.'
              : 'Chế độ Hàng Ngang: Giơ 2 ngón V tách hàng ngang · Mở tay di chuyển ngắm · Giơ 1 ngón cái để chọn · Nắm tay xoay · 2 tay thu phóng.'}
          </span>
        </div>

        {/* Tabs */}
        <div className="shrink-0 px-4 sm:px-6 py-2.5 flex flex-nowrap sm:flex-wrap items-center gap-2 overflow-x-auto scrollbar-none border-b border-slate-800 bg-slate-950/70">
          {(
            [
              {
                id: 'workflow',
                labelVi: '5 Bước Thao Tác 3D',
                labelEn: '5-Step 3D Workflow',
                icon: Layers
              },
              {
                id: 'gestures',
                labelVi: 'Bảng Cử Chỉ Tay',
                labelEn: 'Full Gesture Table',
                icon: Hand
              },
              {
                id: 'mouse',
                labelVi: 'Chuột · Phím Tắt · Máy Yếu',
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{isEn ? t.labelEn : t.labelVi}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-950/40">
          {activeTab === 'workflow' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {steps3D.map((s, idx) => (
                <div
                  key={s.step}
                  className={`rounded-xl border p-4 flex flex-col justify-between gap-2 ${s.accent} ${
                    idx === 4 ? 'sm:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold tracking-wider opacity-90">
                        STEP {s.step}
                      </span>
                      <CheckCircle2 className="w-4 h-4 opacity-80" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">{s.title}</h3>
                    <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gestures' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  {isEn ? '5 Core 3D Gestures (Recommended)' : '5 Cử Chỉ Cầm Nắm 3D (Khuyên Dùng)'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {REAL_GRAB_GESTURES.map((g) => (
                    <div
                      key={`rg-${g.id}`}
                      className="rounded-xl bg-slate-900 border border-slate-800 p-3 flex items-start gap-3"
                    >
                      <div
                        className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-950 flex items-center justify-center font-mono text-sm font-bold shrink-0"
                        style={{ color: g.accent }}
                      >
                        {g.fingers}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-xs font-bold text-white">
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
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isEn ? 'Classic 8 Gestures (2D / Classic Mode)' : '8 Cử Chỉ Cổ Điển (Dành cho 2D / Chế Độ Cổ Điển)'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GESTURE_DEFINITIONS.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-xl bg-slate-900 border border-slate-800 p-3 flex items-start gap-3"
                    >
                      <div
                        className="w-9 h-9 rounded-lg border border-slate-700 bg-slate-950 flex items-center justify-center font-mono text-xs font-bold shrink-0"
                        style={{ color: g.accent }}
                      >
                        {g.fingers}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-xs font-bold text-white">
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
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2">
                <div className="font-bold text-cyan-300">
                  {isEn ? 'Mouse & Touch Viewport' : 'Chuột & Màn Hình Cảm Ứng'}
                </div>
                <ul className="space-y-1.5 text-slate-300 list-disc pl-4">
                  <li>{isEn ? 'Drag left mouse / 1 finger: Rotate model 360°' : 'Kéo chuột trái / 1 ngón: Xoay mô hình 360°'}</li>
                  <li>{isEn ? 'Scroll wheel / 2-finger pinch: Zoom in & out' : 'Cuộn chuột / chụm 2 ngón màn hình: Phóng to & Thu nhỏ'}</li>
                  <li>{isEn ? 'Right drag: Pan camera position' : 'Kéo chuột phải: Dịch chuyển khung nhìn'}</li>
                  <li>{isEn ? 'Click any exploded block: Isolate & inspect part' : 'Bấm trực tiếp vào bộ phận đã tách: Xem riêng & đọc chức năng'}</li>
                </ul>
              </div>

              <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2">
                <div className="font-bold text-emerald-300">
                  {isEn ? 'Virtual Gesture Pad & Dock Shortcuts' : 'Bàn Di Cử Chỉ Ảo & Phím Tắt'}
                </div>
                <ul className="space-y-1.5 text-slate-300 list-disc pl-4">
                  <li>{isEn ? 'Pick any of 8 gestures in Dock without a camera' : 'Chọn nhanh 1 trong 8 cử chỉ ở thanh dưới để mô phỏng không cần Webcam'}</li>
                  <li>{isEn ? 'Click "4 Fingers" in Dock to reassemble immediately' : 'Bấm nút "4 Ngón · Ghép lại" để hợp nhất mô hình tức thì'}</li>
                  <li>{isEn ? 'Space: Freeze/Unfreeze · R: Reset view · H: Hide HUD' : 'Phím Space: Đóng băng · Phím R: Đặt lại góc nhìn · Phím H: Ẩn HUD'}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Row */}
        <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2.5">
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-400 text-xs font-bold text-emerald-300 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{isEn ? 'Open 2D Free Create' : 'Sang Không gian 2D'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Close' : 'Đóng'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-bold text-slate-950 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{isEn ? 'Start 3D Manipulation' : 'Bắt Đầu Thao Tác 3D'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
