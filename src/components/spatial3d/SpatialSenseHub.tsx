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
  Sparkles,
  Video
} from 'lucide-react';
import { GESTURE_DEFINITIONS } from './handGestureTracker';

interface SpatialSenseHubProps {
  isEn: boolean;
  savedCustomCount?: number;
  onBack?: () => void;
  onLaunch3D: () => void;
  onLaunch2D: () => void;
  onLaunch2DGuide?: () => void;
  onOpenAICreator?: () => void;
}

type GuideViewTab = 'workflow' | 'gestures' | 'fallback';

export const SpatialSenseHub: React.FC<SpatialSenseHubProps> = ({
  isEn,
  savedCustomCount = 0,
  onBack,
  onLaunch3D,
  onLaunch2D,
  onLaunch2DGuide,
  onOpenAICreator
}) => {
  const [guideTab, setGuideTab] = useState<GuideViewTab>('workflow');

  const workflowSteps = [
    {
      num: '01',
      badge: isEn ? 'EXPLODE · 2 HANDS' : 'TÁCH · 2 TAY NGƯỢC CHIỀU',
      title: isEn ? 'Pull 2 Hands Left ↔ Right' : 'Kéo 2 Tay Trái–Phải Ngược Nhau',
      desc: isEn
        ? 'Separate the 3D engine, solar orbits, DNA, or pyramid into distinct components floating clearly apart.'
        : 'Chỉ khi kéo 2 tay sang trái–phải ngược chiều nhau mới tách cấu trúc mô hình ra xa thành từng cụm bộ phận.',
      accent: 'text-sky-300 border-sky-500/40 bg-sky-950/35'
    },
    {
      num: '02',
      badge: isEn ? 'ISOLATE · 2 FINGERS (0.5S)' : 'CHỌN · 2 NGÓN TAY (ĐỢI 0.5S)',
      title: isEn ? 'Select & Inspect Part' : 'Giơ 2 Ngón Xem Riêng Bộ Phận',
      desc: isEn
        ? 'Hold 2 fingers steady for 0.5s to isolate that single component with its structure & function card.'
        : 'Giơ 2 ngón giữ ổn định 0.5 giây để phóng riêng bộ phận đó, đọc bảng Giới thiệu cấu tạo & Chức năng chi tiết.',
      accent: 'text-purple-300 border-purple-500/40 bg-purple-950/35'
    },
    {
      num: '03',
      badge: isEn ? 'CYCLE · SWIPE L / R' : 'CHUYỂN · VUỐT TRÁI / PHẢI',
      title: isEn ? 'Swipe to Next / Prev Part' : 'Vuốt Tay Sang Bộ Phận Tiếp / Cũ',
      desc: isEn
        ? 'Swipe left or right to jump cleanly between components while keeping full rotation and zoom active.'
        : 'Vuốt tay qua trái/phải để đổi sang bộ phận kế tiếp hoặc quay lại phần trước, xoay & phóng to như mô hình riêng.',
      accent: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/35'
    },
    {
      num: '04',
      badge: isEn ? 'ZOOM & ORBIT · 1 / 2 / 5' : 'PHÓNG TO · THU NHỎ · XOAY 360°',
      title: isEn ? '1-Hand Up · 2-Hand Closer · 5-Finger Spin' : '1 Tay Lên Phóng · 2 Tay Gần Thu · 5 Ngón Xoay',
      desc: isEn
        ? 'Pull 1 hand up to zoom in, move 2 hands closer together to shrink, open 5 fingers for fast 360° orbit.'
        : 'Kéo 1 tay lên trên để phóng to, đưa 2 tay từ xa lại gần để thu nhỏ lại, mở 5 ngón để xoay 360° độ nhạy cao.',
      accent: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/35'
    },
    {
      num: '05',
      badge: isEn ? 'REASSEMBLE · 4 FINGERS (0.5S)' : 'GHÉP LẠI · 4 NGÓN TAY (ĐỢI 0.5S)',
      title: isEn ? '4 Fingers Reassemble All Parts' : 'Giơ 4 Ngón Ghép Mô Hình Về Lại',
      desc: isEn
        ? 'Raise 4 fingers and hold for 0.5 seconds to smoothly snap every separated component back into the assembled 3D model.'
        : 'Sau khi tách cấu trúc hoặc đang xem riêng bộ phận, giơ 4 ngón tay đợi 0.5s để ghép toàn bộ mô hình về nguyên trạng!',
      accent: 'text-orange-300 border-orange-500/50 bg-orange-950/40'
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
          </div>
        </div>

        {/* Summary Telemetry Strip (text + middots, zero pills) */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-300">
          <span>
            {isEn
              ? '15 3D Models · 7 2D Geometry Labs · 8 Hand Gestures · 0.5s Anti-Jitter Lock'
              : '15 Mô hình 3D · 7 Xưởng Hình học 2D · 8 Cử chỉ 10 Ngón · Trễ 0.5s Chống Loạn'}
          </span>
          <span className="text-amber-300 font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {isEn ? '0.5s hold before action triggers' : 'Đợi 0.5s ổn định ngón tay trước khi thực hiện'}
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

        {/* SECTION 3: FLASHY ANIMATED CONTROLS & OPERATION MANUAL FRAME */}
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
                  <span>{isEn ? 'UNIFIED COMMAND & GESTURE GUIDE' : 'PHẦN 03 · HƯỚNG DẪN ĐIỀU KHIỂN & THAO TÁC'}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                  {isEn
                    ? 'Unified Hand Gestures, 0.5s Dwell Safety & Mouse Controls'
                    : 'Quy Chuẩn Cử Chỉ Tay Thống Nhất, Độ Trễ 0.5s & Thao Tác Chuột'}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'workflow', vi: 'Quy Trình Tách–Ghép 3D', en: '3D Explode–Merge Flow', icon: Layers },
                    { id: 'gestures', vi: '8 Cử Chỉ Tay (0.5s)', en: '8 Gestures (0.5s)', icon: Hand },
                    { id: 'fallback', vi: 'Chuột / Cảm Ứng', en: 'Mouse / Touch', icon: MousePointerClick }
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
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-md bg-slate-900/95 border border-sky-500/40 px-3.5 py-2.5 text-xs text-sky-200">
                  <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>
                    {isEn
                      ? 'Every finger-count transition waits 0.5s for your fingers to finish opening so intermediate finger counts never misfire!'
                      : 'Mọi lần đổi số ngón tay đều đợi đủ 0.5 giây cho ngón duỗi hết rồi mới kích hoạt hành động — tuyệt đối không bị loạn khi chuyển từ 1 lên 4 hay 5 ngón.'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {GESTURE_DEFINITIONS.map((g, idx) => (
                    <div
                      key={g.id}
                      style={{ animationDelay: `${idx * 40}ms` }}
                      className="spatial-step-reveal rounded-lg bg-slate-900/95 border border-slate-700/80 p-3 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="font-mono text-sm font-extrabold px-2 py-0.5 rounded bg-slate-950 border border-slate-700"
                          style={{ color: g.accent }}
                        >
                          {g.fingers} {isEn ? 'Fingers' : 'Ngón'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">0.5s lock</span>
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
