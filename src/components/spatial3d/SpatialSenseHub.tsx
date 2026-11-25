import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Compass,
  Hand,
  Layers,
  Monitor,
  MousePointerClick,
  PenTool,
  QrCode,
  RotateCcw,
  Scan,
  ScanFace,
  Sparkles,
  Users,
  Video
} from 'lucide-react';
import { GESTURE_DEFINITIONS, REAL_GRAB_GESTURES } from './handGestureTracker';
import { useRemoteController } from '../../context/RemoteControllerContext';

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
  const { openModal: openRemoteModal, controllerCount } = useRemoteController();

  const workflowSteps = [
    {
      num: '01',
      badge: isEn ? '2 FINGERS V · FIXED ROW' : '2 NGÓN V · HÀNG NGANG CỐ ĐỊNH',
      title: isEn ? 'Line Up 1 Fixed Horizontal Row' : 'Tách Xếp 1 Hàng Ngang Khóa Cố Định',
      desc: isEn
        ? 'Raise 2 fingers to arrange every part into 1 straight immovable horizontal row. Raise 2 fingers again to reassemble.'
        : 'Giơ 2 ngón chữ V để xếp toàn bộ linh kiện thành 1 hàng ngang thẳng hàng, khóa chặt vị trí. Giơ 2 ngón lại để lắp về nguyên bản.',
      accent: 'text-sky-300 border-slate-800 bg-slate-900'
    },
    {
      num: '02',
      badge: isEn ? 'OPEN HAND · HORIZONTAL AIM' : 'MỞ TAY · DI CHUYỂN NGẮM',
      title: isEn ? 'Move Hand Calmly Over Row' : 'Di Tay Nhẹ Qua Từng Linh Kiện',
      desc: isEn
        ? 'Glide an open palm horizontally across the row — each component lights up clearly without rotating or jumping out of position.'
        : 'Đưa tay mở di ngang qua các linh kiện trên hàng — từng linh kiện tự phát sáng định vị mà không xoay hay trượt khỏi hàng.',
      accent: 'text-cyan-300 border-slate-800 bg-slate-900'
    },
    {
      num: '03',
      badge: isEn ? '1 THUMB UP · SELECT PART' : '1 NGÓN CÁI · CHỌN LINH KIỆN',
      title: isEn ? 'Raise 1 Thumb to Select' : 'Giơ 1 Ngón Cái Để Chọn',
      desc: isEn
        ? 'Once the aimed component highlights, raise 1 Thumb to select it cleanly and open its Structure & Function card.'
        : 'Khi linh kiện muốn xem sáng viền, chỉ cần giơ 1 ngón cái để chọn xong và mở ngay bảng Cấu tạo & Chức năng chi tiết.',
      accent: 'text-amber-300 border-slate-800 bg-slate-900'
    },
    {
      num: '04',
      badge: isEn ? 'FIST · ASSEMBLED 360° SPIN' : 'NẮM ĐẤM · XOAY KHI ĐANG GHÉP',
      title: isEn ? 'Rotate Whole Model 360°' : 'Xoay Trọn Mô Hình Khi Đang Ghép',
      desc: isEn
        ? 'Close a fist while assembled to rotate the entire 3D model 360°. Locked automatically during horizontal row mode.'
        : 'Nắm tay khi mô hình đang ghép để xoay 360° mọi góc. Tự động khóa cố định khi đang ở chế độ tách hàng ngang.',
      accent: 'text-emerald-300 border-slate-800 bg-slate-900'
    },
    {
      num: '05',
      badge: isEn ? '2 HANDS · ZOOM & WEAK-PC' : '2 TAY · THU PHÓNG & 0.5x',
      title: isEn ? 'Zoom + 0.5x / 30 FPS Boost' : 'Thu Phóng + Giảm Tải Máy Yếu',
      desc: isEn
        ? 'Spread both hands apart to Zoom In or bring closer to Zoom Out; pick 0.5x resolution & 30 FPS cap in Dock for smooth frame rates.'
        : 'Tách 2 tay phóng to / khép gần thu nhỏ hàng ngang; chọn độ phân giải 0.5x và giới hạn 30 FPS trên thanh công cụ cho máy yếu.',
      accent: 'text-slate-200 border-slate-800 bg-slate-900'
    }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-110px)] rounded-xl bg-slate-950 text-slate-100 border border-slate-800 shadow-2xl overflow-hidden relative">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-6">
        {/* Top Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-100 cursor-pointer whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isEn ? 'Back' : 'Quay lại'}</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                <Box className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? 'Spatial Sense Interactive Lab · 3D & 2D Studio'
                    : 'Trung Tâm Học Cảm Giác Không Gian · 3D & 2D'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                {isEn
                  ? 'Explore 3D Models, 2D Free Creation & Hand Controls'
                  : 'Khám Phá Mô Hình 3D, Tự Do Tạo Hình 2D & Điều Khiển Cử Chỉ'}
              </h1>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-nowrap sm:flex-wrap items-center gap-2 overflow-x-auto sm:overflow-visible scrollbar-none pb-0.5 sm:pb-0">
            {onOpenRealScanner && (
              <button
                type="button"
                onClick={onOpenRealScanner}
                className="flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/45 text-xs font-bold text-cyan-200 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Scan className="w-3.5 h-3.5 shrink-0" />
                <span>{isEn ? 'Scan Real Object → 3D' : 'Quét Thực Tế → 3D'}</span>
              </button>
            )}
            {onOpenAICreator && (
              <button
                type="button"
                onClick={onOpenAICreator}
                className="flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-indigo-500/45 text-xs font-bold text-indigo-200 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isEn
                    ? `Custom 3D Builder (${savedCustomCount})`
                    : `Tạo Mô Hình 3D (${savedCustomCount})`}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={onLaunch2D}
              className="flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-slate-900 hover:bg-emerald-950/60 border border-emerald-500/45 text-xs font-bold text-emerald-300 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? 'Open 2D Space' : 'Vào Không Gian 2D'}</span>
            </button>
            <button
              type="button"
              onClick={onLaunch3D}
              className="flex items-center gap-1.5 px-4 py-2 min-h-[38px] rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-bold text-slate-950 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Box className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? 'Open 3D Space' : 'Vào Không Gian 3D'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
            {onOpenCoop && (
              <button
                type="button"
                onClick={onOpenCoop}
                className="flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-emerald-500/45 text-xs font-bold text-emerald-200 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>{isEn ? 'Co-op Hands (2–4)' : 'Bàn Tay Bạn Học (2–4)'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={openRemoteModal}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                controllerCount > 0
                  ? 'bg-emerald-600/20 border-emerald-400/70 text-emerald-200'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-sky-200'
              }`}
              title={
                isEn
                  ? 'Scan QR to use Phone as 3D Controller'
                  : 'Quét QR biến Điện thoại thành tay cầm xoay 3D từ xa'
              }
            >
              <QrCode className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? 'QR Remote' : 'QR Điều khiển'}</span>
              {controllerCount > 0 && (
                <span className="px-1 rounded bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold tabular-nums">
                  {controllerCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Summary Telemetry Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <span>
            {isEn
              ? '18 3D Models (STEM, Chem & Bio) · Parallax View · 5 Grab Gestures · Weak-PC 0.5x / 30 FPS'
              : '18 Mô hình 3D (Kỹ thuật, Hóa, Sinh, Toán) · Thị Sai Mắt/Đầu · 5 Cử chỉ Rõ Ràng · Tối ưu Máy Yếu'}
          </span>
          <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5" />
            {isEn
              ? 'Fixed horizontal row + Eye-Gaze HUD & Mouse support'
              : 'Hàng ngang cố định + Nhìn đâu sáng đó (Gaze HUD) & Chuột/Cảm ứng'}
          </span>
        </div>

        {/* TWO CLEAN PORTAL CARDS: KHÔNG GIAN 3D & KHÔNG GIAN 2D */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* PORTAL 1: KHÔNG GIAN 3D */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/45 transition-colors p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                  <Box className="w-4 h-4" />
                  <span>{isEn ? 'MODULE 01 · THREE.JS PBR' : 'PHẦN 01 · KHÔNG GIAN 3D TƯƠNG TÁC'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {isEn ? '3D Spatial & Exploded Lab' : 'Không Gian 3D & Tách Cấu Trúc'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Inspect 18 engineering, chemistry, biology, and Oxyz 3D assemblies. Separate components into a fixed row, isolate parts, and inspect formulas.'
                    : 'Khám phá 18 mô hình Kỹ thuật, Phân tử Hóa học, Tế bào/ADN Sinh học & Hình học Oxyz. Tách linh kiện thành hàng ngang cố định, xem riêng từng bộ phận và ghép về nguyên bản.'}
                </p>
              </div>

              {/* Clean Technical Orthographic Isometric Icon */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-20 h-20">
                  <polygon
                    points="50,20 76,35 76,65 50,80 24,65 24,35"
                    fill="rgba(14, 165, 233, 0.12)"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  <line x1="50" y1="20" x2="50" y2="50" stroke="#7dd3fc" strokeWidth="1.4" />
                  <line x1="76" y1="65" x2="50" y2="50" stroke="#7dd3fc" strokeWidth="1.4" />
                  <line x1="24" y1="65" x2="50" y2="50" stroke="#7dd3fc" strokeWidth="1.4" />
                  <line x1="50" y1="50" x2="50" y2="80" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="3.5" fill="#f59e0b" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-medium text-slate-200">
              <div className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2">
                <span className="text-sky-300 font-bold block">18 Mô Hình 3D</span>
                Động cơ, Robot IK, Phân tử, Tế bào, DNA, Oxyz
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2">
                <span className="text-cyan-300 font-bold flex items-center gap-1">
                  <ScanFace className="w-3.5 h-3.5 shrink-0" />
                  Thị Sai Mắt & Đầu
                </span>
                Gaze HUD & chớp mắt tách lớp tự động
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2">
                <span className="text-amber-300 font-bold block">Tách & Ghép 4 Ngón</span>
                Xem riêng từng phần + ghép về nguyên bản
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {onOpenAICreator ? (
                <button
                  type="button"
                  onClick={onOpenAICreator}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-indigo-200 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Text → 3D Model' : 'Tạo Mô Hình 3D Mới'}</span>
                </button>
              ) : (
                <span className="text-[11px] font-mono text-slate-400">
                  {isEn ? 'Opens 3D Usage Guide on click' : 'Bấm mở ngay Không gian 3D + Hướng dẫn'}
                </span>
              )}
              <button
                type="button"
                onClick={onLaunch3D}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
              >
                <Box className="w-4 h-4" />
                <span>{isEn ? 'Enter 3D Space & Guide' : 'Mở Không Gian 3D'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PORTAL 2: KHÔNG GIAN 2D */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/45 transition-colors p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>{isEn ? 'MODULE 02 · 2D FREE CREATE' : 'PHẦN 02 · KHÔNG GIAN HÌNH HỌC 2D'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {isEn ? '2D Free Creation & Math Labs' : 'Không Gian 2D & Tự Do Tạo Hình'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Sketch shapes freely with your hand or mouse (Freehand, Line, Circle, Rect, Triangle, Star) with Auto Shape smoothing & Grid Snap, plus 6 math labs.'
                    : 'Trang bị chế độ Tự do tạo hình bằng tay/chuột (nét tự do, thẳng, tròn, vuông, tam giác, ngôi sao, tự nắn nét & bắt lưới) cùng 6 xưởng Toán 2D.'}
                </p>
              </div>

              {/* Clean Oxy Coordinate Schematic */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-20 h-20">
                  <line x1="12" y1="50" x2="88" y2="50" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1.2" />
                  <line x1="50" y1="12" x2="50" y2="88" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1.2" />
                  <circle
                    cx="50"
                    cy="50"
                    r="30"
                    fill="rgba(16, 185, 129, 0.08)"
                    stroke="#10b981"
                    strokeWidth="1.6"
                  />
                  <polygon
                    points="50,20 76,68 24,68"
                    fill="rgba(34, 211, 238, 0.14)"
                    stroke="#22d3ee"
                    strokeWidth="1.8"
                  />
                  <circle cx="50" cy="20" r="3" fill="#34d399" />
                  <circle cx="76" cy="68" r="3" fill="#34d399" />
                  <circle cx="24" cy="68" r="3" fill="#34d399" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-200">
              <div className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2">
                <span className="text-emerald-300 font-bold block">Tự Do Tạo 2D</span>
                7 công cụ vẽ, nắn nét & di chuyển hình
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2">
                <span className="text-cyan-300 font-bold block">6 Xưởng Hình Học</span>
                Euler, Compa, Vector, Parabol, Tangram
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {onLaunch2DGuide ? (
                <button
                  type="button"
                  onClick={onLaunch2DGuide}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 hover:border-emerald-400 text-xs font-bold text-emerald-200 cursor-pointer whitespace-nowrap shrink-0"
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
              >
                <PenTool className="w-4 h-4" />
                <span>{isEn ? 'Enter 2D Free Create' : 'Mở Không Gian 2D'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* PORTAL 3: QUÉT ĐỒ VẬT THỰC TẾ → 3D */}
        {onOpenRealScanner && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                  <path d="M18 30 L18 18 L30 18" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                  <path d="M70 18 L82 18 L82 30" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                  <path d="M18 70 L18 82 L30 82" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                  <path d="M70 82 L82 82 L82 70" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                  <polygon
                    points="50,24 72,38 72,62 50,76 28,62 28,38"
                    fill="rgba(34,211,238,0.14)"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  <Scan className="w-4 h-4" />
                  <span>
                    {isEn
                      ? 'MODULE 03 · REAL-WORLD OBJECT SCANNER'
                      : 'PHẦN 03 · HỌC QUA KHÔNG GIAN THỰC TẾ'}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {isEn
                    ? 'Scan Physical Objects → Interactive 3D Models'
                    : 'Dùng Camera Quét Đồ Vật Xung Quanh → Tạo Mô Hình 3D Tương Tác'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Capture any desk item, lab glassware, fan, or tool around you to build an inspectable 3D assembly supporting explode, part isolation, cross-section, and .OBJ export.'
                    : 'Hướng camera vào đồ vật thật xung quanh bạn (cốc thí nghiệm, quạt, kính hiển vi, khối hình...) để chụp và tạo mô hình 3D hoàn chỉnh — hỗ trợ tách lớp, soi chi tiết, mặt cắt và xuất .OBJ.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenRealScanner}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                <Scan className="w-4 h-4" />
                <span>{isEn ? 'Open Camera Scanner' : 'Bật Camera Quét Đồ Vật'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 text-center md:text-right">
                {isEn ? 'Also supports photo upload' : 'Hỗ trợ cả chụp trực tiếp & tải ảnh'}
              </span>
            </div>
          </div>
        )}

        {/* PORTAL 4: BÀN TAY ẢO CỦA BẠN HỌC (KHÔNG GIAN 3D CHUNG 2–4 NGƯỜI) */}
        {onOpenCoop && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                  <circle cx="30" cy="48" r="14" fill="rgba(34,211,238,0.14)" stroke="#22d3ee" strokeWidth="1.8" />
                  <circle cx="70" cy="48" r="14" fill="rgba(245,158,11,0.14)" stroke="#f59e0b" strokeWidth="1.8" />
                  <polygon points="50,30 62,50 50,70 38,50" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1.8" />
                  <line x1="30" y1="34" x2="50" y2="30" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3 2" />
                  <line x1="70" y1="34" x2="50" y2="30" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
                </svg>
              </div>

              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>
                    {isEn
                      ? 'MODULE 04 · SHARED 3D CO-OP HANDS (2–4)'
                      : 'PHẦN 04 · BÀN TAY ẢO CỦA BẠN HỌC (2–4 NGƯỜI)'}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {isEn
                    ? 'Explore Shared 3D Models Live With Classmates'
                    : 'Cùng 2–4 Bạn Học Khám Phá 1 Mô Hình 3D Theo Thời Gian Thực'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Create a synced 3D Co-op room and share an invite into Study Forum groups. Everyone sees each other’s 21-joint 3D hand pointers exploding, rotating, and inspecting parts together.'
                    : 'Tạo phòng 3D chung rồi gửi thẻ mời vào các nhóm Diễn đàn học tập. Từ 2–4 bạn bè cùng tham gia sẽ thấy bàn tay 21 khớp của nhau theo thời gian thực cùng xoay, tách cấu trúc và chỉ chi tiết trên một mô hình chung.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenCoop}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                <Users className="w-4 h-4" />
                <span>{isEn ? 'Create / Join Co-op Room' : 'Tạo Phòng & Mời Diễn Đàn'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 text-center md:text-right">
                {isEn ? 'Live 21-joint WebSocket hand sync' : 'Đồng bộ khung xương tay WebSocket 2–4 bạn'}
              </span>
            </div>
          </div>
        )}

        {/* SECTION 5: COMMAND & GESTURE GUIDE */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                <Hand className="w-4 h-4" />
                <span>{isEn ? 'UNIFIED COMMAND & GESTURE GUIDE' : 'PHẦN 05 · HƯỚNG DẪN ĐIỀU KHIỂN & THAO TÁC'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {isEn
                  ? '5-Gesture 3D Control, Low-Spec Modes & Mouse Fallback'
                  : 'Bộ 5 Cử Chỉ Cầm Nắm 3D, Tối Ưu Máy Yếu & Điều Khiển Chuột'}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'workflow', vi: '5 Cử Chỉ 3D Rõ Ràng', en: '5 Real-Grab Steps', icon: Layers },
                  { id: 'gestures', vi: 'Bảng Cử Chỉ (3D & 2D)', en: 'Gestures (3D & 2D)', icon: Hand },
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500'
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
              {workflowSteps.map((st) => (
                <div
                  key={st.num}
                  className={`rounded-xl border p-3.5 flex flex-col justify-between gap-2 ${st.accent}`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between font-mono text-[10px] font-bold">
                      <span>{st.badge}</span>
                      <span>#{st.num}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">{st.title}</h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {guideTab === 'gestures' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-emerald-300 font-bold">
                  <Hand className="w-4 h-4 shrink-0" />
                  <span>
                    {isEn
                      ? '5 Real-Grab 3D Gestures (Unambiguous & Zero Misfire):'
                      : '5 Cử Chỉ Cầm Nắm 3D Thực Tế (Rõ ràng & Chính xác):'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  {REAL_GRAB_GESTURES.map((g) => (
                    <div
                      key={`hub-rg-${g.id}`}
                      className="rounded-xl bg-slate-950 border border-slate-800 p-3 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700"
                          style={{ color: g.accent }}
                        >
                          {g.fingers}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-300">REAL-GRAB</span>
                      </div>
                      <div className="text-xs font-bold text-white">
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
                  {GESTURE_DEFINITIONS.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-xl bg-slate-950 border border-slate-800 p-2.5 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700"
                          style={{ color: g.accent }}
                        >
                          {g.fingers} {isEn ? 'Fingers' : 'Ngón'}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white">
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
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-cyan-300">
                  <MousePointerClick className="w-4 h-4" />
                  <span>{isEn ? 'Mouse & Touchpad' : 'Chuột & Cảm Ứng 3D/2D'}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Drag to rotate 3D models at smooth speed, scroll to zoom, and click any exploded part to inspect it.'
                    : 'Kéo chuột hoặc vuốt màn hình để xoay mô hình 3D, cuộn để thu phóng và bấm chọn trực tiếp từng bộ phận đã tách.'}
                </p>
              </div>
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <Video className="w-4 h-4" />
                  <span>{isEn ? 'Virtual Pad & 8 Gestures' : 'Bàn Di Ảo & 8 Nút Cử Chỉ'}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {isEn
                    ? 'No webcam? Switch any of the 8 gestures right on the bottom Dock and drag on the 3D Virtual Touch Pad.'
                    : 'Không có Webcam vẫn dùng đầy đủ 8 cử chỉ thông qua thanh nút dưới màn hình và Bàn Di Cử Chỉ 3D Ảo.'}
                </p>
              </div>
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
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
  );
};
