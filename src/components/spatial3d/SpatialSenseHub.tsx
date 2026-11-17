import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Clock,
  Compass,
  Hand,
  Layers,
  MousePointerClick,
  PenTool,
  RotateCcw,
  Scan,
  Sparkles,
  Users,
  Video
} from 'lucide-react';
import { GESTURE_DEFINITIONS, REAL_GRAB_GESTURES } from './handGestureTracker';

interface SpatialSenseHubProps {
  isEn: boolean;
  savedCustomCount?: number;
  onBack?: () => void;
  onLaunch3D: () => void;
  onLaunch2D: () => void;
  onLaunch2DGuide?: () => void;
  onOpenAICreator?: () => void;
  onOpenRealScanner?: () => void;
  onOpenCoop?: () => void;
}

type GuideViewTab = 'workflow' | 'gestures' | 'fallback';

export const SpatialSenseHub: React.FC<SpatialSenseHubProps> = ({
  isEn,
  savedCustomCount = 0,
  onBack,
  onLaunch3D,
  onLaunch2D,
  onLaunch2DGuide,
  onOpenAICreator,
  onOpenRealScanner,
  onOpenCoop
}) => {
  const [guideTab, setGuideTab] = useState<GuideViewTab>('workflow');

  const workflowSteps = [
    {
      num: '01',
      badge: isEn ? '✌️ 2 FINGERS · FIXED ROW / SNAP' : '✌️ 2 NGÓN V · HÀNG NGANG CỐ ĐỊNH',
      title: isEn ? 'Line Up 1 Fixed Horizontal Row' : 'Tách Xếp 1 Hàng Ngang Khóa Cố Định',
      desc: isEn
        ? 'Raise 2 fingers (✌️) to arrange every part into 1 straight immovable horizontal row (no purple plane, no drift). Raise ✌️ again to reassemble.'
        : 'Giơ 2 ngón chữ V để xếp toàn bộ linh kiện thành 1 hàng ngang thẳng hàng, khóa chặt vị trí (bỏ mặt cắt tím). Giơ ✌️ lại để lắp về như cũ.',
      accent: 'text-purple-300 border-purple-500/40 bg-purple-950/35'
    },
    {
      num: '02',
      badge: isEn ? '🖐️ OPEN HAND · HORIZONTAL AIM' : '🖐️ MỞ TAY · DI CHUYỂN NGẮM',
      title: isEn ? 'Move Hand Calmly Over Row' : 'Di Tay Nhẹ Qua Từng Linh Kiện',
      desc: isEn
        ? 'Glide an open palm horizontally across the row — each component lights up clearly without rotating or jumping out of position.'
        : 'Đưa tay mở di ngang qua các linh kiện trên hàng — từng linh kiện tự phát sáng định vị mà không hề xoay hay trượt khỏi hàng.',
      accent: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/35'
    },
    {
      num: '03',
      badge: isEn ? '👍 1 THUMB UP · SELECT PART' : '👍 1 NGÓN CÁI · CHỌN LINH KIỆN',
      title: isEn ? 'Raise 1 Thumb to Select' : 'Giơ 1 Ngón Cái Để Chọn Dứt Khoát',
      desc: isEn
        ? 'Once the aimed component highlights, raise 1 Thumb (👍) to select it cleanly and open its Structure & Function card.'
        : 'Khi linh kiện muốn xem sáng viền, chỉ cần giơ 1 ngón cái (👍) là chọn xong và mở ngay bảng Cấu tạo & Chức năng chi tiết.',
      accent: 'text-amber-300 border-amber-500/40 bg-amber-950/35'
    },
    {
      num: '04',
      badge: isEn ? '✊ FIST · ASSEMBLED 360° SPIN' : '✊ NẮM ĐẤM · XOAY KHI ĐANG GHÉP',
      title: isEn ? 'Rotate Whole Model 360°' : 'Xoay Trọn Mô Hình Khi Đang Ghép',
      desc: isEn
        ? 'Close a fist while assembled to rotate the entire 3D model 360°. Locked automatically during horizontal row mode.'
        : 'Nắm chặt tay khi mô hình đang ghép để xoay 360° mọi góc. Tự động khóa an toàn khi đang ở chế độ tách hàng ngang.',
      accent: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/35'
    },
    {
      num: '05',
      badge: isEn ? '👐 2 HANDS · ZOOM & WEAK-PC' : '👐 2 TAY · THU PHÓNG & 0.5x',
      title: isEn ? 'Zoom + 0.5x / 30 FPS Boost' : 'Thu Phóng + Giảm Lag Máy Yếu',
      desc: isEn
        ? 'Spread both hands apart to Zoom In or bring closer to Zoom Out; pick 0.5x resolution & 30F cap in Dock for lag-free FPS.'
        : 'Tách 2 tay phóng to / khép gần thu nhỏ hàng ngang; chọn ngay độ phân giải 0.5x và 30F trên thanh công cụ cho máy yếu.',
      accent: 'text-sky-300 border-sky-500/50 bg-sky-950/40'
    }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-110px)] rounded-xl bg-[#040814] text-slate-100 border border-sky-500/35 shadow-2xl overflow-hidden relative">
      {/* Subtle architectural coordinate backdrop */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 14%, rgba(56, 189, 248, 0.25), transparent 42%), radial-gradient(circle at 82% 20%, rgba(16, 185, 129, 0.2), transparent 40%), linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)',
          backgroundSize: 'auto, auto, 38px 38px, 38px 38px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-6">
        {/* Top Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/90">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="cs-deck-btn flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-900 border border-slate-700 hover:border-sky-400 text-xs font-bold text-slate-100 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isEn ? 'Back' : 'Quay lại'}</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? 'Spatial Sense Interactive Lab · 3D & 2D Studio'
                    : 'Trung Tâm Học Cảm Giác Không Gian · 3D & 2D'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
                {isEn
                  ? 'Explore 3D Models, 2D Free Creation & 10-Finger Controls'
                  : 'Học Cảm Giác Không Gian 3D, Tự Do Tạo 2D & Điều Khiển Cử Chỉ'}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenRealScanner && (
              <button
                type="button"
                onClick={onOpenRealScanner}
                className="cs-deck-btn flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/60 text-xs font-extrabold text-cyan-200 cursor-pointer"
              >
                <Scan className="w-3.5 h-3.5" />
                <span>
                  {isEn ? 'Scan Real Object → 3D' : 'Quét Thực Tế → 3D'}
                </span>
              </button>
            )}
            {onOpenAICreator && (
              <button
                type="button"
                onClick={onOpenAICreator}
                className="cs-deck-btn flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-purple-500/20 hover:bg-purple-500/35 border border-purple-400/60 text-xs font-extrabold text-purple-200 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? `AI Create Model (${savedCustomCount})`
                    : `AI Tạo Mô Hình (${savedCustomCount})`}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={onLaunch2D}
              className="cs-deck-btn flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-900 hover:bg-emerald-950/60 border border-emerald-500/50 text-xs font-extrabold text-emerald-300 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isEn ? 'Open 2D Space' : 'Vào Không Gian 2D'}</span>
            </button>
            <button
              type="button"
              onClick={onLaunch3D}
              className="cs-deck-btn flex items-center gap-1.5 px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 border border-sky-300 text-xs font-extrabold text-slate-950 cursor-pointer"
            >
              <Box className="w-3.5 h-3.5" />
              <span>{isEn ? 'Open 3D Space' : 'Vào Không Gian 3D'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {onOpenCoop && (
              <button
                type="button"
                onClick={onOpenCoop}
                className="cs-deck-btn flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/60 text-xs font-extrabold text-emerald-200 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{isEn ? 'Co-op Hands (2–4)' : 'Bàn Tay Bạn Học (2–4)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Summary Telemetry Strip (text + middots, zero pills) */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-300">
          <span>
            {isEn
              ? '15 3D Models · 5 Clear Grab Gestures · Weak-PC 0.5x / 30 FPS Optimization'
              : '15 Mô hình 3D · 5 Cử chỉ Cầm Nắm Rõ Ràng · Tối ưu Máy Yếu 0.5x / 30 FPS'}
          </span>
          <span className="text-emerald-300 font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {isEn
              ? 'Fixed horizontal row + 👍 1-Thumb select · Zero spin/drift chaos'
              : 'Hàng ngang cố định + 👍 Giơ 1 ngón cái chọn · Không xoay loạn, không mặt tím'}
          </span>
        </div>

        {/* TWO FLASHY PORTAL FRAMES: KHÔNG GIAN 3D & KHÔNG GIAN 2D */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* PORTAL 1: KHÔNG GIAN 3D */}
          <div className="spatial-holo-card spatial-step-reveal shadow-2xl">
            <div className="spatial-holo-ring" />
            <div className="relative z-10 h-full rounded-[9px] bg-[#070d1d] p-5 sm:p-6 flex flex-col justify-between gap-5 overflow-hidden">
              <div className="spatial-laser-sweep" />
              <div className="spatial-scanline-v" />

              {/* Decorative Holographic 3D Wireframe Gyroscope */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono font-extrabold text-cyan-300 uppercase tracking-wider">
                    <Box className="w-4 h-4" />
                    <span>{isEn ? 'SPACE MODULE 01 · THREE.JS PBR' : 'PHẦN 01 · KHÔNG GIAN 3D TƯƠNG TÁC'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {isEn ? '3D Spatial & Exploded Lab' : 'Không Gian 3D & Tách Cấu Trúc'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Pull 2 hands L/R to separate parts, raise 2 fingers to inspect any part individually, swipe to switch, and raise 4 fingers to reassemble.'
                      : 'Khám phá 15 mô hình Thực tế, Hình học Oxyz & Lượng tử. Tách cấu trúc bằng 2 tay, xem riêng từng bộ phận (2 ngón) và ghép lại bằng 4 ngón tay.'}
                  </p>
                </div>

                {/* Animated Vector Wireframe Cube & Rings */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-slate-950/90 border border-sky-500/40 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 100 100" className="w-20 h-20">
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="rgba(56, 189, 248, 0.55)"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                      className="spatial-orbit-spin"
                    />
                    <ellipse
                      cx="50"
                      cy="50"
                      rx="32"
                      ry="14"
                      fill="none"
                      stroke="rgba(45, 212, 191, 0.7)"
                      strokeWidth="1.5"
                      className="spatial-orbit-spin-rev"
                    />
                    <polygon
                      points="50,22 74,36 74,64 50,78 26,64 26,36"
                      fill="rgba(14, 165, 233, 0.14)"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    <line x1="50" y1="22" x2="50" y2="50" stroke="#7dd3fc" strokeWidth="1.4" />
                    <line x1="74" y1="64" x2="50" y2="50" stroke="#7dd3fc" strokeWidth="1.4" />
                    <line x1="26" y1="64" x2="50" y2="50" stroke="#7dd3fc" strokeWidth="1.4" />
                    <circle cx="50" cy="50" r="3.5" fill="#f97316" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-200">
                <div className="rounded-md bg-slate-900/90 border border-slate-800 px-3 py-2">
                  <span className="text-sky-300 font-bold block">15 Mô Hình 3D</span>
                  Động cơ, Robot IK, Siêu xe, DNA, Oxyz
                </div>
                <div className="rounded-md bg-slate-900/90 border border-slate-800 px-3 py-2">
                  <span className="text-orange-300 font-bold block">Tách & Ghép 4 Ngón</span>
                  Xem riêng từng phần + ghép về nguyên bản
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {onOpenAICreator ? (
                  <button
                    type="button"
                    onClick={onOpenAICreator}
                    className="cs-deck-btn flex items-center gap-1.5 px-3 py-2 rounded-md bg-purple-500/20 hover:bg-purple-500/35 border border-purple-400/55 text-xs font-bold text-purple-200 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEn ? 'AI Idea → 3D Model' : 'Sáng Tạo Tự Do (AI)'}</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-cyan-300">
                    {isEn ? 'Opens 3D Usage Guide Frame on click' : 'Bấm mở ngay Không gian 3D + Khung hướng dẫn'}
                  </span>
                )}
                <button
                  type="button"
                  onClick={onLaunch3D}
                  className="cs-deck-btn flex items-center gap-2 px-4 py-2.5 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-extrabold cursor-pointer"
                >
                  <Box className="w-4 h-4" />
                  <span>{isEn ? 'Enter 3D Space & Guide' : 'Mở Không Gian 3D'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* PORTAL 2: KHÔNG GIAN 2D */}
          <div
            style={{ animationDelay: '90ms' }}
            className="spatial-holo-card spatial-step-reveal shadow-2xl"
          >
            <div className="spatial-holo-ring spatial-holo-ring-emerald" />
            <div className="relative z-10 h-full rounded-[9px] bg-[#06101b] p-5 sm:p-6 flex flex-col justify-between gap-5 overflow-hidden">
              <div className="spatial-laser-sweep" />
              <div className="spatial-scanline-v" />

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono font-extrabold text-emerald-300 uppercase tracking-wider">
                    <Compass className="w-4 h-4" />
                    <span>{isEn ? 'SPACE MODULE 02 · 2D FREE CREATE' : 'PHẦN 02 · KHÔNG GIAN HÌNH HỌC 2D'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {isEn ? '2D Free Creation & Math Labs' : 'Không Gian 2D & Tự Do Tạo Hình'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Sketch shapes freely with your hand or mouse (Freehand, Line, Circle, Rect, Triangle, Star) with Auto Shape smoothing & Grid Snap, plus 6 math labs.'
                      : 'Trang bị chế độ Tự do tạo hình bằng tay/chuột (nét tự do, thẳng, tròn, vuông, tam giác, ngôi sao, tự nắn nét & bắt lưới) cùng 6 xưởng Toán 2D.'}
                  </p>
                </div>

                {/* Animated Vector Oxy Compass */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-slate-950/90 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 100 100" className="w-20 h-20">
                    <line x1="12" y1="50" x2="88" y2="50" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1.2" />
                    <line x1="50" y1="12" x2="50" y2="88" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1.2" />
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="rgba(16, 185, 129, 0.1)"
                      stroke="#10b981"
                      strokeWidth="1.8"
                      strokeDasharray="8 4"
                      className="spatial-orbit-spin"
                    />
                    <polygon
                      points="50,20 76,68 24,68"
                      fill="rgba(34, 211, 238, 0.15)"
                      stroke="#22d3ee"
                      strokeWidth="2"
                    />
                    <circle cx="50" cy="20" r="3.2" fill="#34d399" />
                    <circle cx="76" cy="68" r="3.2" fill="#34d399" />
                    <circle cx="24" cy="68" r="3.2" fill="#34d399" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-200">
                <div className="rounded-md bg-slate-900/90 border border-slate-800 px-3 py-2">
                  <span className="text-emerald-300 font-bold block">Tự Do Tạo 2D</span>
                  7 công cụ vẽ, nắn nét & di chuyển hình
                </div>
                <div className="rounded-md bg-slate-900/90 border border-slate-800 px-3 py-2">
                  <span className="text-cyan-300 font-bold block">6 Xưởng Hình Học</span>
                  Euler, Đường tròn lượng giác, Vector, Conic
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {onLaunch2DGuide ? (
                  <button
                    type="button"
                    onClick={onLaunch2DGuide}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-900 border border-emerald-500/45 hover:border-emerald-400 text-xs font-bold text-emerald-200 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{isEn ? '2D Guide' : 'Hướng dẫn 2D'}</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-emerald-300">
                    {isEn ? 'Supports Hand Pointer & Touch Screen' : 'Hỗ trợ vẽ bằng Ngón trỏ Camera hoặc Chuột'}
                  </span>
                )}
                <button
                  type="button"
                  onClick={onLaunch2D}
                  className="cs-deck-btn flex items-center gap-2 px-4 py-2.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>{isEn ? 'Enter 2D Free Create' : 'Mở Không Gian 2D'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PORTAL 3: HỌC QUA KHÔNG GIAN THỰC TẾ (CAMERA QUÉT ĐỒ VẬT XUNG QUANH → 3D) */}
        {onOpenRealScanner && (
          <div
            style={{ animationDelay: '125ms' }}
            className="spatial-holo-card spatial-step-reveal shadow-2xl"
          >
            <div className="spatial-holo-ring" />
            <div className="relative z-10 rounded-[9px] bg-[#061224] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 overflow-hidden">
              <div className="spatial-laser-sweep" />

              <div className="flex items-start gap-4 min-w-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-slate-950/90 border border-cyan-500/45 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <path d="M18 30 L18 18 L30 18" fill="none" stroke="#22d3ee" strokeWidth="3" />
                    <path d="M70 18 L82 18 L82 30" fill="none" stroke="#22d3ee" strokeWidth="3" />
                    <path d="M18 70 L18 82 L30 82" fill="none" stroke="#22d3ee" strokeWidth="3" />
                    <path d="M70 82 L82 82 L82 70" fill="none" stroke="#22d3ee" strokeWidth="3" />
                    <polygon
                      points="50,24 72,38 72,62 50,76 28,62 28,38"
                      fill="rgba(34,211,238,0.16)"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    <line x1="20" y1="50" x2="80" y2="50" stroke="#f97316" strokeWidth="2" strokeDasharray="4 3" />
                  </svg>
                </div>

                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-mono font-extrabold text-cyan-300 uppercase tracking-wider">
                    <Scan className="w-4 h-4" />
                    <span>
                      {isEn
                        ? 'SPACE MODULE 03 · REAL-WORLD AR CAMERA SCANNER'
                        : 'PHẦN 03 · HỌC QUA KHÔNG GIAN THỰC TẾ'}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">
                    {isEn
                      ? 'Scan Surrounding Physical Objects → Interactive 3D Models'
                      : 'Dùng Camera Quét Đồ Vật Xung Quanh → Tạo Mô Phỏng 3D Tương Tác'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Point your camera at any desk item, gadget, bottle, fan, or tool around you. AI recognizes its geometry and generates a full 3D assembly with identical Studio powers: 2-hand explode, 2-finger isolate, 4-finger reassemble, slice plane & .OBJ export.'
                      : 'Hướng camera vào đồ vật thật xung quanh bạn (cốc, quạt, đèn bàn, tai nghe, khối hình...) để chụp và tải lên tạo mô hình 3D hoàn chỉnh — hỗ trợ đầy đủ tách lớp 2 tay, soi chi tiết 2 ngón, ghép 4 ngón, mặt cắt & xuất .OBJ như mô hình có sẵn.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onOpenRealScanner}
                  className="cs-deck-btn flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 text-xs font-extrabold cursor-pointer whitespace-nowrap shadow-lg shadow-cyan-500/20"
                >
                  <Scan className="w-4 h-4" />
                  <span>{isEn ? 'Open Camera Scanner' : 'Bật Camera Quét Đồ Vật'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-cyan-300/90 text-center md:text-right">
                  {isEn ? 'Also supports photo upload' : 'Hỗ trợ cả chụp trực tiếp & tải ảnh'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PORTAL 4: BÀN TAY ẢO CỦA BẠN HỌC (KHÔNG GIAN 3D CHUNG 2–4 NGƯỜI QUA MẠNG) */}
        {onOpenCoop && (
          <div
            style={{ animationDelay: '145ms' }}
            className="spatial-holo-card spatial-step-reveal shadow-2xl"
          >
            <div className="spatial-holo-ring spatial-holo-ring-emerald" />
            <div className="relative z-10 rounded-[9px] bg-[#061322] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 overflow-hidden">
              <div className="spatial-laser-sweep" />

              <div className="flex items-start gap-4 min-w-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-slate-950/90 border border-emerald-400/45 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <circle cx="30" cy="48" r="14" fill="rgba(34,211,238,0.16)" stroke="#22d3ee" strokeWidth="2" />
                    <circle cx="70" cy="48" r="14" fill="rgba(245,158,11,0.16)" stroke="#f59e0b" strokeWidth="2" />
                    <polygon points="50,30 62,50 50,70 38,50" fill="rgba(16,185,129,0.22)" stroke="#10b981" strokeWidth="2" />
                    <line x1="30" y1="34" x2="50" y2="30" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />
                    <line x1="70" y1="34" x2="50" y2="30" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
                  </svg>
                </div>

                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-mono font-extrabold text-emerald-300 uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    <span>
                      {isEn
                        ? 'SPACE MODULE 04 · MULTIPLAYER VIRTUAL SKELETON HANDS (2–4)'
                        : 'PHẦN 04 · BÀN TAY ẢO CỦA BẠN HỌC (2–4 NGƯỜI)'}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">
                    {isEn
                      ? 'Explore Shared 3D Models Live With Classmates’ Skeleton Hands'
                      : 'Cùng 2–4 Bạn Học Khám Phá 1 Mô Hình 3D · Thấy Rõ Khung Xương Tay Nhau'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Create a synced 3D Co-op room and post a 1-click invite directly into Study Forum groups. Everyone sees each other’s 21-joint 3D skeleton hands exploding, rotating, and pointing at parts together in real time.'
                      : 'Tạo phòng 3D chung rồi gửi thẳng thẻ mời vào các nhóm Diễn đàn học tập. Từ 2–4 bạn bè cùng tham gia sẽ nhìn thấy bàn tay khung xương 21 khớp 3D của nhau theo thời gian thực cùng xoay, tách cấu trúc và chỉ chi tiết trên một mô hình chung.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onOpenCoop}
                  className="cs-deck-btn flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-extrabold cursor-pointer whitespace-nowrap shadow-lg shadow-emerald-500/20"
                >
                  <Users className="w-4 h-4" />
                  <span>{isEn ? 'Create / Join Co-op Room' : 'Tạo Phòng & Mời Diễn Đàn'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-emerald-300/90 text-center md:text-right">
                  {isEn ? 'Live 21-joint WebSocket hand sync' : 'Đồng bộ khung xương tay WebSocket 2–4 bạn'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: FLASHY ANIMATED CONTROLS & OPERATION MANUAL FRAME */}
        <div
          style={{ animationDelay: '160ms' }}
          className="spatial-holo-card spatial-step-reveal shadow-2xl"
        >
          <div className="spatial-holo-ring spatial-holo-ring-amber" />
          <div className="relative z-10 rounded-[9px] bg-[#060c1a] p-5 sm:p-6 space-y-5 overflow-hidden">
            <div className="spatial-laser-sweep" />

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono font-extrabold text-amber-300 uppercase tracking-wider">
                  <Hand className="w-4 h-4" />
                  <span>{isEn ? 'UNIFIED COMMAND & GESTURE GUIDE' : 'PHẦN 05 · HƯỚNG DẪN ĐIỀU KHIỂN & THAO TÁC'}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                  {isEn
                    ? 'Minimal 5-Gesture 3D Control, Low-Spec Modes & Mouse Fallback'
                    : 'Bộ 5 Cử Chỉ Cầm Nắm Rõ Ràng, Tối Ưu Máy Yếu & Điều Khiển Chuột'}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'workflow', vi: '5 Cử Chỉ 3D Rõ Ràng', en: '5 Real-Grab Steps', icon: Layers },
                    { id: 'gestures', vi: 'Bảng Cử Chỉ (Thực Tế & 2D)', en: 'Gestures (3D & 2D)', icon: Hand },
                    { id: 'fallback', vi: 'Chuột · Máy Yếu 0.5x', en: 'Mouse & Weak-PC Mode', icon: MousePointerClick }
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const active = guideTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setGuideTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-bold cursor-pointer transition-colors ${
                        active
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{isEn ? tab.en : tab.vi}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {guideTab === 'workflow' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {workflowSteps.map((st, idx) => (
                  <div
                    key={st.num}
                    style={{ animationDelay: `${idx * 60}ms` }}
                    className={`spatial-step-reveal rounded-lg border p-3.5 flex flex-col justify-between gap-2 ${st.accent}`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[10px] font-extrabold">
                        <span>{st.badge}</span>
                        <span>#{st.num}</span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-white leading-snug">{st.title}</h3>
                      <p className="text-[11px] text-slate-200 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {guideTab === 'gestures' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-md bg-slate-900/95 border border-emerald-500/40 px-3.5 py-2 text-xs text-emerald-200 font-bold">
                    <Hand className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {isEn
                        ? '5 Real-Grab 3D Gestures (Unambiguous, Fastest & Zero Misfire):'
                        : '5 Cử Chỉ Cầm Nắm 3D Thực Tế (Ít nhất · Đủ nhất · Rõ ràng nhất):'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                    {REAL_GRAB_GESTURES.map((g, idx) => (
                      <div
                        key={`hub-rg-${g.id}`}
                        style={{ animationDelay: `${idx * 35}ms` }}
                        className="spatial-step-reveal rounded-lg bg-slate-900/95 border border-emerald-500/35 p-3 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-base font-extrabold px-2 py-0.5 rounded bg-slate-950 border border-slate-700"
                            style={{ color: g.accent }}
                          >
                            {g.fingers}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-300">REAL-GRAB</span>
                        </div>
                        <div className="text-xs font-extrabold text-white">
                          {isEn ? g.labelEn : g.labelVi}
                        </div>
                        <div className="text-[11px] text-slate-300 leading-relaxed">
                          {isEn ? g.actionEn : g.actionVi}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {isEn ? 'Classic 8 Gestures (For 2D / Classic 3D)' : '8 Cử Chỉ Cổ Điển (Dành Cho 2D & Chế Độ Cổ Điển)'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {GESTURE_DEFINITIONS.map((g, idx) => (
                      <div
                        key={g.id}
                        style={{ animationDelay: `${idx * 30}ms` }}
                        className="spatial-step-reveal rounded-lg bg-slate-900/95 border border-slate-700/80 p-2.5 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-950 border border-slate-700"
                            style={{ color: g.accent }}
                          >
                            {g.fingers} {isEn ? 'Fingers' : 'Ngón'}
                          </span>
                        </div>
                        <div className="text-xs font-extrabold text-white">
                          {isEn ? g.labelEn : g.labelVi}
                        </div>
                        <div className="text-[11px] text-slate-400 leading-snug">
                          {isEn ? g.actionEn : g.actionVi}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {guideTab === 'fallback' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="rounded-lg bg-slate-900/95 border border-slate-700/80 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-extrabold text-cyan-300">
                    <MousePointerClick className="w-4 h-4" />
                    <span>{isEn ? 'Mouse & Touchpad' : 'Chuột & Cảm Ứng 3D/2D'}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Drag to rotate 3D models at smooth speed, scroll to zoom, and click any exploded part to inspect it.'
                      : 'Kéo chuột hoặc vuốt màn hình để xoay mô hình 3D, cuộn để thu phóng và bấm chọn trực tiếp từng bộ phận đã tách.'}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-900/95 border border-slate-700/80 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-extrabold text-emerald-300">
                    <Video className="w-4 h-4" />
                    <span>{isEn ? '10-Fingertip Webcam AI' : 'Bàn Di Ảo & 8 Nút Cử Chỉ'}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {isEn
                      ? 'No webcam? Switch any of the 8 gestures right on the bottom Dock and drag on the 3D Virtual Touch Pad.'
                      : 'Không có Webcam vẫn dùng đầy đủ 8 cử chỉ thông qua thanh nút dưới màn hình và Bàn Di Cử Chỉ 3D Ảo.'}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-900/95 border border-slate-700/80 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-extrabold text-amber-300">
                    <RotateCcw className="w-4 h-4" />
                    <span>{isEn ? 'Keyboard & Custom Remap' : 'Phím Tắt & Tùy Chỉnh Độ Nhạy'}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Press Space to freeze info, R to reset camera, H for Zen view, and tune 0.5s dwell or sensitivity anytime in Settings.'
                      : 'Space để đóng băng đọc thông số, R để đặt lại góc nhìn, H ẩn HUD, và chỉnh thời gian đợi 0.5s hoặc độ nhạy trong Cài đặt.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
