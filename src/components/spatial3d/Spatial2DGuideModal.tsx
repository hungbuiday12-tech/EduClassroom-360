import React, { useState } from 'react';
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Clock,
  Compass,
  Hand,
  MousePointerClick,
  PenTool,
  RotateCcw,
  Sparkles,
  Wand2,
  X
} from 'lucide-react';

interface Spatial2DGuideModalProps {
  isOpen: boolean;
  isEn: boolean;
  autoShowOn2D: boolean;
  onToggleAutoShow: (val: boolean) => void;
  onClose: () => void;
  onSwitchTo3D?: () => void;
}

type Guide2DTab = 'free_tools' | 'math_labs' | 'gestures_2d';

export const Spatial2DGuideModal: React.FC<Spatial2DGuideModalProps> = ({
  isOpen,
  isEn,
  autoShowOn2D,
  onToggleAutoShow,
  onClose,
  onSwitchTo3D
}) => {
  const [activeTab, setActiveTab] = useState<Guide2DTab>('free_tools');

  if (!isOpen) return null;

  const freeTools = [
    {
      badge: '01 · FREEHAND',
      title: isEn ? 'Freehand Curve + Dual-Hand Draw' : 'Vẽ Tay Tự Do & Vẽ Song Song 2 Tay',
      desc: isEn
        ? 'Point 1 finger (or drag with mouse) to sketch fluid curves on the Oxy plane. With 2 hands open, draw two symmetrical colors at once!'
        : 'Giơ 1 ngón trỏ (hoặc kéo chuột) để vẽ nét tự do trên mặt phẳng Oxy. Khi đưa 2 tay vào, vẽ được 2 nét màu song song cùng lúc!',
      accent: 'text-emerald-300 border-emerald-500/45 bg-emerald-500/10'
    },
    {
      badge: '02 · AUTO SHAPE',
      title: isEn ? 'Smart Shape Recognition ("Tự nắn nét")' : 'Tự Nắn Nét Hình Học Thông Minh',
      desc: isEn
        ? 'Turn on "Auto Shape": rough hand-drawn circles, lines, or triangles automatically snap into crisp geometric shapes with exact radius & length metrics.'
        : 'Bật nút "Tự nắn nét": nét vẽ tay hơi méo sẽ tự động biến thành Hình tròn, Đoạn thẳng hoặc Tam giác chuẩn kèm số đo bán kính, chu vi.',
      accent: 'text-purple-300 border-purple-500/45 bg-purple-500/10'
    },
    {
      badge: '03 · 5 SHAPES + MOVE',
      title: isEn ? 'Parametric Shapes & Pinch Dragging' : '5 Hình Chuẩn & Công Cụ Di Chuyển',
      desc: isEn
        ? 'Switch between Line, Circle, Rect, Triangle, Star or Move tool. Pinch thumb + index (or use Move) to grab and reposition any drawn shape.'
        : 'Chọn Đoạn thẳng, Tròn, Vuông/CN, Tam giác, Ngôi sao hoặc Di chuyển. Chụm ngón cái–trỏ để gắp và dời vị trí bất kỳ hình nào đã vẽ.',
      accent: 'text-cyan-300 border-cyan-500/45 bg-cyan-500/10'
    },
    {
      badge: '04 · GRID SNAP',
      title: isEn ? 'Oxy 0.5-Unit Grid Snap & Color Palette' : 'Bắt Lưới 0.5 Đơn Vị & Bảng 6 Màu',
      desc: isEn
        ? 'Enable Grid Snap to align vertices cleanly every 0.5 Oxy units. Use Undo / Clear in the bottom dock and Export PNG anytime.'
        : 'Bật "Bắt lưới" để căn đỉnh chính xác theo từng ô 0.5 đơn vị Oxy. Hỗ trợ Hoàn tác từng hình, Đổi 6 màu nét và Xuất ảnh PNG sắc nét.',
      accent: 'text-amber-300 border-amber-500/45 bg-amber-500/10'
    }
  ];

  const mathLabs2D = [
    {
      code: 'LAB 01',
      title: isEn ? 'Triangle & Euler Line (O–G–H)' : 'Tam Giác & Đường Thẳng Euler (O–G–H)',
      desc: isEn
        ? 'Pinch to drag vertices A, B, C (or 2 hands simultaneously) and watch Circumcenter O, Centroid G & Orthocenter H stay collinear (HG = 2·GO).'
        : 'Chụm ngón kéo đỉnh A, B, C (hoặc kéo 2 đỉnh bằng 2 tay) để chứng minh O, G, H luôn thẳng hàng với HG = 2·GO.',
      formula: 'O — G — H · HG = 2·GO'
    },
    {
      code: 'LAB 02',
      title: isEn ? '2-Hand Compass & Circle Tangents' : 'Compa 2 Tay & Tiếp Tuyến Đường Tròn',
      desc: isEn
        ? 'Hand 1 sets center O while Hand 2 stretches radius R; pinch to drag external point P and measure equal tangent segments PT₁ = PT₂.'
        : 'Tay 1 đặt tâm O, Tay 2 kéo bán kính R như compa; chụm ngón dời điểm P để xem 2 tiếp tuyến PT₁ = PT₂ vuông góc bán kính.',
      formula: '(x-x₀)² + (y-y₀)² = R²'
    },
    {
      code: 'LAB 03',
      title: isEn ? '2-Hand Vector Addition & Dot Product' : 'Cộng Vector 2 Tay & Tích Vô Hướng',
      desc: isEn
        ? 'Aim vector u with left hand and vector v with right hand to inspect the parallelogram sum w = u + v and angle θ live.'
        : 'Tay trái lái vector u, tay phải lái vector v để dựng hình bình hành tổng w = u + v và đo góc θ tức thì.',
      formula: 'u·v = |u|·|v|·cos(θ)'
    },
    {
      code: 'LAB 04',
      title: isEn ? 'Radial Symmetry Kaleidoscope' : 'Kính Vạn Hoa Đối Xứng Bậc n',
      desc: isEn
        ? 'Draw with 1 or 2 hands across 4, 6, 8, or 12 radial mirror axes; raise 3 fingers (hold 0.5s) to cycle symmetry order.'
        : 'Vẽ hoa văn đối xứng tâm qua 4, 6, 8 hoặc 12 trục gương; giơ 3 ngón tay (đợi 0.5s) để đổi số cánh đối xứng.',
      formula: 'n ∈ {4, 6, 8, 12}'
    },
    {
      code: 'LAB 05',
      title: isEn ? 'Parabola & Secant Intersection' : 'Parabol & Tương Giao Đường Thẳng',
      desc: isEn
        ? 'Pinch to bend y = ax² + bx + c and hold 2 fingers to sweep y = kx + m, tracking Δ and real-time root intersections M₁, M₂.'
        : 'Chụm ngón uốn độ cong Parabol, giơ 2 ngón xoay đường thẳng cắt để quan sát biệt thức Δ và tọa độ giao điểm M₁, M₂.',
      formula: 'ax² + bx + c = kx + m'
    },
    {
      code: 'LAB 06',
      title: isEn ? '7-Piece Gesture Tangram' : 'Xếp Hình Tangram 7 Mảnh',
      desc: isEn
        ? 'Pinch to pick up polygons, tilt your wrist or use 5 fingers to rotate in 15° snaps, and assemble custom silhouettes.'
        : 'Chụm ngón gắp 7 mảnh đa giác, nghiêng cổ tay hoặc mở 5 ngón để xoay từng 15° ghép hình sáng tạo.',
      formula: 'S_tổng = a² (7 mảnh)'
    }
  ];

  const gestures2D = [
    {
      tag: '🖐️ MỞ 5 NGÓN',
      title: isEn ? 'Aim & Hover Safely (No Draw)' : 'Di Chuyển Con Trỏ Ngắm (Không Vẽ)',
      desc: isEn
        ? 'Keep your hand open with 5 fingers to aim freely across the Oxy board without accidentally drawing lines or pulling vertices.'
        : 'Mở 5 ngón tay để rê con trỏ ngắm thoải mái trên bảng Oxy mà không sợ vẽ nhầm nét hay làm lệch hình.',
      accent: 'text-cyan-300 border-cyan-500/45'
    },
    {
      tag: '☝️ 1 NGÓN TRỎ',
      title: isEn ? 'Draw Freehand, Shapes & Curves' : 'Vẽ Nét Tự Do, Hình Chuẩn & Đường Cong',
      desc: isEn
        ? 'Point 1 index finger (or drag with mouse) to sketch curves, place Line/Circle/Rect/Triangle/Star, paint Kaleidoscope, or bend Parabola.'
        : 'Giơ 1 ngón trỏ (hoặc kéo chuột) để vẽ nét tự do, đặt Đoạn/Tròn/Vuông/Tam giác/Sao, vẽ Kính vạn hoa hoặc uốn Parabol.',
      accent: 'text-emerald-300 border-emerald-500/45'
    },
    {
      tag: '🤏 CHỤM NGÓN',
      title: isEn ? 'Grab & Drag Any Point or Shape' : 'Gắp & Kéo Bất Kỳ Hình / Đỉnh Nào',
      desc: isEn
        ? 'Pinch thumb + index to grab drawn shapes, move Triangle vertices A/B/C, drag tangent point P, or pick & move Tangram tiles.'
        : 'Chụm ngón cái + trỏ để gắp di chuyển hình đã vẽ, kéo đỉnh A/B/C (Euler), dời điểm P tiếp tuyến hoặc xếp mảnh Tangram.',
      accent: 'text-amber-300 border-amber-500/45'
    },
    {
      tag: '✌️ 2 NGÓN CHỮ V',
      title: isEn ? 'Rotate 45° / Cycle Mode / Sweep Secant' : 'Xoay 45° · Đổi Bậc · Quét Đường Cắt',
      desc: isEn
        ? 'One simple V-sign does every secondary toggle: rotates Tangram piece +45°, cycles Kaleidoscope 4/6/8/12 axes, or sweeps secant line.'
        : '1 động tác chữ V cho mọi lệnh phụ: Xoay 45° mảnh Tangram, đổi số cánh Kính vạn hoa (4/6/8/12), hoặc xoay đường cắt.',
      accent: 'text-purple-300 border-purple-500/45'
    },
    {
      tag: '✊ NẮM ĐẤM · 👐 2 TAY',
      title: isEn ? 'Freeze Board (0) · Dual-Hand Mode (2H)' : 'Khóa Bảng (Nắm Đấm) · Chế Độ 2 Tay Song Song',
      desc: isEn
        ? 'Close fist (0) to lock metrics cleanly. Show 2 hands anytime to drive Compass (center + radius), Vector u+v, or dual strokes!'
        : 'Nắm đấm (0 ngón) để đứng yên bảng đọc tọa độ. Đưa 2 tay vào để làm Compa 2 tay, kéo 2 Vector u & v, hoặc vẽ đôi 2 màu!',
      accent: 'text-sky-300 border-sky-500/45'
    },
    {
      tag: '🖱️ CHUỘT & PHÍM TẮT',
      title: isEn ? 'Full Mouse / Touch + Shortcuts' : 'Vẽ Chuột / Cảm Ứng & Phím Tắt Nhanh',
      desc: isEn
        ? 'No Webcam needed: drag directly with mouse/touchpad to draw or move points. Press Space (Lock), R (Reset), H (Hide HUD).'
        : 'Không cần Webcam: kéo chuột hoặc chạm màn hình để vẽ & kéo điểm trực tiếp. Phím tắt: Space (Khóa), R (Đặt lại), H (Ẩn HUD).',
      accent: 'text-slate-300 border-slate-600'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85"
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? '2D Spatial Studio Usage Guide' : 'Hướng dẫn Không gian 2D'}
    >
      <div className="spatial-holo-card spatial-step-reveal w-full max-w-4xl shadow-2xl">
        <div className="spatial-holo-ring spatial-holo-ring-emerald" />
        <div className="relative z-10 rounded-[9px] bg-[#06101b] border border-emerald-500/40 overflow-hidden">
          <div className="spatial-laser-sweep" />

          {/* Header */}
          <div className="relative flex items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? '2D Oxy Studio Guide · 4+1 Simple Gestures' : 'Hướng Dẫn Không Gian 2D · Cử Chỉ Siêu Đơn Giản'}</span>
                </div>
                <h2 className="text-base sm:text-xl font-extrabold text-white mt-0.5">
                  {isEn
                    ? 'How to Draw, Snap Shapes & Run 2D Interactive Labs'
                    : 'Chỉ 4 Cử Chỉ Chính: Mở Tay Ngắm · 1 Ngón Vẽ · Chụm Kéo · 2 Ngón Xoay/Đổi'}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md bg-slate-900 border border-slate-700 hover:border-emerald-400 text-slate-300 hover:text-white cursor-pointer shrink-0"
              aria-label={isEn ? 'Close 2D guide' : 'Đóng hướng dẫn 2D'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Simplified Gesture Strip */}
          <div className="px-4 sm:px-6 py-2.5 bg-emerald-950/45 border-b border-emerald-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-200 font-semibold">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                {isEn
                  ? 'Super Simple 2D Rule: 🖐️ Open Hand = Aim · ☝️ 1 Finger = Draw · 🤏 Pinch = Grab & Move · ✌️ 2 Fingers = Rotate/Cycle · ✊ Fist = Lock.'
                  : 'Quy tắc 2D cực dễ nhớ: 🖐️ Mở tay = Di chuyển ngắm · ☝️ 1 ngón = Vẽ · 🤏 Chụm = Gắp kéo · ✌️ 2 ngón = Xoay/Đổi · ✊ Nắm = Khóa bảng.'}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 sm:px-6 pt-3 flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3 bg-slate-950/60">
            {(
              [
                {
                  id: 'free_tools',
                  labelVi: 'Xưởng Tự Do Tạo 2D (7 Công Cụ)',
                  labelEn: 'Free Create Studio (7 Tools)',
                  icon: PenTool
                },
                {
                  id: 'math_labs',
                  labelVi: '6 Xưởng Hình Học Oxy',
                  labelEn: '6 Oxy Geometry Labs',
                  icon: Wand2
                },
                {
                  id: 'gestures_2d',
                  labelVi: 'Cử Chỉ Tay 2D & Chuột',
                  labelEn: '2D Gestures & Mouse',
                  icon: Hand
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-bold cursor-pointer transition-colors ${
                    active
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{isEn ? t.labelEn : t.labelVi}</span>
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 max-h-[54vh] overflow-y-auto space-y-3">
            {activeTab === 'free_tools' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {freeTools.map((item, idx) => (
                  <div
                    key={item.badge}
                    style={{ animationDelay: `${idx * 55}ms` }}
                    className={`spatial-step-reveal rounded-lg border p-3.5 space-y-1.5 ${item.accent}`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-extrabold">
                      <span>{item.badge}</span>
                      <CheckCircle2 className="w-4 h-4 opacity-80" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-white">{item.title}</h3>
                    <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'math_labs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {mathLabs2D.map((lab, idx) => (
                  <div
                    key={lab.code}
                    style={{ animationDelay: `${idx * 45}ms` }}
                    className="spatial-step-reveal rounded-lg bg-slate-900/95 border border-slate-700/80 p-3 flex flex-col justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300 font-extrabold">
                        <span>{lab.code}</span>
                        <span>OXY 2D</span>
                      </div>
                      <h3 className="text-xs font-extrabold text-white">{lab.title}</h3>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{lab.desc}</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] font-bold text-cyan-300">
                      {lab.formula}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gestures_2d' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {gestures2D.map((g, idx) => (
                  <div
                    key={g.tag}
                    style={{ animationDelay: `${idx * 45}ms` }}
                    className="spatial-step-reveal rounded-lg bg-slate-900/95 border border-slate-700/80 p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-extrabold px-2 py-0.5 rounded bg-slate-950 border border-emerald-500/40 text-emerald-300">
                        {g.tag}
                      </span>
                      <MousePointerClick className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="text-xs font-extrabold text-white">{g.title}</div>
                    <div className="text-[11px] text-slate-300 leading-relaxed">{g.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Action Row */}
          <div className="px-4 sm:px-6 py-3.5 border-t border-slate-800 bg-slate-950/95 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoShowOn2D}
                onChange={(e) => onToggleAutoShow(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <span>
                {isEn
                  ? 'Show 2D guide automatically when entering 2D Space'
                  : 'Hiện khung hướng dẫn này mỗi khi vào Không gian 2D'}
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-2 ml-auto">
              {onSwitchTo3D && (
                <button
                  type="button"
                  onClick={onSwitchTo3D}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-900 border border-slate-700 hover:border-sky-400 text-xs font-bold text-sky-300 cursor-pointer"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Open 3D Space' : 'Sang Không gian 3D'}</span>
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
                className="cs-deck-btn flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 border border-emerald-300 text-xs font-extrabold text-slate-950 cursor-pointer"
              >
                <span>{isEn ? 'Start 2D Creation' : 'Bắt Đầu Sáng Tạo 2D'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
